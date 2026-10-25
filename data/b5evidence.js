/* ==========================================================
   Base 5 - evidence from pages outside the HQs
   The Autumn 2 project games and the practice pages (when opened
   from a student's HQ) load this. It counts time on task the same
   way the HQ activities do: seconds only while the page is on
   screen and the student has tapped, typed or scrolled in the
   last two minutes. Once there are three minutes of real play it
   tells the Base 5 sheet, which makes one Evidence row per day
   and a Learning note in BridgeLink Buddy.

   Who it is comes from the student's school sign in, checked by
   the sheet, never from the page. Staff, guests and anyone not
   signed in to a student account are simply not counted.

   B5Evidence.start({ slug, title, subject, kind, line })
     slug    short id, e.g. "game-its-time" or "practice-scale"
     kind    "game" or "practice"
     line    optional function returning one plain sentence about
             what they did (read from the page's own save)
   Needs /data/b5site.js. ASCII only.
   ========================================================== */
(function(){
"use strict";
if(window.B5Evidence) return;
var MIN_SECS = 180, EVERY = 60;
var cfg = null, secs = 0, sentSecs = 0, lastInput = Date.now(), timer = null, sending = false;
function note(){ lastInput = Date.now(); }
function okToSend(){
  var S = window.B5Site;
  return !!(S && S.call && S.syncUrl && !S.guest);
}
function flush(force){
  if(!cfg || sending || !okToSend()) return;
  if(secs < MIN_SECS) return;
  if(!force && secs - sentSecs < EVERY) return;
  var line = "";
  try{ line = cfg.line ? String(cfg.line() || "") : ""; }catch(e){ line = ""; }
  sending = true;
  var at = secs;
  window.B5Site.call("activity", { slug: cfg.slug, title: cfg.title, subject: cfg.subject || "", kind: cfg.kind || "game", secs: secs, line: line.slice(0, 300), from: cfg.from || "" })
    .then(function(r){ sending = false; if(r && r.ok) sentSecs = at; else if(r && (r.error === "not a student" || r.error === "unknown action")) cfg = null; })
    .catch(function(){ sending = false; });
}
function start(c){
  if(cfg || !c || !c.slug) return;
  if(window.B5Site && window.B5Site.guest) return;
  cfg = c;
  ["pointerdown", "keydown", "scroll", "touchstart", "wheel"].forEach(function(ev){ document.addEventListener(ev, note, { passive: true, capture: true }); });
  timer = setInterval(function(){
    if(!cfg) { clearInterval(timer); return; }
    if(document.hidden || Date.now() - lastInput > 120000) return;
    secs += 5;
    flush(false);
  }, 5000);
  document.addEventListener("visibilitychange", function(){ if(document.hidden) flush(true); });
  window.addEventListener("pagehide", function(){ flush(true); });
}
window.B5Evidence = { start: start, flush: function(){ flush(true); } };
})();
