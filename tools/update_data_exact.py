#!/usr/bin/env python3
"""
tools/update_data_exact.py
Updates js/data.js with exact replacements for newly integrated photos.
"""

def update_data():
    with open("js/data.js", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. 01-signature-02
    old_sig2 = '''        {
          src: "assets/images/01-signature-02.jpg",
          alt: "Dorcas Moïra robe bustier volants noir et blanc",
          ratio: "4/5",
          focus: "50% 35%",
          credit: null,
          placeholder: true,
          captionFr: "Robe Bustier Volants Graphiques",
          captionEn: "Graphic Ruffled Bustier"
        },'''
    new_sig2 = '''        {
          src: "assets/images/01-signature-02.jpg",
          alt: "Dorcas Moïra portrait noir et blanc demi-visage afro fond gris",
          ratio: "4/5",
          focus: "50% 25%",
          credit: null,
          placeholder: false,
          captionFr: "Portrait N&B Demi-Visage & Afro",
          captionEn: "B&W Half-Face Editorial & Afro"
        },'''
    assert old_sig2 in content, "old_sig2 not found"
    content = content.replace(old_sig2, new_sig2)

    # 2. 02-many-moods-03
    old_mm3 = '''        {
          src: "assets/images/02-many-moods-03.jpg",
          alt: "Dorcas Moïra ensemble chocolat sur pantalon doré",
          ratio: "4/5",
          focus: "50% 35%",
          credit: null,
          placeholder: true,
          captionFr: "Couture Chocolat & Or Soie",
          captionEn: "Chocolate Couture & Golden Silk"
        },'''
    new_mm3 = '''        {
          src: "assets/images/02-many-moods-03.jpg",
          alt: "Dorcas Moïra trench bicolore beige et camel contre table sac à franges",
          ratio: "4/5",
          focus: "50% 25%",
          credit: null,
          placeholder: false,
          captionFr: "Trench Bicolore Beige & Sac à Franges",
          captionEn: "Two-Tone Beige Trench & Fringe Bag"
        },'''
    assert old_mm3 in content, "old_mm3 not found"
    content = content.replace(old_mm3, new_mm3)

    # 3. 02-many-moods-04
    old_mm4 = '''        {
          src: "assets/images/02-many-moods-04.jpg",
          alt: "Dorcas Moïra intérieur feutré nuances chaudes",
          ratio: "4/5",
          focus: "50% 40%",
          credit: null,
          placeholder: true,
          captionFr: "Intérieur Feutré & Nuances Chaudes",
          captionEn: "Muted Interior & Warm Tones"
        },'''
    new_mm4 = '''        {
          src: "assets/images/02-many-moods-04.jpg",
          alt: "Dorcas Moïra trench beige assise sur chaise orange regard caméra",
          ratio: "4/5",
          focus: "50% 30%",
          credit: null,
          placeholder: false,
          captionFr: "Trench Beige sur Chaise Orange",
          captionEn: "Beige Trench on Orange Chair"
        },'''
    assert old_mm4 in content, "old_mm4 not found"
    content = content.replace(old_mm4, new_mm4)

    # 4. 03-afro-chic-02
    old_ac2 = '''        {
          src: "assets/images/03-afro-chic-02.jpg",
          alt: "Dorcas Moïra kimono wax rouille ceinture dorée",
          ratio: "4/5",
          focus: "45% 30%",
          credit: null,
          placeholder: true,
          captionFr: "Kimono Wax Bogolan & Ceinture Dorée",
          captionEn: "Bogolan Kimono & Golden Clasp"
        },'''
    new_ac2 = '''        {
          src: "assets/images/03-afro-chic-02.jpg",
          alt: "Dorcas Moïra kimono wax rouille souriante",
          ratio: "4/5",
          focus: "50% 25%",
          credit: null,
          placeholder: false,
          captionFr: "Kimono Wax Rouille & Sourire",
          captionEn: "Rust Wax Kimono & Radiant Smile"
        },'''
    assert old_ac2 in content, "old_ac2 not found"
    content = content.replace(old_ac2, new_ac2)

    # 5. 03-afro-chic-03
    old_ac3 = '''        {
          src: "assets/images/03-afro-chic-03.jpg",
          alt: "Dorcas Moïra couloir d'or et appliques sculptées",
          ratio: "4/5",
          focus: "50% 35%",
          credit: null,
          placeholder: true,
          captionFr: "Couloir d'Or & Appliques Sculptées",
          captionEn: "Golden Gallery & Sculpted Sconces"
        },'''
    new_ac3 = '''        {
          src: "assets/images/03-afro-chic-03.jpg",
          alt: "Dorcas Moïra robe blanche à cordons en spirale et tresses regard par-dessus l'épaule",
          ratio: "4/5",
          focus: "50% 25%",
          credit: null,
          placeholder: false,
          captionFr: "Robe Blanche Spirale & Tresses",
          captionEn: "White Spiral Dress & Braids"
        },'''
    assert old_ac3 in content, "old_ac3 not found"
    content = content.replace(old_ac3, new_ac3)

    # 6. 04-studio-01
    old_st1 = '''        {
          src: "assets/images/04-studio-01.jpg",
          alt: "Dorcas Moïra damier patchwork rouge argent",
          ratio: "4/5",
          focus: "50% 35%",
          credit: null,
          placeholder: true,
          captionFr: "Damier Patchwork Rouge & Argent",
          captionEn: "Checkerboard Patchwork · Scarlet & Silver"
        },'''
    new_st1 = '''        {
          src: "assets/images/04-studio-01.jpg",
          alt: "Dorcas Moïra veste en jean N&B et boucle d'oreille orange en couleur",
          ratio: "4/5",
          focus: "50% 30%",
          credit: null,
          placeholder: false,
          captionFr: "Veste Denim & Boucle Orange",
          captionEn: "Denim & Orange Statement Earring"
        },'''
    assert old_st1 in content, "old_st1 not found"
    content = content.replace(old_st1, new_st1)

    # 7. 05-sun-kissed-02
    old_sk2 = '''        {
          src: "assets/images/05-sun-kissed-02.jpg",
          alt: "Dorcas Moïra halo bleu océan et sensualité",
          ratio: "4/5",
          focus: "50% 35%",
          credit: null,
          placeholder: true,
          captionFr: "Halo Bleu Océan & Sensualité",
          captionEn: "Ocean Blue Halo & Fluid Movement"
        },'''
    new_sk2 = '''        {
          src: "assets/images/05-sun-kissed-02.jpg",
          alt: "Dorcas Moïra drapé blanc corde contre un bateau",
          ratio: "4/5",
          focus: "50% 30%",
          credit: "KeyFilm Photographie",
          placeholder: false,
          captionFr: "Drapé Blanc Corde & Bateau",
          captionEn: "White Drape & Seaside Boat"
        },'''
    assert old_sk2 in content, "old_sk2 not found"
    content = content.replace(old_sk2, new_sk2)

    # 8. 05-sun-kissed-03
    old_sk3 = '''        {
          src: "assets/images/05-sun-kissed-03.jpg",
          alt: "Dorcas Moïra bijoux dorés et poses dansées",
          ratio: "4/5",
          focus: "50% 35%",
          credit: null,
          placeholder: true,
          captionFr: "Bijoux Dorés & Poses Dansées",
          captionEn: "Golden Ornaments & Dancing Poses"
        },'''
    new_sk3 = '''        {
          src: "assets/images/05-sun-kissed-03.jpg",
          alt: "Dorcas Moïra drapé blanc en mouvement de danse",
          ratio: "4/5",
          focus: "50% 25%",
          credit: "KeyFilm Photographie",
          placeholder: false,
          captionFr: "Drapé Blanc & Mouvement de Danse",
          captionEn: "White Drape & Flowing Dance"
        },'''
    assert old_sk3 in content, "old_sk3 not found"
    content = content.replace(old_sk3, new_sk3)

    # 9. 06-visual-01
    old_vis = '''          placeholder: true,'''
    new_vis = '''          placeholder: idx === 0 ? false : true,
          credit: null,
          focus: idx === 0 ? "50% 20%" : "50% 35%",'''
    assert old_vis in content, "old_vis not found"
    content = content.replace(old_vis, new_vis, 1)

    # 10. Add whyChooseMeImage, digitals, and update timeline
    old_timeline_block = '''  timeline: [
    {
      year: "2023",
      eventFr: "Shooting photo officiel de campagne, <strong>Daily Desiign</strong>",
      eventEn: "Official campaign photoshoot, <strong>Daily Desiign</strong>"
    },
    {
      year: "2024",
      eventFr: "Défilé de marque haute couture, <strong>Kuba Concept Store</strong>",
      eventEn: "Haute couture runway show, <strong>Kuba Concept Store</strong>"
    },
    {
      year: "2025/26",
      eventFr: "Shootings de campagnes phares : <strong>Dimension Beyond the Extrêmes · Djino · Nourima</strong>",
      eventEn: "Flagship campaign shoots: <strong>Dimension Beyond the Extrêmes · Djino · Nourima</strong>"
    },
    {
      year: "2026",
      eventFr: "Candidate officielle au prestigieux concours <strong>Miss Gabon Maroc 2026</strong>",
      eventEn: "Official candidate for the prestigious <strong>Miss Gabon Morocco 2026</strong> Pageant"
    }
  ],'''

    new_timeline_block = '''  whyChooseMeImage: {
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
  ],'''

    assert old_timeline_block in content, "old_timeline_block not found"
    content = content.replace(old_timeline_block, new_timeline_block)

    with open("js/data.js", "w", encoding="utf-8") as f:
        f.write(content)
    print("[SUCCESS] js/data.js updated with exact substitutions!")

if __name__ == "__main__":
    update_data()
