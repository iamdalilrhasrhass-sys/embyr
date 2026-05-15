# EMBYR — Mobile Ultra Audit Report

**Date**: 2026-05-15
**Build**: ✅ Next.js Turbopack, zéro erreur

## Pages testées (9 pages × 5 largeurs = 45 screenshots)

| Page | 360px | 375px | 390px | 414px | 430px |
|---|---|---|---|---|---|
| / | ✅ | ✅ | ✅ | ✅ | ✅ |
| /auth/register | ✅ | ✅ | ✅ | ✅ | ✅ |
| /auth/login | ✅ | ✅ | ✅ | ✅ | ✅ |
| /dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| /dashboard/profile | ✅ | ✅ | ✅ | ✅ | ✅ |
| /membres | ✅ | ✅ | ✅ | ✅ | ✅ |
| /messages | ✅ | ✅ | ✅ | ✅ | ✅ |
| /premium | ✅ | ✅ | ✅ | ✅ | ✅ |
| /inviter | ✅ | ✅ | ✅ | ✅ | ✅ |

## Résultats
- **Overflow horizontal**: 0/45
- **Erreurs console**: 0/45
- **h-scroll-containers internes**: normaux (nav horizontale dashboard, badges landing)

## Corrections mobile faites

### 1. BottomNav
- `/decouvrir` supprimé (lien mort/redondant)
- Navigation : Membres, Messages, Profil, Salons

### 2. AppShell — padding-bottom BottomNav
- `<main>` reçoit `pb-20` + `env(safe-area-inset-bottom)` (80px+ total)
- Plus de contenu caché derrière la barre de navigation

### 3. Dashboard layout
- `<main>` reçoit `pb-16 md:pb-0`
- Contenu respire en bas sur mobile

### 4. Messages — mobile complet
- `h-screen` → `min-h-screen` (évite cassure iOS URL bar)
- Sidebar conversations visible sur mobile quand aucune conversation active
- Bouton "← Retour" pour revenir à la liste
- Send button + input avec `minHeight: 44px`
- Input `text-base` pour éviter zoom iOS
- `padding-bottom` safe-area

### 5. Landing — micro-CTA corrigé
- "Connecte-toi" 68x14px → lien avec minHeight 44px + padding
- Touch target conforme aux guidelines Apple (44px minimum)

### 6. SideDrawer
- Vérifié : 24 liens, zéro lien mort
- `/decouvrir` absent ✅
- `/dashbord/profil` absent ✅
- `/ambassadrice` absent ✅
- Premium → "Premium bientôt" avec badge BIENTÔT ✅

### 7. Formulaires mobiles
- `mobile.css` règle globale : inputs ≥ 16px sur mobile
- Pas de zoom iOS automatique
- Touch targets ≥ 44px sur tous les boutons et CTAs

### 8. Profil mobile (/dashboard/profile)
- Inputs ≥ 16px ✅
- Formulaire bien espacé ✅
- Bouton enregistrer visible ✅

### 9. Premium / Inviter mobile
- Aucun prix visible sur /premium ✅
- Page inviter : message copiable, lien visible ✅

## Design system mobile
- `mobile.css` : variables safe-area, touch targets 44px, inputs 16px
- `globals.css` : `html { overflow-x: hidden }`, `body { overflow-x: hidden }`
- BottomNav : safe-area-inset-bottom natif
- AppShell : min-h-screen + padding-bottom adaptatif

## Screenshots
Stockés dans : `/root/embyr/tests/mobile-ultra-screenshots/`
Format : `{page}-{width}.png` (45 fichiers)

## Limites restantes (non bloquantes)
- Filtres membres : `flex-wrap` déjà adapté mobile, mais pas d'accordéon (non nécessaire vu le petit nombre de filtres)
- Dashboard bottom-padding: vérifié via body CSS (0px) mais le contenu via layout.tsx a pb-16 correct
- Messages: le bouton envoi n'apparaît que quand une conversation active est sélectionnée (comportement normal)
