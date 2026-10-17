/*
 * Runs after `vite build`. The site is a single-page app, so the built index.html is an empty
 * shell that only fills in once JavaScript runs. Search engines, link previews on
 * Facebook/WhatsApp/Viber, and readers on slow connections all see that empty shell.
 *
 * This script writes a real HTML file for every page (dist/research/index.html,
 * dist/source/SRC-013/index.html, …), each with its own title, description, canonical
 * address, link-preview tags and a plain-HTML copy of the page's main content. The app still
 * loads on top and replaces that content, so readers see no difference.
 *
 * It also writes sitemap.xml, robots.txt, 404.html and the downloadable catalogue
 * (data/unbonded-archive-catalogue.csv and .json, with a README field guide).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import { data } from '../data/sources.js';
import {
  CATALOGUE_FILES, CATALOGUE_UPDATED, PAGES, SHARE_IMAGE, SITE_NAME, SITE_URL,
  articleMeta, articlePath, canonicalUrl, pageTitle, recordMeta, recordPath, staticMeta,
} from '../src/seo/site.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const sources = data.sources;

const esc = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const yearOf = (source) => source.year || 'n.d.';

/* ── Volunteer articles (same front-matter format as src/features/articles/articles.ts) ── */
const articleDir = path.join(root, 'src/content/articles');
const articles = fs.readdirSync(articleDir)
  .filter((file) => file.endsWith('.md') && !file.startsWith('_') && file !== 'README.md')
  .map((file) => {
    const raw = fs.readFileSync(path.join(articleDir, file), 'utf8');
    const match = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
    const meta = {};
    for (const line of (match?.[1] ?? '').split(/\r?\n/)) {
      const pair = /^([A-Za-z][\w-]*)\s*:\s*(.*)$/.exec(line.trim());
      if (pair) meta[pair[1]] = pair[2].trim().replace(/^(["'])(.*)\1$/, '$2');
    }
    return { slug: file.replace(/\.md$/, ''), title: meta.title || file, author: meta.author || '', date: meta.date || '', summary: meta.summary || '', language: meta.language === 'ne' ? 'ne' : 'en', body: (match?.[2] ?? raw).trim() };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

/* ── Page shell ───────────────────────────────────────────────────────────────────────── */
function headTags({ title, description, path: pagePath, type = 'website', jsonLd, noindex = false }) {
  const fullTitle = pageTitle(title);
  const url = canonicalUrl(pagePath);
  return [
    `<title>${esc(fullTitle)}</title>`,
    `<meta name="description" content="${esc(description)}"/>`,
    noindex ? '<meta name="robots" content="noindex"/>' : `<link rel="canonical" href="${esc(url)}"/>`,
    `<meta property="og:site_name" content="${SITE_NAME}"/>`,
    `<meta property="og:type" content="${type}"/>`,
    `<meta property="og:title" content="${esc(fullTitle)}"/>`,
    `<meta property="og:description" content="${esc(description)}"/>`,
    `<meta property="og:url" content="${esc(url)}"/>`,
    `<meta property="og:image" content="${SHARE_IMAGE}"/>`,
    '<meta property="og:image:width" content="1200"/>',
    '<meta property="og:image:height" content="630"/>',
    `<meta property="og:image:alt" content="${SITE_NAME}: Nepal’s bonded-labour evidence repository"/>`,
    '<meta name="twitter:card" content="summary_large_image"/>',
    `<meta name="twitter:title" content="${esc(fullTitle)}"/>`,
    `<meta name="twitter:description" content="${esc(description)}"/>`,
    `<meta name="twitter:image" content="${SHARE_IMAGE}"/>`,
    jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : '',
  ].join('');
}

const NAV = [['/', SITE_NAME], ['/research', 'Research'], ['/timeline', 'Timeline'], ['/geography', 'Map & data'], ['/articles', 'Articles'], ['/how-to-use', 'How to use']];
const nav = `<nav aria-label="Site"><p>${NAV.map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join(' · ')}</p></nav>`;

function writePage(pagePath, meta, body, extra = {}) {
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '')
    .replace('</head>', `${headTags({ ...meta, path: pagePath, ...extra })}</head>`)
    .replace('<div id="root"></div>', `<div id="root"><div class="prerender">${nav}<main>${body}</main></div></div>`);
  const file = pagePath === '/' ? path.join(dist, 'index.html') : path.join(dist, pagePath, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

/* ── Page bodies ──────────────────────────────────────────────────────────────────────── */
const eventSource = (source) => {
  const record = source.record && sources.find((entry) => entry.id === source.record);
  if (record) return `<a href="${recordPath(record.id)}">${esc(record.title.split(':')[0].trim())}</a>${record.year && record.title.includes(String(record.year)) ? '' : ` (${esc(yearOf(record))})`}`;
  return source.url ? `<a href="${esc(source.url)}">${esc(source.label)}</a>` : esc(source.label);
};
const recordLink = (source) => `<li><a href="${recordPath(source.id)}">${esc(source.title)}</a>. ${esc(source.author)}, ${esc(yearOf(source))}.</li>`;
const byNewest = [...sources].sort((a, b) => (b.year || 0) - (a.year || 0));
const years = sources.map((source) => source.year).filter(Boolean);

function staticBody(page) {
  const intro = `<h1>${esc(page.heading)}</h1><p>${esc(page.description)}</p>`;
  switch (page.path) {
    case '/':
      return `${intro}<h2>Browse by labour system</h2><ul>${['Kamaiya', 'Haliya', 'Haruwa-Charuwa', 'Kamlari'].map((system) => `<li><a href="/research?system=${encodeURIComponent(system)}">${system}</a></li>`).join('')}</ul><p><a href="/research">Search all ${sources.length} catalogued records</a>.</p>`;
    case '/research':
      return `${intro}<p>Download the full catalogue: <a href="${CATALOGUE_FILES.csv}">CSV</a> · <a href="${CATALOGUE_FILES.json}">JSON</a> · <a href="${CATALOGUE_FILES.readme}">field guide</a>. Updated ${CATALOGUE_UPDATED}.</p><h2>All records</h2><ol>${byNewest.map(recordLink).join('')}</ol>`;
    case '/timeline':
      return `${intro}<ol>${[...data.events].sort((a, b) => a.date.localeCompare(b.date)).map((event) => `<li id="${esc(event.id)}"><b>${esc(event.date)}: ${esc(event.title)}.</b> ${esc(event.text)} Sources: ${event.sources.map(eventSource).join('; ')}.</li>`).join('')}</ol>`;
    case '/articles':
      return `${intro}${articles.length ? `<ul>${articles.map((article) => `<li><a href="${articlePath(article.slug)}">${esc(article.title)}</a>${article.author ? `, by ${esc(article.author)}` : ''}</li>`).join('')}</ul>` : '<p>The first articles are on their way.</p>'}`;
    default:
      return intro;
  }
}

function recordBody(source) {
  const details = [
    ['Study population', source.population], ['Geography', source.geography], ['Sample size', source.sampleSize],
    ['Method', [source.methodType, source.methodology].filter(Boolean).join(': ')],
    ['Labour system', (source.systems ?? []).join(', ')], ['Themes', (source.themes ?? []).join(', ')],
  ].filter(([, value]) => value && String(value).trim());
  const findings = source.claims?.length
    ? `<ul>${source.claims.map((claim) => `<li>${esc(claim)}</li>`).join('')}</ul>`
    : '<p>Findings have not yet been recorded for this source. Read the original before relying on it.</p>';
  return `<p>${esc(source.id)} · ${esc(source.status)}</p><h1 lang="en">${esc(source.title)}</h1><p>${esc(source.author)} · ${esc(yearOf(source))}</p>`
    + (source.url ? `<p><a href="${esc(source.url)}">View the original source</a></p>` : '<p>No stable link to the original is recorded.</p>')
    + (details.length ? `<h2>Record details</h2><dl>${details.map(([label, value]) => `<dt>${label}</dt><dd>${esc(value)}</dd>`).join('')}</dl>` : '')
    + `<h2>Recorded findings</h2>${findings}`
    + (source.gap ? `<h2>Repository note</h2><p>${esc(source.gap)}</p>` : '')
    + (source.citation ? `<h2>Citation</h2><p>${esc(source.citation)}</p>` : '')
    + `<p><a href="/research">Back to Research</a></p>`;
}

function articleBody(article) {
  // Raw HTML is dropped, as in the app (which sanitises with DOMPurify); old #/ links are rewritten.
  const markdown = article.body.replace(/<[^>]*>/g, '').replace(/\]\(#\/source\?id=([^)\s]+)\)/g, '](/source/$1)').replace(/\]\(#(\/[^)\s]*)\)/g, ']($1)');
  return `<article lang="${article.language}"><h1>${esc(article.title)}</h1><p>${article.author ? `By ${esc(article.author)}` : ''}${article.date ? ` · ${esc(article.date)}` : ''}</p>${marked.parse(markdown, { async: false, gfm: true })}</article>`;
}

/* ── Structured data ──────────────────────────────────────────────────────────────────── */
const datasetLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Unbonded Archive catalogue of sources on bonded labour in Nepal',
  description: `A curated catalogue of ${sources.length} research papers, reports, legal texts and datasets on the Kamaiya, Haliya, Haruwa-Charuwa and Kamlari bonded-labour systems in Nepal. Each record gives the source's method, study population, sample, geography, findings recorded by the cataloguing team, a citation and a link to the original.`,
  url: canonicalUrl('/research'),
  creator: { '@type': 'Organization', name: SITE_NAME, url: `${SITE_URL}/` },
  dateModified: CATALOGUE_UPDATED,
  inLanguage: 'en',
  isAccessibleForFree: true,
  license: 'https://creativecommons.org/licenses/by/4.0/',
  keywords: ['bonded labour', 'debt bondage', 'forced labour', 'Nepal', 'Kamaiya', 'Haliya', 'Haruwa-Charuwa', 'Kamlari', 'rehabilitation'],
  spatialCoverage: { '@type': 'Place', name: 'Nepal' },
  temporalCoverage: `${Math.min(...years)}/${Math.max(...years)}`,
  distribution: [
    { '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: `${SITE_URL}${CATALOGUE_FILES.csv}` },
    { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${SITE_URL}${CATALOGUE_FILES.json}` },
  ],
};
const websiteLd = { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/`, inLanguage: ['en', 'ne'] };

/* ── Write the pages ──────────────────────────────────────────────────────────────────── */
const sitemap = [];
for (const page of PAGES) {
  const meta = staticMeta(page, sources);
  const jsonLd = page.path === '/research' ? datasetLd : page.path === '/' ? websiteLd : undefined;
  writePage(page.path, meta, staticBody(meta), { jsonLd });
  sitemap.push(canonicalUrl(page.path));
}
for (const source of sources) {
  const meta = recordMeta(source);
  writePage(meta.path, meta, recordBody(source), { type: 'article' });
  sitemap.push(canonicalUrl(meta.path));
}
for (const article of articles) {
  const meta = articleMeta(article);
  writePage(meta.path, meta, articleBody(article), { type: 'article' });
  sitemap.push(canonicalUrl(meta.path));
}
// Retired duplicates: a small page that sends readers (and search engines) to the kept record.
for (const retired of data.retired ?? []) {
  const canonical = canonicalUrl(recordPath(retired.duplicateOf));
  const target = `${recordPath(retired.duplicateOf)}/`;
  const file = path.join(dist, recordPath(retired.id), 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `<!doctype html><html lang="en"><head><meta charset="UTF-8"/><title>${esc(pageTitle('Record moved'))}</title><meta name="robots" content="noindex"/><link rel="canonical" href="${canonical}"/><meta http-equiv="refresh" content="0; url=${target}"/></head><body><p>${esc(retired.id)} was a duplicate and has been merged into <a href="${target}">${esc(retired.duplicateOf)}</a>.</p></body></html>`);
}
// The former record address /source?id=… lands on /source/; give it a page (not a 404) so the
// app loads and redirects to /source/SRC-…/.
writePage('/source', { title: 'Source records', description: 'Catalogue records of the Unbonded Archive research collection.' }, '<h1>Source records</h1><p><a href="/research">Browse all records in the research collection</a>.</p>', { noindex: true });
// GitHub Pages serves 404.html for any address without a file. The app then loads and either
// redirects (old /source?id=… links) or shows its own "page not found".
writePage('/404', { title: 'Page not found', description: 'This page could not be found on Unbonded Archive.' }, '<h1>Page not found</h1><p><a href="/">Go to the home page</a> or <a href="/research">search the research collection</a>.</p>', { noindex: true });
fs.renameSync(path.join(dist, '404', 'index.html'), path.join(dist, '404.html'));
fs.rmdirSync(path.join(dist, '404'));

fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map((url) => `  <url><loc>${esc(url)}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

/* ── Downloadable catalogue ───────────────────────────────────────────────────────────── */
const FIELDS = [
  ['record_id', 'Persistent identifier (SRC-###). Never reused; retired records redirect to the record that replaced them.', (s) => s.id],
  ['title', 'Title as published.', (s) => s.title],
  ['author', 'Author(s) or issuing organisation, as recorded.', (s) => s.author],
  ['year', 'Year of publication. Blank where the source gives none.', (s) => s.year ?? ''],
  ['method_type', 'Controlled category: Survey / quantitative; Qualitative / mixed methods; Assessment / evaluation; Law / policy document; Descriptive / advocacy; Unspecified.', (s) => s.methodType],
  ['methodology', 'Method as described in the source.', (s) => s.methodology],
  ['study_population', 'Population the source describes.', (s) => s.population],
  ['geography', 'Places the evidence covers, as specific as the source allows.', (s) => s.geography],
  ['sample_size', 'Sample as reported. "Not reported" where the source gives none.', (s) => s.sampleSize],
  ['labour_systems', 'Labour systems covered (controlled list), separated by "; ".', (s) => (s.systems ?? []).join('; ')],
  ['themes', 'Themes (controlled list), separated by "; ".', (s) => (s.themes ?? []).join('; ')],
  ['findings', 'Findings recorded by the cataloguing team, paraphrased from the source and separated by " | ". Not a substitute for reading the source.', (s) => (s.claims ?? []).join(' | ')],
  ['repository_note', 'Cataloguer\'s note on limits, gaps or context.', (s) => s.gap],
  ['citation', 'Citation of the original source, as catalogued.', (s) => s.citation],
  ['original_url', 'Link to the original document or publisher page.', (s) => s.url],
  ['metadata_status', '"Complete metadata", or "Partial metadata" where a core field was missing from the source workbook.', (s) => s.status],
  ['record_url', 'The record\'s page on unbondedarchive.org.', (s) => canonicalUrl(recordPath(s.id))],
];
const sorted = [...sources].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
const csv = [FIELDS.map(([name]) => name), ...sorted.map((source) => FIELDS.map(([, , pick]) => pick(source)))].map((row) => row.map(csvCell).join(',')).join('\r\n');
const dataDir = path.join(dist, 'data');
fs.mkdirSync(dataDir, { recursive: true });
// The byte-order mark lets Excel open the file as UTF-8, so characters such as ’ and – display correctly.
fs.writeFileSync(path.join(dist, CATALOGUE_FILES.csv), `\uFEFF${csv}\r\n`);
fs.writeFileSync(path.join(dist, CATALOGUE_FILES.json), `${JSON.stringify({
  name: datasetLd.name,
  version: CATALOGUE_UPDATED,
  license: 'CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)',
  url: canonicalUrl('/research'),
  recordCount: sorted.length,
  fields: Object.fromEntries(FIELDS.map(([name, description]) => [name, description])),
  records: sorted.map((source) => Object.fromEntries(FIELDS.map(([name, , pick]) => [name, name === 'labour_systems' ? source.systems ?? [] : name === 'themes' ? source.themes ?? [] : name === 'findings' ? source.claims ?? [] : name === 'year' ? source.year ?? null : pick(source)]))),
}, null, 2)}\n`);

const citationYear = CATALOGUE_UPDATED.slice(0, 4);
fs.writeFileSync(path.join(dist, CATALOGUE_FILES.readme), `UNBONDED ARCHIVE CATALOGUE: FIELD GUIDE
Version ${CATALOGUE_UPDATED} · ${sorted.length} records · ${SITE_URL}/research/

FILES
  unbonded-archive-catalogue.csv   One row per source record (UTF-8, comma-separated).
  unbonded-archive-catalogue.json  The same records, with lists kept as lists.

FIELDS
${FIELDS.map(([name, description]) => `  ${name.padEnd(17)} ${description}`).join('\n')}

READ BEFORE USING
  - This is a curated catalogue, not a systematic review. Searches were made in English,
    so Nepali-language sources may be missing.
  - Findings are the cataloguing team's paraphrases. Check every figure against the original
    source before citing it, and cite the original source, not this catalogue, for a
    substantive claim.
  - Definitions, denominators, dates and populations differ between sources. Do not combine
    figures across records into totals or rates.
  - Corrections to the catalogue are logged at
    https://github.com/shubhamupreti49/Project-Unbonded/blob/main/data/CORRECTIONS.md

LICENCE
  The catalogue data (record details, coding and recorded findings) are shared under the
  Creative Commons Attribution 4.0 licence (CC BY 4.0): reuse them with credit to
  ${SITE_NAME}. https://creativecommons.org/licenses/by/4.0/
  Linked documents remain under their owners' terms.

HOW TO CITE THE CATALOGUE (Chicago author-date)
  ${SITE_NAME}. ${citationYear}. Unbonded Archive Catalogue of Sources on Bonded Labour in Nepal.
  Version ${CATALOGUE_UPDATED}. Dataset. ${SITE_URL}${CATALOGUE_FILES.csv}.
  In the text: (${SITE_NAME} ${citationYear})
`);

console.log(`prerender: ${sitemap.length} pages, ${(data.retired ?? []).length} redirect(s), 404.html, sitemap.xml, robots.txt, catalogue (${sorted.length} records)`);
