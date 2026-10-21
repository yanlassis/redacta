// Service worker do Redacta: deixa o app instalável e utilizável offline com o que já foi visitado.
// Ao mudar a lista de arquivos ou a estratégia, incremente a versão para descartar caches antigos.
const VERSAO = 'redacta-v1';
const CACHE_APP = `${VERSAO}-app`;
const CACHE_DADOS = `${VERSAO}-dados`;

const ARQUIVOS_APP = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/favicon.svg',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_APP).then(cache => cache.addAll(ARQUIVOS_APP)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(nomes => Promise.all(nomes.filter(n => !n.startsWith(VERSAO)).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Rede primeiro; sem conexão, usa a última resposta guardada
async function redePrimeiro(request, cacheNome, fallbackUrl) {
  const cache = await caches.open(cacheNome);
  try {
    const resposta = await fetch(request);
    if (resposta.ok) cache.put(request, resposta.clone());
    return resposta;
  } catch (erro) {
    const salva = await cache.match(request) || (fallbackUrl && await cache.match(fallbackUrl));
    if (salva) return salva;
    throw erro;
  }
}

// Responde do cache na hora e atualiza em segundo plano
async function cacheEAtualiza(request, cacheNome) {
  const cache = await caches.open(cacheNome);
  const salva = await cache.match(request);
  const atualizacao = fetch(request)
    .then(resposta => {
      if (resposta.ok || resposta.type === 'opaque') cache.put(request, resposta.clone());
      return resposta;
    })
    .catch(() => salva);
  return salva || atualizacao;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Fontes do Google: mudam raramente
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheEAtualiza(request, CACHE_APP));
    return;
  }

  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(redePrimeiro(request, CACHE_APP, '/index.html'));
    return;
  }

  // Favoritos são por usuário e já ficam no localStorage; não vale guardar aqui
  if (url.pathname.startsWith('/api/favoritos')) return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(redePrimeiro(request, CACHE_DADOS));
    return;
  }

  event.respondWith(cacheEAtualiza(request, CACHE_APP));
});
