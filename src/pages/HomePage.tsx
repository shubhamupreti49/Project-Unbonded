import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { AudiencePathways } from '../features/home/AudiencePathways';
import { COVERAGE } from '../features/home/coverage';
import { data } from '../../data/sources.js';
import { useDataLabel } from '../i18n/useDataLabel';
import { formatYear, localizeDigits } from '../lib/format';
import { Layout } from '../main.jsx';
import { recordPath } from '../seo/site.js';

// One-click routes into Research for the four systems the archive centres on.
const systemShortcuts = ['Kamaiya', 'Haliya', 'Haruwa-Charuwa', 'Kamlari'];

const videos = [
  { id: 'TUPh9pJV1pg', title: 'The Bridge Project: combatting bonded labour in Nepal', channel: 'International Labour Organization' },
  { id: 'Ng5yiiRoPt0', title: 'Ending Agricultural Bonded Labour in Nepal (EABL) Project', channel: 'ActionAid Nepal' },
  { id: 'zRUTiZ6qW58', title: 'The Harawa-Charawa journey to liberation', channel: 'The Freedom Fund' },
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('home');
  const dataLabel = useDataLabel();

  return <Layout active="home">
    <section className="hero">
      <div className="shell">
        <p className="hero-index">{t('hero.eyebrow')}</p>
        <h1><Trans t={t} i18nKey="hero.title" components={{ em: <em /> }} /></h1>
        <p className="lead">{t('hero.lead')}</p>
        <form className="search-orbit" role="search" onSubmit={(event) => { event.preventDefault(); navigate(`/research${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`); }}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label={t('hero.searchLabel')} placeholder={t('hero.searchPlaceholder')} />
          <button type="submit">{t('hero.searchButton')}</button>
        </form>
        <nav className="hero-shortcuts" aria-label={t('hero.browse')}>
          <span>{t('hero.browse')}</span>
          {systemShortcuts.map((system) => <Link key={system} to={`/research?system=${encodeURIComponent(system)}`}>{dataLabel(system)}</Link>)}
        </nav>
        <p className="disclaimer"><Trans t={t} i18nKey="hero.disclaimer" components={{ b: <b /> }} /></p>
      </div>
      <section className="metrics" aria-label={t('metrics.label')}>
      {/* Exact figures, calculated from the catalogue (features/home/coverage.ts). */}
      <div><strong>{localizeDigits(String(COVERAGE.records), i18n.language)}</strong><span>{t('metrics.papers')}</span></div>
      <div><strong>{localizeDigits(String(COVERAGE.findings), i18n.language)}</strong><span>{t('metrics.claims')}</span></div>
      <div><strong>{localizeDigits(`${COVERAGE.firstYear}–${COVERAGE.lastYear}`, i18n.language)}</strong><span>{t('metrics.years')}</span></div>
      <div><strong>{localizeDigits(String(COVERAGE.districts), i18n.language)}</strong><span>{t('metrics.districts')}</span></div>
      </section>
    </section>

    {/* Audience entry points come straight after the hero so each reader is routed quickly. */}
    <AudiencePathways />

    <RecentlyAdded />

    <IntroNarrative />

    <section className="section documentary-section">
      <div className="shell section-head">
        <div><h2>{t('documentaries.heading')}</h2></div>
        <p>{t('documentaries.intro')}</p>
      </div>
      <DocumentaryRail videos={videos} />
    </section>

    <section className="section home-context">
      <div className="shell section-head">
        <div><h2>{t('context.heading')}</h2></div>
        <p>{t('context.text')}</p>
      </div>
    </section>

  </Layout>;
}

// Record ids are assigned in the order records are catalogued, so the highest ids are the newest additions.
const RECENT = [...data.sources].sort((a, b) => Number(b.id.slice(4)) - Number(a.id.slice(4))).slice(0, 6);

function RecentlyAdded() {
  const { t, i18n } = useTranslation('home');
  const dataLabel = useDataLabel();
  return <section className="ua bg-mint px-5 py-14 sm:px-7 lg:py-16" aria-labelledby="recently-added-title">
    <div className="mx-auto max-w-[1180px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 id="recently-added-title" className="m-0 text-3xl text-navy">{t('recent.heading')}</h2>
          <p className="m-0 mt-2 text-muted">{t('recent.intro')}</p>
        </div>
        <Link to="/research" className="font-bold text-navy">{t('recent.all')} <span aria-hidden="true">→</span></Link>
      </div>
      <ul className="m-0 mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {RECENT.map((source) => <li key={source.id} className="flex flex-col rounded-2xl border border-rule bg-paper p-5">
          <p className="m-0 font-mono text-xs text-muted">{source.id} · {formatYear(source.year, i18n.language) ?? 'n.d.'}</p>
          <h3 lang="en" className="m-0 mt-2 text-lg leading-snug"><Link to={recordPath(source.id)} className="text-navy no-underline hover:underline">{source.title}</Link></h3>
          <p lang="en" className="m-0 mt-1 text-sm font-bold text-coral">{source.author}</p>
          <p className="m-0 mt-auto pt-3 text-xs text-muted">{(source.systems ?? []).map(dataLabel).join(' · ')}</p>
        </li>)}
      </ul>
    </div>
  </section>;
}

type Documentary = { id: string; title: string; channel: string };

function DocumentaryRail({ videos }: { videos: Documentary[] }) {
  const { t } = useTranslation('home');
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = () => {
    const rail = railRef.current;
    if (!rail) return;
    setAtStart(rail.scrollLeft <= 2);
    setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2);
  };

  useEffect(() => {
    syncEdges();
    window.addEventListener('resize', syncEdges);
    return () => window.removeEventListener('resize', syncEdges);
  }, [videos.length]);

  // Easing comes from the rail's CSS scroll-behavior, which also honours reduced-motion.
  const nudge = (direction: number) => {
    const rail = railRef.current;
    if (rail) rail.scrollBy({ left: direction * rail.clientWidth * .8 });
  };

  // When every film fits on screen there is nothing to scroll, so the arrows step aside.
  const fits = atStart && atEnd;

  return <div className="shell documentary-rail-wrap">
    <button type="button" className="rail-nav rail-nav--prev" aria-label={t('documentaries.previous')} disabled={atStart} hidden={fits} onClick={() => nudge(-1)}>‹</button>
    <div className="documentary-rail" ref={railRef} onScroll={syncEdges} tabIndex={0} role="group" aria-label={t('documentaries.railLabel')}>
      {videos.map((video) => <a key={video.id} className="documentary-card" href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">
        <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt={t('documentaries.thumbnail', { title: video.title })} loading="lazy" />
        {/* Film titles and channel names are the publishers' own, so they stay in English. */}
        <div><p className="media-type">{t('documentaries.mediaType')}</p><h3 lang="en">{video.title}</h3><p className="documentary-channel">{t('documentaries.by', { channel: video.channel })}</p><span>{t('documentaries.watch')}</span></div>
      </a>)}
    </div>
    <button type="button" className="rail-nav rail-nav--next" aria-label={t('documentaries.next')} disabled={atEnd} hidden={fits} onClick={() => nudge(1)}>›</button>
  </div>;
}

function IntroNarrative() {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);
  const [activeScene, setActiveScene] = useState<number | null>(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let frame: number | null = null;
    const syncScene = () => {
      frame = null;
      const bounds = section.getBoundingClientRect();
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-bounds.top / scrollDistance, 0), 1);
      const nextScene = progress >= .92 ? null : progress < 1 / 3 ? 0 : progress < 2 / 3 ? 1 : 2;
      setActiveScene((currentScene) => currentScene === nextScene ? currentScene : nextScene);
    };
    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(syncScene);
    };

    syncScene();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  const scenes = t('narrative.scenes', { returnObjects: true }) as Array<{ title: string; text: string; marker: string; terms: string[] }>;

  return <section ref={sectionRef} className={`repository-narrative repository-narrative--${activeScene === null ? 'exit' : activeScene}`} aria-label={t('narrative.label')}>
    <div className="repository-narrative-sticky">
      <div className="shell repository-narrative-frame">
        <div className="repository-narrative-scenes">
          {scenes.map((scene, index) => <article key={scene.title} data-scene={`0${index + 1}`} className={`repository-scene repository-scene--${index === 1 ? 'left' : 'right'}${activeScene === index ? ' is-active' : ''}`}>
            <h2>{scene.title}</h2>
            <p>{scene.text}</p>
          </article>)}
        </div>
        {scenes.map((scene, index) => <aside key={scene.marker} className={`repository-record-marker repository-record-marker--${index === 1 ? 'right' : 'left'}${activeScene === index ? ' is-active' : ''}`} aria-hidden="true">
          <p>{scene.marker}</p>
          <div>{scene.terms.map((term) => <span key={term}>{term}</span>)}</div>
        </aside>)}
        <div className="repository-narrative-progress" aria-hidden="true">
          {scenes.map((scene, index) => <span key={scene.title} className={activeScene === index ? 'is-active' : ''} />)}
        </div>
      </div>
    </div>
  </section>;
}
