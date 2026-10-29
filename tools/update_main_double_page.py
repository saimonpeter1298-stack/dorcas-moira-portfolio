import re

with open('js/main.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add I18N keys for French
fr_desc_keys = '''    dir_desc_1: "Silhouettes audacieuses, pagnes revisités et jeux de contrastes pour les séries mode haute couture.",
    dir_desc_2: "Spontanéité solaire, allure urbaine et matières nobles pour le prêt-à-porter contemporain.",
    dir_desc_3: "Lumière feutrée, intensité du regard et présence sculpturale au service de la beauté pure.",
    dir_desc_4: "Énergie magnétique, port de tête altier et valorisation immédiate des pièces clés de marques.",
    dir_desc_5: "Fluidité du mouvement, drapés en apesanteur et narration vivante pour films de mode et digital.",
    label_directions: "Directions Artistiques",'''

code = code.replace('    label_directions: "Directions Artistiques",', fr_desc_keys, 1)

# 2. Add I18N keys for English
en_desc_keys = '''    dir_desc_1: "Bold silhouettes, modern heritage weaves, and striking contrasts for high-fashion spreads.",
    dir_desc_2: "Sun-drenched spontaneity, natural textures, and urban chic for contemporary ready-to-wear.",
    dir_desc_3: "Masterful studio lighting, commanding gaze, and sculptural poise before the lens.",
    dir_desc_4: "Magnetic energy and high-end garment desirability for flagship brand campaigns.",
    dir_desc_5: "Kinetic grace, drape fluidity, and living rhythm for brand films and digital storytelling.",
    label_directions: "Artistic Directions",'''

code = code.replace('    label_directions: "Artistic Directions",', en_desc_keys, 1)

# 3. Add initEditorialDoublePage before initVisualMosaic
func_def = '''/**
 * Double Page Magazine : Index Éditorial (Directions) & Manifeste Typographique (Model ADN)
 */
function initEditorialDoublePage() {
  const indexList = document.getElementById('editorialIndexList');
  const cursorReveal = document.getElementById('editorialCursorReveal');
  const cursorImg = document.getElementById('cursorRevealImg');
  const rows = document.querySelectorAll('.editorial-index-row');
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  // 1. Floating cursor image reveal sur Desktop (>= 1024px)
  if (indexList && cursorReveal && cursorImg && !isTouchDevice && window.innerWidth >= 1024) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isTracking = false;

    function updateCursorPos() {
      if (!isTracking) return;
      currentX += (mouseX - currentX) * 0.16;
      currentY += (mouseY - currentY) * 0.16;
      cursorReveal.style.left = `${currentX}px`;
      cursorReveal.style.top = `${currentY}px`;
      requestAnimationFrame(updateCursorPos);
    }

    indexList.addEventListener('mouseenter', () => {
      indexList.classList.add('is-hovering');
      isTracking = true;
      requestAnimationFrame(updateCursorPos);
    });

    indexList.addEventListener('mouseleave', () => {
      indexList.classList.remove('is-hovering');
      cursorReveal.classList.remove('is-active');
      rows.forEach(r => r.classList.remove('is-active-hover'));
      isTracking = false;
    });

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    rows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        const imgSrc = row.getAttribute('data-img');
        if (imgSrc) {
          cursorImg.src = imgSrc;
        }
        cursorReveal.classList.add('is-active');
        rows.forEach(r => r.classList.remove('is-active-hover'));
        row.classList.add('is-active-hover');
      });
    });
  }

  // 2. Accordéon Mobile (au tap sur .editorial-row-header)
  rows.forEach(row => {
    const header = row.querySelector('.editorial-row-header');
    if (!header) return;

    header.addEventListener('click', (e) => {
      // Sur mobile & tablette (< 1024px), le tap ouvre l'accordéon
      if (window.innerWidth < 1024) {
        e.preventDefault();
        const wasOpen = row.classList.contains('is-open');

        // Fermer les autres (un seul accordéon ouvert à la fois)
        rows.forEach(r => {
          r.classList.remove('is-open');
          const h = r.querySelector('.editorial-row-header');
          if (h) h.setAttribute('aria-expanded', 'false');
        });

        if (!wasOpen) {
          row.classList.add('is-open');
          header.setAttribute('aria-expanded', 'true');
        }
      }
    });
  });

  // 3. Liaison vers les filtres de la galerie
  const filterLinks = document.querySelectorAll('[data-filter-link]');
  filterLinks.forEach(link => {
    link.addEventListener('click', () => {
      const filterVal = link.getAttribute('data-filter-link');
      if (!filterVal) return;

      const targetBtn = document.querySelector(`#mosaicFilterBar .filter-btn[data-filter="${filterVal}"]`);
      if (targetBtn) {
        targetBtn.click();
      }
    });
  });

  // 4. Tracé des filets 1px au scroll (GSAP ScrollTrigger)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      gsap.from('.row-separator-line', {
        scaleX: 0,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#editorialIndexList',
          start: 'top 85%',
          once: true
        }
      });

      // 5. Remplissage des mots de l'ADN au scroll (ScrollTrigger Scrub)
      const words = gsap.utils.toArray('.dna-word');
      if (words.length > 0) {
        ScrollTrigger.create({
          trigger: '#dnaManifestoQuote',
          start: 'top 78%',
          end: 'bottom 45%',
          scrub: 0.8,
          onUpdate: (self) => {
            const progress = self.progress;
            const total = words.length;
            words.forEach((w, idx) => {
              const threshold = (idx + 0.35) / total;
              if (progress >= threshold) {
                w.classList.add('is-filled');
              } else {
                w.classList.remove('is-filled');
              }
            });
          }
        });
      }
    } else {
      document.querySelectorAll('.dna-word').forEach(w => w.classList.add('is-filled'));
    }
  } else {
    document.querySelectorAll('.dna-word').forEach(w => w.classList.add('is-filled'));
  }
}

'''

code = code.replace('/**\n * Mosaïque visuelle (Chapitre 06) et filtres\n */', func_def + '/**\n * Mosaïque visuelle (Chapitre 06) et filtres\n */', 1)

# 4. Call initEditorialDoublePage in init()
init_call = '''    initEditorialDoublePage();
    initVisualMosaic();'''

code = code.replace('    initVisualMosaic();', init_call, 1)

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated js/main.js with initEditorialDoublePage')
