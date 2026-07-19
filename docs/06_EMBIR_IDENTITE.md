# Embir — Identité & Architecture

## Identité visuelle

L’autorité visuelle est [Embir Brand OS 1.0](./BRAND_SYSTEM.md) : deux boucles entrelacées, mot-symbole `Embir`, surfaces void/prune, accents rose/blush et neutres bone/ivoire. Les anciennes directions braise, cuivre et point-étincelle sont historiques.

## Architecture
- **Framework** : Next.js 16 (App Router) — repo `/root/embyr`
- **Database** : PostgreSQL `embyr` (localhost:5432)
- **Auth** : JWT httpOnly cookie (7 jours)
- **Paiement** : Stripe présent mais désactivé tant qu’aucune activation explicite n’est décidée
- **Déploiement** : VPS, releases immuables, PM2 (`embyr-web`, port 3100)
- **Domaine** : embir.xyz (Nginx proxy → localhost:3100)

## Différenciation Femynia
| Aspect | Femynia | Embir |
|--------|---------|-------|
| Palette | Rose/violet/clair | Void/prune/rose/bone |
| Typo | Arial | Fraunces + Geist |
| Ton | Légère, inclusive | Sérieux, premium |
| Rayons | ~24px | ~12-14px |
| Composants | `/components/*` | `/components/brand/*`, `/components/embir/*` |
| CSS scope | `html` | `[data-site="embir"]` |

## Fichiers clés
- `/src/styles/embir-brand-tokens.css` — source de vérité visuelle
- `/src/components/brand/` — symbole, lockup et mouvement réciproque
- `/src/lib/SiteProvider.tsx` — Contexte site courant
- `/src/lib/scopeToSite.ts` — Filtres multi-site backend
- `/src/middleware.ts` — Détection domaine (→ proxy.ts à migrer en Next.js 16)
