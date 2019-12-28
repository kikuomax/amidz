'use strict'

const BASE_PATH = '.'
const DATA_SEGMENT = `/data/`

const CORE_CACHE_NAME = 'amidz-core-cache-v1'
const DATA_CACHE_NAME = 'amidz-data-cache-v1'

// DO NOT FORGET to change `CORE_CACHE_NAME`
// whenever files listed in `CORE_FILES_TO_CACHE` are modified.
const CORE_FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/app.js',
  '/images/icons/favicon.png'
].map(p => `${BASE_PATH}${p}`)

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CORE_CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Pre-caching offline page')
        return cache.addAll(CORE_FILES_TO_CACHE)
      }))
})

self.addEventListener('fetch', event => {
  // event.request.url is an absolute URL,
  // so DO NOT include a dot ('.') in DATA_SEGMENT
  if (event.request.url.includes(DATA_SEGMENT)) {
    // data resources should be obtained from the network
    // as long as it is connected.
    console.log('[Service Worker] Fetch (data)', event.request.url)
    event.respondWith(
      caches.open(DATA_CACHE_NAME)
        .then(cache => {
          return fetch(event.request)
            .then(response => {
              if (response.status === 200) {
                if (event.request.url.includes('message.json')) {
                  // dynamically generates a message
                  // if it is hosted on GitHub Pages
                  const data = {
                    message: `It is ${new Date()}, now.`
                  }
                  const options = {
                    type: 'application/json'
                  }
                  const body = new Blob([JSON.stringify(data)], options)
                  const init = {
                    status: 200,
                    statusText: 'OK'
                  }
                  response = new Response(body, init)
                }
                // response needs to be cloned,
                // because it cannot be read twice
                cache.put(event.request.url, response.clone())
              }
              return response
            })
            .catch(() => {
              console.log('[Service Worker] Fetching cached data')
              return cache.match(event.request)
            })
        })
    )
  } else {
    event.respondWith(
      caches.open(CORE_CACHE_NAME)
        .then(cache => {
          return cache.match(event.request)
            .then(response => {
              if (response) {
                return response
              } else {
                return fetch(event.request)
                  .catch(err => {
                    console.error(
                      '[Service Worker] Failed to fetch',
                      event.request.url)
                  })
              }
            })
        })
    )
  }
})

self.addEventListener('activate', event => {
  caches.keys()
    .then(keys => {
      return Promise.all(
        keys.map(key => {
          if ((key !== CORE_CACHE_NAME) && (key !== DATA_CACHE_NAME)) {
            console.log('[ServiceWorker] Removing old cache', key)
            return caches.delete(key)
          }
        }))
    })
})
