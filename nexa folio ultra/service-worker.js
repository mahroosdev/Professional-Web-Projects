const APP_VERSION = '1.0.5';
const CACHE_NAME = 'nexa-folio-ultra-v' + APP_VERSION;
const STATIC_ASSETS = [
  './index.html',
  './manifest.json',
  './favicon.svg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isHTML = url.pathname.endsWith('.html') || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if (isHTML) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match('./index.html').then(cached => {
          const networkFetch = fetch(event.request).then(response => {
            if (response && response.status === 200) cache.put('./index.html', response.clone());
            return response;
          }).catch(() => cached);
          return cached || networkFetch;
        })
      )
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response && response.status === 200) {
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
      }
      return response;
    }))
  );
});
