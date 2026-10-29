/* ==========================================================
   LP's GCSE HQ - Neon Stack (v3, the big one, 29 Oct 2026)
   A break game for LP's HQ. A block slides across the top of the
   tower. Tap to drop it. Whatever hangs over the edge gets sliced
   off, so land them clean. Three clean drops in a row grows it back
   a little; five gives slow motion.

   The climb: every floor is 10 metres. Real landmarks (real heights,
   rounded) are marked up the side, from a giraffe to Ben Nevis, then
   space (sort of), the Moon and a satellite. A curveball changes the
   rules every ten floors. When the tower falls the camera pulls out
   and a postcard compares your tower with the tallest thing you beat.

   New in v3:
   - Block sets with their own feel and a small perk (Neon, Pixel,
     Jelly, Ice, Rubber, Glass, Gold, Cake, plus this week's era set)
   - Places to build in (Night city, Seaside, Canyon, Snowy peaks,
     Moon base), power ups that ride on the block (Laser, Slow clock,
     Magnet, Glue, Pump, Safety net), eight curveballs
   - Unlocks over the term from /data/hqgame.js, a collection screen
   - The weekly era: the world and the era blocks change, each with
     one silly rule (see ERA_RULE)
   - Six Jay and Bonnie secrets (see SECRETS), never scored

   Earning goes, the break clock and the cooldown all live in
   /data/hqbreak.js. Home page only:
     <script src="/data/hqgame.js?v=1"></script>
     <script src="/data/hqbreak.js?v=4"></script>
     <script src="/lp/stack.js?v=3"></script>
   The best height stays in b5.lp.stack.v1 (owned by hqbreak.js).
   Everything new saves in b5.lp.stack.more.v1. ASCII only.
   ========================================================== */
(function(){
"use strict";
if(!window.HQBreak) return;
var PREFIX = (window.HQ && window.HQ.prefix) || "";
if(PREFIX !== "b5.lp.") return;   /* LP's space only */

var G = window.HQGame;
var TESTING = /[?&]hqtest/.test(location.search);
var M_PER_FLOOR = 10;
var FONT = "'Chakra Petch',Arial,sans-serif";

var NEON = ["#ff7a2f", "#ff4f8b", "#c6f03c", "#3ad0ff"];
var PIX  = ["#ffb000", "#3ad0ff", "#a3e635", "#c084fc"];
var JEL  = ["#ff6fb5", "#6fe3a5", "#ffd166", "#86c5ff"];
var RUB  = ["#ff8a3d", "#36d1ff", "#b26bff", "#3fdc84"];
var TAPE = ["#ff4fa3", "#2de2e6", "#ffd23f", "#9b5cff"];
var GOLD = "#ffd23f";

var ERA0 = { n:1, id:"stone", name:"Stone Age", when:"about 10,000 years ago",
  line:"Everything is made of rock. Even the bad ideas.",
  pal:{ sky:"#f2a65a", sky2:"#ffd9a0", ground:"#8a6a48", ink:"#2b1d12", accent:"#e05a2b" } };
var ERA_RULE = {
  stone:"Clean drops get cave paintings",
  egypt:"Pyramid power: one rescue when it gets thin",
  rome:"It is raining. Floors are in Roman numerals",
  viking:"The tower sways to the singing",
  victorian:"Steam power: the block chuffs along",
  eighties:"The block moves to the beat",
  future:"A hologram shows the perfect spot. Also: tinsel"
};
var ERA_COL = { stone:"#f2c38b", egypt:"#ffd27a", rome:"#e8eef2", viking:"#e8b84f", victorian:"#ecdcb8", eighties:"#2de2e6", future:"#7cf5c9" };
var ERA_BLOCK = { stone:"Stone slabs", egypt:"Sandstone", rome:"Marble and columns", viking:"Timber and shields", victorian:"Brick and chimneys", eighties:"Cassette tapes", future:"Holo glass" };

/* ---------- unlocks over the term ---------- */
var LADDER = [
  { at:0,    kind:"skin",  id:"neon",   n:"Neon",        d:"The classic glow" },
  { at:0,    kind:"skin",  id:"pixel",  n:"Pixel",       d:"Chunky. Snaps in when close" },
  { at:0,    kind:"place", id:"city",   n:"Night city",  d:"Where it all began" },
  { at:0,    kind:"power", id:"laser",  n:"Laser",       d:"Trims the next drop perfectly" },
  { at:0,    kind:"power", id:"slow",   n:"Slow clock",  d:"Five blocks in slow motion" },
  { at:120,  kind:"skin",  id:"jelly",  n:"Jelly",       d:"Wobbles, and squidges in when close" },
  { at:250,  kind:"place", id:"sea",    n:"Seaside",     d:"Pier, big wheel, cheeky gulls" },
  { at:400,  kind:"power", id:"magnet", n:"Magnet",      d:"Pulls the next four into line" },
  { at:550,  kind:"skin",  id:"ice",    n:"Ice",         d:"Slides a touch, always the helpful way" },
  { at:750,  kind:"skin",  id:"rubber", n:"Rubber",      d:"Boing. Bounces back from one miss" },
  { at:950,  kind:"place", id:"desert", n:"Canyon",      d:"Hot rocks and a patient cactus" },
  { at:1200, kind:"power", id:"glue",   n:"Glue",        d:"Three extra sticky drops" },
  { at:1450, kind:"skin",  id:"glass",  n:"Glass",       d:"Shows where it lines up" },
  { at:1750, kind:"place", id:"snow",   n:"Snowy peaks", d:"Pine trees and a cosy chalet" },
  { at:2100, kind:"power", id:"pump",   n:"Pump",        d:"Puffs the tower back up wider" },
  { at:2500, kind:"skin",  id:"gold",   n:"Gold",        d:"Heavy, so it slides slower" },
  { at:3000, kind:"place", id:"moon",   n:"Moon base",   d:"Low gravity. Bits float away" },
  { at:3500, kind:"power", id:"net",    n:"Safety net",  d:"Catches one miss" },
  { at:4000, kind:"skin",  id:"cake",   n:"Cake",        d:"Clean layers get candles and grow" }
];
/* how each block set plays: tol = how close counts as clean (px) */
var SK = {
  neon:   { tol:5 },
  pixel:  { tol:8 },
  jelly:  { tol:9 },
  ice:    { tol:5, slide:7 },
  rubber: { tol:5, net:1 },
  glass:  { tol:5, guide:1 },
  gold:   { tol:5, speed:.86 },
  cake:   { tol:5, grow:4 },
  era:    { tol:6 }
};
var PLACES = {
  city:   { n:"Night city",  top:"#0b2840", bot:"#123a5c", ground:"#103350" },
  sea:    { n:"Seaside",     top:"#3a2e6e", bot:"#ff9d6e", ground:"#e3be7d" },
  desert: { n:"Canyon",      top:"#2b1e5a", bot:"#ff8c42", ground:"#c9773f" },
  snow:   { n:"Snowy peaks", top:"#1b2a52", bot:"#86acd9", ground:"#e8f1fa" },
  moon:   { n:"Moon base",   top:"#02030c", bot:"#151b3c", ground:"#8e929c", space:1 }
};
var SKY_UP = [
  { f:20, top:"#2a1a5e", bot:"#b34d7a" },
  { f:40, top:"#3d6fb3", bot:"#9fd0f0" },
  { f:65, top:"#0d1640", bot:"#2b3f8a" },
  { f:90, top:"#02030c", bot:"#0b0f2e" }
];
var CURVES = [
  { id:"speed",  n:"Speed up",      d:"Everything moves faster" },
  { id:"gust",   n:"Gusty",         d:"The wind speeds it up and slows it down" },
  { id:"gold",   n:"Gold rush",     d:"Land a gold block clean to grow it back" },
  { id:"zig",    n:"Zigzag",        d:"It might change direction. Watch closely" },
  { id:"crane",  n:"Crane day",     d:"Blocks swing in on a crane" },
  { id:"disco",  n:"Disco",         d:"The block dances to the beat" },
  { id:"bouncy", n:"Bouncy castle", d:"Everything boings. The timing stays the same" },
  { id:"lucky",  n:"Lucky ten",     d:"Power ups on every other block" }
];
/* real heights, rounded to the nearest floor */
var MARKS = [
  { f:1,   n:"a giraffe", m:6, s:"giraffe" },
  { f:3,   n:"a blue whale on its tail", m:30, s:"whale" },
  { f:5,   n:"Nelson's Column", m:52, s:"column" },
  { f:10,  n:"Big Ben's tower", m:96, s:"clock" },
  { f:12,  n:"Salisbury Cathedral", m:123, s:"spire" },
  { f:14,  n:"the Great Pyramid", m:139, s:"pyramid" },
  { f:16,  n:"Blackpool Tower", m:158, s:"lattice" },
  { f:31,  n:"the Shard", m:310, s:"shard" },
  { f:33,  n:"the Eiffel Tower", m:330, s:"lattice" },
  { f:44,  n:"the Empire State Building", m:443, s:"stepped" },
  { f:55,  n:"the CN Tower", m:553, s:"needle" },
  { f:63,  n:"Tokyo Skytree", m:634, s:"skytree" },
  { f:83,  n:"the Burj Khalifa", m:828, s:"burj" },
  { f:109, n:"the top of Yr Wyddfa", m:1085, s:"mountain" },
  { f:134, n:"the top of Ben Nevis", m:1345, s:"mountain" }
];
var BEYOND = [
  { f:150, n:"space (sort of)", s:"rocket" },
  { f:200, n:"the Moon", s:"moon" },
  { f:250, n:"a satellite", s:"sat" }
];
var SECRETS = [
  { id:"rider",  n:"Bonnie hitched a ride" },
  { id:"robin",  n:"A robin dropped by" },
  { id:"window", n:"Jay at the window" },
  { id:"stop",   n:"Great grandfather says stop" },
  { id:"china",  n:"When I was in China...." },
  { id:"space",  n:"Space dog" }
];
var CAPTIONS = ["Wish you were here", "The view is unreal", "Bit windy up top", "Do not look down", "Built it myself", "Lift is out of order"];

var ICON = '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="0" y="0" width="40" height="40" rx="6" fill="#0b2840"/><rect x="8" y="27" width="24" height="6" rx="1" fill="#ff7a2f"/><rect x="10" y="20" width="20" height="6" rx="1" fill="#ff4f8b"/><rect x="11" y="13" width="17" height="6" rx="1" fill="#c6f03c"/><rect x="14" y="6" width="17" height="6" rx="1" fill="#3ad0ff"/></svg>';

window.HQBreak({
  id: "stack",
  title: "Neon Stack",
  prefix: PREFIX,
  icon: ICON,
  theme: { bg: "#0b2840", ink: "#f1f8ff", card: "#f1f8ff", cardInk: "#0b2840", accent: "#c6f03c", accent2: "#ff4f8b", font: 'var(--display,"Chakra Petch",Arial,sans-serif)' },
  words: {
    how: "Tap, click or press space to drop. Land it clean to keep it wide. Every floor is 10 metres: how high can you go?",
    earn: "Anything counts, even Show me.",
    coolingTitle: "Recharging",
    cooling: "The neon needs a minute. Have a crack at something else in the meantime.",
    coolingShort: "Recharging.",
    done: "Lights off."
  },
  make: make
});

/* ---------- small helpers ---------- */
var RM = false, ERA = ERA0, ERAID = "stone";
function readEra(){ try{ return (G && G.era && G.era()) || ERA0; }catch(e){ return ERA0; } }
function hr(n){ var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function rgb(h){ var p = parseInt(h.slice(1), 16); return [(p >> 16) & 255, (p >> 8) & 255, p & 255]; }
function mixA(a, b, k){ return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
function css(a){ return "rgb(" + Math.round(a[0]) + "," + Math.round(a[1]) + "," + Math.round(a[2]) + ")"; }
function rr(g, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
function circ(g, x, y, r){ g.beginPath(); g.arc(x, y, Math.max(.1, r), 0, 6.2832); g.fill(); }
function ell(g, x, y, rx, ry, a){ g.beginPath(); g.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), a || 0, 0, 6.2832); g.fill(); }
function poly(g, pts){ g.beginPath(); g.moveTo(pts[0], pts[1]); for(var i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]); g.closePath(); g.fill(); }
function pick(a){ return a[Math.floor(Math.random() * a.length)]; }
function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function roman(n){
  if(n <= 0) return "N";
  var v = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1], s = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"], o = "";
  for(var i = 0; i < v.length; i++) while(n >= v[i]){ o += s[i]; n -= v[i]; }
  return o;
}
function el(tag, cls, text){ var e = document.createElement(tag); if(cls) e.className = cls; if(text != null) e.textContent = text; return e; }
function ukey(u){ return u.kind + ":" + u.id; }

var SKEY = PREFIX + "stack.more.v1";
function loadX(){
  var d = { v:1, skin:"neon", place:"city", seen:null, secrets:{}, eraSeen:"", top:0, combo:0, rounds:0 }, o = null;
  try{ o = JSON.parse(localStorage.getItem(SKEY) || "null"); }catch(e){ o = null; }
  if(o && typeof o === "object") for(var k in d) if(o[k] !== undefined && o[k] !== null) d[k] = o[k];
  if(!d.secrets || typeof d.secrets !== "object") d.secrets = {};
  if(d.seen && !(d.seen instanceof Array)) d.seen = null;
  return d;
}
function saveX(d){ try{ localStorage.setItem(SKEY, JSON.stringify(d)); }catch(e){} }
function unlocks(){
  var L = null;
  try{ if(G && G.ladder) L = G.ladder(PREFIX, LADDER); }catch(e){ L = null; }
  if(!L) L = { have: LADDER.filter(function(u){ return !u.at; }), next: null, need: 0 };
  return L;
}

/* ==========================================================
   Drawing: blocks
   ========================================================== */
function blockFlat(skin, c, gold){
  if(gold) return GOLD;
  switch(skin){
    case "pixel": return PIX[c % 4];
    case "jelly": return JEL[c % 4];
    case "ice": return "#bfefff";
    case "rubber": return RUB[c % 4];
    case "glass": return "rgba(190,235,255,.5)";
    case "gold": return GOLD;
    case "cake": return "#eab87c";
    case "era":
      switch(ERAID){
        case "stone": return ["#8d8a83", "#a29c90", "#7b776f", "#968f84"][c % 4];
        case "egypt": return c % 2 ? "#d9a94f" : "#e5bb66";
        case "rome": return "#ece8de";
        case "viking": return c % 2 ? "#8b5a2b" : "#9a6634";
        case "victorian": return "#9c4a32";
        case "eighties": return "#241f3a";
        default: return "rgba(124,245,201,.35)";
      }
  }
  return NEON[c % 4];
}

/* a bright flat colour for the postcard and the far away tower */
function postCol(skin, c, gold){
  if(gold) return GOLD;
  if(skin === "glass") return ["#9fe3ff", "#ff9bc4", "#d9f59a", "#ffe08a"][c % 4];
  if(skin === "ice") return c % 2 ? "#bfefff" : "#9fdcf2";
  if(skin === "era"){
    if(ERAID === "eighties") return TAPE[c % 4];
    if(ERAID === "future") return c % 2 ? "#7cf5c9" : "#4fd6aa";
  }
  return blockFlat(skin, c, false);
}
function grad(g, key, h, stops){
  var m = g.__ns || (g.__ns = {}), k = key + h;
  if(!m[k]){ var gr = g.createLinearGradient(0, 0, 0, h); for(var i = 0; i < stops.length; i += 2) gr.addColorStop(stops[i], stops[i + 1]); m[k] = gr; }
  return m[k];
}
/* glow: 0 none, 1 top of the tower, 2 the moving block */
function drawBlock(g, x, y, w, h, b, skin, glow, T, lod){
  if(w < .5) return;
  var c = b.c || 0, s = b.s || c * 7 + 1, i, k;
  if(lod){ g.fillStyle = postCol(skin, c, b.gold); g.fillRect(x, y, w, h); return; }
  if(b.gold) skin = "goldbar";
  switch(skin){
    case "goldbar": case "gold": {
      if(glow && !RM){ g.shadowColor = GOLD; g.shadowBlur = 22; }
      g.save(); g.translate(0, y); g.fillStyle = grad(g, "gold", h, [0, "#fff1a8", .45, "#ffd23f", 1, "#b8860b"]); g.fillRect(x, 0, w, h); g.restore(); g.shadowBlur = 0;
      g.fillStyle = "rgba(120,80,0,.35)"; g.fillRect(x, y + h - 3, w, 3);
      g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 1; g.strokeRect(x + 2.5, y + 2.5, Math.max(0, w - 5), h - 7);
      var sx = ((T * 120 + s * 37) % (w + 40)) - 20;
      g.fillStyle = "rgba(255,255,255,.55)"; g.fillRect(x + Math.max(0, sx), y + 3, Math.max(0, Math.min(10, w - sx)), h - 8);
      break; }
    case "pixel": {
      var p = Math.max(3, Math.round(h / 7));
      g.fillStyle = PIX[c % 4]; g.fillRect(x, y, w, h);
      g.fillStyle = "rgba(255,255,255,.38)"; g.fillRect(x, y, w, p); g.fillRect(x, y, p, h);
      g.fillStyle = "rgba(0,0,0,.28)"; g.fillRect(x, y + h - p, w, p); g.fillRect(x + w - p, y, p, h);
      g.fillStyle = "rgba(0,0,0,.13)";
      for(i = x + p * 3, k = 0; i < x + w - p * 2; i += p * 4, k++) g.fillRect(i, y + p * (2 + (k % 2)), p, p);
      g.strokeStyle = "#0b1020"; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, Math.max(0, w - 2), h - 2);
      break; }
    case "jelly": {
      rr(g, x, y, w, h, Math.min(10, h * .35));
      g.globalAlpha = .9; g.fillStyle = JEL[c % 4]; g.fill(); g.globalAlpha = 1;
      g.fillStyle = "rgba(255,255,255,.45)"; rr(g, x + 6, y + 4, Math.max(0, Math.min(w * .35, w - 12)), h * .22, 4); g.fill();
      g.fillStyle = "rgba(255,255,255,.35)";
      for(k = 0; k < 3; k++) circ(g, x + 6 + (w - 12) * hr(s * 3 + k), y + h * (.5 + .28 * hr(s * 5 + k)), 1.5 + 2 * hr(s + k));
      break; }
    case "ice": {
      g.save(); g.translate(0, y); rr(g, x, 0, w, h, 4); g.fillStyle = grad(g, "ice", h, [0, "#effcff", 1, "#8fd8f0"]); g.fill(); g.restore();
      rr(g, x, y, w, h, 4);
      g.strokeStyle = "rgba(255,255,255,.85)"; g.lineWidth = 1.5; g.stroke();
      g.fillStyle = "rgba(255,255,255,.5)";
      var off = (s * 13) % 46;
      for(i = x + off - h; i < x + w - 10; i += 46){ if(i < x) continue; poly(g, [i, y + h - 2, i + h * .5, y + 2, i + h * .5 + 7, y + 2, i + 7, y + h - 2]); }
      g.strokeStyle = "rgba(60,140,180,.35)"; g.lineWidth = 1;
      g.beginPath(); k = x + w * (.2 + .6 * hr(s)); g.moveTo(k, y + 3); g.lineTo(k + 5, y + h * .5); g.lineTo(k + 1, y + h - 4); g.stroke();
      break; }
    case "rubber": {
      rr(g, x, y, w, h, h * .45); g.fillStyle = RUB[c % 4]; g.fill();
      g.lineWidth = 2.5; g.strokeStyle = "rgba(10,10,30,.55)"; g.stroke();
      g.fillStyle = "rgba(255,255,255,.42)"; rr(g, x + h * .4, y + 3, Math.max(0, w - h * .8), 4, 2); g.fill();
      break; }
    case "glass": {
      g.fillStyle = "rgba(170,225,255,.24)"; g.fillRect(x, y, w, h);
      g.fillStyle = ["rgba(58,208,255,.22)", "rgba(255,79,139,.18)", "rgba(198,240,60,.18)", "rgba(255,210,63,.2)"][c % 4];
      g.fillRect(x, y + h - 6, w, 6);
      g.strokeStyle = "rgba(235,250,255,.9)"; g.lineWidth = 1.5; g.strokeRect(x + .75, y + .75, Math.max(0, w - 1.5), h - 1.5);
      if(w > 30){ g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 8, y + h - 5); g.lineTo(x + 16, y + 5); g.moveTo(x + 15, y + h - 5); g.lineTo(x + 20, y + 8); g.stroke(); }
      break; }
    case "cake": {
      g.fillStyle = "#e9b77a"; g.fillRect(x, y + h * .28, w, h * .72);
      g.fillStyle = "#ff86b4"; g.fillRect(x, y + h * .6, w, h * .12);
      g.fillStyle = "#fff7ec"; g.fillRect(x, y, w, h * .3);
      for(i = x + 4; i < x + w - 8; i += 15){ var dh = 3 + 6 * hr(s * 7 + i); g.fillRect(i, y + h * .28, 7, dh); circ(g, i + 3.5, y + h * .28 + dh, 3.5); }
      for(k = 0; k < Math.min(8, w / 12); k++){ g.fillStyle = NEON[(k + c) % 4]; g.fillRect(x + 4 + (w - 10) * hr(s + k * 3), y + 2 + (h * .18) * hr(s * 2 + k), 4, 2); }
      if(b.clean && w > 14){
        var mx = x + w / 2;
        g.fillStyle = ["#7ad7ff", "#c6f03c", "#ff9bd2"][c % 3]; g.fillRect(mx - 3, y - h * .4, 6, h * .4);
        var fl = RM ? 1 : 1 + .15 * Math.sin(T * 13 + s);
        g.fillStyle = "#ffd23f"; ell(g, mx, y - h * .4 - 5 * fl, 3, 5 * fl);
        g.fillStyle = "#fff6c0"; ell(g, mx, y - h * .4 - 4 * fl, 1.3, 2.4 * fl);
      }
      break; }
    case "era": drawEraBlock(g, x, y, w, h, c, s, glow, T, b); break;
    default: {
      var col = NEON[c % 4];
      if(glow && !RM){ g.shadowColor = col; g.shadowBlur = 18; }
      g.fillStyle = col; g.fillRect(x, y, w, h); g.shadowBlur = 0;
      g.fillStyle = "rgba(255,255,255,.28)"; g.fillRect(x, y, w, 3);
      g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(x, y + h - 4, w, 4);
    }
  }
  if(b.clean && ERAID === "stone" && w > 30) cavePaint(g, x + w / 2, y + h / 2, h, s);
}

function drawEraBlock(g, x, y, w, h, c, s, glow, T, b){
  var i, k, row;
  switch(ERAID){
    case "stone":
      g.fillStyle = blockFlat("era", c);
      poly(g, [x + 2, y + 1, x + w - 3, y, x + w, y + h * .5, x + w - 2, y + h, x + 1, y + h, x, y + h * .4]);
      g.fillStyle = "rgba(255,255,255,.14)"; g.fillRect(x + 3, y + 2, Math.max(0, w - 8), 3);
      g.strokeStyle = "rgba(40,30,20,.45)"; g.lineWidth = 1.5;
      g.beginPath(); k = x + w * (.15 + .7 * hr(s)); g.moveTo(k, y + 2); g.lineTo(k + 6, y + h * .5); g.lineTo(k + 2, y + h - 3); g.stroke();
      if(hr(s + 4) > .5){ g.fillStyle = "rgba(110,150,70,.75)"; g.fillRect(x + (w - 12) * hr(s + 2), y, 12, 3); }
      break;
    case "egypt":
      g.fillStyle = blockFlat("era", c); g.fillRect(x, y, w, h);
      g.strokeStyle = "rgba(120,80,30,.45)"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(x, y + h / 2); g.lineTo(x + w, y + h / 2);
      for(row = 0; row < 2; row++) for(i = x + ((row + c) % 2) * 17 + 17; i < x + w; i += 34){ g.moveTo(i, y + row * h / 2); g.lineTo(i, y + (row + 1) * h / 2); }
      g.stroke();
      if(c % 3 === 0 && w > h * 3.2) glyphs(g, x + w / 2, y + h / 2, h, s);
      break;
    case "rome":
      if(c % 3 === 1 && w > 30){
        g.fillStyle = "#f5f2ea"; g.fillRect(x, y, w, h * .18); g.fillRect(x, y + h * .82, w, h * .18);
        g.fillStyle = "#e3ddd0";
        for(i = x + 5; i < x + w - 8; i += 18){ g.fillRect(i, y + h * .18, 9, h * .64); }
        g.fillStyle = "rgba(0,0,0,.12)";
        for(i = x + 5; i < x + w - 8; i += 18){ g.fillRect(i + 3, y + h * .2, 1, h * .6); g.fillRect(i + 6, y + h * .2, 1, h * .6); }
      } else {
        g.fillStyle = "#ece8de"; g.fillRect(x, y, w, h);
        g.strokeStyle = "rgba(120,120,140,.35)"; g.lineWidth = 1;
        g.beginPath(); k = x + w * hr(s); g.moveTo(k, y); g.quadraticCurveTo(k + 20, y + h * .5, k + 6, y + h);
        k = x + w * hr(s + 9); g.moveTo(k, y); g.quadraticCurveTo(k - 14, y + h * .6, k + 10, y + h); g.stroke();
        g.fillStyle = "#c9a43a"; g.fillRect(x, y + h - 4, w, 2);
      }
      break;
    case "viking":
      g.fillStyle = blockFlat("era", c); g.fillRect(x, y, w, h);
      g.fillStyle = "rgba(40,20,5,.35)"; g.fillRect(x, y + h / 3, w, 1.5); g.fillRect(x, y + 2 * h / 3, w, 1.5);
      g.fillStyle = "rgba(255,230,190,.18)"; g.fillRect(x, y, w, 2);
      g.fillStyle = "#3a2a1a"; circ(g, x + 4, y + h / 6, 1.5); circ(g, x + w - 4, y + h / 6, 1.5); circ(g, x + 4, y + h * .83, 1.5); circ(g, x + w - 4, y + h * .83, 1.5);
      if(b.clean && w > 34){
        var r = h * .42, sx = x + w / 2;
        g.fillStyle = ["#d9a441", "#3c6fb0", "#3f8a5a", "#e8e0c8"][c % 4]; circ(g, sx, y + h / 2, r);
        g.strokeStyle = "#5b3b1a"; g.lineWidth = 2; g.beginPath(); g.arc(sx, y + h / 2, r, 0, 6.2832); g.stroke();
        g.fillStyle = "#c9c9c9"; circ(g, sx, y + h / 2, r * .3);
      }
      break;
    case "victorian":
      g.fillStyle = "#9c4a32"; g.fillRect(x, y, w, h);
      g.fillStyle = "#d8c7b0";
      for(row = 1; row < 3; row++) g.fillRect(x, y + row * h / 3 - .75, w, 1.5);
      if(w > 8) for(row = 0; row < 3; row++) for(i = x + ((row + c) % 2) * 11 + 11; i < x + w; i += 22) g.fillRect(i, y + row * h / 3, 1.5, h / 3);
      g.fillStyle = "rgba(0,0,0,.15)"; g.fillRect(x, y + h - 3, w, 3);
      if(glow === 1 && w > 30){
        g.fillStyle = "#6b3326"; g.fillRect(x + w * .2, y - h * .5, h * .3, h * .5); g.fillRect(x + w * .7, y - h * .4, h * .3, h * .4);
        g.fillStyle = "#4a2a20"; g.fillRect(x + w * .2 - 2, y - h * .5, h * .3 + 4, 4); g.fillRect(x + w * .7 - 2, y - h * .4, h * .3 + 4, 4);
        puffs(g, x + w * .2 + h * .15, y - h * .5, T, 1, "rgba(200,200,200,");
      }
      break;
    case "eighties": {
      var col = TAPE[c % 4];
      if(glow && !RM){ g.shadowColor = col; g.shadowBlur = 16; }
      rr(g, x, y, w, h, 4); g.fillStyle = "#241f3a"; g.fill(); g.shadowBlur = 0;
      g.strokeStyle = col; g.lineWidth = 2; g.stroke();
      g.fillStyle = col; g.fillRect(x + 4, y + 4, Math.max(0, w - 8), h * .22);
      if(w > 56){
        var ry = y + h * .62, rad = h * .2, rot = glow === 2 && !RM ? T * 6 : 0;
        g.fillStyle = "#f1f8ff"; rr(g, x + w * .5 - w * .2, ry - rad - 3, w * .4, rad * 2 + 6, rad + 3); g.fill();
        for(k = -1; k <= 1; k += 2){
          var rx = x + w * .5 + k * w * .13;
          g.fillStyle = "#241f3a"; circ(g, rx, ry, rad);
          g.strokeStyle = "#f1f8ff"; g.lineWidth = 1.5; g.beginPath();
          for(i = 0; i < 3; i++){ var a = rot + i * 2.094; g.moveTo(rx, ry); g.lineTo(rx + Math.cos(a) * rad * .8, ry + Math.sin(a) * rad * .8); }
          g.stroke();
        }
      }
      break; }
    default: {
      g.fillStyle = "rgba(124,245,201,.2)"; g.fillRect(x, y, w, h);
      g.fillStyle = "rgba(124,245,201,.16)"; for(i = y + 3; i < y + h; i += 4) g.fillRect(x, i, w, 1);
      if(glow && !RM){ g.shadowColor = "#7cf5c9"; g.shadowBlur = 14; }
      g.strokeStyle = "#7cf5c9"; g.lineWidth = 1.5; g.strokeRect(x + .75, y + .75, Math.max(0, w - 1.5), h - 1.5); g.shadowBlur = 0;
      if(c % 4 === 2) tinsel(g, x, y, w, s);
    }
  }
}
function tinsel(g, x, y, w, s){
  var cols = ["#ffd23f", "#7cf5c9", "#ff7ad9"];
  g.lineWidth = 2.5;
  for(var i = x + 2, k = 0; i < x + w - 10; i += 12, k++){
    g.strokeStyle = cols[(k + s) % 3]; g.beginPath(); g.arc(i + 6, y + 1, 6, .2, Math.PI - .2); g.stroke();
  }
}
function glyphs(g, x, y, h, s){
  g.fillStyle = "#7a4f1d"; g.strokeStyle = "#7a4f1d"; g.lineWidth = 1.6;
  var u = h * .32, k;
  for(var n = -1; n <= 1; n++){
    var gx = x + n * u * 2.6; k = Math.floor(hr(s + n) * 4);
    g.beginPath();
    if(k === 0){ g.ellipse(gx, y, u * .7, u * .35, 0, 0, 6.2832); g.stroke(); circ(g, gx, y, u * .18); }
    else if(k === 1){ g.moveTo(gx - u, y); for(var i = 0; i < 4; i++) g.quadraticCurveTo(gx - u + i * u * .5 + u * .25, y + (i % 2 ? u * .4 : -u * .4), gx - u + (i + 1) * u * .5, y); g.stroke(); }
    else if(k === 2){ g.arc(gx, y, u * .55, 0, 6.2832); g.stroke(); circ(g, gx, y, u * .15); }
    else { ell(g, gx, y + u * .1, u * .45, u * .3); circ(g, gx + u * .45, y - u * .3, u * .2); g.beginPath(); g.moveTo(gx - u * .2, y + u * .35); g.lineTo(gx - u * .2, y + u * .8); g.stroke(); }
  }
}
function cavePaint(g, x, y, h, s){
  var u = h * .3;
  g.fillStyle = "rgba(150,70,20,.8)"; g.strokeStyle = "rgba(150,70,20,.8)"; g.lineWidth = 1.6;
  if(hr(s * 3) > .5){
    ell(g, x, y, u * 1.2, u * .7); circ(g, x + u * 1.1, y - u * .3, u * .5);
    g.beginPath(); g.moveTo(x + u * 1.5, y - u * .2); g.quadraticCurveTo(x + u * 1.9, y + u * .6, x + u * 1.5, y + u * .9);
    for(var i = -1; i <= 1; i += 2){ g.moveTo(x + i * u * .6, y + u * .4); g.lineTo(x + i * u * .6, y + u * 1.2); }
    g.stroke();
  } else {
    circ(g, x, y - u * .9, u * .3);
    g.beginPath(); g.moveTo(x, y - u * .6); g.lineTo(x, y + u * .3); g.moveTo(x, y + u * .3); g.lineTo(x - u * .4, y + u); g.moveTo(x, y + u * .3); g.lineTo(x + u * .4, y + u);
    g.moveTo(x - u * .6, y - u * .3); g.lineTo(x + u * .6, y - u * .5); g.moveTo(x + u * .6, y - u * 1.1); g.lineTo(x + u * .6, y + u * .3); g.stroke();
  }
}
function puffs(g, x, y, T, s, base){
  for(var k = 0; k < 3; k++){
    var ph = ((T * .35 + k / 3) % 1);
    g.fillStyle = base + ((1 - ph) * .45).toFixed(2) + ")";
    circ(g, x + ph * 18 * s, y - ph * 50 * s, (5 + ph * 12) * s);
  }
}

/* ==========================================================
   Drawing: places, era scenery, people and dogs
   ========================================================== */
var WINR = { x:0, y:0, w:0, h:0 };
function drawPlace(g, id, Wd, gy, T, u){
  var i, x, k;
  switch(id){
    case "sea": {
      g.fillStyle = "#2a5d8c"; g.fillRect(-Wd, gy - 60 * u, Wd * 3, 60 * u);
      g.fillStyle = "rgba(255,220,180,.35)";
      for(k = 0; k < 6; k++){ var yy = gy - 52 * u + k * 9 * u, sh = RM ? 0 : Math.sin(T * .8 + k) * 10 * u; g.fillRect(Wd * .2 + sh + k * 13 * u, yy, 50 * u - k * 4 * u, 2 * u); }
      var py = gy - 30 * u;
      g.fillStyle = "#5a3d2a"; for(x = Wd * .45; x < Wd + 10; x += 22 * u) g.fillRect(x, py, 4 * u, 30 * u);
      g.fillRect(Wd * .45 - 4 * u, py - 5 * u, Wd, 6 * u);
      var wx = Wd * .66, wy = py - 52 * u, wr = 46 * u, rot = RM ? 0 : T * .25;
      g.strokeStyle = "#f1f8ff"; g.lineWidth = 2.5 * u; g.beginPath(); g.arc(wx, wy, wr, 0, 6.2832); g.stroke();
      g.lineWidth = 1.2 * u; g.beginPath();
      for(k = 0; k < 8; k++){ var a = rot + k * .785; g.moveTo(wx, wy); g.lineTo(wx + Math.cos(a) * wr, wy + Math.sin(a) * wr); }
      g.moveTo(wx, wy); g.lineTo(wx - 18 * u, py - 5 * u); g.moveTo(wx, wy); g.lineTo(wx + 18 * u, py - 5 * u); g.stroke();
      for(k = 0; k < 8; k++){ var a2 = rot + k * .785; g.fillStyle = NEON[k % 4]; rr(g, wx + Math.cos(a2) * wr - 5 * u, wy + Math.sin(a2) * wr - 2 * u, 10 * u, 8 * u, 2 * u); g.fill(); }
      g.fillStyle = PLACES.sea.ground; g.fillRect(-Wd, gy, Wd * 3, 3000);
      g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect(-Wd, gy, Wd * 3, 3 * u);
      break; }
    case "desert": {
      g.fillStyle = "#ffb347"; circ(g, Wd * .55, gy - 30 * u, 60 * u);
      g.fillStyle = "#8a3f2b";
      poly(g, [-10, gy, -10, gy - 90 * u, Wd * .12, gy - 96 * u, Wd * .2, gy - 60 * u, Wd * .3, gy - 60 * u, Wd * .34, gy]);
      poly(g, [Wd * .42, gy, Wd * .48, gy - 120 * u, Wd * .66, gy - 124 * u, Wd * .7, gy]);
      g.fillStyle = "#a55234";
      poly(g, [Wd * .62, gy, Wd * .66, gy - 70 * u, Wd * .82, gy - 74 * u, Wd * .86, gy]);
      g.fillStyle = PLACES.desert.ground; g.fillRect(-Wd, gy, Wd * 3, 3000);
      x = Wd * .3; g.fillStyle = "#2f7d4a";
      rr(g, x - 5 * u, gy - 52 * u, 10 * u, 52 * u, 5 * u); g.fill();
      rr(g, x - 18 * u, gy - 38 * u, 7 * u, 20 * u, 3.5 * u); g.fill(); g.fillRect(x - 18 * u, gy - 22 * u, 14 * u, 6 * u);
      rr(g, x + 11 * u, gy - 44 * u, 7 * u, 18 * u, 3.5 * u); g.fill(); g.fillRect(x + 4 * u, gy - 30 * u, 14 * u, 6 * u);
      g.fillStyle = "#ff8fc0"; circ(g, x, gy - 53 * u, 3 * u);
      break; }
    case "snow": {
      g.fillStyle = "#3b4f7a";
      poly(g, [-20, gy, Wd * .18, gy - 150 * u, Wd * .42, gy]);
      poly(g, [Wd * .3, gy, Wd * .58, gy - 190 * u, Wd * .9, gy]);
      poly(g, [Wd * .7, gy, Wd * .92, gy - 120 * u, Wd + 40, gy]);
      g.fillStyle = "#f4f8ff";
      poly(g, [Wd * .18, gy - 150 * u, Wd * .13, gy - 112 * u, Wd * .17, gy - 118 * u, Wd * .2, gy - 108 * u, Wd * .245, gy - 116 * u]);
      poly(g, [Wd * .58, gy - 190 * u, Wd * .51, gy - 146 * u, Wd * .56, gy - 152 * u, Wd * .6, gy - 140 * u, Wd * .66, gy - 150 * u]);
      g.fillStyle = PLACES.snow.ground; g.fillRect(-Wd, gy, Wd * 3, 3000);
      g.fillStyle = "#1f4a3a";
      for(k = 0; k < 5; k++){ x = Wd * (.05 + k * .13) + 6 * u; var th = (34 + 16 * hr(k + 3)) * u;
        poly(g, [x - th * .32, gy - th * .3, x, gy - th, x + th * .32, gy - th * .3]); poly(g, [x - th * .4, gy, x, gy - th * .6, x + th * .4, gy]); }
      break; }
    case "moon": {
      g.fillStyle = "#6f737d";
      poly(g, [-20, gy, Wd * .1, gy - 40 * u, Wd * .25, gy - 30 * u, Wd * .4, gy - 55 * u, Wd * .6, gy - 25 * u, Wd * .8, gy - 45 * u, Wd + 20, gy - 20 * u, Wd + 20, gy]);
      g.fillStyle = PLACES.moon.ground; g.fillRect(-Wd, gy, Wd * 3, 3000);
      g.fillStyle = "rgba(0,0,0,.18)";
      for(k = 0; k < 6; k++) ell(g, Wd * hr(k * 5 + 1), gy + (8 + 22 * hr(k + 7)) * u, (8 + 14 * hr(k)) * u, (3 + 4 * hr(k + 2)) * u);
      x = Wd * .2; g.strokeStyle = "#c9ced8"; g.lineWidth = 2 * u;
      g.beginPath(); g.moveTo(x, gy); g.lineTo(x, gy - 40 * u); g.stroke();
      g.fillStyle = "#c6f03c"; g.fillRect(x, gy - 40 * u, 18 * u, 11 * u);
      break; }
    default: {
      x = -10; i = 0;
      while(x < Wd + 10){
        var bw = (26 + hr(i) * 46) * u, bh = (40 + hr(i + 50) * 110) * u, lit = hr(i + 99);
        g.fillStyle = "#081c30"; g.fillRect(x, gy - bh, bw, bh);
        if(u > .7){
          g.fillStyle = "rgba(255,210,63,.55)";
          for(var wy = gy - bh + 8; wy < gy - 8; wy += 14) for(var wx2 = x + 6; wx2 < x + bw - 6; wx2 += 12){ if(((Math.round(wx2 * 7 + wy * 13) % 10 + 10) % 10) / 10 < lit * .6) g.fillRect(wx2, wy, 5, 7); }
        }
        x += bw + 4 * u; i++;
      }
      g.fillStyle = PLACES.city.ground; g.fillRect(-Wd, gy, Wd * 3, 3000);
    }
  }
}
/* Jay's window: a small building on the right in every place */
function drawJayHouse(g, id, Wd, gy, u, T){
  var x0 = Wd - 66 * u, w = 54 * u;
  switch(id){
    case "sea":
      g.fillStyle = "#f1f8ff"; g.fillRect(x0, gy - 48 * u, w, 48 * u);
      g.fillStyle = "#3ad0ff"; for(var k = 0; k < 4; k++) g.fillRect(x0 + k * w / 4, gy - 48 * u, w / 8, 48 * u);
      g.fillStyle = "#ff7a2f"; poly(g, [x0 - 5 * u, gy - 46 * u, x0 + w / 2, gy - 68 * u, x0 + w + 5 * u, gy - 46 * u]);
      WINR.x = x0 + 18 * u; WINR.y = gy - 38 * u; break;
    case "desert":
      g.fillStyle = "#d9905a"; rr(g, x0, gy - 56 * u, w, 56 * u, 10 * u); g.fill();
      g.fillStyle = "#8a4f2a"; for(var j = 0; j < 4; j++) g.fillRect(x0 + 6 * u + j * 12 * u, gy - 50 * u, 4 * u, 3 * u);
      WINR.x = x0 + 18 * u; WINR.y = gy - 40 * u; break;
    case "snow":
      g.fillStyle = "#7a4a2a"; g.fillRect(x0, gy - 46 * u, w, 46 * u);
      g.fillStyle = "#f4f8ff"; poly(g, [x0 - 8 * u, gy - 42 * u, x0 + w / 2, gy - 74 * u, x0 + w + 8 * u, gy - 42 * u]);
      WINR.x = x0 + 18 * u; WINR.y = gy - 36 * u; break;
    case "moon":
      g.fillStyle = "#d8dde6"; g.beginPath(); g.arc(x0 + w / 2, gy, 32 * u, Math.PI, 0); g.fill();
      g.fillStyle = "#9aa3b2"; g.fillRect(x0 - 6 * u, gy - 4 * u, w + 12 * u, 4 * u);
      WINR.x = x0 + 18 * u; WINR.y = gy - 26 * u; break;
    default:
      g.fillStyle = "#0e2a44"; g.fillRect(x0, gy - 96 * u, w, 96 * u);
      g.fillStyle = "rgba(255,210,63,.3)"; g.fillRect(x0 + 8 * u, gy - 40 * u, 10 * u, 10 * u); g.fillRect(x0 + 34 * u, gy - 40 * u, 10 * u, 10 * u); g.fillRect(x0 + 34 * u, gy - 78 * u, 10 * u, 10 * u);
      WINR.x = x0 + 8 * u; WINR.y = gy - 78 * u;
  }
  WINR.w = 18 * u; WINR.h = 16 * u;
  g.fillStyle = "#ffd98a"; g.fillRect(WINR.x, WINR.y, WINR.w, WINR.h);
  /* someone moves about behind it now and then */
  var ph = (T % 7) / 7;
  if(ph < .3 && !RM){ g.fillStyle = "rgba(60,35,15,.55)"; var sx = WINR.x + WINR.w * (ph / .3); circ(g, Math.min(WINR.x + WINR.w - 3 * u, Math.max(WINR.x + 3 * u, sx)), WINR.y + WINR.h * .6, 4 * u); }
  g.strokeStyle = "#3a2a1a"; g.lineWidth = 1.5 * u; g.strokeRect(WINR.x, WINR.y, WINR.w, WINR.h);
  g.beginPath(); g.moveTo(WINR.x + WINR.w / 2, WINR.y); g.lineTo(WINR.x + WINR.w / 2, WINR.y + WINR.h); g.stroke();
}

function drawEra(g, id, Wd, gy, T, u, near){
  var x, k, a;
  switch(id){
    case "stone":
      if(!near){
        x = Wd * .22; g.fillStyle = "#5a4636";
        poly(g, [x - 95 * u, gy, x - 18 * u, gy - 125 * u, x + 18 * u, gy - 125 * u, x + 95 * u, gy]);
        g.fillStyle = "#ff9a3c"; poly(g, [x - 18 * u, gy - 125 * u, x + 18 * u, gy - 125 * u, x + 10 * u, gy - 112 * u, x - 4 * u, gy - 118 * u, x - 12 * u, gy - 110 * u]);
        puffs(g, x, gy - 128 * u, T, u * 1.4, "rgba(120,110,100,");
      } else {
        x = Wd - (((T * 16) % (Wd + 220)) - 110);
        mammoth(g, x, gy, 30 * u, T);
      }
      break;
    case "egypt":
      if(!near){
        pyramid(g, Wd * .14, gy, 150 * u, 96 * u); pyramid(g, Wd * .4, gy, 110 * u, 70 * u); pyramid(g, Wd * .03, gy, 70 * u, 44 * u);
      } else {
        x = Wd - (((T * 14) % (Wd + 220)) - 110);
        camel(g, x, gy, 28 * u, T);
        palm(g, Wd * .56, gy, 60 * u, T);
      }
      break;
    case "rome":
      if(!near){
        g.fillStyle = "#b9a98e";
        g.fillRect(-10, gy - 82 * u, Wd + 20, 16 * u);
        var gap = 34 * u, pw = 10 * u;
        for(x = -10; x < Wd + 10; x += gap + pw){
          g.fillRect(x, gy - 66 * u, pw, 66 * u);
          var l = x + pw, r = l + gap, m = (l + r) / 2;
          g.beginPath(); g.moveTo(l, gy - 66 * u); g.lineTo(l, gy - 50 * u); g.arc(m, gy - 50 * u, gap / 2, Math.PI, Math.PI * 2); g.lineTo(r, gy - 66 * u); g.closePath(); g.fill();
        }
        g.fillStyle = "rgba(0,0,0,.12)"; g.fillRect(-10, gy - 70 * u, Wd + 20, 4 * u);
      }
      break;
    case "viking":
      if(!near){
        g.fillStyle = "#2c4a3c";
        poly(g, [-20, gy - 26 * u, -20, gy - 150 * u, Wd * .15, gy - 110 * u, Wd * .3, gy - 26 * u]);
        poly(g, [Wd * .5, gy - 26 * u, Wd * .78, gy - 140 * u, Wd + 20, gy - 160 * u, Wd + 20, gy - 26 * u]);
        g.fillStyle = "#2b4f6e"; g.fillRect(-Wd, gy - 26 * u, Wd * 3, 26 * u);
      } else {
        longship(g, Wd * .34 + (RM ? 0 : Math.sin(T * .5) * 20 * u), gy - 12 * u + (RM ? 0 : Math.sin(T * 1.6) * 2 * u), 60 * u, T);
      }
      break;
    case "victorian":
      if(!near){
        g.fillStyle = "#4b332b"; g.fillRect(Wd * .04, gy - 70 * u, Wd * .36, 70 * u);
        g.fillStyle = "#5a3a30";
        var cx3 = [.08, .2, .32], chh = [150, 118, 170];
        for(k = 0; k < 3; k++){ g.fillRect(Wd * cx3[k], gy - chh[k] * u, 14 * u, chh[k] * u); puffs(g, Wd * cx3[k] + 7 * u, gy - chh[k] * u, T + k * 1.3, u * 1.5, "rgba(170,165,160,"); }
        g.fillStyle = "rgba(255,210,120,.5)"; for(k = 0; k < 5; k++) g.fillRect(Wd * .06 + k * Wd * .065, gy - 40 * u, 10 * u, 14 * u);
      } else {
        x = Wd * .5; g.strokeStyle = "#1d1712"; g.lineWidth = 3 * u;
        g.beginPath(); g.moveTo(x, gy); g.lineTo(x, gy - 62 * u); g.stroke();
        g.fillStyle = "rgba(255,210,120,.25)"; circ(g, x, gy - 68 * u, 20 * u);
        g.fillStyle = "#ffd98a"; g.fillRect(x - 6 * u, gy - 76 * u, 12 * u, 14 * u);
        g.fillStyle = "#1d1712"; poly(g, [x - 9 * u, gy - 76 * u, x, gy - 84 * u, x + 9 * u, gy - 76 * u]);
      }
      break;
    case "eighties":
      if(!near){
        var sy = gy - 36 * u, sr = 74 * u;
        var gr = g.createLinearGradient(0, sy - sr, 0, sy + sr * .4); gr.addColorStop(0, "#ffd23f"); gr.addColorStop(1, "#ff4fa3");
        g.fillStyle = gr; g.beginPath(); g.arc(Wd * .5, sy, sr, Math.PI, 0); g.fill();
        g.fillStyle = "#2b0b4a"; for(k = 0; k < 5; k++) g.fillRect(Wd * .5 - sr, sy - 8 * u - k * 13 * u, sr * 2, (2 + k * .6) * u);
      } else {
        g.strokeStyle = "rgba(255,79,163,.65)"; g.lineWidth = 1.5;
        g.beginPath();
        var off = RM ? 0 : (T * .6) % 1;
        for(k = 0; k < 8; k++){ var yy = gy + Math.pow(k + off, 2) * 2.2 * u; g.moveTo(-10, yy); g.lineTo(Wd + 10, yy); }
        for(k = -8; k <= 8; k++){ g.moveTo(Wd * .5 + k * 8 * u, gy); g.lineTo(Wd * .5 + k * 70 * u, gy + 150 * u); }
        g.stroke();
      }
      break;
    case "future":
      if(!near){
        x = Wd * .3; g.fillStyle = "#1a3358"; g.fillRect(x - 6 * u, gy - 200 * u, 12 * u, 200 * u);
        g.strokeStyle = "#7cf5c9"; g.lineWidth = 2 * u;
        for(k = 0; k < 3; k++){ var ry = gy - (90 + k * 40) * u + (RM ? 0 : Math.sin(T * 1.2 + k) * 4 * u); g.beginPath(); g.ellipse(x, ry, 30 * u - k * 6 * u, 6 * u, 0, 0, 6.2832); g.stroke(); }
        for(k = 0; k < 3; k++){
          var lane = gy - (110 + k * 45) * u, sp = (30 + k * 14) * (k % 2 ? -1 : 1);
          var hx = ((T * sp + k * 200) % (Wd + 120) + Wd + 120) % (Wd + 120) - 60;
          g.fillStyle = ["#ff7ad9", "#7cf5c9", "#ffd23f"][k]; rr(g, hx - 14 * u, lane - 5 * u, 28 * u, 10 * u, 5 * u); g.fill();
          g.fillStyle = "rgba(124,245,201,.3)"; g.fillRect(hx - 10 * u, lane + 6 * u, 20 * u, 3 * u);
        }
      } else {
        xmasTree(g, Wd * .1, gy, 52 * u, T);
      }
      break;
  }
}
function pyramid(g, x, gy, w, h){
  g.fillStyle = "#e0b35a"; poly(g, [x - w / 2, gy, x, gy - h, x + w / 2, gy]);
  g.fillStyle = "#b88a35"; poly(g, [x, gy - h, x + w / 2, gy, x + w * .12, gy]);
}
function mammoth(g, x, gy, s, T){
  var st = RM ? 0 : Math.sin(T * 5) * s * .12;
  g.fillStyle = "#6b4a2e";
  g.fillRect(x - s * .55 + st, gy - s * .55, s * .2, s * .55); g.fillRect(x + s * .25 - st, gy - s * .55, s * .2, s * .55);
  ell(g, x, gy - s * .75, s * .75, s * .5);
  circ(g, x - s * .7, gy - s * .9, s * .38);
  g.strokeStyle = "#6b4a2e"; g.lineWidth = s * .16; g.lineCap = "round";
  g.beginPath(); g.moveTo(x - s * .95, gy - s * .8); g.quadraticCurveTo(x - s * 1.2, gy - s * .3, x - s * 1.05, gy - s * .15); g.stroke();
  g.strokeStyle = "#f4ecd8"; g.lineWidth = s * .08;
  g.beginPath(); g.moveTo(x - s * .85, gy - s * .65); g.quadraticCurveTo(x - s * 1.3, gy - s * .55, x - s * 1.25, gy - s * .85); g.stroke();
  g.lineCap = "butt";
  g.fillStyle = "#1d1712"; circ(g, x - s * .8, gy - s * 1, s * .05);
}
function camel(g, x, gy, s, T){
  var st = RM ? 0 : Math.sin(T * 5) * s * .12;
  g.fillStyle = "#b07a3c";
  g.fillRect(x - s * .5 + st, gy - s * .8, s * .12, s * .8); g.fillRect(x + s * .38 - st, gy - s * .8, s * .12, s * .8);
  ell(g, x, gy - s * .95, s * .65, s * .3); circ(g, x, gy - s * 1.2, s * .3);
  g.strokeStyle = "#b07a3c"; g.lineWidth = s * .16; g.beginPath(); g.moveTo(x - s * .55, gy - s * 1); g.lineTo(x - s * .85, gy - s * 1.55); g.stroke();
  ell(g, x - s * .95, gy - s * 1.6, s * .2, s * .12);
  g.fillStyle = "#1d1712"; circ(g, x - s * .95, gy - s * 1.65, s * .04);
}
function palm(g, x, gy, h, T){
  g.strokeStyle = "#7a5230"; g.lineWidth = h * .08;
  g.beginPath(); g.moveTo(x, gy); g.quadraticCurveTo(x + h * .15, gy - h * .5, x + h * .05, gy - h); g.stroke();
  g.fillStyle = "#2f7d4a";
  var sw = RM ? 0 : Math.sin(T * 1.3) * .08;
  for(var k = 0; k < 5; k++){ ell(g, x + h * .05 + Math.cos(k * 1.25 + sw) * h * .25, gy - h + Math.sin(k * 1.25) * h * .08, h * .28, h * .06, k * 1.25 + sw); }
}
function longship(g, x, y, s, T){
  g.fillStyle = "#3a2a1a"; g.fillRect(x - 2, y - s * 1.1, 4, s * 1.1);
  g.fillStyle = "#e8dcc0"; g.fillRect(x - s * .45, y - s * 1.05, s * .9, s * .75);
  g.fillStyle = "#c0503a"; for(var k = 0; k < 3; k++) g.fillRect(x - s * .45 + k * s * .3, y - s * 1.05, s * .15, s * .75);
  g.fillStyle = "#7a4a24";
  g.beginPath(); g.moveTo(x - s, y - s * .35); g.quadraticCurveTo(x - s * .7, y + s * .25, x, y + s * .22); g.quadraticCurveTo(x + s * .7, y + s * .25, x + s, y - s * .35);
  g.lineTo(x + s * .9, y - s * .1); g.lineTo(x - s * .9, y - s * .1); g.closePath(); g.fill();
  g.strokeStyle = "#7a4a24"; g.lineWidth = s * .09; g.lineCap = "round";
  g.beginPath(); g.moveTo(x + s * .95, y - s * .3); g.quadraticCurveTo(x + s * 1.15, y - s * .6, x + s * 1.02, y - s * .75); g.stroke();
  g.beginPath(); g.moveTo(x - s * .95, y - s * .3); g.quadraticCurveTo(x - s * 1.15, y - s * .55, x - s * 1.1, y - s * .62); g.stroke();
  g.lineCap = "butt";
  g.fillStyle = "#7a4a24"; ell(g, x + s * 1.08, y - s * .78, s * .12, s * .07);
  for(k = -3; k <= 3; k++){ g.fillStyle = k % 2 ? "#d9a441" : "#3c6fb0"; circ(g, x + k * s * .22, y - s * .13, s * .09); }
}
function xmasTree(g, x, gy, h, T){
  g.fillStyle = "#5a3a20"; g.fillRect(x - h * .06, gy - h * .15, h * .12, h * .15);
  g.fillStyle = "#1f6a46";
  poly(g, [x - h * .4, gy - h * .12, x, gy - h * .6, x + h * .4, gy - h * .12]);
  poly(g, [x - h * .3, gy - h * .45, x, gy - h * .9, x + h * .3, gy - h * .45]);
  var cols = ["#ffd23f", "#ff7ad9", "#7cf5c9"];
  for(var k = 0; k < 6; k++){ g.fillStyle = cols[k % 3]; circ(g, x + (hr(k) - .5) * h * .45, gy - h * (.2 + .55 * hr(k + 9)) , h * .04); }
  star(g, x, gy - h * .93, h * .1, "#ffd23f");
}
function star(g, x, y, r, col){
  g.fillStyle = col; g.beginPath();
  for(var i = 0; i < 10; i++){ var a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * .45 : r; g.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); }
  g.closePath(); g.fill();
}

/* Jay: messy brown hair, big eyebrows. (x, y) is the middle of his head */
function drawJay(g, x, y, s, pose, T){
  g.fillStyle = "#2f6f8f"; rr(g, x - s * 1.5, y + s * .85, s * 3, s * 2.4, s * .8); g.fill();
  g.fillStyle = "#e9b892"; g.fillRect(x - s * .3, y + s * .6, s * .6, s * .45);
  g.fillStyle = "#f1c7a0";
  circ(g, x - s * .85, y + s * .1, s * .2); circ(g, x + s * .85, y + s * .1, s * .2);
  ell(g, x, y, s * .85, s);
  g.fillStyle = "#6b3e1f";
  for(var k = 0; k < 8; k++){ var a = Math.PI * (1.02 + k * .136); circ(g, x + Math.cos(a) * s * .72, y + Math.sin(a) * s * .78 - s * .08, s * (.3 + .07 * (k % 2))); }
  poly(g, [x - s * .3, y - s * .95, x - s * .1, y - s * 1.45, x + s * .05, y - s * .95]);
  poly(g, [x + s * .1, y - s * .95, x + s * .45, y - s * 1.35, x + s * .5, y - s * .85]);
  poly(g, [x - s * .7, y - s * .7, x - s * .95, y - s * 1.1, x - s * .4, y - s * .9]);
  g.strokeStyle = "#3d220e"; g.lineWidth = s * .2; g.lineCap = "round";
  var lift = pose === "stop" ? s * .08 : 0;
  g.beginPath(); g.moveTo(x - s * .58, y - s * .2); g.lineTo(x - s * .14, y - s * .3 - lift);
  g.moveTo(x + s * .14, y - s * .3 - lift); g.lineTo(x + s * .58, y - s * .2); g.stroke();
  g.fillStyle = "#1d1712"; circ(g, x - s * .33, y + s * .02, s * .09); circ(g, x + s * .33, y + s * .02, s * .09);
  g.strokeStyle = "#7a3b2a"; g.lineWidth = s * .09;
  g.beginPath();
  if(pose === "stop"){ g.moveTo(x - s * .25, y + s * .5); g.lineTo(x + s * .25, y + s * .5); }
  else g.arc(x, y + s * .3, s * .3, .3, Math.PI - .3);
  g.stroke(); g.lineCap = "butt";
  if(pose === "wave" || pose === "stop"){
    var hx = x + s * 1.55, hy = y + (pose === "wave" ? -s * .2 + (RM ? 0 : Math.sin(T * 9) * s * .15) : s * .1);
    g.strokeStyle = "#2f6f8f"; g.lineWidth = s * .45; g.lineCap = "round";
    g.beginPath(); g.moveTo(x + s * 1.1, y + s * 1.3); g.lineTo(hx, hy + s * .4); g.stroke(); g.lineCap = "butt";
    g.fillStyle = "#f1c7a0"; rr(g, hx - s * .3, hy - s * .35, s * .6, s * .7, s * .2); g.fill();
    for(k = 0; k < 4; k++) rr(g, hx - s * .28 + k * s * .15, hy - s * .62, s * .12, s * .4, s * .06), g.fill();
  }
}
/* Bonnie: a small brown toy poodle with no tail. (x, y) = her feet */
function drawBonnie(g, x, y, s, T, helmet, face){
  var f = face || 1, flap = RM ? 0 : Math.sin(T * 9) * .15;
  g.save(); g.translate(x, y); g.scale(f, 1);
  g.fillStyle = "#6e4429";
  g.fillRect(-s * .38, -s * .32, s * .1, s * .32); g.fillRect(-s * .2, -s * .32, s * .1, s * .32);
  g.fillRect(s * .1, -s * .32, s * .1, s * .32); g.fillRect(s * .26, -s * .32, s * .1, s * .32);
  g.fillStyle = "#8b5a3c";
  circ(g, -s * .33, -s * .03, s * .08); circ(g, -s * .15, -s * .03, s * .08); circ(g, s * .15, -s * .03, s * .08); circ(g, s * .31, -s * .03, s * .08);
  circ(g, -s * .25, -s * .45, s * .2); circ(g, 0, -s * .5, s * .22); circ(g, s * .2, -s * .45, s * .2);
  g.fillStyle = "#a8734f"; circ(g, -s * .1, -s * .58, s * .1); circ(g, s * .12, -s * .6, s * .09);
  g.fillStyle = "#8b5a3c"; circ(g, s * .36, -s * .8, s * .2);
  g.fillStyle = "#a8734f"; circ(g, s * .3, -s * 1, s * .12); circ(g, s * .44, -s * .98, s * .1);
  g.fillStyle = "#8b5a3c"; ell(g, s * .56, -s * .74, s * .13, s * .09);
  g.fillStyle = "#1d1712"; circ(g, s * .68, -s * .76, s * .045); circ(g, s * .44, -s * .84, s * .035);
  g.fillStyle = "#6e4429"; ell(g, s * .24, -s * .66, s * .09, s * .2, .35 + flap);
  g.restore();
  if(helmet){
    g.fillStyle = "rgba(200,240,255,.25)"; circ(g, x + s * .4 * f, y - s * .82, s * .42);
    g.strokeStyle = "rgba(240,250,255,.9)"; g.lineWidth = Math.max(1.5, s * .05); g.beginPath(); g.arc(x + s * .4 * f, y - s * .82, s * .42, 0, 6.2832); g.stroke();
    g.strokeStyle = "rgba(255,255,255,.7)"; g.beginPath(); g.arc(x + s * .4 * f, y - s * .82, s * .3, -2.4, -1.6); g.stroke();
  }
}
function drawRobin(g, x, y, s, T, flying){
  g.fillStyle = "#6b4a2e";
  g.beginPath(); g.moveTo(x - s * .4, y - s * .45); g.lineTo(x - s * .95, y - s * .55); g.lineTo(x - s * .85, y - s * .3); g.closePath(); g.fill();
  ell(g, x, y - s * .45, s * .52, s * .42);
  g.fillStyle = "#f07a3a"; ell(g, x + s * .22, y - s * .45, s * .3, s * .3);
  g.fillStyle = "#6b4a2e"; circ(g, x + s * .3, y - s * .9, s * .28);
  g.fillStyle = "#f07a3a"; ell(g, x + s * .4, y - s * .82, s * .14, s * .14);
  g.fillStyle = "#1d1712"; circ(g, x + s * .38, y - s * .96, s * .05);
  poly(g, [x + s * .55, y - s * .92, x + s * .75, y - s * .86, x + s * .55, y - s * .82]);
  g.fillStyle = "#5a3d24";
  if(flying){ var a = RM ? 0 : Math.sin(T * 22) * .9; ell(g, x - s * .05, y - s * .6, s * .45, s * .15, -.4 + a); }
  else { ell(g, x - s * .12, y - s * .5, s * .32, s * .2, .2);
    g.strokeStyle = "#4a3020"; g.lineWidth = Math.max(1, s * .06); g.beginPath(); g.moveTo(x - s * .05, y - s * .08); g.lineTo(x - s * .05, y); g.moveTo(x + s * .12, y - s * .08); g.lineTo(x + s * .12, y); g.stroke(); }
}
function drawSaucer(g, x, y, s, T){
  drawBonnie(g, x - s * .25, y - s * .05, s * .62, T, false, 1);
  g.fillStyle = "rgba(170,225,255,.35)"; g.beginPath(); g.arc(x, y - s * .1, s * .55, Math.PI, 0); g.fill();
  g.strokeStyle = "rgba(240,250,255,.85)"; g.lineWidth = 2; g.beginPath(); g.arc(x, y - s * .1, s * .55, Math.PI, 0); g.stroke();
  g.fillStyle = "#b8c2d6"; ell(g, x, y, s * 1.3, s * .32);
  g.fillStyle = "#8a94aa"; ell(g, x, y + s * .1, s * .8, s * .14);
  for(var k = 0; k < 6; k++){ g.fillStyle = NEON[(k + Math.floor(RM ? 0 : T * 2)) % 4]; circ(g, x - s * 1 + k * s * .4, y + s * .02, s * .07); }
}
function drawPow(g, id, x, y, r){
  g.fillStyle = "#0b2840"; circ(g, x, y, r);
  g.strokeStyle = "#f1f8ff"; g.lineWidth = Math.max(1.5, r * .12); g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.stroke();
  var s = r * .62, k;
  switch(id){
    case "laser":
      g.fillStyle = "#c9d6e6"; rr(g, x - s, y + s * .2, s * .9, s * .6, s * .15); g.fill();
      g.strokeStyle = "#3ad0ff"; g.lineWidth = Math.max(1.5, r * .16); g.beginPath(); g.moveTo(x - s * .1, y + s * .4); g.lineTo(x + s, y - s * .8); g.stroke();
      g.fillStyle = "#e9fbff"; circ(g, x + s, y - s * .8, r * .12); break;
    case "slow":
      g.fillStyle = "#f1f8ff"; circ(g, x, y, s);
      g.strokeStyle = "#0b2840"; g.lineWidth = Math.max(1.5, r * .12); g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - s * .7); g.moveTo(x, y); g.lineTo(x + s * .5, y + s * .2); g.stroke(); break;
    case "magnet":
      g.strokeStyle = "#b48cff"; g.lineWidth = s * .55; g.beginPath(); g.arc(x, y - s * .05, s * .55, Math.PI, 0, true); g.stroke();
      g.fillStyle = "#e6ecf5"; g.fillRect(x - s * .82, y - s * .1, s * .55, s * .5); g.fillRect(x + s * .27, y - s * .1, s * .55, s * .5); break;
    case "glue":
      g.fillStyle = "#f1f8ff"; rr(g, x - s * .45, y - s * .5, s * .9, s * 1.2, s * .2); g.fill();
      g.fillStyle = "#7ee08a"; g.fillRect(x - s * .2, y - s * .9, s * .4, s * .4);
      g.fillRect(x - s * .45, y - s * .05, s * .9, s * .35); circ(g, x + s * .3, y + s * .5, s * .15); break;
    case "pump":
      g.fillStyle = "#c6f03c"; poly(g, [x, y - s, x + s * .75, y - s * .1, x + s * .3, y - s * .1, x + s * .3, y + s * .8, x - s * .3, y + s * .8, x - s * .3, y - s * .1, x - s * .75, y - s * .1]); break;
    case "net":
      g.strokeStyle = "#ffd23f"; g.lineWidth = Math.max(1, r * .1); g.beginPath();
      for(k = -2; k <= 2; k++){ g.moveTo(x + k * s * .35 - s * .3, y - s * .7); g.lineTo(x + k * s * .35 + s * .3, y + s * .7); g.moveTo(x + k * s * .35 + s * .3, y - s * .7); g.lineTo(x + k * s * .35 - s * .3, y + s * .7); }
      g.stroke(); break;
  }
}
/* landmark silhouettes, drawn to height h with the base at (x, by) */
function drawLandmark(g, s, x, by, h, col, maxHalf){
  g.fillStyle = col; var k;
  switch(s){
    case "giraffe":
      for(k = 0; k < 4; k++) g.fillRect(x - h * .2 + k * h * .12, by - h * .42, h * .05, h * .42);
      ell(g, x, by - h * .45, h * .24, h * .12);
      poly(g, [x + h * .1, by - h * .5, x + h * .22, by - h * .92, x + h * .3, by - h * .9, x + h * .22, by - h * .45]);
      ell(g, x + h * .3, by - h * .93, h * .1, h * .06, .3);
      g.fillRect(x + h * .24, by - h, h * .02, h * .06); break;
    case "whale":
      poly(g, [x, by - h * .1, x - h * .18, by, x - h * .04, by - h * .03, x, by - h * .06, x + h * .04, by - h * .03, x + h * .18, by]);
      ell(g, x, by - h * .55, h * .12, h * .45); break;
    case "column":
      g.fillRect(x - h * .09, by - h * .1, h * .18, h * .1); g.fillRect(x - h * .035, by - h * .88, h * .07, h * .8);
      g.fillRect(x - h * .06, by - h * .9, h * .12, h * .04); g.fillRect(x - h * .015, by - h, h * .03, h * .1); circ(g, x, by - h * .97, h * .025); break;
    case "clock":
      g.fillRect(x - h * .09, by - h * .72, h * .18, h * .72); g.fillRect(x - h * .07, by - h * .82, h * .14, h * .1);
      poly(g, [x - h * .08, by - h * .82, x, by - h, x + h * .08, by - h * .82]);
      g.fillStyle = "rgba(255,255,255,.55)"; circ(g, x, by - h * .62, h * .05); break;
    case "spire":
      g.fillRect(x - h * .32, by - h * .16, h * .64, h * .16); g.fillRect(x - h * .06, by - h * .4, h * .12, h * .24);
      poly(g, [x - h * .05, by - h * .4, x, by - h, x + h * .05, by - h * .4]); break;
    case "pyramid":
      poly(g, [x - Math.min(h * .78, maxHalf || 1e9), by, x, by - h, x + Math.min(h * .78, maxHalf || 1e9), by]); break;
    case "lattice":
      g.beginPath(); g.moveTo(x - h * .18, by); g.lineTo(x - h * .1, by); g.quadraticCurveTo(x, by - h * .22, x + h * .1, by); g.lineTo(x + h * .18, by);
      g.lineTo(x + h * .03, by - h * .6); g.lineTo(x + h * .012, by - h); g.lineTo(x - h * .012, by - h); g.lineTo(x - h * .03, by - h * .6); g.closePath(); g.fill();
      g.fillRect(x - h * .08, by - h * .32, h * .16, h * .03); break;
    case "shard":
      poly(g, [x - h * .11, by, x + h * .11, by, x + h * .025, by - h * .95, x + h * .01, by - h, x - h * .01, by - h * .93, x - h * .03, by - h * .97]); break;
    case "stepped":
      g.fillRect(x - h * .13, by - h * .55, h * .26, h * .55); g.fillRect(x - h * .09, by - h * .72, h * .18, h * .17);
      g.fillRect(x - h * .05, by - h * .82, h * .1, h * .1); g.fillRect(x - h * .025, by - h * .88, h * .05, h * .06); g.fillRect(x - h * .006, by - h, h * .012, h * .12); break;
    case "needle":
      poly(g, [x - h * .04, by, x + h * .04, by, x + h * .012, by - h * .62, x - h * .012, by - h * .62]);
      ell(g, x, by - h * .63, h * .06, h * .03); g.fillRect(x - h * .006, by - h, h * .012, h * .38); break;
    case "skytree":
      poly(g, [x - h * .07, by, x + h * .07, by, x + h * .015, by - h * .78, x - h * .015, by - h * .78]);
      ell(g, x, by - h * .55, h * .045, h * .02); ell(g, x, by - h * .72, h * .035, h * .018); g.fillRect(x - h * .006, by - h, h * .012, h * .25); break;
    case "burj":
      for(k = 0; k < 6; k++){ var wk = h * (.15 - k * .022); g.fillRect(x - wk / 2, by - h * (.22 + k * .1), wk, h * (.22 + k * .1)); }
      poly(g, [x - h * .01, by - h * .8, x, by - h, x + h * .01, by - h * .8]); break;
    case "mountain":
      var hw = Math.min(h * 1.3, maxHalf || 1e9);
      poly(g, [x - hw, by, x - hw * .3, by - h * .7, x, by - h, x + hw * .4, by - h * .6, x + hw, by]);
      g.fillStyle = "rgba(255,255,255,.75)"; poly(g, [x - hw * .2, by - h * .78, x, by - h, x + hw * .15, by - h * .82, x, by - h * .86]); break;
    case "rocket":
      rr(g, x - h * .12, by - h * .85, h * .24, h * .7, h * .12); g.fill();
      poly(g, [x - h * .12, by - h * .7, x, by - h, x + h * .12, by - h * .7]);
      poly(g, [x - h * .12, by - h * .35, x - h * .25, by - h * .12, x - h * .12, by - h * .2]); poly(g, [x + h * .12, by - h * .35, x + h * .25, by - h * .12, x + h * .12, by - h * .2]);
      g.fillStyle = "rgba(255,180,80,.8)"; poly(g, [x - h * .08, by - h * .15, x, by, x + h * .08, by - h * .15]); break;
    case "moon":
      circ(g, x, by - h * .5, h * .45); g.fillStyle = "rgba(0,0,0,.18)"; circ(g, x - h * .12, by - h * .6, h * .1); circ(g, x + h * .15, by - h * .4, h * .07); break;
    case "sat":
      g.fillRect(x - h * .12, by - h * .6, h * .24, h * .24); g.fillRect(x - h * .5, by - h * .55, h * .32, h * .14); g.fillRect(x + h * .18, by - h * .55, h * .32, h * .14);
      g.fillRect(x - h * .01, by - h * .85, h * .02, h * .25); break;
  }
}
function bubble(g, x, y, text, maxW, size, areaW){
  g.font = "700 " + size + "px " + FONT;
  var words = text.split(" "), lines = [], line = "";
  for(var i = 0; i < words.length; i++){
    var test = line ? line + " " + words[i] : words[i];
    if(g.measureText(test).width > maxW - 20 && line){ lines.push(line); line = words[i]; } else line = test;
  }
  lines.push(line);
  var w = 0; for(i = 0; i < lines.length; i++) w = Math.max(w, g.measureText(lines[i]).width);
  w += 20; var h = lines.length * size * 1.25 + 14;
  var bx = Math.max(6, Math.min(x - w / 2, areaW - w - 6)), by = y - h;
  g.fillStyle = "#fffdf6"; rr(g, bx, by, w, h, 12); g.fill();
  poly(g, [x - 8, y - 1, x + 2, y + 12, x + 8, y - 1]);
  g.strokeStyle = "#0b2840"; g.lineWidth = 2; rr(g, bx, by, w, h, 12); g.stroke();
  g.fillStyle = "#0b2840"; g.textAlign = "left";
  for(i = 0; i < lines.length; i++) g.fillText(lines[i], bx + 10, by + 7 + size * (i + 1) * 1.25 - size * .25);
}

/* ---------- styles for the extra screens ---------- */
function injectCss(){
  if(document.getElementById("ns-css")) return;
  var s = el("style"); s.id = "ns-css";
  s.textContent =
    ".hqb-stack .ns-bar{position:absolute;top:8px;right:8px;z-index:6;display:flex;gap:6px}" +
    ".hqb-stack .ns-bar button{min-height:42px;padding:6px 12px;border-radius:12px;border:2px solid rgba(241,248,255,.35);background:rgba(4,12,24,.78);color:#f1f8ff;font-weight:800;font-size:.92rem}" +
    ".hqb-stack .ns-bar button:hover{border-color:#c6f03c}" +
    ".hqb-stack .ns-chip{position:absolute;left:50%;top:100px;transform:translateX(-50%);z-index:4;width:min(92%,420px);padding:8px 12px;border-radius:14px;background:rgba(4,12,24,.8);color:#f1f8ff;text-align:center;pointer-events:none;border:2px solid rgba(241,248,255,.2);line-height:1.3}" +
    ".hqb-stack .ns-chip b{display:block;font-size:1rem}" +
    ".hqb-stack .ns-chip span{display:block;font-size:.86rem;opacity:.9}" +
    ".hqb-stack .ns-chip .ns-nx{opacity:.7;font-size:.8rem;margin-top:2px}" +
    ".hqb-stack .hqb-stage.ns-play .ns-bar,.hqb-stack .hqb-stage.ns-play .ns-chip,.hqb-stack .hqb-stage.ns-end .ns-chip{display:none}" +
    ".hqb-stack .hqb-stage.ns-end .hqb-card{top:auto;bottom:10px;transform:translateX(-50%)}" +
    ".hqb-stack .ns-panel{position:absolute;inset:0;z-index:8;background:#081a2c;color:#f1f8ff;display:flex;flex-direction:column}" +
    ".hqb-stack .ns-panel[hidden]{display:none}" +
    ".hqb-stack .ns-ph{display:flex;align-items:center;gap:10px;padding:12px 12px 6px}" +
    ".hqb-stack .ns-ph h2{flex:1;margin:0;font-size:1.35rem;font-weight:900;line-height:1.1}" +
    ".hqb-stack .ns-ph h2 small{display:block;font-size:.8rem;font-weight:700;opacity:.75;margin-top:2px}" +
    ".hqb-stack .ns-done{min-height:44px;padding:6px 18px;border-radius:12px;border:3px solid #f1f8ff;background:#c6f03c;color:#0b2840;font-weight:900;font-size:1rem}" +
    ".hqb-stack .ns-scroll{flex:1;overflow-y:auto;padding:0 12px 18px;-webkit-overflow-scrolling:touch}" +
    ".hqb-stack .ns-scroll h3{margin:14px 2px 8px;font-size:.95rem;font-weight:800;opacity:.85;letter-spacing:.02em}" +
    ".hqb-stack .ns-intro{margin:4px 2px 4px;font-size:.92rem;opacity:.85;line-height:1.35}" +
    ".hqb-stack .ns-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(102px,1fr));gap:8px}" +
    ".hqb-stack .ns-tile{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 5px 9px;border-radius:14px;border:2px solid rgba(241,248,255,.16);background:rgba(255,255,255,.05);color:inherit;text-align:center;font-weight:800;font-size:.84rem;line-height:1.15}" +
    ".hqb-stack .ns-tile canvas{width:96px;height:64px;display:block;border-radius:8px}" +
    ".hqb-stack .ns-tile small{display:block;font-family:var(--body,'Atkinson Hyperlegible',Verdana,sans-serif);font-weight:600;opacity:.75;font-size:.72rem;line-height:1.2}" +
    ".hqb-stack .ns-tile.on{border-color:#c6f03c;background:rgba(198,240,60,.12)}" +
    ".hqb-stack .ns-tile.lock{border-style:dashed}" +
    ".hqb-stack .ns-tile.next{border-color:rgba(255,210,63,.6)}" +
    ".hqb-stack .ns-tile .ns-on{position:absolute;top:4px;right:4px;padding:1px 6px;border-radius:999px;background:#c6f03c;color:#0b2840;font-size:.68rem}" +
    ".hqb-stack .ns-cameo{position:absolute;left:8px;bottom:8px;z-index:7;display:flex;align-items:flex-end;gap:2px;pointer-events:none;transform:translateY(130%);transition:transform .35s ease}" +
    ".hqb-stack .ns-cameo.in{transform:none}" +
    ".hqb-stack .ns-cameo canvas{width:110px;height:130px;flex:none}" +
    ".hqb-stack .ns-cameo p{margin:0 0 96px;max-width:220px;padding:9px 12px;border-radius:14px;background:#fffdf6;color:#0b2840;border:2px solid #0b2840;font-weight:700;font-size:.95rem;line-height:1.3}" +
    ".hqb-stack .ns-toast{position:absolute;left:50%;bottom:10px;z-index:7;transform:translate(-50%,160%);transition:transform .3s ease;display:flex;align-items:center;gap:8px;padding:6px 14px 6px 6px;border-radius:999px;background:#fffdf6;color:#0b2840;border:2px solid #0b2840;font-weight:800;font-size:.9rem;pointer-events:none;white-space:nowrap}" +
    ".hqb-stack .ns-toast.in{transform:translate(-50%,0)}" +
    ".hqb-stack .ns-toast canvas{width:34px;height:34px;border-radius:50%;background:#0b2840}" +
    "@media (prefers-reduced-motion:reduce){.hqb-stack .ns-cameo,.hqb-stack .ns-toast{transition:none}}";
  document.head.appendChild(s);
}

/* ==========================================================
   The game
   ========================================================== */
function make(stage, api){
  injectCss();
  RM = !!api.reduced;
  ERA = readEra(); ERAID = ERA.id || "stone";
  var X = loadX();
  var L = unlocks(), HAVE = {};
  L.have.forEach(function(u){ HAVE[ukey(u)] = 1; });
  var firstTime = !X.seen, fresh = [];
  if(firstTime) fresh = L.have.slice();
  else fresh = L.have.filter(function(u){ return X.seen.indexOf(ukey(u)) < 0; });
  X.seen = L.have.map(ukey);
  if(X.eraSeen !== ERA.id){ X.eraSeen = ERA.id; X.skin = "era"; }
  if(X.skin !== "era" && !HAVE["skin:" + X.skin]) X.skin = "neon";
  if(!HAVE["place:" + X.place]) X.place = "city";
  X.top = Math.max(X.top || 0, api.best() || 0);
  saveX(X);

  var cv = document.createElement("canvas");
  stage.insertBefore(cv, stage.firstChild);
  var cx = cv.getContext("2d");
  var W = 0, H = 0, DPR = 1;

  /* ---------- DOM bits: buttons, era chip, panels, cameo, toast ---------- */
  var bar = el("div", "ns-bar");
  var bCol = el("button", null, "Collection"); bCol.type = "button";
  var bSec = el("button", null, "Secrets"); bSec.type = "button";
  bar.appendChild(bCol); bar.appendChild(bSec); stage.appendChild(bar);
  var chip = el("div", "ns-chip");
  chip.innerHTML = "<b></b><span></span><span class='ns-nx'></span>";
  chip.querySelector("b").textContent = "This week: " + ERA.name;
  chip.querySelector("b").style.color = ERA_COL[ERAID] || "#c6f03c";
  chip.querySelector("span").textContent = ERA_RULE[ERAID] || "";
  chip.querySelector(".ns-nx").textContent = L.next ? "Next unlock: " + L.need + " more sparks" : "Everything unlocked. Legend.";
  stage.appendChild(chip);
  var panel = el("div", "ns-panel"); panel.hidden = true; stage.appendChild(panel);
  var cameo = el("div", "ns-cameo"); var cameoCv = el("canvas"); var cameoP = el("p");
  cameo.appendChild(cameoCv); cameo.appendChild(cameoP); stage.appendChild(cameo);
  cameoCv.width = 220; cameoCv.height = 260;
  var toastEl = el("div", "ns-toast"); var toastCv = el("canvas"); toastCv.width = 68; toastCv.height = 68; var toastSp = el("span");
  toastEl.appendChild(toastCv); toastEl.appendChild(toastSp); stage.appendChild(toastEl);
  var timers = [];
  function later(fn, ms){ var id = setTimeout(fn, ms); timers.push(id); return id; }

  /* ---------- state ---------- */
  var live = false, ending = false, raf = 0, last = 0, t = 0, endTimer = 0, alive = true;
  var tower = [], mover = null, bits = [], sparks = [], rings = [], shocks = [], notes = [];
  var cam = 0, camTo = 0, zoom = 1, zoomTo = 1, clean = 0, slow = 0, shake = 0, flash = 0, BH = 30, BASEW = 200, dir = 1;
  var banner = null, toast = null, bestAtStart = 0, passedBest = false, curve = null, lastCurve = null;
  var P = { laser:0, magnet:0, glue:0, net:0 }, powIn = 5, pyramidUsed = false, rider = null, robin = null;
  var ship = null, sat = null, idle = 0, stopDone = false, roundCombo = 0, pulse = null, pc = null, riderSeen = false, lastPh = 1;
  var jw = null, chinaTaps = [], cameoTimer = 0, toastTimer = 0;
  var SKIN = "neon", S = SK.neon, PLID = "city", PL = PLACES.city, STOPS = [];
  var stars = [], wx = [];
  for(var i = 0; i < 90; i++) stars.push({ x:Math.random(), y:Math.random(), r:Math.random() * 1.6 + .4, p:Math.random() * 6 });
  for(i = 0; i < 70; i++) wx.push({ x:Math.random(), y:Math.random(), v:.6 + Math.random() * .6, s:Math.random() });
  var clouds = []; for(var c = 0; c < 9; c++) clouds.push({ f:38 + c * 4 + Math.random() * 3, x:Math.random(), s:.6 + Math.random() * .8 });

  function applyChoice(){
    SKIN = X.skin; S = SK[SKIN] || SK.neon; PLID = X.place; PL = PLACES[PLID] || PLACES.city;
    /* the bottom of the sky is the place, warmed a little by the week's era */
    var lowT = mixA(rgb(PL.top), rgb(ERA.pal.sky), PL.space ? .06 : .3), lowB = mixA(rgb(PL.bot), rgb(ERA.pal.sky2), PL.space ? .06 : .3);
    STOPS = [{ f:0, top:lowT, bot:lowB }];
    if(PL.space) STOPS.push({ f:30, top:rgb("#02030c"), bot:rgb("#0b0f2e") });
    else SKY_UP.forEach(function(s){ STOPS.push({ f:s.f, top:rgb(s.top), bot:rgb(s.bot) }); });
  }
  function skyAt(f){
    for(var i = STOPS.length - 1; i >= 0; i--) if(f >= STOPS[i].f){
      var a = STOPS[i], b = STOPS[i + 1]; if(!b) return [a.top, a.bot];
      var k = Math.min(1, (f - a.f) / (b.f - a.f)); k = k * k * (3 - 2 * k);
      return [mixA(a.top, b.top, k), mixA(a.bot, b.bot, k)];
    }
    return [STOPS[0].top, STOPS[0].bot];
  }

  function size(){
    var r = stage.getBoundingClientRect();
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = Math.max(280, r.width); H = Math.max(360, r.height);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if(!live && !ending && !pc){ setup(); }
    if(pc) measureCard();
  }

  function setup(){
    applyChoice();
    BH = Math.max(22, Math.round(H / 17));
    BASEW = Math.round(Math.min(W * .56, 300));
    tower = [{ x:(W - BASEW) / 2, w:BASEW, c:0, s:1, an:0, sl:0, pf:0 }];
    bits.length = 0; sparks.length = 0; rings.length = 0; shocks.length = 0; notes.length = 0;
    cam = 0; camTo = 0; zoom = 1; zoomTo = 1; clean = 0; slow = 0; shake = 0; flash = 0; dir = 1;
    banner = null; toast = null; curve = null; lastCurve = null; ending = false; passedBest = false; bestAtStart = api.best();
    P.laser = 0; P.magnet = 0; P.glue = 0; P.net = S.net ? 1 : 0; powIn = 4 + Math.floor(Math.random() * 3);
    pyramidUsed = false; rider = null; robin = null; ship = null; sat = null; idle = 0; stopDone = false; roundCombo = 0; pulse = null; pc = null; riderSeen = false;
    mover = null;
  }
  function floors(){ return tower.length - 1; }
  function yOf(i){ return H - 40 - (i + 1) * BH + cam; }
  function sway(i){ return ERAID === "viking" && !RM ? Math.sin(t * 1.6) * 10 * Math.min(1, i / 25) : 0; }

  function powPool(){
    var a = [], top = tower[tower.length - 1];
    ["laser", "slow", "magnet", "glue", "pump", "net"].forEach(function(id){
      if(!HAVE["power:" + id]) return;
      if(id === "pump" && top.w > BASEW * .8) return;
      if(id === "slow" && slow > 0) return;
      a.push(id);
    });
    return a;
  }
  function spawn(){
    var top = tower[tower.length - 1];
    dir = -dir;
    var f = tower.length;
    mover = { x:dir > 0 ? -top.w : W, w:top.w, c:f, s:f * 7 + 3, gold:!!(curve && curve.id === "gold" && f % 2 === 0), flip:0, ph:dir > 0 ? -Math.PI / 2 : Math.PI / 2, pow:null, bo:0 };
    if(curve && curve.id === "crane"){ var A = (W - mover.w) / 2 + mover.w * .35; mover.x = (W - mover.w) / 2 + A * Math.sin(mover.ph); }
    if(f >= 3){
      var pool = powPool();
      if(pool.length){
        if(curve && curve.id === "lucky"){ if(f % 2 === 0) mover.pow = pick(pool); }
        else if(--powIn <= 0){ mover.pow = pick(pool); powIn = 5 + Math.floor(Math.random() * 4); }
      }
    }
  }
  function start(){
    clearTimeout(endTimer);
    stage.classList.remove("ns-end"); stage.classList.add("ns-play");
    panel.hidden = true;
    setup(); live = true;
    spawn();
    later(function(){ if(live && floors() < 2) say(ERA.name + " week", ERA_RULE[ERAID] || "", ERA_COL[ERAID]); }, 350);
  }
  function say(big, small, col){ banner = { big:big, small:small || "", col:col || "#c6f03c", t:2.2 }; }
  function note(i){ var scale = [523, 587, 659, 784, 880, 1047, 1175, 1319]; return scale[Math.min(scale.length - 1, i)]; }
  function chord(fs, gap){ fs.forEach(function(f, i){ later(function(){ if(alive) api.beep(f, .16, "triangle", .07); }, i * (gap || 90)); }); }
  function setToast(text, dur){ toast = { text:text, t:dur || 1.1 }; }

  /* ---------- secrets ---------- */
  function found(id){
    var isNew = !X.secrets[id];
    if(isNew){ X.secrets[id] = Date.now(); saveX(X); }
    var sec = SECRETS.filter(function(s){ return s.id === id; })[0];
    var g = toastCv.getContext("2d"); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, 68, 68);
    drawSecretIcon(g, id, 68, 68, true);
    toastSp.textContent = (isNew ? "Secret found: " : "") + sec.n;
    toastEl.classList.add("in");
    clearTimeout(toastTimer); toastTimer = later(function(){ toastEl.classList.remove("in"); }, 2800);
    if(isNew) chord([988, 1319, 1568], 80);
  }
  function jaySays(id, text, pose){
    var g = cameoCv.getContext("2d"); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, 220, 260);
    drawJay(g, 96, 120, 52, pose, 0);
    cameoP.textContent = text;
    cameo.classList.add("in");
    clearTimeout(cameoTimer); cameoTimer = later(function(){ cameo.classList.remove("in"); }, 4600);
    found(id);
  }

  /* ---------- the loop ---------- */
  function frame(ts){
    raf = 0;
    if(!alive) return;
    var dt = last ? Math.min(.05, (ts - last) / 1000) : 0; last = ts; t += dt;
    update(dt); draw();
    raf = requestAnimationFrame(frame);
  }

  function update(dt){
    var i, p;
    flash = Math.max(0, flash - dt * 3); shake = Math.max(0, shake - dt * 30);
    if(banner){ banner.t -= dt; if(banner.t <= 0) banner = null; }
    if(toast){ toast.t -= dt; if(toast.t <= 0) toast = null; }
    cam += (camTo - cam) * Math.min(1, dt * (ending ? 2.4 : 6));
    zoom += (zoomTo - zoom) * Math.min(1, dt * 2.4);
    var grav = PLID === "moon" ? 240 : 900;
    for(i = 0; i < bits.length; i++){ p = bits[i]; p.vy += grav * dt; p.y += p.vy * dt; p.x += p.vx * dt; p.r += p.vr * dt * (PLID === "moon" ? .4 : 1); }
    for(i = bits.length - 1; i >= 0; i--) if(bits[i].y > H * 3 + cam + 400) bits.splice(i, 1);
    for(i = 0; i < sparks.length; i++){ p = sparks[i]; p.vy += 600 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; }
    for(i = sparks.length - 1; i >= 0; i--) if(sparks[i].life <= 0) sparks.splice(i, 1);
    for(i = rings.length - 1; i >= 0; i--){ rings[i].k += dt * 2.2; if(rings[i].k >= 1) rings.splice(i, 1); }
    for(i = shocks.length - 1; i >= 0; i--){ shocks[i].k += dt * 1.8; if(shocks[i].k >= 1) shocks.splice(i, 1); }
    for(i = notes.length - 1; i >= 0; i--){ p = notes[i]; p.y -= 34 * dt; p.x += Math.sin(t * 3 + p.p) * 20 * dt; p.life -= dt; if(p.life <= 0) notes.splice(i, 1); }
    if(pulse){ pulse.t += dt; if(pulse.t > 1.4) pulse = null; }
    for(i = Math.max(0, tower.length - 6); i < tower.length; i++){ var b = tower[i]; if(b.an > 0) b.an = Math.max(0, b.an - dt * 2.2); if(b.sl){ b.sl *= Math.exp(-dt * 9); if(Math.abs(b.sl) < .2) b.sl = 0; } if(b.pf){ b.pf *= Math.exp(-dt * 6); if(b.pf < .2) b.pf = 0; } }
    if(pc && pc.k < 1) pc.k = Math.min(1, pc.k + dt * (RM ? 10 : 2.2));
    if(jw){ jw.t -= dt; if(jw.t <= 0) jw = null; }
    /* weather */
    if(ERAID === "rome" || ERAID === "future" || PLID === "snow"){
      var rain = ERAID === "rome";
      for(i = 0; i < wx.length; i++){ p = wx[i]; p.y += dt * (rain ? 1.6 : .18) * p.v; p.x += dt * (rain ? .05 : .03 * Math.sin(t + p.s * 6)); if(p.y > 1){ p.y -= 1; p.x = Math.random(); } }
    }
    /* singing vikings */
    if(ERAID === "viking" && cam < H && Math.random() < dt * 1.4) notes.push({ x:W * .34 + (Math.random() - .5) * 40, y:H - 40 + cam - 70, life:2.2, p:Math.random() * 6, c:"#f1e4c8" });
    if(rider && rider.hop > 0) rider.hop = Math.max(0, rider.hop - dt * 4);
    if(robin){
      if(robin.k < 1){ robin.k = Math.min(1, robin.k + dt / 1.3); if(robin.k >= 1){ found("robin"); chord([1568, 1760, 1568, 2093], 70); for(i = 0; i < 3; i++) notes.push({ x:tower[robin.i].x + (robin.side ? tower[robin.i].w : 0), y:yOf(robin.i) - 30, life:1.8, p:i * 2, c:"#ffd23f" }); } }
      if(yOf(robin.i) > H + 80 / zoom) robin = null;
    }
    if(ship){ ship.k += dt / 6; if(ship.k > .35 && !ship.f){ ship.f = 1; found("space"); } if(ship.k >= 1) ship = null; }
    if(sat){ sat.k += dt / 8; if(sat.k >= 1) sat = null; }

    if(!live || !mover) return;
    idle += dt;
    if(idle > 10 && !stopDone && panel.hidden){ stopDone = true; jaySays("stop", "In the wise words of my late, great grandfather: stop.", "stop"); }
    var top = tower[tower.length - 1];
    var sp = Math.max(150, W * .42) + Math.min(tower.length, 70) * 6;
    sp *= S.speed || 1;
    if(curve && curve.id === "speed") sp *= 1.3;
    if(curve && curve.id === "gust") sp *= 1 + .5 * Math.sin(t * 3.1);
    if(slow > 0) sp *= .55;
    if(P.magnet > 0 && Math.abs(mover.x - top.x) < 18) sp *= .35;
    if(ERAID === "victorian"){ var ch = .5 + .5 * Math.sin(t * 7); sp *= .5 + 1.1 * ch * ch; }
    var beat = ERAID === "eighties" ? .5 : curve && curve.id === "disco" ? .6 : 0;
    if(beat){
      var ph = (t % beat) / beat;
      sp *= ph < .35 ? 2.3 : .3;
      if(ph < lastPh) api.beep(1760, .03, "triangle", .012);
      lastPh = ph;
    }
    if(mover.bo > 0) mover.bo = Math.max(0, mover.bo - dt * 2.5);
    if(curve && curve.id === "crane"){
      var A = (W - mover.w) / 2 + mover.w * .35;
      mover.ph += dt * sp / A;
      mover.x = (W - mover.w) / 2 + A * Math.sin(mover.ph);
      return;
    }
    if(curve && curve.id === "zig"){ mover.flip -= dt; if(mover.flip <= 0){ mover.flip = .7 + Math.random() * 1.1; if(Math.random() < .45) dir = -dir; } }
    mover.x += dir * sp * dt;
    if(mover.x > W - mover.w * .2){ mover.x = W - mover.w * .2; dir = -1; }
    if(mover.x < -mover.w * .8){ mover.x = -mover.w * .8; dir = 1; }
  }

  function burst(x, y, n, col, spread){
    if(RM) n = Math.ceil(n / 3);
    for(var i = 0; i < n; i++) sparks.push({ x:x, y:y, vx:(Math.random() - .5) * (spread || 320), vy:-Math.random() * 260 - 40, life:.5 + Math.random() * .5, c:col, s:2 + Math.random() * 3 });
  }
  function mk(x, w, m){ return { x:x, w:w, c:m.c, s:m.s, gold:m.gold, an:1, sl:0, pf:0, clean:0 }; }
  function landSound(isClean){
    if(isClean){
      var n = note(clean - 1);
      if(SKIN === "pixel") api.beep(n, .09, "square", .05);
      else if(SKIN === "glass" || SKIN === "ice") api.beep(n * 2, .12, "sine", .05);
      else if(SKIN === "rubber" || SKIN === "jelly"){ api.beep(n * .75, .07, "sine", .06); later(function(){ api.beep(n, .08, "sine", .05); }, 60); }
      else if(SKIN === "gold") api.beep(n * .5, .16, "triangle", .07);
      else api.beep(n, .12, "square", .05);
    } else api.beep(SKIN === "gold" ? 150 : 330, .08, SKIN === "pixel" ? "square" : "triangle", .05);
  }

  function drop(){
    if(!live || !mover) return;
    idle = 0;
    var top = tower[tower.length - 1];
    var a = Math.max(mover.x, top.x), b = Math.min(mover.x + mover.w, top.x + top.w), over = b - a;
    var y = yOf(tower.length), col = blockFlat(SKIN, mover.c, mover.gold);
    if(col.charAt(0) !== "#") col = "#c6f03c";
    var dx = mover.x - top.x, tol = S.tol + (S.slide || 0), how = "";
    if(ERAID === "future") tol = Math.max(tol, 6);
    if(P.laser > 0){ P.laser = 0; how = "laser"; }
    if(P.glue > 0 && Math.abs(dx) <= 16){ tol = Math.max(tol, 16); P.glue--; if(Math.abs(dx) > S.tol) how = how || "glue"; }
    if(P.magnet > 0){ tol = Math.max(tol, 12); P.magnet--; if(Math.abs(dx) > S.tol) how = how || "magnet"; }
    var isClean = how === "laser" || Math.abs(dx) <= tol;
    if(!isClean && over <= 0){
      if(P.net > 0){ P.net--; catchIt(); return; }
      fall(y); return;
    }
    var placed, grow = 0, pw = mover.pow;
    if(isClean){
      clean++; roundCombo = Math.max(roundCombo, clean);
      if(mover.gold) grow = 26; else if(clean >= 3) grow = 10;
      if(S.grow) grow += S.grow;
      grow = Math.max(0, Math.min(BASEW - top.w, grow));
      placed = mk(top.x - grow / 2, top.w + grow, mover); placed.clean = 1;
      placed.sl = how === "laser" ? 0 : dx;
      if(how === "laser"){ for(var k = 0; k < 2; k++) shocks.push({ y:y + BH / 2, k:.2 * k, laser:1 }); }
      if(!RM) flash = 1;
      rings.push({ x:placed.x, y:y, w:placed.w, k:0, c:col });
      shocks.push({ y:y + BH / 2, k:0 });
      pulse = { t:0, top:tower.length };
      burst(placed.x, y + BH / 2, 8, col, 200); burst(placed.x + placed.w, y + BH / 2, 8, col, 200);
      landSound(true);
      if(clean === 5){ slow = Math.max(slow, 4); setToast("Slow motion", 1.4); chord([660, 880, 1100]); }
      else if(clean === 7 && !rider){ rider = { n:9, hop:1 }; riderSeen = true; setToast("Combo x7", 1.4); found("rider"); }
      else if(how === "laser") setToast("Laser trim", 1);
      else if(how === "glue") setToast("Sticky!", .9);
      else if(how === "magnet") setToast("Magnet!", .9);
      else if(mover.gold) setToast("Gold! +grow", 1.1);
      else if(clean >= 3) setToast("Clean x" + clean + (grow ? "  +grow" : ""), 1.1);
      else setToast("Clean", .8);
    } else {
      clean = 0;
      placed = mk(a, over, mover);
      var left = mover.x < top.x, offX = left ? mover.x : b, offW = mover.w - over;
      if(offW > 34 && !RM){
        var h1 = offW * (.4 + Math.random() * .2);
        bits.push({ x:offX, y:y, w:h1, c:mover.c, s:mover.s, gold:mover.gold, vy:-40, vx:(left ? -1 : 1) * 60, r:0, vr:(left ? -1 : 1) * 2.5 });
        bits.push({ x:offX + h1, y:y, w:offW - h1, c:mover.c, s:mover.s + 1, gold:mover.gold, vy:-90, vx:(left ? -1 : 1) * 120, r:0, vr:(left ? -1 : 1) * 4.5 });
      } else bits.push({ x:offX, y:y, w:offW, c:mover.c, s:mover.s, gold:mover.gold, vy:0, vx:(left ? -1 : 1) * 80, r:0, vr:(left ? -1 : 1) * 3 });
      burst(left ? a : b, y + BH / 2, 10, col, 260);
      if(!RM) shake = Math.min(8, 3 + offW / 25);
      landSound(false);
    }
    if(slow > 0) slow--;
    tower.push(placed);
    if(pw) power(pw, placed, y);
    if(ERAID === "egypt" && !pyramidUsed && placed.w < BASEW * .3){
      pyramidUsed = true;
      var ng = BASEW * .55 - placed.w; placed.x -= ng / 2; placed.w += ng; placed.pf = ng;
      say("Pyramid power!", "The ancient builders lend a hand", "#ffd27a"); chord([440, 554, 659, 880], 110);
      burst(placed.x + placed.w / 2, y, 24, "#ffd27a", 420);
    }
    if(rider){ rider.n--; rider.hop = 1; if(rider.n <= 0){ rider = null; setToast("Bonnie hops off", 1.2); } }
    var yt = H - 40 - (tower.length + 1) * BH + camTo;
    if(yt < H * .4) camTo += BH;
    afterFloor();
    spawn();
  }

  function power(id, placed, y){
    var cxp = placed.x + placed.w / 2;
    burst(cxp, y, 18, "#f1f8ff", 360);
    chord([880, 1175], 60);
    if(id === "laser"){ P.laser = 1; setToast("Laser ready", 1.2); }
    else if(id === "slow"){ slow = Math.max(slow, 0) + 5; setToast("Slow clock", 1.2); }
    else if(id === "magnet"){ P.magnet = 4; setToast("Magnet x4", 1.2); }
    else if(id === "glue"){ P.glue = 3; setToast("Glue x3", 1.2); }
    else if(id === "net"){ P.net++; setToast("Safety net", 1.2); }
    else if(id === "pump"){
      var gw = Math.min(BASEW - placed.w, 44);
      if(gw > 0){ placed.x -= gw / 2; placed.w += gw; placed.pf = gw; }
      setToast("Pump!", 1.1);
    }
  }
  function catchIt(){
    clean = 0;
    setToast(SKIN === "rubber" && !P.net ? "Boing!" : "Caught!", 1.2);
    api.beep(220, .08, "sine", .07); later(function(){ api.beep(440, .1, "sine", .06); }, 80);
    mover.bo = 1;
    dir = -dir; mover.x = dir > 0 ? -mover.w * .8 : W - mover.w * .2;
    if(curve && curve.id === "crane") mover.ph = dir > 0 ? -Math.PI / 2 : Math.PI / 2;
    burst(W / 2, yOf(tower.length) + BH, 16, "#ffd23f", 500);
  }

  function afterFloor(){
    var f = floors();
    MARKS.forEach(function(m){ if(m.f === f){ say("Higher than " + m.n + "!", m.m + " m tall. You are at " + f * M_PER_FLOOR + " m", "#ffd23f"); chord([523, 659, 784, 1047]); burst(W / 2, H * .3, 26, "#ffd23f", 520); } });
    if(!passedBest && bestAtStart > 0 && f > bestAtStart){ passedBest = true; setToast("New best!", 1.6); chord([784, 988, 1175], 70); burst(W / 2, yOf(f), 30, "#c6f03c", 600); }
    if(f > 0 && f % 10 === 0){
      var pool = CURVES.filter(function(c){ return !lastCurve || c.id !== lastCurve.id; });
      curve = lastCurve = pick(pool);
      var cur = curve;
      later(function(){ if(live && curve === cur){ if(!banner || banner.t < 1) say("Curveball: " + cur.n, cur.d, "#ff4f8b"); api.beep(220, .14, "sawtooth", .05); later(function(){ api.beep(330, .16, "sawtooth", .05); }, 140); } }, banner ? 1700 : 0);
      if(ERAID === "viking"){ later(function(){ chord([196, 247, 294, 392], 140); }, 400); for(var n = 0; n < 6; n++) notes.push({ x:W * (.2 + .6 * Math.random()), y:yOf(f) + 20, life:2, p:n, c:"#f1e4c8" }); }
    }
    if(f === 90 && !ship && Math.random() < .5){ ship = { k:0, f:0 }; }
    if(f === 40 && PLID === "moon" && !ship){ ship = { k:0, f:0 }; setToast("Is that... a dog?", 1.6); }
    if(f === 150){ ship = { k:0, f:0 }; say("You reached space!", "Sort of. Officially it starts at 100 km. We will not tell.", "#7cf5c9"); chord([523, 659, 784, 1047, 1319], 120); burst(W / 2, H * .3, 40, "#7cf5c9", 700); }
    if(f === 200){ say("Hello, Moon!", "It looks a bit surprised", "#f1f8ff"); chord([392, 523, 659, 784], 130); }
    if(f === 250){ sat = { k:0 }; say("A satellite waves", "Beep. Boop. Nice tower.", "#ffd23f"); chord([1047, 1319, 1047], 120); }
    if(!robin && f >= 12 && Math.random() < .05) spawnRobin();
  }
  function spawnRobin(){
    var i = tower.length - 1, side = Math.random() < .5 ? 0 : 1;
    robin = { i:i, side:side, k:0, fx:side ? W + 30 : -30, fy:yOf(i) - 120 };
  }

  function fall(y){
    bits.push({ x:mover.x, y:y, w:mover.w, c:mover.c, s:mover.s, gold:mover.gold, vy:0, vx:dir * 60, r:0, vr:dir * 2 });
    mover = null; live = false; ending = true; curve = null; slow = 0;
    if(rider){ rider = null; }
    api.beep(110, .4, "sawtooth", .06);
    if(!RM) shake = 10;
    var h = floors();
    var towerPx = (h + 1) * BH + 140;
    zoomTo = Math.min(1, (H - 60) / towerPx);
    camTo = 0;
    if(RM){ zoom = zoomTo; cam = 0; }
    X.top = Math.max(X.top || 0, h); X.combo = Math.max(X.combo || 0, roundCombo); X.rounds = (X.rounds || 0) + 1; saveX(X);
    endTimer = setTimeout(function(){
      if(!alive) return;
      ending = false;
      var beat = MARKS.filter(function(m){ return h >= m.f; }).pop();
      var line = (h * M_PER_FLOOR) + " metres. " + (h >= 150 ? "You built a tower to space. Outrageous." : beat ? "Higher than " + beat.n + "." : "Not quite a giraffe. Fancy another go?");
      stage.classList.remove("ns-play"); stage.classList.add("ns-end");
      pc = { k:0, h:h, beat:beat || MARKS[0], won:!!beat, combo:roundCombo, rider:riderSeen, bottom:H * .55, cap:pick(CAPTIONS), tw:tower.slice() };
      api.roundOver(h, line);
      measureCard();
    }, RM ? 900 : 2000);
  }
  function measureCard(){
    requestAnimationFrame(function(){
      if(!pc) return;
      var card = stage.querySelector(".hqb-card");
      var ch = card && !card.hidden ? card.offsetHeight : 0;
      pc.bottom = H - ch - 22;
    });
  }

  /* ---------- drawing the scene ---------- */
  function draw(){
    var view = Math.max(0, cam / BH), i;
    var g2 = skyAt(view + 6);
    var grd = cx.createLinearGradient(0, 0, 0, H); grd.addColorStop(0, css(g2[0])); grd.addColorStop(1, css(g2[1]));
    cx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx.fillStyle = grd; cx.fillRect(0, 0, W, H);
    skyExtras(view);

    cx.save();
    var sx = shake ? (Math.random() - .5) * shake : 0, sy = shake ? (Math.random() - .5) * shake : 0;
    cx.translate(W / 2 + sx, H - 40 + sy); cx.scale(zoom, zoom); cx.translate(-W / 2, -(H - 40));
    var visTop = (H - 40) - (H - 40) / zoom - BH, visBot = (H - 40) + 40 / zoom + BH;
    var gy = H - 40 + cam;

    if(gy - 330 < visBot){
      drawEra(cx, ERAID, W, gy, t, 1, false);
      drawPlace(cx, PLID, W, gy, t, 1);
      drawJayHouse(cx, PLID, W, gy, 1, t);
      drawEra(cx, ERAID, W, gy, t, 1, true);
      if(PLID === "sea") gulls(gy);
      if(jw) jayAtWindow();
    }
    if(!PL.space) clouds.forEach(function(c){
      var cy = yOf(Math.round(c.f)), x = ((c.x * (W + 200) + t * 12 * c.s) % (W + 200)) - 100;
      if(cy < visTop - 60 || cy > visBot + 60) return;
      cx.fillStyle = "rgba(255,255,255,.55)";
      circ(cx, x, cy, 34 * c.s); circ(cx, x + 30 * c.s, cy - 10 * c.s, 26 * c.s); circ(cx, x - 28 * c.s, cy - 6 * c.s, 24 * c.s); circ(cx, x + 56 * c.s, cy + 4 * c.s, 20 * c.s);
    });

    var showMarks = live || ending || pc;
    if(showMarks) MARKS.forEach(function(m){
      var my = yOf(m.f); if(my < visTop - 40 || my > visBot) return;
      cx.strokeStyle = floors() >= m.f ? "rgba(255,210,63,.7)" : "rgba(241,248,255,.3)"; cx.setLineDash([4, 5]); cx.lineWidth = 1.5;
      cx.beginPath(); cx.moveTo(W * .45, my); cx.lineTo(W - 6, my); cx.stroke(); cx.setLineDash([]);
    });
    var best = bestAtStart;
    if(best > 0 && (live || ending)){
      var by = yOf(best);
      if(by > visTop - 40 && by < visBot){
        cx.strokeStyle = passedBest ? "rgba(198,240,60,.35)" : "#c6f03c"; cx.lineWidth = 2;
        cx.setLineDash([10, 6]); cx.beginPath(); cx.moveTo(6, by); cx.lineTo(W * .62, by); cx.stroke(); cx.setLineDash([]);
        cx.fillStyle = passedBest ? "rgba(198,240,60,.5)" : "#c6f03c"; poly(cx, [8, by, 8, by - 22, 28, by - 16, 8, by - 10]);
        cx.textAlign = "left"; cx.font = "800 12px " + FONT; cx.fillText("BEST " + best, 32, by - 8);
      }
    }

    var lod = zoom < .6, top = tower[tower.length - 1], ny = yOf(tower.length);
    /* helpers: the perfect spot (glass blocks, future week), laser guides */
    if(live && mover && (S.guide || ERAID === "future")){
      var gs = sway(tower.length);
      cx.strokeStyle = ERAID === "future" ? "rgba(124,245,201,.7)" : "rgba(235,250,255,.6)"; cx.lineWidth = 1.5; cx.setLineDash([5, 4]);
      cx.strokeRect(top.x + gs + .75, ny + .75, top.w - 1.5, BH - 4.5); cx.setLineDash([]);
    }
    if(live && P.laser > 0){
      var ls = sway(tower.length), la = .45 + (RM ? 0 : .2 * Math.sin(t * 8));
      cx.fillStyle = "rgba(58,208,255," + la.toFixed(2) + ")";
      cx.fillRect(top.x + ls - 1, ny - BH * 1.5, 2, BH * 2.5); cx.fillRect(top.x + top.w + ls - 1, ny - BH * 1.5, 2, BH * 2.5);
    }
    if(live && P.glue > 0){ cx.fillStyle = "#7ee08a"; var gx = top.x + sway(tower.length - 1), gyy = yOf(tower.length - 1); for(i = 0; i < 4; i++){ var dx2 = gx + top.w * (.15 + .23 * i); cx.fillRect(dx2, gyy - 2, 6, 4); circ(cx, dx2 + 3, gyy - 2, 3); } }

    /* the tower */
    var from = 0;
    if(!lod){ from = Math.max(0, Math.floor((H - 40 + cam - visBot) / BH) - 1); }
    var pulseAt = pulse ? pulse.t * 40 : -99;
    for(i = from; i < tower.length; i++){
      var bk = tower[i], yy = yOf(i);
      if(yy > visBot) continue;
      if(yy + BH < visTop) break;
      var ox = sway(i) + (bk.sl || 0), w = bk.w, x = bk.x + ox;
      if(bk.pf){ x += bk.pf / 2; w -= bk.pf; }
      var glow = i === tower.length - 1 ? 1 : 0;
      if(bk.an > 0 && !RM && !lod){
        var an = bk.an; cx.save();
        if(SKIN === "jelly"){ var j = 1 + .14 * an * Math.sin(an * 22); cx.translate(x + w / 2, yy + BH); cx.scale(j, 2 - j); cx.translate(-(x + w / 2), -(yy + BH)); }
        else if(SKIN === "rubber" || (curve && curve.id === "bouncy")) cx.translate(0, -Math.abs(Math.sin(an * 9)) * an * BH * .45);
        else if(an > .8){ cx.translate(x + w / 2, yy + BH); cx.scale(1 + (an - .8) * .3, 1 - (an - .8) * .5); cx.translate(-(x + w / 2), -(yy + BH)); }
        drawBlock(cx, x, yy, w, BH - 3, bk, SKIN, glow, t, false);
        cx.restore();
      } else drawBlock(cx, x, yy, w, BH - 3, bk, SKIN, glow, t, lod);
      if(pulse && !lod){ var d = tower.length - 1 - i, pa = 1 - Math.abs(pulseAt - d) / 3; if(pa > 0){ cx.fillStyle = "rgba(255,255,255," + (pa * .35).toFixed(2) + ")"; cx.fillRect(x, yy, w, BH - 3); } }
      if(robin && robin.i === i) drawRobinAt(i, x, w, yy);
    }
    if(mover){
      var mx = mover.x + sway(tower.length), my2 = ny;
      if(curve && curve.id === "bouncy" && !RM) my2 -= Math.abs(Math.sin(t * 6)) * BH * .5;
      if(mover.bo > 0) my2 -= Math.sin(mover.bo * Math.PI) * BH * 2.5;
      if(curve && curve.id === "crane") crane(mx + mover.w / 2, my2);
      if(SKIN === "jelly" && !RM){ cx.save(); var jj = 1 + .04 * Math.sin(t * 9); cx.translate(mx + mover.w / 2, my2 + BH); cx.scale(jj, 2 - jj); cx.translate(-(mx + mover.w / 2), -(my2 + BH)); }
      drawBlock(cx, mx, my2, mover.w, BH - 3, mover, SKIN, 2, t, false);
      if(SKIN === "jelly" && !RM) cx.restore();
      if(mover.pow){ var pr = Math.min(BH * .42, 15); if(!RM){ cx.fillStyle = "rgba(255,255,255," + (.25 + .15 * Math.sin(t * 6)).toFixed(2) + ")"; circ(cx, mx + mover.w / 2, my2 + (BH - 3) / 2, pr + 4); } drawPow(cx, mover.pow, mx + mover.w / 2, my2 + (BH - 3) / 2, pr); }
      if(P.magnet > 0 && Math.abs(mover.x - top.x) < 30){ cx.strokeStyle = "rgba(180,140,255,.6)"; cx.lineWidth = 1.5; cx.setLineDash([3, 4]); cx.beginPath(); cx.moveTo(mx, my2 + BH - 3); cx.lineTo(top.x + sway(tower.length - 1), my2 + BH + 2); cx.moveTo(mx + mover.w, my2 + BH - 3); cx.lineTo(top.x + top.w + sway(tower.length - 1), my2 + BH + 2); cx.stroke(); cx.setLineDash([]); }
      if(rider){
        var bxp = mx + mover.w / 2 - BH * .3, byp = my2 - Math.sin(rider.hop * Math.PI) * BH * 1.2;
        drawBonnie(cx, bxp, byp, BH * 1.05, t, false, dir > 0 ? 1 : -1);
      }
    }
    for(i = 0; i < rings.length; i++){ var r = rings[i]; cx.strokeStyle = r.c; cx.globalAlpha = 1 - r.k; cx.lineWidth = 3; var e = r.k * 22; cx.strokeRect(r.x - e, r.y - e, r.w + e * 2, BH - 3 + e * 2); }
    cx.globalAlpha = 1;
    for(i = 0; i < shocks.length; i++){ var s = shocks[i]; var sw = W * (.2 + s.k * 1.2); cx.fillStyle = s.laser ? "rgba(58,208,255," + (.7 * (1 - s.k)).toFixed(2) + ")" : "rgba(255,255,255," + (.5 * (1 - s.k)).toFixed(2) + ")"; cx.fillRect(W / 2 - sw / 2, s.y - 1.5, sw, 3); }
    for(i = 0; i < bits.length; i++){ var p = bits[i]; cx.save(); cx.translate(p.x + p.w / 2, p.y + BH / 2); cx.rotate(p.r); cx.globalAlpha = .85; drawBlock(cx, -p.w / 2, -BH / 2, p.w, BH - 3, p, SKIN, 0, t, lod); cx.restore(); }
    cx.globalAlpha = 1;
    for(i = 0; i < notes.length; i++){ var nt = notes[i]; cx.globalAlpha = Math.min(1, nt.life); cx.fillStyle = nt.c; circ(cx, nt.x, nt.y, 4); cx.fillRect(nt.x + 3, nt.y - 13, 1.8, 13); cx.fillRect(nt.x + 3, nt.y - 13, 6, 2); }
    cx.globalAlpha = 1;
    cx.textAlign = "right"; cx.font = "700 11px " + FONT;
    if(live || ending) MARKS.forEach(function(m){
      var my = yOf(m.f); if(my < visTop - 40 || my > visBot) return;
      var got = floors() >= m.f, label = cap(m.n) + " " + m.m + " m", tw = cx.measureText(label).width + 30;
      cx.fillStyle = "rgba(4,12,24,.72)"; cx.fillRect(W - 6 - tw, my - 19, tw, 17);
      drawLandmark(cx, m.s, W - tw + 6, my - 4, 13, got ? "#ffd23f" : "rgba(241,248,255,.7)", 9);
      cx.fillStyle = got ? "#ffd23f" : "rgba(241,248,255,.88)"; cx.fillText(label, W - 12, my - 6);
    });
    for(i = 0; i < sparks.length; i++){ var sp2 = sparks[i]; cx.globalAlpha = Math.max(0, Math.min(1, sp2.life * 2)); cx.fillStyle = sp2.c; cx.fillRect(sp2.x, sp2.y, sp2.s, sp2.s); }
    cx.globalAlpha = 1;
    cx.restore();

    weather();
    if(ship) drawShip();
    if(sat){ var sx2 = -60 + sat.k * (W + 120), sy2 = H * .2 + Math.sin(sat.k * 6) * 10; drawLandmark(cx, "sat", sx2, sy2 + 20, 40, "#d8dde6"); cx.fillStyle = "#3ad0ff"; cx.fillRect(sx2 - 20, sy2 - 2, 13, 5); cx.fillRect(sx2 + 7, sy2 - 2, 13, 5); }
    if(slow > 0 && live){ cx.fillStyle = "rgba(58,208,255,.08)"; cx.fillRect(0, 0, W, H); }
    if(flash > 0){ cx.fillStyle = "rgba(198,240,60," + (flash * .08).toFixed(3) + ")"; cx.fillRect(0, 0, W, H); }

    hud();
    if(pc) postcard();
  }

  function skyExtras(view){
    var sa = PL.space ? 1 : Math.max(0, Math.min(1, (view - 55) / 25));
    if(sa > 0){ for(var i = 0; i < stars.length; i++){ var s = stars[i]; cx.globalAlpha = sa * (.5 + .5 * Math.sin(t * 2 + s.p)); cx.fillStyle = "#fff"; cx.fillRect(s.x * W, s.y * H, s.r, s.r); } cx.globalAlpha = 1; }
    if(PL.space && view < 60){ var ea = 1 - view / 60; cx.globalAlpha = ea; cx.fillStyle = "#2f7fd8"; circ(cx, W * .78, H * .18, Math.min(W, H) * .08); cx.fillStyle = "#4fbf7a"; ell(cx, W * .76, H * .17, Math.min(W, H) * .035, Math.min(W, H) * .025, .4); ell(cx, W * .8, H * .2, Math.min(W, H) * .02, Math.min(W, H) * .03, -.3); cx.globalAlpha = 1; }
    if(view > 85 && view < 185){ var pa = Math.min(1, (view - 85) / 15); cx.globalAlpha = pa; cx.fillStyle = "#ff8a5c"; circ(cx, W * .82, H * .2, Math.min(W, H) * .09); cx.fillStyle = "rgba(0,0,0,.18)"; circ(cx, W * .84, H * .19, Math.min(W, H) * .07); cx.globalAlpha = 1; }
    if(view >= 180){
      var mk2 = Math.min(1, (view - 180) / 20), mr = Math.min(W, H) * (.08 + .14 * mk2);
      cx.fillStyle = "#e9e4d8"; circ(cx, W * .74, H * .24, mr);
      cx.fillStyle = "rgba(0,0,0,.12)"; circ(cx, W * .7, H * .2, mr * .2); circ(cx, W * .8, H * .28, mr * .14); circ(cx, W * .76, H * .3, mr * .1);
      if(mk2 > .5){ cx.fillStyle = "#1d1712"; circ(cx, W * .72, H * .23, mr * .05); circ(cx, W * .77, H * .23, mr * .05); cx.strokeStyle = "#1d1712"; cx.lineWidth = 2; cx.beginPath(); cx.arc(W * .745, H * .27, mr * .07, 0, 6.2832); cx.stroke(); }
    }
    if(ERAID === "future" && view < 30){ cx.globalAlpha = 1 - view / 30; star(cx, W * .12, H * .14, 7, "#ffd23f"); star(cx, W * .5, H * .08, 5, "#ffd23f"); cx.globalAlpha = 1; }
  }
  function weather(){
    var i, p;
    if(ERAID === "rome"){
      cx.strokeStyle = "rgba(200,220,240,.45)"; cx.lineWidth = 1.2; cx.beginPath();
      for(i = 0; i < wx.length; i++){ p = wx[i]; cx.moveTo(p.x * W, p.y * H); cx.lineTo(p.x * W - 3, p.y * H + 12); }
      cx.stroke();
    } else if(ERAID === "future" || PLID === "snow"){
      cx.fillStyle = "rgba(255,255,255,.8)";
      for(i = 0; i < wx.length; i += (PLID === "snow" && ERAID === "future") ? 1 : 2){ p = wx[i]; cx.fillRect(p.x * W, p.y * H, 2 + p.s * 2, 2 + p.s * 2); }
    }
  }
  function gulls(gy){
    cx.strokeStyle = "#f1f8ff"; cx.lineWidth = 2; cx.beginPath();
    for(var k = 0; k < 3; k++){
      var x = ((t * (22 + k * 9) + k * 170) % (W + 80)) - 40, y = gy - 150 - k * 34 + Math.sin(t * 2 + k) * 8, f = RM ? 4 : 4 + Math.sin(t * 7 + k) * 3;
      cx.moveTo(x - 9, y - f); cx.quadraticCurveTo(x - 4, y - f - 3, x, y); cx.quadraticCurveTo(x + 4, y - f - 3, x + 9, y - f);
    }
    cx.stroke();
  }
  function jayAtWindow(){
    var k = Math.min(1, (3.4 - jw.t) * 4, jw.t * 3);
    var hx = WINR.x + WINR.w / 2, hy = WINR.y + WINR.h * .55 - k * 16;
    cx.save(); cx.beginPath(); cx.rect(WINR.x - 40, WINR.y - 80, WINR.w + 80, WINR.h + 80); cx.clip();
    drawJay(cx, hx, hy, 13, "wave", t);
    cx.restore();
    if(k > .6) bubble(cx, hx - 20, hy - 20, "Outrageous!", 160, 15, W);
  }
  function drawRobinAt(i, x, w, yy){
    var px = robin.side ? x + w - 6 : x + 6, py = yy;
    var k = robin.k, e = k * k * (3 - 2 * k);
    var rx = robin.fx + (px - robin.fx) * e, ry = robin.fy + (py - robin.fy) * e - Math.sin(e * Math.PI) * 40;
    cx.save(); cx.translate(rx, ry); if(robin.side) cx.scale(-1, 1);
    drawRobin(cx, 0, 0, Math.max(14, BH * .5), t, k < 1);
    cx.restore();
  }
  function crane(x, y){
    cx.strokeStyle = "rgba(241,248,255,.75)"; cx.lineWidth = 2;
    cx.beginPath(); cx.moveTo(W / 2, y - BH * 6); cx.lineTo(x, y - 8); cx.stroke();
    cx.fillStyle = "#ffd23f"; cx.fillRect(x - 7, y - 10, 14, 6);
    cx.strokeStyle = "#ffd23f"; cx.lineWidth = 3; cx.beginPath(); cx.arc(x, y - 2, 5, Math.PI, 0); cx.stroke();
  }
  function drawShip(){
    var e = ship.k, x = -80 + e * (W + 160), y = H * .26 + Math.sin(e * 9) * 12;
    if(!RM){ cx.fillStyle = "rgba(124,245,201,.12)"; poly(cx, [x - 20, y + 10, x + 20, y + 10, x + 60, H, x - 60, H]); }
    drawSaucer(cx, x, y, Math.min(46, W * .1), t);
  }

  function hud(){
    var fl = tower.length ? floors() : 0;
    cx.textAlign = "left"; cx.fillStyle = "#f1f8ff";
    if(ERAID === "rome"){
      cx.font = "800 " + (fl > 99 ? 26 : 34) + "px " + FONT; cx.fillText(roman(fl), 16, 44);
      var rw = cx.measureText(roman(fl)).width; cx.font = "700 13px " + FONT; cx.fillStyle = "rgba(241,248,255,.65)"; cx.fillText("(" + fl + ")", 22 + rw, 44);
    } else { cx.font = "800 34px " + FONT; cx.fillText(String(fl), 16, 44); }
    cx.font = "700 13px " + FONT; cx.fillStyle = "rgba(241,248,255,.85)";
    cx.fillText(fl * M_PER_FLOOR + " m  |  Best " + api.best(), 16, 64);
    var next = MARKS.filter(function(m){ return m.f > fl; })[0] || BEYOND.filter(function(m){ return m.f > fl; })[0];
    if(next && live){ cx.fillStyle = "rgba(241,248,255,.65)"; cx.fillText("Next: " + next.n + " in " + (next.f - fl), 16, 82, W - 140); }
    if(live){
      var hasP = P.laser > 0 || P.magnet > 0 || P.glue > 0 || P.net > 0, bw = Math.max(clean > 5 ? 116 : 88, curve ? cx.measureText(curve.n.toUpperCase()).width + 30 : 0);
      cx.font = "800 12px " + FONT; if(curve) bw = Math.max(bw, cx.measureText(curve.n.toUpperCase()).width + 18);
      cx.fillStyle = "rgba(4,12,24,.8)"; rr(cx, W - 8 - bw, 10, bw, 40 + (curve ? 16 : 0) + (hasP ? 30 : 0), 8); cx.fill();
      cx.textAlign = "right"; cx.font = "800 11px " + FONT; cx.fillStyle = "rgba(241,248,255,.8)"; cx.fillText(slow > 0 ? "SLOW MO " + slow : "COMBO", W - 16, 24);
      for(var i = 0; i < 5; i++){ cx.fillStyle = i < Math.min(5, clean) ? NEON[i % 4] : "rgba(241,248,255,.18)"; cx.fillRect(W - 16 - (5 - i) * 14, 32, 10, 10); }
      if(clean > 5){ cx.fillStyle = "#c6f03c"; cx.font = "800 12px " + FONT; cx.fillText("x" + clean, W - 94, 42); }
      var row = 60;
      if(curve){ cx.fillStyle = "#ff4f8b"; cx.font = "800 12px " + FONT; cx.fillText(curve.n.toUpperCase(), W - 16, row); row += 8; }
      var px = W - 26, act = [["laser", P.laser], ["magnet", P.magnet], ["glue", P.glue], ["net", P.net]];
      for(i = 0; i < act.length; i++) if(act[i][1] > 0){
        drawPow(cx, act[i][0], px, row + 12, 10);
        if(act[i][1] > 1){ cx.fillStyle = "#f1f8ff"; cx.font = "800 10px " + FONT; cx.textAlign = "center"; cx.fillText(String(act[i][1]), px + 8, row + 26); cx.textAlign = "right"; }
        px -= 26;
      }
    }
    if(toast){ cx.globalAlpha = Math.min(1, toast.t * 3); cx.textAlign = "center"; cx.font = "800 22px " + FONT; cx.fillStyle = "#c6f03c"; cx.fillText(toast.text, W / 2, banner ? 190 : 124); cx.globalAlpha = 1; }
    if(banner){
      var k = Math.min(1, banner.t * 2, (2.2 - banner.t) * 6);
      cx.globalAlpha = Math.max(0, k);
      cx.fillStyle = "rgba(4,12,24,.82)"; cx.fillRect(0, 92, W, 70);
      cx.textAlign = "center"; cx.fillStyle = banner.col; cx.font = "800 " + Math.round(Math.min(24, W / 15)) + "px " + FONT; cx.fillText(banner.big, W / 2, 124, W - 16);
      cx.fillStyle = "rgba(241,248,255,.88)"; cx.font = "700 12px " + FONT; cx.fillText(banner.small, W / 2, 148, W - 16);
      cx.globalAlpha = 1;
    }
    if(live && tower.length === 1){ cx.textAlign = "center"; cx.font = "700 15px " + FONT; cx.fillStyle = "rgba(241,248,255,.9)"; cx.fillText("Tap to drop", W / 2, H - 14); }
  }

  /* the end of round postcard */
  function postcard(){
    var top = 74, rh = pc.bottom - top;
    if(rh < 130) return;
    var e = pc.k * pc.k * (3 - 2 * pc.k);
    var cw = Math.min(W - 20, rh * 1.75, 540), ch = Math.min(rh, cw * .68);
    cx.save();
    cx.globalAlpha = e;
    cx.translate(W / 2, top + rh / 2 + (1 - e) * 50); cx.rotate(-.022 * e);
    cx.fillStyle = "rgba(0,0,0,.35)"; rr(cx, -cw / 2 + 5, -ch / 2 + 7, cw, ch, 10); cx.fill();
    cx.fillStyle = "#fbf3df"; rr(cx, -cw / 2, -ch / 2, cw, ch, 10); cx.fill();
    var ix = -cw / 2 + 10, iy = -ch / 2 + 10, iw = cw * .56, ih = ch - 20;
    var sk = skyAt(Math.min(pc.h, 95));
    var gr = cx.createLinearGradient(0, iy, 0, iy + ih); gr.addColorStop(0, css(sk[0])); gr.addColorStop(1, css(STOPS[0].bot));
    cx.fillStyle = gr; cx.fillRect(ix, iy, iw, ih);
    if(PL.space || pc.h > 70){ cx.fillStyle = "rgba(255,255,255,.8)"; for(var i = 0; i < 18; i++) cx.fillRect(ix + iw * hr(i), iy + ih * .6 * hr(i + 30), 1.5, 1.5); }
    cx.fillStyle = PL.ground; cx.fillRect(ix, iy + ih - 14, iw, 14);
    var cmp = pc.beat.m ? pc.beat : MARKS[MARKS.length - 1], metres = pc.h * M_PER_FLOOR, maxM = Math.max(metres, cmp.m) * 1.12;
    var s = (ih - 30) / maxM, baseY = iy + ih - 14;
    cx.save(); cx.beginPath(); cx.rect(ix, iy, iw, ih); cx.clip();
    drawLandmark(cx, cmp.s, ix + iw * .3, baseY, cmp.m * s, "rgba(20,30,50,.75)", iw * .26);
    var tw = pc.tw, sc = iw * .3 / BASEW, tx0 = ix + iw * .7 - iw * .15, fh = M_PER_FLOOR * s;
    for(i = 0; i < tw.length; i++){
      var b = tw[i], yb = baseY - (i + 1) * fh;
      cx.fillStyle = postCol(SKIN, b.c, b.gold);
      cx.fillRect(tx0 + (b.x - (W - BASEW) / 2) * sc, yb, Math.max(1, b.w * sc), Math.max(.6, fh - (fh > 3 ? 1 : 0)));
    }
    if(pc.rider && tw.length > 1){ var tb = tw[tw.length - 1]; drawBonnie(cx, tx0 + (tb.x - (W - BASEW) / 2 + tb.w / 2) * sc, baseY - tw.length * fh, 16, 0, false, 1); }
    cx.restore();
    cx.textAlign = "center"; cx.font = "700 11px " + FONT; cx.fillStyle = "rgba(20,30,50,.85)";
    cx.fillText("you", tx0 + iw * .15, Math.max(iy + 12, baseY - (tw.length - 1) * fh - 8));
    cx.strokeStyle = "rgba(0,0,0,.15)"; cx.lineWidth = 1; cx.strokeRect(ix + .5, iy + .5, iw - 1, ih - 1);
    /* the writing side */
    var rx = ix + iw + 12, rw = cw / 2 - rx - 10, ty = iy + 4;
    var stw = Math.min(46, rw * .4), sth = stw * 1.18;
    stamp(cw / 2 - 10 - stw, iy, stw, sth);
    cx.textAlign = "left"; cx.fillStyle = "#3a2a1a";
    var fs = Math.max(10, Math.min(13, rw / 10));
    cx.font = "700 " + fs + "px " + FONT; cx.fillText("Greetings from", rx, ty + sth + 10, rw);
    cx.font = "800 " + Math.round(fs * 1.5) + "px " + FONT; cx.fillStyle = "#0b2840"; cx.fillText(PL.n, rx, ty + sth + 12 + fs * 1.5, rw);
    var ly = ty + sth + 18 + fs * 1.5;
    cx.strokeStyle = "rgba(58,42,26,.3)"; cx.beginPath(); cx.moveTo(rx, ly); cx.lineTo(rx + rw, ly); cx.stroke();
    cx.font = "800 " + Math.round(fs * 2.2) + "px " + FONT; cx.fillStyle = "#0b2840"; cx.fillText(metres + " m", rx, ly + fs * 2.4, rw);
    cx.font = "700 " + fs + "px " + FONT; cx.fillStyle = "#3a2a1a";
    var l2 = pc.won ? "Taller than " + cmp.n : "Nearly " + cmp.n;
    wrap(l2, rx, ly + fs * 2.4 + fs * 1.5, rw, fs * 1.25, 2);
    var by2 = -ch / 2 + ch - 12;
    if(pc.combo >= 3){ cx.fillText("Best combo x" + pc.combo, rx, by2 - fs * 1.4, rw); }
    cx.font = "italic 700 " + fs + "px " + FONT; cx.fillStyle = "#6a5a4a"; cx.fillText(pc.cap, rx, by2, rw);
    cx.restore();
  }
  function wrap(text, x, y, mw, lh, maxLines){
    var words = text.split(" "), line = "", n = 0;
    for(var i = 0; i < words.length; i++){
      var tst = line ? line + " " + words[i] : words[i];
      if(cx.measureText(tst).width > mw && line){ cx.fillText(line, x, y + n * lh); n++; line = words[i]; if(n >= maxLines) return; }
      else line = tst;
    }
    cx.fillText(line, x, y + n * lh, mw);
  }
  function stamp(x, y, w, h){
    cx.fillStyle = "#fffaf0"; cx.fillRect(x - 3, y - 3, w + 6, h + 6);
    var g = cx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, ERA.pal.sky); g.addColorStop(1, ERA.pal.sky2);
    cx.fillStyle = g; cx.fillRect(x, y, w, h);
    cx.fillStyle = ERA.pal.ground; cx.fillRect(x, y + h * .78, w, h * .22);
    for(var k = 0; k < 3; k++){ cx.fillStyle = NEON[k]; cx.fillRect(x + w * (.28 + k * .02), y + h * (.62 - k * .14), w * (.44 - k * .06), h * .13); }
    cx.fillStyle = "rgba(255,255,255,.9)"; cx.font = "800 " + Math.round(w * .2) + "px " + FONT; cx.textAlign = "center"; cx.fillText("WK " + ERA.n, x + w / 2, y + h * .2);
    cx.strokeStyle = "rgba(40,40,60,.45)"; cx.lineWidth = 1.5; cx.beginPath();
    for(k = 0; k < 3; k++){ var yy = y + h * .35 + k * 6; cx.moveTo(x - w * .5, yy); for(var j = 0; j <= 8; j++) cx.lineTo(x - w * .5 + j * w * .15, yy + (j % 2 ? 2.5 : -2.5)); }
    cx.stroke();
    cx.textAlign = "left";
  }

  /* ---------- the collection, secrets and what's new ---------- */
  function tileCanvas(fn){
    var c = el("canvas"); c.width = 192; c.height = 128;
    var g = c.getContext("2d"); g.scale(2, 2); fn(g); return c;
  }
  /* locked things: the shape in shadow on the dark tile */
  function shadowIt(g, w, h){
    g.globalCompositeOperation = "source-atop"; g.fillStyle = "#2c4664"; g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = "destination-over"; g.fillStyle = "#0b2840"; rr(g, 0, 0, w, h, 8); g.fill();
    g.globalCompositeOperation = "source-over";
  }
  function silhouette(g){ g.globalCompositeOperation = "source-atop"; g.fillStyle = "#1c2f45"; g.fillRect(0, 0, 96, 64); g.globalCompositeOperation = "source-over"; g.fillStyle = "rgba(241,248,255,.55)"; g.font = "800 22px " + FONT; g.textAlign = "center"; g.fillText("?", 48, 40); }
  function prevSkin(g, id, locked){
    if(!locked){ g.fillStyle = "#0b2840"; rr(g, 0, 0, 96, 64, 8); g.fill(); }
    for(var k = 0; k < 3; k++) drawBlock(g, 16 + k * 4, 46 - k * 15, 64 - k * 6, 13, { c:k + 1, s:k * 7 + 2, clean:k === 2 ? 1 : 0 }, id, locked ? 0 : k === 2 ? 1 : 0, 1, false);
    if(locked) shadowIt(g, 96, 64);
  }
  function prevPlace(g, id, locked){
    var p = PLACES[id], gr = g.createLinearGradient(0, 0, 0, 64); gr.addColorStop(0, p.top); gr.addColorStop(1, p.bot);
    rr(g, 0, 0, 96, 64, 8); g.save(); g.clip(); g.fillStyle = gr; g.fillRect(0, 0, 96, 64);
    if(p.space){ g.fillStyle = "#fff"; for(var i = 0; i < 14; i++) g.fillRect(96 * hr(i), 40 * hr(i + 4), 1, 1); g.fillStyle = "#2f7fd8"; circ(g, 76, 14, 7); }
    drawPlace(g, id, 96, 52, 1, .42); drawJayHouse(g, id, 96, 52, .42, 0);
    g.restore();
    if(locked) silhouette(g);
  }
  function prevPow(g, id, locked){ if(!locked){ g.fillStyle = "#0b2840"; rr(g, 0, 0, 96, 64, 8); g.fill(); } drawPow(g, id, 48, 32, 22); if(locked) shadowIt(g, 96, 64); }
  function drawSecretIcon(g, id, w, h, got){
    if(got){ g.fillStyle = "#0b2840"; g.fillRect(0, 0, w, h); }
    var u = Math.min(w / 96, h / 64);
    g.save(); g.translate((w - 96 * u) / 2, (h - 64 * u) / 2); g.scale(u, u);
    switch(id){
      case "rider": drawBlock(g, 18, 46, 60, 12, { c:1, s:3 }, "neon", 1, 0, false); drawBonnie(g, 44, 46, 30, 0, false, 1); break;
      case "robin": drawBlock(g, 10, 50, 76, 12, { c:3, s:3 }, "neon", 0, 0, false); drawRobin(g, 48, 50, 26, 0, false); break;
      case "window": g.fillStyle = "#0e2a44"; g.fillRect(20, 6, 56, 58); g.fillStyle = "#ffd98a"; g.fillRect(34, 22, 28, 26); g.save(); g.beginPath(); g.rect(28, 0, 40, 48); g.clip(); drawJay(g, 48, 34, 11, "wave", 0); g.restore(); break;
      case "stop": drawJay(g, 42, 28, 13, "stop", 0); break;
      case "china": drawJay(g, 34, 30, 12, "", 0); drawLandmark(g, "skytree", 76, 62, 56, "#ffd23f"); break;
      case "space": drawSaucer(g, 48, 38, 26, 0); break;
    }
    g.restore();
    if(!got) shadowIt(g, w, h);
  }
  function tile(grid, o){
    var b = el("button", "ns-tile" + (o.on ? " on" : "") + (o.lock ? " lock" : "") + (o.next ? " next" : ""));
    b.type = "button";
    b.appendChild(tileCanvas(o.draw));
    b.appendChild(document.createTextNode(o.name));
    if(o.small){ var s = el("small", null, o.small); b.appendChild(s); }
    if(o.on){ b.appendChild(el("span", "ns-on", "On")); }
    if(o.click) b.addEventListener("click", o.click); else b.setAttribute("tabindex", "-1");
    if(!o.click) b.style.cursor = "default";
    grid.appendChild(b);
    return b;
  }
  function section(sc, title){ sc.appendChild(el("h3", null, title)); var g = el("div", "ns-grid"); sc.appendChild(g); return g; }
  function panelHead(title, sub){
    panel.innerHTML = "";
    var head = el("div", "ns-ph"), h = el("h2", null, title);
    if(sub){ var sm = el("small", null, sub); h.appendChild(sm); }
    var done = el("button", "ns-done", "Done"); done.type = "button";
    done.addEventListener("click", function(){ panel.hidden = true; var f = stage.querySelector(".hqb-card:not([hidden]) button"); if(f) f.focus(); });
    head.appendChild(h); head.appendChild(done); panel.appendChild(head);
    var sc = el("div", "ns-scroll"); panel.appendChild(sc);
    panel.hidden = false;
    return { sc:sc, done:done };
  }
  function lockInfo(u){
    if(HAVE[ukey(u)]) return null;
    var isNext = L.next && ukey(L.next) === ukey(u);
    return { name: isNext ? u.n : "???", small: isNext ? L.need + " more sparks" : "Locked", next: isNext };
  }
  function openCollection(){
    var gotN = L.have.length, scroll = panel.querySelector(".ns-scroll"), keep = scroll && !panel.hidden ? scroll.scrollTop : 0;
    var p = panelHead("Collection", gotN + " of " + LADDER.length + " unlocked" + (L.next ? ". Next in " + L.need + " sparks" : ". All of it!"));
    var g1 = section(p.sc, "Blocks (tap to use)");
    tile(g1, { name:"This week", small:ERA_BLOCK[ERAID] || ERA.name, on:X.skin === "era", draw:function(g){ prevSkin(g, "era", false); }, click:function(){ choose("skin", "era"); } });
    LADDER.forEach(function(u){
      if(u.kind !== "skin") return;
      var li = lockInfo(u);
      tile(g1, { name:li ? li.name : u.n, small:li ? li.small : u.d, on:!li && X.skin === u.id, lock:!!li, next:li && li.next, draw:function(g){ prevSkin(g, u.id, !!li); }, click:li ? null : function(){ choose("skin", u.id); } });
    });
    var g2 = section(p.sc, "Places (tap to build there)");
    LADDER.forEach(function(u){
      if(u.kind !== "place") return;
      var li = lockInfo(u);
      tile(g2, { name:li ? li.name : u.n, small:li ? li.small : u.d, on:!li && X.place === u.id, lock:!!li, next:li && li.next, draw:function(g){ prevPlace(g, u.id, !!li); }, click:li ? null : function(){ choose("place", u.id); } });
    });
    var g3 = section(p.sc, "Power ups (they ride in on the block)");
    LADDER.forEach(function(u){
      if(u.kind !== "power") return;
      var li = lockInfo(u);
      tile(g3, { name:li ? li.name : u.n, small:li ? li.small : u.d, lock:!!li, next:li && li.next, draw:function(g){ prevPow(g, u.id, !!li); } });
    });
    var all = MARKS.concat(BEYOND), beat = 0;
    all.forEach(function(m){ if(X.top >= m.f) beat++; });
    var g4 = section(p.sc, "Sky log: beaten " + beat + " of " + all.length);
    all.forEach(function(m){
      var got = X.top >= m.f;
      tile(g4, { name:got ? cap(m.n) : "???", small:m.m ? m.m + " m" : (m.f * M_PER_FLOOR) + " m", lock:!got, draw:function(g){
        var gr = g.createLinearGradient(0, 0, 0, 64); gr.addColorStop(0, "#0d1d33"); gr.addColorStop(1, "#16304e");
        g.fillStyle = gr; rr(g, 0, 0, 96, 64, 8); g.fill();
        g.fillStyle = "rgba(241,248,255,.12)"; g.fillRect(0, 58, 96, 6);
        drawLandmark(g, m.s, 48, 58, m.s === "pyramid" || m.s === "mountain" ? 34 : 50, got ? "#ffd23f" : "rgba(241,248,255,.22)", 40);
      } });
    });
    var sc2 = panel.querySelector(".ns-scroll"); if(sc2) sc2.scrollTop = keep;
    p.done.focus();
  }
  function choose(kind, id){
    if(kind === "skin") X.skin = id; else X.place = id;
    saveX(X);
    if(!live && !ending && !pc){ setup(); } else applyChoice();
    openCollection();
    api.beep(880, .06, "triangle", .05);
  }
  function openSecrets(){
    var n = 0; SECRETS.forEach(function(s){ if(X.secrets[s.id]) n++; });
    var p = panelHead("Secrets", "Found " + n + " of " + SECRETS.length + ". Just for fun, never scored.");
    var g = el("div", "ns-grid"); p.sc.appendChild(el("p", "ns-intro", n ? "Nicely spotted." : "Jay and Bonnie are hiding in here somewhere. Keep playing and keep your eyes open."));
    p.sc.appendChild(g);
    SECRETS.forEach(function(s){
      var got = !!X.secrets[s.id];
      tile(g, { name:got ? s.n : "???", small:got ? "Found" : "Not yet", lock:!got, draw:function(c){ drawSecretIcon(c, s.id, 96, 64, got); } });
    });
    p.done.focus();
  }
  function openNew(list){
    var p = panelHead(firstTime ? "Neon Stack got bigger" : "New for you", firstTime ? "Block sets, places and power ups unlock as your sparks build." : "Unlocked since last time");
    p.done.textContent = "Nice";
    if(firstTime) p.sc.appendChild(el("p", "ns-intro", "Each week the whole thing time travels too. This week: " + ERA.name + ". Plus a few secrets to find."));
    var g = el("div", "ns-grid"); p.sc.appendChild(g);
    list.forEach(function(u){
      tile(g, { name:u.n, small:u.d, draw:function(c){ if(u.kind === "skin") prevSkin(c, u.id, false); else if(u.kind === "place") prevPlace(c, u.id, false); else prevPow(c, u.id, false); },
        click:u.kind === "power" ? null : function(){ choose(u.kind, u.id); } });
    });
    if(!firstTime) chord([659, 784, 988, 1319], 90);
    p.done.focus();
  }
  bCol.addEventListener("click", openCollection);
  bSec.addEventListener("click", openSecrets);

  /* ---------- input ---------- */
  function down(e){
    if(live){ if(e && e.cancelable) e.preventDefault(); drop(); return; }
    if(ending) return;
    var r = cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    /* Jay's window (before the first round, when the scene is close up) */
    if(!pc && zoom > .97 && cam < 1 && px > WINR.x - 10 && px < WINR.x + WINR.w + 10 && py > WINR.y - 10 && py < WINR.y + WINR.h + 10){
      jw = { t:3.4 }; found("window"); api.beep(660, .1, "triangle", .06); return;
    }
    /* the floor number, three quick taps */
    if(px < 110 && py < 70){
      var now = Date.now(); chinaTaps.push(now); chinaTaps = chinaTaps.filter(function(x){ return now - x < 1500; });
      if(chinaTaps.length >= 3){ chinaTaps = []; jaySays("china", "When I was in China.... the towers were taller.", ""); }
    }
  }
  function key(e){ if(!live || !panel.hidden) return; if(e.code === "Space" || e.key === " " || e.key === "Enter"){ e.preventDefault(); if(!e.repeat) drop(); } }
  cv.addEventListener("pointerdown", down);
  window.addEventListener("keydown", key);
  window.addEventListener("resize", size);
  size(); setup(); draw();
  raf = requestAnimationFrame(frame);
  if(fresh.length) openNew(fresh);

  /* for automated testing only (the page address has ?hqtest) */
  if(TESTING) window.__neon = {
    peek:function(){ return tower && mover ? { mx:mover.x, mw:mover.w, tx:tower[tower.length - 1].x, tw:tower[tower.length - 1].w, f:floors(), live:live, pow:mover.pow, curve:curve && curve.id } : { live:live, f:floors() }; },
    drop:drop,
    perfect:function(){ if(mover){ mover.x = tower[tower.length - 1].x; drop(); } },
    build:function(n){ for(var i = 0; i < n && live; i++){ if(mover){ mover.x = tower[tower.length - 1].x; drop(); } } },
    robin:function(){ spawnRobin(); },
    give:function(id){ if(mover) mover.pow = id; },
    curve:function(id){ curve = lastCurve = CURVES.filter(function(c){ return c.id === id; })[0] || null; },
    idle:function(){ idle = 11; }
  };

  return {
    start: start,
    stop: function(){
      alive = false; live = false; ending = false; clearTimeout(endTimer); cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", size);
      window.removeEventListener("keydown", key);
    }
  };
}
})();
