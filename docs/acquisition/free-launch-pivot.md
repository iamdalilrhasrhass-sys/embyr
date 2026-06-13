# Embir — Pivot Lancement Gratuit

**Date**: 2026-05-15
**Décision**: Embir devient la plateforme principale, gratuite au lancement.

## Positionnement

"Rencontre plus librement. Gratuitement."

Embir est une nouvelle plateforme de rencontre moderne, élégante et gratuite pendant sa phase de lancement.

## Ce qui change

- Landing entièrement refaite (attraction, pas vente)
- Page Premium → "Premium bientôt" (doux, pas agressif)
- Page Pricing → redirige vers "Premium arrive bientôt"
- Prix masqués, checkout caché
- Stripe backend conservé intact
- Navigation : /membres remplace /decouvrir et /profiles
- Badge "Gratuit lancement" affiché partout
- Badge "Membre fondateur" mis en avant
- Invitation propre (copie, pas envoi auto)

## Ce qui ne change pas

- Architecture Stripe (endpoints /api/stripe/* conservés)
- Auth Google OAuth
- Base de données
- API profiles, messages, favorites
- Composants core (TiltCard, ScrollReveal, etc.)
- Design tokens premium-dark

## Gratuit pendant le lancement

- Inscription
- Profil
- Photos
- Consultation membres
- Messagerie de base
- Accès mobile

## Premium bientôt (plus tard)

- Voir qui visite ton profil
- Boost de visibilité
- Mise en avant
- Filtres avancés
- Albums privés
- Mode invisible
- Badge vérifié
- Messages illimités (si limitation future)

## Stratégie

1. Lancement gratuit → construction communauté
2. Premiers membres actifs → badge Fondateur + avantages Premium offerts
3. Masse critique atteinte → activation progressive Premium
4. Premium désirable mais non bloquant
