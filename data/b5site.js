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
   In an HQ, when the shared memory is switched on (SYNC_URL below,
   see /teacher/sync.html), progress follows the student between
   devices: the second half of this file.
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(window.B5Site) return;

/* The shared memory: the Google Sheet web app address. Empty means off.
   A device can try another address with localStorage b5.sync.url. */
var SYNC_URL = "";
try{ SYNC_URL = localStorage.getItem("b5.sync.url") || SYNC_URL; }catch(e){}

var path = location.pathname;
var HQS = {
  "/egw/":   { who: "EGW", prefix: "b5.egw.", bg: "#2d2466", ink: "#ffe28a" },
  "/lp/":    { who: "LP", prefix: "b5.lp.",  bg: "#e2557a", ink: "#ffffff" },
  "/lw/":    { who: "LW", prefix: "b5.lw.",  bg: "#7d1424", ink: "#ffc247" },
  "/lc/":    { who: "LC", prefix: "b5.lc.",  bg: "#0b1416", ink: "#c9f7d8" },
  "/hk/":    { who: "HK", prefix: "b5.hk.",  bg: "#0b1622", ink: "#ff7a1a" },
  "/jt-hq/": { who: "JT", prefix: "b5.jthq.",  bg: "#1f8a3c", ink: "#ffffff" }
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
if(hq && !/teacher\.html$/.test(path)){
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

window.B5Site = { hq: hq ? hq.who : null, prefix: hq ? hq.prefix : null, syncUrl: SYNC_URL };
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
var URL = S.syncUrl, WHO = S.hq, P = S.prefix;
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
  fetch(URL, { method: "POST", body: JSON.stringify({ action: "save", who: WHO, items: items }) })
    .then(function(r){ return r.json(); })
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
    navigator.sendBeacon(URL, new Blob([JSON.stringify({ action: "save", who: WHO, items: items })], { type: "text/plain" }));
  }catch(e){}
}
document.addEventListener("visibilitychange", function(){ if(document.visibilityState === "hidden") flush(); });
window.addEventListener("pagehide", flush);

/* ---------- pull ---------- */
var interacted = false;
["pointerdown", "keydown"].forEach(function(e){ document.addEventListener(e, function(){ interacted = true; }, { capture: true, passive: true }); });

function pull(){
  var since = +rawGet.call(LS, SINCE) || 0;
  return fetch(URL + "?action=load&who=" + encodeURIComponent(WHO) + "&since=" + since)
    .then(function(r){ return r.json(); })
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
