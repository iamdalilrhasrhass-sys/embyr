# EMBIR STABILITY RUNBOOK

Date: 2026-06-15
Service: `embyr-web`
Domain: https://embir.xyz

## Fast Health Check

Run on the VPS:

```bash
cd /root/embyr
npm run monitor:live
```

Expected:

```text
MONITOR OK
```

The monitor checks:

- homepage HTTP 200;
- `/auth/register` HTTP 200;
- `/sitemap.xml` HTTP 200;
- `/robots.txt` HTTP 200;
- sitemap has at least 1500 URLs;
- homepage contains `The dating platform for everyone.`;
- homepage does not contain old forbidden wording;
- canonical exists where required;
- accidental `noindex` is absent;
- TTFB and total curl time stay under reasonable thresholds.

## Browser QA

```bash
cd /root/embyr
npm run qa:performance
```

Expected:

- all tested pages `OK`;
- console errors = `0`;
- network errors = `0`;
- mobile overflow width stays equal to viewport width.

## Build Safely

```bash
cd /root/embyr
npm run build
```

This project currently uses:

```bash
next build --webpack
```

Keep webpack unless Turbopack is explicitly requalified. Previous instability was linked to a corrupted or missing `.next` production build.

After a successful build:

```bash
pm2 restart embyr-web
sleep 5
npm run monitor:live
npm run qa:performance
```

## Diagnose 502

```bash
pm2 list
pm2 show embyr-web
pm2 logs embyr-web --lines 120 --nostream
tail -n 200 /var/log/nginx/error.log
curl -I https://embir.xyz
ss -ltnp | grep -E "3100|80|443"
```

Likely causes:

- `next start` is not listening on `:3100`;
- `.next` is missing or corrupted;
- PM2 app crashed;
- Nginx proxy cannot connect to upstream;
- build was run but PM2 was not restarted cleanly.

## PM2 Truth

Expected process:

```text
name: embyr-web
cwd: /root/embyr
script: /root/.nvm/versions/node/v20.20.2/bin/npm
args: run start -- -p 3100
port: 3100
status: online
unstable restarts: 0
```

Useful commands:

```bash
pm2 list
pm2 show embyr-web
pm2 logs embyr-web --lines 120 --nostream
pm2 restart embyr-web
```

Do not restart repeatedly without reading logs first.

## Nginx Truth

Expected:

```text
server_name embir.xyz www.embir.xyz;
proxy_pass http://localhost:3100;
```

Check:

```bash
nginx -T 2>/dev/null | grep -A40 -B40 "embir.xyz"
nginx -T 2>/dev/null | grep -A20 -B20 "proxy_pass"
nginx -t
```

Reload only after `nginx -t` succeeds:

```bash
systemctl reload nginx
```

## Rollback `.next`

A backup was created before the debug rebuild:

```text
/root/embyr/.next.pre-debug-stability
```

Emergency rollback:

```bash
cd /root/embyr
mv .next ".next.failed.$(date +%Y%m%d%H%M%S)"
cp -a .next.pre-debug-stability .next
pm2 restart embyr-web
npm run monitor:live
```

Prefer rebuilding from source if possible:

```bash
cd /root/embyr
npm run build
pm2 restart embyr-web
npm run monitor:live
```

## Sitemap Drop

Check:

```bash
curl -sSL https://embir.xyz/sitemap.xml | grep -c "<loc>"
npm run seo:audit
```

Expected:

- public sitemap URLs: `1596`;
- minimum alert threshold: `1500`;
- France >= 80;
- USA >= 120;
- UK >= 90;
- blog >= 150;
- guides >= 120;
- comparisons >= 40.

If the count drops:

1. Check `src/app/sitemap.ts`.
2. Check `src/seo/sitemap-data.ts`.
3. Check whether `public/sitemap.xml` has been restored accidentally.
4. Run `npm run build`.
5. Run `npm run monitor:live`.

## Homepage Wording Regression

Check:

```bash
curl -sSL https://embir.xyz | grep -E "The dating platform for everyone|Gay Dating App|designed for Paris|Grindr vs Embir|real guys|Where glances ignite|Where every look ignites" || true
```

Expected:

- `The dating platform for everyone.` present;
- forbidden legacy wording absent.

Homepage file:

```text
/root/embyr/src/app/[locale]/page.tsx
```

## Alert Thresholds

| Signal | Warning | Critical |
| --- | ---: | ---: |
| Homepage TTFB | > 500 ms | > 1500 ms |
| Register TTFB | > 500 ms | > 1500 ms |
| Sitemap loc count | < 1590 | < 1500 |
| Console errors in QA | > 0 | > 0 on core pages |
| Network errors in QA | > 0 | > 0 on core pages |
| PM2 unstable restarts | > 0 | repeated growth |
| HTTP status | non-200 | 502/504 |

