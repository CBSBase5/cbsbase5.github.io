/* Base 5 Autumn 2 activity: Join the dots.
   English. Connecting details from different parts of a text to
   reach an idea that none of them says on its own. ASCII only. */
(function(){
var A = window.A2ART;
var F = "Verdana,Arial,sans-serif";
function T(x, y, t, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" font-family="' + F + '" font-size="' + (o.s || 15) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.f || "#141a33") + '">' + t + '</text>';
}
function star(x, y, r, col){
  var p = [];
  for(var k = 0; k < 10; k++){ var a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.45 : r; p.push((x + rr * Math.cos(a)).toFixed(1) + "," + (y + rr * Math.sin(a)).toFixed(1)); }
  return '<polygon points="' + p.join(" ") + '" fill="' + (col || "#ffd23f") + '" stroke="#141a33" stroke-width="2"/>';
}
function dots(a, b){ return '<div class="a2task"><p style="margin:0 0 10px"><b>Dot 1:</b> ' + a + '</p><p style="margin:0"><b>Dot 2:</b> ' + b + '</p></div>'; }

/* two dots joined, pointing at an idea */
var JOIN =
  '<svg viewBox="0 0 520 220" role="img" aria-label="Detail one and detail two are joined by a line, and together they point to an idea">' +
  '<rect width="520" height="220" rx="16" fill="#1d2147"/>' +
  [[30, 30], [480, 40], [140, 200], [400, 190], [250, 20], [60, 150], [470, 140]].map(function(p){ return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2" fill="#ffffff" fill-opacity=".6"/>'; }).join("") +
  '<path d="M110 70L110 160" stroke="#ffd23f" stroke-width="4" stroke-dasharray="8 6"/>' +
  '<path d="M110 115H330" stroke="#ffd23f" stroke-width="4" marker-end="url(#jdA)"/>' +
  '<defs><marker id="jdA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#ffd23f"/></marker></defs>' +
  star(110, 70, 18, "#22b8e6") + T(140, 76, "Detail 1", { s: 15, b: 1, f: "#ffffff" }) +
  star(110, 160, 18, "#22b8e6") + T(140, 166, "Detail 2", { s: 15, b: 1, f: "#ffffff" }) +
  star(400, 112, 40, "#ffd23f") + T(400, 180, "The idea", { a: "middle", s: 16, b: 1, f: "#ffd23f" }) +
  T(400, 200, "(neither says it alone)", { a: "middle", s: 13, f: "#c9cbe0" }) +
  A.egg(A.bird(470, 40, 0.6, "#ff5d8f"), "A bird among the stars. Jay says this is a real constellation. It is not.") +
  '</svg>';

/* three paragraphs, a dot in each, joined */
var FAR =
  '<svg viewBox="0 0 520 230" role="img" aria-label="Three paragraphs, each with a highlighted detail, joined by a line">' +
  '<rect width="520" height="230" rx="16" fill="#f1f3fb"/>' +
  [0, 1, 2].map(function(k){
    var x = 20 + k * 168;
    return '<rect x="' + x + '" y="20" width="148" height="150" rx="10" fill="#fff" stroke="#141a33" stroke-opacity=".35" stroke-width="2"/>' +
      T(x + 74, 44, "Paragraph " + (k + 1), { a: "middle", s: 13, b: 1 }) +
      '<path d="M' + (x + 14) + ' 66h120M' + (x + 14) + ' 86h120M' + (x + 14) + ' 106h120M' + (x + 14) + ' 126h120M' + (x + 14) + ' 146h70" stroke="#c4c8da" stroke-width="7" stroke-linecap="round"/>';
  }).join("") +
  '<path d="M60 86h50" stroke="#ffd23f" stroke-width="10" stroke-linecap="round"/>' +
  '<path d="M240 126h70" stroke="#ffd23f" stroke-width="10" stroke-linecap="round"/>' +
  '<path d="M400 66h60" stroke="#ffd23f" stroke-width="10" stroke-linecap="round"/>' +
  '<path d="M85 92Q160 200 275 132Q350 90 430 72" fill="none" stroke="#e04848" stroke-width="3" stroke-dasharray="7 5"/>' +
  T(260, 206, "The clues are spread out. You do the joining.", { a: "middle", s: 14, f: "#3b4160" }) +
  '</svg>';

/* supported idea versus a leap */
var LEAP =
  '<svg viewBox="0 0 520 220" role="img" aria-label="An idea sits right next to the joined details. Another idea is far away, with a gap you would have to leap">' +
  '<rect width="520" height="220" rx="16" fill="#1d2147"/>' +
  star(60, 70, 14, "#22b8e6") + star(60, 150, 14, "#22b8e6") + star(120, 110, 14, "#22b8e6") +
  '<path d="M60 70L120 110L60 150" fill="none" stroke="#ffd23f" stroke-width="3"/>' +
  '<path d="M134 110H210" stroke="#19c39a" stroke-width="4"/>' + star(236, 110, 26, "#19c39a") +
  T(236, 164, "Supported", { a: "middle", s: 15, b: 1, f: "#19c39a" }) +
  '<path d="M264 110Q350 20 430 90" fill="none" stroke="#ff8a5d" stroke-width="3" stroke-dasharray="4 8"/>' +
  star(452, 104, 26, "#ff8a5d") + T(452, 158, "Too big", { a: "middle", s: 15, b: 1, f: "#ff8a5d" }) + T(452, 176, "a leap", { a: "middle", s: 15, b: 1, f: "#ff8a5d" }) +
  T(350, 40, "no dots here", { a: "middle", s: 13, f: "#c9cbe0" }) +
  '</svg>';

/* a first dot and a last dot: change over time */
var CHANGE =
  '<svg viewBox="0 0 520 200" role="img" aria-label="A small figure at the back at the start, and the same figure standing tall at the front at the end">' +
  '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  '<path d="M40 150H480" stroke="#141a33" stroke-width="3" marker-end="url(#jdB)"/>' +
  '<defs><marker id="jdB" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#141a33"/></marker></defs>' +
  T(70, 178, "Start", { a: "middle", s: 14, b: 1 }) + T(260, 178, "Middle", { a: "middle", s: 14, b: 1 }) + T(440, 178, "End", { a: "middle", s: 14, b: 1 }) +
  '<g transform="translate(70 118) scale(.7)"><circle cy="-30" r="12" fill="#ff5d8f"/><path d="M-14 22v-26q0 -10 14 -10q14 0 14 10v26z" fill="#ff5d8f"/></g>' +
  '<g transform="translate(260 112) scale(.95)"><circle cy="-30" r="12" fill="#ff5d8f"/><path d="M-14 26v-30q0 -10 14 -10q14 0 14 10v30z" fill="#ff5d8f"/></g>' +
  '<g transform="translate(440 100) scale(1.3)"><circle cy="-30" r="12" fill="#ff5d8f"/><path d="M-14 30v-34q0 -10 14 -10q14 0 14 10v34z" fill="#ff5d8f"/><path d="M14 -4l16 -18" stroke="#ff5d8f" stroke-width="7" stroke-linecap="round"/></g>' +
  '<path d="M60 30q190 -14 380 6" fill="none" stroke="#e04848" stroke-width="2.5" stroke-dasharray="6 5"/>' +
  T(250, 52, "join the first dot to the last", { a: "middle", s: 13, f: "#e04848" }) +
  '</svg>';

/* the main text, at three levels */
var TXT = {
  mild: '<div class="a2task"><p>[[Who]] has worked at [[place]] for years. Every day, [[who]] comes in at seven. Today, [[who]] came in at nine.</p>' +
    '<p>On the desk was a big box. It was full of photos and old mugs.</p>' +
    '<p>"Will you be here in the summer?" asked [[who2]]. [[Who]] did not answer.</p></div>',
  medium: '<div class="a2task"><p>[[Who]] had worked at [[place]] for eleven years. Everyone knew the routine: in at seven, [[job]], home at six. On Monday, [[who]] arrived at nine.</p>' +
    '<p>The [[thing]] that had hung on the same hook for eleven years was gone. In its place was a small cardboard box, half full of photos and old mugs.</p>' +
    '<p>At lunch, [[who2]] asked about the summer rota. [[Who]] smiled, said "Ask me another time," and looked out of the window for a long while.</p></div>',
  spicy: '<div class="a2task"><p>[[Who]] had worked at [[place]] for eleven years. Everyone knew the routine: in at seven, [[job]], home at six. On Monday, [[who]] arrived at nine, holding a large brown envelope. [[Who2]] mentioned that the car park was being dug up all week.</p>' +
    '<p>The [[thing]] that had hung on the same hook for eleven years was gone. In its place was a small cardboard box, half full of photos and old mugs. The envelope sat unopened beside it.</p>' +
    '<p>At lunch, [[who2]] asked about the summer rota. [[Who]] smiled, said "Ask me another time," and looked out of the window for a long while. Later, a new name badge was found in the bin, still in its packet.</p></div>'
};

/* the change text, at three levels */
var GROW = {
  mild: '<div class="a2task"><p>On the first day, the new [[role]] stood at the back and said nothing.</p>' +
    '<p>A month later, the new [[role]] was asking lots of questions.</p>' +
    '<p>At the end of the year, the new [[role]] stood at the front and gave a speech.</p></div>',
  medium: '<div class="a2task"><p>On the first day, the new [[role]] stood at the back, hands in pockets, and answered every question with a single word.</p>' +
    '<p>By the third week, the new [[role]] was arriving early, asking questions and staying behind to help tidy up.</p>' +
    '<p>At the end of the season, it was the new [[role]] who stood up at the front and gave the thank you speech.</p></div>',
  spicy: '<div class="a2task"><p>On the first day, the new [[role]] stood at the back, hands in pockets, and answered every question with a single word. Nobody expected them to last the month.</p>' +
    '<p>By the third week, the new [[role]] was arriving early, asking questions and staying behind to help tidy up. Most mornings they were the first voice anyone heard.</p>' +
    '<p>At the end of the season, it was the new [[role]] who stood up at the front and gave the thank you speech. They began: "I nearly did not come back after day one."</p></div>'
};

(window.A2PACKS = window.A2PACKS || {})["join-dots"] = {
  a2: true,
  id: "a2-join-dots",
  title: "Join the dots",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "Two details from different places in a text can add up to an idea that neither one says.",
  blurb: "Joining up details from different parts of a text to reach an idea the writer never says out loud. Four short chunks, with a dot map card to make at the end.",
  note: "Joining the dots: putting together details from different parts of a text to work out something it never says. Four five minute chunks and a dot map at the end. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Two stars", line: "Two stars: two clear details close together, one idea." },
    { id: "medium", name: "Constellation", line: "Constellation: details spread across a text with several paragraphs." },
    { id: "spicy", name: "Night sky", line: "Night sky: denser texts, red herrings, and weighing up which idea is best supported." }
  ],
  themes: {
    time: { name: "Time travel", w: { place: "the time lab", who: "the old engineer", who2: "the boss", thing: "pocket watch", job: "checking the machines", role: "apprentice", event: "the first launch" } },
    football: { name: "Football", w: { place: "the club", who: "the kit manager", who2: "the coach", thing: "lucky scarf", job: "washing the kit", role: "signing", event: "the cup final" } },
    horror: { name: "Horror", w: { place: "the old hospital", who: "the night porter", who2: "the night manager", thing: "torch", job: "a round of every ward", role: "nurse", event: "the first night shift" } },
    fishing: { name: "Fishing", w: { place: "the lake", who: "the lake keeper", who2: "the head warden", thing: "landing net", job: "checking every peg", role: "club member", event: "the big match" } },
    music: { name: "Music", w: { place: "the theatre", who: "the stage manager", who2: "the director", thing: "headset", job: "a sound check", role: "chorus member", event: "opening night" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: JOIN,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Two dots make a line", title: "One detail is a dot. Two make a line.",
      fig: JOIN,
      html: "<p>Writers do not always say things straight out. Often they leave <b>details</b> in different places and trust you to join them up.</p>" +
        dots("[[Who]] glanced at the clock three times in a minute.", "[[Who]]'s coat was already on.") +
        "<p>Neither detail says \"[[Who]] wants to leave\". Put them together, though, and that is the idea they point to. That is <b>joining the dots</b>.</p>",
      lv: { spicy: { html: "<p>Writers rarely say the important thing straight out. They plant <b>details</b> in different places and trust the reader to join them.</p>" +
        dots("[[Who]] glanced at the clock three times in a minute.", "[[Who]]'s coat was already on, but the shift had an hour left to run.") +
        "<p>The clock alone could be boredom. The coat alone could be a cold room. Together they point to one idea: [[who]] is desperate to leave early. The skill is finding an idea that <b>every</b> dot supports, not just one.</p>" } } },

    { type: "mc", topic: "Two dots make a line",
      q: dots("The kitchen bin had been knocked over.", "Bonnie had gravy on her nose and looked very pleased with herself.") + "<p>What idea do the two dots point to?</p>",
      fig: '<svg viewBox="0 0 360 160" role="img" aria-label="Bonnie the poodle next to a tipped over bin">' +
        '<rect width="360" height="160" rx="16" fill="#fdf6e7"/>' +
        '<g transform="translate(250 110) rotate(-80)"><rect x="-26" y="-30" width="52" height="62" rx="6" fill="#9aa0b8" stroke="#141a33" stroke-width="2.5"/><rect x="-30" y="-36" width="60" height="10" rx="4" fill="#6b7190"/></g>' +
        '<circle cx="300" cy="134" r="6" fill="#c98a4b"/><circle cx="318" cy="140" r="4" fill="#c98a4b"/>' +
        A.bonnie(130, 98, 1.05, "sit") + '<ellipse cx="136" cy="83" rx="8" ry="4" fill="#d9a05b" stroke="#7a3f12" stroke-width="1"/>' + '</svg>',
      options: ["Bonnie got into the bin.", "Someone knocked the bin over on purpose.", "Bonnie had her dinner as normal."],
      answer: 0,
      slips: { 1: "Nothing points to a person. Look at what is on Bonnie's nose.", 2: "Gravy on her nose next to a knocked over bin is not a normal dinner." },
      hint: "What would put gravy on a poodle's nose?",
      why: "The bin alone could be anyone. The gravy alone could be dinner. Together, they point to one very guilty poodle." },

    { type: "mc", topic: "Two dots make a line",
      q: dots("[[Who]] had not slept properly for two nights.", "Before lunch, [[who]] dropped the [[thing]] twice.") + "<p>What idea do the two dots point to?</p>",
      options: ["Being so tired was making [[who]] clumsy.", "[[Who]] does not like the [[thing]].", "[[Who]] had a great night's sleep.", "The [[thing]] is broken."],
      answer: 0,
      slips: { 1: "Nothing says how [[who]] feels about it. Join it to the first dot.", 2: "Dot 1 says the opposite.", 3: "Nothing says it is broken. Dropping it is about the person holding it." },
      hint: "How does no sleep affect someone?",
      why: "No sleep plus dropping things adds up to tiredness causing mistakes. Neither dot says that on its own.",
      lv: { spicy: {
        q: dots("[[Who]] had not slept properly for two nights.", "Before lunch, [[who]] dropped the [[thing]] twice, then snapped at [[who2]] for asking if everything was all right.") + "<p>Which idea is best supported by <b>both</b> dots?</p>",
        options: ["Something is keeping [[who]] awake, and it is affecting [[who]]'s work and mood.", "[[Who]] has always been rude to [[who2]].", "[[Who]] does not like the [[thing]].", "[[Who2]] is to blame for everything."],
        slips: { 1: "\"Always\" goes way beyond the text. This is one morning.", 2: "Nothing says how [[who]] feels about it.", 3: "Nothing in either dot blames [[who2]]." },
        why: "Lost sleep, clumsiness and snapping all fit one idea: something is troubling [[who]], and it is spilling over. The other choices go further than the dots allow." } } },

    { type: "multi", topic: "Two dots make a line",
      q: "Which <b>two</b> details together suggest [[who]] is nervous about [[event]]?",
      options: ["[[Who]] checked the time again and again.", "[[Who]] could not eat any breakfast.", "[[Who]] was wearing a blue jumper.", "[[Place]] has a big car park."],
      answers: [0, 1],
      hint: "Which two are things people do when they are worried?",
      why: "Checking the time and not eating are both signs of nerves. The jumper and the car park are just details that do not point anywhere.",
      lv: { spicy: {
        q: "Pick <b>every</b> detail that helps suggest [[who]] is nervous about [[event]].",
        options: ["[[Who]] checked the time again and again.", "[[Who]] left breakfast untouched.", "[[Who]] read the same page three times without turning it.", "[[Who]] was wearing a blue jumper.", "[[Place]] has a big car park."],
        answers: [0, 1, 2],
        why: "Checking the time, not eating and reading without taking it in all point to a mind elsewhere. The jumper and car park do not point anywhere." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Dots far apart", title: "The dots can be paragraphs apart",
      fig: FAR,
      html: "<p>In longer texts the dots are often in <b>different paragraphs</b>. Read this one, and keep an eye out for small things that seem odd.</p>" + TXT.medium +
        "<p>The writer never says what is going on. But there are dots in every paragraph.</p>",
      lv: { mild: { html: "<p>Sometimes the dots are in <b>different paragraphs</b>. Read this, and look for anything that seems odd.</p>" + TXT.mild +
          "<p>The writer never says what is going on. But there are clues.</p>" },
        spicy: { html: "<p>In longer texts the dots are spread out, and some details are <b>red herrings</b> that point somewhere else. Read this carefully.</p>" + TXT.spicy +
          "<p>The writer never says what is going on. Hunt for the dots, and notice anything that might explain them away.</p>" } } },

    { type: "mc", topic: "Dots far apart",
      q: TXT.medium + "<p>What idea do the details point to?</p>",
      options: ["[[Who]] is getting ready to leave [[place]].", "[[Who]] has just started at [[place]].", "[[Who]] is planning a summer party.", "[[Who]] has lost the [[thing]]."],
      answer: 0,
      slips: { 1: "Eleven years is a long time. This person is not new.", 2: "[[Who]] dodges the summer question. That does not sound like someone planning for summer.", 3: "Maybe, but join it to the box of photos and mugs. Why would someone pack those?" },
      hint: "Why would someone pack their photos and mugs into a box?",
      why: "A broken routine, a box of personal things, and dodging a question about the summer all point to the same idea: [[who]] is leaving.",
      lv: { mild: { q: TXT.mild + "<p>What idea do the details point to?</p>",
          options: ["[[Who]] is getting ready to leave [[place]].", "[[Who]] has just started at [[place]].", "[[Who]] is planning a summer party."],
          slips: { 1: "[[Who]] has worked there for years. Not new.", 2: "[[Who]] does not even answer the summer question." } },
        spicy: { q: TXT.spicy + "<p>Which idea is supported by the most details?</p>",
          slips: { 1: "Eleven years, so not new. And the new badge went in the bin, not on a jumper.", 2: "[[Who]] dodges the summer question. That does not fit planning for summer.", 3: "The [[thing]] is gone, but next to a box of personal things it looks packed, not lost." } } } },

    { type: "multi", topic: "Dots far apart",
      q: TXT.medium + "<p>Pick <b>every</b> detail that helps point to that idea.</p>",
      options: ["[[Who]] arrived at nine instead of seven.", "The [[thing]] was gone from its hook.", "A box was half full of photos and old mugs.", "[[Who]] put off talking about the summer rota.", "It was a Monday."],
      answers: [0, 1, 2, 3],
      hint: "There are dots in all three paragraphs. Only one choice does not point anywhere.",
      why: "Late in, the [[thing]] gone, a box of personal things, and dodging the summer: four dots across three paragraphs. Monday on its own tells us nothing.",
      lv: { mild: { q: TXT.mild + "<p>Pick the <b>two</b> details that point to [[who]] leaving.</p>",
          options: ["There was a box full of photos and old mugs.", "[[Who]] did not answer about the summer.", "[[Who]] has a desk.", "[[Who2]] asked a question."],
          answers: [0, 1],
          hint: "One is in the middle paragraph, one is at the end.",
          why: "Packing personal things and not answering about the summer both point to leaving. Having a desk does not point anywhere." },
        spicy: { q: TXT.spicy + "<p>Pick <b>every</b> detail that helps point to [[who]] leaving.</p>",
          options: ["The [[thing]] was gone from its hook.", "A box was half full of photos and old mugs.", "[[Who]] put off talking about the summer rota.", "A new name badge was found in the bin.", "The car park was being dug up all week."],
          answers: [0, 1, 2, 3],
          why: "The [[thing]], the box, the dodged question and the binned badge all point to leaving. The car park points the other way: it could explain arriving late." } } },

    { type: "mc", topic: "Dots far apart",
      q: TXT.medium + "<p>On its own, arriving at nine instead of seven could just mean a traffic jam. Which other detail turns it into a clue?</p>",
      options: ["The box of photos and old mugs", "The routine was in at seven", "[[Who]] smiled", "It was a Monday"],
      answer: 0,
      slips: { 1: "That tells us nine is late, but not why. Which detail makes the lateness look meaningful?", 2: "A smile on its own could mean anything.", 3: "Lots of people are late on a Monday. That makes it less of a clue, not more." },
      hint: "Which detail shows something has really changed?",
      why: "Late on its own is weak. Late <b>plus</b> a packed box of personal things starts to look like someone winding down. Joined dots are stronger than single ones.",
      lv: { mild: { q: TXT.mild + "<p>On its own, coming in at nine could just mean a traffic jam. Which other detail turns it into a clue?</p>",
          options: ["The box full of photos and old mugs", "[[Who2]] asked a question", "Every day, [[who]] comes in at seven"],
          slips: { 1: "Asking is what [[who2]] did. Look at what [[who]] has done.", 2: "That tells us nine is late, but not why." } },
        spicy: { q: TXT.spicy + "<p>The text gives a <b>different</b> possible reason for [[who]] arriving late. Which detail is it?</p>",
          options: ["The car park was being dug up all week.", "The envelope sat unopened.", "[[Who]] looked out of the window.", "A new name badge was found in the bin."],
          slips: { 1: "The envelope is a mystery, but it does not explain being late.", 2: "That happens at lunch, not in the morning.", 3: "That points to leaving, not to a reason for being late." },
          hint: "Look for something that could slow anyone down.",
          why: "The car park gives an ordinary reason for being late. A good reader notices it and leans on the other dots instead: the box, the badge and the dodged question do not have an ordinary explanation." } } },

    { type: "text", topic: "Dots far apart",
      q: "In one sentence, say what you think is going on with [[who]], and mention <b>two</b> details that point to it.",
      need: [["leav", "quit", "going", "moving", "move", "new job", "retir", "finish", "last day", "resign", "goodbye", "go"], ["box", "late", "nine", "photo", "mug", "rota", "summer", "hook", "gone", "window", "badge", "answer", "envelope"]],
      model: "[[Who]] is leaving, because there is a box of photos and [[who]] avoids the summer rota question.",
      slips: [[["sacked", "fired"], "Careful: nothing in the text says [[who]] was sacked. Stick to what the dots support, like leaving."]],
      hint: "Start with \"[[Who]] is leaving because...\" then name two things from the text.",
      why: "A strong answer names the idea and the dots: \"[[Who]] seems to be leaving: the photos are packed in a box and the summer question gets dodged.\"",
      explain: true },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Too big a leap", title: "Stay close to the dots",
      fig: LEAP,
      html: "<p>Joining dots is not the same as making things up. A good idea is one that <b>the dots really support</b>.</p>" +
        "<p>From our text, \"[[Who]] is leaving\" is supported. \"[[Who]] has been sacked\" is a <b>leap</b>: nothing says why [[who]] is going.</p>" +
        "<p>Careful words help: <b>suggests, seems, probably, might</b>. They show you have joined the dots without jumping past them.</p>",
      lv: { spicy: { html: "<p>Joining dots is not making things up. A strong reading is one that <b>every</b> dot supports and that does not go further than they allow.</p>" +
        "<p>\"[[Who]] is leaving\" is well supported. \"[[Who]] has been sacked\" is a <b>leap</b>. The binned badge and the unopened envelope are tempting, but they do not say why.</p>" +
        "<p>When two readings both fit, the better one is the one with <b>more dots</b> and <b>fewer leaps</b>. Careful words (suggests, seems, possibly) show you know where the evidence stops.</p>" } } },

    { type: "sort", topic: "Too big a leap",
      q: "Thinking about the text with [[who]] and the box: sort these ideas.",
      buckets: ["The dots support it", "Too big a leap"],
      cards: [["[[Who]] is getting ready to leave.", 0], ["[[Who]] has been sacked.", 1], ["[[Who]] does not want to talk about the summer.", 0], ["[[Who]] hates [[who2]].", 1], ["Something has changed in [[who]]'s routine.", 0], ["[[Who]] has won the lottery.", 1]],
      hint: "Can you point to a detail for it? If not, it is a leap.",
      why: "Leaving, dodging the summer and a changed routine all have details behind them. Sacked, hating [[who2]] and winning the lottery have nothing in the text.",
      lv: { mild: { cards: [["[[Who]] is getting ready to leave.", 0], ["[[Who]] has won the lottery.", 1], ["[[Who]] does not want to talk about the summer.", 0], ["[[Who]] is secretly a spy.", 1]],
          why: "Leaving and not wanting to talk about the summer have clues behind them. Lottery wins and spies do not." } } },

    { type: "mc", topic: "Too big a leap",
      q: "Which word makes an idea sound <b>careful</b>, rather than a leap?",
      options: ["The text <b>suggests</b> [[who]] is leaving.", "The text <b>proves</b> [[who]] is leaving.", "[[Who]] is <b>definitely</b> leaving.", "[[Who]] has <b>always</b> wanted to leave."],
      answer: 0,
      slips: { 1: "\"Proves\" is too strong. The writer never says it outright.", 2: "\"Definitely\" claims more than the dots can show.", 3: "\"Always\" goes back further than the text does." },
      hint: "Which word leaves a little room?",
      why: "\"Suggests\" says the dots point that way, without pretending the text says it." },

    { type: "mc", topic: "Too big a leap", explain: true,
      q: "<p>Two readers explain the text.</p><p><b>Reader 1:</b> \"[[Who]] is leaving because of a big fight with [[who2]].\"</p><p><b>Reader 2:</b> \"[[Who]] seems to be leaving, but the text does not tell us why.\"</p><p>Whose reading is better supported?</p>",
      options: ["Reader 2", "Reader 1"],
      answer: 0, fixed: true,
      slips: { 1: "There is no fight anywhere in the text. [[Who]] even smiles at [[who2]]." },
      hint: "Is there a fight anywhere in the text?",
      why: "Reader 2 joins the dots and stops where they stop. Reader 1 adds a fight that is not there. In fact [[who]] smiles at [[who2]], which points away from a fight.",
      lv: { spicy: {
        q: "<p>Two readers explain the longer text.</p><p><b>Reader 1:</b> \"[[Who]] is leaving. The box, the missing [[thing]] and the binned name badge all point that way.\"</p><p><b>Reader 2:</b> \"[[Who]] is just late because of the car park, and is having a clear out.\"</p><p>Whose reading is better supported?</p>",
        options: ["Reader 1", "Reader 2"],
        slips: { 1: "The car park explains being late, but not the badge in the bin or the dodged summer question. Reader 2 leaves dots unexplained." },
        why: "Reader 2 explains two dots. Reader 1 explains nearly all of them. The reading that fits the most dots, with the fewest leaps, wins." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "First dot, last dot", title: "Join the start to the end",
      fig: CHANGE,
      html: "<p>Some of the best dots to join are one near the <b>start</b> and one near the <b>end</b>. Together they show how something <b>changed</b>.</p>" + GROW.medium +
        "<p>No sentence says \"the new [[role]] grew in confidence\". You get there by joining the first paragraph to the last.</p>",
      lv: { mild: { html: "<p>Try joining a dot from the <b>start</b> to one at the <b>end</b>. Together they show how something <b>changed</b>.</p>" + GROW.mild +
          "<p>No sentence says \"the new [[role]] got more confident\". You get there by joining the start and the end.</p>" },
        spicy: { html: "<p>Join a dot near the <b>start</b> to one near the <b>end</b> and you can see how something <b>changed</b>.</p>" + GROW.spicy +
          "<p>Writers often help you by <b>echoing</b>: the end picks up a word or picture from the start. Here, \"stood at the back\" becomes \"stood up at the front\". Spotting an echo is a quick way to find two dots worth joining.</p>" } } },

    { type: "mc", topic: "First dot, last dot",
      q: GROW.medium + "<p>Join the first paragraph to the last. What do they show together?</p>",
      options: ["The new [[role]] grew in confidence.", "The new [[role]] was always confident.", "The new [[role]] wanted to leave.", "The new [[role]] did not enjoy the speech."],
      answer: 0,
      slips: { 1: "Look at the first day: back of the room, one word answers. That is not confident yet.", 2: "Arriving early and staying late do not sound like someone wanting to leave.", 3: "Nothing says how the speech felt. Stick to what the dots show." },
      hint: "Where do they stand at the start? Where at the end?",
      why: "Back of the room and one word answers at the start; front of the room giving a speech at the end. Joined up, that is someone growing in confidence.",
      lv: { mild: { q: GROW.mild + "<p>Join the start to the end. What do they show together?</p>",
          options: ["The new [[role]] got more confident.", "The new [[role]] was always confident.", "The new [[role]] wanted to leave."],
          slips: { 1: "At the start they said nothing. Not confident yet.", 2: "Nothing points to leaving. They stay all year." } },
        spicy: { q: GROW.spicy + "<p>Join the first paragraph to the last. Which idea fits <b>all</b> the dots best?</p>",
          options: ["The new [[role]] grew in confidence, even though it nearly did not happen.", "The new [[role]] was always confident.", "The new [[role]] was forced to give the speech.", "The new [[role]] found the whole year easy."],
          slips: { 1: "\"Nobody expected them to last\" says the opposite at the start.", 2: "Nothing says anyone forced them. That is a leap.", 3: "\"I nearly did not come back after day one\" tells you it was not easy." },
          why: "The start (silent, not expected to last) and the end (front of the room, admitting they nearly quit) show growth that was not guaranteed. Every dot fits." } } },

    { type: "mc", topic: "First dot, last dot",
      q: GROW.medium + "<p>Which detail is the <b>middle dot</b>: the one that shows the change happening?</p>",
      options: ["Arriving early and asking questions", "Hands in pockets", "Answering with a single word", "The thank you speech"],
      answer: 0,
      slips: { 1: "That is the start, before the change.", 2: "That is the start, before the change.", 3: "That is the end, after the change." },
      hint: "Look in the middle paragraph.",
      why: "Arriving early and asking questions sits between the silent start and the speech at the end. It shows the change on its way.",
      lv: { mild: { q: GROW.mild + "<p>Which detail is the <b>middle dot</b>: the one that shows the change happening?</p>",
          options: ["Asking lots of questions", "Standing at the back", "Giving a speech"],
          slips: { 1: "That is the start.", 2: "That is the end." } },
        spicy: { q: GROW.spicy + "<p>The last paragraph <b>echoes</b> the first. Which phrase is the echo?</p>",
          options: ["Stood up at the front", "The thank you speech", "At the end of the season", "I nearly did not come back"],
          slips: { 1: "The speech matters, but which words mirror the first paragraph?", 2: "That is a time marker, not an echo.", 3: "That links back to day one, but the echo is a mirror of the words \"stood at the back\"." },
          hint: "Find the words in the first paragraph about where they stood.",
          why: "\"Stood at the back\" at the start becomes \"stood up at the front\" at the end. The writer mirrors the words so you join those two dots." } } },

    { type: "text", topic: "First dot, last dot", stretch: true,
      q: "Write one sentence about how the new [[role]] changed. Use a detail from the <b>start</b> and one from the <b>end</b>.",
      need: [["confiden", "brave", "grew", "grow", "change", "bold", "comfortable", "settled", "shy", "quiet", "happier", "louder", "outgoing", "speak", "spoke", "talk"], ["back", "front", "speech", "single word", "one word", "nothing", "pocket", "end"]],
      model: "The new [[role]] grew in confidence, going from standing at the back to giving the speech at the front.",
      slips: [[["always confident", "was always"], "Look again at the first day. They start quiet."]],
      hint: "Try: \"At first the new [[role]]... but by the end...\"",
      why: "\"At first the new [[role]] stood at the back saying nothing, but by the end they gave the speech at the front\" joins the first dot to the last.",
      lv: { mild: { q: "Write one sentence about how the new [[role]] changed. Use the start and the end.",
        model: "The new [[role]] got more confident, from saying nothing at the back to giving a speech at the front." } } }
  ],

  realWorld: {
    title: "Joining dots is how we know about the past",
    html: "<p>Detectives join dots. So do doctors, who put symptoms together, and anyone reading reviews before buying something.</p>" +
      "<p>Historians do it all the time. Nobody can pop back to 1066 and ask, so they join a detail from one old record to a detail in another. Our big question asks: <b>if we could time travel, should we?</b> If we could just go and look, would we lose the skill of working it out from the dots? Or would we finally find out which historians were right?</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to a time portal with a scroll">' + A.portal(80, 75, 56) + A.jay(250, 52, 0.85, "hmm") +
      A.bubble(296, 6, 118, 52, "Or I could\njust look?", 306) + '</svg>'
  },

  make: {
    title: "Make a dot map",
    intro: "Two details and the idea they point to, drawn as stars. Use a text you have read, a film, or something that happened today. Keep it, or send it to Jay.",
    fields: [
      { id: "d1", label: "Dot 1", ph: "The fridge door was open.", max: 60 },
      { id: "d2", label: "Dot 2", ph: "There was cheese on the sofa.", max: 60 },
      { id: "idea", label: "The idea they point to", ph: "Someone had a midnight snack.", max: 60 },
      { id: "name", label: "Mapped by", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      function e(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ while(x.length > n){ if(cur.trim()) out.push(cur.trim()); out.push(x.slice(0, n)); x = x.slice(n); cur = ""; } if((cur + " " + x).trim().length > n){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max); }
      function lines(t, x, y, n, size, col, bold){ return wrap(t, n, 3).map(function(l, k){ return '<text x="' + x + '" y="' + (y + k * (size + 6)) + '" font-family="Verdana,Arial,sans-serif" font-size="' + size + '"' + (bold ? ' font-weight="700"' : '') + ' fill="' + col + '">' + e(l) + '</text>'; }).join(""); }
      var sky = [[40, 40], [560, 30], [300, 30], [520, 360], [30, 360], [200, 380], [580, 200]].map(function(p){ return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.5" fill="#ffffff" fill-opacity=".7"/>'; }).join("");
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#1d2147"/>' + sky +
        '<text x="34" y="54" font-family="Verdana,Arial,sans-serif" font-size="20" font-weight="700" fill="#ffd23f" letter-spacing="3">DOT MAP</text>' +
        '<path d="M60 120L60 250" stroke="#ffd23f" stroke-width="4" stroke-dasharray="8 6"/>' +
        '<path d="M60 185H316" stroke="#ffd23f" stroke-width="3"/>' +
        star(60, 120, 16, "#22b8e6") + lines(v.d1, 88, 116, 24, 17, "#ffffff") +
        star(60, 250, 16, "#22b8e6") + lines(v.d2, 88, 246, 24, 17, "#ffffff") +
        star(400, 120, 34, "#ffd23f") +
        lines(v.idea, 336, 192, 20, 20, "#ffd23f", true) +
        '<text x="34" y="370" font-family="Verdana,Arial,sans-serif" font-size="15" fill="#c9cbe0">Mapped by ' + e(v.name) + '</text>' +
        '</svg>';
    }
  }
};
})();
