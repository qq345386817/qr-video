import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const exists = async (file) => { try { return (await stat(file)).isFile(); } catch { return false; } };
const port = Number(process.env.PORT || 4173);
http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) { response.writeHead(403).end(); return; }
    if (pathname.includes('/.') || pathname.startsWith('/scripts/') || pathname.startsWith('/content/')) { response.writeHead(404).end(); return; }
    const candidates = [file, file + '.html', path.join(file, 'index.html')];
    file = (await Promise.all(candidates.map(exists))).map((found, i) => found && candidates[i]).find(Boolean);
    const status = file ? 200 : 404;
    file ||= path.join(root, '404.html');
    response.writeHead(status, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(await readFile(file));
  } catch { response.writeHead(400).end(); }
}).listen(port, '127.0.0.1', () => console.log(`Website at http://127.0.0.1:${port}`));
