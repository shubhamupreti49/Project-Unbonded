import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { data } from '../../data/sources.js';
import { ArticleBody } from '../features/articles/ArticleBody';
import { getArticle } from '../features/articles/articles';
import { WriteCta } from '../features/articles/WriteCta';
import { formatDate, formatYear } from '../lib/format';
import { Layout } from '../main.jsx';
import { recordPath } from '../seo/site.js';

// Lazy-loaded route (see App.tsx): /articles/:slug, one Markdown file in src/content/articles/.
export default function ArticlePage() {
  const { t, i18n } = useTranslation('articles');
  const { slug } = useParams();
  const article = getArticle(slug);

  if (!article) {
    return (
      <Layout active="articles">
        <section className="section"><div className="shell not-found">
          <h1>{t('article.notFoundTitle')}</h1>
          <p><Link to="/articles">{t('article.notFoundBack')}</Link></p>
        </div></section>
      </Layout>
    );
  }

  const related = article.related.map((id) => data.sources.find((source) => source.id === id)).filter((source) => source !== undefined);

  return (
    <Layout active="articles">
      <article>
        <header className="ua bg-night px-5 pt-10 pb-10 text-white sm:px-7 lg:pt-14 lg:pb-14">
          <div className="mx-auto max-w-[760px]">
            <Link to="/articles" className="font-bold text-[#d9eeee] no-underline hover:text-sun hover:underline">{t('article.back')}</Link>
            <p className="tw-eyebrow mt-6 mb-0 font-mono text-xs font-bold tracking-widest text-sun uppercase">{t('article.eyebrow')}</p>
            <h1 lang={article.language} className="mt-3 mb-4 text-4xl leading-tight text-white sm:text-5xl">{article.title}</h1>
            <p className="m-0 text-[#d9eeee]">
              <b className="text-white">{t('article.by', { author: article.author })}</b> · {formatDate(article.date, i18n.language)}
            </p>
            {article.summary && <p lang={article.language} className="mt-4 mb-0 text-lg text-[#d9eeee]">{article.summary}</p>}
          </div>
        </header>

        <div className="ua bg-paper px-5 py-10 sm:px-7 lg:py-14">
          <div className="mx-auto max-w-[760px]">
            <p className="m-0 mb-8 rounded-lg border-l-4 border-aqua bg-mint/60 px-4 py-2.5 text-sm text-ink">{t('list.commentary')}</p>
            <ArticleBody markdown={article.body} lang={article.language} />

            {article.authorBio && (
              <aside className="mt-10 border-t border-rule pt-6">
                <h2 className="m-0 mb-2 text-lg text-navy">{t('article.aboutAuthor')}</h2>
                <p lang={article.language} className="m-0 text-muted">{article.authorBio}</p>
              </aside>
            )}

            {related.length > 0 && (
              <section className="mt-10 border-t border-rule pt-6" aria-labelledby="article-related">
                <h2 id="article-related" className="m-0 text-2xl text-navy">{t('article.related')}</h2>
                <p className="mt-1 mb-4 text-muted">{t('article.relatedIntro')}</p>
                <ul className="m-0 grid list-none gap-3 p-0">
                  {related.map((source) => (
                    <li key={source.id} className="rounded-lg border-l-4 border-aqua bg-mint/50 px-4 py-3">
                      <Link to={recordPath(source.id)} lang="en" className="font-serif text-lg font-bold text-navy no-underline hover:text-aqua hover:underline">{source.title}</Link>
                      <p lang="en" className="m-0 mt-1 text-sm text-muted">{source.author}{source.year ? ` · ${formatYear(source.year, i18n.language)}` : ''}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <WriteCta />
          </div>
        </div>
      </article>
    </Layout>
  );
}
