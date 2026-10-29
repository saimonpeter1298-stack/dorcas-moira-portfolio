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
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_5reloads_' + Date.now();
  const port = 9666;

  console.log('Launching headless Chrome on port', port);
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    'about:blank'
  ]);

  let connected = false;
  for (let i = 0; i < 30; i++) {
    await sleep(200);
    try {
      const version = await fetchJson(`http://127.0.0.1:${port}/json/version`);
      if (version && version.webSocketDebuggerUrl) {
        connected = true;
        break;
      }
    } catch (e) {}
  }

  if (!connected) {
    console.error('Could not connect to Chrome CDP.');
    chromeProc.kill();
    process.exit(1);
  }

  const list = await fetchJson(`http://127.0.0.1:${port}/json/list`);
  const page = list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();
  const consoleErrors = [];
  const networkErrors = [];
  let pageLoaded = false;

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
      const p = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) p.reject(msg.error);
      else p.resolve(msg.result);
    } else if (msg.method) {
      if (msg.method === 'Page.loadEventFired') {
        pageLoaded = true;
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        const type = msg.params.type;
        const text = msg.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
        if (type === 'error') {
          consoleErrors.push(`[Console Error] ${text}`);
        }
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const desc = msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text;
        consoleErrors.push(`[Uncaught Exception] ${desc}`);
      } else if (msg.method === 'Network.responseReceived') {
        const status = msg.params.response.status;
        const url = msg.params.response.url;
        if (status >= 400) {
          networkErrors.push(`[Network ${status}] ${url}`);
        }
      }
    }
  });

  await sendCmd('Runtime.enable');
  await sendCmd('Console.enable');
  await sendCmd('Network.enable');
  await sendCmd('Page.enable');

  console.log('\n======================================================');
  console.log('TESTING 5 CONSECUTIVE RELOADS OF DORCAS MOÏRA PORTFOLIO');
  console.log('======================================================\n');

  const results = [];

  for (let cycle = 1; cycle <= 5; cycle++) {
    consoleErrors.length = 0;
    networkErrors.length = 0;
    pageLoaded = false;

    console.log(`--- [Reload ${cycle}/5] ---`);

    if (cycle === 1) {
      await sendCmd('Page.navigate', { url: 'http://localhost:3000/' });
    } else {
      await sendCmd('Page.reload', { ignoreCache: true });
    }

    // Wait for Page.loadEventFired (up to 4s)
    for (let w = 0; w < 40; w++) {
      if (pageLoaded) break;
      await sleep(100);
    }

    // Wait up to 3.5s for loader completion & hero sequence
    let finalState = null;
    for (let check = 0; check < 25; check++) {
      await sleep(200);
      try {
        const res = await sendCmd('Runtime.evaluate', {
          expression: `(() => {
            const loader = document.getElementById('siteLoader');
            const hero = document.getElementById('hero');
            const counter = document.getElementById('loaderCounter');
            const title = document.title;
            const isDismissed = loader ? loader.classList.contains('is-loaded') : false;
            const galleryCount = window.galleryElements ? window.galleryElements.length : 0;
            const selectedWorks = document.getElementById('selected-works');
            return {
              title,
              counterText: counter ? counter.textContent : '',
              loaderDismissed: isDismissed,
              loaderClass: loader ? loader.className : '',
              heroDisplayed: hero ? (window.getComputedStyle(hero).display !== 'none') : false,
              selectedWorksDisplayed: selectedWorks ? (window.getComputedStyle(selectedWorks).display !== 'none') : false,
              galleryCount,
              ready: window.__PORTFOLIO_READY__ || false
            };
          })()`,
          returnByValue: true
        });

        if (res.result?.value) {
          finalState = res.result.value;
          if (finalState.loaderDismissed) break;
        }
      } catch (e) {}
    }

    const allErrors = [...consoleErrors, ...networkErrors];
    const passed = allErrors.length === 0 && finalState?.loaderDismissed && finalState?.heroDisplayed;

    results.push({ cycle, passed, finalState, errors: allErrors });

    console.log(`Reload #${cycle} Output:`);
    console.log(`  - Page Title: "${finalState?.title}"`);
    console.log(`  - Engine Initialized: ${finalState?.ready}`);
    console.log(`  - Loader Status: ${finalState?.loaderDismissed ? 'DISMISSED (is-loaded)' : 'BLOCKED'}`);
    console.log(`  - Counter Reached: ${finalState?.counterText}`);
    console.log(`  - Hero Displayed: ${finalState?.heroDisplayed}`);
    console.log(`  - Adaptive Gallery Photos: ${finalState?.galleryCount}`);
    console.log(`  - Console Errors: ${consoleErrors.length === 0 ? '0 (CLEAN)' : JSON.stringify(consoleErrors)}`);
    console.log(`  - Status: ${passed ? '✓ PASSED' : '✗ FAILED'}\n`);
  }

  ws.close();
  chromeProc.kill();

  console.log('======================================================');
  console.log('FINAL 5-RELOAD AUDIT RESULT');
  console.log('======================================================');
  const allSucceeded = results.every(r => r.passed);
  results.forEach(r => {
    console.log(`Reload #${r.cycle}: ${r.passed ? 'PASS - Zero console error, site rendered smoothly' : 'FAIL'}`);
  });
  console.log(`Summary: ${allSucceeded ? 'ALL 5 RELOADS PASSED PERFECTLY (100% SUCCESS)' : 'SOME RELOADS FAILED'}`);
  console.log('======================================================');

  if (!allSucceeded) process.exit(1);
}

main().catch(err => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
