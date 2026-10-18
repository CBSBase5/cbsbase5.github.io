/* ==========================================================
   LC's Night Shift HQ - jumpscares
   Two ways in, both chosen by LC:
   1. The Jumpscare button on the home page: the lights fail, a
      drone and a heartbeat build for a random few seconds (and
      sometimes it is a false alarm... until it is not), then
      something lunges at the screen with a scream.
   2. "Hide one for later": a scare goes off at a random moment in
      the next few minutes, on any page of the HQ (not Jay's view).
   Tap or press any key to make it go away. Sound can be turned off.
   One white flash only, never strobing.
   Home page:  <script src="/lc/jumpscare.js" data-button="1">
   Other pages: <script src="/lc/jumpscare.js"> (only watches for a hidden one)
   Saves { sound, n, last, armed } in b5.lc.scare.v1 on this device.
   ========================================================== */
(function(){
"use strict";
var KEY = "b5.lc.scare.v1";
var me = document.currentScript;
var WITH_BUTTON = !!(me && me.getAttribute("data-button"));
function load(){ try{ var d = JSON.parse(localStorage.getItem(KEY) || "null"); if(d && typeof d === "object") return d; }catch(e){} return {}; }
var st = load();
if(st.sound === undefined) st.sound = true;
st.n = st.n || 0;
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(st)); }catch(e){} }
function fresh(){ var d = load(); st.armed = d.armed || 0; st.n = d.n || st.n; st.sound = d.sound === undefined ? st.sound : d.sound; }
var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
function rnd(a, b){ return a + Math.random() * (b - a); }

/* ---------- styles (fixed and on top of everything, whatever the page does) ---------- */
var NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")";
var css = document.createElement("style");
css.textContent =
"html body>.jsdark,html body>.jsboo,html body>.jsflash,html body>.jstoast{position:fixed !important;z-index:2147483000 !important}" +
".jsbox{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin:16px 0 0}" +
".jsbtn,.jshide{display:inline-flex;align-items:center;gap:10px;font-family:var(--display);font-weight:700;font-size:1rem;cursor:pointer;" +
"background:#0e0f0b;color:#fbf8e4;border:2px solid #ff5c5c;border-radius:6px;padding:10px 16px;transition:box-shadow .2s;text-align:left}" +
".jshide{border-color:#6d6a52;font-size:.9rem;padding:8px 12px}" +
".jsbtn:hover{box-shadow:0 0 18px 2px rgba(255,92,92,.45)}.jshide:hover{box-shadow:0 0 14px rgba(230,216,74,.3)}" +
".jsbtn:disabled,.jshide:disabled{opacity:.55;cursor:default}" +
".jsbtn svg{width:26px;height:26px;flex:none}" +
".jsbtn small,.jshide small{display:block;font-family:var(--body);font-weight:400;font-size:.72rem;color:#d8d5b6}" +
".jsmeta{font-size:.85rem;color:var(--mist);flex-basis:100%}" +
".jsmeta button{font:inherit;background:none;border:0;color:var(--moon);text-decoration:underline;cursor:pointer;padding:4px}" +
".jsdark{inset:0;pointer-events:none;background:#000;opacity:0;transition:opacity .25s}" +
".jsdark.dim{opacity:.35}" +
".jsdark.go{animation:jsflick 1.7s steps(1) infinite}" +
"@keyframes jsflick{0%{opacity:.2}7%{opacity:.82}11%{opacity:.25}29%{opacity:.3}33%{opacity:.9}36%{opacity:.4}58%{opacity:.35}61%{opacity:.93}66%{opacity:.5}100%{opacity:.4}}" +
".jsflash{inset:0;background:#fff;pointer-events:none;animation:jsfl .16s linear both}" +
"@keyframes jsfl{from{opacity:1}to{opacity:0}}" +
".jsboo{inset:0;background:#000;display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden}" +
".jsboo .jsart{width:max(min(120vw,120vh),78vh);height:max(min(120vw,120vh),78vh);flex:none;transform-origin:50% 45%;" +
"filter:drop-shadow(7px 0 0 rgba(255,0,40,.55)) drop-shadow(-7px 0 0 rgba(0,240,255,.45));" +
"animation:jspop .11s cubic-bezier(.2,1.7,.4,1) both, jscreep 2.8s ease-in .11s both}" +
".jsboo .jsshake{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;animation:jsshake .07s linear 12}" +
".jsboo .jsnoise{position:absolute;inset:-50%;background:" + NOISE + ";mix-blend-mode:screen;opacity:.33;pointer-events:none;animation:jsjit .18s steps(3) infinite}" +
".jsboo .jsvig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,.85) 100%)}" +
".jsboo .jstag{position:absolute;bottom:14px;left:0;right:0;text-align:center;font-family:var(--display);color:rgba(255,255,255,.4);font-size:.8rem}" +
".jsboo.out{transition:opacity .45s;opacity:0}" +
".jstoast{left:50%;bottom:22%;transform:translateX(-50%);background:rgba(0,0,0,.8);color:#d8d5b6;font-family:var(--display);font-size:.95rem;padding:10px 16px;border-radius:6px;pointer-events:none;transition:opacity .6s}" +
"@keyframes jspop{from{transform:scale(.5)}to{transform:scale(1.12)}}" +
"@keyframes jscreep{from{transform:scale(1.12)}to{transform:scale(1.34)}}" +
"@keyframes jsshake{0%{transform:translate(0,0)}20%{transform:translate(-18px,10px) rotate(-1deg)}40%{transform:translate(16px,-12px) rotate(1deg)}60%{transform:translate(-12px,-8px)}80%{transform:translate(10px,12px)}100%{transform:translate(0,0)}}" +
"@keyframes jsjit{0%{transform:translate(0,0)}33%{transform:translate(-30px,20px)}66%{transform:translate(25px,-35px)}}" +
"@media (prefers-reduced-motion:reduce){.jsboo .jsart{animation:none;transform:scale(1.15)}.jsboo .jsshake,.jsboo .jsnoise{animation:none}.jsdark.go{animation:none;opacity:.6}}";
document.head.appendChild(css);

/* ---------- the creatures (all original drawings) ---------- */
var GRIME = '<filter id="jsg" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .6 -.12"/></filter>' +
  '<filter id="jsglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
function teeth(x1, x2, y, h, n, dir, col){
  var s = "", w = (x2 - x1) / n;
  for(var i = 0; i < n; i++){
    var a = x1 + i * w, hh = h * (0.6 + 0.4 * Math.abs(Math.sin(i * 2.3)));
    s += '<path d="M' + a.toFixed(1) + ' ' + y + ' L' + (a + w / 2).toFixed(1) + ' ' + (y + dir * hh).toFixed(1) + ' L' + (a + w).toFixed(1) + ' ' + y + ' Z" fill="' + col + '"/>';
  }
  return s;
}
var C = [];
/* 1. The thing in the corridor, right up close */
C.push({ name: "The thing in the corridor", svg:
'<svg viewBox="0 0 400 400"><defs>' + GRIME +
'<radialGradient id="jsh1" cx="50%" cy="38%" r="60%"><stop offset="0" stop-color="#3b3a30"/><stop offset=".6" stop-color="#16150f"/><stop offset="1" stop-color="#000"/></radialGradient></defs>' +
'<rect width="400" height="400" fill="#000"/>' +
'<ellipse cx="200" cy="200" rx="165" ry="215" fill="url(#jsh1)"/>' +
'<ellipse cx="128" cy="150" rx="52" ry="34" fill="#000" transform="rotate(14 128 150)"/><ellipse cx="272" cy="150" rx="52" ry="34" fill="#000" transform="rotate(-14 272 150)"/>' +
'<g filter="url(#jsglow)"><circle cx="134" cy="154" r="6" fill="#fff"/><circle cx="266" cy="154" r="6" fill="#fff"/></g>' +
'<path d="M110 215 Q200 190 290 215 Q300 330 200 395 Q100 330 110 215 Z" fill="#000"/>' +
teeth(118, 282, 222, 26, 14, 1, "#bdb7a2") + teeth(140, 260, 370, -22, 9, -1, "#8f8a78") +
'<path d="M0 400 C30 330 50 300 70 230 C74 214 86 214 84 232 C80 280 70 330 90 400 Z M400 400 C370 330 350 300 330 230 C326 214 314 214 316 232 C320 280 330 330 310 400 Z" fill="#0d0c09"/>' +
'<path d="M70 230 L58 170 M78 228 L74 160 M86 232 L92 168 M330 230 L342 170 M322 228 L326 160 M314 232 L308 168" stroke="#0d0c09" stroke-width="9" stroke-linecap="round"/>' +
'<rect width="400" height="400" filter="url(#jsg)"/></svg>' });
/* 2. The grin in the dark */
C.push({ name: "The grin in the dark", svg:
'<svg viewBox="0 0 400 400"><defs>' + GRIME + '</defs><rect width="400" height="400" fill="#000"/>' +
'<g fill="#ffd84a" filter="url(#jsglow)" opacity=".8"><ellipse cx="40" cy="40" rx="9" ry="4"/><ellipse cx="64" cy="42" rx="9" ry="4"/><ellipse cx="350" cy="30" rx="8" ry="4"/><ellipse cx="372" cy="32" rx="8" ry="4"/>' +
'<ellipse cx="24" cy="300" rx="8" ry="4"/><ellipse cx="46" cy="298" rx="8" ry="4"/><ellipse cx="356" cy="356" rx="9" ry="4"/><ellipse cx="380" cy="358" rx="9" ry="4"/><ellipse cx="300" cy="380" rx="7" ry="3"/><ellipse cx="318" cy="381" rx="7" ry="3"/></g>' +
'<g filter="url(#jsglow)"><ellipse cx="125" cy="120" rx="62" ry="40" fill="#ff2a0a"/><ellipse cx="275" cy="120" rx="62" ry="40" fill="#ff2a0a"/></g>' +
'<ellipse cx="125" cy="120" rx="9" ry="36" fill="#000"/><ellipse cx="275" cy="120" rx="9" ry="36" fill="#000"/>' +
'<path d="M30 220 Q200 300 370 220 Q330 380 200 390 Q70 380 30 220 Z" fill="#5c0000"/>' +
'<path d="M55 238 Q200 300 345 238 Q310 350 200 360 Q90 350 55 238 Z" fill="#000"/>' +
teeth(40, 360, 226, 46, 20, 1, "#f1ead0") + teeth(80, 320, 372, -40, 14, -1, "#d8d0b4") +
'<path d="M150 262 q4 40 0 70 M250 262 q-3 30 0 52" stroke="#9c1a1a" stroke-width="5" stroke-linecap="round" fill="none"/>' +
'<rect width="400" height="400" filter="url(#jsg)"/></svg>' });
/* 3. The shop dummy, jaw hanging open */
C.push({ name: "The shop dummy", svg:
'<svg viewBox="0 0 400 400"><defs>' + GRIME +
'<radialGradient id="jsh3" cx="45%" cy="35%" r="65%"><stop offset="0" stop-color="#f4efe4"/><stop offset=".75" stop-color="#bdb6a7"/><stop offset="1" stop-color="#6f6a60"/></radialGradient></defs>' +
'<rect width="400" height="400" fill="#120404"/>' +
'<path d="M90 400 L120 320 Q200 296 280 320 L310 400 Z" fill="#9d978b"/>' +
'<ellipse cx="200" cy="170" rx="128" ry="150" fill="url(#jsh3)"/>' +
'<ellipse cx="146" cy="150" rx="34" ry="24" fill="#0a0808"/><ellipse cx="254" cy="150" rx="34" ry="24" fill="#0a0808"/>' +
'<g filter="url(#jsglow)"><circle cx="256" cy="152" r="10" fill="#ff1a1a"/></g><circle cx="256" cy="152" r="4" fill="#000"/>' +
'<path d="M150 236 Q200 222 250 236 L262 380 Q200 400 138 380 Z" fill="#050303"/>' +
teeth(152, 248, 238, 16, 8, 1, "#d6d0c2") +
'<path d="M200 22 L184 80 L210 118 L188 176 L200 206" fill="none" stroke="#2a2621" stroke-width="4"/><path d="M300 90 L276 140 L304 168 L284 210" fill="none" stroke="#2a2621" stroke-width="3"/><path d="M96 120 L124 150 L104 196" fill="none" stroke="#2a2621" stroke-width="3"/>' +
'<rect width="400" height="400" filter="url(#jsg)"/></svg>' });
/* 4. Bonnie, but wrong */
C.push({ name: "Bonnie, but wrong", svg:
'<svg viewBox="0 0 400 400"><defs>' + GRIME + '</defs><rect width="400" height="400" fill="#0c0503"/>' +
'<g fill="#3a2215"><circle cx="200" cy="235" r="120"/><circle cx="110" cy="140" r="62"/><circle cx="290" cy="140" r="62"/><circle cx="200" cy="100" r="78"/><circle cx="145" cy="78" r="44"/><circle cx="255" cy="78" r="44"/></g>' +
'<g fill="#24130a"><ellipse cx="84" cy="220" rx="38" ry="70"/><ellipse cx="316" cy="220" rx="38" ry="70"/></g>' +
'<g filter="url(#jsglow)"><circle cx="155" cy="190" r="30" fill="#ff2a14"/><circle cx="245" cy="190" r="30" fill="#ff2a14"/></g>' +
'<ellipse cx="155" cy="190" rx="5" ry="20" fill="#000"/><ellipse cx="245" cy="190" rx="5" ry="20" fill="#000"/>' +
'<ellipse cx="200" cy="248" rx="26" ry="17" fill="#000"/>' +
'<path d="M110 280 Q200 380 290 280 Q200 320 110 280 Z" fill="#000"/>' +
teeth(116, 284, 284, 30, 12, 1, "#f2ead6") + teeth(140, 260, 340, -22, 9, -1, "#d9cfb6") +
'<path d="M170 330 q2 30 -2 50 M232 326 q-2 22 2 40" stroke="#c9c2a8" stroke-width="4" stroke-linecap="round" fill="none" opacity=".7"/>' +
'<rect width="400" height="400" filter="url(#jsg)"/></svg>' });
/* 5. The face at the window */
C.push({ name: "The face at the window", svg:
'<svg viewBox="0 0 400 400"><defs>' + GRIME +
'<radialGradient id="jsh5" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#9aa3a6"/><stop offset=".7" stop-color="#3d4446"/><stop offset="1" stop-color="#0b0d0e"/></radialGradient></defs>' +
'<rect width="400" height="400" fill="#05080a"/>' +
'<ellipse cx="200" cy="205" rx="140" ry="175" fill="url(#jsh5)"/>' +
'<path d="M96 186 Q140 150 182 182 Q140 200 96 186 Z" fill="#000"/><path d="M218 182 Q260 150 304 186 Q260 200 218 182 Z" fill="#000"/>' +
'<g filter="url(#jsglow)"><circle cx="144" cy="180" r="6" fill="#e8fbff"/><circle cx="256" cy="180" r="6" fill="#e8fbff"/></g>' +
'<path d="M96 290 Q150 268 200 300 Q252 272 312 296 Q260 330 200 318 Q140 330 96 290 Z" fill="#000"/>' +
teeth(110, 300, 292, 14, 16, 1, "#d7dcde") +
'<g fill="#c9cfd1" opacity=".9" transform="translate(0 -150)"><path d="M20 260 q10 -60 30 -70 q12 -4 12 10 l-4 50 q16 -64 30 -66 q12 0 10 14 l-10 60 q18 -50 30 -50 q12 2 8 16 l-16 56 q16 -30 26 -28 q10 4 4 18 l-30 70 q-20 40 -60 30 q-40 -10 -40 -60 Z"/>' +
'<path d="M380 260 q-10 -60 -30 -70 q-12 -4 -12 10 l4 50 q-16 -64 -30 -66 q-12 0 -10 14 l10 60 q-18 -50 -30 -50 q-12 2 -8 16 l16 56 q-16 -30 -26 -28 q-10 4 -4 18 l30 70 q20 40 60 30 q40 -10 40 -60 Z"/></g>' +
'<rect width="400" height="400" fill="#b8c6cc" opacity=".08"/>' +
'<path d="M0 200 H400 M200 0 V400" stroke="#1a1d1f" stroke-width="14"/>' +
'<rect width="400" height="400" filter="url(#jsg)"/></svg>' });

/* ---------- sound ---------- */
/* The scream is a short WAV made right here and played through an audio
   element, which still plays when a phone is on silent. */
var screamEl = null, AC = null, unlocked = false;
function makeScream(){
  var sr = 22050, len = Math.floor(sr * 1.6), d = new Float32Array(len), i;
  var f = [610, 830, 1040, 1390, 1820], ph = [0, 0, 0, 0, 0], last = 0, peak = 0;
  for(i = 0; i < len; i++){
    var t = i / sr, env = Math.min(1, t / 0.006) * Math.exp(-t * 1.35), x = 0;
    for(var k = 0; k < f.length; k++){
      var fr = f[k] * (1 - 0.38 * t / 1.6) * (1 + 0.07 * Math.sin(2 * Math.PI * (17 + k * 3) * t + k));
      ph[k] = (ph[k] + fr / sr) % 1;
      x += (2 * ph[k] - 1) * (k === 4 ? 0.5 : 1);
    }
    var n = Math.random() * 2 - 1, hp = n - last; last = n;
    x = x * 0.32 + hp * 0.9 * Math.exp(-t * 4);
    x = Math.tanh(x * 2.6) * env;
    x += Math.sin(2 * Math.PI * 52 * t) * Math.exp(-t * 7) * 1.1;
    d[i] = x; if(Math.abs(x) > peak) peak = Math.abs(x);
  }
  var buf = new ArrayBuffer(44 + len * 2), v = new DataView(buf);
  function w(o, s){ for(var j = 0; j < s.length; j++) v.setUint8(o + j, s.charCodeAt(j)); }
  w(0, "RIFF"); v.setUint32(4, 36 + len * 2, true); w(8, "WAVE"); w(12, "fmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36, "data"); v.setUint32(40, len * 2, true);
  for(i = 0; i < len; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, d[i] / peak * 0.97)) * 32767, true);
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
}
function unlock(){
  if(unlocked) return;
  try{
    if(!screamEl){ screamEl = new Audio(makeScream()); screamEl.preload = "auto"; }
    screamEl.muted = true;
    var p = screamEl.play();
    var done = function(){ screamEl.pause(); screamEl.currentTime = 0; screamEl.muted = false; unlocked = true; };
    if(p && p.then) p.then(done, function(){}); else done();
    var A = window.AudioContext || window.webkitAudioContext;
    if(A){ AC = AC || new A(); if(AC.state === "suspended") AC.resume(); }
  }catch(e){}
}
function scream(){
  if(!st.sound) return;
  try{ if(!screamEl) screamEl = new Audio(makeScream()); screamEl.muted = false; screamEl.volume = 1; screamEl.currentTime = 0; screamEl.play(); }catch(e){}
}
/* the build up: a low drone and a heartbeat that speeds up */
var dread = null;
function dreadStart(ms){
  if(!st.sound || !AC) return;
  try{
    var t = AC.currentTime, g = AC.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, t + ms / 1000);
    var lp = AC.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 320;
    var o1 = AC.createOscillator(), o2 = AC.createOscillator(); o1.type = o2.type = "sawtooth"; o1.frequency.value = 55; o2.frequency.value = 58.3;
    o1.connect(lp); o2.connect(lp); lp.connect(g); g.connect(AC.destination); o1.start(); o2.start();
    var beats = [], at = 0.2, gap = 0.95;
    while(at < ms / 1000){ beats.push(at); at += gap; gap = Math.max(0.38, gap * 0.9); }
    beats.forEach(function(b){
      [0, 0.17].forEach(function(off, j){
        var o = AC.createOscillator(), bg = AC.createGain(); o.type = "sine"; o.frequency.setValueAtTime(70, t + b + off); o.frequency.exponentialRampToValueAtTime(38, t + b + off + 0.14);
        bg.gain.setValueAtTime(0.0001, t + b + off); bg.gain.exponentialRampToValueAtTime(j ? 0.35 : 0.55, t + b + off + 0.015); bg.gain.exponentialRampToValueAtTime(0.0001, t + b + off + 0.16);
        o.connect(bg); bg.connect(AC.destination); o.start(t + b + off); o.stop(t + b + off + 0.2);
      });
    });
    dread = { g: g, o: [o1, o2] };
  }catch(e){}
}
function dreadStop(fast){
  if(!dread || !AC) return;
  try{
    var t = AC.currentTime, d = dread; dread = null;
    d.g.gain.cancelScheduledValues(t); d.g.gain.setValueAtTime(d.g.gain.value, t); d.g.gain.exponentialRampToValueAtTime(0.0001, t + (fast ? 0.05 : 0.8));
    setTimeout(function(){ d.o.forEach(function(o){ try{ o.stop(); }catch(e){} }); }, fast ? 100 : 900);
  }catch(e){}
}

/* ---------- the scare itself ---------- */
var busy = false;
function pickCreature(){
  var k; do{ k = Math.floor(Math.random() * C.length); }while(C.length > 1 && k === st.last);
  st.last = k; return C[k];
}
function toast(text, ms){
  var t = document.createElement("div"); t.className = "jstoast"; t.textContent = text;
  document.body.appendChild(t);
  setTimeout(function(){ t.style.opacity = "0"; }, ms);
  setTimeout(function(){ t.parentNode && t.parentNode.removeChild(t); }, ms + 700);
}
function boo(after){
  dreadStop(true);
  var c = pickCreature();
  var fl = document.createElement("div"); fl.className = "jsflash"; document.body.appendChild(fl);
  setTimeout(function(){ fl.parentNode && fl.parentNode.removeChild(fl); }, 200);
  var o = document.createElement("div"); o.className = "jsboo"; o.setAttribute("role", "img"); o.setAttribute("aria-label", c.name);
  o.innerHTML = '<div class="jsshake"><div class="jsart">' + c.svg + '</div></div><div class="jsnoise"></div><div class="jsvig"></div><div class="jstag">tap anywhere</div>';
  document.body.appendChild(o);
  scream();
  try{ if(navigator.vibrate) navigator.vibrate([250, 80, 400]); }catch(e){}
  var gone = false;
  function close(){
    if(gone) return; gone = true;
    o.classList.add("out");
    document.removeEventListener("keydown", close);
    setTimeout(function(){ o.parentNode && o.parentNode.removeChild(o); }, 450);
    fresh(); st.n = (st.n || 0) + 1; save();
    busy = false;
    if(after) after();
  }
  o.addEventListener("click", close);
  setTimeout(function(){ document.addEventListener("keydown", close); }, 300);
  setTimeout(close, 3000);
}
/* the lights fail, the dread builds, then... */
function buildUp(ms, after){
  busy = true;
  var dark = document.createElement("div"); dark.className = "jsdark";
  document.body.appendChild(dark);
  setTimeout(function(){ dark.classList.add(calm ? "dim" : "go"); }, 30);
  dreadStart(ms);
  var fake = Math.random() < 0.35 && ms > 3200;
  function end(){ dark.parentNode && dark.parentNode.removeChild(dark); boo(after); }
  if(fake){
    setTimeout(function(){
      dark.classList.remove("go"); dark.classList.remove("dim"); dreadStop(false);
      toast("...false alarm.", 1300);
      setTimeout(end, rnd(1900, 3400));
    }, ms * 0.6);
  }else setTimeout(end, ms);
}

/* ---------- a hidden one, on any page ---------- */
var touched = false;
["pointerdown", "keydown", "touchstart"].forEach(function(ev){
  document.addEventListener(ev, function(){ touched = true; unlock(); }, { passive: true });
});
function watch(){
  fresh();
  if(!st.armed || busy || document.visibilityState !== "visible" || !touched) return;
  if(Date.now() < st.armed) return;
  st.armed = 0; save();
  busy = true;
  var dark = document.createElement("div"); dark.className = "jsdark go"; document.body.appendChild(dark);
  setTimeout(function(){ dark.parentNode && dark.parentNode.removeChild(dark); boo(drawMeta); }, calm ? 200 : 650);
}
setInterval(watch, 1000);

/* ---------- the home page buttons ---------- */
var GHOST = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 28V14a10 10 0 0 1 20 0v14l-3.5-3-3 3-3.5-3-3.5 3-3-3Z" fill="#fbf8e4"/><circle cx="12.5" cy="14" r="2.4" fill="#0e0f0b"/><circle cx="19.5" cy="14" r="2.4" fill="#0e0f0b"/><ellipse cx="16" cy="20" rx="2" ry="2.6" fill="#0e0f0b"/></svg>';
var LINES = ["Survived. Your heart rate will be back soon.", "Still here. Brave.", "That one was rude, to be fair.",
  "Did you jump? You jumped.", "Back to normal. Probably.", "The night shift salutes you."];
var btn, hide, meta;
/* scares are earned with sparks when /lc/break.js is on the page */
function gated(fn){ if(window.LCGate) window.LCGate.request(fn); else fn(); }
function drawMeta(msg){
  if(!meta) return;
  fresh();
  var armed = st.armed && st.armed > Date.now();
  if(hide) hide.disabled = !!armed;
  meta.innerHTML = (window.LCGate ? "<b>" + window.LCGate.note() + "</b> " : "") + (msg ? msg + " " : "") +
    (armed ? "One is hidden somewhere in the HQ. It could be any minute. " : "") +
    (st.n ? "Scares survived: <b>" + st.n + "</b>. " : "") +
    "Sound is " + (st.sound ? "on" : "off") + ' <button type="button" id="jsSound">' + (st.sound ? "turn it off" : "turn it on") + "</button>" +
    (armed ? ' <button type="button" id="jsDisarm">take it back</button>' : "");
  document.getElementById("jsSound").onclick = function(){ fresh(); st.sound = !st.sound; save(); drawMeta(); };
  var dz = document.getElementById("jsDisarm");
  if(dz) dz.onclick = function(){ fresh(); st.armed = 0; save(); drawMeta("Taken back. Nothing is hiding now."); };
  if(btn) btn.disabled = busy;
}
function mount(){
  var hero = document.querySelector(".hero");
  if(!hero) return;
  var box = document.createElement("div"); box.className = "jsbox";
  btn = document.createElement("button"); btn.type = "button"; btn.className = "jsbtn";
  btn.innerHTML = GHOST + '<span>Jumpscare<small>Sudden and loud. Only if you want one.</small></span>';
  hide = document.createElement("button"); hide.type = "button"; hide.className = "jshide";
  hide.innerHTML = '<span>Hide one for later<small>It goes off at a random moment, on any page here.</small></span>';
  meta = document.createElement("span"); meta.className = "jsmeta";
  box.appendChild(btn); box.appendChild(hide); box.appendChild(meta);
  hero.appendChild(box);
  drawMeta();
  btn.onclick = function(){
    if(busy) return;
    unlock();
    gated(function(){
      btn.disabled = true;
      buildUp(rnd(2600, 6500), function(){ drawMeta(LINES[Math.floor(Math.random() * LINES.length)]); btn.focus(); });
    });
  };
  hide.onclick = function(){
    unlock(); fresh();
    gated(function(){
      st.armed = Date.now() + Math.round(rnd(60, 300)) * 1000; save();
      drawMeta("Hidden. Carry on as normal...");
    });
  };
  window.LCScareRedraw = function(){ if(!busy) drawMeta(); };
  setInterval(function(){ if(!busy) drawMeta(); }, 15000);
}
if(WITH_BUTTON){ if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount(); }
})();
