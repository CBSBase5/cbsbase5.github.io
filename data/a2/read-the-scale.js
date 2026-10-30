/* Base 5 Autumn 2 activity: Read the scale.
   Maths. Reading rulers, scales with unlabelled marks, jugs, dials and
   thermometers. Worked example then fade for the unlabelled marks.
   ASCII only. */
(function(){
var A = window.A2ART;
var FONT = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = [], out = [], cur = ""; String(t || "").split(/\s+/).forEach(function(x){ while(x.length > n){ w.push(x.slice(0, n)); x = x.slice(n); } w.push(x); }); w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }
function fmt(n){ return String(parseFloat((+n).toFixed(3))); }

/* ---------- a ruler, 0 to 15 cm. minor: 1 (cm), 2 (half cm), 10 (mm) ---------- */
function ruler(start, len, minor, bird){
  var px = 30, x0 = 30, s = '<svg viewBox="0 0 520 150" role="img" aria-label="A ruler in centimetres, with a pencil lying along it">' +
    '<rect width="520" height="150" rx="14" fill="#f4f1ea"/>' +
    '<rect x="14" y="70" width="492" height="62" rx="6" fill="#ffe58a" stroke="#141a33" stroke-width="2"/>';
  for(var i = 0; i <= 15 * minor; i++){
    var c = i / minor, x = x0 + c * px, hgt = i % minor === 0 ? 24 : (minor === 10 && i % 5 === 0 ? 16 : (minor === 2 ? 16 : 10));
    s += '<path d="M' + x + ' 70v' + hgt + '" stroke="#141a33" stroke-width="' + (i % minor === 0 ? 2 : 1.2) + '"/>';
    if(i % minor === 0) s += T(x, 116, String(c), 13, { a: "middle" });
  }
  s += T(492, 128, "cm", 13, { a: "end", c: "#5b6180" });
  var a = x0 + start * px, b = x0 + (start + len) * px;
  s += '<path d="M' + a + ' 30v40M' + b + ' 30v40" stroke="#e04848" stroke-width="2" stroke-dasharray="4 3"/>' +
    '<rect x="' + a + '" y="32" width="' + (b - a - 16) + '" height="22" fill="#3a8fd6" stroke="#141a33" stroke-width="2"/>' +
    '<rect x="' + a + '" y="32" width="10" height="22" fill="#ff8aa8" stroke="#141a33" stroke-width="2"/>' +
    '<path d="M' + (b - 16) + ' 32L' + b + ' 43L' + (b - 16) + ' 54z" fill="#f2d3a8" stroke="#141a33" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M' + (b - 5) + ' 40L' + b + ' 43L' + (b - 5) + ' 46z" fill="#141a33"/>';
  if(bird) s += A2ART.egg(A2ART.bird(486, 28, 0.55, "#19c39a"), "A bird, 4 cm tall. Jay measured it. It did not hold still.");
  return s + '</svg>';
}

/* ---------- a number line scale: labels every step, split into gaps ---------- */
function line(a, step, gaps, nLab, v, showGap){
  var x0 = 50, span = 420, per = span / (nLab - 1), max = a + step * (nLab - 1);
  function X(val){ return x0 + (val - a) / (max - a) * span; }
  var s = '<svg viewBox="0 0 520 170" role="img" aria-label="A scale from ' + fmt(a) + ' to ' + fmt(max) + ' with an arrow pointing to a mark">' +
    '<rect width="520" height="170" rx="14" fill="#f4f1ea"/>' +
    '<path d="M' + x0 + ' 110h' + span + '" stroke="#141a33" stroke-width="3"/>';
  for(var k = 0; k < nLab; k++){
    for(var g = 0; g < (k < nLab - 1 ? gaps : 1); g++){
      var x = x0 + k * per + g * per / gaps;
      s += '<path d="M' + x + ' 110v' + (g === 0 ? 26 : 14) + '" stroke="#141a33" stroke-width="' + (g === 0 ? 3 : 2) + '"/>';
    }
    s += T(x0 + k * per, 156, fmt(a + k * step), 15, { a: "middle", b: 1 });
  }
  if(showGap){
    for(var j = 0; j < gaps; j++){
      var gx = x0 + j * per / gaps, gw = per / gaps;
      s += '<path d="M' + (gx + 2) + ' 100q' + (gw / 2 - 2) + ' -16 ' + (gw - 4) + ' 0" fill="none" stroke="#19a37a" stroke-width="2.5"/>' +
        T(gx + gw / 2, 84, showGap, 13, { a: "middle", b: 1, c: "#19a37a" });
    }
  }
  if(v != null){
    var vx = X(v);
    s += '<path d="M' + vx + ' 22v66" stroke="#8a5cf6" stroke-width="4"/><path d="M' + (vx - 10) + ' 82l10 18 10 -18z" fill="#8a5cf6"/>' +
      '<circle cx="' + vx + '" cy="22" r="8" fill="#8a5cf6"/>';
  }
  return s + '</svg>';
}

/* ---------- a measuring jug (as a group). max = step * nLab ---------- */
function jugG(x, y, step, gaps, nLab, v, unit){
  var max = step * nLab, H = 200, bot = y + 230;
  function Y(val){ return bot - val / max * H; }
  var s = '<g>' +
    '<path d="M' + (x + 120) + ' ' + (y + 40) + 'q46 0 46 50v60q0 30 -46 40" fill="none" stroke="#141a33" stroke-opacity=".35" stroke-width="10"/>' +
    '<path d="M' + x + ' ' + (y + 6) + 'l-14 -8h28" fill="#e8f4fb" stroke="#141a33" stroke-width="2"/>' +
    '<rect x="' + x + '" y="' + (y + 6) + '" width="120" height="' + (bot - y - 6) + '" rx="8" fill="#e8f4fb" stroke="#141a33" stroke-width="2.5"/>';
  if(v != null && v > 0) s += '<rect x="' + (x + 2) + '" y="' + Y(v) + '" width="116" height="' + Math.max(0, bot - Y(v) - 2) + '" rx="6" fill="[[Liq]]" fill-opacity=".8"/>' +
    '<path d="M' + (x + 2) + ' ' + Y(v) + 'h116" stroke="#141a33" stroke-opacity=".5" stroke-width="2"/>';
  for(var k = 1; k <= nLab; k++){
    for(var g = 0; g < gaps; g++){
      var val = (k - 1) * step + (g + 1) * step / gaps, yy = Y(val);
      var major = g === gaps - 1;
      s += '<path d="M' + (x + 120) + ' ' + yy + 'h-' + (major ? 34 : 18) + '" stroke="#141a33" stroke-width="' + (major ? 2.5 : 1.6) + '"/>';
      if(major) s += T(x + 80, yy + 5, fmt(val), 13, { a: "end", b: 1 });
    }
  }
  return s + T(x + 60, bot + 24, unit, 14, { a: "middle", b: 1, c: "#5b6180" }) + '</g>';
}
function jug(step, gaps, nLab, v, unit, extra){
  return '<svg viewBox="0 0 480 290" role="img" aria-label="A measuring jug with a scale in ' + unit + '">' +
    '<rect width="480" height="290" rx="14" fill="#f4f1ea"/>' + jugG(170, 20, step, gaps, nLab, v, unit) + (extra || "") + '</svg>';
}

/* ---------- a dial (kitchen or bathroom scales) as a group ---------- */
function dialG(cx, cy, r, max, step, gaps, v, unit){
  function ang(val){ return (-135 + val / max * 270) * Math.PI / 180; }
  var s = '<g><circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 14) + '" fill="#e04848" stroke="#141a33" stroke-width="2.5"/>' +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#fff" stroke="#141a33" stroke-width="2"/>';
  var n = Math.round(max / step) * gaps;
  for(var i = 0; i <= n; i++){
    var val = i * step / gaps, a = ang(val), major = i % gaps === 0, l = major ? 14 : 7;
    s += '<path d="M' + (cx + r * Math.sin(a)) + ' ' + (cy - r * Math.cos(a)) + 'L' + (cx + (r - l) * Math.sin(a)) + ' ' + (cy - (r - l) * Math.cos(a)) + '" stroke="#141a33" stroke-width="' + (major ? 2.5 : 1.3) + '"/>';
    if(major) s += T(cx + (r - 28) * Math.sin(a), cy - (r - 28) * Math.cos(a) + 5, fmt(val), 13, { a: "middle", b: 1 });
  }
  s += T(cx, cy + r * 0.55, unit, 14, { a: "middle", c: "#5b6180" });
  if(v != null){ var av = ang(v); s += '<path d="M' + cx + ' ' + cy + 'L' + (cx + (r - 10) * Math.sin(av)) + ' ' + (cy - (r - 10) * Math.cos(av)) + '" stroke="#e04848" stroke-width="4" stroke-linecap="round"/>'; }
  return s + '<circle cx="' + cx + '" cy="' + cy + '" r="7" fill="#141a33"/></g>';
}
function bonnieScale(max, step, gaps, v){
  return '<svg viewBox="0 0 420 320" role="img" aria-label="Bonnie the poodle standing on a set of scales with a dial in kilograms">' +
    '<rect width="420" height="320" rx="14" fill="#f4f1ea"/>' +
    '<rect x="90" y="96" width="240" height="210" rx="20" fill="#c8ccd2" stroke="#141a33" stroke-width="2.5"/>' +
    '<rect x="100" y="84" width="220" height="16" rx="6" fill="#5b6180"/>' +
    A2ART.bonnie(215, 44, 0.8, "stand") + dialG(210, 206, 82, max, step, gaps, v, "kg") + '</svg>';
}

/* ---------- a thermometer as a group ---------- */
function thermoG(cx, lo, hi, step, gaps, v, label){
  var top = 30, bot = 230;
  function Y(val){ return bot - (val - lo) / (hi - lo) * (bot - top); }
  var s = '<g><rect x="' + (cx - 12) + '" y="' + (top - 12) + '" width="24" height="' + (bot - top + 30) + '" rx="12" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
    '<circle cx="' + cx + '" cy="' + (bot + 26) + '" r="20" fill="#e04848" stroke="#141a33" stroke-width="2.5"/>' +
    '<rect x="' + (cx - 5) + '" y="' + Y(v) + '" width="10" height="' + (bot + 20 - Y(v)) + '" fill="#e04848"/>';
  var n = Math.round((hi - lo) / step) * gaps;
  for(var i = 0; i <= n; i++){
    var val = lo + i * step / gaps, yy = Y(val), major = i % gaps === 0;
    s += '<path d="M' + (cx - 12) + ' ' + yy + 'h-' + (major ? 14 : 8) + '" stroke="#141a33" stroke-width="' + (major ? 2.2 : 1.3) + '"/>';
    if(major) s += T(cx - 32, yy + 5, fmt(val), 13, { a: "end", b: 1 });
  }
  s += T(cx + 22, top + 2, "C", 14, { b: 1, c: "#5b6180" });
  if(label) s += T(cx, bot + 70, label, 15, { a: "middle", b: 1 });
  return s + '</g>';
}
function thermo(lo, hi, step, gaps, v){
  return '<svg viewBox="0 0 420 300" role="img" aria-label="A thermometer in degrees Celsius">' + '<rect width="420" height="300" rx="14" fill="#f4f1ea"/>' +
    thermoG(220, lo, hi, step, gaps, v) + '</svg>';
}
function thermo2(lo, hi, step, gaps, va, vb){
  return '<svg viewBox="0 0 420 330" role="img" aria-label="Two thermometers, A and B">' + '<rect width="420" height="330" rx="14" fill="#f4f1ea"/>' +
    thermoG(130, lo, hi, step, gaps, va, "A") + thermoG(320, lo, hi, step, gaps, vb, "B") + '</svg>';
}

/* the three steps for scales with unlabelled marks */
var STEPS = '<svg viewBox="0 0 520 170" role="img" aria-label="Three steps: find two labels, count the gaps between them, work out each gap">' +
  '<rect width="520" height="170" rx="14" fill="#f4f1ea"/>' +
  [["1. Two labels", "next to each", "other", "#ffd23f"], ["2. Count the", "gaps between", "them", "#22b8e6"], ["3. Jump between", "labels, shared", "by the gaps", "#19c39a"]].map(function(c, k){
    var x = 16 + k * 168;
    return '<rect x="' + x + '" y="20" width="152" height="130" rx="14" fill="' + c[3] + '" fill-opacity=".3" stroke="#141a33" stroke-width="2.5"/>' +
      T(x + 76, 60, c[0], 15, { a: "middle", b: 1 }) + T(x + 76, 90, c[1], 14, { a: "middle" }) + T(x + 76, 112, c[2], 14, { a: "middle" });
  }).join("") + '</svg>';

/* ---------- widget: fill the jug ---------- */
var FILL = { mild: { step: 100, gaps: 1, n: 5, target: 400, unit: "ml" }, medium: { step: 200, gaps: 4, n: 5, target: 550, unit: "ml" }, spicy: { step: 0.5, gaps: 5, n: 4, target: 0.7, unit: "litres" } };
function fillWidget(el, api){
  var d = api.data || {}, c = FILL[api.level] || FILL.mild, inc = c.step / c.gaps, max = c.step * c.n;
  var lvKey = api.level || "mild";
  if(d.lv !== lvKey){ d.lv = lvKey; d.v = 0; d.hit = false; d.tries = 0; }
  var steps = Math.round(max / inc);
  el.innerHTML = '<p class="prompt" style="margin:0 0 6px">Fill the jug to <b>' + fmt(c.target) + ' ' + c.unit + '</b>. Slide to pour, then check, if you like.</p>' +
    '<div class="fjw" style="max-width:480px"></div>' +
    '<label style="display:flex;gap:10px;align-items:center;margin:8px 0;font-weight:700">Pour <input type="range" min="0" max="' + steps + '" step="1" style="flex:1;max-width:280px" aria-label="Amount in the jug"></label>' +
    '<button type="button" class="btn fjcheck">Check my jug</button><p class="fjout" aria-live="polite" style="font-weight:700;min-height:1.4em;margin:10px 0 0"></p>';
  var host = el.querySelector(".fjw"), rng = el.querySelector("input"), out = el.querySelector(".fjout");
  function val(){ return Math.round(+rng.value) * inc; }
  function draw(){ host.innerHTML = api.tok(jug(c.step, c.gaps, c.n, val(), c.unit)); var sv = host.querySelector("svg"); if(sv) sv.style.width = "100%"; }
  rng.value = String(Math.round((d.v || 0) / inc));
  rng.addEventListener("input", function(){ d.v = val(); out.textContent = ""; draw(); });
  el.querySelector(".fjcheck").addEventListener("click", function(){
    var v = val(), diff = Math.round((v - c.target) / inc);
    d.tries = (d.tries || 0) + 1; d.v = v;
    if(diff === 0){ d.hit = true; out.textContent = "Spot on: " + fmt(c.target) + " " + c.unit + ". Bonnie is impressed, and she is a tough critic."; }
    else out.textContent = (diff < 0 ? "A little more. " : "A little less. ") + "That is " + fmt(v) + " " + c.unit + ". Each small mark is " + fmt(inc) + " " + c.unit + ".";
    try{ api.save(); }catch(err){}
    api.done("done");
  });
  draw();
}

(window.A2PACKS = window.A2PACKS || {})["read-the-scale"] = {
  a2: true,
  id: "a2-read-the-scale",
  title: "Read the scale",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 25,
  line: "Rulers, jugs, dials and thermometers: find the labels, work out the gaps, read the mark.",
  blurb: "Reading scales: rulers, scales with marks that have no numbers, jugs, dials and thermometers. Four short chunks, a jug to fill, and your own scale to design at the end.",
  note: "Reading scales on rulers, jugs, dials and thermometers. Four five minute chunks, a jug to fill, and your own scale to design at the end. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Teaspoon", line: "Teaspoon: whole numbers, and most marks have a label." },
    { id: "medium", name: "Jugful", line: "Jugful: marks without labels that go up in 2s, 5s, 25s and 50s." },
    { id: "spicy", name: "Bucketload", line: "Bucketload: decimals, millimetres and temperatures below zero." }
  ],
  themes: {
    time: { name: "Time travel", w: { thing: "time machine key", liquid: "time machine fuel", liq: "#8a5cf6", place: "inside the time machine" } },
    football: { name: "Football", w: { thing: "referee's whistle", liquid: "sports drink", liq: "#22b8e6", place: "the stadium at kick off" } },
    horror: { name: "Horror", w: { thing: "candle", liquid: "green slime", liq: "#5fd35f", place: "the cold store at midnight" } },
    fishing: { name: "Fishing", w: { thing: "fishing float", liquid: "lake water", liq: "#3a8fd6", place: "the lake at dawn" } },
    music: { name: "Music", w: { thing: "harmonica", liquid: "warm honey and lemon", liq: "#f2b705", place: "backstage" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: ruler(0, 5, 2, true),
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Rulers", title: "Start at 0, read the other end",
      fig: ruler(0, 5, 1, true),
      html: "<p>A <b>scale</b> is a line of numbers with marks, like on a ruler.</p>" +
        "<p>To measure, line one end up with the <b>0</b>. Then read the number at the <b>other end</b>. This pencil ends at 5, so it is <b>5 cm</b> long.</p>",
      ez: { title: "Start at 0", html: "<p>Line one end up with <b>0</b>.</p><p>Read the number at the <b>other end</b>. This pencil is 5 cm.</p>" },
      lv: {
        medium: { fig: ruler(0, 4.5, 2, true),
          html: "<p>A <b>scale</b> is a line of numbers with marks. On this ruler the long marks are centimetres, and the short marks are <b>halfway</b> between.</p>" +
            "<p>Line one end up with <b>0</b>, read the other end. This pencil ends halfway between 4 and 5, so it is <b>4.5 cm</b> (four and a half).</p>" },
        spicy: { fig: ruler(0, 4.6, 10, true),
          html: "<p>On this ruler each centimetre is split into <b>10 millimetres</b>. So each small mark is <b>0.1 cm</b>, and the middle mark (a bit longer) is 0.5 cm.</p>" +
            "<p>Line one end up with <b>0</b>, read the other end. This pencil ends 6 small marks after 4, so it is <b>4.6 cm</b>, or 46 mm.</p>" } } },

    { type: "num", topic: "Rulers",
      q: "How long is this [[thing]]? Picture it lying along the ruler like the pencil.",
      fig: ruler(0, 9, 1),
      boxes: [{ label: "Length", a: 9, post: "cm" }],
      slips: [[10, "One too many. Read the number right under the tip."], [8, "Nearly. Read the number right under the tip."]],
      hint: "It starts at 0. Which number is under the tip?",
      why: "It starts at 0 and the tip is at 9, so it is <b>9 cm</b>.",
      ez: { q: "How long is this [[thing]]?", slips: [[10, "1 too many. Read the number under the tip."], [8, "Nearly. Read the number under the tip."]],
        hint: "Which number is under the tip?", why: "The tip is at 9. So <b>9 cm</b>." },
      lv: {
        medium: { fig: ruler(0, 6.5, 2), boxes: [{ label: "Length", a: 6.5, post: "cm" }],
          slips: [[6, "The tip goes past 6, to the halfway mark."], [7, "The tip stops before 7, at the halfway mark."], [6.2, "The short mark is halfway: that is .5, not .2."]],
          hint: "The tip is between two numbers, on the halfway mark.",
          why: "Halfway between 6 and 7 is <b>6.5 cm</b>." },
        spicy: { fig: ruler(0, 7.3, 10), boxes: [{ label: "Length", a: 7.3, post: "cm", alts: [] }],
          slips: [[73, "That is the length in millimetres. In centimetres it is 7 and 3 tenths."], [7.7, "Count the small marks after 7 again: it is only 3."], [7.03, "Each small mark is 0.1 cm, so 3 marks is 0.3, not 0.03."]],
          hint: "Find the last whole number before the tip, then count the small marks after it.",
          why: "7 whole centimetres and 3 small marks: <b>7.3 cm</b> (73 mm)." } } },

    { type: "num", topic: "Rulers",
      q: "Careful: this [[thing]] does <b>not</b> start at 0. How long is it?",
      fig: ruler(2, 7, 1),
      boxes: [{ label: "Length", a: 7, post: "cm" }],
      slips: [[9, "That is where the tip is. But it starts at 2, not 0. Take the 2 away."], [11, "Take away, do not add: 9 take away 2."]],
      hint: "It runs from 2 to 9. How many centimetres is that?",
      why: "From 2 to 9 is <b>7 cm</b>. Count the jumps: 3, 4, 5, 6, 7, 8, 9.",
      ez: { q: "This [[thing]] does <b>not</b> start at 0. How long is it?", slips: [[9, "It starts at 2. Take the 2 away."], [11, "Take away, do not add."]],
        hint: "It runs from 2 to 9.", why: "From 2 to 9 is <b>7 cm</b>." },
      lv: {
        medium: { fig: ruler(1, 6.5, 2), boxes: [{ label: "Length", a: 6.5, post: "cm" }],
          slips: [[7.5, "That is where the tip is. It starts at 1, so take 1 away."], [8.5, "Take the start away, do not add it."]],
          hint: "It runs from 1 to 7.5. How far is that?",
          why: "From 1 to 7.5 is <b>6.5 cm</b>." },
        spicy: { fig: ruler(3, 5.4, 10), boxes: [{ label: "Length", a: 5.4, post: "cm" }],
          slips: [[8.4, "That is where the tip is. It starts at 3, so take 3 away."], [54, "That is in millimetres. In centimetres it is 5.4."], [11.4, "Take the start away, do not add it."]],
          hint: "It runs from 3 to 8.4. Take away the start.",
          why: "8.4 take away 3 is <b>5.4 cm</b>." } } },

    { type: "mc", topic: "Rulers",
      q: "When you measure something with a ruler, where should one end of it go?",
      options: ["On the 0 mark", "At the very edge of the ruler", "On the 1 mark"],
      answer: 0,
      slips: { 1: "Lots of rulers have a little gap before the 0, so the edge is not always 0.", 2: "Starting at 1 makes everything 1 cm too long." },
      hint: "Which number means nothing measured yet?",
      why: "Start at <b>0</b>. Then the number at the other end is the length.",
      ez: { q: "Where should one end go on a ruler?", slips: { 1: "The edge is not always 0.", 2: "Starting at 1 adds 1 cm." },
        hint: "Which number means nothing yet?", why: "Start at <b>0</b>. The other end is the length." },
      lv: { spicy: { q: "Your ruler has a snapped end and starts at 4 cm. You can still use it. How?",
        options: ["Start the object at 4, then take 4 away from the reading", "Start at 4 and add 4 to the reading", "You cannot measure with it any more"],
        slips: { 1: "Starting at 4 already adds 4 to the reading, so you take it away, not add it.", 2: "You can! Any mark can be your start, as long as you take it away." },
        hint: "Think about the last question, where the start was not 0.",
        why: "Any mark can be the start. Take the start away from the end: that is the length." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Marks without numbers", title: "Worked example: work out the gaps",
      fig: line(0, 10, 2, 5, 25, "5"),
      html: "<p>Lots of scales have marks with <b>no number</b>. Here is how to read them.</p>" +
        "<p>1. Find two labels next to each other: <b>0 and 10</b>.<br>" +
        "2. Count the gaps between them: <b>2 gaps</b>.<br>" +
        "3. Share the jump between the gaps: 10 shared by 2 is <b>5</b>. Each gap is 5.<br>" +
        "4. Count on from a label: the arrow is one gap after 20, so it is 20, then <b>25</b>.</p>",
      ez: { title: "Work out the gaps", html: "<p>Some marks have <b>no number</b>. Find 2 labels. Count the <b>gaps</b>.</p><p>0 to 10 with 2 gaps: each gap is <b>5</b>.</p>" },
      lv: {
        medium: { fig: line(0, 100, 4, 5, 175, "25"),
          html: "<p>Lots of scales have marks with <b>no number</b>. Here is how to read them.</p>" +
            "<p>1. Find two labels next to each other: <b>0 and 100</b>.<br>" +
            "2. Count the gaps between them: <b>4 gaps</b>.<br>" +
            "3. Share the jump between the gaps: 100 shared by 4 is <b>25</b>. Each gap is 25.<br>" +
            "4. Count on from a label: the arrow is 3 gaps after 100, so 125, 150, <b>175</b>.</p>" },
        spicy: { fig: line(0, 1, 5, 4, 1.6, "0.2"),
          html: "<p>Scales often have marks with <b>no number</b>, and the gaps can be decimals.</p>" +
            "<p>1. Find two labels next to each other: <b>0 and 1</b>.<br>" +
            "2. Count the gaps between them: <b>5 gaps</b>.<br>" +
            "3. Share the jump between the gaps: 1 shared by 5 is <b>0.2</b>. Each gap is 0.2.<br>" +
            "4. Count on from a label: the arrow is 3 gaps after 1, so 1.2, 1.4, <b>1.6</b>.</p>" +
            "<p>Watch out: a gap is not always 0.1. Always work it out.</p>" } } },

    { type: "num", topic: "Marks without numbers",
      q: "Your turn, with steps 1 and 2 done. The labels go up in <b>10s</b>, and there are <b>2 gaps</b> between them. How much is each gap worth?",
      fig: line(0, 10, 2, 5, 35),
      boxes: [{ label: "Each gap", a: 5 }],
      slips: [[10, "That is the jump from one label to the next. Share it between the 2 gaps."], [2, "That is how many gaps. What is 10 shared by 2?"], [1, "Each gap is not 1 here. 10 shared by 2 gaps?"]],
      hint: "10 shared between 2 gaps.",
      why: "10 shared by 2 is <b>5</b>. Each gap is 5.",
      ez: { q: "Labels go up in <b>10s</b>. There are <b>2 gaps</b>. What is each gap worth?",
        slips: [[10, "Share the 10 between the 2 gaps."], [2, "That is the gaps. What is 10 shared by 2?"], [1, "Not 1 here. 10 shared by 2?"]], why: "10 shared by 2 is <b>5</b>." },
      lv: {
        medium: { q: "Your turn, with steps 1 and 2 done. The labels go up in <b>100s</b>, and there are <b>4 gaps</b> between them. How much is each gap worth?",
          fig: line(0, 100, 4, 5, 325), boxes: [{ label: "Each gap", a: 25 }],
          slips: [[100, "That is the jump between labels. Share it between 4 gaps."], [4, "That is how many gaps. What is 100 shared by 4?"], [20, "That would be 5 gaps. Count again: there are 4."], [10, "Each gap is not 10 here. 100 shared by 4?"]],
          hint: "100 shared between 4 gaps. Think of four 25p coins making a pound.",
          why: "100 shared by 4 is <b>25</b>." },
        spicy: { q: "Your turn, with steps 1 and 2 done. The labels go up in <b>1s</b>, and there are <b>5 gaps</b> between them. How much is each gap worth?",
          fig: line(0, 1, 5, 4, 2.4), boxes: [{ label: "Each gap", a: 0.2 }],
          slips: [[0.1, "0.1 would need 10 gaps. There are 5. What is 1 shared by 5?"], [5, "That is how many gaps. What is 1 shared by 5?"], [0.5, "0.5 would need 2 gaps. There are 5."]],
          hint: "1 shared between 5 gaps. Five lots of what make 1?",
          why: "1 shared by 5 is <b>0.2</b>." } } },

    { type: "num", topic: "Marks without numbers",
      q: "Now step 4 on the same scale. Each gap is 5. Where is the arrow pointing?",
      fig: line(0, 10, 2, 5, 35),
      boxes: [{ label: "Arrow", a: 35 }],
      slips: [[30, "That is the label just before. Count on one gap of 5."], [31, "Each gap is 5 here, not 1."], [40, "That is the next label. The arrow is halfway."]],
      hint: "Start at 30 and count on one gap of 5.",
      why: "30, then one gap of 5: <b>35</b>.",
      ez: { q: "Each gap is 5. Where is the arrow?", slips: [[30, "Count on 1 gap of 5."], [31, "Each gap is 5, not 1."], [40, "That is the next label."]], hint: "Start at 30. Count on 5." },
      lv: {
        medium: { q: "Now step 4 on the same scale. Each gap is 25. Where is the arrow pointing?",
          fig: line(0, 100, 4, 5, 325), boxes: [{ label: "Arrow", a: 325 }],
          slips: [[300, "That is the label before. Count on one gap of 25."], [301, "Each gap is 25 here, not 1."], [350, "That is two gaps on. Count again."]],
          hint: "Start at 300 and count on in 25s.",
          why: "300, then one gap of 25: <b>325</b>." },
        spicy: { q: "Now step 4 on the same scale. Each gap is 0.2. Where is the arrow pointing?",
          fig: line(0, 1, 5, 4, 2.4), boxes: [{ label: "Arrow", a: 2.4 }],
          slips: [[2.2, "That is one gap. Count again from 2."], [2.02, "Each gap is 0.2, not 0.01."], [2.04, "Each gap is 0.2, so two gaps is 0.4, not 0.04."], [2.8, "Count again: the arrow is 2 gaps after 2."]],
          hint: "Start at 2 and count on in 0.2s: 2.2, ...",
          why: "2, then 2.2, then <b>2.4</b>." } } },

    { type: "num", topic: "Marks without numbers", explain: true,
      q: "On your own now. A new scale. Where is the arrow pointing?",
      fig: line(0, 20, 2, 4, 50),
      boxes: [{ label: "Arrow", a: 50 }],
      slips: [[45, "Each gap is not 5 here. The labels go up in 20s, with 2 gaps."], [41, "Each gap is 10 here: 20 shared by 2."], [55, "Each gap is 10 here, not 5 or 15."]],
      hint: "Steps: two labels, count the gaps, share the jump, count on.",
      why: "Labels go up in 20s with 2 gaps, so each gap is 10. The arrow is one gap after 40: <b>50</b>.",
      ez: { q: "A new scale. Where is the arrow?", slips: [[45, "Labels go up in 20s, with 2 gaps."], [41, "Each gap is 10 here."], [55, "Each gap is 10 here."]],
        hint: "Labels, gaps, share, count on.", why: "Each gap is 10. 1 gap after 40 is <b>50</b>." },
      lv: {
        medium: { fig: line(0, 50, 5, 5, 120), boxes: [{ label: "Arrow", a: 120 }],
          slips: [[125, "Each gap is not 25 here. 50 shared by 5 gaps?"], [102, "Each gap is 10 here, not 1."], [140, "Count the gaps after 100 again."]],
          why: "Labels go up in 50s with 5 gaps, so each gap is 10. Two gaps after 100: <b>120</b>." },
        spicy: { fig: line(0, 0.5, 5, 5, 1.3), boxes: [{ label: "Arrow", a: 1.3 }],
          slips: [[1.6, "That treats each gap as 0.2. Here the labels go up in 0.5, shared by 5 gaps: 0.1."], [1.03, "Each gap is 0.1, so 3 gaps is 0.3."], [1.15, "Each gap is 0.1 here. Count the gaps after 1 again."]],
          why: "Labels go up in 0.5 with 5 gaps, so each gap is 0.1. Three gaps after 1: <b>1.3</b>." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Jugs and dials", title: "Jugs and dials are scales too",
      fig: '<svg viewBox="0 0 520 290" role="img" aria-label="A measuring jug and a round dial, both with scales">' + '<rect width="520" height="290" rx="14" fill="#f4f1ea"/>' +
        jugG(40, 20, 100, 2, 5, 300, "ml") + dialG(370, 150, 100, 1000, 200, 2, 500, "grams") + '</svg>',
      html: "<p>A <b>jug</b> is a scale standing up. Read the number level with the <b>top of the liquid</b>, with your eyes level with it too.</p>" +
        "<p>A <b>dial</b> is a scale bent into a circle. Read where the <b>pointer</b> is.</p>" +
        "<p>Same steps as before: find the labels, work out the gaps. This jug shows <b>300 ml</b>. On the dial, the labels go up in 200s with 2 gaps, so each gap is 100: it shows <b>500 grams</b>.</p>",
      ez: { html: "<p>A <b>jug</b> is a scale standing up. Read the top of the liquid.</p><p>A <b>dial</b> is a scale in a circle. Read the pointer.</p>" },
      lv: { spicy: { fig: '<svg viewBox="0 0 520 290" role="img" aria-label="A measuring jug in litres and a round dial in kilograms">' + '<rect width="520" height="290" rx="14" fill="#f4f1ea"/>' +
          jugG(40, 20, 0.5, 5, 4, 1.1, "litres") + dialG(370, 150, 100, 4, 1, 5, 2.4, "kg") + '</svg>',
        html: "<p>A <b>jug</b> is a scale standing up; read level with the top of the liquid. A <b>dial</b> is a scale bent into a circle; read where the pointer is.</p>" +
          "<p>Same steps: labels, gaps, share the jump. On the jug, 0.5 litres is split into 5 gaps, so each gap is 0.1: it shows <b>1.1 litres</b>. On the dial, 1 kg is split into 5 gaps of 0.2: it shows <b>2.4 kg</b>.</p>" } } },

    { type: "num", topic: "Jugs and dials",
      q: "How much [[liquid]] is in the jug?",
      fig: jug(100, 1, 5, 300, "ml"),
      boxes: [{ label: "Amount", a: 300, post: "ml" }],
      slips: [[3, "That is 3 marks. Each mark is worth 100 ml."], [200, "Read the label level with the top of the liquid."], [400, "Read the label level with the top of the liquid."]],
      hint: "Look straight across from the top of the liquid to the scale.",
      why: "The top of the liquid is level with <b>300 ml</b>.",
      ez: { slips: [[3, "That is 3 marks. Each is 100 ml."], [200, "Read level with the top."], [400, "Read level with the top."]], hint: "Look across from the top of the liquid." },
      lv: {
        medium: { fig: jug(200, 4, 5, 700, "ml"), boxes: [{ label: "Amount", a: 700, post: "ml" }],
          slips: [[650, "That is one gap. The liquid is two gaps above 600."], [620, "Each gap is 50 ml here: 200 shared by 4."], [602, "Each gap is 50 ml, not 1."], [750, "Count again: two gaps above 600."]],
          hint: "Labels go up in 200s with 4 gaps. What is each gap worth?",
          why: "Each gap is 200 shared by 4, which is 50 ml. Two gaps above 600: <b>700 ml</b>." },
        spicy: { fig: jug(0.5, 5, 4, 1.3, "litres"), boxes: [{ label: "Amount", a: 1.3, post: "litres", alts: [1300] }],
          slips: [[1.6, "That treats each gap as 0.2. Here 0.5 is shared by 5 gaps: 0.1."], [1.03, "Each gap is 0.1 litres, so 3 gaps is 0.3."], [1.8, "Count the gaps after 1 again: each is 0.1."]],
          hint: "Labels go up in 0.5 with 5 gaps. Each gap is ...?",
          why: "Each gap is 0.1 litres. Three gaps after 1: <b>1.3 litres</b> (1300 ml)." } } },

    { type: "num", topic: "Jugs and dials",
      q: "Bonnie is on the scales at the vet. How heavy is she?",
      fig: bonnieScale(10, 1, 1, 3),
      boxes: [{ label: "Bonnie", a: 3, post: "kg" }],
      slips: [[4, "One too many. Read the number the red pointer is on."], [2, "One too few. Read the number the red pointer is on."]],
      hint: "Follow the red pointer to the number.",
      why: "The pointer is on <b>3 kg</b>. A toy poodle, all curls and no tail.",
      ez: { slips: [[4, "1 too many. Read the red pointer."], [2, "1 too few. Read the red pointer."]], why: "The pointer is on <b>3 kg</b>. All curls, no tail." },
      lv: {
        medium: { fig: bonnieScale(5, 1, 5, 3.4), boxes: [{ label: "Bonnie", a: 3.4, post: "kg" }],
          slips: [[3.2, "Each gap is 0.2 here (1 kg shared by 5), so two gaps is 0.4."], [3.02, "Each gap is 0.2 kg, not 0.01."], [3.5, "Count the gaps after 3 again: two gaps of 0.2."]],
          hint: "1 kg is split into 5 gaps. What is each gap?",
          why: "Each gap is 0.2 kg. Two gaps after 3: <b>3.4 kg</b>." },
        spicy: { fig: bonnieScale(4, 1, 10, 2.8), boxes: [{ label: "Bonnie", a: 2.8, post: "kg", alts: [2800] }],
          slips: [[2.08, "Each gap is 0.1 kg, so 8 gaps is 0.8."], [3.2, "Count back from 3 instead: two gaps before 3."], [2.6, "Count the gaps after 2 again: there are 8."]],
          hint: "1 kg is split into 10 gaps. It might be quicker to count back from 3.",
          why: "Each gap is 0.1 kg. Two gaps before 3: <b>2.8 kg</b>." } } },

    { type: "widget", topic: "Jugs and dials", unscored: true,
      title: "Fill the jug",
      html: "<p>A jug to fill, for practice. Nothing is scored here.</p>",
      ez: { html: "<p>Fill the jug. Just for practice.</p>" },
      mount: fillWidget,
      report: function(d){ return d && d.tries ? "Fill the jug: " + (d.hit ? "got it" : "had a go") + " in " + d.tries + " tr" + (d.tries === 1 ? "y" : "ies") + "." : ""; } },

    { type: "mc", topic: "Jugs and dials",
      q: "When you read a jug, where should your eyes be?",
      fig: jug(100, 2, 5, 250, "ml", '<g transform="translate(356 66)"><path d="M-30 0q30 -22 60 0q-30 22 -60 0z" fill="#fff" stroke="#141a33" stroke-width="2.5"/><circle r="8" fill="#141a33"/></g><path d="M290 66h36" stroke="#141a33" stroke-width="2" stroke-dasharray="5 4"/>'),
      options: ["Level with the top of the liquid", "Looking down from above", "Looking up from the floor"],
      answer: 0,
      slips: { 1: "From above, the level looks lower than it is.", 2: "From below, the level looks higher than it is." },
      hint: "Crouch down so the jug and your eyes are at the same height.",
      why: "Eyes level with the top of the liquid gives the true reading.",
      ez: { q: "Reading a jug: where should your eyes be?", slips: { 1: "From above, it looks too low.", 2: "From below, it looks too high." },
        hint: "Crouch down to the jug.", why: "Level with the top. That is the true reading." },
      lv: { spicy: { q: "The top of the liquid is exactly halfway between the 1.2 and 1.3 litre marks. What is a sensible reading?",
        fig: "",
        options: ["1.25 litres", "1.5 litres", "1.23 litres", "1.2 litres exactly"],
        slips: { 1: "1.5 is halfway between the labels 1 and 2. You need halfway between 1.2 and 1.3.", 2: "Halfway between 0.2 and 0.3 is 0.25, not 0.23.", 3: "It is above 1.2, so not exactly 1.2." },
        hint: "What is halfway between 20 and 30? Now try 1.20 and 1.30.",
        why: "Halfway between 1.20 and 1.30 is <b>1.25 litres</b>." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Thermometers", title: "Read the top of the red line",
      fig: thermo(0, 40, 10, 2, 15),
      html: "<p>A <b>thermometer</b> measures temperature in <b>degrees Celsius</b> (C). Read the number level with the <b>top of the red line</b>.</p>" +
        "<p>Labels go up in 10s with 2 gaps, so each gap is 5. The red line stops one gap above 10: <b>15 degrees</b>.</p>",
      ez: { html: "<p>A <b>thermometer</b> shows temperature. Read the <b>top of the red line</b>.</p><p>Each gap is 5. It shows <b>15 degrees</b>.</p>" },
      lv: {
        medium: { fig: thermo(0, 40, 10, 5, 26),
          html: "<p>A <b>thermometer</b> measures temperature in <b>degrees Celsius</b> (C). Read level with the <b>top of the red line</b>.</p>" +
            "<p>Labels go up in 10s with 5 gaps, so each gap is <b>2 degrees</b>. The red line stops 3 gaps above 20: 22, 24, <b>26 degrees</b>.</p>" },
        spicy: { fig: thermo(-10, 20, 5, 5, -3),
          html: "<p>A <b>thermometer</b> measures temperature in <b>degrees Celsius</b> (C). Below 0 the numbers are <b>negative</b>: minus 1, minus 2, and so on, getting colder as you go down.</p>" +
            "<p>Labels go up in 5s with 5 gaps, so each gap is 1 degree. The red line stops 3 gaps <b>below</b> 0: <b>minus 3</b>, written -3.</p>" } } },

    { type: "num", topic: "Thermometers",
      q: "What is the temperature at [[place]]?",
      fig: thermo(0, 40, 10, 2, 25),
      boxes: [{ label: "Temperature", a: 25, post: "degrees C" }],
      slips: [[20, "That is the label below. The red line goes one gap higher."], [30, "That is the label above. The red line stops halfway."], [21, "Each gap is 5 here, not 1."]],
      hint: "Each gap is 5. Count on from 20.",
      why: "One gap of 5 above 20: <b>25 degrees</b>.",
      ez: { slips: [[20, "The red line goes 1 gap higher."], [30, "The red line stops halfway."], [21, "Each gap is 5, not 1."]] },
      lv: {
        medium: { fig: thermo(0, 40, 10, 5, 18), boxes: [{ label: "Temperature", a: 18, post: "degrees C" }],
          slips: [[14, "Each gap is 2 degrees, not 1."], [16, "Count the gaps above 10 again: there are 4."], [19, "Each gap is 2 degrees. Try counting back from 20."]],
          hint: "Each gap is 2. It is quicker to count back from 20.",
          why: "One gap of 2 below 20: <b>18 degrees</b>." },
        spicy: { fig: thermo(-10, 20, 5, 5, -4), boxes: [{ label: "Temperature", a: -4, post: "degrees C" }],
          slips: [[4, "The red line is below 0, so it is minus 4, written -4."], [-6, "Count down from 0: -1, -2, -3, -4."], [-1, "Count all the gaps below 0: there are 4."]],
          hint: "Start at 0 and count down the gaps.",
          why: "Four gaps below 0: <b>-4 degrees</b>. Brrr." } } },

    { type: "mc", topic: "Thermometers",
      q: "Which thermometer shows the <b>warmer</b> temperature?",
      fig: thermo2(0, 40, 10, 2, 15, 30),
      options: ["B", "A"], answer: 0, fixed: true,
      slips: { 1: "A reaches 15. B reaches 30. The higher the red line, the warmer." },
      hint: "The higher the red line, the warmer it is.",
      why: "B reaches 30 degrees and A reaches 15. B is warmer.",
      ez: { slips: { 1: "A is 15. B is 30. Higher is warmer." }, why: "B is 30. A is 15. B is warmer." },
      lv: {
        medium: { fig: thermo2(0, 40, 10, 5, 22, 18), options: ["A", "B"],
          slips: { 1: "B reaches 18. A reaches 22. The higher the red line, the warmer." },
          why: "A reads 22 degrees and B reads 18. A is warmer." },
        spicy: { q: "Which thermometer shows the <b>colder</b> temperature?",
          fig: thermo2(-10, 20, 5, 5, -3, 2), options: ["A", "B"],
          slips: { 1: "B is 2 degrees, above 0. A is below 0." },
          hint: "The lower the red line, the colder.",
          why: "A reads -3 and B reads 2. A is colder: it is below freezing." } } },

    { type: "num", topic: "Thermometers", explain: true,
      q: "Same two thermometers. How many degrees warmer is B than A?",
      fig: thermo2(0, 40, 10, 2, 15, 30),
      boxes: [{ label: "Difference", a: 15, post: "degrees" }],
      slips: [[45, "That is adding them. Count up from 15 to 30 instead."], [3, "Count degrees, not gaps. Each gap is 5."]],
      hint: "Count up from 15 to 30.",
      why: "From 15 to 30 is <b>15 degrees</b>.",
      ez: { q: "How many degrees warmer is B than A?", slips: [[45, "That adds them. Count up from 15 to 30."], [3, "Count degrees, not gaps."]] },
      lv: {
        medium: { q: "Same two thermometers. How many degrees warmer is A than B?",
          fig: thermo2(0, 40, 10, 5, 22, 18), boxes: [{ label: "Difference", a: 4, post: "degrees" }],
          slips: [[2, "Count degrees, not gaps. Each gap is 2 degrees."], [40, "That is adding them. Count up from 18 to 22."]],
          hint: "Count up from 18 to 22.",
          why: "18 to 22 is <b>4 degrees</b>." },
        spicy: { q: "Same two thermometers. How many degrees warmer is B than A?",
          fig: thermo2(-10, 20, 5, 5, -3, 2), boxes: [{ label: "Difference", a: 5, post: "degrees" }],
          slips: [[1, "That is 3 take away 2. From -3 up to 0 is 3 degrees, then 2 more."], [-1, "That is -3 add 2. Count the jumps from -3 up to 2 instead."], [-5, "The answer is how many degrees apart, so it is positive."]],
          hint: "Count up from -3 to 0, then on to 2.",
          why: "-3 up to 0 is 3 degrees, then 0 up to 2 is 2 more: <b>5 degrees</b>." } } }
  ],

  ez: {
    realWorld: { html: "<p>Chefs, nurses, builders and vets all read <b>scales</b>.</p><p>Time travel? Pack a ruler. People once measured with their feet!</p>" },
    make: { intro: "Pick a start, the labels and the gaps. The picture draws it. Try to trick Jay!" }
  },

  realWorld: {
    title: "Scales are everywhere",
    html: "<p>Chefs read jugs and kitchen scales, nurses read thermometers, builders read tape measures, and vets read the dial when a dog like Bonnie hops on. Getting the gaps right is the whole job.</p>" +
      "<p>For our big question: if we could time travel, should we? Pack a ruler. Long ago, people measured with their bodies: a foot was a real foot, and horses are still measured in hands. Your 30 cm might be someone's 2 feet, or 7 hands.</p>",
    fig: '<svg viewBox="0 0 440 170" role="img" aria-label="Jay by a time portal, next to a ruler and a foot">' + '<rect width="440" height="170" rx="14" fill="#f4f1ea"/>' +
      A2ART.portal(76, 84, 58) + A2ART.jay(214, 56, 0.85, "smile") +
      '<rect x="290" y="120" width="130" height="26" rx="4" fill="#ffe58a" stroke="#141a33" stroke-width="2"/><path d="M300 120v10M313 120v6M326 120v10M339 120v6M352 120v10M365 120v6M378 120v10M391 120v6M404 120v10" stroke="#141a33" stroke-width="1.5"/>' +
      A2ART.bubble(280, 14, 150, 52, "Unhand me,\nmeasuring tape.", 300) + '</svg>'
  },

  make: {
    title: "Design your own scale",
    intro: "Choose where it starts, what the labels go up in, and how many gaps go between them. The picture draws it, and tells you what each gap is worth. Try to trick Jay, if you like.",
    fields: [
      { id: "what", label: "What it measures", ph: "Bonnie's dinner, in grams", max: 40 },
      { id: "start", label: "Start at", ph: "0", max: 6 },
      { id: "step", label: "Labels go up in", ph: "50", max: 6 },
      { id: "gaps", label: "Gaps between labels (1 to 10)", ph: "5", max: 2 },
      { id: "name", label: "Designed by", ph: "Scale Boss", max: 24 }
    ],
    svg: function(v){
      var a = parseFloat(v.start), st = parseFloat(v.step), g = Math.round(parseFloat(v.gaps));
      if(!isFinite(a)) a = 0;
      if(!isFinite(st) || st === 0) st = 10;
      if(!isFinite(g) || g < 1) g = 1;
      if(g > 10) g = 10;
      var x0 = 60, span = 480, n = 5, per = span / (n - 1), s = "";
      for(var k = 0; k < n; k++){
        for(var j = 0; j < (k < n - 1 ? g : 1); j++){
          var x = x0 + k * per + j * per / g;
          s += '<path d="M' + x + ' 200v' + (j === 0 ? 36 : 20) + '" stroke="#141a33" stroke-width="' + (j === 0 ? 4 : 2.5) + '"/>';
        }
        s += T(x0 + k * per, 268, esc(fmt(a + k * st)), 20, { a: "middle", b: 1 });
      }
      var gapTxt = "Each small gap is worth " + fmt(st / g);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#fffbe9"/>' +
        '<rect x="14" y="14" width="572" height="372" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        T(40, 62, "MY SCALE", 22, { b: 1, c: "#8a5cf6" }) +
        wrap(v.what, 34, 2).map(function(l, k){ return T(40, 100 + k * 30, esc(l), 24, { b: 1 }); }).join("") +
        '<rect x="40" y="186" width="520" height="100" rx="10" fill="#ffe58a" stroke="#141a33" stroke-width="2.5"/>' +
        '<path d="M' + x0 + ' 200h' + span + '" stroke="#141a33" stroke-width="4"/>' + s +
        T(40, 326, esc(gapTxt), 18, { c: "#19a37a", b: 1 }) +
        T(40, 360, "Designed by " + esc(wrap(v.name, 24, 1)[0] || ""), 16, { c: "#5b6180" }) +
        '</svg>';
    }
  }
};
})();
