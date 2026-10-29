import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Remove brand-meta rules
css = re.sub(r'\.brand-meta\s*\{[^}]*\}', '', css)
css = re.sub(r'@media\s*\([^)]*\)\s*\{\s*\.brand-meta\s*\{[^}]*\}\s*\}', '', css)

# 2. Replace Hero Section CSS (from line /* === HERO to MANIFESTO)
hero_pattern = r'/\* =+\s*HERO\s*:.*?(?=/\* =+\s*MANIFESTE)'
new_hero_css = '''/* ==========================================================================
   7. HERO : ÉDITORIAL & BOOK COVER HAUTE COUTURE (AWWWARDS FINAL)
   Palette : #0B0807, #1E140F, #B87A52, #E3B48C, #F3E6D8, #9C8A7C
   - Zéro bloc parasite, zéro rectangle sombre, zéro découpe en dur
   - Cadre intérieur Book Cover 1px cuivre + 4 repères de coupe L-brackets
   - Grille technique 4 col (mobile) / 12 col (desktop) + micro-croix (+)
   - « PORTFOLIO » géant 100% cuivre : 2 lignes mobiles (PORT / FOLIO), 1 ligne desktop
   - Filigrane script « Creative »
   - Modèle kimono wax rouille 75-80% hauteur, tête devant la jonction
   - Dissolution douce du bas du pantalon dans #0B0807 (mask-image)
   - 4 annotations aux 4 coins (desktop) / annotations haut-bas sobres (mobile)
   ========================================================================== */
.hero-section {
  position: relative;
  width: 100%;
  height: 100svh;
  min-height: 560px;
  background-color: var(--night);
  overflow: hidden;
}

/* CALQUE 1 : Fond halo studio radial ambre/espresso feutré (pur, sans dédoublement) */
.hero-layer-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: 
    radial-gradient(ellipse 75% 55% at 50% 36%, rgba(184, 122, 82, 0.28) 0%, rgba(30, 20, 15, 0.82) 55%, var(--night) 100%),
    radial-gradient(circle at 50% 22%, rgba(227, 180, 140, 0.12) 0%, transparent 60%),
    var(--night);
  overflow: hidden;
}

.hero-studio-halo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 36%, rgba(184, 122, 82, 0.18) 0%, transparent 70%);
  pointer-events: none;
}

.hero-fallback-bg {
  display: none;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 45% 30%;
  z-index: 1;
}

/* CALQUE 2 : Cadre intérieur Book Cover & Grille technique */
.hero-frame-inset {
  position: absolute;
  inset: 16px;
  border: 1px solid rgba(184, 122, 82, 0.28);
  z-index: 2;
  pointer-events: none;
}

@media (min-width: 768px) {
  .hero-frame-inset {
    inset: 32px;
  }
}

/* Repères de coupe L-brackets aux 4 angles */
.corner-mark {
  position: absolute;
  width: 10px;
  height: 10px;
  pointer-events: none;
}

.corner-tl {
  top: -1px;
  left: -1px;
  border-top: 2px solid rgba(227, 180, 140, 0.7);
  border-left: 2px solid rgba(227, 180, 140, 0.7);
}

.corner-tr {
  top: -1px;
  right: -1px;
  border-top: 2px solid rgba(227, 180, 140, 0.7);
  border-right: 2px solid rgba(227, 180, 140, 0.7);
}

.corner-bl {
  bottom: -1px;
  left: -1px;
  border-bottom: 2px solid rgba(227, 180, 140, 0.7);
  border-left: 2px solid rgba(227, 180, 140, 0.7);
}

.corner-br {
  bottom: -1px;
  right: -1px;
  border-bottom: 2px solid rgba(227, 180, 140, 0.7);
  border-right: 2px solid rgba(227, 180, 140, 0.7);
}

/* Grille technique de fond */
.hero-grid-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.grid-col-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: rgba(184, 122, 82, 0.08);
}

/* Grille 4 colonnes mobile */
.grid-col-line.col-1 { left: 25%; }
.grid-col-line.col-2 { left: 50%; }
.grid-col-line.col-3 { left: 75%; }
.grid-col-line.col-4 { display: none; }

/* Grille 12 colonnes desktop */
@media (min-width: 768px) {
  .grid-col-line.col-1 { left: calc(100% / 12 * 1); }
  .grid-col-line.col-2 { left: calc(100% / 12 * 2); }
  .grid-col-line.col-3 { left: calc(100% / 12 * 3); }
  .grid-col-line.col-4 { display: block; left: calc(100% / 12 * 4); }
  .grid-col-line.col-5 { left: calc(100% / 12 * 5); }
  .grid-col-line.col-6 { left: calc(100% / 12 * 6); }
  .grid-col-line.col-7 { left: calc(100% / 12 * 7); }
  .grid-col-line.col-8 { left: calc(100% / 12 * 8); }
  .grid-col-line.col-9 { left: calc(100% / 12 * 9); }
  .grid-col-line.col-10 { left: calc(100% / 12 * 10); }
  .grid-col-line.col-11 { left: calc(100% / 12 * 11); }
  .grid-col-line.col-12 { display: none; }
}

.grid-row-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background-color: rgba(184, 122, 82, 0.08);
}

.grid-row-line.row-top { top: 28%; }
.grid-row-line.row-bottom { bottom: 22%; }

/* Micro-croix (+) aux intersections */
.grid-cross {
  position: absolute;
  font-family: monospace;
  font-size: 11px;
  line-height: 1;
  color: rgba(227, 180, 140, 0.35);
  transform: translate(-50%, -50%);
  user-select: none;
}

.grid-cross.cross-tl { top: 28%; left: 25%; }
.grid-cross.cross-tr { top: 28%; left: 75%; }
.grid-cross.cross-bl { bottom: 22%; left: 25%; }
.grid-cross.cross-br { bottom: 22%; left: 75%; }

@media (min-width: 768px) {
  .grid-cross.cross-tl { left: calc(100% / 12 * 2); }
  .grid-cross.cross-tr { left: calc(100% / 12 * 10); }
  .grid-cross.cross-bl { left: calc(100% / 12 * 2); }
  .grid-cross.cross-br { left: calc(100% / 12 * 10); }
}

/* Visibilité utilitaires desktop / mobile */
.desktop-only {
  display: none !important;
}

@media (min-width: 768px) {
  .desktop-only {
    display: block !important;
  }
}

.mobile-only {
  display: block !important;
}

@media (min-width: 768px) {
  .mobile-only {
    display: none !important;
  }
}

/* CALQUE 3 : Typographie géante « PORTFOLIO » + filigrane script « Creative » */
.hero-layer-word {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  user-select: none;
}

.hero-word-wrap {
  position: relative;
  width: 100%;
  text-align: center;
  padding: 0 16px;
  margin-top: -6svh;
}

@media (min-width: 768px) {
  .hero-word-wrap {
    padding: 0 32px;
    margin-top: -8vh;
  }
}

.hero-script-creative {
  position: absolute;
  top: -26px;
  left: 12%;
  font-family: var(--font-script);
  font-size: clamp(2.3rem, 8.2vw, 3.8rem);
  color: var(--copper-light);
  line-height: 1;
  z-index: 6;
  pointer-events: none;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.85);
  transform: rotate(-3deg);
  will-change: transform, opacity;
}

@media (min-width: 768px) {
  .hero-script-creative {
    top: -46px;
    left: 16%;
    font-size: clamp(3.2rem, 5.8vw, 5.8rem);
    transform: rotate(-2deg);
  }
}

.word-line {
  display: block;
  font-family: var(--font-display);
  font-weight: 800;
  text-transform: uppercase;
  background: linear-gradient(135deg, #A9724E 0%, #E3B48C 50%, #A9724E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: var(--copper-light);
  will-change: transform, opacity;
}

/* Mobile : 2 lignes empilées PORT / FOLIO */
.hero-word-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.hero-word-mobile .line-port,
.hero-word-mobile .line-folio {
  font-size: clamp(4.6rem, 23vw, 7.2rem);
  line-height: 0.83;
  letter-spacing: -0.015em;
  white-space: nowrap;
}

.hero-word-desktop {
  display: none;
}

/* Tablette & Desktop : 1 ligne pleine largeur clampée */
@media (min-width: 768px) {
  .hero-word-mobile {
    display: none;
  }

  .hero-word-desktop {
    display: block;
    width: 100%;
  }

  .hero-word-desktop .line-single {
    font-size: clamp(4.5rem, 13.6vw, 12.8rem);
    line-height: 0.9;
    letter-spacing: clamp(0.01em, 1.1vw, 0.06em);
    white-space: nowrap;
  }
}

/* CALQUE 4 : Modèle détourée kimono wax rouille (75-80% hauteur) */
.hero-layer-subject {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 78svh;
  max-height: 82svh;
  width: auto;
  z-index: 5;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  pointer-events: none;
}

.hero-layer-subject picture {
  display: block;
  height: 100%;
  width: auto;
}

.hero-cutout-img {
  display: block;
  height: 100%;
  width: auto;
  max-height: 100%;
  max-width: 96vw;
  object-fit: contain;
  object-position: bottom center;
  filter: drop-shadow(0 18px 42px rgba(0, 0, 0, 0.78));
  /* Dissolution invisible du bas du pantalon dans #0B0807 (zéro découpe nette qui flotte) */
  -webkit-mask-image: linear-gradient(to bottom, #000 84%, rgba(0,0,0,0.85) 92%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 84%, rgba(0,0,0,0.85) 92%, transparent 100%);
  will-change: transform, opacity;
}

@media (min-width: 1024px) {
  .hero-layer-subject {
    height: 76vh;
    max-height: 80vh;
  }
}

/* CALQUE 5 : Annotations éditoriales */
.hero-annotations-layer {
  position: absolute;
  inset: 16px;
  z-index: 10;
  pointer-events: none;
}

@media (min-width: 768px) {
  .hero-annotations-layer {
    inset: 32px;
  }
}

.hero-annot {
  position: absolute;
}

/* Mobile Top : Dorcas Moïra sous le header */
.annot-top-right {
  top: calc(var(--sat) + 52px);
  right: 12px;
  text-align: right;
}

.annot-top-right .annot-title {
  display: block;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--cream);
  line-height: 1.1;
}

.annot-top-right .annot-role {
  display: block;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.72rem;
  color: var(--muted);
  margin-top: 2px;
}

/* Mobile Bottom : Tagline & Scroll Cue au-dessus du bord */
.annot-bottom-right {
  bottom: calc(var(--sab) + 12px);
  left: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  pointer-events: auto;
}

.annot-mobile-quote {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(0.78rem, 2.8vw, 0.92rem);
  color: rgba(243, 230, 216, 0.88);
  line-height: 1.3;
  max-width: 90vw;
}

.hero-scroll-cue {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--cream);
  text-decoration: none;
  transition: color 0.25s ease;
}

.hero-scroll-cue:hover {
  color: var(--copper-light);
}

.hero-scroll-line {
  width: 28px;
  height: 1px;
  background: linear-gradient(to right, var(--copper), transparent);
  transition: width 0.3s ease;
}

.hero-scroll-cue:hover .hero-scroll-line {
  width: 44px;
}

/* Tablette & Desktop : 4 Coins Éditoriaux */
@media (min-width: 768px) {
  /* Angle Haut-Gauche */
  .annot-top-left {
    top: 24px;
    left: 24px;
    text-align: left;
    max-width: 320px;
  }

  .annot-top-left .annot-script {
    display: block;
    font-family: var(--font-script);
    font-size: 1.65rem;
    color: var(--copper-light);
    line-height: 1;
    margin-bottom: 4px;
  }

  .annot-top-left .annot-quote {
    display: block;
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 0.88rem;
    color: var(--cream);
    line-height: 1.4;
  }

  /* Angle Haut-Droit */
  .annot-top-right {
    top: 24px;
    right: 24px;
    text-align: right;
  }

  .annot-top-right .annot-title {
    font-family: var(--font-script);
    font-size: 1.85rem;
    font-weight: normal;
    text-transform: none;
    color: var(--copper-light);
    line-height: 1;
    margin-bottom: 2px;
  }

  .annot-top-right .annot-role {
    font-family: var(--font-display);
    font-size: 0.72rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
    font-style: normal;
  }

  /* Angle Bas-Gauche */
  .annot-bottom-left {
    bottom: 24px;
    left: 24px;
    text-align: left;
  }

  .annot-bottom-left .annot-num {
    display: block;
    font-family: var(--font-display);
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--cream);
    margin-bottom: 3px;
  }

  .annot-bottom-left .annot-edition {
    display: block;
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 0.82rem;
    color: var(--copper-light);
  }

  /* Angle Bas-Droit */
  .annot-bottom-right {
    bottom: 24px;
    right: 24px;
    left: auto;
    text-align: right;
    align-items: flex-end;
  }

  .annot-bottom-right .annot-city {
    font-family: var(--font-display);
    font-size: 0.75rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
    display: block;
    margin-bottom: 6px;
  }
}

/* Fallback si hero-cutout échoue */
.hero-section.hero-fallback-active .hero-fallback-bg {
  display: block;
}

.hero-section.hero-fallback-active .hero-layer-subject {
  display: none;
}

.hero-section.hero-fallback-active .hero-layer-word {
  z-index: 10;
}

'''

css = re.sub(hero_pattern, new_hero_css, css, flags=re.DOTALL)

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated css/style.css successfully')
