/* ==========================================================
   LC's Night Shift HQ - Night Corridor
   LC's HQ game. The building after hours: one long corridor that
   keeps looping. Walk it. If anything is different from normal,
   turn back. If nothing has changed, keep walking. Eight right
   calls in a row and you clock off at Floor 8. One wrong call and
   it is back to Floor 0.

   Spooky, never gory. No sudden loud noises (LC has the jumpscare
   button for those). Everything is drawn in code. Sound can be
   turned off. Arrow keys or W and S also work.

   Any page:  window.LCCorridor.open() / .close()
   The earned break around it is in /lc/break.js (/data/hqbreak.js).
   Saves { best, runs, clocked, sound, seen } in b5.lc.corridor.v1.
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(window.LCCorridor) return;

var KEY = "b5.lc.corridor.v1";
var GOAL = 8;
var CHANCE = 0.55;          /* how often a corridor has something wrong in it */
var RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

var store = { best: 0, runs: 0, clocked: 0, sound: true, seen: {} };
function load(){ try{ var o = JSON.parse(localStorage.getItem(KEY) || "null"); if(o && typeof o === "object") for(var k in store) if(o[k] !== undefined) store[k] = o[k]; }catch(e){} if(!store.seen || typeof store.seen !== "object") store.seen = {}; }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(store)); }catch(e){} }
load();

/* ---------- the things that can be different ----------
   Each one names what was wrong, so a right call teaches you to look. */
var ODD = [
  { id: "light",   say: "One of the strip lights was out." },
  { id: "clock",   say: "The clock had thirteen on it." },
  { id: "exit",    say: "The exit sign was spelled backwards." },
  { id: "door",    say: "The door on the left was open a crack, and the light was on." },
  { id: "ext",     say: "The fire extinguisher had gone." },
  { id: "steps",   say: "There were wet footprints on the floor." },
  { id: "figure",  say: "Someone was standing at the far end." },
  { id: "plaque",  say: "The floor sign showed the wrong floor." },
  { id: "poster",  say: "The poster was upside down." },
  { id: "notice",  say: "The notice said TURN BACK." },
  { id: "bonnie",  say: "Bonnie was in the corridor. She is not on the night shift." },
  { id: "extra",   say: "There was an extra door on the right." },
  { id: "wet",     say: "The sign said DRY FLOOR." },
  { id: "paper",   say: "The wallpaper had gone red." },
  { id: "bird",    say: "There was a bird on the light. Jay would have liked that one." }
];

/* ---------- drawing ----------
   A real one point perspective corridor. World units: the walls are
   at x = -1 and x = 1, the floor is y = 0, the ceiling y = CEIL and
   the eye is at EYE, looking down +z. P() turns a world point into
   a point on the 800 x 500 picture. Every wall slice, floor tile and
   ceiling tile is shaded by how near it is to a working strip light,
   and things get darker the further away they are. Doors, signs and
   posters are drawn flat and then laid onto the wall, so they line
   up with the corridor instead of floating on it.
   LCCorridor.scene(floor, odd, reveal, idp) also draws the corridor
   behind LC's home page greeting (/lc/night.js). */
var W = 800, H = 500, CX = 400, CY = 226, F = 380;
var EYE = 1.42, CEIL = 2.3, NZ = 0.5, FZ = 5.6, DH = 1.95;
var LIGHTZ = [1.25, 2.45, 3.65, 4.85];

function P(x, y, z){ return [CX + F * x / z, CY - F * (y - EYE) / z]; }
function pt(p){ return p[0].toFixed(1) + "," + p[1].toFixed(1); }
function poly(pts, fill, extra){ return '<polygon points="' + pts.map(pt).join(" ") + '" fill="' + fill + '"' + (extra || "") + '/>'; }
/* a rectangle on a side wall (s = -1 left, 1 right) between depths za..zb and heights ya..yb */
function wallQ(s, za, zb, ya, yb){ return [P(s, ya, za), P(s, yb, za), P(s, yb, zb), P(s, ya, zb)]; }
function floorQ(xa, xb, za, zb, y){ y = y || 0; return [P(xa, y, za), P(xb, y, za), P(xb, y, zb), P(xa, y, zb)]; }

/* colour helpers */
function rgb(h){ return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
function hex(c){ return "#" + c.map(function(v){ v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? "0" : "") + v.toString(16); }).join(""); }
function shade(h, k){
  /* k below 1 darkens; above 1 warms towards the colour of the strip lights */
  var c = rgb(h), warm = [255, 240, 190];
  if(k <= 1) return hex(c.map(function(v){ return v * k; }));
  var t = Math.min(1, (k - 1) * 1.6);
  return hex(c.map(function(v, i){ return v + (warm[i] - v) * t * 0.5; }));
}
/* how lit a point at depth z is: a little ambient, a pool under each working light, darker further away */
function lit(z, lights){
  var k = 0.26;
  for(var i = 0; i < LIGHTZ.length; i++) if(lights[i]){ var d = z - LIGHTZ[i]; k += 0.78 * Math.exp(-(d * d) / 0.62); }
  return Math.min(1.12, k) * (1 - 0.42 * Math.min(1, z / FZ));
}

/* lay a flat drawing onto a side wall. Local units are centimetres, centred on (zc, yc);
   +x reads left to right as you look at that wall, +y goes down */
function onWall(s, zc, yc, svg){
  var a = F / (zc * zc) * 0.01, b = F * (yc - EYE) / (zc * zc) * -s * 0.01, d = F / zc * 0.01, p = P(s, yc, zc);
  return '<g transform="matrix(' + [a, b, 0, d, p[0], p[1]].map(function(v){ return +v.toFixed(4); }).join(" ") + ')">' + svg + '</g>';
}
/* stand a flat drawing up in the corridor, facing you, feet at (x, y, z). cm units, origin at its feet */
function standUp(x, y, z, svg, unit){
  var p = P(x, y, z), k = F / z * (unit || 0.01);
  return '<g transform="translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ') scale(' + k.toFixed(4) + ')">' + svg + '</g>';
}
function txt(x, y, size, fill, s, extra, weight){
  return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="' + (weight || 700) + '" font-size="' + size + '" fill="' + fill + '"' + (extra || "") + '>' + s + '</text>';
}

function scene(floor, odd, reveal, idp){
  idp = idp || "lcc";
  var o = function(id){ return odd === id; };
  var hi = function(id, svg){ return reveal && o(id) ? '<g class="lcc-hi">' + svg + '</g>' : svg; };
  var lights = LIGHTZ.map(function(z, i){ return !(i === 1 && o("light")); });
  var red = o("paper");
  var PAPER_A = red ? "#8a2c26" : "#b8a45c", PAPER_B = red ? "#782420" : "#ab9752";
  var LOW = red ? "#4e1a17" : "#6f6440", RAIL = "#4a3f28", SKIRT = "#2c271b";
  var TILE_A = "#77725f", TILE_B = "#6a6553", CEIL_A = "#d9d4b8", CEIL_B = "#cfc9ad";
  var s = "", z, i, j, k;

  s += '<svg viewBox="0 0 ' + W + ' ' + H + '" class="lcc-svg" role="img" aria-label="A long corridor at night, Floor ' + floor + '">' +
    '<defs>' +
      '<radialGradient id="' + idp + 'Pool"><stop offset="0" stop-color="#fff6c8" stop-opacity=".5"/><stop offset=".55" stop-color="#fff2b0" stop-opacity=".16"/><stop offset="1" stop-color="#fff2b0" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + idp + 'Glow"><stop offset="0" stop-color="#fffbe0" stop-opacity=".75"/><stop offset="1" stop-color="#fff6c0" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + idp + 'Exit"><stop offset="0" stop-color="#5dff9b" stop-opacity=".55"/><stop offset="1" stop-color="#5dff9b" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + idp + 'Vig" cx="50%" cy="46%" r="72%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></radialGradient>' +
      '<linearGradient id="' + idp + 'Spill" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe98a" stop-opacity=".55"/><stop offset="1" stop-color="#ffe98a" stop-opacity="0"/></linearGradient>' +
      '<clipPath id="' + idp + 'Floor"><polygon points="' + floorQ(-1, 1, NZ, FZ).map(pt).join(" ") + '"/></clipPath>' +
      '<linearGradient id="' + idp + 'Wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4c4" stop-opacity=".14"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>' +
    '</defs>' +
    '<rect width="800" height="500" fill="#14130e"/>';

  /* ceiling tiles */
  var cz = [NZ, 0.9, 1.5, 2.1, 2.7, 3.3, 3.9, 4.5, 5.1, FZ];
  for(i = 0; i < cz.length - 1; i++){
    k = lit((cz[i] + cz[i + 1]) / 2, lights) * 0.95;
    for(j = 0; j < 4; j++){
      var xa = -1 + j * 0.5;
      s += poly(floorQ(xa, xa + 0.5, cz[i], cz[i + 1], CEIL), shade((i + j) % 2 ? CEIL_A : CEIL_B, k), ' stroke="' + shade("#8f8a72", k) + '" stroke-width="1"');
    }
  }

  /* floor tiles, checked, with dark grout */
  var fz = [NZ];
  for(z = 0.75; z < FZ; z += 0.42) fz.push(z);
  fz.push(FZ);
  for(i = 0; i < fz.length - 1; i++){
    k = lit((fz[i] + fz[i + 1]) / 2, lights) * 0.92;
    for(j = 0; j < 4; j++){
      var fx = -1 + j * 0.5;
      s += poly(floorQ(fx, fx + 0.5, fz[i], fz[i + 1]), shade((i + j) % 2 ? TILE_A : TILE_B, k), ' stroke="' + shade("#3a372c", k) + '" stroke-width="1.2"');
    }
  }

  /* the two side walls in thin slices, so the light can fall along them */
  [-1, 1].forEach(function(sd){
    var side = sd < 0 ? 0.9 : 1, n = 0;
    for(z = NZ; z < FZ - 0.001; z += 0.2){
      var z2 = Math.min(FZ, z + 0.2), kk = lit((z + z2) / 2, lights) * side;
      s += poly(wallQ(sd, z, z2, 0.98, CEIL), shade(n % 2 ? PAPER_A : PAPER_B, kk));
      s += poly(wallQ(sd, z, z2, 0.14, 0.92), shade(LOW, kk));
      s += poly(wallQ(sd, z, z2, 0.92, 0.98), shade(RAIL, kk));
      s += poly(wallQ(sd, z, z2, 0, 0.14), shade(SKIRT, kk));
      n++;
    }
    /* soft light from above, shadow near the floor */
    s += poly(wallQ(sd, NZ, FZ, 0, CEIL), "url(#" + idp + "Wall)");
    /* coving where the wall meets the ceiling */
    s += poly(wallQ(sd, NZ, FZ, CEIL - 0.05, CEIL), "#000", ' opacity=".18"');
  });

  /* far wall: fire doors under the far light */
  var kf = lit(FZ, lights);
  s += poly([P(-1, 0, FZ), P(-1, CEIL, FZ), P(1, CEIL, FZ), P(1, 0, FZ)], shade(PAPER_B, kf * 0.85));
  s += poly([P(-1, 0, FZ), P(-1, 0.92, FZ), P(1, 0.92, FZ), P(1, 0, FZ)], shade(LOW, kf * 0.85));
  s += poly([P(-0.62, 0, FZ), P(-0.62, 1.95, FZ), P(0.62, 1.95, FZ), P(0.62, 0, FZ)], shade("#2a241a", 1));
  s += poly([P(-0.56, 0, FZ), P(-0.56, 1.89, FZ), P(-0.01, 1.89, FZ), P(-0.01, 0, FZ)], shade("#6a5233", kf));
  s += poly([P(0.01, 0, FZ), P(0.01, 1.89, FZ), P(0.56, 1.89, FZ), P(0.56, 0, FZ)], shade("#6a5233", kf));
  s += poly([P(-0.4, 1.15, FZ), P(-0.4, 1.6, FZ), P(-0.16, 1.6, FZ), P(-0.16, 1.15, FZ)], "#1c2a2c");
  s += poly([P(0.16, 1.15, FZ), P(0.16, 1.6, FZ), P(0.4, 1.6, FZ), P(0.4, 1.15, FZ)], "#1c2a2c");
  s += poly([P(-0.5, 0.95, FZ), P(-0.5, 1.0, FZ), P(0.5, 1.0, FZ), P(0.5, 0.95, FZ)], "#b9b4a0");

  /* someone standing at the far end */
  if(o("figure")) s += hi("figure", '<g class="lcc-fig">' + standUp(0.32, 0, FZ - 0.25,
    '<ellipse cx="0" cy="-4" rx="30" ry="6" fill="#000" opacity=".4"/>' +
    '<path d="M-22 0 L-19 -84 Q-24 -128 -15 -138 L15 -138 Q24 -128 19 -84 L22 0 Z" fill="#0b0b09"/>' +
    '<ellipse cx="0" cy="-154" rx="13" ry="16" fill="#0b0b09"/><rect x="-6" y="-142" width="12" height="8" fill="#0b0b09"/>') + '</g>');

  /* light pools on the floor and their shine */
  s += '<g clip-path="url(#' + idp + 'Floor)">';
  LIGHTZ.forEach(function(lz, li){
    if(!lights[li]) return;
    var c = P(0, 0, lz), rx = F * 1.15 / lz, ry = F * EYE * 0.9 / (lz * lz);
    s += '<ellipse cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" rx="' + rx.toFixed(1) + '" ry="' + ry.toFixed(1) + '" fill="url(#' + idp + 'Pool)"/>';
    var r = P(0, 0, lz + 0.9);
    s += '<ellipse cx="' + r[0].toFixed(1) + '" cy="' + r[1].toFixed(1) + '" rx="' + (F * 0.3 / lz).toFixed(1) + '" ry="' + (F * EYE * 0.3 / ((lz + 0.9) * (lz + 0.9))).toFixed(1) + '" fill="#fffbe0" opacity=".1"/>';
  });

  s += '</g>';

  /* wet footprints walking away from you */
  if(o("steps")){
    var st = "";
    for(i = 0; i < 9; i++){
      var sz = 1.0 + i * 0.45, sx = i % 2 ? 0.12 : -0.12, c2 = P(sx, 0, sz);
      st += '<ellipse cx="' + c2[0].toFixed(1) + '" cy="' + c2[1].toFixed(1) + '" rx="' + (F * 0.055 / sz).toFixed(1) + '" ry="' + (F * EYE * 0.13 / (sz * sz)).toFixed(1) + '" fill="#18242a" opacity=".62"/>';
    }
    s += hi("steps", st);
  }

  /* LEFT WALL: floor sign, door B12 (sometimes open), poster, fire extinguisher, a far door */
  s += hi("plaque", onWall(-1, 1.36, 1.6,
    '<rect x="-24" y="-15" width="48" height="30" rx="3" fill="#1f2a22" stroke="#cfc9a6" stroke-width="2.5"/>' +
    txt(0, -4, 7.5, "#cfc9a6", "FLOOR") + txt(0, 11.5, 14, "#fbf8e4", (o("plaque") ? (floor + 3) % 9 : floor))));
  s += hi("door", door(-1, 1.62, 2.32, o("door"), "B12", idp, lights));
  s += hi("poster", onWall(-1, 2.78, 1.38,
    '<rect x="-24" y="-32" width="48" height="64" fill="#efe6c8" stroke="#3b3a30" stroke-width="2.5"/>' +
    '<g' + (o("poster") ? ' transform="rotate(180)"' : '') + '><circle cx="0" cy="-12" r="11" fill="#e0b84a"/><path d="M-6 -10q6 6 12 0" stroke="#3b3a30" stroke-width="2.2" fill="none"/>' +
    '<circle cx="-4" cy="-15" r="1.8" fill="#3b3a30"/><circle cx="4" cy="-15" r="1.8" fill="#3b3a30"/>' +
    txt(0, 14, 10, "#3b3a30", "SMILE") + txt(0, 25, 6.5, "#3b3a30", "IT IS LATE") + '</g>'));
  s += o("ext") ? hi("ext", onWall(-1, 3.3, 0.8, '<rect x="-9" y="-4" width="18" height="5" fill="#2a2920"/><rect x="-9" y="1" width="18" height="40" fill="#000" opacity=".12"/>')) :
    onWall(-1, 3.3, 0.8, '<rect x="-9" y="-4" width="18" height="5" fill="#2a2920"/>' +
      '<rect x="-8" y="6" width="16" height="44" rx="6" fill="#c8262a"/><rect x="-4" y="-4" width="8" height="12" fill="#2a2920"/>' +
      '<path d="M4 2h9v10" stroke="#2a2920" stroke-width="2.5" fill="none"/><rect x="-6" y="20" width="12" height="9" fill="#f3f0e2"/><rect x="-6" y="8" width="3" height="40" fill="#fff" opacity=".22"/>');
  s += door(-1, 3.85, 4.45, false, "B14", idp, lights);

  /* RIGHT WALL: clock, notice board, a door, sometimes an extra door */
  s += hi("clock", onWall(1, 1.5, 1.86, clock(o("clock"))));
  s += hi("notice", onWall(1, 2.6, 1.42,
    '<rect x="-36" y="-26" width="72" height="52" fill="#8a6a3e" stroke="#4a3820" stroke-width="3"/>' +
    '<rect x="-28" y="-18" width="34" height="24" fill="#fffbe8"/><rect x="10" y="-14" width="18" height="30" fill="#ffe08a"/><rect x="-24" y="10" width="26" height="10" fill="#cfe6f2"/>' +
    txt(-11, -8, o("notice") ? 8.5 : 7, o("notice") ? "#b3261e" : "#3b3a30", o("notice") ? "TURN" : "FIRE") +
    txt(-11, 2, o("notice") ? 8.5 : 7, o("notice") ? "#b3261e" : "#3b3a30", o("notice") ? "BACK" : "DRILL")));
  if(o("extra")) s += hi("extra", door(1, 3.05, 3.55, false, "", idp, lights));
  s += door(1, 3.95, 4.55, false, "B15", idp, lights);

  /* ceiling strip lights, hanging a little below the ceiling */
  LIGHTZ.forEach(function(lz, li){ s += lamp(lz, lights[li], li === 2, idp); });
  if(o("bird")) s += hi("bird", standUp(0.18, CEIL - 0.1, LIGHTZ[1] - 0.2,
    '<g transform="translate(0 -12)"><ellipse cx="0" cy="0" rx="14" ry="10" fill="#3a8fd6"/><circle cx="11" cy="-7" r="8" fill="#3a8fd6"/><path d="M18 -8l8 3-8 3z" fill="#f2a516"/>' +
    '<circle cx="13" cy="-9" r="1.8" fill="#111"/><path d="M-12 2l-11-4 4 8z" fill="#2f78b8"/><path d="M-2 9v4M4 9v4" stroke="#f2a516" stroke-width="2"/></g>'));

  /* the exit sign hangs from the ceiling near the far end */
  var ez = 4.3, e1 = P(-0.3, CEIL, ez), e2 = P(0.3, CEIL, ez);
  s += '<line x1="' + e1[0].toFixed(1) + '" y1="' + e1[1].toFixed(1) + '" x2="' + e1[0].toFixed(1) + '" y2="' + P(-0.3, 2.13, ez)[1].toFixed(1) + '" stroke="#2a2920" stroke-width="1.5"/>' +
       '<line x1="' + e2[0].toFixed(1) + '" y1="' + e2[1].toFixed(1) + '" x2="' + e2[0].toFixed(1) + '" y2="' + P(0.3, 2.13, ez)[1].toFixed(1) + '" stroke="#2a2920" stroke-width="1.5"/>';
  var ec = P(0, 2.03, ez);
  s += '<ellipse cx="' + ec[0].toFixed(1) + '" cy="' + ec[1].toFixed(1) + '" rx="' + (F * 0.75 / ez).toFixed(1) + '" ry="' + (F * 0.38 / ez).toFixed(1) + '" fill="url(#' + idp + 'Exit)" class="lcc-glow"/>';
  s += hi("exit", standUp(0, 1.93, ez,
    '<rect x="-34" y="-22" width="68" height="22" rx="2" fill="#123c22" stroke="#0a1a10" stroke-width="2"/>' +
    txt(0, -6, 15, "#5dff9b", o("exit") ? "TIXE" : "EXIT", ' class="lcc-glow"')));

  /* the wet floor sign */
  s += hi("wet", standUp(0.56, 0, 2.25,
    '<ellipse cx="0" cy="0" rx="30" ry="5" fill="#000" opacity=".35"/>' +
    '<path d="M-26 0 L-12 -64 L12 -64 L26 0 L19 0 L9 -54 L-9 -54 L-19 0 Z" fill="#f2c916" stroke="#2a2920" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<path d="M-21 -2 L-10 -56 L10 -56 L21 -2 Z" fill="#f7d42a"/>' +
    '<path d="M-6 -46 l6 -8 l6 8 z" fill="none" stroke="#2a2920" stroke-width="2"/>' +
    txt(0, -30, 9, "#2a2920", o("wet") ? "DRY" : "WET") + txt(0, -19, 8, "#2a2920", "FLOOR") +
    '<path d="M-9 -8 q4 -6 9 -3 q5 -5 9 1" stroke="#2a2920" stroke-width="2" fill="none"/>'));

  /* Bonnie, sitting in the corridor where she should not be */
  if(o("bonnie")) s += hi("bonnie", standUp(-0.32, 0, 2.6,
    '<g transform="translate(0 -51)">' + (window.A2ART ? A2ART.bonnie(0, 0, 1, "sit") : '<ellipse cx="0" cy="16" rx="24" ry="26" fill="#9c6b45"/><circle cx="0" cy="-26" r="18" fill="#a87650"/>') + '</g>', 0.005));

  /* everything fades into the dark at the edges */
  s += '<rect width="800" height="500" fill="url(#' + idp + 'Vig)" pointer-events="none"/>';
  return s + '</svg>';
}

/* a door in a side wall: frame, leaf with two panels, handle, number plate. open = lit room behind */
function door(sd, za, zb, open, label, idp, lights){
  var k = lit((za + zb) / 2, lights), out = "";
  /* frame */
  out += poly(wallQ(sd, za - 0.07, zb + 0.07, 0, DH + 0.08), shade("#3a2c1b", k));
  /* the opening's side, so the door sits back in the wall */
  var inner = sd * 1.06;
  out += poly([P(sd, 0, zb), P(sd, DH, zb), P(inner, DH, zb), P(inner, 0, zb)], shade("#2b2015", k));
  /* open a crack: a bright gap at the near side, the leaf pushed in a little, light on the floor */
  var lz0 = open ? za + (zb - za) * 0.4 : za, lin = inner;
  if(open){
    out += poly([P(inner, 0, za), P(inner, DH, za), P(inner, DH, zb), P(inner, 0, zb)], "#ffe98a");
    out += poly([P(sd, 0, za - 0.05), P(sd, 0, lz0), P(sd * 0.3, 0, lz0 + 0.5), P(sd * 0.5, 0, za)], "#ffe98a", ' opacity=".28"');
  }
  out += poly([P(lin, 0, lz0), P(lin, DH, lz0), P(lin, DH, zb), P(lin, 0, zb)], shade("#5e4730", k * (open ? 0.85 : 1)));
  var u = function(f){ return lz0 + (zb - lz0) * f; };
  out += poly([P(lin, 1.05, u(0.15)), P(lin, 1.78, u(0.15)), P(lin, 1.78, u(0.85)), P(lin, 1.05, u(0.85))], shade("#523e29", k), ' stroke="' + shade("#3a2c1b", k) + '" stroke-width="1.2"');
  out += poly([P(lin, 0.16, u(0.15)), P(lin, 0.9, u(0.15)), P(lin, 0.9, u(0.85)), P(lin, 0.16, u(0.85))], shade("#523e29", k), ' stroke="' + shade("#3a2c1b", k) + '" stroke-width="1.2"');
  out += poly([P(lin, 0.02, u(0.04)), P(lin, 0.12, u(0.04)), P(lin, 0.12, u(0.96)), P(lin, 0.02, u(0.96))], shade("#8d8a7c", k));
  var hz = u(open ? 0.12 : 0.88), hp = P(lin, 1.0, hz), hr = F * 0.035 / hz;
  out += '<ellipse cx="' + hp[0].toFixed(1) + '" cy="' + hp[1].toFixed(1) + '" rx="' + (hr * 0.75).toFixed(1) + '" ry="' + hr.toFixed(1) + '" fill="' + shade("#d8c27a", k) + '" stroke="#2a2010" stroke-width=".8"/>';
  /* the near side of the frame and its head sit in front of the leaf */
  out += poly(wallQ(sd, za - 0.07, za + 0.01, 0, DH + 0.08), shade("#3a2c1b", k));
  out += poly(wallQ(sd, za - 0.07, zb + 0.07, DH, DH + 0.08), shade("#3a2c1b", k));
  if(label) out += onWall(sd, (za + zb) / 2, DH + 0.2, '<rect x="-18" y="-8" width="36" height="16" rx="2" fill="#1f2a22" stroke="#9e987a" stroke-width="1.5"/>' + txt(0, 4.5, 11, "#cfc9a6", label));
  return out;
}

/* a hanging strip light: diffuser underneath, metal edge, and a glow when it is on */
function lamp(lz, on, flick, idp){
  var y = CEIL - 0.1, za = lz - 0.24, zb = lz + 0.24, xa = -0.36, xb = 0.36, out = "";
  var rod1 = P(-0.25, CEIL, lz), rod1b = P(-0.25, y, lz), rod2 = P(0.25, CEIL, lz), rod2b = P(0.25, y, lz);
  out += '<path d="M' + pt(rod1) + 'L' + pt(rod1b) + 'M' + pt(rod2) + 'L' + pt(rod2b) + '" stroke="#55534a" stroke-width="1.2"/>';
  if(on){
    var c = P(0, y, lz);
    out += '<ellipse cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" rx="' + (F * 0.95 / lz).toFixed(1) + '" ry="' + (F * 0.42 / lz).toFixed(1) + '" fill="url(#' + idp + 'Glow)"' + (flick ? ' class="lcc-flick"' : '') + '/>';
  }
  out += poly([P(xa, y, za), P(xb, y, za), P(xb, y, zb), P(xa, y, zb)], on ? "#fffbe6" : "#4e4d44", flick && on ? ' class="lcc-flick"' : '');
  /* the metal front edge you can see from below */
  out += poly([P(xa, y, za), P(xb, y, za), P(xb, y + 0.05, za), P(xa, y + 0.05, za)], on ? "#9c9a8a" : "#3e3d36");
  return out;
}

function clock(odd){
  var nums = "";
  for(var n = 1; n <= 12; n++){
    var a = (n / 12) * Math.PI * 2, lab = odd && n === 12 ? 13 : n;
    nums += txt((Math.sin(a) * 15.5).toFixed(1), (-Math.cos(a) * 15.5 + 2.6).toFixed(1), lab > 9 ? 6 : 7, "#2a2920", lab, "", 700);
  }
  return '<circle r="22" fill="#fffbe8" stroke="#2a2920" stroke-width="3.5"/>' + nums +
    '<line x1="0" y1="0" x2="0" y2="-11" stroke="#2a2920" stroke-width="2.5" stroke-linecap="round"/><line x1="0" y1="0" x2="8" y2="3" stroke="#2a2920" stroke-width="2" stroke-linecap="round"/><circle r="2" fill="#c8262a"/>';
}

/* ---------- sound: a soft electrical hum and a footstep, never loud ---------- */
var ac = null, hum = null;
function audio(){
  if(!store.sound) return null;
  try{ ac = ac || new (window.AudioContext || window.webkitAudioContext)(); }catch(e){ ac = null; }
  return ac;
}
function humOn(){
  var a = audio(); if(!a || hum) return;
  try{
    var o1 = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain();
    o1.type = "sawtooth"; o1.frequency.value = 50; o2.type = "sine"; o2.frequency.value = 100;
    g.gain.value = 0.012;
    o1.connect(g); o2.connect(g); g.connect(a.destination); o1.start(); o2.start();
    hum = { o1: o1, o2: o2, g: g };
  }catch(e){}
}
function humOff(){ if(hum){ try{ hum.o1.stop(); hum.o2.stop(); }catch(e){} hum = null; } }
function step(n){
  var a = audio(); if(!a) return;
  for(var i = 0; i < (n || 3); i++){
    (function(k){
      try{
        var t = a.currentTime + k * 0.22, b = a.createBufferSource(), buf = a.createBuffer(1, a.sampleRate * 0.08, a.sampleRate), d = buf.getChannelData(0);
        for(var j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / d.length, 3);
        var f = a.createBiquadFilter(), g = a.createGain();
        f.type = "lowpass"; f.frequency.value = 420; g.gain.value = 0.22;
        b.buffer = buf; b.connect(f); f.connect(g); g.connect(a.destination); b.start(t);
      }catch(e){}
    })(i);
  }
}
function chime(up){
  var a = audio(); if(!a) return;
  try{
    var o = a.createOscillator(), g = a.createGain(), t = a.currentTime;
    o.type = "triangle"; o.frequency.setValueAtTime(up ? 523 : 220, t); o.frequency.linearRampToValueAtTime(up ? 784 : 165, t + 0.25);
    g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + 0.55);
  }catch(e){}
}

/* ---------- the overlay ---------- */
var css = document.createElement("style");
css.textContent =
  "html body>.lccorr{position:fixed !important;inset:0;z-index:2147482900 !important}" /* above the corner buttons, below the break timer and calm screen */ +
  ".lccorr{background:#0b0c09;color:#fbf8e4;display:flex;flex-direction:column;font-family:var(--body,'Atkinson Hyperlegible',Verdana,sans-serif)}" +
  ".lcc-top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;flex-wrap:wrap}" +
  ".lcc-top h2{margin:0;font-family:var(--display,'Space Mono',monospace);font-size:1.15rem;letter-spacing:.02em}" +
  ".lcc-top .lcc-f{font-family:var(--display,'Space Mono',monospace);font-size:.95rem;color:#e6d84a}" +
  ".lcc-top button{font:inherit;font-size:.9rem;background:none;border:2px solid #6d6a52;color:#fbf8e4;border-radius:6px;padding:6px 12px;cursor:pointer}" +
  ".lcc-stage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:0 10px;overflow:hidden}" +
  ".lcc-view{width:min(100%,calc((100vh - 200px) * 1.6));max-width:980px;aspect-ratio:8/5;position:relative;border:3px solid #2a2920;border-radius:6px;overflow:hidden;box-shadow:0 0 60px rgba(230,216,74,.12)}" +
  ".lcc-svg{width:100%;height:100%;display:block}" +
  ".lcc-view.walk .lcc-svg{animation:lccwalk .5s ease-in both}" +
  ".lcc-view.back .lcc-svg{animation:lccback .5s ease-in both}" +
  "@keyframes lccwalk{0%{transform:scale(1)}100%{transform:scale(2.4);opacity:0}}" +
  "@keyframes lccback{0%{transform:scale(1)}100%{transform:scale(.4) rotate(-4deg);opacity:0}}" +
  "@media (prefers-reduced-motion:no-preference){.lcc-flick{animation:lccflick 5s steps(1) infinite}.lcc-glow{animation:lccglow 3s ease-in-out infinite alternate}.lcc-fig{animation:lccfig 6s ease-in-out infinite}}" +
  "@keyframes lccflick{0%,100%{opacity:1}41%{opacity:.35}43%{opacity:1}44%{opacity:.5}46%{opacity:1}}" +
  "@keyframes lccglow{from{opacity:.75}to{opacity:1}}" +
  "@keyframes lccfig{0%,100%{opacity:.85}50%{opacity:.6}}" +
  ".lcc-hi>*{filter:drop-shadow(0 0 6px #ff5c5c) drop-shadow(0 0 2px #ff5c5c)}" +
  ".lcc-msg{position:absolute;left:50%;top:10px;transform:translateX(-50%);width:max-content;max-width:92%;padding:8px 14px;border-radius:6px;background:rgba(14,15,11,.86);border:2px solid #e6d84a;font-size:.98rem;text-align:center}" +
  ".lcc-msg[hidden]{display:none}" +
  ".lcc-bar{display:flex;justify-content:center;gap:12px;padding:12px 14px 16px;flex-wrap:wrap}" +
  ".lcc-bar button{font-family:var(--display,'Space Mono',monospace);font-weight:700;font-size:1.05rem;min-width:170px;min-height:54px;border-radius:6px;cursor:pointer;border:3px solid #0e0f0b;box-shadow:0 5px 0 #000}" +
  ".lcc-back{background:#ff5c5c;color:#0e0f0b}.lcc-go{background:#39d98a;color:#0e0f0b}" +
  ".lcc-bar button:disabled{opacity:.5;cursor:default}" +
  ".lcc-card{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(5,6,4,.78);padding:16px}" +
  ".lcc-card>div{max-width:440px;background:#fbf8e4;color:#0e0f0b;border:4px solid #0e0f0b;border-radius:8px;padding:18px 18px 14px;text-align:center;box-shadow:0 8px 0 #000}" +
  ".lcc-card h3{margin:0 0 6px;font-family:var(--display,'Space Mono',monospace);font-size:1.35rem}" +
  ".lcc-card p{margin:6px 0;line-height:1.45}" +
  ".lcc-card button{margin-top:10px;font-family:var(--display,'Space Mono',monospace);font-weight:700;font-size:1.05rem;padding:10px 18px;border-radius:6px;border:3px solid #0e0f0b;background:#e6d84a;cursor:pointer;box-shadow:0 4px 0 #0e0f0b}" +
  ".lcc-dots{display:flex;gap:6px;justify-content:center}.lcc-dots i{width:12px;height:12px;border-radius:2px;border:2px solid #6d6a52}.lcc-dots i.on{background:#e6d84a;border-color:#e6d84a}" +
  "@media (max-width:560px){.lcc-bar button{min-width:44%;font-size:.95rem}.lcc-view{width:100%}}";
document.head.appendChild(css);

var root = null, floor = 0, odd = null, busy = false, keyH = null;
function el(t, c, h){ var e = document.createElement(t); if(c) e.className = c; if(h != null) e.innerHTML = h; return e; }
function dots(){ var h = ""; for(var i = 1; i <= GOAL; i++) h += '<i class="' + (i <= floor ? "on" : "") + '"></i>'; return '<span class="lcc-dots" aria-hidden="true">' + h + '</span>'; }
function pickOdd(){
  if(floor === 0) return null;               /* Floor 0 is always normal: learn it */
  if(Math.random() >= CHANCE) return null;
  var pool = ODD.filter(function(x){ return !(x.id === "bonnie" && Math.random() < 0.6); });
  return pool[Math.floor(Math.random() * pool.length)].id;
}
function draw(reveal){
  var v = root.querySelector(".lcc-view");
  v.querySelector(".lcc-scene").innerHTML = scene(floor, odd, reveal);
  root.querySelector(".lcc-f").innerHTML = "Floor " + floor + " " + dots();
  root.querySelector(".lcc-snd").textContent = store.sound ? "Sound on" : "Sound off";
}
function say(t){ var m = root.querySelector(".lcc-msg"); if(!t){ m.hidden = true; return; } m.hidden = false; m.textContent = t; }
function card(html, btn, then){
  var c = el("div", "lcc-card", "<div>" + html + "</div>");
  var b = el("button", "", btn); b.type = "button";
  b.onclick = function(){ c.remove(); busy = false; if(then) then(); };
  c.firstChild.appendChild(b);
  root.querySelector(".lcc-view").appendChild(c);
  busy = true;
  setTimeout(function(){ try{ b.focus(); }catch(e){} }, 30);
}
function next(){ odd = pickOdd(); draw(false); say(floor === 0 ? "Floor 0. This is what normal looks like. Have a good look round." : ""); }
function choose(back){
  if(busy) return;
  var wasOdd = !!odd, right = back === wasOdd, what = wasOdd ? ODD.filter(function(x){ return x.id === odd; })[0] : null;
  busy = true;
  step(back ? 2 : 3);
  if(!right){
    draw(true);
    chime(false);
    setTimeout(function(){
      store.runs++; save();
      var line = wasOdd ? "Something was different: " + what.say : "Nothing had changed. That was a normal corridor.";
      card("<h3>" + (wasOdd && odd === "figure" ? "It noticed you." : "Back to Floor 0") + "</h3><p>" + line + "</p>" +
        (wasOdd ? "<p style=\"font-size:.9rem\">It is lit up in red, if you want another look.</p>" : "") +
        "<p style=\"font-size:.9rem\">Best so far: Floor " + store.best + ".</p>", "Start again", function(){ floor = 0; next(); });
    }, RM ? 0 : 450);
    return;
  }
  if(wasOdd){ store.seen[odd] = 1; save(); }
  var v = root.querySelector(".lcc-view");
  v.classList.add(back ? "back" : "walk");
  setTimeout(function(){
    v.classList.remove("walk", "back");
    floor++;
    if(floor > store.best){ store.best = floor; }
    save();
    chime(true);
    if(floor >= GOAL){
      store.clocked++; save();
      draw(false);
      card("<h3>Clocked off.</h3><p>Floor " + GOAL + ". You found the way out of the night shift.</p><p style=\"font-size:.9rem\">You have clocked off " + store.clocked + " time" + (store.clocked === 1 ? "" : "s") + ". Things you have spotted: " + Object.keys(store.seen).length + " of " + ODD.length + ".</p>", "Go again", function(){ floor = 0; next(); });
      return;
    }
    busy = false;
    odd = pickOdd(); draw(false);
    say(wasOdd ? "Good spot. " + what.say : "Nothing different. Good.");
    setTimeout(function(){ if(root && !busy) say(""); }, 2600);
  }, RM ? 0 : 480);
}
function open(){
  if(root) return;
  root = el("div", "lccorr");
  root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", "Night Corridor");
  root.innerHTML =
    '<div class="lcc-top"><span style="display:flex;align-items:center;gap:14px;flex-wrap:wrap"><h2>Night Corridor</h2><span class="lcc-f"></span></span>' +
      '<span><button type="button" class="lcc-snd"></button> <button type="button" class="lcc-x">Leave</button></span></div>' +
    '<div class="lcc-stage"><div class="lcc-view"><div class="lcc-scene" style="width:100%;height:100%"></div><p class="lcc-msg" aria-live="polite" hidden></p></div></div>' +
    '<div class="lcc-bar"><button type="button" class="lcc-back">&darr; Turn back</button><button type="button" class="lcc-go">&uarr; Keep walking</button></div>';
  document.body.appendChild(root);
  document.documentElement.style.overflow = "hidden";
  root.querySelector(".lcc-x").onclick = close;
  root.querySelector(".lcc-back").onclick = function(){ choose(true); };
  root.querySelector(".lcc-go").onclick = function(){ choose(false); };
  root.querySelector(".lcc-snd").onclick = function(){ store.sound = !store.sound; save(); if(store.sound) humOn(); else humOff(); draw(false); };
  keyH = function(e){
    if(!root) return;
    if(e.key === "Escape"){ close(); return; }
    if(busy) return;
    if(e.key === "ArrowUp" || e.key === "w" || e.key === "W"){ e.preventDefault(); choose(false); }
    if(e.key === "ArrowDown" || e.key === "s" || e.key === "S"){ e.preventDefault(); choose(true); }
  };
  document.addEventListener("keydown", keyH);
  floor = 0; odd = null; busy = false;
  draw(false);
  humOn();
  card("<h3>Night Corridor</h3><p>The building is empty. The corridor keeps looping.</p>" +
    "<p><b>If anything is different, turn back.</b> If nothing has changed, keep walking.</p>" +
    "<p>Get it right " + GOAL + " times in a row to clock off. Floor 0 is always normal, so have a good look at it first.</p>" +
    (store.best ? "<p style=\"font-size:.9rem\">Your best: Floor " + store.best + ".</p>" : ""), "Clock in", function(){ next(); });
}
function close(){
  if(!root) return;
  humOff();
  document.removeEventListener("keydown", keyH);
  root.remove(); root = null;
  document.documentElement.style.overflow = "";
}
window.LCCorridor = { open: open, close: close, scene: scene, ODD: ODD };
})();
