import type { ReactNode } from 'react';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lead: string;
  children?: ReactNode;
};

/** Text-only page header: no background image, so it renders instantly on any connection. */
export function PageHero({ eyebrow, title, lead, children }: PageHeroProps) {
  return (
    <section className="ua bg-night px-5 pt-12 pb-10 text-white sm:px-7 sm:pt-16 lg:pt-20 lg:pb-14">
      <div className="mx-auto max-w-[1180px]">
        <p className="tw-eyebrow m-0 font-mono text-xs font-bold tracking-widest text-sun uppercase">{eyebrow}</p>
        <h1 className="mt-3 mb-4 max-w-3xl text-4xl text-white sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="m-0 max-w-2xl text-base text-[#d9eeee] sm:text-lg">{lead}</p>
        {children}
      </div>
    </section>
  );
}
