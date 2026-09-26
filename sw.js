const CACHE="home-expense-ledger-v5-22";
self.addEventListener("install", event => {
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    const [indexRes, manifestRes]=await Promise.all([
      fetch("./index.html?swv=521",{cache:"no-store"}),
      fetch("./manifest.json?swv=521",{cache:"no-store"})
    ]);
    await cache.put("./index.html",indexRes);
    await cache.put("./manifest.json",manifestRes);
    await cache.put("./",indexRes.clone());
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", event => {
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  const url=new URL(event.request.url);
  if(event.request.method!=="GET" || url.origin!==self.location.origin) return;
  if(event.request.mode==="navigate"){
    event.respondWith((async()=>{
      try{
        const res=await fetch(event.request,{cache:"no-store"});
        const c=await caches.open(CACHE);
        await c.put("./index.html",res.clone());
        return res;
      }catch(e){
        return (await caches.match("./index.html")) || fetch(event.request);
      }
    })());
    return;
  }
  event.respondWith(caches.match(event.request).then(r=>r||fetch(event.request)));
});
