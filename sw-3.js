// Stock Scanner Pro — Service Worker
// Strategy:
//  - Same-origin app shell (index.html, manifest.json, icons): network-first,
//    falling back to cache when offline. Network-first (not cache-first) is
//    deliberate: this app is updated frequently, and a stale cached index.html
//    would silently serve an old build with old bugs.
//  - Cross-origin requests (Finnhub, Twelve Data, FMP, Polygon, Yahoo,
//    Stooq, CORS proxies, Wikipedia, iShares CSV, etc.): NEVER intercepted
//    or cached. Market data must always be live. Letting the SW touch these
//    risks serving stale prices/quotes or breaking CORS-proxy behavior.

const CACHE_NAME = 'scanner-pro-shell-v1';
const APP_SHELL = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch((e) => console.warn('[SW] precache failed:', e.message))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET requests for our own origin (the app shell).
  // Everything else (all external API/data calls) is left completely
  // untouched — no respondWith() — so it goes straight to the network
  // exactly as if this service worker did not exist.
  if (req.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(req)
      .then((res) => {
        // Refresh the cache with the latest same-origin asset.
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => cached || caches.match('./index.html'))
      )
  );
});
