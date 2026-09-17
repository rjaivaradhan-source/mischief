const CACHE='mischief-v12';
const ASSETS=['./','./index.html','./style.css?v=12','./app.js?v=12','./draft.js?v=12','./meaning.js?v=12','./composition.js?v=12','./catalog.js?v=12','./embed.js?v=12','./motion.mjs?v=12','./motion-math.mjs?v=12','./gif-worker.mjs?v=12','./vendor/gifenc.mjs?v=12','./favicon.svg?v=12','./icon-32.png?v=12','./manifest.webmanifest?v=12','./icon-192.png?v=12','./icon-512.png?v=12'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('mischief-')&&key!==CACHE).map(key=>caches.delete(key))))));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('./index.html')));return;}event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));});

self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
