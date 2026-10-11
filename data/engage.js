/* ==========================================================
   Base 5 - engagement beats
   A tiny shared script for the practice activities.

   Whenever an activity saves its progress, this counts a
   "beat", at most one every 15 seconds, so a beat means a bit
   of real doing rather than a lot of clicking. Beats live in
   one localStorage key (b5.engage.v1) as { slug: { n, last } }
   and hold nothing about who the student is or what they
   wrote. Other pages (like a student's own HQ) can read them.

   It also adds a small "back" button when the activity was
   opened from a student's HQ (link ends in ?from=jt).
   ========================================================== */
(function(){
"use strict";

var KEY = "b5.engage.v1";
var BEAT_MS = 15000;      /* one beat per 15 seconds of doing */
var QUIET_MS = 1500;      /* ignore saves made while the page is loading */
var started = Date.now();

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
          if(now - e.last >= BEAT_MS || e.n === 0){
            e.n += 1; e.last = now; o[slug] = e; write(o);
          }
        }
      }
    }catch(err){}
    return r;
  };
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
        "position:fixed;left:12px;bottom:12px;z-index:2147483000;background:#0b1220;color:#fff;" +
        "font:700 14px/1 'Atkinson Hyperlegible',Arial,sans-serif;letter-spacing:.02em;padding:11px 16px;" +
        "border-radius:999px;border:2px solid #2fd27a;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.35)");
      document.body.appendChild(a);
    };
    if(document.body) add(); else document.addEventListener("DOMContentLoaded", add);
  }
}catch(e){}
})();
