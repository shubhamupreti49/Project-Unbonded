import collection from './documents.json';
import type { ArchiveCollection, ArchiveDocument } from './types';
import { COMMUNITIES, DOCUMENT_TYPES, REGIONS } from './vocabulary';

/*
 * The JSON is imported (not fetched) so it ships inside the lazily loaded Library chunk:
 * one request, compressed together with the component code, and cached with it.
 *
 * SCALING: once the archive passes a few hundred records (~150 KB of JSON), move the file
 * to /public/data/documents.json and fetch it instead, so metadata updates don't
 * invalidate the cached JavaScript. Past a few thousand, split it per community or
 * pre-build a search index.
 */
const documents = (collection as ArchiveCollection).documents;

// Development-only guard: flags metadata that doesn't match the controlled vocabularies
// (e.g. a typo like "sudurpaschim") without adding validation code to the production bundle.
if (import.meta.env.DEV) {
  const allowed = { regions: new Set<string>(REGIONS), communities: new Set<string>(COMMUNITIES), types: new Set<string>(DOCUMENT_TYPES) };
  for (const doc of documents) {
    const problems = [
      ...doc.regions.filter((value) => !allowed.regions.has(value)).map((value) => `region "${value}"`),
      ...doc.communities.filter((value) => !allowed.communities.has(value)).map((value) => `community "${value}"`),
      ...(allowed.types.has(doc.documentType) ? [] : [`documentType "${doc.documentType}"`]),
    ];
    if (problems.length) console.warn(`[archive] ${doc.id} has unknown ${problems.join(', ')}`);
  }
}

export function getArchiveDocuments(): ArchiveDocument[] {
  return documents;
}
