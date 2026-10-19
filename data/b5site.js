/* ==========================================================
   Base 5 - small things on every page
   Loaded in the <head> of every page:
     <script src="/data/b5site.js?v=1"></script>
   Straight away (before the page draws):
     - a tab icon: the bridge for the main site, the HQ's
       initials in its own colours inside an HQ
     - soft fades between pages (off for reduced motion)
   Once the page is ready:
     - a Home button in the bottom left corner (HQ home inside
       an HQ; Base 5 home on an HQ's own home page)
     - remembers which HQ this device last opened, so the home
       page can put it first (b5.myhq.v1)
   Guest mode, for parents and visitors (started from /guest/):
     - a slim banner on every page saying what guest mode is
     - everything the page saves goes into this tab only
       (sessionStorage), so a guest never sees a student's work,
       never changes it, and nothing syncs or sends
     ?guest=1 turns it on, ?guest=0 turns it off; b5.guest.v1
   In an HQ, when the shared memory is switched on (SYNC_URL below,
   see /teacher/sync.html), progress follows the student between
   devices: the second half of this file.
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(window.B5Site) return;

/* ---------- guest mode ---------- */
var GKEY = "b5.guest.v1", GUEST = false;
try{
  var gq = (location.search.match(/[?&]guest=([01])/) || [])[1];
  if(gq === "1") localStorage.setItem(GKEY, "1");
  if(gq === "0") localStorage.removeItem(GKEY);
  GUEST = localStorage.getItem(GKEY) === "1";
}catch(e){}
if(GUEST){
  /* every save on this page goes to a scratch copy for this tab only */
  try{
    var LSG = window.localStorage, SSG = window.sessionStorage, pg = Object.getPrototypeOf(LSG);
    var gGet = pg.getItem, gSet = pg.setItem, gRem = pg.removeItem;
    var real = function(k){ return k === GKEY; };
    pg.getItem = function(k){ if(this === LSG && !real(k)) return gGet.call(SSG, "guest:" + k); return gGet.apply(this, arguments); };
    pg.setItem = function(k, v){ if(this === LSG && !real(k)) return gSet.call(SSG, "guest:" + k, v); return gSet.apply(this, arguments); };
    pg.removeItem = function(k){ if(this === LSG && !real(k)) return gRem.call(SSG, "guest:" + k); return gRem.apply(this, arguments); };
  }catch(e){}
}

/* The shared memory: the Google Sheet web app address. Empty means off.
   A device can try another address with localStorage b5.sync.url. */
var SYNC_URL = "https://script.google.com/a/macros/chiltonbridgeschool.co.uk/s/AKfycbxW2fhiuNntbardG07n5CCk08pxLzLxzESjA5k67l5aUODzlUTjKpYHX2cDQDaYokyB6A/exec";
try{ SYNC_URL = localStorage.getItem("b5.sync.url") || SYNC_URL; }catch(e){}
if(GUEST) SYNC_URL = "";

var path = location.pathname;
var HQS = {
  "/egw/":   { who: "EGW", prefix: "b5.egw.", bg: "#2d2466", ink: "#ffe28a" },
  "/lp/":    { who: "LP", prefix: "b5.lp.",  bg: "#e2557a", ink: "#ffffff" },
  "/lw/":    { who: "LW", prefix: "b5.lw.",  bg: "#7d1424", ink: "#ffc247" },
  "/lc/":    { who: "LC", prefix: "b5.lc.",  bg: "#0b1416", ink: "#c9f7d8" },
  "/hk/":    { who: "HK", prefix: "b5.hk.",  bg: "#0b1622", ink: "#ff7a1a" },
  "/jt-hq/": { who: "JT", prefix: "b5.jthq.",  bg: "#1f8a3c", ink: "#ffffff" }
};
/* project pages follow their student between devices too (sync only) */
var PROJECTS = {
  "/projects/egw.html": { who: "EGW", prefix: "b5.project.egw." },
  "/projects/lp.html":  { who: "LP",  prefix: "b5.project.lp." },
  "/projects/lw.html":  { who: "LW",  prefix: "b5.project.lw." },
  "/projects/lc.html":  { who: "LC",  prefix: "b5.project.lc." },
  "/projects/hk.html":  { who: "HK",  prefix: "b5-project-hk" },
  "/projects/jt.html":  { who: "JT",  prefix: "b5.project.jt." },
  /* Autumn 1 projects, kept safe: same students, same saved work */
  "/autumn-1/projects/egw.html": { who: "EGW", prefix: "b5.project.egw." },
  "/autumn-1/projects/lp.html":  { who: "LP",  prefix: "b5.project.lp." },
  "/autumn-1/projects/lw.html":  { who: "LW",  prefix: "b5.project.lw." },
  "/autumn-1/projects/lc.html":  { who: "LC",  prefix: "b5.project.lc." },
  "/autumn-1/projects/hk.html":  { who: "HK",  prefix: "b5-project-hk" },
  "/autumn-1/projects/jt.html":  { who: "JT",  prefix: "b5.project.jt." }
};
var base = null, hq = null;
Object.keys(HQS).forEach(function(b){ if(path.indexOf(b) === 0){ base = b; hq = HQS[b]; } });

/* ---------- tab icon ---------- */
function svgIcon(){
  if(hq){
    var fs = hq.who.length > 2 ? 26 : 34;
    return "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='" + hq.bg + "'/>" +
      "<text x='32' y='" + (fs > 30 ? 44 : 41) + "' text-anchor='middle' font-family='Arial Black,Arial,sans-serif' font-weight='900' font-size='" + fs + "' fill='" + hq.ink + "'>" + hq.who + "</text></svg>";
  }
  return "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='#fffdf8'/>" +
    "<path d='M6 44 Q32 8 58 44' fill='none' stroke='#007291' stroke-width='6' stroke-linecap='round'/>" +
    "<path d='M20 28v22M32 22v28M44 28v22' stroke='#7fb8c6' stroke-width='3'/>" +
    "<path d='M4 50h56' stroke='#0a2f38' stroke-width='6' stroke-linecap='round'/>" +
    "<circle cx='52' cy='14' r='7' fill='#ef7724'/></svg>";
}
try{
  [].forEach.call(document.querySelectorAll("link[rel~='icon']"), function(l){ l.parentNode.removeChild(l); });
  var link = document.createElement("link");
  link.rel = "icon"; link.type = "image/svg+xml";
  link.href = "data:image/svg+xml," + encodeURIComponent(svgIcon());
  document.head.appendChild(link);
}catch(e){}

/* ---------- soft fades between pages ---------- */
var fade = document.createElement("style");
fade.textContent =
  "@media (prefers-reduced-motion:no-preference){" +
    "@view-transition{navigation:auto}" +
    "::view-transition-old(root){animation:b5out .22s ease both}" +
    "::view-transition-new(root){animation:b5in .32s ease both}" +
  "}" +
  "@keyframes b5out{to{opacity:0}}" +
  "@keyframes b5in{from{opacity:0;transform:translateY(8px)}}" +
  /* the home button */
  "html body>.b5home{position:fixed !important;z-index:2147482400 !important;left:14px;bottom:14px}" +
  ".b5home{display:inline-flex;align-items:center;gap:7px;padding:9px 14px 9px 11px;border-radius:999px;border:2px solid #0a2f38;background:#fffdf8;color:#0a2f38;" +
    "font:700 .9rem/1 'Atkinson Hyperlegible',Arial,sans-serif;text-decoration:none;box-shadow:0 3px 0 rgba(10,47,56,.35);opacity:.92}" +
  ".b5home:hover,.b5home:focus-visible{opacity:1;transform:translateY(-2px)}" +
  ".b5home:focus-visible{outline:3px solid #ef7724;outline-offset:2px}" +
  ".b5home svg{width:18px;height:18px;flex:none}" +
  ".b5home.up{bottom:72px}" +
  "@media print{.b5home{display:none !important}}";
document.head.appendChild(fade);

/* ---------- remember this device's HQ ---------- */
if(hq && !GUEST && !/teacher\.html$/.test(path)){
  try{ localStorage.setItem("b5.myhq.v1", hq.who); }catch(e){}
}

/* ---------- home button ---------- */
var HOUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v10h4.5v-6h3v6H18V10" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/></svg>';
function homeButton(){
  if(path === "/" || path === "/index.html" || path.indexOf("/board") === 0) return;
  if(document.querySelector(".b5home") || document.documentElement.hasAttribute("data-no-home")) return;
  var href = "/", label = "Home";
  if(hq){
    var isHqHome = path === base || path === base + "index.html";
    if(!isHqHome){ href = base; label = "HQ home"; }
    else label = "Base 5";
  }
  var a = document.createElement("a");
  a.className = "b5home"; a.href = href;
  a.innerHTML = HOUSE + "<span>" + label + "</span>";
  a.setAttribute("aria-label", label === "HQ home" ? hq.who + " HQ home" : label === "Base 5" ? "Base 5 home page" : "Base 5 home page");
  document.body.appendChild(a);
  /* step up out of the way of anything else in that corner (LC's read it to me) */
  function nudge(){ a.classList.toggle("up", !!document.querySelector(".lcr-btn")); }
  nudge(); setTimeout(nudge, 800); setTimeout(nudge, 2500);
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", homeButton); else homeButton();

/* ---------- the guest banner ---------- */
function guestBanner(){
  if(!GUEST || document.querySelector(".b5guest") || path.indexOf("/board") === 0) return;
  var st = document.createElement("style");
  st.textContent =
    ".b5guest{position:relative;z-index:2147482300;display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;padding:9px 16px;background:#ffc247;color:#0a2f38;border-bottom:3px solid #0a2f38;font:600 .92rem/1.35 'Atkinson Hyperlegible',Arial,sans-serif}" +
    ".b5guest b{font-family:Archivo,Arial,sans-serif;font-weight:900;letter-spacing:.12em;text-transform:uppercase;font-size:.72rem;background:#0a2f38;color:#ffc247;border-radius:999px;padding:4px 10px}" +
    ".b5guest a{color:#0a2f38;font-weight:700}" +
    ".b5guest .gx{margin-left:auto;display:flex;gap:12px}" +
    "@media print{.b5guest{display:none}}";
  document.head.appendChild(st);
  var b = document.createElement("div");
  b.className = "b5guest"; b.setAttribute("role", "note");
  b.innerHTML = "<b>Guest mode</b><span>Look around as much as you like. Nothing you do is saved or sent, and no student's own work is shown.</span>" +
    "<span class='gx'><a href='/guest/'>About Base 5</a><a href='/guest/?guest=0' data-leave>Leave guest mode</a></span>";
  document.body.insertBefore(b, document.body.firstChild);
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", guestBanner); else guestBanner();

/* ---------- talking to the sheet ----------
   The web app is school-only, so the site cannot call it directly.
   Instead a small page from the web app (?bridge=1) opens in a
   hidden frame, signed in as whoever is using the device, and
   passes requests through. B5Site.call(action, data) returns a
   promise of the sheet's answer. If the bridge does not open
   (signed out, or the device blocks it) every call fails quietly
   and the site carries on as before. */
var bridges = {}, DOWN = "b5.bridge.down";
/* if the bridge would not open in the last ten minutes, do not keep waiting for it */
function bridgeDown(){
  try{ var t = +sessionStorage.getItem(DOWN) || 0; return Date.now() - t < 600000; }catch(e){ return false; }
}
function bridgeFor(url){
  if(bridges[url]) return bridges[url];
  var waiting = {}, seq = 0, target = null, origin = null;
  var ready = new Promise(function(res, rej){
    var t = setTimeout(function(){
      try{ sessionStorage.setItem(DOWN, String(Date.now())); }catch(e){}
      rej(new Error("no bridge"));
    }, 10000);
    window.addEventListener("message", function(e){
      var d = e.data;
      if(!d || (d.b5 !== "ready" && d.b5 !== "res")) return;
      if(!/\.googleusercontent\.com$/.test(e.origin) && e.origin !== new URL(url, location.href).origin) return;
      if(d.b5 === "ready"){ target = e.source; origin = e.origin; clearTimeout(t); try{ sessionStorage.removeItem(DOWN); }catch(x){} res(); return; }
      if(e.source !== target) return;
      var w = waiting[d.id]; if(!w) return;
      delete waiting[d.id];
      try{ w.res(JSON.parse(d.body)); }catch(err){ w.rej(err); }
    });
    function make(){
      var f = document.createElement("iframe");
      f.src = url + (url.indexOf("?") < 0 ? "?" : "&") + "bridge=1";
      f.title = "Base 5 shared memory"; f.setAttribute("aria-hidden", "true"); f.tabIndex = -1;
      f.style.cssText = "position:absolute;width:1px;height:1px;left:-9999px;top:0;border:0;opacity:0;pointer-events:none";
      document.body.appendChild(f);
    }
    if(document.body) make(); else document.addEventListener("DOMContentLoaded", make);
  });
  bridges[url] = {
    send: function(req){
      return ready.then(function(){
        return new Promise(function(res, rej){
          var id = ++seq;
          waiting[id] = { res: res, rej: rej };
          setTimeout(function(){ if(waiting[id]){ delete waiting[id]; rej(new Error("no answer")); } }, 30000);
          target.postMessage({ b5: "req", id: id, req: req }, origin);
        });
      });
    }
  };
  return bridges[url];
}
function call(action, data, url){
  url = url || SYNC_URL;
  if(!url) return Promise.reject(new Error("off"));
  if(url === SYNC_URL && bridgeDown() && !bridges[url]) return Promise.reject(new Error("bridge down"));
  var req = { action: action }, k;
  for(k in (data || {})) req[k] = data[k];
  return bridgeFor(url).send(req);
}

window.B5Site = { hq: hq ? hq.who : null, prefix: hq ? hq.prefix : null, syncUrl: SYNC_URL, guest: GUEST, call: call, bridgeDown: bridgeDown,
  syncWho: hq ? hq.who : (PROJECTS[path] || {}).who || null,
  syncPrefix: hq ? hq.prefix : (PROJECTS[path] || {}).prefix || null };
})();


/* ==========================================================
   Progress that follows the student (HQ pages only)
   Everything an HQ saves under its own prefix (b5.hk. and so on)
   is copied to the Sheet a few seconds after it changes, and
   pulled back on any other device. Each saved thing keeps the time
   it changed; the newest one wins. This sits in this file, rather
   than its own, so it is watching before the page saves anything.
   On this device:
     <prefix>sync.meta   when each thing last changed here
     <prefix>sync.dirty  things changed here, not yet in the Sheet
     <prefix>sync.since  the newest thing already pulled
   b5.sync.off = "1" switches it off on this device (Jay's laptop).
   ========================================================== */
(function(){
"use strict";
if(window.B5Sync) return;
var S = window.B5Site || {};
var URL = S.syncUrl, WHO = S.syncWho, P = S.syncPrefix;
if(!URL || !WHO || !P) return;
if(/teacher\.html$/.test(location.pathname)) return;
try{ if(localStorage.getItem("b5.sync.off") === "1") return; }catch(e){ return; }

var META = P + "sync.meta", DIRTY = P + "sync.dirty", SINCE = P + "sync.since";
var LS = window.localStorage, proto = Object.getPrototypeOf(LS);
var rawSet = proto.setItem, rawRemove = proto.removeItem, rawGet = proto.getItem;
var MAX = 45000;

function mine(k){ return typeof k === "string" && k.indexOf(P) === 0 && k.indexOf(P + "sync.") !== 0; }
function readJ(k, d){ try{ var v = JSON.parse(rawGet.call(LS, k) || "null"); return v && typeof v === "object" ? v : d; }catch(e){ return d; } }
function writeJ(k, v){ try{ rawSet.call(LS, k, JSON.stringify(v)); }catch(e){} }
var meta = readJ(META, {}), dirty = readJ(DIRTY, {});

/* first time on this device: everything already here counts as changed now */
if(!rawGet.call(LS, META)){
  var t0 = Date.now();
  for(var i = 0; i < LS.length; i++){ var k0 = LS.key(i); if(mine(k0)){ meta[k0] = t0; dirty[k0] = 1; } }
  writeJ(META, meta); writeJ(DIRTY, dirty);
}

/* ---------- notice every save the HQ makes ---------- */
var touched = {};   /* changed on this page since it opened */
function mark(k){
  meta[k] = Date.now(); dirty[k] = 1; touched[k] = 1;
  writeJ(META, meta); writeJ(DIRTY, dirty);
  schedule();
}
/* only a real change counts: some scripts save the same thing over and over */
proto.setItem = function(k, v){
  var watch = this === LS && mine(k), before = watch ? rawGet.call(LS, k) : null;
  var r = rawSet.apply(this, arguments);
  if(watch && before !== String(v)) mark(k);
  return r;
};
proto.removeItem = function(k){
  var watch = this === LS && mine(k), before = watch ? rawGet.call(LS, k) : null;
  var r = rawRemove.apply(this, arguments);
  if(watch && before !== null) mark(k);
  return r;
};

/* ---------- push ---------- */
var timer = null, busy = false;
function batch(){
  var items = {}, n = 0;
  Object.keys(dirty).forEach(function(k){
    var v = rawGet.call(LS, k);
    v = v == null ? "" : v;
    if(v.length > MAX) return;
    items[k] = { v: v, t: meta[k] || Date.now() }; n++;
  });
  return n ? items : null;
}
/* at most one save every few seconds, however busy the page is */
function schedule(){ if(timer) return; timer = setTimeout(function(){ timer = null; push(); }, 3000); }
function push(){
  if(busy){ schedule(); return; }
  var items = batch(); if(!items) return;
  var sent = Object.keys(items);
  busy = true;
  S.call("save", { who: WHO, items: items })
    .then(function(o){
      if(o && o.ok){
        sent.forEach(function(k){ if(items[k].t === (meta[k] || 0)) delete dirty[k]; });
        writeJ(DIRTY, dirty);
      }
    })
    .catch(function(){})
    .then(function(){ busy = false; if(Object.keys(dirty).length) setTimeout(push, 20000); });
}
/* leaving the page: send what is left without waiting for an answer */
function flush(){
  var items = batch(); if(!items) return;
  try{
    S.call("save", { who: WHO, items: items }).catch(function(){});   /* best effort; anything missed goes next time */
  }catch(e){}
}
document.addEventListener("visibilitychange", function(){ if(document.visibilityState === "hidden") flush(); });
window.addEventListener("pagehide", flush);

/* ---------- pull ---------- */
var interacted = false;
["pointerdown", "keydown"].forEach(function(e){ document.addEventListener(e, function(){ interacted = true; }, { capture: true, passive: true }); });

function pull(){
  var since = +rawGet.call(LS, SINCE) || 0;
  return S.call("load", { who: WHO, since: since })
    .then(function(o){
      if(!o || !o.ok) return;
      var changed = 0, newest = since;
      Object.keys(o.items || {}).forEach(function(k){
        if(!mine(k)) return;
        var it = o.items[k], t = +it.t || 0;
        if(t > newest) newest = t;
        if(touched[k] || t <= (meta[k] || 0)) return;   /* this device has the newer one */
        try{
          if(it.v === "") rawRemove.call(LS, k); else rawSet.call(LS, k, it.v);
          meta[k] = t; delete dirty[k]; changed++;
        }catch(e){}
      });
      writeJ(META, meta); writeJ(DIRTY, dirty);
      if(newest > since) rawSet.call(LS, SINCE, String(newest));
      if(changed) arrived();
    })
    .catch(function(){});
}

/* something new came in from another device */
function arrived(){
  var guard = "b5.sync.reloaded:" + location.pathname;
  var fresh = !interacted && (performance.now ? performance.now() < 8000 : true);
  if(fresh && !sessionStorage.getItem(guard)){
    try{ sessionStorage.setItem(guard, "1"); }catch(e){}
    location.reload();
    return;
  }
  toast();
}
function toast(){
  if(document.querySelector(".b5sync-toast")) return;
  var css = document.createElement("style");
  css.textContent =
    "html body>.b5sync-toast{position:fixed !important;z-index:2147482600 !important;left:50%;top:14px;transform:translateX(-50%)}" +
    ".b5sync-toast{display:flex;gap:10px;align-items:center;padding:10px 12px 10px 16px;border-radius:999px;background:#fffdf8;color:#141a33;border:2px solid #141a33;box-shadow:0 6px 18px rgba(0,0,0,.3);font:600 .95rem/1.2 'Atkinson Hyperlegible',Arial,sans-serif}" +
    ".b5sync-toast button{font:inherit;font-weight:700;padding:6px 12px;border-radius:999px;border:2px solid #141a33;background:#ffd23f;color:#141a33;cursor:pointer}" +
    ".b5sync-toast button.x{background:#fff}";
  document.head.appendChild(css);
  var t = document.createElement("div");
  t.className = "b5sync-toast";
  t.setAttribute("role", "status");
  t.innerHTML = "<span>Your progress from another device has arrived.</span><button type='button'>Show it</button><button type='button' class='x' aria-label='Not now'>Not now</button>";
  t.querySelector("button").onclick = function(){ location.reload(); };
  t.querySelector(".x").onclick = function(){ t.remove(); };
  document.body.appendChild(t);
}

pull().then(function(){ if(Object.keys(dirty).length) push(); });

window.B5Sync = { push: push, pull: pull, on: true };
})();
