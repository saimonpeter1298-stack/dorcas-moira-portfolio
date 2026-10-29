#!/usr/bin/env python3
"""
tools/optimize.py - Optimisation d'images et génération automatique des déclinaisons responsives en WebP et AVIF
(640w, 1080w, 1600w)
"""

import os
import sys
import glob
from PIL import Image

SIZES = [
    (640, "640w"),
    (1080, "1080w"),
    (1600, "1600w")
]

def optimize_images(images_dir="assets/images"):
    if not os.path.exists(images_dir):
        print(f"[ERREUR] Répertoire introuvable : {images_dir}")
        return

    jpg_files = glob.glob(os.path.join(images_dir, "*.jpg"))
    print(f"[INFO] Optimisation WebP et AVIF pour {len(jpg_files)} images JPEG...")

    webp_count = 0
    avif_count = 0

    for file_path in jpg_files:
        base_name, _ = os.path.splitext(file_path)
        file_name = os.path.basename(file_path)
        
        try:
            with Image.open(file_path) as img:
                orig_w, orig_h = img.size
                
                # 1. Version WebP originale
                webp_main = f"{base_name}.webp"
                img.save(webp_main, "WEBP", quality=90, method=6)
                webp_count += 1

                # 2. Tailles responsives WebP
                for target_w, suffix in SIZES:
                    out_path = f"{base_name}-{suffix}.webp"
                    if target_w < orig_w:
                        ratio = target_w / float(orig_w)
                        target_h = int(float(orig_h) * float(ratio))
                        resized = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
                        resized.save(out_path, "WEBP", quality=88, method=5)
                    else:
                        img.save(out_path, "WEBP", quality=88, method=5)
                    webp_count += 1

                # 3. Version AVIF (si supporté)
                try:
                    avif_main = f"{base_name}.avif"
                    img.save(avif_main, "AVIF", quality=85)
                    avif_count += 1

                    for target_w, suffix in SIZES:
                        out_path = f"{base_name}-{suffix}.avif"
                        if target_w < orig_w:
                            ratio = target_w / float(orig_w)
                            target_h = int(float(orig_h) * float(ratio))
                            resized = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
                            resized.save(out_path, "AVIF", quality=82)
                        else:
                            img.save(out_path, "AVIF", quality=82)
                        avif_count += 1
                except Exception as avif_err:
                    pass

        except Exception as e:
            print(f"[AVERTISSEMENT] Erreur sur {file_name}: {e}")

    print(f"[SUCCÈS] Génération terminée : {webp_count} WebP créés, {avif_count} AVIF créés.")

if __name__ == "__main__":
    dir_path = sys.argv[1] if len(sys.argv) > 1 else "assets/images"
    optimize_images(dir_path)
