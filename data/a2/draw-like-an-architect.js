/* Base 5 Autumn 2 activity: Draw like an architect.
   Aesthetic and Creative. Plans and elevations, symbols for doors and
   windows, labels and scale, then a drawing of your own. ASCII only. */
(function(){
var A = window.A2ART;
var FONT = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }

/* a room plan: w x h squares of c px at (ox, oy). doors and windows sit
   in walls t, b, l, r at a square position. */
function room(o){
  var c = o.c || 28, w = o.w, h = o.h, X0 = o.ox, Y0 = o.oy, X1 = X0 + w * c, Y1 = Y0 + h * c, s = "";
  s += '<rect x="' + X0 + '" y="' + Y0 + '" width="' + (w * c) + '" height="' + (h * c) + '" fill="#ffffff"/>';
  if(o.grid){
    var g = "";
    for(var i = 1; i < w; i++) g += "M" + (X0 + i * c) + " " + Y0 + "V" + Y1;
    for(var j = 1; j < h; j++) g += "M" + X0 + " " + (Y0 + j * c) + "H" + X1;
    s += '<path d="' + g + '" stroke="#c9d3e6" stroke-width="1.2"/>';
  }
  (o.things || []).forEach(function(t){
    s += '<rect x="' + (X0 + t[0] * c + 3) + '" y="' + (Y0 + t[1] * c + 3) + '" width="' + (t[2] * c - 6) + '" height="' + (t[3] * c - 6) + '" rx="4" fill="' + (t[5] || "#ffb36b") + '" stroke="#141a33" stroke-width="1.5"/>' +
      (t[4] ? T(X0 + (t[0] + t[2] / 2) * c, Y0 + (t[1] + t[3] / 2) * c + 5, t[4], 13, { a: "middle" }) : "");
  });
  var gaps = { t: [], b: [], l: [], r: [] };
  (o.doors || []).forEach(function(d){ gaps[d.wall].push(d.at); });
  function seg(wall, a, b){
    if(wall === "t") return "M" + (X0 + a * c) + " " + Y0 + "H" + (X0 + b * c);
    if(wall === "b") return "M" + (X0 + a * c) + " " + Y1 + "H" + (X0 + b * c);
    if(wall === "l") return "M" + X0 + " " + (Y0 + a * c) + "V" + (Y0 + b * c);
    return "M" + X1 + " " + (Y0 + a * c) + "V" + (Y0 + b * c);
  }
  var wp = "";
  ["t", "b", "l", "r"].forEach(function(wall){
    var len = (wall === "t" || wall === "b") ? w : h, pos = 0;
    gaps[wall].sort(function(a, b){ return a - b; }).forEach(function(a){ if(a > pos) wp += seg(wall, pos, a); pos = a + 1; });
    if(pos < len) wp += seg(wall, pos, len);
  });
  s += '<path d="' + wp + '" stroke="#141a33" stroke-width="8" stroke-linecap="square" fill="none"/>';
  (o.windows || []).forEach(function(wd){
    var a = wd.at, n = wd.len || 1;
    if(wd.wall === "t" || wd.wall === "b"){
      var y = wd.wall === "t" ? Y0 : Y1;
      s += '<rect x="' + (X0 + a * c) + '" y="' + (y - 5) + '" width="' + (n * c) + '" height="10" fill="#e8f7ff" stroke="#141a33" stroke-width="1.6"/><path d="M' + (X0 + a * c) + ' ' + y + 'h' + (n * c) + '" stroke="#141a33" stroke-width="1.6"/>';
    } else {
      var x = wd.wall === "l" ? X0 : X1;
      s += '<rect x="' + (x - 5) + '" y="' + (Y0 + a * c) + '" width="10" height="' + (n * c) + '" fill="#e8f7ff" stroke="#141a33" stroke-width="1.6"/><path d="M' + x + ' ' + (Y0 + a * c) + 'v' + (n * c) + '" stroke="#141a33" stroke-width="1.6"/>';
    }
  });
  (o.doors || []).forEach(function(d){
    var a = d.at, inw = d.out ? -1 : 1, leaf, arc;
    if(d.wall === "t" || d.wall === "b"){
      var y = d.wall === "t" ? Y0 : Y1, dir = (d.wall === "t" ? 1 : -1) * inw, x0 = X0 + a * c;
      leaf = "M" + x0 + " " + y + "V" + (y + dir * c);
      arc = "M" + x0 + " " + (y + dir * c) + "A" + c + " " + c + " 0 0 " + (dir < 0 ? 1 : 0) + " " + (x0 + c) + " " + y;
    } else {
      var x = d.wall === "l" ? X0 : X1, dx = (d.wall === "l" ? 1 : -1) * inw, y0 = Y0 + a * c;
      leaf = "M" + x + " " + y0 + "H" + (x + dx * c);
      arc = "M" + (x + dx * c) + " " + y0 + "A" + c + " " + c + " 0 0 " + (dx > 0 ? 1 : 0) + " " + x + " " + (y0 + c);
    }
    s += '<path d="' + leaf + '" stroke="#8a4b1f" stroke-width="4" stroke-linecap="round"/><path d="' + arc + '" fill="none" stroke="#8a4b1f" stroke-width="2" stroke-dasharray="5 4"/>';
  });
  (o.marks || []).forEach(function(m){
    s += '<circle cx="' + (X0 + m[0] * c) + '" cy="' + (Y0 + m[1] * c) + '" r="13" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>' + T(X0 + m[0] * c, Y0 + m[1] * c + 5, m[2], 14, { a: "middle", b: 1 });
  });
  return s;
}

/* a front elevation: ground at gy, wall w wide and hgt high, at x */
function elev(x, gy, w, hgt, o){
  o = o || {};
  var s = '<path d="M' + (x - 14) + ' ' + gy + 'h' + (w + 28) + '" stroke="#3d7a3a" stroke-width="5" stroke-linecap="round"/>';
  s += '<path d="M' + (x - 8) + ' ' + (gy - hgt) + 'L' + (x + w / 2) + ' ' + (gy - hgt - (o.roof || 46)) + 'L' + (x + w + 8) + ' ' + (gy - hgt) + 'z" fill="#c0504d" stroke="#141a33" stroke-width="2.5"/>';
  s += '<rect x="' + x + '" y="' + (gy - hgt) + '" width="' + w + '" height="' + hgt + '" fill="#f3e3c3" stroke="#141a33" stroke-width="2.5"/>';
  var dw = w * 0.2, dx = x + w * 0.4;
  s += '<rect x="' + dx + '" y="' + (gy - hgt * 0.62) + '" width="' + dw + '" height="' + (hgt * 0.62) + '" fill="#8a4b1f" stroke="#141a33" stroke-width="2"/><circle cx="' + (dx + dw - 6) + '" cy="' + (gy - hgt * 0.3) + '" r="2.5" fill="#ffd23f"/>';
  [x + w * 0.1, x + w * 0.7].forEach(function(wx){
    var ww = w * 0.2, wy = gy - hgt * 0.72, wh = hgt * 0.3;
    s += '<rect x="' + wx + '" y="' + wy + '" width="' + ww + '" height="' + wh + '" fill="#bfe6fa" stroke="#141a33" stroke-width="2"/><path d="M' + (wx + ww / 2) + ' ' + wy + 'v' + wh + 'M' + wx + ' ' + (wy + wh / 2) + 'h' + ww + '" stroke="#141a33" stroke-width="1.5"/>';
  });
  return s;
}

/* the building, its plan and its elevation */
var VIEWS = '<svg viewBox="0 0 540 250" role="img" aria-label="A building, its plan from above and its elevation from the front">' +
  '<rect width="540" height="250" rx="16" fill="#f4f1ea"/>' +
  /* the building, a simple box with a roof */
  '<path d="M40 196h104l36 -24h-104z" fill="#d9c49a"/>' +
  '<path d="M144 196l36 -24v-64l-36 24z" fill="#e4cfa4" stroke="#141a33" stroke-width="2"/>' +
  '<rect x="40" y="132" width="104" height="64" fill="#f3e3c3" stroke="#141a33" stroke-width="2"/>' +
  '<path d="M34 132l58 -40 58 40z" fill="#c0504d" stroke="#141a33" stroke-width="2"/><path d="M92 92l36 -24 58 40 -36 24z" fill="#a8403d" stroke="#141a33" stroke-width="2"/>' +
  '<rect x="82" y="160" width="20" height="36" fill="#8a4b1f" stroke="#141a33" stroke-width="1.5"/><rect x="52" y="148" width="20" height="18" fill="#bfe6fa" stroke="#141a33" stroke-width="1.5"/><rect x="112" y="148" width="20" height="18" fill="#bfe6fa" stroke="#141a33" stroke-width="1.5"/>' +
  A2ART.egg(A2ART.bird(118, 34, 0.75, "#3a8fd6"), "A bird's eye view is the plan view. Jay says birds are the original architects. Have you seen a nest?") +
  '<path d="M104 52v30" stroke="#3a8fd6" stroke-width="2.5" stroke-dasharray="4 4"/><path d="M98 76l6 8 6 -8" fill="none" stroke="#3a8fd6" stroke-width="2.5"/>' +
  T(100, 230, "The building", 14, { a: "middle", b: 1 }) +
  room({ ox: 214, oy: 92, w: 4, h: 3, c: 26, doors: [{ wall: "b", at: 1.5 }], windows: [{ wall: "b", at: 0.3, len: 0.8 }, { wall: "b", at: 2.9, len: 0.8 }] }) +
  T(266, 214, "Plan:", 14, { a: "middle", b: 1 }) + T(266, 232, "from above", 14, { a: "middle" }) +
  elev(398, 196, 104, 64) +
  T(450, 214, "Elevation:", 14, { a: "middle", b: 1 }) + T(450, 232, "from the front", 14, { a: "middle" }) +
  '</svg>';

/* plan A and elevation B side by side, for "which is the plan?" */
function twoDrawings(swap){
  var p = room({ ox: 0, oy: 0, w: 5, h: 4, c: 28, doors: [{ wall: "b", at: 2 }], windows: [{ wall: "t", at: 1, len: 2 }, { wall: "l", at: 1, len: 2 }], things: [[3, 0.6, 1.6, 1, ""]] });
  var e = elev(0, 112, 140, 70);
  var L = swap ? e : p, R = swap ? p : e;
  return '<svg viewBox="0 0 480 220" role="img" aria-label="Two drawings of [[building]], labelled A and B">' +
    '<rect width="480" height="220" rx="16" fill="#f4f1ea"/>' +
    '<g transform="translate(' + (swap ? 50 : 50) + ' ' + (swap ? 34 : 40) + ')">' + L + '</g>' +
    '<g transform="translate(' + (swap ? 300 : 300) + ' ' + (swap ? 40 : 34) + ')">' + R + '</g>' +
    T(120, 204, "Drawing A", 15, { a: "middle", b: 1 }) + T(370, 204, "Drawing B", 15, { a: "middle", b: 1 }) + '</svg>';
}

/* the symbol key */
function symbols(named){
  var lab = named ? ["Wall", "Door", "Window", "Stairs"] : ["A", "B", "C", "D"];
  var s = '<svg viewBox="0 0 520 190" role="img" aria-label="' + (named ? "Plan symbols: wall, door, window, stairs" : "Four plan symbols labelled A, B, C and D") + '">' +
    '<rect width="520" height="190" rx="16" fill="#f4f1ea"/>';
  var cells = [
    '<path d="M-40 0h80" stroke="#141a33" stroke-width="9" stroke-linecap="square"/>',
    '<path d="M-48 20h18M30 20h18" stroke="#141a33" stroke-width="9" stroke-linecap="square"/><path d="M-30 20v-60" stroke="#8a4b1f" stroke-width="4" stroke-linecap="round"/><path d="M-30 -40A60 60 0 0 1 30 20" fill="none" stroke="#8a4b1f" stroke-width="2" stroke-dasharray="5 4"/>',
    '<path d="M-48 0h12M36 0h12" stroke="#141a33" stroke-width="9" stroke-linecap="square"/><rect x="-36" y="-5" width="72" height="10" fill="#e8f7ff" stroke="#141a33" stroke-width="1.6"/><path d="M-36 0h72" stroke="#141a33" stroke-width="1.6"/>',
    '<rect x="-30" y="-42" width="60" height="84" fill="#ffffff" stroke="#141a33" stroke-width="2"/><path d="M-30 -28h60M-30 -14h60M-30 0h60M-30 14h60M-30 28h60" stroke="#141a33" stroke-width="1.6"/><path d="M0 34v-66" stroke="#e04848" stroke-width="2.5"/><path d="M-7 -24l7 -10 7 10" fill="none" stroke="#e04848" stroke-width="2.5"/>'
  ];
  cells.forEach(function(c, k){
    var x = 70 + k * 127;
    s += '<g transform="translate(' + x + ' 82)"><rect x="-58" y="-62" width="116" height="122" rx="12" fill="#ffffff" stroke="#141a33" stroke-opacity=".2" stroke-width="2"/>' + c + '</g>' +
      T(x, 172, lab[k], 16, { a: "middle", b: 1 });
  });
  return s + '</svg>';
}

/* plan figures for questions */
function planFig(o, label, extra){
  var vw = o.vw || 420, vh = o.vh || 250;
  return '<svg viewBox="0 0 ' + vw + ' ' + vh + '" role="img" aria-label="' + (label || "A plan of [[building]]") + '">' +
    '<rect width="' + vw + '" height="' + vh + '" rx="16" fill="#f4f1ea"/>' + room(o) + (extra || "") + '</svg>';
}
var DOORFIG = planFig({ ox: 90, oy: 40, w: 8, h: 5, c: 30, doors: [{ wall: "b", at: 1 }], windows: [{ wall: "t", at: 2, len: 3 }], things: [[4.4, 3.1, 3.4, 1.6, "[[Thing]]"]] }, "A plan of [[building]] with one door and one window", "");
var WINFIG = planFig({ ox: 90, oy: 40, w: 8, h: 5, c: 30, doors: [{ wall: "b", at: 5 }], windows: [{ wall: "t", at: 1, len: 2 }, { wall: "t", at: 5, len: 2 }, { wall: "l", at: 1.5, len: 2 }] }, "A plan of [[building]] with a door and some windows");
var SWINGFIG = planFig({ ox: 90, oy: 40, w: 8, h: 5, c: 30, doors: [{ wall: "l", at: 2, out: true }], windows: [{ wall: "t", at: 3, len: 2 }] }, "A plan of [[building]]. The door is in the left wall.");
var SPOTFIG = planFig({ ox: 90, oy: 40, w: 8, h: 5, c: 30, doors: [{ wall: "b", at: 1 }], windows: [{ wall: "t", at: 3, len: 2 }], marks: [[1.5, 4.4, "A"], [6.4, 1.2, "B"], [1.5, 5.6, "C"]] }, "A plan of [[building]] with three spots marked A, B and C");

/* a labelled plan with a title and a scale bar */
function labelled(c, scaleTxt, extra){
  var s = '<svg viewBox="0 0 520 270" role="img" aria-label="A labelled plan of [[building]] with a title and a scale">' +
    '<rect width="520" height="270" rx="16" fill="#f4f1ea"/>' +
    room({ ox: 40, oy: 50, w: 6, h: 4, c: c || 30, grid: true, doors: [{ wall: "b", at: 1 }], windows: [{ wall: "t", at: 2, len: 2 }, { wall: "r", at: 1, len: 2 }], things: [[2.4, 2.3, 3.4, 1.5, "[[Thing]]", "#ffb36b"]] }) +
    T(40, 34, "Plan of [[building]]", 16, { b: 1 }) +
    '<path d="M280 110H232M232 110l9 -6M232 110l9 6" stroke="#e04848" stroke-width="2.5" fill="none"/>' + T(286, 115, "Window", 13, { c: "#e04848", b: 1 }) +
    '<path d="M85 210V180M85 180l-6 9M85 180l6 9" stroke="#e04848" stroke-width="2.5" fill="none"/>' + T(70, 226, "Door", 13, { c: "#e04848", b: 1 }) +
    '<g transform="translate(300 160)"><rect x="0" y="0" width="200" height="86" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
    '<rect x="14" y="20" width="30" height="12" fill="#141a33"/><rect x="44" y="20" width="30" height="12" fill="#ffffff" stroke="#141a33" stroke-width="1.5"/><rect x="74" y="20" width="30" height="12" fill="#141a33"/>' +
    T(14, 56, "Scale:", 14, { b: 1 }) + T(14, 76, scaleTxt, 14) + '</g>' +
    '<g transform="translate(470 60)"><path d="M0 26v-38" stroke="#141a33" stroke-width="3"/><path d="M-8 -4l8 -14 8 14z" fill="#141a33"/>' + T(0, 44, "N", 14, { a: "middle", b: 1 }) + '</g>';
  return s + (extra || "") + '</svg>';
}

/* how a plan grows, step by step */
var GROW = '<svg viewBox="0 0 540 190" role="img" aria-label="A plan drawn in four stages: walls, then door and window, then labels, then title and scale">' +
  '<rect width="540" height="190" rx="16" fill="#f4f1ea"/>' +
  [0, 1, 2, 3].map(function(k){
    var ox = 26 + k * 130, o = { ox: ox, oy: 36, w: 4, h: 3, c: 24, grid: true };
    if(k >= 1){ o.doors = [{ wall: "b", at: 1 }]; o.windows = [{ wall: "t", at: 1, len: 2 }]; }
    if(k >= 2) o.things = [[2.2, 1.2, 1.6, 1.6, "", "#ffb36b"]];
    var extra = k >= 3 ? T(ox, 26, "My plan", 13, { b: 1 }) + '<rect x="' + ox + '" y="122" width="24" height="8" fill="#141a33"/><rect x="' + (ox + 24) + '" y="122" width="24" height="8" fill="#ffffff" stroke="#141a33" stroke-width="1"/>' : "";
    return room(o) + extra + T(ox + 48, 160, (k + 1) + ". " + ["Walls", "Symbols", "Labels", "Title, scale"][k], 13, { a: "middle", b: 1 }) +
      (k < 3 ? '<path d="M' + (ox + 104) + ' 72h16" stroke="#19c39a" stroke-width="4" stroke-linecap="round"/>' : "");
  }).join("") + '</svg>';

/* ---------- the drawing grid ---------- */
var COLS = 14, ROWS = 10, CELL = 30;
var TOOLS = [["wall", "Wall"], ["door", "Door"], ["window", "Window"], ["thing", "Furniture"], ["rub", "Rubber"]];
function gridWidget(el, api){
  var d = api.data || {};
  if(!d.cells || typeof d.cells !== "object") d.cells = {};
  var tool = d.tool || "wall";
  var per = api.level === "mild" ? 1 : 0.5;
  el.innerHTML = '<div class="a2task"><h4>Drawing board</h4>' +
    '<p>Pick a tool, then tap or drag on the squares. Draw walls first, then gaps for doors and windows. Rubber fixes anything. ' +
    'Scale: <b>1 square = ' + (per === 1 ? "1 metre" : "50 cm") + '</b>.</p>' +
    '<div class="tb" style="display:flex;flex-wrap:wrap;gap:6px;margin:8px 0"></div>' +
    '<div class="gb" style="max-width:480px;touch-action:none"></div>' +
    '<p class="gr" style="font-weight:700;margin:8px 0 0"></p>' +
    '<div class="qnav"><button type="button" class="btn btn-quiet gs">Start me off with a room</button><button type="button" class="btn btn-quiet gc">Clear it all</button></div></div>';
  var tb = el.querySelector(".tb"), gb = el.querySelector(".gb"), gr = el.querySelector(".gr");
  TOOLS.forEach(function(t){
    var b = document.createElement("button");
    b.type = "button"; b.className = "a2chip"; b.textContent = t[1]; b.dataset.tool = t[0];
    b.setAttribute("aria-pressed", t[0] === tool ? "true" : "false");
    b.onclick = function(){ tool = t[0]; d.tool = tool; [].forEach.call(tb.children, function(x){ x.setAttribute("aria-pressed", x.dataset.tool === tool ? "true" : "false"); }); };
    tb.appendChild(b);
  });
  function cellSvg(x, y, k){
    var X = x * CELL, Y = y * CELL;
    if(k === "wall") return '<rect x="' + X + '" y="' + Y + '" width="' + CELL + '" height="' + CELL + '" fill="#141a33"/>';
    if(k === "door") return '<rect x="' + X + '" y="' + Y + '" width="' + CELL + '" height="' + CELL + '" fill="#fff4e6"/><path d="M' + (X + 3) + ' ' + (Y + CELL - 3) + 'V' + (Y + 3) + '" stroke="#8a4b1f" stroke-width="3"/><path d="M' + (X + 3) + ' ' + (Y + 3) + 'A' + (CELL - 6) + ' ' + (CELL - 6) + ' 0 0 1 ' + (X + CELL - 3) + ' ' + (Y + CELL - 3) + '" fill="none" stroke="#8a4b1f" stroke-width="1.6" stroke-dasharray="3 3"/>';
    if(k === "window") return '<rect x="' + X + '" y="' + (Y + 8) + '" width="' + CELL + '" height="' + (CELL - 16) + '" fill="#bfe6fa" stroke="#141a33" stroke-width="1.5"/><path d="M' + X + ' ' + (Y + CELL / 2) + 'h' + CELL + '" stroke="#141a33" stroke-width="1.5"/>';
    if(k === "thing") return '<rect x="' + (X + 2) + '" y="' + (Y + 2) + '" width="' + (CELL - 4) + '" height="' + (CELL - 4) + '" rx="4" fill="#ffb36b" stroke="#141a33" stroke-width="1.2"/>';
    return "";
  }
  function draw(){
    var g = "";
    for(var i = 0; i <= COLS; i++) g += "M" + (i * CELL) + " 0V" + (ROWS * CELL);
    for(var j = 0; j <= ROWS; j++) g += "M0 " + (j * CELL) + "H" + (COLS * CELL);
    var cells = "";
    Object.keys(d.cells).forEach(function(key){ var p = key.split(","); cells += cellSvg(+p[0], +p[1], d.cells[key]); });
    gb.innerHTML = '<svg viewBox="0 0 ' + (COLS * CELL) + ' ' + (ROWS * CELL) + '" style="width:100%;height:auto;display:block;background:#ffffff;border:3px solid #22508f;border-radius:8px;cursor:crosshair" role="img" aria-label="Your drawing grid">' +
      '<path d="' + g + '" stroke="#c9d3e6" stroke-width="1"/>' + cells + '</svg>';
    var xs = [], ys = [], n = { wall: 0, door: 0, window: 0, thing: 0 };
    Object.keys(d.cells).forEach(function(key){ var p = key.split(","), k = d.cells[key]; n[k] = (n[k] || 0) + 1; if(k !== "thing"){ xs.push(+p[0]); ys.push(+p[1]); } });
    if(xs.length){
      var wq = Math.max.apply(null, xs) - Math.min.apply(null, xs) + 1, hq = Math.max.apply(null, ys) - Math.min.apply(null, ys) + 1;
      gr.textContent = "Your building is " + wq + " by " + hq + " squares: about " + (wq * per) + " m by " + (hq * per) + " m. " +
        n.door + " door square" + (n.door === 1 ? "" : "s") + ", " + n.window + " window square" + (n.window === 1 ? "" : "s") + ".";
    } else gr.textContent = "Nothing drawn yet. Have a go whenever you like.";
  }
  var painting = false;
  function at(e){
    var svg = gb.querySelector("svg"); if(!svg) return null;
    var r = svg.getBoundingClientRect(); if(!r.width) return null;
    var x = Math.floor((e.clientX - r.left) / r.width * COLS), y = Math.floor((e.clientY - r.top) / r.height * ROWS);
    if(x < 0 || y < 0 || x >= COLS || y >= ROWS) return null;
    return x + "," + y;
  }
  function paint(e){
    var k = at(e); if(!k) return;
    var before = d.cells[k];
    if(tool === "rub") delete d.cells[k]; else d.cells[k] = tool;
    if(before !== d.cells[k]){ draw(); try{ api.save(); }catch(err){} api.done("done"); }
  }
  gb.addEventListener("pointerdown", function(e){ painting = true; paint(e); e.preventDefault(); });
  gb.addEventListener("pointermove", function(e){ if(painting) paint(e); });
  ["pointerup", "pointerleave", "pointercancel"].forEach(function(ev){ gb.addEventListener(ev, function(){ painting = false; }); });
  el.querySelector(".gs").onclick = function(){
    for(var x = 2; x <= 11; x++){ d.cells[x + ",1"] = "wall"; d.cells[x + ",8"] = "wall"; }
    for(var y = 1; y <= 8; y++){ d.cells["2," + y] = "wall"; d.cells["11," + y] = "wall"; }
    draw(); try{ api.save(); }catch(err){} api.done("done");
  };
  el.querySelector(".gc").onclick = function(){ d.cells = {}; draw(); try{ api.save(); }catch(err){} };
  draw();
}

/* the challenge card: a real plan, away from the screen */
var GO = ["Pick a room: your bedroom, Base 5, or anywhere you like", "Measure it with a tape, or count your steps along each wall",
  "Pick a scale, like 1 square = 50 cm", "Draw the walls with a ruler on squared paper", "Add door and window symbols",
  "Add labels, a title and the scale", "Extra, if you fancy it: draw one wall as an elevation"];
function goWidget(el, api){
  var d = api.data || {};
  if(!Array.isArray(d.ticks)) d.ticks = [];
  el.innerHTML = '<div class="a2task"><h4>Challenge card: draw a real plan</h4><p>Away from the screen, whenever you are ready. Do as much or as little as you like, in any order. A photo of it would make Jay very happy.</p><div class="xlist"></div></div>';
  var list = el.querySelector(".xlist");
  GO.forEach(function(t, k){
    var lab = document.createElement("label");
    lab.style.cssText = "display:flex;gap:10px;align-items:center;margin:8px 0;font-size:1rem;cursor:pointer";
    var cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = !!d.ticks[k];
    cb.style.cssText = "width:22px;height:22px;flex:none";
    cb.onchange = function(){ d.ticks[k] = cb.checked; try{ api.save(); }catch(err){} api.done("done"); };
    lab.appendChild(cb); lab.appendChild(document.createTextNode(t));
    list.appendChild(lab);
  });
}

(window.A2PACKS = window.A2PACKS || {})["draw-like-an-architect"] = {
  a2: true,
  id: "a2-draw-like-an-architect",
  title: "Draw like an architect",
  subject: "Aesthetic and Creative",
  bodyClass: "subj-home subj-pillar",
  mins: 25,
  line: "Plans from above, elevations from the front, symbols, labels and a scale. Then draw your own.",
  blurb: "How architects draw a building flat: plans, elevations, symbols for doors and windows, labels and a scale. Four short chunks, a drawing board to try, a challenge card for a real plan, and a title block to make at the end.",
  note: "Drawing like an architect: plans, symbols, labels and scale, with a drawing board and a real plan challenge. Four five minute chunks, whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Sketchbook", line: "Sketchbook: what plans show, the main symbols, and 1 square = 1 metre." },
    { id: "medium", name: "Drawing board", line: "Drawing board: reading plans closely, and a scale of 1 square = 50 cm." },
    { id: "spicy", name: "Blueprint", line: "Blueprint: why plans are drawn the way they are, door swings, and scales like 1:50." }
  ],
  themes: {
    time: { name: "Time travel", w: { building: "the time lab", thing: "time machine" } },
    football: { name: "Football", w: { building: "the changing room", thing: "kit bench" } },
    horror: { name: "Horror", w: { building: "the haunted cabin", thing: "creaky bed" } },
    fishing: { name: "Fishing", w: { building: "the fishing hut", thing: "tackle box" } },
    music: { name: "Music", w: { building: "the dressing room", thing: "piano" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: VIEWS,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Plan or elevation?", title: "Two ways to draw a building flat",
      ez: { title: "Plan or elevation", html: "<p>A <b>plan</b> is from <b>above</b>.</p><p>An <b>elevation</b> is from the <b>front</b>.</p>" },
      fig: VIEWS,
      html: "<p>Architects draw buildings flat, from straight on, so builders can measure from the drawing.</p>" +
        "<p>A <b>plan</b> is the view from <b>above</b>: like a bird flying over with the roof lifted off. You see the rooms, the walls, the doors and the windows.</p>" +
        "<p>An <b>elevation</b> is the view from the <b>front</b> (or a side). You see how tall it is, the roof, and where the windows sit up the wall.</p>",
      lv: { spicy: { html: "<p>Architects draw buildings flat and square on, with no perspective, so every line can be measured.</p>" +
        "<p>A <b>plan</b> is drawn as if the building has been sliced through at about 1 metre high and you are looking down. That slice cuts through the doors and windows, so they show up in the walls.</p>" +
        "<p>An <b>elevation</b> looks straight at one face. It shows heights: the roof, the window heights, the door. Architects usually draw an elevation for every side: front, back, left and right.</p>" } } },

    { type: "mc", topic: "Plan or elevation?",
      q: "Which drawing is the <b>plan</b> of [[building]]?",
      fig: twoDrawings(false),
      options: ["Drawing A", "Drawing B"], answer: 0, fixed: true,
      slips: { 1: "Drawing B has a roof and a door you can see the front of. That is the view from the front: an elevation." },
      hint: "Which one looks down from above, with no roof?",
      why: "Drawing A looks down from above: walls, a door gap and windows in the walls. That is the plan.",
      ez: { q: "Which one is the <b>plan</b>?", hint: "Which looks down, with no roof?", why: "A looks down from above. A is the plan.", slips: { 1: "B shows the front. That is an elevation." } },
      lv: { spicy: { q: "Which drawing is the <b>elevation</b> of [[building]]?",
        fig: twoDrawings(true), answer: 0,
        slips: { 1: "Drawing B looks down from above: that is the plan." },
        hint: "Which one shows heights?",
        why: "Drawing A shows the roof, the door and the window heights from the front. That is the elevation." } } },

    { type: "sort", topic: "Plan or elevation?",
      q: "Which drawing would show it?",
      buckets: ["Plan (from above)", "Elevation (from the front)"],
      cards: [["Where the rooms are", 0], ["The shape of the roof", 1], ["Where the [[thing]] goes", 0], ["How tall the building is", 1]],
      slips: { any: "Ask: would I see it looking down, or looking straight at the front?" },
      hint: "Heights need the front view. Layouts need the view from above.",
      why: "Rooms and where things go are seen from above. The roof and the height are seen from the front.",
      ez: { hint: "Heights: front. Layouts: above.", why: "Rooms are seen from above. Roof and height from the front.", slips: { any: "Looking down, or looking at the front?" } },
      lv: {
        medium: { cards: [["Where the rooms are", 0], ["The shape of the roof", 1], ["Where the [[thing]] goes", 0], ["How tall the building is", 1], ["Which way the door swings", 0], ["How high up the windows are", 1]],
          why: "Layouts and door swings are seen from above. Roofs, heights and window heights are seen from the front." },
        spicy: { cards: [["How wide the corridor is", 0], ["The slope of the roof", 1], ["Which way the door swings", 0], ["The height of the door frame", 1], ["How thick the walls are", 0], ["Where the gutter runs along the front", 1]],
          why: "Widths, swings and wall thickness are seen from above. Slopes, heights and things on the face of the building are seen from the front." } } },

    { type: "mc", topic: "Plan or elevation?",
      q: "A bird flies over [[building]] with the roof taken off. Which drawing matches what it sees?",
      fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A bird flying over a building with no roof">' +
        '<rect width="420" height="150" rx="16" fill="#f4f1ea"/>' + room({ ox: 150, oy: 70, w: 5, h: 2, c: 26, doors: [{ wall: "b", at: 2 }], windows: [{ wall: "t", at: 1, len: 2 }] }) +
        A2ART.bird(110, 36, 1, "#ff5d5d") + '<path d="M140 46q40 -10 70 20" fill="none" stroke="#ff5d5d" stroke-width="2.5" stroke-dasharray="5 4"/></svg>',
      options: ["The plan", "The elevation", "Neither"],
      answer: 0,
      slips: { 1: "An elevation is from the front, at ground level. The bird is up above.", 2: "Looking straight down from above is exactly what a plan shows." },
      hint: "The bird is looking down.",
      why: "From above is the <b>plan</b>. Architects even call it a bird's eye view.",
      ez: { q: "A bird flies over. The roof is off. What does it see?", hint: "The bird is looking down.", why: "From above is the <b>plan</b>.", slips: { 1: "An elevation is from the front.", 2: "Looking down is a plan." } },
      lv: { spicy: { q: "Why are plans drawn as if the walls were sliced through at about 1 metre high?",
        fig: "",
        options: ["So the doors and windows show up in the walls", "So the roof shows on the plan", "To save paper", "So the furniture looks 3D"],
        slips: { 1: "The roof is above the slice, so it is not on the plan. It goes on the elevation.", 2: "It uses the same paper either way.", 3: "Plans are flat. Furniture is drawn as flat shapes from above." },
        hint: "What would you miss if you sliced it at the very top?",
        why: "Slicing at about 1 metre cuts through windows and doors, so the plan shows where they are." } } },

    { type: "multi", topic: "Plan or elevation?",
      q: "Pick <b>all</b> the things that are true about architect drawings.",
      options: ["They are drawn from straight above or straight in front", "They use symbols for doors and windows", "They have labels", "They must be in bright colours", "They show what everyone had for lunch"],
      answers: [0, 1, 2],
      slips: { any: "Three are true. Colour is optional, and lunch is very optional." },
      hint: "Colour is optional. Lunch is very optional.",
      why: "Straight on views, symbols and labels. Colour is a bonus, not a rule.",
      ez: { q: "Which are true about plans? Pick <b>all</b>.", hint: "Colour is a bonus.", why: "Straight on views and symbols. Colour is a bonus.", slips: { any: "2 are true. Colour is a bonus." } },
      lv: {
        mild: { options: ["They are drawn from straight above or straight in front", "They use symbols for doors and windows", "They must be in bright colours"], answers: [0, 1],
          why: "Straight on views and symbols. Colour is a bonus, not a rule." },
        spicy: { options: ["They are drawn without perspective", "They have a scale so real sizes can be worked out", "They use standard symbols that any builder can read", "Every line must be drawn freehand", "They only ever show the front"], answers: [0, 1, 2],
          slips: { any: "Three are true. Architects draw with rulers or computers, and they draw every side." },
          why: "No perspective, a scale, and standard symbols. Lines are drawn with a ruler or a computer, and every side gets drawn." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Symbols", title: "Symbols every builder can read",
      ez: { title: "Symbols", html: "<p><b>Wall</b>: thick line. <b>Door</b>: a gap and a curve.</p><p><b>Window</b>: thin lines. <b>Stairs</b>: an arrow.</p>" },
      fig: symbols(true),
      html: "<p>Plans use the same symbols everywhere, so any builder can read them.</p>" +
        "<p><b>Wall:</b> a thick line. <b>Door:</b> a gap in the wall, a line for the door, and a curve showing where it swings. <b>Window:</b> thin lines across the wall. <b>Stairs:</b> rows of steps with an arrow pointing up.</p>",
      lv: { spicy: { html: "<p>Plans use standard symbols, so any builder can read them.</p>" +
        "<p><b>Wall:</b> a thick line, drawn to its real thickness. <b>Door:</b> a gap, the door leaf, and a curve for the swing. The curve shows the floor space the door needs, so nothing should go inside it. <b>Window:</b> thin lines across the wall: glass sits inside the wall's thickness. <b>Stairs:</b> treads with an arrow pointing up.</p>" } } },

    { type: "match", topic: "Symbols",
      q: "Match each symbol to what it means.",
      fig: symbols(false),
      pairs: [["Symbol A", "Wall"], ["Symbol B", "Door"], ["Symbol C", "Window"], ["Symbol D", "Stairs"]],
      slips: { any: "Look for the swing curve (door), the thin lines across (window) and the arrow (stairs)." },
      hint: "The door has a curve. The stairs have an arrow.",
      why: "A thick line is a wall. A curve is a door. Thin lines across are a window. Steps with an arrow are stairs.", ez: { hint: "Door: curve. Stairs: arrow.", why: "Thick line: wall. Curve: door. Thin lines: window. Arrow: stairs.", slips: { any: "Look for the curve, the thin lines and the arrow." } } },

    { type: "mc", topic: "Symbols",
      q: "Here is a plan of [[building]]. Where is the door?",
      fig: DOORFIG,
      options: ["In the bottom wall, on the left", "In the top wall", "In the right wall"],
      answer: 0,
      slips: { 1: "The thin lines in the top wall are a window.", 2: "The right wall is solid all the way down." },
      hint: "Look for the gap with a curve.",
      why: "The gap with the swing curve is at the bottom, on the left.",
      ez: { q: "Where is the door?", hint: "Find the gap with a curve.", why: "Bottom wall, on the left.", slips: { 1: "Thin lines are a window.", 2: "The right wall has no gap." } },
      lv: {
        medium: { q: "Here is a plan of [[building]]. How many windows does it have?",
          fig: WINFIG,
          options: ["3", "2", "4", "1"],
          slips: { 1: "Check the left wall too.", 2: "The gap with a curve is a door, not a window.", 3: "There are more. Look along every wall." },
          hint: "Look for thin lines across the walls, on every wall.",
          why: "Two in the top wall and one in the left wall: <b>3</b>." },
        spicy: { q: "Which way does this door open?",
          fig: SWINGFIG,
          options: ["Outwards, away from the room", "Into the room"],
          answer: 0, fixed: true,
          slips: { 1: "The curve is drawn on the side the door swings into. Here it is outside the room." },
          hint: "Which side of the wall is the curve on?",
          why: "The swing curve is outside the wall, so the door opens <b>outwards</b>." } } },

    { type: "mc", topic: "Symbols", explain: true,
      q: "Where is the best spot for the [[thing]]?",
      fig: SPOTFIG,
      options: ["Spot A", "Spot B", "Spot C"],
      answer: 1, fixed: true,
      slips: { 0: "Spot A is inside the door's curve. The door would bang into it every time.", 2: "Spot C is outside the room, in the doorway. Nobody could get in." },
      hint: "Keep out of the door's curve, and keep the way in clear.",
      why: "Spot B is against a wall, clear of the door swing and the way in. Architects check this on every plan.", ez: { hint: "Keep out of the door curve.", why: "Spot B. It is clear of the door.", slips: { 0: "A is in the door curve. Bang!", 2: "C blocks the way in." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Labels and scale", title: "Labels, a title and a scale",
      ez: { title: "Labels and scale", html: "<p>A plan has a <b>title</b>, <b>labels</b> and a <b>scale</b>.</p><p><b>1 square = 1 metre</b>. 6 squares = 6 metres.</p>" },
      fig: labelled(30, "1 square = 1 m", A2ART.egg('<g transform="translate(200 240)">' + A2ART.bonnie(0, 0, 0.32, "sit") + '</g>', "Bonnie has sneaked onto the plan. Architects call this a dog bed. Bonnie calls it the most important room.")),
      html: "<p>A finished plan has three helpers.</p>" +
        "<p><b>A title:</b> what it is, like \"Plan of [[building]]\". <b>Labels:</b> words that name things. <b>A scale:</b> how big it is for real.</p>" +
        "<p>Here, <b>1 square = 1 metre</b>. The long wall is 6 squares, so it is <b>6 metres</b> for real.</p>",
      lv: {
        medium: { fig: labelled(30, "1 square = 50 cm"),
          html: "<p>A finished plan has a title, labels and a scale.</p>" +
            "<p>Here, <b>1 square = 50 cm</b>. Worked example for the long wall:<br><b>1.</b> Count the squares: 6.<br><b>2.</b> Times by the scale: 6 &times; 50 = 300 cm.<br><b>3.</b> Change to metres: 300 cm = <b>3 m</b>.</p>" },
        spicy: { fig: labelled(30, "1:50"),
          html: "<p>Real plans often give the scale as a ratio, like <b>1:50</b>. It means 1 cm on the drawing is 50 cm for real.</p>" +
            "<p>Worked example: a wall is 8 cm long on a 1:50 drawing.<br><b>1.</b> Times by 50: 8 &times; 50 = 400 cm.<br><b>2.</b> Change to metres: 400 cm = <b>4 m</b>.</p>" +
            "<p>Going the other way, divide: a 3 m wall is 300 cm, and 300 &divide; 50 = 6 cm on the drawing.</p>" } } },

    { type: "num", topic: "Labels and scale",
      q: "Your turn, step by step. 1 square = 1 metre. Count the squares along the <b>long</b> wall, then give the real length.",
      fig: labelled(30, "1 square = 1 m"),
      boxes: [{ label: "Squares", a: 6 }, { label: "Real length", a: 6, post: "m" }],
      slips: [[0, 4, "That is the short wall. Count along the long one."], [0, 5, "Count again from corner to corner, one square at a time."]],
      hint: "Count the squares along the top wall.",
      why: "6 squares, and each one is 1 m, so the long wall is <b>6 m</b>.",
      ez: { q: "1 square = 1 metre. Count the <b>long</b> wall. How long is it?", hint: "Count along the top wall.", why: "6 squares. So <b>6 m</b>.", slips: [[null, null, "That is the short wall."], [null, null, "Count again, 1 square at a time."]] },
      lv: {
        medium: { q: "Your turn, step by step. 1 square = 50 cm. Count the squares along the long wall, change it to cm, then to metres.",
          fig: labelled(30, "1 square = 50 cm"),
          boxes: [{ label: "Squares", a: 6 }, { label: "Real length", a: 300, post: "cm" }, { label: "In metres", a: 3, post: "m" }],
          slips: [[1, 6, "Each square is 50 cm, so times the squares by 50."], [2, 300, "300 is in cm. There are 100 cm in a metre."], [2, 30, "100 cm make 1 m, so 300 cm is 3 m."]],
          hint: "6 &times; 50, then divide by 100.",
          why: "6 &times; 50 = 300 cm, which is <b>3 m</b>." },
        spicy: { q: "Your turn, step by step. On a 1:50 plan, a wall is 6 cm long. Find the real length in cm, then in metres.",
          fig: "",
          boxes: [{ label: "Real length", a: 300, post: "cm" }, { label: "In metres", a: 3, post: "m" }],
          slips: [[0, 56, "Do not add. 1:50 means times by 50."], [1, 300, "That is cm. Divide by 100 for metres."], [1, 30, "100 cm make 1 m, so 300 cm is 3 m."]],
          hint: "Times by 50, then divide by 100.",
          why: "6 &times; 50 = 300 cm, which is <b>3 m</b>." } } },

    { type: "num", topic: "Labels and scale",
      q: "Now on your own. 1 square = 1 metre. How wide is it for real, along the <b>short</b> wall?",
      fig: labelled(30, "1 square = 1 m"),
      boxes: [{ label: "Real width", a: 4, post: "m" }],
      slips: [[6, "That is the long wall. Count down the short side."], [3, "Count again, one square at a time, from corner to corner."]],
      hint: "Count down the right hand wall.",
      why: "4 squares at 1 m each: <b>4 m</b>.",
      ez: { q: "1 square = 1 metre. How long is the <b>short</b> wall?", hint: "Count down the right wall.", why: "4 squares. So <b>4 m</b>.", slips: [[null, "That is the long wall."], [null, "Count again, 1 square at a time."]] },
      lv: {
        medium: { q: "Now on your own. 1 square = 50 cm. How wide is it for real, along the short wall, in metres?",
          fig: labelled(30, "1 square = 50 cm"),
          boxes: [{ label: "Real width", a: 2, post: "m" }],
          slips: [[4, "4 is the number of squares. Each one is only 50 cm."], [200, "200 is right in cm. The box wants metres."], [3, "That is the long wall. Count down the short side."]],
          hint: "4 squares &times; 50 cm, then into metres.",
          why: "4 &times; 50 = 200 cm, which is <b>2 m</b>." },
        spicy: { q: "Now on your own, the other way. A real room is 4.5 m long. How long should it be on a 1:50 plan?",
          fig: "",
          boxes: [{ label: "On the plan", a: 9, post: "cm" }],
          slips: [[0.09, "Change the metres to cm first: 4.5 m = 450 cm. Then divide by 50."], [225, "Going from real to plan, divide by 50 instead of multiplying."], [90, "Check the division: 450 &divide; 50."]],
          hint: "Change to cm, then divide by 50.",
          why: "4.5 m = 450 cm, and 450 &divide; 50 = <b>9 cm</b>." } } },

    { type: "mc", topic: "Labels and scale",
      q: "Which is the best title for this drawing?",
      fig: labelled(30, "1 square = 1 m"),
      options: ["Plan of [[building]]", "Drawing", "My thing", "Nice room"],
      answer: 0,
      slips: { 1: "Drawing of what? A title says what it shows.", 2: "Which thing? A reader would not know.", 3: "That is an opinion, not what the drawing is." },
      hint: "Which one tells a stranger what they are looking at?",
      why: "<b>Plan of [[building]]</b> says what kind of drawing it is, and what it shows.",
      ez: { q: "Which is the best title?", hint: "Which tells a stranger the most?", why: "<b>Plan of [[building]]</b> says what it shows.", slips: { 1: "Drawing of what?", 2: "Which thing?", 3: "That is an opinion." } },
      lv: {
        medium: { q: "Why does a plan need a scale?",
          fig: "",
          options: ["So you can work out the real sizes", "To make it look neat", "So you know which way is up", "To show the colours"],
          slips: { 1: "Neat is nice, but the scale has a real job.", 2: "A north arrow does that job.", 3: "Scales are about size, not colour." },
          hint: "Think about a builder with a tape measure.",
          why: "The scale turns lengths on paper into real lengths." },
        spicy: { q: "What is missing from this plan?",
          fig: planFig({ ox: 60, oy: 50, w: 8, h: 5, c: 28, doors: [{ wall: "b", at: 1 }], windows: [{ wall: "t", at: 3, len: 2 }] }, "A plan of [[building]] with a title but nothing else", T(60, 34, "Plan of [[building]]", 15, { b: 1 })),
          options: ["A scale", "A title", "Walls", "A door"],
          slips: { 1: "Look above the walls: there is a title.", 2: "The thick lines are the walls.", 3: "The gap with a curve is a door." },
          hint: "Could a builder work out how big it is?",
          why: "There is no <b>scale</b>, so nobody can tell how big it really is. Labels would help too." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Your turn", title: "Drawing your own, step by step",
      ez: { title: "Draw your own", html: "<p><b>Measure</b>. Draw <b>walls</b>. Add <b>symbols</b>. Add <b>labels</b>.</p><p>Pencil first!</p>" },
      fig: GROW,
      html: "<p>Architects build a drawing up in layers.</p>" +
        "<p><b>1.</b> Measure the space. A tape is best, but counting steps works too.<br><b>2.</b> Pick a scale and draw the <b>walls</b>.<br><b>3.</b> Add <b>symbols</b> for doors and windows.<br><b>4.</b> Add <b>labels</b>, a <b>title</b> and the <b>scale</b>.</p>" +
        "<p>Pencil first. Architects rub out all the time.</p>" },

    { type: "order", topic: "Your turn",
      q: "Put the steps for drawing a plan in order.",
      items: ["Measure the space", "Pick a scale", "Draw the walls", "Add door and window symbols", "Add labels, a title and the scale"],
      slips: { any: "You need the walls before you can put doors in them, and the sizes before you can draw the walls." },
      hint: "You cannot put a door in a wall that is not there yet.",
      why: "Measure, scale, walls, symbols, labels. Each step needs the one before.",
      ez: { hint: "Walls come before doors.", why: "Measure, walls, symbols, labels.", slips: { any: "Walls first. Then doors go in them." } },
      lv: { mild: { items: ["Measure the space", "Draw the walls", "Add door and window symbols", "Add labels and a title"] } } },

    { type: "widget", topic: "Your turn", unscored: true,
      title: "Try the drawing board",
      ez: { html: "<p>Draw any building you like. Only if you fancy it.</p>" },
      html: "<p>Draw any building you like: [[building]], your dream bedroom, a den. Only if you fancy it.</p>",
      mount: gridWidget,
      report: function(d){ var n = d && d.cells ? Object.keys(d.cells).length : 0; return n ? "Drawing board: " + n + " squares drawn." : ""; } },

    { type: "widget", topic: "Your turn", unscored: true,
      title: "Challenge card",
      ez: { html: "<p>A real drawing, away from the screen.</p>" },
      html: "<p>A real world drawing, away from the screen. What you tick can go to Jay with the rest if you send it.</p>",
      mount: goWidget,
      report: function(d){ var n = d && d.ticks ? d.ticks.filter(Boolean).length : 0; return n ? "Real plan challenge: " + n + " of " + GO.length + " ticked." : ""; } },

    { type: "write", topic: "Your turn",
      q: "How did your drawing go? Tell Jay about it, if you like: what you drew, what went well, and what you would add next time.",
      starters: ["I drew a plan of", "The scale I used was", "The best part was", "Next time I would add", "The trickiest bit was"],
      checklist: ["I said what I drew", "I said one thing that went well", "I said one thing to try next time"],
      ez: { q: "How did your drawing go? Tell Jay, if you like." },
      minWords: 25,
      lv: { spicy: { minWords: 50, checklist: ["I said what I drew and the scale", "I said how I measured it", "I said one thing that went well", "I said one thing I would change, and why"] } } }
  ],

  ez: {
    realWorld: { title: "Who draws like this?", html: "<p>Builders, game designers and estate agents all use plans.</p><p>Plans let us see a Roman villa from long ago.</p>" },
    make: { intro: "Make a title block for your drawing." }
  },

  realWorld: {
    title: "Who draws like this?",
    html: "<p>Architects, builders, kitchen fitters and electricians all read plans. Estate agents put floor plans on every house advert. The fire escape map on the back of a hotel door is a plan. Game designers sketch levels from above too.</p>" +
      "<p>For our big question: if we could time travel, should we? Archaeologists cannot, so they do the next best thing. They draw plans of buildings from long ago using the bottoms of the old walls, and that lets us walk round a Roman villa that fell down 1 600 years ago.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to a time portal and an old plan">' + A2ART.portal(70, 75, 54) +
      '<g transform="translate(150 30)"><rect x="0" y="0" width="120" height="100" rx="6" fill="#1d4f8f"/>' +
      '<path d="M14 14h92v72h-92zM14 50h40M70 14v30M54 50v36" fill="none" stroke="#ffffff" stroke-width="3"/></g>' +
      A2ART.jay(330, 48, 0.8, "wow") + '</svg>'
  },

  make: {
    title: "Make a title block",
    intro: "Every architect's drawing has a title block in the corner. Make your own, for a drawing you have done or one you would like to do.",
    fields: [
      { id: "title", label: "Drawing title", ph: "Plan of my bedroom", max: 40 },
      { id: "scale", label: "Scale", ph: "1 square = 50 cm", max: 20 },
      { id: "feature", label: "Best feature", ph: "A big window over the desk", max: 50 },
      { id: "name", label: "Architect", ph: "B5 Design Studio", max: 24 }
    ],
    svg: function(v){
      var ti = wrap(v.title, 21, 2), fe = wrap(v.feature, 25, 2), sc = wrap(v.scale, 16, 2), nm = wrap(v.name, 24, 1)[0] || "";
      var grid = "";
      for(var i = 1; i < 30; i++) grid += "M" + (i * 20) + " 0V400";
      for(var j = 1; j < 20; j++) grid += "M0 " + (j * 20) + "H600";
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="20" fill="#1d4f8f"/>' +
        '<path d="' + grid + '" stroke="#ffffff" stroke-opacity=".08" stroke-width="1"/>' +
        '<rect x="14" y="14" width="572" height="372" rx="14" fill="none" stroke="#ffffff" stroke-width="3"/>' +
        /* a little plan */
        '<g stroke="#ffffff" fill="none">' +
        '<path d="M40 40h200v140h-200z" stroke-width="7"/><path d="M40 110h70M150 40v60" stroke-width="5"/>' +
        '<path d="M110 180v-30" stroke="#1d4f8f" stroke-width="9"/><path d="M110 180v-30" stroke="#ffd23f" stroke-width="3"/><path d="M110 150a30 30 0 0 1 30 30" stroke="#ffd23f" stroke-width="2" stroke-dasharray="4 4"/>' +
        '<path d="M175 40h45" stroke="#1d4f8f" stroke-width="9"/><path d="M175 36h45M175 44h45M175 40h45" stroke="#9fd6ff" stroke-width="2"/></g>' +
        T(280, 64, "DRAWING NO. 1", 16, { b: 1, c: "#ffd23f" }) +
        fe.map(function(l, k){ return T(280, 104 + k * 26, esc(l), 18, { c: "#ffffff" }); }).join("") +
        T(280, 162, "Best feature", 13, { c: "#9fd6ff" }) +
        /* title block */
        '<rect x="40" y="214" width="520" height="152" fill="#ffffff"/>' +
        '<path d="M40 304h520M380 214v152" stroke="#141a33" stroke-width="2"/>' +
        T(54, 236, "TITLE", 13, { b: 1, c: "#5b6180" }) +
        ti.map(function(l, k){ return T(54, 264 + k * 26, esc(l), 20, { b: 1 }); }).join("") +
        T(394, 236, "SCALE", 13, { b: 1, c: "#5b6180" }) + sc.map(function(l, k){ return T(394, 262 + k * 22, esc(l), 15, { b: 1 }); }).join("") +
        T(54, 326, "ARCHITECT", 13, { b: 1, c: "#5b6180" }) + T(54, 352, esc(nm), 17, { b: 1 }) +
        T(394, 326, "CHECKED", 13, { b: 1, c: "#5b6180" }) +
        '<g transform="translate(470 348) rotate(-10)"><rect x="-56" y="-18" width="112" height="32" rx="6" fill="none" stroke="#1f9d63" stroke-width="3"/>' + T(0, 5, "APPROVED", 15, { a: "middle", b: 1, c: "#1f9d63" }) + '</g>' +
        '</svg>';
    }
  }
};
})();
