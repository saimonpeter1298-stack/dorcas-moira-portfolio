const SHOW_PLACEHOLDERS = false;
const MIN_PHOTOS_PER_CHAPTER = 3; // Seuil minimum de photos réelles pour afficher un chapitre individuel // Mode production : masquer les placeholders et les chapitres sans photo réelle

/**
 * DORCAS MOÏRA - PORTFOLIO DATA ARCHITECTURE (AWWWARDS EDITION)
 * Centralized data store: Bilingual copy, Focal Points ("focus"), Photographer Credits ("credit"),
 * Model measurements, dynamic variable photo chapters, and booking configurations.
 */

const PORTFOLIO_DATA = {
  SHOW_PLACEHOLDERS: SHOW_PLACEHOLDERS,
  MIN_PHOTOS_PER_CHAPTER: MIN_PHOTOS_PER_CHAPTER,
  identity: {
    stageName: "Dorcas Moïra",
    fullName: "SAPHOU Dorcas Moïra",
    roleFr: "Modèle Photo | Afro Fashion Muse",
    roleEn: "Fashion Model | Afro Fashion Muse",
    taglineFr: "La beauté gabonaise dans sa version la plus moderne.",
    taglineEn: "Gabonese beauty in its most modern essence.",
    conceptPhrase: "The Muse Energy",
    originFr: "Gabonaise, basée à Casablanca (Maârif), Maroc",
    originEn: "Gabonese, based in Casablanca (Maârif), Morocco",
    newsFr: "Candidate Miss Gabon Maroc 2026",
    newsEn: "Candidate Miss Gabon Morocco 2026",
    availabilityFr: "Maroc — Disponible pour déplacements nationaux & internationaux",
    availabilityEn: "Morocco — Available for worldwide bookings",
    phone: "+212 779 732 777",
        whatsappLink: "https://wa.me/212779732777",
    email: "Dorcassmoira@gmail.com",
    formspreeEndpoint: "",
    socials: {
      instagram: { handle: "@dorc.as_moira", url: "https://www.instagram.com/dorc.as_moira/" },
      tiktok: { handle: "@dorcas_moira", url: "https://www.tiktok.com/@dorcas_moira" },
      pinterest: { handle: "@dorcassmoira", url: "https://pin.it/1GRwMbeNP" },
      whatsapp: { handle: "+212 779 732 777", url: "https://wa.me/212779732777" },
      email: { handle: "Dorcassmoira@gmail.com", url: "mailto:Dorcassmoira@gmail.com" },
      phone: { handle: "+212 779 732 777", url: "tel:+212779732777" },
      facebook: { handle: "", url: "" }
    }
  },

  hero: {
    src: "assets/images/hero-portrait.jpg",
    cutoutSrc: "assets/images/hero-cutout.webp",
    alt: "Dorcas Moïra en kimono wax rouille et ceinture dorée",
    focus: "45% 30%",
    placeholder: false,
    credit: null
  },

  manifesto: {
    quoteFr: "J'incarne une beauté qui ne cherche pas à entrer dans une case. Du studio à la lumière naturelle, du portrait intense au mood estival, de l'afro-chic au casual premium, avec une aisance instinctive.",
    quoteEn: "I embody a beauty that refuses to fit into predefined molds. From studio precision to raw daylight, sculptural intensity to effortless summer moods, afro-chic heritage to refined casual, guided by instinctive elegance.",
    keywords: ["Élégante", "Expressive", "Solaire", "Éditoriale"],
    keywordsEn: ["Elegant", "Expressive", "Solar", "Editorial"],
    bgImage: "assets/images/01-signature-01.jpg",
    bgFocus: "60% 55%",
    placeholder: false,
    credit: null
  },

  about: {
    title: "Who is Moïra ?",
    subtitleFr: "Une silhouette, une énergie, une vision",
    subtitleEn: "A silhouette, an aura, a vision",
    portraitSrc: "assets/images/about-portrait.jpg",
    portraitFocus: "50% 30%",
    placeholder: false,
    portraitCredit: null,
    paragraphsFr: [
      "Je suis une jeune mannequin gabonaise, passionnée par l'image, la mode et l'expression visuelle. Mon univers mélange élégance afro, attitude contemporaine, naturel et présence studio.",
      "Je voyage entre douceur et intensité, naturel et sophistication, héritage africain et modernité fashion. Chaque collaboration est une narration vivante où la création prend tout son relief."
    ],
    paragraphsEn: [
      "I am a Gabonese fashion model devoted to the art of the visual narrative, haute couture, and dynamic presence. My universe merges afro elegance, contemporary edge, spontaneity, and high-impact studio discipline.",
      "I navigate effortlessly between serenity and intensity, natural grace and sophisticated styling, ancestral heritage and modern fashion codes. Every shoot is a creative dialogue where garments come to life."
    ],
    artisticDirections: [
      {
        id: "editorial-fashion",
        num: "01",
        titleMain: "Editorial",
        titleAccent: "Fashion",
        filter: "editorial",
        image: "assets/images/03-afro-chic-01.jpg",
        focus: "50% 25%",
        descFr: "Silhouettes audacieuses, pagnes revisités et jeux de contrastes pour les séries mode haute couture.",
        descEn: "Bold silhouettes, modern heritage weaves, and striking contrasts for high-fashion spreads."
      },
      {
        id: "lifestyle",
        num: "02",
        titleMain: "Life",
        titleAccent: "style",
        filter: "lifestyle",
        image: "assets/images/02-many-moods-01.jpg",
        focus: "45% 30%",
        descFr: "Spontanéité solaire, allure urbaine et matières nobles pour le prêt-à-porter contemporain.",
        descEn: "Sun-drenched spontaneity, natural textures, and urban chic for contemporary ready-to-wear."
      },
      {
        id: "studio-portrait",
        num: "03",
        titleMain: "Studio",
        titleAccent: "Portrait",
        filter: "portrait",
        image: "assets/images/about-portrait.jpg",
        focus: "50% 30%",
        descFr: "Lumière feutrée, intensité du regard et présence sculpturale au service de la beauté pure.",
        descEn: "Masterful studio lighting, commanding gaze, and sculptural poise before the lens."
      },
      {
        id: "commercial-campaign",
        num: "04",
        titleMain: "Commercial",
        titleAccent: "Campaign",
        filter: "commercial",
        image: "assets/images/hero-portrait.jpg",
        focus: "45% 30%",
        descFr: "Énergie magnétique, port de tête altier et valorisation immédiate des pièces clés de marques.",
        descEn: "Magnetic energy and high-end garment desirability for flagship brand campaigns."
      },
      {
        id: "video-motion",
        num: "05",
        titleMain: "Video &",
        titleAccent: "Motion",
        filter: "motion",
        image: "assets/images/comp-card-full.jpg",
        focus: "50% 40%",
        descFr: "Fluidité du mouvement, drapés en apesanteur et narration vivante pour films de mode et digital.",
        descEn: "Kinetic grace, drape fluidity, and living rhythm for brand films and digital storytelling."
      }
    ],
    modelDnaFr: [
      "Présence naturelle",
      "Élégance",
      "Adaptabilité",
      "Expressivité",
      "Polyvalence",
      "Professionnalisme"
    ],
    modelDnaEn: [
      "Natural Presence",
      "Elegance",
      "Adaptability",
      "Expressiveness",
      "Versatility",
      "Professionalism"
    ]
  },

  compCard: {
    pdfUrl: "assets/compcard-dorcas-moira.pdf",
    imageSrc: "assets/images/comp-card-full.jpg",
    imageFocus: "50% 40%",
    placeholder: false,
    credit: null,
    age: "25",
    height: "1m75",
    heightImperial: "5'9\"",
    weight: "65 kg",
    waist: "65 cm",
    waistImperial: "25.5\"",
    bust: "85 cm",
    bustImperial: "33.5\"",
    hips: "99 cm",
    hipsImperial: "39\"",
    shoes: "41 EU / 9.5 US",
    skinFr: "Ébène",
    skinEn: "Ebony",
    hairFr: "Noirs",
    hairEn: "Black",
    eyesFr: "Bruns",
    eyesEn: "Brown",
    location: "Casablanca (Maârif), Maroc",
    openToTravelFr: "Maroc & International",
    openToTravelEn: "Morocco & Worldwide"
  },

  chapters: [
    {
      id: "01-signature",
      number: "01",
      titleFr: "Signature",
      titleEn: "Signature",
      moodFr: "Royauté, intensité & sculpture monochrome",
      moodEn: "Royalty, intensity & sculptural monochrome",
      descriptionFr: "Profil au chapeau à cauris et veste graphique haute couture ; sculpture de profil et contraste noir absolu.",
      descriptionEn: "Regal profile crowned with a cowrie shell diadem and graphic tailored jacket; high-contrast monochrome depth.",
      category: "editorial",
      images: [
        {
          src: "assets/images/01-signature-01.jpg",
          alt: "Dorcas Moïra profil chapeau cauris et veste graphique",
          ratio: "4/5",
          focus: "60% 55%",
          credit: null,
          placeholder: false,
          captionFr: "Profil Chapeau Cauris & Veste Graphique",
          captionEn: "Cowrie Shell Crown & Graphic Tailoring"
        },
        {
          src: "assets/images/01-signature-02.jpg",
          alt: "Dorcas Moïra portrait noir et blanc demi-visage afro fond gris",
          ratio: "4/5",
          focus: "50% 25%",
          credit: null,
          placeholder: false,
          captionFr: "Portrait N&B Demi-Visage & Afro",
          captionEn: "B&W Half-Face Editorial & Afro"
        },
        {
          src: "assets/images/01-signature-03.jpg",
          alt: "Dorcas Moïra sculpture studio haute couture",
          ratio: "4/5",
          focus: "50% 40%",
          credit: null,
          placeholder: true,
          captionFr: "Sculpture Studio Haute Couture",
          captionEn: "Haute Couture Studio Silhouette"
        },
        {
          src: "assets/images/01-signature-04.jpg",
          alt: "Dorcas Moïra ligne pure et regard impérial",
          ratio: "4/5",
          focus: "50% 30%",
          credit: null,
          placeholder: true,
          captionFr: "Ligne Pure & Regard Impérial",
          captionEn: "Pure Lines & Magnetic Gaze"
        }
      ]
    },
    {
      id: "02-many-moods",
      number: "02",
      titleFr: "One Face. Many Moods.",
      titleEn: "One Face. Many Moods.",
      moodFr: "Élégance chaude, intérieurs feutrés & nuances d'or",
      moodEn: "Warm elegance, intimate interiors & golden hues",
      descriptionFr: "Ensemble chocolat couture et tresses ; trench camel en intérieur chaud ; boubou satin lilas aux reflets soyeux.",
      descriptionEn: "Chocolate couture ensemble with braided hair; tailored camel trench bathed in warm interior glow; fluid lilac satin.",
      category: "lifestyle",
      images: [
        {
          src: "assets/images/02-many-moods-01.jpg",
          alt: "Dorcas Moïra ensemble chocolat couture",
          ratio: "4/5",
          focus: "45% 30%",
          credit: null,
          placeholder: false,
          captionFr: "Ensemble Chocolat Couture & Tresses",
          captionEn: "Chocolate Couture & Braids"
        },
        {
          src: "assets/images/02-many-moods-02.jpg",
          alt: "Dorcas Moïra trench camel lumière ambre",
          ratio: "4/5",
          focus: "50% 35%",
          credit: null,
          placeholder: true,
          captionFr: "Trench Camel & Lumière d'Ambre",
          captionEn: "Camel Trench & Amber Glow"
        },
        {
          src: "assets/images/02-many-moods-03.jpg",
          alt: "Dorcas Moïra trench bicolore beige et camel contre table sac à franges",
          ratio: "4/5",
          focus: "50% 25%",
          credit: null,
          placeholder: false,
          captionFr: "Trench Bicolore Beige & Sac à Franges",
          captionEn: "Two-Tone Beige Trench & Fringe Bag"
        },
        {
          src: "assets/images/02-many-moods-04.jpg",
          alt: "Dorcas Moïra trench beige assise sur chaise orange regard caméra",
          ratio: "4/5",
          focus: "50% 30%",
          credit: null,
          placeholder: false,
          captionFr: "Trench Beige sur Chaise Orange",
          captionEn: "Beige Trench on Orange Chair"
        },
        {
          src: "assets/images/02-many-moods-05.jpg",
          alt: "Dorcas Moïra velours et douceur nocturne",
          ratio: "4/5",
          focus: "50% 35%",
          credit: null,
          placeholder: true,
          captionFr: "Velours & Douceur Nocturne",
          captionEn: "Velvet Depth & Nocturnal Serenity"
        }
      ]
    },
    {
      id: "03-afro-chic",
      number: "03",
      titleFr: "Afro Chic Heritage",
      titleEn: "Afro Chic Heritage",
      moodFr: "Héritage africain modernisé & éclat des métaux",
      moodEn: "African heritage modernized & metallic accents",
      descriptionFr: "Pagne indigo traditionnel et denim brut dans un couloir d'hôtel aux appliques dorées ; kimono wax/bogolan rouille à ceinture dorée martelée.",
      descriptionEn: "Ancestral indigo cloth paired with dark denim in a gold-sconced hotel hallway; rust wax kimono cinched with hammered gold clasp.",
      category: "afro-chic",
      images: [
        {
          src: "assets/images/03-afro-chic-01.jpg",
          alt: "Dorcas Moïra pagne indigo et jean couloir hôtel",
          ratio: "4/5",
          focus: "50% 35%",
          credit: null,
          placeholder: false,
          captionFr: "Couloir d'Hôtel · Pagne Indigo & Denim",
          captionEn: "Hotel Hallway · Indigo Cloth & Denim"
        },
        {
          src: "assets/images/03-afro-chic-02.jpg",
          alt: "Dorcas Moïra kimono wax rouille souriante",
          ratio: "4/5",
          focus: "50% 25%",
          credit: null,
          placeholder: false,
          captionFr: "Kimono Wax Rouille & Sourire",
          captionEn: "Rust Wax Kimono & Radiant Smile"
        },
        {
          src: "assets/images/03-afro-chic-03.jpg",
          alt: "Dorcas Moïra robe blanche à cordons en spirale et tresses regard par-dessus l'épaule",
          ratio: "4/5",
          focus: "50% 25%",
          credit: null,
          placeholder: false,
          captionFr: "Robe Blanche Spirale & Tresses",
          captionEn: "White Spiral Dress & Braids"
        },
        {
          src: "assets/images/03-afro-chic-04.jpg",
          alt: "Dorcas Moïra tissage traditionnel et lignes modernes",
          ratio: "4/5",
          focus: "50% 40%",
          credit: null,
          placeholder: true,
          captionFr: "Tissage Traditionnel & Lignes Modernes",
          captionEn: "Ancestral Weaving & Modern Silhouettes"
        },
        {
          src: "assets/images/03-afro-chic-05.jpg",
          alt: "Dorcas Moïra parure royale et allure afro-chic",
          ratio: "4/5",
          focus: "50% 30%",
          credit: null,
          placeholder: true,
          captionFr: "Parure Royale & Allure Afro-Chic",
          captionEn: "Royal Adornments & Afro-Chic Presence"
        }
      ]
    },
    {
      id: "04-studio-presence",
      number: "04",
      titleFr: "Pure Studio Presence",
      titleEn: "Pure Studio Presence",
      moodFr: "Épure, présence magnétique & contrastes vibrants",
      moodEn: "Minimalism, magnetic gaze & vibrant contrast",
      descriptionFr: "Boubou patchwork rouge/marine/argent en damier, fond studio clair ; série N&B en couleur sélective, veste en jean.",
      descriptionEn: "Vibrant scarlet, navy and silver checkerboard boubou on bright cyclorama; monochrome series featuring selective color accents.",
      category: "studio",
      images: [
        {
          src: "assets/images/04-studio-01.jpg",
          alt: "Dorcas Moïra veste en jean N&B et boucle d'oreille orange en couleur",
          ratio: "4/5",
          focus: "50% 30%",
          credit: null,
          placeholder: false,
          captionFr: "Veste Denim & Boucle Orange",
          captionEn: "Denim & Orange Statement Earring"
        },
        {
          src: "assets/images/04-studio-02.jpg",
          alt: "Dorcas Moïra cyclorama clair et géométrie",
          ratio: "4/5",
          focus: "50% 35%",
          credit: null,
          placeholder: true,
          captionFr: "Cyclorama Clair & Géométrie",
          captionEn: "Bright Cyclorama & Geometric Precision"
        },
        {
          src: "assets/images/04-studio-03.jpg",
          alt: "Dorcas Moïra couleur sélective boucles jaunes",
          ratio: "4/5",
          focus: "50% 30%",
          credit: null,
          placeholder: true,
          captionFr: "Couleur Sélective & Boucles Solaires",
          captionEn: "Selective Color & Solar Earrings"
        },
        {
          src: "assets/images/04-studio-04.jpg",
          alt: "Dorcas Moïra veste en jean et regard magnétique",
          ratio: "4/5",
          focus: "50% 30%",
          credit: null,
          placeholder: true,
          captionFr: "Veste Denim & Regard Magnétique",
          captionEn: "Denim Jacket & Magnetic Eye Contact"
        },
        {
          src: "assets/images/04-studio-05.jpg",
          alt: "Dorcas Moïra ombre portée et contraste épuré",
          ratio: "4/5",
          focus: "50% 40%",
          credit: null,
          placeholder: true,
          captionFr: "Ombre Portée & Contraste Épuré",
          captionEn: "Cast Shadows & Crisp Contrast"
        },
        {
          src: "assets/images/04-studio-06.jpg",
          alt: "Dorcas Moïra portrait serré studio lumière haute",
          ratio: "4/5",
          focus: "50% 25%",
          credit: null,
          placeholder: true,
          captionFr: "Portrait Serré · High-Key Studio",
          captionEn: "Tight Portrait · High-Key Lighting"
        },
        {
          src: "assets/images/04-studio-07.jpg",
          alt: "Dorcas Moïra silhouette monochrome",
          ratio: "4/5",
          focus: "50% 35%",
          credit: null,
          placeholder: true,
          captionFr: "Silhouette Monochrome & Présence",
          captionEn: "Monochrome Silhouette & Pure Stature"
        },
        {
          src: "assets/images/04-studio-08.jpg",
          alt: "Dorcas Moïra architecture corporelle et pose nette",
          ratio: "4/5",
          focus: "50% 40%",
          credit: null,
          placeholder: true,
          captionFr: "Architecture Corporelle & Pose Nette",
          captionEn: "Bodily Architecture & Sharp Posing"
        },
        {
          src: "assets/images/04-studio-09.jpg",
          alt: "Dorcas Moïra studio électrique éclat cuivré",
          ratio: "4/5",
          focus: "50% 35%",
          credit: null,
          placeholder: true,
          captionFr: "Studio Électrique & Éclat Cuivré",
          captionEn: "Electric Studio Lights & Copper Highlights"
        },
        {
          src: "assets/images/04-studio-10.jpg",
          alt: "Dorcas Moïra minimalisme noir et blanc intense",
          ratio: "4/5",
          focus: "50% 30%",
          credit: null,
          placeholder: true,
          captionFr: "Minimalisme N&B Intense",
          captionEn: "Intense Minimalist Monochrome"
        }
      ]
    },
    {
      id: "05-sun-kissed",
      number: "05",
      titleFr: "Sun-Kissed Stories",
      titleEn: "Sun-Kissed Stories",
      moodFr: "Solaire, sensuel & chorégraphie océanique",
      moodEn: "Solar, sensual & oceanic choreography",
      descriptionFr: "Plage de nuit sous halo bleu profond, drapé blanc immaculé fendu, parure et bijoux dorés scintillants sur peau d'ébène.",
      descriptionEn: "Nocturnal Atlantic shoreline beneath a deep blue halo; fluttering split white drape and hammered golden jewels on ebony skin.",
      category: "beauty",
      images: [
        {
          src: "assets/images/05-sun-kissed-01.jpg",
          alt: "Dorcas Moïra plage de nuit drapé blanc fendu bijoux dorés",
          ratio: "4/5",
          focus: "50% 40%",
          credit: null,
          placeholder: false,
          captionFr: "Plage de Nuit & Drapé Blanc Céleste",
          captionEn: "Nocturnal Beach & Celestial White Drape"
        },
        {
          src: "assets/images/05-sun-kissed-02.jpg",
          alt: "Dorcas Moïra drapé blanc corde contre un bateau",
          ratio: "4/5",
          focus: "50% 30%",
          credit: "KeyFilm Photographie",
          placeholder: false,
          captionFr: "Drapé Blanc Corde & Bateau",
          captionEn: "White Drape & Seaside Boat"
        },
        {
          src: "assets/images/05-sun-kissed-03.jpg",
          alt: "Dorcas Moïra drapé blanc en mouvement de danse",
          ratio: "4/5",
          focus: "50% 25%",
          credit: "KeyFilm Photographie",
          placeholder: false,
          captionFr: "Drapé Blanc & Mouvement de Danse",
          captionEn: "White Drape & Flowing Dance"
        },
        {
          src: "assets/images/05-sun-kissed-04.jpg",
          alt: "Dorcas Moïra reflets lunaires sur la peau",
          ratio: "4/5",
          focus: "50% 40%",
          credit: null,
          placeholder: true,
          captionFr: "Reflets Lunaires sur Peau d'Ébène",
          captionEn: "Moonlit Sheen on Ebony Skin"
        },
        {
          src: "assets/images/05-sun-kissed-05.jpg",
          alt: "Dorcas Moïra chorégraphie marine au crépuscule",
          ratio: "4/5",
          focus: "50% 40%",
          credit: null,
          placeholder: true,
          captionFr: "Chorégraphie Marine au Crépuscule",
          captionEn: "Dusk Oceanic Choreography"
        }
      ]
    },
    {
      id: "06-visual-chapters",
      number: "06",
      titleFr: "Visual Chapters",
      titleEn: "Visual Chapters",
      moodFr: "Mosaïque libre & Richesse des univers",
      moodEn: "Free editorial mosaic & expressive spectrum",
      descriptionFr: "42 looks exclusifs couvrant l'éditorial haute couture, l'afro-chic, le studio, les campagnes commerciales, la beauté et le lifestyle.",
      descriptionEn: "42 curated looks spanning high-fashion editorials, afro-chic heritage, studio captures, commercial campaigns, beauty, and lifestyle.",
      category: "all",
      mosaicCount: 42,
      images: Array.from({ length: 42 }, (_, i) => {
        const num = i + 1;
        const pad = String(num).padStart(2, '0');
        const categories = ["editorial", "afro-chic", "studio", "commercial", "beauty", "lifestyle"];
        const cat = categories[i % categories.length];
        const isTall = (num % 3 === 0);
        const credits = ["Wazfeel", "Daily Desiign", "Kuba Concept Store", "Dimension Beyond", "Nourima", "Djino"];
        const isFirst = (i === 0);
        return {
          src: `assets/images/06-visual-${pad}.jpg`,
          alt: isFirst ? "Dorcas Moïra trench marron en pied lunettes et sculpture orange" : `Dorcas Moïra Look ${pad} - ${cat.toUpperCase()}`,
          category: cat,
          ratio: isTall ? "9/16" : "4/5",
          isTall: isTall,
          focus: isFirst ? "50% 20%" : (isTall ? "50% 35%" : "50% 30%"),
          placeholder: isFirst ? false : true,
          credit: null,
          captionFr: isFirst ? "Trench Marron & Sculpture Orange" : `Look ${pad} · ${cat.toUpperCase()}`,
          captionEn: isFirst ? "Brown Trench & Orange Sculpture" : `Look ${pad} · ${cat.toUpperCase()}`
        };
      })
    }
  ],

  whyChooseMe: [
    {
      num: "01",
      titleFr: "Direction Artistique Aiguë",
      titleEn: "Sharp Creative Direction",
      descFr: "Je comprends rapidement une vision créative et je sais lui donner vie devant l'objectif, en traduisant chaque intention en gestuelle précise.",
      descEn: "I quickly grasp a director's vision, bringing it to life in front of the lens with sculptural accuracy and effortless intuition."
    },
    {
      num: "02",
      titleFr: "Polyvalence Stylistique",
      titleEn: "Stylistic Versatility",
      descFr: "Du portrait éditorial à la campagne commerciale grand public, j'adapte mon jeu, mon attitude et mon regard sans jamais diluer mon identité unique.",
      descEn: "From high-end editorial close-ups to vibrant commercial campaigns, I adapt my posture and gaze without ever compromising my identity."
    },
    {
      num: "03",
      titleFr: "Énergie Jeune & Actuelle",
      titleEn: "Fresh & Contemporary Aura",
      descFr: "Une image fraîche, magnétique et résolument ancrée dans les codes visuels des marques modernes et des plateformes digitales premium.",
      descEn: "A vibrant, magnetic aesthetic tailored for contemporary brands and the high-engagement demands of premium digital platforms."
    },
    {
      num: "04",
      titleFr: "Professionnalisme & Rigueur",
      titleEn: "Uncompromising Professionalism",
      descFr: "Ponctuelle, investie, endurante et bienveillante, je considère chaque collaboration comme un véritable partenariat créatif d'excellence.",
      descEn: "Punctual, committed, and resilient, I approach every shoot as a collaborative partnership built on mutual respect and excellence."
    },
    {
      num: "05",
      titleFr: "Création de Valeur Réelle",
      titleEn: "Measurable Brand Value",
      descFr: "Je ne cherche pas uniquement à poser : je contribue activement à concevoir des images captivantes qui magnifient le produit et renforcent l'image de marque.",
      descEn: "I go beyond simply posing: I actively help craft striking visuals that elevate product desirability and strengthen brand equity."
    }
  ],

  whyChooseMeImage: {
    src: "assets/images/beauty-portrait.jpg",
    alt: "Dorcas Moïra portrait beauté en top rouge lumière dorée",
    focus: "35% 30%",
    placeholder: false
  },

  digitals: [
    {
      id: "digital-01-face",
      titleFr: "Polaroid Face",
      src: "assets/images/digital-01-face.jpg",
      alt: "Dorcas Moïra polaroid digital t-shirt blanc visage au naturel",
      focus: "50% 30%",
      placeholder: false,
      captionFr: "Digital 01 · Portrait Face Naturel (Sans Fard)"
    }
  ],

  timeline: [
    {
      year: "2023",
      eventFr: "Shooting photo officiel de campagne, <strong>Daily Desiign</strong>",
      eventEn: "Official campaign photoshoot, <strong>Daily Desiign</strong>"
    },
    {
      year: "2024",
      eventFr: "Défilé de marque haute couture, <strong>Kuba Concept Store</strong>",
      eventEn: "Haute couture runway show, <strong>Kuba Concept Store</strong>",
      image: "assets/images/timeline-2024-kuba.jpg",
      caption: "Défilé — Kuba Concept Store"
    },
    {
      year: "2025/26",
      eventFr: "Shootings de campagnes phares : <strong>Dimension Beyond the Extrêmes · Djino · Nourima</strong>",
      eventEn: "Flagship campaign shoots: <strong>Dimension Beyond the Extrêmes · Djino · Nourima</strong>",
      image: "assets/images/timeline-2026-djino-backstage.jpg",
      caption: "Coulisses — Campagne Djino"
    },
    {
      year: "2026",
      eventFr: "Candidate officielle au prestigieux concours <strong>Miss Gabon Maroc 2026</strong>",
      eventEn: "Official candidate for the prestigious <strong>Miss Gabon Morocco 2026</strong> Pageant"
    }
  ],

  digitalMetrics: [
    {
      value: 100000,
      display: "+100K",
      labelFr: "Vues cumulées sur TikTok",
      labelEn: "Total TikTok Video Views",
      subFr: "Portée virale organique",
      subEn: "Organic viral reach",
      url: "https://www.tiktok.com/@dorcas_moira"
    },
    {
      value: 63300,
      display: "63,3K",
      labelFr: "Likes & Réactions TikTok",
      labelEn: "TikTok Likes & Interactions",
      subFr: "Forte adhésion de communauté",
      subEn: "High community engagement",
      url: "https://www.tiktok.com/@dorcas_moira"
    },
    {
      value: 28100,
      display: "28,1K",
      labelFr: "Vues Instagram sur 30 jours",
      labelEn: "30-Day Instagram Impressions",
      subFr: "Audience mode qualifiée",
      subEn: "Fashion-forward audience",
      url: "https://www.instagram.com/dorc.as_moira/"
    },
    {
      value: 26000,
      display: "26K",
      labelFr: "Vues mensuelles Pinterest",
      labelEn: "Monthly Pinterest Views",
      subFr: "Inspiration moodboards & lookbooks",
      subEn: "Moodboard curation traction",
      url: "https://pin.it/1GRwMbeNP"
    }
  ],

  brandPartners: [
    "Wazfeel",
    "Nourima",
    "Djino",
    "Dimension Beyond the Extrêmes",
    "Kentegentlemen",
    "Kumi",
    "Kissywears",
    "Atelier by Zarafa",
    "Maison Nyanga",
    "Akalia",
    "Kuba Concept Store",
    "Daily Desiign"
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PORTFOLIO_DATA;
} else if (typeof window !== 'undefined') {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}
