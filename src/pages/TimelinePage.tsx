import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { data } from '../../data/sources.js';
import { OriginalLanguageNotice } from '../components/OriginalLanguageNotice';
import { useDataLabel } from '../i18n/useDataLabel';
import { formatYear, localizeDigits } from '../lib/format';
import { Layout } from '../main.jsx';

type Source = (typeof data.sources)[number];
type EventTranslation = { title: string; text: string };

const systems = ['Kamaiya', 'Haliya', 'Haruwa-Charuwa', 'Kamlari', 'Cross-system / general'];
const periods = ['2000', '2005', '2010', '2015', '2020', '2025'];

function updateParam(params: URLSearchParams, key: string, value: string) {
  const next = new URLSearchParams(params);
  if (value) next.set(key, value); else next.delete(key);
  return next;
}

function RecordLink({ source }: { source: Source }) {
  return <Link className="source-title-link" to={`/source?id=${encodeURIComponent(source.id)}`}>{source.title}</Link>;
}

function PublicationCard({ source }: { source: Source }) {
  const { t, i18n } = useTranslation('timeline');
  const dataLabel = useDataLabel();
  const year = formatYear(source.year, i18n.language);
  return <article className="pub-card source-card">
    <div className="publication-year" aria-label={t('publications.published', { year })}>{year}</div>
    <p className="source-author" lang="en">{source.author}</p>
    <h3 lang="en"><RecordLink source={source} /></h3>
    <p className="source-meta">{dataLabel(source.methodType)} · <span lang="en">{source.geography}</span></p>
    <p className="source-claim" lang="en">{source.claims?.[0] || source.claim}</p>
    <div className="source-footer">{[...(source.systems || []), ...(source.themes || [])].slice(0, 5).map((value) => <span className="chip" key={value}>{dataLabel(value)}</span>)}</div>
  </article>;
}

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
  const { t, i18n } = useTranslation('timeline');
  const dataLabel = useDataLabel();
  const [params, setParams] = useSearchParams();
  const view = params.get('view') === 'publications' ? 'publications' : 'history';
  const system = params.get('system') || '';
  const period = params.get('period') || '';
  const records = useMemo(() => data.sources.filter((source) => source.year && (!system || source.systems?.includes(system)) && (!period || (source.year >= Number(period) && source.year < Number(period) + 5))).sort((a, b) => (b.year || 0) - (a.year || 0)), [system, period]);
  const selectView = (nextView: 'history' | 'publications') => setParams((current) => updateParam(current, 'view', nextView === 'publications' ? 'publications' : ''));
  const setFilter = (name: string, value: string) => setParams((current) => updateParam(current, name, value), { replace: true });
  const resetFilters = () => setParams({ view: 'publications' }, { replace: true });
  const periodLabel = (start: string) => localizeDigits(`${start}–${String(Number(start) + 4).slice(-2)}`, i18n.language);

  return <Layout active="timeline" className="timeline-page">
    <section className="timeline-stage">
      <div className="shell">
        <p className="timeline-index">{t('hero.eyebrow')}</p>
        <h1>{t('hero.title')}</h1>
        <p>{t('hero.lead')}</p>
        <div className="timeline-tabs" role="tablist" aria-label={t('tabs.label')}>
          <button id="history-tab" className={`tab ${view === 'history' ? 'active' : ''}`} type="button" role="tab" aria-selected={view === 'history'} aria-controls="timeline-panel" onClick={() => selectView('history')}>{t('tabs.history')}</button>
          <button id="publications-tab" className={`tab ${view === 'publications' ? 'active' : ''}`} type="button" role="tab" aria-selected={view === 'publications'} aria-controls="timeline-panel" onClick={() => selectView('publications')}>{t('tabs.publications')}</button>
        </div>
      </div>
    </section>
    <section className="timeline-canvas">
      <div className="shell" id="timeline-panel" role="tabpanel" aria-labelledby={view === 'history' ? 'history-tab' : 'publications-tab'}>
        {view === 'publications' && <>
          <OriginalLanguageNotice />
          <div className="timeline-filter-zone">
            <div className="timeline-toolbar" aria-label={t('publications.filterLabel')}>
              <label>{t('publications.system')}<select value={system} onChange={(event) => setFilter('system', event.target.value)}><option value="">{t('publications.allSystems')}</option>{systems.map((value) => <option key={value} value={value}>{dataLabel(value)}</option>)}</select></label>
              <label>{t('publications.period')}<select value={period} onChange={(event) => setFilter('period', event.target.value)}><option value="">{t('publications.allYears')}</option>{periods.map((value) => <option key={value} value={value}>{periodLabel(value)}</option>)}</select></label>
            </div>
            {(system || period) && <button className="clear-filters timeline-clear" type="button" onClick={resetFilters}>{t('publications.clear')}</button>}
          </div>
        </>}
        {view === 'history' ? <History /> : <div className="pub-list" aria-live="polite">{records.length ? records.map((source) => <PublicationCard key={source.id} source={source} />) : <div className="empty-state"><h2>{t('publications.emptyTitle')}</h2><p>{t('publications.emptyBody')}</p><button className="clear-filters" type="button" onClick={resetFilters}>{t('publications.showAll')}</button></div>}</div>}
      </div>
    </section>
  </Layout>;
}
