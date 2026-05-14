# Embyr — Modules Réellement Fonctionnels

Dernière mise à jour : 14 Mai 2026

## Modules OK (backend + frontend branché)

| Module | API | Frontend | Notes |
|--------|-----|----------|-------|
| Auth (register/login) | ✅ | ✅ | Cookie httpOnly, JWT 7j |
| Dashboard | ✅ | ✅ | Profil, complétion |
| Découvrir (Match) | ✅ | ✅ | Swipe + feed |
| Messages | ✅ | ✅ | Conversations, envoi |
| Profils | ✅ | ✅ | Liste + détail |
| Favoris | ✅ | ✅ | Add/remove/lister |
| Blacklist | ✅ | ✅ | Blocage mutuel |
| Stripe Checkout | ✅ | ✅ | Paiement CB |
| Stripe Webhook | ✅ | ✅ | Activation premium |
| Admin | ✅ | ✅ | Users, reports, ambassadors |
| Ambassadrices | ✅ | ✅ | Candidature, parrainage |
| Vérification | ✅ | ✅ | Upload justificatif |
| Notifications | ✅ | ✅ | Préférences |
| Pages légales | ✅ | ✅ | CGU, confidentialité, mentions |
| Pricing | ✅ | ✅ | Plans premium |
| Forum (modèle) | ✅ | ✅ | Catégories + threads + posts |
| Albums | ✅ | ✅ | CRUD, photos, privé/public |
| Témoignages | ✅ | ✅ | Envoi, approbation |
| Salons | ✅ | ✅ | Liste, messages, premium |
| Annonces | ✅ | ✅ | CRUD, filtres |
| Vidéos | ✅ | ✅ | Upload URL, liste |
| Certification | ✅ | ✅ | Demande, statut |
| Drawer navigation | ✅ | ✅ | Embyr braise theme |
| Bottom navigation | ✅ | ✅ | Mobile 5 items |
| PWA | ✅ | ✅ | Manifest + icônes |
| Mobile responsive | ✅ | ✅ | safe-area, 100dvh, 44px |

## APIs créées (ajouts du 14 Mai 2026)

- `GET/POST /api/albums` — lister/créer albums
- `GET/PATCH/DELETE /api/albums/[id]` — détail/modifier/supprimer
- `GET/POST /api/testimonials` — lister/envoyer témoignages
- `PATCH/DELETE /api/testimonials/[id]` — approuver/supprimer
- `GET /api/salons` — lister salons
- `GET /api/salons/[id]` — détail salon + messages
- `POST /api/salons/[id]/messages` — envoyer message salon
- `GET/POST /api/classifieds` — lister/créer annonces
- `DELETE /api/classifieds/[id]` — supprimer annonce
- `GET/POST /api/videos` — lister/créer vidéos
- `DELETE /api/videos/[id]` — supprimer vidéo
- `GET/POST /api/certification` — statut/demande certification
- `GET/POST /api/forum` — lister/créer discussions

## Modèles Prisma ajoutés

- Album, AlbumPhoto, AlbumAccessRequest
- Testimonial
- Salon, SalonMessage
- Classified
- Video
- CertificationRequest
