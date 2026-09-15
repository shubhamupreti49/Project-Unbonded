import { useCallback, useEffect, useRef, useState } from 'react';

export type AudioStatus = 'idle' | 'loading' | 'ready' | 'buffering' | 'error';

/**
 * Wraps a native <audio> element in React state. The element stays the single source of
 * truth; this hook mirrors its events and exposes a small command API, so we get the
 * browser's streaming, range requests, lock-screen controls and battery-friendly decoding
 * for free, while drawing our own accessible controls.
 */
export function useAudioPlayer(knownDuration = 0) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<AudioStatus>('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(knownDuration);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [playbackRate, setPlaybackRateState] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const syncBuffered = () => {
      const { buffered } = audio;
      setBufferedEnd(buffered.length ? buffered.end(buffered.length - 1) : 0);
    };

    const handlers: Record<string, () => void> = {
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      ended: () => setIsPlaying(false),
      timeupdate: () => setCurrentTime(audio.currentTime),
      seeked: () => setCurrentTime(audio.currentTime),
      durationchange: () => { if (Number.isFinite(audio.duration)) setDuration(audio.duration); },
      loadstart: () => setStatus((current) => (current === 'idle' ? current : 'loading')),
      waiting: () => setStatus('buffering'),
      canplay: () => setStatus('ready'),
      playing: () => setStatus('ready'),
      progress: syncBuffered,
      ratechange: () => setPlaybackRateState(audio.playbackRate),
    };

    // With <source> children, failures fire on each <source> (and don't bubble), so listen in
    // the capture phase and only give up once the last candidate has failed.
    const onError = (event: Event) => {
      if (event.target === audio || event.target === audio.querySelector('source:last-of-type')) {
        setStatus('error');
        setIsPlaying(false);
      }
    };

    Object.entries(handlers).forEach(([event, handler]) => audio.addEventListener(event, handler));
    audio.addEventListener('error', onError, true);
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => audio.removeEventListener(event, handler));
      audio.removeEventListener('error', onError, true);
    };
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setStatus((current) => (current === 'idle' || current === 'error' ? 'loading' : current));
    // After every source failed (e.g. the connection dropped), re-run source selection.
    if (audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) audio.load();
    try {
      await audio.play();
    } catch (error) {
      // NotAllowedError = autoplay policy (not a load failure); anything else is a real error.
      if ((error as DOMException).name !== 'NotAllowedError' && (error as DOMException).name !== 'AbortError') setStatus('error');
    }
  }, []);

  const pause = useCallback(() => audioRef.current?.pause(), []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void play(); else audio.pause();
  }, [play]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const limit = Number.isFinite(audio.duration) ? audio.duration : duration;
    const next = Math.min(Math.max(time, 0), limit || time);
    audio.currentTime = next;
    setCurrentTime(next); // update the UI immediately, even before metadata has loaded
  }, [duration]);

  const skip = useCallback((seconds: number) => seek((audioRef.current?.currentTime ?? 0) + seconds), [seek]);

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, []);

  return { audioRef, status, isPlaying, currentTime, duration, bufferedEnd, playbackRate, play, pause, toggle, seek, skip, setPlaybackRate };
}
