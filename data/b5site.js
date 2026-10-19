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
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(window.B5Site) return;

var path = location.pathname;
var HQS = {
  "/egw/":   { who: "EGW", bg: "#2d2466", ink: "#ffe28a" },
  "/lp/":    { who: "LP",  bg: "#e2557a", ink: "#ffffff" },
  "/lw/":    { who: "LW",  bg: "#7d1424", ink: "#ffc247" },
  "/lc/":    { who: "LC",  bg: "#0b1416", ink: "#c9f7d8" },
  "/hk/":    { who: "HK",  bg: "#0b1622", ink: "#ff7a1a" },
  "/jt-hq/": { who: "JT",  bg: "#1f8a3c", ink: "#ffffff" }
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

window.B5Site = { hq: hq ? hq.who : null };
})();
