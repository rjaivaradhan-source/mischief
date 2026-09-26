const CACHE='mischief-v13';
const ASSETS=['./','./index.html','./style.css?v=13','./app.js?v=13','./draft.js?v=13','./meaning.js?v=13','./composition.js?v=13','./catalog.js?v=13','./embed.js?v=13','./motion.mjs?v=13','./motion-math.mjs?v=13','./gif-worker.mjs?v=13','./vendor/gifenc.mjs?v=13','./favicon.svg?v=13','./icon-32.png?v=13','./manifest.webmanifest?v=13','./icon-192.png?v=13','./icon-512.png?v=13'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('mischief-')&&key!==CACHE).map(key=>caches.delete(key))))));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('./index.html')));return;}event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));});

self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
