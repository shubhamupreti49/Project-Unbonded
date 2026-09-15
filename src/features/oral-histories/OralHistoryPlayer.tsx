import { useCallback, useEffect, useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toLanguageCode } from '../../i18n/languages';
import { formatBytes, formatClock, formatDate } from '../../lib/format';
import { useLocalizedText } from '../../lib/localized';
import { useVocabLabel } from '../library/useVocabLabel';
import { COMMUNITY_STYLES } from '../library/vocabulary';
import { findActiveSegmentIndex } from './transcript';
import { TranscriptPanel } from './TranscriptPanel';
import type { OralHistory } from './types';
import { useAudioPlayer } from './useAudioPlayer';

/*
 * ── Preparing oral-history audio for slow cellular networks ────────────────────────────
 * Speech needs far less data than music. For each interview, export two files:
 *
 *   # Primary: Opus, mono, 24 kbps ≈ 10.8 MB per hour (clear speech; Chrome/Android/Firefox, Safari 17+)
 *   ffmpeg -i master.wav -ac 1 -c:a libopus -b:a 24k -application voip UA-OH-0001-24k.opus
 *
 *   # Fallback: AAC-LC, mono, 48 kbps ≈ 21.6 MB per hour (plays everywhere, incl. older iPhones)
 *   ffmpeg -i master.wav -ac 1 -c:a aac -b:a 48k -movflags +faststart UA-OH-0001-48k.m4a
 *
 * `-movflags +faststart` moves the index to the front so playback starts before the whole
 * file downloads. Normalise loudness first (ffmpeg -af loudnorm) so quiet field recordings
 * are audible on phone speakers. Keep the uncompressed masters offline, not on the website.
 *
 * The <audio> element uses preload="none": nothing downloads until the reader presses
 * play, and duration comes from our metadata so the length is shown immediately.
 * ──────────────────────────────────────────────────────────────────────────────────────
 */

const SKIP_SECONDS = 15;
const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5];

export function OralHistoryPlayer({ history }: { history: OralHistory }) {
  const { t, i18n } = useTranslation('oralHistories');
  const language = toLanguageCode(i18n.resolvedLanguage);
  const localize = useLocalizedText();
  const vocabLabel = useVocabLabel();
  const speedId = useId();

  const { audioRef, status, isPlaying, currentTime, duration, bufferedEnd, playbackRate, play, toggle, seek, skip, setPlaybackRate } =
    useAudioPlayer(history.durationSeconds);

  const title = localize(history.title);
  const narrator = localize(history.narrator.displayName);
  const activeIndex = useMemo(() => findActiveSegmentIndex(history.transcript, currentTime), [history.transcript, currentTime]);
  const downloadSize = formatBytes(history.audio.download?.sizeBytes, language);

  const seekAndPlay = useCallback((seconds: number) => {
    seek(seconds);
    void play();
  }, [seek, play]);

  // Lock-screen and headphone controls on Android/iOS via the Media Session API.
  useEffect(() => {
    if (!('mediaSession' in navigator) || !isPlaying) return;
    navigator.mediaSession.metadata = new MediaMetadata({ title: title.text, artist: narrator.text, album: 'Unbonded Archive' });
    navigator.mediaSession.setActionHandler('seekbackward', () => skip(-SKIP_SECONDS));
    navigator.mediaSession.setActionHandler('seekforward', () => skip(SKIP_SECONDS));
  }, [isPlaying, title.text, narrator.text, skip]);

  const safeDuration = duration || history.durationSeconds;
  const clockNow = formatClock(currentTime, language);
  const clockTotal = formatClock(safeDuration, language);
  const bufferedPercent = safeDuration ? Math.min(100, (bufferedEnd / safeDuration) * 100) : 0;

  return (
    <article className="ua grid gap-5 rounded-3xl border border-rule bg-paper p-4 sm:p-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-full px-2.5 py-0.5 font-bold ring-1 ${COMMUNITY_STYLES[history.community]}`}>{vocabLabel('community', history.community)}</span>
          <span className="text-muted">{vocabLabel('region', history.region)}</span>
          <span className="text-muted">· {t('meta.recorded', { date: formatDate(history.recordedOn, language) })}</span>
        </div>

        <h2 lang={title.lang} className="mt-3 mb-1 text-2xl text-navy sm:text-3xl">{title.text}</h2>
        <p className="m-0 text-sm text-muted">
          {t('meta.narrator')}: <span lang={narrator.lang} className="font-bold text-ink">{narrator.text}</span>
          {history.narrator.pseudonym && <span className="block text-xs">{t('meta.anonymised')}</span>}
        </p>

        <audio ref={audioRef} preload="none" className="hidden">
          {history.audio.sources.map((source) => <source key={source.src} src={source.src} type={source.type} />)}
        </audio>

        <div className="mt-5 rounded-2xl bg-night p-4 text-white sm:p-5">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <button type="button" onClick={() => skip(-SKIP_SECONDS)} aria-label={t('player.skipBack', { count: SKIP_SECONDS })} className="grid size-11 place-items-center rounded-full text-white hover:bg-white/10">
              <SkipIcon direction="back" />
            </button>
            <button
              type="button"
              onClick={toggle}
              aria-label={isPlaying ? t('player.pause') : t('player.play')}
              className="grid size-16 place-items-center rounded-full bg-sun text-night shadow-lg transition-transform hover:bg-white motion-safe:active:scale-95"
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button type="button" onClick={() => skip(SKIP_SECONDS)} aria-label={t('player.skipForward', { count: SKIP_SECONDS })} className="grid size-11 place-items-center rounded-full text-white hover:bg-white/10">
              <SkipIcon direction="forward" />
            </button>
          </div>

          <div className="relative mt-5">
            {/* Buffered range, drawn under the native slider. */}
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/15" aria-hidden="true">
              <div className="h-full rounded-full bg-white/35" style={{ width: `${bufferedPercent}%` }} />
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(1, Math.floor(safeDuration))}
              step={1}
              value={Math.floor(currentTime)}
              onChange={(event) => seek(Number(event.target.value))}
              aria-label={t('player.seek')}
              aria-valuetext={t('player.position', { current: clockNow, total: clockTotal })}
              className="relative block h-6 w-full cursor-pointer accent-sun"
            />
          </div>

          <div className="mt-1 flex items-center justify-between gap-3 font-mono text-xs text-white/80 tabular-nums">
            <span>{clockNow}</span>
            <label htmlFor={speedId} className="flex items-center gap-2 font-sans">
              {t('player.speed')}
              <select
                id={speedId}
                value={playbackRate}
                onChange={(event) => setPlaybackRate(Number(event.target.value))}
                className="m-0 w-auto rounded border-0 bg-white/10 px-2 py-1 text-xs text-white"
              >
                {PLAYBACK_RATES.map((rate) => <option key={rate} value={rate} className="text-ink">{rate}×</option>)}
              </select>
            </label>
            <span>{clockTotal}</span>
          </div>
        </div>

        <p className="mt-3 mb-0 min-h-5 text-sm text-muted" role="status" aria-live="polite">
          {status === 'error' ? <span className="font-bold text-coral">{t('player.error')}</span>
            : status === 'buffering' || status === 'loading' ? t('player.buffering')
              : status === 'idle' ? t('player.dataNote') : null}
        </p>

        {history.audio.download && (
          <a href={history.audio.download.src} download className="mt-3 inline-flex min-h-11 items-center self-start rounded-lg border border-navy/30 px-3.5 text-sm font-bold text-navy no-underline hover:bg-mint">
            {downloadSize ? t('player.download', { size: downloadSize }) : t('player.downloadNoSize')}
          </a>
        )}
      </div>

      <TranscriptPanel segments={history.transcript} activeIndex={activeIndex} onSeek={seekAndPlay} />
    </article>
  );
}

function PlayIcon() {
  return <svg viewBox="0 0 24 24" className="ml-1 size-7" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.6-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" /></svg>;
}

function PauseIcon() {
  return <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>;
}

function SkipIcon({ direction }: { direction: 'back' | 'forward' }) {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Mirror only the arrow, so the number stays readable. */}
      <g transform={direction === 'forward' ? 'matrix(-1 0 0 1 24 0)' : undefined}>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
      </g>
      <text x="12" y="15.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor" stroke="none">{SKIP_SECONDS}</text>
    </svg>
  );
}
