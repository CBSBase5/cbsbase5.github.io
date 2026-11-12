/* ==========================================================
   Base 5 - Lessons: the plan
   Whole group lessons for the Autumn 2 pillar targets, taught by
   Jay on the board. English and Maths stay in the HQs.

   The day page, the home page, the staff room, the Lessons
   library and the presenter all read this file.

   series:  one per pillar target, in teaching order. A lesson
            with ready:true has a file at /lessons/l/<id>.js.
            drop is the HQ activity (a2-<drop>.html in each HQ)
            that goes in the folder of anyone who missed it.
            step is the milestone step the lesson counts towards in
            BridgeLink Buddy. These are shared pillar targets, so every
            student has the same step: each lesson takes the step of the
            HQ activity it leads into (data/a2/_build/plan.py).
   slots:   which timetable session teaches which series. Each
            slot opens the next lesson not yet taught, so a
            missed session simply rolls on to the next one.
            split:true means one lesson runs over the week in
            three parts (PHSE: Monday hook, Thursday explore,
            Friday explain).

   What has been taught is kept on the device Jay teaches from
   (localStorage b5.lessons.v1), so it is the board's own record.
   Only target keys and group wording live here, never anyone's
   milestone wording. ASCII only.
   ========================================================== */
(function(){
"use strict";
if(window.B5LESSONS) return;

var P = {
  ac:  { name: "Aesthetic and Creative",          colour: "#e2557a", deep: "#a8314f", wash: "#fbe3ea" },
  hs:  { name: "Human and Social",                colour: "#7b4b8f", deep: "#55306a", wash: "#efe3f4" },
  pw:  { name: "Physical World and Exploration",  colour: "#7a7f1e", deep: "#555a0c", wash: "#eef0d4" },
  pfa: { name: "Preparation for Adulthood",       colour: "#3f6f8f", deep: "#284c66", wash: "#e1edf5" },
  se:  { name: "Scientific and Environmental",    colour: "#1e9e5a", deep: "#11713e", wash: "#dcf3e6" },
  rel: { name: "Relational (PSHE and RSE)",       colour: "#6a5acd", deep: "#4636a3", wash: "#e8e5fa" },
  cc:  { name: "Cultural Calendar",               colour: "#c98a12", deep: "#8a5c06", wash: "#fbf0d6" }
};

var SERIES = [
  { target: "ac-arch", pillar: "ac", title: "Architecture and construction", lessons: [
    { id: "ac-arch-1", step: 1, title: "What makes it stand?", line: "Forces, triangles, wide bases and arches.", ready: true, drop: "what-makes-it-stand" },
    { id: "ac-arch-2", step: 1, title: "Built to last", line: "Mud, stone, iron, glass: building through time.", ready: true, drop: "what-makes-it-stand" },
    { id: "ac-arch-3", step: 2, title: "Draw like an architect", line: "Plans, elevations and the symbols on them.", ready: true, drop: "draw-like-an-architect" },
    { id: "ac-arch-4", step: 2, title: "Buildings of 3026", line: "Form, function and building for the future.", ready: true, drop: "draw-like-an-architect" }
  ]},
  { target: "pw-adventure", pillar: "pw", title: "Adventure activities", lessons: [
    { id: "pw-adventure-1", step: 1, title: "What makes it an adventure?", line: "Challenge, risk and the good kind of scared.", ready: true, drop: "design-an-expedition" },
    { id: "pw-adventure-2", step: 1, title: "Plan it safe", line: "Route, kit, weather and who to tell.", ready: true, drop: "design-an-expedition" },
    { id: "pw-adventure-3", step: 2, title: "On the rope", line: "Climbing kit, belaying and the calls.", ready: true, drop: "adventure-day" }
  ]},
  { target: "pw-balance", pillar: "pw", title: "Balance and control", lessons: [
    { id: "pw-balance-1", step: 1, title: "Finding your balance", line: "Base of support and centre of mass, in people.", ready: true, drop: "move-balance-control" },
    { id: "pw-balance-2", step: 2, title: "Slow is smooth", line: "Control, core and practising a move.", ready: true, drop: "what-helps-me-move" },
    { id: "pw-balance-3", step: 2, title: "Three points of contact", line: "How climbers stay on the wall.", ready: true, drop: "what-helps-me-move" }
  ]},
  { target: "hs-myths", pillar: "hs", title: "Myths and legends", lessons: [
    { id: "hs-myths-1", step: 1, title: "Myth, legend or folk tale?", line: "What makes a story a myth, and why people told them.", ready: true, drop: "myths-then-and-now" },
    { id: "hs-myths-2", step: 1, title: "Legends of Britain", line: "Arthur, Robin Hood and the grain of truth.", ready: true, drop: "myths-then-and-now" },
    { id: "hs-myths-3", step: 2, title: "Myths are still being made", line: "Hidden messages, urban legends and today's myths.", ready: true, drop: "hidden-messages" }
  ]},
  { target: "se-earth", pillar: "se", title: "Earth and atmosphere", lessons: [
    { id: "se-earth-1", step: 1, title: "Inside the Earth", line: "Crust, mantle, core, and how we know.", ready: true, drop: "what-is-it-made-of" },
    { id: "se-earth-2", step: 2, title: "The air up there", line: "What air is made of and the layers above us.", ready: true, drop: "what-is-it-made-of" },
    { id: "se-earth-3", step: 3, title: "A changing planet", line: "Weather, climate and the air over time.", ready: true, drop: "what-is-it-made-of" }
  ]},
  { target: "pfa-transport", pillar: "pfa", title: "Transport and travel", lessons: [
    { id: "pfa-transport-1", step: 1, title: "Ways to get about", line: "Bus, train, tram, taxi, bike, feet.", ready: true, drop: "getting-around" },
    { id: "pfa-transport-2", step: 2, title: "Tickets and timetables", line: "Reading times, routes and what it costs.", ready: true, drop: "read-the-signs" },
    { id: "pfa-transport-3", step: 2, title: "When it goes wrong", line: "Delays, missed stops and staying sorted.", ready: true, drop: "read-the-signs" }
  ]},
  { target: "pfa-careers", pillar: "pfa", title: "Careers for the future", lessons: [
    { id: "pfa-careers-1", step: 1, title: "What even is a career?", line: "Jobs, careers, and the paths between them.", ready: true, drop: "careers-fair-scout" },
    { id: "pfa-careers-2", step: 2, title: "Jobs that vanished, jobs that appeared", line: "Lamplighters to drone pilots.", ready: true, drop: "career-explorer" },
    { id: "pfa-careers-3", step: 2, title: "What suits me?", line: "Interests, strengths and where they lead.", ready: true, drop: "career-explorer" }
  ]},
  /* Relational: from Week 2 (9 Nov 2026) the PHSE slot follows the trust's weekly
     PSHE/RSE themes (26/27 SB Relational Pillar, Autumn 2 "Building Connections"),
     one lesson a week over the Monday, Thursday and Friday 15 minute slots. Still the
     rel-assert target, so Send to Buddy links each week to a milestone step.
     The first four lessons (old:true) were the series before that; they stay for
     looking back and for the HQ activity, and no slot opens them now.
     notes:true means /lessons/notes.html?l=<id> has the week's staff notes for all
     three tiers (sensitive strands live there, never on the board).
     A lesson can set its own parts and partNames (Week 2 started on a Thursday). */
  { target: "rel-assert", pillar: "rel", title: "Assertiveness in relationships", split: true, byWeek: true, lessons: [
    { id: "rel-assert-1", old: true, step: 1, title: "Mouse, dragon or owl?", line: "Passive, aggressive and assertive.", ready: true, drop: "my-yes-my-no" },
    { id: "rel-assert-2", old: true, step: 2, title: "My yes, my no", line: "Saying no, and hearing it.", ready: true, drop: "my-yes-my-no" },
    { id: "rel-assert-3", old: true, step: 3, title: "Asking for what I need", line: "I statements and picking the moment.", ready: true, drop: "my-yes-my-no" },
    { id: "rel-assert-4", old: true, step: 3, title: "Under pressure", line: "Group pressure, and backing someone else up.", ready: true, drop: "my-yes-my-no" },
    { id: "rel-week-2", from: "2026-11-09", to: "2026-11-13", week: 2, theme: "Supportive Relationships", step: 3, notes: true, parts: 2, partNames: ["", "Hook and explore", "Explain"],
      title: "Got your back", line: "What supportive friends actually do.", ready: true, drop: "my-yes-my-no" },
    { id: "rel-week-3", from: "2026-11-16", to: "2026-11-20", week: 3, theme: "Conflict and Assertiveness", step: 2, notes: true,
      title: "Row, or sort it?", line: "Disagreeing without it turning into a war.", ready: true, drop: "my-yes-my-no" },
    { id: "rel-week-4", from: "2026-11-23", to: "2026-11-27", week: 4, theme: "Self Respect", step: 1, notes: true,
      title: "Proud of me", line: "Strengths, kinder self-talk, and putting things right.", ready: true, drop: "my-yes-my-no" },
    { id: "rel-week-5", from: "2026-11-30", to: "2026-12-04", week: 5, theme: "Choice and Autonomy", step: 2, notes: true,
      title: "Whose choice is it?", line: "Making your own choices, and letting others make theirs.", ready: true, drop: "my-yes-my-no" },
    { id: "rel-week-6", from: "2026-12-07", to: "2026-12-11", week: 6, theme: "Personal Safety", step: 1, notes: true,
      title: "Safe moves", line: "Spotting risk and picking the safe action.", ready: true, drop: "my-yes-my-no" }
  ]},
  /* Cultural Calendar: one lesson a week, the week's theme from /data/cc.js, in five
     30 minute parts (10:00 each day). Whole school: any base can open it from /cc/
     with &school=1 (no Base 5 bits). Not a pillar target, so no step and no drop:
     Send to Buddy writes a Learning note without a milestone link.
     from/to: the week it belongs to. colour/deep/wash: the week's own look. */
  { target: "cc", pillar: "cc", title: "Cultural Calendar", split: true, parts: 5, byWeek: true,
    partNames: ["", "Hook", "Explore", "Dig deeper", "Make", "Share"], lessons: [
    { id: "cc-remembrance-1", cc: "remembrance", from: "2026-11-09", to: "2026-11-13", step: 0, title: "Remembrance", line: "How do you say thank you to people you never met?", ready: true,
      colour: "#b5171c", deep: "#7d0f12", wash: "#fbe4e2" },
    { id: "cc-antibullying-1", cc: "anti-bullying", from: "2026-11-16", to: "2026-11-20", step: 0, title: "Anti-Bullying Week", line: "What could you say when something is not OK?", ready: true,
      colour: "#0077b6", deep: "#00507c", wash: "#dcefff" },
    { id: "cc-giving-1", cc: "giving-tuesday", from: "2026-11-23", to: "2026-11-27", step: 0, title: "Giving Tuesday", line: "What could you give that costs nothing?", ready: true,
      colour: "#e2560b", deep: "#a33c05", wash: "#fff0dc" },
    { id: "cc-christmas-1", cc: "christmas-around-the-world", from: "2026-11-30", to: "2026-12-04", step: 0, title: "Christmas Around the World", line: "How does the rest of the world do December?", ready: true,
      colour: "#0b6e4f", deep: "#064a35", wash: "#dcf3ea" },
    { id: "cc-steam-1", cc: "steam-for-good", from: "2026-12-07", to: "2026-12-11", step: 0, title: "STEAM for Good", line: "What is one problem round here you could actually fix?", ready: true,
      colour: "#3a0ca3", deep: "#26066e", wash: "#e8e1fb" }
  ]},
  /* Cultural Calendar extras: stand alone 30 minute lessons for a week whose
     five part lesson has already been taught. No slot opens them; the No Jay
     day page (/nojay/) and the Lessons library do. Not split, no step. */
  { target: "cc-extra", pillar: "cc", title: "Cultural Calendar extras", lessons: [
    { id: "cc-remembrance-2", cc: "remembrance", step: 0, title: "Message received", line: "The Christmas truce, how messages got through, and Morse code.", ready: true,
      colour: "#b5171c", deep: "#7d0f12", wash: "#fbe4e2" }
  ]}
];

/* day keys as data/term.js; session as its timetable keys */
/* order: for a slot shared by two targets, the teaching order. It
   swaps between them in step with the HQ activity drops (8 Nov 2026),
   so each lesson lands close to its activity. Without it, a slot
   teaches its series one after the other. */
var SLOTS = [
  { id: "mon-aesthetic", days: ["mon"], session: "aesthetic", series: ["ac-arch"], mins: 45, label: "Monday, Aesthetic and Creative" },
  { id: "tue-physical",  days: ["tue"], session: "physical",  series: ["pw-adventure", "pw-balance"], mins: 45, label: "Tuesday, Physical World",
    order: ["pw-adventure-1", "pw-balance-1", "pw-adventure-2", "pw-adventure-3", "pw-balance-2", "pw-balance-3"] },
  { id: "thu-project",   days: ["thu"], session: "project",   series: ["hs-myths", "se-earth"], mins: 45, label: "Thursday, first half of the project slot" },
  { id: "fri-pfa",       days: ["fri"], session: "pfa",       series: ["pfa-transport", "pfa-careers"], mins: 30, label: "Friday, PFA",
    order: ["pfa-transport-1", "pfa-careers-1", "pfa-transport-2", "pfa-careers-2", "pfa-transport-3", "pfa-careers-3"] },
  { id: "phse",          days: ["mon", "thu", "fri"], session: "phse", series: ["rel-assert"], mins: 15, split: true, byWeek: true, label: "PHSE, Monday, Thursday and Friday" },
  { id: "cc",            days: ["mon", "tue", "wed", "thu", "fri"], session: "cc", series: ["cc"], mins: 30, split: true, byWeek: true, label: "Cultural Calendar, every day at 10:00" }
];

var HQS = [["EGW", "/egw/"], ["LP", "/lp/"], ["LW", "/lw/"], ["LC", "/lc/"], ["HK", "/hk/"], ["JT", "/jt-hq/"]];
var KEY = "b5.lessons.v1";
var PARTS = ["", "Hook", "Explore", "Explain"];

function iso(d){ d = d || new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
function load(){
  var s = null;
  try{ s = JSON.parse(localStorage.getItem(KEY) || "null"); }catch(e){}
  s = s && typeof s === "object" ? s : {};
  s.taught = s.taught || {};
  s.sent = s.sent || {};
  s.untick = s.untick || {};
  return s;
}
function save(s){ try{ localStorage.setItem(KEY, JSON.stringify(s)); }catch(e){} }

var bySeries = {}, byLesson = {};
SERIES.forEach(function(s){
  bySeries[s.target] = s;
  s.lessons.forEach(function(l, i){ l.n = i + 1; l.of = s.lessons.length; l.target = s.target; l.pillar = s.pillar; l.split = !!s.split;
    l.parts = s.split ? (l.parts || s.parts || 3) : 0; l.partNames = l.partNames || s.partNames || PARTS; l.byWeek = !!s.byWeek && !l.old; byLesson[l.id] = l; });
});

/* how many parts a lesson has, and their names */
function nParts(l){ return l && l.split ? l.parts || 3 : 0; }
function partNums(l){ var n = nParts(l), a = []; for(var i = 1; i <= n; i++) a.push(i); return a.length ? a : [0]; }
function partName(l, p){ return p ? ((l && l.partNames) || PARTS)[p] || ("Part " + p) : ""; }
/* the colours a lesson shows in: its own (a Cultural Calendar week) or its pillar's */
function looks(l){ var p = P[l.pillar] || P.ac; return { name: p.name, colour: l.colour || p.colour, deep: l.deep || p.deep, wash: l.wash || p.wash }; }

/* "rel-assert-1#2" is part 2 of a split lesson */
function partKey(id, part){ return part ? id + "#" + part : id; }
function isTaught(s, id, part){
  var l = byLesson[id]; if(!l) return false;
  if(l.split && !part) return partNums(l).every(function(p){ return !!s.taught[partKey(id, p)]; });
  return !!s.taught[partKey(id, l.split ? part : 0)];
}

/* the lesson a slot opens: anything in it already taught today (so a
   reopened lesson does not jump on), else the first one not taught */
function nextFor(slotId, s){
  s = s || load();
  var slot = SLOTS.filter(function(x){ return x.id === slotId; })[0];
  if(!slot) return null;
  var today = iso(), list = [];
  function add(l){
    if(!l) return;
    if(l.split) partNums(l).forEach(function(p){ list.push({ lesson: l, part: p }); });
    else list.push({ lesson: l, part: 0 });
  }
  if(slot.byWeek){
    /* the lesson for this week's theme only: a missed part rolls on within the week */
    var wl = null;
    slot.series.forEach(function(t){ (bySeries[t] ? bySeries[t].lessons : []).forEach(function(l){ if(l.from <= today && today <= l.to) wl = l; }); });
    if(!wl) return { slot: slot, done: true, none: true };
    add(wl);
  }
  else if(slot.order) slot.order.forEach(function(id){ add(byLesson[id]); });
  else slot.series.forEach(function(t){ (bySeries[t] ? bySeries[t].lessons : []).forEach(add); });
  var hit = list.filter(function(x){ return s.taught[partKey(x.lesson.id, x.part)] === today; });
  if(hit.length) return { slot: slot, lesson: hit[hit.length - 1].lesson, part: hit[hit.length - 1].part, again: true };
  var nx = list.filter(function(x){ return !s.taught[partKey(x.lesson.id, x.part)]; })[0];
  if(!nx) return { slot: slot, done: true };
  return { slot: slot, lesson: nx.lesson, part: nx.part };
}

/* the lessons that lead into an HQ activity (its slug), in teaching order */
function forActivity(slug){
  var out = [];
  SERIES.forEach(function(se){ se.lessons.forEach(function(l){ if(l.drop === slug) out.push(l); }); });
  return out;
}

function slotFor(dayKey, sessionKey){
  return SLOTS.filter(function(x){ return x.session === sessionKey && x.days.indexOf(dayKey) > -1; })[0] || null;
}

/* lessons the group has taken part in: whole lessons, plus split
   lessons once all three parts are done */
function together(s){
  s = s || load();
  var n = 0;
  SERIES.forEach(function(se){ se.lessons.forEach(function(l){ if(isTaught(s, l.id)) n++; }); });
  return n;
}

function mark(id, part, on){
  var s = load(), k = partKey(id, part);
  if(on === false){ delete s.taught[k]; s.untick[k] = 1; }
  else { s.taught[k] = iso(); delete s.untick[k]; }
  save(s);
  return s;
}

/* ---------- the shared copy ----------
   Send to Buddy writes one Evidence row per student for each lesson
   (slug "lesson-<id>", or "lesson-<id>-pN" for a part). sync() reads
   those back, so the taught record survives a wiped browser or a
   different board. Staff only: it needs a school staff account, or the
   staff passphrase already saved on this device by a staff page.
   s.sent: what the sheet has ({ key: day }). s.untick: lessons unticked
   here, which the sheet does not tick again. */
var FIRST = "2026-11-02", PASSKEYS = ["b5.staff.key.v1", "b5.staffkey.v1"];
function savedPass(){
  var k = "";
  try{ PASSKEYS.forEach(function(n){ k = k || localStorage.getItem(n) || ""; }); }catch(e){}
  return k || null;
}
function rememberPass(p){ try{ if(p) localStorage.setItem(PASSKEYS[0], p); }catch(e){} }
function within(pr, ms){
  return Promise.race([pr, new Promise(function(res){ setTimeout(function(){ res({ ok: false, error: "slow" }); }, ms); })]);
}
function staffKey(){
  var S = window.B5Site, k = savedPass();
  return within(S.call("whoami").then(function(o){ return o && o.ok && o.staff && o.pass ? o.pass : k; }, function(){ return k; }), 4000)
    .then(function(v){ return v && typeof v === "string" ? v : k; });
}
var syncing = null;
function sync(){
  if(syncing) return syncing;
  var S = window.B5Site;
  if(!S || !S.call || S.guest || !S.syncUrl) return Promise.resolve({ ok: false, why: "off", added: [] });
  syncing = staffKey().then(function(k){
    if(!k) return { ok: false, why: "no key", added: [] };
    return within(S.call("evidence", { key: k, from: FIRST }), 9000).then(function(o){
      if(!o || !o.ok) return { ok: false, why: (o && o.error) || "no answer", added: [] };
      var s = load(), sent = {}, added = [];
      (o.items || []).forEach(function(it){
        if(String(it.Kind || "") !== "lesson") return;
        var m = String(it.Slug || "").match(/^lesson-([a-z]+-[a-z]+-\d)(?:-p([1-5]))?$/);
        if(!m || !byLesson[m[1]]) return;
        var key = partKey(m[1], m[2] ? +m[2] : 0), day = String(it.Day || "").slice(0, 10);
        if(!sent[key] || day < sent[key]) sent[key] = day;
      });
      Object.keys(sent).forEach(function(key){
        if(!s.taught[key] && !s.untick[key]){ s.taught[key] = sent[key]; added.push(key); }
      });
      s.sent = sent; s.synced = new Date().toISOString();
      save(s);
      return { ok: true, added: added, sent: sent };
    }, function(e){ return { ok: false, why: (e && e.message) || "no answer", added: [] }; });
  });
  return syncing;
}
/* taught here but not in the sheet: Send to Buddy has not happened yet.
   Only known once a sync has worked on this device. */
function unsent(s){
  s = s || load();
  if(!s.synced) return [];
  var out = [];
  Object.keys(s.taught).forEach(function(key){
    if(s.sent[key]) return;
    var m = key.split("#"), l = byLesson[m[0]]; if(!l) return;
    out.push({ lesson: l, part: m[1] ? +m[1] : 0, day: s.taught[key] });
  });
  return out.sort(function(a, b){ return a.day < b.day ? -1 : 1; });
}
function sentMark(id, part, day){ var s = load(); s.sent[partKey(id, part)] = day || iso(); save(s); }

/* the planned date of each lesson if every slot is taught, week by week
   from Week 2 (used where the board's record cannot be seen, such as a
   student looking back from their HQ) */
var WEEK1 = "2026-11-09", DOFF = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4 };
function addDays(d, n){ var x = new Date(d + "T12:00:00"); x.setDate(x.getDate() + n); return iso(x); }
var PLANNED = {};
SLOTS.forEach(function(slot){
  var ids = slot.order ? slot.order.slice() : [];
  if(!ids.length) slot.series.forEach(function(t){ (bySeries[t] ? bySeries[t].lessons : []).forEach(function(l){ ids.push(l.id); }); });
  if(slot.byWeek){ slot.series.forEach(function(t){ (bySeries[t] ? bySeries[t].lessons : []).forEach(function(l){ PLANNED[l.id] = l.from; }); }); return; }
  ids.forEach(function(id, i){ if(!PLANNED[id]) PLANNED[id] = addDays(WEEK1, i * 7 + DOFF[slot.days[0]]); });
});
function planned(id){ return PLANNED[id] || ""; }

function presentHref(x){
  if(!x || !x.lesson) return "/lessons/";
  return "/lessons/present.html?l=" + x.lesson.id + (x.part ? "&p=" + x.part : "") + (x.slot ? "&slot=" + x.slot.id : "");
}
function label(x){
  if(!x || !x.lesson) return "";
  return x.lesson.title + (x.part ? " (" + partName(x.lesson, x.part).toLowerCase() + ")" : "");
}

/* bump when lesson files change, so boards fetch the new ones */
window.B5LESSONS_V = 11;

window.B5LESSONS = {
  pillars: P, series: SERIES, slots: SLOTS, hqs: HQS, parts: PARTS,
  bySeries: bySeries, byLesson: byLesson,
  iso: iso, load: load, save: save, partKey: partKey, isTaught: isTaught,
  nextFor: nextFor, slotFor: slotFor, together: together, mark: mark,
  presentHref: presentHref, forActivity: forActivity, nParts: nParts, partNums: partNums, partName: partName, looks: looks, sync: sync, unsent: unsent, sentMark: sentMark,
  rememberPass: rememberPass, planned: planned, label: label
};
})();
