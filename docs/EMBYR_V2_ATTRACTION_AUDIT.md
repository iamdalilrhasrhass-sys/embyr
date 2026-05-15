# EMBYR V2 — Audit & État des lieux

*Date : 15 mai 2026*

## Projet
- Dossier : `/root/embyr`
- Framework : Next.js App Router (TypeScript)
- PM2 : `embyr-web` (ID 35, port 3100)
- Domaine : https://embir.xyz
- DB : PostgreSQL locale

## Routes (15/15 OK)
| Route | Statut | Notes |
|-------|--------|-------|
| / | 200 | Landing V2 |
| /membres | 200 | Filtres + cartes |
| /membres/[id] | 200 | Détail profil |
| /premium | 200 | Premium bientôt |
| /pricing | 200 | Premium bientôt |
| /messages | 200 | Messagerie temps réel |
| /inviter | 200 | Invitation copiable |
| /dashboard | 200 | Cockpit membre |
| /dashboard/profile | 200 | Édition profil |
| /auth/login | 200 | Login |
| /auth/register | 200 | Inscription |
| /favoris | 200 | Favoris |
| /forum | 200 | Forum |
| /legal/* | 200 | Pages légales |
| /decouvrir | 200 → redirect /membres | Redirect ajouté |

## Pages faibles (corrigées)
- `/membres/[id]` — CTA Premium agressif remplacé par "Envoyer un message" gratuit + "Accès gratuit. Voir tous les profils"
- `/decouvrir` — Pas de redirect vers /membres (corrigé dans next.config.ts)

## Fonctionnalités déjà présentes
- Landing complète (Hero, Pourquoi, Membre fondateur, Comment ça marche, Gratuit, Premium bientôt)
- Premium page douce (prix cachés, pas de checkout agressif)
- Navigation (Membres, Premium bientôt, badge gratuit)
- Dashboard (progression profil, badge fondateur, CTAs)
- Membres (filtres, état vide, cartes)
- Messages (conversations, temps réel, input/send)
- Invitation (copiable, WhatsApp, SMS)
- Footer (légal, contact, sécurité)
- Design Aurora-Bubble indigo/cyan

## Bugs/risques
- API plans backend conserve les prix (normal, Stripe intact)
- Messagerie non testée avec 2 comptes réels
- Stripe non testé en réel

## Plan d'amélioration appliqué
1. ✅ Landing refonte attraction gratuite
2. ✅ Premium discret "bientôt"
3. ✅ Navigation cohérente
4. ✅ Dashboard attractif
5. ✅ CTA messagerie gratuit sur profil
6. ✅ Redirect /decouvrir → /membres
7. ✅ Test mobile 375px (9/9 OK)
8. ✅ Build OK
