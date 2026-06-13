# Embir Deployment Guide

## Initial Setup
```bash
git clone https://github.com/iamdalilrhasrhass-sys/embyr.git
cd embyr
npm install
cp .env.example .env.local   # Configure environment variables
npx prisma migrate deploy
npx prisma generate
npm run build
pm2 start npm --name embir-web -- start
pm2 save
```

## Environment Variables (.env.local)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/embyr
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...    # Optional: Google Analytics 4
```

## Update Workflow
```bash
git pull
npm install                        # Only if package.json changed
npx prisma migrate deploy          # Only if schema changed
npx prisma generate                # Regenerate client
npm run build
pm2 restart embir-web
```

## PM2 Commands
```bash
pm2 status              # List all processes
pm2 logs embir-web      # View logs
pm2 restart embir-web   # Restart app
pm2 stop embir-web      # Stop app
pm2 monit               # Real-time dashboard
```

## Backup
```bash
# Daily backup (add to crontab: 0 2 * * *)
pg_dump -U postgres embyr > /root/backups/embir-$(date +%Y%m%d).sql

# Restore
psql -U postgres embyr < backup-20260614.sql
```

## Cron Jobs
```
# SEO Monitor — daily at 6 AM
0 6 * * * cd /root/embir && npx tsx scripts/seo-monitor.ts >> /root/embir/data/seo-reports/cron.log 2>&1

# Performance Check — every 4 hours
0 */4 * * * cd /root/embir && npx tsx scripts/performance-check.ts >> /root/embir/data/performance/cron.log 2>&1

# Sitemap refresh — daily at 3 AM
0 3 * * * curl -s https://embir.xyz/sitemap.xml > /dev/null
```

## SSL (Let's Encrypt)
```bash
certbot --nginx -d embir.xyz -d www.embir.xyz
# Auto-renewal: certbot renew --dry-run
```
