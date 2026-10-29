const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'crops_verify', 'hero_tagline_check');
const PORT = 3859;
const CDP = 9969;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.ico': 'image/x-icon' };

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const fetchJson = (url) => new Promise((res, rej) => http.get(url, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } }); }).on('error', rej));

function startServer() {
  return new Promise(resolve => {
    const s = http.createServer((req, res) => {
      let p = decodeURI(req.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      const f = path.join(ROOT, p.replace(/^\/+/, ''));
      fs.stat(f, (err, st) => {
        if (err || !st.isFile()) { res.writeHead(404); res.end('404'); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' });
        fs.createReadStream(f).pipe(res);
      });
    });
    s.listen(PORT, '127.0.0.1', () => resolve(s));
  });
}

const VIEWPORTS = [
  { name: '375', width: 375, height: 812, dpr: 3, mobile: true },
  { name: '1440', width: 1440, height: 900, dpr: 2, mobile: false }
];

async function run() {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await startServer();
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', `--remote-debugging-port=${CDP}`,
    `--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_hero_clean_${Date.now()}`,
    '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', 'about:blank'
  ]);
  const results = {};
  try {
    await sleep(2500);
    const list = await fetchJson(`http://127.0.0.1:${CDP}/json/list`);
    const target = list.find(t => t.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r, { once: true }));
    let id = 1; const pending = new Map(); let errors = [];
    ws.addEventListener('message', (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) {
        const { resolve, reject } = pending.get(m.id);
        pending.delete(m.id);
        m.error ? reject(m.error) : resolve(m.result);
      }
      if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
        errors.push(m.params.args.map(a => a.value || a.description).join(' '));
      }
    });
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    await send('Runtime.enable');
    await send('Page.enable');

    for (const vp of VIEWPORTS) {
      errors = [];
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr, mobile: vp.mobile
      });
      await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
      await sleep(2500);

      // Measure all visible text elements in the hero
      const heroEvaluation = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const img = document.getElementById('heroCutoutImg');
          const imgRect = img.getBoundingClientRect();

          const candidates = [
            { name: 'annot-top-left', el: document.querySelector('.annot-top-left') },
            { name: 'annot-top-right', el: document.querySelector('.annot-top-right') },
            { name: 'annot-bottom-left', el: document.querySelector('.annot-bottom-left') },
            { name: 'annot-bottom-right', el: document.querySelector('.annot-bottom-right') },
            { name: 'scroll-cue', el: document.querySelector('.hero-scroll-cue') },
            { name: 'badge-pill', el: document.querySelector('.hero-badge-pill') }
          ];

          const items = candidates.map(c => {
            if (!c.el) return { name: c.name, present: false };
            const cs = window.getComputedStyle(c.el);
            if (cs.display === 'none' || cs.visibility === 'hidden') return { name: c.name, visible: false };
            const r = c.el.getBoundingClientRect();
            // check overlap with image bounds
            const overlapX = Math.max(0, Math.min(r.right, imgRect.right) - Math.max(r.left, imgRect.left));
            const overlapY = Math.max(0, Math.min(r.bottom, imgRect.bottom) - Math.max(r.top, imgRect.top));
            const hasOverlap = (overlapX > 0 && overlapY > 0);
            return {
              name: c.name,
              visible: true,
              text: c.el.innerText.trim().replace(/\\s+/g, ' '),
              rect: { left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), bottom: Math.round(r.bottom), width: Math.round(r.width), height: Math.round(r.height) },
              hasOverlapWithImgBoundingBox: hasOverlap,
              overlapArea: hasOverlap ? Math.round(overlapX * overlapY) : 0
            };
          });

          // Check also About section lead tagline
          const aboutTagline = document.querySelector('.about-lead-tagline');
          const aboutTaglineCS = aboutTagline ? window.getComputedStyle(aboutTagline) : null;

          return {
            imgRect: { left: Math.round(imgRect.left), right: Math.round(imgRect.right), top: Math.round(imgRect.top), bottom: Math.round(imgRect.bottom) },
            heroElements: items,
            aboutTagline: aboutTagline ? {
              text: aboutTagline.innerText.trim(),
              fontSize: aboutTaglineCS.fontSize,
              color: aboutTaglineCS.color
            } : null
          };
        })()`
      });

      // Capture screenshot of the Hero
      const shotHero = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(OUT, `hero_${vp.name}.png`), Buffer.from(shotHero.data, 'base64'));

      // Scroll to about section and capture screenshot
      await send('Runtime.evaluate', {
        expression: `document.getElementById('about').scrollIntoView({ behavior: 'instant', block: 'start' });`
      });
      await sleep(400);
      const shotAbout = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(OUT, `about_${vp.name}.png`), Buffer.from(shotAbout.data, 'base64'));

      results[vp.name] = { evaluation: heroEvaluation.result.value, errors };
    }

    fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 2));
    console.log("=== VERIFICATION RESULTS ===");
    console.log(JSON.stringify(results, null, 2));
  } finally {
    try { chrome.kill(); } catch (e) {}
    try { server.close(); } catch (e) {}
  }
}

run().catch(console.error);
