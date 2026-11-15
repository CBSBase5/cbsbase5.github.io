/* ==========================================================
   Base 5 - recording activities printed for a student
   /paper/ calls B5Printed.record() when the sheets are printed, and
   the staff desk (/teacher/paper.html) sends the "printed" marks it
   already keeps on this device. The Base 5 sheet keeps one row per
   student, activity and day (the Printed tab), and the line management
   overview shows them as unconfirmed progress until the work turns up.
   Rows wait on this device (b5.printq.v1) until the sheet takes them,
   so a print made while the sheet is out of reach is sent next time.
   B5Printed.record([{ who, slug, day }])
   Needs /data/b5site.js. ASCII only.
   ========================================================== */
(function(){
"use strict";
if(window.B5Printed) return;
var KEY = "b5.printq.v1", busy = false;
function load(){ try{ return JSON.parse(localStorage.getItem(KEY) || "[]") || []; }catch(e){ return []; } }
function keep(q){ try{ if(q.length) localStorage.setItem(KEY, JSON.stringify(q.slice(-300))); else localStorage.removeItem(KEY); }catch(e){} }
function today(){ var d = new Date(), m = d.getMonth() + 1, x = d.getDate(); return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (x < 10 ? "0" : "") + x; }
function flush(){
  var S = window.B5Site;
  if(busy || !S || !S.call || !S.syncUrl || S.guest) return;
  var q = load(); if(!q.length) return;
  busy = true;
  var batch = q.slice(0, 200);
  S.call("printed", { rows: batch }).then(function(r){
    busy = false;
    /* taken, or refused for good (a student's account, an old script): either way stop sending these */
    if(r && (r.ok || /students cannot|unknown action/.test(r.error || ""))){ keep(load().slice(batch.length)); if(r.ok && load().length) flush(); }
  }, function(){ busy = false; });
}
function record(rows){
  var q = load(), seen = {};
  q.forEach(function(x){ seen[x.who + "|" + x.slug + "|" + x.day] = 1; });
  (rows || []).forEach(function(x){
    var r = { who: String(x.who || "").toUpperCase(), slug: String(x.slug || ""), day: x.day || today() };
    if(!/^[A-Z]{2,4}$/.test(r.who) || !/^[a-z0-9-]{2,60}$/.test(r.slug)) return;
    var k = r.who + "|" + r.slug + "|" + r.day; if(seen[k]) return; seen[k] = 1; q.push(r);
  });
  keep(q); flush();
}
window.B5Printed = { record: record, flush: flush };
setTimeout(flush, 4000);
})();
