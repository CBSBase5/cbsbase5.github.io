/* ==========================================================
   Base 5 Lessons - Aesthetic and Creative
   Architecture and construction, lesson 1 of 4: What makes it stand?
   45 minutes (Monday 1:15). Leads into the HQ activity
   "What makes it stand?" (a2-what-makes-it-stand.html).

   The shape of a lesson file (every lesson follows it):
     title, mins, cover {line, art}
     warm   {wordle {word, hint, say}, wyr {a, b, artA, artB, twist, say}}
     recap  {items [{q, a}], say}
     objective {formal, mission, success [], say}
     sections [{kind hook|explore|explain, title, mins, part (split lessons only),
                slides [...], check {q, opts, a, why, say}}]
       slides: show    {title, text, pts, build, art, artLeft, say}
               predict {title, q, opts [text or {t, art}], a, why, say}
               vote    {title, q, opts, why, say}
               sort    {title, q, bins [], cards [{t, b}], why, say}
               media   {title, img or yt, alt, caption, credit, say}
       In art, anything with data-s="n" appears on build step n.
     realworld {title, text, art, say}
     exit [{q, opts, a, why}], driving {angle, opts, say}
     surprise {at (a slide path), kind bird|bonnie|bambi, x, y, say}
   ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, INK = "#0a2f38";
var STONE = "#bdb19c", STONE_D = "#8f8471", GLASS = "#bfe6ef", STEEL = "#6c7a80", WOOD = "#b5793f", PINK = "#e2557a", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247";

function ground(y, x1, x2){ return '<path d="M' + (x1 || 0) + ' ' + y + 'H' + (x2 || 800) + '" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>'; }
function arrow(x1, y1, x2, y2, col, w){
  var a = Math.atan2(y2 - y1, x2 - x1), h = 16;
  var p1 = (x2 - h * Math.cos(a - 0.5)).toFixed(1) + " " + (y2 - h * Math.sin(a - 0.5)).toFixed(1);
  var p2 = (x2 - h * Math.cos(a + 0.5)).toFixed(1) + " " + (y2 - h * Math.sin(a + 0.5)).toFixed(1);
  return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + 'M' + p1 + 'L' + x2 + ' ' + y2 + 'L' + p2 + '" stroke="' + (col || ORANGE) + '" stroke-width="' + (w || 7) + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
}
function bar(x1, y1, x2, y2, col){ return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + (col || WOOD) + '" stroke-width="12" stroke-linecap="round"/>'; }
function joint(x, y){ return '<circle cx="' + x + '" cy="' + y + '" r="8" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="3"/>'; }
function wind(x, y){ return '<path d="M' + x + ' ' + y + 'q30 -14 60 0t60 0M' + (x + 10) + ' ' + (y + 26) + 'q30 -14 60 0t50 0M' + x + ' ' + (y + 52) + 'q30 -14 60 0t60 0" stroke="#7fbfd0" stroke-width="5" fill="none" stroke-linecap="round"/>'; }

/* ---------- buildings ---------- */
function hut(x, y, s){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
    '<path d="M-70 0V-34Q-70 -60 0 -64Q70 -60 70 -34V0Z" fill="' + STONE + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<path d="M-70 -18H70M-70 -36H70M-40 0V-18M10 0V-18M45 0V-18M-20 -18V-36M30 -18V-36" stroke="' + STONE_D + '" stroke-width="3"/>' +
    '<path d="M-80 -40Q0 -110 80 -40Q0 -70 -80 -40Z" fill="#6f9a45" stroke="' + INK + '" stroke-width="4"/>' +
    '<rect x="-14" y="-30" width="28" height="30" rx="6" fill="#3d2a1a"/></g>';
}
function castle(x, y, s){
  var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
    '<rect x="-60" y="-170" width="120" height="170" fill="' + STONE + '" stroke="' + INK + '" stroke-width="4"/>';
  for(var i = 0; i < 4; i++) g += '<rect x="' + (-60 + i * 34) + '" y="-196" width="18" height="28" fill="' + STONE + '" stroke="' + INK + '" stroke-width="4"/>';
  g += '<path d="M-60 -120H60M-60 -70H60M-30 -170V-120M20 -170V-120M-5 -120V-70M35 -120V-70" stroke="' + STONE_D + '" stroke-width="3"/>' +
    '<path d="M-18 0V-40Q0 -62 18 -40V0Z" fill="#3d2a1a"/><rect x="-8" y="-150" width="16" height="26" rx="8" fill="#3d2a1a"/>' +
    '<path d="M0 -196V-236" stroke="' + INK + '" stroke-width="4"/><path d="M0 -236L34 -226L0 -214Z" fill="' + PINK + '" stroke="' + INK + '" stroke-width="3"/></g>';
  return g;
}
function tower(x, y, s){
  var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
    '<path d="M-50 0V-300L0 -330L50 -300V0Z" fill="' + GLASS + '" stroke="' + INK + '" stroke-width="4"/>';
  for(var r = 0; r < 9; r++) g += '<path d="M-50 ' + (-30 - r * 30) + 'H50" stroke="' + TEAL + '" stroke-width="2.5" opacity=".7"/>';
  g += '<path d="M-17 0V-312M17 0V-312" stroke="' + TEAL + '" stroke-width="2.5" opacity=".7"/>' +
    '<path d="M-30 -60l20 -20M10 -150l20 -20M-30 -230l20 -20" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/></g>';
  return g;
}
function crane(x, y, s){
  var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
    '<path d="M-14 0V-300M14 0V-300" stroke="' + YELLOW + '" stroke-width="6"/>';
  for(var i = 0; i < 10; i++) g += '<path d="M-14 ' + (-i * 30) + 'L14 ' + (-i * 30 - 30) + 'M-14 ' + (-i * 30 - 30) + 'H14" stroke="' + YELLOW + '" stroke-width="4"/>';
  g += '<path d="M-60 -300H200M-60 -322H120" stroke="' + YELLOW + '" stroke-width="6"/>';
  for(var j = 0; j < 8; j++) g += '<path d="M' + (-60 + j * 32) + ' -300L' + (-44 + j * 32) + ' -322" stroke="' + YELLOW + '" stroke-width="3"/>';
  g += '<rect x="-80" y="-318" width="26" height="22" fill="' + STEEL + '"/><path d="M170 -300V-200" stroke="' + INK + '" stroke-width="2"/><rect x="160" y="-200" width="20" height="14" fill="' + ORANGE + '"/>' +
    '<path d="M-14 0V-300M14 0V-300" stroke="' + INK + '" stroke-width="1.5" opacity=".4"/></g>';
  return g;
}
function pylon(x, y, s){
  var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
    '<path d="M-50 0L-12 -220M50 0L12 -220M-12 -220L0 -260L12 -220" stroke="' + STEEL + '" stroke-width="6" fill="none" stroke-linejoin="round"/>';
  var lv = [0, -50, -100, -150, -200];
  for(var i = 0; i < lv.length - 1; i++){
    var w1 = 50 - (-lv[i]) * 38 / 220, w2 = 50 - (-lv[i + 1]) * 38 / 220;
    g += '<path d="M' + (-w1) + ' ' + lv[i] + 'L' + w2 + ' ' + lv[i + 1] + 'M' + w1 + ' ' + lv[i] + 'L' + (-w2) + ' ' + lv[i + 1] + 'M' + (-w2) + ' ' + lv[i + 1] + 'H' + w2 + '" stroke="' + STEEL + '" stroke-width="4"/>';
  }
  g += '<path d="M-60 -170H60M-46 -210H46" stroke="' + STEEL + '" stroke-width="6"/><path d="M-60 -170l12 -12h96l12 12M-46 -210l10 -10h72l10 10" stroke="' + STEEL + '" stroke-width="4" fill="none"/></g>';
  return g;
}
function truss(x, y, s){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
    '<path d="M-90 0L0 -70L90 0Z" fill="none" stroke="' + WOOD + '" stroke-width="10" stroke-linejoin="round"/>' +
    '<path d="M0 -70V0M-45 -35L0 0L45 -35" stroke="' + WOOD + '" stroke-width="7"/>' +
    joint(-90, 0) + joint(90, 0) + joint(0, -70) + joint(0, 0) + '</g>';
}
function wall(x, y, s){
  var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><rect x="-90" y="-100" width="180" height="100" fill="#c8664a" stroke="' + INK + '" stroke-width="4"/>';
  for(var r = 0; r < 5; r++){
    g += '<path d="M-90 ' + (-r * 20) + 'H90" stroke="#efe3cf" stroke-width="3"/>';
    for(var c = 0; c < 5; c++){ var bx = -90 + c * 40 + (r % 2 ? 20 : 0); if(bx > -90 && bx < 90) g += '<path d="M' + bx + ' ' + (-r * 20) + 'V' + (-r * 20 - 20) + '" stroke="#efe3cf" stroke-width="3"/>'; }
  }
  return g + '</g>';
}

/* ---------- the arch, worked out in code ---------- */
function arch(cx, cy, r1, r2, n, keyStep, restStep){
  var g = "", i;
  for(i = 0; i < n; i++){
    var a1 = Math.PI - i * Math.PI / n, a2 = Math.PI - (i + 1) * Math.PI / n;
    var p = [[cx + r1 * Math.cos(a1), cy - r1 * Math.sin(a1)], [cx + r2 * Math.cos(a1), cy - r2 * Math.sin(a1)],
             [cx + r2 * Math.cos(a2), cy - r2 * Math.sin(a2)], [cx + r1 * Math.cos(a2), cy - r1 * Math.sin(a2)]];
    var key = i === Math.floor(n / 2);
    g += '<polygon data-s="' + (key ? keyStep : restStep) + '" points="' + p.map(function(q){ return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" ") +
      '" fill="' + (key ? ORANGE : STONE) + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>';
  }
  return g;
}

/* ---------- towers for the guess ---------- */
function testTower(w, h){
  var x = 150 - w / 2, y = 230 - h;
  return S("0 0 300 250", ground(232, 20, 280) + wind(14, 90) +
    '<g class="' + (w < 50 ? "wobble" : w < 100 ? "sway" : "") + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="' + PINK + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<path d="M' + (x + 6) + ' ' + (y + h / 3) + 'H' + (x + w - 6) + 'M' + (x + 6) + ' ' + (y + 2 * h / 3) + 'H' + (x + w - 6) + '" stroke="#fff" stroke-width="3" opacity=".6"/></g>');
}

/* ---------- leaning blocks ---------- */
function leanBlock(px, ang, col, step, label, sub){
  var g = '<g data-s="' + step + '"><rect x="' + (px - 120) + '" y="384" width="140" height="10" rx="4" fill="' + INK + '" opacity=".22"/>' +
    '<g transform="rotate(' + ang + ' ' + px + ' 380)"><rect x="' + (px - 120) + '" y="180" width="120" height="200" rx="6" fill="' + col + '" stroke="' + INK + '" stroke-width="4"/></g>';
  var t = ang * Math.PI / 180, cx = px - 60, cy = 280;
  var dx = px + (cx - px) * Math.cos(t) - (cy - 380) * Math.sin(t), dy = 380 + (cx - px) * Math.sin(t) + (cy - 380) * Math.cos(t);
  g += '<path d="M' + dx.toFixed(1) + ' ' + dy.toFixed(1) + 'V392" stroke="' + INK + '" stroke-width="3" stroke-dasharray="8 7"/>' +
    '<circle cx="' + dx.toFixed(1) + '" cy="' + dy.toFixed(1) + '" r="11" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="3"/>' +
    '<circle cx="' + px + '" cy="380" r="6" fill="' + INK + '"/>' +
    T(px - 60, 432, label, 24, { a: "middle", b: 1 }) + T(px - 60, 460, sub, 20, { a: "middle" }) + '</g>';
  return g;
}
function pisa(x, y){
  var g = '<g data-s="3"><g transform="rotate(5 ' + x + ' ' + y + ')">' +
    '<rect x="' + (x - 40) + '" y="' + (y - 260) + '" width="80" height="260" rx="6" fill="#efe7d6" stroke="' + INK + '" stroke-width="4"/>';
  for(var i = 1; i < 7; i++) g += '<path d="M' + (x - 40) + ' ' + (y - i * 37) + 'H' + (x + 40) + '" stroke="' + INK + '" stroke-width="2.5"/>';
  for(var j = 0; j < 6; j++) for(var k = 0; k < 4; k++) g += '<path d="M' + (x - 30 + k * 20) + ' ' + (y - j * 37 - 6) + 'v-18q5 -8 10 0v18" fill="none" stroke="' + STONE_D + '" stroke-width="2"/>';
  g += '<rect x="' + (x - 28) + '" y="' + (y - 292) + '" width="56" height="32" rx="5" fill="#efe7d6" stroke="' + INK + '" stroke-width="4"/></g>' +
    '<circle cx="' + (x + 11) + '" cy="' + (y - 130) + '" r="10" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="3"/>' +
    '<path d="M' + (x + 11) + ' ' + (y - 120) + 'V' + (y + 8) + '" stroke="' + INK + '" stroke-width="3" stroke-dasharray="8 7"/>' +
    T(x, y + 52, "Pisa: leaning since", 22, { a: "middle", b: 1 }) + T(x, y + 78, "the 1170s. Still up.", 22, { a: "middle", b: 1 }) + '</g>';
  return g;
}

/* ---------- material tiles ---------- */
function tile(x, y, step, name, art, squash, pull){
  var yes = function(on, yy, word){ return (on ? '<circle cx="' + (x + 30) + '" cy="' + yy + '" r="13" fill="' + TEAL + '"/><path d="M' + (x + 23) + ' ' + yy + 'l5 5l9 -10" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round"/>'
    : '<circle cx="' + (x + 30) + '" cy="' + yy + '" r="13" fill="#c9c1b3"/><path d="M' + (x + 23) + ' ' + yy + 'h14" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>') + T(x + 52, yy + 8, word, 22); };
  return '<g data-s="' + step + '"><rect x="' + x + '" y="' + y + '" width="370" height="190" rx="18" fill="#fffdf8" stroke="' + INK + '" stroke-width="4"/>' +
    T(x + 20, y + 42, name, 30, { f: 1 }) + art +
    yes(squash, y + 90, squash === 2 ? "Squashing: great" : squash ? "Squashing: good" : "Squashing: no use") +
    yes(pull, y + 130, pull === 2 ? "Pulling: great" : pull ? "Pulling: good" : "Pulling: snaps") +
    '</g>';
}

window.B5LESSON = {
  id: "ac-arch-1",
  title: "What makes it stand?",
  mins: 45,
  cover: {
    line: "Every building ever made is a deal with gravity. Today we find out the tricks.",
    art: S("0 0 700 440", A.scene(700, 440, { ground: 400, sun: [110, 80] }) + hut(130, 398, 1.1) + castle(330, 398, 1) + tower(520, 398, 1.05) + '<g class="sway">' + crane(610, 398, 0.9) + '</g>' +
      A.bonnie(250, 352, 0.55, "happy") + '<g class="float">' + A.bird(470, 140, 0.9) + '</g>')
  },

  warm: {
    wordle: { word: "BRICK", hint: "Small, rectangular, baked clay. Stack thousands and you get a house.",
      say: "Anyone can shout a word. If it stalls, Give us a clue." },
    wyr: {
      a: "Live in a castle in 1066", b: "Live in a glass tower in 3026",
      artA: S("0 0 300 240", ground(232, 20, 280) + castle(150, 230, 0.9)),
      artB: S("0 0 300 240", ground(232, 20, 280) + tower(150, 230, 0.66) + A.bird(225, 70, 0.7)),
      twist: "Most castles in 1066 were made of wood and earth, built fast. The stone ones came later. The 3026 tower has a lift. Probably.",
      say: "Tap a side for each person. Ask one person why, if they fancy saying."
    }
  },

  recap: {
    items: [
      { q: "What holds a roof up?", a: "Walls, posts or beams, carrying the weight down to the ground." },
      { q: "Name something built over 500 years ago that is still standing.", a: "Castles, cathedrals, Stonehenge. Skara Brae in Orkney is about 5,000 years old." },
      { q: "Why don't houses blow over in the wind?", a: "They are heavy, wide at the bottom and fixed into the ground with foundations." }
    ],
    say: "Take answers first, then reveal. Any sensible answer counts."
  },

  objective: {
    formal: "explain how shape, base and materials help a structure stand up.",
    mission: "Work out the secret tricks that stop buildings falling over.",
    success: [
      "Say whether something is being squashed or stretched",
      "Explain why triangles and wide bases help",
      "Spot the tricks in real buildings"
    ],
    say: "Read the mission. Ask: who has built something that fell down? Lego, sandcastles, a tower of chairs."
  },

  sections: [
    {
      kind: "hook", title: "Architects have two jobs. One of them is not falling down.", mins: 8,
      slides: [
        {
          title: "What architects do",
          text: "Architects design buildings. Every building has to do two jobs at once:",
          pts: ["Look right and work for the people inside", "<span class=\"hl\">Stay standing</span>, whatever the weather does"],
          build: true, ptsFrom: 4,
          art: S("0 0 700 420", A.scene(700, 420, { ground: 392, sun: [600, 70] }) +
            '<g data-s="1">' + hut(120, 390, 1) + T(120, 240, "5,000 years ago", 22, { a: "middle", b: 1 }) + '</g>' +
            '<g data-s="2">' + castle(340, 390, 0.85) + T(340, 150, "1,000 years ago", 22, { a: "middle", b: 1 }) + '</g>' +
            '<g data-s="3">' + tower(560, 390, 0.95) + T(560, 50, "Now", 22, { a: "middle", b: 1 }) + '</g>'),
          say: "Click through: stone hut, castle, glass tower. Ask: what has changed? What hasn't? (Gravity hasn't.)"
        },
        {
          type: "predict",
          title: "Which tower falls first?",
          q: "Same wind, same stuff, three shapes. Which one blows over first?",
          opts: [
            { t: "Tall and thin", art: testTower(36, 210) },
            { t: "Medium", art: testTower(80, 150) },
            { t: "Short and wide", art: testTower(190, 80) }
          ],
          a: 0,
          why: "Tall and thin tips over most easily. A tiny base and a lot of height means a small push goes a long way. Short and wide is the hardest to tip.",
          say: "Tap one per person. Then ask: why do you think that?"
        }
      ],
      check: {
        q: "Which pair of jobs does every building have?",
        opts: ["Look right and stay standing", "Be tall and be cheap", "Be colourful and be loud"],
        a: 0,
        why: "Look right and stay standing. Tall, cheap, colourful and loud are all optional. Falling down is not.",
        say: "Quick one. Hands up or tap."
      }
    },
    {
      kind: "explore", title: "Pushes, pulls, triangles and the dot that decides everything.", mins: 15,
      slides: [
        {
          title: "Squashed or stretched?",
          text: "Every part of a building is being pushed or pulled.",
          pts: ["<b>Squashed</b> is called <b>compression</b>", "<b>Stretched</b> is called <b>tension</b>"],
          build: true, ptsFrom: 1,
          art: S("0 0 700 420",
            '<g data-s="1"><rect x="120" y="90" width="70" height="240" rx="6" fill="' + STONE + '" stroke="' + INK + '" stroke-width="4"/>' +
              arrow(155, 14, 155, 80) + arrow(155, 406, 155, 340) + T(230, 200, "Squashed", 30, { f: 1, c: PINK }) + T(230, 236, "compression", 24) + '</g>' +
            '<g data-s="2"><path d="M420 120H640" stroke="' + WOOD + '" stroke-width="12" stroke-linecap="round"/>' +
              '<path d="M430 114q10 6 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0" stroke="#7a4f22" stroke-width="2.5" fill="none"/>' +
              arrow(424, 120, 362, 120) + arrow(636, 120, 694, 120) + T(530, 200, "Stretched", 30, { f: 1, c: TEAL, a: "middle" }) + T(530, 236, "tension", 24, { a: "middle" }) +
              A.bonnie(560, 320, 0.7) + '<path d="M500 312Q470 280 440 300" stroke="' + WOOD + '" stroke-width="6" fill="none" stroke-linecap="round"/></g>'),
          say: "Get someone to push their palms together (compression), then pull a jumper sleeve (tension)."
        },
        {
          type: "sort",
          title: "Sort it: squashed or stretched?",
          q: "Drag each one into the right box.",
          bins: ["Squashed (compression)", "Stretched (tension)"],
          cards: [
            { t: "A pillar holding up a roof", b: 0 },
            { t: "The rope on a crane", b: 1 },
            { t: "The legs of your chair", b: 0 },
            { t: "A washing line with wet clothes on", b: 1 },
            { t: "Bricks at the bottom of a wall", b: 0 },
            { t: "Cables on a suspension bridge", b: 1 }
          ],
          say: "Students come up to drag, or call it out and you drag. Next checks."
        },
        {
          title: "The triangle trick",
          text: "Push a square and it leans over. Push a triangle and it stays put.",
          pts: ["A triangle cannot change shape unless a side snaps", "Add one diagonal to a square and you get two triangles"],
          build: true, ptsFrom: 3,
          wideArt: true,
          art: S("0 0 800 420",
            '<g data-s="0">' + arrow(0, 180, 56, 180) + '</g><g data-s="1"><g class="lean">' + bar(70, 320, 210, 320) + bar(70, 180, 210, 180) + bar(70, 180, 70, 320) + bar(210, 180, 210, 320) + joint(70, 180) + joint(210, 180) + joint(70, 320) + joint(210, 320) + '</g>' + T(150, 380, "Leans over", 26, { a: "middle", b: 1, c: ORANGE }) + '</g>' +
            '<g data-s="2">' + bar(330, 320, 490, 320) + bar(330, 320, 410, 180) + bar(490, 320, 410, 180) + joint(330, 320) + joint(490, 320) + joint(410, 180) + arrow(340, 180, 396, 180) + T(410, 380, "Stays put", 26, { a: "middle", b: 1, c: TEAL }) + '</g>' +
            '<g data-s="3">' + bar(570, 320, 730, 320) + bar(570, 180, 730, 180) + bar(570, 180, 570, 320) + bar(730, 180, 730, 320) + bar(570, 320, 730, 180, ORANGE) + joint(570, 180) + joint(730, 180) + joint(570, 320) + joint(730, 320) + T(650, 380, "Braced: stays", 26, { a: "middle", b: 1, c: TEAL }) + '</g>'),
          photo: { src: "https://commons.wikimedia.org/wiki/Special:FilePath/Forth_Railway_Bridge_geograph-2988275-by-Ben-Brooksbank.jpg?width=800", alt: "The Forth Bridge in Scotland, a red steel railway bridge full of triangles", caption: "The Forth Bridge: count the triangles", credit: "Photo: Ben Brooksbank, CC BY-SA 2.0, Wikimedia Commons" },
          say: "If you have straws or lolly sticks and split pins, build a square and a triangle and push them. Otherwise act it out with arms. Tap the photo to make it bigger."
        },
        {
          type: "predict",
          title: "Odd one out",
          q: "Three of these use the triangle trick. Which one does not?",
          opts: [
            { t: "Electricity pylon", art: S("0 0 200 170", pylon(100, 166, 0.62)) },
            { t: "Roof beams", art: S("0 0 200 170", truss(100, 130, 0.95)) },
            { t: "Tower crane", art: S("-20 0 260 200", crane(80, 196, 0.6)) },
            { t: "Brick wall", art: S("0 0 200 170", wall(100, 150, 0.9)) }
          ],
          a: 3,
          why: "The brick wall. It stands up because it is heavy and the bricks overlap, so the weight spreads out. The other three are full of triangles: count them next time you pass one.",
          say: "Ask anyone who picks the wall how they knew."
        },
        {
          title: "The dot that decides",
          text: "Every object has a balance point, its <b>centre of mass</b>. Drop a line straight down from it:",
          pts: ["Lands on the base: it rocks back", "Lands past the edge: over it goes"],
          build: true, ptsFrom: 1,
          wideArt: true,
          art: S("0 0 800 480", ground(390, 10, 790) +
            leanBlock(250, 15, "#7fbfd0", 1, "Rocks back", "dot over the base") +
            leanBlock(520, 40, PINK, 2, "Over it goes", "dot past the edge") +
            pisa(690, 380)),
          photo: { src: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Leaning_Tower_of_Pisa_SB.jpeg?width=800", alt: "The Leaning Tower of Pisa", caption: "The real one, in Pisa", credit: "Photo: Saffron Blaze, CC BY-SA, Wikimedia Commons" },
          say: "Stand up, lean forward slowly until you have to take a step. That step is your dot leaving your base. Tap the photo to make it bigger."
        }
      ],
      check: {
        q: "A tall tower keeps tipping over. What would help most?",
        opts: ["Make the base wider", "Paint it a brighter colour", "Put a heavy weight on the very top", "Add a flag"],
        a: 0,
        why: "A wider base gives the dot more room before it goes past the edge. A heavy top does the opposite: it lifts the dot up, so it tips sooner.",
        say: "If anyone picks the heavy top, ask them to hold a broom upside down on their palm. Then the right way up."
      }
    },
    {
      kind: "explain", title: "Picking the right stuff, and the 2,000 year old trick.", mins: 10,
      slides: [
        {
          title: "The right stuff",
          text: "Different materials are good at different jobs.",
          stack: true, artWidth: 1040,
          art: S("0 0 800 420",
            tile(10, 10, 1, "Stone and brick", '<g transform="translate(300 52)"><rect x="-26" y="-22" width="52" height="40" fill="' + STONE + '" stroke="' + INK + '" stroke-width="3"/><path d="M-26 -2H26M0 -22V-2M-13 -2V18M13 -2V18" stroke="' + STONE_D + '" stroke-width="2"/></g>', 2, 0) +
            tile(410, 10, 2, "Steel", '<g transform="translate(700 52)"><path d="M-26 -20H26M-26 18H26M0 -20V18" stroke="' + STEEL + '" stroke-width="9"/></g>', 2, 2) +
            tile(10, 220, 3, "Wood", '<g transform="translate(300 262)"><rect x="-30" y="-14" width="60" height="28" rx="4" fill="' + WOOD + '" stroke="' + INK + '" stroke-width="3"/><path d="M-24 -4q12 -6 24 0t24 0M-24 6q12 -6 24 0t24 0" stroke="#7a4f22" stroke-width="2" fill="none"/></g>', 1, 1) +
            tile(410, 220, 4, "Rope and cable", '<g transform="translate(700 262)"><path d="M-30 0q15 -14 30 0t30 0" stroke="' + WOOD + '" stroke-width="7" fill="none" stroke-linecap="round"/></g>', 0, 2)),
          say: "Click through the four. Ask: why would a rope be no use as a pillar? (Try standing a rope up.)"
        },
        {
          type: "sort",
          title: "Best material for the job",
          q: "Stone and brick, or steel cable?",
          bins: ["Stone or brick (squashed)", "Steel cable (pulled)"],
          cards: [
            { t: "A castle wall", b: 0 },
            { t: "Holding a bridge deck up from above", b: 1 },
            { t: "The bottom of a tall chimney", b: 0 },
            { t: "The lift in a skyscraper", b: 1 },
            { t: "An arch over a doorway", b: 0 },
            { t: "A zip wire", b: 1 }
          ],
          say: "The arch card is the clue for the next slide."
        },
        {
          title: "The arch: 2,000 years of no glue",
          text: "In an arch, every stone is squashed against its neighbours. Stone is great at being squashed, so the arch holds.",
          pts: ["The <b>keystone</b> at the top goes in last and locks it", "The push runs round the curve and down into the ground"],
          build: true, ptsFrom: 2,
          art: S("0 0 700 440", ground(412, 10, 690) +
            '<rect data-s="1" x="90" y="300" width="80" height="112" fill="' + STONE + '" stroke="' + INK + '" stroke-width="4"/><rect data-s="1" x="530" y="300" width="80" height="112" fill="' + STONE + '" stroke="' + INK + '" stroke-width="4"/>' +
            arch(350, 302, 180, 260, 9, 2, 1) +
            '<g data-s="3"><path d="M350 72Q170 90 130 290" stroke="' + TEAL + '" stroke-width="6" fill="none" class="dash"/><path d="M350 72Q530 90 570 290" stroke="' + TEAL + '" stroke-width="6" fill="none" class="dash"/>' +
              arrow(130, 330, 130, 404, TEAL) + arrow(570, 330, 570, 404, TEAL) + '</g>' +
            A.jay(620, 110, 1.1, "surprised")),
          photo: { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Pont_du_Gard_BLS.jpg/800px-Pont_du_Gard_BLS.jpg", alt: "The Pont du Gard, a Roman bridge made of three rows of stone arches", caption: "Pont du Gard: Roman arches, about 2,000 years old", credit: "Photo: Benh LIEU SONG, CC BY-SA, Wikimedia Commons" },
          say: "The Romans built arches that still stand 2,000 years later. Ask: what would happen if you pulled the keystone out? Tap the photo to make it bigger."
        }
      ],
      check: {
        q: "Why can a stone arch stand up without any glue?",
        opts: ["Every stone is squashed against its neighbours", "The stones are slightly sticky", "The air holds it up", "The keystone is magnetic"],
        a: 0,
        why: "Each stone is pushed against the next, all the way round and down to the ground. All squash, no pull, which is exactly what stone is good at.",
        say: "Last check before we finish."
      }
    }
  ],

  realworld: {
    title: "Look up on the way home",
    text: "Pylons, cranes, roof beams, bridges, the climbing frame in the park: triangles, wide bases and arches everywhere. Every building you have ever been inside is winning a fight with gravity.",
    art: S("0 0 600 420", A.scene(600, 420, { ground: 400, time: "dusk", sun: [520, 110] }) + pylon(120, 398, 1.25) + '<g class="sway">' + crane(330, 398, 0.95) + '</g>' + truss(480, 398, 1.1) + '<g class="float">' + A.bird(120, 120, 0.9) + '</g>'),
    say: "Ask: where's the nearest triangle to this room? (Chair legs, roof, the window frame...)"
  },

  exit: [
    { q: "Being squashed is called...", opts: ["Compression", "Tension", "Friction"], a: 0, why: "Compression is squashing. Tension is stretching." },
    { q: "Which shape keeps its shape when you push it?", opts: ["Square", "Triangle", "Circle"], a: 1, why: "The triangle. Squares need a diagonal brace, which turns them into two triangles." },
    { q: "Which tower is hardest to tip over?", opts: ["Tall and thin", "Short and wide"], a: 1, why: "Short and wide: the dot has further to go before it passes the edge of the base." }
  ],

  driving: {
    angle: "Would you go back and watch the Romans build an arch, or forward to see what we build in 3026? Or is it better not to know?",
    opts: ["Back, to watch it built", "Forward, to see the future", "Stay here. It is warm."],
    say: "Anyone can pass. Ask for one reason from each side if anyone wants to give one."
  },

  surprise: {
    at: "sections.1.slides.2", kind: "bird", x: 1420, y: 250,
    say: "Tweet. (That is bird for: triangles. Jay, you know this.)"
  }
};
})();
