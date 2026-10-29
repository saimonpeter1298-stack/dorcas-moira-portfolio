const { spawn } = require('child_process');
const http = require('http');

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

async function test() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_inspect_' + Date.now();
  const port = 9999;

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--disable-gpu',
    'http://localhost:3000/'
  ]);

  await sleep(2500);

  const list = await fetchJson(`http://127.0.0.1:${port}/json/list`);
  const page = list.find(t => t.type === 'page' && t.url.includes('localhost:3000'));

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r, { once: true }));

  let idCounter = 1;
  const pending = new Map();
  function sendCmd(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id).resolve(m.result);
      pending.delete(m.id);
    }
  });

  await sendCmd('Runtime.enable');
  await sendCmd('Emulation.setDeviceMetricsOverride', { width: 768, height: 1024, deviceScaleFactor: 2, mobile: false });
  await sleep(600);

  const res768 = await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const word = document.querySelector('.hero-word-moira');
      const subject = document.getElementById('heroCutoutImg');
      const w = word.getBoundingClientRect();
      const s = subject.getBoundingClientRect();
      return {
        wordRect: { top: w.top, bottom: w.bottom, height: w.height, left: w.left, right: w.right },
        subjectRect: { top: s.top, bottom: s.bottom, height: s.height, left: s.left, right: s.right },
        wTopLessThanSTop: w.top < s.top
      };
    })()`,
    returnByValue: true
  });
  console.log('768px measurements:', res768.result.value);

  await sendCmd('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  await sleep(600);

  const res1440 = await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const word = document.querySelector('.hero-word-moira');
      const subject = document.getElementById('heroCutoutImg');
      const w = word.getBoundingClientRect();
      const s = subject.getBoundingClientRect();
      return {
        wordRect: { top: w.top, bottom: w.bottom, height: w.height, left: w.left, right: w.right },
        subjectRect: { top: s.top, bottom: s.bottom, height: s.height, left: s.left, right: s.right },
        wTopLessThanSTop: w.top < s.top
      };
    })()`,
    returnByValue: true
  });
  console.log('1440px measurements:', res1440.result.value);

  await sendCmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 2, mobile: false });
  await sleep(600);

  const res1920 = await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const word = document.querySelector('.hero-word-moira');
      const subject = document.getElementById('heroCutoutImg');
      const w = word.getBoundingClientRect();
      const s = subject.getBoundingClientRect();
      return {
        wordRect: { top: w.top, bottom: w.bottom, height: w.height, left: w.left, right: w.right },
        subjectRect: { top: s.top, bottom: s.bottom, height: s.height, left: s.left, right: s.right },
        wTopLessThanSTop: w.top < s.top
      };
    })()`,
    returnByValue: true
  });
  console.log('1920px measurements:', res1920.result.value);

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

test().catch(err => { console.error(err); process.exit(1); });
