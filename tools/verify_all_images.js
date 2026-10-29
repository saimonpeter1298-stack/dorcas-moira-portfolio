const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const OUT_DIR = path.join(ROOT, 'assets', 'crops_verify', 'sections_375');
fs.mkdirSync(OUT_DIR, { recursive: true });

const PORT = 3889;
const CDP_PORT = 9979;
const TARGET_URL = process.argv[2] || `http://127.0.0.1:${PORT}/`;

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
      const f = path.join(DIST, p);
      fs.stat(f, (err, st) => {
        if (err || !st.isFile()) {
          res.writeHead(404);
          res.end('404');
          return;
        }
        const ext = path.extname(f).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
        fs.createReadStream(f).pipe(res);
      });
    });
    s.listen(PORT, '127.0.0.1', () => resolve(s));
  });
}

async function run() {
  console.log(`=== MANDATORY PRODUCTION VERIFICATION [${TARGET_URL}] ===`);
  let server = null;
  if (TARGET_URL.includes('127.0.0.1')) {
    server = await startServer();
  }

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_verif_${Date.now()}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    '--no-sandbox',
    '--disable-gpu',
    'about:blank'
  ]);

  try {
    await sleep(2000);
    const list = await fetchJson(`http://127.0.0.1:${CDP_PORT}/json/list`);
    const target = list.find(t => t.type === 'page') || list[0];
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
      }
    });

    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const i = id++;
      pending.set(i, { resolve, reject });
      ws.send(JSON.stringify({ id: i, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');

    async function auditViewport(width, height, isMobile) {
      console.log(`\nAuditing at ${width}px (${isMobile ? 'Mobile' : 'Desktop'})...`);
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 2,
        mobile: isMobile
      });

      await send('Page.navigate', { url: TARGET_URL });
      await sleep(2500);

      // Pre-scroll the whole page once + every horizontal carousel
      await send('Runtime.evaluate', {
        expression: `
          (async () => {
            const h = document.body.scrollHeight;
            for (let y = 0; y < h; y += 300) {
              window.scrollTo(0, y);
              await new Promise(r => setTimeout(r, 40));
            }
            window.scrollTo(0, h);
            await new Promise(r => setTimeout(r, 200));

            const scrollers = document.querySelectorAll('.chapter-carousel-scroll, .selected-works-grid');
            for (const s of scrollers) {
              s.scrollLeft = s.scrollWidth;
              await new Promise(r => setTimeout(r, 100));
              s.scrollLeft = 0;
            }

            window.scrollTo(0, 0);
            await new Promise(r => setTimeout(r, 200));
          })()
        `,
        awaitPromise: true
      });

      // Capture screenshots of each photo section on mobile
      if (width === 375 && TARGET_URL.includes('127.0.0.1')) {
        const sectionsToCapture = [
          { id: 'hero', name: '375_01_hero.png' },
          { id: 'about', name: '375_02_about.png' },
          { id: 'comp-card', name: '375_03_compcard.png' },
          { id: 'digitals', name: '375_04_digitals.png' },
          { id: 'selected-works', name: '375_05_selected_works.png' },
          { id: 'chap-02', name: '375_06_chap_02_many_moods.png' },
          { id: 'chap-03', name: '375_07_chap_03_afro_chic.png' },
          { id: 'chap-04', name: '375_08_chap_04_studio.png' },
          { id: 'chap-05', name: '375_09_chap_05_sun_kissed.png' },
          { id: 'chap-06', name: '375_10_chap_06_visual.png' },
          { id: 'motion', name: '375_11_motion_video.png' },
          { id: 'why-me', name: '375_12_why_me.png' },
          { id: 'journey', name: '375_13_journey_timeline.png' },
          { id: 'contact', name: '375_14_contact.png' }
        ];

        for (const sec of sectionsToCapture) {
          await send('Runtime.evaluate', {
            expression: `document.getElementById('${sec.id}')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
          });
          await sleep(350);
          const cap = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync(path.join(OUT_DIR, sec.name), Buffer.from(cap.data, 'base64'));
          console.log(`[Screenshot Saved] ${sec.name}`);
        }
      }

      // Collect image metrics and empty cards
      const evalResult = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const imgs = Array.from(document.querySelectorAll('img'));
            const imgData = imgs.map(img => {
              const card = img.closest('.carousel-card, .selected-works-card, .polaroid-card, .timeline-vignette-wrap, .why-portrait-wrap, .about-portrait-wrap, .hero-layer-subject');
              const sec = img.closest('section') || img.closest('.digitals-showcase');
              const style = window.getComputedStyle(img);
              const isVisible = style.display !== 'none' && style.visibility !== 'hidden';
              const parentVisible = card ? window.getComputedStyle(card).display !== 'none' : true;
              return {
                section: sec ? sec.id : 'global',
                src: img.getAttribute('src') || '',
                currentSrc: img.currentSrc ? img.currentSrc.split('/').pop() : '',
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                visible: isVisible && parentVisible
              };
            }).filter(i => i.visible && i.src && !i.src.startsWith('data:'));

            // Check for empty cards in galleries
            const cards = Array.from(document.querySelectorAll('.carousel-card, .selected-works-card, .polaroid-card, .timeline-vignette-wrap'));
            const emptyCards = cards.filter(c => {
              const img = c.querySelector('img');
              return !img || img.naturalWidth === 0;
            }).map(c => ({
              className: c.className,
              parentSection: c.closest('section')?.id || 'unknown'
            }));

            return {
              images: imgData,
              emptyCards: emptyCards
            };
          })()
        `,
        returnByValue: true
      });

      const { images, emptyCards } = evalResult.result.value;
      const brokenImages = images.filter(i => i.naturalWidth === 0);
      const placeholderImages = images.filter(i => i.src.toLowerCase().includes('placeholder') || i.currentSrc.toLowerCase().includes('placeholder'));

      console.log(`\n--- Images detected (${images.length}) at ${width}px ---`);
      images.forEach(img => {
        console.log(`  [${img.section}] ${img.currentSrc || path.basename(img.src)} -> ${img.naturalWidth}x${img.naturalHeight}px`);
      });

      return {
        total: images.length,
        broken: brokenImages.length,
        brokenList: brokenImages,
        emptyCardsCount: emptyCards.length,
        emptyCardsList: emptyCards,
        placeholdersCount: placeholderImages.length,
        placeholdersList: placeholderImages
      };
    }

    const res375 = await auditViewport(375, 812, true);
    const res1440 = await auditViewport(1440, 900, false);

    console.log('\n================ AUDIT SUMMARY ================');
    console.log(`Mobile (375px)  : ${res375.total} images visible | Broken (naturalWidth==0): ${res375.broken} | Empty Cards: ${res375.emptyCardsCount} | Placeholders: ${res375.placeholdersCount}`);
    console.log(`Desktop (1440px): ${res1440.total} images visible | Broken (naturalWidth==0): ${res1440.broken} | Empty Cards: ${res1440.emptyCardsCount} | Placeholders: ${res1440.placeholdersCount}`);

    const hasErrors = res375.broken > 0 || res375.emptyCardsCount > 0 || res375.placeholdersCount > 0 ||
                      res1440.broken > 0 || res1440.emptyCardsCount > 0 || res1440.placeholdersCount > 0;

    if (!hasErrors) {
      console.log('\n>>> [VERIFICATION PASSED] ZERO broken images, ZERO empty cards, ZERO placeholders! <<<');
    } else {
      console.error('\n>>> [VERIFICATION FAILED] Errors found:', {
        mobile: { broken: res375.brokenList, emptyCards: res375.emptyCardsList, placeholders: res375.placeholdersList },
        desktop: { broken: res1440.brokenList, emptyCards: res1440.emptyCardsList, placeholders: res1440.placeholdersList }
      });
      process.exit(1);
    }

    ws.close();
  } finally {
    chrome.kill();
    if (server) server.close();
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
