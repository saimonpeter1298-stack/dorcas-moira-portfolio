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

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_furl_' + Date.now();
  const cdpPort = 9995;

  const htmlPath = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  console.log('Opening:', htmlPath);

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--allow-file-access-from-files',
    '--disable-web-security',
    htmlPath
  ]);

  try {
    await sleep(2500);

    const list = await fetchJson(`http://127.0.0.1:${cdpPort}/json/list`);
    const pageTarget = list.find(t => t.type === 'page');
    console.log('Target found:', pageTarget.url);

    const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);

    let msgId = 1;
    const pending = new Map();
    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pending.has(data.id)) {
        const { resolve, reject } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    });

    await new Promise(r => ws.addEventListener('open', r, { once: true }));

    function sendCmd(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await sendCmd('Page.enable');
    await sendCmd('DOM.enable');

    await sleep(1500);

    // Dismiss loader & check computed styles
    const checkStyles = await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const loader = document.getElementById('siteLoader');
        if (loader) loader.remove();
        document.body.classList.remove('is-loading');

        const bodyBg = window.getComputedStyle(document.body).backgroundColor;
        const row = document.querySelector('.editorial-row-header');
        const titleColor = row ? window.getComputedStyle(row.querySelector('.row-title')).color : 'none';
        return { bodyBg, titleColor };
      })()`,
      returnByValue: true
    });
    console.log('Styles check:', checkStyles.result.value);

    // ==========================================
    // 1. DESKTOP 1440px : INDEX ÉDITORIAL
    // ==========================================
    console.log('Capturing Desktop 1440px Index...');
    await sendCmd('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false
    });

    await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const idx = document.getElementById('editorialIndexBlock');
        if (idx) idx.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.dispatchEvent(new Event('scroll'));
      })()`
    });
    await sleep(600);

    const shotDeskIndex = await sendCmd('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });
    fs.writeFileSync('assets/crops_verify/about_1440px_index.png', Buffer.from(shotDeskIndex.data, 'base64'));

    // ==========================================
    // 2. DESKTOP 1440px : HOVER WITH FLOATING IMAGE REVEAL
    // ==========================================
    console.log('Capturing Desktop 1440px Hover Reveal...');
    await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const firstRow = document.querySelector('.editorial-index-row');
        const reveal = document.getElementById('editorialCursorReveal');
        const img = document.getElementById('cursorRevealImg');
        const list = document.getElementById('editorialIndexList');

        if (firstRow && reveal && img && list) {
          list.classList.add('is-hovering');
          firstRow.classList.add('is-active-hover');
          img.src = firstRow.getAttribute('data-img');
          reveal.classList.add('is-active');
          const rect = firstRow.getBoundingClientRect();
          reveal.style.left = (rect.left + rect.width * 0.58) + 'px';
          reveal.style.top = (rect.top + rect.height * 0.45) + 'px';
        }
      })()`
    });
    await sleep(500);

    const shotDeskHover = await sendCmd('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });
    fs.writeFileSync('assets/crops_verify/about_1440px_hover.png', Buffer.from(shotDeskHover.data, 'base64'));

    // Reset hover
    await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const reveal = document.getElementById('editorialCursorReveal');
        const list = document.getElementById('editorialIndexList');
        if (reveal) reveal.classList.remove('is-active');
        if (list) list.classList.remove('is-hovering');
        document.querySelectorAll('.editorial-index-row').forEach(r => r.classList.remove('is-active-hover'));
      })()`
    });

    // ==========================================
    // 3. DESKTOP 1440px : MODEL ADN MANIFESTE TYPOGRAPHIQUE
    // ==========================================
    console.log('Capturing Desktop 1440px Model ADN...');
    await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const dna = document.getElementById('modelDnaSection');
        if (dna) dna.scrollIntoView({ behavior: 'instant', block: 'center' });
        window.dispatchEvent(new Event('scroll'));
        document.querySelectorAll('.dna-word').forEach(w => w.classList.add('is-filled'));
      })()`
    });
    await sleep(600);

    const shotDeskDna = await sendCmd('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });
    fs.writeFileSync('assets/crops_verify/about_1440px_dna.png', Buffer.from(shotDeskDna.data, 'base64'));

    // ==========================================
    // 4. MOBILE 375px : INDEX ÉDITORIAL
    // ==========================================
    console.log('Capturing Mobile 375px Index...');
    await sendCmd('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });

    await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const idx = document.getElementById('editorialIndexBlock');
        if (idx) idx.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.dispatchEvent(new Event('scroll'));
      })()`
    });
    await sleep(600);

    const shotMobIndex = await sendCmd('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });
    fs.writeFileSync('assets/crops_verify/about_375px_index.png', Buffer.from(shotMobIndex.data, 'base64'));

    // ==========================================
    // 5. MOBILE 375px : ACCORDION OPEN
    // ==========================================
    console.log('Capturing Mobile 375px Accordion Open...');
    await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const firstRow = document.querySelector('.editorial-index-row');
        if (firstRow) {
          firstRow.classList.add('is-open');
          firstRow.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      })()`
    });
    await sleep(600);

    const shotMobAccordion = await sendCmd('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });
    fs.writeFileSync('assets/crops_verify/about_375px_accordion.png', Buffer.from(shotMobAccordion.data, 'base64'));

    // Reset accordion
    await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        document.querySelectorAll('.editorial-index-row').forEach(r => r.classList.remove('is-open'));
      })()`
    });

    // ==========================================
    // 6. MOBILE 375px : MODEL ADN MANIFESTE
    // ==========================================
    console.log('Capturing Mobile 375px Model ADN...');
    await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const dna = document.getElementById('modelDnaSection');
        if (dna) dna.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.dispatchEvent(new Event('scroll'));
        document.querySelectorAll('.dna-word').forEach(w => w.classList.add('is-filled'));
      })()`
    });
    await sleep(600);

    const shotMobDna = await sendCmd('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });
    fs.writeFileSync('assets/crops_verify/about_375px_dna.png', Buffer.from(shotMobDna.data, 'base64'));

    console.log('Done!');
  } finally {
    try { chromeProc.kill(); } catch (e) {}
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
