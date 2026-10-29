import re

with open('js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

pattern = re.compile(
    r'function triggerHeroSequence\(\)\s*\{.*?(?=/\*\*\s*\*\s*Mosaïque visuelle)',
    re.DOTALL
)

new_func = """function triggerHeroSequence() {
  if (typeof gsap === 'undefined') return;

  const easeWaw = 'power3.out';
  const tl = gsap.timeline({ defaults: { ease: easeWaw } });

  // 1. Halo qui s'allume
  tl.from('#heroLayerBg', {
    opacity: 0,
    duration: 0.8
  }, 0.05)
  // 2. « MOÏRA » qui monte en fondu
  .from('#heroLayerPortfolio', {
    y: 40,
    opacity: 0,
    duration: 1.0
  }, 0.2)
  // 3. Modèle qui apparaît avec léger zoom 1.05 -> 1
  .from('#heroCutoutImg', {
    scale: 1.05,
    opacity: 0,
    duration: 1.15
  }, 0.35)
  // 4. Badge Miss Gabon Maroc
  .from('#heroTopBadge', {
    y: -15,
    opacity: 0,
    duration: 0.6
  }, 0.55)
  // 5. Bloc texte qui arrive en cascade sobre
  .from('.hero-script-creative', {
    x: -25,
    opacity: 0,
    duration: 0.75
  }, 0.65)
  .from('.hero-model-name', {
    y: 18,
    opacity: 0,
    duration: 0.7
  }, 0.75)
  .from('.hero-tagline', {
    y: 14,
    opacity: 0,
    duration: 0.65
  }, 0.85)
  .from('.hero-scroll-cue', {
    y: 10,
    opacity: 0,
    duration: 0.6
  }, 0.95);

  // Parallaxe différencié au scroll (le mot descend moins vite que la modèle)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const wordElem = document.getElementById('heroLayerPortfolio');
      const subjectElem = document.getElementById('heroLayerSubject');

      if (scrollY < window.innerHeight) {
        if (wordElem) {
          wordElem.style.transform = `translate(-50%, ${scrollY * 0.12}px)`;
        }
        if (subjectElem) {
          subjectElem.style.transform = `translate(-50%, ${scrollY * 0.22}px)`;
        }
      }
    }, { passive: true });
  }
}

"""

if pattern.search(js):
    js = pattern.sub(new_func, js, count=1)
    print("Updated triggerHeroSequence in js/main.js successfully")
else:
    print("Warning: triggerHeroSequence pattern not matched!")

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
