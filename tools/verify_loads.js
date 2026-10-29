const { spawn } = require('child_process');
const http = require('http');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_test_profile_' + Date.now();
  const port = 9222;

  console.log('Launching headless Chrome...');
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    'about:blank'
  ]);

  chromeProc.on('error', (err) => {
    console.error('Failed to spawn Chrome:', err);
    process.exit(1);
  });

  // Wait for CDP endpoint
  let connected = false;
  for (let i = 0; i < 30; i++) {
    await sleep(200);
    try {
      const version = await fetchJson(`http://127.0.0.1:${port}/json/version`);
      if (version && version.webSocketDebuggerUrl) {
        connected = true;
        console.log('Chrome CDP available:', version.Browser);
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
  const page = list.find(t => t.type === 'page') || list[0];
  console.log('Target tab ws:', page.webSocketDebuggerUrl);

  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();
  const consoleErrors = [];
  const consoleLogs = [];
  const networkErrors = [];
  let pageLoadResolver = null;

  function sendCmd(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));
  console.log('Connected to target page WebSocket.');

  ws.addEventListener('message', (event) => {
    const raw = typeof event.data === 'string' ? event.data : event.data.toString();
    const msg = JSON.parse(raw);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    } else if (msg.method) {
      if (msg.method === 'Page.loadEventFired') {
        if (pageLoadResolver) {
          pageLoadResolver();
          pageLoadResolver = null;
        }
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        const type = msg.params.type;
        const text = msg.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
        if (type === 'error') {
          consoleErrors.push(text);
        } else {
          consoleLogs.push(`[${type}] ${text}`);
        }
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const desc = msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text;
        consoleErrors.push(`[EXCEPTION] ${desc}`);
      } else if (msg.method === 'Network.responseReceived') {
        const status = msg.params.response.status;
        const url = msg.params.response.url;
        if (status >= 400) {
          networkErrors.push(`${status} ${url}`);
        }
      }
    }
  });

  await sendCmd('Runtime.enable');
  await sendCmd('Console.enable');
  await sendCmd('Network.enable');
  await sendCmd('Page.enable');

  console.log('\n--- STARTING 5 CONSECUTIVE RELOADS OF http://localhost:3000 ---');

  const results = [];

  for (let cycle = 1; cycle <= 5; cycle++) {
    consoleErrors.length = 0;
    networkErrors.length = 0;
    consoleLogs.length = 0;

    console.log(`\n[Test Cycle ${cycle}/5] Navigating to http://localhost:3000...`);

    const loadPromise = new Promise(resolve => {
      pageLoadResolver = resolve;
    });

    await sendCmd('Page.navigate', { url: 'http://localhost:3000/?test=' + cycle });

    // Wait for Page.loadEventFired (with 5s fallback)
    await Promise.race([loadPromise, sleep(5000)]);

    // Wait for loader progression and dismissal (approx 1.5s - 2.5s)
    let dismissed = false;
    let pageState = null;

    for (let check = 0; check < 25; check++) {
      await sleep(200);
      const evalRes = await sendCmd('Runtime.evaluate', {
        expression: `(() => {
          const loader = document.getElementById('siteLoader');
          const hero = document.getElementById('hero');
          const counter = document.getElementById('loaderCounter');
          const selectedWorks = document.getElementById('selected-works');
          const isDismissed = loader ? loader.classList.contains('is-loaded') : false;
          const ready = window.__PORTFOLIO_READY__ || false;
          const galleryCount = (window.galleryElements) ? window.galleryElements.length : 0;
          return {
            ready,
            loaderClass: loader ? loader.className : 'NOT_FOUND',
            loaderDismissed: isDismissed,
            loaderCounterText: counter ? counter.textContent : '',
            heroVisible: hero ? (hero.getBoundingClientRect().height > 0) : false,
            selectedWorksVisible: selectedWorks ? (window.getComputedStyle(selectedWorks).display !== 'none') : false,
            galleryCount
          };
        })()`,
        returnByValue: true
      });

      pageState = evalRes.result?.value;
      if (pageState && pageState.loaderDismissed) {
        dismissed = true;
        break;
      }
    }

    const errorsThisCycle = [...consoleErrors, ...networkErrors];

    results.push({
      cycle,
      pageState,
      errors: errorsThisCycle,
      logs: consoleLogs
    });

    console.log(`Cycle ${cycle} Result:`);
    console.log(`  - Portfolio Ready: ${pageState?.ready}`);
    console.log(`  - Loader Dismissed: ${pageState?.loaderDismissed} (class: "${pageState?.loaderClass}")`);
    console.log(`  - Counter: ${pageState?.loaderCounterText}`);
    console.log(`  - Hero Visible: ${pageState?.heroVisible}`);
    console.log(`  - Selected Works Active: ${pageState?.selectedWorksVisible}`);
    console.log(`  - Gallery Count: ${pageState?.galleryCount}`);
    console.log(`  - Console / Network Errors: ${errorsThisCycle.length === 0 ? '0 (CLEAN)' : JSON.stringify(errorsThisCycle)}`);
  }

  // Close Chrome
  ws.close();
  chromeProc.kill();

  console.log('\n========================================');
  console.log('FINAL VERIFICATION SUMMARY (5 RELOADS):');
  let allPass = true;
  for (const r of results) {
    const pass = r.errors.length === 0 && r.pageState?.loaderDismissed && r.pageState?.heroVisible;
    if (!pass) allPass = false;
    console.log(`Reload #${r.cycle}: ${pass ? 'PASSED (0 Errors, Site Displayed)' : 'FAILED'}`);
  }
  console.log('========================================');
  if (allPass) {
    console.log('ALL 5 RELOADS COMPLETED WITH ZERO ERRORS AND COMPLETE RENDERING.');
  } else {
    console.error('VERIFICATION FAILED ON SOME CYCLES.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal in test runner:', err);
  process.exit(1);
});
