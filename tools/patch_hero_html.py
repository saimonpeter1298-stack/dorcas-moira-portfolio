import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace Hero Section
old_hero_pattern = re.compile(r'<section class="hero-section" id="hero">.*?</section>', re.DOTALL)

new_hero = """<section class="hero-section" id="hero">
    <!-- CALQUE 1 : Fond halo studio pur (sans image dédoublée, sans masque parasite) -->
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

    <!-- CALQUE 2 : Mot géant « MOÏRA » en dégradé cuivre (tenu en entier) -->
    <div class="hero-layer-word" id="heroLayerPortfolio" aria-hidden="true">
      <span class="hero-word-moira">MOÏRA</span>
    </div>

    <!-- CALQUE 3 : Modèle détourée (75% hauteur d'écran, tête devant le bas des lettres) -->
    <div class="hero-layer-subject" id="heroLayerSubject">
      <picture>
        <source srcset="assets/images/hero-cutout.webp" type="image/webp">
        <img 
          src="assets/images/hero-cutout.webp" 
          alt="Dorcas Moïra — Mannequin photo & Afro Fashion Muse"
          class="hero-cutout-img"
          id="heroCutoutImg"
          loading="eager"
          fetchpriority="high"
          onerror="document.getElementById('hero').classList.add('hero-fallback-active')"
        >
      </picture>
    </div>

    <!-- CALQUE 4 : Badge Miss Gabon Maroc (en haut à gauche, sous le header, jamais sur le corps) -->
    <div class="hero-top-badge" id="heroTopBadge">
      <span class="pulse-dot" aria-hidden="true"></span>
      <span data-i18n="hero_badge">Candidate Miss Gabon Maroc 2026</span>
    </div>

    <!-- CALQUE 5 : Bloc texte sobre (sur dégradé de lisibilité couvrant le bas du kimono) -->
    <div class="hero-bottom-scrim" aria-hidden="true"></div>
    <div class="hero-layer-foreground" id="heroLayerForeground">
      <div class="hero-script-creative" aria-hidden="true">Creative Portfolio</div>
      <h1 class="hero-model-name">DORCAS MOÏRA</h1>
      <p class="hero-tagline" data-i18n="hero_tagline">« La beauté gabonaise dans sa version la plus moderne. »</p>
      <a href="#manifesto" class="hero-scroll-cue">
        <span class="hero-scroll-line" aria-hidden="true"></span>
        <span data-i18n="hero_scroll">Découvrir l'univers</span>
      </a>
    </div>
  </section>"""

html = old_hero_pattern.sub(new_hero, html, count=1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index.html hero section successfully!")
