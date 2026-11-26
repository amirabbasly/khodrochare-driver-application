const CACHE_NAME = "khodro-chare-fleet-v9";
const CACHE_PREFIX = "khodro-chare-fleet-v";
const APP_SHELL = ["/offline.html", "/khodrochare-wordmark.png", "/khodrochare-symbol.png", "/fonts/Vazir.woff2", "/fonts/Vazir-Medium.woff2", "/fonts/Vazir-Bold.woff2"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(() => undefined).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = (await caches.keys()).filter(key => key.startsWith(CACHE_PREFIX));
    // Keep the preceding build's hashed chunks for tabs still using that build.
    const previous = keys.filter(key => key !== CACHE_NAME).sort((a,b) => Number(b.slice(CACHE_PREFIX.length))-Number(a.slice(CACHE_PREFIX.length)))[0];
    await Promise.all(keys.filter(key => key !== CACHE_NAME && key !== previous).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  function remember(response) {
    if (response.ok && response.type !== 'opaque') {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => undefined));
    }
    return response;
  }
  if (request.mode === "navigate") {
    event.respondWith(fetch(request, {cache:'no-store'}).then(response => {
      if (response.headers.get('content-type')?.includes('text/html')) remember(response);
      return response;
    }).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      return (await cache.match(request, {ignoreSearch:true})) || (await cache.match('/offline.html')) || Response.error();
    }));
    return;
  }
  if (url.pathname.startsWith('/_next/static/')) {
    // Content-hashed Next assets are immutable; warm launches need no network trip.
    event.respondWith((async () => (await caches.match(request)) || remember(await fetch(request)))());
    return;
  }
  if (!["image", "font", "style", "script"].includes(request.destination)) return;
  event.respondWith(fetch(request).then(remember).catch(async () => (await caches.match(request)) || Response.error()));
});
