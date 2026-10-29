/* ==========================================================
   HK's Tackle Ops HQ - Lakeside Breach v2.0
   A pop up hopping game. A small pixel operator with a fishing
   rod pushes forward to the water: lakeside banks with sandbags,
   crates and floodlights, patrol tracks with trucks rolling past,
   rivers with drifting logs and rafts, and drone sweep zones where
   a line of drones zips across. Fish along the way are bonus
   points. Original art: no real game's characters or logos.

   v2.0 adds:
   - Zones further out: reed beds (lily pads), the weir (stepping
     stones, the current carries each hop one square along), the
     ferry jetty (ferries that dock and wait) and the frozen lake
     (ice floes, and hops on ice slide one extra square).
   - A catch log of 19 real UK fish, each with a drawn card and one
     true fact. Rarer fish live further out.
   - Fishing pegs: stand on one and cast a line. The world pauses
     while the float bobs; tap Strike any time, never against a clock.
   - Kit: bucket hat, woolly hat, camo jacket, waders and a glowing
     rod, earned by distance or catches. Looks only.
   - A checkpoint buoy where each zone starts. Hopping on it ties
     off there, so a run that ends can carry on from that buoy.
   - A Lakeside map: zones reached and landmarks found, linked to
     the catch log.

   v3.0 (29 Oct 2026) adds:
   - An unlock ladder over the term (sparks counted by /data/hqgame.js):
     outfits, an otter operator, rods and lures that change the
     fishing minigame, gadgets, a life ring, a boat, and two new zones
     (Night lake, Mountain tarn). Kit HK already earned stays earned.
   - Gadgets, one charge a run and a top up at each zone: a decoy duck,
     a scout drone and a smoke bomb.
   - Weights for every catch, golden (rare) variants, a trophy wall of
     personal bests, a daily fish of the day, and six more real fish.
   - A weekly era twist: the lake changes each week of Autumn 2, with
     one silly era fish to catch that week only.
   - Secrets: Bonnie, Jay fishing badly, a heron, a lost wellie and a
     robin. Never required, never scored.
   The checkpoint buoy ties off by itself when he hops on it (the
   buoy questions and the question gate were taken out 29 Oct 2026:
   the sparks system earns the break).

   No timers, no nagging, standing still is always fine.
   Instant restart, calm messages, sound can be turned off.

   Home page:  <script src="/hk/crossy.js?v=1" data-button="1"></script>
               (adds a Play button and a one line note to .hero)
   Any page:   window.HKCrossy.open() opens the game.
   Load /data/hqgame.js first for the eras and unlocks (it copes
   without it: week 1 and the starter unlocks only).
   Saves { best, games, sound, runs, credited, far, log, marks, kit,
   seen, own, shiny, big, sec, fotd, v3 } in b5.hk.crossy.v1.
   Everything is drawn in code. ASCII only in this file.
   ========================================================== */
(function () {
'use strict';
if (window.HKCrossy) return;

var KEY = 'b5.hk.crossy.v1';
var GAME = 'Lakeside Breach';
var COLS = 9, TS = 16, LW = COLS * TS;   /* art pixels */
var SPAN = 18, XMIN = -4.5;              /* lanes wrap over this many tiles */
var HOP = 0.12;                          /* seconds per hop */
var me = document.currentScript;
var WITH_BUTTON = !!(me && me.getAttribute('data-button') && me.getAttribute('data-button') !== '0');
var TEST = /[?&]hktest(=|&|$)/.test(location.search);

/* ---------- storage ---------- */
var store = { best: 0, games: 0, sound: true, runs: 0, credited: 0, far: 0, log: {}, marks: {}, kit: {}, seen: {},
  own: {}, shiny: {}, big: {}, sec: {}, fotd: {}, v3: 0 };
function objOf(v) { return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; }
function loadStore() {
  try {
    var o = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (o && typeof o === 'object') {
      if (isFinite(o.best)) store.best = Math.max(0, Math.floor(o.best));
      if (isFinite(o.games)) store.games = Math.max(0, Math.floor(o.games));
      if (typeof o.sound === 'boolean') store.sound = o.sound;
      if (isFinite(o.runs)) store.runs = Math.max(0, Math.floor(o.runs));
      if (isFinite(o.credited)) store.credited = Math.max(0, Math.floor(o.credited));
      if (isFinite(o.far)) store.far = Math.max(0, Math.floor(o.far));
      store.log = objOf(o.log); store.marks = objOf(o.marks); store.kit = objOf(o.kit); store.seen = objOf(o.seen);
      store.own = objOf(o.own); store.shiny = objOf(o.shiny); store.big = objOf(o.big); store.sec = objOf(o.sec); store.fotd = objOf(o.fotd);
      if (isFinite(o.v3)) store.v3 = o.v3;
    }
  } catch (e) {}
}
function saveStore() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ best: store.best, games: store.games, sound: store.sound, runs: store.runs, credited: store.credited,
      far: store.far, log: store.log, marks: store.marks, kit: store.kit, seen: store.seen,
      own: store.own, shiny: store.shiny, big: store.big, sec: store.sec, fotd: store.fotd, v3: store.v3 }));
  } catch (e) {}
}
loadStore();

var GEESE = false;

/* Runs used to be earned with questions. Jay took the questions out
   (29 Oct 2026): sparks from HQ activities earn the break (/hk/break.js),
   so every run inside a break is free. */
function gated() { return !!window.HKGate; }
function takeRun() { return true; }
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

/* ---------- v2.0: zones, fish, landmarks, kit ---------- */
/* Each zone starts at a row (one hop forward is one row). Its first row
   is a pontoon with the checkpoint buoy. */
var ZONES = [
  { id: 'banks', name: 'Lakeside banks', at: 0, g: ['#6cc24c', '#64b945'], tuft: '#4f9e3c', lite: '#77cc57',
    w: ['#3a9fdb', '#379ad5', '#7cc8f0', '#5db5ea', '#2a7fb8', '#a9defa'], road: '#464953' },
  { id: 'reeds', name: 'Reed beds', at: 50, g: ['#8db650', '#84ad49'], tuft: '#5f8a2e', lite: '#9cc45c',
    w: ['#3b8f94', '#36898e', '#7cc7bd', '#5aaea6', '#2b6f74', '#a6dfd2'], road: '#4b4d50' },
  { id: 'weir', name: 'The weir', at: 110, g: ['#72b65e', '#69ac56'], tuft: '#4a8a3f', lite: '#80c26b',
    w: ['#3f9bd0', '#3a95ca', '#a9dcf4', '#7fc4ea', '#2c79ab', '#c9ecfb'], road: '#4a4e56' },
  { id: 'jetty', name: 'Ferry jetty', at: 180, g: ['#97c95a', '#8ebf53'], tuft: '#6a9a3a', lite: '#a6d468',
    w: ['#2f86c4', '#2c80bd', '#6fb9e6', '#4f9fd6', '#1f6597', '#9fd2f2'], road: '#4f4a46' },
  { id: 'frozen', name: 'Frozen lake', at: 260, g: ['#e8f1f7', '#dfeaf2'], tuft: '#b8cddd', lite: '#f6fbff',
    w: ['#6fb3d8', '#69add2', '#c8ebfa', '#a3d8f0', '#4a8fb9', '#e4f6ff'], road: '#6c7886' },
  /* v3.0: two zones further out, opened on the unlock ladder */
  { id: 'night', name: 'Night lake', at: 340, lock: 'night', g: ['#25443a', '#213f35'], tuft: '#16302a', lite: '#2f5a4c',
    w: ['#0f3a4a', '#0d3442', '#5cf2d6', '#2fb8a8', '#0a2a36', '#8affea'], road: '#2a2d36' },
  { id: 'tarn', name: 'Mountain tarn', at: 420, lock: 'tarn', g: ['#9c8aa8', '#93819f'], tuft: '#6f5f80', lite: '#ad9cba',
    w: ['#3fb6c8', '#3aafc1', '#bdf3f7', '#86dde8', '#2a8a9c', '#dffbff'], road: '#5a5e66' }
];
/* zones still locked on the ladder are skipped: the frozen lake just carries on */
var ZLOCK = { 5: 1, 6: 1 };
function zoneOf(r) { for (var i = ZONES.length - 1; i > 0; i--) if (!ZLOCK[i] && r >= ZONES[i].at) return i; return 0; }
function zoneStart(r) { for (var i = 1; i < ZONES.length; i++) if (!ZLOCK[i] && ZONES[i].at === r) return i; return 0; }

/* Real UK freshwater fish. r: 1 common, 2 uncommon, 3 rare. z: zones it lives in.
   Drawing: d body depth, c [back, side, belly, fin], and a few features. Every fact is true. */
var FISH = [
  { id: 'roach', name: 'Roach', r: 1, z: [0, 1, 4], d: 4.2, c: ['#4d6b7a', '#c9d6dc', '#f1f4f2', '#d9573b'], eye: '#d9302a',
    fact: 'Roach have bright red eyes.' },
  { id: 'perch', name: 'Perch', r: 1, z: [0, 1, 3, 4], d: 4.6, c: ['#4e6b2c', '#9fbf4a', '#f0e6b8', '#e2632f'], stripes: 1, spiky: 1,
    fact: 'Perch have dark stripes down their sides and a spiky fin on their back.' },
  { id: 'gudgeon', name: 'Gudgeon', r: 1, z: [0, 2], d: 3.2, c: ['#6b6a4a', '#b9b08a', '#ece6cf', '#9c9370'], spots: '#4a4632', barbels: 2,
    fact: 'Gudgeon have two small whiskers, called barbels, by their mouth.' },
  { id: 'minnow', name: 'Minnow', r: 1, z: [0, 2], d: 2.6, small: 1, c: ['#566b3e', '#a8b98a', '#efe3c2', '#8c9a66'], bars: 1,
    fact: 'Minnows are tiny fish that swim together in big shoals.' },
  { id: 'stickleback', name: 'Stickleback', r: 1, z: [0, 1], d: 3, small: 1, c: ['#4d6a4a', '#9fb889', '#e9573f', '#b9c9a0'], spines: 1,
    fact: 'Male three spined sticklebacks turn red and build a nest for their eggs.' },
  { id: 'rudd', name: 'Rudd', r: 1, z: [1], d: 4.4, c: ['#5a6a3c', '#d8c46a', '#f4ecc4', '#e33a2a'], upmouth: 1,
    fact: 'Rudd have an upturned mouth for feeding at the surface, and bright red fins.' },
  { id: 'bream', name: 'Bream', r: 2, z: [0, 3], d: 6, c: ['#5d5a3c', '#a99a62', '#e6dcb6', '#6d6648'],
    fact: 'Bream are deep, flat sided fish that often feed together in shoals.' },
  { id: 'tench', name: 'Tench', r: 2, z: [1], d: 4.6, c: ['#2f4a26', '#5e7d36', '#b8b366', '#2f4424'], eye: '#d9542a',
    fact: 'Tench have tiny scales, slimy skin and small red eyes. They love weedy lakes.' },
  { id: 'crucian', name: 'Crucian carp', r: 2, z: [1, 4], d: 5.6, c: ['#6a5a2a', '#c9a43e', '#f1dc96', '#8a6a2a'],
    fact: 'Crucian carp can survive in water with very little oxygen, even under ice.' },
  { id: 'chub', name: 'Chub', r: 2, z: [2], d: 4.4, c: ['#3e4a52', '#b8bcae', '#ece8d8', '#c9673a'], bighead: 1,
    fact: 'Chub eat almost anything, even berries that drop into the river.' },
  { id: 'dace', name: 'Dace', r: 2, z: [2], d: 3.4, c: ['#4f6170', '#d3dbe0', '#f6f7f4', '#c9cfc6'],
    fact: 'Dace are quick, slim fish that like clean, flowing rivers.' },
  { id: 'trout', name: 'Brown trout', r: 2, z: [2, 4], d: 4.2, c: ['#5a4a2a', '#c4a25a', '#f1e2b2', '#9a7a42'], spots: '#c22a1f', spots2: '#2a1f14',
    fact: 'Brown trout have red and black spots along their sides.' },
  { id: 'carp', name: 'Carp', r: 2, z: [3], d: 5.6, c: ['#5c4320', '#b98a3a', '#ecd49a', '#8a5a2a'], barbels: 2, scales: 1,
    fact: 'Carp can live for more than 40 years.' },
  { id: 'pike', name: 'Pike', r: 3, z: [1, 3, 4], d: 3.8, long: 1, c: ['#2f4a24', '#7a9a3e', '#e6e2b0', '#6a7a32'], pikey: 1, mottle: '#d6d68a',
    fact: 'Pike can keep perfectly still in the weeds, then dart out at speed.' },
  { id: 'barbel', name: 'Barbel', r: 3, z: [2], d: 3.8, long: 1, c: ['#5a4e2e', '#b39a5e', '#efe2bc', '#c77a3a'], barbels: 4,
    fact: 'Barbel have four whiskers to feel for food on the riverbed.' },
  { id: 'grayling', name: 'Grayling', r: 3, z: [2, 4], d: 4, c: ['#4a5560', '#b8c0c6', '#efeff0', '#8a5a8a'], sail: 1,
    fact: 'Grayling have a huge fin on their back, like a sail.' },
  { id: 'zander', name: 'Zander', r: 3, z: [3], d: 3.8, long: 1, c: ['#4a5a5c', '#a9b8b2', '#eef0e6', '#8a9a90'], stripes: 1, spiky: 1, bigeye: 1,
    fact: 'Zander have big glassy eyes that help them hunt in murky water.' },
  { id: 'eel', name: 'European eel', r: 3, z: [3], d: 2, eel: 1, c: ['#3a3a24', '#6a6a3a', '#d6cf9a', '#4a4a2c'],
    fact: 'European eels begin life in the Sargasso Sea, thousands of miles away.' },
  { id: 'charr', name: 'Arctic charr', r: 3, z: [4, 6], d: 4, c: ['#3a5260', '#8aa0aa', '#f06a3a', '#f08a5a'], spots: '#f3e7c8', finedge: 1,
    fact: 'Arctic charr have lived in a few cold UK lakes since the last Ice Age.' },
  /* v3.0: six more real UK fish, mostly for the new zones */
  { id: 'bleak', name: 'Bleak', r: 1, z: [0, 1, 3], d: 2.8, small: 1, c: ['#4f6a78', '#dfe8ee', '#f8fbfc', '#b9c4ca'],
    fact: 'Bleak are small, shiny fish that feed just under the surface.' },
  { id: 'ruffe', name: 'Ruffe', r: 1, z: [3, 5], d: 3.4, small: 1, c: ['#6a5e3a', '#b3a46a', '#ece2bc', '#8a7a4a'], spots: '#4a3f22', spiky: 1,
    fact: 'Ruffe are small, spiky cousins of the perch, and very slimy.' },
  { id: 'bullhead', name: 'Bullhead', r: 2, z: [2, 6], d: 3.2, small: 1, bighead: 1, c: ['#4a3f2a', '#8a7a52', '#d9cfa8', '#6a5a3a'], mottle: '#3a3020',
    fact: 'Bullheads hide under stones in fast, clean streams.' },
  { id: 'wels', name: 'Wels catfish', r: 3, z: [5], d: 3.6, long: 1, c: ['#2a2a2e', '#4a4a52', '#c9c4b0', '#3a3a40'], barbels: 4, mottle: '#6a6a72',
    fact: 'Wels catfish hunt at night and can grow longer than a grown up.' },
  { id: 'schelly', name: 'Schelly', r: 2, z: [6], d: 3.8, c: ['#5a7080', '#c4d0d8', '#f2f4f5', '#9aa8b2'],
    fact: 'Schelly are whitefish that live in just a few deep lakes in the Lake District.' },
  { id: 'vendace', name: 'Vendace', r: 3, z: [6], d: 3.2, c: ['#4a6a82', '#cfdde8', '#f6f8fa', '#a9b8c4'],
    fact: 'Vendace are one of the rarest fish in Britain, living in only a few cold lakes.' }
];
/* night lake and the tarn share some fish with the zones before them */
(function () {
  var add = { roach: [5], bream: [5], tench: [5], eel: [5], zander: [5], minnow: [6], perch: [6], trout: [6] };
  FISH.forEach(function (f) { if (add[f.id]) f.z = f.z.concat(add[f.id]); });
})();
/* weights in ounces: [smallest, biggest] (16 oz to a pound) */
var WT = { roach: [3, 32], perch: [3, 48], gudgeon: [1, 3], minnow: [0.1, 0.4], stickleback: [0.05, 0.2], rudd: [3, 32], bream: [16, 160],
  tench: [16, 128], crucian: [5, 48], chub: [8, 96], dace: [2, 12], trout: [8, 96], carp: [48, 480], pike: [48, 400], barbel: [32, 224],
  grayling: [5, 48], zander: [16, 192], eel: [8, 80], charr: [5, 32], bleak: [0.5, 3], ruffe: [0.5, 3], bullhead: [0.3, 1.5],
  wels: [160, 960], schelly: [4, 16], vendace: [2, 8] };
/* one silly era fish a week, catchable that week only */
var ERAFISH = [
  { id: 'e_stone', era: 'stone', name: 'Pebblefin', r: 4, d: 4.4, c: ['#6e6a64', '#9a958c', '#c4beb2', '#7d776e'], hat: 'stone', wt: [60, 240],
    fact: 'Basically a rock with fins. Surprisingly good at swimming, for a rock.' },
  { id: 'e_egypt', era: 'egypt', name: 'Pharaoh fish', r: 4, d: 4.4, c: ['#1f5fa8', '#e2b84a', '#f6e2a0', '#1f5fa8'], hat: 'egypt', wt: [20, 120],
    fact: 'Rules the whole Nile. Expects a bow. A small nod is fine.' },
  { id: 'e_rome', era: 'rome', name: 'Centurion fish', r: 4, d: 4.4, c: ['#7a5a3a', '#c98a5a', '#f0d8b8', '#b3263a'], hat: 'rome', wt: [20, 120],
    fact: 'Only swims in straight lines. Complains about the rain.' },
  { id: 'e_viking', era: 'viking', name: 'Bjorn the fish', r: 4, d: 4.6, c: ['#3a5a7a', '#8fa6b8', '#e0e6ea', '#d9a441'], hat: 'viking', wt: [30, 160],
    fact: 'Sings very loudly. Mostly about boats.' },
  { id: 'e_victorian', era: 'victorian', name: 'Sir Fishington', r: 4, d: 4.4, c: ['#3a3a44', '#8a8a96', '#d8d4cc', '#6a6a76'], hat: 'victorian', wt: [20, 120],
    fact: 'Wears a top hat at all times. Even underwater. Especially underwater.' },
  { id: 'e_eighties', era: 'eighties', name: 'Rad fish', r: 4, d: 4.2, c: ['#ff4fa3', '#2de2e6', '#fff4fb', '#ffd23f'], hat: 'eighties', wt: [10, 80],
    fact: 'Totally rad. Owns one cassette, and it is whale songs.' },
  { id: 'e_future', era: 'future', name: 'Robofish 3026', r: 4, d: 4.2, c: ['#5a6a7a', '#b8c8d8', '#e9f6ff', '#7cf5c9'], hat: 'future', wt: [30, 150],
    fact: 'Runs on batteries and festive cheer. Beeps carols.' }
];
var REALN = FISH.length;
var FISHBY = {};
FISH.forEach(function (f) { FISHBY[f.id] = f; });
ERAFISH.forEach(function (f) { FISHBY[f.id] = f; f.z = []; });
var RARITY = ['', 'Common', 'Uncommon', 'Rare', 'This week only'];
function kinds() { var n = 0; for (var k in store.log) if (FISHBY[k] && !FISHBY[k].era && store.log[k] > 0) n++; return n; }
/* peg: from a peg; boat: from the dinghy; fly: the feather fly lure */
function pickFish(z, peg, boat, fly) {
  var ef = eraFish();
  if (ef && Math.random() < (peg ? (boat ? 0.3 : 0.22) : 0.06)) return ef;
  var list = FISH.filter(function (f) { return f.z.indexOf(z) >= 0; }), tot = 0, w = [];
  var rare = (peg ? 2.4 : 0.9) * (boat ? 1.6 : 1) * (fly ? 2.2 : 1);
  list.forEach(function (f, i) { w[i] = f.r === 1 ? 10 : f.r === 2 ? (peg ? 6 : 4) * (fly ? 1.4 : 1) : rare; tot += w[i]; });
  var x = Math.random() * tot;
  for (var i = 0; i < list.length; i++) { x -= w[i]; if (x <= 0) return list[i]; }
  return list[0];
}
/* a weight in ounces; bigger from a peg or the boat */
function rollWeight(f, peg, boat) {
  var r = f.wt || WT[f.id] || [2, 20], p = boat ? 1.25 : peg ? 1.6 : 2.4;
  var w = r[0] + (r[1] - r[0]) * Math.pow(Math.random(), p);
  return w < 1 ? Math.round(w * 10) / 10 : Math.round(w);
}
function wtText(oz) {
  if (!(oz > 0)) return '';
  if (oz < 1) return 'a tiddler, under 1 oz';
  var lb = Math.floor(oz / 16), o = Math.round(oz - lb * 16);
  if (o === 16) { lb++; o = 0; }
  return lb ? lb + ' lb' + (o ? ' ' + o + ' oz' : '') : o + ' oz';
}
/* adds a fish to the log; returns { isNew, pb, oz, gold } */
function logFish(f, peg, boat, goldRoll) {
  var out = { isNew: !(store.log[f.id] > 0), oz: rollWeight(f, peg, boat), gold: !f.era && goldRoll };
  store.log[f.id] = (store.log[f.id] || 0) + 1;
  out.pb = !(store.big[f.id] >= out.oz);
  if (out.pb) store.big[f.id] = out.oz;
  if (out.gold) store.shiny[f.id] = (store.shiny[f.id] || 0) + 1;
  if (G) G.runFish.push(f.id);
  saveStore();
  return out;
}
function goldChance(peg) { return (wearing('rod') === 'golden' ? 1 / 7 : 1 / 22) * (peg ? 1 : 0.5); }
/* fish of the day: one real fish a day from the zones reached so far */
function todayKey() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
function fishOfDay() {
  var fz = zoneOf(store.far), d = new Date();
  var pool = FISH.filter(function (f) { return f.z.some(function (z) { return z <= fz && !ZLOCK[z]; }); });
  if (!pool.length) pool = FISH;
  return pool[hash(d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate(), 77) % pool.length];
}

/* Landmarks light up on the map the first time a run passes them. */
var MARKS = [
  { id: 'boathouse', name: 'Old boathouse', at: 14 }, { id: 'baithut', name: 'Bait hut', at: 34 },
  { id: 'heron', name: 'Heron post', at: 66 }, { id: 'hide', name: 'Bird hide', at: 92 },
  { id: 'pylon', name: 'Pylon', at: 124 }, { id: 'mill', name: 'Mill wheel', at: 152 },
  { id: 'ticket', name: 'Ticket hut', at: 194 }, { id: 'lifeboat', name: 'Lifeboat shed', at: 228 },
  { id: 'icehut', name: 'Ice fishing hut', at: 276 }, { id: 'cairn', name: 'Stone cairn', at: 312 },
  { id: 'lantern', name: 'Lantern jetty', at: 356, z: 5 }, { id: 'owl', name: 'Owl tree', at: 392, z: 5 },
  { id: 'bothy', name: 'Bothy', at: 436, z: 6 }, { id: 'summit', name: 'Summit flag', at: 472, z: 6 }
];

/* ---------- v3.0: the unlock ladder ----------
   Sparks count from the first time HK opens v3.0 (see /data/hqgame.js),
   so the term builds steadily. at: sparks needed. Kit HK earned in v2.0
   stays his (store.own), so nothing goes backwards. */
var LADDER = [
  { id: 'op', slot: 'char', name: 'Operator', at: 0 },
  { id: 'helmet', slot: 'hat', name: 'Ops helmet', at: 0 },
  { id: 'tan', slot: 'body', name: 'Field jacket', at: 0 },
  { id: 'boots', slot: 'legs', name: 'Boots', at: 0 },
  { id: 'wood', slot: 'rod', name: 'Wooden rod', at: 0 },
  { id: 'float', slot: 'lure', name: 'Classic float', at: 0 },
  { id: 'duck', slot: 'gadget', name: 'Decoy duck', at: 0, fx: 'Traffic stops for it.' },
  { id: 'bucket', slot: 'hat', name: 'Bucket hat', at: 100 },
  { id: 'drone', slot: 'gadget', name: 'Scout drone', at: 200, fx: 'Flies ahead and grabs fish.' },
  { id: 'spinner', slot: 'lure', name: 'Spinner', at: 300, fx: 'Two green zones.' },
  { id: 'camo', slot: 'body', name: 'Camo jacket', at: 400 },
  { id: 'smoke', slot: 'gadget', name: 'Smoke bomb', at: 500, fx: 'Patrol drones lose track of you.' },
  { id: 'glow', slot: 'rod', name: 'Glowing rod', at: 650, fx: 'Wider green zone.' },
  { id: 'otter', slot: 'char', name: 'Otter operator', at: 800 },
  { id: 'boat', slot: 'extra', name: 'Dinghy', at: 950, fx: 'Boat trips to any zone. Bigger fish at pegs.' },
  { id: 'night', slot: 'zone', name: 'Night lake', at: 1100, fx: 'A new zone past the frozen lake.' },
  { id: 'waders', slot: 'legs', name: 'Waders', at: 1300 },
  { id: 'ring', slot: 'extra', name: 'Life ring', at: 1500, fx: 'One splash rescue a run.' },
  { id: 'woolly', slot: 'hat', name: 'Woolly hat', at: 1800 },
  { id: 'fly', slot: 'lure', name: 'Feather fly', at: 2200, fx: 'Rare fish bite more.' },
  { id: 'tarn', slot: 'zone', name: 'Mountain tarn', at: 2700, fx: 'The furthest zone of all.' },
  { id: 'carbon', slot: 'rod', name: 'Carbon rod', at: 3100, fx: 'Slower marker.' },
  { id: 'golden', slot: 'rod', name: 'Golden rod', at: 3500, fx: 'Golden fish bite more.' },
  { id: 'ghillie', slot: 'body', name: 'Ghillie suit', at: 4000 }
];
var LBY = {};
LADDER.forEach(function (it) { LBY[it.id] = it; });
var SLOTS = [['char', 'Operator'], ['hat', 'Hat'], ['body', 'Jacket'], ['legs', 'Legs'], ['rod', 'Rod'], ['lure', 'Lure']];
var GADGETS = ['duck', 'drone', 'smoke'];
var LAD = { have: [], next: null, need: 0, sparks: 0 }, HAVE = {};
function readLadder() {
  var H = window.HQGame, i;
  try { LAD = H && H.ladder ? H.ladder('b5.hk.', LADDER) : null; } catch (e) { LAD = null; }
  if (!LAD) {
    var have = LADDER.filter(function (it) { return !it.at; }), nx = null;
    for (i = 0; i < LADDER.length; i++) if (LADDER[i].at && (!nx || LADDER[i].at < nx.at)) nx = LADDER[i];
    LAD = { have: have, next: nx, need: nx ? nx.at : 0, sparks: 0 };
  }
  HAVE = {};
  LAD.have.forEach(function (it) { HAVE[it.id] = 1; });
  for (var k in store.own) if (store.own[k] && LBY[k]) HAVE[k] = 1;
  /* the next one to show is the cheapest one not already owned */
  var nx2 = null;
  for (i = 0; i < LADDER.length; i++) if (!HAVE[LADDER[i].id] && (!nx2 || LADDER[i].at < nx2.at)) nx2 = LADDER[i];
  LAD.next = nx2; LAD.need = nx2 ? Math.max(1, nx2.at - (LAD.sparks || 0)) : 0;
  ZLOCK = {};
  ZONES.forEach(function (z, zi) { if (z.lock && !HAVE[z.lock]) ZLOCK[zi] = 1; });
}
function has(id) { return !!HAVE[id]; }
/* v2.0 kit already earned (by distance or catches) is kept for good */
function migrate() {
  if (store.v3) return;
  var k = kinds(), f = store.far;
  if (f >= 50) store.own.bucket = 1;
  if (f >= 110) store.own.camo = 1;
  if (f >= 260) store.own.woolly = 1;
  if (k >= 5) store.own.waders = 1;
  if (k >= 10) store.own.glow = 1;
  for (var id in store.own) store.seen['u_' + id] = 1;
  store.v3 = 1;
  saveStore();
}
function wearing(slot) {
  var id = store.kit[slot];
  if (id && LBY[id] && LBY[id].slot === slot && has(id)) return id;
  for (var i = 0; i < LADDER.length; i++) if (LADDER[i].slot === slot && !LADDER[i].at) return LADDER[i].id;
  return '';
}
/* unlocks not celebrated yet: returns the items, and remembers them */
function freshUnlocks() {
  var out = [];
  LADDER.forEach(function (it) { if (it.at && has(it.id) && !store.seen['u_' + it.id]) { store.seen['u_' + it.id] = 1; out.push(it); } });
  if (out.length) saveStore();
  return out;
}

/* ---------- v3.0: this week's era ---------- */
var ERA = { n: 1, id: 'stone', name: 'Stone Age', line: 'Everything is made of rock. Even the bad ideas.' };
var ERARULE = {
  stone: 'This week: mammoths on the roads. Slow, but very long.',
  egypt: 'This week: the Nile. The crocodiles are very polite. You can ride them.',
  rome: 'This week: straight Roman roads. All the traffic goes the same way.',
  viking: 'This week: longships on the water. Ride one. The crew sings.',
  victorian: 'This week: moustaches for everyone. Steam boats too.',
  eighties: 'This week: every hop plays the next note of a tune.',
  future: 'This week: hover lake, floaty hops, snow and tinsel.'
};
function readEra() {
  var H = window.HQGame;
  try { if (H && H.era) ERA = H.era() || ERA; } catch (e) {}
}
function eraFish() { for (var i = 0; i < ERAFISH.length; i++) if (ERAFISH[i].era === ERA.id) return ERAFISH[i]; return null; }

/* ---------- v3.0: secrets (never required, never scored) ---------- */
var SECRETS = [
  { id: 'bonnie', name: 'Bonnie on the bank', hint: 'Someone small and brown trots along the bank now and then.' },
  { id: 'jay', name: 'Jay, fishing badly', hint: 'Somebody with big eyebrows is having a rough day at a peg.' },
  { id: 'heron', name: 'The heron heist', hint: 'Keep fishing at the pegs. Someone is watching.' },
  { id: 'wellie', name: 'The lost wellie', hint: 'Not everything on the end of a line is a fish.' },
  { id: 'robin', name: 'Robin friend', hint: 'Stand very still by a tree. Be patient.' }
];
function secretsFound() { var n = 0; SECRETS.forEach(function (s) { if (store.sec[s.id]) n++; }); return n; }
var SAYINGS = ['My ears are not a toilet.', 'Unhand me, goblin.', 'When I was in China....', 'Outrageous.', 'In the wise words of my late, great grandfather, stop.'];


/* ---------- sprites ---------- */
var DINO = [
  '..hHHHHh.....R',
  '.hHHHHHHh...R.',
  '.HHVWKVVH...R.',
  '.hSSSSSSh..R..',
  '..SSggSS...R..',
  '.OTTTTTTO.R...',
  'OTTtTTtTTSS...',
  'OTTTTTTTT.....',
  '.TTtTTtTT.....',
  '.TTTTTTTT.....',
  '..tt..tt......',
  '..tt..tt......',
  '..BB..BB......',
  '.BBB..BBB.....'
];
var DPAL = { H: '#5b6b3a', h: '#3f4a28', V: '#5cf2ff', S: '#e2b48f', g: '#c08d69', T: '#c8b27a', t: '#9a8656', O: '#ff7a1a', B: '#1d1f24', R: '#8b5a2b', W: '#ffffff', K: '#15281c' };
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
/* the operator in a given set of kit: rows and palette */
function kitLook(k) {
  var rows = DINO.slice(), pal = {}, c;
  for (c in DPAL) pal[c] = DPAL[c];
  function put(j, i, ch) { rows[j] = rows[j].substr(0, i) + ch + rows[j].substr(i + 1); }
  function face() {
    rows[2] = rows[2].replace(/[HV]/g, 'S');
    rows[3] = rows[3].replace(/h/g, 'S');
  }
  if (k.hat === 'bucket') {
    pal.H = '#b9a46a'; pal.h = '#8c7a48';
    rows[1] = 'hHHHHHHHHh..R.';
    face();
  } else if (k.hat === 'woolly') {
    pal.H = '#d94a3a'; pal.h = '#a8322a'; pal.Q = '#fff6dc';
    rows[0] = '..HQHQHH.....R';
    rows[1] = '.hhhhhhhh...R.';
    face();
  }
  if (k.body === 'camo') {
    pal.T = '#6b7d45'; pal.t = '#3a4526'; pal.O = '#7a5a34';
    put(7, 2, 't'); put(7, 6, 't'); put(9, 4, 't'); put(6, 5, 'O');
  }
  if (k.legs === 'waders') {
    pal.D = '#2f5a3a'; pal.d = '#1f3a26';
    for (var j = 8; j < 14; j++) rows[j] = rows[j].replace(/[Tt]/g, 'D').replace(/B/g, 'd');
    put(6, 2, 'D'); put(6, 7, 'D'); put(7, 2, 'D'); put(7, 7, 'D');
  }
  if (k.body === 'ghillie') {
    pal.T = '#5f7a34'; pal.t = '#3d5222'; pal.O = '#8a9a4a'; pal.L = '#7fa040';
    put(5, 0, 'L'); put(6, 0, 'L'); put(8, 9, 'L'); put(7, 4, 'L'); put(9, 2, 'O'); put(5, 8, 'L'); put(10, 1, 'L');
  }
  if (k.rod === 'glow') { pal.R = '#5cf2ff'; pal.Y = '#fff7a8'; put(0, 13, 'Y'); }
  else if (k.rod === 'carbon') { pal.R = '#2b3036'; pal.Y = '#ff7a1a'; put(0, 13, 'Y'); }
  else if (k.rod === 'golden') { pal.R = '#ffd23f'; pal.Y = '#fff7a8'; put(0, 13, 'Y'); }
  if (k.char === 'otter') {
    /* a river otter in the same kit: brown fur, pale muzzle, little ears and a tail */
    pal.S = '#8a5a34'; pal.g = '#d9b48a'; pal.F = '#6b4220';
    put(4, 6, 'g'); put(4, 7, 'K'); put(3, 7, 'g');
    put(1, 0, 'F'); put(1, 9, 'F');
    put(9, 0, 'F'); put(10, 0, 'F'); put(11, 0, 'F'); put(11, 1, 'F');
  }
  if (ERA.id === 'victorian') { pal.M = '#3a2414'; put(4, 2, 'M'); put(4, 3, 'M'); put(3, 4, 'M'); put(3, 5, 'M'); put(4, 6, 'M'); put(4, 7, 'M'); }
  if (ERA.id === 'viking' && k.hat === 'helmet') { pal.Q = '#f3ead2'; put(0, 1, 'Q'); put(1, 0, 'Q'); put(0, 8, 'Q'); put(1, 9, 'Q'); }
  if (ERA.id === 'future') { pal.Z = '#7cf5c9'; pal.z = '#ff5fa2'; put(5, 1, 'Z'); put(5, 3, 'z'); put(5, 5, 'Z'); put(5, 7, 'z'); }
  return { rows: rows, pal: pal };
}
function curKit() { return { char: wearing('char'), hat: wearing('hat'), body: wearing('body'), legs: wearing('legs'), rod: wearing('rod') }; }
var SPR = null, SPRK = '';
function spriteSet(k) {
  var L = kitLook(k);
  return { r: sprite(L.rows, L.pal, false), l: sprite(L.rows, L.pal, true), rb: sprite(L.rows, L.pal, false, true), lb: sprite(L.rows, L.pal, true, true) };
}
function sprites() {
  var k = curKit(), key = k.char + k.hat + k.body + k.legs + k.rod + ERA.id;
  if (!SPR || key !== SPRK) { SPR = spriteSet(k); SPRK = key; }
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
'background:radial-gradient(120% 70% at 50% 0%,rgba(88,242,165,.16),transparent 60%),radial-gradient(90% 60% at 50% 110%,rgba(255,122,26,.16),transparent 60%),var(--night,#0b1622);' +
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
'.hkg-hint{position:absolute;left:50%;bottom:68px;z-index:2;transform:translateX(-50%);width:max-content;max-width:92%;padding:8px 14px;border-radius:12px;background:rgba(10,22,14,.78);color:#fff;font-size:.9rem;line-height:1.3;text-align:center;pointer-events:none;transition:opacity .5s}' +
'.hkg-hint.gone{opacity:0}' +
'.hkg-toast{position:absolute;left:50%;top:64px;z-index:3;transform:translateX(-50%);padding:6px 14px;border-radius:999px;background:#ffd76e;color:#1b1206;font-family:var(--display,"Arial Black",system-ui,sans-serif);font-weight:900;font-size:1rem;pointer-events:none;opacity:0;transition:opacity .35s}' +
'.hkg-toast.on{opacity:1}' +
'.hkg-card{position:absolute;left:50%;top:50%;z-index:4;transform:translate(-50%,-50%);width:min(88%,330px);padding:18px 18px 14px;border-radius:22px;background:#fffaf0;color:#15281c;text-align:center;border:4px solid #15281c;box-shadow:0 8px 0 rgba(0,0,0,.35),0 20px 50px rgba(0,0,0,.35)}' +
'.hkg-card[hidden]{display:none}' +
'.hkg-card{max-height:calc(100% - 16px);overflow:auto;overscroll-behavior:contain}' +
'.hkg-card p.hkg-tip+.hkg-go,.hkg-card .hkg-nums+.hkg-go{margin-top:12px}' +
'.hkg-card canvas{width:56px;height:56px;image-rendering:pixelated;display:block;margin:0 auto 4px}' +
'.hkg-card h2{margin:0;font-family:var(--display,"Arial Black",system-ui,sans-serif);font-weight:900;font-size:2rem;line-height:1.05;letter-spacing:-.01em}' +
'.hkg-card p{margin:6px 0 0;font-size:1rem;line-height:1.4}' +
'.hkg-badge{display:inline-block;margin:0 0 8px;padding:4px 12px;border-radius:999px;background:#ffd76e;border:2px solid #15281c;font-family:var(--display,"Arial Black",system-ui,sans-serif);font-weight:900;font-size:.95rem}' +
'.hkg-pop{animation:hkgpop .55s cubic-bezier(.2,1.6,.4,1) both}' +
'@keyframes hkgpop{0%{transform:scale(.4) rotate(-8deg)}100%{transform:scale(1) rotate(-3deg)}}' +
'.hkg-nums{display:flex;justify-content:center;gap:12px;margin:12px 0 14px}' +
'.hkg-nums div{min-width:92px;padding:6px 10px;border-radius:14px;background:#eef2f6;border:2px solid #c9d3dd}' +
'.hkg-nums span{display:block;font-size:.8rem;font-weight:700;color:#3d5b47}' +
'.hkg-nums b{display:block;font-family:var(--display,"Arial Black",system-ui,sans-serif);font-size:1.7rem;line-height:1.1}' +
'.hkg-go{display:block;width:100%;min-height:58px;border-radius:16px;border:3px solid #15281c;background:#ff7a1a;color:#1b1206;font-weight:900;font-size:1.45rem;box-shadow:0 5px 0 #15281c}' +
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
'.hkg-pad .hkg-up{background:#ff7a1a;color:#1b1206;border-color:#b3500c;width:84px}' +
'@media (max-height:560px){.hkg-pad button{height:44px}.hkg-bar{padding:6px 12px}.hkg-tb,.hkg-x{min-height:40px}}' +
'@media (max-width:440px){.hkg-tb{padding:8px 10px;font-size:.85rem}.hkg-title span{display:none}}' +
'@media (prefers-reduced-motion:reduce){.hkg-pop{animation:none;transform:rotate(-3deg)}.hkg-hint,.hkg-toast{transition:none}}' +
/* v2.0: cast button, meter, menus, log, kit, map */
'.hkg-cast{position:absolute;left:50%;bottom:70px;z-index:3;transform:translateX(-50%);min-height:52px;padding:8px 20px;border-radius:16px;border:3px solid #15281c;background:#ffd76e;color:#1b1206;font-weight:900;font-size:1.15rem;box-shadow:0 5px 0 #15281c;white-space:nowrap}' +
'.hkg-cast[hidden]{display:none}.hkg-cast:active{transform:translate(-50%,3px);box-shadow:0 2px 0 #15281c}' +
'.hkg-zone{display:block;font-size:.78rem;font-weight:800;color:#d8f5ff;min-height:1em}' +
'.hkg-row3{display:flex;gap:8px;margin-top:10px}.hkg-row3 button{flex:1;min-height:44px;padding:6px 4px;border-radius:14px;border:2px solid #15281c;background:#eef6e4;color:#15281c;font-weight:800;font-size:.92rem}' +
'.hkg-row3 button:hover{background:#ffd76e}' +
'.hkg-meter{position:relative;height:46px;margin:12px 0 4px;border-radius:14px;border:3px solid #15281c;background:linear-gradient(#bfe6fa,#7cc8f0);overflow:hidden;cursor:pointer;touch-action:manipulation}' +
'.hkg-meter .z{position:absolute;top:0;bottom:0;background:rgba(92,207,82,.85);border-left:2px solid #2f7a2a;border-right:2px solid #2f7a2a}' +
'.hkg-meter .m{position:absolute;top:-2px;bottom:-2px;width:8px;margin-left:-4px;border-radius:4px;background:#ff7a1a;border:2px solid #15281c}' +
'.hkg-card canvas.hkg-float{display:block;margin:4px auto 0;width:144px;height:48px;image-rendering:pixelated}' +
'.hkg-card canvas.hkg-fishbig{display:block;margin:6px auto 2px;width:192px;height:96px;image-rendering:pixelated;background:#e6f4fb;border-radius:14px;border:2px solid #c9dde8}' +
'.hkg-rar{display:inline-block;padding:2px 10px;border-radius:999px;font-size:.8rem;font-weight:800;background:#eef2f6;border:2px solid #c9d3dd}.hkg-rar.r3{background:#ffe9a8;border-color:#d8b545}' +
'.hkg-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}' +
'.hkg-grid button{min-height:86px;padding:6px 4px;border-radius:14px;border:2px solid #15281c;background:#fff;color:#15281c;font-weight:800;font-size:.8rem;line-height:1.15;text-align:center}' +
'.hkg-grid button.off{background:#e9eef2;color:#5a6a76;border-style:dashed}' +
'.hkg-card .hkg-grid canvas{width:64px;height:32px;margin-bottom:4px}' +
'.hkg-kitp{display:flex;justify-content:center;margin:4px 0 6px}.hkg-card .hkg-kitp canvas{width:84px;height:84px;background:#e6f4fb;border-radius:16px;border:2px solid #c9dde8;padding:6px}' +
'.hkg-slot{margin-top:10px}.hkg-slot h3{margin:0 0 6px;font-size:.95rem}' +
'.hkg-slot div{display:flex;gap:8px;flex-wrap:wrap}' +
'.hkg-slot button{display:flex;align-items:center;gap:6px;min-height:46px;padding:4px 10px 4px 4px;border-radius:12px;border:2px solid #15281c;background:#fff;color:#15281c;font-weight:800;font-size:.88rem;text-align:left}' +
'.hkg-slot button canvas{width:36px !important;height:36px !important;margin:0 !important;background:#e6f4fb;border-radius:8px}' +
'.hkg-slot button.on{background:#5ccf52}.hkg-slot button:disabled{opacity:.6;cursor:default;border-style:dashed}' +
'.hkg-slot small{display:block;font-weight:700;font-size:.74rem;color:#4d5f55}' +
'.hkg-map svg{display:block;width:100%;height:auto;margin-top:8px;border-radius:14px;border:2px solid #15281c}' +
'.hkg-tag{display:inline-block;margin:2px 4px 0 0;padding:2px 9px;border-radius:999px;background:#eef6e4;border:2px solid #9bb59a;font-size:.8rem;font-weight:800}' +
/* v3.0: era banner, gadgets, unlocks, trophies, secrets */
'.hkg-era{position:absolute;left:50%;top:50%;z-index:3;transform:translate(-50%,-50%) rotate(-2deg);width:min(86%,320px);padding:12px 16px 14px;border-radius:18px 24px 16px 22px;background:#fffaf0;color:#15281c;border:4px solid #15281c;text-align:center;box-shadow:0 7px 0 rgba(0,0,0,.35);pointer-events:none;transition:opacity .6s}' +
'.hkg-era.gone{opacity:0}.hkg-era small{display:block;font-weight:800;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:#1f6f99}' +
'.hkg-era b{display:block;font-family:var(--display,"Arial Black",system-ui,sans-serif);font-size:1.5rem;line-height:1.1;margin:2px 0 4px}' +
'.hkg-era span{display:block;font-size:.92rem;line-height:1.3}.hkg-era i{display:block;margin-top:6px;font-style:normal;font-size:.82rem;font-weight:800;color:#8a5a14}' +
'.hkg-gads{position:absolute;right:8px;bottom:10px;z-index:3;display:flex;gap:8px}' +
'.hkg-gad{position:relative;width:48px;height:48px;padding:0;border-radius:16px;border:3px solid #15281c;background:#fffaf0;box-shadow:0 4px 0 #15281c;display:flex;align-items:center;justify-content:center}' +
'.hkg-gad canvas{width:32px;height:32px;image-rendering:pixelated}' +
'.hkg-gad b{position:absolute;right:-6px;top:-6px;min-width:22px;height:22px;padding:0 5px;border-radius:99px;background:#ffd76e;border:2px solid #15281c;color:#15281c;font-size:.8rem;line-height:18px;text-align:center}' +
'.hkg-gad:disabled{opacity:.45;box-shadow:none}.hkg-gad:active{transform:translateY(3px);box-shadow:0 1px 0 #15281c}' +
'.hkg-gad[hidden]{display:none}' +
'.hkg-row3.r2{margin-top:8px}' +
'.hkg-ugrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}' +
'.hkg-u{position:relative;min-height:96px;padding:6px 4px;border-radius:14px 18px 12px 16px;border:2px solid #15281c;background:#fff;color:#15281c;font-weight:800;font-size:.78rem;line-height:1.15;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:3px}' +
'.hkg-card .hkg-u canvas{width:48px;height:48px;margin:0;image-rendering:pixelated}' +
'.hkg-u.off{background:#e9eef2;color:#5a6a76;border-style:dashed}.hkg-u.nx{background:#fff3c4;border-style:solid;border-color:#c48a14}' +
'.hkg-u small{display:block;font-weight:700;font-size:.7rem;color:#5a6a76}.hkg-u.nx small{color:#8a5a14}' +
'.hkg-u em{font-style:normal;font-weight:700;font-size:.68rem;color:#3d5b47}' +
'.hkg-new{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:10px 0 4px}' +
'.hkg-new div{width:96px;padding:6px;border-radius:14px;background:#fff3c4;border:2px solid #15281c;font-weight:800;font-size:.8rem}' +
'.hkg-card .hkg-new canvas{width:56px;height:56px;margin:0 auto}' +
'.hkg-tw{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:10px}' +
'.hkg-tw div{padding:6px;border-radius:12px;background:linear-gradient(#7a5230,#5b3a1c);border:3px solid #3a2410;color:#fff3c4;text-align:center;font-weight:800;font-size:.8rem;line-height:1.2}' +
'.hkg-card .hkg-tw canvas{width:96px;height:48px;margin:0 auto 2px;background:#e6f4fb;border-radius:8px;border:2px solid #c9a06a}' +
'.hkg-tw div.off{background:#e9eef2;border:2px dashed #9aa8b2;color:#5a6a76}.hkg-tw div.off canvas{background:#d9e0e6;border-color:#c3cbd0}' +
'.hkg-tw b{display:block;font-size:.95rem;color:#ffd76e}.hkg-tw div.off b{color:#5a6a76}' +
'.hkg-sec{display:flex;align-items:center;gap:10px;margin-top:8px;padding:8px;border-radius:14px;background:#fff;border:2px solid #15281c}' +
'.hkg-sec.off{background:#e9eef2;border-style:dashed;color:#5a6a76}' +
'.hkg-card .hkg-sec canvas{width:48px;height:48px;margin:0;flex:none;image-rendering:pixelated;background:#e6f4fb;border-radius:10px}' +
'.hkg-sec p{margin:0 !important;font-size:.88rem !important;line-height:1.3}' +
'.hkg-fotd{display:flex;align-items:center;gap:8px;margin:8px 0 0;padding:6px 10px;border-radius:12px;background:#fff3c4;border:2px solid #c48a14;font-size:.86rem;font-weight:700;text-align:left}' +
'.hkg-card .hkg-fotd canvas{width:48px;height:24px;margin:0;flex:none}' +
'.hkg-boat{display:grid;gap:8px;margin-top:10px}.hkg-boat button{min-height:48px;border-radius:14px;border:3px solid #15281c;background:#fff;color:#15281c;font-weight:800;font-size:1rem;box-shadow:0 3px 0 #15281c}' +
'.hkg-boat button:disabled{opacity:.5;border-style:dashed;box-shadow:none}' +
'.hkg-bubble{position:absolute;z-index:3;max-width:70%;padding:6px 11px;border-radius:14px;background:#fffaf0;color:#15281c;border:3px solid #15281c;font-weight:800;font-size:.9rem;line-height:1.25;pointer-events:none;transform:translate(-50%,-100%);opacity:0;transition:opacity .3s}' +
'.hkg-bubble.on{opacity:1}' +
'@media (prefers-reduced-motion:reduce){.hkg-era,.hkg-bubble{transition:none}}' +
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
  if (n === 'hop' && ERA.id === 'eighties' && G) {
    /* the 80s: every hop is the next note of a little synth tune */
    var tune = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1047, 988, 784, 659, 587];
    tone(tune[G.noteI++ % tune.length], 0, 0.11, 'square', 0.035);
    return;
  }
  if (n === 'hop') {
    var z = G ? G.zone : 0;
    if (z === 5) { tone(660, 880, 0.07, 'sine', 0.04); return; }
    if (z === 6) { tone(300, 260, 0.06, 'triangle', 0.08); return; }
    if (z === 1) { tone(400, 580, 0.06, 'square', 0.03); hiss(0.08, 3200, 1400, 0.05); }
    else if (z === 2) tone(470, 720, 0.07, 'triangle', 0.06);
    else if (z === 3) { tone(230, 180, 0.06, 'triangle', 0.09); tone(460, 0, 0.03, 'square', 0.02); }
    else if (z === 4) tone(1180, 1560, 0.06, 'sine', 0.05);
    else tone(430, 660, 0.06, 'square', 0.035);
  }
  else if (n === 'slide') hiss(0.22, 5200, 1600, 0.1);
  else if (n === 'cast') { hiss(0.3, 1800, 5200, 0.12); tone(300, 210, 0.08, 'triangle', 0.06, 0.32); }
  else if (n === 'miss') tone(420, 300, 0.18, 'sine', 0.06);
  else if (n === 'catch') { [587, 740, 880, 1175].forEach(function (f, i) { tone(f, 0, 0.14, 'triangle', 0.07, i * 0.08); }); }
  else if (n === 'toot') { tone(196, 194, 0.45, 'sawtooth', 0.03 * v); tone(247, 245, 0.45, 'sawtooth', 0.025 * v); }
  else if (n === 'buoy') { tone(660, 0, 0.2, 'sine', 0.08); tone(990, 0, 0.3, 'sine', 0.06, 0.12); }
  else if (n === 'zone') {
    var zz = G ? G.zone : 0;
    [[392, 523, 659], [330, 392, 523], [440, 554, 659], [392, 494, 587], [659, 784, 988], [440, 523, 659], [349, 440, 523]][zz].forEach(function (f, i) { tone(f, 0, 0.2, 'triangle', 0.06, i * 0.12); });
    if (zz === 1) { tone(140, 110, 0.12, 'square', 0.05, 0.45); tone(150, 115, 0.12, 'square', 0.05, 0.62); }
    else if (zz === 2) hiss(1.4, 900, 400, 0.18, 0.4, 0.3);
    else if (zz === 3) { tone(196, 194, 0.6, 'sawtooth', 0.03, 0.45); tone(247, 245, 0.6, 'sawtooth', 0.025, 0.45); }
    else if (zz === 4) { hiss(1.6, 2400, 700, 0.12, 0.6, 0.3); tone(2093, 0, 0.12, 'sine', 0.04, 0.6); tone(2637, 0, 0.14, 'sine', 0.035, 0.8); }
    else if (zz === 5) { tone(880, 0, 0.4, 'sine', 0.04, 0.5); tone(1320, 0, 0.5, 'sine', 0.03, 0.7); }
    else if (zz === 6) hiss(2, 600, 300, 0.12, 0.8, 0.3);
  }
  else if (n === 'bump') tone(170, 120, 0.07, 'triangle', 0.08);
  else if (n === 'plop') tone(260, 190, 0.06, 'triangle', 0.07);
  else if (n === 'bone') { tone(988, 0, 0.07, 'square', 0.04); tone(1480, 0, 0.12, 'square', 0.04, 0.07); }
  else if (n === 'splash') { hiss(0.45, 2600, 260, 0.32); tone(320, 90, 0.22, 'sine', 0.12); }
  else if (n === 'honk') { tone(330, 322, 0.13, 'sawtooth', 0.035 * v); tone(415, 405, 0.13, 'sawtooth', 0.03 * v); tone(330, 322, 0.16, 'sawtooth', 0.035 * v, 0.17); tone(415, 405, 0.16, 'sawtooth', 0.03 * v, 0.17); }
  else if (n === 'thud') { tone(150, 48, 0.28, 'sine', 0.3); hiss(0.18, 900, 120, 0.18); }
  else if (n === 'rumble') hiss(1.9, 220, 90, 0.5 * v, 0.5);
  else if (n === 'best') { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0, 0.16, 'square', 0.04, i * 0.09); }); }
  else if (n === 'quack') { tone(520, 380, 0.12, 'sawtooth', 0.03); tone(500, 360, 0.14, 'sawtooth', 0.03, 0.16); }
  else if (n === 'drone') { tone(220, 440, 0.5, 'sawtooth', 0.02); hiss(0.6, 3000, 1800, 0.05); }
  else if (n === 'smoke') hiss(1.2, 1200, 300, 0.2, 0.05);
  else if (n === 'unlock') { [523, 784, 659, 1047, 1319].forEach(function (f, i) { tone(f, 0, 0.18, 'triangle', 0.06, i * 0.1); }); }
  else if (n === 'heron') { tone(260, 200, 0.25, 'sawtooth', 0.03); tone(240, 180, 0.3, 'sawtooth', 0.03, 0.3); }
  else if (n === 'boing') tone(180, 520, 0.25, 'sine', 0.08);
}

/* ---------- game state ---------- */
var G = null, P = null;
var state = 'closed';          /* closed, play, dying, over, paused */
var LH = 240;                  /* art pixels tall, set by layout */
var ui = {}, off = null, octx = null, ctx = null, raf = 0, lastTs = 0, overAt = 0;
var prevOverflow = '', opener = null;

/* sv: carry on from a checkpoint buoy { row, bones, bonePts, runFish, startBest, toastDone } */
function newGame(sv) {
  var base = sv ? sv.row : 0, mi = 0;
  while (mi < MARKS.length && MARKS[mi].at < base + 3) mi++;
  G = {
    rows: {}, next: base - 16, chunk: null, riverDir: 1, base: base, cont: !!sv,
    maxRow: base, minRow: base, bones: sv ? sv.bones : 0, bonePts: sv ? sv.bonePts : 0, t: 0, cam: 0, shake: 0,
    parts: [], floats: [], dead: null, deadT: 0, toastDone: sv ? sv.toastDone : store.best === 0,
    startBest: sv ? sv.startBest : store.best, hopped: false, honkT: 0, newBest: false,
    zone: zoneOf(base), runFish: sv ? sv.runFish.slice() : [], save: null, pegs: 0, markI: mi,
    /* v3.0 */
    trip: !!(sv && sv.trip), tripBase: sv && sv.trip ? sv.tripBase || 0 : 0, gad: {}, ringUsed: false, smokeT: 0, duck: null, drone: null, stillT: 0, robin: 0,
    noteI: 0, bubbleT: 0, crocSaid: false, fotdGot: false
  };
  GADGETS.forEach(function (id) { G.gad[id] = has(id) ? (sv && sv.gad ? sv.gad[id] : 1) : 0; });
  P = { x: 4, row: base, hop: null, face: 1, log: null, queued: null, land: 0, bump: 0, bumpDir: 0, blinkT: 2 };
  genUpTo(base + 32);
  G.cam = camTarget(base);
}
function hopDur() { return ERA.id === 'future' ? 0.15 : HOP; }

/* ---------- lane generation ---------- */
function genUpTo(R) { while (G.next <= R) { G.rows[G.next] = newRow(G.next); G.next++; } }
function newRow(r) {
  if (r < G.base) return forestRow(r);
  if (r === G.base && G.cont) return dockRow(r, true);
  if (r < G.base + 3) return grassRow(r, true);
  if (zoneStart(r)) return dockRow(r, false);
  if (!G.chunk || G.chunk.left <= 0) G.chunk = pickChunk(r);
  G.chunk.left--;
  var t = G.chunk.type;
  if (t === 'grass') return grassRow(r, false);
  if (t === 'road') return roadRow(r);
  if (t === 'river') return riverRow(r);
  if (t === 'weir') return weirRow(r);
  return stampRow(r);
}
function pickChunk(r) {
  var d = diff(r), z = zoneOf(r);
  var last = G.chunk ? G.chunk.type : 'grass';
  if (last === 'weir') return { type: 'grass', left: 1 };
  if (last !== 'grass' && Math.random() < 0.82 - 0.3 * d) return { type: 'grass', left: Math.random() < 0.4 - 0.2 * d ? 2 : 1 };
  if (z === 2 && last === 'grass' && Math.random() < 0.34) return { type: 'weir', left: 1 };
  var stampP = r < 9 ? 0 : 0.13 + 0.1 * d;
  if (last !== 'stamp' && Math.random() < stampP) return { type: 'stamp', left: 1 };
  var road = Math.random() < 0.56;
  if (last === 'road') road = false; else if (last === 'river') road = true;
  if (road) return { type: 'road', left: Math.min(4, 1 + Math.floor(Math.random() * (1.7 + 2.6 * d))) };
  return { type: 'river', left: Math.min(3, 1 + Math.floor(Math.random() * (1.5 + 1.8 * d))) };
}
/* the first row of a zone: a pontoon with the checkpoint buoy */
function dockRow(r, done) {
  var z = zoneOf(r);
  var row = { r: r, type: 'grass', z: z, dock: true, block: [], reach: [], paved: false, bone: -1, peg: -1, buoy: (z % 2) ? 1 : COLS - 2, buoyDone: !!done };
  for (var c = 0; c < COLS; c++) { row.block[c] = 0; row.reach[c] = true; }
  return row;
}
function forestRow(r) {
  var row = { r: r, type: 'grass', z: zoneOf(r), block: [], paved: false, bone: -1, reach: [], peg: -1 };
  for (var c = 0; c < COLS; c++) row.block[c] = (hash(r, c) % 7 === 0) ? 'rubble' : 'tree';
  return row;
}
function grassRow(r, safe) {
  var z = zoneOf(r);
  var row = { r: r, type: 'grass', z: z, block: [], paved: !safe && Math.random() < (z === 3 ? 0.5 : 0.3), bone: -1, reach: [], peg: -1,
    ice: !safe && z === 4 && Math.random() < 0.5 };
  if (row.ice) row.paved = false;
  var c, i;
  for (c = 0; c < COLS; c++) { row.block[c] = 0; row.reach[c] = true; }
  if (safe) return row;
  var d = diff(r), p = 0.15 + 0.15 * d;
  var below = G.rows[r - 1];
  var belowGrass = below && (below.type === 'grass' || below.type === 'weir');
  var needFree = (below && (below.type === 'river' || below.type === 'weir')) ? 4 : 3;
  while (G.markI < MARKS.length && MARKS[G.markI].z != null && ZLOCK[MARKS[G.markI].z]) G.markI++;
  var mark = G.markI < MARKS.length && MARKS[G.markI].at <= r ? G.markI : -1;
  var markCol = mark >= 0 ? ((hash(r, 7) & 1) ? 0 : COLS - 1) : -1;
  for (var tries = 0; tries < 40; tries++) {
    var free = 0;
    for (c = 0; c < COLS; c++) {
      row.block[c] = c === markCol ? 'mark' : Math.random() < p ? obstacleKind(row.paved, z) : 0;
      if (!row.block[c]) free++;
    }
    if (free < needFree) continue;
    if (!computeReach(row, belowGrass ? below : null)) continue;
    break;
  }
  if (tries >= 40) { for (c = 0; c < COLS; c++) { row.block[c] = 0; row.reach[c] = true; } }
  if (mark >= 0 && row.block[markCol] === 'mark') { row.mark = mark; G.markI++; }
  var opts = [];
  for (i = 0; i < COLS; i++) if (!row.block[i] && row.reach[i]) opts.push(i);
  if (Math.random() < 0.3 && opts.length) row.bone = pick(opts);
  /* a fishing peg on the bank above open water */
  if (below && below.type === 'river' && !below.ferry && Math.random() < (G.pegs === 0 ? 0.85 : 0.33)) {
    opts = opts.filter(function (x) { return x !== row.bone; });
    if (opts.length) {
      row.peg = pick(opts); G.pegs++;
      /* secret: Jay, sat by an obstacle near the peg, fishing very badly */
      if (Math.random() < (store.sec.jay ? 0.05 : 0.16)) {
        var jc = -1;
        for (c = 0; c < COLS; c++) if (row.block[c] && row.block[c] !== 'mark' && Math.abs(c - row.peg) <= 4 && (jc < 0 || Math.abs(c - row.peg) < Math.abs(jc - row.peg))) jc = c;
        if (jc >= 0) row.block[jc] = 'jay';
      }
    }
  }
  /* v3.0 geese taken out (Jay, 29 Oct 2026): set GEESE to true to bring them back */
  if (GEESE && r > 12 && Math.random() < 0.08 + 0.08 * d) {
    var free = [];
    for (c = 0; c < COLS; c++) if (!row.block[c]) free.push(c);
    if (free.length >= 4) row.goose = { x: pick(free), dir: Math.random() < 0.5 ? 1 : -1, honk: 0, ph: Math.random() * 6 };
  }
  /* secret: Bonnie trots along the bank now and then */
  if (r > 10 && !row.goose && Math.random() < (store.sec.bonnie ? 0.008 : 0.025)) row.bonnie = { x: -1.5, dir: 1, t: 0 };
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
function obstacleKind(paved, z) {
  var x = Math.random();
  if (z === 1) return x < 0.45 ? 'reed' : x < 0.7 ? 'tree' : x < 0.85 ? 'rubble' : x < 0.95 ? 'wreck' : 'lamp';
  if (z === 2) return x < 0.4 ? 'rock' : x < 0.65 ? 'tree' : x < 0.8 ? 'reed' : x < 0.9 ? 'rubble' : 'lamp';
  if (z === 3) {
    if (paved) return x < 0.4 ? 'bollard' : x < 0.75 ? 'wreck' : 'lamp';
    return x < 0.45 ? 'tree' : x < 0.7 ? 'bollard' : x < 0.9 ? 'wreck' : 'lamp';
  }
  if (z === 4) return x < 0.5 ? 'tree' : x < 0.8 ? 'rock' : x < 0.9 ? 'wreck' : 'lamp';
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
var VANS = [['#5b6b3a', '#7a8c52', '#3f4a28', '#ffd23f'], ['#c8b27a', '#e0cd96', '#9a8656', '#ff7a1a'], ['#4a525a', '#6b737c', '#2b3036', '#5cf2ff']];
var NEON = [['#ff4fa3', '#ffc6e4', '#a81e66'], ['#2de2e6', '#b8fbfc', '#148a8c'], ['#ffd23f', '#fff3b0', '#b38a0b'], ['#9b5cff', '#d8c2ff', '#5a2ab0']];
function roadRow(r) {
  var d = diff(r), E = ERA.id;
  var row = { r: r, type: 'road', dir: Math.random() < 0.5 ? 1 : -1, items: [], bone: -1 };
  if (E === 'rome') row.dir = 1;   /* straight Roman roads: everyone marches the same way */
  var vanLane = Math.random() < 0.3;
  row.speed = (1.35 + 2.1 * d) * rnd(0.78, 1.22) * (vanLane ? 0.85 : 1);
  var x0 = XMIN + Math.random() * 2, x = x0, gMin = 2.6, gMax = 6.2 - 2.4 * d;
  if (E === 'stone') { row.speed *= 0.62; gMin = 3; gMax += 1; }
  if (E === 'rome') row.speed *= 0.85;
  for (var k = 0; k < 20; k++) {
    var van = vanLane ? Math.random() < 0.75 : Math.random() < 0.12;
    var it = van ? { len: 2, van: true, pal: pick(VANS) } : { len: 1.25, van: false, pal: pick(CARS) };
    if (E === 'stone') it = { len: 2.5, van: true, pal: CARS[0], seed: irnd(0, 99) };
    else if (E === 'rome') it = { len: van ? 2.6 : 1.8, van: van, pal: CARS[0], seed: irnd(0, 99) };
    else if (E === 'egypt' && !van) it.len = 1.5;
    else if (E === 'eighties') it.pal = pick(NEON);
    it.seed = it.seed || irnd(0, 99);
    if (x + it.len + gMin > x0 + SPAN) break;
    it.x = x; row.items.push(it);
    x += it.len + rnd(gMin, gMax);
  }
  spread(row.items, x0, (gMin + gMax) / 2);
  if (Math.random() < 0.07) row.bone = irnd(0, COLS - 1);
  return row;
}
function riverRow(r) {
  var d = diff(r), z = zoneOf(r);
  if (z === 3 && Math.random() < 0.55) return ferryRow(r);
  G.riverDir = -G.riverDir;
  var row = { r: r, type: 'river', z: z, dir: G.riverDir, items: [], bone: -1 }, E = ERA.id;
  row.speed = (0.75 + 1.05 * d) * rnd(0.8, 1.2);
  var kind = z === 4 ? 'floe' : (z === 1 || z === 5) && Math.random() < 0.5 ? 'pad' : Math.random() < 0.3 ? 'raft' : 'log';
  /* era boats: a longship, a steam boat, or a very polite crocodile */
  var special = null;
  if (kind !== 'floe') {
    if (E === 'viking' && Math.random() < 0.45) special = 'longship';
    else if (E === 'victorian' && Math.random() < 0.4) special = 'steamer';
    else if (E === 'egypt' && Math.random() < 0.5) special = 'croc';
  }
  if (special) { kind = special; row.speed *= special === 'croc' ? 0.85 : 0.75; }
  var x0 = XMIN + Math.random() * 2, x = x0, gMin = 1.2, gMax = 2.3 + 1.2 * d;
  if (special === 'longship' || special === 'steamer') { gMin = 2; gMax += 1.5; }
  for (var k = 0; k < 20; k++) {
    var it = kind === 'raft' ? { len: 2, raft: true } : kind === 'pad' ? { len: 2, pad: true } :
      kind === 'floe' ? { len: irnd(2, 3), floe: true } : kind === 'longship' ? { len: 4, longship: true } :
      kind === 'steamer' ? { len: 3, steamer: true } : kind === 'croc' ? { len: 3, croc: true } :
      { len: irnd(2, d < 0.4 ? 4 : 3), raft: false };
    it.seed = irnd(0, 9999);
    if (x + it.len + gMin > x0 + SPAN) break;
    it.x = x; row.items.push(it);
    x += it.len + rnd(gMin, gMax);
  }
  spread(row.items, x0, (gMin + gMax) / 2);
  /* Roman week: a stone bridge crosses some rivers, the same column all the way over */
  if (E === 'rome' && G.chunk) {
    if (G.chunk.bridge == null) G.chunk.bridge = Math.random() < 0.5 ? irnd(1, COLS - 3) : -1;
    if (G.chunk.bridge >= 0) row.items.push({ x: G.chunk.bridge, len: 2, fixed: true, bridge: true, seed: 1 });
  }
  return row;
}
/* ferries: long boats that glide, slow, dock and wait, then go again */
function ferryRow(r) {
  var d = diff(r);
  G.riverDir = -G.riverDir;
  var row = { r: r, type: 'river', z: 3, dir: G.riverDir, items: [], bone: -1, ferry: true, mod: 1, phase: 'go', pt: rnd(1, 3.5) };
  row.speed = (1.1 + 0.9 * d) * rnd(0.85, 1.15);
  var x0 = XMIN + Math.random() * 3;
  row.items.push({ x: x0, len: 3, ferry: true, seed: irnd(0, 9999) });
  row.items.push({ x: x0 + 9, len: 3, ferry: true, seed: irnd(0, 9999) });
  return row;
}
/* the weir: stepping stones in fast water. A hop into this row from
   above or below is carried one square along by the current. */
function weirRow(r) {
  var below = G.rows[r - 1], dir = Math.random() < 0.5 ? 1 : -1, c, tries, n, lands;
  var row = { r: r, type: 'weir', z: 2, dir: dir, stone: [], block: [], reach: [], bone: -1 };
  function from(c) { return !below || below.type !== 'grass' || (below.reach[c] && !below.block[c]); }
  for (tries = 0; tries < 40; tries++) {
    n = 0; lands = 0;
    for (c = 0; c < COLS; c++) { row.stone[c] = Math.random() < 0.5; if (row.stone[c]) n++; }
    for (c = 0; c < COLS; c++) if (from(c) && c + dir >= 0 && c + dir < COLS && row.stone[c + dir]) lands++;
    if (n >= 3 && n <= 6 && lands >= 2) break;
  }
  if (tries >= 40) {
    var cand = [];
    for (var flip = 0; flip < 2 && !cand.length; flip++) {
      if (flip) row.dir = dir = -dir;
      for (c = 0; c < COLS; c++) if (from(c) && c + dir >= 0 && c + dir < COLS) cand.push(c + dir);
    }
    for (c = 0; c < COLS; c++) row.stone[c] = !cand.length;   /* no way in at all: a row of stones */
    for (n = 0; n < 3 && cand.length; n++) row.stone[cand.splice(Math.floor(Math.random() * cand.length), 1)[0]] = true;
  }
  for (c = 0; c < COLS; c++) { row.block[c] = row.stone[c] ? 0 : 'water'; row.reach[c] = !!row.stone[c]; }
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
function rowV(row) { return row.dir * row.speed * (row.mod == null ? 1 : row.mod); }
function updateRow(row, dt) {
  var i, it;
  if (row.ferry) {
    row.pt -= dt;
    if (row.phase === 'go') { row.mod = Math.min(1, row.mod + dt * 1.2); if (row.pt <= 0) row.phase = 'slow'; }
    else if (row.phase === 'slow') {
      row.mod = Math.max(0, row.mod - dt * 1.4);
      if (row.mod <= 0) {
        row.phase = 'wait'; row.pt = 2.8;
        var near = Math.abs(row.r - (P ? P.row : 0));
        if (state === 'play' && near <= 5) sfx('toot', 1 - near / 7);
      }
    } else if (row.pt <= 0) { row.phase = 'go'; row.pt = rnd(2.4, 4.4); }
  }
  if (row.duckT > 0) {
    row.duckT -= dt;
    row.mod = Math.max(0, (row.mod == null ? 1 : row.mod) - dt * 4);
    if (row.duckT <= 0) { row.mod = undefined; row.duckT = 0; }
  }
  if (row.goose) updateGoose(row, dt);
  if (row.bonnie) updateBonnie(row, dt);
  if (row.type === 'road' || row.type === 'river') {
    var dx = rowV(row) * dt;
    for (i = 0; i < row.items.length; i++) {
      it = row.items[i]; if (it.fixed) continue;
      it.x += dx;
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

/* geese: waddle up and down a bank. If you land on their bank they
   waddle after you (slowly) and a goose that reaches you ends the run.
   A smoke bomb makes them lose track; a decoy duck distracts them. */
function gooseFree(row, c) { return c >= 0 && c < COLS && !row.block[c]; }
function updateGoose(row, dt) {
  var g = row.goose, duck = G.duck && Math.abs(G.duck.row - row.r) <= 3 ? G.duck : null;
  g.ph += dt;
  if (g.honk > 0) g.honk -= dt;
  g.lost = G.smokeT > 0 && P && Math.abs(P.row - row.r) <= 5 ? 1 : 0;
  g.love = duck ? 1 : 0;
  if (g.lost) { g.dir = Math.sin(g.ph * 3) > 0 ? 1 : -1; return; }   /* spins on the spot, baffled */
  var tgt = null, spd = 0.9;
  if (duck) { if (duck.row === row.r) tgt = duck.x; else return; spd = 2.2; }
  else if (state === 'play' && P && P.row === row.r && !P.hop) {
    /* spots you, honks and flaps for a moment, then waddles over */
    if (!g.seen) { g.seen = 1; g.alert = 0.8; g.honk = 1.6; sfx('honk', 0.45); }
    if (g.alert > 0) { g.alert -= dt; g.dir = Math.round(P.x) > g.x ? 1 : -1; return; }
    tgt = Math.round(P.x); spd = 1.05;
  } else g.seen = 0;
  if (tgt != null) {
    var want = tgt > g.x + 0.04 ? 1 : tgt < g.x - 0.04 ? -1 : 0;
    if (!want) return;
    g.dir = want;
  }
  var nx = g.x + g.dir * spd * dt, ahead = g.dir > 0 ? Math.ceil(nx - 0.01) : Math.floor(nx + 0.01);
  if (!gooseFree(row, ahead)) { if (tgt == null) g.dir = -g.dir; g.x = Math.round(g.x); return; }
  g.x = nx;
}
function gooseAt(row, c) { return row && row.goose && Math.abs(row.goose.x - c) < 0.6; }
/* secret: Bonnie trots across the bank */
function updateBonnie(row, dt) {
  var b = row.bonnie;
  b.t += dt;
  b.x += dt * 2.2;
  if (b.x > COLS + 1) { row.bonnie = null; return; }
  if (state === 'play' && P && !P.hop && Math.abs(P.row - row.r) <= 1 && Math.abs(P.x - b.x) < 1.3 && !b.met) {
    b.met = 1; b.hop = 0.6;
    G.floats.push({ x: (b.x + 0.5) * TS, y: -row.r * TS - 6, life: 1.2, heart: 1 });
    findSecret('bonnie', 'Bonnie says hello!');
  }
  if (b.hop > 0) b.hop -= dt;
}

/* ---------- v3.0 gadgets ---------- */
function useGadget(id) {
  if (state !== 'play' || !G || !(G.gad[id] > 0)) return;
  G.gad[id]--;
  unlockAudio();
  if (id === 'duck') dropDuck();
  else if (id === 'drone') launchDrone();
  else if (id === 'smoke') popSmoke();
  syncGadgets();
}
/* the decoy duck: lands on the nearest road ahead and all traffic there
   stops politely */
function dropDuck() {
  var r, row, best = null;
  for (r = P.row + 1; r <= P.row + 4; r++) { row = G.rows[r]; if (row && row.type === 'road') { best = row; break; } }
  if (!best) for (r = P.row; r <= P.row + 3; r++) { row = G.rows[r]; if (row && row.type === 'grass') { best = row; break; } }
  if (!best) best = G.rows[P.row];
  var dx = clamp(Math.round(P.x) + (P.x < COLS / 2 ? 2 : -2), 0, COLS - 1);
  G.duck = { row: best.r, x: dx, t: 6, y0: P.row };
  if (best.type === 'road') { best.duckT = 6; }
  sfx('quack');
  toast(best.type === 'road' ? 'Traffic stops for the duck' : 'Quack. The duck says hello');
}
/* the scout drone: zooms ahead and brings back any fish on the way */
function launchDrone() {
  G.drone = { x: P.x, row: P.row, from: P.row, t: 0, got: 0, back: false };
  sfx('drone');
}
function updateDrone(dt) {
  var d = G.drone;
  d.t += dt;
  if (!d.back) {
    d.row += dt * 9;
    var rr = Math.floor(d.row), row = G.rows[rr];
    if (row && row.bone >= 0 && row.type !== 'river') {
      d.x += (row.bone - d.x) * Math.min(1, dt * 12);
      if (Math.abs(row.bone - d.x) < 0.5) {
        row.bone = -1; d.got++; G.bones++; G.bonePts += 2;
        G.floats.push({ x: (d.x + 0.5) * TS, y: -rr * TS - 4, life: 0.8, txt: '+2' });
        sfx('bone');
        var fs = pickFish(zoneOf(rr), false, false, false), lf = logFish(fs, false, false, Math.random() < goldChance(false));
        if (lf.isNew) toast('New fish: ' + fs.name + '!');
        checkFotd(fs);
      }
    }
    if (d.row > d.from + 14) d.back = true;
  } else {
    d.row -= dt * 14; d.x += (P.x - d.x) * Math.min(1, dt * 4);
    if (d.row <= visRow()) { G.drone = null; toast(d.got ? 'Drone back with ' + (d.got === 1 ? '1 fish' : d.got + ' fish') : 'Drone back. Nothing out there'); }
  }
}
/* the smoke bomb: patrol drones nearby lose track of you */
function popSmoke() {
  G.smokeT = 7;
  sfx('smoke');
  if (!RM) for (var i = 0; i < 26; i++) addPart((P.x + 0.5) * TS + rnd(-10, 10), -P.row * TS + rnd(0, 12), rnd(-22, 22), rnd(-26, -4), -4, rnd(1.2, 2.2), pick(['#e6eaee', '#cfd6dc', '#f6f8fa']), 3);
  toast('Smoke! Nobody can see you');
}
function syncGadgets() {
  if (!ui.gads) return;
  GADGETS.forEach(function (id) {
    var b = ui.gads.querySelector('[data-g="' + id + '"]');
    if (!b) return;
    var n = G ? G.gad[id] || 0 : 0;
    b.hidden = !has(id);
    b.disabled = n < 1 || state !== 'play';
    b.querySelector('b').textContent = String(n);
  });
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
  /* v3.0 gadgets and secrets */
  if (G.duck) { G.duck.t -= dt; if (G.duck.t <= 0) G.duck = null; }
  if (G.smokeT > 0) {
    G.smokeT -= dt;
    if (!RM && P && Math.random() < dt * 10) addPart((P.x + 0.5) * TS + rnd(-26, 26), -P.row * TS + rnd(-20, 14), rnd(-6, 6), rnd(-8, -2), 0, rnd(0.8, 1.4), pick(['#e6eaee', '#cfd6dc']), 3);
  }
  if (G.drone) updateDrone(dt);
  if (G.boat && G.boat.t > 0) G.boat.t -= dt;
  if (G.bubbleT > 0) { G.bubbleT -= dt; if (G.bubbleT <= 0 && ui.bubble) ui.bubble.className = 'hkg-bubble'; }
  if (state === 'play' && !P.hop) {
    G.stillT += dt;
    /* secret: stand still next to a tree long enough and a robin lands on you */
    if (G.stillT > 6 && !G.robin && nextToTree()) { G.robin = 1; findSecret('robin', 'A robin! It likes your hat.'); }
  }
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

function nextToTree() {
  var row = G.rows[P.row];
  if (!row || row.type !== 'grass' || !row.block) return false;
  var c = Math.round(P.x);
  return row.block[c - 1] === 'tree' || row.block[c + 1] === 'tree' || (G.rows[P.row + 1] && G.rows[P.row + 1].block && G.rows[P.row + 1].block[c] === 'tree');
}
function updatePlayer(dt) {
  if (P.hop) {
    P.hop.t += dt / (P.hop.slide ? HOP : hopDur());
    if (P.hop.t >= 1) { landHop(); if (state !== 'play') return; }
  } else if (P.log) {
    var row = G.rows[P.row];
    if (!P.log.fixed) P.x += rowV(row) * dt;
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
  } else if (row.type === 'stamp' && row.phase === 'run' && !(G.smokeT > 0)) {
    for (i = 0; i < row.herd.length; i++) {
      m = row.herd[i];
      if (b > m.x + 0.15 && a < m.x + 1.6) { die('stamp', vr, px); return; }
    }
  } else if (row.goose && !row.goose.lost && !row.goose.love && !P.hop) {
    if (Math.abs(row.goose.x - px) < 0.55) { die('goose', vr, px); return; }
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
  if (ui.era && ui.era.className.indexOf('gone') < 0) ui.era.className = 'hkg-era gone';
  if (dx) P.face = dx;
  var fr = P.row, fx = P.x, tr = fr + dr, tx;
  var dst = G.rows[tr];
  if (!dst || tr < G.minRow) { bump(dx, dr); return; }
  if (dst.type === 'river') {
    tx = fx + dx;
    if (tx < -0.45 || tx > COLS - 0.55) { bump(dx, dr); return; }
  } else {
    tx = Math.round(fx + dx);
    if (dst.type === 'weir' && dr) tx += dst.dir;   /* the current carries the hop along */
    if (tx < 0 || tx > COLS - 1) { bump(dx, dr); return; }
    if (dst.type === 'grass' && dst.block[tx]) { if (dst.block[tx] === 'jay') meetJay(dst, tx); bump(dx, dr); return; }
    if (dst.type === 'grass' && gooseAt(dst, tx)) { bump(dx, dr); if (!dst.goose.lost) sfx('honk', 0.4); return; }
  }
  P.log = null;
  P.hop = { fx: fx, fr: fr, tx: tx, tr: tr, t: 0 };
  G.stillT = 0;
  syncCast();
  sfx('hop');
}
/* secret: Jay, fishing badly. Bump into him for one of his sayings */
function meetJay(row, c) {
  var line = SAYINGS[(G.jayI = ((G.jayI || 0) + 1)) % SAYINGS.length];
  if (!store.sec.jay) { store.sec.jaySaid = line; }
  say('Jay: ' + line, null, row.r, c);
  findSecret('jay');
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
    if (lg.croc && !G.crocSaid) { G.crocSaid = true; say(pick(['Good afternoon.', 'Mind the teeth, please.', 'Lovely weather.', 'Do wipe your feet.']), lg); }
    if (lg.longship && Math.random() < 0.6) say(pick(['HEAVE!', 'Row, row, row!', 'LAAA LA LAAA!']), lg);
  } else {
    P.x = Math.round(P.x);
    if (row.type === 'weir' && !row.stone[P.x]) { die('splash'); return; }
    if (!RM && row.type === 'grass') {
      var pc = row.ice || row.z === 4 ? '#ffffff' : '#c9f2a0';
      for (var i = 0; i < 3; i++) addPart((P.x + 0.5) * TS + rnd(-4, 4), -P.row * TS + 14, rnd(-16, 16), rnd(-18, -6), 50, 0.35, pc, 1);
    }
    if (!RM && row.type === 'weir') for (i = 0; i < 4; i++) addPart((P.x + 0.5) * TS + rnd(-5, 5), -P.row * TS + 12, rnd(-20, 20) + row.dir * 10, rnd(-30, -10), 90, 0.4, '#ffffff', 1);
  }
  if (P.row > G.maxRow) {
    var was = G.maxRow;
    G.maxRow = P.row; G.minRow = Math.max(G.base, G.maxRow - 10);
    if (G.maxRow > store.far) store.far = G.maxRow;
    if (!G.toastDone && score() > G.startBest) { G.toastDone = true; toast('New best!'); sfx('best'); }
    for (var mk = was + 1; mk <= G.maxRow; mk++) if (G.rows[mk] && G.rows[mk].mark != null) lightMark(G.rows[mk].mark);
    var zn = zoneOf(G.maxRow);
    if (zn > G.zone) enterZone(zn);
  }
  if (row.bone >= 0 && row.type !== 'river' && row.bone === P.x) {
    row.bone = -1; G.bones++; G.bonePts += 2;
    sfx('bone');
    G.floats.push({ x: (P.x + 0.5) * TS, y: -P.row * TS - 4, life: 0.8, txt: '+2' });
    if (!RM) for (var j = 0; j < 6; j++) addPart((P.x + 0.5) * TS, -P.row * TS + 8, rnd(-30, 30), rnd(-50, -20), 90, 0.5, '#fff6dc', 1);
    var fs = pickFish(zoneOf(P.row), false, false, false), lf = logFish(fs, false, false, Math.random() < goldChance(false));
    if (fs.era) toast(fs.name + '! This week only');
    else if (lf.gold) toast('A golden ' + fs.name + '!');
    else if (lf.isNew) toast('New fish: ' + fs.name + '!');
    checkFotd(fs);
  }
  /* ice: slide one extra square the same way */
  if (row.type === 'grass' && row.ice && !h.slide) {
    var sdx = h.tx > h.fx + 0.01 ? 1 : h.tx < h.fx - 0.01 ? -1 : 0, sdr = h.tr - h.fr;
    var nr = P.row + sdr, nx = P.x + sdx, nrow = G.rows[nr];
    if (nrow && nrow.type === 'grass' && (sdr === 0 || nrow.ice) && nx >= 0 && nx < COLS && !nrow.block[nx] && nr >= G.minRow) {
      P.hop = { fx: P.x, fr: P.row, tx: nx, tr: nr, t: 0, slide: true };
      sfx('slide');
      if (!RM) for (var sk = 0; sk < 4; sk++) addPart((P.x + 0.5) * TS, -P.row * TS + 13, -sdx * rnd(10, 30), rnd(-12, -2), 40, 0.4, '#dff3ff', 1);
      updateHud();
      return;
    }
  }
  if (row.type === 'road' && G.honkT <= 0) {
    for (var k = 0; k < row.items.length; k++) {
      var m = row.items[k];
      var ahead = row.dir > 0 ? P.x - (m.x + m.len) : m.x - (P.x + 1);
      if (ahead > 0 && ahead < 2.2) { sfx('honk', 0.7); G.honkT = 2.5; break; }
    }
  }
  updateHud();
  if (row.buoy === P.x && !row.buoyDone && state === 'play') tieOff(row);
  if (P.queued && state === 'play') { var q = P.queued; P.queued = null; tryMove(q[0], q[1]); }
  syncCast();
}
function onPeg() {
  if (!G || !P || state !== 'play' || P.hop) return null;
  var row = G.rows[P.row];
  return row && row.type === 'grass' && row.peg >= 0 && row.peg === P.x && !row.pegDone ? row : null;
}
function syncCast() { if (ui.cast) ui.cast.hidden = !onPeg(); }
function lightMark(i) {
  var m = MARKS[i];
  if (!m || store.marks[m.id]) return;
  store.marks[m.id] = 1; saveStore();
  toast('On the map: ' + m.name);
}
function enterZone(z) {
  G.zone = z;
  if (G.maxRow > store.far) store.far = G.maxRow;
  saveStore();
  toast(ZONES[z].name);
  sfx('zone');
  /* each new zone tops up any gadget that has been used */
  var topped = false;
  GADGETS.forEach(function (id) { if (has(id) && G.gad[id] < 1) { G.gad[id] = 1; topped = true; } });
  if (topped) { toast('Gadgets topped up'); syncGadgets(); }
  toast('Hop on the buoy to tie off');
}
/* a speech bubble over something on the canvas, for a few seconds */
function say(txt, it, row, col) {
  if (!ui.bubble || !G) return;
  var r = row != null ? row : P.row, x = it ? it.x + it.len / 2 : col != null ? col + 0.5 : P.x + 0.5;
  G.bubble = { r: r, x: x, it: it || null };
  ui.bubble.textContent = txt;
  ui.bubble.className = 'hkg-bubble on';
  G.bubbleT = 2.6;
  placeBubble();
}
function placeBubble() {
  if (!G || !G.bubble || !ui.bubble || !ui.canvas) return;
  var b = G.bubble, s = ui.canvas.offsetWidth / LW;
  var x = b.it ? b.it.x + b.it.len / 2 : b.x;
  var px = clamp(x * TS * s, 60, ui.canvas.offsetWidth - 60), py = (-b.r * TS - G.cam - 6) * s;
  ui.bubble.style.left = px + 'px'; ui.bubble.style.top = Math.max(40, py) + 'px';
}
/* the daily fish of the day: a bonus the first time each day */
function checkFotd(f) {
  var k = todayKey();
  if (f.id !== fishOfDay().id || store.fotd[k]) return;
  store.fotd = {}; store.fotd[k] = 1;
  G.bonePts += 10; G.fotdGot = true;
  G.floats.push({ x: (P.x + 0.5) * TS, y: -P.row * TS - 12, life: 1.2, txt: '+10' });
  saveStore();
  toast('Fish of the day! +10');
  sfx('best');
}

function score() { return G.maxRow - (G.tripBase || 0) + G.bonePts; }

function addPart(x, y, vx, vy, g, life, c, s) {
  if (G.parts.length > 260) return;
  G.parts.push({ x: x, y: y, vx: vx, vy: vy, g: g, life: life, max: life, c: c, s: s || 1 });
}

var MSG = {
  squash: { t: 'Flattened!', col: '#e2541f', m: ['That patrol truck was not stopping.', 'Wrong lane, operator.', 'Flat as a pancake, still holding the rod.', 'Beep beep. The truck won that one.'] },
  splash: { t: 'Splash!', col: '#1f86d1', m: ['Wrong way to get to the fish.', 'In the lake. Kit is soaked.', 'Missed the log by a boot.'] },
  drift: { t: 'Splash!', col: '#1f86d1', m: ['The log drifted right off the edge.', 'Nice ride, shame about the ending.'] },
  stamp: { t: 'Spotted!', col: '#8a4fb5', m: ['The drones picked you up.', 'Should have waited for the sweep to pass.', 'Buzz buzz. Busted.'] },
  goose: { t: 'Honked!', col: '#b8741a', m: ['The goose won. The goose always wins.', 'Chased off by a goose. Classic.', 'That goose has no chill.', 'Out tactic\'d by a goose.'] }
};
var ERAMSG = {
  stone: 'A mammoth sat on it. Probably by accident.',
  egypt: 'Sand everywhere. In the kit, in the bait, everywhere.',
  rome: 'The legion did not even break step.',
  viking: 'The longship crew sang about it afterwards.',
  victorian: 'A gentleman tipped his hat, then carried on.',
  eighties: 'Totally bogus. Rewind and go again.',
  future: 'The hover traffic says sorry in three languages.'
};

/* the life ring: one splash rescue a run, back to the last safe bank */
function rescue(kind) {
  if (!has('ring') || G.ringUsed || (kind !== 'splash' && kind !== 'drift')) return false;
  G.ringUsed = true;
  for (var r = P.row - 1; r >= G.minRow - 1 && r >= G.base; r--) {
    var row = G.rows[r];
    if (row && row.type === 'grass') {
      var c = clamp(Math.round(P.x), 0, COLS - 1), best = -1;
      for (var k = 0; k < COLS; k++) if (!row.block[k] && !gooseAt(row, k) && (best < 0 || Math.abs(k - c) < Math.abs(best - c))) best = k;
      if (best < 0) continue;
      var cx = (clamp(P.x, -0.3, COLS - 0.7) + 0.5) * TS, cy = -P.row * TS + 8;
      sfx('splash');
      if (!RM) for (var i = 0; i < 14; i++) addPart(cx, cy, rnd(-40, 40), rnd(-80, -30), 220, rnd(0.4, 0.7), pick(['#ffffff', '#bfe8ff', '#ff7a1a']), 1);
      P.hop = null; P.log = null; P.queued = null;
      P.row = r; P.x = best; P.land = 1;
      toast('Life ring! Back on the bank');
      syncGadgets();
      return true;
    }
  }
  return false;
}

function die(kind, vr, px) {
  if (state !== 'play') return;
  if (P.hop) { P.row = vr != null ? vr : P.hop.tr; P.x = px != null ? px : P.hop.tx; P.hop = null; }
  if (rescue(kind)) return;
  P.log = null; P.queued = null;
  state = 'dying'; G.dead = kind;
  G.deadT = (kind === 'splash' || kind === 'drift') ? 0.6 : 0.55;
  var cx = (clamp(P.x, -0.3, COLS - 0.7) + 0.5) * TS, cy = -P.row * TS + 8, i;
  if (kind === 'squash') {
    sfx('honk'); sfx('thud'); G.shake = RM ? 0 : 3;
    for (i = 0; i < (RM ? 4 : 12); i++) addPart(cx, cy + 4, rnd(-50, 50), rnd(-60, -10), 120, 0.6, pick(['#ffffff', '#ffd76e', '#5ccf52']), 1);
  } else if (kind === 'goose') {
    sfx('honk'); G.shake = RM ? 0 : 2;
    for (i = 0; i < (RM ? 4 : 16); i++) addPart(cx + rnd(-6, 6), cy, rnd(-50, 50), rnd(-70, -20), 90, rnd(0.6, 1), pick(['#ffffff', '#e6e6e0', '#3a3a3a']), 1);
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
  if (G.maxRow > store.far) store.far = G.maxRow;
  saveStore();
  if (ui.cast) ui.cast.hidden = true;
  syncGadgets();
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
  if (G.drone) drawDrone(G.drone, cam);
  /* particles and floating numbers */
  for (var i = 0; i < G.parts.length; i++) {
    var p = G.parts[i];
    R(p.x - p.s / 2, p.y - cam - p.s / 2, p.s, p.s, p.c);
  }
  for (i = 0; i < G.floats.length; i++) {
    var fl = G.floats[i];
    if (fl.heart) { var hx = Math.round(fl.x), hy = Math.round(fl.y - cam); R(hx - 3, hy, 2, 2, '#ff6b8a'); R(hx + 1, hy, 2, 2, '#ff6b8a'); R(hx - 3, hy + 1, 6, 2, '#ff6b8a'); R(hx - 2, hy + 3, 4, 1, '#ff6b8a'); R(hx - 1, hy + 4, 2, 1, '#ff6b8a'); }
    else drawText(fl.txt, fl.x, fl.y - cam);
  }
  /* era and zone light: night lake dims, the 80s go neon, the future snows */
  var zNow = G.zone;
  if (zNow === 5) { g2.fillStyle = 'rgba(8,12,40,0.28)'; g2.fillRect(0, 0, LW, LH); }
  if (ERA.id === 'eighties') { g2.fillStyle = 'rgba(60,0,90,0.16)'; g2.fillRect(0, 0, LW, LH); }
  if (ERA.id === 'viking' || ERA.id === 'victorian') { g2.fillStyle = 'rgba(30,40,60,0.10)'; g2.fillRect(0, 0, LW, LH); }
  if ((ERA.id === 'future' || zNow === 4 || zNow === 6) && !RM) {
    for (i = 0; i < 26; i++) {
      var sh = hash(i, 9), sx2 = (sh % LW + Math.sin(G.t + i) * 6 + LW) % LW, sy2 = ((sh >> 8) % LH + G.t * (12 + (i % 5) * 3)) % LH;
      R(sx2, sy2, 1, 1, '#ffffff');
    }
  }
  if (ERA.id === 'rome' && !RM) {
    g2.fillStyle = 'rgba(200,215,230,0.55)';
    for (i = 0; i < 18; i++) { var rh = hash(i, 31), rx = (rh % LW + G.t * 20) % LW, ry = ((rh >> 8) % LH + G.t * 90) % LH; g2.fillRect(Math.round(rx), Math.round(ry), 1, 3); }
  }
  placeBubble();
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

function zOf(row, r) { return row.z != null ? row.z : zoneOf(r); }
/* ---------- v3.0: the era look ----------
   Each era nudges every zone's colours towards its own: sand for Egypt,
   neon night for the 80s, deep blue for the future. Cached per zone. */
var ERAMIX = {
  stone: { g: '#a8a050', road: '#7a6a58', k: 0.3 },
  egypt: { g: '#e6c47a', road: '#c9a060', k: 0.62, w: '#2f8fd0', kw: 0.3 },
  rome: { g: '#5f9a4a', road: '#8c8c84', k: 0.25, w: '#4a8ab0', kw: 0.25 },
  viking: { g: '#4a7a52', road: '#5e4a36', k: 0.38, w: '#2a4f72', kw: 0.4 },
  victorian: { g: '#5a7a3a', road: '#57504a', k: 0.35, w: '#4a6a7a', kw: 0.35 },
  eighties: { g: '#2c1656', road: '#140a28', k: 0.7, w: '#2a2a96', kw: 0.55 },
  future: { g: '#1c2c50', road: '#0e1628', k: 0.6, w: '#1a5aa0', kw: 0.45 }
};
function hex2(c) { return [parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)]; }
function mix(a, b, k) {
  var A = hex2(a), B = hex2(b), o = '#';
  for (var i = 0; i < 3; i++) o += ('0' + Math.round(A[i] + (B[i] - A[i]) * k).toString(16)).slice(-2);
  return o;
}
var ZE = [], ZEK = '';
function ZP(z) {
  if (ZEK !== ERA.id) { ZE = []; ZEK = ERA.id; }
  if (ZE[z]) return ZE[z];
  var Z = ZONES[z], M = ERAMIX[ERA.id] || { k: 0 }, k = M.k * (z >= 4 ? 0.5 : 1);
  var o = { id: Z.id, name: Z.name, g: [mix(Z.g[0], M.g || Z.g[0], k), mix(Z.g[1], M.g || Z.g[1], k)], tuft: mix(Z.tuft, M.g || Z.tuft, k * 0.7),
    lite: mix(Z.lite, M.g || Z.lite, k * 0.8), road: mix(Z.road, M.road || Z.road, Math.min(1, k * 1.4)), w: Z.w.map(function (c) { return M.w ? mix(c, M.w, M.kw * (z >= 4 ? 0.5 : 1)) : c; }) };
  ZE[z] = o;
  return o;
}
function drawGround(row, r, y) {
  var c, h, x, up = G.rows[r + 1] || forestFallback(r + 1), dn = G.rows[r - 1] || forestFallback(r - 1);
  var z = zOf(row, r), Z = ZP(z), E = ERA.id;
  if (row.type === 'grass' && row.dock) {
    var plank = E === 'victorian' ? ['#6a6a72', '#4a4a52', '#8a8a94', '#3a3a40', '#2a2a30'] : E === 'future' ? ['#3a4a6a', '#2a3450', '#7cf5c9', '#1a2236', '#5a6a8a'] :
      E === 'eighties' ? ['#3a2a5a', '#2a1a40', '#ff4fa3', '#1a0f2a', '#2de2e6'] : ['#a8743d', '#7d5228', '#c99a5c', '#6b4220', '#5b3a1c'];
    R(0, y, LW, TS, Z.w[0]);
    R(0, y + 2, LW, 12, plank[0]);
    for (x = 0; x < LW; x += 6) { R(x, y + 2, 1, 12, plank[1]); R(x + 1, y + 2, 5, 1, plank[2]); }
    R(0, y + 13, LW, 1, plank[3]);
    for (x = 2; x < LW; x += 24) { R(x, y + 1, 2, 14, plank[4]); R(x, y + 1, 2, 1, plank[2]); }
    if (E === 'victorian') for (x = 10; x < LW; x += 36) { R(x, y - 6, 2, 8, '#2a2a30'); R(x - 1, y - 8, 4, 3, '#ffd76e'); }
    R(0, y + 14, LW, 2, Z.w[4]);
    return;
  }
  if (row.type === 'grass' && row.ice) {
    R(0, y, LW, TS, (r & 1) ? '#cfe9f7' : '#c7e4f4');
    for (c = 0; c < COLS; c++) {
      h = hash(r, c + 30); x = c * TS;
      if (h % 3 === 0) { R(x + 2 + (h % 6), y + 4, 5, 1, '#ffffff'); R(x + 3 + (h % 6), y + 5, 3, 1, '#e9f6fd'); }
      if (h % 4 === 1) { R(x + 9, y + 8, 1, 3, '#a7d0e8'); R(x + 10, y + 10, 3, 1, '#a7d0e8'); }
      if (h % 7 === 3) R(x + 4, y + 11, 6, 1, '#b9dcef');
    }
    if (dn.type === 'road' || dn.type === 'river' || dn.type === 'stamp') R(0, y + TS - 2, LW, 2, '#a7c9dd');
    return;
  }
  if (row.type === 'grass') {
    R(0, y, LW, TS, (r & 1) ? Z.g[0] : Z.g[1]);
    for (c = 0; c < COLS; c++) {
      h = hash(r, c); x = c * TS;
      if (row.paved && z === 3) {
        R(x, y + 1, 16, 14, (h & 1) ? '#b9864a' : '#b08045');
        for (var pl = 0; pl < 14; pl += 5) R(x, y + 1 + pl, 16, 1, '#8b5a2b');
        R(x + (h % 9) + 2, y + 3 + (h % 3) * 5, 1, 1, '#5b3a1c');
        R(x + 15, y + 1, 1, 14, '#7d5228');
      } else if (row.paved) {
        R(x + 1, y + 1, 14, 14, (h & 1) ? '#a9ab9f' : '#a0a297');
        R(x + 1, y + 1, 14, 1, '#bfc1b5');
        R(x + 1, y + 14, 14, 1, '#8a8c82');
        if (h % 3 === 0) { R(x + 4 + (h % 5), y + 3, 1, 4, '#7d7f75'); R(x + 5 + (h % 5), y + 7, 1, 3, '#7d7f75'); R(x + 3 + (h % 5), y + 9, 3, 1, '#5fae47'); }
        if (h % 4 === 1) { R(x + 2, y + 11, 2, 1, '#4f9e3c'); R(x + 3, y + 10, 1, 1, '#6cc24c'); }
      } else {
        if (h % 5 === 0) { R(x + 3 + (h % 7), y + 5 + (h % 5), 1, 2, Z.tuft); R(x + 4 + (h % 7), y + 4 + (h % 5), 1, 3, Z.tuft); R(x + 5 + (h % 7), y + 5 + (h % 5), 1, 2, Z.tuft); }
        if (h % 9 === 2) { R(x + 9, y + 9, 1, 1, z === 4 ? '#ffffff' : pick2(h, ['#ffd84a', '#ff8fb1', '#ffffff', '#b38cff'])); R(x + 8, y + 9, 1, 1, Z.tuft); }
        if (h % 13 === 4) { R(x + 2, y + 12, 1, 1, z === 4 ? '#ffffff' : '#ffd84a'); }
        if (h % 6 === 3) R(x + 10, y + 2, 3, 1, Z.lite);
        if (z === 1 && h % 11 === 3) { R(x + 3, y + 9, 7, 3, Z.w[0]); R(x + 4, y + 8, 5, 1, Z.w[0]); R(x + 4, y + 9, 3, 1, Z.w[2]); }
        if (z === 2 && h % 7 === 2) { R(x + 11, y + 6, 2, 1, '#9aa3a8'); R(x + 6, y + 12, 1, 1, '#9aa3a8'); }
        if (z === 5 && h % 6 === 1) { var on5 = RM || Math.floor(G.t * 1.5 + h) % 4 !== 0; if (on5) R(x + 4 + (h % 8), y + 3 + (h % 9), 1, 1, '#d8ff7a'); }
        if (z === 6 && h % 8 === 5) { R(x + 3, y + 10, 5, 2, '#8d969c'); R(x + 4, y + 9, 3, 1, '#aab3b8'); }
        if (E === 'egypt' && h % 7 === 3) { R(x + 2, y + 9, 9, 1, '#d8a850'); R(x + 4, y + 8, 5, 1, '#f0d290'); }
        if (E === 'stone' && h % 9 === 6) { R(x + 9, y + 9, 4, 3, '#8a8478'); R(x + 9, y + 9, 4, 1, '#aaa496'); }
        if (E === 'eighties' && h % 5 === 2) R(x + 2 + (h % 11), y + 3 + (h % 9), 1, 1, pick2(h, ['#ff4fa3', '#2de2e6', '#ffd23f']));
        if (E === 'future' && h % 5 === 1) { R(x + 3 + (h % 9), y + 2 + (h % 10), 1, 1, '#ffffff'); }
      }
    }
    if (E === 'eighties' && !row.paved) for (x = 0; x < LW; x += 16) R(x, y, 1, TS, 'rgba(255,79,163,0.25)');
    if (E === 'future' && !row.paved) R(0, y + 15, LW, 1, 'rgba(124,245,201,0.25)');
    if (up.type === 'river' || up.type === 'weir') R(0, y, LW, 1, Z.tuft);
    if (dn.type === 'road' || dn.type === 'river' || dn.type === 'stamp' || dn.type === 'weir') { R(0, y + TS - 2, LW, 2, Z.tuft); }
  } else if (row.type === 'weir') {
    R(0, y, LW, TS, '#4aa8dc');
    var fl = RM ? 0 : G.t * row.dir * 40;
    for (var fi = 0; fi < 12; fi++) {
      h = hash(r, fi + 70);
      var fx = ((h % LW) + fl) % LW; if (fx < 0) fx += LW;
      R(fx, y + 3 + (fi % 4) * 3, 5, 1, fi & 1 ? '#ffffff' : '#d6f1fb');
    }
    R(0, y, LW, 2, '#9aa3a8'); R(0, y + 2, LW, 1, '#6f787d');
    R(0, y + TS - 1, LW, 1, '#c9ecfb');
    var ph = RM ? 0 : Math.floor(G.t * 3) % 3;
    for (c = 0; c < COLS; c++) {
      x = c * TS;
      if (row.stone[c]) {
        R(x + 2, y + 5, 12, 9, '#5d666c'); R(x + 2, y + 4, 12, 9, '#8d969c'); R(x + 3, y + 3, 10, 1, '#aab3b8');
        R(x + 4, y + 5, 4, 2, '#aab3b8'); R(x + 9, y + 10, 3, 2, '#6a9a4a'); R(x + 1, y + 7, 1, 4, '#8d969c'); R(x + 14, y + 7, 1, 4, '#8d969c');
      } else {
        var ax = x + 6 + (row.dir > 0 ? ph : -ph);
        for (var ai = 0; ai < 3; ai++) {
          var o = row.dir > 0 ? ai : 2 - ai;
          R(ax + o, y + 5 + ai, 1, 1, '#e6f7ff'); R(ax + o, y + 11 - ai, 1, 1, '#e6f7ff');
        }
      }
    }
  } else if (row.type === 'road') {
    R(0, y, LW, TS, Z.road);
    for (c = 0; c < COLS; c++) {
      h = hash(r, c + 50); x = c * TS;
      if (h % 4 === 0) { R(x + 3 + (h % 9), y + 6, 3, 1, '#3a3c45'); R(x + 5 + (h % 9), y + 7, 1, 2, '#3a3c45'); }
      if (h % 7 === 1 && z !== 4) { R(x + 6 + (h % 5), y + 9, 1, 2, '#58b146'); R(x + 7 + (h % 5), y + 8, 1, 2, '#6cc24c'); }
      if (h % 11 === 5) R(x + 2, y + 4, 5, 3, '#4e515b');
    }
    if (up.type === 'road') {
      for (x = 3; x < LW; x += 16) R(x, y, 8, 1, '#c9c19a');
    } else {
      R(0, y, LW, 2, '#9b9d92'); R(0, y + 2, LW, 1, '#33353d');
      for (x = 0; x < LW; x += 8) R(x, y, 1, 2, '#83857b');
    }
    if (dn.type !== 'road') { R(0, y + TS - 2, LW, 2, '#9b9d92'); for (x = 4; x < LW; x += 8) R(x, y + TS - 2, 1, 2, '#83857b'); }
    if (z === 4) for (c = 0; c < COLS; c++) { h = hash(r, c + 120); if (h % 4 === 1) R(c * TS + (h % 9), y + 3 + (h % 9), 4, 2, '#e8f1f7'); }
    if (E === 'rome') for (x = 0; x < LW; x += 8) { R(x + ((r & 1) * 4), y + 3, 1, 10, 'rgba(60,60,56,0.5)'); R(x, y + 8, 8, 1, 'rgba(60,60,56,0.35)'); }
    if (E === 'eighties') { R(0, y + 1, LW, 1, '#ff4fa3'); R(0, y + TS - 2, LW, 1, '#2de2e6'); }
    if (E === 'future') { for (x = (RM ? 0 : Math.floor(G.t * 30) % 16); x < LW; x += 16) R(x, y + 7, 6, 1, '#7cf5c9'); }
  } else if (row.type === 'river') {
    var W = Z.w;
    R(0, y, LW, TS, W[0]);
    R(0, y + 6, LW, 4, W[1]);
    var drift = RM ? 0 : G.t * rowV(row) * 6;
    for (var i = 0; i < 7; i++) {
      h = hash(r, i + 90);
      var xx = ((h % LW) + drift) % LW; if (xx < 0) xx += LW;
      R(xx, y + 3 + (i % 3) * 4, 4, 1, W[2]);
      R(xx + 1, y + 4 + (i % 3) * 4, 2, 1, W[3]);
    }
    if (up.type !== 'river') { R(0, y, LW, 2, W[4]); }
    if (dn.type !== 'river') { R(0, y + TS - 1, LW, 1, W[5]); }
    if (z === 5 || E === 'eighties') {
      /* glowing water: little lights drifting under the surface */
      for (i = 0; i < 5; i++) {
        h = hash(r, i + 140);
        var gx = ((h % LW) + drift * 0.5) % LW; if (gx < 0) gx += LW;
        if (RM || Math.floor(G.t * 2 + i) % 3 !== 0) R(gx, y + 4 + (h % 8), 1, 1, z === 5 ? '#8affea' : pick2(h, ['#ff4fa3', '#2de2e6']));
      }
    }
    if (E === 'egypt' && up.type !== 'river') for (x = 3; x < LW; x += 11) { R(x, y - 4, 1, 6, '#5f8a2e'); R(x + 2, y - 5, 1, 7, '#7fae3e'); R(x + 1, y - 6, 2, 2, '#b8a050'); }
    if (E === 'future') { R(0, y + 2, LW, 1, 'rgba(124,245,201,0.35)'); }
  } else if (row.type === 'stamp') {
    R(0, y, LW, TS, '#8d939a');
    R(0, y + 1, LW, 1, '#a3a9b0'); R(0, y + TS - 2, LW, 1, '#6f757c');
    for (x = 0; x < LW; x += 8) { R(x, y + 1, 4, 2, '#ffd23f'); R(x + 4, y + 1, 4, 2, '#2b3036'); R(x, y + TS - 3, 4, 2, '#2b3036'); R(x + 4, y + TS - 3, 4, 2, '#ffd23f'); }
    for (x = 3; x < LW; x += 16) { R(x, y + 7, 6, 1, '#7a8087'); R(x + 2, y + 6, 1, 3, '#7a8087'); }
  }
}
function pick2(h, a) { return a[(h >>> 4) % a.length]; }

function drawObjects(row, r, y) {
  var i, c, x;
  if (row.type === 'grass') {
    var z = zOf(row, r);
    for (c = 0; c < COLS; c++) if (row.block[c]) drawObstacle(row.block[c], c * TS, y, hash(r, c), z, row);
    if (row.peg >= 0) drawPeg(row.peg * TS, y, row.pegDone);
    if (row.bone >= 0) drawBone(row.bone * TS, y, r);
    if (row.buoy != null) drawBuoy(row.buoy * TS, y, row.buoyDone, r);
    if (row.goose) drawGoose(row.goose, Math.round(row.goose.x * TS), y);
    if (row.bonnie) drawBonnie(Math.round(row.bonnie.x * TS), y, row.bonnie);
  } else if (row.type === 'road') {
    if (row.bone >= 0) drawBone(row.bone * TS, y, r);
    for (i = 0; i < row.items.length; i++) {
      x = row.items[i].x;
      if (x > COLS + 0.5 || x + row.items[i].len < -0.5) continue;
      if (ERA.id === 'stone') drawMammoth(row.items[i], Math.round(x * TS), y, row.dir);
      else if (ERA.id === 'rome') drawLegion(row.items[i], Math.round(x * TS), y, row.dir);
      else if (ERA.id === 'egypt' && !row.items[i].van) drawCamel(row.items[i], Math.round(x * TS), y, row.dir);
      else if (ERA.id === 'victorian' && !row.items[i].van) drawCarriage(row.items[i], Math.round(x * TS), y, row.dir);
      else drawCar(row.items[i], Math.round(x * TS), y + (ERA.id === 'future' ? -2 : 0), row.dir);
    }
  } else if (row.type === 'river') {
    for (i = 0; i < row.items.length; i++) {
      x = row.items[i].x;
      if (x > COLS + 0.5 || x + row.items[i].len < -0.5) continue;
      var itm = row.items[i], ix = Math.round(x * TS);
      if (itm.bridge) drawBridge(itm, ix, y, r);
      else if (itm.longship) drawLongship(itm, ix, y, row.dir);
      else if (itm.steamer) drawSteamer(itm, ix, y, row.dir);
      else if (itm.croc) drawCroc(itm, ix, y, row.dir);
      else if (itm.ferry) drawFerry(itm, ix, y, row.dir);
      else if (itm.pad) drawPad(itm, ix, y);
      else if (itm.floe) drawFloe(itm, ix, y);
      else if (itm.raft) drawRaft(itm, ix, y);
      else if (ERA.id === 'stone') drawCanoe(itm, ix, y);
      else drawLog(itm, ix, y);
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
  if (G.duck && G.duck.row === r) drawDuck(G.duck.x * TS, y);
}

function shadow(x, y, w) { g2.fillStyle = 'rgba(10,30,10,0.22)'; g2.fillRect(Math.round(x) + 1, Math.round(y), w - 2, 1); g2.fillRect(Math.round(x), Math.round(y) + 1, w, 1); }

var TREES = [['#1f6e33', '#2f8f3f', '#58b84c', '#7fd26a'], ['#1b6650', '#2a8a68', '#4fb58a', '#7fdcb0'], ['#2b6b26', '#3f8f2c', '#6dbb3a', '#a6e05a']];
var MARKC = ['#ff7a1a', '#ffd23f', '#5cf2ff', '#ff8fb1', '#b38cff', '#5ccf52', '#ff5a4a', '#22b8ab', '#ffffff', '#ffb627'];
function drawObstacle(kind, x, y, h, z, row) {
  var E = ERA.id;
  if (kind === 'jay') { drawJay(x, y); return; }
  if (kind === 'lamp' && E === 'eighties') {
    /* a boombox, bouncing gently */
    var bb = RM ? 0 : Math.floor(G.t * 4) % 2;
    shadow(x + 1, y + 13, 14);
    R(x + 1, y + 4 - bb, 14, 9, '#2a2a36'); R(x + 1, y + 4 - bb, 14, 1, '#4a4a5a'); R(x + 4, y + 1 - bb, 8, 1, '#8a8a9a'); R(x + 4, y + 1 - bb, 1, 3, '#8a8a9a'); R(x + 11, y + 1 - bb, 1, 3, '#8a8a9a');
    R(x + 2, y + 6 - bb, 4, 4, '#ff4fa3'); R(x + 10, y + 6 - bb, 4, 4, '#2de2e6'); R(x + 3, y + 7 - bb, 2, 2, '#15141c'); R(x + 11, y + 7 - bb, 2, 2, '#15141c');
    R(x + 6, y + 6 - bb, 4, 2, '#ffd23f');
    if (!RM) { R(x + 15, y - 1 - bb * 2, 1, 3, '#ff4fa3'); R(x + 16, y - 2 - bb * 2, 1, 1, '#ff4fa3'); R(x - 1, y + bb * 2, 1, 3, '#2de2e6'); }
    return;
  }
  if (kind === 'lamp' && E === 'future') {
    shadow(x + 4, y + 13, 8);
    R(x + 7, y - 2, 2, 12, '#5a6a8a'); R(x + 4, y + 10, 8, 2, '#3a4a6a');
    var hv = RM ? 0 : Math.round(Math.sin(G.t * 3 + h));
    R(x + 3, y - 8 + hv, 10, 4, '#7cf5c9'); R(x + 4, y - 7 + hv, 8, 2, '#e9fff8');
    for (var tz = 0; tz < 14; tz += 2) R(x + 1 + tz, y - 3 + (tz % 4 ? 1 : 0), 2, 1, tz % 4 ? '#ff5fa2' : '#ffd23f');
    return;
  }
  if (kind === 'tree' && E === 'egypt' && z < 4) {
    shadow(x + 3, y + 13, 10);
    R(x + 7, y - 2, 2, 15, '#8a6a3a'); for (var pt = 0; pt < 15; pt += 3) R(x + 6, y - 1 + pt, 4, 1, '#6b4a22');
    R(x + 1, y - 5, 14, 2, '#3f8a3a'); R(x, y - 3, 4, 2, '#3f8a3a'); R(x + 12, y - 3, 4, 2, '#3f8a3a'); R(x + 4, y - 7, 8, 2, '#5aaa4a');
    R(x + 6, y - 3, 2, 2, '#6b4a22'); R(x + 9, y - 3, 2, 2, '#6b4a22');
    return;
  }
  if (kind === 'wreck' && E === 'stone') {
    shadow(x, y + 13, 16);
    R(x + 1, y + 4, 14, 10, '#8a8478'); R(x + 3, y + 2, 10, 3, '#9a9488'); R(x + 3, y + 2, 6, 1, '#b8b2a4'); R(x + 1, y + 13, 14, 1, '#6a6458');
    R(x + 5, y + 7, 2, 2, '#c4522a'); R(x + 8, y + 8, 3, 1, '#c4522a'); R(x + 9, y + 6, 1, 3, '#c4522a');
    return;
  }
  if (kind === 'wreck' && E === 'viking') {
    shadow(x + 1, y + 13, 14);
    R(x + 2, y + 3, 12, 11, '#7a4a28'); R(x + 2, y + 3, 12, 1, '#a8743d'); R(x + 2, y + 7, 12, 1, '#5b3a1c'); R(x + 2, y + 11, 12, 1, '#5b3a1c');
    R(x + 1, y + 4, 1, 9, '#5b3a1c'); R(x + 14, y + 4, 1, 9, '#5b3a1c');
    R(x + 4, y - 3, 8, 6, '#d9a441'); R(x + 5, y - 2, 6, 4, '#b3263a'); R(x + 7, y - 1, 2, 2, '#d9a441');
    return;
  }
  if (kind === 'rubble' && E === 'rome') {
    shadow(x + 3, y + 13, 10);
    R(x + 5, y - 6, 6, 19, '#e8e2d4'); R(x + 5, y - 6, 1, 19, '#fffaf0'); for (var cl = 7; cl < 11; cl += 2) R(x + cl, y - 5, 1, 17, '#c9c2b2');
    R(x + 3, y - 8, 10, 2, '#d8d0c0'); R(x + 3, y + 12, 10, 2, '#c9c2b2');
    return;
  }
  if (kind === 'lamp' && E === 'victorian') {
    shadow(x + 4, y + 13, 8);
    R(x + 7, y - 4, 2, 17, '#2a2a30'); R(x + 5, y + 11, 6, 2, '#2a2a30');
    R(x + 4, y - 9, 8, 6, '#2a2a30'); R(x + 5, y - 8, 6, 4, '#ffd76e'); R(x + 6, y - 11, 4, 2, '#2a2a30');
    return;
  }
  if (kind === 'tree' && E === 'future' && z < 4) {
    /* a festive tree for week 7, with tinsel */
    shadow(x + 2, y + 13, 12);
    R(x + 7, y + 10, 2, 4, '#6b4423');
    R(x + 3, y + 5, 10, 6, '#1f6e4a'); R(x + 4, y + 1, 8, 5, '#2a7a56'); R(x + 6, y - 3, 4, 5, '#2f8a60'); R(x + 7, y - 5, 2, 2, '#2f8a60');
    R(x + 3, y + 8, 10, 1, '#ffd23f'); R(x + 5, y + 3, 6, 1, '#ff5fa2'); R(x + 6, y - 1, 4, 1, '#7cf5c9');
    R(x + 7, y - 7, 2, 2, '#ffd23f');
    if (!RM && Math.floor(G.t * 2 + h) % 2) R(x + 4, y + 6, 1, 1, '#ffffff');
    return;
  }
  if (kind === 'tree' && z === 5) {
    /* night lake: dark willow with fireflies */
    shadow(x + 1, y + 13, 14);
    R(x + 6, y + 8, 4, 6, '#3a2a1c');
    R(x + 2, y - 5, 12, 13, '#1f3f36'); R(x + 1, y - 3, 14, 9, '#1f3f36'); R(x + 4, y - 7, 8, 2, '#1f3f36');
    for (var wl = 2; wl < 14; wl += 3) R(x + wl, y + 2, 1, 6, '#2a5a4a');
    if (RM || Math.floor(G.t * 2 + h) % 3) { R(x + 3 + (h % 9), y - 4 + (h % 7), 1, 1, '#d8ff7a'); R(x + 12 - (h % 5), y + 1, 1, 1, '#d8ff7a'); }
    return;
  }
  if (kind === 'tree' && z === 6) {
    /* tarn: a crag of rock */
    shadow(x + 1, y + 13, 14);
    R(x + 2, y + 2, 12, 12, '#6f6a78'); R(x + 4, y - 3, 8, 6, '#7f7a88'); R(x + 6, y - 6, 4, 4, '#8f8a98');
    R(x + 6, y - 6, 4, 1, '#ffffff'); R(x + 4, y - 3, 3, 1, '#ffffff'); R(x + 2, y + 13, 12, 1, '#4f4a58');
    return;
  }
  if (kind === 'tree' && z === 4) {
    /* snowy pine */
    shadow(x + 2, y + 13, 12);
    R(x + 7, y + 10, 2, 4, '#6b4423');
    R(x + 3, y + 5, 10, 6, '#24583a'); R(x + 4, y + 1, 8, 5, '#2a6644'); R(x + 6, y - 3, 4, 5, '#2f7350'); R(x + 7, y - 5, 2, 2, '#2f7350');
    R(x + 3, y + 5, 10, 1, '#ffffff'); R(x + 4, y + 1, 8, 1, '#ffffff'); R(x + 6, y - 3, 4, 1, '#ffffff'); R(x + 7, y - 5, 2, 1, '#ffffff');
    R(x + 2, y + 9, 2, 1, '#eaf4fa'); R(x + 12, y + 8, 2, 1, '#eaf4fa');
    return;
  }
  if (kind === 'reed') {
    shadow(x + 2, y + 13, 12);
    R(x + 2, y + 11, 12, 3, '#5f8a2e');
    var sx = [3, 5, 7, 9, 11, 13], sh = [9, 13, 11, 14, 10, 8];
    for (var k = 0; k < 6; k++) {
      var top = y + 13 - sh[(k + h) % 6];
      R(x + sx[k] - 1, top, 1, y + 13 - top, k & 1 ? '#7fae3e' : '#5f8a2e');
      if ((k + h) % 3 === 0) { R(x + sx[k] - 2, top - 3, 2, 4, '#6b4423'); R(x + sx[k] - 2, top - 3, 1, 1, '#8a5a30'); }
    }
    R(x + 1, y + 6, 1, 5, '#7fae3e'); R(x + 14, y + 7, 1, 4, '#7fae3e');
    return;
  }
  if (kind === 'rock') {
    shadow(x + 1, y + 13, 14);
    R(x + 2, y + 6, 12, 8, '#7d858b'); R(x + 1, y + 8, 14, 5, '#7d858b'); R(x + 4, y + 4, 8, 2, '#8d969c');
    R(x + 4, y + 4, 5, 1, '#aab3b8'); R(x + 3, y + 6, 3, 2, '#9aa3a8'); R(x + 2, y + 12, 12, 1, '#5d666c');
    if (z === 4) { R(x + 4, y + 3, 8, 2, '#ffffff'); R(x + 2, y + 5, 4, 1, '#ffffff'); R(x + 10, y + 5, 3, 1, '#eaf4fa'); }
    else if (h % 2) { R(x + 9, y + 5, 3, 1, '#6a9a4a'); R(x + 11, y + 6, 2, 1, '#6a9a4a'); }
    return;
  }
  if (kind === 'bollard') {
    shadow(x + 3, y + 13, 10);
    R(x + 5, y + 4, 6, 10, '#2b3036'); R(x + 5, y + 4, 2, 10, '#4a525a');
    R(x + 4, y + 2, 8, 3, '#3a4048'); R(x + 4, y + 2, 8, 1, '#6b737c');
    R(x + 3, y + 8, 10, 2, '#d8c48e'); R(x + 3, y + 8, 10, 1, '#efe0b4'); R(x + 12, y + 10, 2, 3, '#d8c48e');
    return;
  }
  if (kind === 'mark') {
    /* a landmark signpost: on the map once passed */
    var col = MARKC[(row && row.mark) % MARKC.length];
    shadow(x + 3, y + 13, 10);
    R(x + 7, y - 2, 2, 16, '#6b4423'); R(x + 7, y - 2, 1, 16, '#8a5a30');
    R(x + 2, y - 1, 12, 7, '#c99a5c'); R(x + 2, y - 1, 12, 1, '#ddb478'); R(x + 2, y + 5, 12, 1, '#8a5a30');
    R(x + 4, y + 1, 3, 3, col); R(x + 8, y + 1, 4, 1, '#6b4423'); R(x + 8, y + 3, 3, 1, '#6b4423');
    R(x + 9, y - 6, 1, 5, '#5b4a3a'); R(x + 10, y - 6, 4, 2, col);
    return;
  }
  if (kind === 'tree') {
    var t = z === 1 || z === 2 ? TREES[(h % 2) + 1] : TREES[h % 3];
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
    /* sandbags */
    shadow(x + 1, y + 13, 14);
    R(x + 1, y + 9, 7, 4, '#b8a06a'); R(x + 8, y + 9, 7, 4, '#a8915c');
    R(x + 4, y + 5, 8, 4, '#c8b27a'); R(x + 1, y + 9, 7, 1, '#d8c48e'); R(x + 8, y + 9, 7, 1, '#c9b27c'); R(x + 4, y + 5, 8, 1, '#e0cd96');
    R(x + 7, y + 10, 1, 3, '#8a7548'); R(x + 7, y + 6, 1, 3, '#8a7548');
    R(x + 2, y + 12, 13, 1, '#7d6a42');
  } else if (kind === 'wreck') {
    /* reinforced supply crate */
    shadow(x, y + 13, 16);
    R(x + 1, y + 2, 14, 12, '#5b6b3a'); R(x + 1, y + 2, 14, 1, '#7a8c52'); R(x + 1, y + 13, 14, 1, '#3f4a28');
    R(x + 1, y + 2, 1, 12, '#3f4a28'); R(x + 14, y + 2, 1, 12, '#3f4a28');
    R(x + 3, y + 5, 10, 1, '#3f4a28'); R(x + 3, y + 10, 10, 1, '#3f4a28');
    R(x + 6, y + 6, 4, 3, '#c8b27a'); R(x + 7, y + 7, 2, 1, '#ff7a1a');
    for (var k = 0; k < 14; k += 4) R(x + 1 + k, y + 13, 2, 1, '#ffd23f');
  } else if (kind === 'lamp') {
    /* tactical floodlight on a stand */
    shadow(x + 4, y + 13, 8);
    R(x + 5, y + 12, 6, 2, '#2b3036');
    R(x + 7, y - 4, 2, 16, '#4a525a'); R(x + 7, y - 4, 1, 16, '#6b737c');
    R(x + 3, y - 8, 10, 5, '#2b3036'); R(x + 4, y - 7, 8, 3, '#fff2a8');
    if (!RM && Math.floor(G.t * 2 + h) % 3 === 0) { g2.fillStyle = 'rgba(255,242,168,0.25)'; g2.fillRect(x + 1, y - 10, 14, 9); }
  }
}

function drawPeg(x, y, done) {
  /* a wooden fishing peg at the water's edge */
  R(x + 2, y + 15, 2, 3, '#5b3a1c'); R(x + 12, y + 15, 2, 3, '#5b3a1c');
  R(x + 1, y + 8, 14, 7, '#a8743d'); R(x + 1, y + 8, 14, 1, '#c99a5c'); R(x + 1, y + 14, 14, 1, '#6b4220');
  for (var i = 4; i < 15; i += 4) R(x + i, y + 9, 1, 5, '#8b5a2b');
  R(x + 13, y + 2, 1, 7, '#5b4a3a');
  if (done) { R(x + 3, y + 4, 6, 5, '#3f72a8'); R(x + 3, y + 4, 6, 1, '#6a9ad0'); R(x + 4, y + 3, 4, 1, '#2b3036'); R(x + 5, y + 5, 2, 1, '#c9d6dc'); }
  else {
    var bob = RM ? 0 : (Math.floor(G.t * 3) % 2);
    R(x + 14, y + 2, 2, 3, '#ffd23f'); R(x + 14, y + 2, 1, 1, '#ff7a1a');
    R(x + 5, y + 3 + bob, 3, 4, '#ff5a4a'); R(x + 5, y + 3 + bob, 3, 1, '#ffffff'); R(x + 6, y + 1 + bob, 1, 2, '#15281c');
  }
}
function drawBuoy(x, y, done, r) {
  var oy = RM ? 0 : Math.round(Math.sin(G.t * 2.4 + r) * 1);
  R(x + 1, y - 2, 3, 15, '#6b4220'); R(x + 1, y - 2, 1, 15, '#8b5a2b'); R(x + 1, y - 3, 3, 1, '#5b3a1c');
  R(x + 4, y + 4, 4, 1, '#d8c48e');
  R(x + 8, y + 3 + oy, 7, 9, '#ff7a1a'); R(x + 7, y + 5 + oy, 9, 5, '#ff7a1a'); R(x + 7, y + 7 + oy, 9, 2, '#ffffff');
  R(x + 9, y + 3 + oy, 3, 1, '#ffb27a'); R(x + 10, y + 12 + oy, 4, 1, 'rgba(10,50,90,0.35)');
  R(x + 11, y - 2 + oy, 1, 5, '#2b3036');
  if (done) { R(x + 12, y - 2 + oy, 4, 3, '#5ccf52'); }
  else if (RM || Math.floor(G.t * 2) % 2 === 0) { R(x + 10, y - 4 + oy, 3, 2, '#ffd23f'); if (!RM) { g2.fillStyle = 'rgba(255,210,63,0.3)'; g2.fillRect(x + 8, y - 6 + oy, 7, 6); } }
}
function drawFerry(it, x, y, dir) {
  var w = Math.round(it.len * TS) - 2; x += 1;
  R(x + 1, y + 14, w, 1, 'rgba(10,50,90,0.35)');
  R(x, y + 6, w, 7, '#f3f6f8'); R(x, y + 11, w, 2, '#24477a'); R(x, y + 13, w, 1, '#d9472f');
  var bow = dir > 0 ? x + w : x - 2;
  R(bow, y + 7, 2, 5, '#f3f6f8'); R(bow, y + 11, 2, 2, '#24477a');
  R(x + 6, y + 1, w - 12, 6, '#ffffff'); R(x + 6, y + 1, w - 12, 1, '#c9d3dd');
  for (var i = x + 8; i < x + w - 8; i += 5) R(i, y + 3, 3, 2, '#a8dcef');
  var fx = dir > 0 ? x + 8 : x + w - 11;
  R(fx, y - 3, 3, 4, '#ffd23f'); R(fx, y - 3, 3, 1, '#15281c');
  R(x + 2, y + 8, w - 4, 1, '#c9d3dd');
}
function drawPad(it, x, y) {
  for (var k = 0; k < 2; k++) {
    var px = x + 1 + k * 16;
    R(px + 1, y + 4, 13, 9, '#4fae4a'); R(px, y + 6, 15, 5, '#4fae4a'); R(px + 3, y + 3, 9, 1, '#4fae4a');
    R(px + 2, y + 4, 6, 1, '#7fd26a'); R(px + 1, y + 12, 13, 1, '#2f7a2a');
    R(px + 7, y + 3, 1, 5, '#2f7a2a');
    if ((it.seed + k) % 3 === 0) { R(px + 9, y + 6, 3, 3, '#ff8fb1'); R(px + 10, y + 7, 1, 1, '#ffd84a'); }
  }
}
function drawFloe(it, x, y) {
  var w = Math.round(it.len * TS) - 2; x += 1;
  R(x + 1, y + 14, w, 1, 'rgba(10,50,90,0.3)');
  R(x, y + 4, w, 9, '#eef8fd'); R(x + 2, y + 3, w - 5, 1, '#ffffff'); R(x, y + 12, w, 2, '#bfe0f0');
  R(x + 3 + it.seed % 5, y + 6, 5, 1, '#d3ecf8'); R(x + w - 9, y + 9, 4, 1, '#d3ecf8');
}
function drawBone(x, y, r) {
  /* a fish, flapping a little */
  var oy = RM ? 0 : Math.round(Math.sin(G.t * 4 + r) * 1.2);
  shadow(x + 3, y + 12, 10);
  var Y = y + 5 + oy, flap = RM ? 0 : (Math.floor(G.t * 6 + r) % 2);
  R(x + 4, Y + 1, 7, 5, '#9fd3f0'); R(x + 3, Y + 2, 1, 3, '#9fd3f0'); R(x + 5, Y, 5, 1, '#9fd3f0');
  R(x + 5, Y + 5, 5, 1, '#5aa7d6'); R(x + 4, Y + 4, 7, 1, '#7cc0e8');
  R(x + 11, Y + 1 - flap, 1, 2 + flap, '#5aa7d6'); R(x + 12, Y + flap, 1, 5 - flap, '#5aa7d6'); R(x + 13, Y - 1 + flap, 1, 7 - 2 * flap, '#5aa7d6');
  R(x + 5, Y + 2, 1, 1, '#15281c'); R(x + 7, Y + 2, 3, 1, '#ff7a1a');
  if (!RM && Math.floor(G.t * 3 + r) % 4 === 0) { R(x + 9, Y - 2, 1, 1, '#ffffff'); R(x + 8, Y - 1, 3, 1, 'rgba(255,255,255,0.7)'); }
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

var HERD = [['#2b3036', '#4a525a', '#ff3b2f'], ['#3f4a28', '#5b6b3a', '#ffd23f'], ['#1d2a3a', '#3a5068', '#5cf2ff']];
function drawHerdDino(X, Y, dir, d) {
  /* a quadcopter drone, rotors blurring */
  var p = HERD[d.pal], f = RM ? 0 : Math.floor(G.t * 20 + d.ph) % 2;
  var cx = X + 15, cy = Y + 12;
  g2.fillStyle = 'rgba(0,0,0,0.25)'; g2.fillRect(cx - 9, Y + 19, 18, 2);
  R(cx - 9, cy - 1, 18, 2, p[1]);
  R(cx - 4, cy - 3, 8, 6, p[0]); R(cx - 3, cy - 3, 6, 1, p[1]);
  R(cx - 1, cy + 2, 2, 2, '#15141c'); R(cx, cy + 2, 1, 1, '#5cf2ff');
  R(cx - 1, cy - 2, 2, 1, (f ? p[2] : '#ffffff'));
  [-9, 7].forEach(function (ox) {
    R(cx + ox, cy - 3, 2, 3, p[0]);
    R(cx + ox - (f ? 4 : 2), cy - 4, f ? 10 : 6, 1, 'rgba(220,230,240,0.85)');
  });
}

/* ---------- v3.0 drawings ---------- */
function drawGoose(g, x, y) {
  var f = g.dir < 0, w = RM ? 0 : Math.floor(g.ph * 6) % 2, X = x;
  function P2(a, b, w2, h2, c) { R(f ? X + 15 - a - w2 + 1 : X + a, y + b, w2, h2, c); }
  shadow(x + 3, y + 13, 10);
  P2(3, 7, 9, 5, '#f1efe8'); P2(2, 8, 2, 3, '#f1efe8'); P2(4, 6, 6, 1, '#ffffff'); P2(4, 11, 7, 1, '#cfccc2');
  P2(5, 8, 5, 2, '#d8d5cc');
  P2(11, 2, 2, 6, '#2b2b2b'); P2(11, 1, 3, 2, '#2b2b2b'); P2(12, 2, 1, 1, '#ffffff'); P2(14, 2, 2, 1, '#ff9a2a');
  P2(6, 12, 1, 2 - w, '#ff9a2a'); P2(9, 12, 1, 1 + w, '#ff9a2a');
  if (g.lost) { var a = G.t * 5; R(x + 8 + Math.round(Math.cos(a) * 5), y - 2, 1, 1, '#ffd76e'); R(x + 8 + Math.round(Math.cos(a + 3) * 5), y - 1, 1, 1, '#ffd76e'); }
  else if (g.love) { R(x + 6, y - 3, 1, 1, '#ff8fb1'); R(x + 8, y - 3, 1, 1, '#ff8fb1'); R(x + 5, y - 2, 5, 1, '#ff8fb1'); R(x + 6, y - 1, 3, 1, '#ff8fb1'); R(x + 7, y, 1, 1, '#ff8fb1'); }
  else if (g.honk > 0.9) { R(f ? x - 2 : x + 16, y + 1, 2, 1, '#ffffff'); R(f ? x - 3 : x + 17, y - 1, 2, 1, '#ffffff'); }
}
function drawBonnie(x, y, b) {
  /* a small brown toy poodle with no tail, trotting */
  var hop = b.hop > 0 ? -2 : 0, step = RM ? 0 : Math.floor(G.t * 10) % 2, Y = y + hop;
  shadow(x + 3, y + 13, 10);
  R(x + 3, Y + 7, 9, 4, '#8a5a34'); R(x + 2, Y + 6, 3, 3, '#9a6a3e'); R(x + 9, Y + 6, 3, 3, '#9a6a3e');
  R(x + 10, Y + 3, 5, 5, '#9a6a3e'); R(x + 11, Y + 2, 3, 2, '#a87a4a'); R(x + 9, Y + 4, 2, 4, '#7a4a28');
  R(x + 14, Y + 6, 2, 2, '#7a4a28'); R(x + 15, Y + 6, 1, 1, '#1a1210'); R(x + 13, Y + 4, 1, 1, '#1a1210');
  R(x + 3, Y + 11, 2, 2 + step, '#7a4a28'); R(x + 6, Y + 11, 2, 3 - step, '#7a4a28'); R(x + 9, Y + 11, 2, 2 + step, '#7a4a28'); R(x + 11, Y + 11, 2, 3 - step, '#7a4a28');
}
function drawDuck(x, y) {
  var bob = RM ? 0 : Math.round(Math.sin(G.t * 5));
  x = Math.round(x); var Y = y + 4 + bob;
  shadow(x + 3, y + 13, 10);
  R(x + 3, Y + 4, 9, 5, '#c9a06a'); R(x + 2, Y + 5, 2, 3, '#c9a06a'); R(x + 4, Y + 5, 6, 1, '#e0bf8a');
  R(x + 9, Y, 4, 5, '#2f7a4a'); R(x + 10, Y + 1, 1, 1, '#ffffff'); R(x + 13, Y + 2, 2, 2, '#ffb627'); R(x + 9, Y + 4, 4, 1, '#ffffff');
  R(x + 5, Y + 6, 4, 1, '#8a6a3a');
}
function drawJay(x, y) {
  /* Jay on a little stool: messy brown hair, big eyebrows, a bent rod and a fish he is not catching */
  shadow(x + 1, y + 13, 14);
  R(x + 3, y + 11, 8, 2, '#6b4423'); R(x + 4, y + 13, 1, 2, '#6b4423'); R(x + 9, y + 13, 1, 2, '#6b4423');
  R(x + 4, y + 4, 7, 7, '#3f6a8a'); R(x + 4, y + 4, 7, 1, '#5a8aaa');
  R(x + 4, y - 3, 7, 7, '#f0c8a0'); R(x + 3, y - 5, 9, 3, '#6b4423'); R(x + 3, y - 6, 3, 1, '#6b4423'); R(x + 8, y - 6, 3, 1, '#7a5230'); R(x + 11, y - 4, 1, 3, '#6b4423');
  R(x + 5, y - 1, 3, 1, '#3a2414'); R(x + 9, y - 1, 2, 1, '#3a2414');
  R(x + 6, y, 1, 1, '#15281c'); R(x + 9, y, 1, 1, '#15281c'); R(x + 7, y + 2, 2, 1, '#a8604a');
  var wob = RM ? 0 : Math.floor(G.t * 3) % 2;
  R(x + 11, y + 6, 1, 1, '#8b5a2b'); R(x + 12, y + 4, 1, 2, '#8b5a2b'); R(x + 13, y + 2 + wob, 1, 2, '#8b5a2b'); R(x + 14, y + 1 + wob, 1, 1, '#8b5a2b');
  R(x + 15, y + 2 + wob, 1, 6, 'rgba(255,255,255,0.7)');
}
function drawBridge(it, x, y, r) {
  /* a Roman stone bridge: fixed in place, a safe way over */
  var w = Math.round(it.len * TS);
  R(x, y + 1, w, 14, '#b8b0a0'); R(x, y + 1, w, 2, '#d8d0c0'); R(x, y + 13, w, 2, '#8a8478');
  for (var i = 0; i < w; i += 8) R(x + i, y + 3, 1, 10, '#9a9488');
  R(x, y + 7, w, 1, '#9a9488'); R(x - 1, y, 2, 16, '#8a8478'); R(x + w - 1, y, 2, 16, '#8a8478');
}
function drawLongship(it, x, y, dir) {
  var w = Math.round(it.len * TS) - 2; x += 1;
  R(x + 1, y + 14, w, 1, 'rgba(10,50,90,0.35)');
  R(x + 2, y + 7, w - 4, 6, '#7a4a28'); R(x, y + 6, w, 2, '#a8743d'); R(x + 3, y + 12, w - 6, 1, '#5b3a1c');
  var hx = dir > 0 ? x + w - 2 : x;
  R(hx, y + 1, 2, 6, '#7a4a28'); R(dir > 0 ? hx + 1 : hx - 1, y, 2, 2, '#d9a441');
  var tx = dir > 0 ? x : x + w - 2; R(tx, y + 3, 2, 4, '#7a4a28');
  for (var i = x + 6; i < x + w - 6; i += 7) { R(i, y + 7, 4, 4, ((i >> 3) & 1) ? '#d9a441' : '#b3263a'); R(i + 1, y + 8, 2, 2, '#f3ead2'); }
  var m = x + (w >> 1); R(m, y - 8, 1, 14, '#5b3a1c');
  for (var s = 0; s < 6; s++) R(m - 6, y - 7 + s, 13, 1, s % 2 ? '#f3ead2' : '#b3263a');
  var oar = RM ? 0 : Math.floor(G.t * 3) % 2;
  for (i = x + 7; i < x + w - 6; i += 9) R(i - oar, y + 12, 1, 3, '#5b3a1c');
}
function drawSteamer(it, x, y, dir) {
  var w = Math.round(it.len * TS) - 2; x += 1;
  R(x + 1, y + 14, w, 1, 'rgba(10,50,90,0.35)');
  R(x, y + 7, w, 6, '#2a2a30'); R(x, y + 7, w, 1, '#4a4a52'); R(x, y + 12, w, 1, '#a8323e');
  R(x + 4, y + 2, w - 8, 5, '#f3ead2'); for (var i = x + 6; i < x + w - 6; i += 5) R(i, y + 3, 2, 2, '#4a6a7a');
  var fx = dir > 0 ? x + 10 : x + w - 14;
  R(fx, y - 6, 4, 8, '#a8323e'); R(fx, y - 6, 4, 2, '#2a2a30');
  var p = RM ? 0 : (G.t * 2) % 1;
  if (!RM) { g2.fillStyle = 'rgba(230,230,230,' + (0.7 - p * 0.6).toFixed(2) + ')'; g2.fillRect(fx - 1 - Math.round(p * 6 * dir), y - 9 - Math.round(p * 6), 5, 3); }
  var wh = dir > 0 ? x + 4 : x + w - 9; R(wh, y + 8, 5, 5, '#6b4220'); R(wh + 2, y + 8, 1, 5, '#a8743d');
}
function drawCroc(it, x, y, dir) {
  /* a very polite crocodile: green, smiling, with a small bow tie */
  var w = Math.round(it.len * TS) - 2; x += 1;
  R(x + 1, y + 14, w, 1, 'rgba(10,50,90,0.35)');
  R(x + 2, y + 5, w - 4, 8, '#4a8a3a'); R(x + 2, y + 5, w - 4, 1, '#6aaa4a'); R(x + 2, y + 12, w - 4, 1, '#2f6a2a');
  for (var i = x + 6; i < x + w - 8; i += 4) R(i, y + 4, 2, 1, '#3a7a2a');
  var hx = dir > 0 ? x + w - 10 : x, tx = dir > 0 ? x - 3 : x + w - 1;
  R(hx, y + 6, 10, 6, '#5a9a4a'); R(hx, y + 10, 10, 1, '#f3f6f0');
  R(dir > 0 ? hx + 2 : hx + 6, y + 4, 2, 3, '#5a9a4a'); R(dir > 0 ? hx + 2 : hx + 6, y + 4, 2, 1, '#15281c');
  R(tx, y + 8, 4, 3, '#4a8a3a');
  var bt = dir > 0 ? hx - 2 : hx + 10; R(bt, y + 7, 1, 3, '#b3263a'); R(bt + 1, y + 8, 1, 1, '#d9472f'); R(bt + (dir > 0 ? -1 : 1), y + 7, 1, 3, '#b3263a');
}
function drawCanoe(it, x, y) {
  /* a dug out canoe: a hollowed log */
  var w = Math.round(it.len * TS) - 1;
  R(x, y + 13, w, 1, 'rgba(10,50,90,0.35)');
  R(x + 1, y + 4, w - 2, 9, '#8b5a2b'); R(x, y + 6, w, 5, '#8b5a2b'); R(x + 2, y + 5, w - 4, 4, '#5b3a1c'); R(x + 2, y + 5, w - 4, 1, '#3f2814');
  R(x + 1, y + 4, w - 2, 1, '#a8743d'); R(x + 1, y + 12, w - 2, 1, '#6b4220');
  R(x + (w >> 1), y + 4, 1, 8, '#a8743d');
}
function drawMammoth(m, X, y, dir) {
  var w = Math.round(m.len * TS) - 2, x = X + 1, f = dir < 0, st = RM ? 0 : Math.floor(G.t * 4 + m.seed) % 2;
  function P2(a, b, w2, h2, c) { R(f ? x + w - a - w2 : x + a, y + b, w2, h2, c); }
  g2.fillStyle = 'rgba(0,0,0,0.25)'; g2.fillRect(x + 2, y + 13, w - 2, 2);
  P2(2, -2, w - 10, 12, '#7a4a2a'); P2(4, -4, w - 16, 3, '#8a5a34'); P2(1, 2, 2, 6, '#6b4220');
  P2(w - 12, -3, 10, 10, '#8a5a34'); P2(w - 4, 4, 3, 8, '#7a4a2a'); P2(w - 3, 11, 2, 2, '#7a4a2a');
  P2(w - 9, 6, 7, 1, '#f3ead2'); P2(w - 3, 5, 2, 1, '#f3ead2');
  P2(w - 8, -1, 1, 1, '#15281c'); P2(w - 10, 0, 1, 1, '#c9a06a');
  P2(4, 10, 3, 4 - st, '#5b3a1c'); P2(10, 10, 3, 3 + st, '#5b3a1c'); P2(w - 16, 10, 3, 4 - st, '#5b3a1c'); P2(w - 11, 10, 3, 3 + st, '#5b3a1c');
  for (var i = 4; i < w - 12; i += 3) P2(i, 8, 1, 2, '#6b4220');
}
function drawLegion(m, X, y, dir) {
  /* a little marching column of legionaries with red shields */
  var w = Math.round(m.len * TS) - 2, x = X + 1, n = Math.max(2, Math.floor(w / 7)), st = RM ? 0 : Math.floor(G.t * 6 + m.seed) % 2;
  g2.fillStyle = 'rgba(0,0,0,0.22)'; g2.fillRect(x + 1, y + 13, w - 1, 2);
  for (var i = 0; i < n; i++) {
    var lx = x + i * 7 + 1;
    R(lx + 1, y - 1, 4, 3, '#c9a24a'); R(lx + 2, y - 3, 2, 2, '#b3263a');
    R(lx + 1, y + 2, 4, 3, '#f0c8a0');
    R(lx, y + 5, 6, 5, '#b3263a'); R(lx + (dir > 0 ? 4 : 0), y + 4, 3, 7, '#d9a441'); R(lx + (dir > 0 ? 5 : 1), y + 6, 1, 2, '#b3263a');
    R(lx + 1, y + 10, 1, 3 + (st ^ (i & 1)), '#6b4220'); R(lx + 4, y + 10, 1, 4 - (st ^ (i & 1)), '#6b4220');
  }
}
function drawCamel(m, X, y, dir) {
  var w = Math.round(m.len * TS) - 2, x = X + 1, f = dir < 0, st = RM ? 0 : Math.floor(G.t * 5 + m.seed) % 2;
  function P2(a, b, w2, h2, c) { R(f ? x + w - a - w2 : x + a, y + b, w2, h2, c); }
  g2.fillStyle = 'rgba(0,0,0,0.22)'; g2.fillRect(x + 2, y + 13, w - 3, 2);
  P2(2, 4, w - 8, 5, '#c9944a'); P2(5, 1, 5, 4, '#c9944a'); P2(6, 0, 3, 1, '#d9a85a');
  P2(w - 7, -2, 3, 8, '#c9944a'); P2(w - 7, -4, 6, 3, '#c9944a'); P2(w - 3, -3, 1, 1, '#15281c');
  P2(5, 3, 6, 2, '#1fb5a8');
  P2(3, 9, 2, 4 - st, '#a8743d'); P2(7, 9, 2, 4 - (1 - st), '#a8743d'); P2(w - 10, 9, 2, 4 - st, '#a8743d'); P2(w - 7, 9, 2, 4 - (1 - st), '#a8743d');
}
function drawCarriage(m, X, y, dir) {
  var w = Math.round(m.len * TS) - 2, x = X + 1;
  g2.fillStyle = 'rgba(0,0,0,0.25)'; g2.fillRect(x + 1, y + 13, w, 2);
  R(x + 1, y + 2, w - 2, 9, '#2a2a30'); R(x + 1, y + 2, w - 2, 1, '#4a4a52'); R(x + 3, y + 4, w - 6, 3, '#d8c48e');
  R(x + 3, y - 1, w - 6, 3, '#3a3a44');
  R(x + 2, y + 10, 5, 5, '#a8323e'); R(x + w - 7, y + 10, 5, 5, '#a8323e'); R(x + 4, y + 12, 1, 1, '#d8c48e'); R(x + w - 5, y + 12, 1, 1, '#d8c48e');
  R(x + (w >> 1) - 2, y - 4, 4, 3, '#15141c'); R(x + (w >> 1) - 3, y - 1, 6, 1, '#15141c');
}

function drawPlayer(cam) {
  if (state === 'closed') return;
  var dead = G.dead;
  if (dead === 'splash' || dead === 'drift') return;
  var vr = visRow(), px = playerX();
  var t = P.hop ? P.hop.t : 0;
  var arc = P.hop && !P.hop.slide ? Math.sin(Math.PI * t) * (RM ? 3 : 5) : 0;
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
  var rodN = wearing('rod');
  if ((rodN === 'glow' || rodN === 'golden') && !RM && Math.floor(G.t * 3) % 3 !== 0) {
    g2.fillStyle = rodN === 'glow' ? 'rgba(92,242,255,0.35)' : 'rgba(255,215,80,0.4)';
    g2.fillRect((face ? X + 14 : X + 1) - 1, Y - Math.round(arc) + breathe, 3, 3);
  }
  if (G.robin) {
    /* the robin perched on your hat */
    var rx = X + 5, ry = Y - 3 - Math.round(arc) + breathe;
    R(rx, ry, 4, 3, '#6b4a2a'); R(rx + 1, ry + 1, 2, 2, '#e8562a'); R(rx + (face ? 3 : 0), ry, 1, 1, '#15281c'); R(rx + (face ? 4 : -1), ry + 1, 1, 1, '#d9a441');
  }
  if (G.boat && G.boat.t > 0) drawDinghy(X, Y);
}
function drawDinghy(X, Y) {
  R(X - 3, Y + 9, 22, 6, '#f3f6f8'); R(X - 3, Y + 13, 22, 2, '#1f6f99'); R(X - 4, Y + 9, 1, 4, '#f3f6f8'); R(X + 19, Y + 9, 1, 4, '#f3f6f8');
  R(X + 17, Y + 3, 1, 6, '#5b4a3a');
}
function drawDrone(d, cam) {
  var x = Math.round(d.x * TS) + 2, y = Math.round(-d.row * TS - cam) - 6, f = RM ? 0 : Math.floor(G.t * 20) % 2;
  g2.fillStyle = 'rgba(0,0,0,0.2)'; g2.fillRect(x + 2, y + 16, 10, 1);
  R(x, y + 4, 12, 2, '#5a6a3a'); R(x + 3, y + 2, 6, 5, '#3f4a28'); R(x + 5, y + 6, 2, 1, '#5cf2ff');
  R(x - 2 - f, y + 2, 5 + f * 2, 1, 'rgba(220,230,240,0.9)'); R(x + 9 - f, y + 2, 5 + f * 2, 1, 'rgba(220,230,240,0.9)');
  if (d.got) { R(x + 4, y + 8, 4, 2, '#9fd3f0'); R(x + 8, y + 8, 1, 2, '#5aa7d6'); }
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
  var hud = el('div', 'hkg-hud', '<div class="hkg-score"><b>0</b><span></span></div><div><div class="hkg-best">Best <b>0</b></div><span class="hkg-zone"></span></div>');
  var hint = el('div', 'hkg-hint', 'Tap or swipe to move. Arrow keys work too.<br>Fish are bonus points.');
  var tst = el('div', 'hkg-toast');
  var card = el('div', 'hkg-card'); card.hidden = true;
  var cast = el('button', 'hkg-cast', 'Cast a line'); cast.type = 'button'; cast.hidden = true;
  cast.addEventListener('click', function () { unlockAudio(); openPeg(); });
  /* v3.0: gadgets, the era banner and a speech bubble */
  var gads = el('div', 'hkg-gads');
  GADGETS.forEach(function (id, n) {
    var b = el('button', 'hkg-gad'); b.type = 'button'; b.setAttribute('data-g', id);
    b.setAttribute('aria-label', LBY[id].name + ' (key ' + (n + 1) + ')');
    b.appendChild(itemIcon(LBY[id], false)); b.appendChild(el('b', '', '1'));
    b.addEventListener('pointerdown', function (e) { e.preventDefault(); e.stopPropagation(); useGadget(id); });
    b.addEventListener('click', function (e) { if (e.detail === 0) useGadget(id); });
    gads.appendChild(b);
  });
  var era = el('div', 'hkg-era', '<small>Time travel week</small><b>' + ERA.name + '</b><span>' + ERA.line + '</span><i>' + (ERARULE[ERA.id] || '') + '</i>');
  var bubble = el('div', 'hkg-bubble');
  stage.appendChild(cv); stage.appendChild(hud); stage.appendChild(hint); stage.appendChild(tst); stage.appendChild(cast); stage.appendChild(gads); stage.appendChild(bubble); stage.appendChild(era); stage.appendChild(card);
  var pad = el('div', 'hkg-pad');
  var dirs = [['left', -1, 0, '&#9664;', 'Hop left'], ['up', 0, 1, '&#9650;', 'Hop forward'], ['down', 0, -1, '&#9660;', 'Hop back'], ['right', 1, 0, '&#9654;', 'Hop right']];
  dirs.forEach(function (d) {
    var b = el('button', 'hkg-' + d[0], d[3]); b.type = 'button'; b.setAttribute('aria-label', d[4]);
    b.addEventListener('pointerdown', function (e) { e.preventDefault(); unlockAudio(); tryMove(d[1], d[2]); });
    b.addEventListener('click', function (e) { if (e.detail === 0) tryMove(d[1], d[2]); });
    pad.appendChild(b);
  });
  o.appendChild(bar); o.appendChild(stage); o.appendChild(pad);

  ui = { o: o, bar: bar, pause: pause, snd: snd, x: x, stage: stage, canvas: cv, hud: hud, hint: hint, toast: tst, card: card, pad: pad, cast: cast, title: title,
    gads: gads, era: era, bubble: bubble,
    zone: hud.querySelector('.hkg-zone'),
    score: hud.querySelector('.hkg-score b'), bones: hud.querySelector('.hkg-score span'), best: hud.querySelector('.hkg-best'), bestN: hud.querySelector('.hkg-best b') };
  ctx = cv.getContext('2d');
  off = document.createElement('canvas'); octx = off.getContext('2d');

  x.addEventListener('click', close);
  pause.addEventListener('click', function () { unlockAudio(); if (state === 'play') doPause(); else if (state === 'paused') resume(); });
  snd.addEventListener('click', function () { unlockAudio(); store.sound = !store.sound; saveStore(); syncSound(); if (store.sound) sfx('bone'); });
  card.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!b || b.disabled) return;
    var act = b.getAttribute('data-act');
    if (act === 'again') restart();
    else if (act === 'cont') carryOn();
    else if (act === 'map') menu(mapCard);
    else if (act === 'log') menu(logCard);
    else if (act === 'kit') menu(kitCard);
    else if (act === 'trophy') menu(trophyCard);
    else if (act === 'unlocks') menu(unlockCard);
    else if (act === 'secrets') menu(secretCard);
    else if (act === 'boat') menu(boatCard);
    else if (act === 'trip') boatTrip(+b.getAttribute('data-z'));
    else if (act === 'heron') { heronDone(); }
    else if (act === 'back') menuBack();
    else if (act === 'fish') fishCard(b.getAttribute('data-id'));
    else if (act === 'wear') { store.kit[b.getAttribute('data-slot')] = b.getAttribute('data-id'); saveStore(); syncIcon(); kitCard(); }
    else if (act === 'strike') strike();
    else if (act === 'pegoff' || act === 'pegdone') pegLeave();
    else if (act === 'close') close();
    else if (act === 'resume') resume();
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
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
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
  ui.bones.textContent = G.bones ? (G.bones === 1 ? '1 fish' : G.bones + ' fish') : '';
  var b = Math.max(store.best, s);
  ui.bestN.textContent = String(b);
  ui.best.className = 'hkg-best' + (s > G.startBest && G.startBest > 0 ? ' hot' : '');
  if (ui.zone) ui.zone.textContent = ZONES[G.zone].name;
}
var toastT = 0, toastQ = [], toastOn = false;
function toast(t) {
  if (!ui.toast) return;
  if (toastQ.indexOf(t) < 0) toastQ.push(t);
  if (!toastOn) nextToast();
}
function nextToast() {
  var t = toastQ.shift();
  if (t == null || !ui.toast) { toastOn = false; return; }
  toastOn = true;
  ui.toast.textContent = t; ui.toast.className = 'hkg-toast on';
  clearTimeout(toastT);
  toastT = setTimeout(function () { if (ui.toast) ui.toast.className = 'hkg-toast'; toastT = setTimeout(nextToast, 380); }, 1600);
}
function clearToasts() { toastQ = []; toastOn = false; clearTimeout(toastT); if (ui.toast) ui.toast.className = 'hkg-toast'; }
function syncIcon() {
  if (!ui.title) return;
  var old = ui.title.querySelector('canvas');
  if (old) ui.title.replaceChild(iconCanvas(), old);
}

function cardIcon() {
  var c = document.createElement('canvas'); c.width = 14; c.height = 14;
  c.getContext('2d').drawImage(sprites().r, 0, 0);
  return c;
}
function row3() {
  readLadder();
  var nx = LAD.next ? '<p class="hkg-tip" style="text-align:center">Next unlock: ' + LAD.next.name + ', ' + LAD.need + ' more sparks</p>' : '';
  return '<div class="hkg-row3"><button type="button" data-act="map">Map</button><button type="button" data-act="log">Catch log</button><button type="button" data-act="kit">Kit</button></div>' +
    '<div class="hkg-row3 r2"><button type="button" data-act="trophy">Trophies</button><button type="button" data-act="unlocks">Unlocks</button><button type="button" data-act="secrets">Secrets ' + secretsFound() + '/' + SECRETS.length + '</button></div>' + nx;
}
function fotdHtml() {
  var f = fishOfDay(), got = store.fotd[todayKey()];
  return '<div class="hkg-fotd"><span data-fotd="' + f.id + '"></span><span>Fish of the day: <b>' + f.name + '</b>. ' + (got ? 'Caught today. Nice.' : 'Catch one for +10.') + '</span></div>';
}
function fillFotd() {
  var s = ui.card && ui.card.querySelector('[data-fotd]');
  if (s) { var f = FISHBY[s.getAttribute('data-fotd')]; s.parentNode.replaceChild(fishCanvas(f, false), s); }
}
function fishNames(ids) {
  var seen = {}, out = [];
  ids.forEach(function (id) { if (!seen[id] && FISHBY[id]) { seen[id] = 1; out.push(FISHBY[id].name); } });
  return out.join(', ');
}
function overCard() {
  state = 'over';
  var m = G.msg || (G.msg = { k: MSG[G.dead] || MSG.squash, line: Math.random() < 0.3 && ERAMSG[ERA.id] && G.dead === 'squash' ? ERAMSG[ERA.id] : pick((MSG[G.dead] || MSG.squash).m) }), s = score(), sv = G.save;
  var html = (G.newBest && s > 0 ? '<div class="hkg-badge hkg-pop">New best!</div>' : '') +
    '<h2 style="color:' + m.k.col + '">' + m.k.t + '</h2>' +
    '<p>' + m.line + '</p>' +
    '<div class="hkg-nums"><div><span>' + (G.trip ? 'Boat trip' : 'Score') + '</span><b>' + s + '</b></div><div><span>Best</span><b>' + store.best + '</b></div></div>' +
    '<p class="hkg-tip">Reached: ' + ZONES[G.zone].name + (G.runFish.length ? '. Fish: ' + fishNames(G.runFish) : '') + '.</p>';
  if (sv) {
    html += '<button type="button" class="hkg-go" data-act="cont">Carry on from the buoy</button>' +
      '<button type="button" class="hkg-c2" data-act="again">Start a new run</button>' +
      '<p class="hkg-tip">Your place at the ' + ZONES[zoneOf(sv.row)].name + ' buoy is saved. Enter or Space carries on.</p>';
  } else {
    html += '<button type="button" class="hkg-go" data-act="again">Again</button>' +
      '<p class="hkg-tip">Enter or Space also starts again.</p>';
  }
  if (has('boat') && boatZones().length) html += '<button type="button" class="hkg-c2" data-act="boat">Take the dinghy out</button>';
  html += row3() + '<button type="button" class="hkg-c2" data-act="close">Close</button>';
  ui.card.className = 'hkg-card';
  ui.card.innerHTML = html;
  ui.card.insertBefore(cardIcon(), ui.card.firstChild);
  ui.card.hidden = false;
  ui.pause.disabled = true;
  syncGadgets();
  var again = ui.card.querySelector('.hkg-go');
  try { again.focus({ preventScroll: true }); } catch (e) { again.focus(); }
}
function showOver() {
  overCard();
  var s = score();
  overAt = Date.now();
  if (G.newBest && s > 0) {
    sfx('best');
    var cx = (clamp(P.x, 0, COLS - 1) + 0.5) * TS, cy = -P.row * TS;
    for (var i = 0; i < (RM ? 0 : 40); i++) addPart(cx + rnd(-30, 30), cy - rnd(0, 30), rnd(-60, 60), rnd(-110, -30), 120, rnd(0.8, 1.5), pick(['#ffd76e', '#ff8a3a', '#5ccf52', '#ffffff', '#b38cff', '#ff8fb1']), 2);
  }
}
function doPause() {
  if (state !== 'play') return;
  state = 'paused';
  P.queued = null;
  if (ui.cast) ui.cast.hidden = true;
  pauseCard();
}
function pauseCard() {
  ui.card.className = 'hkg-card';
  ui.card.innerHTML = '<h2 style="color:#1f6f99">Paused</h2><p>Take your time. Carry on whenever you like.</p>' + fotdHtml() +
    '<div style="height:10px"></div><button type="button" class="hkg-go" data-act="resume">Carry on</button>' + row3() +
    '<button type="button" class="hkg-c2" data-act="close">Close</button>';
  ui.card.insertBefore(cardIcon(), ui.card.firstChild);
  fillFotd();
  ui.card.hidden = false;
  syncGadgets();
  ui.pause.disabled = false;
  ui.pause.textContent = 'Carry on';
  var b = ui.card.querySelector('.hkg-go');
  try { b.focus({ preventScroll: true }); } catch (e) {}
}
function resume() {
  if (state !== 'paused') return;
  state = 'play'; ui.card.hidden = true; ui.card.innerHTML = '';
  ui.pause.textContent = 'Pause';
  lastTs = 0;
  syncCast();
  focusStage();
}
function restart() {
  readLadder();
  newGame();
  state = 'play';
  ui.card.hidden = true; ui.card.innerHTML = ''; ui.card.className = 'hkg-card';
  ui.pause.disabled = false; ui.pause.textContent = 'Pause';
  ui.hint.className = 'hkg-hint' + (store.games >= 3 ? ' gone' : '');
  if (ui.hint.className.indexOf('gone') < 0) G.hopped = false;
  clearToasts(); syncCast(); syncGadgets();
  updateHud();
  focusStage();
}
/* carry on from the checkpoint buoy: no run used, fish points kept */
function carryOn() {
  if (!G || !G.save) return;
  newGame({ row: G.save.row, bones: G.bones, bonePts: G.bonePts, runFish: G.runFish, startBest: G.startBest, toastDone: G.toastDone, trip: G.trip, tripBase: G.tripBase, gad: G.gad });
  state = 'play';
  ui.card.hidden = true; ui.card.innerHTML = ''; ui.card.className = 'hkg-card';
  ui.pause.disabled = false; ui.pause.textContent = 'Pause';
  clearToasts(); syncCast(); syncGadgets();
  updateHud();
  focusStage();
  toast('Back at the ' + ZONES[G.zone].name + ' buoy');
}
function backToPlay() {
  state = 'play';
  ui.card.hidden = true; ui.card.innerHTML = ''; ui.card.className = 'hkg-card';
  ui.pause.disabled = false; ui.pause.textContent = 'Pause';
  lastTs = 0;
  syncCast(); syncGadgets();
  focusStage();
}

/* ---------- v3.0 the dinghy: a boat trip to any zone reached ----------
   A trip starts at that zone's buoy. It counts as a new run, and its
   score only counts from where the boat dropped you, so it never
   inflates the best score. */
function boatZones() {
  var out = [], fz = zoneOf(store.far);
  for (var i = 1; i <= fz; i++) if (!ZLOCK[i]) out.push(i);
  return out;
}
function boatCard() {
  var zs = boatZones();
  card('<h2 style="color:#1f6f99">The dinghy</h2><p>Hop in and putter out to any zone you have reached. It starts a new run from that buoy.</p>' +
    '<div class="hkg-boat">' + zs.map(function (z) { return '<button type="button" data-act="trip" data-z="' + z + '">' + ZONES[z].name + '</button>'; }).join('') + '</div>' +
    '<p class="hkg-tip">Fish from a peg on a boat trip and they tend to be bigger. Scores on a trip count from the buoy.</p>' +
    '<button type="button" class="hkg-c2" data-act="back">Back</button>');
}
function boatTrip(z) {
  if (!ZONES[z] || ZLOCK[z]) return;
  readLadder();
  menuFrom = null;
  newGame({ row: ZONES[z].at, bones: 0, bonePts: 0, runFish: [], startBest: store.best, toastDone: true, trip: true, tripBase: ZONES[z].at });
  G.boat = { t: 1.4 };
  state = 'play';
  ui.card.hidden = true; ui.card.innerHTML = ''; ui.card.className = 'hkg-card';
  ui.pause.disabled = false; ui.pause.textContent = 'Pause';
  clearToasts(); syncCast(); syncGadgets(); updateHud(); focusStage();
  sfx('toot', 0.6);
  toast('Dropped off at the ' + ZONES[z].name);
}

/* ---------- v2.0 menus: map, catch log, kit ---------- */
var menuFrom = null;
function menu(fn) {
  if (state !== 'menu') menuFrom = state;
  state = 'menu';
  fn();
}
function menuBack() {
  var f = menuFrom; menuFrom = null;
  if (f === 'over') overCard();
  else if (f === 'paused') { state = 'paused'; pauseCard(); }
  else { state = 'paused'; pauseCard(); }
}
function card(html) {
  cardIn(html, true);
  var b = ui.card.querySelector('.hkg-go, [data-act="back"]');
  if (b) { try { b.focus({ preventScroll: true }); } catch (e) {} }
}

/* ---------- v3.0: secrets, item icons ---------- */
function findSecret(id, line) {
  if (store.sec[id]) return false;
  store.sec[id] = 1; saveStore();
  if (line) toast(line);
  toast('Secret found! ' + secretsFound() + ' of ' + SECRETS.length);
  sfx('unlock');
  if (id === 'bonnie' || id === 'robin') { /* nothing else to do */ }
  return true;
}
/* small pixel pictures for the secrets page (sil: a dark shape) */
function secretArt(id, cls, sil) {
  var c = document.createElement('canvas'); c.width = 24; c.height = 24; if (cls) c.className = cls;
  c.setAttribute('role', 'img'); c.setAttribute('aria-label', sil ? 'A secret not found yet' : id);
  var x = c.getContext('2d');
  function B(a, b, w, h, col) { x.fillStyle = sil ? '#4a5a66' : col; x.fillRect(a, b, w, h); }
  if (cls === 'hkg-fishbig') { c.width = 48; c.height = 24; x.translate(12, 0); }
  if (id === 'bonnie') {
    B(5, 12, 12, 6, '#8a5a34'); B(4, 10, 4, 4, '#9a6a3e'); B(13, 10, 4, 4, '#9a6a3e'); B(15, 6, 6, 7, '#9a6a3e'); B(16, 4, 4, 3, '#a87a4a');
    B(14, 7, 2, 6, '#7a4a28'); B(20, 10, 2, 2, '#7a4a28'); B(18, 8, 1, 1, '#1a1210'); B(21, 10, 1, 1, '#1a1210');
    B(5, 18, 2, 4, '#7a4a28'); B(9, 18, 2, 4, '#7a4a28'); B(12, 18, 2, 4, '#7a4a28'); B(15, 18, 2, 4, '#7a4a28');
  } else if (id === 'jay') {
    B(7, 9, 10, 9, '#f0c8a0'); B(6, 5, 12, 5, '#6b4423'); B(5, 4, 4, 2, '#6b4423'); B(13, 3, 4, 2, '#7a5230'); B(17, 6, 2, 4, '#6b4423');
    B(8, 11, 3, 1, '#3a2414'); B(13, 11, 3, 1, '#3a2414'); B(9, 12, 1, 1, '#15281c'); B(14, 12, 1, 1, '#15281c'); B(10, 15, 4, 1, '#a8604a');
    B(6, 18, 12, 6, '#3f6a8a');
  } else if (id === 'heron') {
    B(9, 9, 10, 6, '#b8c0c6'); B(8, 10, 3, 4, '#9aa3a8'); B(7, 3, 2, 7, '#c9d0d4'); B(6, 2, 4, 3, '#e6eaee'); B(6, 2, 4, 1, '#15281c');
    B(1, 3, 5, 1, '#d9a441'); B(8, 3, 1, 1, '#15281c'); B(12, 15, 1, 8, '#d9a441'); B(16, 15, 1, 8, '#d9a441');
    B(0, 5, 4, 2, '#9fd3f0');
  } else if (id === 'wellie') {
    B(8, 3, 8, 14, '#2f6a3a'); B(8, 3, 8, 2, '#3f8a4a'); B(4, 15, 13, 6, '#2f6a3a'); B(4, 20, 13, 2, '#1f4a28'); B(10, 6, 2, 9, '#3f8a4a');
    B(2, 21, 3, 1, '#9fd3f0'); B(17, 19, 3, 1, '#9fd3f0');
  } else if (id === 'robin') {
    B(6, 8, 12, 9, '#6b4a2a'); B(7, 11, 8, 6, '#e8562a'); B(14, 6, 6, 6, '#6b4a2a'); B(17, 8, 1, 1, '#15281c'); B(20, 9, 3, 1, '#d9a441');
    B(3, 10, 4, 3, '#5a3a20'); B(10, 17, 1, 4, '#3a2a1c'); B(13, 17, 1, 4, '#3a2a1c');
  }
  return c;
}
/* a 24x24 icon for any unlock (sil: locked silhouette) */
function itemIcon(it, sil) {
  var c = document.createElement('canvas'); c.width = 24; c.height = 24;
  c.setAttribute('role', 'img'); c.setAttribute('aria-label', sil ? 'Locked' : it.name);
  var x = c.getContext('2d');
  function B(a, b, w, h, col) { x.fillStyle = sil ? '#4a5a66' : col; x.fillRect(a, b, w, h); }
  var s = it.slot;
  if (s === 'char' || s === 'hat' || s === 'body' || s === 'legs') {
    var k = { char: 'op', hat: 'helmet', body: 'tan', legs: 'boots', rod: 'wood' };
    k[s] = it.id;
    var img = spriteSet(k).r;
    if (sil) {
      var t = document.createElement('canvas'); t.width = 14; t.height = 14; var tx = t.getContext('2d');
      tx.drawImage(img, 0, 0); tx.globalCompositeOperation = 'source-in'; tx.fillStyle = '#4a5a66'; tx.fillRect(0, 0, 14, 14); img = t;
    }
    x.imageSmoothingEnabled = false; x.drawImage(img, 0, 0, 14, 14, 3, 3, 18, 18);
  } else if (s === 'rod') {
    var rc = { wood: '#8b5a2b', glow: '#5cf2ff', carbon: '#2b3036', golden: '#ffd23f' }[it.id] || '#8b5a2b';
    for (var i = 0; i < 18; i++) B(3 + i, 21 - i, 2, 2, rc);
    B(2, 18, 4, 5, '#4a3a2a'); B(20, 3, 1, 12, '#c9d6dc'); B(19, 15, 3, 3, '#ff5a4a');
    if (it.id === 'glow' || it.id === 'golden') { B(19, 1, 3, 3, it.id === 'glow' ? '#c8fbff' : '#fff3b0'); }
  } else if (s === 'lure') {
    if (it.id === 'float') { B(10, 2, 4, 6, '#ff5a4a'); B(10, 2, 4, 2, '#ffffff'); B(9, 8, 6, 8, '#ffd23f'); B(11, 16, 2, 6, '#15281c'); }
    else if (it.id === 'spinner') { B(11, 1, 2, 5, '#9aa3a8'); B(7, 6, 10, 7, '#d8dde0'); B(8, 7, 4, 3, '#ffffff'); B(11, 13, 2, 4, '#9aa3a8'); B(9, 17, 6, 2, '#ff7a1a'); B(13, 19, 2, 4, '#9aa3a8'); }
    else { B(11, 3, 2, 14, '#8b5a2b'); B(5, 5, 6, 3, '#ff8fb1'); B(13, 5, 6, 3, '#5cf2ff'); B(6, 9, 5, 3, '#ffd23f'); B(13, 9, 5, 3, '#b38cff'); B(11, 17, 2, 4, '#9aa3a8'); B(9, 20, 3, 2, '#9aa3a8'); }
  } else if (it.id === 'duck') {
    B(4, 11, 14, 8, '#c9a06a'); B(2, 12, 3, 5, '#c9a06a'); B(6, 12, 9, 2, '#e0bf8a'); B(13, 4, 7, 8, '#2f7a4a'); B(15, 6, 2, 2, '#ffffff'); B(20, 7, 4, 3, '#ffb627'); B(13, 11, 7, 1, '#ffffff');
  } else if (it.id === 'drone') {
    B(3, 11, 18, 3, '#5a6a3a'); B(8, 8, 8, 8, '#3f4a28'); B(10, 15, 4, 2, '#5cf2ff'); B(1, 8, 8, 2, '#c9d3dd'); B(15, 8, 8, 2, '#c9d3dd'); B(4, 10, 2, 2, '#2b3036'); B(18, 10, 2, 2, '#2b3036');
  } else if (it.id === 'smoke') {
    B(6, 10, 12, 12, '#3f4a28'); B(9, 7, 6, 4, '#2b3036'); B(10, 4, 4, 3, '#ffd23f'); B(8, 13, 8, 2, '#ffd23f');
    B(14, 1, 5, 4, '#cfd6dc'); B(17, 3, 5, 4, '#e6eaee');
  } else if (it.id === 'boat') {
    B(2, 14, 20, 6, '#f3f6f8'); B(2, 18, 20, 2, '#1f6f99'); B(4, 20, 16, 2, '#c9d3dd'); B(15, 4, 1, 10, '#5b4a3a'); B(9, 5, 6, 8, '#ffd23f'); B(0, 21, 24, 2, '#7cc8f0');
  } else if (it.id === 'ring') {
    B(5, 5, 14, 14, '#ff7a1a'); B(9, 9, 6, 6, sil ? '#e9eef2' : '#e6f4fb'); B(5, 10, 3, 4, '#ffffff'); B(16, 10, 3, 4, '#ffffff'); B(10, 5, 4, 3, '#ffffff'); B(10, 16, 4, 3, '#ffffff');
    if (sil) B(9, 9, 6, 6, '#e9eef2');
  } else if (it.id === 'night') {
    B(0, 0, 24, 24, '#0f2a3a'); B(15, 3, 6, 6, '#fff3b0'); B(17, 3, 4, 4, '#0f2a3a'); B(0, 15, 24, 9, '#0f3a4a'); B(3, 18, 4, 1, '#8affea'); B(12, 20, 5, 1, '#5cf2d6'); B(6, 7, 1, 1, '#ffffff'); B(10, 4, 1, 1, '#ffffff');
  } else if (it.id === 'tarn') {
    B(0, 0, 24, 24, '#bfe6fa'); B(2, 8, 10, 10, '#7f7a88'); B(5, 4, 4, 4, '#8f8a98'); B(5, 4, 4, 1, '#ffffff'); B(12, 6, 10, 12, '#6f6a78'); B(15, 3, 4, 3, '#ffffff'); B(0, 17, 24, 7, '#3fb6c8'); B(4, 20, 6, 1, '#dffbff');
  }
  return c;
}

/* a fish drawn in pixels, facing left. sil: a dark shape for fish not found yet. gold: a golden variant */
function fishCanvas(f, sil, cls, gold) {
  var c = document.createElement('canvas'); c.width = 36; c.height = 18;
  if (cls) c.className = cls;
  c.setAttribute('role', 'img'); c.setAttribute('aria-label', sil ? 'A fish not found yet' : (gold ? 'Golden ' : '') + f.name);
  var x = c.getContext('2d');
  var GOLD = ['#b8860b', '#ffd23f', '#fff3b0', '#e0a820'];
  function px(a, b, col) { x.fillStyle = col; x.fillRect(a, b, 1, 1); }
  function col(i) { return sil ? '#33424e' : gold ? GOLD[i] : f.c[i]; }
  var L = f.eel ? 29 : f.long ? 27 : f.small ? 20 : 24, D = f.d, x0 = f.small ? 5 : 2, cy = 9, tops = [], bots = [], i, yy, k;
  for (i = 0; i <= L; i++) {
    var u = i / L, half;
    if (f.eel) half = D * Math.min(1, u * 5, (1 - u) * 2.2 + 0.3);
    else if (f.pikey) half = D * Math.min(1, Math.pow(u * 2.4, 0.8)) * (1 - Math.pow(u, 3) * 0.55);
    else half = D * Math.pow(Math.sin(Math.PI * Math.min(0.98, 0.08 + u * 0.9)), 0.75) * (f.bighead && u < 0.25 ? 1.1 : 1);
    var top = Math.round(cy - half), bot = Math.round(cy + half * 0.85);
    tops[i] = top; bots[i] = bot;
    for (yy = top; yy <= bot; yy++) px(x0 + i, yy, col(yy < cy - half * 0.35 ? 0 : yy > cy + half * 0.35 ? 2 : 1));
  }
  var fin = col(3), tx = x0 + L + 1;
  if (f.eel) {
    for (i = Math.round(L * 0.4); i <= L; i++) { px(x0 + i, tops[i] - 1, fin); px(x0 + i, bots[i] + 1, fin); }
    px(tx, cy, fin);
  } else {
    px(tx, cy, fin);
    for (k = 0; k < 5; k++) {
      var sp = 1 + k, th = k < 3 ? 2 : 1;
      for (yy = cy - sp; yy <= cy - sp + th; yy++) px(tx + k, yy, fin);
      for (yy = cy + sp - th; yy <= cy + sp; yy++) px(tx + k, yy, fin);
      if (k < 2) for (yy = cy - 1; yy <= cy + 1; yy++) px(tx + k, yy, fin);
    }
    var a = Math.round(L * (f.sail ? 0.28 : 0.38)), b2 = Math.round(L * (f.sail ? 0.64 : 0.58));
    for (i = a; i <= b2; i++) {
      var hgt = f.sail ? 1 + Math.round(3 * (i - a) / (b2 - a)) : f.spiky ? 1 + (i % 2) : (i > a && i < b2 ? 2 : 1);
      for (k = 1; k <= hgt; k++) px(x0 + i, tops[i] - k, fin);
    }
    px(x0 + Math.round(L * 0.45), bots[Math.round(L * 0.45)] + 1, fin);
    px(x0 + Math.round(L * 0.72), bots[Math.round(L * 0.72)] + 1, fin);
    px(x0 + Math.round(L * 0.73), bots[Math.round(L * 0.73)] + 1, fin);
  }
  if (sil) return c;
  if (gold) { px(x0 + 6, cy - 3, '#ffffff'); px(x0 + 14, cy - 1, '#ffffff'); px(x0 + 10, cy + 2, '#fff8d8'); }
  var dark = gold ? '#b8860b' : f.c[0];
  if (f.stripes) [0.3, 0.44, 0.58, 0.72].forEach(function (s) { var ix = Math.round(L * s); for (yy = tops[ix] + 1; yy <= cy + 1; yy++) px(x0 + ix, yy, dark); });
  if (f.bars) for (i = Math.round(L * 0.2); i < L - 1; i += 3) { px(x0 + i, cy, dark); px(x0 + i + 1, cy, dark); }
  if (f.spines) [0.25, 0.36, 0.47].forEach(function (s) { var ix = Math.round(L * s); px(x0 + ix, tops[ix] - 1, '#c9cfc6'); px(x0 + ix, tops[ix] - 2, '#c9cfc6'); });
  function dots(colr, seed, n) {
    for (k = 0; k < n; k++) {
      var ix = Math.round(L * (0.22 + ((hash(seed, k) % 100) / 100) * 0.6));
      var span = Math.max(1, cy + 1 - (tops[ix] + 1));
      px(x0 + ix, tops[ix] + 1 + (hash(k, seed) % span), colr);
    }
  }
  if (f.spots) dots(f.spots, 3, 9);
  if (f.spots2) dots(f.spots2, 8, 6);
  if (f.mottle) dots(f.mottle, 5, 12);
  if (f.scales) for (i = 4; i < L - 3; i += 3) for (yy = tops[i] + 2; yy < bots[i] - 1; yy += 2) px(x0 + i + (yy & 1), yy, f.c[3]);
  if (f.finedge) { px(x0 + Math.round(L * 0.45), bots[Math.round(L * 0.45)] + 1, '#ffffff'); px(x0 + Math.round(L * 0.72), bots[Math.round(L * 0.72)] + 1, '#ffffff'); }
  var ex = x0 + (f.pikey ? 5 : f.eel ? 2 : 3), ey = cy - (f.eel ? 1 : 2);
  if (f.bigeye) { px(ex, ey, '#f3f6f8'); px(ex + 1, ey, '#f3f6f8'); px(ex, ey + 1, '#f3f6f8'); }
  else if (f.eye) { px(ex + 1, ey, f.eye); px(ex, ey - 1, f.eye); }
  else px(ex + 1, ey, '#f3f6f8');
  px(ex, ey, '#15281c');
  px(x0, f.upmouth ? cy - 1 : cy + (f.pikey ? 1 : 0), '#15281c');
  if (f.pikey) { px(x0 + 1, cy + 1, '#15281c'); px(x0 + 2, cy + 1, '#15281c'); px(x0 + 3, cy + 1, '#15281c'); }
  if (f.barbels) {
    px(x0, cy + 1, '#c9a06a'); px(x0 - 1, cy + 2, '#c9a06a');
    if (f.barbels > 2) { px(x0 + 2, cy + 2, '#c9a06a'); px(x0 + 1, cy + 3, '#c9a06a'); }
  }
  if (f.hat) drawFishHat(f.hat, x0 + 2, tops[3], px);
  return c;
}
/* the era fish's silly hats, sat on the head */
function drawFishHat(h, hx, top, px) {
  function B(a, b, w, hh, col) { for (var i = 0; i < w; i++) for (var j = 0; j < hh; j++) px(a + i, b + j, col); }
  var y = top - 1;
  if (h === 'victorian') { B(hx - 1, y, 7, 1, '#15141c'); B(hx, y - 5, 5, 5, '#15141c'); B(hx, y - 2, 5, 1, '#a8323e'); px(hx - 2, y + 4, '#d9a441'); px(hx - 2, y + 5, '#d9a441'); }
  else if (h === 'viking') { B(hx, y - 2, 5, 3, '#9aa3a8'); B(hx + 1, y - 3, 3, 1, '#b8c0c6'); px(hx - 1, y - 3, '#f3ead2'); px(hx - 1, y - 4, '#f3ead2'); px(hx + 5, y - 3, '#f3ead2'); px(hx + 5, y - 4, '#f3ead2'); }
  else if (h === 'egypt') { B(hx - 1, y - 3, 7, 4, '#e2b84a'); for (var k = 0; k < 7; k += 2) B(hx - 1 + k, y - 3, 1, 4, '#1f5fa8'); px(hx + 2, y - 4, '#e2b84a'); }
  else if (h === 'rome') { B(hx, y - 2, 5, 3, '#c9a24a'); B(hx + 1, y - 5, 3, 3, '#b3263a'); B(hx + 2, y - 6, 2, 1, '#b3263a'); }
  else if (h === 'stone') { B(hx, y - 1, 5, 2, '#6b4a2a'); px(hx + 1, y - 2, '#f3ead2'); px(hx + 3, y - 2, '#f3ead2'); }
  else if (h === 'eighties') { B(hx - 1, y - 1, 7, 2, '#ff4fa3'); B(hx - 3, y + 2, 9, 2, '#15141c'); px(hx - 2, y + 2, '#2de2e6'); }
  else if (h === 'future') { B(hx, y - 1, 5, 2, '#b8c8d8'); px(hx + 2, y - 2, '#5a6a7a'); px(hx + 2, y - 3, '#5a6a7a'); px(hx + 2, y - 4, '#7cf5c9'); B(hx - 2, y + 1, 9, 1, '#ff5fa2'); }
}
function zonesShown() { var o = []; for (var i = 0; i < ZONES.length; i++) if (!ZLOCK[i]) o.push(i); return o; }
function mapSvg() {
  var far = store.far, fz = zoneOf(far), zs = zonesShown(), N = zs.length, BH = 80, W = 300, H = 60 + N * BH + 20, o = [];
  var BAND = ['#8fd16f', '#b2cc6a', '#8fc7e6', '#d1aa70', '#e9f3f9', '#2f5a6a', '#b9a8c8'];
  var TXT = ['#15281c', '#15281c', '#15281c', '#15281c', '#15281c', '#e6fff8', '#15281c'];
  function bandY(i) { return H - 84 - zs.indexOf(i) * BH; }
  var lastAt = ZONES[zs[N - 1]].at, endRow = lastAt + 90;
  o.push('<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Lakeside map. Furthest so far: ' + far + ' hops, at ' + ZONES[fz].name + '.">');
  o.push('<rect width="' + W + '" height="' + H + '" fill="#7cc8f0"/>');
  o.push('<rect x="0" y="0" width="' + W + '" height="58" fill="#5aa7d6"/><text x="150" y="34" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="13" font-weight="700" fill="#e6f7ff">' + (fz === zs[N - 1] && far >= endRow ? 'The far shore' : 'Further out...') + '</text>');
  zs.forEach(function (i) {
    var y = bandY(i), on = fz >= i, Z = ZONES[i];
    o.push('<rect x="10" y="' + (y + 4) + '" width="280" height="72" rx="16" fill="' + (on ? BAND[i] : '#c3cbd0') + '" stroke="#15281c" stroke-width="2"/>');
    var tot = FISH.filter(function (f) { return f.z.indexOf(i) >= 0; }), got = tot.filter(function (f) { return store.log[f.id] > 0; });
    o.push('<text x="22" y="' + (y + 22) + '" font-family="Verdana,Arial,sans-serif" font-size="12" font-weight="700" fill="' + (on ? TXT[i] : '#15281c') + '">' + (on ? Z.name : '???') + '</text>');
    if (on) o.push('<text x="278" y="' + (y + 22) + '" text-anchor="end" font-family="Verdana,Arial,sans-serif" font-size="11" fill="' + TXT[i] + '">Fish ' + got.length + ' of ' + tot.length + '</text>');
  });
  var pts = [[150, H - 8, 0]];
  zs.forEach(function (i, n) {
    var nx = n + 1 < N ? ZONES[zs[n + 1]].at : endRow, span = nx - ZONES[i].at, l = n % 2 ? 182 : 118, rr = n % 2 ? 118 : 182;
    pts.push([l, bandY(i) + 62, ZONES[i].at + span * 0.25]);
    pts.push([rr, bandY(i) + 22, ZONES[i].at + span * 0.8]);
  });
  pts.push([150, 48, endRow]);
  function at(row) {
    for (var k = 1; k < pts.length; k++) if (row <= pts[k][2]) {
      var a = pts[k - 1], b = pts[k], t = (row - a[2]) / Math.max(1, b[2] - a[2]);
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    }
    return [pts[pts.length - 1][0], pts[pts.length - 1][1]];
  }
  o.push('<polyline points="' + pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' ') + '" fill="none" stroke="#fffaf0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 9" opacity=".9"/>');
  var done = [], k2;
  for (k2 = 0; k2 < pts.length && pts[k2][2] <= far; k2++) done.push(pts[k2][0] + ',' + pts[k2][1]);
  var me = at(Math.min(far, endRow));
  done.push(me[0] + ',' + me[1]);
  if (done.length > 1) o.push('<polyline points="' + done.join(' ') + '" fill="none" stroke="#ff7a1a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>');
  var side = {};
  MARKS.forEach(function (m) {
    var zi = m.z != null ? m.z : zoneOf(m.at);
    if (ZLOCK[zi] || zs.indexOf(zi) < 0) return;
    side[zi] = (side[zi] || 0) + 1;
    var mx = side[zi] % 2 ? 48 : 252, my = bandY(zi) + 46, lit = !!store.marks[m.id];
    o.push('<g transform="translate(' + mx + ' ' + my + ')"' + (lit ? '' : ' opacity=".45" style="filter:grayscale(1)"') + '>' + markIcon(m.id) + '</g>');
    o.push('<text x="' + mx + '" y="' + (my + 24) + '" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="9" font-weight="700" fill="' + (zi === 5 && lit ? '#e6fff8' : '#15281c') + '">' + (lit ? m.name : '?') + '</text>');
  });
  o.push('<circle cx="' + Math.round(me[0]) + '" cy="' + Math.round(me[1]) + '" r="8" fill="#ff7a1a" stroke="#15281c" stroke-width="2.5"/><circle cx="' + Math.round(me[0]) + '" cy="' + Math.round(me[1]) + '" r="3" fill="#fffaf0"/>');
  o.push('</svg>');
  return o.join('');
}
function markIcon(id) {
  var S = 'stroke="#15281c" stroke-width="1.5"';
  if (id === 'boathouse') return '<rect x="-11" y="-3" width="22" height="11" fill="#a8743d" ' + S + '/><path d="M-14 -3L0 -13L14 -3z" fill="#6b4220" ' + S + '/><rect x="-4" y="1" width="8" height="7" fill="#2a5a8a"/>';
  if (id === 'baithut') return '<rect x="-9" y="-4" width="18" height="12" fill="#c99a5c" ' + S + '/><path d="M-11 -4L0 -11L11 -4z" fill="#d9472f" ' + S + '/><ellipse cx="0" cy="2" rx="5" ry="2.5" fill="#9fd3f0" ' + S + '/>';
  if (id === 'heron') return '<path d="M0 10V-1" stroke="#6b4220" stroke-width="3"/><ellipse cx="2" cy="-4" rx="7" ry="4" fill="#b8c0c6" ' + S + '/><path d="M-3 -6Q-5 -12 -1 -13L-8 -12" fill="none" stroke="#15281c" stroke-width="1.8"/>';
  if (id === 'hide') return '<rect x="-12" y="-6" width="24" height="14" fill="#7a5a34" ' + S + '/><rect x="-8" y="-2" width="16" height="3" fill="#15281c"/><path d="M-14 -6H14L12 -10H-12z" fill="#5b6b3a" ' + S + '/>';
  if (id === 'pylon') return '<path d="M-8 10L-2 -12H2L8 10M-6 2H6M-4 -5H4M-12 -8H12" fill="none" stroke="#4a525a" stroke-width="2"/><path d="M-12 -8V-5M12 -8V-5" stroke="#4a525a" stroke-width="2"/>';
  if (id === 'mill') return '<circle r="10" fill="#a8743d" ' + S + '/><circle r="3" fill="#6b4220"/><path d="M0 -10V10M-10 0H10M-7 -7L7 7M-7 7L7 -7" stroke="#6b4220" stroke-width="1.5"/>';
  if (id === 'ticket') return '<rect x="-8" y="-4" width="16" height="13" fill="#fffaf0" ' + S + '/><path d="M-10 -4H10L8 -10H-8z" fill="#ff5a4a" ' + S + '/><rect x="-4" y="-1" width="8" height="5" fill="#a8dcef"/>';
  if (id === 'lifeboat') return '<rect x="-12" y="-5" width="24" height="13" fill="#5b7a9a" ' + S + '/><path d="M-9 4H9L6 8H-6z" fill="#ff7a1a" ' + S + '/><path d="M-14 -5L0 -12L14 -5z" fill="#3a4a5a" ' + S + '/>';
  if (id === 'icehut') return '<ellipse cx="0" cy="8" rx="13" ry="3" fill="#ffffff" ' + S + '/><rect x="-8" y="-5" width="16" height="12" fill="#d9472f" ' + S + '/><path d="M-10 -5L0 -11L10 -5z" fill="#fffaf0" ' + S + '/><circle cx="9" cy="8" r="2" fill="#2a5a8a"/>';
  if (id === 'lantern') return '<rect x="-12" y="4" width="24" height="4" fill="#a8743d" ' + S + '/><path d="M-6 4V-8M6 4V-8" stroke="#5b3a1c" stroke-width="2"/><rect x="-9" y="-12" width="6" height="6" fill="#ffd76e" ' + S + '/><rect x="3" y="-12" width="6" height="6" fill="#ffd76e" ' + S + '/>';
  if (id === 'owl') return '<path d="M0 12V0" stroke="#5b3a1c" stroke-width="4"/><circle cx="0" cy="-4" r="9" fill="#2a5a4a" ' + S + '/><ellipse cx="0" cy="-3" rx="4" ry="5" fill="#a8743d" ' + S + '/><circle cx="-1.5" cy="-5" r="1.2" fill="#ffd76e"/><circle cx="1.5" cy="-5" r="1.2" fill="#ffd76e"/>';
  if (id === 'bothy') return '<rect x="-10" y="-3" width="20" height="11" fill="#8d969c" ' + S + '/><path d="M-12 -3L0 -11L12 -3z" fill="#4a525a" ' + S + '/><rect x="-3" y="1" width="6" height="7" fill="#6b4220"/><rect x="5" y="-12" width="3" height="6" fill="#6b737c"/>';
  if (id === 'summit') return '<path d="M-13 10L0 -8L13 10z" fill="#7f7a88" ' + S + '/><path d="M-4 -2L0 -8L4 -2z" fill="#ffffff"/><path d="M0 -8V-16" stroke="#15281c" stroke-width="1.5"/><path d="M0 -16H8L6 -13H0z" fill="#ff7a1a" ' + S + '/>';
  return '<ellipse cx="0" cy="7" rx="10" ry="4" fill="#8d969c" ' + S + '/><ellipse cx="0" cy="0" rx="7" ry="3.5" fill="#aab3b8" ' + S + '/><ellipse cx="0" cy="-6" rx="4.5" ry="3" fill="#8d969c" ' + S + '/>';
}
function marksShown() { return MARKS.filter(function (m) { var zi = m.z != null ? m.z : zoneOf(m.at); return !ZLOCK[zi]; }); }
function mapCard() {
  var ms = marksShown(), lit = ms.filter(function (m) { return store.marks[m.id]; }).length;
  card('<h2 style="color:#1f6f99">Lakeside map</h2>' +
    '<p>Furthest so far: <b>' + store.far + '</b> hops, at ' + ZONES[zoneOf(store.far)].name + '. Landmarks found: ' + lit + ' of ' + ms.length + '.</p>' +
    '<div class="hkg-map">' + mapSvg() + '</div>' +
    (has('boat') && boatZones().length && menuFrom === 'over' ? '<button type="button" class="hkg-go" data-act="boat">Take the dinghy out</button>' : '') +
    '<button type="button" class="hkg-' + (has('boat') ? 'c2' : 'go') + '" data-act="log">Catch log</button>' +
    '<button type="button" class="hkg-c2" data-act="back">Back</button>');
}
function logList() {
  var ef = eraFish(), list = FISH.filter(function (f) { return f.z.some(function (z) { return !ZLOCK[z]; }); });
  if (ef) list = [ef].concat(list);
  ERAFISH.forEach(function (f) { if (f !== ef && store.log[f.id] > 0) list.push(f); });
  return list;
}
function logCard() {
  var fz = zoneOf(store.far), list = logList(), real = list.filter(function (f) { return !f.era; });
  var got = real.filter(function (f) { return store.log[f.id] > 0; }).length;
  var h = '<h2 style="color:#1f6f99">Catch log</h2><p>' + got + ' of ' + real.length + ' kinds found. Tap one to read its card.</p>' + fotdHtml() + '<div class="hkg-grid">';
  list.forEach(function (f) {
    var n = store.log[f.id] || 0, sh = store.shiny[f.id] || 0;
    var lab = n ? f.name + (n > 1 ? ' x' + n : '') : f.era ? 'This week only' : (f.z.some(function (z) { return z <= fz; }) ? '???' : 'Further out');
    h += '<button type="button" data-act="fish" data-id="' + f.id + '"' + (n ? '' : ' class="off"') + (f.era ? ' style="border-color:#c48a14;border-width:3px"' : '') + '><span data-fish="' + f.id + '"></span>' +
      lab + (sh ? '<br><small style="color:#b8860b">Golden x' + sh + '</small>' : '') + '</button>';
  });
  h += '</div><button type="button" class="hkg-go" data-act="trophy">Trophy wall</button><button type="button" class="hkg-c2" data-act="back">Back</button>';
  card(h);
  fillFotd();
  var spans = ui.card.querySelectorAll('[data-fish]');
  for (var i = 0; i < spans.length; i++) {
    var f = FISHBY[spans[i].getAttribute('data-fish')];
    spans[i].parentNode.replaceChild(fishCanvas(f, !(store.log[f.id] > 0)), spans[i]);
  }
}
function fishCard(id) {
  var f = FISHBY[id]; if (!f) return;
  var n = store.log[id] || 0, fz = zoneOf(store.far), sh = store.shiny[id] || 0;
  var where = f.era ? '<span class="hkg-tag">Anywhere, this week only</span>' : f.z.filter(function (z) { return !ZLOCK[z]; }).map(function (z) { return '<span class="hkg-tag">' + (z <= fz ? ZONES[z].name : '???') + '</span>'; }).join('');
  card('<h2>' + (n ? f.name : 'Not found yet') + '</h2><p style="text-align:center"><span class="hkg-rar r' + Math.min(3, f.r) + '">' + RARITY[f.r] + '</span>' +
    (store.big[id] ? ' <span class="hkg-rar">Biggest: ' + wtText(store.big[id]) + '</span>' : '') + '</p>' +
    '<div data-big></div>' + (sh ? '<div data-gold></div>' : '') +
    (n ? '<p>' + f.fact + '</p><p class="hkg-tip">Caught ' + (n === 1 ? 'once' : n + ' times') + (sh ? ', golden ' + (sh === 1 ? 'once' : sh + ' times') : '') + '.</p>' :
      '<p>A shape in the water. Fish along the way, or cast from a peg, to find it.</p>') +
    '<p class="hkg-tip">Lives at:</p><p>' + where + '</p>' +
    '<button type="button" class="hkg-go" data-act="log">Back to the log</button>');
  var s = ui.card.querySelector('[data-big]');
  if (s) s.parentNode.replaceChild(fishCanvas(f, !n, 'hkg-fishbig'), s);
  s = ui.card.querySelector('[data-gold]');
  if (s) s.parentNode.replaceChild(fishCanvas(f, false, 'hkg-fishbig', true), s);
}
/* the trophy wall: your biggest of each kind, mounted on wood */
function trophyCard() {
  var list = logList().filter(function (f) { return store.big[f.id] > 0 || !f.era; });
  list.sort(function (a, b) { return (store.big[b.id] || 0) * (b.era ? 0.001 : 1) - (store.big[a.id] || 0) * (a.era ? 0.001 : 1); });
  var top = null; list.forEach(function (f) { if (!f.era && store.big[f.id] > 0 && (!top || WT[f.id] && store.big[f.id] / WT[f.id][1] > store.big[top.id] / WT[top.id][1])) top = f; });
  var h = '<h2 style="color:#1f6f99">Trophy wall</h2><p>Your biggest of each kind. Every weight is a personal best.</p>' +
    (top ? '<p class="hkg-tip">Pride of the wall: your ' + top.name + ', ' + wtText(store.big[top.id]) + '.</p>' : '') + '<div class="hkg-tw">';
  list.forEach(function (f) {
    var b = store.big[f.id];
    var caught = store.log[f.id] > 0;
    h += '<div' + (b ? '' : ' class="off"') + '><span data-tw="' + f.id + '"></span>' + (b ? f.name + '<b>' + wtText(b) + '</b>' : caught ? f.name + '<b>Not weighed yet</b>' : '???<b>&nbsp;</b>') + '</div>';
  });
  h += '</div><button type="button" class="hkg-go" data-act="back">Back</button>';
  card(h);
  var spans = ui.card.querySelectorAll('[data-tw]');
  for (var i = 0; i < spans.length; i++) {
    var f = FISHBY[spans[i].getAttribute('data-tw')];
    spans[i].parentNode.replaceChild(fishCanvas(f, !(store.log[f.id] > 0), '', store.shiny[f.id] > 0), spans[i]);
  }
}
/* the unlock ladder: owned, the next one (with sparks), and silhouettes */
function unlockCard() {
  readLadder();
  var got = LADDER.filter(function (it) { return has(it.id); }).length;
  var h = '<h2 style="color:#1f6f99">Unlocks</h2><p>New things open as you earn sparks. ' + got + ' of ' + LADDER.length + ' so far.</p>' +
    (LAD.next ? '<p class="hkg-tip">Next: <b>' + LAD.next.name + '</b>, ' + LAD.need + ' more sparks.</p>' : '<p class="hkg-tip">Everything unlocked. Legend.</p>') + '<div class="hkg-ugrid">';
  LADDER.forEach(function (it, n) {
    var own = has(it.id), nx = LAD.next && LAD.next.id === it.id;
    h += '<div class="hkg-u' + (own ? '' : nx ? ' nx' : ' off') + '"><span data-u="' + n + '"></span>' + (own || nx ? it.name : '???') +
      (own && it.fx ? '<em>' + it.fx + '</em>' : '') + (nx ? '<small>' + LAD.need + ' more sparks</small>' : '') + '</div>';
  });
  h += '</div><button type="button" class="hkg-go" data-act="kit">Kit</button><button type="button" class="hkg-c2" data-act="back">Back</button>';
  card(h);
  var spans = ui.card.querySelectorAll('[data-u]');
  for (var i = 0; i < spans.length; i++) {
    var it = LADDER[+spans[i].getAttribute('data-u')];
    spans[i].parentNode.replaceChild(itemIcon(it, !has(it.id)), spans[i]);
  }
}
function secretCard() {
  var h = '<h2 style="color:#1f6f99">Secrets</h2><p>Found ' + secretsFound() + ' of ' + SECRETS.length + '. Just for fun, they do not count for anything.</p>';
  SECRETS.forEach(function (s) {
    var f = store.sec[s.id];
    h += '<div class="hkg-sec' + (f ? '' : ' off') + '"><span data-s="' + s.id + '"></span><p><b>' + (f ? s.name : '???') + '</b><br>' + (f ? secretLine(s.id) : s.hint) + '</p></div>';
  });
  h += '<div style="height:6px"></div><button type="button" class="hkg-go" data-act="back">Back</button>';
  card(h);
  var spans = ui.card.querySelectorAll('[data-s]');
  for (var i = 0; i < spans.length; i++) { var id = spans[i].getAttribute('data-s'); spans[i].parentNode.replaceChild(secretArt(id, '', !store.sec[id]), spans[i]); }
}
function secretLine(id) {
  return { bonnie: 'Bonnie, out for a trot. She says hello. She has no tail but wags anyway.',
    jay: 'Jay, at a peg, catching absolutely nothing. "' + (store.sec.jaySaid || SAYINGS[3]) + '"',
    heron: 'A heron pinched a fish right off your line. The cheek.',
    wellie: 'One wellie, left foot, size 9. Still looking for the other one.',
    robin: 'A robin landed on your hat while you stood still. Good camouflage.' }[id] || '';
}
function kitCard() {
  readLadder();
  var h = '<h2 style="color:#1f6f99">Kit</h2><p>Pick what to wear. Rods and lures change the fishing.</p><div class="hkg-kitp"><span data-me></span></div>';
  SLOTS.forEach(function (s) {
    var items = LADDER.filter(function (it) { return it.slot === s[0]; });
    h += '<div class="hkg-slot"><h3>' + s[1] + '</h3><div>';
    items.forEach(function (it) {
      var open = has(it.id), on = wearing(s[0]) === it.id;
      h += '<button type="button" data-act="wear" data-slot="' + s[0] + '" data-id="' + it.id + '"' + (on ? ' class="on" aria-pressed="true"' : ' aria-pressed="false"') + (open ? '' : ' disabled') + '>' +
        '<span data-kit="' + it.id + '"></span><span>' + (open ? it.name : '???') + (open && it.fx ? '<small>' + it.fx + '</small>' : open ? '' : '<small>Unlocks with sparks</small>') + '</span></button>';
    });
    h += '</div></div>';
  });
  var gl = LADDER.filter(function (it) { return it.slot === 'gadget' || it.slot === 'extra'; });
  h += '<div class="hkg-slot"><h3>Gadgets and extras</h3><div>' + gl.map(function (it) {
    var open = has(it.id);
    return '<button type="button" disabled style="opacity:' + (open ? 1 : 0.6) + ';cursor:default"><span data-kit="' + it.id + '"></span><span>' + (open ? it.name : '???') + '<small>' + (open ? it.fx : 'Unlocks with sparks') + '</small></span></button>';
  }).join('') + '</div></div>';
  h += '<div style="height:6px"></div><button type="button" class="hkg-go" data-act="back">Done</button>';
  card(h);
  var me = ui.card.querySelector('[data-me]');
  if (me) { var big = document.createElement('canvas'); big.width = 14; big.height = 14; big.getContext('2d').drawImage(sprites().r, 0, 0); me.parentNode.replaceChild(big, me); }
  var ks = ui.card.querySelectorAll('[data-kit]');
  for (var i = 0; i < ks.length; i++) {
    var it = LBY[ks[i].getAttribute('data-kit')], c;
    if (it.slot === 'char' || it.slot === 'hat' || it.slot === 'body' || it.slot === 'legs') {
      var k = curKit(); k[it.slot] = it.id;
      c = document.createElement('canvas'); c.width = 14; c.height = 14;
      if (has(it.id)) c.getContext('2d').drawImage(spriteSet(k).r, 0, 0);
      else c = itemIcon(it, true);
    } else c = itemIcon(it, !has(it.id));
    ks[i].parentNode.replaceChild(c, ks[i]);
  }
  var cur = ui.card.querySelector('.hkg-slot button.on');
  if (cur) { try { cur.focus({ preventScroll: true }); } catch (e) {} }
}

/* ---------- fishing pegs (v3.0: rods and lures change the minigame) ----------
   Rods: wooden (as before), glowing (wider green), carbon (slower marker),
   golden (golden fish bite more). Lures: classic float (as before),
   spinner (two green zones), feather fly (rare fish bite more).
   Never against a clock: the marker keeps going until you strike. */
var CAST = null;
function castSpeed() { var p = RM ? 3.8 : 2.6; return wearing('rod') === 'carbon' ? p * 1.45 : p; }
function openPeg() {
  var row = onPeg();
  if (!row) return;
  state = 'peg'; P.queued = null;
  if (ui.cast) ui.cast.hidden = true;
  syncGadgets();
  var lure = wearing('lure'), rod = wearing('rod');
  var boat = !!G.trip, fly = lure === 'fly';
  var f = pickFish(zoneOf(P.row), true, boat, fly);
  /* secret: once, the line comes up with a wellie instead */
  var wellie = !store.sec.wellie && store.games >= 2 && Math.random() < 0.12;
  var w = f.era ? 0.24 : [0, 0.34, 0.27, 0.21][f.r];
  if (rod === 'glow') w += 0.07;
  if (lure === 'spinner') w *= 0.8;
  var zones = [];
  var a = rnd(0.06, 0.94 - w);
  zones.push({ a: a, w: w });
  if (lure === 'spinner') {
    var a2 = a > 0.5 ? rnd(0.04, Math.max(0.05, a - w - 0.08)) : rnd(Math.min(0.9 - w, a + w + 0.08), 0.94 - w);
    zones.push({ a: clamp(a2, 0.02, 0.96 - w), w: w });
  }
  CAST = { row: row, f: f, zones: zones, t: 0, p: 0, done: false, miss: 0, wellie: wellie, boat: boat };
  sfx('cast');
  var lureName = LBY[lure] ? LBY[lure].name : 'Classic float';
  cardIn('<h2 style="color:#1f6f99">Fishing peg</h2>' +
    '<p>Your float bobs on the water. Tap Strike when the orange marker is in the green. It keeps going until you are ready.</p>' +
    '<div class="hkg-meter" data-act="strike" aria-hidden="true">' + zones.map(function () { return '<div class="z"></div>'; }).join('') + '<div class="m"></div></div>' +
    '<p class="hkg-tip">' + LBY[rod].name + ', ' + lureName + (boat ? ', from the dinghy' : '') + '</p>' +
    '<p class="hkg-fb" aria-live="polite"></p>' +
    '<button type="button" class="hkg-go" data-act="strike">Strike!</button>' +
    '<button type="button" class="hkg-c2" data-act="pegoff">Not now</button>', true);
  syncMeter();
}
function syncMeter() {
  if (!CAST || !ui.card) return;
  var zs = ui.card.querySelectorAll('.hkg-meter .z'), m = ui.card.querySelector('.hkg-meter .m');
  for (var i = 0; i < zs.length && i < CAST.zones.length; i++) { zs[i].style.left = (CAST.zones[i].a * 100) + '%'; zs[i].style.width = (CAST.zones[i].w * 100) + '%'; }
  if (m) m.style.left = (CAST.p * 100) + '%';
}
function inGreen(p) {
  for (var i = 0; i < CAST.zones.length; i++) { var z = CAST.zones[i]; if (p >= z.a - 0.01 && p <= z.a + z.w + 0.01) return true; }
  return false;
}
function strike() {
  if (state !== 'peg' || !CAST || CAST.done) return;
  if (inGreen(CAST.p)) { if (CAST.wellie) landWellie(); else landFish(); return; }
  CAST.miss++;
  sfx('miss');
  if (CAST.miss >= 2) CAST.zones.forEach(function (z) { if (z.w < 0.5) { z.w = Math.min(0.5, z.w + 0.06); z.a = Math.max(0.02, Math.min(z.a - 0.03, 0.98 - z.w)); } });
  feedback(pick(['The float bobbed, then nothing. Cast again whenever.', 'A nibble, but it swam off. Another go whenever you like.', 'Close. Try again any time.']) +
    (CAST.miss >= 2 ? ' The green bit has grown a little.' : ''));
  syncMeter();
}
function landWellie() {
  CAST.done = true; CAST.row.pegDone = true;
  findSecret('wellie');
  sfx('boing');
  cardIn('<div style="text-align:center"><div class="hkg-badge hkg-pop">Secret found!</div></div>' +
    '<h2>A wellie</h2><div data-big></div>' +
    '<p>Left foot. Size 9. Slightly sad. Someone at this lake has been walking round in one wellie for weeks.</p>' +
    '<p class="hkg-tip">Not a fish, so it does not go in the log. It goes on the secrets page instead.</p>' +
    '<button type="button" class="hkg-go" data-act="pegdone">Back to the bank</button>', true);
  var s = ui.card.querySelector('[data-big]');
  if (s) s.parentNode.replaceChild(secretArt('wellie', 'hkg-fishbig'), s);
}
function landFish() {
  var f = CAST.f, lf = logFish(f, true, CAST.boat, Math.random() < goldChance(true));
  CAST.done = true; CAST.row.pegDone = true;
  G.bonePts += 5; G.bones++;
  G.floats.push({ x: (P.x + 0.5) * TS, y: -P.row * TS - 4, life: 1, txt: '+5' });
  sfx('catch');
  checkFotd(f);
  updateHud();
  /* secret: the heron. Once, a heron swoops in and pinches a fish
     (it still goes in the log, it just does not get to go back) */
  if (!store.sec.heron && store.games >= 1 && !f.era && Math.random() < 0.18) { heronCard(f); return; }
  var badge = f.era ? 'This week only!' : lf.gold ? 'A golden one!' : lf.isNew ? 'New for your catch log!' : lf.pb ? 'Your biggest ' + f.name + ' yet!' : 'Caught ' + store.log[f.id] + ' times';
  cardIn('<div style="text-align:center"><div class="hkg-badge hkg-pop">' + badge + '</div></div>' +
    '<h2>' + (lf.gold ? 'Golden ' : '') + f.name + '</h2><p style="text-align:center"><span class="hkg-rar r' + Math.min(3, f.r) + '">' + RARITY[f.r] + '</span> <span class="hkg-rar">' + wtText(lf.oz) + '</span></p><div data-big></div>' +
    '<p>' + f.fact + '</p>' +
    (lf.pb && !lf.isNew ? '<p><b>New personal best for this fish.</b> It is on your trophy wall.</p>' : '') +
    '<p class="hkg-tip">+5 points. Into the log it goes, then back in the water.</p>' +
    '<button type="button" class="hkg-go" data-act="pegdone">Back to the bank</button>', true);
  var s = ui.card.querySelector('[data-big]');
  if (s) s.parentNode.replaceChild(fishCanvas(f, false, 'hkg-fishbig', lf.gold), s);
}
function heronCard(f) {
  findSecret('heron');
  sfx('heron');
  cardIn('<div style="text-align:center"><div class="hkg-badge hkg-pop">Secret found!</div></div>' +
    '<h2>Heron heist!</h2><div data-big></div>' +
    '<p>A heron swooped in and pinched your ' + f.name + '. It did not even say thank you. Outrageous.</p>' +
    '<p class="hkg-tip">Still counts in your catch log. The heron just gets lunch.</p>' +
    '<button type="button" class="hkg-go" data-act="pegdone">Fair enough</button>', true);
  var s = ui.card.querySelector('[data-big]');
  if (s) s.parentNode.replaceChild(secretArt('heron', 'hkg-fishbig'), s);
}
function heronDone() { pegLeave(); }
function pegLeave() { CAST = null; backToPlay(); }

/* ---------- the checkpoint buoy ----------
   Hop on it and the run is tied off there: if the run ends, he can
   carry on from this buoy. No questions (taken out 29 Oct 2026). */
function tieOff(row) {
  row.buoyDone = true;
  G.save = { row: row.r };
  sfx('buoy');
  toast('Tied off. If this run ends, carry on from here');
}
function focusStage() { try { ui.canvas.setAttribute('tabindex', '-1'); ui.canvas.focus({ preventScroll: true }); } catch (e) {} }

/* ---------- cards ---------- */
function cardIn(html, wide) {
  ui.card.className = 'hkg-card' + (wide ? ' hkg-wide' : '');
  ui.card.innerHTML = html;
  ui.card.hidden = false;
  ui.pause.disabled = true;
  var f = ui.card.querySelector('input, .hkg-go, .hkg-opt');
  if (f) { try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }
}
function feedback(t) { var f = ui.card.querySelector('.hkg-fb'); if (f) f.innerHTML = t; }
function onKey(e) {
  if (state === 'closed') return;
  var k = e.key, tgt = e.target, onBtn = tgt && tgt.tagName === 'BUTTON';
  if (k === 'Escape' || k === 'Esc') {
    e.preventDefault();
    if (state === 'menu') menuBack(); else if (state === 'peg') pegLeave(); else close();
    return;
  }
  if (k === 'Tab') { trapTab(e); return; }
  if (state === 'menu') return;
  if (state === 'peg') {
    if ((k === ' ' || k === 'Spacebar' || k === 'Enter') && !onBtn) { e.preventDefault(); strike(); }
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
      var go = ui.card.querySelector('.hkg-go');
      if (go && Date.now() - overAt > 350) go.click();
    } else if (mv) e.preventDefault();
    return;
  }
  if (state === 'paused') {
    if (mv || ((k === 'Enter' || k === ' ') && !onBtn)) { e.preventDefault(); resume(); }
    return;
  }
  if (k === 'p' || k === 'P') { e.preventDefault(); doPause(); return; }
  if (k === 'm' || k === 'M') { store.sound = !store.sound; saveStore(); syncSound(); return; }
  if (k === '1' || k === '2' || k === '3') { e.preventDefault(); var gid = GADGETS[+k - 1]; if (has(gid)) useGadget(gid); return; }
  if ((k === 'c' || k === 'C' || (k === 'Enter' && !onBtn)) && onPeg()) { e.preventDefault(); openPeg(); return; }
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
  if (state === 'peg' && CAST && !CAST.done) {
    CAST.t += dt;
    CAST.p = 0.5 - 0.5 * Math.cos(CAST.t * Math.PI * 2 / castSpeed());
    syncMeter();
  }
  if (state !== 'paused' && state !== 'closed' && state !== 'menu' && state !== 'peg' && state !== 'buoy') update(dt);
  render();
}

function open() {
  if (state !== 'closed') return;
  opener = document.activeElement;
  unlockAudio();
  RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  loadStore(); readEra(); migrate(); readLadder(); SPR = null;
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
  focusStage();
  syncGadgets();
  /* the era banner, then any unlocks to celebrate */
  var fresh = freshUnlocks();
  clearTimeout(eraT);
  if (fresh.length && state === 'play') { ui.era.className = 'hkg-era gone'; celebrate(fresh); }
  else eraT = setTimeout(function () { if (ui.era) ui.era.className = 'hkg-era gone'; }, 3600);
}
var eraT = 0;
function celebrate(list) {
  state = 'paused';
  sfx('unlock');
  var h = '<div class="hkg-badge hkg-pop">New unlock' + (list.length > 1 ? 's' : '') + '!</div><h2 style="color:#1f6f99">' + (list.length > 1 ? list.length + ' new things' : list[0].name) + '</h2>' +
    '<div class="hkg-new">' + list.map(function (it, n) { return '<div><span data-cel="' + n + '"></span>' + it.name + '</div>'; }).join('') + '</div>' +
    '<p>' + (list.length === 1 && list[0].fx ? list[0].fx : 'Your sparks did that. Find them in Kit and Unlocks.') + '</p>' +
    '<p class="hkg-tip">This week: ' + ERA.name + '. ' + (ERARULE[ERA.id] || '').replace(/^This week: (.)/, function (a, c) { return c.toUpperCase(); }) + '</p>' +
    '<button type="button" class="hkg-go" data-act="resume">Let us go</button><button type="button" class="hkg-c2" data-act="kit">Try it on in Kit</button>';
  ui.card.className = 'hkg-card';
  ui.card.innerHTML = h;
  var spans = ui.card.querySelectorAll('[data-cel]');
  for (var i = 0; i < spans.length; i++) spans[i].parentNode.replaceChild(itemIcon(list[+spans[i].getAttribute('data-cel')], false), spans[i]);
  ui.card.hidden = false;
  ui.pause.disabled = false; ui.pause.textContent = 'Carry on';
  var b = ui.card.querySelector('.hkg-go'); try { b.focus({ preventScroll: true }); } catch (e) {}
}
function close() {
  if (state === 'closed') return;
  state = 'closed';
  cancelAnimationFrame(raf); raf = 0;
  clearToasts();
  CAST = null; menuFrom = null; clearTimeout(eraT);
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
  loadStore(); readLadder();
  if (note) note.textContent = (store.best > 0 ? 'Best: ' + store.best + '.' : 'No best yet.') +
    (kinds() ? ' Fish found: ' + kinds() + ' of ' + FISH.length + '.' : '');
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
        bones: G.bones, best: store.best, games: store.games, runs: store.runs, credited: store.credited, dead: G.dead, LH: LH, rowType: G.rows[P.row] && G.rows[P.row].type,
        zone: G.zone, far: store.far, kinds: kinds(), log: store.log, marks: store.marks, save: G.save ? G.save.row : null, onPeg: !!onPeg(), cast: ui.cast ? !ui.cast.hidden : false,
        castP: CAST ? CAST.p : null, kit: curKit(), base: G.base, runFish: G.runFish.slice(), gad: G.gad, trip: G.trip };
    },
    /* start a run part way out, as if carrying on from that row's buoy */
    teleport: function (row) {
      newGame({ row: row, bones: 0, bonePts: 0, runFish: [], startBest: store.best, toastDone: true });
      state = 'play'; ui.card.hidden = true; ui.pause.disabled = false; clearToasts(); updateHud();
      return true;
    },
    /* strike with the marker in (true) or out of (false) the green */
    strikeAt: function (hit) {
      if (!CAST) return false;
      var z0 = CAST.zones[0], p = 0.02;
      if (hit) p = z0.a + z0.w / 2;
      else { for (var q = 0; q <= 100; q++) if (!inGreen(q / 100)) { p = q / 100; break; } }
      CAST.p = p; CAST.t = Math.acos(1 - 2 * p) / (Math.PI * 2) * castSpeed();
      strike();
      return true;
    },
    cast: function () { return CAST ? { zones: CAST.zones, f: CAST.f.id, wellie: CAST.wellie } : null; },
    gad: function (id) { useGadget(id); return G ? G.gad : null; },
    v3: function () { readLadder(); return { era: ERA.id, sparks: LAD.sparks, have: Object.keys(HAVE), next: LAD.next && LAD.next.id, need: LAD.need, zlock: ZLOCK, sec: store.sec, big: store.big, shiny: store.shiny, own: store.own, fotd: fishOfDay().id, smoke: G && G.smokeT, duck: G && G.duck, drone: !!(G && G.drone) }; },
    secret: function (id) { return findSecret(id); },
    goose: function () { var r = P.row + 1, row = { r: r, type: 'grass', z: G.zone, block: [], paved: false, bone: -1, reach: [], peg: -1, goose: { x: clamp(Math.round(P.x) + 3, 0, COLS - 1), dir: -1, honk: 0, ph: 0 } }; for (var c = 0; c < COLS; c++) { row.block[c] = 0; row.reach[c] = true; } G.rows[r] = row; return true; },
    jay: function () { var r = P.row + 1, row = { r: r, type: 'grass', z: G.zone, block: [], paved: false, bone: -1, reach: [], peg: -1 }; for (var c = 0; c < COLS; c++) { row.block[c] = 0; row.reach[c] = true; } row.block[Math.round(P.x)] = 'jay'; G.rows[r] = row; return true; },
    bonnie: function () { var row = G.rows[P.row]; if (row && row.type === 'grass') { row.bonnie = { x: Math.round(P.x) - 2.5, dir: 1, t: 0 }; return true; } return false; },
    state: function () { return state; },
    tree: function () { var row = G.rows[P.row]; if (!row || !row.block) return false; var c = Math.round(P.x); row.block[c + (c < COLS - 1 ? 1 : -1)] = 'tree'; return true; },
    eraCatch: function () { if (!CAST) return false; var ef = eraFish(); if (ef) CAST.f = ef; CAST.wellie = false; return !!ef; },
    fishCanvas: function (id, sil) { return fishCanvas(FISHBY[id], sil); },
    rows: function () { var o = {}; for (var k in G.rows) o[k] = { type: G.rows[k].type, z: G.rows[k].z, ice: !!G.rows[k].ice, ferry: !!G.rows[k].ferry, peg: G.rows[k].peg, buoy: G.rows[k].buoy, mark: G.rows[k].mark, dir: G.rows[k].dir, dock: !!G.rows[k].dock, stone: G.rows[k].stone }; return o; },
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
      } else if (kind === 'peg') {
        row = { r: r, type: 'grass', block: [], paved: false, bone: -1, reach: [], peg: Math.round(P.x) };
        row.z = G.zone;
        for (c = 0; c < COLS; c++) { row.block[c] = 0; row.reach[c] = true; }
      } else if (kind === 'buoy') {
        row = dockRow(r, false); row.buoy = Math.round(P.x);
      } else if (kind === 'weir' || kind === 'weirmiss') {
        row = { r: r, type: 'weir', z: 2, dir: 1, stone: [], block: [], reach: [], bone: -1 };
        for (c = 0; c < COLS; c++) { row.stone[c] = kind === 'weir' ? c === Math.round(P.x) + 1 : c !== Math.round(P.x) + 1; row.block[c] = row.stone[c] ? 0 : 'water'; row.reach[c] = row.stone[c]; }
      } else if (kind === 'ice') {
        for (var q = 0; q < 2; q++) {
          var ir = { r: r + q, type: 'grass', z: 4, ice: true, block: [], paved: false, bone: -1, reach: [], peg: -1 };
          for (c = 0; c < COLS; c++) { ir.block[c] = 0; ir.reach[c] = true; }
          G.rows[r + q] = ir;
        }
        return true;
      } else if (kind === 'ferry') {
        row = { r: r, type: 'river', z: 3, dir: 1, speed: 2, bone: -1, ferry: true, mod: 0, phase: 'wait', pt: 30, items: [{ x: P.x - 1, len: 3, ferry: true, seed: 3 }] };
      } else return false;
      G.rows[r] = row;
      return true;
    },
    move: function (dx, dr) { tryMove(dx, dr); },
    reducedMotion: function () { return RM; }
  };
}
})();
