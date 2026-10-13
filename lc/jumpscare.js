/* ==========================================================
   LC's Night Shift HQ - the jumpscare button
   Only ever happens when LC taps the button. The lights flicker
   for a random moment, then something jumps out with a shriek.
   Tap or press any key to make it go away. Sound can be turned
   off. Four original creatures, never the same one twice running.
   Saves { sound, n, last } in b5.lc.scare.v1 on this device.
   ========================================================== */
(function(){
"use strict";
var KEY = "b5.lc.scare.v1";
function load(){ try{ var d = JSON.parse(localStorage.getItem(KEY) || "null"); if(d && typeof d === "object") return d; }catch(e){} return { sound: true, n: 0, last: -1 }; }
var st = load();
if(st.sound === undefined) st.sound = true;
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(st)); }catch(e){} }
var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- styles ---------- */
var css = document.createElement("style");
css.textContent =
".jsbox{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin:16px 0 0}" +
".jsbtn{display:inline-flex;align-items:center;gap:10px;font-family:var(--display);font-weight:700;font-size:1rem;cursor:pointer;" +
"background:#0e0f0b;color:#fbf8e4;border:2px solid #ff5c5c;border-radius:6px;padding:10px 16px;box-shadow:0 0 0 0 rgba(255,92,92,.5);transition:box-shadow .2s}" +
".jsbtn:hover{box-shadow:0 0 18px 2px rgba(255,92,92,.45)}" +
".jsbtn:disabled{opacity:.6;cursor:default}" +
".jsbtn svg{width:26px;height:26px}" +
".jsbtn small{display:block;font-family:var(--body);font-weight:400;font-size:.72rem;color:#d8d5b6}" +
".jsmeta{font-size:.85rem;color:var(--mist)}" +
".jsmeta button{font:inherit;background:none;border:0;color:var(--moon);text-decoration:underline;cursor:pointer;padding:4px}" +
".jsdark{position:fixed;inset:0;z-index:9998;pointer-events:none;background:#000;opacity:0}" +
".jsdark.go{animation:jsflick 1s steps(1) infinite}" +
"@keyframes jsflick{0%{opacity:0}9%{opacity:.75}13%{opacity:.1}30%{opacity:0}46%{opacity:.85}50%{opacity:.25}61%{opacity:.9}64%{opacity:0}100%{opacity:0}}" +
".jsboo{position:fixed;inset:0;z-index:9999;background:#000;display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden}" +
".jsboo svg{width:min(115vw,115vh);height:min(115vw,115vh);transform-origin:50% 50%;animation:jspop .14s cubic-bezier(.2,1.6,.4,1) both, jsshake .09s linear .14s 9}" +
".jsboo.out{transition:opacity .5s;opacity:0}" +
".jsboo .jstag{position:absolute;bottom:18px;left:0;right:0;text-align:center;font-family:var(--display);color:rgba(255,255,255,.55);font-size:.85rem}" +
"@keyframes jspop{from{transform:scale(.15) rotate(-6deg)}to{transform:scale(1) rotate(0)}}" +
"@keyframes jsshake{0%{transform:translate(0,0)}25%{transform:translate(-14px,8px)}50%{transform:translate(12px,-10px)}75%{transform:translate(-8px,-6px)}100%{transform:translate(0,0)}}" +
"@media (prefers-reduced-motion:reduce){.jsboo svg{animation:none}.jsdark.go{animation:none;opacity:.6}}";
document.head.appendChild(css);

/* ---------- the creatures (all original drawings) ---------- */
var C = [];
/* 1. The figure in the corridor: a very tall, thin shadow under a strip light */
C.push({ name: "The figure in the corridor", svg:
'<svg viewBox="0 0 400 400" aria-hidden="true"><defs><radialGradient id="jsA" cx="50%" cy="10%" r="80%"><stop offset="0" stop-color="#4a4a33"/><stop offset="1" stop-color="#050504"/></radialGradient></defs>' +
'<rect width="400" height="400" fill="url(#jsA)"/>' +
'<path d="M0 400 L130 120 L270 120 L400 400 Z" fill="#191a12"/><path d="M0 0 L130 120 L130 400 L0 400 Z" fill="#23241a"/><path d="M400 0 L270 120 L270 400 L400 400 Z" fill="#23241a"/>' +
'<rect x="160" y="14" width="80" height="9" fill="#f0ecb0"/>' +
'<path d="M200 40 C214 40 222 54 220 74 C218 92 212 100 214 112 L232 128 C246 190 244 260 238 330 L250 400 L222 400 L212 300 L204 400 L176 400 L188 300 L178 400 L150 400 L162 330 C156 260 154 190 168 128 L186 112 C188 100 182 92 180 74 C178 54 186 40 200 40 Z" fill="#000"/>' +
'<path d="M168 130 C150 190 140 250 128 330 L120 352 L126 354 L134 336 M232 130 C250 190 260 250 272 330 L280 352 L274 354 L266 336" fill="none" stroke="#000" stroke-width="12" stroke-linecap="round"/>' +
'<path d="M122 352 l-8 22 M126 354 l-2 24 M130 352 l4 22 M278 352 l8 22 M274 354 l2 24 M270 352 l-4 22" stroke="#000" stroke-width="4" stroke-linecap="round"/>' +
'<circle cx="192" cy="72" r="4.5" fill="#fff"/><circle cx="208" cy="72" r="4.5" fill="#fff"/></svg>' });
/* 2. Eyes in the dark */
C.push({ name: "Eyes in the dark", svg:
'<svg viewBox="0 0 400 400" aria-hidden="true"><rect width="400" height="400" fill="#000"/>' +
'<g fill="#ffd84a"><ellipse cx="70" cy="70" rx="12" ry="6"/><ellipse cx="100" cy="72" rx="12" ry="6"/>' +
'<ellipse cx="320" cy="60" rx="10" ry="5"/><ellipse cx="346" cy="62" rx="10" ry="5"/>' +
'<ellipse cx="50" cy="330" rx="10" ry="5"/><ellipse cx="76" cy="328" rx="10" ry="5"/>' +
'<ellipse cx="330" cy="320" rx="12" ry="6"/><ellipse cx="360" cy="322" rx="12" ry="6"/></g>' +
'<ellipse cx="140" cy="160" rx="46" ry="30" fill="#ff3b1f"/><ellipse cx="260" cy="160" rx="46" ry="30" fill="#ff3b1f"/>' +
'<ellipse cx="140" cy="160" rx="10" ry="26" fill="#000"/><ellipse cx="260" cy="160" rx="10" ry="26" fill="#000"/>' +
'<path d="M80 250 Q200 340 320 250 Q200 300 80 250 Z" fill="#f4f0dc"/>' +
'<path d="M80 250 L98 268 L112 256 L128 280 L144 264 L160 290 L176 270 L192 296 L208 270 L224 294 L240 268 L256 288 L272 262 L288 276 L302 256 L320 250" fill="none" stroke="#000" stroke-width="6" stroke-linejoin="round"/></svg>' });
/* 3. The shop dummy */
C.push({ name: "The shop dummy", svg:
'<svg viewBox="0 0 400 400" aria-hidden="true"><rect width="400" height="400" fill="#0b0b0b"/>' +
'<rect x="0" y="0" width="400" height="400" fill="#5a0d0d" opacity=".25"/>' +
'<path d="M110 400 L130 300 Q200 270 270 300 L290 400 Z" fill="#cfcac0"/>' +
'<ellipse cx="200" cy="180" rx="95" ry="120" fill="#ece7dc"/>' +
'<path d="M200 70 L188 120 L206 150 L190 200" fill="none" stroke="#2a2621" stroke-width="4"/>' +
'<path d="M260 110 L240 150 L262 172" fill="none" stroke="#2a2621" stroke-width="3"/>' +
'<ellipse cx="160" cy="170" rx="22" ry="12" fill="#c9c3b6"/><circle cx="240" cy="170" r="20" fill="#ff1a1a"/><circle cx="240" cy="170" r="7" fill="#000"/>' +
'<path d="M150 250 Q200 236 250 250" fill="none" stroke="#2a2621" stroke-width="5" stroke-linecap="round"/></svg>' });
/* 4. Bonnie, but wrong */
C.push({ name: "Bonnie, but wrong", svg:
'<svg viewBox="0 0 400 400" aria-hidden="true"><rect width="400" height="400" fill="#120806"/>' +
'<g fill="#3d2416"><circle cx="200" cy="230" r="110"/><circle cx="120" cy="140" r="56"/><circle cx="280" cy="140" r="56"/><circle cx="200" cy="110" r="70"/>' +
'<circle cx="150" cy="90" r="40"/><circle cx="250" cy="90" r="40"/></g>' +
'<g fill="#2a170d"><ellipse cx="96" cy="210" rx="34" ry="62"/><ellipse cx="304" cy="210" rx="34" ry="62"/></g>' +
'<circle cx="160" cy="190" r="26" fill="#ff2a14"/><circle cx="240" cy="190" r="26" fill="#ff2a14"/>' +
'<circle cx="160" cy="190" r="9" fill="#fff6a0"/><circle cx="240" cy="190" r="9" fill="#fff6a0"/>' +
'<ellipse cx="200" cy="245" rx="24" ry="16" fill="#000"/>' +
'<path d="M130 285 Q200 340 270 285 Z" fill="#000"/>' +
'<path d="M150 290 L160 318 L170 294 M230 294 L240 318 L250 290" fill="#fff"/></svg>' });

/* ---------- the shriek (made in the browser) ---------- */
var AC = null;
function shriek(){
  if(!st.sound) return;
  try{
    var A = window.AudioContext || window.webkitAudioContext; if(!A) return;
    AC = AC || new A(); if(AC.state === "suspended") AC.resume();
    var t = AC.currentTime, master = AC.createGain();
    master.gain.setValueAtTime(0.0001, t); master.gain.exponentialRampToValueAtTime(0.55, t + 0.02);
    master.gain.exponentialRampToValueAtTime(0.0001, t + 1.3); master.connect(AC.destination);
    [880, 932, 1245].forEach(function(f, i){
      var o = AC.createOscillator(); o.type = i === 2 ? "square" : "sawtooth";
      o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.45, t + 1.2);
      var g = AC.createGain(); g.gain.value = i === 2 ? 0.12 : 0.22;
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 1.3);
    });
    var len = Math.floor(AC.sampleRate * 0.5), b = AC.createBuffer(1, len, AC.sampleRate), d = b.getChannelData(0);
    for(var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    var n = AC.createBufferSource(); n.buffer = b;
    var bp = AC.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.setValueAtTime(2500, t); bp.frequency.exponentialRampToValueAtTime(500, t + 0.5);
    var ng = AC.createGain(); ng.gain.value = 0.9;
    n.connect(bp); bp.connect(ng); ng.connect(master); n.start(t);
    var th = AC.createOscillator(); th.type = "sine"; th.frequency.setValueAtTime(90, t); th.frequency.exponentialRampToValueAtTime(40, t + 0.4);
    var tg = AC.createGain(); tg.gain.setValueAtTime(0.8, t); tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    th.connect(tg); tg.connect(master); th.start(t); th.stop(t + 0.5);
  }catch(e){}
}
/* browsers only allow sound after a tap, so wake the audio on the button tap */
function wakeAudio(){
  if(!st.sound) return;
  try{ var A = window.AudioContext || window.webkitAudioContext; if(A){ AC = AC || new A(); if(AC.state === "suspended") AC.resume(); } }catch(e){}
}

/* ---------- the button ---------- */
var LINES = [
  "Survived. Your heart rate will be back soon.",
  "Still here. Brave.",
  "That one was rude, to be fair.",
  "Did you jump? You jumped.",
  "Back to normal. Probably.",
  "The night shift salutes you."
];
var GHOST = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 28V14a10 10 0 0 1 20 0v14l-3.5-3-3 3-3.5-3-3.5 3-3-3Z" fill="#fbf8e4"/><circle cx="12.5" cy="14" r="2.4" fill="#0e0f0b"/><circle cx="19.5" cy="14" r="2.4" fill="#0e0f0b"/><ellipse cx="16" cy="20" rx="2" ry="2.6" fill="#0e0f0b"/></svg>';
var box, btn, meta, busy = false;
function drawMeta(msg){
  meta.innerHTML = (msg ? msg + " " : "") + (st.n ? "Scares survived: <b>" + st.n + "</b>. " : "") +
    'Sound is ' + (st.sound ? "on" : "off") + ' <button type="button" id="jsSound">' + (st.sound ? "turn it off" : "turn it on") + "</button>";
  document.getElementById("jsSound").onclick = function(){ st.sound = !st.sound; save(); drawMeta(); };
}
function mount(){
  var hero = document.querySelector(".hero") || document.querySelector("h1") && document.querySelector("h1").parentNode;
  if(!hero) return;
  box = document.createElement("div"); box.className = "jsbox";
  btn = document.createElement("button"); btn.type = "button"; btn.className = "jsbtn";
  btn.innerHTML = GHOST + '<span>Jumpscare<small>Sudden and loud. Only if you want one.</small></span>';
  meta = document.createElement("span"); meta.className = "jsmeta";
  box.appendChild(btn); box.appendChild(meta);
  hero.appendChild(box);
  drawMeta();
  btn.onclick = go;
}

function pickCreature(){
  var k; do{ k = Math.floor(Math.random() * C.length); }while(C.length > 1 && k === st.last);
  st.last = k; return C[k];
}
function go(){
  if(busy) return;
  busy = true; btn.disabled = true;
  wakeAudio();
  var dark = document.createElement("div"); dark.className = "jsdark";
  document.body.appendChild(dark);
  if(!calm) dark.classList.add("go");
  var wait = 1200 + Math.floor(Math.random() * 2400);
  setTimeout(function(){ dark.parentNode && dark.parentNode.removeChild(dark); boo(); }, wait);
}
function boo(){
  var c = pickCreature();
  var o = document.createElement("div"); o.className = "jsboo"; o.setAttribute("role", "img"); o.setAttribute("aria-label", c.name);
  o.innerHTML = c.svg + '<div class="jstag">tap anywhere</div>';
  document.body.appendChild(o);
  shriek();
  try{ if(navigator.vibrate) navigator.vibrate([120, 60, 200]); }catch(e){}
  var gone = false;
  function close(){
    if(gone) return; gone = true;
    o.classList.add("out");
    document.removeEventListener("keydown", close);
    setTimeout(function(){ o.parentNode && o.parentNode.removeChild(o); }, 500);
    st.n = (st.n || 0) + 1; save();
    busy = false; btn.disabled = false;
    drawMeta(LINES[Math.floor(Math.random() * LINES.length)]);
    btn.focus();
  }
  o.addEventListener("click", close);
  setTimeout(function(){ document.addEventListener("keydown", close); }, 200);
  setTimeout(close, 2600);
}

if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
