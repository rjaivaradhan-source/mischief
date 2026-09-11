const CACHE='mischief-v10';
const ASSETS=['./','./index.html','./style.css?v=10','./app.js?v=10','./meaning.js?v=10','./composition.js?v=10','./catalog.js?v=10','./embed.js?v=10','./motion.mjs?v=10','./motion-math.mjs?v=10','./gif-worker.mjs?v=10','./vendor/gifenc.mjs?v=10','./favicon.svg','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('mischief-')&&key!==CACHE).map(key=>caches.delete(key))))));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('./index.html')));return;}event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));});

self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
