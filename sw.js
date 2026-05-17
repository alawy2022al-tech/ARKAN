// Service Worker — أركان لمنيف التجارية
const CACHE_NAME = 'arkan-v1.0.0';
const ASSETS = [
  './index_arkan.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js'
];

// تثبيت — تخزين الملفات
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(['./index_arkan.html', './manifest.json']);
    })
  );
  self.skipWaiting();
});

// تفعيل — حذف الكاش القديم
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// الطلبات — من الكاش أولاً، ثم الشبكة
self.addEventListener('fetch', e => {
  // Firebase يشتغل دائماً من الشبكة
  if (e.request.url.includes('firebaseio.com') ||
      e.request.url.includes('firebase') ||
      e.request.url.includes('googleapis')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      });
    }).catch(() => caches.match('./index_arkan.html'))
  );
});
