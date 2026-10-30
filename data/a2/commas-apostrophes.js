/* Base 5 Autumn 2 activity: Commas and apostrophes.
   English. Commas in lists and after openers; apostrophes for
   missing letters and for owning (one owner, more than one).
   ASCII only. */
(function(){
var A = window.A2ART;
var F = "Verdana,Arial,sans-serif";
function T(x, y, t, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" font-family="' + F + '" font-size="' + (o.s || 15) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.f || "#141a33") + '">' + t + '</text>';
}
/* lettered versions of a sentence, for questions where only the punctuation differs */
function vers(list){ return '<div class="a2task">' + list.map(function(t, k){ return '<p style="margin:' + (k ? "10px" : "0") + ' 0 0"><b>' + "ABCD".charAt(k) + ':</b> ' + t + '</p>'; }).join("") + '</div>'; }

/* a list: items with commas between, and "and" before the last */
var LIST =
  '<svg viewBox="0 0 520 190" role="img" aria-label="Four items in a row. Commas sit between the first ones, and the word and joins the last two">' +
  '<rect width="520" height="190" rx="16" fill="#f4f1ea"/>' +
  [["item 1", "#ffd23f"], ["item 2", "#22b8e6"], ["item 3", "#19c39a"], ["item 4", "#ff5d8f"]].map(function(c, k){
    var x = 22 + k * 126;
    return '<rect x="' + x + '" y="56" width="92" height="50" rx="12" fill="' + c[1] + '" fill-opacity=".45" stroke="#141a33" stroke-width="2.5"/>' + T(x + 46, 87, c[0], { a: "middle", s: 15, b: 1 });
  }).join("") +
  T(126, 104, ",", { a: "middle", s: 44, b: 1, f: "#e04848" }) + T(252, 104, ",", { a: "middle", s: 44, b: 1, f: "#e04848" }) +
  T(379, 90, "and", { a: "middle", s: 16, b: 1, f: "#1f9d63" }) +
  T(126, 140, "comma", { a: "middle", s: 13, f: "#e04848" }) + T(252, 140, "comma", { a: "middle", s: 13, f: "#e04848" }) + T(379, 140, "and", { a: "middle", s: 13, f: "#1f9d63" }) +
  T(260, 34, "A comma between each item, then \"and\" before the last.", { a: "middle", s: 14 }) +
  T(260, 172, "I packed a torch, a map, a flask and a snack.", { a: "middle", s: 15, b: 1 }) +
  A.egg(A.bird(492, 160, 0.55, "#3a8fd6"), "Jay's theory: a comma is just a very small bird, seen from very far away.") +
  '</svg>';

/* an opener, a comma pause, then the main sentence */
var OPENER =
  '<svg viewBox="0 0 520 170" role="img" aria-label="An opener block, a comma like a short pause, then the main sentence block">' +
  '<rect width="520" height="170" rx="16" fill="#eef6fb"/>' +
  '<rect x="20" y="50" width="170" height="56" rx="12" fill="#ffd23f" fill-opacity=".55" stroke="#141a33" stroke-width="2.5"/>' +
  T(105, 76, "Opener", { a: "middle", s: 16, b: 1 }) + T(105, 96, "when, where, how", { a: "middle", s: 13 }) +
  T(206, 98, ",", { a: "middle", s: 54, b: 1, f: "#e04848" }) +
  '<rect x="226" y="50" width="274" height="56" rx="12" fill="#22b8e6" fill-opacity=".35" stroke="#141a33" stroke-width="2.5"/>' +
  T(363, 76, "Main sentence", { a: "middle", s: 16, b: 1 }) + T(363, 96, "makes sense on its own", { a: "middle", s: 13 }) +
  T(206, 140, "pause", { a: "middle", s: 13, f: "#e04848" }) +
  T(260, 34, "Later that night, the lights went out.", { a: "middle", s: 15, b: 1 }) +
  '</svg>';

/* omission: do not becomes don't, the o pops out */
var SQUASH =
  '<svg viewBox="0 0 520 200" role="img" aria-label="The words do not squash together into don\'t. The letter o pops out and the apostrophe takes its place">' +
  '<rect width="520" height="200" rx="16" fill="#f3f7ee"/>' +
  T(130, 70, "do not", { a: "middle", s: 34, b: 1 }) +
  '<path d="M220 58H290" stroke="#141a33" stroke-width="3" marker-end="url(#caA)"/>' +
  '<defs><marker id="caA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#141a33"/></marker></defs>' +
  T(400, 70, "don", { a: "end", s: 34, b: 1 }) + T(404, 70, "'", { s: 40, b: 1, f: "#e04848" }) + T(414, 70, "t", { s: 34, b: 1 }) +
  '<circle cx="412" cy="140" r="22" fill="#fff" stroke="#e04848" stroke-width="3" stroke-dasharray="5 4"/>' + T(412, 152, "o", { a: "middle", s: 32, b: 1, f: "#e04848" }) +
  '<path d="M410 86q-12 14 0 30" fill="none" stroke="#e04848" stroke-width="2.5" marker-end="url(#caA)"/>' +
  T(30, 132, "The apostrophe sits where", { s: 15 }) + T(30, 154, "the letters were taken out.", { s: 15 }) +
  T(30, 182, "Not where the two words join.", { s: 14, b: 1, f: "#1f9d63" }) +
  '</svg>';

/* possession: one owner 's, many owners s' */
var OWN =
  '<svg viewBox="0 0 520 210" role="img" aria-label="One person owns a bag: apostrophe s. Three people own bags: s apostrophe">' +
  '<rect width="520" height="210" rx="16" fill="#fdf6e7"/>' +
  '<path d="M260 20v170" stroke="#141a33" stroke-opacity=".2" stroke-width="3" stroke-dasharray="6 6"/>' +
  '<g transform="translate(90 96)"><circle cy="-32" r="14" fill="#ff5d8f"/><path d="M-18 26v-36q0 -12 18 -12q18 0 18 12v36z" fill="#ff5d8f"/><rect x="22" y="0" width="26" height="24" rx="5" fill="#8a5a36"/></g>' +
  T(130, 168, "one owner", { a: "middle", s: 14 }) + T(130, 194, "the captain's bag", { a: "middle", s: 15, b: 1 }) +
  T(178, 84, "'s", { s: 28, b: 1, f: "#e04848" }) +
  [330, 380, 430].map(function(x){ return '<g transform="translate(' + x + ' 96) scale(.85)"><circle cy="-32" r="14" fill="#22b8e6"/><path d="M-18 26v-36q0 -12 18 -12q18 0 18 12v36z" fill="#22b8e6"/><rect x="20" y="2" width="22" height="22" rx="5" fill="#8a5a36"/></g>'; }).join("") +
  T(390, 168, "more than one owner", { a: "middle", s: 14 }) + T(390, 194, "the players' bags", { a: "middle", s: 15, b: 1 }) +
  T(470, 60, "s'", { s: 28, b: 1, f: "#e04848" }) +
  '</svg>';

/* Bonnie, post dinner */
var NAP = '<svg viewBox="0 0 320 150" role="img" aria-label="Bonnie the poodle, sitting">' +
  '<rect width="320" height="150" rx="16" fill="#fdf6e7"/>' +
  A.egg(A.bonnie(160, 92, 1.2, "sit"), "Bonnie has read this question. She would like it known that nobody eats Bonnie. Unhand her, goblin.") + '</svg>';

/* the comma widget: segments, and which gaps get a comma */
function W(k){ return "[" + "[" + k + "]]"; }
var SEG = {
  mild: { segs: ["I packed", W("l1"), W("l2"), W("l3"), "and", W("l4") + "."], right: [1, 2], opt: 3 },
  full: { segs: ["I packed", W("l1"), W("l2"), W("l3"), W("l4"), "and", W("l5") + "."], right: [1, 2, 3], opt: 4 }
};

(window.A2PACKS = window.A2PACKS || {})["commas-apostrophes"] = {
  a2: true,
  id: "a2-commas-apostrophes",
  title: "Commas and apostrophes",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "Commas give the reader a breath. Apostrophes show missing letters, or who owns what.",
  blurb: "Commas in lists and after openers, then apostrophes for missing letters and for owning things. Four short chunks, with a sign to design at the end.",
  note: "Commas and apostrophes: lists, openers, missing letters and who owns what. Four five minute chunks and a sign to design at the end. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Squiggle", line: "Squiggle: commas in short lists, and everyday shortened words." },
    { id: "medium", name: "Flick", line: "Flick: commas after openers too, and apostrophes for one owner." },
    { id: "spicy", name: "Flourish", line: "Flourish: longer openers, its and it's, and more than one owner." }
  ],
  themes: {
    time: { name: "Time travel", w: { event: "the trip", place: "the time lab", opener: "Just before the launch", l1: "a compass", l2: "a torch", l3: "a flask", l4: "a spare battery", l5: "a map of 1066", who: "pilot", whos: "pilots", thing: "goggles" } },
    football: { name: "Football", w: { event: "the match", place: "the stadium", opener: "Just before kick off", l1: "shin pads", l2: "boots", l3: "a towel", l4: "a water bottle", l5: "a spare shirt", who: "captain", whos: "players", thing: "boots" } },
    horror: { name: "Horror", w: { event: "the night shift", place: "the old hospital", opener: "Just before midnight", l1: "a torch", l2: "a radio", l3: "the keys", l4: "spare batteries", l5: "a very old map", who: "porter", whos: "nurses", thing: "keys" } },
    fishing: { name: "Fishing", w: { event: "the fishing trip", place: "the lake", opener: "Just after first light", l1: "hooks", l2: "bait", l3: "a net", l4: "a flask", l5: "a folding chair", who: "angler", whos: "anglers", thing: "rods" } },
    music: { name: "Music", w: { event: "the show", place: "the theatre", opener: "Just before curtain up", l1: "a script", l2: "a costume", l3: "a hairbrush", l4: "a water bottle", l5: "dancing shoes", who: "singer", whos: "dancers", thing: "costumes" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: LIST,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Commas in lists", title: "Commas in a list",
      ez: { title: "Commas in a list", html: "<p>Put a <b>comma</b> between things in a list.</p><p>Use <b>and</b> before the last one.</p>" },
      fig: LIST,
      html: "<p>When you list three or more things, put a <b>comma</b> between them. Before the last thing, use <b>and</b> (or <b>or</b>).</p>" +
        "<p class=\"a2task\">For [[event]], I packed [[l1]], [[l2]], [[l3]] and [[l4]].</p>" +
        "<p>The \"and\" already joins the last two, so in most British writing there is no comma before it.</p>",
      lv: { spicy: { html: "<p>In a list of three or more, a <b>comma</b> goes between the items and <b>and</b> (or <b>or</b>) joins the last two.</p>" +
        "<p class=\"a2task\">For [[event]], I packed [[l1]], [[l2]], [[l3]] and [[l4]].</p>" +
        "<p>Items can be longer than one word, even whole actions: \"We set off early, got lost twice and arrived just in time.\"</p>" +
        "<p>Most British writing leaves out the comma before \"and\". Some writers add one (it has a name: the <b>Oxford comma</b>) when it stops a sentence being misread. You will see one of those soon.</p>" } } },

    { type: "mc", topic: "Commas in lists",
      q: vers(["I packed [[l1]] [[l2]] [[l3]] and [[l4]].", "I packed [[l1]], [[l2]], [[l3]] and [[l4]].", "I packed, [[l1]], [[l2]], [[l3]], and, [[l4]]."]) + "<p>Which version uses commas well?</p>",
      options: ["A", "B", "C"], answer: 1, fixed: true,
      slips: { 0: "A has no commas at all, so the items run into each other.", 2: "C has commas everywhere, even after \"packed\" and \"and\". They only go between the items." },
      hint: "Commas go between the items, nowhere else.",
      why: "B has a comma between each item and \"and\" before the last. No extras.",
      ez: { why: "B: commas between items, and \"and\" before the last.", slips: { 0: "A has no commas.", 2: "C has too many. Commas go between items only." } },
      lv: { spicy: {
        q: vers(["We set off early, got lost twice and arrived just in time.", "We set off, early got lost, twice and arrived just in time.", "We set off early got lost twice, and arrived, just in time."]) + "<p>The items in this list are actions. Which version uses commas well?</p>",
        options: ["A", "B", "C"], answer: 0,
        slips: { 1: "B splits the actions in odd places: \"early got lost\" is not one thing.", 2: "C runs the first two actions together and adds a comma inside the last one." },
        hint: "Find the three things that happened. The commas go between them.",
        why: "Three actions: set off early, got lost twice, arrived just in time. A comma between the first two, and \"and\" before the last." } } },

    { type: "num", topic: "Commas in lists",
      q: "<p class=\"a2task\">I packed [[l1]] [[l2]] [[l3]] [[l4]] and [[l5]]</p><p>How many commas does this list need? (Leave out a comma before \"and\", the British way.)</p>",
      boxes: [{ label: "Commas", a: 3 }],
      slips: [[4, "Four would put one before \"and\" too. The \"and\" already joins the last two items."], [5, "That is one for every item. Commas only go <b>between</b> items, and \"and\" does the last join."], [2, "Close. Count the gaps between the items, then take away the one that \"and\" fills."]],
      hint: "Five items means four gaps. \"And\" fills one of them.",
      why: "Five items, four gaps. \"And\" fills the last gap, so <b>3</b> commas: [[l1]], [[l2]], [[l3]], [[l4]] and [[l5]].",
      ez: { hint: "4 items, 3 gaps. \"And\" fills 1.", why: "<b>2</b> commas: [[l1]], [[l2]], [[l3]] and [[l4]].",
        slips: [[3, "No comma before \"and\"."], [4, "Commas only go between items."], [1, "Close. Count the gaps before \"and\"."]] },
      lv: { mild: { q: "<p class=\"a2task\">I packed [[l1]] [[l2]] [[l3]] and [[l4]]</p><p>How many commas does this list need?</p>",
        boxes: [{ label: "Commas", a: 2 }],
        slips: [[3, "Three would put one before \"and\". The \"and\" does that join."], [4, "That is one for every item. Commas only go between them."], [1, "Close. There are two gaps before the \"and\"."]],
        hint: "Four items means three gaps. \"And\" fills one of them.",
        why: "Four items, three gaps. \"And\" fills the last one, so <b>2</b> commas: [[l1]], [[l2]], [[l3]] and [[l4]]." } } },

    { type: "widget", topic: "Commas in lists", unscored: true,
      title: "Comma dropper",
      html: "<p>Tap a gap to drop a comma in. Tap it again to take it out. When it looks right to you, check it. No score, so have a play.</p>",
      ez: { html: "<p>Tap a gap to add a comma. Then check it.</p>" },
      mount: function(el, api){
        var d = api.data, tk = api.tok || function(t){ return t; };
        var key = api.level === "mild" ? "mild" : "full", cfg = SEG[key];
        var segs = cfg.segs.map(function(t){ return tk(t); });
        if(!Array.isArray(d.on) || d.key !== key){ d.on = []; d.key = key; d.checked = false; }
        el.innerHTML = '<div class="cabox" style="background:#fffdf6;border:2px solid #d9d8e6;border-radius:14px;padding:14px;font-size:1.15rem;line-height:2.2"></div>' +
          '<div class="qnav" style="flex-wrap:wrap;gap:8px"><button type="button" class="btn" data-a="check">Check my commas</button>' +
          '<button type="button" class="btn btn-quiet" data-a="clear">Take them all out</button></div>' +
          '<p class="tiny" aria-live="polite" style="min-height:1.4em"></p>';
        var box = el.querySelector(".cabox"), msg = el.querySelector("p.tiny");
        function on(k){ return d.on.indexOf(k) >= 0; }
        function draw(){
          var h = "";
          segs.forEach(function(t, k){
            h += '<span style="color:#141a33">' + t + '</span>';
            if(k < segs.length - 1){
              var c = on(k), good = cfg.right.indexOf(k) >= 0, opt = k === cfg.opt;
              var bd = "#9aa0b8", bg = "#ffffff";
              if(d.checked){ if(good && c){ bd = "#1f9d63"; bg = "#c9f2e2"; } else if(good || (c && !opt)){ bd = "#f2b705"; bg = "#fff1c2"; } else if(opt && c){ bd = "#22b8e6"; bg = "#e3f5fc"; } }
              else if(c){ bd = "#141a33"; bg = "#ffd23f"; }
              h += '<button type="button" data-g="' + k + '" aria-pressed="' + c + '" aria-label="Gap after ' + t.replace(/"/g, "") + '" style="font:inherit;font-weight:700;cursor:pointer;min-width:26px;padding:0 6px;margin:0 6px 0 1px;border-radius:8px;border:2px ' + (c ? "solid" : "dashed") + ' ' + bd + ';background:' + bg + ';color:#e04848;line-height:1.5">' + (c ? "," : "&nbsp;") + '</button>';
            }
          });
          box.innerHTML = h;
        }
        box.onclick = function(ev){
          var b = ev.target.closest("button[data-g]"); if(!b) return;
          var k = +b.getAttribute("data-g");
          if(on(k)) d.on.splice(d.on.indexOf(k), 1); else d.on.push(k);
          d.checked = false; msg.textContent = ""; api.save(); draw();
        };
        el.querySelector(".qnav").onclick = function(ev){
          var b = ev.target.closest("button"); if(!b) return;
          if(b.getAttribute("data-a") === "clear"){ d.on = []; d.checked = false; msg.textContent = ""; api.save(); draw(); return; }
          d.checked = true;
          var got = cfg.right.filter(on).length, extra = d.on.filter(function(k){ return cfg.right.indexOf(k) < 0 && k !== cfg.opt; }).length;
          msg.textContent = (got === cfg.right.length && !extra ? "Spot on. A comma between each item, and \"and\" for the last join." :
            "Green gaps are spot on; yellow ones are worth another look. Commas go between the items only, not after \"packed\" or after \"and\".") +
            (on(cfg.opt) ? " Your comma before \"and\" is allowed (some writers use one), but most British writing leaves it out." : "");
          api.save(); draw(); api.done("done");
        };
        draw();
        if(d.checked) api.done("done");
      } },

    { type: "mc", topic: "Commas in lists",
      q: vers(["My favourite things are pizza chips and bubble tea.", "My favourite things are pizza, chips and bubble tea."]) + "<p>Version A has no commas. Which would a reader find clearer?</p>",
      options: ["B", "A"], answer: 0, fixed: true,
      slips: { 1: "Read A aloud. It sounds like one strange food called \"pizza chips\". The comma splits them up." },
      hint: "Is \"pizza chips\" one thing or two?",
      why: "Without the comma, \"pizza chips\" looks like one food. The comma tells the reader they are two separate things.",
      ez: { q: vers(["My favourite things are pizza chips and bubble tea.", "My favourite things are pizza, chips and bubble tea."]) + "<p>Which is clearer?</p>",
        why: "The comma shows pizza and chips are 2 things.", slips: { 1: "A sounds like one food: pizza chips!" } },
      lv: { spicy: {
        q: vers(["I would like to thank my teachers, Jay and Bonnie.", "I would like to thank my teachers, Jay, and Bonnie."]) + "<p>Which version makes it clear that Jay and Bonnie are <b>not</b> your teachers?</p>",
        options: ["B", "A"], answer: 0, fixed: true,
        slips: { 1: "In A, \"Jay and Bonnie\" could be read as the names of your teachers. Which would be quite something, as Bonnie is a poodle." },
        hint: "In which one could \"Jay and Bonnie\" be explaining who your teachers are?",
        why: "In A, \"Jay and Bonnie\" could be a description of your teachers. B adds a comma before \"and\" (an Oxford comma), which makes it a list of three: your teachers, Jay, and Bonnie. This is exactly when that extra comma earns its place." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Commas after openers", title: "A comma after an opener",
      fig: OPENER,
      ez: { title: "Comma after an opener", html: "<p>An <b>opener</b> says when or how. Put a comma after it.</p><p><b>Slowly,</b> the door opened.</p>" },
      html: "<p>Lots of sentences start with an <b>opener</b>: a few words that say <b>when</b>, <b>where</b> or <b>how</b>. After the opener, put a comma.</p>" +
        "<p class=\"a2task\">[[Opener]], everyone went quiet.<br>Slowly, the door creaked open.<br>At [[place]], the lights were still on.</p>" +
        "<p>A handy check: cover the opener with your thumb. What is left should still make sense as a sentence.</p>",
      lv: { mild: { html: "<p>Some sentences start with an <b>opener</b>: a few words that say <b>when</b> or <b>how</b>. After the opener, put a comma.</p>" +
          "<p class=\"a2task\">Later that night, the lights went out.<br>Slowly, the door opened.</p>" +
          "<p>Cover the opener with your thumb. What is left should still make sense.</p>" },
        spicy: { html: "<p>An <b>opener</b> sets the scene before the main sentence: when, where, how, or why. It can be one word, a phrase, or a whole clause. A comma marks where it ends.</p>" +
          "<p class=\"a2task\">Slowly, the door creaked open.<br>[[Opener]], everyone went quiet.<br>As soon as the alarm went off at [[place]], everyone ran.</p>" +
          "<p>The longer the opener, the more the comma matters. Without it, the reader can run straight past the join and get a different meaning.</p>" } } },

    { type: "mc", topic: "Commas after openers",
      q: vers(["[[Opener]] everything, went quiet.", "[[Opener]], everything went quiet.", "[[Opener]] everything went quiet,"]) + "<p>Which version puts the comma in the right place?</p>",
      options: ["A", "B", "C"], answer: 1, fixed: true,
      slips: { 0: "A puts the comma inside the main sentence. Find where the opener ends.", 2: "C puts a comma at the end. A sentence ends with a full stop." },
      hint: "Where does the opener end and the main sentence begin?",
      why: "\"[[Opener]]\" is the opener. The comma goes straight after it, then the main sentence: \"everything went quiet.\"",
      ez: { hint: "Where does the opener end?", why: "Comma after the opener: \"Later that night,\"",
        slips: { 0: "That comma splits \"the lights went out\".", 2: "\"Later that night\" is one opener." } },
      lv: { mild: {
        q: vers(["Later that night the lights, went out.", "Later that night, the lights went out.", "Later, that night the lights went out."]) + "<p>Which version puts the comma in the right place?</p>",
        slips: { 0: "A puts the comma in the middle of \"the lights went out\".", 2: "C splits the opener in half. \"Later that night\" is all one opener." },
        why: "\"Later that night\" is the opener. Comma straight after it, then \"the lights went out.\"" } } },

    { type: "multi", topic: "Commas after openers",
      q: "None of these have their commas yet. Pick <b>every</b> sentence that needs a comma after an opener.",
      options: ["Later that night we checked the bags again.", "We checked the bags.", "Slowly the door creaked open.", "Bonnie barked.", "At [[place]] the lights were still on."],
      answers: [0, 2, 4],
      hint: "Look for words at the start that say when, where or how.",
      why: "\"Later that night\", \"Slowly\" and \"At [[place]]\" are openers, so each needs a comma after it. The other two start straight with the main sentence.",
      ez: { q: "Pick <b>every</b> sentence that needs a comma after an opener.", hint: "Look for when, where or how words first.", why: "\"Later that night\", \"Slowly\" and \"At [[place]]\" are openers." },
      lv: { spicy: {
        options: ["As soon as the bell rang we grabbed our bags.", "We grabbed our bags as soon as the bell rang.", "Without a word [[who]] walked out.", "Bonnie barked.", "If you are cold there are blankets in the cupboard."],
        answers: [0, 2, 4],
        hint: "Is there a scene setting part <b>before</b> the main sentence?",
        why: "\"As soon as the bell rang\", \"Without a word\" and \"If you are cold\" come first, so each needs a comma. In the second sentence the same idea comes <b>after</b> the main part, so no comma is needed." } } },

    { type: "mc", topic: "Commas after openers", explain: true,
      q: "<p class=\"a2task\">After eating Bonnie went to sleep.</p><p>Why does this sentence badly need a comma after \"After eating\"?</p>",
      fig: NAP,
      options: ["Without it, it sounds like someone ate Bonnie.", "Commas make sentences longer.", "Every sentence needs a comma.", "Because Bonnie is a name."],
      answer: 0,
      slips: { 1: "Commas are not about length. Read it aloud without a pause: who got eaten?", 2: "Plenty of sentences have no commas. This one needs it for the meaning.", 3: "Names get capital letters, not commas. Read it without a pause." },
      hint: "Read it aloud with no pause at all. What does it sound like?",
      why: "\"After eating Bonnie\" sounds like a meal. \"After eating, Bonnie went to sleep\" makes it clear that Bonnie did the eating. A comma can change the meaning.",
      ez: { q: "<p class=\"a2task\">After eating Bonnie went to sleep.</p><p>Why does this need a comma after \"After eating\"?</p>", hint: "Read it aloud with no pause.",
        why: "Without it, Bonnie sounds like dinner! The comma fixes it.",
        slips: { 1: "Read it with no pause. Who got eaten?", 2: "Not every sentence needs one. This one does.", 3: "Names get capitals, not commas." } } },

    { type: "mc", topic: "Commas after openers",
      q: vers(["As soon as the [[who]] heard the noise, everyone ran.", "As soon as, the [[who]] heard the noise everyone ran.", "As soon as the [[who]] heard, the noise everyone ran."]) + "<p>The opener here is long. Which version gets the comma right?</p>",
      options: ["A", "B", "C"], answer: 0, fixed: true,
      slips: { 1: "B puts the comma after \"As soon as\", but the opener carries on until \"noise\".", 2: "C cuts the opener too early: \"the noise everyone ran\" makes no sense." },
      hint: "Cover the opener with your thumb. \"Everyone ran.\" should be left.",
      why: "The whole opener is \"As soon as the [[who]] heard the noise\". The comma goes after it, leaving \"everyone ran.\"",
      ez: { hint: "Cover the opener. What is left?", slips: { 1: "\"After lunch\" is one opener.", 2: "That comma is inside the main sentence." } },
      lv: { mild: {
        q: vers(["After lunch, we went to [[place]].", "After, lunch we went to [[place]].", "After lunch we, went to [[place]]."]) + "<p>Which version gets the comma right?</p>",
        slips: { 1: "B splits \"After lunch\" in half. It is all one opener.", 2: "C puts the comma inside the main sentence." },
        hint: "Cover the opener with your thumb. \"We went to [[place]].\" should be left.",
        why: "\"After lunch\" is the opener. The comma goes after it." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Apostrophes that squash", title: "Apostrophes for missing letters",
      fig: SQUASH,
      ez: { title: "Missing letters", html: "<p>Squash 2 words. An <b>apostrophe</b> goes where letters drop out.</p><p><b>do not</b> becomes <b>don't</b>.</p>" },
      html: "<p>When two words squash into one, some letters drop out. An <b>apostrophe</b> goes where they were.</p>" +
        "<p class=\"a2task\">do not = don't &middot; I am = I'm &middot; they are = they're &middot; could not = couldn't &middot; we will = we'll</p>" +
        "<p>The apostrophe marks the <b>gap</b>, not the join. So it is couldn't (the o is gone), not could'nt.</p>",
      lv: { spicy: { html: "<p>When words squash together, an <b>apostrophe</b> marks where letters dropped out: don't, they're, couldn't.</p>" +
        "<p>Three that catch people out:</p>" +
        "<p class=\"a2task\"><b>it's</b> only ever means \"it is\" or \"it has\". The owning word <b>its</b> has no apostrophe (its tail, its name).<br><b>would've</b> is short for \"would have\". It sounds like \"would of\", but that is never right.<br><b>won't</b> is short for \"will not\". The odd one out: the letters change too.</p>" } } },

    { type: "match", topic: "Apostrophes that squash",
      q: "Match each pair of words to its short form.",
      pairs: [["do not", "don't"], ["I am", "I'm"], ["they are", "they're"], ["could not", "couldn't"], ["we will", "we'll"]],
      hint: "Say the short form out loud. Which two words does it come from?",
      ez: { hint: "Say it out loud. Which 2 words?", why: "The apostrophe sits where letters were." },
      why: "In each one, the apostrophe sits where the missing letters were.",
      lv: { spicy: { pairs: [["it is", "it's"], ["would have", "would've"], ["will not", "won't"], ["they had", "they'd"], ["shall not", "shan't"]],
        why: "The apostrophe sits where letters dropped out. Won't and shan't change a little more than most, but the apostrophe still marks the gap." } } },

    { type: "text", topic: "Apostrophes that squash",
      q: "Write \"could not\" as one shortened word.",
      need: [["couldn't"]], exact: true,
      model: "couldn't",
      slips: [[["could'nt"], "Nearly. The apostrophe goes where the o was taken out: couldn't."], [["couldnt"], "The letters are right. Pop an apostrophe in where the o was."]],
      hint: "Which letter drops out of \"not\"?",
      why: "The o in \"not\" drops out, so the apostrophe goes there: <b>couldn't</b>.",
      ez: { slips: [[["do'nt"], "Nearly. It goes where the o was."], [["dont"], "Add an apostrophe where the o was."]] },
      lv: { mild: { q: "Write \"do not\" as one shortened word.",
          need: [["don't"]], model: "don't",
          slips: [[["do'nt"], "Nearly. The apostrophe goes where the o was taken out: don't."], [["dont"], "The letters are right. Pop an apostrophe in where the o was."]],
          why: "The o in \"not\" drops out, so the apostrophe goes there: <b>don't</b>." },
        spicy: { q: "Someone has written: \"I would of come if I had known.\" Write the correct short form of \"would have\".",
          need: [["would've"]], model: "would've",
          slips: [[["would of"], "That is the one that sounds right but is not. It comes from \"would have\"."], [["wouldve"], "The letters are right. Add the apostrophe where \"ha\" dropped out."], [["would'of", "woul'd"], "The apostrophe goes where \"ha\" dropped out of \"have\"."]],
          hint: "Squash \"would have\". Which letters drop out?",
          why: "\"Would have\" squashes to <b>would've</b>. Said quickly it sounds like \"would of\", which is how that mistake sneaks in." } } },

    { type: "mc", topic: "Apostrophes that squash",
      q: "<p class=\"a2task\">___ going to rain later.</p><p>Which word fills the gap?</p>",
      options: ["It's", "Its"], answer: 0, fixed: true,
      slips: { 1: "Try saying \"it is\" in the gap: \"It is going to rain later.\" That works, so it needs the apostrophe." },
      hint: "Does \"it is\" fit in the gap?",
      why: "\"It is going to rain\" makes sense, so the short form is <b>it's</b>.",
      ez: { slips: { 1: "Try \"it is\" in the gap. It works, so it's." } },
      lv: { spicy: {
        q: "<p class=\"a2task\">The dog next door wagged ___ tail at us. (Bonnie could not join in. No tail.)</p><p>Which word fills the gap?</p>",
        options: ["its", "it's", "its'"], answer: 0, fixed: true,
        slips: { 1: "Try \"it is\" in the gap: \"wagged it is tail\". That does not work, so no apostrophe.", 2: "There is no such word as its'. The owning word is just its." },
        hint: "Does \"it is\" fit in the gap?",
        why: "\"Wagged it is tail\" makes no sense, so this is the owning word <b>its</b>, with no apostrophe. Think of his and hers: no apostrophes there either." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Apostrophes that own", title: "Apostrophes for owning",
      fig: OWN,
      ez: { title: "Apostrophes for owning", html: "<p>Add <b>'s</b> to show who owns it: <b>Bonnie's lead</b>.</p><p>Just more than one? No apostrophe: two dogs.</p>" },
      html: "<p>An apostrophe also shows that something <b>belongs</b> to someone.</p>" +
        "<p><b>One owner:</b> add <b>'s</b>. The [[who]]'s [[thing]]. Bonnie's lead. Jay's eyebrows.</p>" +
        "<p>Plurals that just mean \"more than one\" do <b>not</b> need an apostrophe: two [[whos]], three dogs, lots of birds.</p>",
      lv: { mild: { html: "<p>An apostrophe can show that something <b>belongs</b> to someone. Add <b>'s</b> to the owner.</p>" +
          "<p class=\"a2task\">Bonnie's lead &middot; Jay's bird book &middot; the [[who]]'s [[thing]]</p>" +
          "<p>Just more than one of something? <b>No</b> apostrophe: two dogs, three birds, lots of [[whos]].</p>" },
        spicy: { html: "<p>An apostrophe shows <b>owning</b>. Where it goes depends on the owner:</p>" +
          "<p><b>One owner:</b> add 's. The [[who]]'s [[thing]].<br><b>More than one owner, ending in s:</b> add just ' after the s. The [[whos]]' [[thing]].<br><b>More than one owner, not ending in s:</b> add 's. The children's coats, the people's choice.</p>" +
          "<p>Trick: write the owner first (one [[who]], or lots of [[whos]]), then add the apostrophe to the end of that word.</p>" } } },

    { type: "mc", topic: "Apostrophes that own",
      q: "How do you write \"the [[thing]] belonging to the [[who]]\"?",
      options: ["the [[who]]'s [[thing]]", "the [[who]]s [[thing]]", "the [[who]]s' [[thing]]"],
      answer: 0,
      slips: { 1: "Without an apostrophe it looks like more than one [[who]], with nobody owning anything.", 2: "s' is for more than one owner. There is only one [[who]] here." },
      hint: "One owner: add 's.",
      why: "One [[who]] owns them, so add 's: <b>the [[who]]'s [[thing]]</b>.",
      ez: { slips: { 1: "No apostrophe means nobody owns anything.", 2: "s' is for lots of owners. There is 1 [[who]]." } },
      lv: { spicy: { q: "How do you write \"the [[thing]] belonging to all the [[whos]]\"?",
        options: ["the [[whos]]' [[thing]]", "the [[whos]]'s [[thing]]", "the [[who]]'s [[thing]]", "the [[whos]] [[thing]]"],
        slips: { 1: "Close. With a plural that already ends in s, just add the apostrophe: one s is enough.", 2: "That would be one [[who]]. Here there are lots.", 3: "It needs an apostrophe to show they own them." },
        hint: "Write the owners first: [[whos]]. Then add the apostrophe to the end.",
        why: "The owners are the [[whos]], which already ends in s. Add the apostrophe after it: <b>the [[whos]]' [[thing]]</b>." } } },

    { type: "sort", topic: "Apostrophes that own",
      q: "Sort them. Is it one owner, or more than one?",
      buckets: ["One owner", "More than one owner"],
      cards: [["the [[who]]'s [[thing]]", 0], ["the [[whos]]' [[thing]]", 1], ["Bonnie's lead", 0], ["the birds' nests", 1], ["Jay's eyebrows", 0], ["the dogs' bowls", 1]],
      hint: "Look at where the apostrophe sits: before the s, or after it?",
      why: "'s on a singular word means one owner. s' means more than one owner.",
      ez: { q: "Sort them. Owning, or just more than one?", why: "Owning gets an apostrophe. More than one does not." },
      lv: { mild: { q: "Sort them. Does it need an apostrophe, or is it just more than one?",
          buckets: ["Needs an apostrophe (owning)", "No apostrophe (just more than one)"],
          cards: [["Bonnie's lead", 0], ["Jay's bird book", 0], ["three dogs", 1], ["two [[whos]]", 1], ["the [[who]]'s [[thing]]", 0], ["lots of birds", 1]],
          hint: "Is something belonging to someone?",
          why: "Bonnie's lead, Jay's book and the [[who]]'s [[thing]] all belong to someone. Three dogs and lots of birds just means more than one." },
        spicy: { cards: [["the [[who]]'s [[thing]]", 0], ["the [[whos]]' [[thing]]", 1], ["the children's coats", 1], ["the bird's nest", 0], ["the birds' nests", 1], ["the people's choice", 1]],
          why: "The [[who]]'s and the bird's are one owner. [[Whos]]' and birds' are plurals ending in s. Children's and people's are plurals that do not end in s, so they take 's but still mean more than one owner." } } },

    { type: "text", topic: "Apostrophes that own",
      q: "Write \"the [[thing]] belonging to the [[who]]\" the short way, with an apostrophe.",
      need: [["the [[who]]'s [[thing]]", W("who") + "'s [[thing]]"]], exact: true,
      model: "the [[who]]'s [[thing]]",
      slips: [[[W("who") + "s'"], "That is the form for more than one [[who]]. There is just one here, so 's."], [[W("who") + "s [[thing]]"], "The words are right. Add an apostrophe to show the [[who]] owns them."]],
      hint: "One owner: [[who]] + 's.",
      why: "<b>the [[who]]'s [[thing]]</b>. One owner, so 's.",
      ez: { q: "Write \"the lead belonging to Bonnie\" with an apostrophe.",
        slips: [[["bonnies lead"], "Add an apostrophe to show it is hers."], [["bonnies'"], "There is only 1 Bonnie, thankfully. So 's."]] },
      lv: { mild: { q: "Write \"the lead belonging to Bonnie\" the short way, with an apostrophe.",
          need: [["Bonnie's lead"]], model: "Bonnie's lead",
          slips: [[["bonnies lead"], "The words are right. Add an apostrophe to show the lead is hers."], [["bonnies'"], "There is only one Bonnie (thankfully), so it is 's."]],
          hint: "Bonnie + 's, then the thing she owns.",
          why: "<b>Bonnie's lead</b>. One owner, so 's." },
        spicy: { q: "Write \"the [[thing]] belonging to all the [[whos]]\" the short way, with an apostrophe.",
          need: [["the [[whos]]' [[thing]]", W("whos") + "' [[thing]]"]], model: "the [[whos]]' [[thing]]",
          slips: [[[W("whos") + "'s"], "One s is enough. [[Whos]] already ends in s, so just add the apostrophe after it."], [[W("who") + "'s"], "That would mean one [[who]]. Here there are lots of owners."], [[W("whos") + " [[thing]]"], "The words are right. Add the apostrophe to show they belong to the [[whos]]."]],
          hint: "Owners first: [[whos]]. Already ends in s? Just add '.",
          why: "<b>the [[whos]]' [[thing]]</b>. The owners are [[whos]], which ends in s, so the apostrophe goes after it." } } },

    { type: "mc", topic: "Apostrophes that own",
      q: "One of these has an apostrophe it does not need. Which one?",
      options: ["Two [[whos]]' arrived late.", "The [[who]]'s [[thing]] were muddy.", "Jay's hair was as messy as ever.", "We're nearly there."],
      answer: 0,
      slips: { 1: "That one is right: one [[who]] owns them.", 2: "That one is right: the hair belongs to Jay. (It is very messy.)", 3: "That one is right: we're is short for we are." },
      hint: "Which one is just \"more than one\", with nothing being owned?",
      why: "\"Two [[whos]]\" just means more than one. Nothing belongs to them in that sentence, so no apostrophe.",
      ez: { q: "Which one has an apostrophe it does not need?", hint: "Which one owns nothing?", why: "\"Two [[whos]]\" owns nothing. So no apostrophe.",
        slips: { 2: "That one is right: it is Jay's hair. Very messy." } },
      lv: { spicy: {
        options: ["The childrens' coats were soaking.", "The [[whos]]' [[thing]] were ready.", "Its name was on the label.", "They're late again."],
        slips: { 1: "That one is right: [[whos]] ends in s, so just the apostrophe.", 2: "That one is right: its, the owning word, has no apostrophe.", 3: "That one is right: they're is short for they are." },
        hint: "Write the owner first. Does \"children\" end in s?",
        why: "\"Children\" does not end in s, so it is <b>children's</b>, not childrens'. Write the owner, then add the apostrophe to the end of that word." } } }
  ],

  realWorld: {
    title: "Signs, menus and messages",
    html: "<p>Look at shop signs, menus and posters and you will spot commas and apostrophes everywhere, and plenty of mistakes too. Once you know them, you will never unsee \"Chip's and cheese's\".</p>" +
      "<p>For our big question, <b>if we could time travel, should we?</b>, imagine leaving a note for someone in the future. You will not be there to explain what you meant, so the commas and apostrophes have to do the explaining for you.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to a time portal, looking at a sign">' + A.portal(80, 75, 56) + A.jay(250, 52, 0.85, "wow") +
      A.bubble(296, 6, 118, 52, "Chip's? Who\nis Chip?", 306) + '</svg>'
  },

  ez: {
    realWorld: { title: "Signs, menus and messages", html: "<p>Shop signs and menus are full of commas and apostrophes.</p><p>And mistakes, like \"Chip's\"!</p>" },
    make: { intro: "Design a sign for a shop or club. Get the apostrophe right.", fields: [{ label: "Name, with an apostrophe" }, { label: "What it sells, as a list" }] }
  },

  make: {
    title: "Design a sign",
    intro: "Design a sign for a shop, a club or a stall. Get the apostrophe and the commas just right. Put it on the wall, or send it to Jay.",
    fields: [
      { id: "name", label: "Name of the place (with an apostrophe)", ph: "Bonnie's Biscuit Bar", max: 30 },
      { id: "list", label: "What it sells or does (a list)", ph: "Biscuits, bones, blankets and naps", max: 60 },
      { id: "open", label: "Opening times", ph: "Open Monday, Wednesday and Friday", max: 46 }
    ],
    svg: function(v){
      function e(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ while(x.length > n){ if(cur.trim()) out.push(cur.trim()); out.push(x.slice(0, n)); x = x.slice(n); cur = ""; } if((cur + " " + x).trim().length > n){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max); }
      var nm = wrap(v.name, 20, 2), ls = wrap(v.list, 34, 2), op = wrap(v.open, 40, 2);
      var aw = "";
      for(var k = 0; k < 8; k++) aw += '<path d="M' + (20 + k * 70) + ' 20h70v54q-35 22 -70 0z" fill="' + (k % 2 ? "#ffffff" : "#e04848") + '" stroke="#141a33" stroke-width="2"/>';
      var y = Math.round(236 - (nm.length * 40 + 6 + ls.length * 28 + 10 + op.length * 22) / 2 + 28);
      var out = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#f4efe6"/>' + aw +
        '<rect x="40" y="96" width="520" height="280" rx="14" fill="#1f5c4a" stroke="#141a33" stroke-width="5"/>' +
        '<rect x="54" y="110" width="492" height="252" rx="8" fill="none" stroke="#e8d27a" stroke-width="2"/>';
      nm.forEach(function(t){ out += '<text x="300" y="' + y + '" text-anchor="middle" font-family="Georgia,serif" font-size="34" font-weight="700" fill="#ffd23f">' + e(t) + '</text>'; y += 40; });
      y += 6;
      ls.forEach(function(t){ out += '<text x="300" y="' + y + '" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="20" fill="#ffffff">' + e(t) + '</text>'; y += 28; });
      y += 10;
      op.forEach(function(t){ out += '<text x="300" y="' + y + '" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="16" fill="#e8d27a">' + e(t) + '</text>'; y += 22; });
      return out + '</svg>';
    }
  }
};
})();
