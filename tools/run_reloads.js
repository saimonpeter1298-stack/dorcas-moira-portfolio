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

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_run_' + Date.now();
  const port = 9555;

  console.log('Spawning Chrome on port', port);
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
  const ws = new WebSocket(list[0].webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();
  const consoleErrors = [];

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
    } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      const txt = msg.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
      consoleErrors.push(txt);
    } else if (msg.method === 'Runtime.exceptionThrown') {
      const desc = msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text;
      consoleErrors.push(desc);
    }
  });

  await sendCmd('Runtime.enable');
  await sendCmd('Console.enable');
  await sendCmd('Page.enable');

  console.log('Testing 5 reloads...');
  const results = [];

  for (let i = 1; i <= 5; i++) {
    consoleErrors.length = 0;
    console.log(`\nCycle ${i}: Navigating...`);
    await sendCmd('Page.navigate', { url: `http://localhost:3000/?t=${Date.now()}` });

    // Wait 3.5 seconds for complete load, counter, and fade-out
    await sleep(3500);

    const evalRes = await sendCmd('Runtime.evaluate', {
      expression: `({
        title: document.title,
        loaderClass: document.getElementById('siteLoader')?.className,
        counter: document.getElementById('loaderCounter')?.textContent,
        heroHeight: document.getElementById('hero')?.offsetHeight,
        selectedWorksCount: document.querySelectorAll('.selected-works-card')?.length,
        galleryCount: window.galleryElements ? window.galleryElements.length : 0,
        ready: window.__PORTFOLIO_READY__ || false
      })`,
      returnByValue: true
    });

    const state = evalRes.result?.value;
    const errors = [...consoleErrors];
    const ok = (state?.loaderClass?.includes('is-loaded')) && errors.length === 0;

    results.push({ cycle: i, ok, state, errors });
    console.log(`Cycle ${i} Result:`, { ok, errors, state });
  }

  ws.close();
  chromeProc.kill();

  console.log('\n========================================');
  const allOk = results.every(r => r.ok);
  console.log('ALL 5 RELOADS PASSED:', allOk);
  console.log('========================================');
  process.exit(allOk ? 0 : 1);
}

main().catch(console.error);
