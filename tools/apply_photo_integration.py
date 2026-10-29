#!/usr/bin/env python3
"""
tools/apply_photo_integration.py
Applies integration of new HD photos into js/data.js, index.html, and css/style.css
"""

import re
import os

def update_data_js():
    path = "js/data.js"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. 01-signature-02
    content = re.sub(
        r'\{\s*id:\s*"01-signature-02"[\s\S]*?placeholder:\s*true[\s\S]*?\}',
        '''{
          id: "01-signature-02",
          titleFr: "Portrait N&B Demi-Visage & Afro",
          titleEn: "Half-Face B&W Portrait & Afro",
          category: "editorial",
          credit: null,
          src: "assets/images/01-signature-02.jpg",
          alt: "Dorcas Moïra portrait noir et blanc demi-visage afro fond gris",
          ratio: "4/5",
          focus: "50% 25%",
          placeholder: false,
          captionFr: "Portrait N&B Demi-Visage & Afro",
          captionEn: "B&W Half-Face Editorial & Afro"
        }''',
        content
    )

    # 2. 02-many-moods-03
    content = re.sub(
        r'\{\s*id:\s*"02-many-moods-03"[\s\S]*?placeholder:\s*true[\s\S]*?\}',
        '''{
          id: "02-many-moods-03",
          titleFr: "Trench Bicolore Beige & Camel",
          titleEn: "Two-Tone Beige & Camel Trench",
          category: "lifestyle",
          credit: null,
          src: "assets/images/02-many-moods-03.jpg",
          alt: "Dorcas Moïra trench bicolore beige et camel contre table sac à franges",
          ratio: "4/5",
          focus: "50% 25%",
          placeholder: false,
          captionFr: "Trench Bicolore Beige & Sac à Franges",
          captionEn: "Two-Tone Trench & Fringe Bag"
        }''',
        content
    )

    # 3. 02-many-moods-04
    content = re.sub(
        r'\{\s*id:\s*"02-many-moods-04"[\s\S]*?placeholder:\s*true[\s\S]*?\}',
        '''{
          id: "02-many-moods-04",
          titleFr: "Trench Beige & Chaise Orange",
          titleEn: "Beige Trench & Orange Chair",
          category: "lifestyle",
          credit: null,
          src: "assets/images/02-many-moods-04.jpg",
          alt: "Dorcas Moïra trench beige assise sur chaise orange regard caméra",
          ratio: "4/5",
          focus: "50% 30%",
          placeholder: false,
          captionFr: "Trench Beige sur Chaise Orange",
          captionEn: "Beige Trench on Orange Chair"
        }''',
        content
    )

    # 4. 03-afro-chic-02
    content = re.sub(
        r'\{\s*id:\s*"03-afro-chic-02"[\s\S]*?placeholder:\s*true[\s\S]*?\}',
        '''{
          id: "03-afro-chic-02",
          titleFr: "Kimono Wax & Sourire Solaire",
          titleEn: "Wax Kimono & Radiant Smile",
          category: "heritage",
          credit: null,
          src: "assets/images/03-afro-chic-02.jpg",
          alt: "Dorcas Moïra kimono wax rouille souriante",
          ratio: "4/5",
          focus: "50% 25%",
          placeholder: false,
          captionFr: "Kimono Wax Rouille & Sourire",
          captionEn: "Rust Wax Kimono & Radiant Smile"
        }''',
        content
    )

    # 5. 03-afro-chic-03
    content = re.sub(
        r'\{\s*id:\s*"03-afro-chic-03"[\s\S]*?placeholder:\s*true[\s\S]*?\}',
        '''{
          id: "03-afro-chic-03",
          titleFr: "Robe Blanche Spirale & Tresses",
          titleEn: "White Spiral Dress & Braids",
          category: "heritage",
          credit: null,
          src: "assets/images/03-afro-chic-03.jpg",
          alt: "Dorcas Moïra robe blanche à cordons en spirale et tresses regard par-dessus l'épaule",
          ratio: "4/5",
          focus: "50% 25%",
          placeholder: false,
          captionFr: "Robe Blanche Spirale & Tresses",
          captionEn: "White Spiral Dress & Braids"
        }''',
        content
    )

    # 6. 04-studio-01
    content = re.sub(
        r'\{\s*id:\s*"04-studio-01"[\s\S]*?placeholder:\s*true[\s\S]*?\}',
        '''{
          id: "04-studio-01",
          titleFr: "Denim & Boucle d'Oreille Solaire",
          titleEn: "Denim Jacket & Orange Earring",
          category: "studio",
          credit: null,
          src: "assets/images/04-studio-01.jpg",
          alt: "Dorcas Moïra veste en jean N&B et boucle d'oreille orange en couleur",
          ratio: "4/5",
          focus: "50% 30%",
          placeholder: false,
          captionFr: "Veste Denim & Boucle Orange",
          captionEn: "Denim & Orange Statement Earring"
        }''',
        content
    )

    # 7. 05-sun-kissed-02
    content = re.sub(
        r'\{\s*id:\s*"05-sun-kissed-02"[\s\S]*?placeholder:\s*true[\s\S]*?\}',
        '''{
          id: "05-sun-kissed-02",
          titleFr: "Drapé Blanc & Bateau",
          titleEn: "White Drape & Seaside Boat",
          category: "nocturne",
          credit: "KeyFilm Photographie",
          src: "assets/images/05-sun-kissed-02.jpg",
          alt: "Dorcas Moïra drapé blanc corde contre un bateau",
          ratio: "4/5",
          focus: "50% 30%",
          placeholder: false,
          captionFr: "Drapé Blanc Corde & Bateau",
          captionEn: "White Drape & Nautical Mood"
        }''',
        content
    )

    # 8. 05-sun-kissed-03
    content = re.sub(
        r'\{\s*id:\s*"05-sun-kissed-03"[\s\S]*?placeholder:\s*true[\s\S]*?\}',
        '''{
          id: "05-sun-kissed-03",
          titleFr: "Drapé Blanc & Mouvement de Danse",
          titleEn: "White Drape & Kinetic Dance",
          category: "nocturne",
          credit: "KeyFilm Photographie",
          src: "assets/images/05-sun-kissed-03.jpg",
          alt: "Dorcas Moïra drapé blanc en mouvement de danse",
          ratio: "4/5",
          focus: "50% 25%",
          placeholder: false,
          captionFr: "Drapé Blanc & Mouvement de Danse",
          captionEn: "White Drape & Flowing Dance"
        }''',
        content
    )

    # 9. 06-visual-01
    content = re.sub(
        r'(\{\s*id:\s*`06-visual-\$\{pad\}`[\s\S]*?placeholder:)\s*true',
        r'\1 (idx === 0 ? false : true)',
        content
    )

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[OK] Updated js/data.js")

def update_index_html():
    path = "index.html"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update 01-signature-02 carousel card
    content = re.sub(
        r'<div class="carousel-card" data-lightbox="01-signature-02"[\s\S]*?</div>\s*</div>\s*</div>',
        '''<div class="carousel-card" data-lightbox="01-signature-02" data-placeholder="false" data-caption="Portrait N&B Demi-Visage & Afro">
            <div class="carousel-card-media">
              <picture>
                <source type="image/avif" srcset="assets/images/01-signature-02-640w.avif 640w, assets/images/01-signature-02-1080w.avif 1080w, assets/images/01-signature-02.avif 1129w" sizes="(max-width: 768px) 85vw, 400px">
                <source type="image/webp" srcset="assets/images/01-signature-02-640w.webp 640w, assets/images/01-signature-02-1080w.webp 1080w, assets/images/01-signature-02.webp 1129w" sizes="(max-width: 768px) 85vw, 400px">
                <img src="assets/images/01-signature-02.jpg" alt="Dorcas Moïra portrait noir et blanc demi-visage afro" loading="lazy" style="object-position: 50% 25%;">
              </picture>
              <div class="carousel-card-overlay">
                <span class="card-caption-title">Portrait N&B Demi-Visage</span>
                <span class="card-caption-sub">Intensité Monochrome · Afro</span>
              </div>
            </div>
          </div>''',
        content,
        count=1
    )

    # 2. Update 02-many-moods-03 carousel card
    content = re.sub(
        r'<div class="carousel-card" data-lightbox="02-many-moods-03"[\s\S]*?</div>\s*</div>\s*</div>',
        '''<div class="carousel-card" data-lightbox="02-many-moods-03" data-placeholder="false" data-caption="Trench Bicolore Beige & Sac à Franges">
            <div class="carousel-card-media">
              <picture>
                <source type="image/avif" srcset="assets/images/02-many-moods-03-640w.avif 640w, assets/images/02-many-moods-03-1080w.avif 1080w, assets/images/02-many-moods-03.avif 1117w" sizes="(max-width: 768px) 85vw, 400px">
                <source type="image/webp" srcset="assets/images/02-many-moods-03-640w.webp 640w, assets/images/02-many-moods-03-1080w.webp 1080w, assets/images/02-many-moods-03.webp 1117w" sizes="(max-width: 768px) 85vw, 400px">
                <img src="assets/images/02-many-moods-03.jpg" alt="Dorcas Moïra trench bicolore beige et camel contre table sac à franges" loading="lazy" style="object-position: 50% 25%;">
              </picture>
              <div class="carousel-card-overlay">
                <span class="card-caption-title">Trench Bicolore Beige</span>
                <span class="card-caption-sub">Luxe Urbain & Sac à Franges</span>
              </div>
            </div>
          </div>''',
        content,
        count=1
    )

    # 3. Update 02-many-moods-04 carousel card
    content = re.sub(
        r'<div class="carousel-card" data-lightbox="02-many-moods-04"[\s\S]*?</div>\s*</div>\s*</div>',
        '''<div class="carousel-card" data-lightbox="02-many-moods-04" data-placeholder="false" data-caption="Trench Beige sur Chaise Orange">
            <div class="carousel-card-media">
              <picture>
                <source type="image/avif" srcset="assets/images/02-many-moods-04-640w.avif 640w, assets/images/02-many-moods-04-1080w.avif 1080w, assets/images/02-many-moods-04.avif 1066w" sizes="(max-width: 768px) 85vw, 400px">
                <source type="image/webp" srcset="assets/images/02-many-moods-04-640w.webp 640w, assets/images/02-many-moods-04-1080w.webp 1080w, assets/images/02-many-moods-04.webp 1066w" sizes="(max-width: 768px) 85vw, 400px">
                <img src="assets/images/02-many-moods-04.jpg" alt="Dorcas Moïra trench beige assise sur chaise orange regard caméra" loading="lazy" style="object-position: 50% 30%;">
              </picture>
              <div class="carousel-card-overlay">
                <span class="card-caption-title">Trench Beige & Chaise Orange</span>
                <span class="card-caption-sub">Regard Caméra & Nuances Chaudes</span>
              </div>
            </div>
          </div>''',
        content,
        count=1
    )

    # 4. Update 03-afro-chic-02 carousel card
    content = re.sub(
        r'<div class="carousel-card" data-lightbox="03-afro-chic-02"[\s\S]*?</div>\s*</div>\s*</div>',
        '''<div class="carousel-card" data-lightbox="03-afro-chic-02" data-placeholder="false" data-caption="Kimono Wax Rouille & Sourire">
            <div class="carousel-card-media">
              <picture>
                <source type="image/avif" srcset="assets/images/03-afro-chic-02-640w.avif 640w, assets/images/03-afro-chic-02-1080w.avif 1080w, assets/images/03-afro-chic-02-1600w.avif 1600w, assets/images/03-afro-chic-02.avif 1789w" sizes="(max-width: 768px) 85vw, 400px">
                <source type="image/webp" srcset="assets/images/03-afro-chic-02-640w.webp 640w, assets/images/03-afro-chic-02-1080w.webp 1080w, assets/images/03-afro-chic-02-1600w.webp 1600w, assets/images/03-afro-chic-02.webp 1789w" sizes="(max-width: 768px) 85vw, 400px">
                <img src="assets/images/03-afro-chic-02.jpg" alt="Dorcas Moïra kimono wax rouille souriante" loading="lazy" style="object-position: 50% 25%;">
              </picture>
              <div class="carousel-card-overlay">
                <span class="card-caption-title">Kimono Wax Rouille</span>
                <span class="card-caption-sub">Sourire & Éclat Solaire</span>
              </div>
            </div>
          </div>''',
        content,
        count=1
    )

    # 5. Update 03-afro-chic-03 carousel card
    content = re.sub(
        r'<div class="carousel-card" data-lightbox="03-afro-chic-03"[\s\S]*?</div>\s*</div>\s*</div>',
        '''<div class="carousel-card" data-lightbox="03-afro-chic-03" data-placeholder="false" data-caption="Robe Blanche Spirale & Tresses">
            <div class="carousel-card-media">
              <picture>
                <source type="image/avif" srcset="assets/images/03-afro-chic-03-640w.avif 640w, assets/images/03-afro-chic-03-1080w.avif 1080w, assets/images/03-afro-chic-03-1600w.avif 1600w, assets/images/03-afro-chic-03.avif 3648w" sizes="(max-width: 768px) 85vw, 400px">
                <source type="image/webp" srcset="assets/images/03-afro-chic-03-640w.webp 640w, assets/images/03-afro-chic-03-1080w.webp 1080w, assets/images/03-afro-chic-03-1600w.webp 1600w, assets/images/03-afro-chic-03.webp 3648w" sizes="(max-width: 768px) 85vw, 400px">
                <img src="assets/images/03-afro-chic-03.jpg" alt="Dorcas Moïra robe blanche à cordons en spirale et tresses regard par-dessus l'épaule" loading="lazy" style="object-position: 50% 25%;">
              </picture>
              <div class="carousel-card-overlay">
                <span class="card-caption-title">Robe Blanche Spirale</span>
                <span class="card-caption-sub">Tresses & Regard par-dessus l'Épaule</span>
              </div>
            </div>
          </div>''',
        content,
        count=1
    )

    # 6. Update 04-studio-01 carousel card
    content = re.sub(
        r'<div class="carousel-card" data-lightbox="04-studio-01"[\s\S]*?</div>\s*</div>\s*</div>',
        '''<div class="carousel-card" data-lightbox="04-studio-01" data-placeholder="false" data-caption="Veste Denim & Boucle Orange">
            <div class="carousel-card-media">
              <picture>
                <source type="image/avif" srcset="assets/images/04-studio-01-640w.avif 640w, assets/images/04-studio-01-1080w.avif 1080w, assets/images/04-studio-01-1600w.avif 1600w, assets/images/04-studio-01.avif 1717w" sizes="(max-width: 768px) 85vw, 400px">
                <source type="image/webp" srcset="assets/images/04-studio-01-640w.webp 640w, assets/images/04-studio-01-1080w.webp 1080w, assets/images/04-studio-01-1600w.webp 1600w, assets/images/04-studio-01.webp 1717w" sizes="(max-width: 768px) 85vw, 400px">
                <img src="assets/images/04-studio-01.jpg" alt="Dorcas Moïra veste en jean N&B et boucle d'oreille orange en couleur" loading="lazy" style="object-position: 50% 30%;">
              </picture>
              <div class="carousel-card-overlay">
                <span class="card-caption-title">Veste Denim & Boucle Orange</span>
                <span class="card-caption-sub">Noir & Blanc · Touche de Couleur</span>
              </div>
            </div>
          </div>''',
        content,
        count=1
    )

    # 7. Update 05-sun-kissed-02 carousel card
    content = re.sub(
        r'<div class="carousel-card" data-lightbox="05-sun-kissed-02"[\s\S]*?</div>\s*</div>\s*</div>',
        '''<div class="carousel-card" data-lightbox="05-sun-kissed-02" data-placeholder="false" data-credit="KeyFilm Photographie" data-caption="Drapé Blanc Corde & Bateau">
            <div class="carousel-card-media">
              <picture>
                <source type="image/avif" srcset="assets/images/05-sun-kissed-02-640w.avif 640w, assets/images/05-sun-kissed-02-1080w.avif 1080w, assets/images/05-sun-kissed-02-1600w.avif 1600w, assets/images/05-sun-kissed-02.avif 2061w" sizes="(max-width: 768px) 85vw, 400px">
                <source type="image/webp" srcset="assets/images/05-sun-kissed-02-640w.webp 640w, assets/images/05-sun-kissed-02-1080w.webp 1080w, assets/images/05-sun-kissed-02-1600w.webp 1600w, assets/images/05-sun-kissed-02.webp 2061w" sizes="(max-width: 768px) 85vw, 400px">
                <img src="assets/images/05-sun-kissed-02.jpg" alt="Dorcas Moïra drapé blanc corde contre un bateau" loading="lazy" style="object-position: 50% 30%;">
              </picture>
              <div class="carousel-card-overlay">
                <span class="card-caption-title">Drapé Blanc & Bateau</span>
                <span class="card-caption-sub">Corde & Bord de Mer · Ph: KeyFilm</span>
              </div>
            </div>
          </div>''',
        content,
        count=1
    )

    # 8. Update 05-sun-kissed-03 carousel card
    content = re.sub(
        r'<div class="carousel-card" data-lightbox="05-sun-kissed-03"[\s\S]*?</div>\s*</div>\s*</div>',
        '''<div class="carousel-card" data-lightbox="05-sun-kissed-03" data-placeholder="false" data-credit="KeyFilm Photographie" data-caption="Drapé Blanc & Mouvement de Danse">
            <div class="carousel-card-media">
              <picture>
                <source type="image/avif" srcset="assets/images/05-sun-kissed-03-640w.avif 640w, assets/images/05-sun-kissed-03-1080w.avif 1080w, assets/images/05-sun-kissed-03-1600w.avif 1600w, assets/images/05-sun-kissed-03.avif 2061w" sizes="(max-width: 768px) 85vw, 400px">
                <source type="image/webp" srcset="assets/images/05-sun-kissed-03-640w.webp 640w, assets/images/05-sun-kissed-03-1080w.webp 1080w, assets/images/05-sun-kissed-03-1600w.webp 1600w, assets/images/05-sun-kissed-03.webp 2061w" sizes="(max-width: 768px) 85vw, 400px">
                <img src="assets/images/05-sun-kissed-03.jpg" alt="Dorcas Moïra drapé blanc en mouvement de danse" loading="lazy" style="object-position: 50% 25%;">
              </picture>
              <div class="carousel-card-overlay">
                <span class="card-caption-title">Drapé Blanc & Danse</span>
                <span class="card-caption-sub">Mouvement Flottant · Ph: KeyFilm</span>
              </div>
            </div>
          </div>''',
        content,
        count=1
    )

    # 9. Update why-me section portrait
    content = re.sub(
        r'<div class="why-portrait-wrap"[^>]*>[\s\S]*?</div>',
        '''<div class="why-portrait-wrap" data-lightbox="beauty-portrait" data-placeholder="false" data-caption="Portrait Beauté Top Rouge & Lumière Dorée · Dorcas Moïra">
          <picture>
            <source type="image/avif" srcset="assets/images/beauty-portrait-640w.avif 640w, assets/images/beauty-portrait-1080w.avif 1080w, assets/images/beauty-portrait.avif 1600w" sizes="(max-width: 768px) 100vw, 480px">
            <source type="image/webp" srcset="assets/images/beauty-portrait-640w.webp 640w, assets/images/beauty-portrait-1080w.webp 1080w, assets/images/beauty-portrait.webp 1600w" sizes="(max-width: 768px) 100vw, 480px">
            <img 
              src="assets/images/beauty-portrait.jpg" 
              alt="Dorcas Moïra portrait beauté en top rouge lumière dorée"
              loading="lazy"
              style="object-position: 35% 30%;"
            >
          </picture>
        </div>''',
        content,
        count=1
    )

    # 10. Update comp-card section with Digitals / Polaroids block
    if 'id="digitals"' not in content:
        polaroid_block = '''
      <!-- Sous-section officielle : Digitals / Polaroids -->
      <div class="digitals-showcase" id="digitals">
        <div class="editorial-header">
          <div class="editorial-header-left">
            <span class="chapter-number-pill">Polaroids d'Agence</span>
            <h3 class="chapter-title-script">Digitals / Polaroids</h3>
            <span class="chapter-mood-italic">Lumière naturelle & traits bruts · Prises de vue sans retouche</span>
          </div>
          <div class="editorial-header-right">
            <strong>Polaroid Officiel · 01</strong>
            <span>Close-Up / Face</span>
          </div>
        </div>

        <div class="digitals-grid">
          <div class="polaroid-card" data-lightbox="digital-01-face" data-placeholder="false" data-caption="Digital 01 · Portrait Face Naturel (Sans Fard)">
            <div class="polaroid-frame">
              <picture>
                <source type="image/avif" srcset="assets/images/digital-01-face-640w.avif 640w, assets/images/digital-01-face-1080w.avif 1080w, assets/images/digital-01-face-1600w.avif 1600w, assets/images/digital-01-face.avif 1717w" sizes="(max-width: 768px) 90vw, 360px">
                <source type="image/webp" srcset="assets/images/digital-01-face-640w.webp 640w, assets/images/digital-01-face-1080w.webp 1080w, assets/images/digital-01-face-1600w.webp 1600w, assets/images/digital-01-face.webp 1717w" sizes="(max-width: 768px) 90vw, 360px">
                <img src="assets/images/digital-01-face.jpg" alt="Dorcas Moïra polaroid digital t-shirt blanc visage au naturel" loading="lazy" style="object-position: 50% 30%;">
              </picture>
            </div>
            <div class="polaroid-meta">
              <span class="polaroid-tag">DIGITAL 01 — FACE</span>
              <span class="polaroid-spec">T-shirt blanc · Cheveux naturels · 0 Retouche</span>
            </div>
          </div>
        </div>
      </div>
'''
        # Insert before closing tag of comp-card section container
        content = content.replace('      </div>\n    </div>\n  </section>\n\n  <!-- ==========================================================================\n       11. GALERIE PHOTO PRINCIPALE',
                                  f'      </div>{polaroid_block}    </div>\n  </section>\n\n  <!-- ==========================================================================\n       11. GALERIE PHOTO PRINCIPALE')

    # 11. Update timeline in #journey
    # 2024:
    kuba_vignette = '''<div class="timeline-vignette-wrap">
            <div class="timeline-vignette">
              <img src="assets/images/timeline-2024-kuba.jpg" alt="Défilé — Kuba Concept Store" loading="lazy">
            </div>
            <span class="timeline-vignette-caption">Défilé — Kuba Concept Store</span>
          </div>'''
    if 'timeline-2024-kuba.jpg' not in content:
        content = re.sub(
            r'(<p class="timeline-event" data-i18n="tl_2024">[^<]*<strong>Kuba Concept Store</strong></p>)',
            r'\1\n          ' + kuba_vignette,
            content
        )

    # 2025/2026:
    djino_vignette = '''<div class="timeline-vignette-wrap">
            <div class="timeline-vignette">
              <img src="assets/images/timeline-2026-djino-backstage.jpg" alt="Coulisses — Campagne Djino" loading="lazy">
            </div>
            <span class="timeline-vignette-caption">Coulisses — Campagne Djino</span>
          </div>'''
    if 'timeline-2026-djino-backstage.jpg' not in content:
        content = re.sub(
            r'(<p class="timeline-event" data-i18n="tl_2025">[\s\S]*?<strong>Dimension Beyond the Extrêmes · Djino · Nourima</strong></p>)',
            r'\1\n          ' + djino_vignette,
            content
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[OK] Updated index.html")

def update_css():
    path = "css/style.css"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    new_styles = """
/* --- DIGITALS / POLAROIDS D'AGENCE --- */
.digitals-showcase {
  margin-top: 48px;
  padding-top: 36px;
  border-top: 1px solid rgba(184, 122, 82, 0.2);
}

.digitals-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 20px;
}

.polaroid-card {
  position: relative;
  background: #14100E;
  border: 1px solid rgba(184, 122, 82, 0.35);
  border-radius: 4px;
  padding: 12px 12px 16px 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  max-width: 320px;
  cursor: pointer;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.polaroid-card:hover {
  transform: translateY(-4px);
  border-color: var(--copper);
}

.polaroid-frame {
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
  background: #000;
  border-radius: 2px;
}

.polaroid-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.polaroid-meta {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.polaroid-tag {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  color: var(--copper-light);
  font-weight: 700;
}

.polaroid-spec {
  font-size: 0.8rem;
  color: var(--muted);
}

/* --- VIGNETTES PARCOURS / TIMELINE --- */
.timeline-vignette-wrap {
  margin-top: 12px;
  display: inline-flex;
  flex-direction: column;
  gap: 6px;
}

.timeline-vignette {
  width: 140px;
  aspect-ratio: 4/5;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(184, 122, 82, 0.35);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  background: #000;
}

.timeline-vignette img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.timeline-vignette-caption {
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: var(--copper-light);
  font-family: var(--font-mono, monospace);
}

/* --- SECTION POURQUOI MOI RECADRAGE MOBILE --- */
.why-portrait-wrap img {
  object-position: 35% 30% !important;
}

@media (max-width: 768px) {
  .why-portrait-wrap {
    max-height: 480px;
  }
  .why-portrait-wrap img {
    object-position: 35% 25% !important;
  }
}
"""
    if "/* --- DIGITALS / POLAROIDS D'AGENCE --- */" not in content:
        content += "\n" + new_styles
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print("[OK] Updated css/style.css")
    else:
        print("[SKIP] CSS already contains digitals styles")

if __name__ == "__main__":
    update_data_js()
    update_index_html()
    update_css()
