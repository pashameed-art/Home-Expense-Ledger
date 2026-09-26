const CACHE="home-expense-ledger-v5-6";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(["./","./index.html","./manifest.json"])))})
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())))
self.addEventListener("fetch",e=>e.respondWith(fetch(e.request).then(r=>{if(e.request.method==="GET"){let c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c)).catch(()=>{})}return r}).catch(()=>caches.match(e.request))))
