import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentCard } from './DocumentCard';
import { DocumentFilters } from './DocumentFilters';
import type { ArchiveDocument } from './types';
import { useDocumentFilters } from './useDocumentFilters';

type DocumentGalleryProps = {
  documents: ArchiveDocument[];
};

/**
 * Metadata-driven document browser: search box, faceted sidebar and a responsive card grid.
 * Layout is mobile-first — one column with collapsible filters, then a sidebar from `lg`.
 */
export function DocumentGallery({ documents }: DocumentGalleryProps) {
  const { t } = useTranslation('library');
  const { query, setQuery, selection, counts, results, toggle, clearAll, activeCount } = useDocumentFilters(documents);
  const searchId = useId();
  const resultsId = useId();

  return (
    <div className="ua grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
      <DocumentFilters selection={selection} counts={counts} activeCount={activeCount} onToggle={toggle} onClear={clearAll} />

      <section aria-labelledby={resultsId}>
        <form role="search" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor={searchId} className="sr-only">{t('search.label')}</label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('search.placeholder')}
            aria-describedby={resultsId}
            className="m-0 block min-h-12 w-full rounded-lg border border-rule bg-white px-4 text-base text-ink"
          />
        </form>

        <p id={resultsId} className="mt-4 mb-4 text-sm text-muted" aria-live="polite">
          {t('results.summary', { shown: results.length, total: documents.length })}
        </p>

        {results.length > 0 ? (
          <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 md:gap-5">
            {results.map((document) => (
              <li key={document.id}><DocumentCard document={document} /></li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-navy/25 bg-paper px-6 py-10 text-center">
            <h3 className="text-xl text-navy">{t('results.emptyTitle')}</h3>
            <p className="mt-0 text-muted">{t('results.emptyBody')}</p>
            <button type="button" onClick={clearAll} className="min-h-11 rounded-lg bg-navy px-4 font-bold text-white hover:bg-coral">
              {t('filters.clear')}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
