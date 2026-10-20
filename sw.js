// يفتح التطبيق حتى لو النت ضعيف: يحاول الشبكة أولاً (فتصل التحديثات) ثم يرجع للنسخة المحفوظة.
const V='ahh-full-v1';
const CORE=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  e.respondWith(
    fetch(r).then(res=>{const copy=res.clone();caches.open(V).then(c=>c.put(r,copy)).catch(()=>{});return res;})
      .catch(()=>caches.match(r).then(m=>m||caches.match('index.html')))
  );
});
