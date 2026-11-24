// Copy the web app (../cham-cong) into www/ for the native app.
// SheetJS is bundled locally so Excel export works offline; the service worker is not needed.
const fs = require('fs'), path = require('path');
const src = path.join(__dirname, '..', '..', 'cham-cong'), out = path.join(__dirname, '..', 'www');
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out);
let html = fs.readFileSync(path.join(src, 'index.html'), 'utf8');
const cdn = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
if (!html.includes(cdn)) throw new Error('xlsx CDN tag not found in index.html');
html = html.replace(cdn, 'xlsx.full.min.js').replace('<title>', '<script src="capacitor.js"></script>\n<title>').replace(/<link rel="manifest"[^>]*>\n?/, '');
fs.writeFileSync(path.join(out, 'index.html'), html);
for (const f of ['icon-180.png', 'icon-192.png', 'icon-512.png']) fs.copyFileSync(path.join(src, f), path.join(out, f));
fs.copyFileSync(require.resolve('@capacitor/core/dist/capacitor.js'), path.join(out, 'capacitor.js'));
fs.copyFileSync(require.resolve('xlsx/dist/xlsx.full.min.js'), path.join(out, 'xlsx.full.min.js'));
console.log('www ready:', fs.readdirSync(out).join(', '));
