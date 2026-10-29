/* ==========================================================
   LC's Night Shift HQ - Night Corridor (v2, Autumn 2 2026)
   LC's HQ game. The building after hours: a place that keeps
   looping. Walk it. If anything is different from normal, turn
   back. If nothing has changed, keep walking. Eight good calls in
   a row and you clock off at Floor 8.

   What is in it:
     - six places that open over the term (the Corridor, the
       Stairwell, the Staff Room, the Library, the Boiler Room and
       the Roof), each with its own looping layout
     - 60 or so things that can be different, from obvious to very
       sneaky, all collected in the anomaly log with a little
       picture and a dry note
     - three shift settings (Cosy, Night, Graveyard): how far a
       slip drops you
     - torches to unlock (a wide beam, a flickery one, a UV torch
       that shows hidden things, an old lantern), Lights out mode,
       a flask of tea, a night radio, and an ID badge that ranks up
     - the weekly era (HQGame.era()): the building is haunted by
       an era each week, with one silly rule
     - Jay and Bonnie secrets, never scored
   Spooky, never gory. No sudden loud noises (LC has the jumpscare
   buttons for those). Everything is drawn in code. Sound can be
   turned off. Arrow keys or W and S also work; A and D move the
   torch.

   Any page:  window.LCCorridor.open() / .close()
              window.LCCorridor.scene(floor, odd, reveal, idp)
              (the corridor behind the home greeting, /lc/night.js)
   The earned break around it is in /lc/break.js (/data/hqbreak.js).
   Unlocks and the weekly era come from /data/hqgame.js (optional).
   Saves in b5.lc.corridor.v1 (the v1 save is kept and migrated:
   best, runs, clocked, sound and seen all carry over).
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(window.LCCorridor) return;

var KEY = "b5.lc.corridor.v1";
var GOAL = 8;
var CHANCE = 0.55;          /* how often a floor has something different in it */
var RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
var G = window.HQGame;
var PREFIX = (window.HQ && window.HQ.prefix) || "b5.lc.";

/* ---------- the save ---------- */
var store = { ver: 2, best: 0, runs: 0, clocked: 0, sound: true, seen: {}, sec: {}, bests: {}, clockedAt: {},
  place: "corridor", torch: "std", strict: "night", dark: false, radio: false, badge: "lam", unl: null, birds: 0, spots: 0 };
function load(){
  try{
    var o = JSON.parse(localStorage.getItem(KEY) || "null");
    if(o && typeof o === "object") for(var k in store) if(o[k] !== undefined) store[k] = o[k];
  }catch(e){}
  ["seen", "sec", "bests", "clockedAt"].forEach(function(k){ if(!store[k] || typeof store[k] !== "object") store[k] = {}; });
  /* the v1 save only had one best, and it was always the corridor */
  if(store.best && !(store.bests.corridor >= store.best)) store.bests.corridor = store.best;
  store.ver = 2;
}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(store)); }catch(e){} }
load();

/* ---------- the weekly era ---------- */
var ERA1 = { n: 1, id: "stone", name: "Stone Age", line: "Everything is made of rock. Even the bad ideas." };
function era(){ try{ if(G && G.era){ var e = G.era(); if(e && e.id) return e; } }catch(e){} return ERA1; }
/* the silly rule for each week */
var RULE = {
  stone:     "A small mammoth wanders about. It is allowed.",
  egypt:     "Floors are counted in pyramids. The cat is meant to be there.",
  rome:      "Floor numbers are in Roman numerals. Romans had no zero.",
  viking:    "Turning back is Row back. Keeping on is Onward.",
  victorian: "The portraits approve of good calls.",
  eighties:  "Your floor is an arcade score now.",
  future:    "A robot cleaner does laps. It is meant to be there."
};

/* ---------- unlocks over the term ---------- */
var LADDER = [
  { at: 0,    id: "p_corridor", kind: "place", ref: "corridor", name: "The Corridor",   d: "Where it all started." },
  { at: 0,    id: "t_std",      kind: "torch", ref: "std",      name: "Standard torch", d: "Points at things. Reliable." },
  { at: 120,  id: "p_stairs",   kind: "place", ref: "stairs",   name: "The Stairwell",  d: "Up and up. Mind the step." },
  { at: 250,  id: "t_wide",     kind: "torch", ref: "wide",     name: "Wide beam",      d: "A bigger circle of brave." },
  { at: 400,  id: "p_staff",    kind: "place", ref: "staff",    name: "The Staff Room", d: "Kettle, sofa, mysteries." },
  { at: 550,  id: "b_glow",     kind: "badge", ref: "glow",     name: "Glow badge",     d: "Your ID badge glows in the dark." },
  { at: 700,  id: "t_flicker",  kind: "torch", ref: "flicker",  name: "Flickery torch", d: "Batteries nearly gone. Atmospheric." },
  { at: 900,  id: "p_lib",      kind: "place", ref: "lib",      name: "The Library",    d: "Shhh. Something is reading." },
  { at: 1100, id: "t_uv",       kind: "torch", ref: "uv",       name: "UV torch",       d: "Shows things nobody else can see." },
  { at: 1350, id: "m_dark",     kind: "mode",  ref: "dark",     name: "Lights out",     d: "Strip lights off. Just you and the torch." },
  { at: 1600, id: "p_boiler",   kind: "place", ref: "boiler",   name: "The Boiler Room", d: "Warm, clanky, a bit alive." },
  { at: 1900, id: "i_flask",    kind: "item",  ref: "flask",    name: "Flask of tea",   d: "Once a shift, shrug off one slip." },
  { at: 2300, id: "p_roof",     kind: "place", ref: "roof",     name: "The Roof",       d: "Stars, wind, and a city asleep." },
  { at: 2700, id: "t_lantern",  kind: "torch", ref: "lantern",  name: "Old lantern",    d: "Warm and wide. Very haunted house." },
  { at: 3200, id: "m_radio",    kind: "mode",  ref: "radio",    name: "Night radio",    d: "A quiet tune for the shift." },
  { at: 4000, id: "b_gold",     kind: "badge", ref: "gold",     name: "Gold badge",     d: "Head of Nights. The building salutes you." }
];
var LD = null, HAVE = {};
function refreshLadder(){
  LD = null;
  if(G && G.ladder){ try{ LD = G.ladder(PREFIX, LADDER); }catch(e){ LD = null; } }
  if(!LD){
    var h = LADDER.filter(function(x){ return !x.at; }), nx = LADDER.filter(function(x){ return x.at > 0; })[0];
    LD = { have: h, next: nx, need: nx ? nx.at : 0, sparks: 0 };
  }
  HAVE = {};
  LD.have.forEach(function(x){ HAVE[x.id] = 1; });
  /* the first time the new version opens, the starting things are not "new" */
  if(!store.unl){ store.unl = LADDER.filter(function(x){ return !x.at; }).map(function(x){ return x.id; }); save(); }
}
function has(id){ return !!HAVE[id]; }
refreshLadder();

/* ---------- torches and shifts ---------- */
var TORCH = {
  std:     { name: "Standard torch", r: 150, col: "#fff2c0", dark: 0.36 },
  wide:    { name: "Wide beam",      r: 215, col: "#fff6d8", dark: 0.34 },
  flicker: { name: "Flickery torch", r: 160, col: "#ffe6a0", dark: 0.42, flick: true },
  uv:      { name: "UV torch",       r: 150, col: "#a46bff", dark: 0.4, uv: true },
  lantern: { name: "Old lantern",    r: 250, col: "#ffcf7a", dark: 0.26 }
};
var STRICT = [
  { id: "cosy",      name: "Cosy shift",      drop: 1,  d: "A slip drops you 1 floor." },
  { id: "night",     name: "Night shift",     drop: 3,  d: "A slip drops you 3 floors." },
  { id: "graveyard", name: "Graveyard shift", drop: 99, d: "A slip and it is back to Floor 0." }
];
function strictOf(id){ for(var i = 0; i < STRICT.length; i++) if(STRICT[i].id === id) return STRICT[i]; return STRICT[1]; }

/* small helpers */
function hh(i){ var x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); }
function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function roman(n){ if(!n) return "NIL"; var r = "", v = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]; for(var i = 0; i < v.length; i++) while(n >= v[i][0]){ r += v[i][1]; n -= v[i][0]; } return r; }

/* ---------- drawing ----------
   A real one point perspective space. World units: the walls are
   at x = -1 and x = 1, the floor is y = 0, the ceiling y = CEIL and
   the eye is at EYE, looking down +z. P() turns a world point into
   a point on the 800 x 500 picture. Every wall slice, floor tile and
   ceiling tile is shaded by how near it is to a working light, and
   things get darker the further away they are. Signs and posters
   are drawn flat and then laid onto the wall, so they line up. */
var W = 800, H = 500, CX = 400, CY = 226, F = 380;
var EYE = 1.42, CEIL = 2.3, NZ = 0.5, FZ = 5.6, DH = 1.95;
var LIGHTZ = [1.25, 2.45, 3.65, 4.85];

function P(x, y, z){ return [CX + F * x / z, CY - F * (y - EYE) / z]; }
function pt(p){ return p[0].toFixed(1) + "," + p[1].toFixed(1); }
function poly(pts, fill, extra){ return '<polygon points="' + pts.map(pt).join(" ") + '" fill="' + fill + '"' + (extra || "") + '/>'; }
function wallQ(s, za, zb, ya, yb){ return [P(s, ya, za), P(s, yb, za), P(s, yb, zb), P(s, ya, zb)]; }
function floorQ(xa, xb, za, zb, y){ y = y || 0; return [P(xa, y, za), P(xb, y, za), P(xb, y, zb), P(xa, y, zb)]; }
function faceQ(xa, xb, ya, yb, z){ return [P(xa, ya, z), P(xa, yb, z), P(xb, yb, z), P(xb, ya, z)]; }

function rgb(h){ return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
function hex(c){ return "#" + c.map(function(v){ v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? "0" : "") + v.toString(16); }).join(""); }
var WARM = [255, 240, 190], COLD = [180, 210, 255];
var SC = {};
function shade(h, k){
  var key = h + k.toFixed(2) + (CUR.blue ? "b" : "");
  if(SC[key]) return SC[key];
  var c = rgb(h), out, warm = CUR.blue ? COLD : WARM;
  if(CUR.blue) c = [c[0] * 0.78, c[1] * 0.9, c[2] * 1.12];
  if(k <= 1) out = hex(c.map(function(v){ return v * k; }));
  else { var t = Math.min(1, (k - 1) * 1.6); out = hex(c.map(function(v, i){ return v + (warm[i] - v) * t * 0.5; })); }
  SC[key] = out;
  return out;
}
/* the current drawing: which place, which lights are on, and so on */
var CUR = { lights: [1, 1, 1, 1], blue: false, place: null };
function lit(z){
  if(CUR.place && CUR.place.open) return 0.66 * (1 - 0.3 * Math.min(1, z / FZ));
  var k = 0.26, L = CUR.lights;
  for(var i = 0; i < LIGHTZ.length; i++) if(L[i]){ var d = z - LIGHTZ[i]; k += 0.78 * Math.exp(-(d * d) / 0.62); }
  return Math.min(1.12, k) * (1 - 0.42 * Math.min(1, z / FZ));
}
function onWall(s, zc, yc, svg){
  var a = F / (zc * zc) * 0.01, b = F * (yc - EYE) / (zc * zc) * -s * 0.01, d = F / zc * 0.01, p = P(s, yc, zc);
  return '<g transform="matrix(' + [a, b, 0, d, p[0], p[1]].map(function(v){ return +v.toFixed(4); }).join(" ") + ')">' + svg + '</g>';
}
function standUp(x, y, z, svg, unit){
  var p = P(x, y, z), k = F / z * (unit || 0.01);
  return '<g transform="translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ') scale(' + k.toFixed(4) + ')">' + svg + '</g>';
}
/* a flat drawing laid on the floor (cm units, +y goes away from you) */
function onFloor(x, z, y, svg){
  var p = P(x, y, z), sx = F / z * 0.01, sy = F * (EYE - y) / (z * z) * 0.01;
  return '<g transform="translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ') scale(' + sx.toFixed(4) + ' ' + (-sy).toFixed(4) + ')">' + svg + '</g>';
}
function txt(x, y, size, fill, s, extra, weight){
  return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="' + (weight || 700) + '" font-size="' + size + '" fill="' + fill + '"' + (extra || "") + '>' + s + '</text>';
}
function ell(c, rx, ry, fill, extra){ return '<ellipse cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" rx="' + rx.toFixed(1) + '" ry="' + ry.toFixed(1) + '" fill="' + fill + '"' + (extra || "") + '/>'; }

/* ---------- the places ---------- */
var STEP0 = 3.0, STEPD = 0.3, STEPN = 7, STEPH = 0.12;
function stairY(z){ if(z < STEP0) return 0; var i = Math.floor((z - STEP0) / STEPD); return Math.min(STEPN, i + 1) * STEPH; }
var PLACES = {
  corridor: { name: "The Corridor", short: "Corridor", paper: ["#b8a45c", "#ab9752"], low: "#6f6440", rail: "#4a3f28", skirt: "#2c271b",
    floor: "check", tA: "#77725f", tB: "#6a6553", grout: "#3a372c", ceil: ["#d9d4b8", "#cfc9ad"], ceilT: "tiles", lamp: "strip" },
  stairs:   { name: "The Stairwell", short: "Stairwell", paper: ["#a7b393", "#9caa88"], low: "#55705a", rail: "#2f3d30", skirt: "#22281f",
    floor: "stairs", tA: "#8b8a82", tB: "#807f77", grout: "#4a4943", ceil: ["#cfd2c4", "#c8cbbd"], ceilT: "plain", lamp: "round" },
  staff:    { name: "The Staff Room", short: "Staff Room", paper: ["#8f9db2", "#8695aa"], low: "#7a6248", rail: "#4a3c2a", skirt: "#2e2618",
    floor: "carpet", tA: "#5f4f6e", tB: "#584866", grout: "#3a2f45", ceil: ["#dcd9cc", "#d2cfc1"], ceilT: "tiles", lamp: "strip" },
  lib:      { name: "The Library", short: "Library", paper: ["#3f2c1c", "#3a2819"], low: "#3a2819", rail: "#2a1d12", skirt: "#1d140c",
    floor: "carpet", tA: "#40604a", tB: "#3a5944", grout: "#26382c", ceil: ["#6a5038", "#5e4631"], ceilT: "beams", lamp: "pendant", shelves: true },
  boiler:   { name: "The Boiler Room", short: "Boiler Room", paper: ["#7c4c3a", "#734535"], low: "#5e3b2e", rail: "#3a2a20", skirt: "#2a1d16",
    floor: "concrete", tA: "#5f5f5a", tB: "#595954", grout: "#3c3c38", ceil: ["#3e3d38", "#383732"], ceilT: "pipes", lamp: "cage", brick: true },
  roof:     { name: "The Roof", short: "Roof", paper: ["#6d6a66", "#65625e"], low: "#5d5a56", rail: "#8a8780", skirt: "#3a3836",
    floor: "gravel", tA: "#45474e", tB: "#41434a", grout: "#2f3036", open: true, lamp: "none" }
};
var PORDER = ["corridor", "stairs", "staff", "lib", "boiler", "roof"];
function placeOpen(id){ return id === "corridor" || has("p_" + id); }
function floorY(z){ return CUR.place && CUR.place.floor === "stairs" ? stairY(z) : 0; }

/* the room itself: ceiling, floor, walls, far wall */
function room(idp){
  var pl = CUR.place, s = "", z, i, j, k;
  /* ceiling */
  if(!pl.open){
    var cz = [NZ, 0.9, 1.5, 2.1, 2.7, 3.3, 3.9, 4.5, 5.1, FZ];
    for(i = 0; i < cz.length - 1; i++){
      k = lit((cz[i] + cz[i + 1]) / 2) * 0.95;
      if(pl.ceilT === "tiles"){
        for(j = 0; j < 4; j++){
          var xa = -1 + j * 0.5, gone = CUR.o("tile") && i === 3 && j === 2;
          var q = floorQ(xa, xa + 0.5, cz[i], cz[i + 1], CEIL);
          s += gone ? CUR.hi("tile", poly(q, "#0a0a08", ' stroke="#2a2920" stroke-width="1"') + poly(floorQ(xa + 0.05, xa + 0.3, cz[i] + 0.05, cz[i + 1] - 0.1, CEIL), "#1a1a14")) :
            poly(q, shade((i + j) % 2 ? pl.ceil[0] : pl.ceil[1], k), ' stroke="' + shade("#8f8a72", k) + '" stroke-width="1"');
        }
      } else s += poly(floorQ(-1, 1, cz[i], cz[i + 1], CEIL), shade(i % 2 ? pl.ceil[0] : pl.ceil[1], k));
    }
    if(pl.ceilT === "beams") for(z = 0.9; z < FZ; z += 0.9) s += poly(floorQ(-1, 1, z, z + 0.14, CEIL - 0.02), shade("#3a2a1a", lit(z)));
    if(pl.ceilT === "pipes"){
      [-0.55, -0.35, 0.5].forEach(function(px, n){
        var a = P(px, CEIL - 0.08 - n * 0.03, NZ), b = P(px, CEIL - 0.08 - n * 0.03, FZ);
        s += '<path d="M' + pt(a) + 'L' + pt(b) + '" stroke="' + ["#6b6a5e", "#8a5a3a", "#5e6b6a"][n] + '" stroke-width="' + (14 - n * 3) + '" stroke-linecap="round" opacity=".9"/>';
      });
    }
  } else {
    /* the open sky */
    s += '<rect width="800" height="500" fill="url(#' + idp + 'Sky)"/>';
    for(i = 0; i < 70; i++){
      var sx = hh(i) * 800, sy = hh(i + 99) * 210;
      s += '<circle cx="' + sx.toFixed(0) + '" cy="' + sy.toFixed(0) + '" r="' + (hh(i + 7) < 0.15 ? 1.6 : 0.9) + '" fill="#fffbe0" opacity="' + (0.35 + hh(i + 3) * 0.6).toFixed(2) + '"/>';
    }
    /* the city asleep, beyond the roof */
    var hz = CY + 6, bx = 0, cityOff = CUR.o("city");
    for(i = 0; bx < 800; i++){
      var bw = 26 + hh(i + 40) * 40, bh = 20 + hh(i + 60) * 70;
      s += '<rect x="' + bx.toFixed(0) + '" y="' + (hz - bh).toFixed(0) + '" width="' + bw.toFixed(0) + '" height="' + (bh + 30).toFixed(0) + '" fill="#141826"/>';
      if(!cityOff) for(j = 0; j < 4; j++) if(hh(i * 7 + j) < 0.4) s += '<rect x="' + (bx + 5 + j * 6).toFixed(0) + '" y="' + (hz - bh + 8 + (j % 2) * 12).toFixed(0) + '" width="3" height="4" fill="#ffe28a" opacity=".8"/>';
      bx += bw + 2;
    }
    if(cityOff) s += CUR.hi("city", '<rect x="0" y="' + (hz - 60) + '" width="800" height="62" fill="#000" opacity=".25"/>');
  }

  /* floor */
  var fz = [NZ];
  for(z = 0.75; z < FZ; z += 0.42) fz.push(z);
  fz.push(FZ);
  if(pl.floor === "stairs"){
    for(i = 0; i < fz.length - 1 && fz[i] < STEP0; i++){
      k = lit((fz[i] + fz[i + 1]) / 2) * 0.92;
      s += poly(floorQ(-1, 1, fz[i], Math.min(STEP0, fz[i + 1])), shade(i % 2 ? pl.tA : pl.tB, k));
    }
    var steps = "";
    for(i = STEPN; i >= 0; i--){
      var za = STEP0 + i * STEPD, zb = i === STEPN ? FZ : za + STEPD, y0 = i * STEPH, y1 = (i + 1) * STEPH;
      if(i === STEPN) y1 = y0;
      k = lit(za + 0.15);
      var missing = CUR.o("step") && i === 3;
      if(i < STEPN){
        steps += poly(floorQ(-1, 1, za, zb, y1), missing ? "#0c0c0a" : shade(pl.tA, k * 0.95));
        steps += poly(faceQ(-1, 1, y0, y1, za), missing ? "#060605" : shade(pl.tB, k * 0.7));
        if(!missing) steps += poly(floorQ(-1, 1, za, za + 0.04, y1 + 0.002), shade("#c9b23a", k));
      } else steps += poly(floorQ(-1, 1, za, zb, y0), shade(pl.tA, k * 0.9));
    }
    if(CUR.o("step")) steps = CUR.hi("step", steps);
    s += '<g id="' + idp + 'Steps">' + steps + '</g>';
  } else {
    for(i = 0; i < fz.length - 1; i++){
      k = lit((fz[i] + fz[i + 1]) / 2) * 0.92;
      if(pl.floor === "check"){
        for(j = 0; j < 4; j++){
          var fx = -1 + j * 0.5;
          s += poly(floorQ(fx, fx + 0.5, fz[i], fz[i + 1]), shade((i + j) % 2 ? pl.tA : pl.tB, k), ' stroke="' + shade(pl.grout, k) + '" stroke-width="1.2"');
        }
      } else if(pl.floor === "concrete"){
        s += poly(floorQ(-1, 1, fz[i], fz[i + 1]), shade(i % 2 ? pl.tA : pl.tB, k), ' stroke="' + shade(pl.grout, k) + '" stroke-width="1"');
      } else {
        s += poly(floorQ(-1, 1, fz[i], fz[i + 1]), shade(i % 2 ? pl.tA : pl.tB, k));
      }
    }
    if(pl.floor === "gravel") for(i = 0; i < 60; i++){
      var gz = 0.7 + hh(i + 300) * 4.6, gp = P(-0.95 + hh(i + 200) * 1.9, 0, gz);
      s += '<circle cx="' + gp[0].toFixed(0) + '" cy="' + gp[1].toFixed(0) + '" r="' + (F * 0.012 / gz).toFixed(1) + '" fill="#5a5c64" opacity=".7"/>';
    }
  }

  /* the two side walls in thin slices, so the light can fall along them */
  [-1, 1].forEach(function(sd){
    var side = sd < 0 ? 0.9 : 1, n = 0, red = CUR.o("paper");
    var PA = red ? "#8a2c26" : pl.paper[0], PB = red ? "#782420" : pl.paper[1], LOW = red ? "#4e1a17" : pl.low;
    var top = pl.open ? 0.85 : CEIL, step = CUR.lite ? 0.6 : 0.2;
    for(z = NZ; z < FZ - 0.001; z += step){
      var z2 = Math.min(FZ, z + step), kk = lit((z + z2) / 2) * side;
      if(pl.open){
        s += poly(wallQ(sd, z, z2, 0, top), shade(n % 2 ? PA : PB, kk));
        s += poly(wallQ(sd, z, z2, top, top + 0.06), shade(pl.rail, kk));
      } else {
        s += poly(wallQ(sd, z, z2, 0.98, CEIL), shade(n % 2 ? PA : PB, kk));
        s += poly(wallQ(sd, z, z2, 0.14, 0.92), shade(LOW, kk));
        s += poly(wallQ(sd, z, z2, 0.92, 0.98), shade(pl.rail, kk));
        s += poly(wallQ(sd, z, z2, 0, 0.14), shade(pl.skirt, kk));
      }
      n++;
    }
    if(red) s += CUR.hi("paper", poly(wallQ(sd, NZ + 0.3, NZ + 0.5, 1.2, 1.4), PA, ' opacity=".01"'));
    if(pl.brick){
      var br = "";
      for(var by = 0.3; by < CEIL; by += 0.18) br += '<path d="M' + pt(P(sd, by, NZ)) + 'L' + pt(P(sd, by, FZ)) + '" stroke="#000" stroke-opacity=".22" stroke-width="1"/>';
      s += br;
    }
    if(!pl.open){
      s += poly(wallQ(sd, NZ, FZ, 0, CEIL), "url(#" + idp + "Wall)");
      s += poly(wallQ(sd, NZ, FZ, CEIL - 0.05, CEIL), "#000", ' opacity=".18"');
    }
  });
  return s;
}

/* ---------- pieces of furniture ---------- */
/* a door in a side wall: frame, leaf with two panels, handle, number plate. open = lit room behind */
function door(sd, za, zb, open, label, opt){
  opt = opt || {};
  var k = lit((za + zb) / 2), out = "", leaf = opt.leaf || "#5e4730";
  out += poly(wallQ(sd, za - 0.07, zb + 0.07, 0, DH + 0.08), shade("#3a2c1b", k));
  var inner = sd * 1.06;
  out += poly([P(sd, 0, zb), P(sd, DH, zb), P(inner, DH, zb), P(inner, 0, zb)], shade("#2b2015", k));
  var lz0 = open ? za + (zb - za) * 0.4 : za, lin = inner;
  if(open){
    out += poly([P(inner, 0, za), P(inner, DH, za), P(inner, DH, zb), P(inner, 0, zb)], "#ffe98a");
    out += poly([P(sd, 0, za - 0.05), P(sd, 0, lz0), P(sd * 0.3, 0, lz0 + 0.5), P(sd * 0.5, 0, za)], "#ffe98a", ' opacity=".28"');
  }
  out += poly([P(lin, 0, lz0), P(lin, DH, lz0), P(lin, DH, zb), P(lin, 0, zb)], shade(leaf, k * (open ? 0.85 : 1)));
  var u = function(f){ return lz0 + (zb - lz0) * f; };
  var pc = shade(opt.panel || "#523e29", k), ps = ' stroke="' + shade("#3a2c1b", k) + '" stroke-width="1.2"';
  if(opt.glass) out += poly([P(lin, 1.25, u(0.25)), P(lin, 1.75, u(0.25)), P(lin, 1.75, u(0.75)), P(lin, 1.25, u(0.75))], "#1c2a2c", ps);
  else out += poly([P(lin, 1.05, u(0.15)), P(lin, 1.78, u(0.15)), P(lin, 1.78, u(0.85)), P(lin, 1.05, u(0.85))], pc, ps);
  out += poly([P(lin, 0.16, u(0.15)), P(lin, 0.9, u(0.15)), P(lin, 0.9, u(0.85)), P(lin, 0.16, u(0.85))], pc, ps);
  out += poly([P(lin, 0.02, u(0.04)), P(lin, 0.12, u(0.04)), P(lin, 0.12, u(0.96)), P(lin, 0.02, u(0.96))], shade("#8d8a7c", k));
  var hz = u((open || opt.flip) ? 0.12 : 0.88), hp = P(lin, 1.0, hz), hr = F * 0.035 / hz;
  out += ell(hp, hr * 0.75, hr, shade("#d8c27a", k), ' stroke="#2a2010" stroke-width=".8"');
  out += poly(wallQ(sd, za - 0.07, za + 0.01, 0, DH + 0.08), shade("#3a2c1b", k));
  out += poly(wallQ(sd, za - 0.07, zb + 0.07, DH, DH + 0.08), shade("#3a2c1b", k));
  if(label) out += onWall(sd, (za + zb) / 2, DH + 0.2, '<rect x="-18" y="-8" width="36" height="16" rx="2" fill="#1f2a22" stroke="#9e987a" stroke-width="1.5"/>' + txt(0, 4.5, label.length > 3 ? 8 : 11, "#cfc9a6", label));
  return out;
}

/* ceiling lights in four styles. i = which light, so the bird and the odd colour know where to go */
function lamp(i, idp){
  var lz = LIGHTZ[i], on = CUR.lights[i], blue = CUR.o("lightcol") && i === 2, style = CUR.place.lamp, out = "";
  var y = CEIL - 0.1, c = P(0, y, lz);
  var glowFill = blue ? "url(#" + idp + "GlowB)" : "url(#" + idp + "Glow)";
  var flick = i === 2 && !blue ? ' class="lcc-flick"' : "";
  if(style === "strip"){
    var za = lz - 0.24, zb = lz + 0.24, xa = -0.36, xb = 0.36;
    out += '<path d="M' + pt(P(-0.25, CEIL, lz)) + 'L' + pt(P(-0.25, y, lz)) + 'M' + pt(P(0.25, CEIL, lz)) + 'L' + pt(P(0.25, y, lz)) + '" stroke="#55534a" stroke-width="1.2"/>';
    if(on) out += ell(c, F * 0.95 / lz, F * 0.42 / lz, glowFill, flick);
    out += poly([P(xa, y, za), P(xb, y, za), P(xb, y, zb), P(xa, y, zb)], on ? (blue ? "#d8ecff" : "#fffbe6") : "#4e4d44", on ? flick : "");
    out += poly([P(xa, y, za), P(xb, y, za), P(xb, y + 0.05, za), P(xa, y + 0.05, za)], on ? "#9c9a8a" : "#3e3d36");
  } else if(style === "round"){
    c = P(0, CEIL - 0.02, lz);
    if(on) out += ell(c, F * 0.8 / lz, F * 0.36 / lz, glowFill, flick);
    out += ell(c, F * 0.2 / lz, F * 0.07 / lz, on ? (blue ? "#d8ecff" : "#fffbe6") : "#4e4d44", ' stroke="#77766a" stroke-width="1.5"');
  } else if(style === "pendant"){
    var top = P(0, CEIL, lz), sh = P(0, CEIL - 0.42, lz), r = F * 0.16 / lz;
    out += '<line x1="' + top[0].toFixed(1) + '" y1="' + top[1].toFixed(1) + '" x2="' + sh[0].toFixed(1) + '" y2="' + sh[1].toFixed(1) + '" stroke="#2a2010" stroke-width="1.2"/>';
    if(on) out += ell([sh[0], sh[1] + r * 0.6], F * 0.7 / lz, F * 0.34 / lz, glowFill, flick);
    out += '<path d="M' + (sh[0] - r).toFixed(1) + ' ' + (sh[1] + r * 0.6).toFixed(1) + 'L' + (sh[0] - r * 0.4).toFixed(1) + ' ' + sh[1].toFixed(1) + 'H' + (sh[0] + r * 0.4).toFixed(1) + 'L' + (sh[0] + r).toFixed(1) + ' ' + (sh[1] + r * 0.6).toFixed(1) + 'Z" fill="#2e5a3e" stroke="#1a2a1e" stroke-width="1"/>';
    out += ell([sh[0], sh[1] + r * 0.62], r * 0.9, r * 0.18, on ? (blue ? "#d8ecff" : "#fff2c0") : "#4e4d44", flick);
  } else if(style === "cage"){
    var cc = P(0, CEIL - 0.25, lz), rr = F * 0.07 / lz;
    out += '<line x1="' + cc[0].toFixed(1) + '" y1="' + P(0, CEIL, lz)[1].toFixed(1) + '" x2="' + cc[0].toFixed(1) + '" y2="' + cc[1].toFixed(1) + '" stroke="#2a2010" stroke-width="1.5"/>';
    if(on) out += ell(cc, F * 0.65 / lz, F * 0.4 / lz, glowFill, flick);
    out += '<circle cx="' + cc[0].toFixed(1) + '" cy="' + (cc[1] + rr).toFixed(1) + '" r="' + rr.toFixed(1) + '" fill="' + (on ? (blue ? "#d8ecff" : "#ffe6a0") : "#4e4d44") + '"' + flick + '/>';
    out += '<path d="M' + (cc[0] - rr * 1.3).toFixed(1) + ' ' + (cc[1] + rr).toFixed(1) + 'a' + (rr * 1.3).toFixed(1) + ' ' + (rr * 1.3).toFixed(1) + ' 0 0 0 ' + (rr * 2.6).toFixed(1) + ' 0M' + cc[0].toFixed(1) + ' ' + cc[1].toFixed(1) + 'v' + (rr * 2.3).toFixed(1) + '" stroke="#3a3a30" stroke-width="1.2" fill="none"/>';
  }
  return out;
}
function lampY(){ var st = CUR.place.lamp; return st === "pendant" ? CEIL - 0.42 : st === "cage" ? CEIL - 0.25 : st === "round" ? CEIL - 0.03 : CEIL - 0.1; }

function clockFace(kind){
  var nums = "";
  for(var n = 1; n <= 12; n++){
    var a = (kind === "clockback" ? -1 : 1) * (n / 12) * Math.PI * 2, lab = kind === "clock" && n === 12 ? 13 : n;
    nums += txt((Math.sin(a) * 15.5).toFixed(1), (-Math.cos(a) * 15.5 + 2.6).toFixed(1), lab > 9 ? 6 : 7, "#2a2920", lab, "", 700);
  }
  var hands = kind === "clocknone" ? "" :
    '<line x1="0" y1="0" x2="0" y2="-11" stroke="#2a2920" stroke-width="2.5" stroke-linecap="round"/><line x1="0" y1="0" x2="8" y2="3" stroke="#2a2920" stroke-width="2" stroke-linecap="round"/>' +
    '<g class="lcc-sec' + (kind === "clockback" ? " rev" : "") + '"><line x1="0" y1="3" x2="0" y2="-16" stroke="#8a5a2a" stroke-width="1"/></g>';
  return '<circle r="22" fill="#fffbe8" stroke="#2a2920" stroke-width="3.5"/>' + nums + hands + '<circle r="2" fill="#2a2920"/>';
}
function clockOn(sd, z, y){
  var k = CUR.o("clock") ? "clock" : CUR.o("clocknone") ? "clocknone" : CUR.o("clockback") ? "clockback" : "";
  var svg = onWall(sd, z, y, clockFace(k));
  return k ? CUR.hi(k, svg) : svg;
}
function plaqueOn(sd, z, y){
  var f = CUR.floor, shown = CUR.o("plaque") ? (f + 3) % 9 : f;
  var lab = CUR.eraId === "rome" ? roman(shown) : String(shown);
  return CUR.hi("plaque", onWall(sd, z, y,
    '<rect x="-24" y="-15" width="48" height="30" rx="3" fill="#1f2a22" stroke="#cfc9a6" stroke-width="2.5"/>' +
    txt(0, -4, 7.5, "#cfc9a6", "FLOOR") + txt(0, 11.5, lab.length > 2 ? 9 : 14, "#fbf8e4", lab)));
}
/* a box standing against a side wall: front face (towards the corridor) and top */
function boxOnWall(sd, za, zb, depth, h, col, k){
  var xi = sd * (1 - depth), out = "";
  out += poly([P(xi, 0, za), P(xi, h, za), P(sd, h, za), P(sd, 0, za)], shade(col, k * 0.8));
  out += poly([P(xi, 0, za), P(xi, h, za), P(xi, h, zb), P(xi, 0, zb)], shade(col, k));
  out += poly([P(xi, h, za), P(sd, h, za), P(sd, h, zb), P(xi, h, zb)], shade(col, k * 1.15));
  return out;
}

function wetSign(x, z, dry){
  return standUp(x, floorY(z), z,
    '<ellipse cx="0" cy="0" rx="30" ry="5" fill="#000" opacity=".35"/>' +
    '<path d="M-26 0 L-12 -64 L12 -64 L26 0 L19 0 L9 -54 L-9 -54 L-19 0 Z" fill="#f2c916" stroke="#2a2920" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<path d="M-21 -2 L-10 -56 L10 -56 L21 -2 Z" fill="#f7d42a"/>' +
    '<path d="M-6 -46 l6 -8 l6 8 z" fill="none" stroke="#2a2920" stroke-width="2"/>' +
    txt(0, -30, 9, "#2a2920", dry ? "DRY" : "WET") + txt(0, -19, 8, "#2a2920", "FLOOR") +
    '<path d="M-9 -8 q4 -6 9 -3 q5 -5 9 1" stroke="#2a2920" stroke-width="2" fill="none"/>');
}
function exitSign(idp){
  var ez = 4.3, s = "", e1 = P(-0.3, CEIL, ez), e2 = P(0.3, CEIL, ez), arrow = CUR.o("exitarrow") ? -1 : 1;
  s += '<line x1="' + e1[0].toFixed(1) + '" y1="' + e1[1].toFixed(1) + '" x2="' + e1[0].toFixed(1) + '" y2="' + P(-0.3, 2.13, ez)[1].toFixed(1) + '" stroke="#2a2920" stroke-width="1.5"/>' +
       '<line x1="' + e2[0].toFixed(1) + '" y1="' + e2[1].toFixed(1) + '" x2="' + e2[0].toFixed(1) + '" y2="' + P(0.3, 2.13, ez)[1].toFixed(1) + '" stroke="#2a2920" stroke-width="1.5"/>';
  s += ell(P(0, 2.03, ez), F * 0.75 / ez, F * 0.38 / ez, "url(#" + idp + "Exit)", ' class="lcc-glow"');
  var sign = standUp(0, 1.93, ez,
    '<rect x="-38" y="-22" width="76" height="22" rx="2" fill="#123c22" stroke="#0a1a10" stroke-width="2"/>' +
    txt(-6, -6, 15, "#5dff9b", CUR.o("exit") ? "TIXE" : "EXIT", ' class="lcc-glow"') +
    '<path d="M' + (24 - 6 * arrow) + ' -11h' + (12 * arrow) + 'm' + (-5 * arrow) + ' -5l' + (5 * arrow) + ' 5l' + (-5 * arrow) + ' 5" stroke="#5dff9b" stroke-width="2.5" fill="none"/>');
  return s + (CUR.o("exit") ? CUR.hi("exit", sign) : CUR.o("exitarrow") ? CUR.hi("exitarrow", sign) : sign);
}
function figure(){
  var z = FZ - 0.25;
  return CUR.hi("figure", '<g class="lcc-fig">' + standUp(0.32, floorY(z), z,
    '<ellipse cx="0" cy="-4" rx="30" ry="6" fill="#000" opacity=".4"/>' +
    '<path d="M-22 0 L-19 -84 Q-24 -128 -15 -138 L15 -138 Q24 -128 19 -84 L22 0 Z" fill="#0b0b09"/>' +
    '<ellipse cx="0" cy="-154" rx="13" ry="16" fill="#0b0b09"/><rect x="-6" y="-142" width="12" height="8" fill="#0b0b09"/>') + '</g>');
}
function birdOn(i){
  var lz = LIGHTZ[i], y = lampY();
  return '<g class="lcc-bird" data-tap="bird">' + standUp(0.18, y, lz - 0.2,
    '<g transform="translate(0 -12)"><ellipse cx="0" cy="0" rx="14" ry="10" fill="#3a8fd6"/><circle cx="11" cy="-7" r="8" fill="#3a8fd6"/><path d="M18 -8l8 3-8 3z" fill="#f2a516"/>' +
    '<circle cx="13" cy="-9" r="1.8" fill="#111"/><path d="M-12 2l-11-4 4 8z" fill="#2f78b8"/><path d="M-2 9v4M4 9v4" stroke="#f2a516" stroke-width="2"/></g>') + '</g>';
}
function bonnie(x, z, pose){
  return standUp(x, floorY(z), z, '<g transform="translate(0 -51)">' + (window.A2ART ? A2ART.bonnie(0, 0, 1, pose || "sit") :
    '<ellipse cx="0" cy="16" rx="24" ry="26" fill="#9c6b45"/><circle cx="0" cy="-26" r="18" fill="#a87650"/>') + '</g>', 0.005);
}
function moon(x, y, r){ return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#f4f0d6"/><circle cx="' + (x - r * 0.3) + '" cy="' + (y - r * 0.2) + '" r="' + (r * 0.18) + '" fill="#d9d4b4"/><circle cx="' + (x + r * 0.35) + '" cy="' + (y + r * 0.3) + '" r="' + (r * 0.12) + '" fill="#d9d4b4"/>'; }

/* ---------- the things that can be different ----------
   pl: which places it can turn up in ("*" is anywhere, "lit" is
   anywhere with ceiling lights). t: 1 easy to see, 2 sneaky,
   3 rare and creepy. say: what was different (told after a call).
   note: the dry line on its anomaly log card.
   f: where the log card's photo looks [x, y, z, width, on the floor]. */
var LIT = ["corridor", "stairs", "staff", "lib", "boiler"];
var WALLED = LIT;
var ODD = [
  /* anywhere */
  { id: "figure",  pl: "*",   t: 3, name: "Someone at the end", say: "Someone was standing at the far end.", note: "Did not blink. Did not move. Did not sign in.", f: [0.32, 0.9, 5.35, 230, 1] },
  { id: "steps",   pl: "*",   t: 2, name: "Wet footprints", say: "There were wet footprints on the floor.", note: "Bare feet. Going your way. Hmm.", f: [0, 0, 2.3, 420, 1] },
  { id: "bonnie",  pl: "*",   t: 1, name: "A small dog", say: "Bonnie was there. She is not on the night shift.", note: "Toy poodle. No tail. Very much not allowed.", f: [-0.32, 0.25, 2.6, 260, 1] },
  { id: "bird",    pl: "lit", t: 2, name: "A bird on the light", say: "There was a bird on the light. Jay would have liked that one.", note: "Got in somehow. Looks smug about it.", f: [0.18, 2.0, 2.25, 220] },
  { id: "light",   pl: "lit", t: 1, name: "A light out", say: "One of the lights was out.", note: "Maintenance have been told. In 2019.", f: [0, 2.2, 2.45, 520] },
  { id: "lightcol",pl: "lit", t: 2, name: "A cold light", say: "One light was a colder colour than the rest.", note: "Someone changed the bulb. Nobody changes the bulb.", f: [0, 2.2, 3.65, 380] },
  { id: "paper",   pl: WALLED, t: 1, name: "Red walls", say: "The walls had gone a deep red.", note: "Not the original colour scheme.", f: [-0.6, 1.4, 1.6, 600] },
  { id: "wet",     pl: "*",   t: 2, name: "Dry floor sign", say: "The sign said DRY FLOOR.", note: "Technically helpful. Deeply suspicious.", f: [0.56, 0.35, 2.25, 200, 1] },
  { id: "wet2",    pl: "*",   t: 1, name: "A second sign", say: "There were two wet floor signs.", note: "One floor. Two warnings. Very wet, or very lonely.", f: [-0.05, 0.35, 2.8, 460, 1] },
  { id: "exit",    pl: "*",   t: 2, name: "TIXE", say: "The exit sign was spelled backwards.", note: "Still glows. Still lies.", f: [0, 1.85, 4.3, 170] },
  { id: "exitarrow", pl: "*", t: 3, name: "The other arrow", say: "The arrow on the exit sign pointed the other way.", note: "The way out is that way. Or is it.", f: [0, 1.85, 4.3, 170] },
  { id: "plaque",  pl: "*",   t: 2, name: "A floor too far", say: "The floor sign showed a different floor.", note: "Numbers are more of a suggestion here.", f: null },
  { id: "eyes",    pl: "*",   t: 3, name: "Eyes in the window", say: "There were two eyes in the window of the far door.", note: "Probably a reflection. Probably.", f: [-0.28, 1.4, 5.6, 150, 1] },
  { id: "farwin",  pl: "*",   t: 3, name: "Round windows", say: "The far door windows were round, not square.", note: "Someone redecorated. Very quietly.", f: [0, 1.3, 5.6, 200, 1] },
  { id: "balloon", pl: "*",   t: 1, name: "A balloon", say: "A balloon was floating there.", note: "Nobody had a party. Nobody admits it.", f: [0.25, 1.3, 2.8, 230] },
  { id: "chair",   pl: "*",   t: 1, name: "A chair, facing away", say: "A chair was in the middle, facing away from you.", note: "It is listening. Chairs do that.", f: [0.05, 0.45, 3.0, 220, 1] },
  { id: "shoes",   pl: "*",   t: 2, name: "Neat shoes", say: "Someone had left their shoes. Neatly.", note: "Laces tucked in. Very considerate ghost.", f: [0.1, 0.1, 1.45, 230, 1] },
  { id: "fog",     pl: "*",   t: 2, name: "Low mist", say: "There was mist along the floor.", note: "The heating is fine. The mist is not.", f: [0, 0.2, 2.2, 560, 1] },
  { id: "ball",    pl: "*",   t: 1, name: "A ball", say: "A ball was sitting on the floor.", note: "It rolled here. Uphill, apparently.", f: [-0.2, 0.15, 1.9, 220, 1] },
  { id: "mirror",  pl: "*",   t: 3, name: "Back to front", say: "Everything was mirrored, left for right.", note: "You went through the looking glass. Mind the step.", f: [0, 1.2, 2.5, 800] },
  { id: "shadow",  pl: WALLED, t: 3, name: "A shadow", say: "A shadow was on the wall, with nobody to make it.", note: "Shadows need a someone. This one did not.", f: null },
  { id: "tile",    pl: ["corridor", "staff"], t: 2, name: "A missing tile", say: "One ceiling tile was missing.", note: "The dark up there goes back further than it should.", f: [0.25, 2.3, 2.4, 300] },
  /* the corridor (and the staff room has a clock too) */
  { id: "clock",   pl: ["corridor", "staff"], t: 2, name: "Thirteen o'clock", say: "The clock had thirteen on it.", note: "Lunch is at 13. Every day.", f: null },
  { id: "clockback", pl: ["corridor", "staff"], t: 3, name: "A backwards clock", say: "The clock numbers went backwards round the face.", note: "Time is going backwards. Good news for homework.", f: null },
  { id: "clocknone", pl: ["corridor", "staff"], t: 2, name: "No hands", say: "The clock had no hands.", note: "It is no time at all. Restful.", f: null },
  { id: "door",    pl: ["corridor"], t: 2, name: "B12, open", say: "Door B12 was open a crack, with the light on.", note: "B12 is never open. B12 is a cupboard.", f: [-1, 1.0, 1.97, 260] },
  { id: "ext",     pl: ["corridor"], t: 2, name: "No extinguisher", say: "The fire extinguisher had gone.", note: "Someone needed it more. Worrying.", f: [-1, 0.9, 3.3, 200] },
  { id: "poster",  pl: ["corridor"], t: 1, name: "Upside down poster", say: "The poster was upside down.", note: "Still says SMILE. Harder now.", f: [-1, 1.4, 2.78, 180] },
  { id: "eyesposter", pl: ["corridor"], t: 3, name: "The poster looked", say: "The face on the poster was looking at you.", note: "It was smiling before. It is watching now.", f: [-1, 1.4, 2.78, 180] },
  { id: "notice",  pl: ["corridor"], t: 1, name: "TURN BACK", say: "The notice said TURN BACK.", note: "Fair. Clear. Very helpful notice.", f: [1, 1.42, 2.6, 200] },
  { id: "extra",   pl: ["corridor"], t: 1, name: "An extra door", say: "There was an extra door on the right.", note: "Where does it go. Do not find out.", f: [1, 1.0, 3.3, 260] },
  { id: "doornum", pl: ["corridor"], t: 3, name: "B41", say: "Door B14 said B41.", note: "Same door. Different opinions.", f: [-1, 2.0, 4.15, 170] },
  /* the stairwell */
  { id: "rail",    pl: ["stairs"], t: 2, name: "No handrail", say: "The handrail had gone.", note: "Please hold the handrail. What handrail.", f: [0.9, 1.3, 3.9, 420] },
  { id: "step",    pl: ["stairs"], t: 2, name: "A missing step", say: "One of the steps was missing.", note: "Mind the gap. Really mind it.", f: [0, 0.5, 4.0, 380, 1] },
  { id: "moon2",   pl: ["stairs"], t: 3, name: "Two moons", say: "There were two moons in the window.", note: "One of them is new. Neither will say which.", f: [-1, 1.5, 2.35, 230] },
  { id: "updown",  pl: ["stairs"], t: 1, name: "UP is DOWN", say: "The sign said DOWN, but the stairs go up.", note: "Confident sign. Confidently mistaken.", f: [1, 1.5, 2.5, 180] },
  { id: "stairdoor", pl: ["stairs"], t: 2, name: "The landing door", say: "The landing door was open a crack.", note: "Fire door. Should be shut. Is not.", f: [1, 1.0, 1.62, 300] },
  { id: "shoe",    pl: ["stairs"], t: 2, name: "One shoe", say: "A single shoe was on the stairs.", note: "Where is the other one. Where is the foot.", f: [-0.3, 0.6, 3.75, 200, 1] },
  /* the staff room */
  { id: "kettle",  pl: ["staff"], t: 2, name: "A hot kettle", say: "The kettle was steaming.", note: "Someone is making tea. There is nobody here.", f: [-0.8, 1.05, 1.55, 200] },
  { id: "fridge",  pl: ["staff"], t: 1, name: "Fridge, open", say: "The fridge was open, with its light on.", note: "Somebody wanted a yoghurt. Badly.", f: [-0.8, 1.0, 2.75, 300] },
  { id: "sofa",    pl: ["staff"], t: 2, name: "A lump on the sofa", say: "There was a lump under a blanket on the sofa.", note: "Probably cushions. Breathing cushions.", f: [0.8, 0.5, 2.0, 300] },
  { id: "rota",    pl: ["staff"], t: 1, name: "The rota", say: "The rota said YOU, YOU, YOU.", note: "Every shift. Forever. Unpaid.", f: [1, 1.45, 3.0, 220] },
  { id: "mugflip", pl: ["staff"], t: 3, name: "One mug upside down", say: "One of the mugs was upside down.", note: "The mug has given up. Relatable.", f: [-0.75, 1.0, 2.1, 200] },
  { id: "plant",   pl: ["staff"], t: 1, name: "The plant grew", say: "The plant had grown. A lot.", note: "Someone watered it. Someone overdid it.", f: [0.75, 1.0, 4.6, 260, 1] },
  /* the library */
  { id: "book",    pl: ["lib"], t: 2, name: "A book pulled out", say: "One book was pulled out from the shelf.", note: "Someone was reading it. Someone still is.", f: [-0.7, 1.1, 2.2, 220] },
  { id: "gap",     pl: ["lib"], t: 2, name: "A gap", say: "There was a gap in the books.", note: "Overdue. By a long way.", f: [0.72, 1.0, 2.1, 300] },
  { id: "floatbook", pl: ["lib"], t: 1, name: "A floating book", say: "A book was floating in the air.", note: "Reading in the air. Very advanced.", f: [-0.1, 1.5, 2.6, 240] },
  { id: "silence", pl: ["lib"], t: 2, name: "WHISPER", say: "The sign said WHISPER, not SILENCE.", note: "Who is whispering. To whom.", f: [0, 2.1, 5.6, 200, 1] },
  { id: "globemoon", pl: ["lib"], t: 2, name: "The globe", say: "The globe had turned into the moon.", note: "Geography has changed. Ask no questions.", f: [0.6, 1.0, 3.6, 200, 1] },
  { id: "bookeyes", pl: ["lib"], t: 3, name: "Eyes in the shelf", say: "There were eyes between the books.", note: "A very quiet reader.", f: [-0.72, 1.4, 2.45, 260] },
  /* the boiler room */
  { id: "gauge",   pl: ["boiler"], t: 2, name: "The gauge", say: "The boiler gauge was right round the other side.", note: "Pressure is up. So are eyebrows.", f: [-0.55, 1.15, 1.9, 220] },
  { id: "valve",   pl: ["boiler"], t: 2, name: "No valve wheel", say: "The valve wheel was missing.", note: "Someone took it. Nobody knows how to turn it off now.", f: [1, 1.3, 2.4, 220] },
  { id: "drip",    pl: ["boiler"], t: 2, name: "A drip", say: "A pipe was dripping into a puddle.", note: "Drip. Drip. Drip. You are welcome.", f: [-0.35, 1.0, 3.2, 300] },
  { id: "boilerglow", pl: ["boiler"], t: 1, name: "The boiler door", say: "The little boiler door was glowing.", note: "Toasty. Too toasty.", f: [-0.55, 0.6, 2.45, 240] },
  { id: "teddy",   pl: ["boiler"], t: 3, name: "A teddy on a pipe", say: "A teddy was sitting on a pipe.", note: "It has been there since 1987. Apparently.", f: [0.5, 2.0, 3.0, 200] },
  { id: "steam",   pl: ["boiler"], t: 1, name: "Steam from the grate", say: "Steam was rising from the floor grate.", note: "The floor is breathing out. Breathe in.", f: [0, 0.6, 3.5, 300, 1] },
  /* the roof */
  { id: "aerial",  pl: ["roof"], t: 2, name: "A bent aerial", say: "The aerial was bent over.", note: "No signal. No signal at all.", f: [-0.9, 1.6, 2.2, 240] },
  { id: "city",    pl: ["roof"], t: 2, name: "The city went dark", say: "Every light in the city was off.", note: "Everyone went to bed at once. Rude.", f: [0, 1.8, 9, 800] },
  { id: "ladder",  pl: ["roof"], t: 2, name: "No ladder", say: "The ladder on the water tank had gone.", note: "How did the pigeons get up. They can fly. Fine.", f: [0.75, 1.0, 3.6, 260] },
  { id: "kite",    pl: ["roof"], t: 1, name: "A kite", say: "A kite was stuck on the aerial.", note: "Windy night. Lucky kite.", f: [-0.9, 1.9, 2.2, 260] },
  { id: "deckchair", pl: ["roof"], t: 1, name: "A deckchair", say: "There was a deckchair out.", note: "Someone was sunbathing. At midnight.", f: [-0.3, 0.4, 3.2, 260, 1] },
  { id: "pigeons", pl: ["roof"], t: 3, name: "One more pigeon", say: "There were four pigeons on the wall, not three.", note: "Counting pigeons is a job now.", f: [-0.95, 0.9, 3.2, 240] }
];
var ODDBY = {};
ODD.forEach(function(x){ ODDBY[x.id] = x; });
function oddIn(x, place){ var p = x.pl; return p === "*" || (p === "lit" ? LIT.indexOf(place) >= 0 : p.indexOf(place) >= 0); }

/* ---------- the secrets (never scored) ---------- */
var SECRETS = [
  { id: "trot",  name: "Bonnie on patrol", line: "She trotted across the far end. Off duty, apparently." },
  { id: "birdy", name: "A friend for Jay", line: "You tapped the bird. It tweeted. Jay would be thrilled." },
  { id: "note",  name: "A note from Jay", line: "Behind the fire drill notice: a note in Jay's handwriting." },
  { id: "mug",   name: "Jay's mug", line: "Jay's bird mug, in the Staff Room. Still warm. Outrageous." },
  { id: "uv",    name: "Invisible ink", line: "The UV torch found a message on Floor 7." },
  { id: "grave", name: "Graveyard regular", line: "You clocked off on the Graveyard shift. Jay had words." }
];
var SAYINGS = ["My ears are not a toilet.", "Unhand me, goblin.", "When I was in China....", "Outrageous.", "In the wise words of my late, great grandfather, stop."];

/* ---------- ranks on the ID badge ---------- */
var RANKS = [[0, "Trainee"], [1, "Night Porter"], [3, "Corridor Keeper"], [6, "Loop Walker"], [10, "Anomaly Hunter"], [16, "Keeper of Keys"], [25, "Head of Nights"]];
function rank(n){ var r = RANKS[0]; for(var i = 0; i < RANKS.length; i++) if(n >= RANKS[i][0]) r = RANKS[i]; return r[1]; }
function nextRank(n){ for(var i = 0; i < RANKS.length; i++) if(n < RANKS[i][0]) return RANKS[i]; return null; }

/* where things sit in each place: the floor sign, clock and shadow
   (also used to frame their log cards), and spots on the walls
   that are free for the weekly era's decorations */
var LAY = {
  corridor: { plaque: [-1, 1.6, 1.36], clock: [1, 1.86, 1.5], shadow: [1, 1.1, 3.35], deco: [[-1, 3.3, 1.62], [1, 2.6, 2.02, 0.55], [1, 5.1, 1.5]] },
  stairs:   { plaque: [-1, 1.6, 1.15], shadow: [-1, 1.2, 3.4], deco: [[-1, 3.4, 1.85], [1, 3.6, 1.8], [-1, 5.0, 1.85]] },
  staff:    { plaque: [-1, 1.6, 3.55], clock: [1, 1.7, 2.0], shadow: [1, 1.1, 3.85], deco: [[-1, 1.7, 1.75], [1, 4.6, 1.75], [-1, 4.9, 1.6]] },
  lib:      { plaque: [0, 1.0, 5.6], deco: [[-1, 1.6, 1.6], [1, 2.2, 1.6], [-1, 4.0, 1.6]] },
  boiler:   { plaque: [1, 1.6, 1.4], shadow: [1, 1.1, 3.7], deco: [[-1, 3.2, 1.6], [1, 2.0, 1.75], [-1, 4.8, 1.6]] },
  roof:     { plaque: [0, 1.6, 5.6], deco: [[-1, 1.7, 0], [1, 2.0, 0], [-1, 4.5, 0]] }
};
function onPlane(s, zc, yc, svg){
  /* like onWall, but for any upright plane x = s facing the middle (the side of a box) */
  var c = Math.abs(s), sg = s < 0 ? -1 : 1, a = F * c / (zc * zc) * 0.01, b = F * (yc - EYE) / (zc * zc) * -sg * 0.01, d = F / zc * 0.01, p = P(s, yc, zc);
  return '<g transform="matrix(' + [a, b, 0, d, p[0], p[1]].map(function(v){ return +v.toFixed(4); }).join(" ") + ')">' + svg + '</g>';
}
function tapG(id, svg){ return '<g data-tap="' + id + '" class="lcc-tap">' + svg + '</g>'; }

/* ---------- each place's own furniture ---------- */
var FURN = {};
FURN.corridor = function(){
  var s = "", o = CUR.o, hi = CUR.hi;
  s += plaqueOn(-1, 1.36, 1.6);
  s += hi("door", door(-1, 1.62, 2.32, o("door"), "B12"));
  var face = o("eyesposter") ?
    '<circle cx="0" cy="-12" r="11" fill="#e0b84a"/><path d="M-6 -7h12" stroke="#3b3a30" stroke-width="2.2"/><circle cx="-4" cy="-15" r="3" fill="#fff"/><circle cx="4" cy="-15" r="3" fill="#fff"/><circle cx="-3" cy="-14" r="1.6" fill="#111"/><circle cx="5" cy="-14" r="1.6" fill="#111"/>' :
    '<circle cx="0" cy="-12" r="11" fill="#e0b84a"/><path d="M-6 -10q6 6 12 0" stroke="#3b3a30" stroke-width="2.2" fill="none"/><circle cx="-4" cy="-15" r="1.8" fill="#3b3a30"/><circle cx="4" cy="-15" r="1.8" fill="#3b3a30"/>';
  var poster = onWall(-1, 2.78, 1.38,
    '<rect x="-24" y="-32" width="48" height="64" fill="#efe6c8" stroke="#3b3a30" stroke-width="2.5"/>' +
    '<g' + (o("poster") ? ' transform="rotate(180)"' : '') + '>' + face + txt(0, 14, 10, "#3b3a30", "SMILE") + txt(0, 25, 6.5, "#3b3a30", "IT IS LATE") + '</g>');
  s += o("poster") ? hi("poster", poster) : o("eyesposter") ? hi("eyesposter", poster) : poster;
  s += o("ext") ? hi("ext", onWall(-1, 3.3, 0.8, '<rect x="-9" y="-4" width="18" height="5" fill="#2a2920"/><rect x="-9" y="1" width="18" height="40" fill="#000" opacity=".12"/>')) :
    onWall(-1, 3.3, 0.8, '<rect x="-9" y="-4" width="18" height="5" fill="#2a2920"/>' +
      '<rect x="-8" y="6" width="16" height="44" rx="6" fill="#b8322a"/><rect x="-4" y="-4" width="8" height="12" fill="#2a2920"/>' +
      '<path d="M4 2h9v10" stroke="#2a2920" stroke-width="2.5" fill="none"/><rect x="-6" y="20" width="12" height="9" fill="#f3f0e2"/><rect x="-6" y="8" width="3" height="40" fill="#fff" opacity=".22"/>');
  var b14 = door(-1, 3.85, 4.45, false, o("doornum") ? "B41" : "B14");
  s += o("doornum") ? hi("doornum", b14) : b14;
  s += clockOn(1, 1.5, 1.86);
  var nt = o("notice");
  s += hi("notice", tapG("note", onWall(1, 2.6, 1.42,
    '<rect x="-36" y="-26" width="72" height="52" fill="#8a6a3e" stroke="#4a3820" stroke-width="3"/>' +
    '<rect x="-28" y="-18" width="34" height="24" fill="#fffbe8"/><rect x="10" y="-14" width="18" height="30" fill="#ffe08a"/><rect x="-24" y="10" width="26" height="10" fill="#cfe6f2"/>' +
    txt(-11, -8, nt ? 8.5 : 7, nt ? "#8a2c26" : "#3b3a30", nt ? "TURN" : "FIRE") +
    txt(-11, 2, nt ? 8.5 : 7, nt ? "#8a2c26" : "#3b3a30", nt ? "BACK" : "DRILL"))));
  if(o("extra")) s += hi("extra", door(1, 3.05, 3.55, false, ""));
  s += door(1, 3.95, 4.55, false, "B15");
  return s;
};
FURN.stairs = function(){
  var s = "", o = CUR.o, hi = CUR.hi, k;
  s += plaqueOn(-1, 1.15, 1.6);
  /* a tall window with the night outside */
  var win = onWall(-1, 2.35, 1.45, '<rect x="-34" y="-50" width="68" height="100" fill="#0e1830" stroke="#d8d6c8" stroke-width="5"/>' +
    '<rect x="-2" y="-50" width="4" height="100" fill="#d8d6c8"/><rect x="-34" y="-2" width="68" height="4" fill="#d8d6c8"/>' +
    moon(-16, -30, 8) + (o("moon2") ? moon(16, -22, 6) : '') + '<circle cx="18" cy="20" r="1" fill="#fff"/><circle cx="-20" cy="30" r="1" fill="#fff"/>');
  s += o("moon2") ? hi("moon2", win) : win;
  /* the landing fire door, and the sign */
  s += hi("stairdoor", door(1, 1.25, 2.0, o("stairdoor"), "", { leaf: "#3e6a4e", panel: "#355c43", glass: true }));
  s += hi("updown", onWall(1, 2.5, 1.5, '<rect x="-20" y="-14" width="40" height="28" rx="3" fill="#1f2a22" stroke="#cfc9a6" stroke-width="2"/>' +
    txt(-6, 5, 10, "#fbf8e4", o("updown") ? "DOWN" : "UP") + '<path d="M' + (o("updown") ? "12 -4v10m-4 -4l4 4l4 -4" : "12 6v-10m-4 4l4 -4l4 4") + '" stroke="#5dff9b" stroke-width="2" fill="none"/>'));
  /* the handrail follows the steps up the right wall */
  if(!o("rail")){
    var r = "", z, ra = STEP0 - 0.3, rb = STEP0 + STEPN * STEPD;
    r += '<path d="M' + pt(P(0.94, 0.9, ra)) + 'L' + pt(P(0.94, 0.9, STEP0)) + 'L' + pt(P(0.94, STEPN * STEPH + 0.9, rb)) + 'L' + pt(P(0.94, STEPN * STEPH + 0.9, FZ)) + '" stroke="' + shade("#c9b23a", lit(3.5)) + '" stroke-width="5" stroke-linejoin="round" fill="none"/>';
    for(z = STEP0 + 0.15; z < rb; z += 0.6) r += '<path d="M' + pt(P(0.97, 0.9 + (z - STEP0) / (rb - STEP0) * STEPN * STEPH, z)) + 'L' + pt(P(0.97, stairY(z), z)) + '" stroke="#55534a" stroke-width="1.5"/>';
    s += r;
  } else s += hi("rail", onWall(1, 3.9, 1.3, '<circle r="2" fill="#55534a"/><circle cx="40" r="2" fill="#55534a"/>'));
  if(o("shoe")) s += hi("shoe", standUp(-0.3, stairY(3.75), 3.75, '<path d="M-14 0v-8q0 -6 6 -6h4q4 0 6 4l10 4q4 2 4 6z" fill="#1d1d24"/><path d="M-10 -8h10" stroke="#fff" stroke-width="1.5"/>'));
  return s;
};
FURN.staff = function(){
  var s = "", o = CUR.o, hi = CUR.hi, k = lit(1.7);
  /* the kitchen counter and the fridge */
  s += boxOnWall(-1, 1.15, 2.25, 0.25, 0.9, "#c9c2a8", k);
  s += poly([P(-0.75, 0.9, 1.15), P(-1, 0.9, 1.15), P(-1, 0.94, 1.15), P(-0.75, 0.94, 1.15)], "#6a5a46");
  var kt = standUp(-0.85, 0.9, 1.55, '<path d="M-12 0v-16q0 -6 6 -6h12q6 0 6 6v16z" fill="#d9d9d4" stroke="#44443c" stroke-width="2"/><path d="M12 -14q8 2 4 10" stroke="#44443c" stroke-width="2.5" fill="none"/><rect x="-6" y="-26" width="12" height="4" fill="#44443c"/>' +
    (o("kettle") ? '<g class="lcc-steam"><path d="M-2 -30q-6 -8 0 -14q6 -6 0 -14" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/><path d="M6 -30q-5 -7 0 -12" stroke="#fff" stroke-width="2.5" fill="none" opacity=".5"/></g>' : ''));
  s += o("kettle") ? hi("kettle", kt) : kt;
  /* the mugs on the counter, and Jay's bird mug (tap it) */
  var mugs = "";
  [1.92, 2.02, 2.12].forEach(function(z, n){
    var flip = o("mugflip") && n === 1;
    mugs += standUp(-0.82, 0.9, z, flip ? '<path d="M-6 0v-12h12v12z" fill="' + ["#7aa6c2", "#e0b84a", "#9cc28a"][n] + '"/><rect x="-7" y="-14" width="14" height="3" fill="#44443c"/>' :
      '<rect x="-6" y="-12" width="12" height="12" rx="1.5" fill="' + ["#7aa6c2", "#e0b84a", "#9cc28a"][n] + '"/><path d="M6 -9q5 0 5 4t-5 4" stroke="' + ["#7aa6c2", "#e0b84a", "#9cc28a"][n] + '" stroke-width="2" fill="none"/>');
  });
  s += o("mugflip") ? hi("mugflip", mugs) : mugs;
  s += tapG("mug", standUp(-0.84, 0.9, 1.78, '<rect x="-7" y="-14" width="14" height="14" rx="2" fill="#f4efe0" stroke="#44443c" stroke-width="1"/><path d="M7 -10q6 0 6 4t-6 4" stroke="#f4efe0" stroke-width="2.4" fill="none"/>' +
    '<ellipse cx="0" cy="-7" rx="3.5" ry="2.6" fill="#3a8fd6"/><circle cx="2.6" cy="-9" r="2" fill="#3a8fd6"/><path d="M4.4 -9.4l2 .8-2 .8z" fill="#f2a516"/>'));
  var fk = lit(2.75), fo = o("fridge");
  s += boxOnWall(-1, 2.5, 3.0, 0.32, 1.7, "#e4e2da", fk);
  if(fo){
    s += hi("fridge", poly([P(-0.68, 0.05, 2.5), P(-0.68, 1.65, 2.5), P(-0.68, 1.65, 3.0), P(-0.68, 0.05, 3.0)], "#fff7d0") +
      poly([P(-0.68, 0.05, 2.5), P(-0.68, 1.65, 2.5), P(-0.25, 1.65, 2.45), P(-0.25, 0.05, 2.45)], shade("#d4d2ca", fk)) +
      poly([P(-0.68, 0, 2.6), P(-0.2, 0, 2.6), P(0.1, 0, 3.4), P(-0.68, 0, 3.2)], "#fff7d0", ' opacity=".22"'));
  } else s += '<path d="M' + pt(P(-0.68, 1.15, 2.52)) + 'L' + pt(P(-0.68, 1.15, 2.98)) + '" stroke="#88867c" stroke-width="1.5"/><path d="M' + pt(P(-0.68, 1.3, 2.92)) + 'L' + pt(P(-0.68, 0.8, 2.92)) + '" stroke="#88867c" stroke-width="2.5"/>';
  s += plaqueOn(-1, 3.55, 1.6);
  s += door(-1, 3.95, 4.55, false, "STAFF");
  /* right: the sofa, clock, rota, plant */
  var sk = lit(2.1);
  s += boxOnWall(1, 1.5, 2.7, 0.42, 0.45, "#7a5a8a", sk);
  s += boxOnWall(1, 1.5, 2.7, 0.14, 0.85, "#6a4c7a", sk);
  if(o("sofa")) s += hi("sofa", standUp(0.74, 0.45, 2.0, '<path d="M-40 0q0 -26 20 -28q16 -14 34 -2q22 0 26 30z" fill="#9aa86a" stroke="#5a6638" stroke-width="2"/><path d="M-20 -20q10 6 22 0" stroke="#5a6638" stroke-width="1.5" fill="none"/>'));
  s += clockOn(1, 2.0, 1.7);
  var rota = onWall(1, 3.0, 1.45, '<rect x="-30" y="-34" width="60" height="68" fill="#fffbe8" stroke="#3b3a30" stroke-width="2"/>' + txt(0, -20, 10, "#3b3a30", "ROTA") +
    (o("rota") ? txt(0, -4, 11, "#3b3a30", "YOU") + txt(0, 10, 11, "#3b3a30", "YOU") + txt(0, 24, 11, "#3b3a30", "YOU") :
      '<path d="M-20 -6h40M-20 4h30M-20 14h36M-20 24h26" stroke="#8a8a80" stroke-width="3"/>'));
  s += o("rota") ? hi("rota", rota) : rota;
  var big = o("plant");
  var plant = standUp(0.78, 0, 4.6, '<path d="M-10 0l-3 -20h26l-3 20z" fill="#b5653a"/>' +
    (big ? '<path d="M0 -20q-30 -60 -10 -150M0 -20q30 -50 20 -140M0 -20q-6 -80 4 -170" stroke="#3d6e3a" stroke-width="5" fill="none"/><circle cx="-10" cy="-150" r="14" fill="#4f8a4a"/><circle cx="20" cy="-140" r="16" fill="#4f8a4a"/><circle cx="4" cy="-170" r="12" fill="#5a9a52"/><circle cx="-14" cy="-90" r="12" fill="#4f8a4a"/><circle cx="16" cy="-80" r="12" fill="#5a9a52"/>' :
      '<circle cx="-6" cy="-28" r="9" fill="#4f8a4a"/><circle cx="6" cy="-32" r="9" fill="#5a9a52"/><circle cx="0" cy="-40" r="8" fill="#4f8a4a"/>'));
  s += big ? hi("plant", plant) : plant;
  return s;
};
var BOOKC = ["#7a2e2a", "#2e4a6a", "#5a6a2e", "#8a6a2e", "#4a2e5a", "#2e6a5a", "#6a4a3a"];
FURN.lib = function(){
  var s = "", o = CUR.o, hi = CUR.hi;
  [-1, 1].forEach(function(sd){
    var xi = sd * 0.72, z, r, n = 0;
    for(z = NZ; z < 5.3; z += 0.35){
      var z2 = Math.min(5.3, z + 0.35), k = lit(z + 0.17) * (sd < 0 ? 0.9 : 1);
      for(r = 0; r < 5; r++){
        var y0 = 0.15 + r * 0.38, y1 = y0 + 0.3;
        var gap = (o("gap") && sd > 0 && r === 2 && n === 4) || (o("bookeyes") && sd < 0 && r === 3 && n === 5);
        var back = poly([P(xi, y0, z), P(xi, y1, z), P(xi, y1, z2), P(xi, y0, z2)], gap ? "#050403" : shade("#1a120a", k));
        if(gap && r === 3){
          var zm = (z + z2) / 2, ym = (y0 + y1) / 2;
          back += onPlane(xi, zm, ym, '<ellipse cx="-7" cy="0" rx="5" ry="3.2" fill="#f4f0b0"/><ellipse cx="7" cy="0" rx="5" ry="3.2" fill="#f4f0b0"/><circle cx="-6" cy="0" r="2" fill="#111"/><circle cx="8" cy="0" r="2" fill="#111"/>');
          back = hi("bookeyes", '<g class="lcc-blink">' + back + '</g>');
        } else if(gap) back = hi("gap", back);
        s += back;
        if(!gap){
          var nb = CUR.lite ? 2 : 4, bw = (z2 - z) / nb;
          for(var bi = 0; bi < nb; bi++){
            var hgt = y0 + 0.3 * (0.72 + 0.28 * hh(n * 31 + r * 7 + bi + (sd > 0 ? 500 : 0)));
            s += poly([P(xi, y0, z + bi * bw), P(xi, hgt, z + bi * bw), P(xi, hgt, z + (bi + 0.86) * bw), P(xi, y0, z + (bi + 0.86) * bw)], shade(BOOKC[(n * 5 + r * 3 + bi) % BOOKC.length], k));
          }
        }
        s += poly([P(xi, y1, z), P(xi, y1 + 0.08, z), P(xi, y1 + 0.08, z2), P(xi, y1, z2)], shade("#4a3220", k));
      }
      n++;
    }
    s += poly([P(xi, 2.05, NZ), P(xi, 2.15, NZ), P(xi, 2.15, 5.3), P(xi, 2.05, 5.3)], shade("#3a2818", lit(2)));
    s += poly([P(xi, 0, 5.3), P(xi, 2.15, 5.3), P(sd, 2.15, 5.3), P(sd, 0, 5.3)], shade("#4a3220", lit(5.3)));
  });
  if(o("book")){
    var bz = 2.15, bk = "";
    bk += poly([P(-0.72, 1.06, bz), P(-0.72, 1.33, bz), P(-0.52, 1.33, bz), P(-0.52, 1.06, bz)], "#c9a23a");
    bk += poly([P(-0.52, 1.06, bz), P(-0.52, 1.33, bz), P(-0.52, 1.33, bz + 0.07), P(-0.52, 1.06, bz + 0.07)], "#8a6a2e");
    s += hi("book", bk);
  }
  if(o("floatbook")) s += hi("floatbook", '<g class="lcc-bob">' + standUp(-0.1, 1.45, 2.6, '<path d="M-22 -4l22 -6l22 6v4l-22 -6l-22 6z" fill="#efe6c8" stroke="#3b3a30" stroke-width="1.5"/><path d="M-22 0l22 -6l22 6v4l-22 -6l-22 6z" fill="#7a2e2a"/>') + '</g>');
  /* the globe on its stand */
  var gl = o("globemoon");
  var globe = standUp(0.5, 0, 3.6, '<path d="M-14 0h28l-8 -6h-12z" fill="#4a3220"/><rect x="-2" y="-60" width="4" height="56" fill="#4a3220"/>' +
    '<circle cx="0" cy="-76" r="20" fill="' + (gl ? "#d9d4b4" : "#3a6a9a") + '"/>' +
    (gl ? '<circle cx="-6" cy="-80" r="4" fill="#bdb79a"/><circle cx="7" cy="-70" r="3" fill="#bdb79a"/><circle cx="4" cy="-86" r="2" fill="#bdb79a"/>' : '<path d="M-12 -84q8 -4 10 4t8 8q-6 6 -12 0z" fill="#5a8a4a"/><path d="M6 -90q8 2 8 10q-6 0 -8 -10z" fill="#5a8a4a"/>') +
    '<path d="M-24 -76a24 24 0 0 0 48 0" stroke="#8a6a2e" stroke-width="2.5" fill="none"/>');
  s += gl ? hi("globemoon", globe) : globe;
  return s;
};
FURN.boiler = function(){
  var s = "", o = CUR.o, hi = CUR.hi, k = lit(1.8);
  s += boxOnWall(-1, 1.6, 2.9, 0.45, 1.5, "#5a5f5a", k);
  s += poly([P(-0.62, 1.5, 1.75), P(-0.62, CEIL, 1.75), P(-0.74, CEIL, 1.75), P(-0.74, 1.5, 1.75)], shade("#444844", k));
  s += hi("gauge", onPlane(-0.55, 1.9, 1.15, '<circle r="15" fill="#f4efe0" stroke="#2a2920" stroke-width="2.5"/><path d="M-7 4a8 8 0 0 1 14 0" stroke="#7a9a5a" stroke-width="2" fill="none"/>' +
    '<line x1="0" y1="0" x2="' + (o("gauge") ? "8" : "-6") + '" y2="' + (o("gauge") ? "5" : "-6") + '" stroke="#2a2920" stroke-width="2" stroke-linecap="round"/>'));
  var bg = o("boilerglow");
  var bdoor = onPlane(-0.55, 2.45, 0.6, '<rect x="-14" y="-12" width="28" height="24" rx="3" fill="' + (bg ? "#ffb04a" : "#2a2a26") + '" stroke="#1a1a16" stroke-width="2.5"/>' +
    '<path d="M-8 -4h16M-8 2h16M-8 8h16" stroke="' + (bg ? "#ffe08a" : "#3e3e38") + '" stroke-width="2"/>');
  s += bg ? hi("boilerglow", '<g class="lcc-glow">' + bdoor + '</g>') : bdoor;
  /* a drip from the pipe above */
  if(o("drip")){
    var dp = P(-0.35, CEIL - 0.08, 3.2), fp = P(-0.35, 0, 3.2);
    s += hi("drip", '<line x1="' + dp[0].toFixed(1) + '" y1="' + dp[1].toFixed(1) + '" x2="' + dp[0].toFixed(1) + '" y2="' + (dp[1] + 8).toFixed(1) + '" stroke="#9ad0e6" stroke-width="2"/>' +
      '<circle class="lcc-drip" cx="' + dp[0].toFixed(1) + '" cy="' + (dp[1] + 10).toFixed(1) + '" r="2" fill="#9ad0e6"/>' + ell(fp, F * 0.18 / 3.2, F * 0.05 / 3.2, "#2a3a44", ' opacity=".8"'));
  }
  /* right wall: plaque, valve, pipes, far door */
  s += plaqueOn(1, 1.4, 1.6);
  var vk = lit(2.4);
  s += '<path d="M' + pt(P(1, 0.3, 2.4)) + 'L' + pt(P(1, CEIL, 2.4)) + '" stroke="' + shade("#6b6a5e", vk) + '" stroke-width="' + (F * 0.08 / 2.4).toFixed(1) + '"/>';
  s += hi("valve", onWall(1, 2.4, 1.3, o("valve") ? '<rect x="-3" y="-3" width="6" height="6" fill="#55534a"/>' :
    '<circle r="14" fill="none" stroke="#a8323e" stroke-width="4"/><path d="M-14 0h28M0 -14v28" stroke="#a8323e" stroke-width="3"/><circle r="3" fill="#55534a"/>'));
  /* floor grate */
  var gr = "";
  gr += poly(floorQ(-0.25, 0.25, 3.3, 3.75), "#222320");
  for(var gx = -0.2; gx < 0.25; gx += 0.1) gr += '<path d="M' + pt(P(gx, 0, 3.3)) + 'L' + pt(P(gx, 0, 3.75)) + '" stroke="#3e3f3a" stroke-width="1.5"/>';
  s += gr;
  if(o("steam")) s += hi("steam", standUp(0, 0, 3.5, '<g class="lcc-steam"><path d="M-10 0q-12 -20 0 -40q12 -20 0 -40" stroke="#e8e8e0" stroke-width="10" fill="none" opacity=".35" stroke-linecap="round"/><path d="M12 0q10 -18 0 -36q-10 -18 0 -36" stroke="#e8e8e0" stroke-width="8" fill="none" opacity=".3" stroke-linecap="round"/></g>'));
  if(o("teddy")) s += hi("teddy", standUp(0.5, CEIL - 0.13, 3.0, '<circle cx="0" cy="-14" r="9" fill="#a8764a"/><circle cx="-7" cy="-21" r="3.5" fill="#a8764a"/><circle cx="7" cy="-21" r="3.5" fill="#a8764a"/><ellipse cx="0" cy="-2" rx="10" ry="9" fill="#a8764a"/><circle cx="-3" cy="-15" r="1.3" fill="#111"/><circle cx="3" cy="-15" r="1.3" fill="#111"/><ellipse cx="0" cy="-11" rx="3" ry="2" fill="#d9b48a"/>'));
  return s;
};
FURN.roof = function(){
  var s = "", o = CUR.o, hi = CUR.hi;
  s += moon(640, 70, 26);
  /* the aerial on the left */
  var bent = o("aerial"), base = P(-0.9, 0.85, 2.2), top = P(bent ? -0.55 : -0.9, 2.5, bent ? 2.3 : 2.2), mid = P(-0.9, 1.7, 2.2);
  var aer = '<path d="M' + pt(base) + 'L' + pt(bent ? mid : top) + (bent ? 'L' + pt(top) : '') + '" stroke="#8a8a90" stroke-width="3"/>';
  var bars = bent ? [[-0.7, 2.05], [-0.62, 2.3]] : [[-0.9, 2.0], [-0.9, 2.25]];
  bars.forEach(function(b){ aer += '<path d="M' + pt(P(b[0] - 0.18, b[1], 2.2)) + 'L' + pt(P(b[0] + 0.18, b[1], 2.2)) + '" stroke="#8a8a90" stroke-width="2"/>'; });
  if(o("kite")){
    var kp = P(-0.9, 2.3, 2.2);
    aer += hi("kite", '<g transform="translate(' + (kp[0] + 14).toFixed(0) + ' ' + (kp[1] - 18).toFixed(0) + ')"><path d="M0 -22l14 18l-14 26l-14 -26z" fill="#e05a2b" stroke="#2a2920" stroke-width="1.5"/><path d="M0 -22v44M-14 -4h28" stroke="#2a2920" stroke-width="1"/><path d="M0 22q-6 10 2 18q-8 8 -2 18" stroke="#e0b84a" stroke-width="2" fill="none"/></g>');
  }
  s += bent ? hi("aerial", aer) : aer;
  /* pigeons on the left wall */
  var pg = "", n = o("pigeons") ? 4 : 3;
  for(var i = 0; i < n; i++) pg += standUp(-0.95, 0.91, 3.0 + i * 0.22, '<ellipse cx="0" cy="-8" rx="10" ry="7" fill="#7a7f8a"/><circle cx="7" cy="-15" r="5" fill="#8a8f9a"/><path d="M11 -15l4 1-4 1z" fill="#d9a441"/><path d="M-10 -8l-6 3" stroke="#5a5f6a" stroke-width="3"/>');
  s += o("pigeons") ? hi("pigeons", pg) : pg;
  /* the water tank on the right, with its ladder */
  var tk = lit(3.6);
  s += boxOnWall(1, 3.1, 4.2, 0.5, 1.5, "#5a6a7a", tk);
  if(!o("ladder")){
    var ld = "";
    ld += '<path d="M' + pt(P(0.5, 0, 3.45)) + 'L' + pt(P(0.5, 1.6, 3.45)) + 'M' + pt(P(0.5, 0, 3.75)) + 'L' + pt(P(0.5, 1.6, 3.75)) + '" stroke="#c9c9c0" stroke-width="2.5"/>';
    for(var ly = 0.2; ly < 1.6; ly += 0.25) ld += '<path d="M' + pt(P(0.5, ly, 3.45)) + 'L' + pt(P(0.5, ly, 3.75)) + '" stroke="#c9c9c0" stroke-width="2"/>';
    s += ld;
  } else s += hi("ladder", onPlane(0.5, 3.6, 0.8, '<rect x="-2" y="-2" width="4" height="4" fill="none"/>'));
  if(o("deckchair")) s += hi("deckchair", standUp(-0.3, 0, 3.2, '<path d="M-24 0l30 -46M20 0l-26 -30M-26 -18h42" stroke="#8a6a3e" stroke-width="3.5" fill="none"/><path d="M-6 -30l12 -18l18 30l-14 12z" fill="#2d8fa8"/><path d="M0 -38l14 22" stroke="#fff" stroke-width="3"/>'));
  return s;
};

/* ---------- the weekly era, haunting the walls ---------- */
function decoArt(id, n){
  switch(id){
    case "stone": return n % 2 ?
      '<g fill="none" stroke="#a8502a" stroke-width="3" stroke-linecap="round" opacity=".85"><path d="M-22 4q10 -12 30 -8q8 -8 10 0q4 6 -4 8M-14 4v12M-4 6v10M8 6v10M16 4v12M18 -4l6 -8l2 4"/></g><path d="M-30 -18q2 -6 6 0q2 -8 5 0q3 -6 5 1q4 -4 4 2l-2 10h-14z" fill="#8a3a1a" opacity=".6"/>' :
      '<g fill="#8a3a1a" opacity=".7"><path d="M-14 10v-14q0 -4 3 -4t3 4v-8q0 -4 3 -4t3 4v8q0 -3 3 -3t3 3v12q0 6 -8 6t-10 -4z"/></g><path d="M8 -14q14 -4 18 8q-6 10 -18 6z" fill="none" stroke="#a8502a" stroke-width="3" opacity=".8"/><circle cx="20" cy="-6" r="1.5" fill="#a8502a"/>';
    case "egypt": return '<rect x="-30" y="-30" width="60" height="60" fill="#d9b25a" stroke="#6a4a1a" stroke-width="3" opacity=".92"/>' +
      '<path d="M-20 -14q6 -8 12 0q-6 6 -12 0z" fill="none" stroke="#2a4a8a" stroke-width="2.5"/><circle cx="-14" cy="-14" r="2" fill="#2a4a8a"/><path d="M-14 -8l-2 8M-10 -9l4 6" stroke="#2a4a8a" stroke-width="2"/>' +
      '<path d="M8 -20a5 5 0 1 1 0.1 0M8 -10v14M2 -8h12" stroke="#7a2a1a" stroke-width="2.5" fill="none"/>' +
      '<path d="M-20 14q4 -8 10 -4l4 -4l2 4q-4 8 -16 4z" fill="#3a6a4a"/><path d="M4 16h18M6 10h14M8 4h10" stroke="#6a4a1a" stroke-width="2"/>';
    case "rome": var m = "", i, j, c = ["#e8dcc0", "#b3263a", "#2a4a6a", "#d9a441"];
      for(i = 0; i < 6; i++) for(j = 0; j < 6; j++){ var d = Math.abs(i - 2.5) + Math.abs(j - 2.5); m += '<rect x="' + (-30 + i * 10) + '" y="' + (-30 + j * 10) + '" width="9" height="9" fill="' + c[d < 1.5 ? 1 : d < 2.5 ? 3 : d < 3.5 ? 2 : 0] + '"/>'; }
      return '<rect x="-32" y="-32" width="64" height="64" fill="#4a3a2a"/>' + m;
    case "viking": return '<circle r="28" fill="' + (n % 2 ? "#2a5a8a" : "#a8323e") + '" stroke="#4a3a2a" stroke-width="5"/><path d="M0 -28v56M-28 0h56" stroke="#e8dcc0" stroke-width="7"/><circle r="8" fill="#9a9a90" stroke="#4a4a40" stroke-width="2"/>';
    case "victorian": return '<ellipse rx="26" ry="32" fill="#c9a23a"/><ellipse rx="21" ry="27" fill="#3a3028"/>' +
      '<ellipse cx="0" cy="-2" rx="10" ry="12" fill="#e8c8a0"/><rect x="-10" y="-26" width="20" height="14" fill="#1a1612"/><rect x="-14" y="-13" width="28" height="3" fill="#1a1612"/>' +
      '<path d="M-10 4q5 -5 10 0q5 -5 10 0q-5 4 -10 1q-5 3 -10 -1z" fill="#3a2a1a"/><circle cx="-4" cy="-4" r="1.4" fill="#111"/><circle cx="4" cy="-4" r="1.4" fill="#111"/>' +
      (CUR.happy ? '<path d="M-4 8q4 4 8 0" stroke="#3a2a1a" stroke-width="1.5" fill="none"/>' : '') + '<path d="M-16 26q16 -16 32 0" fill="#1a1612"/>';
    case "eighties": return n % 2 ?
      '<rect x="-30" y="-20" width="60" height="40" rx="4" fill="#1a1030" stroke="#ff4fa3" stroke-width="3"/><rect x="-18" y="-12" width="36" height="14" rx="2" fill="none" stroke="#2de2e6" stroke-width="2.5"/><circle cx="-10" cy="-5" r="4" fill="none" stroke="#2de2e6" stroke-width="2"/><circle cx="10" cy="-5" r="4" fill="none" stroke="#2de2e6" stroke-width="2"/><path d="M-14 12h28" stroke="#ff4fa3" stroke-width="2"/>' :
      '<rect x="-34" y="-16" width="68" height="32" rx="6" fill="#1a1030" stroke="#2de2e6" stroke-width="3"/>' + txt(0, 6, 15, "#ff4fa3", "RAD", ' letter-spacing="2"');
    case "future": return '<rect x="-30" y="-24" width="60" height="48" rx="6" fill="#7cf5c9" opacity=".18" stroke="#7cf5c9" stroke-width="2"/>' +
      '<ellipse rx="16" ry="6" fill="none" stroke="#7cf5c9" stroke-width="2" class="lcc-holo"/><circle r="6" fill="#7cf5c9" opacity=".7"/><path d="M-22 16h44M-22 -16h20" stroke="#7cf5c9" stroke-width="2" opacity=".7"/>';
  }
  return "";
}
function eraFloor(id){
  var s = "", z, i;
  if(id === "egypt"){
    [-1, 1].forEach(function(sd){ s += poly([P(sd, 0, NZ), P(sd * 0.82, 0, NZ), P(sd * 0.9, 0, FZ), P(sd, 0, FZ)], "#d9b25a", ' opacity=".55"'); });
  } else if(id === "rome"){
    [-1, 1].forEach(function(sd){
      for(z = NZ, i = 0; z < FZ; z += 0.25, i++) s += poly(floorQ(sd < 0 ? -0.95 : 0.83, sd < 0 ? -0.83 : 0.95, z, Math.min(FZ, z + 0.25), floorY(z) + 0.002), i % 2 ? "#b3263a" : "#e8dcc0", ' opacity=".8"');
    });
  } else if(id === "eighties"){
    [-1, 1].forEach(function(sd){
      s += '<path d="M' + pt(P(sd, 0.12, NZ)) + 'L' + pt(P(sd, 0.12, FZ)) + '" stroke="#ff4fa3" stroke-width="4" opacity=".9" class="lcc-glow"/>';
      if(!CUR.place.open) s += '<path d="M' + pt(P(sd, CEIL - 0.04, NZ)) + 'L' + pt(P(sd, CEIL - 0.04, FZ)) + '" stroke="#2de2e6" stroke-width="3" opacity=".8" class="lcc-glow"/>';
    });
  } else if(id === "victorian" && !CUR.place.open){
    /* gas lamps along the walls */
    [[-1, 1.5], [1, 3.0], [-1, 4.4]].forEach(function(g){
      var c = P(g[0], 1.9, g[1]);
      s += ell(c, F * 0.35 / g[1], F * 0.3 / g[1], "#ffb050", ' opacity=".18"') + onWall(g[0], g[1], 1.8, '<path d="M0 10v-8M-6 -14h12l-3 12h-6z" stroke="#4a3a1a" stroke-width="2" fill="#ffd27a"/>');
    });
  } else if(id === "future"){
    /* tinsel along the dado rail, and a bauble or two */
    var cols = ["#7cf5c9", "#ff4fa3", "#ffd23f"];
    [-1, 1].forEach(function(sd, si){
      var y = CUR.place.open ? 0.88 : 0.97, d = "";
      for(z = NZ; z < FZ - 0.1; z += 0.12) d += (z === NZ ? "M" : "L") + pt(P(sd, y - (Math.round(z / 0.12) % 2 ? 0.03 : 0), z));
      s += '<path d="' + d + '" stroke="' + cols[si] + '" stroke-width="3" fill="none" opacity=".85"/>';
    });
  }
  return s;
}
function eraCritter(id){
  var f = CUR.floor;
  if(id === "stone"){
    var mx = 0.25, mz = 3.6;
    return '<g class="lcc-wander">' + standUp(mx, floorY(mz), mz, '<g><ellipse cx="0" cy="-26" rx="28" ry="20" fill="#7a5034"/><circle cx="-24" cy="-34" r="13" fill="#7a5034"/>' +
      '<path d="M-34 -30q-6 16 2 26" stroke="#7a5034" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-30 -24q-12 6 -6 14" stroke="#efe6c8" stroke-width="3" fill="none"/>' +
      '<rect x="-18" y="-12" width="8" height="12" fill="#6a4228"/><rect x="10" y="-12" width="8" height="12" fill="#6a4228"/><circle cx="-26" cy="-38" r="1.8" fill="#111"/><path d="M-10 -44q10 -6 22 -2" stroke="#5a3a20" stroke-width="3" fill="none"/></g>') + '</g>';
  }
  if(id === "egypt") return standUp(-0.55, floorY(2.5), 2.5, '<path d="M-10 0q-4 -20 4 -30l-2 -8l5 4l4 0l5 -4l-2 8q8 10 4 30z" fill="#2a2420"/><circle cx="-2" cy="-28" r="1.6" fill="#e6d84a"/><circle cx="4" cy="-28" r="1.6" fill="#e6d84a"/><path d="M10 0q12 -2 10 -14" stroke="#2a2420" stroke-width="3" fill="none"/><path d="M-6 -20h12" stroke="#d9a441" stroke-width="2"/>');
  if(id === "future") return '<g class="lcc-robo">' + standUp(-0.3, floorY(2.0), 2.0, '<ellipse cx="0" cy="-5" rx="22" ry="6" fill="#c9d4e0"/><rect x="-20" y="-8" width="40" height="5" fill="#9aa6b4"/><circle cx="0" cy="-10" r="3" fill="#7cf5c9"/><path d="M-6 -12l6 -10l6 10" fill="#ff4fa3"/>') + '</g>';
  return "";
}

/* ---------- the far end ---------- */
function farWall(){
  var s = "", o = CUR.o, hi = CUR.hi, pl = CUR.place, kf = lit(FZ) * 0.85, y0 = floorY(FZ - 0.01);
  if(pl.open){
    /* the roof: a stair hut at the far end */
    s += poly(faceQ(-0.55, 0.55, 0, 2.2, FZ), shade("#5a5856", 0.7));
    s += poly([P(-0.62, 2.2, FZ), P(0.62, 2.2, FZ), P(0.62, 2.32, FZ), P(-0.62, 2.32, FZ)], "#3a3836");
  } else {
    s += poly(faceQ(-1, 1, 0, CEIL, FZ), shade(o("paper") ? "#782420" : pl.paper[1], kf));
    s += poly(faceQ(-1, 1, 0, Math.min(0.92, y0 + 0.92), FZ), shade(o("paper") ? "#4e1a17" : pl.low, kf));
  }
  var dc = pl.id === "boiler" ? "#5a5f5a" : pl.id === "stairs" ? "#3e6a4e" : "#6a5233";
  s += poly(faceQ(-0.42, 0.42, y0, y0 + 1.95, FZ), shade("#2a241a", 1));
  s += poly(faceQ(-0.37, -0.01, y0, y0 + 1.89, FZ), shade(dc, kf));
  s += poly(faceQ(0.01, 0.37, y0, y0 + 1.89, FZ), shade(dc, kf));
  var win = "";
  if(o("farwin")){
    win += ell(P(-0.19, y0 + 1.38, FZ), F * 0.11 / FZ, F * 0.13 / FZ, "#1c2a2c") + ell(P(0.19, y0 + 1.38, FZ), F * 0.11 / FZ, F * 0.13 / FZ, "#1c2a2c");
    s += hi("farwin", win);
  } else {
    s += poly(faceQ(-0.3, -0.08, y0 + 1.15, y0 + 1.6, FZ), "#1c2a2c");
    s += poly(faceQ(0.08, 0.3, y0 + 1.15, y0 + 1.6, FZ), "#1c2a2c");
  }
  if(o("eyes")){
    var e1 = P(-0.22, y0 + 1.42, FZ), e2 = P(-0.15, y0 + 1.42, FZ);
    s += hi("eyes", '<g class="lcc-blink">' + ell(e1, 2.6, 1.8, "#f4f0b0") + ell(e2, 2.6, 1.8, "#f4f0b0") + ell(e1, 1, 1, "#111") + ell(e2, 1, 1, "#111") + '</g>');
  }
  s += poly(faceQ(-0.33, 0.33, y0 + 0.95, y0 + 1.0, FZ), "#b9b4a0");
  if(pl.id === "lib") s += hi("silence", standUp(0, y0 + 2.04, FZ, '<rect x="-30" y="-10" width="60" height="16" rx="2" fill="#efe6c8" stroke="#3b3a30" stroke-width="1.5"/>' + txt(0, 2.5, o("silence") ? 9 : 10, "#3b3a30", o("silence") ? "WHISPER" : "SILENCE")));
  if(pl.id === "lib") s += plaqueOn(0.72, FZ, 1.55);
  if(pl.open) s += plaqueOn(0.85, FZ, 1.55);
  return s;
}
/* plaques that live on the far wall */
var plaqueWall = plaqueOn;
plaqueOn = function(sd, z, y){
  if(sd === 1 || sd === -1) return plaqueWall(sd, z, y);
  var f = CUR.floor, shown = CUR.o("plaque") ? (f + 3) % 9 : f, lab = CUR.eraId === "rome" ? roman(shown) : String(shown);
  return CUR.hi("plaque", standUp(sd, y, z, '<rect x="-24" y="-15" width="48" height="30" rx="3" fill="#1f2a22" stroke="#cfc9a6" stroke-width="2.5"/>' + txt(0, -4, 7.5, "#cfc9a6", "FLOOR") + txt(0, 11.5, lab.length > 2 ? 9 : 14, "#fbf8e4", lab)));
};

/* ---------- things that can turn up anywhere ---------- */
function loose(){
  var s = "", o = CUR.o, hi = CUR.hi, i;
  if(o("steps")){
    var st = "";
    for(i = 0; i < 9; i++){
      var sz = 1.0 + i * 0.45, sx = i % 2 ? 0.12 : -0.12, c2 = P(sx, floorY(sz), sz);
      st += ell(c2, F * 0.055 / sz, F * (EYE - floorY(sz)) * 0.13 / (sz * sz), "#18242a", ' opacity=".62"');
    }
    s += hi("steps", st);
  }
  if(o("fog")){
    var fg = "";
    for(i = 0; i < 7; i++){ var fz = 1.0 + i * 0.6, fc = P((i % 3 - 1) * 0.4, floorY(fz) + 0.08, fz); fg += ell(fc, F * 0.7 / fz, F * 0.09 / fz, "#e8ecf0", ' opacity=".2"'); }
    s += hi("fog", '<g class="lcc-drift">' + fg + '</g>');
  }
  if(o("ball")) s += hi("ball", standUp(-0.2, floorY(1.9), 1.9, '<circle cx="0" cy="-11" r="11" fill="#2d8fa8"/><path d="M-11 -11h22M0 -22q6 11 0 22" stroke="#efe6c8" stroke-width="2" fill="none"/>'));
  if(o("shoes")) s += hi("shoes", standUp(0.1, floorY(1.45), 1.45, '<path d="M-22 0v-6q0 -5 5 -5h4q3 0 5 3l6 3q3 2 3 5z" fill="#2a2420"/><path d="M2 0v-6q0 -5 5 -5h4q3 0 5 3l6 3q3 2 3 5z" fill="#2a2420"/>'));
  if(o("chair")) s += hi("chair", standUp(0.05, floorY(3.0), 3.0, '<rect x="-22" y="-44" width="44" height="6" fill="#3a6a8a"/><rect x="-24" y="-90" width="48" height="40" rx="4" fill="#3a6a8a"/><path d="M-20 -38v38M20 -38v38M-14 -50v-6M14 -50v-6" stroke="#55534a" stroke-width="4"/>'));
  if(o("balloon")) s += hi("balloon", '<g class="lcc-bob">' + standUp(0.25, 1.3, 2.8, '<ellipse cx="0" cy="-20" rx="15" ry="19" fill="#d9a441"/><path d="M-3 -1h6l-3 4z" fill="#b5843a"/><path d="M0 3q-6 20 4 40q-8 20 0 40" stroke="#efe6c8" stroke-width="1.5" fill="none"/><ellipse cx="-6" cy="-26" rx="3" ry="6" fill="#fff" opacity=".35"/>') + '</g>');
  if(o("shadow")){
    var L = LAY[CUR.place.id].shadow;
    if(L) s += hi("shadow", onWall(L[0], L[2], L[1] + floorY(L[2]), '<g opacity=".42" fill="#000"><ellipse cx="0" cy="-58" rx="11" ry="13"/><path d="M-20 70l2 -64q-4 -36 6 -50h24q10 14 6 50l2 64z"/></g>'));
  }
  return s;
}
function standing(){
  var s = "", o = CUR.o, hi = CUR.hi, pid = CUR.place.id;
  var wp = pid === "staff" ? [0.15, 3.3] : [0.56, 2.25];
  var ws = wetSign(wp[0], wp[1], o("wet"));
  s += o("wet") ? hi("wet", ws) : ws;
  if(o("wet2")) s += hi("wet2", wetSign(-0.05, 2.8, false));
  if(o("bonnie")) s += hi("bonnie", bonnie(-0.32, 2.6));
  return s;
}

/* ---------- the whole picture ----------
   scene(floor, odd, reveal, idp, opt)
   opt: { place, era, dark, happy, lite, trot, nscale } (all optional) */
function scene(floor, odd, reveal, idp, opt){
  idp = idp || "lcc"; opt = opt || {};
  var pid = opt.place && PLACES[opt.place] ? opt.place : "corridor";
  var e = opt.era || era().id;
  PLACES[pid].id = pid;
  CUR.place = PLACES[pid]; CUR.floor = floor || 0; CUR.eraId = e; CUR.happy = !!opt.happy; CUR.lite = !!opt.lite;
  CUR.o = function(id){ return odd === id; };
  CUR.hi = function(id, svg){ return reveal && odd === id ? '<g class="lcc-hi">' + svg + '</g>' : svg; };
  CUR.blue = false;
  CUR.lights = LIGHTZ.map(function(z, i){ return !opt.dark && !(i === 1 && odd === "light"); });
  var pl = CUR.place, s = "";

  s += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (opt.vb || "0 0 800 500") + '" class="lcc-svg" role="img" aria-label="' + esc(pl.name) + " at night, Floor " + CUR.floor + '"' + (opt.vb ? ' preserveAspectRatio="xMidYMid slice"' : '') + '>' +
    '<defs>' +
      (opt.style ? '<style>' + opt.style + '</style>' : '') +
      '<radialGradient id="' + idp + 'Pool"><stop offset="0" stop-color="#fff6c8" stop-opacity=".5"/><stop offset=".55" stop-color="#fff2b0" stop-opacity=".16"/><stop offset="1" stop-color="#fff2b0" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + idp + 'Glow"><stop offset="0" stop-color="#fffbe0" stop-opacity=".75"/><stop offset="1" stop-color="#fff6c0" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + idp + 'GlowB"><stop offset="0" stop-color="#cfe6ff" stop-opacity=".8"/><stop offset="1" stop-color="#9cc8ff" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + idp + 'Exit"><stop offset="0" stop-color="#5dff9b" stop-opacity=".55"/><stop offset="1" stop-color="#5dff9b" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + idp + 'Vig" cx="50%" cy="46%" r="72%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></radialGradient>' +
      '<linearGradient id="' + idp + 'Sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b1c"/><stop offset=".6" stop-color="#1a2446"/><stop offset="1" stop-color="#3a3a5a"/></linearGradient>' +
      '<clipPath id="' + idp + 'Floor"><polygon points="' + floorQ(-1, 1, NZ, FZ).map(pt).join(" ") + '"/></clipPath>' +
      '<linearGradient id="' + idp + 'Wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4c4" stop-opacity=".14"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>' +
    '</defs>' +
    '<rect width="800" height="500" fill="#14130e"/>' +
    '<g' + (odd === "mirror" ? ' transform="translate(800 0) scale(-1 1)"' : '') + '>';

  s += room(idp);
  s += farWall();
  if(odd === "figure") s += figure();
  /* light pools on the floor */
  if(!pl.open){
    s += '<g clip-path="url(#' + idp + 'Floor)">';
    LIGHTZ.forEach(function(lz, li){
      if(!CUR.lights[li]) return;
      var y = floorY(lz), c = P(0, y, lz), rx = F * 1.15 / lz, ry = F * (EYE - y) * 0.9 / (lz * lz);
      s += ell(c, rx, ry, "url(#" + idp + "Pool)");
    });
    s += '</g>';
  }
  /* the era's walls, then each place's own things */
  var L = LAY[pid];
  if(!pl.shelves) L.deco.forEach(function(d, n){
    var art = decoArt(e, n);
    if(art) s += (pl.open ? standUp(d[0] * 0.92, 0.85, d[1], '<g transform="translate(0 -26) scale(.7)">' + art + '</g>') : onWall(d[0], d[1], d[2] + floorY(d[1]), d[3] ? '<g transform="scale(' + d[3] + ')">' + art + '</g>' : art));
  });
  s += eraFloor(e);
  s += FURN[pid]();
  if(pl.shelves) L.deco.forEach(function(d, n){ var art = decoArt(e, n); if(art) s += onPlane(d[0] * 0.72, d[1], d[2], '<g transform="scale(.8)">' + art + '</g>'); });
  s += loose();
  /* ceiling lights, and anything sitting on them */
  if(!pl.open) LIGHTZ.forEach(function(lz, li){ s += lamp(li, idp); });
  if(odd === "bird") s += CUR.hi("bird", birdOn(1));
  if(pid !== "roof" && pid !== "lib") s += exitSign(idp);
  else if(odd === "exit" || odd === "exitarrow") s += exitSign(idp);
  s += standing();
  s += eraCritter(e);
  /* a small brown visitor at the far end (a secret, only on a normal floor) */
  if(opt.trot) s += '<g class="lcc-trot">' + standUp(0, floorY(FZ - 0.3), FZ - 0.3, '<g transform="translate(0 -46)">' + (window.A2ART ? A2ART.bonnie(0, 0, 1, "stand") : '<ellipse cx="0" cy="16" rx="30" ry="18" fill="#9c6b45"/>') + '</g>', 0.005) + '</g>';
  s += '</g>';
  s += '<rect width="800" height="500" fill="url(#' + idp + 'Vig)" pointer-events="none"/>';
  return s + '</svg>';
}
/* the things only the UV torch shows. Positions in picture units */
var UVSPOT = null;
function uvLayer(floor, pid){
  var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" class="lcc-svg" aria-hidden="true">', st = 'fill="none" stroke="#c9a8ff" stroke-width="3" stroke-linecap="round"';
  CUR.place = PLACES[pid]; PLACES[pid].id = pid;
  /* handprints and scribbles that are always there, if you can see them */
  s += onWall(-1, 1.9, 1.0, '<g ' + st + '><path d="M0 20v-26M-8 18v-20M8 18v-22M15 20v-14M-15 24q-6 -8 -2 -14"/><path d="M-14 24q14 14 30 -4"/></g>');
  s += onWall(1, 3.2, 1.7, '<g ' + st + '><circle r="14"/><circle cx="-5" cy="-3" r="1.5"/><circle cx="5" cy="-3" r="1.5"/><path d="M-6 5q6 5 12 0"/></g>');
  s += onFloor(0.3, 2.0, floorY(2.0), '<g ' + st + '><path d="M-20 0h30m-10 -10l10 10l-10 10"/></g>');
  s += onWall(-1, 4.2, 1.7, '<text x="0" y="0" text-anchor="middle" font-family="Arial" font-weight="700" font-size="16" fill="#c9a8ff">B5</text>');
  UVSPOT = null;
  if(floor === 7){
    var c = P(1, 1.35 + floorY(1.6), 1.6);
    UVSPOT = [c[0], c[1]];
    s += onWall(1, 1.6, 1.35 + floorY(1.6), '<g class="lcc-uvmsg">' + '<text x="0" y="-6" text-anchor="middle" font-family="Segoe Print,Bradley Hand,Comic Sans MS,cursive" font-weight="700" font-size="11" fill="#e2ccff">JAY WAS</text>' +
      '<text x="0" y="8" text-anchor="middle" font-family="Segoe Print,Bradley Hand,Comic Sans MS,cursive" font-weight="700" font-size="11" fill="#e2ccff">HERE</text>' +
      '<g transform="translate(26 0) scale(.5)" fill="none" stroke="#e2ccff" stroke-width="3"><ellipse rx="14" ry="10"/><circle cx="11" cy="-8" r="7"/><path d="M18 -9l7 3l-7 2"/></g></g>');
  }
  return s + '</svg>';
}

/* ---------- sound: a soft hum, footsteps, a chime. Never loud ---------- */
var ac = null, hum = null, radioT = null;
function audio(){
  if(!store.sound) return null;
  try{ ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if(ac.state === "suspended") ac.resume(); }catch(e){ ac = null; }
  return ac;
}
function humOn(){
  var a = audio(); if(!a || hum) return;
  try{
    var o1 = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain(), t = a.currentTime;
    var pid = store.place, f0 = pid === "boiler" ? 42 : pid === "roof" ? 0 : 50;
    o1.type = pid === "roof" ? "sine" : "sawtooth"; o1.frequency.value = f0 || 70; o2.type = "sine"; o2.frequency.value = (f0 || 35) * 2;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(pid === "roof" ? 0.006 : 0.012, t + 1.2);
    o1.connect(g); o2.connect(g); g.connect(a.destination); o1.start(); o2.start();
    hum = { o1: o1, o2: o2, g: g };
  }catch(e){}
}
function humOff(){ if(hum){ try{ hum.o1.stop(); hum.o2.stop(); }catch(e){} hum = null; } }
function noise(t, dur, freq, vol){
  var a = ac;
  var b = a.createBufferSource(), buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate), d = buf.getChannelData(0);
  for(var j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / d.length, 3);
  var f = a.createBiquadFilter(), g = a.createGain();
  f.type = "lowpass"; f.frequency.value = freq; g.gain.value = vol;
  b.buffer = buf; b.connect(f); f.connect(g); g.connect(a.destination); b.start(t);
}
function step(n){
  var a = audio(); if(!a) return;
  var fq = store.place === "roof" ? 900 : store.place === "lib" ? 300 : 420;
  try{ for(var i = 0; i < (n || 3); i++) noise(a.currentTime + i * 0.22, 0.08, fq, 0.2); }catch(e){}
}
function tone(f1, f2, dur, vol, type, delay){
  var a = audio(); if(!a) return;
  try{
    var o = a.createOscillator(), g = a.createGain(), t = a.currentTime + (delay || 0);
    o.type = type || "triangle"; o.frequency.setValueAtTime(f1, t); o.frequency.linearRampToValueAtTime(f2, t + dur * 0.5);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + 0.05);
  }catch(e){}
}
function chime(up){
  if(era().id === "eighties" && up){ tone(660, 660, 0.12, 0.05, "square"); tone(990, 990, 0.16, 0.05, "square", 0.1); return; }
  tone(up ? 523 : 220, up ? 784 : 165, 0.5, 0.07);
}
function chirp(){ tone(2200, 3200, 0.12, 0.04, "sine"); tone(2600, 3600, 0.12, 0.04, "sine", 0.16); tone(2400, 3000, 0.1, 0.035, "sine", 0.3); }
function fanfare(){ [523, 659, 784, 1046].forEach(function(f, i){ tone(f, f, 0.5, 0.05, "triangle", i * 0.14); }); }
/* the night radio: a slow, quiet music box tune */
var TUNE = [392, 0, 330, 294, 330, 0, 262, 0, 294, 330, 392, 0, 440, 392, 330, 0];
function radioOn(){
  if(radioT || !store.radio || !has("m_radio")) return;
  var i = 0;
  radioT = setInterval(function(){
    if(!root || !store.sound){ return; }
    var f = TUNE[i % TUNE.length]; i++;
    if(f) tone(f, f, 0.9, 0.022, "sine");
  }, 520);
}
function radioOff(){ if(radioT){ clearInterval(radioT); radioT = null; } }

/* ---------- the overlay's look ---------- */
var css = document.createElement("style");
css.textContent =
  "html body>.lccorr{position:fixed !important;inset:0;z-index:2147482900 !important}" /* above the corner buttons, below the break timer and calm screen */ +
  ".lccorr{background:#0b0c09;color:#fbf8e4;display:flex;flex-direction:column;font-family:var(--body,'Atkinson Hyperlegible',Verdana,sans-serif);-webkit-tap-highlight-color:transparent}" +
  ".lccorr *{box-sizing:border-box}" +
  ".lccorr button{font-family:var(--display,'Space Mono',monospace);cursor:pointer;-webkit-user-select:none;user-select:none}" +
  ".lccorr button:focus-visible{outline:3px solid #e6d84a;outline-offset:2px}" +
  ".lcc-top{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 12px;flex-wrap:wrap}" +
  ".lcc-top h2{margin:0;font-family:var(--display,'Space Mono',monospace);font-size:1.1rem;letter-spacing:.02em;white-space:nowrap}" +
  ".lcc-f{font-family:var(--display,'Space Mono',monospace);font-size:.95rem;color:#e6d84a;display:inline-flex;align-items:center;gap:8px;white-space:nowrap}" +
  ".lcc-tb{font-size:.86rem;background:none;border:2px solid #6d6a52;color:#fbf8e4;border-radius:6px;padding:6px 10px;min-height:38px}" +
  ".lcc-stage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:0 10px;overflow:hidden;position:relative}" +
  ".lcc-view{width:min(100%,calc((100vh - 190px) * 1.6));max-width:1000px;aspect-ratio:8/5;position:relative;border:3px solid #2a2920;border-radius:6px;overflow:hidden;box-shadow:0 0 60px rgba(230,216,74,.12);touch-action:manipulation}" +
  ".lcc-scene{position:absolute;inset:0}" +
  ".lcc-svg{width:100%;height:100%;display:block}" +
  ".lcc-dark,.lcc-uv{position:absolute;inset:0;pointer-events:none}" +
  ".lcc-dark{background:radial-gradient(circle calc(var(--r) * .8) at var(--x) var(--y),var(--tint),transparent 100%),radial-gradient(circle var(--r) at var(--x) var(--y),rgba(0,0,0,0) 0,rgba(0,0,0,0) 45%,rgba(4,4,3,var(--dk)) 100%)}" +
  ".lcc-uv{-webkit-mask-image:radial-gradient(circle var(--r) at var(--x) var(--y),#000 0,#000 50%,transparent 85%);mask-image:radial-gradient(circle var(--r) at var(--x) var(--y),#000 0,#000 50%,transparent 85%)}" +
  ".lcc-view.walk .lcc-scene,.lcc-view.walk .lcc-uv{animation:lccwalk .5s ease-in both}" +
  ".lcc-view.back .lcc-scene,.lcc-view.back .lcc-uv{animation:lccback .5s ease-in both}" +
  "@keyframes lccwalk{0%{transform:scale(1)}100%{transform:scale(2.4);opacity:0}}" +
  "@keyframes lccback{0%{transform:scale(1)}100%{transform:scale(.4) rotate(-4deg);opacity:0}}" +
  "@media (prefers-reduced-motion:no-preference){" +
    ".lcc-flick{animation:lccflick 6s ease-in-out infinite}.lcc-glow{animation:lccglow 3s ease-in-out infinite alternate}.lcc-fig{animation:lccfig 6s ease-in-out infinite}" +
    ".lcc-sec{animation:lccsec 60s steps(60) infinite}.lcc-sec.rev{animation-direction:reverse}" +
    ".lcc-bob{animation:lccbob 3s ease-in-out infinite alternate}.lcc-drift{animation:lccdrift 9s ease-in-out infinite alternate}" +
    ".lcc-steam{animation:lccsteam 3s ease-in-out infinite}.lcc-drip{animation:lccdrip 1.8s ease-in infinite}" +
    ".lcc-blink{animation:lccblink 4s steps(1) infinite}.lcc-holo{animation:lccglow 2s ease-in-out infinite alternate}" +
    ".lcc-trot{animation:lcctrot 5s linear both}.lcc-robo{animation:lccrobo 9s ease-in-out infinite alternate}.lcc-wander{animation:lccwander 14s ease-in-out infinite alternate}" +
    ".lcc-dark.flk{animation:lccflk 3.4s ease-in-out infinite}" +
    ".lcc-new{animation:lccpop .6s ease-out both}" +
  "}" +
  "@keyframes lccflick{0%,100%{opacity:1}45%{opacity:.7}50%{opacity:.9}55%{opacity:.75}}" +
  "@keyframes lccglow{from{opacity:.75}to{opacity:1}}" +
  "@keyframes lccfig{0%,100%{opacity:.85}50%{opacity:.6}}" +
  "@keyframes lccsec{to{transform:rotate(360deg)}}" +
  "@keyframes lccbob{to{transform:translateY(-5px)}}" +
  "@keyframes lccdrift{to{transform:translateX(30px)}}" +
  "@keyframes lccsteam{0%{opacity:.2;transform:translateY(4px)}50%{opacity:.9}100%{opacity:.2;transform:translateY(-6px)}}" +
  "@keyframes lccdrip{0%{transform:translateY(0);opacity:1}85%{opacity:1}100%{transform:translateY(120px);opacity:0}}" +
  "@keyframes lccblink{0%,100%{opacity:1}92%{opacity:.1}96%{opacity:1}}" +
  "@keyframes lcctrot{0%{transform:translateX(150px);opacity:0}8%{opacity:1}92%{opacity:1}100%{transform:translateX(-150px);opacity:0}}" +
  "@keyframes lccrobo{to{transform:translateX(220px)}}" +
  "@keyframes lccwander{to{transform:translateX(-120px)}}" +
  "@keyframes lccflk{0%,100%{opacity:1}40%{opacity:.93}44%{opacity:.82}48%{opacity:.95}70%{opacity:.9}}" +
  "@keyframes lccpop{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}" +
  ".lcc-hi>*{filter:drop-shadow(0 0 3px #ffb347) drop-shadow(0 0 8px #ffb347) drop-shadow(0 0 2px #fff0c0)}" +
  ".lcc-tap{cursor:pointer}" +
  ".lcc-msg{position:absolute;left:50%;top:10px;transform:translateX(-50%);width:max-content;max-width:92%;padding:7px 13px;border-radius:6px;background:rgba(14,15,11,.88);border:2px solid #e6d84a;font-size:.95rem;text-align:center;pointer-events:none;margin:0}" +
  ".lcc-msg[hidden]{display:none}" +
  ".lcc-bar{display:flex;justify-content:center;gap:12px;padding:10px 12px 14px;flex-wrap:nowrap}" +
  ".lcc-bar button{font-weight:700;font-size:1.05rem;min-width:170px;min-height:54px;border-radius:6px;border:3px solid #0e0f0b;box-shadow:0 5px 0 #000;color:#0e0f0b}" +
  ".lcc-bar button:active{transform:translateY(3px);box-shadow:0 2px 0 #000}" +
  ".lcc-back{background:#ffb04a}.lcc-go{background:#39d98a}" +
  ".lcc-bar button:disabled{opacity:.5;cursor:default}" +
  ".lcc-card{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(5,6,4,.72);padding:12px;z-index:4}" +
  ".lcc-card>div{max-width:440px;width:100%;max-height:100%;overflow:auto;background:#fbf8e4;color:#0e0f0b;border:4px solid #0e0f0b;border-radius:8px;padding:16px 16px 12px;text-align:center;box-shadow:0 8px 0 #000}" +
  ".lcc-card h3{margin:0 0 6px;font-family:var(--display,'Space Mono',monospace);font-size:1.3rem}" +
  ".lcc-card p{margin:6px 0;line-height:1.4}" +
  ".lcc-card .sm{font-size:.88rem;opacity:.85}" +
  ".lcc-card button{margin:10px 4px 0;font-weight:700;font-size:1.02rem;padding:10px 18px;border-radius:6px;border:3px solid #0e0f0b;background:#e6d84a;color:#0e0f0b;box-shadow:0 4px 0 #0e0f0b}" +
  ".lcc-card button.alt{background:#fbf8e4}" +
  ".lcc-dots{display:inline-flex;gap:5px}.lcc-dots i{width:11px;height:11px;border-radius:2px;border:2px solid #6d6a52}.lcc-dots i.on{background:#e6d84a;border-color:#e6d84a}" +
  ".lcc-dots.pyr i{border:0;border-radius:0;width:12px;height:11px;background:#4a4836;clip-path:polygon(50% 0,100% 100%,0 100%)}.lcc-dots.pyr i.on{background:#e6d84a}" +
  ".lcc-score{color:#ff4fa3;text-shadow:0 0 8px rgba(255,79,163,.6);letter-spacing:.08em}" +
  /* report card */
  ".lcc-rep{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:10px 0;text-align:left}" +
  ".lcc-rep div{background:rgba(0,0,0,.06);border-radius:6px;padding:6px 9px}.lcc-rep span{display:block;font-size:.76rem;opacity:.75}.lcc-rep b{font-family:var(--display,'Space Mono',monospace);font-size:1.15rem}" +
  ".lcc-stamp{display:inline-block;transform:rotate(-6deg);border:3px solid #2d8f5a;color:#2d8f5a;font-family:var(--display,'Space Mono',monospace);font-weight:700;padding:2px 10px;border-radius:6px;letter-spacing:.1em;margin:4px 0}" +
  /* the hub and the screens */
  ".lcc-pane{position:absolute;inset:0;z-index:3;overflow:auto;background:linear-gradient(rgba(8,9,6,.55),rgba(8,9,6,.9) 40%);padding:14px 14px 20px}" +
  ".lcc-pane[hidden]{display:none}" +
  ".lcc-scr{background:#0e0f0b;z-index:5}" +
  ".lcc-in{max-width:760px;margin:0 auto}" +
  ".lcc-era{display:flex;gap:12px;align-items:center;background:rgba(251,248,228,.08);border:2px solid rgba(230,216,74,.5);border-radius:8px;padding:8px 12px;margin-bottom:12px}" +
  ".lcc-era b{font-family:var(--display,'Space Mono',monospace);color:#e6d84a;display:block}" +
  ".lcc-era small{display:block;font-size:.88rem;opacity:.9;line-height:1.35}" +
  ".lcc-era svg{width:44px;height:44px;flex:none}" +
  ".lcc-big{display:block;width:100%;min-height:64px;margin:4px 0 14px;font-weight:700;font-size:1.3rem;border-radius:8px;border:3px solid #0e0f0b;background:#e6d84a;color:#0e0f0b;box-shadow:0 6px 0 #000}" +
  ".lcc-big small{display:block;font-size:.8rem;font-weight:400}" +
  ".lcc-big:active{transform:translateY(3px);box-shadow:0 3px 0 #000}" +
  ".lcc-lab{font-family:var(--display,'Space Mono',monospace);font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;color:#d8d5b6;margin:12px 0 6px}" +
  ".lcc-chips{display:flex;flex-wrap:wrap;gap:7px}" +
  ".lcc-chip{font-size:.88rem;min-height:42px;padding:6px 11px;border-radius:6px;border:2px solid #6d6a52;background:rgba(251,248,228,.06);color:#fbf8e4;display:inline-flex;align-items:center;gap:7px}" +
  ".lcc-chip[aria-pressed=true]{background:#fbf8e4;color:#0e0f0b;border-color:#fbf8e4}" +
  ".lcc-chip.lock{opacity:.55;border-style:dashed}" +
  ".lcc-chip svg{width:22px;height:22px;flex:none}" +
  ".lcc-hint{font-size:.85rem;opacity:.8;margin:6px 0 0}" +
  ".lcc-menu{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:16px}" +
  ".lcc-menu button{min-height:68px;border-radius:8px;border:2px solid #6d6a52;background:#1b1c16;color:#fbf8e4;font-size:.86rem;font-weight:700;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:6px 4px;position:relative}" +
  ".lcc-menu button small{font-family:var(--body,'Atkinson Hyperlegible',Verdana,sans-serif);font-weight:400;font-size:.76rem;opacity:.85}" +
  ".lcc-menu svg{width:26px;height:26px}" +
  ".lcc-dot{position:absolute;top:6px;right:8px;width:10px;height:10px;border-radius:50%;background:#39d98a}" +
  ".lcc-h{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}" +
  ".lcc-h h3{margin:0;font-family:var(--display,'Space Mono',monospace);font-size:1.2rem}" +
  ".lcc-h p{margin:0;font-size:.9rem;opacity:.85}" +
  ".lcc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:9px}" +
  ".lcc-lc{background:#fbf8e4;color:#0e0f0b;border:3px solid #0e0f0b;border-radius:6px;overflow:hidden;box-shadow:0 4px 0 #000}" +
  ".lcc-lc:nth-child(3n){transform:rotate(-.6deg)}.lcc-lc:nth-child(4n+1){transform:rotate(.5deg)}" +
  ".lcc-ph{aspect-ratio:4/3;background:#14130e;position:relative;overflow:hidden}" +
  ".lcc-ph svg{width:100%;height:100%;display:block}" +
  ".lcc-lc .t{padding:6px 8px 8px}.lcc-lc b{display:block;font-size:.86rem;line-height:1.2}.lcc-lc span{display:block;font-size:.78rem;line-height:1.3;opacity:.85;margin-top:2px}" +
  ".lcc-lc.no{background:#2a2a22;color:#bdb99c;box-shadow:none;border-color:#3e3c30}.lcc-lc.no .lcc-ph{display:flex;align-items:center;justify-content:center;background:repeating-linear-gradient(45deg,#1b1c16 0 8px,#202118 8px 16px)}" +
  ".lcc-lc.no .lcc-ph b{font-family:var(--display,'Space Mono',monospace);font-size:2rem;opacity:.35}" +
  ".lcc-tier{position:absolute;right:5px;top:5px;font-style:normal;font-size:.62rem;letter-spacing:.12em;color:#e6d84a;background:rgba(14,15,11,.78);border-radius:4px;padding:1px 5px}" +
  ".lcc-kit{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:9px}" +
  ".lcc-ki{border:2px solid #6d6a52;border-radius:8px;padding:10px;background:#1b1c16;display:flex;gap:10px;align-items:center}" +
  ".lcc-ki svg{width:42px;height:42px;flex:none}" +
  ".lcc-ki b{display:block;font-size:.9rem}.lcc-ki span{display:block;font-size:.8rem;opacity:.85;line-height:1.3}" +
  ".lcc-ki.no{opacity:.6;border-style:dashed}.lcc-ki.nx{opacity:1;border-color:#e6d84a;border-style:dashed}" +
  ".lcc-badge{display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap}" +
  ".lcc-badge svg{width:min(240px,70vw);height:auto;flex:none}" +
  ".lcc-bests{flex:1;min-width:200px}" +
  ".lcc-bests div{display:flex;justify-content:space-between;border-bottom:1px solid rgba(251,248,228,.15);padding:6px 0;font-size:.92rem}" +
  ".lcc-bests b{font-family:var(--display,'Space Mono',monospace);color:#e6d84a}" +
  "@media (max-width:620px){.lccorr .lcc-top{padding-top:50px}.lcc-bar button{min-width:0;flex:1;font-size:.95rem}.lcc-view{width:100%}.lcc-menu{grid-template-columns:repeat(2,1fr)}.lcc-top h2{font-size:.95rem}.lcc-grid{grid-template-columns:repeat(2,1fr)}}" +
  "@media (max-height:520px){.lcc-bar{padding:6px 10px 8px}.lcc-bar button{min-height:46px}.lcc-top{padding:5px 10px}}";
document.head.appendChild(css);

/* ---------- little icons ---------- */
function icon(kind, ref){
  var v = '<svg viewBox="0 0 40 40" aria-hidden="true">';
  if(kind === "place") return v + '<rect x="9" y="5" width="22" height="32" rx="2" fill="#5e4730" stroke="#2a2010" stroke-width="2"/><rect x="12" y="9" width="16" height="10" fill="#1c2a2c"/><circle cx="26" cy="24" r="2" fill="#d8c27a"/><rect x="7" y="35" width="26" height="3" fill="#2a2010"/></svg>';
  if(kind === "torch"){
    var t = TORCH[ref] || TORCH.std, body = ref === "uv" ? "#3a2a5a" : ref === "lantern" ? "#8a6a2e" : "#4a4a52";
    if(ref === "lantern") return v + '<circle cx="20" cy="22" r="13" fill="' + t.col + '" opacity=".3"/><path d="M14 10h12l2 4H12z" fill="#4a3a1a"/><rect x="13" y="14" width="14" height="18" rx="2" fill="#ffcf7a" stroke="#4a3a1a" stroke-width="2"/><path d="M15 6q5 -4 10 0" stroke="#4a3a1a" stroke-width="2" fill="none"/><rect x="12" y="32" width="16" height="3" fill="#4a3a1a"/></svg>';
    return v + '<path d="M22 14l14 -8v28l-14 -8z" fill="' + t.col + '" opacity="' + (ref === "wide" ? ".55" : ".35") + '"/><rect x="4" y="15" width="16" height="10" rx="2" fill="' + body + '"/><rect x="18" y="13" width="5" height="14" rx="1" fill="#2a2a30"/>' + (ref === "flicker" ? '<path d="M10 17l-2 3h3l-2 3" stroke="#e6d84a" stroke-width="1.5" fill="none"/>' : '') + '</svg>';
  }
  if(kind === "badge"){ var c = ref === "gold" ? "#e6c84a" : ref === "glow" ? "#5dff9b" : "#fbf8e4"; return v + '<rect x="16" y="2" width="8" height="8" fill="#4a4836"/><rect x="8" y="8" width="24" height="30" rx="3" fill="' + c + '" stroke="#0e0f0b" stroke-width="2"/><circle cx="20" cy="19" r="5" fill="#0e0f0b" opacity=".6"/><rect x="12" y="28" width="16" height="3" fill="#0e0f0b" opacity=".5"/></svg>'; }
  if(kind === "item") return v + '<rect x="12" y="8" width="16" height="28" rx="4" fill="#3a6a8a" stroke="#0e0f0b" stroke-width="2"/><rect x="14" y="4" width="12" height="6" rx="1" fill="#2a2a30"/><path d="M15 2q2 -2 4 0" stroke="#d8d5b6" stroke-width="1.5" fill="none"/><rect x="15" y="18" width="10" height="6" fill="#efe6c8"/></svg>';
  if(ref === "dark") return v + '<circle cx="20" cy="20" r="16" fill="#0e0f0b" stroke="#6d6a52" stroke-width="2"/><path d="M24 9a12 12 0 1 0 6 18a10 10 0 0 1 -6 -18z" fill="#e6d84a"/></svg>';
  if(ref === "radio") return v + '<rect x="5" y="14" width="30" height="20" rx="3" fill="#8a5a3a" stroke="#0e0f0b" stroke-width="2"/><circle cx="14" cy="24" r="5" fill="#3a2a1a"/><rect x="22" y="19" width="9" height="3" fill="#e6d84a"/><path d="M12 14l12 -9" stroke="#0e0f0b" stroke-width="2"/></svg>';
  if(kind === "log") return v + '<rect x="7" y="5" width="26" height="31" rx="2" fill="#fbf8e4" stroke="#0e0f0b" stroke-width="2"/><rect x="11" y="10" width="18" height="10" fill="#1b1c16"/><path d="M11 25h18M11 30h12" stroke="#6d6a52" stroke-width="2"/></svg>';
  if(kind === "secret") return v + '<path d="M20 34q-12 -4 -12 -16q0 -12 12 -14q12 2 12 14q0 12 -12 16z" fill="#a87650"/><circle cx="15" cy="16" r="2" fill="#111"/><circle cx="25" cy="16" r="2" fill="#111"/><ellipse cx="20" cy="22" rx="3" ry="2.2" fill="#111"/></svg>';
  if(kind === "era") return v + '<circle cx="20" cy="20" r="17" fill="#2d2466"/><circle cx="20" cy="20" r="13" fill="none" stroke="#8a5cf6" stroke-width="2.5" stroke-dasharray="6 3"/><circle cx="20" cy="20" r="8" fill="none" stroke="#22b8e6" stroke-width="2" stroke-dasharray="4 2"/><circle cx="20" cy="20" r="4" fill="#ffd23f"/></svg>';
  return v + '</svg>';
}

/* ---------- the game ---------- */
var root = null, keyH = null, busy = false, odd = null, prevOdd = null, run = null, flashT = null, lastGood = false;
var tor = { x: 0.5, y: 0.5 };
function el(t, c, h){ var e = document.createElement(t); if(c) e.className = c; if(h != null) e.innerHTML = h; return e; }
function $(s){ return root ? root.querySelector(s) : null; }
function place(){ return placeOpen(store.place) && PLACES[store.place] ? store.place : "corridor"; }
function torch(){ return has("t_" + store.torch) && TORCH[store.torch] ? store.torch : "std"; }
function darkOn(){ return !!store.dark && has("m_dark"); }

function floorLabel(n){
  var e = era().id;
  if(e === "rome") return "Floor " + roman(n);
  if(e === "eighties") return '<span class="lcc-score">SCORE ' + ("00000" + n * 1000).slice(-6) + '</span>';
  return "Floor " + n;
}
function dots(n){
  var h = "", pyr = era().id === "egypt";
  for(var i = 1; i <= GOAL; i++) h += '<i class="' + (i <= n ? "on" : "") + '"></i>';
  return '<span class="lcc-dots' + (pyr ? " pyr" : "") + '" aria-hidden="true">' + h + '</span>';
}
function labels(){
  var v = era().id === "viking";
  $(".lcc-back").innerHTML = "&darr; " + (v ? "Row back" : "Turn back");
  $(".lcc-go").innerHTML = "&uarr; " + (v ? "Onward" : "Keep walking");
}
function pickOdd(){
  if(!run || run.floor === 0) return null;
  if(Math.random() >= CHANCE) return null;
  var pid = place(), dk = darkOn(), pool = [], tot = 0;
  ODD.forEach(function(x){
    if(!oddIn(x, pid) || x.id === prevOdd) return;
    if(dk && (x.id === "light" || x.id === "lightcol" || x.id === "bird")) return;
    var w = x.t === 3 ? 1.1 : 3;
    if(x.id === "bonnie") w = 1.2;
    if(!store.seen[x.id]) w *= 2;
    pool.push([x.id, w]); tot += w;
  });
  var r = Math.random() * tot;
  for(var i = 0; i < pool.length; i++){ r -= pool[i][1]; if(r <= 0) return pool[i][0]; }
  return pool.length ? pool[0][0] : null;
}
function sceneOpts(extra){
  var o = { place: place(), dark: darkOn(), happy: lastGood && era().id === "victorian" };
  for(var k in extra || {}) o[k] = extra[k];
  return o;
}
function draw(reveal, extra){
  if(!root) return;
  var f = run ? run.floor : 0;
  $(".lcc-scene").innerHTML = scene(f, odd, reveal, "lcc", sceneOpts(extra));
  var uv = $(".lcc-uv");
  if(torch() === "uv"){ uv.innerHTML = uvLayer(f, place()); uv.hidden = false; } else { uv.innerHTML = ""; uv.hidden = true; UVSPOT = null; }
  $(".lcc-f").innerHTML = floorLabel(f) + " " + dots(f);
  $(".lcc-snd").textContent = store.sound ? "Sound on" : "Sound off";
  torchPaint();
}
function torchPaint(){
  if(!root) return;
  var v = $(".lcc-view"), d = $(".lcc-dark"), u = $(".lcc-uv"), t = TORCH[torch()], w = v.clientWidth || 800, k = w / 800;
  var x = (tor.x * w).toFixed(0) + "px", y = (tor.y * v.clientHeight).toFixed(0) + "px", r = (t.r * k * (darkOn() ? 1 : 1.25)).toFixed(0) + "px";
  [d, u].forEach(function(e){ e.style.setProperty("--x", x); e.style.setProperty("--y", y); e.style.setProperty("--r", r); });
  d.style.setProperty("--dk", darkOn() ? 0.94 : t.dark);
  d.style.setProperty("--tint", t.uv ? "rgba(150,90,255,.22)" : torch() === "lantern" ? "rgba(255,190,90,.12)" : "rgba(255,244,200,.08)");
  d.classList.toggle("flk", !!t.flick);
  /* the UV message on Floor 7 */
  if(UVSPOT && run && !store.sec.uv){
    var dx = tor.x * 800 - UVSPOT[0], dy = tor.y * 500 - UVSPOT[1];
    if(dx * dx + dy * dy < 70 * 70) secret("uv");
  }
}
function say(t, ms){
  var m = $(".lcc-msg"); if(!m) return;
  clearTimeout(flashT);
  if(!t){ m.hidden = true; return; }
  m.hidden = false; m.textContent = t;
  if(ms) flashT = setTimeout(function(){ if(root) m.hidden = true; }, ms);
}
function secret(id){
  if(store.sec[id]) return false;
  store.sec[id] = Date.now(); save();
  var s = SECRETS.filter(function(x){ return x.id === id; })[0];
  setTimeout(function(){ say("Secret found: " + s.name + ". " + s.line, 4200); }, 60);
  tone(880, 1320, 0.4, 0.04, "sine");
  return true;
}
/* a card over the play area. btns: [{ t, fn, alt }] */
function card(html, btns){
  var old = $(".lcc-card"); if(old) old.remove();
  var c = el("div", "lcc-card", '<div role="dialog" aria-modal="true">' + html + "</div>");
  (btns || []).forEach(function(b){
    var x = el("button", b.alt ? "alt" : "", b.t); x.type = "button";
    x.onclick = function(){ c.remove(); busy = false; if(b.fn) b.fn(); };
    c.firstChild.appendChild(x);
  });
  $(".lcc-body").appendChild(c);
  busy = true;
  setTimeout(function(){ var f = c.querySelector("button"); try{ if(f) f.focus(); }catch(e){} }, 30);
  return c;
}
function strip(html, btn, fn){
  var b = $(".lcc-bar");
  b.innerHTML = '<p style="margin:0;flex:1;align-self:center;font-size:.95rem;line-height:1.35">' + html + '</p>';
  var x = el("button", "lcc-go", btn); x.type = "button"; x.style.minWidth = "140px"; x.style.flex = "none";
  x.onclick = function(){ bar(); busy = false; fn(); };
  b.appendChild(x);
  setTimeout(function(){ try{ x.focus(); }catch(e){} }, 30);
}
function bar(){
  var b = $(".lcc-bar");
  b.innerHTML = '<button type="button" class="lcc-back"></button><button type="button" class="lcc-go"></button>';
  b.querySelector(".lcc-back").onclick = function(){ choose(true); };
  b.querySelector(".lcc-go").onclick = function(){ choose(false); };
  labels();
}

function startRun(){
  hub(false);
  run = { floor: 0, slips: 0, spotted: [], fresh: 0, t0: Date.now(), flask: has("i_flask"), place: place(), strict: strictOf(store.strict) };
  odd = null; prevOdd = null; lastGood = false; busy = false;
  bar(); draw(false);
  humOff(); humOn(); radioOn();
  say("Floor 0. This is what normal looks like. Have a good look round.", 4200);
}
function nextFloor(){
  prevOdd = odd; odd = pickOdd(); draw(false);
}
function choose(back){
  if(busy || !run) return;
  var wasOdd = !!odd, right = back === wasOdd, what = wasOdd ? ODDBY[odd] : null;
  busy = true;
  step(back ? 2 : 3);
  if(!right){
    lastGood = false;
    say("");
    draw(true);
    chime(false);
    var line = wasOdd ? "Something was different. " + what.say : "Nothing had changed. That was a normal floor.";
    setTimeout(function(){
      if(!root) return;
      if(run.flask){
        run.flask = false;
        strip("<b>Flask of tea.</b> " + esc(line) + " You have a sip and shrug it off.", "Carry on", function(){ nextFloor(); });
        return;
      }
      run.slips++;
      var drop = run.strict.drop, to = Math.max(0, run.floor - drop);
      if(drop >= 99){
        store.runs++; save();
        card("<h3>" + (odd === "figure" ? "It noticed you." : "Back to Floor 0") + "</h3><p>" + esc(line) + "</p>" +
          (wasOdd ? '<p class="sm">It is lit up in amber, if you fancy another look.</p>' : "") +
          '<p class="sm">Graveyard shift. Your best here: Floor ' + (store.bests[run.place] || 0) + ".</p>",
          [{ t: "Start again", fn: function(){ run.floor = 0; odd = null; draw(false); } }, { t: "Shift menu", alt: 1, fn: function(){ endRun(); } }]);
        $(".lcc-card").style.background = "rgba(5,6,4,.45)";
        return;
      }
      run.floor = to;
      strip("<b>Not quite.</b> " + esc(line) + " Down to " + floorLabel(to).replace(/<[^>]+>/g, "") + ".", "Carry on", function(){ odd = null; prevOdd = null; draw(false); });
    }, RM ? 0 : 450);
    return;
  }
  var isNew = wasOdd && !store.seen[odd];
  if(wasOdd){
    store.spots = (store.spots || 0) + 1;
    if(!store.seen[odd]){ store.seen[odd] = run.place; run.fresh++; }
    run.spotted.push(odd);
    save();
  }
  lastGood = true;
  var v = $(".lcc-view");
  v.classList.add(back ? "back" : "walk");
  setTimeout(function(){
    if(!root) return;
    v.classList.remove("walk", "back");
    run.floor++;
    if(run.floor > (store.bests[run.place] || 0)) store.bests[run.place] = run.floor;
    if(run.floor > store.best) store.best = run.floor;
    save();
    chime(true);
    if(run.floor >= GOAL){ clockOff(); return; }
    busy = false;
    nextFloor();
    say(wasOdd ? (isNew ? "New in the log. " : "Good spot. ") + what.say : "Nothing different. Good.", 2600);
    if(isNew){ store.logNew = 1; save(); }
  }, RM ? 0 : 480);
}
function mmss(ms){ var s = Math.round(ms / 1000); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
function clockOff(){
  store.clocked++; store.runs++;
  store.clockedAt[run.place] = (store.clockedAt[run.place] || 0) + 1;
  var sh = run.strict;
  save();
  if(sh.id === "graveyard") secret("grave");
  /* the exit: a moment at the far end before the report. Sometimes Bonnie is there */
  odd = null;
  var trot = Math.random() < (store.sec.trot ? 0.2 : 0.4);
  draw(false, { trot: trot });
  say("Clocked off. Floor " + GOAL + ".");
  fanfare();
  if(trot) setTimeout(function(){ secret("trot"); }, 2200);
  setTimeout(function(){
    if(!root || !run) return;
    say("");
    var r = rank(store.clocked), nr = nextRank(store.clocked), was = rank(store.clocked - 1);
    card('<div class="lcc-stamp">CLOCKED OFF</div><h3>Shift report</h3>' +
      '<div class="lcc-rep">' +
        "<div><span>Place</span><b>" + PLACES[run.place].short + "</b></div>" +
        "<div><span>Shift</span><b>" + sh.name.replace(" shift", "") + "</b></div>" +
        "<div><span>Time on shift</span><b>" + mmss(Date.now() - run.t0) + "</b></div>" +
        "<div><span>Things spotted</span><b>" + run.spotted.length + "</b></div>" +
        "<div><span>Slips</span><b>" + run.slips + "</b></div>" +
        "<div><span>New in the log</span><b>" + run.fresh + "</b></div>" +
      "</div>" +
      '<p class="sm">' + (r !== was ? "<b>New rank: " + r + ".</b> " : "Rank: " + r + ". ") + (nr ? (nr[0] - store.clocked) + " more to " + nr[1] + "." : "Top of the building.") +
      " Log: " + Object.keys(store.seen).length + " of " + ODD.length + ".</p>",
      [{ t: "Go again", fn: function(){ startRun(); } }, { t: "Shift menu", alt: 1, fn: function(){ endRun(); } }]);
  }, trot && !RM ? 4800 : 2200);
}
function endRun(){
  run = null; odd = null; busy = false; radioOff();
  draw(false); hub(true);
}

/* ---------- the shift menu (the hub) ---------- */
function chip(label, on, fn, opt){
  opt = opt || {};
  var b = el("button", "lcc-chip" + (opt.lock ? " lock" : ""), (opt.icon || "") + "<span>" + label + "</span>");
  b.type = "button"; b.setAttribute("aria-pressed", on ? "true" : "false");
  b.onclick = fn;
  return b;
}
function needFor(item){
  if(!LD.next) return "";
  return LD.next.id === item.id ? LD.need + " more sparks" : "Later this term";
}
function lockedSay(item){ say(item.name + ": " + (LD.next && LD.next.id === item.id ? LD.need + " more sparks." : "opens later this term."), 2400); }
function eraBanner(){
  var e = era();
  return '<div class="lcc-era">' + icon("era") + '<div><b>This week: ' + esc(e.name) + '</b><small>' + esc(e.line) + '</small><small>' + esc(RULE[e.id] || "") + '</small></div></div>';
}
function hub(show){
  var p = $(".lcc-hubp");
  if(!show){ p.hidden = true; $(".lcc-bar").style.visibility = ""; return; }
  refreshLadder();
  $(".lcc-bar").style.visibility = "hidden";
  p.hidden = false;
  var pid = place(), cur = PLACES[pid];
  p.innerHTML = '<div class="lcc-in">' + eraBanner() +
    '<button type="button" class="lcc-big lcc-start">Clock in<small>' + cur.name + ' &middot; ' + strictOf(store.strict).name + (store.bests[pid] ? ' &middot; best Floor ' + store.bests[pid] : '') + '</small></button>' +
    '<div class="lcc-lab">Where tonight</div><div class="lcc-chips lcc-pl"></div>' +
    '<div class="lcc-lab">How strict</div><div class="lcc-chips lcc-st"></div><p class="lcc-hint lcc-sth"></p>' +
    '<div class="lcc-lab">Torch</div><div class="lcc-chips lcc-to"></div>' +
    '<div class="lcc-chips lcc-md" style="margin-top:8px"></div>' +
    '<div class="lcc-menu">' +
      '<button type="button" data-go="log">' + icon("log") + 'Anomaly log<small>' + Object.keys(store.seen).filter(function(k){ return ODDBY[k]; }).length + ' of ' + ODD.length + '</small>' + (store.logNew ? '<i class="lcc-dot"></i>' : '') + '</button>' +
      '<button type="button" data-go="kit">' + icon("torch", "wide") + 'Unlocks<small>' + LD.have.length + ' of ' + LADDER.length + '</small></button>' +
      '<button type="button" data-go="badge">' + icon("badge", store.badge) + 'ID badge<small>' + rank(store.clocked) + '</small></button>' +
      '<button type="button" data-go="sec">' + icon("secret") + 'Secrets<small>' + Object.keys(store.sec).length + ' of ' + SECRETS.length + '</small></button>' +
    '</div></div>';
  p.querySelector(".lcc-start").onclick = startRun;
  var pl = p.querySelector(".lcc-pl");
  PORDER.forEach(function(id){
    var it = LADDER.filter(function(x){ return x.ref === id && x.kind === "place"; })[0], ok = placeOpen(id);
    pl.appendChild(chip(PLACES[id].short + (ok ? "" : " &middot; " + needFor(it)), id === pid, function(){
      if(!ok){ lockedSay(it); return; }
      store.place = id; save(); humOff(); humOn(); draw(false); hub(true);
    }, { lock: !ok }));
  });
  var st = p.querySelector(".lcc-st");
  STRICT.forEach(function(x){ st.appendChild(chip(x.name, store.strict === x.id, function(){ store.strict = x.id; save(); hub(true); })); });
  p.querySelector(".lcc-sth").textContent = strictOf(store.strict).d + " Eight good calls in a row to clock off.";
  var to = p.querySelector(".lcc-to");
  ["std", "wide", "flicker", "uv", "lantern"].forEach(function(id){
    var it = LADDER.filter(function(x){ return x.ref === id && x.kind === "torch"; })[0], ok = has("t_" + id);
    to.appendChild(chip(TORCH[id].name, torch() === id, function(){
      if(!ok){ lockedSay(it); return; }
      store.torch = id; save(); draw(false); hub(true);
    }, { lock: !ok, icon: icon("torch", id) }));
  });
  var md = p.querySelector(".lcc-md");
  [["m_dark", "dark", "Lights out"], ["m_radio", "radio", "Night radio"]].forEach(function(m){
    var it = LADDER.filter(function(x){ return x.id === m[0]; })[0], ok = has(m[0]);
    md.appendChild(chip(m[2] + (ok ? (store[m[1]] ? ": on" : ": off") : ""), ok && !!store[m[1]], function(){
      if(!ok){ lockedSay(it); return; }
      store[m[1]] = !store[m[1]]; save(); draw(false); hub(true);
    }, { lock: !ok, icon: icon("mode", m[1]) }));
  });
  if(has("i_flask")) md.appendChild(chip("Flask of tea: packed", true, function(){ say("Once a shift, a slip costs nothing. Tea fixes most things.", 2600); }, { icon: icon("item") }));
  [].forEach.call(p.querySelectorAll("[data-go]"), function(b){ b.onclick = function(){ screen(b.getAttribute("data-go")); }; });
  setTimeout(function(){ try{ p.querySelector(".lcc-start").focus(); }catch(e){} }, 30);
}

/* ---------- the screens: log, unlocks, badge, secrets ---------- */
function screen(which){
  var p = $(".lcc-scr");
  $(".lcc-hubp").hidden = true;
  p.hidden = false; p.scrollTop = 0;
  var h = '<div class="lcc-in"><div class="lcc-h">', body = "";
  if(which === "log"){
    store.logNew = 0; save();
    var n = Object.keys(store.seen).filter(function(k){ return ODDBY[k]; }).length;
    h += '<div><h3>Anomaly log</h3><p>' + n + ' of ' + ODD.length + ' spotted. Each one you turn back from goes in here.</p></div>';
    body = '<div class="lcc-grid">';
    [1, 0].forEach(function(want){ PORDER.forEach(function(pid){
      ODD.forEach(function(x){
        if(!!store.seen[x.id] !== !!want) return;
        var home = x.pl === "*" || x.pl === "lit" ? "corridor" : x.pl[0];
        if(home !== pid) return;
        var got = store.seen[x.id];
        body += got ? '<div class="lcc-lc"><div class="lcc-ph" data-ph="' + x.id + '"><i class="lcc-tier" title="How sneaky">' + ["", "&#9679;", "&#9679;&#9679;", "&#9679;&#9679;&#9679;"][x.t] + '</i></div><div class="t"><b>' + esc(x.name) + '</b><span>' + esc(x.note) + '</span></div></div>' :
          '<div class="lcc-lc no"><div class="lcc-ph"><b>?</b></div><div class="t"><b>Not spotted yet</b><span>' + (placeOpen(x.pl === "*" || x.pl === "lit" ? "corridor" : x.pl[0]) ? "Somewhere in " + PLACES[x.pl === "*" || x.pl === "lit" ? "corridor" : x.pl[0]].name.replace("The ", "the ") + (x.pl === "*" || x.pl === "lit" ? " (or anywhere)" : "") + "." : "In a place that opens later.") + '</span></div></div>';
      });
    }); });
    body += '</div>';
  } else if(which === "kit"){
    h += '<div><h3>Unlocks</h3><p>Sparks from your learning open these over the term.</p></div>';
    body = '<div class="lcc-kit">';
    LADDER.forEach(function(x){
      var ok = has(x.id), nx = LD.next && LD.next.id === x.id;
      body += '<div class="lcc-ki' + (ok ? "" : nx ? " no nx" : " no") + '">' + (ok || nx ? icon(x.kind, x.ref) : '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="6" y="6" width="28" height="28" rx="6" fill="#2a2a22" stroke="#4a4836" stroke-width="2"/><text x="20" y="27" text-anchor="middle" font-family="Arial" font-weight="700" font-size="16" fill="#6d6a52">?</text></svg>') +
        '<div><b>' + (ok || nx ? esc(x.name) : "Locked") + '</b><span>' + (ok ? esc(x.d) : nx ? LD.need + " more sparks" : "Later this term") + '</span></div></div>';
    });
    body += '</div>';
  } else if(which === "badge"){
    h += '<div><h3>Night shift ID</h3><p>Clock off to rank up.</p></div>';
    var nr = nextRank(store.clocked);
    body = '<div class="lcc-badge">' + badgeSVG() + '<div class="lcc-bests">' +
      '<div><span>Rank</span><b>' + rank(store.clocked) + '</b></div>' +
      '<div><span>Next rank</span><b>' + (nr ? nr[1] + " (" + (nr[0] - store.clocked) + " more)" : "None. You run the place.") + '</b></div>' +
      '<div><span>Shifts clocked off</span><b>' + store.clocked + '</b></div>' +
      '<div><span>Things spotted, all time</span><b>' + (store.spots || 0) + '</b></div>';
    PORDER.forEach(function(pid){ if(placeOpen(pid)) body += '<div><span>Best in ' + PLACES[pid].short + '</span><b>Floor ' + (store.bests[pid] || 0) + '</b></div>'; });
    body += '</div></div><div class="lcc-lab">Badge style</div><div class="lcc-chips lcc-bd"></div>';
  } else if(which === "sec"){
    h += '<div><h3>Secrets</h3><p>' + Object.keys(store.sec).length + ' of ' + SECRETS.length + ' found. Never needed. Just for fun.</p></div>';
    body = '<div class="lcc-kit">';
    SECRETS.forEach(function(x){
      var ok = !!store.sec[x.id];
      body += '<div class="lcc-ki' + (ok ? "" : " no") + '">' + (ok ? icon("secret") : '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" fill="#2a2a22" stroke="#4a4836" stroke-width="2"/><text x="20" y="26" text-anchor="middle" font-family="Arial" font-weight="700" font-size="15" fill="#6d6a52">?</text></svg>') +
        '<div><b>' + (ok ? esc(x.name) : "Still hidden") + '</b><span>' + (ok ? esc(x.line) : "Keep your eyes open.") + '</span></div></div>';
    });
    body += '</div>';
  }
  p.innerHTML = h + '<button type="button" class="lcc-tb lcc-scrx">Back</button></div>' + body + '</div>';
  p.querySelector(".lcc-scrx").onclick = function(){ p.hidden = true; p.innerHTML = ""; hub(true); };
  if(which === "badge"){
    var bd = p.querySelector(".lcc-bd");
    [["lam", "Laminated", null], ["glow", "Glow", "b_glow"], ["gold", "Gold", "b_gold"]].forEach(function(b){
      var ok = !b[2] || has(b[2]), it = b[2] ? LADDER.filter(function(x){ return x.id === b[2]; })[0] : null;
      bd.appendChild(chip(b[1], store.badge === b[0], function(){ if(!ok){ lockedSay(it); return; } store.badge = b[0]; save(); screen("badge"); }, { lock: !ok, icon: icon("badge", b[0]) }));
    });
  }
  if(which === "log") lazyPhotos(p);
  setTimeout(function(){ try{ p.querySelector(".lcc-scrx").focus(); }catch(e){} }, 30);
}
/* the log's little photos are drawn when they scroll into view */
function photo(id){
  var x = ODDBY[id], got = store.seen[id];
  var pid = typeof got === "string" && PLACES[got] && oddIn(x, got) ? got : (x.pl === "*" || x.pl === "lit" ? "corridor" : x.pl[0]);
  var f = x.f, L = LAY[pid], cx, cy, w;
  if(!f){
    var a = L[x.id === "clock" || x.id === "clockback" || x.id === "clocknone" ? "clock" : x.id] || L.plaque || [-1, 1.6, 1.4];
    var c = P(a[0], a[1], a[2]); cx = c[0]; cy = c[1]; w = x.id === "shadow" ? 380 : 170;
  } else {
    CUR.place = PLACES[pid];
    var c2 = P(f[0], f[1], f[2]); cx = c2[0]; cy = c2[1]; w = f[3];
  }
  w = Math.min(800, w); var hgt = w * 0.75;
  cx = Math.max(w / 2, Math.min(800 - w / 2, cx)); cy = Math.max(hgt / 2, Math.min(500 - hgt / 2, cy));
  return scene(4, id, false, "ph" + id, { place: pid, lite: true, vb: (cx - w / 2).toFixed(0) + " " + (cy - hgt / 2).toFixed(0) + " " + w.toFixed(0) + " " + hgt.toFixed(0) });
}
function lazyPhotos(p){
  var list = [].slice.call(p.querySelectorAll("[data-ph]"));
  function fill(e){ if(e.querySelector("svg")) return; try{ e.insertAdjacentHTML("afterbegin", photo(e.getAttribute("data-ph"))); }catch(err){} }
  if(!window.IntersectionObserver){ list.forEach(fill); return; }
  var io = new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ fill(en.target); io.unobserve(en.target); } }); }, { root: p, rootMargin: "200px" });
  list.forEach(function(e){ io.observe(e); });
}
function badgeSVG(){
  var b = store.badge === "gold" && has("b_gold") ? "gold" : store.badge === "glow" && has("b_glow") ? "glow" : "lam";
  var bg = b === "gold" ? "#e6c84a" : b === "glow" ? "#173a26" : "#fbf8e4", ink = b === "glow" ? "#5dff9b" : "#0e0f0b";
  var bars = "";
  for(var i = 0; i < 22; i++) bars += '<rect x="' + (24 + i * 4.2).toFixed(1) + '" y="196" width="' + (hh(i + store.clocked) < 0.5 ? 1.6 : 3) + '" height="18" fill="' + ink + '" opacity=".75"/>';
  return '<svg viewBox="0 0 240 240" role="img" aria-label="Night shift ID badge, rank ' + rank(store.clocked) + '">' +
    (b === "glow" ? '<rect x="8" y="22" width="224" height="210" rx="16" fill="#5dff9b" opacity=".18"/>' : '') +
    '<rect x="100" y="0" width="40" height="30" rx="4" fill="#4a4836"/><rect x="108" y="8" width="24" height="10" rx="3" fill="#1b1c16"/>' +
    '<rect x="14" y="26" width="212" height="200" rx="12" fill="' + bg + '" stroke="#0e0f0b" stroke-width="4"/>' +
    '<rect x="14" y="26" width="212" height="34" rx="12" fill="' + (b === "glow" ? "#5dff9b" : "#1b1c16") + '"/><rect x="14" y="48" width="212" height="12" fill="' + (b === "glow" ? "#5dff9b" : "#1b1c16") + '"/>' +
    txt(120, 50, 15, b === "glow" ? "#0e0f0b" : "#e6d84a", "NIGHT SHIFT", ' letter-spacing="3"') +
    '<rect x="26" y="72" width="72" height="88" rx="4" fill="#2a2a22"/><circle cx="62" cy="104" r="17" fill="#6d6a52"/><path d="M32 160q0 -34 30 -34q30 0 30 34z" fill="#6d6a52"/>' +
    '<path d="M74 132l18 -10v20z" fill="#fff2c0" opacity=".7"/>' +
    txt(162, 96, 30, ink, "LC", ' font-family="Space Mono,Courier New,monospace"') +
    txt(162, 118, 11, ink, rank(store.clocked).toUpperCase()) +
    txt(162, 142, 10, ink, "SHIFTS: " + store.clocked, "", 400) +
    txt(162, 158, 10, ink, "BUILDING: ALL", "", 400) +
    (b === "gold" ? '<circle cx="196" cy="186" r="14" fill="#fff6c0" stroke="#8a6a1a" stroke-width="2"/><path d="M196 177l3 6l6 1l-4 4l1 6l-6 -3l-6 3l1 -6l-4 -4l6 -1z" fill="#8a6a1a"/>' : '') +
    bars + '</svg>';
}

/* ---------- something new unlocked since last time ---------- */
function celebrate(then){
  var seenU = store.unl || [], fresh = LD.have.filter(function(x){ return seenU.indexOf(x.id) < 0; });
  if(!fresh.length){ then(); return; }
  store.unl = LD.have.map(function(x){ return x.id; }); save();
  var more = fresh.length > 3 ? fresh.length - 3 : 0;
  var c = card('<h3>New on the night shift</h3>' + fresh.slice(-3).reverse().map(function(x){
      return '<div class="lcc-ki lcc-new" style="margin:8px 0;text-align:left;background:#1b1c16;color:#fbf8e4">' + icon(x.kind, x.ref) + '<div><b>' + esc(x.name) + '</b><span>' + esc(x.d) + '</span></div></div>';
    }).join("") + '<p class="sm">' + (more ? "And " + more + " more. " : "") + 'Find them in the shift menu.</p>', [{ t: "Nice", fn: then }]);
  tone(660, 990, 0.5, 0.05, "triangle");
  return c;
}

/* ---------- taps on the picture ---------- */
function tapped(id){
  if(id === "bird"){ chirp(); store.birds = (store.birds || 0) + 1; save(); if(!secret("birdy")) say("Tweet.", 1200); return; }
  if(id === "note"){
    if(odd === "notice") return;
    var line = SAYINGS[Math.floor(Math.random() * SAYINGS.length)];
    var first = !store.sec.note;
    if(first){ store.sec.note = Date.now(); save(); }
    card('<div style="background:#fff9c4;border:1px solid #c9b23a;padding:14px 12px;transform:rotate(-2deg);font-family:Segoe Print,Bradley Hand,Comic Sans MS,cursive;font-size:1.1rem;line-height:1.4;box-shadow:0 3px 0 rgba(0,0,0,.2)">' +
      'Night shift,<br>' + esc(line) + '<br><span style="float:right">Jay</span><br></div>' + (first ? '<p class="sm">Secret found: A note from Jay.</p>' : '<p class="sm">Tucked behind the fire drill notice.</p>'),
      [{ t: "Put it back" }]);
    return;
  }
  if(id === "mug"){ if(!secret("mug")) say("Jay's mug. Still warm.", 1800); return; }
}

/* ---------- open and close ---------- */
function open(){
  if(root) return;
  load(); refreshLadder();
  root = el("div", "lccorr");
  root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", "Night Corridor");
  root.innerHTML =
    '<div class="lcc-top"><span style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;min-width:0"><h2>Night Corridor</h2><span class="lcc-f"></span></span>' +
      '<span style="display:flex;gap:6px"><button type="button" class="lcc-tb lcc-menu-b">Menu</button><button type="button" class="lcc-tb lcc-snd"></button><button type="button" class="lcc-tb lcc-x">Leave</button></span></div>' +
    '<div class="lcc-stage lcc-body"><div class="lcc-view"><div class="lcc-scene"></div><div class="lcc-uv" hidden></div><div class="lcc-dark"></div><p class="lcc-msg" aria-live="polite" hidden></p></div>' +
      '<div class="lcc-pane lcc-hubp" hidden></div><div class="lcc-pane lcc-scr" hidden></div></div>' +
    '<div class="lcc-bar"></div>';
  document.body.appendChild(root);
  document.documentElement.style.overflow = "hidden";
  bar();
  $(".lcc-x").onclick = close;
  $(".lcc-menu-b").onclick = function(){ if(busy && $(".lcc-card")) return; if(run){ run = null; odd = null; radioOff(); draw(false); } $(".lcc-scr").hidden = true; hub(true); };
  $(".lcc-snd").onclick = function(){ store.sound = !store.sound; save(); if(store.sound){ humOn(); if(run) radioOn(); } else { humOff(); radioOff(); } $(".lcc-snd").textContent = store.sound ? "Sound on" : "Sound off"; };
  var v = $(".lcc-view");
  function aim(e){
    var r = v.getBoundingClientRect(), p = e.touches ? e.touches[0] : e;
    if(!p || !r.width) return;
    tor.x = Math.max(0, Math.min(1, (p.clientX - r.left) / r.width));
    tor.y = Math.max(0, Math.min(1, (p.clientY - r.top) / r.height));
    torchPaint();
  }
  v.addEventListener("pointermove", aim);
  v.addEventListener("pointerdown", aim);
  v.addEventListener("touchmove", aim, { passive: true });
  v.addEventListener("click", function(e){
    var t = e.target && e.target.closest ? e.target.closest("[data-tap]") : null;
    if(t && !$(".lcc-card")) tapped(t.getAttribute("data-tap"));
  });
  window.addEventListener("resize", torchPaint);
  keyH = function(e){
    if(!root) return;
    if(e.key === "Escape"){
      var sc = $(".lcc-scr");
      if(sc && !sc.hidden){ sc.hidden = true; hub(true); return; }
      close(); return;
    }
    if(e.key === "a" || e.key === "A" || e.key === "ArrowLeft"){ tor.x = Math.max(0, tor.x - 0.08); torchPaint(); }
    if(e.key === "d" || e.key === "D" || e.key === "ArrowRight"){ tor.x = Math.min(1, tor.x + 0.08); torchPaint(); }
    if(busy || !run || !$(".lcc-hubp").hidden) return;
    if(e.key === "ArrowUp" || e.key === "w" || e.key === "W"){ e.preventDefault(); choose(false); }
    if(e.key === "ArrowDown" || e.key === "s" || e.key === "S"){ e.preventDefault(); choose(true); }
  };
  document.addEventListener("keydown", keyH);
  run = null; odd = null; busy = false; tor.x = 0.5; tor.y = 0.5;
  draw(false);
  humOn();
  hub(true);
  celebrate(function(){ hub(true); });
}
function close(){
  if(!root) return;
  humOff(); radioOff();
  document.removeEventListener("keydown", keyH);
  window.removeEventListener("resize", torchPaint);
  root.remove(); root = null; run = null; odd = null; busy = false;
  document.documentElement.style.overflow = "";
}
window.LCCorridor = { open: open, close: close, scene: scene, ODD: ODD, LADDER: LADDER, SECRETS: SECRETS };
/* testing only (?hqtest): peek at what is different on this floor */
if(G && G.test) window.LCCorridor.peek = function(){ return { odd: odd, floor: run ? run.floor : -1, busy: busy, uv: UVSPOT }; };
})();
