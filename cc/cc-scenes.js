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
