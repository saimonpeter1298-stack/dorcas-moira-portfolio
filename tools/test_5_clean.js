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

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_5clean_' + Date.now();
  const port = 9993;

  console.log('Spawning Chrome on port', port);
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
  const page = list.find(t => t.type === 'page' && t.url.includes('localhost:3000')) || list.find(t => t.type === 'page');
  console.log('Selected Tab:', page.title, page.url);

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r, { once: true }));

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

  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id).resolve(m.result);
      pending.delete(m.id);
    } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
      const txt = m.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
      consoleErrors.push(txt);
    } else if (m.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text);
    }
  });

  await sendCmd('Runtime.enable');
  await sendCmd('Console.enable');

  console.log('\n======================================================');
  console.log('AUDIT : 5 RECHARGEMENTS CONSECUTIFS SANS ERREUR CONSOLE');
  console.log('======================================================\n');

  const results = [];

  for (let cycle = 1; cycle <= 5; cycle++) {
    consoleErrors.length = 0;

    if (cycle > 1) {
      console.log(`[Rechargement ${cycle}/5] location.reload()...`);
      await sendCmd('Runtime.evaluate', { expression: 'location.reload()' });
    } else {
      console.log(`[Rechargement 1/5] Page initiale...`);
    }

    await sleep(2300);

    const evalRes = await sendCmd('Runtime.evaluate', {
      expression: `({
        title: document.title,
        loaderClass: document.getElementById('siteLoader')?.className,
        counter: document.getElementById('loaderCounter')?.textContent,
        ready: window.__PORTFOLIO_READY__ || false,
        galleryCount: window.galleryElements ? window.galleryElements.length : 0,
        heroHeight: document.getElementById('hero')?.offsetHeight || 0,
        selectedWorksCount: document.querySelectorAll('.selected-works-card')?.length || 0
      })`,
      returnByValue: true
    });

    const state = evalRes.result?.value;
    const errors = [...consoleErrors];
    const isDismissed = state?.loaderClass?.includes('is-loaded');
    const isDisplayed = state?.heroHeight > 0;
    const isZeroErrors = errors.length === 0;
    const passed = isDismissed && isDisplayed && isZeroErrors && state?.ready;

    results.push({ cycle, passed, state, errors });

    console.log(`Résultat Rechargement #${cycle} :`);
    console.log(`  - Titre : "${state?.title}"`);
    console.log(`  - Engine Initialisé : ${state?.ready}`);
    console.log(`  - Compteur Loader : ${state?.counter}`);
    console.log(`  - État Loader : ${state?.loaderClass} (${isDismissed ? 'DISPARU' : 'BLOQUÉ'})`);
    console.log(`  - Hero Affiché : ${isDisplayed} (hauteur: ${state?.heroHeight}px)`);
    console.log(`  - Photos Selected Works : ${state?.selectedWorksCount}`);
    console.log(`  - Total Photos Galerie : ${state?.galleryCount}`);
    console.log(`  - Erreurs Console : ${errors.length === 0 ? '0 (AUCUNE ERREUR)' : JSON.stringify(errors)}`);
    console.log(`  - Statut : ${passed ? '✓ SUCCÈS' : '✗ ÉCHEC'}\n`);
  }

  ws.close();
  chromeProc.kill();

  console.log('======================================================');
  console.log('RAPPORT FINAL DE VALIDATION');
  console.log('======================================================');
  const allSuccess = results.every(r => r.passed);
  results.forEach(r => {
    console.log(`Rechargement #${r.cycle} : ${r.passed ? 'SUCCÈS (0 erreur console, site rendu parfaitement)' : 'ÉCHEC'}`);
  });
  console.log(`\nConclusion : ${allSuccess ? '100% DE SUCCÈS SUR LES 5 RECHARGEMENTS - ZÉRO ERREUR CONSOLE' : 'ÉCHEC'}`);
  console.log('======================================================');

  process.exit(allSuccess ? 0 : 1);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
