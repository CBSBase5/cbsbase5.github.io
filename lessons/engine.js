/* ==========================================================
   Base 5 - Lessons presenter engine
   Opened as /lessons/present.html?l=<lesson id>[&p=<part>][&slot=<slot id>]
   or /lessons/present.html?slot=<slot id> (opens that slot's next
   lesson, from /lessons/plan.js).

   Every lesson runs the same shape:
     cover, warm ups (Wordle and Would you rather; one, alternating,
     in short slots), recap, objective (formal and Today's mission),
     hook, explore, explain (a quick check after each), real world,
     group exit vote, confidence, the driving question, the end.

   Board controls
     Next: right arrow, Page Down, space, a clicker. Back: left arrow,
     Page Up. Next first builds a slide, reveals an answer or checks
     a sort, then moves on.
     M menu, D draw, T pause the section timer, R random picker,
     P (or B, or full stop) calm pause screen, N prompt line,
     S snap the board for evidence, F full screen, E edit (staff).

   The lesson file sets window.B5LESSON (see /lessons/l/ac-arch-1.js
   for the shape). Edits made on the board stay on this device until
   copied into the file as window.B5LESSON.edits.
   ASCII only.
   ========================================================== */
(function(){
"use strict";
var PLAN = window.B5LESSONS, A = window.LART, d = document;
var W = 1600, H = 900;

/* ---------- small helpers ---------- */
function $(s, r){ return (r || d).querySelector(s); }
function $$(s, r){ return Array.prototype.slice.call((r || d).querySelectorAll(s)); }
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function getPath(o, p){ return p.split(".").reduce(function(x, k){ return x == null ? x : x[k]; }, o); }
function setPath(o, p, v){ var ks = p.split("."), last = ks.pop(); var t = ks.reduce(function(x, k){ return x == null ? x : x[k]; }, o); if(t != null) t[last] = v; }
function toast(msg){ var t = d.createElement("div"); t.className = "toast"; t.textContent = msg; d.body.appendChild(t); setTimeout(function(){ t.remove(); }, 2600); }
function ascii(s){ return s.replace(/[^\x09\x0a\x0d\x20-\x7e]/g, function(c){ return "\\u" + ("000" + c.charCodeAt(0).toString(16)).slice(-4); }); }
function reduced(){ return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; }
function q(name){ var m = location.search.match(new RegExp("[?&]" + name + "=([^&]*)")); return m ? decodeURIComponent(m[1]) : ""; }

/* ---------- which lesson ---------- */
var meta = null, part = 0, slotId = q("slot");
/* preview: look through a lesson without it counting. Nothing is marked
   taught, nothing is sent, and the lesson does not move the slot on. */
/* look: a student looking back at a lesson from the HQ activity that
   goes with it. Works like preview (nothing counts or gets sent), with
   a plain ending and no staff bits. */
var LOOK = q("look") === "1";
var PREVIEW = q("preview") === "1" || LOOK;
(function(){
  var id = q("l"), p = parseInt(q("p"), 10) || 0;
  if(!id && slotId){
    var nx = PLAN.nextFor(slotId);
    if(nx && nx.lesson){ id = nx.lesson.id; p = nx.part; }
  }
  meta = PLAN.byLesson[id] || null;
  part = meta && meta.split ? (p >= 1 && p <= 3 ? p : 1) : 0;
})();
var pillar = meta ? PLAN.pillars[meta.pillar] : PLAN.pillars.ac;
var series = meta ? PLAN.bySeries[meta.target] : null;
var root = d.documentElement;
root.style.setProperty("--pc", pillar.colour); root.style.setProperty("--pd", pillar.deep); root.style.setProperty("--pw", pillar.wash);

var lesson = null, frames = [], fi = 0, editing = false;
var S = { step: {}, rev: {}, tally: {}, sort: {}, word: {}, recap: {}, strokes: {}, snaps: {}, surprise: {} };
var EDITKEY = "b5.lessons.edit." + (meta ? meta.id : "none");

/* ---------- load the lesson file ---------- */
function start(){
  scale(); window.addEventListener("resize", scale);
  if(!meta){ showMissing("That lesson is not on the list.", "Pick one from the Lessons page."); return; }
  d.title = meta.title + " - Lessons - Base 5";
  if(!meta.ready){ showMissing(meta.title, "This lesson is on its way. The plan has it, the slides are still being made."); return; }
  var sc = d.createElement("script");
  sc.src = "/lessons/l/" + meta.id + ".js?v=" + (window.B5LESSONS_V || 1);
  sc.onload = function(){
    lesson = window.B5LESSON;
    if(!lesson){ showMissing(meta.title, "The lesson file did not load."); return; }
    applyEdits();
    build();
    var at = q("f") === "end" ? frames.length - 1 : parseInt(q("f"), 10);
    go(isNaN(at) ? 0 : Math.max(0, Math.min(frames.length - 1, at)), true);
    if(LOOK) toast("Looking back at the lesson. Arrow keys or tap the arrows to move.");
    else if(PREVIEW) toast("Preview: nothing here counts or gets sent.");
  };
  sc.onerror = function(){ showMissing(meta.title, "The lesson file could not be found at /lessons/l/" + meta.id + ".js."); };
  d.head.appendChild(sc);
}
function showMissing(title, line){
  $("#stage .frames").innerHTML = '<div class="frame enter"><div class="cover"><div><p class="kicker">Lessons</p><h1>' + esc(title) + '</h1><p class="sline">' + esc(line) + '</p>' +
    '<p class="sline"><a href="/lessons/" style="color:inherit">Back to Lessons</a></p></div><div class="artbox plain">' + A.svg("-120 -80 260 170", A.bonnie(0, 0, 1.3, "sleep")) + '</div></div></div>';
}

function applyEdits(){
  var all = {}, k, local = {};
  try{ local = JSON.parse(localStorage.getItem(EDITKEY) || "{}") || {}; }catch(e){}
  if(lesson.edits) for(k in lesson.edits) all[k] = lesson.edits[k];
  for(k in local) all[k] = local[k];
  for(k in all) setPath(lesson, k, all[k]);
}

/* ---------- the running order ---------- */
var SECNAME = { start: "Warm up", hook: "Hook", explore: "Explore", explain: "Explain", finish: "Finish" };
var secMins = {};
function build(){
  var F = [], L = lesson, mins = L.mins || (part ? 15 : 45), short = part || mins <= 30;
  F.push({ k: "cover", sec: "start" });
  if(!part || part === 1){
    var w = L.warm || {}, wordleFirst = (meta.n % 2) === 1;
    if(short){
      if(w.wordle && (wordleFirst || !w.wyr)) F.push({ k: "wordle", sec: "start", d: w.wordle, path: "warm.wordle" });
      else if(w.wyr) F.push({ k: "wyr", sec: "start", d: w.wyr, path: "warm.wyr" });
    } else {
      if(w.wordle) F.push({ k: "wordle", sec: "start", d: w.wordle, path: "warm.wordle" });
      if(w.wyr) F.push({ k: "wyr", sec: "start", d: w.wyr, path: "warm.wyr" });
    }
    if(L.recap) F.push({ k: "recap", sec: "start", d: L.recap, path: "recap" });
    if(L.objective) F.push({ k: "objective", sec: "start", d: L.objective, path: "objective" });
    secMins.start = L.startMins || (short ? 4 : 7);
  } else {
    if(L.objective) F.push({ k: "objective", sec: "start", d: L.objective, path: "objective", again: true });
    secMins.start = 1;
  }
  (L.sections || []).forEach(function(s, si){
    if(part && s.part !== part) return;
    var p = "sections." + si;
    secMins[s.kind] = s.mins || 10;
    F.push({ k: "sech", sec: s.kind, d: s, path: p });
    (s.slides || []).forEach(function(sl, j){ F.push({ k: sl.type || "show", sec: s.kind, d: sl, path: p + ".slides." + j }); });
    if(s.check) F.push({ k: "predict", sec: s.kind, d: s.check, path: p + ".check", check: true });
  });
  if(!part || part === 3){
    if(L.realworld) F.push({ k: "realworld", sec: "finish", d: L.realworld, path: "realworld" });
    (L.exit || []).forEach(function(x, i){ F.push({ k: "predict", sec: "finish", d: x, path: "exit." + i, exit: i + 1, of: L.exit.length }); });
    F.push({ k: "confidence", sec: "finish" });
    if(L.driving) F.push({ k: "driving", sec: "finish", d: L.driving, path: "driving" });
    secMins.finish = L.finishMins || (part ? 5 : 6);
  }
  F.push({ k: "end", sec: "finish" });
  frames = F;
}

/* ---------- editable text ---------- */
function E(path, tag, cls, fallback){
  var v = getPath(lesson, path);
  if(v == null) v = fallback == null ? "" : fallback;
  return "<" + tag + (cls ? ' class="' + cls + '"' : "") + ' data-e="' + path + '"' + (editing ? ' contenteditable="true"' : "") + ">" + v + "</" + tag + ">";
}

/* ---------- drawing each kind of frame ----------
   In art and lists, anything with data-s="n" appears on build step n. */
var R = {};

/* a Cultural Calendar tie in: lesson.cc is a list of { week, line }, shown
   only when the lesson is taught in that week (weeks in /data/term.js) */
function ccNow(){
  try{ var w = window.B5TERM && B5TERM.currentWeek(), name = w && w.cc; if(!name || !lesson || !lesson.cc) return null;
    return lesson.cc.filter(function(c){ return c.week === name; })[0] || null; }catch(e){ return null; }
}
R.cover = function(f){
  var c = lesson.cover || {};
  var pb = part ? '<span class="partbadge">Part ' + part + ' of 3: ' + PLAN.parts[part] + '</span>' : "";
  var era = eraNow();
  return '<div class="cover"><div>' +
    '<p class="kicker">' + esc(series.title) + ' &middot; lesson ' + meta.n + ' of ' + meta.of + '</p>' +
    E("title", "h1", "", meta.title) +
    E("cover.line", "p", "sline", meta.line) + pb +
    (ccNow() ? '<p class="cctag">This week: ' + esc(ccNow().week) + '</p>' : "") +
    (era ? '<p class="sn" style="margin-top:22px">Time machine set to ' + esc(era.year) + (era.label ? ': ' + esc(era.label) : "") + '</p>' : "") +
    '</div><div class="artbox' + (c.art ? "" : " plain") + '">' + (c.art || A.svg("-140 -110 300 220", A.bonnie(10, 10, 1.6, "happy"))) + '</div></div>';
};

R.wordle = function(f){
  var w = wordState(f), word = String(f.d.word || "").toUpperCase(), n = word.length;
  var rows = "";
  for(var r = 0; r < 6; r++){
    var g = w.rows[r], cur = r === w.rows.length && !w.done ? w.cur : "";
    rows += '<div class="wrow" style="grid-template-columns:repeat(' + n + ',86px)">';
    for(var c = 0; c < n; c++){
      if(g) rows += '<div class="wt ' + g.res[c] + (g.fresh ? " flip" : "") + '" style="animation-delay:' + (c * 0.12) + 's">' + g.word[c] + '</div>';
      else rows += '<div class="wt' + (cur[c] ? " full" : "") + '">' + (cur[c] || "") + '</div>';
    }
    rows += '</div>';
  }
  w.rows.forEach(function(g){ g.fresh = false; });
  var keys = ["QWERTYUIOP", "ASDFGHJKL", "+ZXCVBNM-"].map(function(line){
    return '<div>' + line.split("").map(function(k){
      if(k === "+") return '<button data-k="Enter" style="min-width:110px">Go</button>';
      if(k === "-") return '<button data-k="Backspace" style="min-width:110px">Del</button>';
      return '<button data-k="' + k + '" class="' + (w.keys[k] || "") + '">' + k + '</button>';
    }).join("") + '</div>';
  }).join("");
  var msg = w.done ? (w.won ? "Got it in " + w.rows.length + "." : "It was <b>" + word + "</b>.") : (w.clue ? E(f.path + ".hint", "span", "") : "Type a " + n + " letter word and press Go.");
  return '<p class="kicker">Warm up</p><div class="wlay"><div class="wgrid">' + rows + '</div><div>' +
    '<h1 class="ft small" style="margin:0 0 6px">Wordle</h1><div class="wmsg">' + msg + '</div>' +
    '<div class="kb">' + keys + '</div>' +
    '<div class="wside"><button class="sbtn" data-act="clue">Give us a clue</button><button class="sbtn" data-act="showword">Show the word</button>' +
    (w.done && w.won ? '<svg viewBox="-40 -50 200 110" style="width:250px">' + A.jay(0, 10, 1.2) + A.bubble(42, -40, 120, 50, "Outrageous.", 18) + '</svg>' : "") + '</div></div></div>';
};

R.wyr = function(f){
  var t = tally(f, 2), rev = S.rev[fi];
  var o = function(i, key){
    var art = f.d["art" + key] || "";
    return '<div class="opt' + (rev ? " chosen" : "") + '" data-o="' + i + '">' + E(f.path + "." + key.toLowerCase(), "div", "", "") + (art ? art : "") +
      '<div class="count">' + (t[i] || "") + '</div><button class="minus" data-minus="' + i + '" aria-label="One less">-</button></div>';
  };
  return '<p class="kicker">Warm up</p><h1 class="ft small" style="margin-bottom:12px">Would you rather...</h1>' +
    '<div class="wyr">' + o(0, "A") + '<div class="or">or</div>' + o(1, "B") + '</div>' + bar(t) +
    (rev && f.d.twist ? '<div class="why"><span class="who">The twist</span>' + E(f.path + ".twist", "span", "") + '</div>' : "") +
    (!rev ? '<p class="hint">Tap a side for each person. Next shows the twist.</p>' : "");
};

R.recap = function(f){
  var shown = S.recap[fi] || {};
  return '<p class="kicker">' + E(f.path + ".kicker", "span", "", lesson.recapKicker || (meta.n === 1 ? "Already in your head" : "Last time")) + '</p>' +
    E(f.path + ".title", "h1", "ft small", meta.n === 1 ? "What do you already know?" : "Quick recap") +
    '<div class="recap">' + (f.d.items || []).map(function(it, i){
      return '<div class="rc" data-rc="' + i + '">' + E(f.path + ".items." + i + ".q", "div", "q") +
        (shown[i] ? E(f.path + ".items." + i + ".a", "div", "a") : '<div class="tap">Tap, or press next, to see</div>') + '</div>';
    }).join("") + '</div>';
};

R.objective = function(f){
  if(f.again){
    return '<p class="kicker">Where we got to</p><h1 class="ft small">' + esc(meta.title) + '</h1>' +
      '<div class="obj"><div class="card"><h2>We are learning to</h2>' + E(f.path + ".formal", "p", "") + '</div>' +
      '<div class="card m"><h2>Today\'s mission</h2>' + E(f.path + ".mission", "p", "") + '</div></div>' +
      '<p class="succ"><span class="partbadge">Today: ' + PLAN.parts[part] + '</span></p>';
  }
  var sc = f.d.success || [];
  return '<p class="kicker">Today</p><h1 class="ft small">' + esc(meta.title) + '</h1>' +
    '<div class="obj"><div class="card"><h2>We are learning to</h2>' + E(f.path + ".formal", "p", "") + '</div>' +
    '<div class="card m"><h2>Today\'s mission</h2>' + E(f.path + ".mission", "p", "") + '</div></div>' +
    (sc.length ? '<div class="succ"><h3>By the end, you might be able to</h3><ul>' + sc.map(function(s, i){ return E(f.path + ".success." + i, "li", ""); }).join("") + '</ul></div>' : "");
};

var SECART = {
  hook: '<g class="bob"><path d="M200 30V230Q200 330 130 330Q70 330 70 270V240" fill="none" stroke="#0a2f38" stroke-width="34" stroke-linecap="round"/><path d="M200 30V230Q200 330 130 330Q70 330 70 270V240" fill="none" stroke="#d9dde0" stroke-width="18" stroke-linecap="round"/><path d="M70 240L40 290M70 240L100 286" stroke="#0a2f38" stroke-width="14" stroke-linecap="round"/><circle cx="200" cy="30" r="22" fill="#ffc247" stroke="#0a2f38" stroke-width="8"/><path d="M200 8V-60" stroke="#0a2f38" stroke-width="6"/></g>',
  explore: '<g class="bob"><rect x="20" y="120" width="250" height="200" rx="16" fill="#f3e7c9" stroke="#0a2f38" stroke-width="10" transform="rotate(-8 145 220)"/><path d="M60 250q60 -80 120 -30t80 -40" stroke="#e2557a" stroke-width="10" stroke-dasharray="20 14" fill="none"/><circle cx="250" cy="170" r="95" fill="#bfe6ef" fill-opacity=".85" stroke="#0a2f38" stroke-width="20"/><path d="M200 130q20 -24 50 -20" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M318 238L392 312" stroke="#0a2f38" stroke-width="40" stroke-linecap="round"/><path d="M318 238L392 312" stroke="#ef7724" stroke-width="22" stroke-linecap="round"/></g>',
  explain: '<g class="bob"><path d="M200 30a120 120 0 0 0 -72 216q22 18 22 46v30h100v-30q0 -28 22 -46a120 120 0 0 0 -72 -216z" fill="#ffc247" stroke="#0a2f38" stroke-width="14"/><path d="M160 150q40 -40 80 0M180 220v-60M220 220v-60" stroke="#ef7724" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M150 340h100M160 372h80" stroke="#0a2f38" stroke-width="18" stroke-linecap="round"/><path d="M130 80q-30 30 -20 70" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity=".8"/></g><g stroke="#fffdf8" stroke-width="12" stroke-linecap="round"><path d="M40 60l-30 -24M360 60l30 -24M20 170h-40M380 170h40"/></g>'
};
R.sech = function(f){
  return '<div class="sech"><span class="kicker">' + (part ? "Part " + part + " of 3" : "Next up") + '</span>' +
    '<div class="big">' + SECNAME[f.d.kind] + '</div>' +
    E(f.path + ".title", "div", "sub", "") +
    '<div class="mins">About ' + (f.d.mins || 10) + ' minutes</div>' +
    '<svg class="secart" viewBox="-30 -70 460 470">' + (SECART[f.d.kind] || "") + '</svg></div>';
};

R.show = function(f){
  var s = f.d, has = s.text || (s.pts && s.pts.length);
  var txt = (s.text ? E(f.path + ".text", "p", "lead") : "") +
    (s.pts ? '<ul class="pts">' + s.pts.map(function(x, i){ return E(f.path + ".pts." + i, "li", "", "").replace("<li ", '<li data-s="' + (s.build ? (s.ptsFrom || 1) + i : 0) + '" '); }).join("") + '</ul>' : "") +
    (s.note ? E(f.path + ".note", "p", "note") : "") +
    (s.photo && s.art ? photo(s.photo).replace('class="polaroid"', 'class="polaroid inflow"') : "");
  var art = (s.art || s.photo) ? '<div class="artbox' + (s.plainArt ? " plain" : "") + (s.photo && !s.art ? " photoonly" : "") + '">' + (s.art || photo(s.photo)) + '</div>' : "";
  if(s.stack && art) return (s.kicker ? E(f.path + ".kicker", "p", "kicker") : "") + E(f.path + ".title", "h1", "ft small", "") + txt + '<div class="stackart">' + art.replace('class="artbox', 'style="width:' + (s.artWidth || 1200) + 'px" class="artbox') + '</div>';
  var body = !art ? '<div class="cols one">' + '<div>' + txt + '</div></div>'
    : !has ? '<div class="cols one" style="justify-items:center">' + art.replace('class="artbox', 'style="width:' + (s.artWidth || 1100) + 'px" class="artbox') + '</div>'
    : '<div class="cols' + (s.wideArt ? " wide-art" : "") + '">' + (s.artLeft ? art + '<div>' + txt + '</div>' : '<div>' + txt + '</div>' + art) + '</div>';
  return (s.kicker ? E(f.path + ".kicker", "p", "kicker") : "") + E(f.path + ".title", "h1", "ft" + (s.small ? " small" : ""), "") + body;
};

R.predict = function(f){
  var s = f.d, opts = s.opts || [], t = tally(f, opts.length), rev = S.rev[fi];
  var kick = f.exit ? "Exit vote " + f.exit + " of " + f.of : f.check ? "Quick check" : (s.kicker || "Guess first");
  var cls = opts.length === 3 ? "n3" : opts.length === 2 ? "n2" : opts.length >= 4 ? "n4" : "";
  var big = opts.some(function(o){ return o && o.art; });
  if(big && opts.length === 4) cls = "n4\" style=\"grid-template-columns:repeat(4,1fr)";
  return '<p class="kicker">' + kick + '</p>' + (s.title ? E(f.path + ".title", "h1", "ft small", "") : "") +
    E(f.path + ".q", "p", "lead", "") +
    '<div class="opts ' + cls + '">' + opts.map(function(o, i){
      var right = rev && s.a === i, txt = typeof o === "string" ? o : o.t;
      return '<div class="opt' + (right ? " right" : rev && s.a != null ? " dim" : "") + '" data-o="' + i + '">' +
        '<span class="letter">' + "ABCDEF".charAt(i) + '</span>' +
        (typeof o === "string" ? E(f.path + ".opts." + i, "span", "") : (o.art || "") + E(f.path + ".opts." + i + ".t", "span", "")) +
        '<div class="tally">' + dots(t[i]) + '</div><button class="minus" data-minus="' + i + '" aria-label="One less">-</button></div>';
    }).join("") + '</div>' +
    (opts.length && !rev ? bar(t) : "") +
    (rev && s.why ? '<div class="why"><span class="who">' + (s.a != null ? "The answer" : "So") + '</span>' + E(f.path + ".why", "span", "") + '</div>' : "") +
    (!rev ? '<p class="hint">Tap an answer for each person, or just talk it through. Next shows the answer.</p>' : "");
};

R.vote = function(f){
  var s = f.d, t = tally(f, s.opts.length);
  var cls = s.opts.length === 3 ? "n3" : s.opts.length === 2 ? "n2" : "n4";
  return '<p class="kicker">' + (s.kicker ? esc(s.kicker) : "Group vote") + '</p>' + (s.title ? E(f.path + ".title", "h1", "ft small", "") : "") + E(f.path + ".q", "p", "lead", "") +
    '<div class="opts ' + cls + '">' + s.opts.map(function(o, i){
      var txt = typeof o === "string" ? E(f.path + ".opts." + i, "span", "") : (o.art || "") + E(f.path + ".opts." + i + ".t", "span", "");
      return '<div class="opt" data-o="' + i + '"><span class="letter">' + "ABCDEF".charAt(i) + '</span>' + txt + '<div class="tally">' + dots(t[i]) + '</div><button class="minus" data-minus="' + i + '" aria-label="One less">-</button></div>';
    }).join("") + '</div>' + bar(t) + (s.why ? (S.rev[fi] ? '<div class="why"><span class="who">So</span>' + E(f.path + ".why", "span", "") + '</div>' : "") : "");
};

R.sort = function(f){
  var s = f.d, st = sortState(f), nb = s.bins.length;
  function card(i){
    var c = s.cards[i], cls = st.checked ? (st.was[i] === c.b ? " ok" : st.was[i] >= 0 ? " moved" : "") : "";
    return '<div class="card2' + cls + (st.sel === i ? " chosen" : "") + '" data-c="' + i + '"' + (st.sel === i ? ' style="outline:4px solid #ef7724"' : "") + '>' + E(f.path + ".cards." + i + ".t", "span", "") + '</div>';
  }
  var tray = s.cards.map(function(c, i){ return st.place[i] < 0 ? card(i) : ""; }).join("");
  var bins = s.bins.map(function(b, bi){
    return '<div class="bin" data-b="' + bi + '">' + E(f.path + ".bins." + bi, "h3", "") + '<div class="cards">' +
      s.cards.map(function(c, i){ return st.place[i] === bi ? card(i) : ""; }).join("") + '</div></div>';
  }).join("");
  return '<p class="kicker">' + (s.kicker ? esc(s.kicker) : "Sort it") + '</p>' + (s.title ? E(f.path + ".title", "h1", "ft small", "") : "") +
    E(f.path + ".q", "p", "lead", "") +
    '<div class="sortwrap">' + (tray || !st.checked ? '<div class="tray" data-b="-1">' + tray + '</div>' : "") +
    '<div class="bins n' + nb + '">' + bins + '</div>' +
    '<div class="sortmsg">' + (st.checked ? sortLine(st, s) + (s.why ? " " + getPath(lesson, f.path + ".why") : "") : '<span class="small">Drag a card into a box, or tap a card then tap a box. Next checks them.</span>') + '</div></div>';
};

R.media = function(f){
  var s = f.d, inner = s.yt ? '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(s.yt) + '?rel=0" title="' + esc(s.title || "Video") + '" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>'
    : '<img src="' + esc(s.img) + '" alt="' + esc(s.alt || "") + '" onerror="this.replaceWith(Object.assign(document.createElement(\'p\'),{className:\'lead\',textContent:\'(The picture would not load. Describe it instead!)\'}))">';
  return (s.kicker ? '<p class="kicker">' + esc(s.kicker) + '</p>' : "") + E(f.path + ".title", "h1", "ft small", "") +
    '<div class="media">' + inner + (s.caption ? E(f.path + ".caption", "p", "lead", "") : "") + (s.credit ? '<p class="credit">' + esc(s.credit) + '</p>' : "") + '</div>';
};

R.realworld = function(f){
  var s = f.d;
  return '<div class="rw"><div><span class="tag">Where you\'d meet this</span>' + E(f.path + ".title", "h1", "ft small", "") + E(f.path + ".text", "p", "lead", "") +
    (ccNow() ? '<p class="ccline"><span class="cctag">' + esc(ccNow().week) + '</span> ' + esc(ccNow().line) + '</p>' : "") + '</div>' +
    '<div class="artbox' + (s.photo && !s.art ? " photoonly" : "") + '">' + (s.art || (s.photo ? "" : A.svg("-140 -110 300 220", A.bonnie(10, 10, 1.6, "happy")))) + photo(s.photo) + '</div></div>';
};
/* a real photo: fills the box on its own, or pinned to the corner of a drawing like a polaroid. Tap to enlarge. */
function photo(p){
  if(!p || !p.src) return "";
  return '<figure class="polaroid" title="Tap to make it bigger"><img src="' + esc(p.src) + '" alt="' + esc(p.alt || "") + '" loading="eager" onerror="this.closest(\'figure\').remove()">' +
    (p.caption ? '<figcaption>' + esc(p.caption) + '</figcaption>' : "") + (p.credit ? '<small>' + esc(p.credit) + '</small>' : "") + '</figure>';
}

R.confidence = function(f){
  var t = tally(f, 6);
  var words = ["Not yet", "A tiny bit", "Getting there", "Mostly", "Pretty sure", "Could teach it"];
  return '<p class="kicker">How sure are we?</p><h1 class="ft small">Fist to five</h1>' +
    '<p class="lead">Hold up a fist for not yet, five fingers for could teach it. No wrong answers, and passing is fine.</p>' +
    '<div class="conf">' + words.map(function(w, i){
      return '<div class="opt" data-o="' + i + '">' + A.hand(i) + '<b>' + i + '</b><span>' + w + '</span><div class="tally">' + dots(t[i]) + '</div><button class="minus" data-minus="' + i + '" aria-label="One less">-</button></div>';
    }).join("") + '</div>';
};

R.driving = function(f){
  var s = f.d, opts = s.opts || ["Yes", "No", "It depends"], t = tally(f, opts.length);
  return '<p class="kicker">The big question</p><h1 class="ft">' + esc(window.B5TERM ? B5TERM.question : "If we could time travel, should we?") + '</h1>' +
    E(f.path + ".angle", "p", "lead", "") +
    '<div class="opts ' + (opts.length === 3 ? "n3" : "n2") + '">' + opts.map(function(o, i){
      return '<div class="opt" data-o="' + i + '"><span class="letter">' + "ABC".charAt(i) + '</span>' + E(f.path + ".opts." + i, "span", "", o) + '<div class="tally">' + dots(t[i]) + '</div><button class="minus" data-minus="' + i + '" aria-label="One less">-</button></div>';
    }).join("") + '</div>' + bar(t) + '<p class="hint">Passing is a fine answer too.</p>';
};

function dropTitle(){
  var t = "";
  if(window.B5LIB && B5LIB.items) B5LIB.items.forEach(function(it){ if(it.slug === meta.drop) t = it.title; });
  return t;
}

/* the ending for a student looking back */
function lookEnd(){
  var t = dropTitle(), nextPart = part && part < 3;
  var href = location.pathname + "?l=" + meta.id + "&p=" + (part + 1) + "&look=1";
  return '<p class="kicker">That\'s the lesson</p><h1 class="ft small">Thanks for looking back.</h1>' +
    '<div class="endgrid"><div class="panel"><h2>' + (nextPart ? "There's more" : "Goes with") + '</h2>' +
      (nextPart ? '<p>This lesson has three parts. <a href="' + esc(href) + '">Part ' + (part + 1) + ' (' + PLAN.parts[part + 1].toLowerCase() + ')</a> is next, if you fancy it.</p>' : "") +
      (t ? '<p>The HQ activity <b>' + esc(t) + '</b> goes with this lesson. It\'s in your folder whenever you want it.</p>' : "") +
      '<div class="row" style="margin-top:12px"><button class="sbtn go" data-act="lookback">Back to the activity</button></div>' +
    '</div><div class="panel" style="display:flex;align-items:center;justify-content:center">' + svgWrap(A.bonnie(120, 90, 0.9, "happy"), "0 0 240 160") + '</div></div>';
}
function svgWrap(inner, vb){ return '<svg viewBox="' + vb + '" style="width:100%;max-width:320px">' + inner + '</svg>'; }

R.end = function(f){
  if(LOOK) return lookEnd();
  var st = PLAN.load(), k = PLAN.partKey(meta.id, part), done = !!st.taught[k];
  var n = PLAN.together(st), total = 0;
  PLAN.series.forEach(function(se){ total += se.lessons.length; });
  var here = hereList(), snaps = Object.keys(S.snaps).length;
  var nextInSeries = null;
  if(part && part < 3) nextInSeries = "Part " + (part + 1) + " (" + PLAN.parts[part + 1].toLowerCase() + ") next PHSE slot.";
  else if(meta.n < meta.of) nextInSeries = "Next in this series: " + series.lessons[meta.n].title + ".";
  return '<p class="kicker">' + (part && part < 3 ? "That's part " + part + " done" : "That's the lesson") + '</p>' +
    '<h1 class="ft small">' + (part && part < 3 ? "Good stopping point." : "Done. Nice one, Base 5.") + '</h1>' +
    '<div class="endgrid"><div class="panel"><h2>Lessons together</h2>' +
      '<p><b style="font-size:48px;font-family:var(--display)">' + n + '</b> of ' + total + ' this half term. Every one adds a plank to the bridge.</p>' + bridge(n, total) +
      '<div class="row" style="margin-top:12px">' + (PREVIEW ? '<span class="partbadge" style="margin:0">Preview: not counted</span>' : '<button class="sbtn' + (done ? "" : " go") + '" data-act="taught">' + (done ? "Marked as taught today. Undo?" : "Mark as taught") + '</button>') +
        '<button class="sbtn" data-act="reset">Reset this lesson</button></div>' +
      (nextInSeries ? '<p class="small" style="margin-top:10px">' + esc(nextInSeries) + '</p>' : "") +
      (dropTitle() ? '<p class="small" style="margin-top:6px">Goes with the HQ activity <b>' + esc(dropTitle()) + '</b>, on screen or on paper.</p>' : "") +
    '</div><div class="panel"><h2>Who was here?</h2>' +
      '<p class="small">Tap anyone who wasn\'t here.</p>' +
      '<div class="chips">' + PLAN.hqs.map(function(h){ var out = here.indexOf(h[0]) < 0; return '<button class="chip' + (out ? " out" : " on") + '" data-here="' + h[0] + '">' + h[0] + '</button>'; }).join("") + '</div>' +
      '<div class="row"><button class="sbtn go" data-act="buddy">Send to Buddy</button><button class="sbtn" data-act="evidence">Save the board' + (snaps ? " (" + snaps + " snaps)" : "") + '</button><button class="sbtn" data-act="folder">Copy folder rows</button></div>' +
      '<p class="small" id="sendmsg" style="margin-top:10px">' + (S.sent ? esc(S.sent) : 'Send to Buddy writes a Learning note for everyone here, linked to step ' + (meta.step || "?") + ' of ' + esc(series.title) + ', with the board picture. Anyone who missed it gets the matching HQ activity in their folder.') + '</p>' +
    '</div></div>';
};

function bridge(n, total){
  var w = 700, x0 = 60, x1 = 640, plank = (x1 - x0) / total, g = "";
  g += '<path d="M20 96H680" stroke="#0a2f38" stroke-width="4"/>';
  g += '<rect x="44" y="20" width="16" height="80" rx="4" fill="#0a2f38"/><rect x="640" y="20" width="16" height="80" rx="4" fill="#0a2f38"/>';
  g += '<path d="M52 24Q350 110 648 24" stroke="#007291" stroke-width="4" fill="none"/>';
  for(var i = 0; i < total; i++){
    var x = x0 + i * plank, on = i < n;
    g += '<rect x="' + (x + 1.5).toFixed(1) + '" y="76" width="' + (plank - 3).toFixed(1) + '" height="14" rx="3" fill="' + (on ? "var(--pc)" : "none") + '" stroke="#0a2f38" stroke-width="2"' + (on ? "" : ' stroke-dasharray="3 3" opacity=".45"') + '/>';
  }
  var bx = x0 + Math.max(0, n - 0.5) * plank;
  g += A.bonnie(Math.min(Math.max(bx, 90), 620), 44, 0.42, "happy");
  return '<svg class="bridge" viewBox="0 0 ' + w + ' 110">' + g + '</svg>';
}

/* ---------- tallies ---------- */
function tally(f, n){ var t = S.tally[fi]; if(!t){ t = S.tally[fi] = []; for(var i = 0; i < n; i++) t.push(0); } return t; }
function dots(n){ var s = ""; for(var i = 0; i < (n || 0); i++) s += "<i></i>"; return s; }
function bar(t){
  var sum = t.reduce(function(a, b){ return a + b; }, 0);
  if(!sum) return '<div class="bar" style="opacity:.35"></div>';
  return '<div class="bar">' + t.map(function(v){ return '<span style="flex-grow:' + v + '"></span>'; }).join("") + '</div>';
}

/* ---------- wordle ---------- */
function wordState(f){
  var w = S.word[fi];
  if(!w) w = S.word[fi] = { rows: [], cur: "", done: false, won: false, keys: {}, clue: false };
  return w;
}
function score(guess, word){
  var res = [], left = {}, i;
  for(i = 0; i < word.length; i++){ if(guess[i] === word[i]) res[i] = "g"; else left[word[i]] = (left[word[i]] || 0) + 1; }
  for(i = 0; i < word.length; i++){
    if(res[i]) continue;
    if(left[guess[i]]){ res[i] = "y"; left[guess[i]]--; } else res[i] = "x";
  }
  return res;
}
function wordKey(k){
  var f = frames[fi], w = wordState(f), word = String(f.d.word || "").toUpperCase();
  if(w.done) return false;
  if(k === "Enter"){
    if(w.cur.length !== word.length){ var row = $$(".wrow", frameEl())[w.rows.length]; if(row){ row.classList.remove("shake"); void row.offsetWidth; row.classList.add("shake"); } return true; }
    var res = score(w.cur, word), rank = { g: 3, y: 2, x: 1 };
    w.cur.split("").forEach(function(ch, i){ if(!w.keys[ch] || rank[res[i]] > rank[w.keys[ch]]) w.keys[ch] = res[i]; });
    w.rows.push({ word: w.cur, res: res, fresh: true });
    if(w.cur === word){ w.done = true; w.won = true; }
    else if(w.rows.length >= 6){ w.done = true; }
    w.cur = "";
    redraw();
    if(w.won){ var lastRow = $$(".wrow", frameEl())[w.rows.length - 1]; setTimeout(function(){ burst(lastRow); }, 650); }
    return true;
  }
  if(k === "Backspace"){ w.cur = w.cur.slice(0, -1); redraw(); return true; }
  if(/^[A-Za-z]$/.test(k) && w.cur.length < word.length){ w.cur += k.toUpperCase(); redraw(); return true; }
  return /^[A-Za-z]$/.test(k);
}

/* ---------- sorting ---------- */
function sortState(f){
  var s = S.sort[fi];
  if(!s){ s = S.sort[fi] = { place: f.d.cards.map(function(){ return -1; }), checked: false, sel: -1, was: [] }; }
  return s;
}
function sortLine(st, s){
  var placed = 0, right = 0;
  st.was.forEach(function(b, i){ if(b >= 0){ placed++; if(b === s.cards[i].b) right++; } });
  if(!placed) return "Here is where they all go.";
  var line = right + " of the " + placed + " the group sorted " + (placed === 1 ? "was" : "were") + " in the right box.";
  if(right < placed) line += " The amber ones have hopped across.";
  if(placed < s.cards.length) line += " The rest have been put in for you.";
  return line;
}
function placeCard(i, b){ var f = frames[fi], st = sortState(f); if(st.checked) return; st.place[i] = b; st.sel = -1; redraw(); }
function checkSort(){
  var f = frames[fi], st = sortState(f);
  st.was = st.place.slice();
  f.d.cards.forEach(function(c, i){ st.place[i] = c.b; });
  st.checked = true; redraw();
}
function bindSort(el){
  var drag = null;
  $$(".card2", el).forEach(function(c){
    c.addEventListener("pointerdown", function(e){
      if(editing || sortState(frames[fi]).checked) return;
      e.preventDefault();
      var i = +c.dataset.c, sc = currentScale(), r = c.getBoundingClientRect();
      drag = { i: i, el: c, sx: e.clientX, sy: e.clientY, moved: false, sc: sc };
      c.setPointerCapture(e.pointerId);
    });
    c.addEventListener("pointermove", function(e){
      if(!drag || drag.el !== c) return;
      var dx = (e.clientX - drag.sx) / drag.sc, dy = (e.clientY - drag.sy) / drag.sc;
      if(Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
      if(drag.moved){ c.style.transform = "translate(" + dx + "px," + dy + "px) rotate(-3deg)"; c.style.zIndex = 30; c.style.position = "relative"; c.style.pointerEvents = "none";
        $$(".bin", el).forEach(function(b){ b.classList.remove("over"); });
        var under = d.elementFromPoint(e.clientX, e.clientY), bin = under && under.closest && under.closest(".bin");
        if(bin) bin.classList.add("over");
      }
    });
    c.addEventListener("pointerup", function(e){
      if(!drag || drag.el !== c) return;
      var dd = drag; drag = null;
      if(!dd.moved){ var st = sortState(frames[fi]); st.sel = st.sel === dd.i ? -1 : dd.i; redraw(); return; }
      var under = d.elementFromPoint(e.clientX, e.clientY), bin = under && under.closest && under.closest("[data-b]");
      if(bin) placeCard(dd.i, +bin.dataset.b); else redraw();
    });
  });
  $$("[data-b]", el).forEach(function(b){
    b.addEventListener("click", function(e){
      var st = sortState(frames[fi]);
      if(st.sel < 0 || e.target.closest(".card2")) return;
      placeCard(st.sel, +b.dataset.b);
    });
  });
}

/* ---------- build steps ---------- */
function maxStep(el){ var m = 0; $$("[data-s]", el).forEach(function(x){ m = Math.max(m, +x.getAttribute("data-s") || 0); }); return m; }
function showSteps(el){
  var s = S.step[fi] || 0;
  $$("[data-s]", el).forEach(function(x){
    var n = +x.getAttribute("data-s") || 0;
    x.classList.add("st");
    x.classList.toggle("hide", n > s);
  });
}

/* ---------- going between frames ---------- */
function frameEl(){ return $("#stage .frame"); }
function pending(){
  var f = frames[fi], el = frameEl();
  if(!f || !el) return false;
  if(f.k === "show" || f.k === "realworld") return (S.step[fi] || 0) < maxStep(el);
  if(f.k === "predict") return !S.rev[fi] && (f.d.a != null || f.d.why);
  if(f.k === "vote") return !S.rev[fi] && !!f.d.why;
  if(f.k === "wyr") return !S.rev[fi] && !!f.d.twist;
  if(f.k === "sort") return !sortState(f).checked;
  if(f.k === "recap"){ var sh = S.recap[fi] || {}; return (f.d.items || []).some(function(x, i){ return !sh[i]; }); }
  return false;
}
var SPARKC = ["#ffc247", "#ef7724", "#007291", "#e2557a", "#20adca", "#fffdf8"];
function burst(el){
  if(!el || reduced()) return;
  var st = $("#stage"), sr = st.getBoundingClientRect(), r = el.getBoundingClientRect(), sc = sr.width / W;
  var cx = (r.left + r.width / 2 - sr.left) / sc, cy = (r.top + r.height / 2 - sr.top) / sc;
  for(var i = 0; i < 18; i++){
    var sp = d.createElement("span"), a = Math.random() * Math.PI * 2, dist = 140 + Math.random() * 160;
    sp.className = "spark " + (i % 2 ? "s" : "c");
    sp.style.left = (cx - 11) + "px"; sp.style.top = (cy - 11) + "px";
    sp.style.background = SPARKC[i % SPARKC.length];
    sp.style.setProperty("--dx", Math.round(Math.cos(a) * dist) + "px"); sp.style.setProperty("--dy", Math.round(Math.sin(a) * dist) + "px");
    sp.style.animationDelay = (Math.random() * 0.12) + "s";
    st.appendChild(sp);
    (function(x){ setTimeout(function(){ x.remove(); }, 1300); })(sp);
  }
}
function doPending(){
  var f = frames[fi];
  if(f.k === "show" || f.k === "realworld"){ S.step[fi] = (S.step[fi] || 0) + 1; showSteps(frameEl()); return; }
  if(f.k === "sort"){ checkSort(); burst($(".bins", frameEl())); return; }
  if(f.k === "recap"){ var sh = S.recap[fi] = S.recap[fi] || {}; for(var i = 0; i < f.d.items.length; i++) if(!sh[i]){ sh[i] = true; break; } redraw(); return; }
  S.rev[fi] = true; redraw();
  burst($(".opt.right", frameEl()) || (f.k === "wyr" ? $(".why", frameEl()) : null));
}
function next(){ if(pending()) doPending(); else if(fi < frames.length - 1) go(fi + 1); }
function prev(){ if(fi > 0) go(fi - 1); }

function worthSnapping(i){
  var f = frames[i]; if(!f) return false;
  if(S.strokes[i] && S.strokes[i].length) return true;
  if(S.tally[i] && S.tally[i].some(function(v){ return v > 0; })) return true;
  if(S.sort[i] && S.sort[i].place.some(function(p){ return p >= 0; })) return true;
  if(S.word[i] && S.word[i].rows.length) return true;
  return false;
}

function go(n, first){
  if(!first && worthSnapping(fi)) snap(fi, true);
  var prevSec = frames[fi] && frames[fi].sec;
  fi = n;
  render(true);
  var f = frames[fi];
  if(f.sec !== prevSec || first) timerEnter(f.sec);
  if(f.k === "end") autoTaught();
  try{
    var qs = location.search.replace(/^\?/, "").split("&").filter(function(x){ return x && x.indexOf("f=") !== 0; });
    qs.push("f=" + fi);
    history.replaceState(null, "", location.pathname + "?" + qs.join("&"));
  }catch(e){}
}
function redraw(){ render(false); }

function render(enter){
  var f = frames[fi], box = $("#stage .frames");
  $$("#stage > .surp, #stage > .bubble, #stage > .spark").forEach(function(x){ x.remove(); });
  var html = (R[f.k] || R.show)(f);
  box.innerHTML = '<div class="frame' + (enter && !reduced() ? " enter" : "") + '" data-k="' + f.k + '">' + html + '</div>';
  var el = frameEl();
  showSteps(el);
  bindFrame(el, f);
  topStrip();
  drawInk();
  sayLine();
  surprise(el, f);
  if(editing) bindEdit(el);
}

function bindFrame(el, f){
  $$(".opt[data-o]", el).forEach(function(o){
    o.addEventListener("click", function(e){
      if(editing && e.target.closest("[data-e]")) return;
      if(e.target.closest(".minus")) return;
      var t = S.tally[fi]; if(!t) return;
      t[+o.dataset.o]++; redraw();
    });
  });
  $$(".minus", el).forEach(function(m){
    m.addEventListener("click", function(e){ e.stopPropagation(); var t = S.tally[fi]; var i = +m.dataset.minus; if(t && t[i] > 0){ t[i]--; redraw(); } });
  });
  $$(".rc", el).forEach(function(c){
    c.addEventListener("click", function(e){ if(editing && e.target.closest("[data-e]")) return; var sh = S.recap[fi] = S.recap[fi] || {}; sh[+c.dataset.rc] = !sh[+c.dataset.rc]; redraw(); });
  });
  $$(".kb button", el).forEach(function(b){ b.addEventListener("click", function(){ wordKey(b.dataset.k); }); });
  $$("[data-act]", el).forEach(function(b){ b.addEventListener("click", function(){ act(b.dataset.act); }); });
  $$("[data-here]", el).forEach(function(b){ b.addEventListener("click", function(){ toggleHere(b.dataset.here); redraw(); }); });
  if(f.k === "sort") bindSort(el);
  $$(".polaroid", el).forEach(function(p){ p.addEventListener("click", function(e){ if(editing) return; e.stopPropagation(); p.classList.toggle("big"); }); });
}

function act(a){
  var f = frames[fi];
  if(a === "clue"){ wordState(f).clue = true; redraw(); }
  else if(a === "showword"){ var w = wordState(f); w.done = true; redraw(); }
  else if(a === "lookback"){ if(history.length > 1) history.back(); else location.href = "/"; }
  else if(a === "taught" && PREVIEW){ toast("Preview: lessons are not marked as taught."); }
  else if(a === "reset") resetLesson();
  else if(a === "taught"){
    var st = PLAN.load(), k = PLAN.partKey(meta.id, part);
    PLAN.mark(meta.id, part, !st.taught[k]); redraw();
  }
  else if(a === "folder") folderRows();
  else if(a === "buddy") sendBuddy();
  else if(a === "evidence") evidence();
}
/* back to the start, as if it had never been opened today: untaught (if it was
   marked today), who was here forgotten, every vote, sort, drawing and snap cleared */
function resetLesson(){
  if(!PREVIEW){
    var st = PLAN.load(), k = PLAN.partKey(meta.id, part);
    if(st.taught[k] === PLAN.iso()) delete st.taught[k];
    if(st.here2) delete st.here2[k];
    PLAN.save(st);
  }
  S = { step: {}, rev: {}, tally: {}, sort: {}, word: {}, recap: {}, strokes: {}, snaps: {}, surprise: {} };
  window.B5Present.state = S;
  TM.left = {}; TM.sec = "";
  ["#menu", "#picker"].forEach(function(id){ var o = $(id); if(o) o.hidden = true; });
  fi = 0; go(0, true);
  toast(PREVIEW ? "Preview reset." : "Lesson reset. Not counted as taught.");
}
function autoTaught(){
  if(PREVIEW) return;
  var st = PLAN.load(), k = PLAN.partKey(meta.id, part);
  if(!st.taught[k]){ PLAN.mark(meta.id, part, true); redraw(); toast("Marked as taught today."); }
}

/* ---------- the top strip ---------- */
function topStrip(){
  var f = frames[fi];
  $("#pchip").textContent = pillar.name;
  $("#ltitle").textContent = (LOOK ? "LOOKING BACK \u00b7 " : PREVIEW ? "PREVIEW \u00b7 " : "") + meta.title + (part ? " \u00b7 part " + part : "");
  $("#secpill").textContent = SECNAME[f.sec] || "";
  var dots = "";
  for(var i = 0; i < frames.length; i++) dots += '<i class="' + (i < fi ? "done" : i === fi ? "on" : "") + '"></i>';
  $("#dots").innerHTML = dots;
  var era = eraNow();
  $("#era").innerHTML = era ? "Time machine: <b>" + esc(era.year) + "</b>" : "";
}
function eraNow(){
  try{ var w = window.B5TERM && B5TERM.currentWeek(); return w && w.era ? w.era : null; }catch(e){ return null; }
}

/* ---------- section timer ---------- */
var TM = { sec: "", left: {}, running: false, last: 0 };
function timerEnter(sec){
  TM.sec = sec;
  if(TM.left[sec] == null) TM.left[sec] = (secMins[sec] || 5) * 60;
  TM.running = true; TM.last = Date.now(); paintTimer();
}
function paintTimer(){
  var el = $("#timer"), s = TM.left[TM.sec];
  if(s == null){ el.textContent = ""; return; }
  var neg = s < 0, a = Math.abs(Math.round(s));
  el.textContent = (neg ? "+" : "") + Math.floor(a / 60) + ":" + ("0" + (a % 60)).slice(-2);
  el.classList.toggle("paused", !TM.running);
  el.classList.toggle("over", neg);
  el.title = neg ? "Over the planned time. No rush." : TM.running ? "Click to pause" : "Paused. Click to carry on";
}
setInterval(function(){
  var now = Date.now();
  if(TM.running && TM.left[TM.sec] != null && !$("#pause:not([hidden])")) TM.left[TM.sec] -= (now - TM.last) / 1000;
  TM.last = now; paintTimer();
}, 500);
function timerToggle(){ TM.running = !TM.running; TM.last = Date.now(); paintTimer(); }

/* ---------- drawing over the board ---------- */
var ink = { on: false, pen: 0, cur: null };
var PENS = [{ c: "#0a2f38", w: 6, a: 1 }, { c: "#ef7724", w: 7, a: 1 }, { c: "#007291", w: 7, a: 1 }, { c: "#ffc247", w: 30, a: 0.45 }];
function drawInk(){
  var cv = $("#ink"), cx = cv.getContext("2d");
  cx.clearRect(0, 0, W, H);
  (S.strokes[fi] || []).forEach(function(s){ stroke(cx, s); });
}
function stroke(cx, s){
  if(!s.p.length) return;
  cx.save(); cx.globalAlpha = s.a; cx.strokeStyle = s.c; cx.lineWidth = s.w; cx.lineCap = "round"; cx.lineJoin = "round";
  cx.beginPath(); cx.moveTo(s.p[0][0], s.p[0][1]);
  for(var i = 1; i < s.p.length; i++) cx.lineTo(s.p[i][0], s.p[i][1]);
  if(s.p.length === 1) cx.lineTo(s.p[0][0] + 0.1, s.p[0][1]);
  cx.stroke(); cx.restore();
}
function inkMode(on){
  ink.on = on == null ? !ink.on : on;
  $("#ink").classList.toggle("on", ink.on);
  $("#pens").hidden = !ink.on;
  $("#bDraw").classList.toggle("on", ink.on);
}
function bindInk(){
  var cv = $("#ink");
  function pt(e){ var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; }
  cv.addEventListener("pointerdown", function(e){
    if(!ink.on) return;
    var p = PENS[ink.pen];
    ink.cur = { c: p.c, w: p.w, a: p.a, p: [pt(e)] };
    (S.strokes[fi] = S.strokes[fi] || []).push(ink.cur);
    cv.setPointerCapture(e.pointerId); drawInk();
  });
  cv.addEventListener("pointermove", function(e){ if(ink.cur){ ink.cur.p.push(pt(e)); drawInk(); } });
  cv.addEventListener("pointerup", function(){ ink.cur = null; });
  $$("#pens [data-pen]").forEach(function(b){
    b.addEventListener("click", function(){ ink.pen = +b.dataset.pen; $$("#pens [data-pen]").forEach(function(x){ x.classList.toggle("on", x === b); }); });
  });
  $("#pens .clr").addEventListener("click", function(){ S.strokes[fi] = []; drawInk(); });
}

/* ---------- pause, picker, menu, prompt line ---------- */
function pause(on){
  var p = $("#pause");
  p.hidden = on == null ? !p.hidden : !on;
}
/* who was here for this lesson (or this part): tapped on the last slide, kept for today.
   Until tapped, everyone except anyone at a session running alongside this slot (Horizon). */
function hereKey(){ return PLAN.partKey(meta.id, part); }
function hereList(){
  var st = PLAN.load(), t = PLAN.iso(), h = (st.here2 || {})[hereKey()];
  if(h && h.date === t && h.who) return h.who.slice();
  var all = PLAN.hqs.map(function(x){ return x[0]; }), T = window.B5TERM;
  try{
    var dk = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date().getDay()];
    var slot = PLAN.slots.filter(function(x){ return x.series.indexOf(meta.target) > -1 && x.days.indexOf(dk) > -1; })[0];
    var row = slot && (T.timetable[dk] || []).filter(function(r){ return r[2] === slot.session; })[0];
    if(row) (T.alongsideOn(dk) || []).forEach(function(a){
      if(T.mins(a.start) < T.mins(row[1]) && T.mins(a.end) > T.mins(row[0])) a.who.forEach(function(w){ var i = all.indexOf(w); if(i > -1) all.splice(i, 1); });
    });
  }catch(e){}
  return all;
}
function toggleHere(w){
  var st = PLAN.load(), list = hereList(), i = list.indexOf(w);
  if(i > -1) list.splice(i, 1); else list.push(w);
  st.here2 = st.here2 || {}; st.here2[hereKey()] = { date: PLAN.iso(), who: list }; PLAN.save(st);
}
function picker(){
  var ov = $("#picker"), pk = $(".pk", ov);
  var st = PLAN.load(), happy = (st.pick && st.pick.date === PLAN.iso()) ? st.pick.who : [];
  pk.innerHTML = PLAN.hqs.map(function(h){ return '<button class="' + (happy.indexOf(h[0]) > -1 ? "in" : "") + '" data-p="' + h[0] + '">' + h[0] + '</button>'; }).join("");
  $$("button", pk).forEach(function(b){
    b.addEventListener("click", function(){
      var s2 = PLAN.load(), list = (s2.pick && s2.pick.date === PLAN.iso()) ? s2.pick.who : [];
      var i = list.indexOf(b.dataset.p);
      if(i > -1) list.splice(i, 1); else list.push(b.dataset.p);
      s2.pick = { date: PLAN.iso(), who: list }; PLAN.save(s2);
      b.classList.toggle("in", i < 0); b.classList.remove("won");
    });
  });
  $("#pickmsg").textContent = "Tap anyone happy to be picked today. Only they go in the spin.";
  ov.hidden = false;
}
function spin(){
  var btns = $$("#picker .pk button.in");
  if(!btns.length){ $("#pickmsg").textContent = "Nobody is in the spin yet. Tap anyone happy to be picked."; return; }
  $$("#picker .pk button").forEach(function(b){ b.classList.remove("won", "hot"); });
  var steps = 14 + Math.floor(Math.random() * btns.length), i = Math.floor(Math.random() * btns.length), n = 0;
  if(reduced()) n = steps - 1;
  (function tick(){
    btns.forEach(function(b){ b.classList.remove("hot"); });
    var b = btns[(i + n) % btns.length];
    if(n >= steps - 1){ b.classList.add("won"); $("#pickmsg").textContent = b.dataset.p + "! Fancy it? Passing is fine."; return; }
    b.classList.add("hot"); n++;
    setTimeout(tick, 60 + n * n * 1.6);
  })();
}
function menu(){
  var ov = $("#menu"), box = $(".menu", ov), last = "", h = "";
  frames.forEach(function(f, i){
    if(f.sec !== last){ h += '<div class="sg">' + SECNAME[f.sec] + '</div>'; last = f.sec; }
    h += '<button class="mi' + (i === fi ? " cur" : "") + '" data-go="' + i + '">' + (i + 1) + ". " + esc(frameName(f)) + '</button>';
  });
  var url = location.pathname + "?" + location.search.replace(/^\?/, "").split("&").filter(function(x){ return x && x.indexOf("f=") !== 0 && x.indexOf("preview=") !== 0; }).join("&");
  if(!LOOK) h += '<div class="sg">This lesson</div><button class="mi" data-reset="1">Reset this lesson (start again, not counted)</button>' +
    '<a href="' + esc(url + (PREVIEW ? "" : "&preview=1")) + '">' + (PREVIEW ? "Leave preview and teach it for real" : "Switch to preview (nothing counts)") + '</a>';
  h += LOOK ? '<div class="sg">Elsewhere</div><a href="/">Base 5 home</a>' : '<div class="sg">Elsewhere</div><a href="/lessons/">The Lessons library</a><a href="/">Base 5 home</a>';
  box.innerHTML = h;
  $$("[data-go]", box).forEach(function(b){ b.addEventListener("click", function(){ ov.hidden = true; go(+b.dataset.go); }); });
  $$("[data-reset]", box).forEach(function(b){ b.addEventListener("click", function(){ resetLesson(); }); });
  ov.hidden = false;
}
function frameName(f){
  var t = { cover: "Title", wordle: "Wordle", wyr: "Would you rather", recap: "Recap", objective: "Objective", sech: SECNAME[f.sec], confidence: "Fist to five", driving: "The big question", end: "The end" }[f.k];
  if(t) return t;
  if(f.exit) return "Exit vote " + f.exit;
  if(f.check) return "Quick check";
  var s = f.d || {};
  return String(s.title || s.q || f.k).replace(/<[^>]+>/g, "");
}
function sayLine(){
  var f = frames[fi], s = (f.d && f.d.say) || "";
  if(!s){
    s = { cover: "Settle in. Read the title together, ask what they think it is about.", objective: "Read the mission. Ask if anything sounds interesting or odd.",
      confidence: "Hands up together on three, or tap for anyone who'd rather not show.", driving: "Anyone can pass. Ask for a reason from anyone who wants to give one.",
      end: "Mark it taught, tap anyone who missed it, save the board." , sech: "About " + ((f.d && f.d.mins) || "") + " minutes." }[f.k] || "";
  }
  $("#say").innerHTML = s ? "<b>Prompt</b> &nbsp;" + s : "<b>Prompt</b> &nbsp;No prompt for this one.";
}

/* ---------- hidden surprise ---------- */
function surprise(el, f){
  var s = lesson.surprise;
  if(!s || s.at !== f.path || S.surprise.found) return;
  var art = s.kind === "bonnie" ? A.svg("-80 -50 130 130", A.bonnie(0, 0, 0.9)) : s.kind === "bambi" ? A.svg("-90 -80 160 180", A.bambi(0, 0, 0.9)) : A.svg("-40 -30 80 64", A.bird(0, 0, 1));
  var sp = d.createElement("div");
  sp.className = "surp"; sp.innerHTML = art;
  sp.style.left = (s.x || 1450) + "px"; sp.style.top = (s.y || 700) + "px";
  if(s.w) sp.style.width = s.w + "px";
  sp.title = "";
  sp.addEventListener("click", function(e){
    e.stopPropagation();
    S.surprise.found = true;
    var b = d.createElement("div"); b.className = "bubble"; b.innerHTML = s.say || "Hello.";
    b.style.left = Math.max(40, (s.x || 1450) - 520) + "px"; b.style.top = Math.max(90, (s.y || 700) - 120) + "px";
    $("#stage").appendChild(b);
    setTimeout(function(){ sp.classList.add("go"); }, 900);
    setTimeout(function(){ b.remove(); sp.remove(); }, 4200);
  });
  $("#stage").appendChild(sp);
}

/* ---------- edit mode (staff) ---------- */
function editToggle(){
  if(editing){ editing = false; d.body.classList.remove("editing"); $("#editbar").hidden = true; redraw(); return; }
  staffOk().then(function(ok){
    if(!ok) return;
    editing = true; d.body.classList.add("editing"); $("#editbar").hidden = false; redraw();
  });
}
/* the staff passphrase: from school sign in if this is a staff account, otherwise typed once */
var PASS = null;
function staffPass(){
  if(PASS) return Promise.resolve(PASS);
  var ask = function(){
    return new Promise(function(res){
      var ov = $("#passov"); ov.hidden = false; var inp = $("#pass"); inp.value = ""; inp.focus();
      $("#passmsg").textContent = "";
      $("#passgo").onclick = function(){
        if(!window.B5Lock){ $("#passmsg").textContent = "The lock did not load here."; return; }
        var v = inp.value;
        B5Lock.checkStaff(v).then(function(ok){ if(ok){ ov.hidden = true; PASS = v; PLAN.rememberPass(v); res(v); } else $("#passmsg").textContent = "Not that one."; });
      };
      $("#passno").onclick = function(){ ov.hidden = true; res(null); };
    });
  };
  if(window.B5Lock && B5Lock.whoami) return B5Lock.whoami().then(function(w){ if(w && w.staff){ PASS = w.pass; return PASS; } return ask(); }, ask);
  return ask();
}
function staffOk(){ return staffPass().then(function(p){ return !!p; }); }
function bindEdit(el){
  $$("[data-e]", el).forEach(function(x){
    x.setAttribute("contenteditable", "true");
    x.addEventListener("blur", function(){
      var p = x.getAttribute("data-e"), v = x.innerHTML.replace(/&nbsp;/g, " ").trim();
      if(getPath(lesson, p) === v) return;
      setPath(lesson, p, v);
      var local = {}; try{ local = JSON.parse(localStorage.getItem(EDITKEY) || "{}") || {}; }catch(e){}
      local[p] = v; try{ localStorage.setItem(EDITKEY, JSON.stringify(local)); }catch(e){}
      toast("Saved on this board.");
    });
  });
}
function editText(){
  var all = {}, k, local = {};
  try{ local = JSON.parse(localStorage.getItem(EDITKEY) || "{}") || {}; }catch(e){}
  var orig = lesson.edits || {};
  for(k in orig) all[k] = orig[k];
  for(k in local) all[k] = local[k];
  return "\n/* Jay's edits, made on the board " + PLAN.iso() + ". This block goes at the very end of\n   lessons/l/" + meta.id + ".js, replacing any older edits block. */\nwindow.B5LESSON.edits = " + ascii(JSON.stringify(all, null, 1)) + ";\n";
}
function copyText(txt, ok){
  if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function(){ toast(ok); }, function(){ download("edits.txt", txt, "text/plain"); });
  else download("edits.txt", txt, "text/plain");
}
function download(name, data, type){
  var a = d.createElement("a");
  a.href = typeof data === "string" && data.indexOf("data:") === 0 ? data : URL.createObjectURL(new Blob([data], { type: type || "text/plain" }));
  a.download = name; d.body.appendChild(a); a.click(); setTimeout(function(){ a.remove(); }, 500);
}

/* ---------- folder drop rows (Folders tab) ---------- */
function folderRows(){
  var here = hereList(), missed = PLAN.hqs.filter(function(h){ return here.indexOf(h[0]) < 0; });
  if(!missed.length){ toast("Everyone was here, so no folder rows needed."); return; }
  var drop = meta.drop, lib = window.B5LIB, title = meta.title;
  var dropTitle = drop;
  if(lib && lib.items) lib.items.forEach(function(it){ if(it.slug === drop) dropTitle = it.title; });
  var rows = missed.map(function(h){
    return [h[0], "Something to try", PLAN.iso(), dropTitle, h[1] + "a2-" + drop + ".html",
      "This goes with the lesson on " + title.replace(/\?$/, "") + ", whenever you fancy it. No rush."].join("\t");
  });
  copyText(rows.join("\n"), "Copied " + rows.length + " folder row" + (rows.length > 1 ? "s" : "") + ". Paste them into the Folders tab.");
}

/* ---------- board snapshots for evidence ---------- */
var CSS = "";
fetch("/lessons/engine.css").then(function(r){ return r.text(); }).then(function(t){ CSS = t; }).catch(function(){});
function snap(i, quiet){
  var stage = $("#stage"), clone = stage.cloneNode(true);
  clone.style.transform = "none";
  $$("canvas, .surp, .bubble, .spark", clone).forEach(function(x){ x.remove(); });
  $$("img, iframe", clone).forEach(function(x){ var p = d.createElement("div"); p.style.cssText = "width:600px;height:300px;border:4px dashed #0a2f38;border-radius:20px"; x.replaceWith(p); });
  $$("[contenteditable]", clone).forEach(function(x){ x.removeAttribute("contenteditable"); });
  var vars = "--pc:" + pillar.colour + ";--pd:" + pillar.deep + ";--pw:" + pillar.wash;
  var xhtml = new XMLSerializer().serializeToString(clone);
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '"><foreignObject width="100%" height="100%">' +
    '<div xmlns="http://www.w3.org/1999/xhtml" style="' + vars + '"><style>' + CSS.replace(/<\/?style>/g, "") + '#stage *{animation:none !important;transition:none !important}</style>' + xhtml + '</div></foreignObject></svg>';
  var cv = $("#ink"), strokes = (S.strokes[i] || []).length ? cv.toDataURL("image/png") : "";
  S.snaps[i] = { svg: svg, ink: strokes, name: frameName(frames[i]), at: i };
  if(!quiet) toast("Snapped. It goes in the board picture at the end.");
}
function loadImg(src){ return new Promise(function(res){ var im = new Image(); im.onload = function(){ res(im); }; im.onerror = function(){ res(null); }; im.src = src; }); }
function evidence(){
  composeBoard().then(function(cv){
    var url;
    try{ url = cv.toDataURL("image/png"); }catch(e){ url = null; }
    if(!url){ toast("The browser would not save the picture. Try S on each slide and a screenshot."); return; }
    download("base5-lesson-" + meta.id + (part ? "-part" + part : "") + "-" + PLAN.iso() + ".png", url);
    toast("Board picture saved.");
  });
}
function composeBoard(){
  var pr = function(k){ var f = frames[k]; return (S.strokes[k] && S.strokes[k].length ? 0 : 10) + (f.k === "sort" ? 0 : f.k === "wordle" ? 2 : f.exit ? 3 : f.k === "driving" ? 4 : f.k === "confidence" ? 5 : 6); };
  var keys = Object.keys(S.snaps).map(Number).sort(function(a, b){ return pr(a) - pr(b) || a - b; }).slice(0, 6).sort(function(a, b){ return a - b; });
  var cols = 2, tw = 760, th = 428, gap = 26, top = 170, rows = Math.max(1, Math.ceil(keys.length / cols));
  var res = results(), cw = 1600, ch = top + rows * (th + gap + 40) + 60 + res.length * 36 + 40;
  var cv = d.createElement("canvas"); cv.width = cw; cv.height = ch;
  var cx = cv.getContext("2d");
  cx.fillStyle = "#f7f2e9"; cx.fillRect(0, 0, cw, ch);
  cx.fillStyle = pillar.colour; cx.fillRect(0, 0, cw, 130);
  cx.fillStyle = "#fff"; cx.font = "900 46px Archivo, Arial Black, Arial, sans-serif";
  cx.fillText(meta.title + (part ? " (part " + part + ")" : ""), 40, 64);
  cx.font = "700 24px Verdana, Arial, sans-serif";
  cx.fillText("Base 5 lesson \u00b7 " + pillar.name + " \u00b7 " + series.title + " \u00b7 lesson " + meta.n + " of " + meta.of + " \u00b7 " + (S.day || PLAN.iso()), 40, 104);
  var jobs = keys.map(function(k, n){
    var sn = S.snaps[k], x = 40 + (n % cols) * (tw + gap), y = top + Math.floor(n / cols) * (th + gap + 40);
    return loadImg("data:image/svg+xml;charset=utf-8," + encodeURIComponent(sn.svg)).then(function(im){
      cx.fillStyle = "#fffdf8"; cx.fillRect(x, y, tw, th);
      if(im){ try{ cx.drawImage(im, x, y, tw, th); }catch(e){} }
      return sn.ink ? loadImg(sn.ink) : null;
    }).then(function(im2){
      if(im2) cx.drawImage(im2, x, y, tw, th);
      cx.strokeStyle = "#0a2f38"; cx.lineWidth = 4; cx.strokeRect(x, y, tw, th);
      cx.fillStyle = "#0a2f38"; cx.font = "700 22px Verdana, Arial, sans-serif";
      cx.fillText(sn.name.slice(0, 60), x, y + th + 30);
    });
  });
  return Promise.all(jobs).then(function(){
    var y = top + rows * (th + gap + 40) + 30;
    cx.fillStyle = "#0a2f38"; cx.font = "900 28px Archivo, Arial Black, Arial, sans-serif";
    cx.fillText(keys.length ? "What the group said" : "No board snaps yet: this is the group's summary", 40, y);
    cx.font = "400 24px Verdana, Arial, sans-serif";
    res.forEach(function(line, i){ cx.fillText(line.slice(0, 120), 40, y + 40 + i * 36); });
    return cv;
  });
}
function results(){
  var out = [];
  frames.forEach(function(f, i){
    if(f.k === "sort" && S.sort[i] && S.sort[i].checked){ out.push(frameName(f).slice(0, 40) + " - " + sortLine(S.sort[i], f.d)); return; }
    if(f.k === "wordle" && S.word[i] && S.word[i].rows.length){ var ww = S.word[i]; out.push("Wordle - " + (ww.won ? "got it in " + ww.rows.length : "had " + ww.rows.length + " goes")); return; }
    var t = S.tally[i];
    if(!t || !t.some(function(v){ return v > 0; })) return;
    var plain = function(h){ return String(h || "").replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, " ").trim(); };
    var opts = f.k === "wyr" ? [plain(f.d.a), plain(f.d.b)] : f.k === "confidence" ? ["0", "1", "2", "3", "4", "5"] :
      (f.d && f.d.opts || ["Yes", "No", "It depends"]).map(function(o){ return plain(typeof o === "string" ? o : o.t); });
    var parts = t.map(function(v, j){ return v ? plain(opts[j]).slice(0, 34) + ": " + v : ""; }).filter(Boolean);
    out.push(frameName(f).slice(0, 40) + " - " + parts.join(", "));
  });
  return out;
}

/* ---------- evidence to the shared memory sheet and BridgeLink Buddy ----------
   One Evidence row and one Buddy Learning note per student here, linked to
   meta.step (see /lessons/plan.js), the board picture saved to Drive, and a
   folder drop for anyone who missed it. Needs the lesson action in the sheet
   script (teacher/sync/base5-sheet.gs.txt). Sending again updates, never doubles. */
function plainText(h){ return String(h || "").replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim(); }
function summaryLine(){
  var bits = [], ex = 0, exRight = 0, voted = false;
  frames.forEach(function(f, i){
    var t = S.tally[i];
    if(f.exit){ ex++; if(t && t.some(function(v){ return v > 0; })){ voted = true; var mx = Math.max.apply(null, t); if(f.d.a != null && t[f.d.a] === mx) exRight++; } }
  });
  bits.push("Joined in with the whole group lesson on the board" + (part ? " (part " + part + " of 3: " + PLAN.parts[part].toLowerCase() + ")" : "") + ".");
  if(voted) bits.push("Group exit vote: most picked the right answer on " + exRight + " of " + ex + " questions.");
  frames.forEach(function(f, i){
    var t = S.tally[i];
    if(f.k === "confidence" && t && t.some(function(v){ return v > 0; })){
      var n = 0, sum = 0; t.forEach(function(v, j){ n += v; sum += v * j; });
      bits.push("Fist to five, group average " + (Math.round(sum / n * 10) / 10) + " out of 5.");
    }
    if(f.k === "sort" && S.sort[i] && S.sort[i].checked) bits.push(plainText(frameName(f)) + ": " + sortLine(S.sort[i], f.d));
  });
  if(lesson.objective && lesson.objective.formal) bits.push("We were learning to " + plainText(lesson.objective.formal));
  return bits.join(" ").slice(0, 400);
}
function sendMsg(t){ S.sent = t; var el = $("#sendmsg"); if(el) el.textContent = t; }
function sendBuddy(){
  if(PREVIEW){ sendMsg("Preview: nothing is sent. Open the lesson from the timetable or Lessons page to send it for real."); return; }
  var Site = window.B5Site;
  if(!Site || !Site.call || !Site.syncUrl || Site.guest){ sendMsg("The shared memory is not reachable from this page (guest mode, or switched off). Save the board and copy folder rows instead."); return; }
  var here = hereList(), missed = PLAN.hqs.map(function(h){ return h[0]; }).filter(function(w){ return here.indexOf(w) < 0; });
  if(!here.length){ sendMsg("Nobody is ticked as here, so there is nothing to send."); return; }
  var dropTitleNow = meta.drop;
  if(window.B5LIB && B5LIB.items) B5LIB.items.forEach(function(it){ if(it.slug === meta.drop) dropTitleNow = it.title; });
  S.already = [];
  /* sent on a later day (from the staff room's "not sent yet" list): keep the day it was taught */
  var tday = PLAN.load().taught[PLAN.partKey(meta.id, part)], tnow = PLAN.iso();
  S.day = tday && tday < tnow ? tday : tnow;
  sendMsg("Checking it's you...");
  staffPass().then(function(pass){
    if(!pass){ sendMsg("Not sent: Send to Buddy is for staff."); return null; }
    sendMsg("Making the board picture...");
    return composeBoard().then(function(cv){
      var png = "";
      try{ png = cv.toDataURL("image/jpeg", 0.82); }catch(e){ png = ""; }
      var lib = window.B5LIB, dropTitle = meta.drop;
      if(lib && lib.items) lib.items.forEach(function(it){ if(it.slug === meta.drop) dropTitle = it.title; });
      /* the matching HQ activity is already planned into everyone's folder (/data/a2/drops.js):
         only bring it forward for anyone it hasn't reached yet */
      var drops = {}, today = PLAN.iso(), DR = window.B5DROPS;
      missed.forEach(function(w){
        var plan = DR && DR.items ? DR.items.filter(function(it){ return it.who === w && it.slug === meta.drop; })[0] : null;
        if(plan && plan.date <= today){ S.already = (S.already || []).concat(w); return; }
        var hq = PLAN.hqs.filter(function(h){ return h[0] === w; })[0];
        drops[w] = plan && plan.href ? plan.href : hq[1] + "a2-" + meta.drop + ".html";
      });
      sendMsg("Sending to the shared memory and Buddy...");
      return Site.call("lesson", {
        key: pass, day: S.day, id: meta.id + (part ? "-p" + part : ""), title: meta.title + (part ? " (" + PLAN.parts[part].toLowerCase() + ")" : ""),
        subject: pillar.name, target: meta.target, targetName: series.title, step: meta.step || 0,
        mins: part ? 15 : (lesson.mins || 45), line: summaryLine(), here: here, png: png,
        dropTitle: dropTitle, drops: drops, missed: Object.keys(drops), dropNote: "This goes with the lesson on " + meta.title.replace(/\?$/, "") + ", whenever you fancy it. No rush."
      });
    });
  }).then(function(o){
    if(o === null || o === undefined) return;
    if(!o.ok){ sendMsg("Not sent: " + (o.error || "no answer from the sheet") + (o.error === "unknown action" ? ". The sheet script needs the new version: see Shared memory in the staff room." : ".")); return; }
    var notes = o.notes || [], linked = notes.filter(function(n){ return n.linked; }).length;
    var line = "Sent for " + notes.map(function(n){ return n.who; }).join(", ") + ".";
    line += o.toBuddy ? " Buddy notes " + (linked ? "linked to step " + meta.step + (linked < notes.length ? " for " + linked + " of them" : "") : "sent, but no matching step was found in Buddy") + "." : " Evidence rows written (Evidence to Buddy is off in Settings).";
    if(o.picture) line += " Board picture saved to Drive.";
    if(o.dropped && o.dropped.length) line += " " + dropTitleNow + " brought forward into the folder for " + o.dropped.join(", ") + ".";
    var al = (S.already || []).filter(function(w, i, a){ return a.indexOf(w) === i; });
    if(al.length) line += " " + al.join(", ") + " already " + (al.length > 1 ? "have" : "has") + " " + dropTitleNow + " in their folder.";
    sendMsg(line);
    PLAN.sentMark(meta.id, part, S.day);
    toast("Sent to Buddy.");
  }, function(e){ sendMsg("Not sent: " + (e && e.message ? e.message : "the sheet did not answer") + ". Try again in a minute."); });
}

/* ---------- keys, scale, dock ---------- */
function currentScale(){ var r = $("#stage").getBoundingClientRect(); return r.width / W; }
function scale(){
  var s = Math.min(window.innerWidth / W, window.innerHeight / H);
  $("#stage").style.transform = "scale(" + s + ")";
}
d.addEventListener("keydown", function(e){
  if(e.ctrlKey || e.metaKey || e.altKey) return;
  var tgt = e.target;
  if(tgt && (tgt.isContentEditable || /INPUT|TEXTAREA/.test(tgt.tagName))){ if(e.key === "Escape") tgt.blur(); return; }
  if(!$("#pause").hidden){ e.preventDefault(); pause(false); return; }
  var k = e.key, f = frames[fi];
  if(k === "Escape"){ $$(".ov").forEach(function(o){ if(o.id !== "passov") o.hidden = true; }); inkMode(false); return; }
  if(f && f.k === "wordle" && !wordState(f).done && (k === "Enter" || k === "Backspace" || /^[A-Za-z]$/.test(k))){ if(wordKey(k)){ e.preventDefault(); return; } }
  if(k === "ArrowRight" || k === "PageDown" || k === " " || k === "Enter" || k === "ArrowDown"){ e.preventDefault(); next(); return; }
  if(k === "ArrowLeft" || k === "PageUp" || k === "ArrowUp" || k === "Backspace"){ e.preventDefault(); prev(); return; }
  if(k === "Home"){ go(0); return; }
  if(k === "End"){ go(frames.length - 1); return; }
  var kk = k.toLowerCase();
  if(kk === "b" || kk === "." || kk === "p"){ pause(true); return; }
  if(kk === "d") inkMode();
  else if(kk === "t") timerToggle();
  else if(kk === "r") picker();
  else if(kk === "m") menu();
  else if(kk === "n") $("#say").hidden = !$("#say").hidden;
  else if(kk === "s") snap(fi);
  else if(kk === "f") fullscreen();
  else if(kk === "e") editToggle();
});
function fullscreen(){
  try{ if(d.fullscreenElement) d.exitFullscreen(); else root.requestFullscreen(); }catch(e){}
}
var idleT = 0;
function wake(){ $("#dock").classList.remove("idle"); clearTimeout(idleT); idleT = setTimeout(function(){ if(!ink.on) $("#dock").classList.add("idle"); }, 3500); }
d.addEventListener("mousemove", wake); d.addEventListener("pointerdown", wake);

function bindChrome(){
  $("#bPrev").onclick = prev; $("#bNext").onclick = next;
  $("#bMenu").onclick = menu; $("#bDraw").onclick = function(){ inkMode(); };
  $("#bPick").onclick = picker; $("#bPause").onclick = function(){ pause(true); };
  $("#bSay").onclick = function(){ $("#say").hidden = !$("#say").hidden; $("#bSay").classList.toggle("on", !$("#say").hidden); };
  $("#bSnap").onclick = function(){ snap(fi); };
  $("#bFull").onclick = fullscreen; $("#bEdit").onclick = editToggle;
  $("#timer").onclick = timerToggle;
  $("#pause").onclick = function(){ pause(false); };
  $$(".ov .x").forEach(function(x){ x.onclick = function(){ x.closest(".ov").hidden = true; }; });
  $("#spin").onclick = spin;
  $("#eCopy").onclick = function(){ copyText(editText(), "Edits copied. Paste them at the very end of the lesson file."); };
  $("#eSave").onclick = function(){ download(meta.id + "-edits.txt", editText()); };
  $("#eClear").onclick = function(){ if(confirmClear()){ try{ localStorage.removeItem(EDITKEY); }catch(e){} location.reload(); } };
  $("#eDone").onclick = editToggle;
  $$(".ov").forEach(function(o){ if(o.id !== "pause") o.addEventListener("click", function(e){ if(e.target === o && o.id !== "passov") o.hidden = true; }); });
  bindInk();
  $("#pause").innerHTML = '<svg viewBox="-160 -110 320 200" class="breathe">' + A.bonnie(10, 20, 2, "sleep") +
    '<text x="70" y="-40" font-family="Archivo,Arial Black,Arial" font-weight="900" font-size="30" fill="#ffc247" class="zz">z</text>' +
    '<text x="96" y="-70" font-family="Archivo,Arial Black,Arial" font-weight="900" font-size="22" fill="#ffc247" class="zz" style="animation-delay:1.4s">z</text></svg>' +
    '<p>Breather. Back whenever we are ready.</p><small>Click or press any key to come back</small>';
}
function confirmClear(){ return window.confirm("Clear the edits saved on this board for this lesson?"); }

bindChrome();
start();
/* the shared copy of what has been taught: if it knows of lessons this
   board does not, and the slot would now open a different one, move on
   to that one before anything has happened */
if(!PREVIEW && PLAN.sync){
  var t0 = Date.now();
  PLAN.sync().then(function(r){
    if(!r || !r.ok || !r.added.length || !slotId || q("l") || fi !== 0 || Date.now() - t0 > 15000) return;
    var nx = PLAN.nextFor(slotId);
    if(nx && nx.lesson && (!meta || nx.lesson.id !== meta.id || nx.part !== part)){
      toast("The shared record says that one is done. Moving on to " + PLAN.label(nx) + ".");
      setTimeout(function(){ if(fi === 0) location.replace(PLAN.presentHref(nx)); }, 1800);
    }
  });
}
window.B5Present = { go: go, next: next, prev: prev, frames: function(){ return frames; }, state: S, snap: snap, evidence: evidence, results: results };
})();
