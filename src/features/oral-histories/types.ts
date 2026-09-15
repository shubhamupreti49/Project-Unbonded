import type { LanguageCode } from '../../i18n/languages';
import type { LocalizedText } from '../../lib/localized';
import type { CommunityId, RegionId } from '../library/vocabulary';

export type TranscriptSegment = {
  id: string;
  /** Seconds from the start of the recording. */
  start: number;
  end: number;
  speaker?: LocalizedText;
  /** Per-language text. Missing languages render as "translation pending". */
  text: Partial<Record<LanguageCode, string>>;
};

export type AudioSource = {
  /** Path under /public, e.g. "media/oral-histories/uah-001-24k.opus". */
  src: string;
  /** MIME type with codecs, so browsers skip formats they can't play without downloading. */
  type: string;
};

export type OralHistory = {
  id: string;
  title: LocalizedText;
  narrator: {
    displayName: LocalizedText;
    /** True when the name is a pseudonym. Shown to readers. */
    pseudonym: boolean;
  };
  community: CommunityId;
  region: RegionId;
  /** ISO date (YYYY-MM-DD). */
  recordedOn: string;
  /** Known in advance so the player can show the length before any audio downloads. */
  durationSeconds: number;
  audio: {
    /** Listed smallest-first; the browser plays the first type it supports. */
    sources: AudioSource[];
    /** Optional offline copy, e.g. for listening later without a connection. */
    download?: { src: string; sizeBytes?: number };
  };
  /** Only publish recordings whose consent covers online release. */
  consent: 'public-online';
  transcript: TranscriptSegment[];
};
