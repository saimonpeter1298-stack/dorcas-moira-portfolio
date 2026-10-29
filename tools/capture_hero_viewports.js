const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

const VIEWPORTS = [
  { name: '320px_mobile_small', width: 320, height: 568 },
  { name: '375px_mobile_reference', width: 375, height: 812 },
  { name: '390px_mobile_standard', width: 390, height: 844 },
  { name: '430px_mobile_large', width: 430, height: 932 },
  { name: '768px_tablet', width: 768, height: 1024 },
  { name: '1440px_desktop', width: 1440, height: 900 },
  { name: '1920px_desktop_fhd', width: 1920, height: 1080 }
];

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_viewports_' + Date.now();
  const port = 9998;

  fs.mkdirSync('assets/crops_verify', { recursive: true });

  console.log('Spawning Chrome for multi-viewport hero verification...');
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    'http://localhost:3000/'
  ]);

  await sleep(2500);

  const list = await fetchJson(`http://127.0.0.1:${port}/json/list`);
  const pageTarget = list.find(t => t.type === 'page');
  if (!pageTarget) throw new Error('No page target found');

  const WebSocket = require('ws');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let msgId = 1;
  const pending = new Map();

  ws.on('message', (raw) => {
    const data = JSON.parse(raw);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  });

  await new Promise(r => ws.on('open', r));

  function sendCmd(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendCmd('Page.enable');
  await sendCmd('DOM.enable');
  await sendCmd('CSS.enable');

  // Dismiss loader immediately for inspection
  await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const loader = document.getElementById('siteLoader');
      if (loader) { loader.style.display = 'none'; loader.remove(); }
      document.body.classList.remove('is-loading');
      if (typeof dismissLoader === 'function') dismissLoader();
    })()`
  });

  await sleep(600);

  const auditReport = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n======================================================`);
    console.log(`TESTING VIEWPORT: ${vp.width}x${vp.height} (${vp.name})`);
    console.log(`======================================================`);

    await sendCmd('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.width < 1024
    });

    await sleep(400);

    // Measure layout geometries
    const evalRes = await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const hero = document.getElementById('hero');
        const isMobile = window.innerWidth < 768;
        
        // Active word line(s)
        const linePort = document.querySelector('.hero-word-mobile .line-port');
        const lineFolio = document.querySelector('.hero-word-mobile .line-folio');
        const lineSingle = document.querySelector('.hero-word-desktop .line-single');
        const creativeScript = document.querySelector('.hero-script-creative');
        
        const subject = document.getElementById('heroCutoutImg');
        const subjectWrap = document.getElementById('heroLayerSubject');
        const badge = document.getElementById('heroTopBadge');
        const header = document.getElementById('siteHeader');
        const brandMeta = document.querySelector('.brand-meta');
        const scrim = document.querySelector('.hero-bottom-scrim');
        const frame = document.getElementById('heroFrameInset');

        const vpW = window.innerWidth;
        const vpH = window.innerHeight;

        const sRect = subject ? subject.getBoundingClientRect() : { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
        const hStyle = window.getComputedStyle(header);

        let wordContained = true;
        let wordRects = [];
        let wordTopAboveHead = false;

        if (isMobile) {
          const pRect = linePort ? linePort.getBoundingClientRect() : { left: 0, right: 0, top: 0, width: 0 };
          const fRect = lineFolio ? lineFolio.getBoundingClientRect() : { left: 0, right: 0, top: 0, width: 0 };
          wordRects = [
            { text: 'PORT', left: Math.round(pRect.left), right: Math.round(pRect.right), width: Math.round(pRect.width) },
            { text: 'FOLIO', left: Math.round(fRect.left), right: Math.round(fRect.right), width: Math.round(fRect.width) }
          ];
          wordContained = (pRect.left >= 0 && pRect.right <= vpW + 2) && (fRect.left >= 0 && fRect.right <= vpW + 2);
          wordTopAboveHead = pRect.top < sRect.top;
        } else {
          const sngRect = lineSingle ? lineSingle.getBoundingClientRect() : { left: 0, right: 0, top: 0, width: 0 };
          wordRects = [
            { text: 'PORTFOLIO', left: Math.round(sngRect.left), right: Math.round(sngRect.right), width: Math.round(sngRect.width) }
          ];
          wordContained = (sngRect.left >= 0 && sngRect.right <= vpW + 2);
          wordTopAboveHead = sngRect.top < sRect.top;
        }

        const subjectHeightRatio = (sRect.height / vpH);
        const headerTransparent = hStyle.backgroundColor === 'rgba(0, 0, 0, 0)' || hStyle.backgroundColor === 'transparent';
        const badgeAbsent = badge === null;
        const brandMetaAbsent = brandMeta === null;
        const scrimAbsent = scrim === null;
        const framePresent = frame !== null;

        return {
          viewport: { width: vpW, height: vpH },
          word: {
            isMobile,
            rects: wordRects,
            contained: wordContained,
            wordTopAboveHead
          },
          subject: {
            src: subject ? subject.currentSrc || subject.src : '',
            heightRatio: (subjectHeightRatio * 100).toFixed(1) + '%',
            rect: { top: Math.round(sRect.top), height: Math.round(sRect.height), width: Math.round(sRect.width) }
          },
          cleanliness: {
            badgeAbsent,
            brandMetaAbsent,
            scrimAbsent,
            framePresent
          },
          header: {
            transparent: headerTransparent,
            bgColor: hStyle.backgroundColor
          }
        };
      })()`,
      returnByValue: true
    });

    const metrics = evalRes.result?.value;

    // Capture screenshot
    const shotRes = await sendCmd('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: vp.width, height: vp.height, scale: 1 }
    });

    const shotPath = `assets/crops_verify/hero_${vp.width}px.png`;
    fs.writeFileSync(shotPath, Buffer.from(shotRes.data, 'base64'));

    const pass = metrics?.word?.contained && 
                 metrics?.header?.transparent && 
                 metrics?.cleanliness?.badgeAbsent && 
                 metrics?.cleanliness?.brandMetaAbsent &&
                 metrics?.cleanliness?.scrimAbsent &&
                 metrics?.cleanliness?.framePresent;

    auditReport.push({
      vp: vp.width,
      pass,
      metrics,
      screenshot: shotPath
    });

    console.log(`Checks for ${vp.width}px:`);
    console.log(`  ✓ Mot PORTFOLIO contenu (sans débordement) : ${metrics?.word?.contained}`, metrics?.word?.rects);
    console.log(`  ✓ Silhouette hauteur relative : ${metrics?.subject?.heightRatio}`);
    console.log(`  ✓ Silhouette image src : ${metrics?.subject?.src}`);
    console.log(`  ✓ Haut de PORTFOLIO au-dessus de l'afro : ${metrics?.word?.wordTopAboveHead}`);
    console.log(`  ✓ Badge Miss Gabon absent du hero : ${metrics?.cleanliness?.badgeAbsent}`);
    console.log(`  ✓ Meta Dorcas Moïra absente du header : ${metrics?.cleanliness?.brandMetaAbsent}`);
    console.log(`  ✓ Scrim sombre rectangle absent : ${metrics?.cleanliness?.scrimAbsent}`);
    console.log(`  ✓ Cadre intérieur Book Cover présent : ${metrics?.cleanliness?.framePresent}`);
    console.log(`  ✓ Header transparent sur hero : ${metrics?.header?.transparent} (${metrics?.header?.bgColor})`);
    console.log(`  ✓ Screenshot enregistré : ${shotPath}`);
    console.log(`  -> Statut : ${pass ? 'PASSED' : 'CHECK NEEDED'}`);
  }

  ws.close();
  chromeProc.kill();

  console.log('\n======================================================');
  console.log('RÉSUMÉ COMPLET DES 7 FORMATS D\'ÉCRAN');
  console.log('======================================================');
  auditReport.forEach(r => {
    console.log(`${r.vp}px : ${r.pass ? '✓ CONFORME (Tous les critères validés)' : '✗ ÉCHEC'}`);
  });
  console.log('======================================================');

  const allPassed = auditReport.every(r => r.pass);
  process.exit(allPassed ? 0 : 1);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
