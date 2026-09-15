import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

type AudienceId = 'policymakers' | 'researchers' | 'public';

type Pathway = {
  id: AudienceId;
  accentBar: string;
  iconColor: string;
  icon: ReactNode;
  /** Link keys resolve to `home:audiences.<id>.links.<key>`. */
  links: Array<{ key: string; to: string }>;
};

/**
 * Where each audience is sent. Library links pre-apply filters through the URL
 * (see features/library/useDocumentFilters.ts), so a policymaker lands directly on
 * executive summaries rather than the whole archive.
 */
const PATHWAYS: Pathway[] = [
  {
    id: 'policymakers',
    accentBar: 'bg-coral',
    iconColor: 'text-coral',
    icon: <path d="M4 20h16M6 20V10m4 10V10m4 10V10m4 10V10M3 10l9-6 9 6" />,
    links: [
      { key: 'summaries', to: '/library?type=executive-summary&type=policy-brief' },
      { key: 'dashboards', to: '/dashboards' },
    ],
  },
  {
    id: 'researchers',
    accentBar: 'bg-aqua',
    iconColor: 'text-aqua',
    icon: <path d="M4 19V5m0 14h16M8 15l3-4 3 2 5-6" />,
    links: [
      { key: 'datasets', to: '/library?type=dataset' },
      { key: 'econometrics', to: '/library?type=econometric-analysis' },
      { key: 'archive', to: '/library' },
    ],
  },
  {
    id: 'public',
    accentBar: 'bg-kamaiya',
    iconColor: 'text-[#b07a16]',
    icon: <path d="M12 3v18M5 7h7m0 5h7M5 17h7M3 7a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm14 5a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM3 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />,
    links: [
      { key: 'timeline', to: '/timeline' },
      { key: 'oralHistories', to: '/oral-histories' },
      { key: 'geography', to: '/geography' },
    ],
  },
];

/**
 * Three audience entry points for the home page.
 * Mobile-first: a single column of cards, three columns from `lg`. Cards lift slightly on
 * hover and on keyboard focus (focus-within), and the lift is disabled for readers who
 * prefer reduced motion.
 */
export function AudiencePathways() {
  const { t } = useTranslation('home');

  return (
    <section className="ua bg-paper px-5 py-14 sm:px-7 lg:py-20" aria-labelledby="audience-pathways-heading">
      <div className="mx-auto max-w-[1180px]">
        <div className="max-w-2xl">
          <h2 id="audience-pathways-heading" className="mb-3 text-3xl text-navy sm:text-4xl">{t('audiences.heading')}</h2>
          <p className="m-0 text-base text-muted sm:text-lg">{t('audiences.intro')}</p>
        </div>

        <ul className="m-0 mt-10 grid list-none gap-5 p-0 lg:grid-cols-3 lg:gap-6">
          {PATHWAYS.map(({ id, accentBar, iconColor, icon, links }) => (
            <li
              key={id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-rule bg-white p-6 shadow-[0_1px_2px_#08233b0f] transition duration-200 focus-within:shadow-[0_18px_36px_#08233b1f] hover:shadow-[0_18px_36px_#08233b1f] motion-safe:focus-within:-translate-y-1 motion-safe:hover:-translate-y-1 sm:p-7"
            >
              <span className={`absolute inset-x-0 top-0 h-1.5 ${accentBar}`} aria-hidden="true" />
              <svg viewBox="0 0 24 24" className={`size-9 ${iconColor}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {icon}
              </svg>
              <p className="tw-eyebrow mt-5 mb-2 font-mono text-xs font-bold tracking-widest text-coral uppercase">{t(`audiences.${id}.label`)}</p>
              <h3 className="mb-3 text-2xl text-navy">{t(`audiences.${id}.title`)}</h3>
              <p className="mt-0 mb-6 text-[0.98rem] text-muted">{t(`audiences.${id}.description`)}</p>

              <ul className="m-0 mt-auto list-none space-y-1 border-t border-rule p-0 pt-4">
                {links.map((link) => (
                  <li key={link.key}>
                    <Link
                      to={link.to}
                      className="group/link flex min-h-11 items-center justify-between gap-3 rounded-lg px-2 font-bold text-navy no-underline hover:bg-mint focus-visible:bg-mint"
                    >
                      {/* Link keys differ per audience, so this one dynamic key is cast for TypeScript. */}
                      {t(`audiences.${id}.links.${link.key}` as 'audiences.researchers.links.archive')}
                      <span aria-hidden="true" className="text-aqua transition-transform motion-safe:group-hover/link:translate-x-1">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
