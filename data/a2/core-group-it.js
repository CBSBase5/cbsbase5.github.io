/* Base 5 core target activity: Group it.
   English. Paragraphs as boxes for sentences that belong together: sorting
   sentences into groups, spotting where a new paragraph starts, and planning
   paragraphs before writing. Replayable: most questions carry two more
   versions. ASCII only. */
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
function nums(list){ return task(list.map(function(s, k){ return "<b>(" + (k + 1) + ")</b> " + s; }).join(" ")); }

/* Question builder: each version is {fields, medium:{...}, spicy:{...}}. o:[right, others] becomes
   options (the right one moves a place each version) and s:[slip for each other option] becomes
   slips. Version 1 is the base; the rest become vary, each with every level written out. */
function res(v, L, vi){
  var o = {};
  Object.keys(v).forEach(function(k){ if(LVS.indexOf(k) < 0 && k !== "ez") o[k] = v[k]; });
  if(v[L]) ext(o, v[L]);
  var t = 0;
  if(o.o){
    var right = o.o[0], rest = o.o.slice(1), opts = rest.slice(), sl = {};
    t = vi % o.o.length;
    opts.splice(t, 0, right);
    (o.s || []).forEach(function(m, j){ if(m) sl[j < t ? j : j + 1] = m; });
    o.options = opts; o.answer = t; o.slips = sl; delete o.o; delete o.s;
  }
  /* easy read (LC): ez is for the first level only; ez.s moves with the options, like s */
  if(v.ez && L === START){
    var e = ext({}, v.ez);
    if(e.s){ var es = {}; e.s.forEach(function(m, j){ if(m) es[j < t ? j : j + 1] = m; }); e.slips = es; delete e.s; }
    o.ez = e;
  }
  return o;
}
function Q(type, topic, flags, vers){
  var all = [], R = vers.map(function(v, vi){ var r = {}; LVS.forEach(function(L){ r[L] = res(v, L, vi); all.push(r[L]); }); return r; });
  var keys = {}; all.forEach(function(o){ Object.keys(o).forEach(function(k){ if(k !== "ez") keys[k] = 1; }); });
  all.forEach(function(o){ Object.keys(keys).forEach(function(k){ if(!(k in o)) o[k] = null; }); });
  function others(r){ var lv = {}; LVS.forEach(function(L){ if(L !== START) lv[L] = r[L]; }); return lv; }
  var step = ext(ext({ type: type, topic: topic }, flags || {}), R[0][START]);
  step.lv = others(R[0]);
  if(R.length > 1) step.vary = R.slice(1).map(function(r){ return ext(ext({}, r[START]), { lv: others(r) }); });
  return step;
}

/* ---------- pictures ---------- */
var COL = ["#22b8e6", "#ff8a5c", "#19c39a"];
function strip(x, y, w, col){ return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="14" rx="5" fill="' + col + '" fill-opacity=".55" stroke="#141a33" stroke-width="1.5"/>'; }

/* three boxes, each holding the sentences that belong together */
var BOXES = '<svg viewBox="0 0 540 220" role="img" aria-label="Three boxes, each holding sentences of one colour. A paragraph is a box for sentences about one thing">' +
  '<rect width="540" height="220" rx="16" fill="#f4f1ea"/>' +
  [["Looks", 0], ["Food", 1], ["Home", 2]].map(function(b, k){
    var x = 24 + k * 172;
    return '<path d="M' + x + ' 64h150v120h-150z" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
      '<path d="M' + x + ' 64l14 -16h122l14 16" fill="#e7dcc6" stroke="#141a33" stroke-width="2.5" stroke-linejoin="round"/>' +
      strip(x + 14, 80, 120, COL[k]) + strip(x + 14, 102, 96, COL[k]) + strip(x + 14, 124, 110, COL[k]) +
      T(x + 75, 168, b[0], 16, { a: "middle", b: 1 });
  }).join("") +
  '<g transform="rotate(-8 270 26)">' + strip(206, 18, 110, COL[1]) + '</g>' +
  '<path d="M330 34q40 0 50 22" fill="none" stroke="#141a33" stroke-width="2.5" stroke-dasharray="5 4"/><path d="M372 52l9 8 2 -12z" fill="#141a33"/>' +
  T(270, 208, "One box, one topic. One paragraph, one topic.", 14, { a: "middle", b: 1 }) +
  A.egg(A.bird(486, 44, 0.6, "#ffd23f"), "A bird sitting on the Home box. It has very strong opinions about where nests go.") +
  '</svg>';

/* a page with two paragraphs, and why the second one starts */
function lines(x, y, n, w){ var s = ""; for(var k = 0; k < n; k++) s += '<path d="M' + (x + (k === 0 ? 18 : 0)) + ' ' + (y + k * 15) + 'h' + (w - (k === 0 ? 18 : 0) - (k === n - 1 ? 60 : (k * 23) % 30)) + '" stroke="#9aa0b8" stroke-width="4" stroke-linecap="round"/>'; return s; }
var PARA = '<svg viewBox="0 0 520 230" role="img" aria-label="A page with two paragraphs. The second one starts on a new line, with a gap, because the topic changes">' +
  '<rect width="520" height="230" rx="16" fill="#f4f1ea"/>' +
  '<rect x="24" y="14" width="260" height="202" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
  '<rect x="34" y="26" width="240" height="72" rx="6" fill="#22b8e6" fill-opacity=".15"/>' + lines(42, 40, 4, 222) +
  '<rect x="34" y="118" width="240" height="88" rx="6" fill="#19c39a" fill-opacity=".15"/>' + lines(42, 134, 5, 222) +
  '<path d="M292 62h20" stroke="#141a33" stroke-width="2"/>' + T(318, 58, "Paragraph 1", 14, { b: 1, c: "#1a7fb0" }) + T(318, 76, "the morning", 13) +
  '<path d="M292 160h20" stroke="#141a33" stroke-width="2"/>' + T(318, 152, "Paragraph 2", 14, { b: 1, c: "#138a6c" }) + T(318, 170, "the afternoon", 13) +
  '<path d="M40 108h20" stroke="#ff5d5d" stroke-width="3"/><path d="M60 102l8 6 -8 6z" fill="#ff5d5d"/>' + T(76, 112, "new topic: new line, small gap", 11, { b: 1, c: "#c23b3b" }) +
  '</svg>';

/* jumbled sentences sorted into two paragraphs */
var WORK = '<svg viewBox="0 0 540 210" role="img" aria-label="Six jumbled sentence strips, sorted into two paragraphs by colour, with the topic sentence at the top of each">' +
  '<rect width="540" height="210" rx="16" fill="#f4f1ea"/>' +
  [[0, -4], [1, 3], [0, -2], [1, 5], [0, 2], [1, -3]].map(function(c, k){ return '<g transform="rotate(' + c[1] + ' 90 ' + (36 + k * 24) + ')">' + strip(30, 28 + k * 24, 120, COL[c[0]]) + '</g>'; }).join("") +
  '<path d="M170 100h40" stroke="#141a33" stroke-width="4"/><path d="M206 91l14 9 -14 9z" fill="#141a33"/>' +
  [0, 1].map(function(k){
    var x = 240 + k * 148;
    return '<rect x="' + x + '" y="20" width="132" height="134" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
      '<rect x="' + (x + 10) + '" y="32" width="112" height="16" rx="5" fill="' + COL[k] + '" stroke="#141a33" stroke-width="2"/>' +
      strip(x + 10, 60, 100, COL[k]) + strip(x + 10, 82, 106, COL[k]) + strip(x + 10, 104, 90, COL[k]) +
      T(x + 66, 138, "Paragraph " + (k + 1), 13, { a: "middle", b: 1 });
  }).join("") +
  T(90, 196, "1. Spot the topics", 13, { a: "middle", b: 1 }) + T(379, 182, "2. Sort them, then 3. topic sentence on top", 12, { a: "middle", b: 1 }) +
  '</svg>';

/* a paragraph plan */
var PLAN = '<svg viewBox="0 0 520 210" role="img" aria-label="A paragraph plan: a title at the top, then three boxes, one for each paragraph and its topic">' +
  '<rect width="520" height="210" rx="16" fill="#f4f1ea"/>' +
  '<rect x="170" y="14" width="180" height="40" rx="10" fill="#141a33"/>' + T(260, 40, "Robins", 18, { a: "middle", b: 1, c: "#ffd23f" }) +
  [["What they", "look like"], ["What they", "eat"], ["Where they", "live"]].map(function(p, k){
    var x = 30 + k * 160;
    return '<path d="M260 54L' + (x + 70) + ' 84" stroke="#141a33" stroke-width="2"/>' +
      '<rect x="' + x + '" y="84" width="140" height="96" rx="12" fill="' + COL[k] + '" fill-opacity=".25" stroke="#141a33" stroke-width="2.5"/>' +
      T(x + 70, 108, "Paragraph " + (k + 1), 13, { a: "middle", b: 1, c: "#3a4060" }) + T(x + 70, 138, p[0], 15, { a: "middle", b: 1 }) + T(x + 70, 158, p[1], 15, { a: "middle", b: 1 });
  }).join("") +
  A.egg(A.bird(470, 34, 0.55, "#e04848"), "A robin, checking the plan is about robins. It approves.") +
  '</svg>';

(window.A2PACKS = window.A2PACKS || {})["core-group-it"] = {
  a2: true,
  id: "a2-core-group-it",
  title: "Group it",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "A paragraph is a box for sentences that belong together. One topic per box.",
  blurb: "Sorting sentences into paragraphs: what goes together, where a new one starts, and planning your own. Four short chunks and a paragraph plan card to make at the end. The questions change each time you come back.",
  note: "Group it: paragraphs as boxes for sentences that belong together. Four five minute chunks and a plan card to make. The questions change every go, so have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Sock drawer", line: "Sock drawer: two groups at a time, clear differences." },
    { id: "medium", name: "Filing cabinet", line: "Filing cabinet: three groups, and spotting where paragraphs start." },
    { id: "spicy", name: "Librarian", line: "Librarian: close topics, sneaky sentences that nearly fit, and planning whole pieces." }
  ],
  themes: {
    time: { name: "Time travel", w: { thing: "the time machine", lk1: "It is silver and shaped like a phone box.", lk2: "It has one big red lever.", wh1: "It is kept in a garage in Leeds.", wh2: "The garage is behind the old library.", do1: "It can take you back 500 years.", do2: "Each trip lasts one hour." } },
    football: { name: "Football", w: { thing: "the football club", lk1: "The kit is red and white.", lk2: "The badge is a gold lion.", wh1: "The stadium is next to the river.", wh2: "It is a short walk from the station.", do1: "The team plays every Saturday.", do2: "Fans sing for the whole match." } },
    horror: { name: "Horror", w: { thing: "the haunted castle", lk1: "It has four black towers.", lk2: "Ivy covers every window.", wh1: "It stands on a hill above the town.", wh2: "A narrow path winds up to the gate.", do1: "Ghost tours run every night.", do2: "Visitors hear footsteps in the hall." } },
    fishing: { name: "Fishing", w: { thing: "the lake", lk1: "The water is deep and green.", lk2: "Tall reeds grow round the edge.", wh1: "It is two miles from the village.", wh2: "You reach it down a farm track.", do1: "People fish there for carp.", do2: "Matches are held every Sunday." } },
    music: { name: "Music", w: { thing: "the band", lk1: "They all wear gold jackets.", lk2: "The drummer has bright blue hair.", wh1: "They come from Manchester.", wh2: "They practise in a garage near the canal.", do1: "They play loud rock songs.", do2: "Their next gig is in May." } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: BOXES,
  steps: [

    /* ---------- chunk 1: things that go together ---------- */
    { type: "learn", topic: "What goes together?", title: "A paragraph is a box",
      fig: BOXES,
      html: "<p>Think of a drawer. Socks go in one box, T shirts in another.</p>" +
        "<p>A <b>paragraph</b> is a box for <b>sentences about one thing</b>. When you write about something new, you start a new box.</p>",
      lv: {
        medium: { html: "<p>A <b>paragraph</b> is a group of sentences about <b>one topic</b>.</p>" +
          "<p>If you are writing about a robin, one paragraph might be about <b>what it looks like</b>, the next about <b>what it eats</b>, the next about <b>where it lives</b>.</p>" +
          "<p>Grouping like this helps the reader. They know what each part is about, and can find things again.</p>" },
        spicy: { html: "<p>A paragraph groups sentences around <b>one focus</b>. The tricky part is that topics overlap.</p>" +
          "<p>In a piece about herons, \"They stand still for ages\" could be about how they look, how they hunt or how they behave. Where it goes depends on the paragraph's job: in a hunting paragraph it belongs; in a looks paragraph it wanders off.</p>" +
          "<p>So ask two questions: <b>what is this paragraph for?</b> and <b>does this sentence help with that?</b></p>" } },
      ez: { html: "<p>A <b>paragraph</b> is a box.</p><p>It holds sentences about 1 thing.</p>" } },

    Q("sort", "What goes together?", null, [
      { q: "Here are some sentences about Bonnie. Sort them into two paragraphs.",
        buckets: ["What she looks like", "What she likes"],
        cards: [["She has brown curly fur.", 0], ["She has no tail.", 0], ["She loves chasing leaves.", 1], ["Her favourite snack is carrot.", 1]],
        hint: "Is it about how she looks, or what she enjoys?",
        why: "Fur and no tail are about looks. Leaves and carrot are things she likes.",
        ez: { q: "Sort the sentences about Bonnie into 2 groups.", hint: "Her looks, or what she likes?", why: "Fur and tail are looks. Leaves and carrot she likes." },
        medium: { buckets: ["What she looks like", "What she likes", "Her day"],
          cards: [["She has brown curly fur.", 0], ["She has no tail.", 0], ["She loves chasing leaves.", 1], ["Her favourite snack is carrot.", 1], ["She has a walk every morning.", 2], ["She naps after lunch.", 2]],
          why: "Three topics, three paragraphs: looks, likes, and her day." },
        spicy: { buckets: ["What she looks like", "What she likes", "Her day"],
          cards: [["She has brown curly fur.", 0], ["She has no tail.", 0], ["Her ears flop when she runs.", 0], ["She loves chasing leaves.", 1], ["Her favourite snack is carrot.", 1], ["She has a walk every morning.", 2], ["She naps after lunch, every single day.", 2]],
          why: "Floppy ears happen when she runs, but the sentence is describing her ears, so it is looks. Napping every day is a routine, so it is her day." } },
      { q: "Here are some sentences about robins. Sort them into two paragraphs.",
        buckets: ["What they look like", "What they eat"],
        cards: [["Robins have a red chest.", 0], ["They are small and round.", 0], ["They eat worms.", 1], ["They like seeds and berries.", 1]],
        hint: "Looks, or food?",
        why: "Red chest and round are looks. Worms, seeds and berries are food.",
        ez: { q: "Sort the sentences about robins into 2 groups.", why: "Red chest and round are looks. The rest is food." },
        medium: { buckets: ["What they look like", "What they eat", "Where they live"],
          cards: [["Robins have a red chest.", 0], ["They are small and round.", 0], ["They eat worms.", 1], ["They like seeds and berries.", 1], ["They live in gardens and parks.", 2], ["They nest in hedges.", 2]],
          why: "Looks, food and home: three paragraphs." },
        spicy: { buckets: ["What they look like", "What they eat", "Where they live"],
          cards: [["Robins have a red chest.", 0], ["Young robins are speckled brown.", 0], ["They eat worms.", 1], ["They follow gardeners to grab worms from the soil.", 1], ["They live in gardens and parks.", 2], ["They nest in hedges and old kettles.", 2]],
          why: "Following gardeners happens in a garden, but it is about getting food, so it goes in the food paragraph." } },
      { q: "Here are some sentences about a school trip. Sort them into two paragraphs.",
        buckets: ["The journey", "The museum"],
        cards: [["The coach left at 9am.", 0], ["We sang songs on the way.", 0], ["The museum had a huge dinosaur.", 1], ["We saw old Roman coins.", 1]],
        hint: "Getting there, or being there?",
        why: "Coach and singing were the journey. Dinosaur and coins were in the museum.",
        ez: { q: "Sort the sentences about the trip into 2 groups.", why: "Coach and songs were the journey. The rest was the museum." },
        medium: { buckets: ["The journey", "The museum", "Lunch"],
          cards: [["The coach left at 9am.", 0], ["We sang songs on the way.", 0], ["The museum had a huge dinosaur.", 1], ["We saw old Roman coins.", 1], ["We ate in the park.", 2], ["Jay dropped his sandwich.", 2]],
          why: "Journey, museum and lunch: three paragraphs." },
        spicy: { buckets: ["The journey", "The museum", "Lunch"],
          cards: [["The coach left at 9am.", 0], ["The traffic was terrible.", 0], ["The museum had a huge dinosaur.", 1], ["The guide told us the coins were Roman.", 1], ["We ate in the park.", 2], ["A pigeon stole Jay's crust.", 2], ["The cafe in the museum was shut, so we ate outside.", 2]],
          why: "The cafe is in the museum, but the sentence is about where you ate lunch, so it goes in the lunch paragraph." } }
    ]),

    Q("mc", "What goes together?", null, [
      { q: "One sentence does not belong in this paragraph. Which one?" + task("The beach has soft sand. The sea is calm and blue. My cousin has a new bike. There are rock pools to explore."),
        o: ["My cousin has a new bike.", "The beach has soft sand.", "There are rock pools to explore."],
        s: ["Sand is part of the beach. It belongs.", "Rock pools are on the beach. It belongs."],
        hint: "Which one is not about the beach?",
        why: "Everything else is about the beach. The bike has wandered in from somewhere else.",
        ez: { q: "Which sentence does not belong?" + task("The beach has soft sand. The sea is calm and blue. My cousin has a new bike. There are rock pools to explore."),
          s: ["Sand is on the beach. It fits.", "Rock pools are on the beach. It fits."], why: "The bike is not about the beach." },
        medium: { o: ["My cousin has a new bike.", "The beach has soft sand.", "The sea is calm and blue.", "There are rock pools to explore."],
          s: ["Sand is part of the beach.", "The sea is part of the beach.", "Rock pools are on the beach."] },
        spicy: { q: "This paragraph is about <b>what herons look like</b>. Which sentence does not belong?" + task("Herons are tall grey birds. They have long thin legs and a sharp yellow beak. Their wings can be almost two metres across. They mostly eat fish and frogs."),
          o: ["They mostly eat fish and frogs.", "They have long thin legs and a sharp yellow beak.", "Their wings can be almost two metres across."],
          s: ["Legs and beak are looks. It belongs.", "Wing size is how they look. It belongs."],
          why: "It is about herons, but it is about food, not looks. It belongs in a different paragraph." } },
      { q: "One sentence does not belong in this paragraph. Which one?" + task("We went to the zoo. We saw two lions. When I was in China, I ate noodles. The penguins were swimming."),
        o: ["When I was in China, I ate noodles.", "We saw two lions.", "The penguins were swimming."],
        s: ["Lions are at the zoo. It belongs.", "Penguins are at the zoo. It belongs."],
        hint: "Which one is not about the zoo?",
        why: "Jay's favourite story, but it is not about the zoo.",
        ez: { q: "Which sentence does not belong?" + task("We went to the zoo. We saw two lions. When I was in China, I ate noodles. The penguins were swimming."),
          s: ["Lions are at the zoo. It fits.", "Penguins are at the zoo. It fits."], why: "Jay's favourite story. But not about the zoo." },
        medium: { o: ["When I was in China, I ate noodles.", "We went to the zoo.", "We saw two lions.", "The penguins were swimming."],
          s: ["That is what the paragraph is about.", "Lions are at the zoo.", "Penguins are at the zoo."] },
        spicy: { q: "This paragraph is about <b>the journey to the zoo</b>. Which sentence does not belong?" + task("We left school at nine. The coach was freezing. We got stuck in traffic near the bridge. The penguins were swimming when we arrived."),
          o: ["The penguins were swimming when we arrived.", "The coach was freezing.", "We got stuck in traffic near the bridge."],
          s: ["The coach is part of the journey.", "Traffic is part of the journey."],
          why: "Once you meet the penguins, you have arrived. That starts the next paragraph." } },
      { q: "One sentence does not belong in this paragraph. Which one?" + task("Herons are tall grey birds. They have long legs. They stand very still. Jay's car is blue."),
        o: ["Jay's car is blue.", "Herons are tall grey birds.", "They have long legs."],
        s: ["That is what the paragraph is about.", "Long legs are part of a heron."],
        hint: "Which one is not about herons?",
        why: "It is all about herons, then suddenly Jay's car. Outrageous.",
        ez: { q: "Which sentence does not belong?" + task("Herons are tall grey birds. They have long legs. They stand very still. Jay's car is blue."),
          s: ["That is what it is all about.", "Long legs are part of a heron."], why: "Jay's car is not a heron. Outrageous." },
        medium: { o: ["Jay's car is blue.", "Herons are tall grey birds.", "They have long legs.", "They stand very still."],
          s: ["That is the topic.", "Long legs are part of a heron.", "Standing still is something herons do."] },
        spicy: { q: "This paragraph is about <b>how herons catch food</b>. Which sentence does not belong?" + task("Herons wade into shallow water. They stand completely still for ages. Then they strike with their beak. Their nests are made of sticks."),
          o: ["Their nests are made of sticks.", "They stand completely still for ages.", "Then they strike with their beak."],
          s: ["Standing still is part of how they hunt.", "Striking is how they catch the fish."],
          why: "Nests are about where herons live, not how they hunt." } }
    ]),

    Q("mc", "What goes together?", null, [
      { q: "What is this paragraph about?" + task("[[Lk1]] [[Lk2]]"),
        o: ["What [[thing]] looks like", "Where [[thing]] is", "What happens there"],
        s: ["Nothing here says where it is.", "Nothing here says what happens."],
        hint: "Both sentences describe it.",
        ez: { s: ["Nothing says where it is.", "Nothing says what happens."] },
        why: "Both sentences describe how it looks.",
        spicy: { q: "Which is the best label for this paragraph?" + task("[[Lk1]] [[Lk2]]"),
          o: ["Its appearance", "Its location", "Facts"],
          s: ["Nothing here says where it is.", "True, but far too wide. Every paragraph could be called that."] } },
      { q: "What is this paragraph about?" + task("[[Wh1]] [[Wh2]]"),
        o: ["Where [[thing]] is", "What [[thing]] looks like", "What happens there"],
        s: ["Nothing here describes how it looks.", "Nothing here says what happens."],
        hint: "Both sentences are about a place.",
        ez: { s: ["Nothing says how it looks.", "Nothing says what happens."] },
        why: "Both sentences are about where it is.",
        spicy: { q: "Which is the best label for this paragraph?" + task("[[Wh1]] [[Wh2]]"),
          o: ["Its location", "Its appearance", "Information"],
          s: ["Nothing here describes how it looks.", "Far too wide. That could go on any paragraph."] } },
      { q: "What is this paragraph about?" + task("[[Do1]] [[Do2]]"),
        o: ["What happens there", "Where [[thing]] is", "What [[thing]] looks like"],
        s: ["Nothing here says where it is.", "Nothing here describes how it looks."],
        hint: "Both sentences are about things going on.",
        ez: { s: ["Nothing says where it is.", "Nothing says how it looks."] },
        why: "Both sentences are about what happens.",
        spicy: { q: "Which is the best label for this paragraph?" + task("[[Do1]] [[Do2]]"),
          o: ["Activities", "Its location", "Other things"],
          s: ["Nothing here says where it is.", "Too vague: other things could mean anything."] } }
    ]),

    /* ---------- chunk 2: new topic, new paragraph ---------- */
    { type: "learn", topic: "New topic, new paragraph", title: "When does a new paragraph start?",
      fig: PARA,
      html: "<p>Start a new paragraph when you move on to something <b>new</b>.</p>" +
        "<p>A new <b>topic</b> (from food to games), a new <b>time</b> (from the morning to the afternoon) or a new <b>place</b> (from the bus to the beach).</p>" +
        "<p>On the page, the new paragraph starts on a <b>new line</b>.</p>",
      lv: {
        medium: { html: "<p>Start a new paragraph when the writing moves on: a new <b>topic</b>, a new <b>time</b>, a new <b>place</b> or a new <b>person</b>.</p>" +
          "<p>Words like <b>Later that day</b>, <b>Meanwhile</b>, <b>Another reason</b> or <b>When we got there</b> often sit right at the start of a new paragraph. They are clues.</p>" +
          "<p>On the page, a new paragraph starts on a new line, often with a small gap or an indent.</p>" },
        spicy: { html: "<p>The four classic triggers for a new paragraph are often remembered as <b>TiPToP</b>: a change of <b>Ti</b>me, <b>P</b>lace, <b>To</b>pic or <b>P</b>erson.</p>" +
          "<p>Writers also break paragraphs for <b>effect</b>: a one sentence paragraph after long ones makes that moment hit harder.</p>" +
          "<p>Watch for linking phrases that signal a shift: <b>However</b>, <b>On the other hand</b>, <b>Hours later</b>, <b>Back at home</b>. The new paragraph usually starts just before them.</p>" } },
      ez: { title: "New thing, new paragraph", html: "<p>Something <b>new</b>? Start a new paragraph.</p><p>A new topic, time or place.</p>" } },

    Q("mc", "New topic, new paragraph", { fixed: true }, [
      { q: "This was written as one block. Where should a new paragraph start?" + nums(["We had breakfast at 8.", "I ate toast.", "In the afternoon, we went to the park.", "We fed the ducks."]),
        options: ["Before sentence 2", "Before sentence 3", "Before sentence 4"], answer: 1,
        slips: { 0: "Toast is still breakfast. The topic has not changed yet.", 2: "The ducks are in the park, so they belong with sentence 3." },
        hint: "Find the sentence where the time changes.",
        why: "<b>In the afternoon</b> moves to a new time, so the new paragraph starts there.",
        ez: { q: "Where does a new paragraph start?" + nums(["We had breakfast at 8.", "I ate toast.", "In the afternoon, we went to the park.", "We fed the ducks."]),
          slips: { 0: "Toast is still breakfast.", 2: "The ducks are in the park too." }, hint: "Where does the time change?", why: "<b>In the afternoon</b> is a new time." },
        medium: { q: "This was written as one block. Where should a new paragraph start?" + nums(["We had breakfast at 8.", "I ate toast and Jay had porridge.", "Then we packed our bags.", "In the afternoon, we went to the park.", "We fed the ducks.", "Bonnie barked at a goose."]),
          options: ["Before sentence 3", "Before sentence 4", "Before sentence 5", "Before sentence 6"], answer: 1,
          slips: { 0: "Packing bags is still part of the morning.", 2: "The ducks are part of the park, which started at sentence 4.", 3: "The goose is still in the park." } },
        spicy: { q: "This needs <b>two</b> new paragraphs. Where should they start?" + nums(["We had breakfast at 8.", "Jay burnt the toast.", "In the afternoon, we went to the park.", "Bonnie barked at a goose.", "Back at home, we were all exhausted.", "Bonnie fell asleep on my feet."]),
          options: ["Before 3 and before 5", "Before 2 and before 4", "Before 4 and before 6"], answer: 0,
          slips: { 1: "Toast is still breakfast, and the goose is in the park.", 2: "The goose belongs with the park, and falling asleep is part of being back at home." },
          why: "<b>In the afternoon</b> is a new time and <b>Back at home</b> is a new place." } },
      { q: "This was written as one block. Where should a new paragraph start?" + nums(["Our class has a pet fish.", "It is orange.", "Our class also has a garden.", "We grow carrots in it."]),
        options: ["Before sentence 2", "Before sentence 3", "Before sentence 4"], answer: 1,
        slips: { 0: "Orange is still about the fish.", 2: "Carrots grow in the garden, so they go with sentence 3." },
        hint: "Find where the topic changes from the fish.",
        why: "The topic changes from the fish to the garden at sentence 3.",
        ez: { q: "Where does a new paragraph start?" + nums(["Our class has a pet fish.", "It is orange.", "Our class also has a garden.", "We grow carrots in it."]),
          slips: { 0: "Orange is still about the fish.", 2: "Carrots go with the garden." }, hint: "Where does the topic change?", why: "Sentence 3 moves on to the garden." },
        medium: { q: "This was written as one block. Where should a new paragraph start?" + nums(["Our class has a pet fish called Gill.", "It is orange with a white tail.", "We feed it every morning.", "Our class also has a garden.", "We grow carrots and beans.", "Bonnie likes to dig in it."]),
          options: ["Before sentence 3", "Before sentence 4", "Before sentence 5", "Before sentence 6"], answer: 1,
          slips: { 0: "Feeding it is still about the fish.", 2: "Carrots are in the garden, which started at sentence 4.", 3: "Digging is still about the garden." } },
        spicy: { q: "This needs <b>two</b> new paragraphs. Where should they start?" + nums(["Our class has a pet fish called Gill.", "We feed it every morning.", "Our class also has a garden.", "Bonnie likes to dig in it.", "However, the best thing about our class is the people.", "Everyone helps each other."]),
          options: ["Before 3 and before 5", "Before 2 and before 4", "Before 4 and before 6"], answer: 0,
          slips: { 1: "Feeding is still the fish, and digging is still the garden.", 2: "Digging belongs with the garden, and helping each other goes with the people." },
          why: "The garden is a new topic, and <b>However</b> signals another new one: the people." } },
      { q: "This was written as one block. Where should a new paragraph start?" + nums(["The bus was very busy.", "We had to stand up.", "At the beach, the sun came out.", "We built a sandcastle."]),
        options: ["Before sentence 2", "Before sentence 3", "Before sentence 4"], answer: 1,
        slips: { 0: "Standing up is still on the bus.", 2: "The sandcastle is at the beach, so it goes with sentence 3." },
        hint: "Find where the place changes.",
        why: "<b>At the beach</b> is a new place.",
        ez: { q: "Where does a new paragraph start?" + nums(["The bus was very busy.", "We had to stand up.", "At the beach, the sun came out.", "We built a sandcastle."]),
          slips: { 0: "Standing up is still on the bus.", 2: "The sandcastle goes with the beach." }, hint: "Where does the place change?" },
        medium: { q: "This was written as one block. Where should a new paragraph start?" + nums(["The bus was very busy.", "We had to stand up.", "A man was singing loudly.", "At the beach, the sun came out.", "We built a huge sandcastle.", "The sea knocked it down."]),
          options: ["Before sentence 3", "Before sentence 4", "Before sentence 5", "Before sentence 6"], answer: 1,
          slips: { 0: "The singing man is still on the bus.", 2: "The sandcastle is at the beach, which started at sentence 4.", 3: "The sea is still at the beach." } },
        spicy: { q: "This needs <b>two</b> new paragraphs. Where should they start?" + nums(["The bus was very busy.", "A man was singing loudly.", "At the beach, the sun came out.", "The sea knocked our sandcastle down.", "Hours later, we caught the last bus home.", "Nobody sang this time."]),
          options: ["Before 3 and before 5", "Before 2 and before 4", "Before 4 and before 6"], answer: 0,
          slips: { 1: "The singing is still on the first bus, and the sea is still at the beach.", 2: "The sea goes with the beach, and nobody singing goes with the bus home." },
          why: "<b>At the beach</b> is a new place and <b>Hours later</b> is a new time." } }
    ]),

    Q("multi", "New topic, new paragraph", null, [
      { q: "Pick <b>all</b> the good reasons to start a new paragraph.",
        options: ["A new topic", "A new time", "A new place", "After every single sentence"],
        answers: [0, 1, 2],
        slips: { any: "Three are good reasons. A paragraph usually has more than one sentence." },
        hint: "What could change?",
        why: "A new topic, time or place. Not every sentence: then nothing would be grouped.",
        ez: { q: "Pick <b>all</b> the good reasons for a new paragraph.", slips: { any: "3 are good reasons. Not after every sentence." }, why: "A new topic, time or place." },
        medium: { options: ["A new topic", "A new time", "A new place", "A new person", "After every single sentence", "When the line is full"], answers: [0, 1, 2, 3],
          slips: { any: "Four are good reasons. Paragraphs group sentences, and a full line just means carry on." } },
        spicy: { options: ["A change of time", "A change of place", "A change of topic", "A change of person", "For dramatic effect", "Whenever a sentence is long", "To make the page look fuller"], answers: [0, 1, 2, 3, 4],
          slips: { any: "Five good reasons: TiPToP, plus effect. Long sentences and filling the page are not reasons." } } },
      { q: "Pick <b>all</b> the openings that could start a new paragraph.",
        options: ["Later that day,", "When we got home,", "Another thing I like is", "and then"],
        answers: [0, 1, 2],
        slips: { any: "Three signal something new. \"and then\" carries on the same sentence." },
        hint: "Which ones move to a new time, place or topic?",
        why: "A new time, a new place and a new topic. \"and then\" just keeps going.",
        ez: { q: "Pick <b>all</b> the ones that could start a new paragraph.", slips: { any: "3 move on. \"and then\" just carries on." }, hint: "Which ones move to something new?", why: "New time, place and topic. \"and then\" carries on." },
        medium: { options: ["Later that day,", "When we got home,", "Another reason is", "Meanwhile, at school,", "and also", "because"], answers: [0, 1, 2, 3],
          slips: { any: "Four signal a shift. \"and also\" and \"because\" join ideas inside a sentence." } },
        spicy: { options: ["However,", "Hours later,", "On the other hand,", "Back at the castle,", "which meant", "so"], answers: [0, 1, 2, 3],
          slips: { any: "Four signal a shift in topic, time or place. \"which meant\" and \"so\" carry on the same idea." } } },
      { q: "Pick <b>all</b> the times a new paragraph is a good idea.",
        options: ["Moving from the morning to the afternoon", "Moving from food to games", "Moving from the bus to the beach", "In the middle of a sentence"],
        answers: [0, 1, 2],
        slips: { any: "Three are shifts. You never break a paragraph in the middle of a sentence." },
        hint: "Time, topic, place.",
        why: "Time, topic and place changes. Never mid sentence.",
        ez: { q: "When is a new paragraph good? Pick <b>all</b>.", slips: { any: "3 are changes. Never in the middle of a sentence." }, why: "When the time, topic or place changes." },
        medium: { options: ["Moving from the morning to the afternoon", "Moving from food to games", "Moving from the bus to the beach", "Moving from what Jay said to what Bonnie did", "In the middle of a sentence", "After every line"], answers: [0, 1, 2, 3],
          slips: { any: "Four are shifts: time, topic, place, person." } },
        spicy: { options: ["Moving from reasons for to reasons against", "Moving from 1966 to 2026", "Moving from the lab to the past", "Moving from one character to another", "Halfway through a list of reasons for the same side", "Whenever you start a new line on the screen"], answers: [0, 1, 2, 3],
          slips: { any: "Four shifts. A list of reasons for the same side belongs together." } } }
    ]),

    Q("mc", "New topic, new paragraph", null, [
      { q: "Why did the writer start a new paragraph here?" + task("...and we had cereal for breakfast.<br><br><b>After lunch,</b> we walked to the shops."),
        o: ["The time changed", "The writer got bored", "Every paragraph must be three lines"],
        s: ["Writers start new paragraphs for a reason, not because they are bored.", "Paragraphs can be any length."],
        hint: "Look at the first words of the new paragraph.",
        why: "<b>After lunch</b> moves to a new time.",
        ez: { q: "Why a new paragraph here?" + task("...and we had cereal for breakfast.<br><br><b>After lunch,</b> we walked to the shops."),
          s: ["Writers have a reason. Look at the words.", "Paragraphs can be any length."], hint: "Look at the first words.", why: "<b>After lunch</b> is a new time." },
        spicy: { o: ["A change of time signals a new stage of the day", "Paragraphs should never be more than one line", "The writer wanted to show a change of person"],
          s: ["Paragraphs can be any length.", "No new person is introduced."] } },
      { q: "Why did the writer start a new paragraph here?" + task("...and the bus finally stopped.<br><br><b>At the castle,</b> a guide met us at the gate."),
        o: ["The place changed", "The writer ran out of space", "The writer wanted to show a new time"],
        s: ["There is always space for one more line. The reason is in the words.", "Close, but the big change here is where they are."],
        hint: "Look at the first words of the new paragraph.",
        why: "<b>At the castle</b> moves to a new place.",
        ez: { q: "Why a new paragraph here?" + task("...and the bus finally stopped.<br><br><b>At the castle,</b> a guide met us at the gate."),
          s: ["There is space. The reason is in the words.", "Close. But the big change is the place."], hint: "Look at the first words.", why: "<b>At the castle</b> is a new place." },
        spicy: { o: ["A change of place moves the reader to a new setting", "A change of person introduces the guide as the main focus", "It is for dramatic effect"],
          s: ["The guide appears, but the paragraph opens with where they are.", "There is nothing dramatic here; it is a simple shift."] } },
      { q: "Why did the writer start a new paragraph here?" + task("...so that is why I like football.<br><br><b>Another thing I enjoy</b> is drawing."),
        o: ["The topic changed", "The time changed", "The writer forgot the full stop"],
        s: ["Nothing here says a new time.", "The full stop is there. The new paragraph is for something else."],
        hint: "Look at the first words of the new paragraph.",
        why: "<b>Another thing I enjoy</b> moves to a new topic: drawing.",
        ez: { q: "Why a new paragraph here?" + task("...so that is why I like football.<br><br><b>Another thing I enjoy</b> is drawing."),
          s: ["Nothing says a new time.", "The full stop is there."], hint: "Look at the first words.", why: "<b>Another thing I enjoy</b> is a new topic." },
        spicy: { o: ["A change of topic, signalled by Another thing", "A change of place, signalled by drawing", "A change of time, signalled by is"],
          s: ["Drawing is an activity, not a place.", "\"is\" does not signal any change."] } }
    ]),

    /* ---------- chunk 3: build the paragraphs (worked example, then fade) ---------- */
    { type: "learn", topic: "Build the paragraphs", title: "Watch it get grouped",
      fig: WORK,
      html: "<p>Here are some jumbled sentences:</p>" +
        task("Bonnie sniffed every tree. It was freezing. The park was busy. Frost covered the grass. She chased a pigeon. My fingers went numb.") +
        "<p><b>1. Spot the topics.</b> Some are about <b>the park</b>, some are about <b>the cold</b>.</p>" +
        "<p><b>2. Sort the sentences.</b> Park: busy, trees, pigeon. Cold: freezing, frost, fingers.</p>" +
        "<p><b>3. Topic sentence first.</b> Start each paragraph with the sentence that says what it is about:</p>" +
        task("The park was busy. Bonnie sniffed every tree. She chased a pigeon.<br><br>It was freezing. Frost covered the grass. My fingers went numb."),
      lv: { spicy: { html: "<p>Here are some jumbled sentences:</p>" +
        task("Bonnie sniffed every tree. It was the coldest morning of the year. The park was busier than usual. Frost covered the grass. She chased a pigeon, which ignored her. My fingers went numb inside my gloves.") +
        "<p><b>1. Spot the topics.</b> The park, and the cold.</p>" +
        "<p><b>2. Sort.</b> Watch the sneaky one: frost is in the park, but it is about the cold.</p>" +
        "<p><b>3. Topic sentence first</b>, the one that sums up the rest:</p>" +
        task("The park was busier than usual. Bonnie sniffed every tree. She chased a pigeon, which ignored her.<br><br>It was the coldest morning of the year. Frost covered the grass. My fingers went numb inside my gloves.") } },
      ez: { title: "Group it in 3 steps", html: "<p>1. <b>Spot</b> the topics. 2. <b>Sort</b> the sentences.</p><p>3. Put the <b>topic sentence</b> first.</p>" } },

    Q("sort", "Build the paragraphs", null, [
      { q: "<b>Step 1 is done:</b> the topics are below. Step 2: sort the sentences into the two paragraphs.",
        buckets: ["The birds we saw", "Our picnic"],
        cards: [["We saw a robin.", 0], ["A heron flew over us.", 0], ["We ate cheese sandwiches.", 1], ["The juice was too warm.", 1]],
        hint: "Birds, or food?",
        why: "The robin and the heron go together. The sandwiches and the juice go together.",
        ez: { q: "Sort the sentences into the 2 boxes.", why: "Robin and heron are birds. The rest is the picnic." },
        medium: { buckets: ["The birds we saw", "Our picnic", "The weather"],
          cards: [["We saw a robin.", 0], ["A heron flew over us.", 0], ["We ate cheese sandwiches.", 1], ["The juice was too warm.", 1], ["It was sunny all morning.", 2], ["Then it started to drizzle.", 2]] },
        spicy: { buckets: ["The birds we saw", "Our picnic", "The weather"],
          cards: [["We saw a robin.", 0], ["A gull tried to steal a crisp.", 0], ["We ate cheese sandwiches.", 1], ["The juice was too warm.", 1], ["It was sunny all morning.", 2], ["The rain made our sandwiches soggy.", 2]],
          why: "The gull is about a bird, even though it involves food. Soggy sandwiches are about what the rain did, so they go with the weather." } },
      { q: "<b>Step 1 is done:</b> the topics are below. Step 2: sort the sentences into the two paragraphs.",
        buckets: ["The games", "The prizes"],
        cards: [["We played four matches.", 0], ["We won two of them.", 0], ["Everyone got a medal.", 1], ["The best player won a ball.", 1]],
        hint: "Playing, or winning things?",
        why: "Matches and wins go together. Medals and the ball go together.",
        ez: { q: "Sort the sentences into the 2 boxes.", why: "Matches and wins are games. Medals and ball are prizes." },
        medium: { buckets: ["The games", "The prizes", "The food"],
          cards: [["We played four matches.", 0], ["We won two of them.", 0], ["Everyone got a medal.", 1], ["The best player won a ball.", 1], ["There was a burger van.", 2], ["The chips were cold.", 2]] },
        spicy: { buckets: ["The games", "The prizes", "The food"],
          cards: [["We played four matches.", 0], ["The final went to penalties.", 0], ["Everyone got a medal.", 1], ["The winners got a trophy shaped like a boot.", 1], ["There was a burger van.", 2], ["We were too nervous to eat before the final.", 2]],
          why: "Being too nervous to eat mentions the final, but the sentence is about food." } },
      { q: "<b>Step 1 is done:</b> the topics are below. Step 2: sort the sentences into the two paragraphs.",
        buckets: ["The film", "The cinema"],
        cards: [["The film was about space.", 0], ["The ending was sad.", 0], ["The seats were comfy.", 1], ["The screen was huge.", 1]],
        hint: "The story, or the building?",
        why: "Space and the ending are the film. Seats and the screen are the cinema.",
        ez: { q: "Sort the sentences into the 2 boxes.", why: "Space and the ending are the film. The rest is the cinema." },
        medium: { buckets: ["The film", "The cinema", "Getting home"],
          cards: [["The film was about space.", 0], ["The ending was sad.", 0], ["The seats were comfy.", 1], ["The screen was huge.", 1], ["We got the late bus.", 2], ["I fell asleep on the way.", 2]] },
        spicy: { buckets: ["The film", "The cinema", "Getting home"],
          cards: [["The film was about space.", 0], ["The music made the ending even sadder.", 0], ["The seats were comfy.", 1], ["The screen was so big it hurt my neck.", 1], ["We got the late bus.", 2], ["I kept thinking about the ending all the way home.", 2]],
          why: "Thinking about the ending happens on the way home, so it belongs with getting home." } }
    ]),

    Q("order", "Build the paragraphs", null, [
      { q: "<b>Steps 1 and 2 are done.</b> Step 3: put this paragraph in order, topic sentence first.",
        items: ["Our walk took us all round the park.", "First we went past the pond.", "Then we climbed the hill.", "Finally we sat on the bench."],
        hint: "Which sentence says what the whole paragraph is about?",
        why: "The topic sentence goes first, then the details in order.",
        ez: { q: "Put these in order. Topic sentence first.", hint: "Which one says what it is all about?", why: "Topic sentence first. Then the rest in order." },
        medium: { items: ["Our walk took us all round the park.", "First we went past the pond.", "Then we climbed the big hill.", "After that we fed the ducks.", "Finally we sat on the bench."] },
        spicy: { items: ["Our walk took us all round the park.", "We started at the pond, where Bonnie stared at the ducks.", "Then we climbed the hill, which took ages.", "From the top, we could see the whole town.", "Finally we sat on the bench and shared a flask of tea."] } },
      { q: "<b>Steps 1 and 2 are done.</b> Step 3: put this paragraph in order, topic sentence first.",
        items: ["Making pancakes is easy.", "First you mix the flour, egg and milk.", "Then you pour some into a hot pan.", "Finally you flip it over."],
        hint: "Which sentence sums it all up?",
        why: "Topic sentence first, then the steps in order.",
        ez: { q: "Put these in order. Topic sentence first.", hint: "Which one sums it all up?", why: "Topic sentence first. Then the steps in order." },
        medium: { items: ["Making pancakes is easy.", "First you mix the flour, egg and milk.", "Then you heat the pan.", "Next you pour some mix in.", "Finally you flip it over."] },
        spicy: { items: ["Making pancakes is easier than it looks.", "First, whisk the flour, egg and milk until smooth.", "Then heat a little oil in a pan.", "Pour in just enough mix to cover the bottom.", "Finally, flip it when the edges turn golden."] } },
      { q: "<b>Steps 1 and 2 are done.</b> Step 3: put this paragraph in order, topic sentence first.",
        items: ["Sports day was a big success.", "In the morning we did the races.", "At lunch we had a picnic.", "In the afternoon there was a tug of war."],
        hint: "Which sentence sums it all up?",
        why: "Topic sentence first, then the day in time order.",
        ez: { q: "Put these in order. Topic sentence first.", hint: "Which one sums it all up?", why: "Topic sentence first. Then the day in order." },
        medium: { items: ["Sports day was a big success.", "In the morning we did the races.", "After that we did the long jump.", "At lunch we had a picnic.", "In the afternoon there was a tug of war."] },
        spicy: { items: ["Sports day was a bigger success than anyone expected.", "The morning started with the sprints, in bright sunshine.", "By lunchtime our team was second.", "The afternoon tug of war changed everything.", "When the final scores came in, we had won by one point."] } }
    ]),

    Q("mc", "Build the paragraphs", { explain: true, fixed: true }, [
      { q: "<b>All three steps, on your own.</b> Which is the best way to split these into two paragraphs?" + nums(["Our school has a big field.", "Lunch is at 12.", "The field has two goals.", "We have pizza on Fridays."]),
        options: ["1 and 3, then 2 and 4", "1 and 2, then 3 and 4", "1, then 2, 3 and 4"], answer: 0,
        slips: { 1: "Sentence 2 is about lunch, not the field.", 2: "Sentence 3 is about the field, so it belongs with sentence 1." },
        hint: "Which sentences are about the field? Which are about food?",
        why: "Field sentences together (1 and 3), food sentences together (2 and 4).",
        ez: { q: "How would you split these into 2 paragraphs?" + nums(["Our school has a big field.", "Lunch is at 12.", "The field has two goals.", "We have pizza on Fridays."]),
          slips: { 1: "Sentence 2 is about lunch.", 2: "Sentence 3 is about the field." }, hint: "Which ones are about the field?", why: "Field is 1 and 3. Food is 2 and 4." },
        medium: { q: "<b>All three steps, on your own.</b> Which is the best way to split these into two paragraphs?" + nums(["Our school has a big field.", "Lunch is at 12.", "The field has two goals.", "We have pizza on Fridays.", "There is a running track round the edge.", "The cooks make great soup."]),
          options: ["1, 3, 5, then 2, 4, 6", "1, 2, 3, then 4, 5, 6", "1, 3, 4, then 2, 5, 6"], answer: 0,
          slips: { 1: "That splits by position, not by topic. The field and food are mixed up.", 2: "Pizza is food, and the running track is part of the field." },
          why: "Field: 1, 3, 5. Food: 2, 4, 6." },
        spicy: { q: "<b>All three steps, on your own.</b> Which split gives the clearest paragraphs?" + nums(["Our school has a big field.", "Lunch is at 12.", "The field has two goals.", "On sunny days we eat lunch on the field.", "There is a running track round the edge.", "The cooks make great soup."]),
          options: ["1, 3, 5, then 2, 4, 6", "1, 3, 4, 5, then 2, 6", "1, 2, 3, then 4, 5, 6"], answer: 0,
          slips: { 1: "Sentence 4 mentions the field, but it is about where you eat lunch.", 2: "That splits by position, not by topic." },
          why: "Sentence 4 is the sneaky one. It is about lunch, so it goes with 2 and 6." } },
      { q: "<b>All three steps, on your own.</b> Which is the best way to split these into two paragraphs?" + nums(["Jay has a bird feeder.", "Bonnie has a red ball.", "Blue tits visit it every day.", "She chews it every night."]),
        options: ["1 and 3, then 2 and 4", "1 and 2, then 3 and 4", "1, then 2, 3 and 4"], answer: 0,
        slips: { 1: "That mixes the feeder and the ball.", 2: "Sentence 3 is about the feeder, so it goes with sentence 1." },
        hint: "Which are about the feeder? Which are about the ball?",
        why: "Feeder: 1 and 3. Ball: 2 and 4.",
        ez: { q: "How would you split these into 2 paragraphs?" + nums(["Jay has a bird feeder.", "Bonnie has a red ball.", "Blue tits visit it every day.", "She chews it every night."]),
          slips: { 1: "That mixes the feeder and the ball.", 2: "Sentence 3 is about the feeder." }, hint: "Which ones are about the feeder?", why: "Feeder is 1 and 3. Ball is 2 and 4." },
        medium: { q: "<b>All three steps, on your own.</b> Which is the best way to split these into two paragraphs?" + nums(["Jay has a bird feeder.", "Bonnie has a red ball.", "Blue tits visit it every day.", "She chews it every night.", "A robin comes when it rains.", "The ball has lost its squeak."]),
          options: ["1, 3, 5, then 2, 4, 6", "1, 2, 3, then 4, 5, 6", "1, 3, 4, then 2, 5, 6"], answer: 0,
          slips: { 1: "That splits by position, not by topic.", 2: "Sentence 4 is about the ball, and sentence 5 is about the feeder." },
          why: "Feeder: 1, 3, 5. Ball: 2, 4, 6." },
        spicy: { q: "<b>All three steps, on your own.</b> Which split gives the clearest paragraphs?" + nums(["Jay has a bird feeder.", "Bonnie has a red ball.", "Blue tits visit it every day.", "Bonnie barks at the birds on the feeder.", "A robin comes when it rains.", "The ball has lost its squeak."]),
          options: ["1, 3, 5, then 2, 4, 6", "1, 3, 4, 5, then 2, 6", "1, 2, 3, then 4, 5, 6"], answer: 0,
          slips: { 1: "Sentence 4 mentions the feeder, but it is about what Bonnie does.", 2: "That splits by position, not by topic." },
          why: "Sentence 4 is about Bonnie, so it goes in her paragraph." } },
      { q: "<b>All three steps, on your own.</b> Which is the best way to split these into two paragraphs?" + nums(["[[Lk1]]", "[[Wh1]]", "[[Lk2]]", "[[Wh2]]"]),
        options: ["1 and 3, then 2 and 4", "1 and 2, then 3 and 4", "1, then 2, 3 and 4"], answer: 0,
        slips: { 1: "That mixes how it looks with where it is.", 2: "Sentence 3 describes how it looks, so it goes with sentence 1." },
        hint: "Which describe how it looks? Which say where it is?",
        why: "Looks: 1 and 3. Where: 2 and 4.",
        ez: { q: "How would you split these into 2 paragraphs?" + nums(["[[Lk1]]", "[[Wh1]]", "[[Lk2]]", "[[Wh2]]"]),
          slips: { 1: "That mixes looks and place.", 2: "Sentence 3 is about how it looks." }, hint: "Which ones say how it looks?", why: "Looks is 1 and 3. Place is 2 and 4." },
        medium: { q: "<b>All three steps, on your own.</b> Which is the best way to split these into three paragraphs?" + nums(["[[Lk1]]", "[[Wh1]]", "[[Do1]]", "[[Lk2]]", "[[Wh2]]", "[[Do2]]"]),
          options: ["1 and 4, then 2 and 5, then 3 and 6", "1 and 2, then 3 and 4, then 5 and 6", "1, 2 and 3, then 4, 5 and 6"], answer: 0,
          slips: { 1: "That splits by position, not by topic.", 2: "That puts looks, place and events all in one paragraph." },
          why: "Looks: 1 and 4. Where: 2 and 5. What happens: 3 and 6." },
        spicy: { q: "<b>All three steps, on your own.</b> Which is the best way to split these into three paragraphs?" + nums(["[[Do1]]", "[[Lk2]]", "[[Wh1]]", "[[Lk1]]", "[[Do2]]", "[[Wh2]]"]),
          options: ["2 and 4, then 3 and 6, then 1 and 5", "1 and 2, then 3 and 4, then 5 and 6", "1, 3 and 5, then 2, 4 and 6"], answer: 0,
          slips: { 1: "That splits by position, not by topic.", 2: "Taking every other sentence does not group them by topic." },
          why: "Looks: 2 and 4. Where: 3 and 6. What happens: 1 and 5. The order of paragraphs is your choice; the grouping is the skill." } }
    ]),

    /* ---------- chunk 4: plan it ---------- */
    { type: "learn", topic: "Plan your paragraphs", title: "Plan the boxes first",
      fig: PLAN,
      html: "<p>Before writing, you can <b>plan</b> your paragraphs. Write the title, then one box for each topic.</p>" +
        "<p>Then put each idea in the right box. Each box becomes a paragraph.</p>",
      lv: {
        medium: { html: "<p>Planning paragraphs first makes writing much easier. Write the title, draw a box for each topic, then drop your ideas into the boxes.</p>" +
          "<p>Then decide the <b>order</b> of the boxes. For a story or a day out, time order works. For a fact file, go from the biggest, most basic idea to the details.</p>" },
        spicy: { html: "<p>A plan is where you make the big decisions: what the paragraphs are, what goes in each, and what order they go in.</p>" +
          "<p>Most pieces need an <b>opening</b> that sets things up and an <b>ending</b> that sums up or looks forward. In between, each paragraph has one job.</p>" +
          "<p>For an argument (like <b>should we time travel?</b>) a classic plan is: introduction, reasons for, reasons against, your conclusion.</p>" } },
      ez: { html: "<p><b>Plan</b> first. Make 1 box for each topic.</p><p>Each box becomes a paragraph.</p>" } },

    Q("sort", "Plan your paragraphs", null, [
      { q: "You are planning a fact file about [[thing]]. Put each idea in the right box.",
        buckets: ["Looks", "Where"],
        cards: [["[[Lk1]]", 0], ["[[Lk2]]", 0], ["[[Wh1]]", 1], ["[[Wh2]]", 1]],
        hint: "Does it describe it, or say where it is?",
        why: "Description in one box, location in the other. Each box becomes a paragraph.",
        ez: { q: "Put each idea about [[thing]] in a box.", hint: "How it looks, or where it is?", why: "Looks in one box. Place in the other." },
        medium: { buckets: ["Looks", "Where", "What happens"],
          cards: [["[[Lk1]]", 0], ["[[Lk2]]", 0], ["[[Wh1]]", 1], ["[[Wh2]]", 1], ["[[Do1]]", 2], ["[[Do2]]", 2]],
          why: "Looks, location, events: three boxes, three paragraphs." },
        spicy: { buckets: ["Looks", "Where", "What happens"],
          cards: [["[[Lk1]]", 0], ["[[Lk2]]", 0], ["[[Wh1]]", 1], ["[[Wh2]]", 1], ["[[Do1]]", 2], ["[[Do2]]", 2]],
          why: "Looks, location, events. Now the order: most readers want to know what and where before what happens." } },
      { q: "Jay is planning a piece about robins. Put each idea in the right box.",
        buckets: ["What they look like", "What they eat"],
        cards: [["Red chest", 0], ["Brown wings", 0], ["Worms", 1], ["Berries", 1]],
        hint: "Looks, or food?",
        why: "Red chest and brown wings are looks. Worms and berries are food.",
        ez: { q: "Help Jay. Put each robin idea in a box.", why: "Chest and wings are looks. Worms and berries are food." },
        medium: { buckets: ["What they look like", "What they eat", "Where they live"],
          cards: [["Red chest", 0], ["Brown wings", 0], ["Worms", 1], ["Berries", 1], ["Gardens", 2], ["Hedges", 2]] },
        spicy: { buckets: ["What they look like", "What they eat", "Where they live", "How they behave"],
          cards: [["Red chest", 0], ["Brown wings", 0], ["Worms", 1], ["Berries", 1], ["Gardens", 2], ["Hedges", 2], ["Sing all through winter", 3], ["Chase other robins away", 3]] } },
      { q: "You are planning a piece about a day out. Put each idea in the right box.",
        buckets: ["Getting there", "At the zoo"],
        cards: [["Long train ride", 0], ["Missed our stop", 0], ["Lions sleeping", 1], ["Penguin feeding", 1]],
        hint: "Travelling, or being there?",
        why: "The train and the missed stop are getting there. Lions and penguins are at the zoo.",
        ez: { q: "Put each day out idea in a box.", why: "The train is getting there. Lions and penguins are the zoo." },
        medium: { buckets: ["Getting there", "At the zoo", "Going home"],
          cards: [["Long train ride", 0], ["Missed our stop", 0], ["Lions sleeping", 1], ["Penguin feeding", 1], ["Rain on the way back", 2], ["Fell asleep on the train", 2]] },
        spicy: { buckets: ["Opening: why we went", "At the zoo", "Ending: what I thought"],
          cards: [["It was a reward for our project", 0], ["We had waited all term", 0], ["Lions sleeping", 1], ["Penguin feeding", 1], ["Best day of the year", 2], ["I would go back for the penguins alone", 2]],
          why: "The opening sets it up, the middle tells it, the ending gives your view." } }
    ]),

    Q("order", "Plan your paragraphs", null, [
      { q: "Put these paragraph boxes in a sensible order for a piece called <b>A day at the seaside</b>.",
        items: ["Getting there", "Morning on the beach", "Lunch at the cafe", "Going home"],
        hint: "Follow the day.",
        why: "Time order: the day from start to finish.",
        ez: { q: "Put the boxes in order for <b>A day at the seaside</b>.", why: "Follow the day, start to finish." },
        medium: { items: ["Getting there", "Morning on the beach", "Lunch at the cafe", "Afternoon in the arcade", "Going home"] },
        spicy: { q: "Put these paragraph boxes in order for a piece called <b>Should we time travel?</b>",
          items: ["Introduction: what time travel would mean", "Reasons we should", "Reasons we should not", "Conclusion: what I think"],
          why: "Set it up, give both sides, then your view." } },
      { q: "Put these paragraph boxes in a sensible order for a piece called <b>The big match</b>.",
        items: ["Before kick off", "The first half", "The second half", "The final whistle"],
        hint: "Follow the match.",
        why: "Time order: the match from start to finish.",
        ez: { q: "Put the boxes in order for <b>The big match</b>.", why: "Follow the match, start to finish." },
        medium: { items: ["Before kick off", "The first half", "Half time", "The second half", "The final whistle"] },
        spicy: { q: "Put these paragraph boxes in order for a piece called <b>Should phones be allowed at lunch?</b>",
          items: ["Introduction: the question", "Reasons for", "Reasons against", "Conclusion: what I think"],
          why: "Set it up, both sides, then your view." } },
      { q: "Put these paragraph boxes in a sensible order for a piece called <b>Making our film</b>.",
        items: ["Writing the idea", "Filming", "Editing", "Showing it to the class"],
        hint: "What has to happen first?",
        why: "Time order: you cannot edit a film you have not filmed.",
        ez: { q: "Put the boxes in order for <b>Making our film</b>.", why: "You film it before you edit it." },
        medium: { items: ["Writing the idea", "Planning the shots", "Filming", "Editing", "Showing it to the class"] },
        spicy: { q: "Put these paragraph boxes in order for a piece called <b>Is it better to live in a city or the countryside?</b>",
          items: ["Introduction: the question", "Good things about cities", "Good things about the countryside", "Conclusion: where I would choose"],
          why: "Set it up, both sides, then your view." } }
    ]),

    Q("mc", "Plan your paragraphs", null, [
      { q: "Which sentence would start the <b>What they eat</b> paragraph best?",
        o: ["Robins eat worms, seeds and berries.", "Robins have red chests.", "I saw a robin yesterday."],
        s: ["That is about looks. It belongs in a different paragraph.", "That is a story about one robin, not about what robins eat."],
        hint: "It should say what the paragraph is about.",
        why: "It tells the reader straight away: this paragraph is about food.",
        ez: { q: "Which is the best start for <b>What they eat</b>?", s: ["That is about looks.", "That is about 1 robin."], hint: "It says what it is about.", why: "It tells you this part is about food." },
        spicy: { q: "Which is the best topic sentence for the <b>What they eat</b> paragraph?",
          o: ["Robins are not fussy eaters.", "Robins eat worms.", "Robins have red chests and eat worms."],
          s: ["True, but that is a detail. A topic sentence sums up the whole paragraph.", "That mixes two topics in one sentence."],
          why: "It sums up the whole paragraph, and the details (worms, seeds, berries) can follow." } },
      { q: "Which sentence would start the <b>Where it is</b> paragraph best?",
        o: ["[[Wh1]]", "[[Lk1]]", "[[Do1]]"],
        s: ["That describes how it looks.", "That is about what happens."],
        hint: "It should be about a place.",
        why: "It is about where it is, so it starts that paragraph well.",
        ez: { q: "Which is the best start for <b>Where it is</b>?", s: ["That is about looks.", "That is about what happens."], hint: "It is about a place.", why: "It says where it is." },
        spicy: { q: "Which is the best topic sentence for a paragraph about where [[thing]] is?",
          o: ["Finding [[thing]] is easier than you might think.", "[[Wh1]]", "[[Lk1]]"],
          s: ["Good detail, but a topic sentence sums up the whole paragraph.", "That is about looks, a different paragraph."],
          why: "It sums up the paragraph. The detail sentences can follow it." } },
      { q: "Which sentence would start the <b>Going home</b> paragraph best?",
        o: ["The journey home was slow.", "The penguins were funny.", "We got to the zoo at ten."],
        s: ["That is about being at the zoo.", "That is about getting there."],
        hint: "It should be about going home.",
        why: "It tells the reader the paragraph is now about going home.",
        ez: { q: "Which is the best start for <b>Going home</b>?", s: ["That is at the zoo.", "That is getting there."], why: "It says this part is about going home." },
        spicy: { q: "Which is the best topic sentence for the <b>Going home</b> paragraph?",
          o: ["The journey home felt twice as long as the journey there.", "The train was at 4.15.", "The penguins were funny, and then we went home."],
          s: ["A detail, not a summary of the paragraph.", "That mixes the zoo and going home."],
          why: "It sums up the whole paragraph and links back to the start of the day." } }
    ]),

    { type: "write", topic: "Plan your paragraphs",
      q: "Only if you fancy it: write one paragraph about one thing. Bonnie, a bird, a game, a place you know. Start with a sentence that says what it is about, then add two or three more about the same thing.",
      starters: ["This paragraph is about", "The best thing about", "First,", "Also,"],
      checklist: ["My first sentence says what it is about", "All my sentences are about the same thing"],
      ez: { q: "Only if you fancy it: write about 1 thing. Start by saying what it is." },
      minWords: 20,
      lv: { medium: { q: "Only if you fancy it: write two short paragraphs about something you know well, each with its own topic. Start each one on a new line.", minWords: 40,
          checklist: ["Each paragraph has one topic", "Each starts with a topic sentence", "The second one starts on a new line"] },
        spicy: { q: "Only if you fancy it: write the first two paragraphs of <b>Should we time travel?</b> An introduction, then reasons for. Keep each paragraph to its one job.", minWords: 70,
          checklist: ["The introduction sets up the question", "The second paragraph is only reasons for", "Each starts with a clear topic sentence"] } } }
  ],

  ez: {
    realWorld: { html: "<p>Emails, reports and news all use <b>paragraphs</b>.</p><p>Time travel? 1 box for yes, 1 for no, 1 for what you think.</p>" },
    make: { intro: "A title and 3 paragraph topics. About anything. Send it to Jay if you like." }
  },

  realWorld: {
    title: "Where you would use this",
    html: "<p>Paragraphs are everywhere: emails, reports, job applications, news stories. A reader who can see the groups can find the bit they need, and a writer who plans the groups finds writing much easier.</p>" +
      "<p>For our big question, if we could time travel, should we? A strong answer might use three boxes: one paragraph for reasons yes, one for reasons no, one for what you think.</p>",
    fig: '<svg viewBox="0 0 440 150" role="img" aria-label="Three paragraph boxes: reasons yes, reasons no, what I think, next to the time portal">' + A.portal(64, 76, 50) +
      [["Reasons yes", "#19c39a"], ["Reasons no", "#ff8a5c"], ["What I think", "#22b8e6"]].map(function(b, k){
        var x = 136 + k * 100;
        return '<rect x="' + x + '" y="40" width="90" height="76" rx="10" fill="' + b[1] + '" fill-opacity=".3" stroke="#141a33" stroke-width="2"/>' + T(x + 45, 34, "Para " + (k + 1), 12, { a: "middle", b: 1, c: "#3a4060" }) +
          wrap(b[0], 8, 2).map(function(l, j){ return T(x + 45, 72 + j * 18, l, 13, { a: "middle", b: 1 }); }).join("");
      }).join("") + '</svg>'
  },

  make: {
    title: "Make a paragraph plan card",
    intro: "A plan for a piece you might write one day: a title and three paragraph topics. About anything you like. Keep it, put it up, or send it to Jay.",
    fields: [
      { id: "title", label: "Title", ph: "Bonnie", max: 22 },
      { id: "p1", label: "Paragraph 1 is about", ph: "What she looks like", max: 30 },
      { id: "p2", label: "Paragraph 2 is about", ph: "What she likes", max: 30 },
      { id: "p3", label: "Paragraph 3 is about", ph: "Her day", max: 30 },
      { id: "name", label: "Planned by", ph: "B5", max: 20 }
    ],
    svg: function(v){
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">' +
        '<rect width="600" height="420" rx="24" fill="#fffdf6"/>' +
        '<rect x="12" y="12" width="576" height="396" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        T(36, 50, "MY PARAGRAPH PLAN", 16, { b: 1, c: "#8a5cf6" }) +
        '<rect x="36" y="64" width="528" height="58" rx="12" fill="#141a33"/>' + T(300, 103, esc(wrap(v.title, 22, 1)[0] || ""), 26, { a: "middle", b: 1, c: "#ffd23f" }) +
        [v.p1, v.p2, v.p3].map(function(p, k){
          var y = 140 + k * 76, ls = wrap(p, 26, 2);
          return '<rect x="36" y="' + y + '" width="528" height="64" rx="12" fill="' + COL[k] + '" fill-opacity=".25" stroke="#141a33" stroke-width="2"/>' +
            '<circle cx="70" cy="' + (y + 32) + '" r="20" fill="' + COL[k] + '"/>' + T(70, y + 39, String(k + 1), 20, { a: "middle", b: 1, c: "#ffffff" }) +
            ls.map(function(l, j){ return T(104, y + (ls.length > 1 ? 27 : 40) + j * 24, esc(l), 20, { b: 1 }); }).join("");
        }).join("") +
        T(36, 392, "Planned by: " + esc(wrap(v.name, 20, 1)[0] || ""), 16, { c: "#5b6180" }) +
        A.bonnie(548, 384, 0.42, "sit") +
        '</svg>';
    }
  }
};
})();
