import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { toLanguageCode, type LanguageCode } from '../../i18n/languages';
import { formatClock } from '../../lib/format';
import { useLocalizedText } from '../../lib/localized';
import type { TranscriptSegment } from './types';

type TranscriptMode = LanguageCode | 'both';

type TranscriptPanelProps = {
  segments: TranscriptSegment[];
  activeIndex: number;
  /** Seek to a time and start playback. */
  onSeek: (seconds: number) => void;
};

const MODES: TranscriptMode[] = ['ne', 'en', 'both'];

/**
 * Bilingual, audio-synchronised transcript.
 *  - Nepali, English, or both side by side (stacked on phones).
 *  - The active segment is highlighted and kept in view *inside the box* (never scrolls
 *    the whole page). Auto-follow pauses as soon as the reader scrolls by hand, with a
 *    "Follow audio" button to resume.
 *  - Every segment has a timestamp button, so keyboard and screen-reader users can jump
 *    to any point; mouse and touch users can also tap the text itself.
 */
export function TranscriptPanel({ segments, activeIndex, onSeek }: TranscriptPanelProps) {
  const { t, i18n } = useTranslation(['oralHistories', 'common']);
  const uiLanguage = toLanguageCode(i18n.resolvedLanguage);
  const localize = useLocalizedText();
  const reducedMotion = usePrefersReducedMotion();

  const [mode, setMode] = useState<TranscriptMode>(uiLanguage);
  const [isFollowing, setIsFollowing] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef(new Map<string, HTMLLIElement>());
  const headingId = useId();

  // Follow the site language switch unless the reader has chosen "both".
  useEffect(() => {
    setMode((current) => (current === 'both' ? current : uiLanguage));
  }, [uiLanguage]);

  // Keep the active segment roughly a third of the way down the transcript box.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const segment = activeIndex >= 0 ? segmentRefs.current.get(segments[activeIndex].id) : undefined;
    if (!isFollowing || !scroller || !segment) return;
    scroller.scrollTo({ top: segment.offsetTop - scroller.clientHeight / 3, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [activeIndex, isFollowing, reducedMotion, segments]);

  // Programmatic scrollTo() doesn't emit wheel/touch/key events, so these mean "the reader scrolled".
  const stopFollowing = () => setIsFollowing(false);
  const onScrollKey = (event: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key)) stopFollowing();
  };

  const seekFromText = (seconds: number) => {
    // Don't hijack a click that finishes a text selection (e.g. copying a quote).
    if (window.getSelection()?.toString()) return;
    onSeek(seconds);
    setIsFollowing(true);
  };

  const languages: LanguageCode[] = mode === 'both' ? ['ne', 'en'] : [mode];

  return (
    <section className="ua flex min-h-0 flex-col rounded-2xl border border-rule bg-white" aria-labelledby={headingId}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-4 py-3">
        <h3 id={headingId} className="m-0 text-lg text-navy">{t('transcript.heading')}</h3>
        <div className="flex flex-wrap items-center gap-2">
          {!isFollowing && (
            <button type="button" onClick={() => setIsFollowing(true)} className="min-h-9 rounded-full bg-sun px-3 text-sm font-bold text-night">
              {t('transcript.follow')}
            </button>
          )}
          <div role="group" aria-label={t('transcript.modeLabel')} className="inline-flex rounded-full bg-mint p-0.5">
            {MODES.map((option) => (
              <button
                key={option}
                type="button"
                lang={option === 'both' ? uiLanguage : option}
                aria-pressed={mode === option}
                onClick={() => setMode(option)}
                className={`min-h-9 rounded-full px-3 text-sm font-bold ${mode === option ? 'bg-navy text-white' : 'text-navy hover:bg-white/70'}`}
              >
                {t(`transcript.modes.${option}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        // data-lenis-prevent: the site's Lenis smooth-scroll otherwise captures wheel events
        // and this box could not be scrolled with a mouse.
        data-lenis-prevent=""
        tabIndex={0}
        aria-label={t('transcript.heading')}
        onWheel={stopFollowing}
        onTouchMove={stopFollowing}
        onKeyDown={onScrollKey}
        className="relative max-h-[55svh] overflow-y-auto overscroll-contain px-2 py-2 focus-visible:outline-2 focus-visible:outline-aqua lg:max-h-[34rem]"
      >
        <ol className="m-0 list-none space-y-1 p-0">
          {segments.map((segment, index) => {
            const isActive = index === activeIndex;
            const clock = formatClock(segment.start, uiLanguage);
            const speaker = segment.speaker ? localize(segment.speaker) : null;
            return (
              <li
                key={segment.id}
                ref={(element) => { if (element) segmentRefs.current.set(segment.id, element); else segmentRefs.current.delete(segment.id); }}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => seekFromText(segment.start)}
                className={`grid cursor-pointer gap-x-3 gap-y-1 rounded-xl px-3 py-3 transition-colors sm:grid-cols-[4rem_minmax(0,1fr)] ${isActive ? 'bg-sun/25 ring-1 ring-sun' : 'hover:bg-mint/50'}`}
              >
                <button
                  type="button"
                  onClick={(event) => { event.stopPropagation(); onSeek(segment.start); setIsFollowing(true); }}
                  aria-label={t('transcript.playFrom', { time: clock })}
                  className="justify-self-start rounded px-1 font-mono text-xs font-bold text-aqua tabular-nums hover:text-navy sm:pt-1"
                >
                  {clock}
                </button>
                <div>
                  {speaker && <p lang={speaker.lang} className="m-0 mb-1 text-xs font-bold text-coral">{speaker.text}</p>}
                  <div className={mode === 'both' ? 'grid gap-2 md:grid-cols-2 md:gap-5' : ''}>
                    {languages.map((language) => {
                      const text = segment.text[language];
                      return text
                        ? <p key={language} lang={language} className="m-0 text-[0.98rem] text-ink">{text}</p>
                        : <p key={language} className="m-0 text-sm text-muted italic">{t('common:translationPending')}</p>;
                    })}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
