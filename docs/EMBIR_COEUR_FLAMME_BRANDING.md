# EMBIR — Branding typographique final

Dernière mise à jour : 2026-06-08

## Décision

Embir adopte un logotype **100% typographique** comme identité principale.

Le signe public est `embir.xyz`. Le point `.` devient l'étincelle de marque : un accent rouge / orange / ambre, net, mémorisable, et plus premium qu'un symbole cœur trop attendu pour une app de rencontre.

Le Cœur-Flamme a servi d'étape intermédiaire, mais il n'est plus le logo principal.

## Palette

- Rouge néon : `#ff1f5a`
- Orange braise : `#ff5e36`
- Ambre flamme : `#ffa333`
- Fond principal : `#0a0614` / `#090b0e`
- Texte principal : `#ffffff`

## Changements livrés

- Composant logo : `src/components/brand/EmbirLogo.tsx`
- Wordmark : `embir.xyz`
- Point `.` en gradient comme étincelle
- Variante icône seule : point circulaire lumineux, utilisée dans le mockup iPhone
- Baseline : “Allume l'étincelle”
- Hero accueil : “Là où les regards s'embrasent.”
- Copy hero : “Une nouvelle app de rencontres entre hommes, pensée pour Paris, avec profils vérifiés, messages gratuits au lancement, matching intelligent et zéro bruit inutile.”
- Mockup iPhone intégré dans le premier écran
- CTA principal de l'accueil orienté acquisition : `/paris`

## Intégration plateforme globale

Passe appliquée le 2026-06-08 :

- Logo `embir.xyz` intégré dans la navigation publique.
- Logo `embir.xyz` intégré dans le footer.
- Logo `embir.xyz` intégré dans l'app shell desktop et mobile.
- Logo `embir.xyz` intégré dans le dashboard.
- Logo `embir.xyz` intégré dans les pages login / register.
- Drawer mobile nettoyé : retrait des emojis, points de marque braise.
- Bottom nav mobile nettoyée : retrait des emojis, indicateur point braise.
- Page `/membres` réalignée : boutons, empty state, badges et hover cards en gradient braise.
- Mockup produit legacy cyan/indigo remplacé par un mockup sombre braise.
- Variables globales `--color-premium-*`, `.bg-gradient-premium`, `.text-gradient`, `.glass-premium`, `.premium-glow`, `.noise-overlay`, `.soft-grid-bg` alignées sur le logo.
- Ancienne dominante cyan/indigo retirée des composants structurants.

Commit produit : `e2e1f53` — `Apply Embyr branding across platform`.

## Règle de marque

Ne pas revenir au cœur basique ni au symbole gemme abstrait.

La reconnaissance d'Embir repose maintenant sur :

1. le mot `embir.xyz`,
2. le point d'étincelle,
3. le contraste noir premium + gradient braise.

## Vérification

- `npm run build` OK sur le VPS le 2026-06-08
- `pm2 restart embyr-web --update-env` OK
- `https://embir.xyz` HTTP 200
- `https://embir.xyz/paris` HTTP 200
- `https://embir.xyz/auth/login` HTTP 200
- `https://embir.xyz/auth/register?source=paris-100-fondateurs` HTTP 200
- `https://embir.xyz/membres` HTTP 200
- `https://embir.xyz/dashboard` HTTP 200
- Le HTML public contient le nouveau hero, le CTA “Rejoindre les 100 fondateurs”, le logotype typographique, et ne contient plus l'ancien SVG cœur `viewBox="0 0 600 180"`.
- Captures Playwright : `/tmp/embyr-typographic-desktop-final.png`, `/tmp/embyr-typographic-mobile-final.png`
- Captures Playwright globales : `/tmp/embyr-global-home-desktop.png`, `/tmp/embyr-global-login-desktop.png`, `/tmp/embyr-global-register-desktop.png`, `/tmp/embyr-global-membres-with-header.png`, `/tmp/embyr-global-home-mobile.png`
