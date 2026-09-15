/**
 * Controlled vocabularies for archive metadata.
 *
 * Records store stable IDs ("sudurpashchim"), never display labels. Labels live in the
 * i18n dictionaries under `vocab.*`, so one record renders correctly in English and Nepali
 * and a spelling change never requires editing data.
 *
 * Keep these lists in sync with the `enum`s in document.schema.json.
 */
export const REGIONS = ['koshi', 'madhesh', 'bagmati', 'gandaki', 'lumbini', 'karnali', 'sudurpashchim', 'national'] as const;

/** Spelling follows the rest of the site ("Haruwa-Charuwa"); variants such as Harawa-Charawa map here. */
export const COMMUNITIES = ['kamaiya', 'haliya', 'haruwa-charuwa', 'kamlari'] as const;

export const DOCUMENT_TYPES = [
  'executive-summary',
  'policy-brief',
  'dataset',
  'econometric-analysis',
  'research-article',
  'report',
  'legal-text',
] as const;

export type RegionId = (typeof REGIONS)[number];
export type CommunityId = (typeof COMMUNITIES)[number];
export type DocumentTypeId = (typeof DOCUMENT_TYPES)[number];

/** Chip colours per community, matching the palette used on the Geography map. */
export const COMMUNITY_STYLES: Record<CommunityId, string> = {
  kamaiya: 'bg-kamaiya/20 text-[#7a4f06] ring-kamaiya/50',
  haliya: 'bg-haliya/15 text-[#4a3690] ring-haliya/40',
  'haruwa-charuwa': 'bg-haruwa/15 text-[#1c6660] ring-haruwa/40',
  kamlari: 'bg-kamlari/15 text-[#a3432c] ring-kamlari/40',
};
