# EMBYR V2 — Audit d'Attraction

**Date** : 15 mai 2026
**Objectif** : Transformer Embyr en plateforme de rencontre généraliste gratuite au lancement.

## Routes existantes

| Route | État | Action V2 |
|-------|------|-----------|
| `/` | Landing club privé gay premium | **REFONTE** → landing généraliste gratuite |
| `/premium` | Page premium fade | **REFONTE** → "Premium bientôt" |
| `/pricing` | Grille tarifaire agressive | **REFONTE** → "Premium bientôt" doux |
| `/membres` | Grille membres OK | **AMÉLIORER** → états vides, badge fondateur |
| `/membres/[id]` | Fiche détail OK | **AMÉLIORER** → message bouton gratuit |
| `/messages` | Messagerie fonctionnelle | **AMÉLIORER** → états vides, mobile |
| `/dashboard` | Cockpit basique | **REFONTE** → cockpit fondateur |
| `/dashboard/profile` | Édition profil OK | **AMÉLIORER** → guidance complétion |
| `/auth/login` | Connexion OK | OK (mineur: texte) |
| `/auth/register` | Inscription OK | OK (mineur: texte) |

## Pages faibles
1. **Landing** : trop club gay privé, pas généraliste, prix affichés
2. **Pricing** : checkout Stripe agressif en CTA principal
3. **Premium** : page quasi-vide
4. **Dashboard** : pas de guidance, lien vers pricing
5. **Footer** : mention "gay" à retirer
6. **Navbar** : lien "Tarifs" + "Premium" agressif

## Bugs identifiés
1. Landing CTA → `/inscription` (route inexistante) → doit être `/auth/register`
2. Navbar lien `/profiles` → 308 redirect → doit être `/membres`
3. "Créer un compte" → `/auth/register` (OK mais pas clair que c'est gratuit)
4. `/inscription` et `/connexion` utilisés dans landing → routes inexistantes

## Plan d'amélioration appliqué
1. Landing : généraliste, gratuit lancement, CTA clairs
2. Premium/Pricing : transformer en "Premium bientôt"
3. Navigation : remplacer Tarifs par Premium bientôt
4. Dashboard : badges fondateur + progression + CTA
5. Membres : états vides premium + badge fondateur
6. Messages : état vide propre
7. Profil : guidance complétion
8. Footer : généraliste
9. Page /inviter : lien copiable
10. Métadonnées : titre/description généralistes
