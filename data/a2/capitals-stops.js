/* Base 5 Autumn 2 activity: Capitals and full stops.
   English. Where sentences start and stop, names and I. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';

function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

/* a sentence is a train: capital letter engine at the front, full stop buffer at the back */
function train(words, x0, y, cap){
  var out = "", x = x0;
  words.forEach(function(w, k){
    var wd = Math.max(54, w.length * 13 + 22), first = k === 0;
    out += '<rect x="' + x + '" y="' + y + '" width="' + wd + '" height="44" rx="8" fill="' + (first ? "#ff9f43" : "#fff") + '" stroke="#141a33" stroke-width="2.5"/>' +
      '<circle cx="' + (x + 14) + '" cy="' + (y + 50) + '" r="7" fill="#141a33"/><circle cx="' + (x + wd - 14) + '" cy="' + (y + 50) + '" r="7" fill="#141a33"/>';
    if(first && cap){
      out += '<text x="' + (x + 12) + '" y="' + (y + 30) + '" ' + F + ' font-size="20" font-weight="700" fill="#141a33"><tspan fill="#c0392b" font-size="24">' + w.charAt(0) + '</tspan>' + w.slice(1) + '</text>';
    } else out += '<text x="' + (x + wd / 2) + '" y="' + (y + 30) + '" text-anchor="middle" ' + F + ' font-size="20" fill="#141a33">' + w + '</text>';
    x += wd + 8;
    if(k < words.length - 1) out += '<path d="M' + (x - 8) + ' ' + (y + 22) + 'h8" stroke="#141a33" stroke-width="3"/>';
  });
  out += '<circle cx="' + (x + 12) + '" cy="' + (y + 32) + '" r="12" fill="#1f6fd1" stroke="#141a33" stroke-width="2.5"/>';
  return { svg: out, end: x + 24 };
}

var TRAIN = (function(){
  var t = train(["We", "got", "on", "the", "bus"], 24, 70, true);
  return '<svg viewBox="0 0 520 220" role="img" aria-label="A sentence is like a train. A capital letter at the front, a full stop at the back.">' +
    '<rect x="0" y="0" width="520" height="220" rx="16" fill="#eaf6ee"/>' +
    '<path d="M10 128h500" stroke="#7a5532" stroke-width="4"/>' +
    [30, 70, 110, 150, 190, 230, 270, 310, 350, 390, 430, 470].map(function(x){ return '<path d="M' + x + ' 128v8" stroke="#7a5532" stroke-width="4"/>'; }).join("") +
    t.svg +
    '<text x="24" y="40" ' + F + ' font-size="15" font-weight="700" fill="#c0392b">Capital letter at the front</text>' +
    '<path d="M60 46v18" stroke="#c0392b" stroke-width="2.5"/>' +
    '<text x="' + (t.end - 4) + '" y="176" text-anchor="end" ' + F + ' font-size="15" font-weight="700" fill="#1f6fd1">Full stop at the back</text>' +
    '<path d="M' + (t.end - 12) + ' 160v-20" stroke="#1f6fd1" stroke-width="2.5"/>' +
    A.egg(A.bird(200, 60, 0.55, "#ffd23f"), "A bird riding on the roof. Jay says it bought a ticket.") +
    '<text x="260" y="206" text-anchor="middle" ' + F + ' font-size="14" fill="#5b6180">one complete idea = one train</text>' +
    '</svg>';
})();

var TWO = (function(){
  var a = train(["We", "got", "on", "the", "bus"], 14, 40, true), b = train(["It", "was", "full"], 14, 140, true);
  return '<svg viewBox="0 0 520 230" role="img" aria-label="Two ideas make two sentences: We got on the bus. It was full.">' +
    '<rect x="0" y="0" width="520" height="230" rx="16" fill="#f4f1ea"/>' +
    a.svg + b.svg +
    '<path d="M' + (a.end + 30) + ' 70q40 10 0 90" fill="none" stroke="#141a33" stroke-width="2.5" stroke-dasharray="6 5"/>' +
    '<text x="' + (a.end + 4) + '" y="124" ' + F + ' font-size="14" font-weight="700" fill="#141a33">new idea,</text>' +
    '<text x="' + (a.end + 4) + '" y="142" ' + F + ' font-size="14" font-weight="700" fill="#141a33">new train</text>' +
    '</svg>';
})();

/* names and I: four kinds of word that always get a capital */
var NAMES =
  '<svg viewBox="0 0 520 230" role="img" aria-label="Names of people and pets, places, days and months, and the word I always get a capital letter">' +
  '<rect x="0" y="0" width="520" height="230" rx="16" fill="#fff7e6"/>' +
  /* name badge */
  '<g transform="translate(70 92)">' + A.bonnie(0, -6, 0.8, "sit") + '<rect x="-46" y="38" width="92" height="30" rx="8" fill="#fff" stroke="#141a33" stroke-width="2.5"/><text y="59" text-anchor="middle" ' + F + ' font-size="16" font-weight="700" fill="#141a33"><tspan fill="#c0392b">B</tspan>onnie</text></g>' +
  /* signpost */
  '<g transform="translate(196 60)"><path d="M0 0v110" stroke="#7a5532" stroke-width="6"/><path d="M-46 8h80l14 16 -14 16h-80z" fill="#19c39a" stroke="#141a33" stroke-width="2.5"/><text x="-6" y="30" text-anchor="middle" ' + F + ' font-size="15" font-weight="700" fill="#141a33"><tspan fill="#c0392b">L</tspan>ondon</text></g>' +
  /* calendar */
  '<g transform="translate(320 52)"><rect x="-46" y="0" width="92" height="96" rx="8" fill="#fff" stroke="#141a33" stroke-width="2.5"/><rect x="-46" y="0" width="92" height="28" rx="8" fill="#22b8e6" stroke="#141a33" stroke-width="2.5"/><text y="20" text-anchor="middle" ' + F + ' font-size="14" font-weight="700" fill="#141a33"><tspan fill="#c0392b">M</tspan>ay</text><text y="62" text-anchor="middle" ' + F + ' font-size="14" fill="#141a33"><tspan fill="#c0392b">M</tspan>onday</text><text y="84" text-anchor="middle" ' + F + ' font-size="22" font-weight="700" fill="#141a33">4</text></g>' +
  /* I */
  '<g transform="translate(446 100)"><circle r="46" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/><text y="20" text-anchor="middle" ' + F + ' font-size="56" font-weight="700" fill="#c0392b">I</text></g>' +
  ['People and pets', 'Places', 'Days, months', 'The word I'].map(function(t, k){ return '<text x="' + [70, 196, 320, 446][k] + '" y="208" text-anchor="middle" ' + F + ' font-size="14" font-weight="700" fill="#141a33">' + t + '</text>'; }).join("") +
  '</svg>';

/* the proofreading routine */
var PROOF =
  '<svg viewBox="0 0 520 220" role="img" aria-label="Three checks: find the end of each idea, check each start, hunt for names and I">' +
  '<rect x="0" y="0" width="520" height="220" rx="16" fill="#e8f7ff"/>' +
  '<rect x="40" y="18" width="330" height="186" rx="10" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
  [["1", "Find where each idea ends", "#1f6fd1"], ["2", "Check each sentence start", "#c0392b"], ["3", "Hunt for names and I", "#1f9d63"]].map(function(c, k){
    var y = 62 + k * 52;
    return '<rect x="58" y="' + (y - 22) + '" width="30" height="30" rx="6" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
      '<path d="M63 ' + (y - 8) + 'l7 8 14 -18" fill="none" stroke="' + c[2] + '" stroke-width="4" stroke-linecap="round"/>' +
      '<text x="102" y="' + y + '" ' + F + ' font-size="16" fill="#141a33">' + c[1] + '</text>';
  }).join("") +
  '<g transform="translate(440 104)"><circle r="36" fill="#cfe9f7" fill-opacity=".7" stroke="#141a33" stroke-width="6"/><path d="M26 26l26 26" stroke="#141a33" stroke-width="10" stroke-linecap="round"/></g>' +
  A.egg(A.bird(470, 30, 0.6, "#ff5d5d"), "A proofreading bird. It checks every full stop by pecking it.") +
  '</svg>';

/* the fix it widget: tap words to give them a capital, or to add a full stop after them */
function fixer(texts, intro){
  return function(el, api){
    var d = api.data, lv = api.level || "medium";
    var right = api.tok(texts[lv] || texts.medium);
    var toks = right.split(/\s+/).map(function(w){
      var stop = /\.$/.test(w), core = stop ? w.slice(0, -1) : w;
      return { low: core.toLowerCase(), cap: /^[A-Z]/.test(core), stop: stop };
    });
    if(!d.cap || d.n !== toks.length){ d.cap = {}; d.stop = {}; d.n = toks.length; }
    d.mode = d.mode || "cap";
    el.innerHTML = (intro ? '<p class="tiny">' + intro + '</p>' : '') +
      '<div class="cs-modes" style="display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 10px"></div>' +
      '<div class="cs-text" style="font-size:20px;line-height:2.1;padding:12px;border:2px solid #141a33;border-radius:12px;background:#fffdf6"></div>' +
      '<div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:8px"><button type="button" class="btn cs-check">Check it</button><button type="button" class="btn ghost cs-reset">Start again</button></div>' +
      '<p class="cs-msg" style="margin-top:10px"></p>';
    var modes = el.querySelector(".cs-modes"), box = el.querySelector(".cs-text"), msg = el.querySelector(".cs-msg");
    var mb = [["cap", "Tap to add a capital"], ["stop", "Tap to add a full stop after"]].map(function(m){
      var b = document.createElement("button");
      b.type = "button"; b.textContent = m[1];
      b.style.cssText = "font:inherit;font-weight:700;padding:8px 12px;border-radius:10px;border:2px solid #141a33;cursor:pointer";
      b.onclick = function(){ d.mode = m[0]; api.save(); paint(); };
      modes.appendChild(b);
      return b;
    });
    var marked = false;
    var wb = toks.map(function(t, k){
      var b = document.createElement("button");
      b.type = "button";
      b.style.cssText = "font:inherit;padding:0 4px;margin:0 2px;border-radius:6px;border:2px solid transparent;background:transparent;color:#141a33;cursor:pointer";
      b.onclick = function(){ if(d.mode === "cap") d.cap[k] = !d.cap[k]; else d.stop[k] = !d.stop[k]; marked = false; api.save(); paint(); };
      box.appendChild(b); box.appendChild(document.createTextNode(" "));
      return b;
    });
    function shown(t, k){
      var w = d.cap[k] ? t.low.charAt(0).toUpperCase() + t.low.slice(1) : t.low;
      var c = d.cap[k] ? '<span style="color:#1f6fd1;font-weight:700">' + esc(w.charAt(0)) + '</span>' + esc(w.slice(1)) : esc(w);
      return c + (d.stop[k] ? '<b style="color:#1f6fd1;font-size:1.3em">.</b>' : '');
    }
    function paint(){
      mb.forEach(function(b, k){ var on = (k === 0) === (d.mode === "cap"); b.style.background = on ? "#ffd23f" : "#fff"; b.setAttribute("aria-pressed", on ? "true" : "false"); });
      wb.forEach(function(b, k){
        var t = toks[k], ok = !!d.cap[k] === t.cap && !!d.stop[k] === t.stop;
        b.innerHTML = shown(t, k);
        b.style.borderColor = marked && !ok ? "#e08a00" : "transparent";
        b.style.borderStyle = marked && !ok ? "dashed" : "solid";
        b.style.background = marked && !ok ? "#fff1d6" : "transparent";
      });
    }
    function check(){
      var need = 0, got = 0;
      toks.forEach(function(t, k){
        if(t.cap){ need++; if(d.cap[k]) got++; }
        if(t.stop){ need++; if(d.stop[k]) got++; }
      });
      var extra = toks.filter(function(t, k){ return (d.cap[k] && !t.cap) || (d.stop[k] && !t.stop); }).length;
      marked = true; paint();
      if(got === need && !extra) msg.textContent = "Every capital and every full stop in place. Lovely proofreading.";
      else msg.textContent = "You have " + got + " of the " + need + " fixes so far." + (extra ? " One or two extras crept in as well." : "") + " Words with an orange dashed edge could use another look, if you fancy it.";
      d.checked = true; api.save();
      api.done("done");
    }
    el.querySelector(".cs-check").onclick = check;
    el.querySelector(".cs-reset").onclick = function(){ d.cap = {}; d.stop = {}; marked = false; msg.textContent = ""; api.save(); paint(); };
    paint();
    if(d.checked) check();
  };
}

var MISSING = ["A capital letter at the start", "A full stop at the end", "Both of these", "Nothing, it is all there"];

(window.A2PACKS = window.A2PACKS || {})["capitals-stops"] = {
  a2: true,
  id: "a2-capitals-stops",
  title: "Capitals and full stops",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "Every sentence is a little train: a capital letter at the front, a full stop at the back.",
  blurb: "Where sentences start and stop, plus names and the word I. Four short chunks, some tap to fix texts, and a postcard to make at the end.",
  note: "Capitals and full stops: where sentences start and stop, plus names and I. Four five minute chunks and a postcard to make at the end. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Local", line: "Local: short sentences, one or two at a time." },
    { id: "medium", name: "Express", line: "Express: longer runs of writing where you decide where each sentence stops." },
    { id: "spicy", name: "Bullet train", line: "Bullet train: tricky ones, like commas pretending to be full stops and names that hide." }
  ],
  themes: {
    time: { name: "Time travel", w: { name: "ada", place: "london", thing: "time machine", spot: "the clock tower" } },
    football: { name: "Football", w: { name: "kai", place: "manchester", thing: "match ball", spot: "the stadium" } },
    horror: { name: "Horror", w: { name: "mara", place: "whitby", thing: "torch", spot: "the old hospital" } },
    fishing: { name: "Fishing", w: { name: "finn", place: "windermere", thing: "rod", spot: "the boat house" } },
    music: { name: "Music", w: { name: "rosa", place: "edinburgh", thing: "microphone", spot: "the theatre" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: TRAIN,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Start and finish", title: "A sentence is a little train",
      fig: TRAIN,
      html: "<p>Every sentence starts with a <b>capital letter</b>, like the engine at the front of a train. It ends with a <b>full stop</b>, like the buffer at the back.</p>" +
        "<p class=\"a2task\">we got on the bus &#8594; <b><span style=\"color:#c0392b\">W</span>e got on the bus<span style=\"color:#1f6fd1\">.</span></b></p>",
      ez: { title: "A sentence is a train", html: "<p><b>Capital letter</b> at the front. <b>Full stop</b> at the back.</p>" +
        "<p class=\"a2task\">we got on the bus &#8594; <b><span style=\"color:#c0392b\">W</span>e got on the bus<span style=\"color:#1f6fd1\">.</span></b></p>" },
      lv: { medium: { html: "<p>Every sentence starts with a <b>capital letter</b>, like the engine at the front of a train, and ends with a <b>full stop</b>, like the buffer at the back.</p>" +
              "<p>A question ends with a question mark, and a shout ends with an exclamation mark, but they still start with a capital.</p>" +
              "<p class=\"a2task\">we got on the bus &#8594; <b><span style=\"color:#c0392b\">W</span>e got on the bus<span style=\"color:#1f6fd1\">.</span></b></p>" },
            spicy: { html: "<p>A sentence is one complete idea: <b>who or what</b>, and <b>what happened</b>. It starts with a capital letter and ends with a full stop (or a question mark or exclamation mark).</p>" +
              "<p>The skill is being <b>consistent</b>: every sentence, every time, all the way through a piece. One missing full stop and two trains crash into each other.</p>" +
              "<p class=\"a2task\">we got on the bus &#8594; <b><span style=\"color:#c0392b\">W</span>e got on the bus<span style=\"color:#1f6fd1\">.</span></b></p>" } } },

    { type: "mc", topic: "Start and finish",
      q: "What is missing from this sentence?<p class=\"a2task\">the [[thing]] is ready</p>",
      options: MISSING, answer: 2, fixed: true,
      slips: { 0: "Yes, it needs a capital. Look at the very end too: is there a full stop?", 1: "Yes, it needs a full stop. Look at the very first letter too.", 3: "Check the first letter, then check the very end." },
      hint: "Check the front of the train, then the back.",
      why: "It needs both: <b>The [[thing]] is ready.</b>",
      ez: { slips: { 0: "Yes, a capital. Now check the end.", 1: "Yes, a full stop. Now check the start.", 3: "Check the first letter. Then the end." }, hint: "Check the front, then the back." },
      lv: { spicy: { q: "What is missing from the <b>second</b> sentence?<p class=\"a2task\">We set off at dawn. the [[thing]] was humming</p>",
        why: "The second sentence needs both: <b>The [[thing]] was humming.</b> Being consistent means every sentence gets the same care." } } },

    { type: "mc", topic: "Start and finish",
      q: "Which word needs a capital letter?<p class=\"a2task\">my bag is by the door.</p>",
      options: ["my", "bag", "door"], answer: 0,
      slips: { 1: "Bag is an ordinary word in the middle of the sentence.", 2: "Door is an ordinary word at the end." },
      hint: "Which word is at the front of the train?",
      why: "<b>My</b> starts the sentence, so it gets the capital.",
      ez: { slips: { 1: "Bag is in the middle.", 2: "Door is at the end." }, hint: "Which word is at the front?" },
      lv: { spicy: { q: "Which word needs a capital letter?<p class=\"a2task\">The [[thing]] was ready. we set off before dawn.</p>",
        options: ["we", "dawn", "ready", "set"],
        slips: { 1: "Dawn is a time of day, not a name, so it stays small.", 2: "Ready ends the first sentence. It is the word after the full stop that needs the capital.", 3: "Set is in the middle of the sentence." },
        hint: "Find the full stop. What comes straight after it?",
        why: "After a full stop, a new sentence starts, so <b>We</b> needs a capital." } } },

    { type: "num", topic: "Start and finish",
      q: "How many full stops does this need?<p class=\"a2task\">the bus was late we waited in the rain</p>",
      boxes: [{ label: "Full stops", a: 2 }],
      slips: [[1, "There are two ideas: the bus being late, and the waiting. Each one needs its own full stop."], [3, "Count the ideas: the bus was late, then we waited. That is two."]],
      hint: "Count the ideas. Each complete idea gets its own full stop.",
      why: "Two ideas, two full stops: <b>The bus was late. We waited in the rain.</b>",
      ez: { slips: [[1, "There are 2 ideas. Each needs a full stop."], [3, "Count the ideas. There are 2."]], hint: "Count the ideas.",
        why: "2 ideas, 2 full stops: <b>The bus was late. We waited in the rain.</b>" },
      lv: { medium: { q: "How many full stops does this need?<p class=\"a2task\">the bus was late we waited in the rain [[name]] brought snacks</p>",
              boxes: [{ label: "Full stops", a: 3 }],
              slips: [[2, "Three ideas: the bus, the waiting and the snacks."], [4, "Count the ideas again: who did what? There are three."]],
              why: "<b>The bus was late. We waited in the rain. [[Name]] brought snacks.</b> Three ideas, three full stops." },
            spicy: { q: "How many full stops does this need?<p class=\"a2task\">the bus was late, so we waited in the rain [[name]] turned up with snacks and a flask it was the best part of the day</p>",
              boxes: [{ label: "Full stops", a: 3 }],
              slips: [[4, "The comma and \"so\" already join the first two ideas into one sentence."], [2, "Look after \"flask\": a new idea starts there."]],
              why: "<b>The bus was late, so we waited in the rain. [[Name]] turned up with snacks and a flask. It was the best part of the day.</b> \"So\" glues the first two ideas into one sentence." } } },

    { type: "mc", topic: "Start and finish", explain: true,
      q: "What is missing from this sentence?<p class=\"a2task\">[[Name]] packed the [[thing]]</p>",
      options: MISSING, answer: 1, fixed: true,
      slips: { 0: "[[Name]] already has its capital. Look at the end.", 2: "The front is fine: [[Name]] has a capital. Just one thing is missing.", 3: "Look at the very end of the train." },
      hint: "The front looks fine. What about the back?",
      why: "It needs a full stop: <b>[[Name]] packed the [[thing]].</b>",
      ez: { slips: { 0: "[[Name]] has a capital. Look at the end.", 2: "The front is fine. Just 1 thing is missing.", 3: "Look at the very end." }, hint: "The front is fine. The back?" },
      lv: { spicy: { q: "What is missing from this sentence?<p class=\"a2task\">on monday, [[Name]] met us at [[spot]].</p>",
        options: ["Capitals on \"on\" and \"monday\"", "Just a full stop", "A capital on [[spot]]", "Nothing, it is all there"], answer: 0,
        slips: { 1: "There is already a full stop at the end. Look at the start.", 2: "[[Spot]] is a general place, not a name, so it stays small.", 3: "Look at the first word, and at the day." },
        hint: "Check the first word. Then check any days of the week.",
        why: "<b>On Monday, [[Name]] met us at [[spot]].</b> The first word needs a capital, and so do days of the week." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Where does it stop?", title: "New idea, new sentence",
      fig: TWO,
      html: "<p>A sentence is one complete idea. When a <b>new idea</b> starts, finish the old one with a full stop, then start the new one with a capital.</p>" +
        "<p class=\"a2task\">we got on the bus it was full<br>&#8594; <b>We got on the bus. It was full.</b></p>",
      ez: { html: "<p><b>New idea</b>? Full stop, then a capital.</p>" +
        "<p class=\"a2task\">we got on the bus it was full<br>&#8594; <b>We got on the bus. It was full.</b></p>" },
      lv: { spicy: { html: "<p>A sentence is one complete idea. When a <b>new idea</b> starts, end the old one and start the new one with a capital.</p>" +
        "<p>Watch out for the <b>comma pretending to be a full stop</b>: \"We got on the bus, it was full.\" A comma is not strong enough to hold two sentences apart.</p>" +
        "<p>Fix it with a full stop, or glue the ideas with a joining word like <b>and, so, because, but</b>: \"We got on the bus, but it was full.\"</p>" } } },

    { type: "mc", topic: "Where does it stop?",
      q: "Where should the full stop go?<p class=\"a2task\">we got to [[place]] it was raining</p>",
      options: ["After \"[[Place]]\"", "After \"got\"", "After \"it\""], answer: 0,
      slips: { 1: "\"We got\" is not a complete idea yet. Got where?", 2: "\"It\" belongs to the second idea: it was raining." },
      hint: "Read it out loud in your head. Where does the first idea finish?",
      why: "<b>We got to [[Place]]. It was raining.</b> Two ideas, so two sentences.",
      ez: { slips: { 1: "We got where? It is not finished yet.", 2: "It goes with the second idea." }, hint: "Where does the first idea end?" },
      lv: { spicy: { q: "Where should a full stop go?<p class=\"a2task\">we got to [[place]] late, the hotel was shut so we slept in the car</p>",
        options: ["After \"late\", in place of the comma", "After \"shut\"", "After \"hotel\"", "Nowhere, the comma does the job"],
        slips: { 1: "\"So\" already joins the hotel being shut to sleeping in the car.", 2: "\"The hotel\" on its own is not a complete idea.", 3: "This is the comma pretending to be a full stop. It cannot hold two sentences apart." },
        hint: "Find the comma. Is there a complete idea on both sides of it?",
        why: "<b>We got to [[Place]] late. The hotel was shut so we slept in the car.</b> The comma was doing a full stop's job." } } },

    { type: "num", topic: "Where does it stop?",
      q: "How many sentences are hiding in here?<p class=\"a2task\">it was dark we went home</p>",
      boxes: [{ label: "Sentences", a: 2 }],
      slips: [[1, "There are two ideas: it was dark, and we went home."], [3, "Count the ideas again: who or what, and what happened."]],
      hint: "Count the complete ideas.",
      why: "<b>It was dark. We went home.</b> Two sentences.",
      ez: { slips: [[1, "2 ideas: it was dark, and we went home."], [3, "Count the ideas again."]] },
      lv: { medium: { q: "How many sentences are hiding in here?<p class=\"a2task\">it was dark [[name]] switched on the [[thing]] we heard a noise nobody moved</p>",
              boxes: [{ label: "Sentences", a: 4 }],
              slips: [[3, "Look near the end: \"we heard a noise\" and \"nobody moved\" are two ideas."], [5, "Check each idea has someone or something doing something. There are four."]],
              why: "<b>It was dark. [[Name]] switched on the [[thing]]. We heard a noise. Nobody moved.</b> Four." },
            spicy: { q: "How many sentences are hiding in here?<p class=\"a2task\">it was dark, so [[name]] switched on the [[thing]] we heard a noise, nobody moved for a whole minute then the lights came back on</p>",
              boxes: [{ label: "Sentences", a: 4 }],
              slips: [[3, "Look at \"we heard a noise, nobody moved\": a comma cannot hold two sentences apart."], [5, "\"So\" joins the first two ideas into one sentence."]],
              why: "<b>It was dark, so [[Name]] switched on the [[thing]]. We heard a noise. Nobody moved for a whole minute. Then the lights came back on.</b> Four." } } },

    { type: "widget", topic: "Where does it stop?", unscored: true,
      title: "Fix it: where does it stop?",
      html: "<p>Pick a mode, then tap words. Add the full stops where each idea ends, and the capitals where each new one starts. Check whenever you like.</p>",
      ez: { html: "<p>Pick a mode. Tap words to add full stops and capitals.</p>" },
      mount: fixer({
        mild: "We got on the bus. It was full.",
        medium: "We got to the station at noon. It was raining. We ran to the cafe and waited.",
        spicy: "The train was late, so we waited on the platform. It was freezing. Then the doors opened and everyone rushed on."
      }) },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Names and I", title: "Names always get a capital",
      fig: NAMES,
      html: "<p>Some words get a capital letter <b>wherever they are</b> in a sentence:</p>" +
        "<p>names of <b>people and pets</b> (Bonnie, [[Name]]), <b>places</b> ([[Place]]), <b>days and months</b> (Monday, May), and the word <b>I</b> on its own.</p>" +
        "<p class=\"a2task\">On Friday, Bonnie and I went to [[Place]].</p>",
      ez: { title: "Names get a capital", html: "<p><b>Names</b> always get a capital. People, pets, places, days, months and <b>I</b>.</p>" +
        "<p class=\"a2task\">On Friday, Bonnie and I went to [[Place]].</p>" },
      lv: { spicy: { html: "<p>Names get a capital letter <b>wherever they are</b>: people and pets (Bonnie, [[Name]]), places ([[Place]]), days and months, and the word I.</p>" +
        "<p>The tricky part is spotting when a word is a <b>name</b> and when it is just an ordinary word:</p>" +
        "<p class=\"a2task\">the River Thames, but a river<br>North Wales, but north of here<br>July, but summer<br>Mum, but my mum</p>" +
        "<p>If it names <b>one particular</b> person, place or time, it gets a capital.</p>" } } },

    { type: "multi", topic: "Names and I",
      q: "Pick every word that needs a capital letter. (The first word is done for you.)<p class=\"a2task\">We took bonnie to the park on monday.</p>",
      options: ["bonnie", "park", "monday", "took"], answers: [0, 2],
      hint: "Look for a name and a day.",
      why: "<b>Bonnie</b> is a name and <b>Monday</b> is a day. Park and took are ordinary words.",
      ez: { q: "Which words need a capital? Pick them all.<p class=\"a2task\">We took bonnie to the park on monday.</p>",
        why: "<b>Bonnie</b> is a name. <b>Monday</b> is a day." },
      lv: { medium: { q: "Pick every word that needs a capital letter. (The first word is done for you.)<p class=\"a2task\">Last friday, bonnie and i went to [[place]] with [[name]].</p>",
              options: ["friday", "bonnie", "i", " [[place]]", " [[name]]", "went"], answers: [0, 1, 2, 3, 4],
              why: "<b>Last Friday, Bonnie and I went to [[Place]] with [[Name]].</b> A day, two names, I and a place." },
            spicy: { q: "Pick every word that needs a capital letter. (The first word is done for you.)<p class=\"a2task\">Last july, my mum and i drove north to visit [[name]] in [[place]] for the summer.</p>",
              options: ["july", "mum", "i", "north", " [[name]]", " [[place]]", "summer"], answers: [0, 2, 4, 5],
              hint: "Ask of each word: does it name one particular person, place or time?",
              why: "<b>July</b>, <b>I</b>, <b>[[Name]]</b> and <b>[[Place]]</b>. \"My mum\", \"north\" and \"summer\" are ordinary words here." } } },

    { type: "sort", topic: "Names and I",
      q: "Sort the words. Capital letter, or not?",
      buckets: ["Always a capital", "Small, unless it starts a sentence"],
      cards: [["bonnie", 0], ["poodle", 1], [" [[place]]", 0], ["town", 1], ["tuesday", 0], ["dog", 1]],
      hint: "Is it the name of one particular dog, place or day?",
      why: "Bonnie, [[Place]] and Tuesday are names. Poodle, town and dog are ordinary words.",
      ez: { hint: "Is it the name of 1 dog, place or day?", why: "Bonnie, [[Place]] and Tuesday are names." },
      lv: { medium: { cards: [["bonnie", 0], ["poodle", 1], [" [[place]]", 0], ["town", 1], ["december", 0], ["winter", 1], ["i", 0], ["me", 1]],
              why: "Bonnie, [[Place]], December and I always get capitals. Seasons like winter do not." },
            spicy: { cards: [["the river thames", 0], ["a wide river", 1], ["north wales", 0], ["north of here", 1], ["july", 0], ["the summer", 1], ["the great wall", 0], ["a tall wall", 1]],
              why: "If it names one particular river, place, month or landmark, it gets capitals: the River Thames, North Wales, July, the Great Wall." } } },

    { type: "mc", topic: "Names and I", explain: true,
      q: "Which word in this sentence still needs a capital?<p class=\"a2task\">Bonnie and I saw [[name]] in [[Place]] on Saturday.</p>",
      options: [" [[name]]", "saw", "in"], answer: 0,
      slips: { 1: "Saw is an ordinary doing word.", 2: "In is a small ordinary word." },
      hint: "Look for a name still in small letters.",
      why: "<b>[[Name]]</b> is a person's name, so it always gets a capital.",
      ez: { q: "Which word still needs a capital?<p class=\"a2task\">Bonnie and I saw [[name]] in [[Place]] on Saturday.</p>",
        slips: { 1: "Saw is an ordinary word.", 2: "In is an ordinary word." }, why: "<b>[[Name]]</b> is a name. Names get a capital." },
      lv: { spicy: { q: "Jay says: \"When I was in China, I visited the great wall on a sunny tuesday in may.\" Which words still need capitals?",
        options: ["great, wall, tuesday and may", "great, wall and sunny", "tuesday and may only", "China only"],
        slips: { 1: "Sunny is just a describing word, not a name.", 2: "The Great Wall is the name of one particular place, so both words get capitals.", 3: "China already has its capital. Look further along." },
        hint: "Find the landmark, the day and the month.",
        why: "<b>the Great Wall on a sunny Tuesday in May.</b> A landmark's name, a day and a month. (Outrageous amount of capitals for one trip.)" } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Proofread the travel log", title: "Three checks, in order",
      fig: PROOF,
      html: "<p>When you check your own writing, do it in <b>three sweeps</b>:</p>" +
        "<p>1. Find where each idea ends: full stop.<br>2. Check the start of every sentence: capital.<br>3. Hunt for names, days, places and I: capitals.</p>" +
        "<p>Here comes a travel log with every capital and full stop missing. Have a go at fixing it.</p>",
      ez: { title: "3 checks", html: "<p>1. Full stops. 2. Sentence starts. 3. Names and I.</p><p>Now fix a travel log!</p>" } },

    { type: "widget", topic: "Proofread the travel log", unscored: true,
      title: "Fix the travel log",
      html: "<p>Every capital and full stop has fallen out. Tap to put them back, then check it.</p>",
      ez: { html: "<p>Tap to put the capitals and full stops back.</p>" },
      mount: fixer({
        mild: "We went to [[Place]] on Friday. I saw Bonnie.",
        medium: "On Monday, [[Name]] and I went to [[Place]]. The [[thing]] broke. We fixed it by lunch.",
        spicy: "Last July, [[Name]] and I set off for [[Place]]. The [[thing]] broke near Leeds on a Sunday, so we stopped. I phoned Jay. He said it was outrageous."
      }, "Tip: do the full stops first, then the capitals.") },

    { type: "mc", topic: "Proofread the travel log",
      q: "Why does <b>[[Place]]</b> need a capital letter in the travel log?",
      options: ["It is the name of a place.", "It starts a sentence.", "It is an important word."], answer: 0,
      slips: { 1: "Look again: it is in the middle of the sentence.", 2: "Important words do not get capitals just for being important. Names do." },
      hint: "Where is it in the sentence, and what kind of word is it?",
      why: "[[Place]] is the name of one particular place, so it always gets a capital.",
      ez: { q: "Why does <b>[[Place]]</b> need a capital?", slips: { 1: "It is in the middle of the sentence.", 2: "Names get capitals. Not important words." },
        hint: "What kind of word is it?", why: "[[Place]] is the name of a place." },
      lv: { spicy: { q: "Why does <b>Leeds</b> get a capital in the travel log, but <b>the station</b> would not?",
        options: ["Leeds names one particular place; a station could be any station.", "Leeds is a bigger word.", "Leeds comes later in the sentence.", "Places never get capitals."],
        slips: { 1: "Length has nothing to do with it.", 2: "Where it sits in the sentence does not matter for names.", 3: "Named places always do." },
        hint: "Is it the name of one particular place?",
        why: "Names of particular places get capitals. If it were \"Leeds Station\", that would be a name too." } } },

    { type: "num", topic: "Proofread the travel log",
      q: "How many capital letters does this need?<p class=\"a2task\">on monday i saw bonnie.</p>",
      boxes: [{ label: "Capitals", a: 4 }],
      slips: [[3, "Did you count the word I? On its own it is always a capital."], [2, "Count the first word, the day, I, and Bonnie."]],
      hint: "First word, then names, days and I.",
      why: "<b>On Monday I saw Bonnie.</b> Four capitals.",
      ez: { slips: [[3, "Did you count I?"], [2, "Count the first word, the day, I and Bonnie."]] },
      lv: { medium: { q: "How many capital letters does this need?<p class=\"a2task\">on monday, [[name]] and i met bonnie at the station.</p>",
              boxes: [{ label: "Capitals", a: 5 }],
              slips: [[4, "Did you count the word I? On its own it is always a capital."], [6, "The station is any station here, so it stays small."]],
              why: "<b>On Monday, [[Name]] and I met Bonnie at the station.</b> Five." },
            spicy: { q: "How many capital letters does this need?<p class=\"a2task\">in march, [[name]] and i took bonnie to the river thames. she was not impressed.</p>",
              boxes: [{ label: "Capitals", a: 8 }],
              slips: [[7, "The River Thames gets two capitals, and do not forget I."], [6, "After the full stop, a new sentence starts: She."], [9, "March is a month, but \"the\" before River stays small."]],
              hint: "Two sentence starts, a month, a person, I, a pet and a river.",
              why: "<b>In March, [[Name]] and I took Bonnie to the River Thames. She was not impressed.</b> Eight." } } }
  ],

  ez: {
    realWorld: { html: "<p>Forms, messages and signs all need <b>capitals and full stops</b>.</p><p>A postcard from the past? Full stops show where each adventure ends.</p>" },
    make: { intro: "A postcard from anywhere, any time. 2 sentences. Send it to Jay if you like." }
  },

  realWorld: {
    title: "Where capitals and full stops matter",
    html: "<p>Job applications, forms, a message to a manager, a sign in a shop window: people judge writing in the first second, and capitals and full stops are the first thing they see.</p>" +
      "<p>For our big question, <b>if we could time travel, should we?</b>, picture sending a postcard home from the past. Without full stops, nobody could tell where one adventure ends and the next begins.</p>",
    fig: '<svg viewBox="0 0 420 140" role="img" aria-label="Jay by a time portal with a postcard">' + A.portal(80, 70, 56) + A.jay(250, 50, 0.85, "smile") +
      A.bubble(296, 4, 120, 52, "Postcard\nfrom 1850?", 300) + '</svg>'
  },

  make: {
    title: "Send a postcard",
    intro: "Write a postcard from anywhere, any time: a real trip, or a trip through time. Two sentences, capitals and full stops in place. Keep it, or send it to Jay.",
    fields: [
      { id: "where", label: "Greetings from", ph: "London, 1850", max: 26 },
      { id: "s1", label: "Sentence one", ph: "We arrived on Monday in a horse and cart.", max: 80 },
      { id: "s2", label: "Sentence two", ph: "It was foggy, so I stayed close to Bonnie.", max: 80 },
      { id: "from", label: "From", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      function wrap(t, n, most){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if(!x) return; while(x.length > n){ if(cur.trim()){ out.push(cur.trim()); cur = ""; } out.push(x.slice(0, n)); x = x.slice(n); } if((cur + " " + x).trim().length > n){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, most); }
      var msg = wrap(String(v.s1 || "") + " " + String(v.s2 || ""), 26, 7);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">' +
        '<rect width="640" height="400" rx="18" fill="#fffaf0" stroke="#141a33" stroke-width="3"/>' +
        '<rect x="24" y="24" width="268" height="352" rx="10" fill="#2d2466"/>' +
        '<circle cx="158" cy="170" r="88" fill="#8a5cf6" fill-opacity=".5"/><circle cx="158" cy="170" r="56" fill="#22b8e6" fill-opacity=".5"/><circle cx="158" cy="170" r="24" fill="#ffd23f"/>' +
        '<text x="44" y="60" ' + F + ' font-size="15" fill="#ffd23f" letter-spacing="2">GREETINGS FROM</text>' +
        wrap(v.where, 16, 2).map(function(l, k){ return '<text x="44" y="' + (306 + k * 30) + '" ' + F + ' font-size="26" font-weight="700" fill="#fff">' + esc(l) + '</text>'; }).join("") +
        '<path d="M318 40v320" stroke="#c9c2b0" stroke-width="2"/>' +
        '<rect x="530" y="28" width="82" height="96" rx="4" fill="#fff" stroke="#c0392b" stroke-width="3" stroke-dasharray="6 4"/>' +
        A.bird(571, 80, 0.9, "#3a8fd6") +
        msg.map(function(l, k){ return '<text x="338" y="' + (160 + k * 30) + '" ' + F + ' font-size="18" fill="#141a33">' + esc(l) + '</text>'; }).join("") +
        '<text x="338" y="374" ' + F + ' font-size="16" font-style="italic" fill="#5b6180">From ' + esc(v.from) + '</text>' +
        '</svg>';
    }
  }
};
})();
