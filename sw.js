// Offline support: the app files are cached on install; fonts and libraries are cached the first time they load.
const V = 'het-8fd9d2cad1';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'firebase-bundle.js', 'lexicon.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k.startsWith('het-')).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (u.origin === location.origin) {
    // App files: network first (to get updates), cache when offline.
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
  } else if (/fonts\.(googleapis|gstatic)\.com|www\.gstatic\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net/.test(u.host)) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const c = res.clone(); caches.open(V + '-ext').then(x => x.put(e.request, c)); return res; })));
  }
});
