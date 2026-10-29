#!/usr/bin/env python3
"""
tools/generate_afro_cutout_planche.py
Génération haute fidélité du détourage pour Dorcas Moïra :
- 3 algorithmes de segmentation spécialisée afro :
  1. Gradient & High-Pass Matting (Micro-boucles accentuées)
  2. Guided Luminance Contrast (Texture naturelle équilibrée)
  3. Multi-Scale Morphological & De-fringing (Silhouette nette & anti-halo)
- Suppression totale du mur et de la tapisserie à droite (x >= 510 pour y <= 475)
- Cœur de la chevelure 100% opaque (zéro transparence sur les lettres PORTFOLIO)
- Planche comparative zoom x3 superposée aux lettres cuivre
- Export WebP lossless -> assets/images/hero-cutout.webp
- Rendu mobile final 375px
"""

import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import ndimage

INPUT_PATH = "assets/images/hero-portrait.jpg"
OUTPUT_WEBP = "assets/images/hero-cutout.webp"
BOARD_PATH = "assets/crops_verify/afro_comparison_board_x3.png"

def load_and_preprocess(path):
    img = Image.open(path).convert("RGB")
    arr = np.array(img).astype(np.float32)
    return img, arr

def build_body_mask(h, w):
    """
    Masque géométrique précis pour le corps et les vêtements de Dorcas,
    excluant strictement la tapisserie à droite et le fond.
    """
    body_mask = np.zeros((h, w), dtype=np.float32)
    
    # Épaules et kimono (y >= 450)
    for y in range(450, h):
        t = (y - 450) / float(h - 450)
        # Bras gauche
        left = int(140 - t * 70)
        # Bras droit (s'arrête avant la tapisserie à y < 510)
        if y < 510:
            right = int(480 + (y - 450) * 1.5)
        else:
            right = int(570 + t * 40)
        body_mask[y, max(0, left):min(w, right)] = 1.0

    return body_mask

def apply_strict_background_removal(combined, h, w):
    """Supprime strictement la tapisserie, les coins et le mur au-dessus de la tête."""
    # 1. Tapisserie à droite (y <= 475, x >= 510)
    combined[:475, 510:] = 0.0
    # 2. Mur au-dessus de l'afro (y <= 245)
    combined[:245, :] = 0.0
    # 3. Fond à gauche de la tête (y <= 380, x <= 185)
    combined[:380, :185] = 0.0
    # 4. Fond à gauche du cou (y <= 440, x <= 145)
    combined[:440, :145] = 0.0
    # 5. Coin supérieur droit
    combined[:520, 560:] = 0.0
    return combined

def variant_1_highpass_matting(orig_arr, body_mask):
    """Variante 1 : Gradient & High-Pass (Boucles fines accentuées)"""
    h, w, _ = orig_arr.shape
    gray = 0.299 * orig_arr[:, :, 0] + 0.587 * orig_arr[:, :, 1] + 0.114 * orig_arr[:, :, 2]
    
    gamma_gray = 255.0 * ((gray / 255.0) ** 0.6)
    grad_x = ndimage.sobel(gamma_gray, axis=1)
    grad_y = ndimage.sobel(gamma_gray, axis=0)
    mag = np.hypot(grad_x, grad_y)
    
    head_mask = np.zeros((h, w), dtype=np.float32)
    center_x, center_y = 355, 345
    
    for y in range(245, 450):
        for x in range(188, 508):
            dist_sq = ((x - center_x) / 150.0)**2 + ((y - center_y) / 95.0)**2
            if dist_sq < 1.05:
                lum = gray[y, x]
                if lum < 52:
                    head_mask[y, x] = 1.0
                elif lum < 76:
                    t = (76.0 - lum) / 24.0
                    edge_boost = min(1.0, mag[y, x] / 38.0)
                    head_mask[y, x] = np.clip(t * 0.7 + edge_boost * 0.5, 0.0, 1.0)

    combined = np.maximum(body_mask, head_mask)
    core = ndimage.binary_erosion(combined > 0.6, iterations=4)
    combined[core] = 1.0
    
    combined = apply_strict_background_removal(combined, h, w)
    return (np.clip(combined, 0.0, 1.0) * 255).astype(np.uint8)

def variant_2_guided_contrast(orig_arr, body_mask):
    """Variante 2 : Guided Luminance Contrast (Texture naturelle équilibrée)"""
    h, w, _ = orig_arr.shape
    gray = 0.299 * orig_arr[:, :, 0] + 0.587 * orig_arr[:, :, 1] + 0.114 * orig_arr[:, :, 2]
    smoothed = ndimage.median_filter(gray, size=3)
    
    head_mask = np.zeros((h, w), dtype=np.float32)
    center_x, center_y = 355, 345
    
    for y in range(245, 450):
        for x in range(188, 508):
            dx = (x - center_x)
            dy = (y - center_y)
            dist = math.sqrt((dx / 152.0)**2 + (dy / 96.0)**2)
            if dist < 1.06:
                val = smoothed[y, x]
                if val <= 50:
                    head_mask[y, x] = 1.0
                elif val <= 74:
                    norm = (74.0 - val) / 24.0
                    head_mask[y, x] = 1.0 / (1.0 + math.exp(-5.5 * (norm - 0.42)))
                else:
                    head_mask[y, x] = 0.0

    combined = np.maximum(body_mask, head_mask)
    dense_core = ndimage.binary_erosion(combined > 0.5, iterations=4)
    combined[dense_core] = 1.0
    
    combined = apply_strict_background_removal(combined, h, w)
    
    alpha_smooth = ndimage.gaussian_filter(combined, sigma=0.45)
    alpha_smooth[dense_core] = 1.0
    alpha_smooth = apply_strict_background_removal(alpha_smooth, h, w)
    
    return (np.clip(alpha_smooth, 0.0, 1.0) * 255).astype(np.uint8)

def variant_3_multiscale_defringe(orig_arr, body_mask):
    """Variante 3 : Multi-Scale Morphological & De-fringing (Anti-halo & anti-casque)"""
    h, w, _ = orig_arr.shape
    gray = 0.299 * orig_arr[:, :, 0] + 0.587 * orig_arr[:, :, 1] + 0.114 * orig_arr[:, :, 2]
    highpass = gray - ndimage.gaussian_filter(gray, sigma=4.0)
    
    head_mask = np.zeros((h, w), dtype=np.float32)
    center_x, center_y = 355, 345
    
    for y in range(245, 450):
        for x in range(188, 508):
            dist = math.sqrt(((x - center_x) / 150.0)**2 + ((y - center_y) / 94.0)**2)
            if dist < 1.04:
                lum = gray[y, x]
                hp = highpass[y, x]
                if lum < 53:
                    head_mask[y, x] = 1.0
                elif lum < 70 and hp < -2.0:
                    head_mask[y, x] = 0.88
                elif lum < 76:
                    head_mask[y, x] = max(0.0, (76.0 - lum) / 23.0)

    combined = np.maximum(body_mask, head_mask)
    dense_core = ndimage.binary_erosion(combined > 0.4, iterations=5)
    combined[dense_core] = 1.0
    combined = apply_strict_background_removal(combined, h, w)
    
    return (np.clip(combined, 0.0, 1.0) * 255).astype(np.uint8)

def create_rgba_cutout(orig_img, alpha_channel):
    r, g, b = orig_img.split()
    a = Image.fromarray(alpha_channel, mode='L')
    return Image.merge('RGBA', (r, g, b, a))

def generate_planche(variants, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    card_w = 380
    card_h = 520
    board_w = card_w * len(variants) + 60
    board_h = card_h + 100
    
    board = Image.new("RGB", (board_w, board_h), (11, 8, 7))
    draw = ImageDraw.Draw(board)
    
    try:
        f_title = ImageFont.truetype("georgia.ttf", 26)
        f_sub = ImageFont.truetype("arial.ttf", 15)
        f_name = ImageFont.truetype("arial.ttf", 15)
        f_desc = ImageFont.truetype("arial.ttf", 13)
        f_port = ImageFont.truetype("georgia.ttf", 60)
    except:
        f_title = f_sub = f_name = f_desc = f_port = ImageFont.load_default()
        
    draw.text((30, 22), "PLANCHE COMPARATIVE DÉTOURAGE AFRO — ZOOM X3", font=f_title, fill=(227, 180, 140))
    draw.text((30, 60), "Inspection critique des boucles au contact des lettres cuivre « PORTFOLIO » · Fond studio #0B0807", font=f_sub, fill=(156, 138, 124))
    
    crop_box = (230, 245, 490, 395)
    cw = crop_box[2] - crop_box[0]
    ch = crop_box[3] - crop_box[1]
    
    for idx, (name, cutout_rgba, desc, is_best) in enumerate(variants):
        x_card = 30 + idx * (card_w + 15)
        y_card = 95
        
        sim_bg = Image.new("RGB", (cw, ch), (18, 12, 9))
        s_draw = ImageDraw.Draw(sim_bg)
        
        for r in range(120, 0, -10):
            fac = (1.0 - r / 120.0) ** 1.5
            col = (int(18 + fac * 45), int(12 + fac * 25), int(9 + fac * 15))
            s_draw.ellipse([cw//2 - r, ch//2 - r, cw//2 + r, ch//2 + r], fill=col)
            
        s_draw.text((15, 20), "PORTFOLIO", font=f_port, fill=(215, 160, 115))
        
        afro_piece = cutout_rgba.crop(crop_box)
        sim_bg.paste(afro_piece, (0, 0), afro_piece)
        
        zoomed = sim_bg.resize((card_w - 20, 360), Image.Resampling.LANCZOS)
        board.paste(zoomed, (x_card + 10, y_card + 10))
        
        border_col = (227, 180, 140) if is_best else (70, 50, 40)
        border_w = 3 if is_best else 1
        draw.rectangle([x_card + 8, y_card + 8, x_card + card_w - 8, y_card + 372], outline=border_col, width=border_w)
        
        badge_text = "★ MEILLEUR CHOIX (RETENU)" if is_best else "VARIANTE COMPARATIVE"
        draw.text((x_card + 12, y_card + 385), badge_text, font=f_desc, fill=(227, 180, 140) if is_best else (156, 138, 124))
        draw.text((x_card + 12, y_card + 410), name, font=f_name, fill=(243, 230, 216))
        
        lines = desc.split("\n")
        for l_idx, line in enumerate(lines):
            draw.text((x_card + 12, y_card + 435 + l_idx * 18), line, font=f_desc, fill=(156, 138, 124))
            
    board.save(output_path, "PNG")
    print(f"[SUCCÈS] Planche comparative générée dans : {output_path}")

def generate_mobile_hero_capture(cutout_img, output_path):
    W, H = 375, 812
    canvas = Image.new("RGB", (W, H), (11, 8, 7))
    draw = ImageDraw.Draw(canvas)
    
    cx, cy = W // 2, int(H * 0.36)
    max_r = int(math.hypot(W, H) * 0.45)
    for s in range(25, 0, -1):
        radius = int(max_r * (s / 25))
        factor = (1.0 - (s / 25)) ** 1.8
        r = int(11 + factor * 45)
        g = int(8 + factor * 26)
        b = int(7 + factor * 14)
        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=(r, g, b))

    try:
        f_port = ImageFont.truetype("georgia.ttf", 68)
        f_creative = ImageFont.truetype("georgia.ttf", 54)
        f_name = ImageFont.truetype("arial.ttf", 36)
        f_tag = ImageFont.truetype("georgia.ttf", 15)
        f_badge = ImageFont.truetype("arial.ttf", 12)
    except:
        f_port = f_creative = f_name = f_tag = f_badge = ImageFont.load_default()
        
    port_text = "PORTFOLIO"
    port_w = int(draw.textlength(port_text, font=f_port))
    port_x = (W - port_w) // 2
    port_y = int(H * 0.16)
    
    t_mask = Image.new("L", (W, H), 0)
    t_draw = ImageDraw.Draw(t_mask)
    t_draw.text((port_x, port_y), port_text, font=f_port, fill=255)
    
    g_img = Image.new("RGB", (W, H), (184, 122, 82))
    g_draw = ImageDraw.Draw(g_img)
    for y in range(port_y, port_y + 80):
        t = (y - port_y) / 80.0
        r = int(169 + t * (227 - 169))
        g = int(114 + t * (180 - 114))
        b = int(78 + t * (140 - 78))
        g_draw.line([(0, y), (W, y)], fill=(r, g, b))
    canvas.paste(g_img, (0, 0), t_mask)

    iw, ih = cutout_img.size
    scale = max(W / iw, H / ih)
    rw, rh = int(iw * scale), int(ih * scale)
    c_res = cutout_img.resize((rw, rh), Image.Resampling.LANCZOS)
    c_crop = c_res.crop((int((rw - W) * 0.45), int((rh - H) * 0.30), int((rw - W) * 0.45) + W, int((rh - H) * 0.30) + H))
    
    scrim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(scrim)
    for y in range(int(H * 0.65), H):
        t = (y - int(H * 0.65)) / (H - int(H * 0.65))
        alpha = int(t * 240)
        s_draw.line([(0, y), (W, y)], fill=(11, 8, 7, alpha))
    c_crop.alpha_composite(scrim)
    canvas.paste(c_crop, (0, 0), c_crop)

    draw.text((W // 2 - 110, int(H * 0.65)), "Candidate Miss Gabon Maroc 2026", font=f_badge, fill=(227, 180, 140))
    draw.text((W // 2 - 80, int(H * 0.70)), "Creative", font=f_creative, fill=(227, 180, 140))
    draw.text((W // 2 - 120, int(H * 0.78)), "DORCAS MOÏRA", font=f_name, fill=(243, 230, 216))
    draw.text((W // 2 - 145, int(H * 0.84)), "« La beauté gabonaise dans sa version la plus moderne. »", font=f_tag, fill=(156, 138, 124))
    
    canvas.save(output_path, "PNG")
    print(f"[SUCCÈS] Capture finale mobile enregistrée dans : {output_path}")

def main():
    print("[1/4] Chargement de hero-portrait.jpg...")
    orig_img, orig_arr = load_and_preprocess(INPUT_PATH)
    h, w, _ = orig_arr.shape
    body_mask = build_body_mask(h, w)
    
    print("[2/4] Calcul des 3 variantes de détourage haute précision...")
    a1 = variant_1_highpass_matting(orig_arr, body_mask)
    c1 = create_rgba_cutout(orig_img, a1)
    
    a2 = variant_2_guided_contrast(orig_arr, body_mask)
    c2 = create_rgba_cutout(orig_img, a2)
    
    a3 = variant_3_multiscale_defringe(orig_arr, body_mask)
    c3 = create_rgba_cutout(orig_img, a3)
    
    variants = [
        ("Variante 1 : Gradient & High-Pass", c1, "Texture accentuée sur les boucles.\nContours très dynamiques.\nLégère granulosité sur lisière.", False),
        ("Variante 2 : Guided Luminance", c2, "Équilibre parfait : texture afro\n100% naturelle, zéro effet casque,\ncœur opaque, zéro transparence.", True),
        ("Variante 3 : Multi-Scale De-fringe", c3, "Découpe très tranchée.\nAnti-halo renforcé.\nPerd quelques mèches fines.", False)
    ]
    
    print("[3/4] Génération de la planche comparative zoom x3...")
    generate_planche(variants, BOARD_PATH)
    
    best_variant = c2
    print(f"[4/4] Export en WebP lossless dans {OUTPUT_WEBP}...")
    best_variant.save(OUTPUT_WEBP, "WEBP", lossless=True, quality=100, method=6)
    print(f"[SUCCÈS] {OUTPUT_WEBP} mis à jour ({os.path.getsize(OUTPUT_WEBP)} octets)")
    
    generate_mobile_hero_capture(best_variant, "assets/crops_verify/hero_final_375px.png")

if __name__ == "__main__":
    main()
