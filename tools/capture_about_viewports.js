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
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_about_' + Date.now();
  const port = 9997;

  console.log('Spawning Chrome for About section verification...');
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

  // Dismiss loader
  await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const loader = document.getElementById('siteLoader');
      if (loader) loader.remove();
      document.body.classList.remove('is-loading');
    })()`
  });

  await sleep(500);

  // ==========================================
  // 1. DESKTOP 1440px
  // ==========================================
  console.log('\n--- TESTING DESKTOP 1440px ---');
  await sendCmd('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });

  // Scroll to double page in About
  await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.getElementById('editorialDoubleSpread');
      if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      // Trigger scroll event for ScrollTrigger
      window.dispatchEvent(new Event('scroll'));
    })()`
  });

  await sleep(600);

  const desktopEval = await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.getElementById('editorialDoubleSpread');
      const rows = document.querySelectorAll('.editorial-index-row');
      const words = document.querySelectorAll('.dna-word');
      const inlineImgs = document.querySelectorAll('.dna-inline-badge');
      const stars = document.querySelectorAll('.dna-star');
      const oldCards = document.querySelectorAll('.dna-card, .direction-tag, .directions-pills');
      
      const sRect = sec ? sec.getBoundingClientRect() : { top: 0, height: 0 };
      return {
        rowsCount: rows.length,
        wordsCount: words.length,
        inlineImgsCount: inlineImgs.length,
        starsCount: stars.length,
        oldCardsCount: oldCards.length,
        secTop: sRect.top,
        secHeight: sRect.height
      };
    })()`,
    returnByValue: true
  });

  console.log('Desktop 1440px Checks:', desktopEval.result?.value);

  // Capture desktop screenshot
  const shot1440 = await sendCmd('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 1440, height: 900, scale: 1 }
  });
  fs.writeFileSync('assets/crops_verify/about_1440px.png', Buffer.from(shot1440.data, 'base64'));
  console.log('Saved assets/crops_verify/about_1440px.png');

  // ==========================================
  // 2. MOBILE 375px
  // ==========================================
  console.log('\n--- TESTING MOBILE 375px ---');
  await sendCmd('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });

  // Scroll to editorial index
  await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const idx = document.getElementById('editorialIndexBlock');
      if (idx) idx.scrollIntoView({ behavior: 'instant', block: 'start' });
      window.dispatchEvent(new Event('scroll'));
    })()`
  });

  await sleep(500);

  const shot375 = await sendCmd('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 375, height: 812, scale: 1 }
  });
  fs.writeFileSync('assets/crops_verify/about_375px_index.png', Buffer.from(shot375.data, 'base64'));
  console.log('Saved assets/crops_verify/about_375px_index.png');

  // Open first accordion row
  await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const firstRow = document.querySelector('.editorial-index-row');
      if (firstRow) {
        const header = firstRow.querySelector('.editorial-row-header');
        if (header) header.click();
      }
    })()`
  });

  await sleep(400);

  const shot375Accordion = await sendCmd('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 375, height: 812, scale: 1 }
  });
  fs.writeFileSync('assets/crops_verify/about_375px_accordion.png', Buffer.from(shot375Accordion.data, 'base64'));
  console.log('Saved assets/crops_verify/about_375px_accordion.png');

  // Scroll to Model ADN on mobile
  await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const dna = document.getElementById('modelDnaSection');
      if (dna) dna.scrollIntoView({ behavior: 'instant', block: 'center' });
      window.dispatchEvent(new Event('scroll'));
    })()`
  });

  await sleep(400);

  const shot375Dna = await sendCmd('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 375, height: 812, scale: 1 }
  });
  fs.writeFileSync('assets/crops_verify/about_375px_dna.png', Buffer.from(shot375Dna.data, 'base64'));
  console.log('Saved assets/crops_verify/about_375px_dna.png');

  ws.close();
  chromeProc.kill();
  console.log('\nVerification complete!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
