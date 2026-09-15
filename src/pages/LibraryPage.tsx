import { useTranslation } from 'react-i18next';
import { PageHero } from '../components/PageHero';
import { getArchiveDocuments } from '../features/library/archiveDocuments';
import { DocumentGallery } from '../features/library/DocumentGallery';
import { Layout } from '../main.jsx';

// Lazy-loaded route (see App.tsx): this page, its components and documents.json form one chunk.
export default function LibraryPage() {
  const { t } = useTranslation('library');

  return (
    <Layout active="library">
      <PageHero eyebrow={t('page.eyebrow')} title={t('page.title')} lead={t('page.lead')} />
      <section className="ua bg-mint px-5 py-8 sm:px-7 lg:py-14">
        <div className="mx-auto max-w-[1180px]">
          <DocumentGallery documents={getArchiveDocuments()} />
        </div>
      </section>
    </Layout>
  );
}
