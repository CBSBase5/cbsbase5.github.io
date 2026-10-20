/* ==========================================================
   LC's Night Shift HQ - the building after hours
   The home page's own atmosphere: a long empty corridor behind
   the greeting, a strip light that hums and now and then
   flickers, a green exit sign, and a night shift line that
   changes with the time of day. Decoration only; reduced motion
   turns the flicker off. LC's home page only (the HK and JT
   builds leave this file out). ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(!window.HQ || window.HQ.who !== "LC") return;
var RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

var css = document.createElement("style");
css.textContent =
  ".lcn-hero{position:relative}" +
  ".lcn-scene{position:absolute;right:-10px;top:-6px;width:min(46%,520px);aspect-ratio:8/5;pointer-events:none;z-index:0;opacity:.92;" +
    "-webkit-mask-image:radial-gradient(ellipse 70% 72% at 55% 50%,#000 55%,transparent 100%);mask-image:radial-gradient(ellipse 70% 72% at 55% 50%,#000 55%,transparent 100%)}" +
  ".lcn-scene svg{width:100%;height:100%;display:block}" +
  ".lcn-hero>*:not(.lcn-scene){position:relative;z-index:1}" +
  ".lcn-hero h1{text-shadow:0 0 18px rgba(240,236,170,.35)}" +
  ".lcn-line{font-family:var(--display);color:#e6d84a;font-size:.92rem;letter-spacing:.04em;margin:-2px 0 10px}" +
  ".lcn-line b{color:#5dff9b;font-weight:700}" +
  "@media (prefers-reduced-motion:no-preference){" +
    ".lcn-hero h1 em{animation:lcnflick 7s steps(1) infinite}" +
    ".lcn-light{animation:lcnlight 7s steps(1) infinite}" +
    ".lcn-exit{animation:lcnexit 3.2s ease-in-out infinite alternate}" +
  "}" +
  "@keyframes lcnflick{0%,100%{opacity:1}62%{opacity:.4}63%{opacity:1}64.5%{opacity:.55}66%{opacity:1}}" +
  "@keyframes lcnlight{0%,100%{opacity:1}62%{opacity:.25}63%{opacity:1}64.5%{opacity:.4}66%{opacity:1}}" +
  "@keyframes lcnexit{from{opacity:.7}to{opacity:1}}" +
  "@media (max-width:760px){.lcn-scene{position:relative;right:auto;top:auto;width:100%;max-width:420px;margin:0 0 4px;opacity:.85}}" +
  /* the cards below sit in the same building: exit sign green edges on the folder */
  "html:not([data-skin]) .hqx-card.fo-card{box-shadow:0 0 0 1px rgba(93,255,155,.25),0 0 22px rgba(93,255,155,.12)}";
document.head.appendChild(css);

function scene(){
  return '<svg viewBox="0 0 800 500" aria-hidden="true">' +
    '<defs><pattern id="lcnP" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#8c7e44"/><path d="M11 3l3 8-3 8-3-8z" fill="#7b6e3a"/></pattern>' +
    '<radialGradient id="lcnG" cx="50%" cy="0%" r="80%"><stop offset="0" stop-color="#fff9c4" stop-opacity=".5"/><stop offset="1" stop-color="#fff9c4" stop-opacity="0"/></radialGradient></defs>' +
    '<polygon points="0,0 800,0 470,170 330,170" fill="#a9a588"/>' +
    '<polygon points="0,500 800,500 470,300 330,300" fill="#3f3c31"/>' +
    '<polygon points="0,0 330,170 330,300 0,500" fill="url(#lcnP)"/><polygon points="0,0 330,170 330,300 0,500" fill="#000" opacity=".3"/>' +
    '<polygon points="800,0 470,170 470,300 800,500" fill="url(#lcnP)"/><polygon points="800,0 470,170 470,300 800,500" fill="#000" opacity=".2"/>' +
    '<rect x="330" y="170" width="140" height="130" fill="#6d6236"/>' +
    '<rect x="372" y="208" width="56" height="92" fill="#3d3122"/>' +
    '<g class="lcn-exit"><rect x="370" y="186" width="60" height="18" rx="2" fill="#123c22"/><text x="400" y="200" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="#5dff9b">EXIT</text><rect x="360" y="180" width="80" height="30" rx="6" fill="#5dff9b" opacity=".12"/></g>' +
    '<g class="lcn-light"><rect x="250" y="40" width="300" height="14" rx="3" fill="#fffbe0"/><rect x="325" y="98" width="150" height="8" rx="2" fill="#fffbe0"/><rect x="360" y="138" width="80" height="5" rx="2" fill="#fffbe0"/>' +
    '<polygon points="0,0 800,0 470,170 330,170" fill="url(#lcnG)"/></g>' +
    '<g transform="translate(60 120) skewY(28)"><rect width="92" height="210" fill="#3a2d1d" stroke="#1c150c" stroke-width="5"/><circle cx="80" cy="112" r="5" fill="#b9a467"/></g>' +
    '<g transform="translate(626 196) skewY(-28)"><rect width="60" height="140" fill="#3a2d1d" stroke="#1c150c" stroke-width="4"/></g>' +
    '<g transform="translate(560 360)"><path d="M0 70l22-70h16l22 70z" fill="#c9ad16" stroke="#1c150c" stroke-width="3" stroke-linejoin="round"/></g>' +
    '</svg>';
}

function line(){
  var h = new Date().getHours();
  if(h < 9) return "Early shift. <b>The building is still asleep.</b>";
  if(h < 12) return "Morning shift. <b>Every room is yours.</b>";
  if(h < 14) return "Lunch break on the night shift. <b>The lights are humming.</b>";
  if(h < 17) return "Afternoon shift. <b>Nobody else is on this floor.</b>";
  return "The proper night shift. <b>Mind the corridor.</b>";
}

function boot(){
  var hero = document.querySelector(".hero");
  if(!hero || hero.querySelector(".lcn-scene")) return;
  hero.classList.add("lcn-hero");
  var sc = document.createElement("div"); sc.className = "lcn-scene"; sc.innerHTML = scene();
  hero.insertBefore(sc, hero.firstChild);
  var h1 = hero.querySelector("h1");
  if(h1){
    var p = document.createElement("p"); p.className = "lcn-line"; p.innerHTML = line();
    h1.parentNode.insertBefore(p, h1.nextSibling);
  }
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
