import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { data } from '../../data/sources.js';
import { PageHero } from '../components/PageHero';
import { CURRENT_RESEARCHERS, PHASE_ONE_RESEARCHERS } from '../features/researchers/phaseOneTeam';
import { formatNumber } from '../lib/format';
import { Layout } from '../main.jsx';
import { CATALOGUE_FILES, CATALOGUE_UPDATED, SITE_NAME, SITE_URL } from '../seo/site.js';

type Step = { title: string; text: string };

const CATALOGUE_LOG = 'https://github.com/shubhamupreti49/Project-Unbonded/blob/main/data/CORRECTIONS.md';
const LICENCE = 'https://creativecommons.org/licenses/by/4.0/';
const year = CATALOGUE_UPDATED.slice(0, 4);

// Citations follow the archive's own guide for volunteers: Chicago author-date.
const CITATIONS = {
  site: `${SITE_NAME}. ${year}. Unbonded Archive: Nepal’s Bonded-Labour Evidence Repository. ${SITE_URL}/.`,
  dataset: `${SITE_NAME}. ${year}. Unbonded Archive Catalogue of Sources on Bonded Labour in Nepal. Version ${CATALOGUE_UPDATED}. Dataset. ${SITE_URL}${CATALOGUE_FILES.csv}.`,
  inText: `(${SITE_NAME} ${year})`,
};

export default function AboutPage() {
  const { t, i18n } = useTranslation('about');
  const steps = t('process.steps', { returnObjects: true }) as Step[];
  const holdings: Array<[number, string]> = [
    [data.sources.length, t('holdings.records')],
    [data.sources.filter((source) => source.claims?.length).length, t('holdings.findings')],
    [data.events.length, t('holdings.events')],
    [Object.keys(data.mapCoverage).length, t('holdings.districts')],
  ];
  const researchers = [...CURRENT_RESEARCHERS, ...PHASE_ONE_RESEARCHERS].map((researcher) => researcher.name);
  const heading = 'm-0 text-2xl text-navy sm:text-3xl';

  return <Layout active="aboutProject">
    <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} lead={t('hero.lead')} />

    <section className="ua bg-paper px-5 py-12 sm:px-7 lg:py-16">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div>
          <h2 className={heading}>{t('purpose.heading')}</h2>
          <p className="mt-4 mb-0 text-lg text-ink/90">{t('purpose.text')}</p>
        </div>
        <div>
          <h2 className={heading}>{t('holdings.heading')}</h2>
          <dl className="m-0 mt-4 grid grid-cols-2 gap-4">
            {holdings.map(([value, label]) => <div key={label} className="rounded-xl border border-rule bg-white p-4">
              <dt className="sr-only">{label}</dt>
              <dd className="m-0 font-serif text-3xl text-navy">{formatNumber(value, i18n.language)}</dd>
              <dd className="m-0 mt-1 text-sm text-muted">{label}</dd>
            </div>)}
          </dl>
        </div>
      </div>
    </section>

    <section className="ua bg-mint px-5 py-12 sm:px-7 lg:py-16" aria-labelledby="about-process">
      <div className="mx-auto max-w-[1180px]">
        <h2 id="about-process" className={heading}>{t('process.heading')}</h2>
        <ol className="m-0 mt-6 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => <li key={step.title} className="rounded-xl border border-rule bg-paper p-5">
            <p className="m-0 font-mono text-xs font-bold text-coral">{formatNumber(index + 1, i18n.language)}</p>
            <h3 className="m-0 mt-1 text-lg text-navy">{step.title}</h3>
            <p className="m-0 mt-2 text-sm text-ink/90">{step.text}</p>
          </li>)}
        </ol>
        <p className="m-0 mt-6"><a href={CATALOGUE_LOG} target="_blank" rel="noreferrer" className="font-bold text-navy">{t('process.logLink')} ↗</a></p>
      </div>
    </section>

    <section className="ua bg-paper px-5 py-12 sm:px-7 lg:py-16">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-2">
        <div>
          <h2 className={heading}>{t('team.heading')}</h2>
          <p className="mt-4 mb-0 text-ink/90">{t('team.text')}</p>
          <ul className="m-0 mt-4 list-none space-y-1 p-0" lang="en">
            <li><a href="https://shubhamupreti.com.np" target="_blank" rel="noreferrer" className="font-bold text-navy">Shubham Upreti</a> <span className="text-sm text-muted" lang={i18n.language}>· {t('team.lead')}</span></li>
            {researchers.map((name) => <li key={name}>{name}</li>)}
          </ul>
          <p className="m-0 mt-4"><Link to="/researchers-phase-one" className="font-bold text-navy">{t('team.researchersLink')} →</Link></p>
        </div>
        <div>
          <h2 className={heading}>{t('limits.heading')}</h2>
          <p className="mt-4 mb-0 text-ink/90">{t('limits.text')}</p>
          <p className="m-0 mt-4"><Link to="/how-to-use" className="font-bold text-navy">{t('limits.link')} →</Link></p>
        </div>
      </div>
    </section>

    <section className="ua bg-mint px-5 py-12 sm:px-7 lg:py-16" aria-labelledby="about-cite">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div>
          <h2 id="about-cite" className={heading}>{t('cite.heading')}</h2>
          <p className="mt-4 mb-0 text-ink/90">{t('cite.intro')}</p>
          {(['site', 'dataset'] as const).map((key) => <div key={key} className="mt-5">
            <h3 className="m-0 text-base text-navy">{t(`cite.${key}`)}</h3>
            <p className="record-citation-text mt-2" lang="en">{CITATIONS[key]}</p>
          </div>)}
          <p className="mt-4 mb-0 text-sm text-muted">{t('cite.inText')} <span lang="en">{CITATIONS.inText}</span></p>
        </div>
        <div>
          <h2 className={heading}>{t('licence.heading')}</h2>
          <p className="mt-4 mb-0 text-ink/90">{t('licence.text')}</p>
          <p className="m-0 mt-3"><a href={LICENCE} target="_blank" rel="noreferrer" className="font-bold text-navy">{t('licence.link')} ↗</a></p>
          <h2 className={`${heading} mt-10`}>{t('contact.heading')}</h2>
          <p className="mt-4 mb-0 text-ink/90">{t('contact.text')} <a href="https://shubhamupreti.com.np" target="_blank" rel="noreferrer" className="font-bold text-navy">{t('contact.linkText')}</a>.</p>
        </div>
      </div>
    </section>
  </Layout>;
}
