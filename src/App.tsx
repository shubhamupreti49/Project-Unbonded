import { Route, Routes } from 'react-router-dom';
import CataloguePage from './pages/CataloguePage';
import HomePage from './pages/HomePage';
import TimelinePage from './pages/TimelinePage';
import ContactsPage from './pages/ContactsPage';
import MethodologyPage from './pages/MethodologyPage';
import { GeographyPage, NotFoundPage, SourceDetailPage } from './pages/LegacyPages';

export default function App() {
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/catalogue" element={<CataloguePage />} />
    <Route path="/timeline" element={<TimelinePage />} />
    <Route path="/geography" element={<GeographyPage />} />
    <Route path="/how-to-use" element={<MethodologyPage />} />
    <Route path="/source" element={<SourceDetailPage />} />
    <Route path="/contacts" element={<ContactsPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>;
}
