const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MODE = process.argv[2] || 'before';
const OUT = path.join(ROOT, 'assets', 'crops_verify', `perf_${MODE}`);
const PORT = 3857;
const CDP = 9967;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const fetchJson = (url) => new Promise((res, rej) => http.get(url, r => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } });
}).on('error', rej));

function startServer() {
  return new Promise(resolve => {
    const s = http.createServer((req, res) => {
      let p = decodeURI(req.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      const f = path.join(ROOT, p);
      fs.stat(f, (err, st) => {
        if (err || !st.isFile()) {
          res.writeHead(404);
          res.end('404');
          return;
        }
        res.writeHead(200, {
          'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream',
          'Cache-Control': 'no-store'
        });
        fs.createReadStream(f).pipe(res);
      });
    });
    s.listen(PORT, '127.0.0.1', () => resolve(s));
  });
}

const VIEWPORTS = [
  { name: '375', width: 375, height: 812, dpr: 2, mobile: true },
  { name: '1440', width: 1440, height: 900, dpr: 2, mobile: false }
];

const SECTIONS = [
  { id: 'hero', name: '00_hero' },
  { id: 'manifesto', name: '01_manifesto' },
  { id: 'about', name: '02_about' },
  { id: 'comp-card', name: '03_comp_card' },
  { id: 'chap-01', name: '04_chap_01_signature' },
  { id: 'chap-02', name: '05_chap_02_many_moods' },
  { id: 'chap-03', name: '06_chap_03_afro_chic' },
  { id: 'chap-04', name: '07_chap_04_studio' },
  { id: 'chap-05', name: '08_chap_05_sun_kissed' },
  { id: 'visual-mosaic', name: '09_visual_mosaic' },
  { id: 'motion', name: '10_motion' },
  { id: 'why-me', name: '11_why_me' },
  { id: 'journey', name: '12_journey' },
  { id: 'metrics', name: '13_metrics' },
  { id: 'references', name: '14_references' },
  { id: 'contact', name: '15_contact' }
];

async function run() {
  fs.mkdirSync(OUT, { recursive: true });
  console.log(`Starting capture mode: ${MODE}, output to: ${OUT}`);
  const server = await startServer();
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${CDP}`,
    `--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_perf_cap_${Date.now()}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    'about:blank'
  ]);

  try {
    await sleep(2500);
    const list = await fetchJson(`http://127.0.0.1:${CDP}/json/list`);
    const target = list.find(t => t.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r, { once: true }));

    let id = 1;
    const pending = new Map();

    ws.addEventListener('message', (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) {
        const { resolve, reject } = pending.get(m.id);
        pending.delete(m.id);
        m.error ? reject(m.error) : resolve(m.result);
        return;
      }
    });

    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const i = id++;
      pending.set(i, { resolve, reject });
      ws.send(JSON.stringify({ id: i, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');

    for (const vp of VIEWPORTS) {
      console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height} dpr=${vp.dpr})`);

      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.dpr,
        mobile: vp.mobile
      });

      await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
      await sleep(3500);

      // Pre-scroll the whole page once to trigger lazy loads and complete layout
      await send('Runtime.evaluate', {
        expression: `(async () => {
          document.querySelectorAll('img').forEach(img => {
            img.loading = 'eager';
          });
          const totalH = document.body.scrollHeight;
          for (let y = 0; y < totalH; y += 1000) {
            window.scrollTo(0, y);
            await new Promise(r => setTimeout(r, 60));
          }
          window.scrollTo(0, 0);
        })()`,
        awaitPromise: true
      });
      await sleep(1500);

      // Capture each section
      for (const sec of SECTIONS) {
        await send('Runtime.evaluate', {
          expression: `(() => {
            const el = document.getElementById('${sec.id}');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
          })()`
        });
        await sleep(400);

        const rectEval = await send('Runtime.evaluate', {
          expression: `(() => {
            const el = document.getElementById('${sec.id}');
            if (!el || el.offsetParent === null) return null;
            const r = el.getBoundingClientRect();
            return {
              x: Math.max(0, r.left + window.scrollX),
              y: Math.max(0, r.top + window.scrollY),
              width: r.width,
              height: r.height,
              visible: r.width > 0 && r.height > 0
            };
          })()`,
          returnByValue: true
        });

        const rect = rectEval.result.value;
        if (!rect || !rect.visible) {
          console.log(`  Section ${sec.name} (#${sec.id}) is hidden or not present`);
          continue;
        }

        console.log(`  Section ${sec.name}: rect = ${Math.round(rect.width)}x${Math.round(rect.height)} at y=${Math.round(rect.y)}`);

        // If height > 4000, cap it to avoid chrome screenshot limits
        const clipHeight = Math.min(rect.height, 4000);

        const scr = await send('Page.captureScreenshot', {
          format: 'jpeg',
          quality: 85,
          clip: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: clipHeight,
            scale: 1
          },
          captureBeyondViewport: true
        });

        const outPath = path.join(OUT, `${sec.name}_${vp.name}px.jpg`);
        fs.writeFileSync(outPath, Buffer.from(scr.data, 'base64'));
        console.log(`  Saved screenshot: ${path.basename(outPath)}`);
      }
    }

    console.log(`\n[SUCCESS] Completed capture for mode: ${MODE}`);
  } finally {
    chrome.kill();
    server.close();
  }
}

run().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
