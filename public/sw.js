const CACHE_NAME = 'cryptolive-v2'; // Increment this version
const STATIC_ASSETS = [
  '/favicon.svg',
  '/manifest.json',
];

// 1. Install Phase: Cache static assets and Force Activation
self.addEventListener('install', (event) => {
  // This tells the browser to throw out the old SW and activate this one immediately
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// 2. Activate Phase: Clean up old caches and Take Control
self.addEventListener('activate', (event) => {
  // This tells the SW to control the page immediately, not wait for a reload
  self.clients.claim(); 
  
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
});

// 3. Fetch Phase
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // STRATEGY: Network-First for HTML (The Fix)
  // If it's a page navigation or API call, go to the network first.
  if (event.request.mode === 'navigate' || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return response;
        })
        .catch(() => {
          // Only if Offline, try to serve index.html from cache
          return caches.match('/index.html');
        })
    );
    return;
  }

  // STRATEGY: Cache-First for Assets (JS/CSS/Images)
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});