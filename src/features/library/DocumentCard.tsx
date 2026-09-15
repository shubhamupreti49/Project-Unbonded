import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toLanguageCode } from '../../i18n/languages';
import { formatBytes, formatYear } from '../../lib/format';
import { useLocalizedText } from '../../lib/localized';
import type { ArchiveDocument } from './types';
import { useVocabLabel } from './useVocabLabel';
import { COMMUNITY_STYLES } from './vocabulary';

/*
 * ── Preparing PDFs for slow cellular networks ──────────────────────────────────────────
 * Many reports in this archive are scanned or image-heavy: the CSRC Harawa-Charawa study
 * is 26.6 MB, several minutes on a rural 3G connection. Before hosting a PDF:
 *
 *  1. Compress images to screen resolution (≈150 dpi) with Ghostscript:
 *       gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.5 -dPDFSETTINGS=/ebook \
 *          -dNOPAUSE -dQUIET -dBATCH -sOutputFile=report-web.pdf report.pdf
 *     Use /screen (72 dpi) for the `lowBandwidthUrl` copy; typical savings are 70–90%.
 *  2. Linearise ("Fast Web View") so browsers can show page 1 before the whole file lands
 *     and fetch later pages with HTTP range requests:
 *       qpdf --linearize report-web.pdf report-web-linear.pdf
 *  3. For scans, OCR once so the text is searchable and screen-reader accessible:
 *       ocrmypdf --optimize 3 --language nep+eng scan.pdf scan-ocr.pdf
 *  4. Record `sizeBytes` (and `pageCount`) in documents.json. The card shows the size
 *     before download, so readers paying per MB can choose the low-data copy.
 *  5. Datasets: publish CSV (gzip-compressible, opens on any phone) alongside XLSX.
 *
 * GitHub Pages serves files up to 100 MB, but anything over ~10 MB belongs on a storage
 * host with range-request support (e.g. a GitHub Release asset or Cloudflare R2).
 * ──────────────────────────────────────────────────────────────────────────────────────
 */

export function DocumentCard({ document }: { document: ArchiveDocument }) {
  const { t, i18n } = useTranslation('library');
  const language = toLanguageCode(i18n.resolvedLanguage);
  const localize = useLocalizedText();
  const vocabLabel = useVocabLabel();

  const title = localize(document.title);
  const summary = document.summary ? localize(document.summary) : null;
  const year = formatYear(document.publicationYear, language);
  const fileSize = formatBytes(document.file?.sizeBytes, language);
  const lowDataSize = formatBytes(document.file?.lowBandwidthSizeBytes, language);
  const titleClass = 'text-navy no-underline decoration-coral decoration-2 underline-offset-4 hover:underline focus-visible:underline';

  return (
    <article
      // content-visibility lets the browser skip layout/paint for off-screen cards, which
      // keeps scrolling smooth on low-end Android phones once the archive grows large.
      className="ua group flex h-full flex-col rounded-2xl border border-rule bg-paper p-5 shadow-[0_1px_2px_#08233b0f] transition duration-200 [contain-intrinsic-size:auto_320px] [content-visibility:auto] focus-within:ring-2 focus-within:ring-aqua hover:border-aqua/50 hover:shadow-[0_14px_30px_#08233b1a] motion-safe:hover:-translate-y-0.5 sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs">
        <span className="tw-eyebrow rounded bg-navy px-2 py-1 font-bold tracking-wide text-white uppercase">
          {vocabLabel('documentType', document.documentType)}
        </span>
        <span className="text-muted">{year ?? t('card.yearUnknown')}</span>
      </div>

      <h3 lang={title.lang} className="mt-3 mb-2 text-lg leading-snug sm:text-xl">
        {document.sourceRecordId
          ? <Link className={titleClass} to={`/source?id=${encodeURIComponent(document.sourceRecordId)}`}>{title.text}</Link>
          : <span className="text-navy">{title.text}</span>}
      </h3>

      <p className="m-0 text-sm font-bold text-coral">{document.author}</p>

      <p className="mt-1 mb-0 text-sm text-muted">
        {document.regions.map((region) => vocabLabel('region', region)).join(' · ')}
        {document.geographyNote && <span lang="en"> — {document.geographyNote}</span>}
      </p>

      {summary && <p lang={summary.lang} className="mt-3 mb-0 text-[0.95rem] text-ink/90">{summary.text}</p>}

      <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0" aria-label={t('filters.community')}>
        {document.communities.map((community) => (
          <li key={community} className={`rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${COMMUNITY_STYLES[community]}`}>
            {vocabLabel('community', community)}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {document.file && (
          <a
            href={document.file.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-coral px-3.5 text-sm font-bold text-white no-underline transition-colors hover:bg-navy"
          >
            {t('card.openFile', { format: document.file.format.toUpperCase() })}
            {fileSize && <span className="font-normal opacity-90">· {fileSize}</span>}
          </a>
        )}
        {document.file?.lowBandwidthUrl && (
          <a
            href={document.file.lowBandwidthUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-navy/30 px-3.5 text-sm font-bold text-navy no-underline hover:bg-mint"
          >
            {t('card.lowData')}
            {lowDataSize && <span className="font-normal">· {lowDataSize}</span>}
          </a>
        )}
        {!document.file && document.externalUrl && (
          <a
            href={document.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-navy/30 px-3.5 text-sm font-bold text-navy no-underline hover:bg-mint"
          >
            {t('card.original')} <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}
