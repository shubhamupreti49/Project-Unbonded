/**
 * Content (document titles, transcripts, dashboard names) is stored bilingually in the
 * data itself, unlike interface text which lives in the i18n JSON dictionaries.
 * English is required; Nepali is optional so records can be published before translation.
 */
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toLanguageCode, type LanguageCode } from '../i18n/languages';

export type LocalizedText = { en: string } & Partial<Record<Exclude<LanguageCode, 'en'>, string>>;

export type ResolvedText = {
  text: string;
  /** The language the text is actually in. Put it on the element's `lang` attribute. */
  lang: LanguageCode;
  isFallback: boolean;
};

export function resolveText(value: LocalizedText, language: LanguageCode): ResolvedText {
  const translated = value[language];
  if (translated) return { text: translated, lang: language, isFallback: false };
  return { text: value.en, lang: 'en', isFallback: language !== 'en' };
}

/** Returns a resolver bound to the reader's current language. */
export function useLocalizedText() {
  const { i18n } = useTranslation();
  const language = toLanguageCode(i18n.resolvedLanguage);
  return useCallback((value: LocalizedText) => resolveText(value, language), [language]);
}
