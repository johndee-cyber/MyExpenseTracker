const CACHE_NAME = "expense-tracker-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icon.svg"
];

// Install service worker
self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

// Activate service worker
self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );

    self.clients.claim();
});

// Handle requests
self.addEventListener("fetch", function(event) {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then(function(cachedFile) {
            return cachedFile || fetch(event.request);
        })
    );
});