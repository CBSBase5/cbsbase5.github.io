/* ==========================================================
   EGW's GCSE HQ - activity engine
   Every activity page in /egw/ hands this a list of steps and
   the engine does the rest: one step at a time, two tries with
   a nudge in between, a worked answer if it is still not there,
   autosave, a "how it went" page, and send to Jay.

   Use:
     EGW.run({
       id: "maths-money",            // storage key b5.egw.<id>.v1
       title: "Money maths",
       subject: "Maths",
       blurb: "One line for the start card",
       mins: 40,                     // rough time, shown on start card
       steps: [ ...see below... ]
     });

   Step types (all take topic, and optional stretch:true):
     learn  {title, html, fig}                     unscored explainer
     mc     {q, fig, options:[], answer:i, hint, why}
     multi  {q, fig, options:[], answers:[i,j], hint, why}
     num    {q, fig, boxes:[{label, a, tol, pre, post, alts}], hint, why}
     text   {q, fig, need:[[any of these],[and any of these]], model, hint, why}
     sort   {q, buckets:[], cards:[[text, bucketIndex]], hint, why}
     order  {q, items:[in the right order], hint, why}
     match  {q, pairs:[[left, right]], hint, why}
     write  {q, fig, starters:[], checklist:[], minWords}  sent to Jay, unmarked
     mark   {q, fig, jay:[lines of Jay's answer], wrong:i or -1 if all right,
             max: marks available, award: marks it deserves, hint, why}
            "Mark Jay's work": she taps where Jay first goes wrong (or says
            it is all right), then gives it a mark.
     unlock {q, code:"7294", hint, why}  the final door in an escape room

   Escape rooms: add  escape: { digits:["7","2","9","4"], intro:"html" }
   to the config. Every chunk except the last is a room; finishing a
   room reveals its digit. The last chunk holds the unlock step.
   A clock is offered on the start card, off unless she turns it on.

   Packs can word their own chunk ending with
     chunkMsg: function(k, topic, n){ return {stamp, head, text, wide}; }
   (wide:true draws a rubber stamp instead of the round number).
     widget {title, html, mount:function(el, api)}  custom interactive
            api.data   object saved with the page
            api.save() save api.data
            api.done(result)  result: "right1" | "right2" | "shown" | "done"
   ========================================================== */

var EGW = (function(){
"use strict";

/* Which HQ this is. EGW's pages have no config; another student's
   HQ sets window.HQ in its conf.js before this file loads. */
var HQ = window.HQ || { who: "EGW", prefix: "b5.egw.", base: "/egw/" };
var PREFIX = HQ.prefix;
var cfg, steps, state, key;

/* ---------- small helpers ---------- */
function $(id){ return document.getElementById(id); }
function h(tag, cls, html){
  var e = document.createElement(tag);
  if(cls) e.className = cls;
  if(html !== undefined) e.innerHTML = html;
  return e;
}
function stripTags(s){
  var d = document.createElement("div");
  d.innerHTML = String(s);
  return (d.textContent || "").replace(/\s+/g, " ").trim();
}
function norm(s){
  return String(s).toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-z0-9.'\/ ]/g, " ")
    .replace(/\s+/g, " ").trim();
}
function pick(a){ return a[Math.floor(Math.random() * a.length)]; }

/* Numbers: accepts 1,250  1250  12.5%  3/4  2 1/2  -4  .5 and a pound sign */
function parseNum(s){
  s = String(s).trim().replace(/[\u2212\u2013]/g, "-").replace(/[\u00a3$,%]/g, "").replace(/\s+/g, " ");
  s = s.replace(/^[a-z]\s*=\s*/i, "");
  /* trailing units, including ones with a slash like km/h or g/cm3, and the pi sign */
  s = s.replace(/(\s*[a-z\u00b0\u00b2\u00b3\u03c0]+(\s*\/\s*[a-z\u00b2\u00b3]+)?)+$/i, "").trim();
  /* 35 000 written with a space for thousands */
  if(/^-?\d{1,3}( \d{3})+(\.\d+)?$/.test(s)) s = s.replace(/ /g, "");
  var mixed = s.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if(mixed){
    var w = parseFloat(mixed[1]), f = parseFloat(mixed[2]) / parseFloat(mixed[3]);
    return w < 0 ? w - f : w + f;
  }
  var frac = s.match(/^(-?\d*\.?\d+)\/(\d*\.?\d+)$/);
  if(frac) return parseFloat(frac[1]) / parseFloat(frac[2]);
  if(/^-?\d*\.?\d+$/.test(s)) return parseFloat(s);
  return NaN;
}

var GOOD = ["Spot on.", "Yes, that is it.", "Nailed it.", "Exactly right.", "That is the one.", "Yep, you have got it."];
var NUDGE = ["Not quite yet.", "Close, but not there yet.", "Nearly. Have another look."];

/* ---------- storage ---------- */
function load(){
  try{
    var r = localStorage.getItem(key);
    if(r){ var d = JSON.parse(r); if(d && d.answers) return d; }
  }catch(e){}
  return null;
}
function fresh(){
  return { pos: 0, answers: {}, widgets: {}, started: new Date().toISOString() };
}
function save(){
  state.summary = summary();
  state.updated = new Date().toISOString();
  try{ localStorage.setItem(key, JSON.stringify(state)); }catch(e){}
}

function scored(s){ return ["learn", "write"].indexOf(s.type) < 0 && !(s.type === "widget" && s.unscored); }

/* ---------- second look ----------
   A question that needed Show me or a second go comes back a couple
   of days later. Right first time on a second look pushes it further
   out (2, then 5, then 12 days); after that it drops off the list.
   Stretch questions, widgets and writing are left out. */
var REVIEW_KEY = PREFIX + "review.v1";
var REVIEW_GAP = [0, 2, 5, 12];
function dayStr(d){
  var m = d.getMonth() + 1, dd = d.getDate();
  return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (dd < 10 ? "0" : "") + dd;
}
function addDays(n){ var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n); return dayStr(d); }
function loadReview(){
  try{ var r = localStorage.getItem(REVIEW_KEY); var d = r ? JSON.parse(r) : null; if(d && d.items) return d; }catch(e){}
  return { items: {} };
}
function saveReview(d){ d.updated = new Date().toISOString(); try{ localStorage.setItem(REVIEW_KEY, JSON.stringify(d)); }catch(e){} }
function reviewable(s){ return !!s && !s.stretch && ["mc", "multi", "num", "sort", "order", "match", "text", "mark"].indexOf(s.type) >= 0; }
function noteForReview(i, status){
  var s = steps[i];
  if(cfg.review || !reviewable(s) || (status !== "shown" && status !== "right2")) return;
  var d = loadReview(), k = cfg.id + ":" + i;
  if(d.items[k]) return;
  d.items[k] = { id: cfg.id, i: i, box: 1, due: addDays(REVIEW_GAP[1]), added: addDays(0),
    title: cfg.title, subject: cfg.subject, topic: stripTags(s.topic), q: stripTags(s.q || "").slice(0, 90) };
  saveReview(d);
}
function reviewResult(orig, status){
  var d = loadReview(), k = cfg.id + ":" + orig, it = d.items[k];
  if(!it) return;
  it.last = addDays(0); it.seen = (it.seen || 0) + 1;
  if(status === "right1"){
    it.box++;
    if(it.box >= REVIEW_GAP.length){ delete d.items[k]; d.learnt = (d.learnt || 0) + 1; }
    else it.due = addDays(REVIEW_GAP[it.box]);
  }else{
    if(status === "shown") it.box = 1;
    it.due = addDays(REVIEW_GAP[1]);
  }
  saveReview(d);
}
/* the nearest learn card before a question, for a reminder */
function findLearn(all, i){
  for(var j = i - 1; j >= 0 && all[j].topic === all[i].topic; j--){
    if(all[j].type === "learn") return { title: all[j].title, html: all[j].html, fig: all[j].fig };
  }
  return null;
}

/* Sparks: everything you do earns some. Learning from Show me still counts. */
var SPARK = { right1: 10, right2: 6, shown: 3, done: 8 };

function summary(){
  var total = 0, marked = 0, got1 = 0, got2 = 0, shown = 0, done = 0, skipped = 0, sparks = 0;
  steps.forEach(function(s, i){
    var a = state.answers[i];
    if(s.type === "learn") return;
    total++;
    if(scored(s)) marked++;
    if(!a) return;
    sparks += SPARK[a.status] || 0;
    if(a.status === "right1"){ got1++; done++; }
    else if(a.status === "right2"){ got2++; done++; }
    else if(a.status === "shown"){ shown++; done++; }
    else if(a.status === "done"){ done++; }
    else if(a.status === "skipped"){ skipped++; }
  });
  var ch = chunks.map(function(c){ return chunkState(c); });
  /* per chunk: [first go, second go, Show me, skipped, questions] */
  var ct = chunks.map(function(c){
    var t = [0, 0, 0, 0, 0];
    for(var i = c.from; i <= c.to; i++){
      if(steps[i].type === "learn") continue;
      t[4]++;
      var a = state.answers[i];
      if(!a) continue;
      if(a.status === "right1") t[0]++;
      else if(a.status === "right2") t[1]++;
      else if(a.status === "shown") t[2]++;
      else if(a.status === "skipped") t[3]++;
    }
    return t;
  });
  return { id: cfg.id, subject: cfg.subject, chunkTally: ct, escaped: !!state.escaped, bestTime: state.bestTime || 0, total: total, marked: marked, done: done, got1: got1, got2: got2, shown: shown, skipped: skipped,
           sparks: sparks, best: state.best || 0,
           chunkStates: ch, chunkNames: chunks.map(function(c){ return stripTags(c.topic); }),
           chunks: ch.length, chunksDone: ch.filter(function(x){ return x === "done"; }).length,
           finished: !!state.finished, title: cfg.title };
}

/* ---------- chunks ----------
   A chunk is a run of steps that share a topic. Each one is a
   small sitting: a learn card or two and a few questions. */
var chunks = [], chunkOf = [];
function makeChunks(){
  chunks = []; chunkOf = [];
  if(cfg.review){
    if(steps.length) chunks.push({ topic: "Second look", from: 0, to: steps.length - 1 });
    steps.forEach(function(s, i){ chunkOf[i] = 0; });
    return;
  }
  steps.forEach(function(s, i){
    var last = chunks[chunks.length - 1];
    if(!last || last.topic !== s.topic){
      last = { topic: s.topic, from: i, to: i };
      chunks.push(last);
    }
    last.to = i;
    chunkOf[i] = chunks.length - 1;
  });
}
function chunkState(c){
  var any = false, all = true, hasQ = false;
  for(var i = c.from; i <= c.to; i++){
    if(steps[i].type === "learn"){ if(state.answers[i]) any = true; continue; }
    hasQ = true;
    var a = state.answers[i];
    if(a) any = true;
    if(!a || !(resolved(i) || a.status === "skipped")) all = false;
  }
  if(!hasQ) return any ? "done" : "new";
  return all && any ? "done" : any ? "started" : "new";
}
function chunkQs(c){
  var n = 0;
  for(var i = c.from; i <= c.to; i++) if(steps[i].type !== "learn") n++;
  return n;
}

/* ---------- page scaffold ---------- */
function build(){
  var root = $("egwApp");
  root.innerHTML =
    '<div class="board">' +
      '<div class="card w12" id="startCard">' +
        '<span class="kicker">' + cfg.subject + (cfg.mins ? ' &middot; about ' + cfg.mins + ' minutes in all' : '') + '</span>' +
        (cfg.escape ?
          '<h3>Escape room</h3>' +
          '<div class="lead escapeintro">' + (cfg.escape.intro || cfg.blurb) + '</div>' +
          '<ul class="howlist">' +
            '<li><b>' + (chunks.length - 1) + ' rooms</b>, each hiding one digit of the final code. Any order. It saves itself.</li>' +
            '<li><b>Two goes</b> at each question, and <b>Show me</b> whenever you want it. You still get the digit.</li>' +
            '<li>A clock is <b id="clockState">off</b>. <button class="linkish" id="clockBtn" type="button">Turn it on</button> if you fancy racing yourself.</li>' +
          '</ul>'
        :
          '<h3>Learn a bit, try a bit</h3>' +
          '<p class="lead">' + cfg.blurb + '</p>' +
          '<ul class="howlist">' +
            '<li><b>' + chunks.length + ' short chunks.</b> Any order, any day. It saves itself.</li>' +
            '<li><b>Two goes</b> at each question, and <b>Show me</b> whenever you want it.</li>' +
            '<li><span class="stretch">Stretch</span> questions are optional extras.</li>' +
          '</ul>') +
        '<div class="qnav" style="margin-top:4px">' +
          '<button class="btn" id="beginBtn">Begin with chunk 1</button>' +
          '<button class="btn btn-quiet hidden" id="resumeBtn">Carry on where I left off</button>' +
        '</div>' +
        '<p class="chiplabel">Or pick a chunk</p>' +
        '<div class="chunkmap" id="chunkMap"></div>' +
        '<p class="tiny" id="startStats"></p>' +
      '</div>' +
      '<div class="card w12 hidden" id="qCard">' +
        '<div class="qtop">' +
          '<span class="chunklabel" id="chunkLabel"></span>' +
          '<span class="chips"><span class="chipstat hidden" id="lockChip"></span><span class="chipstat hidden" id="clockChip"></span><span class="chipstat" id="streakChip"></span><span class="chipstat" id="sparkChip"></span></span>' +
        '</div>' +
        '<div class="dots" id="dots"></div>' +
        '<div class="qprogress"><span id="progFill"></span></div>' +
        '<div class="qtop" style="margin-bottom:6px"><span class="kicker" id="qTopic" style="margin:0"></span><span class="qcount" id="qCount"></span></div>' +
        '<div id="qBody"></div>' +
        '<div class="fb hidden" id="qFb" aria-live="polite"></div>' +
        '<div class="qnav">' +
          '<button class="btn btn-quiet" id="backBtn">Back</button>' +
          '<button class="btn btn-quiet" id="skipBtn">Skip for now</button>' +
          '<button class="btn btn-quiet hidden" id="showBtn">Show me</button>' +
          '<button class="btn" id="checkBtn">Check</button>' +
          '<button class="btn btn-orange hidden" id="nextBtn">Next</button>' +
        '</div>' +
      '</div>' +
      '<div class="card w12 hidden" id="chunkCard">' +
        '<div class="stampwrap">' +
          '<div class="stamp" id="stampNum"></div>' +
          '<h3 id="chunkDoneH"></h3>' +
          '<p id="chunkDoneP"></p>' +
        '</div>' +
        '<div class="tally" id="chunkTally"></div>' +
        '<div class="qnav" style="justify-content:center">' +
          '<button class="btn" id="nextChunkBtn"></button>' +
          '<button class="btn btn-quiet" id="breakBtn">Stop here for now</button>' +
        '</div>' +
        '<p class="tiny" style="text-align:center;margin-top:12px">Stopping is completely fine. Everything is saved on this device.</p>' +
      '</div>' +
      '<div class="card w12 hidden" id="resultCard">' +
        '<span class="kicker">How it went</span>' +
        '<h3 id="scoreLine"></h3>' +
        '<p class="lead" id="scoreNote"></p>' +
        '<div class="tally" id="tally"></div>' +
        '<div class="topicbar" id="topicBars"></div>' +
        '<details class="review"><summary>See each question</summary><div id="reviewList"></div></details>' +
        '<div class="qnav" style="margin-top:18px">' +
          '<button class="btn btn-quiet" id="againBtn">Back to the chunks</button>' +
          '<button class="btn btn-quiet" id="freshBtn">Start fresh</button>' +
          '<a class="btn" href="' + HQ.base + '">Back to GCSE HQ</a>' +
        '</div>' +
        '<div id="sendHost"></div>' +
      '</div>' +
    '</div>';

  $("beginBtn").onclick = function(){
    if(state.answers && Object.keys(state.answers).length){
      if(!confirm("Start again from the beginning? Your answers and sparks on this activity will be cleared.")) return;
      state = fresh(); save();
    }
    go(0);
  };
  $("resumeBtn").onclick = function(){ go(Math.min(state.pos || 0, steps.length - 1)); };
  $("backBtn").onclick = function(){ if(state.pos > 0) go(state.pos - 1); else showStart(); };
  $("skipBtn").onclick = function(){
    var s = steps[state.pos];
    if(s.type !== "learn" && !resolved(state.pos)){
      state.answers[state.pos] = { status: "skipped" };
      state.streak = 0;
      save();
    }
    advance();
  };
  $("nextBtn").onclick = advance;
  $("checkBtn").onclick = function(){ check(false); };
  $("showBtn").onclick = function(){ check(true); };
  $("againBtn").onclick = showStart;
  $("breakBtn").onclick = showStart;
  $("freshBtn").onclick = function(){
    if(!confirm("Clear everything on this activity and start fresh?")) return;
    state = fresh(); save(); showStart();
  };

  if(cfg.escape){
    var drawClockState = function(){
      $("clockState").textContent = state.clock ? "on" : "off";
      $("clockBtn").textContent = state.clock ? "Turn it off" : "Turn it on";
    };
    $("clockBtn").onclick = function(){ state.clock = !state.clock; save(); drawClockState(); };
    drawClockState();
    setInterval(tickClock, 1000);
  }

  if(window.Base5Send){
    Base5Send.mount($("sendHost"), {
      tool: "GCSE HQ: " + (cfg.review ? "Second look, " : "") + cfg.title,
      filename: HQ.who.toLowerCase() + "-" + cfg.id,
      getText: reportText
    });
  }
}

function drawChunkMap(){
  var map = $("chunkMap");
  map.innerHTML = "";
  chunks.forEach(function(c, k){
    var st = chunkState(c);
    var b = h("button", "chunk " + st);
    b.type = "button";
    var n = chunkQs(c);
    var label = cfg.escape ? (k === chunks.length - 1 ? "&#9906;" : (st === "done" ? escDigit(k) : "?")) : (k + 1);
    b.innerHTML = '<span class="cn"><span>' + label + '</span></span><span><b>' + c.topic + '</b><small>' +
      (n ? n + " question" + (n === 1 ? "" : "s") : "a quick read") + " &middot; " +
      ({ "new": "not started", started: "started", done: "done" })[st] + '</small></span>';
    b.onclick = function(){ go(c.from); };
    map.appendChild(b);
  });
}

function showOnly(id){
  ["startCard", "qCard", "chunkCard", "resultCard"].forEach(function(x){
    $(x).classList.toggle("hidden", x !== id);
  });
  window.scrollTo(0, 0);
}

function showStart(){
  showOnly("startCard");
  if(cfg.review) return;
  var any = !!(state.answers && Object.keys(state.answers).length);
  $("resumeBtn").classList.toggle("hidden", !any);
  $("beginBtn").textContent = any ? "Start again from scratch" : (cfg.escape ? "Enter the first room" : "Begin with chunk 1");
  $("beginBtn").className = any ? "btn btn-quiet" : "btn";
  $("resumeBtn").className = any ? "btn" : "btn btn-quiet hidden";
  drawChunkMap();
  var sm = summary();
  $("startStats").innerHTML = any ? sm.chunksDone + " of " + sm.chunks + " chunks done &middot; " + sm.sparks + " sparks &middot; best streak " + sm.best : "";
}

function resolved(i){
  var a = state.answers[i];
  return !!(a && ["right1", "right2", "shown", "done"].indexOf(a.status) >= 0);
}

function advance(){
  var i = state.pos;
  if(i >= steps.length - 1){ finish(); return; }
  if(chunkOf[i + 1] !== chunkOf[i] && steps[i].type !== "learn"){ chunkDone(chunkOf[i]); return; }
  go(i + 1);
}

/* ---------- escape rooms ---------- */
function escDigit(k){ return cfg.escape && cfg.escape.digits ? String(cfg.escape.digits[k] || "?") : "?"; }
function roomsFound(){
  var out = [];
  for(var k = 0; k < chunks.length - 1; k++) out.push(chunkState(chunks[k]) === "done" ? escDigit(k) : null);
  return out;
}
function fmtTime(sec){ sec = Math.max(0, Math.round(sec || 0)); var m = Math.floor(sec / 60), s2 = sec % 60; return m + ":" + (s2 < 10 ? "0" : "") + s2; }
function tickClock(){
  if(!cfg.escape || !state.clock || state.escaped) return;
  if(document.hidden || $("qCard").classList.contains("hidden")) return;
  state.elapsed = (state.elapsed || 0) + 1;
  var c = $("clockChip");
  c.innerHTML = '<span class="ico">&#9201;</span>' + fmtTime(state.elapsed);
  if(state.elapsed % 10 === 0) save();
}
function drawLock(){
  if(!cfg.escape) return;
  var found = roomsFound();
  var lc = $("lockChip");
  lc.classList.remove("hidden");
  lc.innerHTML = '<span class="ico">&#128274;</span>' + found.map(function(d){ return d === null ? "_" : d; }).join(" ");
  var cc = $("clockChip");
  cc.classList.toggle("hidden", !state.clock);
  if(state.clock) cc.innerHTML = '<span class="ico">&#9201;</span>' + fmtTime(state.elapsed);
}

/* ---------- the little celebration between chunks ---------- */
var CHEERS = ["Chunk done.", "That is one more in the bag.", "Done and dusted.", "Look at that.", "Another one sorted."];
function chunkDone(k){
  var c = chunks[k];
  var g1 = 0, g2 = 0, sh = 0, sk = 0, sp = 0;
  for(var i = c.from; i <= c.to; i++){
    var a = state.answers[i];
    if(!a || steps[i].type === "learn") continue;
    sp += SPARK[a.status] || 0;
    if(a.status === "right1") g1++;
    else if(a.status === "right2") g2++;
    else if(a.status === "shown") sh++;
    else if(a.status === "skipped") sk++;
  }
  showOnly("chunkCard");
  $("stampNum").className = "stamp";
  if(cfg.chunkMsg){
    /* a pack can word its own chunk ending: {stamp, head, text, wide} */
    var cm = cfg.chunkMsg(k, stripTags(c.topic), chunks.length) || {};
    $("stampNum").textContent = cm.stamp || String(k + 1);
    if(cm.wide) $("stampNum").className = "stamp wide";
    $("chunkDoneH").textContent = cm.head || pick(CHEERS);
    $("chunkDoneP").textContent = (cm.text || "") + (sk ? " You skipped " + sk + "; they will be there whenever you fancy them." : "");
  }else if(cfg.escape){
    $("stampNum").textContent = escDigit(k);
    $("chunkDoneH").textContent = pick(["Lock open.", "A digit drops out.", "Room cleared.", "Click. Something unlocks."]);
    $("chunkDoneP").textContent = "Room " + (k + 1) + ": " + stripTags(c.topic) + ". The digit is " + escDigit(k) + ". " +
      "The final door needs every digit; the padlock at the top keeps track for you.";
  }else{
    $("stampNum").textContent = String(k + 1);
    $("chunkDoneH").textContent = pick(CHEERS);
    $("chunkDoneP").textContent = "Chunk " + (k + 1) + " of " + chunks.length + ": " + stripTags(c.topic) + ". " +
      (sk ? "You skipped " + sk + "; they will be there whenever you fancy them." : "Nothing skipped.") +
      (cfg.extra ? "" : " A new star is lit in your sky.");
  }
  $("chunkTally").innerHTML = '<div class="tbox big"><b>+' + sp + '</b><span>sparks</span></div>' +
    (g1 ? tallyBox(g1, "first go") : "") + (g2 ? tallyBox(g2, "second go") : "") + (sh ? tallyBox(sh, "learnt from Show me") : "");
  var nk = k + 1;
  $("nextChunkBtn").textContent = "Next: " + stripTags(chunks[nk].topic);
  $("nextChunkBtn").onclick = function(){ go(chunks[nk].from); };
  confetti($("stampNum"), 26);
  state.pos = chunks[nk].from; save();
}

function confetti(from, n){
  try{
    if(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var r = from.getBoundingClientRect();
    var cols = ["#3a5cff", "#ff5d5d", "#ffd23f", "#19c39a", "#8a5cf6", "#22b8e6"];
    for(var k = 0; k < (n || 16); k++){
      var b = document.createElement("i");
      b.className = "bit";
      b.style.left = (r.left + r.width / 2) + "px";
      b.style.top = (r.top + r.height / 2) + "px";
      b.style.background = cols[k % cols.length];
      var ang = Math.random() * Math.PI * 2, dist = 70 + Math.random() * 130;
      b.style.setProperty("--dx", Math.round(Math.cos(ang) * dist) + "px");
      b.style.setProperty("--dy", Math.round(Math.sin(ang) * dist + 90) + "px");
      b.style.setProperty("--rot", Math.round(Math.random() * 720 - 360) + "deg");
      document.body.appendChild(b);
      setTimeout((function(el){ return function(){ el.remove(); }; })(b), 1100);
    }
  }catch(e){}
}

/* ---------- render one step ---------- */
var cur = null;   // live handle for the current step: {get:fn, mark:fn}

function drawChips(){
  var st = state.streak || 0;
  var sc = $("streakChip");
  sc.innerHTML = '<span class="ico">&#9889;</span>' + st + ' in a row';
  sc.classList.toggle("hot", st >= 3);
  sc.classList.toggle("hidden", st < 2);
  var sp = summary().sparks;
  $("sparkChip").innerHTML = '<span class="ico">&#10022;</span>' + sp + ' sparks';
  $("sparkChip").classList.toggle("hidden", !sp);
  drawLock();
}

function go(i){
  state.pos = i; save();
  showOnly("qCard");

  var s = steps[i];
  var k = chunkOf[i], c = chunks[k];
  $("chunkLabel").innerHTML = cfg.review ? "Second look <span>" + (i + 1) + " of " + steps.length + "</span>" :
    cfg.escape ? (k === chunks.length - 1 ? "The final door" : "Room " + (k + 1) + " <span>of " + (chunks.length - 1) + "</span>") :
    "Chunk " + (k + 1) + " <span>of " + chunks.length + "</span>";
  var dots = "";
  for(var j = c.from; j <= c.to; j++) dots += '<i class="' + (j < i ? "past" : j === i ? "now" : "") + '"></i>';
  $("dots").innerHTML = dots;
  drawChips();
  $("qTopic").innerHTML = s.topic + (s.stretch ? ' <span class="stretch">Stretch</span>' : "");
  var qs = 0, me = 0;
  for(var m = c.from; m <= c.to; m++){ if(steps[m].type !== "learn"){ qs++; if(m <= i) me++; } }
  $("qCount").textContent = "";

  var body = $("qBody");
  body.innerHTML = "";
  var fb = $("qFb");
  fb.className = "fb hidden"; fb.innerHTML = "";

  cur = null;
  var renderer = R[s.type];
  renderer(s, body, i);
  if(cfg.review && s._remind){
    var rem = h("details", "working remind");
    rem.innerHTML = '<summary>Want a reminder? Tap for the idea behind this one.</summary>' +
      '<div class="remindbody"><b>' + s._remind.title + '</b>' + (s._remind.fig ? '<div class="fig">' + s._remind.fig + '</div>' : "") +
      '<div class="learnbody">' + s._remind.html + '</div></div>';
    body.appendChild(rem);
  }

  var a = state.answers[i];
  setButtons(s, i);
  if(a && resolved(i) && s.type !== "learn" && s.type !== "write" && s.type !== "widget"){
    showFeedback(s, a.status, true);
    if(cur && cur.restore) cur.restore(a.value, true);
  }else if(a && a.value !== undefined && cur && cur.restore){
    cur.restore(a.value, false);
  }
}

function setButtons(s, i){
  var done = resolved(i);
  var learn = s.type === "learn";
  var write = s.type === "write";
  var widget = s.type === "widget";
  var tried = !!(state.answers[i] && state.answers[i].tries);
  $("checkBtn").classList.toggle("hidden", !!(learn || write || widget || done));
  $("showBtn").classList.toggle("hidden", !!(learn || write || widget || done || !tried));
  $("nextBtn").classList.toggle("hidden", !(learn || done || write) || (learn && revealPending));
  $("skipBtn").classList.toggle("hidden", !!(learn || done));
  var lastInChunk = i === steps.length - 1 || chunkOf[i + 1] !== chunkOf[i];
  $("nextBtn").textContent = learn ? "Got it, next" : (i === steps.length - 1 ? "Finish" : lastInChunk ? "Finish this chunk" : "Next");
  if(write) $("skipBtn").classList.add("hidden");
}

function fig(s){ return s.fig ? '<div class="fig">' + s.fig + '</div>' : ""; }
function prompt(s){ return '<div class="prompt">' + s.q + '</div>' + fig(s); }

/* Options are shown in a shuffled order that stays the same for this
   step every time (so a saved answer still lines up). s.fixed keeps
   the written order, for options that are naturally in order. */
function seeded(str){
  var h = 2166136261;
  for(var i = 0; i < str.length; i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return function(){ h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
}
function optionOrder(s){
  var ord = s.options.map(function(o, k){ return k; });
  if(s.fixed) return ord;
  var rnd = seeded(cfg.id + ":" + (s._orig !== undefined ? s._orig : state.pos) + ":" + s.options.length);
  for(var i = ord.length - 1; i > 0; i--){ var j = Math.floor(rnd() * (i + 1)); var t = ord[i]; ord[i] = ord[j]; ord[j] = t; }
  return ord;
}

var R = {};

/* Learn cards show one short bit at a time, so a long card is
   never a wall of text. "Show it all" is always there instead. */
var revealPending = false;
var BIT_WORDS = 60;
R.learn = function(s, body, i){
  body.innerHTML = '<h3 class="learnh">' + s.title + '</h3>' +
    (s.fig ? '<div class="fig">' + s.fig + '</div>' : "") +
    '<div class="learnbody">' + s.html + '</div>';
  var seen = !!state.answers[i];
  state.answers[i] = { status: "done" }; save();
  revealPending = false;
  if(seen) return;
  var lb = body.querySelector(".learnbody");
  var kids = [].slice.call(lb.children);
  function wc(el){ var m = (el.textContent || "").trim().match(/\S+/g); return m ? m.length : 0; }
  var total = 0; kids.forEach(function(el){ total += wc(el); });
  if(kids.length < 2 || total <= BIT_WORDS + 30) return;
  var bits = [], curBit = [], words = 0;
  kids.forEach(function(el){
    var w = wc(el);
    if(curBit.length && words + w > BIT_WORDS){ bits.push(curBit); curBit = []; words = 0; }
    curBit.push(el); words += w;
  });
  if(curBit.length) bits.push(curBit);
  if(bits.length < 2) return;
  var shown = 1;
  var bar = h("div", "readon");
  var more = h("button", "btn", ""); more.type = "button";
  var all = h("button", "linkish", "Show it all"); all.type = "button";
  var dots = h("span", "rdots", "");
  bar.appendChild(more); bar.appendChild(dots); bar.appendChild(all);
  lb.parentNode.insertBefore(bar, lb.nextSibling);
  function draw(scroll){
    bits.forEach(function(b, k){ b.forEach(function(el){ el.classList.toggle("hidden", k >= shown); if(k === shown - 1 && scroll) el.classList.add("fresh"); }); });
    var d = "";
    for(var k = 0; k < bits.length; k++) d += '<i class="' + (k < shown ? "on" : "") + '"></i>';
    dots.innerHTML = d;
    more.textContent = "Read on";
    if(shown >= bits.length){
      bar.remove();
      revealPending = false;
      setButtons(s, i);
    }
    if(scroll && bits[shown - 1]) bits[shown - 1][0].scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  more.onclick = function(){ shown++; draw(true); };
  all.onclick = function(){ shown = bits.length; draw(false); };
  revealPending = true;
  draw(false);
};

R.mc = function(s, body){
  body.innerHTML = prompt(s);
  var box = h("div", "choices");
  var picked = -1;
  var btns = {};
  optionOrder(s).forEach(function(k){
    var b = h("button", "", s.options[k]); b.type = "button"; b.dataset.k = k;
    b.onclick = function(){
      if(resolved(state.pos)) return;
      picked = k;
      Object.keys(btns).forEach(function(n){ btns[n].classList.toggle("picked", +n === k); });
    };
    btns[k] = b;
    box.appendChild(b);
  });
  body.appendChild(box);
  cur = {
    get: function(){ return picked; },
    empty: function(){ return picked < 0; },
    right: function(){ return picked === s.answer; },
    mark: function(final){
      Object.keys(btns).forEach(function(key){
        var n = +key, c = btns[key];
        c.classList.remove("ok", "no");
        if(n === picked && picked !== s.answer) c.classList.add("no");
        if(final && n === s.answer) c.classList.add("ok");
        if(!final && n === picked && picked === s.answer) c.classList.add("ok");
      });
    },
    restore: function(v, fin){ picked = v; if(v >= 0 && btns[v]) btns[v].classList.add("picked"); if(fin) this.mark(true); }
  };
};

R.multi = function(s, body){
  body.innerHTML = prompt(s) + '<p class="tiny">Pick ' + s.answers.length + '.</p>';
  var box = h("div", "choices");
  var on = {};
  var btns = {};
  optionOrder(s).forEach(function(k){
    var b = h("button", "", s.options[k]); b.type = "button"; b.dataset.k = k;
    b.onclick = function(){
      if(resolved(state.pos)) return;
      on[k] = !on[k]; b.classList.toggle("picked", !!on[k]);
    };
    btns[k] = b;
    box.appendChild(b);
  });
  body.appendChild(box);
  function list(){ return Object.keys(on).filter(function(k){ return on[k]; }).map(Number).sort(); }
  cur = {
    get: list,
    empty: function(){ return list().length === 0; },
    right: function(){ return list().join() === s.answers.slice().sort().join(); },
    mark: function(final){
      Object.keys(btns).forEach(function(key){
        var n = +key, c = btns[key];
        c.classList.remove("ok", "no");
        var should = s.answers.indexOf(n) >= 0;
        if(on[n] && !should) c.classList.add("no");
        if(on[n] && should) c.classList.add("ok");
        if(final && should) c.classList.add("ok");
      });
    },
    restore: function(v, fin){ (v || []).forEach(function(k){ on[k] = true; if(btns[k]) btns[k].classList.add("picked"); }); if(fin) this.mark(true); }
  };
};

R.num = function(s, body){
  body.innerHTML = prompt(s);
  var wrap = h("div", "numboxes");
  var ins = [];
  s.boxes.forEach(function(bx){
    var row = h("label", "numrow");
    row.innerHTML = (bx.label ? '<span class="nlab">' + bx.label + '</span>' : "") +
      (bx.pre ? '<span class="aff">' + bx.pre + '</span>' : "");
    var inp = h("input"); inp.type = "text"; inp.inputMode = "text"; inp.setAttribute("autocapitalize", "off"); inp.spellcheck = false; inp.autocomplete = "off";
    inp.setAttribute("aria-label", bx.label ? stripTags(bx.label) : "Your answer");
    inp.addEventListener("keydown", function(e){ if(e.key === "Enter") $("checkBtn").click(); });
    row.appendChild(inp);
    if(bx.post) row.appendChild(h("span", "aff", bx.post));
    wrap.appendChild(row); ins.push(inp);
  });
  body.appendChild(wrap);
  var work = h("details", "working");
  work.innerHTML = '<summary>Working space (optional)</summary><textarea rows="3" aria-label="Working"></textarea>';
  body.appendChild(work);
  var wta = work.querySelector("textarea");
  function okBox(k){
    var bx = s.boxes[k], v = parseNum(ins[k].value);
    if(isNaN(v)) return false;
    var tol = bx.tol !== undefined ? bx.tol : 0.0001;
    var targets = [bx.a].concat(bx.alts || []);
    return targets.some(function(t){ return Math.abs(v - t) <= tol; });
  }
  cur = {
    get: function(){ return { v: ins.map(function(x){ return x.value; }), w: wta.value }; },
    empty: function(){ return ins.some(function(x){ return !x.value.trim(); }); },
    right: function(){ return ins.every(function(x, k){ return okBox(k); }); },
    mark: function(final){
      ins.forEach(function(x, k){
        var ok = okBox(k);
        x.classList.toggle("ok", !!ok); x.classList.toggle("no", !ok);
        if(final && !ok){ x.value = String(s.boxes[k].show || s.boxes[k].a); x.classList.remove("no"); x.classList.add("given"); }
      });
    },
    restore: function(v, fin){
      if(!v) return;
      (v.v || []).forEach(function(t, k){ if(ins[k]) ins[k].value = t; });
      wta.value = v.w || ""; if(v.w) work.open = true;
      if(fin) this.mark(true);
    }
  };
};

R.text = function(s, body){
  body.innerHTML = prompt(s);
  var ta = h("textarea", "shortans"); ta.rows = 2; ta.setAttribute("aria-label", "Your answer");
  body.appendChild(ta);
  function hit(){
    var t = " " + norm(ta.value) + " ";
    return s.need.every(function(group){
      /* match from the start of a word, so "all" does not hit "really" */
      return group.some(function(w){ return t.indexOf(" " + norm(w)) >= 0; });
    });
  }
  cur = {
    get: function(){ return ta.value; },
    empty: function(){ return !ta.value.trim(); },
    right: hit,
    mark: function(final){ ta.classList.toggle("ok", !!hit()); ta.classList.toggle("no", !hit() && !final); },
    restore: function(v){ ta.value = v || ""; }
  };
};

R.sort = function(s, body){
  body.innerHTML = prompt(s) + '<p class="tiny">Tap a card, then tap the box it belongs in. Tap a placed card to take it back out.</p>';
  var pool = h("div", "pool");
  var bins = h("div", "bins");
  var place = {}; // card index -> bucket index
  var sel = -1;
  var cardEls = [];
  var binEls = s.buckets.map(function(name, b){
    var bin = h("div", "bin");
    bin.innerHTML = '<div class="binname">' + name + '</div><div class="binbody"></div>';
    bin.onclick = function(e){
      if(resolved(state.pos)) return;
      if(e.target.closest(".scard")) return;
      if(sel >= 0){ place[sel] = b; sel = -1; draw(); }
    };
    bins.appendChild(bin);
    return bin;
  });
  var order = s.cards.map(function(c, k){ return k; });
  if(!s.keepOrder) order.sort(function(){ return Math.random() - 0.5; });
  order.forEach(function(k){
    var c = s.cards[k];
    var el = h("button", "scard", c[0]); el.type = "button";
    el.onclick = function(){
      if(resolved(state.pos)) return;
      if(place[k] !== undefined){ delete place[k]; sel = -1; }
      else sel = sel === k ? -1 : k;
      draw();
    };
    cardEls[k] = el;
  });
  function draw(){
    order.forEach(function(k){
      var el = cardEls[k];
      el.classList.toggle("sel", sel === k);
      var target = place[k] === undefined ? pool : binEls[place[k]].querySelector(".binbody");
      if(el.parentNode !== target) target.appendChild(el);
    });
    pool.classList.toggle("emptypool", Object.keys(place).length === s.cards.length);
  }
  body.appendChild(pool); body.appendChild(bins);
  draw();
  cur = {
    get: function(){ return JSON.parse(JSON.stringify(place)); },
    empty: function(){ return Object.keys(place).length < s.cards.length; },
    emptyMsg: "Pop every card into a box first.",
    right: function(){ return s.cards.every(function(c, k){ return place[k] === c[1]; }); },
    mark: function(final){
      s.cards.forEach(function(c, k){
        var el = cardEls[k];
        el.classList.remove("ok", "no");
        if(final){ place[k] = c[1]; el.classList.add("ok"); }
        else el.classList.add(place[k] === c[1] ? "ok" : "no");
      });
      if(final) draw();
    },
    restore: function(v, fin){ if(v){ place = v; draw(); } if(fin) this.mark(true); }
  };
};

R.order = function(s, body){
  body.innerHTML = prompt(s) + '<p class="tiny">Use the arrows to move things up and down until they are in order.</p>';
  var list = h("ol", "orderlist");
  var now = s.items.map(function(t, k){ return k; });
  var tries = 0;
  do { now.sort(function(){ return Math.random() - 0.5; }); tries++; }
  while(now.join() === s.items.map(function(t, k){ return k; }).join() && tries < 20);
  function draw(marks){
    list.innerHTML = "";
    now.forEach(function(k, pos){
      var li = h("li", marks ? (marks[pos] ? "ok" : "no") : "");
      li.innerHTML = '<span class="otext">' + s.items[k] + '</span>';
      var up = h("button", "obtn", "&uarr;"); up.type = "button"; up.setAttribute("aria-label", "Move up");
      var dn = h("button", "obtn", "&darr;"); dn.type = "button"; dn.setAttribute("aria-label", "Move down");
      up.disabled = pos === 0; dn.disabled = pos === now.length - 1;
      up.onclick = function(){ if(resolved(state.pos)) return; var t = now[pos - 1]; now[pos - 1] = now[pos]; now[pos] = t; draw(); };
      dn.onclick = function(){ if(resolved(state.pos)) return; var t = now[pos + 1]; now[pos + 1] = now[pos]; now[pos] = t; draw(); };
      li.appendChild(up); li.appendChild(dn);
      list.appendChild(li);
    });
  }
  draw();
  body.appendChild(list);
  cur = {
    get: function(){ return now.slice(); },
    empty: function(){ return false; },
    right: function(){ return now.every(function(k, p){ return k === p; }); },
    mark: function(final){
      if(final){ now = s.items.map(function(t, k){ return k; }); draw(now.map(function(){ return true; })); }
      else draw(now.map(function(k, p){ return k === p; }));
    },
    restore: function(v, fin){ if(v && v.length === now.length) now = v; draw(); if(fin) this.mark(true); }
  };
};

R.match = function(s, body){
  body.innerHTML = prompt(s);
  var rights = s.pairs.map(function(p){ return p[1]; });
  var opts = rights.slice().sort();
  var grid = h("div", "matchgrid");
  var sels = s.pairs.map(function(p){
    var row = h("div", "mrow");
    row.innerHTML = '<div class="mleft">' + p[0] + '</div>';
    var se = h("select");
    se.innerHTML = '<option value="">Choose...</option>' + opts.map(function(o){
      return '<option value="' + stripTags(o).replace(/"/g, "&quot;") + '">' + stripTags(o) + '</option>';
    }).join("");
    row.appendChild(se); grid.appendChild(row);
    return se;
  });
  body.appendChild(grid);
  cur = {
    get: function(){ return sels.map(function(x){ return x.value; }); },
    empty: function(){ return sels.some(function(x){ return !x.value; }); },
    right: function(){ return sels.every(function(x, k){ return x.value === stripTags(rights[k]); }); },
    mark: function(final){
      sels.forEach(function(x, k){
        var ok = x.value === stripTags(rights[k]);
        if(final && !ok){ x.value = stripTags(rights[k]); ok = true; }
        x.classList.toggle("ok", !!ok); x.classList.toggle("no", !ok);
      });
    },
    restore: function(v, fin){ (v || []).forEach(function(t, k){ if(sels[k]) sels[k].value = t; }); if(fin) this.mark(true); }
  };
};

R.write = function(s, body, i){
  body.innerHTML = prompt(s);
  if(s.starters && s.starters.length){
    body.appendChild(h("p", "tiny", "Stuck? Tap a starter to drop it in."));
    var chips = h("div", "starters");
    s.starters.forEach(function(t){
      var b = h("button", "", t); b.type = "button";
      b.onclick = function(){
        var was = ta.value;
        ta.value = was + (was && !/\s$/.test(was) ? " " : "") + t + " ";
        ta.focus(); keep();
      };
      chips.appendChild(b);
    });
    body.appendChild(chips);
  }
  var ta = h("textarea", "writebox"); ta.rows = 9; ta.setAttribute("aria-label", "Your writing");
  body.appendChild(ta);
  var wc = h("p", "tiny wc");
  body.appendChild(wc);
  var ticks = [];
  if(s.checklist && s.checklist.length){
    body.appendChild(h("p", "chiplabel", "Check it over"));
    var cl = h("div", "checklist");
    s.checklist.forEach(function(t, k){
      var lab = h("label", "");
      var cb = h("input"); cb.type = "checkbox";
      cb.onchange = keep;
      lab.appendChild(cb); lab.appendChild(h("span", "", t));
      cl.appendChild(lab); ticks.push(cb);
    });
    body.appendChild(cl);
  }
  var prev = state.answers[i] || {};
  if(prev.value){ ta.value = prev.value.text || ""; (prev.value.ticks || []).forEach(function(v, k){ if(ticks[k]) ticks[k].checked = v; }); }
  function words(){ var m = ta.value.trim().match(/\S+/g); return m ? m.length : 0; }
  function keep(){
    var n = words();
    wc.textContent = n + " word" + (n === 1 ? "" : "s") + (s.minWords ? " (aim for about " + s.minWords + ")" : "") + ". Saves as you type.";
    state.answers[i] = { status: n > 0 ? "done" : "skipped", value: { text: ta.value, ticks: ticks.map(function(t){ return t.checked; }) } };
    save();
  }
  ta.addEventListener("input", keep);
  keep();
  if(!ta.value) delete state.answers[i];
};

/* Jay's face, drawn small: messy brown hair, big eyebrows */
var JAYFACE = '<svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true">' +
  '<circle cx="20" cy="22" r="13" fill="#f3c9a4" stroke="#141a33" stroke-width="2"/>' +
  '<path d="M6 19 C5 8 14 4 20 6 C25 3 35 7 34 18 C31 13 28 15 25 11 C23 15 18 12 16 15 C13 12 10 16 6 19 Z" fill="#7a4b2a" stroke="#141a33" stroke-width="2" stroke-linejoin="round"/>' +
  '<path d="M12 19 L18 18 M22 18 L28 19" stroke="#3b2414" stroke-width="3" stroke-linecap="round"/>' +
  '<circle cx="15.5" cy="22.5" r="1.6" fill="#141a33"/><circle cx="24.5" cy="22.5" r="1.6" fill="#141a33"/>' +
  '<path d="M16 29 Q20 31.5 24 29" fill="none" stroke="#141a33" stroke-width="2" stroke-linecap="round"/></svg>';

R.mark = function(s, body){
  body.innerHTML = '<div class="prompt">' + s.q + '</div>' + fig(s);
  var card = h("div", "jaycard");
  card.innerHTML = '<div class="jayhead">' + JAYFACE + '<span><b>Jay&rsquo;s answer</b><small>' + (s.note || "Mark it like an examiner.") + '</small></span></div>';
  var list = h("ol", "jaylines");
  var lines = [];
  s.jay.forEach(function(t, k){
    var li = h("li", "", '<button type="button">' + t + '</button>');
    li.querySelector("button").onclick = function(){ if(resolved(state.pos)) return; pickLine = k; draw(); };
    list.appendChild(li); lines.push(li);
  });
  card.appendChild(list);
  body.appendChild(card);
  body.appendChild(h("p", "chiplabel", "1. Tap the line where Jay first goes wrong"));
  var allRight = h("button", "jayok", "Jay got it all right"); allRight.type = "button";
  allRight.onclick = function(){ if(resolved(state.pos)) return; pickLine = -1; draw(); };
  body.appendChild(allRight);
  body.appendChild(h("p", "chiplabel", "2. How many marks would you give, out of " + s.max + "?"));
  var mk = h("div", "markpick");
  var mbtn = [];
  for(var m = 0; m <= s.max; m++){
    (function(m){
      var b = h("button", "", String(m)); b.type = "button";
      b.onclick = function(){ if(resolved(state.pos)) return; pickMark = m; draw(); };
      mk.appendChild(b); mbtn.push(b);
    })(m);
  }
  body.appendChild(mk);
  var pickLine = -2, pickMark = -1;
  function draw(){
    lines.forEach(function(li, k){ li.classList.toggle("picked", pickLine === k); });
    allRight.classList.toggle("picked", pickLine === -1);
    mbtn.forEach(function(b, m){ b.classList.toggle("picked", pickMark === m); });
  }
  cur = {
    get: function(){ return { l: pickLine, m: pickMark }; },
    empty: function(){ return pickLine === -2 || pickMark < 0; },
    emptyMsg: "Pick a line (or Jay got it all right) and a mark first.",
    right: function(){ return pickLine === s.wrong && pickMark === s.award; },
    mark: function(final){
      lines.forEach(function(li, k){
        li.classList.remove("ok", "no");
        if(k === pickLine && k !== s.wrong) li.classList.add("no");
        if(k === s.wrong && (final || pickLine === k)) li.classList.add("ok");
      });
      allRight.classList.remove("ok", "no");
      if(pickLine === -1) allRight.classList.add(s.wrong === -1 ? "ok" : "no");
      if(final && s.wrong === -1) allRight.classList.add("ok");
      mbtn.forEach(function(b, m){
        b.classList.remove("ok", "no");
        if(m === pickMark && m !== s.award) b.classList.add("no");
        if(m === s.award && (final || pickMark === m)) b.classList.add("ok");
      });
    },
    restore: function(v, fin){ if(v){ pickLine = v.l; pickMark = v.m; draw(); } if(fin) this.mark(true); }
  };
};

R.unlock = function(s, body){
  var found = roomsFound();
  body.innerHTML = '<div class="prompt">' + s.q + '</div>';
  var got = h("div", "foundrow");
  got.innerHTML = found.map(function(d, k){
    return '<span class="found' + (d === null ? " missing" : "") + '"><small>' + stripTags(chunks[k].topic) + '</small><b>' + (d === null ? "?" : d) + '</b></span>';
  }).join("");
  body.appendChild(got);
  if(found.indexOf(null) >= 0) body.appendChild(h("p", "tiny", "A question mark means that room is not finished yet. You can go back for it any time, or try the door anyway."));
  var lock = h("div", "lockboxes");
  var ins = [];
  for(var k = 0; k < s.code.length; k++){
    var inp = h("input"); inp.type = "text"; inp.maxLength = 1; inp.autocomplete = "off"; inp.inputMode = "text";
    inp.setAttribute("aria-label", "Code character " + (k + 1));
    (function(k, inp){
      inp.addEventListener("input", function(){ if(inp.value && ins[k + 1]) ins[k + 1].focus(); });
      inp.addEventListener("keydown", function(e){
        if(e.key === "Backspace" && !inp.value && ins[k - 1]) ins[k - 1].focus();
        if(e.key === "Enter") $("checkBtn").click();
      });
    })(k, inp);
    lock.appendChild(inp); ins.push(inp);
  }
  body.appendChild(lock);
  function val(){ return ins.map(function(x){ return x.value.trim(); }).join(""); }
  cur = {
    get: val,
    empty: function(){ return val().length < s.code.length; },
    emptyMsg: "Fill every box in the lock first.",
    right: function(){ return val().toLowerCase() === String(s.code).toLowerCase(); },
    mark: function(final){
      var ok = val().toLowerCase() === String(s.code).toLowerCase();
      if(final && !ok) ins.forEach(function(x, k){ x.value = String(s.code).charAt(k); });
      ins.forEach(function(x){ x.classList.toggle("ok", ok || final); x.classList.toggle("no", !ok && !final); });
      if(ok || final){ state.escaped = true; save(); }
    },
    restore: function(v){ String(v || "").split("").forEach(function(c, k){ if(ins[k]) ins[k].value = c; }); }
  };
};

R.widget = function(s, body, i){
  body.innerHTML = (s.title ? '<h3 class="learnh">' + s.title + '</h3>' : "") + (s.html ? '<div class="prompt">' + s.html + '</div>' : "");
  var host = h("div", "widget");
  body.appendChild(host);
  if(!state.widgets[i]) state.widgets[i] = {};
  var api = {
    data: state.widgets[i],
    save: save,
    done: function(result){
      var prev = state.answers[i];
      var first = !(prev && resolved(i));
      if(!(prev && resolved(i) && rank(prev.status) >= rank(result))) state.answers[i] = { status: result || "done" };
      if(first) bump(result || "done", host);
      save();
      setButtons(s, i);
      drawChips();
    },
    resolved: function(){ return resolved(i); }
  };
  s.mount(host, api);
};

function rank(st){ return { right1: 4, right2: 3, done: 2, shown: 1 }[st] || 0; }

/* ---------- checking ---------- */
function check(giveUp){
  var i = state.pos, s = steps[i];
  if(!cur) return;
  var a = state.answers[i] || { tries: 0 };
  if(!giveUp && cur.empty()){
    flash(cur.emptyMsg || "Pop an answer in first, or tap Skip for now.");
    return;
  }
  if(giveUp){
    a.status = "shown";
  }else if(cur.right()){
    a.status = a.tries ? "right2" : "right1";
  }else{
    a.tries = (a.tries || 0) + 1;
    if(a.tries >= 2) a.status = "shown";
    else a.status = "trying";
  }
  a.value = cur.get();
  state.answers[i] = a;
  save();

  if(a.status === "trying"){
    cur.mark(false);
    var fb = $("qFb");
    fb.className = "fb nudge";
    fb.innerHTML = '<b>' + pick(NUDGE) + '</b> ' + (s.hint || "Have another look at the question, then try again.") +
      '<br><span class="tiny">Change your answer and press Check again, or tap Show me.</span>';
    setButtons(s, i);
    return;
  }
  cur.mark(a.status === "shown");
  if(cfg.review) reviewResult(s._orig, a.status); else noteForReview(i, a.status);
  bump(a.status, $("checkBtn"));
  showFeedback(s, a.status, false);
  setButtons(s, i);
  drawChips();
}

/* streak and confetti when something lands */
function bump(status, from){
  if(status === "right1"){
    state.streak = (state.streak || 0) + 1;
    if(state.streak > (state.best || 0)) state.best = state.streak;
  }else if(status !== "done"){
    state.streak = 0;
  }
  save();
  if(status === "right1" || status === "right2" || status === "done") confetti(from, status === "right1" && state.streak >= 3 ? 18 : 10);
}

function showFeedback(s, status, quiet){
  var fb = $("qFb");
  var head;
  if(status === "right1") head = '<b>' + (quiet ? "You got this one first go." : pick(GOOD)) + '</b>';
  else if(status === "right2") head = '<b>' + (quiet ? "Got there on the second go." : "Got there. Second go counts.") + '</b>';
  else head = '<b>Here is how this one works.</b>';
  var extra = "";
  if(status === "shown" && s.model) extra = '<div class="model"><span class="tiny">A good answer:</span> ' + s.model + '</div>';
  fb.className = "fb " + (status === "shown" ? "show" : "good");
  var plus = quiet ? "" : '<span class="plus">+' + (SPARK[status] || 0) + ' sparks</span>';
  var streak = !quiet && status === "right1" && state.streak >= 3 ? ' <span class="tiny">That is ' + state.streak + ' first go in a row.</span>' : "";
  fb.innerHTML = plus + head + streak + (s.why ? '<div class="why">' + s.why + '</div>' : "") + extra;
}

function flash(msg){
  var fb = $("qFb");
  fb.className = "fb nudge";
  fb.innerHTML = msg;
}

/* ---------- results ---------- */
function finish(){
  state.finished = true; save();
  showOnly("resultCard");
  if(cfg.review){ finishReview(); return; }
  var sm = summary();
  var marked = sm.got1 + sm.got2 + sm.shown;
  $("scoreLine").textContent = (sm.got1 + sm.got2) + " out of " + (marked || 0) + " worked out";
  if(cfg.escape && state.escaped){
    $("scoreLine").textContent = "You escaped" + (state.clock && state.elapsed ? " in " + fmtTime(state.elapsed) : "") + ".";
    if(state.clock && state.elapsed && (!state.bestTime || state.elapsed < state.bestTime)){ state.bestTime = state.elapsed; save(); }
  }
  var note;
  var pct = marked ? (sm.got1 + sm.got2) / marked : 0;
  if(cfg.escape && state.escaped) note = (cfg.escape.outro ? stripTags(cfg.escape.outro) + " " : "") + "Every room is still here if you want another go, or to beat your time.";
  else if(!marked) note = "Nothing answered yet, and that is fine. Dip back in whenever.";
  else if(pct >= 0.85) note = "That is strong. The stretch questions are where the higher grades live, so those are worth another look if any slipped.";
  else if(pct >= 0.6) note = "Solid. The sections below with shorter bars are the ones worth a second visit on another day.";
  else note = "Every Show me you used is something you now know more about than before. Coming back to this in a few days is exactly how revision sticks.";
  $("scoreNote").textContent = note;

  $("tally").innerHTML =
    '<div class="tbox big"><b>' + sm.sparks + '</b><span>sparks</span></div>' +
    tallyBox(sm.best, "best streak") +
    tallyBox(sm.got1, "first go") + tallyBox(sm.got2, "second go") +
    tallyBox(sm.shown, "learnt from Show me") + tallyBox(sm.skipped, "skipped for now");

  var topics = {}, tOrder = [];
  steps.forEach(function(s, i){
    if(!scored(s)) return;
    if(!topics[s.topic]){ topics[s.topic] = { got: 0, n: 0 }; tOrder.push(s.topic); }
    var a = state.answers[i];
    if(a && ["right1", "right2", "shown"].indexOf(a.status) >= 0){
      topics[s.topic].n++;
      if(a.status !== "shown") topics[s.topic].got++;
    }
  });
  var bars = $("topicBars"); bars.innerHTML = "";
  tOrder.forEach(function(t){
    var o = topics[t];
    var p = o.n ? Math.round(o.got / o.n * 100) : 0;
    var col = !o.n ? "#d9d8e6" : p >= 75 ? "#1f9d63" : p >= 50 ? "#ffd23f" : "#ff5d5d";
    var row = h("div", "row");
    row.innerHTML = '<span class="name">' + t + '</span><span class="track"><span class="fill" style="width:' + (o.n ? Math.max(p, 4) : 0) + '%;background:' + col + '"></span></span><span class="score">' + (o.n ? o.got + "/" + o.n : "not tried") + '</span>';
    bars.appendChild(row);
  });

  var rl = $("reviewList"); rl.innerHTML = "";
  var n = 0;
  steps.forEach(function(s, i){
    if(s.type === "learn") return;
    n++;
    var a = state.answers[i];
    var st = a ? a.status : "not tried";
    var lab = { right1: "First go", right2: "Second go", shown: "Learnt from Show me", done: "Done", skipped: "Skipped", trying: "Started" }[st] || "Not tried";
    var cls = st === "right1" || st === "right2" || st === "done" ? "right" : "diff";
    var item = h("div", "review-item");
    item.innerHTML = '<span class="tag ' + cls + '">Q' + n + ' ' + lab + '.</span> ' + stripTags(s.q || s.title || s.html || "").slice(0, 140);
    var jump = h("button", "linkish", "Go to it"); jump.type = "button";
    jump.onclick = function(){ go(i); };
    item.appendChild(jump);
    rl.appendChild(item);
  });
  confetti($("scoreLine"), 30);
}

function finishReview(){
  var g1 = 0, g2 = 0, sh = 0, sk = 0;
  steps.forEach(function(s, i){
    var a = state.answers[i];
    if(!a) return;
    if(a.status === "right1") g1++; else if(a.status === "right2") g2++;
    else if(a.status === "shown") sh++; else if(a.status === "skipped") sk++;
  });
  var n = g1 + g2 + sh;
  $("scoreLine").textContent = n ? (g1 + g2) + " out of " + n + " this time" : "Nothing answered, and that is fine";
  $("scoreNote").textContent = "Anything you got first go will come back once more, further apart, then drop off the list. " +
    "Anything that needed Show me or a second go will come back in a couple of days.";
  $("tally").innerHTML = (g1 ? tallyBox(g1, "first go") : "") + (g2 ? tallyBox(g2, "second go") : "") +
    (sh ? tallyBox(sh, "learnt from Show me") : "") + (sk ? tallyBox(sk, "skipped for now") : "");
  $("topicBars").innerHTML = "";
  $("reviewList").innerHTML = "";
  document.querySelector("#resultCard details.review").classList.add("hidden");
  $("againBtn").classList.add("hidden");
  $("freshBtn").classList.add("hidden");
  if(n) confetti($("scoreLine"), 20);
}

function tallyBox(n, label){
  return '<div class="tbox"><b>' + n + '</b><span>' + label + '</span></div>';
}

function reportText(){
  var sm = summary();
  var lines = [];
  lines.push(cfg.subject + ": " + (cfg.review ? "Second look, " : "") + cfg.title);
  lines.push("First go: " + sm.got1 + ", second go: " + sm.got2 + ", learnt from Show me: " + sm.shown + ", skipped: " + sm.skipped + " (of " + sm.marked + " marked questions)");
  lines.push("Sparks: " + sm.sparks + ", best streak: " + sm.best + ", chunks done: " + sm.chunksDone + " of " + sm.chunks);
  lines.push("");
  var n = 0, lastTopic = "";
  steps.forEach(function(s, i){
    if(s.type === "learn") return;
    n++;
    if(s.topic !== lastTopic){ lines.push("== " + s.topic + " =="); lastTopic = s.topic; }
    var a = state.answers[i];
    var st = a ? a.status : "not tried";
    var lab = { right1: "first go", right2: "second go", shown: "Show me", done: "done", skipped: "skipped", trying: "started" }[st] || "not tried";
    lines.push("Q" + n + (s.stretch ? " (stretch)" : "") + ": " + lab + "  |  " + stripTags(s.q || s.title || "").slice(0, 90));
    if(s.type === "write" && a && a.value && a.value.text){
      lines.push("");
      lines.push(a.value.text);
      lines.push("");
    }
    if(s.type === "num" && a && a.value && a.value.w){
      lines.push("   working: " + a.value.w.replace(/\s+/g, " "));
    }
    if(s.type === "text" && a && a.value){
      lines.push("   answer: " + String(a.value).replace(/\s+/g, " "));
    }
    if(s.type === "widget" && s.report){
      var r = s.report(state.widgets[i] || {});
      if(r) lines.push("   " + r);
    }
  });
  return lines.join("\n");
}

/* ---------- second look start card ---------- */
function buildReviewStart(){
  var sc = $("startCard");
  var n = steps.length;
  sc.innerHTML = '<span class="kicker">' + cfg.subject + ' &middot; second look</span>' +
    '<h3>A second look</h3>' +
    (n ? '<p class="lead">' + n + ' question' + (n === 1 ? "" : "s") + ' from <b>' + cfg.title + '</b> that needed Show me or a second go last time. ' +
      'Same as before: two goes, and Show me whenever you want it.</p>' +
      '<p class="tiny">Each one has a reminder of the idea tucked underneath, if you would like it.</p>' +
      '<div class="qnav"><button class="btn" id="beginBtn">Start</button><a class="btn btn-quiet" href="' + HQ.base + '">Not now</a></div>'
    : '<p class="lead">Nothing from this activity is waiting for a second look right now.</p>' +
      '<div class="qnav"><a class="btn" href="' + HQ.base + cfg.id + '.html">Open the activity</a><a class="btn btn-quiet" href="' + HQ.base + '">Back to HQ</a></div>');
  if(n) $("beginBtn").onclick = function(){ go(0); };
}

/* ---------- start ---------- */
function run(c){
  var reviewMode = (location.hash || "") === "#review";
  if(reviewMode){
    var d = loadReview(), today = addDays(0), list = [];
    Object.keys(d.items).forEach(function(k){
      var it = d.items[k];
      if(it.id === c.id && it.due <= today && reviewable(c.steps[it.i])) list.push(it);
    });
    list.sort(function(a, b){ return a.i - b.i; });
    cfg = {}; Object.keys(c).forEach(function(k){ cfg[k] = c[k]; });
    cfg.review = true;
    steps = list.map(function(it){
      var copy = {}, src = c.steps[it.i];
      Object.keys(src).forEach(function(k){ copy[k] = src[k]; });
      copy._orig = it.i;
      copy._remind = findLearn(c.steps, it.i);
      return copy;
    });
    key = PREFIX + c.id + ".review.v1";
    state = fresh();
  }else{
    cfg = c; steps = c.steps; key = PREFIX + c.id + ".v1";
    state = load() || fresh();
  }
  if(!state.widgets) state.widgets = {};
  try{ localStorage.setItem("base5.who.v1", HQ.who); }catch(e){}
  document.title = c.title + " - " + HQ.who + " GCSE HQ";
  makeChunks();
  build();
  if(cfg.review) buildReviewStart();
  showStart();
  save();
  window.addEventListener("hashchange", function(){
    if(((location.hash || "") === "#review") !== !!cfg.review) location.reload();
  });
  if(cfg.review) return;
  /* /egw/page.html#chunk-3 opens straight onto chunk 3 */
  var m = (location.hash || "").match(/^#chunk-(\d+)$/);
  if(m && chunks[+m[1] - 1]) go(chunks[+m[1] - 1].from);
  window.addEventListener("hashchange", function(){
    var h = (location.hash || "").match(/^#chunk-(\d+)$/);
    if(h && chunks[+h[1] - 1]) go(chunks[+h[1] - 1].from);
  });
}

return { run: run, parseNum: parseNum, norm: norm };
})();
