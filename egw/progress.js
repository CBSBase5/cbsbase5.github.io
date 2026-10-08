/* ==========================================================
   EGW's GCSE HQ - progress
   Everything EGW does is saved in this browser only (there is no
   server behind the site). This file lets that progress travel:

   - a SAVE CODE holds all of it, so she can move to another
     device (copy and paste, or a small file);
   - a PROGRESS CODE is a short summary for Jay's teacher view,
     sent inside the "Send to Jay" email;
   - the second look list is read here for the HQ home page.

   Codes look like  EGWSAVE1:Z....  or  EGWJAY1:Z....  and end with
   a full stop. Z means squashed (deflate), J means plain JSON.
   ========================================================== */

var EGWPROG = (function(){
"use strict";

var PREFIX = "b5.egw.";
var HQ_KEY = PREFIX + "hq.v1";
var REVIEW_KEY = PREFIX + "review.v1";

/* ---------- storage ---------- */
function localSource(){
  return {
    keys: function(){
      var out = [];
      try{
        for(var i = 0; i < localStorage.length; i++){
          var k = localStorage.key(i);
          if(k && k.indexOf(PREFIX) === 0) out.push(k);
        }
      }catch(e){}
      return out.sort();
    },
    read: function(k){
      try{ var r = localStorage.getItem(k); return r ? JSON.parse(r) : null; }catch(e){ return null; }
    }
  };
}
function objectSource(store){
  return {
    keys: function(){ return Object.keys(store || {}).sort(); },
    read: function(k){ return store && store[k] !== undefined ? store[k] : null; }
  };
}
function write(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } }

/* ---------- dates ---------- */
function dayStr(d){
  var m = d.getMonth() + 1, dd = d.getDate();
  return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (dd < 10 ? "0" : "") + dd;
}
function today(){ var d = new Date(); d.setHours(12, 0, 0, 0); return dayStr(d); }

/* ---------- second look ---------- */
function reviewInfo(src){
  src = src || localSource();
  var d = src.read(REVIEW_KEY) || { items: {} };
  var t = today(), due = [], waiting = [];
  Object.keys(d.items || {}).forEach(function(k){
    var it = d.items[k];
    (it.due <= t ? due : waiting).push(it);
  });
  waiting.sort(function(a, b){ return a.due < b.due ? -1 : 1; });
  return { due: due, waiting: waiting, learnt: d.learnt || 0 };
}

/* ---------- squashing into text ---------- */
function toB64(bytes){
  var s = "", chunk = 0x8000;
  for(var i = 0; i < bytes.length; i += chunk) s += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64(str){
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while(str.length % 4) str += "=";
  var bin = atob(str), u = new Uint8Array(bin.length);
  for(var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}
function utf8(s){ return new TextEncoder().encode(s); }
function canSquash(){ return typeof CompressionStream !== "undefined" && typeof DecompressionStream !== "undefined"; }
function deflate(bytes){
  var stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate-raw"));
  return new Response(stream).arrayBuffer().then(function(b){ return new Uint8Array(b); });
}
function inflate(bytes){
  var stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Response(stream).arrayBuffer().then(function(b){ return new TextDecoder().decode(b); });
}
function encodeSync(tag, obj){ return "EGW" + tag + "1:J" + toB64(utf8(JSON.stringify(obj))) + "."; }
function encode(tag, obj){
  var bytes = utf8(JSON.stringify(obj));
  if(!canSquash()) return Promise.resolve("EGW" + tag + "1:J" + toB64(bytes) + ".");
  return deflate(bytes).then(function(z){
    return "EGW" + tag + "1:Z" + toB64(z) + ".";
  }, function(){ return "EGW" + tag + "1:J" + toB64(bytes) + "."; });
}
/* Finds a code anywhere in pasted text (a whole email is fine) */
function decode(text){
  var m = String(text || "").match(/EGW(SAVE|JAY)1:([ZJ])([A-Za-z0-9_\-\s>]+?)\./);
  if(!m) return Promise.reject(new Error("No code found"));
  var bytes;
  try{ bytes = fromB64(m[3].replace(/[\s>]+/g, "")); }catch(e){ return Promise.reject(new Error("That code looks damaged")); }
  var p = m[2] === "Z" ? inflate(bytes) : Promise.resolve(new TextDecoder().decode(bytes));
  return p.then(function(json){ return { kind: m[1] === "SAVE" ? "save" : "jay", data: JSON.parse(json) }; },
    function(){ throw new Error("That code looks damaged"); });
}

/* ---------- save code: everything ---------- */
function backup(){
  var src = localSource(), store = {};
  src.keys().forEach(function(k){ var v = src.read(k); if(v !== null) store[k] = v; });
  return { v: 1, who: "EGW", made: new Date().toISOString(), store: store };
}
/* Puts a backup into this browser. Newer wins for each activity,
   so nothing done on this device is lost. */
function restore(bk){
  var src = localSource(), res = { added: 0, updated: 0, kept: 0 };
  if(!bk || !bk.store) throw new Error("That is not a save code");
  Object.keys(bk.store).forEach(function(k){
    if(k.indexOf(PREFIX) !== 0) return;
    var mine = src.read(k), theirs = bk.store[k];
    if(!mine){ write(k, theirs); res.added++; return; }
    if(k === REVIEW_KEY){
      var items = mine.items || {}, changed = false;
      Object.keys(theirs.items || {}).forEach(function(ik){
        var a = items[ik], b = theirs.items[ik];
        if(!a || (b.last || b.added || "") > (a.last || a.added || "")){ items[ik] = b; changed = true; }
      });
      if((theirs.learnt || 0) > (mine.learnt || 0)){ mine.learnt = theirs.learnt; changed = true; }
      mine.items = items;
      if(changed){ write(k, mine); res.updated++; } else res.kept++;
      return;
    }
    if(mine.updated && theirs.updated){
      if(theirs.updated > mine.updated){ write(k, theirs); res.updated++; } else res.kept++;
      return;
    }
    if(k === HQ_KEY){
      mine.map = mine.map || {};
      Object.keys(theirs.map || {}).forEach(function(t){ if(!mine.map[t]) mine.map[t] = theirs.map[t]; });
      var seen = {};
      (mine.log || []).forEach(function(l){ seen[l.d + "|" + l.t] = 1; });
      (theirs.log || []).forEach(function(l){ if(!seen[l.d + "|" + l.t]){ (mine.log = mine.log || []).push(l); } });
      write(k, mine); res.updated++; return;
    }
    res.kept++;
  });
  return res;
}

/* ---------- revision map, packed ----------
   Ratings travel as one digit per topic, in catalogue order, with a
   fingerprint of the topic list so a changed list is spotted. */
function fingerprint(str){
  var h = 2166136261;
  for(var i = 0; i < str.length; i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}
function packMap(map){
  var out = { mp: {}, mf: {}, mx: {} }, known = {};
  if(typeof EGWCAT === "undefined"){
    Object.keys(map).forEach(function(k){ if(map[k]) out.mx[k] = map[k]; });
    return out;
  }
  EGWCAT.subjects.forEach(function(sj){
    var str = "";
    sj.topics.forEach(function(t){ var k = sj.key + ":" + t.name; known[k] = 1; str += String(map[k] || 0); });
    out.mp[sj.key] = str.replace(/0+$/, "");
    out.mf[sj.key] = fingerprint(sj.topics.map(function(t){ return t.name; }).join("|"));
  });
  Object.keys(map).forEach(function(k){ if(!known[k] && map[k]) out.mx[k] = map[k]; });
  return out;
}
/* Back to { "subject:topic": rating }; stale lists are reported */
function mapOf(r){
  var map = {}, stale = [];
  if(r.map){ Object.keys(r.map).forEach(function(k){ map[k] = r.map[k]; }); return { map: map, stale: stale }; }
  Object.keys(r.mx || {}).forEach(function(k){ map[k] = r.mx[k]; });
  if(typeof EGWCAT !== "undefined"){
    EGWCAT.subjects.forEach(function(sj){
      var str = (r.mp || {})[sj.key] || "";
      if(!str) return;
      if((r.mf || {})[sj.key] !== fingerprint(sj.topics.map(function(t){ return t.name; }).join("|"))){ stale.push(sj.short); return; }
      sj.topics.forEach(function(t, k){ var v = +str.charAt(k) || 0; if(v) map[sj.key + ":" + t.name] = v; });
    });
  }
  return { map: map, stale: stale };
}

/* ---------- progress code: a short summary for Jay ---------- */
function report(src){
  src = src || localSource();
  var acts = {};
  src.keys().forEach(function(k){
    var m = k.match(/^b5\.egw\.([a-z0-9\-]+)\.v1$/);
    if(!m || m[1] === "hq" || m[1] === "review") return;
    var st = src.read(k);
    if(!st || !st.summary) return;
    var s = st.summary;
    acts[m[1]] = {
      u: st.updated || "",
      g1: s.got1 || 0, g2: s.got2 || 0, sh: s.shown || 0, sk: s.skipped || 0, mk: s.marked || 0,
      sp: s.sparks || 0, b: s.best || 0, cd: s.chunksDone || 0, cn: s.chunks || 0,
      cs: (s.chunkStates || []).map(function(x){ return x.charAt(0); }).join(""),
      ct: s.chunkTally || null,
      e: s.escaped ? 1 : 0, bt: s.bestTime || 0
    };
  });
  var hq = src.read(HQ_KEY) || {};
  var rv = src.read(REVIEW_KEY) || { items: {} };
  var items = Object.keys(rv.items || {}).map(function(ik){
    var it = rv.items[ik];
    return [it.id, it.i, it.box, it.due, it.topic, (it.q || "").slice(0, 50)];
  });
  var pm = packMap(hq.map || {});
  /* daily drop: how many, and the last 14 days as one letter each */
  var dd = src.read(PREFIX + "daily.v1") || { days: {} }, last = "";
  var base = new Date(); base.setHours(12, 0, 0, 0);
  for(var k = 13; k >= 0; k--){
    var dt = new Date(base); dt.setDate(dt.getDate() - k);
    var rec = (dd.days || {})[dayStr(dt)];
    last += rec ? (rec.r === "right1" ? "1" : rec.r === "right2" ? "2" : "s") : ".";
  }
  return { v: 1, who: "EGW", made: new Date().toISOString(), acts: acts,
    mp: pm.mp, mf: pm.mf, mx: pm.mx, dd: { n: Object.keys(dd.days || {}).length, last: last }, sw: swipeInfo(src), log: (hq.log || []).slice(-20), rv: { items: items, learnt: rv.learnt || 0 } };
}
/* swipe deck: cards met, how many right last time, rounds played */
function swipeInfo(src){
  var d = src.read(PREFIX + "swipe.v1") || { cards: {} }, n = 0, ok = 0;
  Object.keys(d.cards || {}).forEach(function(k){ n++; if(d.cards[k].lastOk) ok++; });
  return { n: n, ok: ok, rounds: d.rounds || 0 };
}
/* A save code can stand in for a progress code */
function reportFromBackup(bk){ var r = report(objectSource(bk.store)); r.made = bk.made; return r; }

return {
  today: today, reviewInfo: reviewInfo,
  encode: encode, encodeSync: encodeSync, decode: decode,
  backup: backup, restore: restore,
  report: report, reportFromBackup: reportFromBackup, mapOf: mapOf
};
})();
