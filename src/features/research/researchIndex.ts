import { data } from '../../../data/sources.js';
import { getArchiveDocuments } from '../library/archiveDocuments';
import type { ArchiveDocument } from '../library/types';

/**
 * One searchable collection for the Research tab.
 *
 * Every paper is a source record in data/sources.js. Papers the archive also holds in
 * features/library/documents.json (linked by `sourceRecordId`) gain a document type and a
 * hosted file with its size, so a reader sees "Open PDF · 6.2 MB" before downloading.
 */
export type Source = (typeof data.sources)[number];

export type ResearchRecord = {
  source: Source;
  document?: ArchiveDocument;
  /** First year of the publication decade, e.g. "2010"; null when undated. */
  decade: string | null;
  pdf: { url: string; sizeBytes?: number } | null;
  /** The publisher's page or DOI, when it is not simply the PDF above. */
  originalUrl: string | null;
};

const isPdfUrl = (url?: string | null) => Boolean(url && /\.pdf($|[?#])/i.test(url));

const documentsBySource = new Map(getArchiveDocuments().filter((doc) => doc.sourceRecordId).map((doc) => [doc.sourceRecordId as string, doc]));

export const RESEARCH_RECORDS: ResearchRecord[] = data.sources.map((source) => {
  const document = documentsBySource.get(source.id);
  const hostedFile = document?.file?.format === 'pdf' ? { url: document.file.url, sizeBytes: document.file.sizeBytes } : null;
  const pdf = hostedFile ?? (isPdfUrl(source.url) ? { url: source.url } : null);
  const original = source.url || document?.externalUrl || null;
  return {
    source,
    document,
    decade: source.year ? String(Math.floor(source.year / 10) * 10) : null,
    pdf,
    originalUrl: original && original !== pdf?.url ? original : null,
  };
});

// Facet options in a stable reading order; any new value in the data is appended rather than lost.
const ordered = (preferred: string[], values: string[]) => [...preferred.filter((value) => values.includes(value)), ...[...new Set(values)].filter((value) => !preferred.includes(value)).sort()];
const all = (pick: (source: Source) => string[] | string | undefined | null) => data.sources.flatMap((source) => [pick(source) ?? []].flat()).filter(Boolean) as string[];
const byFrequency = (values: string[]) => [...new Set(values)].sort((a, b) => values.filter((v) => v === b).length - values.filter((v) => v === a).length || a.localeCompare(b));

export const SYSTEMS = ordered(['Kamaiya', 'Haliya', 'Haruwa-Charuwa', 'Kamlari', 'Child labour', 'Brick industry', 'Cross-system / general'], all((s) => s.systems));
export const THEMES = byFrequency(all((s) => s.themes));
export const METHODS = ordered(['Survey / quantitative', 'Qualitative / mixed methods', 'Assessment / evaluation', 'Law / policy document', 'Descriptive / advocacy', 'Unspecified'], all((s) => s.methodType));
export const DECADES = [...new Set(RESEARCH_RECORDS.map((record) => record.decade).filter(Boolean) as string[])].sort().reverse();

/** Labour systems that have a colour on the map, keyed to the library vocabulary ids. */
export const SYSTEM_COMMUNITY: Record<string, 'kamaiya' | 'haliya' | 'haruwa-charuwa' | 'kamlari'> = {
  Kamaiya: 'kamaiya',
  Haliya: 'haliya',
  'Haruwa-Charuwa': 'haruwa-charuwa',
  Kamlari: 'kamlari',
};

/* ── Search ──────────────────────────────────────────────────────────────────────────────
 * Every word must appear somewhere in the record ("kamaiya land" finds papers mentioning
 * both). Matches in the title count most, then author, categories, place, then the text.
 * Field names are never searched, so typing "title" or "url" no longer matches everything.
 */
const STOPWORDS = new Set(['a', 'an', 'and', 'the', 'of', 'in', 'on', 'for', 'to', 'by', 'with', 'at', 'from', 'or']);

// Spellings that differ between sources for the same system or term.
const VARIANTS: Record<string, string[]> = {
  haliya: ['halia'], halia: ['haliya'],
  haruwa: ['harawa'], harawa: ['haruwa'],
  charuwa: ['charawa'], charawa: ['charuwa'],
  kamlari: ['kamlahari'], kamlahari: ['kamlari'],
  labour: ['labor'], labor: ['labour'],
};

export function tokenize(text: string): string[] {
  return [...text.toLocaleLowerCase().matchAll(/[\p{L}\p{M}\p{N}]+/gu)].map((match) => match[0]).filter((token) => !STOPWORDS.has(token));
}

function formsOf(token: string) {
  const forms = new Set([token, ...(VARIANTS[token] ?? [])]);
  if (token.length > 4 && token.endsWith('s')) forms.add(token.slice(0, -1));
  return [...forms];
}

type IndexedRecord = { record: ResearchRecord; fields: Array<[weight: number, text: string]>; title: string };

/** `label` translates category values, so a Nepali reader can type "कमैया" or "पुनर्स्थापना". */
export function buildSearchIndex(records: ResearchRecord[], label: (value: string) => string): IndexedRecord[] {
  const join = (...parts: Array<string | string[] | null | undefined>) => parts.flat().filter(Boolean).join(' ').toLocaleLowerCase();
  return records.map((record) => {
    const { source, document } = record;
    const categories = [...(source.systems ?? []), ...(source.themes ?? []), source.methodType].filter(Boolean) as string[];
    return {
      record,
      title: source.title.toLocaleLowerCase(),
      fields: [
        [6, join(source.title, document?.title.ne)],
        [4, join(source.author)],
        [3, join(categories, categories.map(label))],
        [2, join(source.geography, source.population, document?.geographyNote)],
        [1, join(source.claims, source.claim, source.topicSentence, source.methodology, source.sampleSize, source.gap, source.citation, document?.summary?.en)],
      ],
    };
  });
}

/** Returns matching records with a relevance score; an empty query matches everything with score 0. */
export function searchIndex(index: IndexedRecord[], query: string): Array<{ record: ResearchRecord; score: number }> {
  const tokens = tokenize(query);
  if (!tokens.length) return index.map(({ record }) => ({ record, score: 0 }));
  const phrase = tokens.join(' ');
  return index.flatMap(({ record, fields, title }) => {
    let score = 0;
    for (const token of tokens) {
      const forms = formsOf(token);
      const best = Math.max(0, ...fields.filter(([, text]) => forms.some((form) => text.includes(form))).map(([weight]) => weight));
      if (!best) return [];
      score += best;
    }
    if (tokens.length > 1 && tokenize(title).join(' ').includes(phrase)) score += 5;
    return [{ record, score }];
  });
}
