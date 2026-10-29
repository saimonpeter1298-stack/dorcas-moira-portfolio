const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const OUT_DIR = path.join(ROOT, 'assets', 'crops_verify', 'mobile_stability');
fs.mkdirSync(OUT_DIR, { recursive: true });

const PORT = 3890;
const CDP_PORT = 9990;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.xml': 'application/xml'
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
      const f = path.join(DIST, p);
      fs.stat(f, (err, st) => {
        if (err || !st.isFile()) {
          res.writeHead(404);
          res.end('404');
          return;
        }
        const ext = path.extname(f).toLowerCase();
        const contentType = MIME[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-store' });
        fs.createReadStream(f).pipe(res);
      });
    });
    s.listen(PORT, '127.0.0.1', () => resolve(s));
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }
  async connect() {
    const WebSocket = require('ws');
    this.ws = new WebSocket(this.wsUrl);
    return new Promise((resolve, reject) => {
      this.ws.on('open', resolve);
      this.ws.on('error', reject);
      this.ws.on('message', data => {
        const msg = JSON.parse(data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { res, rej } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) rej(msg.error);
          else res(msg.result);
        }
      });
    });
  }
  send(method, params = {}) {
    const id = this.id++;
    return new Promise((res, rej) => {
      this.callbacks.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
}

async function main() {
  const server = await startServer();
  console.log(`Server started on http://127.0.0.1:${PORT}`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeArgs = [
    `--remote-debugging-port=${CDP_PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,1024'
  ];
  const chrome = spawn(chromePath, chromeArgs);
  await sleep(1500);

  const targets = await fetchJson(`http://127.0.0.1:${CDP_PORT}/json/list`);
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('DOM.enable');

  const widths = [320, 375, 390, 430];
  const report = {};

  for (const w of widths) {
    console.log(`\n=================== TESTING VIEWPORT WIDTH: ${w}px ===================`);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: 700,
      deviceScaleFactor: 2,
      mobile: true
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
    await sleep(2500);

    // Test horizontal scroll immunity & find unclipped overflows
    const evalRes = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const docEl = document.documentElement;
          const body = document.body;
          const vw = window.innerWidth;
          
          // 1. Can the page be horizontally scrolled?
          window.scrollTo(200, 0);
          const scrollXAfterForce = window.scrollX;
          window.scrollTo(0, 0);

          // 2. Max scrollWidth vs viewport
          const docScrollW = docEl.scrollWidth;
          const bodyScrollW = body.scrollWidth;

          // 3. Check horizontal stability during vertical scroll
          const scrollSteps = [0, 500, 1200, 2000, 3000, 4000];
          const xDrifts = [];
          scrollSteps.forEach(y => {
            window.scrollTo(0, y);
            xDrifts.push({ y, x: window.scrollX });
          });
          window.scrollTo(0, 0);

          // 4. Hero text measurement
          const heroWord = document.querySelector('.hero-word-single .line-single');
          const heroRect = heroWord ? heroWord.getBoundingClientRect() : null;
          const heroWrap = document.querySelector('.hero-word-wrap');
          const heroWrapRect = heroWrap ? heroWrap.getBoundingClientRect() : null;
          const scriptCreative = document.querySelector('.hero-script-creative');
          const scriptRect = scriptCreative ? scriptCreative.getBoundingClientRect() : null;
          const subject = document.getElementById('heroLayerSubject');
          const subjectRect = subject ? subject.getBoundingClientRect() : null;

          // 5. Inspect unclipped elements extending beyond viewport
          const unclippedOverflows = [];
          const all = Array.from(document.querySelectorAll('*'));
          all.forEach(el => {
            if (['SCRIPT', 'STYLE', 'HEAD', 'META', 'LINK'].includes(el.tagName)) return;
            const cs = window.getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden') return;

            const r = el.getBoundingClientRect();
            const rightOver = r.right - vw;
            const leftOver = -r.left;

            // Check if element has uncontained overflow
            if (rightOver > 1.5 || leftOver > 1.5) {
              // Check ancestor clipping
              let cur = el.parentElement;
              let clipped = false;
              while (cur && cur !== document.documentElement) {
                const s = window.getComputedStyle(cur);
                if (['hidden', 'clip'].includes(s.overflowX) || ['hidden', 'clip'].includes(s.overflow)) {
                  clipped = true;
                  break;
                }
                cur = cur.parentElement;
              }

              if (!clipped) {
                unclippedOverflows.push({
                  tag: el.tagName.toLowerCase(),
                  id: el.id,
                  cls: el.className,
                  text: (el.innerText || '').slice(0, 30).trim(),
                  rect: { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) },
                  rightOver: Math.round(rightOver),
                  leftOver: Math.round(leftOver)
                });
              }
            }
          });

          return {
            vw,
            docScrollW,
            bodyScrollW,
            scrollXAfterForce,
            xDrifts,
            unclippedCount: unclippedOverflows.length,
            unclippedOverflows,
            hero: {
              wordText: heroWord ? heroWord.innerText : null,
              wordWidth: heroRect ? Math.round(heroRect.width) : null,
              wordRight: heroRect ? Math.round(heroRect.right) : null,
              wordFits: heroRect ? (heroRect.right <= vw && heroRect.left >= 0) : null,
              scriptFits: scriptRect ? (scriptRect.right <= vw && scriptRect.left >= 0) : null,
              subjectTop: subjectRect ? Math.round(subjectRect.top) : null,
              wordTop: heroRect ? Math.round(heroRect.top) : null
            }
          };
        })()
      `,
      returnByValue: true
    });

    const res = evalRes.result.value;
    report[w] = res;
    console.log(JSON.stringify(res, null, 2));

    // Capture screenshots at 375px
    if (w === 375) {
      console.log('Capturing screenshots for 375px...');
      // 1. Hero
      await cdp.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
      await sleep(500);
      const heroShot = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
      fs.writeFileSync(path.join(OUT_DIR, 'hero_375px.jpg'), Buffer.from(heroShot.data, 'base64'));

      // 2. In-scroll (About / Directions)
      await cdp.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 750);' });
      await sleep(600);
      const scrollShot = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
      fs.writeFileSync(path.join(OUT_DIR, 'in_scroll_375px.jpg'), Buffer.from(scrollShot.data, 'base64'));

      // 3. Corrected section (Why me / Metrics)
      await cdp.send('Runtime.evaluate', { expression: `
        const el = document.getElementById('why-me');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      ` });
      await sleep(600);
      const whyMeShot = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
      fs.writeFileSync(path.join(OUT_DIR, 'corrected_section_why_me_375px.jpg'), Buffer.from(whyMeShot.data, 'base64'));

      // 4. Metrics section
      await cdp.send('Runtime.evaluate', { expression: `
        const el = document.getElementById('metrics');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      ` });
      await sleep(600);
      const metricsShot = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
      fs.writeFileSync(path.join(OUT_DIR, 'metrics_section_375px.jpg'), Buffer.from(metricsShot.data, 'base64'));
    }
  }

  chrome.kill();
  server.close();
  console.log('\nAll tests and captures completed!');
}

main().catch(console.error);
