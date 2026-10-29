/* ==========================================================
   Base 5 - HQ games, the shared extras (29 Oct 2026)
   Every HQ break game (Dunk, Neon Stack, Showstopper, Night
   Corridor, Lakeside Breach, Penalty Shootout) uses this for
   the two things Jay asked to be the same in all of them:

   1. The weekly era. Each week of Autumn 2 the games all drop
      into the same time travel era (Stone Age, Ancient Egypt,
      Roman Britain, Vikings, Victorians, the 1980s, the far
      future), each in its own silly way. Before term starts it
      shows week 1; after term it stays on week 7.
        HQGame.era()   -> { n, id, name, when, line, pal }
        HQGame.eras    -> all seven
   2. Unlocks over the term. Counted from sparks earned since
      the games were upgraded, so everyone starts level and
      new things open steadily as the term goes on.
        HQGame.sparks(prefix)       -> sparks since the baseline
        HQGame.ladder(prefix, list) -> { have, next, need }
          list is [{ at: sparks, ...anything }] in any order;
          have = unlocked items, next = the next one (or null),
          need = sparks still needed for it.

   Testing (only with ?hqtest in the address):
     &era=1..7     pick the week's era
     &gsparks=N    pretend N sparks have been earned since the baseline
   The baseline lives in <prefix>game.base.v1, which follows the
   student between devices with the rest of their HQ.
   Load it before the game file. ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(window.HQGame) return;

var Q = location.search;
var TEST = /[?&]hqtest(=|&|$)/.test(Q);
function qnum(name){ var m = Q.match(new RegExp("[?&]" + name + "=(\\d+)")); return m ? +m[1] : null; }

/* the Mondays each Autumn 2 week starts (INSET Monday 2 Nov counts as week 1) */
var STARTS = ["2026-11-02", "2026-11-09", "2026-11-16", "2026-11-23", "2026-11-30", "2026-12-07", "2026-12-14"];

/* pal: sky (top), sky2 (bottom), ground, ink, accent. Games can use
   these or their own, but should keep the same feel for the week. */
var ERAS = [
  { n:1, id:"stone",     name:"Stone Age",      when:"about 10,000 years ago",
    line:"Everything is made of rock. Even the bad ideas.",
    pal:{ sky:"#f2a65a", sky2:"#ffd9a0", ground:"#8a6a48", ink:"#2b1d12", accent:"#e05a2b" } },
  { n:2, id:"egypt",     name:"Ancient Egypt",  when:"about 4,500 years ago",
    line:"Sand in everything. Pyramids in the distance.",
    pal:{ sky:"#3a7bd5", sky2:"#ffd27a", ground:"#e2b65e", ink:"#3b2508", accent:"#1fb5a8" } },
  { n:3, id:"rome",      name:"Roman Britain",  when:"about 1,900 years ago",
    line:"Straight roads, togas, and it is raining. It is Britain.",
    pal:{ sky:"#8fa6b8", sky2:"#d8dfe4", ground:"#7c8a5a", ink:"#2a1c22", accent:"#b3263a" } },
  { n:4, id:"viking",    name:"Vikings",        when:"about 1,100 years ago",
    line:"Longships, braids, and very loud singing.",
    pal:{ sky:"#24364f", sky2:"#5d7a99", ground:"#3f5a46", ink:"#0f1820", accent:"#d9a441" } },
  { n:5, id:"victorian", name:"Victorians",     when:"about 150 years ago",
    line:"Top hats, steam engines and moustaches you could hang a coat on.",
    pal:{ sky:"#6b6259", sky2:"#b7a993", ground:"#4a3f36", ink:"#1d1712", accent:"#a8323e" } },
  { n:6, id:"eighties",  name:"The 1980s",      when:"about 40 years ago",
    line:"Neon, cassette tapes and enormous hair.",
    pal:{ sky:"#2b0b4a", sky2:"#ff4fa3", ground:"#151030", ink:"#fff4fb", accent:"#2de2e6" } },
  { n:7, id:"future",    name:"The far future", when:"the year 3026",
    line:"Hover everything. Also it is nearly Christmas, so: tinsel.",
    pal:{ sky:"#06142b", sky2:"#2a4f8f", ground:"#16243d", ink:"#e9f6ff", accent:"#7cf5c9" } }
];

function todayISO(){
  var d = new Date();
  return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
}
function weekNow(){
  var f = TEST ? qnum("era") : null;
  if(f >= 1 && f <= 7) return f;
  var t = todayISO(), n = 1;
  for(var i = 0; i < STARTS.length; i++) if(t >= STARTS[i]) n = i + 1;
  return n;
}

function get(k){ try{ return JSON.parse(localStorage.getItem(k) || "null"); }catch(e){ return null; } }
function put(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }

/* lifetime sparks, counted the same way as /data/hqbreak.js */
var SKIP = /^(hq|review|daily|swipe|bonnie|sent|skin|biscuits|look|mood|checkin|dunk|stack|break|crossy|penalty|showstopper|scare|corridor|game)\b/;
function lifetime(prefix){
  var n = 0, i, k, o;
  try{
    for(i = 0; i < localStorage.length; i++){
      k = localStorage.key(i);
      if(!k || k.indexOf(prefix) !== 0) continue;
      if(SKIP.test(k.slice(prefix.length))) continue;
      o = get(k);
      if(o && o.summary && isFinite(o.summary.sparks)) n += Math.max(0, o.summary.sparks);
    }
    o = get(prefix + "daily.v1");
    if(o && o.days) for(k in o.days){
      var r = o.days[k] && o.days[k].r;
      n += r === "right1" ? 10 : r === "right2" ? 6 : r ? 3 : 0;
    }
  }catch(e){}
  return n;
}

function sparks(prefix){
  prefix = prefix || (window.HQ && window.HQ.prefix) || "b5.";
  var f = TEST ? qnum("gsparks") : null;
  if(f != null) return f;
  var total = lifetime(prefix), key = prefix + "game.base.v1", b = get(key);
  if(!b || !isFinite(b.base)){ b = { base: total, at: new Date().toISOString() }; put(key, b); }
  if(total < b.base){ b.base = total; put(key, b); }   /* data cleared on this device: never go negative */
  return total - b.base;
}

function ladder(prefix, list){
  var s = sparks(prefix), have = [], next = null;
  var sorted = (list || []).slice().sort(function(a, b){ return (a.at || 0) - (b.at || 0); });
  for(var i = 0; i < sorted.length; i++){
    if((sorted[i].at || 0) <= s) have.push(sorted[i]);
    else if(!next) next = sorted[i];
  }
  return { have: have, next: next, need: next ? next.at - s : 0, sparks: s };
}

window.HQGame = {
  eras: ERAS,
  era: function(){ return ERAS[weekNow() - 1]; },
  week: weekNow,
  sparks: sparks,
  ladder: ladder,
  test: TEST
};
})();
