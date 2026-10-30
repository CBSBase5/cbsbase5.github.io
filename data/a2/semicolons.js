/* Base 5 Autumn 2 activity: Semicolons and colons.
   English. Colons before lists and explanations; semicolons joining two linked sentences. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, extra){ return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (/fill=/.test(extra || "") ? "" : ' fill="#141a33"') + ' ' + (extra || "") + '>' + s + '</text>'; }
function colonMark(x, y, s, col){ return '<circle cx="' + x + '" cy="' + (y - 12 * s) + '" r="' + 8 * s + '" fill="' + col + '"/><circle cx="' + x + '" cy="' + (y + 12 * s) + '" r="' + 8 * s + '" fill="' + col + '"/>'; }
function semiMark(x, y, s, col){ return '<circle cx="' + x + '" cy="' + (y - 12 * s) + '" r="' + 8 * s + '" fill="' + col + '"/><path d="M' + (x - 7 * s) + ' ' + (y + 6 * s) + 'h' + 14 * s + 'q2 ' + 16 * s + ' ' + (-12 * s) + ' ' + 26 * s + 'q' + 6 * s + ' ' + (-10 * s) + ' ' + (-2 * s) + ' ' + (-16 * s) + 'z" fill="' + col + '"/>'; }

/* a sentence with lettered gaps: lines of text, {A} {B} {C} become markers */
function gaps(lines){
  var out = '<svg viewBox="0 0 520 ' + (40 + lines.length * 40) + '" role="img" aria-label="A sentence with gaps marked A, B and C">' +
    '<rect width="520" height="' + (40 + lines.length * 40) + '" rx="14" fill="#fffbe9"/>';
  lines.forEach(function(l, k){
    out += '<text x="24" y="' + (48 + k * 40) + '" ' + F + ' font-size="18" fill="#141a33">' +
      l.replace(/\{([A-C])\}/g, ' <tspan font-weight="700" fill="#c0392b">[$1]</tspan> ') + '</text>';
  });
  return out + '</svg>';
}

/* colon: here comes a list */
var COLON = '<svg viewBox="0 0 520 220" role="img" aria-label="A sentence, then a colon, then three list items">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  '<rect x="16" y="66" width="200" height="74" rx="12" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
  T(30, 96, "[[Who]]", 14, 'font-weight="700"') + T(30, 122, "packed three things", 14) +
  colonMark(244, 103, 1.1, "#c0392b") +
  [0, 1, 2].map(function(k){
    var y = 30 + k * 56;
    return '<path d="M258 103L300 ' + (y + 20) + '" stroke="#141a33" stroke-width="2" stroke-opacity=".5"/>' +
      '<rect x="300" y="' + y + '" width="200" height="40" rx="10" fill="' + ["#ffd23f", "#9be3c6", "#bfe6ff"][k] + '" stroke="#141a33" stroke-width="2"/>' +
      T(400, y + 26, "[[item" + (k + 1) + "]]", 14, 'text-anchor="middle" font-weight="700"');
  }).join("") +
  T(16, 196, "Before the colon: a full sentence. After it: the list.", 14) +
  A.egg(A.bird(486, 196, 0.6, "#3a8fd6"), "Jay's list of favourite things: birds, Bonnie and a well placed colon.") +
  '</svg>';

/* colon: here is why */
var WHY = '<svg viewBox="0 0 520 200" role="img" aria-label="A statement, a colon, then the explanation">' +
  '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  '<rect x="16" y="60" width="210" height="80" rx="12" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
  T(121, 94, "The trip was", 15, 'text-anchor="middle"') + T(121, 118, "cancelled", 15, 'text-anchor="middle"') +
  colonMark(258, 100, 1.1, "#c0392b") +
  '<rect x="290" y="60" width="214" height="80" rx="12" fill="#ffd23f" fill-opacity=".6" stroke="#141a33" stroke-width="2.5"/>' +
  T(397, 94, "[[Thing]]", 15, 'text-anchor="middle" font-weight="700"') + T(397, 118, "had broken down.", 15, 'text-anchor="middle"') +
  T(121, 44, "What happened", 14, 'text-anchor="middle" font-weight="700" fill="#5b6180"') + T(397, 44, "Why", 14, 'text-anchor="middle" font-weight="700" fill="#5b6180"') +
  T(260, 180, "Test: could you say \"because\" instead? Then a colon works.", 13, 'text-anchor="middle"') +
  '</svg>';

/* semicolon: a bridge between two full sentences */
var SEMI = '<svg viewBox="0 0 520 220" role="img" aria-label="Two full sentences joined by a semicolon">' +
  '<rect width="520" height="220" rx="16" fill="#eef3fb"/>' +
  '<rect x="16" y="50" width="200" height="80" rx="12" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
  T(116, 84, "It was getting", 15, 'text-anchor="middle"') + T(116, 108, "dark", 15, 'text-anchor="middle"') +
  '<path d="M216 120q44 -46 88 0" fill="none" stroke="#8a5cf6" stroke-width="5"/>' +
  semiMark(260, 92, 1.1, "#8a5cf6") +
  '<rect x="304" y="50" width="200" height="80" rx="12" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
  T(404, 84, "[[Who]]", 15, 'text-anchor="middle" font-weight="700"') + T(404, 108, "wanted to go home", 15, 'text-anchor="middle"') +
  '<path d="M80 150l10 10 18 -20" fill="none" stroke="#1f9d63" stroke-width="4"/>' + T(116, 160, "full sentence", 13) +
  '<path d="M370 150l10 10 18 -20" fill="none" stroke="#1f9d63" stroke-width="4"/>' + T(406, 160, "full sentence", 13) +
  T(260, 200, "Two full sentences, closely linked: a semicolon can join them.", 13, 'text-anchor="middle"') +
  A.egg(A.bonnie(470, 30, 0.38, "sit"), "A semicolon is a full stop with a little tail. Bonnie has no tail at all. Outrageous.") +
  '</svg>';

/* the three tools */
var TOOLS = '<svg viewBox="0 0 520 200" role="img" aria-label="Three punctuation tools: full stop, colon and semicolon">' +
  '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  [["Full stop", "The end.", "#ffd23f"], ["Colon", "Here it comes", "#ff8fb1"], ["Semicolon", "Joins two", "#bfa8ff"]].map(function(t, k){
    var x = 20 + k * 166;
    var mark = k === 0 ? '<circle cx="' + (x + 72) + '" cy="88" r="9" fill="#141a33"/>' : k === 1 ? colonMark(x + 72, 76, 1, "#141a33") : semiMark(x + 72, 76, 1, "#141a33");
    return '<rect x="' + x + '" y="20" width="146" height="160" rx="14" fill="' + t[2] + '" fill-opacity=".55" stroke="#141a33" stroke-width="2.5"/>' + mark +
      T(x + 73, 136, t[0], 15, 'text-anchor="middle" font-weight="700"') + T(x + 73, 160, t[1], 13, 'text-anchor="middle"');
  }).join("") + '</svg>';

/* a list with commas inside the items */
var LISTS = '<svg viewBox="0 0 520 230" role="img" aria-label="Two versions of a list: A with commas only, B with semicolons between the places">' +
  '<rect width="520" height="230" rx="16" fill="#fffbe9"/>' +
  '<rect x="16" y="16" width="488" height="90" rx="10" fill="#fff" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
  T(30, 42, "Version A", 14, 'font-weight="700"') +
  T(30, 68, "We visited Bath, in the west, York, in the north,", 15) + T(30, 92, "and Rye, on the coast.", 15) +
  '<rect x="16" y="120" width="488" height="90" rx="10" fill="#fff" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
  T(30, 146, "Version B", 14, 'font-weight="700"') +
  '<text x="30" y="172" ' + F + ' font-size="15" fill="#141a33">We visited Bath, in the west<tspan font-weight="700" fill="#8a5cf6">;</tspan> York, in the north<tspan font-weight="700" fill="#8a5cf6">;</tspan></text>' +
  T(30, 196, "and Rye, on the coast.", 15) +
  '</svg>';

(window.A2PACKS = window.A2PACKS || {})["semicolons"] = {
  a2: true,
  id: "a2-semicolons",
  title: "Semicolons and colons",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "A colon says \"here it comes\". A semicolon joins two sentences that belong together.",
  blurb: "Colons before lists and explanations, and semicolons that join two linked sentences. Four short chunks, then a punctuation card to make at the end.",
  note: "Colons and semicolons: what each one does and when to pick it. Four five minute chunks and a punctuation card at the end. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Signpost", line: "Signpost: short sentences, spotting what each mark does." },
    { id: "medium", name: "Link", line: "Link: colons for lists and explanations, semicolons to join." },
    { id: "spicy", name: "Architect", line: "Architect: tricky choices, comma splices and lists with commas inside." }
  ],
  themes: {
    time: { name: "Time travel", w: { who: "the time traveller", place: "ancient Rome", thing: "the time machine", item1: "a torch", item2: "a phrase book", item3: "spare batteries" } },
    football: { name: "Football", w: { who: "the striker", place: "the away ground", thing: "the team bus", item1: "boots", item2: "shin pads", item3: "a water bottle" } },
    horror: { name: "Horror", w: { who: "the night porter", place: "the empty hotel", thing: "the lift", item1: "a torch", item2: "a bunch of keys", item3: "a flask of tea" } },
    fishing: { name: "Fishing", w: { who: "the angler", place: "the lake", thing: "the boat", item1: "a rod", item2: "a landing net", item3: "a tub of bait" } },
    music: { name: "Music", w: { who: "the singer", place: "the theatre", thing: "the curtain", item1: "a script", item2: "throat sweets", item3: "a costume" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  ez: {
    realWorld: { html: "<p>Colons and semicolons help writing sound clear and sure.</p><p>Letters from 200 years ago are full of semicolons!</p>" },
    make: { intro: "Your own sentence for each mark." }
  },
  startFig: TOOLS,
  steps: [

    /* ---------- chunk 1: colon before a list ---------- */
    { type: "learn", topic: "Colon: here comes a list", title: "A colon says: here it comes",
      fig: COLON,
      html: "<p>A <b>colon</b> is two dots, one on top of the other ( : ). One of its jobs is to introduce a <b>list</b>.</p>" +
        "<p class=\"a2task\">[[Who]] packed three things: [[item1]], [[item2]] and [[item3]].</p>" +
        "<p>The part <b>before</b> the colon makes sense on its own: \"[[Who]] packed three things.\" The colon is like a drum roll. Here they are.</p>",
      ez: { html: "<p>A <b>colon</b> can mean: here comes a list.</p><p class=\"a2task\">[[Who]] packed three things: [[item1]], [[item2]] and [[item3]].</p>" },
      lv: {
        mild: { html: "<p>This is a <b>colon</b> ( : ). It is two dots, one on top of the other.</p>" +
          "<p>A colon can mean <b>here comes a list</b>.</p>" +
          "<p class=\"a2task\">[[Who]] packed three things: [[item1]], [[item2]] and [[item3]].</p>" +
          "<p>The colon comes just <b>before</b> the list starts.</p>" },
        spicy: { html: "<p>A <b>colon</b> ( : ) introduces something: a list, an explanation or a reveal.</p>" +
          "<p class=\"a2task\">[[Who]] packed three things: [[item1]], [[item2]] and [[item3]].</p>" +
          "<p>In careful writing, the part before the colon is a <b>complete sentence</b> on its own. \"[[Who]] packed: [[item1]]...\" breaks that rule, because \"[[Who]] packed\" leaves you hanging. Exam markers notice.</p>" +
          "<p>Inside the list, the items are separated by commas, with \"and\" before the last one.</p>" } } },

    { type: "mc", topic: "Colon: here comes a list",
      q: "Where should the colon go?",
      fig: gaps(["[[Who]] {A} needed {B} three things", "{C} [[item1]], [[item2]] and [[item3]]."]),
      options: ["Gap A", "Gap B", "Gap C"],
      answer: 2, fixed: true,
      slips: { 0: "Just after the name, the sentence has hardly started. The colon goes right before the list.", 1: "\"[[Who]] needed\" does not make sense on its own yet. Keep going until the list starts." },
      hint: "Find the place just before the list begins.",
      why: "\"[[Who]] needed three things\" makes sense on its own, then the colon brings in the list.",
      ez: { slips: { 0: "Too early. Go to just before the list.", 1: "Keep going. Find where the list starts." }, hint: "Just before the list.", why: "Just before the list: <b>Gap C</b>." },
      lv: { spicy: {
        fig: gaps(["For the trip to [[place]], [[who]] needed {A}", "three things {B} [[item1]], [[item2]] {C}", "and [[item3]]."]),
        answer: 1,
        slips: { 0: "\"[[Who]] needed\" leaves you hanging: needed what? The part before a colon should be complete.", 2: "A colon inside the list would split it in two. Items are separated by commas." },
        why: "\"For the trip to [[place]], [[who]] needed three things\" is complete, so the colon goes at gap B, just before the list." } } },

    { type: "sort", topic: "Colon: here comes a list",
      q: "Is the colon in a good place? Sort them.",
      buckets: ["Colon in a good place", "Colon in an odd place"],
      cards: [["[[Who]] packed three things: [[item1]], [[item2]] and [[item3]].", 0], ["The menu had two choices: soup or salad.", 0], ["My: favourite colour is green.", 1], ["The bus: was late again.", 1]],
      hint: "Does the part before the colon make sense on its own? Does a list or explanation come after?",
      why: "A good colon comes after a complete idea and before the list. \"My:\" and \"The bus:\" chop the sentence in half.",
      ez: { hint: "Does a list come after the colon?", why: "A good colon comes just before the list." },
      lv: {
        medium: { cards: [["[[Who]] packed three things: [[item1]], [[item2]] and [[item3]].", 0], ["The menu had two choices: soup or salad.", 0], ["My: favourite colour is green.", 1], ["The bus: was late again.", 1], ["We saw three animals: a fox, an owl and a deer.", 0], ["I went to: the shop.", 1]] },
        spicy: { cards: [["You will need the following: a pen, a ruler and a rubber.", 0], ["The kit includes: a pen, a ruler and a rubber.", 1], ["[[Who]] packed three things: [[item1]], [[item2]] and [[item3]].", 0], ["We visited: Leeds, York and Hull.", 1], ["Only two people turned up: Jay and Bonnie.", 0]],
          why: "\"You will need the following\" is complete, so a colon fits. \"The kit includes\" and \"We visited\" need their object straight away: no colon. (Bonnie counts as a person here. She would insist.)" } } },

    { type: "mc", topic: "Colon: here comes a list",
      q: "Which mark fits the gap?<span class=\"a2task\" style=\"display:block\">[[Who]] had three jobs ___ check [[thing]], lock up and switch off the lights.</span>",
      options: ["colon ( : )", "full stop ( . )", "question mark ( ? )"],
      answer: 0,
      slips: { 1: "A full stop would leave \"check [[thing]], lock up...\" stranded as a fragment.", 2: "It is not a question. Something is being introduced." },
      hint: "What comes after the gap?",
      why: "A list of jobs follows, so a colon introduces it.",
      ez: { slips: { 1: "A full stop leaves the list on its own.", 2: "It is not a question." }, why: "A list comes next. So, a <b>colon</b>." },
      lv: { spicy: { options: ["colon ( : )", "semicolon ( ; )", "comma ( , )"],
        slips: { 1: "A semicolon needs a full sentence after it. \"check..., lock up and switch off\" is a list.", 2: "A comma would run the list into the sentence. A colon announces it." },
        why: "The first part is complete, and a list follows: colon." } } },

    /* ---------- chunk 2: colon before an explanation ---------- */
    { type: "learn", topic: "Colon: here is why", title: "A colon can explain or reveal",
      fig: WHY,
      html: "<p>A colon can also bring in an <b>explanation</b>. The second part tells you more about the first.</p>" +
        "<p class=\"a2task\">The trip was cancelled: [[thing]] had broken down.</p>" +
        "<p>Test: could you say <b>\"because\"</b> or <b>\"and here it is\"</b> instead? \"The trip was cancelled because [[thing]] had broken down.\" Yes. So a colon works.</p>",
      ez: { html: "<p>A colon can also mean: <b>here is why</b>.</p><p class=\"a2task\">The trip was cancelled: [[thing]] had broken down.</p>" },
      lv: {
        mild: { html: "<p>A colon can also mean <b>here is why</b>.</p>" +
          "<p class=\"a2task\">The trip was cancelled: [[thing]] had broken down.</p>" +
          "<p>The part after the colon tells you <b>why</b> the trip was cancelled.</p>" },
        spicy: { html: "<p>A colon can introduce an <b>explanation</b> or a <b>reveal</b>. The second part unpacks the first.</p>" +
          "<p class=\"a2task\">The trip was cancelled: [[thing]] had broken down.</p>" +
          "<p class=\"a2task\">There was only one person who could fix it: Jay.</p>" +
          "<p>The second one is a <b>reveal</b>: the colon makes you wait a beat, then delivers the answer. Writers use this for emphasis and suspense. The \"because\" test still helps for explanations; for reveals, try \"and that was\".</p>" } } },

    { type: "sort", topic: "Colon: here is why",
      q: "What does each colon bring in? Sort them.",
      buckets: ["A list", "An explanation or reveal"],
      cards: [["We packed three things: [[item1]], [[item2]] and [[item3]].", 0], ["[[Who]] was soaked: it had rained all day.", 1], ["The shop sold two flavours: mint and lemon.", 0], ["Bonnie had one wish: a walk.", 1]],
      hint: "Is it several things in a row, or the reason or answer?",
      why: "Lists name several things. Explanations give the why; reveals give the answer.",
      ez: { q: "A list, or a reason? Sort them.", hint: "Lots of things, or the reason?", why: "Lists name things. The others give the why." },
      lv: {
        medium: { cards: [["We packed three things: [[item1]], [[item2]] and [[item3]].", 0], ["[[Who]] was soaked: it had rained all day.", 1], ["The shop sold two flavours: mint and lemon.", 0], ["Bonnie had one wish: a walk.", 1], ["The match was off: the pitch had flooded.", 1], ["The class had three pets: a fish, a hamster and a stick insect.", 0]] },
        spicy: { cards: [["Only one thing could fix this: tea.", 1], ["The kit list was short: a map, a whistle and a coat.", 0], ["[[Who]] froze: [[thing]] had gone.", 1], ["Three rules applied: no running, no shouting, no goblins.", 0], ["The answer was obvious: nobody had locked the door.", 1]],
          why: "A single item can still be a reveal (\"tea\"). A list has two or more items in a row. The rest explain why something happened." } } },

    { type: "mc", topic: "Colon: here is why",
      q: "Which ending fits best after the colon?<span class=\"a2task\" style=\"display:block\">[[Who]] stopped dead: ...</span>",
      options: ["...[[thing]] had vanished.", "...slowly and quietly.", "...and then."],
      answer: 0,
      slips: { 1: "\"slowly and quietly\" does not explain why they stopped. After this colon we need the reason.", 2: "\"and then\" goes nowhere. The colon promises an explanation." },
      hint: "What would make someone stop dead?",
      why: "The colon promises a reason. \"[[Thing]] had vanished\" delivers it.",
      ez: { slips: { 1: "That does not say why they stopped.", 2: "And then goes nowhere." }, why: "It gives the <b>reason</b>. [[Thing]] had vanished!" },
      lv: { spicy: { q: "Which sentence uses a colon to build suspense best?",
        options: ["The lights flickered, the door creaked, and then we saw it: a tiny, very fluffy poodle.", "The lights flickered: and the door creaked.", "We saw: a poodle.", "The poodle: was tiny and fluffy."],
        slips: { 1: "A colon before \"and\" does not introduce anything. It just interrupts.", 2: "\"We saw\" is not complete without what was seen, so the colon chops it.", 3: "This colon splits the subject from its verb." },
        hint: "Which one builds up, pauses, then reveals?",
        why: "The build up, the pause of the colon, then the reveal. (It was Bonnie. Of course it was.)" } } },

    { type: "match", topic: "Colon: here is why",
      q: "Match each start to what comes after its colon.",
      pairs: [["The match was called off:", "...the pitch was flooded."], ["I know what to pack:", "...[[item1]], [[item2]] and [[item3]]."], ["There was only one way out:", "...the window."], ["[[Who]] could not sleep:", "...the noise was far too loud."]],
      hint: "Read each pair out loud with a pause at the colon.",
      why: "Each second part explains, lists or reveals what the first part set up.",
      ez: { q: "Match each start to its ending.", hint: "Pause at the colon.", why: "The end gives a list, a reason or a reveal." },
      lv: {
        mild: { pairs: [["The match was called off:", "...the pitch was flooded."], ["I know what to pack:", "...[[item1]], [[item2]] and [[item3]]."], ["There was only one way out:", "...the window."]] },
        spicy: { pairs: [["The evidence was clear:", "...the footprints led straight to the kitchen."], ["Jay had one weakness:", "...birds."], ["The plan had a flaw:", "...nobody had checked the weather."], ["Three cities, three weeks:", "...Rome, Paris and Oslo."]],
          why: "Explanation, reveal, explanation, list. In each, the part before the colon sets something up and the part after pays it off." } } },

    /* ---------- chunk 3: semicolons ---------- */
    { type: "learn", topic: "Semicolon: two sentences, one idea", title: "A semicolon joins two linked sentences",
      fig: SEMI,
      html: "<p>A <b>semicolon</b> ( ; ) is a full stop with a little tail. It joins <b>two full sentences</b> that are closely linked.</p>" +
        "<p class=\"a2task\">It was getting dark; [[who]] wanted to go home.</p>" +
        "<p>Test: cover the semicolon. Is each half a sentence on its own? \"It was getting dark.\" Yes. \"[[Who]] wanted to go home.\" Yes. They are about the same moment, so a semicolon can join them.</p>",
      ez: { html: "<p>A <b>semicolon</b> joins <b>two sentences</b> that go together.</p><p class=\"a2task\">It was getting dark; [[who]] wanted to go home.</p>" },
      lv: {
        mild: { html: "<p>This is a <b>semicolon</b> ( ; ). It is a dot with a little tail under it.</p>" +
          "<p>It can join <b>two sentences</b> that go together.</p>" +
          "<p class=\"a2task\">It was getting dark; [[who]] wanted to go home.</p>" +
          "<p>\"It was getting dark.\" is a sentence. \"[[Who]] wanted to go home.\" is a sentence. The semicolon joins them into one.</p>" },
        spicy: { html: "<p>A <b>semicolon</b> ( ; ) joins two <b>independent clauses</b> (each could be a sentence) that are closely related.</p>" +
          "<p class=\"a2task\">It was getting dark; [[who]] wanted to go home.</p>" +
          "<p>Watch for the <b>comma splice</b>: \"It was getting dark, [[who]] wanted to go home.\" A comma on its own is not strong enough to join two sentences. Fix it with a full stop, a semicolon, or a joining word (\"so\", \"and\").</p>" +
          "<p>Semicolons also pair well with words like <b>however</b> and <b>therefore</b>: \"It rained; however, the trip went ahead.\"</p>" } } },

    { type: "mc", topic: "Semicolon: two sentences, one idea", explain: true,
      q: "Where should the semicolon go?",
      fig: gaps(["[[Place]] was silent {A} nobody {B} had", "arrived {C} yet."]),
      options: ["Gap A", "Gap B", "Gap C"],
      answer: 0, fixed: true,
      slips: { 1: "\"nobody had arrived yet\" belongs together. Splitting it leaves two halves that are not sentences.", 2: "\"yet\" on its own is not a sentence. Both halves must stand alone." },
      hint: "Find the place where both halves would make a full sentence.",
      why: "\"[[Place]] was silent.\" and \"Nobody had arrived yet.\" are both full sentences, so the semicolon goes at gap A.",
      ez: { slips: { 1: "Nobody had arrived yet goes together.", 2: "Yet is not a sentence on its own." }, hint: "Both halves need to be sentences.", why: "Both halves are sentences: <b>Gap A</b>." },
      lv: { spicy: {
        fig: gaps(["[[Who]] waited for an hour {A} then gave", "up {B} [[thing]] was never coming {C} after all."]),
        answer: 1,
        slips: { 0: "After gap A, \"then gave up\" has no subject, so it is not a full sentence.", 2: "\"after all\" is not a sentence on its own." },
        why: "\"[[Who]] waited for an hour, then gave up\" and \"[[Thing]] was never coming after all\" are both complete, so gap B." } } },

    { type: "sort", topic: "Semicolon: two sentences, one idea",
      q: "Could a semicolon join these two halves? Sort them.",
      buckets: ["Yes: both halves are full sentences", "No: one half is not a sentence"],
      cards: [["It was cold / we lit a fire", 0], ["Because it was cold / we lit a fire", 1], ["The bus was late / [[who]] walked instead", 0], ["After the match / everyone went home", 1]],
      hint: "Cover one half. Could the other half be a sentence by itself?",
      why: "\"Because it was cold\" and \"After the match\" cannot stand alone, so no semicolon there. A comma would do.",
      ez: { q: "Is each half a full sentence? Sort them.", hint: "Cover one half. Is the other a sentence?", why: "Because and After halves cannot stand alone." },
      lv: {
        spicy: { cards: [["It was cold / we lit a fire", 0], ["Because it was cold / we lit a fire", 1], ["Some people love horror films / others cannot watch them", 0], ["Although the map was old / it was still useful", 1], ["The tickets sold out / however, a few returns appeared", 0], ["Running for the bus / [[who]] dropped [[item1]]", 1]],
          why: "\"Because\", \"Although\" and \"Running for the bus\" open halves that cannot stand alone, so they need a comma, not a semicolon." } } },

    { type: "mc", topic: "Semicolon: two sentences, one idea",
      q: "Which sentence uses the semicolon well?",
      options: ["It was raining; we stayed inside.", "We stayed; inside because it was raining.", "It was; raining so we stayed inside."],
      answer: 0,
      slips: { 1: "\"We stayed\" and \"inside because it was raining\" are not two full sentences. The semicolon splits it oddly.", 2: "\"It was\" is not a full sentence on its own." },
      hint: "Cover the semicolon. Is each side a sentence?",
      why: "\"It was raining.\" and \"We stayed inside.\" are both sentences, and they are linked.",
      ez: { slips: { 1: "Both sides need to be sentences.", 2: "It was is not a full sentence." }, why: "Both sides are sentences. They go together." },
      lv: {
        medium: { options: ["The lights went out; everyone screamed.", "The lights went out; and everyone screamed.", "When the lights went out; everyone screamed."],
          slips: { 1: "With \"and\" you do not need a semicolon. Use one or the other.", 2: "\"When the lights went out\" cannot stand alone, so a comma fits, not a semicolon." },
          hint: "Cover the semicolon. Is each side a full sentence, with no joining word?",
          why: "\"The lights went out.\" \"Everyone screamed.\" Two full, linked sentences: a semicolon joins them." },
        spicy: { q: "Which one is a comma splice that needs fixing?",
          options: ["The map was old, it was still useful.", "The map was old, but it was still useful.", "Although the map was old, it was still useful.", "The map was old; however, it was still useful."],
          slips: { 1: "\"but\" does the joining, so the comma is fine.", 2: "\"Although the map was old\" cannot stand alone, so a comma is right here.", 3: "That is a semicolon with \"however\": a neat fix, not a splice." },
          hint: "Look for two full sentences held together by only a comma.",
          why: "\"The map was old\" and \"it was still useful\" are both sentences, joined by just a comma. Fix it with a semicolon, a full stop, or \"but\"." } } },

    /* ---------- chunk 4: choosing ---------- */
    { type: "learn", topic: "Choose your mark", title: "Three tools, three jobs",
      fig: TOOLS,
      html: "<p><b>Full stop</b>: ends a sentence.</p>" +
        "<p><b>Colon</b>: here it comes. A list, an explanation or a reveal follows.</p>" +
        "<p><b>Semicolon</b>: joins two full sentences that are closely linked.</p>" +
        "<p>Quick check: if what follows is a list or an answer, try a colon. If what follows is another full sentence about the same thing, try a semicolon.</p>",
      ez: { html: "<p><b>Full stop</b>: the end.</p><p><b>Colon</b>: a list, or why. <b>Semicolon</b>: joins two sentences.</p>" },
      lv: {
        mild: { html: "<p><b>Full stop</b>: the end of a sentence.</p>" +
          "<p><b>Colon</b>: here comes a list, or here is why.</p>" +
          "<p><b>Semicolon</b>: joins two sentences that go together.</p>" },
        spicy: { fig: LISTS,
          html: "<p>One more job for the semicolon: <b>tidying a complicated list</b>. When the items already contain commas, semicolons separate the items so the reader does not get lost.</p>" +
            "<p>Compare the two versions. In B you can see at once that there are three places.</p>" +
            "<p>Recap: <b>colon</b> introduces (list, explanation, reveal); <b>semicolon</b> joins two linked sentences, or separates list items that have commas inside.</p>" } } },

    { type: "mc", topic: "Choose your mark",
      q: "Which mark fits the gap?<span class=\"a2task\" style=\"display:block\">[[Who]] had only one fear ___ the dark.</span>",
      options: ["colon ( : )", "semicolon ( ; )", "comma ( , )"],
      answer: 0,
      slips: { 1: "\"the dark\" is not a full sentence, so a semicolon cannot join it.", 2: "A comma is too weak here. The colon makes you wait, then reveals the fear." },
      hint: "Is what follows a full sentence, or an answer?",
      why: "\"the dark\" is a reveal, not a sentence: colon.",
      ez: { hint: "A full sentence, or an answer?", why: "The dark is a reveal. So, a <b>colon</b>." },
      lv: { mild: { options: ["colon ( : )", "semicolon ( ; )", "question mark ( ? )"],
        slips: { 1: "\"the dark\" is not a full sentence, so a semicolon does not fit.", 2: "It is not a question." } } } },

    { type: "mc", topic: "Choose your mark", explain: true,
      q: "Which fits the gap?<span class=\"a2task\" style=\"display:block\">It was very late ___ the streets were empty.</span>",
      options: ["semicolon ( ; )", "comma ( , )", "no mark at all"],
      answer: 0,
      slips: { 1: "A comma on its own cannot join two full sentences. That mistake is called a comma splice.", 2: "Without a mark the two sentences crash into each other." },
      hint: "Are both halves full sentences?",
      why: "\"It was very late.\" and \"The streets were empty.\" are both full sentences, closely linked: a semicolon joins them.",
      ez: { slips: { 1: "A comma cannot join two sentences.", 2: "The two sentences crash together." }, why: "Two full sentences. So, a <b>semicolon</b>." },
      lv: { spicy: { q: "Which version of the list is clearer, and why?",
        fig: LISTS,
        options: ["Version B: the semicolons show where each place ends.", "Version A: fewer kinds of punctuation is always clearer.", "Both are equally clear."],
        slips: { 1: "With commas everywhere, it is hard to tell if \"in the west\" is a separate place.", 2: "In A, a reader could count five or six items. B shows exactly three." },
        hint: "Count the places in each version. Which is quicker to count?",
        why: "When list items contain commas, semicolons mark the big breaks between items." } } },

    { type: "multi", topic: "Choose your mark",
      q: "Pick <b>all</b> the sentences that are punctuated well.",
      options: ["[[Who]] packed three things: [[item1]], [[item2]] and [[item3]].", "It was late; the streets were empty.", "The film was: really scary.", "I like; pizza and chips."],
      answers: [0, 1],
      hint: "Colon before a list or explanation. Semicolon between two full sentences.",
      why: "The first introduces a list with a colon. The second joins two full sentences. \"was:\" and \"like;\" chop sentences in half.",
      ez: { hint: "Colon before a list. Semicolon between sentences.", why: "The first two. The others chop a sentence in half." },
      lv: { spicy: { options: ["Only one thing was missing: the key.", "We waited for ages, nobody came.", "The bus was late; however, we still made it.", "We visited Leeds, a busy city; Whitby, a seaside town; and Hull.", "Because it rained; we stayed in."],
        answers: [0, 2, 3],
        why: "A colon reveal, a semicolon with however, and semicolons tidying a list. \"We waited for ages, nobody came\" is a comma splice, and \"Because it rained\" cannot stand alone." } } },

    { type: "write", topic: "Choose your mark",
      q: "Your turn, if you like. Write a short travel diary entry (three or four sentences) about a real trip or a time travel one. Try to use <b>one colon</b> and <b>one semicolon</b>. Jay would love to read it.",
      starters: ["I packed three things:", "It was getting dark;", "There was only one problem:"],
      checklist: ["I used a colon before a list or an explanation", "I used a semicolon between two linked full sentences", "Each side of my semicolon makes sense on its own"],
      minWords: 30,
      ez: { q: "Only if you like: write a list with a colon." },
      lv: {
        mild: { q: "Your turn, if you like. Write one sentence with a colon before a list, like \"I packed three things: ...\". Add a semicolon sentence too if you fancy it.",
          minWords: 10, checklist: ["I used a colon before a list", "My list has commas and \"and\""] },
        spicy: { q: "Your turn, if you like. Write a short travel diary entry (four or five sentences) about a real trip or a time travel one. Use a colon for a reveal, a semicolon to join two sentences, and, if you fancy a challenge, a list that needs semicolons.",
          minWords: 45,
          checklist: ["I used a colon to reveal or explain", "I used a semicolon between two linked full sentences", "I avoided comma splices", "Optional: a list with semicolons between items that contain commas"] } } }
  ],

  realWorld: {
    title: "Small marks, big control",
    html: "<p>Writers use colons and semicolons to control how a reader moves through a sentence: a pause, a drum roll, a link. In reports, applications and exam answers they make writing sound precise and confident.</p>" +
      "<p>For our big question: letters written 200 years ago are full of semicolons. If we could time travel and read over a writer's shoulder, we would see them everywhere. Should we bring them back into fashion, or did people overdo it?</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to a time portal, with a colon and a semicolon">' + A.portal(70, 75, 54) + A.jay(220, 52, 0.8, "wink") +
      A.bubble(276, 8, 132, 52, "Pause; then\nreveal: this.", 282) + '</svg>'
  },

  make: {
    title: "Make a punctuation card",
    intro: "Your own example of each mark, to keep on the wall or send to Jay.",
    fields: [
      { id: "colon", label: "A sentence with a colon", ph: "I packed three things: a torch, a map and a snack.", max: 90 },
      { id: "semi", label: "A sentence with a semicolon", ph: "It was getting dark; we headed home.", max: 90 },
      { id: "name", label: "Punctuation expert", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      function e(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n){ if(cur.trim()) out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, 3).map(function(l){ return l.length > n ? l.slice(0, n - 1) + "." : l; }); }
      function lines(arr, x, y){ return arr.map(function(l, k){ return '<text x="' + x + '" y="' + (y + k * 26) + '" font-family="Verdana,Arial,sans-serif" font-size="19" font-weight="700" fill="#141a33">' + e(l) + '</text>'; }).join(""); }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#fffbe9"/>' +
        '<rect x="14" y="14" width="572" height="372" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        '<text x="40" y="58" font-family="Verdana,Arial,sans-serif" font-size="20" font-weight="700" fill="#c0392b" letter-spacing="3">PAUSE AND LINK</text>' +
        '<rect x="34" y="80" width="532" height="120" rx="14" fill="#ff8fb1" fill-opacity=".3"/>' +
        colonMark(70, 140, 1.4, "#c0392b") + lines(wrap(v.colon, 40), 104, 118) +
        '<rect x="34" y="216" width="532" height="120" rx="14" fill="#bfa8ff" fill-opacity=".35"/>' +
        semiMark(70, 270, 1.4, "#6a3fd0") + lines(wrap(v.semi, 40), 104, 254) +
        '<text x="40" y="368" font-family="Verdana,Arial,sans-serif" font-size="16" fill="#5b6180">By: ' + e(String(v.name || "").slice(0, 24)) + '</text>' +
        '</svg>';
    }
  }
};
})();
