import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useDataLabel } from '../../i18n/useDataLabel';
import { DECADES, METHODS, RESEARCH_RECORDS, SYSTEMS, THEMES, buildSearchIndex, searchIndex, type ResearchRecord } from './researchIndex';

/**
 * Search, filters and sort for /research, all stored in the URL
 * (`/research?q=land&system=Kamaiya&decade=2010`), so a filtered view can be bookmarked,
 * shared over Viber/WhatsApp and linked from the home page. Values within one filter are
 * OR-ed (Kamaiya *or* Haliya); different filters are AND-ed (Kamaiya *and* 2010s).
 */
export const FACETS = [
  { id: 'system', options: SYSTEMS, valuesOf: (record: ResearchRecord) => record.source.systems ?? [] },
  { id: 'theme', options: THEMES, valuesOf: (record: ResearchRecord) => record.source.themes ?? [] },
  { id: 'method', options: METHODS, valuesOf: (record: ResearchRecord) => (record.source.methodType ? [record.source.methodType] : []) },
  { id: 'decade', options: DECADES, valuesOf: (record: ResearchRecord) => (record.decade ? [record.decade] : []) },
  // Newly catalogued records carry bibliographic details first; their findings are added once someone has read them.
  { id: 'findings', options: ['recorded', 'pending'], valuesOf: (record: ResearchRecord) => [record.source.claims?.length ? 'recorded' : 'pending'] },
] as const;

export type FacetId = (typeof FACETS)[number]['id'];
export type SortOrder = 'relevance' | 'newest' | 'oldest';
type Selection = Record<FacetId, ReadonlySet<string>>;

function matchesFacets(record: ResearchRecord, selection: Selection, skip?: FacetId) {
  return FACETS.every((facet) => {
    if (facet.id === skip) return true;
    const selected = selection[facet.id];
    return selected.size === 0 || facet.valuesOf(record).some((value) => selected.has(value));
  });
}

export function useResearchFilters() {
  const { i18n } = useTranslation();
  const dataLabel = useDataLabel();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const hasQuery = query.trim().length > 0;
  const requestedSort = params.get('sort');
  // Best match only makes sense with a query; otherwise newest papers come first.
  const sort: SortOrder = requestedSort === 'newest' || requestedSort === 'oldest' ? requestedSort : hasQuery ? 'relevance' : 'newest';

  // Rebuilt when the language changes, so translated category names are searchable.
  const index = useMemo(() => buildSearchIndex(RESEARCH_RECORDS, dataLabel), [i18n.resolvedLanguage]);

  const selection = useMemo(() => {
    const result = {} as Record<FacetId, Set<string>>;
    for (const facet of FACETS) {
      const allowed = new Set<string>(facet.options);
      result[facet.id] = new Set(params.getAll(facet.id).filter((value) => allowed.has(value)));
    }
    return result as Selection;
  }, [params]);

  const searched = useMemo(() => searchIndex(index, query), [index, query]);

  const results = useMemo(() => {
    const year = (record: ResearchRecord) => record.source.year ?? 0;
    const order = {
      relevance: (a: { record: ResearchRecord; score: number }, b: { record: ResearchRecord; score: number }) => b.score - a.score || year(b.record) - year(a.record),
      newest: (a: { record: ResearchRecord }, b: { record: ResearchRecord }) => year(b.record) - year(a.record),
      oldest: (a: { record: ResearchRecord }, b: { record: ResearchRecord }) => (year(a.record) || 9999) - (year(b.record) || 9999),
    }[sort];
    return searched.filter(({ record }) => matchesFacets(record, selection)).sort(order).map(({ record }) => record);
  }, [searched, selection, sort]);

  /** Count per option = papers that would show if it were ticked, given every other active filter. */
  const counts = useMemo(() => {
    const result = {} as Record<FacetId, Map<string, number>>;
    for (const facet of FACETS) {
      const tally = new Map<string, number>();
      for (const { record } of searched) {
        if (!matchesFacets(record, selection, facet.id)) continue;
        for (const value of new Set<string>(facet.valuesOf(record))) tally.set(value, (tally.get(value) ?? 0) + 1);
      }
      result[facet.id] = tally;
    }
    return result;
  }, [searched, selection]);

  const update = useCallback((mutate: (next: URLSearchParams) => void) => {
    setParams((current) => { const next = new URLSearchParams(current); mutate(next); return next; }, { replace: true });
  }, [setParams]);

  const toggle = useCallback((facet: FacetId, value: string) => update((next) => {
    const values = next.getAll(facet);
    next.delete(facet);
    (values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value]).forEach((entry) => next.append(facet, entry));
  }), [update]);

  const setQuery = useCallback((value: string) => update((next) => { if (value) next.set('q', value); else next.delete('q'); }), [update]);
  const setSort = useCallback((value: SortOrder) => update((next) => next.set('sort', value)), [update]);
  const clearQuery = useCallback(() => update((next) => next.delete('q')), [update]);
  const clearAll = useCallback(() => setParams({}, { replace: true }), [setParams]);

  const activeCount = FACETS.reduce((total, facet) => total + selection[facet.id].size, 0);

  return { query, hasQuery, setQuery, clearQuery, sort, setSort, selection, counts, results, toggle, clearAll, activeCount, total: RESEARCH_RECORDS.length };
}
