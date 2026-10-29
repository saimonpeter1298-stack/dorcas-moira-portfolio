// Usage: node tools/capture_hero_hd.js <label>
// Serves the project over HTTP in-process, loads it in headless Chrome at
// 375 (DPR3) / 768 (DPR2) / 1440 (DPR2), waits for the hero entrance to finish,
// then saves screenshots + metrics (served file, rendered size, console errors).
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LABEL = process.argv[2] || 'after';
const OUT = path.join(ROOT, 'assets', 'crops_verify', 'hero_hd');
const PORT = 3851;
const CDP = 9961;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.ico': 'image/x-icon', '.pdf': 'application/pdf' };

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const fetchJson = (url) => new Promise((res, rej) => http.get(url, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } }); }).on('error', rej));

function startServer() {
  return new Promise(resolve => {
    const s = http.createServer((req, res) => {
      let p = decodeURI(req.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      const f = path.join(ROOT, p);
      fs.stat(f, (err, st) => {
        if (err || !st.isFile()) { res.writeHead(404); res.end('404'); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
        fs.createReadStream(f).pipe(res);
      });
    });
    s.listen(PORT, '127.0.0.1', () => resolve(s));
  });
}

const VIEWPORTS = [
  { name: '375', width: 375, height: 812, dpr: 3, mobile: true },
  { name: '768', width: 768, height: 1024, dpr: 2, mobile: true },
  { name: '1440', width: 1440, height: 900, dpr: 2, mobile: false }
];

async function run() {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await startServer();
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', `--remote-debugging-port=${CDP}`,
    `--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_herohd_${Date.now()}`,
    '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', 'about:blank'
  ]);
  const report = {};
  try {
    await sleep(2500);
    const list = await fetchJson(`http://127.0.0.1:${CDP}/json/list`);
    const target = list.find(t => t.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r, { once: true }));
    let id = 1; const pending = new Map(); let errors = [];
    ws.addEventListener('message', (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) { const { resolve, reject } = pending.get(m.id); pending.delete(m.id); m.error ? reject(m.error) : resolve(m.result); return; }
      if (m.method === 'Runtime.exceptionThrown') errors.push('EXC ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
      if (m.method === 'Runtime.consoleAPICalled' && (m.params.type === 'error' || m.params.type === 'warning')) errors.push(m.params.type.toUpperCase() + ' ' + m.params.args.map(a => a.value || a.description).join(' '));
      if (m.method === 'Log.entryAdded' && (m.params.entry.level === 'error' || m.params.entry.level === 'warning')) errors.push('LOG ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
    });
    const send = (method, params = {}) => new Promise((resolve, reject) => { const i = id++; pending.set(i, { resolve, reject }); ws.send(JSON.stringify({ id: i, method, params })); });
    await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable'); await send('Network.enable');
    await send('Network.setCacheDisabled', { cacheDisabled: true });

    for (const vp of VIEWPORTS) {
      errors = [];
      await send('Emulation.setDeviceMetricsOverride', { width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr, mobile: vp.mobile });
      await send('Emulation.setTouchEmulationEnabled', { enabled: vp.mobile });
      await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
      // wait for loader to go + hero entrance to complete
      let t = 0;
      while (t < 15000) {
        await sleep(500); t += 500;
        const r = await send('Runtime.evaluate', { expression: `(() => { const l = document.getElementById('siteLoader'); return !l || getComputedStyle(l).display === 'none' || getComputedStyle(l).visibility === 'hidden' || getComputedStyle(l).opacity === '0' || document.body.classList.contains('is-loaded'); })()`, returnByValue: true });
        if (r.result.value) break;
      }
      await sleep(3500);
      await send('Runtime.evaluate', { expression: 'window.scrollTo(0,0)' });
      await sleep(400);
      const metrics = await send('Runtime.evaluate', { returnByValue: true, expression: `(() => {
        const img = document.getElementById('heroCutoutImg');
        const layer = document.getElementById('heroLayerSubject');
        const pic = img.closest('picture');
        const r = (el) => { const b = el.getBoundingClientRect(); return { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) }; };
        const cs = getComputedStyle(img);
        const words = [...document.querySelectorAll('.hero-word-mobile .word-line, .hero-word-desktop .word-line')].filter(e => e.offsetParent).map(e => ({ t: e.textContent, ...r(e) }));
        return {
          dpr: devicePixelRatio, vw: innerWidth, vh: innerHeight,
          currentSrc: img.currentSrc.split('/').pop(), naturalW: img.naturalWidth, naturalH: img.naturalHeight,
          imgRect: r(img), layerRect: r(layer), picRect: r(pic), heroRect: r(document.getElementById('hero')),
          imgTransform: cs.transform, imgFilter: cs.filter, imgWillChange: cs.willChange, imgOpacity: cs.opacity,
          picFilter: getComputedStyle(pic).filter, layerZ: getComputedStyle(layer).zIndex,
          words
        };
      })()` });
      const m = metrics.result.value;
      m.consoleErrors = errors.slice();
      report[vp.name] = m;
      const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      fs.writeFileSync(path.join(OUT, `${LABEL}_${vp.name}.png`), Buffer.from(shot.data, 'base64'));
      console.log(vp.name, JSON.stringify(m));
    }
    fs.writeFileSync(path.join(OUT, `${LABEL}_metrics.json`), JSON.stringify(report, null, 2));
  } finally {
    try { chrome.kill(); } catch (e) {}
    server.close();
  }
}
run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
