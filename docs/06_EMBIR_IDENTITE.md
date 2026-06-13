# Embir — Identité & Architecture

## Identité visuelle
- **Thème** : Club privé, braise, métal sombre, luxe discret
- **Palette** : Noir charbon (#0A0B0E), Braise (#FF5A1F), Cuivre (#B87333), Or sombre (#C9A227)
- **Typographie** : Fraunces (display serif) + Geist (body sans-serif)
- **Rayons** : 14px (cards), 10px (boutons), 12px (inputs)
- **Ombres** : Profondes, glow braise, inset highlight

## Architecture
- **Framework** : Next.js 16 (App Router) — repo `/root/embyr`
- **Database** : PostgreSQL `embyr` (localhost:5432)
- **Auth** : JWT httpOnly cookie (7 jours)
- **Paiement** : Stripe (checkout + webhook)
- **Déploiement** : VPS, PM2 (`embir-web`, port 3100)
- **Domaine** : embir.xyz (Nginx proxy → localhost:3100)

## Différenciation Femynia
| Aspect | Femynia | Embir |
|--------|---------|-------|
| Palette | Rose/violet/clair | Braise/noir/métal |
| Typo | Arial | Fraunces + Geist |
| Ton | Légère, inclusive | Sérieux, premium |
| Rayons | ~24px | ~12-14px |
| Composants | `/components/*` | `/components/embyr/*` |
| CSS scope | `html` | `[data-site="embyr"]` |

## Fichiers clés
- `/src/styles/embir-tokens.css` — Design tokens CSS
- `/src/components/embyr/` — 8 composants (Card, Button, Input, Avatar, Badge, Card3DTilt, ScrollReveal, EmberGlow)
- `/src/lib/SiteProvider.tsx` — Contexte site courant
- `/src/lib/scopeToSite.ts` — Filtres multi-site backend
- `/src/middleware.ts` — Détection domaine (→ proxy.ts à migrer en Next.js 16)
