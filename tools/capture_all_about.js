const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

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
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_about_all_' + Date.now();
  const port = 9995;

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

  // Dismiss loader
  await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const loader = document.getElementById('siteLoader');
      if (loader) loader.remove();
      document.body.classList.remove('is-loading');
      if (typeof dismissLoader === 'function') dismissLoader();
    })()`
  });

  await sleep(500);

  // ==========================================
  // 1. DESKTOP 1440px : INDEX ÉDITORIAL
  // ==========================================
  console.log('--- CAPTURING DESKTOP 1440px INDEX ---');
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
  await sleep(500);

  const shotDeskIndex = await sendCmd('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false
  });
  fs.writeFileSync('assets/crops_verify/about_1440px_index.png', Buffer.from(shotDeskIndex.data, 'base64'));

  // ==========================================
  // 2. DESKTOP 1440px : HOVER WITH FLOATING IMAGE REVEAL
  // ==========================================
  console.log('--- CAPTURING DESKTOP 1440px HOVER REVEAL ---');
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
        // Place reveal nicely next to text
        const rect = firstRow.getBoundingClientRect();
        reveal.style.left = (rect.left + rect.width * 0.58) + 'px';
        reveal.style.top = (rect.top + rect.height * 0.45) + 'px';
      }
    })()`
  });
  await sleep(400);

  const shotDeskHover = await sendCmd('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false
  });
  fs.writeFileSync('assets/crops_verify/about_1440px_hover.png', Buffer.from(shotDeskHover.data, 'base64'));

  // Clean hover
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
  console.log('--- CAPTURING DESKTOP 1440px MODEL ADN ---');
  await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const dna = document.getElementById('modelDnaSection');
      if (dna) dna.scrollIntoView({ behavior: 'instant', block: 'center' });
      // Trigger scroll event & simulate fill
      window.dispatchEvent(new Event('scroll'));
      document.querySelectorAll('.dna-word').forEach(w => w.classList.add('is-filled'));
    })()`
  });
  await sleep(500);

  const shotDeskDna = await sendCmd('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false
  });
  fs.writeFileSync('assets/crops_verify/about_1440px_dna.png', Buffer.from(shotDeskDna.data, 'base64'));

  // ==========================================
  // 4. MOBILE 375px : INDEX ÉDITORIAL
  // ==========================================
  console.log('--- CAPTURING MOBILE 375px INDEX ---');
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
  await sleep(500);

  const shotMobIndex = await sendCmd('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false
  });
  fs.writeFileSync('assets/crops_verify/about_375px_index.png', Buffer.from(shotMobIndex.data, 'base64'));

  // ==========================================
  // 5. MOBILE 375px : OPEN ACCORDION
  // ==========================================
  console.log('--- CAPTURING MOBILE 375px ACCORDION ---');
  await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const firstRow = document.querySelector('.editorial-index-row');
      if (firstRow) {
        firstRow.classList.add('is-open');
        firstRow.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    })()`
  });
  await sleep(400);

  const shotMobAccordion = await sendCmd('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false
  });
  fs.writeFileSync('assets/crops_verify/about_375px_accordion.png', Buffer.from(shotMobAccordion.data, 'base64'));

  // ==========================================
  // 6. MOBILE 375px : MODEL ADN MANIFESTE
  // ==========================================
  console.log('--- CAPTURING MOBILE 375px MODEL ADN ---');
  await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const dna = document.getElementById('modelDnaSection');
      if (dna) {
        dna.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
      document.querySelectorAll('.dna-word').forEach(w => w.classList.add('is-filled'));
    })()`
  });
  await sleep(500);

  const shotMobDna = await sendCmd('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false
  });
  fs.writeFileSync('assets/crops_verify/about_375px_dna.png', Buffer.from(shotMobDna.data, 'base64'));

  ws.close();
  chromeProc.kill();
  console.log('All about viewports captured successfully!');
}

run().catch(console.error);
