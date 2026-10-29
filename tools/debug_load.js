const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_debug_' + Date.now();
  const port = 9333;

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    'about:blank'
  ]);

  for (let i = 0; i < 30; i++) {
    await sleep(200);
    try {
      const v = await fetchJson(`http://127.0.0.1:${port}/json/version`);
      if (v) break;
    } catch(e) {}
  }

  const list = await fetchJson(`http://127.0.0.1:${port}/json/list`);
  const page = list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();
  function sendCmd(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise(r => ws.addEventListener('open', r, { once: true }));

  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id).resolve(msg.result);
      pending.delete(msg.id);
    } else if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', msg.params.type, msg.params.args.map(a => a.value || JSON.stringify(a)).join(' '));
    } else if (msg.method === 'Runtime.exceptionThrown') {
      console.error('EXCEPTION:', msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text);
    }
  });

  await sendCmd('Runtime.enable');
  await sendCmd('Console.enable');
  await sendCmd('Page.enable');

  console.log('Navigating to http://localhost:3000 ...');
  await sendCmd('Page.navigate', { url: 'http://localhost:3000' });

  for (let i = 0; i < 15; i++) {
    await sleep(300);
    const res = await sendCmd('Runtime.evaluate', {
      expression: `({
        readyState: document.readyState,
        counter: document.getElementById('loaderCounter')?.textContent,
        loaderClass: document.getElementById('siteLoader')?.className,
        hasGSAP: typeof gsap !== 'undefined',
        hasData: typeof PORTFOLIO_DATA !== 'undefined',
        ready: window.__PORTFOLIO_READY__ || false
      })`,
      returnByValue: true
    });
    console.log(`Step ${i}:`, res.result?.value);
    if (res.result?.value?.loaderClass?.includes('is-loaded')) break;
  }

  ws.close();
  chromeProc.kill();
}

run().catch(console.error);
