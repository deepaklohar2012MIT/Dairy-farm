// ऐप का कैशे (Cache) नाम और वर्ज़न
const CACHE_NAME = 'lohar-dairy-v1.6';

// वो फाइलें जो इंटरनेट बंद होने पर भी काम करनी चाहिए (Offline Support)
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './applogo.png',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// 1. Service Worker को इंस्टॉल करना और फाइलों को सेव (Cache) करना
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Lohar Dairy Farm: Files Cached Successfully!');
                return cache.addAll(urlsToCache);
            })
    );
});

// 2. जब यूज़र ऐप चलाए, तो उसे सेव की हुई (Offline) फाइलें देना
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // अगर फाइल कैशे में है तो वही दें, नहीं तो इंटरनेट से लाएं
                return response || fetch(event.request);
            })
    );
});

// 3. अगर हम भविष्य में ऐप अपडेट करें, तो पुराना कैशे डिलीट करके नया लोड करना
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});