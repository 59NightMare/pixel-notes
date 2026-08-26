const VERSION = 'pixel-notes-v1'
const CORE_CACHE = `${VERSION}-core`
const PAGE_CACHE = `${VERSION}-pages`
const CORE_ASSETS = ['/', '/en/', '/offline/', '/manifest.webmanifest', '/images/icons/icon-192.png']
const MAX_PAGE_ENTRIES = 30

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CORE_CACHE).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => ![CORE_CACHE, PAGE_CACHE].includes(key)).map((key) => caches.delete(key)))).then(() => self.clients.claim()))
})

async function trimPages() {
  const cache = await caches.open(PAGE_CACHE)
  const keys = await cache.keys()
  await Promise.all(keys.slice(0, Math.max(0, keys.length - MAX_PAGE_ENTRIES)).map((request) => cache.delete(request)))
}

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin || url.pathname.startsWith('/admin/')) return

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(async (response) => {
      const cache = await caches.open(PAGE_CACHE)
      cache.put(request, response.clone())
      trimPages()
      return response
    }).catch(async () => (await caches.match(request)) || caches.match('/offline/')))
    return
  }

  if (['style', 'script', 'font', 'image'].includes(request.destination)) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) caches.open(CORE_CACHE).then((cache) => cache.put(request, response.clone()))
      return response
    })))
  }
})
