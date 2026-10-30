
/**
 * DORCAS MOÏRA - PORTFOLIO DATA ARCHITECTURE (AWWWARDS EDITION)
 * Centralized data store: Bilingual copy, Focal Points ("focus"), Photographer Credits ("credit"),
 * Model measurements, dynamic variable photo chapters, and booking configurations.
 */

const CREDITS = {
  agency: "Digitech Web",
  url: "https://digitechweb-mljp.vercel.app/",
  labelFr: "Conçu & développé par",
  labelEn: "Designed & built by"
};

const PORTFOLIO_DATA = {
  credits: CREDITS,
  MIN_PHOTOS_PER_CHAPTER: 3,
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
      category: "editorial",
      images: [
        {
          src: "assets/images/01-signature-01.jpg",
          alt: "Dorcas Moïra — Signature, photo 1",
          ratio: "4/5",
          focus: "60% 55%",
          credit: null
        },
        {
          src: "assets/images/01-signature-02.jpg",
          alt: "Dorcas Moïra — Signature, photo 2",
          ratio: "4/5",
          focus: "50% 25%",
          credit: null
        }
      ]
    },
    {
      id: "02-many-moods",
      number: "02",
      titleFr: "One Face. Many Moods.",
      titleEn: "One Face. Many Moods.",
      category: "lifestyle",
      images: [
        {
          src: "assets/images/02-many-moods-01.jpg",
          alt: "Dorcas Moïra — One Face Many Moods, photo 1",
          ratio: "4/5",
          focus: "45% 30%",
          credit: null
        },
        {
          src: "assets/images/02-many-moods-03.jpg",
          alt: "Dorcas Moïra — One Face Many Moods, photo 2",
          ratio: "4/5",
          focus: "50% 25%",
          credit: null
        },
        {
          src: "assets/images/02-many-moods-04.jpg",
          alt: "Dorcas Moïra — One Face Many Moods, photo 3",
          ratio: "4/5",
          focus: "50% 30%",
          credit: null
        },
        {
          src: "assets/images/02-many-moods-05.jpg",
          alt: "Dorcas Moïra — One Face Many Moods, photo 4",
          ratio: "4/5",
          focus: "45% 25%",
          credit: null
        }
      ]
    },
    {
      id: "03-afro-chic",
      number: "03",
      titleFr: "Afro Chic Heritage",
      titleEn: "Afro Chic Heritage",
      category: "afro-chic",
      images: [
        {
          src: "assets/images/03-afro-chic-01.jpg",
          alt: "Dorcas Moïra — Afro Chic Heritage, photo 1",
          ratio: "4/5",
          focus: "50% 35%",
          credit: null
        },
        {
          src: "assets/images/03-afro-chic-02.jpg",
          alt: "Dorcas Moïra — Afro Chic Heritage, photo 2",
          ratio: "4/5",
          focus: "50% 25%",
          credit: null
        },
        {
          src: "assets/images/03-afro-chic-03.jpg",
          alt: "Dorcas Moïra — Afro Chic Heritage, photo 3",
          ratio: "4/5",
          focus: "50% 25%",
          credit: null
        }
      ]
    },
    {
      id: "04-studio",
      number: "04",
      titleFr: "Pure Studio Presence",
      titleEn: "Pure Studio Presence",
      category: "studio",
      images: [
        {
          src: "assets/images/04-studio-01.jpg",
          alt: "Dorcas Moïra — Pure Studio Presence, photo 1",
          ratio: "4/5",
          focus: "50% 30%",
          credit: null
        },
        {
          src: "assets/images/04-studio-02.jpg",
          alt: "Dorcas Moïra — Pure Studio Presence, photo 2",
          ratio: "4/5",
          focus: "55% 35%",
          credit: null
        },
        {
          src: "assets/images/04-studio-03.jpg",
          alt: "Dorcas Moïra — Pure Studio Presence, photo 3",
          ratio: "4/5",
          focus: "50% 20%",
          credit: null
        }
      ]
    },
    {
      id: "05-sun-kissed",
      number: "05",
      titleFr: "Sun-Kissed Stories",
      titleEn: "Sun-Kissed Stories",
      category: "beauty",
      images: [
        {
          src: "assets/images/05-sun-kissed-01.jpg",
          alt: "Dorcas Moïra — Sun-Kissed Stories, photo 1",
          ratio: "4/5",
          focus: "50% 40%",
          credit: null
        },
        {
          src: "assets/images/05-sun-kissed-02.jpg",
          alt: "Dorcas Moïra — Sun-Kissed Stories, photo 2",
          ratio: "4/5",
          focus: "50% 30%",
          credit: "KeyFilm Photographie"
        },
        {
          src: "assets/images/05-sun-kissed-03.jpg",
          alt: "Dorcas Moïra — Sun-Kissed Stories, photo 3",
          ratio: "4/5",
          focus: "50% 25%",
          credit: "KeyFilm Photographie"
        }
      ]
    },
    {
      id: "06-visual",
      number: "06",
      titleFr: "Visual Chapters",
      titleEn: "Visual Chapters",
      category: "editorial",
      images: [
        {
          src: "assets/images/06-visual-01.jpg",
          alt: "Dorcas Moïra — Visual Chapters, photo 1",
          ratio: "4/5",
          focus: "50% 25%",
          credit: null
        },
        {
          src: "assets/images/06-visual-02.jpg",
          alt: "Dorcas Moïra — Visual Chapters, photo 2",
          ratio: "4/5",
          focus: "50% 30%",
          credit: null
        },
        {
          src: "assets/images/06-visual-03.jpg",
          alt: "Dorcas Moïra — Visual Chapters, photo 3",
          ratio: "4/5",
          focus: "50% 45%",
          credit: null
        },
        {
          src: "assets/images/06-visual-04.jpg",
          alt: "Dorcas Moïra — Visual Chapters, photo 4",
          ratio: "4/5",
          focus: "50% 50%",
          credit: null
        }
      ]
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
    alt: "Dorcas Moïra — Beauté",
    focus: "35% 30%"
  },

  digitals: [
    {
      id: "digital-01-face",
      src: "assets/images/digital-01-face.jpg",
      alt: "Dorcas Moïra — Digital 01",
      focus: "50% 30%",
      credit: null
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
      
    },
    {
      year: "2025/26",
      eventFr: "Shootings de campagnes phares : <strong>Dimension Beyond the Extrêmes · Djino · Nourima</strong>",
      eventEn: "Flagship campaign shoots: <strong>Dimension Beyond the Extrêmes · Djino · Nourima</strong>",
      image: "assets/images/timeline-2026-djino-backstage.jpg",
      
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
