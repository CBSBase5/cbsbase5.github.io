/* Base 5 Autumn 2 activity: Case file.
   English. Putting several details together to reach an interpretation,
   backing it up, and judging which of two readings is better supported.
   ASCII only. */
(function(){
var A = window.A2ART;
var FONT = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + (o.ls ? ' letter-spacing="' + o.ls + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = [], out = [], cur = ""; String(t || "").split(/\s+/).forEach(function(x){ while(x.length > n){ w.push(x.slice(0, n)); x = x.slice(n); } w.push(x); }); w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }

/* ---------- pictures ---------- */
/* three clue cards pointing to one idea */
var CLUES = '<svg viewBox="0 0 520 230" role="img" aria-label="Three clue cards: checks the clock, foot tapping, coat on early. Arrows point from all three to one idea: keen to get going">' +
  '<rect width="520" height="230" rx="16" fill="#f4f1ea"/>' +
  [["Checks the", "clock 4 times", 26], ["Foot", "tapping", 90], ["Coat on an", "hour early", 154]].map(function(c, k){
    return '<g transform="rotate(' + [-2, 1, -1][k] + ' 100 ' + (c[2] + 24) + ')"><rect x="20" y="' + c[2] + '" width="160" height="50" rx="6" fill="#fffbe0" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
      '<circle cx="32" cy="' + (c[2] + 10) + '" r="5" fill="#e04848"/>' + T(46, c[2] + 22, c[0], 13) + T(46, c[2] + 40, c[1], 13, { b: 1 }) + '</g>' +
      '<path d="M186 ' + (c[2] + 25) + 'Q250 ' + (c[2] + 25) + ' 300 115" fill="none" stroke="#141a33" stroke-width="2.5" stroke-dasharray="6 5"/>';
  }).join("") +
  '<path d="M300 115l-12 -9v18z" fill="#141a33"/>' +
  '<rect x="306" y="78" width="196" height="74" rx="14" fill="#19c39a" fill-opacity=".3" stroke="#141a33" stroke-width="3"/>' +
  T(404, 106, "Keen to", 17, { a: "middle", b: 1 }) + T(404, 130, "get going", 17, { a: "middle", b: 1 }) +
  T(404, 186, "Several clues, one idea:", 13, { a: "middle", c: "#5b6180" }) + T(404, 204, "an interpretation.", 13, { a: "middle", c: "#5b6180" }) +
  '</svg>';

/* point, evidence, explain */
function pee(parts){
  return '<svg viewBox="0 0 520 240" role="img" aria-label="Building a case in three parts: point, evidence, explain">' +
    '<rect width="520" height="240" rx="16" fill="#f4f1ea"/>' +
    parts.map(function(p, k){
      var y = 18 + k * 72;
      return '<rect x="20" y="' + y + '" width="480" height="60" rx="12" fill="' + p[2] + '" fill-opacity=".3" stroke="#141a33" stroke-width="2.5"/>' +
        '<rect x="20" y="' + y + '" width="130" height="60" rx="12" fill="' + p[2] + '"/>' +
        T(85, y + 37, p[0], 17, { a: "middle", b: 1, c: "#141a33" }) + T(166, y + 36, p[1], 14) +
        (k < parts.length - 1 ? '<path d="M85 ' + (y + 60) + 'v12" stroke="#141a33" stroke-width="3"/>' : "");
    }).join("") + '</svg>';
}
var PEE = pee([["Point", "What I think is going on", "#ffd23f"], ["Evidence", "Details from the text, in their words", "#22b8e6"], ["Explain", "How the details show my point", "#ff8a8a"]]);
var PEE_MILD = pee([["I think", "What I think is going on", "#ffd23f"], ["because", "A detail from the text", "#22b8e6"], ["This shows", "How the detail shows it", "#ff8a8a"]]);

/* weighing two readings */
function scale(aN, bN, aLab, bLab){
  function weights(cx, cy, n, col){ var s = ""; for(var i = 0; i < n; i++) s += '<rect x="' + (cx - 34 + (i % 3) * 24) + '" y="' + (cy - 18 - Math.floor(i / 3) * 18) + '" width="20" height="16" rx="3" fill="' + col + '" stroke="#141a33" stroke-width="1.5"/>'; return s; }
  var tilt = bN > aN ? 9 : bN < aN ? -9 : 0;
  var dy = 140 * Math.sin(tilt * Math.PI / 180), ay = 80 - dy + 50, by = 80 + dy + 50;
  return '<svg viewBox="0 0 520 240" role="img" aria-label="A balance scale weighing two readings. The side with more evidence sinks lower">' +
    '<rect width="520" height="240" rx="16" fill="#f4f1ea"/>' +
    '<path d="M260 200v-120" stroke="#7a5532" stroke-width="8"/><path d="M220 206h80" stroke="#7a5532" stroke-width="10" stroke-linecap="round"/>' +
    '<g transform="rotate(' + tilt + ' 260 80)"><path d="M120 80h280" stroke="#7a5532" stroke-width="7" stroke-linecap="round"/></g>' +
    '<circle cx="260" cy="80" r="9" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>' +
    '<path d="M122 ' + (80 - dy) + 'L90 ' + ay + 'M122 ' + (80 - dy) + 'L154 ' + ay + '" stroke="#141a33" stroke-width="1.5"/>' +
    '<path d="M398 ' + (80 + dy) + 'L366 ' + by + 'M398 ' + (80 + dy) + 'L430 ' + by + '" stroke="#141a33" stroke-width="1.5"/>' +
    '<path d="M84 ' + ay + 'h76q-8 14 -38 14t-38 -14z" fill="#c8ccd2" stroke="#141a33" stroke-width="2"/>' + weights(122, ay, aN, "#ff8a8a") +
    '<path d="M360 ' + by + 'h76q-8 14 -38 14t-38 -14z" fill="#c8ccd2" stroke="#141a33" stroke-width="2"/>' + weights(398, by, bN, "#22b8e6") +
    T(122, ay + 40, aLab, 14, { a: "middle", b: 1 }) + T(398, by + 40, bLab, 14, { a: "middle", b: 1 }) +
    T(260, 232, "Each block is a detail that backs a reading up.", 13, { a: "middle", c: "#5b6180" }) + '</svg>';
}
var SCALE = scale(1, 4, "Reading A", "Reading B");

/* a landmark at night, lights inside, a van with ladders by the gate */
var NIGHT = '<svg viewBox="0 0 520 250" role="img" aria-label="An old building at night with lights in two windows, and a white van with ladders parked by the side gate">' +
  '<rect width="520" height="250" rx="16" fill="#1d2550"/>' +
  '<circle cx="440" cy="50" r="24" fill="#fff6c8"/><circle cx="452" cy="44" r="22" fill="#1d2550"/>' +
  '<circle cx="80" cy="34" r="2" fill="#fff"/><circle cx="160" cy="58" r="1.5" fill="#fff"/><circle cx="300" cy="28" r="2" fill="#fff"/><circle cx="380" cy="90" r="1.5" fill="#fff"/>' +
  '<rect x="0" y="214" width="520" height="36" fill="#141a33"/>' +
  '<path d="M90 214v-120h60v-40l30 -26 30 26v40h60v120z" fill="#2e3566" stroke="#0d1230" stroke-width="3"/>' +
  '<circle cx="180" cy="66" r="11" fill="#fff" fill-opacity=".85"/><path d="M180 66v-7M180 66h5" stroke="#141a33" stroke-width="2"/>' +
  [[110, 120, 1], [150, 120, 0], [200, 120, 0], [240, 120, 1], [110, 166, 0], [240, 166, 0]].map(function(w){
    return '<rect x="' + w[0] + '" y="' + w[1] + '" width="24" height="30" rx="12" fill="' + (w[2] ? "#ffd23f" : "#141a33") + '"' + (w[2] ? ' fill-opacity=".9"' : "") + '/>';
  }).join("") +
  '<rect x="160" y="170" width="40" height="44" rx="4" fill="#141a33"/>' +
  '<path d="M300 214v-60M300 154h70M370 154v60" stroke="#5b6180" stroke-width="4"/>' +
  '<rect x="330" y="172" width="150" height="40" rx="6" fill="#f4f1ea"/><path d="M450 172v-14h22l8 14z" fill="#f4f1ea"/>' +
  '<rect x="456" y="160" width="12" height="10" fill="#22b8e6"/>' +
  '<circle cx="360" cy="214" r="10" fill="#141a33" stroke="#5b6180" stroke-width="3"/><circle cx="450" cy="214" r="10" fill="#141a33" stroke="#5b6180" stroke-width="3"/>' +
  '<path d="M336 162h130M336 168h130" stroke="#c8ccd2" stroke-width="3"/><path d="M346 162v6M366 162v6M386 162v6M406 162v6M426 162v6M446 162v6" stroke="#c8ccd2" stroke-width="2.5"/>' +
  T(176, 240, "?", 22, { a: "middle", b: 1, c: "#ffd23f" }) +
  A2ART.egg(A2ART.bird(205, 22, 0.55, "#8a5cf6"), "A bird on the roof at midnight. Not a ghost. Jay checked.") +
  '</svg>';

var BONNIE_DOOR = '<svg viewBox="0 0 440 180" role="img" aria-label="Bonnie by the door as Jay walks in">' +
  '<rect width="440" height="180" rx="16" fill="#f4f1ea"/>' +
  '<rect x="250" y="10" width="110" height="170" rx="4" fill="#c99a63" stroke="#7a5532" stroke-width="4"/><circle cx="342" cy="100" r="6" fill="#ffd23f"/>' +
  A2ART.jay(305, 70, 0.8, "wow") + A2ART.bonnie(150, 120, 1.1, "stand") +
  '<path d="M196 70l10 -8M200 82l12 -2M194 58l4 -12" stroke="#141a33" stroke-width="3" stroke-linecap="round"/>' +
  '</svg>';

(window.A2PACKS = window.A2PACKS || {})["case-file"] = {
  a2: true,
  id: "a2-case-file",
  title: "Case file",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "One clue can mean anything. Several clues together build a case. Then you weigh up which reading wins.",
  blurb: "Detective work with texts: putting clues together to reach an interpretation, backing it up, and judging which of two readings is better supported. Four short chunks, ending with a mystery to crack and a case file card to make.",
  note: "Detective work with texts: clues, cases and a mystery at the end. Four five minute chunks and a case file card to make, whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Constable", line: "Constable: short texts, clear clues, I think ... because ..." },
    { id: "medium", name: "Detective", line: "Detective: longer texts, point, evidence, explain." },
    { id: "spicy", name: "Inspector", line: "Inspector: clues that cut both ways, and weighing up two readings." }
  ],
  themes: {
    time: { name: "Time travel", w: { who: "the time traveller", place: "the museum", event: "the museum party", landmark: "the old clock tower", legend: "a time portal opening" } },
    football: { name: "Football", w: { who: "the striker", place: "the training ground", event: "the team party", landmark: "the old stadium", legend: "a ghostly goalkeeper practising" } },
    horror: { name: "Horror", w: { who: "the night porter", place: "the hospital", event: "the end of shift party", landmark: "the old hospital", legend: "a ghost walking the wards" } },
    fishing: { name: "Fishing", w: { who: "the angler", place: "the lake", event: "the fishing club dinner", landmark: "the old boathouse", legend: "a ghostly fisherman casting at night" } },
    music: { name: "Music", w: { who: "the understudy", place: "the theatre", event: "the cast party", landmark: "the old theatre", legend: "a ghostly singer rehearsing" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: CLUES,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Clues add up", title: "One clue can mean anything. Several clues build a case.",
      fig: CLUES,
      html: "<p>One detail on its own can mean lots of things. A coat on could just mean someone is cold.</p>" +
        "<p>But when <b>several details point the same way</b>, you can build an <b>interpretation</b>: your reading of what is going on.</p>" +
        "<p class=\"a2task\">[[Who]] checked the clock for the fourth time. Their foot tapped under the table. They had put their coat on an hour before they needed to leave.</p>" +
        "<p>Clock, tapping, coat: all three point to one idea. [[Who]] is keen to get going.</p>",
      lv: {
        mild: { html: "<p>A <b>clue</b> is a detail that helps you work something out.</p>" +
          "<p>When <b>a few clues point the same way</b>, you can say what you think is going on.</p>" +
          "<p class=\"a2task\">[[Who]] looked at the clock. Their foot tapped. They had their coat on already.</p>" +
          "<p>Clock, tapping, coat on: [[who]] wants to go.</p>" },
        spicy: { html: "<p>An <b>interpretation</b> is a reading of a text that goes beyond what it says outright, built from evidence.</p>" +
          "<p>Strong interpretations use <b>several details</b>, often from different parts of the text, and they <b>fit all the evidence</b>, not just the bits that suit them.</p>" +
          "<p class=\"a2task\">[[Who]] checked the clock for the fourth time. Their foot tapped under the table. They had put their coat on an hour before they needed to leave.</p>" +
          "<p>\"Cold\" fits the coat, but not the clock or the tapping. \"Keen to get going\" fits all three. That is the stronger reading.</p>" } } },

    { type: "mc", topic: "Clues add up",
      q: "Which idea do <b>all three</b> details point to?<p class=\"a2task\">[[Who]] checked the clock for the fourth time. Their foot tapped under the table. They had put their coat on an hour before they needed to leave.</p>",
      options: ["[[Who]] is keen to get going.", "[[Who]] is cold.", "[[Who]] is running late.", "[[Who]] is enjoying a long rest."],
      answer: 0,
      slips: { 1: "Only the coat fits that. The clock and the tapping do not.", 2: "The coat went on an hour early, so they are not late.", 3: "Checking the clock four times does not sound restful." },
      hint: "Find the idea that fits the clock, the tapping and the coat.",
      why: "All three details fit \"keen to get going\". Each other idea fits one detail at most.",
      lv: {
        mild: { q: "What do the clues tell you?<p class=\"a2task\">[[Who]] looked at the clock. Their foot tapped. They had their coat on already.</p>",
          options: ["[[Who]] wants to go.", "[[Who]] is cold.", "[[Who]] is asleep."],
          slips: { 1: "The coat might mean cold. But the clock and the tapping do not fit.", 2: "Tapping feet and checking the clock? Not asleep." },
          hint: "Clock, tapping, coat. What do they all add up to?" },
        spicy: { q: "Which reading fits <b>all</b> the evidence?<p class=\"a2task\">[[Who]] had read the same page three times without turning it. A cup of tea sat by their elbow, cold and untouched. Every few minutes they glanced at the door, and twice they half stood up when footsteps passed outside.</p>",
          options: ["They are waiting for someone and cannot concentrate.", "They are gripped by a brilliant book.", "They do not like tea.", "They are about to fall asleep."],
          slips: { 1: "A gripping book gets its pages turned. Here the same page is read three times.", 2: "That might explain the cold tea, but not the door or the footsteps.", 3: "Half standing up at footsteps is alert, not sleepy." },
          hint: "Which reading explains the page, the tea, the glances and the half standing?",
          why: "Waiting and distracted explains every detail: the stuck page, the forgotten tea, the glances, the jumps at footsteps." } } },

    { type: "multi", topic: "Clues add up",
      q: "Here is an interpretation: <b>[[Who]] is nervous about the day ahead.</b> Pick the details that back it up.<p class=\"a2task\">[[Who]] had been awake since five. They ironed their shirt twice. At breakfast they ate half a slice of toast and left the rest. Then they put the radio on and sang along, loudly and badly.</p>",
      options: ["Awake since five", "Ironed their shirt twice", "Ate half a slice of toast and left the rest", "Sang along to the radio"],
      answers: [0, 1, 2],
      hint: "Which details sound like someone with a lot on their mind?",
      why: "Waking early, ironing twice and not eating all suggest nerves. Singing does not really fit (more on that next).",
      lv: { mild: { q: "Here is an idea: <b>[[Who]] is nervous.</b> Pick the clues that back it up.<p class=\"a2task\">[[Who]] woke up at five. They could not eat breakfast. Their hands shook. The sky was blue.</p>",
        options: ["Woke up at five", "Could not eat breakfast", "Their hands shook", "The sky was blue"],
        hint: "Which clues are about how [[who]] feels or acts?",
        why: "Waking early, not eating and shaking hands all point to nerves. The sky tells you about the weather, not about [[who]]." } } },

    { type: "mc", topic: "Clues add up",
      q: "Same text. Which detail does <b>not</b> back up the idea that [[who]] is nervous?",
      options: ["They sang along to the radio.", "They had been awake since five.", "They ironed their shirt twice.", "They left most of their toast."],
      answer: 0,
      slips: { 1: "Waking at five does back it up: nerves can stop you sleeping.", 2: "Ironing twice backs it up: checking things over and over is a nervous habit.", 3: "Leaving food backs it up: nerves can kill your appetite." },
      hint: "Three of these sound worried. One sounds cheerful.",
      why: "Singing along sounds cheerful, so on its own it does not back up nervous.",
      lv: {
        mild: { q: "Which clue does <b>not</b> tell you that [[who]] is nervous?",
          options: ["The sky was blue.", "Their hands shook.", "They could not eat breakfast."],
          slips: { 1: "Shaking hands can be a sign of nerves.", 2: "Nerves can stop you feeling hungry." },
          hint: "Which one is not about [[who]] at all?",
          why: "The sky is about the weather. It tells you nothing about how [[who]] feels." },
        spicy: { q: "Same text. Which detail could be read <b>two ways</b>?",
          options: ["They sang along, loudly and badly.", "They had been awake since five.", "They ironed their shirt twice.", "They left most of their toast."],
          slips: { 1: "Possible, but waking at five on a big day points fairly clearly to nerves.", 2: "Ironing twice is a fairly clear sign of checking and worrying.", 3: "Leaving food points fairly clearly to nerves." },
          hint: "Which one could mean happy, or could mean covering up nerves?",
          why: "Singing loudly might mean a good mood, or someone drowning out their worries. A careful reader notices that it cuts both ways." } } },

    { type: "text", topic: "Clues add up",
      q: "What do these details suggest about [[who]]? A few words is plenty.<p class=\"a2task\">[[Who]] hummed all the way to [[place]]. They waved at everyone they passed. When they got there, they did a little dance by the door.</p>",
      need: [["happy", "cheerful", "good mood", "great mood", "excited", "joy", "glad", "pleased", "buzzing", "upbeat", "delighted", "thrilled", "fun"]],
      model: "They are happy and in a good mood.",
      slips: [[["sad", "upset", "angry", "worried", "nervous"], "Humming, waving and dancing do not sound like that. What mood do they show?"]],
      hint: "Humming, waving, dancing. How would you feel if you did all three?",
      why: "All three details point to a happy, upbeat mood.",
      lv: { spicy: { q: "What do these details suggest about [[who]]? Name the idea <b>and</b> one detail that backs it up.<p class=\"a2task\">[[Who]] hummed all the way to [[place]]. They waved at everyone they passed. When they got there, they did a little dance by the door.</p>",
        need: [["happy", "cheerful", "good mood", "great mood", "excited", "joy", "glad", "pleased", "buzzing", "upbeat", "delighted", "thrilled"], ["hum", "wave", "waving", "waved", "danc"]],
        model: "They are in a really good mood, because they waved at everyone they passed.",
        hint: "Say the mood, then say \"because\" and pick a detail.",
        why: "A good mood, backed up by any of the humming, the waving or the dance." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Build the case", title: "Point, evidence, explain",
      fig: PEE,
      html: "<p class=\"a2task\">\"I'm fine,\" said [[who]], for the third time that morning. They had not touched their breakfast. When the phone buzzed, they grabbed it before the second ring, read the screen, and put it face down. Then they laughed a little too loudly at a joke nobody else found funny.</p>" +
        "<p><b>Worked example.</b></p>" +
        "<p><b>Point:</b> [[Who]] is more worried than they let on.<br>" +
        "<b>Evidence:</b> they \"had not touched their breakfast\" and grabbed the phone \"before the second ring\".<br>" +
        "<b>Explain:</b> not eating suggests nerves, and grabbing the phone so fast suggests they are waiting for news. Together they show that \"I'm fine\" is not the whole story.</p>",
      lv: {
        mild: { fig: PEE_MILD,
          html: "<p class=\"a2task\">\"I'm fine,\" said [[who]]. They did not eat their breakfast. They kept looking at their phone.</p>" +
            "<p><b>Worked example.</b></p>" +
            "<p><b>I think</b> [[who]] is worried<br><b>because</b> they \"did not eat their breakfast\".<br><b>This shows</b> they feel too worried to be hungry.</p>" },
        spicy: { html: "<p class=\"a2task\">\"I'm fine,\" said [[who]], for the third time that morning. They had not touched their breakfast. When the phone buzzed, they grabbed it before the second ring, read the screen, and put it face down. Then they laughed a little too loudly at a joke nobody else found funny.</p>" +
          "<p><b>Worked example.</b></p>" +
          "<p><b>Point:</b> [[Who]] seems to be hiding bad news.<br>" +
          "<b>Evidence:</b> they grab the phone \"before the second ring\" but then put it \"face down\", and later laugh \"a little too loudly\".<br>" +
          "<b>Explain:</b> the speed suggests they were waiting for this message; turning it over suggests it was not what they hoped. The forced laugh hints they are covering it. Each detail alone is weak; together they make \"I'm fine\" sound hollow.</p>" +
          "<p>Notice the careful words: <b>suggests</b>, <b>hints</b>, <b>seems</b>. An interpretation is a reading, not a fact.</p>" } } },

    { type: "order", topic: "Build the case",
      q: "Now with less help. Put this case in order.",
      items: ["Point: [[Who]] is waiting for news.", "Evidence: they grabbed the phone \"before the second ring\".", "Explain: grabbing it that fast suggests they were expecting a message.", "So \"I'm fine\" does not tell the whole story."],
      hint: "Say what you think, then the detail, then how the detail shows it.",
      why: "Point first, then the evidence, then the explanation that links them, then what it all adds up to.",
      lv: { mild: { items: ["I think [[who]] is waiting for a message", "because they \"kept looking at their phone\".", "This shows they really want it to buzz."],
        why: "I think, because, this shows: what you think, the clue, and how the clue shows it." } } },

    { type: "text", topic: "Build the case",
      q: "Point and evidence are done. Have a go at the <b>explain</b> part.<p class=\"a2task\"><b>Point:</b> [[Who]] is worried.<br><b>Evidence:</b> they \"had not touched their breakfast\".<br><b>Explain:</b> ...</p>",
      need: [["suggest", "show", "means", "mean", "because", "so", "might", "could", "nervous", "worried", "upset", "stress", "feel", "hungry", "appetite", "sick", "eat"]],
      model: "Not eating suggests they feel too nervous to be hungry.",
      slips: [[["fine"], "They say they are fine, but the point is that they are worried. How does the breakfast show that?"]],
      hint: "Why might someone who is worried not eat?",
      why: "Something like: not eating suggests they are too nervous to feel hungry. The explain part links the detail back to the point.",
      lv: {
        mild: { q: "Have a go at the <b>This shows</b> part.<p class=\"a2task\"><b>I think</b> [[who]] is worried<br><b>because</b> they \"did not eat their breakfast\".<br><b>This shows</b> ...</p>",
          model: "This shows they feel too worried to eat." },
        spicy: { q: "Point and evidence are done. Write an <b>explain</b> that links <b>both</b> details to the point.<p class=\"a2task\"><b>Point:</b> [[Who]] is hiding something from the others.<br><b>Evidence:</b> they say \"I'm fine\" three times, and laugh \"a little too loudly\" at a joke nobody else found funny.</p>",
          need: [["suggest", "show", "hint", "means", "imply", "implies", "seem", "might", "could"], ["fine", "laugh", "three", "repeat", "loud", "forced", "cover"]],
          model: "Saying \"I'm fine\" three times suggests they are trying to convince everyone, and the loud laugh hints they are covering up how they really feel.",
          hint: "Use a careful word like suggests or hints, and mention what the repeating and the laugh each tell you.",
          why: "A strong explain takes each detail in turn and shows how they build together: repeating \"I'm fine\" sounds like convincing, the forced laugh sounds like covering up." } } },

    { type: "sort", topic: "Build the case",
      q: "Point: <b>[[Who]] is worried.</b> Sort the details from the text.",
      buckets: ["Backs it up", "Does not help"],
      cards: [["had not touched their breakfast", 0], ["grabbed the phone before the second ring", 0], ["laughed a little too loudly", 0], ["it was the morning", 1], ["a joke was told", 1]],
      hint: "Ask of each one: does this tell me anything about how [[who]] feels?",
      why: "The breakfast, the phone and the loud laugh all hint at worry. The time of day and the joke itself tell you nothing about [[who]]'s feelings.",
      lv: {
        mild: { cards: [["did not eat their breakfast", 0], ["kept looking at their phone", 0], ["it was the morning", 1], ["the kitchen had a kettle", 1]] },
        spicy: { buckets: ["Backs it up", "Does not help", "Seems to go against it"],
          cards: [["had not touched their breakfast", 0], ["grabbed the phone before the second ring", 0], ["it was the morning", 1], ["a joke was told", 1], ["said \"I'm fine\"", 2], ["laughed", 2]],
          hint: "Some details look like they go against worried, until you read them closely.",
          why: "On the surface, \"I'm fine\" and laughing go against worried. A careful reader then asks why they say it three times, and why the laugh is \"too loud\"." } } },

    { type: "mc", topic: "Build the case", explain: true,
      q: "Which is the strongest case that [[who]] is worried?",
      options: ["They had not touched their breakfast and grabbed the phone before the second ring, which suggests nerves.", "They are worried because they seem worried.", "It just feels like they are worried.", "The text has lots of long sentences."],
      answer: 0,
      slips: { 1: "That goes round in a circle. Which one uses details from the text?", 2: "A feeling is a start, but a case needs evidence from the text.", 3: "That is about the writing, not about [[who]]." },
      hint: "Look for the one with details from the text.",
      why: "It uses two details and says what they suggest. That is a case.",
      lv: {
        mild: { q: "Which sentence uses a clue to back up the idea?",
          options: ["I think they are worried because they did not eat their breakfast.", "I think they are worried.", "I think they are worried because I just do."],
          slips: { 1: "That is the idea, but where is the clue?", 2: "\"I just do\" is not a clue from the text." },
          hint: "Which one has a because and a clue?",
          why: "It says what you think, then gives a clue from the text." },
        spicy: { q: "Which <b>explanation</b> is strongest?",
          options: ["Not eating and grabbing the phone both suggest nerves; together they hint at worrying news, which is why \"I'm fine\" rings false.", "They had not touched their breakfast, which shows they had not eaten.", "This shows they are worried because they are worried.", "The writer uses lots of description to make it interesting."],
          slips: { 1: "That just says the evidence again in other words. It does not explain what it shows.", 2: "That goes round in a circle.", 3: "Too general: it could be said about almost any text." },
          hint: "The best explanation links the details together and back to the point.",
          why: "It links two details, says what they suggest together, and connects back to what [[who]] says. The others repeat, go in circles, or stay vague." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Two readings", title: "Weigh up two readings",
      fig: BONNIE_DOOR,
      routes: [
        { name: "Read it", html: "<p>A text can often be read <b>two ways</b>. To judge which reading is <b>better supported</b>:</p>" +
          "<p>1. List the details that back up each reading.<br>2. Look for details that <b>go against</b> each one.<br>3. The better supported reading has more, and stronger, evidence, and less against it.</p>" +
          "<p class=\"a2task\">Bonnie ran to the door, ears up. She barked twice and spun in a circle. When Jay walked in, she jumped up at his legs.</p>" +
          "<p><b>Reading A:</b> Bonnie is scared. <b>Reading B:</b> Bonnie is excited Jay is home. Barking fits both. Running to the door, spinning and jumping at Jay only fit B. So B is better supported. Outrageous levels of excitement, frankly.</p>",
          fig: BONNIE_DOOR },
        { name: "See it", html: "<p>Think of a balance. Every detail that backs a reading up is a block on its side. The side with more, and heavier, blocks sinks: that reading is better supported.</p>" +
          "<p>For Bonnie: barking could go on either side. Running to the door, spinning and jumping at Jay all go on the excited side.</p>",
          fig: SCALE }
      ] },

    { type: "mc", topic: "Two readings",
      q: "Which reading is better supported?<p class=\"a2task\">[[Who]] left [[event]] at nine, an hour before the end. They yawned twice while saying goodbye, and mentioned an early start the next day. On the way out, they smiled and hugged the host. Their drink was left half full on the table.</p><p><b>Reading A:</b> [[Who]] was upset and wanted to get away.<br><b>Reading B:</b> [[Who]] was tired.</p>",
      options: ["Reading B: tired", "Reading A: upset"], answer: 0, fixed: true,
      slips: { 1: "Leaving early fits upset, but it fits tired too. Look at the yawns, the early start, and the smile." },
      hint: "Count the details that only fit one reading.",
      why: "Yawning and the early start back up tired. The smile and the hug go against upset.",
      lv: {
        mild: { q: "Which idea has more clues?<p class=\"a2task\">[[Who]] left [[event]] early. They yawned. They said, \"I have to get up early.\" They smiled and waved goodbye.</p><p><b>Idea A:</b> [[Who]] was upset.<br><b>Idea B:</b> [[Who]] was tired.</p>",
          options: ["Idea B: tired", "Idea A: upset"],
          slips: { 1: "Smiling and waving do not sound upset. Which clues point to tired?" },
          hint: "Yawning and getting up early. Which idea do they fit?",
          why: "Yawning and an early start both point to tired. Smiling does not fit upset." },
        spicy: { q: "Which judgement is fairest?<p class=\"a2task\">[[Who]] left [[event]] at nine, an hour before the end. Earlier, they had gone quiet when someone mentioned their old job. They yawned twice while saying goodbye, and mentioned an early start the next day. On the way out, they smiled and hugged the host. Their drink was left half full on the table.</p><p><b>Reading A:</b> [[Who]] was upset and wanted to get away.<br><b>Reading B:</b> [[Who]] was tired.</p>",
          options: ["B is better supported: two details back it, and the smile and hug go against A. A has one detail that might fit.", "A is better supported, because they went quiet.", "Both are equally supported.", "Neither reading has any evidence."],
          slips: { 1: "Going quiet is real evidence for A, but it is one detail, and the smile and hug pull against it.", 2: "Count them up: B has more for it and less against it.", 3: "Both readings have some evidence. The question is which has more." },
          hint: "Weigh it up: for each reading, what backs it and what goes against it?",
          why: "A has one detail for it (going quiet) and two against (smile, hug). B has two for it (yawns, early start) and nothing against. B wins, though A is not impossible." } } },

    { type: "multi", topic: "Two readings",
      q: "Pick the details that back up <b>Reading B: tired</b>.",
      options: ["They yawned twice", "They mentioned an early start", "They left at nine", "They smiled and hugged the host", "Their drink was half full"],
      answers: [0, 1],
      hint: "Which details are about being sleepy or needing bed?",
      why: "Yawning and an early start point to tired. Leaving early and the drink could fit either reading; the smile is about mood.",
      lv: { mild: { options: ["They yawned", "They have to get up early", "They smiled", "They waved goodbye"],
        why: "Yawning and getting up early both point to tired." } } },

    { type: "mc", topic: "Two readings",
      q: "Which detail goes <b>against</b> Reading A, that [[who]] was upset?",
      options: ["They smiled and hugged the host.", "They left an hour before the end.", "Their drink was left half full.", "They yawned twice."],
      answer: 0,
      slips: { 1: "Leaving early fits upset, as well as tired. It does not go against A.", 2: "A half full drink could fit either reading.", 3: "Yawning backs up B, but it does not really go against A." },
      hint: "Which detail sounds like someone in a good mood?",
      why: "Someone upset and desperate to leave is unlikely to smile and hug the host.",
      lv: {
        mild: { options: ["They smiled and waved goodbye.", "They left early.", "They yawned."],
          slips: { 1: "Leaving early could fit upset. It does not go against it.", 2: "Yawning points to tired, but it does not go against upset." } },
        spicy: { q: "Which detail fits <b>both</b> readings, so does not help you decide?",
          options: ["They left an hour before the end.", "They smiled and hugged the host.", "They yawned twice.", "They mentioned an early start."],
          slips: { 1: "That one goes against A, so it does help you decide.", 2: "Yawning backs B, so it helps you decide.", 3: "The early start backs B, so it helps." },
          hint: "Find the detail that an upset person and a tired person might both do.",
          why: "Leaving early fits upset and tired equally. A careful reader does not count it for either side." } } },

    { type: "text", topic: "Two readings",
      q: "Have a go at a judging sentence: which reading is better supported, and why?",
      need: [["tired", "reading b", "b is"], ["yawn", "early", "start", "smil", "hug", "sleep", "bed"]],
      model: "Reading B, that they were tired, is better supported, because they yawned twice and had an early start.",
      slips: [[["upset"], "Upset has a little support, but less. Which one do the yawns and the early start back up?"]],
      hint: "Name the reading, then say \"because\" and give a detail or two.",
      why: "Something like: B is better supported because they yawned and had an early start, and the smile goes against A.",
      lv: { spicy: { q: "Write a judging sentence that names the better supported reading, gives evidence for it, <b>and</b> says what goes against the other one.",
        need: [["tired", "reading b", "b is"], ["yawn", "early", "start", "sleep"], ["smil", "hug", "quiet"]],
        model: "Reading B is better supported: they were tired, as they yawned twice and had an early start, while smiling and hugging the host goes against A.",
        hint: "Three parts: which reading, evidence for it, and something against the other.",
        why: "A strong judgement weighs both sides: evidence for B, and evidence against A." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Case closed", title: "The mystery at [[landmark]]",
      fig: NIGHT,
      html: "<p>Last case. Read it through once, then weigh it up, detective.</p>" +
        "<p class=\"a2task\"><b>Strange lights at [[landmark]]</b><br>For three nights running, people on Harbour Road have seen lights moving inside [[landmark]] after midnight. \"It is [[legend]], no doubt about it,\" said one neighbour, who did not want to be named. Others are not so sure. A white van with ladders on the roof has been parked by the side gate each evening. On Tuesday, the bin outside was full of empty boxes for light bulbs. The council website says safety work on [[landmark]] will take place this month, at night, to avoid disruption.</p>" +
        "<p><b>Reading A:</b> it is [[legend]]. <b>Reading B:</b> workers are doing repairs at night.</p>",
      lv: {
        mild: { html: "<p>Last case. Read it, then weigh it up, detective.</p>" +
          "<p class=\"a2task\"><b>Strange lights at [[landmark]]</b><br>People have seen lights in [[landmark]] at night. A neighbour said, \"It is [[legend]]!\" A van with ladders is parked by the gate. The bin is full of boxes from new light bulbs.</p>" +
          "<p><b>Idea A:</b> it is [[legend]]. <b>Idea B:</b> workers are fixing the lights.</p>" },
        spicy: { html: "<p>Last case. Read it carefully, then weigh it up, Inspector.</p>" +
          "<p class=\"a2task\"><b>Strange lights at [[landmark]]</b><br>For three nights running, people on Harbour Road have seen lights moving inside [[landmark]] after midnight. \"It is [[legend]], no doubt about it,\" said one neighbour, who did not want to be named. A local history blog points out that ghost stories about [[landmark]] go back to 1902. Others are not so sure. A white van with ladders on the roof has been parked by the side gate each evening, and some people report a faint tapping. On Tuesday, the bin outside was full of empty boxes for light bulbs. The council website says safety work on [[landmark]] will take place this month, at night, to avoid disruption. The lights have only been seen on weekdays.</p>" +
          "<p><b>Reading A:</b> it is [[legend]]. <b>Reading B:</b> workers are doing repairs at night.</p>" } } },

    { type: "sort", topic: "Case closed",
      q: "Sort the evidence. Which reading does each detail point to?",
      buckets: ["Points to [[legend]]", "Points to night repairs"],
      cards: [["A neighbour says it is [[legend]]", 0], ["A van with ladders by the side gate", 1], ["Empty light bulb boxes in the bin", 1], ["The council says safety work will happen at night", 1]],
      hint: "Which details could you actually check?",
      why: "Only the neighbour's claim points to [[legend]]. The van, the boxes and the council notice all point to repairs.",
      lv: {
        mild: { cards: [["A neighbour said it is [[legend]]", 0], ["A van with ladders by the gate", 1], ["Boxes from new light bulbs", 1]] },
        spicy: { buckets: ["Points to [[legend]]", "Points to night repairs", "Could fit either"],
          cards: [["A neighbour says it is [[legend]]", 0], ["Ghost stories go back to 1902", 0], ["A van with ladders by the side gate", 1], ["Empty light bulb boxes in the bin", 1], ["The council notice about night work", 1], ["Lights only on weekdays", 1], ["Lights moving after midnight", 2], ["A faint tapping", 2]],
          hint: "Moving lights and tapping: would a ghost and a worker both explain them?",
          why: "Moving lights and tapping fit either reading. Old stories show people have told tales, not that the tales are true. Weekdays only sounds like working hours." } } },

    { type: "mc", topic: "Case closed", explain: true,
      q: "Which reading is better supported?",
      options: ["Workers are doing repairs at night", "It is [[legend]]", "Both are equally supported"],
      answer: 0,
      slips: { 1: "Spooky, but only one person says so, and nobody is named. Look at the van, the boxes and the council notice.", 2: "Count up what backs each one. One side has much more." },
      hint: "Weigh it: how many details back each reading?",
      why: "Three checkable details back repairs: the van, the boxes and the council notice. Only one unnamed person backs [[legend]].",
      lv: { spicy: { why: "Repairs is backed by four checkable details (van, boxes, council notice, weekdays only). [[Legend]] is backed by an unnamed opinion and old stories. Moving lights and tapping fit both, so they do not decide it. Case closed, probably." } } },

    { type: "mc", topic: "Case closed",
      q: "Why is the neighbour's quote <b>weak</b> evidence?",
      options: ["It is one unnamed person's opinion, with nothing to back it up.", "It is too short.", "It is in speech marks.", "Neighbours always make things up."],
      answer: 0,
      slips: { 1: "Short quotes can be strong evidence. The problem is what kind of statement it is.", 2: "Speech marks just show someone said it. That is not the problem.", 3: "That is a bit unfair on neighbours. The problem is this particular claim." },
      hint: "Could you check what the neighbour says? Do you know who they are?",
      why: "It is an opinion from someone we cannot identify, with no detail to check. The van, the boxes and the notice are all things you could check.",
      lv: {
        mild: { q: "Which clue points <b>most clearly</b> to workers fixing the lights?",
          options: ["Boxes from new light bulbs in the bin", "People have seen lights at night", "A neighbour said, \"It is [[legend]]!\""],
          slips: { 1: "Lights at night fit both ideas. Which clue only fits fixing?", 2: "That clue points the other way." },
          hint: "What would you find in a bin if someone had been putting in new bulbs?",
          why: "New bulb boxes only make sense if someone has been fitting new lights." },
        spicy: { q: "The history blog says ghost stories about [[landmark]] go back to 1902. How much does that help Reading A?",
          options: ["Not much: it shows people have told stories, not that the stories are true.", "A lot: if people have said it for over 100 years, it must be true.", "It proves Reading B is false.", "It does not matter where the evidence comes from."],
          slips: { 1: "A story being old does not make it true. Lots of old stories are made up.", 2: "It does not touch the van, the boxes or the notice at all.", 3: "Where evidence comes from matters a lot. A blog about old stories is not proof." },
          hint: "Is it evidence of a ghost, or evidence of stories about a ghost?",
          why: "It is evidence that the stories exist. It is not evidence of what is causing these lights this week." } } },

    { type: "write", topic: "Case closed",
      q: "Write your verdict, if you like. Which reading is better supported, and what is your evidence? Jay would love to read it, if you choose to send it.",
      starters: ["I think the lights are", "The strongest evidence is", "This suggests", "The other reading is weaker because"],
      checklist: ["Say which reading you think is better supported", "Use at least two details from the text", "Explain what the details show", "Say why the other reading is weaker"],
      minWords: 40,
      lv: { mild: { starters: ["I think the lights are", "because", "This shows"], checklist: ["Say what you think", "Give a clue from the text"], minWords: 20 },
        spicy: { minWords: 60, checklist: ["Name the better supported reading", "Use two or three details, quoted", "Explain how they build together", "Deal with the evidence for the other reading", "Use careful words like suggests or hints"] } } }
  ],

  realWorld: {
    title: "Detectives, juries and historians do this for real",
    html: "<p>Police detectives, juries and journalists all weigh evidence to decide which explanation is best supported. So do doctors working out why someone feels ill, and mechanics working out why a car will not start.</p>" +
      "<p>Historians do it most of all. They cannot go back and look, so they piece the past together from clues and argue about which reading fits best. For our big question, if we could time travel, should we? It would settle a lot of arguments. But even people who were there at the time often disagree about what they saw.</p>",
    fig: '<svg viewBox="0 0 440 160" role="img" aria-label="Jay by a time portal, holding a case file">' + '<rect width="440" height="160" rx="16" fill="#f4f1ea"/>' +
      A2ART.portal(80, 80, 58) + A2ART.jay(240, 54, 0.85, "hmm") +
      '<rect x="300" y="100" width="70" height="50" rx="4" fill="#e8c27a" stroke="#141a33" stroke-width="2"/>' + T(335, 130, "CASE", 13, { a: "middle", b: 1 }) +
      A2ART.bubble(290, 8, 140, 52, "Or we could just\nweigh the clues.", 300) + '</svg>'
  },

  make: {
    title: "Make a case file card",
    intro: "Your verdict on the mystery, or on any text you like, with the clues that back it up. Keep it, or send it to Jay.",
    fields: [
      { id: "case", label: "The case", ph: "The lights at the old tower", max: 40 },
      { id: "verdict", label: "My verdict", ph: "Workers are doing repairs at night", max: 70 },
      { id: "c1", label: "Clue 1", ph: "A van with ladders by the gate", max: 50 },
      { id: "c2", label: "Clue 2", ph: "Empty light bulb boxes in the bin", max: 50 },
      { id: "name", label: "Detective", ph: "Inspector B5", max: 24 }
    ],
    svg: function(v){
      var cs = wrap(v["case"], 28, 1)[0] || "", vd = wrap(v.verdict, 30, 3), c1 = wrap(v.c1, 34, 2), c2 = wrap(v.c2, 34, 2);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">' +
        '<rect width="600" height="420" rx="24" fill="#2e3566"/>' +
        '<path d="M30 60h150l20 -22h120l20 22h230v340h-540z" fill="#e8c27a" stroke="#141a33" stroke-width="3"/>' +
        T(214, 58, "CASE FILE", 16, { b: 1, ls: 3 }) +
        T(52, 98, "Case: " + esc(cs), 18, { b: 1 }) +
        '<rect x="52" y="112" width="496" height="104" rx="8" fill="#fffbe9" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
        T(66, 136, "VERDICT", 13, { b: 1, c: "#8a4b22", ls: 2 }) +
        vd.map(function(l, k){ return T(66, 164 + k * 24, esc(l), 20, { b: 1 }); }).join("") +
        T(52, 240, "CLUE 1", 13, { b: 1, c: "#8a4b22", ls: 2 }) + c1.map(function(l, k){ return T(52, 262 + k * 22, esc(l), 17); }).join("") +
        T(52, 312, "CLUE 2", 13, { b: 1, c: "#8a4b22", ls: 2 }) + c2.map(function(l, k){ return T(52, 334 + k * 22, esc(l), 17); }).join("") +
        T(52, 392, "Detective: " + esc(wrap(v.name, 24, 1)[0] || ""), 15, { c: "#5b3a1a" }) +
        '<g transform="translate(484 372) rotate(-10)"><rect x="-56" y="-20" width="112" height="40" rx="6" fill="none" stroke="#c0392b" stroke-width="4"/>' + T(0, 8, "CLOSED", 20, { a: "middle", b: 1, c: "#c0392b" }) + '</g>' +
        '</svg>';
    }
  }
};
})();
