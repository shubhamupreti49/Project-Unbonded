import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
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

// Wait for the reader's language (a ~2 KB chunk for Nepali; instant for English) so the
// first paint is already in the right language instead of flashing English.
i18nReady.finally(() => {
  createRoot(root).render(<React.StrictMode><HashRouter><App /></HashRouter></React.StrictMode>);
});
