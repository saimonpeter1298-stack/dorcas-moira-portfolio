const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'crops_verify', 'editorial');
const PORT = 3855;
const CDP = 9965;
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
  { name: '320', width: 320, height: 700, dpr: 2, mobile: true },
  { name: '375', width: 375, height: 812, dpr: 3, mobile: true },
  { name: '1440', width: 1440, height: 900, dpr: 2, mobile: false }
];

async function run() {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await startServer();
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', `--remote-debugging-port=${CDP}`,
    `--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_editorial_${Date.now()}`,
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
      if (m.id && pending.has(m.id)) { const { resolve, reject } = pending.get(m.id); pending.delete(m.id); m.error ? reject(m.error) : resolve(m.result); return; }
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

      // Scroll to editorialDoubleSpread
      await send('Runtime.evaluate', {
        expression: `document.getElementById('editorialDoubleSpread').scrollIntoView({ behavior: 'instant', block: 'start' });`
      });
      await sleep(500);

      const metrics = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const rows = Array.from(document.querySelectorAll('.editorial-index-row'));
          const rowData = rows.map((r, i) => {
            const title = r.querySelector('.row-title');
            const main = r.querySelector('.title-main');
            const accent = r.querySelector('.title-accent');
            const num = r.querySelector('.row-num');
            const arrow = r.querySelector('.row-arrow');
            const titleCS = window.getComputedStyle(title);
            const numCS = window.getComputedStyle(num);
            const arrowCS = window.getComputedStyle(arrow);
            const mainCS = window.getComputedStyle(main);
            const accentCS = window.getComputedStyle(accent);
            
            // Check if title fits on 1 line: compare height with 1-line expectation or clientHeight vs scrollHeight
            const rect = title.getBoundingClientRect();
            const mainRect = main.getBoundingClientRect();
            const accentRect = accent.getBoundingClientRect();
            // Single line test: top of main should equal top of accent within 3px
            const isSingleLine = Math.abs(mainRect.top - accentRect.top) < 4;
            
            return {
              index: i + 1,
              titleText: (main.textContent + ' ' + accent.textContent).trim(),
              fontSize: titleCS.fontSize,
              lineHeight: titleCS.lineHeight,
              letterSpacing: titleCS.letterSpacing,
              numFontSize: numCS.fontSize,
              arrowFontSize: arrowCS.fontSize,
              arrowColor: arrowCS.color,
              arrowTransform: arrowCS.transform,
              titleWidth: rect.width,
              titleHeight: rect.height,
              isSingleLine,
              mainTop: mainRect.top,
              accentTop: accentRect.top
            };
          });

          // Section Header info
          const kicker = document.querySelector('.editorial-index-block .editorial-kicker');
          const title = document.querySelector('.editorial-index-block .editorial-block-title');
          const kickerCS = window.getComputedStyle(kicker);
          const titleCS = window.getComputedStyle(title);

          // Model ADN info
          const dnaQuote = document.querySelector('.dna-manifesto-quote');
          const dnaCS = dnaQuote ? window.getComputedStyle(dnaQuote) : null;
          const dnaRect = dnaQuote ? dnaQuote.getBoundingClientRect() : null;
          const docWidth = document.documentElement.clientWidth;
          const dnaOverflow = dnaRect ? (dnaRect.right > docWidth) : false;

          // Sticky & Footer overlap check
          window.scrollTo(0, document.body.scrollHeight);
          const sticky = document.querySelector('.mobile-sticky-cta');
          const stickyCS = sticky ? window.getComputedStyle(sticky) : null;
          const stickyRect = sticky ? sticky.getBoundingClientRect() : null;
          const footerCredits = document.querySelector('.footer-credits');
          const footerRect = footerCredits ? footerCredits.getBoundingClientRect() : null;
          const isStickyHidden = sticky ? sticky.classList.contains('is-hidden') : true;

          return {
            rowData,
            kicker: {
              text: kicker.textContent,
              fontSize: kickerCS.fontSize,
              letterSpacing: kickerCS.letterSpacing,
              color: kickerCS.color,
              textTransform: kickerCS.textTransform
            },
            title: {
              text: title.textContent,
              fontFamily: titleCS.fontFamily,
              fontSize: titleCS.fontSize,
              color: titleCS.color
            },
            dna: {
              fontSize: dnaCS ? dnaCS.fontSize : null,
              lineHeight: dnaCS ? dnaCS.lineHeight : null,
              dnaOverflow
            },
            footerCreditsBottom: footerRect ? footerRect.bottom : null,
            windowHeight: window.innerHeight,
            stickyRect: stickyRect ? { top: stickyRect.top, height: stickyRect.height } : null
          };
        })()`
      });

      // Capture screenshot of editorial section
      await send('Runtime.evaluate', {
        expression: `document.getElementById('editorialDoubleSpread').scrollIntoView({ behavior: 'instant', block: 'start' });`
      });
      await sleep(300);
      const shotSection = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(OUT, `editorial_${vp.name}.png`), Buffer.from(shotSection.data, 'base64'));

      // Test tap on mobile on Row 03:
      if (vp.mobile) {
        await send('Runtime.evaluate', {
          expression: `(() => {
            const row3Header = document.querySelectorAll('.editorial-index-row')[2].querySelector('.editorial-row-header');
            row3Header.click();
          })()`
        });
        await sleep(400);

        const tapState = await send('Runtime.evaluate', {
          returnByValue: true,
          expression: `(() => {
            const r3 = document.querySelectorAll('.editorial-index-row')[2];
            const arrow = r3.querySelector('.row-arrow');
            const cs = window.getComputedStyle(arrow);
            const isOpen = r3.classList.contains('is-open');
            return { isOpen, transform: cs.transform, color: cs.color };
          })()`
        });

        // Close it again
        await send('Runtime.evaluate', {
          expression: `(() => {
            const row3Header = document.querySelectorAll('.editorial-index-row')[2].querySelector('.editorial-row-header');
            row3Header.click();
          })()`
        });
        await sleep(400);

        const closedState = await send('Runtime.evaluate', {
          returnByValue: true,
          expression: `(() => {
            const r3 = document.querySelectorAll('.editorial-index-row')[2];
            const arrow = r3.querySelector('.row-arrow');
            const cs = window.getComputedStyle(arrow);
            const isOpen = r3.classList.contains('is-open');
            return { isOpen, transform: cs.transform, color: cs.color };
          })()`
        });

        metrics.result.value.tapTestRow03 = { tapState, closedState };
      }

      // Capture bottom of page
      await send('Runtime.evaluate', {
        expression: `window.scrollTo(0, document.body.scrollHeight);`
      });
      await sleep(300);
      const shotBottom = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(OUT, `bottom_${vp.name}.png`), Buffer.from(shotBottom.data, 'base64'));

      results[vp.name] = { metrics: metrics.result.value, errors };
    }

    fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 2));
    console.log("=== RESULTS ===");
    console.log(JSON.stringify(results, null, 2));
  } finally {
    try { chrome.kill(); } catch (e) {}
    try { server.close(); } catch (e) {}
  }
}

run().catch(console.error);
