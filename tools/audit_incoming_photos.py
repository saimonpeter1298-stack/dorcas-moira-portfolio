import os
from PIL import Image

INCOMING = "assets/_incoming"

targets = [
    # (incoming_base, target_name, description, category)
    ("IMG_9062", "01-signature-02.jpg", "portrait N&B demi-visage, afro, fond gris", "gallery"),
    ("IMG_9061", "02-many-moods-03.jpg", "trench bicolore beige/camel, debout contre une table, sac à franges", "gallery"),
    ("IMG_9054", "02-many-moods-04.jpg", "trench beige, assise sur chaise orange, jambes écartées, regard caméra", "gallery"),
    ("e40a9ed0-895c-4b76-a804-33f8c353d294", "03-afro-chic-02.jpg", "kimono wax, souriante", "gallery"),
    ("IMG_9068", "03-afro-chic-03.jpg", "robe blanche à cordons en spirale, tresses, regard par-dessus l'épaule", "gallery"),
    ("IMG_9048", "04-studio-01.jpg", "N&B, veste en jean, boucle d'oreille orange en couleur", "gallery"),
    ("IMG_9083 (1)", "05-sun-kissed-02.jpg", "drapé blanc, corde, contre un bateau", "gallery"),
    ("IMG_9080 (1)", "05-sun-kissed-03.jpg", "drapé blanc, mouvement de danse", "gallery"),
    ("IMG_9057", "06-visual-01.jpg", "trench marron en pied, lunettes, sculpture orange", "gallery"),
    ("IMG_9064", "beauty-portrait.jpg", "top rouge, bras autour du genou, format paysage, lumière dorée", "section"),
    ("IMG_9082", "digital-01-face.jpg", "t-shirt blanc, fond blanc, main sous le menton", "section"),
    ("43aff146-95ba-42b1-892b-2d4ee6d3df27", "timeline-2024-kuba.jpg", "robe rayée, mur Kuba Concept Store", "timeline"),
    ("ffee2085-0f67-4018-8d3c-86a767682a25", "timeline-2026-djino-backstage.jpg", "coulisses tournage, pique-nique, bouteille Djino", "timeline")
]

files = os.listdir(INCOMING)

print(f"Total files in {INCOMING}: {len(files)}")
print("-" * 80)

resolved = []
for base, target, desc, cat in targets:
    # Match candidate files
    matched = None
    for f in files:
        f_no_ext = os.path.splitext(f)[0]
        if f_no_ext.lower() == base.lower():
            matched = f
            break
    if not matched:
        print(f"[MISSING] Could not find file for {base} -> {target}")
        continue
    
    path = os.path.join(INCOMING, matched)
    size_bytes = os.path.getsize(path)
    im = Image.open(path)
    w, h = im.size
    min_dim = min(w, h)
    under_1200 = min_dim < 1200
    
    resolved.append({
        "base": base,
        "matched": matched,
        "target": target,
        "desc": desc,
        "cat": cat,
        "w": w,
        "h": h,
        "min_dim": min_dim,
        "under_1200": under_1200,
        "size_kb": round(size_bytes / 1024, 1),
        "format": im.format,
        "mode": im.mode
    })
    
    flag = " [!] UNDER 1200px" if under_1200 else " [OK]"
    print(f"{matched:<42} -> {target:<30} ({w}x{h}, min={min_dim}px, {size_bytes/1024:.1f} KB){flag}")
    print(f"   Description attendue: {desc}")

print("-" * 80)
