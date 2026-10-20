/* Base 5 Autumn 2 activity: Punctuation with purpose.
   English. Choosing punctuation to make meaning clear and to create
   effects: ellipsis, exclamation and question marks, colons,
   semicolons and brackets. ASCII only. */
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

/* ---------- pictures ---------- */
/* three marks and what they do */
var MARKS = '<svg viewBox="0 0 520 220" role="img" aria-label="Three marks: an ellipsis builds suspense, an exclamation mark shows surprise, a question mark makes the reader wonder">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  [["...", "Suspense", "or trailing off", "#8a5cf6"], ["!", "Surprise", "or strong feeling", "#ff5d8f"], ["?", "Wonder", "pulls the reader in", "#22b8e6"]].map(function(m, k){
    var x = 84 + k * 156;
    return '<rect x="' + (x - 70) + '" y="22" width="140" height="176" rx="16" fill="' + m[3] + '" fill-opacity=".25" stroke="#141a33" stroke-width="2.5"/>' +
      T(x, 106, m[0], 64, { b: 1, a: "middle", c: m[3] }) +
      T(x, 152, m[1], 17, { b: 1, a: "middle" }) + T(x, 176, m[2], 13, { a: "middle", c: "#5b6180" });
  }).join("") +
  A2ART.egg(A2ART.bird(492, 196, 0.55, "#ffd23f"), "Tweet... tweet! Tweet? This bird has mastered all three. Jay is very proud.") +
  '</svg>';

/* colon: a drumroll before the reveal */
var COLON = '<svg viewBox="0 0 540 230" role="img" aria-label="A colon works like a drumroll: a full sentence, then the colon, then the reveal, list or explanation">' +
  '<rect width="540" height="230" rx="16" fill="#f4f1ea"/>' +
  '<rect x="20" y="60" width="190" height="70" rx="12" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' + T(115, 92, "A full", 15, { b: 1, a: "middle" }) + T(115, 114, "sentence", 15, { b: 1, a: "middle" }) +
  '<circle cx="250" cy="80" r="10" fill="#e04848"/><circle cx="250" cy="112" r="10" fill="#e04848"/>' +
  '<path d="M290 40h230v120h-230z" fill="#2d2466"/><path d="M290 40q30 60 0 120z" fill="#c0392b"/><path d="M520 40q-30 60 0 120z" fill="#c0392b"/>' +
  '<path d="M405 40l-50 120h100z" fill="#ffd23f" fill-opacity=".45"/>' + T(405, 106, "The reveal", 15, { b: 1, a: "middle", c: "#ffffff" }) +
  T(250, 152, "colon", 13, { b: 1, a: "middle", c: "#5b6180" }) +
  T(270, 196, "After a colon: a reveal, a list, or an explanation.", 14, { a: "middle" }) +
  '</svg>';

/* semicolon: a seesaw with two full sentences */
var SEMI = '<svg viewBox="0 0 540 220" role="img" aria-label="A semicolon is like a seesaw: a full sentence on each side, balanced and linked">' +
  '<rect width="540" height="220" rx="16" fill="#f4f1ea"/>' +
  '<path d="M60 120h420" stroke="#7a5532" stroke-width="10" stroke-linecap="round"/>' +
  '<path d="M270 126l-30 56h60z" fill="#3a8fd6" stroke="#141a33" stroke-width="2.5"/>' +
  T(270, 100, ";", 52, { b: 1, a: "middle", c: "#e04848" }) +
  '<rect x="70" y="56" width="160" height="54" rx="10" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/>' + T(150, 89, "Full sentence", 15, { b: 1, a: "middle" }) +
  '<rect x="310" y="56" width="160" height="54" rx="10" fill="#19c39a" stroke="#141a33" stroke-width="2.5"/>' + T(390, 89, "Full sentence", 15, { b: 1, a: "middle" }) +
  T(270, 208, "Two linked ideas, in balance.", 14, { a: "middle", c: "#5b6180" }) +
  '</svg>';

/* brackets: an aside, like a whisper */
var BRACK = '<svg viewBox="0 0 540 220" role="img" aria-label="Brackets hold an aside: extra information the sentence would work without">' +
  '<rect width="540" height="220" rx="16" fill="#f4f1ea"/>' +
  '<path d="M150 30h270q14 0 14 14v34q0 14 -14 14h-120l-30 26 6 -26h-126q-14 0 -14 -14v-34q0 -14 14 -14z" fill="#ffffff" stroke="#8a5cf6" stroke-width="2.5" stroke-dasharray="6 4"/>' +
  T(285, 68, "([[aside]])", 15, { b: 1, i: 1, a: "middle", c: "#8a5cf6" }) +
  '<rect x="30" y="140" width="480" height="44" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
  T(250, 168, "[[Place]]", 15, { b: 1, a: "end" }) + '<path d="M262 176l0 -22M254 162l8 -8 8 8" fill="none" stroke="#8a5cf6" stroke-width="3" transform="rotate(180 262 165)"/>' + T(276, 168, "was our first stop.", 15, { b: 1 }) +
  T(270, 208, "Take the aside out and the sentence still works.", 13, { a: "middle", c: "#5b6180" }) +
  '</svg>';

(window.A2PACKS = window.A2PACKS || {})["punctuation-purpose"] = {
  a2: true,
  id: "a2-punctuation-purpose",
  title: "Punctuation with purpose",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "Punctuation is not just rules. Pick the right mark and you control the pace, the drama and the meaning.",
  blurb: "Choosing punctuation for effect and for clear meaning: ellipsis, exclamation and question marks, colons, semicolons and brackets. Four short chunks, with a punctuation postcard to make at the end.",
  note: "Choosing punctuation on purpose: suspense, drumrolls and asides. Four five minute chunks and a postcard to make at the end. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Dot dot dot", line: "Dot dot dot: what each mark does, one at a time." },
    { id: "medium", name: "Drumroll", line: "Drumroll: choose the mark that gives the effect you want." },
    { id: "spicy", name: "Director's cut", line: "Director's cut: compare choices and explain the effect precisely." }
  ],
  themes: {
    time: { name: "Time travel", w: { place: "the Roman fort", thing: "a glowing portal", list: "a map, a torch and a spare battery", aside: "built in AD 122, give or take",
      s1: "The fort was silent", s2: "the portal was humming", sound: "The portal opened" } },
    football: { name: "Football", w: { place: "the stadium", thing: "an empty pitch under the floodlights", list: "boots, shin pads and a water bottle", aside: "the oldest in the league",
      s1: "The home end was packed", s2: "the away end was empty", sound: "The ball hit the net" } },
    horror: { name: "Horror", w: { place: "the old hospital", thing: "a wheelchair rolling on its own", list: "a torch, a key ring and a very old map", aside: "closed since 1974",
      s1: "The corridor was dark", s2: "the lift light was on", sound: "The door slammed shut" } },
    fishing: { name: "Fishing", w: { place: "the lake", thing: "a carp the size of a dog", list: "a rod, a net and a flask of tea", aside: "the deepest in the county",
      s1: "The river looked calm", s2: "the fish were going wild", sound: "The line snapped" } },
    music: { name: "Music", w: { place: "the theatre", thing: "a spotlight on an empty stage", list: "a script, a water bottle and a lucky scarf", aside: "the one with red velvet seats",
      s1: "The audience was silent", s2: "backstage was chaos", sound: "The lights went out" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: MARKS,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Pauses and punch", title: "Marks that change the mood",
      fig: MARKS,
      html: "<p>Punctuation controls how a sentence <b>sounds</b> in the reader's head.</p>" +
        "<p><b>Ellipsis (...)</b> makes the reader pause: suspense, or a thought trailing off. \"I opened the door and saw... [[thing]].\"</p>" +
        "<p><b>Exclamation mark (!)</b> adds surprise or strong feeling. Use one, at the big moment. \"[[Sound]]!\"</p>" +
        "<p><b>Question mark (?)</b> makes the reader wonder, and pulls them into the story. \"What was waiting inside?\"</p>",
      lv: { spicy: { html: "<p>Punctuation is pace. It tells the reader where to breathe, where to hold their breath, and where to jump.</p>" +
        "<p><b>Ellipsis:</b> delays the reveal, or leaves a thought unfinished so the reader fills the gap. <b>Exclamation:</b> volume and shock, but it loses power with every extra one. <b>Question:</b> hands the reader a puzzle, so they read on to solve it.</p>" +
        "<p>The test for any mark: <b>what does it make the reader do?</b></p>" } } },

    { type: "mc", topic: "Pauses and punch", explain: true,
      q: "Which version builds the most <b>suspense</b>?",
      options: ["I opened the door and saw... [[thing]].", "I opened the door and saw [[thing]].", "I opened the door. I saw [[thing]] there."],
      answer: 0,
      slips: { 1: "Correct, but it tells you straight away. Nothing makes you wait.", 2: "Two short sentences are clear, but there is no pause before the reveal." },
      hint: "Which one makes you wait before the reveal?",
      why: "The ellipsis makes the reader pause just before the reveal. That held breath is suspense.",
      lv: { spicy: { q: "Which version delays the reveal most effectively?",
        options: ["I opened the door and saw... [[thing]].", "I opened the door and saw [[thing]]!", "I opened the door and saw [[thing]], which was strange.", "I opened the door... and saw... [[thing]]..."],
        slips: { 1: "The exclamation adds shock after the reveal, but nothing delays it.", 2: "Explaining that it was strange tells the reader how to feel. Show, do not tell.", 3: "Three ellipses in one line: the pauses cancel each other out. One, in the right place, is stronger." },
        why: "One ellipsis, placed right before the reveal. The reader stops, then gets the surprise." } } },

    { type: "match", topic: "Pauses and punch",
      q: "Match each mark to the job it does best.",
      pairs: [["Ellipsis ( ... )", "A pause for suspense"], ["Exclamation mark ( ! )", "Surprise or strong feeling"], ["Question mark ( ? )", "Makes the reader wonder"]],
      hint: "Think about how each one sounds when you read it aloud.",
      why: "Each mark changes the voice in the reader's head in a different way." },

    { type: "mc", topic: "Pauses and punch",
      q: "Which is the most effective use of an exclamation mark?",
      options: ["[[Sound]]! Nobody moved.", "We had lunch! Then we walked! It was nice!", "The bus left at 9am!"],
      answer: 0,
      slips: { 1: "When everything shouts, nothing stands out. Save it for the big moment.", 2: "A bus time is not a shock. The exclamation mark has nothing to do here." },
      hint: "Which one is a real big moment?",
      why: "One exclamation at a genuine shock, followed by a short calm sentence. The contrast makes it land.",
      lv: { mild: { options: ["[[Sound]]! Nobody moved.", "We had lunch! Then we walked! It was nice!"], slips: { 1: "When every sentence shouts, none of them stand out." } } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Colons: the drumroll", title: "The colon is a drumroll",
      fig: COLON,
      html: "<p>A <b>colon (:)</b> says \"here it comes\". The part <b>before</b> it must be a full sentence. After it comes one of three things:</p>" +
        "<ul><li><b>A reveal:</b> I turned round and there it was: [[thing]].</li>" +
        "<li><b>A list:</b> I packed three things: [[list]].</li>" +
        "<li><b>An explanation:</b> I was soaked: it had rained all night.</li></ul>",
      lv: { spicy: { html: "<p>A <b>colon</b> sets up an expectation, then pays it off. The part before it must stand alone as a sentence; the colon promises that what follows will <b>reveal</b>, <b>list</b> or <b>explain</b>.</p>" +
        "<p>For effect, the reveal is the powerful one: it puts the most important words at the very end, where they hit hardest. \"There was only one thing in the room: [[thing]].\"</p>" +
        "<p>Common slip: a colon after a half sentence. \"We needed: a map\" fails, because \"We needed\" cannot stand alone.</p>" } } },

    { type: "mc", topic: "Colons: the drumroll",
      q: "Which sentence uses a colon for a <b>reveal</b>?",
      options: ["There was only one thing in [[place]]: [[thing]].", "I packed three things: [[list]].", "I was tired: we had walked for hours."],
      answer: 0,
      slips: { 1: "Good colon, but that one introduces a list.", 2: "Good colon, but that one gives an explanation." },
      hint: "Which one saves a surprise for the end?",
      why: "The colon builds up to one surprising thing, saved for the very end." },

    { type: "match", topic: "Colons: the drumroll",
      q: "What is each colon doing?",
      pairs: [["I opened the box and there it was: [[thing]].", "A reveal"], ["I packed three things: [[list]].", "A list"], ["I was soaked: it had rained all night.", "An explanation"]],
      hint: "Several things? A surprise? A reason why?",
      why: "Same mark, three different jobs. The words after the colon tell you which." },

    { type: "multi", topic: "Colons: the drumroll",
      q: "Pick <b>all</b> the sentences where the colon is used correctly.",
      options: ["I knew one thing for certain: we were lost.", "We needed: a map and a torch.", "[[Place]] had one rule: no running.", "The best bit was: the end."],
      answers: [0, 2],
      slips: { any: "Check the words before each colon. Could they stand alone as a sentence?" },
      hint: "Cover up everything after the colon. Is what is left a full sentence?",
      why: "\"I knew one thing for certain\" and \"[[Place]] had one rule\" stand alone. \"We needed\" and \"The best bit was\" do not.",
      lv: { mild: { q: "Pick the sentence where the colon is used correctly.",
        options: ["I knew one thing for certain: we were lost.", "We needed: a map and a torch."], answers: [0],
        why: "\"I knew one thing for certain\" is a full sentence. \"We needed\" is not, so it should not have a colon." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Semicolons: the balance", title: "The semicolon is a seesaw",
      fig: SEMI,
      html: "<p>A <b>semicolon (;)</b> joins two <b>full sentences</b> that are closely linked. It is stronger than a comma, softer than a full stop.</p>" +
        "<p>\"[[S1]]; [[s2]].\" Each side could be a sentence on its own. The semicolon puts them side by side so you feel the <b>contrast</b>.</p>" +
        "<p>Check: is there a full sentence on <b>both</b> sides?</p>",
      lv: { spicy: { html: "<p>A <b>semicolon</b> joins two full sentences that belong together. Its effect is <b>balance</b>: the two halves are weighed against each other, often to show contrast or cause.</p>" +
        "<p>\"[[S1]]. [[S2]].\" Two separate facts. \"[[S1]]; [[s2]].\" Now the reader feels the tension between them.</p>" +
        "<p>Slip to avoid: a semicolon before a joining word like and, but or because. Those words already do the joining.</p>" } } },

    { type: "mc", topic: "Semicolons: the balance",
      q: "Which uses a semicolon correctly?",
      options: ["[[S1]]; [[s2]].", "[[S1]]; because it was late.", "We bought; three tickets."],
      answer: 0,
      slips: { 1: "\"Because it was late\" cannot stand alone as a sentence.", 2: "\"We bought\" is not a full sentence, and \"three tickets\" is not either." },
      hint: "Is there a full sentence on both sides?",
      why: "Both sides stand alone as sentences, and they are linked by contrast." },

    { type: "sort", topic: "Semicolons: the balance",
      q: "Does the semicolon work?",
      buckets: ["The semicolon works", "The semicolon does not work"],
      cards: [["[[S1]]; [[s2]].", 0], ["The tea was cold; the cake was stale.", 0], ["We waited for ages; and then left.", 1], ["After the show; we went home.", 1]],
      hint: "Full sentence on each side, and no joining word straight after.",
      why: "Two full sentences: it works. \"After the show\" is not a sentence, and \"and\" already joins.",
      lv: { medium: { cards: [["[[S1]]; [[s2]].", 0], ["The tea was cold; the cake was stale.", 0], ["We waited for ages; and then left.", 1], ["After the show; we went home.", 1], ["I love trains; my sister hates them.", 0], ["Although it rained; we kept going.", 1]] },
            spicy: { cards: [["[[S1]]; [[s2]].", 0], ["The tea was cold; the cake was stale.", 0], ["We waited for ages; but nobody came.", 1], ["Although it rained; we kept going.", 1], ["I love trains; my sister hates them.", 0], ["Jay pointed at the sky; a heron was flying over.", 0]],
              why: "Full sentences on both sides work. \"But\" already joins, and \"Although it rained\" cannot stand alone." } } },

    { type: "mc", topic: "Semicolons: the balance",
      q: "Compare \"[[S1]]. [[S2]].\" with \"[[S1]]; [[s2]].\" What does the semicolon add?",
      options: ["It links the two ideas, so the contrast hits harder", "It turns it into a question", "It starts a list"],
      answer: 0,
      slips: { 1: "Only a question mark does that.", 2: "Lists come after colons or use commas." },
      hint: "Two separate sentences, or two sides of one picture?",
      why: "The semicolon holds the two halves together, so you notice how different they are.",
      lv: { spicy: { options: ["It balances the halves so the reader weighs one against the other", "It makes the second half more important than the first", "It slows the sentence down like an ellipsis", "It makes the sentence more formal, and that is all"],
        slips: { 1: "A colon puts weight on what follows. A semicolon keeps both halves equal.", 2: "An ellipsis trails off. A semicolon holds two complete ideas together.", 3: "It can sound formal, but the real effect is the link and the balance." },
        why: "Equal weight on each side, tightly linked: the reader holds both at once and feels the contrast." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Brackets and choosing", title: "Brackets whisper",
      fig: BRACK,
      html: "<p><b>Brackets ( )</b> hold an <b>aside</b>: extra information, a joke, or a little comment, like whispering to the reader.</p>" +
        "<p>\"[[Place]] ([[aside]]) was our first stop.\" Take the brackets out and the sentence still works.</p>" +
        "<p>Last skill: punctuation can make meaning <b>clear</b>. Then choose the mark that gives the effect you want.</p>",
      lv: { spicy: { html: "<p><b>Brackets</b> hold a <b>parenthesis</b>: extra information the sentence works without. The effect is a change of voice: quieter, more personal, sometimes funny.</p>" +
        "<p>\"[[Place]] ([[aside]]) was our first stop.\" Commas could do this too, but brackets feel more like a whisper behind your hand.</p>" +
        "<p>Last skill: punctuation also prevents confusion. A missing comma can change the meaning completely.</p>" } } },

    { type: "mc", topic: "Brackets and choosing",
      q: "Which sentence uses brackets well?",
      options: ["[[Place]] ([[aside]]) was our first stop.", "We (went) to [[place]].", "(We arrived at) [[place]] at noon."],
      answer: 0,
      slips: { 1: "\"Went\" is not extra. The sentence needs it.", 2: "Take that bit out and the sentence falls apart. Brackets are for extras only." },
      hint: "Remove the bracketed words. Does the sentence still work?",
      why: "Take the aside out and you still have a full sentence. That is the test." },

    { type: "mc", topic: "Brackets and choosing",
      q: "\"I like cooking my family and my dog.\" What is the problem, and the fix?",
      fig: '<svg viewBox="0 0 420 160" role="img" aria-label="Bonnie the poodle looking alarmed">' + A2ART.bonnie(110, 96, 1.2, "sit") + A2ART.bubble(180, 16, 220, 52, "Cooking ME?\nUnhand me, goblin!", 190) + '</svg>',
      options: ["It sounds like I cook my family: add commas after cooking and family", "It needs a question mark at the end", "It needs brackets round my dog"],
      answer: 0,
      slips: { 1: "It is not a question. The problem is what is being cooked.", 2: "Brackets would not help. The list needs commas to separate the things I like." },
      hint: "Read it slowly. What is being cooked?",
      why: "\"I like cooking, my family and my dog.\" Two commas and Bonnie is safe. Punctuation is there to make the meaning clear." },

    { type: "mc", topic: "Brackets and choosing", explain: true,
      q: "\"Then I saw it __ [[thing]].\" Which mark makes the best drumroll for this reveal?",
      options: ["A colon", "A semicolon", "Brackets"],
      answer: 0,
      slips: { 1: "A semicolon needs a full sentence after it. \"[[Thing]]\" is not a sentence.", 2: "Brackets would make the big reveal sound like a whispered extra. The opposite of a drumroll." },
      hint: "Which mark says \"here it comes\"?",
      why: "\"Then I saw it: [[thing]].\" The colon builds up and saves the reveal for the very end.",
      lv: { spicy: { q: "A writer wants the reader to feel the gap between two halves: \"We had planned every detail __ the weather had other ideas.\" Which mark fits best, and why?",
        options: ["A semicolon: two full sentences, balanced, so the contrast stings", "A colon: it introduces a list", "Brackets: it is extra information", "A question mark: it makes the reader wonder"],
        slips: { 1: "There is no list. And the second half is a full sentence in contrast, not a reveal.", 2: "The second half is the whole point, not an extra.", 3: "Neither half is a question." },
        why: "Two complete ideas in tension: the semicolon balances them, so the reader feels the plan collapse." } } },

    { type: "write", topic: "Brackets and choosing",
      q: "Have a go at a short travelogue paragraph about a journey, if you like: a trip through time, or a real one. Use at least three different marks on purpose. Jay would love to read it.",
      starters: ["We set off at dawn:", "I will never forget", "Then, without warning...", "[[Place]] (", "Was it worth it?"],
      checklist: ["An ellipsis for suspense", "A colon for a reveal or a list", "A semicolon to balance two ideas", "Brackets for an aside", "One exclamation or question at the right moment"],
      minWords: 60,
      lv: { mild: { minWords: 40, checklist: ["An ellipsis for suspense", "A colon for a reveal or a list", "Brackets for an aside"] },
            spicy: { minWords: 90, q: "Have a go at a travelogue paragraph about a journey, if you like: through time, or a real trip. Use at least four different marks, each chosen for a reason you could explain. Jay would love to read it." } } }
  ],

  realWorld: {
    title: "Writers do this on purpose",
    html: "<p>Travel writers, scriptwriters and journalists choose every mark. A colon before a headline reveal, an ellipsis before a cliffhanger, brackets for a cheeky aside: it is how writing gets a voice.</p>" +
      "<p>For our big question, if we could time travel, should we? Imagine the travelogue you would write after the trip. Which moment would get the ellipsis?</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay by a time portal, building suspense">' + A2ART.portal(80, 75, 58) + A2ART.jay(240, 46, 0.85, "wow") +
      A2ART.bubble(290, 6, 124, 52, "And then...", 294) + '</svg>'
  },

  make: {
    title: "Make a punctuation postcard",
    intro: "A postcard from a journey, real or through time, with three marks used on purpose. Keep it or send it to Jay.",
    fields: [
      { id: "from", label: "Postcard from", ph: "[[Place]]", max: 32 },
      { id: "l1", label: "A line with an ellipsis", ph: "We crept inside and then...", max: 70 },
      { id: "l2", label: "A line with a colon", ph: "I saw it at last: [[thing]].", max: 80 },
      { id: "l3", label: "A line with brackets", ph: "[[Place]] ([[aside]]) was worth it.", max: 80 },
      { id: "name", label: "From", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      var lines = [].concat(wrap(v.l1, 34, 2), wrap(v.l2, 34, 3), wrap(v.l3, 34, 3)).slice(0, 8);
      var from = wrap(v.from, 14, 2);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420">' +
        '<rect width="640" height="420" rx="20" fill="#fffbe9"/>' +
        '<rect x="12" y="12" width="616" height="396" rx="14" fill="none" stroke="#141a33" stroke-width="3"/>' +
        '<path d="M398 40v340" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
        lines.map(function(l, k){ return T(34, 60 + k * 36, esc(l), 18, { i: 1 }); }).join("") +
        T(34, 388, "From: " + esc(wrap(v.name, 22, 1)[0] || ""), 16, { b: 1, c: "#5b6180" }) +
        '<rect x="510" y="34" width="96" height="112" rx="6" fill="#ff5d8f" stroke="#141a33" stroke-width="2.5" stroke-dasharray="5 3"/>' +
        T(558, 112, "...", 44, { b: 1, a: "middle", c: "#ffffff" }) +
        '<circle cx="482" cy="104" r="40" fill="none" stroke="#3a8fd6" stroke-width="3"/>' + T(482, 100, "BASE 5", 13, { b: 1, a: "middle", c: "#3a8fd6" }) + T(482, 120, "POST", 13, { b: 1, a: "middle", c: "#3a8fd6" }) +
        T(420, 212, "Greetings from", 15, { c: "#5b6180" }) +
        from.map(function(l, k){ return T(420, 244 + k * 28, esc(l), 22, { b: 1, c: "#e04848" }); }).join("") +
        '<path d="M420 330h190M420 360h190" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
        '</svg>';
    }
  }
};
})();
