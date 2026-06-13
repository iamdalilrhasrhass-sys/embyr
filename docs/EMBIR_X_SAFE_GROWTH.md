# Stratégie X (Twitter) — @EMBIR_APP

## État actuel
- Compte : @EMBIR_APP (créé récemment)
- Statut : **rate-limité** (trop de tentatives automatisées depuis le VPS)
- Scripts agressifs : **désactivés et supprimés** ✅
- Cron X (toutes les 30 min) : **supprimé** ✅
- PP + Bannière : prêtes dans `/tmp/embir_x_pp.png` et `/tmp/embir_x_banner.png`

## Phase 1 — Chauffe manuelle (48h)
**Ne rien automatiser. Le compte est neuf et surveillé.**

1. **Connexion manuelle** depuis un téléphone ou navigateur normal (pas VPS)
2. **Vérification email + téléphone** si demandé
3. **Mettre la PP + bannière** manuellement
4. **Bio simple** : "Rencontre gay repensée. Gratuite. IA. Sans pub. embir.xyz"
5. **1 à 2 posts/jour max** — pas de like, reply, follow automatisé
6. **Attendre 48h** sans comportement suspect

### Exemples de posts Phase 1
> Embir arrive. Une plateforme de rencontres plus directe, plus internationale, plus simple. 25 langues. Une expérience pensée pour connecter les gens sans friction. embir.xyz

> On construit Embir pour ceux qui veulent une vraie expérience de rencontre, sans interface froide ni parcours interminable. Ouverture progressive. embir.xyz

## Phase 2 — Engagement assisté (J+3 à J+7)
**Hermès prépare, toi tu valides. Rien n'est posté automatiquement.**

- Chercher 20 tweets pertinents/jour
- Proposer 10 réponses
- Classer les opportunités
- NE JAMAIS like/follow/reply auto

## Phase 3 — API officielle
Pour poster proprement :
1. Créer une app sur https://developer.twitter.com
2. Récupérer : Client ID, Client Secret, Bearer Token
3. Authentification OAuth 2.0 with PKCE
4. Permissions : read + tweet + search uniquement
5. Stocker dans `/root/embyr/.env`

## Limites quotidiennes recommandées
| Action | J1-2 | J3-7 | J8-14 | J15+ |
|--------|------|------|-------|------|
| Posts | 1-2 | 2-3 | 3-4 | 4-6 |
| Likes | 0 | 5 (manuel) | 10-15 | 20 |
| Replies | 0 | 3 (validé) | 5-8 | 10 |
| Follows | 0 | 5/jour | 10/jour | 20/jour |

## Scripts désactivés
- `cronjob:78c48851b3ce` — Embyr X Posting (supprimé)
- `/tmp/x_engage.py` — like + reply auto (supprimé)
- `/tmp/x_playwright_v5.py` — login auto (supprimé)
- `/tmp/x_*.py` — tous les scripts X (supprimés)

## À ne PAS faire
❌ Like automatique
❌ Reply automatique
❌ Follow automatique
❌ Recherche massive sur hashtag (#gay, #dating)
❌ DM automatique
❌ Login automatisé depuis VPS
❌ Tentatives de contournement API

## À faire à la place
✅ Contenu original uniquement
✅ Engagement préparé, validé humainement
✅ Croissance lente et organique
✅ Diversifier les canaux : Reddit, TikTok, Instagram

## Ressources
- Images PP + banner : `/tmp/embir_x_pp.png`, `/tmp/embir_x_banner.png`
- Site : https://embir.xyz
- Support : contact@embir.xyz
