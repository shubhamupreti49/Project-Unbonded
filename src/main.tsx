import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { i18nReady } from './i18n';
import App from './App';
import '../assets/site.css';
import '../assets/site-repair.css';
import '../assets/ux-refinement.css';
import '../assets/redesign-fixes.css';
// Tailwind loads last so its utilities and header adjustments sit on top of the legacy CSS.
import './styles/tailwind.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element was not found.');

// Addresses used to look like /#/research. Rewrite them to /research before the router starts,
// so old links, bookmarks and shared URLs keep working.
if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', window.location.hash.slice(1));
}

// Wait for the reader's language (a ~2 KB chunk for Nepali; instant for English) so the
// first paint is already in the right language instead of flashing English.
i18nReady.finally(() => {
  createRoot(root).render(<React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>);
});
