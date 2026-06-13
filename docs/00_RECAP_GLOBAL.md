# Embir — Récapitulatif Global

**Date :** 14 Mai 2026
**Repo :** `/root/embyr`
**Domaine :** embir.xyz
**PM2 :** embir-web (ID 35, port 3100)
**DB :** PostgreSQL `embyr` @ localhost:5432

## Architecture
- Next.js 16 (App Router, Turbopack)
- Prisma ORM (41 modèles)
- JWT httpOnly cookie (7 jours)
- Stripe (checkout + webhook)
- Nginx reverse proxy (HTTPS Let's Encrypt)

## Build
- 55 routes (40 statiques, 15 dynamiques)
- 0 erreur TypeScript
- 1 warning (twilio non installé — normal)

## Pages (15)
| Page | Statut |
|------|--------|
| / | Landing |
| /auth/login | Connexion |
| /auth/register | Inscription |
| /decouvrir | Match/Swipe |
| /dashboard | Profil |
| /dashboard/profile | Édition profil |
| /profiles | Membres |
| /profiles/[id] | Profil public |
| /messages | Conversations |
| /salons | Salons chat |
| /salons/[id] | Salon détail |
| /annonces | Petites annonces |
| /forum | Forum |
| /forum/[id] | Discussion |
| /videos | Vidéos |
| /albums | Albums photos |
| /temoignages | Témoignages |
| /favoris | Favoris |
| /blacklist | Bloqués |
| /premium | Premium |
| /certification | Certification |
| /faq | FAQ |
| /parametres | Paramètres |
| /notifications | Notifications |
| /mode-discret | Mode discret |
| /affichage | Affichage |
| /sites-partenaires | Visibilité cross-site |
| /installer-application | PWA |
| /apercu-visiteur | Aperçu visiteur |
| /pricing | Tarifs |
| /verification | Vérification |
| Pages légales (8) | CGU, cookies... |

## APIs (50+)
- Auth (register, login, logout)
- Profile (GET, PUT)
- Messages (conversations, send)
- Match (like, unlike, feed)
- Favorites (add, remove, list)
- Blocks (block, unblock, list)
- Albums (CRUD, photos, access)
- Testimonials (send, approve, hide)
- Salons (list, detail, messages)
- Classifieds (CRUD, filters)
- Forum (categories, threads, posts)
- Videos (list, add URL, delete)
- Certification (request, status)
- Stripe (checkout, webhook)
- SMS (send-code, verify)
- Verification (request, upload)
- Ambassadors (apply, status)

## Design System
- **Palette :** Braise (#FF5A1F), Cuivre (#B87333), Or sombre (#C9A227), Charbon (#0A0B0E)
- **Typos :** Fraunces (display), Geist (body), Geist Mono (code)
- **Tokens :** `/src/styles/embir-tokens.css` (12 variables)
- **Composants :** `/src/components/embyr/` (Card, Button, Input, Avatar, Badge, Card3DTilt, EmberGlow, ScrollReveal)
- **Scope :** `[data-site="embyr"]` — isolation totale de Femynia

## Mobile
- 100dvh sur hauteurs critiques
- safe-area-inset-bottom sur bottom nav
- 44px min touch targets
- 16px min font-size inputs (anti-zoom iOS)
- viewport-fit=cover, maximum-scale=1

## PWA
- Manifest : `/public/manifest.json`
- Icônes : 192×192 + 512×512
- theme_color : #FF5A1F (braise)
- display : standalone
