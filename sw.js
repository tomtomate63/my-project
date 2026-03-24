// sw.js - Service Worker pour Borlette Pro
const CACHE_NAME = 'borlette-v1';
const urlsToCache = [
  '/',
  '/agent-app/index.html',
  '/agent-app/script.js',
  '/agent-app/style.css',
  '/admin-app/index.html',
  '/admin-app/script.js',
  '/admin-app/style.css',
  '/manifest.json',
  '/icon/icon-100.png'
];

// Installation
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourne la réponse du cache si trouvée
        if (response) {
          return response;
        }
        // Sinon, va chercher sur le réseau
        return fetch(event.request);
      })
  );
});

// Mise à jour - supprime l'ancien cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});