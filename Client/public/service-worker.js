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
          await cache.add('/script.js')
          console.log('/script.js is cached');
        } else {
          console.warn('/script.js is not cached');
        }

        if (await cache.match('/style.css')) {
          await cache.add('/style.css')
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
