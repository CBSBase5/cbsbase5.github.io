/* ==========================================================
   Base 5 - core targets: which activity goes with which
   A student's core targets come from the sheet (BridgeLink Buddy's
   Core tab). Their activities are in /data/a2/core.js, which holds
   no wording: each activity has a fingerprint of its target's
   wording (fp) and a few curriculum words (kw) for when Jay has
   reworded a target since.

   B5Core.key(text)         fingerprint of a target's wording
   B5Core.items(who)        that student's core activities
   B5Core.pair(who, rows)   [{ core: row or null, act: item or null }]
                            for every core target and every activity,
                            each target with the activity made for it
   B5Core.status(who, slug) { done, chunks, finished, started } from
                            the activity's save on this device
   Needs /data/a2/core.js. ASCII only.
   ========================================================== */
(function(){
"use strict";
if(window.B5Core) return;
var PREFIX = { EGW: "b5.egw.", LP: "b5.lp.", LW: "b5.lw.", LC: "b5.lc.", HK: "b5.hk.", JT: "b5.jthq." };
function norm(t){
  return String(t || "").toLowerCase().replace(/\u00d7/g, "x").replace(/labeled/g, "labelled").replace(/[\u2018\u2019']/g, "")
    .replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
}
function key(t){
  var s = norm(t), h = 2166136261, b = unescape(encodeURIComponent(s));
  for(var i = 0; i < b.length; i++){ h ^= b.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h.toString(16);
}
function items(who){
  var C = window.B5CORE, w = String(who || "").toUpperCase();
  return C && C.items ? C.items.filter(function(it){ return it.ready !== false && (it.who || []).indexOf(w) >= 0; }) : [];
}
function fits(act, text){
  if((act.fp || []).indexOf(key(text)) >= 0) return 2;
  var words = " " + norm(text) + " ";
  return (act.kw || []).length && act.kw.every(function(k){ return words.indexOf(" " + k) >= 0; }) ? 1 : 0;
}
function pair(who, rows){
  var acts = items(who), used = {}, out = [];
  (rows || []).forEach(function(r){
    var best = null, bs = 0;
    acts.forEach(function(a){ if(used[a.slug]) return; var f = fits(a, r.target); if(f > bs){ bs = f; best = a; } });
    if(best) used[best.slug] = 1;
    out.push({ core: r, act: best });
  });
  acts.forEach(function(a){ if(!used[a.slug]) out.push({ core: null, act: a }); });
  return out;
}
function status(who, slug){
  try{
    var o = JSON.parse(localStorage.getItem((PREFIX[String(who).toUpperCase()] || "") + "a2-" + slug + ".v1") || "null"), s = o && o.summary;
    if(!s) return null;
    return { done: s.chunksDone || 0, chunks: s.chunks || 0, finished: !!s.finished, started: true };
  }catch(e){ return null; }
}
window.B5Core = { key: key, items: items, pair: pair, status: status };
})();
