#!/usr/bin/env python3
"""
tools/process_incoming_photos.py
Process and integrate 13 HD incoming photos:
- Match source in assets/_incoming/
- Backup existing assets/images/ files to assets/_backup/
- Save master JPEG with high quality
- Generate WebP and AVIF variants (master + responsive 640w, 1080w, 1600w without upscaling)
"""

import os
import shutil
import glob
from PIL import Image, ImageOps

MAPPINGS = [
    # GALERIES
    ("IMG_9062", "01-signature-02.jpg"),
    ("IMG_9061", "02-many-moods-03.jpg"),
    ("IMG_9054", "02-many-moods-04.jpg"),
    ("e40a9ed0-895c-4b76-a804-33f8c353d294", "03-afro-chic-02.jpg"),
    ("IMG_9068", "03-afro-chic-03.jpg"),
    ("IMG_9048", "04-studio-01.jpg"),
    ("IMG_9083 (1)", "05-sun-kissed-02.jpg"),
    ("IMG_9080 (1)", "05-sun-kissed-03.jpg"),
    ("IMG_9057", "06-visual-01.jpg"),

    # SECTIONS
    ("IMG_9064", "beauty-portrait.jpg"),
    ("IMG_9082", "digital-01-face.jpg"),

    # PARCOURS
    ("43aff146-95ba-42b1-892b-2d4ee6d3df27", "timeline-2024-kuba.jpg"),
    ("ffee2085-0f67-4018-8d3c-86a767682a25", "timeline-2026-djino-backstage.jpg"),
]

SIZES = [
    (640, "640w"),
    (1080, "1080w"),
    (1600, "1600w")
]

def find_source(incoming_dir, key):
    for f in os.listdir(incoming_dir):
        base, _ = os.path.splitext(f)
        if base.lower() == key.lower():
            return os.path.join(incoming_dir, f)
    return None

def process():
    incoming_dir = "assets/_incoming"
    backup_dir = "assets/_backup"
    out_dir = "assets/images"
    
    os.makedirs(backup_dir, exist_ok=True)
    os.makedirs(out_dir, exist_ok=True)
    
    processed_sources = []
    
    print("=== Processing Incoming Photos ===")
    for key, target_name in MAPPINGS:
        src_path = find_source(incoming_dir, key)
        if not src_path:
            print(f"[ERROR] Source not found for {key}")
            continue
            
        print(f"\nProcessing {os.path.basename(src_path)} -> {target_name}...")
        
        # 1. Backup existing if present
        target_dest = os.path.join(out_dir, target_name)
        if os.path.exists(target_dest):
            stem, _ = os.path.splitext(target_name)
            # Backup all related files (jpg, webp, avif, sizes)
            for existing in glob.glob(os.path.join(out_dir, f"{stem}*")):
                shutil.copy2(existing, backup_dir)
            print(f"  Backed up existing {target_name} variants to {backup_dir}")
            
        # 2. Open & normalize orientation
        with Image.open(src_path) as raw_img:
            img = ImageOps.exif_transpose(raw_img)
            if img.mode != 'RGB':
                img = img.convert('RGB')
                
            orig_w, orig_h = img.size
            print(f"  Dimensions: {orig_w}x{orig_h}px")
            
            # Save master JPEG
            img.save(target_dest, "JPEG", quality=94, subsampling=0, optimize=True)
            
            # Save master WebP
            stem, _ = os.path.splitext(target_name)
            webp_master = os.path.join(out_dir, f"{stem}.webp")
            img.save(webp_master, "WEBP", quality=92, method=6)
            
            # Save master AVIF
            avif_master = os.path.join(out_dir, f"{stem}.avif")
            img.save(avif_master, "AVIF", quality=88)
            
            # Responsive sizes
            for target_w, suffix in SIZES:
                webp_size = os.path.join(out_dir, f"{stem}-{suffix}.webp")
                avif_size = os.path.join(out_dir, f"{stem}-{suffix}.avif")
                
                if target_w < orig_w:
                    ratio = target_w / float(orig_w)
                    target_h = int(float(orig_h) * ratio)
                    resized = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
                    resized.save(webp_size, "WEBP", quality=90, method=5)
                    resized.save(avif_size, "AVIF", quality=85)
                else:
                    img.save(webp_size, "WEBP", quality=90, method=5)
                    img.save(avif_size, "AVIF", quality=85)
                    
            print(f"  Created JPEG, WebP, AVIF and responsive variants for {target_name}")
            processed_sources.append(src_path)
            
    print(f"\n[DONE] Successfully processed {len(processed_sources)}/{len(MAPPINGS)} images.")
    return processed_sources

if __name__ == "__main__":
    process()
