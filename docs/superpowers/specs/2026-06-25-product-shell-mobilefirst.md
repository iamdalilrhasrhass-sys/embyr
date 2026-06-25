# Embir Mobile-First Audit — 390px Viewport

**Date**: 2026-06-25  
**Scope**: All connected/product pages in the Embir app  
**Viewport target**: 390px (iPhone 14/15 width)  
**Design system reference**: `.embir2100` CSS custom properties (`--void`, `--bone`, `--ember`, `--coral`, `--hairline`), `--eb-*` tokens, `globals.css`

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| **P0** (Broken) | 18 | Touch targets below 44px, horizontal overflow risks, missing safe-area handling |
| **P1** (Ugly/Inconsistent) | 22 | Typography outside design system, competing color palettes, hardcoded values |
| **P2** (Nice-to-have) | 13 | Missing focus states, small text readability, minor spacing issues |

---

## P0 — Broken / Blocking

These issues cause functional failures at 390px: buttons users cannot reliably tap, content that scrolls horizontally, or missing safe-area insets.

### 1. Navbar — Hamburger menu button: 40×40px (need ≥44px)
- **File**: `src/components/layout/Navbar.tsx:110-118`
- **Issue**: `w-10 h-10` = 40px × 40px. Apple HIG requires minimum 44×44px touch target. The `mobile.css` rule `[data-site="embir"] button { min-height: 44px; min-width: 44px }` does NOT apply because this button lacks `data-site="embir"` context (the navbar is used across landing + app pages).
- **Fix priority**: Change to `w-11 h-11` (44×44).

### 2. Navbar — Mobile "Login" button touch target ~32px
- **File**: `src/components/layout/Navbar.tsx:97-101`
- **Issue**: `text-xs px-2 py-1.5` yields ~12px font × 1.5 padding = ~30px tap height. Below 44px.
- **Fix priority**: Minimum `py-2.5` + `min-h-[44px]`.

### 3. Navbar — Mobile "Register" button touch target ~32px
- **File**: `src/components/layout/Navbar.tsx:103-107`
- **Issue**: `px-3 py-1.5` = same ~30px tap height. Below 44px.
- **Fix priority**: Minimum `py-2.5` + `min-h-[44px]`.

### 4. Dashboard — Intent filter buttons: touch target ~32px
- **File**: `src/app/[locale]/dashboard/page.tsx:319-329`
- **Issue**: `px-4 py-2 text-xs` on filter pills. At 390px with 7 pills wrapped, tap height ~32px. Below 44px.
- **Fix priority**: Add `min-h-[44px]` to filter buttons.

### 5. Dashboard — Like / View Profile / Pass action buttons: ~36px tap height
- **File**: `src/app/[locale]/dashboard/page.tsx:506-529`
- **Issue**: `py-2.5 text-xs` yields ~36px effective tap height. Three buttons side by side at 390px.
- **Fix priority**: `py-3 min-h-[44px]`.

### 6. Membres — Filter controls (select + inputs): touch target ~32px
- **File**: `src/app/[locale]/membres/page.tsx:82-124`
- **Issue**: `px-3 py-2 text-xs` on `<select>`, `<input>`, and Apply button. `w-24` and `w-20` fixed widths on inputs risk content truncation. Tap height ~32-34px.
- **Fix priority**: `py-2.5 min-h-[44px]`, remove fixed widths at mobile, use `min-w-0 flex-1`.

### 7. Membres — Same filter issues on profiles page
- **File**: `src/app/[locale]/profiles/page.tsx:77-120`
- **Issue**: Identical filter control pattern — same 32px touch targets and fixed widths.
- **Fix priority**: Same fixes as membres page.

### 8. Membres detail — Block / Report buttons: ~24px tap height
- **File**: `src/app/[locale]/membres/[id]/page.tsx:140-151`
- **Issue**: `px-3 py-1.5 text-[11px]` = ~24px effective tap height. Far below 44px.
- **Fix priority**: `min-h-[44px] min-w-[44px] py-2.5 px-4`.

### 9. Profiles detail — Block / Report buttons: same ~24px issue
- **File**: `src/app/[locale]/profiles/[id]/page.tsx:180-188`
- **Issue**: `text-xs` inline buttons, no explicit min-height. ~24-28px tap height.
- **Fix priority**: Same as membres detail.

### 10. AuthModal — Close button: 32×32px
- **File**: `src/components/auth/AuthModal.tsx:123-129`
- **Issue**: `w-8 h-8` = 32×32px. Below 44px minimum. Positioned at `top-5 right-5`.
- **Fix priority**: `w-11 h-11` (44×44px).

### 11. AuthModal — Tab toggle buttons: ~32px tap height
- **File**: `src/components/auth/AuthModal.tsx:135-156`
- **Issue**: `py-2.5 text-sm` = ~36px. Just below 44px. These are primary navigation for the modal.
- **Fix priority**: `min-h-[44px]`.

### 12. Auth Register — Checkboxes: 20×20px native, no expanded tap area
- **File**: `src/app/[locale]/auth/register/page.tsx:248-278`
- **Issue**: Custom checkbox `w-5 h-5` = 20×20px. The `<label>` wraps the input but only `space-x-3` provides limited padding. Real tap target is ~28-30px.
- **Fix priority**: Add `min-h-[44px]` to labels or use invisible padding expansion.

### 13. Dashboard profile edit — Photo upload buttons: 80×80px but placeholders
- **File**: `src/app/[locale]/dashboard/profile/page.tsx:152-156`
- **Issue**: `w-20 h-20` = 80px, above 44px minimum. But only one is interactive; two are `cursor-default`. Minor but confusing.
- **Fix priority**: Make all three the same visual style, or hide the placeholder-only ones.

### 14. Messages — Error/login page uses `bg-black` not design system background
- **File**: `src/app/[locale]/messages/page.tsx:87-95`
- **Issue**: `min-h-screen bg-black` — plain black, no gradient, no texture overlay. Feels like an unstyled page vs. the rich dashboard backgrounds.
- **Fix priority**: Use `emb-page` or design-token background.

### 15. Onboarding — Logo link: 36×36px, below 44px
- **File**: `src/app/[locale]/onboarding/page.tsx:236-237`
- **Issue**: `w-9 h-9` = 36×36px logo click target. Below 44px minimum.
- **Fix priority**: `w-11 h-11` (44×44).

### 16. AppShell — Mobile hamburger: 40×40px
- **File**: `src/components/layout/AppShell.tsx:40-41`
- **Issue**: `w-10 h-10` = 40×40px. Below 44px minimum.
- **Fix priority**: `w-11 h-11` (44×44).

### 17. Salons / Forum thread — Input font-size 16px set correctly (good), but send button no explicit min-height
- **File**: `src/app/[locale]/salons/[id]/page.tsx:53-54` and `src/app/[locale]/forum/[id]/page.tsx:45-46`
- **Issue**: Input has `fontSize:"16px"` ✓ (prevents iOS zoom). But send button `px-5 py-3` = ~44px, borderline. No explicit `min-h-[44px]`.
- **Fix priority**: Add `min-h-[44px]` to send buttons.

### 18. Navbar — Mobile menu overlay: no safe-area-inset-bottom
- **File**: `src/components/layout/Navbar.tsx:124-160`
- **Issue**: Fixed `inset-0` overlay with `h-full justify-center`. On notched iPhones, content sits behind the home indicator. No `pb-safe` or `env(safe-area-inset-bottom)`.
- **Fix priority**: Add `pb-safe` class or explicit safe-area padding to the inner flex container.

---

## P1 — Ugly / Inconsistent

These issues create visual inconsistency, degrade the premium feel, or deviate from the design system. Not functionally broken but damages brand quality.

### 19. Dashboard profile edit — H1 uses hardcoded `fontFamily: "Arial, sans-serif"`
- **File**: `src/app/[locale]/dashboard/profile/page.tsx:73`
- **Issue**: `style={{ fontFamily: "Arial, sans-serif" }}` — should be `font-serif` (Georgia) per design system. All other pages use serif for h1.
- **Fix priority**: Change to `font-serif` class.

### 20. Dashboard profile edit — Submit button uses cyan/indigo gradient outside design system
- **File**: `src/app/[locale]/dashboard/profile/page.tsx:163-165`
- **Issue**: `linear-gradient(135deg, #06B6D4, #6366F1)` — cyan-to-indigo. Design system uses amber/coral/ember palette.
- **Fix priority**: Use `#d4a574` (ember) or the `emb-button-primary` gradient.

### 21. Dashboard profile edit — Focus borders use `cyan-400` not design system amber
- **File**: `src/app/[locale]/dashboard/profile/page.tsx:101,106,111,116,130,143`
- **Issue**: All input/select/textarea focus states use `focus:border-cyan-400/50`. Design system uses `#d4a574` (amber/ember) for focus.
- **Fix priority**: Replace with `focus:border-[#d4a574]/40`.

### 22. Messages — Multiple elements use cyan/indigo gradient outside design system
- **File**: `src/app/[locale]/messages/page.tsx:92-93,109,136-137`
- **Issue**: Error page CTA, "Voir les membres" link, and send button all use `linear-gradient(135deg, #06B6D4, #6366F1)`.
- **Fix priority**: Use `#d4a574` or `#ff1f5a → #ff5e36` gradient consistent with the brand.

### 23. Membres detail — Message button uses cyan/indigo gradient
- **File**: `src/app/[locale]/membres/[id]/page.tsx:108-109`
- **Issue**: Same cyan/indigo gradient for the primary action button.
- **Fix priority**: Use brand gradient.

### 24. Messages — Chat bubbles use cyan/indigo for own messages
- **File**: `src/app/[locale]/messages/page.tsx:158-162`
- **Issue**: Own message bubble uses `from-cyan-500/30 to-indigo-500/20` instead of amber/coral.
- **Fix priority**: Use `from-[#d4a574]/20 to-[#ff5e36]/10` consistent with design.

### 25. Competing design systems — 4 different token systems in use
- **Files**: Multiple across the codebase
- **Issue**: 
  1. `.embir2100` custom properties (landing-2100.css): `--e21-void`, `--e21-bone`, `--e21-ember`, `--e21-coral`
  2. `--eb-*` tokens (embir-tokens.css): `--eb-bg-base`, `--eb-accent`, `--eb-font-display`
  3. `--color-premium-*` variables (globals.css): `--color-premium-dark`, `--color-premium-rose`
  4. Tailwind inline colors: `#0a0614`, `#d4a574`, `#ff5e36`, `#ff1f5a` hardcoded
- **Pages using which system**:
  - Dashboard: inline colors only (no tokens)
  - Membres/Profiles: `--color-premium-*` + inline
  - Forum/Favoris/Salons/Paramètres/Notifications: `--eb-*` tokens
  - SEO/landing pages: `emb-page` class + inline
  - Evenements: `emb-page` + inline
- **Fix priority**: Standardize on one system. Recommend `--eb-*` tokens for all connected pages, `.embir2100` for landing pages.

### 26. Dashboard — Entire page uses hardcoded inline backgrounds with no design tokens
- **File**: `src/app/[locale]/dashboard/page.tsx:237-268`
- **Issue**: Background is `radial-gradient(ellipse at 50% 15%, #0f0718 0%, #080212 50%, #04000a 100%)` — a custom gradient different from `--eb-bg-base` (`#0a0614`). Orbs are hardcoded inline `style` on divs.
- **Fix priority**: Use `--eb-bg-base` or an `emb-page` variant, move orb effects to CSS classes.

### 27. Dashboard — Toast notification: hardcoded gradient background
- **File**: `src/app/[locale]/dashboard/page.tsx:573`
- **Issue**: Toast uses `bg-[#0a0614]/90` + border `#d4a574]/30`. Not using any design token class.
- **Fix priority**: Extract to CSS class using tokens.

### 28. Membres page — Hardcoded header gradient different from design system
- **File**: `src/app/[locale]/membres/page.tsx:55-57`
- **Issue**: Header h1 uses `#E2E8F0 55%, #ff5e36 82%, #ffa333 100%` gradient with `font-extrabold`. Profiles page uses `#F5F5F5 60%, var(--color-premium-purple) 80%, var(--color-premium-rose) 100%`.
- **Fix priority**: Standardize header gradients. Use `--eb-accent` → `--eb-copper` gradient.

### 29. Dashboard — Greeting uses hardcoded gradient different from design
- **File**: `src/app/[locale]/dashboard/page.tsx:280`
- **Issue**: Name gradient: `#ff1f5a via #ff5e36 to #d4a574`. The standard gradient order is usually amber-first. But this is a minor style choice.
- **Fix priority**: Align with one gradient direction across all pages.

### 30. Footer — Link touch targets borderline at 390px
- **File**: `src/components/layout/Footer.tsx:38-46,61-70`
- **Issue**: Footer link `py-2.5 text-sm` in a 2-column mobile grid. Effective tap area ~36px. Two columns at 390px with `border-b` dividers makes each column ~180px wide.
- **Fix priority**: `min-h-[44px]` on footer links.

### 31. Evenements — Top padding `pt-28` is very aggressive on 390px
- **File**: `src/app/[locale]/evenements/page.tsx:49`
- **Issue**: `pt-28` = 112px top padding. On 390px viewport, this pushes the hero content significantly down. The navbar is `h-20` (80px) on desktop / `h-16` (64px) on mobile. 112px is almost double the navbar height.
- **Fix priority**: `pt-24` (96px) or `pt-20` (80px) on mobile via responsive class.

### 32. SEO hub pages — `pt-32` (128px) on free-dating-app and freemium
- **File**: `src/app/[locale]/free-dating-app/page.tsx:180`, `src/app/[locale]/freemium/page.tsx:186`
- **Issue**: `pt-32` = 128px top padding. At 390px, this pushes ~33% of the viewport as empty space above content.
- **Fix priority**: `pt-28 sm:pt-32` or similar mobile adjustment.

### 33. Blog page — `py-20` section padding with `text-4xl md:text-6xl` heading
- **File**: `src/app/[locale]/blog/page.tsx:27-29`
- **Issue**: `text-4xl` (36px) on mobile for h1. The `text-xl` (20px) subtitle. Much smaller than other SEO pages which use `text-5xl`. Inconsistent.
- **Fix priority**: Use same heading scale as other SEO pages (`text-5xl sm:text-6xl`).

### 34. Decouvrir — ProfileCard uses white Like button (contrast inversion)
- **File**: `src/app/[locale]/decouvrir/page.tsx:64-69`
- **Issue**: Like button uses `bg-white text-black` — inverted from the dark theme norm. While accessible, it's the only white button in the app and breaks visual consistency.
- **Fix priority**: Use brand gradient button.

### 35. Decouvrir — "Start over" button uses different border style
- **File**: `src/app/[locale]/decouvrir/page.tsx:130`
- **Issue**: `border-white/20 bg-white/[0.04]` — a third button style not matching emb-button-secondary or emb-btn-outline.
- **Fix priority**: Use `.emb-btn-outline` or `.emb-button-secondary`.

### 36. Premium — TiltCard class `.emb-card` potentially conflicted
- **File**: `src/app/[locale]/premium/page.tsx:57`
- **Issue**: `.emb-card` is defined twice in `globals.css` (lines 173-185 and 312-322). The second definition overrides the first. The hover effect uses `translateY(-3px)` vs `translateY(-2px)`.
- **Fix priority**: Consolidate `.emb-card` into one definition.

### 37. Onboarding — Step labels `text-[10px]` unreadable on small screens
- **File**: `src/app/[locale]/onboarding/page.tsx:249`
- **Issue**: Progress bar labels at `text-[10px]` with 7 items at `gap-1`. At 390px with `max-w-lg mx-auto`, the 7 labels at 10px each need ~70px minimum. At `gap-1`, total width ~70+ chars × 5px ≈ 350px. It fits but is very tight and unreadable.
- **Fix priority**: `text-[11px]` minimum, or abbreviate labels on mobile.

### 38. Dashboard — Loading state uses hardcoded colors, not design system
- **File**: `src/app/[locale]/dashboard/page.tsx:216-231`
- **Issue**: Spinner uses `border-[#ff5e36]/20 border-t-[#ff5e36]`. Loading text uses `text-white/20`. Background uses inline gradient.
- **Fix priority**: Use design token classes.

### 39. AuthModal — Checkboxes use native `accent-[#d4a574]` which has poor iOS support
- **File**: `src/components/auth/AuthModal.tsx:253,266`
- **Issue**: `accent-[#d4a574]` on native checkboxes. iOS Safari does not fully support `accent-color` for checkboxes. The Auth Register page uses a custom checkbox implementation which works better.
- **Fix priority**: Replace with custom checkbox implementation (as in auth/register/page.tsx).

### 40. Rencontre city pages — CTA button row collapses to column but buttons don't go full-width
- **File**: `src/app/[locale]/rencontre/paris/page.tsx:32-35`
- **Issue**: Two inline CTA buttons side by side. At 390px, `flex gap-4` with two `px-8 py-4` buttons (each ~160px content width + padding). They may overflow or wrap awkwardly. No explicit `flex-col sm:flex-row` or `w-full` mobile handling.
- **Fix priority**: Add `flex-col sm:flex-row` with `w-full sm:w-auto` on mobile.

---

## P2 — Nice-to-have

These are polish issues that improve the experience but aren't critical.

### 41. Dashboard — Filter "Je cherche" label hidden on mobile
- **File**: `src/app/[locale]/dashboard/page.tsx:313`
- **Issue**: `hidden sm:inline` on the filter label. At 390px there's no label — just 7 filter pills with no context.
- **Fix priority**: Show a shorter label or use `aria-label` on filter group.

### 42. Messages — Translate button text: `text-[10px]` very small
- **File**: `src/app/[locale]/messages/page.tsx:169`
- **Issue**: "🌐 Traduire" at 10px is barely readable on mobile. Below WCAG minimum for non-decorative text.
- **Fix priority**: Minimum `text-[11px]` or `text-xs`.

### 43. Messages — Timestamp `text-[10px]` same issue
- **File**: `src/app/[locale]/messages/page.tsx:181`
- **Issue**: Message timestamps at 10px — borderline readable.
- **Fix priority**: `text-[11px]` minimum.

### 44. Membres card — "Voir le profil" text at `text-[11px]`
- **File**: `src/app/[locale]/membres/page.tsx:239-242`
- **Issue**: CTA text at 11px is below recommended minimum for interactive text.
- **Fix priority**: `text-xs` (12px) minimum.

### 45. Missing focus-visible states on several interactive elements
- **Files**: `membres/page.tsx`, `profiles/page.tsx`, `dashboard/page.tsx`, `onboarding/page.tsx`
- **Issue**: Many buttons and links use Tailwind's `hover:` pseudo-class but lack `focus-visible:` outlines. The landing-2100.css has good `focus-visible` rules (`.e21-button:focus-visible`), but Tailwind utility classes often override these.
- **Fix priority**: Add `focus-visible:outline-2 focus-visible:outline-[#d4a574]` to all interactive elements.

### 46. Forum / Salons — Cards use `hover:brightness-110` instead of design system hover
- **File**: `src/app/[locale]/forum/page.tsx:26`, `src/app/[locale]/salons/page.tsx:29`
- **Issue**: `hover:brightness-110` is a generic brightness filter. The design system uses border-color transitions and subtle background changes.
- **Fix priority**: Use border-color transition consistent with `.emb-card` hover patterns.

### 47. Navbar — Desktop nav links `text-sm` at `px-4 py-2` = 44px (OK) but mobile menu links `text-3xl` may overflow
- **File**: `src/components/layout/Navbar.tsx:131-140`
- **Issue**: Mobile menu links are `text-3xl` (30px) with `gap-8` spacing. At 390px viewport height (~844px), 5 links + logo + LanguageSwitcher + 2 auth buttons may not all fit in viewport. No scroll on the overlay container.
- **Fix priority**: Add `overflow-y-auto` to the mobile menu overlay.

### 48. Dashboard — Profile card "initial" letter: `text-5xl` could overflow on tiny cards
- **File**: `src/app/[locale]/dashboard/page.tsx:422`
- **Issue**: `text-5xl font-serif` initial letter in a 40px tall container (`h-40`). At 390px in `grid-cols-1`, cards are full width (~358px content area). The letter center-aligns, no overflow. Minor visual check OK.

### 49. Paramètres / Favoris / Notifications — Skeleton pages with no real controls
- **Files**: `src/app/[locale]/parametres/page.tsx`, `src/app/[locale]/favoris/page.tsx`, `src/app/[locale]/notifications/page.tsx`
- **Issue**: These pages display a loading state and then show a static card with a single sentence. No actual settings/favorites/notifications content exists. When real content is added, these pages will need full mobile audit.
- **Fix priority**: Add a `TODO: complete mobile implementation` note.

### 50. Globals.css — `.emb-card` defined twice with conflicting styles
- **File**: `src/app/globals.css:173-185` and `src/app/globals.css:312-322`
- **Issue**: Two `.emb-card` declarations. Second overrides first. First has `backdrop-filter`, second doesn't. First uses `border-radius: 1.25rem`, second uses `16px`.
- **Fix priority**: Consolidate into one declaration.

### 51. Mobile landscape mode — Evenements hero may collapse poorly
- **File**: `src/app/[locale]/evenements/page.tsx:49`
- **Issue**: `pt-28` plus `py-12 lg:py-20` on hero section = very tall hero on landscape mobile (short viewport). The `orient-landscape` media query in mobile.css only helps `.emb-page section:first-of-type`.
- **Fix priority**: Test + potentially reduce padding on landscape.

### 52. U/[username] — Share buttons: `h-11 w-11` at 44px (good), but social icons are single Unicode chars
- **File**: `src/app/[locale]/u/[username]/page.tsx:200-227`
- **Issue**: Twitter = `𝕏`, Telegram = `✈`, WhatsApp = `W`, Facebook = `f`. These render differently per platform; "W" and "f" look like plain text not social icons.
- **Fix priority**: Use SVG icons or the actual brand logos.

### 53. Onboarding — Steps 3-6 animation transitions are `x: 30` / `x: -30` which at 390px feels jerky
- **File**: `src/app/[locale]/onboarding/page.tsx:271-275`
- **Issue**: `initial={{ opacity: 0, x: 30 }}` and `exit={{ opacity: 0, x: -30 }}`. At 390px the step container is ~358px wide; a 30px slide is ~8% of the container. Fine for functionality but could be smoother.
- **Fix priority**: Consider `x: 20` on mobile.

---

## Design System Coherence Audit

### Current state: 4 competing systems

| System | Location | Used by |
|--------|----------|---------|
| `.embir2100` | `landing-2100.css` | Landing page only |
| `--eb-*` tokens | `embir-tokens.css` | Forum, Salons, Favoris, Paramètres, Notifications |
| `--color-premium-*` | `globals.css` | Membres, Profiles, Premium |
| Inline Tailwind colors | Inline in components | Dashboard, Messages, Onboarding, AuthModal, Auth Register, Decouvrir |

### Recommended target architecture

```
embir-tokens.css (--eb-*)           ← All connected/product pages
  ├── bg-base: #0a0614
  ├── bg-elev-1: #110d1a
  ├── accent: #d4a574
  ├── font-display: "Georgia", serif
  └── font-body: system-ui, sans-serif

landing-2100.css (.embir2100)       ← Landing/marketing pages only
  └── Separate visual identity

mobile.css                           ← Mobile-specific overrides
embir-app-shield.css                 ← Global app page overrides
```

### Color palette reference (design system)

| Token | Value | Usage |
|-------|-------|-------|
| `--eb-bg-base` | `#0a0614` | Page background |
| `--eb-accent` | `#d4a574` | Primary buttons, links, focus |
| `--eb-copper` | `#c4956a` | Secondary accent |
| `--eb-text-primary` | `#f5f0e8` | Main text |
| `--eb-text-secondary` | `#b0a89a` | Subtitle text |
| `--eb-border-soft` | `rgba(255,255,255,0.04)` | Card borders |
| `--embir-spark` (globals) | `#ff1f5a` | CTA gradient start |
| `--embir-ember` (globals) | `#ff5e36` | CTA gradient mid |
| `--embir-amber` (globals) | `#ffa333` | CTA gradient end |

### Colors outside design system (flagged)

| Color | Used in | Should be |
|-------|---------|-----------|
| `#06B6D4` (cyan) | Dashboard edit, Messages CTAs | `#d4a574` |
| `#6366F1` (indigo) | Dashboard edit, Messages CTAs | `#ff5e36` or `#c4956a` |
| `#E2E8F0` | Membres header gradient | `--eb-text-primary` |
| `#F5F5F5` | Profiles header gradient | `--eb-text-primary` |

---

## Page Inventory

Total product/connected pages audited: **38 unique page files + 4 layout components**

| # | Page | File | System | Touch Target Issues | Typo Issues |
|---|------|------|--------|---------------------|-------------|
| 1 | Navbar | `components/layout/Navbar.tsx` | Inline | 3 P0 | — |
| 2 | Footer | `components/layout/Footer.tsx` | Inline | 1 P1 | — |
| 3 | AppShell | `components/layout/AppShell.tsx` | Inline | 1 P0 | — |
| 4 | Dashboard | `app/[locale]/dashboard/page.tsx` | Inline | 2 P0 | 1 P1 |
| 5 | Dashboard Profile Edit | `app/[locale]/dashboard/profile/page.tsx` | Inline | — | 3 P1 (Arial, cyan) |
| 6 | Messages | `app/[locale]/messages/page.tsx` | Inline | — | 4 P1 (cyan palette) |
| 7 | Membres (Discover) | `app/[locale]/membres/page.tsx` | premium-* | 1 P0 | 1 P1 |
| 8 | Membres Detail | `app/[locale]/membres/[id]/page.tsx` | premium-* | 1 P0 | 1 P1 |
| 9 | Profiles (Discover) | `app/[locale]/profiles/page.tsx` | premium-* | 1 P0 | 1 P1 |
| 10 | Profiles Detail | `app/[locale]/profiles/[id]/page.tsx` | premium-* | 1 P0 | — |
| 11 | Événements | `app/[locale]/evenements/page.tsx` | emb-page | — | 1 P1 |
| 12 | Forum | `app/[locale]/forum/page.tsx` | --eb-* | — | 1 P2 |
| 13 | Forum Thread | `app/[locale]/forum/[id]/page.tsx` | --eb-* | — | — |
| 14 | Salons | `app/[locale]/salons/page.tsx` | --eb-* | — | 1 P2 |
| 15 | Salon Detail | `app/[locale]/salons/[id]/page.tsx` | --eb-* | 1 P0 | — |
| 16 | Paramètres | `app/[locale]/parametres/page.tsx` | --eb-* | — | — (skeleton) |
| 17 | Onboarding | `app/[locale]/onboarding/page.tsx` | Inline | 1 P0 | 1 P1 |
| 18 | Auth Register | `app/[locale]/auth/register/page.tsx` | Inline | 1 P0 | — |
| 19 | AuthModal | `components/auth/AuthModal.tsx` | Inline | 2 P0 | 1 P1 |
| 20 | Favoris | `app/[locale]/favoris/page.tsx` | --eb-* | — | — (skeleton) |
| 21 | Notifications | `app/[locale]/notifications/page.tsx` | --eb-* | — | — (skeleton) |
| 22 | Premium | `app/[locale]/premium/page.tsx` | premium-* | — | 1 P1 |
| 23 | Decouvrir | `app/[locale]/decouvrir/page.tsx` | Inline | — | 2 P1 |
| 24 | U/[username] | `app/[locale]/u/[username]/page.tsx` | emb-page | — | 1 P2 |
| 25 | Blog | `app/[locale]/blog/page.tsx` | emb-page | — | 1 P1 |
| 26 | Freemium | `app/[locale]/freemium/page.tsx` | emb-page | — | 1 P1 |
| 27 | Free Dating App | `app/[locale]/free-dating-app/page.tsx` | emb-page | — | 1 P1 |
| 28 | Rencontre/paris | `app/[locale]/rencontre/paris/page.tsx` | emb-page | — | 1 P1 |

---

## Immediate P0 action items (ordered by impact)

1. **Fix all touch targets < 44px** — applies to ~12 locations across Navbar, Dashboard, Membres, AuthModal, AppShell, Onboarding
2. **Fix mobile menu safe-area** — Navbar overlay needs `pb-safe`
3. **Fix Messages page background** — `bg-black` → design system background
4. **Fix filter control touch targets** — Membres and Profiles pages

---

*Generated by Hermes Agent — read-only audit. No code was modified.*
