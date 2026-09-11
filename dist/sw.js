const CACHE='mischief-v6';
const ASSETS=['./','./index.html','./style.css','./app.js','./meaning.js','./composition.js','./catalog.js','./embed.js','./motion.mjs','./motion-math.mjs','./gif-worker.mjs','./vendor/gifenc.mjs','./favicon.svg','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('mischief-')&&key!==CACHE).map(key=>caches.delete(key))))));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));});
