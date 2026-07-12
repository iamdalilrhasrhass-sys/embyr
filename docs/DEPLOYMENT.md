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

```bash
cd /root/embyr
npm ci
npx prisma generate
npm run build
pm2 restart embyr-web --update-env
pm2 save
```

Vérifier ensuite le commit live, `pm2 status`, les logs, Nginx, HTTPS et les
parcours réels avant de considérer la bascule réussie.

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

1. arrêter `embyr-web` ;
2. restaurer le dump vérifié dans une base recréée avec le même propriétaire ;
3. remettre le worktree et le fichier d’environnement sauvegardés ;
4. redémarrer PM2 avec `--update-env` ;
5. vérifier le parcours public et authentifié.

Conserver les anciens fichiers de vérification en mode `0600` pendant toute la
fenêtre de rollback.
