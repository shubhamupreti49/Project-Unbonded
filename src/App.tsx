import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RouteFallback } from './components/RouteFallback';
import CataloguePage from './pages/CataloguePage';
import HomePage from './pages/HomePage';
import TimelinePage from './pages/TimelinePage';
import ContactsPage from './pages/ContactsPage';
import MethodologyPage from './pages/MethodologyPage';
import { GeographyPage, NotFoundPage, SourceDetailPage } from './pages/LegacyPages';
import { Layout } from './main.jsx';

/*
 * Heavier routes are code-split: their JavaScript, data (documents.json) and Nepali strings
 * download only when a reader opens them. A reader who only visits the home page on a
 * 3G connection never pays for the library, dashboards or audio player.
 */
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const DashboardsPage = lazy(() => import('./pages/DashboardsPage'));
const OralHistoriesPage = lazy(() => import('./pages/OralHistoriesPage'));

// Keeps the header visible while a route chunk downloads.
const fallback = <Layout><RouteFallback /></Layout>;

export default function App() {
  return <Suspense fallback={fallback}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/dashboards" element={<DashboardsPage />} />
      <Route path="/oral-histories" element={<OralHistoriesPage />} />
      <Route path="/catalogue" element={<CataloguePage />} />
      <Route path="/timeline" element={<TimelinePage />} />
      <Route path="/geography" element={<GeographyPage />} />
      <Route path="/how-to-use" element={<MethodologyPage />} />
      <Route path="/source" element={<SourceDetailPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>;
}
