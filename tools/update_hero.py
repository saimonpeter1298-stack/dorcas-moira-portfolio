import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update header brand
content = re.sub(
    r'<div class="header-brand">\s*<a href="#hero" class="monogram"[^>]*>DM</a>\s*<span class="brand-meta">[^<]*</span>\s*</div>',
    '<div class="header-brand">\n      <a href="#hero" class="monogram" aria-label="Dorcas Moïra Accueil">DM</a>\n    </div>',
    content
)

# 2. Update hero section
new_hero = '''  <!-- ==========================================================================
       7. HERO : ÉDITORIAL & BOOK COVER HAUTE COUTURE
       - Cadre intérieur (inset frame) + repères de coupe L-brackets
       - Grille technique 4 colonnes (mobile) / 12 colonnes (desktop) + micro-croix
       - Mot géant « PORTFOLIO » (2 lignes mobiles: PORT / FOLIO, 1 ligne desktop)
       - Filigrane script « Creative »
       - Modèle kimono wax rouille (hero-cutout.webp) 75-80% hauteur, tête devant la jonction
       - 4 annotations aux coins de la grille (desktop) / haut-bas sobres (mobile)
       ========================================================================== -->
  <section class="hero-section" id="hero" aria-label="Dorcas Moïra Portfolio">
    <!-- CALQUE 1 : Fond studio radial ambre/espresso feutré + grain (z-index: 1) -->
    <div class="hero-layer-bg" id="heroLayerBg">
      <div class="hero-studio-halo" aria-hidden="true"></div>
      <img 
        src="assets/images/hero-portrait.jpg" 
        alt="" 
        class="hero-fallback-bg" 
        id="heroFallbackBg" 
        aria-hidden="true"
      >
    </div>

    <!-- CALQUE 2 : Cadre intérieur Book Cover & Grille technique (z-index: 2) -->
    <div class="hero-frame-inset" id="heroFrameInset" aria-hidden="true">
      <span class="corner-mark corner-tl"></span>
      <span class="corner-mark corner-tr"></span>
      <span class="corner-mark corner-bl"></span>
      <span class="corner-mark corner-br"></span>

      <div class="hero-grid-lines">
        <div class="grid-col-line col-1"></div>
        <div class="grid-col-line col-2"></div>
        <div class="grid-col-line col-3"></div>
        <div class="grid-col-line col-4"></div>
        <div class="grid-col-line col-5 desktop-only"></div>
        <div class="grid-col-line col-6 desktop-only"></div>
        <div class="grid-col-line col-7 desktop-only"></div>
        <div class="grid-col-line col-8 desktop-only"></div>
        <div class="grid-col-line col-9 desktop-only"></div>
        <div class="grid-col-line col-10 desktop-only"></div>
        <div class="grid-col-line col-11 desktop-only"></div>
        <div class="grid-col-line col-12 desktop-only"></div>
        <div class="grid-row-line row-top"></div>
        <div class="grid-row-line row-bottom"></div>
        <span class="grid-cross cross-tl">+</span>
        <span class="grid-cross cross-tr">+</span>
        <span class="grid-cross cross-bl">+</span>
        <span class="grid-cross cross-br">+</span>
      </div>
    </div>

    <!-- CALQUE 3 : Typographie géante « PORTFOLIO » + filigrane script « Creative » (z-index: 3) -->
    <div class="hero-layer-word" id="heroLayerPortfolio" aria-hidden="true">
      <div class="hero-word-wrap">
        <span class="hero-script-creative">Creative</span>

        <!-- Mobile : 2 lignes superposées PORT / FOLIO -->
        <div class="hero-word-mobile">
          <span class="word-line line-port">PORT</span>
          <span class="word-line line-folio">FOLIO</span>
        </div>

        <!-- Tablette & Desktop : 1 seule ligne pleine chasse clampée -->
        <div class="hero-word-desktop">
          <span class="word-line line-single">PORTFOLIO</span>
        </div>
      </div>
    </div>

    <!-- CALQUE 4 : Modèle détourée kimono rouille (z-index: 5) -->
    <div class="hero-layer-subject" id="heroLayerSubject">
      <picture>
        <source srcset="assets/images/hero-cutout.avif" type="image/avif">
        <source srcset="assets/images/hero-cutout.webp" type="image/webp">
        <img 
          src="assets/images/hero-cutout.png" 
          alt="Dorcas Moïra — Mannequin photo & Afro Fashion Muse"
          class="hero-cutout-img"
          id="heroCutoutImg"
          loading="eager"
          fetchpriority="high"
          onerror="document.getElementById('hero').classList.add('hero-fallback-active')"
        >
      </picture>
    </div>

    <!-- CALQUE 5 : Annotations éditoriales aux 4 coins (z-index: 10) -->
    <div class="hero-annotations-layer" id="heroAnnotationsLayer">
      <!-- Angle Haut-Gauche (Desktop uniquement) -->
      <div class="hero-annot annot-top-left desktop-only">
        <span class="annot-script">Signature</span>
        <span class="annot-quote" data-i18n="hero_tagline">« La beauté gabonaise dans sa version la plus moderne. »</span>
      </div>

      <!-- Angle Haut-Droit (Mobile & Desktop) -->
      <div class="hero-annot annot-top-right">
        <span class="annot-title">Dorcas Moïra</span>
        <span class="annot-role" data-i18n="hero_role">Modèle Photo | Afro Fashion Muse</span>
      </div>

      <!-- Angle Bas-Gauche (Desktop uniquement) -->
      <div class="hero-annot annot-bottom-left desktop-only">
        <span class="annot-num">N°01 — Portfolio 2026</span>
        <span class="annot-edition">Édition Haute Couture</span>
      </div>

      <!-- Angle Bas-Droit (Mobile & Desktop) -->
      <div class="hero-annot annot-bottom-right">
        <span class="annot-mobile-quote mobile-only" data-i18n="hero_tagline">« La beauté gabonaise dans sa version la plus moderne. »</span>
        <span class="annot-city desktop-only">Casablanca, MA</span>
        <a href="#manifesto" class="hero-scroll-cue">
          <span class="hero-scroll-line" aria-hidden="true"></span>
          <span data-i18n="hero_scroll">Découvrir l'univers</span>
        </a>
      </div>
    </div>
  </section>'''

hero_pattern = r'<!-- =+\s*7\.\s*HERO.*?<section class="hero-section" id="hero">.*?</section>'
content = re.sub(hero_pattern, new_hero, content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated index.html successfully')
