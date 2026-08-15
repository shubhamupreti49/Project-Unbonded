import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import '../assets/site.css';
import '../assets/site-repair.css';
import '../assets/ux-refinement.css';
import '../assets/redesign-fixes.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element was not found.');
createRoot(root).render(<React.StrictMode><HashRouter><App /></HashRouter></React.StrictMode>);
