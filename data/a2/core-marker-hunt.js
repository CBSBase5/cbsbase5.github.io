/* Base 5 core target activity: Marker hunt.
   English. Reading the markers that organise a short text: title,
   subheadings, bullet points, numbered steps, bold, captions, and time
   and order words, and what each one tells a reader. Pages drawn in
   SVG. Replayable: most questions have two extra versions (a new page
   or text each go). ASCII only. */
(function(){
var A = window.A2ART;
var FONT = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') + (o.i ? ' font-style="italic"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }
function ext(a, b){ for(var k in b) if(Object.prototype.hasOwnProperty.call(b, k)) a[k] = b[k]; return a; }
function P(t){ return '<p class="a2task">' + t + '</p>'; }
function S(type, topic, fn, sets, extra){ var s = ext(ext({ type: type, topic: topic }, fn(sets[0])), extra || {}); if(sets.length > 1) s.vary = [fn(sets[1]), fn(sets[2])]; return s; }

/* ---------- three pages, one per go ---------- */
var PICS = {
  feeder: '<rect x="-14" y="-40" width="28" height="70" rx="8" fill="#e8f7ff" stroke="#141a33" stroke-width="2"/><rect x="-12" y="-6" width="24" height="34" rx="4" fill="#d9b48a"/>' +
    '<path d="M-30 14h60" stroke="#8a5a36" stroke-width="4" stroke-linecap="round"/><path d="M0 -40v-14" stroke="#141a33" stroke-width="2"/>' + A.bird(-34, 2, 0.7, "#3a8fd6") + '<circle cx="-26" cy="-4" r="4" fill="#ffd23f"/>',
  bag: '<path d="M-30 -20h60l6 50h-72z" fill="#22b8e6" stroke="#141a33" stroke-width="2.5" stroke-linejoin="round"/><path d="M-14 -20q0 -20 14 -20t14 20" fill="none" stroke="#141a33" stroke-width="3"/>' +
    '<path d="M38 -36l4 -10 4 10 10 4 -10 4 -4 10 -4 -10 -10 -4z" fill="#ffd23f" stroke="#141a33" stroke-width="1.5"/><path d="M-44 -30l3 -7 3 7 7 3 -7 3 -3 7 -3 -7 -7 -3z" fill="#ffd23f" stroke="#141a33" stroke-width="1.5"/>',
  glass: '<path d="M-24 -40h48l-6 74h-36z" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/><path d="M-22 -22h44l-5 54h-34z" fill="#ff8fb3"/><path d="M8 -40l14 -16" stroke="#19c39a" stroke-width="5" stroke-linecap="round"/>' +
    '<circle cx="-30" cy="-36" r="9" fill="#e04848"/><path d="M-30 -45l3 -6" stroke="#1f9d63" stroke-width="3"/>'
};
var D = [
  { title: "Make a Bird Feeder", h1: "What you need", items: ["a plastic bottle", "two pencils", "bird seed", "some string"],
    h2: "How to make it", steps: ["Make two holes near the bottom.", "Push the pencils through.", "Fill the bottle with seed.", "Hang it from a branch."],
    bold: "Ask an adult to make the holes.", pic: "feeder", cap: "A blue tit using the feeder", target: "fill the bottle with seed", t: 3,
    capWhy: "what the picture shows: a blue tit using the feeder" },
  { title: "Looking after your [[kit]]", h1: "You will need", items: ["an old dry cloth", "a bag to keep it in", "five minutes"],
    h2: "Steps", steps: ["Wipe it with the dry cloth.", "Check it for any damage.", "Put it in the bag.", "Keep it somewhere dry."],
    bold: "Never leave it out in the rain.", pic: "bag", cap: "All clean and packed away", target: "check it for damage", t: 2,
    capWhy: "what the picture shows: the [[kit]] all clean and packed away" },
  { title: "Strawberry Smoothie", h1: "Ingredients", items: ["1 banana", "a cup of strawberries", "a cup of milk", "2 ice cubes"],
    h2: "Method", steps: ["Peel the banana.", "Put it all in the blender.", "Blend for 30 seconds.", "Pour into a glass."],
    bold: "Keep the lid on while it blends.", pic: "glass", cap: "Pink means it worked!", target: "blend it", t: 3,
    capWhy: "what the picture shows, the finished smoothie, and that pink means it worked" }
];
function tag(x, y, L){ return '<circle cx="' + x + '" cy="' + y + '" r="11" fill="#8a5cf6"/>' + T(x, y + 5, L, 13, { a: "middle", b: 1, c: "#ffffff" }); }
function page(d, egg){
  var y = 104, s = "";
  s += tag(18, 37, "A") + T(36, 44, d.title, 22, { b: 1 });
  s += tag(18, 72, "B") + T(36, 78, d.h1, 16, { b: 1, c: "#1d5f99" });
  s += tag(18, 104, "C");
  d.items.forEach(function(it, k){ s += '<circle cx="44" cy="' + (y - 5 + k * 22) + '" r="4" fill="#141a33"/>' + T(56, y + k * 22, it, 14); });
  y += d.items.length * 22 + 20;
  s += T(36, y, d.h2, 16, { b: 1, c: "#1d5f99" });
  y += 26; s += tag(18, y - 5, "D");
  d.steps.forEach(function(st, k){ s += T(36, y + k * 22, (k + 1) + ".", 14, { b: 1 }) + T(56, y + k * 22, st, 14); });
  y += d.steps.length * 22 + 14;
  s += tag(18, y - 5, "F") + T(36, y, d.bold, 14, { b: 1 });
  var h = y + 22;
  s += '<rect x="344" y="62" width="154" height="116" rx="10" fill="#f4f1ea" stroke="#141a33" stroke-width="2"/><g transform="translate(421 124)">' + PICS[d.pic] + '</g>';
  wrap(d.cap, 20, 2).forEach(function(l, k){ s += T(421, 198 + k * 17, l, 12, { a: "middle", i: 1, c: "#3a4060" }); });
  s += tag(334, 194, "E");
  if(egg) s += A.egg(A.bird(486, 36, 0.5, "#ff5d5d"), "A tiny bird, reading the page from the top down, the way the title wants you to.");
  return '<svg viewBox="0 0 520 ' + h + '" role="img" aria-label="A page called ' + d.title + ', with markers tagged A to F: A the title, B a subheading, C bullet points, D numbered steps, E a caption under the picture, F a bold line">' +
    '<rect x="4" y="4" width="512" height="' + (h - 8) + '" rx="12" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' + s + '</svg>';
}

/* marker names and jobs */
var NAMES = ["Title", "Subheading", "Bullet points", "Numbered steps", "Caption", "Bold"];
var JOBS = ["What the whole page is about", "What this section is about", "Separate things, in any order", "Do these in this order", "What the picture shows", "This bit is important"];

/* the marker key: each marker and what it tells you */
var KEY = '<svg viewBox="0 0 520 250" role="img" aria-label="A key of markers and what they tell you: title, subheading, bullet points, numbered steps, caption and bold">' +
  '<rect width="520" height="250" rx="16" fill="#f4f1ea"/>' +
  NAMES.map(function(n, k){
    var x = k % 2 ? 268 : 18, y = 18 + Math.floor(k / 2) * 76;
    var icon = [
      T(30, 34, "Aa", 24, { b: 1 }),
      '<rect x="10" y="18" width="44" height="7" rx="3" fill="#1d5f99"/><rect x="10" y="32" width="36" height="5" rx="2" fill="#c9cbd6"/><rect x="10" y="42" width="40" height="5" rx="2" fill="#c9cbd6"/>',
      [0, 1, 2].map(function(j){ return '<circle cx="14" cy="' + (20 + j * 13) + '" r="3.5" fill="#141a33"/><rect x="22" y="' + (17 + j * 13) + '" width="30" height="5" rx="2" fill="#c9cbd6"/>'; }).join(""),
      [1, 2, 3].map(function(j){ return T(10, 26 + (j - 1) * 13, String(j), 11, { b: 1 }) + '<rect x="22" y="' + (19 + (j - 1) * 13) + '" width="30" height="5" rx="2" fill="#c9cbd6"/>'; }).join(""),
      '<rect x="10" y="12" width="44" height="28" rx="4" fill="#cfe8f5" stroke="#141a33" stroke-width="1.5"/>' + T(32, 52, "caption", 9, { a: "middle", i: 1 }),
      T(32, 38, "B", 26, { a: "middle", b: 1 })
    ][k];
    return '<g transform="translate(' + x + ' ' + y + ')"><rect width="234" height="64" rx="12" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
      '<g>' + icon + '</g>' + T(70, 26, n, 15, { b: 1 }) + T(70, 46, JOBS[k], 11, { c: "#3a4060" }) + '</g>';
  }).join("") + '</svg>';

/* ---------- chunk 1 builders: spot the markers ---------- */
function qA(d){
  return { q: "Look at marker <b>A</b>, the big words at the top. What is it called?", fig: page(d),
    options: ["Title", "Caption", "Bullet points"], answer: 0,
    slips: { 1: "A caption goes under a picture.", 2: "Bullet points are a list with dots." },
    hint: "It is the name of the whole page.", why: "The <b>title</b> is the biggest words, at the very top. \"" + d.title + "\".",
    lv: { medium: { options: ["Title", "Subheading", "Caption", "Bold"], slips: { 1: "A subheading is smaller, for one section.", 2: "A caption goes under a picture.", 3: "It is bold, but it is bigger than that: it names the whole page." } },
      spicy: { q: "Marker <b>A</b> and marker <b>B</b> are both bigger than the rest. What is the difference?",
        options: ["A is the title for the whole page; B is a subheading for one section", "A is a caption; B is a title", "A is bold; B is a bullet point", "There is no difference"],
        slips: { 1: "A caption goes under a picture.", 2: "Both are bold, but that is not what makes them different.", 3: "Look at the size, and at how much of the page each one covers." },
        why: "The <b>title</b> covers everything. A <b>subheading</b> only covers the section underneath it." } } };
}
function qE(d){
  return { q: "Look at marker <b>E</b>, under the picture. What is it called?", fig: page(d),
    options: ["Caption", "Title", "Numbered steps"], answer: 0,
    slips: { 1: "The title is at the top of the page.", 2: "Numbered steps have 1, 2, 3." },
    hint: "It goes with a picture.", why: "A <b>caption</b> is the small writing under a picture: \"" + d.cap + "\".",
    lv: { medium: { options: ["Caption", "Title", "Subheading", "Bullet points"], slips: { 1: "The title is at the top.", 2: "A subheading starts a section.", 3: "Bullet points are a list with dots." } },
      spicy: { q: "Marker <b>E</b> is a caption. What is it for?", options: ["It tells you what the picture shows", "It is the name of the whole page", "It gives the steps in order", "It is a warning"],
        slips: { 1: "That is the title's job.", 2: "That is what numbered steps do.", 3: "That is more like the bold line." },
        why: "A caption tells you what the picture shows, and sometimes adds a fact or a joke about it." } } };
}
function qMatch(d){
  return { q: "Match each marker on the page to its name.", fig: page(d),
    pairs: [["A", "Title"], ["B", "Subheading"], ["C", "Bullet points"], ["E", "Caption"]],
    slips: { any: "Find each purple letter on the page and look at what is next to it." },
    hint: "C has dots. E is under the picture.", why: "A title, B subheading, C bullet points, E caption.",
    lv: { medium: { pairs: [["A", "Title"], ["B", "Subheading"], ["C", "Bullet points"], ["D", "Numbered steps"], ["E", "Caption"]], why: "A title, B subheading, C bullet points, D numbered steps, E caption." },
      spicy: { pairs: [["A", "Title"], ["B", "Subheading"], ["C", "Bullet points"], ["D", "Numbered steps"], ["E", "Caption"], ["F", "Bold"]], why: "All six: title, subheading, bullet points, numbered steps, caption and bold." } } };
}
function qAll(d){
  return { q: "Which of these markers can you see on the page? Pick <b>all</b> of them.", fig: page(d),
    options: ["A title", "Bullet points", "Numbered steps", "A caption", "Speech bubbles", "A table"], answers: [0, 1, 2, 3],
    slips: { any: "Four of them are on the page. Look for speech bubbles and a table with rows and columns: are they there?" },
    hint: "Check each one against the page.", why: "Title, bullet points, numbered steps and a caption are all there. No speech bubbles, no table.",
    lv: { mild: { options: ["A title", "Bullet points", "A caption", "Speech bubbles"], answers: [0, 1, 2], slips: { any: "Three are on the page. Are there any speech bubbles?" }, why: "A title, bullet points and a caption. No speech bubbles." },
      spicy: { options: ["A title", "Subheadings", "Bullet points", "Numbered steps", "A caption", "Bold text", "A table", "A glossary"], answers: [0, 1, 2, 3, 4, 5],
        slips: { any: "Six are on the page. A table has rows and columns; a glossary explains hard words. Are they there?" }, why: "Six markers. No table and no glossary." } } };
}

/* ---------- chunk 2 builders: what each one tells you ---------- */
function qWhyNum(d){
  return { q: "Why are the steps under <b>" + d.h2 + "</b> numbered?", fig: page(d),
    options: ["You need to do them in that order", "There are lots of them", "They are the most important part"], answer: 0,
    slips: { 1: "Bullet points can be long lists too. Numbers mean something more.", 2: "Bold shows important. Numbers show order." },
    hint: "Could you do step 4 before step 1?", why: "Numbers tell you the <b>order matters</b>. You cannot " + d.steps[3].toLowerCase().replace(/\.$/, "") + " before step 1.",
    lv: { spicy: { q: "What would go wrong if the steps under <b>" + d.h2 + "</b> were bullet points instead of numbers?",
      options: ["A reader might do them in the wrong order", "Nothing at all", "The page would be harder to print", "The title would not make sense"],
      slips: { 1: "Bullets say any order is fine. Here it is not.", 2: "It is about the reader, not the printer.", 3: "The title is fine either way." },
      why: "Bullets say \"any order\". Numbers say \"this order\". Swap them and a reader could get it wrong." } } };
}
function qWhyBullets(d){
  return { q: "Why are the things under <b>" + d.h1 + "</b> bullet points, not numbers?", fig: page(d),
    options: ["They are separate things, and the order does not matter", "You must get them in that order", "They are not important"], answer: 0,
    slips: { 1: "Does it matter which you get first? Bullets say no.", 2: "You need all of them. Bullets just mean any order." },
    hint: "Does it matter which one you find first?", why: "Bullet points list <b>separate things in any order</b>. You could get them ready in any order.",
    lv: { spicy: { options: ["They are separate things and the order does not matter", "They are in order of importance", "Bullets are quicker to type", "They are optional extras"],
      slips: { 1: "Nothing on the page says the first one matters most.", 2: "Maybe, but that is about the writer. What do they tell the reader?", 3: "You need them all. The heading says so." } } } };
}
function qWhyBold(d){
  return { q: "Why is <b>\"" + d.bold + "\"</b> in bold?", fig: page(d),
    options: ["It is important, so the writer wants you to notice it", "It is the title", "It is a step"], answer: 0,
    slips: { 1: "The title is at the top.", 2: "It is not numbered." },
    hint: "What does bold make your eyes do?", why: "Bold makes your eyes stop. Writers use it for the bit you really must not miss.",
    lv: { spicy: { q: "The writer could have hidden <b>\"" + d.bold + "\"</b> inside a step. Why put it on its own line, in bold?",
      options: ["So nobody misses it, because it is about safety or care", "To fill up space at the bottom", "Because it is the first step", "Because it is a caption"],
      slips: { 1: "Writers rarely add lines just to fill space.", 2: "It is not numbered, and it is at the bottom.", 3: "Captions go with pictures." },
      why: "On its own and in bold, it stands out. That is the writer making sure the important bit gets read." } } };
}
/* ---------- chunk 4 builders: use the markers ---------- */
function qWhere(d){
  return { q: "You want to know what to get ready before you start. Which marker takes you straight there?", fig: page(d),
    options: ["The subheading <b>" + d.h1 + "</b>", "The subheading <b>" + d.h2 + "</b>", "The caption", "The title"], answer: 0,
    slips: { 1: "That section is about what to do.", 2: "The caption is about the picture.", 3: "The title tells you the whole page, not where the list is." },
    hint: "Subheadings tell you what each section is about.", why: "<b>" + d.h1 + "</b> is the section that lists what you need." };
}
function qStepNo(d){
  return { q: "Which step number tells you to " + d.target + "?", fig: page(d),
    boxes: [{ label: "Step", a: d.t }],
    slips: [[d.t - 1, "One too early. Read the step after."], [d.t + 1, "One too far. Read the step before."]],
    hint: "Find the numbered steps, then read down.", why: "Step <b>" + d.t + "</b>: \"" + d.steps[d.t - 1] + "\"" };
}
function qNext(d){
  return { q: "You have just done: <b>\"" + d.steps[1] + "\"</b> What do you do next?", fig: page(d),
    options: [d.steps[2], d.steps[0], d.steps[3]], answer: 0,
    slips: { 1: "That was step 1, already done.", 2: "That is step 4. Something comes before it." },
    hint: "That was step 2. What is step 3?", why: "Step 3: <b>" + d.steps[2] + "</b> The numbers keep you on track.",
    lv: { spicy: { q: "Someone did step 4 straight after step 2. What did they miss?", options: [d.steps[2], d.steps[0], d.title],
      slips: { 1: "Step 1 came before step 2, so they did that.", 2: "That is the title, not a step." },
      why: "They skipped step 3: <b>" + d.steps[2] + "</b> That is exactly the mistake numbers help you avoid." } } };
}

/* ---------- chunk 3: time and order words ---------- */
var ORD = [
  { text: "First, Jay filled the feeder. Then he hung it on the tree. After that, he waited. Finally, a robin came.",
    words: ["First", "Then", "After that", "Finally"], not: ["feeder", "robin"],
    items: ["First, Jay filled the feeder.", "Then he hung it on the tree.", "After that, he waited.", "Finally, a robin came."], last: "Finally" },
  { text: "First, [[who]] packed a bag. Next, they ate breakfast. Then they caught the bus. At last, they arrived.",
    words: ["First", "Next", "Then", "At last"], not: ["bag", "bus"],
    items: ["First, [[who]] packed a bag.", "Next, they ate breakfast.", "Then they caught the bus.", "At last, they arrived."], last: "At last" },
  { text: "To start with, Bonnie sniffed the gate. Soon after, she spotted a pigeon. Then she barked. In the end, she went home for a nap.",
    words: ["To start with", "Soon after", "Then", "In the end"], not: ["gate", "pigeon"],
    items: ["To start with, Bonnie sniffed the gate.", "Soon after, she spotted a pigeon.", "Then she barked.", "In the end, she went home for a nap."], last: "In the end" }
];
var ORDS = [
  { text: "Before the match, [[who]] could not stop shaking. During the first half, nothing went right. By half time, they were losing. Later that evening, they could not stop smiling.",
    words: ["Before the match", "During the first half", "By half time", "Later that evening"], not: ["shaking", "smiling"],
    items: ["Before the match, [[who]] could not stop shaking.", "During the first half, nothing went right.", "By half time, they were losing.", "Later that evening, they could not stop smiling."], last: "Later that evening",
    q: "Something good must have happened in the second half. Which marker tells you time has jumped forward?", a: "Later that evening", o: ["Before the match", "During the first half", "Later that evening", "By half time"] },
  { text: "At midnight, the lights went out. Meanwhile, in the cellar, something moved. Moments later, a door creaked. By morning, everyone had gone.",
    words: ["At midnight", "Meanwhile", "Moments later", "By morning"], not: ["lights", "cellar"],
    items: ["At midnight, the lights went out.", "Meanwhile, in the cellar, something moved.", "Moments later, a door creaked.", "By morning, everyone had gone."], last: "By morning",
    q: "Which marker tells you two things are happening at the same time, in different places?", a: "Meanwhile", o: ["Meanwhile", "At midnight", "Moments later", "By morning"] },
  { text: "Long ago, the lake was a busy harbour. Over the years, the boats stopped coming. Eventually, the harbour was forgotten. Today, only the herons visit.",
    words: ["Long ago", "Over the years", "Eventually", "Today"], not: ["harbour", "herons"],
    items: ["Long ago, the lake was a busy harbour.", "Over the years, the boats stopped coming.", "Eventually, the harbour was forgotten.", "Today, only the herons visit."], last: "Today",
    q: "Which marker tells you a long, slow stretch of time is passing?", a: "Over the years", o: ["Over the years", "Long ago", "Today", "Eventually"] }
];
function qPickWords(k){
  var d = ORD[k], s = ORDS[k];
  return { q: P(d.text) + "Pick <b>all</b> the order words.", options: d.words.concat(d.not), answers: [0, 1, 2, 3],
    slips: { any: "Order words tell you when, or in what order. Nouns like \"" + d.not[0] + "\" do not." },
    hint: "Look at the start of each sentence.", why: "<b>" + d.words.join(", ") + "</b>. They sit at the start of each sentence and move you through in order.",
    lv: { spicy: { q: P(s.text) + "Pick <b>all</b> the time markers.", options: s.words.concat(s.not), answers: [0, 1, 2, 3],
      slips: { any: "Time markers are often whole phrases, like \"" + s.words[0] + "\"." },
      why: "<b>" + s.words.join(", ") + "</b>. In stories, time markers can be whole phrases." } } };
}
function qOrd(k){
  var d = ORD[k], s = ORDS[k];
  return { q: "These sentences got jumbled. Use the order words to put them back.", items: d.items.slice(),
    hint: "Which word means it comes first?", why: "The order words do the work: " + d.words.join(", then ") + ".",
    lv: { spicy: { items: s.items.slice(), hint: "Which marker is earliest in time?", why: "The time markers do the work: " + s.words.join(", then ") + "." } } };
}
function qLast(k){
  var d = ORD[k], s = ORDS[k];
  return { q: P(d.text) + "Which word tells you this is the last thing that happened?", options: [d.last, d.words[0], d.words[1]], answer: 0,
    slips: { 1: "That one starts things off.", 2: "That is near the start." },
    hint: "Look at the last sentence.", why: "<b>" + d.last + "</b> tells you this is the end.",
    lv: { spicy: { q: P(s.text) + s.q, options: s.o, answer: s.o.indexOf(s.a),
      slips: (function(){ var sl = {}; s.o.forEach(function(w, i){ if(w !== s.a) sl[i] = "\"" + w + "\" is a time marker, but have another look at what the question asks."; }); return sl; })(),
      why: "<b>" + s.a + "</b>. Time markers can jump forward, slow down or split the story in two." } } };
}

(window.A2PACKS = window.A2PACKS || {})["core-marker-hunt"] = {
  a2: true,
  id: "a2-core-marker-hunt",
  title: "Marker hunt",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "Titles, subheadings, bullets, numbers, bold, captions and order words: spotting them, and what each one tells you.",
  blurb: "Every page has markers that tell you how to read it. Four short chunks: spot them, work out what each one tells you, follow time and order words, then use them to find things fast. A marker key to make at the end. A new page each time you come back.",
  note: "Marker hunt: the titles, bullets, numbers, captions and order words that tell you how to read a page. Four five minute chunks and a key to make. A new page every time you come back, so have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Spotter", line: "Spotter: find the markers and name them." },
    { id: "medium", name: "Reader", line: "Reader: more markers, and what each one tells you." },
    { id: "spicy", name: "Editor", line: "Editor: why the writer chose each marker, and story time markers too." }
  ],
  themes: {
    time: { name: "Time travel", w: { kit: "time pod", who: "Zed the time traveller" } },
    football: { name: "Football", w: { kit: "football", who: "the striker" } },
    horror: { name: "Horror", w: { kit: "torch", who: "the night guard" } },
    fishing: { name: "Fishing", w: { kit: "fishing rod", who: "the angler" } },
    music: { name: "Music", w: { kit: "guitar", who: "the singer" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: page(D[0], true),
  steps: [

    /* ---------- chunk 1: spot the markers ---------- */
    { type: "learn", topic: "Spot them", title: "Markers tell you how to read a page",
      fig: page(D[0], true),
      html: "<p>Before you read a single sentence, a page is already telling you things. The <b>markers</b> do it.</p>" +
        "<p>On this page: <b>A</b> is the <b>title</b>. <b>B</b> is a <b>subheading</b>. <b>C</b> is <b>bullet points</b>. <b>D</b> is <b>numbered steps</b>. <b>E</b> is a <b>caption</b>. <b>F</b> is <b>bold</b>.</p>",
      lv: { mild: { html: "<p>A page has <b>markers</b> that help you read it.</p><p><b>A</b> is the <b>title</b>, at the top. <b>B</b> is a <b>subheading</b>, a small heading for one part. <b>C</b> is <b>bullet points</b>, a list with dots. <b>E</b> is a <b>caption</b>, under the picture.</p>" },
        spicy: { html: "<p>Before you read a word, the <b>markers</b> have told you what this is, how it is split up and how to use it.</p>" +
          "<p><b>A</b> title, <b>B</b> subheading, <b>C</b> bullet points, <b>D</b> numbered steps, <b>E</b> caption, <b>F</b> bold. Every one is a choice the writer made for the reader.</p>" } },
      vary: [1, 2].map(function(k){ return { fig: page(D[k], true), html: "<p>A new page this time. The <b>markers</b> are tagged with purple letters.</p><p><b>A</b> title, <b>B</b> subheading, <b>C</b> bullet points, <b>D</b> numbered steps, <b>E</b> caption, <b>F</b> bold.</p>",
        lv: { mild: { html: "<p>A new page this time. The <b>markers</b> are tagged with purple letters.</p><p><b>A</b> is the <b>title</b>. <b>B</b> is a <b>subheading</b>. <b>C</b> is <b>bullet points</b>. <b>E</b> is a <b>caption</b>.</p>" } } }; }) },

    S("mc", "Spot them", qA, D),
    S("mc", "Spot them", qE, D),
    S("match", "Spot them", qMatch, D),
    S("multi", "Spot them", qAll, D),

    /* ---------- chunk 2: what each marker tells you ---------- */
    { type: "learn", topic: "What it tells you", title: "Each marker has a job",
      fig: KEY,
      html: "<p>Each marker tells the reader something.</p>" +
        "<p><b>Title:</b> what the whole page is about. <b>Subheading:</b> what this section is about. <b>Bullet points:</b> separate things, any order. <b>Numbered steps:</b> do these in order. <b>Caption:</b> what the picture shows. <b>Bold:</b> this bit matters.</p>" },

    { type: "match", topic: "What it tells you",
      q: "Match each marker to what it tells the reader.",
      pairs: [["Title", JOBS[0]], ["Bullet points", JOBS[2]], ["Numbered steps", JOBS[3]], ["Caption", JOBS[4]]],
      slips: { any: "Have a look at the marker key in the last card." },
      hint: "Numbers are about order.", why: "Title: the whole page. Bullets: any order. Numbers: this order. Caption: the picture.",
      lv: { medium: { pairs: [["Title", JOBS[0]], ["Subheading", JOBS[1]], ["Bullet points", JOBS[2]], ["Numbered steps", JOBS[3]], ["Caption", JOBS[4]]] },
        spicy: { pairs: NAMES.map(function(n, k){ return [n, JOBS[k]]; }) } } },

    S("mc", "What it tells you", qWhyNum, D, { explain: true }),
    S("mc", "What it tells you", qWhyBullets, D),
    S("mc", "What it tells you", qWhyBold, D),

    /* ---------- chunk 3: time and order words ---------- */
    { type: "learn", topic: "Order words", title: "Order words and time words",
      fig: '<svg viewBox="0 0 520 170" role="img" aria-label="Stepping stones across a river: first, next, then, finally">' +
        '<rect width="520" height="170" rx="16" fill="#dff3fb"/><path d="M0 110q130 -20 260 0t260 0v60h-520z" fill="#3a8fd6" fill-opacity=".4"/>' +
        ["First", "Next", "Then", "Finally"].map(function(w, k){ var x = 70 + k * 126; return '<ellipse cx="' + x + '" cy="' + (112 - (k % 2) * 8) + '" rx="54" ry="18" fill="#c9cbd6" stroke="#141a33" stroke-width="2"/>' + T(x, 118 - (k % 2) * 8, w, 15, { a: "middle", b: 1 }); }).join("") +
        A.egg(A.bird(470, 40, 0.8, "#19c39a"), "Bird order words: first, find a worm. Next, eat the worm. Finally, look for another worm.") +
        T(260, 40, "Step across in order", 16, { a: "middle", b: 1 }) + '</svg>',
      html: "<p>Some markers are <b>words</b>. Order words tell you what comes first and what comes next: <b>first, next, then, after that, finally</b>.</p>" +
        "<p>Time words tell you when: <b>before, later, at 6pm, by morning</b>. They are like stepping stones through a text.</p>",
      lv: { spicy: { html: "<p>Some markers are <b>words and phrases</b>. In instructions, order words (<b>first, next, finally</b>) keep you on track.</p>" +
        "<p>In stories, time markers do more: they can <b>jump forward</b> (\"later that evening\"), <b>slow down</b> (\"moments later\") or <b>split the story</b> (\"meanwhile\"). They are often at the start of a paragraph, telling the reader time has moved.</p>" } } },

    S("multi", "Order words", qPickWords, [0, 1, 2]),
    S("order", "Order words", qOrd, [0, 1, 2]),
    S("mc", "Order words", qLast, [0, 1, 2]),

    /* ---------- chunk 4: use the markers ---------- */
    { type: "learn", topic: "Use them", title: "Markers help you find things fast",
      html: "<p>Last bit. Markers are not just for spotting: they let you <b>jump</b> to what you need without reading everything.</p>" +
        "<p>Need a list? Find the right <b>subheading</b>. Need the next step? Follow the <b>numbers</b>. Wondering about the picture? Read the <b>caption</b>.</p>",
      fig: '<svg viewBox="0 0 420 140" role="img" aria-label="Jay with a page, looking pleased">' + A.jay(90, 56, 0.8, "smile") + A.bubble(150, 10, 250, 70, "When I was in China, I\nread the subheadings first.\nWorks every time.", 168) + '</svg>' },

    S("mc", "Use them", qWhere, D),
    S("num", "Use them", qStepNo, D),
    S("mc", "Use them", qNext, D)
  ],

  realWorld: {
    title: "Markers, everywhere",
    html: "<p>You use markers all the time without noticing: the headings on a game's settings menu, the numbered steps for building a model, the bold warning on a medicine box, the caption under a photo online.</p>" +
      "<p>For our big question: if we could time travel, should we? Imagine the instructions for a time machine. You would want very clear numbered steps, and the bold warning would be the most important line on the page.</p>",
    fig: '<svg viewBox="0 0 420 160" role="img" aria-label="Time machine instructions with numbered steps and a bold warning, next to the portal">' + A.portal(70, 80, 54) +
      '<rect x="150" y="14" width="250" height="132" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
      T(166, 40, "Using the Portal", 16, { b: 1 }) + T(166, 64, "1. Pick a year.", 13) + T(166, 84, "2. Hold on tight.", 13) + T(166, 104, "3. Step through.", 13) +
      T(166, 132, "Do not touch the dinosaurs.", 13, { b: 1 }) + '</svg>'
  },

  make: {
    title: "Make a marker key",
    intro: "A key for your wall: pick three markers and say, in your own words, what each one tells a reader. Keep it, stick it up, or send it to Jay.",
    fields: [
      { id: "m1", label: "Marker 1", ph: "Numbered steps", max: 22 },
      { id: "j1", label: "What it tells you", ph: "Do these in order", max: 40 },
      { id: "m2", label: "Marker 2", ph: "Caption", max: 22 },
      { id: "j2", label: "What it tells you", ph: "What the picture shows", max: 40 },
      { id: "m3", label: "Marker 3", ph: "Bold", max: 22 },
      { id: "j3", label: "What it tells you", ph: "Do not miss this bit", max: 40 },
      { id: "name", label: "Marker hunter", ph: "B5", max: 24 }
    ],
    svg: function(v){
      function row(y, m, j, col, L){
        var jl = wrap(j, 46, 2);
        return '<rect x="30" y="' + y + '" width="540" height="78" rx="14" fill="' + col + '" fill-opacity=".22"/>' +
          '<circle cx="62" cy="' + (y + 39) + '" r="18" fill="#8a5cf6"/>' + T(62, y + 45, L, 16, { a: "middle", b: 1, c: "#ffffff" }) +
          T(94, y + 28, esc(wrap(m, 22, 1)[0] || ""), 20, { b: 1 }) +
          jl.map(function(l, k){ return T(94, y + 50 + k * 18, esc(l), 15, { c: "#3a4060" }); }).join("");
      }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#ffffff"/>' +
        '<rect x="12" y="12" width="576" height="376" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        T(30, 56, "MARKER KEY", 26, { b: 1, c: "#8a5cf6" }) +
        row(74, v.m1, v.j1, "#22b8e6", "A") + row(160, v.m2, v.j2, "#19c39a", "B") + row(246, v.m3, v.j3, "#ffd23f", "C") +
        T(30, 368, "Marker hunter: " + esc(wrap(v.name, 24, 1)[0] || ""), 16, { b: 1, c: "#5b6180" }) +
        A.bird(540, 50, 0.8, "#3a8fd6") +
        '</svg>';
    }
  }
};
})();
