/**
 * DORCAS MOÏRA · ENGINE AWWWARDS EDITION
 * Modular Architecture with Strict TDZ Elimination, Safe Lifecycle,
 * Dynamic Adaptive Galleries, FLIP Lightbox, Luxury Loader & 4s Safety Net.
 * 
 * Palette stricte : #0B0807, #1E140F, #B87A52, #E3B48C, #F3E6D8, #9C8A7C
 */

// =========================================================================
// 1. DICTIONNAIRE BILINGUE & VOCABULAIRE HAUTE COUTURE (GLOBAL)
// =========================================================================
const I18N = {
  fr: {
    menu_home: "Accueil",
    menu_signature: "Manifeste",
    menu_about: "Who is Moïra ?",
    menu_compcard: "Comp Card",
    menu_chapters: "Chapitres Photo",
    menu_motion: "Vidéo & Motion",
    menu_whyme: "Pourquoi moi",
    menu_contact: "Contact & Booking",
    hero_badge: "Candidate Miss Gabon Maroc 2026",
    hero_role: "Modèle Photo | Afro Fashion Muse",
    hero_tagline: "« La beauté gabonaise dans sa version la plus moderne. »",
    tagline_text: "« La beauté gabonaise dans sa version la plus moderne. »",
    hero_scroll: "Découvrir l'univers",
    manifesto_text: "« J'incarne une beauté qui ne cherche pas à entrer dans une case. Du studio à la lumière naturelle, du portrait intense au mood estival, de l'afro-chic au casual premium, avec une <span class=\"highlight-word\">aisance instinctive</span>. »",
    kw_1: "Élégante",
    kw_2: "Expressive",
    kw_3: "Solaire",
    kw_4: "Éditoriale",
    about_subtitle: "Une silhouette, une énergie, une vision",
    about_p1: "Je suis une jeune mannequin gabonaise, passionnée par l'image, la mode et l'expression visuelle. Mon univers mélange élégance afro, attitude contemporaine, naturel et présence studio.",
    about_p2: "Je voyage entre douceur et intensité, naturel et sophistication, héritage africain et modernité fashion. Chaque collaboration est une narration vivante où la création prend tout son relief.",
    dir_desc_1: "Silhouettes audacieuses, pagnes revisités et jeux de contrastes pour les séries mode haute couture.",
    dir_desc_2: "Spontanéité solaire, allure urbaine et matières nobles pour le prêt-à-porter contemporain.",
    dir_desc_3: "Lumière feutrée, intensité du regard et présence sculpturale au service de la beauté pure.",
    dir_desc_4: "Énergie magnétique, port de tête altier et valorisation immédiate des pièces clés de marques.",
    dir_desc_5: "Fluidité du mouvement, drapés en apesanteur et narration vivante pour films de mode et digital.",
    label_directions: "Directions Artistiques",
    label_dna: "Model ADN",
    dna_1: "Présence naturelle",
    dna_2: "Élégance",
    dna_3: "Adaptabilité",
    dna_4: "Expressivité",
    dna_5: "Polyvalence",
    dna_6: "Professionnalisme",
    compcard_subtitle: "Mensurations officielles & Spécifications",
    compcard_avail: "Casablanca, Maroc · Déplacements possibles",
    meas_age: "Âge",
    meas_height: "Taille",
    meas_weight: "Poids",
    meas_waist: "Tour de taille",
    meas_bust: "Poitrine",
    meas_hips: "Hanches",
    meas_shoes: "Pointure",
    meas_skin: "Teint de peau",
    skin_val: "Ébène",
    meas_hair: "Cheveux",
    hair_val: "Noirs",
    meas_eyes: "Yeux",
    eyes_val: "Bruns",
    btn_compcard: "Télécharger ma comp card (PDF)",
    btn_booknow: "Demander les disponibilités",
    mosaic_count: "42 Regards Exclusifs",
    why_subtitle: "L'alliance de l'intuition artistique et du professionnalisme",
    why_t1: "Direction artistique",
    why_p1: "Je comprends rapidement une vision créative et je sais lui donner vie devant l'objectif avec naturel et précision.",
    why_t2: "Polyvalence stylistique",
    why_p2: "Du portrait éditorial à la campagne commerciale, j'adapte mon jeu sans jamais perdre mon identité solaire et affirmée.",
    why_t3: "Énergie jeune et actuelle",
    why_p3: "Une image adaptée aux marques modernes, aux créateurs avant-gardistes et aux exigences des formats digitaux premium.",
    why_t4: "Professionnalisme",
    why_p4: "Ponctuelle, investie et rigoureuse, je considère chaque collaboration comme un partenariat fondé sur le respect et l'excellence.",
    why_t5: "Création de valeur",
    why_p5: "Je ne cherche pas uniquement à poser : je contribue à créer des images fortes qui subliment le produit et renforcent l'identité de marque.",
    tl_2023: "Shooting photo de campagne officielle, <strong>Daily Desiign</strong>",
    tl_2024: "Défilé de marque haute couture, <strong>Kuba Concept Store</strong>",
    tl_2025: "Shootings photo majeurs de campagnes : <strong>Dimension Beyond the Extrêmes · Djino · Nourima</strong>",
    tl_2026: "Candidate officielle au prestigieux titre <strong>Miss Gabon Maroc 2026</strong>",
    metric_1_l: "Vues sur TikTok",
    metric_1_s: "Portée virale globale",
    metric_2_l: "Likes sur TikTok",
    metric_2_s: "Interactions & Partages",
    metric_3_l: "Vues Instagram",
    metric_3_s: "Sur les 30 derniers jours",
    metric_4_l: "Vues mensuelles Pinterest",
    metric_4_s: "Moodboards mode & style",
    contact_lead: "Prête à donner vie à vos prochaines campagnes, lookbooks, défilés et contenus exclusifs. Disponible au Maroc et à l'international.",
    form_name: "Nom & Prénom *",
    form_brand: "Marque / Agence / Photographe *",
    form_type: "Type de Projet *",
    form_date: "Date envisagée / Période",
    form_msg: "Détails du projet & Moodboard",
    form_submit: "Envoyer la demande de booking",
    sticky_book: "Me booker"
  },
  en: {
    menu_home: "Home",
    menu_signature: "Manifesto",
    menu_about: "Who is Moïra ?",
    menu_compcard: "Comp Card",
    menu_chapters: "Photo Chapters",
    menu_motion: "Video & Motion",
    menu_whyme: "Why choose me",
    menu_contact: "Contact & Booking",
    hero_badge: "Candidate Miss Gabon Morocco 2026",
    hero_role: "Fashion Model | Afro Fashion Muse",
    hero_tagline: "« Gabonese beauty in its most modern essence. »",
    tagline_text: "« Gabonese beauty in its most modern essence. »",
    hero_scroll: "Explore the universe",
    manifesto_text: "« I embody a beauty that refuses to fit into predefined molds. From studio precision to raw daylight, sculptural intensity to effortless summer moods, afro-chic heritage to refined casual, guided by <span class=\"highlight-word\">instinctive elegance</span>. »",
    kw_1: "Elegant",
    kw_2: "Expressive",
    kw_3: "Solar",
    kw_4: "Editorial",
    about_subtitle: "A silhouette, an aura, a vision",
    about_p1: "I am a Gabonese fashion model devoted to the art of the visual narrative, haute couture, and dynamic presence. My universe merges afro elegance, contemporary edge, spontaneity, and high-impact studio discipline.",
    about_p2: "I navigate effortlessly between serenity and intensity, natural grace and sophisticated styling, ancestral heritage and modern fashion codes. Every shoot is a creative dialogue where garments come to life.",
    dir_desc_1: "Bold silhouettes, modern heritage weaves, and striking contrasts for high-fashion spreads.",
    dir_desc_2: "Sun-drenched spontaneity, natural textures, and urban chic for contemporary ready-to-wear.",
    dir_desc_3: "Masterful studio lighting, commanding gaze, and sculptural poise before the lens.",
    dir_desc_4: "Magnetic energy and high-end garment desirability for flagship brand campaigns.",
    dir_desc_5: "Kinetic grace, drape fluidity, and living rhythm for brand films and digital storytelling.",
    label_directions: "Artistic Directions",
    label_dna: "Model DNA",
    dna_1: "Natural Presence",
    dna_2: "Elegance",
    dna_3: "Adaptability",
    dna_4: "Expressiveness",
    dna_5: "Versatility",
    dna_6: "Professionalism",
    compcard_subtitle: "Official Agency Measurements & Specifications",
    compcard_avail: "Casablanca, Morocco · Available for travel",
    meas_age: "Age",
    meas_height: "Height",
    meas_weight: "Weight",
    meas_waist: "Waist",
    meas_bust: "Bust",
    meas_hips: "Hips",
    meas_shoes: "Shoes",
    meas_skin: "Skin Tone",
    skin_val: "Ebony",
    meas_hair: "Hair",
    hair_val: "Black",
    meas_eyes: "Eyes",
    eyes_val: "Brown",
    btn_compcard: "Download Comp Card (PDF)",
    btn_booknow: "Inquire Booking & Availability",
    mosaic_count: "42 Exclusive Looks",
    why_subtitle: "The seamless fusion of artistic intuition and runway discipline",
    why_t1: "Sharp Creative Direction",
    why_p1: "I quickly grasp a director's vision, bringing it to life in front of the lens with sculptural accuracy and effortless intuition.",
    why_t2: "Stylistic Versatility",
    why_p2: "From high-end editorial close-ups to vibrant commercial campaigns, I adapt my posture and gaze without ever compromising my identity.",
    why_t3: "Fresh & Contemporary Aura",
    why_p3: "A vibrant, magnetic aesthetic tailored for contemporary brands and the high-engagement demands of premium digital platforms.",
    why_t4: "Uncompromising Professionalism",
    why_p4: "Punctual, committed, and resilient, I approach every shoot as a collaborative partnership built on mutual respect and excellence.",
    why_t5: "Measurable Brand Value",
    why_p5: "I go beyond simply posing: I actively help craft striking visuals that elevate product desirability and strengthen brand equity.",
    tl_2023: "Official campaign photoshoot, <strong>Daily Desiign</strong>",
    tl_2024: "Haute couture runway show, <strong>Kuba Concept Store</strong>",
    tl_2025: "Flagship campaign shoots: <strong>Dimension Beyond the Extrêmes · Djino · Nourima</strong>",
    tl_2026: "Official candidate for the prestigious <strong>Miss Gabon Morocco 2026</strong> Pageant",
    metric_1_l: "TikTok Video Views",
    metric_1_s: "Organic viral reach",
    metric_2_l: "TikTok Likes & Reactions",
    metric_2_s: "High community engagement",
    metric_3_l: "Instagram Impressions",
    metric_3_s: "Past 30 days qualified traffic",
    metric_4_l: "Monthly Pinterest Views",
    metric_4_s: "Moodboard curation traction",
    contact_lead: "Ready to elevate your upcoming campaigns, lookbooks, runways, and premium digital storytelling. Available across Morocco & worldwide.",
    form_name: "Full Name *",
    form_brand: "Brand / Agency / Photographer *",
    form_type: "Project Type *",
    form_date: "Expected Date / Timeline",
    form_msg: "Creative Vision & Moodboard Details",
    form_submit: "Submit Booking Request",
    sticky_book: "Book Moïra"
  }
};

// =========================================================================
// 2. ÉTAT GLOBAL ET RÉFÉRENCES PARTAGÉES (HAUT DU FICHIER - AUCUNE TDZ)
// =========================================================================
let currentLang = 'fr';
let galleryElements = [];
let activeLightboxIndex = 0;
let metricsAnimated = false;
let isShowingAllLooks = false;
let loaderDismissed = false;
let loaderIntervalId = null;
let loaderSafetyTimeoutId = null;
let lastScrollY = 0;

// Registre central des éléments DOM
const dom = {
  scrollProgressBar: null,
  siteLoader: null,
  loaderCounter: null,
  siteHeader: null,
  menuToggleBtn: null,
  fullscreenMenu: null,
  menuPreviewImg: null,
  menuLinks: null,
  mobileStickyCta: null,
  heroSection: null,
  contactSection: null,
  bookingForm: null,
  formStatusMsg: null,
  watermarkTrack: null,
  langToggleBtn: null,
  customCursor: null,
  mosaicContainer: null,
  mosaicToggleBtn: null,
  filterButtons: null,
  selectedWorksSec: null,
  selectedWorksGrid: null,
  selectedWorksCountLabel: null,
  // Lightbox
  lightboxModal: null,
  lightboxImage: null,
  lightboxCounter: null,
  lightboxCaptionTitle: null,
  lightboxCaptionSub: null,
  lightboxCloseBtn: null,
  lightboxPrevBtn: null,
  lightboxNextBtn: null,
  lightboxStage: null
};

// =========================================================================
// 3. FONCTIONS UTILITAIRES & MODULES (DÉCLARÉES AVANT INIT)
// =========================================================================

/**
 * Cache les sélecteurs DOM principaux pour des accès ultra-rapides.
 */
function cacheDomReferences() {
  dom.scrollProgressBar = document.getElementById('scrollProgressBar');
  dom.siteLoader = document.getElementById('siteLoader');
  dom.loaderCounter = document.getElementById('loaderCounter');
  dom.siteHeader = document.getElementById('siteHeader');
  dom.menuToggleBtn = document.getElementById('menuToggleBtn');
  dom.fullscreenMenu = document.getElementById('fullscreenMenu');
  dom.menuPreviewImg = document.getElementById('menuPreviewImg');
  dom.menuLinks = document.querySelectorAll('[data-menu-close]');
  dom.mobileStickyCta = document.getElementById('mobileStickyCta');
  dom.heroSection = document.getElementById('hero');
  dom.contactSection = document.getElementById('contact');
  dom.bookingForm = document.getElementById('bookingForm');
  dom.formStatusMsg = document.getElementById('formStatusMsg');
  dom.watermarkTrack = document.getElementById('watermarkTrack');
  dom.langToggleBtn = document.getElementById('langToggleBtn');
  dom.customCursor = document.getElementById('customCursor');
  dom.mosaicContainer = document.getElementById('mosaicGridContainer');
  dom.mosaicToggleBtn = document.getElementById('mosaicToggleBtn');
  dom.filterButtons = document.querySelectorAll('#mosaicFilterBar .filter-btn');
  dom.selectedWorksSec = document.getElementById('selected-works');
  dom.selectedWorksGrid = document.getElementById('selectedWorksGrid');
  dom.selectedWorksCountLabel = document.getElementById('selectedWorksCountLabel');

  // Lightbox
  dom.lightboxModal = document.getElementById('lightboxModal');
  dom.lightboxImage = document.getElementById('lightboxImage');
  dom.lightboxCounter = document.getElementById('lightboxCounter');
  dom.lightboxCaptionTitle = document.getElementById('lightboxCaptionTitle');
  dom.lightboxCaptionSub = document.getElementById('lightboxCaptionSub');
  dom.lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  dom.lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  dom.lightboxNextBtn = document.getElementById('lightboxNextBtn');
  dom.lightboxStage = document.getElementById('lightboxStage');
}

/**
 * Recherche stricte des crédits photographes depuis data.js
 */
function findImageCredit(src, id) {
  if (typeof PORTFOLIO_DATA === 'undefined') return '';
  if (PORTFOLIO_DATA.hero && (src.includes('hero-portrait') || id === 'hero-portrait')) return PORTFOLIO_DATA.hero.credit || '';
  if (PORTFOLIO_DATA.about && (src.includes('about-portrait') || id === 'about-portrait')) return PORTFOLIO_DATA.about.portraitCredit || '';
  if (PORTFOLIO_DATA.compCard && (src.includes('comp-card') || id === 'comp-card-full')) return PORTFOLIO_DATA.compCard.credit || '';
  if (PORTFOLIO_DATA.manifesto && (src.includes('01-signature-01') || id === '01-signature-01')) return PORTFOLIO_DATA.manifesto.credit || '';

  if (Array.isArray(PORTFOLIO_DATA.chapters)) {
    for (const chap of PORTFOLIO_DATA.chapters) {
      if (chap.images) {
        for (const item of chap.images) {
          if (item.src && src.includes(item.src)) return item.credit || '';
          if (id && item.src && item.src.includes(id)) return item.credit || '';
        }
      }
    }
  }
  if (PORTFOLIO_DATA.visualArchive && Array.isArray(PORTFOLIO_DATA.visualArchive.items)) {
    for (const item of PORTFOLIO_DATA.visualArchive.items) {
      if (item.src && src.includes(item.src)) return item.credit || '';
    }
  }
  return '';
}

/**
 * Mise à jour de la langue et du dictionnaire
 */
function updateLanguage(lang, forceUpdate = false) {
  currentLang = lang;
  document.body.setAttribute('data-lang', lang);
  document.documentElement.lang = lang;

  const dict = I18N[lang];
  if (!dict) return;

  // En français initial, le DOM statique est déjà parfait : zéro reflow inutile
  if (forceUpdate || lang !== 'fr') {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });
  }

  if (dom.langToggleBtn) {
    const frSpan = dom.langToggleBtn.querySelector('.lang-fr');
    const enSpan = dom.langToggleBtn.querySelector('.lang-en');
    if (lang === 'fr') {
      if (frSpan) frSpan.classList.add('active');
      if (enSpan) enSpan.classList.remove('active');
    } else {
      if (frSpan) frSpan.classList.remove('active');
      if (enSpan) enSpan.classList.add('active');
    }
  }
}

/**
 * Mode production et galeries adaptatives
 */
function applyAdaptiveGalleries() {
  const isProduction = window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.SHOW_PLACEHOLDERS === false;
  if (!isProduction) return;

  document.body.classList.add('hide-placeholders');

  // S'assurer que tous les chapitres avec vraies photos et Selected Works restent visibles
  ['selected-works', 'chap-01', 'chap-02', 'chap-03', 'chap-04', 'chap-05'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
  });

  // Masquer les mosaïques / archives de placeholders sans photos réelles
  const visualMosaic = document.getElementById('visual-mosaic');
  if (visualMosaic) visualMosaic.style.display = 'none';

  // Masquer toutes les cartes placeholder restantes
  document.querySelectorAll('[data-placeholder="true"]').forEach(el => {
    el.style.display = 'none';
  });

  // Filtrage des liens de navigation pour les sections masquées
  document.querySelectorAll('.menu-nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#visual-mosaic' || href === '#visual-chapters' || href === '#archive') {
      const li = link.closest('li');
      if (li) li.style.display = 'none';
    }
  });

  // Re-synchronisation de la Lightbox
  initLightboxElements();
}

/**
 * Initialisation et synchronisation de la collection d'images Lightbox
 */
function initLightboxElements() {
  const isProduction = window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.SHOW_PLACEHOLDERS === false;
  let all = Array.from(document.querySelectorAll('[data-lightbox]'));

  if (isProduction) {
    all = all.filter(el => {
      if (el.getAttribute('data-placeholder') === 'true') return false;
      if (el.closest('[data-has-real-photos="false"]')) return false;
      if (el.closest('[data-placeholder="true"]')) return false;
      if (el.offsetParent === null && window.getComputedStyle(el).display === 'none') return false;
      return true;
    });
  }

  galleryElements = all;
  window.galleryElements = galleryElements;
  galleryElements.forEach((el, index) => {
    if (el._lightboxHandler) {
      el.removeEventListener('click', el._lightboxHandler);
    }
    el._lightboxHandler = (e) => {
      e.preventDefault();
      openLightbox(index);
    };
    el.addEventListener('click', el._lightboxHandler);
  });
}

function openLightbox(index) {
  if (!dom.lightboxModal || !galleryElements.length) return;
  activeLightboxIndex = (index >= 0 && index < galleryElements.length) ? index : 0;
  updateLightboxContent();
  dom.lightboxModal.classList.add('is-active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!dom.lightboxModal) return;
  dom.lightboxModal.classList.remove('is-active');
  document.body.style.overflow = '';
}

function updateLightboxContent() {
  if (!dom.lightboxImage || !galleryElements[activeLightboxIndex]) return;

  const el = galleryElements[activeLightboxIndex];
  const img = el.querySelector('img');
  const src = img ? img.getAttribute('src') : '';
  const lightboxId = el.getAttribute('data-lightbox') || '';
  const credit = el.getAttribute('data-credit') || findImageCredit(src, lightboxId);

  dom.lightboxImage.style.transform = 'scale(0.96)';
  dom.lightboxImage.style.opacity = '0';

  setTimeout(() => {
    dom.lightboxImage.src = src;
    dom.lightboxImage.alt = `Dorcas Moïra — Photo ${activeLightboxIndex + 1}`;
    if (dom.lightboxCaptionTitle) {
      dom.lightboxCaptionTitle.textContent = '';
      dom.lightboxCaptionTitle.style.display = 'none';
    }
    const hasCredit = credit && credit !== 'null' && String(credit).trim() !== '';
    if (dom.lightboxCaptionSub) {
      dom.lightboxCaptionSub.textContent = hasCredit ? credit : '';
    }
    if (dom.lightboxCounter) {
      dom.lightboxCounter.textContent = `${String(activeLightboxIndex + 1).padStart(2, '0')} / ${String(galleryElements.length).padStart(2, '0')}`;
    }
    dom.lightboxImage.style.transform = 'scale(1)';
    dom.lightboxImage.style.opacity = '1';
  }, 60);
}

function showNextPhoto() {
  if (!galleryElements.length) return;
  activeLightboxIndex = (activeLightboxIndex + 1) % galleryElements.length;
  updateLightboxContent();
}

function showPrevPhoto() {
  if (!galleryElements.length) return;
  activeLightboxIndex = (activeLightboxIndex - 1 + galleryElements.length) % galleryElements.length;
  updateLightboxContent();
}

/**
 * Événements et contrôles Lightbox (Touches, Clavier, Swipe tactile)
 */
function initLightbox() {
  initLightboxElements();

  if (dom.lightboxCloseBtn) dom.lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (dom.lightboxNextBtn) dom.lightboxNextBtn.addEventListener('click', showNextPhoto);
  if (dom.lightboxPrevBtn) dom.lightboxPrevBtn.addEventListener('click', showPrevPhoto);

  window.addEventListener('keydown', (e) => {
    if (!dom.lightboxModal || !dom.lightboxModal.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextPhoto();
    if (e.key === 'ArrowLeft') showPrevPhoto();
  });

  // Gestes tactiles sur mobile
  if (dom.lightboxStage) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    dom.lightboxStage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    dom.lightboxStage.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (diffY > 80 && Math.abs(diffX) < 60) {
        closeLightbox();
        return;
      }
      if (Math.abs(diffX) > 45) {
        if (diffX < 0) showNextPhoto();
        else showPrevPhoto();
      }
    }, { passive: true });
  }
}

/**
 * Menu Plein Écran Haute Couture & Prévisualisation des Médias
 */
function toggleMenu(forceClose = false) {
  if (!dom.fullscreenMenu || !dom.menuToggleBtn) return;
  const isOpen = forceClose ? false : !dom.fullscreenMenu.classList.contains('is-open');
  if (isOpen) {
    dom.fullscreenMenu.classList.add('is-open');
    dom.menuToggleBtn.classList.add('is-active');
    dom.menuToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  } else {
    dom.fullscreenMenu.classList.remove('is-open');
    dom.menuToggleBtn.classList.remove('is-active');
    dom.menuToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

function initMenu() {
  if (dom.menuToggleBtn) {
    dom.menuToggleBtn.addEventListener('click', () => toggleMenu());
  }

  if (dom.menuLinks) {
    dom.menuLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(true));

      // Prévisualisation photo dynamique au survol
      link.addEventListener('mouseenter', () => {
        const targetImg = link.getAttribute('data-preview');
        if (dom.menuPreviewImg && targetImg) {
          dom.menuPreviewImg.style.opacity = '0.3';
          setTimeout(() => {
            dom.menuPreviewImg.src = targetImg;
            dom.menuPreviewImg.style.opacity = '1';
          }, 120);
        }
      });
    });
  }
}

/**
 * Header sticky intelligent et barre de progression
 */
function initHeaderAndScroll() {
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // 1. Barre de progression supérieure
    if (dom.scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;
      dom.scrollProgressBar.style.width = `${progress}%`;
    }

    // 2. Header sticky intelligent
    if (dom.siteHeader) {
      const heroHeight = dom.heroSection ? dom.heroSection.offsetHeight : window.innerHeight;
      const isPastHero = currentScrollY >= (heroHeight - 80);

      if (isPastHero) {
        dom.siteHeader.classList.add('is-scrolled');
      } else {
        dom.siteHeader.classList.remove('is-scrolled');
      }

      if (currentScrollY > lastScrollY && currentScrollY > heroHeight + 50) {
        dom.siteHeader.classList.add('is-hidden');
      } else {
        dom.siteHeader.classList.remove('is-hidden');
      }
    }

    lastScrollY = currentScrollY;
    handleStickyCtaVisibility();
  }, { passive: true });
}

/**
 * Visibilité du bouton sticky booking mobile
 */
function handleStickyCtaVisibility() {
  if (!dom.mobileStickyCta || !dom.heroSection || !dom.contactSection) return;
  const heroBottom = dom.heroSection.getBoundingClientRect().bottom;
  const contactTop = dom.contactSection.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;

  if (heroBottom < 100 && contactTop > windowHeight - 80) {
    dom.mobileStickyCta.classList.remove('is-hidden');
  } else {
    dom.mobileStickyCta.classList.add('is-hidden');
  }
}

/**
 * Séquence d'entrée Awwwards du Hero & Grille Éditoriale (GSAP Timeline)
 */
function triggerHeroSequence() {
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    // Sur mobile : fluidité absolue sans saturer le fil d'exécution
    const img = document.getElementById('heroCutoutImg');
    if (img) img.style.opacity = '1';
    return;
  }
  if (typeof gsap === 'undefined') return;

  const easeWaw = 'power2.out';
  const tl = gsap.timeline({ defaults: { ease: easeWaw } });

  tl.from('#heroFrameInset', { opacity: 0, duration: 0.35 }, 0)
    .from('#heroLayerBg', { opacity: 0, duration: 0.35 }, 0.02)
    .from('.hero-word-single .word-line, .hero-word-desktop .word-line, .hero-word-mobile .word-line', { y: 15, opacity: 0, duration: 0.35 }, 0.04)
    .from('#heroCutoutImg', {
      scale: 1.02,
      duration: 0.38,
      onComplete: () => {
        const el = document.getElementById('heroCutoutImg');
        if (el) gsap.set(el, { clearProps: 'transform,willChange' });
      }
    }, 0.02)
    .from('.hero-script-creative', { opacity: 0, duration: 0.3 }, 0.08)
    .from('.hero-annot', { opacity: 0, duration: 0.3 }, 0.1);

  // Parallaxe différencié au scroll — UNIQUEMENT sur Desktop (>= 768px)
  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && !isMobile) {
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

/**
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
        header.blur();
        const wasOpen = row.classList.contains('is-open');

        // Fermer les autres (un seul accordéon ouvert à la fois)
        rows.forEach(r => {
          r.classList.remove('is-open');
          const h = r.querySelector('.editorial-row-header');
          if (h) {
            h.setAttribute('aria-expanded', 'false');
            h.blur();
          }
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

      // 5. Remplissage des mots de l'ADN (Scrub sur desktop >= 768px, simple apparition unique sur mobile)
      const words = gsap.utils.toArray('.dna-word');
      const isMobile = window.innerWidth < 768;
      if (words.length > 0) {
        if (isMobile) {
          ScrollTrigger.create({
            trigger: '#dnaManifestoQuote',
            start: 'top 85%',
            once: true,
            onEnter: () => words.forEach(w => w.classList.add('is-filled'))
          });
        } else {
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
      }
    } else {
      document.querySelectorAll('.dna-word').forEach(w => w.classList.add('is-filled'));
    }
  } else {
    document.querySelectorAll('.dna-word').forEach(w => w.classList.add('is-filled'));
  }
}

/**
 * Mosaïque visuelle (Chapitre 06) et filtres
 */
function initVisualMosaic() {
  if (!dom.mosaicContainer || !window.PORTFOLIO_DATA) return;
  if (window.PORTFOLIO_DATA.SHOW_PLACEHOLDERS === false) {
    const sec = document.getElementById('visual-mosaic');
    if (sec) sec.style.display = 'none';
    return;
  }

  const ch06 = window.PORTFOLIO_DATA.chapters.find(c => c.id === '06-visual-chapters');
  if (!ch06 || !ch06.images) return;

  dom.mosaicContainer.innerHTML = '';
  ch06.images.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = `mosaic-item ${item.isTall ? 'tall' : ''}`;
    card.setAttribute('data-category', item.category);
    card.setAttribute('data-lightbox', `06-visual-${String(idx + 1).padStart(2, '0')}`);
    card.setAttribute('data-caption', `${item.captionFr} · Dorcas Moïra`);

    if (idx >= 12 && window.innerWidth < 768 && !isShowingAllLooks) {
      card.classList.add('is-hidden-mobile');
    }

    const media = document.createElement('div');
    media.className = 'mosaic-item-media';

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt;
    img.loading = 'lazy';

    const tag = document.createElement('span');
    tag.className = 'mosaic-item-tag';
    tag.textContent = item.category.toUpperCase();

    media.appendChild(img);
    card.appendChild(media);
    card.appendChild(tag);
    dom.mosaicContainer.appendChild(card);
  });

  initLightboxElements();

  if (dom.mosaicToggleBtn) {
    dom.mosaicToggleBtn.addEventListener('click', () => {
      isShowingAllLooks = !isShowingAllLooks;
      document.querySelectorAll('.is-hidden-mobile').forEach(el => {
        el.style.display = isShowingAllLooks ? 'block' : 'none';
      });
      const span = dom.mosaicToggleBtn.querySelector('span');
      if (span) {
        span.textContent = isShowingAllLooks ? 'Réduire la sélection' : 'Voir tous les 42 looks';
      }
    });
  }

  if (dom.filterButtons) {
    dom.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        dom.filterButtons.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        const filterVal = btn.getAttribute('data-filter');
        const items = document.querySelectorAll('#mosaicGridContainer .mosaic-item');

        items.forEach(item => {
          const itemCat = item.getAttribute('data-category');
          if (filterVal === 'all' || itemCat === filterVal) {
            item.classList.remove('is-hidden');
            item.style.opacity = '0';
            setTimeout(() => { item.style.opacity = '1'; }, 40);
          } else {
            item.classList.add('is-hidden');
          }
        });
      });
    });
  }
}

/**
 * Animation des compteurs métriques sur IntersectionObserver
 */
function initMetrics() {
  const metricCards = document.querySelectorAll('.metric-number');
  const metricsSection = document.getElementById('metrics');

  function animateMetricCounters() {
    metricCards.forEach(card => {
      const target = parseInt(card.getAttribute('data-target'), 10);
      const prefix = card.getAttribute('data-prefix') || '';
      const suffix = card.getAttribute('data-suffix') || '';
      const duration = 1800;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeVal = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeVal * target);

        if (suffix === 'K') {
          const valInK = (currentVal / 1000).toFixed(currentVal >= 100000 ? 0 : 1).replace('.', ',');
          card.textContent = `${prefix}${valInK}K`;
        } else {
          card.textContent = `${prefix}${currentVal.toLocaleString()}`;
        }

        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  if (metricsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !metricsAnimated) {
          metricsAnimated = true;
          animateMetricCounters();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(metricsSection);
  }
}

/**
 * Formulaire de contact et formatage WhatsApp officiel
 */
function initBookingForm() {
  if (!dom.bookingForm) return;

  dom.bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('bookName');
    const brandInput = document.getElementById('bookBrand');
    const typeInput = document.getElementById('bookType');
    const dateInput = document.getElementById('bookDate');
    const msgInput = document.getElementById('bookMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const brand = brandInput ? brandInput.value.trim() : '';
    const type = typeInput ? typeInput.value : '';
    const date = dateInput ? dateInput.value.trim() : '';
    const message = msgInput ? msgInput.value.trim() : '';

    if (!name || !brand || !type) {
      alert(currentLang === 'fr' ? 'Veuillez renseigner les champs obligatoires (*).' : 'Please complete all required fields (*).');
      return;
    }

    const formattedMsg = encodeURIComponent(
      `✦ *DEMANDE DE BOOKING OFFICIELLE — DORCAS MOÏRA*\n\n` +
      `• *Nom & Prénom:* ${name}\n` +
      `• *Marque / Agence:* ${brand}\n` +
      `• *Type de Projet:* ${type}\n` +
      `• *Période / Date:* ${date || 'À convenir'}\n` +
      `• *Détails & Moodboard:* ${message || 'Échange sur projet éditorial/commercial.'}\n\n` +
      `_Envoyé depuis le portfolio officiel de Dorcas Moïra_`
    );

    if (dom.formStatusMsg) {
      dom.formStatusMsg.style.display = 'block';
      dom.formStatusMsg.innerHTML = currentLang === 'fr'
        ? `<strong>Demande confirmée.</strong> Redirection immédiate vers le desk WhatsApp de Dorcas Moïra...`
        : `<strong>Request registered.</strong> Redirecting directly to Dorcas Moïra's WhatsApp desk...`;
    }

    if (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.identity && window.PORTFOLIO_DATA.identity.formspreeEndpoint) {
      fetch(window.PORTFOLIO_DATA.identity.formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, brand, type, date, message })
      }).catch(() => {});
    }

    setTimeout(() => {
      window.open(`https://wa.me/212779732777?text=${formattedMsg}`, '_blank');
      dom.bookingForm.reset();
    }, 1200);
  });
}

/**
 * Parallaxe filigrane « The Muse Energy »
 */
function initWatermark() {
  if (!dom.watermarkTrack) return;
  if (window.innerWidth < 768) return; // Désactivé sur mobile (< 768px)
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    dom.watermarkTrack.style.transform = `translateX(${- (scrollPos * 0.12) % 400}px)`;
  }, { passive: true });
}

/**
 * Curseur de luxe desktop et easter egg
 */
function initCursor() {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice && dom.customCursor) {
    window.addEventListener('mousemove', (e) => {
      dom.customCursor.style.left = `${e.clientX}px`;
      dom.customCursor.style.top = `${e.clientY}px`;
    });

    document.querySelectorAll('.carousel-card, .mosaic-item, .comp-card-photo, .reel-card, .selected-works-card').forEach(target => {
      target.addEventListener('mouseenter', () => dom.customCursor.classList.add('is-visible'));
      target.addEventListener('mouseleave', () => dom.customCursor.classList.remove('is-visible'));
    });
  }

  // Monogramme footer qui se redessine
  const egg = document.querySelector('.footer-monogram-egg');
  if (egg) {
    egg.addEventListener('mouseenter', () => {
      const path = egg.querySelector('.footer-dm-stroke');
      if (path) {
        path.style.animation = 'none';
        path.offsetHeight;
        path.style.animation = 'drawSignature 1.1s var(--ease-waw) forwards';
      }
    });
  }
}


/**
 * Smooth scrolling Lenis (Desktop uniquement, désactivé sur mobile/tactile)
 */
function initLenis() {
  const isDesktop = window.innerWidth >= 1024 && !window.matchMedia('(pointer: coarse)').matches;
  if (isDesktop && typeof Lenis !== 'undefined') {
    try {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true
      });
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (err) {}
  }
}

let stage2Initialized = false;


function loadScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
}

async function runStage2() {
  if (stage2Initialized) return;
  stage2Initialized = true;

  try {
    await loadScript('js/data.js');
    applyAdaptiveGalleries();
  } catch (err) {
    console.warn('[Init Adaptive Galleries Warning]', err);
  }

  try {
    initLightbox();
  } catch (err) {
    console.warn('[Init Lightbox Warning]', err);
  }

  try {
    // Load ScrollTrigger only when idle or on scroll
    await loadScript('js/gsap.min.js');
    await loadScript('js/ScrollTrigger.min.js');
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
    }
    initEditorialDoublePage();
    initVisualMosaic();
    initMetrics();
    initBookingForm();
    initWatermark();
    initCursor();
    
    // Desktop smooth scrolling
    const isDesktop = window.innerWidth >= 1024 && !window.matchMedia('(pointer: coarse)').matches;
    if (isDesktop) {
      await loadScript('js/lenis.min.js');
      initLenis();
    }
  } catch (err) {
    console.warn('[Init Interactions Warning]', err);
  }

  window.__PORTFOLIO_READY__ = true;
}

function scheduleStage2() {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(runStage2, { timeout: 2500 });
  }
  setTimeout(runStage2, 3000);
}

// Déclencheurs utilisateur immédiats pour Stage 2
['scroll', 'touchstart', 'click', 'keydown'].forEach(evt => {
  window.addEventListener(evt, runStage2, { once: true, passive: true });
});

/**
 * Retrait sécurisé du loader et déclenchement du hero
 */
function dismissLoader() {
  if (loaderDismissed) return;
  loaderDismissed = true;

  if (loaderIntervalId) {
    clearInterval(loaderIntervalId);
    loaderIntervalId = null;
  }
  if (loaderSafetyTimeoutId) {
    clearTimeout(loaderSafetyTimeoutId);
    loaderSafetyTimeoutId = null;
  }

  if (dom.loaderCounter) {
    dom.loaderCounter.textContent = '100%';
  }

  if (dom.siteLoader) {
    dom.siteLoader.classList.add('is-loaded');
  }

  try {
    triggerHeroSequence();
  } catch (err) {
    console.warn('[Hero Animation Warning]', err);
  }

  scheduleStage2();
}

/**
 * Animation du loader avec compteur 00 -> 100%
 * Accéléré (< 0.6s) et court-circuité si déjà visité dans la session
 */
function initLoader() {
  if (dom.loaderCounter) dom.loaderCounter.textContent = '100%';
  dismissLoader();
}

// =========================================================================
// 4. INITIALISATION CENTRALISÉE init() — Étape 1 : Immédiate (Critical Path)
// =========================================================================
function init() {
  // 1. ÉTAT & CACHE DOM
  try {
    cacheDomReferences();
  } catch (err) {
    console.warn('[Init DOM Warning]', err);
  }

  // 2. DONNÉES & LANGUE
  try {
    updateLanguage(currentLang);
    if (dom.langToggleBtn) {
      dom.langToggleBtn.addEventListener('click', () => {
        const nextLang = currentLang === 'fr' ? 'en' : 'fr';
        updateLanguage(nextLang, true);
      });
    }
  } catch (err) {
    console.warn('[Init Language Warning]', err);
  }

  // 3. MENU, NAVIGATION & HEADER
  try {
    initMenu();
    initHeaderAndScroll();
  } catch (err) {
    console.warn('[Init Navigation Warning]', err);
  }

  // 4. LOADER DE LUXE (avec sortie ultra fluide)
  try {
    initLoader();
  } catch (err) {
    console.warn('[Init Loader Warning]', err);
    dismissLoader();
  }
}

// =========================================================================
// 5. FILET DE SÉCURITÉ ABSOLU : RETRAIT DU LOADER APRÈS 1.2s MAX
// =========================================================================
loaderSafetyTimeoutId = setTimeout(() => {
  if (!loaderDismissed) {
    dismissLoader();
  }
}, 1200);

// Écouteur principal
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
