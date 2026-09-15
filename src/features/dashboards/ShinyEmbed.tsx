import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNetworkProfile } from '../../hooks/useNetworkProfile';

/**
 * Embeds an R Shiny app (shinyapps.io, Posit Connect or a self-hosted Shiny Server) so it
 * feels native to the site.
 *
 * What it handles:
 *  1. Deferred loading. A Shiny app pulls ~1–3 MB of JS/CSS and holds a WebSocket open.
 *     The iframe is created only when the container nears the viewport, and on Data Saver
 *     or 2G connections only after the reader taps "Load dashboard".
 *  2. Loading states. Free/Starter shinyapps.io instances sleep when idle, so a cold start
 *     can take 20–60 s. After `slowAfterMs` we explain the wait; after `timeoutMs` we offer
 *     a retry and a link to open the app directly.
 *  3. Sizing. Cross-origin iframes can't be measured from the parent page, so:
 *       - by default the frame uses a mobile-first CSS height (tall on phones, where Shiny's
 *         Bootstrap layout stacks the sidebar above the plot; 16:10 from `md` upward);
 *       - if the Shiny app includes integrations/shiny/unbonded_embed.R, it posts its real
 *         content height and the frame grows or shrinks to fit, with no inner scrollbar.
 *  4. Security. Height messages are accepted only from this iframe's window and origin.
 */
export type ShinyEmbedProps = {
  /** Full URL of the Shiny app. An empty string renders a "not yet published" placeholder. */
  src: string;
  /** Accessible name for the iframe, e.g. "Kamaiya rehabilitation dashboard". */
  title: string;
  /** Approximate transfer size shown on the load prompt, e.g. "2 MB". */
  estimatedSize?: string;
  /** Static fallback (PDF or image summary) for readers who can't load the live app. */
  staticVersionUrl?: string;
  /** 'visible' (default): load when scrolled near. 'click': always wait for a tap. */
  loadStrategy?: 'visible' | 'click';
  slowAfterMs?: number;
  timeoutMs?: number;
};

type EmbedStatus = 'idle' | 'loading' | 'slow' | 'ready' | 'error';

const RESIZE_MESSAGE = 'unbonded:shiny-resize';
const MIN_HEIGHT = 320;
const MAX_HEIGHT = 6000;

function originOf(url: string): string | null {
  try {
    return new URL(url, window.location.href).origin;
  } catch {
    return null;
  }
}

export function ShinyEmbed({
  src,
  title,
  estimatedSize,
  staticVersionUrl,
  loadStrategy = 'visible',
  slowAfterMs = 8000,
  timeoutMs = 60000,
}: ShinyEmbedProps) {
  const { t } = useTranslation('dashboards');
  const { isConstrained } = useNetworkProfile();
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [status, setStatus] = useState<EmbedStatus>('idle');
  const [attempt, setAttempt] = useState(0);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  const waitForTap = loadStrategy === 'click' || isConstrained;
  const isBusy = status === 'loading' || status === 'slow';

  const startLoading = useCallback(() => {
    setContentHeight(null);
    setStatus('loading');
  }, []);

  // 1. Start loading when the container approaches the viewport (unless waiting for a tap).
  useEffect(() => {
    if (!src || waitForTap || status !== 'idle') return undefined;
    const container = containerRef.current;
    if (!container || !('IntersectionObserver' in window)) {
      startLoading();
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        startLoading();
      }
    }, { rootMargin: '300px 0px' });
    observer.observe(container);
    return () => observer.disconnect();
  }, [src, waitForTap, status, startLoading]);

  // 2. Escalate from "loading" to "slow" to "error" if the iframe never fires onLoad.
  // Keyed on `isBusy` (not `status`) so moving from "loading" to "slow" keeps the same timers.
  useEffect(() => {
    if (!isBusy) return undefined;
    const slowTimer = window.setTimeout(() => setStatus((current) => (current === 'loading' ? 'slow' : current)), slowAfterMs);
    const failTimer = window.setTimeout(() => setStatus((current) => (current === 'ready' ? current : 'error')), timeoutMs);
    return () => {
      window.clearTimeout(slowTimer);
      window.clearTimeout(failTimer);
    };
  }, [isBusy, attempt, slowAfterMs, timeoutMs]);

  // 3. Listen for height reports from the embedded Shiny app.
  useEffect(() => {
    const expectedOrigin = originOf(src);
    if (!expectedOrigin) return undefined;

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== expectedOrigin || event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data as { type?: unknown; height?: unknown } | null;
      if (data?.type !== RESIZE_MESSAGE || typeof data.height !== 'number' || !Number.isFinite(data.height)) return;
      setContentHeight(Math.min(Math.max(Math.ceil(data.height), MIN_HEIGHT), MAX_HEIGHT));
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [src]);

  const retry = () => {
    setAttempt((value) => value + 1); // new `key` → fresh iframe and a fresh connection
    startLoading();
  };

  if (!src) {
    return (
      <div className="ua grid min-h-60 place-items-center rounded-2xl border border-dashed border-navy/25 bg-paper p-6 text-center text-muted">
        {t('embed.notPublished')}
      </div>
    );
  }

  const showFrame = isBusy || status === 'ready';

  return (
    <div className="ua">
      <div
        ref={containerRef}
        // Reserve space before anything loads so the page doesn't jump (no layout shift).
        // Mobile-first: phones get a tall frame; md+ uses a 16:10 box. A reported content
        // height from the Shiny app overrides both.
        className={`relative w-full overflow-hidden rounded-2xl border border-rule bg-paper ${contentHeight ? '' : 'h-[80svh] max-h-[900px] min-h-[480px] md:aspect-[16/10] md:h-auto md:min-h-0'}`}
        style={contentHeight ? { height: contentHeight } : undefined}
        aria-busy={isBusy}
      >
        {showFrame && (
          <iframe
            key={attempt}
            ref={iframeRef}
            src={src}
            title={title}
            onLoad={() => setStatus('ready')}
            // allow-same-origin is required for Shiny's WebSocket/session cookies; the app runs
            // on its own origin, so it still can't read this page. allow-downloads enables
            // Shiny downloadHandler() buttons (CSV exports).
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
            allow="fullscreen; clipboard-write"
            referrerPolicy="strict-origin-when-cross-origin"
            scrolling={contentHeight ? 'no' : 'auto'}
            className={`absolute inset-0 block h-full w-full border-0 bg-white transition-opacity duration-300 ${status === 'ready' ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {status !== 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center" role="status" aria-live="polite">
            {status === 'idle' && (
              <>
                <ChartGlyph />
                <p className="m-0 max-w-sm text-sm text-muted">
                  {estimatedSize ? t('embed.loadPrompt', { size: estimatedSize }) : t('embed.loadPromptNoSize')}
                </p>
                {isConstrained && <p className="m-0 max-w-sm text-xs text-muted">{t('embed.dataSaver')}</p>}
                <button type="button" onClick={startLoading} className="min-h-11 rounded-lg bg-navy px-5 font-bold text-white hover:bg-coral">
                  {t('embed.load')}
                </button>
              </>
            )}

            {isBusy && (
              <>
                <span className="size-10 rounded-full border-4 border-navy/15 border-t-aqua motion-safe:animate-spin" aria-hidden="true" />
                <p className="m-0 max-w-sm text-sm font-bold text-navy">{t('embed.loading')}</p>
                {status === 'slow' && <p className="m-0 max-w-sm text-sm text-muted">{t('embed.slow')}</p>}
              </>
            )}

            {status === 'error' && (
              <>
                <p className="m-0 max-w-sm font-bold text-navy">{t('embed.error')}</p>
                <button type="button" onClick={retry} className="min-h-11 rounded-lg bg-navy px-5 font-bold text-white hover:bg-coral">
                  {t('embed.retry')}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <a href={src} target="_blank" rel="noreferrer" className="font-bold text-aqua underline-offset-4 hover:underline">
          {t('embed.openNewTab')} <span aria-hidden="true">↗</span>
        </a>
        {staticVersionUrl && (
          <a href={staticVersionUrl} target="_blank" rel="noreferrer" className="font-bold text-aqua underline-offset-4 hover:underline">
            {t('embed.staticVersion')}
          </a>
        )}
      </div>
    </div>
  );
}

function ChartGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="size-12 text-aqua" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <path d="M6 42h36" />
      <path d="M12 34V22M20 34V12M28 34V26M36 34V16" />
    </svg>
  );
}
