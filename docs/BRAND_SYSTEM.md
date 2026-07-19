# Embir Brand OS 1.0

Statut : système canonique depuis le 19 juillet 2026.

## Philosophie et piliers

Embir matérialise une connexion choisie dans les deux sens. Deux personnes restent distinctes, leurs intentions peuvent se rencontrer et chacun conserve son univers. Le système doit rester intime, éditorial, contemporain, inclusif et rassurant — premium sans ostentation.

Les six piliers sont la réciprocité, les intentions claires, l’univers personnel, la sécurité et les limites, l’inclusivité et l’absence de pression.

## Source de vérité

- Géométrie : `src/components/brand/embir-mark.json`.
- Rendu React statique : `EmbirMark.tsx` et `EmbirLogo.tsx`.
- Mouvement réservé au reveal réciproque : `EmbirReciprocityMotion.tsx`.
- Couleurs, typographie, espacements, rayons et ombres : `src/styles/embir-brand-tokens.css`.
- Génération déterministe : `scripts/generate-brand-assets.mjs`.

Les SVG et rasters de `public/brand`, les icônes PWA, les favicons et l’image OG sont des sorties générées. Ils ne doivent pas être retouchés séparément.

## Logo et géométrie

Le symbole utilise exactement deux courbes de Bézier dans un `viewBox` de 96 × 96, un trait de 5,5 unités et des extrémités rondes. Sa légère asymétrie exprime deux trajectoires distinctes ; le croisement laisse découvrir un cœur central sans dessiner un cœur littéral.

- Zone de sécurité : au moins 12 unités du `viewBox` autour du symbole.
- Taille minimale du symbole : 16 px ; préférer 24 px ou plus dans l’interface.
- Navigation : 30 à 40 px.
- Lockup : ne pas descendre sous 96 px de largeur.
- Icône standard : largeur optique proche de 60 % du canevas.
- Icône maskable : symbole maintenu dans la zone sûre centrale.

Le mot-symbole officiel est `Embir`, avec uniquement le E capital. Le point final, l’étoile sur le i, le bijou central, les têtes, silhouettes, flammes, diamants et cœurs rouges classiques sont interdits.

## Variantes

Le composant `EmbirLogo` expose `mark`, `wordmark`, `lockup` et `stacked`, les tons `light`, `dark`, `rose` et `mono`, ainsi que cinq tailles de `xs` à `xl`. Une tagline est facultative et doit provenir de l’i18n.

Assets officiels :

- `embir-mark-dark.svg` : symbole blush sur fond sombre ;
- `embir-mark-light.svg` : symbole prune sur fond clair ;
- `embir-mark-mono.svg` et `embir-mark-mono-white.svg` ;
- quatre lockups sombre, clair, noir et blanc ;
- icônes standard sombre, secondaire claire et maskable ;
- logo e-mail PNG avec fallback texte `Embir` ;
- OG 1200 × 630.

Un symbole adjacent au mot `Embir` est décoratif. Un symbole seul est nommé une fois, sauf s’il est explicitement décoratif.

## Palette

| Rôle | Token | Valeur |
|---|---|---|
| Fond principal | `--embir-void-950` | `#09060c` |
| Fond élevé | `--embir-void-900` | `#100a12` |
| Prunes | `--embir-plum-900/800/700` | `#2a1328`, `#35172f`, `#4b1f3d` |
| Rose | `--embir-rose-600/500/400` | `#bf6f8d`, `#d88ba7`, `#e7a8bc` |
| Blush | `--embir-blush-300/200/100` | `#f4c7d5`, `#f8dbe4`, `#fcebf0` |
| Neutres | `--embir-bone-100`, `--embir-ivory-50` | `#f2ede4`, `#fff8fa` |

Contrastes mesurés : bone/void 17,27:1 ; rose-500/void 7,83:1 ; void/blush-300 13,40:1. Le texte d’un CTA rose est toujours sombre. Le rose est un accent de connexion, jamais un lavage uniforme de l’écran.

### Mapping hérité contrôlé

| Ancien rôle | Nouveau rôle |
|---|---|
| cuivre/or `#d4a574` | rose-500 |
| corail `#ff5e36` | rose-600 |
| rose néon `#ff1f5a` | rose-500 |
| ambre `#ffa333` | blush-300 |
| fond `#0a0614` | void-950 |

Les alias `--eb-*`, `--e21-*` et `--color-premium-*` restent une couche de compatibilité documentée. Aucun nouvel usage ne doit être ajouté ; les nouvelles surfaces consomment les tokens `--embir-*`.

## Typographie, composants et iconographie

La display utilise Iowan Old Style/Baskerville/Palatino/Georgia. Le texte utilise Inter si présent localement, puis la pile système. Aucune fonte distante n’est chargée au runtime.

Boutons, champs, cartes, badges et focus utilisent les tokens partagés. Les photos et contenus restent prioritaires sur la découverte et les profils. Le symbole ne signale une réciprocité que lorsqu’elle est vraie. Les icônes fonctionnelles restent simples et ne réemploient pas le logo comme décoration générique.

## Mouvement et accessibilité

Le logo statique n’ajoute aucun JavaScript. L’animation des deux boucles est chargée seulement dans le reveal réciproque, dure moins d’une seconde et ne bloque jamais l’action. `prefers-reduced-motion` affiche immédiatement le symbole final.

Exigences permanentes : focus visible, cibles de 44 × 44 px, contraste AA, aucun double nom accessible, navigation clavier/Escape, aucune overflow à 320 px et zoom 200 % utilisable.

## Copy et internationalisation

- FR : « Des intentions partagées. Des connexions réciproques. »
- EN : “Shared intentions. Reciprocal connections.”
- ES : “Intenciones compartidas. Conexiones recíprocas.”

La tagline ne remplace pas le H1 SEO. Elle est utilisée sur les lockups de marque, le footer et les métadonnées visuelles lorsque l’espace le permet.

## Génération et tests

```bash
npm ci
npx prisma generate
npm run brand:assets
npm run typecheck
npm run lint
npm test
npm run build
BASE_URL=http://127.0.0.1:3201 QA_MODE=public npm run qa:brand
```

`brand:assets` doit être reproductible : un second lancement ne doit produire aucun diff. `qa:brand` est strictement GET/HEAD et peut donc être lancé sur un candidat ou en production. Les captures et le rapport JSON sont écrits dans `output/brand-os`.

## E-mails, PWA et SEO

Les e-mails utilisent des couleurs solides compatibles avec les clients, le logo HTTPS 240 × 72 et l’attribut alternatif `Embir`. Les parties texte brut et la logique d’envoi restent inchangées.

Le manifeste référence les icônes 192, 512 et maskable. Toute modification d’asset exige une nouvelle clé de cache du service worker. Canonical, hreflang, sitemap, robots, schema.org et textes programmatiques ne doivent pas être modifiés par une passe visuelle.

## Déploiement

1. Fusionner une PR verte dans `main` et relever le SHA exact.
2. Fast-forward `/root/embyr`, sans écraser un worktree sale.
3. Construire `/root/embyr-releases/<sha7>` avec Node 22.22.2, `.env` en `0600` et `GIT_COMMIT` aligné.
4. Lancer un candidat distinct sur 3201 et exécuter les smoke tests/QA en lecture seule.
5. Relayer temporairement Nginx vers 3201, valider `nginx -t`, puis supprimer et recréer l’unique processus stable `embyr-web` sur la nouvelle release au port 3100.
6. Revenir sur Nginx 3100, vérifier le public, supprimer le candidat et exécuter `pm2 save`.

Aucune migration Prisma n’est requise par Brand OS 1.0.

## Rollback

Conserver l’ancienne release et son SHA. En cas de 5xx, écran blanc, auth/onboarding cassé, asset majeur absent, overflow critique, erreur d’hydratation ou régression de performance : maintenir ou remettre le relais vers le candidat sain si possible, supprimer le nouveau stable, recréer l’unique `embyr-web` depuis l’ancien `cwd`, restaurer Nginx vers 3100, supprimer le candidat, `pm2 save`, puis refaire tous les contrôles publics.

Ne jamais laisser deux processus stables, muter une release historique ou déclarer le déploiement terminé avant le contrôle réel de `https://embir.xyz`.
