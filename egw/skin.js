/* ==========================================================
   EGW's GCSE HQ - looks (skins)
   Loaded in the head of every HQ page, straight after egw.css,
   so the chosen look is on before anything is drawn.
   The colours live in egw.css under [data-skin=...].
   Sparks open new looks; Night desk and Paper and ink are
   always there.
   ========================================================== */
var EGWSKIN = (function(){
"use strict";
var HQ = window.HQ || { prefix: "b5.egw." };
var KEY = HQ.prefix + "skin.v1";
var LIST = [
  { id: "night",   name: "Night desk",     need: 0,    line: "The original. A notebook at night." },
  { id: "paper",   name: "Paper and ink",  need: 0,    line: "Light and calm, like a clean page." },
  { id: "ocean",   name: "Deep ocean",     need: 100,  line: "Quiet blue, with bubbles drifting up." },
  { id: "forest",  name: "Forest at dusk", need: 300,  line: "Pine green, a warm sky and fireflies." },
  { id: "sunrise", name: "Sunrise",        need: 600,  line: "Plum to peach. Early start energy." },
  { id: "pixel",   name: "Pixel arcade",   need: 1000, line: "Scanlines, square corners, insert coin." },
  { id: "paws",    name: "Bonnie's den",   need: 1500, line: "Cocoa brown, with tiny paw prints everywhere." }
];
/* another student's HQ can name its own starting look */
if(HQ.look){ LIST[0].name = HQ.look.name; LIST[0].line = HQ.look.line; }
function read(){
  try{ var d = JSON.parse(localStorage.getItem(KEY) || "null"); return d && typeof d === "object" ? d : {}; }catch(e){ return {}; }
}
function current(){ var on = read().on; return find(on) ? on : "night"; }
function find(id){ for(var i = 0; i < LIST.length; i++) if(LIST[i].id === id) return LIST[i]; return null; }
function apply(id){
  var r = document.documentElement;
  if(!id || id === "night") r.removeAttribute("data-skin"); else r.setAttribute("data-skin", id);
  if(id === "pixel" && !document.getElementById("egwPixFont")){
    var l = document.createElement("link");
    l.id = "egwPixFont"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=VT323&display=swap";
    (document.head || r).appendChild(l);
  }
}
/* Sparks from every activity, the same sum the home page shows */
function sparks(){
  var n = 0;
  try{
    for(var i = 0; i < localStorage.length; i++){
      var k = localStorage.key(i);
      if(k.indexOf(HQ.prefix) !== 0 || !/^[a-z0-9\-]+\.v1$/.test(k.slice(HQ.prefix.length))) continue;
      var d = JSON.parse(localStorage.getItem(k) || "null");
      if(d && d.summary && d.summary.sparks) n += d.summary.sparks;
    }
  }catch(e){}
  return n;
}
function set(id){
  if(!find(id)) return;
  var d = read();
  d.on = id; d.updated = new Date().toISOString();
  d.seen = d.seen || {};
  try{ localStorage.setItem(KEY, JSON.stringify(d)); }catch(e){}
  apply(id);
}
/* Looks that have opened since she last visited the picker */
function fresh(){
  var d = read(), s = sparks(), seen = d.seen || {}, out = [];
  LIST.forEach(function(x){ if(x.need && s >= x.need && !seen[x.id]) out.push(x); });
  return out;
}
function markSeen(){
  var d = read(), s = sparks();
  d.seen = d.seen || {};
  LIST.forEach(function(x){ if(s >= x.need) d.seen[x.id] = 1; });
  try{ localStorage.setItem(KEY, JSON.stringify(d)); }catch(e){}
}
apply(current());
return { list: LIST, current: current, set: set, sparks: sparks, fresh: fresh, markSeen: markSeen };
})();
