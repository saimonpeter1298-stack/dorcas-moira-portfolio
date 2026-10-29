const { spawn, exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '..', 'dist');
const PORT = 3880;

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
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.xml': 'application/xml'
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

async function main() {
  const server = await startServer();
  console.log(`Server started on http://127.0.0.1:${PORT}`);
  const reportPath = path.join(__dirname, 'lh-report.json');
  if (fs.existsSync(reportPath)) fs.unlinkSync(reportPath);

  const lhCmd = `npx lighthouse http://127.0.0.1:${PORT}/ --output=json --output-path="${reportPath}" --chrome-flags="--headless=new" --form-factor=mobile --screenEmulation.mobile=true --only-categories=performance,accessibility,best-practices,seo --quiet`;

  console.log('Running Lighthouse audit...');
  const proc = exec(lhCmd, {
    env: {
      ...process.env,
      CHROME_PATH: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    }
  });

  proc.stdout?.on('data', d => console.log(d.toString()));
  proc.stderr?.on('data', d => console.error(d.toString()));

  proc.on('close', (code) => {
    server.close();
    console.log(`Lighthouse process finished with code ${code}`);

    if (fs.existsSync(reportPath)) {
      const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      const cat = data.categories;
      console.log('\n========================================');
      console.log('  SCORES LIGHTHOUSE RÉELS (MOBILE)');
      console.log('========================================');
      console.log(`Performance      : ${Math.round(cat.performance.score * 100)} / 100`);
      console.log(`Accessibilité    : ${Math.round(cat.accessibility.score * 100)} / 100`);
      console.log(`Bonnes Pratiques : ${Math.round(cat['best-practices'].score * 100)} / 100`);
      console.log(`SEO              : ${Math.round(cat.seo.score * 100)} / 100`);

      const a = data.audits;
      console.log('\n--- Métriques Core Web Vitals ---');
      console.log(`FCP (First Contentful Paint)   : ${a['first-contentful-paint']?.displayValue}`);
      console.log(`LCP (Largest Contentful Paint) : ${a['largest-contentful-paint']?.displayValue}`);
      console.log(`TBT (Total Blocking Time)      : ${a['total-blocking-time']?.displayValue}`);
      console.log(`CLS (Cumulative Layout Shift)  : ${a['cumulative-layout-shift']?.displayValue}`);
      console.log(`Speed Index                    : ${a['speed-index']?.displayValue}`);
      console.log('========================================\n');
    } else {
      console.error('[FAIL] No report generated');
    }
  });
}

main();
