#!/usr/bin/env python3
"""
tools/convert_cutout.py
Convertit hero-cutout.png en assets/images/hero-cutout.webp sans aucune perte de transparence (lossless=True),
sans modifier les contours (aucun feather, aucun flou).
"""

import os
import sys
from PIL import Image

def convert_cutout(png_path="hero-cutout.png", webp_path="assets/images/hero-cutout.webp"):
    # Recherche dans les chemins usuels
    candidates = [
        png_path,
        "assets/images/hero-cutout.png",
        os.path.join(os.path.expanduser("~"), "Downloads", "hero-cutout.png"),
        os.path.join(os.path.expanduser("~"), "Desktop", "hero-cutout.png")
    ]
    
    found_path = None
    for c in candidates:
        if os.path.exists(c):
            found_path = c
            break
            
    if not found_path:
        print(f"[ERREUR] Fichier introuvable. Veuillez déposer 'hero-cutout.png' à la racine du projet.")
        return False

    print(f"[INFO] Conversion fidèle de {found_path} -> {webp_path} (sans feather, sans flou, lossless=True)...")
    with Image.open(found_path) as img:
        img_rgba = img.convert("RGBA")
        os.makedirs(os.path.dirname(webp_path), exist_ok=True)
        img_rgba.save(webp_path, "WEBP", lossless=True, quality=100, method=6)
        print(f"[SUCCÈS] {webp_path} généré ({img_rgba.size[0]}x{img_rgba.size[1]} px, {os.path.getsize(webp_path)} octets)")
        return True

if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else "hero-cutout.png"
    convert_cutout(src)
