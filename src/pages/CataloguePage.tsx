import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { data } from '../../data/sources.js';
import { Layout } from '../main.jsx';

type Source = (typeof data.sources)[number];
type FilterName = 'system' | 'method' | 'year' | 'theme';

const systemOptions = ['Haliya', 'Kamaiya', 'Haruwa-Charuwa', 'Kamlari', 'Cross-system / general'];
const unique = (values: Array<string | number | undefined>) => [...new Set(values.filter((value): value is string | number => value !== undefined && value !== ''))].map(String).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

function Filter({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return <label>{label}<select value={value} onChange={(event) => onChange(event.target.value)}>
    <option value="">All {label.toLowerCase()}</option>
    {values.map((option) => <option key={option} value={option}>{option}</option>)}
  </select></label>;
}

function SourceCard({ source }: { source: Source }) {
  return <article className="source-card">
    <p className="source-author">{source.author}</p>
    <h3><Link className="source-title-link" to={`/source?id=${encodeURIComponent(source.id)}`}>{source.title}</Link></h3>
    <p className="source-meta">{source.year || 'Year not recorded'} · {source.methodType} · {source.geography}</p>
    <p className="source-claim">{source.claims?.[0] || source.claim}</p>
    <div className="source-footer">{[...(source.systems || []), ...(source.themes || [])].slice(0, 5).map((value) => <span key={value} className="chip">{value}</span>)}</div>
  </article>;
}

export default function CataloguePage() {
  const [params, setParams] = useSearchParams();
  const search = params.get('q') || '';
  const system = params.get('system') || '';
  const method = params.get('method') || '';
  const year = params.get('year') || '';
  const theme = params.get('theme') || '';
  const linked = params.get('linked') === 'true';
  const methods = useMemo(() => unique(data.sources.map((source) => source.methodType)), []);
  const years = useMemo(() => unique(data.sources.map((source) => source.year)).reverse(), []);
  const themes = useMemo(() => unique(data.sources.flatMap((source) => source.themes || [])), []);
  const update = (key: string, value: string | boolean) => setParams((current) => {
    const next = new URLSearchParams(current);
    if (value) next.set(key, String(value)); else next.delete(key);
    return next;
  }, { replace: true });
  const resetFilters = () => setParams({}, { replace: true });
  const activeFilters: Array<[string, string, string]> = [
    ['q', search, `Search: ${search}`], ['system', system, system], ['method', method, method], ['year', year, year], ['theme', theme, theme], ['linked', linked ? 'true' : '', 'Stable link only'],
  ].filter(([, value]) => Boolean(value)) as Array<[string, string, string]>;
  const filtered = useMemo(() => data.sources.filter((source) => {
    const hasLink = /https?:\/\//.test([source.url, source.citation, source.gap].join(' '));
    return (!search || JSON.stringify(source).toLowerCase().includes(search.toLowerCase())) && (!system || source.systems?.includes(system)) && (!method || source.methodType === method) && (!year || String(source.year) === year) && (!theme || source.themes?.includes(theme)) && (!linked || hasLink);
  }).sort((a, b) => (b.year || 0) - (a.year || 0)), [search, system, method, year, theme, linked]);

  return <Layout active="catalogue" className="catalogue-page">
    <section className="catalogue-hero"><div className="shell">
      <p className="catalogue-index">Evidence index</p><h1>Source catalogue</h1>
      <p>Search across the archive, then narrow the field using the details each record actually reports.</p>
      <form className="search-orbit" role="search" onSubmit={(event) => event.preventDefault()}>
        <input value={search} onChange={(event) => update('q', event.target.value)} aria-label="Search source catalogue" aria-describedby="catalogue-result-count" placeholder="Search title, author, geography or finding" />
        <button type="submit">Search</button>
      </form>
    </div></section>
    <section className="catalogue-filter-band"><div className="shell">
      <div className="filterbar" aria-label="Filter source catalogue">
        <Filter label="System" value={system} onChange={(value) => update('system', value)} values={systemOptions} />
        <Filter label="Method" value={method} onChange={(value) => update('method', value)} values={methods} />
        <Filter label="Publication year" value={year} onChange={(value) => update('year', value)} values={years} />
        <Filter label="Theme" value={theme} onChange={(value) => update('theme', value)} values={themes} />
      </div>
      <div className="catalogue-filter-actions">
        <label className="doi-toggle"><input checked={linked} onChange={(event) => update('linked', event.target.checked)} type="checkbox" /> Show records with a DOI or stable document link only</label>
        {activeFilters.length > 0 && <button className="clear-filters" type="button" onClick={resetFilters}>Clear all filters</button>}
      </div>
      {activeFilters.length > 0 && <div className="active-filter-list" aria-label="Active filters">{activeFilters.map(([key, value, label]) => <button key={`${key}-${value}`} type="button" onClick={() => update(key, false)}>{label}<span aria-hidden="true">×</span><span className="sr-only"> Remove filter</span></button>)}</div>}
    </div></section>
    <section className="section catalogue-results"><div className="shell">
      <p id="catalogue-result-count" className="result-meta" aria-live="polite">{filtered.length} of {data.sources.length} source records shown</p>
      <div className="catalogue">{filtered.length ? filtered.map((source) => <SourceCard key={source.id} source={source} />) : <div className="empty-state"><h2>No source records match these filters.</h2><p>Clear a filter or use a broader search term to return to the catalogue.</p><button className="clear-filters" type="button" onClick={resetFilters}>Show all sources</button></div>}</div>
      <p className="callout"><b>Cataloguing note:</b> Partial metadata means a core field was absent from the workbook. Verify records before citation.</p>
    </div></section>
  </Layout>;
}
