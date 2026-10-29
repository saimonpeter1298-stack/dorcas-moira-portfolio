const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const DIST = path.resolve(__dirname, '..', 'dist');
const PORT = 3881;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
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
        const ext = path.extname(f).toLowerCase();
        const contentType = MIME[ext] || 'application/octet-stream';
        const acceptEncoding = req.headers['accept-encoding'] || '';
        const compressible = ['.html', '.css', '.js', '.json', '.xml', '.svg', '.txt'].includes(ext);

        if (compressible && acceptEncoding.includes('gzip')) {
          res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Encoding': 'gzip',
            'Cache-Control': 'no-store'
          });
          fs.createReadStream(f).pipe(zlib.createGzip()).pipe(res);
        } else {
          res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-store'
          });
          fs.createReadStream(f).pipe(res);
        }
      });
    });
    s.listen(PORT, '127.0.0.1', () => resolve(s));
  });
}

function runOneAudit(passIndex) {
  return new Promise((resolve, reject) => {
    const reportPath = path.join(__dirname, `lh-report-pass-${passIndex}.json`);
    if (fs.existsSync(reportPath)) fs.unlinkSync(reportPath);

    const lhCmd = `npx lighthouse http://127.0.0.1:${PORT}/ --output=json --output-path="${reportPath}" --chrome-flags="--headless=new" --form-factor=mobile --screenEmulation.mobile=true --only-categories=performance,accessibility,best-practices,seo --quiet`;

    console.log(`\n>>> [Pass ${passIndex}/3] Running Lighthouse mobile audit...`);
    const proc = exec(lhCmd, {
      env: {
        ...process.env,
        CHROME_PATH: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      },
      maxBuffer: 50 * 1024 * 1024
    }, (error, stdout, stderr) => {
      if (error && !fs.existsSync(reportPath)) {
        return reject(error);
      }
      try {
        const raw = fs.readFileSync(reportPath, 'utf8');
        const report = JSON.parse(raw);
        const categories = report.categories;
        const audits = report.audits;

        const result = {
          pass: passIndex,
          perf: Math.round((categories.performance?.score || 0) * 100),
          a11y: Math.round((categories.accessibility?.score || 0) * 100),
          bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
          seo: Math.round((categories.seo?.score || 0) * 100),
          fcp: audits['first-contentful-paint']?.displayValue || 'N/A',
          fcpVal: audits['first-contentful-paint']?.numericValue || 0,
          lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
          lcpVal: audits['largest-contentful-paint']?.numericValue || 0,
          tbt: audits['total-blocking-time']?.displayValue || 'N/A',
          tbtVal: audits['total-blocking-time']?.numericValue || 0,
          cls: audits['cumulative-layout-shift']?.displayValue || 'N/A',
          clsVal: audits['cumulative-layout-shift']?.numericValue || 0
        };

        console.log(`    Pass ${passIndex} result: Perf=${result.perf}, FCP=${result.fcp}, LCP=${result.lcp}, TBT=${result.tbt}, CLS=${result.cls}`);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  });
}

function median(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function main() {
  const server = await startServer();
  console.log(`Server started on http://127.0.0.1:${PORT} targeting ${DIST}`);

  const results = [];
  try {
    for (let i = 1; i <= 3; i++) {
      const res = await runOneAudit(i);
      results.push(res);
    }
  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    server.close();
  }

  if (results.length === 0) return;

  const medianPerf = Math.round(median(results.map(r => r.perf)));
  const medianA11y = Math.round(median(results.map(r => r.a11y)));
  const medianBP = Math.round(median(results.map(r => r.bestPractices)));
  const medianSeo = Math.round(median(results.map(r => r.seo)));
  const medianFcp = (median(results.map(r => r.fcpVal)) / 1000).toFixed(2) + ' s';
  const medianLcp = (median(results.map(r => r.lcpVal)) / 1000).toFixed(2) + ' s';
  const medianTbt = Math.round(median(results.map(r => r.tbtVal))) + ' ms';
  const medianCls = median(results.map(r => r.clsVal)).toFixed(3);

  console.log(`\n================================================================`);
  console.log(`              RÉSULTATS DES 3 PASSES LIGHTHOUSE MOBILE           `);
  console.log(`================================================================`);
  console.log(`Passe | Perf | A11y | Best Pract | SEO |   FCP   |   LCP   |   TBT   |  CLS  `);
  console.log(`------+------+------+------------+-----+---------+---------+---------+-------`);
  results.forEach(r => {
    console.log(`  ${r.pass}   |  ${String(r.perf).padEnd(2)}  | ${String(r.a11y).padEnd(4)} |     ${String(r.bestPractices).padEnd(3)}    | ${String(r.seo).padEnd(3)} | ${r.fcp.padEnd(7)} | ${r.lcp.padEnd(7)} | ${r.tbt.padEnd(7)} | ${r.cls.padEnd(5)}`);
  });
  console.log(`------+------+------+------------+-----+---------+---------+---------+-------`);
  console.log(`MED.  |  ${String(medianPerf).padEnd(2)}  | ${String(medianA11y).padEnd(4)} |     ${String(medianBP).padEnd(3)}    | ${String(medianSeo).padEnd(3)} | ${medianFcp.padEnd(7)} | ${medianLcp.padEnd(7)} | ${medianTbt.padEnd(7)} | ${medianCls.padEnd(5)}`);
  console.log(`================================================================\n`);
}

main();
