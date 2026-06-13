# Embir — Tests & Validation

**Date :** 14 Mai 2026

## Build
- **Embir** : ✅ 55 routes, 0 erreur, 1 warning (twilio)
- **Feminya** : ✅ 30 routes, 0 erreur

## Tests HTTP (curl)

| Endpoint | Code | Contenu |
|----------|------|---------|
| GET / | 200 | Landing |
| GET /salons | 200 | Page salons |
| GET /annonces | 200 | Page annonces |
| GET /forum | 200 | Page forum |
| GET /videos | 200 | Page vidéos |
| GET /albums | 200 | Page albums |
| GET /temoignages | 200 | Page témoignages |
| GET /favoris | 200 | Page favoris |
| GET /premium | 200 | Page premium |
| GET /blacklist | 200 | Page blacklist |
| GET /certification | 200 | Page certification |
| GET /faq | 200 | Page FAQ |
| GET /parametres | 200 | Page paramètres |
| GET /notifications | 200 | Page notifications |
| GET /mode-discret | 200 | Page mode discret |
| GET /api/salons | 200 | [] (seed à venir) |
| GET /api/classifieds | 200 | [] |
| GET /api/forum | 200 | [] |
| GET /api/videos | 200 | [] |
| GET /api/albums | 401 | Protégé (normal) |
| GET /api/testimonials | 401 | Protégé (normal) |

## Test Flux Inscription (Feminya)

| Étape | Résultat |
|-------|----------|
| POST /api/auth/register | 201, token reçu |
| GET /api/profile/me | 200, profil par défaut |
| PUT /api/profile/me | 200, données sauvegardées |
| Données persistées | ✅ (displayName, age, city) |

## Non testé (nécessite device ou config externe)
- Safari iPhone visuel
- Clavier iOS sur formulaires
- PWA installation réelle
- 3D tilt sur device tactile
- Stripe checkout réel
- SMS vérification
- Upload photos
