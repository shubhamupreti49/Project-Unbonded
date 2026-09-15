import { data } from '../../../data/sources.js';

export type Researcher = {
  name: string;
  /** How the researcher appears in the `contributor` column of data/sources.js. */
  contributorKey: string;
};

/**
 * Researchers who completed phase one of the archive. The project lead continues into the
 * next phase and is credited separately on the page.
 * Names stay in their own (Latin) spelling in both languages.
 */
export const PHASE_ONE_RESEARCHERS: Researcher[] = [
  { name: 'Aaspad Lamichhane', contributorKey: 'Aaspad' },
  { name: 'Kritika Luitel', contributorKey: 'Kritika' },
  { name: 'Melish Prasai', contributorKey: 'Melish' },
  { name: 'Nirjhara Shrestha', contributorKey: 'Nirjhara' },
  { name: 'Shushant Upreti', contributorKey: 'Shusant' },
];

/** Number of source records each researcher catalogued, read from the source workbook data. */
export function countCataloguedRecords(researcher: Researcher): number {
  return data.sources.filter((source) => source.contributor?.includes(researcher.contributorKey)).length;
}
