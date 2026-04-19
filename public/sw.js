const CACHE_NAME = 'medicare-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/css/base.css',
  '/css/components.css',
  '/css/variables.css',
  '/js/app.js',
  '/js/pages/ayushman.js',
  '/js/pages/booking.js',
  '/js/pages/dashboard.js',
  '/js/pages/emergency.js',
  '/js/pages/login.js',
  '/js/pages/notifications.js',
  '/js/pages/profile.js',
  '/js/pages/register.js',
  '/js/pages/vault.js',
  '/js/services/auth.service.js',
  '/js/services/file.service.js',
  '/js/services/geo.service.js',
  '/js/services/hospital.service.js',
  '/js/services/i18n.service.js',
  '/js/services/notification.service.js',
  '/js/services/sync.service.js',
  '/js/services/whatsapp.service.js',
  '/js/utils/error-handler.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => caches.match('/index.html'))
  );
});
