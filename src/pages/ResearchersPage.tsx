import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { countCataloguedRecords, PHASE_ONE_RESEARCHERS } from '../features/researchers/phaseOneTeam';
import { toLanguageCode } from '../i18n/languages';
import { formatNumber } from '../lib/format';
import { Layout } from '../main.jsx';

const AVATAR_COLOURS = ['bg-kamaiya text-night', 'bg-haliya text-white', 'bg-haruwa text-white', 'bg-coral text-white', 'bg-aqua text-white'];

const initialsOf = (name: string) => name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

export default function ResearchersPage() {
  const { t, i18n } = useTranslation('researchers');
  const language = toLanguageCode(i18n.resolvedLanguage);

  const researchers = useMemo(
    () => PHASE_ONE_RESEARCHERS.map((researcher) => ({ ...researcher, records: countCataloguedRecords(researcher) })),
    [],
  );
  const totalRecords = researchers.reduce((total, researcher) => total + researcher.records, 0);

  return (
    <Layout active="researchers">
      <PageHero eyebrow={t('page.eyebrow')} title={t('page.title')} lead={t('page.lead')}>
        <dl className="m-0 mt-8 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3" aria-label={t('summary.label')}>
          <div className="border-l-2 border-sun pl-4">
            <dt className="sr-only">{t('summary.researchers', { count: researchers.length })}</dt>
            <dd className="m-0 font-serif text-3xl text-white">{formatNumber(researchers.length, language)}</dd>
            <dd className="m-0 text-sm text-[#d9eeee]">{t('summary.researchers', { count: researchers.length })}</dd>
          </div>
          <div className="border-l-2 border-sun pl-4">
            <dt className="sr-only">{t('summary.records', { count: totalRecords })}</dt>
            <dd className="m-0 font-serif text-3xl text-white">{formatNumber(totalRecords, language)}</dd>
            <dd className="m-0 text-sm text-[#d9eeee]">{t('summary.records', { count: totalRecords })}</dd>
          </div>
          <div className="col-span-2 border-l-2 border-sun pl-4 sm:col-span-1">
            <dt className="sr-only">{t('summary.status')}</dt>
            <dd className="m-0 pt-2 text-base font-bold text-sun">✓ {t('summary.status')}</dd>
          </div>
        </dl>
      </PageHero>

      <section className="ua bg-mint px-5 py-10 sm:px-7 lg:py-16">
        <div className="mx-auto max-w-[1180px]">
          <ul className="m-0 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3" aria-label={t('listLabel')}>
            {researchers.map((researcher, index) => (
              <li key={researcher.name} className="flex items-start gap-4 rounded-2xl border border-rule bg-paper p-5 shadow-[0_1px_2px_#08233b0f] sm:p-6">
                <span className={`grid size-14 shrink-0 place-items-center rounded-full font-mono text-lg font-bold ${AVATAR_COLOURS[index % AVATAR_COLOURS.length]}`} aria-hidden="true">
                  {initialsOf(researcher.name)}
                </span>
                <div className="min-w-0">
                  <h2 lang="en" className="m-0 text-xl text-navy">{researcher.name}</h2>
                  <p className="m-0 mt-1 text-sm font-bold text-coral">{t('card.role')}</p>
                  <p className="m-0 mt-2 text-sm text-muted">{t('card.records', { count: researcher.records })}</p>
                  <p className="m-0 mt-3 inline-flex items-center gap-1.5 rounded-full bg-haruwa/15 px-2.5 py-0.5 text-xs font-bold text-[#1c6660]">
                    <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true"><path d="M6.4 11.2 3.2 8l1.1-1.1 2.1 2.1 5.3-5.3L12.8 4.8z" /></svg>
                    {t('card.status')}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <aside className="mt-10 flex flex-col gap-4 rounded-2xl bg-night p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="max-w-2xl">
              <h2 className="m-0 text-2xl text-white">{t('continuing.heading')}</h2>
              <p className="m-0 mt-2 text-[#d9eeee]">{t('continuing.text')}</p>
            </div>
            <Link to="/catalogue" className="inline-flex min-h-11 shrink-0 items-center self-start rounded-lg bg-sun px-4 font-bold text-night no-underline hover:bg-white sm:self-center">
              {t('browse')} <span aria-hidden="true" className="ml-2">→</span>
            </Link>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
