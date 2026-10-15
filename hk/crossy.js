/* ==========================================================
   HK's Overgrown HQ - Overgrown Hop
   A pop up hopping game. A small pixel dinosaur hops forward
   through a town that nature has taken back: grass and rubble,
   old roads that still have traffic, rivers with drifting logs
   and rafts, and dino trails where a big herd thunders past.

   No timers, no nagging, standing still is always fine.
   Instant restart, calm messages, sound can be turned off.

   Home page:  <script src="/hk/crossy.js?v=1" data-button="1"></script>
               (adds a Play button and a one line note to .hero)
   Any page:   window.HKCrossy.open() opens the game.
   Saves { best, games, sound } in b5.hk.crossy.v1 on this device.
   Everything is drawn in code. ASCII only in this file.
   ========================================================== */
(function () {
'use strict';
if (window.HKCrossy) return;

var KEY = 'b5.hk.crossy.v1';
var GAME = 'Overgrown Hop';
var COLS = 9, TS = 16, LW = COLS * TS;   /* art pixels */
var SPAN = 18, XMIN = -4.5;              /* lanes wrap over this many tiles */
var HOP = 0.12;                          /* seconds per hop */
var me = document.currentScript;
var WITH_BUTTON = !!(me && me.getAttribute('data-button') && me.getAttribute('data-button') !== '0');
var TEST = /[?&]hktest(=|&|$)/.test(location.search);

/* ---------- storage ---------- */
var store = { best: 0, games: 0, sound: true, runs: 0, credited: 0 };
function loadStore() {
  try {
    var o = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (o && typeof o === 'object') {
      if (isFinite(o.best)) store.best = Math.max(0, Math.floor(o.best));
      if (isFinite(o.games)) store.games = Math.max(0, Math.floor(o.games));
      if (typeof o.sound === 'boolean') store.sound = o.sound;
      if (isFinite(o.runs)) store.runs = Math.max(0, Math.floor(o.runs));
      if (isFinite(o.credited)) store.credited = Math.max(0, Math.floor(o.credited));
    }
  } catch (e) {}
}
function saveStore() {
  try { localStorage.setItem(KEY, JSON.stringify({ best: store.best, games: store.games, sound: store.sound, runs: store.runs, credited: store.credited })); } catch (e) {}
}
loadStore();

/* ---------- runs are earned with questions ----------
   Jay asked for this: HK answers questions before he can play.
   GATE_N right answers at the gate earn GATE_RUNS runs.
   Every PER_RIGHT right answers in his activities or the daily drop earn one more run.
   Show me never counts. Change the numbers here. */
var GATE_N = 3, GATE_RUNS = 2, PER_RIGHT = 5;
var SKIPKEYS = /^b5\.hk\.(hq|crossy|review|daily|swipe|bonnie|sent|skin|scare)/;
function rightAnswers() {
  var n = 0, i, k, o, a;
  try {
    for (i = 0; i < localStorage.length; i++) {
      k = localStorage.key(i);
      if (!k || k.indexOf('b5.hk.') !== 0 || SKIPKEYS.test(k)) continue;
      try { o = JSON.parse(localStorage.getItem(k)); } catch (e) { continue; }
      if (!o || typeof o !== 'object' || !o.answers || typeof o.answers !== 'object') continue;
      for (a in o.answers) {
        var st = o.answers[a] && o.answers[a].status;
        if (st === 'right1' || st === 'right2') n++;
      }
    }
    o = JSON.parse(localStorage.getItem('b5.hk.daily.v1') || 'null');
    if (o && o.days) for (a in o.days) { var r = o.days[a] && o.days[a].r; if (r === 'right1' || r === 'right2') n++; }
  } catch (e) {}
  return n;
}
function syncCredit() {
  loadStore();
  var total = rightAnswers();
  if (total < store.credited) store.credited = total;   /* an activity was started again */
  var earn = Math.floor((total - store.credited) / PER_RIGHT);
  if (earn > 0) { store.runs += earn; store.credited += earn * PER_RIGHT; }
  saveStore();
  return total;
}
function takeRun() {
  syncCredit();
  if (store.runs < 1) return false;
  store.runs--; saveStore();
  return true;
}
function runsWord(n) { return n === 1 ? '1 run' : n + ' runs'; }

/* ---------- small helpers ---------- */
function rnd(a, b) { return a + Math.random() * (b - a); }
function irnd(a, b) { return Math.floor(rnd(a, b + 1)); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function lerp(a, b, t) { return a + (b - a) * t; }
function hash(a, b) {
  var n = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return (n ^ (n >>> 16)) >>> 0;
}
function diff(r) { return clamp((r - 3) / 220, 0, 1); }
var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

/* ---------- sprites ---------- */
var DINO = [
  '.......OGGGGG.',
  '......OGLLGGGG',
  '......GGLGGWKG',
  '......GGGGGGGG',
  '......GGGGgggg',
  '.....OGGGGGGW.',
  '....OGGGGBBB..',
  '...OGGGGGBBGG.',
  'O.OGGGGGGBB.g.',
  'GGGGGGGGGBB...',
  '.ggGGGGGGBB...',
  '...gGGGGGgg...',
  '....GG..GG....',
  '....gK..gK....'
];
var DPAL = { G: '#5ccf52', g: '#2c8f43', L: '#b4f582', B: '#ffd76e', O: '#ff8a3a', W: '#ffffff', K: '#15281c' };
function sprite(rows, pal, flip, blink) {
  var h = rows.length, w = rows[0].length;
  var c = document.createElement('canvas'); c.width = w; c.height = h;
  var x = c.getContext('2d');
  for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) {
    var ch = rows[j].charAt(i);
    if (ch === '.') continue;
    if (blink && j === 2 && (ch === 'W' || ch === 'K')) ch = 'g';
    x.fillStyle = pal[ch];
    x.fillRect(flip ? w - 1 - i : i, j, 1, 1);
  }
  return c;
}
var SPR = null;
function sprites() {
  if (!SPR) SPR = { r: sprite(DINO, DPAL, false), l: sprite(DINO, DPAL, true), rb: sprite(DINO, DPAL, false, true), lb: sprite(DINO, DPAL, true, true) };
  return SPR;
}

/* tiny 3x5 pixel digits for the floating "+2" */
var FONT = {
  '0': '111101101101111', '1': '010110010010111', '2': '111001111100111', '3': '111001111001111',
  '4': '101101111001001', '5': '111100111001111', '6': '111100111101111', '7': '111001010010010',
  '8': '111101111101111', '9': '111101111001111', '+': '000010111010000'
};

/* ---------- styles ---------- */
var css = document.createElement('style');
css.textContent =
'html body>.hkgame{position:fixed !important;z-index:2147483000 !important;inset:0 !important}' +
'.hkgame{display:flex;flex-direction:column;align-items:center;margin:0;padding:0 0 10px;overflow:hidden;' +
'color:var(--moon,#f3f8ee);font-family:var(--body,"Atkinson Hyperlegible",Verdana,system-ui,sans-serif);' +
'background:radial-gradient(120% 70% at 50% 0%,rgba(92,207,82,.20),transparent 60%),radial-gradient(90% 60% at 50% 110%,rgba(255,138,58,.16),transparent 60%),var(--night,#0c1a13);' +
'background-color:var(--night,#0c1a13);overscroll-behavior:contain;-webkit-tap-highlight-color:transparent}' +
'.hkgame *{box-sizing:border-box}' +
'.hkgame button{font-family:var(--display,"Arial Black",system-ui,sans-serif);cursor:pointer;-webkit-user-select:none;user-select:none}' +
'.hkgame button:focus-visible{outline:3px solid #ffd76e;outline-offset:3px}' +
'.hkg-bar{width:100%;display:flex;align-items:center;gap:8px;padding:10px 12px}' +
'.hkg-title{flex:1;min-width:0;display:flex;align-items:center;gap:10px;font-family:var(--display,"Arial Black",system-ui,sans-serif);font-weight:800;font-size:1.15rem;letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
'.hkg-title canvas{width:28px;height:28px;image-rendering:pixelated;flex:none}' +
'.hkg-title span{overflow:hidden;text-overflow:ellipsis}' +
'.hkg-tb{min-height:46px;padding:8px 13px;border-radius:12px;border:2px solid rgba(255,255,255,.28);background:rgba(255,255,255,.08);color:inherit;font-weight:700;font-size:.92rem;line-height:1.1}' +
'.hkg-tb:hover{background:rgba(255,255,255,.16)}' +
'.hkg-tb[aria-pressed="false"]{opacity:.72}' +
'.hkg-x{min-height:50px;padding:8px 18px;border-radius:14px;border:3px solid #15281c;background:#fffaf0;color:#15281c;font-weight:800;font-size:1.05rem;box-shadow:0 4px 0 rgba(0,0,0,.35)}' +
'.hkg-x:hover{background:#ffd76e}' +
'.hkg-stage{position:relative;flex:none;border-radius:14px;overflow:hidden;box-shadow:0 0 0 3px rgba(255,255,255,.14),0 14px 40px rgba(0,0,0,.45);background:#3f7f34}' +
'.hkg-stage canvas{display:block;image-rendering:pixelated;image-rendering:crisp-edges;touch-action:none;-webkit-user-select:none;user-select:none;cursor:pointer}' +
'.hkg-stage:after{content:"";position:absolute;left:0;right:0;top:0;height:76px;pointer-events:none;background:linear-gradient(rgba(8,20,12,.48),transparent)}' +
'.hkg-hud{position:absolute;left:0;right:0;top:0;z-index:2;display:flex;justify-content:space-between;align-items:flex-start;padding:8px 12px;pointer-events:none;font-family:var(--display,"Arial Black",system-ui,sans-serif);color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.5)}' +
'.hkg-score b{display:block;font-size:2.4rem;line-height:1;font-weight:900}' +
'.hkg-score span{display:block;font-size:.82rem;font-weight:700;color:#fff3c4;min-height:1.1em}' +
'.hkg-best{margin-top:4px;padding:4px 11px;border-radius:999px;background:rgba(0,0,0,.38);font-size:.9rem;font-weight:800;white-space:nowrap}' +
'.hkg-best b{color:#ffd76e;font-size:1.05rem}' +
'.hkg-best.hot{background:#ff8a3a;color:#1b1206;text-shadow:none}.hkg-best.hot b{color:#1b1206}' +
'.hkg-hint{position:absolute;left:50%;bottom:12px;z-index:2;transform:translateX(-50%);width:max-content;max-width:92%;padding:8px 14px;border-radius:12px;background:rgba(10,22,14,.78);color:#fff;font-size:.9rem;line-height:1.3;text-align:center;pointer-events:none;transition:opacity .5s}' +
'.hkg-hint.gone{opacity:0}' +
'.hkg-toast{position:absolute;left:50%;top:64px;z-index:3;transform:translateX(-50%);padding:6px 14px;border-radius:999px;background:#ffd76e;color:#1b1206;font-family:var(--display,"Arial Black",system-ui,sans-serif);font-weight:900;font-size:1rem;pointer-events:none;opacity:0;transition:opacity .35s}' +
'.hkg-toast.on{opacity:1}' +
'.hkg-card{position:absolute;left:50%;top:50%;z-index:4;transform:translate(-50%,-50%);width:min(88%,330px);padding:18px 18px 14px;border-radius:22px;background:#fffaf0;color:#15281c;text-align:center;border:4px solid #15281c;box-shadow:0 8px 0 rgba(0,0,0,.35),0 20px 50px rgba(0,0,0,.35)}' +
'.hkg-card[hidden]{display:none}' +
'.hkg-card canvas{width:56px;height:56px;image-rendering:pixelated;display:block;margin:0 auto 4px}' +
'.hkg-card h2{margin:0;font-family:var(--display,"Arial Black",system-ui,sans-serif);font-weight:900;font-size:2rem;line-height:1.05;letter-spacing:-.01em}' +
'.hkg-card p{margin:6px 0 0;font-size:1rem;line-height:1.4}' +
'.hkg-badge{display:inline-block;margin:0 0 8px;padding:4px 12px;border-radius:999px;background:#ffd76e;border:2px solid #15281c;font-family:var(--display,"Arial Black",system-ui,sans-serif);font-weight:900;font-size:.95rem}' +
'.hkg-pop{animation:hkgpop .55s cubic-bezier(.2,1.6,.4,1) both}' +
'@keyframes hkgpop{0%{transform:scale(.4) rotate(-8deg)}100%{transform:scale(1) rotate(-3deg)}}' +
'.hkg-nums{display:flex;justify-content:center;gap:12px;margin:12px 0 14px}' +
'.hkg-nums div{min-width:92px;padding:6px 10px;border-radius:14px;background:#eef6e4;border:2px solid #cfe3bd}' +
'.hkg-nums span{display:block;font-size:.8rem;font-weight:700;color:#3d5b47}' +
'.hkg-nums b{display:block;font-family:var(--display,"Arial Black",system-ui,sans-serif);font-size:1.7rem;line-height:1.1}' +
'.hkg-go{display:block;width:100%;min-height:58px;border-radius:16px;border:3px solid #15281c;background:#5ccf52;color:#0f2414;font-weight:900;font-size:1.45rem;box-shadow:0 5px 0 #15281c}' +
'.hkg-go:hover{background:#7ee070}.hkg-go:active{transform:translateY(3px);box-shadow:0 2px 0 #15281c}' +
'.hkg-c2{display:block;width:100%;margin-top:10px;min-height:44px;border-radius:14px;border:2px solid #9bb59a;background:transparent;color:#15281c;font-weight:800;font-size:1rem}' +
'.hkg-c2:hover{background:#eef6e4}' +
'.hkg-card.hkg-wide{width:min(94%,460px);max-height:calc(100% - 24px);overflow:auto;text-align:left}' +
'.hkg-card.hkg-wide h2{font-size:1.6rem;text-align:center}' +
'.hkg-qn{display:flex;justify-content:center;gap:8px;margin:2px 0 10px}' +
'.hkg-qn i{width:26px;height:10px;border-radius:99px;background:#d9e6cf;border:2px solid #15281c}' +
'.hkg-qn i.on{background:#5ccf52}' +
'.hkg-q{font-size:1.05rem;line-height:1.45;margin:0 0 10px}' +
'.hkg-q .extract{margin:8px 0;padding:8px 12px;border-radius:12px;background:#eef6e4;border-left:5px solid #5ccf52}' +
'.hkg-opts{display:grid;gap:8px}' +
'.hkg-opt{display:block;width:100%;min-height:48px;padding:8px 12px;border-radius:14px;border:3px solid #15281c;background:#fff;color:#15281c;font-weight:800;font-size:1.02rem;text-align:left;box-shadow:0 3px 0 #15281c}' +
'.hkg-opt:hover{background:#f3f9ec}.hkg-opt.ok{background:#5ccf52}.hkg-opt.no{background:#ffd0c4;text-decoration:line-through}' +
'.hkg-box{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin:0 0 10px;font-weight:800}' +
'.hkg-box input{width:9em;min-height:48px;padding:6px 10px;border-radius:12px;border:3px solid #15281c;font:inherit;font-size:1.2rem}' +
'.hkg-box input.no{background:#ffe3dc}.hkg-box input.ok{background:#dff6d6}' +
'.hkg-fb{margin:10px 0 0 !important;padding:8px 12px;border-radius:12px;background:#fff3c4;font-size:.98rem !important}' +
'.hkg-fb:empty{display:none}' +
'.hkg-card.hkg-wide .hkg-go{margin-top:12px}' +
'.hkg-tip{font-size:.82rem !important;color:#5a7062;margin-top:8px !important}' +
'.hkg-pad{display:flex;gap:10px;margin-top:10px;flex:none}' +
'.hkg-pad button{width:66px;height:56px;border-radius:16px;border:2px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);color:#fff;font-size:1.35rem;line-height:1;touch-action:manipulation;box-shadow:0 4px 0 rgba(0,0,0,.35)}' +
'.hkg-pad button:active{transform:translateY(3px);box-shadow:0 1px 0 rgba(0,0,0,.35);background:rgba(255,255,255,.22)}' +
'.hkg-pad .hkg-up{background:#5ccf52;color:#0f2414;border-color:#2c8f43;width:84px}' +
'@media (max-height:560px){.hkg-pad button{height:44px}.hkg-bar{padding:6px 12px}.hkg-tb,.hkg-x{min-height:40px}}' +
'@media (max-width:440px){.hkg-tb{padding:8px 10px;font-size:.85rem}.hkg-title span{display:none}}' +
'@media (prefers-reduced-motion:reduce){.hkg-pop{animation:none;transform:rotate(-3deg)}.hkg-hint,.hkg-toast{transition:none}}' +
/* the launcher that sits in the hero */
'.hkgame-launch{display:flex;flex-direction:column;align-items:flex-start;gap:8px;margin:18px 0 0}' +
'.hkgame-open{display:inline-flex;align-items:center;gap:12px;cursor:pointer;font-family:var(--display,"Arial Black",system-ui,sans-serif);font-weight:800;font-size:1.08rem;' +
'padding:10px 18px 10px 12px;border-radius:16px;border:3px solid #15281c;background:linear-gradient(#6fd864,#45b33d);color:#0f2414;box-shadow:0 5px 0 #15281c;transition:transform .12s}' +
'.hkgame-open:hover{transform:translateY(-2px)}.hkgame-open:active{transform:translateY(3px);box-shadow:0 2px 0 #15281c}' +
'.hkgame-open:focus-visible{outline:3px solid #ffd76e;outline-offset:3px}' +
'.hkgame-open canvas{width:34px;height:34px;image-rendering:pixelated;background:#fffaf0;border-radius:9px;border:2px solid #15281c;padding:2px}' +
'.hkgame-note{margin:0;font-size:.95rem;opacity:.9}' +
'@media (prefers-reduced-motion:reduce){.hkgame-open{transition:none}}';
(document.head || document.documentElement).appendChild(css);

/* ---------- audio (only after a tap or key press) ---------- */
var AC = null, master = null, noiseBuf = null;
function unlockAudio() {
  if (AC) { if (AC.state === 'suspended') { try { AC.resume(); } catch (e) {} } return; }
  var C = window.AudioContext || window.webkitAudioContext;
  if (!C) return;
  try {
    AC = new C();
    master = AC.createGain(); master.gain.value = 0.2; master.connect(AC.destination);
    noiseBuf = AC.createBuffer(1, AC.sampleRate, AC.sampleRate);
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
    o.type = type || 'square';
    o.frequency.setValueAtTime(f0, t);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.03);
  } catch (e) {}
}
function hiss(dur, f0, f1, vol, attack, delay) {
  if (!canPlay() || !noiseBuf) return;
  try {
    var t = AC.currentTime + (delay || 0);
    var s = AC.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    var f = AC.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    var g = AC.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + (attack || 0.01));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t); s.stop(t + dur + 0.05);
  } catch (e) {}
}
function sfx(n, v) {
  v = v == null ? 1 : v;
  if (n === 'hop') tone(430, 660, 0.06, 'square', 0.035);
  else if (n === 'bump') tone(170, 120, 0.07, 'triangle', 0.08);
  else if (n === 'plop') tone(260, 190, 0.06, 'triangle', 0.07);
  else if (n === 'bone') { tone(988, 0, 0.07, 'square', 0.04); tone(1480, 0, 0.12, 'square', 0.04, 0.07); }
  else if (n === 'splash') { hiss(0.45, 2600, 260, 0.32); tone(320, 90, 0.22, 'sine', 0.12); }
  else if (n === 'honk') { tone(330, 322, 0.13, 'sawtooth', 0.035 * v); tone(415, 405, 0.13, 'sawtooth', 0.03 * v); tone(330, 322, 0.16, 'sawtooth', 0.035 * v, 0.17); tone(415, 405, 0.16, 'sawtooth', 0.03 * v, 0.17); }
  else if (n === 'thud') { tone(150, 48, 0.28, 'sine', 0.3); hiss(0.18, 900, 120, 0.18); }
  else if (n === 'rumble') hiss(1.9, 220, 90, 0.5 * v, 0.5);
  else if (n === 'best') { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0, 0.16, 'square', 0.04, i * 0.09); }); }
}

/* ---------- game state ---------- */
var G = null, P = null;
var state = 'closed';          /* closed, play, dying, over, paused */
var LH = 240;                  /* art pixels tall, set by layout */
var ui = {}, off = null, octx = null, ctx = null, raf = 0, lastTs = 0, overAt = 0;
var prevOverflow = '', opener = null;

function newGame() {
  G = {
    rows: {}, next: -16, chunk: null, riverDir: 1,
    maxRow: 0, minRow: 0, bones: 0, bonePts: 0, t: 0, cam: 0, shake: 0,
    parts: [], floats: [], dead: null, deadT: 0, toastDone: store.best === 0,
    startBest: store.best, hopped: false, honkT: 0, newBest: false
  };
  P = { x: 4, row: 0, hop: null, face: 1, log: null, queued: null, land: 0, bump: 0, bumpDir: 0, blinkT: 2 };
  genUpTo(32);
  G.cam = camTarget(0);
}

/* ---------- lane generation ---------- */
function genUpTo(R) { while (G.next <= R) { G.rows[G.next] = newRow(G.next); G.next++; } }
function newRow(r) {
  if (r < 0) return forestRow(r);
  if (r < 3) return grassRow(r, true);
  if (!G.chunk || G.chunk.left <= 0) G.chunk = pickChunk(r);
  G.chunk.left--;
  var t = G.chunk.type;
  if (t === 'grass') return grassRow(r, false);
  if (t === 'road') return roadRow(r);
  if (t === 'river') return riverRow(r);
  return stampRow(r);
}
function pickChunk(r) {
  var d = diff(r);
  var last = G.chunk ? G.chunk.type : 'grass';
  if (last !== 'grass' && Math.random() < 0.82 - 0.3 * d) return { type: 'grass', left: Math.random() < 0.4 - 0.2 * d ? 2 : 1 };
  var stampP = r < 9 ? 0 : 0.13 + 0.1 * d;
  if (last !== 'stamp' && Math.random() < stampP) return { type: 'stamp', left: 1 };
  var road = Math.random() < 0.56;
  if (last === 'road') road = false; else if (last === 'river') road = true;
  if (road) return { type: 'road', left: Math.min(4, 1 + Math.floor(Math.random() * (1.7 + 2.6 * d))) };
  return { type: 'river', left: Math.min(3, 1 + Math.floor(Math.random() * (1.5 + 1.8 * d))) };
}
function forestRow(r) {
  var row = { r: r, type: 'grass', block: [], paved: false, bone: -1, reach: [] };
  for (var c = 0; c < COLS; c++) row.block[c] = (hash(r, c) % 7 === 0) ? 'rubble' : 'tree';
  return row;
}
function grassRow(r, safe) {
  var row = { r: r, type: 'grass', block: [], paved: !safe && Math.random() < 0.3, bone: -1, reach: [] };
  var c, i;
  for (c = 0; c < COLS; c++) { row.block[c] = 0; row.reach[c] = true; }
  if (safe) return row;
  var d = diff(r), p = 0.15 + 0.15 * d;
  var below = G.rows[r - 1];
  var belowGrass = below && below.type === 'grass';
  var needFree = (below && below.type === 'river') ? 4 : 3;
  for (var tries = 0; tries < 40; tries++) {
    var free = 0;
    for (c = 0; c < COLS; c++) {
      row.block[c] = Math.random() < p ? obstacleKind(row.paved) : 0;
      if (!row.block[c]) free++;
    }
    if (free < needFree) continue;
    if (!computeReach(row, belowGrass ? below : null)) continue;
    break;
  }
  if (tries >= 40) { for (c = 0; c < COLS; c++) { row.block[c] = 0; row.reach[c] = true; } }
  if (Math.random() < 0.3) {
    var opts = [];
    for (i = 0; i < COLS; i++) if (!row.block[i] && row.reach[i]) opts.push(i);
    if (opts.length) row.bone = pick(opts);
  }
  return row;
}
/* which free tiles can be reached from the row below; false if none */
function computeReach(row, below) {
  var c, any = false;
  for (c = 0; c < COLS; c++) row.reach[c] = !row.block[c] && (!below || (below.reach[c] && !below.block[c]));
  /* spread sideways through connected free tiles */
  for (var pass = 0; pass < 2; pass++) {
    for (c = 1; c < COLS; c++) if (row.reach[c - 1] && !row.block[c]) row.reach[c] = true;
    for (c = COLS - 2; c >= 0; c--) if (row.reach[c + 1] && !row.block[c]) row.reach[c] = true;
  }
  for (c = 0; c < COLS; c++) if (row.reach[c]) any = true;
  return any;
}
function obstacleKind(paved) {
  var x = Math.random();
  if (paved) return x < 0.38 ? 'rubble' : x < 0.7 ? 'wreck' : x < 0.86 ? 'lamp' : 'tree';
  return x < 0.55 ? 'tree' : x < 0.75 ? 'rubble' : x < 0.9 ? 'wreck' : 'lamp';
}
function spread(items, x0, avgGap) {
  if (!items.length) return items;
  var last = items[items.length - 1];
  var extra = (x0 + SPAN) - (last.x + last.len) - avgGap;
  if (extra > 0) { var per = extra / items.length; for (var i = 0; i < items.length; i++) items[i].x += i * per; }
  return items;
}
var CARS = [
  ['#e94f37', '#ff9a80', '#a8311f'], ['#ffb627', '#ffe08a', '#c4830b'], ['#22b8ab', '#8ff0e6', '#147f76'],
  ['#5867d6', '#a6b0ff', '#38449c'], ['#f27fae', '#ffc6dc', '#b84f7d'], ['#8a5bd0', '#c9a8ff', '#5d3a96']
];
var VANS = [['#f1ede0', '#ffffff', '#b9b29c', '#ef7724'], ['#2f6fb8', '#79aef0', '#1f4c80', '#ffd76e'], ['#e0c13a', '#fff08a', '#a88c16', '#15281c']];
function roadRow(r) {
  var d = diff(r);
  var row = { r: r, type: 'road', dir: Math.random() < 0.5 ? 1 : -1, items: [], bone: -1 };
  var vanLane = Math.random() < 0.3;
  row.speed = (1.35 + 2.1 * d) * rnd(0.78, 1.22) * (vanLane ? 0.85 : 1);
  var x0 = XMIN + Math.random() * 2, x = x0, gMin = 2.6, gMax = 6.2 - 2.4 * d;
  for (var k = 0; k < 20; k++) {
    var van = vanLane ? Math.random() < 0.75 : Math.random() < 0.12;
    var it = van ? { len: 2, van: true, pal: pick(VANS) } : { len: 1.25, van: false, pal: pick(CARS) };
    if (x + it.len + gMin > x0 + SPAN) break;
    it.x = x; row.items.push(it);
    x += it.len + rnd(gMin, gMax);
  }
  spread(row.items, x0, (gMin + gMax) / 2);
  if (Math.random() < 0.07) row.bone = irnd(0, COLS - 1);
  return row;
}
function riverRow(r) {
  var d = diff(r);
  G.riverDir = -G.riverDir;
  var row = { r: r, type: 'river', dir: G.riverDir, items: [], bone: -1 };
  row.speed = (0.75 + 1.05 * d) * rnd(0.8, 1.2);
  var rafts = Math.random() < 0.3;
  var x0 = XMIN + Math.random() * 2, x = x0, gMin = 1.2, gMax = 2.3 + 1.2 * d;
  for (var k = 0; k < 20; k++) {
    var it = rafts ? { len: 2, raft: true } : { len: irnd(2, d < 0.4 ? 4 : 3), raft: false };
    it.seed = irnd(0, 9999);
    if (x + it.len + gMin > x0 + SPAN) break;
    it.x = x; row.items.push(it);
    x += it.len + rnd(gMin, gMax);
  }
  spread(row.items, x0, (gMin + gMax) / 2);
  return row;
}
function stampRow(r) {
  var d = diff(r);
  return {
    r: r, type: 'stamp', dir: Math.random() < 0.5 ? 1 : -1, bone: -1,
    phase: 'idle', t: rnd(1.5, 4.5), warnT: 1.7 - 0.45 * d, speed: 11 + 4 * d, herd: []
  };
}

/* ---------- update ---------- */
function updateRow(row, dt) {
  var i, it;
  if (row.type === 'road' || row.type === 'river') {
    var dx = row.dir * row.speed * dt;
    for (i = 0; i < row.items.length; i++) {
      it = row.items[i]; it.x += dx;
      if (row.dir > 0 && it.x > XMIN + SPAN) it.x -= SPAN;
      else if (row.dir < 0 && it.x < XMIN) it.x += SPAN;
    }
  } else if (row.type === 'stamp') {
    if (row.phase === 'idle') {
      row.t -= dt;
      if (row.t <= 0) {
        row.phase = 'warn'; row.t = row.warnT;
        var dist = Math.abs(row.r - (P ? P.row : 0));
        if (state === 'play' && dist <= 7) sfx('rumble', 1 - dist / 9);
      }
    } else if (row.phase === 'warn') {
      row.t -= dt;
      if (row.t <= 0) {
        row.phase = 'run'; row.herd = [];
        var n = irnd(3, 5), pos = row.dir > 0 ? -2.2 : COLS + 0.2;
        for (i = 0; i < n; i++) {
          row.herd.push({ x: pos, pal: i % 3, ph: Math.random() * 6 });
          pos += (row.dir > 0 ? -1 : 1) * rnd(2.05, 2.6);
        }
      }
    } else {
      var done = true;
      for (i = 0; i < row.herd.length; i++) {
        it = row.herd[i]; it.x += row.dir * row.speed * dt;
        if (row.dir > 0 ? it.x < COLS + 0.5 : it.x > -2.5) done = false;
        if (!RM && Math.random() < dt * 14 && it.x > -1.5 && it.x < COLS) {
          addPart((it.x + (row.dir > 0 ? 0.2 : 1.6)) * TS, -row.r * TS + 13, rnd(-10, 10) - row.dir * 18, rnd(-14, -4), 30, 0.5, '#e2c48e', 2);
        }
      }
      if (done) { row.phase = 'idle'; row.herd = []; row.t = rnd(3.2, 7); }
    }
  }
}

function visRow() { return P.hop ? lerp(P.hop.fr, P.hop.tr, P.hop.t) : P.row; }
function playerX() { return P.hop ? lerp(P.hop.fx, P.hop.tx, P.hop.t) : P.x; }
function camTarget(vr) { return -vr * TS - Math.round(LH * 0.66); }

function update(dt) {
  G.t += dt;
  for (var k in G.rows) updateRow(G.rows[k], dt);
  if (state === 'play') updatePlayer(dt);
  if (P.land > 0) P.land = Math.max(0, P.land - dt * 7);
  if (P.bump > 0) P.bump = Math.max(0, P.bump - dt * 8);
  P.blinkT -= dt; if (P.blinkT < -0.14) P.blinkT = rnd(2, 4.5);
  if (G.honkT > 0) G.honkT -= dt;
  /* particles */
  for (var i = G.parts.length - 1; i >= 0; i--) {
    var p = G.parts[i];
    p.life -= dt;
    if (p.life <= 0) { G.parts.splice(i, 1); continue; }
    p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
  }
  for (i = G.floats.length - 1; i >= 0; i--) { G.floats[i].life -= dt; G.floats[i].y -= dt * 14; if (G.floats[i].life <= 0) G.floats.splice(i, 1); }
  /* camera */
  var tgt = camTarget(visRow());
  G.cam += (tgt - G.cam) * (1 - Math.exp(-dt * (RM ? 14 : 7)));
  if (G.shake > 0) G.shake = Math.max(0, G.shake - dt * 14);
  if (state === 'dying') { G.deadT -= dt; if (G.deadT <= 0) showOver(); }
  /* keep rows ahead, forget rows far behind */
  genUpTo(Math.max(P.row, G.maxRow) + 30);
  var cut = G.maxRow - 24;
  for (k in G.rows) if (+k < cut) delete G.rows[k];
}

function updatePlayer(dt) {
  if (P.hop) {
    P.hop.t += dt / HOP;
    if (P.hop.t >= 1) { landHop(); if (state !== 'play') return; }
  } else if (P.log) {
    var row = G.rows[P.row];
    P.x += row.dir * row.speed * dt;
    if (P.x < -0.45 || P.x > COLS - 0.55) { die('drift'); return; }
  }
  checkHits();
}

function checkHits() {
  var vr = P.hop ? (P.hop.t < 0.5 ? P.hop.fr : P.hop.tr) : P.row;
  var row = G.rows[vr];
  if (!row) return;
  var px = playerX(), a = px + 0.22, b = px + 0.78, i, m;
  if (row.type === 'road') {
    for (i = 0; i < row.items.length; i++) {
      m = row.items[i];
      if (b > m.x + 0.08 && a < m.x + m.len - 0.08) { die('squash', vr, px); return; }
    }
  } else if (row.type === 'stamp' && row.phase === 'run') {
    for (i = 0; i < row.herd.length; i++) {
      m = row.herd[i];
      if (b > m.x + 0.15 && a < m.x + 1.6) { die('stamp', vr, px); return; }
    }
  }
}

function findLog(row, x) {
  var c = x + 0.5;
  for (var i = 0; i < row.items.length; i++) {
    var it = row.items[i];
    if (c >= it.x - 0.12 && c <= it.x + it.len + 0.12) return it;
  }
  return null;
}

function tryMove(dx, dr) {
  if (state === 'paused') { resume(); return; }
  if (state !== 'play') return;
  if (P.hop) { if (P.hop.t > 0.35) P.queued = [dx, dr]; return; }
  if (!G.hopped) { G.hopped = true; if (ui.hint) ui.hint.className = 'hkg-hint gone'; }
  if (dx) P.face = dx;
  var fr = P.row, fx = P.x, tr = fr + dr, tx;
  var dst = G.rows[tr];
  if (!dst || tr < G.minRow) { bump(dx, dr); return; }
  if (dst.type === 'river') {
    tx = fx + dx;
    if (tx < -0.45 || tx > COLS - 0.55) { bump(dx, dr); return; }
  } else {
    tx = Math.round(fx + dx);
    if (tx < 0 || tx > COLS - 1) { bump(dx, dr); return; }
    if (dst.type === 'grass' && dst.block[tx]) { bump(dx, dr); return; }
  }
  P.log = null;
  P.hop = { fx: fx, fr: fr, tx: tx, tr: tr, t: 0 };
  sfx('hop');
}
function bump(dx, dr) {
  P.bump = 1; P.bumpDir = dx || 0;
  sfx('bump');
}

function landHop() {
  var h = P.hop; P.hop = null;
  P.row = h.tr; P.x = h.tx; P.land = 1;
  var row = G.rows[P.row];
  if (row.type === 'river') {
    var lg = findLog(row, P.x);
    if (!lg) { die('splash'); return; }
    P.log = lg; sfx('plop');
  } else {
    P.x = Math.round(P.x);
    if (!RM && row.type === 'grass') {
      for (var i = 0; i < 3; i++) addPart((P.x + 0.5) * TS + rnd(-4, 4), -P.row * TS + 14, rnd(-16, 16), rnd(-18, -6), 50, 0.35, '#c9f2a0', 1);
    }
  }
  if (P.row > G.maxRow) {
    G.maxRow = P.row; G.minRow = Math.max(0, G.maxRow - 10);
    if (!G.toastDone && score() > G.startBest) { G.toastDone = true; toast('New best!'); sfx('best'); }
  }
  if (row.bone >= 0 && row.type !== 'river' && row.bone === P.x) {
    row.bone = -1; G.bones++; G.bonePts += 2;
    sfx('bone');
    G.floats.push({ x: (P.x + 0.5) * TS, y: -P.row * TS - 4, life: 0.8, txt: '+2' });
    if (!RM) for (var j = 0; j < 6; j++) addPart((P.x + 0.5) * TS, -P.row * TS + 8, rnd(-30, 30), rnd(-50, -20), 90, 0.5, '#fff6dc', 1);
  }
  if (row.type === 'road' && G.honkT <= 0) {
    for (var k = 0; k < row.items.length; k++) {
      var m = row.items[k];
      var ahead = row.dir > 0 ? P.x - (m.x + m.len) : m.x - (P.x + 1);
      if (ahead > 0 && ahead < 2.2) { sfx('honk', 0.7); G.honkT = 2.5; break; }
    }
  }
  updateHud();
  if (P.queued && state === 'play') { var q = P.queued; P.queued = null; tryMove(q[0], q[1]); }
}

function score() { return G.maxRow + G.bonePts; }

function addPart(x, y, vx, vy, g, life, c, s) {
  if (G.parts.length > 260) return;
  G.parts.push({ x: x, y: y, vx: vx, vy: vy, g: g, life: life, max: life, c: c, s: s || 1 });
}

var MSG = {
  squash: { t: 'Squashed!', col: '#e2541f', m: ['That car was in a real hurry.', 'Who knew a ruined town still had traffic?', 'Flat as a pancake, but still smiling.', 'Beep beep. The van won that one.'] },
  splash: { t: 'Splash!', col: '#1f86d1', m: ['Turns out this dino is not a swimmer.', 'Into the river. Quite refreshing, really.', 'Missed the log by a claw.'] },
  drift: { t: 'Splash!', col: '#1f86d1', m: ['The log drifted right off the edge.', 'Nice ride, shame about the ending.'] },
  stamp: { t: 'Stampeded!', col: '#8a4fb5', m: ['The herd had somewhere to be.', 'That was a lot of very big feet.', 'Big dinos, small dino. Big dinos win.'] }
};

function die(kind, vr, px) {
  if (state !== 'play') return;
  if (P.hop) { P.row = vr != null ? vr : P.hop.tr; P.x = px != null ? px : P.hop.tx; P.hop = null; }
  P.log = null; P.queued = null;
  state = 'dying'; G.dead = kind;
  G.deadT = (kind === 'splash' || kind === 'drift') ? 0.6 : 0.55;
  var cx = (clamp(P.x, -0.3, COLS - 0.7) + 0.5) * TS, cy = -P.row * TS + 8, i;
  if (kind === 'squash') {
    sfx('honk'); sfx('thud'); G.shake = RM ? 0 : 3;
    for (i = 0; i < (RM ? 4 : 12); i++) addPart(cx, cy + 4, rnd(-50, 50), rnd(-60, -10), 120, 0.6, pick(['#ffffff', '#ffd76e', '#5ccf52']), 1);
  } else if (kind === 'stamp') {
    sfx('thud'); G.shake = RM ? 0 : 5;
    for (i = 0; i < (RM ? 6 : 26); i++) addPart(cx + rnd(-8, 8), cy + 4, rnd(-60, 60), rnd(-50, -5), 40, rnd(0.5, 0.9), pick(['#e2c48e', '#cfae72', '#f3e2bc']), 2);
  } else {
    sfx('splash');
    for (i = 0; i < (RM ? 6 : 22); i++) addPart(cx, cy + 2, rnd(-45, 45), rnd(-95, -30), 220, rnd(0.45, 0.8), pick(['#ffffff', '#bfe8ff', '#7cc8f0']), Math.random() < 0.3 ? 2 : 1);
  }
  var s = score();
  G.newBest = s > store.best;
  if (G.newBest) store.best = s;
  store.games++;
  saveStore();
  updateHud();
}

/* ---------- drawing ---------- */
var g2 = null;
function R(x, y, w, h, c) { g2.fillStyle = c; g2.fillRect(Math.round(x), Math.round(y), w, h); }

function render() {
  if (!octx) return;
  g2 = octx;
  var cam = Math.round(G.cam);
  var rTop = Math.floor((TS - cam) / TS) + 1;
  var rBot = Math.ceil(-(cam + LH) / TS) - 1;
  var r, y, row;
  g2.fillStyle = '#3f7f34'; g2.fillRect(0, 0, LW, LH);
  for (r = rTop; r >= rBot; r--) {
    y = -r * TS - cam;
    row = G.rows[r] || forestFallback(r);
    drawGround(row, r, y);
  }
  var vr = visRow(), pr = Math.round(vr);
  for (r = rTop; r >= rBot; r--) {
    y = -r * TS - cam;
    row = G.rows[r] || forestFallback(r);
    drawObjects(row, r, y);
    if (r === pr) drawPlayer(cam);
  }
  /* particles and floating numbers */
  for (var i = 0; i < G.parts.length; i++) {
    var p = G.parts[i];
    R(p.x - p.s / 2, p.y - cam - p.s / 2, p.s, p.s, p.c);
  }
  for (i = 0; i < G.floats.length; i++) drawText(G.floats[i].txt, G.floats[i].x, G.floats[i].y - cam);
  /* blit up to the screen, crisp */
  var dpr = ui.ds || 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.imageSmoothingEnabled = false;
  var sx = 0, sy = 0;
  if (G.shake > 0 && !RM) { sx = Math.round(rnd(-1, 1) * G.shake * dpr); sy = Math.round(rnd(-1, 1) * G.shake * dpr); }
  if (sx || sy) { ctx.fillStyle = '#2d5e27'; ctx.fillRect(0, 0, ui.canvas.width, ui.canvas.height); }
  ctx.drawImage(off, 0, 0, LW, LH, sx, sy, ui.canvas.width, ui.canvas.height);
}
var FALL = {};
function forestFallback(r) { if (!FALL[r]) FALL[r] = forestRow(r); return FALL[r]; }

function drawText(txt, cx, y) {
  var w = txt.length * 4 - 1, x0 = Math.round(cx - w / 2), i, j, k;
  for (var pass = 0; pass < 2; pass++) {
    for (k = 0; k < txt.length; k++) {
      var f = FONT[txt.charAt(k)]; if (!f) continue;
      for (j = 0; j < 5; j++) for (i = 0; i < 3; i++) if (f.charAt(j * 3 + i) === '1') {
        if (pass === 0) R(x0 + k * 4 + i, y + j + 1, 1, 1, '#15281c');
        else R(x0 + k * 4 + i, y + j, 1, 1, '#ffd76e');
      }
    }
  }
}

function drawGround(row, r, y) {
  var c, h, x, up = G.rows[r + 1] || forestFallback(r + 1), dn = G.rows[r - 1] || forestFallback(r - 1);
  if (row.type === 'grass') {
    R(0, y, LW, TS, (r & 1) ? '#6cc24c' : '#64b945');
    for (c = 0; c < COLS; c++) {
      h = hash(r, c); x = c * TS;
      if (row.paved) {
        R(x + 1, y + 1, 14, 14, (h & 1) ? '#a9ab9f' : '#a0a297');
        R(x + 1, y + 1, 14, 1, '#bfc1b5');
        R(x + 1, y + 14, 14, 1, '#8a8c82');
        if (h % 3 === 0) { R(x + 4 + (h % 5), y + 3, 1, 4, '#7d7f75'); R(x + 5 + (h % 5), y + 7, 1, 3, '#7d7f75'); R(x + 3 + (h % 5), y + 9, 3, 1, '#5fae47'); }
        if (h % 4 === 1) { R(x + 2, y + 11, 2, 1, '#4f9e3c'); R(x + 3, y + 10, 1, 1, '#6cc24c'); }
      } else {
        if (h % 5 === 0) { R(x + 3 + (h % 7), y + 5 + (h % 5), 1, 2, '#4f9e3c'); R(x + 4 + (h % 7), y + 4 + (h % 5), 1, 3, '#4f9e3c'); R(x + 5 + (h % 7), y + 5 + (h % 5), 1, 2, '#4f9e3c'); }
        if (h % 9 === 2) { R(x + 9, y + 9, 1, 1, pick2(h, ['#ffd84a', '#ff8fb1', '#ffffff', '#b38cff'])); R(x + 8, y + 9, 1, 1, '#4f9e3c'); }
        if (h % 13 === 4) { R(x + 2, y + 12, 1, 1, '#ffd84a'); }
        if (h % 6 === 3) R(x + 10, y + 2, 3, 1, (r & 1) ? '#77cc57' : '#70c150');
      }
    }
    if (up.type === 'river') R(0, y, LW, 1, '#4d9a3a');
    if (dn.type === 'road' || dn.type === 'river' || dn.type === 'stamp') { R(0, y + TS - 2, LW, 2, '#4f9e3c'); }
  } else if (row.type === 'road') {
    R(0, y, LW, TS, '#464953');
    for (c = 0; c < COLS; c++) {
      h = hash(r, c + 50); x = c * TS;
      if (h % 4 === 0) { R(x + 3 + (h % 9), y + 6, 3, 1, '#3a3c45'); R(x + 5 + (h % 9), y + 7, 1, 2, '#3a3c45'); }
      if (h % 7 === 1) { R(x + 6 + (h % 5), y + 9, 1, 2, '#58b146'); R(x + 7 + (h % 5), y + 8, 1, 2, '#6cc24c'); }
      if (h % 11 === 5) R(x + 2, y + 4, 5, 3, '#4e515b');
    }
    if (up.type === 'road') {
      for (x = 3; x < LW; x += 16) R(x, y, 8, 1, '#c9c19a');
    } else {
      R(0, y, LW, 2, '#9b9d92'); R(0, y + 2, LW, 1, '#33353d');
      for (x = 0; x < LW; x += 8) R(x, y, 1, 2, '#83857b');
    }
    if (dn.type !== 'road') { R(0, y + TS - 2, LW, 2, '#9b9d92'); for (x = 4; x < LW; x += 8) R(x, y + TS - 2, 1, 2, '#83857b'); }
  } else if (row.type === 'river') {
    R(0, y, LW, TS, '#3a9fdb');
    R(0, y + 6, LW, 4, '#379ad5');
    var drift = RM ? 0 : G.t * row.dir * row.speed * 6;
    for (var i = 0; i < 7; i++) {
      h = hash(r, i + 90);
      var xx = ((h % LW) + drift) % LW; if (xx < 0) xx += LW;
      R(xx, y + 3 + (i % 3) * 4, 4, 1, '#7cc8f0');
      R(xx + 1, y + 4 + (i % 3) * 4, 2, 1, '#5db5ea');
    }
    if (up.type !== 'river') { R(0, y, LW, 2, '#2a7fb8'); }
    if (dn.type !== 'river') { R(0, y + TS - 1, LW, 1, '#a9defa'); }
  } else if (row.type === 'stamp') {
    R(0, y, LW, TS, '#cda96d');
    R(0, y + 4, LW, 1, '#b8945a'); R(0, y + 11, LW, 1, '#b8945a');
    for (c = 0; c < COLS; c++) {
      h = hash(r, c + 200); x = c * TS + (h % 6);
      if (h % 2 === 0) { R(x + 2, y + 6, 3, 2, '#a98450'); R(x + 1, y + 5, 1, 1, '#a98450'); R(x + 3, y + 4, 1, 1, '#a98450'); R(x + 5, y + 5, 1, 1, '#a98450'); }
      if (h % 5 === 1) R(x + 9, y + 13, 2, 1, '#e6cb98');
    }
    for (x = 1; x < LW; x += 7) { R(x, y, 2, 1, '#9c7d4b'); R(x + 3, y + TS - 1, 2, 1, '#9c7d4b'); }
    if (row.phase !== 'idle') {
      var on = RM ? true : (Math.floor(G.t * 8) % 2 === 0);
      if (on) { g2.fillStyle = row.phase === 'warn' ? 'rgba(255,70,40,0.30)' : 'rgba(255,70,40,0.16)'; g2.fillRect(0, y, LW, TS); }
    }
  }
}
function pick2(h, a) { return a[(h >>> 4) % a.length]; }

function drawObjects(row, r, y) {
  var i, c, x;
  if (row.type === 'grass') {
    for (c = 0; c < COLS; c++) if (row.block[c]) drawObstacle(row.block[c], c * TS, y, hash(r, c));
    if (row.bone >= 0) drawBone(row.bone * TS, y, r);
  } else if (row.type === 'road') {
    if (row.bone >= 0) drawBone(row.bone * TS, y, r);
    for (i = 0; i < row.items.length; i++) {
      x = row.items[i].x;
      if (x > COLS + 0.5 || x + row.items[i].len < -0.5) continue;
      drawCar(row.items[i], Math.round(x * TS), y, row.dir);
    }
  } else if (row.type === 'river') {
    for (i = 0; i < row.items.length; i++) {
      x = row.items[i].x;
      if (x > COLS + 0.5 || x + row.items[i].len < -0.5) continue;
      if (row.items[i].raft) drawRaft(row.items[i], Math.round(x * TS), y);
      else drawLog(row.items[i], Math.round(x * TS), y);
    }
  } else if (row.type === 'stamp') {
    drawSign(1, y, row);
    drawSign(LW - 9, y, row);
    for (i = 0; i < row.herd.length; i++) {
      x = row.herd[i].x;
      if (x > COLS + 0.5 || x < -2.5) continue;
      drawHerdDino(Math.round(x * TS) - 3, y - 5, row.dir, row.herd[i]);
    }
  }
}

function shadow(x, y, w) { g2.fillStyle = 'rgba(10,30,10,0.22)'; g2.fillRect(Math.round(x) + 1, Math.round(y), w - 2, 1); g2.fillRect(Math.round(x), Math.round(y) + 1, w, 1); }

var TREES = [['#1f6e33', '#2f8f3f', '#58b84c', '#7fd26a'], ['#1b6650', '#2a8a68', '#4fb58a', '#7fdcb0'], ['#2b6b26', '#3f8f2c', '#6dbb3a', '#a6e05a']];
function drawObstacle(kind, x, y, h) {
  if (kind === 'tree') {
    var t = TREES[h % 3];
    shadow(x + 1, y + 13, 14);
    R(x + 6, y + 8, 4, 6, '#6b4423'); R(x + 6, y + 8, 1, 6, '#875a30');
    R(x + 2, y - 5, 12, 13, t[1]);
    R(x + 1, y - 3, 14, 9, t[1]);
    R(x + 4, y - 7, 8, 2, t[1]);
    R(x + 1, y + 4, 14, 2, t[0]); R(x + 3, y + 6, 10, 2, t[0]);
    R(x + 4, y - 5, 4, 3, t[2]); R(x + 3, y - 3, 2, 2, t[2]); R(x + 9, y - 1, 3, 2, t[2]);
    R(x + 5, y - 5, 2, 1, t[3]);
    if (h % 4 === 0) { R(x + 10, y - 4, 1, 1, '#ff8fb1'); R(x + 4, y + 1, 1, 1, '#ff8fb1'); R(x + 12, y + 2, 1, 1, '#ffd84a'); }
    if (h % 3 === 1) { R(x + 1, y + 6, 1, 4, t[1]); R(x + 14, y + 5, 1, 3, t[1]); }
  } else if (kind === 'rubble') {
    shadow(x + 1, y + 13, 14);
    R(x + 7, y + 3, 7, 10, '#b4b7ad'); R(x + 7, y + 3, 7, 2, '#d3d5cb'); R(x + 13, y + 5, 1, 8, '#8e9188');
    R(x + 2, y + 7, 7, 7, '#a1a49a'); R(x + 2, y + 7, 7, 2, '#c5c8bd'); R(x + 8, y + 9, 1, 5, '#7f8279');
    R(x + 5, y + 11, 8, 3, '#8f9289'); R(x + 5, y + 11, 8, 1, '#b2b5aa');
    R(x + 11, y - 1, 1, 5, '#9a4f2a'); R(x + 12, y - 2, 1, 2, '#9a4f2a');
    R(x + 3, y + 7, 3, 1, '#5aa845'); R(x + 9, y + 3, 2, 1, '#5aa845'); R(x + 2, y + 8, 1, 2, '#5aa845');
    if (h % 2) { R(x + 4, y + 5, 1, 2, '#4f9e3c'); R(x + 3, y + 4, 1, 1, '#6cc24c'); }
  } else if (kind === 'wreck') {
    shadow(x, y + 13, 16);
    R(x + 1, y + 5, 14, 8, '#b4562a'); R(x + 1, y + 5, 14, 1, '#d0743f');
    R(x + 4, y + 1, 8, 5, '#c4652f'); R(x + 4, y + 1, 8, 1, '#dc8547');
    R(x + 5, y + 2, 6, 3, '#2b3a40'); R(x + 6, y + 2, 2, 1, '#8fb8c6'); R(x + 9, y + 3, 1, 1, '#8fb8c6');
    R(x + 3, y + 8, 2, 2, '#7a3518'); R(x + 10, y + 9, 3, 1, '#7a3518'); R(x + 7, y + 7, 1, 1, '#7a3518');
    R(x + 2, y + 12, 4, 2, '#22242a'); R(x + 10, y + 12, 4, 2, '#22242a');
    R(x + 1, y + 6, 1, 6, '#3f9a3a'); R(x + 2, y + 9, 1, 3, '#3f9a3a'); R(x + 6, y + 3, 1, 4, '#3f9a3a');
    R(x + 5, y + 4, 1, 1, '#6cc24c'); R(x + 12, y + 1, 1, 6, '#3f9a3a'); R(x + 13, y + 3, 1, 1, '#6cc24c');
    R(x + 14, y + 7, 1, 1, '#fff2a8');
  } else if (kind === 'lamp') {
    shadow(x + 4, y + 13, 8);
    R(x + 5, y + 12, 6, 2, '#4a525a');
    R(x + 7, y - 7, 2, 19, '#5d6670'); R(x + 7, y - 7, 1, 19, '#77818b');
    R(x + 4, y - 9, 8, 3, '#5d6670'); R(x + 5, y - 7, 6, 1, '#ffe08a');
    R(x + 6, y - 2, 1, 2, '#46a43c'); R(x + 9, y + 1, 1, 2, '#46a43c'); R(x + 6, y + 4, 1, 2, '#46a43c'); R(x + 9, y + 7, 1, 2, '#46a43c');
    R(x + 5, y - 1, 1, 1, '#6cc24c'); R(x + 10, y + 2, 1, 1, '#6cc24c'); R(x + 5, y + 5, 1, 1, '#6cc24c'); R(x + 10, y + 8, 1, 1, '#ff8fb1');
    R(x + 8, y - 6, 1, 1, '#ffd84a');
  }
}

function drawBone(x, y, r) {
  var oy = RM ? 0 : Math.round(Math.sin(G.t * 4 + r) * 1.2);
  shadow(x + 4, y + 12, 8);
  var Y = y + 6 + oy;
  R(x + 5, Y + 1, 6, 2, '#fff6dc');
  R(x + 3, Y, 3, 2, '#fff6dc'); R(x + 3, Y + 2, 3, 2, '#fff6dc');
  R(x + 10, Y, 3, 2, '#fff6dc'); R(x + 10, Y + 2, 3, 2, '#fff6dc');
  R(x + 5, Y + 3, 6, 1, '#d9c79a'); R(x + 3, Y + 3, 3, 1, '#d9c79a'); R(x + 10, Y + 3, 3, 1, '#d9c79a');
  if (!RM && Math.floor(G.t * 3 + r) % 4 === 0) { R(x + 13, Y - 2, 1, 1, '#ffffff'); R(x + 12, Y - 1, 3, 1, 'rgba(255,255,255,0.7)'); }
}

function drawCar(m, X, y, dir) {
  var w = Math.round(m.len * TS) - 2, x = X + 1, p = m.pal;
  var front = dir > 0 ? x + w - 1 : x, back = dir > 0 ? x : x + w - 1;
  g2.fillStyle = 'rgba(0,0,0,0.28)'; g2.fillRect(x + 1, y + 13, w, 2);
  if (m.van) {
    R(x, y + 1, w, 12, p[0]); R(x, y + 1, w, 2, p[1]); R(x, y + 11, w, 2, p[2]);
    R(x + 3, y + 6, w - 6, 2, p[3]);
    var cab = dir > 0 ? x + w - 8 : x + 2;
    R(cab, y + 3, 6, 4, '#a8dcef'); R(cab + (dir > 0 ? 4 : 0), y + 3, 2, 4, '#d6f1fa');
  } else {
    R(x, y + 5, w, 8, p[0]); R(x, y + 5, w, 1, p[1]); R(x, y + 11, w, 2, p[2]);
    R(x + 4, y + 1, w - 8, 5, p[0]); R(x + 4, y + 1, w - 8, 1, p[1]);
    R(x + 5, y + 2, w - 10, 3, '#a8dcef');
    R(dir > 0 ? x + w - 7 : x + 5, y + 2, 2, 3, '#d6f1fa');
  }
  R(x + 2, y + 12, 4, 3, '#1d1f24'); R(x + w - 6, y + 12, 4, 3, '#1d1f24');
  R(x + 3, y + 13, 2, 1, '#6b6f78'); R(x + w - 5, y + 13, 2, 1, '#6b6f78');
  R(front, y + 7, 1, 2, '#fff2a8'); R(back, y + 7, 1, 2, '#ff5a4a');
}

function drawLog(it, x, y) {
  var w = Math.round(it.len * TS) - 1;
  R(x, y + 13, w, 1, 'rgba(10,50,90,0.35)');
  R(x, y + 3, w, 10, '#8b5a2b'); R(x, y + 3, w, 2, '#a8743d'); R(x, y + 11, w, 2, '#6b4220');
  for (var i = 6; i < w - 4; i += 7) R(x + i, y + 6 + ((it.seed + i) % 3), 3, 1, '#6f4522');
  R(x, y + 4, 3, 8, '#c99a5c'); R(x + 1, y + 6, 1, 4, '#9b6f3c'); R(x, y + 4, 3, 1, '#ddb478');
  R(x + w - 1, y + 4, 1, 8, '#6b4220');
  if (it.seed % 2 === 0) { R(x + 8, y + 3, 4, 1, '#5aa845'); R(x + 9, y + 2, 2, 1, '#6cc24c'); }
  if (it.seed % 3 === 0 && w > 36) { R(x + w - 12, y + 3, 1, 1, '#ff8fb1'); R(x + w - 13, y + 3, 1, 1, '#5aa845'); }
  if (!RM) { R(x - 1, y + 11, 2, 1, '#d3eefa'); R(x + w - 1, y + 11, 2, 1, '#d3eefa'); }
}
function drawRaft(it, x, y) {
  var w = Math.round(it.len * TS) - 2;
  R(x + 1, y + 14, w, 1, 'rgba(10,50,90,0.35)');
  for (var i = 0; i < w; i += 5) { R(x + 1 + i, y + 2, 4, 12, '#c4955a'); R(x + 1 + i, y + 2, 4, 1, '#ddb478'); R(x + 4 + i, y + 2, 1, 12, '#8e6434'); }
  R(x + 1, y + 5, w, 1, '#efe0b4'); R(x + 1, y + 11, w, 1, '#efe0b4');
  R(x + w - 4, y - 4, 1, 7, '#5b4a3a'); R(x + w - 9, y - 4, 5, 3, it.seed % 2 ? '#ff8a3a' : '#5ccf52');
}

function drawSign(x, y, row) {
  var on = row.phase === 'warn' ? (RM ? true : Math.floor(G.t * 8) % 2 === 0) : row.phase === 'run';
  R(x + 3, y + 3, 2, 11, '#5b4a3a');
  var Y = y - 5;
  var rows = [1, 3, 5, 7, 5, 3, 1];
  for (var j = 0; j < 7; j++) R(x + 4 - Math.floor(rows[j] / 2) - 0, Y + j, rows[j], 1, on ? '#ffd23f' : '#d8b545');
  R(x + 4, Y + 1, 1, 3, '#15281c'); R(x + 4, Y + 5, 1, 1, '#15281c');
  R(x + 3, Y - 2, 3, 2, on ? '#ff3b2f' : '#6b2a22');
  if (on && !RM) { g2.fillStyle = 'rgba(255,80,50,0.35)'; g2.fillRect(x + 1, Y - 4, 7, 6); }
}

var HERD = [['#8a5bd0', '#b996ee', '#5d3a96', '#f2d4ff'], ['#2fa38f', '#79dcc8', '#1b6c5e', '#e0fff6'], ['#d9772f', '#f7a865', '#9c4f19', '#ffe7cc']];
function drawHerdDino(X, Y, dir, d) {
  var W = 30, p = HERD[d.pal];
  function M(px, py, w, h, c) { R(dir > 0 ? X + px : X + W - px - w, Y + py, w, h, c); }
  var f = RM ? 0 : Math.floor(G.t * 14 + d.ph) % 2;
  g2.fillStyle = 'rgba(40,20,0,0.25)'; g2.fillRect(X + 3, Y + 19, 24, 2);
  /* legs (back pair first) */
  M(7, 14, 3, 5 - f, p[2]); M(17, 14, 3, 4 + f, p[2]);
  /* tail */
  M(0, 9, 3, 2, p[2]); M(2, 8, 4, 4, p[0]);
  /* body */
  M(5, 5, 15, 10, p[0]); M(6, 4, 13, 1, p[0]); M(6, 5, 12, 2, p[1]);
  M(7, 13, 11, 2, p[3]);
  M(9, 7, 2, 2, p[2]); M(13, 6, 2, 2, p[2]); M(16, 8, 2, 2, p[2]);
  /* frill and head */
  M(18, 1, 5, 11, p[1]); M(19, 0, 3, 1, p[1]); M(18, 1, 1, 11, p[2]);
  M(21, 5, 7, 7, p[0]); M(21, 5, 7, 1, p[1]); M(27, 8, 3, 3, p[2]);
  M(24, 2, 1, 3, '#fff3d6'); M(25, 1, 1, 2, '#fff3d6'); M(28, 6, 1, 2, '#fff3d6');
  M(23, 6, 2, 2, '#ffffff'); M(24, 7, 1, 1, '#15141c');
  /* front legs */
  M(9, 15, 3, 4 + f, p[2]); M(19, 14, 3, 5 - f, p[2]);
  M(9, 18 + f, 3, 1, '#2a1f1a'); M(19, 18 - f, 3, 1, '#2a1f1a');
}

function drawPlayer(cam) {
  if (state === 'closed') return;
  var dead = G.dead;
  if (dead === 'splash' || dead === 'drift') return;
  var vr = visRow(), px = playerX();
  var t = P.hop ? P.hop.t : 0;
  var arc = P.hop ? Math.sin(Math.PI * t) * (RM ? 3 : 5) : 0;
  var row = G.rows[P.row];
  var X;
  if (P.log && row && row.items) {
    X = Math.round(P.log.x * TS) + Math.round((P.x - P.log.x) * TS);
  } else X = Math.round(px * TS);
  var Y = Math.round(-vr * TS - cam);
  if (P.bump > 0 && !RM) X += Math.round(Math.sin(P.bump * 18) * 1.5);
  var s = sprites();
  var face = P.face > 0;
  var img = (P.blinkT < 0 && !dead) ? (face ? s.rb : s.lb) : (face ? s.r : s.l);
  shadow(X + 3, Y + 13, 10);
  if (dead === 'squash' || dead === 'stamp') {
    g2.drawImage(img, X + 0, Y + 9, 16, 5);
    if (!RM) {
      var a = G.t * 6;
      for (var i = 0; i < 3; i++) R(X + 8 + Math.round(Math.cos(a + i * 2.1) * 6), Y + 5 + Math.round(Math.sin(a + i * 2.1) * 2), 1, 1, '#ffd76e');
    }
    return;
  }
  var sq = (!RM && P.land > 0 && !P.hop) ? Math.round(P.land * 2) : 0;
  var breathe = (!RM && !P.hop && Math.floor(G.t * 1.6) % 2 === 1) ? 1 : 0;
  if (sq) g2.drawImage(img, X + 1 - 1, Y + 1 + sq, 16, 14 - sq);
  else g2.drawImage(img, X + 1, Y + 1 - Math.round(arc) + breathe, 14, 14 - breathe);
}

/* ---------- overlay and UI ---------- */
function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
function iconCanvas() { var c = document.createElement('canvas'); c.width = 14; c.height = 14; c.getContext('2d').drawImage(sprites().r, 0, 0); return c; }

function build() {
  var o = el('div', 'hkgame');
  o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', GAME + ', a hopping game');
  var bar = el('div', 'hkg-bar');
  var title = el('div', 'hkg-title'); title.appendChild(iconCanvas()); title.appendChild(el('span', '', GAME));
  var pause = el('button', 'hkg-tb hkg-pause', 'Pause'); pause.type = 'button';
  var snd = el('button', 'hkg-tb hkg-snd'); snd.type = 'button';
  var x = el('button', 'hkg-x', 'Close &#10005;'); x.type = 'button'; x.setAttribute('aria-label', 'Close the game');
  bar.appendChild(title); bar.appendChild(pause); bar.appendChild(snd); bar.appendChild(x);
  var stage = el('div', 'hkg-stage');
  var cv = document.createElement('canvas');
  cv.setAttribute('aria-label', 'Game area. Tap to hop forward, swipe to hop sideways or back.');
  cv.setAttribute('role', 'img');
  var hud = el('div', 'hkg-hud', '<div class="hkg-score"><b>0</b><span></span></div><div class="hkg-best">Best <b>0</b></div>');
  var hint = el('div', 'hkg-hint', 'Tap or swipe to hop. Arrow keys work too.<br>Bones are bonus points.');
  var tst = el('div', 'hkg-toast');
  var card = el('div', 'hkg-card'); card.hidden = true;
  stage.appendChild(cv); stage.appendChild(hud); stage.appendChild(hint); stage.appendChild(tst); stage.appendChild(card);
  var pad = el('div', 'hkg-pad');
  var dirs = [['left', -1, 0, '&#9664;', 'Hop left'], ['up', 0, 1, '&#9650;', 'Hop forward'], ['down', 0, -1, '&#9660;', 'Hop back'], ['right', 1, 0, '&#9654;', 'Hop right']];
  dirs.forEach(function (d) {
    var b = el('button', 'hkg-' + d[0], d[3]); b.type = 'button'; b.setAttribute('aria-label', d[4]);
    b.addEventListener('pointerdown', function (e) { e.preventDefault(); unlockAudio(); tryMove(d[1], d[2]); });
    b.addEventListener('click', function (e) { if (e.detail === 0) tryMove(d[1], d[2]); });
    pad.appendChild(b);
  });
  o.appendChild(bar); o.appendChild(stage); o.appendChild(pad);

  ui = { o: o, bar: bar, pause: pause, snd: snd, x: x, stage: stage, canvas: cv, hud: hud, hint: hint, toast: tst, card: card, pad: pad,
    score: hud.querySelector('.hkg-score b'), bones: hud.querySelector('.hkg-score span'), best: hud.querySelector('.hkg-best'), bestN: hud.querySelector('.hkg-best b') };
  ctx = cv.getContext('2d');
  off = document.createElement('canvas'); octx = off.getContext('2d');

  x.addEventListener('click', close);
  pause.addEventListener('click', function () { unlockAudio(); if (state === 'play') doPause(); else if (state === 'paused') resume(); });
  snd.addEventListener('click', function () { unlockAudio(); store.sound = !store.sound; saveStore(); syncSound(); if (store.sound) sfx('bone'); });
  card.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('button') : null;
    if (!b) return;
    var act = b.getAttribute('data-act');
    if (act === 'again') restart();
    else if (act === 'close') close();
    else if (act === 'resume') resume();
    else if (act === 'quiz') startQuiz();
    else if (act === 'qcheck') quizCheck();
    else if (act === 'qnext') quizNext();
    else if (act === 'qopt') quizPick(+b.getAttribute('data-i'));
    else if (act === 'acts') { close(); var t = document.getElementById('subjects') || document.getElementById('secSubjects'); if (t && t.scrollIntoView) t.scrollIntoView({ behavior: 'smooth' }); }
  });
  /* tap and swipe on the canvas */
  var sx = 0, sy = 0, down = false;
  cv.addEventListener('pointerdown', function (e) {
    e.preventDefault(); unlockAudio();
    if (state === 'paused') { resume(); return; }
    down = true; sx = e.clientX; sy = e.clientY;
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
  });
  cv.addEventListener('pointerup', function (e) {
    if (!down) return; down = false;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) tryMove(0, 1);
    else if (Math.abs(dx) > Math.abs(dy)) tryMove(dx > 0 ? 1 : -1, 0);
    else tryMove(0, dy < 0 ? 1 : -1);
  });
  cv.addEventListener('pointercancel', function () { down = false; });
  cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  o.addEventListener('pointerdown', unlockAudio);
  o.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
  return o;
}

function syncSound() {
  if (!ui.snd) return;
  ui.snd.innerHTML = store.sound ? 'Sound on' : 'Sound off';
  ui.snd.setAttribute('aria-pressed', store.sound ? 'true' : 'false');
}

function layout() {
  if (!ui.o) return;
  var vw = window.innerWidth, vh = window.innerHeight;
  var dpr = Math.min(window.devicePixelRatio || 1, 3);
  var barH = ui.bar.offsetHeight || 66, padH = (ui.pad.offsetHeight || 56) + 20;
  var aw = Math.min(vw * 0.94, 460);
  var ah = Math.max(150, Math.min(vh * 0.86, 720, vh - barH - padH - 4));
  var ds = (aw / LW) * dpr;
  if (ds >= 3 && ds < 6) ds = Math.floor(ds);
  var s = ds / dpr;
  LH = Math.max(80, Math.floor(ah / s));
  ui.ds = ds;
  ui.canvas.width = Math.round(LW * ds); ui.canvas.height = Math.round(LH * ds);
  ui.canvas.style.width = (LW * s) + 'px'; ui.canvas.style.height = (LH * s) + 'px';
  off.width = LW; off.height = LH;
  ctx.imageSmoothingEnabled = false;
  if (G) G.cam = camTarget(visRow());
  render();
}

function updateHud() {
  if (!ui.score || !G) return;
  var s = score();
  ui.score.textContent = String(s);
  ui.bones.textContent = G.bones ? (G.bones === 1 ? '1 bone' : G.bones + ' bones') : '';
  var b = Math.max(store.best, s);
  ui.bestN.textContent = String(b);
  ui.best.className = 'hkg-best' + (s > G.startBest && G.startBest > 0 ? ' hot' : '');
}
var toastT = 0;
function toast(t) {
  ui.toast.textContent = t; ui.toast.className = 'hkg-toast on';
  clearTimeout(toastT); toastT = setTimeout(function () { if (ui.toast) ui.toast.className = 'hkg-toast'; }, 1600);
}

function cardIcon() {
  var c = document.createElement('canvas'); c.width = 14; c.height = 14;
  c.getContext('2d').drawImage(sprites().r, 0, 0);
  return c;
}
function showOver() {
  state = 'over';
  var m = MSG[G.dead] || MSG.squash, s = score();
  var html = (G.newBest && s > 0 ? '<div class="hkg-badge hkg-pop">New best!</div>' : '') +
    '<h2 style="color:' + m.col + '">' + m.t + '</h2>' +
    '<p>' + pick(m.m) + '</p>' +
    '<div class="hkg-nums"><div><span>Score</span><b>' + s + '</b></div><div><span>Best</span><b>' + store.best + '</b></div></div>' +
    (store.runs > 0 ?
      '<button type="button" class="hkg-go" data-act="again">Again</button>' +
      '<button type="button" class="hkg-c2" data-act="close">Close</button>' +
      '<p class="hkg-tip">' + runsWord(store.runs) + ' left. Enter or Space also starts again.</p>' :
      '<button type="button" class="hkg-go" data-act="again">Earn more runs</button>' +
      '<button type="button" class="hkg-c2" data-act="close">Close</button>' +
      '<p class="hkg-tip">That was your last run for now. A few questions earn more.</p>');
  ui.card.className = 'hkg-card';
  ui.card.innerHTML = html;
  ui.card.insertBefore(cardIcon(), ui.card.firstChild);
  ui.card.hidden = false;
  overAt = Date.now();
  if (G.newBest && s > 0) {
    sfx('best');
    var cx = (clamp(P.x, 0, COLS - 1) + 0.5) * TS, cy = -P.row * TS;
    for (var i = 0; i < (RM ? 0 : 40); i++) addPart(cx + rnd(-30, 30), cy - rnd(0, 30), rnd(-60, 60), rnd(-110, -30), 120, rnd(0.8, 1.5), pick(['#ffd76e', '#ff8a3a', '#5ccf52', '#ffffff', '#b38cff', '#ff8fb1']), 2);
  }
  var again = ui.card.querySelector('.hkg-go');
  try { again.focus({ preventScroll: true }); } catch (e) { again.focus(); }
  ui.pause.disabled = true;
}
function doPause() {
  if (state !== 'play') return;
  state = 'paused';
  P.queued = null;
  ui.card.innerHTML = '<h2 style="color:#2c8f43">Paused</h2><p>Take your time. Carry on whenever you like.</p>' +
    '<div style="height:14px"></div><button type="button" class="hkg-go" data-act="resume">Carry on</button>' +
    '<button type="button" class="hkg-c2" data-act="close">Close</button>';
  ui.card.insertBefore(cardIcon(), ui.card.firstChild);
  ui.card.hidden = false;
  ui.pause.textContent = 'Carry on';
  var b = ui.card.querySelector('.hkg-go');
  try { b.focus({ preventScroll: true }); } catch (e) {}
}
function resume() {
  if (state !== 'paused') return;
  state = 'play'; ui.card.hidden = true; ui.card.innerHTML = '';
  ui.pause.textContent = 'Pause';
  lastTs = 0;
  focusStage();
}
function restart() {
  newGame();
  if (!takeRun()) { showGate(); return; }
  state = 'play';
  ui.card.hidden = true; ui.card.innerHTML = ''; ui.card.className = 'hkg-card';
  ui.pause.disabled = false; ui.pause.textContent = 'Pause';
  ui.hint.className = 'hkg-hint' + (store.games >= 3 ? ' gone' : '');
  if (ui.hint.className.indexOf('gone') < 0) G.hopped = false;
  ui.toast.className = 'hkg-toast';
  updateHud();
  focusStage();
  runToast();
}
function focusStage() { try { ui.canvas.setAttribute('tabindex', '-1'); ui.canvas.focus({ preventScroll: true }); } catch (e) {} }

/* ---------- the gate: answer questions to earn runs ---------- */
function cardIn(html, wide) {
  ui.card.className = 'hkg-card' + (wide ? ' hkg-wide' : '');
  ui.card.innerHTML = html;
  ui.card.hidden = false;
  ui.pause.disabled = true;
  var f = ui.card.querySelector('input, .hkg-go, .hkg-opt');
  if (f) { try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }
}
function showGate() {
  state = 'gate';
  if (ui.hint) ui.hint.className = 'hkg-hint gone';
  cardIn('<h2 style="color:#2c8f43">Fuel up first</h2>' +
    '<p>The dino needs fuel. Get ' + GATE_N + ' questions right and you earn ' + runsWord(GATE_RUNS) + '.</p>' +
    '<p class="hkg-tip">Every ' + PER_RIGHT + ' right answers in your activities or the daily drop earn another run too.</p>' +
    '<button type="button" class="hkg-go" data-act="quiz">Answer questions</button>' +
    '<button type="button" class="hkg-c2" data-act="acts">Go to my activities</button>' +
    '<button type="button" class="hkg-c2" data-act="close">Close</button>');
  ui.card.insertBefore(cardIcon(), ui.card.firstChild);
}
var Q = null;
function loadBank(cb) {
  if (window.EGWDAILY && window.EGWDAILY.length) { cb(); return; }
  var srcs = ['/lc/daily-bank-maths.js?v=1', '/lc/daily-bank-english.js?v=1'], left = srcs.length;
  srcs.forEach(function (u) {
    var sc = document.createElement('script'); sc.src = u;
    sc.onload = sc.onerror = function () { if (--left === 0) cb(); };
    document.head.appendChild(sc);
  });
}
function startQuiz() {
  ui.card.innerHTML = '<p>Getting questions...</p>';
  loadBank(function () {
    if (state !== 'gate') return;
    var bank = (window.EGWDAILY || []).filter(function (q) { return q && (q.type === 'mc' || q.type === 'num'); });
    if (!bank.length) {   /* no questions could load: do not lock him out */
      store.runs += 1; saveStore(); quizDone(true); return;
    }
    var order = bank.slice();
    for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t; }
    Q = { order: order, at: -1, right: 0, cur: null, tries: 0, opts: null, settled: false };
    quizNext();
  });
}
function dots() {
  var h = '<div class="hkg-qn" aria-label="' + Q.right + ' of ' + GATE_N + ' right">';
  for (var i = 0; i < GATE_N; i++) h += '<i' + (i < Q.right ? ' class="on"' : '') + '></i>';
  return h + '</div>';
}
function quizNext() {
  if (!Q) return;
  if (Q.right >= GATE_N) { quizDone(false); return; }
  Q.at = (Q.at + 1) % Q.order.length;
  var q = Q.cur = Q.order[Q.at];
  Q.tries = 0; Q.settled = false;
  var h = dots() + '<div class="hkg-q">' + q.q + '</div>';
  if (q.type === 'mc') {
    var idx = q.options.map(function (o, i) { return i; });
    for (var i = idx.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
    Q.opts = idx;
    h += '<div class="hkg-opts">' + idx.map(function (oi, n) {
      return '<button type="button" class="hkg-opt" data-act="qopt" data-i="' + n + '">' + q.options[oi] + '</button>';
    }).join('') + '</div>';
  } else {
    h += q.boxes.map(function (b, n) {
      return '<label class="hkg-box">' + (b.label || 'Answer') + ' ' + (b.pre || '') +
        '<input type="text" inputmode="decimal" autocomplete="off" data-n="' + n + '">' + (b.post || '') + '</label>';
    }).join('') + '<button type="button" class="hkg-go" data-act="qcheck">Check</button>';
  }
  h += '<p class="hkg-fb" aria-live="polite"></p>' +
    '<button type="button" class="hkg-c2" data-act="close">Close</button>';
  cardIn(h, true);
}
function numOf(v) {
  v = String(v || '').replace(new RegExp(String.fromCharCode(163), 'g'), '').replace(/,/g, '').replace(/\s+/g, '').replace(/[a-z%]+$/i, '');
  var m = /^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(v);
  if (m) return +m[2] ? +m[1] / +m[2] : NaN;
  return v === '' ? NaN : Number(v);
}
function quizPick(n) {
  if (!Q || Q.settled || !Q.cur) return;
  var q = Q.cur, btns = ui.card.querySelectorAll('.hkg-opt'), b = btns[n];
  if (!b || b.disabled) return;
  if (Q.opts[n] === q.answer) { b.className = 'hkg-opt ok'; quizResult(true); return; }
  b.className = 'hkg-opt no'; b.disabled = true;
  Q.tries++;
  if (Q.tries >= 2) {
    for (var i = 0; i < btns.length; i++) if (Q.opts[i] === q.answer) btns[i].className = 'hkg-opt ok';
    quizResult(false);
  } else feedback('Not that one. ' + (q.hint || 'Have another go.'));
}
function quizCheck() {
  if (!Q || Q.settled || !Q.cur || Q.cur.type !== 'num') return;
  var q = Q.cur, ins = ui.card.querySelectorAll('.hkg-box input'), ok = true, empty = false;
  for (var i = 0; i < ins.length; i++) {
    var b = q.boxes[i], v = numOf(ins[i].value);
    if (ins[i].value.trim() === '') { empty = true; continue; }
    var good = isFinite(v) && Math.abs(v - b.a) <= (b.tol || 0.001);
    ins[i].className = good ? 'ok' : 'no';
    if (!good) ok = false;
  }
  if (empty) { feedback('Pop a number in the box first.'); return; }
  if (ok) { quizResult(true); return; }
  Q.tries++;
  if (Q.tries >= 2) {
    for (i = 0; i < ins.length; i++) { ins[i].value = String(q.boxes[i].a); ins[i].className = 'ok'; ins[i].disabled = true; }
    quizResult(false);
  } else feedback('Not quite. ' + (q.hint || 'Have another go.'));
}
function feedback(t) { var f = ui.card.querySelector('.hkg-fb'); if (f) f.innerHTML = t; }
function quizResult(ok) {
  Q.settled = true;
  if (ok) { Q.right++; sfx('bone'); }
  var q = Q.cur;
  var opts = ui.card.querySelectorAll('.hkg-opt, .hkg-box input');
  for (var i = 0; i < opts.length; i++) opts[i].disabled = true;
  var chk = ui.card.querySelector('[data-act="qcheck"]'); if (chk) chk.parentNode.removeChild(chk);
  var dd = ui.card.querySelector('.hkg-qn'); if (dd) dd.outerHTML = dots();
  feedback((ok ? '<b>Yes!</b> ' : 'This one does not count. ') + (q.why || ''));
  var nx = document.createElement('button');
  nx.type = 'button'; nx.className = 'hkg-go'; nx.setAttribute('data-act', 'qnext');
  nx.textContent = Q.right >= GATE_N ? 'Get my runs' : 'Next question';
  var fb = ui.card.querySelector('.hkg-fb');
  fb.parentNode.insertBefore(nx, fb.nextSibling);
  try { nx.focus({ preventScroll: true }); } catch (e) { nx.focus(); }
}
function quizDone(fallback) {
  if (!fallback) { store.runs += GATE_RUNS; saveStore(); sfx('best'); }
  Q = null;
  cardIn('<div class="hkg-badge hkg-pop">Fuelled up!</div>' +
    '<h2 style="color:#2c8f43">' + runsWord(store.runs) + ' ready</h2>' +
    '<p>Nice work. Off you hop.</p><div style="height:12px"></div>' +
    '<button type="button" class="hkg-go" data-act="again">Play</button>' +
    '<button type="button" class="hkg-c2" data-act="close">Save them for later</button>');
  ui.card.insertBefore(cardIcon(), ui.card.firstChild);
}
function runToast() {
  if (!ui.toast) return;
  toast(store.runs > 0 ? runsWord(store.runs) + ' left after this' : 'Last run for now');
}

function onKey(e) {
  if (state === 'closed') return;
  var k = e.key, tgt = e.target, onBtn = tgt && tgt.tagName === 'BUTTON';
  if (k === 'Escape' || k === 'Esc') { e.preventDefault(); close(); return; }
  if (k === 'Tab') { trapTab(e); return; }
  if (state === 'gate') {
    if (k === 'Enter' && tgt && tgt.tagName === 'INPUT') { e.preventDefault(); quizCheck(); }
    return;
  }
  unlockAudio();
  var mv = null;
  if (k === 'ArrowUp' || k === 'w' || k === 'W') mv = [0, 1];
  else if (k === 'ArrowDown' || k === 's' || k === 'S') mv = [0, -1];
  else if (k === 'ArrowLeft' || k === 'a' || k === 'A') mv = [-1, 0];
  else if (k === 'ArrowRight' || k === 'd' || k === 'D') mv = [1, 0];
  if (state === 'over') {
    if ((k === 'Enter' || k === ' ' || k === 'Spacebar') && !onBtn) {
      e.preventDefault();
      if (Date.now() - overAt > 350) restart();
    } else if (mv) e.preventDefault();
    return;
  }
  if (state === 'paused') {
    if (mv || ((k === 'Enter' || k === ' ') && !onBtn)) { e.preventDefault(); resume(); }
    return;
  }
  if (k === 'p' || k === 'P') { e.preventDefault(); doPause(); return; }
  if (k === 'm' || k === 'M') { store.sound = !store.sound; saveStore(); syncSound(); return; }
  if (mv) { e.preventDefault(); if (!e.repeat || !P.hop) tryMove(mv[0], mv[1]); return; }
  if ((k === ' ' || k === 'Spacebar') && !onBtn) { e.preventDefault(); tryMove(0, 1); }
}
function trapTab(e) {
  var list = Array.prototype.filter.call(ui.o.querySelectorAll('button, input'), function (b) { return !b.disabled && b.offsetParent !== null; });
  if (!list.length) return;
  var i = list.indexOf(document.activeElement);
  e.preventDefault();
  var n = e.shiftKey ? (i <= 0 ? list.length - 1 : i - 1) : (i < 0 || i >= list.length - 1 ? 0 : i + 1);
  list[n].focus();
}
function onVis() { if (document.hidden && state === 'play') doPause(); }
function onResize() { layout(); }

function frame(ts) {
  raf = requestAnimationFrame(frame);
  var dt = lastTs ? (ts - lastTs) / 1000 : 0;
  lastTs = ts;
  if (dt > 0.05) dt = 0.05;
  if (state !== 'paused' && state !== 'closed') update(dt);
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
  syncSound();
  newGame();
  state = 'play';
  if (store.games >= 3) ui.hint.className = 'hkg-hint gone';
  layout();
  updateHud();
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVis);
  lastTs = 0;
  raf = requestAnimationFrame(frame);
  if (!takeRun()) showGate();
  else { focusStage(); runToast(); }
}
function close() {
  if (state === 'closed') return;
  state = 'closed';
  cancelAnimationFrame(raf); raf = 0;
  clearTimeout(toastT);
  window.removeEventListener('keydown', onKey, true);
  window.removeEventListener('resize', onResize);
  document.removeEventListener('visibilitychange', onVis);
  if (ui.o && ui.o.parentNode) ui.o.parentNode.removeChild(ui.o);
  ui = {}; ctx = null; off = null; octx = null; G = null; P = null;
  document.documentElement.style.overflow = prevOverflow;
  if (AC && AC.state === 'running') { try { AC.suspend(); } catch (e) {} }
  updateNote();
  if (opener && opener.focus) { try { opener.focus({ preventScroll: true }); } catch (e) {} }
}

/* ---------- the button in the hero ---------- */
var note = null;
function updateNote() {
  loadStore();
  syncCredit();
  if (note) note.textContent = (store.runs > 0 ? runsWord(store.runs) + ' ready. ' : 'Answer a few questions to earn runs. ') + (store.best > 0 ? 'Best: ' + store.best : 'No best yet.');
}
function addButton() {
  var hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('.hkgame-launch')) return;
  var box = el('div', 'hkgame-launch');
  var btn = el('button', 'hkgame-open'); btn.type = 'button';
  btn.appendChild(iconCanvas());
  btn.appendChild(el('span', '', 'Play ' + GAME));
  btn.addEventListener('click', open);
  note = el('p', 'hkgame-note');
  box.appendChild(btn); box.appendChild(note);
  hero.appendChild(box);
  updateNote();
}
if (WITH_BUTTON) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addButton);
  else addButton();
}

window.HKCrossy = { open: open, close: close };

/* ---------- test hook (only with ?hktest in the address) ---------- */
if (TEST) {
  window.__hkCrossy = {
    info: function () {
      if (!G) return { state: state, best: store.best, games: store.games, runs: store.runs, credited: store.credited };
      return { state: state, row: P.row, x: P.x, hopping: !!P.hop, onLog: !!P.log, score: score(), maxRow: G.maxRow,
        bones: G.bones, best: store.best, games: store.games, runs: store.runs, credited: store.credited, rights: rightAnswers(), dead: G.dead, LH: LH, rowType: G.rows[P.row] && G.rows[P.row].type };
    },
    /* replace the row just ahead of the player with a known lane */
    lane: function (kind) {
      if (!G) return false;
      var r = P.row + 1, row;
      if (kind === 'grass' || kind === 'bone') {
        row = { r: r, type: 'grass', block: [], paved: false, bone: kind === 'bone' ? Math.round(P.x) : -1, reach: [] };
        for (var c = 0; c < COLS; c++) { row.block[c] = 0; row.reach[c] = true; }
      } else if (kind === 'road') {
        row = { r: r, type: 'road', dir: 1, speed: 0.4, bone: -1, items: [{ x: P.x - 0.3, len: 1.25, van: false, pal: CARS[0] }] };
      } else if (kind === 'water') {
        row = { r: r, type: 'river', dir: 1, speed: 1, bone: -1, items: [] };
      } else if (kind === 'log') {
        row = { r: r, type: 'river', dir: 1, speed: 4, bone: -1, items: [{ x: P.x - 1, len: 3, raft: false, seed: 2 }] };
      } else if (kind === 'stamp') {
        row = { r: r, type: 'stamp', dir: 1, bone: -1, phase: 'warn', t: 0.35, warnT: 0.35, speed: 12, herd: [] };
      } else return false;
      G.rows[r] = row;
      return true;
    },
    move: function (dx, dr) { tryMove(dx, dr); },
    reducedMotion: function () { return RM; }
  };
}
})();
