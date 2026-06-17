# EMBIR DEBUG PERFORMANCE STABILITY REPORT

Date: 2026-06-15
Domain: https://embir.xyz
VPS repo: `/root/embyr`

## 1. Verdict

Mission terminee: OUI.

The live site is now stable and usable on desktop/mobile. The confirmed overload sources were corrected, production was rebuilt with webpack, PM2 was restarted once after the final build, and live monitoring plus browser QA passed.

## 2. Symptomes observes

| Symptom | Status |
| --- | --- |
| Lenteur/surcharge percue | Confirmed as frontend risk on homepage/global effects |
| Old homepage wording | Confirmed live/source drift |
| 502 | Historical in Nginx logs, no fresh 502 after correction |
| Console errors | 0 in QA before and after |
| Network errors | RSC `net::ERR_ABORTED` prefetch noise before correction, 0 after |
| Mobile overflow | 0 before and after |
| Sitemap runtime risk | Not confirmed; sitemap live remains fast and cached |

## 3. Mesures avant correction

| URL | HTTP | TTFB | Total | Size | Console errors | Network errors | Verdict |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `/` | 200 | 29 ms | 31 ms | 137,458 B | 0 | 0 | Wrong H1, too heavy |
| `/auth/register` | 200 | 25 ms | 26 ms | 39,387 B | 0 | RSC aborts | Needs cleanup |
| `/sitemap.xml` | 200 | 14 ms | 15 ms | 400,332 B | n/a | n/a | OK |

Before correction, live homepage source served:

```text
Where every look ignites something real.
```

Required message was absent:

```text
The dating platform for everyone.
```

## 4. Verite infra

| Item | Value |
| --- | --- |
| PM2 app | `embyr-web` |
| cwd | `/root/embyr` |
| script | `/root/.nvm/versions/node/v20.20.2/bin/npm` |
| args | `run start -- -p 3100` |
| runtime | `next start -p 3100` |
| port | `3100` |
| Nginx | `embir.xyz` -> `http://localhost:3100` |
| status final | online |
| PM2 restarts final | `194` historical/controlled |
| unstable restarts final | `0` |
| Nginx config test | successful |

Final PM2/Nginx proof:

```text
status: online
exec cwd: /root/embyr
script args: run start -- -p 3100
unstable restarts: 0
nginx: configuration file /etc/nginx/nginx.conf test is successful
LISTEN *:3100 users:(("next-server", ...))
```

Historical PM2 errors found:

```text
Could not find a production build in the '.next' directory
.next/prerender-manifest.json ENOENT
Invariant: The client reference manifest for route "/[locale]/[slug]" does not exist
```

These were linked to the previous broken build window. Final logs after restart show Next ready on port 3100.

## 5. Causes identifiees

| Cause | Preuve | Impact | Correction |
| --- | --- | --- | --- |
| Homepage drifted to heavy animated Supernova page | Live H1 was `Where every look ignites...`; HTML 137 KB | Wrong product message and heavier render surface | Replaced with server-first platform homepage |
| Global desktop `MouseEnvironment` | Imported in root locale layout | Continuous animation/listener surface across app | Removed from layout |
| Link prefetch noise | Playwright saw aborted RSC requests | User-visible instability/noisy network | Disabled non-critical prefetch on nav/footer/SEO/register/blog/legacy city links |
| Register noindex | Monitor found noindex on register | Funnel/indexability gate failed | Changed auth layout robots to index/follow |
| Previous `.next` instability | PM2 logs and Nginx 502 history | Crash loop risk | Rebuilt with `next build --webpack`, restarted PM2 once |

## 6. Corrections appliquees

| File | Correction | Risk | Test |
| --- | --- | --- | --- |
| `src/app/[locale]/page.tsx` | Lightweight global homepage | Low | monitor/live/QA |
| `src/app/[locale]/layout.tsx` | Removed global mouse environment | Low | QA 22 pages |
| `src/components/layout/Navbar.tsx` | `prefetch={false}` for non-critical links | Low | QA network errors 0 |
| `src/components/layout/Footer.tsx` | `prefetch={false}` for footer links | Low | QA network errors 0 |
| `src/components/seo-pages.tsx` | `prefetch={false}` on SEO card links | Low | QA network errors 0 |
| `src/app/[locale]/auth/register/page.tsx` | Disabled secondary prefetch links | Low | register QA OK |
| `src/app/[locale]/blog/best-free-gay-dating-apps-2026/page.tsx` | Disabled article prefetch links | Low | article QA OK |
| `src/app/[locale]/auth/layout.tsx` | Register noindex removed | Medium | monitor noindex false |
| `src/app/[locale]/rencontre/**/page.tsx` | Disabled legacy city prefetch links | Low | city QA OK |
| `scripts/monitor-embir-live.mjs` | Added live monitor | Low | `MONITOR OK` |
| `scripts/qa-embir-performance.mjs` | Added Playwright QA | Low | 22/22 OK |
| `package.json` | Added `monitor:live`, `qa:performance` | Low | scripts executed |

## 7. Mesures apres correction

Final monitor after final build and PM2 restart:

| URL | HTTP | TTFB | Total | Size | Canonical | Noindex | Verdict |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| `/` | 200 | 38 ms | 41 ms | 52,843 B | yes | no | OK |
| `/auth/register` | 200 | 20 ms | 23 ms | 39,463 B | yes | no | OK |
| `/en/us/free-dating-app` | 200 | 24 ms | 27 ms | 47,312 B | yes | no | OK |
| `/en/uk/free-dating-app` | 200 | 16 ms | 18 ms | 47,324 B | yes | no | OK |
| `/fr/gratuit-au-lancement` | 200 | 15 ms | 18 ms | 47,421 B | yes | no | OK |
| `/robots.txt` | 200 | 2 ms | 3 ms | 63 B | n/a | n/a | OK |
| `/sitemap.xml` | 200 | 3 ms | 6 ms | 400,332 B | n/a | n/a | OK, 1596 URLs |

Final curl proof:

```text
HOME ttfb:0.029816 total:0.030331 size:52843
REGISTER ttfb:0.026970 total:0.028702 size:39463
SITEMAP ttfb:0.017561 total:0.018032 size:400332
```

## 8. Build / lint / audit

```text
npm run build
next build --webpack
Compiled successfully in 36.1s
Finished TypeScript in 18.4s
Generating static pages (1483/1483)
EXIT:0
```

Warning only:

```text
The "middleware" file convention is deprecated. Please use "proxy" instead.
```

```text
npm run lint
EXIT:0
```

Note: `npm run lint` currently delegates to `npm run lint:seo`, a targeted public/SEO lint.

```text
npm run seo:audit
totalUrls: 1596
franceUrls: 452
usaUrls: 185
ukUrls: 270
blogUrls: 184
guideUrls: 120
comparisonUrls: 50
hreflangLinks: 2676
SEO audit passed.
EXIT:0
```

```text
npm run test --if-present
EXIT:0
```

```text
npm run monitor:live
MONITOR OK
EXIT:0
```

## 9. QA navigateur

Tooling: Playwright/Chromium. The Browser plugin documentation was unavailable in this local session, so QA used standard Playwright directly.

Pages tested desktop 1440x1000 and mobile 390x844:

- `/`
- `/auth/register`
- `/en/us/free-dating-app`
- `/en/uk/free-dating-app`
- `/fr/gratuit-au-lancement`
- `/en/comparison/grindr-vs-embir`
- `/fr/rencontre/paris`
- `/en/us/dating/new-york`
- `/en/uk/london`
- `/en/guides/choose-a-dating-platform`
- `/en/blog/best-free-gay-dating-apps-2026`

Final result:

```text
22/22 OK
Console errors: 0
Network errors: 0
Mobile overflow: 0
```

Evidence files on VPS:

- `/tmp/embir_qa_performance_post_restart.txt`
- `/tmp/embir_qa_performance_results.json`
- `/tmp/embir_debug_home_desktop.png`
- `/tmp/embir_debug_home_mobile.png`
- `/tmp/embir_debug_register_mobile.png`

## 10. Monitoring

Created:

- `scripts/monitor-embir-live.mjs`
- `docs/EMBIR_STABILITY_RUNBOOK.md`

Command:

```bash
npm run monitor:live
```

Final result:

```text
MONITOR OK
EXIT:0
```

## 11. Obsidian

Read before modification:

- `00_START_HERE.md`
- `00_COMMAND_CENTER/Command Center.md`
- `00_COMMAND_CENTER/INDEX_GLOBAL.md`
- `00_COMMAND_CENTER/Obsidian — Regle permanente.md`
- `00_COMMAND_CENTER/Regles de travail.md`
- `30_EMBYR/Embyr — Master.md`
- `30_EMBYR/2026-06-15_Codex_War_Room_Verite_Live_Embir.md`
- `80_QA_BUGS/Bugs ouverts.md`
- `80_QA_BUGS/Bugs urgents.md`
- `90_INFRA_DEPLOIEMENT/VPS principal.md`
- `90_INFRA_DEPLOIEMENT/PM2.md`

Created:

- `30_EMBYR/2026-06-15_Embir_Debug_Performance_Stability.md`

Updated:

- `30_EMBYR/Embyr — Master.md`
- `80_QA_BUGS/Bugs ouverts.md`
- `80_QA_BUGS/Bugs urgents.md`

## 12. Risques restants

- Safari real-device QA remains pending.
- Next `middleware` to `proxy` migration remains pending.
- External uptime automation is not yet scheduled.
- GA4 remains outside this debug scope.
- Future load should be watched because sitemap/SEO architecture is large.
- PM2 restart count remains historically high, but unstable restarts are `0` after the final run.

## 13. Prochaines actions

Immediate:

- Add a cron or external uptime check for `npm run monitor:live`.
- Keep webpack build until Turbopack is requalified.
- Do real Safari/iPhone pass.

Within 24h:

- Migrate `middleware.ts` to `proxy.ts`.
- Add log-based alerting for 502/504 and PM2 restarts.
- Add a small retention log for monitor results.

Within 7 days:

- Add Lighthouse CI or a stable Playwright performance budget.
- Add synthetic register funnel checks.
- Watch sitemap URL count and GSC indexing after the mass SEO launch.

## 14. Raw Proof Commands

```bash
curl -I https://embir.xyz
curl -I https://embir.xyz/auth/register
curl -I https://embir.xyz/sitemap.xml
curl -sSL https://embir.xyz/sitemap.xml | grep -c "<loc>"
curl -o /dev/null -s -w "HOME ttfb:%{time_starttransfer} total:%{time_total} size:%{size_download}\n" https://embir.xyz
curl -o /dev/null -s -w "REGISTER ttfb:%{time_starttransfer} total:%{time_total} size:%{size_download}\n" https://embir.xyz/auth/register
curl -o /dev/null -s -w "SITEMAP ttfb:%{time_starttransfer} total:%{time_total} size:%{size_download}\n" https://embir.xyz/sitemap.xml
pm2 show embyr-web
nginx -t
npm run build
npm run lint
npm run seo:audit
npm run test --if-present
npm run monitor:live
npm run qa:performance
```

## 15. Final Gate

| Gate | Result |
| --- | --- |
| Live `/` HTTP 200 | OK |
| `/auth/register` HTTP 200 | OK |
| `/sitemap.xml` HTTP 200 | OK |
| Sitemap >= 1500 URLs | OK, 1596 |
| PM2 online | OK |
| Nginx OK | OK |
| No fresh 502 | OK |
| Build OK | OK |
| Monitor live OK | OK |
| QA desktop/mobile OK | OK |
| Critical console errors = 0 | OK |
| Report created | OK |
| Obsidian updated | OK |

