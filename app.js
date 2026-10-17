/* Offline companion. Data arrives encrypted (data.bin); the key comes from the install link (?k=).
   Tickets are imported on each phone from a pack file and kept only in this app's storage. */
"use strict";

const ICONS = {
  pass: '<path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v2a2 2 0 0 0 0 4v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-4a2 2 0 0 0 0-4Z"/><path d="M9.5 4v16" stroke-dasharray="1.5 2.5"/>',
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
async function unseal(buf) {
  const key = await crypto.subtle.importKey("raw", b64u(KEY), "AES-GCM", false, ["decrypt"]);
  const bytes = new Uint8Array(buf);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes.slice(0, 12) }, key, bytes.slice(12));
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
    const q = op === "get" ? tx.objectStore("kv").get(k) : tx.objectStore("kv").put(v, k);
    q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error);
  });
}

/* ---------- helpers ---------- */
const photo = (slug) => (slug && D.photos[slug]) || null;
const bg = (slug) => { const p = photo(slug); return p ? ` style="--img:url('${p}')"` : ""; };
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
const plain = (html) => html.replace(/<[^>]+>/g, "");

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
  return `<a class="${cls}" href="#/day/${d.id}"${bg(d.photo)}>${d.date === t ? '<span class="today-tag">Today</span>' : ""}
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
    hero = `<a class="hero lg-${first.leg}" href="#/day/${first.id}"${bg(D.legs[0].photo)}>
      <div class="hero-top"><span class="chip-glass">${ic("plane")}${esc(legName(first.leg))} first</span><span class="chip-glass">${n === 1 ? "Tomorrow" : "In " + n + " days"}</span></div>
      <div class="hero-bot"><span class="hero-big tnum">${n}</span><span class="hero-title">${n === 1 ? "day" : "days"} until ${esc(D.trip.title)}</span>
      <span class="hero-sub">${D.legs.map((l) => esc(l.name)).join(" · ")} · ${D.days.length} days</span></div></a>`;
  } else if (st === "during" && today) {
    hero = `<a class="hero lg-${today.leg}" href="#/day/${today.id}"${bg(today.photo)}>
      <div class="hero-top"><span class="chip-glass">${ic("sun")}Today · ${fmt(today.date)}</span><span class="chip-glass">${esc(legName(today.leg))}</span></div>
      <div class="hero-bot"><span class="hero-title">${esc(today.title)}</span><span class="hero-sub">Tap for today's plan</span></div></a>`;
    const nx = nextItem(today);
    if (nx) hero += nextCard(today, nx);
  } else {
    const last = D.days[D.days.length - 1];
    hero = `<a class="hero lg-${last.leg}" href="#/day/${last.id}"${bg(D.legs[2].photo)}><div class="hero-top"><span class="chip-glass">Trip complete</span></div>
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
  return `<header class="lt"><div><h1>${esc(D.trip.title)}</h1><p>${esc(D.trip.sub)}</p></div></header>${hero}${nudge}${legs}`;
}

function nextCard(day, it, onDay) {
  const m = mins(it.t), now = new Date(), n = now.getHours() * 60 + now.getMinutes();
  const diff = m - n, when = diff <= 0 ? "now" : diff < 60 ? `in ${diff} min` : `in ${Math.floor(diff / 60)} h ${diff % 60} min`;
  const place = it.maps[0];
  const tk = day.tickets[0];
  return `<div class="next lg-${day.leg}"><div class="next-row"><span class="next-time tnum">${esc(it.t)}<small>${when}</small></span>
    <span class="next-what">${plain(it.html)}</span></div><div class="btnrow">
    ${place ? `<a class="btn leg" href="${esc(place.url)}">${ic(place.drive ? "car" : "nav")}${place.drive ? "Drive" : "Directions"}</a>` : ""}
    ${tk ? `<a class="btn leg" href="#/ticket/${tk}">${ic("qr")}Ticket</a>` : ""}${onDay ? "" : `<a class="btn leg" href="#/day/${day.id}">Full day</a>`}</div></div>`;
}

function viewDay(id) {
  const d = byDay.get(id);
  if (!d) return viewHome();
  const i = D.days.indexOf(d), prev = D.days[i - 1], next = D.days[i + 1];
  const p = photo(d.photo), dd = dObj(d.date);
  let out = `<div class="dhero lg-${d.leg}${p ? "" : " noimg"}"${bg(d.photo)}>
    <div class="topbar"><a class="gbtn" href="#/" data-dir="pop" aria-label="All days">${ic("left")}</a><span class="sp"></span>
      <a class="gbtn${prev ? "" : " off"}" href="${prev ? "#/day/" + prev.id : "#/"}" data-dir="prev" aria-label="Previous day">${ic("left")}</a>
      <a class="gbtn${next ? "" : " off"}" href="${next ? "#/day/" + next.id : "#/"}" data-dir="next" aria-label="Next day">${ic("right")}</a></div>
    <div class="dhero-tx"><span class="when">${WD[dd.getDay()]} ${dd.getDate()} ${MON[dd.getMonth()]} · ${esc(legName(d.leg))}${d.hol ? `<span class="hol">${esc(d.hol)}</span>` : ""}</span>
    <h1>${esc(d.title)}</h1></div></div>`;
  out += `<div class="lg-${d.leg}">`;
  if (d.rise) out += `<div class="sunrow"><span class="pill">${ic("rise", "ic r")}${esc(d.rise)}</span><span class="pill">${ic("set", "ic s")}${esc(d.set)}</span>${d.place ? `<span class="pill">${ic("pin")}${esc(d.place)}</span>` : ""}</div>`;
  if (d.note) out += `<p class="foot" style="margin:10px 22px 0">${esc(d.note)}</p>`;
  if (d.date === todayIso()) { const nx = nextItem(d); if (nx) out += nextCard(d, nx, true); }
  if (d.tickets.length) {
    out += `<section class="sec"><div class="sec-h"><h2>Tickets</h2>${T ? "" : '<a href="#/tickets">Import</a>'}</div><div class="hs">${d.tickets.map((tid) => {
      const s = stubs.get(tid), full = byTicket.get(tid);
      return `<a class="mpass lg-${d.leg}${full ? "" : " locked"}" href="#/ticket/${tid}"><b>${esc(s ? s.name : tid)}</b><span>${esc(s ? s.when : "")}</span><span class="qr">${ic("qr")}</span></a>`;
    }).join("")}</div></section>`;
  }
  out += `<section class="sec"><div class="sec-h"><h2>Plan</h2>${d.drive ? `<span>${ic("car", "ic")} Car day</span>` : ""}</div><ol class="sched">${d.items.map((it) => {
    const places = it.maps.map((m) => `<a class="place" href="${esc(m.url)}"><span class="ph"${bg(m.photo)}>${photo(m.photo) ? "" : ic("pin")}</span>
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
      ? `<a class="row" href="${esc(h.url)}" style="--inset:61px"><span class="tile">${ic("bed")}</span><span class="tx"><b>${esc(h.name)}</b><span>${esc(h.address)}</span></span><span class="go-ic" style="display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--tint);color:#fff">${ic("nav")}</span></a>`
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

function viewTickets() {
  let out = `<header class="lt"><div><h1>Tickets</h1><p>${T ? `${T.tickets.length} tickets · on this phone only` : "Not imported yet"}</p></div>${T ? `<button class="act" data-act="import" aria-label="Update tickets">${ic("down")}</button>` : ""}</header>`;
  if (!T) return out + importBlock(false);
  const t = todayIso();
  const list = [...T.tickets].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  out += `<div class="wallet">${list.map((tk) => {
    const day = D.days.find((d) => d.tickets.includes(tk.id));
    const leg = day ? day.leg : "munich";
    const dd = tk.date ? dObj(tk.date) : null;
    const time = (/(\d{1,2}[:.]\d{2})/.exec(tk.when) || [])[1] || "";
    return `<a class="wpass lg-${leg}${tk.date && tk.date < t ? " is-past" : ""}" href="#/ticket/${tk.id}" data-dir="push">
      <div class="h"><b>${esc(tk.name)}</b><span>${dd ? `${WD[dd.getDay()]} ${MON[dd.getMonth()]}<em>${dd.getDate()}</em>` : ""}</span></div>
      <div class="f"><div><small>Time</small><b>${esc(time || "—")}</b></div><div><small>Codes</small><b>${tk.codes.length || "PDF"}</b></div><div><small>Ref</small><b>${esc(tk.ref)}</b></div></div></a>`;
  }).join("")}</div><p class="foot" style="margin:18px 20px 0">Pack from ${esc(T.built)}. New bookings? Rebuild the pack on the Mac and import it again; it replaces this set.</p>`;
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

function viewBookings() {
  let out = `<header class="lt"><div><h1>Bookings</h1><p>${D.bookings.filter((b) => b.ok).length} of ${D.bookings.length} booked</p></div></header>`;
  for (const l of D.legs) {
    const bs = D.bookings.filter((b) => b.leg === l.key);
    if (!bs.length) continue;
    out += `<section class="sec lg-${l.key}"><div class="sec-h"><h2><i></i>${esc(l.name)}</h2><span>${bs.filter((b) => b.ok).length}/${bs.length}</span></div><div class="list">${bs.map((b) => {
      const href = b.ticket ? `#/ticket/${b.ticket}` : b.href;
      const tag = href ? "a" : "div";
      return `<${tag} class="row"${href ? ` href="${esc(href)}"` : ""}><span class="tx"><b style="font-size:15.5px">${esc(b.what)}</b><span>${esc(b.when)}</span></span>
        ${b.ok ? `<span class="badge ok">${ic("check")}Booked</span>` : `<span class="badge">${esc(b.status)}</span>`}</${tag}>`;
    }).join("")}</div></section>`;
  }
  return out + `<p class="foot" style="margin:14px 22px 0">Website links need internet.</p>`;
}

function viewInfo() {
  const L = (rows) => `<div class="list">${rows.join("")}</div>`;
  let out = `<header class="lt"><div><h1>Info</h1><p>Hotels, emergency, phrases</p></div></header>`;
  out += `<section class="sec"><div class="sec-h"><h2>Hotels</h2></div>${L(D.hotels.map((h) => {
    const rng = `${fmt(h.from).slice(4)} – ${fmt(h.to).slice(4)}`;
    return h.name ? `<a class="row" href="${esc(h.url)}" style="--inset:61px"><span class="tile">${ic("bed")}</span><span class="tx"><b>${esc(h.city)} · ${esc(h.name)}</b><span>${rng} · ${esc(h.address)}</span></span>${ic("right", "ic chev")}</a>`
      : `<div class="row" style="--inset:61px"><span class="tile" style="background:var(--card-3)">${ic("bed")}</span><span class="tx"><b>${esc(h.city)}</b><span>${rng} · ${esc(h.note)}</span></span><span class="badge">To add</span></div>`;
  }))}</section>`;
  out += `<section class="sec"><div class="sec-h"><h2>Emergency</h2></div>${L(D.emergency.map((e) => `<a class="row" href="tel:${esc(e.number)}" style="--inset:61px"><span class="tile" style="background:var(--red)">${ic("phone")}</span><span class="tx"><b>${esc(e.label)}</b>${e.note ? `<span>${esc(e.note)}</span>` : ""}</span><span class="num tnum">${esc(e.number)}</span></a>`)
    .concat(D.emergencyTodo.map((x) => `<div class="row" style="--inset:61px"><span class="tile" style="background:var(--card-3)">${ic("alert")}</span><span class="tx"><b style="font-size:16px">${esc(x)}</b></span><span class="badge">To add</span></div>`)))}
    <p class="foot">${esc(D.pharmacy)}</p></section>`;
  out += Object.entries(D.phrases).map(([lang, items], li) => `<section class="sec"><div class="sec-h"><h2>${esc(lang.split(" (")[0])}</h2><span>Tap to show</span></div>${L(items.map(([en, fx], i) =>
    `<a class="row" href="#/say/${li}/${i}" data-dir="push"><span class="tx"><b>${esc(fx)}</b><span>${esc(en)}</span></span>${ic("right", "ic chev")}</a>`))}</section>`).join("");
  out += `<section class="sec"><div class="sec-h"><h2>Maps offline</h2></div>${L(D.tips.map((t) => `<div class="row" style="--inset:61px"><span class="tile" style="background:var(--green)">${ic("map")}</span><span class="tx"><span style="color:var(--label);font-size:15px">${esc(t)}</span></span></div>`))}</section>`;
  const notes = D.legs.flatMap((l) => l.notes.map((n) => `<div class="row"><span class="tx"><span style="color:var(--label-2);font-size:15px">${n}</span></span></div>`));
  if (notes.length) out += `<section class="sec"><div class="sec-h"><h2>Closures &amp; notes</h2></div>${L(notes)}</section>`;
  out += `<section class="sec"><div class="sec-h"><h2>This app</h2></div>${L([
    `<button class="row" data-act="import" style="--inset:61px"><span class="tile">${ic("down")}</span><span class="tx"><b>${T ? "Update tickets" : "Import tickets"}</b><span>${T ? `Pack from ${esc(T.built)}` : "Ticket pack from the Mac"}</span></span></button>`,
    `<div class="row" style="--inset:61px"><span class="tile" style="background:var(--card-3)">${ic("info")}</span><span class="tx"><b>Plan updated ${esc(D.built)}</b><span>Updates arrive automatically when you're online</span></span></div>`])}
    <p class="credit" style="margin-top:14px">Photos from Wikimedia Commons and Unsplash: ${D.credits.map((c) => `${esc(c.what)} — ${esc(c.artist)}, ${esc(c.license)}`).join(" · ")}</p></section>`;
  return out;
}

function viewCafes() {
  let out = `<header class="lt"><div><h1>Cafés</h1><p>Cafés, treats and shops · tap for Maps</p></div></header>`;
  for (const l of D.legs) {
    if (!l.cafes.length) continue;
    out += `<section class="sec lg-${l.key}"><div class="sec-h"><h2><i></i>${esc(l.name)}</h2><span>${l.cafes.length}</span></div><div class="grid2">${l.cafes.map((c) => {
      const p = photo(c.photo);
      return `<a class="ccard" href="${esc(c.url)}"><span class="ph${p ? "" : " noimg"}"${bg(c.photo)}>${p ? "" : `<b>${esc(c.name.replace(/^(Café|Confiserie|Konditorei) /, "")[0])}</b>`}</span>
        <span class="tx"><b>${esc(c.name)}</b><span>${esc(c.desc)}${c.when ? " · " + esc(c.when) : ""}</span></span></a>`;
    }).join("")}</div></section>`;
  }
  return out;
}

function viewSay(li, i) {
  const [lang, items] = Object.entries(D.phrases)[+li] || [];
  const p = items && items[+i];
  if (!p) return viewInfo();
  return `<div class="say"><a class="gbtn" href="#/info" data-dir="pop" aria-label="Close">${ic("close")}</a><b>${esc(p[1])}</b><span>${esc(p[0])}</span></div>`;
}

/* ---------- router ----------
   Screens are kept alive once built (photos are blob URLs, so they stay decoded): going back is
   instant and lands where you were. A small LRU keeps memory in check. */
let navDir = "tab", lastRoute = null, cur = null, lastKey = "#/";
const screens = new Map();
const ROOTS = new Set(["#/", "#/tickets", "#/bookings", "#/cafes", "#/info"]);
function route() {
  const parts = (location.hash.replace(/^#\/?/, "").split("?")[0] || "").split("/").filter(Boolean);
  const [name = "home", a, b] = parts;
  return { name, a, b };
}
const keyNow = () => (location.hash && location.hash !== "#" ? location.hash : "#/");
function tabOf(r) { return { home: "days", day: "days", tickets: "tickets", ticket: "tickets", bookings: "bookings", cafes: "cafes", info: "info", say: "info" }[r.name] || "days"; }
function viewFor(r) {
  return r.name === "day" ? viewDay(r.a) : r.name === "ticket" ? viewTicket(r.a) : r.name === "tickets" ? viewTickets()
    : r.name === "bookings" ? viewBookings() : r.name === "cafes" ? viewCafes() : r.name === "info" ? viewInfo()
    : r.name === "say" ? viewSay(r.a, r.b) : viewHome();
}
function invalidate() { screens.forEach((s) => s.el.remove()); screens.clear(); cur = null; }
// navigate, and still draw when the hash is already there (no hashchange would fire)
function go(hash) { if (keyNow() === hash) render(); else location.hash = hash; }
function render() {
  const r = route(), key = keyNow(), dir = navDir;
  const apply = () => {
    if (cur) { cur.scroll = window.scrollY; cur.el.hidden = true; }
    let s = screens.get(key);
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
    window.scrollTo(0, !fresh && (dir === "pop" || dir === "tab") ? s.scroll : 0);
    if (!fresh) refreshNow();
    $$("#tabs a").forEach((a) => a.classList.toggle("on", a.dataset.tab === tabOf(r)));
    $("#tabs").hidden = r.name === "say";
    const on = $("#tabs a.on");
    $("#tabs").style.setProperty("--i", on ? [...$$("#tabs a")].indexOf(on) : 0);
    $("#tabs").classList.remove("mini");
  };
  document.documentElement.dataset.nav = dir;
  if (document.startViewTransition && !reduce && lastRoute) {
    const vt = document.startViewTransition(apply);
    // a quick second tap skips the running animation; that's expected, not an error
    vt.ready.catch(() => {}); vt.finished.catch(() => {}); vt.updateCallbackDone.catch(() => {});
  } else apply();
  lastRoute = r; lastKey = key; navDir = "tab";
}
function after(r, el) {
  if (r.name === "day") {
    markSchedule(el, byDay.get(r.a));
  }
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
  if (b.dataset.act === "copy") navigator.clipboard?.writeText(b.dataset.v).then(() => toast("Booking ref copied"), () => toast(b.dataset.v));
});
window.addEventListener("hashchange", render);

// swipe between days
let sx = 0, sy = 0, st = 0;
document.addEventListener("touchstart", (e) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; st = Date.now(); }, { passive: true });
document.addEventListener("touchend", (e) => {
  const r = route(); if (r.name !== "day" || e.target.closest(".hs,.codes")) return;
  const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
  if (Math.abs(dx) < 70 || Math.abs(dy) > 45 || Date.now() - st > 600 || sx < 24) return;
  const i = D.days.findIndex((d) => d.id === r.a), to = D.days[i + (dx < 0 ? 1 : -1)];
  if (to) { navDir = dx < 0 ? "next" : "prev"; location.hash = "#/day/" + to.id; }
}, { passive: true });

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
  T = pack; byTicket.clear(); pack.tickets.forEach((t) => byTicket.set(t.id, t));
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
  await Promise.all(Object.keys(D.photos).map(async (k) => { D.photos[k] = await blobUrl(D.photos[k]); }));  // decode once, reuse everywhere
  try { const buf = await kv("get", "pack"); if (buf) await setTickets(await unseal(buf)); } catch (_) {}
  app.innerHTML = "";
  $("#tabs").hidden = false;
  if (!location.hash && tripState() === "during") { const t = byDay.get(todayIso().replace(/-/g, "")); if (t) history.replaceState(null, "", "#/day/" + t.id); }
  render();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
    let had = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (had) toast("Trip updated. Reopen the app to see changes."); had = true; });
  }
}
boot();
