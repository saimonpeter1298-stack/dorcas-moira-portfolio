import re

with open('js/main.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace triggerHeroSequence
old_hero_seq_pattern = r'/\*\*\s*\* Séquence d\'entrée Awwwards du Hero.*?(?=/\*\*\s*\* Mosaïque visuelle)'

new_hero_seq = '''/**
 * Séquence d'entrée Awwwards du Hero & Grille Éditoriale (GSAP Timeline)
 */
function triggerHeroSequence() {
  if (typeof gsap === 'undefined') return;

  const easeWaw = 'power3.out';
  const tl = gsap.timeline({ defaults: { ease: easeWaw } });

  // 1. Grille technique et cadre intérieur
  tl.from('#heroFrameInset', {
    opacity: 0,
    scale: 0.985,
    duration: 0.85
  }, 0.05)
  .from('.grid-col-line, .grid-row-line, .grid-cross', {
    opacity: 0,
    stagger: 0.03,
    duration: 0.7
  }, 0.15)
  // 2. Halo ambre feutré qui s'allume
  .from('#heroLayerBg', {
    opacity: 0,
    duration: 0.9
  }, 0.2)
  // 3. « PORTFOLIO » qui monte (lignes mobiles ou ligne desktop)
  .from('.hero-word-mobile .word-line, .hero-word-desktop .word-line', {
    y: 35,
    opacity: 0,
    stagger: 0.1,
    duration: 0.95
  }, 0.35)
  // 4. Dorcas qui apparaît (fondu + subtil zoom 1.04 -> 1)
  .from('#heroCutoutImg', {
    scale: 1.04,
    opacity: 0,
    duration: 1.15
  }, 0.5)
  // 5. Script « Creative » qui apparaît
  .from('.hero-script-creative', {
    x: -20,
    opacity: 0,
    duration: 0.75
  }, 0.7)
  // 6. Annotations éditoriales aux coins
  .from('.hero-annot', {
    y: 12,
    opacity: 0,
    stagger: 0.08,
    duration: 0.65
  }, 0.85);

  // Parallaxe différencié au scroll (grille & mot plus lents que le modèle)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    const frameElem = document.getElementById('heroFrameInset');
    const wordElem = document.getElementById('heroLayerPortfolio');
    const subjectElem = document.getElementById('heroLayerSubject');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        if (frameElem) frameElem.style.transform = `translateY(${scrollY * 0.06}px)`;
        if (wordElem) wordElem.style.transform = `translateY(${scrollY * 0.12}px)`;
        if (subjectElem) subjectElem.style.transform = `translate(-50%, ${scrollY * 0.22}px)`;
      }
    }, { passive: true });
  }
}

'''

code = re.sub(old_hero_seq_pattern, new_hero_seq, code, flags=re.DOTALL)

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated js/main.js successfully')
