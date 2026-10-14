/* ==========================================================
   EGW's GCSE HQ - floating digestive biscuits
   A few digital digestives drift slowly across the page.
   Tap one to crunch it; another drifts in a little later.
   A small biscuit button in the bottom corner turns them off
   or on and keeps count of how many have been nibbled.
   EGW's pages only: does nothing in another student's HQ
   (any page that sets window.HQ), and stays still for anyone
   who asks their device for reduced motion.
   Saves { on, eaten } in b5.egw.biscuits.v1 on this device.
   ========================================================== */
(function(){
"use strict";
if(window.HQ) return;
var KEY = "b5.egw.biscuits.v1";
function load(){ try{ var d = JSON.parse(localStorage.getItem(KEY) || "null"); if(d && typeof d === "object") return d; }catch(e){} return {}; }
var st = load();
if(st.on === undefined) st.on = true;
st.eaten = st.eaten || 0;
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(st)); }catch(e){} }
var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

var css = document.createElement("style");
css.textContent =
"html body>.bisc-layer{position:fixed !important;inset:0;z-index:5 !important;pointer-events:none;overflow:hidden}" +
".bisc{position:absolute;left:0;top:0;pointer-events:auto;cursor:pointer;opacity:.95;transition:opacity .35s;filter:drop-shadow(0 6px 8px rgba(0,0,0,.35));-webkit-tap-highlight-color:transparent;border:0;background:none;padding:0}" +
".bisc svg{display:block;width:100%;height:100%}" +
".bisc:focus-visible{outline:3px solid #ffd23f;outline-offset:4px;border-radius:50%}" +
".crumb{position:absolute;width:7px;height:6px;border-radius:2px;background:#c98d45;pointer-events:none}" +
".crunchword{position:absolute;pointer-events:none;font-family:var(--display);font-weight:700;font-size:1.1rem;color:#fff;text-shadow:0 2px 0 #8a5a2b,0 0 8px rgba(0,0,0,.5);transform:translate(-50%,-50%)}" +
"html body>.bisc-chip{position:fixed !important;left:12px;bottom:12px;z-index:6 !important;display:flex;align-items:center;gap:6px;" +
"font-family:var(--display);font-weight:600;font-size:.78rem;color:var(--moon);background:rgba(20,26,51,.72);border:1px solid rgba(201,205,240,.3);" +
"border-radius:999px;padding:5px 10px 5px 6px;cursor:pointer}" +
".bisc-chip svg{width:22px;height:22px}" +
".bisc-chip.off svg{opacity:.4}" +
"@media (max-width:600px){.bisc-chip:not(.msg) span{display:none}.bisc-chip:not(.msg){padding:5px;opacity:.85}}";
document.head.appendChild(css);

/* a plain digestive, or one half dipped in chocolate (drawn here, no brand) */
function art(choc, id){
  var holes = "";
  [[38,40],[50,34],[62,40],[32,52],[44,50],[56,50],[68,52],[38,63],[50,66],[62,63],[50,52]].forEach(function(p){
    holes += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.8" fill="#9b6a35" opacity=".75"/>';
  });
  var speck = "";
  for(var i = 0; i < 14; i++){
    var a = i * 2.4, r = 10 + (i * 7) % 26;
    speck += '<circle cx="' + (50 + Math.cos(a) * r).toFixed(1) + '" cy="' + (50 + Math.sin(a) * r).toFixed(1) + '" r="1" fill="#f3d9a4" opacity=".7"/>';
  }
  return '<svg viewBox="0 0 100 100" aria-hidden="true"><defs>' +
    '<radialGradient id="bg' + id + '" cx="42%" cy="38%" r="65%"><stop offset="0" stop-color="#e9b874"/><stop offset=".75" stop-color="#cf9150"/><stop offset="1" stop-color="#a86d34"/></radialGradient>' +
    '<clipPath id="bc' + id + '"><circle cx="50" cy="50" r="44"/></clipPath></defs>' +
    '<circle cx="50" cy="50" r="46" fill="#9a612c"/>' +
    '<circle cx="50" cy="50" r="44" fill="url(#bg' + id + ')"/>' +
    '<circle cx="50" cy="50" r="38" fill="none" stroke="#b77a3d" stroke-width="1.5" opacity=".7"/>' +
    speck + holes +
    (choc ? '<g clip-path="url(#bc' + id + ')"><path d="M0 0 H100 V48 Q75 56 50 48 T0 50 Z" fill="#4a2a17"/><path d="M8 20 Q30 12 52 18" stroke="#6b3f22" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/></g>' : "") +
    '</svg>';
}

var layer, chip, items = [], last = 0, seq = 0, raf = 0;
function W(){ return window.innerWidth; }
function H(){ return window.innerHeight; }

function spawn(fromEdge){
  var size = Math.round(44 + Math.random() * 26);
  var b = document.createElement("button");
  b.type = "button"; b.className = "bisc";
  b.setAttribute("aria-label", "A digestive biscuit. Tap to crunch it.");
  b.style.width = b.style.height = size + "px";
  b.innerHTML = art(Math.random() < 0.35, seq++);
  var it = { el: b, size: size,
    x: Math.random() * (W() - size), y: Math.random() * (H() - size),
    vx: (Math.random() < 0.5 ? -1 : 1) * (8 + Math.random() * 14),
    vy: (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 10),
    rot: Math.random() * 360, vr: (Math.random() < 0.5 ? -1 : 1) * (6 + Math.random() * 14),
    bob: Math.random() * 6.28 };
  if(fromEdge){
    var side = Math.floor(Math.random() * 4);
    if(side === 0){ it.x = -size; it.vx = Math.abs(it.vx); }
    if(side === 1){ it.x = W(); it.vx = -Math.abs(it.vx); }
    if(side === 2){ it.y = -size; it.vy = Math.abs(it.vy); }
    if(side === 3){ it.y = H(); it.vy = -Math.abs(it.vy); }
  }
  b.onclick = function(e){ e.preventDefault(); e.stopPropagation(); crunch(it); };
  layer.appendChild(b);
  items.push(it);
  place(it);
}
function place(it){
  var bob = calm ? 0 : Math.sin(it.bob) * 4;
  it.el.style.transform = "translate(" + it.x.toFixed(1) + "px," + (it.y + bob).toFixed(1) + "px) rotate(" + it.rot.toFixed(1) + "deg)";
}
/* fade a biscuit while it passes over a card with reading on it */
var cards = [], cardsAt = 0;
function readCards(){
  cards = [].map.call(document.querySelectorAll(".card, .qcard, .moodcard, .checkin"), function(c){
    var r = c.getBoundingClientRect(); return r.width && r.height ? r : null;
  }).filter(Boolean);
}
function overCard(it){
  var x = it.x + it.size / 2, y = it.y + it.size / 2;
  for(var i = 0; i < cards.length; i++){ var r = cards[i]; if(x > r.left && x < r.right && y > r.top && y < r.bottom) return true; }
  return false;
}
function tick(t){
  raf = 0;
  if(t - cardsAt > 400){ readCards(); cardsAt = t; items.forEach(function(it){ it.el.style.opacity = overCard(it) ? ".28" : ""; }); }
  if(!st.on || document.hidden) return;
  var dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t;
  if(!calm){
    items.forEach(function(it){
      it.x += it.vx * dt; it.y += it.vy * dt; it.rot += it.vr * dt; it.bob += dt * 1.3;
      var s = it.size;
      if(it.x < -s - 20) it.x = W() + 10; else if(it.x > W() + 20) it.x = -s - 10;
      if(it.y < -s - 20) it.y = H() + 10; else if(it.y > H() + 20) it.y = -s - 10;
      place(it);
    });
  }
  raf = requestAnimationFrame(tick);
}
function go(){ if(!raf && st.on){ last = 0; raf = requestAnimationFrame(tick); } }

var WORDS = ["Crunch!", "Nom.", "Crumbs!", "Snap!", "Lovely."];
function crunch(it){
  var i = items.indexOf(it); if(i < 0) return;
  items.splice(i, 1);
  var cx = it.x + it.size / 2, cy = it.y + it.size / 2;
  it.el.parentNode && it.el.parentNode.removeChild(it.el);
  var w = document.createElement("div"); w.className = "crunchword"; w.textContent = WORDS[Math.floor(Math.random() * WORDS.length)];
  w.style.left = cx + "px"; w.style.top = cy + "px"; layer.appendChild(w);
  if(w.animate) w.animate([{ opacity: 1, transform: "translate(-50%,-50%) scale(.8)" }, { opacity: 0, transform: "translate(-50%,-120%) scale(1.15)" }], { duration: 800, easing: "ease-out" });
  setTimeout(function(){ w.parentNode && w.parentNode.removeChild(w); }, 820);
  if(!calm){
    for(var k = 0; k < 12; k++){
      var c = document.createElement("div"); c.className = "crumb";
      c.style.left = cx + "px"; c.style.top = cy + "px";
      if(k % 3 === 0) c.style.background = "#9a612c";
      layer.appendChild(c);
      var a = Math.random() * 6.28, d = 30 + Math.random() * 50;
      if(c.animate) c.animate([{ transform: "translate(0,0) rotate(0)", opacity: 1 },
        { transform: "translate(" + (Math.cos(a) * d) + "px," + (Math.sin(a) * d + 40) + "px) rotate(" + (Math.random() * 300) + "deg)", opacity: 0 }],
        { duration: 700 + Math.random() * 300, easing: "cubic-bezier(.2,.6,.4,1)" });
      (function(el){ setTimeout(function(){ el.parentNode && el.parentNode.removeChild(el); }, 1050); })(c);
    }
  }
  st = Object.assign(load(), { on: st.on }); st.eaten = (st.eaten || 0) + 1; save();
  drawChip(st.eaten % 10 === 0 ? st.eaten + " digestives. Tea break?" : null);
  setTimeout(function(){ if(st.on && items.length < count()) spawn(true); }, 4000 + Math.random() * 5000);
}
function count(){ return W() < 600 ? 2 : 3; }

var CHIPART = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="#9a612c"/><circle cx="50" cy="50" r="42" fill="#d99a57"/><g fill="#9b6a35"><circle cx="38" cy="40" r="4"/><circle cx="62" cy="40" r="4"/><circle cx="50" cy="55" r="4"/><circle cx="36" cy="64" r="4"/><circle cx="64" cy="64" r="4"/></g></svg>';
var chipTimer = 0;
function drawChip(msg){
  chip.classList.toggle("off", !st.on);
  chip.classList.toggle("msg", !!msg);
  chip.setAttribute("aria-pressed", st.on ? "true" : "false");
  chip.title = st.on ? "Biscuits on. Tap to tidy them away." : "Biscuits off. Tap to bring them back.";
  chip.innerHTML = CHIPART + "<span>" + (msg || (st.on ? (st.eaten ? st.eaten + " nibbled" : "Biscuits") : "Biscuits off")) + "</span>";
  clearTimeout(chipTimer);
  if(msg) chipTimer = setTimeout(function(){ drawChip(); }, 3500);
}
function setOn(on){
  st = Object.assign(load(), { on: on }); save();
  if(on){ while(items.length < count()) spawn(false); go(); }
  else { items.forEach(function(it){ it.el.parentNode && it.el.parentNode.removeChild(it.el); }); items = []; }
  drawChip();
}

function mount(){
  layer = document.createElement("div"); layer.className = "bisc-layer"; layer.setAttribute("aria-hidden", "false");
  document.body.appendChild(layer);
  chip = document.createElement("button"); chip.type = "button"; chip.className = "bisc-chip";
  chip.onclick = function(){ setOn(!st.on); };
  document.body.appendChild(chip);
  setOn(st.on);
  document.addEventListener("visibilitychange", function(){ if(!document.hidden) go(); });
  window.addEventListener("resize", function(){ items.forEach(function(it){ it.x = Math.min(it.x, W() - it.size); it.y = Math.min(it.y, H() - it.size); }); });
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
