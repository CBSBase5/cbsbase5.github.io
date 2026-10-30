/* Base 5 Autumn 2 activity: Proofreading patrol.
   English. Finding and fixing punctuation slips across a short piece:
   capitals, end marks, commas and apostrophes, then a whole piece on
   patrol. ASCII only. */
(function(){
var A = window.A2ART;

function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
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

/* the patrol badge and the four sweeps */
var PATROL =
  '<svg viewBox="0 0 540 220" role="img" aria-label="A proofreading patrol badge and four sweeps: capitals, end marks, commas, apostrophes">' +
  '<rect width="540" height="220" rx="16" fill="#eef1fb"/>' +
  '<g transform="translate(110 110)"><path d="M0 -84l70 26v44q0 62 -70 92q-70 -30 -70 -92v-44z" fill="#2d3e8f" stroke="#141a33" stroke-width="3"/>' +
  '<path d="M0 -70l56 20v36q0 50 -56 76q-56 -26 -56 -76v-36z" fill="#ffd23f"/>' +
  '<circle cx="-6" cy="-6" r="24" fill="#ffffff" stroke="#141a33" stroke-width="5"/><path d="M12 12l22 22" stroke="#141a33" stroke-width="8" stroke-linecap="round"/>' +
  T(-6, 2, "Aa", 18, { b: 1, a: "middle", c: "#e04848" }) +
  T(0, 62, "PATROL", 13, { b: 1, a: "middle" }) + '</g>' +
  [["Capitals", "A  I  London"], ["End marks", ".  ?  !"], ["Commas", "red, blue and green"], ["Apostrophes", "don't   Jay's"]].map(function(r, k){
    var y = 30 + k * 46;
    return '<rect x="226" y="' + y + '" width="294" height="38" rx="10" fill="#ffffff" stroke="#141a33" stroke-opacity=".25" stroke-width="2"/>' +
      '<rect x="238" y="' + (y + 9) + '" width="20" height="20" rx="4" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/><path d="M242 ' + (y + 19) + 'l5 6 9 -12" stroke="#1f9d63" stroke-width="3" fill="none"/>' +
      T(270, y + 25, (k + 1) + ". " + r[0], 15, { b: 1 }) + T(510, y + 25, r[1], 13, { a: "end", c: "#5b6180" });
  }).join("") +
  A.egg(A.bird(40, 30, 0.55, "#19c39a"), "A bird on patrol duty. It has spotted a missing full stop. Jay is very proud.") +
  '</svg>';

/* end marks as road signs */
var ENDS =
  '<svg viewBox="0 0 540 200" role="img" aria-label="Three signs: full stop to stop, question mark to ask, exclamation mark for a strong feeling">' +
  '<rect width="540" height="200" rx="16" fill="#f4f1ea"/>' +
  '<g transform="translate(95 80)"><path d="M-22 -52h44l30 30v44l-30 30h-44l-30 -30v-44z" fill="#e04848" stroke="#141a33" stroke-width="3"/><circle cx="0" cy="12" r="10" fill="#ffffff"/>' + T(0, -18, "STOP", 15, { b: 1, a: "middle", c: "#ffffff" }) + '</g>' +
  '<g transform="translate(270 80)"><circle r="52" fill="#22b8e6" stroke="#141a33" stroke-width="3"/>' + T(0, 22, "?", 64, { b: 1, a: "middle", c: "#ffffff" }) + '</g>' +
  '<g transform="translate(445 80)"><path d="M0 -56l60 104h-120z" fill="#ffd23f" stroke="#141a33" stroke-width="3"/>' + T(0, 36, "!", 60, { b: 1, a: "middle" }) + '</g>' +
  T(95, 176, "full stop: done", 14, { a: "middle" }) + T(270, 176, "question: asking", 14, { a: "middle" }) + T(445, 176, "exclamation: wow", 14, { a: "middle" }) +
  '</svg>';

/* commas in a list, and an apostrophe taking a letter's place */
var COMMAS =
  '<svg viewBox="0 0 540 220" role="img" aria-label="Commas between items in a list, and an apostrophe taking the place of a missing letter">' +
  '<rect width="540" height="220" rx="16" fill="#f4f1ea"/>' +
  T(20, 34, "Commas in a list", 15, { b: 1 }) +
  [["my [[thing]]", 20, 120], ["a drink", 162, 110], ["a coat", 330, 110]].map(function(b){
    return '<rect x="' + b[1] + '" y="48" width="' + b[2] + '" height="40" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' + T(b[1] + b[2] / 2, 74, b[0], 14, { a: "middle", fit: b[2] - 12 });
  }).join("") +
  T(150, 84, ",", 30, { b: 1, a: "middle", c: "#e04848" }) + T(302, 74, "and", 15, { b: 1, a: "middle", c: "#1f6f9a" }) +
  T(20, 128, "Apostrophes for a missing letter", 15, { b: 1 }) +
  T(20, 170, "do not", 22, { b: 1 }) +
  '<path d="M110 162h50" stroke="#141a33" stroke-width="3"/><path d="M166 162l-10 -6v12z" fill="#141a33"/>' +
  T(180, 170, "don", 22, { b: 1 }) + T(229, 170, "'", 30, { b: 1, c: "#e04848" }) + T(240, 170, "t", 22, { b: 1 }) +
  '<circle cx="232" cy="196" r="9" fill="#ffffff" stroke="#e04848" stroke-width="2" stroke-dasharray="3 2"/>' + T(232, 201, "o", 13, { a: "middle", c: "#e04848" }) +
  T(256, 205, "the o goes, the apostrophe takes its place", 13, { c: "#5b6180" }) +
  '<g transform="translate(470 160)">' + A.egg(A.bonnie(0, 0, 0.55, "sit"), "Bonnie's bowl. One poodle, so the apostrophe goes before the s.") + '</g>' +
  '</svg>';

/* the proofreading widget: tap the slips in a piece of writing.
   {wrong=>right} marks a slip; the rest is fine. */
var PIECE = {
  mild: "{on=>On} {saturday=>Saturday} we went to {[[townlc]]=>[[Town]]}. {i=>I} took my [[thing]] and a packed lunch. It was cold but {sunny=>sunny.} {we=>We} had a great day. Do you want to come next {time.=>time?}",
  medium: "On {saturday=>Saturday} we went to [[Town]]. I packed my [[thing]], {sandwiches=>sandwiches,} a drink and a coat. {Its=>It's} a long trip, so we left at seven. My {brothers=>brother's} phone was flat, so he {couldnt=>couldn't} take any photos. {we=>We} got home at nine. Would you like to come next {time.=>time?}",
  spicy: "When we {arrived=>arrived,} the {visitors=>visitors'} car park was full. {Its=>It's} usually quiet in {november=>November}. [[Town]] is famous for {it's=>its} history. We were {tired, we=>tired, but we} still walked to the top of the hill. The {childrens=>children's} museum was free, which was lucky. What a {day.=>day!}"
};
function patrolWidget(el, api){
  var d = api.data || {}, tk = api.tok || function(x){ return x; };
  var src = tk(PIECE[api.level] || PIECE.medium);
  var toks = (src.match(/\{[^}]*\}\S*|\S+/g) || []).map(function(t){
    var m = t.match(/^\{([^}]*)=>([^}]*)\}(\S*)$/);
    return m ? { show: m[1] + m[3], fix: m[2] + m[3], err: true } : { show: t, fix: t, err: false };
  });
  var total = toks.filter(function(t){ return t.err; }).length;
  if(!Array.isArray(d.flags)) d.flags = [];
  el.innerHTML = '<p class="tiny">Tap any word that needs fixing. Tap it again to change your mind. When you are happy, check your patrol.</p>' +
    '<div class="xpiece" style="line-height:2.3;font-size:1.1rem;padding:12px 14px;border:2px solid #d9d8e6;border-radius:14px;background:#fffdf6;color:#141a33"></div>' +
    '<p class="xout" aria-live="polite" style="font-weight:700;margin:10px 0"></p>' +
    '<div class="qnav"><button type="button" class="btn xcheck">Check my patrol</button><button type="button" class="btn btn-quiet xagain">Start again</button></div>';
  var box = el.querySelector(".xpiece"), out = el.querySelector(".xout");
  function draw(){
    box.innerHTML = "";
    toks.forEach(function(t, k){
      var b = document.createElement("button");
      b.type = "button";
      var on = !!d.flags[k], st = "font:inherit;cursor:pointer;margin:0 3px 0 0;padding:1px 5px;border-radius:8px;color:#141a33;";
      if(d.checked){
        if(t.err && on){ b.innerHTML = '<s style="color:#5b6180">' + esc(t.show) + '</s> <b>' + esc(t.fix) + '</b>'; st += "background:#c9f2df;border:2px solid #1f9d63;"; }
        else if(t.err){ b.innerHTML = '<s style="color:#5b6180">' + esc(t.show) + '</s> <b>' + esc(t.fix) + '</b>'; st += "background:#fff1b8;border:2px dashed #b88a00;"; }
        else if(on){ b.textContent = t.show; st += "background:#eef1fb;border:2px dotted #5b6180;"; }
        else { b.textContent = t.show; st += "background:transparent;border:2px solid transparent;"; }
      }else{
        b.textContent = t.show;
        st += on ? "background:#ffe0ea;border:2px solid #d0457a;" : "background:transparent;border:2px solid transparent;";
      }
      b.style.cssText = st;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.onclick = function(){ if(d.checked) return; d.flags[k] = !d.flags[k]; try{ api.save(); }catch(e){} draw(); };
      box.appendChild(b);
    });
    if(d.checked){
      var found = toks.filter(function(t, k){ return t.err && d.flags[k]; }).length;
      var extra = toks.filter(function(t, k){ return !t.err && d.flags[k]; }).length;
      out.textContent = "You spotted " + found + " of " + total + ". Green: spotted and fixed. Yellow: the ones that slipped past, with the fix." +
        (extra ? " Dotted ones were fine as they were." : "") + (found === total ? " A perfect patrol." : "");
    }else{
      var n = d.flags.filter(Boolean).length;
      out.textContent = n ? n + " flagged so far. There are " + total + " slips hiding in here." : "There are " + total + " slips hiding in here. Have a look.";
    }
  }
  el.querySelector(".xcheck").onclick = function(){ d.checked = true; try{ api.save(); }catch(e){} draw(); api.done("done"); };
  el.querySelector(".xagain").onclick = function(){ d.checked = false; d.flags = []; try{ api.save(); }catch(e){} draw(); };
  draw();
}

(window.A2PACKS = window.A2PACKS || {})["proofread"] = {
  a2: true,
  id: "a2-proofread",
  title: "Proofreading patrol",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "Read it slowly, one sweep at a time, and catch the slips before anyone else does.",
  blurb: "Proofreading on patrol: capitals, ends of sentences, commas and apostrophes, then a whole piece to check. Four short chunks, with a before and after card to make at the end.",
  note: "Proofreading patrol: catching punctuation slips in a whole piece of writing. Four five minute chunks and a before and after card. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Cadet", line: "Cadet: capitals, full stops and question marks in short pieces." },
    { id: "medium", name: "Patrol", line: "Patrol: add commas in lists and apostrophes, across a longer piece." },
    { id: "spicy", name: "Inspector", line: "Inspector: tricky ones, like its and it's, the dogs' bowls, and commas after openers." }
  ],
  themes: {
    time: { name: "Time travel", w: { town: "York", townlc: "york", thing: "toolbox", wow: "time machine", who: "the time traveller" } },
    football: { name: "Football", w: { town: "Manchester", townlc: "manchester", thing: "kit bag", wow: "goal", who: "the striker" } },
    horror: { name: "Horror", w: { town: "Whitby", townlc: "whitby", thing: "torch", wow: "spooky night", who: "the night porter" } },
    fishing: { name: "Fishing", w: { town: "Windermere", townlc: "windermere", thing: "rod", wow: "catch", who: "the angler" } },
    music: { name: "Music", w: { town: "London", townlc: "london", thing: "script", wow: "show", who: "the singer" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: PATROL,
  steps: [

    /* ---------- chunk 1: capital letters ---------- */
    { type: "learn", topic: "Capital letters", title: "How to proofread: one sweep at a time",
      fig: PATROL,
      html: "<p>Proofreading means reading your writing slowly to catch slips. The trick: <b>check one thing at a time</b>, like a patrol sweeping an area.</p>" +
        "<p>First sweep: <b>capital letters</b>. You need one:</p>" +
        "<ul><li>at the start of every sentence</li><li>for <b>I</b> on its own</li><li>for names of people and places: Sam, [[Town]]</li><li>for days and months: Monday, June</li></ul>",
      ez: { title: "Proofread: capitals", html: "<p>Check <b>one thing at a time</b>.</p><p>First: <b>capitals</b>. Starts, I, names, days.</p>" },
      lv: { spicy: { html: "<p>Proofreading works best in <b>sweeps</b>: one kind of slip at a time, reading slowly, ideally out loud in your head.</p>" +
          "<p>First sweep: <b>capital letters</b>. Sentence starts, <b>I</b>, and every <b>proper noun</b>: people, places, days, months, languages (French), and titles in front of a name (Aunt Sue, Doctor Khan).</p>" +
          "<p>Watch the traps: <b>my mum</b> has no capital, but <b>Mum</b> does when it is used as her name: \"Can we go, Mum?\" Seasons (summer, winter) have no capital.</p>" } } },

    { type: "multi", topic: "Capital letters",
      q: "Which words need a capital letter?<div class=\"a2task\">on friday i went to the park with sam.</div>",
      options: ["on", "friday", "i", "went", "park", "sam"],
      answers: [0, 1, 2, 5],
      hint: "Sentence start, a day, I on its own, and a name.",
      why: "<b>On</b> starts the sentence, <b>Friday</b> is a day, <b>I</b> is always a capital, and <b>Sam</b> is a name. Park is just a park.",
      ez: { hint: "A start, a day, I, a name.", why: "<b>On</b>, <b>Friday</b>, <b>I</b> and <b>Sam</b>." },
      lv: { medium: { q: "Which words need a capital letter?<div class=\"a2task\">in june my friend priya and i visited the castle in edinburgh.</div>",
          options: ["in", "june", "friend", "priya", "i", "castle", "edinburgh"],
          answers: [0, 1, 3, 4, 6],
          hint: "Sentence start, a month, two names, and I.",
          why: "<b>In</b>, <b>June</b>, <b>Priya</b>, <b>I</b> and <b>Edinburgh</b>. Friend and castle are ordinary words." },
        spicy: { q: "Which words need a capital letter?<div class=\"a2task\">last june, my mum and i met aunt sue at the french market in the summer.</div>",
          options: ["june", "mum", "i", "aunt", "sue", "french", "summer"],
          answers: [0, 2, 3, 4, 5],
          hint: "Two traps: one word comes after \"my\", one is a season.",
          why: "<b>June</b>, <b>I</b>, <b>Aunt Sue</b> (a title and a name) and <b>French</b>. \"my mum\" stays small, and seasons like summer have no capital." } } },

    { type: "mc", topic: "Capital letters",
      q: "Which one has all its capitals right?",
      options: ["A) On Monday I went to [[Town]].", "B) on Monday i went to [[Town]].", "C) On monday I went to [[townlc]]."], fixed: true,
      answer: 0,
      slips: { 1: "Look at the very first word, and at i on its own.", 2: "Days and places are names. They both need capitals." },
      hint: "Check the start, the day, I, and the place.",
      why: "<b>On</b> starts the sentence, <b>Monday</b> is a day, <b>I</b> is always capital, <b>[[Town]]</b> is a place.",
      ez: { q: "Which has all the capitals right?", hint: "Check the start, day, I, place.", why: "On, Monday, I and [[Town]] all need capitals.", slips: { 1: "Look at the first word, and i.", 2: "Days and places need capitals." } },
      lv: { spicy: { options: ["A) In the Summer, Mum and I visited [[Town]].", "B) In the summer, Mum and I visited [[Town]].", "C) In the summer, mum and I visited [[Town]].", "D) In the summer, Mum and i visited [[townlc]]."], fixed: true,
        answer: 1,
        slips: { 0: "Seasons do not take a capital.", 2: "Here Mum is used like her name (no \"my\" in front), so it takes a capital.", 3: "I on its own, and the town, both need capitals." },
        why: "Summer is a season (small). Mum is used as a name (capital). I and [[Town]] take capitals." } } },

    { type: "num", topic: "Capital letters", explain: true,
      q: "Jay wrote on the board: <div class=\"a2task\">bonnie and i went to the park on sunday.</div> How many capital letters are missing?",
      fig: '<svg viewBox="0 0 360 150" role="img" aria-label="Jay next to a whiteboard">' + '<rect width="360" height="150" rx="14" fill="#f4f1ea"/>' +
        '<rect x="150" y="20" width="190" height="100" rx="6" fill="#ffffff" stroke="#141a33" stroke-width="3"/>' +
        T(162, 56, "bonnie and i went", 15, {}) + T(162, 82, "to the park on", 15, {}) + T(162, 108, "sunday.", 15, {}) +
        A.jay(76, 60, 0.85, "wink") + '</svg>',
      boxes: [{ label: "Missing capitals", a: 3 }],
      slips: [[2, "Close. Check the day at the end too."], [4, "One too many. Bonnie starts the sentence and is a name, but it only needs one capital."], [1, "There are more: I on its own, and a day."]],
      hint: "A name at the start, I, and a day.",
      why: "<b>B</b>onnie (the start, and a name), <b>I</b> and <b>S</b>unday: <b>3</b>. Park stays small.",
      ez: { q: "Jay wrote: <div class=\"a2task\">bonnie and i went to the park on sunday.</div> How many capitals are missing?", hint: "A name, I, and a day.", why: "<b>B</b>onnie, <b>I</b>, <b>S</b>unday: <b>3</b>.", slips: [[null, "Close! Check the day too."], [null, "1 too many. Park stays small."], [null, "There are more. Look at i and the day."]] },
      lv: { medium: { q: "Jay wrote on the board: <div class=\"a2task\">bonnie and i went to brighton in may. we saw the sea.</div> How many capital letters are missing?",
          boxes: [{ label: "Missing capitals", a: 5 }],
          slips: [[4, "Close. Do not forget the second sentence's first word."], [6, "One too many. Sea does not need a capital."], [3, "There are more: a name, I, a place, a month, and a sentence start."]],
          hint: "Two sentences. Check names, places, months and I.",
          why: "<b>B</b>onnie, <b>I</b>, <b>B</b>righton, <b>M</b>ay and <b>W</b>e: <b>5</b>." },
        spicy: { q: "Jay wrote on the board: <div class=\"a2task\">last tuesday, mum and i took bonnie to the vet in the spring sunshine. dr patel said she was fine.</div> How many capital letters are missing?",
          boxes: [{ label: "Missing capitals", a: 7 }],
          slips: [[6, "Close. Check Dr Patel: a title and a name, two capitals."], [8, "One too many. Spring is a season, no capital, and the vet is not a name."], [5, "Mum is used as a name here, and Bonnie is a name too."]],
          hint: "Start, day, Mum (as a name), I, Bonnie, then a new sentence with a title and a name.",
          why: "<b>L</b>ast, <b>T</b>uesday, <b>M</b>um (used as her name), <b>I</b>, <b>B</b>onnie, <b>D</b>r and <b>P</b>atel: <b>7</b>. The vet and spring stay small." } } },

    /* ---------- chunk 2: ends of sentences ---------- */
    { type: "learn", topic: "Ends of sentences", title: "Every sentence needs an ending",
      fig: ENDS,
      html: "<p>Second sweep: <b>end marks</b>. Every sentence ends with one of three:</p>" +
        "<p><b>.</b> a full stop when it is done. <b>?</b> a question mark when it asks. <b>!</b> an exclamation mark for a strong feeling: What a [[wow]]!</p>" +
        "<p>Watch for sentences that run into each other: \"It was cold we went inside\" is two sentences. \"It was cold. We went inside.\"</p>" +
        "<p>In the wise words of Jay's late, great grandfather: stop. Ideally with a full stop.</p>",
      ez: { title: "End marks", html: "<p>End with <b>.</b> or <b>?</b> or <b>!</b></p><p>Asking? Use <b>?</b> Strong feeling? Use <b>!</b></p>" },
      lv: { spicy: { html: "<p>Second sweep: <b>sentence boundaries</b>.</p>" +
          "<p>A <b>comma splice</b> joins two full sentences with just a comma: \"It was cold, we went inside.\" A comma is not strong enough. Fix it with a full stop (It was cold. We went inside.), a joining word (It was cold, so we went inside.) or a semicolon (It was cold; we went inside.).</p>" +
          "<p>Question trap: \"She asked where the toilets were.\" is a <b>reported</b> question, so it ends with a full stop, not a question mark.</p>" +
          "<p>In the wise words of Jay's late, great grandfather: stop.</p>" } } },

    { type: "mc", topic: "Ends of sentences",
      q: "Which end mark? <div class=\"a2task\">Where is my [[thing]]_</div>",
      options: ["? a question mark", ". a full stop", "! an exclamation mark"],
      answer: 0, fixed: true,
      slips: { 1: "Where is... is asking something. Asking needs a question mark.", 2: "It might be urgent, but it is still a question." },
      hint: "Is it asking?",
      why: "It asks a question, so it ends with <b>?</b>",
      ez: { why: "It asks, so use <b>?</b>", slips: { 1: "Where is... is asking. Use ?", 2: "Urgent, but still a question." } },
      lv: { medium: { q: "Which end mark? <div class=\"a2task\">What a [[wow]] that was_</div>",
          slips: { 0: "It starts with What, but it is not asking. It is a strong feeling.", 1: "A full stop is possible, but this is a strong feeling: wow." },
          answer: 2,
          hint: "Is it asking, or saying wow?",
          why: "\"What a [[wow]] that was\" is not a question; it is a strong feeling, so <b>!</b>" },
        spicy: { q: "Which end mark? <div class=\"a2task\">[[Who]] asked where the toilets were_</div>",
          answer: 1,
          slips: { 0: "It reports a question, but the sentence itself is telling you something. Reported questions take a full stop.", 2: "There is no strong feeling here." },
          hint: "Is the sentence asking you, or telling you what someone asked?",
          why: "It tells you what someone asked: a reported question, so a <b>full stop</b>." } } },

    { type: "num", topic: "Ends of sentences",
      q: "How many sentences are hiding in here?<div class=\"a2task\">we got to [[Town]] it was raining we had chips</div>",
      boxes: [{ label: "Sentences", a: 3 }],
      slips: [[1, "It has no full stops, but there are separate ideas in it. Each one can stand alone."], [2, "Close. Find where each new idea starts: we got... it was... we had..."]],
      hint: "Look for where a new idea starts.",
      why: "<b>3</b>: We got to [[Town]]. It was raining. We had chips.",
      ez: { q: "How many sentences are here?<div class=\"a2task\">we got to [[Town]] it was raining we had chips</div>", hint: "Where does a new idea start?", slips: [[null, "Each idea can stand alone. Count them."], [null, "Close! We got... it was... we had..."]] },
      lv: { medium: { q: "How many full stops are needed?<div class=\"a2task\">we got to [[Town]] at ten it was raining so we went to a cafe we had chips and the bill was huge</div>",
          boxes: [{ label: "Full stops", a: 3 }],
          slips: [[2, "Do not forget the very end."], [4, "\"so we went\" and \"and the bill\" use joining words, so those ideas can stay in one sentence."], [5, "Joining words like so and and keep ideas together. Count the separate sentences."]],
          hint: "Joining words like so and and can keep ideas in one sentence.",
          why: "We got to [[Town]] at ten. It was raining, so we went to a cafe. We had chips and the bill was huge. That is <b>3</b> full stops." },
        spicy: { q: "How many comma splices are in this?<div class=\"a2task\">We reached [[Town]] at ten, the rain had stopped. We found a cafe, because we were hungry. The chips were great, the bill was not.</div>",
          boxes: [{ label: "Comma splices", a: 2 }],
          slips: [[3, "\"We found a cafe, because we were hungry\" is fine: because joins them."], [1, "Look at the last sentence too: two full sentences, joined only by a comma."]],
          hint: "A splice is two full sentences joined by only a comma, with no joining word.",
          why: "Two splices: \"at ten, the rain\" and \"were great, the bill\". The middle one has because, so it is fine." } } },

    { type: "mc", topic: "Ends of sentences",
      q: "Which one is fixed properly?",
      options: ["It was cold. We went inside.", "It was cold we went inside.", "it was cold. we went inside"],
      answer: 0,
      slips: { 1: "That still runs two sentences together. It needs a full stop after cold.", 2: "The full stop is there, but each sentence needs a capital, and the end needs a full stop too." },
      hint: "Two sentences: each needs a capital and an end mark.",
      why: "Two sentences, two capitals, two full stops.",
      ez: { q: "Which one is fixed?", hint: "A capital and end mark for each.", why: "2 sentences. 2 capitals. 2 full stops.", slips: { 1: "It still runs on. Stop after cold.", 2: "Each sentence needs a capital." } },
      lv: { spicy: { q: "Which is <b>not</b> a proper fix for \"It was cold, we went inside.\"?",
        options: ["It was cold, we went inside anyway.", "It was cold, so we went inside.", "It was cold. We went inside.", "It was cold; we went inside."],
        slips: { 1: "This one works: so is a joining word.", 2: "This one works: two separate sentences.", 3: "This one works: a semicolon can join two linked sentences." },
        hint: "Which one is still just two sentences and a comma?",
        why: "Adding \"anyway\" does not fix it: it is still two sentences joined by only a comma." } } },

    { type: "sort", topic: "Ends of sentences",
      q: "Patrol check. Sort them, if you like.",
      buckets: ["All good", "Needs fixing"],
      cards: [["Is the [[thing]] ready?", 0], ["What a [[wow]]!", 0], ["Where are you going.", 1], ["we left at six.", 1], ["I love [[Town]] it is great.", 1], ["We got home late.", 0]],
      hint: "Check each one: capital at the start, the right end mark, and only one sentence.",
      why: "\"Where are you going\" asks, so it needs ?. \"we\" needs a capital. \"I love [[Town]] it is great\" is two sentences run together.",
      ez: { q: "All good, or needs fixing?", hint: "Capital? Right end mark?", why: "\"Where are you going\" asks: use ?. \"we\" needs a capital." },
      lv: { mild: { cards: [["Is the [[thing]] ready?", 0], ["Where are you going.", 1], ["we left at six.", 1], ["We got home late.", 0]],
          why: "\"Where are you going\" asks, so it needs ?. \"we\" needs a capital letter." },
        spicy: { cards: [["Is the [[thing]] ready?", 0], ["She asked if we were ready?", 1], ["It was late, we left.", 1], ["It was late, so we left.", 0], ["What a [[wow]]!", 0], ["We left at six it was dark.", 1]],
          why: "A reported question takes a full stop. \"It was late, we left\" is a comma splice. \"We left at six it was dark\" runs on." } } },

    /* ---------- chunk 3: commas and apostrophes ---------- */
    { type: "learn", topic: "Commas and apostrophes", title: "Commas in lists, apostrophes for missing letters",
      fig: COMMAS,
      html: "<p>Third sweep: <b>commas and apostrophes</b>.</p>" +
        "<p><b>Lists:</b> put a comma between items, and usually just <b>and</b> before the last one. I packed my [[thing]], a drink and a coat.</p>" +
        "<p><b>Missing letters:</b> an apostrophe takes the place of the letters you leave out. do not = <b>don't</b>, I am = <b>I'm</b>, can not = <b>can't</b>.</p>",
      ez: { title: "Commas and apostrophes", html: "<p><b>Lists:</b> my [[thing]], a drink and a coat.</p><p><b>Missing letters:</b> do not = <b>don't</b>.</p>" },
      lv: { medium: { html: "<p>Third sweep: <b>commas and apostrophes</b>.</p>" +
          "<p><b>Lists:</b> commas between items, usually just <b>and</b> before the last.</p>" +
          "<p><b>Missing letters:</b> don't, I'm, it's (it is), couldn't.</p>" +
          "<p><b>Belonging:</b> add <b>'s</b> to show something belongs to someone: <b>Jay's</b> bird, my <b>brother's</b> phone, and [[who]]'s [[thing]].</p>" },
        spicy: { html: "<p>Third sweep: <b>commas and apostrophes</b>, where the trickiest slips hide.</p>" +
          "<p><b>Commas after an opener:</b> When we arrived, the car park was full.</p>" +
          "<p><b>Belonging, one owner:</b> the dog's bowl. <b>More than one owner ending in s:</b> the s comes first, then the apostrophe: the dogs' bowls, the visitors' car park. <b>Plural not ending in s:</b> the children's museum.</p>" +
          "<p><b>its or it's?</b> it's = it is (or it has). its = belonging to it, with <b>no</b> apostrophe: the town is famous for its history.</p>" } } },

    { type: "text", topic: "Commas and apostrophes",
      q: "Write the short form of <b>do not</b>, with an apostrophe.",
      need: [["don't"]],
      slips: [[["dont"], "Nearly. The o is missing, so an apostrophe goes where it was: don't."], [["do'nt"], "Close. The apostrophe goes where the missing letter was: between n and t."]],
      model: "don't",
      hint: "Take out the o, and put an apostrophe in its place.",
      why: "do not becomes <b>don't</b>: the apostrophe sits where the o was.",
      ez: { q: "Write <b>do not</b> short, with an apostrophe.", hint: "Take out the o.", why: "<b>don't</b>. The apostrophe is where the o was.", slips: [[null, "Nearly! Add an apostrophe where the o was."], [null, "Close. Put it between n and t."]] },
      lv: { medium: { q: "Write <b>the [[thing]] that belongs to Jay</b> in two words, using an apostrophe.",
          need: [["jay's"]],
          slips: [[["jays"], "Nearly. Add an apostrophe before the s to show it belongs to Jay."], [["jays'"], "Jay is one person, so the apostrophe goes before the s: Jay's."]],
          model: "Jay's [[thing]]",
          hint: "Owner, then apostrophe s, then the thing.",
          why: "<b>Jay's [[thing]]</b>: one owner, so 's." },
        spicy: { q: "Write <b>the bowls that belong to the two dogs</b> in three words, using an apostrophe.",
          need: [["dogs'"]],
          slips: [[["dog's"], "That is one dog. With two dogs, the plural comes first, then the apostrophe: dogs'."], [["dogs bowls"], "Nearly. Add an apostrophe to show the bowls belong to the dogs."]],
          model: "the dogs' bowls",
          hint: "More than one dog: dogs. Then the apostrophe.",
          why: "<b>the dogs' bowls</b>: plural owners ending in s take the apostrophe after the s." } } },

    { type: "mc", topic: "Commas and apostrophes",
      q: "Which list has its commas right?",
      options: ["A) I packed my [[thing]], a drink and a coat.", "B) I packed my [[thing]] a drink, and, a coat.", "C) I packed, my [[thing]], a drink, a coat."], fixed: true,
      answer: 0,
      slips: { 1: "Commas go between the items, not around the and.", 2: "There should be no comma straight after packed, and the last item usually has and before it." },
      hint: "Commas between items, and before the last one.",
      why: "A comma between items, and <b>and</b> before the last one.",
      ez: { hint: "Commas between items. And before the last.", why: "Commas between items. <b>and</b> before the last.", slips: { 1: "Commas go between the items.", 2: "No comma after packed." } },
      lv: { spicy: { q: "Which one is punctuated correctly?",
        options: ["A) When we arrived, the visitors' car park was full.", "B) When we arrived the visitor's car park was full.", "C) When we arrived, the visitors car park was full.", "D) When, we arrived the visitors' car park was full."], fixed: true,
        slips: { 1: "Two slips: the opener needs a comma, and many visitors share the car park, so visitors'.", 2: "The car park belongs to the visitors, so it needs an apostrophe: visitors'.", 3: "The comma goes at the end of the opener, after arrived." },
        hint: "Check the comma after the opener, then who owns the car park.",
        why: "A comma after the opener <b>When we arrived,</b> and <b>visitors'</b> because the car park is for lots of visitors." } } },

    { type: "match", topic: "Commas and apostrophes",
      q: "Match each short form to its long form.",
      pairs: [["don't", "do not"], ["I'm", "I am"], ["can't", "cannot"], ["it's", "it is"]],
      hint: "Say the long form out loud. Which letters disappear?",
      why: "The apostrophe always sits where letters were taken out.",
      ez: { q: "Match the short and long forms.", hint: "Say it long. Which letters go?", why: "The apostrophe sits where letters went." },
      lv: { medium: { pairs: [["couldn't", "could not"], ["it's", "it is"], ["Jay's bird", "the bird belonging to Jay"], ["my brother's phone", "the phone of my brother"]],
          why: "Some apostrophes show missing letters; some show belonging." },
        spicy: { pairs: [["the dog's bowl", "one dog owns it"], ["the dogs' bowls", "more than one dog own them"], ["it's", "it is, or it has"], ["its", "belonging to it"]],
          why: "One owner: 's. Plural owners ending in s: s'. It's means it is; its means belonging to it." } } },

    { type: "mc", topic: "Commas and apostrophes",
      q: "Which one is right?",
      options: ["I'm going to [[Town]].", "Im going to [[Town]].", "I'am going to [[Town]]."],
      answer: 0,
      slips: { 1: "I am loses the a, and the apostrophe takes its place: I'm.", 2: "The a is missing, so it should not be there: I'm." },
      hint: "I am with the a taken out.",
      why: "<b>I'm</b> = I am. The apostrophe replaces the a.",
      ez: { hint: "I am, without the a.", why: "<b>I'm</b> means I am.", slips: { 1: "Add an apostrophe where the a was.", 2: "The a has gone: I'm." } },
      lv: { medium: { q: "Which one is right?",
          options: ["It's a long way to [[Town]].", "Its a long way to [[Town]].", "It's' a long way to [[Town]]."],
          slips: { 1: "It is shortens to it's, with an apostrophe.", 2: "Only one apostrophe, where the i of is was." },
          why: "<b>It's</b> = it is." },
        spicy: { q: "Which one is right?",
          options: ["[[Town]] is famous for its history, and it's busy in summer.", "[[Town]] is famous for it's history, and its busy in summer.", "[[Town]] is famous for its history, and its busy in summer.", "[[Town]] is famous for it's history, and it's busy in summer."],
          slips: { 1: "Both swapped. Belonging to it: its. It is: it's.", 2: "The second one means it is busy, so it needs it's.", 3: "The first one means belonging to the town, so its, no apostrophe." },
          hint: "Try saying \"it is\" in each gap. If it works, use it's.",
          why: "Its history (belonging to it, no apostrophe). It's busy (it is busy)." } } },

    /* ---------- chunk 4: on patrol ---------- */
    { type: "learn", topic: "On patrol", title: "Proofread a whole piece",
      fig: PATROL,
      html: "<p>Now for a whole piece. On a real patrol:</p>" +
        "<ol><li>Read it all once, just for sense.</li><li>Sweep for <b>capitals</b>.</li><li>Sweep for <b>end marks</b>.</li><li>Sweep for <b>commas</b> and <b>apostrophes</b>.</li></ol>" +
        "<p>Going slowly is the whole trick. Pointing at each word helps.</p>",
      ez: { title: "Check a whole piece", html: "<p>Read it once. Then check <b>capitals</b>, <b>end marks</b> and <b>commas</b>.</p><p>Go slowly!</p>" },
      lv: { spicy: { html: "<p>Now for a whole piece. Inspector method:</p>" +
          "<ol><li>Read for sense, listening for where sentences really end.</li><li>Sweep: capitals and proper nouns.</li><li>Sweep: end marks and comma splices.</li><li>Sweep: commas after openers, apostrophes (owner count, its or it's).</li></ol>" +
          "<p>Professional proofreaders read backwards sometimes, one sentence at a time, so the meaning does not carry them past a slip.</p>" } } },

    { type: "widget", topic: "On patrol", unscored: true,
      title: "Patrol: tap the slips",
      html: "<p>A postcard from [[Town]]. Tap anything that needs fixing, then check your patrol. Nothing here is marked; it is just a chance to practise.</p>",
      ez: { html: "<p>A postcard from [[Town]]. Tap the slips. Then check.</p>" },
      mount: patrolWidget,
      report: function(d){ var n = d && d.flags ? d.flags.filter(Boolean).length : 0; return d && d.checked ? "Patrol: flagged " + n + " and checked." : ""; } },

    { type: "multi", topic: "On patrol", explain: true,
      q: "Another postcard. Which sentences need fixing?",
      options: ["We arrived in [[Town]] on Friday.", "the weather was lovely.", "Have you ever been here.", "I bought a hat, a map and a [[thing]].", "We are going home on monday."],
      answers: [1, 2, 4],
      hint: "Sweep for capitals, then end marks.",
      why: "\"the\" needs a capital; \"Have you ever been here\" asks, so it needs ?; and Monday is a day, so it needs a capital.",
      ez: { q: "Which sentences need fixing? Pick <b>all</b>.", hint: "Capitals, then end marks.", why: "\"the\" and Monday need capitals. The question needs ?." },
      lv: { medium: { options: ["We arrived in [[Town]] on Friday.", "Its a lovely place.", "My sisters hat blew away.", "I bought a map, a hat and a [[thing]].", "Are you coming next time?"],
          answers: [1, 2],
          hint: "Sweep for apostrophes: missing letters and belonging.",
          why: "\"Its\" means it is, so it's. The hat belongs to my sister, so sister's. The others are fine." },
        spicy: { options: ["When we arrived, the hotel was full.", "The towns' best cafe was shut.", "It was late, we found a bed anyway.", "The children's playground had its own cafe.", "Mum asked if we were tired."],
          answers: [1, 2],
          hint: "One apostrophe slip and one sentence boundary slip.",
          why: "One town, so town's. \"It was late, we found a bed anyway\" is a comma splice. The others are correct, including the reported question." } } },

    { type: "mc", topic: "On patrol",
      q: "Which postcard sentence is perfect?",
      options: ["A) We had chips, ice cream and a long walk.", "B) we had chips, ice cream and a long walk.", "C) We had chips ice cream and a long walk", "D) We had chips, ice cream, and, a long walk."], fixed: true,
      answer: 0,
      slips: { 1: "The first word needs a capital.", 2: "It needs commas in the list and a full stop at the end.", 3: "There should be no comma straight after and." },
      hint: "Capital, list commas, full stop.",
      why: "A capital, commas between the list items, and a full stop.",
      ez: { q: "Which sentence is perfect?", why: "A capital, list commas and a full stop.", slips: { 1: "The first word needs a capital.", 2: "It needs commas and a full stop.", 3: "No comma after and." } },
      lv: { spicy: { options: ["A) After lunch, we visited the children's museum; it's free on Sundays.", "B) After lunch we visited the childrens museum, its free on Sundays.", "C) After lunch, we visited the childrens' museum; its free on Sundays.", "D) After lunch, we visited the children's museum, it's free on sundays."], fixed: true,
        slips: { 1: "Four slips: opener comma, children's, a comma splice, and it's.", 2: "children is already plural, so children's; and it is free needs it's.", 3: "Two slips: the comma joining two sentences is a splice, and Sundays needs a capital." },
        hint: "Check the opener, the apostrophes, the join, and the day.",
        why: "Opener comma, children's, a semicolon to join two sentences, it's (it is), and Sundays with a capital." } } }
  ],

  ez: {
    blurb: "Catch the slips: capitals, end marks, commas.",
    realWorld: { title: "Proofreaders are real", html: "<p>Every book and sign gets <b>checked</b> first.</p><p>\"Let's eat, Grandma!\" One comma saves Grandma.</p>" },
    make: { intro: "A sentence with a slip. Then your fixed one." }
  },

  realWorld: {
    title: "Proofreaders are a real job",
    html: "<p>Every book, sign and website you read was checked by someone first. Shops still put up signs saying \"potato's\" by mistake. A job application with no slips makes a great first impression.</p>" +
      "<p>For our big question: if you could send one message back in time, you would want it perfect. \"Let's eat, Grandma!\" and \"Let's eat Grandma!\" are very different messages. One comma saves Grandma.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay by a time portal saying one comma saves Grandma">' + A.portal(80, 75, 56) + A.jay(236, 50, 0.85, "wow") +
      A.bubble(286, 4, 128, 52, "One comma\nsaves Grandma.", 296) + '</svg>'
  },

  make: {
    title: "Make a before and after card",
    intro: "One sentence with a slip, and your fixed version. Keep it, stick it on the wall, or send it to Jay.",
    fields: [
      { id: "before", label: "Before (with a slip)", ph: "on monday i went to [[townlc]]", max: 60 },
      { id: "after", label: "After (fixed)", ph: "On Monday I went to [[Town]].", max: 60 },
      { id: "name", label: "Patrol officer", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      var b = wrap(v.before, 30, 2), a = wrap(v.after, 30, 2);
      function squig(y, w){ var s = "M44 " + y; for(var x = 44; x < 44 + w; x += 12) s += "q3 -5 6 0t6 0"; return '<path d="' + s + '" fill="none" stroke="#e04848" stroke-width="2.5"/>'; }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#2d3e8f"/>' +
        T(300, 50, "PROOFREADING PATROL", 24, { b: 1, a: "middle", c: "#ffd23f" }) +
        '<rect x="24" y="74" width="552" height="122" rx="16" fill="#ffffff"/>' +
        T(44, 104, "BEFORE", 15, { b: 1, c: "#e04848" }) +
        b.map(function(l, k){ return T(44, 140 + k * 32, esc(l), 22, { fit: 500 }) + squig(148 + k * 32, Math.min(500, textW(l, 22) * 0.9)); }).join("") +
        '<path d="M300 200v22" stroke="#ffd23f" stroke-width="5"/><path d="M300 232l-12 -14h24z" fill="#ffd23f"/>' +
        '<rect x="24" y="236" width="552" height="122" rx="16" fill="#e6f8ef"/>' +
        T(44, 266, "AFTER", 15, { b: 1, c: "#1f9d63" }) +
        a.map(function(l, k){ return T(44, 302 + k * 32, esc(l), 22, { b: 1, fit: 440 }); }).join("") +
        '<g transform="translate(532 300)"><circle r="26" fill="#1f9d63"/><path d="M-12 0l8 9 16 -18" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round"/></g>' +
        T(576, 386, "Patrol officer: " + esc(v.name), 14, { a: "end", c: "#c9d3ff", fit: 400 }) +
        '</svg>';
    }
  }
};
})();
