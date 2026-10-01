const CACHE='mischief-v15';
const ASSETS=['./special.js?v=15','./special-ui.js?v=15','./special/thinking-king.png','./special/frozen-smile.png','./special/burning-heart.png','./special/loved-up.png','./special/rainy-days.png','./special/fiery-mood.png','./','./index.html','./style.css?v=15','./app.js?v=15','./draft.js?v=15','./meaning.js?v=15','./composition.js?v=15','./catalog.js?v=15','./embed.js?v=15','./motion.mjs?v=15','./motion-math.mjs?v=15','./gif-worker.mjs?v=15','./vendor/gifenc.mjs?v=15','./favicon.svg?v=15','./icon-32.png?v=15','./manifest.webmanifest?v=15','./icon-192.png?v=15','./icon-512.png?v=15'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('mischief-')&&key!==CACHE).map(key=>caches.delete(key))))));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('./index.html')));return;}event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));});

self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
