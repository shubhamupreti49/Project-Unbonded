import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { data } from '../../data/sources.js';
import { formatDate, formatMonth, formatNumber, formatYear } from '../lib/format';
import { Layout } from '../main.jsx';
import { recordPath } from '../seo/site.js';

type EventSource = { record?: string; label?: string; url?: string };
type TimelineEvent = { id: string; date: string; kind: string; title: string; text: string; sources: EventSource[] };
type EventTranslation = { title: string; text: string };

const KINDS = ['law', 'declaration', 'movement', 'international', 'research'] as const;
const EVENTS = [...(data.events as TimelineEvent[])].sort((a, b) => a.date.localeCompare(b.date));
const yearOf = (event: TimelineEvent) => Number(event.date.slice(0, 4));
// A record is named by its title (up to any subtitle), so two works by the same organisation stay distinct.
const shortTitle = (title: string) => { const main = title.split(':')[0].trim(); return main.length > 70 ? `${main.slice(0, 68).trimEnd()}…` : main; };

/** Dates are stored as precisely as the source allows: "1926", "2002-01" or "2000-07-17". */
function eventDate(date: string, language: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return formatDate(date, language);
  if (/^\d{4}-\d{2}$/.test(date)) return formatMonth(date, language);
  return formatYear(Number(date), language) ?? date;
}

function Sources({ sources }: { sources: EventSource[] }) {
  const { t, i18n } = useTranslation('timeline');
  return <p className="timeline-sources">
    {t('history.sources')}{' '}
    {sources.map((source, index) => {
      const record = source.record ? data.sources.find((entry) => entry.id === source.record) : undefined;
      const separator = index > 0 ? '; ' : '';
      // The year is added unless the title already carries it, as an Act's title does.
      if (record) return <span key={source.record}>{separator}<Link to={recordPath(record.id)} lang="en">{shortTitle(record.title)}</Link>{record.year && record.title.includes(String(record.year)) ? '' : ` (${formatYear(record.year, i18n.language) ?? 'n.d.'})`}</span>;
      if (source.url) return <span key={source.url}>{separator}<a href={source.url} target="_blank" rel="noreferrer" lang="en">{source.label} ↗</a></span>;
      return <span key={source.label} lang="en">{separator}{source.label}</span>;
    })}
  </p>;
}

function History() {
  const { t, i18n } = useTranslation('timeline');
  const [kind, setKind] = useState<string>('all');
  // Nepali event text lives in locales/ne/timeline.json, keyed by event id; English comes from the data.
  const translations = t('events', { returnObjects: true }) as Record<string, EventTranslation | undefined>;
  const shown = kind === 'all' ? EVENTS : EVENTS.filter((event) => event.kind === kind);

  return <>
    <ul className="timeline-filters" aria-label={t('filters.label')}>
      {['all', ...KINDS].map((value) => <li key={value}>
        <button type="button" aria-pressed={kind === value} onClick={() => setKind(value)}>
          {t(`kinds.${value}`)} ({formatNumber(value === 'all' ? EVENTS.length : EVENTS.filter((event) => event.kind === value).length, i18n.language)})
        </button>
      </li>)}
    </ul>
    <div className="timeline" aria-label={t('history.label')}>
      {shown.map((event) => {
        const translated = translations?.[event.id];
        const lang = translated ? i18n.language : 'en';
        return <article className="time-item" key={event.id} id={event.id}>
          <div className="time-year">{formatYear(yearOf(event), i18n.language)}</div>
          <div className="time-card">
            <p className="timeline-kind">{t(`kinds.${event.kind}`)}</p>
            {/* A bare year is already shown beside the card. */}
            {event.date.length > 4 && <p className="timeline-date">{eventDate(event.date, i18n.language)}</p>}
            <h3 lang={lang}>{translated?.title ?? event.title}</h3>
            <p lang={lang}>{translated?.text ?? event.text}</p>
            <Sources sources={event.sources} />
          </div>
        </article>;
      })}
    </div>
  </>;
}

export default function TimelinePage() {
  const { t } = useTranslation('timeline');
  const [params] = useSearchParams();
  // The publication record now lives in Research, sorted by date; old links follow it there.
  if (params.get('view') === 'publications') return <Navigate replace to="/research?sort=newest" />;

  return <Layout active="timeline" className="timeline-page">
    <section className="timeline-stage">
      <div className="shell">
        <p className="timeline-index">{t('hero.eyebrow')}</p>
        <h1>{t('hero.title')}</h1>
        <p>{t('hero.lead')}</p>
        <Link className="timeline-papers-link" to="/research?sort=newest">{t('hero.papersLink')} <span aria-hidden="true">→</span></Link>
      </div>
    </section>
    <section className="timeline-canvas">
      <div className="shell"><History /></div>
    </section>
  </Layout>;
}
