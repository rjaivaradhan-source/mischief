const CACHE='mischief-v14';
const ASSETS=['./','./index.html','./style.css?v=14','./app.js?v=14','./draft.js?v=14','./meaning.js?v=14','./composition.js?v=14','./catalog.js?v=14','./embed.js?v=14','./motion.mjs?v=14','./motion-math.mjs?v=14','./gif-worker.mjs?v=14','./vendor/gifenc.mjs?v=14','./favicon.svg?v=14','./icon-32.png?v=14','./manifest.webmanifest?v=14','./icon-192.png?v=14','./icon-512.png?v=14'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('mischief-')&&key!==CACHE).map(key=>caches.delete(key))))));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('./index.html')));return;}event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));});

self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
