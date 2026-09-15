import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Translates the fixed category labels stored in data/sources.js (labour systems, themes,
 * methods, metadata status), e.g. "Rehabilitation" → "पुनर्स्थापना".
 *
 * The labels are looked up in `common:dataLabels` as a plain object rather than as
 * i18next keys, because values like "Survey / quantitative" contain characters that
 * i18next would treat as key separators. Unknown values fall back to the original text.
 */
export function useDataLabel() {
  const { t } = useTranslation('common');
  const labels = t('dataLabels', { returnObjects: true }) as Record<string, string>;
  return useCallback((value: string) => labels?.[value] ?? value, [labels]);
}
