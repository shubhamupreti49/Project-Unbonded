/**
 * Locale-aware formatting helpers. Passing the i18next language ("ne") gives Devanagari
 * numerals and Nepali month names automatically via the built-in Intl APIs, so there is
 * no formatting library to download.
 */
import { intlLocaleFor, toLanguageCode } from '../i18n/languages';

const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

/**
 * Some browsers ship reduced ICU locale data without Nepali (seen in Electron builds and
 * some Android WebViews), and Intl then silently formats as en-US. Converting any
 * remaining ASCII digits guarantees Devanagari numerals for Nepali readers either way.
 */
export function localizeDigits(text: string, language: string): string {
  return toLanguageCode(language) === 'ne' ? text.replace(/[0-9]/g, (digit) => DEVANAGARI_DIGITS[Number(digit)]) : text;
}

export function formatYear(year: number | null | undefined, language: string): string | null {
  if (!year) return null;
  return localizeDigits(new Intl.NumberFormat(intlLocaleFor(language), { useGrouping: false }).format(year), language);
}

/** "2.4 MB" / "२.४ MB". Always show file sizes before a download on metered connections. */
export function formatBytes(bytes: number | undefined, language: string): string | null {
  if (!bytes || bytes <= 0) return null;
  const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte'] as const;
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1000)), units.length - 1);
  const value = bytes / 1000 ** exponent;
  return localizeDigits(new Intl.NumberFormat(intlLocaleFor(language), {
    style: 'unit',
    unit: units[exponent],
    unitDisplay: 'short',
    maximumFractionDigits: value < 10 && exponent > 1 ? 1 : 0,
  }).format(value), language);
}

/** Media clock: 65 → "1:05", 3725 → "1:02:05", with Devanagari digits in Nepali. */
export function formatClock(totalSeconds: number, language: string): string {
  const safe = Number.isFinite(totalSeconds) && totalSeconds > 0 ? Math.floor(totalSeconds) : 0;
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const digits = new Intl.NumberFormat(intlLocaleFor(language), { useGrouping: false });
  const pad = (value: number) => new Intl.NumberFormat(intlLocaleFor(language), { minimumIntegerDigits: 2, useGrouping: false }).format(value);
  const clock = hours > 0 ? `${digits.format(hours)}:${pad(minutes)}:${pad(seconds)}` : `${digits.format(minutes)}:${pad(seconds)}`;
  return localizeDigits(clock, language);
}

export function formatDate(isoDate: string, language: string): string {
  // timeZone UTC stops "2024-03-01" rendering as 29 February west of Greenwich.
  return localizeDigits(new Intl.DateTimeFormat(intlLocaleFor(language), { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(isoDate)), language);
}

export function formatNumber(value: number, language: string): string {
  return localizeDigits(new Intl.NumberFormat(intlLocaleFor(language)).format(value), language);
}
