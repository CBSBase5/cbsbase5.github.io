/* ==========================================================
   LW's Skills HQ - Monster Movie
   A pop up arcade game. LW is the monster in a cheesy B movie
   shot on a film set: climb the cardboard buildings, punch them
   until they fold over, swat the helicopter on a fishing rod,
   flatten the tanks on wires and grab the catering. A director
   in a beret shouts "Bigger!" and every take ends with a review.

   Nobody is ever hurt: the buildings are flats propped up from
   behind, the army is cardboard, and the extras run off waving.
   The monster never "dies": if it runs out of gusto the
   director just shouts "Cut!" and the take ends with a review.

   Unlocks over the term (HQGame.ladder), a weekly era twist
   (HQGame.era: the film changes genre), and secrets to find.

   Home page:  <script src="/lw/monster.js?v=1"></script>
               (the launcher is drawn by /lw/break.js)
               data-button="1" also adds its own button to .hero
   Any page:   window.LWMonster.open() opens the game.
   While a take is running the overlay also has the class
   lwmm-take, so the break gate lets the take finish.
   Saves in b5.lw.monster.v1 on this device.
   Everything is drawn in code. ASCII only in this file.
   ========================================================== */
(function () {
'use strict';
if (window.LWMonster) return;

var KEY = 'b5.lw.monster.v1';
var GAME = 'Monster Movie';
var PREFIX = (window.HQ && window.HQ.prefix) || 'b5.lw.';
var GOLD = '#ffc53d', TEAL = '#2ed3c6', CORAL = '#ff5a4e', LILAC = '#c99bff', INK = '#1a0d1c', PLUM = '#5a1650', CREAM = '#fff8ee';
var DISP = '"Bebas Neue","Outfit","Arial Narrow",Arial,system-ui,sans-serif';
var BODY = 'var(--body,"Atkinson Hyperlegible",Verdana,system-ui,sans-serif)';
var CF = '"Bebas Neue","Outfit","Arial Narrow",Arial,sans-serif';
var me = document.currentScript;
var WITH_BUTTON = !!(me && me.getAttribute('data-button') && me.getAttribute('data-button') !== '0');
var QS = location.search;
var TEST = /[?&]hqtest(=|&|$)/.test(QS);
function qp(name) { if (!TEST) return null; var m = QS.match(new RegExp('[?&]' + name + '=([\\w-]+)')); return m ? m[1] : null; }
var POUND = '\u00a3';

/* ---------- small helpers ---------- */
function rnd(a, b) { return a + Math.random() * (b - a); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function lerp(a, b, t) { return a + (b - a) * t; }
function hasOwn(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function mmss(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60); }
function money(n) { n = Math.max(0, Math.round(n)); return POUND + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
var FINE = !!(window.matchMedia && matchMedia('(pointer: fine)').matches);
var COARSE = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
var TAU = Math.PI * 2;

/* ==========================================================
   WHAT THERE IS TO UNLOCK, THE ERAS, THE SETS, THE MONSTERS
   ========================================================== */
var UNLOCKS = [
  { id: 'm-grumble', at: 0, type: 'monster', key: 'grumble', name: 'Grumblehorn', line: 'The original. One eye, two horns, zip up the back.' },
  { id: 's-city', at: 0, type: 'set', key: 'city', name: 'City Backlot', line: 'Five cardboard tower blocks. Propped up. Mostly.' },
  { id: 'h-party', at: 0, type: 'hat', key: 'party', name: 'Party hat', line: 'Every monster deserves a party.' },
  { id: 's-pier', at: 120, type: 'set', key: 'pier', name: 'Seaside Pier', line: 'A helter skelter, a lighthouse and very cheeky seagulls.' },
  { id: 'm-blob', at: 250, type: 'monster', key: 'blob', name: 'Blobbo', line: 'A giant jelly that bounces. Special: belly flop.' },
  { id: 'h-top', at: 400, type: 'hat', key: 'top', name: 'Top hat', line: 'Very distinguished. Still a monster.' },
  { id: 'd-slow', at: 550, type: 'mode', key: 'slow', name: 'Slow motion', line: 'Everything is dramatic now.' },
  { id: 'p-confetti', at: 720, type: 'prop', key: 'confetti', name: 'Confetti cannon', line: 'Every building that folds goes out with a party.' },
  { id: 's-school', at: 900, type: 'set', key: 'school', name: 'Big School', line: 'A clock tower, a gym, and a bell that means break time.' },
  { id: 'm-robot', at: 1100, type: 'monster', key: 'robot', name: 'Unit 9', line: 'A cardboard robot. Hits hard. Special: torch eyes.' },
  { id: 'd-musical', at: 1350, type: 'mode', key: 'musical', name: 'Musical number', line: 'Everybody dances. Punch on the beat for a bonus.' },
  { id: 'h-crown', at: 1650, type: 'hat', key: 'crown', name: 'Crown', line: 'Monarch of the backlot.' },
  { id: 'm-moth', at: 2000, type: 'monster', key: 'moth', name: 'Duster', line: 'A huge fluffy moth. It flies! Special: wing gust.' },
  { id: 's-space', at: 2400, type: 'set', key: 'space', name: 'Space Station 5', line: 'Low gravity and a flying saucer on a string.' },
  { id: 'd-bw', at: 2850, type: 'mode', key: 'bw', name: 'Black and white', line: 'Very classic. Very serious. Not really.' },
  { id: 'p-chicken', at: 3300, type: 'prop', key: 'chicken', name: 'Rubber chicken', line: 'Every punch becomes a squeaky chicken slap.' },
  { id: 'm-sock', at: 3700, type: 'monster', key: 'sock', name: 'Socko', line: 'A giant sock puppet. Stretches to any height.' },
  { id: 'c-glitter', at: 4000, type: 'suit', key: 'glitter', name: 'Glitter suit', line: 'Sparkles on every monster. The award season look.' }
];

var SECRETS = [
  { id: 'jaywin', name: 'Jay in a window', line: '"Unhand me, goblin!" Then off he floats.', clue: 'Someone familiar works in one of the windows.' },
  { id: 'bonnie', name: 'Bonnie on set', line: 'A small brown poodle with no tail. Best in show.', clue: 'Someone small wanders on set now and then.' },
  { id: 'director', name: 'The real director', line: 'Under the beret: messy hair and big eyebrows.', clue: 'The director seems a bit familiar.' },
  { id: 'bird', name: 'A bird for Jay', line: 'Stay still up high and a bird drops by. Outrageous.', clue: 'Stay very still somewhere high.' },
  { id: 'box', name: 'A familiar box', line: 'Someone in a cardboard box, watching from the wings. Surely not.', clue: 'Keep an eye on the wings.' },
  { id: 'grandad', name: 'Wise words', line: '"In the wise words of my late, great grandfather: stop."', clue: 'Flatten the lot in one take.' }
];

/* each week's film. pal comes from HQGame; the rest is how this game plays it */
var ERA = {
  stone: { genre: 'A Stone Age epic', rule: 'Every building that folds rolls a giant foam boulder down the street.',
    wall: ['#a39078', '#95836c', '#b09f86'], trim: '#5e5040', glass: '#3a2414', glow: '#ffb35c', floor: '#7d5c3c', floor2: '#6a4b2f',
    roof: 'boulder', tank: 'mammoth', heli: 'ptero', snack: 'rock cakes', hatE: 'fur', tune: 'stone' },
  egypt: { genre: 'An Egyptian epic', rule: 'All the extras are cats. They land on their feet.',
    wall: ['#e8c27a', '#dcb36a', '#f0cf8e'], trim: '#a8813a', glass: '#2a6f8f', glow: '#7fd6e8', floor: '#e2b65e', floor2: '#cfa04c',
    roof: 'pyramid', tank: 'barge', heli: 'falcon', snack: 'dates', hatE: 'cat', tune: 'egypt' },
  rome: { genre: 'A Roman sword and sandal film', rule: 'The chariots are pulled by pantomime horses. Punch one and it splits in two.',
    wall: ['#e9e2d4', '#ddd5c4', '#f2ece0'], trim: '#b8ab92', glass: '#4d5d73', glow: '#9fb3c8', floor: '#8e8a7c', floor2: '#7a766a',
    roof: 'pediment', tank: 'horse', heli: 'eagle', snack: 'grapes', hatE: 'laurel', tune: 'rome' },
  viking: { genre: 'A Viking saga', rule: 'Every 8 smashes the choir sings and the army stops to listen.',
    wall: ['#8a5a34', '#7a4e2c', '#94643c'], trim: '#4a2c16', glass: '#3a2210', glow: '#ffcf6b', floor: '#4f5d44', floor2: '#40503a',
    roof: 'gable', tank: 'longship', heli: 'raven', snack: 'bread rolls', hatE: 'horns', tune: 'viking' },
  victorian: { genre: 'A Victorian costume drama', rule: 'A tiny steam train chuffs through and folds any tanks on the line.',
    wall: ['#9a5a46', '#8a4e3c', '#a8664f'], trim: '#e8dcc4', glass: '#3c4a52', glow: '#ffd98a', floor: '#5d5249', floor2: '#4d443c',
    roof: 'chimney', tank: 'steam', heli: 'airship', snack: 'crumpets', hatE: 'tophat', tune: 'victorian' },
  eighties: { genre: 'An 80s action film', rule: 'Jump off anything tall for a slow motion landing. Very dramatic.',
    wall: ['#2a1650', '#1e1240', '#341a60'], trim: '#ff4fa3', glass: '#12304a', glow: '#2de2e6', floor: '#1c1636', floor2: '#2b2150',
    roof: 'neon', tank: 'neon', heli: 'neonheli', snack: 'ice lollies', hatE: 'hair', tune: 'eighties' },
  future: { genre: 'A far future sci fi', rule: 'Low gravity, tinsel on everything, and the snacks are crackers that pop.',
    wall: ['#c9d6e8', '#b8c8de', '#dfe8f4'], trim: '#5ad8b0', glass: '#1f3c6e', glow: '#7cf5c9', floor: '#2a3a58', floor2: '#22304a',
    roof: 'antenna', tank: 'hover', heli: 'drone', snack: 'crackers', hatE: 'visor', tune: 'future' }
};
var ERA_FALLBACK = { n: 1, id: 'stone', name: 'Stone Age', line: 'Everything is made of rock. Even the bad ideas.',
  pal: { sky: '#f2a65a', sky2: '#ffd9a0', ground: '#8a6a48', ink: '#2b1d12', accent: '#e05a2b' } };

/* a set is the layout of flats; the era dresses them */
var SETS = {
  city: { name: 'City Backlot', place: 'the City', reel: 130, tanks: 3, helis: 2,
    b: [[150, 250, 'flat'], [130, 320, 'flat'], [170, 210, 'flat'], [140, 300, 'tower'], [160, 240, 'flat']] },
  pier: { name: 'Seaside Pier', place: 'the Pier', reel: 130, tanks: 2, helis: 2, gulls: true, sea: true,
    b: [[110, 330, 'cone'], [200, 170, 'dome'], [150, 240, 'flat'], [100, 340, 'lamp']] },
  school: { name: 'Big School', place: 'Big School', reel: 135, tanks: 3, helis: 1, bell: true,
    b: [[200, 210, 'flat'], [150, 330, 'clock'], [210, 170, 'flat'], [150, 250, 'flat']] },
  space: { name: 'Space Station 5', place: 'Space Station 5', reel: 140, tanks: 2, helis: 3, low: true, stars: true,
    b: [[140, 280, 'dome'], [120, 210, 'flat'], [160, 330, 'tower'], [130, 240, 'dome'], [150, 260, 'flat']] }
};
var SET_ORDER = ['city', 'pier', 'school', 'space'];

var MON = {
  grumble: { name: 'Grumblehorn', w: 46, h: 66, spd: 140, jump: 430, climb: 130, reach: 30, dmg: 1, climbs: true, sp: 'roar', sname: 'Roar', cd: 8,
    move: 'Climbs anything. Special: a roar that folds tanks.' },
  blob: { name: 'Blobbo', w: 58, h: 52, spd: 130, jump: 560, climb: 110, reach: 26, dmg: 1, climbs: true, bounce: true, sp: 'flop', sname: 'Belly flop', cd: 5,
    move: 'Big bouncy jumps. Special: belly flop from up high.' },
  robot: { name: 'Unit 9', w: 44, h: 70, spd: 118, jump: 390, climb: 105, reach: 38, dmg: 2, climbs: true, sp: 'torch', sname: 'Torch eyes', cd: 7,
    move: 'Punches twice as hard. Special: torch eyes.' },
  moth: { name: 'Duster', w: 48, h: 46, spd: 155, fly: true, reach: 30, dmg: 1, sp: 'gust', sname: 'Wing gust', cd: 6,
    move: 'Flies anywhere. Special: a wing gust.' },
  sock: { name: 'Socko', w: 40, h: 40, spd: 140, stretch: true, reach: 34, dmg: 1, sp: 'voice', sname: 'Throw voice', cd: 9,
    move: 'Stretches up to any height. Special: throws its voice.' }
};
var MON_ORDER = ['grumble', 'blob', 'robot', 'moth', 'sock'];
var HAT_ORDER = ['none', 'party', 'top', 'crown'];
var MODE_ORDER = ['normal', 'slow', 'musical', 'bw'];
var PROP_ORDER = ['none', 'confetti', 'chicken'];
var SUIT_ORDER = ['normal', 'glitter'];
var NAMES = {
  hat: { none: 'No hat', party: 'Party hat', top: 'Top hat', crown: 'Crown' },
  mode: { normal: 'Normal', slow: 'Slow motion', musical: 'Musical number', bw: 'Black and white' },
  prop: { none: 'No prop', confetti: 'Confetti cannon', chicken: 'Rubber chicken' },
  suit: { normal: 'Normal', glitter: 'Glitter suit' }
};

/* ---------- storage ---------- */
var store = { v: 1, sound: true, best: {}, takes: {}, total: 0, flat: 0, wraps: 0,
  pick: { monster: 'grumble', set: 'city', hat: 'none', mode: 'normal', prop: 'none', suit: 'normal' },
  seen: [], secrets: {}, hinted: 0, pad: '' };
function numMap(o) { var r = {}; if (o && typeof o === 'object') for (var k in o) if (hasOwn(o, k) && isFinite(o[k])) r[k] = Math.max(0, Math.floor(o[k])); return r; }
function loadStore() {
  try {
    var o = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!o || typeof o !== 'object') return;
    if (typeof o.sound === 'boolean') store.sound = o.sound;
    store.best = numMap(o.best); store.takes = numMap(o.takes);
    ['total', 'flat', 'wraps', 'hinted'].forEach(function (k) { if (isFinite(o[k])) store[k] = Math.max(0, Math.floor(o[k])); });
    if (o.pick && typeof o.pick === 'object') for (var k in store.pick) if (typeof o.pick[k] === 'string') store.pick[k] = o.pick[k];
    if (o.pad === 'on' || o.pad === 'off') store.pad = o.pad;
    if (Array.isArray(o.seen)) store.seen = o.seen.filter(function (s) { return typeof s === 'string'; });
    if (o.secrets && typeof o.secrets === 'object') { store.secrets = {}; for (var s in o.secrets) if (hasOwn(o.secrets, s) && o.secrets[s]) store.secrets[s] = true; }
  } catch (e) {}
}
function saveStore() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }

/* ---------- the week and the unlocks (HQGame, with a fallback) ---------- */
function eraNow() {
  var G = window.HQGame, e = null;
  try { e = G && G.era ? G.era() : null; } catch (err) {}
  return e && ERA[e.id] ? e : ERA_FALLBACK;
}
function ladderNow() {
  var G = window.HQGame;
  if (G && G.ladder) { try { var r = G.ladder(PREFIX, UNLOCKS); if (r && r.have) return r; } catch (e) {} }
  var have = UNLOCKS.filter(function (u) { return !u.at; }), next = null;
  for (var i = 0; i < UNLOCKS.length; i++) if (UNLOCKS[i].at > 0) { next = UNLOCKS[i]; break; }
  return { have: have, next: next, need: next ? next.at : 0, sparks: 0 };
}
var LAD = null, OWN = {};
function refreshLadder() {
  LAD = ladderNow(); OWN = {};
  LAD.have.forEach(function (u) { OWN[u.type + ':' + u.key] = true; });
  OWN['hat:none'] = OWN['mode:normal'] = OWN['prop:none'] = OWN['suit:normal'] = true;
  var p = store.pick;
  if (!OWN['monster:' + p.monster]) p.monster = 'grumble';
  if (!OWN['set:' + p.set]) p.set = 'city';
  if (!OWN['hat:' + p.hat]) p.hat = 'none';
  if (!OWN['mode:' + p.mode]) p.mode = 'normal';
  if (!OWN['prop:' + p.prop]) p.prop = 'none';
  if (!OWN['suit:' + p.suit]) p.suit = 'normal';
}
function owns(type, key) { return !!OWN[type + ':' + key]; }

/* ==========================================================
   SOUND (synthesised, gentle, only after a tap)
   ========================================================== */
var AC = null, master = null, noiseBuf = null;
function unlockAudio() {
  if (!AC) {
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      master = AC.createGain(); master.gain.value = store.sound ? 0.6 : 0; master.connect(AC.destination);
      var n = AC.sampleRate, b = AC.createBuffer(1, n, n), d = b.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      noiseBuf = b;
    } catch (e) { AC = null; }
  }
  if (AC && AC.state === 'suspended') { try { AC.resume(); } catch (e) {} }
}
function syncGain() { if (master) try { master.gain.setTargetAtTime(store.sound ? 0.6 : 0, AC.currentTime, 0.03); } catch (e) {} }
function canPlay() { return AC && master && store.sound && AC.state === 'running'; }
function tone(type, f1, f2, dur, vol, delay) {
  if (!canPlay()) return;
  try {
    var t = AC.currentTime + (delay || 0), o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.setValueAtTime(f1, t);
    if (f2 && f2 !== f1) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.03);
  } catch (e) {}
}
function noise(dur, vol, ftype, freq, delay) {
  if (!canPlay() || !noiseBuf) return;
  try {
    var t = AC.currentTime + (delay || 0), s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
    s.buffer = noiseBuf; f.type = ftype || 'lowpass'; f.frequency.value = freq || 1000;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.03);
  } catch (e) {}
}
var lastSfx = {};
function sfx(name) {
  if (!canPlay()) return;
  var now = AC.currentTime;
  if (lastSfx[name] && now - lastSfx[name] < 0.05) return;
  lastSfx[name] = now;
  switch (name) {
    case 'punch': noise(0.09, 0.22, 'lowpass', 900); tone('sine', 140, 60, 0.12, 0.2); break;
    case 'whiff': noise(0.08, 0.06, 'bandpass', 2400); break;
    case 'crack': noise(0.06, 0.16, 'bandpass', 1800); break;
    case 'smash': noise(0.28, 0.2, 'lowpass', 1500); noise(0.12, 0.08, 'highpass', 3000, 0.05); break;
    case 'fold': noise(0.9, 0.22, 'lowpass', 420); tone('sine', 90, 40, 0.7, 0.22); break;
    case 'boink': tone('sine', 480, 900, 0.14, 0.12); break;
    case 'thwip': tone('triangle', 1300, 320, 0.09, 0.08); break;
    case 'pop': tone('sine', 900, 500, 0.06, 0.14); noise(0.03, 0.08, 'highpass', 2000); break;
    case 'clap': noise(0.06, 0.32, 'highpass', 1400); tone('square', 220, 110, 0.04, 0.05); break;
    case 'eat': tone('triangle', 660, 660, 0.08, 0.12); tone('triangle', 880, 880, 0.1, 0.12, 0.07); break;
    case 'squeak': tone('square', 1100, 1700, 0.08, 0.05); tone('square', 1700, 900, 0.1, 0.05, 0.08); break;
    case 'level': [523, 659, 784, 1047].forEach(function (f, i) { tone('triangle', f, f, 0.16, 0.12, i * 0.09); }); break;
    case 'reel': tone('triangle', 300, 1100, 0.35, 0.08); break;
    case 'roar': tone('sawtooth', 120, 80, 0.6, 0.07); noise(0.5, 0.12, 'lowpass', 600); break;
    case 'beam': tone('sine', 700, 1400, 0.3, 0.06); break;
    case 'gust': noise(0.5, 0.16, 'bandpass', 700); break;
    case 'voice': tone('square', 300, 600, 0.12, 0.05); tone('square', 600, 300, 0.12, 0.05, 0.13); break;
    case 'kick': tone('sine', 130, 45, 0.14, 0.18); break;
    case 'hat': noise(0.03, 0.05, 'highpass', 6000); break;
    case 'ding': tone('sine', 1320, 1320, 0.9, 0.08); tone('sine', 1980, 1980, 0.6, 0.03); break;
    case 'choir': [220, 277, 330].forEach(function (f) { tone('sine', f, f, 1.2, 0.05); tone('triangle', f * 2, f * 2, 1.2, 0.015); }); break;
    case 'whistle': tone('sine', 880, 880, 0.3, 0.06); tone('sine', 1100, 1100, 0.35, 0.06, 0.32); break;
    case 'wrap': [392, 523, 659, 784, 659, 784].forEach(function (f, i) { tone('triangle', f, f, 0.18, 0.11, i * 0.12); }); break;
    case 'sting': tone('sine', 440, 660, 0.5, 0.06); tone('sine', 660, 520, 0.7, 0.06, 0.5); break;
    case 'woof': tone('square', 500, 300, 0.07, 0.05); tone('square', 520, 320, 0.07, 0.05, 0.12); break;
    case 'tweet': tone('sine', 2400, 3200, 0.07, 0.05); tone('sine', 2600, 3400, 0.07, 0.05, 0.1); break;
    case 'secret': [784, 988, 1175, 1568].forEach(function (f, i) { tone('sine', f, f, 0.2, 0.08, i * 0.08); }); break;
  }
}

/* ==========================================================
   STYLES
   ========================================================== */
var css = document.createElement('style');
css.textContent =
'html body>.lwmm{position:fixed !important;z-index:2147483000 !important;inset:0 !important}' +
'.lwmm{display:flex;flex-direction:column;margin:0;padding:0;overflow:hidden;color:#fff6fb;font-family:' + BODY + ';background:#12060f;overscroll-behavior:contain;-webkit-tap-highlight-color:transparent}' +
'.lwmm *{box-sizing:border-box}' +
'.lwmm button{font-family:inherit;cursor:pointer;-webkit-user-select:none;user-select:none;touch-action:manipulation}' +
'.lwmm button:focus-visible{outline:3px solid ' + GOLD + ';outline-offset:3px}' +
'.mm-bar{flex:none;display:flex;align-items:center;gap:8px;padding:8px 12px;background:linear-gradient(#2c1031,#1a0a1c);border-bottom:2px solid rgba(255,197,61,.4)}' +
'.mm-title{flex:1;min-width:0;display:flex;align-items:center;gap:10px;font-family:' + DISP + ';font-size:1.75rem;letter-spacing:.07em;line-height:1;white-space:nowrap;overflow:hidden;color:' + GOLD + '}' +
'.mm-title svg{width:34px;height:34px;flex:none}' +
'@media (max-width:620px){.lwmm.gated .mm-bar{padding-top:50px}}' +
'.mm-title span{overflow:hidden;text-overflow:ellipsis;padding-top:3px}' +
'.mm-clock{font-family:' + DISP + ';font-size:1.25rem;letter-spacing:.06em;padding:6px 12px 4px;border-radius:999px;background:' + CREAM + ';color:' + INK + ';border:2px solid ' + INK + ';white-space:nowrap}' +
'.mm-clock[hidden]{display:none}' +
'.mm-tb{min-height:44px;padding:8px 13px;border-radius:12px;border:2px solid rgba(255,246,251,.32);background:rgba(255,255,255,.07);color:#fff6fb;font-weight:700;font-size:.95rem;line-height:1.1}' +
'.mm-tb:hover{background:rgba(255,255,255,.16)}' +
'.mm-tb[aria-pressed="false"]{opacity:.72}' +
'.mm-tb[hidden]{display:none}' +
'.mm-x{min-height:46px;padding:8px 16px;border-radius:12px;border:3px solid ' + INK + ';background:#fff6fb;color:' + INK + ';font-weight:700;font-size:1.02rem;box-shadow:0 4px 0 rgba(0,0,0,.45)}' +
'.mm-x:hover{background:' + GOLD + '}' +
'.mm-stage{position:relative;flex:1;min-height:0;overflow:hidden;background:#0d0510}' +
'.mm-stage canvas.mm-cv{position:absolute;left:0;top:0;display:block;touch-action:none;-webkit-user-select:none;user-select:none;outline:none}' +
'.mm-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
/* the touch pad */
'.mm-pad{position:absolute;left:0;right:0;bottom:0;z-index:2;display:flex;justify-content:space-between;align-items:flex-end;padding:10px 12px 12px;pointer-events:none}' +
'.mm-pad[hidden]{display:none}' +
'.mm-pad.ghost{opacity:.62}' +
'.mm-dp{position:relative;width:174px;height:174px;flex:none;pointer-events:auto}' +
'.mm-pad button{position:absolute;display:grid;place-items:center;border-radius:18px;border:3px solid ' + INK + ';background:rgba(255,248,238,.92);color:' + INK + ';box-shadow:0 4px 0 rgba(0,0,0,.5);touch-action:none;padding:0}' +
'.mm-pad button.on{transform:translateY(3px);box-shadow:0 1px 0 rgba(0,0,0,.5);background:' + GOLD + '}' +
'.mm-pad svg{width:30px;height:30px;pointer-events:none}' +
'.mm-dp .u{left:58px;top:0;width:58px;height:58px}.mm-dp .d{left:58px;top:116px;width:58px;height:58px}' +
'.mm-dp .l{left:0;top:58px;width:58px;height:58px}.mm-dp .r{left:116px;top:58px;width:58px;height:58px}' +
'.mm-ab{position:relative;width:190px;height:174px;flex:none;pointer-events:auto}' +
'.mm-ab .p{right:0;top:44px;width:96px;height:96px;border-radius:50%;background:' + GOLD + ';font-family:' + DISP + ';font-size:1.5rem;letter-spacing:.06em;padding-top:3px}' +
'.mm-ab .p.on{background:#ffe08a}' +
'.mm-ab .j{right:104px;top:104px;width:70px;height:62px;font-family:' + DISP + ';font-size:1.2rem;letter-spacing:.05em;padding-top:3px}' +
'.mm-ab .s{right:104px;top:24px;width:70px;height:62px;font-family:' + DISP + ';font-size:.92rem;letter-spacing:0;line-height:1;padding-top:3px;background:' + TEAL + '}' +
'.mm-ab .s.wait{background:rgba(255,248,238,.6)}' +
'@media (max-width:380px){.mm-dp{transform:scale(.88);transform-origin:left bottom}.mm-ab{transform:scale(.88);transform-origin:right bottom}}' +
/* cards */
'.mm-card{position:absolute;left:50%;top:50%;z-index:4;transform:translate(-50%,-50%);width:min(calc(100% - 20px),600px);max-height:calc(100% - 20px);overflow:auto;overscroll-behavior:contain;' +
'padding:18px 18px 16px;border-radius:20px 26px 20px 24px;background:' + CREAM + ';color:' + INK + ';border:4px solid ' + INK + ';box-shadow:0 0 0 3px ' + GOLD + ',0 10px 0 rgba(0,0,0,.35),0 24px 60px rgba(0,0,0,.55)}' +
'.mm-card[hidden]{display:none}' +
'.mm-card.small{width:min(calc(100% - 20px),420px);text-align:center}' +
'.mm-card h2{margin:6px 0 0;font-family:' + DISP + ';font-weight:400;font-size:2.6rem;line-height:.95;letter-spacing:.04em;color:' + PLUM + '}' +
'.mm-card h3{margin:16px 0 6px;font-family:' + DISP + ';font-weight:400;font-size:1.45rem;letter-spacing:.06em;color:' + PLUM + '}' +
'.mm-card p{margin:6px 0 0;font-size:1rem;line-height:1.4}' +
'.mm-kick{display:inline-block;padding:4px 12px 2px;border-radius:999px;background:' + PLUM + ';color:' + GOLD + ';font-family:' + DISP + ';font-size:1.05rem;letter-spacing:.12em}' +
'.mm-era{display:flex;gap:12px;align-items:center;margin:12px 0 0;padding:10px 12px;border-radius:16px 12px 18px 12px;border:2px solid ' + INK + ';transform:rotate(-.6deg)}' +
'.mm-era canvas{flex:none;width:64px;height:64px;border-radius:10px}' +
'.mm-era b{display:block;font-family:' + DISP + ';font-weight:400;font-size:1.5rem;letter-spacing:.05em;line-height:1}' +
'.mm-era span{display:block;font-size:.88rem;line-height:1.3;margin-top:3px}' +
'.mm-go{display:block;width:100%;min-height:60px;margin-top:14px;border-radius:16px;border:3px solid ' + INK + ';background:' + CORAL + ';color:#fff;font-family:' + DISP + ';font-size:2.1rem;letter-spacing:.1em;padding-top:4px;box-shadow:0 5px 0 ' + INK + '}' +
'.mm-go:hover{background:#ff7166}.mm-go:active{transform:translateY(3px);box-shadow:0 2px 0 ' + INK + '}' +
'.mm-c2{display:block;width:100%;margin-top:10px;min-height:46px;border-radius:14px;border:2px solid #c9b0c1;background:transparent;color:' + INK + ';font-weight:700;font-size:1rem}' +
'.mm-c2:hover{background:#f3e6ee}' +
'.mm-row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
'.mm-row2 .mm-c2{margin-top:8px}' +
'.mm-picks{display:flex;gap:8px;overflow-x:auto;padding:4px 2px 8px;margin:0 -2px;scrollbar-width:thin}' +
'.mm-pk{flex:none;width:110px;padding:6px 4px 6px;border-radius:14px;border:3px solid #e2cfdc;background:#fff;color:' + INK + ';text-align:center;line-height:1.1}' +
'.mm-pk canvas{display:block;width:72px;height:72px;margin:0 auto 4px}' +
'.mm-pk b{display:block;font-family:' + DISP + ';font-weight:400;font-size:1rem;letter-spacing:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
'.mm-pk small{display:block;font-size:.72rem;color:#6a4a62;margin-top:2px}' +
'.mm-pk[aria-pressed="true"]{border-color:' + INK + ';background:#fff1c9;box-shadow:0 4px 0 ' + INK + '}' +
'.mm-pk:disabled{cursor:default;background:#f1e8ee;border-color:#e6d8e1}' +
'.mm-pk:disabled b{color:#8a7084}' +
'.mm-ward{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
'.mm-wb{display:flex;align-items:center;gap:8px;min-height:52px;padding:6px 10px;border-radius:14px;border:2px solid #d9c3d3;background:#fff;color:' + INK + ';text-align:left}' +
'.mm-wb canvas{width:40px;height:40px;flex:none}' +
'.mm-wb span{display:block;font-size:.72rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6a4a62}' +
'.mm-wb b{display:block;font-family:' + DISP + ';font-weight:400;font-size:1.2rem;letter-spacing:.04em;line-height:1}' +
'.mm-wb:disabled{opacity:.55;cursor:default}' +
'.mm-tip{font-size:.84rem !important;color:#6a4a62;margin-top:10px !important}' +
'.mm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:9px;margin-top:12px}' +
'.mm-tile{padding:8px 6px 8px;border-radius:14px 10px 16px 12px;border:2px solid #e2cfdc;background:#fff;text-align:center;line-height:1.15}' +
'.mm-tile canvas{display:block;width:72px;height:72px;margin:0 auto 4px}' +
'.mm-tile b{display:block;font-family:' + DISP + ';font-weight:400;font-size:1.08rem;letter-spacing:0;overflow-wrap:anywhere}' +
'.mm-tile small{display:block;font-size:.76rem;color:#5d4157;margin-top:3px}' +
'.mm-tile.lock{background:#f3ebf0;border-style:dashed}' +
'.mm-tile.lock b{color:#8a7084}' +
'.mm-tile.next{border:3px solid ' + GOLD + ';background:#fff8e0}' +
'.mm-tile.next small{font-weight:700;color:' + PLUM + '}' +
'.mm-poster{display:block;flex:none;border-radius:6px;box-shadow:0 5px 0 rgba(0,0,0,.25);transform:rotate(-2deg)}' +
'.mm-rev{display:flex;gap:14px;align-items:center;margin-top:10px;text-align:left}' +
'.mm-rev .mm-stars{justify-content:flex-start;margin:0}' +
'.mm-rev .mm-quote{margin-top:6px !important}' +
'.mm-card.review h2{font-size:2rem}' +
'@media (max-width:480px){.mm-card.review h2{font-size:1.7rem}.mm-rev{gap:10px}.mm-rev .mm-stars svg{width:28px;height:28px}.mm-quote{font-size:.95rem !important}}' +
'.mm-stars{display:flex;justify-content:center;gap:4px;margin:10px 0 0}' +
'.mm-stars svg{width:38px;height:38px}' +
'.mm-stars .on{animation:mmstar .5s cubic-bezier(.2,1.6,.4,1) both}' +
'.mm-stars .on:nth-child(2){animation-delay:.1s}.mm-stars .on:nth-child(3){animation-delay:.2s}.mm-stars .on:nth-child(4){animation-delay:.3s}.mm-stars .on:nth-child(5){animation-delay:.4s}' +
'@keyframes mmstar{0%{transform:scale(.2) rotate(-40deg);opacity:0}100%{transform:scale(1) rotate(0);opacity:1}}' +
'.mm-quote{margin:10px 0 0 !important;font-style:italic;font-size:1.05rem !important}' +
'.mm-quote small{display:block;font-style:normal;font-size:.8rem;color:#6a4a62;margin-top:2px}' +
'.mm-badge{display:inline-block;margin:6px 0 0;padding:5px 14px 3px;border-radius:999px;background:' + GOLD + ';border:2px solid ' + INK + ';font-family:' + DISP + ';font-size:1.2rem;letter-spacing:.06em;transform:rotate(-2deg)}' +
'.mm-nums{display:flex;justify-content:center;gap:8px;margin:12px 0 0;flex-wrap:wrap}' +
'.mm-nums div{flex:1;min-width:84px;max-width:130px;padding:6px 6px;border-radius:14px;background:#f3e6ee;border:2px solid #e6d3df}' +
'.mm-nums span{display:block;font-size:.7rem;font-weight:700;color:#5d4157;text-transform:uppercase;letter-spacing:.07em}' +
'.mm-nums b{display:block;font-family:' + DISP + ';font-weight:400;font-size:1.7rem;line-height:1.05;letter-spacing:.03em}' +
'.mm-bits{display:flex;justify-content:center;gap:2px 14px;flex-wrap:wrap;margin:10px 0 0;font-size:.9rem;color:#5d4157}' +
'.mm-bits b{color:' + INK + ';font-family:' + DISP + ';font-weight:400;font-size:1.2rem;letter-spacing:.03em}' +
'.mm-new{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:12px 0 0}' +
'.mm-new div{width:120px}' +
'.mm-new canvas{display:block;width:84px;height:84px;margin:0 auto}' +
'.mm-new b{display:block;font-family:' + DISP + ';font-weight:400;font-size:1.3rem;letter-spacing:.04em}' +
'.mm-new small{display:block;font-size:.8rem;color:#5d4157}' +
'.mm-pop{animation:mmpop .55s cubic-bezier(.2,1.6,.4,1) both}' +
'@keyframes mmpop{0%{transform:scale(.4) rotate(-8deg)}100%{transform:scale(1) rotate(-2deg)}}' +
'@media (max-height:600px){.mm-bar{padding:5px 12px}.mm-tb,.mm-x{min-height:40px}.mm-card h2{font-size:2.1rem}}' +
'@media (max-width:480px){.mm-tb{padding:8px 10px;font-size:.88rem}.mm-title span{display:none}.mm-x{padding:8px 12px}.mm-clock{font-size:1.05rem;padding:5px 9px 3px}' +
'.mm-card{padding:14px 12px 12px}.mm-card h2{font-size:2.15rem}.mm-pk{width:100px}.mm-pk canvas{width:62px;height:62px}.mm-grid{grid-template-columns:repeat(auto-fill,minmax(100px,1fr))}.mm-era canvas{width:52px;height:52px}}' +
'@media (prefers-reduced-motion:reduce){.mm-pop,.mm-stars .on{animation:none}.mm-pop{transform:rotate(-2deg)}}' +
/* the optional launcher in the hero (data-button) */
'.lwmm-launch{display:flex;flex-direction:column;align-items:flex-start;gap:8px;margin:18px 0 0}' +
'.lwmm-open{display:inline-flex;align-items:center;gap:12px;cursor:pointer;font-family:' + DISP + ';font-size:1.65rem;letter-spacing:.09em;line-height:1;padding:10px 20px 9px 12px;border-radius:16px;border:3px solid ' + INK + ';background:' + GOLD + ';color:' + INK + ';box-shadow:0 5px 0 #6e1730;transition:transform .12s}' +
'.lwmm-open:hover{transform:translateY(-2px)}.lwmm-open:active{transform:translateY(3px);box-shadow:0 2px 0 #6e1730}' +
'.lwmm-open svg{width:36px;height:36px;flex:none}' +
'.lwmm-open span{padding-top:3px}' +
'.lwmm-note{margin:0;font-size:.95rem;color:var(--mist,#e8d2e2)}' +
'@media (prefers-reduced-motion:reduce){.lwmm-open{transition:none}}';
document.head.appendChild(css);

/* the clapperboard icon */
var ICON_SVG = '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="5" y="15" width="30" height="20" rx="2" fill="#2a1030"/><rect x="8" y="19" width="24" height="3" fill="#fff8ee"/><rect x="8" y="25" width="16" height="3" fill="#fff8ee" opacity=".7"/>' +
  '<g transform="rotate(-16 5 15)"><rect x="5" y="8" width="30" height="7" rx="1.5" fill="#fff8ee" stroke="#2a1030" stroke-width="1.5"/><path d="M10 8l4 7M18 8l4 7M26 8l4 7" stroke="#2a1030" stroke-width="3"/></g>' +
  '<circle cx="31" cy="30" r="5" fill="#ffc53d" stroke="#2a1030" stroke-width="1.5"/><circle cx="29.5" cy="29" r="1.6" fill="#2a1030"/></svg>';

/* ==========================================================
   THE TAKE
   ========================================================== */
var GY = 500;                 /* street level (world units) */
var G = null;                 /* the take in progress */
var state = 'closed';         /* closed | menu | intro | play | paused | ending | over */
var ui = {}, ctx = null, raf = 0, lastTs = 0, opener = null, prevOverflow = '';
var V = { W: 0, H: 0, k: 1, offY: 0, dpr: 1, viewW: 0, padH: 0, cam: 0 };
var inp = { l: 0, r: 0, u: 0, d: 0, p: 0, j: 0, s: 0, uHit: 0, dHit: 0, jHit: 0, sHit: 0, pHit: 0 };
var keyDown = {};
var goal = { on: false, x: 0, y: 0 };
var cloth = null;             /* the painted backdrop, drawn once per layout */

/* pools, so a take makes no garbage per frame */
var PMAX = 240, P = [], pI = 0;
for (var _i = 0; _i < PMAX; _i++) P.push({ on: false, x: 0, y: 0, vx: 0, vy: 0, g: 0, life: 0, max: 1, kind: 0, col: '#fff', r: 2, rot: 0, vr: 0 });
var TMAX = 24, TX = [], tI = 0;
for (_i = 0; _i < TMAX; _i++) TX.push({ on: false, x: 0, y: 0, vy: 0, life: 0, max: 1, txt: '', col: '#fff', size: 20, big: false });
var PK = { dust: 0, card: 1, conf: 2, glass: 3, star: 4, note: 5, ring: 6, smoke: 7, tinsel: 8 };
var CONF = ['#ffc53d', '#2ed3c6', '#ff5a4e', '#c99bff', '#fff6fb', '#7cf5c9'];

function part(kind, x, y, vx, vy, life, col, r, g) {
  if (RM && (kind === PK.conf || kind === PK.card) && Math.random() < 0.5) return;
  var p = P[pI]; pI = (pI + 1) % PMAX;
  p.on = true; p.kind = kind; p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.life = 0; p.max = life; p.col = col; p.r = r; p.g = g == null ? 600 : g;
  p.rot = Math.random() * TAU; p.vr = rnd(-8, 8);
}
function txt(s, x, y, col, size, big) {
  var t = TX[tI]; tI = (tI + 1) % TMAX;
  t.on = true; t.txt = s; t.x = x; t.y = y; t.vy = big ? -18 : -46; t.life = 0; t.max = big ? 1.3 : 0.9; t.col = col || '#fff6fb'; t.size = size || 20; t.big = !!big;
}
function burst(x, y, n, kind, cols, sp, life, r) {
  for (var i = 0; i < n; i++) {
    var a = rnd(-Math.PI, 0), v = rnd(sp * 0.4, sp);
    part(kind, x, y, Math.cos(a) * v, Math.sin(a) * v, life * rnd(0.7, 1.2), typeof cols === 'string' ? cols : pick(cols), r * rnd(0.7, 1.3));
  }
}

/* ---------- director lines ---------- */
var SAY = {
  start: ['Action!', 'And... action!', 'Places! Action!'],
  fold: ['Bigger!', 'More menace!', 'Magnificent!', 'Yes! Bigger!', 'Gorgeous!', 'Print that!'],
  tank: ['Lovely!', 'The tank is fine, carry on!', 'Very brave tank.'],
  heli: ['Mind the fishing rod!', 'Lovely swat!'],
  hurt: ['Keep going, darling!', 'Shake it off!', 'Stay in character!'],
  low: ['Find the catering!', 'Snacks! Get some snacks!'],
  reel: ['Thirty seconds of film left!'],
  grow: ['Bigger!', 'BIGGER!', 'Even bigger!'],
  beat: ['On the beat!', 'Feel the music!'],
  knock: ['Whoops! Still rolling!', 'Back up you get!']
};

/* ---------- making the take ---------- */
function newTake() {
  refreshLadder();
  var era = eraNow(), E = ERA[era.id], setKey = store.pick.set, set = SETS[setKey], mk = store.pick.monster, M = MON[mk];
  var mode = store.pick.mode;
  store.takes[setKey] = (store.takes[setKey] || 0) + 1; saveStore();
  G = {
    era: era, E: E, xmas: era.id === 'future', set: set, setKey: setKey, mk: mk, M: M, mode: mode, hat: store.pick.hat, prop: store.pick.prop, suit: store.pick.suit,
    take: store.takes[setKey], t: 0, real: 0, slow: mode === 'slow' ? 0.62 : 1, reel: set.reel, reelLeft: set.reel,
    grav: (era.id === 'future' || set.low) ? 720 : 1350,
    blds: [], tanks: [], helis: [], megs: [], runners: [], proj: [], boulders: [], train: null, table: null,
    money: 0, growth: 0, s: 1, sT: 1, gusto: 100, lvl: 0,
    st: { windows: 0, folds: 0, tanks: 0, helis: 0, megs: 0, snacks: 0, stunts: 0, beats: 0 },
    spawnT: 4, extraT: 0.5, tableT: 40, occT: 2, say: null, sayT: 0, sayGap: 0, smashes: 0, choir: 0,
    dramatic: 0, slowmo: 0, shake: 0, beat: 0, beatN: 0, intro: 0, endT: 0, endKind: '', allDown: false,
    dirTaps: 0, dirJay: false, birdOn: false, still: 0, hint: store.wraps < 2 ? 7 : 0, reel30: false, lowSaid: false,
    found: {}, secretsNew: [],
    jayAt: Math.random() < 0.4 ? rnd(14, 70) : -1, jayCell: null, jayDone: false,
    bonAt: Math.random() < 0.45 ? rnd(10, 90) : -1, bonDone: false,
    boxAt: (Math.random() < 0.16 || ((store.wraps + 1) % 9 === 0 && !store.secrets.box)) ? rnd(18, 80) : -1, box: null,
    trainT: 14
  };
  var f = qp('force');
  if (f === 'jay') G.jayAt = 2; if (f === 'bonnie') G.bonAt = 2; if (f === 'box') G.boxAt = 2;
  var x = 150;
  set.b.forEach(function (d, i) {
    var bw = d[0], bh = d[1], kind = d[2];
    var b = { i: i, x: x, w: bw, h: bh, top: GY - bh, kind: kind, cells: [], dmg: 0, need: 0, fold: 0, down: false, shake: 0, tint: E.wall[i % E.wall.length], lean: 0 };
    var cols = Math.max(2, Math.floor((bw - 18) / 34)), rows = Math.max(3, Math.floor((bh - 34) / 40));
    var cw = (bw - 18) / cols, ch = (bh - 34) / rows;
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      b.cells.push({ c: c, r: r, x: x + 9 + c * cw, y: b.top + 22 + r * ch, w: cw, h: ch, cx: x + 9 + (c + 0.5) * cw, cy: b.top + 22 + (r + 0.5) * ch,
        st: 0, occ: null, occT: 0, lit: Math.random() < 0.35, seed: Math.random() * 1000 });
    }
    b.need = Math.ceil(b.cells.length * 0.72);
    G.blds.push(b);
    x += bw + Math.round(rnd(54, 86));
  });
  G.W = x - 60 + 130;
  /* sprinkle a few people and snacks in the windows */
  for (var n = 0; n < 6; n++) seedOcc(n < 2 ? 'snack' : 'extra');
  var m = { x: 70, y: GY, vx: 0, vy: 0, face: 1, st: 'stand', on: -1, stun: 0, punchT: 0, pAnim: 0, hurt: 0, wob: 0, squash: 0, spCd: 2, spOn: 0,
    walk: 0, airFrom: GY, flop: 0, beam: 0, beamTick: 0, neck: 0, neckV: 0, bob: 0 };
  if (M.fly) m.y = GY;
  G.m = m;
  /* the crew in shot, who scatter when the clapper goes */
  for (var c2 = 0; c2 < 3; c2++) G.runners.push({ kind: 'crew', v: c2, x: 180 + c2 * 150 + rnd(-20, 20), y: GY, dir: c2 % 2 ? 1 : -1, sp: 0, t: rnd(0, 3), y0: GY, vy: 0, wave: 0, done: false });
  for (var e = 0; e < 4; e++) spawnExtra(rnd(300, G.W - 200));
  G.say = null;
  V.cam = clamp(m.x - V.viewW / 2, Math.min(0, (G.W - V.viewW) / 2), Math.max((G.W - V.viewW) / 2, G.W - V.viewW));
}

function seedOcc(kind) {
  var b = pick(G.blds); if (b.down || b.fold) return;
  var c = pick(b.cells); if (c.st || c.occ) return;
  c.occ = kind; c.occT = 0; c.lit = true;
}

function spawnExtra(x) {
  var era = G.era.id;
  G.runners.push({ kind: era === 'egypt' ? 'cat' : 'extra', v: Math.floor(Math.random() * 5), x: x, y: GY, dir: Math.random() < 0.5 ? -1 : 1, sp: rnd(22, 40), t: rnd(0, 5),
    y0: GY, vy: 0, wave: 0, done: false, scared: false, hat: Math.random() < 0.5 });
}

/* ---------- money and growing ---------- */
function earn(n, x, y, label) {
  var mult = 1;
  if (G.mode === 'musical' && G.onBeat) mult = 2;
  n = Math.round(n * mult);
  G.money += n;
  if (x != null) txt((label ? label + ' ' : '') + '+' + money(n), x, y, mult > 1 ? GOLD : '#fff6fb', label ? 18 : 16);
}
function grow(n) {
  G.growth += n;
  G.sT = 1 + Math.min(0.62, G.growth * 0.045);
  var lvl = G.sT >= 1.55 ? 4 : G.sT >= 1.4 ? 3 : G.sT >= 1.25 ? 2 : G.sT >= 1.12 ? 1 : 0;
  if (lvl > G.lvl) {
    G.lvl = lvl; sfx('level');
    txt(lvl >= 4 ? 'HUGE!' : 'BIGGER!', G.m.x, G.m.y - 110 * G.s, GOLD, 34, true);
    say(SAY.grow[Math.min(SAY.grow.length - 1, lvl - 1)], 3);
  }
}
function say(s, pri) {
  if (G.sayGap > 0 && (pri || 1) <= (G.say ? G.say.pri : 2)) return;
  if (Array.isArray(s)) s = pick(s);
  if (G.slow < 1 && Math.random() < 0.3) s = s.replace(/([aeiou])/i, '$1$1$1');
  G.say = { txt: s, t: 0, pri: pri || 1 }; G.sayGap = 2.4;
}

/* ---------- secrets ---------- */
function findSecret(id) {
  if (G && G.found[id]) return;
  if (G) G.found[id] = true;
  if (store.secrets[id]) return;
  store.secrets[id] = true; saveStore();
  if (G) G.secretsNew.push(id);
  sfx('secret');
  toast('Secret found! ' + secretById(id).name);
}
function secretById(id) { for (var i = 0; i < SECRETS.length; i++) if (SECRETS[i].id === id) return SECRETS[i]; return SECRETS[0]; }

/* ---------- the monster's body ---------- */
function mW() { return G.M.w * G.s; }
function mH() { return G.M.h * G.s; }
function headY(m) { return m.y - mH(); }
function inSpan(b, x, pad) { return !b.down && !b.fold && x > b.x + (pad || 6) && x < b.x + b.w - (pad || 6); }
function bldAt(x) { for (var i = 0; i < G.blds.length; i++) if (inSpan(G.blds[i], x)) return G.blds[i]; return null; }
function fist(out) {
  var m = G.m, w = mW(), h = mH(), R = G.M.reach * G.s;
  if (G.M.stretch) { out.x = m.x + m.face * (w * 0.5 + R * 0.4); out.y = m.y - h + 14 * G.s; out.r = 20 + R * 0.6; return out; }
  if (m.st === 'stand' && m.on >= 0) { out.x = m.x + m.face * w * 0.25; out.y = m.y + 16; out.r = 18 + R * 0.5; return out; }
  if (m.st === 'wall') { out.x = m.x + m.face * w * 0.4; out.y = m.y - h * 0.62; out.r = 18 + R * 0.55; return out; }
  out.x = m.x + m.face * (w * 0.5 + R * 0.45); out.y = m.y - h * 0.58; out.r = 18 + R * 0.6; return out;
}
var FP = { x: 0, y: 0, r: 0 };

/* ---------- hitting things ---------- */
function punch() {
  var m = G.m;
  if (m.punchT > 0 || m.stun > 0) return;
  m.punchT = G.mk === 'robot' ? 0.34 : 0.27; m.pAnim = 0.2;
  if (m.st === 'stand' && m.on >= 0) m.squash = 0.18;
  fist(FP);
  if (G.mode === 'musical') { var ph = G.beat; G.onBeat = ph < 0.13 || ph > 0.87; if (G.onBeat) { G.st.beats++; if (G.st.beats % 4 === 1) say(SAY.beat, 1); } }
  else G.onBeat = false;
  var hit = false, i, R2;
  /* foam darts and words pop */
  for (i = 0; i < G.proj.length; i++) {
    var p = G.proj[i]; if (p.dead) continue;
    if (Math.abs(p.x - FP.x) < FP.r + 10 && Math.abs(p.y - FP.y) < FP.r + 10) { p.dead = true; hit = true; sfx('pop'); burst(p.x, p.y, 5, PK.conf, CONF, 120, 0.5, 3); earn(20, p.x, p.y); }
  }
  /* the helicopter on its fishing rod */
  for (i = 0; i < G.helis.length; i++) {
    var h = G.helis[i]; if (h.out) continue;
    if (Math.abs(h.x - FP.x) < FP.r + 30 && Math.abs(h.y - FP.y) < FP.r + 22) { swatHeli(h); hit = true; }
  }
  /* tanks and the man with the megaphone (only near the ground) */
  if (FP.y > GY - 90 - 40 * G.s) {
    for (i = 0; i < G.tanks.length; i++) {
      var t = G.tanks[i]; if (t.out) continue;
      if (Math.abs(t.x - FP.x) < FP.r + t.w * 0.5 && FP.y > GY - t.h - 40) { foldTank(t, m.face); hit = true; }
    }
    for (i = 0; i < G.megs.length; i++) {
      var g = G.megs[i]; if (g.out) continue;
      if (Math.abs(g.x - FP.x) < FP.r + 18) { shooMeg(g); hit = true; }
    }
  }
  /* the walls */
  R2 = FP.r * FP.r;
  var many = G.s >= 1.55 ? 3 : G.s >= 1.3 ? 2 : 1;
  var best = [null, null, null], bestD = [1e9, 1e9, 1e9], bestB = [null, null, null];
  for (i = 0; i < G.blds.length; i++) {
    var b = G.blds[i]; if (b.down || b.fold) continue;
    if (FP.x < b.x - FP.r || FP.x > b.x + b.w + FP.r || FP.y < b.top - FP.r) continue;
    for (var c = 0; c < b.cells.length; c++) {
      var cl = b.cells[c]; if (cl.st >= 2) continue;
      var dx = cl.cx - FP.x, dy = cl.cy - FP.y, d2 = dx * dx + dy * dy;
      if (d2 > R2 * 2.2) continue;
      for (var k = 0; k < many; k++) if (d2 < bestD[k]) {
        for (var q = many - 1; q > k; q--) { bestD[q] = bestD[q - 1]; best[q] = best[q - 1]; bestB[q] = bestB[q - 1]; }
        bestD[k] = d2; best[k] = cl; bestB[k] = b; break;
      }
    }
  }
  for (i = 0; i < many; i++) if (best[i]) { hitCell(bestB[i], best[i], G.M.dmg); hit = true; }
  if (G.prop === 'chicken') { sfx('squeak'); }
  G.onBeat = false;
  if (hit) {
    sfx('punch');
    if (G.prop === 'chicken') txt('SQUEAK', FP.x, FP.y - 20, '#ffe08a', 18);
    else if (Math.random() < 0.3) txt(pick(['POW', 'BONK', 'WHAM', 'THWACK', 'BIFF']), FP.x, FP.y - 22, GOLD, 22);
    if (!RM) G.shake = Math.max(G.shake, 0.08);
  } else sfx('whiff');
}

function hitCell(b, cl, power) {
  b.shake = 0.18;
  if (cl.st === 0 && power < 2) {
    cl.st = 1; sfx('crack'); earn(15);
    burst(cl.cx, cl.cy, 3, PK.glass, '#dff4ff', 90, 0.45, 2.5);
  } else {
    cl.st = 2; sfx('smash'); G.st.windows++; G.smashes++;
    earn(60, cl.cx, cl.cy);
    burst(cl.cx, cl.cy, 7, PK.glass, '#e6f6ff', 160, 0.6, 3);
    burst(cl.cx, cl.cy, 3, PK.card, b.tint, 140, 0.8, 4);
    if (cl.occ) releaseOcc(b, cl);
    if (G.era.id === 'viking' && G.smashes % 8 === 0) { G.choir = 4; sfx('choir'); txt('The choir sings', G.m.x, G.m.y - 140 * G.s, GOLD, 20, true); say('Everybody, listen!', 2); }
  }
  b.dmg = 0;
  for (var i = 0; i < b.cells.length; i++) b.dmg += b.cells[i].st === 2 ? 1 : b.cells[i].st === 1 ? 0.35 : 0;
  if (b.dmg >= b.need && !b.fold) foldBld(b);
}

function releaseOcc(b, cl) {
  var o = cl.occ; cl.occ = null;
  if (o === 'snack') {
    G.st.snacks++;
    eatSnack(cl.cx, cl.cy, 16);
  } else if (o === 'extra') {
    G.st.stunts++;
    G.runners.push({ kind: G.era.id === 'egypt' ? 'cat' : 'extra', v: Math.floor(Math.random() * 5), x: cl.cx, y: cl.cy + 10, dir: G.m.x < cl.cx ? 1 : -1, sp: 70,
      t: 0, y0: GY, vy: -160, wave: 1, stunt: true, mat: cl.cx, done: false, scared: true, hat: Math.random() < 0.5 });
    G.runners.push({ kind: 'mat', x: cl.cx, y: GY, t: 0, life: 3.2, done: false });
    earn(150, cl.cx, cl.cy - 16, 'Stunt!');
  } else if (o === 'jay') {
    G.jayDone = true;
    G.runners.push({ kind: 'jay', x: cl.cx, y: cl.cy, vy: -40, t: 0, dir: 1, done: false });
    say('Unhand me, goblin!', 5);
    findSecret('jaywin');
  }
}

function eatSnack(x, y, gus) {
  var m = G.m;
  G.gusto = Math.min(100, G.gusto + gus);
  grow(0.6);
  sfx('eat');
  if (G.era.id === 'future') { sfx('pop'); burst(x, y, 14, PK.conf, CONF, 200, 0.8, 3.5); txt('POP! ' + G.E.snack, x, y - 10, GOLD, 18); G.gusto = Math.min(100, G.gusto + 6); }
  else txt('Yum! ' + G.E.snack, x, y - 10, '#7cf5c9', 17);
  earn(100);
  part(PK.ring, m.x, headY(m) + 10, 0, 0, 0.5, '#7cf5c9', 30, 0);
}

function foldBld(b) {
  b.fold = 0.001;
  sfx('fold'); G.st.folds++;
  earn(800 + Math.round(b.h * 2), b.x + b.w / 2, b.top - 10, 'Flat!');
  grow(2.2);
  say(SAY.fold, 3);
  if (!RM) G.shake = 0.5;
  for (var i = 0; i < b.cells.length; i++) if (b.cells[i].occ === 'extra') releaseOcc(b, b.cells[i]); else b.cells[i].occ = null;
  if (G.prop === 'confetti') { burst(b.x + b.w * 0.5, b.top, 40, PK.conf, CONF, 340, 1.6, 4); burst(b.x + b.w * 0.2, b.top + 30, 14, PK.conf, CONF, 260, 1.4, 4); }
  if (G.era.id === 'stone') {
    var dir = G.m.x < b.x + b.w / 2 ? 1 : -1;
    G.boulders.push({ x: b.x + b.w / 2, y: GY - 26, r: 26, dir: dir, rot: 0, life: 7 });
    txt('Boulder!', b.x + b.w / 2, b.top + 30, GOLD, 22, true);
  }
  var m = G.m;
  if (m.on === b.i && (m.st === 'wall' || m.st === 'stand')) { m.st = 'air'; m.vy = -120; m.on = -1; m.airFrom = m.y; }
  var all = true;
  for (var k = 0; k < G.blds.length; k++) if (!G.blds[k].fold && !G.blds[k].down) all = false;
  if (all) { G.allDown = true; G.endT = 1.9; }
}

function foldTank(t, dir) {
  if (t.out) return;
  t.out = true; t.lift = 0; t.spin = dir || 1;
  G.st.tanks++; sfx('boink');
  earn(300, t.x, t.y - t.h - 10);
  burst(t.x, t.y - 20, 6, PK.card, '#9aa58c', 160, 0.8, 4);
  grow(0.3);
  if (Math.random() < 0.35) say(SAY.tank, 1);
  if (t.kind === 'horse') {
    /* the pantomime horse comes apart and both halves run off */
    G.runners.push({ kind: 'halfF', x: t.x + 12, y: GY, dir: 1, sp: 120, t: 0, done: false });
    G.runners.push({ kind: 'halfB', x: t.x - 12, y: GY, dir: -1, sp: 120, t: 0, done: false });
    t.lift = 99;
    txt('Horse split!', t.x, t.y - 60, GOLD, 20);
  }
}
function swatHeli(h) {
  if (h.out) return;
  h.out = true; h.spinV = 9;
  G.st.helis++; sfx('reel');
  earn(400, h.x, h.y - 30);
  burst(h.x, h.y, 6, PK.card, '#cfd8e0', 140, 0.6, 3);
  grow(0.4);
  if (Math.random() < 0.4) say(SAY.heli, 1);
}
function shooMeg(g) {
  if (g.out) return;
  g.out = true; G.st.megs++;
  earn(200, g.x, g.y - 70);
  G.runners.push({ kind: 'meg', x: g.x, y: GY, dir: g.x < G.m.x ? -1 : 1, sp: 130, t: 0, done: false, wave: 1 });
}

/* ---------- specials ---------- */
function special() {
  var m = G.m, M = G.M, i;
  if (m.spCd > 0 || m.stun > 0) return;
  m.spCd = M.cd; m.spOn = 0.6;
  var R = 250 * G.s, cx = m.x, cy = m.y - mH() * 0.6;
  if (M.sp === 'roar') {
    sfx('roar'); txt('ROAR!', cx, cy - 50, GOLD, 34, true);
    for (i = 0; i < 4; i++) part(PK.ring, cx, cy, 0, 0, 0.5 + i * 0.15, GOLD, 30, 0);
    for (i = 0; i < G.tanks.length; i++) if (Math.abs(G.tanks[i].x - cx) < R) foldTank(G.tanks[i], G.tanks[i].x < cx ? -1 : 1);
    for (i = 0; i < G.megs.length; i++) if (Math.abs(G.megs[i].x - cx) < R) shooMeg(G.megs[i]);
    for (i = 0; i < G.proj.length; i++) G.proj[i].dead = true;
    crackNear(cx, cy, R * 0.7, 4);
    if (!RM) G.shake = 0.35;
  } else if (M.sp === 'flop') {
    if (m.st === 'air') { m.flop = 1; m.vy = 900; }
    else { m.st = 'air'; m.on = -1; m.vy = -M.jump * 0.85; m.flop = 2; m.airFrom = m.y; }
    sfx('boink'); txt('Belly flop!', cx, cy - 50, GOLD, 26, true);
  } else if (M.sp === 'torch') {
    m.beam = 0.9; m.beamTick = 0; sfx('beam'); txt('Torch eyes!', cx, cy - 50, GOLD, 24, true);
  } else if (M.sp === 'gust') {
    sfx('gust'); txt('WHOOSH', cx + m.face * 60, cy - 30, '#e8f6ff', 30, true);
    for (i = 0; i < 18; i++) part(PK.smoke, cx + m.face * 30, cy + rnd(-40, 40), m.face * rnd(250, 420), rnd(-40, 40), 0.7, 'rgba(255,255,255,.7)', rnd(6, 12), 0);
    for (i = 0; i < G.helis.length; i++) { var h = G.helis[i]; if ((h.x - cx) * m.face > -40 && Math.abs(h.x - cx) < R * 1.2) swatHeli(h); }
    for (i = 0; i < G.tanks.length; i++) { var t = G.tanks[i]; if ((t.x - cx) * m.face > -40 && Math.abs(t.x - cx) < R) foldTank(t, m.face); }
    for (i = 0; i < G.megs.length; i++) if (Math.abs(G.megs[i].x - cx) < R) shooMeg(G.megs[i]);
    for (i = 0; i < G.proj.length; i++) G.proj[i].dead = true;
    crackNear(cx + m.face * 80, cy, R * 0.6, 4);
  } else if (M.sp === 'voice') {
    sfx('voice');
    var bx = clamp(cx - m.face * 300, 60, G.W - 60);
    G.decoy = { x: bx, y: GY - 120, t: 5 };
    txt('Over here!', bx, GY - 150, '#fff6fb', 26, true);
    var n = 0;
    for (i = 0; i < G.tanks.length; i++) if (!G.tanks[i].out) { G.tanks[i].conf = 5; n++; }
    for (i = 0; i < G.helis.length; i++) if (!G.helis[i].out) { G.helis[i].conf = 5; n++; }
    for (i = 0; i < G.megs.length; i++) if (!G.megs[i].out) { G.megs[i].conf = 5; n++; }
    if (n) earn(100 * n, cx, cy - 60, 'Fooled!');
  }
}
function crackNear(x, y, R, n) {
  var hits = 0;
  for (var i = 0; i < G.blds.length && hits < n; i++) {
    var b = G.blds[i]; if (b.down || b.fold) continue;
    for (var c = 0; c < b.cells.length && hits < n; c++) {
      var cl = b.cells[c];
      if (cl.st < 2 && Math.abs(cl.cx - x) < R && Math.abs(cl.cy - y) < R * 0.7 && Math.random() < 0.6) { hitCell(b, cl, 1); hits++; if (b.fold) break; }
    }
  }
}

/* ---------- getting hit (never hurt: it just knocks the gusto) ---------- */
function bump(amount, fromX) {
  var m = G.m;
  if (m.hurt > 0.25 || G.endT) return;
  m.hurt = 0.7;
  G.gusto = Math.max(0, G.gusto - amount);
  sfx('boink');
  if (m.st === 'wall') {
    m.wob += 1;
    if (m.wob >= 2.2) {
      m.st = 'air'; m.on = -1; m.vy = -160; m.vx = (m.x < fromX ? -1 : 1) * 110; m.stun = 0.9; m.wob = 0; m.airFrom = m.y;
      txt('Whoops!', m.x, m.y - mH() - 20, '#ffe08a', 24, true); say(SAY.knock, 2);
    }
  } else if (Math.random() < 0.25) say(SAY.hurt, 1);
  if (G.gusto < 30 && !G.lowSaid) { G.lowSaid = true; say(SAY.low, 3); }
  if (G.gusto <= 0) endTake('cut');
}

function endTake(kind) {
  if (G.endKind) return;
  G.endKind = kind;
  state = 'ending'; G.endShow = 0;
  goal.on = false;
  if (kind === 'cut') { sfx('clap'); say('Cut!', 9); }
  else { sfx('wrap'); say("That's a wrap!", 9); }
  if (G.allDown) { findSecret('grandad'); }
}

/* ==========================================================
   UPDATE
   ========================================================== */
function step(dtReal) {
  if (!G) return;
  var dt = dtReal * G.slow * (G.slowmo > 0 ? 0.4 : 1);
  if (G.slowmo > 0) G.slowmo -= dtReal;
  G.real += dtReal; G.t += dt;
  if (G.sayGap > 0) G.sayGap -= dtReal;
  if (G.say) { G.say.t += dtReal; if (G.say.t > 2.6) G.say = null; }
  if (G.shake > 0) G.shake = Math.max(0, G.shake - dtReal * 1.6);
  G.s += (G.sT - G.s) * Math.min(1, dt * 3);
  /* the beat (musical number dances to it; the music follows it too) */
  var bpm = G.mode === 'musical' ? 116 : 104;
  G.beat = (G.real * bpm / 60) % 1;

  stepParts(dtReal);
  if (state === 'ending') {
    G.endShow += dtReal;
    stepActors(dt, true);
    if (G.endShow > 2.1) showReview();
    return;
  }
  if (state !== 'play') return;

  G.reelLeft -= dtReal;
  if (G.reelLeft <= 30 && !G.reel30) { G.reel30 = true; say(SAY.reel, 4); }
  if (G.reelLeft <= 0) { G.reelLeft = 0; endTake('wrap'); return; }
  if (G.endT) { G.endT -= dtReal; if (G.endT <= 0) { endTake('wrap'); return; } }
  if (G.hint > 0) G.hint -= dtReal;

  /* a slow drain on gusto, so the catering matters */
  G.gusto = Math.max(0, G.gusto - dt * (G.t < 30 ? 0.12 : 0.28));
  if (G.gusto <= 0) { endTake('cut'); return; }

  stepMonster(dt);
  stepActors(dt, false);
  stepSpawns(dt);
  stepSecrets(dt, dtReal);
  /* camera */
  var m = G.m, lo = Math.min(0, (G.W - V.viewW) / 2), hi = Math.max((G.W - V.viewW) / 2, G.W - V.viewW);
  var want = clamp(m.x - V.viewW / 2 + m.face * V.viewW * 0.08, lo, hi);
  V.cam += (want - V.cam) * Math.min(1, dtReal * 4);
}

function stepMonster(dt) {
  var m = G.m, M = G.M, s = G.s, i;
  if (m.punchT > 0) m.punchT -= dt;
  if (m.pAnim > 0) m.pAnim -= dt;
  if (m.hurt > 0) m.hurt -= dt;
  if (m.spCd > 0) m.spCd -= dt;
  if (m.spOn > 0) m.spOn -= dt;
  if (m.squash > 0) m.squash -= dt;
  if (m.stun > 0) m.stun -= dt;
  if (m.wob > 0 && m.st !== 'wall') m.wob = 0;
  if (m.wob > 0) m.wob = Math.max(0, m.wob - dt * 0.35);

  /* input: keys and the pad, or the tap goal */
  var L = inp.l, R = inp.r, U = inp.u, D = inp.d, J = inp.jHit, Pn = inp.p || inp.pHit, S = inp.sHit;
  inp.jHit = inp.pHit = inp.sHit = 0;
  var any = L || R || U || D || J || Pn || S;
  if (any) goal.on = false;
  var gp = false;
  if (goal.on && !any) {
    var gx = goal.x, gy = goal.y;
    if (goal.ent) {
      if (goal.ent.out || goal.ent.dead) { goal.on = false; }
      else { gx = goal.ent.x; gy = goal.ent.y - (goal.ent.h || 20) * 0.5; }
    }
    if (goal.cell && goal.cell.st >= 2) goal.on = false;
    if (goal.on) {
      var res = seek(gx, gy);
      L = res.l; R = res.r; U = res.u; D = res.d; J = res.j;
      if (res.there) {
        if (goal.punch > 0) { if (m.punchT <= 0) { m.face = gx < m.x ? -1 : (gx > m.x ? 1 : m.face); Pn = 1; goal.punch--; } }
        else goal.on = false;
        if (goal.punch <= 0 && m.punchT <= 0) goal.on = false;
      }
      gp = true;
    }
  }
  if (m.stun > 0) { L = R = U = D = J = Pn = S = 0; }
  if (G.choir > 0) { /* the monster can still move; only the army listens */ }
  if (Pn) punch();
  if (S) special();
  if (L && !R) m.face = -1; else if (R && !L) m.face = 1;
  var dir = (R ? 1 : 0) - (L ? 1 : 0);
  var spd = M.spd * (0.9 + s * 0.12);
  var moved = dir !== 0 || U || D || J;
  G.still = moved || Pn ? 0 : G.still + dt;

  if (M.fly) { flyMonster(m, dir, U, D, spd, dt); return; }
  if (M.stretch) { sockMonster(m, dir, U, D, spd, dt); return; }

  if (m.st === 'stand' && m.on < 0) {
    /* on the street */
    m.vx = dir * spd; m.x += m.vx * dt;
    if (dir) m.walk += dt * 9;
    var b = bldAt(m.x);
    if (U && b && M.climbs) { m.st = 'wall'; m.on = b.i; m.vy = 0; }
    else if (J || (U && !b)) { m.st = 'air'; m.vy = -M.jump * (0.92 + s * 0.08); m.airFrom = m.y; sfx('thwip'); }
  } else if (m.st === 'stand') {
    /* on a roof */
    var rb = G.blds[m.on];
    m.vx = dir * spd; m.x += m.vx * dt;
    if (dir) m.walk += dt * 9;
    if (!rb || rb.fold || rb.down || m.x < rb.x || m.x > rb.x + rb.w) { m.st = 'air'; m.on = -1; m.vy = 0; m.airFrom = m.y; }
    else if (J || U) { m.st = 'air'; m.on = -1; m.vy = -M.jump * 0.9; m.airFrom = m.y; sfx('thwip'); }
    else if (D) { m.st = 'wall'; m.y = rb.top + mH() * 0.5; }
    else m.y = rb.top;
  } else if (m.st === 'wall') {
    var wb = G.blds[m.on];
    if (!wb || wb.fold || wb.down) { m.st = 'air'; m.on = -1; m.vy = 0; m.airFrom = m.y; }
    else {
      var cs = M.climb * (0.9 + s * 0.1);
      m.x += dir * cs * 0.8 * dt;
      if (U) m.y -= cs * dt; if (D) m.y += cs * dt;
      if (U || D) m.walk += dt * 7;
      if (m.x < wb.x + 4 || m.x > wb.x + wb.w - 4) { m.st = 'air'; m.on = -1; m.vy = -60; m.airFrom = m.y; }
      else if (J) { m.st = 'air'; m.on = -1; m.vy = -M.jump * 0.7; m.vx = m.face * spd; m.airFrom = m.y; sfx('thwip'); }
      if (m.st === 'wall') {
        if (m.y - mH() * 0.15 < wb.top) { m.st = 'stand'; m.y = wb.top; }
        if (m.y >= GY) { m.y = GY; m.st = 'stand'; m.on = -1; }
      }
    }
  } else {
    /* in the air */
    if (!m.stun) { m.vx = dir ? dir * spd : m.vx * 0.9; }
    m.x += m.vx * dt;
    m.vy += G.grav * dt; m.y += m.vy * dt;
    if (m.flop === 1) m.vy = Math.max(m.vy, 700);
    /* land on a roof, or catch a wall when pushing up */
    if (m.vy > 0) {
      for (i = 0; i < G.blds.length; i++) {
        var lb = G.blds[i];
        if (!inSpan(lb, m.x, 2)) continue;
        if (m.y >= lb.top && m.y - m.vy * dt <= lb.top + 2) { land(lb.top, lb); break; }
      }
    }
    if (m.st === 'air' && U && M.climbs && !m.stun) {
      var cb = bldAt(m.x);
      if (cb && m.y > cb.top + 20) { m.st = 'wall'; m.on = cb.i; m.vy = 0; }
    }
    if (m.st === 'air' && m.y >= GY) land(GY, null);
  }
  m.x = clamp(m.x, 30, G.W - 30);
  if (m.st === 'wall') m.y = clamp(m.y, 0, GY);
}

function land(y, b) {
  var m = G.m, fall = y - m.airFrom, M = G.M;
  m.y = y; m.on = b ? b.i : -1; m.st = 'stand';
  var vy = m.vy; m.vy = 0; m.vx = 0; m.squash = 0.2;
  if (m.flop) {
    /* the belly flop: everything nearby gets a wobble */
    m.flop = 0; sfx('fold'); txt('SPLAT', m.x, m.y - 30, GOLD, 30, true);
    burst(m.x, m.y, 16, PK.dust, '#e9dcc8', 220, 0.8, 8);
    if (b) { for (var c = 0; c < b.cells.length; c++) { var cl = b.cells[c]; if (cl.r < 2 && cl.st < 2 && Math.abs(cl.cx - m.x) < 70 * G.s) hitCell(b, cl, 2); if (b.fold) break; } }
    else { for (var t = 0; t < G.tanks.length; t++) if (Math.abs(G.tanks[t].x - m.x) < 160 * G.s) foldTank(G.tanks[t], G.tanks[t].x < m.x ? -1 : 1); crackNear(m.x, GY - 40, 120 * G.s, 3); }
    for (var g = 0; g < G.megs.length; g++) if (Math.abs(G.megs[g].x - m.x) < 160 * G.s) shooMeg(G.megs[g]);
    if (!RM) G.shake = 0.4;
  } else if (fall > 60) {
    burst(m.x, m.y, 6, PK.dust, '#e9dcc8', 120, 0.6, 6);
    sfx('kick');
  }
  if (G.era.id === 'eighties' && fall > 150 && !b) {
    G.slowmo = 1.1; G.st.stunts++;
    earn(300, m.x, m.y - 90, 'Dramatic!');
    txt('Slow motion landing', m.x, m.y - 130, '#2de2e6', 22, true);
  }
  if (M.bounce && !m.stun && vy > 260) { m.st = 'air'; m.on = -1; m.vy = -vy * 0.42; m.airFrom = m.y; sfx('boink'); }
}

function seek(gx, gy) {
  /* where the monster wants its fist to be, and which buttons that needs */
  var m = G.m, M = G.M, w = mW(), h = mH(), R = M.reach * G.s, out = { l: 0, r: 0, u: 0, d: 0, j: 0, there: false };
  var side = gx < m.x ? -1 : 1;
  var tx = goal.punch > 0 ? gx - side * (w * 0.35 + R * 0.3) : gx;
  var dx = tx - m.x;
  var near = Math.abs(dx) < (goal.punch > 0 ? 18 + R * 0.4 : 14);
  if (!near) { if (dx < 0) out.l = 1; else out.r = 1; }
  var fy = m.y - h * 0.58;
  if (M.fly) {
    var dy = gy - fy;
    if (dy < -14) out.u = 1; else if (dy > 14) out.d = 1;
    out.there = near && Math.abs(dy) < 30;
    return out;
  }
  if (M.stretch) {
    var dyh = gy - (m.y - h + 14 * G.s);
    if (dyh < -14) out.u = 1; else if (dyh > 14) out.d = 1;
    out.there = near && Math.abs(dyh) < 34;
    return out;
  }
  /* climbers: the goal is on a flat (a window), or down on the street */
  var tb = goal.cell ? cellBld(goal.cell) : null;
  if (!tb && gy < GY - 60) tb = bldAt(gx);
  if (tb && tb.fold) tb = null;
  if (tb && goal.punch > 0) {
    var face = gx < tb.x + tb.w / 2 ? -1 : 1;
    var wx = clamp(gx - face * w * 0.38, tb.x + 10, tb.x + tb.w - 10);
    var wy = gy + h * 0.62, onIt = m.on === tb.i;
    var ddx = wx - m.x, okx = Math.abs(ddx) < 10;
    out.l = out.r = 0;
    if (m.st === 'wall' && onIt) {
      if (!okx) { if (ddx < 0) out.l = 1; else out.r = 1; }
      if (wy < m.y - 8) out.u = 1; else if (wy > m.y + 8 && m.y < GY - 2) out.d = 1;
      out.there = okx && Math.abs(m.y - wy) < 22;
      if (out.there) m.face = face;
      return out;
    }
    if (m.st === 'stand' && onIt) { out.d = 1; return out; }
    if (m.st === 'wall') { if (m.y < GY - 2) out.d = 1; return out; }
    if (m.st === 'stand' && m.on >= 0) { if (ddx < 0) out.l = 1; else out.r = 1; return out; }
    if (Math.abs(ddx) > 6) { if (ddx < 0) out.l = 1; else out.r = 1; }
    if (bldAt(m.x) === tb) out.u = 1;
    return out;
  }
  /* the goal is on the street */
  if (m.st === 'wall') { out.l = out.r = 0; if (m.y < GY - 2) out.d = 1; return out; }
  if (m.st === 'stand' && m.on >= 0) { var eb = G.blds[m.on]; out.l = out.r = 0; if (gx < m.x) out.l = 1; else out.r = 1; if (near && Math.abs(gx - m.x) < eb.w) out.j = 0; return out; }
  out.there = near && (m.st === 'stand') && (goal.punch > 0 ? Math.abs(gy - fy) < 60 + h * 0.4 : true);
  return out;
}
function cellBld(cl) {
  for (var i = 0; i < G.blds.length; i++) { var b = G.blds[i]; if (cl.x >= b.x && cl.x <= b.x + b.w) return b; }
  return null;
}

function flyMonster(m, dir, U, D, spd, dt) {
  m.st = 'fly'; m.on = -1;
  var vy = (D ? 1 : 0) - (U ? 1 : 0);
  m.vx += (dir * spd - m.vx) * Math.min(1, dt * 6);
  m.vy += (vy * spd * 0.85 - m.vy) * Math.min(1, dt * 6);
  m.x += m.vx * dt; m.y += m.vy * dt;
  m.walk += dt * 14;
  var top = 120 + mH();
  m.y = clamp(m.y, top, GY);
  /* perch on roofs (does not fly through them) */
  for (var i = 0; i < G.blds.length; i++) {
    var b = G.blds[i]; if (!inSpan(b, m.x, 0)) continue;
    if (m.y > b.top && m.y - mH() * 0.5 < b.top && m.vy >= 0 && !D) { m.y = b.top; m.vy = 0; }
  }
  m.x = clamp(m.x, 30, G.W - 30);
}
function sockMonster(m, dir, U, D, spd, dt) {
  m.st = 'stand'; m.on = -1; m.y = GY;
  m.vx = dir * spd; m.x += m.vx * dt;
  if (dir) m.walk += dt * 9;
  var maxN = 340;
  if (U) m.neckV = Math.min(m.neckV + 900 * dt, 340);
  else if (D) m.neckV = Math.max(m.neckV - 900 * dt, -340);
  else m.neckV *= 0.8;
  m.neck = clamp(m.neck + m.neckV * dt, 0, maxN);
  if (!U && !D) m.neckV = 0;
  m.x = clamp(m.x, 30, G.W - 30);
}

/* the sock's height includes its stretch */
var _mH = mH;
mH = function () { return _mH() + (G && G.M.stretch ? G.m.neck * G.s : 0); };

function stepActors(dt, ending) {
  var m = G.m, i, frozen = G.choir > 0 || ending;
  if (G.choir > 0) G.choir -= dt;
  /* tanks on wires: roll in, stop, fire foam darts */
  for (i = G.tanks.length - 1; i >= 0; i--) {
    var t = G.tanks[i];
    if (t.out) {
      t.lift += dt;
      t.y -= dt * 260 * Math.min(1, t.lift); t.rot += t.spin * dt * 3;
      if (t.y < -200 || t.lift > 50) G.tanks.splice(i, 1);
      continue;
    }
    if (t.conf > 0) { t.conf -= dt; }
    var tgx = t.conf > 0 && G.decoy ? G.decoy.x : m.x;
    var want = tgx + (t.side * (190 + t.v * 40));
    if (!frozen) {
      var d = want - t.x;
      if (Math.abs(d) > 8) t.x += Math.sign(d) * Math.min(Math.abs(d), 70 * dt);
      t.face = tgx < t.x ? -1 : 1;
      t.fire -= dt;
      if (t.fire <= 0 && Math.abs(tgx - t.x) < 520 && t.conf <= 0) {
        t.fire = rnd(3.6, 5.4) - Math.min(1, G.t / 120);
        shoot(t.x + t.face * 26, t.y - 26, m.x, m.y - mH() * 0.55, 'dart', 260);
      }
    }
    t.wob += dt * 6;
    if (G.train && !t.out && Math.abs(G.train.x - t.x) < 50) foldTank(t, G.train.dir);
    for (var bo = 0; bo < G.boulders.length; bo++) if (!t.out && Math.abs(G.boulders[bo].x - t.x) < 40) foldTank(t, G.boulders[bo].dir);
  }
  /* helicopters on fishing rods */
  for (i = G.helis.length - 1; i >= 0; i--) {
    var h = G.helis[i];
    h.rot += dt * (h.out ? 30 : 22);
    if (h.out) {
      h.y -= dt * 300; h.spin += dt * h.spinV;
      if (h.y < -160) G.helis.splice(i, 1);
      continue;
    }
    if (h.conf > 0) h.conf -= dt;
    if (!frozen) {
      var hx = (h.conf > 0 && G.decoy ? G.decoy.x : m.x) + h.side * 150, hy = clamp(m.y - mH() - 70 + Math.sin(G.t * 1.3 + h.ph) * 30, 130, GY - 150);
      h.x += (hx - h.x) * Math.min(1, dt * 0.8); h.y += (hy - h.y) * Math.min(1, dt * 1.1);
      h.fire -= dt;
      if (h.fire <= 0 && h.conf <= 0) { h.fire = rnd(4.2, 6); shoot(h.x, h.y + 14, m.x, m.y - mH() * 0.55, 'cork', 230); }
    }
  }
  /* the man with the megaphone: his words float over */
  for (i = G.megs.length - 1; i >= 0; i--) {
    var g = G.megs[i]; if (g.out) { G.megs.splice(i, 1); continue; }
    if (g.conf > 0) g.conf -= dt;
    var mx = (g.conf > 0 && G.decoy ? G.decoy.x : m.x) + g.side * 230;
    if (!frozen) {
      if (Math.abs(mx - g.x) > 6) { g.x += Math.sign(mx - g.x) * 50 * dt; g.walk += dt * 8; }
      g.fire -= dt;
      if (g.fire <= 0 && g.conf <= 0) { g.fire = rnd(4, 5.6); shoot(g.x, g.y - 62, m.x, m.y - mH() * 0.6, 'word', 150); g.shout = 0.8; }
    }
    if (g.shout > 0) g.shout -= dt;
    for (var bo2 = 0; bo2 < G.boulders.length; bo2++) if (Math.abs(G.boulders[bo2].x - g.x) < 40) shooMeg(g);
  }
  /* things flying at the monster */
  var hx2 = m.x, hy2 = m.y - mH() * 0.5, hw = mW() * 0.5 + 6, hh = mH() * 0.5 + 6;
  for (i = G.proj.length - 1; i >= 0; i--) {
    var p = G.proj[i];
    if (p.dead) { G.proj.splice(i, 1); continue; }
    if (!frozen) { p.x += p.vx * dt; p.y += p.vy * dt; if (p.kind !== 'word') p.vy += 160 * dt; }
    p.t += dt; p.rot += dt * 5;
    if (!ending && Math.abs(p.x - hx2) < hw && Math.abs(p.y - hy2) < hh) {
      p.dead = true; burst(p.x, p.y, 4, PK.conf, CONF, 90, 0.4, 2.5);
      bump(p.kind === 'word' ? 2 : p.kind === 'cork' ? 3 : 4, p.x);
      if (p.kind === 'word') txt('please stop', p.x, p.y - 10, '#fff6fb', 15);
    }
    if (p.y > GY + 10 || p.t > 6 || p.x < -50 || p.x > G.W + 50) p.dead = true;
  }
  /* boulders (Stone Age) */
  for (i = G.boulders.length - 1; i >= 0; i--) {
    var B = G.boulders[i];
    B.x += B.dir * 230 * dt; B.rot += B.dir * dt * 230 / B.r; B.life -= dt;
    if (B.life <= 0 || B.x < -60 || B.x > G.W + 60) G.boulders.splice(i, 1);
  }
  /* the steam train (Victorians) */
  if (G.train) {
    G.train.x += G.train.dir * 170 * dt; G.train.t += dt;
    if (Math.random() < dt * 12) part(PK.smoke, G.train.x + G.train.dir * 20, GY - 70, rnd(-20, 20), -60, 1.4, 'rgba(240,235,225,.7)', rnd(8, 14), -20);
    if ((G.train.dir > 0 && G.train.x > G.W + 220) || (G.train.dir < 0 && G.train.x < -220)) G.train = null;
  }
  if (G.decoy) { G.decoy.t -= dt; if (G.decoy.t <= 0) G.decoy = null; }
  /* the catering table */
  if (G.table) {
    var tb = G.table;
    tb.t += dt;
    if (!ending && m.st !== 'fly' && Math.abs(m.x - tb.x) < 40 + mW() * 0.4 && m.y > GY - 40 && tb.food > 0) {
      tb.food--; tb.cool = 0.7; G.st.snacks++;
      eatSnack(tb.x, GY - 50, 22);
      if (tb.food <= 0) tb.leave = true;
    } else if (G.M.fly && !ending && Math.abs(m.x - tb.x) < 50 && m.y > GY - 70 && tb.food > 0 && !(tb.cool > 0)) {
      tb.food--; tb.cool = 0.7; G.st.snacks++; eatSnack(tb.x, GY - 50, 22); if (tb.food <= 0) tb.leave = true;
    }
    if (tb.cool > 0) tb.cool -= dt;
    if (tb.leave) { tb.x += 90 * dt * tb.dir; if (tb.x < -100 || tb.x > G.W + 100) G.table = null; }
    else if (tb.t > 22) tb.leave = true;
  }
  /* crew, extras, stunt people, everyone runs off happy */
  for (i = G.runners.length - 1; i >= 0; i--) {
    var r = G.runners[i];
    r.t += dt;
    if (r.kind === 'mat') { r.life -= dt; if (r.life <= 0) G.runners.splice(i, 1); continue; }
    if (r.kind === 'jay') { r.y -= dt * 34; r.x += Math.sin(r.t * 2) * dt * 30; if (r.y < -100 || r.t > 9) G.runners.splice(i, 1); continue; }
    if (r.kind === 'bonnie') { stepBonnie(r, dt); if (r.done) G.runners.splice(i, 1); continue; }
    if (r.kind === 'box') { stepBox(r, dt); if (r.done) G.runners.splice(i, 1); continue; }
    if (r.kind === 'sign') {
      r.x += r.dir * 30 * dt;
      if (!r.got && Math.abs(r.x - m.x) < mW() * 0.5 + 24 && m.y > GY - 60) { r.got = true; r.dir = -r.dir; earn(250, r.x, GY - 80, 'Autograph!'); sfx('ding'); }
      if (r.x < -60 || r.x > G.W + 60 || r.t > 30) G.runners.splice(i, 1);
      continue;
    }
    if (r.y < r.y0) { r.vy += 700 * dt; r.y += r.vy * dt; r.x += r.dir * 40 * dt; if (r.y >= r.y0) { r.y = r.y0; r.vy = 0; if (r.stunt) { r.wave = 1.6; r.sp = 0; } } continue; }
    if (r.wave > 0 && r.sp === 0) { r.wave -= dt; if (r.wave <= 0) { r.sp = 120; r.scared = true; } continue; }
    if (r.kind === 'crew' && state === 'play' && G.t > 0.2 && !r.scared) { r.scared = true; r.dir = r.x < G.W / 2 ? -1 : 1; r.sp = 170; }
    if (r.kind !== 'crew' && !r.scared && Math.abs(r.x - m.x) < 120 + mW()) { r.scared = true; r.dir = r.x < m.x ? -1 : 1; r.sp = 130; r.wave = 0.01; }
    if (G.mode === 'musical' && !r.scared) { r.x += Math.sin(r.t * 3) * dt * 10; continue; }
    r.x += r.dir * r.sp * dt;
    if (!r.scared && (r.x < 40 || r.x > G.W - 40)) r.dir = -r.dir;
    if (r.x < -60 || r.x > G.W + 60) G.runners.splice(i, 1);
  }
  /* buildings settle */
  for (i = 0; i < G.blds.length; i++) {
    var b = G.blds[i];
    if (b.shake > 0) b.shake -= dt;
    if (b.fold && !b.down) {
      b.fold += dt * 1.25;
      if (b.fold > 0.35 && !b.dusted) { b.dusted = true; burst(b.x + b.w / 2, GY, 22, PK.dust, '#e9dcc8', 260, 1.1, 10); }
      if (b.fold >= 1) { b.fold = 1; b.down = true; }
    }
    for (var c = 0; c < b.cells.length; c++) { var cl = b.cells[c]; if (cl.occ) { cl.occT += dt; if (cl.occ === 'jay' && cl.occT > 18) { cl.occ = null; } } }
  }
}

function shoot(x, y, tx, ty, kind, sp) {
  if (G.proj.length > 14) return;
  var dx = tx - x, dy = ty - y, d = Math.sqrt(dx * dx + dy * dy) || 1, tt = d / sp;
  var vx = dx / tt, vy = dy / tt - (kind === 'word' ? 0 : 80 * tt);
  G.proj.push({ x: x, y: y, vx: vx, vy: vy, kind: kind, t: 0, rot: 0, dead: false, txt: kind === 'word' ? pick(['STOP', 'OI', 'PLEASE', 'NO', 'HALT']) : '' });
  if (kind === 'word') sfx('voice'); else sfx('pop');
}

function stepSpawns(dt) {
  var set = G.set, el2 = G.t;
  G.spawnT -= dt;
  if (G.spawnT <= 0) {
    var ramp = Math.min(1, el2 / 100);
    G.spawnT = lerp(7, 4, ramp) * rnd(0.85, 1.2);
    var live = 0, lh = 0, lm = 0, i;
    for (i = 0; i < G.tanks.length; i++) if (!G.tanks[i].out) live++;
    for (i = 0; i < G.helis.length; i++) if (!G.helis[i].out) lh++;
    for (i = 0; i < G.megs.length; i++) if (!G.megs[i].out) lm++;
    var maxT = Math.round(lerp(1, set.tanks, ramp)), maxH = Math.round(lerp(0.6, set.helis, ramp)), r = Math.random();
    var fromL = Math.random() < 0.5 || G.m.x > G.W - 260, sx = fromL ? -60 : G.W + 60;
    if (fromL && G.m.x < 260) { fromL = false; sx = G.W + 60; }
    if (r < 0.45 && live < maxT) {
      G.tanks.push({ x: sx, y: GY, w: 70, h: 40, side: fromL ? -1 : 1, v: Math.random(), face: 1, fire: rnd(1.5, 3), out: false, lift: 0, rot: 0, spin: 1, wob: 0, conf: 0,
        kind: G.era.id === 'rome' ? 'horse' : G.E.tank });
    } else if (r < 0.75 && lh < maxH && el2 > 12) {
      G.helis.push({ x: sx, y: 140, h: 30, side: fromL ? -1 : 1, ph: Math.random() * 6, fire: rnd(2, 3), out: false, rot: 0, spin: 0, spinV: 0, conf: 0 });
    } else if (lm < 1) {
      G.megs.push({ x: sx, y: GY, h: 60, side: fromL ? -1 : 1, fire: rnd(2, 3), out: false, walk: 0, shout: 0, conf: 0 });
    } else if (live < maxT) {
      G.tanks.push({ x: sx, y: GY, w: 70, h: 40, side: fromL ? -1 : 1, v: Math.random(), face: 1, fire: rnd(1.5, 3), out: false, lift: 0, rot: 0, spin: 1, wob: 0, conf: 0,
        kind: G.era.id === 'rome' ? 'horse' : G.E.tank });
    }
  }
  G.extraT -= dt;
  if (G.extraT <= 0) {
    G.extraT = rnd(4, 7);
    var n = 0; for (var k = 0; k < G.runners.length; k++) if (G.runners[k].kind === 'extra' || G.runners[k].kind === 'cat') n++;
    if (n < 5) spawnExtra(Math.random() < 0.5 ? -40 : G.W + 40);
    if (Math.random() < 0.18) G.runners.push({ kind: 'sign', x: Math.random() < 0.5 ? -40 : G.W + 40, y: GY, dir: 0, t: 0, got: false });
    var last = G.runners[G.runners.length - 1]; if (last && last.kind === 'sign') last.dir = last.x < 0 ? 1 : -1;
    if (last && (last.kind === 'extra' || last.kind === 'cat') && last.x < 0) last.dir = 1; else if (last && (last.kind === 'extra' || last.kind === 'cat')) last.dir = -1;
  }
  G.occT -= dt;
  if (G.occT <= 0) { G.occT = rnd(3, 6); seedOcc(Math.random() < 0.5 ? 'snack' : 'extra'); }
  G.tableT -= dt;
  if (G.tableT <= 0 && !G.table) {
    G.tableT = rnd(30, 45);
    var fl = Math.random() < 0.5;
    G.table = { x: fl ? -60 : G.W + 60, dir: fl ? 1 : -1, food: 3, t: 0, leave: false, cool: 0, stop: rnd(200, G.W - 200) };
  }
  if (G.table && !G.table.leave) { var tb = G.table; if (Math.abs(tb.x - tb.stop) > 4) tb.x += Math.sign(tb.stop - tb.x) * 120 * dt; }
  if (G.era.id === 'victorian') {
    G.trainT -= dt;
    if (G.trainT <= 0 && !G.train) { G.trainT = rnd(22, 30); var d = Math.random() < 0.5 ? 1 : -1; G.train = { x: d > 0 ? -200 : G.W + 200, dir: d, t: 0 }; sfx('whistle'); txt('Choo choo', clamp(G.m.x, 100, G.W - 100), GY - 200, '#ffe9c0', 22, true); }
  }
  if (G.set.bell && Math.floor((G.t - dt) / 40) !== Math.floor(G.t / 40)) { sfx('ding'); txt('Break time!', G.blds[1].x + G.blds[1].w / 2, G.blds[1].top - 40, GOLD, 24, true); for (var e = 0; e < 3; e++) spawnExtra(G.blds[1].x + rnd(0, G.blds[1].w)); }
}

function stepSecrets(dt, dtReal) {
  var m = G.m;
  /* Jay waves from a window */
  if (G.jayAt >= 0 && !G.jayDone && G.t > G.jayAt && !G.jayCell) {
    var opts = [];
    for (var i = 0; i < G.blds.length; i++) { var b = G.blds[i]; if (b.fold || b.down) continue; for (var c = 0; c < b.cells.length; c++) { var cl = b.cells[c]; if (!cl.st && !cl.occ && cl.cx > V.cam && cl.cx < V.cam + V.viewW) opts.push(cl); } }
    if (opts.length) { G.jayCell = pick(opts); G.jayCell.occ = 'jay'; G.jayCell.occT = 0; G.jayCell.lit = true; }
    else G.jayAt = G.t + 5;
  }
  if (G.jayCell && G.jayCell.occ !== 'jay' && !G.jayDone) { G.jayDone = true; }
  /* Bonnie trots across the set */
  if (G.bonAt >= 0 && !G.bonDone && G.t > G.bonAt) {
    G.bonDone = true;
    var fromL = m.x > G.W / 2;
    G.runners.push({ kind: 'bonnie', x: fromL ? V.cam - 30 : V.cam + V.viewW + 30, y: GY, dir: fromL ? 1 : -1, t: 0, sit: 0, met: false, done: false });
  }
  /* the box in the wings */
  if (G.boxAt >= 0 && G.t > G.boxAt && !G.box) {
    var left = m.x < G.W / 2;
    G.box = { kind: 'box', x: left ? 40 : G.W - 40, y: GY, side: left ? -1 : 1, t: 0, peek: 0, seen: false, done: false, life: 11 };
    G.runners.push(G.box);
  }
  /* a bird lands on a monster that stays still up high */
  if (!G.birdOn && G.still > 3.5 && m.y < GY - 160 && (m.st === 'stand' || m.st === 'fly')) {
    G.birdOn = true; G.bird = { t: 0 }; sfx('tweet');
    say('Outrageous. A bird!', 4);
    findSecret('bird');
  }
  if (G.bird) { G.bird.t += dtReal; if (G.still === 0 && G.bird.t > 1) { G.bird = null; } }
}

function stepBonnie(r, dt) {
  var m = G.m;
  if (r.sit > 0) { r.sit -= dt; if (r.sit <= 0) r.dir = r.dir; return; }
  r.x += r.dir * 70 * dt;
  if (!r.met && (r.pat || (Math.abs(r.x - m.x) < mW() * 0.6 + 70 && m.y > GY - 120))) {
    r.met = true; r.sit = 1.8; sfx('woof');
    txt('Woof!', r.x, GY - 50, '#ffe08a', 22);
    for (var i = 0; i < 4; i++) part(PK.star, r.x + rnd(-10, 10), GY - 40, rnd(-30, 30), rnd(-90, -50), 1, '#ff9ec7', 6, 0);
    findSecret('bonnie');
  }
  if (r.x < -60 || r.x > G.W + 60) r.done = true;
}
function stepBox(r, dt) {
  var m = G.m;
  r.life -= dt;
  r.peek = Math.min(1, r.peek + dt * 1.5);
  if (r.life < 1.2) r.peek = Math.max(0, r.life / 1.2);
  if (!r.seen && r.peek > 0.5 && Math.abs(r.x - m.x) < 280 + mW() * 0.5) { r.seen = true; r.wave = 1.5; findSecret('box'); }
  if (r.wave > 0) r.wave -= dt;
  if (r.life <= 0) { r.done = true; }
}

function stepParts(dt) {
  for (var i = 0; i < PMAX; i++) {
    var p = P[i]; if (!p.on) continue;
    p.life += dt; if (p.life >= p.max) { p.on = false; continue; }
    p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    if (p.kind === PK.conf || p.kind === PK.card || p.kind === PK.tinsel) { p.vx *= 0.985; if (p.vy > 120) p.vy = 120; }
    if (p.kind === PK.dust || p.kind === PK.smoke) { p.vx *= 0.94; p.vy *= 0.94; }
    if ((p.kind === PK.glass || p.kind === PK.card) && p.y > GY) { p.y = GY; p.vy *= -0.3; p.vx *= 0.6; }
  }
  for (i = 0; i < TMAX; i++) { var t = TX[i]; if (!t.on) continue; t.life += dt; t.y += t.vy * dt; if (t.life >= t.max) t.on = false; }
}

/* ==========================================================
   DRAWING: THE SET
   ========================================================== */
var TOPY = 20;   /* the top of the view in world units */
function rr(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
  c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h); c.lineTo(x + r, y + h);
  c.quadraticCurveTo(x, y + h, x, y + h - r); c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
}
function circ(c, x, y, r) { c.beginPath(); c.arc(x, y, Math.max(0.1, r), 0, TAU); }
function ell(c, x, y, rx, ry, rot) { c.beginPath(); c.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot || 0, 0, TAU); }
function line(c, x1, y1, x2, y2) { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); }
function shade(hex, f) {
  var n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  if (f < 0) { r *= 1 + f; g *= 1 + f; b *= 1 + f; } else { r += (255 - r) * f; g += (255 - g) * f; b += (255 - b) * f; }
  return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
}

/* the painted backdrop: drawn once into its own canvas */
function buildCloth() {
  if (!G) return;
  var pal = G.era.pal, E = G.E, set = G.set, id = G.era.id;
  var par = 0.35, lo = Math.min(0, (G.W - V.viewW) / 2), hi = Math.max((G.W - V.viewW) / 2, G.W - V.viewW);
  var wW = V.viewW + (hi - lo) * par + 40, wH = GY + 80 - TOPY;
  cloth && (cloth.lo = lo);
  var sc = Math.min(V.k, 1.4);
  var cw = Math.ceil(wW * sc), ch = Math.ceil(wH * sc);
  if (!cloth) cloth = document.createElement('canvas');
  cloth.width = cw; cloth.height = ch; cloth.sc = sc; cloth.par = par; cloth.lo = lo;
  var c = cloth.getContext('2d');
  c.setTransform(sc, 0, 0, sc, 0, -TOPY * sc);
  var g = c.createLinearGradient(0, TOPY, 0, GY);
  if (set.stars) { g.addColorStop(0, '#060a1c'); g.addColorStop(1, '#23305a'); }
  else { g.addColorStop(0, pal.sky); g.addColorStop(1, pal.sky2); }
  c.fillStyle = g; c.fillRect(0, TOPY, wW, GY - TOPY + 80);
  var i, x;
  /* a big painted sun or moon */
  c.fillStyle = set.stars ? '#c9d6ff' : id === 'eighties' ? '#ffcf4f' : id === 'viking' ? '#e9f0ff' : 'rgba(255,240,200,.85)';
  circ(c, wW * 0.72, 150, set.stars ? 46 : 60); c.fill();
  if (id === 'eighties' && !set.stars) {
    c.fillStyle = pal.sky2; for (i = 0; i < 5; i++) c.fillRect(wW * 0.72 - 62, 150 + 8 + i * 10, 124, 3 + i);
  }
  if (set.stars || id === 'future') {
    c.fillStyle = '#ffffff';
    for (i = 0; i < 90; i++) { var sx = (i * 137.5) % wW, sy = TOPY + ((i * 61) % 300); c.globalAlpha = 0.3 + (i % 5) * 0.12; c.fillRect(sx, sy, 2, 2); }
    c.globalAlpha = 1;
    if (set.stars) { c.fillStyle = '#c96f4a'; circ(c, wW * 0.22, 170, 70); c.fill(); c.strokeStyle = 'rgba(255,220,180,.6)'; c.lineWidth = 6; ell(c, wW * 0.22, 170, 120, 22, -0.2); c.stroke(); }
  } else {
    /* painted clouds */
    c.fillStyle = id === 'viking' ? 'rgba(220,230,245,.35)' : 'rgba(255,255,255,.55)';
    for (i = 0; i < 6; i++) { x = (i * 311) % wW; var y = 90 + (i % 3) * 50; ell(c, x, y, 60, 18); c.fill(); ell(c, x + 40, y - 10, 40, 16); c.fill(); }
  }
  /* distant painted scenery, per era */
  var hz = GY - 30;
  c.fillStyle = shade(pal.ground, -0.15);
  if (set.sea) {
    c.fillStyle = '#3f8fb3'; c.fillRect(0, hz - 60, wW, 140);
    c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 3;
    for (i = 0; i < 40; i++) { x = (i * 97) % wW; var wy = hz - 50 + (i % 6) * 14; c.beginPath(); c.arc(x, wy, 8, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
  }
  c.fillStyle = shade(pal.ground, set.sea ? -0.05 : -0.25);
  c.globalAlpha = 0.7;
  for (x = -40; x < wW + 80;) {
    var bw = 40 + ((x * 7) % 50), bh = 60 + ((x * 13) % 120);
    if (set.sea) bh *= 0.35;
    if (id === 'stone' || id === 'viking') { c.beginPath(); c.moveTo(x, hz); c.lineTo(x + bw * 0.6, hz - bh); c.lineTo(x + bw * 1.6, hz); c.fill(); }
    else if (id === 'egypt') { c.beginPath(); c.moveTo(x, hz); c.lineTo(x + bw, hz - bh * 0.9); c.lineTo(x + bw * 2, hz); c.fill(); }
    else if (id === 'rome') { c.fillRect(x, hz - bh * 0.6, bw, bh * 0.6); c.beginPath(); c.moveTo(x - 4, hz - bh * 0.6); c.lineTo(x + bw / 2, hz - bh * 0.6 - 18); c.lineTo(x + bw + 4, hz - bh * 0.6); c.fill(); }
    else if (id === 'future') { c.fillRect(x, hz - bh, bw * 0.6, bh); ell(c, x + bw * 0.3, hz - bh, bw * 0.5, 10); c.fill(); }
    else { c.fillRect(x, hz - bh, bw, bh); if (id === 'victorian') c.fillRect(x + bw * 0.6, hz - bh - 18, 8, 18); }
    x += bw + 14;
  }
  c.globalAlpha = 1;
  if (id === 'egypt') { c.fillStyle = '#c99a4a'; c.beginPath(); c.moveTo(wW * 0.35, hz); c.lineTo(wW * 0.45, hz - 170); c.lineTo(wW * 0.55, hz); c.fill(); c.fillStyle = 'rgba(0,0,0,.12)'; c.beginPath(); c.moveTo(wW * 0.45, hz - 170); c.lineTo(wW * 0.55, hz); c.lineTo(wW * 0.47, hz); c.fill(); }
  if (id === 'eighties') { c.strokeStyle = pal.accent; c.globalAlpha = 0.35; c.lineWidth = 2; for (i = 0; i < 12; i++) line(c, 0, hz + i * 8, wW, hz + i * 8); c.globalAlpha = 1; }
  /* it is a painted cloth: seams and a batten at the top */
  c.strokeStyle = 'rgba(0,0,0,.08)'; c.lineWidth = 2;
  for (x = 180; x < wW; x += 180) line(c, x, TOPY, x, GY);
  c.fillStyle = '#3a2a24'; c.fillRect(0, TOPY, wW, 8);
  c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(0, GY - 6, wW, 10);
  c.setTransform(1, 0, 0, 1, 0, 0);
}

/* ---------- a building flat ---------- */
function drawBld(c, b) {
  var E = G.E, id = G.era.id, w = b.w, h = b.h, kind = b.kind;
  c.save();
  c.translate(b.x + w / 2 + (b.shake > 0 && !RM ? Math.sin(G.real * 70) * 2.5 : 0), GY);
  if (G.mode === 'musical' && !RM && !b.fold) c.rotate(Math.sin(G.beat * TAU + b.i) * 0.03);
  if (b.down) { drawBrace(c, w, h, true); c.restore(); return; }
  var f = b.fold ? b.fold * b.fold : 0;
  if (b.fold) { drawBrace(c, w, h, true); c.rotate(f * 0.12 * (b.i % 2 ? 1 : -1)); c.scale(1 - f * 0.08, Math.max(0.02, 1 - f)); }
  else drawBrace(c, w, h, false);
  var x0 = -w / 2, y0 = -h;
  /* the cardboard edge: it is only a flat */
  c.fillStyle = '#c9a36a'; c.fillRect(x0 + w, y0 + 4, 7, h - 4);
  c.strokeStyle = 'rgba(90,60,30,.45)'; c.lineWidth = 1;
  for (var k = y0 + 10; k < 0; k += 7) line(c, x0 + w, k, x0 + w + 7, k + 3);
  /* the face */
  c.fillStyle = b.tint; c.fillRect(x0, y0, w, h);
  c.fillStyle = E.trim;
  if (id === 'rome') { for (var q = 0; q <= 4; q++) c.fillRect(x0 + q * (w - 6) / 4, y0 + 14, 6, h - 14); c.fillRect(x0 - 4, y0 + 8, w + 8, 8); }
  else if (id === 'viking') { c.globalAlpha = 0.35; for (q = y0 + 12; q < 0; q += 14) c.fillRect(x0, q, w, 3); c.globalAlpha = 1; }
  else if (id === 'stone') { c.globalAlpha = 0.25; for (q = 0; q < 10; q++) { ell(c, x0 + ((q * 37) % w), y0 + 20 + ((q * 53) % (h - 30)), 10, 6); c.fill(); } c.globalAlpha = 1; }
  else if (id === 'victorian') { c.fillRect(x0, y0, w, 6); c.fillRect(x0, y0 + h * 0.5, w, 4); }
  else if (id === 'eighties') { c.globalAlpha = 0.9; c.fillRect(x0, y0, w, 3); c.fillRect(x0, y0, 3, h); c.fillRect(x0 + w - 3, y0, 3, h); c.globalAlpha = 1; }
  else if (id === 'future') { c.fillRect(x0, y0 + 4, w, 4); c.globalAlpha = 0.25; c.fillRect(x0 + w * 0.45, y0, 6, h); c.globalAlpha = 1; }
  else if (id === 'egypt') { c.globalAlpha = 0.5; c.fillRect(x0, y0 + 8, w, 5); c.fillRect(x0, y0 + 18, w, 2); c.globalAlpha = 1; }
  if (kind === 'cone') { c.fillStyle = 'rgba(255,255,255,.35)'; for (q = 0; q < h; q += 36) { c.beginPath(); c.moveTo(x0, -q); c.lineTo(x0 + w, -q - 18); c.lineTo(x0 + w, -q - 30); c.lineTo(x0, -q - 12); c.fill(); } }
  if (kind === 'lamp') { c.fillStyle = 'rgba(255,255,255,.5)'; for (q = 40; q < h; q += 80) c.fillRect(x0, -q, w, 30); }
  /* windows */
  for (var i = 0; i < b.cells.length; i++) drawCell(c, b, b.cells[i], -b.x - w / 2, -GY);
  /* cracks as it takes damage */
  var d = b.dmg / b.need;
  if (d > 0.3) {
    c.strokeStyle = 'rgba(40,20,10,.55)'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(x0 + w * 0.3, y0); c.lineTo(x0 + w * 0.36, y0 + h * 0.2); c.lineTo(x0 + w * 0.28, y0 + h * 0.34); c.lineTo(x0 + w * 0.38, y0 + h * d * 0.6); c.stroke();
    if (d > 0.65) { c.beginPath(); c.moveTo(x0 + w, y0 + h * 0.4); c.lineTo(x0 + w * 0.8, y0 + h * 0.48); c.lineTo(x0 + w * 0.86, y0 + h * 0.62); c.lineTo(x0 + w * 0.7, y0 + h * 0.7); c.stroke();
      c.fillStyle = '#d9c39a'; c.save(); c.translate(x0 + w * 0.6, y0 + h * 0.15); c.rotate(0.5); c.fillRect(-14, -4, 28, 8); c.restore(); }
  }
  drawRoof(c, b, x0, y0, w);
  if (G.xmas) { c.strokeStyle = '#7cf5c9'; c.lineWidth = 3; c.beginPath(); for (q = 0; q <= 8; q++) { var tx = x0 + q * w / 8, ty = y0 + 8 + (q % 2) * 7; if (q) c.lineTo(tx, ty); else c.moveTo(tx, ty); } c.stroke();
    c.fillStyle = '#ff5a4e'; for (q = 1; q < 8; q += 2) { circ(c, x0 + q * w / 8, y0 + 15, 3); c.fill(); } }
  c.restore();
}
function drawBrace(c, w, h, alone) {
  /* the wooden prop that holds the flat up, poking out at the side */
  var sx = w / 2 - 14, top = -h * 0.62;
  c.strokeStyle = '#8a6236'; c.lineWidth = 7; c.lineCap = 'round';
  line(c, sx, top, sx + 40, 0);
  if (alone) { line(c, sx, top, sx, 0); c.lineWidth = 5; line(c, sx, top * 0.5, sx + 20, top * 0.5); }
  c.lineCap = 'butt';
  c.fillStyle = '#b39a6a'; rr(c, sx + 30, -12, 26, 12, 5); c.fill();
  if (alone) { c.fillStyle = '#c9a36a'; c.fillRect(-w / 2, -8, w, 8); c.fillStyle = 'rgba(90,60,30,.35)'; c.fillRect(-w / 2, -8, w, 2); }
}
function drawCell(c, b, cl, ox, oy) {
  var E = G.E, id = G.era.id;
  var x = cl.x + ox + cl.w * 0.18, y = cl.y + oy + cl.h * 0.16, w = cl.w * 0.64, h = cl.h * 0.6;
  var cx = x + w / 2, cy = y + h / 2;
  winPath(c, id, x, y, w, h);
  if (cl.st === 2) {
    c.fillStyle = '#20120c'; c.fill();
    c.fillStyle = '#c9a36a'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w * 0.3, y); c.lineTo(x + w * 0.1, y + h * 0.45); c.fill();
    c.strokeStyle = '#e6f6ff'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x + w, y + h); c.lineTo(x + w * 0.75, y + h * 0.7); c.lineTo(x + w * 0.9, y + h * 0.5); c.stroke();
    return;
  }
  c.fillStyle = cl.lit || cl.occ ? E.glow : E.glass; c.fill();
  if (cl.occ) drawOcc(c, cl, cx, cy + 2, Math.min(w, h));
  if (id === 'eighties') { c.strokeStyle = cl.c % 2 ? '#ff4fa3' : '#2de2e6'; c.lineWidth = 2; winPath(c, id, x, y, w, h); c.stroke(); }
  else if (id === 'victorian' || id === 'viking') { c.strokeStyle = E.trim; c.lineWidth = 2; line(c, cx, y, cx, y + h); if (id === 'victorian') line(c, x, cy, x + w, cy); }
  if (cl.st === 1) { c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx - w * 0.4, cy - h * 0.3); c.lineTo(cx, cy); c.lineTo(cx + w * 0.35, cy - h * 0.4); c.moveTo(cx, cy); c.lineTo(cx - w * 0.1, cy + h * 0.4); c.moveTo(cx, cy); c.lineTo(cx + w * 0.4, cy + h * 0.15); c.stroke(); }
}
function winPath(c, id, x, y, w, h) {
  if (id === 'stone') { ell(c, x + w / 2, y + h / 2, w / 2, h / 2); return; }
  if (id === 'egypt') { rr(c, x + w * 0.22, y, w * 0.56, h, 3); return; }
  if (id === 'rome') { c.beginPath(); c.moveTo(x, y + h); c.lineTo(x, y + w / 2); c.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0); c.lineTo(x + w, y + h); c.closePath(); return; }
  if (id === 'future') { circ(c, x + w / 2, y + h / 2, Math.min(w, h) / 2); return; }
  c.beginPath(); c.rect(x, y, w, h);
}
function drawRoof(c, b, x0, y0, w) {
  var E = G.E, r = E.roof, k = b.kind;
  c.fillStyle = E.trim;
  if (k === 'tower') { c.beginPath(); c.moveTo(x0 + 10, y0); c.lineTo(0, y0 - 46); c.lineTo(x0 + w - 10, y0); c.fill(); }
  if (k === 'cone') { c.fillStyle = '#ff5a4e'; c.beginPath(); c.moveTo(x0 - 8, y0); c.lineTo(0, y0 - 50); c.lineTo(x0 + w + 8, y0); c.fill(); c.fillStyle = GOLD; circ(c, 0, y0 - 52, 6); c.fill(); return; }
  if (k === 'lamp') { c.fillStyle = '#3a3a48'; c.fillRect(x0 + 10, y0 - 30, w - 20, 30); c.fillStyle = '#ffe08a'; c.fillRect(x0 + 16, y0 - 26, w - 32, 22);
    c.fillStyle = '#ff5a4e'; c.beginPath(); c.moveTo(x0 + 4, y0 - 30); c.lineTo(0, y0 - 52); c.lineTo(x0 + w - 4, y0 - 30); c.fill(); return; }
  if (k === 'dome') { c.fillStyle = shade(b.tint, -0.1); c.beginPath(); c.arc(0, y0, w / 2, Math.PI, 0); c.fill(); c.fillStyle = E.trim; c.fillRect(-3, y0 - w / 2 - 14, 6, 16); return; }
  if (k === 'clock') { c.fillStyle = '#fff8ee'; circ(c, 0, y0 + 26, 20); c.fill(); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
    var a = G.t * 0.6; line(c, 0, y0 + 26, Math.cos(a) * 14, y0 + 26 + Math.sin(a) * 14); line(c, 0, y0 + 26, Math.cos(a / 12) * 9, y0 + 26 + Math.sin(a / 12) * 9);
    c.fillStyle = E.trim; c.beginPath(); c.moveTo(x0, y0); c.lineTo(0, y0 - 40); c.lineTo(x0 + w, y0); c.fill(); return; }
  if (r === 'boulder') { c.fillStyle = '#8f8270'; for (var i = 0; i < 3; i++) { ell(c, x0 + w * (0.2 + i * 0.3), y0 - 8, 16, 11); c.fill(); } }
  else if (r === 'pyramid') { c.fillStyle = '#d4a24c'; c.beginPath(); c.moveTo(x0 + 6, y0); c.lineTo(0, y0 - 34); c.lineTo(x0 + w - 6, y0); c.fill(); c.fillStyle = '#ffd86b'; c.beginPath(); c.moveTo(-6, y0 - 28); c.lineTo(0, y0 - 34); c.lineTo(6, y0 - 28); c.fill(); }
  else if (r === 'pediment') { c.beginPath(); c.moveTo(x0 - 6, y0 + 2); c.lineTo(0, y0 - 28); c.lineTo(x0 + w + 6, y0 + 2); c.fill(); }
  else if (r === 'gable') { c.fillStyle = '#5a3418'; c.beginPath(); c.moveTo(x0 - 10, y0 + 4); c.lineTo(0, y0 - 40); c.lineTo(x0 + w + 10, y0 + 4); c.fill();
    c.strokeStyle = '#d9a441'; c.lineWidth = 4; c.beginPath(); c.moveTo(-4, y0 - 36); c.quadraticCurveTo(-14, y0 - 56, -4, y0 - 58); c.moveTo(4, y0 - 36); c.quadraticCurveTo(14, y0 - 56, 4, y0 - 58); c.stroke(); }
  else if (r === 'chimney') { c.fillStyle = '#6a3a2e'; c.fillRect(x0 + 12, y0 - 26, 14, 26); c.fillRect(x0 + w - 30, y0 - 20, 14, 20); c.fillStyle = '#3a2a24'; c.fillRect(x0 + 10, y0 - 28, 18, 4);
    if (!RM && Math.random() < 0.04) part(PK.smoke, b.x + 19, y0 + GY - 30, rnd(-6, 6), -30, 2, 'rgba(200,190,180,.55)', 8, -6); }
  else if (r === 'neon') { c.strokeStyle = b.i % 2 ? '#2de2e6' : '#ff4fa3'; c.lineWidth = 3; rr(c, x0 + 12, y0 - 26, w - 24, 20, 6); c.stroke(); c.beginPath(); c.moveTo(x0 + 22, y0 - 16); c.lineTo(x0 + w - 22, y0 - 16); c.stroke(); }
  else if (r === 'antenna') { c.strokeStyle = E.trim; c.lineWidth = 3; line(c, x0 + w * 0.7, y0, x0 + w * 0.7, y0 - 34); c.fillStyle = '#7cf5c9'; circ(c, x0 + w * 0.7, y0 - 36, 5); c.fill(); c.fillStyle = shade(b.tint, -0.12); c.beginPath(); c.arc(x0 + w * 0.3, y0, 18, Math.PI, 0); c.fill(); }
}
function drawOcc(c, cl, x, y, s) {
  var o = cl.occ, wav = Math.sin(G.real * 6 + cl.seed) * 0.4;
  if (o === 'snack') {
    c.fillStyle = '#fff8ee'; ell(c, x, y + s * 0.22, s * 0.38, s * 0.1); c.fill();
    snackIcon(c, x, y + s * 0.05, s * 0.3);
    if (!RM) { c.globalAlpha = 0.5 + Math.sin(G.real * 4 + cl.seed) * 0.3; c.strokeStyle = '#7cf5c9'; c.lineWidth = 2; circ(c, x, y, s * 0.48); c.stroke(); c.globalAlpha = 1; }
    return;
  }
  if (o === 'jay') { drawJay(c, x, y + s * 0.35, s * 0.03, wav); return; }
  /* an extra, waving from the window */
  c.fillStyle = G.era.id === 'egypt' ? '#e0a24a' : ['#ffcf9e', '#c68a5a', '#8a5a3a', '#f2c7a0'][Math.floor(cl.seed) % 4];
  circ(c, x, y - s * 0.05, s * 0.22); c.fill();
  if (G.era.id === 'egypt') { c.beginPath(); c.moveTo(x - s * 0.2, y - s * 0.15); c.lineTo(x - s * 0.14, y - s * 0.38); c.lineTo(x - s * 0.04, y - s * 0.22); c.moveTo(x + s * 0.2, y - s * 0.15); c.lineTo(x + s * 0.14, y - s * 0.38); c.lineTo(x + s * 0.04, y - s * 0.22); c.fill(); }
  c.fillStyle = INK; circ(c, x - s * 0.07, y - s * 0.07, 1.6); c.fill(); circ(c, x + s * 0.07, y - s * 0.07, 1.6); c.fill();
  c.strokeStyle = INK; c.lineWidth = 1.4; c.beginPath(); c.arc(x, y - s * 0.02, s * 0.08, 0.2, Math.PI - 0.2); c.stroke();
  c.strokeStyle = c.fillStyle = ['#ff5a4e', '#2ed3c6', '#c99bff', '#ffc53d'][Math.floor(cl.seed * 7) % 4];
  c.lineWidth = 4; c.lineCap = 'round';
  line(c, x + s * 0.2, y + s * 0.2, x + s * 0.32, y - s * 0.12 + wav * 6);
  c.lineCap = 'butt';
  c.fillRect(x - s * 0.2, y + s * 0.16, s * 0.4, s * 0.2);
}
function snackIcon(c, x, y, r) {
  var s = G ? G.era.id : 'stone';
  if (s === 'stone') { c.fillStyle = '#a07a4a'; ell(c, x, y, r, r * 0.8); c.fill(); c.fillStyle = '#5a3a1a'; circ(c, x - r * 0.3, y - r * 0.2, r * 0.15); c.fill(); circ(c, x + r * 0.3, y + r * 0.1, r * 0.15); c.fill(); }
  else if (s === 'egypt') { c.fillStyle = '#6a2a18'; for (var i = -1; i <= 1; i++) { ell(c, x + i * r * 0.55, y, r * 0.3, r * 0.5, 0.3); c.fill(); } }
  else if (s === 'rome') { c.fillStyle = '#7a3a8f'; for (i = 0; i < 6; i++) { circ(c, x + ((i % 3) - 1) * r * 0.45, y + Math.floor(i / 3) * r * 0.45 - r * 0.2, r * 0.28); c.fill(); } c.fillStyle = '#3a7a2a'; c.fillRect(x - 1, y - r * 0.8, 3, r * 0.4); }
  else if (s === 'viking') { c.fillStyle = '#c98a4a'; ell(c, x, y, r, r * 0.7); c.fill(); c.strokeStyle = '#8a5a2a'; c.lineWidth = 2; line(c, x - r * 0.5, y - r * 0.2, x + r * 0.5, y - r * 0.2); }
  else if (s === 'victorian') { c.fillStyle = '#e8c27a'; ell(c, x, y, r, r * 0.45); c.fill(); c.fillStyle = '#b8863a'; for (i = -2; i <= 2; i++) { circ(c, x + i * r * 0.3, y - r * 0.05, r * 0.07); c.fill(); } }
  else if (s === 'eighties') { c.fillStyle = '#ff4fa3'; rr(c, x - r * 0.4, y - r, r * 0.8, r * 1.4, r * 0.35); c.fill(); c.fillStyle = '#2de2e6'; c.fillRect(x - r * 0.4, y - r * 0.3, r * 0.8, r * 0.3); c.fillStyle = '#e8d6b0'; c.fillRect(x - 1.5, y + r * 0.4, 3, r * 0.5); }
  else { c.fillStyle = '#ff5a4e'; rr(c, x - r, y - r * 0.3, r * 2, r * 0.6, r * 0.3); c.fill(); c.fillStyle = GOLD; c.fillRect(x - r * 0.25, y - r * 0.3, r * 0.5, r * 0.6); }
}

/* ---------- people (always happy, always fine) ---------- */
function drawJay(c, x, y, sc, wav) {
  /* Jay: messy brown hair and big eyebrows */
  c.save(); c.translate(x, y); c.scale(sc * 30, sc * 30);
  c.fillStyle = '#3c6a8f'; rr(c, -0.5, -0.2, 1, 0.9, 0.2); c.fill();
  c.fillStyle = '#f2c7a0'; circ(c, 0, -0.55, 0.38); c.fill();
  c.fillStyle = '#6a4024';
  c.beginPath(); c.moveTo(-0.42, -0.6); c.lineTo(-0.36, -0.95); c.lineTo(-0.2, -0.85); c.lineTo(-0.1, -1.08); c.lineTo(0.05, -0.9); c.lineTo(0.18, -1.05); c.lineTo(0.28, -0.85); c.lineTo(0.44, -0.92); c.lineTo(0.4, -0.6); c.lineTo(0.2, -0.78); c.lineTo(-0.2, -0.76); c.closePath(); c.fill();
  c.fillStyle = '#3a2410'; c.fillRect(-0.3, -0.68, 0.22, 0.07); c.fillRect(0.08, -0.68, 0.22, 0.07);
  c.fillStyle = INK; circ(c, -0.17, -0.55, 0.05); c.fill(); circ(c, 0.17, -0.55, 0.05); c.fill();
  c.strokeStyle = INK; c.lineWidth = 0.06; c.beginPath(); c.arc(0, -0.42, 0.12, 0.2, Math.PI - 0.2); c.stroke();
  c.strokeStyle = '#f2c7a0'; c.lineWidth = 0.18; c.lineCap = 'round'; line(c, 0.45, 0, 0.75, -0.55 + (wav || 0) * 0.3); c.lineCap = 'butt';
  c.restore();
}
function drawPerson(c, r, x, y) {
  var run = r.sp > 0 ? Math.sin(r.t * 14) : 0, col = ['#ff5a4e', '#2ed3c6', '#c99bff', '#ffc53d', '#7cf5c9'][r.v || 0];
  var skin = ['#ffcf9e', '#c68a5a', '#8a5a3a', '#f2c7a0', '#e0b088'][(r.v + 2) % 5];
  var dance = G.mode === 'musical' && !RM ? Math.abs(Math.sin(G.beat * Math.PI)) * 6 : 0;
  c.save(); c.translate(x, y - dance);
  if (r.kind === 'cat') {
    c.fillStyle = ['#e0a24a', '#3a2a24', '#f2e6d0', '#a8a8a8', '#d07a2a'][r.v || 0];
    ell(c, 0, -14, 16, 9); c.fill(); circ(c, 13 * r.dir, -24, 8); c.fill();
    c.beginPath(); c.moveTo(8 * r.dir, -29); c.lineTo(10 * r.dir, -38); c.lineTo(14 * r.dir, -30); c.moveTo(14 * r.dir, -30); c.lineTo(19 * r.dir, -37); c.lineTo(19 * r.dir, -27); c.fill();
    c.strokeStyle = c.fillStyle; c.lineWidth = 3; c.beginPath(); c.moveTo(-14 * r.dir, -16); c.quadraticCurveTo(-26 * r.dir, -30, -20 * r.dir, -36); c.stroke();
    c.lineWidth = 3; line(c, -8, -8, -8 + run * 4, 0); line(c, 8, -8, 8 - run * 4, 0);
    c.restore(); return;
  }
  c.strokeStyle = '#3a2a3a'; c.lineWidth = 5; c.lineCap = 'round';
  line(c, -4, -20, -4 + run * 6, 0); line(c, 4, -20, 4 - run * 6, 0);
  c.fillStyle = r.kind === 'crew' ? '#22222a' : col; rr(c, -9, -42, 18, 24, 6); c.fill();
  c.fillStyle = skin; circ(c, 0, -51, 9); c.fill();
  c.fillStyle = INK; circ(c, -3 + r.dir * 2, -52, 1.5); c.fill(); circ(c, 3 + r.dir * 2, -52, 1.5); c.fill();
  c.strokeStyle = INK; c.lineWidth = 1.5; c.beginPath(); c.arc(r.dir * 2, -49, 3.5, 0.2, Math.PI - 0.2); c.stroke();
  c.strokeStyle = skin; c.lineWidth = 4;
  if (r.scared || r.wave > 0) { line(c, 7, -38, 14, -58 + Math.sin(r.t * 16) * 4); line(c, -7, -38, -12, -54 - Math.sin(r.t * 16) * 4); }
  else { line(c, 7, -38, 10, -24); line(c, -7, -38, -10, -24); }
  c.lineCap = 'butt';
  if (r.kind === 'crew') { c.strokeStyle = '#555'; c.lineWidth = 2; c.beginPath(); c.arc(0, -52, 10, Math.PI, 0); c.stroke(); c.fillStyle = '#555'; circ(c, -10, -51, 3); c.fill();
    if (r.v === 0) { c.strokeStyle = '#777'; c.lineWidth = 3; line(c, 10, -40, 40 * -r.dir, -78); c.fillStyle = '#999'; ell(c, 40 * -r.dir, -80, 9, 5); c.fill(); }
    if (r.v === 2) { c.fillStyle = '#333'; c.fillRect(-14, -46, 10, 8); } }
  else if (r.hat) { c.fillStyle = hatCol(r.v); eraHatSmall(c, 0, -58); }
  if (r.kind === 'sign') { c.fillStyle = '#fff8ee'; c.fillRect(8, -50, 14, 18); c.strokeStyle = INK; c.lineWidth = 1; c.strokeRect(8, -50, 14, 18); }
  c.restore();
}
function hatCol(v) { return ['#3a2a3a', '#7a3a2a', '#2a4a6a', '#5a5a2a', '#6a2a5a'][v || 0]; }
function eraHatSmall(c, x, y) {
  var id = G.era.id;
  if (id === 'victorian') { c.fillRect(x - 8, y + 2, 16, 3); c.fillRect(x - 5, y - 10, 10, 12); }
  else if (id === 'rome') { c.strokeStyle = '#4a8a3a'; c.lineWidth = 3; c.beginPath(); c.arc(x, y + 6, 8, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
  else if (id === 'viking') { c.fillStyle = '#9aa0a8'; c.beginPath(); c.arc(x, y + 5, 9, Math.PI, 0); c.fill(); c.fillStyle = '#f2e6d0'; c.beginPath(); c.moveTo(x - 8, y + 2); c.lineTo(x - 14, y - 8); c.lineTo(x - 6, y - 2); c.moveTo(x + 8, y + 2); c.lineTo(x + 14, y - 8); c.lineTo(x + 6, y - 2); c.fill(); }
  else if (id === 'eighties') { c.fillStyle = '#ffcf4f'; ell(c, x, y + 2, 12, 9); c.fill(); }
  else if (id === 'future') { c.fillStyle = '#7cf5c9'; c.fillRect(x - 9, y + 4, 18, 4); }
  else if (id === 'stone') { c.fillStyle = '#a07a4a'; c.beginPath(); c.moveTo(x - 9, y + 6); c.lineTo(x - 4, y - 2); c.lineTo(x + 2, y + 4); c.lineTo(x + 9, y - 1); c.lineTo(x + 9, y + 6); c.fill(); }
  else if (id === 'egypt') { c.fillStyle = '#2a6f8f'; c.fillRect(x - 9, y + 2, 18, 5); c.fillStyle = '#ffd86b'; c.fillRect(x - 9, y + 2, 18, 2); }
  else c.fillRect(x - 8, y, 16, 6);
}
function drawBonnie(c, x, y, dir, sit, t) {
  /* Bonnie: a small brown toy poodle with no tail */
  c.save(); c.translate(x, y); c.scale(dir, 1);
  var bob = sit > 0 ? 0 : Math.abs(Math.sin(t * 12)) * 2;
  c.fillStyle = '#7a4a2a';
  if (sit > 0) { ell(c, -2, -12, 10, 11); c.fill(); }
  else { ell(c, 0, -13 - bob, 13, 8); c.fill(); }
  c.strokeStyle = '#6a3e22'; c.lineWidth = 4; c.lineCap = 'round';
  if (sit <= 0) { var k = Math.sin(t * 12) * 4; line(c, -8, -8, -8 + k, 0); line(c, 8, -8, 8 - k, 0); }
  else { line(c, 4, -6, 6, 0); }
  c.lineCap = 'butt';
  c.fillStyle = '#7a4a2a';
  for (var i = 0; i < 5; i++) { circ(c, 10 + Math.cos(i * 1.3) * 4, -24 - bob + Math.sin(i * 1.3) * 4, 5); c.fill(); }
  c.fillStyle = '#8a5a34'; ell(c, 17, -21 - bob, 6, 4); c.fill();
  c.fillStyle = '#6a3e22'; ell(c, 6, -20 - bob, 4, 7); c.fill();
  c.fillStyle = INK; circ(c, 13, -25 - bob, 1.6); c.fill(); circ(c, 22, -22 - bob, 2); c.fill();
  c.restore();
}
function drawBox(c, r) {
  /* someone in a cardboard box, peeking out from the wings */
  var dir = -r.side, out = r.peek;
  c.save(); c.translate(r.x - r.side * (out * 40 - 30), GY);
  c.strokeStyle = '#3a2a24'; c.lineWidth = 5; c.lineCap = 'round';
  line(c, -8, -14, -9, 0); line(c, 8, -14, 9, 0);
  c.fillStyle = '#c9a36a'; c.fillRect(-20, -62, 40, 50);
  c.fillStyle = '#b08850'; c.fillRect(-20, -62, 40, 6);
  c.strokeStyle = 'rgba(90,60,30,.5)'; c.lineWidth = 1.5; line(c, 0, -62, 0, -50);
  c.fillStyle = '#1a0d1c'; ell(c, -7 + dir * 2, -44, 4, 5); c.fill(); ell(c, 7 + dir * 2, -44, 4, 5); c.fill();
  c.fillStyle = '#fff'; circ(c, -6 + dir * 3, -45, 1.4); c.fill(); circ(c, 8 + dir * 3, -45, 1.4); c.fill();
  if (r.wave > 0) { c.strokeStyle = '#f2c7a0'; c.lineWidth = 4; line(c, 20 * dir, -36, 30 * dir, -54 + Math.sin(G.real * 14) * 4); }
  c.lineCap = 'butt';
  c.restore();
}

/* the wings at each end of the set */
function drawWings(c) {
  for (var s = 0; s < 2; s++) {
    var x = s ? G.W - 18 : -60;
    c.fillStyle = '#1a0d1c'; c.fillRect(s ? x : x - 600, TOPY - 10, 678, GY - TOPY + 80);
    c.fillStyle = '#5a1650';
    for (var i = 0; i < 4; i++) { c.fillRect(x + (s ? 18 : 0) + i * 15, TOPY - 10, 8, GY - TOPY + 80); }
    c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(s ? x : x + 70, TOPY - 10, 8, GY - TOPY + 80);
  }
}

/* ==========================================================
   DRAWING: THE MONSTERS (all original, all clearly costumes)
   o: { walk, punch (0..1), face, st, hat, suit, era, t, hurt, neck, flop, beam, squash, thumb }
   drawn with the feet at 0,0 and the given scale
   ========================================================== */
var MCOL = {
  grumble: { body: '#8b5bd6', dark: '#5f3aa0', belly: '#ffb35c', horn: '#fff1d0' },
  blob: { body: '#5fd38a', dark: '#2e9e5e', belly: '#b8f5cf' },
  robot: { body: '#c9a36a', dark: '#9a7644', belly: '#7a8a96' },
  moth: { body: '#e8dcc8', dark: '#b8a888', belly: '#c99bff' },
  sock: { body: '#fff1e0', dark: '#e0c8b0', belly: '#ff5a4e' }
};
function arm(c, sx, sy, hx, hy, w, col, fist, fcol) {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round';
  c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo((sx + hx) / 2, (sy + hy) / 2 + w * 0.4, hx, hy); c.stroke();
  c.lineCap = 'butt';
  c.fillStyle = fcol || col; circ(c, hx, hy, fist); c.fill();
}
function drawMonster(c, mk, x, y, s, o) {
  var M = MON[mk], C = MCOL[mk], w = M.w, h = M.h;
  var walk = o.walk || 0, pun = o.punch || 0, st = o.st || 'stand', t = o.t || 0;
  var bob = st === 'stand' && !o.thumb ? Math.abs(Math.sin(walk)) * 2.5 : 0;
  if (o.dance) bob += o.dance;
  c.save(); c.translate(x, y); c.scale(s * (o.face || 1), s);
  if (o.squash > 0) c.scale(1 + o.squash * 1.2, 1 - o.squash * 1.2);
  if (o.hurt > 0 && !RM) c.rotate(Math.sin(t * 40) * 0.06);
  var pdown = o.pdown;
  if (mk === 'grumble') {
    /* legs */
    var lk = st === 'stand' ? Math.sin(walk) * 6 : st === 'wall' ? Math.sin(walk) * 8 : 4;
    c.fillStyle = C.dark; rr(c, -16 + lk * 0.4, -18, 14, 18, 5); c.fill(); rr(c, 2 - lk * 0.4, -18, 14, 18, 5); c.fill();
    c.fillStyle = C.horn; rr(c, -19 + lk * 0.4, -5, 18, 6, 3); c.fill(); rr(c, 1 - lk * 0.4, -5, 18, 6, 3); c.fill();
    /* back arm */
    if (st === 'wall') arm(c, -10, -52 - bob, -16, -70 - lk, 10, C.dark, 7);
    else arm(c, -14, -46 - bob, -20, -28 - bob, 10, C.dark, 7);
    /* body */
    c.fillStyle = C.body; c.beginPath(); c.moveTo(-22, -14); c.quadraticCurveTo(-26, -58 - bob, 0, -62 - bob); c.quadraticCurveTo(26, -58 - bob, 22, -14); c.closePath(); c.fill();
    c.fillStyle = C.belly; ell(c, 3, -30 - bob, 12, 15); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = 1.5; for (var i = 0; i < 3; i++) line(c, -6 + i * 4, -22 - bob - i * 6, 12, -22 - bob - i * 6);
    /* the zip up the back (it is a costume) */
    c.strokeStyle = '#d8d8e0'; c.lineWidth = 2; line(c, -19, -18, -15, -54 - bob);
    c.fillStyle = '#d8d8e0'; rr(c, -18, -40 - bob, 5, 8, 2); c.fill();
    /* horns */
    c.fillStyle = C.horn;
    c.beginPath(); c.moveTo(-14, -56 - bob); c.quadraticCurveTo(-24, -74 - bob, -16, -82 - bob); c.quadraticCurveTo(-14, -70 - bob, -6, -60 - bob); c.fill();
    c.beginPath(); c.moveTo(10, -60 - bob); c.quadraticCurveTo(18, -76 - bob, 12, -84 - bob); c.quadraticCurveTo(22, -74 - bob, 18, -56 - bob); c.fill();
    /* one big eye */
    c.fillStyle = '#fff'; circ(c, 6, -48 - bob, 9); c.fill();
    c.fillStyle = INK; circ(c, 8 + (pun ? 2 : 0), -48 - bob, 4.5); c.fill();
    c.fillStyle = '#fff'; circ(c, 9.5, -50 - bob, 1.5); c.fill();
    c.strokeStyle = C.dark; c.lineWidth = 2.5; line(c, -2, -59 - bob + (pun ? 2 : 0), 14, -58 - bob);
    /* mouth with two little fangs */
    c.fillStyle = INK; rr(c, 4, -37 - bob, 14, pun ? 7 : 4, 2); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.moveTo(6, -37 - bob); c.lineTo(8, -33 - bob); c.lineTo(10, -37 - bob); c.moveTo(13, -37 - bob); c.lineTo(15, -33 - bob); c.lineTo(17, -37 - bob); c.fill();
    /* front arm */
    frontArm(c, st, pun, pdown, 14, -44 - bob, 11, C.body, 8.5, lk);
    hatOn(c, o, 2, -64 - bob, 1);
  } else if (mk === 'blob') {
    var sq = o.flop ? 0.2 : 0, wob = Math.sin(t * 6) * 2;
    c.fillStyle = C.body; c.globalAlpha = 0.92;
    c.beginPath(); c.moveTo(-29, 0); c.quadraticCurveTo(-34 - wob, -40, 0, -52 - bob + wob + sq * 20); c.quadraticCurveTo(34 + wob, -40, 29, 0); c.closePath(); c.fill();
    c.globalAlpha = 1;
    c.fillStyle = 'rgba(255,255,255,.45)'; ell(c, -12, -36 - bob, 6, 10, -0.4); c.fill();
    c.fillStyle = 'rgba(0,0,0,.08)'; circ(c, 8, -14, 4); c.fill(); circ(c, -8, -10, 3); c.fill();
    c.fillStyle = '#fff'; circ(c, 0, -34 - bob, 7); c.fill(); circ(c, 14, -34 - bob, 7); c.fill();
    c.fillStyle = INK; circ(c, 2 + (pun ? 2 : 0), -33 - bob, 3.5); c.fill(); circ(c, 16 + (pun ? 2 : 0), -33 - bob, 3.5); c.fill();
    c.strokeStyle = INK; c.lineWidth = 2.5; c.beginPath(); c.arc(8, -24 - bob, pun ? 7 : 5, 0.2, Math.PI - 0.2); c.stroke();
    if (pun) { c.fillStyle = C.body; var px = pdown ? 10 : 30 + pun * 10, py = pdown ? 12 : -26; arm(c, 18, -26, px, py, 10, C.dark, 9, C.body); }
    hatOn(c, o, 6, -50 - bob, 1);
  } else if (mk === 'robot') {
    var lk2 = st === 'stand' ? Math.sin(walk) * 5 : 3;
    c.fillStyle = '#8a8a96'; c.fillRect(-14 + lk2, -20, 10, 20); c.fillRect(4 - lk2, -20, 10, 20);
    c.fillStyle = '#5a5a66'; c.fillRect(-16 + lk2, -4, 14, 4); c.fillRect(2 - lk2, -4, 14, 4);
    arm(c, -14, -50, st === 'wall' ? -18 : -22, st === 'wall' ? -72 : -30, 7, '#9aa0a8', 6, '#5a5a66');
    c.fillStyle = C.body; c.fillRect(-20, -56, 40, 38);
    c.strokeStyle = C.dark; c.lineWidth = 1.5; c.strokeRect(-20, -56, 40, 38);
    c.fillStyle = C.dark; c.fillRect(-20, -40, 40, 2);
    c.fillStyle = '#7a8a96'; rr(c, -8, -50, 18, 12, 2); c.fill();
    c.fillStyle = '#ff5a4e'; circ(c, -3, -44, 2); c.fill(); c.fillStyle = '#7cf5c9'; circ(c, 4, -44, 2); c.fill();
    c.fillStyle = INK; c.font = 'bold 9px Arial'; c.textAlign = 'center'; c.fillText('9', 12, -24);
    c.fillStyle = C.body; c.fillRect(-14, -82, 32, 26); c.strokeStyle = C.dark; c.strokeRect(-14, -82, 32, 26);
    c.strokeStyle = '#9aa0a8'; c.lineWidth = 2; line(c, 2, -82, 2, -92); c.fillStyle = GOLD; circ(c, 2, -94, 3); c.fill();
    var eyeC = o.beam > 0 ? '#fff6a0' : '#2ed3c6';
    c.fillStyle = INK; rr(c, -4, -76, 22, 10, 3); c.fill();
    c.fillStyle = eyeC; circ(c, 2, -71, 3); c.fill(); circ(c, 12, -71, 3); c.fill();
    c.fillStyle = INK; c.fillRect(0, -62, 14, 2);
    frontArm(c, st, pun, pdown, 14, -48, 8, '#9aa0a8', 8, lk2, '#5a5a66');
    hatOn(c, o, 2, -82, 1);
  } else if (mk === 'moth') {
    var fl = Math.sin(t * 18) * 0.5 + 0.5;
    if (o.thumb) fl = 0.6;
    c.fillStyle = '#c99bff';
    c.save(); c.translate(-4, -30); c.rotate(-0.4 - fl * 0.6); ell(c, -18, -6, 22, 14); c.fill(); c.fillStyle = '#f2e6ff'; circ(c, -20, -6, 6); c.fill(); c.fillStyle = INK; circ(c, -20, -6, 2.5); c.fill(); c.restore();
    c.fillStyle = C.body; ell(c, 2, -26, 13, 20); c.fill();
    c.strokeStyle = C.dark; c.lineWidth = 2; for (i = 0; i < 3; i++) { c.beginPath(); c.arc(2, -16 - i * 7, 10, 0.3, Math.PI - 0.3); c.stroke(); }
    c.fillStyle = '#fff8ee'; for (i = 0; i < 6; i++) { circ(c, -8 + i * 4, -42 + (i % 2) * 2, 5); c.fill(); }
    c.fillStyle = '#e0c8f0';
    c.save(); c.translate(6, -30); c.rotate(0.2 + fl * 0.5); ell(c, 18, -8, 22, 15); c.fill(); c.fillStyle = '#fff8ee'; circ(c, 20, -8, 6); c.fill(); c.fillStyle = INK; circ(c, 20, -8, 2.5); c.fill(); c.restore();
    c.fillStyle = INK; circ(c, 8, -38, 4); c.fill(); circ(c, 16, -36, 4); c.fill(); c.fillStyle = '#fff'; circ(c, 9, -39, 1.3); c.fill(); circ(c, 17, -37, 1.3); c.fill();
    c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.moveTo(8, -42); c.quadraticCurveTo(6, -54, 0, -56); c.moveTo(14, -41); c.quadraticCurveTo(18, -54, 24, -55); c.stroke();
    c.strokeStyle = INK; c.lineWidth = 2; line(c, -4, -8, -8, 0); line(c, 6, -8, 8, 0);
    if (pun) arm(c, 12, -26, pdown ? 10 : 30 + pun * 6, pdown ? 6 : -26, 5, C.dark, 7, C.body);
    hatOn(c, o, 10, -46, 0.8);
  } else if (mk === 'sock') {
    var n = o.neck || 0;
    /* the stripy sock, stretching up from its heel */
    c.fillStyle = C.body; rr(c, -20, -24, 40, 24, 10); c.fill();
    c.fillStyle = C.belly; c.fillRect(-20, -14, 40, 5);
    c.fillStyle = C.body; c.fillRect(-14, -24 - n - 10, 28, n + 12);
    c.fillStyle = C.belly; for (var k = -30; k > -24 - n; k -= 18) c.fillRect(-14, k, 28, 6);
    c.fillStyle = '#2ed3c6'; for (k = -39; k > -24 - n; k -= 18) c.fillRect(-14, k, 28, 3);
    var hy2 = -34 - n;
    c.fillStyle = C.body; ell(c, 6, hy2, 22, 15); c.fill();
    c.fillStyle = '#c0304a'; c.beginPath(); c.moveTo(8, hy2 + 2); c.quadraticCurveTo(30, hy2 + 4 + pun * 8, 28, hy2 + (pun ? 12 : 4)); c.quadraticCurveTo(16, hy2 + 14, 8, hy2 + 2); c.fill();
    c.fillStyle = '#ff7a9a'; ell(c, 20, hy2 + 7 + pun * 2, 6, 3); c.fill();
    c.fillStyle = '#2a1030'; circ(c, 2, hy2 - 6, 5); c.fill(); circ(c, 14, hy2 - 8, 5); c.fill();
    c.fillStyle = '#fff'; circ(c, 1, hy2 - 7, 1.6); c.fill(); circ(c, 13, hy2 - 9, 1.6); c.fill();
    c.strokeStyle = '#ffc53d'; c.lineWidth = 2; for (k = 0; k < 4; k++) line(c, -6 + k * 3, hy2 - 14, -8 + k * 4, hy2 - 22);
    hatOn(c, o, 4, hy2 - 14, 0.9);
  }
  if (o.suit === 'glitter' && !o.sil) {
    var gl = o.thumb ? 7 : 5;
    for (i = 0; i < gl; i++) {
      var a = (i * 2.4 + t * (RM ? 0 : 1.5)), gx = Math.cos(a) * w * 0.4, gy = -h * 0.5 + Math.sin(a * 1.3) * h * 0.4 - (mk === 'sock' ? (o.neck || 0) * 0.5 : 0);
      c.fillStyle = ['#fff6a0', '#ffffff', '#ff9ec7', '#7cf5c9'][i % 4];
      c.save(); c.translate(gx, gy); c.rotate(a); c.fillRect(-3, -0.8, 6, 1.6); c.fillRect(-0.8, -3, 1.6, 6); c.restore();
    }
  }
  c.restore();
}
function frontArm(c, st, pun, pdown, sx, sy, w, col, fist, lk, fcol) {
  var hx, hy;
  if (pun > 0) {
    if (pdown) { hx = sx + 6; hy = 14; }
    else { hx = sx + 18 + pun * 22; hy = sy - 2; }
  } else if (st === 'wall') { hx = sx + 4; hy = sy - 26 + lk; }
  else if (st === 'air' || st === 'fly') { hx = sx + 12; hy = sy - 18; }
  else { hx = sx + 8; hy = sy + 18 + lk * 0.3; }
  arm(c, sx, sy, hx, hy, w, col, fist, fcol);
  if (pun > 0.5 && !pdown) { c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 2; line(c, hx - 30, hy - 8, hx - 14, hy - 6); line(c, hx - 30, hy + 6, hx - 14, hy + 4); }
}
/* hats and this week's costume bit */
function hatOn(c, o, x, y, k) {
  if (o.sil) return;
  var era = o.era;
  c.save(); c.translate(x, y); c.scale(k, k);
  if (era === 'stone') { c.fillStyle = '#d9a441'; c.beginPath(); c.moveTo(-14, 28); c.lineTo(14, 44); c.lineTo(14, 52); c.lineTo(-14, 36); c.fill(); c.fillStyle = '#5a3a1a'; circ(c, -6, 34, 2); c.fill(); circ(c, 6, 42, 2); c.fill(); }
  else if (era === 'egypt') { c.fillStyle = '#2a6f8f'; c.beginPath(); c.arc(0, 40, 16, 0.1, Math.PI - 0.1); c.lineWidth = 6; c.strokeStyle = '#ffd86b'; c.stroke(); }
  else if (era === 'rome' && o.hat === 'none') { c.strokeStyle = '#4a8a3a'; c.lineWidth = 4; c.beginPath(); c.arc(0, 8, 14, Math.PI * 1.05, Math.PI * 1.95); c.stroke(); c.fillStyle = '#6aaa4a'; for (var i = 0; i < 6; i++) { var a = Math.PI * (1.1 + i * 0.15); ell(c, Math.cos(a) * 14, 8 + Math.sin(a) * 14, 4, 2, a); c.fill(); } }
  else if (era === 'viking') { c.strokeStyle = '#d9a441'; c.lineWidth = 4; c.beginPath(); c.moveTo(-10, 34); c.lineTo(-14, 52); c.moveTo(10, 34); c.lineTo(14, 52); c.stroke(); }
  else if (era === 'victorian') { c.strokeStyle = '#3a2410'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 28); c.quadraticCurveTo(-8, 24, -14, 30); c.moveTo(0, 28); c.quadraticCurveTo(10, 24, 16, 30); c.stroke(); c.lineCap = 'butt'; c.strokeStyle = GOLD; c.lineWidth = 1.5; circ(c, 6, 16, 5); c.stroke(); }
  else if (era === 'eighties') { c.fillStyle = '#ff4fa3'; c.fillRect(-14, 8, 28, 5); c.fillStyle = '#2de2e6'; c.fillRect(-14, 10, 28, 1.5); }
  else if (era === 'future') { c.fillStyle = 'rgba(124,245,201,.75)'; rr(c, -6, 12, 22, 7, 3); c.fill(); if (o.xmas) { c.strokeStyle = '#ffc53d'; c.lineWidth = 3; c.beginPath(); for (i = 0; i <= 6; i++) { var tx = -14 + i * 5, ty = 34 + (i % 2) * 4; if (i) c.lineTo(tx, ty); else c.moveTo(tx, ty); } c.stroke(); } }
  var h = o.hat;
  if (h === 'party') { c.fillStyle = '#ff5a4e'; c.beginPath(); c.moveTo(-9, 2); c.lineTo(0, -24); c.lineTo(9, 2); c.fill(); c.fillStyle = GOLD; circ(c, -3, -6, 2); c.fill(); circ(c, 3, -12, 2); c.fill(); circ(c, 0, -25, 4); c.fill(); }
  else if (h === 'top') { c.fillStyle = '#1a0d1c'; c.fillRect(-14, -2, 28, 5); c.fillRect(-9, -24, 18, 23); c.fillStyle = '#ff5a4e'; c.fillRect(-9, -8, 18, 4); }
  else if (h === 'crown') { c.fillStyle = GOLD; c.beginPath(); c.moveTo(-12, 2); c.lineTo(-12, -12); c.lineTo(-6, -5); c.lineTo(0, -16); c.lineTo(6, -5); c.lineTo(12, -12); c.lineTo(12, 2); c.closePath(); c.fill(); c.fillStyle = '#ff5a4e'; circ(c, 0, -3, 2.5); c.fill(); }
  c.restore();
}

/* ==========================================================
   DRAWING: THE ARMY (cardboard, on wires, very polite)
   ========================================================== */
function wires(c, x, y, spread) {
  c.strokeStyle = 'rgba(30,30,30,.45)'; c.lineWidth = 1;
  line(c, x - spread, y, x - spread * 0.5, TOPY); line(c, x + spread, y, x + spread * 0.5, TOPY);
}
function drawTank(c, t) {
  var k = t.kind, x = t.x, y = t.y, f = t.face || 1, wob = Math.sin(t.wob) * 1.5;
  wires(c, x, y - 34, 26);
  c.save(); c.translate(x, y); if (t.out) c.rotate(t.rot); c.scale(f, 1);
  c.translate(0, wob);
  if (k === 'mammoth') {
    c.fillStyle = '#8a5a3a'; ell(c, 0, -30, 34, 22); c.fill(); circ(c, 28, -34, 14); c.fill();
    c.strokeStyle = '#8a5a3a'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(36, -30); c.quadraticCurveTo(44, -10, 36, -4); c.stroke(); c.lineCap = 'butt';
    c.strokeStyle = '#fff1d0'; c.lineWidth = 4; c.beginPath(); c.arc(40, -22, 10, Math.PI * 0.6, Math.PI * 1.2); c.stroke();
    c.fillStyle = INK; circ(c, 32, -38, 2); c.fill();
  } else if (k === 'barge') {
    c.fillStyle = '#d9a441'; c.beginPath(); c.moveTo(-40, -30); c.quadraticCurveTo(0, -4, 40, -30); c.lineTo(34, -12); c.lineTo(-34, -12); c.closePath(); c.fill();
    c.strokeStyle = '#a8813a'; c.lineWidth = 2; for (var i = -30; i <= 30; i += 8) line(c, i, -24 + Math.abs(i) * 0.15, i, -12);
    c.fillStyle = '#fff8ee'; c.beginPath(); c.moveTo(0, -30); c.lineTo(0, -66); c.lineTo(22, -36); c.closePath(); c.fill();
  } else if (k === 'horse') {
    c.fillStyle = '#c98a4a'; rr(c, -34, -46, 68, 26, 12); c.fill();
    c.fillStyle = '#8a4a2a'; c.fillRect(-2, -46, 4, 26);
    c.fillStyle = '#c98a4a'; rr(c, 24, -66, 18, 26, 6); c.fill(); ell(c, 40, -64, 10, 7); c.fill();
    c.fillStyle = '#5a2a1a'; for (i = 0; i < 4; i++) c.fillRect(24, -66 + i * 6, -6, 4);
    c.fillStyle = INK; circ(c, 38, -66, 2); c.fill();
    c.strokeStyle = '#3a3a5a'; c.lineWidth = 6; var lg = Math.sin(t.wob * 2) * 4;
    line(c, -26, -20, -26 + lg, 0); line(c, -14, -20, -14 - lg, 0); line(c, 14, -20, 14 + lg, 0); line(c, 26, -20, 26 - lg, 0);
    c.fillStyle = '#f2e6d0'; c.fillRect(-34, -48, 68, 4);
  } else if (k === 'longship') {
    c.fillStyle = '#7a4e2c'; c.beginPath(); c.moveTo(-44, -36); c.quadraticCurveTo(0, -6, 44, -36); c.lineTo(36, -14); c.lineTo(-36, -14); c.closePath(); c.fill();
    c.strokeStyle = '#7a4e2c'; c.lineWidth = 5; c.beginPath(); c.moveTo(42, -34); c.quadraticCurveTo(52, -50, 44, -56); c.stroke();
    for (i = -24; i <= 24; i += 16) { c.fillStyle = i % 32 ? '#d9a441' : '#b3263a'; circ(c, i, -26, 7); c.fill(); }
    c.fillStyle = '#f2e6d0'; c.fillRect(-1, -70, 3, 40); c.fillStyle = '#b3263a'; c.fillRect(-18, -66, 36, 22); c.fillStyle = '#f2e6d0'; c.fillRect(-18, -58, 36, 4);
  } else {
    /* a cardboard tank, in era colours */
    var body = k === 'neon' ? '#1c1636' : k === 'hover' ? '#b8c8de' : k === 'steam' ? '#4a3f36' : '#8a9a6a';
    c.fillStyle = body; rr(c, -36, -30, 72, 20, 6); c.fill(); rr(c, -18, -44, 36, 16, 6); c.fill();
    c.fillStyle = k === 'neon' ? '#ff4fa3' : k === 'hover' ? '#5ad8b0' : k === 'steam' ? '#a8323e' : '#6a7a4a';
    c.fillRect(14, -40, 34, 6);
    c.fillStyle = '#ff9a3c'; c.fillRect(46, -42, 6, 10);
    if (k === 'hover') { c.fillStyle = 'rgba(124,245,201,.5)'; ell(c, 0, -4, 34, 4); c.fill(); }
    else { c.fillStyle = '#3a3a3a'; rr(c, -38, -14, 76, 14, 7); c.fill(); c.fillStyle = '#777'; for (i = -28; i <= 28; i += 14) { circ(c, i + (t.x % 14) * 0.2, -7, 4); c.fill(); } }
    if (k === 'neon') { c.strokeStyle = '#2de2e6'; c.lineWidth = 2; rr(c, -36, -30, 72, 20, 6); c.stroke(); }
    if (k === 'steam') { c.fillStyle = '#2a2420'; c.fillRect(-26, -60, 8, 18); }
    c.strokeStyle = 'rgba(90,60,30,.35)'; c.lineWidth = 1; line(c, -30, -22, 30, -22);
    c.fillStyle = '#fff8ee'; c.font = 'bold 8px Arial'; c.textAlign = 'center'; c.fillText('PROP', -4, -16);
  }
  c.restore();
  if (t.conf > 0) { c.fillStyle = '#fff6fb'; c.font = 'bold 20px ' + CF; c.textAlign = 'center'; c.fillText('?', x, y - 70); }
}
function drawHeli(c, h) {
  var k = G.E.heli, x = h.x, y = h.y;
  /* the fishing rod line, from a rod poking in at the top */
  c.strokeStyle = 'rgba(240,240,240,.75)'; c.lineWidth = 1.2; line(c, x, y - 14, x + 30, TOPY + 4);
  c.save(); c.translate(x, y); if (h.out) c.rotate(h.spin);
  var fl = Math.sin(h.rot) * 0.5;
  if (k === 'ptero' || k === 'falcon' || k === 'eagle' || k === 'raven') {
    var col = k === 'ptero' ? '#9a6a4a' : k === 'falcon' ? '#c98a4a' : k === 'eagle' ? '#6a4a2a' : '#2a2430';
    c.fillStyle = col;
    c.beginPath(); c.moveTo(-6, 0); c.lineTo(-46, -14 - fl * 20); c.lineTo(-20, 6); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(6, 0); c.lineTo(46, -14 - fl * 20); c.lineTo(20, 6); c.closePath(); c.fill();
    ell(c, 0, 2, 12, 9); c.fill(); circ(c, 12, -4, 7); c.fill();
    c.fillStyle = k === 'ptero' ? '#c9a06a' : GOLD; c.beginPath(); c.moveTo(18, -4); c.lineTo(32, -2); c.lineTo(18, 0); c.fill();
    if (k === 'ptero') { c.fillStyle = col; c.beginPath(); c.moveTo(8, -8); c.lineTo(-6, -18); c.lineTo(12, -10); c.fill(); }
    c.fillStyle = '#fff'; circ(c, 13, -6, 2.2); c.fill(); c.fillStyle = INK; circ(c, 13.5, -6, 1.1); c.fill();
  } else if (k === 'airship') {
    c.fillStyle = '#a8323e'; ell(c, 0, -6, 38, 15); c.fill(); c.fillStyle = '#e8dcc4'; c.fillRect(-38, -8, 76, 3);
    c.fillStyle = '#4a3f36'; rr(c, -12, 10, 24, 9, 3); c.fill(); c.strokeStyle = '#4a3f36'; c.lineWidth = 1; line(c, -10, 6, -10, 10); line(c, 10, 6, 10, 10);
    c.fillStyle = '#e8dcc4'; c.beginPath(); c.moveTo(-36, -6); c.lineTo(-48, -18); c.lineTo(-48, 6); c.fill();
  } else if (k === 'drone') {
    c.fillStyle = '#dfe8f4'; rr(c, -16, -6, 32, 12, 5); c.fill(); c.fillStyle = '#7cf5c9'; circ(c, 0, 0, 4); c.fill();
    c.strokeStyle = '#5a6a80'; c.lineWidth = 2; line(c, -16, -2, -28, -8); line(c, 16, -2, 28, -8);
    c.fillStyle = 'rgba(200,220,255,.5)'; ell(c, -28, -10, 12 * Math.abs(Math.cos(h.rot)) + 2, 2); c.fill(); ell(c, 28, -10, 12 * Math.abs(Math.cos(h.rot)) + 2, 2); c.fill();
    if (G.xmas) { c.fillStyle = '#ff5a4e'; c.beginPath(); c.moveTo(-8, -6); c.lineTo(0, -20); c.lineTo(8, -6); c.fill(); c.fillStyle = '#fff'; circ(c, 0, -20, 3); c.fill(); }
  } else {
    var bodyc = k === 'neonheli' ? '#1c1636' : '#7a8a6a';
    c.fillStyle = bodyc; ell(c, 0, 0, 22, 12); c.fill(); c.fillRect(-46, -4, 30, 5); c.fillRect(-48, -10, 5, 12);
    c.fillStyle = k === 'neonheli' ? '#2de2e6' : '#bfe0ff'; ell(c, 9, -2, 9, 7); c.fill();
    c.strokeStyle = '#3a3a3a'; c.lineWidth = 2; line(c, -10, 12, 12, 12); line(c, 0, -12, 0, -16);
    c.fillStyle = '#5a5a5a'; var rw = 32 * Math.abs(Math.cos(h.rot)) + 4; c.fillRect(-rw, -18, rw * 2, 3);
    if (k === 'neonheli') { c.strokeStyle = '#ff4fa3'; c.lineWidth = 2; ell(c, 0, 0, 22, 12); c.stroke(); }
    c.fillStyle = '#fff8ee'; c.font = 'bold 7px Arial'; c.textAlign = 'center'; c.fillText('PROP', -6, 4);
  }
  c.restore();
  if (h.conf > 0) { c.fillStyle = '#fff6fb'; c.font = 'bold 20px ' + CF; c.textAlign = 'center'; c.fillText('?', x, y - 30); }
}
function drawMeg(c, g) {
  var x = g.x, f = g.x < G.m.x ? 1 : -1, lg = Math.sin(g.walk) * 4;
  c.save(); c.translate(x, GY); c.scale(f, 1);
  c.strokeStyle = '#2a2a3a'; c.lineWidth = 5; c.lineCap = 'round'; line(c, -4, -22, -4 + lg, 0); line(c, 4, -22, 4 - lg, 0);
  c.fillStyle = '#4a6a3a'; rr(c, -10, -48, 20, 28, 6); c.fill();
  c.fillStyle = '#f2c7a0'; circ(c, 0, -56, 9); c.fill();
  c.fillStyle = '#4a6a3a'; c.beginPath(); c.arc(0, -58, 10, Math.PI, 0); c.fill(); c.fillRect(0, -60, 14, 3);
  c.fillStyle = '#6a4024'; c.fillRect(-2, -52, 10, 2);
  c.strokeStyle = '#f2c7a0'; c.lineWidth = 4; line(c, 6, -42, 14, -50);
  c.lineCap = 'butt';
  c.fillStyle = '#e8e8e8'; c.beginPath(); c.moveTo(10, -54); c.lineTo(28, -62 - (g.shout > 0 ? 3 : 0)); c.lineTo(28, -44 + (g.shout > 0 ? 3 : 0)); c.lineTo(10, -50); c.closePath(); c.fill();
  c.strokeStyle = '#ff5a4e'; c.lineWidth = 2; line(c, 28, -62 - (g.shout > 0 ? 3 : 0), 28, -44 + (g.shout > 0 ? 3 : 0));
  c.restore();
  if (g.conf > 0) { c.fillStyle = '#fff6fb'; c.font = 'bold 20px ' + CF; c.textAlign = 'center'; c.fillText('?', x, GY - 80); }
}
function drawProj(c, p) {
  c.save(); c.translate(p.x, p.y);
  if (p.kind === 'word') {
    c.font = 'bold 14px ' + CF; c.textAlign = 'center'; c.textBaseline = 'middle';
    var w = c.measureText(p.txt).width + 14;
    c.fillStyle = '#fff8ee'; rr(c, -w / 2, -11, w, 22, 8); c.fill(); c.strokeStyle = INK; c.lineWidth = 1.5; c.stroke();
    c.fillStyle = INK; c.fillText(p.txt, 0, 1);
  } else if (p.kind === 'cork') {
    c.rotate(p.rot); c.fillStyle = '#c98a4a'; rr(c, -6, -4, 12, 8, 2); c.fill(); c.fillStyle = '#a8703a'; c.fillRect(-6, -1, 12, 2);
  } else {
    c.rotate(Math.atan2(p.vy, p.vx)); c.fillStyle = '#ff9a3c'; rr(c, -10, -3, 16, 6, 3); c.fill(); c.fillStyle = '#ff5a4e'; ell(c, 7, 0, 3, 4); c.fill();
  }
  c.restore();
}
function drawTable(c, tb) {
  c.save(); c.translate(tb.x, GY);
  c.strokeStyle = '#6a4a2a'; c.lineWidth = 4; line(c, -30, -26, -34, 0); line(c, 30, -26, 34, 0);
  c.fillStyle = '#fff8ee'; c.fillRect(-38, -32, 76, 8); c.fillStyle = '#ff5a4e'; for (var i = 0; i < 6; i++) c.fillRect(-38 + i * 13, -24, 7, 8);
  for (i = 0; i < tb.food; i++) snackIcon(c, -20 + i * 20, -40, 8);
  c.fillStyle = '#1a0d1c'; c.font = 'bold 11px ' + CF; c.textAlign = 'center'; c.fillText('CATERING', 0, -52);
  c.fillStyle = '#c0c0c0'; rr(c, 22, -48, 12, 16, 3); c.fill();
  c.restore();
}
function drawTrain(c, tr) {
  c.save(); c.translate(tr.x, GY); c.scale(tr.dir, 1);
  c.fillStyle = '#2a2420'; rr(c, -40, -40, 56, 28, 4); c.fill(); c.fillRect(-6, -62, 12, 24); c.fillStyle = '#a8323e'; c.fillRect(-40, -40, 56, 5);
  c.fillStyle = '#4a3f36'; c.fillRect(-60, -52, 22, 40); c.fillStyle = '#ffd98a'; c.fillRect(-56, -48, 14, 10);
  c.fillStyle = '#1a1612'; for (var i = 0; i < 3; i++) { circ(c, -50 + i * 26, -8, 9); c.fill(); }
  c.fillStyle = GOLD; for (i = 0; i < 3; i++) { circ(c, -50 + i * 26, -8, 3); c.fill(); }
  c.fillStyle = '#7a4e2c'; rr(c, -110, -34, 46, 22, 3); c.fill(); c.fillStyle = '#1a1612'; circ(c, -100, -8, 7); c.fill(); circ(c, -74, -8, 7); c.fill();
  c.restore();
}
function drawBoulder(c, B) {
  c.save(); c.translate(B.x, B.y); c.rotate(B.rot);
  c.fillStyle = '#9a8a74'; circ(c, 0, 0, B.r); c.fill();
  c.fillStyle = '#7a6a56'; circ(c, -8, -6, 6); c.fill(); circ(c, 10, 8, 5); c.fill(); circ(c, 6, -12, 3); c.fill();
  c.fillStyle = '#fff8ee'; c.font = 'bold 8px Arial'; c.textAlign = 'center'; c.fillText('FOAM', 0, 3);
  c.restore();
}

/* ==========================================================
   MUSIC: a cheesy B movie theme, a quiet theremin and a bass
   ========================================================== */
var MUS = {
  stone: { root: 43, sc: [0, 3, 5, 7, 10], bass: 'triangle', lead: 'sine' },
  egypt: { root: 45, sc: [0, 1, 4, 5, 7, 8, 10], bass: 'triangle', lead: 'sine' },
  rome: { root: 43, sc: [0, 2, 4, 5, 7, 9, 11], bass: 'triangle', lead: 'triangle' },
  viking: { root: 40, sc: [0, 2, 3, 5, 7, 8, 10], bass: 'sawtooth', lead: 'sine' },
  victorian: { root: 45, sc: [0, 2, 3, 5, 7, 8, 11], bass: 'triangle', lead: 'triangle' },
  eighties: { root: 45, sc: [0, 3, 5, 7, 10], bass: 'square', lead: 'square' },
  future: { root: 47, sc: [0, 2, 4, 7, 9], bass: 'sine', lead: 'sine' }
};
var mus = { t0: 0, step: 0, on: false };
function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
function bpmNow() { return G ? (G.mode === 'musical' ? 116 : 104) * (G.slow < 1 ? 0.8 : 1) : 104; }
function musicStart() {
  if (!AC || !G) return;
  mus.on = true; mus.t0 = AC.currentTime - G.real;
  var spb = 30 / bpmNow();
  mus.step = Math.ceil((AC.currentTime + 0.05 - mus.t0) / spb);
}
function musicStop() { mus.on = false; }
function theremin(f, t, dur, vol) {
  try {
    var o = AC.createOscillator(), l = AC.createOscillator(), lg = AC.createGain(), g = AC.createGain();
    o.type = (MUS[G.era.id] || MUS.stone).lead; o.frequency.setValueAtTime(f, t);
    l.frequency.value = 5.5; lg.gain.value = f * 0.012; l.connect(lg); lg.connect(o.frequency);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.12); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); l.start(t); o.stop(t + dur + 0.05); l.stop(t + dur + 0.05);
  } catch (e) {}
}
function musicPump() {
  if (!mus.on || !canPlay() || !G) return;
  var spb = 30 / bpmNow(), S = MUS[G.era.id] || MUS.stone, mz = G.mode === 'musical';
  var bassPat = [0, 0, 4, 3, 0, 0, 2, 1];
  while (mus.t0 + mus.step * spb < AC.currentTime + 0.18) {
    var t = mus.t0 + mus.step * spb, n = mus.step;
    if (t >= AC.currentTime - 0.01) {
      var bar = Math.floor(n / 8) % 4;
      if (n % 2 === 0) {
        var deg = bassPat[(n / 2) % 8] % S.sc.length, note = S.root + S.sc[deg] + (bar === 3 ? 5 : 0) - 12;
        bassNote(mtof(note), t, spb * 1.6, S.bass === 'sawtooth' || S.bass === 'square' ? 0.03 : 0.06, S.bass);
      }
      if (mz) { if (n % 2 === 1) hatAt(t); if (n % 4 === 2) clapAt(t); if (n % 4 === 0) kickAt(t); }
      else if (n % 8 === 0) kickAt(t);
      if (n % 8 === 0 || (n % 8 === 5 && bar % 2)) {
        var d2 = (n * 7 + bar * 3) % S.sc.length, mel = S.root + 12 + S.sc[d2] + (mz ? 12 : 0);
        theremin(mtof(mel), t, spb * (n % 8 === 0 ? 3.2 : 1.6), mz ? 0.03 : 0.035);
      }
    }
    mus.step++;
  }
}
function bassNote(f, t, d, v, type) {
  try { var o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + d + 0.03); } catch (e) {}
}
function kickAt(t) { try { var o = AC.createOscillator(), g = AC.createGain(); o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
  g.gain.setValueAtTime(0.09, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16); o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.18); } catch (e) {} }
function hatAt(t) { try { var s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = 7000;
  g.gain.setValueAtTime(0.025, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04); s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random() * 0.5); s.stop(t + 0.05); } catch (e) {} }
function clapAt(t) { try { var s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = noiseBuf; f.type = 'bandpass'; f.frequency.value = 1500;
  g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1); s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random() * 0.5); s.stop(t + 0.12); } catch (e) {} }

/* ==========================================================
   RENDER
   ========================================================== */
function render() {
  if (!ctx || !G) return;
  var c = ctx, d = V.dpr, k = V.k, W = V.W, H = V.H;
  c.setTransform(d, 0, 0, d, 0, 0);
  c.fillStyle = '#12060f'; c.fillRect(0, 0, W, H);
  var sy0 = V.oy + TOPY * k, sy1 = V.oy + (GY + 60) * k;
  /* the rig above, the stage floor below (when the screen is taller than the set) */
  if (sy0 > 0) {
    c.fillStyle = '#1a0d1c'; c.fillRect(0, 0, W, sy0);
    c.fillStyle = '#3a2a30'; c.fillRect(0, sy0 - 10, W, 6);
    for (var li = 0; li < W; li += 90) { c.fillStyle = '#2a1a24'; c.fillRect(li + 30, sy0 - 26, 18, 18); c.fillStyle = 'rgba(255,214,120,.65)'; circ(c, li + 39, sy0 - 12, 5); c.fill(); }
  }
  if (sy1 < H) {
    c.fillStyle = '#2a1a14'; c.fillRect(0, sy1, W, H - sy1);
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 2;
    for (var fy = sy1 + 18; fy < H; fy += 26) line(c, 0, fy, W, fy);
  }
  var sh = G.shake > 0 && !RM ? G.shake * 10 : 0, sx = sh ? rnd(-sh, sh) : 0, syy = sh ? rnd(-sh, sh) : 0;
  c.save();
  c.beginPath(); c.rect(0, Math.max(0, sy0), W, Math.min(H, sy1) - Math.max(0, sy0)); c.clip();
  /* the painted backdrop, with a little parallax */
  if (cloth) {
    c.setTransform(d * k, 0, 0, d * k, d * (-(V.cam - cloth.lo) * cloth.par * k + sx), d * (V.oy + syy));
    c.drawImage(cloth, 0, TOPY, cloth.width / cloth.sc, cloth.height / cloth.sc);
  }
  c.setTransform(d * k, 0, 0, d * k, d * (-V.cam * k + sx), d * (V.oy + syy));
  drawWorld(c);
  c.setTransform(d, 0, 0, d, 0, 0);
  /* director modes and the week's film stock */
  if (G.mode === 'bw' || G.era.id === 'victorian') {
    c.globalCompositeOperation = G.mode === 'bw' ? 'saturation' : 'color';
    c.fillStyle = G.mode === 'bw' ? '#808080' : '#a0805a'; c.globalAlpha = G.mode === 'bw' ? 1 : 0.6;
    c.fillRect(0, sy0, W, sy1 - sy0);
    c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    /* a few film scratches (they move slowly, no flicker) */
    c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 1;
    var sxx = (G.real * 23) % W; line(c, sxx, sy0, sxx + 6, sy1); line(c, (sxx * 2.3 + 140) % W, sy0, (sxx * 2.3 + 136) % W, sy1);
  }
  if (G.slowmo > 0 || G.slow < 1) {
    c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(0, sy0, W, 14 * (G.slowmo > 0 ? 2 : 1)); c.fillRect(0, sy1 - 14 * (G.slowmo > 0 ? 2 : 1), W, 14 * (G.slowmo > 0 ? 2 : 1));
  }
  /* soft vignette */
  c.restore();
  drawHud(c);
  if (state === 'intro') drawClapper(c);
  if (state === 'ending') drawEnding(c);
}

function drawWorld(c) {
  var i, m = G.m, set = G.set, id = G.era.id, E = G.E;
  var x0 = V.cam - 60, x1 = V.cam + V.viewW + 60;
  /* the street (or the pier boards, or the space deck) */
  c.fillStyle = set.sea ? '#8a6a48' : set.stars ? '#3a4660' : E.floor; c.fillRect(-80, GY, G.W + 160, 60);
  c.fillStyle = set.sea ? '#6a4e34' : set.stars ? '#2a3448' : E.floor2;
  if (set.sea) for (i = -80; i < G.W + 80; i += 22) c.fillRect(i, GY, 3, 60);
  else c.fillRect(-80, GY, G.W + 160, 6);
  c.fillStyle = 'rgba(255,255,255,.35)';
  for (i = 40; i < G.W; i += 160) { c.fillRect(i, GY + 26, 10, 3); c.fillRect(i + 3.5, GY + 22.5, 3, 10); }
  /* the crew's camera dolly track at the front */
  c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(-80, GY + 44, G.W + 160, 4);
  /* buildings, behind everything */
  for (i = 0; i < G.blds.length; i++) { var b = G.blds[i]; if (b.x + b.w + 60 > x0 && b.x - 20 < x1) drawBld(c, b); }
  if (set.gulls) {
    for (i = 0; i < 3; i++) { var gx = 300 + i * 260, gy = 160 + Math.sin(G.real * 1.5 + i) * 14; c.strokeStyle = '#fff8ee'; c.lineWidth = 3; c.beginPath(); c.moveTo(gx - 12, gy); c.quadraticCurveTo(gx - 6, gy - 8, gx, gy); c.quadraticCurveTo(gx + 6, gy - 8, gx + 12, gy); c.stroke(); }
  }
  if (G.table) drawTable(c, G.table);
  for (i = 0; i < G.boulders.length; i++) drawBoulder(c, G.boulders[i]);
  for (i = 0; i < G.runners.length; i++) {
    var r = G.runners[i]; if (r.x < x0 || r.x > x1) continue;
    if (r.kind === 'mat') { c.fillStyle = '#2ed3c6'; rr(c, r.x - 30, GY - 10, 60, 10, 4); c.fill(); c.fillStyle = '#fff8ee'; c.font = 'bold 7px Arial'; c.textAlign = 'center'; c.fillText('CRASH MAT', r.x, GY - 3); }
    else if (r.kind === 'jay') { c.strokeStyle = INK; c.lineWidth = 1.5; line(c, r.x, r.y - 40, r.x, r.y - 70); c.fillStyle = '#2ed3c6'; c.beginPath(); c.arc(r.x, r.y - 70, 26, Math.PI, 0); c.fill(); drawJay(c, r.x, r.y, 1, Math.sin(r.t * 6) * 0.5);
      if (r.t < 2.5) { c.fillStyle = '#fff8ee'; c.font = 'bold 13px ' + CF; c.textAlign = 'center'; c.fillText('Unhand me, goblin!', r.x, r.y - 104); } }
    else if (r.kind === 'bonnie') drawBonnie(c, r.x, GY, r.dir, r.sit, r.t);
    else if (r.kind === 'box') drawBox(c, r);
    else if (r.kind === 'meg') drawPerson(c, { kind: 'extra', v: 1, sp: 1, t: r.t, dir: r.dir, scared: true }, r.x, GY);
    else if (r.kind === 'halfF' || r.kind === 'halfB') {
      c.save(); c.translate(r.x, GY); c.scale(r.dir, 1); c.fillStyle = '#c98a4a'; rr(c, -18, -46, 36, 26, 10); c.fill();
      if (r.kind === 'halfF') { rr(c, 10, -66, 16, 24, 5); c.fill(); c.fillStyle = INK; circ(c, 20, -60, 2); c.fill(); }
      c.strokeStyle = '#3a3a5a'; c.lineWidth = 6; var lg = Math.sin(r.t * 14) * 5; line(c, -8, -20, -8 + lg, 0); line(c, 8, -20, 8 - lg, 0);
      c.fillStyle = '#f2c7a0'; circ(c, 0, -52, 7); c.fill(); c.restore();
    }
    else if (r.kind === 'sign') {
      drawPerson(c, { kind: 'extra', v: 3, sp: 1, t: r.t, dir: r.dir, scared: false, hat: false }, r.x, GY);
      c.fillStyle = '#fff8ee'; c.fillRect(r.x - 22, GY - 92, 44, 22); c.strokeStyle = INK; c.lineWidth = 1.5; c.strokeRect(r.x - 22, GY - 92, 44, 22);
      c.fillStyle = INK; c.font = 'bold 9px ' + CF; c.textAlign = 'center'; c.fillText(r.got ? 'THANK YOU' : 'AUTOGRAPH?', r.x, GY - 78);
      c.strokeStyle = '#6a4a2a'; c.lineWidth = 2; line(c, r.x, GY - 70, r.x, GY - 46);
    }
    else drawPerson(c, r, r.x, r.y);
  }
  for (i = 0; i < G.tanks.length; i++) if (G.tanks[i].lift < 50) drawTank(c, G.tanks[i]);
  for (i = 0; i < G.megs.length; i++) drawMeg(c, G.megs[i]);
  if (G.train) drawTrain(c, G.train);
  /* the monster */
  var pa = m.pAnim > 0 ? clamp(m.pAnim / 0.2, 0, 1) : 0;
  var o = MO; o.walk = m.walk; o.punch = pa > 0 ? Math.sin(pa * Math.PI) : 0; o.pdown = m.st === 'stand' && m.on >= 0;
  o.face = m.face; o.st = m.st; o.hat = G.hat; o.suit = G.suit; o.era = id; o.t = G.real; o.hurt = m.hurt; o.neck = m.neck; o.flop = m.flop; o.beam = m.beam;
  o.squash = m.squash > 0 ? m.squash * 0.5 : 0; o.xmas = G.xmas; o.thumb = false; o.sil = false;
  o.dance = G.mode === 'musical' && !RM ? Math.abs(Math.sin(G.beat * Math.PI)) * 3 : 0;
  if (m.st === 'wall') { c.fillStyle = 'rgba(0,0,0,.18)'; ell(c, m.x, m.y - mH() * 0.4, mW() * 0.5, mH() * 0.45); c.fill(); }
  else if (m.st !== 'air' && m.st !== 'fly') { c.fillStyle = 'rgba(0,0,0,.22)'; ell(c, m.x, m.y, mW() * 0.55, 6); c.fill(); }
  if (m.hurt > 0.25 && !RM) c.globalAlpha = 0.75;
  drawMonster(c, G.mk, m.x, m.y, G.s, o);
  c.globalAlpha = 1;
  if (m.beam > 0) {
    var ey = m.y - mH() * 0.88;
    var gr = c.createLinearGradient(m.x, ey, m.x + m.face * 300, ey);
    gr.addColorStop(0, 'rgba(255,246,160,.75)'); gr.addColorStop(1, 'rgba(255,246,160,0)');
    c.fillStyle = gr; c.beginPath(); c.moveTo(m.x + m.face * 12, ey - 4); c.lineTo(m.x + m.face * 300, ey - 50); c.lineTo(m.x + m.face * 300, ey + 50); c.lineTo(m.x + m.face * 12, ey + 4); c.fill();
  }
  if (G.bird) {
    var hy = m.y - mH() - 4 * G.s, bx = m.x + 4;
    c.fillStyle = '#5a9ad6'; ell(c, bx, hy - 6, 7, 5); c.fill(); circ(c, bx + 5, hy - 10, 4); c.fill();
    c.fillStyle = GOLD; c.beginPath(); c.moveTo(bx + 8, hy - 11); c.lineTo(bx + 13, hy - 10); c.lineTo(bx + 8, hy - 8); c.fill();
    c.fillStyle = INK; circ(c, bx + 6, hy - 11, 1); c.fill();
    c.strokeStyle = '#3a6a9a'; c.lineWidth = 2; line(c, bx - 6, hy - 6, bx - 12, hy - 3);
  }
  if (m.stun > 0 && !RM) { for (i = 0; i < 3; i++) { var a = G.real * 6 + i * 2.1; c.fillStyle = GOLD; circ(c, m.x + Math.cos(a) * 20 * G.s, m.y - mH() - 8 + Math.sin(a) * 5, 3); c.fill(); } }
  for (i = 0; i < G.helis.length; i++) drawHeli(c, G.helis[i]);
  for (i = 0; i < G.proj.length; i++) drawProj(c, G.proj[i]);
  if (G.decoy) { c.font = 'bold 18px ' + CF; c.textAlign = 'center'; var dw = c.measureText('OVER HERE!').width + 20; c.fillStyle = '#fff8ee'; rr(c, G.decoy.x - dw / 2, G.decoy.y - 16, dw, 30, 12); c.fill(); c.strokeStyle = INK; c.lineWidth = 2; c.stroke(); c.fillStyle = INK; c.fillText('OVER HERE!', G.decoy.x, G.decoy.y + 6); }
  drawParts(c);
  /* the wings at each end */
  drawWings(c);
  /* floating words */
  c.textAlign = 'center'; c.textBaseline = 'middle';
  for (i = 0; i < TMAX; i++) {
    var t = TX[i]; if (!t.on) continue;
    var al = t.life < 0.1 ? t.life / 0.1 : 1 - Math.max(0, (t.life - t.max * 0.6) / (t.max * 0.4));
    var sz = t.size * (t.big && !RM ? 1 + Math.max(0, 0.3 - t.life) : 1);
    c.globalAlpha = clamp(al, 0, 1);
    c.font = sz + 'px ' + CF;
    var tw2 = c.measureText(t.txt).width / 2 + 8, tx2 = clamp(t.x, V.cam + tw2, V.cam + V.viewW - tw2);
    if (tw2 * 2 > V.viewW) tx2 = V.cam + V.viewW / 2;
    t.x = tx2;
    c.lineWidth = 4; c.strokeStyle = 'rgba(26,13,28,.85)'; c.lineJoin = 'round';
    c.strokeText(t.txt, t.x, t.y); c.fillStyle = t.col; c.fillText(t.txt, t.x, t.y);
  }
  c.globalAlpha = 1; c.textBaseline = 'alphabetic';
  /* a goal marker for tap to move */
  if (goal.on && state === 'play') {
    var gx2 = goal.ent ? goal.ent.x : goal.x, gy2 = goal.ent ? goal.ent.y - (goal.ent.h || 20) * 0.5 : goal.y;
    c.strokeStyle = 'rgba(255,197,61,.85)'; c.lineWidth = 3; circ(c, gx2, gy2, 14 + Math.sin(G.real * 8) * (RM ? 0 : 2)); c.stroke();
  }
}
var MO = {};

function drawParts(c) {
  for (var i = 0; i < PMAX; i++) {
    var p = P[i]; if (!p.on) continue;
    var a = 1 - p.life / p.max;
    c.globalAlpha = a;
    if (p.kind === PK.dust || p.kind === PK.smoke) { c.fillStyle = p.col; circ(c, p.x, p.y, p.r * (1 + (1 - a) * 1.5)); c.fill(); }
    else if (p.kind === PK.ring) { c.strokeStyle = p.col; c.lineWidth = 4 * a; circ(c, p.x, p.y, p.r + (1 - a) * 120); c.stroke(); }
    else if (p.kind === PK.star) { c.fillStyle = p.col; c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.beginPath(); c.moveTo(0, -p.r); c.bezierCurveTo(p.r, -p.r * 1.6, p.r * 1.6, 0, 0, p.r); c.bezierCurveTo(-p.r * 1.6, 0, -p.r, -p.r * 1.6, 0, -p.r); c.fill(); c.restore(); }
    else { c.fillStyle = p.col; c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r); c.restore(); }
  }
  c.globalAlpha = 1;
}

/* ---------- the HUD: reel, gusto, box office, the director ---------- */
var DIR = { x: 0, y: 0, r: 0 };
function drawHud(c) {
  var W = V.W, top = Math.max(0, V.oy + TOPY * V.k) + 8, m = G.m, i;
  var small = W < 520;
  /* the film reel (time left) */
  var rx = 12, ry = top;
  c.fillStyle = 'rgba(26,13,28,.82)'; rr(c, rx, ry, small ? 92 : 112, 40, 12); c.fill();
  c.save(); c.translate(rx + 20, ry + 20); c.rotate(RM ? 0 : G.real * 1.2);
  c.fillStyle = '#c9c0d0'; circ(c, 0, 0, 14); c.fill(); c.fillStyle = '#1a0d1c';
  for (i = 0; i < 5; i++) { var a = i * TAU / 5; circ(c, Math.cos(a) * 7.5, Math.sin(a) * 7.5, 3.4); c.fill(); }
  c.restore();
  c.fillStyle = G.reelLeft <= 30 ? GOLD : '#fff6fb'; c.font = (small ? 22 : 26) + 'px ' + CF; c.textAlign = 'left'; c.textBaseline = 'middle';
  c.fillText(mmss(G.reelLeft), rx + 40, ry + 22);
  /* gusto */
  var gw = small ? Math.min(150, W - 92 - 24 - 108 - 16) : 220, gx = small ? rx + 100 : W / 2 - gw / 2, gy = ry;
  c.fillStyle = 'rgba(26,13,28,.82)'; rr(c, gx, gy, gw, 40, 12); c.fill();
  c.fillStyle = '#fff6fb'; c.font = '13px ' + CF; c.textAlign = 'left'; c.fillText('GUSTO', gx + 10, gy + 13);
  var bw2 = gw - 20, fill = clamp(G.gusto / 100, 0, 1);
  c.fillStyle = 'rgba(255,255,255,.15)'; rr(c, gx + 10, gy + 22, bw2, 10, 5); c.fill();
  c.fillStyle = fill > 0.3 ? TEAL : '#ffb347'; rr(c, gx + 10, gy + 22, Math.max(6, bw2 * fill), 10, 5); c.fill();
  /* the size of the monster */
  if (!small) { c.fillStyle = GOLD; c.font = '13px ' + CF; c.textAlign = 'right'; c.fillText('SIZE ' + Math.round(G.s * 100) + '%', gx + gw - 10, gy + 13); }
  /* box office */
  c.font = (small ? 22 : 26) + 'px ' + CF;
  var mt = money(G.money), mw = Math.max(small ? 92 : 120, c.measureText(mt).width + 24);
  c.fillStyle = 'rgba(26,13,28,.82)'; rr(c, W - 12 - mw, ry, mw, 40, 12); c.fill();
  c.fillStyle = '#fff6fb'; c.font = '11px ' + CF; c.textAlign = 'right'; c.fillText('BOX OFFICE', W - 24, ry + 11);
  c.fillStyle = GOLD; c.font = (small ? 20 : 24) + 'px ' + CF; c.fillText(mt, W - 24, ry + 28);
  /* the director in his chair, with what he is shouting */
  var ds = small ? 0.8 : 1, dx = 14, dy = ry + 50;
  DIR.x = dx + 26 * ds; DIR.y = dy + 30 * ds; DIR.r = 34 * ds;
  drawDirector(c, dx, dy, ds, G.dirJay, G.say && G.say.t < 0.4 ? 1 : 0);
  if (G.say) {
    var s = G.say, al = s.t < 0.15 ? s.t / 0.15 : s.t > 2.2 ? Math.max(0, (2.6 - s.t) / 0.4) : 1;
    c.globalAlpha = al;
    var fs = small ? 20 : 24; c.font = fs + 'px ' + CF;
    var tw = c.measureText(s.txt).width, bx = dx + 60 * ds, by = dy + 8 * ds, bwid = Math.min(tw + 26, W - bx - 12);
    var pop = RM ? 1 : 1 + Math.max(0, 0.15 - s.t) * 1.5;
    c.save(); c.translate(bx, by + 18); c.scale(pop, pop);
    c.fillStyle = '#fff8ee'; rr(c, 0, -18, bwid, 36, 14); c.fill(); c.strokeStyle = INK; c.lineWidth = 2.5; c.stroke();
    c.beginPath(); c.moveTo(4, 4); c.lineTo(-10, 12); c.lineTo(10, 10); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#fff8ee'; c.fillRect(4, 2, 8, 6);
    c.fillStyle = INK; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(s.txt, 13, 2, bwid - 24);
    c.restore(); c.globalAlpha = 1;
  }
  /* the special, ready or charging (keyboard players) */
  if (!ui.padOn) {
    var sp = clamp(1 - m.spCd / G.M.cd, 0, 1), sxp = W - 12 - 150, syp = ry + 48;
    c.fillStyle = 'rgba(26,13,28,.82)'; rr(c, sxp, syp, 150, 30, 10); c.fill();
    c.fillStyle = sp >= 1 ? TEAL : 'rgba(255,255,255,.2)'; rr(c, sxp + 6, syp + 6, 138 * sp, 18, 7); c.fill();
    c.fillStyle = sp >= 1 ? INK : '#fff6fb'; c.font = '15px ' + CF; c.textAlign = 'center'; c.fillText(G.M.sname.toUpperCase() + (sp >= 1 ? '  (X)' : ''), sxp + 75, syp + 16);
  }
  /* a first hint */
  if (G.hint > 0 && state === 'play') {
    var ht = ui.padOn ? 'Climb the flats and punch them flat' : 'Arrows climb. Space punches. X is your special.';
    if (G.M.fly) ht = ui.padOn ? 'Fly about and punch the flats flat' : 'Arrows fly. Space punches. X is your special.';
    if (G.M.stretch) ht = ui.padOn ? 'Up stretches you tall. Punch the flats flat' : 'Up and down stretch. Space punches. X special.';
    c.font = (small ? 15 : 17) + 'px ' + BODYF;
    var hw = c.measureText(ht).width + 26, hy2 = Math.min(V.H, V.oy + (GY + 60) * V.k) - 46;
    c.globalAlpha = Math.min(1, G.hint);
    c.fillStyle = 'rgba(26,13,28,.88)'; rr(c, W / 2 - hw / 2, hy2, hw, 34, 12); c.fill();
    c.fillStyle = '#fff6fb'; c.textAlign = 'center'; c.fillText(ht, W / 2, hy2 + 18);
    c.globalAlpha = 1;
  }
  c.textBaseline = 'alphabetic';
}
var BODYF = '"Atkinson Hyperlegible",Verdana,sans-serif';
function drawDirector(c, x, y, s, jay, shout) {
  c.save(); c.translate(x, y); c.scale(s, s);
  /* the chair */
  c.strokeStyle = '#6a4a2a'; c.lineWidth = 3; line(c, 6, 46, 46, 66); line(c, 46, 46, 6, 66); line(c, 8, 14, 8, 46); line(c, 44, 14, 44, 46);
  c.fillStyle = '#5a1650'; c.fillRect(6, 16, 40, 10);
  /* him */
  c.fillStyle = '#2a2a3a'; rr(c, 14, 20, 24, 20, 6); c.fill();
  c.fillStyle = '#ffc53d'; c.fillRect(20, 22, 12, 4);
  c.fillStyle = '#5a1650'; c.fillRect(2, 38, 48, 10);
  c.fillStyle = GOLD; c.font = '9px ' + CF; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('DIRECTOR', 26, 43.5);
  c.fillStyle = '#f2c7a0'; circ(c, 26, 12, 9); c.fill();
  if (jay) {
    c.fillStyle = '#6a4024'; c.beginPath(); c.moveTo(16, 10); c.lineTo(18, 0); c.lineTo(22, 4); c.lineTo(25, -3); c.lineTo(28, 3); c.lineTo(32, -2); c.lineTo(34, 4); c.lineTo(37, 2); c.lineTo(35, 10); c.lineTo(30, 6); c.lineTo(22, 6); c.closePath(); c.fill();
    c.fillStyle = '#3a2410'; c.fillRect(19, 7, 6, 2.4); c.fillRect(28, 7, 6, 2.4);
    c.fillStyle = INK; circ(c, 22, 12, 1.4); c.fill(); circ(c, 30, 12, 1.4); c.fill();
  } else {
    c.fillStyle = '#1a0d1c'; c.fillRect(19, 10, 6, 3); c.fillRect(27, 10, 6, 3); c.fillRect(24, 10.5, 4, 1.4);
    c.fillStyle = '#c0304a'; ell(c, 26, 4, 11, 4.5, -0.15); c.fill(); c.fillRect(25, -2, 2, 3);
  }
  c.strokeStyle = INK; c.lineWidth = 1.4; c.beginPath(); if (shout) ell(c, 26, 17, 2.5, 2.2); else c.arc(26, 15.5, 3, 0.2, Math.PI - 0.2); c.stroke();
  /* the megaphone */
  c.save(); c.translate(36, 16); c.rotate(shout ? -0.35 : -0.1);
  c.fillStyle = '#e8e8e8'; c.beginPath(); c.moveTo(0, -3); c.lineTo(16, -8); c.lineTo(16, 8); c.lineTo(0, 3); c.closePath(); c.fill();
  c.restore();
  c.restore();
}

/* the clapperboard at the start of each take */
function drawClapper(c) {
  var t = G.intro, W = V.W, H = V.H, k = Math.min(1.3, W / 420);
  var cx = W / 2, cy = Math.min(H, V.oy + (GY + 60) * V.k) * 0.45 + Math.max(0, V.oy + TOPY * V.k) * 0.5;
  var slide = RM ? 0 : Math.max(0, 0.35 - t) * 600;
  var close = t < 0.75 ? -0.55 : t < 0.88 ? -0.55 * (1 - (t - 0.75) / 0.13) : 0;
  var out = t > 1.3 ? (t - 1.3) / 0.3 : 0;
  c.save(); c.translate(cx, cy + slide - (RM ? 0 : out * 300)); c.scale(k, k);
  c.globalAlpha = 1 - Math.min(1, out);
  c.fillStyle = '#1a0d1c'; rr(c, -130, -30, 260, 120, 8); c.fill();
  c.strokeStyle = '#fff8ee'; c.lineWidth = 2; line(c, -120, 20, 120, 20); line(c, -120, 52, 120, 52); line(c, 0, 20, 0, 84);
  c.fillStyle = '#fff8ee'; c.textAlign = 'left'; c.textBaseline = 'middle';
  c.font = '15px ' + CF; c.fillText('PROD.', -118, -12); c.fillText('SCENE', -118, 36); c.fillText('TAKE', 6, 36); c.fillText('DIRECTOR', -118, 68); c.fillText('ROLL', 6, 68);
  c.font = '22px ' + CF;
  c.fillText(MON[G.mk].name.toUpperCase(), -70, -10, 190);
  c.fillText(G.set.name.toUpperCase().slice(0, 9), -70, 37, 66);
  c.fillText(String(G.take), 46, 37);
  c.fillText('MR BERET', -48, 69, 46);
  c.fillText(String(G.era.n), 46, 69);
  c.save(); c.translate(-130, -30); c.rotate(close);
  c.fillStyle = '#fff8ee'; c.fillRect(0, -22, 260, 22);
  c.fillStyle = '#1a0d1c'; for (var i = 0; i < 7; i++) { c.beginPath(); c.moveTo(10 + i * 38, -22); c.lineTo(32 + i * 38, -22); c.lineTo(20 + i * 38, 0); c.lineTo(-2 + i * 38, 0); c.closePath(); c.fill(); }
  c.restore();
  c.restore(); c.globalAlpha = 1;
}
function drawEnding(c) {
  var t = G.endShow, W = V.W, top = Math.max(0, V.oy + TOPY * V.k), bot = Math.min(V.H, V.oy + (GY + 60) * V.k);
  var a = Math.min(1, t / 0.5);
  c.fillStyle = 'rgba(18,6,15,' + (0.35 * a) + ')'; c.fillRect(0, top, W, bot - top);
  var word = G.endKind === 'cut' ? 'CUT!' : "THAT'S A WRAP!";
  var fs = Math.min(84, W / (word.length * 0.42 + 1));
  c.font = fs + 'px ' + CF; c.textAlign = 'center'; c.textBaseline = 'middle';
  var sc = RM ? 1 : 0.6 + Math.min(1, t / 0.3) * 0.4;
  c.save(); c.translate(W / 2, (top + bot) / 2); c.scale(sc, sc); c.rotate(-0.05);
  c.globalAlpha = a; c.lineWidth = 8; c.strokeStyle = INK; c.lineJoin = 'round'; c.strokeText(word, 0, 0); c.fillStyle = GOLD; c.fillText(word, 0, 0);
  c.restore(); c.globalAlpha = 1; c.textBaseline = 'alphabetic';
}

/* ==========================================================
   LITTLE PICTURES for the cards (drawn in code)
   ========================================================== */
function mini(size, fn) {
  var cv = document.createElement('canvas'), d = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(size * d); cv.height = Math.round(size * d);
  cv.style.width = size + 'px'; cv.style.height = size + 'px';
  cv.setAttribute('aria-hidden', 'true');
  var c = cv.getContext('2d'); c.setTransform(d * size / 100, 0, 0, d * size / 100, 0, 0);
  try { fn(c); } catch (e) {}
  return cv;
}
function silhouette(cv) {
  var c = cv.getContext('2d'); c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalCompositeOperation = 'source-atop'; c.fillStyle = '#4a3448'; c.fillRect(0, 0, cv.width, cv.height); c.restore();
}
function thumbOpts(extra) {
  var o = { walk: 0, punch: 0, face: 1, st: 'stand', hat: 'none', suit: 'normal', era: '', t: 1, hurt: 0, neck: 30, flop: 0, beam: 0, squash: 0, thumb: true, sil: false, xmas: false };
  for (var k in extra) o[k] = extra[k];
  return o;
}
function drawThumb(c, type, key) {
  if (type === 'monster') {
    c.fillStyle = '#f3e6ee'; circ(c, 50, 54, 44); c.fill();
    var s = key === 'robot' ? 0.95 : key === 'sock' ? 1.0 : key === 'blob' ? 1.15 : key === 'moth' ? 1.2 : 1.0;
    drawMonster(c, key, key === 'moth' ? 46 : 44, key === 'moth' ? 82 : 92, s, thumbOpts({ neck: key === 'sock' ? 26 : 0 }));
  } else if (type === 'set') {
    var skies = { city: ['#f2a65a', '#ffd9a0'], pier: ['#7ac4e8', '#e0f4ff'], school: ['#9ad08a', '#e8f6d8'], space: ['#06142b', '#2a4f8f'] }[key];
    var g = c.createLinearGradient(0, 0, 0, 100); g.addColorStop(0, skies[0]); g.addColorStop(1, skies[1]);
    c.fillStyle = g; rr(c, 4, 4, 92, 92, 14); c.fill();
    var b = SETS[key].b, x = 10, tot = 0, i;
    for (i = 0; i < b.length; i++) tot += b[i][0] + 40;
    var k = 84 / tot;
    c.fillStyle = key === 'space' ? '#c9d6e8' : '#8a5a46';
    for (i = 0; i < b.length; i++) {
      var w = b[i][0] * k, h = b[i][1] * k * 0.6, kind = b[i][2];
      c.fillStyle = ['#8b5bd6', '#2ed3c6', '#ff5a4e', '#ffc53d', '#c99bff'][i % 5];
      c.fillRect(x, 86 - h, w, h);
      if (kind === 'cone' || kind === 'tower') { c.beginPath(); c.moveTo(x - 2, 86 - h); c.lineTo(x + w / 2, 86 - h - 12); c.lineTo(x + w + 2, 86 - h); c.fill(); }
      if (kind === 'dome') { c.beginPath(); c.arc(x + w / 2, 86 - h, w / 2, Math.PI, 0); c.fill(); }
      if (kind === 'clock') { c.fillStyle = '#fff'; circ(c, x + w / 2, 86 - h + 10, 5); c.fill(); }
      c.fillStyle = 'rgba(255,255,255,.55)'; for (var r = 0; r < h - 10; r += 10) c.fillRect(x + w * 0.25, 86 - h + 6 + r, w * 0.5, 4);
      x += w + 40 * k;
    }
    c.fillStyle = key === 'pier' ? '#3f8fb3' : key === 'space' ? '#3a4660' : '#6a4b2f'; c.fillRect(4, 86, 92, 10);
    if (key === 'space') { c.fillStyle = '#fff'; for (i = 0; i < 9; i++) c.fillRect((i * 37) % 86 + 8, (i * 23) % 40 + 10, 2, 2); }
  } else if (type === 'hat') {
    c.fillStyle = '#f3e6ee'; circ(c, 50, 54, 44); c.fill();
    c.fillStyle = MCOL.grumble.body; c.beginPath(); c.arc(50, 90, 30, Math.PI, 0); c.fill();
    c.fillStyle = '#fff'; circ(c, 52, 74, 9); c.fill(); c.fillStyle = INK; circ(c, 54, 74, 4.5); c.fill();
    c.save(); c.translate(50, 60); c.scale(1.6, 1.6); hatOn(c, { hat: key, era: '' }, 0, 0, 1); c.restore();
  } else if (type === 'mode') {
    c.fillStyle = key === 'bw' ? '#d8d8d8' : key === 'musical' ? '#ffe9a8' : '#cfeef0'; rr(c, 4, 4, 92, 92, 16); c.fill();
    if (key === 'slow') {
      c.fillStyle = '#c98a4a'; ell(c, 46, 74, 30, 9); c.fill(); c.fillStyle = '#8b5bd6'; circ(c, 52, 56, 18); c.fill();
      c.strokeStyle = '#5f3aa0'; c.lineWidth = 3; c.beginPath(); c.arc(52, 56, 10, 0, 5); c.stroke();
      c.strokeStyle = '#c98a4a'; c.lineWidth = 3; line(c, 22, 66, 18, 50); line(c, 28, 66, 28, 50); c.fillStyle = INK; circ(c, 18, 49, 2.5); c.fill(); circ(c, 28, 49, 2.5); c.fill();
    } else if (key === 'musical') {
      c.fillStyle = PLUM; for (var i2 = 0; i2 < 2; i2++) { var nx = 32 + i2 * 30, ny = 70 - i2 * 10; ell(c, nx, ny, 9, 7, -0.4); c.fill(); c.fillRect(nx + 6, ny - 38, 4, 38); }
      c.fillRect(38, 22, 34, 6); c.fillStyle = CORAL; circ(c, 82, 30, 6); c.fill();
    } else if (key === 'bw') {
      c.fillStyle = '#2a2a2a'; c.fillRect(16, 20, 68, 60); c.fillStyle = '#d8d8d8'; for (var j = 0; j < 5; j++) { c.fillRect(20 + j * 13, 24, 7, 6); c.fillRect(20 + j * 13, 70, 7, 6); }
      c.fillStyle = '#9a9a9a'; c.fillRect(22, 36, 56, 28); c.fillStyle = '#555'; circ(c, 50, 50, 10); c.fill();
    } else { c.fillStyle = TEAL; circ(c, 50, 50, 26); c.fill(); }
  } else if (type === 'prop') {
    c.fillStyle = '#f3e6ee'; circ(c, 50, 54, 44); c.fill();
    if (key === 'confetti') {
      c.save(); c.translate(36, 70); c.rotate(-0.7); c.fillStyle = '#5a1650'; rr(c, -12, -10, 50, 20, 6); c.fill(); c.fillStyle = GOLD; c.fillRect(30, -12, 8, 24); c.restore();
      for (var q = 0; q < 12; q++) { c.fillStyle = CONF[q % 6]; c.fillRect(56 + (q * 17) % 30, 16 + (q * 13) % 30, 6, 4); }
    } else if (key === 'chicken') {
      c.save(); c.translate(50, 54); c.rotate(-0.4);
      c.fillStyle = '#ffe08a'; ell(c, 0, 0, 34, 10); c.fill(); circ(c, 30, -4, 9); c.fill();
      c.fillStyle = CORAL; c.beginPath(); c.moveTo(26, -12); c.lineTo(30, -20); c.lineTo(34, -12); c.fill();
      c.fillStyle = '#ff9a3c'; c.beginPath(); c.moveTo(38, -4); c.lineTo(48, -2); c.lineTo(38, 0); c.fill();
      c.fillStyle = INK; circ(c, 32, -6, 1.6); c.fill();
      c.strokeStyle = '#ff9a3c'; c.lineWidth = 3; line(c, -32, 4, -40, 12); line(c, -32, -2, -42, 2);
      c.restore();
    }
  } else if (type === 'suit') {
    c.fillStyle = '#2a1030'; circ(c, 50, 54, 44); c.fill();
    drawMonster(c, 'grumble', 44, 92, 1, thumbOpts({ suit: 'glitter', t: 2 }));
  }
}
function drawSecretPic(c, id) {
  c.fillStyle = '#f3e6ee'; circ(c, 50, 54, 44); c.fill();
  if (id === 'jaywin') { c.fillStyle = '#ffd98a'; c.fillRect(22, 22, 56, 62); c.strokeStyle = INK; c.lineWidth = 3; c.strokeRect(22, 22, 56, 62); drawJay(c, 50, 74, 1.1, 0.4); }
  else if (id === 'bonnie') { c.save(); c.translate(40, 80); c.scale(2.1, 2.1); drawBonnie(c, 0, 0, 1, 1, 0); c.restore(); }
  else if (id === 'director') { c.save(); c.translate(10, 18); c.scale(1.5, 1.5); drawDirector(c, 0, 0, 1, true, 0); c.restore(); }
  else if (id === 'bird') { c.fillStyle = '#5a9ad6'; ell(c, 46, 58, 20, 14); c.fill(); circ(c, 62, 44, 11); c.fill(); c.fillStyle = GOLD; c.beginPath(); c.moveTo(70, 42); c.lineTo(84, 46); c.lineTo(70, 50); c.fill(); c.fillStyle = INK; circ(c, 65, 42, 2.5); c.fill(); c.strokeStyle = '#3a6a9a'; c.lineWidth = 5; line(c, 28, 58, 14, 66); c.strokeStyle = '#ff9a3c'; c.lineWidth = 3; line(c, 44, 72, 42, 82); line(c, 52, 72, 54, 82); }
  else if (id === 'box') { drawBox(c, { x: 50, side: -1, peek: 0.75, wave: 0 }); }
  else if (id === 'grandad') { c.fillStyle = '#fff8ee'; rr(c, 14, 26, 72, 40, 14); c.fill(); c.strokeStyle = INK; c.lineWidth = 3; c.stroke(); c.fillStyle = INK; c.font = '26px ' + CF; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('STOP.', 50, 47); c.fillStyle = '#fff8ee'; c.beginPath(); c.moveTo(30, 64); c.lineTo(24, 80); c.lineTo(42, 64); c.fill(); }
}
/* drawBox is drawn relative to GY in the game; give the picture its own GY */
var _drawBox = drawBox;
drawBox = function (c, r) {
  if (G && r.kind === 'box') { _drawBox(c, r); return; }
  c.save(); c.translate(0, 92 - GY); _drawBox(c, r); c.restore();
};

/* the poster at the end of a take */
var TITLES = {
  stone: '{M} OF THE STONE AGE', egypt: '{M} OF THE NILE', rome: '{M}: SANDALS OF DOOM', viking: '{M} THE LOUD',
  victorian: 'A VERY PROPER {M}', eighties: '{M} 2: TOTALLY RADICAL', future: '{M} 3026'
};
function filmTitle() { return TITLES[G.era.id].replace('{M}', MON[G.mk].name.toUpperCase()); }
function drawPoster(c, stars) {
  var pal = G.era.pal, i;
  var g = c.createLinearGradient(0, 0, 0, 140); g.addColorStop(0, G.set.stars ? '#06142b' : pal.sky); g.addColorStop(1, G.set.stars ? '#2a4f8f' : pal.sky2);
  c.fillStyle = g; c.fillRect(0, 0, 100, 140);
  c.fillStyle = 'rgba(0,0,0,.35)';
  for (i = 0; i < 6; i++) { var bw = 12 + (i * 7) % 8, bh = 20 + (i * 13) % 26; c.save(); c.translate(6 + i * 16, 112); c.rotate((i % 2 ? 1 : -1) * 0.5); c.fillRect(0, -bh * 0.4, bw, bh * 0.4); c.restore(); }
  c.fillStyle = shade(pal.ground, -0.2); c.fillRect(0, 110, 100, 30);
  c.save(); c.translate(50, 112);
  drawMonster(c, G.mk, 0, 0, G.mk === 'sock' ? 0.9 : 1.1, thumbOpts({ era: G.era.id, hat: G.hat, suit: G.suit, punch: 1, neck: G.mk === 'sock' ? 20 : 0, xmas: G.xmas }));
  c.restore();
  c.fillStyle = '#9aa58c'; c.save(); c.translate(80, 26); c.rotate(0.6); c.fillRect(-9, -4, 18, 7); c.fillRect(-4, -8, 8, 5); c.restore();
  c.fillStyle = 'rgba(26,13,28,.75)'; c.fillRect(0, 0, 100, 22);
  c.fillStyle = GOLD; c.textAlign = 'center'; c.textBaseline = 'middle';
  var t = filmTitle(), fs = Math.min(13, 150 / Math.max(8, t.length));
  c.font = fs + 'px ' + CF; c.fillText(t, 50, 9, 94);
  c.fillStyle = '#fff6fb'; c.font = '6px ' + CF; c.fillText('VERSUS ' + G.set.place.toUpperCase(), 50, 18);
  c.fillStyle = 'rgba(26,13,28,.75)'; c.fillRect(0, 124, 100, 16);
  c.fillStyle = '#fff6fb'; c.font = '6px ' + CF; c.fillText('A MR BERET PRODUCTION   STARRING LW AS THE MONSTER', 50, 132, 96);
}

/* ==========================================================
   OVERLAY AND CARDS
   ========================================================== */
function build() {
  var o = el('div', 'lwmm' + (window.HQBreak && window.LWGate ? ' gated' : ''));
  o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', GAME + ', an arcade game');
  var bar = el('div', 'mm-bar');
  var title = el('div', 'mm-title', ICON_SVG + '<span>' + GAME + '</span>');
  var pz = el('button', 'mm-tb', 'Pause'); pz.type = 'button'; pz.hidden = true;
  var pad = el('button', 'mm-tb', 'Pad'); pad.type = 'button';
  var snd = el('button', 'mm-tb'); snd.type = 'button';
  var x = el('button', 'mm-x', 'Close &#10005;'); x.type = 'button'; x.setAttribute('aria-label', 'Close the game');
  bar.appendChild(title); bar.appendChild(pz); bar.appendChild(pad); bar.appendChild(snd); bar.appendChild(x);
  var stage = el('div', 'mm-stage');
  var cv = document.createElement('canvas'); cv.className = 'mm-cv';
  cv.setAttribute('role', 'img');
  cv.setAttribute('aria-label', 'A film set. The monster climbs cardboard buildings and punches them flat, while cardboard tanks and a helicopter on a fishing rod try to stop it.');
  var padEl = el('div', 'mm-pad',
    '<div class="mm-dp"><button class="u" data-k="u" aria-label="Up">' + arrow(0) + '</button><button class="l" data-k="l" aria-label="Left">' + arrow(270) + '</button>' +
    '<button class="r" data-k="r" aria-label="Right">' + arrow(90) + '</button><button class="d" data-k="d" aria-label="Down">' + arrow(180) + '</button></div>' +
    '<div class="mm-ab"><button class="s" data-k="s" aria-label="Special move">POWER</button><button class="j" data-k="j" aria-label="Jump">JUMP</button><button class="p" data-k="p" aria-label="Punch">PUNCH</button></div>');
  padEl.hidden = true;
  var card = el('div', 'mm-card'); card.hidden = true;
  var live = el('div', 'mm-sr'); live.setAttribute('aria-live', 'polite');
  stage.appendChild(cv); stage.appendChild(padEl); stage.appendChild(card); stage.appendChild(live);
  o.appendChild(bar); o.appendChild(stage);
  ui = { o: o, bar: bar, pause: pz, padBtn: pad, snd: snd, x: x, stage: stage, canvas: cv, pad: padEl, card: card, live: live, padOn: false };
  ctx = cv.getContext('2d');
  x.addEventListener('click', close);
  pz.addEventListener('click', function () { doPause(); });
  snd.addEventListener('click', function () { unlockAudio(); store.sound = !store.sound; saveStore(); syncButtons(); syncGain(); if (store.sound) sfx('ding'); });
  pad.addEventListener('click', function () { store.pad = ui.padOn ? 'off' : 'on'; saveStore(); setPad(); layout(); });
  card.addEventListener('click', onCardClick);
  bindPointer(cv); bindPad(padEl);
  o.addEventListener('pointerdown', unlockAudio);
  return o;
}
function arrow(rot) { return '<svg viewBox="0 0 24 24" style="transform:rotate(' + rot + 'deg)"><path d="M12 4l8 10h-5v6H9v-6H4z" fill="#1a0d1c"/></svg>'; }
function setPad() {
  var want = store.pad === 'on' ? true : store.pad === 'off' ? false : (COARSE || !FINE);
  ui.padOn = want;
  ui.pad.hidden = !(want && (state === 'play' || state === 'intro' || state === 'paused'));
  ui.padBtn.setAttribute('aria-pressed', want ? 'true' : 'false');
  ui.padBtn.textContent = want ? 'Pad on' : 'Pad off';
}
function syncButtons() {
  if (!ui.snd) return;
  ui.snd.textContent = store.sound ? 'Sound on' : 'Sound off';
  ui.snd.setAttribute('aria-pressed', store.sound ? 'true' : 'false');
  ui.pause.hidden = state !== 'play';
}
var toastQ = [];
function toast(t) { if (ui.live) ui.live.textContent = t; if (G) txt(t, G.m.x, G.m.y - mH() - 50, '#ffe08a', 22, true); }

function showCard(html, cls) {
  ui.card.className = 'mm-card' + (cls ? ' ' + cls : '');
  ui.card.innerHTML = html; ui.card.hidden = false; ui.card.scrollTop = 0;
  var f = ui.card.querySelector('.mm-go') || ui.card.querySelector('button');
  if (f) try { f.focus({ preventScroll: true }); } catch (e) {}
}
function hideCard() { ui.card.hidden = true; ui.card.innerHTML = ''; }

/* ---------- the menu: today's film ---------- */
function newlyUnlocked() {
  var out = [];
  LAD.have.forEach(function (u) { if (u.at > 0 && store.seen.indexOf(u.id) < 0) out.push(u); });
  return out;
}
function showMenu() {
  state = 'menu'; syncButtons(); setPad(); musicStop();
  if (heldModal || (ui.o && ui.o.classList.contains('lwmm-take'))) { releaseModal(); if (modalUp()) return; }
  refreshLadder();
  var fresh = newlyUnlocked();
  if (fresh.length) { showNew(fresh); return; }
  var era = eraNow(), E = ERA[era.id];
  var h = '<span class="mm-kick">NOW SHOOTING</span><h2>' + esc(E.genre) + '</h2>' +
    '<div class="mm-era" style="background:' + era.pal.sky2 + ';color:' + INK + '"><canvas data-pic="era"></canvas><div><b>' + esc(era.name) + '</b><span>' + esc(era.line) + '</span><span><b style="display:inline;font-size:1rem">This week:</b> ' + esc(E.rule) + '</span></div></div>';
  h += '<h3>The monster</h3><div class="mm-picks" role="group" aria-label="Pick a monster">';
  MON_ORDER.forEach(function (k) {
    var own = owns('monster', k), u = unlockFor('monster', k);
    h += '<button type="button" class="mm-pk" data-pick="monster" data-key="' + k + '" aria-pressed="' + (store.pick.monster === k) + '"' + (own ? '' : ' disabled') + '>' +
      '<canvas data-pic="monster:' + k + (own ? '' : ':sil') + '"></canvas><b>' + (own ? esc(MON[k].name) : '???') + '</b><small>' + (own ? esc(MON[k].sname) : lockWord(u)) + '</small></button>';
  });
  h += '</div><h3>The set</h3><div class="mm-picks" role="group" aria-label="Pick a set">';
  SET_ORDER.forEach(function (k) {
    var own = owns('set', k), u = unlockFor('set', k), b = store.best[k] || 0;
    h += '<button type="button" class="mm-pk" data-pick="set" data-key="' + k + '" aria-pressed="' + (store.pick.set === k) + '"' + (own ? '' : ' disabled') + '>' +
      '<canvas data-pic="set:' + k + (own ? '' : ':sil') + '"></canvas><b>' + (own ? esc(SETS[k].name) : '???') + '</b><small>' + (own ? (b ? 'Best ' + money(b) : 'Not shot yet') : lockWord(u)) + '</small></button>';
  });
  h += '</div><h3>Wardrobe and director</h3><div class="mm-ward">' +
    wardBtn('hat', 'Hat', HAT_ORDER) + wardBtn('mode', 'Director mode', MODE_ORDER) + wardBtn('prop', 'Prop', PROP_ORDER) + wardBtn('suit', 'Costume', SUIT_ORDER) + '</div>';
  h += '<button type="button" class="mm-go" data-act="go">ACTION!</button>' +
    '<div class="mm-row2"><button type="button" class="mm-c2" data-act="coll">Collection ' + LAD.have.length + ' of ' + UNLOCKS.length + '</button>' +
    '<button type="button" class="mm-c2" data-act="secrets">Secrets ' + secretCount() + ' of ' + SECRETS.length + '</button></div>' +
    (FINE ? '<p class="mm-tip">Keys: arrows to walk and climb, Space to punch, Z to jump, X for your special, P to pause. Or click where you want to go and what to punch.</p>' :
      '<p class="mm-tip">Use the pad, or tap where you want to go and what to punch.</p>');
  showCard(h, 'menu');
  paintPics();
  var sel = ui.card.querySelectorAll('.mm-pk[aria-pressed="true"]');
  for (var si = 0; si < sel.length; si++) { var row = sel[si].parentNode; row.scrollLeft = Math.max(0, sel[si].offsetLeft - row.offsetLeft - 8); }
  if (G && (G.mk !== store.pick.monster || G.setKey !== store.pick.set || G.hat !== store.pick.hat || G.suit !== store.pick.suit || G.mode !== store.pick.mode)) previewTake();
}
function lockWord(u) {
  if (!u) return 'Locked';
  if (LAD.next && LAD.next.id === u.id) return LAD.need + ' more sparks';
  return 'Locked';
}
function unlockFor(type, key) { for (var i = 0; i < UNLOCKS.length; i++) if (UNLOCKS[i].type === type && UNLOCKS[i].key === key) return UNLOCKS[i]; return null; }
function wardBtn(type, label, list) {
  var have = list.filter(function (k) { return owns(type, k); });
  var cur = store.pick[type];
  return '<button type="button" class="mm-wb" data-ward="' + type + '"' + (have.length < 2 ? ' disabled' : '') + '><canvas data-pic="' + type + ':' + cur + '"></canvas><div><span>' + label + '</span><b>' +
    esc(NAMES[type][cur]) + '</b>' + (have.length < 2 ? '<span style="text-transform:none;letter-spacing:0;font-weight:400">More to unlock</span>' : '') + '</div></button>';
}
function paintPics() {
  var list = ui.card.querySelectorAll('canvas[data-pic]');
  for (var i = 0; i < list.length; i++) {
    var cv = list[i], p = cv.getAttribute('data-pic').split(':'), r = cv.getBoundingClientRect(), sz = Math.round(r.width) || 64;
    var n = mini(sz, function (c) {
      if (p[0] === 'era') drawEraPic(c);
      else if (p[0] === 'secret') drawSecretPic(c, p[1]);
      else if (p[0] === 'poster') { c.save(); c.scale(100 / 100, 100 / 140); drawPoster(c, 0); c.restore(); }
      else if (p[0] === 'normal' || p[1] === 'normal' || p[1] === 'none') drawPlain(c, p[0]);
      else drawThumb(c, p[0], p[1]);
    });
    if (p[2] === 'sil') silhouette(n);
    n.className = cv.className; n.setAttribute('data-pic', cv.getAttribute('data-pic'));
    cv.parentNode.replaceChild(n, cv);
  }
}
function drawPlain(c, type) {
  c.fillStyle = '#f3e6ee'; circ(c, 50, 50, 44); c.fill();
  c.strokeStyle = '#c9b0c1'; c.lineWidth = 6; circ(c, 50, 50, 26); c.stroke(); line(c, 32, 68, 68, 32);
}
function drawEraPic(c) {
  var era = eraNow(), pal = era.pal;
  var g = c.createLinearGradient(0, 0, 0, 100); g.addColorStop(0, pal.sky); g.addColorStop(1, pal.sky2);
  c.fillStyle = g; c.fillRect(0, 0, 100, 100);
  c.fillStyle = pal.ground; c.fillRect(0, 74, 100, 26);
  var Gs = G; G = { era: era, E: ERA[era.id], xmas: era.id === 'future' };
  snackIcon(c, 24, 62, 10);
  G = Gs;
  drawMonster(c, 'grumble', 62, 92, 0.85, thumbOpts({ era: era.id, xmas: era.id === 'future' }));
}
function secretCount() { var n = 0; SECRETS.forEach(function (s) { if (store.secrets[s.id]) n++; }); return n; }

function showNew(list) {
  var h = '<span class="mm-kick">NEW ON SET</span><h2>' + (list.length > 1 ? 'Fresh from the prop store' : 'Fresh from the prop store') + '</h2><div class="mm-new">';
  list.forEach(function (u) { h += '<div class="mm-pop"><canvas data-pic="' + u.type + ':' + u.key + '"></canvas><b>' + esc(u.name) + '</b><small>' + esc(u.line) + '</small></div>'; });
  h += '</div><button type="button" class="mm-go" data-act="seen">LOVELY</button>';
  list.forEach(function (u) { store.seen.push(u.id); });
  saveStore();
  sfx('level');
  showCard(h, 'small');
  paintPics();
}

/* ---------- the collection and the secrets ---------- */
function showColl() {
  refreshLadder();
  var h = '<span class="mm-kick">THE PROP STORE</span><h2>Collection</h2><p>Sparks from your learning open new things here, one by one.</p><div class="mm-grid">';
  UNLOCKS.forEach(function (u) {
    var own = owns(u.type, u.key), nxt = LAD.next && LAD.next.id === u.id;
    h += '<div class="mm-tile' + (own ? '' : ' lock') + (nxt ? ' next' : '') + '"><canvas data-pic="' + u.type + ':' + u.key + (own ? '' : ':sil') + '"></canvas><b>' + (own ? esc(u.name) : '???') + '</b><small>' +
      (own ? esc(u.line) : nxt ? LAD.need + ' more sparks' : 'Still in the prop store') + '</small></div>';
  });
  h += '</div><button type="button" class="mm-go" data-act="menu">BACK TO SET</button>';
  showCard(h);
  paintPics();
}
function showSecrets() {
  var h = '<span class="mm-kick">HIDDEN ON SET</span><h2>Secrets found ' + secretCount() + ' of ' + SECRETS.length + '</h2><p>Never needed, just for fun.</p><div class="mm-grid">';
  SECRETS.forEach(function (s) {
    var got = !!store.secrets[s.id];
    h += '<div class="mm-tile' + (got ? '' : ' lock') + '"><canvas data-pic="secret:' + s.id + (got ? '' : ':sil') + '"></canvas><b>' + (got ? esc(s.name) : '???') + '</b><small>' + esc(got ? s.line : s.clue) + '</small></div>';
  });
  h += '</div><button type="button" class="mm-go" data-act="menu">BACK TO SET</button>';
  showCard(h);
  paintPics();
}

/* ---------- the review at the end of a take ---------- */
var CRITICS = ['The Daily Popcorn', 'Reel Weekly', 'Monster Monthly', 'A man at the bus stop', 'Your gran', 'The Cardboard Gazette', 'Film Fortnightly'];
var QUOTES = [
  ['So bad it is brilliant.', 'The cardboard was the real star.', 'I have seen scarier biscuits. Loved it.', 'Wobbly, short and very cardboard. A classic.'],
  ['A bit wobbly. Like the buildings.', 'Some lovely smashing. Needed more snacks.', 'The tanks were the real heroes. Sorry, tanks.'],
  ['I laughed, I cried, I ate popcorn.', 'Solid smashing from start to finish.', 'Proper monster behaviour. Three stars.'],
  ['A towering performance. Literally.', 'The cardboard never stood a chance.', 'Bigger, as the director asked. Much bigger.'],
  ['Monster of the year!', 'Five stars. Every star. All the stars.', 'Give that monster an award and a sandwich!', 'Flawless. Flat. Fabulous.']
];
var ERAQ = {
  stone: 'You could barely see the pterodactyl strings.', egypt: 'The cats were outstanding.', rome: 'Both halves of the horse were superb.',
  viking: 'The choir deserves its own film.', victorian: 'Terribly proper. Terribly smashed.', eighties: 'Radical. Totally. Like, for real.', future: 'The tinsel acted its heart out.'
};
function showReview() {
  if (state === 'over') return;
  state = 'over'; musicStop(); syncButtons(); setPad();
  var st = G.st, nB = G.blds.length;
  var frac = st.folds / nB, stars = clamp(1 + Math.round(frac * 3) + (G.money >= 9000 ? 1 : 0), 1, 5);
  if (G.endKind === 'cut' && stars > 3) stars = 3;
  var prev = store.best[G.setKey] || 0, isBest = G.money > prev;
  if (isBest) store.best[G.setKey] = G.money;
  store.total += G.money; store.flat += st.folds; store.wraps++;
  saveStore();
  var q = Math.random() < 0.25 ? ERAQ[G.era.id] : pick(QUOTES[stars - 1]);
  var critic = Math.random() < 0.08 ? 'Bonnie (a small dog)' : pick(CRITICS);
  var h = '<span class="mm-kick">' + (G.endKind === 'cut' ? 'CUT! THAT WILL DO' : "THAT'S A WRAP") + '</span>' +
    '<h2>' + esc(filmTitle()) + '</h2>' +
    (isBest && G.money > 0 ? '<div class="mm-badge mm-pop">New best for ' + esc(G.set.name) + '</div>' : '') +
    '<div class="mm-rev"><span class="mm-pslot"></span><div><div class="mm-stars" role="img" aria-label="' + stars + ' stars out of 5">';
  for (var i = 0; i < 5; i++) h += starSvg(i < stars);
  h += '</div><p class="mm-quote">"' + esc(q) + '"<small>' + esc(critic) + '</small></p></div></div>' +
    '<div class="mm-nums"><div><span>Box office</span><b>' + money(G.money) + '</b></div><div><span>Best here</span><b>' + money(store.best[G.setKey] || 0) + '</b></div></div>' +
    '<div class="mm-bits"><span><b>' + st.folds + '/' + nB + '</b> flats flat</span><span><b>' + st.windows + '</b> windows</span><span><b>' + (st.tanks + st.helis + st.megs) + '</b> props folded</span><span><b>' + st.snacks + '</b> snacks</span>' +
    (st.stunts ? '<span><b>' + st.stunts + '</b> stunts</span>' : '') + '</div>';
  if (G.secretsNew.length) h += '<p style="margin-top:8px;font-weight:700">Secret found: ' + G.secretsNew.map(function (s) { return esc(secretById(s).name); }).join(', ') + '</p>';
  if (G.endKind === 'cut') h += '<p class="mm-tip" style="margin-top:6px !important">The monster ran out of gusto, so the director called it. Snacks and the catering table top it up.</p>';
  var fresh = (refreshLadder(), newlyUnlocked());
  if (fresh.length) h += '<p style="margin-top:8px;font-weight:700">Something new is waiting in the prop store.</p>';
  h += '<button type="button" class="mm-go" data-act="again">ANOTHER TAKE</button>' +
    '<div class="mm-row2"><button type="button" class="mm-c2" data-act="menu">Change the film</button><button type="button" class="mm-c2" data-act="close">Back to my HQ</button></div>';
  showCard(h, 'small review');
  /* the poster: taller than it is wide */
  var slot = ui.card.querySelector('.mm-pslot');
  if (slot) {
    var w = V.W < 480 ? 92 : 112, hh = Math.round(w * 1.4), d = Math.min(window.devicePixelRatio || 1, 2);
    var n = document.createElement('canvas'); n.width = w * d; n.height = hh * d; n.style.width = w + 'px'; n.style.height = hh + 'px'; n.className = 'mm-poster';
    n.setAttribute('role', 'img'); n.setAttribute('aria-label', 'The film poster for ' + filmTitle());
    var c = n.getContext('2d'); c.setTransform(d * w / 100, 0, 0, d * w / 100, 0, 0); try { drawPoster(c, stars); } catch (e) {}
    slot.parentNode.replaceChild(n, slot);
  }
  overAt = Date.now();
  releaseModal();
}
var overAt = 0;
function starSvg(on) {
  return '<svg viewBox="0 0 40 40" class="' + (on ? 'on' : 'off') + '" aria-hidden="true"><path d="M20 3l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z" fill="' + (on ? GOLD : '#e6d8e1') + '" stroke="' + (on ? INK : '#d4c2cf') + '" stroke-width="2" stroke-linejoin="round"/></svg>';
}

function onCardClick(e) {
  var b = e.target.closest ? e.target.closest('button') : null;
  if (!b || !ui.card.contains(b) || b.disabled) return;
  unlockAudio();
  var act = b.getAttribute('data-act'), pk = b.getAttribute('data-pick'), wd = b.getAttribute('data-ward');
  if (pk) { store.pick[pk] = b.getAttribute('data-key'); saveStore(); sfx('clap'); showMenu(); return; }
  if (wd) {
    var list = { hat: HAT_ORDER, mode: MODE_ORDER, prop: PROP_ORDER, suit: SUIT_ORDER }[wd].filter(function (k) { return owns(wd, k); });
    var i = list.indexOf(store.pick[wd]); store.pick[wd] = list[(i + 1) % list.length]; saveStore(); sfx('boink'); showMenu();
    var again = ui.card.querySelector('[data-ward="' + wd + '"]'); if (again) try { again.focus(); } catch (er) {}
    return;
  }
  if (act === 'go' || act === 'again') startTake();
  else if (act === 'menu') { previewTake(); showMenu(); }
  else if (act === 'seen') showMenu();
  else if (act === 'coll') showColl();
  else if (act === 'secrets') showSecrets();
  else if (act === 'resume') resume();
  else if (act === 'close') close();
}

/* ---------- starting, pausing ---------- */
function previewTake() {
  var keep = store.takes[store.pick.set] || 0;
  newTake(); store.takes[store.pick.set] = keep; G.take = keep + 1; saveStore();
  G.preview = true;
  buildCloth();
}
function startTake() {
  newTake();
  buildCloth();
  hideCard();
  state = 'intro'; G.intro = 0; G.clapped = false;
  syncButtons(); setPad();
  if (ui.o) ui.o.classList.add('lwmm-take');
  sfx('sting');
  try { ui.canvas.focus({ preventScroll: true }); } catch (e) {}
}
function doPause() {
  if (state !== 'play') return;
  state = 'paused'; musicStop(); syncButtons();
  clearInput();
  showCard('<span class="mm-kick">TEA BREAK</span><h2>Paused</h2><p>The crew are holding their positions.</p>' +
    '<button type="button" class="mm-go" data-act="resume">CARRY ON</button><button type="button" class="mm-c2" data-act="menu">Change the film</button>', 'small');
}
function resume() { if (state !== 'paused') return; hideCard(); state = 'play'; syncButtons(); musicStart(); try { ui.canvas.focus({ preventScroll: true }); } catch (e) {} }
function clearInput() { inp.l = inp.r = inp.u = inp.d = inp.p = 0; inp.jHit = inp.sHit = inp.pHit = 0; keyDown = {}; goal.on = false;
  if (ui.pad) { var bs = ui.pad.querySelectorAll('button'); for (var i = 0; i < bs.length; i++) bs[i].classList.remove('on'); } }

/* ---------- the break: let the take finish first ---------- */
var mo = null, heldModal = null;
function watchModal() {
  if (mo || !window.MutationObserver) return;
  mo = new MutationObserver(function (list) {
    for (var i = 0; i < list.length; i++) for (var j = 0; j < list[i].addedNodes.length; j++) {
      var n = list[i].addedNodes[j];
      if (n.nodeType === 1 && n.classList && n.classList.contains('hqw-back') && takeLive()) { heldModal = n; n.style.display = 'none'; }
    }
  });
  mo.observe(document.body, { childList: true });
}
function takeLive() { return state === 'intro' || state === 'play' || state === 'paused' || state === 'ending'; }
function releaseModal() {
  if (ui.o) ui.o.classList.remove('lwmm-take');
  if (heldModal) { var n = heldModal; heldModal = null; if (n.parentNode) { n.style.display = ''; var b = n.querySelector('button'); if (b) try { b.focus(); } catch (e) {} } }
}
function modalUp() { var m = document.querySelector('.hqw-back'); return !!(m && m.style.display !== 'none'); }

/* ==========================================================
   INPUT
   ========================================================== */
function onKey(e) {
  if (state === 'closed' || modalUp()) return;
  var k = e.key, tgt = e.target, onBtn = tgt && tgt.tagName === 'BUTTON';
  if (k === 'Escape' || k === 'Esc') { e.preventDefault(); if (state === 'play') doPause(); else close(); return; }
  if (k === 'Tab') { trapTab(e); return; }
  unlockAudio();
  if (state === 'play' || state === 'intro') {
    var used = true;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') inp.l = 1;
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') inp.r = 1;
    else if (k === 'ArrowUp' || k === 'w' || k === 'W') inp.u = 1;
    else if (k === 'ArrowDown' || k === 's' || k === 'S') inp.d = 1;
    else if (k === ' ' || k === 'Spacebar' || k === 'j' || k === 'J') { inp.p = 1; if (!e.repeat) inp.pHit = 1; }
    else if (k === 'z' || k === 'Z' || k === 'Shift' || k === 'k' || k === 'K') { if (!e.repeat) inp.jHit = 1; }
    else if (k === 'x' || k === 'X' || k === 'l' || k === 'L') { if (!e.repeat) inp.sHit = 1; }
    else if (k === 'p' || k === 'P') { doPause(); }
    else if (k === 'm' || k === 'M') { store.sound = !store.sound; saveStore(); syncButtons(); syncGain(); }
    else used = false;
    if (used) e.preventDefault();
    return;
  }
  if (state === 'paused') { if (k === 'p' || k === 'P' || ((k === ' ' || k === 'Enter') && !onBtn)) { e.preventDefault(); resume(); } return; }
  if (state === 'over' && (k === ' ' || k === 'Enter') && !onBtn && Date.now() - overAt > 500) { e.preventDefault(); startTake(); }
  if (state === 'menu' && k === 'Enter' && !onBtn) { e.preventDefault(); startTake(); }
}
function onKeyUp(e) {
  var k = e.key;
  if (k === 'ArrowLeft' || k === 'a' || k === 'A') inp.l = 0;
  else if (k === 'ArrowRight' || k === 'd' || k === 'D') inp.r = 0;
  else if (k === 'ArrowUp' || k === 'w' || k === 'W') inp.u = 0;
  else if (k === 'ArrowDown' || k === 's' || k === 'S') inp.d = 0;
  else if (k === ' ' || k === 'Spacebar' || k === 'j' || k === 'J') inp.p = 0;
}
function trapTab(e) {
  var list = Array.prototype.filter.call(ui.o.querySelectorAll('button'), function (b) { return !b.disabled && b.offsetParent !== null; });
  if (!list.length) return;
  var i = list.indexOf(document.activeElement);
  e.preventDefault();
  var n = e.shiftKey ? (i <= 0 ? list.length - 1 : i - 1) : (i < 0 || i >= list.length - 1 ? 0 : i + 1);
  list[n].focus();
}
function bindPad(padEl) {
  var map = {};
  function set(b, on) {
    var k = b.getAttribute('data-k');
    b.classList.toggle('on', on);
    if (k === 'p') { inp.p = on ? 1 : 0; if (on) inp.pHit = 1; }
    else if (k === 'j') { if (on) inp.jHit = 1; }
    else if (k === 's') { if (on) inp.sHit = 1; }
    else inp[k] = on ? 1 : 0;
  }
  padEl.addEventListener('pointerdown', function (e) {
    var b = e.target.closest ? e.target.closest('button') : null; if (!b) return;
    e.preventDefault(); unlockAudio();
    try { b.setPointerCapture(e.pointerId); } catch (er) {}
    map[e.pointerId] = b; set(b, true); goal.on = false;
  });
  function up(e) { var b = map[e.pointerId]; if (b) { set(b, false); delete map[e.pointerId]; } }
  padEl.addEventListener('pointerup', up); padEl.addEventListener('pointercancel', up); padEl.addEventListener('lostpointercapture', up);
  padEl.addEventListener('contextmenu', function (e) { e.preventDefault(); });
}
function bindPointer(cv) {
  cv.addEventListener('pointerdown', function (e) {
    if (!G) return;
    e.preventDefault();
    var r = cv.getBoundingClientRect(), sx = e.clientX - r.left, sy = e.clientY - r.top;
    /* the director's chair */
    var dx = sx - DIR.x, dy = sy - DIR.y;
    if (state === 'play' && dx * dx + dy * dy < DIR.r * DIR.r) { tapDirector(); return; }
    if (state !== 'play') return;
    var wx = sx / V.k + V.cam, wy = (sy - V.oy) / V.k;
    aimAt(wx, wy);
  });
  cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });
}
function tapDirector() {
  G.dirTaps++;
  sfx('pop');
  if (G.dirTaps === 1) say('Yes? I am very busy.', 6);
  else if (G.dirTaps === 3) say('Please stop poking my chair.', 6);
  else if (G.dirTaps >= 5 && !G.dirJay) { G.dirJay = true; say('When I was in China....', 8); findSecret('director'); }
  else if (G.dirJay) say(pick(['My ears are not a toilet.', 'Outrageous.', 'Back to work, monster!']), 7);
}
function aimAt(wx, wy) {
  var i, best = null, bd = 60 * 60, d2;
  goal.ent = null; goal.cell = null; goal.t = 7;
  for (var q = 0; q < G.runners.length; q++) {
    var rn = G.runners[q];
    if (rn.kind === 'bonnie' && !rn.met && Math.abs(rn.x - wx) < 40 && Math.abs(GY - 15 - wy) < 40) { rn.pat = true; return; }
    if (rn.kind === 'box' && Math.abs(rn.x - rn.side * (rn.peek * 40 - 30) - wx) < 40 && Math.abs(GY - 35 - wy) < 50) { rn.wave = 1.5; findSecret('box'); return; }
  }
  function near(x, y, rad) { var dx = x - wx, dy = y - wy; return dx * dx + dy * dy < rad * rad ? dx * dx + dy * dy : -1; }
  for (i = 0; i < G.helis.length; i++) { var h = G.helis[i]; if (!h.out && (d2 = near(h.x, h.y, 60)) >= 0 && d2 < bd) { bd = d2; best = h; } }
  for (i = 0; i < G.tanks.length; i++) { var t = G.tanks[i]; if (!t.out && (d2 = near(t.x, t.y - 20, 60)) >= 0 && d2 < bd) { bd = d2; best = t; } }
  for (i = 0; i < G.megs.length; i++) { var g = G.megs[i]; if (!g.out && (d2 = near(g.x, g.y - 30, 50)) >= 0 && d2 < bd) { bd = d2; best = g; } }
  if (best) { goal.on = true; goal.ent = best; goal.x = best.x; goal.y = best.y; goal.punch = 3; return; }
  /* a window on a flat */
  for (i = 0; i < G.blds.length; i++) {
    var b = G.blds[i]; if (b.fold || b.down) continue;
    if (wx < b.x || wx > b.x + b.w || wy < b.top - 10 || wy > GY) continue;
    var bc = null, bcd = 1e9;
    for (var c = 0; c < b.cells.length; c++) { var cl = b.cells[c]; if (cl.st >= 2) continue; var dd = (cl.cx - wx) * (cl.cx - wx) + (cl.cy - wy) * (cl.cy - wy); if (dd < bcd) { bcd = dd; bc = cl; } }
    if (bc) { goal.on = true; goal.cell = bc; goal.x = bc.cx; goal.y = bc.cy; goal.punch = 3; return; }
  }
  goal.on = true; goal.x = clamp(wx, 30, G.W - 30); goal.y = clamp(wy, 140, GY); goal.punch = 0;
}

/* ==========================================================
   LAYOUT AND THE LOOP
   ========================================================== */
function layout() {
  if (!ui.o) return;
  var r = ui.stage.getBoundingClientRect();
  var W = Math.max(280, Math.floor(r.width)), H = Math.max(300, Math.floor(r.height));
  V.dpr = Math.min(window.devicePixelRatio || 1, 2);
  ui.canvas.width = Math.round(W * V.dpr); ui.canvas.height = Math.round(H * V.dpr);
  ui.canvas.style.width = W + 'px'; ui.canvas.style.height = H + 'px';
  V.W = W; V.H = H;
  var span = GY + 60 - TOPY;
  V.k = Math.min(H / span, W / 430);
  V.viewW = W / V.k;
  var used = span * V.k, top = (H - used) / 2;
  if (ui.padOn) top = clamp(H - used - 196, 0, top);
  V.oy = top - TOPY * V.k;
  ui.pad.classList.toggle('ghost', H - (top + used) < 150);
  if (G) buildCloth();
  render();
}
function frame(ts) {
  raf = requestAnimationFrame(frame);
  var dt = lastTs ? (ts - lastTs) / 1000 : 0;
  lastTs = ts;
  if (dt > 0.05) dt = 0.05;
  if (state === 'paused' || state === 'closed') return;
  if (hook.speed > 1 && state === 'play') { for (var hs = 1; hs < hook.speed && state === 'play'; hs++) { botTick(); step(dt); } }
  botTick();
  if (state === 'intro' && G) {
    G.intro += dt; G.real += dt;
    if (G.intro > 0.8 && !G.clapped) { G.clapped = true; sfx('clap'); }
    if (G.intro > 1.6) { state = 'play'; syncButtons(); say(SAY.start, 5); musicStart(); }
    stepParts(dt);
  } else if (state === 'menu' || state === 'over') {
    if (G) { G.real += dt; stepParts(dt); }
  } else step(dt);
  if (goal.on && goal.t != null) { goal.t -= dt; if (goal.t <= 0) goal.on = false; }
  musicPump();
  if (ui.pad && !ui.pad.hidden && G) {
    var sb = ui.pad.querySelector('.s');
    if (sb) { var ready = G.m.spCd <= 0; if (sb._r !== ready) { sb._r = ready; sb.classList.toggle('wait', !ready); sb.textContent = ready ? G.M.sname.toUpperCase() : 'WAIT'; } }
  }
  render();
}
function onVis() { if (document.hidden) { if (state === 'play') doPause(); if (AC && AC.state === 'running') try { AC.suspend(); } catch (e) {} } else if (AC && state !== 'closed') try { AC.resume(); } catch (e) {} }
function onBlur() { if (state === 'play') clearInput(); }
function onResize() { layout(); }

function open() {
  if (state !== 'closed') return;
  opener = document.activeElement;
  loadStore();
  RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  FINE = !!(window.matchMedia && matchMedia('(pointer: fine)').matches);
  COARSE = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
  var o = build();
  document.body.appendChild(o);
  prevOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  state = 'menu';
  syncButtons(); setPad();
  refreshLadder();
  /* the things everyone starts with are never "new" */
  UNLOCKS.forEach(function (u) { if (!u.at && store.seen.indexOf(u.id) < 0) store.seen.push(u.id); });
  saveStore();
  layout();
  previewTake();
  layout();
  showMenu();
  watchModal();
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('keyup', onKeyUp, true);
  window.addEventListener('resize', onResize);
  window.addEventListener('blur', onBlur);
  document.addEventListener('visibilitychange', onVis);
  lastTs = 0;
  raf = requestAnimationFrame(frame);
}
function close() {
  if (state === 'closed') return;
  state = 'closed';
  cancelAnimationFrame(raf); raf = 0;
  musicStop();
  window.removeEventListener('keydown', onKey, true);
  window.removeEventListener('keyup', onKeyUp, true);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('blur', onBlur);
  document.removeEventListener('visibilitychange', onVis);
  if (mo) { mo.disconnect(); mo = null; }
  releaseModal();
  if (ui.o && ui.o.parentNode) ui.o.parentNode.removeChild(ui.o);
  ui = {}; ctx = null; G = null; cloth = null; clearInput();
  for (var i = 0; i < PMAX; i++) P[i].on = false;
  for (i = 0; i < TMAX; i++) TX[i].on = false;
  document.documentElement.style.overflow = prevOverflow;
  if (AC && AC.state === 'running') { try { AC.suspend(); } catch (e) {} }
  updateNote();
  if (opener && opener.focus) { try { opener.focus({ preventScroll: true }); } catch (e) {} }
}

/* ---------- the optional button in the hero (data-button="1") ---------- */
var note = null;
function updateNote() {
  if (!note) return;
  loadStore();
  var b = 0; for (var k in store.best) if (store.best[k] > b) b = store.best[k];
  note.textContent = b > 0 ? 'Be the monster in a cheesy film. Best take: ' + money(b) : 'Be the monster in a cheesy film, whenever you fancy it.';
}
function addButton() {
  var hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('.lwmm-launch')) return;
  var box = el('div', 'lwmm-launch');
  var btn = el('button', 'lwmm-open', ICON_SVG + '<span>' + GAME + '</span>'); btn.type = 'button';
  btn.setAttribute('aria-label', GAME + ', an arcade game. Opens full screen.');
  btn.addEventListener('click', open);
  note = el('p', 'lwmm-note');
  box.appendChild(btn); box.appendChild(note);
  hero.appendChild(box);
  updateNote();
}
if (WITH_BUTTON) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addButton);
  else addButton();
}

window.LWMonster = { open: open, close: close };

/* ---------- test hook (only with ?hqtest in the address) ---------- */
var hook = { speed: 1, bot: false };
function botTick() {
  if (!hook.bot || state !== 'play' || !G || goal.on) return;
  var m = G.m, best = null, bd = 1e12, i;
  for (i = 0; i < G.tanks.length; i++) { var t = G.tanks[i]; if (!t.out && Math.abs(t.x - m.x) < 160) { aimAt(t.x, t.y - 20); return; } }
  for (i = 0; i < G.helis.length; i++) { var h = G.helis[i]; if (!h.out && Math.abs(h.x - m.x) < 120 && Math.abs(h.y - (m.y - mH())) < 120) { aimAt(h.x, h.y); return; } }
  if (G.gusto < 50 && G.table && !G.table.leave) { aimAt(G.table.x, GY - 10); return; }
  for (i = 0; i < G.blds.length; i++) { var b = G.blds[i]; if (b.fold || b.down) continue;
    for (var c = 0; c < b.cells.length; c++) { var cl = b.cells[c]; if (cl.st >= 2) continue; var d = Math.abs(cl.cx - m.x) + Math.abs(cl.cy - (m.y - mH() * 0.6)) * 0.6; if (d < bd) { bd = d; best = cl; } } }
  if (best) aimAt(best.cx, best.cy);
}
if (TEST) {
  window.__lwMonster = {
    info: function () {
      var o = { state: state, store: JSON.parse(JSON.stringify(store)), have: LAD ? LAD.have.map(function (u) { return u.id; }) : [], next: LAD && LAD.next ? LAD.next.id : null, need: LAD ? LAD.need : 0 };
      if (G) { o.money = G.money; o.gusto = G.gusto; o.reel = G.reelLeft; o.s = G.s; o.st = G.st; o.m = { x: G.m.x, y: G.m.y, st: G.m.st, on: G.m.on }; o.blds = G.blds.map(function (b) { return { x: b.x, w: b.w, top: b.top, dmg: b.dmg, need: b.need, down: b.down, fold: !!b.fold }; });
        o.dir = { x: DIR.x, y: DIR.y }; o.boxAt = G.boxAt; o.bonAt = G.bonAt; o.jayAt = G.jayAt; o.tanks = G.tanks.length; o.helis = G.helis.length; o.era = G.era.id; o.found = G.found; o.goal = goal.on; o.cam = V.cam; o.k = V.k; o.oy = V.oy; }
      return o;
    },
    start: function () { if (state === 'closed') open(); startTake(); return true; },
    skipIntro: function () { if (G && state === 'intro') G.intro = 1.59; },
    hitAll: function (n) { if (!G) return; var k2 = 0; G.blds.forEach(function (b) { if (b.fold || b.down) return; b.cells.forEach(function (cl) { if (k2 < (n || 999) && cl.st < 2 && !b.fold) { hitCell(b, cl, 2); k2++; } }); }); },
    gusto: function (v) { if (G) G.gusto = v; },
    reel: function (v) { if (G) G.reelLeft = v; },
    end: function (k) { if (G) endTake(k || 'wrap'); },
    grow: function (n) { if (G) grow(n); },
    toScreen: function (wx, wy) { var r = ui.canvas.getBoundingClientRect(); return { x: r.left + (wx - V.cam) * V.k, y: r.top + V.oy + wy * V.k }; },
    special: function () { if (G) { G.m.spCd = 0; special(); } },
    secret: function (id) { findSecret(id); },
    bot: function (on, sp) { hook.bot = !!on; hook.speed = sp || 1; },
    tap: function (wx, wy) { aimAt(wx, wy); },
    jay: function () { if (!G || !G.jayCell || G.jayCell.occ !== 'jay') return null; var r = ui.canvas.getBoundingClientRect(); return { x: r.left + (G.jayCell.cx - V.cam) * V.k, y: r.top + V.oy + G.jayCell.cy * V.k }; }
  };
}
})();
