#!/usr/bin/env node
/**
 * tools/build.js - Reproducible production build for Dorcas Moïra Portfolio
 * Generates dist/ with build-time galleries, optimized assets and strict zero-broken integrity.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SRC_IMG_DIR = path.join(ROOT, 'assets', 'images');

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
  let data = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  if (['.html', '.css', '.js', '.json', '.xml', '.svg'].includes(ext)) {
    data = Buffer.from(data.toString('utf8').replace(/\r\n/g, '\n'), 'utf8');
  }
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

// =========================================================================
// 5. LOAD PORTFOLIO_DATA & VERIFY REAL IMAGES
// =========================================================================
const dataJsPath = path.join(ROOT, 'js', 'data.js');
const dataJsContent = fs.readFileSync(dataJsPath, 'utf8');
const sandboxContext = { window: {}, console: console };
vm.createContext(sandboxContext);
const PORTFOLIO_DATA = vm.runInContext(dataJsContent.replace(/\bconst PORTFOLIO_DATA\s*=/g, 'PORTFOLIO_DATA =') + '; PORTFOLIO_DATA;', sandboxContext);

if (!PORTFOLIO_DATA || !Array.isArray(PORTFOLIO_DATA.chapters)) {
  console.error('[FATAL ERROR] Could not load PORTFOLIO_DATA.chapters from js/data.js');
  process.exit(1);
}

const allExistingImages = new Set(fs.readdirSync(SRC_IMG_DIR));

// Validate an image: file exists AND all variants exist
function isImageFullyPresent(src) {
  if (!src) return false;
  const fname = path.basename(src);
  if (!allExistingImages.has(fname)) return false;

  const base = fname.replace(/\.(jpg|webp)$/, '');
  const requiredVariants = [
    `${base}-480w.webp`,
    `${base}-800w.webp`,
    `${base}-1200w.webp`,
    `${base}-1600w.webp`,
    `${base}-480w.avif`,
    `${base}-800w.avif`,
    `${base}-1200w.avif`,
    `${base}-1600w.avif`
  ];
  return requiredVariants.every(v => allExistingImages.has(v));
}

// Render responsive <picture> tag with safety onError
function renderPictureTag(imgObj, options = {}) {
  const src = imgObj.src;
  const fname = path.basename(src);
  const base = fname.replace(/\.(jpg|webp)$/, '');
  const alt = imgObj.alt || 'Dorcas Moïra';
  const focus = imgObj.focus ? ` style="object-position: ${imgObj.focus};"` : '';
  const loading = options.loading || 'lazy';
  const sizes = options.sizes || '(max-width: 768px) 85vw, 400px';
  const imgClass = options.imgClass ? ` class="${options.imgClass}"` : '';

  return `<picture>
    <source type="image/avif" srcset="assets/images/${base}-480w.avif 480w, assets/images/${base}-800w.avif 800w, assets/images/${base}-1200w.avif 1200w, assets/images/${base}-1600w.avif 1600w" sizes="${sizes}">
    <source type="image/webp" srcset="assets/images/${base}-480w.webp 480w, assets/images/${base}-800w.webp 800w, assets/images/${base}-1200w.webp 1200w, assets/images/${base}-1600w.webp 1600w" sizes="${sizes}">
    <img src="${src}" alt="${alt}"${imgClass}${focus} loading="${loading}" decoding="async" onerror="this.closest('.carousel-card, .selected-works-card, .polaroid-card, .timeline-vignette-wrap')?.remove()">
  </picture>`;
}

// Group chapters: >= 3 photos -> standalone chapter; < 3 photos -> merged into Selected Works
const standaloneChapters = [];
const selectedWorksPhotos = [];

for (const chap of PORTFOLIO_DATA.chapters) {
  const realImgs = (chap.images || []).filter(img => isImageFullyPresent(img.src));
  if (realImgs.length >= 3) {
    standaloneChapters.push({
      ...chap,
      validImages: realImgs
    });
  } else if (realImgs.length > 0) {
    for (const img of realImgs) {
      selectedWorksPhotos.push({
        ...img,
        chapterNumber: chap.number,
        chapterTitle: chap.titleFr
      });
    }
  }
}

console.log(`[Galleries Build] Standalone chapters (>=3 photos): ${standaloneChapters.map(c => c.titleFr).join(', ')}`);
console.log(`[Galleries Build] Photos merged into Selected Works (<3 photos): ${selectedWorksPhotos.length}`);

// 1. Build Selected Works HTML
let selectedWorksHtml = '';
if (selectedWorksPhotos.length > 0) {
  const cards = selectedWorksPhotos.map((photo, idx) => {
    const photoId = path.basename(photo.src, path.extname(photo.src));
    const creditAttr = photo.credit ? ` data-credit="${photo.credit}"` : '';
    return `          <div class="selected-works-card" data-lightbox="${photoId}" data-placeholder="false"${creditAttr}>
            <div class="selected-works-media">
              ${renderPictureTag(photo, { sizes: '(max-width: 768px) 85vw, 420px', imgClass: 'selected-works-img' })}
            </div>
          </div>`;
  }).join('\n');

  selectedWorksHtml = `    <!-- ==========================================================================
         SELECTED WORKS (Édition Exclusive · Prises de vue maîtresses)
         ========================================================================== -->
    <section class="section-wrap perf-auto-contain" id="selected-works">
      <div class="ambient-halo" aria-hidden="true"></div>
      <div class="section-container">
        <div class="editorial-header">
          <div class="editorial-header-left">
            <span class="chapter-number-pill" data-i18n="selected_works_pill">Édition Exclusive</span>
            <h2 class="chapter-title-script">Selected Works</h2>
            <span class="chapter-mood-italic" data-i18n="selected_works_sub">Sélection des prises de vue maîtresses & univers clés</span>
          </div>
          <div class="editorial-header-right">
            <strong>Dorcas Moïra</strong>
          </div>
        </div>

        <div class="selected-works-grid" id="selectedWorksGrid">
${cards}
        </div>
      </div>
    </section>`;
}

// 2. Build Standalone Chapters HTML
const chaptersHtmlArray = standaloneChapters.map(chap => {
  const cards = chap.validImages.map(img => {
    const photoId = path.basename(img.src, path.extname(img.src));
    const creditAttr = img.credit ? ` data-credit="${img.credit}"` : '';
    return `          <div class="carousel-card" data-lightbox="${photoId}" data-placeholder="false"${creditAttr}>
            <div class="carousel-card-media">
              ${renderPictureTag(img, { sizes: '(max-width: 768px) 85vw, 400px' })}
            </div>
          </div>`;
  }).join('\n');

  const categoryPills = {
    'editorial': 'Éditorial',
    'lifestyle': 'Lifestyle',
    'afro-chic': 'Afro Chic',
    'studio': 'Studio',
    'beauty': 'Nocturne & Solaire'
  };
  const categoryPill = categoryPills[chap.category] || 'Éditorial';

  const moods = {
    '01-signature': 'Royauté, intensité & sculpture monochrome',
    '02-many-moods': 'Élégance chaude, intérieurs feutrés & nuances d\'or',
    '03-afro-chic': 'Héritage africain modernisé & éclat des métaux',
    '04-studio': 'Épure, présence magnétique & contrastes vibrants',
    '05-sun-kissed': 'Solaire, sensuel & chorégraphie océanique',
    '06-visual': 'Allure contemporaine, pagnes d\'art & éclat des campagnes'
  };
  const chapMood = moods[chap.id] || '';

  return `    <!-- ${chap.number} · ${chap.titleFr} -->
    <section class="section-wrap perf-auto-contain" id="chap-${chap.number}">
      <div class="ambient-halo" aria-hidden="true"></div>
      <div class="section-container">
        <div class="editorial-header">
          <div class="editorial-header-left">
            <span class="chapter-number-pill">${chap.number} · Chapitre ${categoryPill}</span>
            <h2 class="chapter-title-script">${chap.titleFr}</h2>
            <span class="chapter-mood-italic">${chapMood}</span>
          </div>
          <div class="editorial-header-right">
            <strong>Dorcas Moïra</strong>
          </div>
        </div>

        <div class="chapter-carousel-scroll">
${cards}
        </div>
      </div>
    </section>`;
});

const chaptersContainerHtml = `    <div id="chapters">\n${chaptersHtmlArray.join('\n\n')}\n    </div>`;

// 3. Build Digitals HTML
let digitalsHtml = '';
const validDigitals = (PORTFOLIO_DATA.digitals || []).filter(d => isImageFullyPresent(d.src));
if (validDigitals.length > 0) {
  const cards = validDigitals.map(d => {
    return `          <div class="polaroid-card" data-lightbox="${d.id}" data-placeholder="false">
            <div class="polaroid-frame">
              ${renderPictureTag(d, { sizes: '(max-width: 768px) 90vw, 360px' })}
            </div>
            <div class="polaroid-meta">
              <span class="polaroid-tag">DIGITAL 01 — FACE</span>
            </div>
          </div>`;
  }).join('\n');

  digitalsHtml = `      <!-- Sous-section officielle : Digitals / Polaroids -->
      <div class="digitals-showcase" id="digitals">
        <div class="editorial-header">
          <div class="editorial-header-left">
            <span class="chapter-number-pill">Polaroids d'Agence</span>
            <h3 class="chapter-title-script">Digitals / Polaroids</h3>
            <span class="chapter-mood-italic">Lumière naturelle & traits bruts · Prises de vue sans retouche</span>
          </div>
          <div class="editorial-header-right">
            <strong>Polaroid Officiel · 01</strong>
            <span>Close-Up / Face</span>
          </div>
        </div>

        <div class="digitals-grid">
${cards}
        </div>
      </div>`;
}

// =========================================================================
// 6. PROCESS index.html WITH GENERATED GALLERIES & TECHNICAL SEO
// =========================================================================
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// Replace Digitals showcase
html = html.replace('<!-- BUILD:DIGITALS -->', digitalsHtml);

// Replace Galleries placeholder with generated Selected Works and Chapters
const replacementGalleries = `${selectedWorksHtml}\n\n${chaptersContainerHtml}`;
html = html.replace('<!-- BUILD:GALLERIES -->', replacementGalleries);

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
console.log('[OK] Generated dist/index.html with build-time galleries and versioned assets');

// 7. Copy 404.html
if (fs.existsSync(path.join(ROOT, '404.html'))) {
  let notFoundHtml = fs.readFileSync(path.join(ROOT, '404.html'), 'utf8');
  notFoundHtml = notFoundHtml.replace('href="css/google-fonts.css"', `href="css/google-fonts.css?v=${fontsHash}"`);
  notFoundHtml = notFoundHtml.replace('href="css/style.css"', `href="css/style.css?v=${styleHash}"`);
  fs.writeFileSync(path.join(DIST, '404.html'), notFoundHtml, 'utf8');
  console.log('[OK] Copied dist/404.html');
}

// 8. Generate robots.txt
const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${config.SITE_URL}/sitemap.xml\n`;
fs.writeFileSync(path.join(DIST, 'robots.txt'), robotsTxt, 'utf8');
console.log('[OK] Generated dist/robots.txt');

// 9. Generate sitemap.xml
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

// 10. Copy root icons
const rootIcons = ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png'];
for (const icon of rootIcons) {
  const p = path.join(ROOT, icon);
  if (fs.existsSync(p)) {
    fs.copyFileSync(p, path.join(DIST, icon));
  }
}

// 11. Copy comp card PDF
const pdfPath = path.join(ROOT, 'assets', 'compcard-dorcas-moira.pdf');
if (fs.existsSync(pdfPath)) {
  fs.copyFileSync(pdfPath, path.join(DIST, 'assets', 'compcard-dorcas-moira.pdf'));
  console.log('[OK] Copied compcard PDF');
}

// =========================================================================
// 12. SELECTIVE COPY OF PRODUCTION IMAGES (ONLY VALID REAL ONES)
// =========================================================================
const referencedImages = new Set();
referencedImages.add('og-image.jpg');

// Find all assets/images/ references in dist/index.html
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

// Also add all responsive variants for referenced images
for (const ref of Array.from(referencedImages)) {
  if (ref.endsWith('.jpg') || ref.endsWith('.webp')) {
    const base = ref.replace(/\.(jpg|webp)$/, '');
    for (const ext of ['webp', 'avif']) {
      for (const w of ['480w', '800w', '1200w', '1600w']) {
        const variant = `${base}-${w}.${ext}`;
        if (allExistingImages.has(variant)) {
          referencedImages.add(variant);
        }
      }
    }
  }
}

let copiedCount = 0;
for (const f of referencedImages) {
  const s = path.join(SRC_IMG_DIR, f);
  const d = path.join(DIST, 'assets', 'images', f);
  if (fs.existsSync(s) && fs.statSync(s).isFile()) {
    fs.copyFileSync(s, d);
    copiedCount++;
  }
}
console.log(`[OK] Copied ${copiedCount} verified production images into dist/`);

// =========================================================================
// 13. MANDATORY SAFETY NET: ZERO MISSING FILE IN DIST (BLOCKING ERROR)
// =========================================================================
console.log(`\n=== Verifying dist/ Integrity (Safety Net) ===`);
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
      console.error(`  [FATAL 404 ERROR] File referenced in dist/index.html is missing: ${rawUrl}`);
      missingCount++;
    }
  }
}

if (missingCount > 0) {
  console.error(`\n[BUILD FAILED] ${missingCount} broken reference(s) found in dist/index.html!`);
  process.exit(1);
}

console.log(`[PERFECT] 0 missing references in dist/index.html! Build integrity verified.`);

// 14. Compute total size and top 10 heaviest files
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
  console.log(`  ${idx + 1}. ${f.path} (${(f.size / 1024).toFixed(1)} KB)`);
});

console.log(`\n[SUCCESS] Production build completed!`);
