#!/usr/bin/env python3
"""
tools/render_hero_mobile_sim.py
Simule avec exactitude le rendu mobile 375x812 du Hero en 4 calques :
- Calque A : Halo ambre/espresso studio feutré
- Calque B : Mot PORTFOLIO géant en dégradé cuivre
- Calque C : Dorcas détourée (hero-cutout.webp)
- Calque D : Premier plan (« Creative », Dorcas Moïra, badge)
Génère également un zoom 2x sur les contours de l'afro.
"""

import math
from PIL import Image, ImageDraw, ImageFont

W, H = 375, 812

# 1. Calque A : Fond halo ambre/espresso
canvas = Image.new("RGB", (W, H), (11, 8, 7))
draw = ImageDraw.Draw(canvas)

# Halo radial studio
cx, cy = W // 2, int(H * 0.36)
max_r = int(math.hypot(W, H) * 0.45)
for s in range(25, 0, -1):
    radius = int(max_r * (s / 25))
    factor = (1.0 - (s / 25)) ** 1.8
    r = int(11 + factor * 45)
    g = int(8 + factor * 26)
    b = int(7 + factor * 14)
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=(r, g, b))

# 2. Calque B : Mot PORTFOLIO géant en dégradé cuivre
try:
    f_portfolio = ImageFont.truetype("georgia.ttf", 68)
except:
    f_portfolio = ImageFont.load_default()

port_text = "PORTFOLIO"
port_w = int(draw.textlength(port_text, font=f_portfolio))
port_x = (W - port_w) // 2
port_y = int(H * 0.16)

# Dégradé cuivre pour le texte
text_mask = Image.new("L", (W, H), 0)
text_draw = ImageDraw.Draw(text_mask)
text_draw.text((port_x, port_y), port_text, font=f_portfolio, fill=255)

grad_img = Image.new("RGB", (W, H), (184, 122, 82))
g_draw = ImageDraw.Draw(grad_img)
for y in range(port_y, port_y + 80):
    t = (y - port_y) / 80.0
    r = int(169 + t * (227 - 169))
    g = int(114 + t * (180 - 114))
    b = int(78 + t * (140 - 78))
    g_draw.line([(0, y), (W, y)], fill=(r, g, b))

canvas.paste(grad_img, (0, 0), text_mask)

# 3. Calque C : Dorcas détourée (hero-cutout.webp)
with Image.open("assets/images/hero-cutout.webp") as cutout:
    # Resize and crop to 375x812 with focus 45% 30%
    iw, ih = cutout.size
    scale = max(W / iw, H / ih)
    rw, rh = int(iw * scale), int(ih * scale)
    c_resized = cutout.resize((rw, rh), Image.Resampling.LANCZOS)
    
    crop_x = int((rw - W) * 0.45)
    crop_y = int((rh - H) * 0.30)
    c_cropped = c_resized.crop((crop_x, crop_y, crop_x + W, crop_y + H))
    
    # Scrim dégradé en bas
    scrim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(scrim)
    for y in range(int(H * 0.65), H):
        t = (y - int(H * 0.65)) / (H - int(H * 0.65))
        alpha = int(t * 240)
        s_draw.line([(0, y), (W, y)], fill=(11, 8, 7, alpha))
        
    c_cropped.alpha_composite(scrim)
    canvas.paste(c_cropped, (0, 0), c_cropped)

# 4. Calque D : Premier plan éditorial
try:
    f_creative = ImageFont.truetype("georgia.ttf", 54)
    f_name = ImageFont.truetype("arial.ttf", 36)
    f_tag = ImageFont.truetype("georgia.ttf", 15)
except:
    f_creative = f_name = f_tag = ImageFont.load_default()

draw.text((W // 2 - 80, int(H * 0.70)), "Creative", font=f_creative, fill=(227, 180, 140))
draw.text((W // 2 - 120, int(H * 0.78)), "DORCAS MOÏRA", font=f_name, fill=(243, 230, 216))
draw.text((W // 2 - 145, int(H * 0.84)), "« La beauté gabonaise dans sa version la plus moderne. »", font=f_tag, fill=(156, 138, 124))

# Sauvegarde simulation mobile complète
canvas.save("assets/crops_verify/hero_mobile_375.png")

# 5. Zoom 2.5x sur la zone de l'afro et du mot PORTFOLIO
afro_box = (int(W * 0.15), int(H * 0.14), int(W * 0.85), int(H * 0.40))
afro_crop = canvas.crop(afro_box)
afro_zoomed = afro_crop.resize((afro_crop.width * 2, afro_crop.height * 2), Image.Resampling.LANCZOS)
afro_zoomed.save("assets/crops_verify/hero_afro_zoom_375.png")

print("[SUCCÈS] Rendu mobile 375px et zoom afro générés dans assets/crops_verify/")
