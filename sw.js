const CACHE_NAME = 'sala-interativa-v1.1'';
// Arquivos salvos no dispositivo
const assets = [
  '/',
  'index.html',
  'logica.js',
  'logo.png',
  'manifest.json',
  'https://aframe.io/releases/1.4.0/aframe.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/nipplejs/0.10.0/nipplejs.min.js',
  'videos/video_1.mp4',
  'videos/video_2.mp4',
  'videos/video_3.mp4'
];

// Instalação: Salva os arquivos no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// Ativação: Limpa caches antigos se houver
self.addEventListener('activate', (event) => {
  console.log('Service Worker ok!');
});

// Estratégia de busca: Tenta o cache primeiro, se não tiver, vai na rede
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Avisa usuário, sobre atualização no sistema
navigator.serviceWorker.register('sw.js').then(reg => {
  reg.addEventListener('updatefound', () => {
    const newWorker = reg.installing;
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        console.log('Nova versão disponível! Por favor, recarregue a página.');
        if(confirm("Nova atualização disponível! Deseja carregar agora?")) {
            window.location.reload();
        }
      }
    });
  });
});
