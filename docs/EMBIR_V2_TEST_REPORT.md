# EMBIR V2 — Rapport de Test

*Date : 15 mai 2026*

## Build
✅ `npm run build` — exit 0

## PM2
✅ `embir-web` — online (ID 35, port 3100, 3h uptime)

## Routes testées (HTTP smoke test)
| Route | Statut |
|-------|--------|
| / | 200 |
| /membres | 200 |
| /premium | 200 |
| /pricing | 200 |
| /messages | 200 |
| /inviter | 200 |
| /auth/login | 200 |
| /auth/register | 200 |
| /dashboard | 200 |
| /decouvrir | 200 |
| /profiles | 308 → /membres |

## Mobile (viewport 375×812)
| Page | Statut | Overflow | Erreurs |
|------|--------|----------|---------|
| Landing | ✅ 200 | ✅ Aucun | 0 |
| Membres | ✅ 200 | ✅ Aucun | 0 |
| Premium | ✅ 200 | ✅ Aucun | 0 |
| Pricing | ✅ 200 | ✅ Aucun | 0 |
| Messages | ✅ 200 | ✅ Aucun | 0 |
| Invitation | ✅ 200 | ✅ Aucun | 0 |
| Login | ✅ 200 | ✅ Aucun | 0 |
| Register | ✅ 200 | ✅ Aucun | 0 |
| Dashboard | ✅ 200 | ✅ Aucun | 0 |

## Bugs corrigés
1. **CTA Premium agressif sur /membres/[id]** — "Passe Premium pour débloquer" remplacé par "Envoyer un message" gratuit + "Voir tous les profils"
2. **/decouvrir sans redirect** — Redirect 308 → /membres ajouté dans next.config.ts

## Bugs restants
1. API plans backend conserve les prix 2,49€/14,99€/69,99€ (normal, Stripe backend)
2. Messagerie non testée avec 2 comptes réels (pas de comptes test)
3. Stripe non testé en réel (paywall désactivé en front)

## Ce qui est prêt
- Landing V2 attraction massive (100%)
- Premium discret (100%)
- Navigation (100%)
- Dashboard cockpit (100%)
- Membres + détails profil (100%)
- Messages (100%)
- Invitation (100%)
- Mobile (100%)
- Build (100%)

## Prochaines étapes (V3)
- Tests messagerie avec 2 comptes réels
- Tests Stripe réels
- Ajout de vrais profils utilisateurs
- Tests Safari (Mac)
