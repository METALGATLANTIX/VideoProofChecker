// ════════════════════════════════════════════
// VideoProofChecker - Service Worker
// ════════════════════════════════════════════
const CACHE_NAME = 'videoproof-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// インストール時：必要ファイルをキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// アクティベート時：古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// フェッチ時：キャッシュ優先（オフライン対応）
self.addEventListener('fetch', event => {
  // 動画ファイルはキャッシュしない（容量節約）
  if (event.request.url.match(/\.(mp4|mov|avi|mkv|webm)$/i)) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => caches.match('./index.html'));
    })
  );
});
