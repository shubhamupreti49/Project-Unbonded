/*
 * Serves the built site (dist/) the way GitHub Pages does, to check a build before pushing:
 * a folder without a trailing slash redirects to it, a folder serves its index.html, and any
 * address without a file gets 404.html with status 404.
 *
 *   npm run build && node scripts/serve-dist.mjs        → http://localhost:4173
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT) || 4173;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.csv': 'text/csv; charset=utf-8' };

http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const target = path.join(dist, decodeURIComponent(url.pathname));
  if (!target.startsWith(dist)) { response.writeHead(400).end(); return; }
  let file = target;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!url.pathname.endsWith('/')) { response.writeHead(301, { Location: `${url.pathname}/${url.search}` }).end(); return; }
    file = path.join(file, 'index.html');
  }
  const found = fs.existsSync(file) && fs.statSync(file).isFile();
  const served = found ? file : path.join(dist, '404.html');
  response.writeHead(found ? 200 : 404, { 'Content-Type': types[path.extname(served)] ?? 'application/octet-stream' });
  fs.createReadStream(served).pipe(response);
}).listen(port, () => console.log(`Serving dist/ like GitHub Pages at http://localhost:${port}`));
