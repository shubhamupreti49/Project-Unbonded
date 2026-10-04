import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { RouteFallback } from './components/RouteFallback';
import { RouteMeta } from './components/RouteMeta';
import { LegacyResearchRedirect } from './features/research/legacyRedirects';
import HomePage from './pages/HomePage';
import TimelinePage from './pages/TimelinePage';
import ContactsPage from './pages/ContactsPage';
import MethodologyPage from './pages/MethodologyPage';
import { GeographyPage, NotFoundPage, SourceDetailPage } from './pages/LegacyPages';
import { Layout } from './main.jsx';

/*
 * Heavier routes are code-split: their JavaScript, data and Nepali strings download only
 * when a reader opens them. A reader who only visits the home page on a 3G connection
 * never pays for the research filters, articles or Markdown renderer.
 */
const ResearchPage = lazy(() => import('./pages/ResearchPage'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const WriteForUsPage = lazy(() => import('./pages/WriteForUsPage'));
const ResearchersPage = lazy(() => import('./pages/ResearchersPage'));

// Keeps the header visible while a route chunk downloads.
const fallback = <Layout><RouteFallback /></Layout>;

/**
 * main.tsx rewrites an old /#/… address on page load. This catches the same kind of link when
 * it is followed while the site is already open, which changes only the hash and so does not
 * reload the page.
 */
function LegacyHashLinks() {
  const navigate = useNavigate();
  useEffect(() => {
    const onHashChange = () => { if (window.location.hash.startsWith('#/')) navigate(window.location.hash.slice(1), { replace: true }); };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [navigate]);
  return null;
}

export default function App() {
  return <Suspense fallback={fallback}>
    <RouteMeta />
    <LegacyHashLinks />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/research" element={<ResearchPage />} />
      <Route path="/timeline" element={<TimelinePage />} />
      <Route path="/geography" element={<GeographyPage />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/articles/:slug" element={<ArticlePage />} />
      <Route path="/write-for-us" element={<WriteForUsPage />} />
      <Route path="/how-to-use" element={<MethodologyPage />} />
      <Route path="/source/:id" element={<SourceDetailPage />} />
      {/* Former record address, /source?id=SRC-013: redirects to /source/SRC-013. */}
      <Route path="/source" element={<SourceDetailPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/researchers-phase-one" element={<ResearchersPage />} />

      {/* Former tabs: old links and bookmarks land on their replacement. */}
      <Route path="/library" element={<LegacyResearchRedirect from="library" />} />
      <Route path="/catalogue" element={<LegacyResearchRedirect from="catalogue" />} />
      <Route path="/dashboards" element={<Navigate replace to="/geography" />} />
      {/*
        Oral histories is paused until verified interviews are ready. The page and player are
        kept in pages/OralHistoriesPage.tsx and features/oral-histories/. To bring it back,
        lazy-import the page here, route /oral-histories to it, and add ['oralHistories',
        '/oral-histories'] to primaryNav in main.jsx.
      */}
      <Route path="/oral-histories" element={<Navigate replace to="/" />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>;
}
