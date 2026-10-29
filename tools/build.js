#!/usr/bin/env node
/**
 * tools/build.js - Reproducible production build for Dorcas Moïra Portfolio
 * Generates dist/ with optimized, versioned assets and verified references.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// 1. Load site configuration
let config = {
  SITE_URL: "https://dorcasmoira.com",
  SITE_NAME: "Dorcas Moïra",
  OG_IMAGE: "/assets/images/og-image.jpg"
};
const configPath = path.join(ROOT, 'site.config.json');
if (fs.existsSync(configPath)) {
  try {
    const raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config = { ...config, ...raw };
  } catch (e) {
    console.warn('[WARN] Could not parse site.config.json, using defaults.');
  }
}
if (process.env.SITE_URL) {
  config.SITE_URL = process.env.SITE_URL.replace(/\/$/, '');
}

console.log(`=== Building for Production ===`);
console.log(`Target Site URL: ${config.SITE_URL}`);

// Helper: compute md5 file hash
function getFileHash(filePath) {
  if (!fs.existsSync(filePath)) return '1';
  const data = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(data).digest('hex').slice(0, 8);
}

// Helper: copy directory recursively
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

// 2. Clean and initialize dist/
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(DIST, { recursive: true });
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
fs.mkdirSync(path.join(DIST, 'assets', 'images'), { recursive: true });

// 3. Copy css and js
copyDir(path.join(ROOT, 'css'), path.join(DIST, 'css'));
copyDir(path.join(ROOT, 'js'), path.join(DIST, 'js'));

// Minify dist/css/style.css
const distStyleCssPath = path.join(DIST, 'css', 'style.css');
if (fs.existsSync(distStyleCssPath)) {
  let rawCss = fs.readFileSync(distStyleCssPath, 'utf8');
  let minCss = rawCss
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
  fs.writeFileSync(distStyleCssPath, minCss, 'utf8');
  console.log(`[OK] Minified dist/css/style.css (${rawCss.length} -> ${minCss.length} bytes)`);
}

// 4. Compute cache-busting hashes for production
const styleHash = getFileHash(path.join(ROOT, 'css', 'style.css'));
const fontsHash = getFileHash(path.join(ROOT, 'css', 'google-fonts.css'));
const dataHash = getFileHash(path.join(ROOT, 'js', 'data.js'));
const mainHash = getFileHash(path.join(ROOT, 'js', 'main.js'));

console.log(`Asset hashes: style=${styleHash}, fonts=${fontsHash}, data=${dataHash}, main=${mainHash}`);

// 5. Process index.html (Technical SEO & Cache-Busting)
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// A. Canonical link
if (!html.includes('<link rel="canonical"')) {
  html = html.replace('</title>', `</title>\n  <link rel="canonical" href="${config.SITE_URL}/">`);
} else {
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${config.SITE_URL}/">`);
}

// B. og:url
if (!html.includes('<meta property="og:url"')) {
  html = html.replace('<meta property="og:type"', `<meta property="og:url" content="${config.SITE_URL}/">\n  <meta property="og:type"`);
} else {
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${config.SITE_URL}/">`);
}

// C. og:image & twitter:image (Absolute URL)
const fullOgImage = `${config.SITE_URL}/assets/images/og-image.jpg`;
html = html.replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${fullOgImage}">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n  <meta property="og:image:alt" content="Dorcas Moïra — Modèle Photo & Afro Fashion Muse">`);
html = html.replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${fullOgImage}">`);

// D. JSON-LD Person schema url & image
html = html.replace(
  /"@type":\s*"Person",/,
  `"@type": "Person",\n    "url": "${config.SITE_URL}",\n    "image": "${fullOgImage}",`
);

// E. Cache-busting queries for CSS/JS
html = html.replace('href="css/google-fonts.css"', `href="css/google-fonts.css?v=${fontsHash}"`);
html = html.replace('href="css/style.css"', `href="css/style.css?v=${styleHash}"`);
html = html.replace('src="js/data.js"', `src="js/data.js?v=${dataHash}"`);
html = html.replace('src="js/main.js"', `src="js/main.js?v=${mainHash}"`);

fs.writeFileSync(path.join(DIST, 'index.html'), html, 'utf8');
console.log('[OK] Generated dist/index.html with technical SEO and versioned assets');

// 6. Generate 404.html
if (fs.existsSync(path.join(ROOT, '404.html'))) {
  let notFoundHtml = fs.readFileSync(path.join(ROOT, '404.html'), 'utf8');
  notFoundHtml = notFoundHtml.replace('href="css/google-fonts.css"', `href="css/google-fonts.css?v=${fontsHash}"`);
  notFoundHtml = notFoundHtml.replace('href="css/style.css"', `href="css/style.css?v=${styleHash}"`);
  fs.writeFileSync(path.join(DIST, '404.html'), notFoundHtml, 'utf8');
  console.log('[OK] Copied dist/404.html');
}

// 7. Generate robots.txt
const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${config.SITE_URL}/sitemap.xml\n`;
fs.writeFileSync(path.join(DIST, 'robots.txt'), robotsTxt, 'utf8');
console.log('[OK] Generated dist/robots.txt');

// 8. Generate sitemap.xml
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${config.SITE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>\n`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemapXml, 'utf8');
console.log('[OK] Generated dist/sitemap.xml');

// 9. Copy root icons
const rootIcons = ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png'];
for (const icon of rootIcons) {
  const p = path.join(ROOT, icon);
  if (fs.existsSync(p)) {
    fs.copyFileSync(p, path.join(DIST, icon));
  }
}

// 10. Copy comp card PDF
const pdfPath = path.join(ROOT, 'assets', 'compcard-dorcas-moira.pdf');
if (fs.existsSync(pdfPath)) {
  fs.copyFileSync(pdfPath, path.join(DIST, 'assets', 'compcard-dorcas-moira.pdf'));
  console.log('[OK] Copied compcard PDF');
}

// 11. Selective copy of assets/images/
// Strictly copy ONLY images that are referenced in HTML, CSS, JS + og-image.jpg
const referencedImages = new Set();
referencedImages.add('og-image.jpg');

// Find all assets/images/ references in index.html
const rawHtmlMatches = html.match(/assets\/images\/([a-zA-Z0-9_\-\.]+)/g) || [];
for (const m of rawHtmlMatches) {
  const fname = m.replace('assets/images/', '').split('?')[0].split('#')[0].trim();
  if (fname && !fname.includes(' ')) referencedImages.add(fname);
}

// Scan js/data.js and js/main.js
const jsData = fs.readFileSync(path.join(ROOT, 'js', 'data.js'), 'utf8');
const jsDataMatches = jsData.match(/assets\/images\/([a-zA-Z0-9_\-\.]+)/g) || [];
for (const m of jsDataMatches) {
  const fname = m.replace('assets/images/', '').split('?')[0].split('#')[0].trim();
  if (fname && !fname.includes(' ')) referencedImages.add(fname);
}

const jsMain = fs.readFileSync(path.join(ROOT, 'js', 'main.js'), 'utf8');
const jsMainMatches = jsMain.match(/assets\/images\/([a-zA-Z0-9_\-\.]+)/g) || [];
for (const m of jsMainMatches) {
  const fname = m.replace('assets/images/', '').split('?')[0].split('#')[0].trim();
  if (fname && !fname.includes(' ')) referencedImages.add(fname);
}

// Scan css/
for (const cssFile of ['style.css', 'google-fonts.css']) {
  const cssContent = fs.readFileSync(path.join(ROOT, 'css', cssFile), 'utf8');
  const cssMatches = cssContent.match(/assets\/images\/([a-zA-Z0-9_\-\.]+)/g) || [];
  for (const m of cssMatches) {
    const fname = m.replace('assets/images/', '').split('?')[0].split('#')[0].trim();
    if (fname && !fname.includes(' ')) referencedImages.add(fname);
  }
}

const EXCLUDED_FROM_DIST = new Set([
  'hero-cutout.png',
  'hero-cutout-raw.png',
  'hero-cutout-2400w.avif',
  'hero-cutout-2400w.webp',
  'hero-cutout-1800w.avif',
  'hero-cutout-1800w.webp',
  'hero-cutout-1200w.avif',
  'hero-cutout-1200w.webp',
  'hero-cutout-800w.avif',
  'hero-cutout-800w.webp',
  'hero-cutout.avif'
]);

const srcImgDir = path.join(ROOT, 'assets', 'images');
const allSrcImages = fs.readdirSync(srcImgDir);

const filesToCopy = new Set();
for (const ref of referencedImages) {
  if (EXCLUDED_FROM_DIST.has(ref)) continue;
  if (allSrcImages.includes(ref)) {
    filesToCopy.add(ref);
  }
}

let copiedCount = 0;
for (const f of filesToCopy) {
  const s = path.join(srcImgDir, f);
  const d = path.join(DIST, 'assets', 'images', f);
  if (fs.existsSync(s) && fs.statSync(s).isFile()) {
    fs.copyFileSync(s, d);
    copiedCount++;
  }
}
console.log(`[OK] Selectively copied ${copiedCount} production images (excluding unused placeholders)`);

// 12. Verification: ZERO 404 inside dist
console.log(`\n=== Verifying dist/ Integrity ===`);
let missingCount = 0;
const distHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const distAttrRegex = /(src|href|srcset|data-img|data-preview)=["']([^"']+)["']/g;
let match;

while ((match = distAttrRegex.exec(distHtml)) !== null) {
  const attrName = match[1];
  const attrVal = match[2];
  const parts = (attrName === 'srcset') ? attrVal.split(',') : [attrVal];

  for (const part of parts) {
    const rawUrl = part.trim().split(' ')[0].split('?')[0].split('#')[0];
    if (!rawUrl || rawUrl.startsWith('http') || rawUrl.startsWith('https:') || rawUrl.startsWith('mailto:') || rawUrl.startsWith('tel:') || rawUrl.startsWith('#') || rawUrl.startsWith('data:')) {
      continue;
    }
    const checkPath = path.join(DIST, rawUrl);
    if (!fs.existsSync(checkPath)) {
      console.error(`  [404 NOT FOUND] in dist: ${rawUrl}`);
      missingCount++;
    }
  }
}

if (missingCount === 0) {
  console.log(`[PERFECT] 0 missing references in dist/index.html!`);
} else {
  console.error(`[FAIL] ${missingCount} missing references found in dist/!`);
  process.exit(1);
}

// 13. Compute total size and top 10 heaviest files
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push({
        path: path.relative(DIST, filePath).replace(/\\/g, '/'),
        size: fs.statSync(filePath).size
      });
    }
  }
  return fileList;
}

const allDistFiles = getAllFiles(DIST);
const totalSize = allDistFiles.reduce((acc, f) => acc + f.size, 0);
allDistFiles.sort((a, b) => b.size - a.size);

console.log(`\n=== dist/ Statistics ===`);
console.log(`Total files: ${allDistFiles.length}`);
console.log(`Total size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB (${totalSize.toLocaleString()} bytes)`);

console.log(`\nTop 10 heaviest files:`);
allDistFiles.slice(0, 10).forEach((f, idx) => {
  const mb = (f.size / (1024 * 1024)).toFixed(2);
  const kb = (f.size / 1024).toFixed(1);
  const sizeStr = f.size > 1024 * 1024 ? `${mb} MB` : `${kb} KB`;
  console.log(`  ${idx + 1}. ${f.path} (${sizeStr})`);
});

console.log(`\n[SUCCESS] Production build completed!`);
