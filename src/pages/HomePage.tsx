import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../main.jsx';

const paths = [
  { to: '/catalogue', title: 'Search the catalogue', text: 'Find a source by title, author, system, theme, place, method, or publication year.', action: 'Browse all records' },
  { to: '/geography', title: 'Start with a district', text: 'See where the repository records Kamaiya, Haliya, and Haruwa-Charuwa evidence.', action: 'Explore the map' },
  { to: '/timeline?view=history', title: 'Follow the record over time', text: 'Read the policy history or trace publications through the evidence timeline.', action: 'Open the timeline' },
];

const videos = [
  { id: 'TUPh9pJV1pg', title: 'The Bridge Project: combatting bonded labour in Nepal', channel: 'International Labour Organization' },
  { id: 'Ng5yiiRoPt0', title: 'Ending Agricultural Bonded Labour in Nepal (EABL) Project', channel: 'ActionAid Nepal' },
  { id: 'zRUTiZ6qW58', title: 'Documentary perspective on bonded labour in Nepal', channel: 'The Freedom Fund' },
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  return <Layout active="home">
    <section className="hero">
      <div className="shell">
        <p className="hero-index">Nepal’s bonded-labour evidence repository</p>
        <h1>Trace the evidence behind freedom <em>after</em> abolition.</h1>
        <p className="lead">A source-led hub for navigating research on bonded labour, rehabilitation, and post-liberation vulnerability in Nepal.</p>
        <form className="search-orbit" role="search" onSubmit={(event) => { event.preventDefault(); navigate(`/catalogue${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`); }}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search the evidence hub" placeholder="Search a place, system, author, or theme" />
          <button type="submit">Search evidence</button>
        </form>
        <p className="disclaimer"><b>Read with care:</b> this is a curated student repository, not a systematic review or a causal evaluation.</p>
      </div>
      <section className="metrics" aria-label="Repository coverage">
      <div><strong>40+</strong><span>catalogued papers &amp; reports</span></div>
      <div><strong>70+</strong><span>recorded source claims</span></div>
      <div><strong>2000–25</strong><span>publication years represented</span></div>
      <div><strong>20+</strong><span>named districts &amp; regions</span></div>
      </section>
    </section>

    <IntroNarrative />

    <section className="section documentary-section">
      <div className="shell section-head">
        <div><h2>Documentary perspectives</h2></div>
        <p>These films provide contextual perspectives alongside the written evidence in this repository. They are not treated as research evidence or substitutes for the original sources.</p>
      </div>
      <div className="shell documentary-grid">
        {videos.map((video) => <a key={video.id} className="documentary-card" href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">
          <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt={`Thumbnail for ${video.title}`} loading="lazy" />
          <div><p className="media-type">YouTube documentary</p><h3>{video.title}</h3><p className="documentary-channel">By {video.channel}</p><span>Watch on YouTube</span></div>
        </a>)}
      </div>
    </section>

    <section className="section research-routes">
      <div className="shell section-head">
        <div><h2>Begin with the question you need to answer.</h2></div>
        <p>Every route preserves the context needed to interpret a source responsibly: system, place, method, claim, and the limits recorded for that material.</p>
      </div>
      <div className="shell route-list">
        {paths.map((path) => <Link key={path.to} className="research-route" to={path.to}>
          <h3>{path.title}</h3><p>{path.text}</p><span>{path.action}</span>
        </Link>)}
      </div>
    </section>

    <section className="section home-context">
      <div className="shell section-head">
        <div><h2>Legal freedom is necessary. It is not, on its own, an economic outcome.</h2></div>
        <p>Explore records across Kamaiya, Haliya, Haruwa-Charuwa, Kamlari, child labour, policy and more, while keeping geography, method, and data limits visible.</p>
      </div>
    </section>

  </Layout>;
}

function IntroNarrative() {
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

  const scenes = [
    {
      title: 'Bonded labour in Nepal',
      text: 'Bonded labour is a form of modern slavery in which people are compelled to work to repay a debt or obligation, often under conditions that make it difficult to leave. In Nepal, it has taken different forms shaped by poverty, social inequality, and economic dependence, affecting marginalised communities across different regions and periods.',
      marker: 'The record is grounded in',
      terms: ['Systems', 'Communities', 'History'],
    },
    {
      title: 'Why this repository exists',
      text: 'A dedicated repository makes scattered research, official records, and credible documentation easier to find, compare, and read with the context needed to interpret it responsibly.',
      marker: 'Evidence becomes useful through',
      terms: ['Access', 'Comparison', 'Context'],
    },
    {
      title: 'What the record holds',
      text: 'Nepal’s first dedicated repository focused exclusively on bonded labour brings together research studies, datasets, reports, government records, and other credible documentation. It covers Kamaiya, Haliya, Haruwa-Charuwa, Kamlari, and other forms of forced and bonded labour, structured by labour system, affected community, geography, historical period, and source type.',
      marker: 'The collection brings together',
      terms: ['Research', 'Records', 'Sources'],
    },
  ];

  return <section ref={sectionRef} className={`repository-narrative repository-narrative--${activeScene === null ? 'exit' : activeScene}`} aria-label="Introduction to the repository">
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
