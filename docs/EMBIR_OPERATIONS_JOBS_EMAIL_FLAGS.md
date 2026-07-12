# Embir — Jobs, emails et feature flags

## Configuration requise

Les valeurs ne doivent jamais être commitées. Les variables attendues sont :

- `DATABASE_URL`
- `APP_ENV` : `development`, `test`, `staging` ou `production`
- `EMAIL_PROVIDER` : `smtp` (défaut) ou `resend`
- pour SMTP : `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- pour Resend : `RESEND_API_KEY`, `RESEND_FROM`
- `ADMIN_REPORT_EMAIL` : obligatoire pour les jobs daily et weekly
- `EMBIR_BACKUP_DIR` et `EMBIR_BACKUP_STATUS_FILE` : stockage protégé et preuve de la dernière sauvegarde

Il n’existe aucun destinataire administrateur, hôte SMTP ou expéditeur de secours dans le code.

## Commandes

```bash
npm run job:hourly
npm run job:daily
npm run job:weekly
npm run backup:production
npm run feature-flag:evaluate -- connection.reveal --user-id USER_ID --city Zurich --cohorts pilot
npm run test:operations
```

Le paramètre optionnel `--at <ISO_DATE>` des jobs sert aux reprises contrôlées. La clé d’idempotence est calculée en UTC.

## Planification VPS recommandée

Depuis `/root/embyr`, avec l’environnement du processus chargé sans l’écrire dans la crontab :

```cron
CRON_TZ=Europe/Zurich
7 * * * * npm run job:hourly
40 6 * * * npm run backup:production
0 7 * * * npm run job:daily
0 8 * * 1 npm run job:weekly
```

Chaque cadence possède :

- un verrou advisory PostgreSQL dédié ;
- une ligne `JobRun` avec clé d’idempotence unique ;
- trois tentatives maximum pour une fenêtre échouée ;
- un résultat et des métadonnées agrégées sans PII.

Le job horaire désactive les signaux arrivés à échéance et crée un événement
`signal_expired` idempotent. Il fait aussi passer une connexion
`PLAN_CONFIRMED` à `MET` lorsque l’heure de son plan confirmé est passée : la
transition est historisée dans `ConnectionEvent`, sans notification et sans
copier le lieu ou l’horaire dans les métadonnées.

Le job quotidien écrit d’abord le `DailyAggregate`, puis seulement après :

- agrège au maximum 31 journées historiques manquantes ;
- supprime par lots de 50 000 les événements analytics bruts de plus de 90
  jours dont la journée possède déjà un agrégat durable ;
- supprime par lots bornés les notifications lues de plus de 180 jours et les
  notifications volontairement ignorées de plus de 30 jours ;
- expurge les hashes, payloads et identifiants fournisseur des logs email
  terminés, puis supprime les succès anciens de 180 jours et les échecs anciens
  de 365 jours.

La sauvegarde utilise `pg_dump` en format custom, vérifie le fichier avec
`pg_restore --list`, applique des droits `0600` et publie atomiquement un
manifeste `last-success.json`. Ni l’URL de base ni son mot de passe ne sont
placés dans les arguments du processus enfant.

Une journée non agrégée n’est jamais purgée. Tout retard, job bloqué, échec
email, erreur API ou rupture de tracking est consigné dans les métadonnées
`JobRun` et dans les alertes du rapport agrégé.

## Outbox email

Une route ou un job ajoute une ligne `EmailLog`; seul le worker traite les lignes dues. Le payload ne contient pas l’adresse destinataire :

- pour un utilisateur, l’adresse courante est résolue par `userId` au moment de l’envoi ;
- pour un rapport, elle vient exclusivement de `ADMIN_REPORT_EMAIL` ;
- `recipientHash` empêche un envoi si l’adresse a changé depuis la mise en file ;
- `dedupeKey` et un `Message-ID` SMTP déterministe, ou l’en-tête
  `Idempotency-Key` Resend, limitent les doublons ;
- les reprises utilisent un backoff exponentiel plafonné à 24 heures.
- `emailEnabled=false` termine l’élément en `skipped` sans appeler SMTP ;
- les heures calmes repoussent l’envoi sans consommer de tentative ;
- une adresse supprimée ou modifiée termine l’élément en échec explicite.

## Feature flags

L’évaluation se fait uniquement côté serveur dans cet ordre :

1. interrupteur global ;
2. environnement ;
3. utilisateur de test ;
4. ville et cohorte ;
5. rollout déterministe sur `userId` ou `anonymousId` stable.

Une erreur DB, un flag absent ou un sujet instable avec rollout partiel désactive le flag.
