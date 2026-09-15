import type { LocalizedText } from '../../lib/localized';
import type { ShinyEmbedProps } from './ShinyEmbed';

export type DashboardConfig = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
} & Pick<ShinyEmbedProps, 'src' | 'estimatedSize' | 'staticVersionUrl' | 'loadStrategy'>;

/**
 * Dashboards shown on /dashboards.
 *
 * To publish a Shiny app: deploy it (e.g. rsconnect::deployApp()), paste its URL into
 * `src`, and add integrations/shiny/unbonded_embed.R to its UI so it auto-resizes.
 * Measure `estimatedSize` in Chrome DevTools → Network ("transferred" total, cache disabled).
 * Entries with an empty `src` render a "not yet published" placeholder.
 */
export const DASHBOARDS: DashboardConfig[] = [
  {
    id: 'rehabilitation-indicators',
    title: {
      en: 'Rehabilitation indicators by district',
      ne: 'जिल्लागत पुनर्स्थापना सूचक',
    },
    description: {
      en: 'Identified, eligible and land-recipient households for freed Kamaiya and Haliya families.',
      ne: 'मुक्त कमैया तथा हलिया परिवारका पहिचान भएका, योग्य तथा जग्गा पाएका घरधुरी।',
    },
    src: '', // TODO: e.g. 'https://<account>.shinyapps.io/rehabilitation-indicators/'
    estimatedSize: '2 MB',
  },
];
