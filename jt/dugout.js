(function(){
"use strict";
var S = window.B5Sim;
var KEY = "b5.jt.hq.v1", ENG = "b5.engage.v1";
var ROUNDS = 15;
var CUP_AT = [6, 14, 24, 36], CUP_NAMES = ["Round of 16", "Quarter final", "Semi final", "Final"];
var RANKS = [[0, "Trainee manager"], [8, "Assistant manager"], [20, "Gaffer"], [34, "Boss"], [50, "Legend"]];
var STATCOL = { atk: "#ef7b7b", mid: "#f0cf6a", def: "#86b0f0", gk: "#c0aef0" };
var SKILLNAME = { atk: "Finishing", mid: "Passing", def: "Tackling", gk: "Handling" };
var GROUP = { atk: "FWD", mid: "MID", def: "DEF", gk: "GK" };
var MINER = { me: 70, me2: 68, me3: 66 };
var NUMDEF = { gk1: 1, gk2: 13, d1: 2, d2: 3, d3: 4, d4: 5, d5: 15, d6: 16, m1: 8, m2: 6, m3: 10, m4: 7, m5: 14, m6: 17, f1: 9, f2: 11, f3: 18, f4: 19, f5: 20, u1: 27, u2: 28, u3: 29, u4: 30, me: 31, me2: 32, me3: 33 };
var sysReduce = false;
try{ sysReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches }catch(e){}

/* ---------- helpers ---------- */
function $(id){ return document.getElementById(id) }
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;") }
function surname(n){ var p = String(n).split(" "); return p[p.length - 1] }
function r1(x){ return Math.round(x) }
function plus(x){ return x > 0.04 ? "+" + (Math.round(x * 10) / 10) : "" }
function ord(n){ var s = ["th","st","nd","rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]) }
function clamp(x, a, b){ return x < a ? a : (x > b ? b : x) }
function hash(s){ var h = 2166136261, i; s = String(s); for(i = 0; i < s.length; i++){ h = Math.imul(h ^ s.charCodeAt(i), 16777619) } return h >>> 0 }
function isMine(id){ return /^me[23]?$/.test(String(id)) }
function isSg(id){ return /^sg\d+$/.test(String(id)) }
var ICON = {
  home: '<path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z" fill="currentColor"/>',
  squad: '<circle cx="8" cy="8" r="3.4" fill="currentColor"/><circle cx="17" cy="9" r="2.8" fill="currentColor"/><path d="M2 20c0-4 3-6 6-6s6 2 6 6zM14 20c0-3 2-5 4-5s4 2 4 5z" fill="currentColor"/>',
  train: '<path d="M3 9h3v6H3zM18 9h3v6h-3zM6 11h12v2H6zM1 11h2v2H1zM21 11h2v2h-2z" fill="currentColor"/>',
  league: '<path d="M5 3h14v4a5 5 0 0 1-4 4.9V15h3v3H6v-3h3v-3.1A5 5 0 0 1 5 7zM3 4h2v3H3zM19 4h2v3h-2zM6 19h12v2H6z" fill="currentColor"/>',
  club: '<path d="M4 3h16v9c0 5-4 8-8 10-4-2-8-5-8-10z" fill="currentColor"/>',
  studio: '<path d="M3 21l3-1 11-11-2-2L4 18zM16 4l2-2 4 4-2 2z" fill="currentColor"/>',
  inbox: '<path d="M3 5h18v14H3zm2 2v.5l7 5 7-5V7zm14 3l-7 5-7-5V17h14z" fill="currentColor" fill-rule="evenodd"/>',
  send: '<path d="M2 12L22 3l-5 18-5-6-4 4v-6z" fill="currentColor"/>',
  cart: '<path d="M2 3h3l2.6 11h11l2.4-8H6.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="9" cy="19" r="2" fill="currentColor"/><circle cx="17" cy="19" r="2" fill="currentColor"/>',
  brief: '<path d="M3 8h18v12H3zM9 8V5h6v3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M3 13h18" stroke="currentColor" stroke-width="2"/>'
};
var VIEWS = [
  { id: "dugout", label: "Dugout", icon: "home", title: "The Dugout" },
  { id: "squad", label: "Squad", icon: "squad", title: "Squad and tactics" },
  { id: "train", label: "Training", icon: "train", title: "Training ground" },
  { id: "league", label: "League", icon: "league", title: "League and cup" },
  { id: "market", label: "Market", icon: "cart", title: "Transfer market" },
  { id: "business", label: "Business", icon: "brief", title: "Your company and sponsorships" },
  { id: "studio", label: "Studio", icon: "studio", title: "Design your club" },
  { id: "club", label: "Club", icon: "club", title: "Club, badges and trophies" },
  { id: "inbox", label: "Inbox", icon: "inbox", title: "Inbox", hidden: true },
  { id: "send", label: "Report", icon: "send", title: "Send a report to Jay", hidden: true },
  { id: "settings", label: "Settings", icon: "send", title: "Settings", hidden: true }
];

/* ---------- saved state ---------- */
var mem = null;
function rawLoad(){ try{ return JSON.parse(localStorage.getItem(KEY)) }catch(e){ return mem } }
function save(){ mem = st; try{ localStorage.setItem(KEY, JSON.stringify(st)) }catch(e){} }
function beats(){
  try{ var o = JSON.parse(localStorage.getItem(ENG) || "{}"); return (o && typeof o === "object") ? o : {} }catch(e){ return {} }
}
var CLUBD = { name: "Base 5 United", short: "", nick: "", motto: "", stadium: "", c1: "#0c3b27", c2: "#74c9a0", pat: "plain", gk: "#e8c35a", crest: "bird", shape: "shield", cbg: "plain", grass: "classic", gpat: "stripes" };
var st = rawLoad(), firstRun = false, upgraded = false, ORIG = {};
S.PLAYERS.forEach(function(p){ ORIG[p.id] = p.name });
if(!st || st.v !== 1 || !st.played){
  firstRun = true;
  st = { v: 1, setup: false, club: null, mine: [], seed: 1 + Math.floor(Math.random() * 2000000000), formation: "4-3-3", xi: [], used: [], played: [], inbox: [], trained: {}, unlocked: {}, nid: 1 };
}
st.club = Object.assign({}, CLUBD, st.club || {});
if(!st.mine){
  st.mine = [];
  if(st.me && String(st.me.name || "").trim()) st.mine.push({ id: "me", name: st.me.name, pos: st.me.pos || "MID", note: st.me.note || "Never gives up" });
}
["trained", "unlocked"].forEach(function(k){ if(!st[k] || typeof st[k] !== "object") st[k] = {} });
["used", "played", "inbox", "xi", "reveal"].forEach(function(k){ if(!Array.isArray(st[k])) st[k] = [] });
if(!st.formation || !S.FORMATIONS[st.formation]) st.formation = "4-3-3";
if(!st.nid) st.nid = 1;
if(!st.cup) st.cup = { ties: [], out: false };
if(typeof st.coins !== "number") st.coins = 150;
["signed", "hist", "log", "deals"].forEach(function(k){ if(!Array.isArray(st[k])) st[k] = [] });
["sold", "mk", "sbase"].forEach(function(k){ if(!st[k] || typeof st[k] !== "object") st[k] = {} });
if(!st.mk.bought) st.mk.bought = [];
if(!st.season) st.season = 1;
if(typeof st.tier !== "number" || st.tier < 0 || st.tier > 3) st.tier = firstRun ? 3 : 2;
if(typeof st.fp0 !== "number") st.fp0 = 0;
if(!st.sgn) st.sgn = 1;
S.setTier(st.tier);
if(!st.dev) st.dev = { xp: {}, bonus: {} };
if(!st.set) st.set = { motion: "lively", sound: false, pace: "gentle" };
["bd", "look", "pn", "num", "focus", "skill", "tby", "tac"].forEach(function(k){ if(!st[k]) st[k] = {} });
if(!st.tac.ment) st.tac.ment = "bal";
if(!st.tac.press) st.tac.press = "mid";
if(!st.reveal) st.reveal = [];
["cap", "pk", "fk"].forEach(function(k){ if(typeof st[k] !== "string") st[k] = "" });
if(st.set.ui !== 4){
  var fromOld = st.set.ui === 3;
  if(!fromOld){ st.set.motion = "lively" }
  st.set.ui = 4;
  if(!firstRun) upgraded = true;
}
function post(title, from, body){
  st.inbox.unshift({ id: st.nid++, title: title, from: from, body: body, read: false });
  if(st.inbox.length > 80) st.inbox.length = 80;
}
if(firstRun) post("Welcome to the dugout", "The Chairman (Jay)", "Your squad is ready and the league is waiting. Design your club in the Studio if you fancy, pick your team in Squad, then have a go at any training session. Each session you try earns a match, and the more you do in it, the better your luck and your players get. There is no rush and no wrong order.");

/* ---------- names, players, look ---------- */
function clubName(){ return (st.club.name || "").trim() || "Base 5 United" }
function shortName(){
  var s = String(st.club.short || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
  if(s) return s;
  var w = clubName().split(/\s+/).filter(Boolean);
  s = w.length > 1 ? w.map(function(x){ return x.charAt(0) }).join("") : clubName().slice(0, 3);
  return s.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3) || "B5U";
}
function nickName(){ return (st.club.nick || "").trim() || clubName() }
function stadiumName(){ return (st.club.stadium || "").trim() || "Base 5 Park" }
function applyMine(){
  var i;
  for(i = S.PLAYERS.length - 1; i >= 0; i--) if(isMine(S.PLAYERS[i].id) || isSg(S.PLAYERS[i].id)) S.PLAYERS.splice(i, 1);
  st.signed.forEach(function(m){ S.PLAYERS.push({ id: m.id, name: m.name, pos: m.pos, r: m.r, note: m.note }) });
  st.mine.forEach(function(m){
    var nm = String(m.name || "").trim(); if(!nm) return;
    S.PLAYERS.push({ id: m.id, name: nm, pos: m.pos, r: MINER[m.id] || 66, note: m.note + " (your player)" });
  });
}
function applyNames(){
  S.PLAYERS.forEach(function(p){ if(!isMine(p.id) && !isSg(p.id)) p.name = String(st.pn[p.id] || "").trim() || ORIG[p.id] });
}
function applyClub(){ S.setHomeName(clubName()) }
function calm(){ return sysReduce || st.set.motion !== "lively" }
function applyMotion(){ document.documentElement.setAttribute("data-motion", calm() ? "calm" : "lively") }
function lum(hex){ var n = parseInt(String(hex).replace("#", ""), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255 }
var GRASS = { classic: ["#2d7a54", "#276c4a"], bright: ["#3a9a63", "#318a56"], night: ["#1f5a45", "#1a4d3b"] };
function applyKit(){
  var rs = document.documentElement.style, g = GRASS[st.club.grass] || GRASS.classic;
  rs.setProperty("--k1", st.club.c1); rs.setProperty("--k2", st.club.c2); rs.setProperty("--kt", lum(st.club.c1) > 0.55 ? "#10172a" : "#ffffff");
  rs.setProperty("--g1", g[0]); rs.setProperty("--g2", g[1]);
  document.documentElement.setAttribute("data-gpat", st.club.gpat || "stripes");
}
function kitOf(gk){ return gk ? { c1: st.club.gk, c2: lum(st.club.gk) > 0.55 ? "#1a1a1a" : "#ffffff", pat: "plain" } : { c1: st.club.c1, c2: st.club.c2, pat: st.club.pat } }
function numOf(id){ var n = st.num[id]; return n ? n : (NUMDEF[id] || (30 + (hash(id) % 60))) }
function playerOf(id){ return S.playerById(id) }
function renameHistory(oldN, newN){
  if(!oldN || oldN === newN) return;
  function fix(m){
    (m.events || []).forEach(function(e){ if(e.who === oldN) e.who = newN; if(e.text) e.text = e.text.split(oldN).join(newN) });
    (m.rt || []).forEach(function(r){ if(r.n === oldN) r.n = newN });
    if(m.lu && m.lu.n) m.lu.n = m.lu.n.map(function(x){ return x === oldN ? newN : x });
  }
  st.played.forEach(fix); st.cup.ties.forEach(fix);
}
function nameTaken(name, exceptId){
  var low = String(name).trim().toLowerCase(), hit = false;
  S.PLAYERS.forEach(function(p){ if(p.id !== exceptId && p.name.toLowerCase() === low) hit = true });
  return hit;
}
applyMine(); applySold(); applyNames(); applyClub(); applyMotion(); applyKit();
var view = "dugout", sel = null, posFilter = "ALL", folds = {}, newB = [], studioTab = "club", editing = null, picking = null;

/* ---------- derived numbers ---------- */
function bonusOf(id){ return (st.dev.bonus && st.dev.bonus[id]) || 0 }
function rate(p){ return p.r + bonusOf(p.id) + (st.cap === p.id ? 1 : 0) }
function bonusMap(){
  var o = {}, k; for(k in st.dev.bonus) o[k] = st.dev.bonus[k];
  if(st.cap) o[st.cap] = (o[st.cap] || 0) + 1;
  return o;
}
function ctx(){
  var tr = S.training(beats());
  var avail = S.PLAYERS.filter(function(p){ return !p.fp || tr.fp >= p.fp });
  return { tr: tr, avail: avail };
}
function autoPick(form, avail, prefer){
  var F = S.FORMATIONS[form], pairs = [], i, j, xi = [], used = {}, slotDone = {};
  for(i = 0; i < 11; i++) for(j = 0; j < avail.length; j++){
    var bonus = (prefer && prefer.indexOf(avail[j].id) >= 0) ? 6 : 0;
    pairs.push({ s: i, p: avail[j].id, v: rate(avail[j]) * S.fit(avail[j].pos, F.slots[i]) + bonus });
  }
  pairs.sort(function(a, b){ return b.v - a.v });
  for(i = 0; i < pairs.length; i++){
    var q = pairs[i];
    if(used[q.p] || slotDone[q.s]) continue;
    used[q.p] = 1; slotDone[q.s] = 1; xi[q.s] = q.p;
  }
  for(i = 0; i < 11; i++) if(!xi[i]) xi[i] = "";
  return xi;
}
function pendingList(){
  var b = beats(), out = [];
  S.ACTS.forEach(function(a){
    var e = b[a.slug];
    if(e && (e.n - (st.sbase[a.slug] || 0)) >= 1 && st.used.indexOf(a.slug) < 0) out.push({ slug: a.slug, last: e.last || 0, act: a });
  });
  out.sort(function(x, y){ return x.last - y.last });
  return out;
}
function cupReady(c){
  if(st.cup.out || st.cup.ties.length >= 4) return false;
  var n = CUP_AT.filter(function(t){ return sfp(c) >= t }).length;
  return n > st.cup.ties.length;
}
function actBy(slug){ for(var i = 0; i < S.ACTS.length; i++) if(S.ACTS[i].slug === slug) return S.ACTS[i]; return null }
function ourSide(m){ return m.home ? "h" : "a" }
function ourGoals(m){ return m.home ? m.hs : m.as }
function theirGoals(m){ return m.home ? m.as : m.hs }
function resultOf(m){ var a = ourGoals(m), b = theirGoals(m); return a > b ? "W" : (a < b ? "L" : "D") }
function goalTally(){
  var t = {};
  st.played.concat(st.cup.ties).forEach(function(m){
    (m.events || []).forEach(function(e){ if(e.k === "goal" && e.side === ourSide(m) && e.who) t[e.who] = (t[e.who] || 0) + 1 });
  });
  return t;
}
function tacMods(){
  var m = { atk: 0, mid: 0, def: 0 };
  if(st.tac.ment === "att"){ m.atk += 2.5; m.def -= 2 } else if(st.tac.ment === "def"){ m.atk -= 2; m.def += 2.5 }
  if(st.tac.press === "high"){ m.mid += 2; m.def -= 1 } else if(st.tac.press === "low"){ m.mid -= 1.5; m.def += 1.5 }
  return m;
}
function teamNow(c){
  c = c || ctx();
  var t = S.buildTeam(st.formation, st.xi, c.tr.boost, c.tr.luck, bonusMap()), m = tacMods();
  t.atk += m.atk; t.mid += m.mid; t.def += m.def;
  return t;
}
function posOf(tb){ var p = 0; tb.forEach(function(r, i){ if(r.id === 0) p = i + 1 }); return p }
function rankOf(fp){ var r = RANKS[0][1], i; for(i = 0; i < RANKS.length; i++) if(fp >= RANKS[i][0]) r = RANKS[i][1]; return r }
function triedCount(c){ return S.ACTS.filter(function(a){ return (c.tr.levels[a.slug] || 0) >= 1 }).length }

/* ---------- learning link: sessions train a chosen player ---------- */
function traineeOf(a, c){
  var id = st.focus[a.slug];
  if(id && c.avail.some(function(p){ return p.id === id })) return id;
  var pos = GROUP[a.stat], best = null, bv = -1;
  c.avail.forEach(function(p){ if(p.pos !== pos) return; var v = (st.xi.indexOf(p.id) >= 0 ? 100 : 0) + rate(p); if(v > bv){ bv = v; best = p } });
  return best ? best.id : (c.avail[0] ? c.avail[0].id : "");
}
function addXp(id, n){
  st.dev.xp[id] = (st.dev.xp[id] || 0) + n;
  var nb = Math.min(6, Math.floor(st.dev.xp[id] / 4));
  if(nb > bonusOf(id)) st.dev.bonus[id] = nb;
}
var BIAS = { FWD: { atk: 1.15, mid: 0.8, def: 0.4, gk: 0.1 }, MID: { atk: 0.8, mid: 1.15, def: 0.7, gk: 0.1 }, DEF: { atk: 0.4, mid: 0.7, def: 1.15, gk: 0.1 }, GK: { atk: 0.1, mid: 0.35, def: 0.5, gk: 1.25 } };
function attrsOf(p){
  var b = BIAS[p.pos] || BIAS.MID, sk = st.skill[p.id] || {}, o = {};
  ["atk", "mid", "def", "gk"].forEach(function(k){
    var base = clamp(Math.round(24 + (p.r - 40) * b[k]), 15, 95), tr = (sk[k] || 0) * 5;
    o[k] = { base: base, tr: tr, v: clamp(base + tr, 15, 99) };
  });
  return o;
}
function skillTotal(id){ var s = st.skill[id]; return s ? (s.atk || 0) + (s.mid || 0) + (s.def || 0) + (s.gk || 0) : 0 }
function whyFor(id, stat){
  var best = null, bl = 0;
  S.ACTS.forEach(function(a){
    if(st.tby[a.slug] !== id) return;
    var lv = st.trained[a.slug] || 0; if(!lv) return;
    var v = lv + (stat && a.stat === stat ? 10 : 0);
    if(v > bl){ bl = v; best = a }
  });
  return best;
}
function radarSvg(p, w){
  var A = attrsOf(p), keys = ["atk", "mid", "def", "gk"], i, pts = [], bpts = [], lab = "";
  var cx = 60, cy = 60, R = 42, ang = [-90, 0, 90, 180];
  keys.forEach(function(k, i){
    var a = ang[i] * Math.PI / 180, vb = A[k].base / 99 * R, vt = A[k].v / 99 * R;
    bpts.push((cx + vb * Math.cos(a)).toFixed(1) + "," + (cy + vb * Math.sin(a)).toFixed(1));
    pts.push((cx + vt * Math.cos(a)).toFixed(1) + "," + (cy + vt * Math.sin(a)).toFixed(1));
  });
  var grid = [0.33, 0.66, 1].map(function(f){
    return '<polygon points="' + ang.map(function(a2){ var r = R * f, rad = a2 * Math.PI / 180; return (cx + r * Math.cos(rad)).toFixed(1) + "," + (cy + r * Math.sin(rad)).toFixed(1) }).join(" ") + '" fill="none" stroke="#2a3a63" stroke-width="1"/>';
  }).join("");
  return '<svg viewBox="0 0 120 120" width="' + w + '" height="' + w + '" role="img" aria-label="Skills radar">' + grid +
    '<polygon points="' + bpts.join(" ") + '" fill="rgba(159,176,208,.25)" stroke="#9fb0d0" stroke-width="1.5"/>' +
    '<polygon points="' + pts.join(" ") + '" fill="color-mix(in srgb,var(--accent) 35%,transparent)" stroke="var(--accent)" stroke-width="2"/>' +
    (w >= 100 ? '<text x="60" y="9" text-anchor="middle" font-size="9" fill="#9fb0d0" font-family="Archivo,Arial">FIN</text><text x="116" y="63" text-anchor="end" font-size="9" fill="#9fb0d0" font-family="Archivo,Arial">PAS</text><text x="60" y="118" text-anchor="middle" font-size="9" fill="#9fb0d0" font-family="Archivo,Arial">TAC</text><text x="4" y="63" font-size="9" fill="#9fb0d0" font-family="Archivo,Arial">HAN</text>' : "") + '</svg>';
}

/* ---------- badges ---------- */
function badgeDefs(c){
  var pl = st.played, ties = st.cup.ties, i, streak = 0, best = 0, hat = false, lucky = false, tally = goalTally(), why = false;
  pl.forEach(function(m){ if(resultOf(m) === "W"){ streak++; if(streak > best) best = streak } else streak = 0 });
  pl.concat(ties).forEach(function(m){
    var per = {};
    (m.events || []).forEach(function(e){
      if(e.k === "goal" && e.side === ourSide(m)){ per[e.who] = (per[e.who] || 0) + 1; if(per[e.who] >= 3) hat = true; if(e.lucky) lucky = true; if(e.why) why = true }
    });
  });
  var areas = ["atk","mid","def","gk"].every(function(k){ return S.ACTS.some(function(a){ return a.stat === k && (c.tr.levels[a.slug] || 0) >= 1 }) });
  var done = pl.length >= ROUNDS, pos = done ? posOf(S.table(st.seed, pl)) : 0, tried = triedCount(c);
  var mineGoal = st.mine.some(function(m){ return (tally[String(m.name).trim()] || 0) > 0 });
  var designed = st.club.pat !== "plain" || st.club.nick || st.club.motto || st.club.stadium || Object.keys(st.pn).length || Object.keys(st.look).length;
  return [
    { id: "first", name: "First whistle", desc: "Play your first match", ok: pl.length >= 1 },
    { id: "win", name: "Winner", desc: "Win a league match", ok: pl.some(function(m){ return resultOf(m) === "W" }) },
    { id: "clean", name: "Clean sheet", desc: "Do not let a goal in", ok: pl.some(function(m){ return theirGoals(m) === 0 }) },
    { id: "three", name: "Three in a row", desc: "Win three league games running", ok: best >= 3 },
    { id: "hat", name: "Hat trick hero", desc: "One player scores three in a match", ok: hat },
    { id: "lucky", name: "Lucky break", desc: "Score a lucky goal", ok: lucky },
    { id: "mine", name: "My player scores", desc: "A player you made scores", ok: mineGoal },
    { id: "five", name: "Five sessions", desc: "Try five training sessions", ok: tried >= 5 },
    { id: "areas", name: "All round", desc: "Train all four areas", ok: areas },
    { id: "sign", name: "New signing", desc: "Unlock a new player", ok: Object.keys(st.unlocked).length >= 1 },
    { id: "cup1", name: "Cup run", desc: "Win a cup tie", ok: ties.some(function(t){ return t.won }) },
    { id: "pens", name: "Nerves of steel", desc: "Win on penalties", ok: ties.some(function(t){ return t.pens && t.won }) },
    { id: "cupw", name: "Cup winners", desc: "Win the cup", ok: ties.length >= 4 && ties[3].won },
    { id: "all", name: "Full house", desc: "Try all fifteen sessions", ok: tried >= 15 },
    { id: "champ", name: "Champions", desc: "Finish top of the league", ok: done && pos === 1 },
    { id: "learn", name: "Learning pays off", desc: "Score with a player a session trained", ok: why },
    { id: "design", name: "Club designer", desc: "Make your club your own", ok: !!designed },
    { id: "sub", name: "Super sub", desc: "Make a change in a match", ok: !!st.madeSub },
    { id: "shoot", name: "Shoot-out hero", desc: "Take part in a penalty shoot-out", ok: ties.some(function(t){ return !!t.pens }) },
    { id: "boss", name: "Entrepreneur", desc: "Start your own company", ok: !!st.co },
    { id: "spon", name: "Sponsor", desc: "Sponsor a club", ok: !!(st.co && ((st.co.signed || 0) >= 1 || st.deals.length)) },
    { id: "deal", name: "Transfer dealer", desc: "Buy or sell a player", ok: (st.trades || 0) >= 1 },
    { id: "up", name: "Promoted", desc: "Move up a division", ok: st.hist.some(function(h){ return h.up }) },
    { id: "div", name: "Division champions", desc: "Win a division", ok: st.hist.some(function(h){ return h.pos === 1 }) || (done && pos === 1) }
  ];
}
function checkBadges(c){
  var fresh = [];
  badgeDefs(c).forEach(function(d){ if(d.ok && !st.bd[d.id]){ st.bd[d.id] = 1; fresh.push(d) } });
  if(fresh.length){ newB = newB.concat(fresh); save() }
}

function migrate(c){
  if(!st.set.mig5){
    st.set.mig5 = 1;
    if(!firstRun) post("New in the dugout: divisions, money and sponsors", "The Chairman (Jay)", "Four divisions now make a pyramid, from the Chilton Premier League down to Division Three. After fifteen matches the top three go up and the bottom three go down, and then a new season begins. Matches and prizes earn coins. Spend them in the Transfer market on new players, or start your own made-up company in Business and sponsor clubs. You are in the Chilton Division Two. All optional, and your squad keeps everything it has learned.");
    save();
  }
  if(st.set.mig4) return;
  st.set.mig4 = 1;
  S.ACTS.forEach(function(a){
    var lv = st.trained[a.slug] || 0; if(!lv || st.tby[a.slug]) return;
    var tid = traineeOf(a, c); if(!tid) return;
    st.tby[a.slug] = tid;
    var sk = st.skill[tid] || (st.skill[tid] = { atk: 0, mid: 0, def: 0, gk: 0 }); sk[a.stat] += lv;
  });
  if(upgraded) post("New in the dugout: design, learn, play", "The Chairman (Jay)", "The Studio lets you design your kit, badge, ground and players. Each training session now trains a player you choose, and you can see them improve. In matches you can make changes, watch goals again, and take your own penalties. Everything is optional, and Calm still switches all movement off.");
  save();
}

function sync(){
  var c = ctx(), ids = {}, i, changed = false;
  migrate(c);
  ["cap", "pk", "fk"].forEach(function(k){ if(st[k] && !playerOf(st[k])) st[k] = "" });
  c.avail.forEach(function(p){ ids[p.id] = 1 });
  var seen = {}, gap = st.xi.length !== 11;
  for(i = 0; i < 11; i++){
    var id = st.xi[i];
    if(!id || !ids[id] || seen[id]){ st.xi[i] = ""; gap = true } else seen[id] = 1;
  }
  if(gap){ st.xi = autoPick(st.formation, c.avail, st.xi.filter(Boolean)); changed = true }
  S.PLAYERS.forEach(function(p){
    if(p.fp && c.tr.fp >= p.fp && !st.unlocked[p.id]){
      st.unlocked[p.id] = 1; st.reveal.push(p.id);
      post("New signing: " + p.name, "Transfer news", p.name + " (" + p.pos + ", rated " + p.r + ") has joined " + clubName() + ". " + p.note + ". Pop into Squad if you fancy putting them in your side.");
      changed = true;
    }
  });
  S.ACTS.forEach(function(a){
    var lv = c.tr.levels[a.slug] || 0, was = st.trained[a.slug] || 0;
    if(lv > was){
      var d = lv - was, tid = traineeOf(a, c), pl = tid ? playerOf(tid) : null;
      st.trained[a.slug] = lv;
      if(tid){
        st.tby[a.slug] = tid;
        var sk = st.skill[tid] || (st.skill[tid] = { atk: 0, mid: 0, def: 0, gk: 0 }); sk[a.stat] += d;
        addXp(tid, 2 * d);
        st.lastTrain = { slug: a.slug, id: tid, stat: a.stat, d: d, lv: lv };
      }
      post("Training report: " + a.title, "Coaching staff",
        (was === 0 ? "A match is waiting in the dugout. " : "") + (pl ? pl.name + " trained with it: " + SKILLNAME[a.stat] + " up by " + d + ". " : "") + S.STATS[a.stat].label + " is now at level " + lv + " of " + S.CAP + ". Every bit of doing also turns the luck dial.");
      changed = true;
    }
  });
  var cupN = CUP_AT.filter(function(t){ return sfp(c) >= t }).length;
  if(cupN > (st.cupSeen || 0)){
    st.cupSeen = cupN;
    post("Cup news", "The Chairman (Jay)", cupN === 1 ? "You have earned a place in the cup. The first tie is waiting in the dugout whenever you fancy it." : "Another cup tie is waiting in the dugout (" + CUP_NAMES[cupN - 1] + ").");
    changed = true;
  }
  if(changed) save();
  checkBadges(c);
  return c;
}

/* ---------- sound (off unless asked for) ---------- */
var AC = null;
function actx(){ AC = AC || new (window.AudioContext || window.webkitAudioContext)(); return AC }
function tone(f, d, type, g){
  if(!st.set.sound) return;
  try{
    var a = actx(), o = a.createOscillator(), gn = a.createGain();
    o.type = type || "sine"; o.frequency.value = f; gn.gain.value = g || 0.035;
    o.connect(gn); gn.connect(a.destination); o.start();
    gn.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + d); o.stop(a.currentTime + d + 0.05);
  }catch(e){}
}
function crowd(d, g){
  if(!st.set.sound) return;
  try{
    var a = actx(), n = Math.floor(a.sampleRate * d), buf = a.createBuffer(1, n, a.sampleRate), data = buf.getChannelData(0), i;
    for(i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / n);
    var src = a.createBufferSource(), f = a.createBiquadFilter(), gn = a.createGain();
    f.type = "bandpass"; f.frequency.value = 900; f.Q.value = 0.5; gn.gain.value = g || 0.05;
    src.buffer = buf; src.connect(f); f.connect(gn); gn.connect(a.destination); src.start();
  }catch(e){}
}
function sfx(k){
  if(k === "goal"){ crowd(1.4, 0.07); tone(523, 0.25); setTimeout(function(){ tone(659, 0.3) }, 180); setTimeout(function(){ tone(784, 0.4) }, 360) }
  else if(k === "oppgoal"){ crowd(0.8, 0.03) }
  else if(k === "luck"){ tone(784, 0.35, "triangle", 0.025) }
  else if(k === "whistle"){ tone(1100, 0.5, "sine", 0.025) }
  else if(k === "badge"){ tone(660, 0.2, "triangle", 0.03); setTimeout(function(){ tone(990, 0.3, "triangle", 0.03) }, 140) }
}
function toast(msg){
  var t = $("toast"); t.textContent = msg; t.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(function(){ t.hidden = true }, 4800);
}

var OPCOL = [["#7a3a44","#e9c9cd"],["#34507f","#cfdcf2"],["#6a5330","#efdcb8"],["#2f6a5c","#cdeee4"],["#58407f","#e0d4f5"],["#7a6a35","#f2e8c0"],["#33445f","#b8c8e8"],["#6f3f5f","#f0cfe3"]];
function oppKit(i){ return OPCOL[i % 8] }

/* ---------- drawing: kits, badges, faces, ground ---------- */
var UID = 0;
var SHIRT = "M16 4L2 14l7 11 7-4v31h28V21l7 4 7-11L44 4c-3 5-8 7-14 7S19 9 16 4z";
var PATS = [["plain", "Plain"], ["stripes", "Stripes"], ["hoops", "Hoops"], ["halves", "Halves"], ["sash", "Sash"], ["chevron", "Chevron"], ["pin", "Pinstripes"], ["checks", "Checks"]];
function patSvg(pat, c2){
  var s = "", i, j, f = ' fill="' + c2 + '"';
  if(pat === "stripes") for(i = 0; i < 4; i++) s += '<rect x="' + (11 + i * 10.5) + '" y="0" width="5.5" height="60"' + f + '/>';
  else if(pat === "hoops") for(i = 0; i < 3; i++) s += '<rect x="0" y="' + (13 + i * 13) + '" width="60" height="6"' + f + '/>';
  else if(pat === "halves") s = '<rect x="30" y="0" width="30" height="60"' + f + '/>';
  else if(pat === "sash") s = '<path d="M4 4L20 0L60 54L44 58z"' + f + '/>';
  else if(pat === "chevron") s = '<path d="M0 22L30 40L60 22V30L30 48L0 30z"' + f + '/>';
  else if(pat === "pin") for(i = 0; i < 10; i++) s += '<rect x="' + (8 + i * 5.2) + '" y="0" width="1.6" height="60"' + f + '/>';
  else if(pat === "checks") for(i = 0; i < 6; i++) for(j = 0; j < 5; j++) if((i + j) % 2) s += '<rect x="' + (i * 10) + '" y="' + (4 + j * 10) + '" width="10" height="10"' + f + '/>';
  return s;
}
function shirt(kit, txt){
  var id = "sc" + (++UID), tc = lum(kit.c1) > 0.55 ? "#10172a" : "#ffffff", ts = tc === "#ffffff" ? "#10172a" : "#ffffff";
  return '<svg viewBox="0 0 60 56" aria-hidden="true"><defs><clipPath id="' + id + '"><path d="' + SHIRT + '"/></clipPath></defs><g clip-path="url(#' + id + ')"><rect width="60" height="56" fill="' + kit.c1 + '"/>' + patSvg(kit.pat, kit.c2) + '</g><path d="' + SHIRT + '" fill="none" stroke="' + kit.c2 + '" stroke-width="2.6" stroke-linejoin="round"/><text x="30" y="40" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="900" font-size="19" fill="' + tc + '"' + (kit.pat === "plain" ? "" : ' stroke="' + ts + '" stroke-width="2.4" paint-order="stroke"') + '>' + txt + '</text></svg>';
}
function tokStyle(kit){
  var a = kit.c1, b = kit.c2, bg;
  if(kit.pat === "stripes") bg = "linear-gradient(90deg," + a + " 0 30%," + b + " 30% 70%," + a + " 70%)";
  else if(kit.pat === "hoops") bg = "linear-gradient(180deg," + a + " 0 30%," + b + " 30% 70%," + a + " 70%)";
  else if(kit.pat === "halves") bg = "linear-gradient(90deg," + a + " 50%," + b + " 50%)";
  else if(kit.pat === "sash") bg = "linear-gradient(135deg," + a + " 30%," + b + " 30% 70%," + a + " 70%)";
  else if(kit.pat === "chevron") bg = "linear-gradient(180deg," + a + " 0 45%," + b + " 45%)";
  else if(kit.pat === "pin") bg = "repeating-linear-gradient(90deg," + a + " 0 2px," + b + " 2px 3px)";
  else if(kit.pat === "checks") bg = "conic-gradient(" + a + " 25%," + b + " 0 50%," + a + " 0 75%," + b + " 0) 0 0/60% 60%";
  else bg = a;
  if(kit.pat !== "plain") bg = "radial-gradient(circle," + a + " 0 44%,transparent 47%)," + bg;
  return "background:" + bg + ";border-color:" + b + ";color:" + (lum(a) > 0.55 ? "#10172a" : "#fff");
}
var SHAPES = { shield: "M3 4h40v26c0 10-9 17-20 21C12 47 3 40 3 30z", round: "M23 4a22 22 0 1 1-.01 0z", diamond: "M23 2L44 26L23 50L2 26z", hex: "M12 4h22l11 22-11 22H12L1 26z", banner: "M4 3h38v37l-19 10L4 40z" };
var SHAPELIST = [["shield", "Shield"], ["round", "Round"], ["diamond", "Diamond"], ["hex", "Hexagon"], ["banner", "Banner"]];
var SYMS = [["bird", "Bird"], ["star", "Star"], ["bolt", "Bolt"], ["ball", "Ball"], ["crown", "Crown"], ["flame", "Flame"], ["leaf", "Leaf"], ["anchor", "Anchor"], ["sun", "Sun"], ["paw", "Paw"], ["initials", "Letters"]];
var CBGS = [["plain", "Plain"], ["split", "Split"], ["band", "Band"], ["stripe", "Stripe"]];
function symSvg(k, sc, c1, ini){
  var f = ' fill="' + sc + '"', s = ' stroke="' + sc + '"';
  if(k === "star") return '<polygon points="23,12 27,22 38,23 30,30 32,41 23,35 14,41 16,30 8,23 19,22"' + f + '/>';
  if(k === "bolt") return '<path d="M27 9L13 30h9l-3 13 15-21h-9z"' + f + '/>';
  if(k === "ball") return '<circle cx="23" cy="26" r="12" fill="none"' + s + ' stroke-width="3"/><polygon points="23,19 29,24 27,31 19,31 17,24"' + f + '/>';
  if(k === "crown") return '<path d="M12 34l-2-15 8 7 5-11 5 11 8-7-2 15z"' + f + '/>';
  if(k === "flame") return '<path d="M23 10c2 6 10 8 10 17a10 10 0 0 1-20 0c0-4 2-7 5-9 0 3 1 5 3 5-1-5 0-9 2-13z"' + f + '/>';
  if(k === "leaf") return '<path d="M12 35C12 21 20 13 35 13c0 14-8 22-21 22z"' + f + '/><path d="M14 34L31 17" stroke="' + c1 + '" stroke-width="1.8" fill="none"/>';
  if(k === "anchor") return '<g fill="none"' + s + ' stroke-width="3" stroke-linecap="round"><circle cx="23" cy="14" r="3.2"/><path d="M23 17v21M16 24h14M12 29c1 6 6 9 11 9s10-3 11-9"/></g>';
  if(k === "sun") return '<circle cx="23" cy="26" r="6.5"' + f + '/><path d="M23 11v5M23 36v5M8 26h5M33 26h5M12.5 15.5l3.5 3.5M30 33l3.5 3.5M33.5 15.5L30 19M16 33l-3.5 3.5" fill="none"' + s + ' stroke-width="2.6" stroke-linecap="round"/>';
  if(k === "paw") return '<ellipse cx="23" cy="33" rx="8" ry="6"' + f + '/><circle cx="13.5" cy="25" r="3"' + f + '/><circle cx="19" cy="18.5" r="3.2"' + f + '/><circle cx="27" cy="18.5" r="3.2"' + f + '/><circle cx="32.5" cy="25" r="3"' + f + '/>';
  if(k === "initials") return '<text x="23" y="32" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="900" font-size="' + (ini.length > 2 ? 15 : 19) + '"' + f + '>' + esc(ini) + '</text>';
  return '<path d="M13 30c3-9 9-14 19-15-3 3-4 5-4 8 3 0 5 1 6 3-4 0-6 1-8 4-2 5-8 6-13 0z"' + f + '/><circle cx="31" cy="21" r="1.6" fill="' + c1 + '"/>';
}
function crestSvg(w, plain, over){
  var o = over ? Object.assign({}, st.club, over) : st.club, c1 = o.c1, c2 = o.c2, id = "cc" + (++UID), sh = SHAPES[o.shape] || SHAPES.shield, bg = o.cbg || "plain", ov = "";
  if(bg === "split") ov = '<rect x="23" y="0" width="30" height="60" fill="' + c2 + '"/>';
  else if(bg === "band") ov = '<rect x="0" y="19" width="50" height="13" fill="' + c2 + '"/>';
  else if(bg === "stripe") ov = '<rect x="17" y="0" width="12" height="60" fill="' + c2 + '"/>';
  var ini = (o.short ? String(o.short).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3) : "") || shortName().slice(0, 3);
  var disc = bg === "plain" ? "" : '<circle cx="23" cy="26" r="13.5" fill="' + c1 + '" opacity=".92"/>';
  var sym = symSvg(o.crest, bg === "plain" ? c2 : (bg === "split" || bg === "stripe" || bg === "band" ? c2 : c2), c1, ini);
  return '<svg ' + (plain ? 'style="flex:none" width="' + w + '" height="' + Math.round(w * 1.13) + '"' : 'class="cr" style="width:' + w + 'px;height:' + Math.round(w * 1.13) + 'px"') + ' viewBox="0 0 46 52" aria-hidden="true"><defs><clipPath id="' + id + '"><path d="' + sh + '"/></clipPath></defs><path d="' + sh + '" fill="' + c1 + '"/><g clip-path="url(#' + id + ')">' + ov + '</g>' + disc + sym + '<path d="' + sh + '" fill="none" stroke="' + c2 + '" stroke-width="3" stroke-linejoin="round"/></svg>';
}
function opCrest(i, w, plain){
  var cols = oppKit(i);
  return '<svg ' + (plain ? 'style="flex:none" width="' + w + '" height="' + Math.round(w * 1.13) + '"' : 'class="cr"') + ' viewBox="0 0 46 52" aria-hidden="true"><path d="M3 4h40v26c0 10-9 17-20 21C12 47 3 40 3 30z" fill="' + cols[0] + '" stroke="' + cols[1] + '" stroke-width="3"/><path d="M3 20h40v8H3z" fill="' + cols[1] + '" opacity=".8"/></svg>';
}
var SKIN = ["#f1c9a5", "#e0ac82", "#c68642", "#8d5524", "#6b3f1f", "#f6d7bd", "#fbe3cf", "#4a2c17"], HAIR = ["#1b1b1b", "#3b2a1a", "#6b4423", "#b5651d", "#d8b45a", "#8c2f1f", "#b9b9b9", "#3a7bd5", "#e56b9c"];
var HAIRN = ["Short", "Curly", "Swept", "Bunches", "Bald", "Neat", "Mohawk"], ACCN = ["Nothing", "Headband", "Glasses", "Beard"];
function sgLook(id){ var r = st.signed.filter(function(x){ return x.id === id })[0]; return r && r.look }
function lookOf(id){
  var hs = hash(id), o = st.look[id] || sgLook(id) || {};
  return { s: o.s != null ? o.s : hs % 6, h: o.h != null ? o.h : (hs >>> 6) % 4, c: o.c != null ? o.c : (hs >>> 3) % 6, a: o.a || 0 };
}
function avatar(id, w, pos){
  var lk = lookOf(id), skin = SKIN[lk.s] || SKIN[0], hair = HAIR[lk.c] || HAIR[0], sty = lk.h, hr = "", acc = "";
  var gk = pos === "GK", c1 = gk ? st.club.gk : st.club.c1, c2 = gk ? (lum(st.club.gk) > 0.55 ? "#2a2008" : "#ffffff") : st.club.c2;
  if(sty === 0) hr = '<path d="M17 25c0-10 6-15 13-15s13 5 13 15c-4-5-9-7-13-7s-9 2-13 7z" fill="' + hair + '"/>';
  else if(sty === 1) hr = '<path d="M18 24c1-9 6-13 12-13s11 4 12 13c-3-3-6-4-12-4s-9 1-12 4z" fill="' + hair + '"/><circle cx="18" cy="26" r="3" fill="' + hair + '"/><circle cx="42" cy="26" r="3" fill="' + hair + '"/>';
  else if(sty === 2) hr = '<path d="M18 22c2-8 7-11 12-11 6 0 11 4 12 11-5-2-8-5-11-5-4 3-9 4-13 5z" fill="' + hair + '"/>';
  else if(sty === 3) hr = '<circle cx="21" cy="19" r="5" fill="' + hair + '"/><circle cx="30" cy="15" r="6" fill="' + hair + '"/><circle cx="39" cy="19" r="5" fill="' + hair + '"/>';
  else if(sty === 5) hr = '<path d="M19 23c1-8 5-12 11-12s10 4 11 12c-5-2-7-3-11-3s-6 1-11 3z" fill="' + hair + '"/>';
  else if(sty === 6) hr = '<path d="M26 8h8l2 13h-12z" fill="' + hair + '"/>';
  if(lk.a === 1) acc = '<rect x="18" y="20" width="24" height="3.6" rx="1.8" fill="' + c2 + '" stroke="' + c1 + '" stroke-width=".8"/>';
  else if(lk.a === 2) acc = '<g fill="none" stroke="#1a1a1a" stroke-width="1.5"><circle cx="25.5" cy="27" r="3.6"/><circle cx="34.5" cy="27" r="3.6"/><path d="M29 27h2"/></g>';
  else if(lk.a === 3) acc = '<path d="M19 30q11 14 22 0-1 9-11 10-10-1-11-10z" fill="' + hair + '"/>';
  return '<svg viewBox="0 0 60 60" width="' + w + '" height="' + w + '" aria-hidden="true"><path d="M6 60c0-13 11-18 24-18s24 5 24 18z" fill="' + c1 + '"/><path d="M22 43l8 8 8-8" fill="none" stroke="' + c2 + '" stroke-width="3"/><rect x="26" y="34" width="8" height="9" fill="' + skin + '"/><circle cx="30" cy="26" r="12" fill="' + skin + '"/>' + hr + '<circle cx="25.5" cy="27" r="1.4" fill="#1a1a1a"/><circle cx="34.5" cy="27" r="1.4" fill="#1a1a1a"/><path d="M26 32q4 3 8 0" fill="none" stroke="#1a1a1a" stroke-width="1.4" stroke-linecap="round"/>' + acc + '</svg>';
}
function tier(p){ return (isMine(p.id) || p.fp) ? "icon" : (rate(p) >= 66 ? "gold" : (rate(p) >= 62 ? "silver" : "bronze")) }
function pcard(p, o){
  o = o || {};
  var bn = bonusOf(p.id), g = o.goals || 0, at = o.inxi, sk = skillTotal(p.id);
  var tg = (o.tag || "button");
  return '<' + tg + ' class="pcard t-' + tier(p) + (o.sel ? " sel" : "") + (o.mini ? " mini" : "") + '"' + (o.act ? ' data-act="player" data-id="' + p.id + '"' : "") + '>' +
    '<span class="rt">' + rate(p) + '<small>' + p.pos + '</small></span>' + (at ? '<span class="inx">IN SIDE</span>' : '') +
    '<span class="shn">#' + numOf(p.id) + '</span>' + (st.cap === p.id ? '<span class="cpt" title="Captain">C</span>' : '') +
    '<span class="av">' + avatar(p.id, 74, p.pos) + '</span><span class="nm">' + esc(p.name) + '</span><span class="nt">' + esc(p.note) + '</span>' +
    '<span class="gr">' + (bn ? "+" + bn + " growth" : "&nbsp;") + (sk ? " &middot; +" + sk + " skill" : "") + (g ? " &middot; " + g + (g === 1 ? " goal" : " goals") : "") + '</span></' + tg + '>';
}
function stadium(){
  var x, c1 = st.club.c1, c2 = st.club.c2, gp = st.club.gpat || "stripes", s = '<svg class="bg" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
    '<linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04060f"/><stop offset="1" stop-color="#1c2b5a"/></linearGradient>' +
    '<radialGradient id="gl"><stop offset="0" stop-color="#fff3c0" stop-opacity=".95"/><stop offset="1" stop-color="#fff3c0" stop-opacity="0"/></radialGradient>' +
    '<pattern id="crowd" width="10" height="8" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2" fill="' + c2 + '" opacity=".5"/><circle cx="8" cy="6.5" r="2" fill="#2b3a68"/></pattern></defs>' +
    '<rect width="800" height="300" fill="url(#sk)"/>' +
    '<path d="M0 78L800 98V130H0Z" fill="#0b1229"/><path d="M0 78L800 98V130H0Z" fill="url(#crowd)" opacity=".7"/>' +
    '<path d="M0 126H800V192H0Z" fill="#101a3b"/><path d="M0 126H800V192H0Z" fill="url(#crowd)"/>';
  [90, 270, 530, 710].forEach(function(px){
    s += '<circle class="fl" cx="' + px + '" cy="26" r="78" fill="url(#gl)"/><rect x="' + (px - 3) + '" y="26" width="6" height="104" fill="#0a1024"/><rect x="' + (px - 24) + '" y="12" width="48" height="24" rx="3" fill="#1f2b55"/>';
    for(x = 0; x < 6; x++) s += '<circle cx="' + (px - 18 + (x % 3) * 18) + '" cy="' + (19 + Math.floor(x / 3) * 11) + '" r="4" fill="#fff6cf"/>';
  });
  s += '<path d="M0 192H800V300H0Z" style="fill:var(--g1)"/>';
  if(gp === "stripes") for(x = 0; x < 8; x++) s += '<rect x="' + (x * 100) + '" y="192" width="100" height="108" style="fill:' + (x % 2 ? "var(--g2)" : "var(--g1)") + '"/>';
  else if(gp === "checks") for(x = 0; x < 16; x++) for(var yy = 0; yy < 3; yy++) if((x + yy) % 2) s += '<rect x="' + (x * 50) + '" y="' + (192 + yy * 36) + '" width="50" height="36" style="fill:var(--g2)"/>';
  for(x = 0; x < 16; x++) s += '<rect x="' + (x * 50) + '" y="186" width="50" height="8" fill="' + (x % 2 ? c1 : c2) + '"/>';
  s += '<ellipse cx="400" cy="250" rx="90" ry="24" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2"/><path d="M400 200V300" stroke="#fff" stroke-opacity=".4" stroke-width="2"/></svg>';
  return s;
}
function dialSvg(luck){
  var ang = -90 + 180 * luck, ticks = "", i;
  for(i = 0; i <= 10; i++){
    var a = (-180 + i * 18) * Math.PI / 180;
    ticks += '<line x1="' + (130 + 96 * Math.cos(a)).toFixed(1) + '" y1="' + (130 + 96 * Math.sin(a)).toFixed(1) + '" x2="' + (130 + 108 * Math.cos(a)).toFixed(1) + '" y2="' + (130 + 108 * Math.sin(a)).toFixed(1) + '" stroke="#9fb0d0" stroke-width="2"/>';
  }
  return '<svg viewBox="0 0 260 150" role="img" aria-label="Luck dial at ' + Math.round(luck * 100) + ' percent"><path d="M22 130A108 108 0 0 1 238 130" fill="none" stroke="#26365e" stroke-width="14" stroke-linecap="round"/>' +
    '<path d="M22 130A108 108 0 0 1 238 130" fill="none" stroke="#f0cf6a" stroke-width="14" stroke-linecap="round" stroke-dasharray="' + (339 * luck).toFixed(1) + ' 400"/>' + ticks +
    '<g class="needle" style="transform:rotate(' + ang + 'deg)"><path d="M130 130L126 52h8z" fill="#eef2fb"/></g><circle cx="130" cy="130" r="9" fill="#eef2fb"/></svg>';
}
function medal(i, on){
  var cols = on ? ["#f6d878", "#b8860b"] : ["#5a6684", "#3a4560"], sym;
  var k = i % 4;
  if(k === 0) sym = '<polygon points="23,12 27,21 37,22 30,29 32,38 23,33 14,38 16,29 9,22 19,21" fill="#fff" opacity=".92"/>';
  else if(k === 1) sym = '<circle cx="23" cy="24" r="10" fill="none" stroke="#fff" stroke-width="3" opacity=".92"/><polygon points="23,18 28,22 26,28 20,28 18,22" fill="#fff" opacity=".92"/>';
  else if(k === 2) sym = '<path d="M26 11L14 26h8l-3 11 13-17h-8z" fill="#fff" opacity=".92"/>';
  else sym = '<path d="M12 24l8 8 14-16" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" opacity=".92"/>';
  return '<svg viewBox="0 0 46 52" aria-hidden="true"><path d="M14 0h8l3 14h-8zM32 0h-8l-3 14h8z" fill="' + (on ? "#e06b6b" : "#4a5470") + '"/><circle cx="23" cy="30" r="19" fill="' + cols[0] + '" stroke="' + cols[1] + '" stroke-width="3"/>' + sym.replace(/<(\w+)/g, function(m){ return m }) + '</svg>';
}
function cupSvg(on){
  var f = on ? "#f6d878" : "#4a5470", s = on ? "#b8860b" : "#2f3a54";
  return '<svg viewBox="0 0 70 80" aria-hidden="true"><path d="M18 6h34v20c0 11-8 19-17 20-9-1-17-9-17-20z" fill="' + f + '" stroke="' + s + '" stroke-width="3"/><path d="M18 12H6c0 12 5 19 14 21M52 12h12c0 12-5 19-14 21" fill="none" stroke="' + s + '" stroke-width="4"/><rect x="31" y="46" width="8" height="14" fill="' + f + '"/><rect x="21" y="60" width="28" height="9" rx="2" fill="' + f + '" stroke="' + s + '" stroke-width="2.5"/></svg>';
}
function renderClub(){
  var c = ctx();
  $("clubbox").innerHTML = crestSvg(58, true) + '<div><b>' + esc(clubName()) + '</b><small>Manager: JT &middot; ' + esc(rankOf(c.tr.fp)) + '</small></div>' +
    '<div class="kitbar" aria-hidden="true"><i style="background:' + st.club.c1 + '"></i><i style="background:' + st.club.c2 + '"></i></div>';
}
function icon(n){ return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[n] + '</svg>' }
function renderNav(){
  var unread = st.inbox.some(function(m){ return !m.read });
  $("nav").innerHTML = VIEWS.filter(function(v){ return !v.hidden }).map(function(v){
    var d = "";
    if(v.id === "inbox" && unread) d = '<span class="dot" title="New messages"></span>';
    if(v.id === "dugout" && (pendingList().length && st.played.length < ROUNDS)) d = '<span class="dot" title="A match is ready"></span>';
    if(v.id === "club" && newB.length) d = '<span class="dot" title="New badge"></span>';
    return '<button data-act="view" data-v="' + v.id + '"' + (v.id === view ? ' aria-current="page"' : "") + '>' + icon(v.icon) + '<span>' + v.label + '</span>' + d + '</button>';
  }).join("");
}

/* ---------- chrome ---------- */
function renderPills(c){
  var tb = S.table(st.seed, st.played), mot = sysReduce ? "Calm (your device setting)" : (calm() ? "Calm" : "Lively"), unread = st.inbox.some(function(m){ return !m.read });
  $("pills").innerHTML = '<span class="pill">Matchday <b>' + Math.min(st.played.length + 1, ROUNDS) + '</b> of ' + ROUNDS + '</span>' +
    '<span class="pill">League <b>' + (st.played.length ? ord(posOf(tb)) : "-") + '</b></span>' +
    '<button class="pill" data-act="view" data-v="business" title="Your coins">Coins <b style="color:var(--gold)">' + st.coins + '</b></button>' +
    '<span class="pill">Luck <b>' + Math.round(c.tr.luck * 100) + '%</b></span>' +
    '<button class="pill" data-act="motion" aria-pressed="' + (!calm()) + '" ' + (sysReduce ? "disabled" : "") + ' title="Switch movement on or off any time">Motion: <b style="color:inherit">' + mot + '</b></button>' +
    '<button class="pill" data-act="menu">Menu</button>' +
    '<button class="pill" data-act="view" data-v="inbox">Inbox' + (unread ? ' <span class="dot" title="New messages" style="position:static;display:inline-block;margin-left:4px"></span>' : "") + '</button>' +
    '<button class="pill" data-act="view" data-v="settings">Settings</button>';
}
function render(){
  var c = sync();
  var V = VIEWS.filter(function(v){ return v.id === view })[0];
  $("title").textContent = V.title;
  applyMotion(); applyKit();
  renderNav(); renderPills(c); renderClub();
  var fn = { dugout: vDugout, squad: vSquad, train: vTrain, league: vLeague, market: vMarket, business: vBusiness, studio: vStudio, club: vClub, inbox: vInbox, send: vSend, settings: vSettings }[view];
  var vw = $("view"); vw.style.animation = "none"; void vw.offsetWidth; vw.style.animation = "";
  vw.innerHTML = fn(c);
  if(view === "send") mountSend();
  if(view === "inbox"){ var any = false; st.inbox.forEach(function(m){ if(!m.read){ m.read = true; any = true } }); if(any){ save(); renderNav(); renderPills(c) } }
  if(view === "club" && newB.length){ newB.forEach(function(b){ b.seen = 1 }) }
  if(wiz.on) wizDraw(c);
  document.title = V.title + " - Base 5";
  afterRender();
}

/* ---------- the dugout extras: the learning link made visible ---------- */
function skillChips(id){
  var s = st.skill[id] || {}, o = "";
  ["atk", "mid", "def", "gk"].forEach(function(k){ if(s[k]) o += '<span class="sk" style="--sc:' + STATCOL[k] + '">' + SKILLNAME[k].slice(0, 3).toUpperCase() + ' +' + s[k] * 5 + '</span>' });
  return o || '<span class="hint">no training yet</span>';
}
function riseCard(c){
  var lt = st.lastTrain, a = lt ? actBy(lt.slug) : null, p = lt ? playerOf(lt.id) : null, h = '<section class="card"><h3>Training is paying off</h3>';
  if(a && p) h += '<div class="lastt"><button class="lnk" data-act="edit" data-id="' + p.id + '">' + avatar(p.id, 52, p.pos) + '</button><p style="margin:0"><b>' + esc(p.name) + '</b> trained in <b>' + esc(a.title) + '</b> and gained <b>+' + lt.d * 5 + ' ' + SKILLNAME[lt.stat] + '</b>. That is the skill that shows in matches.</p></div>';
  else h += '<p class="hint">Choose a player in <b>Training</b>, then try a session. The player you chose gets better at what the session trains, and you can watch it show up here and in matches.</p>';
  var rise = S.PLAYERS.filter(function(q){ return skillTotal(q.id) > 0 }).sort(function(x, y){ return skillTotal(y.id) - skillTotal(x.id) }).slice(0, 3);
  if(rise.length) h += '<div class="rise">' + rise.map(function(q){
    return '<button class="riser" data-act="edit" data-id="' + q.id + '">' + radarSvg(q, 64) + '<span><b>' + esc(q.name) + '</b><span class="sks">' + skillChips(q.id) + '</span></span></button>';
  }).join("") + '</div>';
  return h + '<div class="mbtns" style="margin:12px 0 0"><button class="btn" data-act="view" data-v="train">Choose who trains</button></div></section>';
}

/* ---------- squad: pitch, tactics, set pieces ---------- */
function pitchCard(c, cls){
  var F = S.FORMATIONS[st.formation], t = teamNow(c), i;
  var h = '<div class="card ' + cls + '"><h3>Formation</h3><div class="formrow">' +
    Object.keys(S.FORMATIONS).map(function(k){ return '<button data-act="form" data-f="' + k + '" aria-pressed="' + (k === st.formation) + '">' + k + '<small>' + S.FORMATIONS[k].note + '</small></button>' }).join("") + '</div>';
  h += '<div class="strip">' + [["atk", "ATK"], ["mid", "MID"], ["def", "DEF"], ["gk", "GK"]].map(function(k){ return '<div><b>' + r1(t[k[0]]) + '</b><small>' + k[1] + '</small>' + (c.tr.boost[k[0]] > 0.04 ? '<br><em>' + plus(c.tr.boost[k[0]]) + ' training</em>' : '') + '</div>' }).join("") + '</div>';
  h += '<div class="pitch"><div class="half"></div><div class="box1"></div><div class="box2"></div>';
  for(i = 0; i < 11; i++){
    var pid = st.xi[i], p = pid ? S.playerById(pid) : null, slotPos = F.slots[i];
    var eff = p ? Math.round(rate(p) * S.fit(p.pos, slotPos)) : "";
    h += '<button class="slot ' + slotPos + (sel && sel.slot === i ? " sel" : "") + (p && p.pos !== slotPos ? " off" : "") + '" data-act="slot" data-i="' + i + '" style="left:' + F.xy[i][0] + '%;top:' + F.xy[i][1] + '%" aria-label="' + slotPos + ' slot ' + (p ? esc(p.name) + ", number " + numOf(p.id) + ", rated " + eff : "empty") + '">' + shirt(kitOf(slotPos === "GK"), p ? numOf(p.id) : "+") + '<span>' + (p ? esc(surname(p.name)) + (st.cap === p.id ? " (C)" : "") + ' <i>' + eff + '</i>' : slotPos) + '</span></button>';
  }
  return h + '</div><p class="hint" style="margin-top:12px">Tap a spot on the pitch, then tap a player card to put them there. A faded shirt means a player is out of position and plays a bit below their rating. The small number is their rating in that spot.</p><div class="mbtns"><button class="btn" data-act="auto">Pick the best side for me</button></div></div>';
}
function selHtml(key, cur, label, opts){
  return '<label class="selw"><span>' + label + '</span><select data-sel="' + key + '">' + opts.map(function(o){ return '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(cur) ? " selected" : "") + '>' + esc(o[1]) + '</option>' }).join("") + '</select></label>';
}
function tacBtns(k, items){
  return '<div class="opts">' + items.map(function(it){ return '<button data-act="tac" data-k="' + k + '" data-v="' + it[0] + '" aria-pressed="' + (st.tac[k] === it[0]) + '">' + it[1] + '<small>' + it[2] + '</small></button>' }).join("") + '</div>';
}
function tacCard(c, cls){
  var xi = st.xi.filter(Boolean).map(playerOf).filter(Boolean), outf = xi.filter(function(p){ return p.pos !== "GK" });
  var all = [["", "Let the coach choose"]].concat(xi.map(function(p){ return [p.id, p.name] })), pk = [["", "Let the coach choose"]].concat(outf.map(function(p){ return [p.id, p.name] }));
  return '<div class="card ' + cls + '"><h3>Tactics and set pieces</h3><h4>Mentality</h4>' +
    tacBtns("ment", [["def", "Defend", "More cover, less attack"], ["bal", "Balanced", "Steady"], ["att", "Attack", "More goals, more risk"]]) +
    '<h4>Pressing</h4>' + tacBtns("press", [["low", "Sit deep", "Hard to break down"], ["mid", "Mid block", "Steady"], ["high", "Press high", "Win it back early"]]) +
    '<div class="selrow">' + selHtml("cap", st.cap, "Captain (plus one rating)", all) + selHtml("pk", st.pk, "Penalty taker", pk) + selHtml("fk", st.fk, "Free kick taker", pk) + '</div>' +
    '<p class="hint" style="margin:10px 0 0">The captain wears the armband and plays a little better. Your penalty taker steps up first in a shoot-out, and your free kick taker is first choice for set pieces.</p></div>';
}
function listCard(c, cls){
  var tally = goalTally(), sp = sel && sel.player ? playerOf(sel.player) : null;
  var h = '<div class="card ' + cls + '"><h3>Squad cards</h3>' + (sp ? '<div class="selbar"><span>Chosen: <b>' + esc(sp.name) + '</b>. Tap a spot on the pitch to place them.</span><button class="btn" data-act="edit" data-id="' + sp.id + '">Edit player</button></div>' : "") +
    '<div class="chips">' + ["ALL", "GK", "DEF", "MID", "FWD"].map(function(k){ return '<button data-act="pf" data-k="' + k + '" aria-pressed="' + (posFilter === k) + '">' + (k === "ALL" ? "All" : k) + '</button>' }).join("") + '</div><div class="cards">';
  S.PLAYERS.filter(function(p){ return posFilter === "ALL" || p.pos === posFilter }).sort(function(a, b){ var la = a.fp && c.tr.fp < a.fp ? 1 : 0, lb = b.fp && c.tr.fp < b.fp ? 1 : 0; return (la - lb) || (rate(b) - rate(a)) }).forEach(function(p){
    var open = !p.fp || c.tr.fp >= p.fp, at = st.xi.indexOf(p.id);
    if(!open){
      h += '<div class="pcard locked"><span class="pp ' + p.pos + '">' + p.pos + '</span><b>' + esc(p.name) + '</b><span style="font-size:.78rem">Unlocks at ' + p.fp + ' focus points<br>(you have ' + c.tr.fp + ')</span></div>';
    } else {
      h += pcard(p, { act: 1, sel: sel && sel.player === p.id, inxi: at >= 0, goals: tally[p.name] || 0 });
    }
  });
  return h + '</div></div>';
}
function vSquad(c){
  return '<div class="grid">' + pitchCard(c, "s7") + listCard(c, "s5") + tacCard(c, "s12") + '<div class="card s12"><h3>Your club</h3><div class="mbtns" style="margin:0"><button class="btn" data-act="view" data-v="studio">Open the Studio</button><button class="btn" data-act="help">How to play</button></div></div></div>';
}

/* ---------- training: choose who trains ---------- */
function vTrain(c){
  var h = '<div class="row2" style="margin-bottom:6px">' + managerCard(c) + '<section class="card"><h3>How training works</h3><p class="hint" style="margin:0">Every session trains one part of the team. Choose who trains under each session, then try it. It opens in this tab, and a button at the bottom left brings you back. The player you chose gets better at what the session trains, and you will see it in their card and in matches.</p></section></div>';
  ["atk", "mid", "def", "gk"].forEach(function(k){
    var list = S.ACTS.filter(function(a){ return a.stat === k });
    h += '<div class="group-h" style="--sc:' + STATCOL[k] + '"><b>' + S.STATS[k].label + '</b><span class="hint">' + (c.tr.boost[k] > 0.04 ? plus(c.tr.boost[k]) + " boost so far" : "no boost yet") + '</span></div><div class="tgrid">';
    list.forEach(function(a){
      var lv = c.tr.levels[a.slug] || 0, pips = "", tid = traineeOf(a, c), pos = GROUP[a.stat];
      for(var i = 0; i < S.CAP; i++) pips += '<i class="' + (i < lv ? "on" : "") + '"></i>';
      var opts = c.avail.slice().sort(function(x, y){ return ((y.pos === pos) - (x.pos === pos)) || (rate(y) - rate(x)) }).map(function(p){ return [p.id, p.name + " (" + p.pos + ")"] });
      h += '<div class="tcard" style="--sc:' + STATCOL[k] + '"><span class="pil">' + esc(a.pillar) + '</span><h4>' + esc(a.title) + '</h4><span>' + esc(a.blurb) + '</span><div class="pips" aria-label="Training level ' + lv + ' of ' + S.CAP + '">' + pips + '</div>' +
        selHtml("tr:" + a.slug, tid, "Who trains (" + SKILLNAME[a.stat] + ")", opts) +
        '<a class="btn ' + (lv === 0 ? "btn-go" : "") + '" href="/practice/' + a.slug + '.html?from=jt">' + (lv === 0 ? "Have a go" : "Back to training") + '</a></div>';
    });
    h += '</div>';
  });
  return h;
}

/* ---------- settings ---------- */
function vSettings(){
  function seg(key, items){
    return '<div class="opts">' + items.map(function(it){ return '<button data-act="set" data-k="' + key + '" data-v="' + it[0] + '" aria-pressed="' + (String(st.set[key]) === it[0]) + '">' + it[1] + '</button>' }).join("") + '</div>';
  }
  return '<div class="card"><h3>Make it comfortable</h3><p class="hint">Everything here is your choice, and you can change it any time. The Motion button at the top of every page does the first one in a tap.</p>' +
    '<h4>Movement</h4>' + (sysReduce ? '<p class="hint">Your device asks for less movement, so everything stays calm.</p>' : seg("motion", [["calm", "Calm (nothing moves)"], ["lively", "Lively (matches and cards come alive)"]])) +
    '<h4>Sound</h4>' + seg("sound", [["false", "Off"], ["true", "On, soft (crowd and goals)"]]) +
    '<h4>Commentary voice</h4><p class="hint" style="margin:0 0 4px">Reads out the big moments in a match, using your device voice.</p>' + seg("voice", [["false", "Off"], ["true", "On"]]) +
    '<h4>Match speed</h4>' + seg("pace", [["gentle", "Gentle"], ["quick", "Quick"]]) +
    '<h4>Start again</h4>' + resetHtml() +
    '<div class="mbtns"><button class="btn" data-act="view" data-v="dugout">Back to the dugout</button></div></div>';
}
var resetAsk = "";
function resetHtml(){
  if(false) return '<div class="choice"><p style="margin:0 0 8px"><b>Start a new season?</b> Matches, the table, the cup, badges, player growth and training results go back to the start. Your club design, own players, names and numbers stay. The sessions you have done will earn matches again.</p><div class="mbtns" style="margin:0"><button class="btn btn-go" data-act="rsdo" data-v="season">Yes, start a new season</button><button class="btn" data-act="rsask" data-v="">Not now</button></div></div>';
  if(resetAsk === "all") return '<div class="choice"><p style="margin:0 0 8px"><b>Wipe everything?</b> This clears the whole dugout, including your club design and own players, and starts the setup again. It cannot be undone. Your practice activities are not touched.</p><div class="mbtns" style="margin:0"><button class="btn btn-go" data-act="rsdo" data-v="all">Yes, wipe it all</button><button class="btn" data-act="rsask" data-v="">Not now</button></div></div>';
  return '<p class="hint" style="margin:0 0 4px">Fancy a fresh go? Nothing happens until you confirm, and your practice activities are never touched. A new season starts by itself after fifteen matches.</p><div class="mbtns" style="margin:0"><button class="btn btn-quiet" data-act="rsask" data-v="all">Reset everything</button></div>';
}
function resetDo(kind){
  if(kind === "all"){ try{ localStorage.removeItem(KEY) }catch(e){} mem = null; location.reload(); return }
  st.seed = 1 + Math.floor(Math.random() * 2000000000);
  st.xi = []; st.used = []; st.played = []; st.inbox = []; st.nid = 1; st.cup = { ties: [], out: false }; st.dev = { xp: {}, bonus: {} };
  st.trained = {}; st.unlocked = {}; st.reveal = []; st.bd = {}; st.cupSeen = 0; st.skill = {}; st.tby = {}; st.focus = {}; st.lastTrain = null; st.madeSub = 0;
  newB = [];
  post("A new season begins", "The Chairman (Jay)", "Fresh start. Your club, players and design are all still yours. Have a go at any training session and a match turns up.");
  save();
}


/* ---------- v5: divisions, seasons, coins, company, market ---------- */
var coDraft = null, coEditing = false, rvMode = "", sellAsk = "";
var INDS = ["Sports kit", "Snacks and drinks", "Games", "Music", "Bikes", "Pets", "Tech", "Books"];
var FIRSTN = ["Ash", "Bailey", "Cal", "Dev", "Eli", "Finn", "Gus", "Hari", "Ivo", "Jory", "Kai", "Leo", "Milo", "Nico", "Omar", "Pip", "Quinn", "Remy", "Sol", "Tobi", "Uma", "Vic", "Wes", "Yusuf", "Zane", "Ada", "Bea", "Cleo", "Dani", "Esme"];
var MSURN = ["Abbott", "Brook", "Castle", "Dunn", "Easton", "Frost", "Gallow", "Hale", "Irving", "Jolly", "Knight", "Lund", "Mason", "Nolan", "Oduya", "Pryor", "Raine", "Stone", "Tully", "Underhill", "Voss", "Wren", "Yates", "Zaman", "Aldous", "Bright", "Crane", "Drake", "Flint", "Grove"];
var POSL = ["GK", "DEF", "DEF", "DEF", "MID", "MID", "MID", "FWD", "FWD", "FWD", "MID", "DEF"];
function sfp(c){ return c.tr.fp }
function addCoins(n, why){ n = Math.round(n); st.coins += n; st.log.unshift({ n: n, why: why }); if(st.log.length > 30) st.log.length = 30 }
function priceOf(r){ return Math.max(5, Math.round(Math.pow(Math.max(r - 48, 1), 2) * 0.45 / 5) * 5) }
function sellValue(p){ return Math.max(5, Math.round(priceOf(rate(p)) * 0.6 / 5) * 5) }
function coShort(c){ return String(c.name || "").split(/\s+/).filter(Boolean).map(function(x){ return x.charAt(0) }).join("").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3) || "CO" }
function coLogoOf(c, w){ return crestSvg(w, true, { c1: c.c1, c2: c.c2, shape: c.shape, crest: c.sym, cbg: c.cbg || "plain", short: coShort(c) }) }
function coLogo(w){ return coLogoOf(st.co, w) }
function dealOf(club){ return st.deals.filter(function(d){ return d.club === club })[0] }
function dealLogo(id){ if(!st.co) return ""; return dealOf(id === 0 ? -1 : id - 1) ? '<span class="dl" title="Sponsored by ' + esc(st.co.name) + '">' + coLogo(16) + '</span>' : "" }
function sponsorLine(oppId){
  if(!st.co) return "";
  var own = dealOf(-1), opp = dealOf(oppId - 1);
  if(!own && !opp) return "";
  return '<p class="sponsor">' + coLogo(18) + '<span>' + esc(st.co.name) + ' sponsors ' + (own && opp ? "both clubs" : (own ? esc(clubName()) : esc(S.CLUBS[oppId - 1].name))) + '</span></p>';
}
function coLevel(){ return st.co ? 1 + Math.floor((st.co.earned || 0) / 250) : 0 }
function coSlots(){ return Math.min(6, 1 + coLevel()) }
function clubStr(i){ var t = S.clubTeam(i); return (t.atk + t.mid + t.def) / 3 }
function dealFee(club){ return club === -1 ? 12 : Math.max(6, Math.round(6 + (clubStr(club) - 55) * 0.7)) }
function dealPrice(club){ return dealFee(club) * (club === -1 ? 5 : 8) }
function zoneNote(){
  if(st.tier === 0) return "The bottom three go down.";
  if(st.tier === 3) return "The top three go up.";
  return "The top three go up and the bottom three go down.";
}
function payout(entry, kind){
  var tot = 0, spon = 0, x = kind === "league" ? resultOf(entry) : (entry.won ? "W" : "L"), lv0 = coLevel();
  if(kind === "league"){
    tot += x === "W" ? 40 : (x === "D" ? 20 : 10); tot += ourGoals(entry) * 3;
    var oth = null, opp = S.ourFixture(entry.round).opp - 1;
    st.deals.forEach(function(d){
      var bonus = 0;
      if(d.club === -1){ if(x === "W") bonus = 8 }
      else {
        var res = null;
        if(opp === d.club) res = x === "W" ? "L" : (x === "L" ? "W" : "D");
        else {
          oth = oth || S.otherResults(st.seed, entry.round);
          oth.forEach(function(o){
            if(o.a - 1 === d.club) res = o.hs > o.as ? "W" : (o.hs < o.as ? "L" : "D");
            else if(o.b - 1 === d.club) res = o.as > o.hs ? "W" : (o.as < o.hs ? "L" : "D");
          });
        }
        bonus = res === "W" ? 6 : (res === "D" ? 2 : 0);
      }
      d.got = (d.got || 0) + d.fee + bonus; spon += d.fee + bonus;
    });
    tot += spon;
  } else tot += entry.won ? 30 * (entry.k + 1) : 10;
  if(spon && st.co) st.co.earned = (st.co.earned || 0) + spon;
  entry.spon = spon;
  addCoins(tot, kind === "league" ? "Matchday " + (entry.round + 1) : "Cup tie");
  if(st.co && coLevel() > lv0) post("Your company grew", "Business news", st.co.name + " is now level " + coLevel() + ". You have a new sponsorship slot.");
  return tot;
}

/* seasons */
function cupText(){
  var n = st.cup.ties.length;
  if(n >= 4 && st.cup.ties[3].won) return "Winners";
  if(st.cup.out) return "Out in the " + CUP_NAMES[n - 1].toLowerCase();
  return n ? "Through " + n + (n === 1 ? " tie" : " ties") : "Not played";
}
function seasonSummary(){
  var tb = S.table(st.seed, st.played), pos = posOf(tb), r = tb.filter(function(x){ return x.id === 0 })[0], t = st.tier;
  var up = t > 0 && pos <= 3, down = t < 3 && pos >= 14, nt = up ? t - 1 : (down ? t + 1 : t);
  var prize = Math.round((160 - (pos - 1) * 9) * (1 + (3 - t) * 0.25)), cupWon = st.cup.ties.length >= 4 && st.cup.ties[3].won;
  return { pos: pos, r: r, up: up, down: down, nt: nt, prize: prize + (cupWon ? 100 : 0), cup: cupText(), t: t };
}
function openSeason(){
  if(st.played.length < ROUNDS) return;
  var m = seasonSummary(), r = m.r;
  rvMode = "season";
  var out = m.up ? '<p><b>Promoted!</b> You are moving up to the ' + esc(S.leagueName(m.nt)) + '. The clubs are stronger there, and so are the prizes.</p>' :
    (m.down ? '<p>You are moving down to the ' + esc(S.leagueName(m.nt)) + '. A fresh chance to climb back, and your squad keeps everything it has learned.</p>' : '<p>You stay in the ' + esc(S.leagueName(m.t)) + ' next season.</p>');
  $("rvbox").innerHTML = '<div class="eyebrow" style="color:var(--gold)">Season ' + st.season + ' complete</div><h2>' + (m.pos === 1 ? "Champions of the " : "Finished " + ord(m.pos) + " in the ") + esc(S.leagueName(m.t)) + '</h2>' +
    '<div class="sumgrid" style="margin:12px 0"><div><b>' + r.w + '</b><small>Won</small></div><div><b>' + r.d + '</b><small>Drawn</small></div><div><b>' + r.l + '</b><small>Lost</small></div><div><b>' + r.gf + '</b><small>For</small></div><div><b>' + r.ga + '</b><small>Against</small></div><div><b>' + r.pts + '</b><small>Points</small></div></div>' +
    '<p>The Cup: ' + esc(m.cup) + '.</p>' + out + '<p>Season prize money: <b>' + m.prize + ' coins</b>. Sponsorship deals end with the season, and you can sign new ones in Business.</p>' +
    '<div class="mbtns" style="justify-content:center"><button class="btn btn-go btn-big" data-act="seasongo">Begin season ' + (st.season + 1) + '</button><button class="btn" data-act="seasonclose">Not yet</button></div>';
  $("rv").classList.add("on"); $("rv").classList.add("season");
}
function closeSeason(){ rvMode = ""; $("rv").classList.remove("on"); $("rv").classList.remove("season") }
function seasonGo(){
  if(st.played.length < ROUNDS){ closeSeason(); return }
  var m = seasonSummary(), r = m.r, c = ctx();
  addCoins(m.prize, "Season " + st.season + " prize");
  st.hist.push({ season: st.season, tier: m.t, league: S.leagueName(m.t), pos: m.pos, w: r.w, d: r.d, l: r.l, gf: r.gf, ga: r.ga, pts: r.pts, cup: m.cup, up: m.up, down: m.down, coins: m.prize });
  st.season++; st.tier = m.nt; S.setTier(st.tier);
  st.seed = 1 + Math.floor(Math.random() * 2000000000);
  st.played = []; st.used = []; st.cup = { ties: [], out: false }; st.cupSeen = 0; st.deals = []; st.mk = {};
  var b = beats(), sb = {}; S.ACTS.forEach(function(a){ sb[a.slug] = (b[a.slug] && b[a.slug].n) || 0 });
  st.sbase = sb; st.fp0 = c.tr.fp; st.cupSeen = CUP_AT.filter(function(t){ return c.tr.fp >= t }).length;
  post("Season " + st.season + " begins", "The Chairman (Jay)", "Welcome to the " + S.leagueName() + ". " + (m.up ? "You earned this promotion. " : (m.down ? "Every club has a rough season now and then. " : "")) + "Your squad keeps all its growth. Try some training and matches turn up again, and your sponsorship deals can be renewed in Business.");
  rvMode = ""; $("rv").classList.remove("on"); $("rv").classList.remove("season"); view = "dugout"; save(); render(); window.scrollTo(0, 0);
  toast("Season " + st.season + " in the " + S.leagueName() + ".");
}

/* roster changes */
function applySold(){
  for(var i = S.PLAYERS.length - 1; i >= 0; i--) if(st.sold[S.PLAYERS[i].id]) S.PLAYERS.splice(i, 1);
}
function marketWin(){ return st.season * 100 + Math.floor(st.played.length / 3) }
function marketList(){
  var w = marketWin();
  if(st.mk.w !== w) st.mk = { w: w, bought: [] };
  var r = S.rng(hash("mk" + w + ":" + st.seed)), out = [], used = {}, T = [[65, 80], [61, 76], [57, 72], [53, 68]][st.tier], i;
  for(i = 0; i < 12; i++){
    var nm, tries = 0, rt = T[0] + Math.floor(r() * (T[1] - T[0] + 1));
    do { nm = FIRSTN[Math.floor(r() * FIRSTN.length)] + " " + MSURN[Math.floor(r() * MSURN.length)]; tries++ } while((used[nm] || nameTaken(nm, "")) && tries < 25);
    used[nm] = 1;
    out.push({ id: "mk" + w + "_" + i, name: nm, pos: POSL[i], r: rt, note: TRAITS[Math.floor(r() * TRAITS.length)] });
  }
  return out.filter(function(x){ return st.mk.bought.indexOf(x.id) < 0 });
}
function buyPlayer(id){
  var l = marketList().filter(function(x){ return x.id === id })[0]; if(!l) return;
  var price = priceOf(l.r), c = ctx();
  if(st.coins < price){ toast("Not enough coins yet. Matches and sponsors earn more."); return }
  if(c.avail.length >= 30){ toast("The squad is full (30). Sell someone first."); return }
  var nid = "sg" + (st.sgn++), nm = l.name; if(nameTaken(nm, "")) nm += " II";
  st.signed.push({ id: nid, name: nm, pos: l.pos, r: l.r, note: l.note, look: lookOf(l.id) });
  st.mk.bought.push(id); addCoins(-price, "Signed " + nm); st.trades = (st.trades || 0) + 1;
  applyMine(); save(); render(); toast(nm + " has joined " + clubName() + ".");
}
function sellPlayer(id){
  var p = playerOf(id), c = ctx(); sellAsk = "";
  if(!p || isMine(id)) return;
  if(c.avail.length <= 15){ toast("Keep at least fifteen players in the squad."); render(); return }
  if(p.pos === "GK" && c.avail.filter(function(q){ return q.pos === "GK" }).length <= 2){ toast("Keep at least two goalkeepers."); render(); return }
  var val = sellValue(p), nm = p.name;
  if(isSg(id)) st.signed = st.signed.filter(function(x){ return x.id !== id }); else st.sold[id] = 1;
  ["cap", "pk", "fk"].forEach(function(k){ if(st[k] === id) st[k] = "" });
  st.xi = st.xi.map(function(x){ return x === id ? "" : x });
  applyMine(); applySold(); addCoins(val, "Sold " + nm); st.trades = (st.trades || 0) + 1;
  save(); render(); toast(nm + " sold for " + val + " coins.");
}

/* views */
function vMarket(c){
  var list = marketList(), h = '<div class="stack"><div class="card"><h3>Transfer market</h3><p class="hint" style="margin:0">You have <b style="color:var(--gold)">' + st.coins + ' coins</b>. Your squad has ' + c.avail.length + ' players (most is 30). New players are listed every three league matches, and there is no rush.</p></div>';
  h += '<div class="card"><h3>Players for sale</h3><div class="mkgrid">' + (list.length ? list.map(function(l){
    var worst = 99, F = S.FORMATIONS[st.formation];
    st.xi.forEach(function(id, i){ var q = id ? playerOf(id) : null; if(q && F.slots[i] === l.pos) worst = Math.min(worst, rate(q)) });
    var price = priceOf(l.r), cls = worst === 99 ? "" : (l.r > worst ? "better" : "");
    return '<div class="mk">' + avatar(l.id, 54, l.pos) + '<div><b>' + esc(l.name) + '</b><small>' + l.pos + ' &middot; rated ' + l.r + '</small><small>' + esc(l.note) + '</small>' + (cls ? '<small class="up">Better than someone in your side</small>' : "") + '</div><button class="btn ' + (st.coins >= price ? "btn-go" : "") + '" data-act="buy" data-id="' + l.id + '"' + (st.coins >= price ? "" : " aria-disabled=\"true\"") + '>' + price + ' coins</button></div>';
  }).join("") : '<p class="hint">Everyone on this list has been signed. A new list comes after the next three matches.</p>') + '</div></div>';
  var mine = c.avail.filter(function(p){ return !isMine(p.id) }).sort(function(a, b){ return rate(b) - rate(a) });
  h += fold("sell", "Sell a player", '<p class="hint">Players you made yourself are never for sale. Others sell for a bit less than they cost.</p><div class="plist">' + mine.map(function(p){
    var val = sellValue(p);
    return '<div class="prow sell">' + avatar(p.id, 40, p.pos) + '<span><b>' + esc(p.name) + '</b><small>' + p.pos + ' &middot; rated ' + rate(p) + '</small></span>' + (sellAsk === p.id ? '<span class="sa"><button class="btn btn-go" data-act="sellyes" data-id="' + p.id + '">Sell for ' + val + '</button><button class="btn btn-quiet" data-act="sellask" data-id="">Keep</button></span>' : '<button class="btn btn-quiet" data-act="sellask" data-id="' + p.id + '">Sell ' + val + '</button>') + '</div>';
  }).join("") + '</div>');
  return h + '</div>';
}
function coForm(){
  var d = coDraft || (coDraft = st.co ? Object.assign({}, st.co) : { name: "", slogan: "", ind: "Sports kit", c1: SWATCH[1][0], c2: SWATCH[1][1], shape: "round", sym: "star", cbg: "plain" });
  var prev = function(){ return '<div class="stcard">' + coLogoOf(d, 84) + '<div><h2>' + esc(d.name || "Your company") + '</h2><span class="hint">' + esc(d.ind) + (d.slogan ? " &middot; " : "") + (d.slogan ? '<em>' + esc(d.slogan) + '</em>' : "") + '</span></div></div>' };
  return '<div class="stack"><div class="card"><h3>' + (coEditing ? "Change your company" : "Start your own company") + '</h3><p class="hint">Make up a company and put its name on teams as a sponsor. Sponsors earn coins when their clubs play well. Everything here is made up, so go for it.</p>' +
    '<div class="pv" id="coprev">' + prev() + '</div>' +
    '<label class="sendlab" for="conname">Company name</label><br><input class="wzin" id="conname" maxlength="24" value="' + esc(d.name) + '" placeholder="e.g. Rocket Bikes">' +
    '<label class="sendlab" for="conslogan" style="display:block;margin-top:12px">Slogan</label><input class="wzin" id="conslogan" maxlength="40" value="' + esc(d.slogan) + '" placeholder="e.g. Ride your luck">' +
    '<h3 style="margin-top:14px">What it makes</h3><div class="opts">' + INDS.map(function(x){ return optBtn("coset", "ind", x, x, d.ind === x) }).join("") + '</div>' +
    '<h3>Colours</h3><div class="swatches">' + SWATCH.map(function(sw, i){ return '<button class="swatch" data-act="cocol" data-i="' + i + '" aria-pressed="' + (d.c1 === sw[0] && d.c2 === sw[1]) + '" aria-label="Colour set ' + (i + 1) + '" style="background:' + sw[0] + '"><i style="background:' + sw[1] + '"></i></button>' }).join("") + '</div>' +
    '<h3>Logo shape</h3><div class="crests">' + SHAPELIST.map(function(s){ return '<button data-act="coset" data-k="shape" data-v="' + s[0] + '" aria-pressed="' + (d.shape === s[0]) + '" aria-label="' + s[1] + '">' + coLogoOf(Object.assign({}, d, { shape: s[0] }), 40) + '</button>' }).join("") + '</div>' +
    '<h3>Logo symbol</h3><div class="crests">' + SYMS.map(function(s){ return '<button data-act="coset" data-k="sym" data-v="' + s[0] + '" aria-pressed="' + (d.sym === s[0]) + '" aria-label="' + s[1] + '">' + coLogoOf(Object.assign({}, d, { sym: s[0] }), 40) + '</button>' }).join("") + '</div>' +
    '<div class="mbtns"><button class="btn btn-go btn-big" data-act="cosave">' + (coEditing ? "Save changes" : "Start the company") + '</button>' + (coEditing ? '<button class="btn" data-act="cocancel">Cancel</button>' : "") + '</div></div></div>';
}
function vBusiness(c){
  if(!st.co || coDraft) return coForm();
  var co = st.co, lv = coLevel(), nxt = lv * 250, got = co.earned || 0, tb = S.table(st.seed, st.played), used = st.deals.length, slots = coSlots();
  var h = '<div class="stack"><div class="card"><div class="stcard">' + coLogo(84) + '<div style="flex:1"><h2>' + esc(co.name) + '</h2><span class="hint">' + esc(co.ind) + (co.slogan ? " &middot; " : "") + (co.slogan ? '<em>' + esc(co.slogan) + '</em>' : "") + '</span><p style="margin:6px 0 0">Level <b>' + lv + '</b> &middot; ' + got + ' coins earned from sponsorship</p><div class="prog" aria-hidden="true"><i style="width:' + Math.round(100 * Math.min(1, (got - (lv - 1) * 250) / 250)) + '%"></i></div><span class="hint">' + Math.max(0, nxt - got) + ' more coins for level ' + (lv + 1) + ' and another sponsorship slot.</span></div><button class="btn" data-act="coedit">Change company</button></div></div>';
  h += '<div class="card"><h3>Sponsorship deals &middot; ' + used + ' of ' + slots + ' slots</h3><p class="hint">Sign a deal for a club for the season. You earn a fee every league match, plus a bonus when they win. Deals end when the season does. You have <b style="color:var(--gold)">' + st.coins + ' coins</b>.</p><div class="dealist">';
  var rows = [{ id: 0, name: clubName() }].concat(tb.filter(function(r){ return r.id !== 0 }));
  rows.forEach(function(r){
    var club = r.id === 0 ? -1 : r.id - 1, d = dealOf(club), fee = dealFee(club), price = dealPrice(club), pos = tb.map(function(x){ return x.id }).indexOf(r.id) + 1;
    var cr = r.id === 0 ? crestSvg(30, true) : opCrest(r.id, 30, true), act;
    if(d) act = '<span class="chip-on">Active &middot; earned ' + (d.got || 0) + '</span>';
    else if(used >= slots) act = '<button class="btn" disabled>No slot free</button>';
    else if(st.coins < price) act = '<button class="btn" disabled>Need ' + price + ' coins</button>';
    else act = '<button class="btn btn-go" data-act="deal" data-c="' + club + '">Sponsor for ' + price + '</button>';
    h += '<div class="deal">' + cr + '<span><b>' + esc(r.name) + (club === -1 ? " (your club)" : "") + '</b><small>' + (st.played.length || club !== -1 ? ord(pos) + " in the table &middot; " : "") + fee + ' coins a match</small></span>' + act + '</div>';
  });
  h += '</div></div>';
  h += fold("log", "Money in and out", st.log.length ? '<ul class="moments">' + st.log.slice(0, 12).map(function(l){ return '<li><b style="color:' + (l.n >= 0 ? "var(--win)" : "var(--loss)") + '">' + (l.n >= 0 ? "+" : "") + l.n + '</b> ' + esc(l.why) + '</li>' }).join("") + '</ul>' : '<p class="hint">Nothing yet. Matches, cup ties and sponsors all earn coins.</p>');
  return h + '</div>';
}
function histCard(){
  if(!st.hist.length) return "";
  return '<div class="card"><h3>Seasons</h3>' + st.hist.slice().reverse().map(function(s){
    return '<div class="resline"><span><b>Season ' + s.season + '</b> &middot; ' + esc(s.league) + '</span><span>' + ord(s.pos) + ' &middot; W' + s.w + ' D' + s.d + ' L' + s.l + ' &middot; Cup: ' + esc(s.cup) + (s.pos === 1 ? ' &middot; <b style="color:var(--gold)">Champions</b>' : "") + (s.up ? ' &middot; <b style="color:var(--win)">Promoted</b>' : "") + (s.down ? " &middot; Moved down" : "") + '</span></div>';
  }).join("") + '</div>';
}

/* ---------- title menu ---------- */
var tiOn = false;
function titleOpen(){
  var el = $("ti");
  if(!el){ el = document.createElement("div"); el.id = "ti"; el.className = "ov"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Menu"); document.body.appendChild(el) }
  var c = ctx(), pend = pendingList().length && st.played.length < ROUNDS;
  el.innerHTML = '<div class="rvbox timenu">' + crestSvg(96, true) + '<div class="eyebrow" style="color:var(--gold)">JT\'s Dugout</div><h2>' + esc(clubName()) + '</h2><p class="hint">' + esc(S.leagueName()) + ' &middot; season ' + st.season + ' &middot; ' + st.coins + ' coins</p>' +
    '<div class="timbtns"><button class="btn btn-go btn-big" data-act="tiplay">' + (st.played.length || st.hist.length ? (pend ? "Continue: match ready" : "Continue") : "Play") + '</button>' +
    '<button class="btn" data-act="tigo" data-v="squad">Squad and tactics</button><button class="btn" data-act="tigo" data-v="train">Training ground</button><button class="btn" data-act="tigo" data-v="league">League and cup</button><button class="btn" data-act="tigo" data-v="market">Transfer market</button><button class="btn" data-act="tigo" data-v="business">Business</button><button class="btn" data-act="tigo" data-v="studio">Studio</button><button class="btn" data-act="tigo" data-v="club">Club and badges</button><button class="btn" data-act="tihelp">How it works</button><button class="btn" data-act="tigo" data-v="settings">Settings</button></div></div>';
  el.classList.add("on"); tiOn = true;
  var b = el.querySelector("button"); if(b) b.focus();
}
function titleClose(){ var el = $("ti"); if(el) el.classList.remove("on"); tiOn = false; try{ sessionStorage.setItem("b5.jt.menu", "1") }catch(e){} }

/* ---------- the Studio ---------- */
var STABS = [["club", "Club"], ["kit", "Kit"], ["crest", "Badge"], ["players", "Players"], ["ground", "Ground"]];
function optBtn(act, k, v, label, pressed, extra){
  return '<button data-act="' + act + '" data-k="' + k + '" data-v="' + v + '" aria-pressed="' + pressed + '"' + (extra || "") + '>' + label + '</button>';
}
function studioPreview(){
  var t = studioTab;
  if(t === "club") return '<div class="stcard">' + crestSvg(84, true) + '<div style="width:84px">' + shirt(kitOf(false), 10) + '</div><div><h2>' + esc(clubName()) + '</h2><span class="hint">' + (st.club.nick ? esc(st.club.nick) + " &middot; " : "") + esc(shortName()) + ' &middot; ' + esc(stadiumName()) + '</span>' + (st.club.motto ? '<p style="margin:6px 0 0"><em>&ldquo;' + esc(st.club.motto) + '&rdquo;</em></p>' : "") + '</div></div>';
  if(t === "kit") return '<div class="stcard"><div style="width:120px">' + shirt(kitOf(false), 10) + '<span class="hint">Home</span></div><div style="width:120px">' + shirt(kitOf(true), 1) + '<span class="hint">Goalkeeper</span></div><div class="mini-live"><i class="tk" style="position:static;transform:none;' + tokStyle(kitOf(false)) + '">7</i><i class="tk" style="position:static;transform:none;' + tokStyle(kitOf(true)) + '">1</i><span class="hint">On the match pitch</span></div></div>';
  if(t === "crest") return '<div class="stcard">' + crestSvg(120, true) + '<div>' + crestSvg(44, true) + '<span class="hint" style="display:block">Small size</span></div></div>';
  if(t === "ground") return '<div class="gprev">' + stadium() + '<b class="gname">' + esc(stadiumName()) + '</b></div>';
  return "";
}
function colorIn(id, label, val){ return '<label class="colw"><span>' + label + '</span><input type="color" id="' + id + '" value="' + val + '"></label>' }
function studioBody(){
  var t = studioTab, h = '';
  if(t === "club"){
    h += '<div class="fields">' +
      '<label class="sendlab" for="stname">Club name</label><input class="wzin" id="stname" maxlength="24" value="' + esc(st.club.name) + '" placeholder="Base 5 United">' +
      '<label class="sendlab" for="stshort">Short name (up to 4 letters, shown on the scoreboard)</label><input class="wzin" id="stshort" maxlength="4" value="' + esc(st.club.short) + '" placeholder="' + esc(shortName()) + '">' +
      '<label class="sendlab" for="stnick">Nickname</label><input class="wzin" id="stnick" maxlength="24" value="' + esc(st.club.nick) + '" placeholder="e.g. The Owls">' +
      '<label class="sendlab" for="stmotto">Motto</label><input class="wzin" id="stmotto" maxlength="48" value="' + esc(st.club.motto) + '" placeholder="e.g. Never give up"></div>';
  } else if(t === "kit"){
    h += '<h3>Quick colour sets</h3><div class="swatches">' + SWATCH.map(function(sw, i){
      return '<button class="swatch" data-act="wzcol" data-i="' + i + '" aria-pressed="' + (st.club.c1 === sw[0] && st.club.c2 === sw[1]) + '" aria-label="Colour set ' + (i + 1) + '" style="background:' + sw[0] + '"><i style="background:' + sw[1] + '"></i></button>';
    }).join("") + '</div><h3>Your own colours</h3><div class="colrow">' + colorIn("stc1", "Main colour", st.club.c1) + colorIn("stc2", "Second colour", st.club.c2) + colorIn("stgk", "Goalkeeper kit", st.club.gk) + '</div>' +
      '<h3>Pattern</h3><div class="pats">' + PATS.map(function(pt){ return '<button data-act="club" data-k="pat" data-v="' + pt[0] + '" aria-pressed="' + (st.club.pat === pt[0]) + '"><span class="pv2">' + shirt({ c1: st.club.c1, c2: st.club.c2, pat: pt[0] }, "") + '</span>' + pt[1] + '</button>' }).join("") + '</div>';
  } else if(t === "crest"){
    h += '<h3>Shape</h3><div class="crests">' + SHAPELIST.map(function(s){ return '<button data-act="club" data-k="shape" data-v="' + s[0] + '" aria-pressed="' + (st.club.shape === s[0]) + '" aria-label="' + s[1] + '">' + crestSvg(40, true, { shape: s[0] }) + '</button>' }).join("") + '</div>' +
      '<h3>Symbol</h3><div class="crests">' + SYMS.map(function(s){ return '<button data-act="club" data-k="crest" data-v="' + s[0] + '" aria-pressed="' + (st.club.crest === s[0]) + '" aria-label="' + s[1] + '">' + crestSvg(40, true, { crest: s[0] }) + '</button>' }).join("") + '</div>' +
      '<h3>Background</h3><div class="crests">' + CBGS.map(function(s){ return '<button data-act="club" data-k="cbg" data-v="' + s[0] + '" aria-pressed="' + (st.club.cbg === s[0]) + '" aria-label="' + s[1] + '">' + crestSvg(40, true, { cbg: s[0] }) + '</button>' }).join("") + '</div>' +
      '<p class="hint">Badge colours come from your kit. Change them in the Kit tab.</p>';
  } else if(t === "players"){
    var c = ctx();
    h += '<p class="hint" style="margin:0 0 10px">Tap a player to change their name, number, face and more. Names you change show up everywhere, including old match reports.</p><div class="plist">' +
      c.avail.map(function(p){ return '<button class="prow" data-act="edit" data-id="' + p.id + '">' + avatar(p.id, 44, p.pos) + '<span><b>' + esc(p.name) + '</b><small>#' + numOf(p.id) + ' &middot; ' + p.pos + ' &middot; rated ' + rate(p) + (st.cap === p.id ? " &middot; captain" : "") + '</small></span></button>' }).join("") + '</div>' +
      '<h3 style="margin-top:16px">Players you made</h3>' + (st.mine.length ? '<div class="plist">' + st.mine.map(function(m){ var p = playerOf(m.id); return p ? '<button class="prow" data-act="edit" data-id="' + p.id + '">' + avatar(p.id, 44, p.pos) + '<span><b>' + esc(p.name) + '</b><small>#' + numOf(p.id) + ' &middot; ' + p.pos + ' &middot; rated ' + rate(p) + '</small></span></button>' : "" }).join("") + '</div>' : '<p class="hint">None yet.</p>') +
      (st.mine.length < 3 ? '<div class="mbtns"><button class="btn btn-go" data-act="newmine">Make a new player</button></div>' : '<p class="hint">You have made the most you can (three).</p>');
  } else {
    h += '<div class="fields"><label class="sendlab" for="ststad">Stadium name</label><input class="wzin" id="ststad" maxlength="28" value="' + esc(st.club.stadium) + '" placeholder="Base 5 Park"></div>' +
      '<h3 style="margin-top:14px">Grass</h3><div class="opts">' + [["classic", "Classic green"], ["bright", "Bright"], ["night", "Deep night green"]].map(function(g){ return optBtn("club", "grass", g[0], g[1], st.club.grass === g[0]) }).join("") + '</div>' +
      '<h3>Mowing pattern</h3><div class="opts">' + [["stripes", "Stripes"], ["checks", "Checks"], ["plain", "Plain"]].map(function(g){ return optBtn("club", "gpat", g[0], g[1], st.club.gpat === g[0]) }).join("") + '</div>';
  }
  return h;
}
function vStudio(c){
  return '<div class="stack"><div class="card"><p class="hint" style="margin:0 0 12px">Make the club properly yours. Every change shows straight away and saves by itself, and you can change anything back. None of it changes how the football goes.</p>' +
    '<div class="tabs" role="tablist">' + STABS.map(function(t){ return '<button role="tab" data-act="stab" data-v="' + t[0] + '" aria-selected="' + (studioTab === t[0]) + '">' + t[1] + '</button>' }).join("") + '</div></div>' +
    '<div class="card"><div class="pv" id="stprev">' + studioPreview() + '</div><div id="stbody">' + studioBody() + '</div></div></div>';
}
function studioRefresh(full){
  var pv = $("stprev"); if(pv) pv.innerHTML = studioPreview();
  if(full){ var b = $("stbody"); if(b) b.innerHTML = studioBody() }
  applyKit(); renderClub();
}

/* ---------- the player editor ---------- */
function edOpen(id){
  editing = id; $("ed").classList.add("on"); edDraw();
  var f = $("edbox").querySelector("input"); if(f) try{ f.focus() }catch(e){}
}
function edClose(){
  var id = editing, m = null;
  st.mine.forEach(function(x){ if(x.id === id) m = x });
  if(m && !String(m.name || "").trim()){ st.mine = st.mine.filter(function(x){ return x.id !== id }); applyMine() }
  editing = null; $("ed").classList.remove("on"); save(); render();
}
function edDraw(){
  var p = playerOf(editing); if(!p){ editing = null; $("ed").classList.remove("on"); return }
  var A = attrsOf(p), mine = isMine(p.id), lk = lookOf(p.id), id = p.id;
  var h = '<div class="mhead"><h2>Player editor</h2><button class="btn btn-go" data-act="edclose">Done</button></div>';
  h += '<div class="edtop"><div id="edcard">' + pcard(p, { tag: "div", mini: 1 }) + '</div><div class="edrad">' + radarSvg(p, 150) + '<div class="skl">' + ["atk", "mid", "def", "gk"].map(function(k){
    return '<div class="skr"><span>' + SKILLNAME[k] + '</span><div class="track"><i style="width:' + A[k].v + '%;background:' + STATCOL[k] + '"></i></div><b>' + A[k].v + '</b>' + (A[k].tr ? '<em>+' + A[k].tr + '</em>' : '') + '</div>';
  }).join("") + '<p class="hint" style="margin:6px 0 0">Every training session this player does adds five points to the skill it trains.</p></div></div></div>';
  h += '<div class="edgrid"><div><label class="sendlab" for="edname">Name</label><input class="wzin" id="edname" maxlength="22" value="' + esc(p.name) + '"></div><div><label class="sendlab" for="ednum">Shirt number</label><input class="wzin" id="ednum" type="number" min="1" max="99" value="' + numOf(id) + '" style="max-width:110px"></div></div>';
  if(!mine && !isSg(id) && st.pn[id]) h += '<div class="mbtns" style="margin:4px 0 0"><button class="btn btn-quiet" data-act="edname0">Back to the original name (' + esc(ORIG[id]) + ')</button></div>';
  if(mine){
    var m = st.mine.filter(function(x){ return x.id === id })[0] || {};
    h += '<h3 style="margin-top:14px">Position</h3><div class="opts">' + ["GK", "DEF", "MID", "FWD"].map(function(k){ return optBtn("edmine", "pos", k, POSN[k], m.pos === k) }).join("") + '</div>' +
      '<h3>Style</h3><div class="opts">' + TRAITS.map(function(k, i){ return optBtn("edmine", "note", i, k, m.note === k) }).join("") + '</div>';
  }
  h += '<h3 style="margin-top:14px">Skin</h3><div class="swatches">' + SKIN.map(function(c, i){ return '<button class="swatch sm" data-act="look" data-k="s" data-v="' + i + '" aria-pressed="' + (lk.s === i) + '" aria-label="Skin ' + (i + 1) + '" style="background:' + c + '"></button>' }).join("") + '</div>' +
    '<h3>Hair style</h3><div class="opts">' + HAIRN.map(function(n, i){ return optBtn("look", "h", i, n, lk.h === i) }).join("") + '</div>' +
    '<h3>Hair colour</h3><div class="swatches">' + HAIR.map(function(c, i){ return '<button class="swatch sm" data-act="look" data-k="c" data-v="' + i + '" aria-pressed="' + (lk.c === i) + '" aria-label="Hair colour ' + (i + 1) + '" style="background:' + c + '"></button>' }).join("") + '</div>' +
    '<h3>Extras</h3><div class="opts">' + ACCN.map(function(n, i){ return optBtn("look", "a", i, n, lk.a === i) }).join("") + '</div>' +
    '<h3>Jobs in the team</h3><div class="opts"><button data-act="role" data-k="cap" aria-pressed="' + (st.cap === id) + '">Captain</button>' + (p.pos !== "GK" ? '<button data-act="role" data-k="pk" aria-pressed="' + (st.pk === id) + '">Penalty taker</button><button data-act="role" data-k="fk" aria-pressed="' + (st.fk === id) + '">Free kick taker</button>' : "") + '</div>';
  var tr = S.ACTS.filter(function(a){ return st.tby[a.slug] === id && (st.trained[a.slug] || 0) > 0 });
  h += '<h3>Training history</h3>' + (tr.length ? '<ul class="moments">' + tr.map(function(a){ return '<li><b>' + esc(a.title) + '</b> <span class="mute">level ' + st.trained[a.slug] + ' &middot; ' + SKILLNAME[a.stat] + '</span></li>' }).join("") + '</ul>' : '<p class="hint">No sessions yet. Choose this player under a session in Training.</p>');
  h += '<div class="mbtns">' + (st.look[id] ? '<button class="btn btn-quiet" data-act="lookreset">Back to the original look</button>' : "") + (mine ? '<button class="btn btn-quiet" data-act="rmmine">Remove this player</button>' : "") + '</div>';
  $("edbox").innerHTML = h;
}
function renamePlayer(id, raw){
  var p = playerOf(id), nm = String(raw || "").trim().replace(/\s+/g, " ").slice(0, 22), mine = isMine(id), sg = isSg(id);
  if(!p) return;
  if(!nm){ if(mine || sg) return; nm = ORIG[id] }
  if(/^no\.\s/i.test(nm) || nameTaken(nm, id)){ toast("That name is already taken. Pick another."); return }
  var old = p.name;
  if(mine){ st.mine.forEach(function(m){ if(m.id === id) m.name = nm }) }
  else if(sg){ st.signed.forEach(function(m){ if(m.id === id) m.name = nm }) }
  else if(nm === ORIG[id]) delete st.pn[id]; else st.pn[id] = nm;
  applyMine(); applyNames();
  if(old !== nm && !(mine && !old)) renameHistory(old, nm);
  save();
}
function setNumber(id, n){
  n = clamp(parseInt(n, 10) || numOf(id), 1, 99);
  var old = numOf(id), other = null;
  S.PLAYERS.forEach(function(q){ if(q.id !== id && numOf(q.id) === n) other = q.id });
  if(other) st.num[other] = old;
  st.num[id] = n; save();
}
function newMine(){
  var ids = ["me", "me2", "me3"], free = ids.filter(function(i){ return !st.mine.some(function(m){ return m.id === i }) })[0];
  if(!free) return;
  st.mine.push({ id: free, name: "", pos: "MID", note: TRAITS[0] });
  save();
  S.PLAYERS.push({ id: free, name: "", pos: "MID", r: MINER[free], note: TRAITS[0] + " (your player)" });
  edOpen(free);
}
function afterRender(){
  var open = $("ov").classList.contains("on") || $("ed").classList.contains("on") || wiz.on || tiOn || $("rv").classList.contains("on");
  if(open) return;
  if(st.reveal.length){ showReveal(); return }
  if(newB.length && view !== "club"){
    toast(newB.length === 1 ? "New badge: " + newB[0].name + ". See it in Club." : newB.length + " new badges. See them in Club.");
    sfx("badge"); newB.forEach(function(b){ b.shown = 1 }); newB = []; renderNav();
  } else if(newB.length && view === "club"){ setTimeout(function(){ newB = []; renderNav() }, 3000) }
}
function showReveal(){
  var id = st.reveal[0], p = S.playerById(id);
  if(!p){ st.reveal.shift(); save(); return }
  $("rvbox").innerHTML = '<div class="eyebrow" style="color:var(--gold)">New signing</div><h2>' + esc(p.name) + '</h2><p class="hint">' + p.pos + ' &middot; rated ' + p.r + ' &middot; ' + esc(p.note) + '</p>' +
    '<div class="flip" id="flip"><div class="in"><div class="fr">' + pcard(p, { tag: "div" }) + '</div><div class="bk">' + crestSvg(70, true) + '</div></div></div>' +
    '<p>Welcome to ' + esc(clubName()) + '. You can pick them in Squad whenever you fancy.</p>' +
    '<div class="mbtns" style="justify-content:center"><button class="btn btn-go btn-big" data-act="rvclose">Welcome to the club</button><button class="btn" data-act="rvsquad">See the squad</button></div>';
  $("rv").classList.add("on"); sfx("badge");
  setTimeout(function(){ var f = $("flip"); if(f) f.classList.add("on") }, 80);
  var b = $("rvbox").querySelector("button"); if(b) b.focus();
}
function fold(id, title, html){
  return '<details class="fold" data-f="' + id + '"' + (folds[id] ? " open" : "") + '><summary>' + title + '</summary><div class="in">' + html + '</div></details>';
}
function compareBars(a, b){
  var keys = [["atk","Attack"],["mid","Midfield"],["def","Defence"],["gk","Goalkeeper"]];
  return keys.map(function(k){
    var x = a[k[0]], y = b[k[0]], t = x + y;
    return '<div class="cmp"><span class="a">' + r1(x) + '</span><div><div class="bar"><i style="width:' + (100 * x / t) + '%;background:var(--accent)"></i><i style="width:' + (100 * y / t) + '%;background:#64759a"></i></div><div class="lab">' + k[1] + '</div></div><span>' + r1(y) + '</span></div>';
  }).join("");
}
function msgHtml(m){ return '<div class="msg' + (m.read ? "" : " unread") + '"><h4>' + esc(m.title) + '</h4><small>' + esc(m.from) + '</small><p style="margin:6px 0 0">' + esc(m.body) + '</p></div>' }
function formDots(arr){ return arr.slice(-5).map(function(x){ return '<i class="f ' + x + '" title="' + ({W:"Won",D:"Drew",L:"Lost"})[x] + '">' + x + '</i>' }).join("") }
function nextUnlock(c){
  var ups = S.PLAYERS.filter(function(p){ return p.fp }).sort(function(a, b){ return a.fp - b.fp }), prev = 0, i;
  for(i = 0; i < ups.length; i++){
    if(c.tr.fp < ups[i].fp) return { p: ups[i], prev: prev, pct: clamp((c.tr.fp - prev) / (ups[i].fp - prev), 0, 1) };
    prev = ups[i].fp;
  }
  return null;
}
function managerCard(c){
  var nu = nextUnlock(c), tried = triedCount(c);
  return '<section class="card"><h3>Manager</h3><h2>' + esc(rankOf(c.tr.fp)) + '</h2><p class="hint" style="margin:4px 0 0">' + c.tr.fp + ' focus points &middot; ' + tried + ' of ' + S.ACTS.length + ' sessions tried</p>' +
    (nu ? '<div class="prog" aria-hidden="true"><i style="width:' + Math.round(nu.pct * 100) + '%"></i></div><p class="hint" style="margin:0">Next signing: <b style="color:var(--ink)">' + esc(nu.p.name) + '</b> (' + nu.p.pos + ', ' + nu.p.r + ') at ' + nu.p.fp + ' focus points.</p>' :
      '<div class="prog" aria-hidden="true"><i style="width:100%"></i></div><p class="hint" style="margin:0">Every signing made. Legend.</p>') + '</section>';
}
function trySessions(c, n){
  var list = S.ACTS.filter(function(a){ return !(c.tr.levels[a.slug] || 0) });
  if(!list.length) list = S.ACTS.filter(function(a){ return (c.tr.levels[a.slug] || 0) < S.CAP });
  list.sort(function(a, b){ return (c.tr.boost[a.stat] - c.tr.boost[b.stat]) || (hash(a.slug) - hash(b.slug)) });
  return list.slice(0, n);
}

/* ---------- views ---------- */
function heroHtml(c, t, tb){
  var done = st.played.length;
  if(done >= ROUNDS){
    var pos = posOf(tb);
    return '<section class="hero">' + stadium() + '<div class="fg"><div class="chips2"><span class="ch">' + esc(S.leagueName()) + '</span><span class="ch">Season ' + st.season + ' complete</span></div><div class="vs3" style="grid-template-columns:1fr"><div class="tm">' + crestSvg(104) + '<h2>' + (pos === 1 ? "Champions of the " : "Finished " + ord(pos) + " in the ") + esc(S.leagueName()) + '</h2><span class="sub">' + esc(clubName()) + '</span></div></div>' +
      '<div class="cta"><button class="btn btn-go btn-big" data-act="endseason">Finish the season</button><button class="btn" data-act="view" data-v="league">See the final table</button><button class="btn" data-act="view" data-v="club">Trophies and badges</button></div></div></section>';
  }
  var fx = S.ourFixture(done), opp = S.clubTeam(fx.opp - 1), pend = pendingList(), row = tb.filter(function(r){ return r.id === fx.opp })[0], oi = tb.indexOf(row);
  function duel(label, d){
    var cls = d >= 3 ? "ok" : (d <= -3 ? "hard" : "mid"), w = d >= 3 ? "Our edge" : (d <= -3 ? "Tough" : "Even");
    return '<span class="duel ' + cls + '"><b>' + w + '</b>' + label + '</span>';
  }
  var h = '<section class="hero' + (pend.length ? " ready" : "") + '">' + stadium() + '<div class="fg"><div class="chips2"><span class="ch">' + esc(S.leagueName()) + '</span><span class="ch">Season ' + st.season + '</span><span class="ch">Matchday ' + (done + 1) + ' of ' + ROUNDS + '</span><span class="ch">' + (fx.home ? "At home" : "Away") + '</span>' + (pend.length ? '<span class="ribbon">Match ready</span>' : "") + '</div>' +
    '<div class="vs3"><div class="tm">' + crestSvg(104) + '<h2>' + esc(clubName()) + '</h2><span class="sub">' + (done ? ord(posOf(tb)) + " in the league" : "Ready for the season") + '</span></div><div class="vsm">VS</div>' +
    '<div class="tm">' + opCrest(fx.opp) + '<h2>' + esc(opp.name) + '</h2><span class="sub">' + (done ? ord(oi + 1) + " &middot; " + row.pts + " pts" : "Rated " + r1((opp.atk + opp.mid + opp.def) / 3)) + '</span></div></div>' +
    '<div class="duels">' + duel("Our attack v their defence", t.atk - opp.def) + duel("Midfield battle", t.mid - opp.mid) + duel("Their attack v our defence", t.def - opp.atk) + '</div><div class="cta">';
  if(pend.length) h += '<button class="btn btn-go btn-big" data-act="kick">Kick off</button><p>Your <b>' + esc(pend[0].act.title) + '</b> session earned this match.</p>';
  else h += '<button class="btn btn-go btn-big" data-act="view" data-v="train">Earn a match</button><p>Try any training session, in any order, and a match turns up.</p>';
  return h + '</div></div></section>';
}
function vDugout(c){
  var done = st.played.length, t = teamNow(c), tb = S.table(st.seed, st.played), h = '<div class="stack">';
  h += heroHtml(c, t, tb);
  var pos = posOf(tb), last5 = tb.filter(function(r){ return r.id === 0 })[0].form;
  var cupHtml;
  if(st.cup.ties.length >= 4 && st.cup.ties[3].won) cupHtml = '<div class="big">Winners</div><small>Brilliant run.</small>';
  else if(st.cup.out) cupHtml = '<div class="big">Out</div><small>Knocked out in the ' + CUP_NAMES[st.cup.ties.length - 1].toLowerCase() + '. The league carries on.</small>';
  else if(cupReady(c)){ var cn = st.cup.ties.length; cupHtml = '<div class="big" style="font-size:1.3rem">' + CUP_NAMES[cn] + '</div><small>v ' + esc(S.CLUBS[S.cupOpponent(st.seed, cn)].name) + '</small><button class="btn btn-go" data-act="kickcup">Play the tie</button>'; }
  else { var nx = CUP_AT[st.cup.ties.length]; cupHtml = '<div class="big" style="font-size:1.3rem">' + CUP_NAMES[st.cup.ties.length] + '</div><small>Arrives at ' + nx + ' focus points. You have ' + sfp(c) + '.</small>'; }
  h += '<div class="tiles"><div class="tile"><h3>League</h3><div class="big">' + (done ? ord(pos) : "-") + '</div><small>' + (done ? tb[pos - 1].pts + " points" : "Everyone starts level") + '</small></div>' +
    '<div class="tile"><h3>Form</h3><div style="margin:8px 0">' + (last5.length ? formDots(last5) : '<span class="hint">No games yet</span>') + '</div><small>Last five matches</small></div>' +
    '<div class="tile"><h3>Luck</h3><div class="dial" style="width:100%;max-width:120px;margin:0 auto">' + dialSvg(c.tr.luck) + '<div class="num">' + Math.round(c.tr.luck * 100) + '%</div></div></div>' +
    '<div class="tile"><h3>Cup</h3>' + cupHtml + '</div></div>';
  h += '<div class="row2"><section class="card"><h3>Scouting report</h3>' + (done < ROUNDS ? compareBars(t, S.clubTeam(S.ourFixture(done).opp - 1)) + '<p class="hint" style="margin:10px 0 0">Our side on the left, theirs on the right. Training sharpens ours.</p>' : '<p class="hint">Season done. The table and trophies are in League and Club.</p>') + '</section>' + managerCard(c) + '</div>';
  h += riseCard(c);
  var ts = trySessions(c, 3);
  if(ts.length){
    h += '<section class="card"><h3>Try one next</h3><div class="try">' + ts.map(function(a){
      var lv = c.tr.levels[a.slug] || 0;
      return '<div class="tcard" style="--sc:' + STATCOL[a.stat] + '"><span class="pil">' + S.STATS[a.stat].label + '</span><h4>' + esc(a.title) + '</h4><span class="hint">' + esc(a.blurb) + '</span><a class="btn ' + (lv === 0 ? "btn-go" : "") + '" href="/practice/' + a.slug + '.html?from=jt">' + (lv === 0 ? "Have a go" : "Back to training") + '</a></div>';
    }).join("") + '</div></section>';
  }
  if(done){
    var m = st.played[done - 1], o = S.CLUBS[S.ourFixture(m.round).opp - 1];
    h += '<section class="card"><h3>Last result</h3><div class="resline"><span><span class="res ' + resultOf(m) + '">' + resultOf(m) + '</span> ' + (m.home ? esc(clubName()) + " " + m.hs + ", " + esc(o.name) + " " + m.as : esc(o.name) + " " + m.hs + ", " + esc(clubName()) + " " + m.as) + '</span><button class="btn btn-quiet" data-act="replay" data-k="league" data-i="' + (done - 1) + '">Read the report</button></div></section>';
  }
  var rows = tb.slice(0, 5), usIdx = pos - 1;
  if(usIdx > 4) rows.push(tb[usIdx]);
  h += fold("table", "League table", '<div class="tbl-wrap"><table><tr><th>#</th><th>Club</th><th>P</th><th>GD</th><th>Pts</th></tr>' +
    rows.map(function(r){ var i = tb.indexOf(r); return '<tr class="' + (r.id === 0 ? "us" : "") + '"><td>' + (i + 1) + '</td><td>' + esc(r.name) + '</td><td>' + r.p + '</td><td>' + (r.gf - r.ga) + '</td><td>' + r.pts + '</td></tr>' }).join("") + '</table></div>');
  h += fold("boost", "Training boosts", ["atk","mid","def","gk"].map(function(k){
    var b = c.tr.boost[k];
    return '<div class="stat"><span>' + S.STATS[k].label + '</span><div class="track"><i style="width:' + Math.min(100, 100 * b / 10) + '%;background:' + STATCOL[k] + '"></i></div><span>' + (b > 0.04 ? plus(b) : "0") + '</span></div>';
  }).join("") + '<button class="btn" data-act="view" data-v="train" style="margin-top:8px">Go to the training ground</button>');
  h += fold("news", "Latest news", st.inbox.slice(0, 3).map(msgHtml).join(""));
  h += fold("how", "How it works", '<ol style="margin:0 0 10px;padding-left:1.2em"><li>Pick your best side in <b>Squad</b>.</li><li>Try any <b>training</b> session. It opens in this tab and a button brings you back.</li><li>Each session you try earns a <b>match</b>. Doing more turns up the luck dial and sharpens your players.</li><li>In a match you may be asked to make a choice. Or let the coach decide.</li><li>Fifteen league matches. Reach more focus points to unlock cup ties and new signings.</li></ol><button class="btn" data-act="help">Show me how to play</button>');
  return h + '</div>';
}

function improved(){
  var best = null;
  Object.keys(st.dev.bonus).forEach(function(id){ if(st.dev.bonus[id] > 0 && (!best || st.dev.bonus[id] > st.dev.bonus[best])) best = id });
  return best ? S.playerById(best) : null;
}
function vLeague(c){
  var tb = S.table(st.seed, st.played), h = '<div class="stack"><div class="card"><h3>' + esc(S.leagueName()) + ' &middot; season ' + st.season + '</h3><div class="tbl-wrap"><table class="lg"><tr><th>#</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th><th class="form">Form</th></tr>';
  tb.forEach(function(r, i){
    var cr = r.id === 0 ? crestSvg(18, true) : opCrest(r.id, 18, true);
    var zone = (st.tier > 0 && i < 3) ? " up" : ((st.tier < 3 && i >= 13) ? " down" : "");
    h += '<tr class="' + (r.id === 0 ? "us" : "") + zone + '"><td>' + (i + 1) + '</td><td><span style="display:flex;align-items:center;gap:8px">' + cr + esc(r.name) + dealLogo(r.id) + '</span></td><td>' + r.p + '</td><td>' + r.w + '</td><td>' + r.d + '</td><td>' + r.l + '</td><td>' + (r.gf - r.ga) + '</td><td><b>' + r.pts + '</b></td><td class="form">' + formDots(r.form) + '</td></tr>';
  });
  h += '</table></div><p class="hint" style="margin-top:10px">' + zoneNote() + ' ' + (st.played.length ? esc(tb[0].name) + ' lead the table on ' + tb[0].pts + ' points.' : 'No matches yet. Everyone starts level.') + '</p></div>';
  h += '<div class="card"><h3>The Cup</h3><div class="bracket">';
  for(var k = 0; k < 4; k++){
    var tie = st.cup.ties[k], oi = tie ? tie.opp : S.cupOpponent(st.seed, k) + 1, nm = S.CLUBS[oi - 1].name, cls = "", line;
    if(tie){ cls = tie.won ? "won" : "lost"; line = '<em>' + (tie.won ? "Won " : "Lost ") + ourGoals(tie) + " to " + theirGoals(tie) + (tie.pens ? " (pens)" : "") + '</em> <button class="btn btn-quiet" style="padding:1px 8px" data-act="replay" data-k="cup" data-i="' + k + '">Report</button>' }
    else if(st.cup.out) line = '<em>Out of the cup</em>';
    else if(k === st.cup.ties.length && cupReady(c)){ cls = "next"; line = '<em style="color:var(--gold)">Ready to play</em>' }
    else line = '<em>Arrives at ' + CUP_AT[k] + ' focus points</em>';
    h += '<div class="bn ' + cls + '"><b>' + CUP_NAMES[k] + '</b>' + opCrest(oi, 34, true) + '<span>' + esc(nm) + '</span>' + line + '</div>';
  }
  h += '</div></div>';
  var tally = goalTally(), top = Object.keys(tally).sort(function(a, b){ return tally[b] - tally[a] }), imp = improved();
  function idOf(n){ var r = ""; S.PLAYERS.forEach(function(p){ if(p.name === n) r = p.id }); return r || n }
  h += '<div class="row2"><div class="card"><h3>Golden boot</h3>' + (top.length ? top.slice(0, 4).map(function(n, i){ return '<div class="scorer"><span class="n">' + (i + 1) + '</span><span style="display:flex;align-items:center;gap:8px">' + avatar(idOf(n), 34) + esc(n) + '</span><b>' + tally[n] + '</b></div>' }).join("") : '<p class="hint">No goals yet.</p>') + '</div>' +
    '<div class="card"><h3>Most improved player</h3>' + (imp ? '<div style="display:flex;justify-content:center;margin-bottom:8px">' + pcard(imp, { tag: "div", mini: 1 }) + '</div><p class="hint" style="margin:0;text-align:center">+' + bonusOf(imp.id) + ' rating this season. Players in the side grow with every match, and more with goals.</p>' : '<p class="hint">Players who play grow a little each match. The most improved wins this award.</p>') + '</div></div>';
  var fx = "";
  for(var r = 0; r < ROUNDS; r++){
    var f = S.ourFixture(r), nm2 = S.CLUBS[f.opp - 1].name, m = st.played[r], line2;
    if(m) line2 = '<span class="res ' + resultOf(m) + '">' + resultOf(m) + '</span> ' + ourGoals(m) + ' to ' + theirGoals(m) + ' <button class="btn btn-quiet" style="padding:2px 10px" data-act="replay" data-k="league" data-i="' + r + '">Report</button>';
    else if(r === st.played.length) line2 = pendingList().length ? '<b style="color:var(--accent)">Match ready</b>' : '<span class="mute">Next up</span>';
    else line2 = '<span class="mute">Coming up</span>';
    fx += '<div class="resline"><span>' + (r + 1) + '. ' + (f.home ? "" : "at ") + esc(nm2) + '</span><span>' + line2 + '</span></div>';
  }
  return h + fold("fixtures", "All your fixtures", fx) + '</div>';
}
function vClub(c){
  var defs = badgeDefs(c), got = defs.filter(function(d){ return d.ok }).length, w = 0, d = 0, l = 0, gf = 0, ga = 0, tb = S.table(st.seed, st.played);
  st.played.forEach(function(m){ var x = resultOf(m); if(x === "W") w++; else if(x === "D") d++; else l++; gf += ourGoals(m); ga += theirGoals(m) });
  var champ = st.played.length >= ROUNDS && posOf(tb) === 1, cupw = st.cup.ties.length >= 4 && st.cup.ties[3].won;
  var h = '<div class="stack"><div class="card"><h3>Season ' + st.season + ' so far</h3><div class="sumgrid"><div><b>' + st.played.length + '</b><small>Played</small></div><div><b>' + w + '</b><small>Won</small></div><div><b>' + d + '</b><small>Drawn</small></div><div><b>' + l + '</b><small>Lost</small></div><div><b>' + gf + '</b><small>For</small></div><div><b>' + ga + '</b><small>Against</small></div></div></div>';
  h += '<div class="card"><h3>Trophy cabinet</h3><div class="cabinet"><div class="cab ' + (champ ? "" : "off") + '">' + cupSvg(champ) + '<h4>League title</h4><span class="hint">' + (champ ? "Champions" : "Finish top after fifteen matches") + '</span></div><div class="cab ' + (cupw ? "" : "off") + '">' + cupSvg(cupw) + '<h4>The Cup</h4><span class="hint">' + (cupw ? "Winners" : "Win all four ties") + '</span></div></div></div>';
  h += '<div class="card"><h3>Badges &middot; ' + got + ' of ' + defs.length + '</h3><div class="badges">' + defs.map(function(b, i){
    return '<div class="bd ' + (b.ok ? "" : "off") + '">' + medal(i, b.ok) + '<span><b>' + b.name + '</b><small>' + b.desc + '</small></span></div>';
  }).join("") + '</div></div>';
  h += histCard();
  h += '<div class="card"><h3>Your club</h3><div class="mbtns" style="margin:0"><button class="btn" data-act="view" data-v="studio">Open the Studio</button><button class="btn" data-act="view" data-v="send">Send a report to Jay</button></div></div>';
  return h + '</div>';
}
function vInbox(){ return '<div class="card">' + (st.inbox.length ? st.inbox.map(msgHtml).join("") : "<p>No news yet.</p>") + '</div>' }
function vSend(){
  return '<div class="card"><h3>Send a report to Jay</h3><p class="hint">Only if you want to. It makes a short report of your season so far, ready to send.</p><div id="sendhost"></div><pre id="sendprev" style="white-space:pre-wrap;background:#0a1226;border-radius:12px;padding:12px;margin:12px 0 0;font-family:var(--body);font-size:.92rem"></pre></div>';
}
function reportText(){
  var c = ctx(), tb = S.table(st.seed, st.played), pos = posOf(tb), w = 0, d = 0, l = 0, gf = 0, ga = 0;
  st.played.forEach(function(m){ var x = resultOf(m); if(x === "W") w++; else if(x === "D") d++; else l++; gf += ourGoals(m); ga += theirGoals(m) });
  var lines = ["Manager: JT", "Club: " + clubName(), "Division: " + S.leagueName() + " (season " + st.season + ")", "Seasons completed: " + st.hist.length, "Coins: " + st.coins, st.co ? "Company: " + st.co.name + " (level " + coLevel() + ", " + (st.co.ind || "") + ")" : "Company: not started", "",
    "League matches played: " + st.played.length + " of " + ROUNDS,
    "Record: won " + w + ", drawn " + d + ", lost " + l + ", goals " + gf + " for and " + ga + " against",
    "League position: " + (st.played.length ? ord(pos) : "not started"),
    "Cup: " + (st.cup.ties.length ? (st.cup.out ? "out in the " + CUP_NAMES[st.cup.ties.length - 1].toLowerCase() : (st.cup.ties.length >= 4 ? "winners" : "through " + st.cup.ties.length + " ties")) : "not started"),
    "Formation: " + st.formation, "Luck dial: " + Math.round(c.tr.luck * 100) + " percent", "Focus points: " + c.tr.fp, "Manager rank: " + rankOf(c.tr.fp),
    "Badges earned: " + badgeDefs(c).filter(function(b){ return b.ok }).length + " of " + badgeDefs(c).length, "", "Training sessions tried:"];
  var any = false;
  S.ACTS.forEach(function(a){ var lv = c.tr.levels[a.slug]; if(lv){ any = true; lines.push("- " + a.title + " (" + a.pillar + "), level " + lv + " of " + S.CAP) } });
  if(!any) lines.push("- none yet");
  var tl = [];
  S.ACTS.forEach(function(a){ var id = st.tby[a.slug]; if(id && c.tr.levels[a.slug]){ var pp = playerOf(id); if(pp) tl.push("- " + a.title + ": trained " + (isMine(id) ? "Own player" : pp.name)) } });
  if(tl.length){ lines.push("", "Who trained in each session:"); tl.forEach(function(x){ lines.push(x) }) }
  var gl = badgeDefs(c).filter(function(b){ return b.id === "learn" && b.ok }).length;
  lines.push("", "Learning link: " + (gl ? "a goal came from a player that training had sharpened" : "not seen in a match yet"));
  var tally = goalTally(), names = Object.keys(tally).sort(function(a, b){ return tally[b] - tally[a] });
  var nm = function(n){ return st.mine.some(function(m){ return String(m.name).trim() === n }) ? "Own player" : n };
  if(names.length){ lines.push("", "Top scorers:"); names.slice(0, 3).forEach(function(n){ lines.push("- " + nm(n) + " " + tally[n]) }) }
  var imp = improved(); if(imp) lines.push("", "Most improved player: " + nm(imp.name) + " (+" + bonusOf(imp.id) + ")");
  return lines.join("\n");
}
function mountSend(){
  var host = $("sendhost");
  if(window.Base5Send && host) Base5Send.mount(host, { tool: "The Dugout", filename: "dugout", getText: reportText });
  var pv = $("sendprev"); if(pv) pv.textContent = reportText();
}

/* ---------- ambience and commentary ---------- */
var amb = null;
function ambStart(){
  if(!st.set.sound || amb) return;
  try{
    var a = actx(), n = a.sampleRate * 2, buf = a.createBuffer(1, n, a.sampleRate), d = buf.getChannelData(0), i, last = 0;
    for(i = 0; i < n; i++){ last = last * 0.985 + (Math.random() * 2 - 1) * 0.12; d[i] = last }
    var src = a.createBufferSource(), f = a.createBiquadFilter(), gn = a.createGain();
    src.buffer = buf; src.loop = true; f.type = "lowpass"; f.frequency.value = 650; gn.gain.value = 0.0001;
    src.connect(f); f.connect(gn); gn.connect(a.destination); src.start();
    gn.gain.setTargetAtTime(0.03, a.currentTime, 0.6);
    amb = { src: src, gn: gn };
  }catch(e){ amb = null }
}
function ambSwell(){
  if(!amb) return;
  try{ var t = actx().currentTime; amb.gn.gain.setTargetAtTime(0.09, t, 0.12); amb.gn.gain.setTargetAtTime(0.03, t + 1.2, 0.5) }catch(e){}
}
function ambStop(){
  if(!amb) return;
  try{ var a = actx(), s = amb.src; amb.gn.gain.setTargetAtTime(0.0001, a.currentTime, 0.2); setTimeout(function(){ try{ s.stop() }catch(e){} }, 900) }catch(e){}
  amb = null;
}
function speak(text){
  if(!st.set.voice || !window.speechSynthesis) return;
  try{ speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(String(text)); u.lang = "en-GB"; u.rate = 1.02; speechSynthesis.speak(u) }catch(e){}
}
function hush(){ try{ if(window.speechSynthesis) speechSynthesis.cancel() }catch(e){} }

/* ---------- the match ---------- */
var timer = null, playing = null, tmo = [];
function after(ms, fn){ var t = setTimeout(fn, ms); tmo.push(t); return t }
function clearTmo(){ tmo.forEach(clearTimeout); tmo = [] }
function stopTimer(){ if(timer){ clearInterval(timer); timer = null } }
function paceMs(){ return st.set.pace === "quick" ? 110 : 230 }
function settle(p){
  if(!p.M.done) S.runAll(p.M);
  if(p.kind === "cup" && p.M.hs === p.M.as && !p.M.pens) soAuto(p);
  finalise();
}
function closeMatch(){
  stopTimer(); clearTmo(); ambStop(); hush();
  if(playing && playing.M && !playing.replay && !playing.finalised) settle(playing);
  $("ov").classList.remove("on"); playing = null;
  render();
}
function ml(t){ return '<ol>' + t.players.map(function(p){ return '<li>' + esc(p.name) + ' <span class="mute">' + p.pos + '</span></li>' }).join("") + '</ol>' }
function sbHtml(o){
  var hUs = o.ourS === "h";
  var hc = hUs ? crestSvg(34, true) : opCrest(o.oppId, 34, true), ac = hUs ? opCrest(o.oppId, 34, true) : crestSvg(34, true);
  return '<div class="sb"><div class="t h' + (hUs ? " us" : "") + '">' + hc + '<span>' + esc(o.hn) + '</span></div><div class="mid"><div class="sc" aria-live="polite"><span id="sh">0</span><i></i><span id="sa">0</span></div><div class="clk" id="clk">' + (o.clk || "") + '</div></div><div class="t a' + (hUs ? "" : " us") + '"><span>' + esc(o.an) + '</span>' + ac + '</div></div>';
}
function buildTokens(p){
  var tk = [];
  ["h", "a"].forEach(function(s){
    var team = s === "h" ? p.home : p.away, ours = s === p.ourS, F = S.FORMATIONS[ours ? (p.f || st.formation) : "4-3-3"], i;
    for(i = 0; i < 11; i++){
      var xy = F.xy[i], depth = (92 - xy[1]) / 76, x = 5 + depth * 40, y = clamp(xy[0], 8, 92), pl = team.players[i];
      if(s === "a"){ x = 100 - x; y = 100 - y }
      tk.push({ s: s, i: i, name: pl.name, pos: pl.pos, num: ours && pl.id ? numOf(pl.id) : (ours && p.nums ? p.nums[i] : i + 1), bx: x, by: y, depth: depth, x: x, y: y });
    }
  });
  p.tk = tk;
}
function lpHtml(p){
  var h = '<div class="lpw"><div class="lpz" id="lpz"><div class="lp" id="lp"><i class="ln out"></i><i class="ln mid"></i><i class="ln cc"></i><i class="ln bl"></i><i class="ln br"></i><i class="gl"></i><i class="gr"></i>', k = oppKit(p.opp);
  p.tk.forEach(function(t, n){
    var us = t.s === p.ourS, cls = "tk" + (t.i === 0 && !us ? " gk" : ""), sty = "";
    if(us) sty = tokStyle(kitOf(t.i === 0));
    else if(t.i !== 0) sty = "background:" + k[0] + ";border-color:" + k[1] + ";color:" + (lum(k[0]) > 0.55 ? "#10172a" : "#fff");
    h += '<i class="' + cls + '" id="tk' + n + '" style="' + sty + '" title="' + esc(t.name) + '">' + t.num + '</i>';
  });
  return h + '<b class="ball" id="ball" style="left:50%;top:50%"></b><div class="gb" id="gb" hidden></div></div></div></div>' +
    '<div class="plab"><span>' + esc(p.home.name) + '</span><span>Pressure</span><span>' + esc(p.away.name) + '</span></div>' +
    '<div class="pres" style="background:' + (p.ourS === "h" ? "#64759a" : st.club.c2) + '"><i id="pl" style="width:50%;background:' + (p.ourS === "h" ? st.club.c2 : "#64759a") + '"></i></div>';
}
function placeAll(){
  var p = playing; if(!p || !p.tk) return;
  var lively = !calm(), m = p.min || 0;
  p.tk.forEach(function(t, n){
    var sh = (p.mom || 0) * 13 * (0.35 + 0.65 * t.depth), jx = lively ? Math.sin(m * 0.41 + n) * 1.3 : 0, jy = lively ? Math.cos(m * 0.33 + n * 1.7) * 2 : 0;
    t.x = clamp(t.bx + sh + jx, 3, 97); t.y = clamp(t.by + jy, 6, 94);
    var el = $("tk" + n); if(el){ el.style.left = t.x + "%"; el.style.top = t.y + "%" }
  });
  var pl = $("pl"); if(pl) pl.style.width = Math.round(50 + (p.mom || 0) * 40) + "%";
}
function setBall(x, y){ var b = $("ball"); if(b){ b.style.left = x + "%"; b.style.top = y + "%" } }
function findTok(side, name){
  var p = playing, i; if(!p || !p.tk) return null;
  for(i = 0; i < p.tk.length; i++) if(p.tk[i].s === side && p.tk[i].name === name) return p.tk[i];
  return null;
}
function zoomTo(side){
  var z = $("lpz"); if(!z || calm()) return;
  z.className = "lpz " + (side === "h" ? "zr" : "zl");
  after(2300, function(){ var q = $("lpz"); if(q) q.className = "lpz" });
}
function animEvent(e){
  var p = playing; if(!p || !p.tk) return;
  var right = e.side === "h", gx = right ? 97 : 3, i;
  if(e.k === "chance" || e.k === "goal"){
    p.mom = clamp((p.mom || 0) * 0.4 + (right ? 0.6 : -0.6), -1, 1); placeAll();
    var tk = findTok(e.side, e.who), sx = tk ? tk.x : (right ? 70 : 30), sy = tk ? tk.y : 50;
    var keeper = null; for(i = 0; i < p.tk.length; i++) if(p.tk[i].s !== e.side && p.tk[i].i === 0) keeper = p.tk[i];
    var saved = e.k === "chance" && /save|keeper|gloves|palm|stop|tip|grab|claw|block|beat|denied/i.test(e.text);
    var fx, fy;
    if(e.k === "goal"){ fx = gx; fy = 46 + (hash(e.who + e.m) % 9) }
    else if(saved && keeper){ fx = keeper.x; fy = keeper.y }
    else { fx = right ? 101 : -1; fy = (hash(e.who + e.m) % 2) ? 30 : 70 }
    if(calm()){ setBall(clamp(fx, 2, 98), clamp(fy, 5, 95)); return }
    var mates = p.tk.filter(function(t){ return t.s === e.side && t.i !== 0 && t !== tk });
    var m1 = mates.length ? mates[hash(e.who + e.m + "a") % mates.length] : null, m2 = mates.length ? mates[hash(e.who + e.m + "b") % mates.length] : null;
    if(e.k === "goal" && m1 && m2 && m1 !== m2){
      setBall(m1.x, m1.y);
      after(380, function(){ setBall(m2.x, m2.y) });
      after(760, function(){ setBall(sx, sy) });
      after(1150, function(){ setBall(fx, fy); zoomTo(e.side) });
      after(2300, function(){ setBall(50, 50) });
    } else if(m1){
      setBall(m1.x, m1.y);
      after(380, function(){ setBall(sx, sy) });
      after(760, function(){ setBall(fx, fy) });
      after(1500, function(){ setBall(50, 50) });
    } else {
      setBall(sx, sy); after(420, function(){ setBall(fx, fy) }); after(1250, function(){ setBall(50, 50) });
    }
  } else if(e.k === "luck"){
    p.mom = clamp((p.mom || 0) * 0.5 + (e.side === "h" ? -0.4 : 0.4), -1, 1); placeAll();
    setBall(e.side === "h" ? 14 : 86, 50);
    if(!calm()) after(900, function(){ setBall(50, 50) });
  } else if(e.k === "kick" || e.k === "half" || e.k === "full"){ setBall(50, 50) }
}
function confetti(box){
  if(!box || calm()) return;
  if(getComputedStyle(box).position === "static") box.style.position = "relative";
  var cols = [st.club.c2, "#f0cf6a", "#ffffff", "#86b0f0"], i, made = [];
  for(i = 0; i < 24; i++){
    var s = document.createElement("span"); s.className = "cf"; s.style.left = (Math.random() * 100) + "%"; s.style.background = cols[i % 4]; s.style.animationDelay = (Math.random() * 0.6) + "s";
    box.appendChild(s); made.push(s);
  }
  after(3400, function(){ made.forEach(function(s){ if(s.parentNode) s.parentNode.removeChild(s) }) });
}
function celebrate(e){
  var p = playing, gb = $("gb"); if(!gb) return;
  var ours = e.side === p.ourS;
  gb.className = "gb " + (ours ? "us" : "op");
  gb.innerHTML = '<b>GOAL!</b><span>' + esc(e.who) + ' ' + e.m + "'" + '</span>' + (e.lucky ? '<em>A lucky bounce</em>' : "") + (ours && e.why ? '<em>Trained in: ' + esc(e.why) + '</em>' : "");
  gb.hidden = false; clearTimeout(p.gbt); p.gbt = setTimeout(function(){ gb.hidden = true }, calm() ? 3200 : 2600);
  if(ours) confetti($("lp"));
  var el = $(e.side === "h" ? "sh" : "sa"); if(el && !calm()){ el.className = ""; void el.offsetWidth; el.className = "pulse" }
}
function inForm(){
  return st.xi.filter(Boolean).map(playerOf).filter(function(q){ return q && skillTotal(q.id) > 0 }).sort(function(a, b){ return skillTotal(b.id) - skillTotal(a.id) }).slice(0, 3);
}
function openMatch(kind){
  var c = ctx(), us = teamNow(c), round, tok = null, opp, home, away, hm, k;
  if(kind === "cup"){
    if(!cupReady(c)) return;
    k = st.cup.ties.length; var oi = S.cupOpponent(st.seed, k);
    opp = S.clubTeam(oi); hm = (k % 2 === 0) || k === 3; round = k;
    playing = { kind: "cup", round: k, opp: oi + 1, hm: hm };
  } else {
    round = st.played.length; if(round >= ROUNDS) return;
    tok = pendingList()[0]; if(!tok) return;
    var fx = S.ourFixture(round); opp = S.clubTeam(fx.opp - 1); hm = fx.home;
    playing = { kind: "league", round: round, opp: fx.opp, hm: hm, tok: tok };
  }
  home = hm ? us : opp; away = hm ? opp : us;
  playing.home = home; playing.away = away; playing.c = c; playing.us = us; playing.ourS = hm ? "h" : "a"; playing.min = 0; playing.mom = 0;
  playing.f = st.formation; playing.xiNow = st.xi.slice(); playing.subs = 0; playing.off = []; playing.subLog = [];
  buildTokens(playing);
  var title = kind === "cup" ? CUP_NAMES[round] : "Matchday " + (round + 1);
  var fm = inForm();
  $("match").innerHTML = '<div class="mhead"><h2>' + title + '</h2><span id="ctlTop"><button class="btn btn-quiet" data-act="closem">Not now</button></span></div>' +
    sbHtml({ hn: home.name, an: away.name, ourS: playing.ourS, oppId: playing.opp, clk: "Team sheets" }) + sponsorLine(playing.opp) + lpHtml(playing) +
    '<div id="choice"></div><div id="ctl"><div style="margin-top:14px">' + compareBars(us, opp) + '</div>' +
    (fm.length ? '<div class="inform"><b>In form</b>' + fm.map(function(q){ return '<span>' + avatar(q.id, 30, q.pos) + esc(q.name) + ' <span class="sks">' + skillChips(q.id) + '</span></span>' }).join("") + '</div>' : "") +
    '<p>Luck dial at <b style="color:var(--gold)">' + Math.round(c.tr.luck * 100) + '%</b>. ' + (kind === "cup" ? "A cup tie has a winner on the day, with penalties if it is level, and you take them. " : "") + 'You may get a few choices to make, and you can make up to three changes while you watch. Or let the coach decide.</p>' +
    '<div class="mbtns"><button class="btn btn-go btn-big" data-act="start" data-w="watch">Kick off and watch</button><button class="btn" data-act="start" data-w="highlights">Just the highlights</button><button class="btn" data-act="start" data-w="score">Just show me the score</button></div></div>' +
    '<div class="feed" id="feed"></div><div id="fin"></div>' +
    '<details class="fold" style="margin-top:14px"><summary>Team sheets</summary><div class="in"><div class="lineup"><div><h3>Our side</h3>' + ml(us) + '</div><div><h3>Their side</h3>' + ml(opp) + '</div></div></div></details>';
  $("toast").hidden = true;
  $("ov").classList.add("on");
  placeAll();
  var f = $("match").querySelector("[data-act=start]"); if(f) f.focus();
}
function startMatch(mode){
  if(!playing || playing.M) return;
  var p = playing, fkp = st.fk ? playerOf(st.fk) : null;
  var seed = (p.kind === "cup" ? st.seed + 100003 + p.round * 6151 : st.seed + p.round * 7919) >>> 0;
  p.M = S.createMatch(p.home, p.away, seed, { our: p.ourS, interactive: true, cup: false, fk: fkp && st.xi.indexOf(fkp.id) >= 0 ? fkp.name : "" });
  p.mode = mode; p.shown = 0; p.sh = 0; p.sa = 0;
  p.nameId = {}; (p.ourS === "h" ? p.home : p.away).players.forEach(function(q){ if(q.id) p.nameId[q.name] = q.id });
  p.lu = { f: p.f, n: (p.ourS === "h" ? p.home : p.away).players.map(function(q){ return q.name }), nums: (p.ourS === "h" ? p.home : p.away).players.map(function(q){ return q.id ? numOf(q.id) : 0 }) };
  $("ctl").innerHTML = ""; $("ctlTop").innerHTML = (mode === "watch" ? '<button class="btn" data-act="subopen">Make a change</button> ' : "") + '<button class="btn" id="skipb" data-act="skip">Skip to the end</button>';
  $("clk").textContent = "Kick off";
  if(mode !== "watch"){
    var bl = $("ball"); if(bl) bl.style.display = "none";
    settle(p); showAll(p.M.events, mode === "highlights"); return;
  }
  sfx("whistle"); ambStart();
  tickLoop();
}
function tickLoop(){
  stopTimer();
  var p = playing; if(!p || p.subOpen || p.so) return;
  timer = setInterval(function(){
    var M = p.M;
    if(M.pause){ stopTimer(); showChoice(M.pause); return }
    S.step(M);
    var g = drain(M, true);
    p.min = M.m; placeAll();
    var cl = $("clk"); if(cl) cl.textContent = (M.m > 90 ? "90+" + (M.m - 90) : M.m) + " min";
    if(M.pause){ stopTimer(); showChoice(M.pause); return }
    if(M.done){
      stopTimer();
      if(p.kind === "cup" && M.hs === M.as && !M.pens){ soStart(p); return }
      finalise(); drain(M, true); endPanel(); return;
    }
    if(g && !calm()){ stopTimer(); after(2600, tickLoop) }
  }, paceMs());
}
function showChoice(P){
  var box = $("choice"); if(!box) return;
  box.innerHTML = '<div class="choice" role="group" aria-label="A choice"><h3>' + esc(P.title) + '</h3><p class="hint" style="margin:0">Pick one, or let the coach decide.</p>' +
    P.options.map(function(o, i){ return '<button class="opt" data-act="pick" data-i="' + i + '"><b>' + esc(o.label) + '</b><small>' + esc(o.sub) + '</small></button>' }).join("") +
    '<button class="btn btn-quiet" style="margin-top:10px" data-act="pick" data-i="auto">Let the coach decide</button></div>';
  var f = box.querySelector(".opt"); if(f) f.focus();
}

/* ---------- changes ---------- */
function teamFrom(p, xi){
  var t = S.buildTeam(p.f, xi, p.c.tr.boost, p.c.tr.luck, bonusMap()), m = tacMods();
  t.atk += m.atk; t.mid += m.mid; t.def += m.def;
  return t;
}
function subOpen(){
  var p = playing; if(!p || !p.M || p.M.done || p.mode !== "watch" || p.so) return;
  if(p.M.pause){ toast("Make your choice first, then you can change the team."); return }
  if(p.subs >= 3){ toast("Three changes made. That is the most you get."); return }
  stopTimer(); p.subOpen = true; p.subSel = null; subDraw();
}
function subDraw(){
  var p = playing, box = $("choice"); if(!p || !box) return;
  var F = S.FORMATIONS[p.f], team = p.ourS === "h" ? p.home : p.away, h;
  if(p.subSel == null){
    h = '<div class="choice"><h3>Make a change (' + (3 - p.subs) + ' left)</h3><p class="hint" style="margin:0">Who comes off?</p><div class="subgrid">' + team.players.map(function(q, i){
      return '<button class="opt" data-act="subout" data-i="' + i + '"><b>' + esc(q.name) + '</b><small>' + F.slots[i] + (q.id ? " &middot; #" + numOf(q.id) : "") + '</small></button>';
    }).join("") + '</div><button class="btn btn-quiet" data-act="subcancel" style="margin-top:10px">Not now, carry on</button></div>';
  } else {
    var slot = p.subSel, bench = p.c.avail.filter(function(q){ return p.xiNow.indexOf(q.id) < 0 }).sort(function(a, b){ return (S.fit(b.pos, F.slots[slot]) * rate(b)) - (S.fit(a.pos, F.slots[slot]) * rate(a)) });
    h = '<div class="choice"><h3>Who comes on for ' + esc(team.players[slot].name) + '?</h3><p class="hint" style="margin:0">Playing in ' + F.slots[slot] + '. A player in the wrong position plays a little below their rating.</p><div class="subgrid">' + (bench.length ? bench.map(function(q){
      var eff = Math.round(rate(q) * S.fit(q.pos, F.slots[slot]));
      return '<button class="opt" data-act="subin" data-id="' + q.id + '"><b>' + esc(q.name) + '</b><small>' + q.pos + ' &middot; plays at ' + eff + '</small></button>';
    }).join("") : '<p class="hint">Nobody is on the bench.</p>') + '</div><div class="mbtns"><button class="btn btn-quiet" data-act="subback">Back</button><button class="btn btn-quiet" data-act="subcancel">Not now, carry on</button></div></div>';
  }
  box.innerHTML = h;
  var f = box.querySelector(".opt"); if(f) f.focus();
}
function subClose(){
  var p = playing; if(!p) return;
  p.subOpen = false; p.subSel = null; var b = $("choice"); if(b) b.innerHTML = "";
  if(p.M && !p.M.done) tickLoop();
}
function subApply(newId){
  var p = playing, M = p.M, slot = p.subSel, F = S.FORMATIONS[p.f], team = p.ourS === "h" ? p.home : p.away, np = playerOf(newId);
  if(slot == null || !np) return;
  var A = teamFrom(p, p.xiNow), nx = p.xiNow.slice(); nx[slot] = newId; var B = teamFrom(p, nx);
  ["atk", "mid", "def", "gk"].forEach(function(k){ team[k] += B[k] - A[k] });
  var op = team.players[slot];
  p.off.push({ name: op.name, id: op.id, pos: op.pos, r: op.r });
  team.players[slot] = { name: np.name, pos: F.slots[slot], id: np.id, r: Math.round(rate(np) * S.fit(np.pos, F.slots[slot])) };
  p.xiNow = nx; p.subs++; p.nameId[np.name] = np.id; p.subLog.push({ m: M.m, slot: slot, off: op.name, on: np.name });
  M.events.push({ m: M.m, k: "sub", side: p.ourS, text: np.name + " comes on for " + op.name + "." });
  st.madeSub = 1; save();
  p.tk.forEach(function(t, n){
    if(t.s === p.ourS && t.i === slot){ t.name = np.name; t.num = numOf(np.id); var el = $("tk" + n); if(el){ el.textContent = t.num; el.title = np.name } }
  });
  drain(M, false);
  subClose();
}

/* ---------- penalty shoot-out ---------- */
var DIRN = { L: "left", M: "middle", R: "right" };
function dirRand(r){ var x = r(); return x < 0.42 ? "L" : (x < 0.58 ? "M" : "R") }
function soBegin(p, r){
  var M = p.M, ourT = p.ourS === "h" ? p.home : p.away, oppT = p.ourS === "h" ? p.away : p.home;
  var outf = ourT.players.filter(function(q){ return q.pos !== "GK" }), pk = st.pk;
  outf.sort(function(a, b){ return (b.id === pk ? 1000 : b.r) - (a.id === pk ? 1000 : a.r) });
  p.so = { us: 0, them: 0, nUs: 0, nThem: 0, turn: p.hm ? "us" : "them", takers: outf.length ? outf : ourT.players, oppT: oppT.players.filter(function(q){ return q.pos !== "GK" }), ourGk: ourT.gk, oppGk: oppT.gk, ph: "pick", last: null, r: r };
  M.events.push({ m: M.add, k: "pens", side: "", text: "Level after ninety minutes. It goes to penalties." });
}
function soDecided(so){
  var nu = so.nUs, nt = so.nThem;
  if(nu <= 5 && nt <= 5){
    if(so.us > so.them + (5 - nt)) return true;
    if(so.them > so.us + (5 - nu)) return true;
    if(nu === 5 && nt === 5) return so.us !== so.them;
    return false;
  }
  if(nu === nt) return so.us !== so.them;
  return false;
}
function soShot(p, side, dir, dive){
  var so = p.so, M = p.M, shooter = side === "us" ? so.takers[so.nUs % so.takers.length] : so.oppT[so.nThem % so.oppT.length];
  var base = dir === "M" ? 0.78 : 0.86, luck = p.c.tr.luck, pg;
  if(side === "us") pg = base + (shooter.r - 70) * 0.003 + luck * 0.05 - (so.oppGk - 70) * 0.002;
  else pg = base - (so.ourGk - 70) * 0.002 - luck * 0.03;
  pg = clamp(pg, 0.5, 0.95);
  var read = dive === dir; if(read) pg *= 0.4;
  var goal = so.r() < pg;
  if(side === "us"){ so.nUs++; if(goal) so.us++ } else { so.nThem++; if(goal) so.them++ }
  var txt = goal ? (read ? shooter.name + " scores, even though the keeper guessed right." : shooter.name + " sends the keeper the wrong way and scores.") : (read ? shooter.name + " is denied by the keeper." : shooter.name + " misses the target.");
  var hs = p.ourS === "h" ? so.us : so.them, as = p.ourS === "h" ? so.them : so.us;
  M.events.push({ m: M.add, k: "pen", side: side === "us" ? p.ourS : (p.ourS === "h" ? "a" : "h"), text: txt + " Penalties " + hs + "-" + as });
  so.turn = side === "us" ? "them" : "us";
  so.last = { side: side, dir: dir, dive: dive, goal: goal, name: shooter.name, txt: txt };
  return goal;
}
function soFinish(p){
  var so = p.so, M = p.M, hs = p.ourS === "h" ? so.us : so.them, as = p.ourS === "h" ? so.them : so.us;
  M.pens = { h: hs, a: as }; M.winner = hs > as ? "h" : "a";
  M.events.push({ m: M.add, k: "pens", side: "", text: (M.winner === "h" ? p.home.name : p.away.name) + " win " + hs + "-" + as + " on penalties." });
}
function soAuto(p){
  var seed = ((p.kind === "cup" ? st.seed + 100003 + p.round * 6151 : st.seed) + 77) >>> 0;
  if(!p.so) soBegin(p, S.rng(seed));
  var so = p.so, guard = 0;
  while(!soDecided(so) && guard++ < 60) soShot(p, so.turn, dirRand(so.r), dirRand(so.r));
  soFinish(p);
}
function soStart(p){
  drain(p.M, true);
  var seed = ((p.kind === "cup" ? st.seed + 100003 + p.round * 6151 : st.seed) + 77) >>> 0;
  soBegin(p, S.rng(seed));
  var sk = $("skipb"); if(sk) sk.classList.add("hide");
  var sb = document.querySelector("[data-act=subopen]"); if(sb) sb.classList.add("hide");
  var cl = $("clk"); if(cl) cl.textContent = "Penalties";
  drain(p.M, true); soDraw();
}
function soGoal(so, shotDir, diveDir, show){
  var gx = { L: 76, M: 150, R: 224 }, kx = diveDir ? { L: 100, M: 150, R: 200 }[diveDir] : 150, kr = diveDir === "L" ? -28 : (diveDir === "R" ? 28 : 0);
  var bx = show ? gx[shotDir] : 150, by = show ? 62 : 112;
  var gkc = st.club.gk;
  return '<svg class="sogoal" viewBox="0 0 300 130" role="img" aria-label="Goal"><rect x="40" y="20" width="220" height="90" fill="#0b1a2e"/>' +
    '<path d="M40 20h220M40 40h220M40 60h220M40 80h220M40 100h220M70 20v90M100 20v90M130 20v90M160 20v90M190 20v90M220 20v90M250 20v90" stroke="#ffffff" stroke-opacity=".12"/>' +
    '<path d="M113 20v90M187 20v90" stroke="#ffffff" stroke-opacity=".25" stroke-dasharray="4 4"/>' +
    '<g class="sokeep" style="transform:translate(' + (show ? kx - 150 : 0) + 'px,0) rotate(' + (show ? kr : 0) + 'deg);transform-origin:150px 90px"><circle cx="150" cy="58" r="8" fill="#e0ac82"/><rect x="141" y="66" width="18" height="26" rx="4" fill="' + gkc + '"/><path d="M141 70l-12 10M159 70l12 10" stroke="' + gkc + '" stroke-width="5" stroke-linecap="round"/><path d="M144 92v14M156 92v14" stroke="#10172a" stroke-width="5" stroke-linecap="round"/></g>' +
    '<rect x="38" y="18" width="224" height="94" fill="none" stroke="#fff" stroke-width="4"/>' +
    '<g class="soball" style="transform:translate(' + (bx - 150) + 'px,' + (by - 112) + 'px)"><circle cx="150" cy="112" r="7" fill="#fff" stroke="#10172a" stroke-width="1.5"/></g></svg>';
}
function soDots(so){
  function row(arr, total){
    var s = "", i; for(i = 0; i < Math.max(5, total); i++) s += '<i class="' + (arr[i] === 1 ? "g" : (arr[i] === 0 ? "m" : "")) + '"></i>';
    return s;
  }
  return '<div class="sodots"><span>You</span><div>' + row(so.marks ? so.marks.us : [], so.nUs) + '</div><b>' + so.us + '</b></div><div class="sodots"><span>Them</span><div>' + row(so.marks ? so.marks.them : [], so.nThem) + '</div><b>' + so.them + '</b></div>';
}
function soDraw(){
  var p = playing, box = $("choice"); if(!p || !p.so || !box) return;
  var so = p.so; so.marks = so.marks || { us: [], them: [] };
  var h = '<div class="choice so"><h3>Penalty shoot-out</h3>' + soDots(so);
  if(so.ph === "pick"){
    if(so.turn === "us"){
      var tk = so.takers[so.nUs % so.takers.length];
      h += soGoal(so, "M", "M", false) + '<p style="margin:6px 0"><b>' + esc(tk.name) + '</b> steps up. Pick a corner.</p><div class="mbtns" style="margin:0"><button class="btn btn-go btn-big" data-act="soshot" data-d="L">Left</button><button class="btn btn-go btn-big" data-act="soshot" data-d="M">Middle</button><button class="btn btn-go btn-big" data-act="soshot" data-d="R">Right</button></div>';
    } else {
      var ot = so.oppT[so.nThem % so.oppT.length];
      h += soGoal(so, "M", "M", false) + '<p style="margin:6px 0"><b>' + esc(ot.name) + '</b> steps up for them. Which way will your keeper go?</p><div class="mbtns" style="margin:0"><button class="btn btn-go btn-big" data-act="sodive" data-d="L">Dive left</button><button class="btn btn-go btn-big" data-act="sodive" data-d="M">Stay middle</button><button class="btn btn-go btn-big" data-act="sodive" data-d="R">Dive right</button></div>';
    }
    h += '<button class="btn btn-quiet" style="margin-top:10px" data-act="soauto">Let the coach decide the rest</button>';
  } else {
    var l = so.last, done = soDecided(so);
    h += soGoal(so, l.dir, l.dive, true) + '<p style="margin:6px 0"><b>' + (l.goal ? (l.side === "us" ? "Goal!" : "They score.") : (l.side === "us" ? "Not this time." : "Saved!")) + '</b> ' + esc(l.txt) + '</p><div class="mbtns" style="margin:0"><button class="btn btn-go btn-big" data-act="sonext">' + (done ? "See the result" : "Next penalty") + '</button></div>';
  }
  box.innerHTML = h + '</div>';
  var f = box.querySelector("button.btn-go"); if(f) f.focus();
  if(so.ph === "result" && !calm()){
    setTimeout(function(){
      var b = box.querySelector(".soball"), k = box.querySelector(".sokeep");
      if(b && so.last){ var gx = { L: 76, M: 150, R: 224 }; b.style.transform = "translate(" + (gx[so.last.dir] - 150) + "px," + (62 - 112) + "px)" }
    }, 40);
  }
}
function soTake(dir, dive){
  var p = playing, so = p && p.so; if(!so || so.ph !== "pick") return;
  var side = so.turn, goal = soShot(p, side, dir, dive);
  so.marks = so.marks || { us: [], them: [] };
  (side === "us" ? so.marks.us : so.marks.them).push(goal ? 1 : 0);
  so.ph = "result"; drain(p.M, true);
  if(goal && side === "us") sfx("goal"); else if(!goal) sfx("luck");
  soDraw();
}
function soNext(){
  var p = playing, so = p && p.so; if(!so) return;
  if(soDecided(so)){ soFinish(p); p.so = null; var b = $("choice"); if(b) b.innerHTML = ""; finalise(); drain(p.M, true); endPanel(); return }
  so.ph = "pick"; soDraw();
}
function soAutoLive(){
  var p = playing; if(!p || !p.so) return;
  var so = p.so;
  if(so.ph === "result" && soDecided(so)){ soNext(); return }
  while(!soDecided(so)) soShot(p, so.turn, dirRand(so.r), dirRand(so.r));
  soFinish(p); p.so = null; $("choice").innerHTML = ""; finalise(); drain(p.M, true); endPanel();
}

/* ---------- report, replay ---------- */
function tagWhy(e, p){
  if(e.k !== "goal" || e.side !== p.ourS || e.why || !p.nameId) return;
  var id = p.nameId[e.who]; if(!id) return;
  var a = whyFor(id, "atk"); if(a) e.why = a.title;
}
function evHtml(e, ourS){
  var tag = e.k === "luck" ? '<span class="tag">LUCK</span>' : (e.lucky ? '<span class="tag">LUCKY GOAL</span>' : (e.k === "sub" ? '<span class="tag">CHANGE</span>' : ""));
  var why = e.k === "goal" && e.side === ourS && e.why ? '<em class="why">Trained in: ' + esc(e.why) + '</em>' : "";
  return '<div class="ev ' + e.k + (e.lucky ? " lucky" : "") + (e.k === "goal" && e.side === ourS ? " us" : "") + '"><b>' + (e.k === "kick" || e.k === "pens" || e.k === "pen" ? "" : e.m + "'") + '</b><span>' + tag + esc(e.text) + why + '</span></div>';
}
function addEvent(e, anim){
  var p = playing, feed = $("feed"); if(!feed) return false;
  tagWhy(e, p);
  feed.insertAdjacentHTML("afterbegin", evHtml(e, p.ourS));
  var goal = false;
  if(e.k === "goal"){
    goal = true;
    if(e.side === "h") p.sh++; else p.sa++;
    var sh = $("sh"), sa = $("sa"); if(sh) sh.textContent = p.sh; if(sa) sa.textContent = p.sa;
    sfx(e.side === p.ourS ? "goal" : "oppgoal");
    if(anim){ celebrate(e); ambSwell() }
    if(anim && (e.side === p.ourS || true)) speak(e.text);
  } else if(e.k === "luck"){ sfx("luck"); if(anim) speak(e.text) }
  else if(e.k === "full"){ sfx("whistle"); if(anim) speak(e.text) }
  else if(e.k === "half" || e.k === "sub" || e.k === "pens"){ if(anim) speak(e.text) }
  else if(e.k === "chance" && anim) ambSwell();
  if(anim) animEvent(e);
  return goal;
}
function drain(M, anim){
  var g = false;
  while(playing.shown < M.events.length){ if(addEvent(M.events[playing.shown], anim)) g = true; playing.shown++ }
  return g;
}
function showAll(events, highlightsOnly){
  var p = playing;
  var list = highlightsOnly ? events.filter(function(e){ return e.k === "goal" || e.k === "luck" || e.k === "full" || e.k === "pens" || e.k === "talk" }) : events;
  var i = 0;
  function finishNow(){ stopTimer(); while(i < list.length){ addEvent(list[i], false); i++ } endPanel(); }
  var cl = $("clk"); if(cl) cl.textContent = highlightsOnly ? "Highlights" : "Full report";
  var sk = $("skipb"); if(sk) sk.setAttribute("data-act", "skiphl");
  p.finishNow = finishNow;
  if(!highlightsOnly || sysReduce){ finishNow(); return }
  timer = setInterval(function(){
    if(i >= list.length){ finishNow(); return }
    addEvent(list[i], false); i++;
  }, 700);
}
function endPanel(){
  var p = playing, M = p.M, ours = p.ourS;
  stopTimer(); ambStop();
  var sk = $("skipb"); if(sk) sk.classList.add("hide");
  var sb = document.querySelector("[data-act=subopen]"); if(sb) sb.classList.add("hide");
  var cl = $("clk"); if(cl) cl.textContent = "Full time";
  var sh = $("sh"), sa = $("sa"); if(sh) sh.textContent = M.hs; if(sa) sa.textContent = M.as;
  var pl = $("pl"); if(pl) pl.style.width = "50%";
  var bl = $("ball"); if(bl){ bl.style.display = ""; setBall(50, 50) }
  var ev = M.events, scorers = ev.filter(function(e){ return e.k === "goal" && e.side === ours }).map(function(e){ return e.who + " " + e.m + "'" });
  var luckN = ev.filter(function(e){ return e.k === "luck" || e.lucky }).length;
  var won = M.winner === ours, drew = M.hs === M.as && !M.pens;
  var cls = won ? "win" : (drew ? "draw" : "loss");
  var head = p.kind === "cup" ? (won ? "Through to the next round" : "Out of the cup this time") : (won ? "A win" : (drew ? "A draw" : "Beaten this time"));
  if(p.kind === "cup" && p.rep ? (p.rep.k === 3 && won) : (p.kind === "cup" && p.round === 3 && won)) head = "Cup winners";
  var en = p.entry || {}, rt = en.rt || [];
  var growth = p.growth && p.growth.length ? '<p>Growing: ' + esc(p.growth.join(", ")) + '.</p>' : "";
  if(!p.rep && en.inc) growth += '<p class="earn">Earned <b>' + en.inc + ' coins</b>' + (en.spon ? ' (' + en.spon + ' from sponsors)' : "") + '.</p>';
  var mv = "";
  if(p.mv && p.kind === "league") mv = '<p>' + (p.round === 0 ? "Now " + ord(p.mv.after) + " in the league." : (p.mv.after < p.mv.before ? "Up to " + ord(p.mv.after) + " in the league." : (p.mv.after > p.mv.before ? "Down to " + ord(p.mv.after) + " in the league." : "Still " + ord(p.mv.after) + " in the league."))) + '</p>';
  var motm = rt.length ? '<div class="motm">' + avatar(rt[0].id || rt[0].n, 54, rt[0].pos) + '<div><span class="eyebrow">Player of the match</span><br><b>' + esc(rt[0].n) + '</b> <span class="mute">' + rt[0].v.toFixed(1) + '</span></div></div>' +
    '<div class="rts">' + rt.slice(1).map(function(r){ return '<span>' + esc(r.n) + ' <b>' + r.v.toFixed(1) + '</b></span>' }).join("") + '</div>' : "";
  var learned = ev.filter(function(e){ return e.k === "goal" && e.side === ours && e.why });
  var lh = learned.length ? '<p class="learned"><b>Training showed.</b> ' + esc(learned.map(function(e){ return e.who + " (" + e.why + ")" }).join(", ")) + '.</p>' : "";
  var wr = "";
  if(en.lu){
    var gl = [];
    ev.forEach(function(e, i){ if(e.k === "goal") gl.push('<button class="btn btn-quiet" data-act="goalrp" data-i="' + i + '">' + (e.side === ours ? "" : "Them: ") + esc(e.who) + " " + e.m + "'" + '</button>') });
    if(gl.length) wr = '<h4 style="margin-top:12px">Watch the goals again</h4><div class="mbtns" style="margin:6px 0 0">' + gl.join("") + '</div>';
  }
  $("fin").innerHTML = '<div class="final ' + cls + '" id="finbox"><span class="fres">' + (won ? "Win" : (drew ? "Draw" : "Defeat")) + '</span><h2>' + head + '</h2><p style="margin-top:6px">' + (M.pens ? "Penalties " + M.pens.h + " to " + M.pens.a + ". " : "") +
    (scorers.length ? "Our scorers: " + esc(scorers.join(", ")) + ". " : "No goals for us today. ") + (luckN ? "Luck moments: " + luckN + ". " : "") + '</p>' + lh + motm + mv + growth + wr +
    '<div class="mbtns"><button class="btn btn-go" data-act="closem">Back to the dugout</button><button class="btn" data-act="closeleague">See the table</button></div></div>';
  if(won && !p.replay) confetti($("finbox"));
  var b = $("fin").querySelector("button"); if(b) b.focus();
  try{ $("fin").scrollIntoView({ block: "center" }) }catch(e){}
}
function goalReplay(i){
  var p = playing; if(!p) return;
  var e = p.M.events[i], en = p.entry; if(!e || !en || !en.lu) return;
  if(!$("lp")){
    var m = en.lu, F = S.FORMATIONS[m.f] || S.FORMATIONS["4-3-3"], oppN = S.CLUBS[en.opp - 1].name, oppT = S.clubTeam(en.opp - 1);
    var ourPl = m.n.map(function(nm, k){ return { name: nm, pos: F.slots[k] } });
    (en.sb || []).forEach(function(sx){ if(sx.m < e.m && ourPl[sx.slot]) ourPl[sx.slot] = { name: sx.on, pos: ourPl[sx.slot].pos } });
    var our = { name: clubName(), players: ourPl }, opp = { name: oppN, players: oppT.players };
    p.home = p.ourS === "h" ? our : opp; p.away = p.ourS === "h" ? opp : our; p.f = m.f; p.opp = en.opp; p.nums = m.nums; p.min = e.m; p.mom = 0;
    buildTokens(p);
    $("rpitch").innerHTML = lpHtml(p);
  } else { p.min = e.m }
  p.mom = 0; placeAll();
  var host = $("rpitch") && $("rpitch").innerHTML ? $("rpitch") : $("lp");
  try{ if(host) host.scrollIntoView({ block: "center" }) }catch(er){}
  animEvent(e); celebrate(e);
  if(e.side === p.ourS) sfx("goal");
  speak(e.text);
}
function ratingsFor(ev, ours, our, win, ga, salt){
  var out = {}, list = [];
  our.players.forEach(function(q){ if(q.id) out[q.name] = { n: q.name, id: q.id, pos: q.pos, v: 6 + (hash(q.name + salt) % 7) / 10 - 0.3 + (win ? 0.3 : 0) } });
  ev.forEach(function(e){ if(e.side !== ours) return; var r = out[e.who]; if(!r) return; if(e.k === "goal") r.v += 1.3; else if(e.k === "chance") r.v += 0.2 });
  if(ga === 0) our.players.forEach(function(q){ var r = out[q.name]; if(!r) return; if(q.pos === "GK") r.v += 0.8; else if(q.pos === "DEF") r.v += 0.4 });
  Object.keys(out).forEach(function(k){ out[k].v = Math.round(clamp(out[k].v, 5, 9.9) * 10) / 10; list.push(out[k]) });
  list.sort(function(a, b){ return b.v - a.v });
  return list.slice(0, 3);
}
function finalise(){
  var p = playing, M = p.M; if(p.finalised) return; p.finalised = true;
  var ours = p.ourS, entry, ourT = ours === "h" ? p.home : p.away, our = { players: ourT.players.concat(p.off || []) };
  if(!p.nameId){ p.nameId = {}; our.players.forEach(function(q){ if(q.id) p.nameId[q.name] = q.id }) }
  M.events.forEach(function(e){ tagWhy(e, p) });
  var wonM = M.winner === ours, gAgainst = ours === "h" ? M.as : M.hs;
  var rt = ratingsFor(M.events, ours, our, wonM, gAgainst, p.opp + ":" + p.round);
  var lu = p.lu || { f: p.f, n: ourT.players.map(function(q){ return q.name }), nums: [] };
  if(p.kind === "cup"){
    entry = { k: p.round, opp: p.opp, home: p.hm, hs: M.hs, as: M.as, events: M.events, pens: M.pens, won: wonM, rt: rt, lu: lu, sb: p.subLog };
    st.cup.ties.push(entry); if(!wonM) st.cup.out = true;
    entry.inc = payout(entry, "cup");
    post((wonM ? "Cup win: " : "Cup exit: ") + CUP_NAMES[p.round], "Match report", (wonM ? "Through after " : "Out after ") + ourGoals(entry) + " to " + theirGoals(entry) + (M.pens ? " and penalties" : "") + " against " + S.CLUBS[p.opp - 1].name + ".");
    if(wonM && p.round === 3) post("Cup winners!", "The Chairman (Jay)", "You have won the cup. A brilliant run, manager.");
  } else {
    var before = posOf(S.table(st.seed, st.played));
    entry = { round: p.round, opp: p.opp, home: p.hm, hs: M.hs, as: M.as, events: M.events, slug: p.tok.slug, luck: Math.round(p.c.tr.luck * 100), rt: rt, lu: lu, sb: p.subLog };
    st.played.push(entry); st.used.push(p.tok.slug);
    entry.inc = payout(entry, "league");
    p.mv = { before: before, after: posOf(S.table(st.seed, st.played)) };
    var o = S.CLUBS[p.opp - 1].name, g = ourGoals(entry), a = theirGoals(entry), x = resultOf(entry);
    var luckN = M.events.filter(function(e){ return e.k === "luck" || e.lucky }).length, whyN = M.events.filter(function(e){ return e.k === "goal" && e.side === ours && e.why }).length;
    post((x === "W" ? "Win" : (x === "D" ? "Draw" : "Defeat")) + ": " + g + " to " + a + " against " + o, "Match report",
      (x === "W" ? "A good day. " : (x === "D" ? "A point to take away. " : "Not our day, and that is football. ")) +
      (rt.length ? "Player of the match: " + rt[0].n + ". " : "") +
      (luckN ? "The luck dial helped " + luckN + (luckN === 1 ? " time" : " times") + ". " : "The luck dial did not need to step in. ") +
      (whyN ? whyN + (whyN === 1 ? " goal came" : " goals came") + " from a player that training had sharpened. " : "") +
      "Earned by your " + (actBy(p.tok.slug) ? actBy(p.tok.slug).title : "training") + " session.");
    if(st.played.length === ROUNDS){
      var pos = posOf(S.table(st.seed, st.played));
      var imp0 = improved();
      post(pos === 1 ? "League champions!" : "Season finished: " + ord(pos), "The Chairman (Jay)", (pos === 1 ? "Top of the league after fifteen matches. Outrageous. Well played, manager." : "Fifteen matches played and you finished " + ord(pos) + ".") + (imp0 ? " Most improved player: " + imp0.name + "." : ""));
    }
  }
  var grew = [], byName = {}, gain = {};
  our.players.forEach(function(q){ if(q.id){ byName[q.name] = q.id; gain[q.id] = (gain[q.id] || 0) + 1 } });
  M.events.forEach(function(e){ if(e.k === "goal" && e.side === ours && byName[e.who]) gain[byName[e.who]] += 2 });
  Object.keys(gain).forEach(function(id){
    var xp = (st.dev.xp[id] || 0) + gain[id]; st.dev.xp[id] = xp;
    var nb = Math.min(6, Math.floor(xp / 4)), old = bonusOf(id);
    if(nb > old){ st.dev.bonus[id] = nb; var pl = S.playerById(id); if(pl) grew.push(pl.name + " (now " + (pl.r + nb) + ")") }
  });
  if(grew.length) post("Players improving", "Coaching staff", "Match time is making players better: " + grew.join(", ") + ".");
  p.growth = grew; p.entry = entry; save();
}
function replay(kind, i){
  var m = kind === "cup" ? st.cup.ties[i] : st.played[i]; if(!m) return;
  var ours = ourSide(m), opp = S.CLUBS[m.opp - 1].name;
  var rep = { hname: m.home ? clubName() : opp, aname: m.home ? opp : clubName(), k: m.k };
  var win = m.pens ? (m.won ? ours : (ours === "h" ? "a" : "h")) : (m.hs > m.as ? "h" : (m.as > m.hs ? "a" : ""));
  playing = { replay: true, kind: kind === "cup" ? "cup" : "league", round: -1, ourS: ours, rep: rep, entry: m, M: { events: m.events, hs: m.hs, as: m.as, pens: m.pens, winner: win }, shown: 0, sh: 0, sa: 0, finalised: true, growth: [], nameId: {} };
  m.events.forEach(function(e){ if(e.k === "goal" && e.side === ours && e.why === undefined) playing.nameId[e.who] = null });
  $("ov").classList.add("on");
  $("match").innerHTML = '<div class="mhead"><h2>Match report</h2><button class="btn" id="skipb" data-act="skiphl">Skip</button></div>' + sbHtml({ hn: rep.hname, an: rep.aname, ourS: ours, oppId: m.opp, clk: "" }) + '<div id="rpitch"></div><div class="mbtns" style="margin:12px 0 8px"><button class="btn" data-act="rp" data-m="full">Full report</button><button class="btn" data-act="rp" data-m="hl">Highlights</button></div><div class="feed" id="feed"></div><div id="fin"></div>';
  showAllReplay(false);
}
function showAllReplay(hl){
  var p = playing; stopTimer();
  $("feed").innerHTML = ""; p.sh = 0; p.sa = 0; $("sh").textContent = 0; $("sa").textContent = 0; $("fin").innerHTML = "";
  var sk = $("skipb"); if(sk) sk.classList.remove("hide");
  showAll(p.M.events, hl);
}

/* ---------- set up your club, then how to play ---------- */
var wiz = { on: false, step: 0, mode: "setup", timer: null, demo: null };
var SWATCH = [["#0c3b27", "#74c9a0"], ["#1f3b7a", "#e6c86a"], ["#7a1f2b", "#ffffff"], ["#4a1f7a", "#e6c86a"], ["#151b26", "#e39a9a"], ["#0b5a73", "#ffffff"], ["#6a4410", "#ffe3b0"], ["#1b1b6b", "#79e0c9"]];
var CRESTS = ["bird", "star", "bolt", "ball", "crown", "flame"];
var TRAITS = ["Never gives up", "Fast and fearless", "Calm under pressure", "Scores when it matters", "Reads the game", "Keeps the ball"];
var POSN = { GK: "Goalkeeper", DEF: "Defender", MID: "Midfielder", FWD: "Forward" };
function mine0(create){
  var m = st.mine[0];
  if(!m && create){ m = { id: "me", name: "", pos: "MID", note: TRAITS[0] }; st.mine.push(m) }
  return m;
}
function wizOpen(step, mode){
  wiz.on = true; wiz.step = step; wiz.mode = mode;
  $("wiz").classList.add("on"); wizDraw();
  var f = $("wizbox").querySelector("input,button"); if(f) try{ f.focus() }catch(e){}
}
function wizStop(){ if(wiz.timer){ clearInterval(wiz.timer); wiz.timer = null } }
function wizClose(){
  wizStop(); wiz.on = false; $("wiz").classList.remove("on");
  var m = mine0(false); if(m && !String(m.name || "").trim()) st.mine = st.mine.filter(function(x){ return x !== m });
  applyMine(); applyClub(); st.setup = true; save(); render();
}
function demoNumbers(){
  var opp = S.clubTeam(0), pool = S.PLAYERS.filter(function(p){ return !p.fp });
  var xi = autoPick(st.formation, pool), N = 30, out = [], i;
  var levels = [["No sessions yet", 0], ["One go at every session", 1], ["Lots of doing in every session", 4]], sample = null;
  levels.forEach(function(L){
    var b = {}; S.ACTS.forEach(function(a){ b[a.slug] = { n: L[1] } });
    var tr = S.training(b), team = S.buildTeam(st.formation, xi, tr.boost, tr.luck), w = 0;
    for(i = 0; i < N; i++){
      var r = S.simulate(team, opp, 5000 + i * 17, { our: "h", interactive: true });
      if(r.hs > r.as) w++;
      var ln = r.events.filter(function(e){ return e.k === "luck" || e.lucky }).length;
      if(L[1] === 4 && !sample && ln >= 2 && r.hs > r.as) sample = r.events.filter(function(e){ return e.k === "goal" || e.k === "luck" }).slice(0, 6);
    }
    out.push({ label: L[0], luck: tr.luck, w: w, N: N });
  });
  return { rows: out, sample: sample || [] };
}
function wizDemoSet(i){
  var D = wiz.demo; if(!D) return;
  var box = $("wizbox"), r = D.rows[i], nd = box.querySelector(".needle"), nm = $("wznum");
  if(nd) nd.style.transform = "rotate(" + (-90 + 180 * r.luck) + "deg)";
  if(nm) nm.textContent = Math.round(r.luck * 100) + "%";
  var rows = box.querySelectorAll(".drow"); for(var k = 0; k < rows.length; k++) rows[k].classList.toggle("on", k === i);
}
function wizDraw(){
  if(!wiz.on) return;
  wizStop();
  var box = $("wizbox"), step = wiz.step, h = "", last = step === 3, full = wiz.mode !== "help";
  var titles = ["Name your club", "Build your player", "Pick your side", "How to play"];
  if(full) h += '<div class="wzdots" aria-label="Step ' + (step + 1) + ' of 4">' + [0, 1, 2, 3].map(function(i){ return '<i class="' + (i <= step ? "on" : "") + '"></i>' }).join("") + '</div>';
  h += '<div class="mhead"><h2>' + titles[step] + '</h2>' + (full ? '<button class="btn btn-quiet" data-act="wzclose">' + (last ? "Close" : "Skip for now") + '</button>' : '') + '</div>';
  if(step === 0){
    h += '<p class="hint">You are the manager. Make the club yours. The whole game takes on your colours. You can change any of this later, and the Studio has loads more: patterns, badges, players, even the grass.</p>' +
      '<label class="sendlab" for="wzname">Club name</label><br><input class="wzin" id="wzname" maxlength="24" value="' + esc(st.club.name) + '" placeholder="Base 5 United">' +
      '<h3 style="margin-top:16px">Kit colours</h3><div class="swatches">' + SWATCH.map(function(sw, i){
        return '<button class="swatch" data-act="wzcol" data-i="' + i + '" aria-pressed="' + (st.club.c1 === sw[0] && st.club.c2 === sw[1]) + '" aria-label="Colour set ' + (i + 1) + '" style="background:' + sw[0] + '"><i style="background:' + sw[1] + '"></i></button>';
      }).join("") + '</div><h3>Badge</h3><div class="crests">' + CRESTS.map(function(k){
        return '<button data-act="wzcrest" data-k="' + k + '" aria-pressed="' + (st.club.crest === k) + '" aria-label="Badge ' + k + '">' + crestSvg(40, true, { crest: k }) + '</button>';
      }).join("") + '</div><div class="wzprev">' + crestSvg(54, true) + '<div style="width:62px">' + shirt(kitOf(false), "10") + '</div><div><div class="nm" id="wzshow">' + esc(clubName()) + '</div><span class="hint">Your club</span></div></div>';
  } else if(step === 1){
    var m = mine0(false) || { id: "me", name: "", pos: "MID", note: TRAITS[0] };
    var prev = { id: m.id, name: (m.name || "").trim() || "Your player", pos: m.pos, r: MINER[m.id] || 70, note: m.note };
    h += '<p class="hint">Make a player of your own. They join the squad rated ' + (MINER[m.id] || 70) + ', a touch better than the rest to start with. Made up names work well. You can skip this too, and make up to three more in the Studio.</p>' +
      '<label class="sendlab" for="wzpl">Player name</label><br><input class="wzin" id="wzpl" maxlength="22" value="' + esc(m.name || "") + '" placeholder="e.g. Rocket Rory">' +
      '<h3 style="margin-top:16px">Position</h3><div class="opts">' + ["GK", "DEF", "MID", "FWD"].map(function(k){ return '<button data-act="wzpos" data-k="' + k + '" aria-pressed="' + (m.pos === k) + '">' + POSN[k] + '</button>' }).join("") + '</div>' +
      '<h3>Their style</h3><div class="opts">' + TRAITS.map(function(k, i){ return '<button data-act="wztrait" data-i="' + i + '" aria-pressed="' + (m.note === k) + '">' + k + '</button>' }).join("") + '</div>' +
      '<div class="wzprev" id="wzcard">' + pcard(prev, { tag: "div", mini: 1 }) + '<div><span class="hint">Your player card.</span></div></div>';
  } else if(step === 2){
    var c = ctx();
    h += '<p class="hint">Choose a formation, then tap a spot and a player card to build your side. Or let the computer pick, then change what you like. There is no wrong answer.</p><div class="grid" style="gap:14px">' + pitchCard(c, "s12") + listCard(c, "s12") + '</div>';
  } else {
    var D = demoNumbers(); wiz.demo = D;
    h += '<div class="how"><div><b class="n">1</b><b>Build your side.</b><br>You can change it any time in Squad, along with tactics and set pieces.</div>' +
      '<div><b class="n">2</b><b>Choose who trains, then try a session.</b><br>Any one, in any order. Each opens in this tab with a button to bring you back. The player you chose gets better.</div>' +
      '<div><b class="n">3</b><b>Each session earns a match.</b><br>Kick off when you fancy. Watch it live on the pitch, see the highlights, or just the score.</div>' +
      '<div><b class="n">4</b><b>More doing, more luck.</b><br>Every bit of doing turns the luck dial up and sharpens your players.</div>' +
      '<div><b class="n">5</b><b>Make a few choices.</b><br>At half time, for a free kick, and with up to three changes. In the cup you take the penalties. Or let the coach decide.</div>' +
      '<div><b class="n">6</b><b>Make it yours.</b><br>The Studio is for your kit, badge, ground and players. Badges collect in Club.</div></div>' +
      '<h3>See it for yourself</h3><p class="hint">The same side plays the same strong club 30 times. The only thing that changes is how much training has been done. Tap a row to see the dial.</p>' +
      '<div class="demo"><div class="dial">' + dialSvg(D.rows[2].luck) + '<div class="num" id="wznum">' + Math.round(D.rows[2].luck * 100) + '%</div></div><div>' +
      D.rows.map(function(r, i){ return '<button class="drow' + (i === 2 ? " on" : "") + '" data-act="wzdemo" data-i="' + i + '"><span><b>' + r.label + '</b><span class="track" style="display:block"><i style="width:' + (100 * r.w / r.N) + '%"></i></span></span><b class="w">' + r.w + ' wins of ' + r.N + '</b></button>' }).join("") + '</div></div>' +
      (D.sample.length ? '<h3 style="margin-top:16px">A game with lots of training</h3><ul class="moments">' + D.sample.map(function(e){ return '<li><b>' + e.m + "'</b> " + (e.k === "luck" || e.lucky ? '<span class="tag">LUCK</span>' : "") + esc(e.text) + '</li>' }).join("") + '</ul>' : "") +
      '<p class="hint" style="margin-top:10px">Real matches are shuffled by luck, so any single game can go either way. Over a whole season, doing more helps.</p>';
  }
  h += '<div class="wzfoot">' + (full && step > 0 ? '<button class="btn" data-act="wzback">Back</button>' : '<span></span>') +
    (last ? '<button class="btn btn-go btn-big" data-act="wzclose">' + (full ? "Start managing" : "Got it") + '</button>' : '<button class="btn btn-go btn-big" data-act="wznext">Next</button>') + '</div>';
  box.innerHTML = h;
  if(step === 3 && !calm()){
    var k = 0;
    wiz.timer = setInterval(function(){ wizDemoSet(k); k = (k + 1) % 3 }, 2400);
  }
}

/* ---------- typing ---------- */
document.addEventListener("input", function(e){
  var id = e.target.id, v = e.target.value, f = { stname: "name", stshort: "short", stnick: "nick", stmotto: "motto", ststad: "stadium", stc1: "c1", stc2: "c2", stgk: "gk" }[id];
  if(id === "wzname"){ st.club.name = v; applyClub(); var sh = $("wzshow"); if(sh) sh.textContent = clubName(); save(); renderClub() }
  else if(id === "wzpl"){
    var m = mine0(true); m.name = v; applyMine(); save();
    var wc = $("wzcard"); if(wc) wc.firstChild.outerHTML = pcard({ id: m.id, name: v.trim() || "Your player", pos: m.pos, r: MINER[m.id] || 70, note: m.note }, { tag: "div", mini: 1 });
  }
  else if(f){
    st.club[f] = (f === "short") ? v.toUpperCase().replace(/[^A-Za-z0-9]/g, "").slice(0, 4) : v;
    applyClub(); applyKit(); save(); studioRefresh(false);
    if(f === "c1" || f === "c2" || f === "gk"){
      var pbs = document.querySelectorAll(".pats button");
      for(var q = 0; q < pbs.length; q++){ var pvv = pbs[q].querySelector(".pv2"); if(pvv) pvv.innerHTML = shirt({ c1: st.club.c1, c2: st.club.c2, pat: pbs[q].getAttribute("data-v") }, "") }
    }
  }
  else if(id === "conname" || id === "conslogan"){
    coForm(); coDraft[id === "conname" ? "name" : "slogan"] = v;
    var cp = $("coprev"); if(cp) cp.innerHTML = '<div class="stcard">' + coLogoOf(coDraft, 84) + '<div><h2>' + esc(coDraft.name || "Your company") + '</h2><span class="hint">' + esc(coDraft.ind) + (coDraft.slogan ? " &middot; " : "") + (coDraft.slogan ? '<em>' + esc(coDraft.slogan) + '</em>' : "") + '</span></div></div>';
  }
  else if(id === "edname"){
    var ec = $("edcard"); if(ec){ var nm = ec.querySelector(".nm"); if(nm) nm.textContent = v }
  }
});
document.addEventListener("change", function(e){
  var t = e.target;
  if(t.id === "edname"){ renamePlayer(editing, t.value); edDraw(); return }
  if(t.id === "ednum"){ setNumber(editing, t.value); edDraw(); return }
  if(t.id === "wzpl"){
    var m = mine0(false); if(m && (/^no\.\s/i.test(m.name.trim()) || nameTaken(m.name.trim(), m.id))){ toast("That name is already taken. Pick another."); m.name = ""; applyMine(); save(); wizDraw() }
    return;
  }
  var key = t.getAttribute && t.getAttribute("data-sel"); if(!key) return;
  if(key === "cap" || key === "pk" || key === "fk"){ st[key] = t.value; save(); render(); return }
  if(key.indexOf("tr:") === 0){ st.focus[key.slice(3)] = t.value; save(); render() }
});

/* ---------- clicks ---------- */
function place(pid, slot){
  var j = st.xi.indexOf(pid), old = st.xi[slot];
  if(j >= 0 && j !== slot) st.xi[j] = old || "";
  st.xi[slot] = pid; save();
}
function rvNext(then){
  st.reveal.shift(); save();
  $("rv").classList.remove("on");
  if(then) view = then;
  render();
}
document.addEventListener("toggle", function(e){
  var d = e.target; if(d && d.getAttribute && d.getAttribute("data-f")) folds[d.getAttribute("data-f")] = d.open;
}, true);
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-act]");
  if(!b) return;
  var a = b.getAttribute("data-act"), c;
  if(a === "help"){ wizOpen(3, "help"); return }
  if(a === "wzedit"){ wizOpen(0, "edit"); return }
  if(a === "wzclose"){ wizClose(); return }
  if(a === "wzback"){ wiz.step = Math.max(0, wiz.step - 1); wizDraw(); return }
  if(a === "wznext"){
    if(wiz.step === 1){
      var m0 = mine0(false);
      if(m0 && !String(m0.name || "").trim()) st.mine = st.mine.filter(function(x){ return x !== m0 });
      applyMine(); var cc = ctx(), mid = m0 && String(m0.name || "").trim() ? m0.id : "";
      st.xi = autoPick(st.formation, cc.avail, st.xi.filter(function(id){ return id && !isMine(id) }).concat(mid ? [mid] : [])); save();
    }
    wiz.step = Math.min(3, wiz.step + 1); wizDraw(); return;
  }
  if(a === "wzcol"){ var sw = SWATCH[+b.getAttribute("data-i")]; st.club.c1 = sw[0]; st.club.c2 = sw[1]; save(); applyKit(); renderClub(); if(wiz.on) wizDraw(); else render(); return }
  if(a === "wzcrest"){ st.club.crest = b.getAttribute("data-k"); save(); renderClub(); wizDraw(); return }
  if(a === "wzpos"){ var mp = mine0(true); mp.pos = b.getAttribute("data-k"); applyMine(); save(); wizDraw(); return }
  if(a === "wztrait"){ var mt = mine0(true); mt.note = TRAITS[+b.getAttribute("data-i")]; applyMine(); save(); wizDraw(); return }
  if(a === "wzdemo"){ wizDemoSet(+b.getAttribute("data-i")); return }
  if(a === "rvclose"){ rvNext(); return }
  if(a === "rvsquad"){ rvNext("squad"); return }
  if(a === "motion"){ if(sysReduce) return; st.set.motion = calm() ? "lively" : "calm"; save(); render(); return }
  if(a === "view"){ view = b.getAttribute("data-v"); sel = null; try{ history.replaceState(null, "", "#" + view) }catch(er){} render(); window.scrollTo(0, 0); return }
  if(a === "set"){
    var k = b.getAttribute("data-k"), v = b.getAttribute("data-v");
    st.set[k] = (k === "sound" || k === "voice") ? (v === "true") : v; save(); if(k === "sound" && st.set.sound) sfx("luck"); if(k === "voice" && st.set.voice) speak("Commentary is on."); render(); return;
  }
  if(a === "rsask"){ resetAsk = b.getAttribute("data-v"); render(); return }
  if(a === "rsdo"){ var rk2 = b.getAttribute("data-v"); resetAsk = ""; resetDo(rk2); return }
  if(a === "menu"){ titleOpen(); return }
  if(a === "tiplay"){ titleClose(); view = "dugout"; render(); window.scrollTo(0, 0); return }
  if(a === "tigo"){ titleClose(); view = b.getAttribute("data-v"); sel = null; render(); window.scrollTo(0, 0); return }
  if(a === "tihelp"){ titleClose(); wizOpen(3, "help"); return }
  if(a === "endseason"){ openSeason(); return }
  if(a === "seasongo"){ seasonGo(); return }
  if(a === "seasonclose"){ closeSeason(); return }
  if(a === "coset"){ coForm(); coDraft[b.getAttribute("data-k")] = b.getAttribute("data-v"); render(); return }
  if(a === "cocol"){ coForm(); var sw = SWATCH[+b.getAttribute("data-i")]; if(sw){ coDraft.c1 = sw[0]; coDraft.c2 = sw[1] } render(); return }
  if(a === "coedit"){ coEditing = true; coDraft = Object.assign({}, st.co); render(); return }
  if(a === "cocancel"){ coEditing = false; coDraft = null; render(); return }
  if(a === "cosave"){
    var cd = coDraft || {}, cn = String(cd.name || "").trim().replace(/\s+/g, " ").slice(0, 24);
    if(!cn){ toast("Give your company a name first."); var ci = $("conname"); if(ci) ci.focus(); return }
    var first = !st.co;
    st.co = Object.assign({ earned: 0, signed: 0 }, st.co || {}, cd, { name: cn, slogan: String(cd.slogan || "").trim().slice(0, 40) });
    coDraft = null; coEditing = false;
    if(first) post("Your company is open", "The Chairman (Jay)", cn + " is ready for business. Sign a sponsorship deal in Business and it earns coins whenever your sponsored clubs play well.");
    save(); render(); toast(first ? cn + " is open for business." : "Company updated."); return;
  }
  if(a === "deal"){
    var dc = +b.getAttribute("data-c"), dd = dealOf(dc);
    if(!st.co || dd) return;
    if(st.deals.length >= coSlots()){ toast("No free slot. Your company grows as it earns."); return }
    var dp = dealPrice(dc);
    if(st.coins < dp){ toast("Not enough coins yet."); return }
    st.deals.push({ club: dc, fee: dealFee(dc), price: dp, got: 0 }); st.co.signed = (st.co.signed || 0) + 1;
    addCoins(-dp, "Sponsorship: " + (dc === -1 ? clubName() : S.CLUBS[dc].name));
    save(); render(); toast(st.co.name + " now sponsors " + (dc === -1 ? clubName() : S.CLUBS[dc].name) + "."); return;
  }
  if(a === "buy"){ buyPlayer(b.getAttribute("data-id")); return }
  if(a === "sellask"){ sellAsk = b.getAttribute("data-id") || ""; render(); return }
  if(a === "sellyes"){ sellPlayer(b.getAttribute("data-id")); return }
  if(a === "stab"){ studioTab = b.getAttribute("data-v"); render(); return }
  if(a === "club"){ st.club[b.getAttribute("data-k")] = b.getAttribute("data-v"); save(); applyKit(); renderClub(); render(); return }
  if(a === "edit"){ edOpen(b.getAttribute("data-id")); return }
  if(a === "edclose"){ edClose(); return }
  if(a === "newmine"){ newMine(); return }
  if(a === "look"){
    var id1 = editing, kk = b.getAttribute("data-k"), vv = +b.getAttribute("data-v"), o = st.look[id1] || (st.look[id1] = {});
    o[kk] = vv; save(); edDraw(); return;
  }
  if(a === "lookreset"){ delete st.look[editing]; save(); edDraw(); return }
  if(a === "role"){ var rk = b.getAttribute("data-k"); st[rk] = st[rk] === editing ? "" : editing; save(); edDraw(); return }
  if(a === "edname0"){ renamePlayer(editing, ORIG[editing]); edDraw(); return }
  if(a === "edmine"){
    var mm = st.mine.filter(function(x){ return x.id === editing })[0], mk = b.getAttribute("data-k"), mv = b.getAttribute("data-v");
    if(mm){ if(mk === "pos") mm.pos = mv; else mm.note = TRAITS[+mv]; applyMine(); save(); edDraw() }
    return;
  }
  if(a === "rmmine"){
    var rid = editing;
    st.mine = st.mine.filter(function(x){ return x.id !== rid }); applyMine();
    ["cap", "pk", "fk"].forEach(function(q){ if(st[q] === rid) st[q] = "" });
    st.xi = st.xi.map(function(x){ return x === rid ? "" : x });
    editing = null; $("ed").classList.remove("on"); save(); render(); return;
  }
  if(a === "tac"){ st.tac[b.getAttribute("data-k")] = b.getAttribute("data-v"); save(); render(); return }
  if(a === "kick"){ openMatch("league"); return }
  if(a === "kickcup"){ openMatch("cup"); return }
  if(a === "start"){ startMatch(b.getAttribute("data-w")); return }
  if(a === "subopen"){ subOpen(); return }
  if(a === "subout"){ playing.subSel = +b.getAttribute("data-i"); subDraw(); return }
  if(a === "subback"){ playing.subSel = null; subDraw(); return }
  if(a === "subin"){ subApply(b.getAttribute("data-id")); return }
  if(a === "subcancel"){ subClose(); return }
  if(a === "soshot"){ soTake(b.getAttribute("data-d"), dirRand(playing.so.r)); return }
  if(a === "sodive"){ soTake(dirRand(playing.so.r), b.getAttribute("data-d")); return }
  if(a === "sonext"){ soNext(); return }
  if(a === "soauto"){ soAutoLive(); return }
  if(a === "goalrp"){ goalReplay(+b.getAttribute("data-i")); return }
  if(a === "pick"){
    var iv = b.getAttribute("data-i"), M = playing && playing.M; if(!M || !M.pause) return;
    S.resolve(M, iv === "auto" ? (M.pause.def || 0) : +iv);
    $("choice").innerHTML = ""; drain(M, true); tickLoop(); return;
  }
  if(a === "skip"){
    var p = playing; if(!p || !p.M) return; stopTimer(); clearTmo(); hush(); $("choice").innerHTML = ""; p.subOpen = false; p.so = p.so || null;
    settle(p); drain(p.M, false); endPanel(); return;
  }
  if(a === "skiphl"){ if(playing && playing.finishNow) playing.finishNow(); return }
  if(a === "closem"){ closeMatch(); return }
  if(a === "closeleague"){ closeMatch(); view = "league"; render(); return }
  if(a === "replay"){ replay(b.getAttribute("data-k"), +b.getAttribute("data-i")); return }
  if(a === "rp"){ showAllReplay(b.getAttribute("data-m") === "hl"); return }
  if(a === "pf"){ posFilter = b.getAttribute("data-k"); render(); return }
  if(a === "form"){
    st.formation = b.getAttribute("data-f"); c = ctx();
    st.xi = autoPick(st.formation, c.avail, st.xi.filter(Boolean)); sel = null; save(); render(); return;
  }
  if(a === "auto"){ c = ctx(); st.xi = autoPick(st.formation, c.avail); sel = null; save(); render(); return }
  if(a === "slot"){
    var i = +b.getAttribute("data-i");
    if(sel && sel.player){ place(sel.player, i); sel = null; render(); return }
    sel = (sel && sel.slot === i) ? null : { slot: i }; render(); return;
  }
  if(a === "player"){
    var id = b.getAttribute("data-id");
    if(sel && sel.slot !== undefined){ place(id, sel.slot); sel = null; render(); return }
    sel = (sel && sel.player === id) ? null : { player: id }; render(); return;
  }
});
document.addEventListener("keydown", function(e){
  if(e.key !== "Escape") return;
  if(tiOn) titleClose();
  else if($("rv").classList.contains("on")){ if(rvMode === "season") closeSeason(); else rvNext() }
  else if($("ed").classList.contains("on")) edClose();
  else if(wiz.on) wizClose(); else if($("ov").classList.contains("on")) closeMatch();
});
function refresh(){ if(tiOn) return; if(!$("ov").classList.contains("on") && !$("ed").classList.contains("on") && !wiz.on && !$("rv").classList.contains("on")) render() }
window.addEventListener("pageshow", refresh);
window.addEventListener("focus", refresh);
document.addEventListener("visibilitychange", function(){ if(!document.hidden) refresh() });
window.addEventListener("storage", function(e){ if(e.key === ENG) refresh() });

var h0 = (location.hash || "").replace("#", "");
VIEWS.forEach(function(v){ if(v.id === h0) view = h0 });
window.__dugout = { st: function(){ return st }, ctx: ctx, render: render, teamNow: teamNow, save: save, seasonSummary: seasonSummary, marketList: marketList, priceOf: priceOf, coSlots: coSlots };
if(!st.setup) wizOpen(0, "setup");
render();
var seenMenu = false; try{ seenMenu = !!sessionStorage.getItem("b5.jt.menu") }catch(e){}
if(st.setup && !firstRun && !seenMenu && !location.hash && !$("rv").classList.contains("on")) titleOpen();
})();
