#!/usr/bin/env python3
import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

with open("js/data.js", "r", encoding="utf-8") as f:
    data_js = f.read()

print("=== VÉRIFICATION DES RÉSEAUX SOCIAUX ===")

expected = {
    "Instagram": "https://www.instagram.com/dorc.as_moira/",
    "TikTok": "https://www.tiktok.com/@dorcas_moira",
    "Pinterest": "https://pin.it/1GRwMbeNP",
    "WhatsApp": "https://wa.me/212779732777",
    "Email": "mailto:Dorcassmoira@gmail.com",
    "Téléphone": "tel:+212779732777"
}

for name, url in expected.items():
    in_html = url in html
    in_data = url in data_js
    print(f"[{'OK' if in_html and in_data else 'FAIL'}] {name} ({url}) -> HTML: {in_html}, data.js: {in_data}")

# Vérifier Facebook
fb_url_in_data = re.search(r'facebook:\s*\{\s*handle:\s*"([^"]*)",\s*url:\s*"([^"]*)"\s*\}', data_js)
if fb_url_in_data:
    h, u = fb_url_in_data.groups()
    print(f"Facebook dans data.js : handle='{h}', url='{u}' (doit être vide: {u == ''})")

# Vérifier les compteurs cliquables
metric_links = re.findall(r'<a[^>]*href="([^"]+)"[^>]*class="[^"]*metric-card[^"]*"', html)
print(f"Compteurs de métriques cliquables ({len(metric_links)}/4) :")
for l in metric_links:
    print(f"  -> {l}")

# Vérifier les icônes du footer et du menu
print("Icônes du menu plein écran présentes :", "menu-footer-socials-icons" in html)
print("Icônes du footer présentes :", "footer-socials-icons" in html)
