/* ==========================================================
   Base 5 - engagement beats
   A tiny shared script for the practice activities.

   Whenever an activity saves its progress, this counts a
   "beat". A beat means real doing, not a quick click: the first
   beat needs a minute of the activity being open on screen and
   several saves, and each later beat needs twenty seconds and a
   couple more saves. Beats live in
   one localStorage key (b5.engage.v1) as { slug: { n, last } }
   and hold nothing about who the student is or what they
   wrote. Other pages (like a student's own HQ) can read them.

   It also adds a small "back" button when the activity was
   opened from a student's HQ (link ends in ?from=jt).
   ========================================================== */
(function(){
"use strict";

var KEY = "b5.engage.v1";
var BEAT_MS = 20000;      /* later beats: at least 20 seconds apart */
var FIRST_VIS_MS = 60000; /* the first beat needs a minute on screen */
var FIRST_SAVES = 4;      /* and this many real saves */
var LATER_SAVES = 2;      /* later beats need this many saves since the last */
var QUIET_MS = 1500;      /* ignore saves made while the page is loading */
var started = Date.now();
var visMs = 0, visStart = (typeof document !== "undefined" && document.visibilityState === "visible") ? Date.now() : 0, saves = 0;
document.addEventListener("visibilitychange", function(){
  if(document.hidden){ if(visStart){ visMs += Date.now() - visStart; visStart = 0 } }
  else visStart = Date.now();
});
function onScreen(){ return visMs + (visStart ? Date.now() - visStart : 0) }

var m = location.pathname.match(/\/practice\/([a-z0-9-]+)\.html$/i);
var slug = m ? m[1].toLowerCase() : "";
var PREFIX = "b5.practice." + slug + ".";

function read(){
  try{ var o = JSON.parse(localStorage.getItem(KEY) || "{}"); return (o && typeof o === "object") ? o : {} }catch(e){ return {} }
}
function write(o){ try{ localStorage.setItem.call(localStorage, KEY, JSON.stringify(o)) }catch(e){} }

/* count a beat when this activity's own progress key changes */
if(slug && window.Storage && Storage.prototype && !window.__b5engage){
  window.__b5engage = true;
  var orig = Storage.prototype.setItem;
  Storage.prototype.setItem = function(k, v){
    var before = null;
    try{
      if(this === window.localStorage && typeof k === "string" && k.indexOf(PREFIX) === 0){
        before = this.getItem(k);
      }
    }catch(e){}
    var r = orig.apply(this, arguments);
    try{
      if(before !== null || (typeof k === "string" && k.indexOf(PREFIX) === 0)){
        var now = Date.now();
        if(now - started > QUIET_MS && String(before) !== String(v)){
          var o = read(), e = o[slug] || { n: 0, last: 0 };
          saves += 1;
          var ok = e.n === 0 ? (onScreen() >= FIRST_VIS_MS && saves >= FIRST_SAVES) : (now - e.last >= BEAT_MS && saves >= LATER_SAVES);
          if(ok){
            e.n += 1; e.last = now; o[slug] = e; write(o); saves = 0;
            try{ luckToast(o) }catch(er){}
          }
        }
      }
    }catch(err){}
    return r;
  };
}

/* when the student came from JT's dugout, show how the team is getting on */
function calmMotion(){
  try{ var h = JSON.parse(localStorage.getItem("b5.jt.hq.v1") || "{}"); return !(h.set && h.set.motion === "lively") }catch(e){ return true }
}
function fromJT(){ try{ return sessionStorage.getItem("b5.from") === "jt" }catch(e){ return false } }
function luckNow(o){
  var fp = 0, k; for(k in o){ if(o.hasOwnProperty(k) && o[k] && o[k].n) fp += Math.min(4, o[k].n) }
  return Math.round(100 * Math.min(1, fp / 60));
}
var toastTimer = null;
function luckToast(o){
  if(!fromJT()) return;
  var pct = luckNow(o), t = document.getElementById("b5toast");
  if(!t){
    t = document.createElement("div"); t.id = "b5toast"; t.setAttribute("role", "status"); t.setAttribute("aria-live", "polite");
    t.setAttribute("style",
      "position:fixed;left:12px;bottom:62px;z-index:2147483000;background:#1b2538;color:#e8edf6;" +
      "font:700 15px/1.3 'Atkinson Hyperlegible',Arial,sans-serif;padding:10px 14px;border-radius:12px;" +
      "border:2px solid #74c9a0;max-width:270px;box-shadow:0 4px 14px rgba(0,0,0,.3)");
    document.body.appendChild(t);
  }
  t.textContent = "Nice. Your team's luck is now " + pct + "%.";
  t.style.display = "block";
  if(toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.style.display = "none" }, 3500);
}

/* a way back, when the student came from their own HQ */
try{
  var q = location.search.match(/[?&]from=([a-z]+)/i);
  if(q) sessionStorage.setItem("b5.from", q[1].toLowerCase());
  var from = sessionStorage.getItem("b5.from");
  var HOMES = { jt: { href: "/jt/", label: "Back to the dugout" } };
  if(from && HOMES[from]){
    var add = function(){
      if(document.getElementById("b5backpill")) return;
      var a = document.createElement("a");
      a.id = "b5backpill"; a.href = HOMES[from].href; a.textContent = HOMES[from].label;
      a.setAttribute("style",
        "position:fixed;left:12px;bottom:12px;z-index:2147483000;background:#1b2538;color:#fff;" +
        "font:700 14px/1 'Atkinson Hyperlegible',Arial,sans-serif;letter-spacing:.02em;padding:11px 16px;" +
        "border-radius:999px;border:2px solid #74c9a0;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.35)");
      document.body.appendChild(a);
    };
    if(document.body) add(); else document.addEventListener("DOMContentLoaded", add);
  }
}catch(e){}
})();
