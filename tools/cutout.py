#!/usr/bin/env python3
"""
tools/cutout.py - Découpage automatique d'arrière-plan pour le Hero de Dorcas Moïra
Utilisation : python tools/cutout.py [chemin_image_source]
Par défaut : traite assets/images/hero-portrait.jpg et génère assets/images/hero-cutout.webp
"""

import sys
import os
from PIL import Image

def process_cutout(input_path="assets/images/hero-portrait.jpg", output_path="assets/images/hero-cutout.webp"):
    if not os.path.exists(input_path):
        print(f"[ERREUR] Image source introuvable : {input_path}")
        return False

    print(f"[INFO] Traitement du détourage de : {input_path}")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # 1. Tentative avec la librairie rembg (IA U2-Net spécialisée silhouette et cheveux)
    try:
        import rembg
        print("[INFO] Librairie rembg détectée. Application du modèle U2-Net avec alpha matting...")
        with open(input_path, 'rb') as f:
            input_bytes = f.read()
        
        # Découpage avec alpha matting pour cheveux fins et contours afro nets
        output_bytes = rembg.remove(
            input_bytes,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=15,
            alpha_matting_erode_size=5
        )
        
        # Sauvegarde en WebP RGBA
        import io
        img = Image.open(io.BytesIO(output_bytes)).convert("RGBA")
        img.save(output_path, "WEBP", quality=95)
        print(f"[SUCCÈS] Détourage rembg haute précision enregistré dans : {output_path} ({img.size[0]}x{img.size[1]})")
        return True

    except Exception as e:
        print(f"[AVERTISSEMENT] rembg n'a pas pu être exécuté ({e}). Utilisation du fallback PIL pour générer un calque transparent propre.")
        
        # Fallback de secours intelligent avec PIL
        img = Image.open(input_path).convert("RGBA")
        w, h = img.size
        
        # Création d'un masque doux graduel
        # Conserve le sujet central (haut et milieu), rend transparent le fond haut et côtés
        mask = Image.new("L", (w, h), 255)
        pixels = mask.load()
        cx, cy = w / 2, h * 0.45
        max_rx, max_ry = w * 0.42, h * 0.50
        
        for y in range(h):
            for x in range(w):
                # Distance normalisée par rapport au centre du sujet
                dx = abs(x - cx) / max_rx
                dy = (y - cy) / max_ry
                
                # Le bas du corps reste 100% opaque pour couvrir le mot PORTFOLIO
                if y > h * 0.55 and abs(x - cx) < w * 0.4:
                    val = 255
                else:
                    dist = ((dx ** 2) + (dy ** 2)) ** 0.5
                    if dist <= 0.7:
                        val = 255
                    elif dist >= 1.05:
                        val = 0
                    else:
                        val = int(255 * (1.0 - (dist - 0.7) / 0.35))
                pixels[x, y] = max(0, min(255, val))

        img.putalpha(mask)
        img.save(output_path, "WEBP", quality=95)
        print(f"[SUCCÈS] Calque de profondeur généré avec fallback dans : {output_path}")
        return True

if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else "assets/images/hero-portrait.jpg"
    dest = sys.argv[2] if len(sys.argv) > 2 else "assets/images/hero-cutout.webp"
    process_cutout(src, dest)
