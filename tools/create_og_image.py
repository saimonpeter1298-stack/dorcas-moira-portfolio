#!/usr/bin/env python3
"""
tools/create_og_image.py
Generates a luxury 1200x630 Open Graph image for Dorcas Moïra
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

def create_og():
    W, H = 1200, 630
    bg_color = (11, 8, 7) # #0B0807
    img = Image.new("RGB", (W, H), bg_color)
    draw = ImageDraw.Draw(img)

    # 1. Subtle radial ambient glow on bottom-left and center-right
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    
    # Warm copper glow behind model on right
    copper_glow = (184, 122, 82, 45) # #B87A52 with alpha
    glow_draw.ellipse([700, 40, 1250, 590], fill=copper_glow)
    
    # Soft amber glow on left
    amber_glow = (227, 180, 140, 25) # #E3B48C with alpha
    glow_draw.ellipse([80, 100, 500, 520], fill=amber_glow)
    
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    img.paste(glow, (0, 0), glow)

    # 2. Add model portrait on the right half (01-signature-01 or hero-portrait)
    photo_path = "assets/images/01-signature-01.jpg"
    if os.path.exists(photo_path):
        with Image.open(photo_path) as p:
            p_w, p_h = p.size
            target_h = 630
            target_w = int(p_w * (target_h / p_h))
            p_resized = p.resize((target_w, target_h), Image.Resampling.LANCZOS)
            
            # Create horizontal alpha mask to fade left edge of photo into #0B0807
            mask = Image.new("L", (target_w, target_h), 255)
            mask_draw = ImageDraw.Draw(mask)
            fade_w = int(target_w * 0.45)
            for x in range(fade_w):
                alpha = int(255 * (x / fade_w))
                mask_draw.line([(x, 0), (x, target_h)], fill=alpha)
                
            paste_x = W - target_w
            img.paste(p_resized, (paste_x, 0), mask)

    # 3. Add luxury frame border
    border_color = (184, 122, 82, 100) # copper
    draw.rectangle([24, 24, W - 25, H - 25], outline="#B87A52", width=1)
    draw.rectangle([28, 28, W - 29, H - 29], outline="#3A2820", width=1)

    # 4. Typography
    # Try finding system fonts or fallback
    font_large = None
    font_sub = None
    font_pill = None
    font_meta = None
    
    candidate_fonts = [
        "C:\\Windows\\Fonts\\georgia.ttf",
        "C:\\Windows\\Fonts\\times.ttf",
        "C:\\Windows\\Fonts\\arial.ttf"
    ]
    for c in candidate_fonts:
        if os.path.exists(c):
            font_large = ImageFont.truetype(c, 56)
            font_sub = ImageFont.truetype(c, 24)
            font_pill = ImageFont.truetype(c, 16)
            font_meta = ImageFont.truetype(c, 18)
            break
            
    if not font_large:
        font_large = ImageFont.load_default()
        font_sub = font_large
        font_pill = font_large
        font_meta = font_large

    # Pill badge: CASABLANCA · MAROC
    draw.rounded_rectangle([60, 60, 270, 94], radius=17, outline="#B87A52", fill="#1A120E")
    draw.text((76, 70), "CASABLANCA · MAROC", fill="#E3B48C", font=font_pill)

    # Title: DORCAS MOÏRA
    draw.text((60, 130), "DORCAS MOÏRA", fill="#F3E6D8", font=font_large)

    # Accent subtitle: Modèle Photo & Afro Fashion Muse
    draw.text((62, 215), "Modèle Photo & Afro Fashion Muse", fill="#E3B48C", font=font_sub)

    # Divider line
    draw.line([(60, 275), (480, 275)], fill="#B87A52", width=2)

    # Editorial description
    desc_lines = [
        "Candidate officielle Miss Gabon Maroc 2026",
        "Direction Artistique · Éditorial Haute Couture",
        "Campagnes Commerciales & Vidéo Motion"
    ]
    y_text = 310
    for line in desc_lines:
        draw.text((62, y_text), f"—  {line}", fill="#D0BFB2", font=font_meta)
        y_text += 38

    # Bottom website URL
    draw.text((62, 535), "dorcasmoira.com", fill="#B87A52", font=font_sub)

    out_path = "assets/images/og-image.jpg"
    img.save(out_path, "JPEG", quality=94, optimize=True)
    print(f"[SUCCESS] Created {out_path} ({W}x{H})")

if __name__ == "__main__":
    create_og()
