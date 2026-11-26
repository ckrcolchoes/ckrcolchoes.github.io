/* Service worker da CKR Colchões.
   Páginas e arquivos .js/.json: sempre tenta a internet primeiro (assim preços e estoque novos aparecem logo)
   e só usa a cópia salva se estiver sem internet. Imagens: usa a cópia salva e atualiza em segundo plano. */
const V = "ckr-v1";
const BASE = ["./", "index.html", "produtos.js", "miniaturas.js", "manifest.json", "img/logo-ckr-3d.webp"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(V)
      .then(c => Promise.all(BASE.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;   // GTM, mapa e ViaCEP passam direto
  if (r.mode === "navigate" || /\.(js|json)$/.test(u.pathname)) {
    e.respondWith(
      fetch(r)
        .then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; })
        .catch(() => caches.match(r).then(m => m || caches.match("index.html")))
    );
  } else {
    e.respondWith(
      caches.match(r).then(m => {
        const rede = fetch(r)
          .then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; })
          .catch(() => m);
        return m || rede;
      })
    );
  }
});
