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
  rel: { name: "Relational (PSHE and RSE)",       colour: "#6a5acd", deep: "#4636a3", wash: "#e8e5fa" }
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
  { target: "rel-assert", pillar: "rel", title: "Assertiveness in relationships", split: true, lessons: [
    { id: "rel-assert-1", step: 1, title: "Mouse, dragon or owl?", line: "Passive, aggressive and assertive.", ready: true, drop: "my-yes-my-no" },
    { id: "rel-assert-2", step: 2, title: "My yes, my no", line: "Saying no, and hearing it.", ready: true, drop: "my-yes-my-no" },
    { id: "rel-assert-3", step: 3, title: "Asking for what I need", line: "I statements and picking the moment.", ready: true, drop: "my-yes-my-no" },
    { id: "rel-assert-4", step: 3, title: "Under pressure", line: "Group pressure, and backing someone else up.", ready: true, drop: "my-yes-my-no" }
  ]}
];

/* day keys as data/term.js; session as its timetable keys */
/* order: for a slot shared by two targets, the teaching order. It
   swaps between them in step with the HQ activity drops (8 Nov 2026),
   so each lesson lands close to its activity. Without it, a slot
   teaches its series one after the other. */
var SLOTS = [
  { id: "mon-aesthetic", days: ["mon"], session: "aesthetic", series: ["ac-arch"], mins: 45, label: "Monday, Aesthetic and Creative" },
  { id: "wed-physical",  days: ["wed"], session: "physical",  series: ["pw-adventure", "pw-balance"], mins: 45, label: "Wednesday, Physical World",
    order: ["pw-adventure-1", "pw-balance-1", "pw-adventure-2", "pw-adventure-3", "pw-balance-2", "pw-balance-3"] },
  { id: "thu-project",   days: ["thu"], session: "project",   series: ["hs-myths", "se-earth"], mins: 45, label: "Thursday, first half of the project slot" },
  { id: "fri-pfa",       days: ["fri"], session: "pfa",       series: ["pfa-transport", "pfa-careers"], mins: 30, label: "Friday, PFA",
    order: ["pfa-transport-1", "pfa-careers-1", "pfa-transport-2", "pfa-careers-2", "pfa-transport-3", "pfa-careers-3"] },
  { id: "phse",          days: ["mon", "thu", "fri"], session: "phse", series: ["rel-assert"], mins: 15, split: true, label: "PHSE, Monday, Thursday and Friday" }
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
  return s;
}
function save(s){ try{ localStorage.setItem(KEY, JSON.stringify(s)); }catch(e){} }

var bySeries = {}, byLesson = {};
SERIES.forEach(function(s){
  bySeries[s.target] = s;
  s.lessons.forEach(function(l, i){ l.n = i + 1; l.of = s.lessons.length; l.target = s.target; l.pillar = s.pillar; l.split = !!s.split; byLesson[l.id] = l; });
});

/* "rel-assert-1#2" is part 2 of a split lesson */
function partKey(id, part){ return part ? id + "#" + part : id; }
function isTaught(s, id, part){
  var l = byLesson[id]; if(!l) return false;
  if(l.split && !part) return !!(s.taught[partKey(id, 1)] && s.taught[partKey(id, 2)] && s.taught[partKey(id, 3)]);
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
    if(l.split) [1, 2, 3].forEach(function(p){ list.push({ lesson: l, part: p }); });
    else list.push({ lesson: l, part: 0 });
  }
  if(slot.order) slot.order.forEach(function(id){ add(byLesson[id]); });
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
  if(on === false) delete s.taught[k]; else s.taught[k] = iso();
  save(s);
  return s;
}

function presentHref(x){
  if(!x || !x.lesson) return "/lessons/";
  return "/lessons/present.html?l=" + x.lesson.id + (x.part ? "&p=" + x.part : "") + (x.slot ? "&slot=" + x.slot.id : "");
}
function label(x){
  if(!x || !x.lesson) return "";
  return x.lesson.title + (x.part ? " (" + PARTS[x.part].toLowerCase() + ")" : "");
}

window.B5LESSONS = {
  pillars: P, series: SERIES, slots: SLOTS, hqs: HQS, parts: PARTS,
  bySeries: bySeries, byLesson: byLesson,
  iso: iso, load: load, save: save, partKey: partKey, isTaught: isTaught,
  nextFor: nextFor, slotFor: slotFor, together: together, mark: mark,
  presentHref: presentHref, forActivity: forActivity, label: label
};
})();
