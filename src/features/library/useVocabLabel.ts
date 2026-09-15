import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export type VocabularyName = 'region' | 'community' | 'documentType';

/** Translates a controlled-vocabulary ID, e.g. ('community', 'haliya') → "हलिया". */
export function useVocabLabel() {
  const { t } = useTranslation('common');
  return useCallback(
    // IDs are validated against vocabulary.ts before they reach the UI, so the dynamic key
    // is always present; the cast only bridges TypeScript's per-key typing.
    (vocabulary: VocabularyName, id: string) => t(`vocab.${vocabulary}.${id}` as 'vocab.region.koshi'),
    [t],
  );
}
