import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useMemo } from 'react';

// Links to other sites open in a new tab; links inside the archive (#/source?id=…) stay put.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && /^https?:\/\//i.test(node.getAttribute('href') ?? '')) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noreferrer');
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
