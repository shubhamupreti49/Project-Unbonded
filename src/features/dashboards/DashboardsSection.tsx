import { useTranslation } from 'react-i18next';
import { useLocalizedText } from '../../lib/localized';
import { DASHBOARDS } from './dashboards';
import { ShinyEmbed } from './ShinyEmbed';

/**
 * Published dashboards, shown on the Map & data page (/geography) below the map.
 * The Geography page lazy-loads this only when at least one dashboard has a `src`.
 */
export default function DashboardsSection() {
  const { t } = useTranslation('dashboards');
  const localize = useLocalizedText();

  return (
    <section className="ua bg-mint px-5 pb-14 sm:px-7" aria-labelledby="dashboards-heading">
      <div className="mx-auto max-w-[1180px] space-y-12 border-t border-navy/15 pt-12">
        <div>
          <p className="tw-eyebrow m-0 font-mono text-xs font-bold tracking-widest text-coral uppercase">{t('page.eyebrow')}</p>
          <h2 id="dashboards-heading" className="mt-2 mb-2 text-3xl text-navy sm:text-4xl">{t('page.title')}</h2>
          <p className="m-0 max-w-3xl text-muted">{t('page.lead')}</p>
        </div>
        {DASHBOARDS.filter((dashboard) => dashboard.src).map((dashboard) => {
          const title = localize(dashboard.title);
          const description = localize(dashboard.description);
          return (
            <section key={dashboard.id} aria-labelledby={`dashboard-${dashboard.id}`}>
              <h3 id={`dashboard-${dashboard.id}`} lang={title.lang} className="mb-2 text-2xl text-navy">{title.text}</h3>
              <p lang={description.lang} className="mt-0 mb-5 max-w-3xl text-muted">{description.text}</p>
              <ShinyEmbed src={dashboard.src} title={title.text} estimatedSize={dashboard.estimatedSize} staticVersionUrl={dashboard.staticVersionUrl} loadStrategy={dashboard.loadStrategy} />
            </section>
          );
        })}
      </div>
    </section>
  );
}
