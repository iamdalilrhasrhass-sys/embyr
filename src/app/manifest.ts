import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Embir — Shared intentions, reciprocal connections',
    short_name: 'Embir',
    description: 'An inclusive connection app built around reciprocal intentions.',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#09060c',
    theme_color: '#09060c',
    categories: ['social', 'dating', 'lifestyle'],
    lang: 'en',
    dir: 'ltr',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Discover', url: '/decouvrir', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
      { name: 'My Profile', url: '/dashboard', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
      { name: 'Invite Friends', url: '/referral', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
    ],
  };
}
