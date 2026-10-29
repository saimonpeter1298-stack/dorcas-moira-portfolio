import os
from PIL import Image, ImageDraw, ImageFont

THUMB_DIR = "assets/crops_verify/thumbnails"
items = [
    ("01-signature-02.jpg", "IMG_9062: N&B demi-visage afro"),
    ("02-many-moods-03.jpg", "IMG_9061: trench bicolore sac franges"),
    ("02-many-moods-04.jpg", "IMG_9054: trench assise chaise orange"),
    ("03-afro-chic-02.jpg", "e40a...: kimono wax souriante"),
    ("03-afro-chic-03.jpg", "IMG_9068: robe blanche cordons"),
    ("04-studio-01.jpg", "IMG_9048: N&B jean boucle orange"),
    ("05-sun-kissed-02.jpg", "IMG_9083: drape blanc bateau"),
    ("05-sun-kissed-03.jpg", "IMG_9080: drape blanc danse"),
    ("06-visual-01.jpg", "IMG_9057: trench lunettes sculpture"),
    ("beauty-portrait.jpg", "IMG_9064: top rouge genou dore"),
    ("digital-01-face.jpg", "IMG_9082: tshirt blanc main menton"),
    ("timeline-2024-kuba.jpg", "43af...: robe rayee Kuba"),
    ("timeline-2026-djino-backstage.jpg", "ffee...: coulisses Djino")
]

# Create contact sheet 4 columns x 4 rows
cols = 4
rows = 4
cell_w = 280
cell_h = 360
sheet = Image.new("RGB", (cols * cell_w, rows * cell_h), (25, 25, 25))
draw = ImageDraw.Draw(sheet)

for idx, (fn, caption) in enumerate(items):
    col = idx % cols
    row = idx // cols
    x = col * cell_w
    y = row * cell_h
    
    im_path = os.path.join(THUMB_DIR, fn)
    if os.path.exists(im_path):
        im = Image.open(im_path)
        im.thumbnail((cell_w - 20, cell_h - 60))
        # Center image in cell
        im_x = x + (cell_w - im.width) // 2
        im_y = y + 10 + (cell_h - 60 - im.height) // 2
        sheet.paste(im, (im_x, im_y))
    
    # Draw label
    draw.text((x + 10, y + cell_h - 45), fn, fill=(240, 200, 150))
    draw.text((x + 10, y + cell_h - 25), caption, fill=(200, 200, 200))

sheet.save("assets/crops_verify/thumbnails/contact_sheet.jpg", quality=90)
print("Contact sheet saved.")
