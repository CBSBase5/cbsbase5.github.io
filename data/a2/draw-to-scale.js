/* Base 5 Autumn 2 activity: Draw it to scale.
   Maths. Reading a scale plan, shrinking real lengths to plan lengths
   (worked example, then fade), drawing a room on a grid, and planning a
   whole building. ASCII only. */
(function(){
var A = window.A2ART;

function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function textW(t, sz, b){
  var w = 0;
  String(t).replace(/&[a-z#0-9]+;/g, "x").split("").forEach(function(c){
    w += /[WM]/.test(c) ? 1 : /[mw]/.test(c) ? 0.84 : /[A-Z]/.test(c) ? 0.72 : /[ijlI.,:;'!|]/.test(c) ? 0.3 : /[ frt]/.test(c) ? 0.4 : 0.62;
  });
  return w * sz * (b ? 1.08 : 1);
}
function T(x, y, t, sz, o){
  o = o || {};
  var fit = o.fit && textW(t, sz || 14, o.b) > o.fit ? ' textLength="' + o.fit + '" lengthAdjust="spacingAndGlyphs"' : "";
  return '<text x="' + x + '" y="' + y + '" font-family="Verdana,Arial,sans-serif" font-size="' + (sz || 14) + '"' +
    (o.b ? ' font-weight="700"' : "") + (o.a ? ' text-anchor="' + o.a + '"' : "") + fit + ' fill="' + (o.c || "#141a33") + '">' + t + '</text>';
}

/* a grid with a room drawn on it, seen from above.
   o: {cols, rows, sq, x, y, w, h (in squares), label, scale, door, win, thing:[x,y,w,h,label], extra} */
function grid(cols, rows, sq, ox, oy){
  var s = '<rect x="' + ox + '" y="' + oy + '" width="' + cols * sq + '" height="' + rows * sq + '" fill="#f3f9ff"/>';
  for(var c = 0; c <= cols; c++) s += '<path d="M' + (ox + c * sq) + ' ' + oy + 'v' + rows * sq + '" stroke="#b9d8f0" stroke-width="1"/>';
  for(var r = 0; r <= rows; r++) s += '<path d="M' + ox + ' ' + (oy + r * sq) + 'h' + cols * sq + '" stroke="#b9d8f0" stroke-width="1"/>';
  return s;
}
function room(ox, oy, sq, x, y, w, h, o){
  o = o || {};
  var X = ox + x * sq, Y = oy + y * sq, W = w * sq, H = h * sq, s = "";
  s += '<rect x="' + X + '" y="' + Y + '" width="' + W + '" height="' + H + '" fill="' + (o.fill || "#fff3c4") + '" stroke="#141a33" stroke-width="5"/>';
  if(o.door){ /* a gap in the bottom wall with a swing */
    var dx = X + sq * 0.5, dw = sq;
    s += '<path d="M' + dx + ' ' + (Y + H) + 'h' + dw + '" stroke="#fff3c4" stroke-width="7"/>' +
      '<path d="M' + dx + ' ' + (Y + H) + 'v' + (-dw) + '" stroke="#e04848" stroke-width="2.5"/>' +
      '<path d="M' + dx + ' ' + (Y + H - dw) + 'a' + dw + ' ' + dw + ' 0 0 1 ' + dw + ' ' + dw + '" fill="none" stroke="#e04848" stroke-width="2" stroke-dasharray="4 3"/>';
  }
  if(o.win){ /* a window: thin lines in the top wall */
    var wx = X + W / 2 - sq;
    s += '<rect x="' + wx + '" y="' + (Y - 4) + '" width="' + sq * 2 + '" height="8" fill="#ffffff" stroke="#22b8e6" stroke-width="2"/>' +
      '<path d="M' + wx + ' ' + Y + 'h' + sq * 2 + '" stroke="#22b8e6" stroke-width="2"/>';
  }
  if(o.label) s += T(X + W / 2, Y + H / 2 + 5, o.label, o.ls || 14, { b: 1, a: "middle", fit: Math.max(40, W - 12) });
  return s;
}
function plan(o){
  var sq = o.sq || 24, cols = o.cols || 16, rows = o.rows || 8, ox = 20, oy = 20;
  var W = ox * 2 + cols * sq, H = oy + rows * sq + 48;
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (o.aria || "A plan drawn on squared paper") + '">' +
    '<rect width="' + W + '" height="' + H + '" rx="14" fill="#ffffff"/>' + grid(cols, rows, sq, ox, oy) +
    room(ox, oy, sq, o.x, o.y, o.w, o.h, { door: o.door, win: o.win, label: o.label }) +
    (o.thing ? '<rect x="' + (ox + o.thing[0] * sq + 3) + '" y="' + (oy + o.thing[1] * sq + 3) + '" width="' + (o.thing[2] * sq - 6) + '" height="' + (o.thing[3] * sq - 6) + '" rx="4" fill="#9fd3ff" stroke="#1f6f9a" stroke-width="2"/>' : "") +
    /* scale key: one square = ... */
    '<rect x="' + ox + '" y="' + (oy + rows * sq + 14) + '" width="' + sq + '" height="' + sq + '" fill="#f3f9ff" stroke="#141a33" stroke-width="2"/>' +
    T(ox + sq + 10, oy + rows * sq + 32, o.scale, 15, { b: 1 }) +
    (o.extra || "") + '</svg>';
}

/* a bar showing a real length chopped into scale-sized pieces, and the plan it makes */
function chop(real, per, unit, planUnit){
  var n = real / per, whole = Math.floor(n), part = n - whole, segW = Math.min(90, 460 / Math.ceil(n)), x0 = 40, s = "";
  for(var k = 0; k < Math.ceil(n); k++){
    var w = (k < whole ? 1 : part) * segW;
    s += '<rect x="' + (x0 + k * segW) + '" y="50" width="' + w + '" height="34" fill="' + (k % 2 ? "#ffd23f" : "#ffe58a") + '" stroke="#141a33" stroke-width="2"/>' +
      (w > 30 ? T(x0 + k * segW + w / 2, 72, (k < whole ? per : real - whole * per) + " " + unit, 13, { a: "middle" }) : "");
  }
  var pw = segW * 0.45, p = "";
  for(var j = 0; j < Math.ceil(n); j++){
    var ww = (j < whole ? 1 : part) * pw;
    p += '<rect x="' + (x0 + j * pw) + '" y="138" width="' + ww + '" height="' + pw + '" fill="#9fd3ff" stroke="#141a33" stroke-width="2"/>';
  }
  return '<svg viewBox="0 0 540 ' + (160 + pw) + '" role="img" aria-label="A real length of ' + real + ' ' + unit + ' split into pieces of ' + per + ' ' + unit + ', making ' + n + ' ' + planUnit + ' on the plan">' +
    '<rect width="540" height="' + (160 + pw) + '" rx="14" fill="#f4f1ea"/>' +
    T(40, 36, "Real life: " + real + " " + unit, 15, { b: 1 }) + s + p +
    '<path d="M' + (x0 + 10) + ' 92q-6 22 -2 36" fill="none" stroke="#e04848" stroke-width="2.5"/><path d="M' + (x0 + 8) + ' 132l-6 -10h12z" fill="#e04848"/>' +
    T(x0 + 24, 116, "each " + per + " " + unit + " becomes 1 " + planUnit.replace(/s$/, ""), 14, { c: "#e04848" }) +
    T(x0 + Math.ceil(n) * pw + 16, 138 + pw / 2 + 5, "Plan: " + n + " " + planUnit, 15, { b: 1 }) +
    '</svg>';
}

/* a two step converter: real metres to centimetres to plan centimetres */
function steps(a, b, c, op1, op2){
  function box(x, t, col){ return '<rect x="' + x + '" y="44" width="120" height="56" rx="12" fill="' + col + '" stroke="#141a33" stroke-width="2.5"/>' + T(x + 60, 80, t, 18, { b: 1, a: "middle" }); }
  function arrow(x, t){ return '<path d="M' + x + ' 72h46" stroke="#141a33" stroke-width="3"/><path d="M' + (x + 52) + ' 72l-10 -6v12z" fill="#141a33"/>' + T(x + 26, 60, t, 14, { b: 1, a: "middle", c: "#e04848" }); }
  return '<svg viewBox="0 0 540 140" role="img" aria-label="' + a + ' then ' + op1 + ' gives ' + b + ', then ' + op2 + ' gives ' + c + '">' +
    '<rect width="540" height="140" rx="14" fill="#f4f1ea"/>' +
    box(20, a, "#ffe58a") + arrow(146, op1) + box(206, b, "#ffffff") + arrow(332, op2) + box(392, c, "#9fd3ff") +
    T(80, 126, "real", 13, { a: "middle" }) + T(266, 126, "real, in cm", 13, { a: "middle" }) + T(452, 126, "on the plan", 13, { a: "middle" }) +
    '</svg>';
}

/* three small plans to choose from */
function choose(list, sq, scale){
  var s = "", x = 20;
  list.forEach(function(r, k){
    var cols = r[0] + 2, rows = 8;
    s += '<g transform="translate(' + x + ' 30)">' + grid(cols, rows, sq, 0, 0) + room(0, 0, sq, 1, 1, r[0], r[1], {}) + T(cols * sq / 2, rows * sq + 22, "Plan " + "ABC".charAt(k), 15, { b: 1, a: "middle" }) + '</g>';
    x += cols * sq + 20;
  });
  return '<svg viewBox="0 0 ' + x + ' ' + (8 * sq + 90) + '" role="img" aria-label="Three plans, A, B and C, to choose from">' +
    '<rect width="' + x + '" height="' + (8 * sq + 90) + '" rx="14" fill="#ffffff"/>' + T(20, 22, scale, 14, { b: 1 }) + s + '</svg>';
}

/* the start picture: a building and its plan, with a bird's eye */
var START =
  '<svg viewBox="0 0 540 220" role="img" aria-label="A small building and its plan from above">' +
  '<rect width="540" height="220" rx="16" fill="#eef6fb"/>' +
  '<path d="M40 190V110l90 -50 90 50v80z" fill="#ff8a3d" stroke="#141a33" stroke-width="3"/><path d="M40 110l90 -50 90 50" fill="none" stroke="#7a3d14" stroke-width="6"/>' +
  '<rect x="112" y="140" width="36" height="50" fill="#7a5532" stroke="#141a33" stroke-width="2"/><rect x="60" y="124" width="34" height="28" fill="#9fd3ff" stroke="#141a33" stroke-width="2"/><rect x="166" y="124" width="34" height="28" fill="#9fd3ff" stroke="#141a33" stroke-width="2"/>' +
  '<path d="M240 125h50" stroke="#141a33" stroke-width="3" stroke-dasharray="6 5"/><path d="M296 125l-10 -6v12z" fill="#141a33"/>' +
  T(266, 112, "from above", 13, { a: "middle" }) +
  '<g transform="translate(316 50)">' + grid(9, 6, 22, 0, 0) + room(0, 0, 22, 1, 1, 7, 4, { door: true, win: true, label: "Plan" }) + '</g>' +
  T(316, 208, "1 square = 1 m", 14, { b: 1 }) +
  A.egg(A.bird(470, 30, 0.6, "#3a8fd6"), "A bird's eye view, from an actual bird. Jay is thrilled.") +
  '</svg>';

/* ---------- the drawing widget ---------- */
var TARGET = {
  mild:   { w: 6, h: 4, rw: "6 m", rh: "4 m", per: 1, scale: "1 square = 1 m", unit: "m" },
  medium: { w: 5, h: 3, rw: "10 m", rh: "6 m", per: 2, scale: "1 square = 2 m", unit: "m" },
  spicy:  { w: 15, h: 9, rw: "7.5 m", rh: "4.5 m", per: 0.5, scale: "scale 1:50, each square is 1 cm", unit: "m" }
};
function drawWidget(el, api){
  var d = api.data || {}, t = TARGET[api.level] || TARGET.medium, tk = api.tok || function(x){ return x; };
  var COLS = 20, ROWS = 12, SQ = 26, OX = 10, OY = 10;
  if(!d.r) d.r = null;
  var first = null;
  el.innerHTML = '<p class="a2task">' + tk("Draw the [[bld]] from above: " + t.rw + " long and " + t.rh + " wide. Scale: " + t.scale + ".") + '<br>Tap one corner square, then the opposite corner square.</p>' +
    '<div class="xgrid" style="max-width:560px;touch-action:manipulation"></div>' +
    '<p class="xout" aria-live="polite" style="font-weight:700;margin:8px 0"></p>' +
    '<div class="qnav" style="flex-wrap:wrap"><button type="button" class="btn btn-quiet xdoor">Add a door</button><button type="button" class="btn btn-quiet xwin">Add a window</button><button type="button" class="btn btn-quiet xclear">Start again</button></div>';
  var host = el.querySelector(".xgrid"), out = el.querySelector(".xout");
  function real(n){ var v = Math.round(n * t.per * 100) / 100; return v + " m"; }
  function draw(){
    var s = '<svg viewBox="0 0 ' + (COLS * SQ + OX * 2) + ' ' + (ROWS * SQ + OY * 2) + '" role="img" aria-label="Squared paper to draw a plan on">' +
      '<rect width="' + (COLS * SQ + OX * 2) + '" height="' + (ROWS * SQ + OY * 2) + '" rx="12" fill="#ffffff"/>' + grid(COLS, ROWS, SQ, OX, OY);
    if(d.r) s += room(OX, OY, SQ, d.r[0], d.r[1], d.r[2], d.r[3], { door: d.door, win: d.win, label: d.r[2] > 3 && d.r[3] > 1 ? tk("[[Bld]]") : "", ls: 13 });
    if(first) s += '<rect x="' + (OX + first[0] * SQ) + '" y="' + (OY + first[1] * SQ) + '" width="' + SQ + '" height="' + SQ + '" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>';
    for(var r = 0; r < ROWS; r++) for(var c = 0; c < COLS; c++)
      s += '<rect data-c="' + c + '" data-r="' + r + '" x="' + (OX + c * SQ) + '" y="' + (OY + r * SQ) + '" width="' + SQ + '" height="' + SQ + '" fill="#ffffff" fill-opacity="0" style="cursor:pointer"/>';
    host.innerHTML = s + '</svg>';
    if(first){ out.textContent = "Now tap the opposite corner."; return; }
    if(!d.r){ out.textContent = "Tap a square to start a corner."; return; }
    var w = d.r[2], h = d.r[3], match = (w === t.w && h === t.h) || (w === t.h && h === t.w);
    out.textContent = "Your plan: " + w + " by " + h + " squares, which is " + real(w) + " by " + real(h) + " in real life. " +
      (match ? tk("Spot on: that is the [[bld]] to scale.") :
        "The real room is " + t.rw + " by " + t.rh + ", so it needs " + t.w + " by " + t.h + " squares. Have another go if you like.");
  }
  host.addEventListener("click", function(e){
    var el2 = e.target;
    if(!el2 || !el2.getAttribute || el2.getAttribute("data-c") == null) return;
    var c = +el2.getAttribute("data-c"), r = +el2.getAttribute("data-r");
    if(!first){ first = [c, r]; draw(); return; }
    d.r = [Math.min(first[0], c), Math.min(first[1], r), Math.abs(c - first[0]) + 1, Math.abs(r - first[1]) + 1];
    first = null;
    try{ api.save(); }catch(err){}
    draw();
    api.done("done");
  });
  el.querySelector(".xdoor").onclick = function(){ d.door = !d.door; try{ api.save(); }catch(err){} draw(); };
  el.querySelector(".xwin").onclick = function(){ d.win = !d.win; try{ api.save(); }catch(err){} draw(); };
  el.querySelector(".xclear").onclick = function(){ d.r = null; d.door = false; d.win = false; first = null; try{ api.save(); }catch(err){} draw(); };
  draw();
}

(window.A2PACKS = window.A2PACKS || {})["draw-to-scale"] = {
  a2: true,
  id: "a2-draw-to-scale",
  title: "Draw it to scale",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 25,
  line: "Shrink a real building onto paper so every length shrinks by the same amount.",
  blurb: "Reading scale plans, shrinking real lengths to plan lengths, and drawing a building plan on a grid. Four short chunks, and a plan of your own to make at the end.",
  note: "Drawing a building plan to scale, with a grid to draw on. Four five minute chunks and a plan to make at the end. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Shed", line: "Shed: one square is one metre, or two. Count and halve." },
    { id: "medium", name: "Bungalow", line: "Bungalow: scales like 1 cm to 2 m, with halves to deal with." },
    { id: "spicy", name: "Mansion", line: "Mansion: ratio scales like 1:50 and 1:100, metres to centimetres, and picking a scale that fits." }
  ],
  themes: {
    time: { name: "Time travel", w: { bld: "time lab", room2: "control room", thing: "time machine" } },
    football: { name: "Football", w: { bld: "changing room", room2: "physio room", thing: "kit bench" } },
    horror: { name: "Horror", w: { bld: "porter's lodge", room2: "store room", thing: "night desk" } },
    fishing: { name: "Fishing", w: { bld: "boat house", room2: "tackle store", thing: "rowing boat" } },
    music: { name: "Music", w: { bld: "rehearsal room", room2: "dressing room", thing: "grand piano" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  ez: {
    realWorld: { html: "<p>Every house and school starts as a plan.</p><p>Castles were built from plans too, with no computers!</p>" },
    make: { intro: "Pick a room, its size and a scale. The card draws it." }
  },
  startFig: START,
  steps: [

    /* ---------- chunk 1: reading a scale plan ---------- */
    { type: "learn", topic: "Reading a scale plan", title: "A plan is a view from above, shrunk",
      fig: START,
      html: "<p>A <b>plan</b> shows a building from above, as a bird would see it. It is drawn <b>to scale</b>: every length is shrunk by the same amount, so the shape stays right.</p>" +
        "<p>The <b>scale</b> tells you how much. <b>1 square = 1 m</b> means each square on the plan stands for 1 metre in real life.</p>" +
        "<p>So a wall 7 squares long is <b>7 m</b> long in real life.</p>" +
        "<p>Plans use symbols: a <b>door</b> is a gap in the wall with a curve showing how it swings; a <b>window</b> is thin lines in the wall.</p>",
      ez: { title: "A plan is a view from above", html: "<p>A <b>plan</b> is a building seen from above, shrunk.</p><p><b>1 square = 1 m</b>. So 7 squares is <b>7 m</b>.</p>" },
      lv: { medium: { html: "<p>A <b>plan</b> shows a building from above, drawn <b>to scale</b>: every length shrunk by the same amount.</p>" +
          "<p>The scale tells you how much. <b>1 square = 2 m</b> means each square stands for 2 metres.</p>" +
          "<p><b>Plan to real: multiply.</b> A wall 5 squares long is 5 x 2 = <b>10 m</b>.</p>" +
          "<p>Symbols: a <b>door</b> is a gap with a curve showing the swing; a <b>window</b> is thin lines in the wall.</p>" },
        spicy: { html: "<p>A <b>plan</b> is a bird's eye view drawn to scale. Architects write the scale as a <b>ratio</b>.</p>" +
          "<p><b>1:100</b> means 1 unit on the plan is 100 of the same units in real life. So 1 cm on the plan is 100 cm, which is <b>1 m</b>.</p>" +
          "<p><b>1:200</b> means 1 cm on the plan is 200 cm, which is <b>2 m</b>.</p>" +
          "<p><b>Plan to real: multiply by the scale, then convert.</b> 6 cm at 1:200 is 6 x 200 = 1200 cm = <b>12 m</b>.</p>" +
          "<p>Doors are gaps with a swing curve; windows are thin lines in the wall.</p>" } } },

    { type: "num", topic: "Reading a scale plan", explain: true,
      q: "Here is a plan of the [[bld]]. How long is it in real life?",
      fig: plan({ cols: 14, rows: 7, x: 2, y: 1, w: 7, h: 4, door: true, win: true, label: "[[Bld]]", scale: "1 square = 1 m", aria: "A plan 7 squares long and 4 squares wide. 1 square is 1 metre." }),
      boxes: [{ label: "Length", a: 7, post: "m" }],
      slips: [[6, "Count again, touching each square along the long wall. There is one more."], [8, "One too many. Count the squares inside the wall, one at a time."], [4, "That is the short side. The length is the long side."]],
      hint: "Count the squares along the long wall. Each one is 1 m.",
      why: "7 squares, and each square is 1 m, so the [[bld]] is <b>7 m</b> long.",
      ez: { q: "How long is the [[bld]] in real life?", slips: [[null, "Count again. There is one more."], [null, "One too many. Count one at a time."], [null, "That is the short side."]],
        hint: "Count along the long wall.", why: "7 squares. So <b>7 m</b>." },
      lv: { medium: { fig: plan({ cols: 14, rows: 7, x: 2, y: 1, w: 7, h: 4, door: true, win: true, label: "[[Bld]]", scale: "1 square = 2 m", aria: "A plan 7 squares long and 4 squares wide. 1 square is 2 metres." }),
          boxes: [{ label: "Length", a: 14, post: "m" }],
          slips: [[7, "That is the number of squares. Each square is 2 m, so multiply by 2."], [3.5, "That divides. Going from plan to real life makes it bigger: multiply."], [8, "That is the short side, doubled. Use the long side."]],
          hint: "Count the squares along the long wall, then multiply by 2.",
          why: "7 squares x 2 m = <b>14 m</b>." },
        spicy: { q: "This plan is drawn on 1 cm squares at a scale of <b>1:200</b>. How long is the [[bld]] in real life, in metres?",
          fig: plan({ cols: 14, rows: 7, x: 2, y: 1, w: 6, h: 3, door: true, win: true, label: "[[Bld]]", scale: "1 square = 1 cm.  Scale 1:200", aria: "A plan 6 squares long and 3 squares wide. Each square is 1 centimetre. Scale 1 to 200." }),
          boxes: [{ label: "Length", a: 12, post: "m" }],
          slips: [[1200, "That is in centimetres. Divide by 100 to get metres."], [6, "That is the plan length. Multiply by 200 for real life."], [120, "Check the conversion: 1200 cm is 12 m, since 100 cm make 1 m."]],
          hint: "6 cm on the plan. Multiply by 200, then change cm to m.",
          why: "6 x 200 = 1200 cm, and 1200 cm = <b>12 m</b>." } } },

    { type: "num", topic: "Reading a scale plan",
      q: "Same plan. How <b>wide</b> is the [[bld]] in real life?",
      fig: plan({ cols: 14, rows: 7, x: 2, y: 1, w: 7, h: 4, door: true, win: true, label: "[[Bld]]", scale: "1 square = 1 m", aria: "A plan 7 squares long and 4 squares wide. 1 square is 1 metre." }),
      boxes: [{ label: "Width", a: 4, post: "m" }],
      slips: [[7, "That is the length. Width is the short side."], [3, "Count again along the short wall. There is one more."]],
      hint: "Count the squares along the short wall.",
      why: "4 squares, so the [[bld]] is <b>4 m</b> wide.",
      ez: { q: "How <b>wide</b> is the [[bld]]?", slips: [[null, "That is the length. Width is the short side."], [null, "Count again. There is one more."]], hint: "Count along the short wall.", why: "4 squares. So <b>4 m</b>." },
      lv: { medium: { fig: plan({ cols: 14, rows: 7, x: 2, y: 1, w: 7, h: 4, door: true, win: true, label: "[[Bld]]", scale: "1 square = 2 m", aria: "A plan 7 squares long and 4 squares wide. 1 square is 2 metres." }),
          boxes: [{ label: "Width", a: 8, post: "m" }],
          slips: [[4, "That is the number of squares. Multiply by 2."], [2, "That divides. Plan to real life: multiply."], [14, "That is the length. Width is the short side."]],
          hint: "4 squares, each 2 m.",
          why: "4 x 2 = <b>8 m</b>." },
        spicy: { q: "Same plan, 1 cm squares at 1:200. How <b>wide</b> is it in real life, in metres?",
          fig: plan({ cols: 14, rows: 7, x: 2, y: 1, w: 6, h: 3, door: true, win: true, label: "[[Bld]]", scale: "1 square = 1 cm.  Scale 1:200", aria: "A plan 6 squares long and 3 squares wide. Scale 1 to 200." }),
          boxes: [{ label: "Width", a: 6, post: "m" }],
          slips: [[600, "That is in centimetres. Divide by 100."], [3, "That is the plan width. Multiply by 200 first."], [12, "That is the length. Width is the short side."]],
          hint: "3 cm x 200, then change to metres.",
          why: "3 x 200 = 600 cm = <b>6 m</b>." } } },

    { type: "mc", topic: "Reading a scale plan",
      q: "On a plan, what does a gap in the wall with a curved line show?",
      fig: plan({ cols: 10, rows: 5, sq: 30, x: 1, y: 1, w: 6, h: 3, door: true, label: "", scale: "1 square = 1 m", aria: "A room with a gap in the bottom wall and a curved line" }),
      options: ["A door, and the way it swings", "A window", "A hole in the wall"],
      answer: 0,
      slips: { 1: "Windows are thin lines drawn in the wall, with no curve.", 2: "The curve is the clue: it shows something swinging open." },
      hint: "What swings open into a room?",
      why: "The gap is the doorway and the curve shows the door swinging open, so nobody puts a [[thing]] in its way.",
      ez: { q: "What does the gap with a curve show?", slips: { 1: "Windows are thin lines. No curve.", 2: "The curve shows something swinging." }, hint: "What swings open?", why: "A <b>door</b>. The curve shows it swing." },
      lv: { spicy: { q: "A plan is labelled <b>1:100</b>. What does that mean?",
        fig: null,
        options: ["1 cm on the plan is 100 cm in real life", "The real building is 100 cm long", "The plan is 100 times bigger than the building", "Every room is 100 m long"],
        slips: { 1: "The ratio does not tell you the size of the building, only how much it was shrunk.", 2: "It is the other way round: real life is 100 times bigger than the plan.", 3: "1:100 is about shrinking, not the size of the rooms." },
        hint: "Plan first, real life second.",
        why: "1:100: 1 unit on the plan is 100 of the same unit in real life. 1 cm stands for 100 cm, which is 1 m." } } },

    /* ---------- chunk 2: real life to plan ---------- */
    { type: "learn", topic: "Real life to plan", title: "Worked example: shrinking a wall",
      fig: chop(8, 2, "m", "squares"),
      html: "<p>Going the other way, from <b>real life to the plan</b>, you <b>divide</b>, because the plan is smaller.</p>" +
        "<p><b>Worked example.</b> A real wall is 8 m long. The scale is 1 square = 2 m.</p>" +
        "<p>How many 2 m pieces fit in 8 m? 8 &divide; 2 = <b>4</b>. So draw the wall <b>4 squares</b> long.</p>" +
        "<p>Check: 4 squares x 2 m = 8 m. Yes.</p>",
      ez: { html: "<p>Real life to plan: <b>divide</b>.</p><p>8 m wall. 1 square = 2 m. 8 &divide; 2 = <b>4 squares</b>.</p>" },
      lv: { medium: { fig: chop(9, 2, "m", "cm"),
          html: "<p>From <b>real life to the plan</b>, you <b>divide</b>: the plan is smaller.</p>" +
            "<p><b>Worked example.</b> A real wall is 9 m long. The scale is 1 cm to 2 m.</p>" +
            "<p>9 &divide; 2 = <b>4.5 cm</b>. Halves are fine: draw it four and a half squares long.</p>" +
            "<p>Check: 4.5 x 2 = 9 m. Yes.</p>" },
        spicy: { fig: steps("4 m", "400 cm", "8 cm", "x 100", "&divide; 50"),
          html: "<p>From <b>real life to the plan</b>: first make the units match, then divide by the scale.</p>" +
            "<p><b>Worked example.</b> A real wall is 4 m. The scale is <b>1:50</b>.</p>" +
            "<p>Step 1: metres to centimetres. 4 x 100 = <b>400 cm</b>.</p>" +
            "<p>Step 2: divide by the scale. 400 &divide; 50 = <b>8 cm</b> on the plan.</p>" +
            "<p>Check: 8 x 50 = 400 cm = 4 m. Yes.</p>" } } },

    { type: "num", topic: "Real life to plan",
      q: "Your turn, with the first step done. A real wall is 10 m. Scale: 1 square = 2 m.<br>10 &divide; 2 = ?",
      boxes: [{ label: "Squares", a: 5 }],
      slips: [[20, "That multiplies. The plan is smaller, so divide."], [10, "That is the real length. Divide it by 2."], [8, "That takes away 2. Divide by 2 instead."]],
      hint: "How many 2s make 10?",
      why: "10 &divide; 2 = <b>5</b> squares. Check: 5 x 2 = 10 m.",
      ez: { q: "A wall is 10 m. 1 square = 2 m.<br>10 &divide; 2 = ?", slips: [[null, "That multiplies. Divide."], [null, "That is the real length. Divide by 2."], [null, "That takes away 2. Divide by 2."]],
        why: "10 &divide; 2 = <b>5</b> squares." },
      lv: { medium: { q: "Your turn, with the sum set up. A real wall is 7 m. Scale: 1 cm to 2 m.<br>7 &divide; 2 = ?",
          boxes: [{ label: "On the plan", a: 3.5, post: "cm" }],
          slips: [[14, "That multiplies. Real to plan: divide."], [3, "Close, but 3 x 2 is only 6. There is a half left over."], [4, "4 x 2 is 8, a bit too much. Try a half."]],
          hint: "Half of 7.",
          why: "7 &divide; 2 = <b>3.5 cm</b>. Check: 3.5 x 2 = 7 m." },
        spicy: { q: "Your turn, with step 1 done. A real wall is 3 m at <b>1:50</b>.<br>Step 1: 3 m = 300 cm.<br>Step 2: 300 &divide; 50 = ?",
          boxes: [{ label: "On the plan", a: 6, post: "cm" }],
          slips: [[15000, "That multiplies. Real to plan: divide."], [0.06, "That divided the metres. Use the 300 cm."], [60, "Check: 60 x 50 is 3000, not 300."]],
          hint: "How many 50s in 300?",
          why: "300 &divide; 50 = <b>6 cm</b>. Check: 6 x 50 = 300 cm = 3 m." } } },

    { type: "num", topic: "Real life to plan",
      q: "Now on your own. A real room is 6 m long and 4 m wide. Scale: 1 square = 2 m. How many squares for each side?",
      boxes: [{ label: "Length", a: 3, post: "squares" }, { label: "Width", a: 2, post: "squares" }],
      slips: [[0, 12, "That multiplies. Divide by 2."], [0, 6, "That is the real length. Divide by 2."], [1, 8, "That multiplies. Divide by 2."], [1, 4, "That is the real width. Divide by 2."]],
      hint: "Divide each length by 2.",
      why: "6 &divide; 2 = <b>3</b> and 4 &divide; 2 = <b>2</b>. A 3 by 2 rectangle.",
      ez: { q: "A room is 6 m by 4 m. 1 square = 2 m. How many squares?", hint: "Divide each by 2.", why: "<b>3</b> by <b>2</b> squares." },
      lv: { medium: { q: "Now on your own. A real room is 9 m long and 5 m wide. Scale: 1 cm to 2 m. How long is each side on the plan?",
          boxes: [{ label: "Length", a: 4.5, post: "cm" }, { label: "Width", a: 2.5, post: "cm" }],
          slips: [[0, 18, "That multiplies. Divide by 2."], [0, 4, "Close. 4 x 2 is 8. There is a half more."], [1, 10, "That multiplies. Divide by 2."], [1, 2, "Close. 2 x 2 is 4. There is a half more."]],
          hint: "Halve each one.",
          why: "9 &divide; 2 = <b>4.5 cm</b> and 5 &divide; 2 = <b>2.5 cm</b>." },
        spicy: { q: "Now on your own. A real room is 5.5 m by 3.2 m. Scale <b>1:50</b>. How long is each side on the plan, in cm?",
          boxes: [{ label: "Length", a: 11, post: "cm" }, { label: "Width", a: 6.4, post: "cm" }],
          slips: [[0, 0.11, "That divided the metres. Change to cm first: 550 cm."], [0, 110, "Check the division: 550 &divide; 50 is 11."], [1, 0.064, "Change to cm first: 320 cm."], [1, 64, "Check the division: 320 &divide; 50 is 6.4."]],
          hint: "Change each to cm (x 100), then divide by 50.",
          why: "550 &divide; 50 = <b>11 cm</b> and 320 &divide; 50 = <b>6.4 cm</b>." } } },

    { type: "mc", topic: "Real life to plan",
      q: "A real wall is 8 m. The scale is 1 square = 2 m. Someone draws it 16 squares long. What slip did they make?",
      options: ["They multiplied instead of dividing", "They divided correctly", "They forgot to count the door"],
      answer: 0,
      slips: { 1: "16 squares would be 32 m in real life. That is far too big.", 2: "Doors do not change the length of a wall." },
      hint: "Should the plan be bigger or smaller than real life?",
      why: "8 x 2 = 16 makes it bigger. Real to plan, divide: 8 &divide; 2 = 4 squares.",
      ez: { q: "A wall is 8 m. 1 square = 2 m. Someone draws 16 squares. What slip?", slips: { 1: "16 squares would be 32 m.", 2: "Doors do not change the length." },
        hint: "Is a plan bigger or smaller?", why: "They <b>multiplied</b>. 8 &divide; 2 = 4 squares." },
      lv: { spicy: { q: "A real wall is 6 m at 1:50. Someone draws it 0.12 cm long. What slip did they make?",
        options: ["They divided the metres by 50 without changing to cm first", "They multiplied instead of dividing", "Nothing, 0.12 cm is right", "They used 1:100 instead"],
        slips: { 1: "Multiplying would give 300, not 0.12.", 2: "0.12 cm is about a millimetre. A 6 m wall would be invisible.", 3: "At 1:100 it would be 6 cm, not 0.12." },
        hint: "6 &divide; 50 = 0.12. What units were the 6 in?",
        why: "6 m is 600 cm. 600 &divide; 50 = <b>12 cm</b>. Units first, then divide." } } },

    /* ---------- chunk 3: draw it ---------- */
    { type: "learn", topic: "Draw it on the grid", title: "How to draw a plan",
      fig: plan({ cols: 14, rows: 7, x: 2, y: 1, w: 6, h: 4, door: true, win: true, label: "[[Bld]]", thing: [5.8, 1.5, 2, 0.8], scale: "1 square = 1 m",
        aria: "A finished plan: walls, a door, a window, a label and the scale written underneath",
        extra: A.egg('<g transform="translate(300 60) scale(0.45)">' + A.bonnie(0, 0, 1, "sit") + '</g>', "Bonnie's bed, drawn to scale. She thinks it should be bigger.") }),
      html: "<p>Four steps, every time:</p>" +
        "<ol><li><b>Work out</b> each length in squares (divide by the scale).</li><li><b>Draw</b> the outside walls.</li><li><b>Add</b> the door and windows.</li><li><b>Label</b> the room and write the scale.</li></ol>" +
        "<p>The blue box is the [[thing]], drawn to the same scale.</p>",
      ez: { html: "<p><b>1.</b> Work out the squares. <b>2.</b> Draw the walls.</p><p><b>3.</b> Add a door. <b>4.</b> Label it.</p>" },
      lv: { spicy: { html: "<p>Four steps, every time:</p>" +
          "<ol><li><b>Convert</b> each real length to cm, then divide by the scale.</li><li><b>Draw</b> the outside walls with a ruler (or the grid).</li><li><b>Add</b> doors, windows and anything inside, to the same scale.</li><li><b>Label</b> rooms and write the scale ratio, so anyone can read it.</li></ol>" +
          "<p>Without the scale written on it, a plan is just a picture.</p>" } } },

    { type: "widget", topic: "Draw it on the grid", unscored: true,
      title: "Draw the [[bld]]",
      html: "<p>Have a go on the squared paper. Work out the squares first, then tap two corners. Add a door and a window if you like.</p>",
      ez: { html: "<p>Work out the squares. Then tap two corners.</p>" },
      mount: drawWidget,
      report: function(d){ return d && d.r ? "Drew a plan " + d.r[2] + " by " + d.r[3] + " squares." : ""; } },

    { type: "num", topic: "Draw it on the grid",
      q: "The [[thing]] is 2 m long. Scale: 1 square = 1 m. How many squares long should it be on the plan?",
      fig: plan({ cols: 12, rows: 6, x: 1, y: 1, w: 6, h: 4, label: "", thing: [2, 2, 2, 1], scale: "1 square = 1 m", aria: "A room with a blue box inside it" }),
      boxes: [{ label: "Squares", a: 2 }],
      slips: [[1, "Each square is 1 m, so 2 m needs 2 squares."], [4, "That doubles it. 1 square is 1 m, so the number stays the same."]],
      hint: "1 square for each metre.",
      why: "2 m at 1 square = 1 m is <b>2 squares</b>.",
      ez: { q: "The [[thing]] is 2 m. 1 square = 1 m. How many squares?", slips: [[null, "2 m needs 2 squares."], [null, "That doubles it. Keep it the same."]], why: "<b>2 squares</b>." },
      lv: { medium: { q: "The [[thing]] is 3 m long. Scale: 1 square = 2 m. How many squares long should it be?",
          fig: plan({ cols: 12, rows: 6, x: 1, y: 1, w: 6, h: 4, label: "", thing: [2, 2, 1.5, 1], scale: "1 square = 2 m", aria: "A room with a blue box inside it" }),
          boxes: [{ label: "Squares", a: 1.5 }],
          slips: [[6, "That multiplies. Divide by 2."], [1, "Close. 1 square is only 2 m. There is half a square more."], [2, "2 squares would be 4 m. Try a half."]],
          hint: "3 &divide; 2.",
          why: "3 &divide; 2 = <b>1.5 squares</b>." },
        spicy: { q: "The [[thing]] is 2.5 m long. Scale 1:50, on 1 cm squares. How long should it be on the plan, in cm?",
          fig: plan({ cols: 12, rows: 6, x: 1, y: 1, w: 9, h: 4, label: "", thing: [2, 2, 5, 1], scale: "1 square = 1 cm.  Scale 1:50", aria: "A room with a blue box inside it" }),
          boxes: [{ label: "On the plan", a: 5, post: "cm" }],
          slips: [[0.05, "That divided the metres. Change to cm first: 250 cm."], [125, "That multiplies. Divide by 50."], [50, "Check: 50 x 50 is 2500, not 250."]],
          hint: "250 cm &divide; 50.",
          why: "2.5 m = 250 cm, and 250 &divide; 50 = <b>5 cm</b>." } } },

    { type: "mc", topic: "Draw it on the grid",
      q: "The [[bld]] is 6 m long and 3 m wide. The scale is 1 square = 1 m. Which plan is right?",
      fig: choose([[6, 3], [4, 3], [6, 6]], 20, "1 square = 1 m"),
      options: ["Plan A", "Plan B", "Plan C"], fixed: true,
      answer: 0,
      slips: { 1: "Count the long side of Plan B. It is only 4 squares, so 4 m.", 2: "Plan C is a square: 6 by 6. The room is 3 m wide." },
      hint: "Count the squares along each side.",
      why: "Plan A is 6 by 3 squares, which is 6 m by 3 m.",
      ez: { q: "The [[bld]] is 6 m by 3 m. 1 square = 1 m. Which plan?", slips: { 1: "Plan B is only 4 squares long.", 2: "Plan C is 6 by 6. Too wide." }, why: "<b>Plan A</b> is 6 by 3." },
      lv: { medium: { q: "The [[bld]] is 8 m long and 4 m wide. The scale is 1 square = 2 m. Which plan is right?",
          fig: choose([[8, 4], [4, 2], [6, 3]], 18, "1 square = 2 m"),
          answer: 1,
          slips: { 0: "Plan A is 8 by 4 squares: that forgot to divide by 2. It would be 16 m by 8 m.", 2: "Plan C is 6 by 3 squares, which is 12 m by 6 m." },
          hint: "Divide each length by 2 first, then count.",
          why: "8 &divide; 2 = 4 and 4 &divide; 2 = 2. Plan B is 4 by 2 squares." },
        spicy: { q: "The [[bld]] is 3 m by 1.5 m. The plans are on 1 cm squares at <b>1:50</b>. Which plan is right?",
          fig: choose([[3, 1.5], [6, 3], [5, 3]], 18, "1 square = 1 cm.  Scale 1:50"),
          answer: 1,
          slips: { 0: "Plan A is 3 cm by 1.5 cm: that is 1:100, not 1:50.", 2: "Plan C is 5 by 3. The length should be 300 &divide; 50 = 6 cm." },
          hint: "300 cm &divide; 50 and 150 cm &divide; 50.",
          why: "300 &divide; 50 = 6 cm and 150 &divide; 50 = 3 cm. Plan B is 6 by 3." } } },

    /* ---------- chunk 4: a whole building ---------- */
    { type: "learn", topic: "Plan a whole building", title: "More than one room",
      fig: '<svg viewBox="0 0 440 250" role="img" aria-label="A building with two rooms side by side">' +
        '<rect width="440" height="250" rx="14" fill="#ffffff"/>' + grid(16, 7, 24, 20, 20) +
        room(20, 20, 24, 1, 1, 6, 5, { door: true, label: "[[Bld]]", ls: 13 }) + room(20, 20, 24, 7, 1, 4, 5, { win: true, label: "[[Room2]]", ls: 13 }) +
        '<path d="M44 176h240" stroke="#e04848" stroke-width="2.5"/><path d="M44 170v12M284 170v12M188 170v12" stroke="#e04848" stroke-width="2.5"/>' +
        T(116, 200, "6 squares", 13, { a: "middle", c: "#e04848" }) + T(236, 200, "4 squares", 13, { a: "middle", c: "#e04848" }) +
        T(20, 236, "1 square = 1 m", 14, { b: 1 }) + '</svg>',
      html: "<p>A building often has rooms side by side. Draw each room to the same scale, sharing a wall.</p>" +
        "<p>The [[bld]] is 6 squares and the [[room2]] is 4 squares. The whole building is 6 + 4 = <b>10 squares</b>, so <b>10 m</b> long.</p>",
      ez: { html: "<p>Rooms can sit side by side.</p><p>6 squares + 4 squares = <b>10 m</b> long.</p>" },
      lv: { medium: { html: "<p>A building often has rooms side by side. Draw each room to the same scale, sharing a wall.</p>" +
          "<p>Work out each room, then add. If the scale were 1 square = 2 m, the 10 squares here would be 10 x 2 = <b>20 m</b>.</p>" },
        spicy: { html: "<p>Before you draw a whole building, <b>pick a scale that fits the paper</b>.</p>" +
          "<p><b>Worked example.</b> A building is 15 m long. The paper is 25 cm wide.</p>" +
          "<p>At <b>1:50</b>: 1500 &divide; 50 = 30 cm. Too wide for the paper.</p>" +
          "<p>At <b>1:100</b>: 1500 &divide; 100 = 15 cm. Fits, with room for labels.</p>" +
          "<p>Bigger second number, smaller drawing. Pick the biggest drawing that still fits.</p>" } } },

    { type: "num", topic: "Plan a whole building",
      q: "A real building has the [[bld]] (5 m) and the [[room2]] (3 m) side by side. Scale: 1 square = 1 m. How many squares long is the whole plan?",
      boxes: [{ label: "Squares", a: 8 }],
      slips: [[5, "That is just the [[bld]]. Add the [[room2]] too."], [15, "That multiplies. The rooms sit side by side, so add."], [2, "That takes away. Side by side means add."]],
      hint: "5 + 3.",
      why: "5 + 3 = <b>8 squares</b>, which is 8 m.",
      ez: { q: "1 square = 1 m. The [[bld]] is 5 m. The [[room2]] is 3 m. How many squares in all?",
        slips: [[null, "That is just the [[bld]]. Add the [[room2]]."], [null, "That multiplies. Add them."], [null, "That takes away. Add them."]], why: "5 + 3 = <b>8 squares</b>." },
      lv: { medium: { q: "A real building has the [[bld]] (7 m) and the [[room2]] (5 m) side by side. Scale: 1 square = 2 m. How many squares long is the whole plan?",
          boxes: [{ label: "Squares", a: 6 }],
          slips: [[12, "That is the real length in metres. Divide by 2."], [24, "That multiplies by 2. Real to plan: divide."], [3.5, "That is just the [[bld]]. Add the [[room2]] too."]],
          hint: "Add the real lengths, then divide by 2.",
          why: "7 + 5 = 12 m, and 12 &divide; 2 = <b>6 squares</b>." },
        spicy: { q: "The whole building is 15 m long. At <b>1:100</b>, how long is the plan?",
          boxes: [{ label: "On the plan", a: 15, post: "cm" }],
          slips: [[0.15, "That divided the metres. 15 m is 1500 cm first."], [150, "Check: 1500 &divide; 100 is 15."], [30, "That is the 1:50 drawing. This one is 1:100."]],
          hint: "1500 cm &divide; 100.",
          why: "1500 &divide; 100 = <b>15 cm</b>. It fits the 25 cm paper." } } },

    { type: "mc", topic: "Plan a whole building",
      q: "Why do builders and architects draw plans to scale?",
      options: ["So every length on paper matches the real building in the same way", "So the drawing looks more colourful", "So the building comes out smaller"],
      answer: 0,
      slips: { 1: "Colour is nice, but it does not help a builder measure.", 2: "The building is full size. Only the drawing is shrunk." },
      hint: "What does a builder need to read off a plan?",
      why: "To scale means every length shrinks the same way, so a builder can measure any wall on the plan and know the real length.",
      ez: { slips: { 1: "Colour does not help a builder measure.", 2: "Only the drawing is shrunk." }, hint: "What does a builder need?", why: "Every length shrinks the same. So builders can <b>measure</b> it." },
      lv: { spicy: { q: "A building is 18 m long. The paper is 30 cm wide. Which scale gives the <b>biggest</b> drawing that still fits?",
        options: ["1:100", "1:50", "1:200", "1:20"],
        slips: { 1: "At 1:50, 1800 &divide; 50 = 36 cm. Too wide.", 2: "At 1:200 it is 9 cm. It fits, but 1:100 is bigger and still fits.", 3: "At 1:20, 1800 &divide; 20 = 90 cm. Far too wide." },
        hint: "Work out 1800 cm divided by each scale number.",
        why: "1:100 gives 18 cm, which fits 30 cm. 1:50 gives 36 cm, too big. So <b>1:100</b>." } } },

    { type: "num", topic: "Plan a whole building", stretch: true,
      q: "The plan of a whole building is 9 squares long. Scale: 1 square = 2 m. How long is the real building?",
      boxes: [{ label: "Real length", a: 18, post: "m" }],
      slips: [[4.5, "That divides. Plan to real life: multiply."], [11, "That adds 2. Each square is 2 m, so multiply."], [9, "That is the number of squares. Multiply by 2."]],
      hint: "9 squares, each 2 m.",
      why: "9 x 2 = <b>18 m</b>.",
      ez: { q: "A plan is 9 squares. 1 square = 2 m. How long is the real building?", slips: [[null, "That divides. Plan to real: multiply."], [null, "That adds 2. Multiply."], [null, "That is the squares. Multiply by 2."]] },
      lv: { medium: { q: "The plan of a whole building is 8.5 cm long. Scale: 1 cm to 2 m. How long is the real building?",
          boxes: [{ label: "Real length", a: 17, post: "m" }],
          slips: [[4.25, "That divides. Plan to real life: multiply."], [16, "Close. Do not forget the half: 0.5 x 2 = 1 more metre."], [8.5, "That is the plan length. Multiply by 2."]],
          hint: "8 x 2, then add half of 2.",
          why: "8.5 x 2 = <b>17 m</b>." },
        spicy: { q: "A plan at <b>1:50</b> shows a wall 13 cm long. How long is the real wall, in metres?",
          boxes: [{ label: "Real length", a: 6.5, post: "m" }],
          slips: [[650, "That is in centimetres. Divide by 100."], [0.26, "That divides. Plan to real: multiply."], [65, "Check: 650 cm is 6.5 m."]],
          hint: "13 x 50, then cm to m.",
          why: "13 x 50 = 650 cm = <b>6.5 m</b>." } } }
  ],

  realWorld: {
    title: "Plans build real things",
    html: "<p>Every house, school and stadium started as a scale plan. Builders, architects, kitchen fitters and set designers all use them. Even moving house: a plan tells you if the sofa fits before you carry it up the stairs.</p>" +
      "<p>For our big question: castles and cathedrals were built hundreds of years ago from scale drawings, with no computers. If we could time travel, we could watch the builders read their plans. Would they be impressed by ours?</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay by a time portal holding up a plan">' + A.portal(80, 75, 56) + A.jay(230, 50, 0.85, "smile") +
      '<g transform="translate(300 78) rotate(-6)"><rect x="0" y="0" width="96" height="64" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' + grid(8, 5, 10, 8, 7) + room(8, 7, 10, 1, 1, 5, 3, {}) + '</g>' +
      A.bubble(290, 4, 118, 52, "Drawn to\nscale, obviously.", 300) + '</svg>'
  },

  make: {
    title: "Make your own plan",
    intro: "Pick a real building or room (yours, Base 5, or one you dream up), its real size, and a scale. The card draws it to scale. Keep it or send it to Jay.",
    fields: [
      { id: "name", label: "What is it?", ph: "My [[bld]]", max: 28 },
      { id: "len", label: "Real length in metres", ph: "8", max: 6 },
      { id: "wid", label: "Real width in metres", ph: "5", max: 6 },
      { id: "per", label: "Scale: metres per square", ph: "1", max: 5 },
      { id: "who", label: "Architect", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      function num(x, dflt){ var n = parseFloat(String(x || "").replace(/[^0-9.]/g, "")); return isFinite(n) && n > 0 ? n : dflt; }
      var L = num(v.len, 8), Wd = num(v.wid, 5), per = num(v.per, 1);
      var cols = 24, rows = 12, sq = 20, ox = 30, oy = 76;
      var w = L / per, h = Wd / per, fits = w <= cols - 1 && h <= rows - 1, tooSmall = w < 1 || h < 1;
      var s = '<rect x="' + ox + '" y="' + oy + '" width="' + cols * sq + '" height="' + rows * sq + '" fill="#f3f9ff" stroke="#9fc3e0" stroke-width="2"/>';
      for(var c = 1; c < cols; c++) s += '<path d="M' + (ox + c * sq) + ' ' + oy + 'v' + rows * sq + '" stroke="#cfe3f3" stroke-width="1"/>';
      for(var r = 1; r < rows; r++) s += '<path d="M' + ox + ' ' + (oy + r * sq) + 'h' + cols * sq + '" stroke="#cfe3f3" stroke-width="1"/>';
      var body;
      if(fits && !tooSmall){
        var X = ox + sq * Math.max(0.5, (cols - w) / 2), Y = oy + sq * Math.max(0.5, (rows - h) / 2), W = w * sq, H = h * sq;
        body = '<rect x="' + X + '" y="' + Y + '" width="' + W + '" height="' + H + '" fill="#fff3c4" stroke="#141a33" stroke-width="5"/>' +
          (W > 50 ? '<path d="M' + (X + 10) + ' ' + (Y + H) + 'h' + Math.min(20, W / 3) + '" stroke="#fff3c4" stroke-width="7"/><path d="M' + (X + 10) + ' ' + (Y + H) + 'a' + Math.min(20, W / 3) + ' ' + Math.min(20, W / 3) + ' 0 0 0 ' + Math.min(20, W / 3) + ' -' + Math.min(20, W / 3) + '" fill="none" stroke="#e04848" stroke-width="2" stroke-dasharray="4 3"/>' : "") +
          T(X + W / 2, Y - 8, L + " m", 14, { b: 1, a: "middle", c: "#e04848" }) +
          T(X + W + 8, Y + H / 2 + 5, Wd + " m", 14, { b: 1, c: "#e04848" }) +
          (H > 26 && W > 60 ? T(X + W / 2, Y + H / 2 + 6, esc(v.name), 15, { b: 1, a: "middle", fit: W - 14 }) : "");
      }else{
        body = T(ox + cols * sq / 2, oy + rows * sq / 2 - 8, tooSmall ? "A bit small to see:" : "Too big for this card:", 18, { b: 1, a: "middle" }) +
          T(ox + cols * sq / 2, oy + rows * sq / 2 + 20, tooSmall ? "try fewer metres per square" : "try more metres per square", 16, { a: "middle" });
      }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="22" fill="#1d3a6b"/>' +
        '<rect x="14" y="14" width="572" height="372" rx="14" fill="#ffffff"/>' +
        T(30, 50, "PLAN: " + esc(v.name), 22, { b: 1, c: "#1d3a6b", fit: 420 }) +
        s + body +
        '<rect x="' + ox + '" y="' + (oy + rows * sq + 14) + '" width="' + sq + '" height="' + sq + '" fill="#f3f9ff" stroke="#141a33" stroke-width="2"/>' +
        T(ox + sq + 10, oy + rows * sq + 30, "= " + per + " m", 15, { b: 1 }) +
        T(570, oy + rows * sq + 30, "Architect: " + esc(v.who), 14, { a: "end", c: "#5b6180", fit: 330 }) +
        '</svg>';
    }
  }
};
})();
