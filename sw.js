const cacheName = "v1";
const cacheFiles = [
    "./",
    "./index.html",
];

self.addEventListener("install", (event) => {
    console.log("[service worker] installed");

    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                console.log("[service worker] caching cacheFiles");
                return cache.addAll(cacheFiles);
            })
    );
});

self.addEventListener("activate", (event) => {
    console.log("[service worker] activated");

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return cacheNames.map((name) => {
                    if (name !== cacheName) {
                        caches.delete(name);
                    }
                });
            })
    )
});

// in each fetch event, check if the request is in cache,
// if not, make a request to the resource, add it to the cache and return it
self.addEventListener("fetch", (event) => {

    event.respondWith(
        caches.open(cacheName)
            .then(cache => {
                return cache.match(event.request)
                    .then(result => {
                        return result || fetch(event.request)
                            .then(response => {
                                const responseCopy = response.clone();
                                cache.put(event.request, responseCopy);
                                return response;
                            })
                    })
            })
    );
});

