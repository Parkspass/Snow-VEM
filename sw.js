/*jshint esversion: 6 */

const staticCacheName = 'site-static-v1'; // Need to change version number ANYTIME we change HTML or CSS files. This is how we get the app to update. The browser needs to detect a change in the service worker.
const assets = [
    '/', // caches all reqeust responses from server
    '/index.html',
    '/app.js',
    '/style.css',
    '/favicon.ico',
    '/icons',
    '/fonts/Roboto/Roboto-Regular.ttf',
    '/fonts/Roboto_Slab/static/RobotoSlab-Regular.ttf',
    '/icons/x.svg',
    '/icons/alert.svg',
    '/icons/hamburger.svg',
    '/icons/bison orange.jpg',
    '/icons/cameraZion.svg',
    '/icons/up_direction.svg',
    '/icons/down_directionsvg',
    '/icons/pwa_icons/640x1136.png',
    '/icons/pwa_icons/750x1294.png',
    '/icons/pwa_icons/1242x2148.png',
    '/icons/pwa_icons/1125x2436.png',
    '/icons/pwa_icons/1536x2048.png',
    '/icons/pwa_icons/1668x2224.png',
    '/icons/pwa_icons/2048x2732.png',
];

// Install service worker
self.addEventListener('install', evt => {
    // This will cache everything we need to work offline
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log("Caching assets...");
            cache.addAll(assets);
        })
    );
});

// Acivate event
self.addEventListener('activate', evt => {
    // This function will delete all the older caches so the app stays up to date
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// Fetch Event
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request); // Returns chache response. If response is not there, it will try to return the event request
        })
    );
    //console.log("Fetch event", evt);
});

/* EXTRA PWA NOTES
- This PWA does not require dynamic caching (strategically only caching pages that the user will use offline)
If you want to do dynamic caching watch video #18 by The Net Ninja on Youtube
- This app also only has one HTML page. If you want a pretty fallback page for the user to see if it can't get the cached page, watch video #19.
- You can also limit cache sizes if you have extensive apps

*/