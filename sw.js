const CACHE_NAME = 'petromaster-v4';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  // './icon-192.png',  <-- HE BORRADO ESTA LÍNEA QUE CAUSABA EL ERROR
  './icon-512.png',     // Este sí lo tienes
  './Estimacion_Visual.jpg' 
];

// 1. INSTALACIÓN
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Abriendo caché...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // Importante: fuerza la instalación inmediata
  );
});

// 2. ACTIVACIÓN
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma el control de la página inmediatamente
  );
});

// 3. FETCH
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
