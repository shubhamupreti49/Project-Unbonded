import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AudiencePathways } from '../features/home/AudiencePathways';
import { localizeDigits } from '../lib/format';
import { Layout } from '../main.jsx';

const videos = [
  { id: 'TUPh9pJV1pg', title: 'The Bridge Project: combatting bonded labour in Nepal', channel: 'International Labour Organization' },
  { id: 'Ng5yiiRoPt0', title: 'Ending Agricultural Bonded Labour in Nepal (EABL) Project', channel: 'ActionAid Nepal' },
  { id: 'zRUTiZ6qW58', title: 'Documentary perspective on bonded labour in Nepal', channel: 'The Freedom Fund' },
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('home');

  return <Layout active="home">
    <section className="hero">
      <div className="shell">
        <p className="hero-index">{t('hero.eyebrow')}</p>
        <h1><Trans t={t} i18nKey="hero.title" components={{ em: <em /> }} /></h1>
        <p className="lead">{t('hero.lead')}</p>
        <form className="search-orbit" role="search" onSubmit={(event) => { event.preventDefault(); navigate(`/catalogue${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`); }}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label={t('hero.searchLabel')} placeholder={t('hero.searchPlaceholder')} />
          <button type="submit">{t('hero.searchButton')}</button>
        </form>
        <p className="disclaimer"><Trans t={t} i18nKey="hero.disclaimer" components={{ b: <b /> }} /></p>
      </div>
      <section className="metrics" aria-label={t('metrics.label')}>
      <div><strong>{localizeDigits('40+', i18n.language)}</strong><span>{t('metrics.papers')}</span></div>
      <div><strong>{localizeDigits('70+', i18n.language)}</strong><span>{t('metrics.claims')}</span></div>
      <div><strong>{localizeDigits('2000–25', i18n.language)}</strong><span>{t('metrics.years')}</span></div>
      <div><strong>{localizeDigits('20+', i18n.language)}</strong><span>{t('metrics.districts')}</span></div>
      </section>
    </section>

    {/* Audience entry points come straight after the hero so each reader is routed quickly. */}
    <AudiencePathways />

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

  return <div className="shell documentary-rail-wrap">
    <button type="button" className="rail-nav rail-nav--prev" aria-label={t('documentaries.previous')} disabled={atStart} onClick={() => nudge(-1)}>‹</button>
    <div className="documentary-rail" ref={railRef} onScroll={syncEdges} tabIndex={0} role="group" aria-label={t('documentaries.railLabel')}>
      {videos.map((video) => <a key={video.id} className="documentary-card" href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">
        <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt={t('documentaries.thumbnail', { title: video.title })} loading="lazy" />
        {/* Film titles and channel names are the publishers' own, so they stay in English. */}
        <div><p className="media-type">{t('documentaries.mediaType')}</p><h3 lang="en">{video.title}</h3><p className="documentary-channel">{t('documentaries.by', { channel: video.channel })}</p><span>{t('documentaries.watch')}</span></div>
      </a>)}
    </div>
    <button type="button" className="rail-nav rail-nav--next" aria-label={t('documentaries.next')} disabled={atEnd} onClick={() => nudge(1)}>›</button>
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
