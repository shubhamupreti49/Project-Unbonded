import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { data } from '../../data/sources.js';
import { OriginalLanguageNotice } from '../components/OriginalLanguageNotice';
import { useDataLabel } from '../i18n/useDataLabel';
import { formatYear } from '../lib/format';
import { Layout } from '../main.jsx';

type Source = (typeof data.sources)[number];

const systemOptions = ['Haliya', 'Kamaiya', 'Haruwa-Charuwa', 'Kamlari', 'Cross-system / general'];
const unique = (values: Array<string | number | null | undefined>) => [...new Set(values.filter((value): value is string | number => value !== undefined && value !== null && value !== ''))].map(String).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

type FilterProps = { label: string; allLabel: string; value: string; values: string[]; format?: (value: string) => string; onChange: (value: string) => void };

function Filter({ label, allLabel, value, values, format = (option) => option, onChange }: FilterProps) {
  return <label>{label}<select value={value} onChange={(event) => onChange(event.target.value)}>
    <option value="">{allLabel}</option>
    {values.map((option) => <option key={option} value={option}>{format(option)}</option>)}
  </select></label>;
}

function SourceCard({ source }: { source: Source }) {
  const { t, i18n } = useTranslation('common');
  const dataLabel = useDataLabel();
  return <article className="source-card">
    <p className="source-author" lang="en">{source.author}</p>
    <h3 lang="en"><Link className="source-title-link" to={`/source?id=${encodeURIComponent(source.id)}`}>{source.title}</Link></h3>
    <p className="source-meta">{formatYear(source.year, i18n.language) || t('yearUnknown')} · {dataLabel(source.methodType)} · <span lang="en">{source.geography}</span></p>
    <p className="source-claim" lang="en">{source.claims?.[0] || source.claim}</p>
    <div className="source-footer">{[...(source.systems || []), ...(source.themes || [])].slice(0, 5).map((value) => <span key={value} className="chip">{dataLabel(value)}</span>)}</div>
  </article>;
}

export default function CataloguePage() {
  const { t, i18n } = useTranslation('catalogue');
  const dataLabel = useDataLabel();
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
    ['q', search, t('filters.searchChip', { query: search })],
    ['system', system, dataLabel(system)],
    ['method', method, dataLabel(method)],
    ['year', year, formatYear(Number(year), i18n.language) || year],
    ['theme', theme, dataLabel(theme)],
    ['linked', linked ? 'true' : '', t('filters.linkedChip')],
  ].filter(([, value]) => Boolean(value)) as Array<[string, string, string]>;
  const filtered = useMemo(() => data.sources.filter((source) => {
    const hasLink = /https?:\/\//.test([source.url, source.citation, source.gap].join(' '));
    return (!search || JSON.stringify(source).toLowerCase().includes(search.toLowerCase())) && (!system || source.systems?.includes(system)) && (!method || source.methodType === method) && (!year || String(source.year) === year) && (!theme || source.themes?.includes(theme)) && (!linked || hasLink);
  }).sort((a, b) => (b.year || 0) - (a.year || 0)), [search, system, method, year, theme, linked]);

  return <Layout active="catalogue" className="catalogue-page">
    <section className="catalogue-hero"><div className="shell">
      <p className="catalogue-index">{t('hero.eyebrow')}</p><h1>{t('hero.title')}</h1>
      <p>{t('hero.lead')}</p>
      <form className="search-orbit" role="search" onSubmit={(event) => event.preventDefault()}>
        <input value={search} onChange={(event) => update('q', event.target.value)} aria-label={t('search.label')} aria-describedby="catalogue-result-count" placeholder={t('search.placeholder')} />
        <button type="submit">{t('search.button')}</button>
      </form>
    </div></section>
    <section className="catalogue-filter-band"><div className="shell">
      <div className="filterbar" aria-label={t('filters.label')}>
        <Filter label={t('filters.system')} allLabel={t('filters.allSystem')} value={system} onChange={(value) => update('system', value)} values={systemOptions} format={dataLabel} />
        <Filter label={t('filters.method')} allLabel={t('filters.allMethod')} value={method} onChange={(value) => update('method', value)} values={methods} format={dataLabel} />
        <Filter label={t('filters.year')} allLabel={t('filters.allYear')} value={year} onChange={(value) => update('year', value)} values={years} format={(value) => formatYear(Number(value), i18n.language) || value} />
        <Filter label={t('filters.theme')} allLabel={t('filters.allTheme')} value={theme} onChange={(value) => update('theme', value)} values={themes} format={dataLabel} />
      </div>
      <div className="catalogue-filter-actions">
        <label className="doi-toggle"><input checked={linked} onChange={(event) => update('linked', event.target.checked)} type="checkbox" /> {t('filters.linkedOnly')}</label>
        {activeFilters.length > 0 && <button className="clear-filters" type="button" onClick={resetFilters}>{t('filters.clear')}</button>}
      </div>
      {activeFilters.length > 0 && <div className="active-filter-list" aria-label={t('filters.active')}>{activeFilters.map(([key, value, label]) => <button key={`${key}-${value}`} type="button" onClick={() => update(key, false)}>{label}<span aria-hidden="true">×</span><span className="sr-only"> {t('filters.remove')}</span></button>)}</div>}
    </div></section>
    <section className="section catalogue-results"><div className="shell">
      <OriginalLanguageNotice />
      <p id="catalogue-result-count" className="result-meta" aria-live="polite">{t('results.count', { shown: filtered.length, total: data.sources.length })}</p>
      <div className="catalogue">{filtered.length ? filtered.map((source) => <SourceCard key={source.id} source={source} />) : <div className="empty-state"><h2>{t('results.emptyTitle')}</h2><p>{t('results.emptyBody')}</p><button className="clear-filters" type="button" onClick={resetFilters}>{t('results.showAll')}</button></div>}</div>
      <p className="callout"><b>{t('note.label')}</b> {t('note.text')}</p>
    </div></section>
  </Layout>;
}
