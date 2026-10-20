/* ==========================================================
   LC's Night Shift HQ - Night Corridor
   LC's HQ game. The building after hours: one long corridor that
   keeps looping. Walk it. If anything is different from normal,
   turn back. If nothing has changed, keep walking. Eight right
   calls in a row and you clock off at Floor 8. One wrong call and
   it is back to Floor 0.

   Spooky, never gory. No sudden loud noises (LC has the jumpscare
   button for those). Everything is drawn in code. Sound can be
   turned off. Arrow keys or W and S also work.

   Any page:  window.LCCorridor.open() / .close()
   The earned break around it is in /lc/break.js (/data/hqbreak.js).
   Saves { best, runs, clocked, sound, seen } in b5.lc.corridor.v1.
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(window.LCCorridor) return;

var KEY = "b5.lc.corridor.v1";
var GOAL = 8;
var CHANCE = 0.55;          /* how often a corridor has something wrong in it */
var RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

var store = { best: 0, runs: 0, clocked: 0, sound: true, seen: {} };
function load(){ try{ var o = JSON.parse(localStorage.getItem(KEY) || "null"); if(o && typeof o === "object") for(var k in store) if(o[k] !== undefined) store[k] = o[k]; }catch(e){} if(!store.seen || typeof store.seen !== "object") store.seen = {}; }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(store)); }catch(e){} }
load();

/* ---------- the things that can be different ----------
   Each one names what was wrong, so a right call teaches you to look. */
var ODD = [
  { id: "light",   say: "One of the strip lights was out." },
  { id: "clock",   say: "The clock had thirteen on it." },
  { id: "exit",    say: "The exit sign was spelled backwards." },
  { id: "door",    say: "The door on the left was open a crack, and the light was on." },
  { id: "ext",     say: "The fire extinguisher had gone." },
  { id: "steps",   say: "There were wet footprints on the floor." },
  { id: "figure",  say: "Someone was standing at the far end." },
  { id: "plaque",  say: "The floor sign showed the wrong floor." },
  { id: "poster",  say: "The poster was upside down." },
  { id: "notice",  say: "The notice said TURN BACK." },
  { id: "bonnie",  say: "Bonnie was in the corridor. She is not on the night shift." },
  { id: "extra",   say: "There was an extra door on the right." },
  { id: "wet",     say: "The sign said DRY FLOOR." },
  { id: "paper",   say: "The wallpaper had gone red." },
  { id: "bird",    say: "There was a bird on the light. Jay would have liked that one." }
];

/* ---------- drawing ---------- */
var W = 800, H = 500;
function scene(floor, odd, reveal){
  var o = function(id){ return odd === id; };
  var hi = function(id, svg){ return reveal && o(id) ? '<g class="lcc-hi">' + svg + '</g>' : svg; };
  var paper = o("paper") ? "#7c2f2a" : "#b9a65a";
  var paper2 = o("paper") ? "#6a2522" : "#a8964c";
  var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="lcc-svg" role="img" aria-label="A long corridor at night, Floor ' + floor + '">' +
    '<defs>' +
      '<pattern id="lccP" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="' + paper + '"/><path d="M11 3l3 8-3 8-3-8z" fill="' + paper2 + '"/><rect x="0" y="0" width="2" height="22" fill="' + paper2 + '" opacity=".6"/></pattern>' +
      '<pattern id="lccF" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#5e5a4a"/><rect width="20" height="20" fill="#686452"/><rect x="20" y="20" width="20" height="20" fill="#686452"/></pattern>' +
      '<radialGradient id="lccG" cx="50%" cy="0%" r="90%"><stop offset="0" stop-color="#fff9c4" stop-opacity=".55"/><stop offset="1" stop-color="#fff9c4" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="lccD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>' +
    '</defs>' +
    /* ceiling, floor, walls in one point perspective; vanishing box 330..470 x 170..300 */
    '<polygon points="0,0 800,0 470,170 330,170" fill="#d8d4b4"/>' +
    '<polygon points="0,500 800,500 470,300 330,300" fill="url(#lccF)"/>' +
    '<polygon points="0,500 800,500 470,300 330,300" fill="url(#lccD)" opacity=".7"/>' +
    '<polygon points="0,0 330,170 330,300 0,500" fill="url(#lccP)"/>' +
    '<polygon points="800,0 470,170 470,300 800,500" fill="url(#lccP)"/>' +
    '<polygon points="0,0 330,170 330,300 0,500" fill="#000" opacity=".18"/>' +
    '<polygon points="800,0 470,170 470,300 800,500" fill="#000" opacity=".1"/>' +
    /* skirting */
    '<polygon points="0,470 330,290 330,300 0,500" fill="#3b3a30"/><polygon points="800,470 470,290 470,300 800,500" fill="#3b3a30"/>' +
    /* far wall, exit door and sign */
    '<rect x="330" y="170" width="140" height="130" fill="' + (o("paper") ? "#5e2420" : "#9c8c4a") + '"/>' +
    '<rect x="372" y="208" width="56" height="92" fill="#5b4a33" stroke="#2e2619" stroke-width="3"/><circle cx="420" cy="256" r="2.5" fill="#d8c27a"/>' +
    hi("exit", '<rect x="370" y="186" width="60" height="18" rx="2" fill="#123c22"/><text x="400" y="200" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="#5dff9b" class="lcc-glow">' + (o("exit") ? "TIXE" : "EXIT") + '</text>') +
    (o("figure") ? hi("figure", '<g class="lcc-fig"><ellipse cx="400" cy="236" rx="7" ry="8" fill="#111"/><path d="M391 246q9-6 18 0l2 54h-22z" fill="#111"/></g>') : "") +
    /* ceiling strip lights */
    light(0, o("light") ? false : true) + light(1, true) + light(2, true) +
    (o("bird") ? hi("bird", '<g transform="translate(470 92) scale(.9)"><ellipse cx="0" cy="0" rx="14" ry="10" fill="#3a8fd6"/><circle cx="11" cy="-7" r="8" fill="#3a8fd6"/><path d="M18 -8l8 3-8 3z" fill="#f2a516"/><circle cx="13" cy="-9" r="1.8" fill="#111"/><path d="M-12 2l-11-4 4 8z" fill="#3a8fd6"/></g>') : "") +
    /* left wall: near door, poster, extinguisher */
    hi("door", door("L", o("door"))) +
    hi("poster", '<g transform="translate(206 168) skewY(28)"><rect x="0" y="0" width="58" height="76" fill="#efe6c8" stroke="#3b3a30" stroke-width="3"/>' +
      '<g' + (o("poster") ? ' transform="rotate(180 29 38)"' : '') + '><circle cx="29" cy="26" r="13" fill="#e0b84a"/><path d="M22 28q7 7 14 0" stroke="#3b3a30" stroke-width="2.5" fill="none"/><circle cx="24" cy="22" r="2" fill="#3b3a30"/><circle cx="34" cy="22" r="2" fill="#3b3a30"/>' +
      '<text x="29" y="58" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#3b3a30">SMILE</text><text x="29" y="70" text-anchor="middle" font-family="Arial,sans-serif" font-size="7" fill="#3b3a30">IT IS LATE</text></g></g>') +
    (o("ext") ? hi("ext", '<g transform="translate(276 300) skewY(28)"><rect x="0" y="-4" width="20" height="4" fill="#3b3a30"/><rect x="2" y="0" width="16" height="3" fill="#2a2920" opacity=".5"/></g>') :
      '<g transform="translate(276 284) skewY(28)"><rect x="0" y="12" width="20" height="44" rx="6" fill="#c8262a"/><rect x="5" y="0" width="10" height="14" fill="#2a2920"/><path d="M15 6h10v8" stroke="#2a2920" stroke-width="3" fill="none"/><rect x="3" y="26" width="14" height="10" fill="#f3f0e2"/></g>') +
    /* right wall: clock, notice board, door, extra door */
    hi("clock", clock(o("clock"))) +
    hi("notice", '<g transform="translate(560 140) skewY(-28)"><rect x="0" y="0" width="74" height="54" fill="#8a6a3e" stroke="#4a3820" stroke-width="3"/><rect x="8" y="8" width="34" height="24" fill="#fffbe8"/><rect x="46" y="12" width="20" height="30" fill="#ffe08a"/>' +
      '<text x="25" y="20" text-anchor="middle" font-family="Arial,sans-serif" font-size="' + (o("notice") ? 8 : 7) + '" font-weight="700" fill="' + (o("notice") ? "#b3261e" : "#3b3a30") + '">' + (o("notice") ? "TURN" : "FIRE") + '</text>' +
      '<text x="25" y="29" text-anchor="middle" font-family="Arial,sans-serif" font-size="' + (o("notice") ? 8 : 7) + '" font-weight="700" fill="' + (o("notice") ? "#b3261e" : "#3b3a30") + '">' + (o("notice") ? "BACK" : "DRILL") + '</text></g>') +
    door("R", false) +
    (o("extra") ? hi("extra", '<g transform="translate(486 204) skewY(-28)"><rect x="0" y="0" width="34" height="78" fill="#5b4a33" stroke="#2e2619" stroke-width="3"/><circle cx="6" cy="42" r="2" fill="#d8c27a"/></g>') : "") +
    /* floor: plaque, wet floor sign, footprints, Bonnie */
    hi("plaque", '<g transform="translate(36 250) skewY(28)"><rect x="0" y="0" width="70" height="40" rx="4" fill="#1f2a22" stroke="#cfc9a6" stroke-width="3"/><text x="35" y="16" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#cfc9a6">FLOOR</text>' +
      '<text x="35" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="#fbf8e4">' + (o("plaque") ? (floor + 3) % 9 : floor) + '</text></g>') +
    hi("wet", '<g transform="translate(560 360)"><path d="M0 70l22-70h16l22 70z" fill="#f2c916" stroke="#2a2920" stroke-width="3" stroke-linejoin="round"/><text x="30" y="40" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#2a2920">' + (o("wet") ? "DRY" : "WET") + '</text><text x="30" y="51" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#2a2920">FLOOR</text></g>') +
    (o("steps") ? hi("steps", steps()) : "") +
    (o("bonnie") ? hi("bonnie", '<g transform="translate(330 352)">' + (window.A2ART ? A2ART.bonnie(0, 0, 0.9, "sit") : '<ellipse cx="0" cy="10" rx="22" ry="24" fill="#9c6b45"/><circle cx="0" cy="-22" r="16" fill="#a87650"/>') + '</g>') : "") +
    /* the hum: a soft glow from the lights */
    '<polygon points="0,0 800,0 470,170 330,170" fill="url(#lccG)"/>' +
    '</svg>';
  return s;
}
function light(i, on){
  /* three lights receding along the ceiling */
  var y = [40, 98, 138][i], w = [300, 150, 80][i], h = [14, 8, 5][i];
  var x = 400 - w / 2;
  return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="' + (on ? "#fffbe0" : "#55554a") + '"' + (on && i === 1 ? ' class="lcc-flick"' : '') + '/>' +
    (on ? '<rect x="' + (x - 6) + '" y="' + (y - 4) + '" width="' + (w + 12) + '" height="' + (h + 8) + '" rx="6" fill="#fff8b0" opacity=".18"/>' : "");
}
function door(side, ajar){
  if(side === "L"){
    return '<g transform="translate(60 120) skewY(28)">' +
      '<rect x="0" y="0" width="92" height="210" fill="#4a3a26" stroke="#241b10" stroke-width="5"/>' +
      (ajar ? '<rect x="0" y="0" width="16" height="210" fill="#fff4a8" opacity=".9"/><rect x="16" y="0" width="76" height="210" fill="#5b4a33" stroke="#241b10" stroke-width="4"/>' : '<rect x="10" y="12" width="72" height="80" fill="#57452e"/><rect x="10" y="108" width="72" height="88" fill="#57452e"/>') +
      '<circle cx="80" cy="112" r="5" fill="#d8c27a"/><rect x="26" y="-26" width="40" height="18" fill="#1f2a22"/><text x="46" y="-12" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="#cfc9a6">B12</text></g>';
  }
  return '<g transform="translate(626 196) skewY(-28)"><rect x="0" y="0" width="60" height="140" fill="#4a3a26" stroke="#241b10" stroke-width="4"/><rect x="8" y="10" width="44" height="52" fill="#57452e"/><circle cx="8" cy="76" r="4" fill="#d8c27a"/></g>';
}
function clock(odd){
  var nums = "";
  for(var n = 1; n <= 12; n++){
    var a = (n / 12) * Math.PI * 2, lab = odd && n === 12 ? 13 : n;
    nums += '<text x="' + (Math.sin(a) * 19).toFixed(1) + '" y="' + (-Math.cos(a) * 19 + 3).toFixed(1) + '" text-anchor="middle" font-family="Arial,sans-serif" font-size="' + (lab > 9 ? 6 : 7) + '" fill="#2a2920">' + lab + '</text>';
  }
  return '<g transform="translate(700 104) skewY(-28)"><circle r="27" fill="#fffbe8" stroke="#2a2920" stroke-width="4"/>' + nums +
    '<line x1="0" y1="0" x2="0" y2="-14" stroke="#2a2920" stroke-width="3" stroke-linecap="round"/><line x1="0" y1="0" x2="10" y2="4" stroke="#2a2920" stroke-width="2.5" stroke-linecap="round"/><circle r="2.5" fill="#c8262a"/></g>';
}
function steps(){
  var out = "", i;
  for(i = 0; i < 6; i++){
    var t = i / 6, x = 400 + (i % 2 ? 14 : -14) * (1 - t * 0.7), y = 470 - t * 160, s = 1 - t * 0.7;
    out += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + (9 * s).toFixed(1) + '" ry="' + (16 * s).toFixed(1) + '" fill="#2b3a44" opacity=".55"/>';
  }
  return out;
}

/* ---------- sound: a soft electrical hum and a footstep, never loud ---------- */
var ac = null, hum = null;
function audio(){
  if(!store.sound) return null;
  try{ ac = ac || new (window.AudioContext || window.webkitAudioContext)(); }catch(e){ ac = null; }
  return ac;
}
function humOn(){
  var a = audio(); if(!a || hum) return;
  try{
    var o1 = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain();
    o1.type = "sawtooth"; o1.frequency.value = 50; o2.type = "sine"; o2.frequency.value = 100;
    g.gain.value = 0.012;
    o1.connect(g); o2.connect(g); g.connect(a.destination); o1.start(); o2.start();
    hum = { o1: o1, o2: o2, g: g };
  }catch(e){}
}
function humOff(){ if(hum){ try{ hum.o1.stop(); hum.o2.stop(); }catch(e){} hum = null; } }
function step(n){
  var a = audio(); if(!a) return;
  for(var i = 0; i < (n || 3); i++){
    (function(k){
      try{
        var t = a.currentTime + k * 0.22, b = a.createBufferSource(), buf = a.createBuffer(1, a.sampleRate * 0.08, a.sampleRate), d = buf.getChannelData(0);
        for(var j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / d.length, 3);
        var f = a.createBiquadFilter(), g = a.createGain();
        f.type = "lowpass"; f.frequency.value = 420; g.gain.value = 0.22;
        b.buffer = buf; b.connect(f); f.connect(g); g.connect(a.destination); b.start(t);
      }catch(e){}
    })(i);
  }
}
function chime(up){
  var a = audio(); if(!a) return;
  try{
    var o = a.createOscillator(), g = a.createGain(), t = a.currentTime;
    o.type = "triangle"; o.frequency.setValueAtTime(up ? 523 : 220, t); o.frequency.linearRampToValueAtTime(up ? 784 : 165, t + 0.25);
    g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + 0.55);
  }catch(e){}
}

/* ---------- the overlay ---------- */
var css = document.createElement("style");
css.textContent =
  "html body>.lccorr{position:fixed !important;inset:0;z-index:2147482000 !important}" +
  ".lccorr{background:#0b0c09;color:#fbf8e4;display:flex;flex-direction:column;font-family:var(--body,'Atkinson Hyperlegible',Verdana,sans-serif)}" +
  ".lcc-top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;flex-wrap:wrap}" +
  ".lcc-top h2{margin:0;font-family:var(--display,'Space Mono',monospace);font-size:1.15rem;letter-spacing:.02em}" +
  ".lcc-top .lcc-f{font-family:var(--display,'Space Mono',monospace);font-size:.95rem;color:#e6d84a}" +
  ".lcc-top button{font:inherit;font-size:.9rem;background:none;border:2px solid #6d6a52;color:#fbf8e4;border-radius:6px;padding:6px 12px;cursor:pointer}" +
  ".lcc-stage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:0 10px;overflow:hidden}" +
  ".lcc-view{width:min(100%,calc((100vh - 200px) * 1.6));max-width:980px;aspect-ratio:8/5;position:relative;border:3px solid #2a2920;border-radius:6px;overflow:hidden;box-shadow:0 0 60px rgba(230,216,74,.12)}" +
  ".lcc-svg{width:100%;height:100%;display:block}" +
  ".lcc-view.walk .lcc-svg{animation:lccwalk .5s ease-in both}" +
  ".lcc-view.back .lcc-svg{animation:lccback .5s ease-in both}" +
  "@keyframes lccwalk{0%{transform:scale(1)}100%{transform:scale(2.4);opacity:0}}" +
  "@keyframes lccback{0%{transform:scale(1)}100%{transform:scale(.4) rotate(-4deg);opacity:0}}" +
  "@media (prefers-reduced-motion:no-preference){.lcc-flick{animation:lccflick 5s steps(1) infinite}.lcc-glow{animation:lccglow 3s ease-in-out infinite alternate}.lcc-fig{animation:lccfig 6s ease-in-out infinite}}" +
  "@keyframes lccflick{0%,100%{opacity:1}41%{opacity:.35}43%{opacity:1}44%{opacity:.5}46%{opacity:1}}" +
  "@keyframes lccglow{from{opacity:.75}to{opacity:1}}" +
  "@keyframes lccfig{0%,100%{opacity:.85}50%{opacity:.6}}" +
  ".lcc-hi>*{filter:drop-shadow(0 0 6px #ff5c5c) drop-shadow(0 0 2px #ff5c5c)}" +
  ".lcc-msg{position:absolute;left:50%;top:10px;transform:translateX(-50%);width:max-content;max-width:92%;padding:8px 14px;border-radius:6px;background:rgba(14,15,11,.86);border:2px solid #e6d84a;font-size:.98rem;text-align:center}" +
  ".lcc-msg[hidden]{display:none}" +
  ".lcc-bar{display:flex;justify-content:center;gap:12px;padding:12px 14px 16px;flex-wrap:wrap}" +
  ".lcc-bar button{font-family:var(--display,'Space Mono',monospace);font-weight:700;font-size:1.05rem;min-width:170px;min-height:54px;border-radius:6px;cursor:pointer;border:3px solid #0e0f0b;box-shadow:0 5px 0 #000}" +
  ".lcc-back{background:#ff5c5c;color:#0e0f0b}.lcc-go{background:#39d98a;color:#0e0f0b}" +
  ".lcc-bar button:disabled{opacity:.5;cursor:default}" +
  ".lcc-card{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(5,6,4,.78);padding:16px}" +
  ".lcc-card>div{max-width:440px;background:#fbf8e4;color:#0e0f0b;border:4px solid #0e0f0b;border-radius:8px;padding:18px 18px 14px;text-align:center;box-shadow:0 8px 0 #000}" +
  ".lcc-card h3{margin:0 0 6px;font-family:var(--display,'Space Mono',monospace);font-size:1.35rem}" +
  ".lcc-card p{margin:6px 0;line-height:1.45}" +
  ".lcc-card button{margin-top:10px;font-family:var(--display,'Space Mono',monospace);font-weight:700;font-size:1.05rem;padding:10px 18px;border-radius:6px;border:3px solid #0e0f0b;background:#e6d84a;cursor:pointer;box-shadow:0 4px 0 #0e0f0b}" +
  ".lcc-dots{display:flex;gap:6px;justify-content:center}.lcc-dots i{width:12px;height:12px;border-radius:2px;border:2px solid #6d6a52}.lcc-dots i.on{background:#e6d84a;border-color:#e6d84a}" +
  "@media (max-width:560px){.lcc-bar button{min-width:44%;font-size:.95rem}.lcc-view{width:100%}}";
document.head.appendChild(css);

var root = null, floor = 0, odd = null, busy = false, keyH = null;
function el(t, c, h){ var e = document.createElement(t); if(c) e.className = c; if(h != null) e.innerHTML = h; return e; }
function dots(){ var h = ""; for(var i = 1; i <= GOAL; i++) h += '<i class="' + (i <= floor ? "on" : "") + '"></i>'; return '<span class="lcc-dots" aria-hidden="true">' + h + '</span>'; }
function pickOdd(){
  if(floor === 0) return null;               /* Floor 0 is always normal: learn it */
  if(Math.random() >= CHANCE) return null;
  var pool = ODD.filter(function(x){ return !(x.id === "bonnie" && Math.random() < 0.6); });
  return pool[Math.floor(Math.random() * pool.length)].id;
}
function draw(reveal){
  var v = root.querySelector(".lcc-view");
  v.querySelector(".lcc-scene").innerHTML = scene(floor, odd, reveal);
  root.querySelector(".lcc-f").innerHTML = "Floor " + floor + " " + dots();
  root.querySelector(".lcc-snd").textContent = store.sound ? "Sound on" : "Sound off";
}
function say(t){ var m = root.querySelector(".lcc-msg"); if(!t){ m.hidden = true; return; } m.hidden = false; m.textContent = t; }
function card(html, btn, then){
  var c = el("div", "lcc-card", "<div>" + html + "</div>");
  var b = el("button", "", btn); b.type = "button";
  b.onclick = function(){ c.remove(); busy = false; if(then) then(); };
  c.firstChild.appendChild(b);
  root.querySelector(".lcc-view").appendChild(c);
  busy = true;
  setTimeout(function(){ try{ b.focus(); }catch(e){} }, 30);
}
function next(){ odd = pickOdd(); draw(false); say(floor === 0 ? "Floor 0. This is what normal looks like. Have a good look round." : ""); }
function choose(back){
  if(busy) return;
  var wasOdd = !!odd, right = back === wasOdd, what = wasOdd ? ODD.filter(function(x){ return x.id === odd; })[0] : null;
  busy = true;
  step(back ? 2 : 3);
  if(!right){
    draw(true);
    chime(false);
    setTimeout(function(){
      store.runs++; save();
      var line = wasOdd ? "Something was different: " + what.say : "Nothing had changed. That was a normal corridor.";
      card("<h3>" + (wasOdd && odd === "figure" ? "It noticed you." : "Back to Floor 0") + "</h3><p>" + line + "</p>" +
        (wasOdd ? "<p style=\"font-size:.9rem\">It is lit up in red, if you want another look.</p>" : "") +
        "<p style=\"font-size:.9rem\">Best so far: Floor " + store.best + ".</p>", "Start again", function(){ floor = 0; next(); });
    }, RM ? 0 : 450);
    return;
  }
  if(wasOdd){ store.seen[odd] = 1; save(); }
  var v = root.querySelector(".lcc-view");
  v.classList.add(back ? "back" : "walk");
  setTimeout(function(){
    v.classList.remove("walk", "back");
    floor++;
    if(floor > store.best){ store.best = floor; }
    save();
    chime(true);
    if(floor >= GOAL){
      store.clocked++; save();
      draw(false);
      card("<h3>Clocked off.</h3><p>Floor " + GOAL + ". You found the way out of the night shift.</p><p style=\"font-size:.9rem\">You have clocked off " + store.clocked + " time" + (store.clocked === 1 ? "" : "s") + ". Things you have spotted: " + Object.keys(store.seen).length + " of " + ODD.length + ".</p>", "Go again", function(){ floor = 0; next(); });
      return;
    }
    busy = false;
    odd = pickOdd(); draw(false);
    say(wasOdd ? "Good spot. " + what.say : "Nothing different. Good.");
    setTimeout(function(){ if(root && !busy) say(""); }, 2600);
  }, RM ? 0 : 480);
}
function open(){
  if(root) return;
  root = el("div", "lccorr");
  root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", "Night Corridor");
  root.innerHTML =
    '<div class="lcc-top"><span style="display:flex;align-items:center;gap:14px;flex-wrap:wrap"><h2>Night Corridor</h2><span class="lcc-f"></span></span>' +
      '<span><button type="button" class="lcc-snd"></button> <button type="button" class="lcc-x">Leave</button></span></div>' +
    '<div class="lcc-stage"><div class="lcc-view"><div class="lcc-scene" style="width:100%;height:100%"></div><p class="lcc-msg" aria-live="polite" hidden></p></div></div>' +
    '<div class="lcc-bar"><button type="button" class="lcc-back">&darr; Turn back</button><button type="button" class="lcc-go">&uarr; Keep walking</button></div>';
  document.body.appendChild(root);
  document.documentElement.style.overflow = "hidden";
  root.querySelector(".lcc-x").onclick = close;
  root.querySelector(".lcc-back").onclick = function(){ choose(true); };
  root.querySelector(".lcc-go").onclick = function(){ choose(false); };
  root.querySelector(".lcc-snd").onclick = function(){ store.sound = !store.sound; save(); if(store.sound) humOn(); else humOff(); draw(false); };
  keyH = function(e){
    if(!root) return;
    if(e.key === "Escape"){ close(); return; }
    if(busy) return;
    if(e.key === "ArrowUp" || e.key === "w" || e.key === "W"){ e.preventDefault(); choose(false); }
    if(e.key === "ArrowDown" || e.key === "s" || e.key === "S"){ e.preventDefault(); choose(true); }
  };
  document.addEventListener("keydown", keyH);
  floor = 0; odd = null; busy = false;
  draw(false);
  humOn();
  card("<h3>Night Corridor</h3><p>The building is empty. The corridor keeps looping.</p>" +
    "<p><b>If anything is different, turn back.</b> If nothing has changed, keep walking.</p>" +
    "<p>Get it right " + GOAL + " times in a row to clock off. Floor 0 is always normal, so have a good look at it first.</p>" +
    (store.best ? "<p style=\"font-size:.9rem\">Your best: Floor " + store.best + ".</p>" : ""), "Clock in", function(){ next(); });
}
function close(){
  if(!root) return;
  humOff();
  document.removeEventListener("keydown", keyH);
  root.remove(); root = null;
  document.documentElement.style.overflow = "";
}
window.LCCorridor = { open: open, close: close, scene: scene, ODD: ODD };
})();
