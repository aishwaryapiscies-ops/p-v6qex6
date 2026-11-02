// Offline cache for the trip companion. VERSION changes on every rebuild, so phones fetch the new
// copy the next time they're online and keep working from the cached one when they're not.
// Photos (ph/*.bin) are named by content, so an update reuses the ones already on the phone.
const VERSION = "83f293fd31";
const CORE = ["./", "index.html", "app.css", "app.js", "data.bin", "manifest.webmanifest", "icon-180.png", "icon-512.png"];
const PHOTOS = ["ph/02e4f0d2f6.bin", "ph/054e7b3faf.bin", "ph/05762c2056.bin", "ph/0764fb02d4.bin", "ph/0a3562f758.bin", "ph/0bb969b02f.bin", "ph/0f65a01b75.bin", "ph/11247388f6.bin", "ph/11878ee09d.bin", "ph/13082bc2ea.bin", "ph/1865a5ca69.bin", "ph/1d622785af.bin", "ph/1e16ce3584.bin", "ph/1f03d3cda7.bin", "ph/322dcbaa2b.bin", "ph/34b8bf6f10.bin", "ph/390720d1c0.bin", "ph/3b8755e7d8.bin", "ph/3e7cfe6cb3.bin", "ph/3fc409517c.bin", "ph/4d4cbb1e0e.bin", "ph/4ff4f50f73.bin", "ph/513672195b.bin", "ph/51b4c45b9b.bin", "ph/521e7b6916.bin", "ph/55b8756ffe.bin", "ph/5ab0ddad3a.bin", "ph/5b4e593337.bin", "ph/600f1e953e.bin", "ph/60a825bb3b.bin", "ph/60aa461fb7.bin", "ph/6230d9caba.bin", "ph/6527a228d7.bin", "ph/6f137eedbd.bin", "ph/71f8e3955b.bin", "ph/770ab80d6b.bin", "ph/7711e9d9ff.bin", "ph/772c79c123.bin", "ph/7a87204753.bin", "ph/7af6fd4689.bin", "ph/7c24f2d606.bin", "ph/7c30e68a50.bin", "ph/820c0f1cf1.bin", "ph/838ddda8d5.bin", "ph/84d76e9997.bin", "ph/859af557ba.bin", "ph/8df0f15a27.bin", "ph/945b6cdb52.bin", "ph/955188296d.bin", "ph/9780760e58.bin", "ph/9a0b17a4d7.bin", "ph/9d627a5677.bin", "ph/9e88f3c6a6.bin", "ph/aa779f4357.bin", "ph/aa8e2e911f.bin", "ph/ac04931d08.bin", "ph/af7b03dd45.bin", "ph/ba6238db36.bin", "ph/bbc44720af.bin", "ph/c1a3533884.bin", "ph/c3863dfe5e.bin", "ph/ccd26fbd45.bin", "ph/d2f02fc4a2.bin", "ph/d51c5d88da.bin", "ph/da50daa82d.bin", "ph/dca9009da0.bin", "ph/dd9d2ab8ef.bin", "ph/de9f4c78fe.bin", "ph/e1f96016b2.bin", "ph/e5a570eba0.bin", "ph/e5b541c414.bin", "ph/e8d8ba8487.bin", "ph/ea751a6f93.bin", "ph/eaed6fdcb5.bin", "ph/eccdf80a5e.bin", "ph/edaaa45506.bin", "ph/f090e350a0.bin", "ph/f3ccfb88bb.bin", "ph/f470d4b30c.bin", "ph/f48dbf4ba4.bin", "ph/f749418c01.bin", "ph/f9429a74cf.bin"];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(CORE.map((u) => new Request(u, { cache: "reload" })));
    for (const u of PHOTOS) {
      const have = await caches.match(u, { ignoreSearch: true });
      if (have) await c.put(u, have); else await c.add(u);
    }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(caches.match("index.html").then((r) => r || fetch(req)));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((r) => r || fetch(req)));
});
