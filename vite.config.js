import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Absolute asset paths: pages now live at real addresses such as /source/SRC-013/, so a
  // relative "./assets/…" would resolve inside that folder and fail.
  base: '/',
  plugins: [react(), tailwindcss()]
});
