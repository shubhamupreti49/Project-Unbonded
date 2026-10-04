import { useTranslation } from 'react-i18next';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { data } from '../../data/sources.js';
import { formatYear } from '../lib/format';
import { Layout } from '../main.jsx';

type EventTranslation = { title: string; text: string };

function History() {
  const { t, i18n } = useTranslation('timeline');
  // Nepali event text lives in locales/ne/timeline.json, keyed by year; English comes from the data.
  const translations = t('events', { returnObjects: true }) as Record<string, EventTranslation | undefined>;

  return <div className="timeline" aria-label={t('history.label')}>
    {[...data.events].sort((a, b) => b.year - a.year).map((event) => {
      const translated = translations?.[String(event.year)];
      const title = translated?.title ?? event.title;
      const text = translated?.text ?? event.text;
      const lang = translated ? i18n.language : 'en';
      return <article className="time-item" key={`${event.year}-${event.title}`}>
        <div className="time-year">{formatYear(event.year, i18n.language)}</div>
        <div className="time-card">
          <p className="timeline-label">{t('history.recordType')}</p>
          <h3 lang={lang}>{event.url ? <a className="timeline-record-link" href={event.url} target="_blank" rel="noreferrer">{title}</a> : title}</h3>
          <p lang={lang}>{text}</p>
          {event.url && <span className="record-link-note">{t('history.legalText')}</span>}
        </div>
      </article>;
    })}
  </div>;
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
