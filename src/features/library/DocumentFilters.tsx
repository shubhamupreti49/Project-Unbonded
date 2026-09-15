import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toLanguageCode } from '../../i18n/languages';
import { formatNumber } from '../../lib/format';
import { FACETS, type FacetId } from './useDocumentFilters';
import { useVocabLabel } from './useVocabLabel';

type DocumentFiltersProps = {
  selection: Record<FacetId, ReadonlySet<string>>;
  counts: Record<FacetId, Map<string, number>>;
  activeCount: number;
  onToggle: (facet: FacetId, value: string) => void;
  onClear: () => void;
};

/**
 * Filter sidebar.
 *  - Mobile (default): collapsed behind a "Filters" button so results are visible first.
 *  - lg and up: always-visible sticky sidebar.
 * Each facet is a native <fieldset> of checkboxes — keyboard and screen-reader support
 * come for free, and there is no custom dropdown JavaScript to download.
 */
export function DocumentFilters({ selection, counts, activeCount, onToggle, onClear }: DocumentFiltersProps) {
  const { t, i18n } = useTranslation('library');
  const vocabLabel = useVocabLabel();
  const language = toLanguageCode(i18n.resolvedLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <aside className="ua lg:sticky lg:top-24 lg:self-start" aria-labelledby={`${panelId}-heading`}>
      <button
        type="button"
        className="flex min-h-11 w-full items-center justify-between rounded-lg border border-rule bg-paper px-4 font-bold text-navy lg:hidden"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>
          {t('filters.toggle')}
          {activeCount > 0 && <span className="ml-2 rounded-full bg-navy px-2 py-0.5 text-xs text-white">{t('filters.activeCount', { count: activeCount })}</span>}
        </span>
        <svg aria-hidden="true" viewBox="0 0 20 20" className={`size-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="currentColor">
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>

      <div id={panelId} className={`${isOpen ? 'block' : 'hidden'} mt-3 rounded-xl border border-rule bg-paper p-5 lg:mt-0 lg:block`}>
        <div className="flex items-baseline justify-between gap-3">
          <h2 id={`${panelId}-heading`} className="m-0 text-lg text-navy">{t('filters.heading')}</h2>
          {activeCount > 0 && (
            <button type="button" onClick={onClear} className="shrink-0 text-sm font-bold text-aqua underline underline-offset-4 hover:text-navy">
              {t('filters.clear')}
            </button>
          )}
        </div>

        {FACETS.map((facet) => (
          <fieldset key={facet.id} className="m-0 mt-5 border-0 border-t border-rule p-0 pt-4">
            <legend className="tw-eyebrow float-left mb-2 w-full p-0 font-mono text-xs font-bold tracking-wider text-coral uppercase">
              {t(`filters.${facet.id}`)}
            </legend>
            <ul className="clear-both m-0 list-none space-y-1 p-0">
              {facet.options.map((option) => {
                const count = counts[facet.id].get(option) ?? 0;
                const checked = selection[facet.id].has(option);
                const disabled = count === 0 && !checked;
                return (
                  <li key={option}>
                    <label className={`flex min-h-11 items-center gap-3 rounded-md px-2 text-[0.95rem] sm:min-h-9 ${disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer hover:bg-mint/60'}`}>
                      <input
                        type="checkbox"
                        className="size-4 shrink-0 accent-navy"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => onToggle(facet.id, option)}
                      />
                      <span className="grow">{vocabLabel(facet.id, option)}</span>
                      <span className="font-mono text-xs text-muted tabular-nums">{formatNumber(count, language)}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}
      </div>
    </aside>
  );
}
