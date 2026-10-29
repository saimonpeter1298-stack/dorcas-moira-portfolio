#!/usr/bin/env python3
"""
tools/apply_production_mode.py
- Implémente le mode production : SHOW_PLACEHOLDERS = false
- Supprime tout crédit fictif (credit: null partout)
- Supprime les mentions hardcodées de "Wazfeel" comme photographe
- Ajoute placeholder: true/false sur chaque image
- Tag les cartes placeholders dans index.html
- Remplace le fond du Hero par un halo studio ambre/espresso pur (aucun dédoublement)
"""

import os
import re

def update_data_js():
    data_path = "js/data.js"
    with open(data_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. En-tête : SHOW_PLACEHOLDERS = false
    if "const SHOW_PLACEHOLDERS" not in content:
        content = "const SHOW_PLACEHOLDERS = false; // Mode production : masquer les placeholders et les chapitres sans photo réelle\n\n" + content
    else:
        content = re.sub(r'const SHOW_PLACEHOLDERS\s*=\s*(true|false);', 'const SHOW_PLACEHOLDERS = false;', content)

    # 2. Remplacer tous les crédits par null
    content = re.sub(r'credit:\s*"[^"]*"', 'credit: null', content)
    content = re.sub(r'portraitCredit:\s*"[^"]*"', 'portraitCredit: null', content)
    content = re.sub(r'credit:\s*credits\[[^\]]*\]', 'credit: null', content)

    # 3. Mettre placeholder: true dans le générateur de visual chapters (chapitre 06)
    content = re.sub(
        r'(return\s*\{[\s\S]*?focus:\s*isTall\s*\?\s*"50% 35%"\s*:\s*"50% 30%",)',
        r'\1\n          placeholder: true,',
        content
    )

    with open(data_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[OK] js/data.js mis à jour (SHOW_PLACEHOLDERS = false, credit: null sur toutes les images)")

def update_index_html():
    html_path = "index.html"
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Suppression des mentions hardcodées "· Wazfeel" dans les sous-titres
    content = content.replace("Veste Graphique · Wazfeel", "Veste Graphique · Éditorial Haute Couture")
    content = content.replace("Couloir d'Hôtel · Wazfeel", "Couloir d'Hôtel · Afro Chic")
    content = content.replace("Bleu Nuit Océan · Wazfeel", "Bleu Nuit Océan · Drapé Blanc")
    content = content.replace("Crédits photographes & créateurs partenaires : Wazfeel", "Marques clientes & partenaires créateurs : Wazfeel")

    # 2. CALQUE (A) Hero : Remplacer la photo floutée par le halo ambre/espresso pur pour supprimer tout dédoublement
    old_hero_bg = re.search(r'<div class="hero-layer-bg" id="heroLayerBg">[\s\S]*?</div>', content)
    new_hero_bg = """<div class="hero-layer-bg" id="heroLayerBg">
      <div class="hero-studio-halo" aria-hidden="true"></div>
    </div>"""
    if old_hero_bg:
        content = content[:old_hero_bg.start()] + new_hero_bg + content[old_hero_bg.end():]

    # 3. Taguer data-placeholder sur les cartes du carousel
    real_cards = [
        "01-signature-01",
        "02-many-moods-01",
        "03-afro-chic-01",
        "05-sun-kissed-01"
    ]

    def card_tagger(match):
        full = match.group(0)
        # Trouver l'identifiant
        m_id = re.search(r'data-lightbox="([^"]+)"', full)
        if m_id:
            card_id = m_id.group(1)
            if card_id in real_cards:
                if 'data-placeholder' not in full:
                    full = full.replace(f'data-lightbox="{card_id}"', f'data-lightbox="{card_id}" data-placeholder="false"')
            else:
                if 'data-placeholder' not in full:
                    full = full.replace(f'data-lightbox="{card_id}"', f'data-lightbox="{card_id}" data-placeholder="true"')
        return full

    content = re.sub(r'<div class="carousel-card"[^>]*>', card_tagger, content)

    # 4. Taguer les sections sans photos réelles
    content = content.replace('<section class="section-wrap" id="chap-04">', '<section class="section-wrap" id="chap-04" data-has-real-photos="false">')
    content = content.replace('<section class="section-wrap" id="visual-chapters">', '<section class="section-wrap" id="visual-chapters" data-has-real-photos="false">')

    # Taguer portraits secondaires
    content = content.replace('data-lightbox="brand-why-portrait"', 'data-lightbox="brand-why-portrait" data-placeholder="true"')

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[OK] index.html mis à jour (Hero halo pur, data-placeholder tagué, suppression mentions Wazfeel)")

if __name__ == "__main__":
    update_data_js()
    update_index_html()
