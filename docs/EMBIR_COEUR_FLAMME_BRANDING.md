# EMBIR — Branding Cœur-Flamme

Dernière mise à jour : 2026-06-08

## Décision

Embir adopte le logo **Cœur-Flamme** comme identité principale.

Le logo remplace l'ancien symbole “E” gemme par un signe plus direct : amour, désir, chaleur, étincelle. Le mot-symbole affiché devient `embir.xyz` pour coller au domaine réel et éviter la confusion `Embyr` / `Embir`.

## Palette

- Rouge néon : `#ff1f5a`
- Orange braise : `#ff5e36`
- Ambre flamme : `#ffa333`
- Fond principal : `#0a0614` / `#090b0e`
- Texte principal : `#ffffff`

## Changements livrés

- Composant logo SVG pur : `src/components/brand/EmbirLogo.tsx`
- Wordmark : `embir.xyz`
- Baseline : “Allume l'étincelle”
- Hero accueil : “Là où les regards s'embrasent.”
- Mockup téléphone intégré dans le premier écran
- CTA principal de l'accueil orienté acquisition : `/paris`

## Règle de marque

Le logo Cœur-Flamme est le signe central. Éviter de revenir à un logo abstrait ou à une gemme : pour une app de rencontre, le symbole doit être compréhensible en moins d'une seconde.

## Vérification

- `npm run build` OK sur le VPS le 2026-06-08
- `pm2 restart embyr-web --update-env` OK
- `https://embir.xyz` HTTP 200
- `https://embir.xyz/paris` HTTP 200
- Le HTML public contient le nouveau hero et le CTA “Rejoindre les 100 fondateurs”
