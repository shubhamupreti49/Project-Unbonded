/**
 * Type-safe translation keys: `t('nav.library')` autocompletes, and a typo or a key
 * missing from the English dictionary becomes a TypeScript error.
 * English is the source of truth; Nepali files must mirror its structure.
 */
import 'i18next';
import type common from './locales/en/common.json';
import type dashboards from './locales/en/dashboards.json';
import type home from './locales/en/home.json';
import type library from './locales/en/library.json';
import type oralHistories from './locales/en/oralHistories.json';
import type researchers from './locales/en/researchers.json';
import type catalogue from './locales/en/catalogue.json';
import type timeline from './locales/en/timeline.json';
import type geography from './locales/en/geography.json';
import type source from './locales/en/source.json';
import type methodology from './locales/en/methodology.json';
import type contacts from './locales/en/contacts.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      home: typeof home;
      library: typeof library;
      dashboards: typeof dashboards;
      oralHistories: typeof oralHistories;
      researchers: typeof researchers;
      catalogue: typeof catalogue;
      timeline: typeof timeline;
      geography: typeof geography;
      source: typeof source;
      methodology: typeof methodology;
      contacts: typeof contacts;
    };
  }
}
