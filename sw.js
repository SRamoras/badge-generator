const CACHE = 'badge-gen-v1';

const SHELL = [
  '/',
  '/index.html',
  '/pages/generate-badges.html',
  '/pages/all-badges.html',
  '/styles/layout.css',
  '/styles/index.css',
  '/styles/generateBadges.css',
  '/styles/allBadges.css',
  '/scripts/layout.js',
  '/scripts/generateBadges.js',
  '/scripts/displayBadges.js',
  '/scripts/webComponents/footer.js',
  '/manifest.json',
  '/icons/icon.svg',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
