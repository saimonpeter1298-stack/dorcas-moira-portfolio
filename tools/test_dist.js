const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '..', 'dist');
const PORT = 3870;
const CDP = 9970;

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
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain'
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const fetchJson = (url) => new Promise((res, rej) => http.get(url, r => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } });
}).on('error', rej));

function startDistServer() {
  return new Promise(resolve => {
    const s = http.createServer((req, res) => {
      let p = decodeURI(req.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      const f = path.join(DIST, p);
      fs.stat(f, (err, st) => {
        if (err || !st.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 Not Found</h1>');
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

async function test() {
  console.log(`=== Testing Production dist/ Build ===`);
  const server = await startDistServer();
  console.log(`Server started at http://127.0.0.1:${PORT}`);

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${CDP}`,
    `--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dist_${Date.now()}`,
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
    const consoleErrors = [];
    const failed404s = [];

    ws.addEventListener('message', (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) {
        const { resolve, reject } = pending.get(m.id);
        pending.delete(m.id);
        m.error ? reject(m.error) : resolve(m.result);
        return;
      }
      if (m.method === 'Runtime.exceptionThrown') {
        consoleErrors.push('EXC: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
      }
      if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
        consoleErrors.push('ERR: ' + m.params.args.map(a => a.value || a.description).join(' '));
      }
      if (m.method === 'Network.responseReceived') {
        const status = m.params.response.status;
        const url = m.params.response.url;
        if (status === 404) {
          failed404s.push(url);
        }
      }
    });

    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const i = id++;
      pending.set(i, { resolve, reject });
      ws.send(JSON.stringify({ id: i, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Log.enable');
    await send('Network.enable');

    // 1. Mobile Test (375x812, DPR=3)
    console.log(`\n1. Running Mobile Simulation (375px)...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 3,
      mobile: true
    });

    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await sleep(4000);

    // Scroll whole page to trigger all image loads
    await send('Runtime.evaluate', {
      expression: `(async () => {
        const totalH = document.body.scrollHeight;
        for (let y = 0; y < totalH; y += 1000) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      })()`,
      awaitPromise: true
    });
    await sleep(2000);

    // Evaluate checks
    const checks = await send('Runtime.evaluate', {
      expression: `(() => {
        // PDF link
        const pdfLink = document.querySelector('a[href*="compcard-dorcas-moira.pdf"]');
        const pdfOk = !!pdfLink;

        // Social links
        const ig = document.querySelector('a[href*="instagram.com"]');
        const tt = document.querySelector('a[href*="tiktok.com"]');
        const pin = document.querySelector('a[href*="pin.it"]') || document.querySelector('a[href*="pinterest.com"]');
        const wa = document.querySelector('a[href*="wa.me"]');

        // Canonical & SEO tags
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
        const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content');
        const ogImg = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
        const twImg = document.querySelector('meta[name="twitter:image"]')?.getAttribute('content');

        // Performance / Navigation timing
        const timing = performance.getEntriesByType('navigation')[0] || {};
        const domContentLoaded = timing.domContentLoadedEventEnd - timing.startTime;
        const loadEvent = timing.loadEventEnd - timing.startTime;

        return {
          pdfOk,
          pdfHref: pdfLink?.getAttribute('href'),
          socials: {
            instagram: !!ig,
            tiktok: !!tt,
            pinterest: !!pin,
            whatsapp: !!wa
          },
          seo: {
            canonical,
            ogUrl,
            ogImg,
            twImg
          },
          domContentLoaded: Math.round(domContentLoaded),
          loadEvent: Math.round(loadEvent)
        };
      })()`,
      returnByValue: true
    });

    console.log('\n--- Mobile Checks Result ---');
    console.log('Console errors count:', consoleErrors.length);
    if (consoleErrors.length > 0) console.log('Errors:', consoleErrors);

    console.log('Network 404 errors count:', failed404s.length);
    if (failed404s.length > 0) console.log('404 URLs:', failed404s);

    const data = checks.result.value;
    console.log('PDF Download link OK:', data.pdfOk, `(${data.pdfHref})`);
    console.log('Social Links:', data.socials);
    console.log('Technical SEO Tags:', data.seo);
    console.log(`DOM Content Loaded: ${data.domContentLoaded}ms, Load Event: ${data.loadEvent}ms`);

    // 2. Test 404 page
    console.log('\n2. Testing 404 page (/404.html)...');
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/404.html` });
    await sleep(1500);

    const check404 = await send('Runtime.evaluate', {
      expression: `(() => {
        const h1 = document.querySelector('h1')?.textContent;
        const h2 = document.querySelector('h2')?.textContent;
        const returnLink = document.querySelector('a[href="/"]')?.textContent;
        return { h1, h2, returnLink: !!returnLink };
      })()`,
      returnByValue: true
    });
    console.log('404 page content check:', check404.result.value);

    // Summary
    const success = (consoleErrors.length === 0 && failed404s.length === 0 && data.pdfOk && check404.result.value.h1 === '404');
    if (success) {
      console.log('\n[PASS] All dist/ checks passed flawlessly! ZERO errors, ZERO 404s.');
    } else {
      console.error('\n[FAIL] Some checks failed.');
      process.exit(1);
    }

  } finally {
    chrome.kill();
    server.close();
  }
}

test().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
