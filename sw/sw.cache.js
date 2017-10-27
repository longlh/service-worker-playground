const CACHE_NAME = 'v1';

self.addEventListener('install', function(event) {
  console.debug('clearing cache...');

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          console.debug('deleting key...', key);
          return caches.delete(key);
        })
      );
    })
  );
});

this.addEventListener('fetch', event => {
  let { url } = event.request;

  if (url.indexOf('.jpg') === -1) {
    return event.respondWith(fetch(url));
  }

  event.respondWith(
    caches.open(CACHE_NAME)
      .then(cache => {
        // check in cache
        return cache.match(url)
          .then(response => {
            if (response) {
              console.debug(`cache hit ${url}`);

              return response;
            }

            console.debug(`cache miss ${url}`);

            return fetch(event.request.clone())
              .then(response => {
                console.debug(`from network ${url} ${response.status}`);

                if (response.ok) {
                  console.debug(`put to cache ${url}`);
                  cache.put(url, response.clone());
                }

                return response;
              });
          });
      })
  );
});
