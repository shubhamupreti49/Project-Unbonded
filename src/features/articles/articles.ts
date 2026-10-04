/**
 * Volunteer articles, one Markdown file each in src/content/articles/ (see the README there).
 *
 * Files are bundled at build time, so publishing an article is: add the .md file, commit,
 * push, and GitHub Pages redeploys in about a minute. Files starting with "_" (the
 * template) and README.md are ignored. The filename, minus ".md", becomes the URL:
 * kamaiya-land-explained.md → /articles/kamaiya-land-explained.
 */
export type Article = {
  slug: string;
  title: string;
  author: string;
  authorBio?: string;
  /** ISO date, e.g. "2026-10-03". */
  date: string;
  summary?: string;
  /** Language the article is written in. */
  language: 'en' | 'ne';
  /** Source record ids (e.g. "SRC-013") of the papers the article discusses. */
  related: string[];
  tags: string[];
  body: string;
};

const files = import.meta.glob<string>(['../../content/articles/*.md', '!../../content/articles/_*.md', '!../../content/articles/README.md'], { query: '?raw', import: 'default', eager: true });

/** Minimal front matter: `key: value` lines between two `---` lines; lists are comma-separated. */
function parseFrontMatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = /^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = /^([A-Za-z][\w-]*)\s*:\s*(.*)$/.exec(line.trim());
    if (pair) meta[pair[1]] = pair[2].trim().replace(/^(["'])(.*)\1$/, '$2');
  }
  return { meta, body: match[2].trim() };
}

const list = (value?: string) => (value ?? '').replace(/^\[|\]$/g, '').split(',').map((entry) => entry.trim().replace(/^(["'])(.*)\1$/, '$2')).filter(Boolean);

export const ARTICLES: Article[] = Object.entries(files)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontMatter(raw);
    const slug = path.split('/').pop()!.replace(/\.md$/, '');
    if (import.meta.env.DEV && (!meta.title || !meta.author || !/^\d{4}-\d{2}-\d{2}$/.test(meta.date ?? ''))) {
      console.warn(`[articles] ${slug}.md needs title, author and a YYYY-MM-DD date in its front matter.`);
    }
    return {
      slug,
      title: meta.title || slug,
      author: meta.author || '',
      authorBio: meta.authorBio || undefined,
      date: meta.date || '1970-01-01',
      summary: meta.summary || undefined,
      language: meta.language === 'ne' ? 'ne' : 'en',
      related: list(meta.related),
      tags: list(meta.tags),
      body,
    } satisfies Article;
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export function getArticle(slug: string | undefined): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

/** Articles that list this source record in `related`, newest first. */
export function articlesAboutSource(sourceId: string | undefined): Article[] {
  return sourceId ? ARTICLES.filter((article) => article.related.includes(sourceId)) : [];
}
