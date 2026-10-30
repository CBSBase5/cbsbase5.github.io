/* Base 5 Autumn 2 activity: The big idea.
   English. The main idea is what a whole text is mostly about. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';

function T(t){ return '<div class="a2task">' + t + '</div>'; }

/* an umbrella: the main idea covers every detail */
function umbrella(egg){
  var sc = "M110 112";
  for(var x = 110; x < 410; x += 50) sc += " Q" + (x + 25) + " 98 " + (x + 50) + " 112";
  return '<svg viewBox="0 0 520 230" role="img" aria-label="An umbrella labelled main idea, with four details sheltering under it">' +
    '<rect width="520" height="230" rx="16" fill="#eef6ff"/>' +
    [[40, 40], [70, 90], [470, 50], [450, 120], [30, 150], [490, 170]].map(function(d){ return '<path d="M' + d[0] + ' ' + d[1] + 'q-6 10 0 14q6 -4 0 -14z" fill="#22b8e6"/>'; }).join("") +
    '<path d="M110 112 Q260 -6 410 112" fill="#ff5d8f" stroke="#141a33" stroke-width="3"/>' +
    '<path d="' + sc + '" fill="#ff5d8f" stroke="#141a33" stroke-width="3"/>' +
    '<rect x="112" y="100" width="296" height="13" fill="#ff5d8f"/>' +
    '<path d="M110 112 Q260 -6 410 112" fill="none" stroke="#141a33" stroke-width="3"/>' +
    '<text x="260" y="84" text-anchor="middle" ' + F + ' font-size="20" font-weight="700" fill="#fff">Main idea</text>' +
    '<path d="M260 112 V196 q0 14 -14 14 q-12 0 -12 -12" fill="none" stroke="#141a33" stroke-width="5" stroke-linecap="round"/>' +
    [145, 207, 313, 375].map(function(cx){ return '<rect x="' + (cx - 29) + '" y="136" width="58" height="30" rx="8" fill="#fff" stroke="#22b8e6" stroke-width="2.5"/><text x="' + cx + '" y="156" text-anchor="middle" ' + F + ' font-size="13" fill="#141a33">detail</text>'; }).join("") +
    (egg ? A2ART.egg(A2ART.bird(470, 200, 0.7, "#ffd23f"), "A bird under its own tiny umbrella? No. It just likes the rain. Jay says that is the main idea of birds.") : "") +
    '</svg>';
}

/* three boxes: too small, just right, too big */
var GOLDI =
  '<svg viewBox="0 0 520 220" role="img" aria-label="Three boxes: too small, just right and too big">' +
  '<rect width="520" height="220" rx="16" fill="#fdf6e7"/>' +
  '<rect x="60" y="112" width="56" height="40" rx="6" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/>' +
  '<rect x="200" y="72" width="120" height="80" rx="8" fill="#19c39a" stroke="#141a33" stroke-width="2.5"/>' +
  '<path d="M220 112l14 14 26 -30" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<rect x="370" y="22" width="130" height="130" rx="8" fill="#8a5cf6" fill-opacity=".35" stroke="#141a33" stroke-width="2.5" stroke-dasharray="8 6"/>' +
  '<text x="88" y="180" text-anchor="middle" ' + F + ' font-size="15" font-weight="700" fill="#141a33">Too small</text>' +
  '<text x="88" y="200" text-anchor="middle" ' + F + ' font-size="13" fill="#141a33">one detail</text>' +
  '<text x="260" y="180" text-anchor="middle" ' + F + ' font-size="15" font-weight="700" fill="#141a33">Just right</text>' +
  '<text x="260" y="200" text-anchor="middle" ' + F + ' font-size="13" fill="#141a33">covers the whole text</text>' +
  '<text x="435" y="180" text-anchor="middle" ' + F + ' font-size="15" font-weight="700" fill="#141a33">Too big</text>' +
  '<text x="435" y="200" text-anchor="middle" ' + F + ' font-size="13" fill="#141a33">could be anything</text>' +
  '</svg>';

/* a newspaper: the headline is the main idea in a few words */
var PAPER =
  '<svg viewBox="0 0 520 220" role="img" aria-label="A newspaper. The headline is the main idea in a few words.">' +
  '<rect width="520" height="220" rx="16" fill="#eef1f6"/>' +
  '<g transform="rotate(-3 200 110)"><rect x="40" y="20" width="300" height="186" rx="4" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
  '<text x="190" y="46" text-anchor="middle" font-family="Georgia,serif" font-size="16" font-weight="700" fill="#141a33">THE DAILY GIST</text>' +
  '<path d="M56 54h268" stroke="#141a33" stroke-width="2"/>' +
  '<rect x="56" y="64" width="268" height="34" fill="#ffd23f" fill-opacity=".55"/>' +
  '<text x="190" y="88" text-anchor="middle" ' + F + ' font-size="19" font-weight="700" fill="#141a33">BIG IDEA HERE</text>' +
  [112, 124, 136, 148, 160, 172, 184].map(function(y){ return '<path d="M56 ' + y + 'h122M200 ' + y + 'h124" stroke="#9aa0b8" stroke-width="5" stroke-linecap="round"/>'; }).join("") +
  '</g>' +
  '<path d="M350 82 C390 70 400 60 412 60" fill="none" stroke="#e04848" stroke-width="3"/><path d="M342 84l12 -8 -2 12z" fill="#e04848"/>' +
  '<text x="418" y="56" ' + F + ' font-size="14" font-weight="700" fill="#141a33">headline:</text>' +
  '<text x="418" y="76" ' + F + ' font-size="13" fill="#141a33">the main idea</text>' +
  '<text x="418" y="94" ' + F + ' font-size="13" fill="#141a33">in a few words</text>' +
  '<text x="418" y="150" ' + F + ' font-size="13" fill="#141a33">the rest:</text>' +
  '<text x="418" y="168" ' + F + ' font-size="13" fill="#141a33">the details</text>' +
  '</svg>';

/* paragraphs into a funnel: one point from each, one big idea out */
function funnel(n){
  var w = 420 / n;
  return '<svg viewBox="0 0 520 240" role="img" aria-label="Each paragraph gives one main point. Together they make the big idea.">' +
    '<rect width="520" height="240" rx="16" fill="#f1fbf6"/>' +
    Array.apply(null, Array(n)).map(function(_, k){
      var x = 50 + k * w;
      return '<rect x="' + (x + 6) + '" y="16" width="' + (w - 12) + '" height="50" rx="6" fill="#fff" stroke="#141a33" stroke-width="2"/>' +
        '<text x="' + (x + w / 2) + '" y="38" text-anchor="middle" ' + F + ' font-size="14" font-weight="700" fill="#141a33">Paragraph ' + (k + 1) + '</text>' +
        '<text x="' + (x + w / 2) + '" y="56" text-anchor="middle" ' + F + ' font-size="13" fill="#1f9d63">one point</text>';
    }).join("") +
    '<path d="M80 84 H440 L300 160 V184 H220 V160 Z" fill="#19c39a" fill-opacity=".35" stroke="#141a33" stroke-width="2.5"/>' +
    '<rect x="130" y="192" width="260" height="36" rx="10" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/>' +
    '<text x="260" y="216" text-anchor="middle" ' + F + ' font-size="15" font-weight="700" fill="#141a33">the big idea</text>' +
    '</svg>';
}

var JAYCAR = '<svg viewBox="0 0 420 150" role="img" aria-label="Jay, looking thoughtful">' + A2ART.jay(90, 48, 0.85, "hmm") +
  A2ART.bubble(160, 18, 220, 56, "Mostly about\nthe car park?", 172) + '</svg>';

var BONSOCK = '<svg viewBox="0 0 360 160" role="img" aria-label="Bonnie the poodle with a sock">' +
  A2ART.bonnie(150, 92, 1.2, "sit") +
  A2ART.egg('<g transform="translate(232 112) rotate(-20)"><path d="M0 0h18v30q0 8 8 8h16v14h-26q-16 0 -16 -16z" fill="#ff5d8f" stroke="#141a33" stroke-width="2"/><path d="M0 8h18M0 16h18" stroke="#fff" stroke-width="3"/></g>',
    "Bonnie says this sock is hers now. Outrageous.") +
  '</svg>';

/* ---------- the texts ---------- */
var TX1 = {
  mild: T("[[Name]] got up early. They packed their [[kit]] and checked it twice. They had a quick breakfast. Then they set off for [[event]]."),
  medium: T("[[Name]] got up at six. They packed their [[kit]] and checked it twice. Next door's cat was sitting on the wall, as usual. They had a quick breakfast, then set off for [[event]] with plenty of time to spare."),
  spicy: T("The alarm went at five, but [[Name]] was already awake. The [[kit]] had been packed and unpacked three times. Breakfast sat on the plate, cold and untouched. Today was [[event]], and everything had to go perfectly.")
};
var TX2 = {
  mild: T("[[Place]] gets busy on a Saturday. People queue at the doors from nine. The car park is full by ten. Even the cafe runs out of seats."),
  medium: T("<p>[[Place]] gets busy on a Saturday. People queue at the doors from nine, and the car park is full by ten.</p><p>On a Tuesday, it is a different story. You can wander in at lunchtime and have the cafe all to yourself.</p>"),
  spicy: T("<p>Ask anyone who works at [[place]] about Saturdays and they will sigh. Queues form at the doors by nine. By ten, drivers are circling the car park like sharks.</p><p>Yet come back on a Tuesday and you could hear a pin drop. Staff say they would happily swap one packed Saturday for two steady weekdays.</p>")
};
var TX3 = {
  mild: T("[[Event]] got off to a bad start. Ten minutes in, [[snag]]. [[Name]] stayed calm and fixed it. By the end, [[win]]. Then [[Name]] went home and had a cup of tea."),
  medium: T("<p><b>1.</b> [[Event]] got off to a bad start. Ten minutes in, [[snag]]. Nobody knew what to do, and a few [[crowd]] started to panic.</p>" +
    "<p><b>2.</b> [[Name]] stayed calm. They grabbed the [[kit]], called [[boss]] and made a plan. Bit by bit, things got back on track.</p>" +
    "<p><b>3.</b> By the end, [[win]]. Afterwards, [[boss]] said [[Name]] had saved the day. [[Name]] just wanted a cup of tea.</p>"),
  spicy: T("<p><b>1.</b> [[Event]] got off to a bad start. Ten minutes in, [[snag]]. Nobody knew what to do, and a few [[crowd]] started to panic.</p>" +
    "<p><b>2.</b> [[Name]] stayed calm. They grabbed the [[kit]], called [[boss]] and made a plan. Bit by bit, things got back on track.</p>" +
    "<p><b>3.</b> By the end, [[win]]. Afterwards, [[boss]] said [[Name]] had saved the day. [[Name]] just wanted a cup of tea.</p>" +
    "<p><b>4.</b> Not everyone was celebrating, though. Some [[crowd]] asked why the problem had happened at all, and whether the checks before [[event]] had been rushed. [[Boss]] promised to look into it.</p>")
};

(window.A2PACKS = window.A2PACKS || {})["main-idea"] = {
  a2: true,
  id: "a2-main-idea",
  title: "The big idea",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "The main idea is what a whole text is mostly about. The details shelter underneath it.",
  blurb: "Finding the big idea: what a text is mostly about, not too small and not too big. Four short chunks, with a front page to make at the end.",
  note: "Finding the big idea in a text. Four five minute chunks, and a front page to make at the end. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Snapshot", line: "Snapshot: short texts, one big idea to find." },
    { id: "medium", name: "Highlights", line: "Highlights: texts with more than one paragraph, main points and the details that back them up." },
    { id: "spicy", name: "Full story", line: "Full story: longer texts, hidden main ideas, and summing it all up in one sentence." }
  ],
  themes: {
    time: { name: "Time travel", w: { name: "Nova", place: "the time station", kit: "manual", event: "the trip to 1850", crowd: "passengers", boss: "the pilot", snag: "the portal began to flicker", win: "they landed safely in 1850" } },
    football: { name: "Football", w: { name: "Dex", place: "the stadium", kit: "radio", event: "the cup final", crowd: "fans", boss: "the coach", snag: "the floodlights failed", win: "the team won 2 1" } },
    horror: { name: "Horror", w: { name: "Mags", place: "the old hotel", kit: "torch", event: "the night shift", crowd: "guests", boss: "the night manager", snag: "the lift jammed between floors", win: "everyone made it through to morning" } },
    fishing: { name: "Fishing", w: { name: "Finn", place: "the lake", kit: "radio", event: "the fishing match", crowd: "anglers", boss: "the organiser", snag: "a storm rolled in across the water", win: "the match finished on time" } },
    music: { name: "Music", w: { name: "Rosa", place: "the theatre", kit: "headset", event: "opening night", crowd: "people in the audience", boss: "the director", snag: "the curtain got stuck halfway", win: "the audience stood and clapped" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: umbrella(false),
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "What is it mostly about?", title: "The main idea is the umbrella",
      fig: umbrella(true),
      html: "<p>The <b>main idea</b> is what the whole text is <b>mostly about</b>.</p>" +
        "<p>The <b>details</b> are the smaller bits that tell you more. They all shelter under the main idea, like people under one big umbrella.</p>" +
        "<p>A handy question: <b>what do all the sentences have in common?</b></p>",
      ez: { html: "<p>The <b>main idea</b> is what the text is <b>mostly about</b>.</p><p>The <b>details</b> shelter under it, like an umbrella.</p>" },
      lv: { spicy: { html: "<p>The <b>main idea</b> is what the whole text is <b>mostly about</b>. The <b>details</b> shelter underneath it.</p>" +
        "<p>Sometimes a writer says the main idea straight out. Often they do not: you work it out by asking <b>what all the details have in common</b>.</p>" +
        "<p>A main idea is usually a short sentence, not just a word. \"Nerves\" is a topic. \"Nova is too nervous to eat\" is an idea.</p>" } } },

    { type: "mc", topic: "What is it mostly about?",
      q: "Have a read. What is this text mostly about?" + TX1.mild,
      options: ["[[Name]] getting ready for [[event]].", "[[Name]] having breakfast.", "[[Name]] being late."],
      answer: 0,
      slips: { 1: "Breakfast is in one sentence. It is a detail, not the whole text.", 2: "They got up early, so the text never says they were late." },
      hint: "What do all four sentences have in common?",
      why: "Every sentence is part of getting ready: getting up, packing, breakfast, setting off. That is the main idea.",
      ez: { q: "What is this <b>mostly</b> about?" + TX1.mild, slips: { 1: "Breakfast is just 1 sentence.", 2: "They got up early. Not late." },
        hint: "What do all 4 sentences share?", why: "Every sentence is about getting ready." },
      lv: {
        medium: { q: "Have a read. What is this text mostly about?" + TX1.medium,
          options: ["[[Name]] getting ready for [[event]].", "Next door's cat.", "[[Name]] having breakfast.", "[[Name]] loving cats."],
          slips: { 1: "The cat gets one sentence. It is a detail, and not even about [[Name]]'s plans.", 2: "Breakfast is one small detail.", 3: "The text never says how [[Name]] feels about cats." },
          why: "Getting up, packing, breakfast, setting off: they are all part of getting ready. The cat is just a bit of colour." },
        spicy: { q: "This one never says its main idea straight out. What is it mostly about?" + TX1.spicy,
          options: ["[[Name]] is too wound up about [[event]] to think about anything else.", "[[Name]] does not like breakfast.", "[[Name]] owns a [[kit]].", "[[Event]] goes perfectly."],
          slips: { 1: "The cold breakfast is a clue to the main idea, not the main idea itself.", 2: "True, but tiny. It does not cover the whole text.", 3: "The text stops before [[event]]. It never says how it goes." },
          hint: "Awake before the alarm, packing three times, not eating. What do those have in common?",
          why: "Awake early, packing again and again, not eating: every detail points to nerves about the big day." } } },

    { type: "mc", topic: "What is it mostly about?",
      q: "Same text. Which one is a <b>detail</b>, not the main idea?" + TX1.mild,
      options: ["They had a quick breakfast.", "[[Name]] gets ready for [[event]].", "Getting ready for a big day."],
      answer: 0,
      slips: { 1: "That one covers every sentence, so it is the main idea.", 2: "That is the main idea said another way. It covers the whole text." },
      hint: "A detail is only in one sentence.",
      why: "Breakfast is one small part of the text. It sits under the umbrella.",
      ez: { q: "Which one is a <b>detail</b>?" + TX1.mild, slips: { 1: "That covers it all. It is the main idea.", 2: "That covers it all too." },
        hint: "A detail is in 1 sentence.", why: "Breakfast is 1 small part." },
      lv: {
        medium: { q: "Same text. Which one is a <b>detail</b>, not the main idea?" + TX1.medium,
          options: ["Next door's cat was sitting on the wall.", "[[Name]] gets ready for [[event]].", "Getting ready for a big day."] },
        spicy: { q: "Same text. Which one is a <b>detail</b> that backs up the main idea?" + TX1.spicy,
          options: ["Breakfast sat on the plate, cold and untouched.", "[[Name]] is nervous about the big day.", "It is about nerves."],
          slips: { 1: "That covers the whole text: it is the main idea.", 2: "That is the topic. It is bigger than a detail." },
          hint: "Look for one exact thing from one sentence.",
          why: "The untouched breakfast is one detail. It backs up the main idea: [[Name]] is too nervous to eat." } } },

    { type: "sort", topic: "What is it mostly about?",
      q: "Sort them. The whole text, or one small part?" + TX1.mild,
      buckets: ["Main idea", "Detail"],
      cards: [["[[Name]] gets ready for [[event]].", 0], ["They checked the [[kit]] twice.", 1], ["They got up early.", 1], ["They had breakfast.", 1]],
      hint: "Only one card covers every sentence.",
      why: "One card covers everything. The rest are details that tell you more about it.",
      ez: { hint: "Only 1 card covers it all.", why: "1 card covers it all. The rest are details." },
      lv: {
        medium: { q: "Sort them. The whole text, or one small part?" + TX1.medium,
          cards: [["[[Name]] gets ready for [[event]].", 0], ["They checked the [[kit]] twice.", 1], ["Next door's cat sat on the wall.", 1], ["They left with time to spare.", 1], ["They got up at six.", 1]] },
        spicy: { q: "Sort them. The main idea, a detail that backs it up, or not in the text at all?" + TX1.spicy,
          buckets: ["Main idea", "Detail", "Not in the text"],
          cards: [["[[Name]] is wound up about the big day.", 0], ["The [[kit]] was packed three times.", 1], ["[[Name]] woke before the alarm.", 1], ["[[Name]] missed the bus.", 2], ["[[Event]] was cancelled.", 2]],
          why: "One idea covers it all. Two details back it up. The bus and the cancelling are never mentioned: be careful not to add things." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Not too small, not too big", title: "A main idea should be just right",
      fig: GOLDI,
      html: "<p><b>Too small:</b> one detail. \"The car park\" is not what a whole text is about.</p>" +
        "<p><b>Too big:</b> so wide it could be about anything. \"People go places\" fits a million texts.</p>" +
        "<p><b>Just right:</b> it covers every sentence in the text, and nothing more.</p>",
      ez: { title: "Just right", html: "<p><b>Too small</b>: 1 detail. <b>Too big</b>: could be about anything.</p><p><b>Just right</b>: covers the whole text.</p>" } },

    { type: "mc", topic: "Not too small, not too big", explain: true,
      q: "Jay reads this text and says it is mostly about <b>the car park</b>. What do you reckon?" + TX2.mild,
      fig: JAYCAR,
      options: ["Too small: the car park is just one detail.", "Just right.", "Too big."],
      answer: 0, fixed: true,
      slips: { 1: "The car park is only in one sentence. What about the queue and the cafe?", 2: "Too big would be something like \"buildings\". The car park is the opposite: one tiny part." },
      hint: "How many sentences talk about the car park?",
      why: "The car park is in one sentence. The queue and the cafe are about something bigger: how busy it gets.",
      ez: { q: "Jay says it is about <b>the car park</b>. What do you think?" + TX2.mild,
        slips: { 1: "The car park is 1 sentence. What about the rest?", 2: "Too big would be something like buildings." },
        why: "The car park is 1 sentence. The text is about busy Saturdays." },
      lv: { medium: { q: "Jay reads this text and says it is mostly about <b>the car park</b>. What do you reckon?" + TX2.medium },
            spicy: { q: "Jay reads this text and says it is mostly about <b>the car park</b>. What do you reckon?" + TX2.spicy,
              why: "The car park sharks are a fun detail, but they are one sentence. The text is about how busy Saturdays are compared with the rest of the week." } } },

    { type: "mc", topic: "Not too small, not too big",
      q: "Which is the main idea? Not too small, not too big." + TX2.mild,
      options: ["[[Place]] is very busy on Saturdays.", "The cafe runs out of seats.", "Lots of places are busy.", "[[Place]] is closed on Saturdays."],
      answer: 0,
      slips: { 1: "Too small: the cafe is one detail.", 2: "Too big: that could be about anywhere. This text is about one place.", 3: "The text says the opposite: people queue to get in." },
      hint: "Which one covers the queue, the car park and the cafe?",
      why: "The queue, the car park and the cafe all show the same thing: Saturdays are busy.",
      ez: { slips: { 2: "Too big. This text is about 1 place.", 3: "No. People queue to get in." }, hint: "Which one covers it all?",
        why: "The queue, car park and cafe all show <b>busy Saturdays</b>." },
      lv: {
        medium: { q: "Which is the main idea of the whole text? Not too small, not too big." + TX2.medium,
          options: ["[[Place]] is packed on Saturdays but quiet in the week.", "[[Place]] is very busy on Saturdays.", "The cafe is quiet on a Tuesday.", "Every place is quieter on a Tuesday."],
          slips: { 1: "That only covers paragraph 1. What does paragraph 2 add?", 2: "Too small: that is one detail from paragraph 2.", 3: "Too big: this text is about one place, not everywhere." },
          hint: "Each paragraph has its own point. The main idea needs both.",
          why: "Paragraph 1: packed on Saturdays. Paragraph 2: quiet on Tuesdays. The main idea joins them." },
        spicy: { q: "Which is the main idea of the whole text? Not too small, not too big." + TX2.spicy,
          options: ["Saturdays at [[place]] are packed, and staff wish visitors were spread across the week.", "[[Place]] is quiet on Tuesdays.", "Drivers circle the car park like sharks.", "Weekends are busy everywhere."],
          slips: { 1: "That is half of it. What about Saturdays, and what the staff want?", 2: "A great detail, but it is one sentence.", 3: "Too big: the text is about one place." },
          hint: "Look for the one that includes the last sentence too.",
          why: "Busy Saturdays, quiet Tuesdays, and staff who would swap one for the other: the best main idea covers all three." } } },

    { type: "text", topic: "Not too small, not too big",
      q: "In your own words, what is the text mostly about? A few words is plenty." + TX2.mild,
      need: [["busy", "crowded", "full", "packed", "queue", "lots of people", "rammed", "heaving", "popular"]],
      model: "[[Place]] gets really busy on Saturdays.",
      slips: [[["car park", "cafe", "seats"], "That is one detail. Try to cover the whole text: what do the queue, the car park and the cafe show?"]],
      hint: "One word for lots of people everywhere would do it.",
      why: "Anything like \"it gets really busy on Saturdays\" is just right.",
      ez: { q: "What is it mostly about? A few words is fine." + TX2.mild,
        slips: [[["car park", "cafe", "seats"], "That is 1 detail. What does the whole text show?"]],
        hint: "One word for lots of people?", why: "Like: it gets really busy on Saturdays." },
      lv: {
        medium: { q: "In your own words, what is the whole text mostly about? One sentence is plenty." + TX2.medium,
          need: [["busy", "crowded", "full", "packed", "queue", "rammed", "heaving", "popular"], ["quiet", "calm", "empty", "tuesday", "week", "weekday", "peaceful"]],
          model: "[[Place]] is packed on Saturdays but quiet in the week.",
          slips: [[["car park", "cafe", "seats"], "That is one detail. Try to cover both paragraphs."]],
          hint: "One part about Saturday, one part about the rest of the week.",
          why: "A good main idea covers both paragraphs: busy at the weekend, quiet in the week." },
        spicy: { q: "In your own words, what is the whole text mostly about? One sentence is plenty." + TX2.spicy,
          need: [["busy", "crowded", "full", "packed", "queue", "rammed", "heaving", "popular", "saturday", "saturdays", "weekend"], ["quiet", "calm", "empty", "tuesday", "week", "weekday", "peaceful", "staff", "spread", "swap"]],
          model: "Saturdays at [[place]] are packed, and staff wish visits were spread across the week.",
          slips: [[["shark", "sharks"], "The sharks are a fun detail, but a main idea covers the whole text."]],
          hint: "Busy when? Quiet when? And what would the staff like?",
          why: "The best answers cover the busy Saturdays and the quiet weekdays, and the strongest ones mention what the staff want." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Headlines and titles", title: "A headline is the main idea, squeezed",
      fig: PAPER,
      html: "<p>A good <b>headline</b> or <b>title</b> is the main idea squeezed into a few words.</p>" +
        "<p>Readers often use it to decide whether to read on, so it has to fit the whole text: not too small, not too big.</p>",
      ez: { title: "Headlines", html: "<p>A <b>headline</b> is the main idea in a few words.</p><p>It has to fit the whole text.</p>" },
      lv: { spicy: { html: "<p>A good <b>headline</b> or <b>title</b> is the main idea squeezed into a few words.</p>" +
        "<p>Clever headlines play with words, but they still have to fit the whole text. A headline that only fits one paragraph is too small, however catchy it sounds.</p>" } } },

    { type: "mc", topic: "Headlines and titles",
      q: "Which headline fits the Saturday text best?" + TX2.mild,
      options: ["Saturday crowds at [[place]]", "The car park", "Britain at the weekend", "A quiet day out"],
      answer: 0,
      slips: { 1: "Too small: one detail.", 2: "Too big: the text is about one place, not the whole country.", 3: "The text says the opposite. It is busy." },
      hint: "Which one covers the queue, the car park and the cafe?",
      why: "\"Saturday crowds\" sums up the main idea in three words.",
      ez: { slips: { 2: "Too big. It is about 1 place.", 3: "No. It is busy." }, why: "<b>Saturday crowds</b> sums it up." },
      lv: {
        medium: { q: "Which headline fits the whole text best?" + TX2.medium,
          options: ["Packed Saturdays, peaceful Tuesdays", "Saturday crowds", "The car park", "A day out"],
          slips: { 1: "That only fits paragraph 1.", 2: "Too small: one detail.", 3: "Too big: it could be about any day anywhere." },
          hint: "It needs both paragraphs.",
          why: "\"Packed Saturdays, peaceful Tuesdays\" covers both paragraphs in four words." },
        spicy: { q: "Which headline fits the whole text best?" + TX2.spicy,
          options: ["Staff dream of quieter Saturdays", "Sharks in the car park", "Tuesday at [[place]]", "Busy Britain"],
          slips: { 1: "Catchy, but it only fits one sentence.", 2: "Too small: that is only paragraph 2.", 3: "Too big, and the text is about one place." },
          hint: "Which one includes the people the text ends with?",
          why: "It covers the busy Saturdays, the contrast, and what staff wish for." } } },

    { type: "match", topic: "Headlines and titles",
      q: "Match each little text to its title.",
      pairs: [["[[Name]] fell asleep on the bus and woke up at the end of the line. They had to walk two miles home in the rain.", "A long way home"],
        ["The cafe at [[place]] has a new lemon cake. It sells out by lunchtime every day.", "The cake everyone wants"],
        ["Bonnie found a sock under the sofa. She carried it round all day like a prize.", "Bonnie's big find"]],
      hint: "Read each one and ask: what is it mostly about?",
      why: "Each title squeezes one whole little text into a few words.",
      ez: { hint: "What is each one mostly about?", why: "Each title sums up 1 little text." },
      lv: {
        medium: { pairs: [["[[Name]] fell asleep on the bus and woke up at the end of the line. They had to walk two miles home in the rain.", "Missed my stop"],
          ["The cafe at [[place]] has a new lemon cake. It sells out by lunchtime every day.", "Gone by noon"],
          ["Bonnie found a sock under the sofa. She carried it round all day like a prize.", "Treasure under the sofa"]],
          hint: "These titles are a bit sneaky. Look for the one word that links to each text." },
        spicy: { pairs: [["[[Name]] fell asleep on the bus and woke up at the end of the line. They had to walk two miles home in the rain.", "Missed my stop"],
          ["The cafe at [[place]] has a new lemon cake. It sells out by lunchtime every day.", "Gone by noon"],
          ["Bonnie found a sock under the sofa. She carried it round all day like a prize.", "Treasure under the sofa"],
          ["The bell rang five minutes early by mistake. Half the class packed up and left before anyone noticed.", "The bell that lied"]],
          hint: "Clever titles hint rather than tell. Match the hint to the whole text." } } },

    { type: "mc", topic: "Headlines and titles",
      q: "The Bonnie text: \"Bonnie found a sock under the sofa. She carried it round all day like a prize.\" Which title is <b>too small</b>?",
      fig: BONSOCK,
      options: ["The sofa", "Bonnie's big find", "Dogs"],
      answer: 0, fixed: true,
      slips: { 1: "That one is just right: it covers the whole text.", 2: "\"Dogs\" is too big: it could be about any dog anywhere." },
      hint: "Which one is only one detail?",
      why: "The sofa is just where the sock was. The text is about Bonnie and her prize.",
      ez: { q: "\"Bonnie found a sock under the sofa. She carried it round all day like a prize.\" Which title is <b>too small</b>?",
        slips: { 1: "That one is just right.", 2: "Dogs is too big." }, hint: "Which one is just 1 detail?", why: "The sofa is just where the sock was." },
      lv: { spicy: { q: "The Bonnie text: \"Bonnie found a sock under the sofa. She carried it round all day like a prize.\" Which title is <b>too big</b>?",
        options: ["Pets and their habits", "Bonnie's big find", "The sofa"],
        slips: { 1: "That one is just right.", 2: "That one is too small: one detail." },
        hint: "Which one could be about any animal at all?",
        why: "\"Pets and their habits\" could be a whole book. The text is one dog and one sock." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "The whole text", title: "One last text: the big idea",
      fig: umbrella(false),
      html: "<p>Last one. Read it once, all the way through. Then ask: <b>what is it mostly about?</b></p>" + TX3.mild,
      ez: { title: "The big idea", html: "<p>Read it all. What is it <b>mostly about</b>?</p>" + TX3.mild },
      lv: {
        medium: { fig: funnel(3),
          html: "<p>Longer texts have a <b>main point in each paragraph</b>. Put the points together and you get the big idea.</p>" +
            "<p>Each point has details that back it up. Read it once, all the way through.</p>" + TX3.medium },
        spicy: { fig: funnel(4),
          html: "<p>A <b>summary</b> gives the main point of each paragraph in as few words as possible. No small details, nothing added.</p>" +
            "<p>Watch the last paragraph: endings often change the big idea.</p>" + TX3.spicy } } },

    { type: "mc", topic: "The whole text", explain: true,
      q: "What is the text mostly about?" + TX3.mild,
      options: ["[[Name]] fixes a problem at [[event]].", "[[Name]] has a cup of tea.", "[[Name]] gets lost."],
      answer: 0,
      slips: { 1: "The tea is one detail right at the end.", 2: "Nobody gets lost in this text." },
      hint: "Most of the sentences are about a problem and what happened to it.",
      why: "A bad start, [[Name]] fixes it, it ends well. The main idea: [[Name]] fixes a problem.",
      ez: { slips: { 1: "The tea is 1 detail at the end.", 2: "Nobody gets lost." }, hint: "Most of it is about a problem.",
        why: "A bad start. [[Name]] fixes it. It ends well." },
      lv: {
        medium: { q: "What is the main point of <b>paragraph 2</b>?" + TX3.medium,
          options: ["[[Name]] stays calm and sorts the problem out.", "[[Name]] calls [[boss]].", "Things go badly at the start.", "[[Name]] wants a cup of tea."],
          slips: { 1: "That is one detail inside paragraph 2.", 2: "That is the point of paragraph 1.", 3: "That is a detail from paragraph 3." },
          hint: "Every sentence in paragraph 2 is about what [[Name]] does.",
          why: "Grabbing the [[kit]], calling for help, making a plan: they all show [[Name]] staying calm and sorting it." },
        spicy: { q: "Which is the best summary of the whole text?" + TX3.spicy,
          options: ["A problem at [[event]] was fixed because [[Name]] stayed calm, but some [[crowd]] want to know why it happened.",
            "[[Name]] saved the day at [[event]].",
            "Ten minutes in, [[snag]], so [[Name]] grabbed the [[kit]] and called [[boss]].",
            "Problems happen and people fix them."],
          slips: { 1: "Good, but it leaves out paragraph 4: not everyone is happy.", 2: "Too much detail from the start, and nothing about the end.", 3: "Too big: that could sum up a million texts." },
          hint: "The best summary has something from every paragraph, and no small details.",
          why: "It covers the problem, the calm fix, the good ending and the questions afterwards, in one sentence." } } },

    { type: "multi", topic: "The whole text",
      q: "The big idea is: <b>[[Name]] saved the day</b>. Pick the <b>two</b> details that back it up." + TX3.mild,
      options: ["[[Name]] stayed calm and fixed it.", "By the end, [[win]].", "[[Name]] went home and had a cup of tea.", "[[Event]] got off to a bad start."],
      answers: [0, 1],
      hint: "Which details show [[Name]] making things better?",
      why: "Fixing it and the good ending back up \"saved the day\". The tea is just a detail, and the bad start is the problem, not the saving.",
      ez: { q: "Big idea: <b>[[Name]] saved the day</b>. Pick the <b>2</b> details that show it." + TX3.mild,
        hint: "Which show [[Name]] making it better?", why: "Fixing it and the good ending show it." },
      lv: {
        medium: { q: "Paragraph 2's main point: <b>[[Name]] stays calm and sorts it out</b>. Pick the <b>two</b> details that back it up." + TX3.medium,
          options: ["They grabbed the [[kit]], called [[boss]] and made a plan.", "Bit by bit, things got back on track.", "A few [[crowd]] started to panic.", "[[Name]] just wanted a cup of tea."],
          answers: [0, 1],
          why: "The plan and getting back on track show the calm fix. The panic is from paragraph 1, and the tea is a detail from the end." },
        spicy: { q: "Which <b>three</b> belong in a summary? Main points only, not small details." + TX3.spicy,
          options: ["There was a serious problem early on.", "[[Name]] stayed calm and fixed it.", "Some people want to know why it happened.", "[[Name]] wanted a cup of tea.", "[[Boss]] got a phone call."],
          answers: [0, 1, 2],
          hint: "One point from paragraph 1, one from 2 and 3, one from 4.",
          why: "Problem, fix, questions afterwards. The tea and the phone call are details, so they stay out of a summary." } } },

    { type: "text", topic: "The whole text", stretch: true,
      q: "Finish the big idea in a few words: \"[[Name]] ...\"" + TX3.mild,
      need: [["fix", "fixed", "sorted", "saved", "calm", "solved", "helped", "stopped", "rescued", "dealt"]],
      model: "[[Name]] stayed calm and fixed the problem.",
      slips: [[["tea"], "The tea is a tiny detail at the end. What did [[Name]] do about the problem?"]],
      hint: "What did [[Name]] do about the problem?",
      why: "\"[[Name]] stayed calm and fixed the problem\" covers the whole text.",
      ez: { slips: [[["tea"], "The tea is a tiny detail. What did [[Name]] do?"]], why: "Like: [[Name]] stayed calm and fixed the problem." },
      lv: {
        medium: { q: "Write the big idea of the <b>whole</b> text in one sentence." + TX3.medium,
          need: [["fix", "fixed", "sorted", "saved", "calm", "solved", "helped", "rescued", "dealt"], ["bad", "problem", "trouble", "start", "mess", "disaster", "panic", "issue"]],
          model: "A bad start was turned round because [[Name]] stayed calm.",
          hint: "Join the three paragraph points: bad start, calm fix, happy ending.",
          why: "Something like \"a bad start was turned round because [[Name]] stayed calm\" covers all three paragraphs." },
        spicy: { q: "Write a one sentence summary of the whole text. Aim for under 30 words." + TX3.spicy,
          need: [["calm", "fix", "fixed", "sorted", "saved", "solved", "rescued", "dealt"], ["question", "questions", "checks", "rushed", "agree", "blame", "why", "should", "look into", "investigate"]],
          model: "[[Name]] calmly fixed a bad problem at [[event]], but some people think the checks were rushed.",
          hint: "Problem, fix, and the questions at the end. Leave the tea out.",
          why: "The strongest summaries cover the fix and the doubts at the end, without the small details." } } }
  ],

  ez: {
    realWorld: { html: "<p>Long messages, news, letters: look for the <b>big idea</b> first.</p><p>A newspaper from the future? Read the headline first!</p>" },
    make: { intro: "Pick something that happened. Give it a headline and a big idea. Send it to Jay if you like." }
  },

  realWorld: {
    title: "Getting the gist",
    html: "<p>Skimming a long message, a news story or a letter from school: you look for the big idea first, then the details you need.</p>" +
      "<p>For our big question, <b>if we could time travel, should we?</b> Picture it: you jump a hundred years ahead and find a newspaper. The portal closes in one minute. What do you read first? The headline, and the big idea.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A time portal next to Jay">' + A2ART.portal(80, 75, 58) + A2ART.jay(250, 50, 0.85, "wow") +
      A2ART.bubble(300, 6, 112, 52, "One minute.\nHeadline!", 304) + '</svg>'
  },

  make: {
    title: "Make a front page",
    intro: "Something that happened to you, a film you watched, a day out: give it a headline and a big idea. Keep it, or send it to Jay.",
    fields: [
      { id: "head", label: "Headline", ph: "Bonnie steals the show", max: 40 },
      { id: "idea", label: "The big idea, in one sentence", ph: "A small poodle caused a big fuss at the school fair.", max: 100 },
      { id: "detail", label: "One detail that backs it up", ph: "She ran off with the raffle prize.", max: 70 },
      { id: "by", label: "Reporter", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      function e(t){ return String(t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n, max){ var w = String(t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if(cur && (cur + " " + x).length > n){ out.push(cur); cur = x; } else cur = cur ? cur + " " + x : x; }); if(cur) out.push(cur); return out.slice(0, max); }
      var hl = wrap(String(v.head).toUpperCase(), 24, 2), idea = wrap(v.idea, 42, 3), det = wrap(v.detail, 50, 2);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">' +
        '<rect width="600" height="420" rx="18" fill="#fbf8f0"/>' +
        '<rect x="16" y="16" width="568" height="388" rx="6" fill="#fff" stroke="#141a33" stroke-width="3"/>' +
        '<text x="300" y="58" text-anchor="middle" font-family="Georgia,serif" font-size="30" font-weight="700" fill="#141a33">THE DAILY GIST</text>' +
        '<path d="M36 72h528M36 78h528" stroke="#141a33" stroke-width="2"/>' +
        hl.map(function(l, k){ return '<text x="40" y="' + (122 + k * 40) + '" font-family="Verdana,Arial,sans-serif" font-size="28" font-weight="700" fill="#e04848">' + e(l) + '</text>'; }).join("") +
        idea.map(function(l, k){ return '<text x="40" y="' + (218 + k * 28) + '" font-family="Verdana,Arial,sans-serif" font-size="20" font-weight="700" fill="#141a33">' + e(l) + '</text>'; }).join("") +
        '<path d="M40 302h520" stroke="#c9c4b4" stroke-width="2"/>' +
        det.map(function(l, k){ return '<text x="40" y="' + (330 + k * 24) + '" font-family="Verdana,Arial,sans-serif" font-size="17" fill="#3b4060">' + e(l) + '</text>'; }).join("") +
        '<text x="560" y="390" text-anchor="end" font-family="Verdana,Arial,sans-serif" font-size="15" fill="#5b6180">By ' + e(v.by) + '</text>' +
        '</svg>';
    }
  }
};
})();
