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
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_test_' + Date.now();
  const port = 9996;

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

  // Set 1440px desktop
  await sendCmd('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });

  // Scroll to #editorialDoubleSpread
  const scrollInfo = await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.getElementById('editorialDoubleSpread');
      if (sec) {
        sec.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
      return {
        scrollY: window.scrollY,
        innerHeight: window.innerHeight,
        secRect: sec ? sec.getBoundingClientRect() : null
      };
    })()`,
    returnByValue: true
  });

  console.log('Scroll Info:', scrollInfo.result?.value);
  await sleep(600);

  // Capture viewport WITHOUT clip
  const shotViewport = await sendCmd('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false
  });
  fs.writeFileSync('assets/crops_verify/test_viewport_1440px.png', Buffer.from(shotViewport.data, 'base64'));

  // Also capture element clip using page coordinates
  const clipInfo = await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.getElementById('editorialDoubleSpread');
      const r = sec.getBoundingClientRect();
      return {
        x: Math.round(r.left),
        y: Math.round(r.top + window.scrollY),
        width: Math.min(1440, Math.round(r.width)),
        height: Math.min(1800, Math.round(r.height))
      };
    })()`,
    returnByValue: true
  });
  console.log('Clip Info:', clipInfo.result?.value);

  const clip = clipInfo.result?.value;
  const shotClip = await sendCmd('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: clip.x,
      y: clip.y,
      width: clip.width,
      height: 900,
      scale: 1
    },
    captureBeyondViewport: true
  });
  fs.writeFileSync('assets/crops_verify/test_clip_1440px.png', Buffer.from(shotClip.data, 'base64'));

  ws.close();
  chromeProc.kill();
  console.log('Done testing');
}

run().catch(console.error);
