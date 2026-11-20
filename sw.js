/* Network-first service worker: always serves fresh content when online,
   falls back to the cached copy when offline. Bump VERSION to purge old caches. */
const VERSION = 'v2';
const CACHE = `portfolio-${VERSION}`;
const ASSETS = [
  './',
  'index.html',
  'css/style.css',
  'js/main.js',
  'images/profile.jpg',
  'images/icon-192.png',
  'images/icon-512.png',
  'resume.pdf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;
  event.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy));
        return res;
      })
      .catch(() => caches.match(request).then((r) => r || caches.match('./')))
  );
});
