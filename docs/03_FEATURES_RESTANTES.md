# Embir — Fonctionnalités Restantes

## Bloqué par dépendance externe

| Fonctionnalité | Bloquant | Action |
|---------------|----------|--------|
| Upload photos | S3/R2/Cloudinary | Configurer bucket + credentials |
| SMS vérification | Twilio non installé | `npm i twilio` + config SID/Token |
| Stripe live test | Carte bancaire | Test en mode production |
| Realtime messages | WebSocket/Pusher | Installer serveur WS ou configurer Pusher |
| Test visuel mobile | Device physique | Safari iPhone requis |

## Améliorations futures (non bloquantes)

- Infinite scroll sur /profiles
- Polling messages → WebSocket
- Upload multiple photos albums
- Modération admin avancée
- Statistiques dashboard
- Emails transactionnels (SendGrid/Mailgun)
