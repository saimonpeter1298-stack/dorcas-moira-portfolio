# Dorcas Moïra — Portfolio Haute Couture

> **Portfolio officiel de SAPHOU Dorcas Moïra**  
> *Mannequin Photo & Muse Mode Afro — Casablanca, Maroc*  
> *Candidate officielle Miss Gabon Maroc 2026*  
> Site web : [dorcasmoira.com](https://dorcasmoira.com)

---

## ✦ Présentation

Ce portfolio est conçu selon les plus hauts standards éditoriaux et visuels de l'industrie de la mode (direction artistique espresso & cuivre, animations GSAP 60 FPS, typographie haute couture, comp card téléchargeable et système de galeries adaptatif).

Le projet est optimisé pour une mise en production rapide, sécurisée et performante sur **GitHub + Vercel** avec nom de domaine personnalisé.

---

## 🚀 1. Lancement en Local

### Prérequis
- **Node.js** (v18+) ou **Python** (v3.9+)

### Démarrage rapide (Développement)
Vous pouvez lancer le serveur local via l'une des commandes suivantes :

```bash
# Via Python
python -m http.server 3000

# Ou via Node.js
npx serve .
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 📦 2. Build de Production

Le script de build génère un dossier `dist/` autonome et épuré contenant uniquement les fichiers prêts pour le CDN :

```bash
# Commande npm
npm run build

# Ou via Node directement
node tools/build.js

# Ou via Python
python build.py
```

### Ce que fait le build automatiquement :
1. Nettoie et recrée le dossier `dist/`.
2. Injecte l'URL canonique, Open Graph et Schema.org Person depuis `site.config.json`.
3. Ajoute un paramètre de cache-busting `?v=<hash>` sur les fichiers CSS et JS pour forcer le rafraîchissement chez les visiteurs sans risque de cache persistant.
4. Génère `robots.txt` et `sitemap.xml` à jour.
5. Copie `404.html`, la comp card PDF et les favicons.
6. Ne copie dans `dist/assets/images/` **que** les photos réelles utilisées et leurs variantes WebP/AVIF (les dossiers de travail et les placeholders inutilisés sont strictement exclus).
7. Valide l'intégrité de tous les liens (garantit **0 erreur 404**).

### Tester la version de production localement :
```bash
npm start
# ou
npx serve dist
```

---

## 🌐 3. Déploiement sur Vercel avec Domaine Personnalisé

### Étape 1 : Créer le dépôt GitHub
Le dépôt local est déjà initialisé avec la branche `main` et un commit propre.

1. Créez un nouveau dépôt privé ou public sur [GitHub](https://github.com/new) (ex. `dorcas-moira-portfolio`).
2. Liez et poussez votre branche `main` :
   ```bash
   git remote add origin https://github.com/<votre-utilisateur>/<votre-repo>.git
   git branch -M main
   git push -u origin main
   ```

### Étape 2 : Importer le projet dans Vercel
1. Rendez-vous sur votre dashboard [Vercel](https://vercel.com/new).
2. Cliquez sur **Import** en face de votre dépôt GitHub.
3. Vercel détecte automatiquement la configuration grâce à `vercel.json` :
   - **Framework Preset** : `Other`
   - **Build Command** : `node tools/build.js`
   - **Output Directory** : `dist`
4. Cliquez sur **Deploy**.

### Étape 3 : Configurer votre Domaine Personnalisé
1. Dans Vercel, allez dans **Settings** $\rightarrow$ **Domains**.
2. Ajoutez votre domaine racine (ex. `dorcasmoira.com`) et le sous-domaine `www.dorcasmoira.com`.
3. Vercel gère automatiquement la redirection `www.dorcasmoira.com` $\rightarrow$ `https://dorcasmoira.com` (définie dans `vercel.json`) et le certificat SSL gratuit Let's Encrypt.
4. Mettez à jour les enregistrements DNS chez votre registrar :
   - **Type A** : `@` $\rightarrow$ `76.76.21.21`
   - **Type CNAME** : `www` $\rightarrow$ `cname.vercel-dns.com`

---

## ⚙️ 4. Configuration de l'URL du Site (`SITE_URL`)

L'URL officielle du site est centralisée dans un seul fichier : [site.config.json](site.config.json) :

```json
{
  "SITE_URL": "https://dorcasmoira.com"
}
```

Si votre domaine final est différent (ex. `https://dorcas-moira.com` ou un sous-domaine `.vercel.app`), il vous suffit de modifier cette valeur dans `site.config.json` (ou d'ajouter une variable d'environnement `SITE_URL` dans les paramètres de votre projet Vercel). Lors du prochain build, toutes les balises suivantes seront automatiquement recalculées :
- `<link rel="canonical">`
- `og:url` et `og:image` (en URL absolue)
- `twitter:image`
- Schema.org JSON-LD Person (`url` et `image`)
- `sitemap.xml` et `robots.txt`

---

## 📸 5. Ajouter de Nouvelles Photos

Le système est conçu pour être évolutif :

1. **Déposer les photos brutes** : Déposez les nouveaux fichiers JPEG/PNG dans `assets/_incoming/`.
2. **Intégration & Variantes** : Associez les photos dans `js/data.js` (ou via le script d'intégration approprié) pour régler le point focal et désactiver le statut placeholder (`placeholder: false`).
3. **Optimisation** : Générez les déclinaisons WebP et AVIF (`python tools/optimize.py` ou script dédié).
4. **Rebuild & Déploiement** :
   ```bash
   npm run build
   git add .
   git commit -m "feat: ajout de nouvelles photos haute définition"
   git push origin main
   ```
   *Vercel détectera automatiquement le commit et déploiera la nouvelle version en quelques secondes.*

---

## 🛡️ 6. Sécurité & En-têtes HTTP

Le fichier `vercel.json` applique les meilleures pratiques de mise en cache et de sécurité :
- **Assets statiques immutables** (`/assets/*`, `/css/*`, `/js/*`, images, polices) : `Cache-Control: public, max-age=31536000, immutable`
- **Pages HTML** (`/index.html`, `/`) : `Cache-Control: public, max-age=0, must-revalidate` (toujours fraîches grâce au cache-busting `?v=<hash>` sur les CSS/JS)
- **Sécurité** :
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: SAMEORIGIN`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`
