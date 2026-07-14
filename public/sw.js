// Embir Service Worker — static assets only; navigations always prefer the network.
const CACHE_NAME = 'embir-v2';
const STATIC_ASSETS = [
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/brand/embir-mark.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request));
    return;
  }

  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    STATIC_ASSETS.includes(url.pathname) ||
    /\.(?:avif|gif|ico|jpe?g|png|svg|webp|woff2?)$/i.test(url.pathname);

  if (!isStaticAsset) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then(async (response) => {
          if (response.ok && response.type === 'basic') {
            const clone = response.clone();
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, clone);
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
