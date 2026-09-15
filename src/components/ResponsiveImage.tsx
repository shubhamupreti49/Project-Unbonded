import type { ImgHTMLAttributes } from 'react';

/**
 * Responsive, bandwidth-aware image.
 *
 * ── Preparing image assets for slow cellular networks ──────────────────────────────────
 * The current /assets folder ships a 916 KB PNG and a 623 KB JPEG. On a 3G connection
 * (~400 kbps) a single one of those takes 10–20 seconds. For every photograph:
 *
 *  1. Export several widths and let the browser pick the smallest adequate one:
 *       480w (phones), 960w (tablets / 2x phones), 1600w (desktop hero only).
 *  2. Encode modern formats first, with a JPEG fallback:
 *       avifenc --min 20 --max 32 -s 6 hero-960.png hero-960.avif     (≈60–80% smaller than JPEG)
 *       cwebp -q 72 hero-960.png -o hero-960.webp                       (≈30% smaller than JPEG)
 *       cjpeg -quality 75 -progressive hero-960.ppm > hero-960.jpg      (progressive renders early)
 *     Or all at once with the sharp CLI: `npx sharp-cli -i hero.png -o out/ resize 960 -f avif`.
 *  3. Never use PNG for photographs; keep PNG/SVG for diagrams and logos only.
 *  4. Strip EXIF metadata (it can also leak GPS coordinates of fieldwork locations).
 *  5. Budget: < 100 KB for a hero at 960w, < 40 KB for card thumbnails.
 *
 * Always pass `width` and `height` (the intrinsic aspect ratio) so space is reserved
 * before the bytes arrive, and keep `loading="lazy"` for anything below the fold. Only the
 * single above-the-fold hero image should use `priority`.
 * ──────────────────────────────────────────────────────────────────────────────────────
 */
type ImageVariant = {
  /** e.g. "media/hero" → media/hero-480.avif, media/hero-960.webp, media/hero-1600.jpg */
  basePath: string;
  widths: number[];
};

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & ImageVariant & {
  alt: string;
  width: number;
  height: number;
  /** Rendered width hint for the browser, e.g. "(min-width: 1024px) 33vw, 100vw". */
  sizes: string;
  /** Load eagerly with high fetch priority. Use for one above-the-fold image at most. */
  priority?: boolean;
};

const buildSrcSet = (basePath: string, widths: number[], extension: string) =>
  widths.map((width) => `${basePath}-${width}.${extension} ${width}w`).join(', ');

export function ResponsiveImage({ basePath, widths, sizes, priority = false, alt, width, height, className, ...rest }: ResponsiveImageProps) {
  const fallbackWidth = widths[Math.min(1, widths.length - 1)];

  return (
    <picture>
      <source type="image/avif" srcSet={buildSrcSet(basePath, widths, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={buildSrcSet(basePath, widths, 'webp')} sizes={sizes} />
      <img
        {...rest}
        src={`${basePath}-${fallbackWidth}.jpg`}
        srcSet={buildSrcSet(basePath, widths, 'jpg')}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className={className}
      />
    </picture>
  );
}
