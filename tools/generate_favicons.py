#!/usr/bin/env python3
"""
tools/generate_favicons.py
Génère le jeu complet de favicons « DM » cuivre haute couture sur fond noir :
- favicon.svg
- favicon.ico (16x16, 32x32, 48x48)
- apple-touch-icon.png (180x180)
"""

import os
from PIL import Image, ImageDraw, ImageFont

# 1. Favicon SVG
svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="copperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E3B48C"/>
      <stop offset="50%" stop-color="#B87A52"/>
      <stop offset="100%" stop-color="#8F5632"/>
    </linearGradient>
    <radialGradient id="halo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#B87A52" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#0B0807" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Fond noir nuit -->
  <rect width="64" height="64" rx="14" fill="#0B0807"/>
  <circle cx="32" cy="32" r="28" fill="url(#halo)"/>
  <!-- Filet cuivre délicat -->
  <rect x="2" y="2" width="60" height="60" rx="12" fill="none" stroke="url(#copperGrad)" stroke-width="1.2" opacity="0.6"/>
  <!-- Monogramme DM -->
  <text x="32" y="42" font-family="'Didot', 'Bodoni MT', 'Cinzel', 'Georgia', serif" font-size="28" font-weight="700" fill="url(#copperGrad)" text-anchor="middle" letter-spacing="-1.5">DM</text>
  <!-- Petit éclat étoile -->
  <circle cx="48" cy="18" r="1.2" fill="#E3B48C"/>
</svg>"""

with open("favicon.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)
print("[OK] favicon.svg généré.")

# 2. Rendu Bitmap haute résolution pour PNG et ICO
size = 256
img = Image.new("RGBA", (size, size), (11, 8, 7, 255))
draw = ImageDraw.Draw(img)

# Halo radial
cx, cy = size // 2, size // 2
for r in range(size // 2, 0, -4):
    factor = (1.0 - r / float(size // 2)) ** 1.8
    cr = int(11 + factor * 80)
    cg = int(8 + factor * 45)
    cb = int(7 + factor * 25)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(cr, cg, cb, 255))

# Cadre arrondi cuivre
draw.rounded_rectangle([8, 8, size - 8, size - 8], radius=48, outline=(184, 122, 82, 180), width=4)

# Monogramme DM
try:
    font = ImageFont.truetype("georgia.ttf", 116)
except:
    font = ImageFont.load_default()

text = "DM"
bbox = draw.textbbox((0, 0), text, font=font)
tw = bbox[2] - bbox[0]
th = bbox[3] - bbox[1]
tx = (size - tw) // 2
ty = (size - th) // 2 - 12

# Dégradé cuivre sur le texte
text_mask = Image.new("L", (size, size), 0)
m_draw = ImageDraw.Draw(text_mask)
m_draw.text((tx, ty), text, font=font, fill=255)

grad = Image.new("RGBA", (size, size), (0, 0, 0, 0))
g_draw = ImageDraw.Draw(grad)
for y in range(ty, ty + th + 20):
    t = (y - ty) / float(th + 20)
    r = int(227 - t * (227 - 143))
    g = int(180 - t * (180 - 86))
    b = int(140 - t * (140 - 50))
    g_draw.line([(0, y), (size, y)], fill=(r, g, b, 255))

img.paste(grad, (0, 0), text_mask)

# Étoile dorée
draw.ellipse([size - 60, 48, size - 52, 56], fill=(227, 180, 140, 255))

# Sauvegarde apple-touch-icon.png (180x180)
apple_icon = img.resize((180, 180), Image.Resampling.LANCZOS)
apple_icon.save("apple-touch-icon.png", "PNG")
print("[OK] apple-touch-icon.png généré.")

# Sauvegarde favicon.ico (multi-résolution 16, 32, 48)
img.save("favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
print("[OK] favicon.ico généré.")
