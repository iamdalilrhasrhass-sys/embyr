# Embir — déploiement de production

## Préconditions

- dépôt live : `/root/embyr` ;
- processus PM2 : `embyr-web` ;
- port applicatif : `3100` ;
- fichier d’environnement : `/root/embyr/.env`, mode `0600` ;
- sauvegardes : `/root/embir-backups`, mode `0700`.

Ne jamais afficher ni copier un secret dans une commande, un log ou cette documentation.

## Sauvegarde avant migration

```bash
cd /root/embyr
npm run backup:production
```

Le script produit un dump PostgreSQL custom, vérifie son catalogue avec
`pg_restore --list` et publie `last-success.json` uniquement après succès.
Sauvegarder aussi le worktree, la configuration Nginx, la crontab et les
stockages privés avant toute bascule.

## Cas particulier : première adoption de Prisma Migrate sur la DB historique

La production historique possède déjà le schéma du baseline
`20260624000000_baseline`, mais pas nécessairement la table
`_prisma_migrations`. Après sauvegarde, comparaison exacte du schéma et
validation des préconditions, marquer uniquement ce baseline comme appliqué :

```bash
cd /root/embyr
npx prisma migrate resolve --applied 20260624000000_baseline
npx prisma migrate deploy
npx prisma migrate status
```

Ne jamais exécuter `migrate resolve` sur une base vierge ou dont le schéma ne
correspond pas au baseline. Une installation neuve utilise directement
`npx prisma migrate deploy`.

## Mise à jour applicative

La production utilise des releases immuables. Mettre `/root/embyr` à jour ne suffit pas : PM2 doit être basculé explicitement vers le nouveau `cwd`.

```bash
cd /root/embyr
git status --short
git fetch origin --prune
git checkout main
git pull --ff-only origin main
git rev-parse HEAD

# Dans une nouvelle release /root/embyr-releases/<sha7> :
npm ci
npx prisma generate
npm run build
```

Copier `.env` en mode `0600` sans jamais l’afficher et aligner uniquement sa clé `GIT_COMMIT` sur le SHA construit. Lancer ensuite un candidat PM2 portant un nom distinct sur le port 3201. Après QA locale en lecture seule :

1. sauvegarder la configuration Nginx active ;
2. relayer temporairement les deux upstreams 3100 vers 3201 ;
3. exécuter `nginx -t` puis recharger Nginx ;
4. supprimer l’ancien processus stable `embyr-web` ;
5. recréer exactement un `embyr-web` avec Node 22.22.2, le nouveau `cwd`, `GIT_COMMIT` et `start -- -p 3100` ;
6. vérifier le loopback 3100 ;
7. restaurer Nginx vers 3100, retester et recharger ;
8. vérifier HTTPS, supprimer le candidat et exécuter `pm2 save`.

Ne jamais utiliser un simple `pm2 restart` pour changer de release : PM2 conserverait l’ancien `cwd`. Le processus stable doit rester unique ; le candidat n’est qu’un relais temporaire.

## Variables opérationnelles

- `DATABASE_URL`, `JWT_SECRET`, `ADMIN_SECRET`, `GIT_COMMIT` ;
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` ;
- `ADMIN_REPORT_EMAIL` ;
- `EMAIL_PROVIDER=resend` avec `RESEND_API_KEY` et `RESEND_FROM`, ou les
  variables `SMTP_*` complètes ;
- `PRIVATE_UPLOAD_DIR=/var/lib/embir/private` ;
- `EMBIR_BACKUP_DIR` et `EMBIR_BACKUP_STATUS_FILE` ;
- `PAYMENTS_ENABLED=false` tant que la monétisation n’est pas activée
  explicitement.

## Planification Europe/Zurich

```cron
CRON_TZ=Europe/Zurich
7 * * * * cd /root/embyr && npm run job:hourly >> /var/log/embir-jobs.log 2>&1
40 6 * * * cd /root/embyr && npm run backup:production >> /var/log/embir-jobs.log 2>&1
0 7 * * * cd /root/embyr && npm run job:daily >> /var/log/embir-jobs.log 2>&1
0 8 * * 1 cd /root/embyr && npm run job:weekly >> /var/log/embir-jobs.log 2>&1
```

Chaque job applicatif possède un verrou advisory, une clé d’idempotence et un
historique `JobRun`. Déclencher un run contrôlé après installation et vérifier
la ligne DB ainsi que le log.

## Rollback

Pour une release sans migration de données :

1. conserver l’ancien `cwd` et son SHA avant la bascule ;
2. relayer Nginx vers le candidat sain si la bascule est en cours ;
3. supprimer le nouveau stable ;
4. recréer l’unique `embyr-web` depuis l’ancien `cwd`, avec son SHA et Node 22.22.2 ;
5. vérifier le port 3100 ;
6. restaurer la configuration Nginx sauvegardée, `nginx -t`, puis recharger ;
7. supprimer tout candidat, `pm2 save` et refaire les contrôles publics/logs.

Si le déploiement comprend une migration volontaire, suivre en plus la procédure de restauration du dump vérifié et documenter la compatibilité du rollback avant la bascule.

Conserver les anciens fichiers de vérification en mode `0600` pendant toute la
fenêtre de rollback.
