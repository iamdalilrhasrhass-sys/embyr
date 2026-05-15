# EMBYR V2 — Test Report

**Date**: 2026-05-15
**Build**: ✅ Successful (Turbopack, 1 warning non-bloquant)

## Routes testées (HTTP 200)

| Route | HTTP | Taille |
|---|---|---|
| / | 200 | 52.6 KB |
| /premium | 200 | 20.7 KB |
| /pricing | 200 | 21.2 KB |
| /auth/login | 200 | 17.5 KB |
| /auth/register | 200 | 19.4 KB |
| /dashboard | 200 | 22.8 KB |
| /membres | 200 | 19.8 KB |
| /messages | 200 | 14.3 KB |
| /inviter | 200 | 19.0 KB |
| /dashboard/profile | 200 | 23.4 KB |
| /ambassadeur | 200 | 21.7 KB |
| /favoris | 200 | 16.8 KB |

## Mobile testé (Playwright)

Largeurs : 375, 390, 430 px
Pages : landing, register, login, dashboard, membres, messages, premium, inviter
Résultat : ✅ Zéro overflow horizontal sur 24 combinaisons

## PM2

- Process : embyr-web (ID 35)
- Port : 3100
- Status : online
- Restarts : 63

## Contenu vérifié

- [x] "gratuit" présent sur landing
- [x] "fondateur" présent sur landing
- [x] "bientôt" présent sur premium
- [x] "bientôt" présent sur pricing
- [x] "lancement" présent sur dashboard
- [x] "embir.xyz" présent sur inviter
- [x] "499€" absent de ambassadeur

## Bugs trouvés

Aucun bug bloquant.

### Mineurs
- 1 warning Turbopack (non-bloquant, pré-existant)

## Bugs corrigés

- Prix 499€/an affiché sur page ambassadeur → remplacé par "Avantages Fondateur"
- Navigation desktop pointait vers /decouvrir, /profiles → /membres, /premium
- BottomNav mobile pointait vers /profiles → /membres
- DashboardContent bannière Premium → "Premium arrive bientôt"
- Metadata title/description → nouvelle baseline gratuite

## Ce qui est prêt

- Landing V2 complète (hero, pourquoi, fondateur, étapes, gratuit, premium bientôt, CTA)
- Premium page "bientôt" douce
- Pricing page "bientôt" douce
- Dashboard cockpit (badge lancement, progression, navigation)
- Membres page avec filtres et état vide
- Messages page avec état vide
- Invitation page avec copie lien + message
- Navigation desktop + mobile cohérente
- Design système premium-dark

## Ce qui reste pour V3

- Filtres membres connectés à l'API (UI prête)
- Badge Fondateur backend (UI prête)
- Progression profil calculée (UI prête)
- Messagerie temps réel (polling fonctionnel)
- Premium checkout backend (conservé, juste caché)
- Vérification profil
- Albums privés
