const CACHE = 'cobano-cloud-v2.3.0';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
const EXTERNAL = [
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/shpjs@4.0.4/dist/shp.min.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    await Promise.all(EXTERNAL.map(async url => {
      try {
        const response = await fetch(url, {mode: 'no-cors'});
        if (response && (response.ok || response.type === 'opaque')) await cache.put(url, response);
      } catch (_) { /* La app principal también puede abrir con algunos módulos sin conexión. */ }
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('cobano-cloud-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(event.request) || await cache.match(url.href);
      if (cached) return cached;
      try {
        const response = await fetch(event.request);
        if (response && (response.ok || response.type === 'opaque')) cache.put(event.request, response.clone()).catch(() => {});
        return response;
      } catch (_) {
        return cached || Response.error();
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(event.request, {ignoreSearch: true});
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response && response.ok) cache.put(event.request, response.clone()).catch(() => {});
      return response;
    } catch (_) {
      return await cache.match('./index.html') || Response.error();
    }
  })());
});
