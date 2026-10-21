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
   - A checkpoint buoy where each zone starts. One question from
     HK's core targets ties off there, so a run that ends can carry
     on from that buoy. Always optional.
   - A Lakeside map: zones reached and landmarks found, linked to
     the catch log.

   No timers, no nagging, standing still is always fine.
   Instant restart, calm messages, sound can be turned off.

   Home page:  <script src="/hk/crossy.js?v=1" data-button="1"></script>
               (adds a Play button and a one line note to .hero)
   Any page:   window.HKCrossy.open() opens the game.
   Saves { best, games, sound, runs, credited, far, log, marks, kit,
   seen } in b5.hk.crossy.v1 on this device.
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
var store = { best: 0, games: 0, sound: true, runs: 0, credited: 0, far: 0, log: {}, marks: {}, kit: {}, seen: {} };
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
    }
  } catch (e) {}
}
function saveStore() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ best: store.best, games: store.games, sound: store.sound, runs: store.runs, credited: store.credited,
      far: store.far, log: store.log, marks: store.marks, kit: store.kit, seen: store.seen }));
  } catch (e) {}
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
/* When the HQ break gate is on (/hk/break.js), goes are earned with
   sparks there instead, so runs are free during a break. */
function gated() { return !!window.HKGate; }
function takeRun() {
  if (gated()) return true;
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
    w: ['#6fb3d8', '#69add2', '#c8ebfa', '#a3d8f0', '#4a8fb9', '#e4f6ff'], road: '#6c7886' }
];
function zoneOf(r) { for (var i = ZONES.length - 1; i > 0; i--) if (r >= ZONES[i].at) return i; return 0; }
function zoneStart(r) { for (var i = 1; i < ZONES.length; i++) if (ZONES[i].at === r) return i; return 0; }

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
  { id: 'charr', name: 'Arctic charr', r: 3, z: [4], d: 4, c: ['#3a5260', '#8aa0aa', '#f06a3a', '#f08a5a'], spots: '#f3e7c8', finedge: 1,
    fact: 'Arctic charr have lived in a few cold UK lakes since the last Ice Age.' }
];
var FISHBY = {};
FISH.forEach(function (f) { FISHBY[f.id] = f; });
var RARITY = ['', 'Common', 'Uncommon', 'Rare'];
function kinds() { var n = 0; for (var k in store.log) if (FISHBY[k] && store.log[k] > 0) n++; return n; }
function pickFish(z, peg) {
  var list = FISH.filter(function (f) { return f.z.indexOf(z) >= 0; }), tot = 0, w = [];
  list.forEach(function (f, i) { w[i] = f.r === 1 ? 10 : f.r === 2 ? (peg ? 6 : 4) : (peg ? 2.4 : 0.9); tot += w[i]; });
  var x = Math.random() * tot;
  for (var i = 0; i < list.length; i++) { x -= w[i]; if (x <= 0) return list[i]; }
  return list[0];
}
/* adds a fish to the log; true when it is new */
function logFish(f) {
  var isNew = !(store.log[f.id] > 0);
  store.log[f.id] = (store.log[f.id] || 0) + 1;
  if (G) G.runFish.push(f.id);
  saveStore();
  return isNew;
}

/* Landmarks light up on the map the first time a run passes them. */
var MARKS = [
  { id: 'boathouse', name: 'Old boathouse', at: 14 }, { id: 'baithut', name: 'Bait hut', at: 34 },
  { id: 'heron', name: 'Heron post', at: 66 }, { id: 'hide', name: 'Bird hide', at: 92 },
  { id: 'pylon', name: 'Pylon', at: 124 }, { id: 'mill', name: 'Mill wheel', at: 152 },
  { id: 'ticket', name: 'Ticket hut', at: 194 }, { id: 'lifeboat', name: 'Lifeboat shed', at: 228 },
  { id: 'icehut', name: 'Ice fishing hut', at: 276 }, { id: 'cairn', name: 'Stone cairn', at: 312 }
];

/* Kit: looks only. need: { zone: n } reached zone n on any run, or { fish: n } kinds in the log. */
var KIT = {
  hat: [{ id: 'helmet', name: 'Ops helmet' }, { id: 'bucket', name: 'Bucket hat', need: { zone: 1 } }, { id: 'woolly', name: 'Woolly hat', need: { zone: 4 } }],
  body: [{ id: 'tan', name: 'Field jacket' }, { id: 'camo', name: 'Camo jacket', need: { zone: 2 } }],
  legs: [{ id: 'boots', name: 'Boots' }, { id: 'waders', name: 'Waders', need: { fish: 5 } }],
  rod: [{ id: 'wood', name: 'Wooden rod' }, { id: 'glow', name: 'Glowing rod', need: { fish: 10 } }]
};
var SLOTS = [['hat', 'Hat'], ['body', 'Jacket'], ['legs', 'Legs'], ['rod', 'Rod']];
function kitOpen(it) {
  if (!it.need) return true;
  if (it.need.zone) return zoneOf(store.far) >= it.need.zone;
  return kinds() >= it.need.fish;
}
function needText(it) {
  if (!it.need) return '';
  return it.need.zone ? 'Reach ' + ZONES[it.need.zone].name.replace(/^The /, 'the ') : 'Find ' + it.need.fish + ' kinds of fish';
}
function wearing(slot) {
  var id = store.kit[slot], list = KIT[slot];
  for (var i = 0; i < list.length; i++) if (list[i].id === id && kitOpen(list[i])) return id;
  return list[0].id;
}
/* new kit since last time: returns names, and remembers them */
function newKit() {
  var out = [];
  SLOTS.forEach(function (s) {
    KIT[s[0]].forEach(function (it) { if (it.need && kitOpen(it) && !store.seen[it.id]) { store.seen[it.id] = 1; out.push(it.name); } });
  });
  if (out.length) saveStore();
  return out;
}

/* Checkpoint buoy questions, from HK's core targets (English, Foundation 2):
   facts in a text, formats, summing up, linking sentences, punctuation.
   o[0] is right; options are shuffled when shown. */
var BUOY = [
  { t: 'Facts', q: '<div class="extract">Lakeside Bait Hut. Open Saturday and Sunday, 8am to 4pm. Maggots &#163;2 a tub.</div>When is the bait hut open?', o: ['Saturday and Sunday', 'Every day', 'Monday to Friday'], why: 'The notice says Saturday and Sunday.' },
  { t: 'Facts', q: '<div class="extract">Lakeside Bait Hut. Open Saturday and Sunday, 8am to 4pm. Maggots &#163;2 a tub.</div>How much is one tub of maggots?', o: ['&#163;2', '&#163;4', '&#163;8'], why: 'Maggots are &#163;2 a tub.' },
  { t: 'Facts', q: '<div class="extract">Kai caught a perch at the reed beds. It weighed one pound. He put it back in the water.</div>Where did Kai catch the perch?', o: ['At the reed beds', 'At the weir', 'At the jetty'], why: 'The first sentence says the reed beds.' },
  { t: 'Facts', q: '<div class="extract">The ferry leaves the jetty at 10:15. It takes 20 minutes to cross the lake.</div>How long does the crossing take?', o: ['20 minutes', '15 minutes', '10 minutes'], why: 'It takes 20 minutes to cross. 10:15 is when it leaves.' },
  { t: 'Facts', q: '<div class="extract">Club rules: use barbless hooks. Take all litter home. No fishing from the bridge.</div>Where is fishing not allowed?', o: ['From the bridge', 'From the jetty', 'From the reeds'], why: 'The last rule says no fishing from the bridge.' },
  { t: 'Facts', q: '<div class="extract">Mia and her dad went to the frozen lake on Tuesday. They saw three swans on the ice.</div>How many swans did they see?', o: ['Three', 'Two', 'Four'], why: 'They saw three swans.' },
  { t: 'Facts', q: '<div class="extract">The Lakeside Fishing Match is on 12 May. There are prizes for the biggest fish. Entry is free.</div>How much does it cost to enter?', o: ['Nothing, it is free', '&#163;12', '&#163;5'], why: 'Entry is free.' },
  { t: 'Formats', q: 'You are writing a letter. Where does <b>Dear Sam,</b> go?', o: ['At the start', 'In the middle', 'At the very end'], why: 'The greeting opens a letter.' },
  { t: 'Formats', q: 'Which is the best way to end a letter to a friend?', o: ['See you soon, Alex', 'Dear Alex,', 'Once upon a time'], why: 'A letter ends with a sign off and your name.' },
  { t: 'Formats', q: 'What does a poster for a fishing match need most?', o: ['A big clear title, the date and the place', 'Lots of tiny writing and no title', 'A greeting like Dear Sir'], why: 'A poster needs to be read quickly, so the key facts go big.' },
  { t: 'Formats', q: 'You are writing instructions for setting up a rod. What helps the reader most?', o: ['Numbered steps in order', 'One long paragraph', 'A sign off at the end'], why: 'Instructions work best as steps in order.' },
  { t: 'Formats', q: 'What goes in the subject line of an email?', o: ['A few words saying what the email is about', 'The whole message', 'Your home address'], why: 'The subject line is a short title for the email.' },
  { t: 'Formats', q: 'Which would make the best heading for a leaflet about the weir?', o: ['Staying Safe at the Weir', 'the water was cold and i', 'Thanks, see you later'], why: 'A heading is short and tells you what the leaflet is about.' },
  { t: 'Formats', q: 'In a diary entry, what usually goes at the top?', o: ['The day or the date', 'A list of prices', 'A sign off'], why: 'A diary entry starts with the day or date.' },
  { t: 'Summing up', q: '<div class="extract">Pike hide among the reeds and keep very still.</div><div class="extract">When a small fish swims past, the pike darts out at speed to catch it.</div>Which sentence sums up both parts?', o: ['Pike hide and wait, then dart out to catch fish.', 'Pike are green.', 'Reeds grow in lakes.'], why: 'It covers the hiding and the catching.' },
  { t: 'Summing up', q: '<div class="extract">In winter the lake can freeze. The ice may be thick near the edge but thin in the middle.</div><div class="extract">Never walk on the ice. Fish from the bank instead.</div>What is the main idea?', o: ['Frozen lakes are risky, so stay off the ice.', 'Ice is cold.', 'Fish swim in the middle.'], why: 'Both parts are about the ice being unsafe.' },
  { t: 'Summing up', q: '<div class="extract">The old boathouse was built over a hundred years ago. Boats were kept inside.</div><div class="extract">Today it is a cafe where anglers stop for tea.</div>Which sums it up best?', o: ['The old boathouse once stored boats and is now a cafe.', 'Anglers like tea.', 'Boats are made of wood.'], why: 'It covers the past and the present.' },
  { t: 'Summing up', q: '<div class="extract">Litter at the lake can hurt birds. Old fishing line can wrap around their legs.</div><div class="extract">That is why the club asks everyone to take their litter home.</div>What is the main idea?', o: ['Litter harms wildlife, so take it home.', 'Birds have legs.', 'The club has lots of members.'], why: 'Both parts are about litter and wildlife.' },
  { t: 'Summing up', q: '<div class="extract">Carp feed on the bottom of the lake. They suck up food from the mud.</div><div class="extract">Many anglers use sweetcorn as bait.</div>Which detail shows that carp feed on the bottom?', o: ['They suck up food from the mud.', 'Anglers use sweetcorn.', 'Carp live in lakes.'], why: 'The mud is at the bottom of the lake.' },
  { t: 'Summing up', q: '<div class="extract">The ferry runs every hour in summer.</div><div class="extract">In winter it only runs at weekends, because fewer people visit.</div>What is this mainly about?', o: ['When the ferry runs at different times of year', 'How to drive a ferry', 'Why people like summer'], why: 'Both parts tell you when it runs.' },
  { t: 'Linking', q: 'Pick the best word for the gap.<div class="extract">It started to rain. ___ we packed up the rods.</div>', o: ['So', 'But', 'Because'], why: 'So shows what happened because of the rain.' },
  { t: 'Linking', q: 'Pick the best word for the gap.<div class="extract">The water was calm. ___ a huge carp jumped out!</div>', o: ['Suddenly,', 'Firstly,', 'Because'], why: 'Suddenly shows something surprising happened.' },
  { t: 'Linking', q: 'Pick the best word for the gap.<div class="extract">I set up my rod. ___ I put the bait on the hook.</div>', o: ['Next,', 'However,', 'Although'], why: 'Next shows the order things happened in.' },
  { t: 'Linking', q: 'Pick the best word for the gap.<div class="extract">I wanted to fish at the weir, ___ it was closed.</div>', o: ['but', 'so', 'because'], why: 'But shows something did not go to plan.' },
  { t: 'Linking', q: 'Which sentence would come first in a paragraph about a fishing trip?', o: ['On Saturday, we went fishing at the lake.', 'Finally, we packed up and went home.', 'After that, I caught a roach.'], why: 'It sets the scene: when and where.' },
  { t: 'Linking', q: 'Pick the best word for the gap.<div class="extract">Perch have stripes. ___ they have a spiky fin on their back.</div>', o: ['Also,', 'Instead,', 'Finally,'], why: 'Also adds another fact.' },
  { t: 'Linking', q: 'Which word would start the last sentence of a paragraph about your day?', o: ['Finally', 'Firstly', 'Suddenly'], why: 'Finally shows the end.' },
  { t: 'Punctuation', q: 'Which sentence is punctuated correctly?', o: ['We went to the lake on Monday.', 'we went to the lake on Monday.', 'We went to the lake on monday'], why: 'A capital letter to start, a capital for Monday, and a full stop.' },
  { t: 'Punctuation', q: 'What goes at the end?<div class="extract">Did you catch anything</div>', o: ['A question mark ?', 'A full stop .', 'A comma ,'], why: 'It is a question.' },
  { t: 'Punctuation', q: 'What goes at the end?<div class="extract">Wow, that is a massive pike</div>', o: ['An exclamation mark !', 'A question mark ?', 'A comma ,'], why: 'It shows surprise.' },
  { t: 'Punctuation', q: 'Which sentence has capital letters in the right places?', o: ['Sam and I fished at Lake Windermere.', 'sam and I fished at lake windermere.', 'Sam and i fished at Lake windermere.'], why: 'Names, places and I always take a capital letter.' },
  { t: 'Punctuation', q: 'Which sentence is a question?', o: ['Where is the bait box?', 'The bait box is here.', 'Pass me the bait box.'], why: 'It asks something and ends with a question mark.' },
  { t: 'Punctuation', q: 'Where should the full stop go?<div class="extract">I caught a roach it was silver</div>', o: ['I caught a roach. It was silver.', 'I caught. A roach it was silver.', 'I caught a roach it. Was silver.'], why: 'Each full idea gets its own sentence.' },
  { t: 'Punctuation', q: 'Which word needs a capital letter?', o: ['london', 'fish', 'lake'], why: 'Names of places start with a capital letter.' }
];

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
  if (k.rod === 'glow') { pal.R = '#5cf2ff'; pal.Y = '#fff7a8'; put(0, 13, 'Y'); }
  return { rows: rows, pal: pal };
}
function curKit() { return { hat: wearing('hat'), body: wearing('body'), legs: wearing('legs'), rod: wearing('rod') }; }
var SPR = null, SPRK = '';
function spriteSet(k) {
  var L = kitLook(k);
  return { r: sprite(L.rows, L.pal, false), l: sprite(L.rows, L.pal, true), rb: sprite(L.rows, L.pal, false, true), lb: sprite(L.rows, L.pal, true, true) };
}
function sprites() {
  var k = curKit(), key = k.hat + k.body + k.legs + k.rod;
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
'.hkg-cast{position:absolute;left:50%;bottom:14px;z-index:3;transform:translateX(-50%);min-height:52px;padding:8px 20px;border-radius:16px;border:3px solid #15281c;background:#ffd76e;color:#1b1206;font-weight:900;font-size:1.15rem;box-shadow:0 5px 0 #15281c;white-space:nowrap}' +
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
  if (n === 'hop') {
    var z = G ? G.zone : 0;
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
    [[392, 523, 659], [330, 392, 523], [440, 554, 659], [392, 494, 587], [659, 784, 988]][zz].forEach(function (f, i) { tone(f, 0, 0.2, 'triangle', 0.06, i * 0.12); });
    if (zz === 1) { tone(140, 110, 0.12, 'square', 0.05, 0.45); tone(150, 115, 0.12, 'square', 0.05, 0.62); }
    else if (zz === 2) hiss(1.4, 900, 400, 0.18, 0.4, 0.3);
    else if (zz === 3) { tone(196, 194, 0.6, 'sawtooth', 0.03, 0.45); tone(247, 245, 0.6, 'sawtooth', 0.025, 0.45); }
    else if (zz === 4) { hiss(1.6, 2400, 700, 0.12, 0.6, 0.3); tone(2093, 0, 0.12, 'sine', 0.04, 0.6); tone(2637, 0, 0.14, 'sine', 0.035, 0.8); }
  }
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

/* sv: carry on from a checkpoint buoy { row, bones, bonePts, runFish, startBest, toastDone } */
function newGame(sv) {
  var base = sv ? sv.row : 0, mi = 0;
  while (mi < MARKS.length && MARKS[mi].at < base + 3) mi++;
  G = {
    rows: {}, next: base - 16, chunk: null, riverDir: 1, base: base, cont: !!sv,
    maxRow: base, minRow: base, bones: sv ? sv.bones : 0, bonePts: sv ? sv.bonePts : 0, t: 0, cam: 0, shake: 0,
    parts: [], floats: [], dead: null, deadT: 0, toastDone: sv ? sv.toastDone : store.best === 0,
    startBest: sv ? sv.startBest : store.best, hopped: false, honkT: 0, newBest: false,
    zone: zoneOf(base), runFish: sv ? sv.runFish.slice() : [], save: null, pegs: 0, markI: mi
  };
  P = { x: 4, row: base, hop: null, face: 1, log: null, queued: null, land: 0, bump: 0, bumpDir: 0, blinkT: 2 };
  genUpTo(base + 32);
  G.cam = camTarget(base);
}

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
    if (opts.length) { row.peg = pick(opts); G.pegs++; }
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
  var d = diff(r), z = zoneOf(r);
  if (z === 3 && Math.random() < 0.55) return ferryRow(r);
  G.riverDir = -G.riverDir;
  var row = { r: r, type: 'river', z: z, dir: G.riverDir, items: [], bone: -1 };
  row.speed = (0.75 + 1.05 * d) * rnd(0.8, 1.2);
  var kind = z === 4 ? 'floe' : z === 1 && Math.random() < 0.5 ? 'pad' : Math.random() < 0.3 ? 'raft' : 'log';
  var x0 = XMIN + Math.random() * 2, x = x0, gMin = 1.2, gMax = 2.3 + 1.2 * d;
  for (var k = 0; k < 20; k++) {
    var it = kind === 'raft' ? { len: 2, raft: true } : kind === 'pad' ? { len: 2, pad: true } :
      kind === 'floe' ? { len: irnd(2, 3), floe: true } : { len: irnd(2, d < 0.4 ? 4 : 3), raft: false };
    it.seed = irnd(0, 9999);
    if (x + it.len + gMin > x0 + SPAN) break;
    it.x = x; row.items.push(it);
    x += it.len + rnd(gMin, gMax);
  }
  spread(row.items, x0, (gMin + gMax) / 2);
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
  if (row.type === 'road' || row.type === 'river') {
    var dx = rowV(row) * dt;
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
    P.x += rowV(row) * dt;
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
    if (dst.type === 'weir' && dr) tx += dst.dir;   /* the current carries the hop along */
    if (tx < 0 || tx > COLS - 1) { bump(dx, dr); return; }
    if (dst.type === 'grass' && dst.block[tx]) { bump(dx, dr); return; }
  }
  P.log = null;
  P.hop = { fx: fx, fr: fr, tx: tx, tr: tr, t: 0 };
  syncCast();
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
    var fs = pickFish(zoneOf(P.row), false);
    if (logFish(fs)) toast('New fish: ' + fs.name + '!');
    newKit().forEach(function (n) { toast('New kit: ' + n); });
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
  if (row.buoy === P.x && !row.buoyDone && state === 'play') { P.queued = null; openBuoy(row); return; }
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
  newKit().forEach(function (n) { toast('New kit: ' + n); });
  toast('Hop on the buoy to tie off');
}

function score() { return G.maxRow + G.bonePts; }

function addPart(x, y, vx, vy, g, life, c, s) {
  if (G.parts.length > 260) return;
  G.parts.push({ x: x, y: y, vx: vx, vy: vy, g: g, life: life, max: life, c: c, s: s || 1 });
}

var MSG = {
  squash: { t: 'Flattened!', col: '#e2541f', m: ['That patrol truck was not stopping.', 'Wrong lane, operator.', 'Flat as a pancake, still holding the rod.', 'Beep beep. The truck won that one.'] },
  splash: { t: 'Splash!', col: '#1f86d1', m: ['Wrong way to get to the fish.', 'In the lake. Kit is soaked.', 'Missed the log by a boot.'] },
  drift: { t: 'Splash!', col: '#1f86d1', m: ['The log drifted right off the edge.', 'Nice ride, shame about the ending.'] },
  stamp: { t: 'Spotted!', col: '#8a4fb5', m: ['The drones picked you up.', 'Should have waited for the sweep to pass.', 'Buzz buzz. Busted.'] }
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
  if (G.maxRow > store.far) store.far = G.maxRow;
  saveStore();
  if (ui.cast) ui.cast.hidden = true;
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

function zOf(row, r) { return row.z != null ? row.z : zoneOf(r); }
function drawGround(row, r, y) {
  var c, h, x, up = G.rows[r + 1] || forestFallback(r + 1), dn = G.rows[r - 1] || forestFallback(r - 1);
  var z = zOf(row, r), Z = ZONES[z];
  if (row.type === 'grass' && row.dock) {
    R(0, y, LW, TS, Z.w[0]);
    R(0, y + 2, LW, 12, '#a8743d');
    for (x = 0; x < LW; x += 6) { R(x, y + 2, 1, 12, '#7d5228'); R(x + 1, y + 2, 5, 1, '#c99a5c'); }
    R(0, y + 13, LW, 1, '#6b4220');
    for (x = 2; x < LW; x += 24) { R(x, y + 1, 2, 14, '#5b3a1c'); R(x, y + 1, 2, 1, '#8b5a2b'); }
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
      }
    }
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
      var itm = row.items[i], ix = Math.round(x * TS);
      if (itm.ferry) drawFerry(itm, ix, y, row.dir);
      else if (itm.pad) drawPad(itm, ix, y);
      else if (itm.floe) drawFloe(itm, ix, y);
      else if (itm.raft) drawRaft(itm, ix, y);
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
}

function shadow(x, y, w) { g2.fillStyle = 'rgba(10,30,10,0.22)'; g2.fillRect(Math.round(x) + 1, Math.round(y), w - 2, 1); g2.fillRect(Math.round(x), Math.round(y) + 1, w, 1); }

var TREES = [['#1f6e33', '#2f8f3f', '#58b84c', '#7fd26a'], ['#1b6650', '#2a8a68', '#4fb58a', '#7fdcb0'], ['#2b6b26', '#3f8f2c', '#6dbb3a', '#a6e05a']];
var MARKC = ['#ff7a1a', '#ffd23f', '#5cf2ff', '#ff8fb1', '#b38cff', '#5ccf52', '#ff5a4a', '#22b8ab', '#ffffff', '#ffb627'];
function drawObstacle(kind, x, y, h, z, row) {
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
  if (wearing('rod') === 'glow' && !RM && Math.floor(G.t * 3) % 3 !== 0) {
    g2.fillStyle = 'rgba(92,242,255,0.35)';
    g2.fillRect((face ? X + 14 : X + 1) - 1, Y - Math.round(arc) + breathe, 3, 3);
  }
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
  stage.appendChild(cv); stage.appendChild(hud); stage.appendChild(hint); stage.appendChild(tst); stage.appendChild(cast); stage.appendChild(card);
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
    else if (act === 'back') menuBack();
    else if (act === 'fish') fishCard(b.getAttribute('data-id'));
    else if (act === 'wear') { store.kit[b.getAttribute('data-slot')] = b.getAttribute('data-id'); saveStore(); syncIcon(); kitCard(); }
    else if (act === 'strike') strike();
    else if (act === 'pegoff' || act === 'pegdone') pegLeave();
    else if (act === 'bopt') buoyPick(+b.getAttribute('data-i'));
    else if (act === 'bnext') { BQ.q = nextBuoyQ(); BQ.tries = 0; BQ.settled = false; buoyCard(false); }
    else if (act === 'bdone' || act === 'bskip') buoyLeave();
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
  return '<div class="hkg-row3"><button type="button" data-act="map">Map</button><button type="button" data-act="log">Catch log</button><button type="button" data-act="kit">Kit</button></div>';
}
function fishNames(ids) {
  var seen = {}, out = [];
  ids.forEach(function (id) { if (!seen[id] && FISHBY[id]) { seen[id] = 1; out.push(FISHBY[id].name); } });
  return out.join(', ');
}
function overCard() {
  state = 'over';
  var m = G.msg || (G.msg = { k: MSG[G.dead] || MSG.squash, line: pick((MSG[G.dead] || MSG.squash).m) }), s = score(), sv = G.save;
  var canRun = gated() || store.runs > 0;
  var html = (G.newBest && s > 0 ? '<div class="hkg-badge hkg-pop">New best!</div>' : '') +
    '<h2 style="color:' + m.k.col + '">' + m.k.t + '</h2>' +
    '<p>' + m.line + '</p>' +
    '<div class="hkg-nums"><div><span>Score</span><b>' + s + '</b></div><div><span>Best</span><b>' + store.best + '</b></div></div>' +
    '<p class="hkg-tip">Reached: ' + ZONES[G.zone].name + (G.runFish.length ? '. Fish: ' + fishNames(G.runFish) : '') + '.</p>';
  if (sv) {
    html += '<button type="button" class="hkg-go" data-act="cont">Carry on from the buoy</button>' +
      (canRun ? '<button type="button" class="hkg-c2" data-act="again">Start a new run</button>' : '') +
      '<p class="hkg-tip">Your place at the ' + ZONES[zoneOf(sv.row)].name + ' buoy is saved. Enter or Space carries on.</p>';
  } else if (canRun) {
    html += '<button type="button" class="hkg-go" data-act="again">Again</button>' +
      '<p class="hkg-tip">' + (gated() ? '' : runsWord(store.runs) + ' left. ') + 'Enter or Space also starts again.</p>';
  } else {
    html += '<button type="button" class="hkg-go" data-act="again">Earn more runs</button>' +
      '<p class="hkg-tip">That was your last run for now. A few questions earn more.</p>';
  }
  html += row3() + '<button type="button" class="hkg-c2" data-act="close">Close</button>';
  ui.card.className = 'hkg-card';
  ui.card.innerHTML = html;
  ui.card.insertBefore(cardIcon(), ui.card.firstChild);
  ui.card.hidden = false;
  ui.pause.disabled = true;
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
  ui.card.innerHTML = '<h2 style="color:#1f6f99">Paused</h2><p>Take your time. Carry on whenever you like.</p>' +
    '<div style="height:14px"></div><button type="button" class="hkg-go" data-act="resume">Carry on</button>' + row3() +
    '<button type="button" class="hkg-c2" data-act="close">Close</button>';
  ui.card.insertBefore(cardIcon(), ui.card.firstChild);
  ui.card.hidden = false;
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
  newGame();
  if (!takeRun()) { showGate(); return; }
  state = 'play';
  ui.card.hidden = true; ui.card.innerHTML = ''; ui.card.className = 'hkg-card';
  ui.pause.disabled = false; ui.pause.textContent = 'Pause';
  ui.hint.className = 'hkg-hint' + (store.games >= 3 ? ' gone' : '');
  if (ui.hint.className.indexOf('gone') < 0) G.hopped = false;
  clearToasts(); syncCast();
  updateHud();
  focusStage();
  runToast();
}
/* carry on from the checkpoint buoy: no run used, fish points kept */
function carryOn() {
  if (!G || !G.save) return;
  newGame({ row: G.save.row, bones: G.bones, bonePts: G.bonePts, runFish: G.runFish, startBest: G.startBest, toastDone: G.toastDone });
  state = 'play';
  ui.card.hidden = true; ui.card.innerHTML = ''; ui.card.className = 'hkg-card';
  ui.pause.disabled = false; ui.pause.textContent = 'Pause';
  clearToasts(); syncCast();
  updateHud();
  focusStage();
  toast('Back at the ' + ZONES[G.zone].name + ' buoy');
}
function backToPlay() {
  state = 'play';
  ui.card.hidden = true; ui.card.innerHTML = ''; ui.card.className = 'hkg-card';
  ui.pause.disabled = false; ui.pause.textContent = 'Pause';
  lastTs = 0;
  syncCast();
  focusStage();
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
  else if (f === 'gate') showGate();
  else { state = 'paused'; pauseCard(); }
}
function card(html) {
  cardIn(html, true);
  var b = ui.card.querySelector('.hkg-go, [data-act="back"]');
  if (b) { try { b.focus({ preventScroll: true }); } catch (e) {} }
}

/* a fish drawn in pixels, facing left. sil: a dark shape for fish not found yet */
function fishCanvas(f, sil, cls) {
  var c = document.createElement('canvas'); c.width = 36; c.height = 18;
  if (cls) c.className = cls;
  c.setAttribute('role', 'img'); c.setAttribute('aria-label', sil ? 'A fish not found yet' : f.name);
  var x = c.getContext('2d');
  function px(a, b, col) { x.fillStyle = col; x.fillRect(a, b, 1, 1); }
  function col(i) { return sil ? '#33424e' : f.c[i]; }
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
  var dark = f.c[0];
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
  return c;
}
function mapSvg() {
  var far = store.far, fz = zoneOf(far), W = 300, H = 460, o = [];
  var BAND = ['#8fd16f', '#b2cc6a', '#8fc7e6', '#d1aa70', '#e9f3f9'];
  function bandY(i) { return 376 - i * 80; }
  o.push('<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Lakeside map. Furthest so far: ' + far + ' hops, at ' + ZONES[fz].name + '.">');
  o.push('<rect width="' + W + '" height="' + H + '" fill="#7cc8f0"/>');
  o.push('<rect x="0" y="0" width="' + W + '" height="58" fill="#5aa7d6"/><text x="150" y="34" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="13" font-weight="700" fill="#e6f7ff">' + (fz >= 4 && far >= 400 ? 'The far shore' : 'Further out...') + '</text>');
  for (var i = 0; i < ZONES.length; i++) {
    var y = bandY(i), on = fz >= i, Z = ZONES[i];
    o.push('<rect x="10" y="' + (y + 4) + '" width="280" height="72" rx="16" fill="' + (on ? BAND[i] : '#c3cbd0') + '" stroke="#15281c" stroke-width="2"/>');
    var tot = FISH.filter(function (f) { return f.z.indexOf(i) >= 0; }), got = tot.filter(function (f) { return store.log[f.id] > 0; });
    o.push('<text x="22" y="' + (y + 22) + '" font-family="Verdana,Arial,sans-serif" font-size="12" font-weight="700" fill="#15281c">' + (on ? Z.name : '???') + '</text>');
    if (on) o.push('<text x="278" y="' + (y + 22) + '" text-anchor="end" font-family="Verdana,Arial,sans-serif" font-size="11" fill="#15281c">Fish ' + got.length + ' of ' + tot.length + '</text>');
  }
  /* the path: two bends per zone */
  var pts = [[150, 452, 0]];
  for (i = 0; i < ZONES.length; i++) {
    var span = (i + 1 < ZONES.length ? ZONES[i + 1].at : ZONES[i].at + 100) - ZONES[i].at, l = i % 2 ? 182 : 118, rr = i % 2 ? 118 : 182;
    pts.push([l, bandY(i) + 62, ZONES[i].at + span * 0.25]);
    pts.push([rr, bandY(i) + 22, ZONES[i].at + span * 0.8]);
  }
  pts.push([150, 48, 400]);
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
  var me = at(Math.min(far, 400));
  done.push(me[0] + ',' + me[1]);
  if (done.length > 1) o.push('<polyline points="' + done.join(' ') + '" fill="none" stroke="#ff7a1a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>');
  MARKS.forEach(function (m, j) {
    var zi = zoneOf(m.at), mx = j % 2 ? 252 : 48, my = bandY(zi) + 46, lit = !!store.marks[m.id];
    o.push('<g transform="translate(' + mx + ' ' + my + ')"' + (lit ? '' : ' opacity=".45" style="filter:grayscale(1)"') + '>' + markIcon(m.id) + '</g>');
    o.push('<text x="' + mx + '" y="' + (my + 24) + '" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="9" font-weight="700" fill="#15281c">' + (lit ? m.name : '?') + '</text>');
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
  return '<ellipse cx="0" cy="7" rx="10" ry="4" fill="#8d969c" ' + S + '/><ellipse cx="0" cy="0" rx="7" ry="3.5" fill="#aab3b8" ' + S + '/><ellipse cx="0" cy="-6" rx="4.5" ry="3" fill="#8d969c" ' + S + '/>';
}
function mapCard() {
  var lit = MARKS.filter(function (m) { return store.marks[m.id]; }).length;
  card('<h2 style="color:#1f6f99">Lakeside map</h2>' +
    '<p>Furthest so far: <b>' + store.far + '</b> hops, at ' + ZONES[zoneOf(store.far)].name + '. Landmarks found: ' + lit + ' of ' + MARKS.length + '.</p>' +
    '<div class="hkg-map">' + mapSvg() + '</div>' +
    '<button type="button" class="hkg-go" data-act="log">Catch log</button>' +
    '<button type="button" class="hkg-c2" data-act="back">Back</button>');
}
function logCard() {
  var fz = zoneOf(store.far);
  var h = '<h2 style="color:#1f6f99">Catch log</h2><p>' + kinds() + ' of ' + FISH.length + ' kinds found. Tap one to read its card.</p><div class="hkg-grid">';
  FISH.forEach(function (f) {
    var n = store.log[f.id] || 0;
    h += '<button type="button" data-act="fish" data-id="' + f.id + '"' + (n ? '' : ' class="off"') + '><span data-fish="' + f.id + '"></span>' +
      (n ? f.name + (n > 1 ? ' x' + n : '') : (f.z.some(function (z) { return z <= fz; }) ? '???' : 'Further out')) + '</button>';
  });
  h += '</div><button type="button" class="hkg-go" data-act="map">Map</button><button type="button" class="hkg-c2" data-act="back">Back</button>';
  card(h);
  var spans = ui.card.querySelectorAll('[data-fish]');
  for (var i = 0; i < spans.length; i++) {
    var f = FISHBY[spans[i].getAttribute('data-fish')];
    spans[i].parentNode.replaceChild(fishCanvas(f, !(store.log[f.id] > 0)), spans[i]);
  }
}
function fishCard(id) {
  var f = FISHBY[id]; if (!f) return;
  var n = store.log[id] || 0, fz = zoneOf(store.far);
  var where = f.z.map(function (z) { return '<span class="hkg-tag">' + (z <= fz ? ZONES[z].name : '???') + '</span>'; }).join('');
  card('<h2>' + (n ? f.name : 'Not found yet') + '</h2><p style="text-align:center"><span class="hkg-rar r' + f.r + '">' + RARITY[f.r] + '</span></p>' +
    '<div data-big></div>' +
    (n ? '<p>' + f.fact + '</p><p class="hkg-tip">Caught ' + (n === 1 ? 'once' : n + ' times') + '.</p>' : '<p>A shape in the water. Fish along the way, or cast from a peg, to find it.</p>') +
    '<p class="hkg-tip">Lives at:</p><p>' + where + '</p>' +
    '<button type="button" class="hkg-go" data-act="log">Back to the log</button>');
  var s = ui.card.querySelector('[data-big]');
  if (s) s.parentNode.replaceChild(fishCanvas(f, !n, 'hkg-fishbig'), s);
}
function kitCard() {
  var h = '<h2 style="color:#1f6f99">Kit</h2><p>Looks only. Pick what to wear.</p><div class="hkg-kitp"><span data-me></span></div>';
  SLOTS.forEach(function (s) {
    h += '<div class="hkg-slot"><h3>' + s[1] + '</h3><div>';
    KIT[s[0]].forEach(function (it) {
      var open = kitOpen(it), on = wearing(s[0]) === it.id;
      h += '<button type="button" data-act="wear" data-slot="' + s[0] + '" data-id="' + it.id + '"' + (on ? ' class="on" aria-pressed="true"' : ' aria-pressed="false"') + (open ? '' : ' disabled') + '>' +
        '<span data-kit="' + s[0] + ':' + it.id + '"></span><span>' + it.name + (open ? '' : '<small>' + needText(it) + '</small>') + '</span></button>';
    });
    h += '</div></div>';
  });
  h += '<div style="height:6px"></div><button type="button" class="hkg-go" data-act="back">Done</button>';
  card(h);
  var me = ui.card.querySelector('[data-me]');
  if (me) { var big = document.createElement('canvas'); big.width = 14; big.height = 14; big.getContext('2d').drawImage(sprites().r, 0, 0); me.parentNode.replaceChild(big, me); }
  var ks = ui.card.querySelectorAll('[data-kit]');
  for (var i = 0; i < ks.length; i++) {
    var p = ks[i].getAttribute('data-kit').split(':'), k = curKit();
    k[p[0]] = p[1];
    var c = document.createElement('canvas'); c.width = 14; c.height = 14;
    c.getContext('2d').drawImage(spriteSet(k).r, 0, 0);
    ks[i].parentNode.replaceChild(c, ks[i]);
  }
  var cur = ui.card.querySelector('.hkg-slot button.on');
  if (cur) { try { cur.focus({ preventScroll: true }); } catch (e) {} }
}

/* ---------- v2.0 fishing pegs ---------- */
var CAST = null;
function openPeg() {
  var row = onPeg();
  if (!row) return;
  state = 'peg'; P.queued = null;
  if (ui.cast) ui.cast.hidden = true;
  var f = pickFish(zoneOf(P.row), true), w = [0, 0.34, 0.27, 0.21][f.r];
  CAST = { row: row, f: f, a: rnd(0.08, 0.92 - w), w: w, t: 0, p: 0, done: false, miss: 0 };
  sfx('cast');
  cardIn('<h2 style="color:#1f6f99">Fishing peg</h2>' +
    '<p>Your float bobs on the water. Tap Strike when the orange marker is in the green. It keeps going until you are ready.</p>' +
    '<div class="hkg-meter" data-act="strike" aria-hidden="true"><div class="z"></div><div class="m"></div></div>' +
    '<p class="hkg-fb" aria-live="polite"></p>' +
    '<button type="button" class="hkg-go" data-act="strike">Strike!</button>' +
    '<button type="button" class="hkg-c2" data-act="pegoff">Not now</button>', true);
  syncMeter();
}
function syncMeter() {
  if (!CAST || !ui.card) return;
  var z = ui.card.querySelector('.hkg-meter .z'), m = ui.card.querySelector('.hkg-meter .m');
  if (z) { z.style.left = (CAST.a * 100) + '%'; z.style.width = (CAST.w * 100) + '%'; }
  if (m) m.style.left = (CAST.p * 100) + '%';
}
function strike() {
  if (state !== 'peg' || !CAST || CAST.done) return;
  if (CAST.p >= CAST.a - 0.01 && CAST.p <= CAST.a + CAST.w + 0.01) { landFish(); return; }
  CAST.miss++;
  sfx('miss');
  if (CAST.miss >= 2 && CAST.w < 0.5) { CAST.w = Math.min(0.5, CAST.w + 0.06); CAST.a = Math.max(0.02, Math.min(CAST.a - 0.03, 0.98 - CAST.w)); }
  feedback(pick(['The float bobbed, then nothing. Cast again whenever.', 'A nibble, but it swam off. Another go whenever you like.', 'Close. Try again any time.']) +
    (CAST.miss >= 2 ? ' The green bit has grown a little.' : ''));
  syncMeter();
}
function landFish() {
  var f = CAST.f, isNew = logFish(f);
  CAST.done = true; CAST.row.pegDone = true;
  G.bonePts += 5; G.bones++;
  G.floats.push({ x: (P.x + 0.5) * TS, y: -P.row * TS - 4, life: 1, txt: '+5' });
  sfx('catch');
  updateHud();
  var kit = newKit();
  cardIn('<div style="text-align:center"><div class="hkg-badge hkg-pop">' + (isNew ? 'New for your catch log!' : 'Caught ' + store.log[f.id] + ' times') + '</div></div>' +
    '<h2>' + f.name + '</h2><p style="text-align:center"><span class="hkg-rar r' + f.r + '">' + RARITY[f.r] + '</span></p><div data-big></div>' +
    '<p>' + f.fact + '</p>' +
    (kit.length ? '<p><b>New kit: ' + kit.join(', ') + '.</b> Try it on in Kit.</p>' : '') +
    '<p class="hkg-tip">+5 points. Into the log it goes, then back in the water.</p>' +
    '<button type="button" class="hkg-go" data-act="pegdone">Back to the bank</button>', true);
  var s = ui.card.querySelector('[data-big]');
  if (s) s.parentNode.replaceChild(fishCanvas(f, false, 'hkg-fishbig'), s);
}
function pegLeave() { CAST = null; backToPlay(); }

/* ---------- v2.0 checkpoint buoy ---------- */
var BQ = null, BORDER = [], BI = 0;
function nextBuoyQ() {
  if (BI >= BORDER.length) {
    BORDER = BUOY.map(function (q, i) { return i; });
    for (var i = BORDER.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = BORDER[i]; BORDER[i] = BORDER[j]; BORDER[j] = t; }
    BI = 0;
  }
  return BUOY[BORDER[BI++]];
}
function openBuoy(row) {
  state = 'buoy';
  if (ui.cast) ui.cast.hidden = true;
  sfx('buoy');
  BQ = { row: row, q: nextBuoyQ(), tries: 0, settled: false, opts: null };
  buoyCard(true);
}
function buoyCard(first) {
  var q = BQ.q, idx = q.o.map(function (o, i) { return i; });
  for (var i = idx.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
  BQ.opts = idx;
  cardIn((first ? '<h2 style="color:#e2541f">Checkpoint buoy</h2><p>One question ties off here. If this run ends, you can carry on from this buoy.</p>' : '<h2 style="color:#e2541f">Another one</h2>') +
    '<p class="hkg-tip">' + q.t + '</p><div class="hkg-q">' + q.q + '</div><div class="hkg-opts">' +
    idx.map(function (oi, n) { return '<button type="button" class="hkg-opt" data-act="bopt" data-i="' + n + '">' + q.o[oi] + '</button>'; }).join('') +
    '</div><p class="hkg-fb" aria-live="polite"></p>' +
    '<button type="button" class="hkg-c2" data-act="bskip">Not now, keep going</button>', true);
}
function buoyPick(n) {
  if (!BQ || BQ.settled) return;
  var btns = ui.card.querySelectorAll('.hkg-opt'), b = btns[n];
  if (!b || b.disabled) return;
  if (BQ.opts[n] === 0) { b.className = 'hkg-opt ok'; buoyResult(true); return; }
  b.className = 'hkg-opt no'; b.disabled = true;
  BQ.tries++;
  if (BQ.tries >= 2) {
    for (var i = 0; i < btns.length; i++) if (BQ.opts[i] === 0) btns[i].className = 'hkg-opt ok';
    buoyResult(false);
  } else feedback('Not that one. Have another go.');
}
function buoyResult(ok) {
  BQ.settled = true;
  var opts = ui.card.querySelectorAll('.hkg-opt');
  for (var i = 0; i < opts.length; i++) opts[i].disabled = true;
  var skip = ui.card.querySelector('[data-act="bskip"]'); if (skip) skip.parentNode.removeChild(skip);
  var fb = ui.card.querySelector('.hkg-fb'), add = '';
  if (ok) {
    BQ.row.buoyDone = true;
    G.save = { row: BQ.row.r };
    sfx('best');
    feedback('<b>Tied off!</b> ' + BQ.q.why + ' If this run ends, you can carry on from here.');
    add = '<button type="button" class="hkg-go" data-act="bdone">Carry on</button>';
  } else {
    feedback('That one does not tie off. ' + BQ.q.why);
    add = '<button type="button" class="hkg-go" data-act="bnext">Try another question</button>' +
      '<button type="button" class="hkg-c2" data-act="bdone">Keep going without saving</button>';
  }
  var box = document.createElement('div'); box.innerHTML = add;
  while (box.firstChild) fb.parentNode.insertBefore(box.lastChild, fb.nextSibling);
  var g = ui.card.querySelector('.hkg-go');
  if (g) { try { g.focus({ preventScroll: true }); } catch (e) {} }
}
function buoyLeave() { BQ = null; backToPlay(); }
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
  cardIn('<h2 style="color:#1f6f99">Gear up first</h2>' +
    '<p>The squad needs bait. Get ' + GATE_N + ' questions right and you earn ' + runsWord(GATE_RUNS) + '.</p>' +
    '<p class="hkg-tip">Every ' + PER_RIGHT + ' right answers in your activities or the daily drop earn another run too.</p>' +
    '<button type="button" class="hkg-go" data-act="quiz">Answer questions</button>' +
    '<button type="button" class="hkg-c2" data-act="acts">Go to my activities</button>' + row3() +
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
    '<h2 style="color:#1f6f99">' + runsWord(store.runs) + ' ready</h2>' +
    '<p>Nice work. Off you go.</p><div style="height:12px"></div>' +
    '<button type="button" class="hkg-go" data-act="again">Play</button>' +
    '<button type="button" class="hkg-c2" data-act="close">Save them for later</button>');
  ui.card.insertBefore(cardIcon(), ui.card.firstChild);
}
function runToast() {
  if (!ui.toast || gated()) return;
  toast(store.runs > 0 ? runsWord(store.runs) + ' left after this' : 'Last run for now');
}

function onKey(e) {
  if (state === 'closed') return;
  var k = e.key, tgt = e.target, onBtn = tgt && tgt.tagName === 'BUTTON';
  if (k === 'Escape' || k === 'Esc') {
    e.preventDefault();
    if (state === 'menu') menuBack(); else if (state === 'peg') pegLeave(); else if (state === 'buoy') buoyLeave(); else close();
    return;
  }
  if (k === 'Tab') { trapTab(e); return; }
  if (state === 'gate') {
    if (k === 'Enter' && tgt && tgt.tagName === 'INPUT') { e.preventDefault(); quizCheck(); }
    return;
  }
  if (state === 'menu' || state === 'buoy') return;
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
    CAST.p = 0.5 - 0.5 * Math.cos(CAST.t * Math.PI * 2 / (RM ? 3.8 : 2.6));
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
  clearToasts();
  CAST = null; BQ = null; menuFrom = null;
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
  if (note) note.textContent = (store.runs > 0 ? runsWord(store.runs) + ' ready. ' : 'Answer a few questions to earn runs. ') + (store.best > 0 ? 'Best: ' + store.best + '.' : 'No best yet.') +
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
        bones: G.bones, best: store.best, games: store.games, runs: store.runs, credited: store.credited, rights: rightAnswers(), dead: G.dead, LH: LH, rowType: G.rows[P.row] && G.rows[P.row].type,
        zone: G.zone, far: store.far, kinds: kinds(), log: store.log, marks: store.marks, save: G.save ? G.save.row : null, onPeg: !!onPeg(), cast: ui.cast ? !ui.cast.hidden : false,
        castP: CAST ? CAST.p : null, kit: curKit(), base: G.base, runFish: G.runFish.slice() };
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
      CAST.p = hit ? CAST.a + CAST.w / 2 : (CAST.a > 0.3 ? 0.02 : 0.98);
      var t = CAST.p; CAST.t = Math.acos(1 - 2 * t) / (Math.PI * 2) * (RM ? 3.8 : 2.6);
      strike();
      return true;
    },
    buoyAnswer: function (right) {
      if (!BQ) return false;
      var bs = ui.card.querySelectorAll('.hkg-opt');
      for (var i = 0; i < BQ.opts.length; i++) if ((BQ.opts[i] === 0) === !!right && !bs[i].disabled) { buoyPick(i); return true; }
      return false;
    },
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
