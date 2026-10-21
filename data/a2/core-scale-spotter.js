/* Base 5 core activity: Scale spotter.
   Maths. Reading scales with a pointer: rulers, luggage scales, jugs,
   thermometers, kitchen scales, speedometers and fuel gauges.
   Mild reads to the nearest labelled mark; medium and spicy read the
   marks between labels, then estimate between marks.
   Replayable: most questions have two extra versions. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function r6(x){ return Math.round(x * 1e6) / 1e6; }
function fmt(n){ return String(r6(n)); }
function ups(n){ return fmt(n) + (n === Math.round(n) ? "s" : ""); }
var DEG = "&deg;C", RED = "#e04848";

function lvl(v){
  if(!v.mild) return v;
  var o = {};
  Object.keys(v.mild).forEach(function(k){ o[k] = v.mild[k]; });
  o.lv = { medium: v.medium || v.mild, spicy: v.spicy || v.mild };
  return o;
}
function S(type, topic, vs, extra){
  var s = lvl(vs[0]);
  s.type = type; s.topic = topic;
  Object.keys(extra || {}).forEach(function(k){ s[k] = extra[k]; });
  if(vs.length > 1) s.vary = vs.slice(1).map(lvl);
  return s;
}

/* ---------- scale maths ---------- */
/* o: {lo, hi, lab (labels go up in), sub (gaps between labels), v (reading)} */
function info(o){
  var sub = o.sub || 1, per = r6(o.lab / sub);
  var lb = r6(o.lo + Math.floor(r6((o.v - o.lo) / o.lab)) * o.lab);
  var la = r6(lb + o.lab);
  var k = Math.round(r6((o.v - lb) / per));
  var m1 = r6(o.lo + Math.floor(r6((o.v - o.lo) / per)) * per), m2 = r6(m1 + per);
  var near = (o.v - lb) <= o.lab / 2 ? lb : la;
  return { sub: sub, per: per, lb: lb, la: la, k: k, m1: m1, m2: m2, near: near, mid: r6(lb + o.lab / 2) };
}
function ticks(o){
  var sub = o.sub || 1, per = o.lab / sub, n = Math.round((o.hi - o.lo) / per), out = [];
  for(var i = 0; i <= n; i++) out.push({ v: r6(o.lo + i * per), kind: i % sub === 0 ? "lab" : (sub % 2 === 0 && i % sub === sub / 2 ? "mid" : "min") });
  return out;
}

/* ---------- pictures ---------- */
/* a straight scale: ruler, tape or luggage scale. o.bar draws the [[thing]] instead of a pointer */
function hs(o){
  var x0 = 40, x1 = 470;
  function X(v){ return x0 + (v - o.lo) / (o.hi - o.lo) * (x1 - x0); }
  var tk = ticks(o), nl = tk.filter(function(t){ return t.kind === "lab"; }).length;
  var s = '<svg viewBox="0 0 520 160" role="img" aria-label="A straight scale with a pointer">' +
    '<rect width="520" height="160" rx="14" fill="#f4f1ea"/>' +
    '<rect x="18" y="72" width="484" height="64" rx="6" fill="' + (o.bar ? "#ffe58a" : "#ffffff") + '" stroke="#141a33" stroke-width="2"/>';
  tk.forEach(function(t){
    var len = t.kind === "lab" ? 24 : t.kind === "mid" ? 17 : (o.sub >= 10 ? 8 : 12);
    s += '<path d="M' + X(t.v) + ' 72v' + len + '" stroke="#141a33" stroke-width="' + (t.kind === "lab" ? 2 : 1.2) + '"/>';
    if(t.kind === "lab") s += T(X(t.v), 114, fmt(t.v), nl > 12 ? 12 : 14, { a: "middle", b: 1 });
  });
  s += T(498, 130, o.unit || "", 12, { a: "end", c: "#5b6180" });
  if(o.half){
    var I = info(o), hx = X(I.mid);
    s += '<path d="M' + hx + ' 30v42" stroke="#8a5cf6" stroke-width="2.5" stroke-dasharray="4 3"/>' + T(hx - 6, 40, "halfway", 12, { a: "end", c: "#8a5cf6", b: 1 });
  }
  if(o.bar){
    var bx = X(o.v);
    s += '<rect x="' + X(o.lo) + '" y="40" width="' + (bx - X(o.lo)) + '" height="24" rx="10" fill="#3a8fd6" stroke="#141a33" stroke-width="2"/>' +
      T((X(o.lo) + bx) / 2, 57, "[[Thing]]", 13, { a: "middle", b: 1, c: "#ffffff" }) +
      '<path d="M' + bx + ' 30v42" stroke="' + RED + '" stroke-width="2" stroke-dasharray="4 3"/>';
  } else if(!o.hide){
    var px = X(o.v);
    s += '<rect x="' + (px - 3) + '" y="20" width="6" height="34" fill="' + RED + '"/><path d="M' + px + ' 71l-10 -18h20z" fill="' + RED + '"/>';
  }
  return s + (o.egg || "") + '</svg>';
}

/* a thermometer as a group */
function thermG(cx, o, name){
  var top = 40, bot = 220;
  function Y(v){ return bot - (v - o.lo) / (o.hi - o.lo) * (bot - top); }
  var s = '<rect x="' + (cx - 11) + '" y="' + (top - 16) + '" width="22" height="' + (bot - top + 36) + '" rx="11" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
    '<rect x="' + (cx - 5) + '" y="' + Y(o.v) + '" width="10" height="' + (bot + 24 - Y(o.v)) + '" fill="' + RED + '"/>' +
    '<circle cx="' + cx + '" cy="' + (bot + 30) + '" r="20" fill="' + RED + '" stroke="#141a33" stroke-width="2.5"/>';
  ticks(o).forEach(function(t){
    var len = t.kind === "lab" ? 18 : t.kind === "mid" ? 13 : 8;
    s += '<path d="M' + (cx + 12) + ' ' + Y(t.v) + 'h' + len + '" stroke="#141a33" stroke-width="' + (t.kind === "lab" ? 2 : 1.2) + '"/>';
    if(t.kind === "lab") s += T(cx + 36, Y(t.v) + 5, fmt(t.v), 13, { b: 1 });
  });
  s += T(cx + 36, top - 20, DEG, 12, { c: "#5b6180" });
  if(name) s += T(cx, 290, name, 14, { a: "middle", b: 1 });
  return s;
}
function therm(o){
  return '<svg viewBox="0 0 520 300" style="max-height:300px" role="img" aria-label="A thermometer">' +
    '<rect width="520" height="300" rx="14" fill="#e8f7ff"/>' + thermG(170, o) +
    T(330, 120, "[[Place]]", 16, { a: "middle", b: 1 }) + A.bird(330, 170, 0.9, "#ffd23f") + '</svg>';
}
function therm2(o1, o2, n1, n2){
  return '<svg viewBox="0 0 520 300" style="max-height:300px" role="img" aria-label="Two thermometers">' +
    '<rect width="520" height="300" rx="14" fill="#e8f7ff"/>' + thermG(140, o1, n1) + thermG(360, o2, n2) + '</svg>';
}

/* a measuring jug as a group: top left at x, y */
function jugG(x, y, o, name){
  var bot = y + 230, top = y + 34;
  function Y(v){ return bot - (v - o.lo) / (o.hi - o.lo) * (bot - top); }
  var s = '<path d="M' + (x + 150) + ' ' + (y + 50) + 'q44 0 44 54q0 54 -44 54" fill="none" stroke="#141a33" stroke-width="8" stroke-opacity=".7"/>' +
    '<rect x="' + (x + 3) + '" y="' + Y(o.v) + '" width="144" height="' + (bot - Y(o.v)) + '" fill="[[liq]]" fill-opacity=".55"/>' +
    '<path d="M' + (x - 10) + ' ' + (y + 4) + 'L' + x + ' ' + (y + 14) + 'V' + (bot - 8) + 'q0 8 8 8h134q8 0 8 -8V' + (y + 10) + '" fill="none" stroke="#141a33" stroke-width="3" stroke-linejoin="round"/>';
  ticks(o).forEach(function(t){
    var len = t.kind === "lab" ? 22 : t.kind === "mid" ? 15 : 9;
    s += '<path d="M' + x + ' ' + Y(t.v) + 'h' + len + '" stroke="#141a33" stroke-width="' + (t.kind === "lab" ? 2.2 : 1.3) + '"/>';
    if(t.kind === "lab" && t.v !== o.lo) s += T(x + 28, Y(t.v) + 5, fmt(t.v), 13, { b: 1 });
  });
  s += T(x + 142, y + 30, o.unit || "ml", 12, { a: "end", c: "#5b6180" });
  if(name) s += T(x + 75, bot + 30, name, 14, { a: "middle", b: 1 });
  return s;
}
function jug(o){
  return '<svg viewBox="0 0 520 290" style="max-height:300px" role="img" aria-label="A measuring jug">' +
    '<rect width="520" height="290" rx="14" fill="#f4f1ea"/>' + jugG(150, 20, o) + '</svg>';
}
function jug2(o1, o2){
  return '<svg viewBox="0 0 520 300" style="max-height:300px" role="img" aria-label="Two measuring jugs, A and B, with different scales">' +
    '<rect width="520" height="300" rx="14" fill="#f4f1ea"/>' + jugG(40, 14, o1, "Jug A") + jugG(300, 14, o2, "Jug B") + '</svg>';
}

/* a round dial as a group (kitchen scales, speedometer): 270 degrees */
function dialG(cx, cy, r, o, name){
  function P(v, rr){ var a = (-135 + (v - o.lo) / (o.hi - o.lo) * 270) * Math.PI / 180; return [r6(cx + rr * Math.sin(a)), r6(cy - rr * Math.cos(a))]; }
  var tk = ticks(o), nl = tk.filter(function(t){ return t.kind === "lab"; }).length, fs = r < 100 || nl > 8 ? 11 : 13, labs = "";
  var n = P(o.v, r - 6);
  var s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 8) + '" fill="#141a33"/><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#ffffff"/>' +
    T(cx, cy + r * 0.5, o.unit || "", 13, { a: "middle", c: "#5b6180", b: 1 }) +
    '<path d="M' + cx + ' ' + cy + 'L' + n[0] + ' ' + n[1] + '" stroke="' + RED + '" stroke-width="3.5" stroke-linecap="round"/>';
  tk.forEach(function(t){
    var len = t.kind === "lab" ? 16 : t.kind === "mid" ? 11 : 7, a = P(t.v, r - 3), b = P(t.v, r - 3 - len);
    s += '<path d="M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1] + '" stroke="#141a33" stroke-width="' + (t.kind === "lab" ? 2.2 : 1.2) + '"/>';
    if(t.kind === "lab"){ var q = P(t.v, r - 34); labs += '<text x="' + q[0] + '" y="' + (q[1] + 5) + '" ' + F + ' font-size="' + fs + '" font-weight="700" text-anchor="middle" fill="#141a33" stroke="#ffffff" stroke-width="4" paint-order="stroke">' + fmt(t.v) + '</text>'; }
  });
  s += labs + '<circle cx="' + cx + '" cy="' + cy + '" r="7" fill="#141a33"/>';
  if(name) s += T(cx, cy - r - 16, name, 14, { a: "middle", b: 1 });
  return s;
}
function dial(o, extra){
  return '<svg viewBox="0 0 520 290" style="max-height:300px" role="img" aria-label="A round dial with a needle">' +
    '<rect width="520" height="290" rx="14" fill="#f4f1ea"/>' + (o.unit === "mph" ? "" : '<rect x="120" y="14" width="280" height="22" rx="8" fill="#9aa3b5" stroke="#141a33" stroke-width="2"/><rect x="250" y="34" width="20" height="16" fill="#9aa3b5"/>') +
    dialG(260, 160, 108, o) + (extra || "") + '</svg>';
}
function dial2(o1, o2){
  return '<svg viewBox="0 0 520 270" style="max-height:300px" role="img" aria-label="Two kitchen scale dials, before and after">' +
    '<rect width="520" height="270" rx="14" fill="#f4f1ea"/>' + dialG(130, 150, 95, o1, "Before") + dialG(390, 150, 95, o2, "After") +
    '<path d="M240 150h40" stroke="#141a33" stroke-width="3"/><path d="M272 142l8 8 -8 8" fill="none" stroke="#141a33" stroke-width="3"/></svg>';
}

/* a fuel gauge: half circle, E on the left, F on the right */
function gaugeG(cx, cy, r, frac, labels, eighths){
  function P(f, rr){ var a = (-90 + f * 180) * Math.PI / 180; return [r6(cx + rr * Math.sin(a)), r6(cy - rr * Math.cos(a))]; }
  var a0 = P(0, r), a1 = P(1, r), z0 = P(0, r - 6), z1 = P(0.12, r - 6);
  var s = '<path d="M' + a0[0] + ' ' + a0[1] + 'A' + r + ' ' + r + ' 0 0 1 ' + a1[0] + ' ' + a1[1] + 'z" fill="#ffffff" stroke="#141a33" stroke-width="4"/>' +
    '<path d="M' + z0[0] + ' ' + z0[1] + 'A' + (r - 6) + ' ' + (r - 6) + ' 0 0 1 ' + z1[0] + ' ' + z1[1] + '" fill="none" stroke="' + RED + '" stroke-width="8"/>';
  var step = eighths ? 0.125 : 0.25;
  for(var f = 0; f <= 1.0001; f += step){
    var big = Math.abs(f * 4 - Math.round(f * 4)) < 1e-6, a = P(f, r - 4), b = P(f, r - (big ? 24 : 14));
    s += '<path d="M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1] + '" stroke="#141a33" stroke-width="' + (big ? 3 : 1.6) + '"/>';
  }
  var n = P(frac, r * 0.84);
  s += '<path d="M' + cx + ' ' + cy + 'L' + n[0] + ' ' + n[1] + '" stroke="' + RED + '" stroke-width="5" stroke-linecap="round"/>';
  labels.forEach(function(l){ var q = P(l[0], r - 40), end = l[0] === 0 || l[0] === 1;
    s += '<text x="' + (q[0] + (l[0] === 0 ? 6 : l[0] === 1 ? -6 : 0)) + '" y="' + (q[1] + (end ? -12 : 8)) + '" ' + F + ' font-size="17" font-weight="700" text-anchor="middle" fill="#141a33" stroke="#ffffff" stroke-width="5" paint-order="stroke">' + l[1] + '</text>'; });
  return s + '<circle cx="' + cx + '" cy="' + cy + '" r="9" fill="#141a33"/>';
}
function gauge(frac, labels, eighths, note){
  return '<svg viewBox="0 0 520 220" role="img" aria-label="A fuel gauge from E for empty to F for full">' +
    '<rect width="520" height="220" rx="14" fill="#2b3150"/>' + gaugeG(260, 190, 160, frac, labels, eighths) +
    T(500, 206, "FUEL", 13, { a: "end", b: 1, c: "#cfd3dd" }) + (note ? T(500, 30, note, 13, { a: "end", b: 1, c: "#ffffff" }) : "") + '</svg>';
}
var GL = { mild: [[0, "E"], [0.5, "1/2"], [1, "F"]], other: [[0, "E"], [1, "F"]] };

var START = '<svg viewBox="0 0 520 220" role="img" aria-label="A dial, a ruler and Bonnie the poodle">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  dialG(130, 112, 80, { lo: 0, hi: 1000, lab: 200, sub: 4, v: 650, unit: "g" }) +
  '<rect x="250" y="40" width="250" height="44" rx="6" fill="#ffe58a" stroke="#141a33" stroke-width="2"/>' +
  [0, 1, 2, 3, 4, 5].map(function(i){ return '<path d="M' + (262 + i * 45) + ' 40v18" stroke="#141a33" stroke-width="2"/>' + T(262 + i * 45, 76, String(i), 12, { a: "middle", b: 1 }); }).join("") +
  A.bonnie(380, 160, 0.85, "sit") +
  A.egg(A.bird(470, 160, 0.7, "#19c39a"), "A bird, sitting very still to be measured. 12 cm, beak to tail. Jay checked twice.") +
  '</svg>';

/* ---------- question builders ---------- */
/* a reading: mode "near" (nearest labelled mark), "exact" (on a mark), "est" (between marks) */
function RQ(q, draw, o, mode, hint, label){
  var fig = draw(o), I = info(o), u = o.unit ? " " + o.unit : "", ans, slips = [], why, tol;
  function add(v, msg){ v = r6(v); if(v !== ans && !slips.some(function(s){ return s[0] === v; })) slips.push([v, msg]); }
  if(mode === "near"){
    ans = I.near;
    add(ans === I.lb ? I.la : I.lb, "That label is further away. Which label is the pointer closer to?");
    if(o.v !== ans) add(I.mid, "That is halfway, and it has no label here. Pick the nearest label.");
    why = o.v === ans ? "The pointer is right on the " + fmt(ans) + " label: <b>" + fmt(ans) + u + "</b>." :
      "It is between " + fmt(I.lb) + " and " + fmt(I.la) + ". Halfway is " + fmt(I.mid) + ", and the pointer is " + (ans === I.lb ? "before" : "past") + " halfway, so the nearest labelled mark is <b>" + fmt(ans) + u + "</b>.";
  } else if(mode === "exact"){
    ans = o.v;
    if(I.sub > 1 && I.per !== 1) add(I.lb + I.k, "That counts each small gap as 1. Each gap is worth " + fmt(I.per) + ".");
    if(o.v < 0) add(-o.v, "It is below zero, so it needs a minus sign.");
    if(o.unit === "cm" && I.sub === 10) add(o.v * 10, "That is in millimetres. The box wants centimetres: " + fmt(o.v * 10) + " mm is " + fmt(o.v) + " cm.");
    add(I.lb, "That is the label just below. Count on the small gaps too.");
    add(I.la, "That is the label just above. The pointer has not reached it.");
    why = I.sub > 1 ? "The labels go up in " + ups(o.lab) + " with " + I.sub + " gaps between, so each gap is " + fmt(I.per) + ". From " + fmt(I.lb) + ", " + I.k + " gap" + (I.k === 1 ? "" : "s") + " up: <b>" + fmt(ans) + u + "</b>." :
      "It is right on the " + fmt(ans) + " label: <b>" + fmt(ans) + u + "</b>.";
  } else {
    ans = o.v; tol = r6(I.per / 4);
    add(I.m1, "That is the mark just below. The pointer is past it, about halfway to the next one.");
    add(I.m2, "That is the mark just above. The pointer has not reached it.");
    why = "Each small gap is " + fmt(I.per) + ". The pointer is about halfway between " + fmt(I.m1) + " and " + fmt(I.m2) + ", so about <b>" + fmt(ans) + u + "</b>. Anything close is fine.";
  }
  if(mode === "near") q += " Read it to the nearest labelled mark.";
  if(!hint) hint = (draw === therm ? "Read the top of the red line. " : draw === jug ? "Read the top of the liquid, at eye level. " : o.bar ? "Start at 0 and read the other end. " : "") +
    (mode === "near" ? "Halfway between " + fmt(I.lb) + " and " + fmt(I.la) + " is " + fmt(I.mid) + ". Is it before or past halfway?" :
     mode === "est" ? "Each small gap is " + fmt(I.per) + ". Which two marks is it between?" :
     I.sub > 1 ? "Labels go up in " + ups(o.lab) + " with " + I.sub + " gaps between, so work out " + fmt(o.lab) + " &divide; " + I.sub + " first." : "Find the label it is on.");
  var box = { label: label || "Reading", a: ans };
  if(o.unit) box.post = o.unit;
  if(tol) box.tol = tol;
  return { q: q, fig: fig, boxes: [box], slips: slips, hint: hint, why: why };
}
/* steps laid out in boxes, for the faded examples */
function FADE(q, draw, o, mode){
  var fig = draw(o), I = info(o), u = o.unit ? " " + o.unit : "";
  if(mode === "near") return { q: q, fig: fig, hint: "Halfway between the two labels is " + fmt(I.mid) + ". Is the pointer before or past it?",
    boxes: [{ label: "Label just below", a: I.lb }, { label: "Label just above", a: I.la }, { label: "Nearest label", a: I.near }],
    slips: [[0, I.la, "That is the label above. Box 1 wants the one below."], [2, I.near === I.lb ? I.la : I.lb, "That label is further away. Check halfway."]],
    why: "Between " + fmt(I.lb) + " and " + fmt(I.la) + ", " + (I.near === I.lb ? "before" : "past") + " halfway, so <b>" + fmt(I.near) + u + "</b>." };
  if(mode === "exact") return { q: q, fig: fig, hint: "Labels go up in " + ups(o.lab) + ". Count the gaps between two labels.",
    boxes: [{ label: "Label just below", a: I.lb }, { label: "Each small gap is worth", a: I.per }, { label: "Reading", a: o.v, post: o.unit }],
    slips: [[1, 1, "That counts each gap as 1. Share " + fmt(o.lab) + " between " + I.sub + " gaps."], [1, I.sub, "That is how many gaps there are. What is each one worth?"], [2, I.lb + I.k, "That counts each small gap as 1."]].filter(function(s){ return s[1] !== (s[0] === 1 ? I.per : o.v); }),
    why: fmt(o.lab) + " shared between " + I.sub + " gaps is " + fmt(I.per) + ". From " + fmt(I.lb) + ", " + I.k + (I.k === 1 ? " gap" : " gaps") + " up: <b>" + fmt(o.v) + u + "</b>." };
  return { q: q, fig: fig, hint: "Find the small marks on each side of the pointer first.",
    boxes: [{ label: "Mark just below", a: I.m1 }, { label: "Mark just above", a: I.m2 }, { label: "Your reading", a: o.v, tol: r6(I.per / 4), post: o.unit }],
    slips: [[2, I.m1, "That is the mark below. The pointer is part way to the next one."], [2, I.m2, "That is the mark above. The pointer has not reached it."], [1, I.m1, "That is the mark below. Box 2 wants the one above."]],
    why: "It is between " + fmt(I.m1) + " and " + fmt(I.m2) + ", about halfway: about <b>" + fmt(o.v) + u + "</b>." };
}
function O(lo, hi, lab, sub, v, unit, extra){ var o = { lo: lo, hi: hi, lab: lab, sub: sub, v: v, unit: unit }; Object.keys(extra || {}).forEach(function(k){ o[k] = extra[k]; }); return o; }

/* one reading step: q (or [q, q, q] per level, or a function of the scale), a drawing, modes per level,
   and rows of versions: each row is [[o, hint], [o, hint], [o, hint]] for mild, medium, spicy */
function RS(q, draw, modes, rows, label){
  var L = ["mild", "medium", "spicy"];
  return rows.map(function(r){
    var v = {};
    L.forEach(function(l, i){
      var qq = Array.isArray(q) ? q[i] : q, o = r[i][0], I = info(o);
      if(typeof qq === "function") qq = qq(o, I);
      var hint = typeof r[i][1] === "function" ? r[i][1](o, I) : r[i][1];
      v[l] = modes[i].charAt(0) === "f" ? FADE(qq, draw, o, modes[i].slice(1)) : RQ(qq, draw, o, modes[i], hint, label);
    });
    return v;
  });
}
var EX3 = ["exact", "exact", "exact"], NEE = ["near", "exact", "exact"], NEST = ["near", "exact", "est"];

/* fixed order options */
function FIX(q, fig, options, answer, slips, hint, why){ return { q: q, fig: fig, options: options, answer: answer, slips: slips, hint: hint, why: why }; }

(window.A2PACKS = window.A2PACKS || {})["core-scale-spotter"] = {
  a2: true,
  id: "a2-core-scale-spotter",
  title: "Scale spotter",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 20,
  line: "Rulers, jugs, dials and gauges: find the labels, work out the gaps, read the pointer.",
  blurb: "Reading scales with a pointer: luggage scales, rulers, thermometers, jugs, kitchen scales, speedometers and fuel gauges. Four short chunks, new readings each time you come back, and your own gauge to design at the end.",
  note: "Reading scales on all sorts of things, from rulers to fuel gauges. Four five minute chunks, with new readings each time you come back. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Sparrow", line: "Sparrow: read the pointer to the nearest labelled mark." },
    { id: "medium", name: "Kestrel", line: "Kestrel: read the small marks between the labels." },
    { id: "spicy", name: "Eagle eye", line: "Eagle eye: decimals, below zero, and estimating between marks." }
  ],
  themes: {
    time: { name: "Time travel", w: { thing: "scroll", liquid: "time potion", liq: "#8a5cf6", vehicle: "time machine", bag: "bag of old coins", place: "the pyramids" } },
    football: { name: "Football", w: { thing: "shin pad", liquid: "orange squash", liq: "#ff8a3d", vehicle: "team coach", bag: "bag of footballs", place: "the training pitch" } },
    horror: { name: "Horror", w: { thing: "bone", liquid: "witch's brew", liq: "#5fd35f", vehicle: "old hearse", bag: "sack of pumpkins", place: "the crypt" } },
    fishing: { name: "Fishing", w: { thing: "fish", liquid: "pond water", liq: "#3a8fd6", vehicle: "angler's van", bag: "bag of bait", place: "the riverbank" } },
    music: { name: "Music", w: { thing: "drumstick", liquid: "smoothie", liq: "#ff5d8f", vehicle: "tour bus", bag: "bag of cables", place: "the festival field" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: START,
  steps: [

    /* ---------- chunk 1: what the labels say ---------- */
    S("learn", "What the labels say", [{
      mild: { title: "Worked example: what do the labels say?",
        html: "<p>Every scale works the same way. Here is one done for you.</p>" +
          "<p class=\"a2task\"><b>Step 1:</b> find two labels next to each other: 10 and 20.<br><b>Step 2:</b> the gap between them is 10, so the labels go up in <b>10s</b>.<br><b>Step 3:</b> look where the pointer is. It is right on <b>30</b>.<br>So this luggage scale reads <b>30 kg</b>.</p>",
        fig: hs(O(0, 50, 10, 1, 30, "kg")) },
      medium: { title: "Worked example: the marks between labels",
        html: "<p>Lots of marks have no number. Work out what each one is worth.</p>" +
          "<p class=\"a2task\"><b>Step 1:</b> labels go up in 10s.<br><b>Step 2:</b> between 20 and 30 there are <b>5 gaps</b>, so each gap is 10 &divide; 5 = <b>2</b>.<br><b>Step 3:</b> the pointer is 3 gaps past 20: 20, 22, 24, <b>26</b>.<br>So it reads <b>26 kg</b>.</p>",
        fig: hs(O(0, 50, 10, 5, 26, "kg")) },
      spicy: { title: "Worked example: decimal marks",
        html: "<p>The same steps work when the marks are decimals.</p>" +
          "<p class=\"a2task\"><b>Step 1:</b> labels go up in 1s.<br><b>Step 2:</b> 5 gaps between labels, so each gap is 1 &divide; 5 = <b>0.2</b>.<br><b>Step 3:</b> the pointer is 4 gaps past 2: 2.2, 2.4, 2.6, <b>2.8</b>.<br>So it reads <b>2.8 kg</b>.</p>",
        fig: hs(O(0, 5, 1, 5, 2.8, "kg")) }
    }]),

    S("mc", "What the labels say", (function(){
      function L(o, w, why){
        var I = info(o), right = fmt(o.sub > 1 ? I.per : o.lab);
        var sl = {}; w.forEach(function(x, k){ sl[k + 1] = x[1]; });
        var c = {}; Object.keys(o).forEach(function(k){ c[k] = o[k]; }); c.v = o.lo; c.hide = 1;
        return { q: o.sub > 1 ? "What is each small gap on this scale worth?" : "What do the labels on this scale go up in?",
          fig: hs(c), options: [right].concat(w.map(function(x){ return x[0]; })), answer: 0, slips: sl,
          hint: o.sub > 1 ? "Find what the labels go up in, then share it between the gaps." : "Look at two labels next to each other.", why: why };
      }
      return [
        { mild: L(O(0, 30, 5, 1, 0, "cm"), [["1", "The labels jump from 0 to 5, not 0 to 1."], ["10", "Look at two labels next to each other: 0 and 5."], ["7", "That is how many labels there are. What is the jump between two of them?"]], "0, 5, 10, 15: they go up in <b>5s</b>."),
          medium: L(O(0, 100, 20, 4, 0, "kg"), [["1", "That counts each gap as 1. The labels go up in 20s."], ["4", "That is how many gaps there are between labels."], ["20", "That is what the labels go up in. Share it between the gaps."]], "20 shared between 4 gaps is <b>5</b>."),
          spicy: L(O(0, 5, 1, 5, 0, "kg"), [["0.1", "There are 5 gaps, not 10. Share 1 between 5."], ["5", "That is how many gaps there are between labels."], ["1", "That is what the labels go up in. Share it between the gaps."]], "1 shared between 5 gaps is <b>0.2</b>.") },
        { mild: L(O(0, 12, 2, 1, 0, "cm"), [["1", "The labels jump from 0 to 2, not 0 to 1."], ["4", "Look at two labels next to each other: 2 and 4."], ["12", "That is the last label. What is the jump between two labels?"]], "0, 2, 4, 6: they go up in <b>2s</b>."),
          medium: L(O(0, 250, 50, 5, 0, "g"), [["1", "That counts each gap as 1. The labels go up in 50s."], ["5", "That is how many gaps there are between labels."], ["50", "That is what the labels go up in. Share it between the gaps."]], "50 shared between 5 gaps is <b>10</b>."),
          spicy: L(O(0, 2.5, 0.5, 5, 0, "litres"), [["0.5", "That is what the labels go up in. Share it between the gaps."], ["5", "That is how many gaps there are between labels."], ["0.2", "Share 0.5 between 5 gaps, not 1."]], "0.5 shared between 5 gaps is <b>0.1</b>.") },
        { mild: L(O(0, 100, 20, 1, 0, "kg"), [["10", "Look at two labels next to each other: 0 and 20."], ["1", "The labels jump from 0 to 20, not 0 to 1."], ["6", "That is how many labels there are. What is the jump between two of them?"]], "0, 20, 40, 60: they go up in <b>20s</b>."),
          medium: L(O(0, 400, 100, 4, 0, "ml"), [["1", "That counts each gap as 1. The labels go up in 100s."], ["4", "That is how many gaps there are between labels."], ["20", "That would need 5 gaps. Count the gaps between two labels again."]], "100 shared between 4 gaps is <b>25</b>."),
          spicy: L(O(0, 4, 1, 4, 0, "kg"), [["0.4", "That is not 1 shared between 4. Count the gaps between two labels again."], ["4", "That is how many gaps there are between labels."], ["0.2", "That would need 5 gaps. Count the gaps between two labels again."]], "1 shared between 4 gaps is <b>0.25</b>.") }
      ];
    })()),

    S("num", "What the labels say", RS("How heavy is the [[bag]] on the scale?", hs, EX3, [
      [[O(0, 50, 10, 1, 40, "kg")], [O(0, 50, 10, 5, 34, "kg")], [O(0, 5, 1, 5, 3.4, "kg")]],
      [[O(0, 25, 5, 1, 15, "kg")], [O(0, 40, 10, 4, 27.5, "kg")], [O(0, 2.5, 0.5, 5, 1.3, "kg")]],
      [[O(0, 100, 20, 1, 60, "kg")], [O(0, 60, 20, 4, 45, "kg")], [O(0, 10, 2, 4, 6.5, "kg")]]
    ])),

    S("num", "What the labels say", RS("What temperature does the thermometer show at [[place]]?", therm, EX3, [
      [[O(0, 40, 10, 1, 20, DEG)], [O(0, 40, 10, 5, 26, DEG)], [O(-20, 20, 10, 5, -6, DEG)]],
      [[O(0, 30, 5, 1, 15, DEG)], [O(-10, 30, 10, 5, 14, DEG)], [O(-10, 30, 10, 4, -2.5, DEG)]],
      [[O(0, 40, 10, 1, 10, DEG)], [O(0, 50, 10, 2, 35, DEG)], [O(35, 42, 1, 5, 37.4, DEG)]]
    ])),

    S("num", "What the labels say", RS(["How long is the [[thing]]?", "How long is the [[thing]]?", "How long is the [[thing]], in centimetres?"], hs, EX3, [
      [[O(0, 10, 1, 1, 7, "cm", { bar: 1 })], [O(0, 12, 1, 2, 8.5, "cm", { bar: 1 })], [O(0, 10, 1, 10, 7.4, "cm", { bar: 1 })]],
      [[O(0, 15, 1, 1, 12, "cm", { bar: 1 })], [O(0, 10, 1, 2, 5.5, "cm", { bar: 1 })], [O(0, 12, 1, 10, 9.8, "cm", { bar: 1 })]],
      [[O(0, 12, 1, 1, 9, "cm", { bar: 1 })], [O(0, 15, 1, 2, 11.5, "cm", { bar: 1 })], [O(0, 10, 1, 10, 6.3, "cm", { bar: 1 })]]
    ], "Length")),

    /* ---------- chunk 2: nearest mark ---------- */
    S("learn", "In between", [{
      mild: { title: "Worked example: the nearest labelled mark",
        html: "<p>Sometimes the pointer stops <b>between</b> two labels. Then you read it to the <b>nearest</b> label.</p>" +
          "<p class=\"a2task\"><b>Step 1:</b> the pointer is between 20 and 30.<br><b>Step 2:</b> halfway between them is 25.<br><b>Step 3:</b> the pointer is past halfway, so it is nearer 30.<br>To the nearest labelled mark: <b>30</b>.</p>",
        fig: hs(O(0, 40, 10, 1, 28, "m", { half: 1 })) },
      medium: { title: "Worked example: counting the gaps",
        html: "<p>When the pointer is on a small mark, count the gaps from the label below.</p>" +
          "<p class=\"a2task\"><b>Step 1:</b> the label below the pointer is 60.<br><b>Step 2:</b> labels go up in 20s with 4 gaps, so each gap is <b>5</b>.<br><b>Step 3:</b> one gap past 60 is <b>65</b>.</p>",
        fig: hs(O(0, 100, 20, 4, 65, "m")) },
      spicy: { title: "Worked example: between two marks",
        html: "<p>Sometimes the pointer stops between two small marks. Then you <b>estimate</b>.</p>" +
          "<p class=\"a2task\"><b>Step 1:</b> each small gap is 0.5 &divide; 5 = 0.1.<br><b>Step 2:</b> the pointer is between the 1.2 and 1.3 marks.<br><b>Step 3:</b> it is about halfway, so about <b>1.25</b>.</p>",
        fig: hs(O(0, 2, 0.5, 5, 1.25, "m")) }
    }]),

    S("num", "In between", RS("Your turn, with the steps laid out. How far along the tape is the pointer?", hs, ["fnear", "fexact", "fest"], [
      [[O(0, 50, 10, 1, 37, "m")], [O(0, 100, 20, 4, 85, "m")], [O(0, 2, 0.5, 5, 1.35, "m")]],
      [[O(0, 100, 20, 1, 46, "m")], [O(0, 50, 10, 5, 36, "m")], [O(0, 5, 1, 5, 2.5, "m")]],
      [[O(0, 25, 5, 1, 11, "m")], [O(0, 200, 50, 5, 120, "m")], [O(0, 10, 2, 4, 3.75, "m")]]
    ])),

    S("num", "In between", RS([
        function(o, I){ return "Fewer steps now. Step 1 is done: the pointer is between " + fmt(I.lb) + " and " + fmt(I.la) + "."; },
        function(o, I){ return "Fewer steps now. Step 1 is done: each small gap is worth " + fmt(I.per) + ". What is the reading?"; },
        function(o, I){ return "Fewer steps now. Step 1 is done: each small gap is worth " + fmt(I.per) + ". Estimate the reading."; }], hs, NEST, (function(){
      var h = [function(o, I){ return "Is it before or past " + fmt(I.mid) + "?"; }, "Count on from the label below.", "Which two small marks is it between?"];
      return [[O(0, 100, 10, 1, 62, "m"), O(0, 60, 20, 4, 35, "m"), O(0, 1, 0.2, 2, 0.65, "m")],
        [O(0, 50, 10, 1, 18, "m"), O(0, 100, 25, 5, 70, "m"), O(0, 30, 10, 5, 17, "m")],
        [O(0, 60, 10, 1, 43, "m"), O(0, 400, 100, 4, 275, "m"), O(0, 4, 1, 2, 2.25, "m")]].map(function(r){ return r.map(function(o, i){ return [o, h[i]]; }); });
    })())),

    S("num", "In between", RS(["On your own now. How much [[liquid]] is in the jug?", "On your own now. How much [[liquid]] is in the jug?", "On your own now. How much [[liquid]] is in the jug, in litres?"], jug, NEE, [
      [[O(0, 500, 100, 1, 290, "ml")], [O(0, 1000, 200, 4, 750, "ml")], [O(0, 2, 0.5, 5, 1.3, "litres")]],
      [[O(0, 1000, 200, 1, 620, "ml")], [O(0, 500, 100, 5, 340, "ml")], [O(0, 1, 0.25, 5, 0.85, "litres")]],
      [[O(0, 500, 100, 1, 410, "ml")], [O(0, 2000, 500, 5, 1300, "ml")], [O(0, 1, 0.2, 4, 0.55, "litres")]]
    ])),

    /* ---------- chunk 3: dials and gauges ---------- */
    S("learn", "Dials and gauges", [{
      mild: { title: "A dial is a scale bent round",
        html: "<p>Kitchen scales, speedometers and fuel gauges are scales bent into a curve. Follow the numbers round the same way as a clock.</p>" +
          "<p class=\"a2task\">Same steps as before: what do the labels go up in? Which labels is the needle between? Which one is it nearest?</p>",
        fig: '<svg viewBox="0 0 520 250" role="img" aria-label="A kitchen scale dial and a fuel gauge">' + '<rect width="520" height="250" rx="14" fill="#f4f1ea"/>' +
          dialG(130, 135, 100, O(0, 1000, 100, 1, 600, "g")) + '<rect x="270" y="60" width="236" height="170" rx="14" fill="#2b3150"/>' + gaugeG(388, 210, 104, 0.75, GL.mild) +
          A.egg(A.bird(486, 46, 0.6, "#ff5d5d"), "A bird checking the fuel. Birds do not need fuel. They run on seeds and good vibes.") + '</svg>' },
      medium: { title: "A dial is a scale bent round",
        html: "<p>Kitchen scales, speedometers and fuel gauges are scales bent into a curve. Follow the numbers round the same way as a clock.</p>" +
          "<p class=\"a2task\">Same steps: labels go up in 200s here, with 4 gaps between, so each gap is 50. The needle is one gap past 600: <b>650 g</b>.</p>",
        fig: dial(O(0, 1000, 200, 4, 650, "g"), A.egg(A.bird(470, 250, 0.6, "#ff5d5d"), "A bird checking the scales. It weighs about 20 grams. Mostly feathers and opinions.")) },
      spicy: { title: "A dial is a scale bent round",
        html: "<p>Kitchen scales, speedometers and fuel gauges are scales bent into a curve. Follow the numbers round the same way as a clock.</p>" +
          "<p class=\"a2task\">Same steps: labels go up in 1 kg with 10 gaps, so each gap is 0.1 kg. The needle is 3 gaps past 2: <b>2.3 kg</b>.</p>",
        fig: dial(O(0, 5, 1, 10, 2.3, "kg"), A.egg(A.bird(470, 250, 0.6, "#ff5d5d"), "A bird checking the scales. It weighs about 0.02 kg. Mostly feathers and opinions.")) }
    }]),

    S("num", "Dials and gauges", RS("The [[bag]] is on the kitchen scales. How heavy is it?", dial, NEE, [
      [[O(0, 1000, 100, 1, 400, "g")], [O(0, 1000, 200, 4, 850, "g")], [O(0, 5, 1, 10, 3.6, "kg")]],
      [[O(0, 1000, 100, 1, 680, "g")], [O(0, 2000, 500, 5, 1300, "g")], [O(0, 3, 0.5, 5, 1.7, "kg")]],
      [[O(0, 500, 50, 1, 260, "g")], [O(0, 500, 100, 5, 260, "g")], [O(0, 4, 1, 4, 2.75, "kg")]]
    ])),

    S("mc", "Dials and gauges", (function(){
      var M = ["Nearly empty", "About half", "Nearly full"], Q = ["A quarter", "Half", "Three quarters", "Full"];
      function mild(f, ans){ var sl = {}; M.forEach(function(m, k){ if(k !== ans) sl[k] = "Look at which label the needle is nearest: E, 1/2 or F."; });
        return FIX("About how much fuel is in the [[vehicle]]?", gauge(f, GL.mild), M, ans, sl, "E means empty and F means full.", "The needle is nearest " + ["E", "1/2", "F"][ans] + ": <b>" + M[ans].toLowerCase() + "</b>."); }
      function med(f, ans){ var sl = {}; Q.forEach(function(m, k){ if(k !== ans) sl[k] = "Count the big marks from E. There are 4 equal gaps from E to F."; });
        return FIX("About how much fuel is in the [[vehicle]]?", gauge(f, GL.other), Q, ans, sl, "The big marks split E to F into quarters.", "The needle is on the " + ["first", "middle", "third"][ans] + " big mark: <b>" + Q[ans].toLowerCase() + "</b>."); }
      function spicy(f, tank, opts, why){
        var ans = r6(f * tank), vals = [ans].concat(opts).sort(function(a, b){ return a - b; }), sl = {};
        var say = { 0: "That is the fuel that has been used, not what is left.", 1: "Check which mark the needle is on. Count the marks from E.", 2: "Work out the fraction first, then that fraction of " + tank + "." };
        opts.forEach(function(x, k){ sl[vals.indexOf(x)] = say[k]; });
        return { q: "The [[vehicle]] tank holds " + tank + " litres when full. About how many litres are left?", fig: gauge(f, GL.other, true, "Full tank: " + tank + " litres"),
          options: vals.map(function(x){ return fmt(x) + " litres"; }), answer: vals.indexOf(ans), slips: sl,
          hint: "The small marks split the tank into eighths. Work out what fraction is left, then that fraction of " + tank + ".", why: why }; }
      return [
        { mild: mild(0.5, 1), medium: med(0.75, 2), spicy: spicy(0.75, 60, [15, 30, 40], "Three quarters of 60 is <b>45 litres</b>.") },
        { mild: mild(0.94, 2), medium: med(0.25, 0), spicy: spicy(0.25, 50, [37.5, 25, 20], "A quarter of 50 is <b>12.5 litres</b>.") },
        { mild: mild(0.07, 0), medium: med(0.5, 1), spicy: spicy(0.375, 80, [50, 40, 35], "The needle is on 3 eighths. 80 &divide; 8 = 10, so 3 eighths is <b>30 litres</b>.") }
      ];
    })(), { fixed: true }),

    S("num", "Dials and gauges", RS(["How fast is the [[vehicle]] going?", "How fast is the [[vehicle]] going?", "How fast is the [[vehicle]] going? Estimate it."], dial, NEST, [
      [[O(0, 80, 10, 1, 30, "mph")], [O(0, 80, 20, 4, 45, "mph")], [O(0, 120, 20, 2, 55, "mph")]],
      [[O(0, 80, 10, 1, 48, "mph")], [O(0, 100, 20, 2, 70, "mph")], [O(0, 80, 20, 4, 42.5, "mph")]],
      [[O(0, 80, 10, 1, 62, "mph")], [O(0, 80, 20, 4, 65, "mph")], [O(0, 160, 40, 4, 95, "mph")]]
    ], "Speed")),

    S("num", "Dials and gauges", (function(){
      function BA(lo, hi, lab, sub, b, a, unit){
        var o1 = O(lo, hi, lab, sub, b, unit), o2 = O(lo, hi, lab, sub, a, unit), d = r6(a - b);
        return { q: "Jay weighs an empty bird feeder, fills it with seed, then weighs it again. How much seed did he put in?", fig: dial2(o1, o2),
          boxes: [{ label: "Before", a: b, post: unit }, { label: "After", a: a, post: unit }, { label: "Seed", a: d, post: unit }],
          slips: [[2, r6(a + b), "That adds them. The seed is the difference: after take away before."], [2, a, "That is the feeder and the seed together. Take away the feeder."]],
          hint: "Read both dials, then work out after take away before.",
          why: "Before " + fmt(b) + ", after " + fmt(a) + ". " + fmt(a) + " take away " + fmt(b) + " is <b>" + fmt(d) + " " + unit + "</b> of seed. The birds approve." };
      }
      return [
        { mild: BA(0, 1000, 100, 1, 200, 700, "g"), medium: BA(0, 1000, 200, 4, 250, 800, "g"), spicy: BA(0, 2, 0.5, 5, 0.4, 1.3, "kg") },
        { mild: BA(0, 1000, 100, 1, 300, 900, "g"), medium: BA(0, 1000, 200, 4, 100, 550, "g"), spicy: BA(0, 2, 0.5, 5, 0.3, 1.8, "kg") },
        { mild: BA(0, 1000, 100, 1, 400, 600, "g"), medium: BA(0, 1000, 200, 4, 350, 950, "g"), spicy: BA(0, 2, 0.5, 5, 0.8, 1.1, "kg") }
      ];
    })(), { explain: true }),

    /* ---------- chunk 4: spot it anywhere ---------- */
    S("mc", "Spot it anywhere", (function(){
      var OPT = ["Jug A", "Jug B", "They have the same"];
      function J(o1, o2, why){
        var a = o1.unit === "litres" ? o1.v * 1000 : o1.v, b = o2.unit === "litres" ? o2.v * 1000 : o2.v, ans = a > b ? 0 : a < b ? 1 : 2, sl = {};
        if(ans !== 0) sl[0] = "Jug A might look fuller, but read the numbers, not the height.";
        if(ans !== 1) sl[1] = "Jug B might look fuller, but read the numbers, not the height.";
        if(ans !== 2) sl[2] = "Read each jug carefully. One has more.";
        return { q: "Which jug has more [[liquid]] in it?", fig: jug2(o1, o2), options: OPT, answer: ans, slips: sl,
          hint: "The jugs have different scales. Read each one, then compare the numbers.", why: why };
      }
      return [
        { mild: J(O(0, 500, 100, 1, 300, "ml"), O(0, 1000, 200, 1, 400, "ml"), "A has 300 ml. B has 400 ml, even though it looks lower. <b>Jug B</b> has more."),
          medium: J(O(0, 1000, 200, 4, 450, "ml"), O(0, 500, 100, 5, 380, "ml"), "A has 450 ml. B has 380 ml, even though it looks fuller. <b>Jug A</b> has more."),
          spicy: J(O(0, 2, 0.5, 5, 0.8, "litres"), O(0, 1000, 200, 4, 750, "ml"), "A has 0.8 litres, which is 800 ml. B has 750 ml. <b>Jug A</b> has more.") },
        { mild: J(O(0, 1000, 200, 1, 600, "ml"), O(0, 500, 100, 1, 500, "ml"), "A has 600 ml. B is full, but it only holds 500 ml. <b>Jug A</b> has more."),
          medium: J(O(0, 2000, 500, 5, 700, "ml"), O(0, 1000, 200, 4, 650, "ml"), "A has 700 ml. B has 650 ml, even though it looks fuller. <b>Jug A</b> has more."),
          spicy: J(O(0, 1, 0.25, 5, 0.65, "litres"), O(0, 500, 100, 5, 480, "ml"), "A has 0.65 litres, which is 650 ml. B has 480 ml. <b>Jug A</b> has more.") },
        { mild: J(O(0, 500, 100, 1, 400, "ml"), O(0, 1000, 200, 1, 400, "ml"), "A has 400 ml and B has 400 ml. <b>They have the same</b>, even though they look different."),
          medium: J(O(0, 500, 100, 2, 250, "ml"), O(0, 1000, 250, 5, 250, "ml"), "A has 250 ml and B has 250 ml. <b>They have the same</b>."),
          spicy: J(O(0, 2, 0.5, 5, 1.2, "litres"), O(0, 1500, 500, 5, 1200, "ml"), "A has 1.2 litres, which is 1200 ml. B has 1200 ml. <b>They have the same</b>.") }
      ];
    })(), { fixed: true, explain: true }),

    S("num", "Spot it anywhere", (function(){
      function TT(o1, o2, diff){
        var b = [{ label: "Inside", a: o1.v, post: DEG }, { label: "Outside", a: o2.v, post: DEG }], sl = [];
        if(o2.v < 0) sl.push([1, -o2.v, "Outside is below zero, so it needs a minus sign."]);
        var I1 = info(o1), I2 = info(o2);
        if(I1.sub > 1 && I1.per !== 1) sl.push([0, r6(I1.lb + I1.k), "That counts each small gap as 1. Each gap is worth " + fmt(I1.per) + "."]);
        if(I2.sub > 1 && I2.per !== 1 && o2.v >= 0) sl.push([1, r6(I2.lb + I2.k), "That counts each small gap as 1. Each gap is worth " + fmt(I2.per) + "."]);
        var why = "Inside is <b>" + fmt(o1.v) + "</b> and outside is <b>" + fmt(o2.v) + "</b>.";
        if(diff){
          var d = r6(o1.v - o2.v);
          b.push({ label: "Difference", a: d, post: DEG });
          sl.push([2, r6(o1.v + o2.v), "That adds them. Count up from outside to inside instead."]);
          why += " From " + fmt(o2.v) + " up to 0 is " + fmt(-o2.v) + ", then up to " + fmt(o1.v) + " is " + fmt(o1.v) + " more: <b>" + fmt(d) + " degrees</b> warmer inside.";
        }
        return { q: diff ? "Bonnie is inside by the fire. Jay is outside watching birds. Read both thermometers, then find how much warmer it is inside." : "Bonnie is inside by the fire. Jay is outside watching birds. Read both thermometers.",
          fig: therm2(o1, o2, "Inside", "Outside"), boxes: b, slips: sl, hint: diff ? "For the difference, count up from the outside temperature to the inside one." : "Read the top of each red line.", why: why };
      }
      return [
        { mild: TT(O(0, 40, 10, 1, 20), O(0, 40, 10, 1, 10)), medium: TT(O(-10, 30, 10, 5, 18), O(-10, 30, 10, 5, 6)), spicy: TT(O(-20, 20, 10, 5, 4), O(-20, 20, 10, 5, -6), 1) },
        { mild: TT(O(0, 40, 10, 1, 30), O(0, 40, 10, 1, 0)), medium: TT(O(-10, 30, 10, 5, 22), O(-10, 30, 10, 5, -4)), spicy: TT(O(-20, 20, 10, 5, 12), O(-20, 20, 10, 5, -8), 1) },
        { mild: TT(O(0, 50, 10, 1, 40), O(0, 50, 10, 1, 20)), medium: TT(O(0, 40, 10, 2, 25), O(0, 40, 10, 2, 15)), spicy: TT(O(-30, 10, 10, 4, 2.5), O(-30, 10, 10, 4, -17.5), 1) }
      ];
    })()),

    S("num", "Spot it anywhere", (function(){
      function MORE(o, target, ml){
        var have = o.v, need = r6(target - have), ansml = ml ? r6(need * 1000) : need, u = ml ? "ml" : o.unit;
        var sl = [[ml ? r6(have * 1000) : have, "That is how much is in the jug now. How much more is needed?"]];
        if(ml) sl.push([need, "That is in litres. The box wants millilitres: " + fmt(need) + " litres is " + fmt(ansml) + " ml."]);
        else sl.push([r6(target + have), "That adds them. Work out the gap from " + fmt(have) + " up to " + fmt(target) + "."]);
        return { q: "A recipe needs " + fmt(target) + " " + (target === 1 ? "litre" : o.unit) + " of [[liquid]]. How much more do you need to pour in?", fig: jug(o),
          boxes: [{ label: "More needed", a: ansml, post: u }], slips: sl, hint: "Read the jug first. Then count up to " + fmt(target) + ".",
          why: "The jug has " + fmt(have) + " " + o.unit + ". From " + fmt(have) + " up to " + fmt(target) + " is " + (ml ? fmt(need) + " litres, which is " : "") + "<b>" + fmt(ansml) + " " + u + "</b>." };
      }
      return [
        { mild: MORE(O(0, 500, 100, 1, 300, "ml"), 500), medium: MORE(O(0, 1000, 200, 4, 350, "ml"), 1000), spicy: MORE(O(0, 1, 0.2, 4, 0.65, "litres"), 1, true) },
        { mild: MORE(O(0, 500, 100, 1, 100, "ml"), 400), medium: MORE(O(0, 500, 100, 5, 240, "ml"), 500), spicy: MORE(O(0, 2, 0.5, 5, 1.3, "litres"), 2, true) },
        { mild: MORE(O(0, 1000, 200, 1, 600, "ml"), 1000), medium: MORE(O(0, 2000, 500, 5, 1300, "ml"), 2000), spicy: MORE(O(0, 1.5, 0.5, 5, 0.9, "litres"), 1.5, true) }
      ];
    })())
  ],

  realWorld: {
    title: "Always check the labels",
    html: "<p>Scales are everywhere: the speedometer in a car, kitchen scales for baking, a thermometer when you feel poorly, the fuel gauge on a long trip.</p>" +
      "<p>For our big question: if you travelled back to Britain a few decades ago, the weather forecast might give the temperature in <b>Fahrenheit</b>. On that scale, 50 is a mild day, not a heatwave. A time traveller who did not check the labels would pack very strange clothes.</p>",
    fig: '<svg viewBox="0 0 520 300" style="max-height:300px" role="img" aria-label="A thermometer with Celsius on one side and Fahrenheit on the other, and Jay looking puzzled">' +
      '<rect width="520" height="300" rx="14" fill="#e8f7ff"/>' +
      '<rect x="189" y="24" width="22" height="216" rx="11" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/><rect x="195" y="130" width="10" height="114" fill="' + RED + '"/><circle cx="200" cy="250" r="20" fill="' + RED + '" stroke="#141a33" stroke-width="2.5"/>' +
      [0, 10, 20, 30, 40].map(function(c){ var y = 220 - c * 4.5, f = c * 9 / 5 + 32; return '<path d="M212 ' + y + 'h14M174 ' + y + 'h14" stroke="#141a33" stroke-width="2"/>' + T(232, y + 5, c + " C", 13, { b: 1 }) + T(168, y + 5, f + " F", 13, { b: 1, a: "end" }); }).join("") +
      A.jay(380, 140, 0.9, "hmm") + A.bubble(300, 20, 180, 52, "50 degrees?\nSuncream or coat?", 360) + '</svg>'
  },

  make: {
    title: "Design your own gauge",
    intro: "A gauge for anything you like. Choose what it measures, the lowest and highest labels, and where the needle points. Keep it, stick it up or send it to Jay.",
    fields: [
      { id: "what", label: "What it measures", ph: "Bonnie's excitement", max: 26 },
      { id: "lo", label: "Lowest label (a number)", ph: "0", max: 6 },
      { id: "hi", label: "Highest label (a number)", ph: "10", max: 6 },
      { id: "v", label: "Where the needle points (a number)", ph: "8", max: 6 }
    ],
    svg: function(v){
      function e(t){ return String(t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      var lo = parseFloat(v.lo), hi = parseFloat(v.hi), at = parseFloat(v.v);
      if(isNaN(lo)) lo = 0; if(isNaN(hi) || hi === lo) hi = lo + 10; if(isNaN(at)) at = (lo + hi) / 2;
      var f = Math.max(0, Math.min(1, (at - lo) / (hi - lo))), cx = 300, cy = 290, r = 200, s = "";
      function P(fr, rr){ var a = (-90 + fr * 180) * Math.PI / 180; return [r6(cx + rr * Math.sin(a)), r6(cy - rr * Math.cos(a))]; }
      for(var i = 0; i <= 20; i++){ var a = P(i / 20, r - 6), b = P(i / 20, r - (i % 5 ? 20 : 36)); s += '<path d="M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1] + '" stroke="#141a33" stroke-width="' + (i % 5 ? 2 : 4) + '"/>'; }
      for(var j = 0; j <= 4; j++){ var q = P(j / 4, r - 62), ed = j === 0 || j === 4; s += '<text x="' + (q[0] + (j === 0 ? 10 : j === 4 ? -10 : 0)) + '" y="' + (q[1] + (ed ? -14 : 8)) + '" ' + F + ' font-size="22" font-weight="700" text-anchor="middle" fill="#141a33">' + e(fmt(lo + (hi - lo) * j / 4)) + '</text>'; }
      var n = P(f, r * 0.82);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380">' +
        '<rect width="600" height="380" rx="24" fill="#fffbe9"/>' +
        '<rect x="14" y="14" width="572" height="352" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        '<path d="M' + (cx - r) + ' ' + cy + 'A' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy + 'z" fill="#ffffff" stroke="#141a33" stroke-width="5"/>' + s +
        '<path d="M' + cx + ' ' + cy + 'L' + n[0] + ' ' + n[1] + '" stroke="' + RED + '" stroke-width="8" stroke-linecap="round"/><circle cx="' + cx + '" cy="' + cy + '" r="14" fill="#141a33"/>' +
        '<text x="300" y="56" ' + F + ' font-size="26" font-weight="700" text-anchor="middle" fill="#141a33">' + e(v.what) + '</text>' +
        '<text x="300" y="352" ' + F + ' font-size="18" text-anchor="middle" fill="#5b6180">Reading: ' + e(fmt(at)) + '</text>' +
        '</svg>';
    }
  }
};
})();
