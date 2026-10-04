import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { ARTICLES } from '../features/articles/articles';
import { WriteCta } from '../features/articles/WriteCta';
import { formatDate } from '../lib/format';
import { Layout } from '../main.jsx';

// Lazy-loaded route (see App.tsx). Articles are Markdown files in src/content/articles/.
export default function ArticlesPage() {
  const { t, i18n } = useTranslation('articles');

  return (
    <Layout active="articles">
      <PageHero eyebrow={t('list.eyebrow')} title={t('list.title')} lead={t('list.lead')} />
      <section className="ua bg-mint px-5 py-8 sm:px-7 lg:py-12">
        <div className="mx-auto max-w-[1180px]">
          <p className="m-0 mb-6 max-w-3xl rounded-lg border-l-4 border-aqua bg-white/80 px-4 py-2.5 text-sm text-ink">{t('list.commentary')}</p>

          {ARTICLES.length > 0 ? (
            <>
              <p className="mt-0 mb-4 text-sm font-bold text-navy">{t('list.count', { count: ARTICLES.length })}</p>
              <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 md:gap-5">
                {ARTICLES.map((article) => (
                  <li key={article.slug}>
                    <article className="flex h-full flex-col rounded-2xl border border-rule bg-paper p-5 shadow-[0_1px_2px_#08233b0f] transition duration-200 focus-within:ring-2 focus-within:ring-aqua hover:border-aqua/50 hover:shadow-[0_14px_30px_#08233b1a] sm:p-6">
                      <p className="m-0 font-mono text-xs text-muted">{formatDate(article.date, i18n.language)}</p>
                      <h2 lang={article.language} className="mt-2 mb-1.5 text-xl leading-snug sm:text-2xl">
                        <Link to={`/articles/${article.slug}`} className="text-navy no-underline decoration-coral decoration-2 underline-offset-4 hover:underline focus-visible:underline">{article.title}</Link>
                      </h2>
                      <p className="m-0 text-sm font-bold text-coral">{t('list.by', { author: article.author })}</p>
                      {article.summary && <p lang={article.language} className="mt-3 mb-0 text-[0.97rem] text-ink/90">{article.summary}</p>}
                      {article.tags.length > 0 && (
                        <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                          {article.tags.map((tag) => <li key={tag} className="rounded-full bg-white px-2.5 py-0.5 text-xs text-muted ring-1 ring-rule">{tag}</li>)}
                        </ul>
                      )}
                      <Link to={`/articles/${article.slug}`} className="mt-auto inline-flex min-h-11 items-center self-start pt-4 font-bold text-navy no-underline hover:text-aqua">
                        {t('list.read')} <span aria-hidden="true" className="ml-1.5">→</span>
                      </Link>
                    </article>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-navy/25 bg-paper px-6 py-10 text-center">
              <h2 className="text-2xl text-navy">{t('list.emptyTitle')}</h2>
              <p className="mx-auto mt-0 mb-0 max-w-lg text-muted">{t('list.emptyBody')}</p>
            </div>
          )}

          <WriteCta />
        </div>
      </section>
    </Layout>
  );
}
