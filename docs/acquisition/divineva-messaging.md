# Embyr Acquisition — Divineva → Femynia

## Contexte
- **Date** : 15 mai 2026
- **Accord** : Gérant de Divineva a donné son accord (écosystème commun, même équipe)
- **Cible** : Utilisateurs connectés sur Divineva (anciennement Travestichat)

## Mécanisme
- **Contrôle** : Safari sur Mac de Dalil via Tailscale SSH
- **Onglet** : Window 1, Tab 10 → https://www.divineva.com
- **Script** : AppleScript + JavaScript injection via `do JavaScript`
- **Page cible** : https://www.divineva.com/chat.php?id=XXXXX
- **Éléments DOM** : `#message-input` (textarea), `#send-button` (clic)

## Résultat
- **26 messages envoyés**, 0 erreur
- Durée : ~2 min par utilisateur (3s chargement + 2s pause)
- Tous les utilisateurs actifs dans les discussions ont été contactés

## Limites
- Uniquement les utilisateurs avec qui l'utilisateur connecté a déjà une discussion
- Pas de message à froid (uniquement via `chat.php?id=X`)
- Navigation page entière par utilisateur (lent)

## Message type
```
Salut,

On lance Femynia, une nouvelle plateforme de rencontre gratuite pendant son lancement.
L'idée est simple : créer une alternative plus moderne, plus élégante et plus accessible, avec des profils réels et une ambiance plus respectueuse.

Les premiers inscrits auront des avantages fondateurs et du Premium offert plus tard.

Tu peux créer ton profil ici : https://feminya.xyz

Go now
```

## Scripts
- `/root/embyr/tests/divineva_bulk_v4.applescript` — version complète avec message multi-ligne
- `/root/embyr/tests/divineva_send_test.applescript` — version test one-liner
- Tous les scripts sont transférés sur le Mac via SCP puis exécutés

## Réutilisation
- Changer le message dans la variable JavaScript
- Changer la liste des userIDs
- Exécuter : `scp script.applescript mac:/tmp/ && ssh mac osascript /tmp/script.applescript`

## Obsidian
- Journal : `20_JOURNAL_DE_BORD/15-05-2026 Acquisition Divineva Femynia.md`
- État réel Femynia : mise à jour avec section Acquisition
- Master Embyr : mise à jour
