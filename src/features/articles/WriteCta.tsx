import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

/** Invitation to write, shown at the end of the article list and of every article. */
export function WriteCta() {
  const { t } = useTranslation('articles');
  return (
    <aside className="ua mt-12 rounded-2xl bg-night px-6 py-8 text-white sm:px-8">
      <h2 className="m-0 text-2xl text-sun sm:text-3xl">{t('cta.heading')}</h2>
      <p className="mt-3 mb-5 max-w-2xl text-[#d9eeee]">{t('cta.text')}</p>
      <Link to="/write-for-us" className="inline-flex min-h-11 items-center rounded-lg bg-sun px-4 font-bold text-night no-underline hover:bg-[#ffd77f]">
        {t('cta.button')} <span aria-hidden="true" className="ml-1.5">→</span>
      </Link>
    </aside>
  );
}
