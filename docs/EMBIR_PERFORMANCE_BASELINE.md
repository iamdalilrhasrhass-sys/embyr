# EMBIR PERFORMANCE BASELINE

Date: 2026-06-15
Target: https://embir.xyz
Scope: production stability, frontend performance, PM2/Nginx truth, live QA.

## Verdict

The live site was stable after correction. The main production risk was not raw server capacity. The confirmed problems were:

- homepage drifted back to a heavy animated version and old brand wording;
- global desktop mouse/parallax effects ran across the app;
- Next Link prefetch generated aborted RSC requests on several pages;
- `/auth/register` inherited a `noindex`;
- PM2 restart count was historically high because of a previous broken `.next`/Turbopack incident.

## Before Correction

| URL | HTTP | TTFB | Total | Size | Console errors | Network errors | Verdict |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `/` | 200 | 29 ms | 31 ms | 137,458 B | 0 | 0 | Too heavy and wrong H1 |
| `/auth/register` | 200 | 25 ms | 26 ms | 39,387 B | 0 | RSC aborts in browser QA | Needs prefetch cleanup |
| `/sitemap.xml` | 200 | 14 ms | 15 ms | 400,332 B | n/a | n/a | OK |

Initial live homepage wording observed:

- H1: `Where every look ignites something real.`
- CTA: `Join as a founder`
- Required H1 `The dating platform for everyone.` was absent.

Initial Playwright QA before correction:

- 22 desktop/mobile navigations tested.
- 0 console errors.
- Several `net::ERR_ABORTED` RSC prefetch requests observed on register/product/guide/article paths.
- No mobile overflow.

## Infra Baseline

| Item | Value |
| --- | --- |
| Server | `srv1609703` |
| PM2 app | `embyr-web` |
| PM2 cwd | `/root/embyr` |
| PM2 script | `/root/.nvm/versions/node/v20.20.2/bin/npm` |
| PM2 args | `run start -- -p 3100` |
| Runtime | Next.js production, `next start -p 3100` |
| Port | `3100` |
| Nginx | `embir.xyz` proxy to `http://localhost:3100` |
| Disk | `/` 387G, 159G used, 229G available |
| Memory | 31Gi total, 22Gi available during audit |

Historic PM2 issue found in logs:

- `Could not find a production build in the '.next' directory`
- `.next/prerender-manifest.json ENOENT`
- `Invariant: The client reference manifest for route "/[locale]/[slug]" does not exist`
- Nginx 502/connect refused around the previous broken build window.

These errors were historical. After the final restart, PM2 logs showed only:

```text
> embyr@0.1.0 start
> next start -p 3100
▲ Next.js 16.2.6
- Local:         http://localhost:3100
- Network:       http://72.62.187.63:3100
✓ Ready in 116ms
```

## Corrections Applied

| File | Correction | Impact |
| --- | --- | --- |
| `src/app/[locale]/page.tsx` | Replaced heavy animated homepage with server-first global platform homepage | HTML reduced to 52,843 B and required H1 restored |
| `src/app/[locale]/layout.tsx` | Removed global `MouseEnvironment` | Removed always-on desktop RAF/parallax surface |
| `src/components/layout/Navbar.tsx` | Disabled non-critical prefetch links | Removed aborted RSC prefetch noise |
| `src/components/layout/Footer.tsx` | Disabled non-critical prefetch links | Removed background route pressure |
| `src/components/seo-pages.tsx` | Disabled SEO card prefetch links | Kept SEO catalog server-side and lighter navigation |
| `src/app/[locale]/auth/register/page.tsx` | Disabled secondary legal/login/Paris prefetch links | Register page no longer emits aborted prefetches |
| `src/app/[locale]/blog/best-free-gay-dating-apps-2026/page.tsx` | Disabled article link prefetches | Article QA became clean |
| `src/app/[locale]/auth/layout.tsx` | Changed auth robots from noindex/nofollow to index/follow | Register monitor now passes noindex gate |
| `src/app/[locale]/rencontre/**/page.tsx` | Disabled Link prefetch mechanically | Removed legacy city RSC aborts |
| `scripts/monitor-embir-live.mjs` | Added live stability monitor | Repeatable production gate |
| `scripts/qa-embir-performance.mjs` | Added Playwright desktop/mobile QA | Repeatable browser gate |
| `package.json` | Added `monitor:live` and `qa:performance` scripts | Operational checks are now first-class |

## After Correction

Final monitor after production build and PM2 restart:

```text
home | 200 | 38 ms | 41 ms | 52843 | canonical true | noindex false
register | 200 | 20 ms | 23 ms | 39463 | canonical true | noindex false
us | 200 | 24 ms | 27 ms | 47312 | canonical true | noindex false
uk | 200 | 16 ms | 18 ms | 47324 | canonical true | noindex false
fr | 200 | 15 ms | 18 ms | 47421 | canonical true | noindex false
robots | 200 | 2 ms | 3 ms | 63
sitemap | 200 | 3 ms | 6 ms | 400332 | loc:1596
MONITOR OK
```

Final curl timings:

```text
HOME ttfb:0.029816 total:0.030331 size:52843
REGISTER ttfb:0.026970 total:0.028702 size:39463
SITEMAP ttfb:0.017561 total:0.018032 size:400332
```

Final Playwright QA after PM2 restart:

- 22/22 pages OK.
- 0 console errors.
- 0 network errors.
- 0 mobile overflow.
- Homepage mobile viewport: `390/390`.
- Register mobile viewport: `390/390`.

## Build And Audit

```text
npm run build
next build --webpack
Compiled successfully.
TypeScript passed.
Generated static pages: 1483/1483.
EXIT:0
```

Only warning:

```text
The "middleware" file convention is deprecated. Please use "proxy" instead.
```

```text
npm run lint
EXIT:0
```

Note: repository `lint` currently delegates to the targeted SEO/public lint script.

```text
npm run seo:audit
sitemap.totalUrls: 1596
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

## Remaining Risks

- Safari real-device QA still needs a human/device pass.
- The Next `middleware` to `proxy` migration remains open.
- PM2 restart count is historically high (`194`) because of previous incidents and controlled restarts; current `unstable restarts` is `0`.
- Lighthouse was not used because the no-install check was unavailable/canceled; Playwright timings were used instead.
- No automated external uptime scheduler is wired yet; `npm run monitor:live` is ready for cron or external monitoring.

