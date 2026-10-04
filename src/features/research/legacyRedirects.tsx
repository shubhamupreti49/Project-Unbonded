import { Navigate, useSearchParams } from 'react-router-dom';

/**
 * The Library and Source catalogue tabs were merged into /research. Old links, bookmarks
 * and shared URLs keep working: their search and filters are carried over where Research
 * has an equivalent (the Library's region and document-type filters covered only 8 papers
 * and have no equivalent, so they are dropped).
 */
const COMMUNITY_TO_SYSTEM: Record<string, string> = { kamaiya: 'Kamaiya', haliya: 'Haliya', 'haruwa-charuwa': 'Haruwa-Charuwa', kamlari: 'Kamlari' };

export function LegacyResearchRedirect({ from }: { from: 'catalogue' | 'library' }) {
  const [params] = useSearchParams();
  const next = new URLSearchParams();
  const q = params.get('q');
  if (q) next.set('q', q);
  if (from === 'catalogue') {
    for (const key of ['system', 'method', 'theme']) { const value = params.get(key); if (value) next.append(key, value); }
    const year = Number(params.get('year'));
    if (year) next.set('decade', String(Math.floor(year / 10) * 10));
  } else {
    params.getAll('community').forEach((community) => { if (COMMUNITY_TO_SYSTEM[community]) next.append('system', COMMUNITY_TO_SYSTEM[community]); });
  }
  const search = next.toString();
  return <Navigate replace to={`/research${search ? `?${search}` : ''}`} />;
}
