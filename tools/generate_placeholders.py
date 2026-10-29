#!/usr/bin/env python3
"""
generate_placeholders.py - Générateur d'aplats neutres haute couture pour Dorcas Moïra
Conforme aux exigences DA :
- Aplats neutres uniquement (dégradé espresso, ratio et nom du fichier écrits dessus)
- Aucune silhouette, aucun visage, aucune représentation de personne
- Palette stricte : #0B0807, #1E140F, #B87A52, #E3B48C, #F3E6D8
- Exactement 75 images générées (Signature 4, Many Moods 5, Afro Chic 5, Studio 10, Sun-Kissed 5, Visual Chapters 42, + Hero, Comp Card, Brand Why, Contact)
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont

os.makedirs('assets/images', exist_ok=True)

# Définition des 75 images requises
images_list = []

# Hero, Comp Card, Brand, Contact
images_list.append({
    "file": "hero-portrait.jpg", "w": 1200, "h": 1600, "ratio": "4:5 / 3:4", 
    "chapter": "HERO COVER", "title": "Portrait Vertical Studio", "cat": "hero"
})
images_list.append({
    "file": "comp-card-full.jpg", "w": 1000, "h": 1500, "ratio": "4:5 / 2:3", 
    "chapter": "COMP CARD", "title": "Silhouette Plein Pied Agence", "cat": "compcard"
})
images_list.append({
    "file": "brand-why-portrait.jpg", "w": 1000, "h": 1333, "ratio": "4:5", 
    "chapter": "POURQUOI MOI", "title": "Portrait Beauté & Fard Doré", "cat": "beauty"
})
images_list.append({
    "file": "contact-portrait.jpg", "w": 1000, "h": 1333, "ratio": "4:5", 
    "chapter": "LET'S CREATE", "title": "Afro Fleuri & Regard", "cat": "contact"
})

# 01 · Signature (4 photos)
sig_titles = [
    "Profil Royal au Diadème · N&B",
    "Robe Bustier Volants Graphiques",
    "Sculpture Studio Haute Couture",
    "Ligne Pure & Regard Impérial"
]
for i in range(1, 5):
    images_list.append({
        "file": f"01-signature-{i:02d}.jpg", "w": 1000, "h": 1250, "ratio": "4:5",
        "chapter": "01 · SIGNATURE", "title": sig_titles[i-1], "cat": "editorial"
    })

# 02 · One Face. Many Moods. (5 photos)
mood_titles = [
    "Boubou Satin Lilas Brodé",
    "Trench Camel & Lumière d'Ambre",
    "Couture Chocolat & Or Soie",
    "Intérieur Feutré & Nuances Chaudes",
    "Velours & Douceur Nocturne"
]
for i in range(1, 6):
    images_list.append({
        "file": f"02-many-moods-{i:02d}.jpg", "w": 1000, "h": 1250, "ratio": "4:5",
        "chapter": "02 · MANY MOODS", "title": mood_titles[i-1], "cat": "lifestyle"
    })

# 03 · Afro Chic Heritage (5 photos)
afro_titles = [
    "Kimono Wax Bogolan & Ceinture Dorée",
    "Indigo Fusion & Denim Brut",
    "Couloir d'Or & Appliques Sculptées",
    "Tissage Traditionnel & Lignes Modernes",
    "Parure Royale & Allure Afro-Chic"
]
for i in range(1, 6):
    images_list.append({
        "file": f"03-afro-chic-{i:02d}.jpg", "w": 1000, "h": 1250, "ratio": "4:5",
        "chapter": "03 · AFRO CHIC", "title": afro_titles[i-1], "cat": "afro-chic"
    })

# 04 · Pure Studio Presence (10 photos)
studio_titles = [
    "Damier Patchwork Rouge & Argent",
    "Cyclorama Clair & Géométrie",
    "Couleur Sélective & Boucles Jaunes",
    "Veste en Jean & Regard Magnétique",
    "Ombre Portée & Contraste Épuré",
    "Portrait Serré Studio Lumière Haute",
    "Silhouette Monochrome & Présence",
    "Architecture Corporelle & Pose Nette",
    "Studio Électrique & Éclat Cuivré",
    "Minimalisme Noir & Blanc Intense"
]
for i in range(1, 11):
    images_list.append({
        "file": f"04-studio-{i:02d}.jpg", "w": 1000, "h": 1250, "ratio": "4:5",
        "chapter": "04 · STUDIO PRESENCE", "title": studio_titles[i-1], "cat": "studio"
    })

# 05 · Sun-Kissed Stories (5 photos)
sun_titles = [
    "Plage de Nuit & Drapé Blanc Céleste",
    "Halo Bleu Océan & Sensualité",
    "Bijoux Dorés & Poses Dansées",
    "Reflets Lunaires sur la Peau",
    "Chorégraphie Marine au Crépuscule"
]
for i in range(1, 6):
    images_list.append({
        "file": f"05-sun-kissed-{i:02d}.jpg", "w": 1000, "h": 1250, "ratio": "4:5",
        "chapter": "05 · SUN-KISSED", "title": sun_titles[i-1], "cat": "beauty"
    })

# 06 · Visual Chapters (42 photos avec alternance 4:5 et 9:16)
visual_categories = ["editorial", "afro-chic", "studio", "commercial", "beauty", "lifestyle"]
for i in range(1, 43):
    is_tall = (i % 3 == 0) # 1 image sur 3 en 9:16
    cat = visual_categories[(i - 1) % len(visual_categories)]
    w = 900 if is_tall else 1000
    h = 1600 if is_tall else 1250
    ratio_str = "9:16" if is_tall else "4:5"
    images_list.append({
        "file": f"06-visual-{i:02d}.jpg", "w": w, "h": h, "ratio": ratio_str,
        "chapter": "06 · VISUAL CHAPTERS", "title": f"Look {i:02d} · {cat.upper()}", "cat": cat
    })

def make_neutral_aplat(item):
    w, h = item["w"], item["h"]
    # Base espresso sombre
    img = Image.new("RGB", (w, h), (18, 13, 10))
    draw = ImageDraw.Draw(img)

    # Dégradé radial doux studio espresso / ambre (#140D0A -> #2A1A12)
    cx, cy = w // 2, int(h * 0.45)
    max_r = int(math.hypot(w, h) * 0.55)
    steps = 30
    for s in range(steps, 0, -1):
        radius = int(max_r * (s / steps))
        factor = (1.0 - (s / steps)) ** 1.6
        r = int(14 + factor * 28)
        g = int(10 + factor * 16)
        b = int(8 + factor * 10)
        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=(r, g, b))

    # Filet cuivre 1px
    inset = 32
    draw.rectangle([inset, inset, w - inset, h - inset], outline=(184, 122, 82), width=1)
    
    # Encoches coins dorées 14px
    notch = 16
    for ox, oy in [(inset, inset), (w - inset, inset), (inset, h - inset), (w - inset, h - inset)]:
        dx = notch if ox == inset else -notch
        dy = notch if oy == inset else -notch
        draw.line([(ox, oy), (ox + dx, oy)], fill=(227, 180, 140), width=2)
        draw.line([(ox, oy), (ox, oy + dy)], fill=(227, 180, 140), width=2)

    # Typographie système
    try:
        f_brand = ImageFont.truetype("georgia.ttf", int(w * 0.032))
        f_title = ImageFont.truetype("georgia.ttf", int(w * 0.046))
        f_sub = ImageFont.truetype("arial.ttf", int(w * 0.026))
        f_mono = ImageFont.truetype("cour.ttf", int(w * 0.024))
    except:
        f_brand = f_title = f_sub = f_mono = ImageFont.load_default()

    # En-tête du placeholder
    draw.text((inset + 24, inset + 22), "DORCAS MOÏRA · EDITORIAL ASSET", font=f_brand, fill=(184, 122, 82))
    draw.text((w - inset - 180, inset + 22), f"RATIO {item['ratio']}", font=f_mono, fill=(227, 180, 140))

    # Bloc central neutre (aucune silhouette humaine)
    cent_y = h // 2 - 40
    # Cadre intérieur de cadrage
    draw.rectangle([w//2 - 140, cent_y - 70, w//2 + 140, cent_y + 70], outline=(70, 50, 40), width=1)
    # Réticule central
    draw.line([(w//2 - 20, cent_y), (w//2 + 20, cent_y)], fill=(184, 122, 82), width=1)
    draw.line([(w//2, cent_y - 20), (w//2, cent_y + 20)], fill=(184, 122, 82), width=1)

    draw.text((w//2, cent_y + 90), f"RÉSERVE {item['file']}", font=f_mono, fill=(156, 138, 124), anchor="mm")

    # Bloc inférieur éditorial
    bot_y = h - inset - 130
    draw.line([(inset + 24, bot_y), (w - inset - 24, bot_y)], fill=(184, 122, 82), width=1)
    draw.text((inset + 24, bot_y + 16), item["chapter"], font=f_brand, fill=(227, 180, 140))
    draw.text((inset + 24, bot_y + 54), item["title"], font=f_title, fill=(243, 230, 216))
    draw.text((inset + 24, bot_y + 94), f"Fichier source attendu : {item['file']} ({w}x{h}px)", font=f_sub, fill=(156, 138, 124))

    dest = os.path.join("assets/images", item["file"])
    img.save(dest, "JPEG", quality=90)

print(f"Génération de {len(images_list)} aplats neutres éditoriaux...")
for it in images_list:
    make_neutral_aplat(it)

print(f"[SUCCÈS] {len(images_list)} aplats neutres générés sans aucune silhouette humaine.")
