import re

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_html_subject = re.search(r'<!-- CALQUE 4 : Modèle.*?</div>\s*<!-- CALQUE 5', html, re.DOTALL)
assert old_html_subject, "Could not find hero subject layer in index.html"

new_html_subject = """<!-- CALQUE 4 : Modèle détourée kimono rouille (z-index: 999) -->
    <div class="hero-layer-subject" id="heroLayerSubject">
      <picture>
        <source 
          type="image/avif"
          srcset="assets/images/hero-cutout-800w.avif 800w,
                  assets/images/hero-cutout-1200w.avif 1200w,
                  assets/images/hero-cutout-1800w.avif 1800w,
                  assets/images/hero-cutout-2400w.avif 2400w,
                  assets/images/hero-cutout.avif 2686w"
          sizes="(max-width: 767px) 140vw, (max-width: 1024px) 90vw, 700px"
        >
        <source 
          type="image/webp"
          srcset="assets/images/hero-cutout-800w.webp 800w,
                  assets/images/hero-cutout-1200w.webp 1200w,
                  assets/images/hero-cutout-1800w.webp 1800w,
                  assets/images/hero-cutout-2400w.webp 2400w,
                  assets/images/hero-cutout.webp 2686w"
          sizes="(max-width: 767px) 140vw, (max-width: 1024px) 90vw, 700px"
        >
        <img 
          src="assets/images/hero-cutout.png" 
          alt="Dorcas Moïra — Mannequin photo & Afro Fashion Muse"
          class="hero-cutout-img"
          id="heroCutoutImg"
          width="2686"
          height="3858"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          onerror="document.getElementById('hero').classList.add('hero-fallback-active')"
        >
      </picture>
    </div>

    <!-- CALQUE 5"""

html = html[:old_html_subject.start()] + new_html_subject + html[old_html_subject.end()-13:]
with open('index.html', 'w', encoding='utf-8', newline='') as f:
    f.write(html)
print("Updated index.html successfully.")

# 2. Update css/style.css
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace .hero-layer-subject section
old_css_subject = re.search(r'/\* CALQUE 4 : Modèle détourée kimono wax rouille.*?(?=/\* CALQUE 5 : Annotations)', css, re.DOTALL)
assert old_css_subject, "Could not find hero subject CSS in css/style.css"

new_css_subject = """/* CALQUE 4 : Modèle détourée kimono wax rouille (75-80% hauteur)
   z-index: 999 pour passer au-dessus du grain .noise-overlay (998)
   et garantir qu'aucun dégradé, halo, grille ou grain ne passe sur Dorcas. */
.hero-layer-subject {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 75svh;
  max-height: 78svh;
  width: auto;
  z-index: 999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  pointer-events: none;
}

/* Cadre de composition au ratio exact de l'ancien détourage (356/421).
   Le fichier HD d'origine (2686×3858) est positionné à l'intérieur sans recadrage. */
.hero-layer-subject picture {
  display: block;
  position: relative;
  height: 100%;
  width: auto;
  aspect-ratio: 356 / 421;
  /* Dissolution invisible du bas du kimono dans #0B0807 (zéro découpe nette qui flotte) */
  -webkit-mask-image: linear-gradient(to bottom, #000 84%, rgba(0,0,0,0.85) 92%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 84%, rgba(0,0,0,0.85) 92%, transparent 100%);
}

/* Modèle HD positionnée au pixel près pour répliquer exactement l'ancienne composition.
   Aucun filtre (drop-shadow, blur, contrast) pour une netteté optique pure. */
.hero-cutout-img {
  display: block;
  position: absolute;
  left: -11.798%;
  bottom: 0;
  width: 117.136%;
  height: auto;
  max-width: none;
  max-height: none;
  filter: none;
  transform-origin: 52.757% 64.858%;
}

@media (min-width: 1024px) {
  .hero-layer-subject {
    height: 76vh;
    max-height: 80vh;
  }
}

"""

css = css[:old_css_subject.start()] + new_css_subject + css[old_css_subject.end():]

# Update fullscreen-menu z-index from 990 to 1050
css = re.sub(r'(\.fullscreen-menu\s*\{[^}]*?z-index:\s*)990;', r'\g<1>1050;', css)

# Update site-header z-index from 1000 to 1100
css = re.sub(r'(\.site-header\s*\{[^}]*?z-index:\s*)1000;', r'\g<1>1100;', css)

with open('css/style.css', 'w', encoding='utf-8', newline='') as f:
    f.write(css)
print("Updated css/style.css successfully.")

# 3. Update js/main.js
with open('js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Update hero cutout entrance animation to clear transform and willChange on complete
old_gsap_cutout = re.search(r"\.from\('#heroCutoutImg',\s*\{[^}]*duration:\s*1\.15\s*\},?\s*0\.5\)", js)
assert old_gsap_cutout, "Could not find heroCutoutImg GSAP animation in js/main.js"

new_gsap_cutout = """.from('#heroCutoutImg', {
    scale: 1.04,
    opacity: 0,
    duration: 1.15,
    onComplete: () => {
      const el = document.getElementById('heroCutoutImg');
      if (el) {
        gsap.set(el, { clearProps: 'transform,willChange' });
      }
    }
  }, 0.5)"""

js = js[:old_gsap_cutout.start()] + new_gsap_cutout + js[old_gsap_cutout.end():]

with open('js/main.js', 'w', encoding='utf-8', newline='') as f:
    f.write(js)
print("Updated js/main.js successfully.")
