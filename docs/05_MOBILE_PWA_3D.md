# Embyr — Mobile, PWA & Effets 3D

## Mobile
- `100dvh` sur toutes les hauteurs critiques
- `env(safe-area-inset-bottom)` sur bottom nav
- `min-height: 44px` sur tous les boutons
- `font-size: 16px` minimum sur inputs (anti-zoom iOS)
- Scroll fluide (`-webkit-overflow-scrolling: touch`)
- Viewport `viewport-fit=cover, maximum-scale=1`

## PWA
- Manifest : `/public/manifest.json`
- Icônes : 192x192 + 512x512 (générées)
- theme_color : `#FF5A1F` (braise Embyr)
- background_color : `#0A0B0E` (charbon)
- display : standalone

## Effets 3D
- **Card3DTilt** : `/components/embyr/Card3DTilt.tsx`
  - Transform perspective 900px
  - Touch + mouse support
  - Désactivé si `prefers-reduced-motion`
- **EmberGlow** : `/components/embyr/EmberGlow.tsx`
  - Radial gradient braise pulsant 4s
  - Effet signature Embyr
- **ScrollReveal** : `/components/embyr/ScrollReveal.tsx`
  - IntersectionObserver
  - Opacity 0→1 + translateY 24→0
  - Support staggered delay
