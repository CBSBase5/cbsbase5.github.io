/* Base 5 core target activity: Full stop!
   English. Basic punctuation: capital letters and full stops, capitals for
   names and I, question marks and exclamation marks, and fixing a message.
   Replayable: most questions carry two more versions. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
var LVS = ["mild", "medium", "spicy"], START = "mild";
function ext(a, b){ for(var k in b) if(Object.prototype.hasOwnProperty.call(b, k)) a[k] = b[k]; return a; }
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }
function task(h){ return '<div class="a2task">' + h + '</div>'; }

/* Question builder: each version is {fields, medium:{...}, spicy:{...}}. o:[right, others] becomes
   options (the right one moves a place each version) and s:[slip for each other option] becomes
   slips. Version 1 is the base; the rest become vary, each with every level written out. */
function res(v, L, vi){
  var o = {};
  Object.keys(v).forEach(function(k){ if(LVS.indexOf(k) < 0 && k !== "ez") o[k] = v[k]; });
  if(v[L]) ext(o, v[L]);
  /* easy read (LC): a version's ez is for the first level only; its s list maps like s */
  var ez = (L === START && v.ez) ? ext({}, v.ez) : null;
  if(o.o){
    var right = o.o[0], rest = o.o.slice(1), t = vi % o.o.length, opts = rest.slice(), sl = {};
    opts.splice(t, 0, right);
    (o.s || []).forEach(function(m, j){ if(m) sl[j < t ? j : j + 1] = m; });
    o.options = opts; o.answer = t; o.slips = sl; delete o.o; delete o.s;
    if(ez && ez.s){ var es = {}; ez.s.forEach(function(m, j){ if(m) es[j < t ? j : j + 1] = m; }); ez.slips = es; delete ez.s; }
  }
  if(ez) o.ez = ez;
  return o;
}
function Q(type, topic, flags, vers){
  var all = [], R = vers.map(function(v, vi){ var r = {}; LVS.forEach(function(L){ r[L] = res(v, L, vi); all.push(r[L]); }); return r; });
  var keys = {}; all.forEach(function(o){ Object.keys(o).forEach(function(k){ keys[k] = 1; }); });
  all.forEach(function(o){ Object.keys(keys).forEach(function(k){ if(!(k in o) && k !== "ez") o[k] = null; }); });
  /* lab: options that differ only in punctuation get letters, in a fixed order */
  if(flags && flags.lab) all.forEach(function(o){ if(o.options) o.options = o.options.map(function(t, i){ return "<b>" + "ABCD".charAt(i) + ".</b> " + t; }); });
  function others(r){ var lv = {}; LVS.forEach(function(L){ if(L !== START) lv[L] = r[L]; }); return lv; }
  var step = ext(ext({ type: type, topic: topic }, flags || {}), R[0][START]);
  delete step.lab;
  step.lv = others(R[0]);
  if(R.length > 1) step.vary = R.slice(1).map(function(r){ return ext(ext({}, r[START]), { lv: others(r) }); });
  return step;
}

/* ---------- pictures ---------- */
/* a sentence is a bus: capital at the front, a stop at the end */
var BUS = '<svg viewBox="0 0 540 200" role="img" aria-label="A sentence drawn as a bus. The capital letter is the front of the bus, and the full stop is the bus stop at the end">' +
  '<rect width="540" height="200" rx="16" fill="#f4f1ea"/>' +
  '<path d="M0 160h540" stroke="#9aa0b8" stroke-width="4"/>' +
  '<rect x="28" y="56" width="400" height="90" rx="16" fill="#e04848" stroke="#141a33" stroke-width="3"/>' +
  '<rect x="44" y="70" width="70" height="44" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' + T(79, 104, "B", 34, { a: "middle", b: 1 }) +
  T(250, 100, "onnie likes carrots", 22, { a: "middle", b: 1, c: "#ffffff" }) +
  '<circle cx="100" cy="150" r="16" fill="#3a4060" stroke="#141a33" stroke-width="3"/><circle cx="350" cy="150" r="16" fill="#3a4060" stroke="#141a33" stroke-width="3"/>' +
  '<path d="M474 160V60" stroke="#141a33" stroke-width="5"/><circle cx="474" cy="50" r="24" fill="#ffffff" stroke="#141a33" stroke-width="3"/><circle cx="474" cy="50" r="8" fill="#141a33"/>' +
  T(79, 40, "Capital at the front", 13, { a: "middle", b: 1 }) + T(474, 188, "Stop at the end", 13, { a: "middle", b: 1 }) +
  A.egg(A.bird(474, 18, 0.5, "#ffd23f"), "A bird on the bus stop. In the wise words of Jay's late, great grandfather: stop.") +
  '</svg>';

/* capitals for names, places, days, months and I */
var NAMES = '<svg viewBox="0 0 540 190" role="img" aria-label="Name tags that always need a capital letter: I, people like Bonnie, places like Leeds, days like Monday, months like July">' +
  '<rect width="540" height="190" rx="16" fill="#f4f1ea"/>' +
  [["I", "me, myself"], ["Bonnie", "people, pets"], ["Leeds", "places"], ["Monday", "days"], ["July", "months"]].map(function(n, k){
    var x = 16 + k * 104;
    return '<rect x="' + x + '" y="34" width="96" height="76" rx="12" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
      '<rect x="' + x + '" y="34" width="96" height="22" rx="10" fill="' + ["#8a5cf6", "#ff8a5c", "#19c39a", "#22b8e6", "#f2a516"][k] + '"/>' +
      T(x + 48, 50, "HELLO", 11, { a: "middle", b: 1, c: "#ffffff" }) +
      T(x + 48, 92, '<tspan fill="#e04848">' + n[0].charAt(0) + '</tspan>' + n[0].slice(1), 19, { a: "middle", b: 1 }) +
      T(x + 48, 136, n[1], 13, { a: "middle", c: "#3a4060" });
  }).join("") +
  T(270, 174, "Names always get a capital, wherever they are in the sentence.", 13, { a: "middle", b: 1 }) +
  '</svg>';

/* three end marks, three jobs */
function face(x, y, mouth, brows){ return '<g transform="translate(' + x + ' ' + y + ')"><circle r="24" fill="#f6d1b0" stroke="#141a33" stroke-width="2.5"/><circle cx="-8" cy="-3" r="3" fill="#141a33"/><circle cx="8" cy="-3" r="3" fill="#141a33"/>' + (brows || "") + mouth + '</g>'; }
var MARKS = '<svg viewBox="0 0 540 220" role="img" aria-label="Three end marks: a full stop for calm telling, a question mark for asking, an exclamation mark for a strong feeling">' +
  '<rect width="540" height="220" rx="16" fill="#f4f1ea"/>' +
  [[".", "Telling", "It is raining.", '<path d="M-7 10h14" stroke="#141a33" stroke-width="2.5" stroke-linecap="round"/>', ""],
   ["?", "Asking", "Is it raining?", '<circle cx="0" cy="11" r="4" fill="#141a33"/>', '<path d="M-13 -12l9 -3M4 -15l9 3" stroke="#141a33" stroke-width="2.5"/>'],
   ["!", "Strong feeling", "It is pouring!", '<ellipse cx="0" cy="11" rx="6" ry="8" fill="#141a33"/>', '<path d="M-13 -14l9 -4M4 -18l9 4" stroke="#141a33" stroke-width="2.5"/>']].map(function(m, k){
    var x = 24 + k * 168;
    return '<rect x="' + x + '" y="16" width="156" height="188" rx="14" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
      T(x + 40, 84, m[0], 60, { a: "middle", b: 1, c: ["#141a33", "#1a7fb0", "#e04848"][k] }) + face(x + 108, 62, m[3], m[4]) +
      T(x + 78, 132, m[1], 17, { a: "middle", b: 1 }) + T(x + 78, 168, m[2], 14, { a: "middle" });
  }).join("") +
  '</svg>';

/* a message being fixed */
var FIX = '<svg viewBox="0 0 540 230" role="img" aria-label="A message with no punctuation, fixed in three steps: find where each sentence ends, add the end marks, then add the capital letters">' +
  '<rect width="540" height="230" rx="16" fill="#f4f1ea"/>' +
  '<rect x="24" y="16" width="492" height="52" rx="14" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
  T(40, 48, "where are you i found bonnie she was in the garden", 15) +
  T(30, 98, "1. Find the ends", 14, { b: 1 }) +
  '<rect x="24" y="106" width="492" height="36" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="1.5"/>' +
  T(40, 130, 'where are you <tspan fill="#e04848" font-weight="700">/</tspan> i found bonnie <tspan fill="#e04848" font-weight="700">/</tspan> she was in the garden', 15) +
  T(30, 166, "2. End marks   3. Capitals", 14, { b: 1 }).replace("   ", ", then ") +
  '<rect x="24" y="174" width="492" height="40" rx="10" fill="#e9fbf3" stroke="#141a33" stroke-width="2"/>' +
  T(40, 200, '<tspan fill="#e04848" font-weight="700">W</tspan>here are you<tspan fill="#1a7fb0" font-weight="700">?</tspan> <tspan fill="#e04848" font-weight="700">I</tspan> found <tspan fill="#e04848" font-weight="700">B</tspan>onnie<tspan fill="#1a7fb0" font-weight="700">.</tspan> <tspan fill="#e04848" font-weight="700">S</tspan>he was in the garden<tspan fill="#1a7fb0" font-weight="700">.</tspan>', 15) +
  '</svg>';

(window.A2PACKS = window.A2PACKS || {})["core-full-stop"] = {
  a2: true,
  id: "a2-core-full-stop",
  title: "Full stop!",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "Capital at the front, stop at the end. And when to ask with a question mark, or shout with an exclamation mark.",
  blurb: "The marks that make sentences easy to read: full stops, capital letters, question marks and exclamation marks. Four short chunks, ending with fixing a message yourself, and a punctuation poster to make. The questions change each time you come back.",
  note: "Full stop! Capitals, full stops, question marks and exclamation marks. Four five minute chunks and a little poster to make. The questions change every go, so have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Pit stop", line: "Pit stop: one mark at a time, short sentences." },
    { id: "medium", name: "Bus stop", line: "Bus stop: whole messages, names, and picking the right end mark." },
    { id: "spicy", name: "Showstopper", line: "Showstopper: run on sentences, sneaky capitals, and marks used for effect." }
  ],
  themes: {
    time: { name: "Time travel", w: { who: "zed", place: "rome", thing: "the time machine" } },
    football: { name: "Football", w: { who: "leo", place: "wembley", thing: "the ball" } },
    horror: { name: "Horror", w: { who: "edgar", place: "whitby", thing: "the castle door" } },
    fishing: { name: "Fishing", w: { who: "rosie", place: "windermere", thing: "the boat" } },
    music: { name: "Music", w: { who: "ava", place: "glasgow", thing: "the stage" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: BUS,
  steps: [

    /* ---------- chunk 1: capitals and full stops ---------- */
    { type: "learn", topic: "Front and back", title: "Capital at the front, stop at the back",
      ez: { title: "Capital and stop", html: "<p>A sentence is a bus. <b>Capital</b> at the front. <b>Full stop</b> at the end.</p><p><b>Bonnie likes carrots.</b></p>" },
      fig: BUS,
      html: "<p>A sentence is like a bus. The <b>capital letter</b> is the front. The <b>full stop</b> is the stop at the end.</p>" +
        "<p><b>Bonnie likes carrots.</b> Capital B at the front. Full stop at the back.</p>" +
        "<p>Every sentence needs both.</p>",
      lv: {
        medium: { html: "<p>Every sentence starts with a <b>capital letter</b> and ends with a <b>full stop</b> (or a question mark or exclamation mark).</p>" +
          "<p>When one idea finishes and a new one starts, that is a new sentence: <b>The bus was late. We walked home.</b></p>" +
          "<p>Reading it aloud helps. Where you would naturally stop and take a breath, a full stop often goes.</p>" },
        spicy: { html: "<p>Full stops separate complete sentences. Two complete sentences joined by just a comma is a <b>comma splice</b>: <b>The bus was late, we walked home.</b></p>" +
          "<p>Two complete sentences run together with nothing is a <b>run on</b>: <b>The bus was late we walked home.</b></p>" +
          "<p>Fix both with a full stop (<b>The bus was late. We walked home.</b>) or a joining word (<b>The bus was late, so we walked home.</b>).</p>" } } },

    Q("mc", "Front and back", { fixed: true, lab: true }, [
      { q: "Which sentence is punctuated correctly?",
        o: ["Bonnie likes carrots.", "bonnie likes carrots.", "Bonnie likes carrots"],
        ez: { q: "Which one is right?", hint: "Check the front and the end.", why: "Capital at the front. Full stop at the end.", s: ["Bonnie needs a capital B.", "The stop at the end is missing."] },
        s: ["The front of the bus is missing: Bonnie needs a capital B.", "The stop is missing at the end."],
        hint: "Check the front and the back.",
        why: "Capital at the front, full stop at the back.",
        medium: { o: ["The bus was late. We walked home.", "The bus was late we walked home.", "the bus was late. we walked home."],
          s: ["Two sentences run together. A full stop goes after late.", "Each sentence needs a capital at the front."] },
        spicy: { o: ["The bus was late, so we walked home.", "The bus was late, we walked home.", "The bus was late so. We walked home."],
          s: ["Comma splice: two full sentences joined with only a comma.", "The full stop is in an odd spot: so belongs with what comes after."],
          why: "A comma plus a joining word (so) can link two sentences. A comma on its own cannot." } },
      { q: "Which sentence is punctuated correctly?",
        o: ["The birds are singing.", "the birds are singing.", "The birds are singing"],
        ez: { q: "Which one is right?", hint: "Check the front and the end.", why: "Capital at the front. Full stop at the end.", s: ["It needs a capital T.", "It needs a full stop."] },
        s: ["The sentence needs a capital T at the front.", "It needs a full stop at the end."],
        hint: "Check the front and the back.",
        why: "Capital at the front, full stop at the back.",
        medium: { o: ["Jay filled the feeder. A robin came.", "Jay filled the feeder a robin came.", "jay filled the feeder. a robin came."],
          s: ["Two sentences run together. A full stop goes after feeder.", "Each sentence, and the name Jay, need capitals."] },
        spicy: { o: ["Jay filled the feeder. Within a minute, a robin came.", "Jay filled the feeder, within a minute a robin came.", "Jay filled the feeder within a minute. A robin came."],
          s: ["Comma splice: two full sentences joined with only a comma.", "The full stop is in an odd spot, and it changes the meaning."] } },
      { q: "Which sentence is punctuated correctly?",
        o: ["We went to the park.", "we went to the park.", "We went to the park"],
        ez: { q: "Which one is right?", hint: "Check the front and the end.", why: "Capital at the front. Full stop at the end.", s: ["It needs a capital W.", "It needs a full stop."] },
        s: ["The sentence needs a capital W at the front.", "It needs a full stop at the end."],
        hint: "Check the front and the back.",
        why: "Capital at the front, full stop at the back.",
        medium: { o: ["It was sunny. We had a picnic.", "It was sunny we had a picnic.", "It was sunny. we had a picnic."],
          s: ["Two sentences run together. A full stop goes after sunny.", "The second sentence needs a capital W."] },
        spicy: { o: ["It was sunny, so we had a picnic.", "It was sunny, we had a picnic.", "It was sunny we had a picnic."],
          s: ["Comma splice: a comma on its own cannot join two sentences.", "Run on: two sentences with nothing between them."] } }
    ]),

    Q("mc", "Front and back", null, [
      { q: "What is missing?" + task("the cat is asleep."),
        o: ["A capital letter at the front", "A full stop at the end", "Nothing, it is fine"],
        s: ["The full stop is there. Look at the front.", "Look at the very first letter."],
        ez: { hint: "Look at the first letter.", why: "It needs a capital: <b>The cat is asleep.</b>", s: ["The stop is there. Look at the front.", "Look at the first letter."] },
        hint: "Look at the very first letter.",
        why: "It needs a capital: <b>The cat is asleep.</b>",
        medium: { q: "What is missing from the <b>second</b> sentence?" + task("The cat is asleep. it is on the sofa."),
          o: ["A capital letter at the front", "A full stop at the end", "Nothing, it is fine"],
          s: ["The full stop is there.", "Look at the first letter of the second sentence."] },
        spicy: { q: "What needs fixing here?" + task("The cat is asleep, it is on the sofa."),
          o: ["A comma is joining two full sentences", "It needs a question mark", "Sofa needs a capital letter"],
          s: ["It is not asking anything.", "Sofa is not a name."],
          why: "Comma splice. Fix it with a full stop (<b>asleep. It is</b>) or a joining word (<b>asleep, and it is</b>)." } },
      { q: "What is missing?" + task("Bonnie is eating a sock"),
        o: ["A full stop at the end", "A capital letter at the front", "Nothing, it is fine"],
        s: ["Bonnie has a capital. Look at the end.", "Look at the very end."],
        ez: { hint: "Look at the end.", s: ["Bonnie has a capital. Look at the end.", "Look at the end."] },
        hint: "Look at the very end.",
        why: "It needs a full stop: <b>Bonnie is eating a sock.</b> Again.",
        medium: { q: "What is missing from the <b>first</b> sentence?" + task("Bonnie is eating a sock She looks very happy."),
          o: ["A full stop at the end", "A capital letter at the front", "Nothing, it is fine"],
          s: ["Bonnie has a capital.", "Look between sock and She."] },
        spicy: { q: "What needs fixing here?" + task("Bonnie is eating a sock she looks very happy."),
          o: ["Two sentences run together with nothing between them", "It needs a question mark", "Sock needs a capital letter"],
          s: ["It is not asking anything.", "Sock is not a name."],
          why: "Run on. <b>Bonnie is eating a sock. She looks very happy.</b>" } },
      { q: "What is missing?" + task("my bag is red"),
        o: ["A capital and a full stop", "Only a full stop", "Only a capital letter"],
        ez: { hint: "Check the front and the end.", s: ["Look at the front too.", "Look at the end too."] },
        s: ["Look at the front too.", "Look at the end too."],
        hint: "Check the front and the back.",
        why: "Both: <b>My bag is red.</b>",
        medium: { q: "What is missing?" + task("my bag is red It has a bird badge."),
          o: ["A capital at the front, and a full stop after red", "Only a full stop after red", "Only a capital at the front"],
          s: ["Look at the first letter too.", "Look between red and It too."] },
        spicy: { q: "What needs fixing here?" + task("my bag is red, it has a bird badge"),
          o: ["No capital, a comma splice, and no full stop", "Only the capital letter", "Only the full stop"],
          s: ["There is more than one problem.", "There is more than one problem."],
          why: "<b>My bag is red. It has a bird badge.</b> Capital, full stop in the middle, full stop at the end." } }
    ]),

    Q("num", "Front and back", null, [
      { q: "How many sentences are hiding in here?" + task("it was raining bonnie stayed in"),
        ez: { q: "How many sentences?" + task("it was raining bonnie stayed in"), hint: "Read it aloud. Where do you stop?", why: "2: <b>It was raining. Bonnie stayed in.</b>", slips: [[1, "Read it aloud. A new idea starts after raining."], [3, "Close. Bonnie stayed in is 1 sentence."]] },
        boxes: [{ label: "Sentences", a: 2 }],
        slips: [[1, "Read it aloud. Where would you stop for a breath? There is a new idea after raining."], [3, "Close. Bonnie stayed in is one sentence."]],
        hint: "Read it aloud. Where would you take a breath?",
        why: "Two: <b>It was raining. Bonnie stayed in.</b>",
        medium: { q: "How many sentences are hiding in here?" + task("it was raining bonnie did not want to go out she sat by the door"),
          boxes: [{ label: "Sentences", a: 3 }],
          slips: [[2, "Close. Look again after go out."], [4, "One too many. She sat by the door is one sentence."]],
          why: "Three: <b>It was raining. Bonnie did not want to go out. She sat by the door.</b>" },
        spicy: { q: "How many sentences should this be? (The ands that join two ideas are fine.)" + task("it was raining and bonnie did not want to go out she sat by the door for an hour then she fell asleep"),
          boxes: [{ label: "Sentences", a: 3 }],
          slips: [[2, "Look again after an hour."], [4, "The and joins two ideas into one sentence, so that part only counts once."]],
          why: "Three: <b>It was raining and Bonnie did not want to go out. She sat by the door for an hour. Then she fell asleep.</b>" } },
      { q: "How many sentences are hiding in here?" + task("jay filled the feeder a robin came"),
        ez: { q: "How many sentences?" + task("jay filled the feeder a robin came"), hint: "Read it aloud. Where do you stop?", why: "2: <b>Jay filled the feeder. A robin came.</b>", slips: [[1, "Read it aloud. A new idea starts at a robin."], [3, "Close. A robin came is 1 sentence."]] },
        boxes: [{ label: "Sentences", a: 2 }],
        slips: [[1, "Read it aloud. A new idea starts at a robin."], [3, "Close. A robin came is one sentence."]],
        hint: "Read it aloud. Where would you take a breath?",
        why: "Two: <b>Jay filled the feeder. A robin came.</b>",
        medium: { q: "How many sentences are hiding in here?" + task("jay filled the feeder a robin came it ate all the seed jay was delighted"),
          boxes: [{ label: "Sentences", a: 4 }],
          slips: [[3, "Close. Look again after the seed."], [5, "One too many."]],
          why: "Four: <b>Jay filled the feeder. A robin came. It ate all the seed. Jay was delighted.</b>" },
        spicy: { q: "How many sentences should this be? (The ands that join two ideas are fine.)" + task("jay filled the feeder and hung it up a robin came straight away it ate all the seed and then it flew off"),
          boxes: [{ label: "Sentences", a: 3 }],
          slips: [[2, "Look again after straight away."], [5, "Each and joins ideas inside one sentence."]],
          why: "Three: <b>Jay filled the feeder and hung it up. A robin came straight away. It ate all the seed and then it flew off.</b>" } },
      { q: "How many sentences are hiding in here?" + task("we went to [[place]] it was great"),
        ez: { q: "How many sentences?" + task("we went to [[place]] it was great"), hint: "Read it aloud. Where do you stop?", why: "2: <b>We went to [[Place]]. It was great.</b>", slips: [[1, "Read it aloud. A new idea starts at it was."], [3, "Close. It was great is 1 sentence."]] },
        boxes: [{ label: "Sentences", a: 2 }],
        slips: [[1, "Read it aloud. A new idea starts at it was."], [3, "Close. It was great is one sentence."]],
        hint: "Read it aloud. Where would you take a breath?",
        why: "Two: <b>We went to [[Place]]. It was great.</b>",
        medium: { q: "How many sentences are hiding in here?" + task("we went to [[place]] with [[who]] it was great we stayed all day"),
          boxes: [{ label: "Sentences", a: 3 }],
          slips: [[2, "Close. Look again after great."], [4, "One too many."]],
          why: "Three: <b>We went to [[Place]] with [[Who]]. It was great. We stayed all day.</b>" },
        spicy: { q: "How many sentences should this be? (The ands that join two ideas are fine.)" + task("we went to [[place]] with [[who]] and it was great we stayed all day so we missed the bus home"),
          boxes: [{ label: "Sentences", a: 2 }],
          slips: [[1, "Look for where one complete idea ends: after great."], [3, "So joins two ideas inside one sentence."]],
          why: "Two: <b>We went to [[Place]] with [[Who]] and it was great. We stayed all day, so we missed the bus home.</b>" } }
    ]),

    /* ---------- chunk 2: capitals for names ---------- */
    { type: "learn", topic: "Capitals for names", title: "Names always get a capital",
      ez: { title: "Names get a capital", html: "<p><b>Names</b> always get a capital.</p><p><b>I. Bonnie. Leeds. Monday. July.</b></p>" },
      fig: NAMES,
      html: "<p>Some words <b>always</b> get a capital letter, even in the middle of a sentence:</p>" +
        "<p><b>I</b> (when it means me), <b>people and pets</b> (Bonnie, Jay), <b>places</b> (Leeds), <b>days</b> (Monday) and <b>months</b> (July).</p>" +
        "<p><b>On Monday, I took Bonnie to Leeds.</b></p>",
      lv: {
        medium: { html: "<p>Capital letters go at the start of every sentence, and on <b>names</b> wherever they are.</p>" +
          "<p>Names include: <b>I</b>, <b>people and pets</b>, <b>places</b> (towns, countries, rivers), <b>days</b> and <b>months</b>, and the names of things like <b>shops, teams, films and books</b>.</p>" +
          "<p>A test: is it the name of one particular person, place or thing? Then it gets a capital. <b>a city</b> does not. <b>Leeds</b> does.</p>" },
        spicy: { html: "<p>Proper nouns (the names of particular people, places and things) get capitals. Common nouns do not.</p>" +
          "<p>The sneaky ones: <b>Mum</b> gets a capital when you use it as her name (<b>Thanks, Mum!</b>) but not after my (<b>my mum</b>). <b>The north</b> (a direction) versus <b>the North East</b> (a region). In titles, the main words get capitals: <b>The Lord of the Rings</b>.</p>" +
          "<p>Seasons (<b>summer</b>) do not get capitals. Days and months do.</p>" } } },

    Q("multi", "Capitals for names", null, [
      { q: "Pick <b>all</b> the words that need a capital letter." + task("on friday i saw bonnie."),
        ez: { q: "Pick <b>all</b> the words that need a capital." + task("on friday i saw bonnie."), hint: "First word, days, I and names.", slips: { any: "4 of them. The start, a day, I and a name." } },
        options: ["on", "friday", "i", "saw", "bonnie"],
        answers: [0, 1, 2, 4],
        slips: { any: "Four of them. The start of the sentence, a day, I, and a name." },
        hint: "The first word, plus days, I and names.",
        why: "<b>On Friday I saw Bonnie.</b>",
        medium: { q: "Pick <b>all</b> the words that need a capital letter." + task("on friday i went to [[place]] with [[who]] and my dog."),
          options: ["on", "friday", "i", "went", "[[place]]", "[[who]]", "dog"], answers: [0, 1, 2, 4, 5],
          slips: { any: "Five of them. Dog is not a name." } },
        spicy: { q: "Pick <b>all</b> the words that need a capital letter." + task("last july, my mum and i visited [[place]] in the summer holidays."),
          options: ["last", "july", "mum", "i", "[[place]]", "summer"], answers: [0, 1, 3, 4],
          slips: { any: "Four. Mum after my is not being used as a name, and seasons do not get capitals." },
          why: "<b>Last July, my mum and I visited [[Place]] in the summer holidays.</b>" } },
      { q: "Pick <b>all</b> the words that need a capital letter." + task("jay and i like birds."),
        ez: { q: "Pick <b>all</b> the words that need a capital." + task("jay and i like birds."), hint: "First word, I and names.", slips: { any: "2 of them. A name, and I." } },
        options: ["jay", "and", "i", "like", "birds"],
        answers: [0, 2],
        slips: { any: "Two of them. Jay is a name and the start of the sentence, and I always gets a capital." },
        hint: "The first word, plus I and names.",
        why: "<b>Jay and I like birds.</b>",
        medium: { q: "Pick <b>all</b> the words that need a capital letter." + task("jay and i saw a heron in [[place]] last monday."),
          options: ["jay", "i", "heron", "[[place]]", "last", "monday"], answers: [0, 1, 3, 5],
          slips: { any: "Four of them. Heron is a kind of bird, not a name, and last is not at the start." } },
        spicy: { q: "Pick <b>all</b> the words that need a capital letter." + task("in the autumn, jay and i watched a heron by the river in [[place]]."),
          options: ["in", "autumn", "jay", "i", "heron", "river", "[[place]]"], answers: [0, 2, 3, 6],
          slips: { any: "Four. Autumn is a season, and heron and river are not names here." } } },
      { q: "Pick <b>all</b> the words that need a capital letter." + task("we went to [[place]] in may."),
        ez: { q: "Pick <b>all</b> the words that need a capital." + task("we went to [[place]] in may."), hint: "First word, places and months.", slips: { any: "3 of them. The start, a place and a month." } },
        options: ["we", "went", "[[place]]", "in", "may"],
        answers: [0, 2, 4],
        slips: { any: "Three of them. The start, a place, and a month." },
        hint: "The first word, plus places and months.",
        why: "<b>We went to [[Place]] in May.</b>",
        medium: { q: "Pick <b>all</b> the words that need a capital letter." + task("in may, [[who]] and i went to [[place]] on the train."),
          options: ["in", "may", "[[who]]", "i", "[[place]]", "train"], answers: [0, 1, 2, 3, 4],
          slips: { any: "Five of them. Train is not a name." } },
        spicy: { q: "Pick <b>all</b> the words that need a capital letter." + task("\"thanks, mum,\" i said, as we left [[place]] on a cold spring morning."),
          options: ["thanks", "mum", "i", "[[place]]", "spring", "morning"], answers: [0, 1, 2, 3],
          slips: { any: "Four. Here Mum is used as her name, so it gets a capital. Spring is a season." } } }
    ]),

    Q("sort", "Capitals for names", null, [
      { q: "Does it need a capital letter? Sort them.",
        buckets: ["Always a capital", "No capital"],
        cards: [["monday", 0], ["bonnie", 0], ["london", 0], ["dog", 1], ["day", 1], ["city", 1]],
        ez: { hint: "Is it a name?", why: "Monday, Bonnie and London are names." },
        hint: "Is it the name of one particular thing?",
        why: "Monday, Bonnie and London are names. Dog, day and city are not.",
        medium: { cards: [["monday", 0], ["bonnie", 0], ["london", 0], ["march", 0], ["dog", 1], ["day", 1], ["city", 1], ["month", 1]] },
        spicy: { cards: [["monday", 0], ["march", 0], ["the river thames", 0], ["mum (in: thanks, mum)", 0], ["mum (in: my mum)", 1], ["winter", 1], ["the north (a direction)", 1]],
          why: "Thames and Mum used as a name are proper nouns. Winter is a season, and my mum and the north are not names." } },
      { q: "Does it need a capital letter? Sort them.",
        buckets: ["Always a capital", "No capital"],
        cards: [["i (meaning me)", 0], ["jay", 0], ["june", 0], ["bird", 1], ["boy", 1], ["summer", 1]],
        ez: { hint: "Is it a name?", why: "I, Jay and June always get a capital." },
        hint: "Is it a name? Seasons are not names.",
        why: "I, Jay and June always get capitals. Bird, boy and summer do not.",
        medium: { cards: [["i (meaning me)", 0], ["jay", 0], ["june", 0], ["wales", 0], ["bird", 1], ["boy", 1], ["summer", 1], ["country", 1]] },
        spicy: { cards: [["i (meaning me)", 0], ["june", 0], ["wales", 0], ["dad (in: hi, dad)", 0], ["dad (in: my dad)", 1], ["summer", 1], ["the west (a direction)", 1]],
          why: "Dad used as a name gets a capital. My dad does not, and directions and seasons do not." } },
      { q: "Does it need a capital letter? Sort them.",
        buckets: ["Always a capital", "No capital"],
        cards: [["[[place]]", 0], ["[[who]]", 0], ["friday", 0], ["town", 1], ["friend", 1], ["week", 1]],
        ez: { hint: "Is it a name?", why: "Names get capitals. Town, friend and week are not names." },
        hint: "Is it the name of one particular person, place or day?",
        why: "Names get capitals. Town, friend and week are not names.",
        medium: { cards: [["[[place]]", 0], ["[[who]]", 0], ["friday", 0], ["december", 0], ["town", 1], ["friend", 1], ["week", 1], ["year", 1]] },
        spicy: { cards: [["[[place]]", 0], ["december", 0], ["grandad (in: bye, grandad)", 0], ["the north east (a region)", 0], ["grandad (in: my grandad)", 1], ["autumn", 1], ["the east (a direction)", 1]],
          why: "A region's name gets capitals, a direction does not. Grandad used as a name does." } }
    ]),

    Q("mc", "Capitals for names", null, [
      { q: "Why does <b>[[Place]]</b> have a capital letter in this sentence?" + task("We went to [[Place]]."),
        o: ["It is the name of a place", "It is at the end", "It is a long word"],
        ez: { q: "Why does <b>[[Place]]</b> have a capital?" + task("We went to [[Place]]."), why: "It is a place name. Names get a capital." },
        s: ["Words at the end do not need capitals.", "Long words do not need capitals."],
        hint: "What kind of word is it?",
        why: "It is the name of a place. Names always get a capital.",
        spicy: { q: "Why does <b>Mum</b> have a capital here, but not in <b>my mum is kind</b>?" + task("Thanks, Mum!"),
          o: ["Here it is used as her name", "It is followed by an exclamation mark", "It comes after a comma"],
          s: ["Exclamation marks do not change capitals before them.", "Commas do not make capitals."] } },
      { q: "Why does <b>I</b> have a capital letter in this sentence?" + task("Bonnie and I went out."),
        o: ["I always has a capital when it means me", "It is at the start", "It is a short word"],
        ez: { q: "Why does <b>I</b> have a capital?" + task("Bonnie and I went out."), why: "I always gets a capital." },
        s: ["It is not at the start here.", "Short words like and do not."],
        hint: "Is it at the start?",
        why: "I (meaning me) always gets a capital.",
        spicy: { q: "Why does <b>North East</b> have capitals here, but not <b>north</b> in <b>we drove north</b>?" + task("We live in the North East."),
          o: ["Here it is the name of a region", "It comes at the end of the sentence", "It is two words"],
          s: ["The end of a sentence does not need a capital.", "Two words is not the reason."] } },
      { q: "Why does <b>Monday</b> have a capital letter in this sentence?" + task("I see Jay on Monday."),
        o: ["It is the name of a day", "It is at the end", "It starts with M"],
        ez: { q: "Why does <b>Monday</b> have a capital?" + task("I see Jay on Monday."), why: "Days are names. They get a capital.", s: ["Words at the end do not need capitals.", "Morning starts with M. It has no capital."] },
        s: ["Words at the end do not need capitals.", "Lots of M words do not get capitals, like morning."],
        hint: "What kind of word is it?",
        why: "Days are names, so they always get a capital.",
        spicy: { q: "Why does <b>Monday</b> have a capital, but <b>winter</b> does not?" + task("On a Monday in winter, we saw a heron."),
          o: ["Days are names, but seasons are not", "Monday is longer", "Winter is at the end"],
          s: ["Length does not matter.", "Winter is not at the end."] } }
    ]),

    /* ---------- chunk 3: question and exclamation marks ---------- */
    { type: "learn", topic: "Asking or shouting?", title: "Three end marks, three jobs",
      ez: { title: "3 end marks", html: "<p><b>.</b> for telling. <b>?</b> for asking.</p><p><b>!</b> for a strong feeling.</p>" },
      fig: MARKS,
      html: "<p>Sentences can end in three ways.</p>" +
        "<p><b>.</b> A <b>full stop</b> for calm telling: <b>It is raining.</b><br><b>?</b> A <b>question mark</b> for asking: <b>Is it raining?</b><br><b>!</b> An <b>exclamation mark</b> for a strong feeling, or shouting: <b>It is pouring!</b></p>",
      lv: {
        medium: { html: "<p><b>.</b> for telling, <b>?</b> for asking, <b>!</b> for a strong feeling (surprise, excitement, anger, a warning).</p>" +
          "<p>Questions often start with <b>who, what, where, when, why, how</b>, or with words like <b>can, is, do, will</b>: <b>Can Bonnie come?</b></p>" +
          "<p>Use <b>!</b> sparingly. One is strong. Five in a row (<b>!!!!!</b>) is just noise.</p>" },
        spicy: { html: "<p>The trickier cases:</p>" +
          "<p><b>Indirect questions</b> report a question, so they end with a full stop: <b>Jay asked where the birds were.</b> <b>I wonder if it will rain.</b></p>" +
          "<p><b>Commands</b> take a full stop when calm (<b>Sit down.</b>) and an exclamation mark when urgent (<b>Stop!</b>).</p>" +
          "<p>Writers use <b>!</b> and <b>?</b> for effect: a rhetorical question to make the reader think, or a single exclamation for a shock. Overusing them weakens them.</p>" } } },

    Q("sort", "Asking or shouting?", null, [
      { q: "Which end mark would each one need? (The end marks are missing.)",
        buckets: ["Full stop . (telling)", "Question mark ? (asking)"],
        cards: [["My coat is red", 0], ["Bonnie is asleep", 0], ["Where is my coat", 1], ["Can Bonnie come", 1]],
        ez: { q: "Which end mark does each one need?", why: "Telling gets <b>.</b> Asking gets <b>?</b>" },
        hint: "Is it asking something?",
        why: "Telling gets a full stop. Asking gets a question mark.",
        medium: { buckets: ["Full stop . (telling)", "Question mark ? (asking)", "Exclamation mark ! (strong feeling)"],
          cards: [["My coat is red", 0], ["Bonnie is asleep", 0], ["Where is my coat", 1], ["Can Bonnie come", 1], ["Watch out", 2], ["That is amazing", 2]],
          why: "Telling, asking, strong feeling." },
        spicy: { buckets: ["Full stop .", "Question mark ?", "Exclamation mark !"],
          cards: [["Jay asked where the birds were", 0], ["I wonder if it will rain", 0], ["Where are the birds", 1], ["Will it rain", 1], ["Stop right there", 2], ["Unhand me, goblin", 2]],
          why: "Jay asked where... and I wonder if... report a question, so they take a full stop. Unhand me, goblin is shouted, so it gets an exclamation mark." } },
      { q: "Which end mark would each one need? (The end marks are missing.)",
        buckets: ["Full stop . (telling)", "Question mark ? (asking)"],
        cards: [["The bus is late", 0], ["I like toast", 0], ["What time is it", 1], ["Do you like toast", 1]],
        ez: { q: "Which end mark does each one need?", why: "Telling gets <b>.</b> Asking gets <b>?</b>" },
        hint: "Is it asking something?",
        why: "Telling gets a full stop. Asking gets a question mark.",
        medium: { buckets: ["Full stop . (telling)", "Question mark ? (asking)", "Exclamation mark ! (strong feeling)"],
          cards: [["The bus is late", 0], ["I like toast", 0], ["What time is it", 1], ["Do you like toast", 1], ["Help", 2], ["We won", 2]] },
        spicy: { buckets: ["Full stop .", "Question mark ?", "Exclamation mark !"],
          cards: [["She asked what time it was", 0], ["Please sit down", 0], ["What time is it", 1], ["Could you pass the salt", 1], ["Get out now", 2], ["What a goal", 2]],
          why: "She asked what time... reports a question. Please sit down is a calm command. What a goal is an exclamation, even though it starts with What." } },
      { q: "Which end mark would each one need? (The end marks are missing.)",
        buckets: ["Full stop . (telling)", "Question mark ? (asking)"],
        cards: [["The heron is grey", 0], ["We are going home", 0], ["Is that a heron", 1], ["Why are we going home", 1]],
        ez: { q: "Which end mark does each one need?", why: "Telling gets <b>.</b> Asking gets <b>?</b>" },
        hint: "Is it asking something?",
        why: "Telling gets a full stop. Asking gets a question mark.",
        medium: { buckets: ["Full stop . (telling)", "Question mark ? (asking)", "Exclamation mark ! (strong feeling)"],
          cards: [["The heron is grey", 0], ["We are going home", 0], ["Is that a heron", 1], ["Why are we going home", 1], ["Look, a heron", 2], ["Outrageous", 2]],
          why: "Telling, asking, strong feeling. Outrageous is one of Jay's favourite exclamations." },
        spicy: { buckets: ["Full stop .", "Question mark ?", "Exclamation mark !"],
          cards: [["Jay wondered whether it was a heron", 0], ["Tell me what you saw", 0], ["Was it a heron", 1], ["You saw a heron", 1], ["How huge it was", 2], ["Outrageous", 2]],
          why: "You saw a heron? can be a question when the voice goes up. Tell me what you saw is a calm command. How huge it was is an exclamation." } }
    ]),

    Q("mc", "Asking or shouting?", null, [
      { q: "Which end mark does this need?" + task("Help, the goblin has my hat"),
        o: ["An exclamation mark !", "A question mark ?", "A full stop ."],
        s: ["It is not asking anything.", "This is not calm! Jay is shouting for help."],
        ez: { why: "A shout for help: <b>Help, the goblin has my hat!</b>", s: ["It is not asking anything.", "This is not calm! Jay is shouting."] },
        hint: "Is it calm, asking, or shouting?",
        why: "Shouting for help is a strong feeling: <b>Help, the goblin has my hat!</b>",
        spicy: { q: "Which end mark does this need?" + task("I wonder whether Bonnie is hungry"),
          o: ["A full stop .", "A question mark ?", "An exclamation mark !"],
          s: ["It sounds like a question, but it is telling us what someone wonders. That is an indirect question.", "It is calm, not shouted."],
          why: "An indirect question takes a full stop. The direct version would be: <b>Is Bonnie hungry?</b>" } },
      { q: "Which end mark does this need?" + task("What time is it"),
        o: ["A question mark ?", "An exclamation mark !", "A full stop ."],
        s: ["It is asking, not shouting.", "It is asking something, so it needs a question mark."],
        ez: { why: "It asks: <b>What time is it?</b>", s: ["It is asking, not shouting.", "It is asking. It needs <b>?</b>"] },
        hint: "Is it asking?",
        why: "It is asking: <b>What time is it?</b>",
        spicy: { q: "Which end mark does this need?" + task("What a brilliant goal that was"),
          o: ["An exclamation mark !", "A question mark ?", "A full stop ."],
          s: ["It starts with What, but it is not asking anything. It is an exclamation.", "It is a strong feeling, not calm telling."],
          why: "What a... is an exclamation: <b>What a brilliant goal that was!</b>" } },
      { q: "Which end mark does this need?" + task("The film starts at six"),
        o: ["A full stop .", "A question mark ?", "An exclamation mark !"],
        s: ["It is not asking anything.", "It is calm telling, not a strong feeling."],
        ez: { why: "It is calm telling: <b>The film starts at six.</b>", s: ["It is not asking anything.", "It is calm, not a strong feeling."] },
        hint: "Is it calm, asking, or shouting?",
        why: "It is calm telling: <b>The film starts at six.</b>",
        spicy: { q: "Which end mark does this need?" + task("Jay asked whether the film started at six"),
          o: ["A full stop .", "A question mark ?", "An exclamation mark !"],
          s: ["It reports what Jay asked, so it is an indirect question.", "It is calm, not shouted."],
          why: "Indirect question: full stop. The direct version: <b>Does the film start at six?</b>" } }
    ]),

    Q("mc", "Asking or shouting?", { explain: true, fixed: true, lab: true }, [
      { q: "Same words, different marks. Which one is <b>asking</b>?",
        o: ["You ate the cake?", "You ate the cake.", "You ate the cake!"],
        ez: { q: "Which one is <b>asking</b>?", why: "The <b>?</b> makes it a question." },
        s: ["That is calm telling.", "That is shouting with surprise."],
        hint: "Which one has the asking mark?",
        why: "The question mark makes it a question. Say it aloud: your voice goes up at the end.",
        spicy: { q: "Which message uses exclamation marks best?",
          o: ["We won! See you at training on Monday.", "We won!!! See you at training on Monday!!!", "We won. See you at training on Monday!"],
          s: ["Too many. They lose their punch, and Monday training is not that exciting.", "The exciting bit gets a full stop and the boring bit gets the exclamation mark."],
          why: "One exclamation mark, on the exciting bit." } },
      { q: "Same words, different marks. Which one shows <b>surprise</b>?",
        o: ["It is snowing!", "It is snowing.", "Is it snowing?"],
        ez: { q: "Which one shows <b>surprise</b>?", why: "The <b>!</b> shows the surprise." },
        s: ["That is calm telling.", "That is asking."],
        hint: "Which one has the strong feeling mark?",
        why: "The exclamation mark shows the surprise.",
        spicy: { q: "Which message uses exclamation marks best?",
          o: ["I passed my test! Thanks for all your help.", "I passed my test!!!!!! Thanks for all your help!!!!!!", "I passed my test. Thanks for all your help!"],
          s: ["Six in a row is noise, not feeling.", "The big news gets a full stop and the thank you gets the exclamation."],
          why: "One exclamation mark, on the big news." } },
      { q: "Same words, different marks. Which one is <b>calm telling</b>?",
        o: ["The bus is here.", "The bus is here!", "Is the bus here?"],
        ez: { q: "Which one is <b>calm telling</b>?", why: "The full stop is calm." },
        s: ["That is excited.", "That is asking."],
        hint: "Which one has the calm mark?",
        why: "The full stop is calm.",
        spicy: { q: "Which message uses exclamation marks best?",
          o: ["Bonnie found her ball! It was under the sofa.", "Bonnie found her ball!!! It was under the sofa!!!", "Bonnie found her ball. It was under the sofa!"],
          s: ["Too many. They lose their punch.", "The happy news gets a full stop and the sofa gets the exclamation."],
          why: "One exclamation mark, on the happy bit." } }
    ]),

    /* ---------- chunk 4: fix it (worked example, then fade) ---------- */
    { type: "learn", topic: "Fix it", title: "Watch a message get fixed",
      ez: { title: "Fix a message", html: "<p>Fix it in <b>3 steps</b>.</p><p>1 Find the ends. 2 Add end marks. 3 Add capitals.</p>" },
      fig: FIX,
      html: "<p>Here is a message with no punctuation at all:</p>" + task("where are you i found bonnie she was in the garden") +
        "<p><b>1. Find the ends.</b> Read it aloud. Where does each idea finish? <b>where are you / i found bonnie / she was in the garden</b></p>" +
        "<p><b>2. Add the end marks.</b> The first one asks, so <b>?</b>. The others tell, so <b>.</b></p>" +
        "<p><b>3. Add the capitals.</b> The start of each sentence, plus I and names:</p>" +
        task("Where are you? I found Bonnie. She was in the garden."),
      lv: { spicy: { html: "<p>Here is a message with punctuation problems:</p>" + task("where are you, i found bonnie she was in the garden, she was chasing a pigeon") +
        "<p><b>1. Find the ends.</b> Commas are hiding sentence ends (comma splices), and one spot has nothing at all.</p>" +
        "<p><b>2. End marks.</b> A question, then statements. Or join two with a word like <b>and</b>.</p>" +
        "<p><b>3. Capitals</b> at the start, plus I and names:</p>" +
        task("Where are you? I found Bonnie. She was in the garden, and she was chasing a pigeon.") } } },

    Q("mc", "Fix it", null, [
      { q: "<b>Step 1 is done</b>: the ends are marked with /. Step 2: which end marks go in?" + task("can you come to the park / bonnie wants to play"),
        o: ["question mark, then full stop", "full stop, then question mark", "exclamation mark, then question mark"],
        ez: { q: "The ends have a /. Which end marks go in?" + task("can you come to the park / bonnie wants to play"), s: ["The first part asks. The second tells.", "The first part asks. It does not shout."] },
        s: ["The first part is asking, and the second is telling.", "The first part is asking, not shouting."],
        hint: "Which part is asking?",
        why: "<b>Can you come to the park? Bonnie wants to play.</b>",
        medium: { q: "<b>Step 1 is done</b>: the ends are marked with /. Step 2: which end marks go in?" + task("can you come to the park / bonnie wants to play / hurry up, she is barking"),
          o: ["question mark, then full stop, then exclamation mark", "full stop, then question mark, then exclamation mark", "question mark, then exclamation mark, then full stop"],
          s: ["The first part is asking.", "Bonnie wanting to play is calm telling. The hurry up is the urgent bit."] },
        spicy: { q: "<b>Step 1 is done</b>. Step 2: which end marks go in?" + task("jay asked if we could come / can you make it / it starts at six"),
          o: ["full stop, then question mark, then full stop", "question mark, then question mark, then full stop", "question mark, then full stop, then exclamation mark"],
          s: ["Jay asked if... reports a question, so it takes a full stop.", "The first is an indirect question, and the start time is calm."],
          why: "<b>Jay asked if we could come. Can you make it? It starts at six.</b>" } },
      { q: "<b>Step 1 is done</b>: the ends are marked with /. Step 2: which end marks go in?" + task("watch out / there is a wasp"),
        o: ["exclamation mark, then full stop", "question mark, then full stop", "full stop, then question mark"],
        ez: { q: "The ends have a /. Which end marks go in?" + task("watch out / there is a wasp"), s: ["Watch out is not asking anything.", "Watch out is a warning, not calm."] },
        s: ["Watch out is not asking anything.", "Watch out is a warning, not calm."],
        hint: "Which part is a warning?",
        why: "<b>Watch out! There is a wasp.</b>",
        medium: { q: "<b>Step 1 is done</b>: the ends are marked with /. Step 2: which end marks go in?" + task("watch out / there is a wasp / is it near you"),
          o: ["exclamation mark, then full stop, then question mark", "question mark, then full stop, then exclamation mark", "full stop, then exclamation mark, then question mark"],
          s: ["Watch out is a warning, and the last part is asking.", "Watch out is the urgent bit."] },
        spicy: { q: "<b>Step 1 is done</b>. Step 2: which end marks go in?" + task("watch out / i wonder where it came from / did you leave the window open"),
          o: ["exclamation mark, then full stop, then question mark", "exclamation mark, then question mark, then question mark", "full stop, then question mark, then question mark"],
          s: ["I wonder where... is an indirect question, so it takes a full stop.", "Watch out is a warning, so it needs an exclamation mark."] } },
      { q: "<b>Step 1 is done</b>: the ends are marked with /. Step 2: which end marks go in?" + task("i saw a heron / did you see it"),
        o: ["full stop, then question mark", "question mark, then full stop", "exclamation mark, then exclamation mark"],
        ez: { q: "The ends have a /. Which end marks go in?" + task("i saw a heron / did you see it"), s: ["The first part tells. The second asks.", "Neither part is shouting."] },
        s: ["The first part is telling and the second is asking.", "Neither part is shouting."],
        hint: "Which part is asking?",
        why: "<b>I saw a heron. Did you see it?</b>",
        medium: { q: "<b>Step 1 is done</b>: the ends are marked with /. Step 2: which end marks go in?" + task("i saw a heron / it was enormous / did you see it"),
          o: ["full stop, then exclamation mark, then question mark", "question mark, then full stop, then exclamation mark", "full stop, then question mark, then full stop"],
          s: ["The first part is telling, and the last part is asking.", "The last part is asking."] },
        spicy: { q: "<b>Step 1 is done</b>. Step 2: which end marks go in?" + task("jay asked if i had seen the heron / what a bird / did you see it too"),
          o: ["full stop, then exclamation mark, then question mark", "question mark, then exclamation mark, then question mark", "full stop, then question mark, then question mark"],
          s: ["Jay asked if... reports a question.", "What a bird is an exclamation, not a question."] } }
    ]),

    Q("multi", "Fix it", null, [
      { q: "<b>Steps 1 and 2 are done.</b> Step 3: pick <b>all</b> the words that need a capital letter." + task("can you come to the park? bonnie wants to play."),
        ez: { q: "Now pick <b>all</b> the words that need a capital." + task("can you come to the park? bonnie wants to play."), slips: { any: "2 of them. The first word, and Bonnie." } },
        options: ["can", "come", "park", "bonnie", "play"],
        answers: [0, 3],
        slips: { any: "Two. The start of the first sentence, and Bonnie (a name, and the start of the second)." },
        hint: "Starts of sentences, and names.",
        why: "<b>Can you come to the park? Bonnie wants to play.</b>",
        medium: { q: "<b>Steps 1 and 2 are done.</b> Step 3: pick <b>all</b> the words that need a capital letter." + task("can you come to the park on saturday? bonnie and i want to play."),
          options: ["can", "park", "saturday", "bonnie", "i", "play"], answers: [0, 2, 3, 4],
          slips: { any: "Four. A sentence start, a day, a name, and I." } },
        spicy: { q: "<b>Steps 1 and 2 are done.</b> Step 3: pick <b>all</b> the words that need a capital letter." + task("can you come to [[place]] on saturday? mum says bonnie and i can stay until it gets dark in the autumn."),
          options: ["can", "[[place]]", "saturday", "mum", "bonnie", "i", "dark", "autumn"], answers: [0, 1, 2, 3, 4, 5],
          slips: { any: "Six. Mum starts a sentence, so it gets a capital anyway. Dark is not a name, and autumn is a season." } } },
      { q: "<b>Steps 1 and 2 are done.</b> Step 3: pick <b>all</b> the words that need a capital letter." + task("watch out! there is a wasp."),
        ez: { q: "Now pick <b>all</b> the words that need a capital." + task("watch out! there is a wasp."), slips: { any: "2 of them. Each sentence starts with a capital." } },
        options: ["watch", "out", "there", "wasp"],
        answers: [0, 2],
        slips: { any: "Two. Each sentence starts with a capital." },
        hint: "Each sentence start.",
        why: "<b>Watch out! There is a wasp.</b>",
        medium: { q: "<b>Steps 1 and 2 are done.</b> Step 3: pick <b>all</b> the words that need a capital letter." + task("watch out, jay! there is a wasp near [[who]]."),
          options: ["watch", "jay", "there", "wasp", "[[who]]"], answers: [0, 1, 2, 4],
          slips: { any: "Four. Two sentence starts and two names. Wasp is not a name." } },
        spicy: { q: "<b>Steps 1 and 2 are done.</b> Step 3: pick <b>all</b> the words that need a capital letter." + task("watch out, dad! there is a wasp near [[who]], and my dad hates wasps."),
          options: ["watch", "dad (after watch out)", "there", "[[who]]", "dad (after my)", "wasps"], answers: [0, 1, 2, 3],
          slips: { any: "Four. The first Dad is used as a name. The second comes after my, so it is not." } } },
      { q: "<b>Steps 1 and 2 are done.</b> Step 3: pick <b>all</b> the words that need a capital letter." + task("i saw a heron. did you see it?"),
        ez: { q: "Now pick <b>all</b> the words that need a capital." + task("i saw a heron. did you see it?"), slips: { any: "2 of them. I, and the next sentence start." } },
        options: ["i", "saw", "heron", "did", "see"],
        answers: [0, 3],
        slips: { any: "Two. I, and the start of the second sentence." },
        hint: "I, and each sentence start.",
        why: "<b>I saw a heron. Did you see it?</b>",
        medium: { q: "<b>Steps 1 and 2 are done.</b> Step 3: pick <b>all</b> the words that need a capital letter." + task("jay and i saw a heron in [[place]]. did you see it?"),
          options: ["jay", "i", "heron", "[[place]]", "did", "see"], answers: [0, 1, 3, 4],
          slips: { any: "Four. A name, I, a place and a sentence start." } },
        spicy: { q: "<b>Steps 1 and 2 are done.</b> Step 3: pick <b>all</b> the words that need a capital letter." + task("last winter, jay and i saw a heron by the river in [[place]]. did you see it on tuesday?"),
          options: ["last", "winter", "jay", "i", "river", "[[place]]", "did", "tuesday"], answers: [0, 2, 3, 5, 6, 7],
          slips: { any: "Six. Winter is a season and river is not a name here." } } }
    ]),

    Q("mc", "Fix it", { explain: true, fixed: true, lab: true }, [
      { q: "<b>All three steps, on your own.</b> Which is the correctly fixed version?" + task("where is jay i need to tell him something"),
        o: ["Where is Jay? I need to tell him something.", "where is jay? i need to tell him something.", "Where is Jay. I need to tell him something?"],
        ez: { q: "Now all 3 steps. Which one is right?" + task("where is jay i need to tell him something"), why: "<b>?</b> for the question. <b>.</b> for telling. Capitals too.", s: ["The marks are right. The capitals are missing.", "The marks are swapped. The first part asks."] },
        s: ["The end marks are right, but the capitals are missing.", "The marks are swapped: the first part asks, the second tells."],
        hint: "Check the ends, then the capitals.",
        why: "A question mark for the question, a full stop for the telling, capitals for each start, Jay and I.",
        medium: { q: "<b>All three steps, on your own.</b> Which is the correctly fixed version?" + task("where is jay i need to tell him something bonnie has eaten his lunch"),
          o: ["Where is Jay? I need to tell him something. Bonnie has eaten his lunch!", "Where is Jay. I need to tell him something. Bonnie has eaten his lunch?", "where is Jay? I need to tell him something bonnie has eaten his lunch!"],
          s: ["The first part is a question, and the lunch news is not asking anything.", "Missing a capital at the start, a full stop after something, and Bonnie's capital."] },
        spicy: { q: "<b>All three steps, on your own.</b> Which is the best fixed version?" + task("where is jay, i need to tell him something, bonnie has eaten his lunch"),
          o: ["Where is Jay? I need to tell him something: Bonnie has eaten his lunch!", "Where is Jay, I need to tell him something, Bonnie has eaten his lunch!", "Where is Jay? I need to tell him something, Bonnie has eaten his lunch."],
          s: ["Capitals fixed, but the commas are still splicing three sentences together.", "Better, but there is still a comma splice before Bonnie."],
          why: "Question mark, then a colon (or a full stop) to separate the news. And Bonnie is in trouble." } },
      { q: "<b>All three steps, on your own.</b> Which is the correctly fixed version?" + task("help the feeder has fallen down"),
        o: ["Help! The feeder has fallen down.", "help! the feeder has fallen down.", "Help? The feeder has fallen down!"],
        ez: { q: "Now all 3 steps. Which one is right?" + task("help the feeder has fallen down"), s: ["The marks are right. Add the capitals.", "Help is a shout, not a question."] },
        s: ["The marks are right, but each sentence needs a capital.", "Help is a shout, not a question."],
        hint: "Check the ends, then the capitals.",
        why: "Help is a shout, then calm telling.",
        medium: { q: "<b>All three steps, on your own.</b> Which is the correctly fixed version?" + task("help the feeder has fallen down can you get jay"),
          o: ["Help! The feeder has fallen down. Can you get Jay?", "Help. The feeder has fallen down. Can you get jay.", "help! the feeder has fallen down! can you get Jay?"],
          s: ["Help should be a shout, Can you... is a question, and Jay needs a capital.", "The capitals are missing at the starts."] },
        spicy: { q: "<b>All three steps, on your own.</b> Which is the best fixed version?" + task("help, the feeder has fallen down, can you get jay"),
          o: ["Help! The feeder has fallen down. Can you get Jay?", "Help, the feeder has fallen down, can you get Jay?", "Help! The feeder has fallen down, can you get Jay?"],
          s: ["Comma splices: three sentences joined with commas.", "There is still a comma splice before can."] } },
      { q: "<b>All three steps, on your own.</b> Which is the correctly fixed version?" + task("i love [[place]] do you"),
        o: ["I love [[Place]]. Do you?", "i love [[place]]. do you?", "I love [[Place]]? Do you."],
        ez: { q: "Now all 3 steps. Which one is right?" + task("i love [[place]] do you"), why: "Telling, then asking. Plus capitals.", s: ["The marks are right. Add the capitals.", "The marks are swapped. The second part asks."] },
        s: ["The marks are right, but I, the place and the start of each sentence need capitals.", "The marks are swapped: the first part tells, the second asks."],
        hint: "Check the ends, then the capitals.",
        why: "Telling, then asking. Capitals for I, the place and each start.",
        medium: { q: "<b>All three steps, on your own.</b> Which is the correctly fixed version?" + task("i love [[place]] do you we should go in june"),
          o: ["I love [[Place]]. Do you? We should go in June.", "I love [[place]]. Do you? We should go in june.", "I love [[Place]]? Do you. We should go in June!"],
          s: ["The place and the month need capitals.", "The marks are mixed up."] },
        spicy: { q: "<b>All three steps, on your own.</b> Which is the best fixed version?" + task("i love [[place]], do you, we should go in the summer"),
          o: ["I love [[Place]]. Do you? We should go in the summer.", "I love [[Place]], do you? We should go in the Summer.", "I love [[Place]]. Do you? We should go in the Summer."],
          s: ["Still a comma splice at the start, and summer is a season, so no capital.", "Summer is a season, so it does not get a capital."] } }
    ]),

    { type: "write", topic: "Fix it",
      q: "Only if you fancy it: write a short message to Jay. Use a full stop, a question mark and an exclamation mark somewhere in it.",
      starters: ["Hi Jay.", "Guess what!", "Did you know", "Have you seen"],
      checklist: ["Every sentence starts with a capital letter", "I used a full stop, a question mark and an exclamation mark", "Names and I have capitals"],
      minWords: 12,
      ez: { q: "Only if you fancy it. Write Jay a short message. Use <b>.</b> <b>?</b> and <b>!</b>" },
      lv: { medium: { minWords: 25, checklist: ["Every sentence starts with a capital and has an end mark", "I used . ? and !", "Names, days, places and I have capitals"] },
        spicy: { q: "Only if you fancy it: write a short message to Jay about something exciting, using one exclamation mark only, one question, and no comma splices.", minWords: 40,
          checklist: ["No comma splices or run ons", "Exactly one exclamation mark, on the exciting bit", "At least one name, place or day with a capital"] } } }
  ],

  realWorld: {
    title: "Where you would use this",
    html: "<p>Texts, emails, job applications, signs, captions online. A message with clear punctuation gets read the way you meant it, first time. On a job application, it is one of the first things people notice.</p>" +
      "<p>For our big question, if we could time travel, should we? If you went back far enough, you would find writing with no full stops at all, and often no spaces either. Over 2,000 years ago, a librarian in Alexandria called Aristophanes of Byzantium came up with dots to show readers where to pause. You could thank him in person.</p>",
    fig: '<svg viewBox="0 0 440 150" role="img" aria-label="An old scroll with no spaces or full stops, next to the time portal">' + A.portal(70, 76, 52) +
      '<rect x="150" y="34" width="190" height="84" rx="6" fill="#f3e2b8" stroke="#141a33" stroke-width="2.5"/><rect x="140" y="28" width="16" height="96" rx="8" fill="#b88a4a" stroke="#141a33" stroke-width="2"/><rect x="334" y="28" width="16" height="96" rx="8" fill="#b88a4a" stroke="#141a33" stroke-width="2"/>' +
      T(168, 66, "WHEREAREYOUIFOUND", 12, { b: 1, c: "#5a3a14" }) + T(168, 90, "BONNIESHEWASIN", 12, { b: 1, c: "#5a3a14" }) +
      A.bird(398, 76, 0.8, "#3a8fd6") + '</svg>'
  },

  ez: {
    realWorld: { title: "Where you use this", html: "<p>Texts, emails, job forms and signs.</p><p>Long ago, writing had no full stops at all!</p>" },
    make: { intro: "Write 3 sentences. One tells, one asks, one shouts.", fields: [{ label: "Telling ." }, { label: "Asking ?" }, { label: "Strong feeling !" }] }
  },

  make: {
    title: "Make a punctuation poster",
    intro: "Three sentences of your own: one that tells, one that asks, one with a strong feeling. Put it on the wall or send it to Jay.",
    fields: [
      { id: "tell", label: "A telling sentence (ends with .)", ph: "Bonnie has no tail.", max: 40 },
      { id: "ask", label: "An asking sentence (ends with ?)", ph: "Have you seen my bird book?", max: 40 },
      { id: "wow", label: "A strong feeling (ends with !)", ph: "That goal was amazing!", max: 40 },
      { id: "name", label: "Made by", ph: "B5", max: 20 }
    ],
    svg: function(v){
      function row(y, mark, col, txt){
        var ls = wrap(txt, 26, 2);
        return '<rect x="30" y="' + y + '" width="540" height="96" rx="16" fill="' + col + '" fill-opacity=".2" stroke="#141a33" stroke-width="2.5"/>' +
          '<circle cx="84" cy="' + (y + 48) + '" r="34" fill="' + col + '"/>' + T(84, y + 66, mark, 50, { a: "middle", b: 1, c: "#ffffff" }) +
          ls.map(function(l, k){ return T(140, y + (ls.length > 1 ? 42 : 58) + k * 30, esc(l), 24, { b: 1 }); }).join("");
      }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">' +
        '<rect width="600" height="420" rx="24" fill="#fffdf6"/>' +
        '<rect x="12" y="12" width="576" height="396" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        T(30, 46, "FULL STOP!", 22, { b: 1, c: "#e04848" }) +
        row(60, ".", "#3a4060", v.tell) + row(168, "?", "#1a7fb0", v.ask) + row(276, "!", "#e04848", v.wow) +
        T(30, 396, "Made by: " + esc(wrap(v.name, 20, 1)[0] || ""), 15, { c: "#5b6180" }) +
        A.bird(546, 34, 0.6, "#ffd23f") +
        '</svg>';
    }
  }
};
})();
