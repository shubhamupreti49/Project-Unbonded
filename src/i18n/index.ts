/**
 * i18n bootstrap (i18next + react-i18next).
 *
 * Loading strategy, chosen for slow cellular connections:
 *  - English is bundled into the main JavaScript chunk. It is the fallback language, so
 *    the interface can always render even if a translation request fails.
 *  - Nepali is split into one small chunk per namespace and downloaded only when a
 *    Nepali reader actually opens a page that needs it (e.g. `library` loads with the
 *    Library route, not on the home page).
 *  - The reader's choice is remembered in localStorage; on the first visit we honour the
 *    browser's preferred languages.
 *
 * Import this module once, before the app renders (see src/main.tsx).
 */
import i18n, { type BackendModule, type ReadCallback } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { formatNumber } from '../lib/format';
import {
  DEFAULT_LANGUAGE,
  NAMESPACES,
  SUPPORTED_LANGUAGES,
  isSupportedLanguage,
  toLanguageCode,
  type LanguageCode,
} from './languages';

const STORAGE_KEY = 'unbonded.language';

// Vite turns these globs into (a) inlined English JSON and (b) lazy import() calls, one
// chunk per Nepali namespace file.
const bundledLocales = import.meta.glob<Record<string, unknown>>('./locales/en/*.json', { eager: true, import: 'default' });
const lazyLocales = import.meta.glob<Record<string, unknown>>(['./locales/*/*.json', '!./locales/en/*.json'], { import: 'default' });

const localePath = (language: string, namespace: string) => `./locales/${language}/${namespace}.json`;

const englishResources = Object.fromEntries(
  NAMESPACES.map((namespace) => [namespace, bundledLocales[localePath('en', namespace)] ?? {}]),
);

/** Minimal i18next backend that resolves namespaces through Vite's dynamic imports. */
const viteChunkBackend: BackendModule = {
  type: 'backend',
  init() {},
  read(language: string, namespace: string, callback: ReadCallback) {
    const bundled = bundledLocales[localePath(language, namespace)];
    if (bundled) return callback(null, bundled);

    const load = lazyLocales[localePath(language, namespace)];
    if (!load) return callback(new Error(`Missing translation file: ${language}/${namespace}`), false);

    load()
      .then((resources) => callback(null, resources))
      .catch((error: Error) => callback(error, false));
  },
};

function detectInitialLanguage(): LanguageCode {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isSupportedLanguage(saved)) return saved;
  } catch {
    // Private browsing or blocked storage: fall through to the browser preference.
  }
  const preferred = navigator.languages ?? [navigator.language];
  return preferred.some((tag) => tag?.toLowerCase().startsWith('ne')) ? 'ne' : DEFAULT_LANGUAGE;
}

function syncDocumentLanguage(language: string) {
  const code = toLanguageCode(language);
  // `lang` drives screen-reader pronunciation, hyphenation and the :lang(ne) CSS rules.
  document.documentElement.lang = code;
  try {
    window.localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Non-critical: the choice simply won't persist.
  }
}

i18n.on('languageChanged', syncDocumentLanguage);

/** Resolves once the initial language's `common` namespace is ready. */
export const i18nReady = i18n
  .use(viteChunkBackend)
  .use(initReactI18next)
  .init({
    lng: detectInitialLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES.map((language) => language.code),
    load: 'languageOnly',
    ns: ['common'],
    defaultNS: 'common',
    resources: { en: englishResources },
    // Use bundled English *and* the backend for other languages.
    partialBundledLanguages: true,
    interpolation: { escapeValue: false }, // React already escapes output.
    react: { useSuspense: true },
  })
  .then(() => {
    // Route `{{count, number}}` in dictionaries through our formatter, which guarantees
    // Devanagari digits even where the browser lacks Nepali locale data.
    i18n.services.formatter?.add('number', (value, language) => formatNumber(Number(value), language ?? DEFAULT_LANGUAGE));
    syncDocumentLanguage(i18n.language);
  });

export function changeLanguage(language: LanguageCode) {
  return i18n.changeLanguage(language);
}

export default i18n;
