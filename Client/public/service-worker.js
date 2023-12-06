const CACHE_NAME = 'Buegee-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/fonts/Lato-Bold.ttf',
  '/fonts/Lato-Italic.ttf',
  '/fonts/Lato-Light.ttf',
  '/fonts/Lato-Regular.ttf',
  '/js/DragDropTouch.js',
  '/maskable_icon.png',
  '/favicon.ico',
  '/robots.txt',
  '/apple-touch-icon.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/logo.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(urlsToCache);

        if (await cache.match('/script.js')) {
          console.log('/script.js is cached');
        } else {
          console.warn('/script.js is not cached');
        }

        if (await cache.match('/style.css')) {
          console.log('/style.css is cached');
        } else {
          console.warn('/style.css is not cached');
        }

      } catch (error) {
        console.error('Error caching files:', error);
      }
    })
  );
});


// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll(urlsToCache);
//     })
//   );
// });

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('/');
      }
    })
  );
});
