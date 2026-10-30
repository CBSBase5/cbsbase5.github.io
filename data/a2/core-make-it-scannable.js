/* Base 5 core target activity: Make it scannable.
   English. Titles, headings, bullet points and numbered lists that let a
   reader find what they need fast. Replayable: most questions carry two
   more versions for the next go. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
var LVS = ["mild", "medium", "spicy"], START = "medium";
function ext(a, b){ for(var k in b) if(Object.prototype.hasOwnProperty.call(b, k)) a[k] = b[k]; return a; }
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }
function task(h){ return '<div class="a2task">' + h + '</div>'; }

/* Question builder. Each version is {fields, mild:{...}, spicy:{...}}: shared fields first, then
   that level's changes. o:[right, others] becomes options (the right one moves round a place in each
   version, so a replay does not keep it in the same spot) and s:[slip for each other option] becomes
   slips. Version 1 is the base, the rest become vary, and every level is written out in full. */
function res(v, L, vi){
  var o = {};
  Object.keys(v).forEach(function(k){ if(LVS.indexOf(k) < 0 && k !== "ez") o[k] = v[k]; });
  if(v[L]) ext(o, v[L]);
  if(o.o){
    var right = o.o[0], rest = o.o.slice(1), t = vi % o.o.length, opts = rest.slice(), sl = {};
    opts.splice(t, 0, right);
    (o.s || []).forEach(function(m, j){ if(m) sl[j < t ? j : j + 1] = m; });
    o.options = opts; o.answer = t; o.slips = sl; delete o.o; delete o.s;
  }
  return o;
}
function Q(type, topic, flags, vers){
  var all = [], R = vers.map(function(v, vi){ var r = {}; LVS.forEach(function(L){ r[L] = res(v, L, vi); all.push(r[L]); }); return r; });
  var keys = {}; all.forEach(function(o){ Object.keys(o).forEach(function(k){ keys[k] = 1; }); });
  all.forEach(function(o){ Object.keys(keys).forEach(function(k){ if(!(k in o)) o[k] = null; }); });
  function others(r){ var lv = {}; LVS.forEach(function(L){ if(L !== START) lv[L] = r[L]; }); return lv; }
  var step = ext(ext({ type: type, topic: topic }, flags || {}), R[0][START]);
  step.lv = others(R[0]);
  if(R.length > 1) step.vary = R.slice(1).map(function(r){ return ext(ext({}, r[START]), { lv: others(r) }); });
  /* easy read for LC: a version's ez is for the first level only. s:[...] is the slips for the other
     options in o order, turned into slips the same way, against the first level's options. */
  vers.forEach(function(v, vi){
    if(!v.ez) return;
    var e = ext({}, v.ez), m = R[vi][LVS[0]];
    if(e.s){ var sl = {}; e.s.forEach(function(x, j){ if(x) sl[j < m.answer ? j : j + 1] = x; }); e.slips = sl; delete e.s; }
    if(vi === 0) step.ez = e; else step.vary[vi - 1].ez = e;
  });
  return step;
}

/* ---------- pictures ---------- */
function lines(x, y, n, w, gap, col){ var s = ""; for(var k = 0; k < n; k++) s += '<path d="M' + x + ' ' + (y + k * (gap || 14)) + 'h' + (w - (k * 37) % 46) + '" stroke="' + (col || "#9aa0b8") + '" stroke-width="4" stroke-linecap="round"/>'; return s; }
var ARROW = function(x, y){ return '<path d="M' + x + ' ' + y + 'h34" stroke="#141a33" stroke-width="4"/><path d="M' + (x + 32) + ' ' + (y - 9) + 'l14 9 -14 9z" fill="#141a33"/>'; };

/* a wall of text next to the same thing made scannable */
var WALL = '<svg viewBox="0 0 520 230" role="img" aria-label="A wall of text next to a scannable page with a title, headings, bullet points and a numbered list">' +
  '<rect width="520" height="230" rx="16" fill="#f4f1ea"/>' +
  '<rect x="24" y="16" width="196" height="172" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' + lines(38, 34, 11, 168, 14) +
  T(122, 214, "Wall of text", 16, { a: "middle", b: 1 }) +
  ARROW(238, 102) +
  '<rect x="300" y="16" width="196" height="172" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
  T(314, 42, "Bird club", 17, { b: 1 }) +
  '<rect x="314" y="52" width="70" height="18" rx="4" fill="#22b8e6"/>' + T(320, 66, "When", 12, { b: 1, c: "#ffffff" }) +
  '<circle cx="320" cy="84" r="4" fill="#141a33"/><path d="M330 84h70" stroke="#9aa0b8" stroke-width="4" stroke-linecap="round"/>' +
  '<circle cx="320" cy="100" r="4" fill="#141a33"/><path d="M330 100h52" stroke="#9aa0b8" stroke-width="4" stroke-linecap="round"/>' +
  '<rect x="314" y="112" width="96" height="18" rx="4" fill="#19c39a"/>' + T(320, 126, "How to join", 12, { b: 1, c: "#ffffff" }) +
  [0, 1, 2].map(function(k){ var y = 144 + k * 16; return '<circle cx="320" cy="' + y + '" r="7" fill="#ff8a5c"/>' + T(320, y + 4, String(k + 1), 10, { a: "middle", b: 1, c: "#ffffff" }) + '<path d="M332 ' + y + 'h' + [84, 64, 76][k] + '" stroke="#9aa0b8" stroke-width="4" stroke-linecap="round"/>'; }).join("") +
  T(398, 214, "Scannable", 16, { a: "middle", b: 1 }) +
  A.egg(A.bird(470, 34, 0.55, "#ffd23f"), "A bird reading the Bird club notice. It found the bit it needed in two seconds. Scannable!") +
  '</svg>';

/* the parts of a scannable page, labelled */
function lab(x1, y, x2, s, end){ return '<path d="M' + x1 + ' ' + (y - 5) + 'H' + x2 + '" stroke="#141a33" stroke-width="1.5" stroke-dasharray="4 3"/>' + T(end ? x2 - 6 : x2 + 6, y, s, 14, { b: 1, a: end ? "end" : null }); }
var PARTS = '<svg viewBox="0 0 520 250" role="img" aria-label="A notice with its parts labelled: title, heading, bullet points, numbered list">' +
  '<rect width="520" height="250" rx="16" fill="#f4f1ea"/>' +
  '<rect x="150" y="12" width="220" height="226" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
  T(166, 44, "Open day", 22, { b: 1 }) +
  T(166, 76, "When and where", 14, { b: 1, c: "#1a7fb0" }) + T(166, 94, "Saturday, 10am, main hall", 12) +
  T(166, 124, "What to bring", 14, { b: 1, c: "#1a7fb0" }) + T(172, 142, "&#8226; a coat", 12) + T(172, 158, "&#8226; a drink", 12) +
  T(166, 188, "How to get in", 14, { b: 1, c: "#1a7fb0" }) + T(172, 206, "1. Sign in at the desk", 12) + T(172, 222, "2. Pick up a badge", 12) +
  lab(160, 44, 136, "Title", 1) + lab(160, 76, 136, "Heading", 1) + lab(160, 124, 136, "Heading", 1) + lab(160, 188, 136, "Heading", 1) +
  lab(240, 150, 384, "Bullet points") + lab(330, 214, 384, "Numbered list") +
  '</svg>';

/* bullets versus numbers */
var BULLNUM = '<svg viewBox="0 0 520 220" role="img" aria-label="Bullet points are for any order, like a snack list. A numbered list is for when order matters, like making tea">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  '<rect x="22" y="16" width="226" height="188" rx="14" fill="#fffbe0" stroke="#141a33" stroke-width="2.5"/>' +
  T(135, 46, "Bullet points", 18, { a: "middle", b: 1 }) + T(135, 68, "Any order", 14, { a: "middle", c: "#5b6180" }) +
  ["crisps", "apples", "juice"].map(function(t, k){ return '<circle cx="52" cy="' + (98 + k * 30) + '" r="6" fill="#141a33"/>' + T(66, 103 + k * 30, t, 16); }).join("") +
  '<path d="M196 96q24 30 0 60" fill="none" stroke="#ff8a5c" stroke-width="4"/><path d="M188 150l8 10 6 -12z" fill="#ff8a5c"/><path d="M212 156q-24 -30 0 -60" fill="none" stroke="#22b8e6" stroke-width="4"/><path d="M220 102l-8 -10 -6 12z" fill="#22b8e6"/>' +
  '<rect x="272" y="16" width="226" height="188" rx="14" fill="#e8f7ff" stroke="#141a33" stroke-width="2.5"/>' +
  T(385, 46, "Numbered list", 18, { a: "middle", b: 1 }) + T(385, 68, "Order matters", 14, { a: "middle", c: "#5b6180" }) +
  ["Fill the kettle", "Boil it", "Pour it out"].map(function(t, k){ var y = 98 + k * 30; return '<circle cx="300" cy="' + y + '" r="11" fill="#22b8e6"/>' + T(300, y + 5, String(k + 1), 13, { a: "middle", b: 1, c: "#ffffff" }) + T(320, y + 5, t, 15); }).join("") +
  '<path d="M476 92v72" stroke="#141a33" stroke-width="4"/><path d="M467 160l9 14 9 -14z" fill="#141a33"/>' +
  '</svg>';

/* the three steps from paragraph to scannable */
var WORKED = '<svg viewBox="0 0 540 200" role="img" aria-label="Three steps: find the topic, pick out the facts, then lay them out with a title, headings and bullets">' +
  '<rect width="540" height="200" rx="16" fill="#f4f1ea"/>' +
  '<rect x="20" y="16" width="140" height="136" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' + lines(32, 34, 8, 116, 14) +
  '<rect x="30" y="56" width="52" height="12" rx="3" fill="#ffd23f" fill-opacity=".8"/><rect x="72" y="84" width="60" height="12" rx="3" fill="#ffd23f" fill-opacity=".8"/><rect x="34" y="126" width="56" height="12" rx="3" fill="#ffd23f" fill-opacity=".8"/>' +
  ARROW(166, 84) +
  '<rect x="214" y="16" width="120" height="136" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
  [0, 1, 2].map(function(k){ return '<rect x="230" y="' + (34 + k * 38) + '" width="88" height="24" rx="6" fill="#ffd23f" stroke="#141a33" stroke-width="1.5"/>'; }).join("") +
  ARROW(340, 84) +
  '<rect x="388" y="16" width="132" height="136" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
  '<rect x="400" y="28" width="90" height="12" rx="3" fill="#141a33"/>' +
  '<rect x="400" y="52" width="60" height="10" rx="3" fill="#22b8e6"/>' +
  [0, 1].map(function(k){ return '<circle cx="406" cy="' + (76 + k * 16) + '" r="4" fill="#141a33"/><path d="M416 ' + (76 + k * 16) + 'h' + [64, 50][k] + '" stroke="#9aa0b8" stroke-width="4" stroke-linecap="round"/>'; }).join("") +
  '<rect x="400" y="106" width="60" height="10" rx="3" fill="#19c39a"/>' +
  '<circle cx="406" cy="132" r="4" fill="#141a33"/><path d="M416 132h56" stroke="#9aa0b8" stroke-width="4" stroke-linecap="round"/>' +
  T(90, 180, "1. Topic", 15, { a: "middle", b: 1 }) + T(274, 180, "2. Facts", 15, { a: "middle", b: 1 }) + T(454, 180, "3. Layout", 15, { a: "middle", b: 1 }) +
  '</svg>';

/* Bonnie, asleep next to a very long notice */
var SLEEPY = '<svg viewBox="0 0 400 170" role="img" aria-label="Bonnie asleep next to a notice that is one huge paragraph">' +
  '<rect width="400" height="170" rx="16" fill="#f4f1ea"/>' +
  '<rect x="24" y="14" width="170" height="142" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' + T(38, 36, "BIRD CLUB", 13, { b: 1 }) + lines(38, 52, 7, 140, 14) +
  A.bonnie(290, 108, 1.1, "sit") +
  '<path d="M270 78q20 -6 40 0" stroke="#141a33" stroke-width="0" fill="none"/>' +
  T(330, 52, "z", 18, { b: 1, c: "#5b6180" }) + T(346, 36, "z", 22, { b: 1, c: "#5b6180" }) + T(366, 22, "z", 26, { b: 1, c: "#5b6180" }) +
  '</svg>';

(window.A2PACKS = window.A2PACKS || {})["core-make-it-scannable"] = {
  a2: true,
  id: "a2-core-make-it-scannable",
  title: "Make it scannable",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "Titles, headings, bullet points and numbered lists: so a reader can find what they need in seconds.",
  blurb: "Turning a wall of text into something a reader can scan. Four short chunks: why it matters, headings, bullets or numbers, and making one yourself. A mini poster to make at the end. Come back any time: the questions change each go.",
  note: "Make it scannable: headings and bullet points that help a reader find things fast. Four five minute chunks and a mini poster to make. The questions change each time you come back, so have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Glance", line: "Glance: one heading or one list at a time." },
    { id: "medium", name: "Scanner", line: "Scanner: titles, headings, bullets and numbers working together." },
    { id: "spicy", name: "X-ray vision", line: "X-ray vision: headings that match, bullets that match, and when a paragraph is better." }
  ],
  themes: {
    time: { name: "Time travel", w: { ev: "time travel taster day", place: "the science lab", kit1: "a notebook", kit2: "a packed lunch", kit3: "comfy shoes" } },
    football: { name: "Football", w: { ev: "five a side tournament", place: "the sports hall", kit1: "shin pads", kit2: "a water bottle", kit3: "trainers" } },
    horror: { name: "Horror", w: { ev: "haunted house night", place: "the old library", kit1: "a torch", kit2: "a warm coat", kit3: "a spare battery" } },
    fishing: { name: "Fishing", w: { ev: "beginners fishing day", place: "the lake", kit1: "a rod", kit2: "a warm hat", kit3: "wellies" } },
    music: { name: "Music", w: { ev: "open mic night", place: "the music room", kit1: "your lyrics", kit2: "a water bottle", kit3: "your instrument" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: WALL,
  steps: [

    /* ---------- chunk 1: why scannable ---------- */
    { type: "learn", topic: "Wall of text", title: "Make it easy to find things",
      fig: WALL,
      html: "<p>Most people do not read a notice word by word. They <b>scan</b>: their eyes jump about, looking for the one bit they need.</p>" +
        "<p>A scannable text helps them. It has a <b>title</b> that says what it is, <b>headings</b> that label each section, <b>bullet points</b> for lists and <b>numbers</b> for steps that go in order.</p>" +
        "<p>Same facts, much faster to find.</p>",
      lv: {
        mild: { html: "<p>Look at the two pages. They say the same thing.</p>" +
          "<p>The first one is a <b>wall of text</b>. The second one has a <b>title</b>, <b>headings</b> and <b>lists</b>. You can find things on it fast.</p>" +
          "<p>That is what scannable means: easy to find things in.</p>" },
        spicy: { html: "<p>Readers scan. Studies of how people read screens show their eyes sweep across the top, then run down the left edge, picking up the first word or two of each line.</p>" +
          "<p>So a scannable text puts the important words exactly there: a <b>title</b> at the top, <b>headings</b> at the start of each section, and the key word at the <b>start</b> of each bullet point. <b>Numbers</b> show order. <b>Bold</b> picks out a word that must not be missed.</p>" +
          "<p>The skill is choosing the right feature for each job, and keeping them consistent.</p>" } } ,
      ez: { title: "Easy to find", html: "<p>Two pages. Same facts.</p><p>The second one is <b>scannable</b>. You find things fast.</p>" } },

    Q("mc", "Wall of text", null, [
      { q: "You need to know what to bring to the [[ev]]. Which notice gets you there fastest?",
        o: ["One with a heading <b>What to bring</b> and a short list under it", "One long paragraph with everything in it", "One in tiny writing so it all fits on a page"],
        s: ["You would have to read every word to find the kit. A heading takes you straight there.", "Tiny writing is harder to read, not faster."],
        hint: "Which one lets your eyes jump straight to the right bit?",
        why: "A heading tells you where the kit is, and a list shows it at a glance.",
        ez: { q: "Which notice shows the kit fastest?", hint: "Where can your eyes jump to?", why: "The heading <b>What to bring</b> takes you there.", s: ["You would read every word.", "Tiny writing is harder to read."] },
        spicy: { q: "Why is a notice with headings and bullet points faster to use than a paragraph?",
          o: ["Readers can jump straight to the section they need", "It has fewer facts in it", "It uses longer, cleverer words"],
          s: ["It can have exactly the same facts. It is the layout that changes.", "Longer words would slow a reader down, not speed them up."],
          why: "The facts are the same. Headings and bullets let a reader skip to the part they need." } },
      { q: "You want to find the start time quickly. Which helps most?",
        o: ["A heading <b>When</b> with the time just under it", "The time hidden in the middle of a long paragraph", "The time at the very end, in small letters"],
        s: ["You could find it, but only after reading most of the paragraph.", "Small and at the end is the last place a scanning eye looks."],
        hint: "Where would your eyes land first?",
        why: "A heading called When takes you right to the time.",
        ez: { q: "Which helps you find the start time fast?", hint: "Where do your eyes land first?", why: "A heading called <b>When</b> takes you there.", s: ["You would read most of it first.", "Small and at the end is hard to spot."] },
        spicy: { q: "A web page about the [[ev]] has the start time in paragraph four. What is the most useful change?",
          o: ["Give it its own heading near the top, like <b>When</b>", "Make paragraph four longer so it explains more", "Put the time in brackets"],
          s: ["Longer makes it harder to spot, not easier.", "Brackets make a detail look less important, which is the opposite of what you want."],
          why: "A heading near the top puts the time where scanning eyes go first." } },
      { q: "Which of these makes a notice easier to scan?",
        o: ["Short sections, each with a heading", "Making every sentence longer", "Taking out all the gaps between lines"],
        s: ["Longer sentences mean more reading before you find anything.", "Gaps help the eye see where one part ends and the next starts."],
        hint: "Think about the Scannable page in the picture.",
        why: "Short sections with headings let the reader jump to the one they need.",
        ez: { q: "Which page is easier to find things in?", hint: "Look at the two pages.", why: "Headings and lists help you find things.", s: ["A wall of text means reading every word."] },
        mild: { q: "Which page is easier to find things in?",
          o: ["The page with headings and lists", "The wall of text"], s: ["A wall of text makes you read every word to find one thing."],
          fig: WALL, why: "Headings and lists help you find things fast." },
        spicy: { q: "Which change would help a scanning reader <b>most</b>?",
          o: ["Start each bullet point with its key word", "Put the key word at the end of each bullet", "Write each bullet as a full paragraph"],
          s: ["Scanning eyes read the start of a line, not the end.", "A paragraph in a bullet is not a bullet any more."],
          why: "Eyes run down the left edge, so the key word should come first." } }
    ]),

    Q("match", "Wall of text", null, [
      { q: "Match each feature to its job.",
        pairs: [["Heading", "Says what one section is about"], ["Bullet points", "A list where the order does not matter"], ["Numbered list", "Steps that must go in order"], ["Bold", "Makes a key word jump out"]],
        hint: "Numbers are for things that go in order.",
        why: "Each feature has a job. Picking the right one for the job is what makes a text scannable.",
        ez: { q: "Match each one to its job.", hint: "Numbers are for order.", why: "Each one has its own job." },
        mild: { pairs: [["Heading", "Says what a section is about"], ["Bullet points", "A list"], ["Numbers", "Steps in order"]] },
        spicy: { pairs: [["Title", "Says what the whole text is about"], ["Heading", "Says what one section is about"], ["Subheading", "Splits a big section into smaller parts"], ["Bullet points", "A list where the order does not matter"], ["Numbered list", "Steps that must go in order"], ["Bold", "Makes a key word jump out"]] } }
    ]),

    { type: "mc", topic: "Wall of text", explain: true,
      q: "Jay's notice for bird club is one huge paragraph. Bonnie tried to read it and fell asleep. What would help most?",
      fig: SLEEPY,
      options: ["Split it into short sections, each with a heading", "Make the writing smaller so it fits", "Add more words so it explains better"],
      answer: 0,
      slips: { 1: "Smaller writing is harder to read. Bonnie would be asleep even faster.", 2: "More words makes the wall even bigger." },
      hint: "What is the opposite of a wall of text?",
      why: "Short sections with headings. Then even a sleepy poodle could find out when bird club is.",
      ez: { q: "Bonnie fell asleep reading Jay's notice. What would help?", hint: "What is the opposite of a wall?", why: "Short parts with headings. Even Bonnie could read that.", slips: { 1: "Smaller writing is harder to read.", 2: "More words make the wall bigger." } },
      lv: { spicy: { options: ["Add a title, split it into sections with headings, and list the kit as bullets", "Underline every sentence so it all looks important", "Put it all in capital letters so it stands out"],
        slips: { 1: "If everything is underlined, nothing stands out.", 2: "Capitals for everything are slower to read, and feel like shouting." },
        why: "A title, sections with headings, and bullets for the list. Each feature doing its own job." } } },

    /* ---------- chunk 2: headings ---------- */
    { type: "learn", topic: "Headings", title: "A heading is a label",
      fig: PARTS,
      html: "<p>A <b>title</b> says what the whole thing is about. A <b>heading</b> is a label for one section, so a reader knows what is in it before they read it.</p>" +
        "<p>Good headings are <b>short</b> (often two to four words), <b>clear</b> (you know exactly what is under them) and in <b>bold</b> or bigger writing so they stand out.</p>" +
        "<p><b>What to bring</b> is a good heading. <b>Other stuff</b> is not: it could be on top of anything.</p>",
      lv: {
        mild: { html: "<p>A <b>heading</b> is a label. It tells you what a part is about.</p>" +
          "<p>The heading <b>What to bring</b> tells you that the kit list is under it.</p>" +
          "<p>Good headings are <b>short</b> and <b>clear</b>.</p>" },
        spicy: { html: "<p>The <b>title</b> covers the whole text. <b>Headings</b> label each section. <b>Subheadings</b> split a big section into smaller parts, like <b>By bus</b> and <b>By train</b> under <b>Getting there</b>.</p>" +
          "<p>Good headings are short and specific, and they work as a <b>set</b>: the same style all the way down. All questions (<b>What is it? When is it?</b>) or all short labels (<b>Times, Cost, Kit</b>), not a mix.</p>" +
          "<p>Size and weight show the levels: the title is biggest, subheadings are smallest.</p>" } } ,
      ez: { title: "Headings", html: "<p>A <b>heading</b> is a label. It says what a part is about.</p><p><b>What to bring</b> is a good one.</p>" } },

    Q("mc", "Headings", null, [
      { q: "Which heading fits this section best?" + task("Bring [[kit1]], [[kit2]] and [[kit3]]. Please put your name on everything."),
        o: ["What to bring", "Hello everyone", "More information about lots of things"],
        s: ["That is a greeting. It does not say what is in the section.", "Far too long, and it could go on top of anything."],
        hint: "What is the section about?",
        why: "The section is a kit list, so <b>What to bring</b> labels it clearly.",
        ez: { q: "Which heading fits this part?" + task("Bring [[kit1]], [[kit2]] and [[kit3]]. Please put your name on everything."), hint: "What is it all about?", why: "It is a kit list. <b>What to bring</b> fits.", s: ["That is a hello. It is not a label.", "Far too long."] },
        spicy: { o: ["What to bring", "Things", "Please read this section carefully as it is important"],
          s: ["Too vague: things could mean anything.", "Long, and it still does not say what the section is about."] } },
      { q: "Which heading fits this section best?" + task("Doors open at 6pm. It finishes at 8pm, so please be picked up by 8.15."),
        o: ["When it is on", "What to bring", "Our amazing evening"],
        s: ["Nothing in the section is about kit.", "It sounds fun, but it does not tell a reader what is in the section."],
        hint: "The section is full of times.",
        why: "It is all about times, so <b>When it is on</b> fits.",
        ez: { q: "Which heading fits this part?" + task("Doors open at 6pm. It finishes at 8pm, so please be picked up by 8.15."), hint: "It is full of times.", why: "It is all times. <b>When it is on</b> fits.", s: ["Nothing here is about kit.", "Fun, but it does not say what is here."] },
        spicy: { o: ["Times", "Information", "Do not be late!"],
          s: ["Too vague: everything on the notice is information.", "That is a warning, not a label for the section."] } },
      { q: "Which heading fits this section best?" + task("It costs 2 pounds. Pay on the door. If that is tricky, have a quiet word with Jay."),
        o: ["Cost", "Food", "Welcome"],
        s: ["Nothing in the section is about food.", "Welcome would fit the start of a notice, not this section."],
        hint: "What does the section keep talking about?",
        why: "It is all about money, so <b>Cost</b> fits.",
        ez: { q: "Which heading fits this part?" + task("It costs 2 pounds. Pay on the door. If that is tricky, have a quiet word with Jay."), hint: "What does it keep talking about?", why: "It is all money. <b>Cost</b> fits.", s: ["Nothing here is about food.", "Welcome goes at the start."] },
        spicy: { o: ["Cost", "Money stuff and other things to think about", "Paying"],
          s: ["Long and vague: other things to think about could mean anything.", "Close, but it only covers paying, and the section is about the price too. Cost covers both."] } }
    ]),

    Q("sort", "Headings", null, [
      { q: "Sort these lines under the right heading.",
        buckets: ["When and where", "What to bring"],
        cards: [["It starts at 6pm.", 0], ["It is in [[place]].", 0], ["Doors open at 5.45.", 0], ["Bring [[kit1]].", 1], ["Pack [[kit2]].", 1], ["Remember [[kit3]].", 1]],
        hint: "Times and places go together. Kit goes together.",
        why: "Times and places live under <b>When and where</b>. Kit lives under <b>What to bring</b>.",
        ez: { q: "Sort each line under its heading.", hint: "Times and places go together.", why: "Time and place together. Kit together." },
        mild: { cards: [["It starts at 6pm.", 0], ["It is in [[place]].", 0], ["Bring [[kit1]].", 1], ["Pack [[kit2]].", 1]] },
        spicy: { buckets: ["When and where", "What to bring", "Cost"],
          cards: [["It starts at 6pm.", 0], ["It is in [[place]].", 0], ["Bring [[kit1]].", 1], ["Pack [[kit2]].", 1], ["Tickets are 3 pounds.", 2], ["Pay on the door.", 2], ["Under 5s go free.", 2]],
          why: "Times and places, kit, and money: three sections, three headings." } },
      { q: "Sort these lines under the right heading.",
        buckets: ["Getting there", "Food"],
        cards: [["The number 7 bus stops outside.", 0], ["Park by the main gate.", 0], ["It is a short walk from the station.", 0], ["Bring a packed lunch.", 1], ["Snacks are sold at the hatch.", 1], ["Water is free.", 1]],
        hint: "Buses and walking are about getting there.",
        why: "Travel lines go under <b>Getting there</b>, eating and drinking under <b>Food</b>.",
        ez: { q: "Sort each line under its heading.", hint: "Buses and parking are travel.", why: "Travel under <b>Getting there</b>. Eating under <b>Food</b>." },
        mild: { cards: [["The number 7 bus stops outside.", 0], ["Park by the main gate.", 0], ["Bring a packed lunch.", 1], ["Snacks are sold at the hatch.", 1]] },
        spicy: { buckets: ["Getting there", "Food", "Staying safe"],
          cards: [["The number 7 bus stops outside.", 0], ["Park by the main gate.", 0], ["Bring a packed lunch.", 1], ["Snacks are sold at the hatch.", 1], ["Stay with your group.", 2], ["First aid is at the front desk.", 2], ["Tell a member of staff if you feel unwell.", 2]],
          why: "Travel, food and safety: each set of lines gets its own section." } },
      { q: "Sort these lines under the right heading.",
        buckets: ["Who can come", "How to sign up"],
        cards: [["Anyone in Base 5 can come.", 0], ["You do not need to have done it before.", 0], ["Beginners are very welcome.", 0], ["Fill in the slip.", 1], ["Hand it in at the office.", 1], ["Sign up by Friday.", 1]],
        hint: "Which lines are about doing something to join?",
        why: "Who is welcome goes under <b>Who can come</b>. The jobs you do to join go under <b>How to sign up</b>.",
        ez: { q: "Sort each line under its heading.", hint: "Which lines are jobs to join?", why: "Who is welcome, then the jobs to join." },
        mild: { cards: [["Anyone in Base 5 can come.", 0], ["Beginners are very welcome.", 0], ["Fill in the slip.", 1], ["Hand it in at the office.", 1]] },
        spicy: { buckets: ["Who can come", "How to sign up", "Questions"],
          cards: [["Anyone in Base 5 can come.", 0], ["Beginners are very welcome.", 0], ["Fill in the slip.", 1], ["Hand it in at the office.", 1], ["Sign up by Friday.", 1], ["Not sure? Ask Jay.", 2], ["Ring the office on 01234 567890.", 2]],
          why: "Who, how, and who to ask: three jobs, three headings." } }
    ]),

    Q("mc", "Headings", null, [
      { q: "Which is the best <b>title</b> for the whole notice?",
        o: ["[[Ev]]: all you need to know", "Notice", "Please read every single word of this page"],
        s: ["Every notice is a notice. It does not say what this one is about.", "Long, and the whole point is that readers will not read every word."],
        hint: "A title says what the whole thing is about.",
        why: "It names the event and tells the reader this is the place to find everything.",
        ez: { hint: "A heading is a short label.", why: "<b>What to bring</b> is the label.", s: ["That goes under the heading."] },
        mild: { q: "Which one is a heading?", o: ["What to bring", "Bring [[kit1]] and [[kit2]]."], s: ["That is part of the list, not the label on top of it."],
          why: "<b>What to bring</b> is the label. The other one is a line that goes under it." },
        spicy: { q: "Which set of headings works best together on one notice?",
          o: ["What is it? / When is it? / What do I bring?", "What is it? / Time / BRING THESE THINGS!!", "Info / More info / Other stuff"],
          s: ["The facts are right, but the styles clash: a question, a label and a shout.", "They match, but none of them tells you what is in the section."],
          why: "All three are questions in the same style, and each one says exactly what is under it." } },
      { q: "Which one is a heading, not part of the main text?",
        o: ["Getting there", "The bus stops right outside the gate.", "You can park by the hall."],
        s: ["That is a full sentence of information. It would go under a heading.", "That is information that would sit under a heading like Getting there."],
        hint: "Headings are short labels, not full sentences.",
        why: "<b>Getting there</b> is a short label. The other two would sit under it.",
        ez: { q: "Which one is a heading?", hint: "Headings are short labels.", why: "<b>Getting there</b> is a short label.", s: ["That is a sentence. It goes under a heading."] },
        mild: { o: ["Getting there", "The bus stops right outside the gate."], s: ["That is a sentence that goes under the heading."] },
        spicy: { q: "Which subheading would fit under the heading <b>Getting there</b>?",
          o: ["By train", "Cost", "Food"],
          s: ["Cost is its own section, not part of getting there.", "Food is its own section too."],
          why: "<b>By train</b> splits Getting there into a smaller part. Cost and Food are separate sections." } },
      { q: "A section has the heading <b>Food</b>. Which line belongs under it?",
        o: ["Snacks are sold at the hatch.", "Doors open at 6pm.", "Bring [[kit1]]."],
        s: ["That is a time. It belongs under a heading like When.", "That is kit, unless you are very hungry."],
        hint: "Which one is about eating?",
        why: "Snacks are food. The other two belong in other sections.",
        ez: { q: "Which line goes under <b>Food</b>?", hint: "Which one is about eating?", why: "Snacks are food.", s: ["That is a time, not food."] },
        mild: { o: ["Snacks are sold at the hatch.", "Doors open at 6pm."], s: ["That is a time, not food."] },
        spicy: { q: "Which heading should be the biggest on the page?",
          o: ["The title, [[Ev]]", "What to bring", "By bus"],
          s: ["That is a section heading. The title sits above it.", "That is a subheading, so it is the smallest."],
          why: "The title covers everything, so it is biggest. Then headings, then subheadings." } }
    ]),

    Q("text", "Headings", null, [
      { q: "Write a short heading for this section." + task("Stay with your group. If you feel unwell, tell a member of staff. First aid is by the front door."),
        need: [["safe", "safety", "help", "first aid", "stay", "staying", "unwell", "health", "emergency", "rules", "look after", "care", "if you", "feeling"]],
        model: "Staying safe",
        slips: [[["hello", "welcome", "info", "stuff", "notice", "read"], "That could go on top of any section. Which word tells a reader this part is about staying safe?"]],
        hint: "What is every line in it about? Two or three words is plenty.",
        why: "Something like <b>Staying safe</b> or <b>If you need help</b> tells a reader exactly what is in the section." ,
        ez: { q: "Write a short heading for this." + task("Stay with your group. If you feel unwell, tell a member of staff. First aid is by the front door."), hint: "What is it all about?", why: "Something like <b>Staying safe</b>.", slips: [[[], "That could go on anything. What is this part about?"]] } },
      { q: "Write a short heading for this section." + task("The coach leaves the front gate at 9am. It gets back at 3pm. Please be there ten minutes early."),
        need: [["coach", "bus", "travel", "getting", "time", "times", "when", "leav", "journey", "transport", "trip", "depart", "pick"]],
        model: "Coach times",
        slips: [[["hello", "welcome", "info", "stuff", "notice", "read"], "That could go on top of any section. What is this one about?"]],
        hint: "The section is about the coach and when it goes.",
        why: "Something like <b>Coach times</b> or <b>Travel</b> tells a reader what is in the section." ,
        ez: { q: "Write a short heading for this." + task("The coach leaves the front gate at 9am. It gets back at 3pm. Please be there ten minutes early."), hint: "It is about the coach.", why: "Something like <b>Coach times</b>.", slips: [[[], "That could go on anything. What is this part about?"]] } },
      { q: "Write a short heading for this section." + task("Tickets are 2 pounds. Pay on the door. Under 5s go free."),
        need: [["cost", "price", "ticket", "pay", "money", "how much", "fee", "entry", "pound", "charge"]],
        model: "Tickets and prices",
        slips: [[["hello", "welcome", "info", "stuff", "notice", "read"], "That could go on top of any section. What is this one about?"]],
        hint: "Every line is about money.",
        why: "Something like <b>Cost</b> or <b>Tickets</b> tells a reader what is in the section." ,
        ez: { q: "Write a short heading for this." + task("Tickets are 2 pounds. Pay on the door. Under 5s go free."), hint: "Every line is about money.", why: "Something like <b>Cost</b> or <b>Tickets</b>.", slips: [[[], "That could go on anything. What is this part about?"]] } }
    ]),

    /* ---------- chunk 3: bullets or numbers ---------- */
    { type: "learn", topic: "Bullets or numbers", title: "Bullets or numbers?",
      fig: BULLNUM,
      html: "<p>Both make a list easy to scan. The question is: <b>does the order matter?</b></p>" +
        "<p><b>Bullet points</b> are for things in any order: kit, snacks, people in a team.</p>" +
        "<p><b>Numbers</b> are for things that only work in one order: steps, directions, a top three.</p>" +
        "<p>Either way, keep each point <b>short</b> and put the key word near the start.</p>",
      lv: {
        mild: { html: "<p><b>Bullet points</b> are for a list in any order, like snacks.</p>" +
          "<p><b>Numbers</b> are for steps that go in order, like making a cup of tea.</p>" +
          "<p>Keep each point short.</p>" },
        spicy: { html: "<p>Bullets for any order, numbers when order matters. Then two more things make a list really work.</p>" +
          "<p><b>Keep the points parallel.</b> Start each one the same way: all with a bossy verb (<b>Bring, Pack, Check</b>) or all with a thing (<b>a coat, a drink</b>). A mixed list makes the reader keep changing gear.</p>" +
          "<p><b>Know when not to use them.</b> Bullets chop ideas apart. If you are explaining <b>why</b>, with <b>because</b> and <b>so</b>, a paragraph keeps the reasons joined up.</p>" } } ,
      ez: { title: "Bullets or numbers?", html: "<p><b>Bullets</b>: any order, like snacks.</p><p><b>Numbers</b>: steps in order, like making tea.</p>" } },

    Q("sort", "Bullets or numbers", null, [
      { q: "Bullets or numbers? Sort these lists.",
        buckets: ["Bullet points (any order)", "Numbered list (order matters)"],
        cards: [["What to pack for the [[ev]]", 0], ["How to put up a tent", 1], ["Snacks on the menu", 0], ["Steps to make a cup of tea", 1], ["Directions from the station", 1], ["People in the team", 0]],
        hint: "Ask each one: would it go wrong if you did it in a different order?",
        why: "Steps and directions go wrong in the wrong order, so they get numbers. Kit, snacks and people can be in any order.",
        ez: { q: "Bullets or numbers? Sort the lists.", hint: "Would a new order go wrong?", why: "Steps go wrong out of order. They get numbers." },
        mild: { cards: [["What to pack for the [[ev]]", 0], ["How to put up a tent", 1], ["Snacks on the menu", 0], ["Steps to make a cup of tea", 1]] },
        spicy: { cards: [["What to pack for the [[ev]]", 0], ["How to put up a tent", 1], ["Snacks on the menu", 0], ["Directions from the station", 1], ["The top 3 scores, from first to third", 1], ["Colours the shirts come in", 0], ["What to do in a fire drill", 1]],
          why: "A top 3 is a ranking and a fire drill is a sequence, so order matters for both." } },
      { q: "Bullets or numbers? Sort these lists.",
        buckets: ["Bullet points (any order)", "Numbered list (order matters)"],
        cards: [["Things you need for a pizza", 0], ["How to make the pizza", 1], ["Birds Jay saw at the park", 0], ["How to log in to a laptop", 1], ["Things in a first aid kit", 0], ["How to change a bike tyre", 1]],
        hint: "A how to list is usually steps.",
        why: "The how to lists are steps, so they get numbers. The rest can go in any order.",
        ez: { q: "Bullets or numbers? Sort the lists.", hint: "A how to list is steps.", why: "How to lists are steps. They get numbers." },
        mild: { cards: [["Things you need for a pizza", 0], ["How to make the pizza", 1], ["Birds Jay saw at the park", 0], ["How to log in to a laptop", 1]] },
        spicy: { cards: [["Things you need for a pizza", 0], ["How to make the pizza", 1], ["Birds Jay saw at the park", 0], ["How to log in to a laptop", 1], ["A countdown of the top 5 songs", 1], ["Places you can buy tickets", 0], ["What happens on the day, from start to finish", 1]],
          why: "A countdown and a timeline both have an order. Places to buy tickets do not." } },
      { q: "Bullets or numbers? Sort these lists.",
        buckets: ["Bullet points (any order)", "Numbered list (order matters)"],
        cards: [["Games in the games cupboard", 0], ["How to bake a cake", 1], ["Bonnie's favourite toys", 0], ["How to wash your hands", 1], ["Rooms in the building", 0], ["How to set up the projector", 1]],
        hint: "Would washing your hands work if you dried them first?",
        why: "Baking, hand washing and setting up are all steps. Games, toys and rooms have no order.",
        ez: { q: "Bullets or numbers? Sort the lists.", hint: "Could you dry your hands first?", why: "Baking and washing are steps. Games and toys are not." },
        mild: { cards: [["Games in the games cupboard", 0], ["How to bake a cake", 1], ["Bonnie's favourite toys", 0], ["How to wash your hands", 1]] },
        spicy: { cards: [["Games in the games cupboard", 0], ["How to bake a cake", 1], ["Bonnie's favourite toys", 0], ["How to wash your hands", 1], ["Stages of a race, from start to finish", 1], ["Prizes you could win", 0], ["The league table, from top to bottom", 1]],
          why: "Race stages and a league table both have an order that means something. Prizes do not." } }
    ]),

    Q("order", "Bullets or numbers", null, [
      { q: "These are the steps to sign up for the [[ev]]. Put them in order for a numbered list.",
        items: ["Pick up a form from Jay", "Fill in your name", "Hand the form back", "Wait for a text to say you are in"],
        hint: "What do you need before you can fill anything in?",
        why: "Get the form, fill it in, hand it back, then wait. That is why it needs numbers.",
        ez: { q: "Put the steps to sign up in order.", hint: "You need the form first.", why: "Get it, fill it in, hand it back." },
        mild: { items: ["Pick up a form from Jay", "Fill in your name", "Hand the form back"] },
        spicy: { items: ["Pick up a form from Jay", "Fill in your name", "Ask a parent or carer to sign it", "Hand the form back", "Wait for a text to say you are in"] } },
      { q: "These are the steps to make toast. Put them in order for a numbered list.",
        items: ["Put the bread in the toaster", "Push the lever down", "Wait for it to pop up", "Spread the butter"],
        hint: "Butter before toasting would be a sticky mess.",
        why: "Bread in, lever down, wait, butter. Steps in order get numbers.",
        ez: { q: "Put the toast steps in order.", hint: "Butter first would be messy!", why: "Bread in, wait, then butter." },
        mild: { items: ["Put the bread in the toaster", "Wait for it to pop up", "Spread the butter"] },
        spicy: { items: ["Put the bread in the toaster", "Set the dial", "Push the lever down", "Wait for it to pop up", "Spread the butter"] } },
      { q: "These are Jay's steps for feeding the birds. Put them in order for a numbered list.",
        items: ["Fill the feeder with seed", "Hang it on a branch", "Step back and wait quietly", "Watch the birds arrive"],
        hint: "The feeder needs seed in it before it goes up.",
        why: "Fill it, hang it, step back, watch. Jay recommends step 4 most of all.",
        ez: { q: "Put Jay's bird feeding steps in order.", hint: "The seed goes in first.", why: "Fill it, hang it, watch. Jay loves the last step." },
        mild: { items: ["Fill the feeder with seed", "Hang it on a branch", "Watch the birds arrive"] },
        spicy: { items: ["Clean the feeder", "Fill the feeder with seed", "Hang it on a branch", "Step back and wait quietly", "Watch the birds arrive"] } }
    ]),

    Q("mc", "Bullets or numbers", null, [
      { q: "Which bullet point is best for a kit list?",
        o: ["&bull; [[Kit1]]", "&bull; It would be a really good idea if you could remember to bring [[kit1]] with you", "&bull; Stuff"],
        s: ["The kit is in there, but it is buried in the middle of a long sentence.", "Too vague: stuff could be anything."],
        hint: "Short, with the key word easy to see.",
        why: "Short, with the thing itself right at the start.",
        ez: { q: "Which bullet is best for a kit list?", hint: "Short and clear.", why: "Short, with the thing first.", s: ["Stuff could be anything."] },
        mild: { o: ["&bull; [[Kit1]]", "&bull; Stuff"], s: ["Stuff could be anything. Say what the thing is."] },
        spicy: { q: "Which list keeps its bullet points <b>parallel</b> (all starting the same way)?",
          o: ["&bull; Bring [[kit1]]<br>&bull; Pack [[kit2]]<br>&bull; Check you have [[kit3]]", "&bull; Bring [[kit1]]<br>&bull; [[Kit2]] is needed<br>&bull; Remember that [[kit3]] would be good", "&bull; [[Kit1]]<br>&bull; Pack [[kit2]]<br>&bull; You will need [[kit3]] as well"],
          s: ["Three different shapes: a bossy verb, a thing, then a long sentence.", "It starts with a thing, then changes to a verb, then to a sentence."],
          why: "Every point starts with a bossy verb: Bring, Pack, Check. The reader never has to change gear." } },
      { q: "Which bullet point is clearest?",
        o: ["&bull; Starts at 6pm", "&bull; So, the thing we are doing is going to start at about six in the evening, I think", "&bull; Time"],
        s: ["The time is in there, but it is lost in a long sentence.", "It says there is a time, but not what the time is."],
        hint: "Which one tells you the answer in a glance?",
        why: "Short, and the key fact is right there.",
        ez: { q: "Which bullet is clearest?", hint: "Which tells you at a glance?", why: "Short, with the time right there.", s: ["It does not say the time."] },
        mild: { o: ["&bull; Starts at 6pm", "&bull; Time"], s: ["It does not say what the time is."] },
        spicy: { q: "Which list keeps its bullet points parallel?",
          o: ["&bull; Arrive by 6pm<br>&bull; Find your group<br>&bull; Sign in at the desk", "&bull; Arrive by 6pm<br>&bull; Your group can be found by the door<br>&bull; Signing in is at the desk", "&bull; 6pm arrival<br>&bull; Find your group<br>&bull; The desk is for signing in"],
          s: ["Only the first one starts with a bossy verb.", "A thing, then a verb, then a sentence: three different shapes."],
          why: "Arrive, Find, Sign: every point starts with a bossy verb." } },
      { q: "Which bullet point is clearest?",
        o: ["&bull; Pay 2 pounds on the door", "&bull; There is a cost, and the cost is that you need to pay 2 pounds when you get to the door", "&bull; Money"],
        s: ["The facts are there, but it takes three times as long to read.", "It does not say how much, or when to pay."],
        hint: "Short, with the facts that matter.",
        why: "Short, and it gives the price and when to pay.",
        ez: { q: "Which bullet is clearest?", hint: "Short, with the facts.", why: "It says how much and when.", s: ["It does not say how much."] },
        mild: { o: ["&bull; Pay 2 pounds on the door", "&bull; Money"], s: ["It does not say how much."] },
        spicy: { q: "When is a paragraph better than bullet points?",
          o: ["When you are explaining why, with because and so", "When you are listing kit", "When you are listing snacks on sale"],
          s: ["A kit list is exactly what bullets are for.", "A snack list is exactly what bullets are for."],
          why: "Bullets chop ideas apart. Reasons need joining words, so a paragraph keeps them linked." } }
    ]),

    Q("multi", "Bullets or numbers", null, [
      { q: "Pick <b>all</b> the things that make a list easy to scan.",
        options: ["Each point is short", "Each point starts on a new line", "The key word comes near the start", "Every point is a long sentence", "No gaps between the points"],
        answers: [0, 1, 2],
        slips: { any: "Three of them help. Long sentences and no gaps make a list slower to scan." },
        hint: "Think about what your eyes need.",
        why: "Short points, each on its own line, with the key word first.",
        ez: { q: "Pick <b>all</b> that make a list easy to scan.", hint: "What do your eyes need?", why: "Short points, each on a new line.", slips: { any: "2 of them help. Long sentences are slow." } },
        mild: { options: ["Each point is short", "Each point starts on a new line", "Every point is a long sentence"], answers: [0, 1],
          slips: { any: "Two of them help. Long sentences make a list slow to read." } } },
      { q: "Pick <b>all</b> the lists that should be numbered.",
        options: ["Steps to fix a puncture", "Directions to the park", "How to make a smoothie", "Snacks on sale", "Names of the team"],
        answers: [0, 1, 2],
        slips: { any: "Three of them go in order. Snacks and names can be in any order." },
        hint: "Which ones go wrong in the wrong order?",
        why: "Fixing, directions and making all have steps in order. Snacks and names do not.",
        ez: { q: "Pick <b>all</b> the lists that need numbers.", hint: "Which go wrong out of order?", why: "Fixing and directions are steps in order.", slips: { any: "2 of them are steps. Snacks can be any order." } },
        mild: { options: ["Steps to fix a puncture", "Directions to the park", "Snacks on sale"], answers: [0, 1],
          slips: { any: "Two of them are steps. Snacks can be in any order." } } },
      { q: "Pick <b>all</b> the good headings for a section about where the [[ev]] is.",
        options: ["Where is it?", "Finding us", "Location", "Hello!", "Read this bit"],
        answers: [0, 1, 2],
        slips: { any: "Three of them say what the section is about. Hello and Read this bit could go on anything." },
        hint: "A good heading tells you what is under it.",
        why: "Where is it, Finding us and Location all tell a reader this is the place section.",
        ez: { q: "Pick <b>all</b> good headings for where it is.", hint: "Does it say what is under it?", why: "Where is it and Location both fit.", slips: { any: "2 of them fit. Hello could go on anything." } },
        mild: { options: ["Where is it?", "Location", "Hello!"], answers: [0, 1],
          slips: { any: "Two of them say what the section is about. Hello could go on anything." } } }
    ]),

    /* ---------- chunk 4: make one (worked example, then fade) ---------- */
    { type: "learn", topic: "Your turn to scan", title: "Watch a paragraph become scannable",
      fig: WORKED,
      html: "<p>Here is a chatty paragraph:</p>" +
        task("Hi everyone! The [[ev]] is coming up soon and it is going to be in [[place]]. It starts at 6pm. You will need [[kit1]], and also [[kit2]], and [[kit3]] would be good too. It costs 2 pounds.") +
        "<p><b>1. Topic.</b> What is it all about? That is the title: <b>[[Ev]]</b>.</p>" +
        "<p><b>2. Facts.</b> Pick out what a reader needs: where, when, kit, cost. Leave out the chat (\"Hi everyone!\").</p>" +
        "<p><b>3. Layout.</b> Group the facts under headings, and turn the kit into bullets:</p>" +
        task("<h4>[[Ev]]</h4><b>When and where:</b> 6pm, [[place]]<br><b>Cost:</b> 2 pounds<br><b>What to bring:</b><ul><li>[[Kit1]]</li><li>[[Kit2]]</li><li>[[Kit3]]</li></ul>"),
      ez: { title: "3 steps", html: "<p><b>1</b> Topic. <b>2</b> Facts. <b>3</b> Layout.</p><p>The chat goes. The facts get headings.</p>" },
      lv: { spicy: { html: "<p>Here is a chatty paragraph:</p>" +
        task("Hi everyone! The [[ev]] is coming up soon and it is going to be in [[place]]. It starts at 6pm. You will need [[kit1]], and also [[kit2]], and [[kit3]] would be good too. It costs 2 pounds, and you can pay on the door.") +
        "<p><b>1. Topic.</b> The title: <b>[[Ev]]</b>.</p>" +
        "<p><b>2. Facts.</b> Where, when, kit, cost. Cut the chat and the filler (\"coming up soon\", \"would be good too\").</p>" +
        "<p><b>3. Layout.</b> Headings in one style, bullets in one shape:</p>" +
        task("<h4>[[Ev]]</h4><b>When:</b> 6pm<br><b>Where:</b> [[place]]<br><b>Cost:</b> 2 pounds, pay on the door<br><b>Bring:</b><ul><li>[[Kit1]]</li><li>[[Kit2]]</li><li>[[Kit3]]</li></ul>") } } },

    Q("multi", "Your turn to scan", null, [
      { q: "A new paragraph. <b>Step 1 is done</b>: the title is <b>Bird club</b>. Step 2: pick <b>all</b> the facts a reader needs." +
          task("So, guess what, Jay is starting a bird club, which is very exciting. It meets on Tuesdays at lunch. It is in the library. Bring a packed lunch. Jay says it will be outrageous fun."),
        options: ["Tuesdays at lunch", "In the library", "Bring a packed lunch", "So, guess what", "It will be outrageous fun"],
        answers: [0, 1, 2],
        slips: { any: "Three are facts a reader needs. \"So, guess what\" is chat, and \"outrageous fun\" is Jay's opinion." },
        hint: "Facts answer when, where and what to bring.",
        why: "When, where and what to bring. The chat and the opinion stay out.",
        ez: { q: "The title is <b>Bird club</b>. Pick <b>all</b> the facts." +
          task("So, guess what, Jay is starting a bird club, which is very exciting. It meets on Tuesdays at lunch. It is in the library. Bring a packed lunch. Jay says it will be outrageous fun."),
          hint: "When, where, what to bring.", why: "When, where and what to bring.", slips: { any: "3 are facts. The others are chat or opinion." } },
        spicy: { q: "<b>Step 1 is done</b>: the title is <b>Bird club</b>. Step 2: pick <b>all</b> the facts a reader needs." +
            task("So, guess what, Jay is starting a bird club, which is very exciting. It meets on Tuesdays at lunch, which is the best day. It is in the library. Bring a packed lunch. Binoculars are provided. Jay says it will be outrageous fun."),
          options: ["Tuesdays at lunch", "In the library", "Bring a packed lunch", "Binoculars are provided", "Tuesday is the best day", "It will be outrageous fun"],
          answers: [0, 1, 2, 3],
          slips: { any: "Four facts. \"Best day\" and \"outrageous fun\" are opinions, so they stay out." } } },
      { q: "A new paragraph. <b>Step 1 is done</b>: the title is <b>Film club</b>. Step 2: pick <b>all</b> the facts a reader needs." +
          task("Hi! Film club is back, and honestly it is the best thing ever. It is on Thursdays after school. It is in Room 4. Popcorn is 50p."),
        options: ["Thursdays after school", "In Room 4", "Popcorn is 50p", "Hi!", "It is the best thing ever"],
        answers: [0, 1, 2],
        slips: { any: "Three are facts. \"Hi!\" is chat and \"the best thing ever\" is an opinion." },
        hint: "When, where, and how much.",
        why: "When, where and the price of popcorn. Chat and opinions stay out.",
        ez: { q: "The title is <b>Film club</b>. Pick <b>all</b> the facts." +
          task("Hi! Film club is back, and honestly it is the best thing ever. It is on Thursdays after school. It is in Room 4. Popcorn is 50p."),
          hint: "When, where, how much.", why: "When, where and the popcorn price.", slips: { any: "3 are facts. The others are chat or opinion." } },
        spicy: { q: "<b>Step 1 is done</b>: the title is <b>Film club</b>. Step 2: pick <b>all</b> the facts a reader needs." +
            task("Hi! Film club is back, and honestly it is the best thing ever. It is on Thursdays after school. It is in Room 4. Popcorn is 50p. Films are rated 12 or under. The seats are really comfy."),
          options: ["Thursdays after school", "In Room 4", "Popcorn is 50p", "Films are rated 12 or under", "It is the best thing ever", "The seats are really comfy"],
          answers: [0, 1, 2, 3],
          slips: { any: "Four facts. \"Best thing ever\" and \"really comfy\" are opinions." } } },
      { q: "A new paragraph. <b>Step 1 is done</b>: the title is <b>Cooking club</b>. Step 2: pick <b>all</b> the facts a reader needs." +
          task("Right then, cooking club! It is on Mondays at 2pm, in the kitchen. Wear an apron. We think you will love it."),
        options: ["Mondays at 2pm", "In the kitchen", "Wear an apron", "Right then", "You will love it"],
        answers: [0, 1, 2],
        slips: { any: "Three are facts. \"Right then\" is chat and \"you will love it\" is a guess." },
        hint: "When, where, and what to wear.",
        why: "When, where and what to wear. The chat and the guess stay out.",
        ez: { q: "The title is <b>Cooking club</b>. Pick <b>all</b> the facts." +
          task("Right then, cooking club! It is on Mondays at 2pm, in the kitchen. Wear an apron. We think you will love it."),
          hint: "When, where, what to wear.", why: "When, where and what to wear.", slips: { any: "3 are facts. The others are chat or a guess." } },
        spicy: { q: "<b>Step 1 is done</b>: the title is <b>Cooking club</b>. Step 2: pick <b>all</b> the facts a reader needs." +
            task("Right then, cooking club! It is on Mondays at 2pm, in the kitchen. Wear an apron. Tie long hair back. All food is nut free. We think you will love it, and it is way better than art club."),
          options: ["Mondays at 2pm", "In the kitchen", "Wear an apron", "Tie long hair back", "You will love it", "Better than art club"],
          answers: [0, 1, 2, 3],
          slips: { any: "Four facts. The last two are opinions, and art club might not agree." } } }
    ]),

    Q("sort", "Your turn to scan", null, [
      { q: "<b>Steps 1 and 2 are done.</b> Step 3: put each fact under the right heading for Bird club.",
        buckets: ["When and where", "What to bring"],
        cards: [["Tuesdays at lunch", 0], ["The library", 0], ["A packed lunch", 1], ["A notebook, if you like", 1]],
        hint: "Days and places, or things to carry?",
        why: "Day and place under <b>When and where</b>, things to carry under <b>What to bring</b>.",
        ez: { q: "Put each Bird club fact under its heading.", hint: "Places, or things to carry?", why: "Day and place, then things to carry." },
        spicy: { buckets: ["When", "Where", "Bring"],
          cards: [["Tuesdays", 0], ["12.30 to 1.15", 0], ["The library", 1], ["By the window seats", 1], ["A packed lunch", 2], ["A notebook, if you like", 2]],
          why: "Three short headings in the same style, each with its own facts." } },
      { q: "<b>Steps 1 and 2 are done.</b> Step 3: put each fact under the right heading for Film club.",
        buckets: ["When and where", "Cost"],
        cards: [["Thursdays after school", 0], ["Room 4", 0], ["Popcorn is 50p", 1], ["Drinks are 30p", 1]],
        hint: "Which ones have a price?",
        why: "Day and room under <b>When and where</b>, prices under <b>Cost</b>.",
        ez: { q: "Put each Film club fact under its heading.", hint: "Which ones have a price?", why: "Day and room, then prices." },
        spicy: { buckets: ["When", "Where", "Cost"],
          cards: [["Thursdays", 0], ["3.30 to 5pm", 0], ["Room 4", 1], ["Up the stairs, first door", 1], ["Popcorn is 50p", 2], ["Drinks are 30p", 2]],
          why: "Three short headings in the same style, each with its own facts." } },
      { q: "<b>Steps 1 and 2 are done.</b> Step 3: put each fact under the right heading for Cooking club.",
        buckets: ["When and where", "What to wear"],
        cards: [["Mondays at 2pm", 0], ["The kitchen", 0], ["An apron", 1], ["Hair tied back", 1]],
        hint: "Which ones go on you?",
        why: "Day and place under <b>When and where</b>, apron and hair under <b>What to wear</b>.",
        ez: { q: "Put each Cooking club fact under its heading.", hint: "Which ones go on you?", why: "Day and place, then what to wear." },
        spicy: { buckets: ["When", "Where", "Wear"],
          cards: [["Mondays", 0], ["2pm to 3pm", 0], ["The kitchen", 1], ["Next to the hall", 1], ["An apron", 2], ["Hair tied back", 2]],
          why: "Three short headings in the same style, each with its own facts." } }
    ]),

    Q("mc", "Your turn to scan", { explain: true }, [
      { q: "<b>All three steps, on your own.</b> Which is the best scannable version of this?" +
          task("Hiya. Quiz night is on Friday at 7pm in the hall. Teams of four. Bring a pen. It costs 1 pound each."),
        o: ["<b>Quiz night</b><br>When and where: Friday, 7pm, the hall<br>Teams: four people<br>Bring: a pen<br>Cost: 1 pound each",
            "<b>Quiz night</b><br>Hiya. Quiz night is on Friday at 7pm in the hall. Teams of four. Bring a pen. It costs 1 pound each.",
            "<b>Hiya</b><br>&bull; Friday<br>&bull; Fun"],
        s: ["It has a title, but the rest is still the same wall of text.", "The title is just the greeting, and most of the facts have gone."],
        hint: "Title, then facts under labels. Nothing missing, no chat.",
        why: "A title, then each fact under its own label. Every fact is still there and the chat has gone.",
        ez: { hint: "Look for labels.", why: "Labels make each fact easy to find.", s: ["Same facts, but hidden in a sentence."] },
        mild: { q: "Which version is easier to scan?",
          o: ["<b>Quiz night</b><br>When: Friday, 7pm<br>Bring: a pen", "Hiya. Quiz night is on Friday at 7pm and you need to bring a pen."],
          s: ["Same facts, but you have to read the whole sentence to find them."] } },
      { q: "<b>All three steps, on your own.</b> Which is the best scannable version of this?" +
          task("Hey! The car wash is on Sunday from 10am, in the staff car park. It costs 3 pounds a car. All money goes to the animal shelter."),
        o: ["<b>Charity car wash</b><br>When: Sunday from 10am<br>Where: staff car park<br>Cost: 3 pounds a car<br>Money goes to: the animal shelter",
            "<b>Hey!</b><br>When: Sunday<br>Cost: 3 pounds",
            "<b>Charity car wash</b><br>The car wash is on Sunday from 10am, in the staff car park, and it costs 3 pounds a car, with all the money going to the animal shelter."],
        s: ["The title is a greeting, and the place and the charity have gone missing.", "Good title, but the rest is still one long sentence."],
        hint: "Title, then facts under labels. Nothing missing, no chat.",
        why: "Clear title, every fact under its own label, and nothing left out.",
        ez: { hint: "Look for labels.", why: "Labels make each fact easy to find.", s: ["Same facts, but hidden in a sentence."] },
        mild: { q: "Which version is easier to scan?",
          o: ["<b>Car wash</b><br>When: Sunday, 10am<br>Cost: 3 pounds", "Hey! The car wash is on Sunday from 10am and it costs 3 pounds a car."],
          s: ["Same facts, but hidden in a sentence."] } },
      { q: "<b>All three steps, on your own.</b> Which is the best scannable version of this?" +
          task("OK so the art show opens on 3 March at 4pm. It is in the dining hall. Entry is free. You can vote for your favourite."),
        o: ["<b>Art show</b><br>When: 3 March, 4pm<br>Where: dining hall<br>Entry: free<br>Extra: vote for your favourite",
            "<b>OK so</b><br>&bull; art<br>&bull; March",
            "<b>Art show</b><br>OK so the art show opens on 3 March at 4pm. It is in the dining hall. Entry is free."],
        s: ["The title is filler, and the facts have been cut too far.", "Good title, but the rest is still a paragraph, and the vote has gone."],
        hint: "Title, then facts under labels. Nothing missing, no chat.",
        why: "Every fact is there, each under its own label, under a clear title.",
        ez: { hint: "Look for labels.", why: "Labels make each fact easy to find.", s: ["Same facts, but hidden in a sentence."] },
        mild: { q: "Which version is easier to scan?",
          o: ["<b>Art show</b><br>When: 3 March, 4pm<br>Entry: free", "OK so the art show opens on 3 March at 4pm and entry is free."],
          s: ["Same facts, but you have to read the sentence to find them."] } }
    ]),

    { type: "write", topic: "Your turn to scan",
      q: "Only if you fancy it: make a notice of your own scannable. A club, a game, a day out, anything. Give it a title, a heading or two, and a few bullet points.",
      starters: ["Title:", "When and where:", "What to bring:", "&bull;"],
      checklist: ["I gave it a title", "I used at least one heading", "I used bullet points or numbers for a list"],
      minWords: 15,
      ez: { q: "Only if you like: make a notice scannable. A title and a list is plenty." },
      lv: { mild: { minWords: 8, checklist: ["I gave it a title", "I used a heading or a list"] },
        spicy: { minWords: 25, checklist: ["I gave it a title", "My headings match each other in style", "My bullet points all start the same way", "I used numbers where the order matters"] } } }
  ],

  realWorld: {
    title: "Where you would use this",
    html: "<p>Nearly everything you read on a phone is built to be scanned: websites, menus, timetables, the signs at a train station. Writing that way is a real skill, and people get paid for it.</p>" +
      "<p>For our big question, if we could time travel, should we? Imagine landing in 1850 with a guide in your pocket. A wall of text would be useless. You would want headings: <b>Where to sleep</b>, <b>What not to say</b>, <b>How to get home</b>.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to the time portal holding up a guide with headings">' + A.portal(70, 76, 54) +
      '<rect x="280" y="34" width="120" height="104" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
      T(290, 54, "Time guide", 13, { b: 1 }) + T(290, 76, "Where to sleep", 11, { b: 1, c: "#1a7fb0" }) + T(290, 98, "What not to say", 11, { b: 1, c: "#1a7fb0" }) + T(290, 120, "How to get home", 11, { b: 1, c: "#1a7fb0" }) +
      A.jay(196, 56, 0.8, "wow") + '</svg>'
  },

  ez: {
    realWorld: { html: "<p>Phones, menus and signs are all made to scan.</p><p>A time travel guide would need headings too!</p>" },
    make: { intro: "A title and 3 bullet points. About anything you like." }
  },

  make: {
    title: "Make a mini poster",
    intro: "Anything you like: a club, a game, a day out, Bonnie's walk. A title and three bullet points. Put it on the wall or send it to Jay.",
    fields: [
      { id: "title", label: "Title", ph: "Bird club", max: 28 },
      { id: "b1", label: "Bullet point 1", ph: "Tuesdays at lunch", max: 34 },
      { id: "b2", label: "Bullet point 2", ph: "In the library", max: 34 },
      { id: "b3", label: "Bullet point 3", ph: "Bring a packed lunch", max: 34 },
      { id: "name", label: "Made by", ph: "B5", max: 24 }
    ],
    svg: function(v){
      var t = wrap(v.title, 20, 2);
      var bullets = [v.b1, v.b2, v.b3].map(function(b, k){
        var ls = wrap(b, 28, 2), y = 190 + k * 66;
        return '<circle cx="62" cy="' + (y - 8) + '" r="9" fill="' + ["#ff8a5c", "#22b8e6", "#19c39a"][k] + '"/>' +
          ls.map(function(l, j){ return T(84, y + j * 26, esc(l), 22, { b: j === 0 }); }).join("");
      }).join("");
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 440">' +
        '<rect width="600" height="440" rx="24" fill="#fffbe9"/>' +
        '<rect x="14" y="14" width="572" height="412" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        '<rect x="14" y="14" width="572" height="130" rx="18" fill="#141a33"/>' +
        t.map(function(l, k){ return T(300, (t.length > 1 ? 70 : 92) + k * 44, esc(l), 38, { a: "middle", b: 1, c: "#ffd23f" }); }).join("") +
        bullets +
        T(40, 404, "Made by: " + esc(wrap(v.name, 24, 1)[0] || ""), 17, { c: "#5b6180" }) +
        A.bird(540, 396, 0.8, "#3a8fd6") +
        '</svg>';
    }
  }
};
})();
