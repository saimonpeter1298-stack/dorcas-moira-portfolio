#!/usr/bin/env python3
"""
tools/generate_pdf.py - Génère la Comp Card officielle en PDF haute définition (A4 300 DPI)
Intègre la photo réelle de plage de nuit (assets/images/comp-card-full.jpg) avec silhouette complète
(pieds compris, cadrage 50% 40%) et mise en page haute couture
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont

def generate_compcard_pdf(output_pdf="assets/compcard-dorcas-moira.pdf"):
    os.makedirs(os.path.dirname(output_pdf), exist_ok=True)
    # Dimensions A4 standard à 300 DPI (2480 x 3508 px)
    w, h = 2480, 3508
    img = Image.new("RGB", (w, h), (11, 8, 7)) # #0B0807
    draw = ImageDraw.Draw(img)

    # 1. Fond studio avec halo ambre
    cx, cy = w // 2, int(h * 0.38)
    max_r = int(math.hypot(w, h) * 0.5)
    for s in range(30, 0, -1):
        radius = int(max_r * (s / 30))
        factor = (1.0 - (s / 30)) ** 1.6
        r = int(11 + factor * 22)
        g = int(8 + factor * 14)
        b = int(7 + factor * 9)
        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=(r, g, b))

    # 2. Filet cuivre 3px et encoches
    margin = 80
    draw.rectangle([margin, margin, w - margin, h - margin], outline=(184, 122, 82), width=3)
    notch = 36
    for ox, oy in [(margin, margin), (w - margin, margin), (margin, h - margin), (w - margin, h - margin)]:
        dx = notch if ox == margin else -notch
        dy = notch if oy == margin else -notch
        draw.line([(ox, oy), (ox + dx, oy)], fill=(227, 180, 140), width=5)
        draw.line([(ox, oy), (ox, oy + dy)], fill=(227, 180, 140), width=5)

    # Polices
    try:
        f_brand = ImageFont.truetype("georgia.ttf", 60)
        f_title = ImageFont.truetype("georgia.ttf", 104)
        f_sub = ImageFont.truetype("arial.ttf", 44)
        f_label = ImageFont.truetype("arial.ttf", 38)
        f_val = ImageFont.truetype("georgia.ttf", 56)
        f_mono = ImageFont.truetype("cour.ttf", 42)
    except:
        f_brand = f_title = f_sub = f_label = f_val = f_mono = ImageFont.load_default()

    # En-tête
    draw.text((margin + 60, margin + 60), "OFFICIAL MODEL COMP CARD · 2026", font=f_brand, fill=(184, 122, 82))
    draw.text((w - margin - 420, margin + 60), "CASABLANCA · MAROC", font=f_mono, fill=(227, 180, 140))

    # Titre principal
    draw.text((margin + 60, margin + 155), "DORCAS MOÏRA", font=f_title, fill=(243, 230, 216))
    draw.text((margin + 60, margin + 280), "MODÈLE PHOTO | AFRO FASHION MUSE — CANDIDATE MISS GABON MAROC 2026", font=f_sub, fill=(227, 180, 140))
    draw.line([(margin + 60, margin + 355), (w - margin - 60, margin + 355)], fill=(184, 122, 82), width=2)

    # Cadre Photo Pleine Hauteur (gauche)
    photo_box = [margin + 60, margin + 410, margin + 1150, h - margin - 430]
    box_w = photo_box[2] - photo_box[0]
    box_h = photo_box[3] - photo_box[1]

    comp_img_path = "assets/images/comp-card-full.jpg"
    if os.path.exists(comp_img_path):
        try:
            with Image.open(comp_img_path) as c_img:
                # Recadrage proportionnel pour garder la silhouette entière (pieds compris)
                # Aspect ratio cible
                target_ratio = box_w / float(box_h)
                orig_w, orig_h = c_img.size
                orig_ratio = orig_w / float(orig_h)

                if orig_ratio > target_ratio:
                    # Plus large que la boîte : couper les côtés, garder toute la hauteur (pieds et tête intacts)
                    new_w = int(orig_h * target_ratio)
                    # Centrage à 50%
                    left = (orig_w - new_w) // 2
                    crop_area = (left, 0, left + new_w, orig_h)
                else:
                    # Plus haut : couper le haut/bas selon le point focal 50% 40%
                    new_h = int(orig_w / target_ratio)
                    top = max(0, int((orig_h - new_h) * 0.4))
                    crop_area = (0, top, orig_w, top + new_h)

                c_cropped = c_img.crop(crop_area)
                c_resized = c_cropped.resize((box_w, box_h), Image.Resampling.LANCZOS)
                img.paste(c_resized, (photo_box[0], photo_box[1]))
                draw.rectangle(photo_box, outline=(184, 122, 82), width=3)
        except Exception as e:
            print(f"[NOTE] Image paste skipped: {e}")

    # Colonne Mensurations Agence (droite)
    meas_x = margin + 1240
    meas_y = margin + 430
    
    draw.text((meas_x, meas_y), "MENSURATIONS OFFICIELLES", font=f_brand, fill=(227, 180, 140))
    draw.line([(meas_x, meas_y + 75), (w - margin - 60, meas_y + 75)], fill=(70, 50, 40), width=2)

    measurements = [
        ("ÂGE", "25 ans"),
        ("TAILLE", "1m75  /  5'9\""),
        ("POIDS", "65 kg"),
        ("TOUR DE TAILLE", "65 cm  /  25.5\""),
        ("POITRINE", "85 cm  /  33.5\""),
        ("HANCHES", "99 cm  /  39\""),
        ("POINTURE", "41 EU  /  9.5 US"),
        ("TEINT DE PEAU", "Ébène  (Ebony)"),
        ("CHEVEUX", "Noirs  (Black)"),
        ("YEUX", "Bruns  (Brown)"),
        ("DISPONIBILITÉ", "Maroc & International")
    ]

    curr_y = meas_y + 110
    for label, val in measurements:
        draw.text((meas_x, curr_y), label, font=f_label, fill=(156, 138, 124))
        draw.text((meas_x, curr_y + 45), val, font=f_val, fill=(243, 230, 216))
        draw.line([(meas_x, curr_y + 125), (w - margin - 60, curr_y + 125)], fill=(45, 32, 25), width=1)
        curr_y += 145

    # Pied de page
    bot_y = h - margin - 350
    draw.line([(margin + 60, bot_y), (w - margin - 60, bot_y)], fill=(184, 122, 82), width=2)
    draw.text((margin + 60, bot_y + 35), "BOOKING & REPRÉSENTATION", font=f_brand, fill=(227, 180, 140))
    draw.text((margin + 60, bot_y + 110), "Téléphone / WhatsApp : +212 779 732 777", font=f_sub, fill=(243, 230, 216))
    draw.text((margin + 60, bot_y + 170), "Email officiel : Dorcassmoira@gmail.com", font=f_sub, fill=(243, 230, 216))
    draw.text((margin + 60, bot_y + 230), "Localisation : Casablanca (Maârif), Maroc", font=f_sub, fill=(156, 138, 124))

    draw.text((w - margin - 680, bot_y + 110), "Instagram : @dorc.as_moira", font=f_sub, fill=(156, 138, 124))
    draw.text((w - margin - 680, bot_y + 170), "TikTok : @dorcas_moira", font=f_sub, fill=(156, 138, 124))
    draw.text((w - margin - 680, bot_y + 230), "Pinterest : @dorcassmoira", font=f_sub, fill=(156, 138, 124))

    # Sauvegarde PDF
    img.save(output_pdf, "PDF", resolution=300.0)
    # Aperçu Web / thumbnail
    preview_img = img.resize((794, 1123), Image.Resampling.LANCZOS)
    preview_img.save("assets/compcard-preview.jpg", "JPEG", quality=88)
    print(f"[SUCCÈS] Comp Card PDF mise à jour : {output_pdf} (Taille : {os.path.getsize(output_pdf) / 1024:.1f} Ko)")

if __name__ == "__main__":
    generate_compcard_pdf()
