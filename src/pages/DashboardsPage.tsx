import { useTranslation } from 'react-i18next';
import { PageHero } from '../components/PageHero';
import { DASHBOARDS } from '../features/dashboards/dashboards';
import { ShinyEmbed } from '../features/dashboards/ShinyEmbed';
import { useLocalizedText } from '../lib/localized';
import { Layout } from '../main.jsx';

// Lazy-loaded route (see App.tsx). The Shiny apps themselves load later still, per embed.
export default function DashboardsPage() {
  const { t } = useTranslation('dashboards');
  const localize = useLocalizedText();

  return (
    <Layout active="dashboards">
      <PageHero eyebrow={t('page.eyebrow')} title={t('page.title')} lead={t('page.lead')} />
      <div className="ua bg-mint px-5 py-8 sm:px-7 lg:py-14">
        <div className="mx-auto max-w-[1180px] space-y-12">
          {DASHBOARDS.map((dashboard) => {
            const title = localize(dashboard.title);
            const description = localize(dashboard.description);
            return (
              <section key={dashboard.id} aria-labelledby={`dashboard-${dashboard.id}`}>
                <h2 id={`dashboard-${dashboard.id}`} lang={title.lang} className="mb-2 text-2xl text-navy sm:text-3xl">{title.text}</h2>
                <p lang={description.lang} className="mt-0 mb-5 max-w-3xl text-muted">{description.text}</p>
                <ShinyEmbed
                  src={dashboard.src}
                  title={title.text}
                  estimatedSize={dashboard.estimatedSize}
                  staticVersionUrl={dashboard.staticVersionUrl}
                  loadStrategy={dashboard.loadStrategy}
                />
              </section>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
