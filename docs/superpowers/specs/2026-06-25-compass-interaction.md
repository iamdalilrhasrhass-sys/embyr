# Diagnostic Bug Compass — 2026-06-25

## Symptôme rapporté
La boussole réagit au mouvement de souris puis se fige brutalement.

## Causes identifiées (par ordre de sévérité)

### Bug #1 — Clamp bloquant (P0, fichier:ligne)
**Fichier:** `src/components/landing-2100/CompatibilityCompass.tsx:37-38`
```tsx
const normalized = (event.clientX - bounds.left) / bounds.width - 0.5;
setRotation(normalized * 0.42);
```
Rotation bornée à `±0.21` radians (~±12°). Pas d'accumulation. La rotation est une fonction directe de la position X dans le div, pas un drag. Quand la souris atteint le bord du div, la rotation sature et ne bouge plus → "figement".

### Bug #2 — Snap brutal au leave (P0, ligne:40)
```tsx
onPointerLeave={() => setRotation(0.08)}
```
Quand la souris sort, rotation snap à 0.08 rad sans transition. Aucune inertie.

### Bug #3 — Pas de pointer capture (P0, lignes:34-39)
`onPointerMove` est attaché au `<div>` seulement. Si le curseur dépasse la zone pendant un drag → plus d'events → freeze. Devrait utiliser `setPointerCapture` + `window` comme cible.

### Bug #4 — Pas de requestAnimationFrame (P1, global)
Chaque `pointermove` → `setRotation` → re-render React complet → saccadé. Devrait utiliser une boucle rAF unique avec manipulation DOM directe par refs.

### Bug #5 — Touch désactivé (P0, ligne:35)
```tsx
if (event.pointerType === "touch") return;
```
Les utilisateurs mobiles/tactiles ne peuvent PAS interagir avec la boussole.

### Bug #6 — re-render React à chaque frame (P1, lignes:17-20)
`useMemo` recalcule les 4 pétales SVG à chaque `setRotation`. Le SVG entier est reconstruit par React.

### Bug #7 — Aucune profondeur 3D (P2, global)
Pas de `perspective`, `transform-style: preserve-3d`, ou `translateZ`. La boussole est plate.

### Bug #8 — Pas d'inertie (P1, global)
Pas de vélocité angulaire accumulée, pas de friction, pas de rappel élastique. L'interaction est directe et sans vie.

## Solution proposée
Réécriture complète avec :
- `setPointerCapture` + `window` events → jamais de freeze
- Une boucle `requestAnimationFrame` unique
- Physique ressort-amorti : vélocité accumulée, friction 0.92/frame, rappel élastique
- DOM direct par refs (pas de setState par frame)
- Inclinaison 3D limitée à ±18° avec CSS transforms
- Support tactile natif via pointer events
- `prefers-reduced-motion` : drag sans inertie
