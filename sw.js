const CACHE_NAME = 'petromaster-v7'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png'
  ];

// 1. INSTALACIÓN
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Abriendo caché y guardando archivos...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // Fuerza a que este SW activo sea el que manda
  );
});

// 2. ACTIVACIÓN (Limpieza de cachés viejas)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Borrando caché antigua:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma control inmediato de la página
  );
});

// 3. INTERCEPTOR DE RED (Estrategia: Cache First, falling back to Network)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si está en caché, úsalo (Offline)
        if (response) {
          return response;
        }
        // Si no, búscalo en internet
        return fetch(event.request);
      })
  );
});
