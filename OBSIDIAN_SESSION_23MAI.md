# 24 Mai — Session Embyr HackerNoon + Cross-Post

**Date :** Dimanche 24 Mai 2026 — 00h-01h

## Objectif
Publier l'article Embyr sur HackerNoon et Dev.to, configurer GSC.

## Résultat

### ✅ HackerNoon — Compte prêt
- **Email :** embyrblog@wshu.net
- **Password :** EmbyrBlog2026!
- **Handle :** embyrapp (✅ défini via profilesApi/update)
- **Login API :** `POST us-central1-hackernoon-app.cloudfunctions.net/auth2/login/email` → Firebase idToken
- **Article :** `/tmp/embyr-hn-article.md` — titre, tags, body, canonical_url
- **Éditeur :** sur `app.hackernoon.com/new` (sous-domaine séparé)
- **Flow :** Login → `/p/publish` → Start Writing Now (3 clics) → remplir éditeur → Publish
- **Story API :** `storyApi/publish` trouvé mais retourne 500 (body format inconnu)
- **Cron :** Rappel Telegram à 10h15 pour publier manuellement (5 min)

### ❌ Dev.to — Bloqué
- OAuth uniquement (Apple/FB/GitHub/Google/MLH/Twitter)
- Aucune inscription email possible
- GitHub tools trouvés (cross-post 131★, devto-cli 12★, mcp-devto) mais tous besoin API Key

### 🛠 GitHub Tools Installés
- `cross-post-blog` (npm global) — Dev.to, Hashnode, Medium
- Skills Hermes créées : `blog-cross-post`, `hackernoon-publish`

### ✅ GSC — Fichier de vérification déployé
- `https://embir.xyz/c1f3a9e8b7d6f5a4c3b2a1f0e9d8c7b6.txt` → 200 OK
- Besoin compte Google pour ajouter propriété + soumettre sitemap

## Prochaines Actions
1. **Demain 10h00** → Show HN automatique (cron existant)
2. **Demain 10h15** → Publier HackerNoon manuellement (rappel Telegram)
3. **GSC** → Ajouter propriété dans Google Search Console
4. **Dev.to** → Si possible via GitHub OAuth
