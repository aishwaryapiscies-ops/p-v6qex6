// Offline cache for the trip companion. VERSION changes on every rebuild, so phones fetch the new
// copy the next time they're online and keep working from the cached one when they're not.
// Photos (ph/*.bin) are named by content: an update reuses the ones already on the phone, and a
// photo that fails to download doesn't block the update (it's fetched and cached when first shown).
const VERSION = "2895feeccc";
const CORE = ["./", "index.html", "app.css", "app.js", "data.bin", "manifest.webmanifest", "icon-180.png", "icon-512.png"];
const PHOTOS = ["ph/02e4f0d2f6-sm-08713d88.bin", "ph/054e7b3faf-md-a5ea4b3b.bin", "ph/054e7b3faf-sm-4b97992d.bin", "ph/05762c2056-sm-00210704.bin", "ph/0764fb02d4-md-7d2575e2.bin", "ph/0764fb02d4-sm-4a173e3b.bin", "ph/0a3562f758-sm-c2402fa3.bin", "ph/0bb969b02f-sm-da3781bd.bin", "ph/0f65a01b75-sm-6fcf5213.bin", "ph/11247388f6-sm-8a53d9be.bin", "ph/11878ee09d-md-79a26a32.bin", "ph/11878ee09d-sm-d9049ab5.bin", "ph/13082bc2ea-md-74dc2887.bin", "ph/13082bc2ea-sm-a3a5cbd9.bin", "ph/1865a5ca69-md-8ac8dafa.bin", "ph/1865a5ca69-sm-c8a44ed2.bin", "ph/1865a5ca69-xl-ba2c9999.bin", "ph/1d622785af-md-6625354f.bin", "ph/1d622785af-sm-7f06df79.bin", "ph/1d622785af-xl-d70948fc.bin", "ph/1e16ce3584-sm-eb6dc8b5.bin", "ph/1f03d3cda7-md-bc683090.bin", "ph/1f03d3cda7-sm-772503dd.bin", "ph/322dcbaa2b-md-b79e789c.bin", "ph/322dcbaa2b-sm-95dc58d7.bin", "ph/322dcbaa2b-xl-22b315c1.bin", "ph/34b8bf6f10-sm-2581000f.bin", "ph/390720d1c0-sm-9b2788b9.bin", "ph/3b8755e7d8-md-d2060378.bin", "ph/3b8755e7d8-sm-2e6e3354.bin", "ph/3b8755e7d8-xl-8bc8dc97.bin", "ph/3e7cfe6cb3-sm-1197b946.bin", "ph/3fc409517c-md-47e0dbab.bin", "ph/3fc409517c-sm-7dc3d115.bin", "ph/3fc409517c-xl-cdef0b1c.bin", "ph/4d4cbb1e0e-sm-964f9327.bin", "ph/4ff4f50f73-sm-94898f1a.bin", "ph/513672195b-sm-1248ebb9.bin", "ph/51b4c45b9b-sm-d6b86b23.bin", "ph/521e7b6916-md-94c85bc8.bin", "ph/521e7b6916-sm-0eebb266.bin", "ph/55b8756ffe-sm-5bb4bf00.bin", "ph/5ab0ddad3a-md-5708a2bd.bin", "ph/5ab0ddad3a-sm-53585f70.bin", "ph/5b4e593337-md-4ed7be47.bin", "ph/5b4e593337-sm-a0783dea.bin", "ph/600f1e953e-md-e66873bd.bin", "ph/600f1e953e-sm-9f725050.bin", "ph/600f1e953e-xl-1ed4f483.bin", "ph/60a825bb3b-sm-3bb016f8.bin", "ph/60aa461fb7-sm-d6b86b23.bin", "ph/6230d9caba-md-777307bc.bin", "ph/6230d9caba-sm-9078b483.bin", "ph/6230d9caba-xl-bd1d8c5a.bin", "ph/6527a228d7-md-d8e13b46.bin", "ph/6527a228d7-sm-850d1870.bin", "ph/6f137eedbd-sm-da6ab8ec.bin", "ph/71f8e3955b-md-6d3bb73d.bin", "ph/71f8e3955b-sm-20162ea3.bin", "ph/71f8e3955b-xl-aa97f82c.bin", "ph/770ab80d6b-md-be9c6a24.bin", "ph/770ab80d6b-sm-6b28b9d2.bin", "ph/7711e9d9ff-xl-fb54bf3b.bin", "ph/772c79c123-sm-3dfb2f50.bin", "ph/7a87204753-md-6258d463.bin", "ph/7a87204753-sm-d4793787.bin", "ph/7af6fd4689-md-411f3f29.bin", "ph/7af6fd4689-sm-de12b563.bin", "ph/7af6fd4689-xl-e4cd4df4.bin", "ph/7c24f2d606-sm-4e864472.bin", "ph/7c30e68a50-sm-9651290a.bin", "ph/820c0f1cf1-md-e4a206b2.bin", "ph/820c0f1cf1-sm-9873bc91.bin", "ph/820c0f1cf1-xl-3637a4cd.bin", "ph/838ddda8d5-sm-a5072ce4.bin", "ph/84d76e9997-sm-eeea5d56.bin", "ph/859af557ba-md-0e7bde7d.bin", "ph/859af557ba-sm-b6ee54c9.bin", "ph/8df0f15a27-sm-b003991a.bin", "ph/945b6cdb52-md-2efb1064.bin", "ph/945b6cdb52-sm-f6d76aae.bin", "ph/945b6cdb52-xl-deabe0e8.bin", "ph/955188296d-sm-9b7b7e76.bin", "ph/9780760e58-sm-59716eba.bin", "ph/9a0b17a4d7-sm-869eb9c3.bin", "ph/9d627a5677-md-fea156d1.bin", "ph/9d627a5677-sm-01394f04.bin", "ph/9d627a5677-xl-4a9490e7.bin", "ph/9e88f3c6a6-sm-888a331c.bin", "ph/aa779f4357-md-4c2430a3.bin", "ph/aa779f4357-sm-f77ec66c.bin", "ph/aa8e2e911f-md-129932cd.bin", "ph/aa8e2e911f-sm-41aab896.bin", "ph/ac04931d08-md-f4b70445.bin", "ph/ac04931d08-sm-2741d1c5.bin", "ph/af7b03dd45-sm-5b144680.bin", "ph/ba6238db36-sm-798d8022.bin", "ph/bbc44720af-sm-e39454d8.bin", "ph/c1a3533884-sm-548e7763.bin", "ph/c3863dfe5e-sm-abcc0d20.bin", "ph/ccd26fbd45-sm-1a9a5c20.bin", "ph/d2f02fc4a2-md-8e5c8785.bin", "ph/d2f02fc4a2-sm-4658ac55.bin", "ph/d2f02fc4a2-xl-17fa74c7.bin", "ph/d51c5d88da-md-12436ce8.bin", "ph/d51c5d88da-sm-446b4837.bin", "ph/da50daa82d-md-08e99db6.bin", "ph/da50daa82d-sm-68aa48d8.bin", "ph/dca9009da0-md-f4260953.bin", "ph/dca9009da0-sm-a1df0b8e.bin", "ph/dca9009da0-xl-152fd669.bin", "ph/dd9d2ab8ef-xl-56234e7a.bin", "ph/de9f4c78fe-md-3b1cfb9c.bin", "ph/de9f4c78fe-sm-1266cc1b.bin", "ph/de9f4c78fe-xl-07d0a88e.bin", "ph/e1f96016b2-md-a102b7ca.bin", "ph/e1f96016b2-sm-f4524441.bin", "ph/e5a570eba0-sm-d10d9330.bin", "ph/e5b541c414-md-48e30e1c.bin", "ph/e5b541c414-sm-4c47da81.bin", "ph/e8d8ba8487-md-41ad412d.bin", "ph/e8d8ba8487-sm-5d1bb0de.bin", "ph/ea751a6f93-sm-c2402fa3.bin", "ph/eaed6fdcb5-md-06df416b.bin", "ph/eaed6fdcb5-sm-d1ce65a1.bin", "ph/eaed6fdcb5-xl-cf6c4085.bin", "ph/eccdf80a5e-md-0e0ac0e2.bin", "ph/eccdf80a5e-sm-80b8066f.bin", "ph/edaaa45506-md-b4fd4cfe.bin", "ph/edaaa45506-sm-85492757.bin", "ph/edaaa45506-xl-a3260279.bin", "ph/f090e350a0-sm-c35eff3a.bin", "ph/f3ccfb88bb-xl-67805840.bin", "ph/f470d4b30c-md-ae2bdfe5.bin", "ph/f470d4b30c-sm-a35e5ae9.bin", "ph/f48dbf4ba4-sm-b93b7fdc.bin", "ph/f749418c01-sm-161bcd99.bin", "ph/f9429a74cf-sm-8575aa64.bin"];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(CORE.map((u) => new Request(u, { cache: "reload" })));  // the app itself must be complete
    await Promise.all(PHOTOS.map(async (u) => {
      try {
        const have = await caches.match(u, { ignoreSearch: true });
        if (have) await c.put(u, have); else await c.add(u);
      } catch (_) { /* best effort */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(caches.match("index.html").then((r) => r || fetch(req)));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((r) => r || fetch(req).then((res) => {
    if (res.ok && url.pathname.includes("/ph/")) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
    return res;
  })));
});
