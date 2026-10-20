/* Base 5 Autumn 2 activity: L shaped floors.
   Maths. Area of shapes made from rectangles, like a floor plan:
   split it, find missing lengths, add (or take away). ASCII only. */
(function(){
var A = window.A2ART;
var FONT = 'font-family="Verdana,Arial,sans-serif"';
var INK = "#141a33";
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + (o.h ? ' stroke="#fdf7e8" stroke-width="4" stroke-linejoin="round" paint-order="stroke"' : '') + ' fill="' + (o.c || INK) + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }
function r2(x){ return String(+(+x).toFixed(2)); }

/* ---------- the L shape drawer ----------
   An outer W by H rectangle with a cw by ch corner missing at the top right.
   Sides: top, inv (inner up and down), inh (inner across), right, bottom, left.
   o.hide: sides shown as "?"; o.split: "v" | "h"; o.areas: [textA, textB];
   o.grid: draw the unit squares; o.ghost: show the missing corner, hatched. */
function L(o){
  var W = o.W, H = o.H, cw = o.cw, ch = o.ch, u = o.unit == null ? " m" : o.unit;
  var s = Math.min(330 / W, 168 / H), ox = (520 - W * s) / 2, oy = 34 + (178 - H * s) / 2;
  function X(x){ return +(ox + x * s).toFixed(1); }
  function Y(y){ return +(oy + y * s).toFixed(1); }
  var len = { top: W - cw, inv: ch, inh: cw, right: H - ch, bottom: W, left: H };
  var hide = o.hide || [];
  function lab(k){ return hide.indexOf(k) >= 0 ? "?" : (o.lab && o.lab[k] != null) ? o.lab[k] : (r2(len[k]) + u); }
  function labCol(k){ return hide.indexOf(k) >= 0 ? "#e04848" : INK; }
  var out = '<svg viewBox="0 0 520 260" role="img" aria-label="' + (o.aria || "An L shaped floor plan") + '">' +
    '<rect width="520" height="260" rx="16" fill="' + (o.bg || "#f4f1ea") + '"/>';
  if(o.ghost){
    out += '<rect x="' + X(W - cw) + '" y="' + Y(0) + '" width="' + +(cw * s).toFixed(1) + '" height="' + +(ch * s).toFixed(1) + '" fill="#ffd9d9" stroke="#e04848" stroke-width="2.5" stroke-dasharray="7 5"/>' +
      T((X(W - cw) + X(W)) / 2, (Y(0) + Y(ch)) / 2 + 5, o.ghost, 13, { b: 1, a: "middle", c: "#b03030" });
  }
  var path = "M" + X(0) + " " + Y(0) + "H" + X(W - cw) + "V" + Y(ch) + "H" + X(W) + "V" + Y(H) + "H" + X(0) + "Z";
  if(o.split === "v"){
    out += '<rect x="' + X(0) + '" y="' + Y(0) + '" width="' + +((W - cw) * s).toFixed(1) + '" height="' + +(H * s).toFixed(1) + '" fill="#ffd23f" fill-opacity=".55"/>' +
      '<rect x="' + X(W - cw) + '" y="' + Y(ch) + '" width="' + +(cw * s).toFixed(1) + '" height="' + +((H - ch) * s).toFixed(1) + '" fill="#22b8e6" fill-opacity=".45"/>';
  } else if(o.split === "h"){
    out += '<rect x="' + X(0) + '" y="' + Y(0) + '" width="' + +((W - cw) * s).toFixed(1) + '" height="' + +(ch * s).toFixed(1) + '" fill="#ffd23f" fill-opacity=".55"/>' +
      '<rect x="' + X(0) + '" y="' + Y(ch) + '" width="' + +(W * s).toFixed(1) + '" height="' + +((H - ch) * s).toFixed(1) + '" fill="#22b8e6" fill-opacity=".45"/>';
  } else {
    out += '<path d="' + path + '" fill="' + (o.fill || "#fde7b0") + '"/>';
  }
  if(o.grid){
    for(var gx = 0; gx < W; gx++) for(var gy = 0; gy < H; gy++){
      if(gx >= W - cw && gy < ch) continue;
      out += '<rect x="' + X(gx) + '" y="' + Y(gy) + '" width="' + +s.toFixed(1) + '" height="' + +s.toFixed(1) + '" fill="none" stroke="' + INK + '" stroke-opacity=".25" stroke-width="1.5"/>';
    }
  }
  out += '<path d="' + path + '" fill="none" stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round"/>';
  if(o.split === "v") out += '<path d="M' + X(W - cw) + ' ' + Y(ch) + 'V' + Y(H) + '" stroke="#e04848" stroke-width="3.5" stroke-dasharray="9 6"/>';
  if(o.split === "h") out += '<path d="M' + X(0) + ' ' + Y(ch) + 'H' + X(W - cw) + '" stroke="#e04848" stroke-width="3.5" stroke-dasharray="9 6"/>';
  if(o.areas){
    var ca = o.split === "h" ? [(X(0) + X(W - cw)) / 2, (Y(0) + Y(ch)) / 2] : [(X(0) + X(W - cw)) / 2, (Y(0) + Y(H)) / 2];
    var cb = o.split === "h" ? [(X(0) + X(W)) / 2, (Y(ch) + Y(H)) / 2] : [(X(W - cw) + X(W)) / 2, (Y(ch) + Y(H)) / 2];
    out += T(ca[0], ca[1] + 6, o.areas[0], 16, { b: 1, a: "middle" }) + T(cb[0], cb[1] + 6, o.areas[1], 16, { b: 1, a: "middle" });
  }
  if(!o.nolabels){
    out += T((X(0) + X(W - cw)) / 2, Y(0) - 9, lab("top"), 15, { b: 1, h: 1, a: "middle", c: labCol("top") }) +
      T(X(W - cw) - 8, (Y(0) + Y(ch)) / 2 + 5, lab("inv"), 15, { b: 1, h: 1, a: "end", c: labCol("inv") }) +
      T((X(W - cw) + X(W)) / 2, Y(ch) - 9, lab("inh"), 15, { b: 1, h: 1, a: "middle", c: labCol("inh") }) +
      T(X(W) + 8, (Y(ch) + Y(H)) / 2 + 5, lab("right"), 15, { b: 1, h: 1, c: labCol("right") }) +
      T((X(0) + X(W)) / 2, Y(H) + 22, lab("bottom"), 15, { b: 1, h: 1, a: "middle", c: labCol("bottom") }) +
      T(X(0) - 8, (Y(0) + Y(H)) / 2 + 5, lab("left"), 15, { b: 1, h: 1, a: "end", c: labCol("left") });
  }
  return out + (o.extra || "") + '</svg>';
}

/* a plain rectangle, optionally on a grid */
function R(w, h, grid, note){
  var s = Math.min(300 / w, 150 / h), ox = (520 - w * s) / 2, oy = 34 + (164 - h * s) / 2, out = "";
  out += '<svg viewBox="0 0 520 250" role="img" aria-label="A rectangle ' + w + ' by ' + h + '"><rect width="520" height="250" rx="16" fill="#f4f1ea"/>' +
    '<rect x="' + ox + '" y="' + oy + '" width="' + w * s + '" height="' + h * s + '" fill="#fde7b0"/>';
  if(grid) for(var i = 0; i < w; i++) for(var j = 0; j < h; j++) out += '<rect x="' + (ox + i * s) + '" y="' + (oy + j * s) + '" width="' + s + '" height="' + s + '" fill="none" stroke="' + INK + '" stroke-opacity=".25" stroke-width="1.5"/>';
  out += '<rect x="' + ox + '" y="' + oy + '" width="' + w * s + '" height="' + h * s + '" fill="none" stroke="' + INK + '" stroke-width="3.5"/>' +
    T(260, oy - 10, r2(w) + " m", 15, { b: 1, a: "middle" }) + T(ox - 8, oy + h * s / 2 + 5, r2(h) + " m", 15, { b: 1, a: "end" });
  if(note) out += T(260, 238, note, 15, { b: 1, a: "middle", c: "#1f9d63" });
  return out + '</svg>';
}

/* two rooms side by side */
function TWO(a, b){
  function room(x, w, h, name){
    var s = 20;
    return '<rect x="' + x + '" y="' + (190 - h * s) + '" width="' + w * s + '" height="' + h * s + '" fill="#fde7b0" stroke="' + INK + '" stroke-width="3"/>' +
      T(x + w * s / 2, 190 - h * s / 2 + 6, name, 20, { b: 1, a: "middle" }) +
      T(x + w * s / 2, 212, r2(w) + " m", 14, { a: "middle" }) + T(x - 6, 190 - h * s / 2 + 5, r2(h) + " m", 14, { a: "end" });
  }
  return '<svg viewBox="0 0 520 230" role="img" aria-label="Two rectangular rooms, A and B"><rect width="520" height="230" rx="16" fill="#f4f1ea"/>' +
    room(60, a[0], a[1], "A") + room(300, b[0], b[1], "B") + '</svg>';
}

/* the area idea: squares inside */
var AREA_IDEA = R(5, 3, true, "5 x 3 = 15 squares");

/* three cut lines on one L */
function CUTS(){
  var W = 7, H = 5, cw = 3, ch = 2, s = 30, ox = 155, oy = 40;
  function X(x){ return ox + x * s; } function Y(y){ return oy + y * s; }
  var path = "M" + X(0) + " " + Y(0) + "H" + X(W - cw) + "V" + Y(ch) + "H" + X(W) + "V" + Y(H) + "H" + X(0) + "Z";
  return '<svg viewBox="0 0 520 250" role="img" aria-label="An L shape with three possible cut lines: A, B and C">' +
    '<rect width="520" height="250" rx="16" fill="#f4f1ea"/><path d="' + path + '" fill="#fde7b0" stroke="' + INK + '" stroke-width="3.5"/>' +
    '<path d="M' + X(4) + ' ' + Y(0) + 'V' + Y(H) + '" stroke="#e04848" stroke-width="3.5" stroke-dasharray="9 6"/>' + T(X(4), Y(H) + 26, "A", 18, { b: 1, a: "middle", c: "#e04848" }) +
    '<path d="M' + X(0) + ' ' + Y(0) + 'L' + X(W) + ' ' + Y(H) + '" stroke="#3a8fd6" stroke-width="3.5" stroke-dasharray="9 6"/>' + T(X(W) + 14, Y(H) + 8, "B", 18, { b: 1, c: "#3a8fd6" }) +
    '<path d="M' + X(2) + ' ' + Y(0) + 'V' + Y(H) + '" stroke="#8a5cf6" stroke-width="3.5" stroke-dasharray="9 6"/>' + T(X(2), Y(H) + 26, "C", 18, { b: 1, a: "middle", c: "#8a5cf6" }) +
    '</svg>';
}

/* missing lengths: the two top bits make the bottom */
var MISSING = '<svg viewBox="0 0 520 270" role="img" aria-label="The top length and the inner length together make the bottom length">' +
  '<rect width="520" height="270" rx="16" fill="#f4f1ea"/>' +
  '<path d="M110 40H290V112H410V208H110Z" fill="#fde7b0" stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round"/>' +
  '<path d="M110 30H290" stroke="#e04848" stroke-width="6"/><path d="M290 102H410" stroke="#3a8fd6" stroke-width="6"/><path d="M110 220H410" stroke="#1f9d63" stroke-width="6"/>' +
  T(200, 22, "6 m", 15, { b: 1, a: "middle", c: "#e04848" }) + T(350, 94, "? m", 15, { b: 1, a: "middle", c: "#3a8fd6" }) + T(260, 242, "10 m", 15, { b: 1, a: "middle", c: "#1f9d63" }) +
  T(260, 264, "6 + ? = 10, so ? = 10 - 6 = 4 m", 14, { a: "middle" }) +
  '<path d="M100 40V208" stroke="#8a5cf6" stroke-width="6"/><path d="M420 112V208" stroke="#ff8a3d" stroke-width="6"/><path d="M300 40V112" stroke="#ff8a3d" stroke-width="6"/>' +
  T(92, 130, "7 m", 15, { b: 1, a: "end", c: "#8a5cf6" }) + T(428, 165, "4 m", 15, { b: 1, c: "#ff8a3d" }) + T(308, 80, "?", 15, { b: 1, c: "#ff8a3d" }) +
  T(470, 40, "4 + ? = 7", 14, { a: "middle" }) + T(470, 60, "? = 3 m", 14, { b: 1, a: "middle" }) +
  '</svg>';

/* Jay's kitchen, with Bonnie */
var KITCHEN = L({ W: 5, H: 4, cw: 2, ch: 2, aria: "Jay's L shaped kitchen, 5 m by 4 m with a 2 m by 2 m corner missing, and Bonnie",
  extra: A2ART.bonnie(150, 172, 0.55, "sit") + A2ART.jay(450, 186, 0.6, "hmm") + A2ART.egg(A2ART.bird(470, 40, 0.6, "#ff5d8f"), "The bird says the kitchen is 16 square metres. The bird is right. Do not tell Jay.") });

/* ---------- widget: design an L on a grid ---------- */
var GW = 12, GH = 8;
function gridWidget(el, api){
  var d = api.data || {};
  if(!Array.isArray(d.on)) d.on = [];
  el.innerHTML = '<p>Tap squares to make a floor. Each square is 1 m by 1 m. Have a go at an L, or any shape made of rectangles.</p>' +
    '<div class="lf-grid" style="display:grid;grid-template-columns:repeat(' + GW + ',1fr);gap:3px;max-width:480px;margin:10px 0"></div>' +
    '<p class="lf-count" style="font-weight:700;font-size:1.1rem;margin:8px 0"></p>' +
    '<button type="button" class="lf-clear" style="font:inherit;cursor:pointer;padding:6px 14px;border-radius:10px;border:2px solid #141a33;background:#fff">Clear</button>';
  var grid = el.querySelector(".lf-grid"), count = el.querySelector(".lf-count");
  function draw(){
    var html = "";
    for(var i = 0; i < GW * GH; i++){
      var on = d.on.indexOf(i) >= 0;
      html += '<button type="button" data-i="' + i + '" aria-pressed="' + on + '" aria-label="Square ' + (i + 1) + '" style="aspect-ratio:1;min-width:0;padding:0;cursor:pointer;border-radius:4px;border:2px solid ' + (on ? "#141a33" : "#d9d8e6") + ';background:' + (on ? "#ffd23f" : "#fff") + '"></button>';
    }
    grid.innerHTML = html;
    var n = d.on.length; count.textContent = n ? "Your floor: " + n + (n === 1 ? " square, so 1 square metre." : " squares, so " + n + " square metres.") : "Your floor: nothing yet.";
  }
  grid.addEventListener("click", function(e){
    var b = e.target && e.target.closest ? e.target.closest("button[data-i]") : null;
    if(!b) return;
    var i = +b.getAttribute("data-i"), k = d.on.indexOf(i);
    if(k >= 0) d.on.splice(k, 1); else d.on.push(i);
    try{ api.save(); }catch(err){}
    draw();
    api.done("done");
  });
  el.querySelector(".lf-clear").addEventListener("click", function(){ d.on = []; try{ api.save(); }catch(err){} draw(); });
  draw();
}

(window.A2PACKS = window.A2PACKS || {})["l-shaped-floors"] = {
  a2: true,
  id: "a2-l-shaped-floors",
  title: "L shaped floors",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 25,
  line: "Split it into rectangles, find any missing lengths, then add up the areas.",
  blurb: "Finding the area of floors made from rectangles, like an L shaped room on a plan. Four short chunks: rectangles, splitting an L, missing lengths, and real floor plans. You make your own floor plan card at the end.",
  note: "Area of L shaped rooms: split them into rectangles and add up. Four five minute chunks and a floor plan card to make, if you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Square counter", line: "Square counter: floors on a grid, so you can count to check." },
    { id: "medium", name: "Floor fitter", line: "Floor fitter: real plans in metres, with a missing length or two." },
    { id: "spicy", name: "Plan master", line: "Plan master: decimals, the take away method, and buying the flooring." }
  ],
  themes: {
    time: { name: "Time travel", w: { room: "time machine control room", floor: "glowing floor panels" } },
    football: { name: "Football", w: { room: "changing room", floor: "rubber matting" } },
    horror: { name: "Horror", w: { room: "abandoned hotel lobby", floor: "creaky floorboards" } },
    fishing: { name: "Fishing", w: { room: "tackle shop", floor: "non slip matting" } },
    music: { name: "Music", w: { room: "dance studio", floor: "sprung dance floor" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: L({ W: 7, H: 5, cw: 3, ch: 2, split: "v", areas: ["20 m&#178;", "9 m&#178;"], aria: "An L shaped floor split into two rectangles" }),
  steps: [

    /* ---------- chunk 1: warm up ---------- */
    { type: "learn", topic: "Rectangles first", title: "Area is the space inside",
      fig: AREA_IDEA,
      html: "<p>A quick warm up first. <b>Area</b> is how much floor there is. Count the squares inside, or multiply: <b>length x width</b>.</p>" +
        "<p>5 squares along, 3 rows: 5 x 3 = <b>15 squares</b>. If each square is 1 metre by 1 metre, that is <b>15 square metres</b>, written <b>15 m&sup2;</b>.</p>" },

    { type: "num", topic: "Rectangles first",
      q: "Each square is 1 m by 1 m. What is the area of this floor?",
      fig: R(6, 4, true),
      boxes: [{ label: "Area", a: 24, post: "m&sup2;" }],
      slips: [[20, "That is the distance round the edge (the perimeter). Area is the squares inside."], [10, "That adds 6 and 4. Multiply them instead."]],
      hint: "6 squares in each row, 4 rows. Or 6 x 4.",
      why: "6 x 4 = <b>24 m&sup2;</b>. Count them if you like: 24 squares.",
      lv: { medium: { q: "A rectangular [[room]] is 7 m long and 5 m wide. What is its area?", fig: R(7, 5, false),
          boxes: [{ label: "Area", a: 35, post: "m&sup2;" }],
          slips: [[24, "That is the perimeter: 7 + 5 + 7 + 5. Area is length x width."], [12, "That adds 7 and 5. Multiply instead."]],
          hint: "Length x width.",
          why: "7 x 5 = <b>35 m&sup2;</b>." },
        spicy: { q: "A rectangular [[room]] is 6.5 m long and 4 m wide. What is its area?", fig: R(6.5, 4, false),
          boxes: [{ label: "Area", a: 26, post: "m&sup2;" }],
          slips: [[21, "That is the perimeter. Area is length x width."], [10.5, "That adds the sides. Multiply instead."], [24, "Looks like the 0.5 went missing. 6.5 x 4, not 6 x 4."]],
          hint: "6 x 4, plus half of 4.",
          why: "6 x 4 = 24, and 0.5 x 4 = 2. So 6.5 x 4 = <b>26 m&sup2;</b>." } } },

    { type: "mc", topic: "Rectangles first",
      q: "Which unit would you use for the area of a floor?",
      options: ["m&sup2; (square metres)", "m (metres)", "kg (kilograms)"],
      answer: 0,
      slips: { 1: "Metres measure a length, like one wall. Area needs square metres.", 2: "Kilograms measure weight, not floor space." },
      hint: "Area is counted in squares.",
      why: "Area counts squares, so it is in square metres: m&sup2;.",
      lv: { spicy: { q: "A [[room]] has an area of 12 m&sup2;. Which could be its length and width?",
          options: ["4 m by 3 m", "6 m by 6 m", "10 m by 2 m"],
          slips: { 1: "6 + 6 = 12, but area multiplies: 6 x 6 = 36.", 2: "10 + 2 = 12, but area multiplies: 10 x 2 = 20." },
          hint: "Which pair multiplies to 12?",
          why: "4 x 3 = 12. The others add to 12, which is a classic slip." } } },

    { type: "mc", topic: "Rectangles first",
      q: "Which room has more floor?",
      fig: TWO([5, 4], [6, 3]),
      options: ["Room A", "Room B", "They are the same"],
      answer: 0, fixed: true,
      slips: { 1: "B is longer, but 6 x 3 = 18. A is 5 x 4 = 20.", 2: "Work out both: 5 x 4 and 6 x 3." },
      hint: "Work out the area of each one.",
      why: "A: 5 x 4 = 20 m&sup2;. B: 6 x 3 = 18 m&sup2;. A has more.",
      lv: { medium: { fig: TWO([8, 3], [5, 5]),
          options: ["Room A", "Room B", "They are the same"],
          answer: 1,
          slips: { 0: "A is the longest, but 8 x 3 = 24. B is 5 x 5 = 25.", 2: "Close, but not quite. Work out both." },
          why: "A: 8 x 3 = 24 m&sup2;. B: 5 x 5 = 25 m&sup2;. B just wins." },
        spicy: { fig: TWO([7.5, 4], [5.5, 5.5]),
          options: ["Room A", "Room B", "They are the same"],
          answer: 1,
          slips: { 0: "A: 7.5 x 4 = 30. B: 5.5 x 5.5 = 30.25. Tiny difference.", 2: "Very close, but 5.5 x 5.5 = 30.25, not 30." },
          hint: "5.5 x 5.5 is 5 x 5.5 plus half of 5.5.",
          why: "A: 7.5 x 4 = 30 m&sup2;. B: 5.5 x 5.5 = 27.5 + 2.75 = 30.25 m&sup2;. B wins by a quarter of a square metre." } } },

    /* ---------- chunk 2: split it ---------- */
    { type: "learn", topic: "Split the L", title: "Split it into two rectangles",
      routes: [
        { name: "Worked example", fig: L({ W: 7, H: 5, cw: 3, ch: 2, split: "v", areas: ["A: 4 x 5", "B: 3 x 3"], aria: "An L shape split into rectangle A, 4 by 5, and rectangle B, 3 by 3" }),
          html: "<p>An L is just two rectangles stuck together. Here is one worked all the way through.</p>" +
            "<p><b>Step 1:</b> cut it into two rectangles (the red dashed line).<br>" +
            "<b>Step 2:</b> area of each. A is 4 x 5 = <b>20</b>. B is 3 x 3 = <b>9</b>.<br>" +
            "<b>Step 3:</b> add them. 20 + 9 = <b>29 m&sup2;</b>.</p>" },
        { name: "Count it", fig: L({ W: 7, H: 5, cw: 3, ch: 2, split: "v", grid: true, areas: ["20", "9"], aria: "The same L on a grid: 20 squares and 9 squares" }),
          html: "<p>Same shape on a grid. Count the yellow squares: 20. Count the blue: 9. Altogether: <b>29 squares</b>, so 29 m&sup2;.</p>" +
            "<p>Splitting and multiplying gives the same answer as counting, just quicker.</p>" }
      ] },

    { type: "num", topic: "Split the L",
      q: "Your turn, with the steps laid out. A is 3 m by 4 m. B is 2 m by 2 m. Fill in each area, then the total.",
      fig: L({ W: 5, H: 4, cw: 2, ch: 2, split: "v", grid: true, areas: ["A", "B"] }),
      boxes: [{ label: "A", a: 12, post: "m&sup2;" }, { label: "B", a: 4, post: "m&sup2;" }, { label: "Total", a: 16, post: "m&sup2;" }],
      slips: [[2, 20, "20 is the whole 5 by 4 rectangle, including the missing corner. Add A and B instead."], [0, 7, "That adds 3 and 4. Multiply them."]],
      hint: "A: 3 x 4. B: 2 x 2. Then add.",
      why: "A = 3 x 4 = 12. B = 2 x 2 = 4. Total = 12 + 4 = <b>16 m&sup2;</b>.",
      lv: { medium: { q: "Your turn, with the steps laid out. A is 5 m by 6 m. B is 3 m by 4 m. Fill in each area, then the total.",
          fig: L({ W: 8, H: 6, cw: 3, ch: 2, split: "v", areas: ["A", "B"] }),
          boxes: [{ label: "A", a: 30, post: "m&sup2;" }, { label: "B", a: 12, post: "m&sup2;" }, { label: "Total", a: 42, post: "m&sup2;" }],
          slips: [[2, 48, "48 is the whole 8 by 6 rectangle, missing corner and all. Add A and B instead."], [0, 11, "That adds 5 and 6. Multiply them."]],
          hint: "A: 5 x 6. B: 3 x 4. Then add.",
          why: "A = 5 x 6 = 30. B = 3 x 4 = 12. Total = 30 + 12 = <b>42 m&sup2;</b>." },
        spicy: { q: "Steps laid out. A is 5 m by 7.5 m. B is 4 m by 4.5 m. Fill in each area, then the total.",
          fig: L({ W: 9, H: 7.5, cw: 4, ch: 3, split: "v", areas: ["A", "B"] }),
          boxes: [{ label: "A", a: 37.5, post: "m&sup2;" }, { label: "B", a: 18, post: "m&sup2;" }, { label: "Total", a: 55.5, post: "m&sup2;" }],
          slips: [[2, 67.5, "67.5 is the whole 9 by 7.5 rectangle. Add A and B instead."], [0, 35, "Looks like the 0.5 went missing: 5 x 7.5, not 5 x 7."]],
          hint: "5 x 7.5 is 5 x 7 plus 5 x 0.5.",
          why: "A = 5 x 7.5 = 37.5. B = 4 x 4.5 = 18. Total = 37.5 + 18 = <b>55.5 m&sup2;</b>." } } },

    { type: "mc", topic: "Split the L",
      q: "Which line cuts this L into two rectangles?",
      fig: CUTS(),
      options: ["Line A", "Line B", "Line C"],
      answer: 0, fixed: true,
      slips: { 1: "A slanted cut makes shapes with slanted sides, not rectangles.", 2: "Line C leaves one piece still shaped like an L. Cut at the inside corner." },
      hint: "Start the cut at the inside corner of the L.",
      why: "Line A runs straight down from the inside corner, so both pieces are rectangles. (A cut straight across from that corner works too.)" },

    { type: "num", topic: "Split the L", explain: true,
      q: "Now the steps are up to you. Split it, find both areas, add. What is the total area?",
      fig: L({ W: 6, H: 4, cw: 2, ch: 1, grid: true }),
      boxes: [{ label: "Total area", a: 22, post: "m&sup2;" }],
      slips: [[24, "That is the whole 6 by 4 rectangle, including the missing corner."], [20, "That is the distance round the edge. Area is the squares inside."]],
      hint: "Cut down from the inside corner: 4 by 4, and 2 by 3.",
      why: "4 x 4 = 16, and 2 x 3 = 6. Total: 16 + 6 = <b>22 m&sup2;</b>. Count the squares to check, if you like.",
      lv: { medium: { fig: L({ W: 10, H: 7, cw: 4, ch: 3 }),
          boxes: [{ label: "Total area", a: 58, post: "m&sup2;" }],
          slips: [[70, "That is the whole 10 by 7 rectangle, missing corner and all."], [34, "That is the distance round the edge, not the area."]],
          hint: "Cut down from the inside corner: 6 by 7, and 4 by 4.",
          why: "6 x 7 = 42, and 4 x 4 = 16. Total: 42 + 16 = <b>58 m&sup2;</b>." },
        spicy: { fig: L({ W: 12, H: 8, cw: 5, ch: 3.5 }),
          boxes: [{ label: "Total area", a: 78.5, post: "m&sup2;" }],
          slips: [[96, "That is the whole 12 by 8 rectangle, missing corner and all."], [40, "That is the distance round the edge, not the area."]],
          hint: "Cut down from the inside corner: 7 by 8, and 5 by 4.5.",
          why: "7 x 8 = 56, and 5 x 4.5 = 22.5. Total: 56 + 22.5 = <b>78.5 m&sup2;</b>." } } },

    /* ---------- chunk 3: missing lengths ---------- */
    { type: "learn", topic: "Missing lengths", title: "Find the missing length",
      fig: MISSING,
      html: "<p>Plans do not always label every side. No problem: the short sides along one edge <b>add up</b> to the long side opposite.</p>" +
        "<p>Top: 6 m. Bottom: 10 m. So the missing bit is <b>10 - 6 = 4 m</b>. Same up the side: 7 - 4 = <b>3 m</b>.</p>" },

    { type: "mc", topic: "Missing lengths",
      q: "The bottom is 8 m. The top is 5 m. Which sum finds the missing length?",
      fig: L({ W: 8, H: 5, cw: 3, ch: 2, hide: ["inh"], nolabels: false, lab: { inv: "", right: "", left: "" } }),
      options: ["Take away: 8 - 5", "Add: 8 + 5", "Times: 8 x 5"],
      answer: 0,
      slips: { 1: "Adding makes it bigger than the whole bottom edge. The missing bit is smaller.", 2: "Multiplying is for area. This is a length." },
      hint: "Top bit + missing bit = bottom.",
      why: "5 + ? = 8, so ? = 8 - 5 = 3 m.",
      lv: { spicy: { q: "The bottom is 9.6 m. The top is 5.8 m. Which sum finds the missing length?",
          fig: L({ W: 9.6, H: 5, cw: 3.8, ch: 2, hide: ["inh"], lab: { inv: "", right: "", left: "" } }),
          options: ["Take away: 9.6 - 5.8", "Add: 9.6 + 5.8", "Take away the other way: 5.8 - 9.6"],
          slips: { 1: "Adding makes it longer than the whole edge. The missing bit is shorter.", 2: "That would be negative. Take the smaller from the bigger." },
          why: "5.8 + ? = 9.6, so ? = 9.6 - 5.8 = 3.8 m." } } },

    { type: "num", topic: "Missing lengths",
      q: "Find the two missing lengths.",
      fig: L({ W: 8, H: 6, cw: 3, ch: 2, hide: ["inh", "right"] }),
      boxes: [{ label: "Across the gap", a: 3, post: "m" }, { label: "Right side", a: 4, post: "m" }],
      slips: [[0, 13, "That adds 8 and 5. The missing bit is the difference."], [1, 8, "That adds 6 and 2. The right side is shorter than the left."]],
      hint: "Across: 8 - 5. Right side: 6 - 2.",
      why: "Across the gap: 8 - 5 = <b>3 m</b>. Right side: 6 - 2 = <b>4 m</b>.",
      lv: { medium: { fig: L({ W: 12, H: 9, cw: 5, ch: 3, hide: ["inh", "right"] }),
          boxes: [{ label: "Across the gap", a: 5, post: "m" }, { label: "Right side", a: 6, post: "m" }],
          slips: [[0, 19, "That adds 12 and 7. The missing bit is the difference."], [1, 12, "That adds 9 and 3. The right side is shorter than the left."]],
          hint: "Across: 12 - 7. Right side: 9 - 3.",
          why: "Across: 12 - 7 = <b>5 m</b>. Right side: 9 - 3 = <b>6 m</b>." },
        spicy: { fig: L({ W: 14.5, H: 10, cw: 6.5, ch: 4.2, hide: ["inh", "right"] }),
          boxes: [{ label: "Across the gap", a: 6.5, post: "m" }, { label: "Right side", a: 5.8, post: "m" }],
          slips: [[0, 22.5, "That adds 14.5 and 8. The missing bit is the difference."], [1, 6.2, "Check the subtraction: 10 - 4.2 is 5.8."]],
          hint: "Across: 14.5 - 8. Right side: 10 - 4.2.",
          why: "Across: 14.5 - 8 = <b>6.5 m</b>. Right side: 10 - 4.2 = <b>5.8 m</b>." } } },

    { type: "num", topic: "Missing lengths",
      q: "All on your own now. Two lengths are missing. Find them in your head, then find the area of the [[room]].",
      fig: L({ W: 6, H: 5, cw: 2, ch: 3, grid: true, hide: ["inh", "right"] }),
      boxes: [{ label: "Area", a: 24, post: "m&sup2;" }],
      slips: [[30, "That is the whole 6 by 5 rectangle, including the missing corner."], [22, "That is the distance round the edge, not the area."]],
      hint: "Missing lengths: 6 - 4 = 2 and 5 - 3 = 2. Then split: 4 by 5, and 2 by 2.",
      why: "4 x 5 = 20, and 2 x 2 = 4. Total: <b>24 m&sup2;</b>.",
      lv: { medium: { fig: L({ W: 11, H: 8, cw: 4, ch: 5, hide: ["inh", "right"] }),
          boxes: [{ label: "Area", a: 68, post: "m&sup2;" }],
          slips: [[88, "That is the whole 11 by 8 rectangle, missing corner and all."], [38, "That is the distance round the edge, not the area."]],
          hint: "Missing: 11 - 7 = 4 and 8 - 5 = 3. Then 7 by 8, and 4 by 3.",
          why: "7 x 8 = 56, and 4 x 3 = 12. Total: <b>68 m&sup2;</b>." },
        spicy: { fig: L({ W: 10, H: 7.5, cw: 4, ch: 3, hide: ["inh", "right"] }),
          boxes: [{ label: "Area", a: 63, post: "m&sup2;" }],
          slips: [[75, "That is the whole 10 by 7.5 rectangle, missing corner and all."], [35, "That is the distance round the edge, not the area."]],
          hint: "Missing: 10 - 6 = 4 and 7.5 - 3 = 4.5. Then 6 by 7.5, and 4 by 4.5.",
          why: "6 x 7.5 = 45, and 4 x 4.5 = 18. Total: <b>63 m&sup2;</b>." } } },

    /* ---------- chunk 4: real plans ---------- */
    { type: "learn", topic: "Real floor plans", title: "Another way: take away the corner",
      fig: L({ W: 7, H: 5, cw: 3, ch: 2, ghost: "take away", aria: "The L inside a whole rectangle, with the missing corner shaded to take away" }),
      html: "<p>Here is a second way, if you like. Pretend the corner is there, find the <b>whole rectangle</b>, then <b>take away</b> the missing corner.</p>" +
        "<p>Whole: 7 x 5 = 35. Corner: 3 x 2 = 6. Floor: 35 - 6 = <b>29 m&sup2;</b>. The same answer as splitting it, which is a handy way to check.</p>",
      lv: { spicy: { html: "<p>Two ways to the same answer. <b>Add</b>: split into rectangles and add. <b>Take away</b>: whole rectangle minus the missing corner.</p>" +
        "<p>Whole: 7 x 5 = 35. Corner: 3 x 2 = 6. Floor: 35 - 6 = <b>29 m&sup2;</b>.</p>" +
        "<p>Take away is often quicker when the missing corner is small, and you never need the missing lengths. Use one to check the other.</p>" } } },

    { type: "num", topic: "Real floor plans",
      q: "Try the take away way. The whole rectangle is 5 by 4. The missing corner is 2 by 2. What is the floor area?",
      fig: L({ W: 5, H: 4, cw: 2, ch: 2, grid: true, ghost: "take away" }),
      boxes: [{ label: "Area", a: 16, post: "m&sup2;" }],
      slips: [[24, "That adds the corner on. Take it away instead."], [20, "That is the whole rectangle. Now take away the corner."]],
      hint: "5 x 4, then take away 2 x 2.",
      why: "5 x 4 = 20. Take away 2 x 2 = 4. 20 - 4 = <b>16 m&sup2;</b>.",
      lv: { medium: { q: "Try the take away way. Whole rectangle 9 m by 6 m, missing corner 4 m by 2 m. What is the floor area of the [[room]]?",
          fig: L({ W: 9, H: 6, cw: 4, ch: 2, ghost: "take away" }),
          boxes: [{ label: "Area", a: 46, post: "m&sup2;" }],
          slips: [[62, "That adds the corner on. Take it away instead."], [54, "That is the whole rectangle. Now take away the corner."]],
          hint: "9 x 6, then take away 4 x 2.",
          why: "9 x 6 = 54. Take away 4 x 2 = 8. 54 - 8 = <b>46 m&sup2;</b>." },
        spicy: { q: "Use the take away way. Whole rectangle 12 m by 9 m, missing corner 5 m by 4 m. What is the floor area of the [[room]]?",
          fig: L({ W: 12, H: 9, cw: 5, ch: 4, ghost: "take away" }),
          boxes: [{ label: "Area", a: 88, post: "m&sup2;" }],
          slips: [[128, "That adds the corner on. Take it away instead."], [108, "That is the whole rectangle. Now take away the corner."]],
          hint: "12 x 9, then take away 5 x 4.",
          why: "12 x 9 = 108. Take away 5 x 4 = 20. 108 - 20 = <b>88 m&sup2;</b>." } } },

    { type: "mc", topic: "Real floor plans",
      q: "Jay worked out his L shaped kitchen. He did 5 x 4 = 20, then 2 x 2 = 4, then 20 + 4 = 24 m&sup2;. What went astray?",
      fig: KITCHEN,
      options: ["He added the missing corner instead of taking it away", "He should have done 5 + 4", "Nothing, 24 m&sup2; is right"],
      answer: 0,
      slips: { 1: "5 + 4 is a length, not an area. Multiplying was fine.", 2: "Count the floor on the plan: the corner is not there, so it should come off." },
      hint: "Is the 2 by 2 corner part of the kitchen, or missing?",
      why: "The corner is missing, so take it away: 20 - 4 = 16 m&sup2;. Jay's verdict on his own mistake: \"Outrageous.\"" },

    { type: "num", topic: "Real floor plans", stretch: true,
      q: "The [[room]] floor is 16 m&sup2;. Each m&sup2; of [[floor]] costs &pound;3. How much for the whole floor?",
      boxes: [{ label: "Cost", a: 48, pre: "&pound;" }],
      slips: [[19, "That adds 16 and 3. Each square metre costs &pound;3, so multiply."], [45, "Check 16 x 3: 10 x 3 = 30, 6 x 3 = 18."]],
      hint: "16 lots of &pound;3.",
      why: "16 x &pound;3 = <b>&pound;48</b>.",
      lv: { medium: { q: "The [[room]] floor is 46 m&sup2;. Each m&sup2; of [[floor]] costs &pound;12. How much for the whole floor?",
          boxes: [{ label: "Cost", a: 552, pre: "&pound;" }],
          slips: [[58, "That adds 46 and 12. Multiply instead."], [460, "That is 46 x 10. You need 46 x 12: add on 46 x 2 as well."]],
          hint: "46 x 10, then add 46 x 2.",
          why: "46 x 10 = 460 and 46 x 2 = 92. Total: <b>&pound;552</b>." },
        spicy: { q: "The [[room]] floor is 88 m&sup2;. [[Floor]] comes in packs that each cover 2.5 m&sup2;. How many packs do you need to buy?",
          boxes: [{ label: "Packs", a: 36 }],
          slips: [[35, "35 packs cover 87.5 m&sup2;: just short. You can only buy whole packs, so round up."], [35.2, "You cannot buy 0.2 of a pack. Round up to a whole pack."], [220, "That multiplies. How many 2.5s fit into 88?"]],
          hint: "88 divided by 2.5, then round up.",
          why: "88 / 2.5 = 35.2. You cannot buy part of a pack, and 35 is not enough, so <b>36 packs</b>." } } },

    { type: "widget", topic: "Real floor plans", unscored: true,
      title: "Design a floor",
      html: "<p>Build your own floor on the grid, if you like. It counts the area for you, so you can check your sums.</p>",
      mount: gridWidget,
      report: function(d){ return d && d.on && d.on.length ? "Designed a floor of " + d.on.length + " m2 on the grid." : ""; } }
  ],

  realWorld: {
    title: "Floor plans are everywhere",
    html: "<p>Carpet fitters, builders, architects and anyone moving house use this. Flooring is sold by the square metre, so a slip in the area costs real money.</p>" +
      "<p>For our big question: castles and old houses were full of odd shaped rooms too. If we could time travel, should we? You could show a medieval builder the take away trick.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A time portal next to an L shaped floor plan, with Jay">' + A2ART.portal(70, 75, 54) +
      '<path d="M150 30H250V70H310V130H150Z" fill="#fde7b0" stroke="#141a33" stroke-width="3"/><path d="M250 70V130" stroke="#e04848" stroke-width="3" stroke-dasharray="7 5"/>' +
      A2ART.jay(370, 50, 0.75, "wink") + '</svg>'
  },

  make: {
    title: "Make a floor plan card",
    intro: "Design an L shaped room. Put in the outside lengths and the size of the missing corner, and it draws the plan and the area.",
    fields: [
      { id: "room", label: "What is the room?", ph: "My dream games room", max: 34 },
      { id: "w", label: "Whole length (m)", ph: "8", max: 5 },
      { id: "h", label: "Whole width (m)", ph: "6", max: 5 },
      { id: "cw", label: "Missing corner length (m)", ph: "3", max: 5 },
      { id: "ch", label: "Missing corner width (m)", ph: "2", max: 5 },
      { id: "name", label: "Designer", ph: "Plan Master", max: 24 }
    ],
    svg: function(v){
      function n(x, d){ var f = parseFloat(String(x == null ? "" : x).replace(/[^0-9.]/g, "")); return isFinite(f) && f > 0 ? Math.min(f, 999) : d; }
      var W = n(v.w, 8), H = n(v.h, 6), cw = n(v.cw, 3), ch = n(v.ch, 2);
      if(cw >= W) cw = W / 2; if(ch >= H) ch = H / 2;
      var area = W * H - cw * ch, rm = wrap(v.room, 26, 2), nm = wrap(v.name, 18, 1);
      var s = Math.min(300 / W, 200 / H), ox = 60 + (300 - W * s) / 2, oy = 120 + (200 - H * s) / 2;
      function X(x){ return +(ox + x * s).toFixed(1); } function Y(y){ return +(oy + y * s).toFixed(1); }
      var path = "M" + X(0) + " " + Y(0) + "H" + X(W - cw) + "V" + Y(ch) + "H" + X(W) + "V" + Y(H) + "H" + X(0) + "Z";
      var grid = "";
      for(var k = 1; k * s >= 12 && k < 60 && (k < W || k < H); k++){
        if(k < W) grid += '<path d="M' + X(k) + ' ' + Y(0) + 'V' + Y(H) + '" stroke="#3a8fd6" stroke-opacity=".25" stroke-width="1"/>';
        if(k < H) grid += '<path d="M' + X(0) + ' ' + Y(k) + 'H' + X(W) + '" stroke="#3a8fd6" stroke-opacity=".25" stroke-width="1"/>';
      }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">' +
        '<rect width="640" height="400" rx="22" fill="#1d3f6e"/>' +
        '<rect x="14" y="14" width="612" height="372" rx="16" fill="none" stroke="#ffffff" stroke-opacity=".5" stroke-width="2" stroke-dasharray="10 6"/>' +
        T(40, 56, "FLOOR PLAN", 24, { b: 1, c: "#ffd23f" }) +
        rm.map(function(l, i){ return T(40, 86 + i * 22, esc(l), 18, { b: 1, c: "#ffffff" }); }).join("") +
        '<clipPath id="lfc"><path d="' + path + '"/></clipPath>' +
        '<path d="' + path + '" fill="#2c5a94"/><g clip-path="url(#lfc)">' + grid + '</g>' +
        '<path d="' + path + '" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round"/>' +
        T((X(0) + X(W)) / 2, Y(H) + 22, r2(W) + " m", 14, { a: "middle", c: "#ffffff" }) +
        T(X(0) - 8, (Y(0) + Y(H)) / 2 + 5, r2(H) + " m", 14, { a: "end", c: "#ffffff" }) +
        '<rect x="400" y="130" width="206" height="150" rx="14" fill="#ffffff"/>' +
        T(503, 160, "AREA", 15, { b: 1, a: "middle", c: "#5b6180" }) +
        T(503, 200, r2(area) + " m&#178;", 30, { b: 1, a: "middle", c: "#141a33" }) +
        T(503, 232, r2(W) + " x " + r2(H) + " = " + r2(W * H), 13, { a: "middle", c: "#141a33" }) +
        T(503, 254, "take away " + r2(cw) + " x " + r2(ch) + " = " + r2(cw * ch), 13, { a: "middle", c: "#141a33" }) +
        T(400, 330, "Designer:", 14, { b: 1, c: "#ffd23f" }) + T(400, 354, esc(nm[0] || ""), 16, { b: 1, c: "#ffffff" }) +
        '</svg>';
    }
  }
};
})();
