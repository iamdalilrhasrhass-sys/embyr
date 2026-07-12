import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Embir — Dating Without Swipe Fatigue',
    short_name: 'Embir',
    description: 'Everything needed to meet someone is free. No credit card required. for every orientation. Verified profiles, immersive universes, no swipe fatigue.',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0a0614',
    theme_color: '#0a0614',
    categories: ['social', 'dating', 'lifestyle'],
    lang: 'en',
    dir: 'ltr',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Discover', url: '/decouvrir', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
      { name: 'My Profile', url: '/dashboard', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
      { name: 'Invite Friends', url: '/referral', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
    ],
  };
}
