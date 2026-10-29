import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Pattern for section about content
old_about_pattern = r'(<div class="about-grid">.*?<div class="about-portrait-wrap".*?</div>\s*<div class="about-bio-text">.*?)(<div class="artistic-directions-block".*?</div>\s*</div>\s*</div>\s*</div>\s*</section>)'

new_about_content = '''<div class="about-grid">
        <!-- Portrait réel : Boubou lilas dans un angle sombre -->
        <div class="about-portrait-wrap" data-lightbox="about-portrait" data-caption="Boubou Lilas dans un Angle Sombre · Dorcas Moïra">
          <img 
            src="assets/images/about-portrait.jpg" 
            alt="Dorcas Moïra en boubou satin lilas accroupie dans un angle sombre" 
            class="about-portrait-img"
            loading="lazy"
          >
        </div>

        <div class="about-bio-text">
          <p data-i18n="about_p1">Je suis une jeune mannequin gabonaise, passionnée par l'image, la mode et l'expression visuelle. Mon univers mélange élégance afro, attitude contemporaine, naturel et présence studio.</p>
          <p data-i18n="about_p2">Je voyage entre douceur et intensité, naturel et sophistication, héritage africain et modernité fashion. Chaque collaboration est une narration vivante où la création prend tout son relief.</p>
          
          <div class="about-quote-signoff">
            <span class="signoff-rule" aria-hidden="true"></span>
            <span class="signoff-signature">Dorcas Moïra</span>
            <span class="signoff-origin">Libreville · Casablanca</span>
          </div>
        </div>
      </div>

      <!-- ====================================================================
           DOUBLE PAGE MAGAZINE DE MODE : NIVEAU AWWWARDS
           1. INDEX ÉDITORIAL (Directions Artistiques)
           2. MANIFESTE TYPOGRAPHIQUE (Model ADN)
           ==================================================================== -->
      <div class="editorial-double-spread" id="editorialDoubleSpread">
        
        <!-- 1. INDEX ÉDITORIAL (Sommaire typographique géant) -->
        <div class="editorial-index-block" id="editorialIndexBlock">
          <div class="editorial-block-header">
            <span class="editorial-kicker">01 — Sommaire Mode</span>
            <h3 class="editorial-block-title" data-i18n="label_directions">Directions Artistiques</h3>
          </div>

          <!-- Reveal d'image flottante au survol (Desktop) -->
          <div class="editorial-cursor-reveal" id="editorialCursorReveal" aria-hidden="true">
            <img src="assets/images/03-afro-chic-01.jpg" alt="" class="cursor-reveal-img" id="cursorRevealImg">
          </div>

          <div class="editorial-index-list" id="editorialIndexList" role="list">
            
            <!-- Ligne 01 : Editorial Fashion -->
            <article class="editorial-index-row" data-index="0" data-img="assets/images/03-afro-chic-01.jpg" data-filter="editorial">
              <a href="#selected-works" class="editorial-row-header" data-filter-link="editorial" aria-expanded="false">
                <span class="row-num">01</span>
                <span class="row-title">
                  <span class="title-main">Editorial</span>
                  <em class="title-accent">Fashion</em>
                </span>
                <span class="row-arrow" aria-hidden="true">↗</span>
              </a>
              <div class="row-separator-track" aria-hidden="true">
                <div class="row-separator-line"></div>
              </div>
              <!-- Accordéon Mobile -->
              <div class="row-accordion-drawer">
                <div class="accordion-drawer-inner">
                  <div class="accordion-media-frame">
                    <img src="assets/images/03-afro-chic-01.jpg" alt="Editorial Fashion — Dorcas Moïra" class="accordion-img" loading="lazy">
                  </div>
                  <p class="accordion-caption" data-i18n="dir_desc_1">Silhouettes audacieuses, pagnes revisités et jeux de contrastes pour les séries mode haute couture.</p>
                  <a href="#selected-works" class="accordion-cta" data-filter-link="editorial">Explorer cette série ↗</a>
                </div>
              </div>
            </article>

            <!-- Ligne 02 : Lifestyle -->
            <article class="editorial-index-row" data-index="1" data-img="assets/images/02-many-moods-01.jpg" data-filter="lifestyle">
              <a href="#selected-works" class="editorial-row-header" data-filter-link="lifestyle" aria-expanded="false">
                <span class="row-num">02</span>
                <span class="row-title">
                  <span class="title-main">Life</span>
                  <em class="title-accent">style</em>
                </span>
                <span class="row-arrow" aria-hidden="true">↗</span>
              </a>
              <div class="row-separator-track" aria-hidden="true">
                <div class="row-separator-line"></div>
              </div>
              <div class="row-accordion-drawer">
                <div class="accordion-drawer-inner">
                  <div class="accordion-media-frame">
                    <img src="assets/images/02-many-moods-01.jpg" alt="Lifestyle — Dorcas Moïra" class="accordion-img" loading="lazy">
                  </div>
                  <p class="accordion-caption" data-i18n="dir_desc_2">Spontanéité solaire, allure urbaine et matières nobles pour le prêt-à-porter contemporain.</p>
                  <a href="#selected-works" class="accordion-cta" data-filter-link="lifestyle">Explorer cette série ↗</a>
                </div>
              </div>
            </article>

            <!-- Ligne 03 : Studio Portrait -->
            <article class="editorial-index-row" data-index="2" data-img="assets/images/about-portrait.jpg" data-filter="portrait">
              <a href="#selected-works" class="editorial-row-header" data-filter-link="portrait" aria-expanded="false">
                <span class="row-num">03</span>
                <span class="row-title">
                  <span class="title-main">Studio</span>
                  <em class="title-accent">Portrait</em>
                </span>
                <span class="row-arrow" aria-hidden="true">↗</span>
              </a>
              <div class="row-separator-track" aria-hidden="true">
                <div class="row-separator-line"></div>
              </div>
              <div class="row-accordion-drawer">
                <div class="accordion-drawer-inner">
                  <div class="accordion-media-frame">
                    <img src="assets/images/about-portrait.jpg" alt="Studio Portrait — Dorcas Moïra" class="accordion-img" loading="lazy">
                  </div>
                  <p class="accordion-caption" data-i18n="dir_desc_3">Lumière feutrée, intensité du regard et présence sculpturale au service de la beauté pure.</p>
                  <a href="#selected-works" class="accordion-cta" data-filter-link="portrait">Explorer cette série ↗</a>
                </div>
              </div>
            </article>

            <!-- Ligne 04 : Commercial Campaign -->
            <article class="editorial-index-row" data-index="3" data-img="assets/images/hero-portrait.jpg" data-filter="commercial">
              <a href="#selected-works" class="editorial-row-header" data-filter-link="commercial" aria-expanded="false">
                <span class="row-num">04</span>
                <span class="row-title">
                  <span class="title-main">Commercial</span>
                  <em class="title-accent">Campaign</em>
                </span>
                <span class="row-arrow" aria-hidden="true">↗</span>
              </a>
              <div class="row-separator-track" aria-hidden="true">
                <div class="row-separator-line"></div>
              </div>
              <div class="row-accordion-drawer">
                <div class="accordion-drawer-inner">
                  <div class="accordion-media-frame">
                    <img src="assets/images/hero-portrait.jpg" alt="Commercial Campaign — Dorcas Moïra" class="accordion-img" loading="lazy">
                  </div>
                  <p class="accordion-caption" data-i18n="dir_desc_4">Énergie magnétique, port de tête altier et valorisation immédiate des pièces clés de marques.</p>
                  <a href="#selected-works" class="accordion-cta" data-filter-link="commercial">Explorer cette série ↗</a>
                </div>
              </div>
            </article>

            <!-- Ligne 05 : Video & Motion -->
            <article class="editorial-index-row" data-index="4" data-img="assets/images/comp-card-full.jpg" data-filter="motion">
              <a href="#selected-works" class="editorial-row-header" data-filter-link="motion" aria-expanded="false">
                <span class="row-num">05</span>
                <span class="row-title">
                  <span class="title-main">Video &</span>
                  <em class="title-accent">Motion</em>
                </span>
                <span class="row-arrow" aria-hidden="true">↗</span>
              </a>
              <div class="row-separator-track" aria-hidden="true">
                <div class="row-separator-line"></div>
              </div>
              <div class="row-accordion-drawer">
                <div class="accordion-drawer-inner">
                  <div class="accordion-media-frame">
                    <img src="assets/images/comp-card-full.jpg" alt="Video and Motion — Dorcas Moïra" class="accordion-img" loading="lazy">
                  </div>
                  <p class="accordion-caption" data-i18n="dir_desc_5">Fluidité du mouvement, drapés en apesanteur et narration vivante pour films de mode et digital.</p>
                  <a href="#selected-works" class="accordion-cta" data-filter-link="motion">Explorer cette série ↗</a>
                </div>
              </div>
            </article>

          </div>
        </div>

        <!-- 2. MODEL ADN (Manifeste typographique avec remplissage au scroll & photos inline) -->
        <div class="model-dna-manifesto-block" id="modelDnaSection">
          <div class="editorial-block-header">
            <span class="editorial-kicker">02 — Model ADN</span>
          </div>

          <div class="dna-manifesto-quote-wrap">
            <p class="dna-manifesto-quote" id="dnaManifestoQuote">
              <span class="dna-word sans-bold" data-i18n="dna_1">Présence naturelle</span>
              <span class="dna-star" aria-hidden="true">✦</span>
              <span class="dna-word serif-italic" data-i18n="dna_2">Élégance</span>
              <span class="dna-inline-badge" aria-hidden="true">
                <img src="assets/images/01-signature-01.jpg" alt="" class="dna-inline-img" loading="lazy">
              </span>
              <span class="dna-star" aria-hidden="true">✦</span>
              <span class="dna-word sans-bold" data-i18n="dna_3">Adaptabilité</span>
              <span class="dna-star" aria-hidden="true">✦</span>
              <span class="dna-word serif-italic" data-i18n="dna_4">Expressivité</span>
              <span class="dna-star" aria-hidden="true">✦</span>
              <span class="dna-word sans-bold" data-i18n="dna_5">Polyvalence</span>
              <span class="dna-inline-badge" aria-hidden="true">
                <img src="assets/images/about-portrait.jpg" alt="" class="dna-inline-img" loading="lazy">
              </span>
              <span class="dna-star" aria-hidden="true">✦</span>
              <span class="dna-word serif-italic" data-i18n="dna_6">Professionnalisme</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  </section>'''

# Replace about section contents
about_section_pattern = r'<section class="section-wrap" id="about">.*?</section>'
current_about = re.search(about_section_pattern, html, flags=re.DOTALL)
if current_about:
    full_new_about = f'''  <!-- ==========================================================================
       9. WHO IS MOÏRA ? DOUBLE PAGE ÉDITORIALE HAUTE COUTURE (AWWWARDS)
       - Portrait Boubou Lilas (focus 50% 30%)
       - 01 Sommaire Mode / Index Éditorial (lignes géantes + reveal curseur)
       - 02 Model ADN Manifeste (remplissage scroll + photos inline + étoiles)
       ========================================================================== -->
  <section class="section-wrap" id="about">
    <div class="ambient-halo" aria-hidden="true"></div>
    <div class="section-container">
      <div class="editorial-header">
        <div class="editorial-header-left">
          <span class="chapter-number-pill">Chapitre Introductif</span>
          <h2 class="chapter-title-script">Who is Moïra ?</h2>
          <span class="chapter-mood-italic" data-i18n="about_subtitle">Une silhouette, une énergie, une vision</span>
        </div>
        <div class="editorial-header-right">
          <strong>Dorcas Moïra</strong>
          <span data-i18n="hero_role">Modèle Photo | Afro Fashion Muse</span>
        </div>
      </div>

      {new_about_content}'''
    
    html = re.sub(about_section_pattern, full_new_about, html, flags=re.DOTALL)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated index.html with new About double page magazine structure")
else:
    print("Error: about section not found in index.html")
