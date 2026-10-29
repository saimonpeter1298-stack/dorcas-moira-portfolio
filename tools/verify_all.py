#!/usr/bin/env python3
import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('js/data.js', 'r', encoding='utf-8') as f:
    data_js = f.read()

with open('js/main.js', 'r', encoding='utf-8') as f:
    main_js = f.read()

print("=== 1. CRÉDITS PHOTOGRAPHES ===")
# Vérifier s'il reste des crédits inventés ou "Ph: Wazfeel"
credits_in_data = re.findall(r'credit:\s*([^\n,]+)', data_js)
non_null_credits = [c.strip() for c in credits_in_data if c.strip() != 'null']
print(f"Crédits non-null dans data.js : {non_null_credits} (doit être vide : {len(non_null_credits) == 0})")

# Vérifier Wazfeel dans index.html
wazfeel_lines = [line.strip() for line in html.splitlines() if 'Wazfeel' in line]
print(f"Occurrences de Wazfeel dans index.html ({len(wazfeel_lines)}) :")
for l in wazfeel_lines:
    print(f"  - {l[:85]}")

print("\n=== 2. PHOTO ENSEMBLE CHOCOLAT (02-many-moods-01) ===")
import os
for ext in ['.jpg', '.webp', '.avif', '-640w.webp', '-1080w.webp', '-1600w.webp', '-640w.avif', '-1080w.avif', '-1600w.avif']:
    p = f"assets/images/02-many-moods-01{ext}"
    print(f"  {p}: {os.path.exists(p)} ({os.path.getsize(p) if os.path.exists(p) else 0} octets)")

print("\n=== 3. MODE PRODUCTION & PLACEHOLDERS ===")
print(f"  SHOW_PLACEHOLDERS = false présent dans data.js : {'SHOW_PLACEHOLDERS = false' in data_js}")
print(f"  Cartes data-placeholder='true' dans index.html : {len(re.findall(r'data-placeholder=\"true\"', html))}")
print(f"  Cartes data-placeholder='false' dans index.html : {len(re.findall(r'data-placeholder=\"false\"', html))}")
print(f"  Chapitre 04 tagué data-has-real-photos='false' : {'id=\"chap-04\" data-has-real-photos=\"false\"' in html}")
print(f"  Visual Mosaic tagué data-has-real-photos='false' : {'id=\"visual-mosaic\" data-has-real-photos=\"false\"' in html}")

print("\n=== 4. HERO CALQUE A (FOND STUDIO) ===")
print(f"  Ancien hero-base-portrait supprimé du calque A : {'hero-base-portrait' not in html}")
print(f"  Nouveau hero-studio-halo présent : {'hero-studio-halo' in html}")
