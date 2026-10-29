const http = require('http');
const { spawn } = require('child_process');

async function test() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9889',
    '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\ch9889',
    'http://localhost:3000/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const list = await new Promise((resolve) => {
    http.get('http://127.0.0.1:9889/json/list', res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    });
  });

  const page = list.find(t => t.type === 'page' && t.url.includes('localhost:3000'));
  console.log('Selected Tab:', page.title);

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

  const logs = [];
  const exceptions = [];

  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id).resolve(m.result);
      pending.delete(m.id);
    } else if (m.method === 'Runtime.consoleAPICalled') {
      logs.push(`[${m.params.type}] ` + m.params.args.map(a => a.value || JSON.stringify(a)).join(' '));
    } else if (m.method === 'Runtime.exceptionThrown') {
      exceptions.push(m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text);
    }
  });

  await sendCmd('Runtime.enable');
  await sendCmd('Console.enable');

  // Wait another 2.5 seconds with listeners attached
  await new Promise(r => setTimeout(r, 2500));

  const res = await sendCmd('Runtime.evaluate', {
    expression: '({ readyState: document.readyState, title: document.title, loader: document.getElementById("siteLoader")?.className, counter: document.getElementById("loaderCounter")?.textContent, ready: window.__PORTFOLIO_READY__, dataReady: typeof PORTFOLIO_DATA !== "undefined", mainScriptPresent: !!document.querySelector("script[src*=\'main.js\']") })',
    returnByValue: true
  });

  console.log('EVAL RESULT:', res.result.value);
  console.log('LOGS:', logs);
  console.log('EXCEPTIONS:', exceptions);

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
