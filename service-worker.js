const CACHE_NAME = 'psicoapp-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/pages/pacientes.html',
  '/pages/agenda.html',
  '/pages/sessoes.html',
  '/css/style.css',
  '/js/navbar.js',
  '/js/firebase.js',
  '/manifest.json'
];

// Instalação - cache dos arquivos estáticos
self.addEventListener('install', event => {
  console.log('Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação - limpa caches antigos
self.addEventListener('activate', event => {
  console.log('Service Worker ativado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estratégia: Network First para Firebase, Cache First para o resto
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Se for Firebase ou API, usa a rede (não mexe no cache)
  if (url.hostname.includes('firebase') || 
      url.hostname.includes('googleapis') ||
      url.hostname.includes('gstatic.com')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Para arquivos do app, usa cache primeiro
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});