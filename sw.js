/* Offline support: network first, fall back to the last copy seen. */
var CACHE="cec-v1";
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"])}).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==CACHE}).map(function(n){return caches.delete(n)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch",function(e){
  var r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin||r.headers.has("range"))return;
  e.respondWith(fetch(r).then(function(res){
    if(res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)})}
    return res;
  }).catch(function(){return caches.match(r).then(function(m){return m||caches.match("index.html")})}));
});
