#!/usr/bin/env python3
"""
tools/apply_social_audit.py
Met à jour l'ensemble des réseaux sociaux dans le site :
- data.js : URLs exactes, facebook vidé
- index.html :
  * Section Chiffres : cartes transformées en liens cliquables
  * Reels : liens exacts vers les posts/profils
  * Section Contact : WhatsApp, Email, Téléphone, Instagram, TikTok, Pinterest
  * Menu plein écran : rangée d'icônes SVG fines
  * Footer : rangée d'icônes SVG fines
- style.css : styles premium des icônes et cartes métriques cliquables
"""

import re

# 1. Mise à jour de js/data.js
with open("js/data.js", "r", encoding="utf-8") as f:
    data_content = f.read()

# Remplacer les réseaux sociaux
new_socials = """    whatsappLink: "https://wa.me/212779732777",
    email: "Dorcassmoira@gmail.com",
    formspreeEndpoint: "",
    socials: {
      instagram: { handle: "@dorc.as_moira", url: "https://www.instagram.com/dorc.as_moira/" },
      tiktok: { handle: "@dorcas_moira", url: "https://www.tiktok.com/@dorcas_moira" },
      pinterest: { handle: "@dorcassmoira", url: "https://pin.it/1GRwMbeNP" },
      whatsapp: { handle: "+212 779 732 777", url: "https://wa.me/212779732777" },
      email: { handle: "Dorcassmoira@gmail.com", url: "mailto:Dorcassmoira@gmail.com" },
      phone: { handle: "+212 779 732 777", url: "tel:+212779732777" },
      facebook: { handle: "", url: "" }
    }"""

data_content = re.sub(r'whatsappLink:\s*"[^"]*",\s*email:\s*"[^"]*",\s*formspreeEndpoint:\s*"[^"]*",\s*socials:\s*\{[\s\S]*?facebook:\s*\{[^}]*\}\s*\}', new_socials, data_content)

# Ajouter urls aux métriques
metrics_pattern = r'digitalMetrics:\s*\[[\s\S]*?\]'
new_metrics = """digitalMetrics: [
    {
      value: 100000,
      display: "+100K",
      labelFr: "Vues cumulées sur TikTok",
      labelEn: "Total TikTok Video Views",
      subFr: "Portée virale organique",
      subEn: "Organic viral reach",
      url: "https://www.tiktok.com/@dorcas_moira"
    },
    {
      value: 63300,
      display: "63,3K",
      labelFr: "Likes & Réactions TikTok",
      labelEn: "TikTok Likes & Interactions",
      subFr: "Forte adhésion de communauté",
      subEn: "High community engagement",
      url: "https://www.tiktok.com/@dorcas_moira"
    },
    {
      value: 28100,
      display: "28,1K",
      labelFr: "Vues Instagram sur 30 jours",
      labelEn: "30-Day Instagram Impressions",
      subFr: "Audience mode qualifiée",
      subEn: "Fashion-forward audience",
      url: "https://www.instagram.com/dorc.as_moira/"
    },
    {
      value: 26000,
      display: "26K",
      labelFr: "Vues mensuelles Pinterest",
      labelEn: "Monthly Pinterest Views",
      subFr: "Inspiration moodboards & lookbooks",
      subEn: "Moodboard curation traction",
      url: "https://pin.it/1GRwMbeNP"
    }
  ]"""

data_content = re.sub(metrics_pattern, new_metrics, data_content)

with open("js/data.js", "w", encoding="utf-8") as f:
    f.write(data_content)
print("[OK] js/data.js mis à jour avec les liens sociaux certifiés et facebook vide")

# 2. Mise à jour de index.html
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Icônes SVG communes fines et élégantes
svg_icons = {
    "instagram": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
    "tiktok": '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 9.87 5.28 6.32 6.32 0 0 0 2.81-5.31V8.75a8.27 8.27 0 0 0 4.77 1.51V6.8a4.85 4.85 0 0 1-1-.11z"/></svg>',
    "pinterest": '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>',
    "whatsapp": '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.477-.15-.677.15-.2.301-.777.979-.953 1.18-.175.201-.351.226-.652.075-.3-.15-1.267-.467-2.414-1.49-1.02-.91-1.708-2.033-1.908-2.385-.2-.351-.021-.541.13-.691.135-.135.301-.351.451-.527.151-.175.2-.3.301-.501.101-.2.05-.376-.025-.526-.075-.15-.677-1.632-.928-2.235-.245-.589-.494-.509-.677-.518-.175-.01-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.3-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.228 3.109.15.2 2.119 3.235 5.133 4.537.717.31 1.277.495 1.714.634.721.229 1.377.197 1.896.119.579-.087 1.78-.727 2.031-1.43.251-.702.251-1.304.175-1.43-.075-.125-.276-.201-.577-.351z"/></svg>',
    "email": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>',
    "phone": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>'
}

# (A) Rangée d'icônes dans le menu plein écran
new_menu_socials = f"""      <div class="menu-footer-socials-icons">
        <a href="https://www.instagram.com/dorc.as_moira/" target="_blank" rel="noopener" class="social-icon-btn" aria-label="Instagram">{svg_icons['instagram']}</a>
        <a href="https://www.tiktok.com/@dorcas_moira" target="_blank" rel="noopener" class="social-icon-btn" aria-label="TikTok">{svg_icons['tiktok']}</a>
        <a href="https://pin.it/1GRwMbeNP" target="_blank" rel="noopener" class="social-icon-btn" aria-label="Pinterest">{svg_icons['pinterest']}</a>
        <a href="https://wa.me/212779732777" target="_blank" rel="noopener" class="social-icon-btn" aria-label="WhatsApp">{svg_icons['whatsapp']}</a>
        <a href="mailto:Dorcassmoira@gmail.com" class="social-icon-btn" aria-label="Email">{svg_icons['email']}</a>
        <a href="tel:+212779732777" class="social-icon-btn" aria-label="Téléphone">{svg_icons['phone']}</a>
      </div>"""

html = re.sub(r'<div class="menu-footer-socials">[\s\S]*?</div>', new_menu_socials, html)

# (B) Rangée d'icônes dans le Footer
footer_socials = f"""      <div class="footer-socials-icons">
        <a href="https://www.instagram.com/dorc.as_moira/" target="_blank" rel="noopener" class="social-icon-btn" aria-label="Instagram">{svg_icons['instagram']}</a>
        <a href="https://www.tiktok.com/@dorcas_moira" target="_blank" rel="noopener" class="social-icon-btn" aria-label="TikTok">{svg_icons['tiktok']}</a>
        <a href="https://pin.it/1GRwMbeNP" target="_blank" rel="noopener" class="social-icon-btn" aria-label="Pinterest">{svg_icons['pinterest']}</a>
        <a href="https://wa.me/212779732777" target="_blank" rel="noopener" class="social-icon-btn" aria-label="WhatsApp">{svg_icons['whatsapp']}</a>
        <a href="mailto:Dorcassmoira@gmail.com" class="social-icon-btn" aria-label="Email">{svg_icons['email']}</a>
        <a href="tel:+212779732777" class="social-icon-btn" aria-label="Téléphone">{svg_icons['phone']}</a>
      </div>"""

if '<div class="footer-socials-icons">' not in html:
    html = html.replace('<div class="footer-logo-script">Dorcas Moïra</div>', footer_socials + '\n\n      <div class="footer-logo-script">Dorcas Moïra</div>')

# (C) Section Chiffres : rendre les 4 compteurs cliquables
old_metrics_grid = re.search(r'<div class="metrics-grid">[\s\S]*?</div>\s*</div>', html)
new_metrics_grid = """<div class="metrics-grid">
        <a href="https://www.tiktok.com/@dorcas_moira" target="_blank" rel="noopener" class="metric-card metric-card-link" aria-label="Voir le profil TikTok">
          <div class="metric-link-indicator">↗</div>
          <div class="metric-number" data-target="100000" data-prefix="+" data-suffix="K">+100K</div>
          <div class="metric-label" data-i18n="metric_1_l">Vues sur TikTok</div>
          <div class="metric-sub" data-i18n="metric_1_s">Portée virale globale</div>
        </a>

        <a href="https://www.tiktok.com/@dorcas_moira" target="_blank" rel="noopener" class="metric-card metric-card-link" aria-label="Voir les vidéos TikTok">
          <div class="metric-link-indicator">↗</div>
          <div class="metric-number" data-target="63300" data-suffix="K">63,3K</div>
          <div class="metric-label" data-i18n="metric_2_l">Likes sur TikTok</div>
          <div class="metric-sub" data-i18n="metric_2_s">Interactions & Partages</div>
        </a>

        <a href="https://www.instagram.com/dorc.as_moira/" target="_blank" rel="noopener" class="metric-card metric-card-link" aria-label="Voir le profil Instagram">
          <div class="metric-link-indicator">↗</div>
          <div class="metric-number" data-target="28100" data-suffix="K">28,1K</div>
          <div class="metric-label" data-i18n="metric_3_l">Vues Instagram</div>
          <div class="metric-sub" data-i18n="metric_3_s">Sur les 30 derniers jours</div>
        </a>

        <a href="https://pin.it/1GRwMbeNP" target="_blank" rel="noopener" class="metric-card metric-card-link" aria-label="Voir le profil Pinterest">
          <div class="metric-link-indicator">↗</div>
          <div class="metric-number" data-target="26000" data-suffix="K">26K</div>
          <div class="metric-label" data-i18n="metric_4_l">Vues mensuelles Pinterest</div>
          <div class="metric-sub" data-i18n="metric_4_s">Moodboards mode & style</div>
        </a>
      </div>"""

html = re.sub(r'<div class="metrics-grid">[\s\S]*?</div>\s*</div>', new_metrics_grid + "\n      </div>", html)

# (D) Reels : liens exacts
html = html.replace('href="https://tiktok.com/@dorcas_moira"', 'href="https://www.tiktok.com/@dorcas_moira"')
html = html.replace('href="https://instagram.com/dorc.as_moira"', 'href="https://www.instagram.com/dorc.as_moira/"')

# (E) Section Contact : téléphone cliquable + social-chips
new_contact_links = f"""          <div class="contact-direct-links">
            <a href="https://wa.me/212779732777" target="_blank" rel="noopener" class="contact-link-row">
              <span class="contact-link-icon">{svg_icons['whatsapp']}</span>
              <span>+212 779 732 777 (WhatsApp Direct)</span>
            </a>

            <a href="tel:+212779732777" class="contact-link-row">
              <span class="contact-link-icon">{svg_icons['phone']}</span>
              <span>+212 779 732 777 (Appels & Bookings)</span>
            </a>

            <a href="mailto:Dorcassmoira@gmail.com" class="contact-link-row">
              <span class="contact-link-icon">{svg_icons['email']}</span>
              <span>Dorcassmoira@gmail.com</span>
            </a>

            <div class="contact-link-row">
              <span class="contact-link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </span>
              <span>Casablanca, Maârif — Maroc</span>
            </div>
          </div>

          <div class="social-chips-row">
            <a href="https://www.instagram.com/dorc.as_moira/" target="_blank" rel="noopener" class="social-chip">{svg_icons['instagram']} <span>Instagram</span></a>
            <a href="https://www.tiktok.com/@dorcas_moira" target="_blank" rel="noopener" class="social-chip">{svg_icons['tiktok']} <span>TikTok</span></a>
            <a href="https://pin.it/1GRwMbeNP" target="_blank" rel="noopener" class="social-chip">{svg_icons['pinterest']} <span>Pinterest</span></a>
          </div>"""

html = re.sub(r'<div class="contact-direct-links">[\s\S]*?<div class="social-chips-row">[\s\S]*?</div>', new_contact_links, html)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("[OK] index.html mis à jour avec les icônes, métriques cliquables et réseaux sociaux")

# 3. Styles dans css/style.css
with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

social_css = """
/* ==========================================================================
   STYLE SOCIAL ICONS & CLIC METRIC CARDS
   ========================================================================== */
.menu-footer-socials-icons,
.footer-socials-icons {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.footer-socials-icons {
  justify-content: center;
  margin-bottom: 24px;
}

.social-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--espresso);
  border: 1px solid rgba(184, 122, 82, 0.28);
  color: var(--copper-light);
  transition: all 0.3s var(--ease-waw);
}

.social-icon-btn:hover {
  color: var(--cream);
  border-color: var(--copper);
  background: rgba(184, 122, 82, 0.2);
  transform: translateY(-3px) scale(1.08);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(184, 122, 82, 0.3);
}

.metric-card-link {
  text-decoration: none;
  display: block;
  position: relative;
  transition: transform 0.35s var(--ease-waw), border-color 0.3s ease, box-shadow 0.35s ease;
  cursor: pointer;
}

.metric-card-link:hover {
  transform: translateY(-4px);
  border-color: var(--copper);
  box-shadow: 0 12px 28px rgba(0,0,0,0.6), 0 0 20px rgba(184, 122, 82, 0.25);
}

.metric-link-indicator {
  position: absolute;
  top: 14px;
  right: 14px;
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--copper);
  opacity: 0.6;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.metric-card-link:hover .metric-link-indicator {
  opacity: 1;
  transform: translate(2px, -2px);
  color: var(--copper-light);
}

.social-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
"""

if ".social-icon-btn" not in css:
    css += "\n" + social_css
    with open("css/style.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("[OK] css/style.css mis à jour avec les styles des icônes et boutons sociaux")
else:
    print("[INFO] css/style.css contient déjà les styles sociaux")
