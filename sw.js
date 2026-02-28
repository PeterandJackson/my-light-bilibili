const CACHE_NAME = 'light-bilibili-v5';

// 安装时缓存首页
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => 
            cache.addAll(['/','/index.html'])
        )
    );
    self.skipWaiting();
});

// 激活时清理旧缓存
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
});

// Stale-While-Revalidate 策略（第二次打开几乎秒进）
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(cachedResponse => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
                return cachedResponse || fetchPromise;
            });
        })
    );
});
