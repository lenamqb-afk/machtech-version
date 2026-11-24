// Bộ nhớ đệm để app mở được khi mất mạng. Đổi số phiên bản khi cập nhật app.
var CACHE = 'chamcong-v5';
var FILES = ['./index.html', './manifest.json', './icon-180.png', './icon-192.png',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  // Trang chính: lấy bản mới nếu có mạng, không có mạng thì dùng bản đã lưu
  e.respondWith(fetch(e.request).then(function (r) {
    var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); return r;
  }).catch(function () { return caches.match(e.request); }));
});
