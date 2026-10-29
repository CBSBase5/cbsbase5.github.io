/* ==========================================================
   EGW's GCSE HQ - Dunk: the tea room (v2, 29 Oct 2026)
   A break game for EGW's HQ. Customers come into the tea room
   and order a biscuit a certain kind of soggy. Hold to dunk,
   let go to lift. Land the Sogometer in their band for a
   perfect dunk and a tip; push it too far and it snaps.
   Streaks of perfect dunks build a combo. Each shift in a visit
   gets busier. Pure fun: no learning questions in here.

   Extras (shared with the other HQ games via /data/hqgame.js):
   - Unlocks over the term: biscuits for the tin (each soaks in
     its own way), drinks and mugs for the cupboard, tea room
     upgrades and a Rush hour shift.
   - Weekly era twist: the room, customers, mug and one silly
     rule change each week of Autumn 2.
   - Jay and Bonnie secrets, logged on the Secrets tab.

   Earning goes, the break clock and the cooldown all live in
   /data/hqbreak.js. Home page only:
     <script src="/data/hqgame.js?v=1"></script>
     <script src="/data/hqbreak.js?v=3"></script>
     <script src="/egw/dunk.js?v=2"></script>
   Best score and sound stay in b5.egw.dunk.v1 (owned by
   hqbreak.js). The tin, cupboard, secrets and stats save in
   b5.egw.dunk.tin.v1. ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(!window.HQBreak) return;
var PREFIX = (window.HQ && window.HQ.prefix) || "b5.egw.";
if(PREFIX !== "b5.egw.") return;   /* EGW's space only */

var G = window.HQGame;
var ERA0 = { n:1, id:"stone", name:"Stone Age", line:"Everything is made of rock. Even the bad ideas.",
  pal:{ sky:"#f2a65a", sky2:"#ffd9a0", ground:"#8a6a48", ink:"#2b1d12", accent:"#e05a2b" } };
var ERA = (G && G.era && G.era()) || ERA0;
var XMAS = ERA.n === 7;
var SAVE = PREFIX + "dunk.tin.v1";
var FONT = '"Space Grotesk",Arial,sans-serif';

/* ---------- the biscuit tin ----------
   rate: how fast it soaks. brk: where on the Sogometer it snaps.
   Shapes are drawn in code; none of these is a real brand. */
var BIS = {
  digestive: { name:"Digestive", note:"The classic", shape:"round", base:"#d9a35e", edge:"#b98443", rate:.30, brk:.92, dots:1 },
  richtea:   { name:"Rich tea", note:"Soaks quickly", shape:"round", base:"#ecca92", edge:"#cfa56b", rate:.44, brk:.88, dots:2, thin:1 },
  oaty:      { name:"Oaty", note:"Tough and chewy", shape:"round", base:"#c58a4a", edge:"#9c6a33", rate:.22, brk:.95, oats:1 },
  chocdig:   { name:"Chocolate digestive", note:"Melty on top", shape:"round", base:"#d9a35e", edge:"#b98443", rate:.26, brk:.92, choc:1 },
  custard:   { name:"Custard cream", note:"Creamy middle", shape:"rect", hw:.66, hh:.92, base:"#f0cf7a", edge:"#cfa94f", rate:.36, brk:.9, cream:1 },
  ginger:    { name:"Ginger nut", note:"Barely softens", shape:"round", base:"#b8672c", edge:"#8c4a1c", rate:.15, brk:.97, cracks:1 },
  jam:       { name:"Jam ring", note:"Leaks jam", shape:"round", base:"#ebc07e", edge:"#c99a55", rate:.34, brk:.9, jam:1 },
  wafer:     { name:"Wafer", note:"Soaks very fast", shape:"rect", hw:.5, hh:1, base:"#f4d9a0", edge:"#d9b878", rate:.56, brk:.86, wafer:1 },
  shortbread:{ name:"Shortbread", note:"Very crumbly", shape:"rect", hw:.46, hh:1, base:"#f3d991", edge:"#d8b866", rate:.27, brk:.9, holes:1, crumbly:1 },
  chocsand:  { name:"Chocolate cream", note:"Splits in two", shape:"round", base:"#5a321b", edge:"#3e2010", rate:.32, brk:.9, sandwich:1 },
  figroll:   { name:"Fig roll", note:"Sturdy", shape:"rect", hw:.56, hh:.95, base:"#d69a4f", edge:"#a8702f", rate:.24, brk:.95, fig:1 },
  rock:      { name:"Stone Age rock", note:"Will not snap. It is a rock.", shape:"rock", base:"#9a958c", edge:"#6f6a62", rate:.14, brk:9, rock:1 },
  star:      { name:"Iced star", note:"Icing washes off", shape:"star", base:"#e7b56a", edge:"#c4904a", rate:.40, brk:.9, iced:1 },
  golden:    { name:"Golden biscuit", note:"Triple tips", shape:"round", base:"#ffd25a", edge:"#d9a520", rate:.30, brk:.92, gold:1 }
};
var DRINKS = {
  tea:     { name:"Tea", note:"Normal soak", mult:1, col:"#a8642f", col2:"#7f4721" },
  hotchoc: { name:"Hot chocolate", note:"Soaks faster", mult:1.22, col:"#7a4428", col2:"#58301b", mallow:1 },
  coffee:  { name:"Coffee", note:"Soaks fastest", mult:1.4, col:"#5a3519", col2:"#3e2410", froth:1 },
  posh:    { name:"Posh tea", note:"Soaks slower", mult:.8, col:"#c8903f", col2:"#a3702a", lemon:1 }
};
var ERA_MUG = { stone:"Stone mug", egypt:"Clay jar", rome:"Bronze goblet", viking:"Drinking horn", victorian:"Fine china", eighties:"Neon mug", future:"Hover mug" };
var MUGS = {
  week:   { name:"This week's mug", note:ERA_MUG[ERA.id] || "Changes weekly" },
  egw:    { name:"EGW mug", note:"Your own mug" },
  saucer: { name:"Cup and saucer", note:"Very fancy" },
  bucket: { name:"The Bucket", note:"Enormous" }
};
var ROOM = {
  bunting:    { name:"Bunting", note:"Party time" },
  rush:       { name:"Rush hour", note:"A packed shift" },
  piano:      { name:"Piano corner", note:"Plays along" },
  chandelier: { name:"Chandelier", note:"Very sparkly" }
};

/* the unlock ladder (sparks since the upgrade) */
var ITEMS = [
  { id:"digestive", k:"b", at:0 }, { id:"richtea", k:"b", at:0 }, { id:"oaty", k:"b", at:0 },
  { id:"chocdig", k:"b", at:0 }, { id:"custard", k:"b", at:0 },
  { id:"tea", k:"d", at:0 }, { id:"week", k:"m", at:0 }, { id:"egw", k:"m", at:0 },
  { id:"ginger", k:"b", at:120 },
  { id:"hotchoc", k:"d", at:250 },
  { id:"jam", k:"b", at:400 },
  { id:"bunting", k:"r", at:550 },
  { id:"wafer", k:"b", at:700 },
  { id:"saucer", k:"m", at:900 },
  { id:"shortbread", k:"b", at:1100 },
  { id:"coffee", k:"d", at:1300 },
  { id:"rush", k:"r", at:1500 },
  { id:"chocsand", k:"b", at:1750 },
  { id:"figroll", k:"b", at:2000 },
  { id:"piano", k:"r", at:2300 },
  { id:"bucket", k:"m", at:2600 },
  { id:"posh", k:"d", at:2900 },
  { id:"rock", k:"b", at:3200 },
  { id:"star", k:"b", at:3500 },
  { id:"chandelier", k:"r", at:3800 },
  { id:"golden", k:"b", at:4000 }
];
function itemName(it){
  var src = it.k === "b" ? BIS : it.k === "d" ? DRINKS : it.k === "m" ? MUGS : ROOM;
  return src[it.id].name;
}
function itemNote(it){
  var src = it.k === "b" ? BIS : it.k === "d" ? DRINKS : it.k === "m" ? MUGS : ROOM;
  return src[it.id].note;
}
function ladder(){
  if(G && G.ladder) return G.ladder(PREFIX, ITEMS);
  var have = ITEMS.filter(function(i){ return !i.at; }), next = null;
  ITEMS.forEach(function(i){ if(i.at && (!next || i.at < next.at)) next = i; });
  return { have: have, next: next, need: next ? next.at : 0, sparks: 0 };
}

var SECRETS = [
  { id:"catch",  name:"Good catch, Bonnie", how:"A snapped half sometimes bounces out. Someone under the table is ready." },
  { id:"jay",    name:"Jay drops in", how:"Now and then Jay pops in for a biscuit and says something very Jay." },
  { id:"bonnie", name:"Table for Bonnie", how:"Every so often a small brown customer orders. She is not fussy." },
  { id:"bird",   name:"Biscuit thief", how:"Sometimes a bird swoops through the window mid delivery." },
  { id:"brows",  name:"Eyebrow steam", how:"Give the teapot five quick taps." },
  { id:"ovation",name:"Standing ovation", how:"Five perfect dunks in a row." }
];
/* test only: ?hqtest&force=jay|bonnie|bird|catch makes that secret happen soon */
var FORCE = (G && G.test) ? ((location.search.match(/[?&]force=(\w+)/) || [])[1] || "") : "";
var JAY_SAYS = ["My ears are not a toilet.", "Unhand me, goblin.", "When I was in China....", "Outrageous.", "In the wise words of my late, great grandfather, stop."];

var TWIST = {
  stone:"Orders come in grunts, and rocks are on the menu.",
  egypt:"A sacred cat watches. Perfect dunks make it purr: +5.",
  rome:"It is raining indoors. The emperor judges by thumb.",
  viking:"Viking portions: every biscuit is enormous. Perfect dunks get a song.",
  victorian:"Dunking is a scandal. Customers gasp, then tip 5 extra.",
  eighties:"Every perfect dunk turns the disco up.",
  future:"Antigravity tea: snapped halves float back up for a little tip."
};

var LEVELS = [
  { name:"Quick dip", lo:.12, hi:.30, tip:15 },
  { name:"Medium soggy", lo:.36, hi:.54, tip:20 },
  { name:"Properly soggy", lo:.58, hi:.75, tip:25 },
  { name:"Right on the edge", edge:1, tip:35 }
];

function loadSave(){
  var o = null;
  try{ o = JSON.parse(localStorage.getItem(SAVE) || "null"); }catch(e){ o = null; }
  if(!o || typeof o !== "object") o = {};
  var d = { v:2, seen:null, secrets:{}, drink:"tea", mug:"week", rush:false, served:0, perfect:0, snapped:0, bestCombo:0, shifts:0 };
  for(var k in d) if(o[k] === undefined) o[k] = d[k];
  if(!o.secrets || typeof o.secrets !== "object") o.secrets = {};
  return o;
}
function putSave(o){ try{ localStorage.setItem(SAVE, JSON.stringify(o)); }catch(e){} }

var ICON = '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="9" y="17" width="18" height="17" rx="3" fill="#ff5d5d"/><path d="M27 21h3a4 4 0 0 1 0 8h-3" fill="none" stroke="#ff5d5d" stroke-width="3"/><rect x="10" y="18" width="16" height="4" fill="#9b5a2a"/><circle cx="19" cy="11" r="8" fill="#d9a35e" stroke="#b98443" stroke-width="2"/><circle cx="16" cy="10" r="1.2" fill="#3a2410"/><circle cx="22" cy="10" r="1.2" fill="#3a2410"/><path d="M16 13q3 2.5 6 0" fill="none" stroke="#3a2410" stroke-width="1.2"/></svg>';

window.HQBreak({
  id: "dunk",
  title: "Dunk",
  prefix: PREFIX,
  icon: ICON,
  theme: { bg: "#11162b", ink: "#eef0ff", card: "#fff6e8", cardInk: "#2a1a10", accent: "#ffd23f", accent2: "#19c39a", font: 'var(--display,"Space Grotesk",Arial,sans-serif)' },
  words: {
    how: "Your tea room is open. Hold to dunk, let go to lift. Get each biscuit into the customer's band on the Sogometer. Too far and it snaps.",
    earn: "Anything counts, even Show me.",
    coolingTitle: "The kettle is reboiling",
    cooling: "Have a crack at something else in the meantime.",
    coolingShort: "Kettle reboiling.",
    done: "Tea room closed for now."
  },
  make: make
});

/* ===================================================================
   shared drawing helpers (take a context so the tin icons reuse them)
   =================================================================== */
function rr(c, x, y, w, h, r){
  r = Math.min(r, w / 2, h / 2);
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
function circle(c, x, y, r){ c.beginPath(); c.arc(x, y, r, 0, 6.2832); }
var ROCK_PTS = [1, .88, .97, .84, 1.02, .9, .95, .86, 1, .92, .87];
function shapePath(c, d, R){
  if(d.shape === "rect"){ rr(c, -d.hw * R, -d.hh * R, d.hw * 2 * R, d.hh * 2 * R, R * .16); return; }
  if(d.shape === "star"){
    c.beginPath();
    for(var i = 0; i < 10; i++){ var a = -Math.PI / 2 + i * Math.PI / 5, r = (i % 2 ? .52 : 1.02) * R; if(i) c.lineTo(Math.cos(a) * r, Math.sin(a) * r); else c.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
    c.closePath(); return;
  }
  if(d.shape === "rock"){
    c.beginPath();
    for(var k = 0; k < ROCK_PTS.length; k++){ var b = k / ROCK_PTS.length * 6.2832, q = ROCK_PTS[k] * R; if(k) c.lineTo(Math.cos(b) * q, Math.sin(b) * q * .92); else c.moveTo(Math.cos(b) * q, Math.sin(b) * q * .92); }
    c.closePath(); return;
  }
  circle(c, 0, 0, R);
}
function halfH(d){ return d.shape === "rect" ? d.hh : 1; }

/* zigzag clip for a snapped half: part 1 = top, 2 = bottom */
function snapClip(c, R, part, d){
  var w = (d.shape === "rect" ? d.hw : 1.1) * R + 4, y0 = R * .08, n = 7;
  c.beginPath();
  if(part === 1){ c.moveTo(-w, -R * 1.4); c.lineTo(w, -R * 1.4); }
  else { c.moveTo(-w, R * 1.4); c.lineTo(w, R * 1.4); }
  for(var i = n; i >= 0; i--){ var x = -w + 2 * w * i / n; c.lineTo(x, y0 + (i % 2 ? R * .1 : -R * .08)); }
  c.closePath(); c.clip();
}

/* a biscuit with a face. mood: happy, wait, worry, sad, shock */
function drawBiscuit(c, d, R, soak, mood, part, t){
  c.save();
  if(part) snapClip(c, R, part, d);
  c.fillStyle = d.edge; shapePath(c, d, R); c.fill();
  c.save(); c.scale(d.thin ? .94 : .88, d.thin ? .94 : .88); c.fillStyle = d.base; shapePath(c, d, R); c.fill(); c.restore();
  c.save(); shapePath(c, d, R); c.clip();
  var i, a;
  if(d.choc){ c.fillStyle = "#5a3418"; c.fillRect(-R, -R, 2 * R, R * .95); c.fillStyle = "rgba(255,255,255,.12)"; c.fillRect(-R * .6, -R * .8, R * .5, R * .12); }
  if(d.dots){
    c.fillStyle = d.choc ? "rgba(0,0,0,.25)" : d.edge;
    var dts = [[-.45,-.3],[.35,-.38],[0,.05],[-.32,.42],[.42,.3],[.05,-.62],[-.6,.1],[.62,-.05]];
    for(i = 0; i < (d.dots === 2 ? 5 : 8); i++){ circle(c, dts[i][0] * R, dts[i][1] * R, R * .045); c.fill(); }
  }
  if(d.oats){
    c.strokeStyle = "#e9c690"; c.lineWidth = Math.max(1.2, R * .045); c.lineCap = "round";
    for(i = 0; i < 12; i++){ a = i * 2.4; var r1 = R * .78 * ((i % 4) + 1) / 4; c.beginPath(); c.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); c.lineTo(Math.cos(a) * r1 + R * .12, Math.sin(a) * r1 + R * .04); c.stroke(); }
  }
  if(d.cream){
    c.fillStyle = "#fff4cf"; c.fillRect(-d.hw * R, -R * .06, d.hw * 2 * R, R * .12);
    c.strokeStyle = d.edge; c.lineWidth = Math.max(1, R * .03);
    rr(c, -d.hw * R * .72, -d.hh * R * .82, d.hw * 1.44 * R, d.hh * 1.64 * R, R * .1); c.stroke();
  }
  if(d.cracks){ c.strokeStyle = "rgba(90,40,10,.7)"; c.lineWidth = Math.max(1, R * .03); c.beginPath(); c.moveTo(-R * .6, -R * .2); c.lineTo(-R * .2, -R * .35); c.moveTo(R * .2, R * .5); c.lineTo(R * .55, R * .3); c.moveTo(R * .1, -R * .7); c.lineTo(R * .3, -R * .5); c.stroke(); }
  if(d.jam){ c.fillStyle = "#c2416b"; circle(c, 0, R * .5, R * .2); c.fill(); c.fillStyle = "rgba(255,255,255,.35)"; circle(c, -R * .06, R * .44, R * .06); c.fill(); }
  if(d.wafer){ c.strokeStyle = d.edge; c.lineWidth = Math.max(1, R * .03); for(i = -4; i <= 4; i++){ c.beginPath(); c.moveTo(i * R * .22, -R); c.lineTo(i * R * .22, R); c.stroke(); c.beginPath(); c.moveTo(-R, i * R * .22); c.lineTo(R, i * R * .22); c.stroke(); } c.fillStyle = "#f8c9d8"; c.fillRect(-d.hw * R, -R * .04, d.hw * 2 * R, R * .08); }
  if(d.holes){ c.fillStyle = d.edge; for(i = 0; i < 3; i++){ circle(c, 0, (-.55 + i * .55) * R, R * .05); c.fill(); } c.fillStyle = "rgba(255,255,255,.6)"; for(i = 0; i < 9; i++){ c.fillRect(((i * 37) % 70 - 35) / 100 * R, ((i * 53) % 180 - 90) / 100 * R, 2, 2); } }
  if(d.sandwich){ c.fillStyle = "#fff1dc"; c.fillRect(-R, -R * .05, 2 * R, R * .1); c.strokeStyle = "rgba(255,255,255,.18)"; c.lineWidth = Math.max(1, R * .04); circle(c, 0, 0, R * .66); c.stroke(); for(i = 0; i < 8; i++){ a = i * .785; c.beginPath(); c.moveTo(Math.cos(a) * R * .3, Math.sin(a) * R * .3); c.lineTo(Math.cos(a) * R * .6, Math.sin(a) * R * .6); c.stroke(); } }
  if(d.fig){ c.fillStyle = "#5b2a3e"; c.fillRect(-d.hw * R * .55, -d.hh * R, d.hw * R * 1.1, R * .14); c.fillRect(-d.hw * R * .55, d.hh * R - R * .14, d.hw * R * 1.1, R * .14); c.strokeStyle = d.edge; c.lineWidth = Math.max(1, R * .03); for(i = -2; i <= 2; i++){ c.beginPath(); c.moveTo(-d.hw * R, i * R * .3); c.quadraticCurveTo(0, i * R * .3 + R * .08, d.hw * R, i * R * .3); c.stroke(); } }
  if(d.rock){ c.fillStyle = "rgba(255,255,255,.18)"; circle(c, -R * .35, -R * .35, R * .22); c.fill(); c.fillStyle = "rgba(0,0,0,.18)"; circle(c, R * .4, R * .3, R * .18); c.fill(); circle(c, -R * .2, R * .55, R * .1); c.fill(); }
  if(d.iced){ c.globalAlpha = Math.max(0, 1 - soak * 1.2); c.fillStyle = "#ffc6de"; c.save(); c.scale(.72, .72); shapePath(c, d, R); c.fill(); c.restore(); var sp = ["#7cf5c9", "#ffd23f", "#8a5cf6", "#fff"]; for(i = 0; i < 10; i++){ c.fillStyle = sp[i % 4]; c.fillRect(Math.cos(i * 2.1) * R * .45 * ((i % 3) + 1) / 3, Math.sin(i * 2.1) * R * .45 * ((i % 3) + 1) / 3, R * .08, R * .04); } c.globalAlpha = 1; }
  if(d.gold){ c.strokeStyle = "rgba(255,255,255,.75)"; c.lineWidth = Math.max(1.5, R * .05); var tw = t || 0; c.beginPath(); c.moveTo(-R * .5, -R * .55); c.lineTo(-R * .2, -R * .75); c.stroke(); for(i = 0; i < 3; i++){ var sx = Math.cos(i * 2.1 + tw) * R * .55, sy = Math.sin(i * 2.1 + tw) * R * .55, ss = R * .08; c.beginPath(); c.moveTo(sx - ss, sy); c.lineTo(sx + ss, sy); c.moveTo(sx, sy - ss); c.lineTo(sx, sy + ss); c.stroke(); } }
  /* soaked part darkens from the bottom up */
  if(soak > 0){
    var hh = halfH(d) * R, h = Math.min(1, soak) * hh * 2 * .95;
    c.fillStyle = d.rock ? "rgba(60,50,40,.35)" : "rgba(85,42,14,.5)";
    c.fillRect(-R * 1.2, hh - h, R * 2.4, h + 2);
    c.fillStyle = "rgba(85,42,14,.25)"; c.fillRect(-R * 1.2, hh - h - R * .06, R * 2.4, R * .06);
  }
  if(soak > .6 && !d.rock){
    c.strokeStyle = "rgba(70,35,10,.75)"; c.lineWidth = Math.max(1, R * .035);
    c.beginPath(); c.moveTo(-R * .75, R * .12); c.lineTo(-R * .3, R * .26); c.lineTo(R * .05, R * .1); c.lineTo(R * .6, R * .28); c.stroke();
  }
  c.restore();
  /* face */
  if(mood) face(c, d, R, mood, part);
  c.restore();
}
function face(c, d, R, mood, part){
  var ex = (d.shape === "rect" ? Math.min(.26, d.hw * .5) : .28) * R, ey = -R * .22, er = Math.max(1.6, R * .07);
  if(part === 2) ey = R * .42;
  var ink = d.sandwich ? "#fff1dc" : "#2b1a0e";
  c.fillStyle = ink; c.strokeStyle = ink; c.lineWidth = Math.max(1.4, R * .05); c.lineCap = "round";
  if(mood === "sad" || mood === "worry"){
    c.beginPath(); c.moveTo(-ex - er, ey - er * 1.6); c.lineTo(-ex + er, ey - er * 2.4); c.moveTo(ex + er, ey - er * 1.6); c.lineTo(ex - er, ey - er * 2.4); c.stroke();
  }
  if(mood === "shock"){ circle(c, -ex, ey, er * 1.3); c.fill(); circle(c, ex, ey, er * 1.3); c.fill(); }
  else { circle(c, -ex, ey, er); c.fill(); circle(c, ex, ey, er); c.fill(); }
  if(part === 1) return;   /* the top half kept the eyes, the bottom half kept the frown */
  var my = ey + R * .26, mw = ex * .8;
  c.beginPath();
  if(mood === "happy"){ c.arc(0, my - mw * .4, mw, .35, Math.PI - .35); }
  else if(mood === "sad"){ c.arc(0, my + mw * .6, mw * .8, Math.PI + .5, -.5); }
  else if(mood === "worry"){ c.moveTo(-mw, my); for(var i = 1; i <= 6; i++) c.lineTo(-mw + i * mw / 3, my + (i % 2 ? -1 : 1) * R * .04); }
  else if(mood === "shock"){ c.ellipse(0, my + R * .04, R * .07, R * .1, 0, 0, 6.2832); }
  else { c.moveTo(-mw * .6, my); c.quadraticCurveTo(0, my + R * .07, mw * .6, my); }
  c.stroke();
  if(mood === "worry"){ c.fillStyle = "#9fd8ff"; c.beginPath(); c.moveTo(ex + R * .3, ey - R * .2); c.quadraticCurveTo(ex + R * .42, ey + R * .02, ex + R * .3, ey + R * .04); c.quadraticCurveTo(ex + R * .18, ey + R * .02, ex + R * .3, ey - R * .2); c.fill(); }
}

/* ---------- vessels: the body drawn twice (back, then a front clip) ---------- */
function vesselKind(mugId){ return mugId === "week" ? ERA.id : mugId; }
function vesselInner(kind, w){ return kind === "rome" ? w * .48 : kind === "viking" ? w * .44 : kind === "saucer" || kind === "victorian" ? w * .47 : w / 2 - w * .05; }
function vesselBody(c, kind, v, front){
  var mx = v.mx, w = v.w, h = v.h, top = v.top, i;
  var bob = v.bob || 0;
  if(kind === "future"){ top += bob; }
  switch(kind){
    case "stone":
      c.fillStyle = "#8f8a82"; c.beginPath();
      var pts = [[-.5,0],[-.47,.3],[-.52,.62],[-.46,1],[.47,1],[.52,.6],[.48,.28],[.5,0]];
      for(i = 0; i < pts.length; i++){ var px = mx + pts[i][0] * w, py = top + pts[i][1] * h; if(i) c.lineTo(px, py); else c.moveTo(px, py); }
      c.closePath(); c.fill();
      c.strokeStyle = "rgba(0,0,0,.2)"; c.lineWidth = 2; c.beginPath(); c.moveTo(mx - w * .3, top + h * .3); c.lineTo(mx - w * .1, top + h * .4); c.moveTo(mx + w * .15, top + h * .6); c.lineTo(mx + w * .35, top + h * .55); c.moveTo(mx - w * .25, top + h * .75); c.lineTo(mx, top + h * .82); c.stroke();
      c.fillStyle = "rgba(255,255,255,.12)"; circle(c, mx - w * .3, top + h * .55, w * .06); c.fill();
      break;
    case "egypt":
      c.fillStyle = "#c86f3c"; c.beginPath(); c.moveTo(mx - w * .5, top);
      c.bezierCurveTo(mx - w * .62, top + h * .45, mx - w * .5, top + h * .9, mx - w * .25, top + h); c.lineTo(mx + w * .25, top + h);
      c.bezierCurveTo(mx + w * .5, top + h * .9, mx + w * .62, top + h * .45, mx + w * .5, top); c.closePath(); c.fill();
      c.fillStyle = "#1fb5a8"; c.fillRect(mx - w * .56, top + h * .3, w * 1.12, h * .08);
      c.fillStyle = "#ffd27a"; c.fillRect(mx - w * .56, top + h * .4, w * 1.12, h * .04);
      c.strokeStyle = "#3b2508"; c.lineWidth = 2.5; c.beginPath(); c.ellipse(mx, top + h * .62, w * .12, w * .06, 0, 0, 6.2832); c.stroke();
      c.fillStyle = "#3b2508"; circle(c, mx, top + h * .62, w * .035); c.fill();
      c.beginPath(); c.moveTo(mx - w * .02, top + h * .68); c.lineTo(mx - w * .04, top + h * .8); c.stroke();
      break;
    case "rome":
      c.fillStyle = "#b8873a";
      c.beginPath(); c.moveTo(mx - w * .48, top); c.bezierCurveTo(mx - w * .48, top + h * .55, mx - w * .15, top + h * .6, mx - w * .06, top + h * .62);
      c.lineTo(mx - w * .05, top + h * .9); c.lineTo(mx - w * .25, top + h); c.lineTo(mx + w * .25, top + h); c.lineTo(mx + w * .05, top + h * .9); c.lineTo(mx + w * .06, top + h * .62);
      c.bezierCurveTo(mx + w * .15, top + h * .6, mx + w * .48, top + h * .55, mx + w * .48, top); c.closePath(); c.fill();
      c.fillStyle = "rgba(255,240,190,.35)"; c.fillRect(mx - w * .32, top + h * .08, w * .06, h * .3);
      c.strokeStyle = "#7d5a22"; c.lineWidth = 3; c.beginPath(); c.moveTo(mx - w * .44, top + h * .2); c.lineTo(mx + w * .44, top + h * .2); c.stroke();
      break;
    case "viking":
      c.fillStyle = "#6b4a2b"; c.fillRect(mx - w * .3, top + h * .82, w * .6, h * .18);
      c.fillStyle = "#efe2c4";
      c.beginPath(); c.moveTo(mx - w * .44, top); c.lineTo(mx + w * .44, top);
      c.bezierCurveTo(mx + w * .4, top + h * .55, mx + w * .1, top + h * .85, mx - w * .5, top + h * .95);
      c.bezierCurveTo(mx - w * .62, top + h * .9, mx - w * .5, top + h * .5, mx - w * .44, top); c.closePath(); c.fill();
      c.fillStyle = "#cdb991"; c.beginPath(); c.moveTo(mx - w * .2, top + h * .78); c.bezierCurveTo(mx, top + h * .7, mx + w * .2, top + h * .55, mx + w * .3, top + h * .4); c.lineTo(mx + w * .36, top + h * .45); c.bezierCurveTo(mx + w * .2, top + h * .7, mx, top + h * .82, mx - w * .2, top + h * .86); c.closePath(); c.fill();
      c.fillStyle = "#c9a646"; c.fillRect(mx - w * .46, top + h * .04, w * .92, h * .1);
      c.fillStyle = "#8f6f22"; for(i = 0; i < 6; i++){ circle(c, mx - w * .38 + i * w * .15, top + h * .09, 2.5); c.fill(); }
      break;
    case "victorian":
    case "saucer":
      var vic = kind === "victorian";
      if(!front){ c.fillStyle = vic ? "#efe4f2" : "#f6f8ff"; c.beginPath(); c.ellipse(mx, top + h * .96, w * .78, h * .12, 0, 0, 6.2832); c.fill(); c.strokeStyle = vic ? "#c9a646" : "#3f66b8"; c.lineWidth = 3; c.stroke(); }
      c.fillStyle = vic ? "#f4ecf6" : "#ffffff";
      c.beginPath(); c.moveTo(mx - w * .48, top); c.bezierCurveTo(mx - w * .46, top + h * .6, mx - w * .3, top + h * .9, mx - w * .2, top + h * .92);
      c.lineTo(mx + w * .2, top + h * .92); c.bezierCurveTo(mx + w * .3, top + h * .9, mx + w * .46, top + h * .6, mx + w * .48, top); c.closePath(); c.fill();
      c.strokeStyle = vic ? "#c9a646" : "#3f66b8"; c.lineWidth = 3; c.beginPath(); c.moveTo(mx - w * .47, top + h * .08); c.lineTo(mx + w * .47, top + h * .08); c.stroke();
      for(i = 0; i < 4; i++){
        var fx = mx - w * .27 + i * w * .18, fy = top + h * .45 + (i % 2) * h * .12;
        c.fillStyle = vic ? "#b77ab8" : "#3f66b8"; for(var p = 0; p < 5; p++){ circle(c, fx + Math.cos(p * 1.26) * w * .03, fy + Math.sin(p * 1.26) * w * .03, w * .025); c.fill(); }
        c.fillStyle = "#e8c45a"; circle(c, fx, fy, w * .018); c.fill();
      }
      break;
    case "eighties":
      c.fillStyle = "#17112e"; rr(c, mx - w / 2, top, w, h, 14); c.fill();
      c.save(); rr(c, mx - w / 2, top, w, h, 14); c.clip();
      c.lineWidth = 6; c.strokeStyle = "#ff4fa3"; c.beginPath(); for(i = 0; i <= 8; i++){ var zx = mx - w / 2 + i * w / 8, zy = top + h * .45 + (i % 2 ? -10 : 10); if(i) c.lineTo(zx, zy); else c.moveTo(zx, zy); } c.stroke();
      c.strokeStyle = "#2de2e6"; c.beginPath(); for(i = 0; i <= 8; i++){ var qx = mx - w / 2 + i * w / 8, qy = top + h * .68 + (i % 2 ? 10 : -10); if(i) c.lineTo(qx, qy); else c.moveTo(qx, qy); } c.stroke();
      c.fillStyle = "#ffd23f"; for(i = 0; i < 5; i++){ c.fillRect(mx - w * .38 + i * w * .19, top + h * .86, 6, 6); }
      c.restore();
      break;
    case "future":
      if(!front){ var gl = c.createRadialGradient(mx, v.top + h + 16, 2, mx, v.top + h + 16, w * .6); gl.addColorStop(0, "rgba(124,245,201,.55)"); gl.addColorStop(1, "rgba(124,245,201,0)"); c.fillStyle = gl; c.beginPath(); c.ellipse(mx, v.top + h + 16, w * .6, 16, 0, 0, 6.2832); c.fill(); }
      var cg = c.createLinearGradient(mx - w / 2, 0, mx + w / 2, 0); cg.addColorStop(0, "#7f93ad"); cg.addColorStop(.35, "#e6eef8"); cg.addColorStop(1, "#6c7e98");
      c.fillStyle = cg; rr(c, mx - w / 2, top, w, h * .9, 22); c.fill();
      c.fillStyle = "#7cf5c9"; c.fillRect(mx - w / 2, top + h * .55, w, 4);
      c.fillStyle = "#06142b"; rr(c, mx - w * .2, top + h * .25, w * .4, h * .2, 6); c.fill();
      c.fillStyle = "#7cf5c9"; c.font = "800 " + Math.round(h * .11) + "px " + FONT; c.textAlign = "center"; c.fillText("TEA", mx, top + h * .4);
      if(XMAS){ c.strokeStyle = "#e8c45a"; c.lineWidth = 5; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(mx - w / 2, top + h * .72); c.quadraticCurveTo(mx, top + h * .82, mx + w / 2, top + h * .72); c.stroke(); c.strokeStyle = "#3fbf6a"; c.lineDashOffset = 3; c.stroke(); c.setLineDash([]); c.lineDashOffset = 0; }
      break;
    case "bucket":
      c.fillStyle = "#f3ead8"; rr(c, mx - w / 2, top, w, h, 20); c.fill();
      c.fillStyle = "#19c39a"; for(i = 0; i < 9; i++){ circle(c, mx - w * .38 + (i % 3) * w * .38, top + h * .3 + Math.floor(i / 3) * h * .22 + (i % 2) * 8, w * .05); c.fill(); }
      c.fillStyle = "#2a1a10"; c.font = "900 " + Math.round(h * .1) + "px " + FONT; c.textAlign = "center"; c.fillText("THE BUCKET", mx, top + h * .2);
      break;
    default: /* egw */
      c.fillStyle = front ? "#e05252" : "#c94848"; rr(c, mx - w / 2, top, w, h, 18); c.fill();
      if(front){ c.fillStyle = "rgba(255,255,255,.12)"; c.fillRect(mx - w / 2 + 14, top + 14, 12, h - 34); }
      c.fillStyle = "#fff6e8"; c.font = "800 " + Math.round(Math.max(12, h * .11)) + "px " + FONT; c.textAlign = "center"; c.fillText("EGW", mx, top + h * .58);
  }
}
function vesselHandle(c, kind, v){
  var mx = v.mx, w = v.w, h = v.h, top = v.top + (kind === "future" ? (v.bob || 0) : 0);
  c.lineCap = "round";
  if(kind === "rome" || kind === "viking" || kind === "egypt") return;
  if(kind === "saucer" || kind === "victorian"){ c.strokeStyle = kind === "victorian" ? "#e6d6ea" : "#e9eefb"; c.lineWidth = Math.max(5, w * .05); c.beginPath(); c.arc(mx + w * .46, top + h * .32, h * .16, -1.4, 1.4); c.stroke(); return; }
  c.strokeStyle = kind === "stone" ? "#7a756d" : kind === "eighties" ? "#2de2e6" : kind === "future" ? "#aebdd0" : kind === "bucket" ? "#e6dac2" : "#ff5d5d";
  c.lineWidth = Math.max(8, w * .06);
  c.beginPath(); c.arc(mx + w / 2 + 4, top + h * .45, h * .24, -1.3, 1.3); c.stroke();
}

/* ---------- people ---------- */
var SKINS = ["#f1c7a5", "#d9a47c", "#b97a52", "#8d5a3b", "#5f3b26", "#f6d3b8"];
var HAIRS = ["#2b1d12", "#5a3a1e", "#a8622a", "#e2c27a", "#7a7a7a", "#141414"];
function drawPerson(c, p, x, y, s, mood, era, t){
  var hy = y - 2.55 * s, i;
  c.save();
  if(p.bonnie){ drawBonnieSeat(c, x, y, s, mood, t); c.restore(); return; }
  var robot = era === "future" && !p.jay;
  var wide = era === "eighties" ? 1.18 : 1;
  /* body */
  c.fillStyle = p.top;
  c.beginPath(); c.moveTo(x - 1.55 * s * wide, y); c.lineTo(x - 1.35 * s * wide, y - 1.15 * s);
  c.quadraticCurveTo(x - 1.25 * s * wide, y - 1.62 * s, x - .7 * s, y - 1.62 * s); c.lineTo(x + .7 * s, y - 1.62 * s);
  c.quadraticCurveTo(x + 1.25 * s * wide, y - 1.62 * s, x + 1.35 * s * wide, y - 1.15 * s); c.lineTo(x + 1.55 * s * wide, y); c.closePath(); c.fill();
  if(!p.jay){
    if(era === "stone"){ c.fillStyle = "rgba(60,30,10,.35)"; for(i = 0; i < 6; i++){ circle(c, x - s + (i % 3) * s, y - 1.1 * s + Math.floor(i / 3) * .6 * s + (i % 2) * 4, s * .14); c.fill(); } c.strokeStyle = "#5a3a1e"; c.lineWidth = s * .18; c.beginPath(); c.moveTo(x - .6 * s, y - 1.6 * s); c.lineTo(x + .8 * s, y); c.stroke(); }
    if(era === "egypt"){ c.lineWidth = s * .18; c.strokeStyle = "#1fb5a8"; c.beginPath(); c.arc(x, y - 1.65 * s, .75 * s, .15, Math.PI - .15); c.stroke(); c.strokeStyle = "#e8b83a"; c.beginPath(); c.arc(x, y - 1.65 * s, 1.0 * s, .2, Math.PI - .2); c.stroke(); }
    if(era === "rome"){ c.fillStyle = p.v % 2 ? "#6b3fa0" : "#2f6fb0"; c.beginPath(); c.moveTo(x - 1.1 * s, y - 1.55 * s); c.lineTo(x - .7 * s, y - 1.62 * s); c.lineTo(x + 1.4 * s, y); c.lineTo(x + .8 * s, y); c.closePath(); c.fill(); }
    if(era === "viking"){ c.fillStyle = "#8a6a48"; for(i = 0; i < 7; i++){ circle(c, x - 1.2 * s + i * .4 * s, y - 1.5 * s + Math.abs(i - 3) * .1 * s, s * .32); c.fill(); } }
    if(era === "victorian"){ if(p.v % 2){ c.fillStyle = "#f6f1ea"; c.fillRect(x - .35 * s, y - 1.65 * s, .7 * s, .5 * s); } else { c.fillStyle = "#f6f1ea"; c.beginPath(); c.moveTo(x - .45 * s, y - 1.62 * s); c.lineTo(x, y - .9 * s); c.lineTo(x + .45 * s, y - 1.62 * s); c.fill(); c.fillStyle = "#6a1f3a"; c.beginPath(); c.moveTo(x - .2 * s, y - 1.5 * s); c.lineTo(x + .2 * s, y - 1.5 * s); c.lineTo(x, y - 1.15 * s); c.fill(); } }
    if(era === "eighties"){ c.fillStyle = p.top2; c.fillRect(x - .25 * s, y - 1.6 * s, .5 * s, 1.6 * s); }
    if(robot){ c.fillStyle = "#06142b"; rr(c, x - .55 * s, y - 1.25 * s, 1.1 * s, .7 * s, 4); c.fill(); c.fillStyle = (Math.floor(t * 2) % 2) ? "#7cf5c9" : "#ffd23f"; circle(c, x - .3 * s, y - .9 * s, s * .1); c.fill(); c.fillStyle = "#7cf5c9"; circle(c, x + .3 * s, y - .9 * s, s * .1); c.fill();
      if(XMAS){ c.strokeStyle = "#e8c45a"; c.lineWidth = s * .28; c.setLineDash([s * .15, s * .12]); c.beginPath(); c.moveTo(x - 1.1 * s, y - 1.45 * s); c.quadraticCurveTo(x, y - 1.1 * s, x + 1.1 * s, y - 1.45 * s); c.stroke(); c.setLineDash([]); } }
  } else {
    c.fillStyle = "#2f6b4c"; c.fillRect(x - .5 * s, y - 1.62 * s, s, .2 * s);
  }
  if(robot){
    /* robot head */
    c.strokeStyle = "#aebdd0"; c.lineWidth = s * .12; c.beginPath(); c.moveTo(x, hy - s); c.lineTo(x, hy - 1.5 * s); c.stroke();
    c.fillStyle = (p.v % 2) ? "#ffd23f" : "#7cf5c9"; circle(c, x, hy - 1.55 * s, s * .2); c.fill();
    var rg = c.createLinearGradient(x - s, 0, x + s, 0); rg.addColorStop(0, "#8b9fb8"); rg.addColorStop(.4, "#e4ecf6"); rg.addColorStop(1, "#7a8ca5");
    c.fillStyle = rg; rr(c, x - 1.05 * s, hy - 1.0 * s, 2.1 * s, 1.9 * s, s * .35); c.fill();
    c.fillStyle = "#06142b"; rr(c, x - .8 * s, hy - .65 * s, 1.6 * s, 1.15 * s, s * .2); c.fill();
    c.fillStyle = "#7cf5c9";
    if(mood === "happy"){ c.lineWidth = s * .14; c.strokeStyle = "#7cf5c9"; c.beginPath(); c.arc(x - .35 * s, hy - .05 * s, s * .16, Math.PI, 0); c.stroke(); c.beginPath(); c.arc(x + .35 * s, hy - .05 * s, s * .16, Math.PI, 0); c.stroke(); }
    else if(mood === "sad"){ c.fillRect(x - .5 * s, hy - .1 * s, .3 * s, s * .1); c.fillRect(x + .2 * s, hy - .1 * s, .3 * s, s * .1); }
    else { circle(c, x - .35 * s, hy - .08 * s, s * .14); c.fill(); circle(c, x + .35 * s, hy - .08 * s, s * .14); c.fill(); }
    c.fillRect(x - .3 * s, hy + .25 * s, .6 * s, s * .08);
    if(XMAS && p.v % 2 === 0) santaHat(c, x, hy - 1.0 * s, s);
    c.restore(); return;
  }
  /* neck and head */
  c.fillStyle = p.skin; c.fillRect(x - .3 * s, y - 1.85 * s, .6 * s, .4 * s);
  var mummy = era === "egypt" && p.v % 3 === 2 && !p.jay;
  circle(c, x, hy, s); c.fillStyle = mummy ? "#efe6d2" : p.skin; c.fill();
  if(mummy){ c.strokeStyle = "rgba(120,100,70,.45)"; c.lineWidth = s * .08; for(i = -3; i <= 3; i++){ c.beginPath(); c.moveTo(x - s, hy + i * s * .28); c.lineTo(x + s, hy + i * s * .28 + s * .15); c.stroke(); } }
  /* hair behind and on top */
  if(p.jay) jayHair(c, x, hy, s);
  else hairFor(c, p, x, hy, s, era);
  /* face */
  var ink = "#24160c";
  c.fillStyle = ink;
  if(mood === "shock"){ circle(c, x - .36 * s, hy - .02 * s, s * .13); c.fill(); circle(c, x + .36 * s, hy - .02 * s, s * .13); c.fill(); }
  else if(mood === "happy" && !mummy){ c.strokeStyle = ink; c.lineWidth = s * .1; c.lineCap = "round"; c.beginPath(); c.arc(x - .36 * s, hy + .02 * s, s * .13, Math.PI + .3, -.3); c.stroke(); c.beginPath(); c.arc(x + .36 * s, hy + .02 * s, s * .13, Math.PI + .3, -.3); c.stroke(); }
  else { circle(c, x - .36 * s, hy - .02 * s, s * .09); c.fill(); circle(c, x + .36 * s, hy - .02 * s, s * .09); c.fill(); }
  if(p.jay){ c.fillStyle = "#3a2210"; c.save(); c.translate(x - .38 * s, hy - .3 * s); c.rotate(mood === "sad" ? .25 : -.12); c.fillRect(-.3 * s, -.09 * s, .6 * s, .2 * s); c.restore(); c.save(); c.translate(x + .38 * s, hy - .3 * s); c.rotate(mood === "sad" ? -.25 : .12); c.fillRect(-.3 * s, -.09 * s, .6 * s, .2 * s); c.restore(); }
  c.strokeStyle = ink; c.lineWidth = s * .1; c.lineCap = "round"; c.beginPath();
  var my = hy + .42 * s;
  if(mood === "happy"){ c.arc(x, my - .18 * s, .3 * s, .4, Math.PI - .4); }
  else if(mood === "sad"){ c.arc(x, my + .2 * s, .22 * s, Math.PI + .6, -.6); }
  else if(mood === "shock" || mood === "gasp"){ c.ellipse(x, my, .12 * s, .16 * s, 0, 0, 6.2832); }
  else { c.moveTo(x - .18 * s, my); c.lineTo(x + .18 * s, my); }
  c.stroke();
  if(era === "victorian" && p.v % 2 === 0 && !p.jay){ c.fillStyle = p.hair; c.beginPath(); c.moveTo(x, my - .14 * s); c.quadraticCurveTo(x - .45 * s, my - .3 * s, x - .62 * s, my - .02 * s); c.quadraticCurveTo(x - .4 * s, my - .1 * s, x, my - .04 * s); c.quadraticCurveTo(x + .4 * s, my - .1 * s, x + .62 * s, my - .02 * s); c.quadraticCurveTo(x + .45 * s, my - .3 * s, x, my - .14 * s); c.fill(); }
  if(era === "viking" && p.v % 2 === 0 && !p.jay){ c.fillStyle = p.hair; c.beginPath(); c.moveTo(x - .75 * s, hy + .25 * s); c.quadraticCurveTo(x, hy + 1.7 * s, x + .75 * s, hy + .25 * s); c.quadraticCurveTo(x, hy + .7 * s, x - .75 * s, hy + .25 * s); c.fill(); c.fillStyle = "rgba(0,0,0,.18)"; c.fillRect(x - .1 * s, hy + .9 * s, .2 * s, .5 * s); }
  if(era === "eighties" && p.v % 2 === 1 && !p.jay){ c.fillStyle = "#141414"; rr(c, x - .7 * s, hy - .22 * s, .58 * s, .32 * s, 4); c.fill(); rr(c, x + .12 * s, hy - .22 * s, .58 * s, .32 * s, 4); c.fill(); c.fillRect(x - .15 * s, hy - .14 * s, .3 * s, .06 * s); }
  if(p.jay) jayHat(c, x, hy, s, era);
  c.restore();
}
function santaHat(c, x, y, s){
  c.fillStyle = "#d8344f"; c.beginPath(); c.moveTo(x - .9 * s, y); c.quadraticCurveTo(x, y - 1.6 * s, x + 1.1 * s, y - .6 * s); c.lineTo(x + .9 * s, y); c.closePath(); c.fill();
  c.fillStyle = "#fff"; rr(c, x - 1 * s, y - .2 * s, 2 * s, .4 * s, .2 * s); c.fill(); circle(c, x + 1.1 * s, y - .6 * s, .22 * s); c.fill();
}
function hairFor(c, p, x, hy, s, era){
  var i;
  c.fillStyle = p.hair;
  if(era === "stone"){ for(i = 0; i < 9; i++){ circle(c, x - .95 * s + i * .24 * s, hy - .75 * s - (i % 2) * .22 * s, .32 * s); c.fill(); } if(p.v % 3 === 0){ c.fillStyle = "#f3ead8"; rr(c, x - .1 * s, hy - 1.25 * s, 1.0 * s, .16 * s, 3); c.fill(); circle(c, x - .1 * s, hy - 1.24 * s, .12 * s); c.fill(); circle(c, x - .1 * s, hy - 1.1 * s, .12 * s); c.fill(); circle(c, x + .9 * s, hy - 1.24 * s, .12 * s); c.fill(); circle(c, x + .9 * s, hy - 1.1 * s, .12 * s); c.fill(); } return; }
  if(era === "egypt"){
    if(p.v % 3 === 2) return;
    if(p.v % 3 === 0){ c.fillStyle = "#2f6fb0"; c.beginPath(); c.moveTo(x - 1.05 * s, hy - .3 * s); c.quadraticCurveTo(x, hy - 1.55 * s, x + 1.05 * s, hy - .3 * s); c.lineTo(x + 1.25 * s, hy + 1.1 * s); c.lineTo(x + .75 * s, hy + 1.1 * s); c.lineTo(x + .78 * s, hy - .35 * s); c.lineTo(x - .78 * s, hy - .35 * s); c.lineTo(x - .75 * s, hy + 1.1 * s); c.lineTo(x - 1.25 * s, hy + 1.1 * s); c.closePath(); c.fill(); c.strokeStyle = "#e8b83a"; c.lineWidth = s * .1; for(i = 0; i < 3; i++){ c.beginPath(); c.arc(x, hy - .2 * s, (.95 + i * .0) * s - i * .22 * s, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); } return; }
    c.beginPath(); c.moveTo(x - 1.05 * s, hy + .9 * s); c.lineTo(x - 1.05 * s, hy - .3 * s); c.quadraticCurveTo(x, hy - 1.5 * s, x + 1.05 * s, hy - .3 * s); c.lineTo(x + 1.05 * s, hy + .9 * s); c.lineTo(x + .75 * s, hy + .9 * s); c.lineTo(x + .75 * s, hy - .3 * s); c.lineTo(x - .75 * s, hy - .3 * s); c.lineTo(x - .75 * s, hy + .9 * s); c.closePath(); c.fill(); return;
  }
  if(era === "rome"){ c.beginPath(); c.arc(x, hy - .1 * s, s * 1.02, Math.PI * 1.05, Math.PI * 1.95); c.fill(); c.fillStyle = "#4f8a3a"; for(i = 0; i < 9; i++){ var a = Math.PI * 1.08 + i * Math.PI * .1; c.beginPath(); c.ellipse(x + Math.cos(a) * s * 1.02, hy + Math.sin(a) * s * 1.02, s * .2, s * .1, a + 1.2, 0, 6.2832); c.fill(); } return; }
  if(era === "viking"){
    c.beginPath(); c.arc(x, hy, s * 1.05, Math.PI * .9, Math.PI * 2.1); c.fill();
    if(p.v % 2){ c.strokeStyle = p.hair; c.lineWidth = s * .26; c.setLineDash([s * .2, s * .08]); c.beginPath(); c.moveTo(x - .95 * s, hy); c.lineTo(x - 1.0 * s, hy + 1.5 * s); c.moveTo(x + .95 * s, hy); c.lineTo(x + 1.0 * s, hy + 1.5 * s); c.stroke(); c.setLineDash([]); }
    vikingHelmet(c, x, hy, s); return;
  }
  if(era === "victorian"){
    if(p.v % 2 === 0){ c.beginPath(); c.arc(x, hy - .1 * s, s * 1.0, Math.PI * 1.05, Math.PI * 1.95); c.fill(); c.fillStyle = "#1b1612"; c.fillRect(x - .75 * s, hy - 2.1 * s, 1.5 * s, 1.3 * s); c.fillRect(x - 1.15 * s, hy - .9 * s, 2.3 * s, .22 * s); c.fillStyle = "#6a1f3a"; c.fillRect(x - .75 * s, hy - 1.05 * s, 1.5 * s, .2 * s); return; }
    circle(c, x, hy - 1.1 * s, .38 * s); c.fill(); c.beginPath(); c.arc(x, hy - .1 * s, s * 1.0, Math.PI * 1.0, Math.PI * 2.0); c.fill();
    c.strokeStyle = "#cfa6d8"; c.lineWidth = s * .3; c.beginPath(); c.arc(x, hy, s * 1.15, Math.PI * .85, Math.PI * 2.15); c.stroke();
    c.strokeStyle = "#8a5cf6"; c.lineWidth = s * .1; c.beginPath(); c.moveTo(x - 1.1 * s, hy + .3 * s); c.quadraticCurveTo(x, hy + 1.2 * s, x + 1.1 * s, hy + .3 * s); c.stroke(); return;
  }
  if(era === "eighties"){ for(i = 0; i < 14; i++){ var b = Math.PI * .85 + i * Math.PI * 1.3 / 13; circle(c, x + Math.cos(b) * s * 1.15, hy + Math.sin(b) * s * 1.05 - .1 * s, .42 * s); c.fill(); } if(p.v % 3 === 0){ c.strokeStyle = "#ffd23f"; c.lineWidth = s * .14; c.beginPath(); c.arc(x, hy, s * 1.35, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); c.fillStyle = "#ffd23f"; rr(c, x - 1.55 * s, hy - .3 * s, .4 * s, .6 * s, 4); c.fill(); rr(c, x + 1.15 * s, hy - .3 * s, .4 * s, .6 * s, 4); c.fill(); } return; }
  c.beginPath(); c.arc(x, hy - .1 * s, s * 1.02, Math.PI, 0); c.fill();
}
function vikingHelmet(c, x, hy, s){
  c.fillStyle = "#f3ead8";
  c.beginPath(); c.moveTo(x - .85 * s, hy - .6 * s); c.quadraticCurveTo(x - 1.6 * s, hy - .9 * s, x - 1.5 * s, hy - 1.7 * s); c.quadraticCurveTo(x - 1.25 * s, hy - 1.1 * s, x - .7 * s, hy - .95 * s); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(x + .85 * s, hy - .6 * s); c.quadraticCurveTo(x + 1.6 * s, hy - .9 * s, x + 1.5 * s, hy - 1.7 * s); c.quadraticCurveTo(x + 1.25 * s, hy - 1.1 * s, x + .7 * s, hy - .95 * s); c.closePath(); c.fill();
  c.fillStyle = "#9aa3ad"; c.beginPath(); c.arc(x, hy - .35 * s, s * 1.0, Math.PI, 0); c.fill();
  c.fillStyle = "#6f7882"; c.fillRect(x - 1.02 * s, hy - .42 * s, 2.04 * s, .18 * s); c.fillRect(x - .08 * s, hy - 1.3 * s, .16 * s, .9 * s);
}
function jayHair(c, x, hy, s){
  c.fillStyle = "#6b4423";
  c.beginPath(); c.arc(x, hy - .05 * s, s * 1.04, Math.PI * 1.02, Math.PI * 1.98); c.fill();
  var spikes = [[-1.0,-.4,-1.35,-.9],[-.7,-.8,-.95,-1.5],[-.3,-.95,-.4,-1.65],[.1,-1.0,.2,-1.7],[.5,-.9,.75,-1.55],[.85,-.6,1.3,-1.0]];
  for(var i = 0; i < spikes.length; i++){ var k = spikes[i]; c.beginPath(); c.moveTo(x + k[0] * s - .22 * s, hy + k[1] * s + .1 * s); c.lineTo(x + k[2] * s, hy + k[3] * s); c.lineTo(x + k[0] * s + .3 * s, hy + k[1] * s + .1 * s); c.closePath(); c.fill(); }
}
function jayHat(c, x, hy, s, era){
  if(era === "stone"){ c.fillStyle = "#f3ead8"; rr(c, x + .1 * s, hy - 1.55 * s, .9 * s, .16 * s, 3); c.fill(); circle(c, x + .1 * s, hy - 1.53 * s, .12 * s); c.fill(); circle(c, x + 1.0 * s, hy - 1.53 * s, .12 * s); c.fill(); }
  else if(era === "egypt"){ c.fillStyle = "#e8b83a"; c.fillRect(x - 1.0 * s, hy - .78 * s, 2.0 * s, .18 * s); c.fillStyle = "#1fb5a8"; circle(c, x, hy - .7 * s, .14 * s); c.fill(); }
  else if(era === "rome"){ c.fillStyle = "#4f8a3a"; for(var i = 0; i < 9; i++){ var a = Math.PI * 1.08 + i * Math.PI * .1; c.beginPath(); c.ellipse(x + Math.cos(a) * s * 1.05, hy + Math.sin(a) * s * 1.05, s * .2, s * .1, a + 1.2, 0, 6.2832); c.fill(); } }
  else if(era === "viking") vikingHelmet(c, x, hy - .25 * s, s);
  else if(era === "victorian"){ c.fillStyle = "#1b1612"; c.fillRect(x - .7 * s, hy - 2.3 * s, 1.4 * s, 1.35 * s); c.fillRect(x - 1.1 * s, hy - 1.0 * s, 2.2 * s, .22 * s); }
  else if(era === "eighties"){ c.fillStyle = "#141414"; rr(c, x - .72 * s, hy - .5 * s, .6 * s, .3 * s, 4); c.fill(); rr(c, x + .12 * s, hy - .5 * s, .6 * s, .3 * s, 4); c.fill(); }
  else if(era === "future"){ if(XMAS) santaHat(c, x, hy - .85 * s, s); else { c.strokeStyle = "#aebdd0"; c.lineWidth = s * .1; c.beginPath(); c.moveTo(x, hy - 1.3 * s); c.lineTo(x, hy - 1.9 * s); c.stroke(); c.fillStyle = "#7cf5c9"; circle(c, x, hy - 1.95 * s, .16 * s); c.fill(); } }
}

/* Bonnie: a small brown toy poodle with no tail */
function bonnieHead(c, x, y, s, mood){
  var i;
  c.fillStyle = "#7b4a2a";
  /* ears */
  for(i = 0; i < 4; i++){ circle(c, x - .95 * s, y + (-.1 + i * .32) * s, .32 * s); c.fill(); circle(c, x + .95 * s, y + (-.1 + i * .32) * s, .32 * s); c.fill(); }
  c.fillStyle = "#9a5f36";
  circle(c, x, y, .82 * s); c.fill();
  for(i = 0; i < 7; i++){ circle(c, x - .6 * s + i * .2 * s, y - .72 * s - (i % 2) * .1 * s, .26 * s); c.fill(); }
  /* muzzle */
  c.fillStyle = "#b07446"; c.beginPath(); c.ellipse(x, y + .32 * s, .42 * s, .32 * s, 0, 0, 6.2832); c.fill();
  c.fillStyle = "#1a0f08"; c.beginPath(); c.ellipse(x, y + .18 * s, .14 * s, .1 * s, 0, 0, 6.2832); c.fill();
  if(mood === "chomp"){ c.fillStyle = "#3a1a0a"; c.beginPath(); c.ellipse(x, y + .5 * s, .2 * s, .12 * s, 0, 0, 6.2832); c.fill(); }
  else { c.strokeStyle = "#1a0f08"; c.lineWidth = Math.max(1, .07 * s); c.beginPath(); c.moveTo(x - .16 * s, y + .44 * s); c.quadraticCurveTo(x, y + .52 * s, x + .16 * s, y + .44 * s); c.stroke(); }
  if(mood === "happy" || mood === "pant"){ c.fillStyle = "#ff9fb6"; c.beginPath(); c.ellipse(x + .04 * s, y + .58 * s, .1 * s, .16 * s, 0, 0, 6.2832); c.fill(); }
  c.fillStyle = "#1a0f08";
  if(mood === "happy"){ c.strokeStyle = "#1a0f08"; c.lineWidth = .1 * s; c.beginPath(); c.arc(x - .3 * s, y - .12 * s, .1 * s, Math.PI + .3, -.3); c.stroke(); c.beginPath(); c.arc(x + .3 * s, y - .12 * s, .1 * s, Math.PI + .3, -.3); c.stroke(); }
  else { circle(c, x - .3 * s, y - .12 * s, .1 * s); c.fill(); circle(c, x + .3 * s, y - .12 * s, .1 * s); c.fill(); c.fillStyle = "#fff"; circle(c, x - .27 * s, y - .15 * s, .035 * s); c.fill(); circle(c, x + .33 * s, y - .15 * s, .035 * s); c.fill(); }
}
function drawBonnieSeat(c, x, y, s, mood, t){
  /* on a chair, with a napkin, behind the table */
  c.fillStyle = "#6b4a2b"; rr(c, x - 1.1 * s, y - 3.0 * s, 2.2 * s, 2.2 * s, 6); c.fill();
  c.fillStyle = "#8a6a48"; rr(c, x - .9 * s, y - 2.8 * s, 1.8 * s, 1.6 * s, 4); c.fill();
  var wig = (mood === "happy" && !RMG) ? Math.sin(t * 22) * .15 * s : 0;
  c.fillStyle = "#9a5f36"; c.beginPath(); c.ellipse(x + wig, y - .6 * s, .95 * s, .75 * s, 0, 0, 6.2832); c.fill();
  c.fillStyle = "#fff"; c.beginPath(); c.moveTo(x - .55 * s + wig, y - 1.25 * s); c.lineTo(x + .55 * s + wig, y - 1.25 * s); c.lineTo(x + wig, y - .3 * s); c.closePath(); c.fill();
  bonnieHead(c, x + wig * .5, y - 1.9 * s, s * 1.05, mood === "happy" ? "happy" : "pant");
}
var RMG = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

function drawBird(c, x, y, s, flap, era){
  c.save(); c.translate(x, y);
  var up = Math.sin(flap) * .8;
  if(era === "stone"){
    c.fillStyle = "#7a5a8a";
    c.beginPath(); c.moveTo(0, 0); c.lineTo(-1.8 * s, -up * s - .3 * s); c.lineTo(-.4 * s, .3 * s); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(0, 0); c.lineTo(1.8 * s, -up * s - .3 * s); c.lineTo(.4 * s, .3 * s); c.closePath(); c.fill();
    c.beginPath(); c.ellipse(0, 0, .6 * s, .3 * s, 0, 0, 6.2832); c.fill();
    c.beginPath(); c.moveTo(.4 * s, -.1 * s); c.lineTo(1.3 * s, .1 * s); c.lineTo(.4 * s, .15 * s); c.fill();
    c.beginPath(); c.moveTo(.3 * s, -.15 * s); c.lineTo(-.2 * s, -.6 * s); c.lineTo(.1 * s, -.1 * s); c.fill();
    c.fillStyle = "#fff"; circle(c, .45 * s, -.05 * s, .08 * s); c.fill();
    c.restore(); return;
  }
  var body = era === "viking" ? "#f3f3f0" : era === "rome" ? "#8e96a3" : era === "egypt" ? "#f3efe6" : era === "future" ? "#b9c6d8" : era === "eighties" ? "#8e96a3" : "#8a5a35";
  c.fillStyle = body; c.beginPath(); c.ellipse(0, 0, .75 * s, .5 * s, 0, 0, 6.2832); c.fill();
  circle(c, .6 * s, -.3 * s, .34 * s); c.fill();
  if(era === "victorian" || era === "stone"){ c.fillStyle = "#e9823a"; c.beginPath(); c.ellipse(.35 * s, .05 * s, .35 * s, .3 * s, 0, 0, 6.2832); c.fill(); }
  c.fillStyle = era === "egypt" ? "#1d1f26" : era === "future" ? "#7cf5c9" : era === "viking" ? "#9aa3ad" : "#4a3220";
  c.beginPath(); c.moveTo(-.1 * s, -.1 * s); c.lineTo(-.2 * s - .9 * s, -.2 * s - up * s); c.lineTo(.35 * s, -.05 * s); c.closePath(); c.fill();
  c.fillStyle = era === "egypt" ? "#1d1f26" : "#e8b83a";
  c.beginPath(); c.moveTo(.88 * s, -.32 * s);
  if(era === "egypt") c.quadraticCurveTo(1.5 * s, -.2 * s, 1.55 * s, .3 * s); else c.lineTo(1.25 * s, -.22 * s);
  c.lineTo(.88 * s, -.18 * s); c.closePath(); c.fill();
  c.fillStyle = "#111"; circle(c, .68 * s, -.38 * s, .07 * s); c.fill();
  if(era === "eighties"){ c.fillStyle = "#111"; c.fillRect(.45 * s, -.48 * s, .4 * s, .14 * s); }
  if(era === "future"){ c.strokeStyle = "#7cf5c9"; c.lineWidth = 2; c.beginPath(); c.moveTo(.6 * s, -.64 * s); c.lineTo(.6 * s, -.95 * s); c.stroke(); }
  c.restore();
}

function drawTeapot(c, x, y, s, era, jig){
  c.save(); c.translate(x, y); c.rotate(jig);
  var col = era === "stone" ? "#8f8a82" : era === "egypt" ? "#c86f3c" : era === "rome" ? "#b8873a" : era === "viking" ? "#d9a441" : era === "victorian" ? "#f4ecf6" : era === "eighties" ? "#2de2e6" : era === "future" ? "#c9d6e6" : "#19c39a";
  c.fillStyle = col; c.strokeStyle = col; c.lineWidth = s * .22; c.lineCap = "round";
  c.beginPath(); c.moveTo(.75 * s, -.4 * s); c.quadraticCurveTo(1.2 * s, -.5 * s, 1.35 * s, -1.0 * s); c.stroke();
  c.beginPath(); c.arc(-.95 * s, -.55 * s, .38 * s, Math.PI * .5, Math.PI * 1.5); c.stroke();
  c.beginPath(); c.ellipse(0, -.55 * s, .95 * s, .62 * s, 0, 0, 6.2832); c.fill();
  c.fillStyle = "rgba(0,0,0,.18)"; c.fillRect(-.6 * s, -1.12 * s, 1.2 * s, .14 * s);
  c.fillStyle = col; circle(c, 0, -1.22 * s, .16 * s); c.fill();
  c.fillStyle = "rgba(255,255,255,.3)"; c.beginPath(); c.ellipse(-.35 * s, -.75 * s, .18 * s, .1 * s, -.5, 0, 6.2832); c.fill();
  c.restore();
}

/* ===================================================================
   the game
   =================================================================== */
function make(stage, api){
  var RM = !!api.reduced;
  var S = loadSave();
  var L = ladder();
  var HAVE = {};
  L.have.forEach(function(i){ HAVE[i.id] = 1; });
  if(!S.seen){ S.seen = ITEMS.filter(function(i){ return !i.at; }).map(function(i){ return i.id; }); }
  var fresh = L.have.filter(function(i){ return S.seen.indexOf(i.id) < 0; });
  if(!HAVE[S.drink]) S.drink = "tea";
  if(!HAVE[S.mug]) S.mug = "week";
  if(!HAVE.rush) S.rush = false;
  putSave(S);
  function persist(){ putSave(S); }

  var cv = document.createElement("canvas");
  cv.setAttribute("role", "img"); cv.setAttribute("aria-label", "The tea room. Hold to dunk the biscuit, let go to lift it.");
  stage.insertBefore(cv, stage.firstChild);
  var cx = cv.getContext("2d");
  var bgc = document.createElement("canvas"), bgx = bgc.getContext("2d"), bgDirty = true;
  var W = 0, H = 0, DPR = 1, g = {};

  /* ---------- DOM bits: styles, tin button, era banner ---------- */
  var css = document.createElement("style");
  css.textContent =
    ".dk-btn{position:absolute;top:10px;right:10px;z-index:6;display:flex;align-items:center;gap:6px;min-height:44px;padding:6px 12px 6px 8px;border-radius:14px;border:2px solid rgba(255,255,255,.35);background:rgba(20,14,10,.55);color:#fff6e8;font:800 .95rem " + FONT + ";cursor:pointer}" +
    ".dk-btn svg{width:28px;height:28px}" +
    ".dk-btn i{position:absolute;top:-4px;right:-4px;width:14px;height:14px;border-radius:50%;background:#ffd23f;border:2px solid #2a1a10}" +
    ".dk-btn:focus-visible,.dk-panel button:focus-visible,.dk-pop button:focus-visible{outline:3px solid #ffd23f;outline-offset:2px}" +
    ".dk-era{position:absolute;left:10px;right:10px;bottom:10px;z-index:6;padding:10px 14px;border-radius:16px;background:rgba(255,246,232,.96);color:#2a1a10;font:600 .92rem/1.35 var(--body,Verdana,sans-serif);box-shadow:0 6px 0 rgba(0,0,0,.3);border:3px solid #2a1a10;cursor:pointer;transition:opacity .4s}" +
    ".dk-era b{display:block;font:900 1.05rem " + FONT + "}" +
    ".dk-era span{display:block;margin-top:3px;font-weight:700}" +
    ".dk-era.gone{opacity:0;pointer-events:none}" +
    ".dk-panel{position:absolute;inset:0;z-index:8;display:flex;flex-direction:column;background:#2a1a10;color:#fff6e8;font-family:var(--body,Verdana,sans-serif)}" +
    ".dk-panel[hidden],.dk-pop[hidden]{display:none}" +
    ".dk-ph{display:flex;align-items:center;gap:10px;padding:12px 12px 6px}" +
    ".dk-ph h2{flex:1;margin:0;font:900 1.35rem " + FONT + ";color:#ffd23f}" +
    ".dk-x{min-height:44px;padding:6px 14px;border-radius:12px;border:2px solid #fff6e8;background:#fff6e8;color:#2a1a10;font:800 .95rem " + FONT + ";cursor:pointer}" +
    ".dk-tabs{display:flex;gap:6px;padding:4px 12px 8px;overflow-x:auto}" +
    ".dk-tabs button{flex:1 0 auto;min-height:40px;padding:6px 10px;border-radius:12px;border:2px solid rgba(255,246,232,.3);background:transparent;color:#fff6e8;font:800 .9rem " + FONT + ";cursor:pointer}" +
    ".dk-tabs button[aria-selected=true]{background:#ffd23f;color:#2a1a10;border-color:#ffd23f}" +
    ".dk-body{flex:1;overflow-y:auto;padding:4px 12px 16px;-webkit-overflow-scrolling:touch}" +
    ".dk-sub{margin:8px 2px 8px;font:800 .95rem " + FONT + ";color:#ffd9a0}" +
    ".dk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(98px,1fr));gap:8px}" +
    ".dk-tile{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 4px 8px;border-radius:14px;border:2px solid rgba(255,246,232,.16);background:rgba(255,246,232,.06);color:inherit;font:inherit;text-align:center;min-height:128px}" +
    "button.dk-tile{cursor:pointer}" +
    ".dk-tile canvas{width:64px;height:64px}" +
    ".dk-tile b{font:800 .84rem/1.15 " + FONT + "}" +
    ".dk-tile small{font-size:.74rem;opacity:.8;line-height:1.2}" +
    ".dk-tile.on{border-color:#19c39a;background:rgba(25,195,154,.16)}" +
    ".dk-tile.on:after{content:'In use';position:absolute;top:4px;right:4px;font:800 .62rem " + FONT + ";background:#19c39a;color:#06261d;padding:2px 5px;border-radius:6px}" +
    ".dk-tile.lock{opacity:.75}" +
    ".dk-tile.next{border-color:#ffd23f;border-style:dashed;opacity:1}" +
    ".dk-tile.next small{color:#ffd23f;opacity:1;font-weight:700}" +
    ".dk-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:12px 0 0}" +
    ".dk-stats div{padding:8px 10px;border-radius:12px;background:rgba(255,246,232,.08)}" +
    ".dk-stats b{display:block;font:900 1.4rem " + FONT + ";color:#ffd23f}" +
    ".dk-stats span{font-size:.8rem;opacity:.85}" +
    ".dk-tog{display:flex;align-items:center;gap:10px;margin:10px 0 4px;padding:10px 12px;border-radius:14px;background:rgba(255,246,232,.08);border:2px solid rgba(255,246,232,.2);color:inherit;font:800 .95rem " + FONT + ";cursor:pointer;width:100%;text-align:left;min-height:48px}" +
    ".dk-tog i{margin-left:auto;font-style:normal;padding:3px 10px;border-radius:999px;background:rgba(255,246,232,.2)}" +
    ".dk-tog[aria-pressed=true] i{background:#19c39a;color:#06261d}" +
    ".dk-pop{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:9;width:min(90%,360px);padding:18px 16px 14px;border-radius:22px;background:#fff6e8;color:#2a1a10;border:4px solid #2a1a10;box-shadow:0 8px 0 rgba(0,0,0,.35);text-align:center;font-family:var(--body,Verdana,sans-serif)}" +
    ".dk-pop h2{margin:0 0 4px;font:900 1.5rem " + FONT + "}" +
    ".dk-pop p{margin:4px 0 0}" +
    ".dk-pop .dk-grid{margin:10px 0 0;grid-template-columns:repeat(auto-fill,minmax(86px,1fr))}" +
    ".dk-pop .dk-tile{border-color:rgba(42,26,16,.15);background:rgba(42,26,16,.05);min-height:0}" +
    ".dk-pop>button{display:block;width:100%;margin-top:12px;min-height:50px;border-radius:16px;border:3px solid #2a1a10;background:#ffd23f;color:#2a1a10;font:900 1.15rem " + FONT + ";box-shadow:0 5px 0 #2a1a10;cursor:pointer}" +
    "@media (prefers-reduced-motion:reduce){.dk-era{transition:none}}";
  stage.appendChild(css);

  var tinBtn = document.createElement("button");
  tinBtn.type = "button"; tinBtn.className = "dk-btn";
  tinBtn.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="11" width="24" height="16" rx="4" fill="#19c39a"/><rect x="3" y="8" width="26" height="6" rx="3" fill="#7cf5c9"/><circle cx="16" cy="19" r="4" fill="#d9a35e"/></svg><span>Tin</span>';
  tinBtn.setAttribute("aria-label", "Open the biscuit tin, cupboard and secrets");
  stage.appendChild(tinBtn);

  var eraBox = document.createElement("div");
  eraBox.className = "dk-era"; eraBox.setAttribute("role", "status");
  eraBox.innerHTML = "<b>This week: " + ERA.name + "</b>" + ERA.line + "<span>" + TWIST[ERA.id] + "</span>";
  stage.appendChild(eraBox);
  var eraTimer = setTimeout(hideEra, 9000);
  function hideEra(){ eraBox.classList.add("gone"); }
  eraBox.addEventListener("click", hideEra);

  /* ---------- sizes ---------- */
  function size(){
    var r = stage.getBoundingClientRect();
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = Math.max(280, r.width); H = Math.max(380, r.height);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cx.setTransform(DPR, 0, 0, DPR, 0, 0);
    bgc.width = cv.width; bgc.height = cv.height;
    layout(); bgDirty = true;
    if(!live) draw();
  }
  function layout(){
    var kind = vesselKind(S.mug);
    var base = Math.min(W * .5, H * .3, 250);
    g.kind = kind;
    g.big = kind === "bucket" ? 1.16 : 1;
    g.mugW = base * g.big; g.mugH = base * .8 * g.big;
    if(kind === "viking"){ g.mugH = base * .95; }
    g.mx = W * .45;
    g.surf = H * .6;
    g.R = base * .3 * (ERA.id === "viking" ? 1.25 : 1);
    g.hoverY = g.surf - g.R * 2.35;
    g.top = g.surf - 6;
    g.mugBottom = g.top + g.mugH;
    g.tableEdge = Math.min(H - 40, Math.max(g.mugBottom + 22, H * .86));
    g.backY = H * .45;
    g.s = Math.max(15, Math.min(W * .06, H * .045, 30));
    g.custX = Math.max(g.s * 1.8, W * .15);
    g.meterX = W - 30; g.meterY = Math.max(H * .27, 170); g.meterH = g.tableEdge - 24 - g.meterY;
    g.bx = Math.max(W * .3, g.custX + g.s * 1.6); g.by = 62; g.bw = W - 12 - g.bx;
    g.tp = { x: Math.max(28, W * .09), y: g.tableEdge - 10, s: Math.min(W * .06, 30) };
    g.inner = vesselInner(kind, g.mugW);
  }
  window.addEventListener("resize", size);

  /* ---------- state ---------- */
  var live = false, paused = false, holding = false, armed = true, raf = 0, last = 0, t = 0;
  var shift = null, cust = null, leaving = null, bis = null, roundsThisVisit = 0;
  var crumbs = [], ripples = [], coins = [], pops = [], drops = [], halves = [], notes = [], confetti = [];
  var flyer = null, bird = null, catcher = null, toast = null, brows = 0, teapotTaps = [], jig = 0;
  var shownTips = 0, specials = { jay: 0, bonnie: 0, bird: 0 }, snapsThisVisit = 0, bonniePeek = 0, peekT = 14 + Math.random() * 10;
  var dripT = 0, wobbleSaid = false, discoGlow = 0;
  var FLAKES = []; for(var fi = 0; fi < 40; fi++) FLAKES.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + .8, s: Math.random() * .04 + .02 });

  size();
  function drink(){ return DRINKS[S.drink] || DRINKS.tea; }
  function snd(f, d, type, v){ api.beep(f, d || .12, type || "triangle", v || .07); }
  function later(ms, f, d, type, v){ setTimeout(function(){ snd(f, d, type, v); }, ms); }
  function say(text, col, big, x, y){
    x = x == null ? g.mx : x; y = y == null ? g.hoverY - g.R * .2 : y;
    /* keep words inside the stage and stack them so they never sit on top of each other */
    cx.font = "900 " + (big ? 26 : 16) + "px " + FONT;
    var hw = cx.measureText(text).width / 2 + 6;
    x = Math.max(hw + 4, Math.min(W - hw - 4, x));
    for(var k = 0; k < 6; k++){
      var hit = false;
      for(var i = 0; i < pops.length; i++){ var p = pops[i]; if(p.a < 1.2 && Math.abs(p.y - y) < 28 && Math.abs(p.x - x) < hw + p.hw){ hit = true; break; } }
      if(!hit) break; y -= 30;
    }
    pops.push({ text: text, col: col || "#ffd23f", big: big ? 1 : 0, x: x, y: y, a: 0, hw: hw });
  }

  function find(id){
    if(S.secrets[id]) return;
    S.secrets[id] = Date.now(); persist();
    var sec = SECRETS.filter(function(s){ return s.id === id; })[0];
    toast = { text: "Secret found: " + sec.name, a: 0 };
    later(0, 784, .12); later(110, 988, .12); later(220, 1319, .2);
  }

  /* ---------- customers ---------- */
  var TOPS = {
    stone: ["#b07a3f", "#9a6a35", "#c08a4a"], egypt: ["#f2ead8", "#efe3c8"], rome: ["#efe9dc", "#f4efe5"],
    viking: ["#3f5a7a", "#4f6e46", "#6e4a6e"], victorian: ["#1f2a3a", "#7a5a8a", "#3e4a3a"],
    eighties: ["#ff4fa3", "#2de2e6", "#ffd23f", "#8a5cf6"], future: ["#aebdd0", "#c9d6e6"]
  };
  function newLook(){
    var tops = TOPS[ERA.id];
    var v = Math.floor(Math.random() * 6);
    var hair = HAIRS[Math.floor(Math.random() * HAIRS.length)];
    if(ERA.id === "eighties") hair = ["#e2c27a", "#ff7ab8", "#2b1d12", "#a8622a"][v % 4];
    if(ERA.id === "victorian" && v % 2 === 1) tops = ["#b9a3d6", "#a7c2b0"];
    return { v: v, skin: SKINS[Math.floor(Math.random() * SKINS.length)], hair: hair, top: tops[v % tops.length], top2: ["#2de2e6", "#ff4fa3", "#ffd23f"][v % 3] };
  }
  function pool(){
    var p = [];
    ITEMS.forEach(function(i){ if(i.k === "b" && HAVE[i.id] && i.id !== "golden") p.push(i.id); });
    if(ERA.id === "stone" && p.indexOf("rock") < 0) p.push("rock", "rock");
    return p;
  }
  function makeOrder(kind, idx){
    var p = pool(), id = p[Math.floor(Math.random() * p.length)];
    if(HAVE.golden && Math.random() < .12) id = "golden";
    var d = BIS[id], brk = Math.min(1, d.brk), lv;
    if(kind === "bonnie") return { id: id, lvl: -1, lo: .1, hi: Math.min(.92, brk - .04), name: "Any soggy" };
    var r = Math.random(), late = idx >= 2;
    lv = r < .22 ? 0 : r < .55 ? 1 : r < .82 || !late ? 2 : 3;
    if(d.rock && lv === 3) lv = 2;
    var L0 = LEVELS[lv], lo = L0.lo, hi = L0.hi;
    if(L0.edge){ lo = brk - .15; hi = brk - .035; }
    var fast = Math.max(1, Math.min(1.6, d.rate * drink().mult / .3));
    if(fast > 1 && !L0.edge){ var mid0 = (lo + hi) / 2, hw0 = (hi - lo) / 2 * fast; lo = Math.max(.06, mid0 - hw0); hi = mid0 + hw0; }
    hi = Math.min(hi, brk - .035);
    if(hi - lo < .1) lo = hi - .1;
    return { id: id, lvl: lv, lo: lo, hi: hi, name: L0.name };
  }
  function nextCustomer(){
    var idx = shift.called++;
    var kind = "normal";
    if(idx >= 2 && !specials.jay && (FORCE === "jay" || Math.random() < (roundsThisVisit >= 1 ? .1 : .06))) { kind = "jay"; specials.jay = 1; }
    else if(idx >= 1 && !specials.bonnie && (FORCE === "bonnie" || Math.random() < .07)) { kind = "bonnie"; specials.bonnie = 1; }
    var c = { kind: kind, look: kind === "jay" ? { jay: 1, skin: "#f1c7a5", hair: "#6b4423", top: "#3f7d5a", v: 0 } : kind === "bonnie" ? { bonnie: 1 } : newLook(),
      x: -g.s * 3, state: "enter", st: 0, mood: "wait", emote: null, emoteT: 0, order: makeOrder(kind, idx), saying: kind === "jay" ? JAY_SAYS[Math.floor(Math.random() * JAY_SAYS.length)] : null };
    cust = c;
    bis = null;
  }
  function newBiscuit(){
    var d = BIS[cust.order.id];
    bis = { id: cust.order.id, d: d, depth: 0, soak: 0, pop: RM ? 1 : 0, phase: "ready", lifted: false, wet: false, brk: d.brk };
    armed = !holding; dripT = 0; wobbleSaid = false;
    snd(520, .06, "triangle", .04);
  }

  /* ---------- round control ---------- */
  function start(){
    hideEra(); closePanel(true);
    var n = S.rush && HAVE.rush ? 18 : [10, 12, 14][Math.min(2, roundsThisVisit)];
    shift = { n: n, called: 0, done: 0, total: 0, combo: 0, best: 0, perfect: 0, snaps: 0 };
    shownTips = 0; crumbs.length = 0; ripples.length = 0; coins.length = 0; pops.length = 0; drops.length = 0; halves.length = 0; notes.length = 0; confetti.length = 0;
    flyer = null; bird = null; catcher = null; leaving = null; specials.bird = 0;
    holding = false; armed = true; paused = false;
    bgDirty = true;
    nextCustomer();
    live = true; last = 0;
    cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  }
  function endShift(){
    live = false; draw();
    roundsThisVisit++;
    S.shifts++; if(shift.best > S.bestCombo) S.bestCombo = shift.best; persist();
    var line = shift.perfect + " perfect dunk" + (shift.perfect === 1 ? "" : "s") + " from " + shift.n + " customers" + (shift.best >= 2 ? ", best combo x" + comboMult(shift.best) : "") + ". ";
    line += shift.perfect >= shift.n * .7 ? "The tea room is buzzing." : shift.perfect >= shift.n * .4 ? "Lovely shift." : "Every tea room has its soggy days.";
    if(roundsThisVisit < 3 && !S.rush) line += " Next shift is busier.";
    api.roundOver(shift.total, line);
  }
  function comboMult(n){ return [1, 1, 1.5, 2, 2.5, 3][Math.min(5, n)]; }

  function frame(ts){
    var dt = last ? Math.min(.05, (ts - last) / 1000) : 0; last = ts;
    if(!paused){ t += dt; update(dt); }
    draw();
    if(live) raf = requestAnimationFrame(frame);
  }

  /* ---------- update ---------- */
  function update(dt){
    var i;
    jig = jig > 0 ? Math.max(0, jig - dt * 3) : 0;
    if(brows > 0) brows -= dt;
    if(toast){ toast.a += dt; if(toast.a > 2.8) toast = null; }
    if(shownTips < shift.total) shownTips = Math.min(shift.total, shownTips + Math.max(1, (shift.total - shownTips) * dt * 4));
    discoGlow += ((shift.combo || 0) - discoGlow) * dt * 2;
    peekT -= dt; if(peekT < 0){ peekT = 18 + Math.random() * 14; if(!RM && !catcher) bonniePeek = 2.2; }
    if(bonniePeek > 0) bonniePeek -= dt;

    for(i = 0; i < crumbs.length; i++){ var cb = crumbs[i]; cb.vy += (ERA.id === "future" ? -60 : 600) * dt; cb.x += cb.vx * dt; cb.y += cb.vy * dt; cb.life -= dt; }
    prune(crumbs, function(c){ return c.life > 0 && c.y < g.surf + 2 && c.y > -20; });
    for(i = 0; i < ripples.length; i++) ripples[i].a += dt;
    prune(ripples, function(r){ return r.a < 1.3; });
    for(i = 0; i < pops.length; i++){ pops[i].a += dt; pops[i].y -= dt * 22; }
    prune(pops, function(p){ return p.a < 1.6; });
    for(i = 0; i < drops.length; i++){ var dr = drops[i]; dr.vy += 900 * dt; dr.x += dr.vx * dt; dr.y += dr.vy * dt; }
    prune(drops, function(d){ if(d.y > g.surf && d.vy > 0 && d.into){ ripples.push({ x: d.x, a: .4, s: .4 }); return false; } return d.y < H; });
    for(i = 0; i < notes.length; i++){ notes[i].a += dt; notes[i].y -= dt * 40; notes[i].x += Math.sin(notes[i].a * 5) * .6; }
    prune(notes, function(n){ return n.a < 1.8; });
    for(i = 0; i < confetti.length; i++){ var cf = confetti[i]; cf.vy += 260 * dt; cf.x += cf.vx * dt; cf.y += cf.vy * dt; cf.r += cf.vr * dt; }
    prune(confetti, function(c){ return c.y < H + 10; });
    for(i = 0; i < coins.length; i++){ var cn = coins[i]; cn.a += dt / cn.dur; }
    prune(coins, function(c){ if(c.a >= 1){ snd(1200 + Math.random() * 300, .05, "sine", .03); return false; } return true; });
    for(i = 0; i < halves.length; i++) updateHalf(halves[i], dt);
    prune(halves, function(h){ return !h.gone; });

    /* Rome: the roof leaks */
    if(ERA.id === "rome" && live && Math.random() < dt * .5) drops.push({ x: g.mx + (Math.random() - .5) * g.inner, y: -5, vx: 0, vy: 80, into: 1, col: "rgba(170,200,230,.9)" });

    if(catcher) updateCatcher(dt);
    if(flyer) updateFlyer(dt);
    if(bird) updateBird(dt);

    if(leaving){ leaving.st += dt; leaving.x -= dt * W * .9; if(leaving.x < -g.s * 4) leaving = null; }
    if(!cust) return;
    cust.st += dt; if(cust.emoteT > 0) cust.emoteT -= dt; if(cust.gasp > 0) cust.gasp -= dt;
    var stand = g.custX;
    if(cust.state === "enter"){
      var sp = (S.rush && HAVE.rush) ? 1.6 : 1.1;
      cust.x += (stand - cust.x) * Math.min(1, dt * 7 * sp) + dt * 40;
      if(cust.x >= stand - 2){ cust.x = stand; cust.state = "order"; cust.st = 0; newBiscuit(); snd(660, .08, "sine", .05); if(ERA.id === "stone") later(90, 330, .1, "square", .03); if(ERA.id === "future") { later(80, 1400, .05, "square", .03); later(160, 1100, .05, "square", .03); } }
      return;
    }
    if(cust.state === "order" && bis) updateBiscuit(dt);
    if(cust.state === "react"){
      if(cust.st > 1.35 && !flyer && !bird && !catcher){
        shift.done++;
        leaving = cust; leaving.st = 0; cust = null;
        if(shift.called < shift.n) nextCustomer();
        else setTimeoutLive(endShift, 650);
      }
    }
  }
  var pendingEnd = 0;
  function setTimeoutLive(f, ms){ clearTimeout(pendingEnd); pendingEnd = setTimeout(function(){ if(live) f(); }, ms); }

  function updateBiscuit(dt){
    var b = bis, d = b.d;
    if(b.pop < 1){ b.pop = Math.min(1, b.pop + dt * 4); return; }
    if(b.phase !== "ready") return;
    var dunk = holding && armed;
    if(dunk){ b.depth = Math.min(1, b.depth + dt * 1.7); dripT = 0; }
    else b.depth = Math.max(0, b.depth - dt * 2.4);
    var y = bisY(), hh = halfH(d) * g.R;
    var f = Math.max(0, Math.min(1, (y + hh - g.surf) / (2 * hh)));
    if(f > 0){
      if(!b.wet){ b.wet = true; ripples.push({ x: g.mx, a: 0, s: .7 }); snd(300, .06, "sine", .04); }
      b.soak += d.rate * drink().mult * (.3 + f) * dt;
      if(d.rock) b.soak = Math.min(1, b.soak);
      if((d.crumbly && Math.random() < dt * 6) || (b.soak > .66 && Math.random() < dt * b.soak * 9)) crumb(y + hh * .6);
      if(d.jam && b.soak > .3 && Math.random() < dt * 3) drops.push({ x: g.mx + (Math.random() - .5) * g.R * .3, y: y + g.R * .7, vx: 0, vy: 30, into: 1, col: "#c2416b" });
      if(!wobbleSaid && b.soak > b.brk - .09 && b.brk < 2){ wobbleSaid = true; snd(180, .14, "triangle", .04); }
    }
    if(b.soak >= b.brk){ snap(); return; }
    if(!dunk && b.depth === 0 && b.wet){
      if(b.soak < .04){ b.wet = false; return; }
      dripT += dt;
      if(Math.random() < dt * 6) drops.push({ x: g.mx + (Math.random() - .5) * g.R, y: y + hh * .9, vx: 0, vy: 0, into: 1, col: drink().col });
      if(dripT > .34) serve();
    }
  }
  function bisY(){ return g.hoverY + (g.surf + g.R * halfH(bis.d) * .55 - g.hoverY) * bis.depth; }
  function crumb(y){
    crumbs.push({ x: g.mx + (Math.random() - .5) * g.R * 1.3, y: y, vx: (Math.random() - .5) * 50, vy: 10, r: 1.4 + Math.random() * 2.2, life: 2, col: bis ? bis.d.edge : "#b98443" });
  }

  /* ---------- results ---------- */
  function serve(){
    var b = bis, o = cust.order, s = b.soak, tip = 0, res;
    var mid = (o.lo + o.hi) / 2, half = (o.hi - o.lo) / 2;
    if(s >= o.lo && s <= o.hi){
      res = "perfect";
      shift.combo++; shift.perfect++; S.perfect++;
      if(shift.combo > shift.best) shift.best = shift.combo;
      tip = (o.lvl < 0 ? 20 : LEVELS[o.lvl].tip) + Math.round(10 * (1 - Math.abs(s - mid) / half));
      tip = Math.round(tip * comboMult(shift.combo));
      if(ERA.id === "egypt"){ tip += 5; }
    } else if(s >= o.lo - .08 && s <= o.hi + .08){ res = "close"; shift.combo = 0; tip = 8; }
    else { res = "off"; shift.combo = 0; tip = 4; }
    if(b.id === "golden") tip *= 3;
    if(ERA.id === "victorian") tip += 5;
    S.served++; persist();
    shift.total += tip;
    cust.state = "react"; cust.st = 0;
    cust.result = res;
    var label;
    if(res === "perfect"){
      cust.mood = "happy"; cust.emote = ERA.id === "rome" ? "thumb" : "heart"; cust.emoteT = 1.4;
      label = shift.combo >= 2 ? "Perfect! x" + comboMult(shift.combo) : "Perfect!";
      say(label, "#7cf5c9", 1);
      chime(shift.combo);
      if(ERA.id === "egypt") say("Purr +5", "#ffd9a0", 0, W * .78, g.backY - g.s * 2);
      if(ERA.id === "viking"){ say("SKOL!", "#ffd23f", 1, g.custX + g.s * 2.5, g.backY - g.s * 4); for(var k = 0; k < 6; k++) notes.push({ x: g.custX + (Math.random() - .3) * g.s * 4, y: g.backY - g.s * 3, a: -k * .12 }); }
      if(HAVE.piano) for(var q = 0; q < 3; q++) notes.push({ x: W * .86 + q * 6, y: g.backY - 10, a: -q * .2 });
      if(shift.combo >= 5 && !S.secrets.ovation){ find("ovation"); ovation(); }
      else if(shift.combo >= 5 && shift.combo % 5 === 0) ovation();
    } else if(res === "close"){
      cust.mood = "wait"; cust.emote = ERA.id === "rome" ? "thumbside" : "smile"; cust.emoteT = 1.4;
      say(s < o.lo ? "Close: bit more next time" : "Close: bit less next time", "#ffd9a0");
      snd(620, .1); later(90, 700, .1);
    } else {
      cust.mood = "wait"; cust.emote = ERA.id === "rome" ? "thumbside" : "meh"; cust.emoteT = 1.4;
      say(s < o.lo ? "Not quite: they wanted it soggier" : "Not quite: they wanted it firmer", "#ffd9a0");
      snd(440, .12);
    }
    if(ERA.id === "victorian"){ cust.gasp = .9; say("Gasp! +5", "#ffd9a0", 0, g.custX + g.s * 2.2, g.backY - g.s * 4.2); }
    if(cust.kind === "jay") find("jay");
    if(cust.kind === "bonnie") find("bonnie");
    if(tip) spawnCoins(tip);
    /* the biscuit flies over */
    flyer = { d: b.d, soak: s, part: 0, x0: g.mx, y0: g.hoverY, x1: cust.x + g.s * 1.2, y1: g.backY - g.s * 1.1, a: 0, mood: res === "perfect" ? "happy" : "wait" };
    var canBird = specials.bird < 2 && S.served > 2 && (shift.done > 0 || roundsThisVisit > 0);
    if(canBird && (FORCE === "bird" || Math.random() < (S.secrets.bird ? .05 : .09))){ specials.bird++; launchBird(); }
    bis = null;
  }
  function chime(n){
    var base = ERA.id === "eighties" ? [523, 659, 784, 1047, 1319] : [660, 880, 990, 1175, 1320];
    var type = ERA.id === "eighties" ? "square" : "triangle", v = ERA.id === "eighties" ? .035 : .07;
    var k = Math.min(5, Math.max(1, n));
    for(var i = 0; i < k + 1; i++) later(i * 80, base[Math.min(4, i)] * (i >= 5 ? 1.5 : 1), .14, type, v);
  }
  function spawnCoins(tip){
    var n = Math.min(8, 2 + Math.floor(tip / 12));
    for(var i = 0; i < n; i++) coins.push({ x0: cust.x + (Math.random() - .5) * g.s, y0: g.backY - g.s * 2.6, a: -i * .07, dur: .7 + Math.random() * .2 });
  }
  function ovation(){
    say("Standing ovation!", "#ffd23f", 1, W / 2, g.backY - g.s * 4.5);
    later(0, 523, .2); later(120, 659, .2); later(240, 784, .2); later(360, 1047, .3);
    if(!RM) for(var i = 0; i < 40; i++) confetti.push({ x: Math.random() * W, y: -10 - Math.random() * 80, vx: (Math.random() - .5) * 60, vy: Math.random() * 60, r: Math.random() * 6, vr: (Math.random() - .5) * 8, c: ["#ffd23f", "#7cf5c9", "#ff8fb8", "#8a5cf6", "#fff6e8"][i % 5] });
  }

  function snap(){
    var b = bis, y = bisY();
    shift.combo = 0; shift.snaps++; S.snapped++; snapsThisVisit++;
    var tip = ERA.id === "future" ? 5 : 0;
    if(ERA.id === "victorian") tip += 5;
    S.served++; persist();
    shift.total += tip;
    ripples.push({ x: g.mx, a: 0, s: 1.2 }); ripples.push({ x: g.mx, a: -.25, s: 1 });
    for(var k = 0; k < 10; k++) drops.push({ x: g.mx + (Math.random() - .5) * g.R, y: g.surf - 2, vx: (Math.random() - .5) * 160, vy: -200 - Math.random() * 180, into: 1, col: drink().col });
    for(k = 0; k < 10; k++) crumbs.push({ x: g.mx + (Math.random() - .5) * g.R * 1.4, y: y, vx: (Math.random() - .5) * 60, vy: 0, r: 1.5 + Math.random() * 2, life: 2, col: b.d.edge });
    snd(160, .25, "sine", .1); later(120, 110, .3, "sine", .08);
    say("PLOP", "#fff6e8", 1, g.mx, g.surf - g.R * .6);
    var bonnieGo = !b.d.rock && (FORCE === "catch" || Math.random() < .28 || (snapsThisVisit === 3 && !S.secrets.catch)) && ERA.id !== "future";
    var hf = { d: b.d, soak: b.soak, x: g.mx, y: y + g.R * .1, vx: 0, vy: 0, rot: 0, vr: 0, mode: "sink", a: 0 };
    if(b.d.sandwich && !bonnieGo){ halves.push({ d: b.d, soak: b.soak, x: g.mx - g.R * .35, y: y + g.R * .1, vx: 0, vy: 0, rot: -.4, vr: 0, mode: "sink", a: 0 }); hf.x += g.R * .35; hf.rot = .4; }
    if(ERA.id === "future"){ hf.mode = "float"; say("Antigrav refund +5", "#7cf5c9", 0, g.mx, g.hoverY - g.R * 1.4); }
    if(bonnieGo){
      hf.mode = "bonnie";
      var bx = Math.min(W * .78, g.meterX - 40), T = .85, yl = g.tableEdge + 8;
      hf.vx = (bx - hf.x) / T; hf.vy = (yl - hf.y - .5 * 1200 * T * T) / T; hf.vr = 9; hf.tx = bx;
      catcher = { x: bx, a: 0, caught: false, half: hf };
    }
    halves.push(hf);
    /* the customer still gets the top half */
    cust.state = "react"; cust.st = 0; cust.result = "snap"; cust.mood = "shock"; cust.emote = "drop"; cust.emoteT = 1.4;
    flyer = { d: b.d, soak: b.soak, part: 1, x0: g.mx, y0: y, x1: cust.x + g.s * 1.2, y1: g.backY - g.s * 1.1, a: 0, mood: "shock" };
    if(tip) spawnCoins(tip);
    bis = null;
  }
  function updateHalf(h, dt){
    h.a += dt;
    if(h.mode === "sink"){
      h.y += dt * (h.a < .2 ? 140 : 16); h.rot += dt * .3;
      if(Math.random() < dt * 5) ripples.push({ x: h.x + (Math.random() - .5) * 20, a: .5, s: .25 });
      if(h.a > 2.6) h.gone = true;
    } else if(h.mode === "float"){
      if(h.a < .3) h.y += dt * 60; else { h.y -= dt * 120; h.x += Math.sin(h.a * 3) * .8; h.rot += dt; }
      if(h.y < -40) h.gone = true;
    } else if(h.mode === "bonnie"){
      if(!h.caught){ h.vy += 1200 * dt; h.x += h.vx * dt; h.y += h.vy * dt; h.rot += h.vr * dt; if(h.a > .85){ h.caught = true; h.x = h.tx; } }
      if(h.a > 1.2) h.gone = true;
    }
  }
  function updateCatcher(dt){
    catcher.a += dt;
    if(catcher.a > .85 && !catcher.caught){ catcher.caught = true; snd(900, .08, "sine", .05); later(100, 1200, .1, "sine", .05); say("Good girl", "#ffd9a0", 0, catcher.x, g.tableEdge - g.s * 2.2); find("catch"); }
    if(catcher.a > 2.6) catcher = null;
  }
  function updateFlyer(dt){
    flyer.a += dt / .5;
    if(flyer.a >= 1) flyer = null;
  }
  function launchBird(){
    var sx = W + 30, sy = H * .22;
    bird = { x: sx, y: sy, a: 0, got: false, flap: 0 };
    snd(1800, .05, "sine", .03); later(80, 2100, .05, "sine", .03);
  }
  function updateBird(dt){
    bird.a += dt; bird.flap += dt * 18;
    var fx = flyer ? flyer.x0 + (flyer.x1 - flyer.x0) * Math.min(1, flyer.a) : g.mx, fy = flyer ? flyer.y0 + (flyer.y1 - flyer.y0) * Math.min(1, flyer.a) - Math.sin(Math.min(1, flyer.a) * Math.PI) * 40 : g.hoverY;
    if(!bird.got){
      if(flyer) flyer.a = Math.min(flyer.a, .45);   /* hang in the air: here it comes */
      var k = Math.min(1, dt * 6);
      bird.x += (fx - bird.x) * k; bird.y += (fy - g.s * .4 - bird.y) * k;
      if(Math.abs(bird.x - fx) < 14 && Math.abs(bird.y - fy + g.s * .4) < 14){ bird.got = true; bird.carry = flyer ? flyer.d : null; bird.soak = flyer ? flyer.soak : 0; bird.part = flyer ? flyer.part : 0; flyer = null; snd(2200, .06, "sine", .04); if(cust){ cust.emote = "shock"; cust.mood = "shock"; cust.emoteT = 1.2; } say("Oi!", "#ffd9a0", 1, g.custX + g.s * 2.2, g.backY - g.s * 4.2); find("bird"); }
    } else {
      bird.x -= dt * 260; bird.y -= dt * 120;
      if(bird.x < -60 || bird.y < -60) bird = null;
    }
  }

  /* ---------- background (drawn once per size, era or upgrade) ---------- */
  function paintBg(){
    var c = bgx; c.setTransform(DPR, 0, 0, DPR, 0, 0); c.clearRect(0, 0, W, H);
    var e = ERA.id, i, wallA, wallB;
    var walls = { stone:["#5c3f2a", "#7a5538"], egypt:["#e2b86c", "#c9974e"], rome:["#ece5d8", "#d8cfbf"], viking:["#4a301e", "#5e3d26"], victorian:["#35503f", "#2a4033"], eighties:["#2b0b4a", "#1a0730"], future:["#0d1b36", "#0a1428"] };
    wallA = walls[e][0]; wallB = walls[e][1];
    var gr = c.createLinearGradient(0, 0, 0, g.backY); gr.addColorStop(0, wallA); gr.addColorStop(1, wallB);
    c.fillStyle = gr; c.fillRect(0, 0, W, g.backY + 2);
    /* wall texture */
    if(e === "stone"){ c.fillStyle = "rgba(0,0,0,.14)"; for(i = 0; i < 26; i++){ circle(c, (i * 97 % 100) / 100 * W, (i * 61 % 100) / 100 * g.backY, 12 + (i % 5) * 9); c.fill(); }
      var cx0 = W * .3, cy0 = g.backY * .55, u = Math.min(1.2, W / 420);
      c.fillStyle = "rgba(233,198,144,.55)"; c.beginPath(); c.ellipse(cx0 + 40 * u, cy0, 26 * u, 15 * u, 0, 0, 6.2832); c.fill(); circle(c, cx0 + 64 * u, cy0 - 6 * u, 10 * u); c.fill();
      c.fillRect(cx0 + 22 * u, cy0 + 8 * u, 6 * u, 14 * u); c.fillRect(cx0 + 50 * u, cy0 + 8 * u, 6 * u, 14 * u);
      c.strokeStyle = "rgba(233,198,144,.55)"; c.lineWidth = 3 * u; c.lineCap = "round"; c.beginPath(); c.moveTo(cx0 + 72 * u, cy0); c.quadraticCurveTo(cx0 + 76 * u, cy0 + 16 * u, cx0 + 68 * u, cy0 + 20 * u); c.stroke();
      c.beginPath(); circle(c, cx0 - 6 * u, cy0 - 14 * u, 4 * u); c.stroke(); c.beginPath(); c.moveTo(cx0 - 6 * u, cy0 - 10 * u); c.lineTo(cx0 - 6 * u, cy0 + 6 * u); c.lineTo(cx0 - 12 * u, cy0 + 20 * u); c.moveTo(cx0 - 6 * u, cy0 + 6 * u); c.lineTo(cx0, cy0 + 20 * u); c.moveTo(cx0 - 14 * u, cy0 - 4 * u); c.lineTo(cx0 + 8 * u, cy0 - 6 * u); c.moveTo(cx0 + 2 * u, cy0 - 16 * u); c.lineTo(cx0 + 10 * u, cy0 + 4 * u); c.stroke();
      c.fillStyle = "rgba(224,90,43,.45)"; for(i = 0; i < 2; i++){ var hx2 = W * (.12 + i * .62), hy2 = g.backY * (.25 + i * .05); c.beginPath(); c.ellipse(hx2, hy2, 7, 8, 0, 0, 6.2832); c.fill(); for(var fz = 0; fz < 5; fz++){ var fa = -2.3 + fz * .45; c.beginPath(); c.ellipse(hx2 + Math.cos(fa) * 12, hy2 + Math.sin(fa) * 12, 2.4, 5, fa + 1.57, 0, 6.2832); c.fill(); } } }
    if(e === "egypt"){ c.fillStyle = "rgba(59,37,8,.18)"; for(i = 0; i < 9; i++) c.fillRect(0, g.backY * .1 + i * g.backY * .1, W, 1.5);
      c.fillStyle = "#1fb5a8"; c.fillRect(0, g.backY - 18, W, 8); c.fillStyle = "#3b2508";
      for(i = 0; i < 14; i++){ var hx = 20 + i * W / 14, hy = g.backY * .15; c.globalAlpha = .35; if(i % 3 === 0){ c.beginPath(); c.ellipse(hx, hy, 8, 4, 0, 0, 6.2832); c.fill(); } else if(i % 3 === 1){ c.fillRect(hx - 2, hy - 8, 4, 16); } else { c.beginPath(); c.moveTo(hx - 7, hy + 7); c.lineTo(hx, hy - 7); c.lineTo(hx + 7, hy + 7); c.fill(); } c.globalAlpha = 1; } }
    if(e === "rome"){ c.fillStyle = "#f6f2ea"; for(i = 0; i < 2; i++){ var colx = i ? W * .93 : W * .03; c.fillRect(colx - 10, 0, 20, g.backY); c.fillStyle = "rgba(0,0,0,.08)"; for(var f = -1; f <= 1; f++) c.fillRect(colx + f * 6 - 1, 0, 2, g.backY); c.fillStyle = "#f6f2ea"; c.fillRect(colx - 16, g.backY * .06, 32, 10); }
      c.fillStyle = "#b3263a"; c.globalAlpha = .7; c.fillRect(0, g.backY - 22, W, 6); c.globalAlpha = 1; }
    if(e === "viking"){ c.strokeStyle = "rgba(0,0,0,.3)"; c.lineWidth = 2; for(i = 1; i < 10; i++){ c.beginPath(); c.moveTo(i * W / 10, 0); c.lineTo(i * W / 10, g.backY); c.stroke(); }
      var sh = ["#b3263a", "#2f6fb0", "#d9a441"]; for(i = 0; i < 3; i++){ var sx = W * (.3 + i * .12), sy = g.backY * .3; c.fillStyle = sh[i]; circle(c, sx, sy, 16); c.fill(); c.fillStyle = "#c9c9c9"; circle(c, sx, sy, 5); c.fill(); c.strokeStyle = "#5a3b25"; c.lineWidth = 3; circle(c, sx, sy, 16); c.stroke(); } }
    if(e === "victorian"){ c.fillStyle = "rgba(232,196,90,.18)"; for(i = 0; i < 60; i++){ var px = (i % 10) * W / 10 + (Math.floor(i / 10) % 2) * W / 20 + 12, py = Math.floor(i / 10) * g.backY / 6 + 14; c.beginPath(); c.ellipse(px, py, 4, 7, 0, 0, 6.2832); c.fill(); }
      c.fillStyle = "#24362a"; c.fillRect(0, g.backY * .78, W, g.backY * .22); c.fillStyle = "#c9a646"; c.fillRect(0, g.backY * .78, W, 3);
      c.fillStyle = "#6b4a2b"; c.fillRect(W * .3, g.backY * .18, 46, 56); c.fillStyle = "#e9dcc4"; c.fillRect(W * .3 + 6, g.backY * .18 + 6, 34, 44); c.save(); c.translate(W * .3 + 23, g.backY * .18 + 28); drawBiscuit(c, BIS.digestive, 12, 0, "happy", 0, 0); c.restore(); }
    if(e === "eighties"){ c.strokeStyle = "rgba(255,79,163,.35)"; c.lineWidth = 1.5; for(i = 0; i < 12; i++){ c.beginPath(); c.moveTo(0, i * g.backY / 12); c.lineTo(W, i * g.backY / 12); c.stroke(); } c.strokeStyle = "rgba(45,226,230,.3)"; for(i = 0; i < 14; i++){ c.beginPath(); c.moveTo(i * W / 14, 0); c.lineTo(i * W / 14, g.backY); c.stroke(); }
      c.save(); c.shadowColor = "#ff4fa3"; c.shadowBlur = 14; c.strokeStyle = "#ff9fd0"; c.lineWidth = 3; c.font = "900 26px " + FONT; c.textAlign = "center"; c.strokeText("DUNK", W * .36, g.backY * .42); c.restore(); }
    if(e === "future"){ c.strokeStyle = "rgba(124,245,201,.25)"; c.lineWidth = 1.5; for(i = 0; i < 6; i++){ c.beginPath(); c.moveTo(0, g.backY * (.15 + i * .14)); c.lineTo(W * .2, g.backY * (.15 + i * .14)); c.lineTo(W * .25, g.backY * (.2 + i * .14)); c.lineTo(W, g.backY * (.2 + i * .14)); c.stroke(); } }
    /* window */
    var wx = W * .56, wy = g.backY * .5, ww = W * .3, wh = g.backY * .4;
    paintWindow(c, wx, wy, ww, wh, e);
    /* door with a queue peeking in, at the far left */
    var dx = 4, dw = Math.max(40, W * .1), dh = g.backY * .5, dy = g.backY - dh;
    c.fillStyle = e === "stone" ? "#1e130b" : e === "future" ? "#1a2c4a" : e === "eighties" ? "#120424" : "#3a2414";
    if(e === "stone" || e === "rome" || e === "egypt"){ c.beginPath(); c.moveTo(dx, g.backY); c.lineTo(dx, dy + dw / 2); c.arc(dx + dw / 2, dy + dw / 2, dw / 2, Math.PI, 0); c.lineTo(dx + dw, g.backY); c.closePath(); c.fill(); }
    else { c.fillRect(dx, dy, dw, dh); }
    if(e === "eighties"){ c.save(); c.shadowColor = "#2de2e6"; c.shadowBlur = 10; c.strokeStyle = "#2de2e6"; c.lineWidth = 3; c.strokeRect(dx, dy, dw, dh); c.restore(); }
    if(e === "future"){ c.strokeStyle = "#7cf5c9"; c.lineWidth = 2; c.strokeRect(dx, dy, dw, dh); }
    g.door = { x: dx, y: dy, w: dw, h: dh };
    /* upgrades */
    if(HAVE.bunting){ var bc = [ERA.pal.accent, "#ffd23f", "#7cf5c9", "#ff8fb8", "#8a5cf6"]; c.strokeStyle = "rgba(255,255,255,.5)"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, 30); c.quadraticCurveTo(W / 2, 60, W, 30); c.stroke(); for(i = 0; i < 16; i++){ var u = (i + .5) / 16, bxp = u * W, byp = 30 + 4 * 30 * u * (1 - u) * .5 + 30 * 2 * u * (1 - u) * .5; c.fillStyle = bc[i % bc.length]; c.beginPath(); c.moveTo(bxp - 7, byp); c.lineTo(bxp + 7, byp); c.lineTo(bxp, byp + 14); c.closePath(); c.fill(); } }
    if(HAVE.chandelier){ var chx = W * .45, chy = 20; c.strokeStyle = "#e8c45a"; c.lineWidth = 2; c.beginPath(); c.moveTo(chx, 0); c.lineTo(chx, chy); c.stroke(); c.beginPath(); c.ellipse(chx, chy + 6, 26, 7, 0, 0, Math.PI); c.stroke(); for(i = 0; i < 5; i++){ var cxp = chx - 24 + i * 12; c.fillStyle = "#fff6cf"; circle(c, cxp, chy + 8 + (i % 2) * 3, 3); c.fill(); c.fillStyle = "rgba(255,246,207,.25)"; circle(c, cxp, chy + 8, 9); c.fill(); } }
    if(HAVE.piano){ var px0 = W * .78, py0 = g.backY - 46; c.fillStyle = "#2a1a10"; c.fillRect(px0, py0, Math.min(80, W * .2), 46); c.fillStyle = "#fff6e8"; c.fillRect(px0 + 4, py0 + 18, Math.min(80, W * .2) - 8, 10); c.fillStyle = "#2a1a10"; for(i = 0; i < 8; i++) c.fillRect(px0 + 8 + i * (Math.min(80, W * .2) - 12) / 8, py0 + 18, 3, 6); }
    /* table */
    var tcol = { stone:["#9a9286", "#7a7468"], egypt:["#d8a85c", "#b98a4a"], rome:["#e3ddd2", "#c8c0b2"], viking:["#8a5d38", "#6b4528"], victorian:["#f6f0e6", "#e6dccb"], eighties:["#1b8f9a", "#136b74"], future:["#2a4f8f", "#1b3463"] }[e];
    var tg = c.createLinearGradient(0, g.backY, 0, g.tableEdge); tg.addColorStop(0, tcol[0]); tg.addColorStop(1, tcol[1]);
    c.fillStyle = tg; c.fillRect(0, g.backY, W, g.tableEdge - g.backY);
    if(e === "viking" || e === "stone"){ c.strokeStyle = "rgba(0,0,0,.15)"; c.lineWidth = 2; for(i = 1; i < 6; i++){ c.beginPath(); c.moveTo(0, g.backY + i * (g.tableEdge - g.backY) / 6); c.lineTo(W, g.backY + i * (g.tableEdge - g.backY) / 6 + (i % 2) * 4); c.stroke(); } }
    if(e === "rome"){ c.strokeStyle = "rgba(120,110,100,.25)"; c.lineWidth = 1.5; for(i = 0; i < 5; i++){ c.beginPath(); c.moveTo(W * i / 5, g.backY); c.bezierCurveTo(W * i / 5 + 30, g.backY + 40, W * i / 5 - 20, g.tableEdge - 60, W * i / 5 + 40, g.tableEdge); c.stroke(); } }
    if(e === "eighties"){ c.fillStyle = "rgba(255,255,255,.08)"; for(i = 0; i < 30; i++){ c.fillRect((i * 37 % 100) / 100 * W, g.backY + (i * 53 % 100) / 100 * (g.tableEdge - g.backY), 10, 3); } }
    if(e === "future"){ c.strokeStyle = "rgba(124,245,201,.35)"; c.lineWidth = 1; for(i = 0; i < 8; i++){ c.beginPath(); c.moveTo(W * i / 8, g.backY); c.lineTo(W * i / 8 - W * .1, g.tableEdge); c.stroke(); } }
    c.fillStyle = "rgba(0,0,0,.18)"; c.fillRect(0, g.backY, W, 4);
    /* table front and the dark under it */
    c.fillStyle = tcol[1]; c.fillRect(0, g.tableEdge, W, 12);
    c.fillStyle = "rgba(0,0,0,.25)"; c.fillRect(0, g.tableEdge + 8, W, 4);
    c.fillStyle = e === "future" ? "#06101f" : "#1a120c"; c.fillRect(0, g.tableEdge + 12, W, H);
    if(e === "victorian"){ c.fillStyle = "#f6f0e6"; for(i = 0; i < W / 18 + 1; i++){ c.beginPath(); c.arc(i * 18 + 9, g.tableEdge + 12, 9, 0, Math.PI); c.fill(); } }
    if(XMAS){ var tc = ["#e8c45a", "#3fbf6a", "#7cf5c9"]; for(i = 0; i < 3; i++){ c.strokeStyle = tc[i]; c.lineWidth = 4; c.setLineDash([4, 5]); c.lineDashOffset = i * 3; c.beginPath(); c.moveTo(0, 6 + i * 3); for(var z = 0; z <= 8; z++) c.quadraticCurveTo(z * W / 8 - W / 16, 26 + i * 3, z * W / 8, 6 + i * 3); c.stroke(); } c.setLineDash([]); c.lineDashOffset = 0; }
    bgDirty = false;
  }
  function paintWindow(c, x, y, w, h, e){
    c.save();
    var i;
    if(e === "stone"){ c.beginPath(); c.moveTo(x, y + h); c.bezierCurveTo(x - 6, y + h * .3, x + w * .2, y - 6, x + w * .5, y); c.bezierCurveTo(x + w * .85, y - 4, x + w + 6, y + h * .4, x + w, y + h); c.closePath(); }
    else if(e === "rome" || e === "egypt"){ c.beginPath(); c.moveTo(x, y + h); c.lineTo(x, y + w / 2 * .5); c.quadraticCurveTo(x + w / 2, y - w * .15, x + w, y + w / 2 * .5); c.lineTo(x + w, y + h); c.closePath(); }
    else if(e === "future"){ rr(c, x, y, w, h, Math.min(w, h) / 2); }
    else { c.beginPath(); c.rect(x, y, w, h); }
    c.save(); c.clip();
    var sky = { stone:["#f2a65a", "#ffd9a0"], egypt:["#3a7bd5", "#ffd27a"], rome:["#8fa6b8", "#d8dfe4"], viking:["#24364f", "#5d7a99"], victorian:["#6b6259", "#b7a993"], eighties:["#2b0b4a", "#ff4fa3"], future:["#06142b", "#2a4f8f"] }[e];
    var sg = c.createLinearGradient(0, y, 0, y + h); sg.addColorStop(0, sky[0]); sg.addColorStop(1, sky[1]);
    c.fillStyle = sg; c.fillRect(x - 10, y - 20, w + 20, h + 30);
    if(e === "stone"){ c.fillStyle = "#6b4a32"; c.beginPath(); c.moveTo(x + w * .2, y + h); c.lineTo(x + w * .5, y + h * .45); c.lineTo(x + w * .6, y + h * .45); c.lineTo(x + w * .9, y + h); c.fill(); c.fillStyle = "#ff8a3d"; c.beginPath(); c.ellipse(x + w * .55, y + h * .45, w * .06, 4, 0, 0, 6.2832); c.fill(); }
    if(e === "egypt"){ c.fillStyle = "#fff3b0"; circle(c, x + w * .78, y + h * .3, 10); c.fill(); c.fillStyle = "#d8a85c"; c.beginPath(); c.moveTo(x + w * .05, y + h); c.lineTo(x + w * .3, y + h * .45); c.lineTo(x + w * .55, y + h); c.fill(); c.fillStyle = "#c9974e"; c.beginPath(); c.moveTo(x + w * .45, y + h); c.lineTo(x + w * .65, y + h * .6); c.lineTo(x + w * .85, y + h); c.fill(); c.fillStyle = "#e2b65e"; c.fillRect(x, y + h * .9, w, h * .1); }
    if(e === "rome"){ c.fillStyle = "#7c8a5a"; c.fillRect(x, y + h * .7, w, h * .3); c.fillStyle = "#9a9286"; c.beginPath(); c.moveTo(x + w * .4, y + h); c.lineTo(x + w * .49, y + h * .7); c.lineTo(x + w * .51, y + h * .7); c.lineTo(x + w * .6, y + h); c.fill(); c.fillStyle = "#c9d2da"; for(i = 0; i < 3; i++){ circle(c, x + w * (.2 + i * .3), y + h * .2, 12); c.fill(); circle(c, x + w * (.28 + i * .3), y + h * .18, 10); c.fill(); } }
    if(e === "viking"){ c.fillStyle = "#1b2b40"; c.fillRect(x, y + h * .65, w, h * .35); c.fillStyle = "#2a1a10"; c.beginPath(); c.moveTo(x + w * .3, y + h * .66); c.quadraticCurveTo(x + w * .5, y + h * .8, x + w * .7, y + h * .66); c.lineTo(x + w * .75, y + h * .58); c.lineTo(x + w * .68, y + h * .64); c.lineTo(x + w * .32, y + h * .64); c.lineTo(x + w * .25, y + h * .58); c.closePath(); c.fill(); c.fillStyle = "#d9a441"; c.fillRect(x + w * .38, y + h * .3, w * .24, h * .3); c.fillStyle = "#2a1a10"; c.fillRect(x + w * .495, y + h * .25, 2, h * .4); c.fillStyle = "#fff"; for(i = 0; i < 8; i++){ circle(c, x + (i * 37 % 100) / 100 * w, y + (i * 23 % 50) / 100 * h, 1); c.fill(); } }
    if(e === "victorian"){ c.fillStyle = "#4a3f36"; for(i = 0; i < 5; i++){ var bh = h * (.3 + (i % 3) * .12); c.fillRect(x + i * w / 5, y + h - bh, w / 5 - 2, bh); } c.fillStyle = "#3a312a"; c.fillRect(x + w * .15, y + h * .4, 8, 20); c.fillStyle = "rgba(200,195,185,.6)"; for(i = 0; i < 4; i++){ circle(c, x + w * .17 + i * 7, y + h * .35 - i * 9, 6 + i * 2); c.fill(); } }
    if(e === "eighties"){ c.fillStyle = "#151030"; for(i = 0; i < 7; i++){ var eh = h * (.3 + ((i * 7) % 5) * .1); c.fillRect(x + i * w / 7, y + h - eh, w / 7 - 2, eh); c.fillStyle = i % 2 ? "#2de2e6" : "#ffd23f"; for(var j = 0; j < 3; j++) c.fillRect(x + i * w / 7 + 4, y + h - eh + 6 + j * 10, 3, 4); c.fillStyle = "#151030"; } c.fillStyle = "#ffd23f"; c.beginPath(); c.arc(x + w * .5, y + h * .55, w * .16, Math.PI, 0); c.fill(); }
    if(e === "future"){ c.fillStyle = "#fff"; for(i = 0; i < 20; i++){ circle(c, x + (i * 37 % 100) / 100 * w, y + (i * 59 % 100) / 100 * h, (i % 3) * .5 + .5); c.fill(); } c.fillStyle = "#8a5cf6"; circle(c, x + w * .65, y + h * .55, h * .22); c.fill(); c.strokeStyle = "#7cf5c9"; c.lineWidth = 3; c.beginPath(); c.ellipse(x + w * .65, y + h * .55, h * .38, h * .08, -.3, 0, 6.2832); c.stroke(); }
    c.restore();
    /* frame */
    c.lineWidth = 6; c.strokeStyle = e === "stone" ? "#4a3222" : e === "egypt" ? "#8a6a2a" : e === "rome" ? "#f6f2ea" : e === "viking" ? "#2a1a10" : e === "victorian" ? "#6b4a2b" : e === "eighties" ? "#ff4fa3" : "#7cf5c9";
    c.stroke();
    if(e === "victorian" || e === "viking"){ c.lineWidth = 3; c.beginPath(); c.moveTo(x + w / 2, y); c.lineTo(x + w / 2, y + h); c.moveTo(x, y + h / 2); c.lineTo(x + w, y + h / 2); c.stroke(); }
    c.restore();
    g.win = { x: x, y: y, w: w, h: h };
  }

  /* ---------- draw ---------- */
  function draw(){
    if(bgDirty) paintBg();
    var c = cx, e = ERA.id, i;
    c.drawImage(bgc, 0, 0, W, H);
    /* living bits of the room */
    var wn = g.win;
    if(e === "rome" && wn){ c.save(); c.beginPath(); c.rect(wn.x, wn.y, wn.w, wn.h); c.clip(); c.strokeStyle = "rgba(220,230,240,.6)"; c.lineWidth = 1.2; for(i = 0; i < 14; i++){ var rx = wn.x + ((i * 37 + t * 60) % 100) / 100 * wn.w, ry = wn.y + ((i * 53 + t * 260) % 100) / 100 * wn.h; c.beginPath(); c.moveTo(rx, ry); c.lineTo(rx - 3, ry + 10); c.stroke(); } c.restore(); }
    if((e === "stone" || e === "viking") && !RM){ var fl = .5 + .5 * Math.sin(t * 7) * Math.sin(t * 3.1); var fg = c.createRadialGradient(W * .2, g.backY, 4, W * .2, g.backY, W * .5); fg.addColorStop(0, "rgba(255,160,60," + (.16 + fl * .06) + ")"); fg.addColorStop(1, "rgba(255,160,60,0)"); c.fillStyle = fg; c.fillRect(0, 0, W, g.tableEdge); }
    if(e === "eighties"){ var hue = (t * 20) % 360; var dg = c.createRadialGradient(g.mx, g.surf, 10, g.mx, g.surf, W * .7); dg.addColorStop(0, "hsla(" + hue + ",90%,60%," + Math.min(.32, .08 + discoGlow * .05) + ")"); dg.addColorStop(1, "hsla(" + hue + ",90%,60%,0)"); c.fillStyle = dg; c.fillRect(0, 0, W, H); }
    if(e === "future"){ c.fillStyle = "rgba(255,255,255,.75)"; for(i = 0; i < FLAKES.length; i++){ var fk = FLAKES[i], fy = ((fk.y + (RM ? 0 : t * fk.s)) % 1) * H, fx = fk.x * W + (RM ? 0 : Math.sin(t + i) * 6); if(!XMAS && i % 3) continue; circle(c, fx, fy, fk.r); c.fill(); } }
    /* queue at the door */
    if(shift && g.door){ var left = Math.max(0, Math.min(3, shift.n - shift.called)); for(i = 0; i < left; i++){ c.fillStyle = "rgba(0,0,0," + (.45 - i * .1) + ")"; var qx = g.door.x + g.door.w * (.3 + i * .25), qy = g.backY; circle(c, qx, qy - g.s * 1.9, g.s * .55); c.fill(); rr(c, qx - g.s * .7, qy - g.s * 1.3, g.s * 1.4, g.s * 1.3, g.s * .4); c.fill(); } }
    /* Egypt's cat on the far end of the table */
    if(e === "egypt") drawCat(c, Math.min(W * .8, g.meterX - 36), g.backY + 4, g.s * .8);
    /* customers */
    if(leaving) drawPerson(c, leaving.look, leaving.x, g.backY, g.s, leaving.result === "perfect" ? "happy" : "wait", e, t);
    if(cust){ var bobY = (!RM && cust.state === "order") ? Math.sin(t * 2.4) * 1.2 : 0; drawPerson(c, cust.look, cust.x, g.backY + bobY, g.s, cust.gasp > 0 ? "gasp" : cust.mood, e, t); if(cust.emoteT > 0) drawEmote(c, cust.emote, cust.x + g.s * 1.1, g.backY - g.s * 4.1, g.s * .7, cust.emoteT); }
    /* piano and song notes */
    for(i = 0; i < notes.length; i++){ var nt = notes[i]; if(nt.a < 0) continue; c.globalAlpha = Math.max(0, 1 - nt.a / 1.8); c.fillStyle = "#ffd23f"; circle(c, nt.x, nt.y, 4); c.fill(); c.fillRect(nt.x + 3, nt.y - 12, 2, 12); c.fillRect(nt.x + 3, nt.y - 12, 7, 2); c.globalAlpha = 1; }
    /* teapot */
    var tp = g.tp;
    drawTeapot(c, tp.x, tp.y, tp.s, e, RM ? 0 : Math.sin(jig * 18) * jig * .25);
    if(brows > 0){
      var ba = Math.min(1, brows, 3 - brows), lift = (3 - brows) * 10;
      c.globalAlpha = ba * .85; c.fillStyle = "#f4f1ea";
      c.save(); c.translate(tp.x + tp.s * 1.5, tp.y - tp.s * 2.2 - lift);
      c.strokeStyle = "#6b4423"; c.lineWidth = 2;
      c.beginPath(); c.ellipse(-tp.s * .95, 0, tp.s * .9, tp.s * .3, -.25, 0, 6.2832); c.fill(); c.stroke();
      c.beginPath(); c.ellipse(tp.s * .95, 0, tp.s * .9, tp.s * .3, .25, 0, 6.2832); c.fill(); c.stroke();
      c.restore(); c.globalAlpha = 1;
    } else if(!RM){
      c.strokeStyle = "rgba(255,255,255,.2)"; c.lineWidth = 3; c.lineCap = "round"; c.beginPath();
      for(var yy = 0; yy < 30; yy += 5){ var sx2 = tp.x + tp.s * 1.35 + Math.sin(t * 3 + yy * .2) * 3, sy2 = tp.y - tp.s * 1.1 - yy; if(yy) c.lineTo(sx2, sy2); else c.moveTo(sx2, sy2); } c.stroke();
    }
    /* vessel back, drink, ripples */
    var v = { mx: g.mx, w: g.mugW, h: g.mugH, top: g.top, bob: (e === "future" && S.mug === "week" && !RM) ? Math.sin(t * 2) * 3 : 0 };
    var kind = g.kind, dk = drink();
    c.save(); vesselBody(c, kind, v, false); vesselHandle(c, kind, v); c.restore();
    var sy = g.surf + 4 + v.bob, rx = g.inner, ry = Math.max(10, rx * .14);
    c.fillStyle = dk.col2; c.beginPath(); c.ellipse(g.mx, sy, rx, ry, 0, 0, 6.2832); c.fill();
    c.fillStyle = dk.col; c.beginPath(); c.ellipse(g.mx, sy - 2, rx - 8, ry - 4, 0, 0, 6.2832); c.fill();
    if(dk.froth){ c.strokeStyle = "rgba(240,220,190,.75)"; c.lineWidth = 6; c.beginPath(); c.ellipse(g.mx, sy - 1, rx - 10, ry - 4, 0, 0, 6.2832); c.stroke(); }
    if(dk.mallow){ var mc = ["#fff", "#ffd1e3", "#fff"]; for(i = 0; i < 3; i++){ c.fillStyle = mc[i]; rr(c, g.mx - rx * .7 + i * rx * .25 + (RM ? 0 : Math.sin(t + i) * 2), sy - 4 + (i % 2) * 3, 9, 7, 2); c.fill(); } }
    if(dk.lemon){ c.fillStyle = "#ffe36b"; c.beginPath(); c.ellipse(g.mx + rx * .55, sy - 2, 10, 4, 0, 0, 6.2832); c.fill(); c.strokeStyle = "#e8c43a"; c.lineWidth = 1.5; c.stroke(); }
    for(i = 0; i < ripples.length; i++){ var rp = ripples[i]; if(rp.a < 0) continue; var rs = rp.s || 1; c.strokeStyle = "rgba(255,236,200," + Math.max(0, .8 - rp.a / 1.3) + ")"; c.lineWidth = 2; c.beginPath(); c.ellipse(rp.x, sy, Math.min(rx - 4, 8 + rp.a * 70 * rs), Math.min(ry - 2, 2 + rp.a * 8 * rs), 0, 0, 6.2832); c.stroke(); }
    /* sunk and floating halves, then the biscuit itself */
    for(i = 0; i < halves.length; i++){ var hf = halves[i]; if(hf.mode === "bonnie") continue; c.save(); c.translate(hf.x, hf.y); c.rotate(hf.rot); drawBiscuit(c, hf.d, g.R, hf.soak, "sad", 2, t); c.restore(); }
    if(bis){
      var by = bisY(), sc = bis.pop < 1 ? easeBack(bis.pop) : 1;
      var near = bis.soak > bis.brk - .1 && bis.brk < 2;
      var wob = (!RM && near) ? Math.sin(t * 34) * (bis.soak - (bis.brk - .1)) * 22 : 0;
      var o = cust && cust.order;
      var mood = near ? "worry" : (o && bis.soak >= o.lo && bis.soak <= o.hi) ? "happy" : "wait";
      c.save(); c.translate(g.mx + wob, by); c.scale(sc, sc);
      drawBiscuit(c, bis.d, g.R, bis.soak, mood, 0, t);
      c.restore();
      if(holding && armed && bis.depth < .3 && !RM){ c.fillStyle = "rgba(255,255,255,.4)"; c.beginPath(); c.moveTo(g.mx, by - g.R * 1.25); c.lineTo(g.mx - 7, by - g.R * 1.45); c.lineTo(g.mx + 7, by - g.R * 1.45); c.fill(); }
    }
    /* front of the vessel hides what is under the tea */
    c.save(); c.beginPath(); c.rect(0, sy + ry * .55, W, H); c.clip(); vesselBody(c, kind, v, true); c.restore();
    /* steam */
    if(!RM){
      c.strokeStyle = "rgba(255,255,255,.16)"; c.lineWidth = 4; c.lineCap = "round";
      for(var st = -1; st <= 1; st++){ c.beginPath(); for(var y2 = 0; y2 < 60; y2 += 6){ var x2 = g.mx + st * g.inner * .5 + Math.sin(t * 2 + y2 * .08 + st) * 6, yy2 = sy - 14 - y2 - ((t * 18) % 12); if(y2) c.lineTo(x2, yy2); else c.moveTo(x2, yy2); } c.stroke(); }
    }
    /* crumbs and drips */
    for(i = 0; i < crumbs.length; i++){ var cb = crumbs[i]; c.fillStyle = cb.col; circle(c, cb.x, cb.y, cb.r); c.fill(); }
    for(i = 0; i < drops.length; i++){ var dp = drops[i]; c.fillStyle = dp.col; circle(c, dp.x, dp.y, 2.4); c.fill(); }

    drawMeter(c);
    if(cust && cust.state === "order") drawBubble(c);

    /* Bonnie: peeking, or leaping for a snapped half */
    if(catcher) drawCatcher(c);
    else if(bonniePeek > 0){ var pk = Math.min(1, bonniePeek, 2.2 - bonniePeek) * 2; c.save(); c.beginPath(); c.rect(0, g.tableEdge + 12, W, H); c.clip(); bonnieHead(c, W * .2, g.tableEdge + 12 + g.s * 1.4 - Math.min(1, pk) * g.s * 1.1, g.s * .9, "wait"); c.restore(); }
    for(i = 0; i < halves.length; i++){ var hb = halves[i]; if(hb.mode !== "bonnie" || hb.caught) continue; c.save(); c.translate(hb.x, hb.y); c.rotate(hb.rot); drawBiscuit(c, hb.d, g.R * .8, hb.soak, "shock", 2, t); c.restore(); }

    /* biscuit on its way to the customer */
    if(flyer){ var fa = Math.min(1, flyer.a), ex = flyer.x0 + (flyer.x1 - flyer.x0) * fa, ey = flyer.y0 + (flyer.y1 - flyer.y0) * fa - Math.sin(fa * Math.PI) * 40; c.save(); c.translate(ex, ey); c.scale(1 - fa * .45, 1 - fa * .45); drawBiscuit(c, flyer.d, g.R, flyer.soak, flyer.mood, flyer.part, t); c.restore(); }
    if(bird){ drawBird(c, bird.x, bird.y, g.s * 1.3, bird.flap, e); if(bird.got && bird.carry){ c.save(); c.translate(bird.x + g.s * .6, bird.y + g.s * .7); c.scale(.4, .4); drawBiscuit(c, bird.carry, g.R, bird.soak, "shock", bird.part, t); c.restore(); } }
    for(i = 0; i < coins.length; i++){ var cn = coins[i]; if(cn.a < 0) continue; var ca = easeIn(cn.a), cxp = cn.x0 + (34 - cn.x0) * ca, cyp = cn.y0 + (30 - cn.y0) * ca - Math.sin(ca * Math.PI) * 50; c.fillStyle = "#ffd23f"; circle(c, cxp, cyp, 6); c.fill(); c.strokeStyle = "#c9971c"; c.lineWidth = 2; c.stroke(); }
    for(i = 0; i < confetti.length; i++){ var cf = confetti[i]; c.save(); c.translate(cf.x, cf.y); c.rotate(cf.r); c.fillStyle = cf.c; c.fillRect(-4, -2, 8, 4); c.restore(); }
    for(i = 0; i < pops.length; i++){ var pp = pops[i]; c.globalAlpha = Math.max(0, Math.min(1, (1.6 - pp.a) * 2)); var psz = pp.big ? 26 : 16; c.font = "900 " + psz + "px " + FONT; c.textAlign = "center"; c.lineWidth = 5; c.strokeStyle = "rgba(20,12,6,.75)"; c.lineJoin = "round"; c.strokeText(pp.text, pp.x, pp.y); c.fillStyle = pp.col; c.fillText(pp.text, pp.x, pp.y); c.globalAlpha = 1; }

    drawHud(c);
  }
  function easeBack(x){ var s = 1.7; x -= 1; return x * x * ((s + 1) * x + s) + 1; }
  function easeIn(x){ return x * x; }

  function drawCat(c, x, y, s){
    var sw = RM ? 0 : Math.sin(t * 2.2) * .4;
    c.fillStyle = "#1d1a20";
    c.strokeStyle = "#1d1a20"; c.lineWidth = s * .22; c.lineCap = "round"; c.beginPath(); c.moveTo(x + s * .7, y - s * .2); c.quadraticCurveTo(x + s * 1.6, y - s * .4 + sw * s, x + s * 1.3, y - s * 1.4 + sw * s); c.stroke();
    c.beginPath(); c.ellipse(x, y - s * .7, s * .8, s * .75, 0, 0, 6.2832); c.fill();
    circle(c, x - s * .1, y - s * 1.75, s * .55); c.fill();
    c.beginPath(); c.moveTo(x - s * .55, y - s * 2.0); c.lineTo(x - s * .45, y - s * 2.6); c.lineTo(x - s * .15, y - s * 2.2); c.fill();
    c.beginPath(); c.moveTo(x + s * .35, y - s * 2.0); c.lineTo(x + s * .25, y - s * 2.6); c.lineTo(x - s * .05, y - s * 2.2); c.fill();
    c.fillStyle = "#e8b83a"; c.fillRect(x - s * .5, y - s * 1.3, s * .8, s * .14); circle(c, x - s * .1, y - s * 1.1, s * .1); c.fill();
    var purr = cust && cust.result === "perfect" && cust.state === "react";
    c.fillStyle = "#ffd23f";
    if(purr){ c.strokeStyle = "#ffd23f"; c.lineWidth = 1.5; c.beginPath(); c.arc(x - s * .3, y - s * 1.75, s * .1, Math.PI, 0); c.stroke(); c.beginPath(); c.arc(x + s * .1, y - s * 1.75, s * .1, Math.PI, 0); c.stroke(); }
    else { c.beginPath(); c.ellipse(x - s * .3, y - s * 1.78, s * .1, s * .14, 0, 0, 6.2832); c.fill(); c.beginPath(); c.ellipse(x + s * .1, y - s * 1.78, s * .1, s * .14, 0, 0, 6.2832); c.fill(); }
  }
  function drawEmote(c, kind, x, y, s, life){
    var a = Math.min(1, life * 3), sc = RM ? 1 : 1 + Math.max(0, life - 1.2) * 1.5;
    c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(sc, sc);
    c.fillStyle = "#fff6e8"; circle(c, 0, 0, s); c.fill(); c.strokeStyle = "#2a1a10"; c.lineWidth = 2; c.stroke();
    c.lineWidth = s * .14; c.lineCap = "round";
    if(kind === "heart"){ c.fillStyle = "#ff8fb8"; c.beginPath(); c.moveTo(0, s * .5); c.bezierCurveTo(-s * .9, -s * .1, -s * .4, -s * .75, 0, -s * .25); c.bezierCurveTo(s * .4, -s * .75, s * .9, -s * .1, 0, s * .5); c.fill(); }
    else if(kind === "smile"){ c.strokeStyle = "#e09a2b"; c.beginPath(); c.arc(0, -s * .05, s * .45, .4, Math.PI - .4); c.stroke(); c.fillStyle = "#e09a2b"; circle(c, -s * .25, -s * .25, s * .09); c.fill(); circle(c, s * .25, -s * .25, s * .09); c.fill(); }
    else if(kind === "meh"){ c.strokeStyle = "#b07a3f"; c.beginPath(); c.moveTo(-s * .35, s * .2); c.lineTo(s * .35, s * .1); c.stroke(); c.fillStyle = "#b07a3f"; circle(c, -s * .25, -s * .2, s * .09); c.fill(); circle(c, s * .25, -s * .2, s * .09); c.fill(); }
    else if(kind === "drop" || kind === "shock"){ c.fillStyle = "#e09a2b"; c.font = "900 " + Math.round(s * 1.3) + "px " + FONT; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(kind === "drop" ? "!?" : "!", 0, s * .08); c.textBaseline = "alphabetic"; }
    else if(kind === "thumb" || kind === "thumbside"){ c.rotate(kind === "thumb" ? 0 : Math.PI / 2); c.fillStyle = "#e9b98f"; rr(c, -s * .35, -s * .05, s * .7, s * .55, s * .12); c.fill(); rr(c, -s * .12, -s * .65, s * .26, s * .7, s * .12); c.fill(); }
    c.restore();
  }
  function drawCatcher(c){
    var a = catcher.a, x = catcher.x, base = g.tableEdge + 12;
    var up = a < .55 ? 0 : a < .85 ? (a - .55) / .3 : a < 1.9 ? 1 : Math.max(0, 1 - (a - 1.9) / .6);
    var y = base + g.s * 2 - up * g.s * 2.9;
    c.save(); c.beginPath(); c.rect(0, 0, W, H); c.clip();
    var wig = (!RM && a > 1 && a < 1.9) ? Math.sin(a * 30) * g.s * .12 : 0;
    c.fillStyle = "#9a5f36"; c.beginPath(); c.ellipse(x + wig, y + g.s * 1.2, g.s * .9, g.s * .8, 0, 0, 6.2832); c.fill();
    bonnieHead(c, x, y, g.s, catcher.caught ? "chomp" : "pant");
    if(catcher.caught && a < 1.9){ c.save(); c.translate(x, y + g.s * .55); c.scale(.42, .42); drawBiscuit(c, catcher.half.d, g.R, catcher.half.soak, "shock", 2, t); c.restore(); }
    c.restore();
  }
  function drawMeter(c){
    var x = g.meterX, y = g.meterY, h = g.meterH, w = 18;
    c.fillStyle = "rgba(20,12,6,.55)"; rr(c, x - 3, y - 3, w + 6, h + 6, 12); c.fill();
    c.fillStyle = "rgba(255,246,232,.12)"; rr(c, x, y, w, h, 9); c.fill();
    var o = cust && cust.order, b = bis;
    var brk = b ? b.brk : (o ? Math.min(1, BIS[o.id].brk) : 1);
    if(brk < 1){ var by = y + h * (1 - brk); c.save(); rr(c, x, y, w, h, 9); c.clip(); c.fillStyle = "rgba(224,154,43,.35)"; c.fillRect(x, y, w, by - y); c.strokeStyle = "rgba(224,154,43,.75)"; c.lineWidth = 2; for(var k = -2; k < (by - y) / 8 + 2; k++){ c.beginPath(); c.moveTo(x, y + k * 8); c.lineTo(x + w, y + k * 8 - 8); c.stroke(); } c.restore(); }
    if(o && cust.state === "order"){
      var y1 = y + h * (1 - o.hi), y2 = y + h * (1 - o.lo);
      var on = b && b.soak >= o.lo && b.soak <= o.hi;
      c.fillStyle = on ? "rgba(124,245,201,.85)" : "rgba(124,245,201,.45)"; c.fillRect(x, y1, w, y2 - y1);
      c.strokeStyle = "#7cf5c9"; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 8, y1); c.lineTo(x - 2, y1); c.lineTo(x - 2, y2); c.lineTo(x - 8, y2); c.stroke();
    }
    var lv = b ? Math.min(1, b.soak) : 0;
    if(lv > 0){ var gfill = c.createLinearGradient(0, y + h, 0, y); gfill.addColorStop(0, "#f0cf7a"); gfill.addColorStop(1, "#7a4220"); c.fillStyle = gfill; c.save(); rr(c, x, y, w, h, 9); c.clip(); c.fillRect(x + 4, y + h * (1 - lv), w - 8, h * lv); c.restore(); }
    var py = y + h * (1 - lv);
    c.fillStyle = "#fff6e8"; c.beginPath(); c.moveTo(x - 10, py - 7); c.lineTo(x - 1, py); c.lineTo(x - 10, py + 7); c.closePath(); c.fill();
    c.save(); c.translate(x + w / 2, y + h + 16); c.fillStyle = "rgba(255,246,232,.8)"; c.font = "800 10px " + FONT; c.textAlign = "center"; c.fillText("SOG", 0, 0); c.restore();
  }
  function wrap(c, text, maxW){
    var words = text.split(" "), lines = [], cur = "";
    for(var i = 0; i < words.length; i++){ var tst = cur ? cur + " " + words[i] : words[i]; if(c.measureText(tst).width > maxW && cur){ lines.push(cur); cur = words[i]; } else cur = tst; }
    if(cur) lines.push(cur);
    return lines;
  }
  function drawBubble(c){
    var o = cust.order, d = BIS[o.id];
    var x = g.bx, y = g.by, w = g.bw, ic = Math.min(26, w * .11), tx = x + ic * 2 + 16, tw = x + w - 12 - tx;
    var top = cust.kind === "bonnie" ? "Woof." : cust.kind === "jay" ? cust.saying : ERA.id === "stone" ? "Ug. Ug ug." : ERA.id === "future" ? "BEEP. " + d.name + ", please." : d.name + ", please.";
    var second = cust.kind === "bonnie" ? "Any soggy level. She is not fussy." : cust.kind === "jay" ? o.name + " " + d.name.toLowerCase() + ", please." : ERA.id === "stone" ? "(" + o.name.toLowerCase() + " " + d.name.toLowerCase() + ")" : o.name;
    c.font = "800 15px " + FONT; var l1 = wrap(c, top, tw);
    c.font = "700 13px " + FONT; var l2 = wrap(c, second, tw);
    var h = Math.max(ic * 2 + 18, 14 + l1.length * 18 + l2.length * 16 + 22);
    var pop = Math.min(1, cust.st * 5);
    c.save(); c.globalAlpha = pop;
    c.fillStyle = "#fff8ec"; rr(c, x, y, w, h, 16); c.fill();
    c.beginPath(); c.moveTo(x + 18, y + h - 2); c.lineTo(cust.x + g.s * .6, g.backY - g.s * 3.7); c.lineTo(x + 40, y + h - 2); c.closePath(); c.fill();
    c.strokeStyle = "#2a1a10"; c.lineWidth = 2.5; rr(c, x, y, w, h, 16); c.stroke();
    c.save(); c.translate(x + 10 + ic, y + 10 + ic); if(cust.kind === "bonnie") pawPrint(c, ic); else drawBiscuit(c, d, ic * (d.shape === "rect" ? 1.0 : .95), 0, "happy", 0, t); c.restore();
    c.textAlign = "left"; c.fillStyle = "#2a1a10";
    c.font = "800 15px " + FONT; var yy = y + 24; for(var i = 0; i < l1.length; i++){ c.fillText(l1[i], tx, yy); yy += 18; }
    c.font = "700 13px " + FONT; c.fillStyle = "#6b4a2b"; for(i = 0; i < l2.length; i++){ c.fillText(l2[i], tx, yy - 2); yy += 16; }
    /* a little picture of the band */
    var bx = tx, by = yy + 2, bw = Math.min(tw, 150);
    c.fillStyle = "rgba(42,26,16,.12)"; rr(c, bx, by, bw, 8, 4); c.fill();
    var brk = Math.min(1, d.brk);
    if(brk < 1){ c.fillStyle = "rgba(224,154,43,.55)"; c.fillRect(bx + bw * brk, by, bw * (1 - brk), 8); }
    c.fillStyle = "#19c39a"; rr(c, bx + bw * o.lo, by - 2, bw * (o.hi - o.lo), 12, 4); c.fill();
    c.restore();
  }
  function pawPrint(c, s){
    c.fillStyle = "#7b4a2a"; c.beginPath(); c.ellipse(0, s * .25, s * .45, s * .38, 0, 0, 6.2832); c.fill();
    var p = [[-.5,-.25],[-.18,-.55],[.18,-.55],[.5,-.25]]; for(var i = 0; i < 4; i++){ circle(c, p[i][0] * s, p[i][1] * s, s * .18); c.fill(); }
  }
  function drawHud(c){
    c.textAlign = "left";
    var tipsText = String(Math.round(shownTips));
    c.fillStyle = "rgba(20,12,6,.55)"; rr(c, 8, 8, Math.max(110, 60 + tipsText.length * 18), 50, 14); c.fill();
    c.fillStyle = "#ffd23f"; circle(c, 30, 33, 11); c.fill(); c.strokeStyle = "#c9971c"; c.lineWidth = 3; c.stroke();
    c.fillStyle = "#c9971c"; c.font = "900 12px " + FONT; c.textAlign = "center"; c.fillText("T", 30, 37);
    c.textAlign = "left"; c.fillStyle = "#fff6e8"; c.font = "900 28px " + FONT; c.fillText(tipsText, 48, 43);
    if(shift){
      var n = shift.n, r = n > 10 ? 3.2 : 4, gap = n > 10 ? 9 : 11;
      for(var i = 0; i < n; i++){ var dx = 14 + i * gap, dy = 68; c.fillStyle = i < shift.done ? "#ffd23f" : "rgba(255,246,232,.25)"; circle(c, dx, dy, r); c.fill(); if(i === shift.done && cust){ c.strokeStyle = "#fff6e8"; c.lineWidth = 1.5; circle(c, dx, dy, r + 2); c.stroke(); } }
      if(shift.combo >= 2){ var label = "Combo x" + comboMult(shift.combo); c.font = "900 14px " + FONT; var lw = c.measureText(label).width + 16; c.fillStyle = "#7cf5c9"; rr(c, 10, 80, lw, 24, 12); c.fill(); c.fillStyle = "#06261d"; c.fillText(label, 18, 97); }
    }
    if(toast){
      var ta = Math.min(1, toast.a * 4, (2.8 - toast.a) * 2);
      c.globalAlpha = ta; c.font = "800 15px " + FONT; var tw2 = c.measureText(toast.text).width + 40;
      var tx2 = (W - tw2) / 2, ty2 = g.tableEdge + 22 + (RM ? 0 : (1 - Math.min(1, toast.a * 4)) * 10);
      c.fillStyle = "#ffd23f"; rr(c, tx2, ty2 - 2, tw2, 32, 16); c.fill(); c.strokeStyle = "#2a1a10"; c.lineWidth = 2.5; c.stroke();
      c.fillStyle = "#2a1a10"; c.textAlign = "center"; c.fillText(toast.text, W / 2 + 8, ty2 + 19);
      starShape(c, tx2 + 16, ty2 + 14, 8); c.fill();
      c.globalAlpha = 1;
    }
    if(live && cust && cust.state === "order" && bis && bis.soak === 0 && shift.done === 0 && roundsThisVisit === 0){
      c.font = "800 16px " + FONT; c.textAlign = "center";
      var hint = "Hold to dunk. Let go to lift.", hw = c.measureText(hint).width + 28;
      c.fillStyle = "rgba(20,12,6,.7)"; rr(c, W / 2 - hw / 2, H - 46, hw, 32, 16); c.fill();
      c.fillStyle = "#fff6e8"; c.fillText(hint, W / 2, H - 25);
    }
  }
  function starShape(c, x, y, r){ c.beginPath(); for(var i = 0; i < 10; i++){ var a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * .45 : r; if(i) c.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); else c.moveTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } c.closePath(); }
  function prune(arr, keep){ var j = 0; for(var i = 0; i < arr.length; i++) if(keep(arr[i])) arr[j++] = arr[i]; arr.length = j; }

  /* ---------- input ---------- */
  function onTeapot(e){
    var r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, tp = g.tp;
    return Math.abs(x - tp.x) < tp.s * 1.7 && y > tp.y - tp.s * 1.7 && y < tp.y + tp.s * .5;
  }
  function tapTeapot(){
    var now = Date.now();
    teapotTaps.push(now); while(teapotTaps.length && now - teapotTaps[0] > 3000) teapotTaps.shift();
    jig = 1; snd(1100 + teapotTaps.length * 120, .06, "sine", .04);
    if(teapotTaps.length >= 5){ teapotTaps.length = 0; brows = 3; find("brows"); say("Outrageous.", "#fff6e8", 0, g.tp.x + g.tp.s * 2.8, g.tp.y - g.tp.s * 3.6); later(0, 500, .1); later(150, 350, .2); }
    if(!live) draw();
  }
  function down(e){
    if(e && e.button > 0) return;
    if(e && e.clientX != null && onTeapot(e)){ tapTeapot(); if(e.cancelable) e.preventDefault(); return; }
    if(!live || paused) return;
    holding = true; if(e && e.cancelable) e.preventDefault();
  }
  function up(){ holding = false; armed = true; }
  function key(e){
    if(!live || paused) return;
    if(e.code === "Space" || e.key === " "){
      if(e.type === "keydown"){ if(!e.repeat) down(null); } else up();
      e.preventDefault();
    }
  }
  cv.addEventListener("pointerdown", down);
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);
  window.addEventListener("keydown", key);
  window.addEventListener("keyup", key);

  /* ---------- the tin: collection, cupboard, room, secrets ---------- */
  var panel = document.createElement("div");
  panel.className = "dk-panel"; panel.hidden = true; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "The tea room");
  panel.innerHTML = '<div class="dk-ph"><h2>The tea room</h2><button type="button" class="dk-x">Back to the tea</button></div><div class="dk-tabs" role="tablist"></div><div class="dk-body"></div>';
  stage.appendChild(panel);
  var tabsEl = panel.querySelector(".dk-tabs"), bodyEl = panel.querySelector(".dk-body"), curTab = "tin";
  var TABS = [["tin", "Biscuit tin"], ["cup", "Cupboard"], ["room", "Room"], ["sec", "Secrets"]];
  TABS.forEach(function(tb){
    var b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "tab"); b.textContent = tb[1]; b.dataset.tab = tb[0];
    b.addEventListener("click", function(){ curTab = tb[0]; renderPanel(); });
    tabsEl.appendChild(b);
  });
  panel.querySelector(".dk-x").addEventListener("click", function(){ closePanel(); });
  panel.addEventListener("keydown", function(e){ if(e.key === "Escape"){ e.stopPropagation(); closePanel(); } });
  tinBtn.addEventListener("click", openPanel);
  var wasLive = false;
  function openPanel(){ hideEra(); wasLive = live; paused = true; holding = false; panel.hidden = false; renderPanel(); var f = panel.querySelector(".dk-x"); if(f) f.focus(); }
  function closePanel(quiet){
    if(panel.hidden) return;
    panel.hidden = true; paused = false; last = 0;
    if(!quiet){ layout(); bgDirty = true; if(!live) draw(); tinBtn.focus(); }
  }

  function iconCanvas(drawFn, locked){
    var c = document.createElement("canvas"); var px = 64 * Math.min(2, window.devicePixelRatio || 1);
    c.width = px; c.height = px; var x = c.getContext("2d"); x.scale(px / 64, px / 64);
    try{ drawFn(x); }catch(e){}
    if(locked){ x.globalCompositeOperation = "source-in"; x.fillStyle = "#5a4636"; x.fillRect(0, 0, 64, 64); x.globalCompositeOperation = "source-over"; }
    return c;
  }
  function drawItemIcon(c, it){
    c.save(); c.translate(32, 32);
    if(it.k === "b"){ var d = BIS[it.id]; drawBiscuit(c, d, d.shape === "rect" ? 26 : 24, 0, "happy", 0, 0); }
    else if(it.k === "d"){ var dk = DRINKS[it.id]; c.fillStyle = "#fff6e8"; circle(c, 0, 0, 26); c.fill(); c.fillStyle = dk.col2; circle(c, 0, 0, 21); c.fill(); c.fillStyle = dk.col; circle(c, 0, -1, 18); c.fill(); if(dk.mallow){ c.fillStyle = "#fff"; rr(c, -10, -6, 9, 8, 2); c.fill(); c.fillStyle = "#ffd1e3"; rr(c, 2, 0, 9, 8, 2); c.fill(); } if(dk.froth){ c.strokeStyle = "rgba(240,220,190,.85)"; c.lineWidth = 5; circle(c, 0, 0, 14); c.stroke(); } if(dk.lemon){ c.fillStyle = "#ffe36b"; circle(c, 6, -4, 8); c.fill(); c.strokeStyle = "#e8c43a"; c.lineWidth = 1.5; c.stroke(); } }
    else if(it.k === "m"){ var kind = vesselKind(it.id), v = { mx: -2, w: 36, h: 32, top: -16 }; vesselBody(c, kind, v, false); vesselHandle(c, kind, v); c.fillStyle = "#a8642f"; c.beginPath(); c.ellipse(-2, -14, vesselInner(kind, 36) - 2, 4, 0, 0, 6.2832); c.fill(); }
    else if(it.id === "bunting"){ c.strokeStyle = "#fff6e8"; c.lineWidth = 2; c.beginPath(); c.moveTo(-28, -14); c.quadraticCurveTo(0, 6, 28, -14); c.stroke(); var bc = ["#ffd23f", "#7cf5c9", "#ff8fb8", "#8a5cf6"]; for(var i = 0; i < 4; i++){ var u = (i + .5) / 4, bx = -28 + u * 56, by = -14 + 20 * 2 * u * (1 - u); c.fillStyle = bc[i]; c.beginPath(); c.moveTo(bx - 7, by); c.lineTo(bx + 7, by); c.lineTo(bx, by + 16); c.fill(); } }
    else if(it.id === "rush"){ c.fillStyle = "#fff6e8"; circle(c, 0, 0, 22); c.fill(); c.strokeStyle = "#2a1a10"; c.lineWidth = 3; c.stroke(); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -14); c.moveTo(0, 0); c.lineTo(10, 4); c.stroke(); c.strokeStyle = "#ffd23f"; c.lineWidth = 3; for(var j = 0; j < 3; j++){ c.beginPath(); c.moveTo(-30, -8 + j * 8); c.lineTo(-24, -8 + j * 8); c.stroke(); } }
    else if(it.id === "piano"){ c.fillStyle = "#2a1a10"; rr(c, -26, -18, 52, 36, 4); c.fill(); c.fillStyle = "#fff6e8"; c.fillRect(-22, -2, 44, 14); c.fillStyle = "#2a1a10"; for(var p = 0; p < 6; p++) c.fillRect(-19 + p * 7.5, -2, 3, 8); c.fillStyle = "#ffd23f"; circle(c, 14, -24, 4); c.fill(); c.fillRect(17, -36, 2, 12); }
    else if(it.id === "chandelier"){ c.strokeStyle = "#e8c45a"; c.lineWidth = 2.5; c.beginPath(); c.moveTo(0, -30); c.lineTo(0, -8); c.stroke(); c.beginPath(); c.ellipse(0, -4, 24, 8, 0, 0, Math.PI); c.stroke(); for(var q = 0; q < 5; q++){ c.fillStyle = "#fff6cf"; circle(c, -20 + q * 10, 0 + (q % 2) * 4, 4); c.fill(); c.fillStyle = "rgba(255,246,207,.3)"; circle(c, -20 + q * 10, 0, 9); c.fill(); } }
    c.restore();
  }
  function drawSecretIcon(c, id){
    c.save(); c.translate(32, 34);
    if(id === "catch"){ bonnieHead(c, 0, 0, 16, "chomp"); c.save(); c.translate(0, 10); c.scale(.3, .3); drawBiscuit(c, BIS.digestive, 30, .6, "shock", 2, 0); c.restore(); }
    else if(id === "jay"){ drawPerson(c, { jay: 1, skin: "#f1c7a5", hair: "#6b4423", top: "#3f7d5a", v: 0 }, 0, 32, 12, "happy", "none", 0); }
    else if(id === "bonnie"){ drawBonnieSeat(c, 0, 30, 11, "happy", 0); }
    else if(id === "bird"){ drawBird(c, -4, 0, 18, 1, "victorian"); c.save(); c.translate(6, 14); c.scale(.35, .35); drawBiscuit(c, BIS.digestive, 30, 0, "shock", 0, 0); c.restore(); }
    else if(id === "brows"){ drawTeapot(c, -6, 22, 14, "none", 0); c.fillStyle = "#3a2210"; c.beginPath(); c.ellipse(-4, -18, 10, 4, -.2, 0, 6.2832); c.fill(); c.beginPath(); c.ellipse(16, -18, 10, 4, .2, 0, 6.2832); c.fill(); }
    else if(id === "ovation"){ c.fillStyle = "#ffd23f"; starShape(c, 0, -2, 22); c.fill(); c.fillStyle = "#2a1a10"; c.font = "900 12px " + FONT; c.textAlign = "center"; c.fillText("x5", 0, 2); }
    c.restore();
  }
  function tile(it, opts){
    var el = document.createElement(opts.button ? "button" : "div");
    if(opts.button) el.type = "button";
    el.className = "dk-tile" + (opts.locked ? " lock" : "") + (opts.next ? " next" : "") + (opts.on ? " on" : "");
    el.appendChild(iconCanvas(opts.draw, opts.locked));
    var b = document.createElement("b"); b.textContent = opts.locked ? "???" : opts.name; el.appendChild(b);
    var s = document.createElement("small"); s.textContent = opts.note || ""; el.appendChild(s);
    if(opts.button){ el.setAttribute("aria-pressed", opts.on ? "true" : "false"); if(opts.click) el.addEventListener("click", opts.click); }
    if(opts.locked) el.setAttribute("aria-label", opts.next ? "Locked, next unlock: " + opts.note : "Locked");
    return el;
  }
  function itemTiles(kinds, selectable){
    var grid = document.createElement("div"); grid.className = "dk-grid";
    ITEMS.forEach(function(it){
      if(kinds.indexOf(it.k) < 0) return;
      var got = !!HAVE[it.id], isNext = L.next && L.next.id === it.id;
      var sel = got && selectable && ((it.k === "d" && S.drink === it.id) || (it.k === "m" && S.mug === it.id));
      grid.appendChild(tile(it, {
        locked: !got, next: isNext, on: sel, name: itemName(it),
        note: got ? itemNote(it) : isNext ? L.need + " more sparks" : "",
        draw: function(c){ drawItemIcon(c, it); },
        button: got && selectable && (it.k === "d" || it.k === "m"),
        click: function(){ if(it.k === "d") S.drink = it.id; else S.mug = it.id; persist(); layout(); bgDirty = true; renderPanel(); snd(700, .06); }
      }));
    });
    return grid;
  }
  function sub(text){ var h = document.createElement("p"); h.className = "dk-sub"; h.textContent = text; return h; }
  function renderPanel(){
    Array.prototype.forEach.call(tabsEl.children, function(b){ b.setAttribute("aria-selected", b.dataset.tab === curTab ? "true" : "false"); });
    bodyEl.innerHTML = "";
    if(curTab === "tin"){
      var nb = ITEMS.filter(function(i){ return i.k === "b"; }), got = nb.filter(function(i){ return HAVE[i.id]; }).length;
      bodyEl.appendChild(sub(got + " of " + nb.length + " biscuits. Customers order the ones in your tin."));
      bodyEl.appendChild(itemTiles(["b"], false));
    } else if(curTab === "cup"){
      bodyEl.appendChild(sub("Drinks: tap one to use it"));
      bodyEl.appendChild(itemTiles(["d"], true));
      bodyEl.appendChild(sub("Mugs"));
      bodyEl.appendChild(itemTiles(["m"], true));
    } else if(curTab === "room"){
      if(HAVE.rush){
        var tg = document.createElement("button"); tg.type = "button"; tg.className = "dk-tog"; tg.setAttribute("aria-pressed", S.rush ? "true" : "false");
        tg.innerHTML = "Rush hour shifts (18 customers)<i>" + (S.rush ? "On" : "Off") + "</i>";
        tg.addEventListener("click", function(){ S.rush = !S.rush; persist(); renderPanel(); });
        bodyEl.appendChild(tg);
      }
      bodyEl.appendChild(sub("Tea room upgrades"));
      bodyEl.appendChild(itemTiles(["r"], false));
      var st = document.createElement("div"); st.className = "dk-stats";
      [[S.served, "Customers served"], [S.perfect, "Perfect dunks"], [S.snapped, "Lost to the tea"], ["x" + comboMult(S.bestCombo), "Best combo"]].forEach(function(p){ var d = document.createElement("div"); d.innerHTML = "<b></b><span></span>"; d.firstChild.textContent = p[0]; d.lastChild.textContent = p[1]; st.appendChild(d); });
      bodyEl.appendChild(st);
    } else {
      var n = SECRETS.filter(function(s){ return S.secrets[s.id]; }).length;
      bodyEl.appendChild(sub("Secrets found " + n + " of " + SECRETS.length + ". Never needed, just for fun."));
      var grid = document.createElement("div"); grid.className = "dk-grid";
      SECRETS.forEach(function(sc){
        var f = !!S.secrets[sc.id];
        grid.appendChild(tile(null, { locked: !f, name: sc.name, note: f ? sc.how : "", draw: function(c){ drawSecretIcon(c, sc.id); } }));
      });
      bodyEl.appendChild(grid);
    }
    bodyEl.scrollTop = 0;
  }

  /* ---------- celebrate new unlocks, once ---------- */
  var pop = null;
  if(fresh.length){
    pop = document.createElement("div"); pop.className = "dk-pop"; pop.setAttribute("role", "dialog"); pop.setAttribute("aria-label", "New in the tea room");
    pop.innerHTML = "<h2>New in the tea room</h2><p>" + (fresh.length === 1 ? "Something new has arrived." : fresh.length + " new things have arrived.") + "</p>";
    var grid = document.createElement("div"); grid.className = "dk-grid";
    fresh.slice(0, 6).forEach(function(it){ grid.appendChild(tile(it, { name: itemName(it), note: itemNote(it), draw: function(c){ drawItemIcon(c, it); } })); });
    pop.appendChild(grid);
    if(fresh.length > 6){ var more = document.createElement("p"); more.textContent = "And " + (fresh.length - 6) + " more in the tin."; pop.appendChild(more); }
    var ok = document.createElement("button"); ok.type = "button"; ok.textContent = "Lovely";
    ok.addEventListener("click", function(){ pop.remove(); pop = null; var g0 = stage.querySelector(".hqb-card:not([hidden]) button"); if(g0) g0.focus(); });
    pop.appendChild(ok);
    stage.appendChild(pop);
    S.seen = L.have.map(function(i){ return i.id; }); persist();
    later(200, 660, .12); later(320, 880, .12); later(440, 1175, .18);
    setTimeout(function(){ if(pop) ok.focus(); }, 30);
    clearTimeout(eraTimer); eraTimer = setTimeout(hideEra, 14000);
  }

  if(G && G.test && (FORCE || /[?&]hqbot/.test(location.search))) window.__dunk = function(){ return { soak: bis ? bis.soak : -1, ready: !!(bis && bis.pop >= 1 && cust && cust.state === "order"), lo: cust ? cust.order.lo : 0, hi: cust ? cust.order.hi : 0, combo: shift ? shift.combo : 0, secrets: S.secrets, kind: cust ? cust.kind : "" }; };

  /* first picture before Go */
  t = 0;
  draw();

  return {
    start: start,
    stop: function(){
      live = false; cancelAnimationFrame(raf); clearTimeout(pendingEnd); clearTimeout(eraTimer);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("keydown", key);
      window.removeEventListener("keyup", key);
      persist();
    }
  };
}
})();
