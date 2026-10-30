/* Base 5 core target activity: Fact families.
   Maths. Multiplication facts and their division partners: family
   triangles, undoing with the inverse, scaling a known fact up and
   down, and real sharing problems with remainders. Replayable: every
   question carries two extra versions (vary). ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"', INK = "#141a33";
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || INK) + '">' + s + '</text>';
}
function pic(w, h, aria, inner){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + aria + '"><rect width="' + w + '" height="' + h + '" rx="16" fill="#f4f1ea"/>' + inner + '</svg>'; }
function r6(x){ return Math.round(x * 1e6) / 1e6; }
function fm(x){ return String(r6(x)); }
function mo(x){ return (Math.round(x * 100) / 100).toFixed(2); }
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function fit(x, y, t, size, w, o){ var s = o.raw ? String(t) : esc(t), est = s.length * size * 0.72; return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + size + '"' + (o.b ? ' font-weight="700"' : '') + (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + o.c + '"' + (est > w ? ' textLength="' + w + '" lengthAdjust="spacingAndGlyphs"' : '') + '>' + s + '</text>'; }
var X = " &times; ", D = " &divide; ", SX = " &#215; ", SD = " &#247; ";
function fa(x){ var r = Math.round(x * 100) / 100; return r === r6(x) ? fm(x) : fm(r) + "..."; }
function mul(a, b){ return fm(a) + X + fm(b) + " = " + fm(a * b); }
function dv(p, a){ return fm(p) + D + fm(a) + " = " + fm(p / a); }

function clean(o){
  if(o.boxes && Array.isArray(o.slips)) o.slips = o.slips.filter(function(r){ var b = r.length === 3 ? r[0] : 0; return !(o.boxes[b] && Math.abs(r[r.length - 2] - o.boxes[b].a) < 1e-9); });
  return o;
}
function G(type, topic, sets, extra){
  sets.forEach(function(v){ v.forEach(clean); });
  function one(v){
    /* easy read for LC: only the first level's (mild) ez is kept, at the top of the step or version */
    var e = v[1].ez; v.forEach(function(x){ delete x.ez; });
    if(e && e.slips && v[1].boxes) e.slips = clean({ boxes: v[1].boxes, slips: e.slips }).slips;
    var o = {}; Object.keys(v[0]).forEach(function(k){ o[k] = v[0][k]; }); o.lv = { mild: v[1], spicy: v[2] }; if(e) o.ez = e; return o; }
  var s = { type: type, topic: topic }, b = one(sets[0]);
  Object.keys(b).forEach(function(k){ s[k] = b[k]; });
  if(sets.length > 1) s.vary = sets.slice(1).map(one);
  Object.keys(extra || {}).forEach(function(k){ s[k] = extra[k]; });
  return s;
}

/* ---------- pictures ---------- */

/* a family triangle: product at the top, the two factors at the bottom */
function tri(cx, cy, a, b, hide, col, sc){
  sc = sc || 1;
  function v(x, k){ return hide === k ? "?" : fm(x); }
  var w = 110 * sc, h = 96 * sc;
  return '<path d="M' + cx + ' ' + (cy - h) + 'L' + (cx + w) + ' ' + (cy + h * 0.55) + 'L' + (cx - w) + ' ' + (cy + h * 0.55) + 'Z" fill="' + (col || "#ffd23f") + '" fill-opacity=".35" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M' + (cx - w * 0.52) + ' ' + (cy + h * 0.02) + 'H' + (cx + w * 0.52) + '" stroke="' + INK + '" stroke-width="2"/><path d="M' + cx + ' ' + (cy + h * 0.02) + 'V' + (cy + h * 0.55) + '" stroke="' + INK + '" stroke-width="2"/>' +
    T(cx, cy - h * 0.3, v(a * b, "p"), 24 * sc, { b: 1, a: "middle", c: hide === "p" ? "#1f6f8b" : INK }) +
    T(cx - w * 0.38, cy + h * 0.38, v(a, "a"), 22 * sc, { b: 1, a: "middle", c: hide === "a" ? "#1f6f8b" : INK }) +
    T(cx + w * 0.38, cy + h * 0.38, v(b, "b"), 22 * sc, { b: 1, a: "middle", c: hide === "b" ? "#1f6f8b" : INK }) +
    '<circle cx="' + cx + '" cy="' + (cy + h * 0.3) + '" r="' + 11 * sc + '" fill="#ffffff" stroke="' + INK + '" stroke-width="1.5"/>' + T(cx, cy + h * 0.3 + 6 * sc, "&#215;", 17 * sc, { b: 1, a: "middle", c: INK });
}
function triFig(a, b, hide, note, egg){
  return pic(520, 230, "A fact family triangle for " + fm(a) + ", " + fm(b) + " and " + fm(a * b),
    tri(260, 120, a, b, hide) + T(260, 214, note || "Top = bottom left " + "&#215;" + " bottom right", 14, { b: 1, a: "middle", c: "#1f6f8b" }) +
    (egg ? A.egg(A.bird(440, 60, 0.6, "#3a8fd6"), "A blue tit sat on top of the triangle. It is the head of the family now.") : ""));
}
/* dots in rows; cover hides the bottom rows behind Bonnie */
function arrayFig(r, c, cover){
  var g = Math.min(34, 300 / c, 150 / r), x0 = 260 - (c - 1) * g / 2, y0 = 40, out = "";
  for(var i = 0; i < r; i++) for(var j = 0; j < c; j++) out += '<circle cx="' + (x0 + j * g) + '" cy="' + (y0 + i * g) + '" r="' + g * 0.32 + '" fill="' + (i % 2 ? "#22b8e6" : "#19c39a") + '"/>';
  var h = y0 + (r - 1) * g + 50;
  if(cover){
    var top = y0 + (r - cover - 0.5) * g;
    out += '<rect x="' + (x0 - g) + '" y="' + top + '" width="' + (c * g + g) + '" height="' + (h - top - 26) + '" rx="14" fill="#e8d6c2" stroke="' + INK + '" stroke-width="2"/>' +
      A.bonnie(260, top + (h - top - 26) / 2 - 4, Math.min(0.7, (h - top - 26) / 110), "stand") ;
  }
  return pic(520, h, "Dots in rows of " + c + (cover ? ", with Bonnie lying on some of them" : ""), out + T(260, h - 12, cover ? "Bonnie is lying on some of the rows" : r + " rows of " + c, 13, { b: 1, a: "middle", c: "#1f6f8b" }));
}
/* a machine: in, times or divide, out */
function machineFig(op, n, out, back){
  return pic(520, back ? 188 : 150, "A number machine",
    '<rect x="26" y="56" width="96" height="58" rx="12" fill="#ffffff" stroke="' + INK + '" stroke-width="2.5"/>' + T(74, 94, back ? "?" : "?", 26, { b: 1, a: "middle", c: "#1f6f8b" }) +
    '<path d="M126 85h48l-8 -8M174 85l-8 8" stroke="' + INK + '" stroke-width="3" fill="none"/>' +
    '<rect x="184" y="40" width="152" height="90" rx="14" fill="#8a5cf6" fill-opacity=".3" stroke="' + INK + '" stroke-width="2.5"/>' + T(260, 96, op + " " + fm(n), 28, { b: 1, a: "middle" }) +
    '<path d="M340 85h48l-8 -8M388 85l-8 8" stroke="' + INK + '" stroke-width="3" fill="none"/>' +
    '<rect x="398" y="56" width="96" height="58" rx="12" fill="#ffd23f" fill-opacity=".5" stroke="' + INK + '" stroke-width="2.5"/>' + T(446, 94, fm(out), 26, { b: 1, a: "middle" }) +
    (back ? '<path d="M446 140Q260 160 74 140" fill="none" stroke="#e07b24" stroke-width="3" stroke-dasharray="7 5"/><path d="M74 140l13 0 -6 9z" fill="#e07b24"/>' + T(260, 174, "run it backwards: " + back, 14, { b: 1, a: "middle", c: "#b8641c" }) : ""));
}
/* a ladder of facts, each step ten times bigger or smaller */
function ladderFig(rows){
  var out = "";
  rows.forEach(function(r, k){
    var y = 46 + k * 44;
    out += '<rect x="120" y="' + (y - 26) + '" width="280" height="36" rx="10" fill="' + (k ? "#ffffff" : "#ffd23f") + '" stroke="' + INK + '" stroke-width="2"/>' + T(260, y - 2, r[0], 17, { b: 1, a: "middle" });
    if(r[1]) out += T(418, y - 2, r[1], 13, { b: 1, c: "#1f6f8b" });
  });
  return pic(520, 30 + rows.length * 44, "A ladder of facts made from one times fact", out);
}
/* things shared into groups with some left over */
function shareFig(n, size, egg, quiet){
  var groups = Math.floor(n / size), left = n % size, out = "", gw = Math.min(90, 440 / (groups + (left ? 1 : 0))), x = 260 - gw * (groups + (left ? 1 : 0)) / 2;
  for(var g = 0; g < groups + (left ? 1 : 0); g++){
    var cnt = g < groups ? size : left, gx = x + g * gw;
    out += '<rect x="' + (gx + 4) + '" y="34" width="' + (gw - 8) + '" height="96" rx="12" fill="' + (g < groups ? "#19c39a" : "#ff8fb1") + '" fill-opacity=".3" stroke="' + INK + '" stroke-width="2"' + (g < groups ? "" : ' stroke-dasharray="6 4"') + '/>';
    for(var k = 0; k < cnt; k++){ var col = Math.min(3, Math.ceil(Math.sqrt(size))), rr = Math.floor(k / col), cc = k % col; out += '<circle cx="' + (gx + gw / 2 + (cc - (col - 1) / 2) * 16) + '" cy="' + (56 + rr * 16) + '" r="6" fill="' + INK + '"/>'; }
  }
  out += T(260, 156, quiet ? "Each box holds " + size + ". Count the full ones and the spare ones." : groups + " groups of " + size + (left ? ", and " + left + " left over" : ""), 15, { b: 1, a: "middle" });
  if(egg) out += A.egg(A.bird(480, 150, 0.5, "#ffd23f"), "A goldfinch is eyeing up the leftovers. Jay says that is what leftovers are for.");
  return pic(520, 176, n + " shared into groups of " + size, out);
}

/* ---------- question makers ---------- */
/* easy read for LC: the same slips (same numbers), with shorter messages */
function ezs(sl, msgs){ return sl.map(function(r, i){ var c = r.slice(); c[c.length - 1] = msgs[i]; return c; }); }

function triQ(a, b, hide){
  var p = r6(a * b), ans = hide === "p" ? p : hide === "a" ? a : b, other = hide === "a" ? b : a, sl = [];
  if(hide === "p") sl = [[r6(a + b), "Those were added. The top is the bottom two multiplied."], [r6(a * b - a), "Close. Check your times fact: " + mul(a, b) + "."]];
  else sl = [[r6(p - other), "That took away. Undo a times with a divide: " + fm(p) + D + fm(other) + "."], [r6(p * other), "That multiplied again. Go the other way: divide."], [r6(ans + 1), "Check: " + fm(other) + X + fm(ans + 1) + " = " + fm(other * (ans + 1)) + ", not " + fm(p) + "."], [r6(ans - 1), "Check: " + fm(other) + X + fm(ans - 1) + " = " + fm(other * (ans - 1)) + ", not " + fm(p) + "."]];
  return { q: hide === "p" ? "What goes at the top of this family triangle?" : "Find the missing number in this family triangle.",
    fig: triFig(a, b, hide), boxes: [{ label: "Missing number", a: ans }], slips: sl,
    hint: hide === "p" ? "Multiply the two bottom numbers." : "Cover the missing one: " + fm(p) + D + fm(other) + ".",
    why: hide === "p" ? mul(a, b) + ", so <b>" + fm(p) + "</b> goes at the top." : fm(p) + D + fm(other) + " = <b>" + fm(ans) + "</b>, because " + mul(other, ans) + ".",
    ez: { q: hide === "p" ? "What goes at the top?" : "Find the missing number.", hint: hide === "p" ? "Multiply the bottom two." : "Try " + fm(p) + D + fm(other) + ".",
      why: hide === "p" ? mul(a, b) + ". <b>" + fm(p) + "</b> goes on top." : fm(p) + D + fm(other) + " = <b>" + fm(ans) + "</b>.",
      slips: ezs(sl, hide === "p" ? ["That adds. Multiply the bottom two.", "Close. Check: " + mul(a, b) + "."] :
        ["That takes away. Try " + fm(p) + D + fm(other) + ".", "That multiplies. Divide instead.", "Check: " + fm(other) + X + fm(ans + 1) + " = " + fm(other * (ans + 1)) + ".", "Check: " + fm(other) + X + fm(ans - 1) + " = " + fm(other * (ans - 1)) + "."]) } };
}
function fam4(a, b){
  var p = r6(a * b);
  return { q: "Here is the family of <b>" + fm(a) + ", " + fm(b) + " and " + fm(p) + "</b>. You know " + mul(a, b) + ". Fill in the other three.",
    fig: triFig(a, b, "", "One triangle, four facts"),
    boxes: [{ label: fm(b) + X + fm(a) + " =", a: p }, { label: fm(p) + D + fm(a) + " =", a: b }, { label: fm(p) + D + fm(b) + " =", a: a }],
    slips: [[1, a, "That is the number you divided by. " + fm(p) + D + fm(a) + " asks how many " + fm(a) + "s make " + fm(p) + "."], [2, b, "That is the number you divided by. " + fm(p) + D + fm(b) + " asks how many " + fm(b) + "s make " + fm(p) + "."], [0, r6(a + b), "Times, not add. Swapping the order does not change the answer."]],
    hint: "Times works in any order. Divide the top by one bottom number to get the other.",
    why: mul(b, a) + ", " + dv(p, a) + ", " + dv(p, b) + ". All four use the same three numbers.",
    ez: { q: "Family: <b>" + fm(a) + ", " + fm(b) + " and " + fm(p) + "</b>. Fill in the other 3 facts.", hint: "Divide the top by a bottom number.",
      why: mul(b, a) + ", " + dv(p, a) + ", " + dv(p, b) + ".",
      slips: ["How many " + fm(a) + "s make " + fm(p) + "?", "How many " + fm(b) + "s make " + fm(p) + "?", "Times, not add."].map(function(m, i){ return [[1, a], [2, b], [0, r6(a + b)]][i].concat([m]); }) } };
}
function oddOut(a, b){
  var p = r6(a * b), opts = [fm(a) + D + fm(p) + " = " + fm(b), fm(b) + X + fm(a) + " = " + fm(p), fm(p) + D + fm(b) + " = " + fm(a), fm(p) + D + fm(a) + " = " + fm(b)];
  return { q: "Which one is <b>not</b> a true fact in the family of " + fm(a) + ", " + fm(b) + " and " + fm(p) + "?", options: opts, answer: 0,
    slips: { 1: "That one is true: times works in any order.", 2: "That one is true: " + fm(b) + X + fm(a) + " = " + fm(p) + ".", 3: "That one is true: " + fm(a) + X + fm(b) + " = " + fm(p) + "." },
    hint: "In a divide fact, the biggest number (the top of the triangle) comes first.",
    why: "<b>" + opts[0] + "</b> is back to front. Dividing the small number by the big one does not give " + fm(b) + ". The family's divide facts always start with " + fm(p) + ".",
    ez: { q: "Which is <b>not</b> true for " + fm(a) + ", " + fm(b) + " and " + fm(p) + "?", hint: "Divide facts start with the biggest number.", why: "<b>" + opts[0] + "</b> is back to front.",
      slips: { 1: "True. Times works any way round.", 2: "True: " + fm(b) + X + fm(a) + " = " + fm(p) + ".", 3: "True: " + fm(a) + X + fm(b) + " = " + fm(p) + "." } } };
}
function bonnieQ(rows, per, seen){
  var tot = rows * per;
  return { q: "There are <b>" + tot + "</b> dots altogether, in rows of " + per + ". Bonnie has lain down on the bottom rows. How many rows are there?",
    fig: arrayFig(rows, per, rows - seen), boxes: [{ label: "Rows", a: rows }],
    slips: [[seen, "That is just the rows you can see. Bonnie is hiding more: use " + tot + D + per + "."], [r6(tot - per), "That took away one row. Divide to find how many rows of " + per + " make " + tot + "."], [rows * per * per, "That multiplied. Divide instead."]],
    hint: "How many " + per + "s make " + tot + "?", why: tot + D + per + " = <b>" + rows + " rows</b>, because " + mul(rows, per) + ". Bonnie was hiding " + (rows - seen) + " of them.",
    ez: { q: "<b>" + tot + "</b> dots, in rows of " + per + ". Bonnie is lying on some! How many rows?", why: tot + D + per + " = <b>" + rows + " rows</b>.",
      slips: [[seen, "Bonnie is hiding more rows. Try " + tot + D + per + "."], [r6(tot - per), "That took away. Try dividing."], [rows * per * per, "That multiplied. Divide instead."]] } };
}
function machineQ(op, n, out){
  var ans = op === "&#215;" ? r6(out / n) : r6(out * n), back = op === "&#215;" ? fm(out) + " &#247; " + fm(n) : fm(out) + " &#215; " + fm(n);
  return { q: "A number went into the machine and <b>" + fm(out) + "</b> came out. Run it backwards to find what went in: " + (op === "&#215;" ? fm(out) + D + fm(n) : fm(out) + X + fm(n)) + ".",
    fig: machineFig(op, n, out, back), boxes: [{ label: "What went in", a: ans }],
    slips: [[op === "&#215;" ? r6(out * n) : r6(out / n), "That ran the machine forwards again. Backwards means the opposite: " + (op === "&#215;" ? "divide." : "times.")], [r6(out - n), "Taking away does not undo a " + (op === "&#215;" ? "times" : "divide") + "."]],
    hint: "Times and divide undo each other.", why: back.replace("&#247;", "&divide;").replace("&#215;", "&times;") + " = <b>" + fm(ans) + "</b>. Check: " + fm(ans) + " " + (op === "&#215;" ? "&times;" : "&divide;") + " " + fm(n) + " = " + fm(out) + ".",
    ez: { q: "<b>" + fm(out) + "</b> came out. What went in? Try " + (op === "&#215;" ? fm(out) + D + fm(n) : fm(out) + X + fm(n)) + ".",
      why: back.replace("&#247;", "&divide;").replace("&#215;", "&times;") + " = <b>" + fm(ans) + "</b>.",
      slips: [[op === "&#215;" ? r6(out * n) : r6(out / n), "That runs it forwards. Go backwards."], [r6(out - n), "Taking away does not undo it."]] } };
}
function missing(kind, a, b){
  /* kind: "x?" means ? x a = b ; "/?" means ? / a = b ; "?/" means b / ? = a style */
  var q, ans, sl;
  if(kind === "x"){ ans = r6(b / a); q = "? " + X.trim() + " " + fm(a) + " = " + fm(b); sl = [[r6(b * a), "That multiplied. Undo times with divide: " + fm(b) + D + fm(a) + "."], [r6(b - a), "Take away does not undo times. Try " + fm(b) + D + fm(a) + "."]]; }
  else if(kind === "d"){ ans = r6(a * b); q = "? " + D.trim() + " " + fm(a) + " = " + fm(b); sl = [[r6(b / a), "That divided again. Undo divide with times: " + fm(b) + X + fm(a) + "."], [r6(a + b), "Add does not undo divide. Try " + fm(b) + X + fm(a) + "."]]; }
  else { ans = r6(a / b); q = fm(a) + " " + D.trim() + " ? = " + fm(b); sl = [[r6(a * b), "That multiplied. How many lots of " + fm(b) + " make " + fm(a) + "? Divide."], [r6(a - b), "Take away does not help here. " + fm(a) + D + fm(b) + "."]]; }
  return { q: "Find the missing number: <b>" + q + "</b>", boxes: [{ label: "?", a: ans }], slips: sl,
    hint: kind === "x" ? "What times " + fm(a) + " makes " + fm(b) + "?" : kind === "d" ? "What number, shared into " + fm(a) + ", gives " + fm(b) + " each? Times to undo." : fm(a) + " shared into how many lots gives " + fm(b) + "?",
    why: q.replace("?", "<b>" + fm(ans) + "</b>") + ". " + (kind === "x" ? "Undo with " + dv(b, a) : kind === "d" ? "Undo with " + mul(b, a) : dv(a, b)) + ".",
    ez: { hint: kind === "x" ? "What times " + fm(a) + " makes " + fm(b) + "?" : kind === "d" ? "Undo it: " + fm(b) + X + fm(a) + "." : "How many " + fm(b) + "s make " + fm(a) + "?",
      why: q.replace("?", "<b>" + fm(ans) + "</b>") + ".",
      slips: ezs(sl, kind === "x" ? ["That multiplied. Try " + fm(b) + D + fm(a) + ".", "Take away does not undo times."] : kind === "d" ? ["That divided again. Try " + fm(b) + X + fm(a) + ".", "Add does not undo divide."] : ["That multiplied. Divide instead.", "Take away does not help. Try " + fm(a) + D + fm(b) + "."]) } };
}
function mcUndo(n, out, two){
  var opts = [fm(out) + D + fm(n), fm(out) + X + fm(n), fm(out) + " &minus; " + fm(n), fm(n) + D + fm(out)];
  if(two){ opts = ["(" + fm(out) + " &minus; " + two + ")" + D + fm(n), fm(out) + D + fm(n) + " &minus; " + two, "(" + fm(out) + " + " + two + ")" + D + fm(n), fm(out) + X + fm(n) + " &minus; " + two]; }
  return { q: two ? "Jay thinks of a number. He multiplies it by " + fm(n) + ", then adds " + two + ". He gets " + fm(out) + ". Which sum finds his number?" : "Jay thinks of a number and multiplies it by " + fm(n) + ". He gets " + fm(out) + ". Which sum finds his number?",
    options: opts, answer: 0,
    slips: two ? { 1: "Undo the last thing first. He added " + two + " last, so take " + two + " away first, then divide.", 2: "He added " + two + ", so undo it by taking away, not adding.", 3: "That runs it forwards. Go backwards: take away, then divide." } :
      { 1: "That runs it forwards. Backwards means divide.", 2: "Taking away does not undo a times.", 3: "That divides the small number by the big one. Start with " + fm(out) + "." },
    hint: two ? "Undo the steps in reverse order, like taking off socks and shoes." : "What undoes times?",
    why: two ? "Undo the + " + two + " first: " + fm(out) + " &minus; " + two + " = " + fm(out - two) + ". Then undo the " + X.trim() + " " + fm(n) + ": " + fm(out - two) + D + fm(n) + " = <b>" + fm((out - two) / n) + "</b>." : fm(out) + D + fm(n) + " = <b>" + fm(out / n) + "</b>.",
    ez: { q: two ? "Jay's number " + X.trim() + " " + fm(n) + ", then + " + two + ", makes " + fm(out) + ". Which sum finds it?" : "Jay's number " + X.trim() + " " + fm(n) + " = " + fm(out) + ". Which sum finds his number?",
      hint: two ? "Undo the last step first." : "What undoes times?",
      slips: two ? { 1: "Take away the " + two + " first. Then divide.", 2: "He added " + two + ". So take it away.", 3: "That runs it forwards." } :
        { 1: "That runs it forwards. Divide instead.", 2: "Taking away does not undo times.", 3: "Start with the big number, " + fm(out) + "." } } };
}
function twoStep(n, add, out, how){
  var ans = r6((out - add) / n), sl = [[r6(out / n - add), "Undo in reverse order: take away the " + add + " first, then divide."], [r6((out + add) / n), "The " + add + " was added, so undo it by taking away."], [r6(out - add), "That is halfway. Now undo the " + X.trim() + " " + fm(n) + " too."]];
  return { q: "Jay thinks of a number, multiplies by " + fm(n) + ", then adds " + add + ". The answer is " + fm(out) + ". What was his number?",
    fig: pic(520, 120, "Steps: times then add", ['?', '&#215; ' + fm(n), '+ ' + add, fm(out)].map(function(t, k){ var x = 40 + k * 120; return '<rect x="' + x + '" y="30" width="96" height="54" rx="12" fill="' + (k === 0 ? "#ffffff" : k === 3 ? "#ffd23f" : "#c9b8ff") + '" stroke="' + INK + '" stroke-width="2"/>' + T(x + 48, 65, t, 20, { b: 1, a: "middle" }) + (k < 3 ? '<path d="M' + (x + 100) + ' 57h14" stroke="' + INK + '" stroke-width="3"/>' : ""); }).join("") + T(260, 108, how || "Undo from the right: take away, then divide", 13, { b: 1, a: "middle", c: "#b8641c" })),
    boxes: [{ label: "His number", a: ans }], slips: sl,
    hint: "Start at " + fm(out) + " and go backwards.", why: fm(out) + " &minus; " + add + " = " + fm(out - add) + ", then " + dv(out - add, n) + ". His number was <b>" + fm(ans) + "</b>." };
}
function scaleFade(a, b, big, by){
  var p = r6(a * b), ans = r6(big / by);
  return { q: "Start with the fact you know, then use it. <b>" + fm(a) + X + fm(b) + "</b> first, then <b>" + fm(big) + D + fm(by) + "</b>.",
    fig: ladderFig([[fm(a) + SX + fm(b) + " = ?", "the fact"], [fm(big) + SD + fm(by) + " = ?", "same digits"]]),
    boxes: [{ label: fm(a) + X + fm(b) + " =", a: p }, { label: fm(big) + D + fm(by) + " =", a: ans }],
    slips: [[1, r6(ans * 10), "Ten times too big. Check: does your answer " + X.trim() + " " + fm(by) + " make " + fm(big) + "?"], [1, r6(ans / 10), "Ten times too small. Check: does your answer " + X.trim() + " " + fm(by) + " make " + fm(big) + "?"], [0, r6(a + b), "Times, not add."]],
    hint: "Same digits as the fact. Then check the size by multiplying back.",
    why: mul(a, b) + ". So " + fm(big) + D + fm(by) + " = <b>" + fm(ans) + "</b>. Check: " + mul(ans, by) + ".",
    ez: { q: "<b>" + fm(a) + X + fm(b) + "</b> first. Then <b>" + fm(big) + D + fm(by) + "</b>.", hint: "Same digits. Times back to check.",
      why: mul(a, b) + ". So " + fm(big) + D + fm(by) + " = <b>" + fm(ans) + "</b>.",
      slips: [[1, r6(ans * 10), "10 times too big. Times back to check."], [1, r6(ans / 10), "10 times too small. Times back to check."], [0, r6(a + b), "Times, not add."]] } };
}
function scaleQ(a, b, big, by){
  var ans = r6(big / by);
  return { q: "You know " + mul(a, b) + ". Use it to work out <b>" + fm(big) + D + fm(by) + "</b>.",
    boxes: [{ label: fm(big) + D + fm(by) + " =", a: ans }],
    slips: [[r6(ans * 10), "Ten times too big. Multiply back to check: " + fm(ans * 10) + X + fm(by) + " = " + fm(ans * 10 * by) + "."], [r6(ans / 10), "Ten times too small. Multiply back to check: " + fm(ans / 10) + X + fm(by) + " = " + fm(ans / 10 * by) + "."], [r6(ans * 100), "A hundred times too big. Multiply back to check."], [r6(ans / 100), "A hundred times too small. Multiply back to check."]],
    hint: "Which digits will the answer have? Then multiply back to check the size.",
    why: fm(big) + D + fm(by) + " = <b>" + fm(ans) + "</b>, because " + mul(ans, by) + ". Same digits as " + mul(a, b) + ".",
    ez: { q: "You know " + mul(a, b) + ". So what is <b>" + fm(big) + D + fm(by) + "</b>?", hint: "Same digits. Times back to check.",
      why: fm(big) + D + fm(by) + " = <b>" + fm(ans) + "</b>. Check: " + mul(ans, by) + ".",
      slips: [[r6(ans * 10), "10 times too big. Times back to check."], [r6(ans / 10), "10 times too small. Times back to check."], [r6(ans * 100), "100 times too big."], [r6(ans / 100), "100 times too small."]] } };
}
function mcHelp(big, by, a, b, c, d){
  var ans = r6(big / by), opts = [mul(a, b), mul(c, d), fm(by) + " + " + fm(ans) + " = " + fm(by + ans), "Half of " + fm(big) + " is " + fm(big / 2)];
  return { q: "Which fact helps you work out <b>" + fm(big) + D + fm(by) + "</b>?", options: opts, answer: 0,
    slips: { 1: "That fact has different digits. Look for one with the digits of " + fm(big) + " and " + fm(by) + ".", 2: "Adding does not help with a divide. You need a times fact.", 3: "Halving only helps when you divide by 2. You need a times fact with these digits." },
    hint: "Look for a times fact that uses the same digits.", why: "<b>" + opts[0] + "</b> has the right digits. " + fm(big) + D + fm(by) + " = " + fm(ans) + ".",
    ez: { q: "Which fact helps with <b>" + fm(big) + D + fm(by) + "</b>?", hint: "Find the same digits.", why: "<b>" + opts[0] + "</b> has the right digits.",
      slips: { 1: "Different digits. Look again.", 2: "Adding does not help here.", 3: "Halving only helps with " + D.trim() + " 2." } } };
}
function matchScale(pairs){ return { q: "Match each divide to its answer. They all come from one family.", pairs: pairs,
  hint: "Find the fact first, then check the size of each answer by multiplying back.", why: "Same digits every time. Multiplying back checks each answer is the right size.",
  ez: { q: "Match each divide to its answer.", hint: "Find the fact. Then check the size.", why: "Same digits every time." } }; }
function shareQ(n, g, money){
  var ans = r6(n / g);
  return { q: money ? "[[Who]] shares &pound;" + mo(n) + " equally between " + g + " [[people]]. How much does each get?" : "[[Who]] shares " + fm(n) + " [[things]] equally between " + g + " [[groups]]. How many in each?",
    boxes: [{ label: "Each", a: ans, pre: money ? "&pound;" : "", show: money ? mo(ans) : fm(ans) }],
    slips: [[r6(n * g), "That multiplied. Sharing is dividing."], [r6(n - g), "That took away. Sharing equally is dividing: " + fm(n) + D + g + "."], [r6(ans * 10), "Ten times too big. Check: " + fm(ans * 10) + X + g + " is too much."], [r6(ans / 10), "Ten times too small. Multiply back to check."]],
    hint: "Which times fact has " + g + " and " + fm(n) + " in it?", why: fm(n) + D + g + " = <b>" + (money ? "&pound;" + mo(ans) : fm(ans)) + "</b> each, because " + mul(ans, g) + ".",
    ez: { q: money ? "&pound;" + mo(n) + " shared between " + g + " [[people]]. How much each?" : fm(n) + " [[things]] shared between " + g + " [[groups]]. How many in each?",
      why: fm(n) + D + g + " = <b>" + (money ? "&pound;" + mo(ans) : fm(ans)) + "</b> each.",
      slips: [[r6(n * g), "That multiplied. Sharing is dividing."], [r6(n - g), "That took away. Try " + fm(n) + D + g + "."], [r6(ans * 10), "10 times too big."], [r6(ans / 10), "10 times too small."]] } };
}
function leftQ(n, size){
  var full = Math.floor(n / size), left = n - full * size;
  return { q: "[[Who]] packs " + n + " [[things]] into [[groups]], " + size + " in each. How many full [[groups]], and how many [[things]] are left over?",
    fig: n <= 30 ? shareFig(n, size, false, true) : "", boxes: [{ label: "Full [[groups]]", a: full }, { label: "Left over", a: left }],
    slips: [[0, full + 1, "That would need " + (full + 1) * size + ". There are only " + n + "."], [1, size - left, "That is how many more you would need for another one. Left over is what remains: " + n + " &minus; " + (full * size) + "."], [0, r6(n / size), "Whole [[groups]] only. The bit after the point is the leftovers."]],
    hint: "Biggest times fact for " + size + " that fits under " + n + ".", why: mul(full, size) + ", and " + n + " &minus; " + (full * size) + " = " + left + ". So <b>" + full + "</b> full and <b>" + left + "</b> left over.",
    ez: { q: "Pack " + n + " [[things]], " + size + " in each. How many full? How many left over?", hint: "Which " + size + "s fact fits under " + n + "?",
      why: mul(full, size) + ". <b>" + full + "</b> full, <b>" + left + "</b> left over.",
      slips: [[0, full + 1, "That needs " + (full + 1) * size + ". There are only " + n + "."], [1, size - left, "Left over is what is left: " + n + " &minus; " + (full * size) + "."], [0, r6(n / size), "Whole ones only."]] } };
}
function mcRem(n, size, up, ctx, ezctx){
  var full = Math.floor(n / size), left = n % size, ans = up ? full + 1 : full, opts = [String(ans), String(up ? full : full + 1), fa(n / size), full + " remainder " + left];
  return { q: ctx, options: opts, answer: 0,
    slips: up ? { 1: "Then " + left + " would be left behind. You need one more for them.", 2: "You cannot have part of one. Decide: round up or down?", 3: "That is the sum, but the answer needs a whole number. The leftovers still need somewhere to go." } :
      { 1: "That one would not be full. Only count the complete ones.", 2: "You cannot have part of one. Only whole ones count.", 3: "That is the sum, but the question wants whole ones only." },
    hint: up ? "Does everyone (or everything) need a place?" : "Only complete ones count.",
    why: n + D + size + " = " + full + " remainder " + left + ". " + (up ? "The " + left + " left over still need one, so round <b>up</b> to <b>" + ans + "</b>." : "The " + left + " left over cannot make a full one, so round <b>down</b> to <b>" + ans + "</b>."),
    ez: { q: ezctx || ctx, hint: up ? "Does everyone need a place?" : "Only full ones count.",
      why: n + D + size + " = " + full + " remainder " + left + ". " + (up ? "Round <b>up</b> to <b>" + ans + "</b>." : "Round <b>down</b> to <b>" + ans + "</b>."),
      slips: up ? { 1: "Then " + left + " would be left behind.", 2: "You need a whole number.", 3: "True, but the leftovers need a place too." } :
        { 1: "That one would not be full.", 2: "Only whole ones count.", 3: "True, but only count full ones." } } };
}
function packsQ(need, per, price, what){
  var pk = Math.ceil(need / per - 1e-9), c = r6(pk * price);
  return { q: what + " come in packs of " + per + " at &pound;" + mo(price) + " a pack. Jay needs " + need + ". How many packs, and what is the cost?",
    boxes: [{ label: "Packs", a: pk }, { label: "Cost", a: c, pre: "&pound;", show: mo(c) }],
    slips: [[0, Math.floor(need / per), "That leaves Jay a few short. Round up."], [0, r6(need / per), "Shops only sell whole packs."], [1, r6(need * price), "That priced every single one. The price is for a pack."], [1, r6(need / per * price), "Price the whole packs (" + pk + ")."]],
    hint: need + D + per + ", round up, then times the price.",
    why: need + D + per + " = " + fa(need / per) + ", so <b>" + pk + " packs</b>. " + pk + X + "&pound;" + mo(price) + " = <b>&pound;" + mo(c) + "</b>.",
    ez: { q: what + ": packs of " + per + ", &pound;" + mo(price) + " a pack. Jay needs " + need + ". How many packs? What is the cost?", hint: need + D + per + ". Round up. Then times the price.",
      why: "<b>" + pk + " packs</b>. " + pk + X + "&pound;" + mo(price) + " = <b>&pound;" + mo(c) + "</b>.",
      slips: [[0, Math.floor(need / per), "A few short. Round up."], [0, r6(need / per), "Shops sell whole packs."], [1, r6(need * price), "That prices each one. The price is for a pack."], [1, r6(need / per * price), "Price " + pk + " whole packs."]] } };
}

(window.A2PACKS = window.A2PACKS || {})["core-fact-families"] = {
  a2: true,
  id: "a2-core-fact-families",
  title: "Fact families",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 20,
  line: "One times fact, a whole family of facts: times, divide, and the bigger ones too.",
  blurb: "How times and divide facts belong together. Four short chunks: family triangles, undoing a sum, using one fact to get bigger ones, and fair shares with leftovers. You make a family poster at the end. New numbers every time you come back.",
  note: "Times facts and their divide partners. Four five minute chunks and a family poster to make. The numbers change each go, so come back whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Sprouts", line: "Sprouts: the 2, 3, 4, 5 and 10 times tables, and small shares." },
    { id: "medium", name: "Family tree", line: "Family tree: tables up to 12, missing numbers, tens and hundreds, and leftovers." },
    { id: "spicy", name: "Dynasty", line: "Dynasty: decimals and big numbers from one fact, two step undoing, and tricky remainders." }
  ],
  themes: {
    time: { name: "Time travel", w: { who: "The time agent", things: "energy crystals", groups: "time pods", people: "time agents", rides: "time pods" } },
    football: { name: "Football", w: { who: "The coach", things: "training bibs", groups: "teams", people: "players", rides: "minibuses" } },
    horror: { name: "Horror", w: { who: "The ghost hunter", things: "candles", groups: "haunted rooms", people: "ghost hunters", rides: "ghost train carriages" } },
    fishing: { name: "Fishing", w: { who: "The angler", things: "hooks", groups: "tackle boxes", people: "anglers", rides: "boats" } },
    music: { name: "Music", w: { who: "The band", things: "plectrums", groups: "gig bags", people: "fans", rides: "tour buses" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: triFig(6, 7, "", "6 &#215; 7 = 42, 7 &#215; 6 = 42, 42 &#247; 6 = 7, 42 &#247; 7 = 6", true),
  steps: [

    /* ---------- chunk 1: family triangles ---------- */
    { type: "learn", topic: "Family triangles", title: "Three numbers, four facts",
      fig: triFig(6, 7, "", "6 &#215; 7 = 42, 7 &#215; 6 = 42, 42 &#247; 6 = 7, 42 &#247; 7 = 6", true),
      html: "<p>A <b>fact family</b> is three numbers that belong together. Here: 6, 7 and 42.</p>" +
        "<p>The big number goes at the top. Multiply the two bottom numbers to get the top: 6 &times; 7 = 42 (and 7 &times; 6 = 42).</p>" +
        "<p>Cover a bottom number and divide: 42 &divide; 6 = 7 and 42 &divide; 7 = 6. <b>Know one fact, and you know all four.</b></p>",
      lv: { mild: { fig: triFig(5, 3, "", "5 &#215; 3 = 15, 3 &#215; 5 = 15, 15 &#247; 5 = 3, 15 &#247; 3 = 5", true),
          html: "<p>A <b>fact family</b> is three numbers that belong together: 5, 3 and 15.</p><p>Multiply the bottom two to get the top: 5 &times; 3 = 15. Cover one at the bottom and divide: 15 &divide; 5 = 3, 15 &divide; 3 = 5.</p>" },
        spicy: { fig: triFig(0.6, 7, "", "0.6 &#215; 7 = 4.2, 4.2 &#247; 7 = 0.6, 4.2 &#247; 0.6 = 7", true),
          html: "<p>Fact families work for any numbers, decimals included. 0.6, 7 and 4.2 are a family, because 0.6 &times; 7 = 4.2.</p>" +
            "<p>So 4.2 &divide; 7 = 0.6 and 4.2 &divide; 0.6 = 7, straight away, from one times fact you already know (6 &times; 7 = 42).</p>" } } ,
      ez: { title: "Three numbers, four facts", html: "<p>5, 3 and 15 are a <b>fact family</b>.</p><p>5 &times; 3 = 15. 15 &divide; 5 = 3. 15 &divide; 3 = 5.</p>" } },

    G("num", "Family triangles", [
      [triQ(8, 7, "b"), triQ(5, 4, "p"), triQ(0.8, 7, "b")],
      [triQ(9, 6, "p"), triQ(2, 9, "b"), triQ(60, 9, "p")],
      [triQ(12, 4, "a"), triQ(10, 6, "a"), triQ(1.2, 5, "a")]
    ]),

    G("num", "Family triangles", [
      [fam4(7, 6), fam4(5, 3), fam4(9, 0.6)],
      [fam4(8, 9), fam4(2, 7), fam4(80, 7)],
      [fam4(11, 4), fam4(10, 4), fam4(1.1, 8)]
    ]),

    G("mc", "Family triangles", [
      [oddOut(6, 9), oddOut(4, 5), oddOut(0.7, 8)],
      [oddOut(7, 12), oddOut(3, 10), oddOut(90, 4)],
      [oddOut(8, 4), oddOut(2, 6), oddOut(1.5, 6)]
    ]),

    G("num", "Family triangles", [
      [bonnieQ(6, 7, 2), bonnieQ(4, 5, 2), bonnieQ(9, 8, 2)],
      [bonnieQ(8, 6, 3), bonnieQ(3, 10, 1), bonnieQ(7, 12, 2)],
      [bonnieQ(9, 4, 2), bonnieQ(5, 2, 2), bonnieQ(12, 6, 3)]
    ]),

    /* ---------- chunk 2: undo it ---------- */
    { type: "learn", topic: "Undo it", title: "Times and divide undo each other",
      fig: machineFig("&#215;", 6, 54, "54 &#247; 6 = 9"),
      html: "<p>Times and divide are <b>opposites</b>: each one undoes the other.</p>" +
        "<p>If a number went into a &times; 6 machine and 54 came out, run it backwards with &divide; 6: 54 &divide; 6 = <b>9</b> went in.</p>" +
        "<p>Missing numbers work the same way. ? &times; 6 = 54? Undo with 54 &divide; 6. And ? &divide; 6 = 9? Undo with 9 &times; 6 = 54.</p>",
      lv: { mild: { fig: machineFig("&#215;", 5, 35, "35 &#247; 5 = 7"),
        html: "<p>Times and divide <b>undo</b> each other.</p><p>A number went into a &times; 5 machine and 35 came out. Run it backwards: 35 &divide; 5 = <b>7</b> went in.</p>" } } ,
      ez: { html: "<p>Times and divide <b>undo</b> each other.</p><p>&times; 5 gave 35? Then 35 &divide; 5 = 7 went in.</p>" } },

    G("num", "Undo it", [
      [machineQ("&#215;", 8, 72), machineQ("&#215;", 2, 16), machineQ("&#215;", 0.4, 2.8)],
      [machineQ("&#247;", 6, 7), machineQ("&#215;", 10, 70), machineQ("&#247;", 0.5, 18)],
      [machineQ("&#215;", 12, 84), machineQ("&#247;", 4, 3), machineQ("&#215;", 30, 210)]
    ]),

    G("num", "Undo it", [
      [missing("x", 7, 63), missing("x", 5, 30), missing("x", 0.9, 6.3)],
      [missing("d", 8, 7), missing("d", 2, 9), missing("d", 0.3, 40)],
      [missing("q", 96, 8), missing("q", 40, 4), missing("q", 4.8, 6)]
    ]),

    G("mc", "Undo it", [
      [mcUndo(7, 63), mcUndo(5, 40), mcUndo(4, 31, 3)],
      [mcUndo(9, 81), mcUndo(3, 27), mcUndo(6, 50, 2)],
      [mcUndo(11, 132), mcUndo(10, 60), mcUndo(8, 61, 5)]
    ]),

    G("num", "Undo it", [
      [twoStep(4, 3, 31), machineQ("&#215;", 4, 36), twoStep(0.5, 6, 10, "Undo from the right: take away, then divide by 0.5")],
      [twoStep(6, 5, 53), machineQ("&#215;", 3, 24), twoStep(12, 9, 153)],
      [twoStep(9, 2, 83), machineQ("&#215;", 5, 45), twoStep(1.5, 4, 22)]
    ]),

    /* ---------- chunk 3: bigger facts ---------- */
    { type: "learn", topic: "Bigger facts", title: "One fact, many sizes",
      fig: ladderFig([["6 &#215; 8 = 48", "the fact"], ["60 &#215; 8 = 480", "&#215; 10"], ["480 &#247; 8 = 60", "same family"], ["4800 &#247; 8 = 600", "&#215; 100"]]),
      html: "<p>A times fact you know unlocks bigger ones. 6 &times; 8 = 48, so 60 &times; 8 = 480, and in the same family, 480 &divide; 8 = 60.</p>" +
        "<p>The <b>digits stay the same</b>; only the size changes. To be sure of the size, <b>multiply back</b>: 60 &times; 8 = 480, yes.</p>",
      lv: {
        mild: { fig: ladderFig([["3 &#215; 5 = 15", "the fact"], ["30 &#215; 5 = 150", "&#215; 10"], ["150 &#247; 5 = 30", "same family"]]),
          html: "<p>A fact you know helps with bigger numbers. 3 &times; 5 = 15, so 30 &times; 5 = 150 (ten times bigger).</p><p>And in the same family: 150 &divide; 5 = 30.</p>" },
        spicy: { fig: ladderFig([["6 &#215; 8 = 48", "the fact"], ["4.8 &#247; 8 = 0.6", "&#247; 10"], ["4.8 &#247; 0.6 = 8", "same family"], ["0.48 &#247; 6 = 0.08", "&#247; 100"]]),
          html: "<p>The same family works smaller too. 6 &times; 8 = 48, so 0.6 &times; 8 = 4.8, which means 4.8 &divide; 8 = <b>0.6</b> and 4.8 &divide; 0.6 = <b>8</b>.</p>" +
            "<p>Keep the digits and check the size by multiplying back: 0.08 &times; 6 = 0.48, so 0.48 &divide; 6 = <b>0.08</b>.</p>" } } ,
      ez: { html: "<p>3 &times; 5 = 15. So 30 &times; 5 = 150.</p><p>Same <b>digits</b>. 10 times bigger.</p>" } },

    G("num", "Bigger facts", [
      [scaleFade(9, 4, 360, 4), scaleFade(5, 3, 150, 3), scaleFade(7, 6, 4.2, 6)],
      [scaleFade(8, 6, 480, 6), scaleFade(4, 2, 80, 2), scaleFade(9, 3, 2.7, 0.3)],
      [scaleFade(7, 5, 3500, 5), scaleFade(10, 3, 300, 3), scaleFade(4, 8, 0.32, 8)]
    ]),

    G("num", "Bigger facts", [
      [scaleQ(8, 7, 5600, 7), scaleQ(2, 8, 160, 8), scaleQ(8, 7, 5.6, 0.7)],
      [scaleQ(6, 9, 540, 6), scaleQ(5, 4, 200, 4), scaleQ(6, 9, 0.54, 9)],
      [scaleQ(12, 3, 3600, 3), scaleQ(3, 3, 90, 3), scaleQ(12, 3, 3.6, 0.03)]
    ], { explain: true }),

    G("mc", "Bigger facts", [
      [mcHelp(270, 9, 3, 9, 2, 7), mcHelp(40, 5, 8, 5, 4, 4), mcHelp(0.48, 6, 8, 6, 9, 5)],
      [mcHelp(630, 7, 9, 7, 6, 8), mcHelp(60, 10, 6, 10, 5, 5), mcHelp(5.6, 0.8, 7, 8, 6, 4)],
      [mcHelp(4800, 12, 4, 12, 7, 9), mcHelp(18, 3, 6, 3, 4, 2), mcHelp(0.72, 0.9, 8, 9, 6, 7)]
    ]),

    G("match", "Bigger facts", [
      [matchScale([["420 &divide; 6", "70"], ["42 &divide; 6", "7"], ["4200 &divide; 6", "700"], ["420 &divide; 7", "60"]]),
       matchScale([["20 &divide; 5", "4"], ["200 &divide; 5", "40"], ["20 &divide; 4", "5"]]),
       matchScale([["4.2 &divide; 6", "0.7"], ["420 &divide; 6", "70"], ["0.42 &divide; 7", "0.06"], ["4.2 &divide; 0.6", "7"], ["4200 &divide; 0.6", "7000"]])],
      [matchScale([["720 &divide; 8", "90"], ["72 &divide; 8", "9"], ["7200 &divide; 8", "900"], ["720 &divide; 9", "80"]]),
       matchScale([["30 &divide; 3", "10"], ["300 &divide; 3", "100"], ["30 &divide; 10", "3"]]),
       matchScale([["7.2 &divide; 8", "0.9"], ["720 &divide; 9", "80"], ["0.72 &divide; 9", "0.08"], ["7.2 &divide; 0.8", "9"], ["7200 &divide; 0.9", "8000"]])],
      [matchScale([["350 &divide; 5", "70"], ["35 &divide; 5", "7"], ["3500 &divide; 5", "700"], ["350 &divide; 7", "50"]]),
       matchScale([["12 &divide; 2", "6"], ["120 &divide; 2", "60"], ["12 &divide; 6", "2"]]),
       matchScale([["3.5 &divide; 5", "0.7"], ["350 &divide; 7", "50"], ["0.35 &divide; 7", "0.05"], ["3.5 &divide; 0.5", "7"], ["3500 &divide; 0.7", "5000"]])]
    ]),

    /* ---------- chunk 4: fair shares ---------- */
    { type: "learn", topic: "Fair shares", title: "Sharing out, and what is left over",
      fig: shareFig(23, 4, true),
      html: "<p>Real sharing does not always come out exactly. 23 shared into groups of 4: 4 &times; 5 = 20, so <b>5 groups and 3 left over</b>.</p>" +
        "<p>Then the question decides what to do with the leftovers. Need a place for everyone, like seats? <b>Round up</b>: 6 cars. Only counting full groups, like full teams? <b>Round down</b>: 5.</p>" ,
      ez: { title: "Sharing out", html: "<p>23 in 4s: 5 groups and <b>3 left over</b>.</p><p>A seat for everyone? Round <b>up</b>. Full groups only? Round <b>down</b>.</p>" } },

    G("num", "Fair shares", [
      [shareQ(72, 8), shareQ(20, 5), shareQ(132, 12)],
      [shareQ(56, 7), shareQ(18, 3), shareQ(9.6, 12, true)],
      [shareQ(108, 9), shareQ(40, 10), shareQ(8.4, 7, true)]
    ]),

    G("num", "Fair shares", [
      [leftQ(50, 6), leftQ(17, 5), leftQ(100, 7)],
      [leftQ(39, 8), leftQ(11, 2), leftQ(150, 11)],
      [leftQ(47, 9), leftQ(22, 4), leftQ(200, 12)]
    ]),

    G("mc", "Fair shares", [
      [mcRem(60, 8, true, "60 [[people]] are going on a trip. Each of the [[rides]] holds 8. How many [[rides]] are needed?"),
       mcRem(22, 5, true, "22 [[people]] are going on a trip. Each of the [[rides]] holds 5. How many [[rides]] are needed?", "22 [[people]]. Each of the [[rides]] holds 5. How many [[rides]]?"),
       mcRem(50, 11, false, "50 [[people]] turn up. How many full teams of 11 can they make?")],
      [mcRem(45, 6, false, "45 [[things]] are packed into [[groups]] of 6. How many <b>full</b> [[groups]] are there?"),
       mcRem(13, 2, true, "13 [[people]] need a partner seat, 2 to a bench. How many benches are needed?", "13 [[people]]. 2 fit on a bench. How many benches?"),
       mcRem(100, 12, true, "100 [[people]] are going on a trip. Each of the [[rides]] holds 12. How many [[rides]] are needed?")],
      [mcRem(75, 9, true, "75 [[people]] are going on a trip. Each of the [[rides]] holds 9. How many [[rides]] are needed?"),
       mcRem(19, 5, false, "19 [[things]] are packed into [[groups]] of 5. How many <b>full</b> [[groups]] are there?", "19 [[things]], 5 in each. How many <b>full</b> [[groups]]?"),
       mcRem(250, 30, false, "A coach has &pound;250 to spend on footballs at &pound;30 each. How many can be bought?")]
    ]),

    G("num", "Fair shares", [
      [packsQ(40, 6, 1.5, "Eggs for a Base 5 breakfast"), packsQ(12, 4, 2, "Bread rolls"), packsQ(70, 12, 3.6, "Fat balls for Jay's bird feeders")],
      [packsQ(50, 8, 2.25, "Pencils for a quiz"), packsQ(15, 5, 3, "Balloons"), packsQ(110, 16, 4.75, "Bird seed bars for Jay's feeders")],
      [packsQ(30, 4, 1.8, "Glue sticks"), packsQ(18, 10, 1, "Stickers"), packsQ(150, 24, 6.4, "Mealworm pots for Jay's robins")]
    ], { explain: true })
  ],

  realWorld: {
    title: "Times tables are older than you think",
    html: "<p>People have been writing times tables down for about 4000 years. In ancient Babylon (in what is now Iraq), students pressed multiplication tables into wet clay tablets, and some of those tablets survive in museums today.</p>" +
      "<p>For our big question: if you time travelled to a Babylonian classroom, you would recognise the work. Fact families are one of the oldest bits of maths there is, and you still use them every time you split a bill or check a calculator.</p>",
    fig: pic(420, 150, "Jay at a time portal holding a clay tablet", A.portal(80, 75, 56) + A.jay(250, 50, 0.85, "wow") +
      '<g transform="translate(160 92) rotate(-6)"><rect width="56" height="46" rx="8" fill="#c9a27a" stroke="' + INK + '" stroke-width="2"/><path d="M10 12h10M28 12h6M10 24h14M30 24h12M10 36h8M24 36h16" stroke="#7a5532" stroke-width="3"/></g>' +
      A.bubble(296, 8, 118, 52, "4000 years\nold. Wow.", 300))
  },

  ez: {
    realWorld: { html: "<p>Times tables are 4000 years old!</p><p>Students in Babylon wrote them on clay.</p>" },
    make: { intro: "Pick 2 numbers. See their whole family." }
  },

  make: {
    title: "Make a family poster",
    intro: "Pick any two numbers. The poster works out the family and shows all four facts. Save it, stick it up, or send it to Jay.",
    fields: [
      { id: "a", label: "First number", ph: "7", max: 6 },
      { id: "b", label: "Second number", ph: "8", max: 6 },
      { id: "name", label: "Family name", ph: "The Fifty Sixes", max: 24 },
      { id: "motto", label: "Family motto", ph: "We always come in fours", max: 34 }
    ],
    svg: function(v){
      function num(x, d){ var n = parseFloat(x); return isFinite(n) && n > 0 && n < 100000 ? n : d; }
      var a = num(v.a, 7), b = num(v.b, 8), p = r6(a * b);
      var facts = [fm(a) + SX + fm(b) + " = " + fm(p), fm(b) + SX + fm(a) + " = " + fm(p), fm(p) + SD + fm(a) + " = " + fm(b), fm(p) + SD + fm(b) + " = " + fm(a)];
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#f3ecff"/>' +
        fit(300, 54, v.name, 28, 520, { b: 1, a: "middle", c: "#141a33" }) +
        tri(160, 210, a, b, "", "#ffd23f", 1.1) +
        facts.map(function(f, k){ return fit(320, 160 + k * 40, f, 20, 250, { b: 1, c: "#141a33", raw: 1 }); }).join("") +
        fit(300, 360, String(v.motto || ""), 17, 520, { a: "middle", c: "#5b3fa6" }) +
        A.bird(548, 90, 0.7, "#19c39a") +
        '</svg>';
    }
  }
};
})();
