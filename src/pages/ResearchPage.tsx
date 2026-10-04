import { useCallback, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { OriginalLanguageNotice } from '../components/OriginalLanguageNotice';
import { PageHero } from '../components/PageHero';
import { useDataLabel } from '../i18n/useDataLabel';
import { localizeDigits } from '../lib/format';
import { ResearchCard } from '../features/research/ResearchCard';
import { ResearchFilters } from '../features/research/ResearchFilters';
import { FACETS, useResearchFilters, type FacetId, type SortOrder } from '../features/research/useResearchFilters';
import { Layout } from '../main.jsx';

/**
 * Research: the single place to find papers. It merges the former Library and Source
 * catalogue tabs; /library and /catalogue links redirect here with their filters mapped
 * (see features/research/legacyRedirects.tsx). Lazy-loaded route (see App.tsx).
 */
export default function ResearchPage() {
  const { t, i18n } = useTranslation('research');
  const dataLabel = useDataLabel();
  const { query, hasQuery, setQuery, clearQuery, sort, setSort, selection, counts, results, toggle, clearAll, activeCount, total } = useResearchFilters();
  const searchId = useId();
  const resultsId = useId();
  const sortId = useId();

  const optionLabel = useCallback((facet: FacetId, value: string) => (
    facet === 'decade' ? localizeDigits(t('filters.decadeLabel', { decade: value }), i18n.language) : dataLabel(value)
  ), [dataLabel, i18n.language, t]);

  const activeChips = FACETS.flatMap((facet) => [...selection[facet.id]].map((value) => ({ facet: facet.id, value })));

  return (
    <Layout active="research">
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} lead={t('hero.lead')}>
        {/* Results update as the reader types; submitting jumps to them and closes the phone keyboard. */}
        <form
          role="search"
          className="mt-7 flex max-w-2xl flex-col gap-2 sm:flex-row sm:gap-0"
          onSubmit={(event) => {
            event.preventDefault();
            event.currentTarget.querySelector('input')?.blur();
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            document.getElementById(resultsId)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
          }}
        >
          <label htmlFor={searchId} className="sr-only">{t('search.label')}</label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('search.placeholder')}
            aria-describedby={resultsId}
            className="m-0 block min-h-13 w-full grow rounded-lg border-0 bg-white px-4 text-base text-ink sm:rounded-r-none"
          />
          <button type="submit" className="min-h-13 shrink-0 rounded-lg bg-sun px-6 font-bold text-night hover:bg-[#ffd77f] sm:rounded-l-none">{t('search.button')}</button>
        </form>
        <p className="mt-3 mb-0 text-sm text-[#b9d3d6]">{t('search.hint')}</p>
      </PageHero>

      <section className="ua bg-mint px-5 py-8 sm:px-7 lg:py-12">
        <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
          <ResearchFilters selection={selection} counts={counts} activeCount={activeCount} optionLabel={optionLabel} onToggle={toggle} onClear={clearAll} />

          <section aria-labelledby={resultsId} className="min-w-0 scroll-mt-28">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p id={resultsId} className="m-0 text-sm font-bold text-navy" aria-live="polite">
                {t('results.summary', { shown: results.length, total })}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor={sortId} className="text-sm text-muted">{t('sort.label')}</label>
                <select
                  id={sortId}
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortOrder)}
                  className="m-0 min-h-11 w-auto rounded-lg border border-rule bg-white px-3 text-sm font-bold text-navy sm:min-h-10"
                >
                  {hasQuery && <option value="relevance">{t('sort.relevance')}</option>}
                  <option value="newest">{t('sort.newest')}</option>
                  <option value="oldest">{t('sort.oldest')}</option>
                </select>
              </div>
            </div>

            {(hasQuery || activeChips.length > 0) && (
              <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0" aria-label={t('filters.active')}>
                {hasQuery && (
                  <li><button type="button" onClick={clearQuery} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-aqua bg-white px-3 text-sm font-bold text-navy hover:border-navy">
                    {t('filters.searchChip', { query: query.trim() })}<span aria-hidden="true">×</span><span className="sr-only">{t('filters.remove')}</span>
                  </button></li>
                )}
                {activeChips.map(({ facet, value }) => (
                  <li key={`${facet}-${value}`}><button type="button" onClick={() => toggle(facet, value)} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-aqua bg-white px-3 text-sm font-bold text-navy hover:border-navy">
                    {optionLabel(facet, value)}<span aria-hidden="true">×</span><span className="sr-only">{t('filters.remove')}</span>
                  </button></li>
                ))}
              </ul>
            )}

            <div className="mt-5"><OriginalLanguageNotice /></div>

            {results.length > 0 ? (
              <ol className="m-0 grid list-none gap-4 p-0">
                {results.map((record) => <li key={record.source.id}><ResearchCard record={record} /></li>)}
              </ol>
            ) : (
              <div className="rounded-2xl border border-dashed border-navy/25 bg-paper px-6 py-10 text-center">
                <h3 className="text-xl text-navy">{t('results.emptyTitle')}</h3>
                <p className="mx-auto mt-0 max-w-md text-muted">{t('results.emptyBody')}</p>
                <button type="button" onClick={clearAll} className="min-h-11 rounded-lg bg-navy px-4 font-bold text-white hover:bg-coral">
                  {t('results.showAll')}
                </button>
              </div>
            )}

            <p className="mt-8 mb-0 rounded-lg border-l-4 border-coral bg-[#fff2ed] px-4 py-3 text-sm text-ink">
              <b>{t('note.label')}</b> {t('note.text')}
            </p>
          </section>
        </div>
      </section>
    </Layout>
  );
}
