import { useTranslation } from 'react-i18next';

/**
 * Suspense fallback shown while a lazily loaded route chunk downloads.
 * It is pure CSS (no images) and reserves roughly the space of a page header, so the
 * layout doesn't jump when the real page arrives on a slow connection.
 */
export function RouteFallback() {
  const { t } = useTranslation('common');

  return (
    <div className="ua bg-mint px-5 py-12 sm:px-7" role="status" aria-live="polite">
      <div className="mx-auto max-w-[1180px] motion-safe:animate-pulse" aria-hidden="true">
        <div className="h-3 w-40 rounded bg-navy/15" />
        <div className="mt-5 h-10 w-full max-w-xl rounded bg-navy/15" />
        <div className="mt-3 h-4 w-full max-w-2xl rounded bg-navy/10" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => <div key={item} className="h-40 rounded-2xl bg-paper" />)}
        </div>
      </div>
      <span className="sr-only">{t('status.loadingPage')}</span>
    </div>
  );
}
