import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toLanguageCode } from '../../i18n/languages';
import { useDataLabel } from '../../i18n/useDataLabel';
import { formatBytes, formatYear } from '../../lib/format';
import { useVocabLabel } from '../library/useVocabLabel';
import { COMMUNITY_STYLES } from '../library/vocabulary';
import { recordPath } from '../../seo/site.js';
import { SYSTEM_COMMUNITY, type ResearchRecord } from './researchIndex';

/*
 * ── Preparing PDFs for slow cellular networks ──────────────────────────────────────────
 * Many reports in this archive are scanned or image-heavy: the CSRC Harawa-Charawa study
 * is 26.6 MB, several minutes on a rural 3G connection. Before hosting a PDF:
 *
 *  1. Compress images to screen resolution (≈150 dpi) with Ghostscript:
 *       gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.5 -dPDFSETTINGS=/ebook \
 *          -dNOPAUSE -dQUIET -dBATCH -sOutputFile=report-web.pdf report.pdf
 *  2. Linearise ("Fast Web View") so browsers can show page 1 before the whole file lands:
 *       qpdf --linearize report-web.pdf report-web-linear.pdf
 *  3. For scans, OCR once so the text is searchable and screen-reader accessible:
 *       ocrmypdf --optimize 3 --language nep+eng scan.pdf scan-ocr.pdf
 *  4. Record `file.sizeBytes` in features/library/documents.json. The card shows the size
 *     before download, so readers paying per MB can decide.
 *
 * GitHub Pages serves files up to 100 MB, but anything over ~10 MB belongs on a storage
 * host with range-request support (e.g. a GitHub Release asset or Cloudflare R2).
 * ──────────────────────────────────────────────────────────────────────────────────────
 */

const buttonBase = 'inline-flex min-h-11 items-center gap-2 rounded-lg px-3.5 text-sm font-bold no-underline transition-colors';

// Titles, authors, places and findings stay in the language they were published in (lang="en").
export function ResearchCard({ record }: { record: ResearchRecord }) {
  const { t, i18n } = useTranslation('research');
  const language = toLanguageCode(i18n.resolvedLanguage);
  const dataLabel = useDataLabel();
  const vocabLabel = useVocabLabel();
  const { source, document, pdf, originalUrl } = record;
  const recordUrl = recordPath(source.id);
  const year = formatYear(source.year, language) ?? t('card.yearUnknown');
  const pdfSize = formatBytes(pdf?.sizeBytes, language);
  const finding = source.claims?.[0] || source.claim;

  return (
    <article className="ua rounded-2xl border border-rule bg-paper p-5 shadow-[0_1px_2px_#08233b0f] transition duration-200 [contain-intrinsic-size:auto_260px] [content-visibility:auto] focus-within:ring-2 focus-within:ring-aqua hover:border-aqua/50 hover:shadow-[0_14px_30px_#08233b1a] sm:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs">
        {document && <span className="tw-eyebrow rounded bg-navy px-2 py-1 font-bold tracking-wide text-white uppercase">{vocabLabel('documentType', document.documentType)}</span>}
        <span className="text-muted">{year}{source.methodType && source.methodType !== 'Unspecified' && <> · {dataLabel(source.methodType)}</>}</span>
        <span className={`tw-eyebrow rounded px-2 py-1 font-bold tracking-wide uppercase ${pdf ? 'bg-coral/15 text-[#a3432c]' : 'bg-mint text-navy'}`}>{pdf ? t('card.pdf') : t('card.webPage')}</span>
      </div>

      <h3 lang="en" className="mt-3 mb-1.5 text-xl leading-snug sm:text-[1.4rem]">
        <Link to={recordUrl} className="text-navy no-underline decoration-coral decoration-2 underline-offset-4 hover:underline focus-visible:underline">{source.title}</Link>
      </h3>
      <p lang="en" className="m-0 text-sm font-bold text-coral">{source.author}</p>
      {source.geography && <p lang="en" className="mt-1 mb-0 text-sm text-muted">{source.geography}</p>}
      {finding ? <p lang="en" className="mt-3 mb-0 line-clamp-3 text-[0.97rem] text-ink/90">{finding}</p> : <p className="mt-3 mb-0"><span className="findings-pending">{t('card.findingsPending')}</span></p>}

      <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0" aria-label={t('card.tags')}>
        {(source.systems ?? []).map((system) => {
          const community = SYSTEM_COMMUNITY[system];
          return <li key={system} className={`rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${community ? COMMUNITY_STYLES[community] : 'bg-white text-navy ring-navy/20'}`}>{dataLabel(system)}</li>;
        })}
        {(source.themes ?? []).map((theme) => <li key={theme} className="rounded-full bg-white px-2.5 py-0.5 text-xs text-muted ring-1 ring-rule">{dataLabel(theme)}</li>)}
      </ul>

      <div className="mt-5 flex flex-wrap gap-2">
        {pdf && (
          <a href={pdf.url} target="_blank" rel="noreferrer" className={`${buttonBase} bg-coral text-white hover:bg-navy`}>
            {t('card.openPdf')}{pdfSize && <span className="font-normal opacity-90">· {pdfSize}</span>}
          </a>
        )}
        {!pdf && originalUrl && (
          <a href={originalUrl} target="_blank" rel="noreferrer" className={`${buttonBase} bg-coral text-white hover:bg-navy`}>
            {t('card.original')} <span aria-hidden="true">↗</span>
          </a>
        )}
        <Link to={recordUrl} className={`${buttonBase} border border-navy/30 text-navy hover:bg-mint`}>
          {t('card.details')} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
