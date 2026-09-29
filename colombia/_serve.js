/* Servidor local para revisar "Ventas Colombia" antes de publicarla en GitHub Pages.
   Sirve la carpeta drainpro (la de arriba) para que los íconos de ../panel/ carguen igual
   que en la web. Abrir http://localhost:5070/colombia/ */
const http = require('http');
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8', '.ico': 'image/x-icon' };

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/' ) { res.writeHead(302, { Location: '/colombia/' }).end(); return; }
  if (p.endsWith('/')) p += 'index.html';
  const arch = path.join(RAIZ, p);
  if (!arch.startsWith(RAIZ)) { res.writeHead(403).end('no'); return; }
  fs.readFile(arch, (e, d) => {
    if (e) { res.writeHead(404, { 'Content-Type': 'text/plain' }).end('404'); return; }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arch)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(d);
  });
}).listen(5070, () => console.log('Ventas Colombia en http://localhost:5070/colombia/'));
