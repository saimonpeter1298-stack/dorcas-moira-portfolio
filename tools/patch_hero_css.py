import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

hero_css_pattern = re.compile(
    r'/\* ==========================================================================\s*HERO :.*?(?=/\* ==========================================================================\s*MANIFESTE|\.manifesto-section)',
    re.DOTALL
)

new_hero_css = """/* ==========================================================================
   HERO : ÉDITORIAL HAUTE COUTURE (REFONTE AWWWARDS MOBILE-FIRST)
   Palette : #0B0807, #1E140F, #B87A52, #E3B48C, #F3E6D8, #9C8A7C
   Zéro forme parasite, zéro masque découpe en dur, silhouette 75% hauteur
   ========================================================================== */
.hero-section {
  position: relative;
  width: 100%;
  height: 100svh;
  min-height: 580px;
  background-color: var(--night);
  overflow: hidden;
}

/* CALQUE 1 : Fond halo studio pur (radial ambre/espresso feutré, sans image dédoublée) */
.hero-layer-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: 
    radial-gradient(ellipse 75% 55% at 50% 36%, rgba(184, 122, 82, 0.28) 0%, rgba(30, 20, 15, 0.85) 55%, var(--night) 100%),
    radial-gradient(circle at 50% 20%, rgba(227, 180, 140, 0.15) 0%, transparent 60%),
    var(--night);
  overflow: hidden;
}

.hero-studio-halo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 36%, rgba(184, 122, 82, 0.22) 0%, transparent 70%);
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

/* CALQUE 2 : Mot géant « MOÏRA » en dégradé cuivre 100% (non tronqué) */
.hero-layer-word {
  position: absolute;
  top: 13svh;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  z-index: 2;
  user-select: none;
  pointer-events: none;
  line-height: 0.88;
}

.hero-word-moira {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(3.2rem, 18.2vw, 13.5rem);
  letter-spacing: clamp(0.015em, 1.2vw, 0.07em);
  text-transform: uppercase;
  white-space: nowrap;
  background: linear-gradient(135deg, #A9724E 0%, #E3B48C 50%, #A9724E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: var(--copper-light);
  will-change: transform, opacity;
}

/* CALQUE 3 : Modèle détourée (75% hauteur d'écran, centrée, ancrée en bas) */
.hero-layer-subject {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 75svh;
  max-height: 78svh;
  width: auto;
  z-index: 5;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  pointer-events: none;
}

.hero-cutout-img {
  height: 100%;
  width: auto;
  max-width: 96vw;
  object-fit: contain;
  object-position: bottom center;
  filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.65));
  will-change: transform, opacity;
}

/* CALQUE 4 : Badge Miss Gabon Maroc (en haut à gauche, sous le header, jamais sur le corps) */
.hero-top-badge {
  position: absolute;
  top: calc(var(--sat) + 68px);
  left: var(--space-sm);
  z-index: 12;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(30, 20, 15, 0.88);
  border: 1px solid rgba(184, 122, 82, 0.55);
  border-radius: 30px;
  padding: 5px 12px;
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cream);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  width: fit-content;
}

.hero-top-badge .pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--copper-light);
  box-shadow: 0 0 8px var(--copper-light);
  animation: pulseDot 2s infinite;
}

/* CALQUE 5 : Dégradé de lisibilité (couvre uniquement les ~26% inférieurs, zone des poches du kimono) */
.hero-bottom-scrim {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 27svh;
  min-height: 170px;
  max-height: 230px;
  background: linear-gradient(to top, var(--night) 0%, rgba(11, 8, 7, 0.95) 55%, rgba(11, 8, 7, 0.4) 85%, transparent 100%);
  z-index: 8;
  pointer-events: none;
}

/* Bloc texte sobre en bas à gauche */
.hero-layer-foreground {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  padding: 0 var(--space-sm) calc(var(--sab) + 18px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.hero-script-creative {
  font-family: var(--font-script);
  font-size: clamp(2rem, 7vw, 3.4rem);
  line-height: 0.95;
  color: var(--copper-light);
  margin-left: -3px;
  margin-bottom: 2px;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.85);
}

.hero-model-name {
  font-family: var(--font-display);
  font-size: clamp(1rem, 3.8vw, 1.35rem);
  font-weight: 600;
  letter-spacing: 0.28em;
  line-height: 1.1;
  text-transform: uppercase;
  color: var(--cream);
  margin-bottom: 5px;
}

.hero-tagline {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(0.82rem, 2.9vw, 1rem);
  color: rgba(243, 230, 216, 0.9);
  line-height: 1.3;
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90vw;
}

.hero-scroll-cue {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.25s ease;
}

.hero-scroll-cue:hover {
  color: var(--copper-light);
}

.hero-scroll-line {
  width: 30px;
  height: 1px;
  background: linear-gradient(to right, var(--copper), transparent);
  transition: width 0.3s ease;
}

.hero-scroll-cue:hover .hero-scroll-line {
  width: 44px;
}

/* --- TABLETTE & DESKTOP --- */
@media (min-width: 768px) {
  .hero-top-badge {
    left: var(--space-md);
    top: calc(var(--sat) + 76px);
  }

  .hero-layer-word {
    top: 12svh;
  }

  .hero-layer-subject {
    height: 78svh;
  }

  .hero-layer-foreground {
    padding: 0 var(--space-md) calc(var(--sab) + 24px);
  }
}

@media (min-width: 1024px) {
  .hero-top-badge {
    left: clamp(32px, 5vw, 80px);
    top: 92px;
  }

  .hero-layer-word {
    top: 10vh;
  }

  .hero-layer-subject {
    height: 82vh;
    max-height: 86vh;
    left: 50%;
  }

  /* Sur desktop, le bloc texte est placé à gauche, à côté de la silhouette */
  .hero-bottom-scrim {
    width: 45%;
    height: 38vh;
    background: linear-gradient(to top right, var(--night) 0%, rgba(11, 8, 7, 0.9) 60%, transparent 100%);
  }

  .hero-layer-foreground {
    bottom: 8vh;
    left: clamp(32px, 5vw, 80px);
    width: auto;
    max-width: 420px;
    padding: 0;
  }

  .hero-tagline {
    white-space: normal;
    max-width: 380px;
  }
}

/* --- FALLBACK OBLIGATOIRE (Si hero-cutout échoue) --- */
.hero-section.hero-fallback-active .hero-fallback-bg {
  display: block;
}

.hero-section.hero-fallback-active .hero-layer-subject {
  display: none;
}

.hero-section.hero-fallback-active .hero-layer-word {
  top: calc(var(--sat) + 74px);
  z-index: 10;
}

.hero-section.hero-fallback-active .hero-word-moira {
  font-size: clamp(2.6rem, 11vw, 5.5rem);
}

.hero-section.hero-fallback-active .hero-bottom-scrim {
  display: block;
  width: 100%;
  height: 38vh;
}

"""

if hero_css_pattern.search(css):
    css = hero_css_pattern.sub(new_hero_css, css, count=1)
    print("Replaced Hero CSS section successfully!")
else:
    print("Error: Pattern still not found!")

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)
