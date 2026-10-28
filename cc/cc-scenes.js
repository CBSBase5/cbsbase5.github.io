/* ==========================================================
   Chilton Bridge School - Cultural Calendar: drawn scenes
   One hand drawn, animated poster per week, named in /data/cc.js
   as look.scene, plus an optional live effect as look.effect
   (fireworks, snow, petals, confetti).
     B5CCScenes.draw(name, look)          SVG markup, or "" if none
     B5CCScenes.effect(canvas, kind, cols) starts it, returns stop()
   Scenes are 1200 x 640, pinned to the bottom right, so the art
   lives on the right and along the bottom, and the words sit on
   the left. Moving parts use the s-* classes in /cc/index.html.
   Plain ASCII only.
   ========================================================== */
(function(){
"use strict";
var A = window.B5CCArt;
if(!A) return;
var W = 1200, H = 640;

function f(n){ return (+n).toFixed(1); }
function open(defs){ return '<svg class="scene" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMaxYMax slice" aria-hidden="true" focusable="false"><defs>' + (defs || "") + '</defs>'; }
function ico(name, x, y, size, fill, detail){ var k = size / 48; return '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + k.toFixed(3) + ')">' + A.inner(name, fill, detail) + '</g>'; }
function anim(cls, dur, delay, extra){ return ' class="' + cls + '" style="animation-duration:' + dur + 's;animation-delay:' + (delay || 0) + 's;' + (extra || "") + '"'; }
/* a rolling hill from left to right, closed to the bottom */
function hill(y, amp, waves, phase, fill, op){
  var d = "M0 " + H + "L0 " + f(y), x;
  for(x = 0; x <= W; x += 20) d += "L" + x + " " + f(y + Math.sin(x / W * Math.PI * waves + phase) * amp);
  return '<path d="' + d + 'L' + W + ' ' + H + 'z" fill="' + fill + '"' + (op ? ' opacity="' + op + '"' : "") + '/>';
}
function hillY(y, amp, waves, phase, x){ return y + Math.sin(x / W * Math.PI * waves + phase) * amp; }
function star(cx, cy, r1, r2, n){
  var s = "", i, a, r; n = n || 5;
  for(i = 0; i < n * 2; i++){ a = -Math.PI / 2 + i * Math.PI / n; r = i % 2 ? r2 : r1; s += (i ? "L" : "M") + f(cx + Math.cos(a) * r) + " " + f(cy + Math.sin(a) * r); }
  return s + "z";
}
function gearPath(r, teeth, depth){
  var d = "", i, n = teeth * 4;
  for(i = 0; i < n; i++){
    var a = i / n * Math.PI * 2, rr = (i % 4 < 2) ? r : r - depth;
    d += (i ? "L" : "M") + f(Math.cos(a) * rr) + " " + f(Math.sin(a) * rr);
  }
  return d + "z";
}

var S = {};

/* ---------------- Festivals of Light: the original scene ---------------- */
S.festivals = function(L){ return A.festivals(L); };

/* ---------------- Remembrance ----------------
   Dawn over hills of poppies, a memorial on the far hill, doves crossing. */
S.remembrance = function(L){
  var r = A.rng(1111), s = open('<radialGradient id="rmSun"><stop offset="0" stop-color="#fff3e0"/><stop offset=".55" stop-color="#ffd8b0"/><stop offset="1" stop-color="#ffd8b0" stop-opacity="0"/></radialGradient>'), i;
  s += '<circle cx="1040" cy="150" r="210" fill="url(#rmSun)" opacity=".75"/><circle cx="1040" cy="150" r="96" fill="#fff3e0"/>';
  /* doves */
  for(i = 0; i < 4; i++){
    var by = 90 + i * 46 + r() * 30, bs = 0.7 + r() * 0.6;
    s += '<g' + anim("s-drift", 34 + i * 6, -i * 9) + '><g transform="translate(0 ' + f(by) + ') scale(' + bs.toFixed(2) + ')"><g' + anim("s-flap", 0.9 + r() * 0.4, -r()) + '>' +
      '<path d="M0 0q16-22 34-4q18-18 34 4q-16-4-34 6q-18-10-34-6z" fill="#fffdf8"/></g></g></g>';
  }
  /* far hill with the memorial */
  s += hill(410, 18, 2, 0.6, "#5a0b10");
  var mx = 1162, my = hillY(410, 18, 2, 0.6, 1162);
  s += '<g fill="#3a0609"><rect x="' + (mx - 34) + '" y="' + f(my - 12) + '" width="68" height="14"/><rect x="' + (mx - 24) + '" y="' + f(my - 150) + '" width="48" height="140"/>' +
    '<rect x="' + (mx - 30) + '" y="' + f(my - 160) + '" width="60" height="14"/><rect x="' + (mx - 18) + '" y="' + f(my - 178) + '" width="36" height="20"/></g>' +
    '<circle cx="' + mx + '" cy="' + f(my - 82) + '" r="15" fill="none" stroke="#e5383b" stroke-width="7"/>';
  /* mid hill with small poppies */
  s += hill(480, 22, 3, 2.1, "#33060a");
  for(i = 0; i < 70; i++){
    var px = r() * W, py = hillY(480, 22, 3, 2.1, px) + 10 + r() * 60, pr = 5 + r() * 5;
    s += '<circle cx="' + f(px) + '" cy="' + f(py) + '" r="' + f(pr) + '" fill="#e5383b"/><circle cx="' + f(px) + '" cy="' + f(py) + '" r="' + f(pr * 0.35) + '" fill="#161a1d"/>';
  }
  /* front hill with big swaying poppies */
  s += hill(560, 14, 2, 4, "#1a0305");
  var spots = [380, 470, 560, 650, 740, 830, 920, 1010, 1100, 1180];
  spots.forEach(function(x, k){
    var gy = hillY(560, 14, 2, 4, x) + 8, hgt = 40 + r() * 46, pr = 20 + r() * 12, cx = x + (r() - 0.5) * 30;
    s += '<g' + anim("s-sway", 4 + r() * 2, -r() * 4) + '>' +
      '<path d="M' + f(cx) + ' ' + f(gy + 80) + 'Q' + f(cx - 8) + ' ' + f(gy - hgt / 2) + ' ' + f(cx) + ' ' + f(gy - hgt) + '" fill="none" stroke="#386641" stroke-width="5"/>' +
      '<path d="M' + f(cx) + ' ' + f(gy - hgt * 0.4) + 'q-22-6-30 8q18 6 30-8z" fill="#386641"/>' +
      '<g transform="translate(' + f(cx) + ' ' + f(gy - hgt) + ')">' +
      '<circle cx="' + f(-pr * 0.45) + '" cy="' + f(-pr * 0.3) + '" r="' + f(pr * 0.75) + '" fill="#d90429"/><circle cx="' + f(pr * 0.45) + '" cy="' + f(-pr * 0.3) + '" r="' + f(pr * 0.75) + '" fill="#d90429"/>' +
      '<circle cx="' + f(-pr * 0.4) + '" cy="' + f(pr * 0.35) + '" r="' + f(pr * 0.72) + '" fill="#ef233c"/><circle cx="' + f(pr * 0.4) + '" cy="' + f(pr * 0.35) + '" r="' + f(pr * 0.72) + '" fill="#ef233c"/>' +
      '<circle r="' + f(pr * 0.3) + '" fill="#161a1d"/><circle r="' + f(pr * 0.12) + '" fill="#5c5c5c"/></g></g>';
  });
  return s + '</svg>';
};

/* ---------------- Anti-Bullying Week: Break the Silence ----------------
   A crowd of bright blob people, one with a megaphone, and a giant
   "shh" bubble cracking apart. Speech bubbles rise from the crowd. */
S.antibullying = function(L){
  var r = A.rng(2222), s = open(), i;
  /* the cracking shh bubble */
  s += '<g' + anim("s-bob", 4, 0) + '><g transform="translate(860 70)">' +
    '<path d="M0 30q0-30 30-30h240q30 0 30 30v120q0 30-30 30H120l-50 46v-46H30q-30 0-30-30z" fill="#fffdf8" stroke="#0a2f38" stroke-width="6"/>' +
    '<text x="150" y="120" text-anchor="middle" font-family="Archivo, Arial Black, sans-serif" font-weight="900" font-size="78" fill="#0a2f38" opacity=".25">SHH</text>' +
    '<path d="M150 0l-18 44 30 22-26 40 24 30-12 44" fill="none" stroke="#0a2f38" stroke-width="6" stroke-linejoin="round"/>' +
    '<path d="M162 66l46 -10M136 106l-50 8" fill="none" stroke="#0a2f38" stroke-width="4" stroke-linecap="round"/></g></g>';
  /* shards flying off */
  for(i = 0; i < 6; i++){
    var sx = 820 + r() * 360, sy = 40 + r() * 230;
    s += '<g' + anim("s-bob", 2.5 + r() * 2, -r() * 3) + '><path d="M' + f(sx) + ' ' + f(sy) + 'l' + f(10 + r() * 16) + ' ' + f(4 + r() * 10) + 'l' + f(-14 + r() * 6) + ' ' + f(12 + r() * 8) + 'z" fill="' + (i % 2 ? L.pop : "#fffdf8") + '" stroke="#0a2f38" stroke-width="3"/></g>';
  }
  /* sound rings from the megaphone */
  for(i = 0; i < 3; i++) s += '<g' + anim("s-pulse", 2.4, -i * 0.8) + '><circle cx="810" cy="330" r="90" fill="none" stroke="#fffdf8" stroke-width="6"/></g>';
  /* rising speech bubbles */
  var icons = ["heart", "smile", "hand", "people", "star", "shield"];
  for(i = 0; i < 6; i++){
    var bx = 380 + i * 140 + r() * 40;
    s += '<g' + anim("s-rise", 9 + r() * 5, -r() * 12, "--d:-760px") + '><g transform="translate(' + f(bx) + ' 640)">' +
      '<path d="M0 14q0-14 14-14h56q14 0 14 14v34q0 14-14 14H32l-14 14v-14h-4q-14 0-14-14z" fill="#fffdf8" stroke="#0a2f38" stroke-width="4"/>' +
      ico(icons[i], 22, 6, 40, i % 2 ? L.pop2 : "#0077b6", "#fffdf8") + '</g></g>';
  }
  /* the crowd */
  var cols = [L.pop, L.pop2, "#fffdf8", "#06d6a0", "#ff9f1c", "#8338ec", "#ffd60a", "#ef476f", "#3a86ff"];
  var xs = [360, 450, 540, 640, 760, 870, 970, 1070, 1170];
  xs.forEach(function(x, k){
    var hgt = k === 4 ? 200 : 150 + r() * 70, w = 78 + r() * 20, c = cols[k % cols.length], top = H - hgt, mega = k === 4;
    s += '<g' + anim("s-bob", 1.8 + r() * 1.2, -r() * 2) + '>' +
      '<rect x="' + f(x - w / 2) + '" y="' + f(top + 40) + '" width="' + f(w) + '" height="' + f(hgt) + '" rx="' + f(w / 2) + '" fill="' + c + '" stroke="#0a2f38" stroke-width="5"/>' +
      '<circle cx="' + f(x) + '" cy="' + f(top + 18) + '" r="34" fill="' + c + '" stroke="#0a2f38" stroke-width="5"/>' +
      '<circle cx="' + f(x - 11) + '" cy="' + f(top + 12) + '" r="5" fill="#0a2f38"/><circle cx="' + f(x + 11) + '" cy="' + f(top + 12) + '" r="5" fill="#0a2f38"/>' +
      (mega ? '<ellipse cx="' + f(x) + '" cy="' + f(top + 30) + '" rx="9" ry="7" fill="#0a2f38"/>' : '<path d="M' + f(x - 12) + ' ' + f(top + 28) + 'q12 12 24 0" fill="none" stroke="#0a2f38" stroke-width="4" stroke-linecap="round"/>') +
      (k % 3 === 1 ? '<path d="M' + f(x + w / 2 - 6) + ' ' + f(top + 70) + 'l26 -56" stroke="#0a2f38" stroke-width="10" stroke-linecap="round"/><circle cx="' + f(x + w / 2 + 22) + '" cy="' + f(top + 12) + '" r="11" fill="' + c + '" stroke="#0a2f38" stroke-width="4"/>' : '') +
      '</g>';
    if(mega) s += '<g transform="translate(' + f(x + 4) + ' ' + f(top + 26) + ') rotate(-62)"><path d="M0 -6l78-30v72L0 6z" fill="' + L.pop + '" stroke="#0a2f38" stroke-width="5" stroke-linejoin="round"/><rect x="-8" y="-8" width="14" height="16" rx="4" fill="#0a2f38"/><path d="M10 14l8 26" stroke="#0a2f38" stroke-width="8" stroke-linecap="round"/></g>';
  });
  return s + '</svg>';
};

/* ---------------- Giving Tuesday ----------------
   A bright little town, heart balloons and parcels floating up,
   and a big pair of hands holding a heart. */
S.giving = function(L){
  var r = A.rng(3333), s = open(), i;
  /* big hands and heart */
  s += '<g' + anim("s-bob", 5, 0) + '><g transform="translate(905 -40) scale(5)">' +
    '<path d="M24 22c-4-7-13-4-11 3 1 5 11 10 11 10s10-5 11-10c2-7-7-10-11-3z" fill="#ff006e" stroke="#2b0f6b" stroke-width=".9"/>' +
    '<path d="M3 30q9 0 14 8h14q5-8 14-8v7q-7 0-10 7H13q-3-7-10-7z" fill="#fb5607" stroke="#2b0f6b" stroke-width=".9" stroke-linejoin="round"/></g></g>';
  /* floating heart balloons and parcels */
  for(i = 0; i < 9; i++){
    var x = 360 + r() * 820, sz = 0.7 + r() * 0.6, gift = i % 3 === 0, c = [L.pop, L.pop2, "#ff006e", "#8338ec"][i % 4];
    s += '<g' + anim("s-rise", 14 + r() * 10, -r() * 24, "--d:-900px") + '><g transform="translate(' + f(x) + ' 680) scale(' + sz.toFixed(2) + ')"><g' + anim("s-sway", 3 + r() * 2, -r() * 3) + '>' +
      '<path d="M0 30q-6 20 4 40" fill="none" stroke="#2b0f6b" stroke-width="2.5"/>' +
      (gift
        ? '<path d="M0 -6c-6-10-20-6-16 4 2 7 16 14 16 14s14-7 16-14c4-10-10-14-16-4z" fill="' + c + '" stroke="#2b0f6b" stroke-width="3"/><g transform="translate(-20 70)"><rect width="40" height="34" rx="4" fill="#fffdf8" stroke="#2b0f6b" stroke-width="3"/><rect x="16" width="8" height="34" fill="' + c + '"/><path d="M20 0q-14-14-18-2q4 6 18 2zM20 0q14-14 18-2q-4 6-18 2z" fill="' + c + '" stroke="#2b0f6b" stroke-width="2.5"/></g>'
        : '<path d="M0 0c-9-15-30-9-24 6 3 11 24 22 24 22s21-11 24-22c6-15-15-21-24-6z" fill="' + c + '" stroke="#2b0f6b" stroke-width="3"/><ellipse cx="-12" cy="2" rx="4" ry="6" fill="#fff" opacity=".6"/>') +
      '</g></g></g>';
  }
  /* the town */
  var hx = 300, cols = ["#3a86ff", "#8338ec", "#ff006e", "#fb5607", "#fffdf8", "#06d6a0"], k = 0;
  while(hx < W + 20){
    var hw = 90 + r() * 60, hh = 110 + r() * 90, c = cols[k % cols.length], ink = "#2b0f6b", top = 600 - hh;
    s += '<path d="M' + f(hx - 8) + ' ' + f(top) + 'L' + f(hx + hw / 2) + ' ' + f(top - 54) + 'L' + f(hx + hw + 8) + ' ' + f(top) + 'z" fill="' + ink + '"/>' +
      '<rect x="' + f(hx) + '" y="' + f(top) + '" width="' + f(hw) + '" height="' + f(hh + 60) + '" fill="' + c + '" stroke="' + ink + '" stroke-width="5"/>' +
      '<rect x="' + f(hx + hw / 2 - 14) + '" y="' + f(600 - 52) + '" width="28" height="52" rx="12" fill="' + ink + '"/>' +
      '<rect x="' + f(hx + 14) + '" y="' + f(top + 20) + '" width="24" height="24" rx="4" fill="#ffd166" stroke="' + ink + '" stroke-width="4"/>' +
      '<rect x="' + f(hx + hw - 38) + '" y="' + f(top + 20) + '" width="24" height="24" rx="4" fill="#ffd166" stroke="' + ink + '" stroke-width="4"/>' +
      (k % 2 ? '<path d="M' + f(hx + hw / 2) + ' ' + f(top - 22) + 'c-4-7-13-4-11 3 1 5 11 10 11 10s10-5 11-10c2-7-7-10-11-3z" fill="#ff006e"/>' : '');
    hx += hw + 14; k++;
  }
  s += '<rect x="0" y="600" width="' + W + '" height="40" fill="#2b0f6b"/>';
  return s + '</svg>';
};

/* ---------------- Christmas Around the World ----------------
   The top of the world, with homes from everywhere round the curve,
   a big star lantern, a string of soft lights and live snow. */
S.christmas = function(L){
  var r = A.rng(4444), s = open('<radialGradient id="xGlow"><stop offset="0" stop-color="#ffd166" stop-opacity=".9"/><stop offset="1" stop-color="#ffd166" stop-opacity="0"/></radialGradient>'), i;
  /* string of lights */
  var x1 = 380, y1 = 30, x2 = 1220, y2 = 60, sag = 70;
  s += '<path d="M' + x1 + ' ' + y1 + 'Q' + ((x1 + x2) / 2) + ' ' + (y2 + sag) + ' ' + x2 + ' ' + y2 + '" fill="none" stroke="#06331f" stroke-width="3"/>';
  for(i = 1; i < 18; i++){
    var t = i / 18, mx = (x1 + x2) / 2, my = y2 + sag;
    var x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2, y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2;
    s += '<g' + anim("s-glow", 2.6, -i * 0.37) + '><ellipse cx="' + f(x) + '" cy="' + f(y + 12) + '" rx="7" ry="11" fill="' + ["#e63946", "#ffd166", "#4cc9f0", "#fffdf8"][i % 4] + '"/></g>';
  }
  /* the parol star lantern */
  s += '<g' + anim("s-swing", 4, 0) + '><g transform="translate(1020 70)">' +
    '<path d="M0 0v40" stroke="#06331f" stroke-width="3"/><circle cx="0" cy="130" r="120" fill="url(#xGlow)"/>' +
    '<path d="' + star(0, 130, 90, 40) + '" fill="#e63946" stroke="#fffdf8" stroke-width="6" stroke-linejoin="round"/>' +
    '<path d="' + star(0, 134, 44, 20) + '" fill="#ffd166"/><circle cx="0" cy="134" r="14" fill="#fffdf8"/>' +
    '<path d="M-40 196q-6 50 -16 90M-20 200q-2 40 -6 80M20 200q2 40 6 80M40 196q6 50 16 90" fill="none" stroke="#ffd166" stroke-width="5" stroke-linecap="round"/></g></g>';
  /* the curve of the world */
  var cx = 720, cy = 1500, R = 1000;
  s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="#06331f"/>';
  s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R - 2) + '" fill="none" stroke="#fffdf8" stroke-width="22"/>';
  /* homes round the curve, each with its own winter light */
  var deco = ["tree", "star", "lantern", "candle", "tree", "star", "lantern", "tree", "candle"];
  for(i = 0; i < 9; i++){
    var ang = -112 + i * 6.2, a = ang * Math.PI / 180, hx = cx + Math.cos(a) * (R - 10), hy = cy + Math.sin(a) * (R - 10), rot = ang + 90;
    var hc = ["#e63946", "#ffd166", "#fffdf8", "#4cc9f0", "#f77f00"][i % 5];
    s += '<g transform="translate(' + f(hx) + ' ' + f(hy) + ') rotate(' + f(rot) + ')">' +
      '<rect x="-30" y="-58" width="60" height="58" fill="' + hc + '" stroke="#06331f" stroke-width="4"/>' +
      '<path d="M-38 -56L0 -92L38 -56z" fill="#fffdf8" stroke="#06331f" stroke-width="4" stroke-linejoin="round"/>' +
      '<rect x="-10" y="-40" width="20" height="20" rx="3" fill="#ffd166" stroke="#06331f" stroke-width="3"/>';
    var d = deco[i];
    if(d === "tree") s += '<path d="M44 0l14-46l14 46z" fill="#0b6e4f" stroke="#06331f" stroke-width="3"/><circle cx="58" cy="-50" r="5" fill="#ffd166"/>';
    if(d === "star") s += '<path d="' + star(0, -116, 16, 7) + '" fill="#ffd166"/>';
    if(d === "lantern") s += '<g' + anim("s-swing", 3, -i * 0.4) + '><path d="M50 -60v14" stroke="#06331f" stroke-width="2"/><ellipse cx="50" cy="-34" rx="10" ry="13" fill="#e63946"/></g>';
    if(d === "candle") s += '<rect x="46" y="-34" width="8" height="34" fill="#fffdf8"/><g' + anim("s-flick", 0.8, -i * 0.2) + '><path d="M50 -48q6 7 0 13q-6-6 0-13z" fill="#ffd166"/></g>';
    s += '</g>';
  }
  /* a big decorated tree on top of the world */
  s += '<g transform="translate(' + cx + ' ' + (cy - R + 6) + ')">' +
    '<path d="M0 -300L-80 -170h40L-120 -60h50L-150 0h300L70 -60h50L40 -170h40z" fill="#0b6e4f" stroke="#06331f" stroke-width="6" stroke-linejoin="round"/>' +
    '<rect x="-16" y="-4" width="32" height="22" fill="#6b3e1e"/>' +
    '<path d="' + star(0, -306, 30, 13) + '" fill="#ffd166" stroke="#fffdf8" stroke-width="4"/>';
  var baubles = [[-30, -200, "#e63946"], [26, -150, "#ffd166"], [-60, -100, "#4cc9f0"], [50, -80, "#e63946"], [-10, -60, "#fffdf8"], [-90, -30, "#ffd166"], [90, -24, "#4cc9f0"], [10, -240, "#4cc9f0"]];
  baubles.forEach(function(b, k){ s += '<g' + anim("s-glow", 3, -k * 0.5) + '><circle cx="' + b[0] + '" cy="' + b[1] + '" r="11" fill="' + b[2] + '" stroke="#06331f" stroke-width="3"/></g>'; });
  s += '</g>';
  return s + '</svg>';
};

/* ---------------- STEAM for Good ----------------
   A blueprint workshop: meshing gears, a bright idea, a robot arm,
   a paper plane looping and measuring lines everywhere. */
S.steam = function(L){
  var s = open(), i;
  var ln = 'fill="none" stroke="#e6f4ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
  /* measuring lines */
  s += '<g opacity=".7"><path d="M420 600h740M420 590v20M1160 590v20" ' + ln + '/><text x="640" y="590" text-anchor="middle" font-family="Atkinson Hyperlegible, Verdana, sans-serif" font-weight="700" font-size="20" fill="#e6f4ff">74 cm</text>' +
    '<path d="M1180 120v400M1170 120h20M1170 520h20" ' + ln + '/><path d="M560 80a120 120 0 0 1 120 120" ' + ln + ' stroke-dasharray="8 8"/></g>';
  /* gears */
  s += '<g transform="translate(960 300)"><g' + anim("s-spin", 24, 0) + '><path d="' + gearPath(150, 14, 26) + '" fill="' + L.pop + '" stroke="#0a1035" stroke-width="6"/><circle r="70" fill="' + L.bg + '" stroke="#0a1035" stroke-width="6"/><circle r="22" fill="#0a1035"/>' +
    '<path d="M0 -70v-40M0 70v40M-70 0h-40M70 0h40" stroke="#0a1035" stroke-width="8"/></g></g>';
  s += '<g transform="translate(1124 480)"><g' + anim("s-spin", 15.4, 0, "animation-direction:reverse") + '><path d="' + gearPath(96, 9, 24) + '" fill="' + L.pop2 + '" stroke="#0a1035" stroke-width="6"/><circle r="40" fill="' + L.bg + '" stroke="#0a1035" stroke-width="6"/><circle r="14" fill="#0a1035"/></g></g>';
  /* the big idea: a lightbulb */
  s += '<g transform="translate(720 150)"><g' + anim("s-pulse", 2.8, 0) + '><circle r="80" fill="#ffd60a" opacity=".5"/></g>' +
    '<path d="M-44 0a44 44 0 1 1 88 0c0 22-18 30-18 52h-52c0-22-18-30-18-52z" fill="#ffd60a" stroke="#0a1035" stroke-width="6"/>' +
    '<rect x="-24" y="58" width="48" height="14" rx="4" fill="#e6f4ff" stroke="#0a1035" stroke-width="5"/><rect x="-18" y="74" width="36" height="12" rx="4" fill="#e6f4ff" stroke="#0a1035" stroke-width="5"/>' +
    '<path d="M-14 50l6-30 8 14 8-14 6 30" fill="none" stroke="#0a1035" stroke-width="4" stroke-linejoin="round"/>';
  for(i = 0; i < 8; i++){ var a = (i * 45 - 90) * Math.PI / 180; if(i === 4) continue; s += '<path d="M' + f(Math.cos(a) * 66) + ' ' + f(Math.sin(a) * 66) + 'L' + f(Math.cos(a) * 92) + ' ' + f(Math.sin(a) * 92) + '" stroke="#ffd60a" stroke-width="7" stroke-linecap="round"/>'; }
  s += '</g>';
  /* robot arm */
  s += '<g transform="translate(560 600)"><rect x="-50" y="-20" width="100" height="24" rx="6" fill="#e6f4ff" stroke="#0a1035" stroke-width="5"/>' +
    '<g' + anim("s-arm", 5, 0) + '><rect x="-14" y="-170" width="28" height="160" rx="12" fill="' + L.pop + '" stroke="#0a1035" stroke-width="5"/><circle cy="-10" r="18" fill="#e6f4ff" stroke="#0a1035" stroke-width="5"/>' +
    '<g transform="translate(0 -160)"><g' + anim("s-arm2", 4, -1) + '><rect x="-12" y="-12" width="130" height="24" rx="12" fill="' + L.pop2 + '" stroke="#0a1035" stroke-width="5"/><circle r="16" fill="#e6f4ff" stroke="#0a1035" stroke-width="5"/>' +
    '<path d="M118 -18l26 -8M118 18l26 8" stroke="#0a1035" stroke-width="7" stroke-linecap="round"/></g></g></g></g>';
  /* paper plane on a loop */
  s += '<path d="M380 360c120-160 260-40 200 40s-140-20-60-90" fill="none" stroke="#e6f4ff" stroke-width="3" stroke-dasharray="6 10" opacity=".7"/>' +
    '<g' + anim("s-bob", 3, 0) + '><g transform="translate(560 300) rotate(-20)"><path d="M0 0l60 20-60 20 10-20z" fill="#fffdf8" stroke="#0a1035" stroke-width="4" stroke-linejoin="round"/><path d="M10 20h50" stroke="#0a1035" stroke-width="3"/></g></g>';
  return s + '</svg>';
};

/* ======================= AUTUMN 1 ======================= */

/* ---------------- New Beginnings ----------------
   The school with its big doors swinging open, light pouring out,
   a path, trees and bunting. Confetti on top. */
S.newbeginnings = function(L){
  var r = A.rng(5555), s = open('<linearGradient id="nbBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe066" stop-opacity=".75"/><stop offset="1" stop-color="#ffe066" stop-opacity="0"/></linearGradient>'), i;
  var ink = "#083b40";
  /* bunting from the school out to the left */
  var x1 = 790, y1 = 330, x2 = 560, y2 = 380, sag = 40;
  s += '<path d="M' + x1 + ' ' + y1 + 'Q' + ((x1 + x2) / 2) + ' ' + (Math.max(y1, y2) + sag) + ' ' + x2 + ' ' + y2 + '" fill="none" stroke="#fef8f4" stroke-width="3"/>';
  for(i = 1; i < 7; i++){
    var t = i / 7, mx = (x1 + x2) / 2, my = Math.max(y1, y2) + sag;
    var x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2, y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2;
    s += '<g' + anim("s-swing", 2.4 + r(), -r() * 2) + '><path d="M' + f(x - 15) + ' ' + f(y) + 'h30l-15 34z" fill="' + [L.pop, L.pop2, "#fef8f4", "#ff4f81"][i % 4] + '" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/></g>';
  }
  /* trees */
  [[640, 470, 70], [720, 500, 54]].forEach(function(tr, k){
    s += '<g' + anim("s-sway", 5 + k, -k * 2) + '><rect x="' + (tr[0] - 8) + '" y="' + tr[1] + '" width="16" height="' + (600 - tr[1]) + '" fill="' + ink + '"/>' +
      '<circle cx="' + tr[0] + '" cy="' + (tr[1] - tr[2] * 0.6) + '" r="' + tr[2] + '" fill="#2a9d8f" stroke="' + ink + '" stroke-width="5"/>' +
      '<circle cx="' + (tr[0] - tr[2] * 0.4) + '" cy="' + (tr[1] - tr[2] * 0.9) + '" r="' + (tr[2] * 0.35) + '" fill="#43c6ac"/></g>';
  });
  /* the school */
  s += '<path d="M770 270L990 170L1210 270z" fill="' + L.pop2 + '" stroke="' + ink + '" stroke-width="6" stroke-linejoin="round"/>' +
    '<rect x="790" y="268" width="420" height="340" fill="#fef8f4" stroke="' + ink + '" stroke-width="6"/>' +
    '<circle cx="990" cy="224" r="30" fill="#fef8f4" stroke="' + ink + '" stroke-width="5"/><path d="M990 224v-18M990 224l12 8" stroke="' + ink + '" stroke-width="4" stroke-linecap="round"/>';
  for(i = 0; i < 6; i++){
    var wx = 812 + (i % 3) * 52 + (i % 3 > 1 ? 0 : 0), wy = 300 + Math.floor(i / 3) * 74;
    s += '<rect x="' + wx + '" y="' + wy + '" width="38" height="50" rx="5" fill="#ffe066" stroke="' + ink + '" stroke-width="4"/>';
    s += '<rect x="' + (wx + 278 - (i % 3) * 0 + (i % 3) * 0) + '" y="' + wy + '" width="38" height="50" rx="5" fill="#ffe066" stroke="' + ink + '" stroke-width="4"/>';
  }
  /* light pouring out of the doorway */
  s += '<g' + anim("s-glow", 3, 0) + '><path d="M940 600L1040 600L1200 640L780 640z" fill="url(#nbBeam)"/></g>';
  s += '<path d="M930 600V470a60 60 0 0 1 120 0V600z" fill="#ffe066" stroke="' + ink + '" stroke-width="6"/>' +
    '<g' + anim("s-doorl", 6, 0) + '><rect x="934" y="470" width="56" height="130" fill="' + L.pop2 + '" stroke="' + ink + '" stroke-width="4"/></g>' +
    '<g' + anim("s-doorr", 6, 0) + '><rect x="990" y="470" width="56" height="130" fill="' + L.pop2 + '" stroke="' + ink + '" stroke-width="4"/></g>' +
    '<text x="990" y="300" text-anchor="middle" font-family="Archivo, Arial Black, sans-serif" font-weight="900" font-size="22" fill="' + ink + '">WELCOME</text>';
  s += '<rect x="0" y="600" width="' + W + '" height="40" fill="#0a5c63"/><path d="M945 600h90l90 40H855z" fill="#fef8f4" opacity=".85"/>';
  return s + '</svg>';
};

/* ---------------- National Fitness Day ----------------
   A running track, a spinning sun, balls bouncing and a big trainer. */
S.fitness = function(L){
  var s = open(), i, ink = "#1a1a2e";
  s += '<g transform="translate(1070 130)"><g' + anim("s-spin", 30, 0) + '>';
  for(i = 0; i < 12; i++) s += '<rect x="-8" y="-118" width="16" height="36" rx="8" fill="' + L.pop + '" transform="rotate(' + (i * 30) + ')"/>';
  s += '</g><circle r="70" fill="' + L.pop + '" stroke="' + ink + '" stroke-width="5"/><circle cx="-22" cy="-8" r="6" fill="' + ink + '"/><circle cx="22" cy="-8" r="6" fill="' + ink + '"/><path d="M-24 18q24 22 48 0" fill="none" stroke="' + ink + '" stroke-width="5" stroke-linecap="round"/></g>';
  /* the track */
  s += '<ellipse cx="820" cy="790" rx="760" ry="290" fill="#c4452a" stroke="' + ink + '" stroke-width="6"/>';
  [700, 640, 580].forEach(function(rx, k){ s += '<ellipse cx="820" cy="790" rx="' + rx + '" ry="' + (290 - (k + 1) * 26) + '" fill="none" stroke="#fffdf8" stroke-width="4"/>'; });
  s += '<ellipse cx="820" cy="790" rx="520" ry="186" fill="#3fa34d" stroke="#fffdf8" stroke-width="5"/>';
  /* cones */
  [430, 560, 1150].forEach(function(x){ var y = 790 - 290 * Math.sqrt(Math.max(0, 1 - Math.pow((x - 820) / 760, 2))) + 24; s += '<path d="M' + (x - 14) + ' ' + f(y) + 'l14-34 14 34z" fill="#ff8c42" stroke="' + ink + '" stroke-width="4" stroke-linejoin="round"/>'; });
  /* bouncing balls with their shadows */
  var balls = [[600, 560, "foot"], [760, 540, "basket"], [930, 550, "tennis"]];
  balls.forEach(function(b, k){
    var x = b[0], y = b[1], d = 1.1 + k * 0.18, dl = -k * 0.35;
    s += '<g' + anim("s-shadow", d, dl) + '><ellipse cx="' + x + '" cy="' + (y + 30) + '" rx="26" ry="7" fill="' + ink + '" opacity=".35"/></g><g' + anim("s-bounce", d, dl) + '>';
    if(b[2] === "foot") s += '<circle cx="' + x + '" cy="' + y + '" r="28" fill="#fffdf8" stroke="' + ink + '" stroke-width="4"/><path d="M' + x + ' ' + (y - 10) + 'l10 7-4 12h-12l-4-12z" fill="' + ink + '"/>';
    if(b[2] === "basket") s += '<circle cx="' + x + '" cy="' + y + '" r="30" fill="#f77f00" stroke="' + ink + '" stroke-width="4"/><path d="M' + (x - 30) + ' ' + y + 'h60M' + x + ' ' + (y - 30) + 'v60M' + (x - 21) + ' ' + (y - 21) + 'q16 21 0 42M' + (x + 21) + ' ' + (y - 21) + 'q-16 21 0 42" fill="none" stroke="' + ink + '" stroke-width="3"/>';
    if(b[2] === "tennis") s += '<circle cx="' + x + '" cy="' + y + '" r="20" fill="#d4e157" stroke="' + ink + '" stroke-width="4"/><path d="M' + (x - 18) + ' ' + (y - 8) + 'q18 8 0 18M' + (x + 18) + ' ' + (y - 8) + 'q-18 8 0 18" fill="none" stroke="#fffdf8" stroke-width="3"/>';
    s += '</g>';
  });
  /* a big trainer with speed lines */
  s += '<g' + anim("s-bob", 0.9, 0) + '><path d="M540 410h-90M560 444h-130M545 478h-80" stroke="#fffdf8" stroke-width="10" stroke-linecap="round" opacity=".8"/>' +
    '<g transform="translate(550 330) rotate(-8)">' + ico("shoe", 0, 0, 180, L.pop, ink) + '</g></g>';
  return s + '</svg>';
};

/* ---------------- International Day of Sign Languages ----------------
   Big signing hands, symbol cards floating about, and a talker tablet. */
S.sign = function(L){
  var r = A.rng(6666), s = open(), i, ink = "#2a0f45";
  /* motion arcs */
  s += '<g' + anim("s-glow", 1.6, 0) + '><path d="M470 330q-30 40 0 80M450 310q-50 60 0 120M660 250q40-30 80 0M640 220q60-50 120 0" fill="none" stroke="#fffdf8" stroke-width="6" stroke-linecap="round"/></g>';
  /* floating symbol cards */
  var syms = ["cup", "smile", "heart", "door", "music", "people", "speech"];
  for(i = 0; i < 7; i++){
    var x = 380 + r() * 760, y = 30 + r() * 200;
    s += '<g' + anim("s-bob", 2.5 + r() * 2, -r() * 3) + '><g transform="translate(' + f(x) + ' ' + f(y) + ') rotate(' + f((r() - 0.5) * 20) + ')">' +
      '<rect x="0" y="0" width="74" height="74" rx="14" fill="#fffdf8" stroke="' + ink + '" stroke-width="4"/>' + ico(syms[i], 13, 11, 48, i % 2 ? L.bg : L.bg2, "#fffdf8") + '</g></g>';
  }
  /* three big hands */
  [[470, 350, 200, "#fffdf8", -14], [600, 280, 240, L.pop, 8], [730, 360, 200, L.pop2, -4]].forEach(function(h, k){
    s += '<g' + anim("s-wave", 1.6 + k * 0.3, -k * 0.5) + '><g transform="translate(' + h[0] + ' ' + h[1] + ') rotate(' + h[4] + ')">' +
      '<g transform="scale(' + (h[2] / 48).toFixed(3) + ')">' + A.inner("hand", h[3], ink) + '</g></g></g>';
  });
  /* talker tablet */
  s += '<g transform="translate(990 480)"><rect width="200" height="170" rx="18" fill="' + ink + '"/><rect x="12" y="12" width="176" height="146" rx="8" fill="#fffdf8"/>';
  var tc = [L.pop, L.pop2, "#ff7aa2", "#7ec8ff", L.pop2, L.pop];
  var ts = ["cup", "heart", "smile", "people", "door", "music"];
  for(i = 0; i < 6; i++){ var gx = 20 + (i % 3) * 56, gy = 20 + Math.floor(i / 3) * 64; s += '<rect x="' + gx + '" y="' + gy + '" width="50" height="56" rx="6" fill="' + tc[i] + '"/>' + ico(ts[i], gx + 7, gy + 8, 36, ink, tc[i]); }
  s += '</g>';
  return s + '</svg>';
};

/* ---------------- International Day of Older Persons ----------------
   A cosy front room: photos on the wall, a ticking clock, a lamp,
   an armchair, tea, and a record going round. */
S.generations = function(L){
  var s = open('<radialGradient id="gnLamp"><stop offset="0" stop-color="#fff3c4" stop-opacity=".9"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>'), i;
  var wood = "#6b3a1e", ink = "#3b1f0e", sep = "#8a5a3b";
  /* photo frames */
  [[560, 70, 110, 140, -4], [710, 40, 140, 104, 3], [880, 80, 96, 120, -2]].forEach(function(p, k){
    s += '<g transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[4] + ')"><rect width="' + p[2] + '" height="' + p[3] + '" rx="4" fill="' + wood + '"/><rect x="10" y="10" width="' + (p[2] - 20) + '" height="' + (p[3] - 20) + '" fill="#fff3d6"/>';
    var n = k === 1 ? 2 : 1, j;
    for(j = 0; j < n; j++){ var cx = p[2] / 2 + (n > 1 ? (j ? 24 : -24) : 0), base = p[3] - 10; s += '<circle cx="' + cx + '" cy="' + (base - 46) + '" r="16" fill="' + sep + '"/><path d="M' + (cx - 26) + ' ' + base + 'q0-26 26-26t26 26z" fill="' + sep + '"/>'; }
    s += '</g>';
  });
  /* the wall clock */
  s += '<g transform="translate(1080 40)"><rect width="84" height="230" rx="12" fill="' + wood + '" stroke="' + ink + '" stroke-width="4"/><circle cx="42" cy="48" r="30" fill="#fff3d6" stroke="' + ink + '" stroke-width="4"/>' +
    '<path d="M42 48v-18M42 48l12 6" stroke="' + ink + '" stroke-width="4" stroke-linecap="round"/><rect x="14" y="90" width="56" height="128" rx="6" fill="#3b1f0e" opacity=".5"/>' +
    '<g transform="translate(42 92)"><g' + anim("s-swing", 1, 0, "animation-timing-function:ease-in-out") + '><path d="M0 0v94" stroke="#f4c95d" stroke-width="4"/><circle cy="100" r="15" fill="#f4c95d" stroke="' + ink + '" stroke-width="3"/></g></g></g>';
  /* standard lamp */
  s += '<g' + anim("s-glow", 4, 0) + '><circle cx="470" cy="300" r="150" fill="url(#gnLamp)"/></g><path d="M470 330v270" stroke="' + ink + '" stroke-width="8"/><path d="M432 600h76" stroke="' + ink + '" stroke-width="10" stroke-linecap="round"/>' +
    '<path d="M430 330l14-66h52l14 66z" fill="#fff3d6" stroke="' + ink + '" stroke-width="5" stroke-linejoin="round"/>';
  /* floor and rug */
  s += '<rect x="0" y="600" width="' + W + '" height="40" fill="#7a4a26"/><ellipse cx="860" cy="618" rx="300" ry="22" fill="' + L.pop + '"/><ellipse cx="860" cy="618" rx="250" ry="14" fill="none" stroke="#fff3d6" stroke-width="4" stroke-dasharray="14 10"/>';
  /* record player on a cabinet */
  s += '<rect x="530" y="480" width="180" height="120" rx="8" fill="' + wood + '" stroke="' + ink + '" stroke-width="5"/><rect x="530" y="458" width="180" height="26" rx="6" fill="#4a2a14" stroke="' + ink + '" stroke-width="5"/>' +
    '<g transform="translate(612 470) scale(1 .32)"><g' + anim("s-spin", 1.8, 0) + '><circle r="70" fill="#111"/><circle r="56" fill="none" stroke="#333" stroke-width="3"/><circle r="40" fill="none" stroke="#333" stroke-width="3"/><circle r="20" fill="' + L.pop + '"/><rect x="-4" y="-20" width="8" height="10" fill="#fff3d6"/></g></g>' +
    '<path d="M694 450l-24 22" stroke="#d9d9d9" stroke-width="5" stroke-linecap="round"/>';
  /* music notes drifting up from the record */
  for(i = 0; i < 4; i++) s += '<g' + anim("s-rise", 5 + i, -i * 1.6, "--d:-300px") + '><g transform="translate(' + (560 + i * 36) + ' 430)"><path d="M0 0v-26l18-6v24" fill="none" stroke="' + ink + '" stroke-width="4"/><ellipse cx="-5" cy="2" rx="7" ry="5" fill="' + ink + '"/><ellipse cx="13" cy="-4" rx="7" ry="5" fill="' + ink + '"/></g></g>';
  /* armchair */
  s += '<g transform="translate(840 360)"><rect x="20" y="0" width="230" height="170" rx="40" fill="' + L.pop + '" stroke="' + ink + '" stroke-width="6"/>' +
    '<rect x="0" y="110" width="270" height="110" rx="30" fill="#9c3a24" stroke="' + ink + '" stroke-width="6"/><rect x="40" y="96" width="190" height="50" rx="20" fill="#d0643f" stroke="' + ink + '" stroke-width="5"/>' +
    '<rect x="-14" y="90" width="50" height="130" rx="24" fill="' + L.pop + '" stroke="' + ink + '" stroke-width="6"/><rect x="234" y="90" width="50" height="130" rx="24" fill="' + L.pop + '" stroke="' + ink + '" stroke-width="6"/>' +
    '<rect x="70" y="20" width="70" height="56" rx="14" fill="#fff3d6" stroke="' + ink + '" stroke-width="4" transform="rotate(-8 105 48)"/><path d="M84 40h40M84 54h30" stroke="' + L.pop + '" stroke-width="5" stroke-linecap="round" transform="rotate(-8 105 48)"/></g>';
  /* side table with tea */
  s += '<rect x="752" y="470" width="80" height="12" rx="4" fill="' + wood + '" stroke="' + ink + '" stroke-width="4"/><path d="M770 482v118M814 482v118" stroke="' + ink + '" stroke-width="6"/>' + ico("cup", 766, 424, 50, "#fff3d6", ink);
  for(i = 0; i < 2; i++) s += '<g' + anim("s-steam", 2.4, -i * 1.2) + '><path d="M' + (785 + i * 10) + ' 430q-8-10 0-20t0-20" fill="none" stroke="#fff3d6" stroke-width="4" stroke-linecap="round"/></g>';
  return s + '</svg>';
};

/* ---------------- Black History Month, with World Space Week ----------------
   A night sky with a ringed planet, a Sankofa heart traced in stars,
   a rocket on the pad, and a kente inspired band along the ground. */
S.bhmspace = function(L){
  var r = A.rng(7777), s = open('<linearGradient id="bsTail" x1="0" x2="1"><stop offset="0" stop-color="#fffdf8" stop-opacity="0"/><stop offset="1" stop-color="#fffdf8"/></linearGradient>'), i;
  var ink = "#0d0b1f";
  /* ringed planet and a little red one */
  s += '<g' + anim("s-bob", 6, 0) + '><g transform="translate(1060 130)"><circle r="70" fill="' + L.pop + '" stroke="' + ink + '" stroke-width="5"/><path d="M-60 -16q60-24 120 0" fill="none" stroke="#d99a12" stroke-width="10" stroke-linecap="round" opacity=".7"/>' +
    '<ellipse rx="130" ry="26" fill="none" stroke="' + L.pop2 + '" stroke-width="12" transform="rotate(-16)"/><path d="M-66 18a70 70 0 0 0 132 0" fill="' + L.pop + '" transform="rotate(-16)"/></g></g>' +
    '<circle cx="890" cy="70" r="20" fill="#e63946" stroke="' + ink + '" stroke-width="4"/>';
  /* shooting stars */
  for(i = 0; i < 2; i++) s += '<g' + anim("s-shoot", 7, -i * 3.5) + '><path d="M' + (900 + i * 200) + ' ' + (30 + i * 40) + 'h90" stroke="url(#bsTail)" stroke-width="4" stroke-linecap="round" transform="rotate(-25 ' + (990 + i * 200) + ' ' + (30 + i * 40) + ')"/></g>';
  /* Sankofa heart in stars */
  var pts = [[0, 60], [-48, 14], [-56, -24], [-34, -50], [-8, -42], [0, -26], [8, -42], [34, -50], [56, -24], [48, 14]], cx = 760, cy = 150, k = 1.3;
  s += '<path d="M' + pts.map(function(p){ return f(cx + p[0] * k) + ' ' + f(cy + p[1] * k); }).join("L") + 'z" fill="none" stroke="' + L.pop + '" stroke-width="2" opacity=".55"/>' +
    '<path d="M' + f(cx) + ' ' + f(cy - 26 * k) + 'q-22 10 -10 28q12 10 22 -2M' + f(cx) + ' ' + f(cy - 26 * k) + 'q22 10 10 28" fill="none" stroke="' + L.pop + '" stroke-width="2" opacity=".55"/>';
  pts.forEach(function(p, j){ s += '<g' + anim("s-glow", 1.8 + r(), -r() * 2) + '><path d="' + star(cx + p[0] * k, cy + p[1] * k, 8, 3, 4) + '" fill="' + L.pop + '"/></g>'; });
  /* rocket on its pad */
  s += '<g transform="translate(700 300)"><path d="M-60 300v-210M-60 120h40M-60 190h40M-60 260h40M-60 120l40 70M-60 190l40 70" stroke="#a8a3c7" stroke-width="6" fill="none"/>' +
    '<g' + anim("s-bob", 0.5, 0) + '><path d="M0 -40q40 40 30 210h-60q-10-170 30-210z" fill="#fffdf8" stroke="' + ink + '" stroke-width="6"/>' +
    '<path d="M0 -40q22 22 28 70h-56q6-48 28-70z" fill="#e63946"/><circle cy="70" r="18" fill="' + L.pop2 + '" stroke="' + ink + '" stroke-width="5"/>' +
    '<path d="M-30 120l-28 60h28zM30 120l28 60h-28z" fill="' + L.pop + '" stroke="' + ink + '" stroke-width="5" stroke-linejoin="round"/>' +
    '<g' + anim("s-flick", 0.25, 0) + '><path d="M-20 172q20 70 40 0z" fill="#ff8c1a"/><path d="M-10 172q10 40 20 0z" fill="#ffd166"/></g></g></g>';
  /* smoke clouds */
  for(i = 0; i < 6; i++) s += '<g' + anim("s-bob", 2 + r() * 2, -r() * 2) + '><circle cx="' + f(610 + i * 36) + '" cy="' + f(560 + r() * 16) + '" r="' + f(22 + r() * 16) + '" fill="#e8e6f5" opacity=".9"/></g>';
  /* kente inspired band */
  s += '<rect x="0" y="592" width="' + W + '" height="48" fill="' + ink + '"/>';
  var cols = [L.pop, L.pop2, "#e63946", L.pop, ink];
  for(i = 0; i * 40 < W; i++){
    var c = cols[i % cols.length], x = i * 40;
    s += '<rect x="' + x + '" y="596" width="40" height="40" fill="' + c + '"/>';
    if(i % 2) s += '<path d="M' + x + ' 606h40M' + x + ' 616h40M' + x + ' 626h40" stroke="' + ink + '" stroke-width="3"/>';
    else s += '<path d="M' + (x + 8) + ' 596v40M' + (x + 20) + ' 596v40M' + (x + 32) + ' 596v40" stroke="' + ink + '" stroke-width="3" opacity=".6"/>';
  }
  return s + '</svg>';
};

/* ---------------- World Mental Health and Wellbeing Week ----------------
   A calm green day: a soft sun, drifting clouds, a kite, a bench under
   a tree, flowers nodding and bubbles floating up. */
S.wellbeing = function(L){
  var r = A.rng(8888), s = open(), i, ink = "#16324f";
  /* sun with slow rings */
  for(i = 0; i < 2; i++) s += '<g' + anim("s-pulse", 6, -i * 3) + '><circle cx="1070" cy="120" r="90" fill="none" stroke="' + L.pop2 + '" stroke-width="6"/></g>';
  s += '<circle cx="1070" cy="120" r="66" fill="' + L.pop2 + '"/>';
  /* clouds */
  for(i = 0; i < 4; i++){
    var cy = 50 + i * 50 + r() * 20, sc = 0.7 + r() * 0.5;
    s += '<g' + anim("s-drift", 70 + r() * 40, -r() * 80) + '><g transform="translate(0 ' + f(cy) + ') scale(' + sc.toFixed(2) + ')"><path d="M0 40a26 26 0 0 1 30-36a34 34 0 0 1 62 4a24 24 0 0 1 26 32z" fill="#fffdf8"/></g></g>';
  }
  /* kite */
  s += '<path d="M690 170q40 200 -40 430" fill="none" stroke="' + ink + '" stroke-width="2" opacity=".6"/>' +
    '<g' + anim("s-swing", 2.6, 0) + '><g transform="translate(690 100)"><path d="M0 0l40 60-40 70-40-70z" fill="' + L.pop + '" stroke="' + ink + '" stroke-width="5" stroke-linejoin="round"/><path d="M0 0v130M-40 60h80" stroke="' + ink + '" stroke-width="3"/>' +
    '<path d="M0 130q-20 20 0 40t0 40" fill="none" stroke="' + ink + '" stroke-width="3"/><path d="M-8 150l8 6 8-6M-8 185l8 6 8-6" fill="' + L.pop2 + '" stroke="' + ink + '" stroke-width="2"/></g></g>';
  /* hills */
  s += hill(440, 26, 2, 0.4, "#5bbfa9") + hill(500, 22, 3, 1.6, "#3fa58f");
  /* tree and bench on the middle hill */
  var tx = 1010, ty = hillY(500, 22, 3, 1.6, tx);
  s += '<rect x="' + (tx - 10) + '" y="' + f(ty - 120) + '" width="20" height="130" fill="' + ink + '"/><g' + anim("s-sway", 6, 0) + '><circle cx="' + tx + '" cy="' + f(ty - 150) + '" r="80" fill="#2f9e74" stroke="' + ink + '" stroke-width="5"/><circle cx="' + (tx - 34) + '" cy="' + f(ty - 180) + '" r="26" fill="#47c08f"/>' +
    '<circle cx="' + (tx + 30) + '" cy="' + f(ty - 130) + '" r="8" fill="' + L.pop + '"/><circle cx="' + (tx - 20) + '" cy="' + f(ty - 120) + '" r="8" fill="' + L.pop + '"/></g>';
  var bx = 860, by = hillY(500, 22, 3, 1.6, bx) + 4;
  s += '<g stroke="' + ink + '" stroke-width="7" stroke-linecap="round"><path d="M' + (bx - 50) + ' ' + f(by - 30) + 'h100M' + (bx - 50) + ' ' + f(by - 52) + 'h100M' + (bx - 40) + ' ' + f(by - 30) + 'v30M' + (bx + 40) + ' ' + f(by - 30) + 'v30M' + (bx - 46) + ' ' + f(by - 52) + 'v22M' + (bx + 46) + ' ' + f(by - 52) + 'v22"/></g>';
  s += hill(565, 14, 2, 3.2, "#2a8a78");
  /* flowers */
  for(i = 0; i < 12; i++){
    var x = 380 + i * 70 + r() * 30, y = hillY(565, 14, 2, 3.2, x) + 30, h = 30 + r() * 30, c = [L.pop, L.pop2, "#fffdf8"][i % 3];
    s += '<g' + anim("s-sway", 3 + r() * 2, -r() * 3) + '><path d="M' + f(x) + ' ' + f(y) + 'v' + f(-h) + '" stroke="#1f6f62" stroke-width="4"/>';
    var j; for(j = 0; j < 5; j++){ var a = j * Math.PI * 2 / 5; s += '<circle cx="' + f(x + Math.cos(a) * 9) + '" cy="' + f(y - h + Math.sin(a) * 9) + '" r="7" fill="' + c + '"/>'; }
    s += '<circle cx="' + f(x) + '" cy="' + f(y - h) + '" r="6" fill="' + ink + '"/></g>';
  }
  /* bubbles */
  for(i = 0; i < 8; i++) s += '<g' + anim("s-rise", 10 + r() * 8, -r() * 16, "--d:-760px") + '><circle cx="' + f(380 + r() * 800) + '" cy="680" r="' + f(10 + r() * 16) + '" fill="#fffdf8" fill-opacity=".25" stroke="#fffdf8" stroke-width="3"/></g>';
  return s + '</svg>';
};

/* ======================= SPRING 1 ======================= */

/* ---------------- New Year, New You? ----------------
   A city skyline at midnight, a big clock about to strike twelve,
   a list of resolutions crossing themselves out, fireworks on top. */
S.newyear = function(L){
  var r = A.rng(9101), s = open(), i, ink = "#0b1a2e";
  /* the clock tower */
  s += '<g transform="translate(1000 0)"><rect x="-70" y="200" width="140" height="440" fill="' + ink + '"/><path d="M-80 200L0 110L80 200z" fill="' + ink + '"/>' +
    '<circle cy="290" r="62" fill="#fff3c4" stroke="' + L.pop + '" stroke-width="8"/>';
  for(i = 0; i < 12; i++){ var a = i * Math.PI / 6; s += '<path d="M' + f(Math.sin(a) * 48) + ' ' + f(290 - Math.cos(a) * 48) + 'L' + f(Math.sin(a) * 56) + ' ' + f(290 - Math.cos(a) * 56) + '" stroke="' + ink + '" stroke-width="' + (i % 3 ? 3 : 6) + '"/>'; }
  s += '<path d="M0 290v-40" stroke="' + ink + '" stroke-width="7" stroke-linecap="round"/>' +
    '<g transform="translate(0 290)"><g' + anim("s-tick", 4, 0) + '><path d="M0 0v-50" stroke="' + L.pop2 + '" stroke-width="4" stroke-linecap="round"/></g></g><circle cy="290" r="7" fill="' + ink + '"/>';
  for(i = 0; i < 4; i++) s += '<rect x="' + (-48 + (i % 2) * 64) + '" y="' + (400 + Math.floor(i / 2) * 80) + '" width="32" height="44" rx="4" fill="#ffd166"/>';
  s += '</g>';
  /* skyline */
  var x = 300;
  while(x < W + 40){
    var w = 50 + r() * 70, h = 120 + r() * 200;
    if(x + w > 920 && x < 1080){ x = 1080; continue; }
    s += '<rect x="' + f(x) + '" y="' + f(640 - h) + '" width="' + f(w) + '" height="' + f(h) + '" fill="#132c4a"/>';
    var wy, wx;
    for(wy = 640 - h + 14; wy < 610; wy += 26) for(wx = x + 8; wx < x + w - 14; wx += 18) if(r() < 0.45) s += '<rect class="win' + (r() < 0.2 ? " flick" : "") + '" x="' + f(wx) + '" y="' + f(wy) + '" width="9" height="13" fill="#ffd166" style="animation-delay:' + (-r() * 5).toFixed(1) + 's"/>';
    x += w + 6;
  }
  /* the resolutions list */
  s += '<g' + anim("s-bob", 3.4, 0) + '><g transform="translate(575 80) rotate(-6) scale(.88)"><rect width="220" height="250" rx="10" fill="#fffdf8" stroke="' + ink + '" stroke-width="5"/>' +
    '<text x="22" y="44" font-family="Archivo, Arial Black, sans-serif" font-weight="900" font-size="24" fill="' + ink + '">THIS YEAR I WILL</text>';
  var res = ["Go to bed early", "Eat more veg", "Tidy my room", "Learn to juggle"];
  res.forEach(function(t, k){
    var y = 92 + k * 42;
    s += '<rect x="22" y="' + (y - 18) + '" width="22" height="22" rx="4" fill="none" stroke="' + ink + '" stroke-width="3"/>' +
      '<text x="56" y="' + y + '" font-family="Atkinson Hyperlegible, Verdana, sans-serif" font-weight="700" font-size="19" fill="' + ink + '">' + t + '</text>';
    if(k < 3) s += '<path d="M52 ' + (y - 7) + 'h' + (t.length * 9.4) + '" stroke="' + L.pop2 + '" stroke-width="4" stroke-linecap="round"' + anim("s-strike", 6, -k * 0.2, "stroke-dasharray:200;") + '/>';
  });
  s += '<path d="M24 ' + (92 + 3 * 42 - 8) + 'l6 8 12-14" fill="none" stroke="#06d6a0" stroke-width="4" stroke-linecap="round"/></g></g>';
  return s + '</svg>';
};

/* ---------------- Democracy Day in Cape Verde ----------------
   Ten little islands in a blue sea, a giant ballot box being fed
   votes, and a sea of hands up. */
S.democracy = function(L){
  var r = A.rng(9202), s = open(), i, ink = "#0b1e44";
  /* sea waves */
  for(i = 0; i < 4; i++) s += '<g' + anim("s-wavex", 6 + i, -i * 1.4) + '><path d="M300 ' + (130 + i * 52) + 'q20-12 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0" fill="none" stroke="#fffdf8" stroke-width="3" opacity=".25"/></g>';
  /* the islands, in a loose horseshoe like the real ones */
  var isl = [[780, 70, 34], [840, 52, 18], [900, 60, 26], [960, 84, 30], [1010, 120, 14], [1060, 150, 28], [1090, 220, 30], [1040, 260, 22], [960, 250, 36], [880, 240, 26]];
  isl.forEach(function(p, k){
    s += '<g' + anim("s-bob", 3 + k * 0.2, -k * 0.3) + '><ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="' + p[2] + '" ry="' + f(p[2] * 0.62) + '" fill="#f4d58d" stroke="' + ink + '" stroke-width="3"/>' +
      '<ellipse cx="' + (p[0] - p[2] * 0.2) + '" cy="' + f(p[1] - p[2] * 0.15) + '" rx="' + f(p[2] * 0.5) + '" ry="' + f(p[2] * 0.3) + '" fill="#6aa84f"/></g>';
  });
  /* the ballot box */
  s += '<g transform="translate(560 270) scale(.85)"><rect width="260" height="190" rx="12" fill="#fffdf8" stroke="' + ink + '" stroke-width="6"/><rect x="0" y="0" width="260" height="46" rx="12" fill="' + L.pop2 + '" stroke="' + ink + '" stroke-width="6"/>' +
    '<rect x="70" y="18" width="120" height="12" rx="6" fill="' + ink + '"/><text x="130" y="128" text-anchor="middle" font-family="Archivo, Arial Black, sans-serif" font-weight="900" font-size="44" fill="' + ink + '">VOTE</text>' +
    '<path d="' + star(130, 160, 14, 6) + '" fill="' + L.pop + '"/></g>';
  /* votes dropping in */
  for(i = 0; i < 3; i++) s += '<g' + anim("s-drop", 2.4, -i * 0.8) + '><g transform="translate(' + (600 + i * 44) + ' 150) scale(.85)"><rect width="56" height="70" rx="4" fill="#fffdf8" stroke="' + ink + '" stroke-width="4"/><path d="M14 36l10 10 20-24" fill="none" stroke="' + L.bg + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g></g>';
  /* hands up along the bottom */
  var cols = ["#f2c49b", "#c68b59", "#8d5524", "#e0ac69", "#ffdbac", "#a0673c"];
  for(i = 0; i < 9; i++){
    var hx = 340 + i * 100 + r() * 20, hy = 520 + r() * 40, c = cols[i % cols.length];
    s += '<g' + anim("s-wave", 1.2 + r(), -r()) + '><g transform="translate(' + f(hx) + ' ' + f(hy) + ')">' +
      '<rect x="-16" y="40" width="32" height="140" rx="14" fill="' + [L.pop, L.pop2, "#fffdf8"][i % 3] + '" stroke="' + ink + '" stroke-width="4"/>' +
      '<g transform="translate(-30 -30) scale(1.25)">' + A.inner("hand", c, ink) + '</g></g></g>';
  }
  return s + '</svg>';
};

/* ---------------- Chinese New Year ----------------
   Rows of red lanterns swinging, a long dragon weaving across, a
   little goat for the Year of the Goat, and red envelopes. */
S.lunar = function(L){
  var r = A.rng(9303), s = open('<radialGradient id="lnGlow"><stop offset="0" stop-color="#ffd60a" stop-opacity=".6"/><stop offset="1" stop-color="#ffd60a" stop-opacity="0"/></radialGradient>'), i, ink = "#3d0a0f";
  /* strings of lanterns */
  [[360, 30, 1220, 60, 50, 9], [560, 160, 1220, 140, 40, 6]].forEach(function(row, k){
    var x1 = row[0], y1 = row[1], x2 = row[2], y2 = row[3], sag = row[4], n = row[5], j;
    s += '<path d="M' + x1 + ' ' + y1 + 'Q' + ((x1 + x2) / 2) + ' ' + (Math.max(y1, y2) + sag) + ' ' + x2 + ' ' + y2 + '" fill="none" stroke="' + ink + '" stroke-width="3"/>';
    for(j = 1; j < n; j++){
      var t = j / n, mx = (x1 + x2) / 2, my = Math.max(y1, y2) + sag;
      var x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2, y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2, sc = k ? 0.7 : 1;
      s += '<g' + anim("s-swing", 2.6 + r(), -r() * 3) + '><g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + sc + ')">' +
        '<path d="M0 0v12" stroke="' + ink + '" stroke-width="3"/><circle cy="44" r="46" fill="url(#lnGlow)"/>' +
        '<rect x="-14" y="10" width="28" height="8" rx="2" fill="#ffd60a"/><ellipse cy="44" rx="30" ry="28" fill="#e5383b" stroke="' + ink + '" stroke-width="3"/>' +
        '<path d="M0 16v56M-14 18q-10 26 0 52M14 18q10 26 0 52" fill="none" stroke="#ffd60a" stroke-width="2.5"/><rect x="-14" y="70" width="28" height="8" rx="2" fill="#ffd60a"/>' +
        '<path d="M-6 78v22M0 78v26M6 78v22" stroke="#ffd60a" stroke-width="3"/></g></g>';
    }
  });
  /* the dragon: a chain of body pieces that ripples */
  var n = 9, base = 520;
  for(i = n - 1; i >= 0; i--){
    var bx = 640 + i * 62, c = i % 2 ? "#ffd60a" : "#e5383b";
    s += '<g' + anim("s-ripple", 1.6, -i * 0.13) + '>';
    if(i === 0){
      s += '<g transform="translate(' + bx + ' ' + base + ')"><path d="M30 -40q-90 -10 -100 40q10 46 100 40z" fill="#e5383b" stroke="' + ink + '" stroke-width="5"/>' +
        '<path d="M-40 -20q-30 -30 -10 -50M-20 -34q0 -40 30 -46" fill="none" stroke="#ffd60a" stroke-width="6" stroke-linecap="round"/>' +
        '<circle cx="-30" cy="-6" r="10" fill="#fffdf8" stroke="' + ink + '" stroke-width="3"/><circle cx="-33" cy="-6" r="5" fill="' + ink + '"/>' +
        '<path d="M-70 14q20 14 60 8" fill="none" stroke="' + ink + '" stroke-width="4"/><path d="M-66 18l6 10 8-8 6 10 8-8" fill="none" stroke="#fffdf8" stroke-width="3"/>' +
        '<path d="M-70 -4q-30 -10 -40 10M-70 6q-30 4 -30 24" fill="none" stroke="#ffd60a" stroke-width="4" stroke-linecap="round"/></g>';
    } else {
      s += '<g transform="translate(' + bx + ' ' + base + ')"><ellipse rx="40" ry="36" fill="' + c + '" stroke="' + ink + '" stroke-width="5"/>' +
        '<path d="M-26 -30l10 -20 10 18 10 -18 10 20" fill="#ffd60a" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M-20 0q20 14 40 0" fill="none" stroke="' + ink + '" stroke-width="3" opacity=".5"/>' +
        '<path d="M-10 34v40M10 34v40" stroke="' + ink + '" stroke-width="6" stroke-linecap="round"/></g>';
    }
    s += '</g>';
  }
  /* the goat */
  s += '<g' + anim("s-bob", 0.6, 0) + '><g transform="translate(1110 520)"><ellipse rx="54" ry="34" fill="#fffdf8" stroke="' + ink + '" stroke-width="5"/>' +
    '<circle cx="50" cy="-30" r="24" fill="#fffdf8" stroke="' + ink + '" stroke-width="5"/><path d="M40 -50q-14 -30 10 -36M60 -50q16 -28 -6 -36" fill="none" stroke="#c9a227" stroke-width="7" stroke-linecap="round"/>' +
    '<circle cx="58" cy="-32" r="4" fill="' + ink + '"/><path d="M52 -6q2 14 -4 20" fill="none" stroke="' + ink + '" stroke-width="4"/>' +
    '<path d="M-30 30v40M-10 30v40M20 30v40M40 30v40" stroke="' + ink + '" stroke-width="7" stroke-linecap="round"/></g></g>';
  /* red envelopes */
  for(i = 0; i < 5; i++) s += '<g' + anim("s-bob", 2 + r() * 2, -r() * 2) + '><g transform="translate(' + f(380 + r() * 700) + ' ' + f(250 + r() * 100) + ') rotate(' + f((r() - 0.5) * 30) + ')"><rect width="40" height="56" rx="4" fill="#d00000" stroke="' + ink + '" stroke-width="3"/><circle cx="20" cy="22" r="9" fill="#ffd60a"/></g></g>';
  return s + '</svg>';
};

/* ---------------- STEAM Challenge ----------------
   A spaghetti and marshmallow tower that wobbles, a paper bridge
   holding books, a ruler and pencil, and a bright idea. */
S.steambuild = function(L){
  var s = open(), i, ink = "#073b4c";
  s += '<rect x="300" y="590" width="' + (W - 300) + '" height="50" fill="#e9c46a"/><path d="M300 590h' + (W - 300) + '" stroke="' + ink + '" stroke-width="5"/>';
  /* the wobbly tower */
  var nodes = [[700, 590], [820, 590], [760, 470], [700, 470], [820, 470], [760, 350], [730, 250], [790, 250], [760, 140]];
  var sticks = [[0, 1], [0, 3], [1, 4], [3, 4], [0, 2], [1, 2], [3, 2], [4, 2], [3, 5], [4, 5], [2, 5], [5, 6], [5, 7], [6, 7], [6, 8], [7, 8]];
  s += '<g' + anim("s-wobble", 2.6, 0) + '>';
  sticks.forEach(function(k){ var a = nodes[k[0]], b = nodes[k[1]]; s += '<path d="M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1] + '" stroke="#f4d58d" stroke-width="7" stroke-linecap="round"/><path d="M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1] + '" stroke="' + ink + '" stroke-width="1.5" opacity=".3"/>'; });
  nodes.forEach(function(n, k){ s += '<rect x="' + (n[0] - 13) + '" y="' + (n[1] - 11) + '" width="26" height="22" rx="9" fill="' + (k % 3 ? "#fffdf8" : "#ffafcc") + '" stroke="' + ink + '" stroke-width="3"/>'; });
  s += '<path d="M760 140v-36" stroke="' + ink + '" stroke-width="4"/><path d="M760 104h40l-8 12 8 12h-40z" fill="' + L.pop2 + '" stroke="' + ink + '" stroke-width="3"/></g>';
  /* the paper bridge between two piles of books */
  function pile(x, n){
    var out = "", k;
    for(k = 0; k < n; k++) out += '<rect x="' + (x + (k % 2) * 6) + '" y="' + (590 - (k + 1) * 26) + '" width="110" height="24" rx="3" fill="' + ["#ef476f", "#118ab2", "#ffd166", "#06d6a0"][k % 4] + '" stroke="' + ink + '" stroke-width="3"/>';
    return out;
  }
  s += pile(890, 4) + pile(1080, 4);
  s += '<path d="M940 486' + (function(){ var d = "", x; for(x = 0; x <= 200; x += 20) d += "L" + (950 + x) + " " + (x % 40 ? 474 : 486); return d; })() + '" fill="none" stroke="#fffdf8" stroke-width="5" stroke-linejoin="round"/>' +
    '<path d="M940 488h230" stroke="#fffdf8" stroke-width="5"/>' +
    '<g' + anim("s-bob", 2, 0) + '><rect x="1000" y="436" width="110" height="34" rx="4" fill="' + L.pop2 + '" stroke="' + ink + '" stroke-width="4"/><path d="M1010 446h90" stroke="#fffdf8" stroke-width="3"/></g>';
  /* ruler and pencil */
  s += '<g transform="translate(380 520) rotate(-8)"><rect width="240" height="40" rx="4" fill="' + L.pop + '" stroke="' + ink + '" stroke-width="4"/>';
  for(i = 1; i < 24; i++) s += '<path d="M' + (i * 10) + ' 0v' + (i % 5 ? 10 : 18) + '" stroke="' + ink + '" stroke-width="2"/>';
  s += '</g>' + ico("pencil", 470, 420, 90, "#ffd166", ink);
  /* bright idea */
  s += '<g transform="translate(1030 170)"><g' + anim("s-pulse", 2.6, 0) + '><circle r="70" fill="#ffd166" opacity=".5"/></g>' + ico("star", -52, -52, 104, "#ffd166", ink) + '</g>';
  return s + '</svg>';
};

/* ---------------- Safer Internet Day ----------------
   A giant phone with a shield, a padlock, a fake picture getting
   spotted by a magnifying glass, and safe little message bubbles. */
S.safer = function(L){
  var r = A.rng(9505), s = open(), i, ink = "#020617";
  /* data stream lines */
  for(i = 0; i < 10; i++){ var y = 40 + i * 58; s += '<g' + anim("s-stream", 4 + r() * 4, -r() * 6) + '><path d="M300 ' + y + 'h' + f(80 + r() * 200) + '" stroke="' + L.pop + '" stroke-width="3" stroke-linecap="round" opacity=".35"/></g>'; }
  /* the phone */
  s += '<g transform="translate(860 70)"><rect width="250" height="470" rx="36" fill="' + ink + '" stroke="' + L.pop + '" stroke-width="5"/><rect x="16" y="40" width="218" height="390" rx="14" fill="#0b1e3a"/>' +
    '<rect x="95" y="16" width="60" height="10" rx="5" fill="#1e293b"/>' +
    '<g' + anim("s-pulse", 2.8, 0) + '><circle cx="125" cy="200" r="80" fill="none" stroke="' + L.pop2 + '" stroke-width="5"/></g>' +
    '<g transform="translate(70 140) scale(2.3)">' + A.inner("shield", L.pop2, ink) + '</g>' +
    '<rect x="36" y="330" width="140" height="34" rx="12" fill="' + L.pop + '"/><rect x="74" y="376" width="140" height="34" rx="12" fill="#e2e8f0"/></g>';
  /* the padlock */
  s += '<g' + anim("s-bob", 3, 0) + '><g transform="translate(700 40) scale(2.2)">' + A.inner("padlock", L.pop, ink) + '</g></g>';
  /* fake picture with tell-tale signs */
  s += '<g transform="translate(530 380) rotate(-5) scale(.85)"><rect width="230" height="170" rx="8" fill="#fffdf8" stroke="' + ink + '" stroke-width="5"/>' +
    '<rect x="14" y="14" width="202" height="142" fill="#7dd3fc"/><circle cx="170" cy="50" r="20" fill="#fde047"/><path d="M14 156l70-70 50 50 30-24 52 44z" fill="#22c55e"/>' +
    '<g transform="translate(70 70)"><path d="M0 40q0-30 20-40l4 20 6-24 6 24 6-22 4 26q14 10 10 36z" fill="#f2c49b" stroke="' + ink + '" stroke-width="3"/></g>' +
    '<text x="115" y="146" text-anchor="middle" font-family="Archivo, Arial Black, sans-serif" font-weight="900" font-size="16" fill="' + ink + '">HLELO WROLD</text></g>';
  /* the magnifying glass sweeping over it */
  s += '<g' + anim("s-search", 5, 0) + '><g transform="translate(590 400) scale(.85)"><circle r="50" fill="#fffdf8" fill-opacity=".25" stroke="' + ink + '" stroke-width="10"/><path d="M36 36l50 50" stroke="' + ink + '" stroke-width="16" stroke-linecap="round"/>' +
    '<circle r="50" fill="none" stroke="' + L.pop2 + '" stroke-width="4"/></g></g>';
  /* AI tag */
  s += '<g' + anim("s-bob", 2, -1) + '><g transform="translate(620 545)"><rect width="110" height="44" rx="22" fill="#f43f5e" stroke="' + ink + '" stroke-width="4"/><text x="55" y="30" text-anchor="middle" font-family="Archivo, Arial Black, sans-serif" font-weight="900" font-size="20" fill="#fffdf8">AI MADE</text></g></g>';
  return s + '</svg>';
};

/* ---------------- National Apprenticeship Week ----------------
   A workshop wall of tools, a conveyor belt carrying jobs past, hard
   hats, and a big L plate that turns into a qualification. */
S.apprentice = function(L){
  var s = open(), i, ink = "#1b2021";
  /* pegboard */
  s += '<rect x="660" y="20" width="540" height="200" rx="16" fill="#e9c46a" stroke="' + ink + '" stroke-width="5"/>';
  for(i = 0; i < 13 * 5; i++) s += '<circle cx="' + (684 + (i % 13) * 42) + '" cy="' + (42 + Math.floor(i / 13) * 40) + '" r="4" fill="' + ink + '" opacity=".35"/>';
  var tools = [["wrench", 760], ["hardhat", 860], ["pencil", 960], ["gear", 1080]];
  tools.forEach(function(t, k){ s += '<g' + anim("s-swing", 2.4 + k * 0.3, -k * 0.4) + '><g transform="translate(' + t[1] + ' 50)"><path d="M36 0v12" stroke="' + ink + '" stroke-width="4"/>' + ico(t[0], 0, 10, 72, k % 2 ? L.pop2 : "#fffdf8", ink) + '</g></g>'; });
  /* the conveyor belt with job icons riding along */
  s += '<g transform="translate(0 470)"><rect x="300" y="60" width="' + (W - 300) + '" height="34" rx="17" fill="' + ink + '"/>';
  for(i = 0; i < 12; i++) s += '<g' + anim("s-spin", 1.2, 0) + '><circle cx="' + (330 + i * 78) + '" cy="77" r="13" fill="#6b7280" stroke="' + ink + '" stroke-width="3"/><path d="M' + (322 + i * 78) + ' 77h16" stroke="' + ink + '" stroke-width="3"/></g>';
  var jobs = ["car", "chefhat", "scissors", "laptop", "hardhat", "paw", "wrench", "camera"];
  s += '<g' + anim("s-belt", 16, 0) + '>';
  jobs.concat(jobs).forEach(function(j, k){
    s += '<g transform="translate(' + (300 + k * 150) + ' -36)"><rect width="96" height="96" rx="16" fill="' + (k % 2 ? L.pop2 : "#fffdf8") + '" stroke="' + ink + '" stroke-width="4"/>' + ico(j, 18, 18, 60, ink, k % 2 ? L.pop2 : "#fffdf8") + '</g>';
  });
  s += '</g></g>';
  /* the L plate that flips to a tick */
  s += '<g transform="translate(712 110)"><path d="M0 -50v12" stroke="' + ink + '" stroke-width="4"/><g' + anim("s-flip", 4, 0) + '><rect x="-36" y="-38" width="72" height="72" rx="8" fill="#fffdf8" stroke="' + ink + '" stroke-width="5"/>' +
    '<text x="0" y="22" text-anchor="middle" font-family="Archivo, Arial Black, sans-serif" font-weight="900" font-size="64" fill="#e63946">L</text></g></g>';
  return s + '</svg>';
};

/* ---------------- live effects on the canvas ---------------- */
function effect(canvas, kind, cols){
  if(kind === "fireworks") return A.fireworks(canvas, cols);
  var ctx = canvas.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2), alive = true, raf = 0, last = 0, parts = [], i;
  function size(){ canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr; }
  size(); window.addEventListener("resize", size);
  var N = kind === "snow" ? 90 : (kind === "petals" ? 26 : 40);
  function make(top){
    return { x: Math.random() * canvas.width, y: top ? -20 * dpr : Math.random() * canvas.height, s: (kind === "snow" ? 1.5 + Math.random() * 3 : 5 + Math.random() * 6) * dpr,
      vy: (kind === "snow" ? 0.4 + Math.random() * 0.8 : 0.5 + Math.random() * 0.7) * dpr, ph: Math.random() * 6.3, rot: Math.random() * 6.3, vr: (Math.random() - 0.5) * 0.06,
      c: cols[(Math.random() * cols.length) | 0] };
  }
  for(i = 0; i < N; i++) parts.push(make(false));
  function tick(t){
    if(!alive) return;
    var dt = Math.min(40, t - (last || t)) / 16; last = t;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts.forEach(function(p, k){
      p.y += p.vy * dt; p.ph += 0.02 * dt; p.rot += p.vr * dt; p.x += Math.sin(p.ph) * 0.4 * dpr * dt;
      if(p.y > canvas.height + 20 * dpr) parts[k] = make(true);
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
      if(kind === "snow"){ ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(0, 0, p.s, 0, Math.PI * 2); ctx.fill(); }
      else if(kind === "petals"){ ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 0.6, 0, 0, Math.PI * 2); ctx.fill(); }
      else { ctx.globalAlpha = 0.9; ctx.scale(1, Math.abs(Math.cos(p.ph * 2)) * 0.8 + 0.2); ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); }
      ctx.restore();
    });
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
  return function(){ alive = false; cancelAnimationFrame(raf); window.removeEventListener("resize", size); ctx.clearRect(0, 0, canvas.width, canvas.height); };
}

window.B5CCScenes = {
  draw: function(name, look){ return S[name] ? S[name](look) : ""; },
  has: function(name){ return !!S[name]; },
  effect: effect,
  _S: S, _h: { open: open, ico: ico, anim: anim, hill: hill, hillY: hillY, star: star, gearPath: gearPath, f: f }
};
})();
