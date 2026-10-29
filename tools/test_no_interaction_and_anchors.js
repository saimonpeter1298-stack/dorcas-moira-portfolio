const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const OUT_DIR = path.join(ROOT, 'assets', 'crops_verify', 'no_interaction_test');
fs.mkdirSync(OUT_DIR, { recursive: true });

const PORT = 3881;
const CDP_PORT = 9978;

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
        const acceptEncoding = req.headers['accept-encoding'] || '';
        const compressible = ['.html', '.css', '.js', '.json', '.xml', '.svg', '.txt'].includes(ext);

        if (compressible && acceptEncoding.includes('gzip')) {
          res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Encoding': 'gzip',
            'Cache-Control': 'no-store'
          });
          fs.createReadStream(f).pipe(zlib.createGzip()).pipe(res);
        } else {
          res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-store'
          });
          fs.createReadStream(f).pipe(res);
        }
      });
    });
    s.listen(PORT, '127.0.0.1', () => resolve(s));
  });
}

async function main() {
  const server = await startServer();
  console.log(`Server started on http://127.0.0.1:${PORT}`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeArgs = [
    `--remote-debugging-port=${CDP_PORT}`,
    '--headless=new',
    `--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_no_int_${Date.now()}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    '--no-sandbox',
    '--disable-gpu',
    'about:blank'
  ];

  const chrome = spawn(chromePath, chromeArgs);
  await sleep(2000);

  const WebSocket = require('ws') || (await import('ws')).default;
  const list = await fetchJson(`http://127.0.0.1:${CDP_PORT}/json/list`);
  const target = list.find(t => t.type === 'page');
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  let id = 1;
  const pending = new Map();

  ws.on('message', (data) => {
    const m = JSON.parse(data);
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

  await new Promise(r => ws.on('open', r));

  await send('Page.enable');
  await send('Runtime.enable');

  const viewports = [
    { name: '375px', width: 375, height: 812, dpr: 2, mobile: true },
    { name: '1440px', width: 1440, height: 900, dpr: 2, mobile: false }
  ];

  for (const vp of viewports) {
    console.log(`\n========================================`);
    console.log(`TEST VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`========================================`);

    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dpr,
      mobile: vp.mobile
    });

    console.log(`Navigating to http://127.0.0.1:${PORT}/ ...`);
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });

    console.log(`Waiting 5.0 seconds WITHOUT ANY USER INTERACTION...`);
    await sleep(5000);

    // 1. Check if Stage 2 fired automatically
    const readyState = await send('Runtime.evaluate', {
      expression: '({ ready: !!window.__PORTFOLIO_READY__, dataLoaded: typeof PORTFOLIO_DATA !== "undefined", gsapLoaded: typeof gsap !== "undefined" })',
      returnByValue: true
    });
    console.log('Auto Stage 2 Status after 5s no-interaction:', readyState.result.value);

    // 2. Check each section content (ensure no empty sections)
    const sectionsCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const sections = Array.from(document.querySelectorAll('section[id]'));
        return sections.map(s => ({
          id: s.id,
          textLength: s.textContent.trim().length,
          renderedTextLength: s.innerText.trim().length,
          imgCount: s.querySelectorAll('img').length,
          height: s.offsetHeight
        }));
      })()`,
      returnByValue: true
    });

    console.log('\nSections Content Audit (after 5s idle):');
    let anyEmpty = false;
    sectionsCheck.result.value.forEach(s => {
      const ok = (s.textLength > 0 || s.imgCount > 0) && s.height > 0;
      if (!ok) anyEmpty = true;
      console.log(`  #${s.id.padEnd(16)} : text=${s.textLength} chars (rendered=${s.renderedTextLength}), imgs=${s.imgCount}, height=${s.height}px [${ok ? 'NON-EMPTY OK' : 'EMPTY FAIL'}]`);
    });

    if (anyEmpty) {
      console.error('[FAIL] Some sections are empty!');
    } else {
      console.log('[SUCCESS] All sections contain valid content without any interaction!');
    }

    // 3. Capture full-page screenshot
    const layout = await send('Page.getLayoutMetrics');
    const fullHeight = Math.ceil(layout.contentSize.height);

    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: fullHeight,
      deviceScaleFactor: 1,
      mobile: vp.mobile
    });
    await sleep(500);

    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 75 });
    const shotPath = path.join(OUT_DIR, `fullpage_${vp.name}.jpg`);
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    console.log(`Saved full page screenshot: ${shotPath} (${(fs.statSync(shotPath).size / 1024).toFixed(1)} KB)`);

    // Reset viewport for anchor test
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dpr,
      mobile: vp.mobile
    });
    await sleep(300);

    // 4. Test anchor links
    console.log(`\nTesting Anchor Links Navigation on ${vp.name}...`);
    const anchorsToTest = ['#selected-works', '#contact', '#about', '#comp-card'];
    for (const hash of anchorsToTest) {
      await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.querySelector('${hash}');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()`
      });
      await sleep(300);

      const pos = await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.querySelector('${hash}');
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const scrollY = window.scrollY;
          return {
            hash: '${hash}',
            scrollY: Math.round(scrollY),
            top: Math.round(rect.top),
            height: Math.round(rect.height),
            inViewport: rect.top < window.innerHeight && rect.bottom > 0
          };
        })()`,
        returnByValue: true
      });
      console.log(`  Anchor ${hash.padEnd(16)}: scrollY=${pos.result.value.scrollY}px, rect.top=${pos.result.value.top}px, visible=${pos.result.value.inViewport} [${pos.result.value.inViewport ? 'ARRIVED OK' : 'MISSING'}]`);
    }
  }

  ws.close();
  chrome.kill();
  server.close();
  console.log(`\n[SUCCESS] Completed all no-interaction and anchor checks!`);
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
