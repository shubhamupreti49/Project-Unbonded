import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useMemo } from 'react';

// Links to other sites open in a new tab; links inside the archive (/source/SRC-002) stay put.
// Articles written before the move to real addresses used #/source?id=SRC-002; those are rewritten.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName !== 'A') return;
  const href = node.getAttribute('href') ?? '';
  if (/^https?:\/\//i.test(href)) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noreferrer');
    return;
  }
  const legacy = /^#(\/.*)$/.exec(href);
  if (legacy) {
    const record = /^\/source\?id=([^&#]+)/.exec(legacy[1]);
    node.setAttribute('href', record ? `/source/${record[1]}` : legacy[1]);
  }
});

/**
 * Renders an article's Markdown. Volunteer text is reviewed before it is committed, but it
 * is still sanitised, so a pasted <script>, event handler or javascript: link can never run.
 */
export function ArticleBody({ markdown, lang }: { markdown: string; lang: string }) {
  const html = useMemo(() => DOMPurify.sanitize(marked.parse(markdown, { async: false, gfm: true })), [markdown]);
  return <div className="article-body" lang={lang} dangerouslySetInnerHTML={{ __html: html }} />;
}
