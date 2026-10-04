/*
 * Page addresses, titles and descriptions in one place.
 *
 * Plain JavaScript on purpose: the browser uses it to set the tab title as a reader moves
 * between pages (components/RouteMeta.tsx), and the build uses it to write a real HTML file
 * for every page with the same title, description and link-preview tags
 * (scripts/prerender.mjs). Search engines and Facebook/WhatsApp/Viber previews read those
 * files without running any JavaScript.
 */
export const SITE_URL = 'https://unbondedarchive.org';
export const SITE_NAME = 'Unbonded Archive';
export const SHARE_IMAGE = `${SITE_URL}/og-image.png`;

/** Date the catalogue in data/sources.js was last revised. Update it whenever records change. */
export const CATALOGUE_UPDATED = '2026-10-03';

/** Published copies of the full catalogue (written at build time by scripts/prerender.mjs). */
export const CATALOGUE_FILES = {
  csv: '/data/unbonded-archive-catalogue.csv',
  json: '/data/unbonded-archive-catalogue.json',
  readme: '/data/README.txt',
};

export const DEFAULT_DESCRIPTION = 'Research, legal texts, data and maps on the Kamaiya, Haliya, Haruwa-Charuwa and Kamlari bonded-labour systems in Nepal and on life after abolition.';

/** Every page with its own address. `{records}` is replaced with the number of catalogued records. */
export const PAGES = [
  { path: '/', title: `${SITE_NAME}: Nepal’s bonded-labour evidence repository`, heading: 'Tracing the evidence of freedom after abolition', description: DEFAULT_DESCRIPTION },
  { path: '/research', title: 'Research collection', heading: 'Research', description: 'Search {records} catalogued papers, reports, legal texts and datasets on bonded labour in Nepal by labour system, theme, method and decade.' },
  { path: '/timeline', title: 'History and policy timeline', heading: 'History & policy timeline', description: 'Laws, abolition dates and policy milestones for Nepal’s bonded-labour systems, with the publication record of the research collection.' },
  { path: '/geography', title: 'Map of documented districts', heading: 'Geographic coverage', description: 'District map of Nepal showing where catalogued sources document the Kamaiya, Haliya and Haruwa-Charuwa systems, with district-level rehabilitation figures.' },
  { path: '/articles', title: 'Articles', heading: 'Articles', description: 'Plain-language articles by volunteers on bonded labour, rehabilitation and life after liberation in Nepal, each linked to the research it discusses.' },
  { path: '/write-for-us', title: 'Write for us', heading: 'Write for Unbonded Archive', description: 'How to write for Unbonded Archive: who can contribute, the editorial guidelines and how to submit an article.' },
  { path: '/how-to-use', title: 'How to use the repository', heading: 'How to use the repository', description: 'How the catalogue is built, what each record contains, and the limits to keep in mind when using the evidence.' },
  { path: '/contacts', title: 'Organisation contacts', heading: 'Organisation contacts', description: 'Public contact details for organisations whose work and publications appear in the repository.' },
  { path: '/researchers-phase-one', title: 'Researchers: Phase One', heading: 'Researchers: Phase One', description: 'The student researchers who built the first phase of the Unbonded Archive by finding, reading and cataloguing its source records.' },
];

export const recordPath = id => `/source/${encodeURIComponent(id)}`;
export const articlePath = slug => `/articles/${encodeURIComponent(slug)}`;
export const pageTitle = title => (title.startsWith(SITE_NAME) ? title : `${title} | ${SITE_NAME}`);
/** GitHub Pages serves each page from a folder (research/index.html), so its canonical address ends in "/". */
export const canonicalUrl = path => `${SITE_URL}${path === '/' ? '/' : path.replace(/\/?$/, '/')}`;

const clip = (text, max) => {
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max * 0.6))}…`;
};

/** Title and description for a source record page. */
export function recordMeta(source) {
  const year = source.year || 'n.d.';
  const lead = `${source.author} (${year}).`;
  const body = source.claims?.[0] || `Catalogue record with the method, sample, geography and a link to the original ${source.methodType === 'Law / policy document' ? 'document' : 'source'}.`;
  return {
    path: recordPath(source.id),
    title: clip(source.title, 90),
    heading: source.title,
    description: clip(`${lead} ${body}`, 160),
  };
}

/** Title and description for a volunteer article page. */
export function articleMeta(article) {
  return {
    path: articlePath(article.slug),
    title: clip(article.title, 90),
    heading: article.title,
    description: clip(article.summary || `Article by ${article.author} on Unbonded Archive.`, 160),
  };
}

/** Resolves a static page's description placeholders. */
export function staticMeta(page, sources) {
  return { ...page, description: page.description.replace('{records}', String(sources.length)) };
}
