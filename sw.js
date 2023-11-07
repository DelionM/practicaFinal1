const CACHE_NAME = "Recursos";

self.addEventListener("install", (event) => {
    caches.delete(CACHE_NAME);
    const recursos = caches.open(CACHE_NAME).then((cache) => {
        cache.add("/");
        cache.add(".vscode/settings.json");
        cache.add("assets/imgs/default.webp");
        cache.add("app.js");
        cache.add("base.js");
        cache.add("index.html");
        cache.add("pouchdb-nightly.js");
        cache.add("style.css");
    });



    event.waitUntil(recursos);
  });

  self.addEventListener("fetch", (event) => {
    // Estrategia 3 abajo 
    const respuesta = fetch(event.request).then((newResp) => {
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, newResp);
      });

      return newResp.clone();      
    }).catch(err =>{
      return caches.match(event.request);
    })
    event.respondWith(respuesta);
});
