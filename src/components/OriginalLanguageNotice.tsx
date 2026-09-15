import { useTranslation } from 'react-i18next';
import { toLanguageCode } from '../i18n/languages';

/**
 * Shown to Nepali readers on pages that list research records. Interface text is
 * translated, but source titles, citations and recorded findings stay in the language
 * they were published in, so quotations remain accurate and citable.
 */
// Legacy pages aren't scanned by Tailwind, so spacing lives here rather than in a className prop.
export function OriginalLanguageNotice() {
  const { t, i18n } = useTranslation('common');
  if (toLanguageCode(i18n.resolvedLanguage) === 'en') return null;

  return (
    <p className="ua m-0 mb-5 rounded-lg border-l-4 border-aqua bg-white/80 px-4 py-2.5 text-sm text-ink">
      {t('originalLanguage')}
    </p>
  );
}
