const CACHE_NAME = 'medicare-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './css/base.css',
  './css/components.css',
  './css/variables.css',
  './js/app.js',
  './js/pages/ayushman.js',
  './js/pages/booking.js',
  './js/pages/dashboard.js',
  './js/pages/emergency.js',
  './js/pages/login.js',
  './js/pages/notifications.js',
  './js/pages/profile.js',
  './js/pages/register.js',
  './js/pages/vault.js',
  './js/services/auth.service.js',
  './js/services/file.service.js',
  './js/services/firebase.service.js',
  './js/services/geo.service.js',
  './js/services/hospital.service.js',
  './js/services/i18n.service.js',
  './js/services/notification.service.js',
  './js/services/sync.service.js',
  './js/services/whatsapp.service.js',
  './js/utils/error-handler.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
