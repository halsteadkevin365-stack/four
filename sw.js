const CACHE_NAME = 'aa-fourth-step-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/app.css',
  './css/print.css',
  './js/bigbook-data.js',
  './js/sound-service.js',
  './js/store.js',
  './js/inventory-forms.js',
  './js/app.js',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch((err) => {
        console.warn('Cache addAll warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((resp) => {
        if (resp && resp.status === 200 && event.request.url.startsWith('http')) {
          const respClone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, respClone);
          });
        }
        return resp;
      }).catch(() => {
        return caches.match('./index.html');
      });
    })
  );
});
