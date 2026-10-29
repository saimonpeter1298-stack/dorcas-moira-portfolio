import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Update mobile-sticky-cta in style.css so it is hidden on desktop
css = re.sub(
    r'\.mobile-sticky-cta\s*\{',
    '@media (min-width: 768px) {\n  .mobile-sticky-cta {\n    display: none !important;\n  }\n}\n\n.mobile-sticky-cta {',
    css
)

# Update hero-layer-word and hero-word-wrap in style.css
old_word_pattern = r'/\* CALQUE 3 : Typographie géante « PORTFOLIO ».*?(?=/\* CALQUE 4 : Modèle détourée)'

new_word_css = '''/* CALQUE 3 : Typographie géante « PORTFOLIO » + filigrane script « Creative » */
.hero-layer-word {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  pointer-events: none;
  user-select: none;
}

.hero-word-wrap {
  position: relative;
  width: 100%;
  text-align: center;
  padding: 0 16px;
  margin-top: calc(var(--sat) + 85px);
}

@media (min-width: 768px) {
  .hero-word-wrap {
    padding: 0 32px;
    margin-top: 14vh;
  }
}

@media (min-width: 1024px) {
  .hero-word-wrap {
    margin-top: 13vh;
  }
}

.hero-script-creative {
  position: absolute;
  top: -24px;
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
    top: -44px;
    left: 17%;
    font-size: clamp(3.2rem, 5.8vw, 5.8rem);
    transform: rotate(-2.5deg);
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
  font-size: clamp(4.4rem, 22.5vw, 6.8rem);
  line-height: 0.82;
  letter-spacing: -0.018em;
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
    font-size: clamp(4.5rem, 13.5vw, 12.5rem);
    line-height: 0.9;
    letter-spacing: clamp(0.01em, 1.1vw, 0.06em);
    white-space: nowrap;
  }
}

'''

css = re.sub(old_word_pattern, new_word_css, css, flags=re.DOTALL)

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated css/style.css with refined hero-layer-word positioning')
