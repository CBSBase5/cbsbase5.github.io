/* ==========================================================
   Base 5 - Autumn 2 project space (projects/<initials>.html)

   Each project page is a small shell that sets
     window.PROJECT = { who: "JT" }
   and loads this file, which draws the gate and the workspace.
   Per-student touches (nudges, last half term) live in PEOPLE.

   Saved under the page's sync prefix (see /data/b5site.js), so the
   work follows the student between school devices:
     <prefix>a2.v1   this half term's project
   Last half term's work keeps its own keys and its own page in
   /autumn-1/projects/, untouched.

   Same lock as the rest of the site (/data/b5lock.js): signed in to
   the student's school account it opens by itself, otherwise their
   code. No code is written in this file.
   ASCII only.
   ========================================================== */
(function(){
"use strict";

var QUESTION = "If we could time travel, should we?";

var STAGES = [
  { n: "Wondering", hint: 'No rush at all. <a href="/projects/ideas.html">The Idea Lab</a> is good for this bit, or just jot anything below.' },
  { n: "Got an idea", hint: "Give it a working title and a shape below. It can still change." },
  { n: "Making it", hint: "The main box and the time machine log are your friends now." },
  { n: "Finishing touches", hint: "Small tweaks. Maybe show someone, or send Jay a look." },
  { n: "Ready to show", hint: "Nice one. Send it to Jay whenever you like, or keep tinkering." }
];

var FORMS = [
  ["Song", "Lyrics", "verses, chorus, whatever comes"],
  ["Film", "Script and shots", "scenes, what the camera sees, what we hear"],
  ["Musical", "Scenes and songs", "who is on stage, what they sing"],
  ["Game", "How it plays", "the goal, the rules, what happens when you win or lose"],
  ["Model", "Plan and measurements", "what you will build, how big, what from"],
  ["Comic", "Panels", "one line per panel: what we see, what they say"],
  ["Story", "The story", "start anywhere, even the end"],
  ["Podcast", "What gets said", "who talks, what about, in what order"],
  ["Art or poster", "What goes on it", "pictures, words, colours"],
  ["Something else", "The main thing", "whatever your project needs"]
];

var NUDGES = [
  "Yes, no, or it depends? Write the one sentence you would say if someone asked you right now.",
  "Pick one year you would visit. What is the first thing you would notice?",
  "What is one thing you would never, ever change in the past? Why that?",
  "Who should be in charge of a time machine? Who definitely should not?",
  "If you brought one thing back from the past, what could go wrong?",
  "What would someone from 1926 think of your phone?",
  "Would Bonnie cope in 1066? Make the case.",
  "What would future you, ten years from now, tell you to do?"
];

var PEOPLE = {
  JT:  { slug: "jt",  last: "your song, written to LIFE",
         nudges: ["One football match you would go back and watch. Would you change the result?",
                  "Write a chorus a crowd could chant in any century."] },
  LW:  { slug: "lw",  last: "your musical",
         nudges: ["A big number for someone who arrives in completely the wrong year.",
                  "Detective work through time: what clue would only make sense in the future?"] },
  LC:  { slug: "lc",  last: "your scary film",
         nudges: ["A time machine that only goes to empty places at 3am. Where does it land first?",
                  "What sound tells you the year has changed before you see anything?"] },
  EGW: { slug: "egw", last: "",
         nudges: ["Which scientist from your Biology would you visit, and what would you ask them?",
                  "Statistics question: if you changed one thing in the past, how would you measure what changed?"],
         extra: { kicker: "Project time on GCSE work?", title: "Your time travel revision trip",
                  text: "English, Maths, Biology and Statistics on a trip through time, in your GCSE HQ.",
                  href: "/egw/time-travel.html", go: "Open the trip" } },
  LP:  { slug: "lp",  last: "",
         nudges: ["If you could go back and watch maths being invented, which bit would you pick?",
                  "Write a message to someone in 1926. What do they need to know?"],
         extra: { kicker: "Project time on GCSE work?", title: "Your GCSE HQ",
                  text: "English and Maths, chunked and ready, whenever project time is revision time.",
                  href: "/lp/", go: "Open your HQ" } },
  HK:  { slug: "hk",  last: "your model village",
         nudges: ["If you could fish any river in any year, which one and when?",
                  "One street, three times: what does it look like in 1850, now, and 2150?"] }
};

var QUIPS = [
  "Bonnie has been to 1066. She did not rate it.",
  "Jay tried this once and ended up in a Tuesday. Any Tuesday.",
  "Warning: do not step on any butterflies.",
  "The time machine says hello. It also says it needs a service.",
  "You briefly visited 3026. They still have Monday mornings."
];

/* ---------- set up ---------- */
var P = window.PROJECT || {};
var WHO = P.who, ME = PEOPLE[WHO];
if(!ME) return;
var S = window.B5Site || {};
var prefix = S.syncPrefix || ("b5.project." + ME.slug + ".");
var KEY = prefix + (/[.]$/.test(prefix) ? "" : ".") + "a2.v1";
var OPEN = KEY + ".open";

function el(id){ return document.getElementById(id); }
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]; }); }
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
var DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], MONS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function shortDate(iso){ var d = new Date(iso); return isNaN(d) ? "" : DAYS[d.getDay()] + " " + d.getDate() + " " + MONS[d.getMonth()]; }

var data = { stage: -1, answer: "", because: "", thinking: [], form: "", title: "", main: "", log: [], bits: [] };
function load(){
  try{
    var d = JSON.parse(localStorage.getItem(KEY) || "null");
    if(d && typeof d === "object"){ for(var k in d){ if(Object.prototype.hasOwnProperty.call(d, k)) data[k] = d[k]; } }
  }catch(e){}
  ["thinking","log","bits"].forEach(function(k){ if(!Array.isArray(data[k])) data[k] = []; });
}
var savedT = null;
function save(){
  try{ localStorage.setItem(KEY, JSON.stringify(data)); }catch(e){}
  [].forEach.call(document.querySelectorAll(".pj .saved"), function(n){ n.textContent = "Saved"; });
  clearTimeout(savedT);
  savedT = setTimeout(function(){ [].forEach.call(document.querySelectorAll(".pj .saved"), function(n){ n.textContent = ""; }); }, 1800);
}

/* ---------- the Idea Lab, if it was used on this device ---------- */
function ideaLab(){
  try{
    var st = JSON.parse(localStorage.getItem("b5.projects.ideas.v1") || "null");
    if(!st || !Array.isArray(st.shelf) || !st.shelf.length) return null;
    var pickd = st.shape && st.shape.idea ? st.shelf.filter(function(i){ return i.id === st.shape.idea; })[0] : null;
    var starred = st.shelf.filter(function(i){ return i.star; })[0];
    var idea = pickd || starred || null;
    if(!idea) return null;
    return { text: String(idea.text || ""), form: (st.shape && pickd && st.shape.form) || "" };
  }catch(e){ return null; }
}

/* ---------- drawing ---------- */
var POD = '<svg viewBox="0 0 44 34" aria-hidden="true"><path d="M6 24h32" stroke="#0a2f38" stroke-width="3" stroke-linecap="round"/>' +
  '<rect x="8" y="4" width="28" height="20" rx="10" fill="#ffc247" stroke="#0a2f38" stroke-width="3"/>' +
  '<circle cx="22" cy="14" r="5" fill="#fffdf8" stroke="#0a2f38" stroke-width="2.5"/><path d="M22 11v3l2 1.5" stroke="#ef7724" stroke-width="2" stroke-linecap="round" fill="none"/>' +
  '<path d="M3 30l3-4M41 30l-3-4" stroke="#ef7724" stroke-width="2.5" stroke-linecap="round"/></svg>';

function card(edge, w, inner){ return '<div class="card ' + w + '" style="--edge:var(--' + edge + ')">' + inner + '</div>'; }

function build(){
  var labDraft = ideaLab();
  var h = "";

  h += card("orange", "w12",
    '<span class="kicker">Where you have got to</span>' +
    '<h3>Set the dial</h3>' +
    '<p class="lead">Tap wherever you are. Only you move it, and going backwards is fine.</p>' +
    '<div class="track" id="track"><div class="fill" id="trackFill"></div><span class="pod" id="pod" role="presentation">' + POD + '</span>' +
      STAGES.map(function(s, i){ return '<button type="button" class="stop" data-i="' + i + '"><i class="dot"></i><span>' + s.n + '</span></button>'; }).join("") +
    '</div>' +
    '<p class="stagehint" id="stageHint"></p><p class="quip" id="quip" aria-live="polite"></p>');

  h += card("plum", "w12",
    '<span class="kicker">The big question</span>' +
    '<h3>' + esc(QUESTION) + '</h3>' +
    '<p class="lead">Your answer so far. Changing your mind is allowed: it usually means you are thinking.</p>' +
    '<div class="answers" id="answers">' + ["Yes","No","It depends","Not sure yet"].map(function(a){ return '<button type="button" data-a="' + a + '" aria-pressed="false">' + a + '</button>'; }).join("") + '</div>' +
    '<label class="fld" for="because">Because... <small>optional, a few words is plenty</small></label>' +
    '<input type="text" id="because" maxlength="240" autocomplete="off">' +
    '<ul class="thinking" id="thinking"></ul><p class="saved"></p>');

  h += card("teal", "w12",
    '<span class="kicker">What you are making</span>' +
    '<h3>Your answer, in any shape</h3>' +
    '<label class="fld" for="ptitle">Working title <small>if it has one yet</small></label>' +
    '<input type="text" id="ptitle" maxlength="120" autocomplete="off">' +
    '<p class="fld">It might be a...</p>' +
    '<div class="chipset" id="forms">' + FORMS.map(function(f){ return '<button type="button" data-f="' + esc(f[0]) + '" aria-pressed="false">' + esc(f[0]) + '</button>'; }).join("") + '</div>' +
    (labDraft
      ? '<div class="fromlab" id="fromLab"><b>From your Idea Lab:</b> ' + esc(labDraft.text) + (labDraft.form ? ' <i>(might be: ' + esc(labDraft.form) + ')</i>' : '') +
        '<br><button type="button" class="btn btn-quiet" id="useLab">Pop it in my notes</button></div>'
      : '<p class="lead" style="margin-top:12px">Need a spark? <a href="/projects/ideas.html">The Idea Lab</a> spins a time machine for you.</p>') +
    '<p class="saved"></p>');

  h += card("bright", "w12",
    '<span class="kicker">The main thing</span>' +
    '<h3 id="mainHead">The main thing</h3>' +
    '<label class="fld" for="main" id="mainLab"></label>' +
    '<textarea class="big" id="main"></textarea>' +
    '<p class="fld">Stuck? Tap a nudge and it drops into the box:</p>' +
    '<div class="chipset" id="nudges"></div><p class="saved"></p>');

  h += card("yellow-deep", "w12",
    '<span class="kicker">Time machine log</span>' +
    '<h3>Where you went today</h3>' +
    '<p class="lead">A quick note at the end of a session, if you fancy. Future you will thank you.</p>' +
    '<div class="row2"><div><label class="fld" for="logDid">What I did</label><input type="text" id="logDid" maxlength="240" autocomplete="off"></div>' +
    '<div><label class="fld" for="logNext">Next time I might <small>optional</small></label><input type="text" id="logNext" maxlength="240" autocomplete="off"></div></div>' +
    '<p class="addrow"><button type="button" class="btn" id="logAdd">Add to the log</button></p>' +
    '<ul class="loglist" id="logList"></ul>');

  h += card("teal", "w12",
    '<span class="kicker">Bits and pieces</span>' +
    '<h3>Photos, videos, drawings, files</h3>' +
    '<p class="lead">Put them in your school Google Drive, then paste the link here so they all live in one place.</p>' +
    '<div class="row2"><div><label class="fld" for="bitTitle">What it is</label><input type="text" id="bitTitle" maxlength="120" autocomplete="off" placeholder="e.g. photo of the first street"></div>' +
    '<div><label class="fld" for="bitHref">Link</label><input type="url" id="bitHref" maxlength="600" autocomplete="off" placeholder="https://drive.google.com/..."></div></div>' +
    '<p class="addrow"><button type="button" class="btn" id="bitAdd">Add it</button> <span class="saved" id="bitMsg"></span></p>' +
    '<ul class="bitlist" id="bitList"></ul>');

  if(ME.extra){
    h += card("plum", "w12",
      '<span class="kicker">' + esc(ME.extra.kicker) + '</span><h3>' + esc(ME.extra.title) + '</h3>' +
      '<p class="lead">' + esc(ME.extra.text) + '</p><a class="btn" href="' + esc(ME.extra.href) + '">' + esc(ME.extra.go) + '</a>');
  }

  h += '<div class="card w12" style="--edge:var(--orange)"><span class="kicker">Show Jay</span><div id="sendHost"></div></div>';

  h += card("line", "w12 a1card",
    '<span class="kicker">Last half term</span><h3>Autumn 1, kept safe</h3>' +
    '<p>' + (ME.last ? "Everything from " + esc(ME.last) + " is still there, exactly as you left it." : "Your Autumn 1 project space is still there, exactly as you left it.") + '</p>' +
    '<a class="btn btn-quiet" href="/autumn-1/projects/' + ME.slug + '.html">Look back at it</a>');

  el("work").innerHTML = h;
  wire();
}

function drawStage(){
  var i = data.stage;
  [].forEach.call(document.querySelectorAll(".stop"), function(b, n){
    b.classList.toggle("on", n === i);
    b.classList.toggle("past", i > -1 && n < i);
    b.setAttribute("aria-pressed", n === i ? "true" : "false");
  });
  var pos = i < 0 ? 0 : i;
  el("pod").style.left = (10 + pos * 20) + "%";
  el("trackFill").style.width = (i < 0 ? 0 : i * 20) + "%";
  el("stageHint").innerHTML = i < 0 ? "Nothing set yet. Wondering is a perfectly good place to start." : STAGES[i].hint;
}

function drawAnswer(){
  [].forEach.call(document.querySelectorAll("#answers button"), function(b){ b.setAttribute("aria-pressed", b.dataset.a === data.answer ? "true" : "false"); });
  el("because").value = data.because || "";
  var t = data.thinking.slice(-6).reverse();
  el("thinking").innerHTML = t.length
    ? '<li style="background:none;padding:0;opacity:.75">Where your thinking has been:</li>' + t.map(function(x){
        return '<li><span class="when">' + esc(shortDate(x.at)) + '</span><b>' + esc(x.a) + '</b>' + (x.because ? ", because " + esc(x.because) : "") + '</li>';
      }).join("")
    : "";
}

function formRow(){ var f = FORMS.filter(function(x){ return x[0] === data.form; })[0]; return f || FORMS[FORMS.length - 1]; }
function drawForm(){
  [].forEach.call(document.querySelectorAll("#forms button"), function(b){ b.setAttribute("aria-pressed", b.dataset.f === data.form ? "true" : "false"); });
  var f = formRow();
  el("mainHead").textContent = f[1];
  el("mainLab").innerHTML = data.form ? 'Saves as you type <small>(' + esc(f[2]) + ')</small>' : 'Saves as you type <small>(anything at all, while you work out what it is)</small>';
}

function drawNudges(){
  var list = ME.nudges.concat(NUDGES);
  el("nudges").innerHTML = list.map(function(n, i){ return '<button type="button" data-n="' + i + '">' + esc(n) + '</button>'; }).join("");
  el("nudges").onclick = function(e){
    var b = e.target.closest("button[data-n]"); if(!b) return;
    var ta = el("main"), cur = ta.value;
    ta.value = cur + (cur && !/\n\s*$/.test(cur) ? "\n\n" : "") + "[" + list[+b.dataset.n] + "]\n";
    data.main = ta.value; save(); ta.focus();
  };
}

function drawLog(){
  var L = data.log.slice().reverse();
  el("logList").innerHTML = L.length ? L.map(function(x){
    return '<li><span class="stampd">' + esc(shortDate(x.at)) + '</span><span class="txt">' + esc(x.did) +
      (x.next ? '<span class="nx">Next time: ' + esc(x.next) + '</span>' : '') + '</span>' +
      '<button type="button" class="rm" data-id="' + esc(x.id) + '">Remove</button></li>';
  }).join("") : '<li style="background:none;padding:0"><span class="empty">Nothing logged yet.</span></li>';
}

function safeHref(u){ u = String(u || "").trim(); return /^https?:\/\/\S+$/i.test(u) ? u : ""; }
function drawBits(){
  el("bitList").innerHTML = data.bits.length ? data.bits.map(function(x){
    var u = safeHref(x.href);
    return '<li><span class="txt">' + (u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(x.title || "Untitled") + '</a>' : esc(x.title)) + '</span>' +
      '<button type="button" class="rm" data-id="' + esc(x.id) + '">Remove</button></li>';
  }).join("") : '<li style="background:none;padding:0"><span class="empty">Nothing here yet.</span></li>';
}

function workText(){
  var L = [WHO + "'s project - Autumn 2", "The big question: " + QUESTION, ""];
  L.push("Where I have got to: " + (data.stage > -1 ? STAGES[data.stage].n : "not set"));
  L.push("My answer so far: " + (data.answer || "not picked") + (data.because ? ", because " + data.because : ""));
  L.push("Working title: " + (data.title || "none yet"));
  L.push("It might be a: " + (data.form || "not sure yet"));
  L.push("", "== " + formRow()[1] + " ==", data.main || "(nothing yet)");
  if(data.log.length){ L.push("", "== Time machine log =="); data.log.forEach(function(x){ L.push(shortDate(x.at) + ": " + x.did + (x.next ? " (next time: " + x.next + ")" : "")); }); }
  if(data.bits.length){ L.push("", "== Bits and pieces =="); data.bits.forEach(function(x){ L.push((x.title || "Untitled") + ": " + x.href); }); }
  return L.join("\n");
}

var podTaps = 0;
function wire(){
  el("track").addEventListener("click", function(e){
    var b = e.target.closest(".stop"); if(!b) return;
    var i = +b.dataset.i;
    data.stage = data.stage === i && i === 0 ? -1 : i;
    save(); drawStage();
  });
  /* a small hidden thing: tap the time machine a few times */
  el("pod").addEventListener("click", function(){
    podTaps++;
    if(podTaps % 4 === 0){
      var p = el("pod"); p.classList.remove("zap"); void p.offsetWidth; p.classList.add("zap");
      el("quip").textContent = QUIPS[Math.floor(Math.random() * QUIPS.length)];
    }
  });

  el("answers").addEventListener("click", function(e){
    var b = e.target.closest("button[data-a]"); if(!b) return;
    var a = b.dataset.a;
    if(a === data.answer) return;
    data.answer = a; data.because = "";
    data.thinking.push({ a: a, because: "", at: new Date().toISOString() });
    data.thinking = data.thinking.slice(-30);
    save(); drawAnswer();
  });
  el("because").addEventListener("input", function(){
    data.because = this.value;
    var last = data.thinking[data.thinking.length - 1];
    if(last && last.a === data.answer) last.because = this.value;
    save();
  });
  el("because").addEventListener("change", drawAnswer);

  el("ptitle").value = data.title || "";
  el("ptitle").addEventListener("input", function(){ data.title = this.value; save(); });
  el("forms").addEventListener("click", function(e){
    var b = e.target.closest("button[data-f]"); if(!b) return;
    data.form = data.form === b.dataset.f ? "" : b.dataset.f;
    save(); drawForm();
  });
  var useLab = el("useLab");
  if(useLab) useLab.addEventListener("click", function(){
    var lab = ideaLab(); if(!lab) return;
    var ta = el("main"), cur = ta.value, line = "From the Idea Lab: " + lab.text;
    if(cur.indexOf(line) < 0){ ta.value = line + "\n\n" + cur; data.main = ta.value; }
    if(!data.form && lab.form && FORMS.some(function(f){ return f[0] === lab.form; })){ data.form = lab.form; drawForm(); }
    save(); useLab.textContent = "Done, it is in the main box"; useLab.disabled = true;
  });

  el("main").value = data.main || "";
  el("main").addEventListener("input", function(){ data.main = this.value; save(); });

  el("logAdd").addEventListener("click", function(){
    var did = el("logDid").value.trim(), nx = el("logNext").value.trim();
    if(!did){ el("logDid").focus(); return; }
    data.log.push({ id: uid(), at: new Date().toISOString(), did: did, next: nx });
    data.log = data.log.slice(-60);
    el("logDid").value = ""; el("logNext").value = "";
    save(); drawLog();
  });
  el("logList").addEventListener("click", function(e){
    var b = e.target.closest(".rm"); if(!b) return;
    data.log = data.log.filter(function(x){ return x.id !== b.dataset.id; }); save(); drawLog();
  });

  el("bitAdd").addEventListener("click", function(){
    var t = el("bitTitle").value.trim(), u = safeHref(el("bitHref").value);
    if(!u){ el("bitMsg").textContent = "Links start with https://"; el("bitHref").focus(); return; }
    data.bits.push({ id: uid(), title: t || "Untitled", href: u });
    el("bitTitle").value = ""; el("bitHref").value = ""; el("bitMsg").textContent = "";
    save(); drawBits();
  });
  el("bitList").addEventListener("click", function(e){
    var b = e.target.closest(".rm"); if(!b) return;
    data.bits = data.bits.filter(function(x){ return x.id !== b.dataset.id; }); save(); drawBits();
  });

  try{ if(!localStorage.getItem("base5.who.v1")) localStorage.setItem("base5.who.v1", WHO); }catch(e){}
  if(window.Base5Send) Base5Send.mount(el("sendHost"), { tool: WHO + "'s project", filename: ME.slug + "-project", getText: workText });

  drawStage(); drawAnswer(); drawForm(); drawNudges(); drawLog(); drawBits();
}

/* ---------- the gate ---------- */
var opened = false;
function openWorkspace(){
  if(opened) return; opened = true;
  try{ sessionStorage.setItem(OPEN, "1"); }catch(e){}
  el("gateCard").classList.add("hidden");
  el("work").classList.remove("hidden");
  load(); build();
}
function tryUnlock(){
  var v = el("pin").value.trim();
  if(v.length < 4){ el("pinMsg").textContent = "Four numbers needed."; return; }
  el("pinMsg").textContent = "Checking...";
  if(!window.B5Lock){ el("pinMsg").textContent = "The lock did not load. Try the page again."; return; }
  B5Lock.checkCode(WHO, v).then(function(ok){
    if(ok){ el("pinMsg").textContent = ""; openWorkspace(); }
    else el("pinMsg").textContent = "That code did not match. Same four numbers as your targets.";
  });
}

el("unlockBtn").addEventListener("click", tryUnlock);
el("pin").addEventListener("keydown", function(e){ if(e.key === "Enter") tryUnlock(); });

var stillOpen = false;
try{ stillOpen = sessionStorage.getItem(OPEN) === "1"; }catch(e){}
if(stillOpen){ openWorkspace(); }
else if(window.B5Lock && B5Lock.whoami){
  /* signed in as this student (or as staff): open straight away */
  B5Lock.whoami().then(function(m){ if(m && (m.staff || m.who === WHO)) openWorkspace(); }).catch(function(){});
}

/* newer work arrived from another device: pick it up without a reload */
window.addEventListener("storage", function(e){ if(e.key === KEY && opened){ load(); build(); } });
})();
