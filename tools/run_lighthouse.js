const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '..', 'dist');
const PORT = 3875;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

function startServer() {
  return new Promise(resolve => {
    const s = http.createServer((req, res) => {
      let p = decodeURI(req.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      const f = path.join(DIST, p);
      fs.stat(f, (err, st) => {
        if (err || !st.isFile()) {
          res.writeHead(404);
          res.end('404');
          return;
        }
        res.writeHead(200, {
          'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream',
          'Cache-Control': 'no-store'
        });
        fs.createReadStream(f).pipe(res);
      });
    });
    s.listen(PORT, '127.0.0.1', () => resolve(s));
  });
}

async function run() {
  const server = await startServer();
  console.log(`Server running at http://127.0.0.1:${PORT}`);

  const reportPath = path.join(__dirname, 'lighthouse-report.json');
  if (fs.existsSync(reportPath)) fs.unlinkSync(reportPath);

  console.log('Running mobile Lighthouse audit via npx...');
  const cmd = `npx --yes lighthouse http://127.0.0.1:${PORT}/ --output=json --output-path="${reportPath}" --chrome-flags="--headless=new --no-sandbox" --form-factor=mobile --screenEmulation.mobile=true --throttling-method=simulate --quiet`;

  try {
    execSync(cmd, { stdio: 'inherit', env: { ...process.env, CHROME_PATH: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' } });
    if (fs.existsSync(reportPath)) {
      const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      const categories = data.categories;
      console.log('\n=== REAL LIGHTHOUSE SCORES (MOBILE) ===');
      for (const [key, val] of Object.entries(categories)) {
        console.log(`${val.title}: ${Math.round(val.score * 100)} / 100`);
      }
      const audits = data.audits;
      console.log('\n=== Core Metrics ===');
      console.log('FCP:', audits['first-contentful-paint']?.displayValue);
      console.log('LCP:', audits['largest-contentful-paint']?.displayValue);
      console.log('TBT:', audits['total-blocking-time']?.displayValue);
      console.log('CLS:', audits['cumulative-layout-shift']?.displayValue);
      console.log('Speed Index:', audits['speed-index']?.displayValue);
    }
  } catch (err) {
    console.error('Lighthouse run error:', err.message);
  } finally {
    server.close();
  }
}

run();
