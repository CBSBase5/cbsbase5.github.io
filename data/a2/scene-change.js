/* Base 5 Autumn 2 activity: Scene change.
   English. Why a new paragraph starts (time, place, topic, person),
   the marker words that signal it, and how paragraphs still hold
   together. ASCII only. */
(function(){
var A = window.A2ART;
var F = "Verdana,Arial,sans-serif";
function T(x, y, t, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" font-family="' + F + '" font-size="' + (o.s || 15) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.f || "#141a33") + '">' + t + '</text>';
}
/* two paragraphs, shown as a little extract */
function two(a, b){ return '<div class="a2task"><p style="margin:0 0 12px">' + a + '</p><p style="margin:0">' + b + '</p></div>'; }

/* the four reasons for a new paragraph: time, place, topic, person */
var FOUR =
  '<svg viewBox="0 0 520 210" role="img" aria-label="Four reasons for a new paragraph: time, place, topic and person">' +
  '<rect width="520" height="210" rx="16" fill="#f4f1ea"/>' +
  [["Time", "#ffd23f",
     '<circle r="26" fill="#fff" stroke="#141a33" stroke-width="3"/><path d="M0 0V-17M0 0L12 7" stroke="#141a33" stroke-width="3.5" stroke-linecap="round"/>'],
   ["Place", "#22b8e6",
     '<path d="M0 26C-8 12 -20 2 -20 -8a20 20 0 0 1 40 0c0 10 -12 20 -20 34z" fill="#e04848" stroke="#141a33" stroke-width="3"/><circle cy="-8" r="7" fill="#fff"/>'],
   ["Topic", "#19c39a",
     '<path d="M-15 8a19 19 0 1 1 30 0q-5 5 -5 12h-20q0 -7 -5 -12z" fill="#fff6b8" stroke="#141a33" stroke-width="3"/><path d="M-9 26h18M-7 32h14" stroke="#141a33" stroke-width="3" stroke-linecap="round"/>'],
   ["Person", "#ff5d8f",
     '<circle cy="-10" r="12" fill="#fff" stroke="#141a33" stroke-width="3"/><path d="M-22 26q0 -22 22 -22q22 0 22 22z" fill="#fff" stroke="#141a33" stroke-width="3"/>']
  ].map(function(c, k){
    var x = 68 + k * 128;
    return '<g transform="translate(' + x + ' 86)"><circle r="48" fill="' + c[1] + '" fill-opacity=".38" stroke="#141a33" stroke-width="2.5"/>' + c[2] + '</g>' +
      T(x, 166, c[0], { a: "middle", s: 18, b: 1 });
  }).join("") +
  T(260, 196, "New time, new place, new topic or new person: new paragraph.", { a: "middle", s: 13, f: "#3b4160" }) +
  '</svg>';

/* a wall of text next to the same words split into paragraphs */
var WALL =
  '<svg viewBox="0 0 520 220" role="img" aria-label="A wall of text on the left. The same words split into three paragraphs on the right.">' +
  '<rect width="520" height="220" rx="16" fill="#eef6fb"/>' +
  '<rect x="20" y="18" width="220" height="184" rx="10" fill="#fff" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function(k){ return '<path d="M36 ' + (38 + k * 15) + 'h' + (k === 9 ? 110 : 188) + '" stroke="#9aa0b8" stroke-width="7" stroke-linecap="round"/>'; }).join("") +
  T(130, 214, "Hard to follow", { a: "middle", s: 13, f: "#5b6180" }) +
  '<rect x="280" y="18" width="220" height="184" rx="10" fill="#fff" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
  [[38, 3, "#ffd23f"], [100, 3, "#22b8e6"], [160, 2, "#ff5d8f"]].map(function(p){
    var s = '<rect x="286" y="' + (p[0] - 10) + '" width="6" height="' + (p[1] * 15 + 4) + '" rx="3" fill="' + p[2] + '"/>';
    for(var j = 0; j < p[1]; j++) s += '<path d="M' + (j ? 300 : 316) + ' ' + (p[0] + j * 15) + 'h' + (j === p[1] - 1 ? 120 : (j ? 184 : 168)) + '" stroke="#9aa0b8" stroke-width="7" stroke-linecap="round"/>';
    return s;
  }).join("") +
  T(390, 214, "Easy to follow", { a: "middle", s: 13, f: "#1f9d63", b: 1 }) +
  '<path d="M248 110h24" stroke="#141a33" stroke-width="3" marker-end="url(#scA)"/>' +
  '<defs><marker id="scA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#141a33"/></marker></defs>' +
  '</svg>';

/* marker words, four signposts */
var SIGNS =
  '<svg viewBox="0 0 520 250" role="img" aria-label="Signposts of marker words for time, place, topic and person">' +
  '<rect width="520" height="250" rx="16" fill="#f3f7ee"/>' +
  '<rect x="252" y="20" width="16" height="222" rx="4" fill="#8a5a36"/>' +
  [["TIME", "Later, / The next day,", "#ffd23f", 0], ["PLACE", "Back home, / Outside,", "#22b8e6", 1],
   ["TOPIC", "As for the food,", "#19c39a", 0], ["PERSON", "Her brother, though,", "#ff5d8f", 1]].map(function(c, k){
    var y = 30 + k * 54, left = c[3] === 0;
    var x = left ? 30 : 270, w = 220;
    var pts = left ? (x + 20) + ',' + y + ' ' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + 44) + ' ' + (x + 20) + ',' + (y + 44) + ' ' + x + ',' + (y + 22)
                   : x + ',' + y + ' ' + (x + w - 20) + ',' + y + ' ' + (x + w) + ',' + (y + 22) + ' ' + (x + w - 20) + ',' + (y + 44) + ' ' + x + ',' + (y + 44);
    return '<polygon points="' + pts + '" fill="' + c[2] + '" stroke="#141a33" stroke-width="2.5"/>' +
      T(left ? x + 32 : x + 12, y + 19, c[0], { s: 14, b: 1 }) +
      T(left ? x + 32 : x + 12, y + 37, c[1], { s: 13 });
  }).join("") +
  A.egg(A.bird(260, 18, 0.7, "#3a8fd6"), "A bird on the signpost. It always knows where it is going. Jay, less so.") +
  '</svg>';

/* a bridge: a new paragraph links back, then moves on */
var BRIDGE =
  '<svg viewBox="0 0 520 200" role="img" aria-label="Two paragraphs joined by a bridge: the first sentence of the new paragraph links back, then moves on">' +
  '<rect width="520" height="200" rx="16" fill="#f1f3fb"/>' +
  '<rect x="20" y="40" width="170" height="120" rx="10" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
  T(105, 66, "Paragraph 1", { a: "middle", s: 14, b: 1 }) +
  '<path d="M36 90h138M36 108h138M36 126h90" stroke="#9aa0b8" stroke-width="7" stroke-linecap="round"/>' +
  '<rect x="330" y="40" width="170" height="120" rx="10" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
  T(415, 66, "Paragraph 2", { a: "middle", s: 14, b: 1 }) +
  '<path d="M346 90h138" stroke="#19c39a" stroke-width="9" stroke-linecap="round"/><path d="M346 108h138M346 126h90" stroke="#9aa0b8" stroke-width="7" stroke-linecap="round"/>' +
  '<path d="M190 100q70 -70 140 0" fill="none" stroke="#8a5a36" stroke-width="8"/>' +
  '<path d="M205 92v14M225 80v26M245 72v34M265 70v36M285 72v34M305 80v26M320 92v14" stroke="#8a5a36" stroke-width="4"/>' +
  T(260, 140, "first sentence:", { a: "middle", s: 13, f: "#3b4160" }) +
  T(260, 158, "links back,", { a: "middle", s: 14, b: 1, f: "#1f9d63" }) +
  T(260, 176, "then moves on", { a: "middle", s: 14, b: 1, f: "#1f9d63" }) +
  '</svg>';

/* Bonnie asleep in a sunny spot */
var SNOOZE =
  '<svg viewBox="0 0 360 170" role="img" aria-label="Bonnie the poodle in a patch of sunlight by a window">' +
  '<rect width="360" height="170" rx="16" fill="#fdf6e7"/>' +
  '<rect x="220" y="14" width="110" height="80" rx="6" fill="#bfe6fa" stroke="#7a5532" stroke-width="5"/><path d="M275 14v80M220 54h110" stroke="#7a5532" stroke-width="4"/>' +
  '<path d="M220 94l-60 66h190l-20 -66z" fill="#ffd23f" fill-opacity=".35"/>' +
  A.bonnie(220, 112, 0.95, "sit") +
  T(262, 72, "z", { s: 18, b: 1, f: "#5b6180" }) + T(280, 54, "z", { s: 22, b: 1, f: "#5b6180" }) +
  A.egg(T(36, 150, "psst", { s: 13, f: "#b9b2a0" }), "Bonnie has been in the same sunny spot since Tuesday. Nobody dares move her.") +
  '</svg>';

/* the sentences for the cut it up widget; breaks go before 3, 5 and 7 */
var CUT = [
  "[[Who]] arrived at [[place]] just before six.",
  "Everything was quiet.",
  "[[Who]] checked [[thing]] and waited.",
  "Two hours later, [[event]] was in full swing.",
  "The noise was huge.",
  "[[Place2]], it was a different story.",
  "It was cold and dark, and nobody was there.",
  "Meanwhile, [[who2]] was still on the way, stuck in traffic."
];
function runOn(n){ return '<p class="a2task">' + CUT.slice(0, n).join(" ") + '</p>'; }

/* a journey text for picking where paragraphs start */
var TRIP = ["We set off from [[place]] at nine.", "The bus was packed.", "By lunchtime, we were halfway there.", "Everyone was starving.",
  "At the service station, the queue for food went right out of the door.", "[[Who2]], who hates queues, went back to sit on the bus."];

(window.A2PACKS = window.A2PACKS || {})["scene-change"] = {
  a2: true,
  id: "a2-scene-change",
  title: "Scene change",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "A new paragraph is a scene change: new time, new place, new topic or new person.",
  blurb: "Why writers start a new paragraph, the marker words that tell the reader what changed, and how paragraphs still hold together. Four short chunks, with a scene card to make at the end.",
  note: "Scene changes: why a new paragraph starts and the little words that signal it. Four five minute chunks and a scene card at the end. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Stage hand", line: "Stage hand: short pieces, mostly changes of time and place." },
    { id: "medium", name: "Director", line: "Director: all four kinds of change, and the words that mark them." },
    { id: "spicy", name: "Playwright", line: "Playwright: trickier texts, and why the writer chose to break where they did." }
  ],
  themes: {
    time: { name: "Time travel", w: { place: "the time lab", place2: "inside the time machine", who: "the time traveller", who2: "the guide", thing: "the control panel", event: "the experiment", sound: "the machine started to hum" } },
    football: { name: "Football", w: { place: "the stadium", place2: "down in the changing room", who: "the captain", who2: "the coach", thing: "the match ball", event: "the match", sound: "the referee blew the whistle" } },
    horror: { name: "Horror", w: { place: "the old hospital", place2: "down in the basement", who: "the night porter", who2: "the security guard", thing: "the torch", event: "the night shift", sound: "the handle turned" } },
    fishing: { name: "Fishing", w: { place: "the lake", place2: "over at the boat house", who: "the angler", who2: "the warden", thing: "the rod", event: "the fishing match", sound: "the line went tight" } },
    music: { name: "Music", w: { place: "the theatre", place2: "backstage in the dressing room", who: "the lead singer", who2: "the director", thing: "the microphone", event: "the show", sound: "the curtain went up" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: FOUR,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Why a new paragraph?", title: "A new paragraph is a scene change",
      fig: FOUR,
      html: "<p>Think of a play. When the scene changes, the lights dip and the set moves. In writing, a <b>new paragraph</b> does that job.</p>" +
        "<p>Writers start a new paragraph when one of four things changes:</p>" +
        "<p><b>Time</b> (later, the next day) &middot; <b>Place</b> (somewhere else) &middot; <b>Topic</b> (something new to talk about) &middot; <b>Person</b> (the focus moves to someone else).</p>" +
        "<p>Some people remember it as <b>TiPToP</b>: Time, Place, Topic, Person.</p>",
      ez: { title: "New paragraph, new scene", html: "<p>A <b>new paragraph</b> is like a new scene.</p><p>Look for a new <b>time</b> or a new <b>place</b>.</p>" },
      lv: { mild: { html: "<p>Think of a play. When the scene changes, the lights dip and the set moves. In writing, a <b>new paragraph</b> does that job.</p>" +
          "<p>Writers start a new paragraph when something changes. The two you will spot most are:</p>" +
          "<p><b>Time</b>: the story jumps to later (\"The next day,\").<br><b>Place</b>: the story moves somewhere else (\"Back at home,\").</p>" +
          "<p>There are two more, <b>topic</b> and <b>person</b>. You will meet them too, but time and place are the big ones.</p>" },
        spicy: { html: "<p>A <b>new paragraph</b> is a scene change. Writers break when the <b>time</b>, <b>place</b>, <b>topic</b> or <b>person</b> in focus changes (TiPToP).</p>" +
          "<p>Two things to watch for at this level:</p>" +
          "<p>Time can jump <b>backwards</b> as well as forwards (a flashback). And sometimes nothing in the story moves at all: the writer breaks for <b>effect</b>, to make a moment stand out on its own.</p>" } } },

    { type: "mc", topic: "Why a new paragraph?",
      q: two("[[Who]] locked up [[place]] and went home to bed.", "The next morning, the alarm went off at seven.") + "<p>Why did the writer start a new paragraph?</p>",
      options: ["The time changed.", "The place changed.", "The topic changed.", "The person changed."],
      answer: 0, fixed: true,
      slips: { 1: "Home does come up, but look at the very start of the new paragraph: \"The next morning\" is a time.", 2: "It is still the same story. Look at the first three words of the new paragraph.", 3: "Nobody new comes in. Look at the first three words of the new paragraph." },
      hint: "Look at the first three words of the new paragraph.",
      ez: { q: two("[[Who]] locked up [[place]] and went home to bed.", "The next morning, the alarm went off at seven.") + "<p>Why the new paragraph?</p>", hint: "Read the first 3 words.", why: "\"The next morning\" is a jump in <b>time</b>.", slips: { 1: "Look at \"The next morning\". That is a time.", 2: "Same story. Read the first 3 words.", 3: "Nobody new. Read the first 3 words." } },
      why: "\"The next morning\" jumps forward in time. A jump in time is a good reason for a new paragraph.",
      lv: { spicy: {
        q: two("[[Who]] stood in the doorway of [[place]] and looked around.", "Five years earlier, [[who]] had walked through those same doors for the very first time.") + "<p>Why did the writer start a new paragraph?</p>",
        slips: { 1: "It is the same doorway in both paragraphs. What has moved is <b>when</b>.", 2: "Still the same story about the same person. Look at \"Five years earlier\".", 3: "It is the same person in both. Look at \"Five years earlier\"." },
        hint: "Is the second paragraph happening now, or at another time?",
        why: "\"Five years earlier\" jumps <b>back</b> in time. That is a flashback, and it is still a change of time, so it gets a new paragraph." } } },

    { type: "mc", topic: "Why a new paragraph?",
      q: two("[[Who]] waited by the front door for what felt like ages.", "[[Place2]], the lights flickered on all by themselves.") + "<p>Why did the writer start a new paragraph?</p>",
      options: ["The time changed.", "The place changed.", "The topic changed.", "The person changed."],
      answer: 1, fixed: true,
      slips: { 0: "No clock has moved on. Look at where the second paragraph happens.", 2: "It is still the same story. Look at where the second paragraph happens.", 3: "There is no new person here, just lights. Where are they?" },
      hint: "Where does the second paragraph happen?",
      ez: { q: two("[[Who]] waited by the front door for what felt like ages.", "[[Place2]], the lights flickered on all by themselves.") + "<p>Why the new paragraph?</p>", hint: "Where is the second part?", why: "\"[[Place2]]\" is a new <b>place</b>.", slips: { 0: "No time jump. Where is it now?", 2: "Same story. Where is it now?", 3: "No new person. Where are the lights?" } },
      why: "\"[[Place2]]\" moves the reader somewhere else. A change of place gets a new paragraph.",
      lv: { spicy: {
        q: two("[[Place]] was busy all evening. People came and went, and the noise never seemed to stop.", "The building itself is over a hundred years old. Its walls have seen floods, fires and one very strange winter.") + "<p>Why did the writer start a new paragraph?</p>",
        answer: 2,
        slips: { 0: "There is no jump in time here. The second paragraph is <b>about</b> something different.", 1: "It is the same building in both. What the writer is talking about has changed.", 3: "No new person comes in. The writer has moved on to a new subject." },
        hint: "Same building. Is it talking about the same thing?",
        why: "The first paragraph is about the busy evening. The second is about the building's history. A new <b>topic</b> gets a new paragraph." } } },

    { type: "sort", topic: "Why a new paragraph?",
      q: "Each of these could start a new paragraph. Sort them by what changes.",
      buckets: ["Time", "Place", "Topic", "Person"],
      cards: [["Later that evening,", 0], ["Back at [[place]],", 1], ["Another problem was the noise.", 2], ["[[Who2]] had other ideas.", 3], ["The next day,", 0], ["Outside in the rain,", 1]],
      hint: "When? Where? What about? Who?",
      ez: { q: "Is it a change of <b>time</b> or <b>place</b>?", hint: "Time is when. Place is where.", why: "Later and next day say <b>when</b>. Back at and outside say <b>where</b>." },
      why: "\"Later\" and \"the next day\" are times. \"Back at\" and \"outside\" are places. \"Another problem\" brings a new topic. \"[[Who2]]\" moves the focus to someone else.",
      lv: { mild: { q: "Each of these could start a new paragraph. Is it a change of time or of place?",
          buckets: ["Time", "Place"],
          cards: [["Later that evening,", 0], ["Back at [[place]],", 1], ["The next day,", 0], ["Outside in the rain,", 1]],
          hint: "Time words answer \"when?\". Place words answer \"where?\".",
          why: "\"Later\" and \"the next day\" answer when. \"Back at\" and \"outside\" answer where." },
        spicy: { cards: [["Years before any of this,", 0], ["Across town,", 1], ["As for the money, nobody knew where it went.", 2], ["Not everyone was pleased. [[Who2]] stayed silent.", 3], ["By the time the sun came up,", 0], ["Far below, in the tunnels,", 1]],
          why: "\"Years before\" and \"by the time the sun came up\" are times. \"Across town\" and \"far below\" are places. \"As for the money\" starts a new topic. \"[[Who2]]\" moves the focus to a different person." } } },

    { type: "mc", topic: "Why a new paragraph?", explain: true,
      q: two("Jay spent the whole lesson trying to fix the printer. He pressed every button twice.", "Bonnie, meanwhile, had found a sunny spot by the window and fallen fast asleep.") + "<p>Why did the writer start a new paragraph?</p>",
      fig: SNOOZE,
      options: ["The time changed.", "The place changed.", "The topic changed.", "The person changed."],
      answer: 3, fixed: true,
      slips: { 0: "\"Meanwhile\" means at the same time, so the time has not moved. Who is the paragraph about now?", 1: "She is in the same room as Jay, just by the window. Who is the paragraph about now?", 2: "Still the same lesson. Who has the spotlight now?" },
      hint: "Who is the second paragraph about?",
      ez: { q: two("Jay spent the whole lesson trying to fix the printer. He pressed every button twice.", "Bonnie, meanwhile, had found a sunny spot by the window and fallen fast asleep.") + "<p>Why the new paragraph?</p>", hint: "Who is it about now?", why: "It moves from Jay to <b>Bonnie</b>. A new person.", slips: { 0: "Meanwhile means same time. Who is it about now?", 1: "Same room. Who is it about now?", 2: "Same lesson. Who is it about now?" } },
      why: "The spotlight moves from Jay to Bonnie. A change of person gets a new paragraph, and \"meanwhile\" tells us it is happening at the same time." },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Where does the break go?", title: "No paragraphs, no breathing space",
      fig: WALL,
      html: "<p>Here is a piece with no paragraphs at all. Have a read.</p>" + runOn(8) +
        "<p>Everything is there, but it is hard to follow. The scene changes three times and nothing tells your eyes. Hunt for the <b>first few words</b> of each sentence: that is where the changes hide.</p>",
      ez: { title: "No paragraphs", html: "<p>No paragraphs is <b>hard to read</b>.</p><p>Look at the <b>first words</b> of each sentence.</p>" },
      lv: { mild: { html: "<p>Here is a piece with no paragraphs at all. Have a read.</p>" + runOn(7) +
        "<p>Everything is there, but it is hard to follow. The scene changes twice: once in <b>time</b> and once in <b>place</b>. The first few words of a sentence are where the changes hide.</p>" } } },

    { type: "mc", topic: "Where does the break go?",
      q: runOn(8) + "<p>The time jumps in this piece. Which sentence should start a new paragraph?</p>",
      options: ["Two hours later, [[event]] was in full swing.", "Everything was quiet.", "The noise was huge.", "[[Who]] checked [[thing]] and waited."],
      answer: 0,
      slips: { 1: "That one carries on the same quiet moment. Look for a time word at the start.", 2: "That carries on from the sentence before it. Look for the sentence that jumps forward.", 3: "Same time, same place as the start. Look for a time word." },
      hint: "Look for words that say when.",
      ez: { q: runOn(7) + "<p>The time jumps. Which sentence starts a new paragraph?</p>", hint: "Look for a when word.", why: "\"Two hours later\" jumps in <b>time</b>.", slips: { 1: "Same quiet moment. Look for a time word.", 2: "That carries on. Look for a time jump.", 3: "Same time. Look for a time word." } },
      why: "\"Two hours later\" jumps forward in time, so a new paragraph starts there.",
      lv: { mild: { q: runOn(7) + "<p>The time jumps in this piece. Which sentence should start a new paragraph?</p>" },
        spicy: { q: runOn(8) + "<p>Which sentence starts a new paragraph because of a change of <b>person</b>?</p>",
          options: ["Meanwhile, [[who2]] was still on the way, stuck in traffic.", "Two hours later, [[event]] was in full swing.", "[[Who]] checked [[thing]] and waited.", "It was cold and dark, and nobody was there."],
          slips: { 1: "That is a change of time. Which sentence moves the spotlight to someone new?", 2: "That is the same person as the first sentence.", 3: "That carries on describing the place before it." },
          hint: "Who has not been mentioned yet?",
          why: "\"Meanwhile, [[who2]]\" moves the spotlight to someone new, happening at the same time. A change of person gets a new paragraph." } } },

    { type: "widget", topic: "Where does the break go?", unscored: true,
      title: "Cut it into paragraphs",
      html: "<p>Tap a gap between two sentences to start a new paragraph there. Tap it again to take it away. When you are happy, see where Jay would cut it. There is no score, so have a go.</p>",
      ez: { html: "<p>Tap a gap to start a new paragraph. Then see where Jay cuts it.</p>" },
      mount: function(el, api){
        var d = api.data, mild = api.level === "mild", tk = api.tok || function(t){ return t; };
        var S = CUT.slice(0, mild ? 7 : 8).map(function(t){ return tk(t); });
        var right = mild ? [3, 5] : [3, 5, 7];
        var key = mild ? "mild" : "full";
        if(!Array.isArray(d.cuts) || d.key !== key){ d.cuts = []; d.key = key; d.shown = false; }
        el.innerHTML = '<div class="scbox" style="background:#fffdf6;border:2px solid #d9d8e6;border-radius:14px;padding:12px 14px;line-height:2"></div>' +
          '<div class="qnav" style="flex-wrap:wrap;gap:8px"><button type="button" class="btn" data-a="show">Show me where Jay would cut it</button>' +
          '<button type="button" class="btn btn-quiet" data-a="clear">Start again</button></div>' +
          '<p class="tiny" aria-live="polite" style="min-height:1.4em"></p>';
        var box = el.querySelector(".scbox"), msg = el.querySelector("p.tiny");
        function has(k){ return d.cuts.indexOf(k) >= 0; }
        function draw(){
          var h = "";
          S.forEach(function(t, k){
            if(k > 0){
              var on = has(k), ok = d.shown && right.indexOf(k) >= 0;
              var bg = on ? (d.shown ? (ok ? "#c9f2e2" : "#fff1c2") : "#ffd23f") : "#ffffff";
              var bd = ok ? "#1f9d63" : (on ? "#141a33" : "#9aa0b8");
              var st = ok && !on ? "dashed" : "solid";
              h += (on ? '<br><br>' : ' ') +
                '<button type="button" data-g="' + k + '" aria-pressed="' + on + '" aria-label="Gap before sentence ' + (k + 1) + '" style="font:inherit;font-size:.85rem;font-weight:700;cursor:pointer;padding:0 8px;margin:0 4px 0 0;border-radius:8px;border:2px ' + st + ' ' + bd + ';background:' + bg + ';color:#141a33;line-height:1.6">' + (on ? "new paragraph" : "+") + '</button> ';
            }
            h += '<span style="color:#141a33">' + t + '</span>';
          });
          box.innerHTML = h;
        }
        box.onclick = function(ev){
          var b = ev.target.closest("button[data-g]"); if(!b) return;
          var k = +b.getAttribute("data-g");
          if(has(k)) d.cuts.splice(d.cuts.indexOf(k), 1); else d.cuts.push(k);
          d.shown = false; msg.textContent = ""; api.save(); draw();
        };
        el.querySelector(".qnav").onclick = function(ev){
          var b = ev.target.closest("button"); if(!b) return;
          if(b.getAttribute("data-a") === "clear"){ d.cuts = []; d.shown = false; msg.textContent = ""; api.save(); draw(); return; }
          d.shown = true;
          var found = right.filter(function(k){ return has(k); }).length, extra = d.cuts.filter(function(k){ return right.indexOf(k) < 0; }).length;
          msg.textContent = "Jay cuts it in " + right.length + " places (outlined in green). You matched " + found + " of them" +
            (extra ? ", and made " + extra + " other cut" + (extra === 1 ? "" : "s") + ". Other cuts can work too if you can say what changed." : ".") +
            (mild ? " Time: \"Two hours later\". Place: the move somewhere else." : " Time: \"Two hours later\". Place: the move somewhere else. Person: \"Meanwhile\".");
          api.save(); draw(); api.done("done");
        };
        draw();
        if(d.shown) api.done("done");
      } },

    { type: "multi", topic: "Where does the break go?",
      q: '<p class="a2task">' + TRIP.join(" ") + '</p><p>This one has no paragraphs either. Pick <b>every</b> sentence that should start a new paragraph.</p>',
      options: TRIP.slice(1),
      answers: [1, 3, 4],
      hint: "Look for a new time, a new place and a new person.",
      ez: { q: '<p class="a2task">' + TRIP.slice(0, 5).join(" ") + '</p><p>Pick the <b>2</b> sentences that start a new paragraph.</p>', hint: "Find a time word and a place word.", why: "\"By lunchtime\" is <b>time</b>. \"At the service station\" is <b>place</b>." },
      why: "\"By lunchtime\" is a new time. \"At the service station\" is a new place. \"[[Who2]]\" moves the spotlight to one person.",
      lv: { mild: {
        q: '<p class="a2task">' + TRIP.slice(0, 5).join(" ") + '</p><p>This one has no paragraphs either. Pick the <b>two</b> sentences that should start a new paragraph.</p>',
        options: TRIP.slice(1, 5),
        answers: [1, 3],
        hint: "Look for a time word and a place word at the start of a sentence.",
        why: "\"By lunchtime\" is a new time. \"At the service station\" is a new place." } } },

    { type: "order", topic: "Where does the break go?",
      q: "These are the first lines of five paragraphs from a trip diary. Put them in order using the time markers.",
      items: ["Early that morning, we packed the bags.", "By lunchtime, we had reached [[place]].", "That afternoon, it rained without stopping.", "Later that night, the sky finally cleared.", "The next day, we headed home."],
      hint: "Morning, lunchtime, afternoon, night, next day.",
      ez: { q: "Put the diary in time order.", hint: "Morning, lunchtime, night, next day.", why: "The time words give the order." },
      why: "The time markers do the ordering for you: early morning, lunchtime, afternoon, later that night, the next day.",
      lv: { mild: { items: ["In the morning, we got on the bus.", "At lunchtime, we reached [[place]].", "At night, we went to bed.", "The next day, we went home."] },
        spicy: { items: ["Two days before the trip, the tickets arrived.", "The night before, nobody could sleep.", "At six the next morning, the bus pulled up outside.", "An hour later, the first bag had already been left behind.", "By the time we got home, it was dark again."],
          hint: "Two days before, the night before, the next morning, an hour later, the end of the day.",
          why: "\"Two days before\" and \"the night before\" come before the trip itself. Then the markers run forward: six the next morning, an hour later, by the time we got home." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Marker words", title: "Marker words tell the reader what changed",
      fig: SIGNS,
      html: "<p>The first few words of a new paragraph are often a <b>marker</b>. They work like a signpost, so the reader knows what kind of change is coming.</p>" +
        "<p><b>Time:</b> Later that night, / The next day, / Meanwhile,<br><b>Place:</b> Back at home, / Outside, / Across town,<br><b>Topic:</b> As for the food, / Another thing was...<br><b>Person:</b> a new name, or \"Her brother, on the other hand,\"</p>" +
        "<p>Notice the comma after a marker. It gives the reader a tiny pause before the scene starts.</p>",
      ez: { title: "Marker words", html: "<p>The first words are a <b>marker</b>, like a signpost.</p><p><b>Later that night,</b> is time. <b>Back at home,</b> is place.</p>" },
      lv: { spicy: { html: "<p>The first few words of a new paragraph are often a <b>marker</b>: a signpost telling the reader what kind of change is coming.</p>" +
        "<p><b>Time:</b> Years before, / By the time... / Meanwhile,<br><b>Place:</b> Across town, / Far below,<br><b>Topic:</b> As for... / Another problem was...<br><b>Person:</b> a new name, or \"Not everyone agreed.\"</p>" +
        "<p>Good writers pick the marker that says <b>exactly</b> what changed. \"Meanwhile\" says same time, different place or person. \"Years before\" warns the reader that a flashback is coming.</p>" } } },

    { type: "match", topic: "Marker words",
      q: "Match each marker to the change it signals.",
      pairs: [["Later that night,", "Time moves on"], ["Back at [[place]],", "A new place"], ["As for [[thing]],", "A new topic"], ["[[Who2]], on the other hand,", "A different person"]],
      hint: "When? Where? What about? Who?",
      ez: { q: "Match each marker to its change.", why: "Each marker says what changed." },
      why: "Each marker tells the reader what has changed before the new scene starts." },

    { type: "text", topic: "Marker words",
      q: "Write a marker that could start a paragraph jumping <b>forward in time</b>. Just the opening few words is fine.",
      need: [["later", "next", "after", "afterwards", "tomorrow", "morning", "afternoon", "evening", "night", "hour", "hours", "minute", "minutes", "day", "days", "week", "weeks", "year", "years", "soon", "by", "then", "eventually", "finally", "o'clock", "pm", "am", "midnight", "lunchtime", "dawn"]],
      model: "The next morning,",
      slips: [[["back at", "outside", "inside", "across"], "That one moves the place. Try a time: later, the next day, that night."], [["meanwhile"], "Meanwhile means at the same time. Try one that jumps forward: later, the next day."]],
      hint: "Start with \"Later\", \"The next\" or \"That night\".",
      ez: { q: "Write a marker that jumps <b>forward in time</b>. A few words is fine.", hint: "Try Later, or The next day.", why: "Anything that moves the clock on. \"The next morning,\"", slips: [[null, "That moves the place. Try a time, like later."], [null, "Meanwhile means same time. Try later."]] },
      why: "Anything that tells the reader the clock has moved on works: \"Later that day,\", \"The next morning,\", \"An hour after that,\".",
      lv: { spicy: { q: "Write a marker that could start a <b>flashback</b> paragraph: one that jumps <b>back</b> in time.",
        need: [["before", "earlier", "ago", "previously", "once", "when", "back", "last", "used", "had", "years", "year", "remembered", "remember"]],
        model: "Ten years earlier,",
        slips: [[["later", "next", "after", "tomorrow"], "That jumps forward. A flashback goes back: \"Years before,\", \"The summer before,\"."]],
        hint: "Try \"Years before,\" or \"Long ago,\" or \"The summer before,\".",
        why: "\"Ten years earlier,\" or \"The summer before,\" warn the reader that the story is going back in time." } } },

    { type: "mc", topic: "Marker words",
      q: "Which opener moves the reader to a <b>new place</b>?",
      options: ["Across the road,", "Ten minutes later,", "Another thing was the cost.", "The next morning,"],
      answer: 0,
      slips: { 1: "\"Ten minutes later\" moves the time, not the place.", 2: "That one brings in a new topic.", 3: "\"The next morning\" moves the time." },
      hint: "Which one answers \"where?\"",
      ez: { q: "Which one moves to a <b>new place</b>?", hint: "Which one says where?", why: "\"Across the road\" is a new <b>place</b>.", slips: { 1: "That moves the time.", 2: "That is a new topic.", 3: "That moves the time." } },
      why: "\"Across the road\" tells the reader the scene has moved somewhere else.",
      lv: { spicy: { q: "Two things happen <b>at the same time</b> in two different places. Which marker best opens the second paragraph?",
        options: ["Meanwhile, across town,", "After that,", "Finally,", "Years before,"],
        slips: { 1: "\"After that\" puts the second thing later, not at the same time.", 2: "\"Finally\" says this is the last thing, not the same time.", 3: "\"Years before\" jumps back in time." },
        hint: "Which marker says \"same time\" and \"somewhere else\"?",
        why: "\"Meanwhile\" says same time and \"across town\" says somewhere else. Two markers in one opener, doing two jobs." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Holding it together", title: "Move on, but hold on",
      fig: BRIDGE,
      html: "<p>A new paragraph moves on, but it should not feel like a different book. The best first sentences do two jobs: they <b>link back</b> to what came before, then <b>move on</b>.</p>" +
        "<p class=\"a2task\">[[Who]] finally found [[thing]] under a pile of coats.<br><br><b>This</b> was only the start of the trouble. <b>Later that night</b>, ...</p>" +
        "<p>\"This\" points back to the last paragraph. \"Later that night\" moves the time on. Words like <b>this, that, these, it, they</b>, or using the same name again, hold the paragraphs together.</p>",
      ez: { title: "Hold it together", html: "<p>A good start <b>points back</b>, then moves on.</p><p class=\"a2task\">[[Who]] found [[thing]].<br><br><b>It</b> was dusty. <b>The next day</b>, ...</p>" },
      lv: { mild: { html: "<p>A new paragraph moves on, but it is still the same story. A good first sentence often <b>points back</b> to the last paragraph.</p>" +
        "<p class=\"a2task\">[[Who]] finally found [[thing]].<br><br><b>It</b> was covered in dust. <b>The next day</b>, ...</p>" +
        "<p>\"It\" points back to [[thing]]. \"The next day\" moves the time on. Small words like <b>it, this, they</b> hold the story together.</p>" },
        spicy: { html: "<p>A new paragraph moves on, but the text still needs to hold together. Strong first sentences <b>link back</b> and then <b>move on</b>.</p>" +
        "<p class=\"a2task\">[[Who]] finally found [[thing]] under a pile of coats.<br><br><b>That discovery</b> changed everything. <b>Later that night</b>, ...</p>" +
        "<p>\"That discovery\" sums up the whole last paragraph in two words, then the marker moves on. Linking back with a summing up phrase (this mistake, that discovery, these problems) is one of the neatest ways to join paragraphs.</p>" +
        "<p>Sometimes a writer breaks for <b>effect</b> instead: a one sentence paragraph makes a moment land hard.</p>" } } },

    { type: "mc", topic: "Holding it together",
      q: "<p class=\"a2task\">[[Who]] spent the whole morning searching [[place]] for [[thing]]. It was nowhere to be found.</p><p>Which sentence makes the best start for the <b>next</b> paragraph?</p>",
      options: ["By the afternoon, the search had moved outside.", "Bonnie is a brown toy poodle.", "Outside."],
      answer: 0,
      slips: { 1: "True, but it has nothing to do with the search. It does not link back.", 2: "That is a place, but it does not link back to the search or make a full sentence." },
      hint: "Which one links back to the search and also moves on?",
      ez: { q: "<p class=\"a2task\">[[Who]] spent the whole morning searching [[place]] for [[thing]]. It was nowhere to be found.</p><p>Which is the best start for the <b>next</b> paragraph?</p>", hint: "Which links back to the search?", why: "\"The search\" links back. \"By the afternoon\" moves on.", slips: { 1: "True, but it is not about the search.", 2: "It does not link back. It is not a full sentence." } },
      why: "\"The search\" links back to the last paragraph. \"By the afternoon\" moves the time on. Both jobs in one sentence.",
      lv: { spicy: {
        options: ["That search went on all afternoon.", "The afternoon was warm and sunny.", "Later on.", "Searching for things is something lots of people do."],
        slips: { 1: "It moves the time on, but nothing links back to the search.", 2: "Not a full sentence, and it does not link back.", 3: "It mentions searching, but drifts off into a general topic." },
        hint: "Which one points back with \"that\"?",
        why: "\"That search\" links straight back to the last paragraph, and \"went on all afternoon\" moves the time on." } } },

    { type: "mc", topic: "Holding it together",
      q: "<p class=\"a2task\">[[Event]] ended at ten. Everyone went home.</p><p class=\"a2task\">___, [[who]] was the only one left in [[place]].</p><p>Which marker fills the gap best?</p>",
      options: ["An hour later", "Once upon a time", "In conclusion", "For example"],
      answer: 0,
      slips: { 1: "\"Once upon a time\" starts a whole new story, not the next part of this one.", 2: "\"In conclusion\" is for the end of an essay, not a story.", 3: "\"For example\" gives an example. Nothing is being explained here." },
      hint: "Which one tells you when?",
      ez: { q: "<p class=\"a2task\">[[Event]] ended at ten. Everyone went home.</p><p class=\"a2task\">___, [[who]] was the only one left in [[place]].</p><p>Which marker fills the gap?</p>", hint: "Which one says when?", why: "\"An hour later\" moves the time on.", slips: { 1: "That starts a new story.", 2: "That is for the end of an essay.", 3: "Nothing is explained here." } },
      why: "\"An hour later\" moves the time on from ten o'clock and keeps the story flowing.",
      lv: { spicy: {
        options: ["An hour later", "Once upon a time", "In conclusion", "Even so"],
        slips: { 1: "\"Once upon a time\" starts a whole new story.", 2: "\"In conclusion\" is for the end of an essay.", 3: "\"Even so\" sets up a contrast, but this new paragraph has moved on in time and nothing tells the reader that." },
        why: "\"An hour later\" moves the time on from ten and links to the ending of [[event]]." } } },

    { type: "mc", topic: "Holding it together", explain: true,
      q: "<p class=\"a2task\">We crept along the corridor of [[place]]. Every door was shut. Every light was off. We reached the last door and stopped.</p><p class=\"a2task\">Then [[sound]].</p><p>Why do you think the last paragraph is only one sentence long?</p>",
      options: ["To make a sudden moment stand out", "Because the writer ran out of ideas", "Because paragraphs have to be short", "To show the place has changed"],
      answer: 0,
      slips: { 1: "It might look like that, but the writer chose it. Imagine reading it out loud: what does the pause do?", 2: "Paragraphs can be any length. This one is short on purpose.", 3: "We are still at the same door. Something has <b>happened</b>, rather than moved." },
      hint: "Read it out loud in your head. What does the gap before it do?",
      ez: { hint: "What does the gap do?", why: "The gap is a pause. The big moment <b>stands out</b>." },
      why: "The break works like a pause before a big moment. Putting one sentence on its own makes it land harder.",
      lv: { mild: { q: "<p class=\"a2task\">We crept along the corridor. Every door was shut. We reached the last door and stopped.</p><p class=\"a2task\">Then [[sound]].</p><p>Why is the last part on its own?</p>",
        options: ["To make the big moment stand out", "Because the writer forgot", "To show the place has changed"],
        slips: { 1: "The writer chose it on purpose. What does the gap do?", 2: "Still the same door. Something has happened." } },
        spicy: { options: ["To make a sudden moment stand out", "Because the writer ran out of ideas", "Because the topic has changed", "To show the place has changed"],
          slips: { 1: "It is a choice, not an accident. What does the pause before it do?", 2: "It is the same moment at the same door: the topic has not moved. The break is for effect.", 3: "Still the same door. Something has <b>happened</b>, rather than moved." },
          why: "Nothing in TiPToP changes here. The writer breaks for <b>effect</b>: the white space slows the reader down, so the one sentence lands like a jump scare or a drum hit." } } },

    { type: "write", topic: "Holding it together",
      q: "<p class=\"a2task\">...[[Who]] closed the door, turned off the light and walked away.</p><p>Write the <b>first sentence or two of the next paragraph</b>. Start with a marker, and if you can, link back to what just happened. If you like, send it to Jay.</p>",
      ez: { q: "<p class=\"a2task\">...[[Who]] closed the door, turned off the light and walked away.</p><p>Write the first line of the <b>next paragraph</b>. Start with a marker.</p>" },
      starters: ["Later that night,", "Meanwhile,", "The next morning,", "Back inside,"],
      checklist: ["I started with a marker word", "I can say what changed (time, place, topic or person)", "Something links back to the last paragraph"],
      minWords: 6 }
  ],

  ez: {
    realWorld: { title: "Scene changes are everywhere", html: "<p>Films cut to a new scene. Paragraphs do the same.</p><p>A time traveller's diary would need lots!</p>" },
    make: { intro: "A clapperboard for your own scene change." }
  },
  realWorld: {
    title: "Scene changes are everywhere",
    html: "<p>Scripts mark every new scene. TV and films cut to a new place or time. Writers use paragraphs for exactly the same job.</p>" +
      "<p>When you write about a journey, every new stop is a new paragraph, and a marker tells the reader where and when you are. Think about our big question: <b>if we could time travel, should we?</b> A time traveller's diary would jump around in time and place more than anyone's. Without markers, nobody could follow it.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to a time portal, wondering which year it is">' + A.portal(80, 75, 56) + A.jay(250, 52, 0.85, "wow") +
      A.bubble(296, 6, 118, 52, "Later that\nday... 1066?", 306) + '</svg>'
  },

  make: {
    title: "Make a scene change card",
    intro: "A clapperboard for your own scene change: the marker, and the first line of the new scene. Stick it on the wall or send it to Jay.",
    fields: [
      { id: "marker", label: "Your marker", ph: "Later that night,", max: 32 },
      { id: "line", label: "The rest of the first line", ph: "the whole stage went dark.", max: 70 },
      { id: "change", label: "What changes?", ph: "Time", max: 14 }
    ],
    svg: function(v){
      function e(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ while(x.length > n){ if(cur.trim()) out.push(cur.trim()); out.push(x.slice(0, n)); x = x.slice(n); cur = ""; } if((cur + " " + x).trim().length > n){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max); }
      var m = wrap(v.marker, 22, 2), l = wrap(v.line, 34, 3);
      var stripes = "";
      for(var k = 0; k < 8; k++) stripes += '<path d="M' + (34 + k * 70) + ' 30l40 0 -24 46 -40 0z" fill="' + (k % 2 ? "#ffffff" : "#141a33") + '"/>';
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#fff4e0"/>' +
        '<rect x="24" y="30" width="552" height="46" fill="#141a33"/>' + stripes +
        '<rect x="24" y="84" width="552" height="292" rx="10" fill="#22252f"/>' +
        '<text x="48" y="122" font-family="Verdana,Arial,sans-serif" font-size="18" font-weight="700" fill="#ffd23f" letter-spacing="3">SCENE 2</text>' +
        '<text x="552" y="122" text-anchor="end" font-family="Verdana,Arial,sans-serif" font-size="16" fill="#ffffff">Change: ' + e(v.change) + '</text>' +
        '<path d="M48 136h504" stroke="#ffffff" stroke-opacity=".35" stroke-width="2"/>' +
        m.map(function(t, k){ return '<text x="48" y="' + (176 + k * 36) + '" font-family="Verdana,Arial,sans-serif" font-size="30" font-weight="700" fill="#ffd23f">' + e(t) + '</text>'; }).join("") +
        l.map(function(t, k){ return '<text x="48" y="' + (176 + m.length * 36 + 8 + k * 30) + '" font-family="Verdana,Arial,sans-serif" font-size="22" fill="#ffffff">' + e(t) + '</text>'; }).join("") +
        '<text x="552" y="360" text-anchor="end" font-family="Verdana,Arial,sans-serif" font-size="14" fill="#c9cbe0">Take 1. Lights, camera, paragraph.</text>' +
        '</svg>';
    }
  }
};
})();
