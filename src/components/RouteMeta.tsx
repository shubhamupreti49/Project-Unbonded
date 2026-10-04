import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { data } from '../../data/sources.js';
import { PAGES, articleMeta, canonicalUrl, pageTitle, recordMeta, staticMeta } from '../seo/site.js';

type Meta = { title: string; description: string; path: string };

function setTag(selector: string, attribute: 'content' | 'href', value: string, create: () => HTMLElement) {
  let element = document.head.querySelector(selector);
  if (!element) { element = create(); document.head.append(element); }
  element.setAttribute(attribute, value);
}

function apply(meta: Meta) {
  const title = pageTitle(meta.title);
  const url = canonicalUrl(meta.path);
  document.title = title;
  const named = (name: string) => () => Object.assign(document.createElement('meta'), { name });
  const property = (key: string) => () => { const element = document.createElement('meta'); element.setAttribute('property', key); return element; };
  setTag('meta[name="description"]', 'content', meta.description, named('description'));
  setTag('link[rel="canonical"]', 'href', url, () => Object.assign(document.createElement('link'), { rel: 'canonical' }));
  setTag('meta[property="og:title"]', 'content', title, property('og:title'));
  setTag('meta[property="og:description"]', 'content', meta.description, property('og:description'));
  setTag('meta[property="og:url"]', 'content', url, property('og:url'));
  setTag('meta[name="twitter:title"]', 'content', title, named('twitter:title'));
  setTag('meta[name="twitter:description"]', 'content', meta.description, named('twitter:description'));
}

/**
 * Keeps the browser tab title, description and canonical address in step with the page, so
 * bookmarks, history and shared links name the record or page rather than just the site.
 * The build writes the same values into each page's HTML (see src/seo/site.js).
 */
export function RouteMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = pathname.replace(/\/+$/, '') || '/';
    const page = PAGES.find((entry) => entry.path === path);
    if (page) { apply(staticMeta(page, data.sources)); return undefined; }
    const record = /^\/source\/([^/]+)$/.exec(path);
    if (record) {
      const source = data.sources.find((entry) => entry.id === decodeURIComponent(record[1]));
      if (source) apply(recordMeta(source));
      else document.title = pageTitle('Source record not found');
      return undefined;
    }
    const article = /^\/articles\/([^/]+)$/.exec(path);
    if (article) {
      let live = true;
      import('../features/articles/articles').then(({ getArticle }) => {
        const found = getArticle(decodeURIComponent(article[1]));
        if (live && found) apply(articleMeta(found));
      });
      return () => { live = false; };
    }
    // Old addresses (/library, /catalogue, /source?id=…) redirect straight away and land back here.
    document.title = pageTitle('Page not found');
    return undefined;
  }, [pathname]);
  return null;
}
