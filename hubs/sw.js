const CACHE='cen-return-link-fix-20260616-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.json','./data/hubs.json','./assets/maps/return-hub-map.png','./assets/maps/temple-hub-map.png','./assets/maps/preservation-hub-map.png','./assets/maps/law-hub-map.png','./assets/maps/wall-hub-map.png'])))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('./index.html'))));});
