# Embir — Modules Réellement Fonctionnels

Dernière mise à jour : 14 Mai 2026

## Modules OK (backend + frontend vérifié)

| Module | Backend | Frontend | Testé |
|--------|---------|----------|-------|
| Auth (register/login) | ✅ | ✅ | ✅ curl |
| Dashboard/Profil | ✅ | ✅ | ✅ curl |
| Découvrir (Match) | ✅ | ✅ | — |
| Messages | ✅ | ✅ | — |
| Membres | ✅ | ✅ | — |
| Favoris | ✅ | ✅ | ✅ 200 |
| Blacklist | ✅ | ✅ | ✅ 200 |
| Stripe Checkout | ✅ | ✅ | — |
| Stripe Webhook | ✅ | ✅ | — |
| Admin | ✅ | ✅ | — |
| Ambassadrices | ✅ | ✅ | — |
| Vérification | ✅ | ✅ | — |
| Notifications | ✅ | ✅ | ✅ 200 |
| Pages légales (8) | ✅ | ✅ | ✅ 200 |
| Pricing | ✅ | ✅ | — |
| Forum | ✅ | ✅ | ✅ 200 |
| Forum [id] | ✅ | ✅ | ✅ build |
| Albums | ✅ | ✅ | ✅ 200 |
| Témoignages | ✅ | ✅ | ✅ 200 |
| Salons | ✅ | ✅ | ✅ 200 |
| Salons [id] | ✅ | ✅ | ✅ build |
| Annonces | ✅ | ✅ | ✅ 200 |
| Vidéos | ✅ | ✅ | ✅ 200 |
| Certification | ✅ | ✅ | ✅ 200 |
| Paramètres | ✅ | ✅ | ✅ 200 |
| Mode Discret | ✅ | ✅ | ✅ 200 |
| Affichage | ✅ | ✅ | ✅ 200 |
| FAQ | ✅ | ✅ | ✅ 200 |
| Sites Partenaires | ✅ | ✅ | ✅ 200 |
| Installer App | ✅ | ✅ | ✅ 200 |
| Aperçu Visiteur | ✅ | ✅ | ✅ 200 |
| PWA | ✅ | ✅ | ✅ manifest |

## APIs créées le 14 Mai 2026

- `GET/POST /api/albums`
- `GET/PATCH/DELETE /api/albums/[id]`
- `GET/POST /api/testimonials`
- `PATCH/DELETE /api/testimonials/[id]`
- `GET /api/salons`
- `GET /api/salons/[id]`
- `POST /api/salons/[id]/messages`
- `GET/POST /api/classifieds`
- `DELETE /api/classifieds/[id]`
- `GET/POST /api/videos`
- `DELETE /api/videos/[id]`
- `GET/POST /api/certification`
- `GET/POST /api/forum`
- `GET/POST /api/forum/[id]`
- `POST /api/forum/[id]/posts`

## Modèles Prisma ajoutés

- Album, AlbumPhoto, AlbumAccessRequest
- Testimonial
- Salon, SalonMessage
- Classified
- Video
- CertificationRequest
