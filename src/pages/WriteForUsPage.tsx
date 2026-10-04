import { useTranslation } from 'react-i18next';
import { PageHero } from '../components/PageHero';
import { SUBMISSION_FORM_URL } from '../features/articles/config';
import { localizeDigits } from '../lib/format';
import { Layout } from '../main.jsx';

type Step = { title: string; text: string };

// Lazy-loaded route (see App.tsx). The form link lives in features/articles/config.ts.
export default function WriteForUsPage() {
  const { t, i18n } = useTranslation('articles');
  const publish = t('write.publish', { returnObjects: true }) as string[];
  const guidelines = t('write.guidelines', { returnObjects: true }) as string[];
  const steps = t('write.steps', { returnObjects: true }) as Step[];

  const submit = SUBMISSION_FORM_URL ? (
    <div>
      <a href={SUBMISSION_FORM_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center rounded-lg bg-sun px-5 font-bold text-night no-underline hover:bg-[#ffd77f]">
        {t('write.submit')} <span aria-hidden="true" className="ml-1.5">↗</span>
      </a>
      <p className="mt-2 mb-0 text-sm text-[#b9d3d6]">{t('write.submitNote')}</p>
    </div>
  ) : (
    <p className="m-0 inline-block rounded-lg border border-white/25 px-4 py-3 text-[#d9eeee]">{t('write.formPending')}</p>
  );

  return (
    <Layout active="writeForUs">
      <PageHero eyebrow={t('write.eyebrow')} title={t('write.title')} lead={t('write.lead')}>
        <div className="mt-7">{submit}</div>
      </PageHero>

      <section className="ua bg-mint px-5 py-10 sm:px-7 lg:py-14">
        <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="rounded-2xl border border-rule bg-paper p-6 sm:p-7">
            <h2 className="m-0 mb-4 text-2xl text-navy">{t('write.publishHeading')}</h2>
            <ul className="m-0 space-y-2.5 pl-5 text-ink">{publish.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="rounded-2xl border border-rule bg-paper p-6 sm:p-7">
            <h2 className="m-0 mb-4 text-2xl text-navy">{t('write.guidelinesHeading')}</h2>
            <ul className="m-0 space-y-2.5 pl-5 text-ink">{guidelines.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-[1180px]">
          <h2 className="m-0 mb-5 text-2xl text-navy sm:text-3xl">{t('write.stepsHeading')}</h2>
          <ol className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border-t-4 border-aqua bg-paper p-6">
                <span className="font-mono text-sm font-bold text-coral">{localizeDigits(String(index + 1).padStart(2, '0'), i18n.language)}</span>
                <h3 className="mt-2 mb-2 text-xl text-navy">{step.title}</h3>
                <p className="m-0 text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </Layout>
  );
}
