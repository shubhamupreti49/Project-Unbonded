import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';
import { SUPPORTED_LANGUAGES, toLanguageCode } from '../i18n/languages';

type LanguageToggleProps = {
  className?: string;
};

/**
 * Two-option segmented control for the dark site header.
 *
 * Accessibility notes:
 *  - A labelled group of toggle buttons (`aria-pressed`), so screen readers announce
 *    "English, toggle button, pressed".
 *  - Each button carries its own `lang`, so "नेपाली" is pronounced by a Nepali voice even
 *    while the rest of the page is in English.
 *  - Buttons stay at least 44px tall on touch screens.
 */
export function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { t, i18n } = useTranslation('common');
  const current = toLanguageCode(i18n.resolvedLanguage);

  return (
    <div role="group" aria-label={t('language.label')} className={`ua inline-flex shrink-0 rounded-full border border-white/25 p-0.5 ${className}`}>
      {SUPPORTED_LANGUAGES.map(({ code, nativeName, shortLabel }) => {
        const isActive = code === current;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={isActive}
            aria-label={nativeName}
            onClick={() => { if (!isActive) void changeLanguage(code); }}
            className={[
              'min-h-11 rounded-full border-0 px-3 font-sans text-sm leading-none font-bold transition-colors sm:min-h-9',
              'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sun',
              isActive ? 'bg-sun text-night' : 'bg-transparent text-white hover:bg-white/10',
            ].join(' ')}
          >
            {shortLabel}
          </button>
        );
      })}
    </div>
  );
}
