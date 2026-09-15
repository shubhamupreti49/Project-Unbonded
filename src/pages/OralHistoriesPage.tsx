import { useTranslation } from 'react-i18next';
import { PageHero } from '../components/PageHero';
import { OralHistoryPlayer } from '../features/oral-histories/OralHistoryPlayer';
import { SAMPLE_ORAL_HISTORY } from '../features/oral-histories/sampleOralHistory';
import { Layout } from '../main.jsx';

// Lazy-loaded route (see App.tsx).
export default function OralHistoriesPage() {
  const { t } = useTranslation('oralHistories');

  return (
    <Layout active="oralHistories">
      <PageHero eyebrow={t('page.eyebrow')} title={t('page.title')} lead={t('page.lead')}>
        <p className="mt-6 mb-0 max-w-2xl border-l-4 border-sun pl-4 text-sm text-[#d9eeee]">{t('page.ethics')}</p>
      </PageHero>
      <div className="ua bg-mint px-3 py-8 sm:px-7 lg:py-14">
        <div className="mx-auto max-w-[1180px] space-y-10">
          <OralHistoryPlayer history={SAMPLE_ORAL_HISTORY} />
        </div>
      </div>
    </Layout>
  );
}
