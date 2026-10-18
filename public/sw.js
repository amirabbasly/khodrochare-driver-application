const CACHE_NAME = "khodro-chare-shell-v4";
const APP_SHELL = [
  "/",
  "/register",
  "/home",
  "/offline.html",
  "/khodrochare-3d-logo.webp",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/fonts/Vazir.woff2",
  "/fonts/Vazir-Medium.woff2",
  "/fonts/Vazir-Bold.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request, { ignoreSearch: true });
          return cached || (await caches.match("/offline.html"));
        }),
    );
    return;
  }

  const isStaticAsset = request.destination === "script"
    || request.destination === "style"
    || request.destination === "image"
    || request.destination === "font"
    || url.pathname.startsWith("/_next/static/");

  if (!isStaticAsset) return;

  // Network-first for every asset: a stale cached bundle must never win over a
  // fresh one (mixed old/new chunks break React after deploys and in dev).
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => (await caches.match(request)) || Response.error()),
  );
});
