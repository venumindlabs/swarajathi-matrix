const CACHE_NAME = 'swarajathi-matrix-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Installs the service worker and caches basic UI template frames
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Cleans up any deprecated cache buckets dynamically
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network-First strategy to ensure live Google Sheets rows sync over the air instantly
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If the network call is successful, return it directly
        return response;
      })
      .catch(() => {
        // Fallback: If offline, try serving files from the local storage cache
        return caches.match(event.request);
      })
  );
});