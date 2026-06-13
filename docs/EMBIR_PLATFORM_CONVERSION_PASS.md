# EMBIR — Passe plateforme conversion

Dernière mise à jour : 2026-06-08

## Objectif

Transformer la plateforme publique en tunnel cohérent vers l'objectif prioritaire : obtenir les 100 premiers profils réels Paris / Île-de-France.

Cette passe ne rajoute pas de “grosse feature”. Elle réduit la dispersion : moins de paywall, moins d'app générique, plus de fondateurs Paris.

## Changements livrés

- Métadonnées globales orientées `embir.xyz` + Paris fondateurs.
- Navbar : CTA principal remplacé par `Rejoindre Paris`.
- Footer : wording aligné sur Paris / profils réels.
- Page À propos : mission réécrite autour du lancement local honnête.
- Page inscription : contexte spécial pour `?source=paris-100-fondateurs`.
- Page login : retour vers le tunnel fondateurs pour les non-inscrits.
- Page Premium : paywall repoussé, message “Fondateurs d'abord”.
- Page Membres : bannière gratuite orientée invitation / densité locale.
- SMS : wording `embir.xyz`.
- Dépendance `twilio` ajoutée pour supprimer le warning de build.

## Routes vérifiées

- `https://embir.xyz` → 200
- `https://embir.xyz/auth/register?source=paris-100-fondateurs` → 200
- `https://embir.xyz/auth/login` → 200
- `https://embir.xyz/about` → 200
- `https://embir.xyz/premium` → 200
- `https://embir.xyz/membres` → 200
- `https://embir.xyz/paris` → 200

## Vérification technique

- `npm install twilio --save` exécuté sur le VPS.
- `npm run build` OK.
- `pm2 restart embir-web --update-env` OK.
- `embir-web` online.
- Le warning `Cannot resolve 'twilio'` a disparu.
- Warning restant : convention Next.js `middleware` dépréciée au profit de `proxy`.

## Risques restants

- `npm audit` signale 11 vulnérabilités modérées dans l'arbre actuel.
- Plusieurs scripts historiques / fichiers non suivis existent encore sur le VPS.
- Pas de vérification visuelle browser automatisée dans Codex pour cette passe.
- Le vrai test reste l'acquisition : créer des profils réels, pas seulement servir des pages.

## Prochaine action

Envoyer 20 messages manuels vers `https://embir.xyz/paris`, puis mesurer :

- inscriptions,
- profils avec photo,
- réponses,
- objections.
