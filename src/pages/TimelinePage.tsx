import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { data } from '../../data/sources.js';
import { Layout } from '../main.jsx';

const systems = ['Kamaiya', 'Haliya', 'Haruwa-Charuwa', 'Kamlari', 'Cross-system / general'];
const periods = ['2000', '2005', '2010', '2015', '2020', '2025'];

function updateParam(params: URLSearchParams, key: string, value: string) {
  const next = new URLSearchParams(params);
  if (value) next.set(key, value); else next.delete(key);
  return next;
}

function RecordLink({ source }: { source: (typeof data.sources)[number] }) {
  return <Link className="source-title-link" to={`/source?id=${encodeURIComponent(source.id)}`}>{source.title}</Link>;
}

function PublicationCard({ source }: { source: (typeof data.sources)[number] }) {
  return <article className="pub-card source-card">
    <div className="publication-year" aria-label={`Published ${source.year}`}>{source.year}</div>
    <p className="source-author">{source.author}</p>
    <h3><RecordLink source={source} /></h3>
    <p className="source-meta">{source.methodType} · {source.geography}</p>
    <p className="source-claim">{source.claims?.[0] || source.claim}</p>
    <div className="source-footer">{[...(source.systems || []), ...(source.themes || [])].slice(0, 5).map((value) => <span className="chip" key={value}>{value}</span>)}</div>
  </article>;
}

function History() {
  return <div className="timeline" aria-label="Policy and historical timeline">
    {[...data.events].sort((a, b) => b.year - a.year).map((event) => <article className="time-item" key={`${event.year}-${event.title}`}>
      <div className="time-year">{event.year}</div>
      <div className="time-card">
        <p className="timeline-label">Policy / historical record</p>
        <h3>{event.url ? <a className="timeline-record-link" href={event.url} target="_blank" rel="noreferrer">{event.title}</a> : event.title}</h3>
        <p>{event.text}</p>
        {event.url && <span className="record-link-note">Open official legal text</span>}
      </div>
    </article>)}
  </div>;
}

export default function TimelinePage() {
  const [params, setParams] = useSearchParams();
  const view = params.get('view') === 'publications' ? 'publications' : 'history';
  const system = params.get('system') || '';
  const period = params.get('period') || '';
  const records = useMemo(() => data.sources.filter((source) => source.year && (!system || source.systems?.includes(system)) && (!period || (source.year >= Number(period) && source.year < Number(period) + 5))).sort((a, b) => (b.year || 0) - (a.year || 0)), [system, period]);
  const selectView = (nextView: 'history' | 'publications') => setParams((current) => updateParam(current, 'view', nextView === 'publications' ? 'publications' : ''));
  const setFilter = (name: string, value: string) => setParams((current) => updateParam(current, name, value), { replace: true });
  const resetFilters = () => setParams({ view: 'publications' }, { replace: true });

  return <Layout active="timeline" className="timeline-page">
    <section className="timeline-stage">
      <div className="shell">
        <p className="timeline-index">Evidence in time</p>
        <h1>History &amp; publication timeline</h1>
        <p>Follow the legal and historical record, or move to the publication timeline for source-level research detail.</p>
        <div className="timeline-tabs" role="tablist" aria-label="Timeline views">
          <button id="history-tab" className={`tab ${view === 'history' ? 'active' : ''}`} type="button" role="tab" aria-selected={view === 'history'} aria-controls="timeline-panel" onClick={() => selectView('history')}>Policy &amp; historical events</button>
          <button id="publications-tab" className={`tab ${view === 'publications' ? 'active' : ''}`} type="button" role="tab" aria-selected={view === 'publications'} aria-controls="timeline-panel" onClick={() => selectView('publications')}>Publication record</button>
        </div>
      </div>
    </section>
    <section className="timeline-canvas">
      <div className="shell" id="timeline-panel" role="tabpanel" aria-labelledby={view === 'history' ? 'history-tab' : 'publications-tab'}>
        {view === 'publications' && <div className="timeline-filter-zone">
          <div className="timeline-toolbar" aria-label="Filter publication records">
            <label>System<select value={system} onChange={(event) => setFilter('system', event.target.value)}><option value="">All systems</option>{systems.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
            <label>Five-year period<select value={period} onChange={(event) => setFilter('period', event.target.value)}><option value="">All years</option>{periods.map((value) => <option key={value} value={value}>{value}–{String(Number(value) + 4).slice(-2)}</option>)}</select></label>
          </div>
          {(system || period) && <button className="clear-filters timeline-clear" type="button" onClick={resetFilters}>Clear timeline filters</button>}
        </div>}
        {view === 'history' ? <History /> : <div className="pub-list" aria-live="polite">{records.length ? records.map((source) => <PublicationCard key={source.id} source={source} />) : <div className="empty-state"><h2>No publications match these filters.</h2><p>Clear a filter or choose a different five-year period to widen the record.</p><button className="clear-filters" type="button" onClick={resetFilters}>Show all publications</button></div>}</div>}
      </div>
    </section>
  </Layout>;
}
