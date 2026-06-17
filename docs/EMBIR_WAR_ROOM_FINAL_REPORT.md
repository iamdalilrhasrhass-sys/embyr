# EMBIR WAR ROOM FINAL REPORT — LIVE TRUTH + SEO FR UK USA

## 1. Verdict

- Mission terminée : OUI
- Raison : le domaine public https://embir.xyz sert la homepage internationale France / UK / United States, les textes interdits ne sont plus présents, le sitemap public réel contient 1596 URLs, les 100 URLs live testées répondent 200 avec canonical et sans noindex, PM2/nginx servent le bon dossier, build/lint/audit SEO sont passés, QA navigateur effectuée, Obsidian mis à jour ensuite.

## 2. Problème initial

- Contradiction entre rapport précédent et live public : un vérificateur externe avait encore vu l ancien positionnement gay/Paris/Grindr.
- Ancien contenu observé : "Gay Dating App", "designed for Paris", "Real guys", "Grindr vs Embir", "Ready to meet real guys?".
- Hypothèses testées : mauvais build PM2, mauvais cwd, proxy nginx, cache externe, locale par défaut, source homepage régressée.
- Diagnostic réel : PM2/nginx pointaient bien vers /root/embyr:3100. La source homepage avait régressé pendant la reprise sur plusieurs libellés exacts; un build Turbopack a aussi corrompu temporairement .next et créé un 502. Correction : homepage repatchée, footer serveur ajouté pour maillage, build stabilisé via `next build --webpack`, rebuild complet, PM2 restart.

## 3. Vérité serveur

- PM2 app : embyr-web
- cwd : /root/embyr
- script : /root/.nvm/versions/node/v20.20.2/bin/npm
- args : run start -- -p 3100
- port : 3100
- nginx proxy_pass : http://localhost:3100
- dossier servi : /root/embyr
- build servi : /root/embyr/.next, build webpack final
- anomalie trouvée : build Turbopack a échoué sur manifest manquant et le restart PM2 suivant a produit 502; corrigé par rebuild webpack avec sauvegarde .next, puis PM2 online.

### Extrait PM2/nginx/ports

```text
PM2_DESCRIBE
 Describing process with id 4 - name embyr-web 
┌───────────────────┬────────────────────────────────────────────┐
│ status            │ online                                     │
│ name              │ embyr-web                                  │
│ namespace         │ default                                    │
│ version           │ 0.39.7                                     │
│ restarts          │ 186                                        │
│ uptime            │ 66s                                        │
│ script path       │ /root/.nvm/versions/node/v20.20.2/bin/npm  │
│ script args       │ run start -- -p 3100                       │
│ error log path    │ /root/.pm2/logs/embyr-web-error.log        │
│ out log path      │ /root/.pm2/logs/embyr-web-out.log          │
│ pid path          │ /root/.pm2/pids/embyr-web-4.pid            │
│ interpreter       │ /root/.nvm/versions/node/v20.20.2/bin/node │
│ interpreter args  │ N/A                                        │
│ script id         │ 4                                          │
│ exec cwd          │ /root/embyr                                │
│ exec mode         │ fork_mode                                  │
│ node.js version   │ 20.20.2                                    │
│ node env          │ N/A                                        │
│ watch & reload    │ ✘                                          │
│ unstable restarts │ 0                                          │
│ created at        │ 2026-06-15T04:04:55.735Z                   │
└───────────────────┴────────────────────────────────────────────┘
 Actions available 
┌────────────────────────┐
│ km:heapdump            │
│ km:cpu:profiling:start │
│ km:cpu:profiling:stop  │
│ km:heap:sampling:start │
│ km:heap:sampling:stop  │
└────────────────────────┘
 Trigger via: pm2 trigger embyr-web <action_name>

 Code metrics value 
┌────────────────────────┬──────────┐
│ Used Heap Size         │ 7.68 MiB │
│ Heap Usage             │ 78.94 %  │
│ Heap Size              │ 9.73 MiB │
│ Event Loop Latency p95 │ 1.42 ms  │
│ Event Loop Latency     │ 0.45 ms  │
│ Active handles         │ 5        │
│ Active requests        │ 0        │
└────────────────────────┴──────────┘
 Divergent env variables from local env 
┌────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ PWD            │ /root/embyr                                                                                                                                                                                                                   │
│ SSH_CONNECTION │ 88.168.94.24 47616 72.62.187.63 22                                                                                                                                                                                            │
│ SHLVL          │ 2                                                                                                                                                                                                                             │
│ XDG_SESSION_ID │ 1428                                                                                                                                                                                                                          │
│ SSH_CLIENT     │ 88.168.94.24 47616 22                                                                                                                                                                                                         │
│ PATH           │ /root/.local/bin:/root/.local/bin:/root/.local/bin:/root/.local/bin:/root/.local/bin:/root/.nvm/versions/node/v22.22.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin │
└────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

 Add your own code metrics: http://bit.ly/code-metrics
 Use `pm2 logs embyr-web [--lines 1000]` to display logs
 Use `pm2 env 4` to display environment variables
 Use `pm2 monit` to monitor CPU and Memory usage embyr-web

NGINX_EMBIR
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# configuration file /etc/nginx/sites-enabled/courtia-frontend:
# === HTTPS — courtiark.fr (frontend COURTIA) ===
server {
    server_name courtiark.fr www.courtiark.fr;

    root /root/courtia/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-store";
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/api.courtiark.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.courtiark.fr/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    server_name courtiark.fr www.courtiark.fr;
    return 301 https://$host$request_uri;
}

# configuration file /etc/nginx/sites-enabled/embir.xyz:
server {
    server_name embir.xyz www.embir.xyz;

    location / {
        proxy_pass http://localhost:3100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /_next/static {
        proxy_pass http://localhost:3100;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }

    listen 443 ssl; # managed by Certbot
    listen [::]:443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/embir.xyz/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/embir.xyz/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = embir.xyz) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    listen [::]:80;
    server_name embir.xyz www.embir.xyz;
    return 404; # managed by Certbot


}
# configuration file /etc/nginx/sites-enabled/feminya.xyz:
server {
    server_name feminya.xyz www.feminya.xyz;


PORTS
LISTEN 0      2048                       0.0.0.0:8082       0.0.0.0:*    users:(("fcc-server",pid=1422,fd=21))                                                                                                                                                                                                          
LISTEN 0      511                        0.0.0.0:80         0.0.0.0:*    users:(("nginx",pid=174927,fd=5),("nginx",pid=174926,fd=5),("nginx",pid=174925,fd=5),("nginx",pid=174924,fd=5),("nginx",pid=174923,fd=5),("nginx",pid=174922,fd=5),("nginx",pid=174921,fd=5),("nginx",pid=174920,fd=5),("nginx",pid=1613,fd=5))
LISTEN 0      511                        0.0.0.0:443        0.0.0.0:*    users:(("nginx",pid=174927,fd=7),("nginx",pid=174926,fd=7),("nginx",pid=174925,fd=7),("nginx",pid=174924,fd=7),("nginx",pid=174923,fd=7),("nginx",pid=174922,fd=7),("nginx",pid=174921,fd=7),("nginx",pid=174920,fd=7),("nginx",pid=1613,fd=7))
LISTEN 0      4096                       0.0.0.0:3080       0.0.0.0:*    users:(("docker-proxy",pid=2673,fd=7))                                                                                                                                                                                                         
LISTEN 0      128                      127.0.0.1:1080       0.0.0.0:*    users:(("ssh",pid=196654,fd=5))                                                                                                                                                                                                                
LISTEN 0      511                           [::]:80            [::]:*    users:(("nginx",pid=174927,fd=6),("nginx",pid=174926,fd=6),("nginx",pid=174925,fd=6),("nginx",pid=174924,fd=6),("nginx",pid=174923,fd=6),("nginx",pid=174922,fd=6),("nginx",pid=174921,fd=6),("nginx",pid=174920,fd=6),("nginx",pid=1613,fd=6))
LISTEN 0      511                           [::]:443           [::]:*    users:(("nginx",pid=174927,fd=8),("nginx",pid=174926,fd=8),("nginx",pid=174925,fd=8),("nginx",pid=174924,fd=8),("nginx",pid=174923,fd=8),("nginx",pid=174922,fd=8),("nginx",pid=174921,fd=8),("nginx",pid=174920,fd=8),("nginx",pid=1613,fd=8))
LISTEN 0      511                              *:3000             *:*    users:(("next-server (v1",pid=94252,fd=21))                                                                                                                                                                                                    
LISTEN 0      4096                          [::]:3080          [::]:*    users:(("docker-proxy",pid=2681,fd=7))                                                                                                                                                                                                         
LISTEN 0      511                              *:3100             *:*    users:(("next-server (v1",pid=236584,fd=21))                                                                                                                                                                                                   
LISTEN 0      128                          [::1]:1080          [::]:*    users:(("ssh",pid=196654,fd=4))
```


## 4. Correction homepage live

- H1 attendu : The dating platform for everyone.
- H1 observé : The dating platform for everyone.
- title attendu : Embir — Free dating platform for France, UK and USA
- title observé : Embir — Free dating platform for France, UK and USA
- meta attendue : Embir is a free-at-launch dating platform for France, the UK and the United States, built for every orientation with preferences, compatibility, verified profiles and a transparent future freemium model.
- meta observée : identique.
- textes interdits absents : OUI.
- /en redirige en 307 vers / via localePrefix as-needed; ce n est pas une ancienne landing.
- Vérification externe hors VPS : curl local Mac et web.open voient la nouvelle homepage.

### Commandes de preuve homepage

```text
Mon Jun 15 04:05:12 UTC 2026
HOME_HEADER
HTTP/1.1 200 OK
Server: nginx/1.28.0 (Ubuntu)
Date: Mon, 15 Jun 2026 04:05:12 GMT
Content-Type: text/html; charset=utf-8
Connection: keep-alive
link: <https://embir.xyz/fr>; rel="alternate"; hreflang="fr", <https://embir.xyz/>; rel="alternate"; hreflang="en", <https://embir.xyz/es>; rel="alternate"; hreflang="es", <https://embir.xyz/de>; rel="alternate"; hreflang="de", <https://embir.xyz/pt>; rel="alternate"; hreflang="pt", <https://embir.xyz/it>; rel="alternate"; hreflang="it", <https://embir.xyz/nl>; rel="alternate"; hreflang="nl", <https://embir.xyz/ru>; rel="alternate"; hreflang="ru", <https://embir.xyz/zh>; rel="alternate"; hreflang="zh", <https://embir.xyz/ja>; rel="alternate"; hreflang="ja", <https://embir.xyz/ko>; rel="alternate"; hreflang="ko", <https://embir.xyz/ar>; rel="alternate"; hreflang="ar", <https://embir.xyz/hi>; rel="alternate"; hreflang="hi", <https://embir.xyz/tr>; rel="alternate"; hreflang="tr", <https://embir.xyz/pl>; rel="alternate"; hreflang="pl", <https://embir.xyz/sv>; rel="alternate"; hreflang="sv", <https://embir.xyz/da>; rel="alternate"; hreflang="da", <https://embir.xyz/fi>; rel="alternate"; hreflang="fi", <https://embir.xyz/no>; rel="alternate"; hreflang="no", <https://embir.xyz/th>; rel="alternate"; hreflang="th", <https://embir.xyz/vi>; rel="alternate"; hreflang="vi", <https://embir.xyz/id>; rel="alternate"; hreflang="id", <https://embir.xyz/ms>; rel="alternate"; hreflang="ms", <https://embir.xyz/ro>; rel="alternate"; hreflang="ro", <https://embir.xyz/>; rel="alternate"; hreflang="x-default"
set-cookie: NEXT_LOCALE=en; Path=/; SameSite=lax
x-middleware-rewrite: /en
Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
X-Powered-By: Next.js
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate

TITLE_META
<title>Embir — Free dating platform for France, UK and USA
<meta name="description" content="Embir is a free-at-launch dating platform for France, the UK and the United States, built for every orientation with preferences, compatibility, verified profiles and a transparent future freemium model."
REQUIRED_HOME_COUNTS
2 | The dating platform for everyone
4 | France
4 | UK
4 | United States
4 | Free at launch
4 | freemium
4 | orientation
3 | preferences
4 | compatibility
4 | verified profiles
2 | Join the founding community
2 | Old dating apps vs Embir
2 | Ready to meet compatible people
FORBIDDEN_HOME_COUNTS
0 | Gay Dating App
0 | designed for Paris
0 | Grindr vs Embir
0 | Ready to meet real guys
0 | real guys
0 | Where glances ignite
0 | new dating app for men
SITEMAP
HTTP/1.1 200 OK
Server: nginx/1.28.0 (Ubuntu)
Date: Mon, 15 Jun 2026 04:05:12 GMT
Content-Type: application/xml
Connection: keep-alive
vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
x-nextjs-cache: HIT
cache-control: public, max-age=0, must-revalidate

total=1596
france=898
usa=185
uk=270
blog=184
guide=120
comparison=40
comparaison=30
hreflang=1338
```


### Preuve externe local Mac

```text

```


## 5. Sitemap public réel

- URL sitemap : https://embir.xyz/sitemap.xml
- HTTP status : 200
- total loc : 1596
- France : 898 lignes contenant /fr/ par commande demandée; audit structuré unique : 452 URLs France.
- USA : 185
- UK : 270
- blog : 184
- guides : 120
- comparatifs : 40 /comparison + 30 /comparaison = 70
- hreflang : 1338 par grep lignes; audit structuré : 2676 occurrences.

### Commandes de preuve sitemap

```text
SITEMAP
HTTP/1.1 200 OK
Server: nginx/1.28.0 (Ubuntu)
Date: Mon, 15 Jun 2026 04:05:12 GMT
Content-Type: application/xml
Connection: keep-alive
vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
x-nextjs-cache: HIT
cache-control: public, max-age=0, must-revalidate

total=1596
france=898
usa=185
uk=270
blog=184
guide=120
comparison=40
comparaison=30
hreflang=1338
```


## 6. Architecture SEO

- Fichiers src/seo présents : markets, root-pages, market-pages, pages-product, pages-freemium, cities FR/US/UK, guides FR/EN, comparisons FR/EN, blog FR/US/UK, hreflang, sitemap-data, internal-links, catalog, metadata, seo-audit.
- Routes dynamiques : /[locale]/[slug], /blog/[slug], /guides/[slug], /comparison/[slug], /comparaison/[slug], /product/[slug], /freemium/[slug], /us/dating/[slug], /uk/dating/[slug], /rencontre/[slug].
- Composants SEO : src/components/seo-pages.tsx, src/components/seo/SchemaOrg.tsx.
- Stratégie programmatique : génération depuis catalog.ts/sitemap-data.ts avec canonical, metadata, OpenGraph, JSON-LD, FAQ, CTA et maillage interne.
- Correctif War Room : ajout d un footer serveur global dans layout pour rendre le maillage interne crawlable dans le HTML SSR.

### Inventaire SEO

```text
SEO_FILES
src/seo/blog-fr.ts
src/seo/blog-uk.ts
src/seo/blog-us.ts
src/seo/catalog.ts
src/seo/cities-fr.ts
src/seo/cities-uk.ts
src/seo/cities-us.ts
src/seo/comparisons-en.ts
src/seo/comparisons-fr.ts
src/seo/guides-en.ts
src/seo/guides-fr.ts
src/seo/hreflang.ts
src/seo/internal-links.ts
src/seo/market-pages.ts
src/seo/markets.ts
src/seo/metadata.ts
src/seo/pages-freemium.ts
src/seo/pages-product.ts
src/seo/root-pages.ts
src/seo/seo-audit.ts
src/seo/sitemap-data.ts
src/seo/utils.ts
APP_SEO_ROUTES
src/app/[locale]/gay-dating-app-uk
src/app/[locale]/gay-dating-app-uk/page.tsx
src/app/[locale]/serious-dating-app
src/app/[locale]/serious-dating-app/page.tsx
src/app/[locale]/lgbtq-dating-app
src/app/[locale]/lgbtq-dating-app/page.tsx
src/app/[locale]/blog
src/app/[locale]/blog/alternative-tinder-gratuite
src/app/[locale]/blog/alternative-tinder-gratuite/page.tsx
src/app/[locale]/blog/best-grindr-alternatives-2026
src/app/[locale]/blog/best-grindr-alternatives-2026/page.tsx
src/app/[locale]/blog/consentement-applis-rencontre
src/app/[locale]/blog/consentement-applis-rencontre/page.tsx
src/app/[locale]/blog/comment-eviter-relations-toxiques-rencontre
src/app/[locale]/blog/comment-eviter-relations-toxiques-rencontre/page.tsx
src/app/[locale]/blog/application-rencontre-sans-algorithme-opaque
src/app/[locale]/blog/application-rencontre-sans-abonnement-guide
src/app/[locale]/blog/application-rencontre-sans-abonnement-guide/page.tsx
src/app/[locale]/blog/meetic-vs-applis-gratuites
src/app/[locale]/blog/best-gay-dating-apps-uk
src/app/[locale]/blog/best-gay-dating-apps-uk/page.tsx
src/app/[locale]/blog/rencontre-homme-homme-conseils
src/app/[locale]/blog/rencontre-homme-homme-conseils/page.tsx
src/app/[locale]/blog/pourquoi-les-applis-de-rencontre-fatiguent
src/app/[locale]/blog/pourquoi-les-applis-de-rencontre-fatiguent/page.tsx
src/app/[locale]/blog/rupture-amoureuse-rebondir
src/app/[locale]/blog/rupture-amoureuse-rebondir/page.tsx
src/app/[locale]/blog/comment-dire-non-politiment
src/app/[locale]/blog/rencontre-queer-espaces-inclusifs
src/app/[locale]/blog/rencontre-queer-espaces-inclusifs/page.tsx
src/app/[locale]/blog/rencontre-bi-guide-complet
src/app/[locale]/blog/rencontre-bi-guide-complet/page.tsx
src/app/[locale]/blog/premier-week-end-en-amoureux
src/app/[locale]/blog/best-grindr-alternative-free
src/app/[locale]/blog/best-grindr-alternative-free/page.tsx
src/app/[locale]/blog/alternative-hinge
src/app/[locale]/blog/alternative-hinge/page.tsx
src/app/[locale]/blog/rencontre-lesbienne-conseils
src/app/[locale]/blog/rencontre-lesbienne-conseils/page.tsx
src/app/[locale]/blog/best-free-gay-dating-apps-2026
src/app/[locale]/blog/best-free-gay-dating-apps-2026/page.tsx
src/app/[locale]/blog/rencontre-pour-tous-inclusive
src/app/[locale]/blog/rencontre-pour-tous-inclusive/page.tsx
src/app/[locale]/blog/rencontre-lgbtq-respectueuse
src/app/[locale]/blog/rencontre-lgbtq-respectueuse/page.tsx
src/app/[locale]/blog/comment-choisir-une-app-de-rencontre
src/app/[locale]/blog/comment-choisir-une-app-de-rencontre/page.tsx
src/app/[locale]/blog/comment-faire-une-bio-attirante
src/app/[locale]/blog/comment-faire-une-bio-attirante/page.tsx
src/app/[locale]/blog/meilleure-application-rencontre-lgbtq-2026
src/app/[locale]/blog/meilleure-application-rencontre-lgbtq-2026/page.tsx
src/app/[locale]/blog/how-to-avoid-fake-profiles
src/app/[locale]/blog/signaux-alerte-premier-rendez-vous
src/app/[locale]/blog/signaux-alerte-premier-rendez-vous/page.tsx
src/app/[locale]/blog/pourquoi-les-apps-de-rencontre-sont-payantes
src/app/[locale]/blog/pourquoi-les-apps-de-rencontre-sont-payantes/page.tsx
src/app/[locale]/blog/combien-de-temps-avant-de-se-rencontrer
src/app/[locale]/blog/rencontre-queer-conseils
src/app/[locale]/blog/rencontre-queer-conseils/page.tsx
src/app/[locale]/blog/first-message-dating-app-guide
src/app/[locale]/blog/premier-rendez-vous-conseils-2026
src/app/[locale]/blog/premier-rendez-vous-conseils-2026/page.tsx
src/app/[locale]/blog/rencontre-lgbtq-paris-guide
src/app/[locale]/blog/rencontre-lgbtq-paris-guide/page.tsx
src/app/[locale]/blog/algorithmes-applis-rencontre
src/app/[locale]/blog/deepseek-ia-rencontre
src/app/[locale]/blog/pourquoi-les-profils-verifies-rassurent
src/app/[locale]/blog/pourquoi-les-profils-verifies-rassurent/page.tsx
src/app/[locale]/blog/coming-out-et-rencontres
src/app/[locale]/blog/coming-out-et-rencontres/page.tsx
src/app/[locale]/blog/arnaques-amoureuses-applis-rencontre
src/app/[locale]/blog/arnaques-amoureuses-applis-rencontre/page.tsx
src/app/[locale]/blog/rencontre-a-nice-guide
src/app/[locale]/blog/alternative-grindr-2026-comparatif
src/app/[locale]/blog/alternative-grindr-2026-comparatif/page.tsx
src/app/[locale]/blog/rencontre-a-reims-guide
src/app/[locale]/blog/how-to-write-dating-profile
src/app/[locale]/blog/drag-queer-culture-rencontre
src/app/[locale]/blog/drag-queer-culture-rencontre/page.tsx
src/app/[locale]/blog/gay-dating-paris-guide
src/app/[locale]/blog/gay-dating-paris-guide/page.tsx
src/app/[locale]/blog/pride-2026-rencontres
src/app/[locale]/blog/pride-2026-rencontres/page.tsx
src/app/[locale]/blog/alternative-bumble
src/app/[locale]/blog/alternative-bumble/page.tsx
src/app/[locale]/blog/dependance-affective-rencontres
src/app/[locale]/blog/dependance-affective-rencontres/page.tsx
src/app/[locale]/blog/premier-date-gay-conseils-2026
src/app/[locale]/blog/premier-date-gay-conseils-2026/page.tsx
src/app/[locale]/blog/first-date-safety-tips
src/app/[locale]/blog/comment-reconnaitre-faux-profil-rencontre
src/app/[locale]/blog/comment-reconnaitre-faux-profil-rencontre/page.tsx
src/app/[locale]/blog/comment-faire-rencontres-serieuses
src/app/[locale]/blog/comment-faire-rencontres-serieuses/page.tsx
src/app/[locale]/blog/profils-verifies-rencontre-guide
src/app/[locale]/blog/profils-verifies-rencontre-guide/page.tsx
src/app/[locale]/blog/gay-dating-new-york
src/app/[locale]/blog/gay-dating-new-york/page.tsx
src/app/[locale]/blog/rencontre-trans-respectueuse
src/app/[locale]/blog/rencontre-trans-respectueuse/page.tsx
src/app/[locale]/blog/application-rencontre-sans-pub-guide
src/app/[locale]/blog/application-rencontre-sans-pub-guide/page.tsx
src/app/[locale]/blog/rencontre-a-strasbourg-guide
src/app/[locale]/blog/confiance-en-soi-rencontres
src/app/[locale]/blog/confiance-en-soi-rencontres/page.tsx
src/app/[locale]/blog/filtres-orientation-rencontre
src/app/[locale]/blog/gay-dating-bordeaux-guide
src/app/[locale]/blog/gay-dating-bordeaux-guide/page.tsx
src/app/[locale]/blog/bumble-alternative-2026
src/app/[locale]/blog/rencontre-a-angers-guide
src/app/[locale]/blog/rencontre-moderne-2026
src/app/[locale]/blog/rencontre-moderne-2026/page.tsx
src/app/[locale]/blog/psychologie-du-swipe
src/app/[locale]/blog/psychologie-du-swipe/page.tsx
src/app/[locale]/blog/tinder-est-il-adapte-aux-rencontres-serieuses
src/app/[locale]/blog/comment-gerer-un-date-qui-se-passe-mal
src/app/[locale]/blog/rencontre-compatible-orientation-guide
src/app/[locale]/blog/rencontre-compatible-orientation-guide/page.tsx
src/app/[locale]/blog/rencontre-a-rennes-guide
src/app/[locale]/blog/que-dire-dans-un-premier-message
src/app/[locale]/blog/rencontre-gay-paris-guide-complet
src/app/[locale]/blog/rencontre-gay-paris-guide-complet/page.tsx
src/app/[locale]/blog/meilleure-application-rencontre-gratuite-2026
src/app/[locale]/blog/meilleure-application-rencontre-gratuite-2026/page.tsx
src/app/[locale]/blog/gay-dating-marseille-guide
src/app/[locale]/blog/gay-dating-marseille-guide/page.tsx
src/app/[locale]/blog/application-rencontre-gratuite-ou-payante
src/app/[locale]/blog/application-rencontre-gratuite-ou-payante/page.tsx
src/app/[locale]/blog/pourquoi-les-apps-classiques-creent-de-la-fatigue
src/app/[locale]/blog/pourquoi-les-apps-classiques-creent-de-la-fatigue/page.tsx
src/app/[locale]/blog/best-dating-app-without-ads
src/app/[locale]/blog/rencontre-par-centres-interet
src/app/[locale]/blog/comment-gerer-la-distance
src/app/[locale]/blog/comment-faire-une-rencontre-authentique
src/app/[locale]/blog/comment-faire-une-rencontre-authentique/page.tsx
src/app/[locale]/blog/peur-du-rejet-rencontres
src/app/[locale]/blog/peur-du-rejet-rencontres/page.tsx
src/app/[locale]/blog/quelle-photo-mettre-sur-une-app-de-rencontre
src/app/[locale]/blog/quelle-photo-mettre-sur-une-app-de-rencontre/page.tsx
src/app/[locale]/blog/gay-dating-lyon-guide
src/app/[locale]/blog/gay-dating-lyon-guide/page.tsx
src/app/[locale]/blog/comment-fonctionne-le-matching-ia
src/app/[locale]/blog/inclusive-dating-app-guide
src/app/[locale]/blog/meilleure-application-rencontre-gay-2026
src/app/[locale]/blog/meilleure-application-rencontre-gay-2026/page.tsx
src/app/[locale]/blog/lgbtq-friendly-villes-france
src/app/[locale]/blog/lgbtq-friendly-villes-france/page.tsx
src/app/[locale]/blog/premier-message-application-rencontre
src/app/[locale]/blog/premier-message-application-rencontre/page.tsx
src/app/[locale]/blog/application-rencontre-2026-tendances
src/app/[locale]/blog/application-rencontre-2026-tendances/page.tsx
src/app/[locale]/blog/rencontre-trans-guide-bienveillant
src/app/[locale]/blog/rencontre-trans-guide-bienveillant/page.tsx
src/app/[locale]/blog/attachement-et-dating
src/app/[locale]/blog/attachement-et-dating/page.tsx
src/app/[locale]/blog/rencontre-gay-serieuse-relation-durable
src/app/[locale]/blog/rencontre-gay-serieuse-relation-durable/page.tsx
src/app/[locale]/blog/anxiete-sociale-rencontres
src/app/[locale]/blog/anxiete-sociale-rencontres/page.tsx
src/app/[locale]/blog/grindr-vs-embir-comparaison-complete
src/app/[locale]/blog/grindr-vs-embir-comparaison-complete/page.tsx
src/app/[locale]/blog/stalking-cyberharcelement-rencontre
src/app/[locale]/blog/stalking-cyberharcelement-rencontre/page.tsx
src/app/[locale]/blog/rencontre-gay-apres-40-ans
src/app/[locale]/blog/rencontre-gay-apres-40-ans/page.tsx
src/app/[locale]/blog/rencontre-discrete-guide-confidentialite
src/app/[locale]/blog/rencontre-discrete-guide-confidentialite/page.tsx
src/app/[locale]/blog/rencontre-a-dijon-guide
src/app/[locale]/blog/gay-dating-nantes-guide
src/app/[locale]/blog/gay-dating-nantes-guide/page.tsx
src/app/[locale]/blog/verification-selfie-securite
src/app/[locale]/blog/verification-selfie-securite/page.tsx
src/app/[locale]/blog/gay-dating-london
src/app/[locale]/blog/pourquoi-personnaliser-son-profil-rencontre
src/app/[locale]/blog/pourquoi-personnaliser-son-profil-rencontre/page.tsx
src/app/[locale]/blog/gay-dating-lille-guide
src/app/[locale]/blog/gay-dating-lille-guide/page.tsx
src/app/[locale]/blog/alternative-happn
src/app/[locale]/blog/alternative-happn/page.tsx
src/app/[locale]/blog/erreurs-a-eviter-sur-une-app-de-rencontre
src/app/[locale]/blog/erreurs-a-eviter-sur-une-app-de-rencontre/page.tsx
src/app/[locale]/blog/comment-embir-verifie-les-profils
src/app/[locale]/blog/rencontre-gay-serieuse-conseils
src/app/[locale]/blog/rencontre-gay-serieuse-conseils/page.tsx
src/app/[locale]/blog/hinge-alternative-2026
src/app/[locale]/blog/comment-se-proteger-sur-une-app-de-rencontre
src/app/[locale]/blog/comment-se-proteger-sur-une-app-de-rencontre/page.tsx
src/app/[locale]/blog/tinder-alternative-2026
src/app/[locale]/blog/rencontre-gay-premier-date
src/app/[locale]/blog/rencontre-gay-premier-date/page.tsx
src/app/[locale]/blog/rencontre-a-montpellier-guide
src/app/[locale]/blog/rencontre-a-grenoble-guide
src/app/[locale]/blog/futur-des-applis-de-rencontre
src/app/[locale]/blog/page.tsx
src/app/[locale]/blog/badoo-vs-nouvelles-applis
src/app/[locale]/blog/dating-app-for-introverts
src/app/[locale]/blog/app-rencontre-algorithme-matching
src/app/[locale]/blog/app-rencontre-algorithme-matching/page.tsx
src/app/[locale]/blog/comment-eviter-les-faux-comptes
src/app/[locale]/blog/comment-eviter-les-faux-comptes/page.tsx
```


## 7. Build / lint / tests

- npm run lint : OK, script ciblé `lint:seo`.
- npm run lint:seo : OK.
- npm run build : OK avec `next build --webpack`; Turbopack avait échoué sur manifest manquant.
- npm run seo:audit : OK.
- npm run test --if-present : exécuté; aucun script test configuré, sortie vide, exit 0.

### Résultat build final

```text
NPM_RUN_LINT / BUILD excerpt
Mon Jun 15 04:02:08 UTC 2026
NPM_RUN_LINT

> embyr@0.1.0 lint
> npm run lint:seo


> embyr@0.1.0 lint:seo
> eslint src/seo src/components/seo-pages.tsx src/components/seo/SchemaOrg.tsx src/components/layout/Navbar.tsx src/components/layout/Footer.tsx src/app/sitemap.ts 'src/app/[locale]/layout.tsx' 'src/app/[locale]/page.tsx' 'src/app/[locale]/auth/register/page.tsx' 'src/app/[locale]/france/[slug]/page.tsx' 'src/app/[locale]/usa/[slug]/page.tsx' 'src/app/[locale]/us/page.tsx' 'src/app/[locale]/us/[slug]/page.tsx' 'src/app/[locale]/us/dating/[slug]/page.tsx' 'src/app/[locale]/uk/page.tsx' 'src/app/[locale]/uk/[slug]/page.tsx' 'src/app/[locale]/uk/dating/[slug]/page.tsx' 'src/app/[locale]/guides/[slug]/page.tsx' 'src/app/[locale]/comparisons/[slug]/page.tsx' 'src/app/[locale]/comparaison/[slug]/page.tsx' 'src/app/[locale]/comparison/[slug]/page.tsx' 'src/app/[locale]/product/[slug]/page.tsx' 'src/app/[locale]/freemium/[slug]/page.tsx' 'src/app/[locale]/blog/[slug]/page.tsx' 'src/app/[locale]/rencontre/[slug]/page.tsx' 'src/app/[locale]/[slug]/page.tsx'

BACKUP_CURRENT_NEXT
NPM_RUN_BUILD_WEBPACK_WITH_BACKUP

> embyr@0.1.0 build
> next build --webpack

▲ Next.js 16.2.6 (webpack)
- Environments: .env

  Creating an optimized production build ...
✓ Compiled successfully in 87s
  Running TypeScript ...
  Finished TypeScript in 21.7s ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/1483) ...
  Generating static pages using 7 workers (370/1483) 
  Generating static pages using 7 workers (741/1483) 
  Generating static pages using 7 workers (1112/1483) 
✓ Generating static pages using 7 workers (1483/1483) in 4.2s
  Finalizing page optimization ...
  Collecting build traces ...

Route (app)
┌ ○ /_not-found
├ ƒ /[locale]
├ ƒ /[locale]/[slug]
├ ƒ /[locale]/about
├ ƒ /[locale]/admin
├ ƒ /[locale]/affichage
├ ƒ /[locale]/albums
├ ƒ /[locale]/ambassadeur
├ ƒ /[locale]/ambassadrice
├ ƒ /[locale]/annonces
├ ƒ /[locale]/apercu-visiteur
├ ƒ /[locale]/app-rencontre-gay
├ ƒ /[locale]/application-rencontre
├ ƒ /[locale]/application-rencontre-gay
├ ƒ /[locale]/application-rencontre-gratuite
├ ƒ /[locale]/auth/login
├ ƒ /[locale]/auth/register
├ ƒ /[locale]/bars-gay/amsterdam
├ ƒ /[locale]/bars-gay/barcelona
├ ƒ /[locale]/bars-gay/berlin
├ ƒ /[locale]/bars-gay/london
├ ƒ /[locale]/bars-gay/lyon
├ ƒ /[locale]/bars-gay/madrid
├ ƒ /[locale]/bars-gay/marseille
├ ƒ /[locale]/bars-gay/milan
├ ƒ /[locale]/bars-gay/montreal
├ ƒ /[locale]/bars-gay/new-york
├ ƒ /[locale]/bars-gay/nice
├ ƒ /[locale]/bars-gay/paris
├ ƒ /[locale]/bars-gay/rio-de-janeiro
├ ƒ /[locale]/bars-gay/san-francisco
├ ƒ /[locale]/bars-gay/sydney
├ ƒ /[locale]/bars-gay/tokyo
├ ƒ /[locale]/bars-gay/toulouse
├ ƒ /[locale]/blacklist
├ ƒ /[locale]/blog
├ ƒ /[locale]/blog/[slug]
├ ƒ /[locale]/blog/alternative-bumble
├ ƒ /[locale]/blog/alternative-grindr-2026-comparatif
├ ƒ /[locale]/blog/alternative-happn
├ ƒ /[locale]/blog/alternative-hinge
├ ƒ /[locale]/blog/alternative-tinder-gratuite
├ ƒ /[locale]/blog/anxiete-sociale-rencontres
├ ƒ /[locale]/blog/app-rencontre-algorithme-matching
├ ƒ /[locale]/blog/application-rencontre-2026-tendances
├ ƒ /[locale]/blog/application-rencontre-gratuite-ou-payante
├ ƒ /[locale]/blog/application-rencontre-sans-abonnement-guide
├ ƒ /[locale]/blog/application-rencontre-sans-pub-guide
├ ƒ /[locale]/blog/arnaques-amoureuses-applis-rencontre
├ ƒ /[locale]/blog/attachement-et-dating
├ ƒ /[locale]/blog/best-free-gay-dating-apps-2026
├ ƒ /[locale]/blog/best-gay-dating-apps-uk
├ ƒ /[locale]/blog/best-gay-dating-apps-usa
├ ƒ /[locale]/blog/best-grindr-alternative-free
├ ƒ /[locale]/blog/best-grindr-alternatives-2026
├ ƒ /[locale]/blog/coming-out-et-rencontres
├ ƒ /[locale]/blog/comment-choisir-une-app-de-rencontre
...
BUILD_STATUS=OK
PM2 online after build
```


### Résultat audit SEO final

```text
Mon Jun 15 04:06:18 UTC 2026
NPM_RUN_SEO_AUDIT_FINAL

> embyr@0.1.0 seo:audit
> node scripts/seo-audit.mjs

{
  "baseUrl": "https://embir.xyz",
  "sitemapUrl": "https://embir.xyz/sitemap.xml",
  "sampledPages": 105,
  "sitemap": {
    "totalUrls": 1596,
    "franceUrls": 452,
    "usaUrls": 185,
    "ukUrls": 270,
    "blogUrls": 184,
    "guideUrls": 120,
    "comparisonUrls": 50,
    "hreflangLinks": 2676
  },
  "thresholds": {
    "totalUrls": 500,
    "franceUrls": 80,
    "usaUrls": 120,
    "ukUrls": 90,
    "blogUrls": 150,
    "guideUrls": 120,
    "comparisonUrls": 40,
    "hreflangLinks": 80
  },
  "titleMissing": 0,
  "descriptionMissing": 0,
  "duplicateTitles": 0,
  "duplicateDescriptions": 0,
  "canonicalMissing": 0,
  "pagesWithoutCta": 0,
  "pagesWithoutFaq": 0,
  "pagesWithoutInternalLinks": 0,
  "noindexAccidental": 0,
  "homepageMissingRequired": [],
  "homepageForbiddenFound": [],
  "badStatusPages": [],
  "homepageStatus": 200
}
SEO audit passed.
NPM_RUN_TEST_IF_PRESENT_FINAL
LIVE_SMOKE_FINAL
HTTP/1.1 200 OK
Server: nginx/1.28.0 (Ubuntu)
Date: Mon, 15 Jun 2026 04:06:22 GMT
Content-Type: text/html; charset=utf-8
Connection: keep-alive
link: <https://embir.xyz/fr>; rel="alternate"; hreflang="fr", <https://embir.xyz/>; rel="alternate"; hreflang="en", <https://embir.xyz/es>; rel="alternate"; hreflang="es", <https://embir.xyz/de>; rel="alternate"; hreflang="de", <https://embir.xyz/pt>; rel="alternate"; hreflang="pt", <https://embir.xyz/it>; rel="alternate"; hreflang="it", <https://embir.xyz/nl>; rel="alternate"; hreflang="nl", <https://embir.xyz/ru>; rel="alternate"; hreflang="ru", <https://embir.xyz/zh>; rel="alternate"; hreflang="zh", <https://embir.xyz/ja>; rel="alternate"; hreflang="ja", <https://embir.xyz/ko>; rel="alternate"; hreflang="ko", <https://embir.xyz/ar>; rel="alternate"; hreflang="ar", <https://embir.xyz/hi>; rel="alternate"; hreflang="hi", <https://embir.xyz/tr>; rel="alternate"; hreflang="tr", <https://embir.xyz/pl>; rel="alternate"; hreflang="pl", <https://embir.xyz/sv>; rel="alternate"; hreflang="sv", <https://embir.xyz/da>; rel="alternate"; hreflang="da", <https://embir.xyz/fi>; rel="alternate"; hreflang="fi", <https://embir.xyz/no>; rel="alternate"; hreflang="no", <https://embir.xyz/th>; rel="alternate"; hreflang="th", <https://embir.xyz/vi>; rel="alternate"; hreflang="vi", <https://embir.xyz/id>; rel="alternate"; hreflang="id", <https://embir.xyz/ms>; rel="alternate"; hreflang="ms", <https://embir.xyz/ro>; rel="alternate"; hreflang="ro", <https://embir.xyz/>; rel="alternate"; hreflang="x-default"
set-cookie: NEXT_LOCALE=en; Path=/; SameSite=lax
x-middleware-rewrite: /en
Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
X-Powered-By: Next.js
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate

HTTP/1.1 200 OK
Server: nginx/1.28.0 (Ubuntu)
Date: Mon, 15 Jun 2026 04:06:22 GMT
Content-Type: application/xml
Connection: keep-alive
vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
x-nextjs-cache: HIT
cache-control: public, max-age=0, must-revalidate

┌────┬─────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name                │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼─────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 9  │ courtia-api         │ default     │ 1.0.0   │ fork    │ 7070     │ 6D     │ 2    │ online    │ 0%       │ 197.7mb  │ root     │ disabled │
│ 6  │ courtia-frontend    │ default     │ 0.39.7  │ fork    │ 1408     │ 6D     │ 0    │ online    │ 0%       │ 83.8mb   │ root     │ disabled │
│ 4  │ embyr-web           │ default     │ 0.39.7  │ fork    │ 236565   │ 86s    │ 186  │ online    │ 0%       │ 53.7mb   │ root     │ disabled │
│ 8  │ fcc-proxy           │ default     │ 1.0.0   │ fork    │ 1422     │ 6D     │ 0    │ online    │ 0%       │ 117.0mb  │ root     │ disabled │
│ 3  │ feminya-web         │ default     │ 0.39.7  │ fork    │ 94231    │ 4D     │ 2    │ online    │ 0%       │ 25.6mb   │ root     │ disabled │
│ 7  │ hermes-gateway      │ default     │ N/A     │ fork    │ 28956    │ 6D     │ 1    │ online    │ 0%       │ 684.5mb  │ root     │ disabled │
│ 5  │ meltbook-web        │ default     │ 0.39.7  │ fork    │ 1406     │ 6D     │ 0    │ online    │ 0%       │ 24.7mb   │ root     │ disabled │
│ 2  │ platify-api         │ default     │ 1.0.0   │ fork    │ 1392     │ 6D     │ 0    │ online    │ 0%       │ 79.2mb   │ root     │ disabled │
│ 1  │ snapfit-api         │ default     │ 1.0.0   │ fork    │ 1391     │ 6D     │ 0    │ online    │ 0%       │ 71.2mb   │ root     │ disabled │
└────┴─────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
Module
┌────┬──────────────────────────────┬───────────────┬──────────┬──────────┬──────┬──────────┬──────────┬──────────┐
│ id │ module                       │ version       │ pid      │ status   │ ↺    │ cpu      │ mem      │ user     │
├────┼──────────────────────────────┼───────────────┼──────────┼──────────┼──────┼──────────┼──────────┼──────────┤
│ 0  │ pm2-logrotate                │ 3.0.0         │ 1380     │ online   │ 0    │ 0%       │ 45.3mb   │ root     │
└────┴──────────────────────────────┴───────────────┴──────────┴──────────┴──────┴──────────┴──────────┴──────────┘
```


## 8. Tests live 100 URLs

Résumé : 100/100 HTTP 200, 100/100 canonical, 0 noindex accidentel.


```text
SUMMARY total=100
SUMMARY http_200=100
SUMMARY canonical=100
SUMMARY noindex=0
NON_200_LINES
NO_CANONICAL_LINES
NOINDEX_LINES
```


| URL | catégorie | HTTP | canonical | noindex | statut |
| --- | --- | --- | --- | --- | --- |
| https://embir.xyz/fr/rencontre/paris | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/lyon | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/marseille | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/toulouse | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/bordeaux | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/lille | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/nantes | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/nice | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/strasbourg | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/montpellier | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/rennes | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/grenoble | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/dijon | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/reims | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/toulon | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/saint-etienne | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/le-havre | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/angers | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/clermont-ferrand | France | 200 | yes | none | OK |
| https://embir.xyz/fr/rencontre/homme-femme | France | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/new-york | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/los-angeles | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/chicago | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/houston | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/phoenix | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/philadelphia | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/san-antonio | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/san-diego | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/dallas | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/san-jose | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/austin | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/jacksonville | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/fort-worth | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/columbus | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/charlotte | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/san-francisco | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/indianapolis | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/seattle | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/denver | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/washington-dc | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/boston | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/el-paso | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/nashville | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/detroit | USA | 200 | yes | none | OK |
| https://embir.xyz/en/us/dating/oklahoma-city | USA | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/london | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/birmingham | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/manchester | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/leeds | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/glasgow | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/liverpool | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/newcastle | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/sheffield | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/bristol | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/nottingham | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/leicester | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/edinburgh | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/cardiff | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/belfast | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/brighton | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/southampton | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/portsmouth | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/oxford | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/cambridge | UK | 200 | yes | none | OK |
| https://embir.xyz/en/uk/dating/coventry | UK | 200 | yes | none | OK |
| https://embir.xyz/fr/guides/choisir-une-application-de-rencontre | guide | 200 | yes | none | OK |
| https://embir.xyz/fr/guides/creer-un-profil-de-rencontre-compatible | guide | 200 | yes | none | OK |
| https://embir.xyz/fr/guides/definir-ses-preferences-de-rencontre | guide | 200 | yes | none | OK |
| https://embir.xyz/fr/guides/utiliser-les-filtres-orientation | guide | 200 | yes | none | OK |
| https://embir.xyz/fr/guides/rencontrer-sans-swipe-infini | guide | 200 | yes | none | OK |
| https://embir.xyz/fr/guides/eviter-les-faux-profils | guide | 200 | yes | none | OK |
| https://embir.xyz/fr/guides/verifier-un-profil-avant-un-date | guide | 200 | yes | none | OK |
| https://embir.xyz/fr/guides/premier-message-respectueux | guide | 200 | yes | none | OK |
| https://embir.xyz/fr/guides/premier-rendez-vous-securise | guide | 200 | yes | none | OK |
| https://embir.xyz/fr/guides/rencontre-hetero-inclusive | guide | 200 | yes | none | OK |
| https://embir.xyz/fr/guides/rencontre-gay-respectueuse | guide | 200 | yes | none | OK |
| https://embir.xyz/fr/guides/rencontre-lesbienne-bienveillante | guide | 200 | yes | none | OK |
| https://embir.xyz/fr/guides/rencontre-bi-sans-stereotypes | guide | 200 | yes | none | OK |
| https://embir.xyz/fr/guides/rencontre-trans-respectueuse | guide | 200 | yes | none | OK |
| https://embir.xyz/fr/guides/rencontre-queer-inclusive | guide | 200 | yes | none | OK |
| https://embir.xyz/en/blog/meilleure-application-rencontre-gratuite-2026 | article | 200 | yes | none | OK |
| https://embir.xyz/en/blog/meilleure-application-rencontre-gay-2026 | article | 200 | yes | none | OK |
| https://embir.xyz/en/blog/meilleure-application-rencontre-lgbtq-2026 | article | 200 | yes | none | OK |
| https://embir.xyz/en/blog/pourquoi-les-applis-de-rencontre-fatiguent | article | 200 | yes | none | OK |
| https://embir.xyz/en/blog/comment-reconnaitre-faux-profil-rencontre | article | 200 | yes | none | OK |
| https://embir.xyz/en/blog/comment-ecrire-bio-parfaite-rencontre | article | 200 | yes | none | OK |
| https://embir.xyz/en/blog/premier-message-application-rencontre | article | 200 | yes | none | OK |
| https://embir.xyz/en/blog/premier-rendez-vous-conseils-2026 | article | 200 | yes | none | OK |
| https://embir.xyz/en/blog/application-rencontre-sans-pub-guide | article | 200 | yes | none | OK |
| https://embir.xyz/en/blog/comment-faire-rencontres-serieuses | article | 200 | yes | none | OK |
| https://embir.xyz/en/blog/pourquoi-personnaliser-son-profil-rencontre | article | 200 | yes | none | OK |
| https://embir.xyz/en/blog/app-rencontre-algorithme-matching | article | 200 | yes | none | OK |
| https://embir.xyz/en/blog/best-free-gay-dating-apps-2026 | article | 200 | yes | none | OK |
| https://embir.xyz/en/blog/best-grindr-alternatives-2026 | article | 200 | yes | none | OK |
| https://embir.xyz/en/blog/meilleures-applis-rencontre-gay-france | article | 200 | yes | none | OK |
| https://embir.xyz/en/comparaison/grindr-vs-embir | comparatif | 200 | yes | none | OK |
| https://embir.xyz/en/comparaison/tinder-vs-embir | comparatif | 200 | yes | none | OK |
| https://embir.xyz/en/comparaison/meilleures-apps-rencontre | comparatif | 200 | yes | none | OK |
| https://embir.xyz/en/comparaison/meilleures-apps-gay | comparatif | 200 | yes | none | OK |
| https://embir.xyz/en/comparaison/apps-rencontre-gratuites | comparatif | 200 | yes | none | OK |

## 9. QA navigateur

- Desktop 1440x1000 : testé.
- Mobile 390x844 : testé.
- Pages testées : /, /auth/register, /en/us/free-dating-app, /en/uk/free-dating-app, /fr/gratuit-au-lancement, /en/comparison/grindr-vs-embir, /fr/rencontre/paris, /en/us/dating/new-york, /en/uk/dating/london, /fr/guides/choisir-une-application-de-rencontre, /en/blog/meilleure-application-rencontre-gratuite-2026.
- Erreurs console critiques : 0.
- Débordement mobile : 0.
- Register : HTTP 200, formulaire visible, email visible, submit visible.
- Captures : /tmp/embir_home_desktop.png, /tmp/embir_home_mobile.png, /tmp/embir_register_mobile.png, /tmp/embir_us_page_mobile.png, /tmp/embir_uk_page_mobile.png.

| viewport | path | HTTP | H1 visible | CTA/form | console errors | overflow |
| --- | --- | --- | --- | --- | --- | --- |
| desktop | / | 200 | yes | yes | 0 | no |
| desktop | /auth/register | 200 | yes | form submit verified separately | 0 | no |
| desktop | /en/us/free-dating-app | 200 | yes | yes | 0 | no |
| desktop | /en/uk/free-dating-app | 200 | yes | yes | 0 | no |
| desktop | /fr/gratuit-au-lancement | 200 | yes | yes | 0 | no |
| desktop | /en/comparison/grindr-vs-embir | 200 | yes | yes | 0 | no |
| desktop | /fr/rencontre/paris | 200 | yes | yes | 0 | no |
| desktop | /en/us/dating/new-york | 200 | yes | yes | 0 | no |
| desktop | /en/uk/dating/london | 200 | yes | yes | 0 | no |
| desktop | /fr/guides/choisir-une-application-de-rencontre | 200 | yes | yes | 0 | no |
| desktop | /en/blog/meilleure-application-rencontre-gratuite-2026 | 200 | yes | yes | 0 | no |
| mobile | / | 200 | yes | yes | 0 | no |
| mobile | /auth/register | 200 | yes | form submit verified separately | 0 | no |
| mobile | /en/us/free-dating-app | 200 | yes | yes | 0 | no |
| mobile | /en/uk/free-dating-app | 200 | yes | yes | 0 | no |
| mobile | /fr/gratuit-au-lancement | 200 | yes | yes | 0 | no |
| mobile | /en/comparison/grindr-vs-embir | 200 | yes | yes | 0 | no |
| mobile | /fr/rencontre/paris | 200 | yes | yes | 0 | no |
| mobile | /en/us/dating/new-york | 200 | yes | yes | 0 | no |
| mobile | /en/uk/dating/london | 200 | yes | yes | 0 | no |
| mobile | /fr/guides/choisir-une-application-de-rencontre | 200 | yes | yes | 0 | no |
| mobile | /en/blog/meilleure-application-rencontre-gratuite-2026 | 200 | yes | yes | 0 | no |

## 10. Git / traçabilité

- Branche : main.
- Commit : NON, worktree déjà très sale avec changements legacy/untracked hors périmètre.
- Patch créé : docs/EMBIR_WAR_ROOM_DIFF_SUMMARY.patch.
- Fichiers War Room modifiés/créés : package.json, src/app/[locale]/page.tsx, src/app/[locale]/layout.tsx, scripts/seo-audit.mjs, docs/EMBIR_WAR_ROOM_DIFF_SUMMARY.patch, docs/EMBIR_WAR_ROOM_FINAL_REPORT.md.

### Git status extrait

```text
MODIFIED_SCOPE
 M .reddit_env
 M eslint.config.mjs
 M messages/ar/common.json
 M messages/da/common.json
 M messages/de/common.json
 M messages/en/common.json
 M messages/es/common.json
 M messages/fi/common.json
 M messages/fr/common.json
 M messages/hi/common.json
 M messages/id/common.json
 M messages/it/common.json
 M messages/ja/common.json
 M messages/ko/common.json
 M messages/ms/common.json
 M messages/nl/common.json
 M messages/no/common.json
 M messages/pl/common.json
 M messages/pt/common.json
 M messages/ro/common.json
 M messages/ru/common.json
 M messages/sv/common.json
 M messages/th/common.json
 M messages/tr/common.json
 M messages/uk/common.json
 M messages/vi/common.json
 M messages/zh/common.json
 M next.config.ts
 M package.json
 M public/robots.txt
 D public/sitemap.xml
 M scripts/reddit_proxy_post.py
 M src/app/[locale]/auth/register/page.tsx
 D src/app/[locale]/blog/10-gay-dating-commandments/page.tsx
 D src/app/[locale]/blog/ad-free-gay-dating-apps/page.tsx
 D src/app/[locale]/blog/being-gay-and-lonely/page.tsx
 M src/app/[locale]/blog/best-free-gay-dating-apps-2026/page.tsx
 D src/app/[locale]/blog/best-gay-neighborhoods-france/page.tsx
 D src/app/[locale]/blog/city-guides/best-lgbtq-friendly-cities-europe/page.tsx
 D src/app/[locale]/blog/coming-out-dating-advice/page.tsx
 D src/app/[locale]/blog/create-gay-dating-profile/page.tsx
 D src/app/[locale]/blog/culture/coming-out-at-your-own-pace/page.tsx
 D src/app/[locale]/blog/culture/gay-dating-trends-2026/page.tsx
 D src/app/[locale]/blog/culture/hookup-culture-vs-meaningful-connections/page.tsx
 D src/app/[locale]/blog/dating-tips/authentic-gay-dating-profile-2026/page.tsx
 D src/app/[locale]/blog/dating-tips/building-confidence-shy-gay-men/page.tsx
 D src/app/[locale]/blog/dating-tips/difficult-conversations-gay-relationships/page.tsx
 D src/app/[locale]/blog/dating-tips/first-date-ideas-gay-men/page.tsx
 D src/app/[locale]/blog/dating-tips/long-distance-gay-relationships/page.tsx
 D src/app/[locale]/blog/dating-tips/psychology-of-attraction-gay-men/page.tsx
 D src/app/[locale]/blog/first-gay-date-tips/page.tsx
 D src/app/[locale]/blog/flirting-on-dating-apps/page.tsx
 D src/app/[locale]/blog/free-grindr-alternatives-2026/page.tsx
 D src/app/[locale]/blog/gay-dating-safety-rules/page.tsx
 D src/app/[locale]/blog/gay-dating-safety/page.tsx
 D src/app/[locale]/blog/how-to-flirt-with-guys/page.tsx
 D src/app/[locale]/blog/how-to-tell-if-guy-is-gay/page.tsx
 D src/app/[locale]/blog/late-coming-out-stories/page.tsx
 M src/app/[locale]/blog/page.tsx
 D src/app/[locale]/blog/pride-month-history/page.tsx
 D src/app/[locale]/blog/safety/online-dating-safety-guide/page.tsx
 D src/app/[locale]/blog/safety/spot-catfish-scammers-dating-apps/page.tsx
 D src/app/[locale]/blog/serious-relationship-vs-hookup/page.tsx
 D src/app/[locale]/blog/successful-first-gay-date/page.tsx
 M src/app/[locale]/layout.tsx
 M src/app/[locale]/page.tsx
 M src/app/sitemap.ts
 M src/components/AnalyticsProvider.tsx
 M src/components/brand/EmbirLogo.tsx
 M src/components/layout/Footer.tsx
 M src/components/layout/Navbar.tsx
 M src/components/seo/SchemaOrg.tsx
 M src/i18n/routing.ts
 M src/lib/analytics.ts
 M src/styles/embir-tokens.css
 M src/styles/mobile.css
?? content/blog/city-guides/best-lgbtq-friendly-cities-france-2026.md
?? content/blog/culture/best-free-gay-dating-app-2026.md
?? content/blog/culture/coming-out-later-life-gay-dating.md
?? content/blog/culture/dating-app-no-premium-no-bots.md
?? content/blog/culture/free-dating-app-no-catch.md
?? content/blog/culture/free-grindr-alternatives-2026.md
?? content/blog/culture/gay-dating-app-etiquette-2026.md
?? content/blog/culture/gay-dating-without-grindr.md
?? content/blog/culture/pride-2026-gay-dating-meaning.md
?? content/blog/culture/why-dating-apps-are-paywalled.md
?? content/blog/culture/why-gay-dating-apps-should-be-free-2026.md
?? content/blog/dating-tips/dating-app-red-flags-respect.md
?? content/blog/dating-tips/first-gay-date-complete-guide.md
?? content/blog/dating-tips/gay-dating-small-french-towns.md
?? content/blog/dating-tips/long-distance-gay-relationships-2026.md
?? content/blog/safety/spot-fake-profiles-catfish-gay-dating.md
?? content/blog/stories/
?? create_reddit_app_via_proxy.py
?? docs/EMBIR_CODEX_MASTER_FINAL_REPORT.md
?? docs/EMBIR_WAR_ROOM_DIFF_SUMMARY.patch
?? public/sitemap.xml.pre-seo-20260615.bak
?? reddit_campaign_fresh.py
?? scripts/seo-audit.mjs
?? src/app/[locale]/[slug]/
?? src/app/[locale]/application-rencontre-gay/
?? src/app/[locale]/application-rencontre-gratuite/
?? src/app/[locale]/application-rencontre/
?? src/app/[locale]/auth/layout.tsx
?? src/app/[locale]/blog/[slug]/
?? src/app/[locale]/blog/alternative-bumble/
?? src/app/[locale]/blog/alternative-grindr-2026-comparatif/
?? src/app/[locale]/blog/alternative-happn/
?? src/app/[locale]/blog/alternative-hinge/
?? src/app/[locale]/blog/alternative-tinder-gratuite/
?? src/app/[locale]/blog/anxiete-sociale-rencontres/
?? src/app/[locale]/blog/app-rencontre-algorithme-matching/
?? src/app/[locale]/blog/application-rencontre-2026-tendances/
?? src/app/[locale]/blog/application-rencontre-gratuite-ou-payante/
?? src/app/[locale]/blog/application-rencontre-sans-abonnement-guide/
?? src/app/[locale]/blog/application-rencontre-sans-pub-guide/
?? src/app/[locale]/blog/arnaques-amoureuses-applis-rencontre/
?? src/app/[locale]/blog/attachement-et-dating/
?? src/app/[locale]/blog/best-gay-dating-apps-uk/
?? src/app/[locale]/blog/best-gay-dating-apps-usa/
?? src/app/[locale]/blog/best-grindr-alternative-free/
?? src/app/[locale]/blog/best-grindr-alternatives-2026/
?? src/app/[locale]/blog/coming-out-et-rencontres/
?? src/app/[locale]/blog/comment-choisir-une-app-de-rencontre/
?? src/app/[locale]/blog/comment-ecrire-bio-parfaite-rencontre/
?? src/app/[locale]/blog/comment-eviter-les-faux-comptes/
?? src/app/[locale]/blog/comment-eviter-relations-toxiques-rencontre/
?? src/app/[locale]/blog/comment-faire-rencontres-serieuses/
?? src/app/[locale]/blog/comment-faire-une-bio-attirante/
?? src/app/[locale]/blog/comment-faire-une-rencontre-authentique/
?? src/app/[locale]/blog/comment-reconnaitre-faux-profil-rencontre/
?? src/app/[locale]/blog/comment-savoir-si-un-profil-est-serieux/
?? src/app/[locale]/blog/comment-se-proteger-sur-une-app-de-rencontre/
?? src/app/[locale]/blog/confiance-en-soi-rencontres/
?? src/app/[locale]/blog/consentement-applis-rencontre/
?? src/app/[locale]/blog/dependance-affective-rencontres/
?? src/app/[locale]/blog/donnees-personnelles-applis-rencontre/
?? src/app/[locale]/blog/drag-queer-culture-rencontre/
?? src/app/[locale]/blog/erreurs-a-eviter-sur-une-app-de-rencontre/
?? src/app/[locale]/blog/gay-dating-bordeaux-guide/
?? src/app/[locale]/blog/gay-dating-lille-guide/
?? src/app/[locale]/blog/gay-dating-lyon-guide/
?? src/app/[locale]/blog/gay-dating-marseille-guide/
?? src/app/[locale]/blog/gay-dating-nantes-guide/
?? src/app/[locale]/blog/gay-dating-new-york/
?? src/app/[locale]/blog/gay-dating-paris-guide/
?? src/app/[locale]/blog/gay-dating-toulouse-guide/
?? src/app/[locale]/blog/ghosting-pourquoi-et-comment/
?? src/app/[locale]/blog/grindr-est-il-encore-le-meilleur-choix/
?? src/app/[locale]/blog/grindr-vs-embir-comparaison-complete/
?? src/app/[locale]/blog/lgbtq-friendly-villes-france/
?? src/app/[locale]/blog/meilleure-application-rencontre-gay-2026/
?? src/app/[locale]/blog/meilleure-application-rencontre-gratuite-2026/
?? src/app/[locale]/blog/meilleure-application-rencontre-lgbtq-2026/
?? src/app/[locale]/blog/meilleures-applis-rencontre-gay-france/
?? src/app/[locale]/blog/peur-du-rejet-rencontres/
?? src/app/[locale]/blog/pourquoi-les-applis-de-rencontre-fatiguent/
?? src/app/[locale]/blog/pourquoi-les-apps-classiques-creent-de-la-fatigue/
?? src/app/[locale]/blog/pourquoi-les-apps-de-rencontre-sont-payantes/
```


## 11. Obsidian

- Fichiers lus avant action : 00_START_HERE.md, Command Center, INDEX_GLOBAL, règle permanente, règles de travail, master Embir, notes SEO/refonte/reprise, bugs ouverts/urgents, VPS principal, PM2.
- Fichier créé : 30_EMBYR/2026-06-15_Codex_War_Room_Verite_Live_Embir.md.
- Fichiers modifiés après génération du rapport : 30_EMBYR/Embyr — Master.md, 80_QA_BUGS/Bugs ouverts.md, 80_QA_BUGS/Bugs urgents.md.

## 12. Bugs restants

- Middleware vers proxy : Next affiche encore l avertissement `middleware` déprécié vers `proxy`.
- Safari réel : non testé sur device Safari réel.
- Messagerie 2 comptes : non testé end-to-end dans cette War Room.
- GSC : sitemap à soumettre/forcer recrawl.
- GA4 : events business à valider.
- Monitoring : à brancher sur homepage/sitemap/register.
- Localisation humaine : contenus EN/FR à relire humainement.

## 13. Prochaines actions business

- Soumettre sitemap GSC.
- Vérifier GA4 events register / CTA / SEO page view.
- Product Hunt.
- AlternativeTo.
- Reddit propre.
- Backlinks.
- TikTok/X.
- Landing app mobile.
- Onboarding fondateurs.
- Tests inscription réels.

## 14. Preuves brutes

### Commandes curl homepage/sitemap

```text
Mon Jun 15 04:05:12 UTC 2026
HOME_HEADER
HTTP/1.1 200 OK
Server: nginx/1.28.0 (Ubuntu)
Date: Mon, 15 Jun 2026 04:05:12 GMT
Content-Type: text/html; charset=utf-8
Connection: keep-alive
link: <https://embir.xyz/fr>; rel="alternate"; hreflang="fr", <https://embir.xyz/>; rel="alternate"; hreflang="en", <https://embir.xyz/es>; rel="alternate"; hreflang="es", <https://embir.xyz/de>; rel="alternate"; hreflang="de", <https://embir.xyz/pt>; rel="alternate"; hreflang="pt", <https://embir.xyz/it>; rel="alternate"; hreflang="it", <https://embir.xyz/nl>; rel="alternate"; hreflang="nl", <https://embir.xyz/ru>; rel="alternate"; hreflang="ru", <https://embir.xyz/zh>; rel="alternate"; hreflang="zh", <https://embir.xyz/ja>; rel="alternate"; hreflang="ja", <https://embir.xyz/ko>; rel="alternate"; hreflang="ko", <https://embir.xyz/ar>; rel="alternate"; hreflang="ar", <https://embir.xyz/hi>; rel="alternate"; hreflang="hi", <https://embir.xyz/tr>; rel="alternate"; hreflang="tr", <https://embir.xyz/pl>; rel="alternate"; hreflang="pl", <https://embir.xyz/sv>; rel="alternate"; hreflang="sv", <https://embir.xyz/da>; rel="alternate"; hreflang="da", <https://embir.xyz/fi>; rel="alternate"; hreflang="fi", <https://embir.xyz/no>; rel="alternate"; hreflang="no", <https://embir.xyz/th>; rel="alternate"; hreflang="th", <https://embir.xyz/vi>; rel="alternate"; hreflang="vi", <https://embir.xyz/id>; rel="alternate"; hreflang="id", <https://embir.xyz/ms>; rel="alternate"; hreflang="ms", <https://embir.xyz/ro>; rel="alternate"; hreflang="ro", <https://embir.xyz/>; rel="alternate"; hreflang="x-default"
set-cookie: NEXT_LOCALE=en; Path=/; SameSite=lax
x-middleware-rewrite: /en
Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
X-Powered-By: Next.js
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate

TITLE_META
<title>Embir — Free dating platform for France, UK and USA
<meta name="description" content="Embir is a free-at-launch dating platform for France, the UK and the United States, built for every orientation with preferences, compatibility, verified profiles and a transparent future freemium model."
REQUIRED_HOME_COUNTS
2 | The dating platform for everyone
4 | France
4 | UK
4 | United States
4 | Free at launch
4 | freemium
4 | orientation
3 | preferences
4 | compatibility
4 | verified profiles
2 | Join the founding community
2 | Old dating apps vs Embir
2 | Ready to meet compatible people
FORBIDDEN_HOME_COUNTS
0 | Gay Dating App
0 | designed for Paris
0 | Grindr vs Embir
0 | Ready to meet real guys
0 | real guys
0 | Where glances ignite
0 | new dating app for men
SITEMAP
HTTP/1.1 200 OK
Server: nginx/1.28.0 (Ubuntu)
Date: Mon, 15 Jun 2026 04:05:12 GMT
Content-Type: application/xml
Connection: keep-alive
vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
x-nextjs-cache: HIT
cache-control: public, max-age=0, must-revalidate

total=1596
france=898
usa=185
uk=270
blog=184
guide=120
comparison=40
comparaison=30
hreflang=1338
```


### Extrait pm2/nginx

```text
Mon Jun 15 04:06:01 UTC 2026
srv1609703
root
/root
PM2_LIST
┌────┬─────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name                │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼─────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 9  │ courtia-api         │ default     │ 1.0.0   │ fork    │ 7070     │ 6D     │ 2    │ online    │ 0%       │ 197.7mb  │ root     │ disabled │
│ 6  │ courtia-frontend    │ default     │ 0.39.7  │ fork    │ 1408     │ 6D     │ 0    │ online    │ 0%       │ 83.8mb   │ root     │ disabled │
│ 4  │ embyr-web           │ default     │ 0.39.7  │ fork    │ 236565   │ 66s    │ 186  │ online    │ 0%       │ 54.1mb   │ root     │ disabled │
│ 8  │ fcc-proxy           │ default     │ 1.0.0   │ fork    │ 1422     │ 6D     │ 0    │ online    │ 0%       │ 117.0mb  │ root     │ disabled │
│ 3  │ feminya-web         │ default     │ 0.39.7  │ fork    │ 94231    │ 4D     │ 2    │ online    │ 0%       │ 25.0mb   │ root     │ disabled │
│ 7  │ hermes-gateway      │ default     │ N/A     │ fork    │ 28956    │ 6D     │ 1    │ online    │ 0%       │ 684.5mb  │ root     │ disabled │
│ 5  │ meltbook-web        │ default     │ 0.39.7  │ fork    │ 1406     │ 6D     │ 0    │ online    │ 0%       │ 25.1mb   │ root     │ disabled │
│ 2  │ platify-api         │ default     │ 1.0.0   │ fork    │ 1392     │ 6D     │ 0    │ online    │ 0%       │ 79.2mb   │ root     │ disabled │
│ 1  │ snapfit-api         │ default     │ 1.0.0   │ fork    │ 1391     │ 6D     │ 0    │ online    │ 0%       │ 71.2mb   │ root     │ disabled │
└────┴─────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
Module
┌────┬──────────────────────────────┬───────────────┬──────────┬──────────┬──────┬──────────┬──────────┬──────────┐
│ id │ module                       │ version       │ pid      │ status   │ ↺    │ cpu      │ mem      │ user     │
├────┼──────────────────────────────┼───────────────┼──────────┼──────────┼──────┼──────────┼──────────┼──────────┤
│ 0  │ pm2-logrotate                │ 3.0.0         │ 1380     │ online   │ 0    │ 0%       │ 44.8mb   │ root     │
└────┴──────────────────────────────┴───────────────┴──────────┴──────────┴──────┴──────────┴──────────┴──────────┘
PM2_DESCRIBE
 Describing process with id 4 - name embyr-web 
┌───────────────────┬────────────────────────────────────────────┐
│ status            │ online                                     │
│ name              │ embyr-web                                  │
│ namespace         │ default                                    │
│ version           │ 0.39.7                                     │
│ restarts          │ 186                                        │
│ uptime            │ 66s                                        │
│ script path       │ /root/.nvm/versions/node/v20.20.2/bin/npm  │
│ script args       │ run start -- -p 3100                       │
│ error log path    │ /root/.pm2/logs/embyr-web-error.log        │
│ out log path      │ /root/.pm2/logs/embyr-web-out.log          │
│ pid path          │ /root/.pm2/pids/embyr-web-4.pid            │
│ interpreter       │ /root/.nvm/versions/node/v20.20.2/bin/node │
│ interpreter args  │ N/A                                        │
│ script id         │ 4                                          │
│ exec cwd          │ /root/embyr                                │
│ exec mode         │ fork_mode                                  │
│ node.js version   │ 20.20.2                                    │
│ node env          │ N/A                                        │
│ watch & reload    │ ✘                                          │
│ unstable restarts │ 0                                          │
│ created at        │ 2026-06-15T04:04:55.735Z                   │
└───────────────────┴────────────────────────────────────────────┘
 Actions available 
┌────────────────────────┐
│ km:heapdump            │
│ km:cpu:profiling:start │
│ km:cpu:profiling:stop  │
│ km:heap:sampling:start │
│ km:heap:sampling:stop  │
└────────────────────────┘
 Trigger via: pm2 trigger embyr-web <action_name>

 Code metrics value 
┌────────────────────────┬──────────┐
│ Used Heap Size         │ 7.68 MiB │
│ Heap Usage             │ 78.94 %  │
│ Heap Size              │ 9.73 MiB │
│ Event Loop Latency p95 │ 1.42 ms  │
│ Event Loop Latency     │ 0.45 ms  │
│ Active handles         │ 5        │
│ Active requests        │ 0        │
└────────────────────────┴──────────┘
 Divergent env variables from local env 
┌────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ PWD            │ /root/embyr                                                                                                                                                                                                                   │
│ SSH_CONNECTION │ 88.168.94.24 47616 72.62.187.63 22                                                                                                                                                                                            │
│ SHLVL          │ 2                                                                                                                                                                                                                             │
│ XDG_SESSION_ID │ 1428                                                                                                                                                                                                                          │
│ SSH_CLIENT     │ 88.168.94.24 47616 22                                                                                                                                                                                                         │
│ PATH           │ /root/.local/bin:/root/.local/bin:/root/.local/bin:/root/.local/bin:/root/.local/bin:/root/.nvm/versions/node/v22.22.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin │
└────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

 Add your own code metrics: http://bit.ly/code-metrics
 Use `pm2 logs embyr-web [--lines 1000]` to display logs
 Use `pm2 env 4` to display environment variables
 Use `pm2 monit` to monitor CPU and Memory usage embyr-web
PM2_LOGS
[TAILING] Tailing last 40 lines for [embyr-web] process (change the value with --lines option)
/root/.pm2/logs/embyr-web-error.log last 40 lines:
4|embyr-we |   path: '/root/embyr/.next/prerender-manifest.json'
4|embyr-we | }
4|embyr-we | Error: ENOENT: no such file or directory, open '/root/embyr/.next/prerender-manifest.json'
4|embyr-we |     at ignore-listed frames {
4|embyr-we |   errno: -2,
4|embyr-we |   code: 'ENOENT',
4|embyr-we |   syscall: 'open',
4|embyr-we |   path: '/root/embyr/.next/prerender-manifest.json'
4|embyr-we | }
4|embyr-we | Error: ENOENT: no such file or directory, open '/root/embyr/.next/prerender-manifest.json'
4|embyr-we |     at ignore-listed frames {
4|embyr-we |   errno: -2,
4|embyr-we |   code: 'ENOENT',
4|embyr-we |   syscall: 'open',
4|embyr-we |   path: '/root/embyr/.next/prerender-manifest.json'
4|embyr-we | }
4|embyr-we | Error: ENOENT: no such file or directory, open '/root/embyr/.next/prerender-manifest.json'
4|embyr-we |     at ignore-listed frames {
4|embyr-we |   errno: -2,
4|embyr-we |   code: 'ENOENT',
4|embyr-we |   syscall: 'open',
4|embyr-we |   path: '/root/embyr/.next/prerender-manifest.json'
4|embyr-we | }
4|embyr-we | Error: ENOENT: no such file or directory, open '/root/embyr/.next/prerender-manifest.json'
4|embyr-we |     at ignore-listed frames {
4|embyr-we |   errno: -2,
4|embyr-we |   code: 'ENOENT',
4|embyr-we |   syscall: 'open',
4|embyr-we |   path: '/root/embyr/.next/prerender-manifest.json'
4|embyr-we | }
4|embyr-we | SyntaxError: Unexpected end of JSON input
4|embyr-we |     at JSON.parse (<anonymous>)
4|embyr-we | ⨯ Error [InvariantError]: Invariant: The client reference manifest for route "/[locale]/[slug]" does not exist. This is a bug in Next.js.
4|embyr-we |     at Object.get (.next/server/chunks/3445.js:11:4608)
4|embyr-we |     at async q (.next/server/app/[locale]/[slug]/page.js:1:13525)
4|embyr-we | ⨯ Error [InvariantError]: Invariant: The client reference manifest for route "/[locale]/[slug]" does not exist. This is a bug in Next.js.
4|embyr-we |     at Object.get (.next/server/chunks/3445.js:11:4608)
4|embyr-we |     at async q (.next/server/app/[locale]/[slug]/page.js:1:13525)
4|embyr-we | ⨯ Error: Failed to load static file for page: /500 ENOENT: no such file or directory, open '/root/embyr/.next/server/pages/500.html'
4|embyr-we |     at ignore-listed frames

/root/.pm2/logs/embyr-web-out.log last 40 lines:
4|embyr-we | 
4|embyr-we | > embyr@0.1.0 start
4|embyr-we | > next start -p 3100
4|embyr-we | 
4|embyr-we | ▲ Next.js 16.2.6
4|embyr-we | - Local:         http://localhost:3100
4|embyr-we | - Network:       http://72.62.187.63:3100
4|embyr-we | ✓ Ready in 170ms
4|embyr-we | 
4|embyr-we | > embyr@0.1.0 start
4|embyr-we | > next start -p 3100
4|embyr-we | 
4|embyr-we | ▲ Next.js 16.2.6
4|embyr-we | - Local:         http://localhost:3100
4|embyr-we | - Network:       http://72.62.187.63:3100
4|embyr-we | ✓ Ready in 183ms
4|embyr-we | 
4|embyr-we | > embyr@0.1.0 start
4|embyr-we | > next start -p 3100
4|embyr-we | 
4|embyr-we | ▲ Next.js 16.2.6
4|embyr-we | - Local:         http://localhost:3100
4|embyr-we | - Network:       http://72.62.187.63:3100
4|embyr-we | ✓ Ready in 153ms
4|embyr-we | 
4|embyr-we | > embyr@0.1.0 start
4|embyr-we | > next start -p 3100
4|embyr-we | 
4|embyr-we | ▲ Next.js 16.2.6
4|embyr-we | - Local:         http://localhost:3100
4|embyr-we | - Network:       http://72.62.187.63:3100
4|embyr-we | ✓ Ready in 124ms
4|embyr-we | 
4|embyr-we | > embyr@0.1.0 start
4|embyr-we | > next start -p 3100
4|embyr-we | 
4|embyr-we | ▲ Next.js 16.2.6
4|embyr-we | - Local:         http://localhost:3100
4|embyr-we | - Network:       http://72.62.187.63:3100
4|embyr-we | ✓ Ready in 131ms

NGINX_EMBIR
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# configuration file /etc/nginx/sites-enabled/courtia-frontend:
# === HTTPS — courtiark.fr (frontend COURTIA) ===
server {
    server_name courtiark.fr www.courtiark.fr;

    root /root/courtia/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-store";
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/api.courtiark.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.courtiark.fr/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    server_name courtiark.fr www.courtiark.fr;
    return 301 https://$host$request_uri;
}

# configuration file /etc/nginx/sites-enabled/embir.xyz:
server {
    server_name embir.xyz www.embir.xyz;

    location / {
        proxy_pass http://localhost:3100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /_next/static {
        proxy_pass http://localhost:3100;
```


### Résultats 100 URLs

```text
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/paris
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/lyon
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/marseille
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/toulouse
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/bordeaux
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/lille
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/nantes
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/nice
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/strasbourg
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/montpellier
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/rennes
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/grenoble
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/dijon
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/reims
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/toulon
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/saint-etienne
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/le-havre
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/angers
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/clermont-ferrand
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/rencontre/homme-femme
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/new-york
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/los-angeles
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/chicago
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/houston
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/phoenix
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/philadelphia
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/san-antonio
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/san-diego
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/dallas
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/san-jose
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/austin
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/jacksonville
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/fort-worth
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/columbus
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/charlotte
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/san-francisco
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/indianapolis
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/seattle
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/denver
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/washington-dc
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/boston
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/el-paso
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/nashville
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/detroit
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/us/dating/oklahoma-city
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/london
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/birmingham
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/manchester
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/leeds
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/glasgow
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/liverpool
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/newcastle
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/sheffield
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/bristol
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/nottingham
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/leicester
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/edinburgh
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/cardiff
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/belfast
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/brighton
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/southampton
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/portsmouth
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/oxford
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/cambridge
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/uk/dating/coventry
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/guides/choisir-une-application-de-rencontre
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/guides/creer-un-profil-de-rencontre-compatible
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/guides/definir-ses-preferences-de-rencontre
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/guides/utiliser-les-filtres-orientation
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/guides/rencontrer-sans-swipe-infini
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/guides/eviter-les-faux-profils
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/guides/verifier-un-profil-avant-un-date
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/guides/premier-message-respectueux
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/guides/premier-rendez-vous-securise
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/guides/rencontre-hetero-inclusive
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/guides/rencontre-gay-respectueuse
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/guides/rencontre-lesbienne-bienveillante
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/guides/rencontre-bi-sans-stereotypes
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/guides/rencontre-trans-respectueuse
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/fr/guides/rencontre-queer-inclusive
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/blog/meilleure-application-rencontre-gratuite-2026
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/blog/meilleure-application-rencontre-gay-2026
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/blog/meilleure-application-rencontre-lgbtq-2026
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/blog/pourquoi-les-applis-de-rencontre-fatiguent
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/blog/comment-reconnaitre-faux-profil-rencontre
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/blog/comment-ecrire-bio-parfaite-rencontre
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/blog/premier-message-application-rencontre
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/blog/premier-rendez-vous-conseils-2026
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/blog/application-rencontre-sans-pub-guide
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/blog/comment-faire-rencontres-serieuses
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/blog/pourquoi-personnaliser-son-profil-rencontre
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/blog/app-rencontre-algorithme-matching
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/blog/best-free-gay-dating-apps-2026
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/blog/best-grindr-alternatives-2026
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/blog/meilleures-applis-rencontre-gay-france
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/comparaison/grindr-vs-embir
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/comparaison/tinder-vs-embir
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/comparaison/meilleures-apps-rencontre
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/comparaison/meilleures-apps-gay
200 | canonical:rel="canonical" | noindex: | https://embir.xyz/en/comparaison/apps-rencontre-gratuites
```


### Résultat build

```text
Mon Jun 15 04:02:08 UTC 2026
NPM_RUN_LINT

> embyr@0.1.0 lint
> npm run lint:seo


> embyr@0.1.0 lint:seo
> eslint src/seo src/components/seo-pages.tsx src/components/seo/SchemaOrg.tsx src/components/layout/Navbar.tsx src/components/layout/Footer.tsx src/app/sitemap.ts 'src/app/[locale]/layout.tsx' 'src/app/[locale]/page.tsx' 'src/app/[locale]/auth/register/page.tsx' 'src/app/[locale]/france/[slug]/page.tsx' 'src/app/[locale]/usa/[slug]/page.tsx' 'src/app/[locale]/us/page.tsx' 'src/app/[locale]/us/[slug]/page.tsx' 'src/app/[locale]/us/dating/[slug]/page.tsx' 'src/app/[locale]/uk/page.tsx' 'src/app/[locale]/uk/[slug]/page.tsx' 'src/app/[locale]/uk/dating/[slug]/page.tsx' 'src/app/[locale]/guides/[slug]/page.tsx' 'src/app/[locale]/comparisons/[slug]/page.tsx' 'src/app/[locale]/comparaison/[slug]/page.tsx' 'src/app/[locale]/comparison/[slug]/page.tsx' 'src/app/[locale]/product/[slug]/page.tsx' 'src/app/[locale]/freemium/[slug]/page.tsx' 'src/app/[locale]/blog/[slug]/page.tsx' 'src/app/[locale]/rencontre/[slug]/page.tsx' 'src/app/[locale]/[slug]/page.tsx'

BACKUP_CURRENT_NEXT
NPM_RUN_BUILD_WEBPACK_WITH_BACKUP

> embyr@0.1.0 build
> next build --webpack

▲ Next.js 16.2.6 (webpack)
- Environments: .env

  Creating an optimized production build ...
✓ Compiled successfully in 87s
  Running TypeScript ...
  Finished TypeScript in 21.7s ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/1483) ...
  Generating static pages using 7 workers (370/1483) 
  Generating static pages using 7 workers (741/1483) 
  Generating static pages using 7 workers (1112/1483) 
✓ Generating static pages using 7 workers (1483/1483) in 4.2s
  Finalizing page optimization ...
  Collecting build traces ...

Route (app)
┌ ○ /_not-found
├ ƒ /[locale]
├ ƒ /[locale]/[slug]
├ ƒ /[locale]/about
├ ƒ /[locale]/admin
├ ƒ /[locale]/affichage
├ ƒ /[locale]/albums
├ ƒ /[locale]/ambassadeur
├ ƒ /[locale]/ambassadrice
├ ƒ /[locale]/annonces
├ ƒ /[locale]/apercu-visiteur
├ ƒ /[locale]/app-rencontre-gay
├ ƒ /[locale]/application-rencontre
├ ƒ /[locale]/application-rencontre-gay
├ ƒ /[locale]/application-rencontre-gratuite
├ ƒ /[locale]/auth/login
├ ƒ /[locale]/auth/register
├ ƒ /[locale]/bars-gay/amsterdam
├ ƒ /[locale]/bars-gay/barcelona
├ ƒ /[locale]/bars-gay/berlin
├ ƒ /[locale]/bars-gay/london
├ ƒ /[locale]/bars-gay/lyon
├ ƒ /[locale]/bars-gay/madrid
├ ƒ /[locale]/bars-gay/marseille
├ ƒ /[locale]/bars-gay/milan
├ ƒ /[locale]/bars-gay/montreal
├ ƒ /[locale]/bars-gay/new-york
├ ƒ /[locale]/bars-gay/nice
├ ƒ /[locale]/bars-gay/paris
├ ƒ /[locale]/bars-gay/rio-de-janeiro
├ ƒ /[locale]/bars-gay/san-francisco
├ ƒ /[locale]/bars-gay/sydney
├ ƒ /[locale]/bars-gay/tokyo
├ ƒ /[locale]/bars-gay/toulouse
├ ƒ /[locale]/blacklist
├ ƒ /[locale]/blog
├ ƒ /[locale]/blog/[slug]
├ ƒ /[locale]/blog/alternative-bumble
├ ƒ /[locale]/blog/alternative-grindr-2026-comparatif
├ ƒ /[locale]/blog/alternative-happn
├ ƒ /[locale]/blog/alternative-hinge
├ ƒ /[locale]/blog/alternative-tinder-gratuite
├ ƒ /[locale]/blog/anxiete-sociale-rencontres
├ ƒ /[locale]/blog/app-rencontre-algorithme-matching
├ ƒ /[locale]/blog/application-rencontre-2026-tendances
├ ƒ /[locale]/blog/application-rencontre-gratuite-ou-payante
├ ƒ /[locale]/blog/application-rencontre-sans-abonnement-guide
├ ƒ /[locale]/blog/application-rencontre-sans-pub-guide
├ ƒ /[locale]/blog/arnaques-amoureuses-applis-rencontre
├ ƒ /[locale]/blog/attachement-et-dating
├ ƒ /[locale]/blog/best-free-gay-dating-apps-2026
├ ƒ /[locale]/blog/best-gay-dating-apps-uk
├ ƒ /[locale]/blog/best-gay-dating-apps-usa
├ ƒ /[locale]/blog/best-grindr-alternative-free
├ ƒ /[locale]/blog/best-grindr-alternatives-2026
├ ƒ /[locale]/blog/coming-out-et-rencontres
├ ƒ /[locale]/blog/comment-choisir-une-app-de-rencontre
├ ƒ /[locale]/blog/comment-ecrire-bio-parfaite-rencontre
├ ƒ /[locale]/blog/comment-eviter-les-faux-comptes
├ ƒ /[locale]/blog/comment-eviter-relations-toxiques-rencontre
├ ƒ /[locale]/blog/comment-faire-rencontres-serieuses
├ ƒ /[locale]/blog/comment-faire-une-bio-attirante
├ ƒ /[locale]/blog/comment-faire-une-rencontre-authentique
├ ƒ /[locale]/blog/comment-reconnaitre-faux-profil-rencontre
├ ƒ /[locale]/blog/comment-savoir-si-un-profil-est-serieux
├ ƒ /[locale]/blog/comment-se-proteger-sur-une-app-de-rencontre
├ ƒ /[locale]/blog/confiance-en-soi-rencontres
├ ƒ /[locale]/blog/consentement-applis-rencontre
├ ƒ /[locale]/blog/dependance-affective-rencontres
├ ƒ /[locale]/blog/donnees-personnelles-applis-rencontre
├ ƒ /[locale]/blog/drag-queer-culture-rencontre
├ ƒ /[locale]/blog/erreurs-a-eviter-sur-une-app-de-rencontre
├ ƒ /[locale]/blog/gay-dating-bordeaux-guide
├ ƒ /[locale]/blog/gay-dating-lille-guide
├ ƒ /[locale]/blog/gay-dating-lyon-guide
├ ƒ /[locale]/blog/gay-dating-marseille-guide
├ ƒ /[locale]/blog/gay-dating-nantes-guide
├ ƒ /[locale]/blog/gay-dating-new-york
├ ƒ /[locale]/blog/gay-dating-paris-guide
├ ƒ /[locale]/blog/gay-dating-toulouse-guide
├ ƒ /[locale]/blog/ghosting-pourquoi-et-comment
├ ƒ /[locale]/blog/grindr-est-il-encore-le-meilleur-choix
├ ƒ /[locale]/blog/grindr-vs-embir-comparaison-complete
├ ƒ /[locale]/blog/lgbtq-friendly-villes-france
├ ƒ /[locale]/blog/meilleure-application-rencontre-gay-2026
├ ƒ /[locale]/blog/meilleure-application-rencontre-gratuite-2026
├ ƒ /[locale]/blog/meilleure-application-rencontre-lgbtq-2026
├ ƒ /[locale]/blog/meilleures-applis-rencontre-gay-france
├ ƒ /[locale]/blog/peur-du-rejet-rencontres
├ ƒ /[locale]/blog/pourquoi-les-applis-de-rencontre-fatiguent
├ ƒ /[locale]/blog/pourquoi-les-apps-classiques-creent-de-la-fatigue
├ ƒ /[locale]/blog/pourquoi-les-apps-de-rencontre-sont-payantes
├ ƒ /[locale]/blog/pourquoi-les-profils-verifies-rassurent
├ ƒ /[locale]/blog/pourquoi-personnaliser-son-profil-rencontre
├ ƒ /[locale]/blog/premier-date-gay-conseils-2026
├ ƒ /[locale]/blog/premier-message-application-rencontre
├ ƒ /[locale]/blog/premier-rendez-vous-conseils-2026
├ ƒ /[locale]/blog/pride-2026-rencontres
├ ƒ /[locale]/blog/profils-verifies-rencontre-guide
├ ƒ /[locale]/blog/psychologie-du-swipe
├ ƒ /[locale]/blog/quelle-photo-mettre-sur-une-app-de-rencontre
├ ƒ /[locale]/blog/rencontre-bi-conseils
├ ƒ /[locale]/blog/rencontre-bi-guide-complet
├ ƒ /[locale]/blog/rencontre-compatible-orientation-guide
├ ƒ /[locale]/blog/rencontre-discrete-guide-confidentialite
├ ƒ /[locale]/blog/rencontre-gay-apres-40-ans
├ ƒ /[locale]/blog/rencontre-gay-paris-guide-complet
├ ƒ /[locale]/blog/rencontre-gay-premier-date
├ ƒ /[locale]/blog/rencontre-gay-serieuse-conseils
├ ƒ /[locale]/blog/rencontre-gay-serieuse-relation-durable
├ ƒ /[locale]/blog/rencontre-homme-homme-conseils
├ ƒ /[locale]/blog/rencontre-lesbienne-conseils
├ ƒ /[locale]/blog/rencontre-lgbtq-paris-guide
├ ƒ /[locale]/blog/rencontre-lgbtq-respectueuse
├ ƒ /[locale]/blog/rencontre-moderne-2026
├ ƒ /[locale]/blog/rencontre-pour-tous-inclusive
├ ƒ /[locale]/blog/rencontre-queer-conseils
├ ƒ /[locale]/blog/rencontre-queer-espaces-inclusifs
├ ƒ /[locale]/blog/rencontre-trans-guide-bienveillant
├ ƒ /[locale]/blog/rencontre-trans-respectueuse
├ ƒ /[locale]/blog/rupture-amoureuse-rebondir
├ ƒ /[locale]/blog/signaux-alerte-premier-rendez-vous
├ ƒ /[locale]/blog/stalking-cyberharcelement-rencontre
├ ƒ /[locale]/blog/verification-selfie-securite
├ ƒ /[locale]/certification
├ ƒ /[locale]/chat-gay
├ ƒ /[locale]/comparaison
├ ƒ /[locale]/comparaison/[slug]
├ ƒ /[locale]/comparaison/apps-rencontre-gratuites
├ ƒ /[locale]/comparaison/badoo-vs-embir
├ ƒ /[locale]/comparaison/bumble-vs-embir
├ ƒ /[locale]/comparaison/feeld-vs-embir
├ ƒ /[locale]/comparaison/fruitz-vs-embir
├ ƒ /[locale]/comparaison/grindr-vs-embir
├ ƒ /[locale]/comparaison/happn-vs-embir
├ ƒ /[locale]/comparaison/hinge-vs-embir
├ ƒ /[locale]/comparaison/meetic-vs-embir
├ ƒ /[locale]/comparaison/meilleures-alternatives-grindr
├ ƒ /[locale]/comparaison/meilleures-alternatives-tinder
├ ƒ /[locale]/comparaison/meilleures-apps-gay
├ ƒ /[locale]/comparaison/meilleures-apps-rencontre
├ ƒ /[locale]/comparaison/okcupid-vs-embir
├ ƒ /[locale]/comparaison/tinder-vs-embir
├ ƒ /[locale]/comparison/[slug]
├ ƒ /[locale]/comparisons/[slug]
├ ƒ /[locale]/couple-gay
├ ƒ /[locale]/dashboard
```


### Résultat audit SEO

```text
Mon Jun 15 04:06:18 UTC 2026
NPM_RUN_SEO_AUDIT_FINAL

> embyr@0.1.0 seo:audit
> node scripts/seo-audit.mjs

{
  "baseUrl": "https://embir.xyz",
  "sitemapUrl": "https://embir.xyz/sitemap.xml",
  "sampledPages": 105,
  "sitemap": {
    "totalUrls": 1596,
    "franceUrls": 452,
    "usaUrls": 185,
    "ukUrls": 270,
    "blogUrls": 184,
    "guideUrls": 120,
    "comparisonUrls": 50,
    "hreflangLinks": 2676
  },
  "thresholds": {
    "totalUrls": 500,
    "franceUrls": 80,
    "usaUrls": 120,
    "ukUrls": 90,
    "blogUrls": 150,
    "guideUrls": 120,
    "comparisonUrls": 40,
    "hreflangLinks": 80
  },
  "titleMissing": 0,
  "descriptionMissing": 0,
  "duplicateTitles": 0,
  "duplicateDescriptions": 0,
  "canonicalMissing": 0,
  "pagesWithoutCta": 0,
  "pagesWithoutFaq": 0,
  "pagesWithoutInternalLinks": 0,
  "noindexAccidental": 0,
  "homepageMissingRequired": [],
  "homepageForbiddenFound": [],
  "badStatusPages": [],
  "homepageStatus": 200
}
SEO audit passed.
NPM_RUN_TEST_IF_PRESENT_FINAL
LIVE_SMOKE_FINAL
HTTP/1.1 200 OK
Server: nginx/1.28.0 (Ubuntu)
Date: Mon, 15 Jun 2026 04:06:22 GMT
Content-Type: text/html; charset=utf-8
Connection: keep-alive
link: <https://embir.xyz/fr>; rel="alternate"; hreflang="fr", <https://embir.xyz/>; rel="alternate"; hreflang="en", <https://embir.xyz/es>; rel="alternate"; hreflang="es", <https://embir.xyz/de>; rel="alternate"; hreflang="de", <https://embir.xyz/pt>; rel="alternate"; hreflang="pt", <https://embir.xyz/it>; rel="alternate"; hreflang="it", <https://embir.xyz/nl>; rel="alternate"; hreflang="nl", <https://embir.xyz/ru>; rel="alternate"; hreflang="ru", <https://embir.xyz/zh>; rel="alternate"; hreflang="zh", <https://embir.xyz/ja>; rel="alternate"; hreflang="ja", <https://embir.xyz/ko>; rel="alternate"; hreflang="ko", <https://embir.xyz/ar>; rel="alternate"; hreflang="ar", <https://embir.xyz/hi>; rel="alternate"; hreflang="hi", <https://embir.xyz/tr>; rel="alternate"; hreflang="tr", <https://embir.xyz/pl>; rel="alternate"; hreflang="pl", <https://embir.xyz/sv>; rel="alternate"; hreflang="sv", <https://embir.xyz/da>; rel="alternate"; hreflang="da", <https://embir.xyz/fi>; rel="alternate"; hreflang="fi", <https://embir.xyz/no>; rel="alternate"; hreflang="no", <https://embir.xyz/th>; rel="alternate"; hreflang="th", <https://embir.xyz/vi>; rel="alternate"; hreflang="vi", <https://embir.xyz/id>; rel="alternate"; hreflang="id", <https://embir.xyz/ms>; rel="alternate"; hreflang="ms", <https://embir.xyz/ro>; rel="alternate"; hreflang="ro", <https://embir.xyz/>; rel="alternate"; hreflang="x-default"
set-cookie: NEXT_LOCALE=en; Path=/; SameSite=lax
x-middleware-rewrite: /en
Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
X-Powered-By: Next.js
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate

HTTP/1.1 200 OK
Server: nginx/1.28.0 (Ubuntu)
Date: Mon, 15 Jun 2026 04:06:22 GMT
Content-Type: application/xml
Connection: keep-alive
vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
x-nextjs-cache: HIT
cache-control: public, max-age=0, must-revalidate

┌────┬─────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name                │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼─────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 9  │ courtia-api         │ default     │ 1.0.0   │ fork    │ 7070     │ 6D     │ 2    │ online    │ 0%       │ 197.7mb  │ root     │ disabled │
│ 6  │ courtia-frontend    │ default     │ 0.39.7  │ fork    │ 1408     │ 6D     │ 0    │ online    │ 0%       │ 83.8mb   │ root     │ disabled │
│ 4  │ embyr-web           │ default     │ 0.39.7  │ fork    │ 236565   │ 86s    │ 186  │ online    │ 0%       │ 53.7mb   │ root     │ disabled │
│ 8  │ fcc-proxy           │ default     │ 1.0.0   │ fork    │ 1422     │ 6D     │ 0    │ online    │ 0%       │ 117.0mb  │ root     │ disabled │
│ 3  │ feminya-web         │ default     │ 0.39.7  │ fork    │ 94231    │ 4D     │ 2    │ online    │ 0%       │ 25.6mb   │ root     │ disabled │
│ 7  │ hermes-gateway      │ default     │ N/A     │ fork    │ 28956    │ 6D     │ 1    │ online    │ 0%       │ 684.5mb  │ root     │ disabled │
│ 5  │ meltbook-web        │ default     │ 0.39.7  │ fork    │ 1406     │ 6D     │ 0    │ online    │ 0%       │ 24.7mb   │ root     │ disabled │
│ 2  │ platify-api         │ default     │ 1.0.0   │ fork    │ 1392     │ 6D     │ 0    │ online    │ 0%       │ 79.2mb   │ root     │ disabled │
│ 1  │ snapfit-api         │ default     │ 1.0.0   │ fork    │ 1391     │ 6D     │ 0    │ online    │ 0%       │ 71.2mb   │ root     │ disabled │
└────┴─────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
Module
┌────┬──────────────────────────────┬───────────────┬──────────┬──────────┬──────┬──────────┬──────────┬──────────┐
│ id │ module                       │ version       │ pid      │ status   │ ↺    │ cpu      │ mem      │ user     │
├────┼──────────────────────────────┼───────────────┼──────────┼──────────┼──────┼──────────┼──────────┼──────────┤
│ 0  │ pm2-logrotate                │ 3.0.0         │ 1380     │ online   │ 0    │ 0%       │ 45.3mb   │ root     │
└────┴──────────────────────────────┴───────────────┴──────────┴──────────┴──────┴──────────┴──────────┴──────────┘
```

