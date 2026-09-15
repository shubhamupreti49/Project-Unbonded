/**
 * Languages the archive supports. Add a language here, then add a matching
 * `locales/<code>/` folder containing the same JSON files as `locales/en/`.
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', nativeName: 'English', shortLabel: 'EN', intlLocale: 'en-GB' },
  { code: 'ne', nativeName: 'नेपाली', shortLabel: 'नेपाली', intlLocale: 'ne-NP' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

/** Translation namespaces. One JSON file per namespace, per language. */
export const NAMESPACES = ['common', 'home', 'library', 'dashboards', 'oralHistories'] as const;
export type Namespace = (typeof NAMESPACES)[number];

export function isSupportedLanguage(value: unknown): value is LanguageCode {
  return SUPPORTED_LANGUAGES.some((language) => language.code === value);
}

/** Maps anything i18next reports (e.g. "ne-NP", undefined) onto a supported code. */
export function toLanguageCode(value: string | undefined): LanguageCode {
  const base = value?.toLowerCase().split('-')[0];
  return isSupportedLanguage(base) ? base : DEFAULT_LANGUAGE;
}

export function intlLocaleFor(code: string | undefined): string {
  const language = SUPPORTED_LANGUAGES.find((entry) => entry.code === toLanguageCode(code));
  return language?.intlLocale ?? 'en-GB';
}
