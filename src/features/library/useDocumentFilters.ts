import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ArchiveDocument } from './types';
import { COMMUNITIES, DOCUMENT_TYPES, REGIONS } from './vocabulary';

/**
 * Faceted filtering for the document library, stored in the URL.
 *
 * Keeping state in the query string (`/library?community=haliya&type=report`) means a
 * filtered view can be bookmarked, shared over Viber/WhatsApp, and linked from the home
 * page audience cards, and the browser back button behaves as expected.
 *
 * Semantics: values within one facet are OR-ed (Haliya *or* Kamaiya), facets are AND-ed
 * (Haliya *and* Report).
 */
export const FACETS = [
  { id: 'region', param: 'region', options: REGIONS, valuesOf: (doc: ArchiveDocument) => doc.regions },
  { id: 'community', param: 'community', options: COMMUNITIES, valuesOf: (doc: ArchiveDocument) => doc.communities },
  { id: 'documentType', param: 'type', options: DOCUMENT_TYPES, valuesOf: (doc: ArchiveDocument) => [doc.documentType] },
] as const;

export type FacetId = (typeof FACETS)[number]['id'];
type Selection = Record<FacetId, ReadonlySet<string>>;

const SEARCH_PARAM = 'q';

function matchesFacets(doc: ArchiveDocument, selection: Selection, skip?: FacetId) {
  return FACETS.every((facet) => {
    if (facet.id === skip) return true;
    const selected = selection[facet.id];
    return selected.size === 0 || facet.valuesOf(doc).some((value) => selected.has(value));
  });
}

function matchesSearch(doc: ArchiveDocument, query: string) {
  if (!query) return true;
  const haystack = [doc.title.en, doc.title.ne, doc.author].filter(Boolean).join(' ').toLocaleLowerCase();
  return haystack.includes(query.toLocaleLowerCase());
}

export function useDocumentFilters(documents: ArchiveDocument[]) {
  const [params, setParams] = useSearchParams();
  const query = params.get(SEARCH_PARAM)?.trim() ?? '';

  // Read selections from the URL, ignoring values outside the controlled vocabulary.
  const selection = useMemo(() => {
    const result = {} as Record<FacetId, Set<string>>;
    for (const facet of FACETS) {
      const allowed = new Set<string>(facet.options);
      result[facet.id] = new Set(params.getAll(facet.param).filter((value) => allowed.has(value)));
    }
    return result as Selection;
  }, [params]);

  const searched = useMemo(() => documents.filter((doc) => matchesSearch(doc, query)), [documents, query]);

  const results = useMemo(
    () => searched
      .filter((doc) => matchesFacets(doc, selection))
      .sort((a, b) => (b.publicationYear ?? 0) - (a.publicationYear ?? 0)),
    [searched, selection],
  );

  /**
   * Count for each option = documents that would match if that option were ticked, given
   * every *other* active facet. Options with a zero count are shown disabled, so readers
   * never click into an empty result.
   */
  const counts = useMemo(() => {
    const result = {} as Record<FacetId, Map<string, number>>;
    for (const facet of FACETS) {
      const tally = new Map<string, number>();
      for (const doc of searched) {
        if (!matchesFacets(doc, selection, facet.id)) continue;
        for (const value of new Set<string>(facet.valuesOf(doc))) tally.set(value, (tally.get(value) ?? 0) + 1);
      }
      result[facet.id] = tally;
    }
    return result;
  }, [searched, selection]);

  const toggle = useCallback((facetId: FacetId, value: string) => {
    const facet = FACETS.find((entry) => entry.id === facetId);
    if (!facet) return;
    setParams((current) => {
      const next = new URLSearchParams(current);
      const values = next.getAll(facet.param);
      next.delete(facet.param);
      const updated = values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
      updated.forEach((entry) => next.append(facet.param, entry));
      return next;
    }, { replace: true });
  }, [setParams]);

  const setQuery = useCallback((value: string) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(SEARCH_PARAM, value); else next.delete(SEARCH_PARAM);
      return next;
    }, { replace: true });
  }, [setParams]);

  const clearAll = useCallback(() => setParams({}, { replace: true }), [setParams]);

  const activeCount = FACETS.reduce((total, facet) => total + selection[facet.id].size, 0);

  return { query: params.get(SEARCH_PARAM) ?? '', setQuery, selection, counts, results, toggle, clearAll, activeCount };
}
