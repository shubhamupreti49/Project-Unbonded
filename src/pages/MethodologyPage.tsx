import { useTranslation } from 'react-i18next';
import { formatNumber } from '../lib/format';
import { Layout } from '../main.jsx';

type Entry = { title: string; text: string };

export default function MethodologyPage() {
  const { t, i18n } = useTranslation('methodology');
  const guidance = t('guide.steps', { returnObjects: true }) as Entry[];
  const limitations = t('limitations.items', { returnObjects: true }) as Entry[];
  const stepNumber = (index: number) => formatNumber(0, i18n.language) + formatNumber(index + 1, i18n.language);

  return <Layout active="methodology">
    <section className="page-hero methodology-hero">
      <div className="shell">
        <div className="methodology-hero-copy">
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.lead')}</p>
        </div>
        <div className="methodology-hero-counts" aria-label={t('hero.overview')}>
          <div><strong>{formatNumber(guidance.length, i18n.language)}</strong><span>{t('hero.ways')}</span></div>
          <div><strong>{formatNumber(limitations.length, i18n.language)}</strong><span>{t('hero.limits')}</span></div>
        </div>
      </div>
    </section>

    <section className="methodology-guide" aria-labelledby="guidance-title">
      <div className="shell">
        <div className="methodology-intro">
          <h2 id="guidance-title">{t('guide.heading')}</h2>
          <p>{t('guide.intro')}</p>
        </div>
        <div className="methodology-steps">
          {guidance.map(({ title, text }, index) => <article key={title} data-step={stepNumber(index)}>
            <span className="methodology-step-number" aria-hidden="true">{stepNumber(index)}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section className="methodology-limitations" aria-labelledby="limitations-title">
      <div className="shell">
        <div className="methodology-intro">
          <h2 id="limitations-title">{t('limitations.heading')}</h2>
          <p>{t('limitations.intro')}</p>
        </div>
        <div className="limitations-list">
          {limitations.map(({ title, text }, index) => <article key={title} data-limit={stepNumber(index)}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>)}
        </div>
      </div>
    </section>
  </Layout>;
}
