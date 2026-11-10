// CatchMail Service Worker (Permet l'installation PWA sur Windows, Android et iOS)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => new Response('Hors-ligne (CatchMail)'))
  );
});

