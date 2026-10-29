/* ==========================================================
   JT's Training Ground - Penalty Shootout
   A pop up penalty game. JT's XI (red and white) step up to
   the spot under the floodlights. Keep scoring to build a
   streak; every fifth kick JT can go in goal instead.

   No timers, no nagging. Nothing moves on until JT acts.
   Instant restart, calm messages, sound can be turned off.

   Home page:  <script src="/jt-hq/penalty.js?v=1" data-button="1"></script>
               (adds a "Take a penalty" button and a one line note to .hero)
   Any page:   window.JTPenalty.open() opens the game.
   Saves { best, games, sound } in b5.jthq.penalty.v1 on this device.
   Everything is drawn in code. ASCII only in this file.
   ========================================================== */
(function () {
'use strict';
if (window.JTPenalty) return;

var KEY = 'b5.jthq.penalty.v1';
var GAME = 'Penalty Shootout';
var RED = '#e4002b', GREEN = '#2fbf71', GOLD = '#ffc72c', INK = '#10231a';
var HW = 3.66, GHM = 2.44, BALL = 0.11;   /* half goal width, goal height, ball radius (metres) */
var SPOT = 11;                            /* metres from the goal line */
var SB = 2.2, KP = SB - 1;                /* the ball looks 2.2 times bigger on the spot than on the line */
var TAU = Math.PI * 2;
var DISP = 'Oswald,"Arial Narrow",Arial,system-ui,sans-serif';
var me = document.currentScript;
var WITH_BUTTON = !!(me && me.getAttribute('data-button') && me.getAttribute('data-button') !== '0');
var TEST = /[?&]jttest(=|&|$)/.test(location.search);

/* ---------- storage ---------- */
var store = { best: 0, games: 0, sound: true };
function loadStore() {
  try {
    var o = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (o && typeof o === 'object') {
      if (isFinite(o.best)) store.best = Math.max(0, Math.floor(o.best));
      if (isFinite(o.games)) store.games = Math.max(0, Math.floor(o.games));
      if (typeof o.sound === 'boolean') store.sound = o.sound;
    }
  } catch (e) {}
}
function saveStore() {
  try { localStorage.setItem(KEY, JSON.stringify({ best: store.best, games: store.games, sound: store.sound })); } catch (e) {}
}
loadStore();

/* ---------- small helpers ---------- */
function rnd(a, b) { return a + Math.random() * (b - a); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function lerp(a, b, t) { return a + (b - a) * t; }
function gauss() { return (Math.random() + Math.random() + Math.random() - 1.5) * 2; }   /* about one standard deviation */
function sgn(v) { return v < 0 ? -1 : 1; }
var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
var FINE = !!(window.matchMedia && matchMedia('(pointer: fine)').matches);

/* test overrides (only used through the test hook) */
var T = { keeper: null, striker: null, strikerMiss: null, meter: null, spread: true, speed: 1, power: null };

/* ---------- styles ---------- */
var css = document.createElement('style');
css.textContent =
'html body>.jtpen{position:fixed !important;z-index:2147483000 !important;inset:0 !important}' +
'.jtpen{display:flex;flex-direction:column;align-items:center;margin:0;padding:0 0 8px;overflow:hidden;' +
'color:#f6fbf7;font-family:var(--body,"Atkinson Hyperlegible",Verdana,system-ui,sans-serif);' +
'background:radial-gradient(60% 50% at 0% 0%,rgba(255,255,230,.16),transparent 70%),radial-gradient(60% 50% at 100% 0%,rgba(255,255,230,.16),transparent 70%),radial-gradient(90% 60% at 50% 110%,rgba(47,191,113,.22),transparent 60%),#0a1f13;' +
'background-color:#0a1f13;overscroll-behavior:contain;-webkit-tap-highlight-color:transparent}' +
'.jtpen *{box-sizing:border-box}' +
'.jtpen button{font-family:' + DISP + ';cursor:pointer;-webkit-user-select:none;user-select:none}' +
'.jtpen button:focus-visible{outline:3px solid ' + GOLD + ';outline-offset:3px}' +
'.jtp-bar{width:100%;max-width:900px;display:flex;align-items:center;gap:8px;padding:10px 12px}' +
'.jtp-title{flex:1;min-width:0;display:flex;align-items:center;gap:10px;font-family:' + DISP + ';font-weight:700;font-size:1.25rem;letter-spacing:.03em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
'.jtp-title canvas{width:30px;height:30px;flex:none}' +
'.jtp-title span{overflow:hidden;text-overflow:ellipsis}' +
'.jtp-tb{min-height:46px;padding:8px 13px;border-radius:12px;border:2px solid rgba(255,255,255,.28);background:rgba(255,255,255,.08);color:inherit;font-weight:600;font-size:.98rem;line-height:1.1;letter-spacing:.02em}' +
'.jtp-tb:hover{background:rgba(255,255,255,.16)}' +
'.jtp-tb[aria-pressed="false"]{opacity:.7}' +
'.jtp-x{min-height:50px;padding:8px 18px;border-radius:14px;border:3px solid ' + INK + ';background:#fff;color:' + INK + ';font-weight:700;font-size:1.08rem;box-shadow:0 4px 0 rgba(0,0,0,.4)}' +
'.jtp-x:hover{background:' + GOLD + '}' +
'.jtp-stage{position:relative;flex:none;border-radius:16px;overflow:hidden;box-shadow:0 0 0 3px rgba(255,255,255,.14),0 14px 40px rgba(0,0,0,.5);background:#123a22}' +
'.jtp-stage canvas{display:block;touch-action:none;-webkit-user-select:none;user-select:none;cursor:crosshair}' +
'.jtp-stage:after{content:"";position:absolute;left:0;right:0;top:0;height:80px;pointer-events:none;background:linear-gradient(rgba(4,14,8,.55),transparent)}' +
'.jtp-hud{position:absolute;left:0;right:0;top:0;z-index:2;display:flex;justify-content:space-between;align-items:flex-start;padding:8px 14px;pointer-events:none;font-family:' + DISP + ';color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.5)}' +
'.jtp-score b{display:block;font-size:2.6rem;line-height:1;font-weight:700}' +
'.jtp-score span{display:block;font-size:.8rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#ffe9a8}' +
'.jtp-best{margin-top:4px;padding:5px 12px;border-radius:999px;background:rgba(0,0,0,.42);font-size:.95rem;font-weight:600;letter-spacing:.04em;white-space:nowrap}' +
'.jtp-best b{color:' + GOLD + ';font-size:1.1rem}' +
'.jtp-best.hot{background:' + GOLD + ';color:' + INK + ';text-shadow:none}.jtp-best.hot b{color:' + INK + '}' +
'.jtp-hint{position:absolute;left:50%;top:50%;z-index:2;transform:translateX(-50%);width:max-content;max-width:min(92%,460px);padding:8px 14px;border-radius:12px;background:rgba(6,20,12,.8);border:1px solid rgba(255,255,255,.16);color:#fff;font-size:.92rem;line-height:1.35;text-align:center;pointer-events:none;transition:opacity .4s}' +
'.jtp-hint.gone{opacity:0}' +
'.jtp-toast{position:absolute;left:50%;top:12px;z-index:3;transform:translateX(-50%);display:flex;align-items:center;gap:6px;white-space:nowrap;padding:6px 14px;border-radius:999px;background:' + GOLD + ';color:' + INK + ';font-family:' + DISP + ';font-weight:700;font-size:1.05rem;letter-spacing:.03em;pointer-events:none;opacity:0;transition:opacity .35s;box-shadow:0 3px 0 rgba(0,0,0,.35)}' +
'.jtp-toast svg{width:20px;height:20px;flex:none}' +
'.jtp-toast.on{opacity:1}' +
'.jtp-banner{position:absolute;left:0;right:0;top:30%;z-index:3;text-align:center;pointer-events:none;font-family:' + DISP + ';font-weight:700;font-size:clamp(3.2rem,15vw,5.4rem);line-height:1;letter-spacing:.04em;color:#fff;opacity:0;' +
'text-shadow:0 0 0 #000,4px 4px 0 ' + RED + ',-2px -2px 0 ' + RED + ',2px -2px 0 ' + RED + ',-2px 2px 0 ' + RED + ',0 10px 30px rgba(0,0,0,.45)}' +
'.jtp-banner.k-save{color:' + GOLD + ';text-shadow:4px 4px 0 ' + INK + ',-2px -2px 0 ' + INK + ',2px -2px 0 ' + INK + ',-2px 2px 0 ' + INK + ',0 10px 30px rgba(0,0,0,.45)}' +
'.jtp-banner.on{opacity:1;animation:jtpban .6s cubic-bezier(.2,1.6,.4,1) both}' +
'.jtp-banner small{display:table;margin:10px auto 0;padding:4px 14px;border-radius:999px;background:rgba(6,20,12,.78);font-size:clamp(1rem,4.4vw,1.35rem);letter-spacing:.05em;text-shadow:none;color:#fff}' +
'@keyframes jtpban{0%{transform:scale(.3) rotate(-6deg);opacity:0}60%{opacity:1}100%{transform:scale(1) rotate(-2deg);opacity:1}}' +
'.jtp-card{position:absolute;left:50%;top:50%;z-index:4;transform:translate(-50%,-50%);width:min(88%,340px);padding:18px 18px 14px;border-radius:22px;background:#fff;color:' + INK + ';text-align:center;border:4px solid ' + INK + ';box-shadow:0 8px 0 rgba(0,0,0,.35),0 20px 50px rgba(0,0,0,.4)}' +
'.jtp-card[hidden]{display:none}' +
'.jtp-card canvas{width:52px;height:52px;display:block;margin:0 auto 4px}' +
'.jtp-card h2{margin:0;font-family:' + DISP + ';font-weight:700;font-size:2.1rem;line-height:1.05;letter-spacing:.02em;text-transform:uppercase}' +
'.jtp-card p{margin:6px 0 0;font-size:1rem;line-height:1.4}' +
'.jtp-badge{display:inline-flex;align-items:center;gap:6px;margin:0 0 8px;padding:4px 12px;border-radius:999px;background:' + GOLD + ';border:2px solid ' + INK + ';font-family:' + DISP + ';font-weight:700;font-size:1rem;letter-spacing:.03em}' +
'.jtp-badge svg{width:20px;height:20px}' +
'.jtp-pop{animation:jtppop .55s cubic-bezier(.2,1.6,.4,1) both}' +
'@keyframes jtppop{0%{transform:scale(.4) rotate(-8deg)}100%{transform:scale(1) rotate(-3deg)}}' +
'.jtp-nums{display:flex;justify-content:center;gap:12px;margin:12px 0 14px}' +
'.jtp-nums div{min-width:96px;padding:6px 10px;border-radius:14px;background:#f1f7f3;border:2px solid #cfe5d7}' +
'.jtp-nums span{display:block;font-size:.8rem;font-weight:700;color:#3d5b47;text-transform:uppercase;letter-spacing:.08em}' +
'.jtp-nums b{display:block;font-family:' + DISP + ';font-size:1.9rem;line-height:1.1}' +
'.jtp-go{display:block;width:100%;min-height:60px;border-radius:16px;border:3px solid ' + INK + ';background:' + RED + ';color:#fff;font-weight:700;font-size:1.6rem;letter-spacing:.06em;text-transform:uppercase;box-shadow:0 5px 0 ' + INK + '}' +
'.jtp-go:hover{background:#ff1a45}.jtp-go:active{transform:translateY(3px);box-shadow:0 2px 0 ' + INK + '}' +
'.jtp-c2{display:block;width:100%;margin-top:10px;min-height:46px;border-radius:14px;border:2px solid #b7c9bd;background:transparent;color:' + INK + ';font-weight:600;font-size:1.05rem;letter-spacing:.03em}' +
'.jtp-c2:hover{background:#f1f7f3}' +
'.jtp-tip{font-size:.82rem !important;color:#5a7062;margin-top:8px !important}' +
'@media (max-height:560px){.jtp-bar{padding:6px 12px}.jtp-tb,.jtp-x{min-height:40px}}' +
'@media (max-width:460px){.jtp-tb{padding:8px 10px;font-size:.9rem}.jtp-title span{display:none}.jtp-x{padding:8px 13px}}' +
'@media (prefers-reduced-motion:reduce){.jtp-pop,.jtp-banner.on{animation:none}.jtp-pop{transform:rotate(-3deg)}.jtp-hint,.jtp-toast{transition:none}}' +
/* the launcher that sits in the hero */
'.jtpen-launch{display:flex;flex-direction:column;align-items:flex-start;gap:8px;margin:18px 0 0}' +
'.jtpen-open{display:inline-flex;align-items:center;gap:12px;cursor:pointer;font-family:' + DISP + ';font-weight:700;font-size:1.15rem;letter-spacing:.04em;text-transform:uppercase;' +
'padding:10px 20px 10px 12px;border-radius:14px;border:3px solid ' + INK + ';background:linear-gradient(#ff2a52,' + RED + ');color:#fff;box-shadow:0 5px 0 ' + INK + ';transition:transform .12s}' +
'.jtpen-open:hover{transform:translateY(-2px)}.jtpen-open:active{transform:translateY(3px);box-shadow:0 2px 0 ' + INK + '}' +
'.jtpen-open:focus-visible{outline:3px solid ' + GOLD + ';outline-offset:3px}' +
'.jtpen-open canvas{width:32px;height:32px;flex:none}' +
'.jtpen-note{margin:0;font-size:.95rem;opacity:.9}' +
'@media (prefers-reduced-motion:reduce){.jtpen-open{transition:none}}';
(document.head || document.documentElement).appendChild(css);

var TROPHY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v3h3v2a5 5 0 0 1-4.2 4.9A5 5 0 0 1 13 15.8V18h3v3H8v-3h3v-2.2A5 5 0 0 1 8.2 12.9 5 5 0 0 1 4 8V6h3zM4 6v2a3 3 0 0 0 3 3V6zm13 0v5a3 3 0 0 0 3-3V6z" fill="currentColor"/></svg>';

/* ---------- audio (only after a tap or key press) ---------- */
var AC = null, master = null, noiseBuf = null;
function unlockAudio() {
  if (AC) { if (AC.state === 'suspended') { try { AC.resume(); } catch (e) {} } return; }
  var C = window.AudioContext || window.webkitAudioContext;
  if (!C) return;
  try {
    AC = new C();
    master = AC.createGain(); master.gain.value = 0.22; master.connect(AC.destination);
    noiseBuf = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  } catch (e) { AC = null; }
}
function canPlay() { return AC && store.sound && AC.state === 'running'; }
function tone(f0, f1, dur, type, vol, delay) {
  if (!canPlay()) return;
  try {
    var t = AC.currentTime + (delay || 0);
    var o = AC.createOscillator(), g = AC.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f0, t);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.03);
  } catch (e) {}
}
function hiss(dur, f0, f1, vol, attack, delay, kind, q) {
  if (!canPlay() || !noiseBuf) return;
  try {
    var t = AC.currentTime + (delay || 0);
    var s = AC.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    var f = AC.createBiquadFilter(); f.type = kind || 'lowpass';
    if (q) f.Q.value = q;
    f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    var g = AC.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + (attack || 0.01));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t, Math.random()); s.stop(t + dur + 0.05);
  } catch (e) {}
}
function whistle(delay) {
  if (!canPlay()) return;
  try {
    var t = AC.currentTime + (delay || 0), dur = 0.34;
    var o = AC.createOscillator(), l = AC.createOscillator(), lg = AC.createGain(), g = AC.createGain();
    o.type = 'sine'; o.frequency.value = 2250;
    l.type = 'sine'; l.frequency.value = 34; lg.gain.value = 110;
    l.connect(lg); lg.connect(o.frequency);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.045, t + 0.02);
    g.gain.setValueAtTime(0.045, t + dur - 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); l.start(t); o.stop(t + dur + 0.03); l.stop(t + dur + 0.03);
  } catch (e) {}
}
function sfx(n) {
  if (n === 'kick') { tone(150, 46, 0.22, 'sine', 0.45); hiss(0.05, 3200, 700, 0.14); }
  else if (n === 'swish') { hiss(0.55, 7000, 1400, 0.16, 0.03, 0, 'highpass'); hiss(0.4, 1800, 500, 0.08, 0.02); }
  else if (n === 'cheer') { hiss(2.4, 1500, 800, 0.24, 0.35, 0.05, 'bandpass', 0.7); hiss(2.0, 3200, 1600, 0.07, 0.3, 0.08, 'bandpass', 0.9); }
  else if (n === 'groan') { hiss(1.1, 650, 260, 0.16, 0.18, 0.05, 'bandpass', 1.2); tone(240, 160, 0.9, 'sawtooth', 0.014, 0.05); }
  else if (n === 'glove') { tone(230, 90, 0.13, 'sine', 0.32); hiss(0.08, 1600, 300, 0.18); }
  else if (n === 'clang') { tone(1180, 1150, 0.6, 'sine', 0.07); tone(1770, 1720, 0.45, 'sine', 0.045); tone(620, 600, 0.3, 'triangle', 0.06); }
  else if (n === 'aim') tone(520, 0, 0.06, 'triangle', 0.05);
  else if (n === 'whistle') whistle();
  else if (n === 'best') { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0, 0.18, 'square', 0.035, i * 0.09); }); }
}

/* ---------- layout and perspective ----------
   t is depth along the kick: 0 on the penalty spot, 1 on the goal line.
   Things look SB times bigger on the spot than on the line. */
var L = null;
function persp(t) { return SB / (1 + KP * t); }
function groundY(t) { return L.hY + (L.by - L.hY) * persp(t) / SB; }
function tOfZ(z) { return 1 - z / SPOT; }          /* z: metres in front of the goal line */
function wX(x, t) { return L.cx + x * L.ppm * persp(t); }
function wY(h, t) { return groundY(t) - h * L.ppm * persp(t); }
function gX(x) { return L.cx + x * L.ppm; }
function gY(h) { return L.gB - h * L.ppm; }
function toGoal(px, py) { return { x: (px - L.cx) / L.ppm, y: (L.gB - py) / L.ppm }; }

/* ---------- game state ---------- */
var state = 'closed';            /* closed, play, over */
var G = null, ui = {}, ctx = null, raf = 0, lastTs = 0, overAt = 0, hiddenPause = false;
var bgCv = null, crowdCv = null;
var keeperOn = true;
var prevOverflow = '', opener = null;

var KIT_HOME = { shirt: RED, shirt2: '#b8001f', sleeve: '#ffffff', shorts: '#ffffff', shorts2: '#dfe5ea', sock: RED, sock2: '#ffffff', print: '#ffffff', boot: '#16181d' };
var KIT_AWAY = { shirt: '#20306e', shirt2: '#152150', sleeve: '#8fd3ff', shorts: '#20306e', shorts2: '#152150', sock: '#8fd3ff', sock2: '#20306e', print: '#8fd3ff', boot: '#f1f1f1' };
var GK_THEM = { shirt: '#7a52d6', shirt2: '#5b3aae', trim: '#d9ccff', shorts: '#2a1f4d', sock: '#7a52d6', glove: '#c8ff4d', num: '#ffffff' };
var GK_JT = { shirt: GOLD, shirt2: '#e0a800', trim: INK, shorts: INK, sock: GOLD, glove: GREEN, num: INK };

function newGame() {
  G = {
    streak: 0, turn: 0, startBest: store.best, toastDone: store.best === 0, newBest: false,
    t: 0, phase: 'aim', pt: 0, mode: 'shoot',
    aim: null, meter: { on: false, v: 0, d: 1 }, drag: null, ring: 0,
    shot: null, bp: null, layer: 'front', fade: 1, spin: 0,
    kp: keeperRest(), st: { kick: 0, run: 1, phase: 0 }, choice: null,
    conf: [], parts: [], shake: 0, cheer: 0, bulge: null, outcome: null, shots: 0, msg: ''
  };
  startTurn();
}

function keeperRest() { return { hx: 0, hy: 0.95, ang: 0, arms: 0, jx: 0, from: null, to: null, t: 0, delay: 0, dur: 0.5, holding: false }; }

function startTurn() {
  G.turn++;
  G.mode = (keeperOn && G.turn % 5 === 0) ? 'save' : 'shoot';
  G.phase = G.mode === 'shoot' ? 'aim' : 'runup';
  G.pt = 0; G.aim = null; G.meter.on = false; G.meter.v = 0; G.meter.d = 1; G.drag = null; G.ring = 0;
  G.shot = null; G.bp = null; G.layer = 'front'; G.fade = 1; G.outcome = null; G.bulge = null; G.choice = null;
  G.kp = keeperRest();
  G.st = { kick: 0, run: G.mode === 'save' ? 0 : 1, phase: 0 };
  if (ui.banner) ui.banner.className = 'jtp-banner';
  if (G.mode === 'save') { toast('Your turn in goal'); sfx('whistle'); }
  else if (G.turn === 1) sfx('whistle');
  syncHint();
}

/* ---------- shooting ---------- */
function makeShot(tx, ty, power, who) {
  var p = power, sx = 0, sy = 0, lift = 0;
  if (who === 'jt' && T.spread) {
    sx = 0.2 + 0.5 * Math.max(0, p - 0.8);
    sy = 0.13 + 0.35 * Math.max(0, p - 0.8);
  }
  if (who === 'jt') lift = Math.max(0, p - 0.92) * 3.0;
  var x = tx + gauss() * sx, y = Math.max(BALL, ty + gauss() * sy + lift);
  var ft = p >= 1 ? 0.42 : lerp(1.0, 0.45, clamp(p, 0, 1));
  return {
    tx: x, ty: y, power: p, ft: ft / (T.speed || 1), t: 0, who: who,
    lift: 0.12 + (1 - clamp(p, 0, 1)) * 0.8,
    curve: Math.abs(x) > 0.8 ? -sgn(x) * rnd(0.15, 0.4) : rnd(-0.15, 0.15),
    spin: (Math.abs(x) > 0.3 ? sgn(x) : 1) * (9 + 12 * clamp(p, 0, 1.2))
  };
}
function shotPos(s, t) {
  var wx = s.tx * t + s.curve * Math.sin(Math.PI * clamp(t, 0, 1));
  var h = BALL + (s.ty - BALL) * t + s.lift * 4 * t * (1 - t);
  if (h < BALL) h = BALL;
  var p = persp(t);
  return { x: L.cx + wx * L.ppm * p, y: groundY(t) - h * L.ppm * p, r: BALL * L.ppm * p, gy: groundY(t), h: h, p: p };
}

function strike(tx, ty, power) {
  if (!G || state !== 'play' || G.mode !== 'shoot' || G.phase !== 'aim') return false;
  if (T.power != null) power = T.power;
  G.shot = makeShot(tx, ty, power, 'jt');
  G.aim = { x: tx, y: ty };
  G.meter.on = false; G.drag = null; G.ring = 0;
  G.phase = 'windup'; G.pt = 0;
  G.shots++;
  syncHint();
  return true;
}

/* the keeper decides where to go when the ball is struck */
function keeperThink(s) {
  if (T.keeper === 'still') return;
  var d = clamp(G.streak / 14, 0, 1);
  var readP = 0.16 + 0.34 * d + clamp((s.ft * (T.speed || 1) - 0.62) * 1.6, 0, 0.6);
  if (T.keeper === 'read') readP = 1;
  var tx, ty;
  if (Math.random() < readP) {
    var n = T.keeper === 'read' ? 0 : 1;
    tx = s.tx + gauss() * (0.45 - 0.2 * d) * n;
    ty = s.ty + gauss() * 0.3 * n;
  } else {
    var r = Math.random();
    if (r < 0.2) { tx = rnd(-0.5, 0.5); ty = rnd(0.4, 1.6); }
    else { tx = (r < 0.6 ? -1 : 1) * rnd(1.4, 3.0); ty = rnd(0.2, 1.9); }
  }
  planDive(G.kp, tx, ty, lerp(0.15, 0.08, d), 0.6);
}
function diveFor(tx, ty) {
  if (Math.abs(tx) < 0.9) {
    var hy = ty > 1.7 ? clamp(0.95 + (ty - 1.7) * 0.8, 0.95, 1.35) : ty < 0.5 ? 0.82 : 0.95;
    var hx = tx * 0.55;
    return { hx: hx, hy: hy, ang: clamp((tx - hx) * 0.7, -0.5, 0.5) };
  }
  var hx2 = clamp(tx * 0.62, -2.05, 2.05);
  var hy2 = clamp(0.35 + ty * 0.35, 0.45, 1.25);
  return { hx: hx2, hy: hy2, ang: Math.atan2(tx - hx2, Math.max(ty - hy2, -0.25)) };
}
function planDive(kp, tx, ty, delay, dur) {
  kp.from = { hx: kp.hx + kp.jx, hy: kp.hy, ang: kp.ang };
  kp.jx = 0;
  kp.to = diveFor(tx, ty); kp.t = 0; kp.delay = delay; kp.dur = dur / (T.speed || 1);
}
function updateKeeper(kp, dt) {
  if (!kp.to) {
    var waiting = G.phase === 'aim' || G.phase === 'runup' || G.phase === 'windup';
    kp.jx = (RM || !waiting) ? kp.jx * 0.9 : Math.sin(G.t * 2.3) * 0.16;
    return;
  }
  kp.t += dt;
  var p = clamp((kp.t - kp.delay) / kp.dur, 0, 1);
  var e = 1 - (1 - p) * (1 - p);
  var f = kp.from, o = kp.to;
  kp.hx = lerp(f.hx, o.hx, e);
  kp.hy = lerp(f.hy, o.hy, e) + (Math.abs(o.ang) > 0.8 ? Math.sin(Math.PI * e) * 0.22 : 0);
  kp.ang = lerp(f.ang, o.ang, e);
  kp.arms = e;
}
function keeperAxis(kp) { return { x: Math.sin(kp.ang), y: Math.cos(kp.ang) }; }
function handsAt(kp) {
  var a = keeperAxis(kp), r = 0.6 + 0.75 * kp.arms;
  return { x: kp.hx + kp.jx + a.x * r, y: kp.hy + a.y * r };
}
function segDist(px, py, ax, ay, bx, by) {
  var vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy;
  var k = l2 ? clamp(((px - ax) * vx + (py - ay) * vy) / l2, 0, 1) : 0;
  var dx = px - (ax + vx * k), dy = py - (ay + vy * k);
  return Math.sqrt(dx * dx + dy * dy);
}
function keeperHits(kp, x, y) {
  var a = keeperAxis(kp), hx = kp.hx + kp.jx, hy = kp.hy;
  var h = handsAt(kp);
  if (segDist(x, y, hx - a.x * 0.95, hy - a.y * 0.95, h.x, h.y) < 0.3) return true;
  if (kp.arms < 0.5) {
    var sx = hx + a.x * 0.45, sy = hy + a.y * 0.45;
    if (segDist(x, y, sx - a.y * 0.55, sy + a.x * 0.55, sx + a.y * 0.55, sy - a.x * 0.55) < 0.2) return true;
  }
  return false;
}

/* ---------- the visitors shoot (keeper turn) ---------- */
function sideOf(x) { return x < -0.9 ? 'left' : x > 0.9 ? 'right' : 'middle'; }
function cpuShot() {
  var r = Math.random();
  var side = T.striker || (r < 0.4 ? 'left' : r < 0.6 ? 'middle' : 'right');
  var miss = T.strikerMiss != null ? T.strikerMiss : Math.random() < 0.08;
  var tx = side === 'left' ? -rnd(1.5, 3.1) : side === 'right' ? rnd(1.5, 3.1) : rnd(-0.6, 0.6);
  var ty = rnd(0.25, 1.9);
  if (miss) {
    if (side !== 'middle' && Math.random() < 0.6) tx = sgn(tx) * rnd(3.95, 4.6);
    else ty = rnd(2.75, 3.2);
  }
  return makeShot(tx, ty, rnd(0.7, 0.9), 'cpu');
}
function choose(side) {
  if (!G || state !== 'play' || G.mode !== 'save' || G.choice) return;
  if (G.phase !== 'runup') return;
  G.choice = side;
  sfx('aim');
  syncHint();
}
function cpuLaunch() {
  var s = cpuShot();
  G.shot = s;
  var real = sideOf(s.tx);
  if (G.choice === real || (G.choice === 'middle' && Math.abs(s.tx) < 1.2)) {
    planDive(G.kp, s.tx + gauss() * 0.15, s.ty + gauss() * 0.1, 0.05, 0.42);
  } else {
    var c = G.choice || 'middle';
    planDive(G.kp, c === 'left' ? -2.4 : c === 'right' ? 2.4 : 0, c === 'middle' ? 1.1 : 0.9, 0.05, 0.42);
  }
}

/* ---------- update ---------- */
function update(dt) {
  G.t += dt; G.pt += dt;
  var i, p, s = G.shot;
  /* power meter: a gentle ping pong, it waits as long as JT likes */
  if (G.meter.on) {
    if (T.meter != null) G.meter.v = T.meter;
    else {
      G.meter.v += G.meter.d * dt * 0.85;
      if (G.meter.v > 1.2) { G.meter.v = 1.2; G.meter.d = -1; }
      if (G.meter.v < 0) { G.meter.v = 0; G.meter.d = 1; }
    }
  }
  /* striker */
  if (G.phase === 'runup') {
    G.st.run = Math.min(1, G.st.run + dt / 1.5 * (T.speed || 1));
    G.st.phase += dt * 11;
    if (G.st.run >= 1 && G.choice) { G.phase = 'windup'; G.pt = 0; }
  }
  if (G.phase === 'windup') {
    G.st.kick = Math.min(1, G.pt / 0.18 * (T.speed || 1));
    if (G.st.kick >= 1) {
      if (G.mode === 'save') cpuLaunch();
      else keeperThink(G.shot);
      G.phase = 'flight'; G.pt = 0;
      sfx('kick');
      s = G.shot;
      if (!RM) for (i = 0; i < 6; i++) addPart(L.cx + rnd(-6, 6) * L.u, L.by + rnd(-2, 2) * L.u, rnd(-60, 60) * L.u, rnd(-90, -30) * L.u, 300 * L.u, rnd(0.3, 0.5), pick(['#8fe0a8', '#5cc884', '#c9f2d4']), rnd(1.5, 3) * L.u);
    }
  } else if (G.st.kick > 0 && G.phase !== 'flight') {
    G.st.kick = Math.max(0, G.st.kick - dt * 2);
  }
  updateKeeper(G.kp, dt);
  if (G.phase === 'flight' && s) {
    s.t = Math.min(1, s.t + dt / s.ft);
    G.spin += s.spin * dt;
    if (s.t >= 1) resolve();
  } else if (G.phase === 'result') {
    updateResult(dt);
  }
  /* bulge, crowd, effects */
  if (G.bulge) { G.bulge.t += dt; if (G.bulge.t > 1.6) G.bulge = null; }
  if (G.cheer > 0) {
    G.cheer = Math.max(0, G.cheer - dt);
    if (!RM && Math.random() < dt * 22) addPart(rnd(0, L.W), rnd(L.yR + 6 * L.u, L.boardsTop - 4 * L.u), 0, 0, 0, 0.09, '#ffffff', rnd(1.5, 2.6) * L.u, 'flash');
  }
  if (G.shake > 0) G.shake = Math.max(0, G.shake - dt * 18);
  for (i = G.parts.length - 1; i >= 0; i--) {
    p = G.parts[i]; p.life -= dt;
    if (p.life <= 0) { G.parts.splice(i, 1); continue; }
    p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
  }
  for (i = G.conf.length - 1; i >= 0; i--) {
    p = G.conf[i]; p.life -= dt;
    if (p.life <= 0 || p.y > L.H + 20) { G.conf.splice(i, 1); continue; }
    p.vy = Math.min(p.vy + 140 * L.u * dt, 120 * L.u);
    p.vx *= (1 - dt * 1.2);
    p.x += (p.vx + Math.sin(G.t * 3 + p.ph) * 26 * L.u) * dt; p.y += p.vy * dt;
    p.rot += p.vr * dt;
  }
}

function resolve() {
  var s = G.shot, kp = G.kp, x = s.tx, y = s.ty, ax = Math.abs(x), out;
  var hit = keeperHits(kp, x, y);
  var postHit = ax >= HW - BALL && ax <= HW + 0.12 + BALL && y < GHM + 0.12;
  var barHit = !postHit && ax < HW + 0.12 && y >= GHM - BALL && y <= GHM + 0.12 + BALL;
  if (hit && ax < HW + 0.4 && y < GHM + 0.4) out = 'save';
  else if (ax < HW - BALL && y < GHM - BALL) out = 'goal';
  else if (postHit) out = 'post';
  else if (barHit) out = 'bar';
  else out = (ax - HW > y - GHM) ? 'wide' : 'over';
  G.outcome = out; G.phase = 'result'; G.pt = 0;
  var bp = shotPos(s, 1), u = L.u;
  G.bp = { x: bp.x, y: bp.y, r: bp.r, vx: 0, vy: 0, floor: 0, mode: 'fly', t: 1 };
  if (out === 'goal') {
    G.layer = 'back';
    G.bp.mode = 'net';
    G.bulge = { x: x, h: y, t: 0 };
    sfx('swish');
  } else if (out === 'save') {
    var h = handsAt(kp), close = Math.hypot(h.x - x, h.y - y) < 0.45;
    sfx('glove');
    if (close && (s.power < 0.8 || Math.random() < 0.4)) { G.bp.mode = 'held'; kp.holding = true; }
    else {
      G.bp.mode = 'phys';
      G.bp.vx = sgn(x || rnd(-1, 1)) * rnd(110, 200) * u; G.bp.vy = -rnd(150, 260) * u;
      G.bp.floor = L.gB + 46 * u;
    }
  } else if (out === 'post' || out === 'bar') {
    sfx('clang');
    G.shake = RM ? 0 : 5;
    G.bp.mode = 'phys';
    if (out === 'post') { G.bp.vx = sgn(x) * rnd(70, 150) * u; G.bp.vy = -rnd(60, 160) * u; }
    else { G.bp.vx = rnd(-60, 60) * u; G.bp.vy = -rnd(220, 300) * u; }
    G.bp.floor = L.gB + 36 * u;
  } else {
    G.bp.mode = 'away'; G.layer = 'back';
  }
  /* what it means */
  if (G.mode === 'shoot') {
    if (out === 'goal') {
      G.streak++;
      celebrate('GOAL!', 'goal', pick(['Top bins!', 'Back of the net!', 'Get in!', 'Lovely finish!', 'Cool as you like.']));
      bumpBest();
    } else {
      sfx('groan');
    }
  } else {
    if (out === 'save') { G.streak++; celebrate('SAVED!', 'save', '+1 for the save'); bumpBest(); }
    else if (out !== 'goal') { G.streak++; celebrate('MISSED!', 'save', 'They missed. +1 for you'); bumpBest(); }
    else {
      var right = G.choice === sideOf(x);
      G.msg = right ? 'Right way, just out of reach. Your streak is safe.' : 'They scored. No harm done, your streak is safe.';
      toast(right ? 'So close!' : 'Your streak is safe');
      sfx('swish');
    }
  }
  updateHud();
}

function celebrate(text, kind, sub) {
  G.cheer = 2.2;
  sfx('cheer');
  G.shake = RM ? 0 : (kind === 'goal' ? 4 : 2);
  showBanner(text, kind, sub);
  var n = RM ? 18 : 120, i, u = L.u;
  var cols = kind === 'goal' ? [RED, '#ffffff', RED, '#ffffff', GOLD] : [GOLD, '#ffffff', RED, '#ffffff'];
  for (i = 0; i < n; i++) {
    G.conf.push({ x: rnd(0, L.W), y: rnd(-L.H * 0.25, -6), vx: rnd(-30, 30) * u, vy: rnd(30, 110) * u,
      rot: rnd(0, TAU), vr: rnd(-8, 8), w: rnd(5, 8) * u, h: rnd(3, 4.5) * u, c: pick(cols), life: rnd(2.4, 3.6), ph: rnd(0, TAU) });
  }
  if (!RM) for (i = 0; i < 50; i++) {
    var gx = G.bp ? G.bp.x : L.cx, gy = G.bp ? G.bp.y : L.gB;
    G.conf.push({ x: gx + rnd(-20, 20) * u, y: gy, vx: rnd(-260, 260) * u, vy: rnd(-320, -120) * u,
      rot: rnd(0, TAU), vr: rnd(-10, 10), w: rnd(5, 8) * u, h: rnd(3, 4.5) * u, c: pick(cols), life: rnd(1.8, 2.8), ph: rnd(0, TAU) });
  }
}
function bumpBest() {
  if (G.streak > store.best) {
    store.best = G.streak; G.newBest = true; saveStore();
    if (!G.toastDone) { G.toastDone = true; toast('New best!', true); sfx('best'); }
  }
}

function updateResult(dt) {
  var b = G.bp, u = L.u, s = G.shot, out = G.outcome;
  if (b) {
    if (b.mode === 'net') {
      b.t = Math.min(1.12, b.t + dt / s.ft * 0.6);
      var q = shotPos(s, b.t); b.x = q.x; b.y = q.y; b.r = q.r;
      if (b.t >= 1.12) { b.mode = 'phys'; b.vx = 0; b.vy = 0; b.floor = groundY(1.13) - b.r; b.inNet = true; }
      G.spin += s.spin * dt * 0.5;
    } else if (b.mode === 'phys') {
      b.vy += 900 * u * dt; b.x += b.vx * dt; b.y += b.vy * dt;
      var fl = b.inNet ? b.floor : b.floor - b.r;
      if (b.y > fl) { b.y = fl; b.vy = -b.vy * 0.42; b.vx *= 0.8; if (Math.abs(b.vy) < 40 * u) b.vy = 0; }
      G.spin += b.vx * dt * 0.05;
    } else if (b.mode === 'held') {
      var h = handsAt(G.kp); b.x = gX(h.x); b.y = gY(h.y); b.r = BALL * L.ppm;
    } else if (b.mode === 'away') {
      b.t += dt / s.ft;
      var w = shotPos(s, b.t); b.x = w.x; b.y = w.y; b.r = w.r;
      G.fade = clamp(1 - (b.t - 1) / 0.45, 0, 1);
      G.spin += s.spin * dt;
    }
  }
  var wait = G.mode === 'save' ? 2.0 : out === 'goal' ? 1.9 : 1.3;
  if (G.pt >= wait / (T.speed || 1)) afterResult();
}
function afterResult() {
  if (G.phase !== 'result') return;
  if (G.mode === 'shoot' && G.outcome !== 'goal') { showOver(); return; }
  startTurn();
}
function skipAhead() {
  if (G && G.phase === 'result' && G.pt > 0.45 && (G.mode === 'save' || G.outcome === 'goal')) afterResult();
}

/* ---------- particles ---------- */
function addPart(x, y, vx, vy, g, life, c, s, kind) {
  if (G.parts.length > 300) return;
  G.parts.push({ x: x, y: y, vx: vx, vy: vy, g: g, life: life, max: life, c: c, s: s || 2, k: kind || '' });
}

/* ---------- drawing ---------- */
function rr(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
  c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
  c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
}
function ellipse(c, x, y, rx, ry) { c.beginPath(); c.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, TAU); }
function pent(c, x, y, r, rot) {
  c.beginPath();
  for (var i = 0; i < 5; i++) { var a = rot + i * TAU / 5 - Math.PI / 2; c[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r); }
  c.closePath(); c.fill();
}
function drawBall(c, x, y, r, a) {
  c.save(); c.translate(x, y);
  var g = c.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
  g.addColorStop(0, '#ffffff'); g.addColorStop(0.7, '#eef2f5'); g.addColorStop(1, '#aab6c0');
  c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fillStyle = g; c.fill();
  if (r > 2.5) {
    c.save(); c.clip();
    c.fillStyle = '#1f2a36';
    pent(c, Math.cos(a * 0.6) * r * 0.16, Math.sin(a * 0.6) * r * 0.12, r * 0.3, a);
    for (var i = 0; i < 5; i++) {
      var aa = a + i * TAU / 5;
      pent(c, Math.cos(aa) * r * 0.86, Math.sin(aa) * r * 0.86, r * 0.27, aa + 0.6);
    }
    c.restore();
  }
  c.beginPath(); c.arc(0, 0, r, 0, TAU);
  c.lineWidth = Math.max(1, r * 0.08); c.strokeStyle = 'rgba(10,20,30,.35)'; c.stroke();
  c.restore();
}

function computeLayout(W, H) {
  var u = Math.min(W / 380, H / 500);
  var by = Math.round(H - 70 * u);
  var D = clamp(H - 70 * u - 260 * u, 230 * u, 300 * u);
  var o = { W: W, H: H, u: u, cx: W / 2, gB: Math.round(by - D), by: by, ppm: 41 * u };
  o.hY = (SB * o.gB - o.by) / (SB - 1);
  L = o;
  var tb = tOfZ(-3);
  o.boardsBot = groundY(tb);
  o.boardsTop = o.boardsBot - 0.9 * o.ppm * persp(tb);
  /* the stand roof sits low enough that the floodlights clear the score */
  o.yR = Math.min(o.boardsTop - 30 * u, Math.max(80 + 30 * u, o.boardsTop - 300 * u));
  return o;
}

/* the still parts of the scene are drawn once per layout */
function buildBackground() {
  var d = ui.dpr, W = L.W, H = L.H, u = L.u;
  bgCv = bgCv || document.createElement('canvas');
  bgCv.width = Math.round(W * d); bgCv.height = Math.round(H * d);
  var c = bgCv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  /* sky */
  var g = c.createLinearGradient(0, 0, 0, L.boardsTop);
  g.addColorStop(0, '#06140d'); g.addColorStop(1, '#0f2a1c');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  /* stand */
  var top = L.yR, bot = L.boardsTop;
  g = c.createLinearGradient(0, top, 0, bot);
  g.addColorStop(0, '#16261f'); g.addColorStop(1, '#22372c');
  c.fillStyle = g; c.fillRect(0, top, W, bot - top);
  var i, y;
  for (i = 1; i < 9; i++) {
    y = lerp(top, bot, i / 9);
    c.fillStyle = 'rgba(255,255,255,.035)'; c.fillRect(0, y, W, Math.max(1, u));
  }
  /* roof edge */
  c.fillStyle = '#2b3b33'; c.fillRect(0, top - 7 * u, W, 7 * u);
  c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(0, top - 1.5 * u, W, 1.5 * u);
  for (i = 0; i < 7; i++) { c.fillStyle = '#26352d'; c.fillRect(W * (i + 0.5) / 7 - 2 * u, top, 4 * u, bot - top); }
  /* boards */
  var bt = L.boardsTop, bb = L.boardsBot, bh = bb - bt, pw = Math.max(90 * u, bh * 4.6);
  var labels = [["JT'S XI", RED, '#ffffff'], ['BASE 5', '#ffffff', RED], ['TRAINING GROUND', GREEN, '#ffffff'], ['SHOOTOUT', GOLD, INK]];
  var x0 = L.cx - pw * 2.5;
  while (x0 > 0) x0 -= pw;
  for (var x = x0, k = 0; x < W; x += pw, k++) {
    var lb = labels[((k % 4) + 4) % 4];
    c.fillStyle = lb[1]; c.fillRect(x + 1, bt, pw - 2, bh);
    c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(x + 1, bb - bh * 0.18, pw - 2, bh * 0.18);
    c.fillStyle = lb[2];
    var fs = Math.round(bh * 0.62);
    c.font = '700 ' + fs + 'px ' + DISP;
    c.textAlign = 'center'; c.textBaseline = 'middle';
    var tw = c.measureText(lb[0]).width;
    if (tw > pw * 0.86) { fs = Math.floor(fs * pw * 0.86 / tw); c.font = '700 ' + fs + 'px ' + DISP; }
    c.fillText(lb[0], x + pw / 2, bt + bh * 0.52);
  }
  c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, bb, W, Math.max(1, 1.5 * u));
  /* pitch, mown stripes in depth */
  c.fillStyle = '#2aa95c'; c.fillRect(0, bb, W, H - bb);
  var zs = [-3, -1.5, 0, 2.75, 5.5, 8.25, 11, 13.75, 16.5, 19.25];
  for (i = 0; i < zs.length - 1; i++) {
    var ya = groundY(tOfZ(zs[i])), yb = groundY(tOfZ(zs[i + 1]));
    if (ya > H) break;
    c.fillStyle = i % 2 ? '#34b868' : '#2aa95c';
    c.fillRect(0, ya, W, Math.min(H, yb) - ya);
  }
  /* soft light pools under the floodlights */
  g = c.createRadialGradient(L.cx, L.gB, 10 * u, L.cx, L.gB, Math.max(W, H) * 0.7);
  g.addColorStop(0, 'rgba(255,255,230,.10)'); g.addColorStop(1, 'rgba(0,0,0,.18)');
  c.fillStyle = g; c.fillRect(0, bb, W, H - bb);
  /* lines */
  c.strokeStyle = 'rgba(255,255,255,.92)'; c.lineCap = 'round'; c.lineJoin = 'round';
  function line(pts) {
    c.beginPath();
    pts.forEach(function (p, j) { var px = wX(p[0], tOfZ(p[1])), py = groundY(tOfZ(p[1])); c[j ? 'lineTo' : 'moveTo'](px, py); });
    c.stroke();
  }
  c.lineWidth = Math.max(1.5, 0.12 * L.ppm);
  line([[-40, 0], [40, 0]]);
  c.lineWidth = Math.max(1.5, 0.12 * L.ppm * persp(0.75));
  line([[-9.16, 0], [-9.16, 5.5], [9.16, 5.5], [9.16, 0]]);
  c.lineWidth = Math.max(2, 0.12 * L.ppm * persp(0.2));
  line([[-20.16, 0], [-20.16, 16.5]]); line([[20.16, 0], [20.16, 16.5]]);
  /* penalty spot */
  c.fillStyle = 'rgba(255,255,255,.95)';
  ellipse(c, L.cx, L.by - 1 * u, 0.12 * L.ppm * SB, 0.045 * L.ppm * SB); c.fill();
  /* goal mouth wear */
  c.fillStyle = 'rgba(210,190,120,.10)';
  ellipse(c, L.cx, groundY(tOfZ(0.8)), 1.8 * L.ppm, 0.4 * L.ppm); c.fill();

  buildCrowd();
}

function buildCrowd() {
  var d = ui.dpr, W = L.W, u = L.u;
  crowdCv = crowdCv || document.createElement('canvas');
  var top = L.yR + 4 * u, bot = L.boardsTop - 2 * u;
  crowdCv.width = Math.round(W * d); crowdCv.height = Math.round((bot + 6 * u) * d);
  var c = crowdCv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  c.clearRect(0, 0, W, bot + 6 * u);
  var home = [RED, RED, RED, '#ffffff', '#ffffff', '#ffffff', '#b8001f', '#1d2a33', GOLD, '#d4dde4'];
  var away = ['#20306e', '#8fd3ff', '#20306e', '#8fd3ff', '#ffffff', '#1d2a33'];
  var y = top, row = 0, skin = ['#f1c7a5', '#d9a07a', '#a86f4c', '#6e4630', '#f6d6bd'];
  while (y < bot) {
    var f = (y - top) / Math.max(1, bot - top);
    var r = (1.7 + 1.6 * f) * u, sp = r * 2.7;
    var off = (row % 2) * sp / 2;
    for (var x = -sp + off; x < W + sp; x += sp) {
      var awayBlock = x > W * 0.8;
      var col = awayBlock ? pick(away) : pick(home);
      var jx = rnd(-0.4, 0.4) * r, jy = rnd(-0.5, 0.5) * r;
      if (Math.random() < 0.06) continue;
      c.fillStyle = col;
      ellipse(c, x + jx, y + jy + r * 0.5, r * 1.05, r * 0.8); c.fill();
      c.fillStyle = pick(skin);
      c.beginPath(); c.arc(x + jx, y + jy - r * 0.45, r * 0.55, 0, TAU); c.fill();
    }
    y += sp * 0.78; row++;
  }
  /* rail at the front of the stand */
  c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(0, bot - 1 * u, W, Math.max(1, u));
}

function drawCrowd(c) {
  if (!crowdCv) return;
  var d = ui.dpr, w = crowdCv.width, h = crowdCv.height;
  if (G.cheer <= 0 || RM) { c.drawImage(crowdCv, 0, 0, w, h, 0, 0, w / d, h / d); return; }
  var strips = 16, sw = w / strips, amp = 4 * L.u * Math.min(1, G.cheer);
  for (var i = 0; i < strips; i++) {
    var off = -Math.abs(Math.sin(G.t * 11 + i * 1.3)) * amp;
    c.drawImage(crowdCv, i * sw, 0, sw + 1, h, i * sw / d, off, (sw + 1) / d, h / d);
  }
}

function drawLights(c) {
  var W = L.W, u = L.u, ly = Math.max(14 * u, L.yR - 22 * u);
  [W * 0.07, W * 0.93].forEach(function (lx) {
    c.fillStyle = '#33433b';
    c.fillRect(lx - 2.5 * u, ly, 5 * u, L.boardsTop - ly);
    var g = c.createRadialGradient(lx, ly, 2 * u, lx, ly, 170 * u);
    g.addColorStop(0, 'rgba(255,255,235,.5)'); g.addColorStop(0.25, 'rgba(255,255,220,.16)'); g.addColorStop(1, 'rgba(255,255,220,0)');
    c.fillStyle = g; c.fillRect(lx - 170 * u, ly - 170 * u, 340 * u, 340 * u);
    c.fillStyle = '#3c4d44'; rr(c, lx - 17 * u, ly - 10 * u, 34 * u, 20 * u, 3 * u); c.fill();
    c.fillStyle = '#fffbe0';
    for (var j = 0; j < 2; j++) for (var i = 0; i < 4; i++) {
      c.beginPath(); c.arc(lx - 11.5 * u + i * 7.7 * u, ly - 4.5 * u + j * 9 * u, 2.9 * u, 0, TAU); c.fill();
    }
  });
}

/* net: a mesh behind the frame that bulges when the ball goes in */
function netProfile(s) {
  if (s < 0.3) { var k = s / 0.3; return { z: lerp(0, -1.0, k), h: lerp(GHM, 2.25, k) }; }
  var k2 = (s - 0.3) / 0.7; return { z: lerp(-1.0, -1.9, k2), h: lerp(2.25, 0, k2) };
}
function netPt(x, z, h) {
  var b = G.bulge;
  if (b) {
    var amp = RM ? Math.exp(-b.t * 3) : Math.exp(-b.t * 2.6) * (0.75 + 0.25 * Math.cos(b.t * 16));
    var dx = x - b.x, dh = h - b.h, w = Math.exp(-(dx * dx + dh * dh) / 0.9) * amp;
    z -= w * 1.7; x += dx * w * 0.3; h += dh * w * 0.3;
  }
  var t = tOfZ(z);
  return [wX(x, t), wY(h, t)];
}
function drawNet(c) {
  var i, j, p, n, s, x;
  c.lineWidth = Math.max(0.7, 0.9 * L.u);
  /* shade inside the goal */
  c.fillStyle = 'rgba(8,28,16,.28)';
  c.beginPath();
  p = netPt(-HW, 0, 0); c.moveTo(p[0], p[1]);
  p = netPt(-HW, 0, GHM); c.lineTo(p[0], p[1]);
  p = netPt(HW, 0, GHM); c.lineTo(p[0], p[1]);
  p = netPt(HW, 0, 0); c.lineTo(p[0], p[1]);
  c.closePath(); c.fill();
  /* the pocket where the ball hit */
  if (G.bulge) {
    var b = G.bulge, amp = Math.exp(-b.t * 2.2), bp = netPt(b.x, -0.6, b.h);
    var gr = c.createRadialGradient(bp[0], bp[1], 0, bp[0], bp[1], 1.1 * L.ppm);
    gr.addColorStop(0, 'rgba(0,10,4,' + (0.45 * amp).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(0,10,4,0)');
    c.fillStyle = gr; c.fillRect(bp[0] - 1.2 * L.ppm, bp[1] - 1.2 * L.ppm, 2.4 * L.ppm, 2.4 * L.ppm);
  }
  c.strokeStyle = 'rgba(255,255,255,.5)';
  /* back and roof: lines across */
  for (j = 0; j <= 16; j++) {
    s = j / 16; n = netProfile(s);
    c.beginPath();
    for (i = 0; i <= 24; i++) { x = -HW + 2 * HW * i / 24; p = netPt(x, n.z, n.h); c[i ? 'lineTo' : 'moveTo'](p[0], p[1]); }
    c.stroke();
  }
  /* back and roof: lines down */
  for (i = 0; i <= 20; i++) {
    x = -HW + 2 * HW * i / 20;
    c.beginPath();
    for (j = 0; j <= 24; j++) { n = netProfile(j / 24); p = netPt(x, n.z, n.h); c[j ? 'lineTo' : 'moveTo'](p[0], p[1]); }
    c.stroke();
  }
  /* side nets */
  c.strokeStyle = 'rgba(255,255,255,.38)';
  [-HW, HW].forEach(function (sx) {
    var k, m;
    for (k = 0; k <= 8; k++) {
      n = netProfile(k / 8);
      c.beginPath(); p = netPt(sx, 0, n.h); c.moveTo(p[0], p[1]); p = netPt(sx, n.z, n.h); c.lineTo(p[0], p[1]); c.stroke();
    }
    for (m = 1; m <= 5; m++) {
      var zz = -1.9 * m / 6;
      c.beginPath();
      for (k = 0; k <= 12; k++) {
        var hh = GHM * k / 12;
        var top = netProfile(1 - hh / 2.25 * 0.7);
        var zc = Math.max(zz, top.z);
        p = netPt(sx, zc, hh); c[k ? 'lineTo' : 'moveTo'](p[0], p[1]);
      }
      c.stroke();
    }
  });
  /* the back stanchions */
  c.strokeStyle = 'rgba(230,236,240,.75)'; c.lineWidth = Math.max(1, 1.6 * L.u);
  [-HW - 0.06, HW + 0.06].forEach(function (sx) {
    c.beginPath();
    for (j = 0; j <= 12; j++) { n = netProfile(j / 12); var t = tOfZ(n.z); var q = [wX(sx, t), wY(n.h, t)]; c[j ? 'lineTo' : 'moveTo'](q[0], q[1]); }
    c.stroke();
  });
}
function drawFrame(c) {
  var pw = 0.12 * L.ppm, u = L.u;
  c.fillStyle = 'rgba(0,0,0,.25)';
  ellipse(c, gX(-HW - 0.06), L.gB + 1.5 * u, pw * 1.4, pw * 0.4); c.fill();
  ellipse(c, gX(HW + 0.06), L.gB + 1.5 * u, pw * 1.4, pw * 0.4); c.fill();
  c.fillStyle = '#ffffff';
  c.fillRect(gX(-HW - 0.12), gY(GHM + 0.12), pw, GHM * L.ppm + 0.12 * L.ppm);
  c.fillRect(gX(HW), gY(GHM + 0.12), pw, GHM * L.ppm + 0.12 * L.ppm);
  c.fillRect(gX(-HW - 0.12), gY(GHM + 0.12), (2 * HW + 0.24) * L.ppm, pw);
  c.fillStyle = 'rgba(120,140,150,.45)';
  c.fillRect(gX(-HW - 0.12) + pw * 0.62, gY(GHM), pw * 0.38, GHM * L.ppm);
  c.fillRect(gX(HW) + pw * 0.62, gY(GHM), pw * 0.38, GHM * L.ppm);
  c.fillRect(gX(-HW), gY(GHM) - pw * 0.34, 2 * HW * L.ppm, pw * 0.34);
}

/* the keeper, seen from the front, in metres around the hip */
function drawKeeper(c, kp, kit) {
  var m = L.ppm, a = kp.arms;
  c.save();
  c.fillStyle = 'rgba(0,0,0,.22)';
  ellipse(c, gX(kp.hx + kp.jx), L.gB + 0.5 * L.u, 0.55 * m * (1 - 0.4 * Math.min(1, Math.abs(kp.ang))), 0.09 * m); c.fill();
  c.translate(gX(kp.hx + kp.jx), gY(kp.hy)); c.rotate(kp.ang); c.scale(m, m);
  c.lineCap = 'round'; c.lineJoin = 'round';
  var spread = 0.18 * (1 - a) + 0.04, bend = Math.sin(G.t * 4.6) * (RM || kp.to ? 0 : 0.02);
  /* legs */
  c.strokeStyle = kit.sock; c.lineWidth = 0.15;
  c.beginPath(); c.moveTo(-0.1, 0.1); c.lineTo(-0.1 - spread, 0.86 + bend); c.stroke();
  c.beginPath(); c.moveTo(0.1, 0.1); c.lineTo(0.1 + spread * (1 + a * 0.6), 0.86 - bend); c.stroke();
  c.fillStyle = '#16181d';
  ellipse(c, -0.1 - spread, 0.9 + bend, 0.1, 0.06); c.fill();
  ellipse(c, 0.1 + spread * (1 + a * 0.6), 0.9 - bend, 0.1, 0.06); c.fill();
  /* shorts */
  c.fillStyle = kit.shorts; rr(c, -0.22, -0.06, 0.44, 0.28, 0.06); c.fill();
  /* arms */
  var hx = lerp(0.52, 0.12, a), hy = lerp(-0.22, -1.22, a), ex = lerp(0.45, 0.17, a), ey = lerp(-0.5, -0.88, a);
  c.strokeStyle = kit.shirt2; c.lineWidth = 0.12;
  c.beginPath(); c.moveTo(-0.18, -0.54); c.lineTo(-ex, ey); c.lineTo(-hx, hy); c.stroke();
  c.beginPath(); c.moveTo(0.18, -0.54); c.lineTo(ex, ey); c.lineTo(hx, hy); c.stroke();
  /* body */
  c.fillStyle = kit.shirt; rr(c, -0.23, -0.64, 0.46, 0.64, 0.1); c.fill();
  c.fillStyle = kit.shirt2; c.fillRect(-0.23, -0.12, 0.46, 0.08);
  c.fillStyle = kit.trim; c.fillRect(-0.07, -0.64, 0.14, 0.04);
  c.fillStyle = kit.num; c.font = '700 0.24px ' + DISP; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('1', 0, -0.36);
  /* gloves */
  c.fillStyle = kit.glove;
  c.beginPath(); c.arc(-hx, hy, 0.09, 0, TAU); c.fill();
  c.beginPath(); c.arc(hx, hy, 0.09, 0, TAU); c.fill();
  /* head */
  c.fillStyle = '#e2ad86'; c.fillRect(-0.05, -0.72, 0.1, 0.1);
  c.beginPath(); c.arc(0, -0.8, 0.125, 0, TAU); c.fill();
  c.fillStyle = '#2d2019';
  c.beginPath(); c.arc(0, -0.83, 0.13, Math.PI * 1.02, Math.PI * 1.98); c.fill();
  c.fillStyle = '#1b1b1b';
  c.beginPath(); c.arc(-0.045, -0.8, 0.017, 0, TAU); c.fill();
  c.beginPath(); c.arc(0.045, -0.8, 0.017, 0, TAU); c.fill();
  c.restore();
}

/* a striker seen from behind; s = px per unit, figure about 180 units tall */
function drawStriker(c, x, y, s, kit, o) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.lineCap = 'round'; c.lineJoin = 'round';
  c.fillStyle = 'rgba(0,0,0,.26)'; ellipse(c, 0, 2, 36, 8); c.fill();
  var run = o.run || 0, k = o.kick || 0;
  var la = run ? Math.sin(run) * 9 : 0;
  function leg(lx, lift, swing) {
    c.save(); c.translate(lx, -80); c.rotate(swing);
    c.strokeStyle = '#e2ad86'; c.lineWidth = 14;
    c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 34 - lift); c.stroke();
    c.strokeStyle = kit.sock; c.lineWidth = 15;
    c.beginPath(); c.moveTo(0, 36 - lift); c.lineTo(0, 70 - lift); c.stroke();
    c.fillStyle = kit.sock2; c.fillRect(-7.5, 38 - lift, 15, 4);
    c.fillStyle = kit.boot; rr(c, -9, 68 - lift, 18, 12, 5); c.fill();
    c.restore();
  }
  leg(-11, Math.max(0, la), 0.03);
  leg(11, Math.max(0, -la) + k * 22, -k * 0.35 - 0.03);
  /* shorts */
  c.fillStyle = kit.shorts; rr(c, -26, -104, 52, 38, 9); c.fill();
  c.fillStyle = kit.shorts2; c.fillRect(-1, -100, 2, 30);
  /* arms */
  var sw = run ? Math.sin(run) * 0.35 : 0;
  [-1, 1].forEach(function (sd) {
    c.save(); c.translate(sd * 27, -146); c.rotate(sd * (0.18 + k * 0.5) + sd * sw);
    c.strokeStyle = '#e2ad86'; c.lineWidth = 11;
    c.beginPath(); c.moveTo(0, 8); c.lineTo(0, 46); c.stroke();
    c.strokeStyle = kit.sleeve; c.lineWidth = 15;
    c.beginPath(); c.moveTo(0, 2); c.lineTo(0, 18); c.stroke();
    c.restore();
  });
  /* shirt */
  c.fillStyle = kit.shirt;
  c.beginPath(); c.moveTo(-30, -150); c.quadraticCurveTo(0, -158, 30, -150); c.lineTo(25, -98); c.lineTo(-25, -98); c.closePath(); c.fill();
  c.fillStyle = kit.shirt2; c.fillRect(-25, -104, 50, 6);
  c.fillStyle = kit.sleeve; c.fillRect(-30, -150, 6, 44); c.fillRect(24, -150, 6, 44);
  c.fillStyle = kit.print; c.textAlign = 'center'; c.textBaseline = 'middle';
  if (o.name) { c.font = '700 13px ' + DISP; c.fillText(o.name, 0, -138); }
  c.font = '700 32px ' + DISP; c.fillText(o.num, 0, -115);
  /* head, from behind */
  c.fillStyle = '#e2ad86'; c.fillRect(-7, -164, 14, 12);
  ellipse(c, -16, -176, 3.5, 5.5); c.fill(); ellipse(c, 16, -176, 3.5, 5.5); c.fill();
  c.fillStyle = o.hair || '#2d2019';
  c.beginPath(); c.arc(0, -178, 16.5, 0, TAU); c.fill();
  c.restore();
}

function render() {
  if (!ctx || !G || !L) return;
  var c = ctx, d = ui.dpr, u = L.u, s = G.shot;
  c.setTransform(d, 0, 0, d, 0, 0);
  var sx = 0, sy = 0;
  if (G.shake > 0 && !RM) { sx = rnd(-1, 1) * G.shake; sy = rnd(-1, 1) * G.shake; }
  c.fillStyle = '#123a22'; c.fillRect(0, 0, L.W, L.H);
  c.translate(sx, sy);
  if (bgCv) c.drawImage(bgCv, 0, 0, bgCv.width, bgCv.height, 0, 0, L.W, L.H);
  drawCrowd(c);
  drawLights(c);
  /* crowd camera flashes */
  for (var i = 0; i < G.parts.length; i++) {
    var p = G.parts[i];
    if (p.k !== 'flash') continue;
    c.fillStyle = 'rgba(255,255,255,' + (p.life / p.max).toFixed(2) + ')';
    c.beginPath(); c.arc(p.x, p.y, p.s, 0, TAU); c.fill();
  }
  drawNet(c);
  /* the ball when it is behind the goal line */
  var bpos = null;
  if (s && (G.phase === 'flight' || G.phase === 'windup')) bpos = shotPos(s, s.t);
  else if (G.bp) bpos = G.bp;
  else bpos = { x: L.cx, y: L.by - BALL * L.ppm * SB, r: BALL * L.ppm * SB, gy: L.by };
  if (G.layer === 'back' && bpos) drawBallFull(c, bpos, true);
  drawKeeper(c, G.kp, G.mode === 'save' ? GK_JT : GK_THEM);
  drawFrame(c);
  if (G.layer === 'front' && bpos) drawBallFull(c, bpos, false);
  /* striker */
  var kit = G.mode === 'save' ? KIT_AWAY : KIT_HOME;
  var r0 = G.st.run, ex = 1 - (1 - r0) * (1 - r0);
  var fx = lerp(L.cx - 150 * u, L.cx - 48 * u, ex) + G.st.kick * 26 * u;
  var fy = lerp(L.by + 70 * u, L.by + 16 * u, ex) - G.st.kick * 6 * u;
  drawStriker(c, fx, fy, 0.72 * u, kit, {
    run: r0 < 1 && !RM ? G.st.phase : 0, kick: G.st.kick,
    name: G.mode === 'save' ? '' : 'JT', num: G.mode === 'save' ? '9' : '7', hair: G.mode === 'save' ? '#1a1410' : '#4a3020'
  });
  /* aim helpers */
  if (G.mode === 'shoot' && G.phase === 'aim') drawAim(c);
  if (G.mode === 'save' && (G.phase === 'runup' || G.phase === 'windup')) drawZones(c);
  /* particles and confetti */
  for (i = 0; i < G.parts.length; i++) {
    p = G.parts[i];
    if (p.k === 'flash') continue;
    c.globalAlpha = clamp(p.life / p.max * 1.5, 0, 1);
    c.fillStyle = p.c; c.beginPath(); c.arc(p.x, p.y, p.s, 0, TAU); c.fill();
  }
  c.globalAlpha = 1;
  for (i = 0; i < G.conf.length; i++) {
    p = G.conf[i];
    c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.scale(1, Math.cos(p.rot * 1.7 + p.ph));
    c.globalAlpha = clamp(p.life * 1.5, 0, 1);
    c.fillStyle = p.c; c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    if (p.c === '#ffffff') { c.strokeStyle = 'rgba(0,0,0,.12)'; c.lineWidth = 0.6; c.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h); }
    c.restore();
  }
  c.globalAlpha = 1;
}

function drawBallFull(c, b, behind) {
  var u = L.u, gy = b.gy, s = G.shot;
  if (gy == null) {
    if (G.bp && G.bp.mode === 'phys') gy = G.bp.floor + (G.bp.inNet ? b.r : 0);
    else if (s && G.bp && (G.bp.mode === 'net' || G.bp.mode === 'away')) gy = shotPos(s, G.bp.t).gy;
  }
  c.save();
  c.globalAlpha = behind ? G.fade : 1;
  if (gy != null && !(G.bp && G.bp.mode === 'held')) {
    var hgt = Math.max(0, gy - (b.y + b.r));
    var sa = clamp(0.35 - hgt / (220 * u), 0.06, 0.35);
    c.fillStyle = 'rgba(0,0,0,' + sa.toFixed(3) + ')';
    ellipse(c, b.x, gy - b.r * 0.1, b.r * 1.1, b.r * 0.32); c.fill();
  }
  drawBall(c, b.x, b.y, b.r, G.spin);
  c.restore();
}

function drawAim(c) {
  var u = L.u, bx = L.cx, by = L.by - BALL * L.ppm * SB, t, a = null;
  if (G.drag && G.drag.live) a = G.drag.aim;
  else if (G.aim) a = G.aim;
  if (a) {
    var ax = gX(clamp(a.x, -7, 7)), ay = gY(clamp(a.y, -0.6, 5));
    /* dotted path */
    c.save();
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 2 * u; c.setLineDash([3 * u, 7 * u]);
    c.beginPath(); c.moveTo(bx, by);
    c.quadraticCurveTo(lerp(bx, ax, 0.5), Math.min(by, ay) - 30 * u, ax, ay); c.stroke();
    c.restore();
    var pulse = RM ? 0 : Math.sin(G.t * 6) * 1.5 * u, R = 13 * u + pulse;
    var over = a.y > GHM || Math.abs(a.x) > HW;
    c.strokeStyle = over ? '#ffb4b4' : GOLD; c.lineWidth = 3 * u;
    c.beginPath(); c.arc(ax, ay, R, 0, TAU); c.stroke();
    c.beginPath();
    c.moveTo(ax - R - 5 * u, ay); c.lineTo(ax - R + 5 * u, ay); c.moveTo(ax + R - 5 * u, ay); c.lineTo(ax + R + 5 * u, ay);
    c.moveTo(ax, ay - R - 5 * u); c.lineTo(ax, ay - R + 5 * u); c.moveTo(ax, ay + R - 5 * u); c.lineTo(ax, ay + R + 5 * u);
    c.stroke();
    c.fillStyle = over ? '#ffb4b4' : GOLD; c.beginPath(); c.arc(ax, ay, 3 * u, 0, TAU); c.fill();
  }
  /* live power ring while dragging */
  if (G.drag && G.drag.live) {
    var pw = clamp(G.ring / 1.2, 0, 1), rb = BALL * L.ppm * SB + 7 * u;
    c.lineWidth = 5 * u; c.strokeStyle = 'rgba(0,0,0,.35)';
    c.beginPath(); c.arc(bx, by, rb, 0, TAU); c.stroke();
    c.strokeStyle = G.ring > 0.95 ? '#ff6b6b' : G.ring > 0.55 ? GREEN : '#c9f2d4';
    c.beginPath(); c.arc(bx, by, rb, -Math.PI / 2, -Math.PI / 2 + TAU * pw); c.stroke();
  }
  /* power meter */
  if (G.meter.on) {
    var mh = 128 * u, mw = 18 * u, mx = Math.min(L.W - mw - 14 * u, bx + 64 * u), my = L.by - mh + 6 * u;
    c.fillStyle = 'rgba(6,20,12,.75)'; rr(c, mx - 6 * u, my - 26 * u, mw + 12 * u, mh + 34 * u, 10 * u); c.fill();
    function band(v0, v1, col) { var y0 = my + mh - v1 / 1.2 * mh, y1 = my + mh - v0 / 1.2 * mh; c.fillStyle = col; c.fillRect(mx, y0, mw, y1 - y0); }
    band(0, 0.55, '#bfe8cd'); band(0.55, 0.95, GREEN); band(0.95, 1.2, '#ff5b6e');
    c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 1.5 * u; c.strokeRect(mx, my, mw, mh);
    t = my + mh - G.meter.v / 1.2 * mh;
    c.fillStyle = '#ffffff';
    c.beginPath(); c.moveTo(mx - 7 * u, t - 6 * u); c.lineTo(mx + 1 * u, t); c.lineTo(mx - 7 * u, t + 6 * u); c.closePath(); c.fill();
    c.fillRect(mx - 2 * u, t - 1.5 * u, mw + 4 * u, 3 * u);
    c.fillStyle = '#ffffff'; c.font = '700 ' + Math.round(11 * u) + 'px ' + DISP; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('POWER', mx + mw / 2, my - 13 * u);
  }
}

function drawZones(c) {
  var u = L.u, names = ['left', 'middle', 'right'], labels = ['Left', 'Middle', 'Right'], keys = ['<', '^', '>'];
  var x0 = gX(-HW), w = 2 * HW * L.ppm / 3, y0 = gY(GHM) + 4 * u, h = GHM * L.ppm - 8 * u;
  for (var i = 0; i < 3; i++) {
    var on = G.choice === names[i];
    if (G.choice && !on) continue;
    var x = x0 + i * w + 4 * u;
    c.fillStyle = on ? 'rgba(255,199,44,.35)' : 'rgba(255,255,255,.13)';
    rr(c, x, y0, w - 8 * u, h, 10 * u); c.fill();
    c.save(); c.setLineDash([6 * u, 5 * u]); c.lineWidth = 2 * u; c.strokeStyle = on ? GOLD : 'rgba(255,255,255,.7)'; c.stroke(); c.restore();
    var lx = x + (w - 8 * u) / 2, ly = y0 + h * 0.45, txt = labels[i].toUpperCase() + (FINE ? '  ' + keys[i] : '');
    c.font = '700 ' + Math.round(15 * u) + 'px ' + DISP; c.textAlign = 'center'; c.textBaseline = 'middle';
    var tw = c.measureText(txt).width + 16 * u;
    c.fillStyle = on ? GOLD : 'rgba(6,20,12,.82)'; rr(c, lx - tw / 2, ly - 12 * u, tw, 24 * u, 12 * u); c.fill();
    c.fillStyle = on ? INK : '#ffffff'; c.fillText(txt, lx, ly + 1 * u);
  }
}

/* ---------- input ---------- */
function flickPower(v) { return 0.3 + 0.9 * (1 - Math.exp(-v / 2.2)); }
function dragAim(dx, dy) {
  var k = 2.2;
  return toGoal(L.cx + dx * k, (L.by - BALL * L.ppm * SB) + dy * k);
}
function tapAt(px, py) {
  if (!G || state !== 'play') return;
  if (G.phase === 'result') { skipAhead(); return; }
  if (G.mode === 'save') {
    var third = HW * L.ppm / 3;
    choose(px < L.cx - third ? 'left' : px > L.cx + third ? 'right' : 'middle');
    return;
  }
  if (G.phase !== 'aim') return;
  if (G.meter.on) { strike(G.aim.x, G.aim.y, G.meter.v); return; }
  var g = toGoal(px, py);
  G.aim = { x: clamp(g.x, -7, 7), y: clamp(g.y, BALL, 5) };
  G.meter.on = true; G.meter.v = 0; G.meter.d = 1;
  sfx('aim');
  syncHint();
}
function keyAim(dx, dy) {
  if (!G || G.mode !== 'shoot' || G.phase !== 'aim') return;
  if (!G.aim) G.aim = { x: 0, y: 1.1 };
  G.aim.x = clamp(G.aim.x + dx * 0.4, -5.5, 5.5);
  G.aim.y = clamp(G.aim.y + dy * 0.3, BALL, 3.6);
  syncHint();
}
function keyGo() {
  if (!G || G.mode !== 'shoot' || G.phase !== 'aim') return;
  if (!G.aim) G.aim = { x: 0, y: 1.1 };
  if (!G.meter.on) { G.meter.on = true; G.meter.v = 0; G.meter.d = 1; sfx('aim'); syncHint(); return; }
  strike(G.aim.x, G.aim.y, G.meter.v);
}

function pointerXY(e) { var r = ui.canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
function bindPointer(cv) {
  var down = null;
  cv.addEventListener('pointerdown', function (e) {
    e.preventDefault(); unlockAudio();
    if (state !== 'play') return;
    var p = pointerXY(e);
    down = { x: p.x, y: p.y, t: e.timeStamp || performance.now(), samples: [[p.x, p.y, e.timeStamp || performance.now()]], moved: 0 };
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
  });
  cv.addEventListener('pointermove', function (e) {
    if (!down || !G) return;
    var p = pointerXY(e), now = e.timeStamp || performance.now();
    down.samples.push([p.x, p.y, now]);
    if (down.samples.length > 40) down.samples.shift();
    var dx = p.x - down.x, dy = p.y - down.y;
    down.moved = Math.max(down.moved, Math.hypot(dx, dy));
    if (G.mode === 'shoot' && G.phase === 'aim' && down.moved > 12 && dy < -8) {
      if (!G.drag) { G.drag = { live: true }; syncHint(); }
      G.drag.aim = dragAim(dx, dy);
      G.ring = lerp(G.ring, flickPower(speedOf(down.samples, now)), 0.35);
    }
  });
  function end(e, cancel) {
    if (!down) return;
    var d = down; down = null;
    if (!G || state !== 'play') return;
    var p = pointerXY(e), now = e.timeStamp || performance.now();
    d.samples.push([p.x, p.y, now]);
    var dx = p.x - d.x, dy = p.y - d.y;
    var wasDrag = G.drag && G.drag.live;
    G.drag = null;
    if (cancel) { G.ring = 0; syncHint(); return; }
    if (wasDrag && dy < -24) {
      var aim = dragAim(dx, dy), v = speedOf(d.samples, now);
      G.ring = 0;
      if (v >= 0.4) { strike(aim.x, aim.y, flickPower(v)); return; }
      /* a slow, careful drag: keep the aim and let the power bar do the rest */
      G.aim = { x: clamp(aim.x, -7, 7), y: clamp(aim.y, BALL, 5) };
      G.meter.on = true; G.meter.v = 0; G.meter.d = 1;
      sfx('aim');
      syncHint();
      return;
    }
    G.ring = 0;
    if (Math.hypot(dx, dy) < 16) tapAt(p.x, p.y);
    else syncHint();
  }
  cv.addEventListener('pointerup', function (e) { end(e, false); });
  cv.addEventListener('pointercancel', function (e) { end(e, true); });
  cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });
}
/* speed over the last tenth of a second, in stage units per millisecond */
function speedOf(samples, now) {
  var last = samples[samples.length - 1], first = last;
  for (var i = samples.length - 1; i >= 0; i--) { first = samples[i]; if (now - samples[i][2] > 100) break; }
  var dt = Math.max(16, last[2] - first[2]);
  return Math.hypot(last[0] - first[0], last[1] - first[1]) / dt / L.u;
}

/* ---------- overlay and UI ---------- */
function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
function ballCanvas(px) {
  var d = Math.min(window.devicePixelRatio || 1, 3), c = document.createElement('canvas');
  c.width = Math.round(px * d); c.height = Math.round(px * d);
  var x = c.getContext('2d'); x.scale(d, d);
  drawBall(x, px / 2, px / 2, px / 2 - 1.5, 0.3);
  return c;
}

function build() {
  var o = el('div', 'jtpen');
  o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', GAME + ', a football game');
  var bar = el('div', 'jtp-bar');
  var title = el('div', 'jtp-title'); title.appendChild(ballCanvas(30)); title.appendChild(el('span', '', GAME));
  var kb = el('button', 'jtp-tb jtp-keep'); kb.type = 'button'; kb.title = 'Every fifth kick you go in goal';
  var snd = el('button', 'jtp-tb jtp-snd'); snd.type = 'button';
  var x = el('button', 'jtp-x', 'Close &#10005;'); x.type = 'button'; x.setAttribute('aria-label', 'Close the game');
  bar.appendChild(title); bar.appendChild(kb); bar.appendChild(snd); bar.appendChild(x);
  var stage = el('div', 'jtp-stage');
  var cv = document.createElement('canvas');
  cv.setAttribute('role', 'img');
  cv.setAttribute('aria-label', 'Penalty game. Flick up from the ball to shoot, or tap a spot in the goal and tap again for power. Arrow keys and Space work too.');
  var hud = el('div', 'jtp-hud', '<div class="jtp-score"><b>0</b><span>Streak</span></div><div class="jtp-best">Best <b>0</b></div>');
  var hint = el('div', 'jtp-hint gone');
  var tst = el('div', 'jtp-toast'); tst.setAttribute('aria-live', 'polite');
  var ban = el('div', 'jtp-banner'); ban.setAttribute('aria-live', 'polite');
  var card = el('div', 'jtp-card'); card.hidden = true;
  stage.appendChild(cv); stage.appendChild(hud); stage.appendChild(hint); stage.appendChild(tst); stage.appendChild(ban); stage.appendChild(card);
  o.appendChild(bar); o.appendChild(stage);

  ui = { o: o, bar: bar, keep: kb, snd: snd, x: x, stage: stage, canvas: cv, hud: hud, hint: hint, toast: tst, banner: ban, card: card,
    score: hud.querySelector('.jtp-score b'), best: hud.querySelector('.jtp-best'), bestN: hud.querySelector('.jtp-best b'), dpr: 1 };
  ctx = cv.getContext('2d');

  x.addEventListener('click', close);
  snd.addEventListener('click', function () { unlockAudio(); store.sound = !store.sound; saveStore(); syncButtons(); if (store.sound) sfx('aim'); });
  kb.addEventListener('click', function () { keeperOn = !keeperOn; syncButtons(); });
  card.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('button') : null;
    if (!b) return;
    var act = b.getAttribute('data-act');
    if (act === 'again') restart();
    else if (act === 'close') close();
  });
  bindPointer(cv);
  o.addEventListener('pointerdown', unlockAudio);
  o.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
  return o;
}

function syncButtons() {
  if (!ui.snd) return;
  ui.snd.textContent = store.sound ? 'Sound on' : 'Sound off';
  ui.snd.setAttribute('aria-pressed', store.sound ? 'true' : 'false');
  ui.keep.textContent = keeperOn ? 'Keeper on' : 'Keeper off';
  ui.keep.setAttribute('aria-pressed', keeperOn ? 'true' : 'false');
  ui.keep.setAttribute('aria-label', 'Keeper turns ' + (keeperOn ? 'on' : 'off') + '. Every fifth kick you go in goal.');
}

function syncHint() {
  if (!ui.hint || !G) return;
  var h = '';
  if (state === 'play') {
    if (G.mode === 'save') {
      if (G.phase === 'runup' && !G.choice) h = 'Pick where to dive: tap left, middle or right' + (FINE ? ',<br>or use the arrow keys.' : '.') + ' No rush.';
    } else if (G.phase === 'aim') {
      if (G.drag && G.drag.live) h = (G.shots < 2 && store.games < 3) ? 'Flick and let go to shoot. A quicker flick hits harder.<br>Pause before letting go to use the power bar.' : '';
      else if (G.meter.on) h = 'Tap again' + (FINE ? ' (or Space)' : '') + ' to strike. Green is the sweet spot.';
      else if (G.aim) h = FINE ? 'Space to set the power.' : '';
      else if (G.shots < 2 && store.games < 3) h = 'Flick up from the ball to shoot.<br>Or tap the goal, then tap again for power.' + (FINE ? '<br>Keys: arrows to aim, then Space.' : '');
    }
  }
  if (h) { ui.hint.innerHTML = h; ui.hint.className = 'jtp-hint'; }
  else ui.hint.className = 'jtp-hint gone';
}

function layout() {
  if (!ui.o) return;
  var vw = window.innerWidth, vh = window.innerHeight;
  var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  var barH = ui.bar.offsetHeight || 66;
  var H = Math.floor(Math.max(260, vh - barH - 10));
  var W = Math.floor(Math.min(vw - 16, 880, H * 1.45));
  ui.dpr = dpr;
  ui.canvas.width = Math.round(W * dpr); ui.canvas.height = Math.round(H * dpr);
  ui.canvas.style.width = W + 'px'; ui.canvas.style.height = H + 'px';
  computeLayout(W, H);
  /* the banner sits above the goal when there is room, otherwise on the grass below it */
  var keep = ui.banner.innerHTML;
  ui.banner.innerHTML = 'GOAL!<small>Get in!</small>';
  var bh = ui.banner.offsetHeight || 140;
  ui.banner.innerHTML = keep;
  var room = gY(GHM) - 64;
  ui.banner.style.top = Math.round(room >= bh + 8 ? gY(GHM) - bh - 8 : L.gB + 14 * L.u) + 'px';
  ui.hint.style.top = Math.round(L.gB + (L.by - L.gB) * 0.2) + 'px';
  buildBackground();
  render();
}

function updateHud() {
  if (!ui.score || !G) return;
  ui.score.textContent = String(G.streak);
  ui.bestN.textContent = String(Math.max(store.best, G.streak));
  ui.best.className = 'jtp-best' + (G.streak > G.startBest && G.startBest > 0 ? ' hot' : '');
}
var toastT = 0, banT = 0;
function toast(t, trophy) {
  if (!ui.toast) return;
  ui.toast.innerHTML = (trophy ? TROPHY : '') + '<span>' + t + '</span>';
  ui.toast.className = 'jtp-toast on';
  clearTimeout(toastT); toastT = setTimeout(function () { if (ui.toast) ui.toast.className = 'jtp-toast'; }, 1800);
}
function showBanner(text, kind, sub) {
  if (!ui.banner) return;
  ui.banner.innerHTML = text + (sub ? '<small>' + sub + '</small>' : '');
  ui.banner.className = 'jtp-banner';
  void ui.banner.offsetWidth;
  ui.banner.className = 'jtp-banner on' + (kind === 'save' ? ' k-save' : '');
  clearTimeout(banT); banT = setTimeout(function () { if (ui.banner) ui.banner.className = 'jtp-banner'; }, 1700);
}

var OVER = {
  save: { t: 'Saved!', col: '#5b3aae', m: ['Unlucky. Their keeper guessed right this time.', 'Unlucky. Good strike, better save.', 'Unlucky. The keeper is having a big day.'] },
  wide: { t: 'Just wide', col: '#2b6e9e', m: ['Only a little bit off. So close.', 'Whistled past the post. Next one goes in.', 'The side netting... from the outside.'] },
  over: { t: 'Over the bar', col: '#2b6e9e', m: ['Bit too much on that one. Happens to the best.', 'That one is heading for the car park.', 'Lots of power. Maybe a touch less next time.'] },
  post: { t: 'Off the post!', col: '#9a6b00', m: ['So close. You could hear the clang from the stand.', 'Inches away. Unlucky.'] },
  bar: { t: 'Off the bar!', col: '#9a6b00', m: ['Rattled the crossbar. So close.', 'The bar is still shaking. Unlucky.'] }
};
function showOver() {
  state = 'over';
  G.phase = 'over';
  store.games++;
  saveStore();
  var m = OVER[G.outcome] || OVER.save, s = G.streak;
  var nb = G.newBest && s > 0;
  ui.card.innerHTML = (nb ? '<div class="jtp-badge jtp-pop">' + TROPHY + 'New best!</div>' : '') +
    '<h2 style="color:' + m.col + '">' + m.t + '</h2>' +
    '<p>' + pick(m.m) + '</p>' +
    '<div class="jtp-nums"><div><span>Streak</span><b>' + s + '</b></div><div><span>Best</span><b>' + store.best + '</b></div></div>' +
    '<button type="button" class="jtp-go" data-act="again">Again</button>' +
    '<button type="button" class="jtp-c2" data-act="close">Close</button>' +
    '<p class="jtp-tip">Enter or Space also starts again.</p>';
  ui.card.insertBefore(ballCanvas(52), ui.card.firstChild);
  ui.card.hidden = false;
  ui.hint.className = 'jtp-hint gone';
  overAt = Date.now();
  if (nb) {
    sfx('best');
    var n = RM ? 14 : 70, u = L.u;
    for (var i = 0; i < n; i++) G.conf.push({ x: rnd(0, L.W), y: rnd(-L.H * 0.2, -6), vx: rnd(-30, 30) * u, vy: rnd(30, 110) * u,
      rot: rnd(0, TAU), vr: rnd(-8, 8), w: rnd(5, 8) * u, h: rnd(3, 4.5) * u, c: pick([GOLD, '#ffffff', RED]), life: rnd(2.4, 3.6), ph: rnd(0, TAU) });
  }
  var again = ui.card.querySelector('.jtp-go');
  try { again.focus({ preventScroll: true }); } catch (e) { again.focus(); }
  updateHud();
}
function restart() {
  if (!ui.o) return;
  state = 'play';
  ui.card.hidden = true; ui.card.innerHTML = '';
  ui.toast.className = 'jtp-toast';
  newGame();
  updateHud();
  focusStage();
}
function focusStage() { try { ui.canvas.setAttribute('tabindex', '-1'); ui.canvas.focus({ preventScroll: true }); } catch (e) {} }

function onKey(e) {
  if (state === 'closed') return;
  var k = e.key, tgt = e.target, onBtn = tgt && tgt.tagName === 'BUTTON';
  if (k === 'Escape' || k === 'Esc') { e.preventDefault(); close(); return; }
  if (k === 'Tab') { trapTab(e); return; }
  unlockAudio();
  var go = (k === ' ' || k === 'Spacebar' || k === 'Enter');
  if (state === 'over') {
    if (go && !onBtn) { e.preventDefault(); if (Date.now() - overAt > 350) restart(); }
    else if (k.indexOf('Arrow') === 0) e.preventDefault();
    return;
  }
  if (k === 'm' || k === 'M') { store.sound = !store.sound; saveStore(); syncButtons(); return; }
  if (go && onBtn) return;
  var left = k === 'ArrowLeft' || k === 'a' || k === 'A', right = k === 'ArrowRight' || k === 'd' || k === 'D';
  var up = k === 'ArrowUp' || k === 'w' || k === 'W', down = k === 'ArrowDown' || k === 's' || k === 'S';
  if (!G) return;
  if (G.phase === 'result') { if (go) { e.preventDefault(); skipAhead(); } return; }
  if (G.mode === 'save') {
    if (left) { e.preventDefault(); choose('left'); }
    else if (right) { e.preventDefault(); choose('right'); }
    else if (up || down || go) { e.preventDefault(); choose('middle'); }
    else if (k === '1') choose('left'); else if (k === '2') choose('middle'); else if (k === '3') choose('right');
    return;
  }
  if (left || right || up || down) { e.preventDefault(); keyAim(left ? -1 : right ? 1 : 0, up ? 1 : down ? -1 : 0); return; }
  if (go) { e.preventDefault(); if (!e.repeat) keyGo(); }
}
function trapTab(e) {
  var list = Array.prototype.filter.call(ui.o.querySelectorAll('button'), function (b) { return !b.disabled && b.offsetParent !== null; });
  if (!list.length) return;
  var i = list.indexOf(document.activeElement);
  e.preventDefault();
  var n = e.shiftKey ? (i <= 0 ? list.length - 1 : i - 1) : (i < 0 || i >= list.length - 1 ? 0 : i + 1);
  list[n].focus();
}
function onVis() { hiddenPause = !!document.hidden; lastTs = 0; }
function onResize() { layout(); }

function frame(ts) {
  raf = requestAnimationFrame(frame);
  if (hiddenPause) { lastTs = 0; return; }
  var dt = lastTs ? (ts - lastTs) / 1000 : 0;
  lastTs = ts;
  if (dt > 0.05) dt = 0.05;
  if (state !== 'closed' && G) update(dt);
  render();
}

function open() {
  if (state !== 'closed') return;
  opener = document.activeElement;
  unlockAudio();
  RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var o = build();
  document.body.appendChild(o);
  prevOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  syncButtons();
  state = 'play';
  layout();
  newGame();
  updateHud();
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVis);
  hiddenPause = !!document.hidden;
  lastTs = 0;
  raf = requestAnimationFrame(frame);
  focusStage();
}
function close() {
  if (state === 'closed') return;
  state = 'closed';
  cancelAnimationFrame(raf); raf = 0;
  clearTimeout(toastT); clearTimeout(banT);
  window.removeEventListener('keydown', onKey, true);
  window.removeEventListener('resize', onResize);
  document.removeEventListener('visibilitychange', onVis);
  if (ui.o && ui.o.parentNode) ui.o.parentNode.removeChild(ui.o);
  ui = {}; ctx = null; G = null; bgCv = null; crowdCv = null;
  document.documentElement.style.overflow = prevOverflow;
  if (AC && AC.state === 'running') { try { AC.suspend(); } catch (e) {} }
  updateNote();
  if (opener && opener.focus) { try { opener.focus({ preventScroll: true }); } catch (e) {} }
}

/* ---------- the button in the hero ---------- */
var note = null;
function updateNote() {
  loadStore();
  if (note) note.textContent = store.best > 0 ? 'Best streak: ' + store.best + '. Step up whenever you fancy it.' : 'Step up whenever you fancy it.';
}
function addButton() {
  var hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('.jtpen-launch')) return;
  var box = el('div', 'jtpen-launch');
  var btn = el('button', 'jtpen-open'); btn.type = 'button';
  btn.appendChild(ballCanvas(32));
  btn.appendChild(el('span', '', 'Take a penalty'));
  btn.addEventListener('click', open);
  note = el('p', 'jtpen-note');
  box.appendChild(btn); box.appendChild(note);
  hero.appendChild(box);
  updateNote();
}
if (WITH_BUTTON) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addButton);
  else addButton();
}

window.JTPenalty = { open: open, close: close };

/* ---------- test hook (only with ?jttest in the address) ---------- */
if (TEST) {
  window.__jtPenalty = {
    info: function () {
      var o = { state: state, best: store.best, games: store.games, keeperOn: keeperOn, RM: RM };
      if (!G) return o;
      o.phase = G.phase; o.mode = G.mode; o.streak = G.streak; o.turn = G.turn; o.outcome = G.outcome;
      o.meterOn = G.meter.on; o.meter = G.meter.v; o.aim = G.aim; o.choice = G.choice; o.shots = G.shots;
      o.shot = G.shot ? { tx: G.shot.tx, ty: G.shot.ty, power: G.shot.power } : null;
      o.hint = ui.hint && ui.hint.className.indexOf('gone') < 0 ? ui.hint.textContent : '';
      return o;
    },
    /* where a goal point (metres) sits on the page, in client pixels */
    toClient: function (x, h) {
      var r = ui.canvas.getBoundingClientRect();
      return { x: r.left + gX(x), y: r.top + gY(h) };
    },
    ballClient: function () {
      var r = ui.canvas.getBoundingClientRect();
      return { x: r.left + L.cx, y: r.top + L.by - BALL * L.ppm * SB, u: L.u };
    },
    set: function (o) { for (var k in o) if (Object.prototype.hasOwnProperty.call(T, k)) T[k] = o[k]; return T; },
    shoot: function (x, y, p) { return strike(x, y, p); },
    nextKeeperTurn: function () { if (G) G.turn = Math.floor(G.turn / 5) * 5 + 4; return G && G.turn; },
    /* how often the keeper saves a given shot, no animation */
    saveRate: function (x, y, p, streak, n) {
      var keep = G, hits = 0;
      n = n || 400;
      for (var i = 0; i < n; i++) {
        G = { streak: streak || 0, kp: keeperRest(), t: 0, phase: 'flight' };
        var s = makeShot(x, y, p, 'jt');
        keeperThink(s);
        var tt = 0; while (tt < s.ft) { updateKeeper(G.kp, 1 / 60); tt += 1 / 60; }
        if (keeperHits(G.kp, s.tx, s.ty) && Math.abs(s.tx) < HW + 0.4 && s.ty < GHM + 0.4) hits++;
      }
      G = keep;
      return hits / n;
    },
    reducedMotion: function () { return RM; }
  };
}
})();
