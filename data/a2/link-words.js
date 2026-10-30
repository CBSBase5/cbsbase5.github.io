/* Base 5 Autumn 2 activity: Link words.
   English. Words and phrases that link ideas: inside sentences, between
   sentences, between paragraphs, and words that point back. ASCII only. */
(function(){
var A = window.A2ART;

function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
/* rough Verdana width, so long typed text can be squeezed to fit */
function textW(t, sz, b){
  var w = 0;
  String(t).replace(/&[a-z#0-9]+;/g, "x").split("").forEach(function(c){
    w += /[WM]/.test(c) ? 1 : /[mw]/.test(c) ? 0.84 : /[A-Z]/.test(c) ? 0.72 : /[ijlI.,:;'!|]/.test(c) ? 0.3 : /[ frt]/.test(c) ? 0.4 : 0.62;
  });
  return w * sz * (b ? 1.08 : 1);
}
function T(x, y, t, sz, o){
  o = o || {};
  var fit = o.fit && textW(t, sz || 14, o.b) > o.fit ? ' textLength="' + o.fit + '" lengthAdjust="spacingAndGlyphs"' : "";
  return '<text x="' + x + '" y="' + y + '" font-family="Verdana,Arial,sans-serif" font-size="' + (sz || 14) + '"' +
    (o.b ? ' font-weight="700"' : "") + (o.a ? ' text-anchor="' + o.a + '"' : "") + fit + ' fill="' + (o.c || "#141a33") + '">' + t + '</text>';
}
function wrap(t, n, max){
  var w = [], out = [], cur = "";
  String(t || "").split(/\s+/).forEach(function(x){ while(x.length > n){ w.push(x.slice(0, n)); x = x.slice(n); } if(x) w.push(x); });
  w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; });
  if(cur.trim()) out.push(cur.trim());
  if(out.length > max){ out = out.slice(0, max); out[max - 1] = out[max - 1].replace(/.{0,3}$/, "..."); }
  return out;
}

/* two islands of meaning joined by a bridge with a link word on it */
function bridge(a, link, b, extra){
  function lines(ls, x){ var y0 = 56 - (ls.length - 1) * 10; return ls.map(function(l, k){ return T(x, y0 + k * 20, l, 14, { a: "middle", fit: 186 }); }).join(""); }
  return '<svg viewBox="0 0 540 210" role="img" aria-label="Two ideas on two islands, joined by a bridge called ' + link + '">' +
    '<rect width="540" height="210" rx="16" fill="#bfe6f7"/>' +
    '<path d="M0 170q30 -10 60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0" fill="none" stroke="#ffffff" stroke-width="3" stroke-opacity=".7"/>' +
    '<path d="M10 150q10 -70 110 -76q100 6 110 76z" fill="#7cc576" stroke="#141a33" stroke-width="2.5"/>' +
    '<path d="M310 150q10 -70 110 -76q100 6 110 76z" fill="#7cc576" stroke="#141a33" stroke-width="2.5"/>' +
    '<rect x="20" y="24" width="200" height="54" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
    '<rect x="320" y="24" width="200" height="54" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
    lines(wrap(a, 22, 2), 120) + lines(wrap(b, 22, 2), 420) +
    '<path d="M200 118q70 -36 140 0" fill="none" stroke="#7a5532" stroke-width="10"/>' +
    '<path d="M210 112v24M240 100v26M270 96v24M300 100v26M330 112v24" stroke="#7a5532" stroke-width="4"/>' +
    '<rect x="222" y="62" width="96" height="34" rx="17" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/>' +
    T(270, 85, link, 17, { b: 1, a: "middle", fit: 84 }) +
    (extra || "") + '</svg>';
}
var BRIDGE = bridge("[[Hero]] was tired.", "but", "[[Pr]] kept going.",
  A.egg(A.bird(486, 128, 0.6, "#ff5d5d"), "A bird on the far island. It used the bridge. Jay was delighted."));

/* the jobs that link words do */
var JOBS_LIST = [
  ["Add", "+", "#19c39a", ["and", "also", "in addition"]],
  ["Contrast", "<>", "#ff5d8f", ["but", "however", "on the", "other hand"]],
  ["Reason", "?", "#ffd23f", ["because", "since"]],
  ["Result", "=>", "#22b8e6", ["so", "as a result", "therefore"]],
  ["Time", "o", "#8a5cf6", ["then", "next", "meanwhile", "finally"]]
];
function jobsFig(n){
  var list = JOBS_LIST.slice(0, n), w = 520 / n;
  return '<svg viewBox="0 0 540 220" role="img" aria-label="The jobs link words do: ' + list.map(function(j){ return j[0]; }).join(", ") + '">' +
    '<rect width="540" height="220" rx="16" fill="#f4f1ea"/>' +
    list.map(function(j, k){
      var x = 10 + k * w, cx = x + w / 2, icon;
      if(j[1] === "o") icon = '<circle cx="' + cx + '" cy="50" r="16" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/><path d="M' + cx + ' 40v10l8 5" stroke="#141a33" stroke-width="2.5" fill="none"/>';
      else icon = T(cx, 58, j[1], 22, { b: 1, a: "middle" });
      return '<rect x="' + (x + 4) + '" y="12" width="' + (w - 8) + '" height="196" rx="12" fill="' + j[2] + '" fill-opacity=".3" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
        icon + T(cx, 96, j[0], 15, { b: 1, a: "middle" }) +
        (n < 5 ? j[3].slice(0, 2) : j[3]).map(function(word, i){ return T(cx, 126 + i * 21, word, 13, { a: "middle" }); }).join("");
    }).join("") + '</svg>';
}

/* sentences held together like a chain */
var CHAIN =
  '<svg viewBox="0 0 540 170" role="img" aria-label="Four sentences joined by link words like links in a chain">' +
  '<rect width="540" height="170" rx="16" fill="#eef6fb"/>' +
  [0, 1, 2, 3].map(function(k){
    var x = 16 + k * 132;
    return '<rect x="' + x + '" y="30" width="112" height="52" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
      '<path d="M' + (x + 14) + ' 50h84M' + (x + 14) + ' 64h60" stroke="#9aa0b8" stroke-width="6" stroke-linecap="round"/>' +
      (k < 3 ? '<ellipse cx="' + (x + 122) + '" cy="56" rx="16" ry="10" fill="none" stroke="#5b6180" stroke-width="5"/>' : "");
  }).join("") +
  [["First", 72], ["Then", 204], ["but", 336], ["because", 468]].map(function(l){ return '<rect x="' + (l[1] - 40) + '" y="104" width="80" height="30" rx="15" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>' + T(l[1], 124, l[0], 14, { b: 1, a: "middle" }); }).join("") +
  T(270, 160, "Link words hold the sentences together", 14, { a: "middle", c: "#3b4160" }) +
  '</svg>';

/* a pointing word, pointing back */
var POINT =
  '<svg viewBox="0 0 540 190" role="img" aria-label="The word It points back to the [[kit]]">' +
  '<rect width="540" height="190" rx="16" fill="#f4f1ea"/>' +
  '<rect x="16" y="70" width="330" height="96" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
  T(32, 102, "[[Hero]] packed", 15, { fit: 300 }) +
  '<rect x="30" y="118" width="170" height="34" rx="8" fill="#9fd3ff" stroke="#1f6f9a" stroke-width="2"/>' + T(115, 141, "the [[kit]].", 15, { b: 1, a: "middle", fit: 156 }) +
  '<rect x="360" y="118" width="164" height="48" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
  '<rect x="370" y="126" width="34" height="30" rx="6" fill="#ffd23f"/>' + T(375, 147, "It", 15, { b: 1 }) + T(412, 147, "was heavy.", 15) +
  '<path d="M378 158q-80 40 -168 -14" fill="none" stroke="#e04848" stroke-width="3.5"/><path d="M202 139l16 0 -8 12z" fill="#e04848"/>' +
  T(300, 36, "It points back to the [[kit]]", 15, { b: 1, a: "middle", c: "#e04848" }) +
  '</svg>';

/* the four paragraphs of the article and how they hook together */
var ARTMAP =
  '<svg viewBox="0 0 540 250" role="img" aria-label="Four paragraphs. However turns the argument, on the other hand turns it back, overall sums up">' +
  '<rect width="540" height="250" rx="16" fill="#f4f1ea"/>' +
  [["1  The dream", "#22b8e6"], ["2  The risks", "#ff5d8f"], ["3  What we could learn", "#19c39a"], ["4  Weighing it up", "#ffd23f"]].map(function(p, k){
    var y = 16 + k * 58;
    return '<rect x="20" y="' + y + '" width="250" height="44" rx="10" fill="' + p[1] + '" fill-opacity=".35" stroke="#141a33" stroke-width="2"/>' +
      T(36, y + 28, p[0], 15, { b: 1 }) +
      (k ? '<rect x="300" y="' + (y + 6) + '" width="220" height="32" rx="16" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' + T(410, y + 27, ["", "However", "On the other hand", "Overall"][k], 14, { b: 1, a: "middle" }) +
        '<path d="M300 ' + (y + 22) + 'h-26" stroke="#141a33" stroke-width="2.5"/>' : "");
  }).join("") +
  T(410, 44, "link phrases", 14, { a: "middle", c: "#3b4160" }) +
  '</svg>';

var MILD_TEXT = "<p class=\"a2task\">[[Hero]] got ready for [[event]]. <b>First</b>, [[pr]] packed [[pos]] [[kit]]. <b>Then</b> [[pr]] set off for [[place]]. It was raining, <b>but</b> [[pr]] did not mind. [[Pr]] was [[feel]] <b>because</b> [[reason]].</p>";
var MED_TEXT = "<p class=\"a2task\">[[Event]] had been planned for weeks. [[Hero]] had practised every day. <b>For example</b>, [[pr]] [[practice]]. <b>As a result</b>, [[pr]] felt ready.<br><br>" +
  "<b>However</b>, on the day, nothing went to plan. [[Problem]]. <b>Meanwhile</b>, [[mw]]. <b>In the end</b>, [[ending]].</p>";
function plain(h){ return h.replace(/<\/?b>/g, ""); }
var ARTICLE = "<p class=\"a2task\"><b>Should we visit the past?</b><br><br>" +
  "(1) Many people dream of visiting the past. They imagine walking through old streets, meeting famous people or even seeing dinosaurs. This dream appears in hundreds of films and books.<br><br>" +
  "(2) However, a trip to the past could be risky. A traveller might change something by accident. Even a tiny change, such as stepping on an insect, could have huge effects years later. These effects might never be put right.<br><br>" +
  "(3) On the other hand, the past could teach us a great deal. Historians could see what really happened, rather than relying on old records. For this reason, some people argue that a careful visit would be worth the risk.<br><br>" +
  "(4) Overall, the question is not simple. Perhaps the safest plan would be to visit, look closely, and touch nothing.</p>";

(window.A2PACKS = window.A2PACKS || {})["link-words"] = {
  a2: true,
  id: "a2-link-words",
  title: "Link words",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "The little words that hold ideas together: and, but, because, then, however, and more.",
  blurb: "How link words join ideas, inside sentences, between sentences and across a whole text. Four short chunks, with a link bridge to make at the end.",
  note: "Link words: the little words that hold writing together. Four five minute chunks and a bridge to build at the end. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Stepping stones", line: "Stepping stones: and, but, because, then and also, in short sentences." },
    { id: "medium", name: "Rope bridge", line: "Rope bridge: linking phrases inside paragraphs and between them." },
    { id: "spicy", name: "Suspension bridge", line: "Suspension bridge: how a whole text holds together, from link phrases to words that point back." }
  ],
  themes: {
    time: { name: "Time travel", w: { hero: "the time traveller", pr: "she", pos: "her", event: "the trip to 1850", kit: "toolbox", place: "the time machine", feel: "excited", reason: "she had never seen a steam train",
      practice: "studied old maps of London every night", problem: "the time machine landed in the wrong year", mw: "her assistant waited back in 2026, watching the clock", ending: "she found the right year with one minute to spare" } },
    football: { name: "Football", w: { hero: "the striker", pr: "he", pos: "his", event: "the cup final", kit: "kit bag", place: "the stadium", feel: "excited", reason: "he had never played in a final",
      practice: "took fifty penalties before school", problem: "the team bus broke down on the motorway", mw: "the fans waited in the rain", ending: "he arrived just in time to score the winner" } },
    horror: { name: "Horror", w: { hero: "the night porter", pr: "he", pos: "his", event: "the night shift", kit: "torch", place: "the old hospital", feel: "nervous", reason: "the lift had been acting strangely",
      practice: "walked every corridor until he knew it by heart", problem: "every light on floor 3 went out at once", mw: "the patients slept on, knowing nothing", ending: "he found the fuse box and the lights flickered back on" } },
    fishing: { name: "Fishing", w: { hero: "the angler", pr: "she", pos: "her", event: "the big match", kit: "tackle box", place: "the lake", feel: "excited", reason: "a giant carp had been spotted",
      practice: "cast at a target on the lawn", problem: "a storm blew in across the lake", mw: "the other anglers packed up and went home", ending: "she landed a huge carp just as the sun came out" } },
    music: { name: "Music", w: { hero: "the singer", pr: "she", pos: "her", event: "opening night", kit: "costume bag", place: "the theatre", feel: "nervous", reason: "the show had sold out",
      practice: "sang the big song twice a day", problem: "the microphone stopped working", mw: "the audience waited in their seats", ending: "she sang without it, and the back row heard every word" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: BRIDGE,
  steps: [

    /* ---------- chunk 1: joining ideas ---------- */
    { type: "learn", topic: "Joining ideas", title: "Link words join ideas",
      fig: BRIDGE,
      html: "<p>A link word is a bridge between two ideas.</p>" +
        "<p><b>[[Hero]] was tired. [[Pr]] kept going.</b> Two ideas, sitting on their own islands.</p>" +
        "<p><b>[[Hero]] was tired, but [[pr]] kept going.</b> Now <b>but</b> joins them, and tells you the second idea is a surprise.</p>" +
        "<p>Five useful link words: <b>and, but, because, then, also</b>.</p>",
      lv: { medium: { html: "<p>A link word is a bridge between two ideas. It tells the reader <b>how</b> the ideas connect.</p>" +
          "<p><b>[[Hero]] was tired, but [[pr]] kept going.</b> <b>But</b> shows a surprise.</p>" +
          "<p>Links can be phrases too, and they often start a new sentence: <b>[[Pr]] practised every day. As a result, [[pr]] felt ready.</b></p>" +
          "<p>Useful ones: <b>however, as a result, for example, meanwhile, in the end</b>.</p>" },
        spicy: { html: "<p>Writers hold a text together with <b>cohesive devices</b>: words and phrases that link one idea to the next.</p>" +
          "<p>Some work inside a sentence (<b>but, because</b>). Some start a new sentence (<b>As a result, ...</b>). Some open a whole paragraph and tell you how it connects to the one before (<b>However, ...</b> or <b>On the other hand, ...</b>).</p>" +
          "<p>Others point back to something already said, so the writer does not repeat it: <b>it, they, this, these effects</b>.</p>" +
          "<p>Formal ones to know: <b>furthermore, nevertheless, consequently, similarly, overall</b>.</p>" } } ,
      ez: { title: "Link words", html: "<p>A <b>link word</b> joins 2 ideas: and, but, because, then.</p><p>[[Hero]] was tired, <b>but</b> [[pr]] kept going.</p>" } },

    { type: "mc", topic: "Joining ideas",
      q: "Which word is the link word? \"[[Hero]] was cold, but [[pr]] stayed outside.\"",
      options: ["but", "cold", "stayed", "outside"],
      answer: 0,
      slips: { 1: "Cold describes how they felt. Which word joins the two ideas?", 2: "Stayed is something they did. Look for the word in the middle that joins the two halves.", 3: "Outside is a place. Which word is the bridge?" },
      hint: "Find the word that joins the two halves of the sentence.",
      why: "<b>But</b> joins \"was cold\" and \"stayed outside\", and shows a surprise.",
      ez: { hint: "Find the word in the middle.", why: "<b>But</b> joins the two halves.",
        slips: { 1: "Cold is a feeling. Find the joining word.", 2: "Stayed is a doing word. Find the joiner.", 3: "Outside is a place. Find the joiner." } },
      lv: { medium: { q: "Which is the link phrase? \"[[Pr]] practised every day. As a result, [[pr]] felt ready.\"",
          options: ["As a result", "practised", "every day", "felt ready"],
          slips: { 1: "Practised is what they did. Look at the start of the second sentence.", 2: "Every day tells you how often. Which phrase joins the second sentence to the first?", 3: "Felt ready is the idea, not the link." },
          hint: "Look at how the second sentence begins.",
          why: "<b>As a result</b> links the two sentences: feeling ready happened because of the practice." },
        spicy: { q: "Which is the cohesive device? \"The plan was simple. The weather, however, had other ideas.\"",
          options: ["however", "simple", "weather", "other ideas"],
          slips: { 1: "Simple describes the plan. Which word links the two sentences?", 2: "Weather is what the sentence is about, not the link.", 3: "Other ideas is the idea itself. Which word signals the turn?" },
          hint: "Link words do not always come first. Look for one tucked inside the second sentence.",
          why: "<b>However</b> sits in the middle of the sentence, but it still links back and signals a contrast with the simple plan." } } },

    { type: "mc", topic: "Joining ideas",
      q: "Which link word fits? \"[[Hero]] packed a coat ___ it was raining.\"",
      options: ["because", "but", "then"],
      answer: 0,
      slips: { 1: "But shows a surprise. Packing a coat for rain is not a surprise. It is a reason.", 2: "Then means next in time. Here the rain is the reason for the coat." },
      hint: "Why did they pack a coat?",
      why: "The rain is the <b>reason</b> for the coat, so <b>because</b> fits.",
      ez: { hint: "Why pack a coat?", why: "Rain is the <b>reason</b>. So <b>because</b>.", slips: { 1: "But is for a surprise. This is a reason.", 2: "Then is for next. This is a reason." } },
      lv: { medium: { q: "Which link phrase fits? \"[[Hero]] practised every day. ___, [[pr]] felt ready.\"",
          options: ["As a result", "However", "For example"],
          slips: { 1: "However shows a contrast. Feeling ready after practice is not a surprise; it is a result.", 2: "For example gives an example. Feeling ready is not an example of practising." },
          hint: "Feeling ready happened because of the practice.",
          why: "Practice leads to feeling ready: a result, so <b>As a result</b> fits." },
        spicy: { q: "Which fits best? \"[[Problem]]. ___, [[event]] started late.\"",
          options: ["Consequently", "Nevertheless", "Similarly", "Furthermore"],
          slips: { 1: "Nevertheless means \"even so\". Starting late is not a surprise after that; it is what you would expect.", 2: "Similarly compares two alike things. Starting late is caused by the problem.", 3: "Furthermore adds another point. Here the second sentence is caused by the first." },
          hint: "Did the first thing cause the second?",
          why: "The problem caused the late start, so the link shows a result: <b>Consequently</b>." } } },

    { type: "match", topic: "Joining ideas",
      q: "Match each link word to its job.",
      pairs: [["and", "adds another idea"], ["but", "shows a difference"], ["because", "gives a reason"], ["then", "says what happens next"]],
      hint: "Try each word in a sentence: I was hungry ___ I had a sandwich.",
      why: "<b>And</b> adds, <b>but</b> contrasts, <b>because</b> gives a reason, <b>then</b> moves time on.",
      ez: { hint: "Try each one in a sentence.", why: "And adds. But turns. Because says why. Then is next." },
      lv: { medium: { pairs: [["also", "adds another idea"], ["however", "shows a contrast"], ["as a result", "shows what happened because of it"], ["for example", "gives an example"], ["meanwhile", "at the same time, somewhere else"]],
          why: "Each phrase does a different job. Picking the right one tells the reader exactly how ideas connect." },
        spicy: { pairs: [["furthermore", "adds a further point"], ["nevertheless", "even so, despite that"], ["consequently", "this happened because of that"], ["similarly", "compares two alike things"], ["subsequently", "after that, later"]],
          why: "Formal links do the same jobs as the everyday ones: add, contrast, result, compare and time." } } },

    { type: "text", topic: "Joining ideas",
      q: "Join these two ideas with a link word that shows a <b>surprise</b>: \"It was raining. [[Hero]] went outside.\"",
      need: [["but", "however", "although", "though", "even so", "yet", "still", "nevertheless"]],
      slips: [[["because"], "Because gives a reason. Was the rain the reason for going out? Try a word that shows a surprise."], [["and"], "And just adds. Try a word that shows it is surprising, like but."]],
      model: "It was raining, but [[hero]] went outside anyway.",
      hint: "Which link word shows a difference or a surprise?",
      why: "<b>But</b> (or however, or although) tells the reader the second idea is surprising.",
      ez: { q: "Join them with a <b>surprise</b> word: \"It was raining. [[Hero]] went outside.\"", hint: "Which word shows a surprise?", why: "<b>But</b> shows a surprise.",
        slips: [[[], "Because is a reason. Try a surprise word, like but."], [[], "And just adds. Try but."]] },
      lv: { spicy: { q: "Rewrite as one or two sentences with a formal link that shows \"even so\": \"It was raining. [[Hero]] went outside.\"",
        model: "It was raining. Nevertheless, [[hero]] went outside.",
        why: "<b>Nevertheless</b>, <b>however</b> and <b>even so</b> all keep the surprise; nevertheless is the most formal." } } },

    /* ---------- chunk 2: picking the right link ---------- */
    { type: "learn", topic: "Picking the right link", title: "Every link word has a job",
      fig: jobsFig(3),
      html: "<p>Link words do different jobs. Pick the one that matches what you mean.</p>" +
        "<p><b>Add</b> more: and, also.<br><b>Contrast</b>, a difference: but.<br><b>Reason</b>, the why: because.</p>" +
        "<p>[[Hero]] packed [[pos]] [[kit]] <b>and</b> a snack. It was raining, <b>but</b> [[pr]] did not mind. [[Pr]] was [[feel]] <b>because</b> [[reason]].</p>",
      lv: { medium: { fig: jobsFig(5),
          html: "<p>Link words and phrases do five main jobs:</p>" +
            "<p><b>Add:</b> and, also, in addition. <b>Contrast:</b> but, however, on the other hand. <b>Reason:</b> because, since. <b>Result:</b> so, as a result, therefore. <b>Time:</b> then, next, meanwhile, finally.</p>" +
            "<p>Swap one for another and the meaning changes. \"[[Pr]] practised. <b>However</b>, [[pr]] felt ready\" sounds odd, because practice is not a surprise reason to feel ready.</p>" },
        spicy: { fig: jobsFig(5),
          html: "<p>Link words and phrases do five main jobs: <b>add</b>, <b>contrast</b>, <b>reason</b>, <b>result</b> and <b>time</b>. Formal writing adds <b>compare</b> (similarly, likewise) and <b>sum up</b> (overall, in conclusion).</p>" +
            "<p>The job matters more than the word. \"Nevertheless\" and \"but\" do the same job; one just sounds more formal.</p>" +
            "<p>When you read, the link tells you what is coming before you get there. <b>However</b> warns you the writer is about to turn.</p>" } } ,
      ez: { title: "Every link has a job", html: "<p><b>And</b> adds. <b>But</b> turns. <b>Because</b> says why.</p><p>It was raining, <b>but</b> [[pr]] did not mind.</p>" } },

    { type: "sort", topic: "Picking the right link",
      q: "Sort the link words by their job, if you like.",
      buckets: ["Add", "Contrast", "Reason or result", "Time"],
      cards: [["also", 0], ["in addition", 0], ["however", 1], ["on the other hand", 1], ["as a result", 2], ["because", 2], ["meanwhile", 3], ["finally", 3]],
      hint: "Ask: does it add, turn, explain, or move time on?",
      why: "Also and in addition add. However and on the other hand turn. Because and as a result explain. Meanwhile and finally move time.",
      ez: { q: "Sort the link words by job.", hint: "More, different, or why?", why: "And and also add. But turns. Because says why." },
      lv: { mild: { buckets: ["Add", "Contrast", "Reason"],
          cards: [["and", 0], ["also", 0], ["but", 1], ["because", 2]],
          hint: "Add means more. Contrast means a difference. Reason means why.",
          why: "And and also add. But shows a difference. Because gives the reason." },
        spicy: { buckets: ["Add", "Contrast", "Cause and result", "Time", "Compare"],
          cards: [["furthermore", 0], ["moreover", 0], ["nevertheless", 1], ["whereas", 1], ["consequently", 2], ["therefore", 2], ["subsequently", 3], ["meanwhile", 3], ["similarly", 4], ["likewise", 4]],
          why: "The formal words do the same jobs as everyday ones. Whereas contrasts two things inside one sentence." } } },

    { type: "mc", topic: "Picking the right link",
      q: "Which link word fits? \"[[Hero]] was [[feel]] ___ [[reason]].\"",
      options: ["because", "but", "and then"],
      answer: 0,
      slips: { 1: "But shows a surprise. The second part explains the feeling, so it is a reason.", 2: "And then moves time on. The second part is why they felt that way." },
      hint: "Does the second part explain why?",
      why: "The second part explains the feeling: a reason, so <b>because</b>.",
      ez: { hint: "Does part 2 say why?", why: "Part 2 says why. So <b>because</b>.", slips: { 1: "But is a surprise. This says why.", 2: "And then is for next. This says why." } },
      lv: { medium: { q: "Which link phrase fits? \"[[Hero]] had practised every day. ___, [[pr]] [[practice]].\"",
          options: ["For example", "As a result", "Meanwhile"],
          slips: { 1: "As a result shows what happened because of something. This sentence shows one kind of practice.", 2: "Meanwhile means at the same time, somewhere else. This sentence is about the same person's practice." },
          hint: "The second sentence gives one bit of practice.",
          why: "It gives one example of the practice, so <b>For example</b> fits." },
        spicy: { q: "Which link best fits this sentence? \"Old maps are useful, ___ they are not always accurate.\"",
          options: ["although", "therefore", "similarly", "for example"],
          slips: { 1: "Therefore shows a result. Being inaccurate is not caused by being useful.", 2: "Similarly compares alike things. These two ideas pull against each other.", 3: "For example gives an example, but the second idea is a drawback, not an example." },
          hint: "The second idea pulls against the first.",
          why: "Useful versus not always accurate: a contrast inside one sentence, so <b>although</b>." } } },

    { type: "mc", topic: "Picking the right link",
      q: "Which link word fits? \"First, [[hero]] packed [[pos]] [[kit]]. ___ [[pr]] set off for [[place]].\"",
      options: ["Then", "Because", "But"],
      answer: 0,
      slips: { 1: "Because gives a reason. Here the second thing simply happens next.", 2: "But shows a difference. Here one thing just follows another." },
      hint: "What happened after packing?",
      why: "One thing after another: a time link, so <b>Then</b>.",
      ez: { hint: "What came after packing?", why: "One thing, then the next. <b>Then</b>.", slips: { 1: "Because is a reason. This is just next.", 2: "But is a surprise. This is just next." } },
      lv: { medium: { q: "Which link word fits? \"[[Problem]]. ___, [[mw]].\"",
          options: ["Meanwhile", "For example", "Because"],
          slips: { 1: "For example would need an example of the problem. This is something else happening at the same time.", 2: "Because gives a reason. The second sentence is happening at the same time, somewhere else." },
          hint: "Two things happening at the same time, in different places.",
          why: "<b>Meanwhile</b> means at the same time, somewhere else." },
        spicy: { q: "A paragraph listing the dangers of time travel ends. The next paragraph is about what we could learn. Which phrase should open it?",
          options: ["On the other hand,", "Furthermore,", "As a result,", "For example,"],
          slips: { 1: "Furthermore adds another point on the same side. The new paragraph argues the other way.", 2: "As a result would mean the learning is caused by the dangers.", 3: "For example would mean the next paragraph is one of the dangers." },
          hint: "Is the new paragraph on the same side, or the other side?",
          why: "The argument turns to the other side, so <b>On the other hand</b> opens the paragraph and tells the reader so." } } },

    /* ---------- chunk 3: following the links ---------- */
    { type: "learn", topic: "Following the links", title: "Links help you follow a text",
      fig: CHAIN,
      html: "<p>Read this. The link words are in bold. They tell you the order, the surprise and the reason.</p>" + MILD_TEXT,
      ez: { title: "Follow the links", html: "<p>Read this. Link words are in <b>bold</b>.</p>" + MILD_TEXT },
      lv: { medium: { html: "<p>Read this. The link words and phrases are in bold. Some link sentences inside a paragraph; one links the two paragraphs.</p>" + MED_TEXT },
        spicy: { fig: ARTMAP,
          html: "<p>Read this short article. Look at how each paragraph opens: the first words tell you how it connects to the one before.</p>" + ARTICLE } } },

    { type: "multi", topic: "Following the links",
      q: "Pick <b>all</b> the link words from the text.<div class=\"a2task\">" + plain(MILD_TEXT).replace(/<\/?p[^>]*>/g, "") + "</div>",
      options: ["First", "Then", "but", "because", "raining", "packed"],
      answers: [0, 1, 2, 3],
      hint: "Look for the words that join ideas or move time on.",
      why: "<b>First</b>, <b>Then</b>, <b>but</b> and <b>because</b> link the ideas. Raining and packed are not links.",
      ez: { q: "Pick <b>all</b> the link words.<div class=\"a2task\">" + plain(MILD_TEXT).replace(/<\/?p[^>]*>/g, "") + "</div>", hint: "Words that join, or say next.", why: "<b>First</b>, <b>Then</b>, <b>but</b> and <b>because</b>." },
      lv: { medium: { q: "Pick <b>all</b> the link phrases from the text.<div class=\"a2task\">" + plain(MED_TEXT).replace(/<\/?p[^>]*>/g, "") + "</div>",
          options: ["For example", "As a result", "However", "Meanwhile", "planned for weeks", "on the day"],
          answers: [0, 1, 2, 3],
          hint: "Four of them open a sentence and tell you how it connects.",
          why: "<b>For example</b>, <b>As a result</b>, <b>However</b> and <b>Meanwhile</b> link ideas. (In the end does too.) The others are details." },
        spicy: { q: "Which phrases link one <b>paragraph</b> to another in the article?",
          options: ["However", "On the other hand", "Overall", "such as", "rather than", "For this reason"],
          answers: [0, 1, 2],
          hint: "Look only at the first words of paragraphs 2, 3 and 4.",
          why: "<b>However</b>, <b>On the other hand</b> and <b>Overall</b> open paragraphs and connect them. Such as, rather than and for this reason link ideas inside a paragraph." } } },

    { type: "order", topic: "Following the links",
      q: "Use the link words to put these in order.",
      items: ["First, [[hero]] packed [[pos]] [[kit]].", "Next, [[pr]] set off for [[place]].", "After that, [[pr]] arrived and got ready.", "Finally, [[event]] began."],
      hint: "First, next, after that, finally.",
      why: "The link words give the order away: <b>First</b>, <b>Next</b>, <b>After that</b>, <b>Finally</b>.",
      ez: { q: "Put these in order. Use the link words.", why: "First, Next, After that, Finally." },
      lv: { medium: { q: "Use the link words to put the second paragraph in order.",
          items: ["However, on the day, nothing went to plan.", "[[Problem]].", "Meanwhile, [[mw]].", "In the end, [[ending]]."],
          hint: "However turns the story. In the end finishes it.",
          why: "<b>However</b> opens the turn, the problem follows, <b>Meanwhile</b> shows elsewhere, <b>In the end</b> closes it." },
        spicy: { q: "Put the paragraph openings of the article in order, using the links.",
          items: ["Many people dream of visiting the past.", "However, a trip to the past could be risky.", "On the other hand, the past could teach us a great deal.", "Overall, the question is not simple."],
          hint: "Which one has no link because it starts everything? Which one sums up?",
          why: "The opening sets up the dream. <b>However</b> turns to risks. <b>On the other hand</b> turns back. <b>Overall</b> weighs it up." } } },

    { type: "mc", topic: "Following the links", explain: true,
      q: "The text says: \"It was raining, <b>but</b> [[pr]] did not mind.\" What does <b>but</b> tell you?",
      options: ["You might expect rain to be a problem, and it was not", "The rain was the reason for going", "The rain came after [[pr]] arrived"],
      answer: 0,
      slips: { 1: "A reason would need because. But shows a surprise.", 2: "But is not a time word. It shows a difference." },
      hint: "But shows something different from what you would expect.",
      why: "<b>But</b> tells you to expect a surprise: rain, and yet [[pr]] did not mind.",
      ez: { q: "\"It was raining, <b>but</b> [[pr]] did not mind.\" What does <b>but</b> tell you?", hint: "But shows a surprise.", why: "Rain, and yet [[pr]] did not mind. A surprise.",
        slips: { 1: "A reason needs because.", 2: "But is not a time word." } },
      lv: { medium: { q: "The second paragraph starts with <b>However</b>. What does that tell the reader?",
          options: ["Things are about to go differently from the first paragraph", "The second paragraph gives an example", "The second paragraph happens first"],
          slips: { 1: "An example would start with For example. However signals a turn.", 2: "However is not a time word. It signals a contrast." },
          hint: "Paragraph 1 says [[pr]] felt ready. What does paragraph 2 say?",
          why: "Paragraph 1: ready. Paragraph 2: nothing went to plan. <b>However</b> flags the turn before it happens." },
        spicy: { q: "Paragraph 3 opens with <b>On the other hand</b>. How does that link it to paragraph 2?",
          options: ["It turns from the risks to the benefits", "It adds more risks", "It gives an example of a risk", "It says the risks happened first"],
          slips: { 1: "Adding more risks would need furthermore. Paragraph 3 is about learning.", 2: "An example would sit inside paragraph 2, like the insect.", 3: "It is not a time link. It is a contrast." },
          hint: "What is paragraph 2 about? What is paragraph 3 about?",
          why: "Paragraph 2 argues the risks; paragraph 3 argues the benefits. <b>On the other hand</b> signals that turn to the other side." } } },

    /* ---------- chunk 4: words that point back ---------- */
    { type: "learn", topic: "Words that point back", title: "Some words point back",
      fig: POINT,
      html: "<p>Some words link by <b>pointing back</b> to something already said, so the writer does not have to say it twice.</p>" +
        "<p><b>[[Hero]] packed the [[kit]]. It was heavy.</b> <b>It</b> points back to the [[kit]].</p>" +
        "<p>Pointing words: <b>it, he, she, they, this, that, these</b>.</p>",
      lv: { medium: { html: "<p>Some words link by <b>pointing back</b> to something already said.</p>" +
          "<p><b>[[Hero]] packed the [[kit]]. It was heavy.</b> <b>It</b> points back to the [[kit]].</p>" +
          "<p><b>This</b> and <b>these</b> can point back to a whole idea: <b>[[Problem]]. This was a disaster.</b> <b>This</b> means the whole problem.</p>" +
          "<p>Link phrases point back too: <b>As a result</b> always means \"as a result of what I just said\".</p>" },
        spicy: { fig: ARTMAP,
          html: "<p>Across a whole text, writers link in three ways:</p>" +
            "<ul><li><b>Topic sentences</b>: the first sentence of each paragraph says what it is about.</li><li><b>Link phrases</b> between paragraphs: However, On the other hand, Overall.</li><li><b>Referencing</b>: words that point back. \"<b>This dream</b> appears in hundreds of films\" points back to visiting the past.</li></ul>" +
            "<p>Here is the article again.</p>" + ARTICLE } } ,
      ez: { title: "Words that point back", html: "<p>Some words <b>point back</b>.</p><p>[[Hero]] packed the [[kit]]. <b>It</b> was heavy. <b>It</b> means the [[kit]].</p>" } },

    { type: "mc", topic: "Words that point back",
      q: "\"[[Hero]] packed the [[kit]]. It was heavy.\" What does <b>It</b> point back to?",
      options: ["The [[kit]]", "[[Place]]", "The rain"],
      answer: 0,
      slips: { 1: "[[Place]] is not in these two sentences. Look just before It.", 2: "The rain is not in these two sentences. What was packed?" },
      hint: "What was just packed?",
      why: "<b>It</b> points back to the [[kit]]. The writer does not need to say \"the [[kit]]\" twice.",
      ez: { why: "<b>It</b> means the [[kit]].", slips: { 1: "That is not in there. Look just before It.", 2: "No rain here. What was packed?" } },
      lv: { medium: { q: "\"[[Problem]]. This was a disaster.\" What does <b>This</b> point back to?",
          options: ["The whole problem in the first sentence", "Only the last word of the first sentence", "Something in the next paragraph"],
          slips: { 1: "This can point back to a whole idea, not just one word.", 2: "Pointing words point back, not forward." },
          hint: "What was the disaster?",
          why: "<b>This</b> points back to the whole idea: [[problem]]." },
        spicy: { q: "Paragraph 2 ends: \"These effects might never be put right.\" What do <b>These effects</b> point back to?",
          options: ["The huge effects a tiny change in the past could have", "The films and books about time travel", "The old records historians use", "The famous people a traveller might meet"],
          slips: { 1: "Films and books are in paragraph 1. These effects points back within paragraph 2.", 2: "Old records are in paragraph 3, after this sentence. Pointing words look back.", 3: "Meeting people is in paragraph 1, and it is not an effect." },
          hint: "Read the sentence just before it.",
          why: "The sentence before says a tiny change \"could have huge effects years later\". <b>These effects</b> points straight back to them." } } },

    { type: "mc", topic: "Words that point back",
      q: "Jay told the class, \"My ears are not a toilet!\" He meant the music was far too loud. Who does <b>He</b> point back to?",
      fig: '<svg viewBox="0 0 360 160" role="img" aria-label="Jay covering his ears next to a loud speaker">' +
        '<rect width="360" height="160" rx="14" fill="#f4f1ea"/>' + A.jay(110, 62, 0.95, "wow") +
        '<rect x="230" y="40" width="70" height="100" rx="10" fill="#141a33"/><circle cx="265" cy="70" r="14" fill="#5b6180"/><circle cx="265" cy="112" r="20" fill="#5b6180"/>' +
        '<path d="M312 60q14 14 0 28M322 50q22 24 0 48" fill="none" stroke="#e04848" stroke-width="3" stroke-linecap="round"/></svg>',
      options: ["Jay", "The class", "The music"],
      answer: 0,
      slips: { 1: "The class is more than one person, so it would be they, not he.", 2: "The music cannot mean anything. Who was talking?" },
      hint: "Who said it?",
      why: "<b>He</b> points back to Jay, the person who spoke. Outrageous music, apparently.",
      ez: { q: "Jay told the class, \"My ears are not a toilet!\" He meant the music was far too loud. Who is <b>He</b>?", why: "<b>He</b> means Jay. He was talking.",
        slips: { 1: "The class is lots of people. That would be they.", 2: "Music cannot mean things. Who was talking?" } },
      lv: { spicy: { q: "Paragraph 3 says: \"For this reason, some people argue that a careful visit would be worth the risk.\" What reason does <b>For this reason</b> point back to?",
        fig: null,
        options: ["Historians could see what really happened", "A tiny change could have huge effects", "Many people dream of the past", "The question is not simple"],
        slips: { 1: "That is a risk, from paragraph 2. This reason is a reason to go.", 2: "That is from paragraph 1, and it is not a reason to visit.", 3: "That comes after, in paragraph 4. Pointing back means looking earlier." },
        hint: "Read the sentence just before \"For this reason\".",
        why: "The sentence before says historians could see what really happened. That is the reason a visit might be worth it." } } },

    { type: "mc", topic: "Words that point back",
      q: "What job does <b>Then</b> do in: \"First, [[pr]] packed. Then [[pr]] set off.\"?",
      options: ["It tells you what happened next", "It gives a reason", "It shows a surprise"],
      answer: 0,
      slips: { 1: "A reason would need because.", 2: "A surprise would need but." },
      hint: "Then is a time word.",
      why: "<b>Then</b> links the two sentences in time: one thing, then the next.",
      ez: { q: "\"First, [[pr]] packed. Then [[pr]] set off.\" What does <b>Then</b> do?", why: "<b>Then</b> says what is next." },
      lv: { medium: { q: "\"As a result, [[pr]] felt ready.\" As a result of what?",
          options: ["Practising every day", "Nothing going to plan", "[[Problem]]"],
          slips: { 1: "That comes after, in paragraph 2. As a result points back.", 2: "That is in paragraph 2, after this sentence. Look back, not forward." },
          hint: "Look at what came just before it in paragraph 1.",
          why: "<b>As a result</b> points back to the practice. That is how link phrases glue sentences together." },
        spicy: { q: "Which sentence is the <b>topic sentence</b> of paragraph 3?",
          options: ["On the other hand, the past could teach us a great deal.", "Historians could see what really happened, rather than relying on old records.", "For this reason, some people argue that a careful visit would be worth the risk."],
          fixed: true,
          slips: { 1: "That is a supporting detail. It gives one example of what we could learn.", 2: "That is the conclusion of the paragraph, not the topic." },
          hint: "The topic sentence says what the whole paragraph is about, usually first.",
          why: "The first sentence says what the paragraph is about: what the past could teach us. The rest supports it." } } },

    { type: "text", topic: "Words that point back", stretch: true,
      q: "Carry the story on, if you like. Write one more sentence that starts with a link word, after: \"[[Hero]] reached [[place]].\"",
      need: [["then", "next", "after", "but", "however", "because", "so", "also", "later", "meanwhile", "finally", "suddenly", "when", "soon", "at last", "in the end", "first", "and"]],
      model: "Then [[pr]] went inside and got ready.",
      hint: "Start with then, but, so, suddenly, meanwhile, or another link word.",
      why: "Starting with a link word tells the reader how your sentence connects to the last one.",
      ez: { q: "\"[[Hero]] reached [[place]].\" What next? Start with a link word, if you like.", hint: "Try then, but, so or suddenly.", why: "A link word joins it to the last one." },
      lv: { spicy: { q: "Write a topic sentence for a fifth paragraph of the article, starting with a link phrase. It could add another reason for, or against, visiting the past.",
        need: [["furthermore", "moreover", "in addition", "also", "however", "on the other hand", "nevertheless", "similarly", "finally", "another", "as well", "in contrast", "despite", "although"], ["past", "time", "visit", "travel", "histor", "risk", "learn", "trip"]],
        model: "Furthermore, a visit to the past could help us understand our own families.",
        hint: "A link phrase first, then what the new paragraph will be about.",
        why: "A good topic sentence links back (Furthermore, In contrast) and tells the reader what the paragraph will do." } } }
  ],

  realWorld: {
    title: "Link words are everywhere",
    html: "<p>Instructions use <b>first, then, finally</b>. News reports use <b>however</b> and <b>as a result</b>. Commentators use <b>meanwhile</b> all the time. Without links, writing is a pile of separate sentences.</p>" +
      "<p>For our big question, \"If we could time travel, should we?\", a good answer needs <b>however</b> and <b>on the other hand</b> to weigh up both sides. And a travelogue of a journey through time needs <b>then, after that</b> and <b>meanwhile</b> so a reader can follow it.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay by a time portal saying then, meanwhile, however">' + A.portal(80, 75, 56) + A.jay(240, 50, 0.85, "smile") +
      A.bubble(290, 6, 124, 52, "Then...\nmeanwhile...", 294) +
      A.egg(A.bonnie(380, 112, 0.5, "sit"), "Bonnie's favourite link word: because. Because snacks.") + '</svg>'
  },

  ez: {
    realWorld: { html: "<p>Instructions say <b>first, then, finally</b>.</p><p>A time travel story needs <b>then</b> and <b>meanwhile</b> too.</p>" },
    make: { intro: "2 ideas, and a link word to join them." }
  },

  make: {
    title: "Build a link bridge",
    intro: "Two ideas and the link word that joins them. Keep it, stick it on the wall, or send it to Jay.",
    fields: [
      { id: "a", label: "First idea", ph: "[[Hero]] was tired", max: 44 },
      { id: "link", label: "Link word", ph: "but", max: 18 },
      { id: "b", label: "Second idea", ph: "[[Pr]] kept going", max: 44 },
      { id: "name", label: "Bridge builder", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      var a = wrap(v.a, 16, 3), b = wrap(v.b, 16, 3);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380">' +
        '<rect width="600" height="380" rx="24" fill="#bfe6f7"/>' +
        T(300, 46, "LINK BRIDGE", 26, { b: 1, a: "middle", c: "#1f6f9a" }) +
        '<path d="M0 330q40 -14 80 0t80 0t80 0t80 0t80 0t80 0t80 0t80 0" fill="none" stroke="#ffffff" stroke-width="4" stroke-opacity=".7"/>' +
        '<path d="M14 300q16 -90 136 -96q120 6 136 96z" fill="#7cc576" stroke="#141a33" stroke-width="3"/>' +
        '<path d="M314 300q16 -90 136 -96q120 6 136 96z" fill="#7cc576" stroke="#141a33" stroke-width="3"/>' +
        '<rect x="24" y="72" width="240" height="116" rx="14" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
        '<rect x="336" y="72" width="240" height="116" rx="14" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
        a.map(function(l, k){ return T(144, 108 + k * 30, esc(l), 20, { b: 1, a: "middle", fit: 220 }); }).join("") +
        b.map(function(l, k){ return T(456, 108 + k * 30, esc(l), 20, { b: 1, a: "middle", fit: 220 }); }).join("") +
        '<path d="M250 262q50 -40 100 0" fill="none" stroke="#7a5532" stroke-width="12"/>' +
        '<path d="M262 252v26M286 240v28M314 240v28M338 252v26" stroke="#7a5532" stroke-width="5"/>' +
        '<rect x="226" y="196" width="148" height="44" rx="22" fill="#ffd23f" stroke="#141a33" stroke-width="3"/>' +
        T(300, 226, esc(v.link), 22, { b: 1, a: "middle", fit: 132 }) +
        T(576, 362, "Bridge builder: " + esc(v.name), 15, { a: "end", c: "#1f6f9a", fit: 420 }) +
        '</svg>';
    }
  }
};
})();
