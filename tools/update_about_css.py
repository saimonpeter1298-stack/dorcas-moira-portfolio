import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace old directions pills & dna cards
old_about_extra_pattern = r'\.subhead-label\s*\{.*?(?=/\* =+\s*COMP CARD)'

new_about_double_page_css = '''/* ==========================================================================
   WHO IS MOÏRA ? DOUBLE PAGE ÉDITORIALE HAUTE COUTURE (AWWWARDS)
   1. SIGNATURE BIO & ORIGINE
   2. INDEX ÉDITORIAL (Directions Artistiques)
   3. MANIFESTE TYPOGRAPHIQUE (Model ADN avec ScrollTrigger & Inline Images)
   ========================================================================== */

/* Signature éditoriale sous la bio */
.about-quote-signoff {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.signoff-rule {
  width: 48px;
  height: 1px;
  background: var(--copper);
  margin-bottom: 8px;
}

.signoff-signature {
  font-family: var(--font-script);
  font-size: 2.2rem;
  color: var(--copper-light);
  line-height: 1;
}

.signoff-origin {
  font-family: var(--font-display);
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted);
}

/* Conteneur Double Page */
.editorial-double-spread {
  margin-top: clamp(60px, 12vh, 130px);
  display: flex;
  flex-direction: column;
  gap: clamp(70px, 14vh, 150px);
  position: relative;
}

.editorial-block-header {
  margin-bottom: clamp(20px, 4vh, 36px);
}

.editorial-kicker {
  font-family: var(--font-display);
  font-size: clamp(0.72rem, 1.4vw, 0.85rem);
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--copper);
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
}

.editorial-block-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 4.2vw, 2.6rem);
  font-weight: 700;
  color: var(--cream);
  letter-spacing: 0.04em;
  line-height: 1.1;
  text-transform: uppercase;
}

/* ==========================================================================
   1. DIRECTIONS ARTISTIQUES → INDEX ÉDITORIAL (SOMMAIRE DE LUXE)
   ========================================================================== */
.editorial-index-block {
  position: relative;
  width: 100%;
}

/* Floating cursor image reveal sur desktop */
.editorial-cursor-reveal {
  display: none;
}

@media (min-width: 1024px) {
  .editorial-cursor-reveal {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    height: 312px;
    aspect-ratio: 4/5;
    pointer-events: none;
    z-index: 900;
    overflow: hidden;
    border-radius: 4px;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8) rotate(-3deg);
    transition: opacity 0.35s ease, transform 0.4s var(--ease-waw);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.85);
    border: 1px solid rgba(184, 122, 82, 0.45);
  }

  .editorial-cursor-reveal.is-active {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotate(-1.5deg);
  }

  .cursor-reveal-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: opacity 0.25s ease, transform 0.6s var(--ease-waw);
  }
}

.editorial-index-list {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.editorial-index-row {
  position: relative;
  width: 100%;
  transition: opacity 0.35s ease;
}

/* Quand une ligne est survolée, les autres s'atténuent à 30% sur desktop */
@media (min-width: 1024px) {
  .editorial-index-list.is-hovering .editorial-index-row:not(.is-active-hover) {
    opacity: 0.3;
  }
}

.editorial-row-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: baseline;
  gap: clamp(14px, 2.5vw, 36px);
  padding: clamp(20px, 3.6vh, 36px) 0;
  text-decoration: none;
  color: inherit;
  width: 100%;
  cursor: pointer;
}

.editorial-row-header .row-num {
  font-family: var(--font-display);
  font-size: clamp(0.95rem, 1.8vw, 1.35rem);
  font-weight: 600;
  color: var(--copper);
  letter-spacing: 0.16em;
  min-width: 30px;
}

.editorial-row-header .row-title {
  font-family: var(--font-display);
  font-size: clamp(1.95rem, 8vw, 5.2rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.015em;
  color: var(--cream);
  text-transform: uppercase;
  transition: color 0.3s ease;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.2em;
  align-items: baseline;
}

.editorial-row-header .row-title .title-accent {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  text-transform: none;
  color: var(--copper-light);
  letter-spacing: normal;
}

/* Au survol desktop : passage en dégradé cuivre */
@media (min-width: 1024px) {
  .editorial-index-row:hover .row-title,
  .editorial-index-row.is-active-hover .row-title {
    background: linear-gradient(135deg, #A9724E 0%, #E3B48C 50%, #A9724E 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.editorial-row-header .row-arrow {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.8vw, 2.4rem);
  color: var(--copper);
  transition: transform 0.4s var(--ease-waw), color 0.3s ease;
  display: inline-block;
  opacity: 0.85;
}

.editorial-index-row:hover .row-arrow {
  transform: translate(6px, -6px) rotate(45deg);
  color: var(--cream);
  opacity: 1;
}

/* Filet cuivre 1px séparateur qui se trace de gauche à droite */
.row-separator-track {
  width: 100%;
  height: 1px;
  background: rgba(184, 122, 82, 0.12);
  position: relative;
  overflow: hidden;
}

.row-separator-line {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(184, 122, 82, 0.5), rgba(227, 180, 140, 0.85) 45%, rgba(184, 122, 82, 0.2));
  transform-origin: left;
  transform: scaleX(1);
  transition: transform 0.8s var(--ease-waw);
}

/* Accordéon Mobile */
.row-accordion-drawer {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.45s var(--ease-waw), opacity 0.35s ease, margin 0.35s ease;
}

.editorial-index-row.is-open .row-accordion-drawer {
  max-height: 580px;
  opacity: 1;
  margin: 16px 0 24px;
}

.editorial-index-row.is-open .row-arrow {
  transform: rotate(90deg);
  color: var(--copper-light);
}

.accordion-drawer-inner {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 4px 10px;
}

.accordion-media-frame {
  aspect-ratio: 4/5;
  width: 100%;
  max-width: 320px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(184, 122, 82, 0.4);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.65);
}

.accordion-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.accordion-caption {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.95rem;
  color: rgba(243, 230, 216, 0.9);
  line-height: 1.5;
  max-width: 320px;
}

.accordion-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-size: 0.74rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--copper-light);
  text-decoration: none;
  font-weight: 600;
  transition: color var(--transition-fast);
}

.accordion-cta:hover {
  color: var(--cream);
}

@media (min-width: 1024px) {
  .row-accordion-drawer {
    display: none !important;
  }
}

/* ==========================================================================
   2. MODEL ADN → MANIFESTE TYPOGRAPHIQUE (CITATION DE MAGAZINE GÉANTE)
   ========================================================================== */
.model-dna-manifesto-block {
  position: relative;
  width: 100%;
  padding-top: clamp(20px, 4vh, 40px);
}

.dna-manifesto-quote-wrap {
  position: relative;
  width: 100%;
}

.dna-manifesto-quote {
  font-size: clamp(2.2rem, 7.8vw, 5.8rem);
  line-height: 1.06;
  letter-spacing: -0.015em;
  margin: 0;
  padding: 0;
  word-break: normal;
  overflow-wrap: break-word;
}

/* Remplissage au scroll : état initial crème à 15% */
.dna-word {
  display: inline;
  color: rgba(243, 230, 216, 0.15);
  transition: color 0.3s ease, opacity 0.3s ease;
  will-change: color, opacity;
}

.dna-word.sans-bold {
  font-family: var(--font-display);
  font-weight: 700;
  text-transform: uppercase;
}

.dna-word.serif-italic {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  text-transform: none;
}

/* État rempli en dégradé cuivre */
.dna-word.is-filled {
  color: transparent !important;
  background: linear-gradient(135deg, #E3B48C 0%, #B87A52 50%, #E3B48C 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Photos inline directement insérées dans le flux de texte */
.dna-inline-badge {
  display: inline-block;
  vertical-align: middle;
  height: 0.88em;
  width: 1.45em;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(227, 180, 140, 0.65);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
  margin: 0 0.16em;
  transform: translateY(-0.06em);
  transition: transform 0.35s var(--ease-waw), border-color 0.3s ease;
}

.dna-inline-badge:hover {
  transform: translateY(-0.06em) scale(1.1);
  border-color: var(--copper-light);
}

.dna-inline-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 25%;
  display: block;
}

/* Séparateurs ✦ petits, cuivre, en rotation continue */
.dna-star {
  display: inline-block;
  font-size: 0.46em;
  color: var(--copper-light);
  vertical-align: middle;
  margin: 0 0.26em;
  animation: spinStar 16s linear infinite;
  transform-origin: center;
  will-change: transform;
}

@keyframes spinStar {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .dna-star {
    animation: none;
  }
  .dna-word {
    color: var(--copper-light) !important;
  }
}

'''

css = re.sub(old_about_extra_pattern, new_about_double_page_css, css, flags=re.DOTALL)

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated css/style.css with Magazine Double Page styles')
