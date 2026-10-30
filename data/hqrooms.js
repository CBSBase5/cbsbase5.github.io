/* ==========================================================
   Base 5 - HQ rooms: the HQ fills up over the term (30 Oct 2026)
   Jay found the HQ home overwhelming on first open, so each HQ
   starts with a few rooms and the rest open a little at a time
   through Autumn 2, like the folder drops. Used by the HQ home
   (/data/hqfront.js) and the staff page (/teacher/hq-drops.html).

   Each room: id, name (what students and staff see), sel (what it
   is on the HQ home page), from (the day it opens; "" = always
   open), only (which students have it; left out = everyone).
   Nothing new opens on a Tuesday (trip day).

   Jay can open a room early or hold one back for one student on
   /teacher/hq-drops.html. That writes <prefix>rooms.v1 for the
   student through the shared memory, so it reaches every device
   they use:  { set: { roomId: "open" | "hold" }, all: true|false }
   ("all": every room open for that student).

     HQRooms.list(who)          the rooms that student has
     HQRooms.state(who, room, over, today)
                                "open" | "soon" | "held"
     HQRooms.override(prefix)   what Jay set, from this device
     HQRooms.today()            "YYYY-MM-DD" (?hqtest&rdate= to pretend)
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(window.HQRooms) return;

var ROOMS = [
  /* open from the first day */
  { id: "core",     name: "Core practice",         from: "", sel: [".hp-core"] },
  { id: "checkin",  name: "How are you arriving?", from: "", sel: ["#checkin", "#moodCard"] },
  { id: "subjects", name: "Choose a subject",      from: "", sel: ["#secSubjects"] },
  { id: "bonnie",   name: "Study with Bonnie",     from: "", sel: ['a.fold[href$="/bonnie.html"]'] },
  /* then one at a time */
  { id: "drop",   name: "Today's drop",          from: "2026-11-04", sel: ["#dropBar"] },
  { id: "swipe",  name: "Swipe deck",            from: "2026-11-05", sel: ['a.fold[href$="/swipe.html"]'] },
  { id: "flip",   name: "Flip a card",           from: "2026-11-06", sel: ["#secDice"] },
  { id: "sky",    name: "Your sky",              from: "2026-11-09", sel: ['a.fold[href$="/sky.html"]'] },
  { id: "catch",  name: "Catch Jay out",         from: "2026-11-11", sel: [".hqx-cj"] },
  { id: "look",   name: "Change the look",       from: "2026-11-12", sel: ['a.fold[href$="/looks.html"]'] },
  { id: "papers", name: "Skills map",            from: "2026-11-13", sel: ['a.fold[href$="/papers.html"]', '.hqnav a[href$="/papers.html"]', "#exams"],
    names: { EGW: "Papers and exam dates", LP: "Papers", LW: "Papers" } },
  { id: "feels",  name: "How it feels",          from: "2026-11-16", sel: ["#map"], names: { EGW: "Revision map", LP: "Revision map" } },
  { id: "plan",   name: "Plan a session",        from: "2026-11-18", sel: ["#plan"] },
  { id: "log",    name: "One thing to remember", from: "2026-11-19", sel: ["#logFold"] },
  { id: "also",   name: "Also on Base 5",        from: "2026-11-20", sel: ["details.fold.more"] }
];
var BY = {}; ROOMS.forEach(function(r){ BY[r.id] = r; });
var PREFIX = { EGW: "b5.egw.", LP: "b5.lp.", LW: "b5.lw.", LC: "b5.lc.", HK: "b5.hk.", JT: "b5.jthq." };

var Q = location.search, TEST = /[?&]hqtest(=|&|$)/.test(Q);
function pad(n){ return (n < 10 ? "0" : "") + n; }
function iso(d){ return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
function today(){
  var m = TEST && Q.match(/[?&]rdate=(\d{4}-\d\d-\d\d)/);
  return m ? m[1] : iso(new Date());
}
function nameFor(room, who){ return (room.names && room.names[who]) || room.name; }
function list(who){
  return ROOMS.filter(function(r){ return !r.only || r.only.indexOf(who) >= 0; })
    .map(function(r){ return { id: r.id, name: nameFor(r, who), from: r.from, sel: r.sel }; });
}
function override(prefix){
  try{ var o = JSON.parse(localStorage.getItem(prefix + "rooms.v1") || "null"); if(o && typeof o === "object") return o; }catch(e){}
  return {};
}
function state(who, room, over, t){
  var r = typeof room === "string" ? BY[room] : room; if(!r) return "held";
  over = over || {};
  var s = over.set && over.set[r.id];
  if(s === "hold") return "held";
  if(s === "open" || over.all) return "open";
  if(!r.from || (t || today()) >= r.from) return "open";
  return "soon";
}

window.HQRooms = { rooms: ROOMS, by: BY, prefix: PREFIX, list: list, state: state, override: override, today: today, name: nameFor, test: TEST };
})();
