/* Library Map service worker: offline support.
   - App files: served from cache instantly, refreshed in the background (so updates arrive on the next open).
   - notice.json is NEVER cached, so a new broadcast notice always shows up.
   - Google Fonts are cached after the first online visit so the design stays identical offline. */
const CACHE = 'library-map-v1';
const SHELL = ['./', './index.html', './css/app.css', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

  if (sameOrigin && url.pathname.endsWith('/notice.json')) return; // always live from the network
  if (!sameOrigin && !isFont) return;                               // WhatsApp links etc. are not touched

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: sameOrigin });
      const network = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);

      if (cached) { network.catch(() => { }); return cached; }
      const res = await network;
      if (res) return res;
      if (req.mode === 'navigate') {
        const fallback = await cache.match('./index.html');
        if (fallback) return fallback;
      }
      return Response.error();
    })
  );
});
