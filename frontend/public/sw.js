const CACHE_NAME = 'stocksync-v1';
const OFFLINE_QUEUE_KEY = 'stocksync_offline_queue';

// Assets to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/index.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only intercept API calls for offline queuing
  if (event.request.url.includes('/api/sales/orders') && event.request.method === 'POST') {
    event.respondWith(
      fetch(event.request.clone()).catch(() => {
        // Store in offline queue
        return event.request.json().then((body) => {
          const queue = JSON.parse(self.localStorage?.getItem(OFFLINE_QUEUE_KEY) || '[]');
          queue.push({ url: event.request.url, body, timestamp: Date.now() });
          return new Response(JSON.stringify({ offline: true, queued: true, message: 'Saved offline. Will sync when connected.' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        });
      })
    );
    return;
  }

  // For other requests, try network first, fall back to cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'StockSync Alert', body: 'You have a new notification' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: data.tag || 'stocksync',
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
