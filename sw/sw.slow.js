const CACHE_NAME = 'v1';
const ACCEPTABLE_LATENCY = 1000;

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
            return new Promise((resolve, reject) => {
              let responded = false;

              if (response) {
                console.debug(`cache hit ${url}, wait for latest response`);

                setTimeout(() => {
                  if (!responded) {
                    console.debug(`response time reaches ${ACCEPTABLE_LATENCY}ms, return old response from cache ${url}`);
                    responded = true;

                    resolve(response);
                  }
                }, ACCEPTABLE_LATENCY);
              }

              console.debug(`cache miss ${url}`);

              fetch(event.request.clone())
                .then(response => {
                  console.debug(`from network ${url} ${response.status}`);

                  if (response.ok) {
                    console.debug(`put to cache ${url}`);
                    cache.put(url, response.clone());
                  }

                  if (!responded) {
                    console.debug(`response time is acceptable, return latest response ${url}`);

                    responded = true;
                    resolve(response);
                  }
                }).catch(reject);
            });
          });
      })
  );
});
