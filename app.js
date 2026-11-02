/* Offline companion. Data arrives encrypted (data.bin); the key comes from the install link (?k=).
   Tickets are imported on each phone from a pack file and kept only in this app's storage. */
"use strict";

const ICONS = {
  pass: '<path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v2a2 2 0 0 0 0 4v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-4a2 2 0 0 0 0-4Z"/><path d="M9.5 4v16" stroke-dasharray="1.5 2.5"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="3.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M7.6 13.6h.01M12 13.6h.01M16.4 13.6h.01M7.6 17h.01M12 17h.01"/>',
  train: '<rect x="5" y="3" width="14" height="14" rx="3.5"/><path d="M5 10.5h14M9 20.5l-2 1.5M15 20.5l2 1.5M8.5 13.8h.01M15.5 13.8h.01"/><path d="M8 17l-1.5 2.5M16 17l1.5 2.5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
  swap: '<path d="M4 9.5h13.5L14 6M20 14.5H6.5L10 18"/>',
  ticket: '<path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6Z"/><path d="M14 5v2.5M14 11v2M14 16.5V19"/>',
  list: '<path d="M9 6.5h11M9 12h11M9 17.5h11"/><path d="m3.5 6.5 1.3 1.3 2.2-2.6M3.5 12l1.3 1.3L7 10.7M3.5 17.5l1.3 1.3L7 16.2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.1"/>',
  left: '<path d="m15 5-7 7 7 7"/>', right: '<path d="m9 5 7 7-7 7"/>', close: '<path d="M6 6l12 12M18 6 6 18"/>',
  pin: '<path d="M12 21s-7-6-7-11.5a7 7 0 0 1 14 0C19 15 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  car: '<path d="M5 17v1.5M19 17v1.5M3.5 13l1.8-5.2A2 2 0 0 1 7.2 6.5h9.6a2 2 0 0 1 1.9 1.3L20.5 13v4h-17Z"/><path d="M3.5 13h17M7 15.2h.01M17 15.2h.01"/>',
  nav: '<path d="M4 11.5 20 4l-7.5 16-2-6.5Z"/>',
  rise: '<path d="M3 19h18M7 19a5 5 0 0 1 10 0M12 10V3.5M9.2 6.3 12 3.5l2.8 2.8M4.6 12.6l1.4 1M19.4 12.6l-1.4 1"/>',
  set: '<path d="M3 19h18M7 19a5 5 0 0 1 10 0M12 3.5V10M9.2 7.2 12 10l2.8-2.8M4.6 12.6l1.4 1M19.4 12.6l-1.4 1"/>',
  bed: '<path d="M3 19V6M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="11.5" r="2"/>',
  phone: '<path d="M6.5 3.5h3l1.5 4.5-2.2 1.4a11.5 11.5 0 0 0 5.8 5.8l1.4-2.2 4.5 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  qr: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"/><path d="M14 14h2.5v2.5H14zM17.5 17.5H20V20h-2.5zM14 19h1.5M19 14h1"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  down: '<path d="M12 4v12M6.5 10.5 12 16l5.5-5.5M5 20h14"/>',
  plane: '<path d="M10.5 13.5 3 11l1.5-2 7 1 4-4.5c1-1 2.6-1.4 3.2-.8.6.6.2 2.2-.8 3.2L13.5 12l1 7-2 1.5-2.5-7.5-3 2.5.5 2.5-1.5 1-1.5-3-3-1.5 1-1.5 2.5.5Z"/>',
  cup: '<path d="M5 9h11v4.5A5.5 5.5 0 0 1 10.5 19h0A5.5 5.5 0 0 1 5 13.5Z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M8.5 3.5V6M12 3.5V6"/>',
  chat: '<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4A8 8 0 1 1 20 12Z"/>',
  map: '<path d="m9 4.5-5 2v13l5-2 6 2 5-2v-13l-5 2Z"/><path d="M9 4.5v13M15 6.5v13"/>',
  alert: '<path d="M12 4 2.5 20h19Z"/><path d="M12 10v4.5M12 17.4v.1"/>',
  camera: '<path d="M4 8h3l2-2.5h6L17 8h3v11H4Z"/><circle cx="12" cy="13" r="3.5"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
};
const ic = (n, cls = "ic") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $("#app");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dObj = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
const fmt = (iso, long) => { const d = dObj(iso); return `${WD[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`; };
const pad = (n) => (n < 10 ? "0" : "") + n;
const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };

let D = null;          // trip data
let T = null;          // imported tickets: {built, tickets:[...]} or null
let KEY = null;
const byDay = new Map(), byTicket = new Map(), stubs = new Map();

/* ---------- crypto ---------- */
function b64u(s) { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return Uint8Array.from(atob(s), (c) => c.charCodeAt(0)); }
let keyObj = null, keyFor = null;
async function decryptBuf(buf) {
  if (keyFor !== KEY) { keyObj = await crypto.subtle.importKey("raw", b64u(KEY), "AES-GCM", false, ["decrypt"]); keyFor = KEY; }
  const bytes = new Uint8Array(buf);
  return crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes.slice(0, 12) }, keyObj, bytes.slice(12));
}
async function unseal(buf) {
  const plain = await decryptBuf(buf);
  const text = await new Response(new Blob([plain]).stream().pipeThrough(new DecompressionStream("gzip"))).text();
  return JSON.parse(text);
}

/* ---------- local ticket storage (IndexedDB, this phone only) ---------- */
function idb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open("europe-trip", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("kv");
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
}
async function kv(op, k, v) {
  const db = await idb();
  return new Promise((res, rej) => {
    const tx = db.transaction("kv", op === "get" ? "readonly" : "readwrite");
    const st = tx.objectStore("kv");
    const q = op === "get" ? st.get(k) : op === "delete" ? st.delete(k) : st.put(v, k);
    q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error);
  });
}

/* ---------- helpers ---------- */
/* Photos ship as separate encrypted full-resolution files (ph/<slug>.bin). They're unlocked when a
   screen shows them and kept as blob URLs, then the rest are preloaded quietly in the background. */
const PH = new Map(), PHP = new Map();
const photo = (slug) => !!(slug && D.photos[slug]);
// each photo exists at the sizes it's shown at: sm (thumbnails), md (cards), xl (full-screen headers)
const SIZES = ["sm", "md", "xl"];
function sizeFor(slug, want) {
  const have = (D.photoInfo[slug] && D.photoInfo[slug].sizes) || ["xl"];
  return SIZES.slice(SIZES.indexOf(want)).find((z) => have.includes(z)) || have[have.length - 1];
}
const bg = (slug, want = "md") => {
  if (!photo(slug)) return "";
  const z = sizeFor(slug, want), info = D.photoInfo[slug];
  const key = (info.files && info.files[z]) || `${slug}-${z}`, u = PH.get(key);
  return ` data-ph="${key}"${u ? ` style="--img:url('${u}')"` : ""}`;
};
function getPhoto(key) {
  if (PH.has(key)) return Promise.resolve(PH.get(key));
  if (!PHP.has(key)) PHP.set(key, fetch(`ph/${key}.bin`).then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
    .then(decryptBuf).then((plain) => { const u = URL.createObjectURL(new Blob([plain], { type: "image/webp" })); PH.set(key, u); return u; })
    .catch(() => { PHP.delete(key); return null; }));
  return PHP.get(key);
}
function hydrate(root) {
  root.querySelectorAll("[data-ph]").forEach((el) => {
    if (el.style.getPropertyValue("--img")) return;
    getPhoto(el.dataset.ph).then((u) => { if (u) el.style.setProperty("--img", `url('${u}')`); });
  });
}
async function preloadPhotos() {  // small ones first, then cards, then headers
  const all = SIZES.flatMap((z) => Object.keys(D.photos).map((s) => D.photoInfo[s].files && D.photoInfo[s].files[z]).filter(Boolean));
  const lanes = 3;
  await Promise.all(Array.from({ length: lanes }, async (_, k) => { for (let i = k; i < all.length; i += lanes) await getPhoto(all[i]); }));
}
const areaOf = (slug) => { const i = slug && D.photoInfo && D.photoInfo[slug]; return i && i.area ? i.what : null; };
const legName = (k) => (D.legs.find((l) => l.key === k) || {}).name || "";
function tripState() {
  const t = todayIso(), first = D.days[0].date, last = D.days[D.days.length - 1].date;
  return t < first ? "before" : t > last ? "after" : "during";
}
const mins = (t) => { const m = /(\d{1,2}):(\d{2})/.exec(t || ""); return m ? +m[1] * 60 + +m[2] : null; };
function nextItem(day) {
  const now = new Date(), n = now.getHours() * 60 + now.getMinutes();
  return day.items.find((i) => { const m = mins(i.t); return m != null && m + 20 >= n; }) || null;
}
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("on"), 2600); }
const plain = (html) => { const d = document.createElement("div"); d.innerHTML = html; return d.textContent; };  // tags out, &amp; → &

/* ---------- views ---------- */
function dayCard(d) {
  const p = photo(d.photo), t = todayIso();
  const cls = [`dcard lg-${d.leg}`, p ? "" : "noimg", d.date === t ? "is-today" : "", d.date < t ? "is-past" : ""].join(" ");
  const meta = [];
  const first = d.items.find((i) => mins(i.t) != null);
  if (first) meta.push(`<span>${esc(first.t.replace("~", ""))}</span>`);
  if (d.tickets.length) meta.push(`<span>${ic("ticket")}${d.tickets.length}</span>`);
  if (d.drive) meta.push(`<span>${ic("car")}Car</span>`);
  if (d.hol) meta.push(`<span>${esc(d.hol)}</span>`);
  const dd = dObj(d.date);
  return `<a class="${cls}" href="#/day/${d.id}"${bg(d.photo, "md")}>${d.date === t ? '<span class="today-tag">Today</span>' : ""}
    <span class="dbadge"><small>${WD[dd.getDay()]}</small><b>${dd.getDate()}</b></span>
    <span class="dbody"><span class="dtitle">${esc(d.title)}</span><span class="dmeta">${meta.join("")}</span></span></a>`;
}

function viewHome() {
  const st = tripState(), t = todayIso();
  const today = byDay.get(t.replace(/-/g, ""));
  const first = D.days[0];
  let hero;
  if (st === "before") {
    const n = Math.round((dObj(first.date) - dObj(t)) / 864e5);
    // a slow slideshow of what's coming: one photo per place, in trip order
    const seen = new Set(), slides = D.days.filter((d) => d.photo && photo(d.photo) && !seen.has(d.photo) && seen.add(d.photo));
    const cap = (d) => `${esc((d.place || legName(d.leg)).split(" / ")[0])} · ${esc(fmt(d.date))}`;
    hero = `<a class="hero slideshow lg-${first.leg}" href="#/day/${first.id}"><div class="hero-head"><h1>${esc(D.trip.title)}</h1><p>${esc(D.trip.sub)}</p></div>
      ${slides.map((d, i) => `<span class="slide${i ? "" : " on"}"${bg(d.photo, "xl")} data-cap="${cap(d)}"></span>`).join("")}
      <div class="hero-top"><span class="chip-glass">${ic("pin")}<span class="cap">${slides.length ? cap(slides[0]) : ""}</span></span><span class="chip-glass">${n === 1 ? "Tomorrow" : "In " + n + " days"}</span></div>
      <div class="hero-bot"><span class="hero-big tnum">${n}</span><span class="hero-title">${n === 1 ? "day" : "days"} until ${esc(D.trip.title)}</span>
      <span class="hero-sub">${D.legs.map((l) => esc(l.name)).join(" · ")} · ${D.days.length} days</span></div></a>`;
  } else if (st === "during" && today) {
    hero = `<a class="hero lg-${today.leg}" href="#/day/${today.id}"${bg(today.photo, "xl")}><div class="hero-head"><h1>${esc(D.trip.title)}</h1><p>${esc(D.trip.sub)}</p></div>
      <div class="hero-top"><span class="chip-glass">${ic("sun")}Today · ${fmt(today.date)}</span><span class="chip-glass">${esc(legName(today.leg))}</span></div>
      <div class="hero-bot"><span class="hero-title">${esc(today.title)}</span><span class="hero-sub">Tap for today's plan</span></div></a>`;
    const nx = nextItem(today);
    if (nx) hero += nextCard(today, nx);
  } else {
    const last = D.days[D.days.length - 1];
    hero = `<a class="hero lg-${last.leg}" href="#/day/${last.id}"${bg(D.legs[2].photo, "xl")}><div class="hero-head"><h1>${esc(D.trip.title)}</h1><p>${esc(D.trip.sub)}</p></div><div class="hero-top"><span class="chip-glass">Trip complete</span></div>
      <div class="hero-bot"><span class="hero-title">What a trip</span><span class="hero-sub">Every day is still here</span></div></a>`;
  }
  const nudge = !T ? `<div class="sec"><a class="list" href="#/tickets"><span class="row" style="--inset:61px"><span class="tile" style="background:var(--orange)">${ic("ticket")}</span>
    <span class="tx"><b>Add your tickets</b><span>Import the ticket pack once on this phone</span></span>${ic("right", "ic chev")}</span></a></div>` : "";
  const legs = D.legs.map((l) => {
    const ds = D.days.filter((d) => d.leg === l.key);
    if (!ds.length) return "";
    const hotel = ds[0].hotel;
    const stay = hotel ? `<p class="stay-line">${ic("bed")}${hotel.name ? esc(hotel.name) : esc(hotel.city) + " hotel · " + esc(hotel.note)}</p>` : "";
    return `<section class="sec lg-${l.key}"><div class="sec-h"><h2><i></i>${esc(l.name)}</h2><span>${fmt(ds[0].date).slice(4)} – ${fmt(ds[ds.length - 1].date).slice(4)}</span></div>
      <div class="hs">${ds.map(dayCard).join("")}</div>${stay}</section>`;
  }).join("");
  return `${hero}${nudge}${legs}`;
}

function nextCard(day, it, onDay) {
  const m = mins(it.t), now = new Date(), n = now.getHours() * 60 + now.getMinutes();
  const diff = m - n, when = diff <= 0 ? "now" : diff < 60 ? `in ${diff} min` : `in ${Math.floor(diff / 60)} h ${diff % 60} min`;
  const place = it.maps[0];
  const tk = day.tickets[0];
  return `<div class="next lg-${day.leg}"><div class="next-row"><span class="next-time tnum">${esc(it.t)}<small>${when}</small></span>
    <span class="next-what">${esc(plain(it.html))}</span></div><div class="btnrow">
    ${place ? `<a class="btn leg" href="${esc(place.url)}">${ic(place.drive ? "car" : "nav")}${place.drive ? "Drive" : "Directions"}</a>` : ""}
    ${tk ? `<a class="btn leg" href="#/ticket/${tk}">${ic("qr")}Ticket</a>` : ""}${onDay ? "" : `<a class="btn leg" href="#/day/${day.id}">Full day</a>`}</div></div>`;
}

const shortDay = (x) => { const xd = dObj(x.date); return `${WD[xd.getDay()]} ${xd.getDate()}`; };
function viewDay(id) {
  const d = byDay.get(id);
  if (!d) return viewHome();
  const i = D.days.indexOf(d), prev = D.days[i - 1], next = D.days[i + 1];
  const p = photo(d.photo), dd = dObj(d.date);
  let out = `<div class="dhero lg-${d.leg}${p ? "" : " noimg"}"${bg(d.photo, "xl")}>
    <div class="topbar"><a class="gbtn" href="#/" data-dir="pop" aria-label="All days">${ic("left")}</a>
      <span class="nbchip">${prev ? `<a href="#/day/${prev.id}" data-dir="prev">${shortDay(prev)}</a>` : "<i></i>"}<b>${shortDay(d)}</b>${next ? `<a href="#/day/${next.id}" data-dir="next">${shortDay(next)}</a>` : "<i></i>"}</span>
      <a class="gbtn${prev ? "" : " off"}" href="${prev ? "#/day/" + prev.id : "#/"}" data-dir="prev" aria-label="Previous day">${ic("left")}</a>
      <a class="gbtn${next ? "" : " off"}" href="${next ? "#/day/" + next.id : "#/"}" data-dir="next" aria-label="Next day">${ic("right")}</a></div>
    <div class="dhero-tx"><span class="when">${WD[dd.getDay()]} ${dd.getDate()} ${MON[dd.getMonth()]} · ${esc(legName(d.leg))}${d.hol ? `<span class="hol">${esc(d.hol)}</span>` : ""}</span>
    <h1>${esc(d.title)}</h1></div></div>`;
  out += `<div class="lg-${d.leg}">`;
  if (d.rise) out += `<div class="sunrow"><span class="pill">${ic("rise", "ic r")}${esc(d.rise)}</span><span class="pill">${ic("set", "ic s")}${esc(d.set)}</span>${d.place ? `<span class="pill">${ic("pin")}${esc(d.place)}</span>` : ""}</div>`;
  if (d.note) out += `<p class="foot" style="margin:10px 22px 0">${esc(d.note)}</p>`;
  if (d.date === todayIso()) { const nx = nextItem(d); if (nx) out += nextCard(d, nx, true); }
  if (d.tickets.length) {
    const short = (w) => w.replace(/^[A-Z][a-z]{2} \d{1,2} [A-Z][a-z]{2}\s*(·\s*)?/, "");  // the date is this page's date
    out += `<section class="sec"><div class="sec-h"><h2>Tickets</h2>${T ? "" : '<a href="#/tickets">Import</a>'}</div><div class="list">${d.tickets.map((tid) => {
      const s = stubs.get(tid), full = byTicket.get(tid);
      const n = full ? full.codes.length : 0;
      const sub = full ? `${short(s ? s.when : "")}${n > 1 ? ` · ${n} codes` : ""}` : "Import the ticket pack to show it";
      return `<a class="row tkrow lg-${d.leg}${full ? "" : " locked"}" href="#/ticket/${tid}" style="--inset:68px"><span class="qt">${ic("qr")}</span>
        <span class="tx"><b>${esc(s ? s.name : tid)}</b><span>${esc(sub)}</span></span>${ic("right", "ic chev")}</a>`;
    }).join("")}</div></section>`;
  }
  out += `<section class="sec"><div class="sec-h"><h2>Plan</h2>${d.drive ? `<span>${ic("car", "ic")} Car day</span>` : ""}</div><ol class="sched">${d.items.map((it) => {
    const places = it.maps.map((m) => `<a class="place" href="${esc(m.url)}"><span class="ph"${bg(m.photo, "sm")}>${photo(m.photo) ? "" : ic("pin")}</span>
      <span class="tx"><b>${esc(m.label)}</b><span>${m.drive ? "Drive · works offline" : "Show in Google Maps"}</span></span><span class="go-ic">${ic(m.drive ? "car" : "nav")}</span></a>`).join("");
    return `<li class="${it.go ? "go" : ""}" data-t="${esc(it.t)}"><span class="t tnum">${esc(it.t)}</span><div class="w"><p class="txt">${it.html}</p>${places}</div></li>`;
  }).join("")}</ol></section>`;
  if (d.todos.length) {
    out += `<section class="sec"><div class="sec-h"><h2>Before you go</h2></div><div class="list">${d.todos.map((t) => {
      const tag = t.href && t.href.startsWith("http") ? "a" : "div";
      return `<${tag} class="row"${tag === "a" ? ` href="${esc(t.href)}"` : ""}><span class="tx"><b style="font-size:16px">${esc(t.text)}</b></span><span class="badge">${esc(t.status)}</span></${tag}>`;
    }).join("")}</div></section>`;
  }
  if (d.hotel) {
    const h = d.hotel;
    out += `<section class="sec"><div class="sec-h"><h2>Tonight</h2></div><div class="list">${h.name
      ? `<a class="row" href="${esc(h.url)}" style="--inset:61px"><span class="tile">${ic("bed")}</span><span class="tx"><b>${esc(h.name)}</b><span>${esc(h.address)}</span><span>${esc(h.note || "")}</span></span><span class="go-ic" style="display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--tint);color:#fff">${ic("nav")}</span></a>
        ${h.phone ? `<a class="row" href="tel:${esc(h.phone.replace(/\s/g, ""))}" style="--inset:61px"><span class="tile" style="background:var(--green)">${ic("phone")}</span><span class="tx"><b>Call hotel</b><span>${esc(h.phone)}</span></span></a>` : ""}`
      : `<div class="row" style="--inset:61px"><span class="tile" style="background:var(--card-3)">${ic("bed")}</span><span class="tx"><b>${esc(h.city)} hotel</b><span>${esc(h.note)}</span></span></div>`}</div></section>`;
  }
  out += `<nav class="daynav">${prev ? `<a href="#/day/${prev.id}" data-dir="prev"><small>‹ ${fmt(prev.date)}</small><b>${esc(prev.title)}</b></a>` : "<span></span>"}
    ${next ? `<a class="nx" href="#/day/${next.id}" data-dir="next"><small>${fmt(next.date)} ›</small><b>${esc(next.title)}</b></a>` : "<span></span>"}</nav></div>`;
  return out;
}

function importBlock(again) {
  return `<div class="empty"><span class="big-ic">${ic("ticket")}</span><h2>${again ? "Update tickets" : "Add your tickets"}</h2>
    <p>Tickets are kept only on this phone, never online. Import the ticket pack once and they work offline.</p>
    <ol class="steps"><li>Save “${esc(D.trip.pack)}” to Files (AirDrop from the Mac)</li><li>Tap Import below and pick that file</li></ol>
    <button class="btn solid wide" data-act="import">${ic("down")}Import ticket pack</button></div>`;
}

/* Tickets: a plain list in the order you'll use them. During the trip, today's come first;
   anything whose last day has passed sinks to "Used" at the bottom. Details live on each ticket's page. */
const KIND_IC = { hotel: "bed", car: "car", train: "train", entry: "qr" };
function ticketList() {
  return D.tickets.map((s) => ({ ...s, until: s.until || s.date, leg: (D.days.find((d) => d.tickets.includes(s.id)) || D.days.find((d) => d.date === s.date) || D.days[0]).leg }))
    .sort((a, b) => (a.date || "").localeCompare(b.date || "") || (mins(a.when) ?? 9999) - (mins(b.when) ?? 9999));
}
function useLine(x, today) {
  const strip = (w) => w.replace(/^[A-Z][a-z]{2} \d{1,2} [A-Z][a-z]{2}\s*(·\s*)?/, "");
  if (x.kind === "hotel") {
    if (today && x.until === today) return "Check-out today";
    return `${fmt(x.date).slice(4)} → ${fmt(x.until).slice(4)}`;
  }
  if (x.until !== x.date) return today && x.until === today ? "Return today" : `Until ${fmt(x.until)}`;
  return strip(x.when).split(" · ")[0];
}
function tRow(x, today, used) {
  if (x.kind === "booked") {
    const tag = x.href ? "a" : "div";
    return `<${tag} class="row tkrow lg-${x.leg}${used ? " used" : ""}"${x.href ? ` href="${esc(x.href)}"` : ""} style="--inset:68px"><span class="qt">${ic("check")}</span>
      <span class="tx"><b>${esc(x.name)}</b><span>${esc((x.when || "").replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) \d{1,2}\s*(·\s*)?/, ""))} · booked, no ticket file</span></span></${tag}>`;
  }
  const locked = !byTicket.get(x.id);
  return `<a class="row tkrow lg-${x.leg}${used ? " used" : ""}${locked ? " locked" : ""}" href="#/ticket/${x.id}" style="--inset:68px">
    <span class="qt">${ic(KIND_IC[x.kind] || "qr")}</span><span class="tx"><b>${esc(x.name)}</b><span>${esc(useLine(x, today))}</span></span>${ic("right", "ic chev")}</a>`;
}
// bookings marked booked but with no ticket file (e.g. the flight home) still belong in the list
const words = (x) => (x || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/[^a-z0-9]+/).filter((w) => w.length > 3);
function bookedOnly() {
  return D.bookings.filter((b) => b.ok && !b.ticket && !D.tickets.some((t) => {
    const tw = words(t.name);
    return (!b.date || !t.date || b.date === t.date || (t.until && b.date >= t.date && b.date <= t.until)) && words(b.what).some((w) => tw.includes(w));
  })).map((b) => ({ id: null, name: shortWhat(b.what), when: b.when, date: b.date, until: b.date, kind: "booked", leg: b.leg, href: b.href }));
}
const shortWhat = (w) => w.split(" · ")[0].replace(/\s*\([^)]*\)/g, "").trim();
function todoRow(b) {
  const tag = b.href ? "a" : "div";
  return `<${tag} class="row tkrow lg-${b.leg} todo-row"${b.href ? ` href="${esc(b.href)}"` : ""} style="--inset:68px"><span class="qt">${ic(b.href ? "ext" : "list")}</span>
    <span class="tx"><b>${esc(shortWhat(b.what))}</b><span>${esc(b.when.replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) \d{1,2}\s*(·\s*)?/, "") || b.when)}</span></span><span class="badge">${esc(b.status)}</span></${tag}>`;
}
function viewTickets() {
  const t = todayIso(), st = tripState(), all = ticketList().concat(bookedOnly().map((x) => ({ ...x, until: x.until || x.date })))
    .sort((a, b) => (a.date || "").localeCompare(b.date || "") || (mins(a.when) ?? 9999) - (mins(b.when) ?? 9999));
  const live = st === "during";
  const now = live ? all.filter((x) => x.date <= t && t <= x.until) : [];
  const used = all.filter((x) => x.until && x.until < t);
  const next = all.filter((x) => !now.includes(x) && !used.includes(x));
  const todo = D.bookings.filter((b) => !b.ok && (!b.date || b.date >= t)).sort((a, b) => (a.date || "9").localeCompare(b.date || "9"));
  let out = `<header class="lt"><div><h1>Tickets</h1><p>${live ? `${now.length} for today` : `${all.length} booked${todo.length ? ` · ${todo.length} still to book` : ""}`}</p></div>${T ? `<button class="act" data-act="replacepack" aria-label="Replace ticket pack">${ic("swap")}</button>` : ""}</header>`;
  if (!T) out += importBlock(false);
  if (now.length) out += `<section class="sec"><div class="sec-h"><h2>Today</h2><span>${fmt(t)}</span></div><div class="list">${now.map((x) => tRow(x, t)).join("")}</div></section>`;
  if (todo.length) {
    const g = new Map();
    todo.forEach((b) => { const k = b.date || ""; if (!g.has(k)) g.set(k, []); g.get(k).push(b); });
    out += `<section class="sec"><div class="sec-h"><h2>Still to book</h2><span>${todo.length}</span></div>${[...g].map(([date, bs]) =>
      `<h3 class="dayhead">${date ? fmt(date) : "Any time"}</h3><div class="list">${bs.map(todoRow).join("")}</div>`).join("")}</section>`;
  }
  if (next.length) {
    const byDate = new Map();
    next.forEach((x) => { if (!byDate.has(x.date)) byDate.set(x.date, []); byDate.get(x.date).push(x); });
    out += `<section class="sec"><div class="sec-h"><h2>${live ? "Coming up" : "Booked"}</h2></div>${[...byDate].map(([date, xs]) =>
      `<h3 class="dayhead">${fmt(date)}</h3><div class="list">${xs.map((x) => tRow(x)).join("")}</div>`).join("")}</section>`;
  }
  if (used.length) out += `<section class="sec"><div class="sec-h"><h2>Used</h2><span>${used.length}</span></div><div class="list">${used.map((x) => tRow(x, null, true)).join("")}</div></section>`;
  out += `<p class="foot" style="margin:16px 22px 0">${T ? `Tickets are on this phone only · pack from ${esc(T.built)}. ` : ""}Booking links need internet.</p>`;
  return out;
}

function viewTicket(id) {
  const stub = stubs.get(id), tk = byTicket.get(id);
  const day = D.days.find((d) => d.tickets.includes(id));
  const leg = day ? day.leg : "munich";
  const back = `<div class="topbar"><a class="gbtn" href="${day && location.hash.includes("from=day") ? "#/day/" + day.id : "#/tickets"}" data-dir="pop" aria-label="Back">${ic("left")}</a><span class="sp"></span>${day ? `<a class="btn" href="#/day/${day.id}" data-dir="push">${fmt(day.date)}</a>` : ""}</div>`;
  if (!tk) return `<div class="tv">${back}</div><header class="lt" style="padding-top:4px"><div><h1>${esc(stub ? stub.name : "Ticket")}</h1><p>${esc(stub ? stub.when : "")}</p></div></header>${importBlock(false)}`;
  const n = tk.codes.length;
  const codes = n ? `<div class="codes">${tk.codes.map((c, i) => `<figure class="code"><img src="${c.img}" alt="${esc(c.type)} code ${i + 1} of ${n}"><figcaption>${n > 1 ? `Code ${i + 1} of ${n} · ` : ""}${esc(c.type)}</figcaption></figure>`).join("")}</div>
    ${n > 1 ? `<div class="dots">${tk.codes.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div>` : ""}` : "";
  const pages = tk.pages.map((p, i) => `<img loading="lazy" src="${p}" alt="Page ${i + 1}">`).join("");
  return `<div class="tv lg-${leg}">${back}<article class="tpass">
    <div class="hd"><div><small>${esc(legName(leg))}</small><h1>${esc(tk.name)}</h1></div></div>
    <div class="fields"><div class="full"><small>When</small><b>${esc(tk.when)}</b></div>
      <div><small>Booking ref</small><b>${esc(tk.ref)}</b></div><div><small>Codes</small><b>${n || "See pages"}</b></div>
      ${tk.info ? `<div class="full"><small>Details</small><b style="font-weight:500">${esc(tk.info)}</b></div>` : ""}</div>
    ${codes}</article>
    ${n ? `<p class="hintline">${ic("sun")}Turn brightness up before scanning${n > 1 ? " · swipe for each person" : ""}</p>` : ""}
    <div class="btnrow" style="margin-top:14px"><button class="btn" data-act="copy" data-v="${esc(tk.ref)}">${ic("copy")}Copy ref</button></div>
    <details class="pages"${n ? "" : " open"}><summary>Full ticket · ${tk.pages.length} page${tk.pages.length > 1 ? "s" : ""}${ic("right")}</summary>${pages}</details>
    <p class="foot" style="margin:12px 4px 0">Original PDF: ${esc(tk.file)}</p></div>`;
}

const INFO_SEGS = [["hotels", "Hotels"], ["help", "Help"], ["phrases", "Phrases"]];
function viewInfo(seg) {
  seg = INFO_SEGS.some(([k]) => k === seg) ? seg : "hotels";
  const L = (rows) => `<div class="list">${rows.join("")}</div>`;
  let out = `<header class="lt"><div><h1>Info</h1></div></header>
    <nav class="seg" aria-label="Info sections">${INFO_SEGS.map(([k, n]) => `<a href="#/info/${k}" data-dir="none"${k === seg ? ' class="on" aria-current="page"' : ""}>${n}</a>`).join("")}</nav>`;
  if (seg === "hotels") {
  out += `<section class="sec">${L(D.hotels.map((h) => {
    const rng = `${fmt(h.from).slice(4)} – ${fmt(h.to).slice(4)}`;
    return h.name ? `<a class="row" href="${esc(h.url)}" style="--inset:61px"><span class="tile">${ic("bed")}</span><span class="tx"><b>${esc(h.city)} · ${esc(h.name)}</b><span>${rng} · ${esc(h.address)}</span>${h.phone ? `<span>${esc(h.phone)}</span>` : ""}</span>${ic("right", "ic chev")}</a>`
      : `<div class="row" style="--inset:61px"><span class="tile" style="background:var(--card-3)">${ic("bed")}</span><span class="tx"><b>${esc(h.city)}</b><span>${rng} · ${esc(h.note)}</span></span><span class="badge">To add</span></div>`;
  }))}</section>`;
  } else if (seg === "help") {
  out += `<section class="sec">${L(D.emergency.map((e) => `<a class="row" href="tel:${esc(e.number)}" style="--inset:61px"><span class="tile" style="background:var(--red)">${ic("phone")}</span><span class="tx"><b>${esc(e.label)}</b>${e.note ? `<span>${esc(e.note)}</span>` : ""}</span><span class="num tnum">${esc(e.number)}</span></a>`))}
    <p class="foot">${esc(D.pharmacy)}</p></section>`;
  } else if (seg === "phrases") {
  out += Object.entries(D.phrases).map(([lang, items], li) => `<section class="sec"><div class="sec-h"><h2>${esc(lang.split(" (")[0])}</h2><span>Tap to show</span></div>${L(items.map(([en, fx], i) =>
    `<a class="row" href="#/say/${li}/${i}" data-dir="push"><span class="tx"><b>${esc(fx)}</b><span>${esc(en)}</span></span>${ic("right", "ic chev")}</a>`))}</section>`).join("");
  }
  return out;
}

function viewCafes() {
  let out = `<header class="lt"><div><h1>Cafés</h1><p>Cafés, treats and shops · tap for Maps</p></div></header>`;
  for (const l of D.legs) {
    if (!l.cafes.length) continue;
    out += `<section class="sec lg-${l.key}"><div class="sec-h"><h2><i></i>${esc(l.name)}</h2><span>${l.cafes.length}</span></div><div class="grid2">${l.cafes.map((c) => {
      const p = photo(c.photo);
      return `<a class="ccard" href="${esc(c.url)}"><span class="ph${p ? "" : " noimg"}"${bg(c.photo, "md")}>${p ? "" : `<b>${esc(c.name.replace(/^(Café|Confiserie|Konditorei) /, "")[0])}</b>`}</span>
        <span class="tx"><b>${esc(c.name)}</b><span>${esc(c.desc)}${c.when ? " · " + esc(c.when) : ""}</span></span></a>`;
    }).join("")}</div></section>`;
  }
  return out;
}

function viewSay(li, i) {
  const [lang, items] = Object.entries(D.phrases)[+li] || [];
  const p = items && items[+i];
  if (!p) return viewInfo("phrases");
  return `<div class="say"><a class="gbtn" href="#/info/phrases" data-dir="pop" aria-label="Close">${ic("close")}</a><b>${esc(p[1])}</b><span>${esc(p[0])}</span></div>`;
}

/* ---------- search: one box for days, plan steps, tickets, hotels, cafés, phrases, help ----------
   Accent- and case-insensitive word-prefix matching; every word you type must match somewhere.
   Dates work as you'd say them: "26", "26 dec", "christmas", "friday", "today", "tomorrow". */
const norm = (x) => String(x || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss")
  .replace(/[^a-z0-9:./€+ ]+/g, " ").replace(/\s+/g, " ").trim();
const escRe = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const WDF = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const MONF = { 12: ["dec", "december"], 1: ["jan", "january"] };
const isoOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
let INDEX = null, focusItem = null, searchBack = "#/";
function dateWords(d) {  // just the ways you'd name the date, for steps and to-dos
  const dd = dObj(d.date), n = dd.getDate(), m = dd.getMonth() + 1, mo = MONF[m] || ["", ""];
  const extra = /christmas|xmas/i.test(d.hol || "") ? "christmas xmas" : /new year/i.test(d.hol || "") ? "new year nye" : "";
  return [fmt(d.date), `${n} ${mo[0]}`, `${n} ${mo[1]}`, `${mo[0]} ${n}`, `${n}/${m}`, `${n}.${m}`, WDF[dd.getDay()], d.hol || "", extra].join(" | ");
}
function dayAliases(d) {
  const dd = dObj(d.date), n = dd.getDate(), m = dd.getMonth() + 1, mo = MONF[m] || ["", ""];
  const extra = /christmas|xmas/i.test(d.hol || "") ? "christmas xmas" : /new year/i.test(d.hol || "") ? "new year nye" : "";
  return [fmt(d.date), `${n} ${mo[0]}`, `${n} ${mo[1]}`, `${mo[0]} ${n}`, `${n}/${m}`, `${n}.${m}`, WDF[dd.getDay()], d.hol || "", extra, legName(d.leg), d.place || ""].join(" | ");
}
function buildIndex() {
  const docs = [];
  // kw = what the thing IS (day names/dates, "train", "hotel"…): matched as strongly as the title
  const add = (o) => { o.nt = norm(o.title); o.nk = norm(o.kw || ""); o.nb = norm(o.body || ""); docs.push(o); };
  const legOf = (date) => (D.days.find((d) => d.date === date) || D.days[0]).leg;
  for (const d of D.days) {
    add({ type: "day", title: d.title, sub: `${fmt(d.date)} · ${legName(d.leg)}`, kw: dayAliases(d), body: d.note || "", href: `#/day/${d.id}`, date: d.date, photo: d.photo, leg: d.leg });
    d.items.forEach((it, i) => add({ type: "plan", title: plain(it.html), sub: `${fmt(d.date)}${it.t ? " · " + it.t : ""}`,
      body: `${it.t} ${it.maps.map((m) => m.label).join(" ")} ${dateWords(d)}`, href: `#/day/${d.id}`, focus: `${d.id}|${i}`, date: d.date, leg: d.leg, go: it.go, photo: (it.maps[0] || {}).photo }));
    d.todos.forEach((t) => add({ type: "todo", title: t.text.split(" · ")[0], sub: `${fmt(d.date)} · ${t.status}`, body: `${t.text} ${t.status} to do to book ${dateWords(d)}`, href: `#/day/${d.id}`, date: d.date, leg: d.leg }));
  }
  for (const t of D.tickets) {
    const full = byTicket.get(t.id);
    add({ type: "ticket", title: t.name, sub: `${t.date ? fmt(t.date) : ""}${t.until && t.until !== t.date ? " → " + fmt(t.until) : ""}`,
      kw: t.kind === "train" ? "train rail tgv ticket" : t.kind === "hotel" ? "hotel booking stay" : t.kind === "car" ? "car rental sixt" : "ticket entry",
      body: `${t.when} ${full ? full.ref + " " + full.info : ""}`,
      href: `#/ticket/${t.id}`, date: t.date, leg: legOf(t.date), kind: t.kind });
  }
  for (const h of D.hotels) add({ type: "hotel", title: h.name || `${h.city} hotel`, sub: `${h.city} · ${fmt(h.from).slice(4)} – ${fmt(h.to).slice(4)}`,
    kw: `hotel ${h.city}`, body: `stay sleep ${h.address || ""} ${h.phone || ""} ${h.note || ""}`, href: "#/info/hotels", date: h.from, leg: legOf(h.from) });
  for (const l of D.legs) for (const c of l.cafes) add({ type: "cafe", title: c.name, sub: `${l.name}${c.when ? " · " + c.when : ""}`, body: `cafe coffee shop ${c.desc} ${c.when} ${l.name}`, href: c.url, photo: c.photo, leg: l.key });
  Object.entries(D.phrases).forEach(([lang, items], li) => items.forEach(([en, fx], i) => add({ type: "phrase", title: fx, sub: en, body: `${en} ${lang} phrase say`, href: `#/say/${li}/${i}` })));
  for (const e of D.emergency) add({ type: "help", title: e.label, sub: e.number, body: `emergency help call ${e.number} ${e.note || ""}`, href: `tel:${e.number}` });
  INDEX = docs;
}
function matchScore(tk, o) {
  // a 1–2 digit number is a day of the month: match it whole ("26" ≠ booking no. 2610…)
  const re = /^\d{1,2}$/.test(tk) ? new RegExp(`(^|[^a-z0-9:])${tk}($|[^0-9:])`) : new RegExp(`(^|[^a-z0-9])${escRe(tk)}`);
  if (re.test(o.nt) || re.test(o.nk)) return 3;
  if (re.test(o.nb)) return 1.5;
  if (tk.length >= 4 && (o.nt.includes(tk) || o.nk.includes(tk))) return 2;
  if (tk.length >= 4 && o.nb.includes(tk)) return 1;
  return 0;
}
const TYPEW = { day: 2, ticket: 1.6, hotel: 1.4, plan: 1, cafe: 1, todo: 0.8, phrase: 0.6, help: 0.6 };
function runSearch(q) {
  if (!INDEX) buildIndex();
  let qn = norm(q), only = null;
  const rel = { today: 0, tonight: 0, tomorrow: 1, yesterday: -1 };
  for (const [w, off] of Object.entries(rel)) {
    if (new RegExp(`(^| )${w}( |$)`).test(qn)) { const dd = dObj(todayIso()); dd.setDate(dd.getDate() + off); only = isoOf(dd); qn = qn.replace(w, " ").trim(); }
  }
  const toks = qn.split(" ").filter(Boolean);
  if (!toks.length && !only) return [];
  const out = [];
  for (const o of INDEX) {
    if (only && o.date !== only) continue;
    let score = 0, ok = true;
    for (const tk of toks) { const m = matchScore(tk, o); if (!m) { ok = false; break; } score += m; }
    if (ok) out.push([score + (TYPEW[o.type] || 0), o]);
  }
  return out.sort((a, b) => b[0] - a[0] || (a[1].date || "~").localeCompare(b[1].date || "~")).map((x) => x[1]);
}
function hl(text, q) {
  const chars = [...String(text || "")];
  const low = chars.map((c) => (c.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")[0] || " ")).join("");
  const on = new Array(chars.length).fill(false);
  for (const tk of norm(q).split(" ").filter((t) => t && !["today", "tonight", "tomorrow", "yesterday"].includes(t))) {
    const re = new RegExp(`(^|[^a-z0-9])(${escRe(tk)})`, "g"); let m;
    while ((m = re.exec(low))) { const st = m.index + m[1].length; for (let k = st; k < st + tk.length; k++) on[k] = true; re.lastIndex = st + 1; }
  }
  let html = "", open = false;
  chars.forEach((c, i) => { if (on[i] && !open) { html += "<mark>"; open = true; } if (!on[i] && open) { html += "</mark>"; open = false; } html += esc(c); });
  return html + (open ? "</mark>" : "");
}
const GROUPS = [["day", "Days"], ["plan", "Plan"], ["ticket", "Tickets & bookings"], ["hotel", "Hotels"], ["todo", "To do"], ["cafe", "Cafés & shops"], ["phrase", "Phrases"], ["help", "Help"]];
const TYPE_IC = { day: "cal", plan: "pin", hotel: "bed", todo: "list", cafe: "cup", phrase: "chat", help: "phone" };
function sRow(o, q) {
  const p = photo(o.photo);
  const icon = o.type === "ticket" ? (KIND_IC[o.kind] || "qr") : o.type === "plan" && o.go ? "route" : TYPE_IC[o.type];
  const ext = /^https?:|^tel:/.test(o.href);
  return `<a class="row srow${o.leg ? " lg-" + o.leg : ""}" href="${esc(o.href)}"${o.focus ? ` data-focus="${o.focus}"` : ""}${ext ? "" : ' data-dir="push"'} style="--inset:68px">
    <span class="qt${p ? " ph" : ""}"${p ? bg(o.photo, "sm") : ""}>${p ? "" : ic(icon)}</span>
    <span class="tx"><b>${hl(o.title, q)}</b><span>${hl(o.sub, q)}</span></span>${ext ? ic("ext", "ic chev") : ic("right", "ic chev")}</a>`;
}
function recentQs() { try { return JSON.parse(localStorage.getItem("recentQ") || "[]"); } catch (_) { return []; } }
function rememberQ(q) { q = q.trim(); if (!q) return; try { localStorage.setItem("recentQ", JSON.stringify([q, ...recentQs().filter((x) => x !== q)].slice(0, 6))); } catch (_) {} }
function searchResults(q) {
  if (!q.trim()) {
    const rec = recentQs();
    // generic words + a few places from the (encrypted) trip itself, so the public code names nothing
    const places = [...new Set(D.days.map((d) => (d.place || "").split(" / ")[0]).filter(Boolean))].slice(1, 4);
    const sug = tripState() === "during" ? ["Today", "Tomorrow", "Train", "Hotel", "To book"] : ["Train", "Hotel", "To book", ...places];
    return (rec.length ? `<section class="sec"><div class="sec-h"><h2>Recent</h2></div><div class="sugg">${rec.map((x) => `<button data-act="q" data-v="${esc(x)}">${ic("search")}${esc(x)}</button>`).join("")}</div></section>` : "")
      + `<section class="sec"><div class="sec-h"><h2>Try</h2></div><div class="sugg">${sug.map((x) => `<button data-act="q" data-v="${esc(x)}">${esc(x)}</button>`).join("")}</div>
      <p class="foot" style="margin:14px 2px 0">Search any place, day, ticket, hotel, café or phrase. Dates work too: “26 dec”, “friday”, “tomorrow”.</p></section>`;
  }
  const hits = runSearch(q);
  if (!hits.length) return `<div class="empty"><span class="big-ic">${ic("search")}</span><h2>No matches</h2><p>Nothing for “${esc(q.trim())}”. Try a place, a date like “26 dec”, or a word like “train”.</p></div>`;
  return `<p class="foot" style="margin:2px 22px 0">${hits.length} result${hits.length === 1 ? "" : "s"}</p>` + GROUPS.map(([type, name]) => {
    const g = hits.filter((o) => o.type === type);
    if (!g.length) return "";
    const shown = g.slice(0, 8);
    return `<section class="sec"><div class="sec-h"><h2>${name}</h2><span>${g.length}</span></div><div class="list">${shown.map((o) => sRow(o, q)).join("")}</div>
      ${g.length > shown.length ? `<p class="foot">+${g.length - shown.length} more · add a word to narrow it down</p>` : ""}</section>`;
  }).join("");
}
function viewSearch() {
  return `<div class="sbar"><label class="sfield">${ic("search")}<input id="q" type="search" placeholder="Days, places, tickets, hotels…" enterkeyhint="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Search the trip"><button type="button" class="sclear" data-act="clearq" aria-label="Clear" hidden>${ic("close")}</button></label>
    <button type="button" class="scancel" data-act="cancelsearch">Cancel</button></div><div class="sres" id="sres">${searchResults("")}</div>`;
}
function wireSearch(el) {
  const inp = el.querySelector("#q"), out = el.querySelector("#sres"), clr = el.querySelector(".sclear");
  let t = 0;
  const draw = () => { out.innerHTML = searchResults(inp.value); clr.hidden = !inp.value; hydrate(out); };
  inp.addEventListener("input", () => { clearTimeout(t); t = setTimeout(draw, 70); });
  inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { inp.blur(); rememberQ(inp.value); } });
  el._draw = draw;
}
function openSearch() {  // runs inside the tap, so iOS lets the keyboard open
  if (route().name !== "search") searchBack = keyNow();
  navDir = "none";
  history.pushState(null, "", "#/search");
  render();
  const inp = cur && cur.el.querySelector("#q");
  if (inp) { inp.focus(); inp.select(); }
}

/* ---------- router ----------
   Screens are kept alive once built (photos are blob URLs, so they stay decoded): going back is
   instant and lands where you were. A small LRU keeps memory in check. */
let navDir = "tab", lastRoute = null, cur = null, lastKey = "#/";
const screens = new Map();
const ROOTS = new Set(["#/", "#/tickets", "#/cafes", "#/info"]);
function route() {
  const parts = (location.hash.replace(/^#\/?/, "").split("?")[0] || "").split("/").filter(Boolean);
  const [name = "home", a, b] = parts;
  return { name, a, b };
}
const keyNow = () => (location.hash && location.hash !== "#" ? location.hash : "#/");
function tabOf(r) { return { home: "days", day: "days", tickets: "tickets", ticket: "tickets", bookings: "tickets", cafes: "cafes", info: "info", say: "info", search: "" }[r.name] ?? "days"; }
function viewFor(r) {
  return r.name === "day" ? viewDay(r.a) : r.name === "ticket" ? viewTicket(r.a) : r.name === "tickets" ? viewTickets()
    : r.name === "bookings" ? viewTickets() : r.name === "cafes" ? viewCafes() : r.name === "info" ? viewInfo(r.a)
    : r.name === "say" ? viewSay(r.a, r.b) : r.name === "search" ? viewSearch() : viewHome();
}
function invalidate() { screens.forEach((s) => s.el.remove()); screens.clear(); cur = null; }
// navigate, and still draw when the hash is already there (no hashchange would fire)
function go(hash) { if (keyNow() === hash) render(); else location.hash = hash; }
function render() {
  const r = route(), key = keyNow(), dir = navDir;
  const apply = () => {
    if (cur) { cur.scroll = window.scrollY; cur.el.hidden = true; }
    let s = screens.get(key);
    if (s && !s.el.isConnected) { screens.delete(key); s = null; }  // never show a screen that was removed
    const fresh = !s;
    if (fresh) {
      const el = document.createElement("div");
      el.className = "scr";
      el.innerHTML = viewFor(r);
      app.appendChild(el);
      s = { el, scroll: 0 };
      screens.set(key, s);
      after(r, el);
      for (const [k, v] of screens) {  // forget the oldest non-tab screens past ~14
        if (screens.size <= 14) break;
        if (v !== s && !ROOTS.has(k)) { v.el.remove(); screens.delete(k); }
      }
    } else { screens.delete(key); screens.set(key, s); }  // mark as recently used
    s.el.hidden = false;
    cur = s;
    hydrate(s.el);
    window.scrollTo(0, !fresh && (dir === "pop" || dir === "tab") ? s.scroll : 0);
    if (!fresh) refreshNow();
    $$("#tabs a").forEach((a) => a.classList.toggle("on", a.dataset.tab === tabOf(r)));
    $("#tabs").hidden = r.name === "say" || r.name === "search";
    $("#sbtn").hidden = r.name === "say" || r.name === "search";
    if (focusItem && r.name === "day" && focusItem.split("|")[0] === r.a) {  // came from search: show that exact step
      const li = s.el.querySelectorAll(".sched li")[+focusItem.split("|")[1]];
      focusItem = null;
      if (li) setTimeout(() => {  // after the screen-change animation, or the scroll gets cancelled
        const target = () => { const r = li.getBoundingClientRect(); return Math.max(0, window.scrollY + r.top - (innerHeight - r.height) / 2); };
        window.scrollTo({ top: target(), behavior: reduce ? "auto" : "smooth" });
        setTimeout(() => {  // backstop: if smooth scrolling didn't run (screen not drawing), jump there
          const r = li.getBoundingClientRect();
          if (r.top < 0 || r.bottom > innerHeight) window.scrollTo(0, target());
        }, 650);
        li.classList.remove("flash"); void li.offsetWidth; li.classList.add("flash");
      }, dir === "none" ? 30 : 480);
    }
    const on = $("#tabs a.on");
    $("#tabs").style.setProperty("--i", on ? [...$$("#tabs a")].indexOf(on) : 0);
    $("#tabs").classList.remove("mini");
  };
  document.documentElement.dataset.nav = dir;
  if (dir !== "none" && document.startViewTransition && !reduce && lastRoute) {  // pager commits and segment switches draw instantly
    // the swap waits for the next frame; if frames are paused (app just resumed, pane hidden), don't wait
    let ran = false;
    const once = () => { if (!ran) { ran = true; apply(); } };
    const vt = document.startViewTransition(once);
    setTimeout(once, 450);
    // a quick second tap skips the running animation; that's expected, not an error
    vt.ready.catch(() => {}); vt.finished.catch(() => {}); vt.updateCallbackDone.catch(() => {});
  } else apply();
  lastRoute = r; lastKey = key; navDir = "tab";
}
function after(r, el) {
  if (r.name === "day") {
    markSchedule(el, byDay.get(r.a));
  }
  if (r.name === "search") wireSearch(el);
  const codes = el.querySelector(".codes"), dots = [...el.querySelectorAll(".dots i")];
  if (codes && dots.length) codes.addEventListener("scroll", () => {
    const step = codes.firstElementChild.offsetWidth + 12;
    const i = Math.min(dots.length - 1, Math.max(0, Math.round(codes.scrollLeft / step)));
    dots.forEach((d, k) => d.classList.toggle("on", k === i));
  }, { passive: true });
}
function markSchedule(el, d) {
  if (!d || d.date !== todayIso()) return;
  const now = new Date(), n = now.getHours() * 60 + now.getMinutes(); let marked = false;
  el.querySelectorAll(".sched li").forEach((li) => {
    li.classList.remove("is-next", "is-done");
    const m = mins(li.dataset.t); if (m == null) return;
    if (m + 20 < n) li.classList.add("is-done"); else if (!marked) { li.classList.add("is-next"); marked = true; }
  });
}

/* ---------- interactions ---------- */
document.addEventListener("click", (e) => {
  if (e.target.closest("#sbtn")) { e.preventDefault(); openSearch(); return; }
  const sr = e.target.closest(".srow");
  if (sr) { const inp = cur && cur.el.querySelector("#q"); if (inp) rememberQ(inp.value); if (sr.dataset.focus) focusItem = sr.dataset.focus; }
  const a = e.target.closest("a[href^='#']");
  if (a) {
    const r = route(), to = a.getAttribute("href");
    navDir = a.dataset.dir || (to.startsWith("#/day/") && r.name !== "day" ? "push" : to.startsWith("#/ticket/") ? "push"
      : (r.name === "day" || r.name === "ticket" || r.name === "say") && !to.startsWith("#/day/") && !to.startsWith("#/ticket/") ? (a.closest(".tabs") ? "tab" : "pop") : "tab");
    if (to.startsWith("#/ticket/") && r.name === "day") { e.preventDefault(); location.hash = to + "?from=day"; }
    return;
  }
  const b = e.target.closest("[data-act]");
  if (!b) return;
  if (b.dataset.act === "import") pickPack();
  if (b.dataset.act === "replacepack") confirmBox({
    title: "Replace ticket pack?", text: "The tickets on this phone will be removed. You can then import a new ticket pack.",
    ok: "Replace", destructive: true, onOk: clearTickets,
  });
  if (b.dataset.act === "q" || b.dataset.act === "clearq") {
    const inp = cur && cur.el.querySelector("#q");
    if (inp) { inp.value = b.dataset.act === "q" ? b.dataset.v : ""; cur.el._draw(); if (b.dataset.act === "clearq") inp.focus(); }
  }
  if (b.dataset.act === "cancelsearch") { navDir = "pop"; go(searchBack || "#/"); }
  if (b.dataset.act === "copy") navigator.clipboard?.writeText(b.dataset.v).then(() => toast("Booking ref copied"), () => toast(b.dataset.v));
});
window.addEventListener("hashchange", render);

/* ---------- day pager: the page follows your finger, the neighbouring day peeks in, then snaps ---------- */
const pg = { on: false, decided: false, x0: 0, y0: 0, t0: 0, dx: 0, dir: 0, el: null, nb: null, nd: null, busy: false };
function neighbourEl(day) {
  const key = "#/day/" + day.id;
  let s = screens.get(key);
  if (!s) {
    const el = document.createElement("div");
    el.className = "scr"; el.hidden = true; el.innerHTML = viewDay(day.id);
    app.appendChild(el); s = { el, scroll: 0 }; screens.set(key, s);
    after({ name: "day", a: day.id }, el);
    hydrate(el);
  }
  return s.el;
}
function dropPeek() { if (pg.nb) { pg.nb.removeAttribute("style"); pg.nb.hidden = true; } pg.nb = null; pg.nd = null; }
document.addEventListener("touchstart", (e) => {
  if (pg.busy || route().name !== "day" || !cur || e.touches.length !== 1 || e.target.closest(".hs,.codes")) return;
  const t = e.touches[0];
  if (t.clientX < 18 || t.clientX > innerWidth - 18) return;  // leave the screen edges to iOS
  Object.assign(pg, { on: true, decided: false, x0: t.clientX, y0: t.clientY, t0: performance.now(), dx: 0, dir: 0, el: cur.el });
}, { passive: true });
document.addEventListener("touchmove", (e) => {
  if (!pg.on) return;
  const t = e.touches[0], dx = t.clientX - pg.x0, dy = t.clientY - pg.y0;
  if (!pg.decided) {
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    if (Math.abs(dx) < Math.abs(dy) * 1.3) { pg.on = false; return; }  // it's a vertical scroll
    pg.decided = true; pg.t0 = performance.now(); pg.x0 = t.clientX; pg.el.style.transition = "none"; pg.el.style.willChange = "transform";
    return;
  }
  const dir = dx < 0 ? 1 : -1, W = innerWidth;
  if (dir !== pg.dir) {
    dropPeek(); pg.dir = dir;
    const i = D.days.findIndex((d) => d.id === route().a), nd = D.days[i + dir];
    if (nd) {
      pg.nd = nd; pg.nb = neighbourEl(nd);
      Object.assign(pg.nb.style, { position: "fixed", top: "0", left: "0", width: "100%", height: "100vh", overflow: "hidden", zIndex: "5", background: "var(--bg)", transition: "none", willChange: "transform" });
      pg.nb.hidden = false;
    }
  }
  const x = pg.nd ? dx : dx / (1 + Math.abs(dx) / 90);  // rubber band at the first/last day
  pg.dx = x;
  pg.el.style.transform = `translateX(${x}px)`;
  if (pg.nb) pg.nb.style.transform = `translateX(${x + (pg.dir > 0 ? W : -W)}px)`;
}, { passive: true });
function release(cancelled) {
  if (!pg.on) return;
  pg.on = false;
  if (!pg.decided) return;
  const W = innerWidth, v = pg.dx / Math.max(1, performance.now() - pg.t0);
  const commit = !cancelled && pg.nd && (Math.abs(pg.dx) > W * 0.25 || Math.abs(v) > 0.4) && Math.sign(-pg.dx) === pg.dir;
  const ms = reduce ? 0 : commit ? 300 : 360, ease = commit ? "cubic-bezier(.2,.85,.25,1)" : "cubic-bezier(.3,1.35,.5,1)";
  const end = commit ? -pg.dir * W : 0, el = pg.el, nb = pg.nb, nd = pg.nd, dir = pg.dir;
  el.style.transition = `transform ${ms}ms ${ease}`; el.style.transform = `translateX(${end}px)`;
  if (nb) { nb.style.transition = `transform ${ms}ms ${ease}`; nb.style.transform = `translateX(${end + (dir > 0 ? W : -W)}px)`; }
  pg.busy = true;
  setTimeout(() => {
    el.style.transition = el.style.transform = el.style.willChange = "";
    if (commit) {
      if (nb) nb.removeAttribute("style");  // render() swaps the screens in this same frame: no flash
      pg.nb = null; pg.nd = null;
      navDir = "none"; history.pushState(null, "", "#/day/" + nd.id); render();
    } else dropPeek();
    pg.busy = false;
  }, ms + 16);
}
document.addEventListener("touchend", () => release(false), { passive: true });
document.addEventListener("touchcancel", () => release(true), { passive: true });

/* ---------- live "next up": refresh the countdown in place each minute and on return to the app ---------- */
function refreshNow() {
  if (!D || !cur) return;
  const r = route(), t = todayIso(), today = byDay.get(t.replace(/-/g, ""));
  if (!today || (r.name !== "home" && !(r.name === "day" && r.a === today.id))) return;
  const el = cur.el, card = el.querySelector(".next"), nx = nextItem(today);
  if (card && nx) card.outerHTML = nextCard(today, nx, r.name === "day");
  else if (card && !nx) card.remove();
  else if (!card && nx) { screens.delete(keyNow()); el.remove(); cur = null; return render(); }  // first item came into range
  if (r.name === "day") markSchedule(el, today);
}
setInterval(refreshNow, 60000);
setInterval(() => {  // advance the pre-trip slideshow on the visible home screen only
  if (reduce || document.hidden || !cur) return;
  const show = cur.el.querySelector(".hero.slideshow"); if (!show) return;
  const sl = [...show.querySelectorAll(".slide")]; if (sl.length < 2) return;
  const i = sl.findIndex((x) => x.classList.contains("on")), nx = sl[(i + 1) % sl.length];
  sl[i].classList.remove("on"); sl[i].classList.add("was");
  setTimeout(() => sl[i].classList.remove("was"), 1800);
  nx.classList.add("on");
  const c = show.querySelector(".cap");
  if (c) { c.style.opacity = 0; setTimeout(() => { c.innerHTML = nx.dataset.cap; c.style.opacity = 1; }, 380); }
}, 4800);
let lastY = 0;
addEventListener("scroll", () => {
  const y = window.scrollY, bar = $("#tabs");
  if (Math.abs(y - lastY) < 8) return;
  bar.classList.toggle("mini", y > lastY && y > 120);
  lastY = y;
}, { passive: true });
let seenDay = todayIso();
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible" || !D) return;
  const t = todayIso(), today = byDay.get(t.replace(/-/g, ""));
  if (t !== seenDay) { seenDay = t; invalidate(); navDir = "tab"; go(today ? "#/day/" + today.id : keyNow()); return; }  // new day: rebuild, open today
  seenDay = t; refreshNow();
});

/* ---------- tab bar: press and slide your finger along it, like iOS ---------- */
(() => {
  const bar = $("#tabs"), bubble = bar.querySelector(".bubble"), tabs = [...bar.querySelectorAll("a")];
  let sc = null, eatClick = 0;
  const cell = () => (bar.clientWidth - 10) / tabs.length;
  const idxAt = (x) => Math.max(0, Math.min(tabs.length - 1, Math.floor((x - bar.getBoundingClientRect().left - 5) / cell())));
  function place(x) {
    const r = bar.getBoundingClientRect(), w = cell();
    const px = Math.max(0, Math.min(r.width - 10 - w, x - r.left - 5 - w / 2));
    bubble.style.transform = `translateX(${px}px) scale(1.14, 1.1)`;
    const i = idxAt(x); tabs.forEach((t, k) => t.classList.toggle("hover", k === i));
  }
  bar.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    sc = { x0: t.clientX, moved: false };
    bar.classList.add("press");
    bubble.style.transition = "transform .28s cubic-bezier(.2,.9,.25,1.15)";
    place(t.clientX);
  }, { passive: true });
  bar.addEventListener("touchmove", (e) => {
    if (!sc) return;
    const x = e.touches[0].clientX;
    if (Math.abs(x - sc.x0) > 6) { sc.moved = true; bubble.style.transition = "none"; }
    place(x);
  }, { passive: true });
  const end = (e, cancel) => {
    if (!sc) return;
    const x = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : sc.x0, moved = sc.moved;
    sc = null;
    bar.classList.remove("press");
    tabs.forEach((t) => t.classList.remove("hover"));
    bubble.style.transition = ""; bubble.style.transform = "";  // spring back to the CSS position (--i)
    if (cancel || !moved) return;  // a plain tap is handled by the link itself
    const to = tabs[idxAt(x)];
    eatClick = Date.now();
    bar.style.setProperty("--i", tabs.indexOf(to));
    navDir = "tab";
    if (to.getAttribute("href") !== keyNow()) location.hash = to.getAttribute("href"); else render();
  };
  bar.addEventListener("touchend", (e) => end(e, false), { passive: true });
  bar.addEventListener("touchcancel", (e) => end(e, true), { passive: true });
  bar.addEventListener("click", (e) => { if (Date.now() - eatClick < 500) { e.preventDefault(); e.stopPropagation(); } }, true);
})();

/* ---------- "Update ready" pill: the new version is downloaded and waiting ---------- */
function showUpdatePill() {
  if ($("#upd")) return;
  const el = document.createElement("button");
  el.id = "upd"; el.type = "button"; el.className = "upd glass";
  el.innerHTML = `${ic("down")}<span>Update ready</span><b>Reload</b>`;
  el.addEventListener("click", () => location.reload());
  document.body.appendChild(el);
}

/* ---------- iOS-style alert ---------- */
function confirmBox({ title, text, ok, destructive, onOk }) {
  const back = document.activeElement;
  const wrap = document.createElement("div");
  wrap.className = "alert-wrap";
  wrap.innerHTML = `<div class="alert glass" role="alertdialog" aria-modal="true" aria-labelledby="al-t" aria-describedby="al-d">
    <h2 id="al-t">${esc(title)}</h2><p id="al-d">${esc(text)}</p>
    <div class="alert-btns"><button type="button" class="ab" data-r="0">Cancel</button><button type="button" class="ab${destructive ? " danger" : " primary"}" data-r="1">${esc(ok)}</button></div></div>`;
  const close = (yes) => {
    wrap.classList.add("out");
    document.removeEventListener("keydown", onKey);
    setTimeout(() => wrap.remove(), reduce ? 0 : 180);
    if (back && back.focus) back.focus();
    if (yes) onOk();
  };
  const onKey = (e) => { if (e.key === "Escape") close(false); };
  wrap.addEventListener("click", (e) => { const btn = e.target.closest("[data-r]"); if (btn) close(btn.dataset.r === "1"); else if (e.target === wrap) close(false); });
  document.addEventListener("keydown", onKey);
  document.body.appendChild(wrap);
  wrap.querySelector('[data-r="0"]').focus();
}
async function clearTickets() {
  try { await kv("delete", "pack"); } catch (_) {}
  ticketUrls.forEach((u) => URL.revokeObjectURL(u)); ticketUrls = [];
  T = null; byTicket.clear(); INDEX = null;
  invalidate(); navDir = "none"; go("#/tickets");
  toast("Ticket pack removed from this phone");
}

/* ---------- ticket pack import ---------- */
function pickPack() {
  const inp = document.createElement("input");
  inp.type = "file";
  inp.onchange = async () => {
    const f = inp.files && inp.files[0];
    if (!f) return;
    try {
      const buf = await f.arrayBuffer();
      const pack = await unseal(buf);
      if (!pack || !Array.isArray(pack.tickets)) throw new Error("not a pack");
      await kv("put", "pack", buf);
      try { await navigator.storage?.persist?.(); } catch (_) {}
      await setTickets(pack);
      toast(`${pack.tickets.length} tickets saved on this phone`);
      invalidate(); render();
    } catch (err) {
      toast("That file isn't this trip's ticket pack");
    }
  };
  inp.click();
}
const blobUrl = async (dataUri) => URL.createObjectURL(await (await fetch(dataUri)).blob());
let ticketUrls = [];
async function setTickets(pack) {
  ticketUrls.forEach((u) => URL.revokeObjectURL(u)); ticketUrls = [];
  for (const t of pack.tickets) {
    t.codes = await Promise.all(t.codes.map(async (c) => ({ ...c, img: await blobUrl(c.img) })));
    t.pages = await Promise.all(t.pages.map(blobUrl));
    t.codes.forEach((c) => ticketUrls.push(c.img)); ticketUrls.push(...t.pages);
  }
  T = pack; byTicket.clear(); pack.tickets.forEach((t) => byTicket.set(t.id, t)); INDEX = null;
}

/* ---------- boot ---------- */
function sprite() {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("width", "0"); s.setAttribute("height", "0"); s.style.position = "absolute"; s.setAttribute("aria-hidden", "true");
  s.innerHTML = Object.entries(ICONS).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join("");
  document.body.prepend(s);
}
function lock(title, msg) {
  app.innerHTML = `<div class="lock"><span class="boot-mark" style="animation:none"></span><h1>${esc(title)}</h1><p>${esc(msg)}</p></div>`;
}
async function boot() {
  sprite();
  const fromLink = new URL(location.href).searchParams.get("k");
  let saved = null;
  try { saved = localStorage.getItem("k"); } catch (_) {}
  const keys = [...new Set([fromLink, saved].filter(Boolean))];
  if (!keys.length) return lock("Locked", "Open this app from the link you were sent.");
  let buf;
  try { buf = await (await fetch("data.bin")).arrayBuffer(); }
  catch (e) { return lock("Not downloaded yet", "Open the link again on Wi-Fi to finish downloading."); }
  for (const k of keys) {  // only a key that actually opens the trip is remembered
    try { KEY = k; D = await unseal(buf); try { localStorage.setItem("k", k); } catch (_) {} break; } catch (_) { D = null; }
  }
  if (!D) return lock("Locked", "This link doesn't open anything. Use the link you were sent.");
  // only now that it's unlocked does the app say what it is (also the name offered by Add to Home Screen)
  document.title = D.trip.name;
  document.querySelector('meta[name="apple-mobile-web-app-title"]').setAttribute("content", D.trip.name);
  D.days.forEach((d) => byDay.set(d.id, d));
  D.tickets.forEach((t) => stubs.set(t.id, t));
  try { const buf = await kv("get", "pack"); if (buf) await setTickets(await unseal(buf)); } catch (_) {}
  const bootMark = app.querySelector(".boot"); if (bootMark) bootMark.remove();
  $("#tabs").hidden = false;
  $("#sbtn").hidden = false;
  if (!location.hash && tripState() === "during") { const t = byDay.get(todayIso().replace(/-/g, "")); if (t) history.replaceState(null, "", "#/day/" + t.id); }
  render();
  setTimeout(preloadPhotos, 900);
  if ("serviceWorker" in navigator) {
    // iOS only checks for a new version on a cold start; also check whenever the app comes back to the front
    let reg = null, had = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register("sw.js").then((r) => { reg = r; r.update().catch(() => {}); }).catch(() => {});
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && reg) reg.update().catch(() => {}); });
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (had) showUpdatePill(); had = true; });
  }
}
boot();
