/* Base 5 core target activity: Rectangle rooms.
   Maths. Area and perimeter of rectangles and of shapes made from
   rectangles (T shapes, U shapes, stairs): missing lengths, splitting
   into rectangles, walking round the edge. Replayable: every question
   carries two extra versions (vary). ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"', INK = "#141a33";
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + (o.h ? ' stroke="#f4f1ea" stroke-width="4" stroke-linejoin="round" paint-order="stroke"' : '') + ' fill="' + (o.c || INK) + '">' + s + '</text>';
}
function pic(w, h, aria, inner){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + aria + '"><rect width="' + w + '" height="' + h + '" rx="16" fill="#f4f1ea"/>' + inner + '</svg>'; }
function r6(x){ return Math.round(x * 1e6) / 1e6; }
function fm(x){ return String(r6(x)); }
function mo(x){ return (Math.round(x * 100) / 100).toFixed(2); }
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function fit(x, y, t, size, w, o){ var s = esc(t), est = s.length * size * 0.72; return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + size + '"' + (o.b ? ' font-weight="700"' : '') + (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + o.c + '"' + (est > w ? ' textLength="' + w + '" lengthAdjust="spacingAndGlyphs"' : '') + '>' + s + '</text>'; }
var X = " &times; ", SQ = "&sup2;";
function u2(u){ return u === "cm" ? " cm" + SQ : " m" + SQ; }

function clean(o){
  if(o.boxes && Array.isArray(o.slips)){
    var keep = o.slips.map(function(r){ var b = r.length === 3 ? r[0] : 0; return !(o.boxes[b] && Math.abs(r[r.length - 2] - o.boxes[b].a) < 1e-9); });
    o.slips = o.slips.filter(function(r, i){ return keep[i]; });
    /* easy read (LC): short slips line up one for one, so drop the same ones */
    if(o.ez && Array.isArray(o.ez.slips)) o.ez.slips = o.ez.slips.filter(function(r, i){ return keep[i]; });
  }
  return o;
}
/* easy read (LC): short slip messages, one per slip, same order and shape */
function zs(sl, msgs){ return sl.map(function(r, i){ return r.length === 3 ? [null, null, msgs[i]] : [null, msgs[i]]; }); }
function zs2(msgs){ return msgs.map(function(m){ return [null, m]; }); }
function zs3(msgs){ return msgs.map(function(m){ return [null, null, m]; }); }
function noEz(x){ if(!x || !x.ez) return x; var o = {}; Object.keys(x).forEach(function(k){ if(k !== "ez") o[k] = x[k]; }); return o; }
function G(type, topic, sets, extra){
  sets.forEach(function(v){ v.forEach(clean); });
  /* easy read (LC): only the first level's ez (v[1], mild) goes on top; ez never sits in lv */
  function one(v){ var o = {}; Object.keys(v[0]).forEach(function(k){ if(k !== "ez") o[k] = v[0][k]; }); o.lv = { mild: noEz(v[1]), spicy: noEz(v[2]) }; if(v[1].ez) o.ez = v[1].ez; return o; }
  var s = { type: type, topic: topic }, b = one(sets[0]);
  Object.keys(b).forEach(function(k){ s[k] = b[k]; });
  if(sets.length > 1) s.vary = sets.slice(1).map(one);
  Object.keys(extra || {}).forEach(function(k){ s[k] = extra[k]; });
  return s;
}

/* ---------- shapes (points clockwise, y downwards) ---------- */
function Rsh(w, h){ return [[0, 0], [w, 0], [w, h], [0, h]]; }
/* T: a bar W by a across the top, a stem s wide starting at x = o, b tall */
function Tsh(W, a, o, s, b){ return [[0, 0], [W, 0], [W, a], [o + s, a], [o + s, a + b], [o, a + b], [o, a], [0, a]]; }
/* U: W by H with a notch n wide and d deep cut into the top, starting at x = o */
function Ush(W, H, o, n, d){ return [[0, 0], [o, 0], [o, d], [o + n, d], [o + n, 0], [W, 0], [W, H], [0, H]]; }
/* stairs: steps going down to the right */
function Ssh(W, H, w1, h1, w2, h2){ return [[0, 0], [w1, 0], [w1, h1], [w1 + w2, h1], [w1 + w2, h1 + h2], [W, h1 + h2], [W, H], [0, H]]; }
function edges(p){ return p.map(function(a, i){ var b = p[(i + 1) % p.length]; return r6(Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1])); }); }
function area(p){ var s = 0; p.forEach(function(a, i){ var b = p[(i + 1) % p.length]; s += a[0] * b[1] - b[0] * a[1]; }); return r6(Math.abs(s) / 2); }
function perim(p){ return r6(edges(p).reduce(function(a, b){ return a + b; }, 0)); }
function box(p){ var W = 0, H = 0; p.forEach(function(a){ W = Math.max(W, a[0]); H = Math.max(H, a[1]); }); return [W, H]; }
function inside(p, x, y){ var c = false; for(var i = 0, j = p.length - 1; i < p.length; j = i++){ var xi = p[i][0], yi = p[i][1], xj = p[j][0], yj = p[j][1]; if(((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) c = !c; } return c; }

/* draw a shape: o.hide {edge: letter}, o.rects [[x,y,w,h,label]], o.grid, o.unit, o.nolab, o.note, o.walk */
function shapeFig(p, o, size){
  o = o || {};
  var bb = box(p), sw = (size || [360, 200]), s = Math.min(sw[0] / bb[0], sw[1] / bb[1]), ox = (o.ox != null ? o.ox : (520 - bb[0] * s) / 2), oy = 40, u = o.unit || "m", out = "";
  function X_(x){ return +(ox + x * s).toFixed(1); } function Y_(y){ return +(oy + y * s).toFixed(1); }
  var d = "M" + p.map(function(a){ return X_(a[0]) + " " + Y_(a[1]); }).join("L") + "Z";
  out += '<path d="' + d + '" fill="' + (o.fill || "#fde7b0") + '"/>';
  var cols = ["#ffd23f", "#22b8e6", "#19c39a", "#ff8fb1"];
  (o.rects || []).forEach(function(r, k){
    out += '<rect x="' + X_(r[0]) + '" y="' + Y_(r[1]) + '" width="' + +(r[2] * s).toFixed(1) + '" height="' + +(r[3] * s).toFixed(1) + '" fill="' + cols[k % 4] + '" fill-opacity=".5" stroke="#e07b24" stroke-width="2.5" stroke-dasharray="7 5"/>';
    if(r[4]) out += T(X_(r[0] + r[2] / 2), Y_(r[1] + r[3] / 2) + 6, r[4], 15, { b: 1, a: "middle", h: 1 });
  });
  if(o.grid) for(var gx = 0; gx < bb[0]; gx++) for(var gy = 0; gy < bb[1]; gy++) if(inside(p, gx + 0.5, gy + 0.5))
    out += '<rect x="' + X_(gx) + '" y="' + Y_(gy) + '" width="' + +s.toFixed(1) + '" height="' + +s.toFixed(1) + '" fill="none" stroke="' + INK + '" stroke-opacity=".22" stroke-width="1.5"/>';
  out += '<path d="' + d + '" fill="none" stroke="' + (o.walk ? "#e07b24" : INK) + '" stroke-width="' + (o.walk ? 5 : 3.5) + '" stroke-linejoin="round"/>';
  if(!o.nolab){
    var L = edges(p), hide = o.hide || {}, placed = [];
    /* try a few spots for each label so short steps do not pile labels on top of each other */
    p.forEach(function(a, i){
      var b = p[(i + 1) % p.length], mx = (X_(a[0]) + X_(b[0])) / 2, my = (Y_(a[1]) + Y_(b[1])) / 2, dx = b[0] - a[0], dy = b[1] - a[1], nx = dy ? (dy > 0 ? 1 : -1) : 0, ny = dx ? (dx > 0 ? -1 : 1) : 0;
      if(o.skip && o.skip.indexOf(i) >= 0) return;
      var t = hide[i] != null ? hide[i] : fm(L[i]) + " " + u, hid = hide[i] != null, w = t.length * (hid ? 10 : 8.8), len = (Math.abs(dx) + Math.abs(dy)) * s;
      /* [along, out, side]: side 1 is outside the shape, -1 is just inside it */
      var tries = nx ? [[0, 0, 1], [-len / 4, 0, 1], [len / 4, 0, 1], [0, 0, -1], [0, 18, 1]] : [[0, 0, 1], [len * 0.3, 0, 1], [-len * 0.3, 0, 1], [0, 16, 1], [0, 0, -1]], pick = null;
      tries.forEach(function(tr, k){
        if(pick) return;
        var sx = nx * tr[2], sy = ny * tr[2];
        var x = nx ? mx + sx * (10 + tr[1]) : mx + tr[0], y = nx ? my + 5 + tr[0] : my + (sy < 0 ? -9 - tr[1] : 21 + tr[1]);
        var an = sx > 0 ? "start" : sx < 0 ? "end" : "middle", x0 = sx > 0 ? x : sx < 0 ? x - w : x - w / 2, bx = [x0 - 2, y - 14, x0 + w + 2, y + 3];
        if(!placed.some(function(q){ return bx[0] < q[2] && q[0] < bx[2] && bx[1] < q[3] && q[1] < bx[3]; }) || k === tries.length - 1) pick = [x, y, bx, an];
      });
      placed.push(pick[2]);
      out += T(pick[0], pick[1], t, hid ? 16 : 14, { b: 1, a: pick[3], h: 1, c: hid ? "#1f6f8b" : INK });
    });
  }
  var hgt = oy + bb[1] * s + (o.note ? 56 : 36);
  if(o.note) out += T(260, hgt - 14, o.note, 14, { b: 1, a: "middle", c: "#1f6f8b" });
  return { svg: out, h: hgt };
}
function fig(p, o, aria){ var f = shapeFig(p, o); return pic(520, f.h, aria || "A shape made from rectangles", f.svg + ((o && o.extra) || "")); }
function twoFig(pa, pb, oa, ob){
  var ba = box(pa), bb = box(pb), s = Math.min(160 / Math.max(ba[0], bb[0]), 150 / Math.max(ba[1], bb[1]));
  function ox(o, v){ var r = { ox: v }; Object.keys(o || {}).forEach(function(k){ r[k] = o[k]; }); return r; }
  var fa = shapeFig(pa, ox(oa, 55 + (160 - ba[0] * s) / 2), [ba[0] * s, ba[1] * s]);
  var fb = shapeFig(pb, ox(ob, 305 + (160 - bb[0] * s) / 2), [bb[0] * s, bb[1] * s]);
  var h = Math.max(fa.h, fb.h) + 26;
  return pic(520, h, "Two shapes, A and B", fa.svg + fb.svg + T(135, h - 14, "A", 18, { b: 1, a: "middle" }) + T(385, h - 14, "B", 18, { b: 1, a: "middle" }));
}

/* ---------- question makers ---------- */

function rectQ(w, h, u, grid){
  var a = r6(w * h), pe = r6(2 * (w + h));
  return { q: "A rectangle " + fm(w) + " " + u + " by " + fm(h) + " " + u + "." + (grid ? " Each little square is 1 " + u + " by 1 " + u + "." : "") + " Find the area and the perimeter.",
    fig: fig(Rsh(w, h), { unit: u, grid: grid }),
    boxes: [{ label: "Area", a: a, post: u2(u) }, { label: "Perimeter", a: pe, post: " " + u }],
    slips: [[0, pe, "That is the perimeter (all the way round). Area is the space inside: length " + X.trim() + " width."], [0, r6(w + h), "Those were added. Area is length " + X.trim() + " width."],
            [1, r6(w + h), "That is only two sides. A rectangle has four: " + fm(w) + " + " + fm(h) + " + " + fm(w) + " + " + fm(h) + "."], [1, a, "That is the area. Perimeter is the distance round the edge."], [1, r6(2 * w + h), "One side is missing. Add all four."]],
    hint: "Area: multiply. Perimeter: add all four sides.",
    why: "Area " + fm(w) + X + fm(h) + " = <b>" + fm(a) + u2(u) + "</b>. Perimeter " + fm(w) + " + " + fm(h) + " + " + fm(w) + " + " + fm(h) + " = <b>" + fm(pe) + " " + u + "</b>.",
    ez: { q: "A rectangle " + fm(w) + " " + u + " by " + fm(h) + " " + u + ". Find the area and perimeter.", hint: "Area: times. Perimeter: add 4 sides.",
      slips: zs3(["That is the perimeter. Area is inside.", "That adds. Area is length " + X.trim() + " width.", "Only 2 sides. Add all 4.", "That is the area. Perimeter goes round.", "1 side is missing. Add all 4."]) } };
}
function sideA(a, s, u, grid){
  var ans = r6(a / s);
  return { q: "A rectangle has an area of " + fm(a) + u2(u) + ". One side is " + fm(s) + " " + u + ". How long is the other side?",
    fig: fig(Rsh(s, ans), { unit: u, grid: grid, hide: { 1: "?" }, skip: [2, 3] }),
    boxes: [{ label: "Other side", a: ans, post: " " + u }],
    slips: [[r6(a * s), "That multiplied. You want " + fm(s) + X + "? = " + fm(a) + ", so divide."], [r6(a - s), "That took away. Think: " + fm(s) + X + "? = " + fm(a) + "."], [r6(a / 2 - s), "That treated the area like a perimeter. Area is side " + X.trim() + " side."]],
    hint: fm(s) + X + "? = " + fm(a), why: fm(a) + " &divide; " + fm(s) + " = <b>" + fm(ans) + " " + u + "</b>. Check: " + fm(s) + X + fm(ans) + " = " + fm(a) + ".",
    ez: { q: "The area is " + fm(a) + u2(u) + ". A side is " + fm(s) + " " + u + ". Find the other side.", why: fm(a) + " &divide; " + fm(s) + " = <b>" + fm(ans) + " " + u + "</b>.",
      slips: zs2(["That multiplied. Divide instead.", "That took away. Divide instead.", "Area is not a perimeter. Divide."]) } };
}
function sideP(pe, s, u){
  var o = r6(pe / 2 - s), a = r6(o * s);
  return { q: "A rectangle has a perimeter of " + fm(pe) + " " + u + ". One side is " + fm(s) + " " + u + ". Find the other side, then the area.",
    fig: fig(Rsh(s, o), { unit: u, hide: { 1: "?" }, skip: [2, 3] }),
    boxes: [{ label: "Other side", a: o, post: " " + u }, { label: "Area", a: a, post: u2(u) }],
    slips: [[0, r6(pe - s), "The perimeter has two of each side. Take off both " + fm(s) + " m sides, then halve."], [0, r6(pe - 2 * s), "That is both of the other sides together. Halve it."], [0, r6(pe / s), "That divided. The perimeter is made by adding the sides."], [1, pe, "That is the perimeter again. Area is side " + X.trim() + " side."]],
    hint: "Half the perimeter is one long side plus one short side.",
    why: "Half of " + fm(pe) + " is " + fm(pe / 2) + ", take away " + fm(s) + ": <b>" + fm(o) + " " + u + "</b>. Area " + fm(s) + X + fm(o) + " = <b>" + fm(a) + u2(u) + "</b>." };
}
function cmp(wa, ha, wb, hb, ask, u){
  var va = ask === "area" ? r6(wa * ha) : r6(2 * (wa + ha)), vb = ask === "area" ? r6(wb * hb) : r6(2 * (wb + hb)), ans = va > vb ? 0 : vb > va ? 1 : 2, word = ask === "area" ? "the bigger area" : "the longer perimeter";
  var sl = {}, how = "A: " + (ask === "area" ? fm(wa) + X + fm(ha) : "2 " + X.trim() + " (" + fm(wa) + " + " + fm(ha) + ")") + " = " + fm(va) + ". B: " + (ask === "area" ? fm(wb) + X + fm(hb) : "2 " + X.trim() + " (" + fm(wb) + " + " + fm(hb) + ")") + " = " + fm(vb) + ".";
  [0, 1, 2].forEach(function(k){ if(k !== ans) sl[k] = (k === 2 ? "They are not quite the same. " : "Check by working it out. ") + how; });
  return { q: "Which rectangle has " + word + "?", fig: twoFig(Rsh(wa, ha), Rsh(wb, hb), { unit: u, grid: u === "cm" }, { unit: u, grid: u === "cm" }),
    options: ["A", "B", "They are the same"], answer: ans, fixed: true, slips: sl,
    hint: ask === "area" ? "Area: multiply the two sides." : "Perimeter: add all four sides.",
    why: how + (ans === 2 ? " <b>The same</b>." : " So <b>" + "AB".charAt(ans) + "</b>.") + (ask === "area" && r6(2 * (wa + ha)) === r6(2 * (wb + hb)) ? " Same perimeter, different areas: the two do not go together." : "") + (ask !== "area" && r6(wa * ha) === r6(wb * hb) ? " Same area, different perimeters." : ""),
    ez: { why: how + (ans === 2 ? " <b>The same</b>." : " So <b>" + "AB".charAt(ans) + "</b>."), slips: (function(){ var z = {}; Object.keys(sl).forEach(function(k){ z[k] = "Work them out. " + how; }); return z; })() } };
}
function squareQ(kind, n, u, grid){
  var side = kind === "side" ? n : kind === "perim" ? r6(n / 4) : r6(Math.sqrt(n)), pe = r6(4 * side), a = r6(side * side);
  if(kind === "side") return { q: "A square has sides of " + fm(n) + " " + u + ". Find its perimeter and its area.", fig: fig(Rsh(side, side), { unit: u, grid: grid }),
    boxes: [{ label: "Perimeter", a: pe, post: " " + u }, { label: "Area", a: a, post: u2(u) }],
    slips: [[0, r6(2 * side), "That is only two sides. A square has four."], [1, pe, "That is the perimeter. Area is side " + X.trim() + " side."], [1, r6(2 * side), "Area is side " + X.trim() + " side, not side + side."]],
    hint: "All four sides of a square are the same.", why: "Perimeter " + fm(side) + X + "4 = <b>" + fm(pe) + " " + u + "</b>. Area " + fm(side) + X + fm(side) + " = <b>" + fm(a) + u2(u) + "</b>.",
    ez: { hint: "All 4 sides are the same.", slips: zs3(["Only 2 sides. A square has 4.", "That is the perimeter. Area is side " + X.trim() + " side.", "Area is side " + X.trim() + " side."]) } };
  if(kind === "perim") return { q: "A square has a perimeter of " + fm(n) + " " + u + ". How long is each side, and what is the area?", fig: fig(Rsh(side, side), { unit: u, hide: { 0: "?", 1: "?", 2: "?", 3: "?" } }),
    boxes: [{ label: "Side", a: side, post: " " + u }, { label: "Area", a: a, post: u2(u) }],
    slips: [[0, r6(n / 2), "That is half the perimeter, two sides' worth. A square has four equal sides: divide by 4."], [1, r6(n * n / 4), "Find the side first (divide by 4), then side " + X.trim() + " side."], [1, n, "That is the perimeter again. Area is side " + X.trim() + " side."]],
    hint: "Four equal sides make the perimeter.", why: fm(n) + " &divide; 4 = <b>" + fm(side) + " " + u + "</b>. Area " + fm(side) + X + fm(side) + " = <b>" + fm(a) + u2(u) + "</b>." };
  return { q: "A square has an area of " + fm(n) + u2(u) + ". How long is each side, and what is the perimeter?", fig: fig(Rsh(side, side), { unit: u, hide: { 0: "?", 1: "?", 2: "?", 3: "?" } }),
    boxes: [{ label: "Side", a: side, post: " " + u }, { label: "Perimeter", a: pe, post: " " + u }],
    slips: [[0, r6(n / 2), "Halving does not undo side " + X.trim() + " side. Which number times itself makes " + fm(n) + "?"], [0, r6(n / 4), "That treated the area like a perimeter. Which number times itself makes " + fm(n) + "?"], [1, r6(2 * side), "That is two sides. Four sides make the perimeter."]],
    hint: "Which number times itself gives " + fm(n) + "?", why: fm(side) + X + fm(side) + " = " + fm(n) + ", so each side is <b>" + fm(side) + " " + u + "</b>. Perimeter " + fm(side) + X + "4 = <b>" + fm(pe) + " " + u + "</b>." };
}
/* missing lengths: hide {edge: letter}; fade gives the first one worked */
function missQ(p, hide, u, grid, fade, how){
  var L = edges(p), bb = box(p), keys = Object.keys(hide).map(Number), bx = keys.map(function(k){ return { label: "Side " + hide[k], a: L[k], post: " " + u }; }), sl = [], zm = [];
  keys.forEach(function(k, j){
    var horiz = p[k][1] === p[(k + 1) % p.length][1], full = horiz ? bb[0] : bb[1];
    if(full !== L[k]){ sl.push([j, full, "That is the whole " + (horiz ? "width" : "height") + ". Side " + hide[k] + " is only part of it: take the other parts away."]); zm.push("That is the whole " + (horiz ? "width" : "height") + ". Take the other parts away."); }
    if(r6(2 * full - L[k]) !== L[k]){ sl.push([j, r6(2 * full - L[k]), "It looks like those were added. Take the known parts away from the whole length."]); zm.push("Those were added. Take away instead."); }
  });
  return { q: "Find the missing sides." + (fade ? " Side " + hide[keys[0]] + " is done for you: " + how + ". Now have a go at side " + hide[keys[1]] + "." : " Opposite sides of the whole shape add up to the same amount."),
    fig: fig(p, { unit: u, grid: grid, hide: hide }),
    boxes: bx, slips: sl,
    hint: "Look straight across the shape. The pieces on one side add up to the whole length on the other side.",
    why: keys.map(function(k){ return "Side " + hide[k] + " = <b>" + fm(L[k]) + " " + u + "</b>"; }).join(", ") + ". Check: the pieces across the top add up to the bottom, and the pieces down one side add up to the other.",
    ez: { q: fade ? "Side " + hide[keys[0]] + " is done: " + String(how).replace(/ \(.*\)/, "") + ". Now find side " + hide[keys[1]] + "." : "Find the missing sides.",
      hint: "The pieces add up to the whole side.", why: keys.map(function(k){ return "Side " + hide[k] + " = <b>" + fm(L[k]) + " " + u + "</b>"; }).join(". ") + ".", slips: zs(sl, zm) } };
}
function mcSide(W, o, n, H, d, u){
  var p = Ush(W, H, o, n, d), a = r6(W - o - n);
  return { q: "Which sum finds side <b>a</b>?", fig: fig(p, { unit: u, hide: { 4: "a" }, skip: [3] }),
    options: [fm(W) + " &minus; " + fm(o) + " &minus; " + fm(n), fm(W) + " &minus; " + fm(o), fm(W) + " + " + fm(o) + " + " + fm(n), fm(H) + " &minus; " + fm(d)], answer: 0,
    slips: { 1: "That leaves the notch (" + fm(n) + " " + u + ") in. Take that away too.", 2: "Side a is shorter than the bottom, so take away, do not add.", 3: "Those are up and down lengths. Side a goes across." },
    hint: "Across the top: " + fm(o) + " + notch " + fm(n) + " + a = the bottom, " + fm(W) + ".",
    why: "The bottom is " + fm(W) + ". Along the top there is " + fm(o) + ", then the notch " + fm(n) + ", then a. So a = " + fm(W) + " &minus; " + fm(o) + " &minus; " + fm(n) + " = <b>" + fm(a) + " " + u + "</b>.",
    ez: { hint: "The top pieces add up to the bottom.", why: "a = " + fm(W) + " &minus; " + fm(o) + " &minus; " + fm(n) + " = <b>" + fm(a) + " " + u + "</b>.",
      slips: { 1: "Take the notch away too.", 2: "Side a is shorter. Take away.", 3: "Those go up and down. Side a goes across." } } };
}
function areaFade(W, a, o, s, b, u, grid){
  var p = Tsh(W, a, o, s, b), A1 = r6(W * a), A2 = r6(s * b), tot = r6(A1 + A2);
  return { q: "Split the T into two rectangles. The top bar is done for you: " + fm(W) + X + fm(a) + " = " + fm(A1) + u2(u) + ". Now the stem, then the total.",
    fig: fig(p, { unit: u, grid: grid, rects: [[0, 0, W, a, fm(A1)], [o, a, s, b, "?"]] }),
    boxes: [{ label: "Stem", a: A2, post: u2(u) }, { label: "Total area", a: tot, post: u2(u) }],
    slips: [[0, r6(s + b), "Those were added. Area is length " + X.trim() + " width."], [0, r6(s * (a + b)), "That stem is too tall: the top bar already covers the first " + fm(a) + " " + u + "."], [1, r6(W * (a + b)), "That is the whole outside rectangle, including the empty corners."], [1, A1, "That is only the top bar. Add the stem."], [1, perim(p), "That is the perimeter. Area is the inside."]],
    hint: "Stem: its width " + X.trim() + " its height. Then add the two areas.",
    why: "Top bar " + fm(A1) + ", stem " + fm(s) + X + fm(b) + " = " + fm(A2) + ". Total <b>" + fm(tot) + u2(u) + "</b>.",
    ez: { q: "Top bar: " + fm(W) + X + fm(a) + " = " + fm(A1) + u2(u) + ". Find the stem, then the total.", hint: "Stem: width " + X.trim() + " height. Then add.",
      slips: zs3(["That adds. Area is width " + X.trim() + " height.", "Too tall. The top bar covers some.", "That is the whole rectangle, corners too.", "That is just the top bar. Add the stem.", "That is the perimeter. Area is inside."]) } };
}
function areaU(W, H, o, n, d, u, grid){
  var p = Ush(W, H, o, n, d), ans = area(p);
  return { q: "Find the area of this U shape. Split it into rectangles, or do the big rectangle and take the notch away. Your choice.",
    fig: fig(p, { unit: u, grid: grid, skip: [] }),
    boxes: [{ label: "Area", a: ans, post: u2(u) }],
    slips: [[r6(W * H), "That is the whole rectangle with the notch still in. Take the notch (" + fm(n) + X + fm(d) + ") away."], [r6(W * H + n * d), "The notch is missing, so take it away rather than adding."], [perim(p), "That is the perimeter. Area is the space inside."], [r6(W * H - n * H), "The notch is only " + fm(d) + " " + u + " deep, not the full height."]],
    hint: "Big rectangle " + fm(W) + X + fm(H) + ", then take away the notch.",
    why: "Big rectangle " + fm(W) + X + fm(H) + " = " + fm(W * H) + ". Notch " + fm(n) + X + fm(d) + " = " + fm(n * d) + ". Area <b>" + fm(ans) + u2(u) + "</b>. Splitting gives the same answer.",
    ez: { q: "Find the area of this U shape.", hint: "Big rectangle, then take the notch away.", why: fm(W * H) + " take away " + fm(n * d) + " = <b>" + fm(ans) + u2(u) + "</b>.",
      slips: zs2(["Take the notch away.", "Take the notch away, do not add it.", "That is the perimeter. Area is inside.", "The notch is only " + fm(d) + " " + u + " deep."]) } };
}
function mcSplit(W, H, w1, h1, w2, h2, u){
  var p = Ssh(W, H, w1, h1, w2, h2), h3 = r6(H - h1 - h2), ok = fm(w1) + X + fm(h1) + " + " + fm(w1 + w2) + X + fm(h2) + " + " + fm(W) + X + fm(h3);
  return { q: "Jay split these stairs into three strips (top, middle, bottom). Which sum gives the area?",
    fig: fig(p, { unit: u, rects: [[0, 0, w1, h1, ""], [0, h1, w1 + w2, h2, ""], [0, h1 + h2, W, h3, ""]] }),
    options: [ok, fm(W) + X + fm(H), fm(w1) + X + fm(h1) + " + " + fm(w2) + X + fm(h2) + " + " + fm(r6(W - w1 - w2)) + X + fm(h3), fm(w1) + " + " + fm(h1) + " + " + fm(w1 + w2) + " + " + fm(h2) + " + " + fm(W) + " + " + fm(h3)], answer: 0,
    slips: { 1: "That is the whole outside rectangle, empty steps included.", 2: "Each strip goes all the way to the left edge, so the middle strip is " + fm(w1 + w2) + " wide and the bottom one is " + fm(W) + " wide.", 3: "That adds lengths. Each strip needs width " + X.trim() + " height." },
    hint: "Each strip is a rectangle that starts at the left edge.",
    why: ok + " = " + fm(w1 * h1) + " + " + fm((w1 + w2) * h2) + " + " + fm(W * h3) + " = <b>" + fm(area(p)) + u2(u) + "</b>.",
    ez: { q: "Jay split the stairs into 3 strips. Which sum gives the area?", hint: "Each strip starts at the left edge.",
      slips: { 1: "That is the whole rectangle, empty steps too.", 2: "Each strip goes to the left edge.", 3: "That adds lengths. Use width " + X.trim() + " height." } } };
}
function floorQ(p, u, price, grid, note){
  var a = area(p), c = r6(a * price), bb = box(p);
  return { q: "Here is the floor plan of [[place]]. Carpet costs &pound;" + mo(price) + " per " + (u === "cm" ? "square" : "m" + SQ) + ". Find the floor area, then the cost.",
    fig: fig(p, { unit: u, grid: grid, note: note }),
    boxes: [{ label: "Area", a: a, post: u2(u) }, { label: "Cost", a: c, pre: "&pound;", show: mo(c) }],
    slips: [[0, r6(bb[0] * bb[1]), "That is the whole outer rectangle. Some of it is not floor."], [0, perim(p), "That is the perimeter. Carpet covers the area."], [1, r6(bb[0] * bb[1] * price), "That cost includes floor that is not there."], [1, r6(a + price), "Multiply the area by the price."]],
    hint: "Split it into rectangles, find each area, add, then multiply by the price.",
    why: "Area <b>" + fm(a) + u2(u) + "</b>. " + fm(a) + X + "&pound;" + mo(price) + " = <b>&pound;" + mo(c) + "</b>.",
    ez: { q: "Carpet is &pound;" + mo(price) + " per " + (u === "cm" ? "square" : "m" + SQ) + ". Find the area, then the cost.", hint: "Find the area. Then times by the price.",
      slips: zs3(["That is the whole rectangle. Some is not floor.", "That is the perimeter. Carpet covers the area.", "That cost has floor that is not there.", "Times the area by the price."]) } };
}
function perimQ(p, hide, u, grid, fade, how){
  var L = edges(p), keys = Object.keys(hide).map(Number), pe = perim(p), bb = box(p), shown = r6(pe - keys.reduce(function(a, k){ return a + L[k]; }, 0));
  var bx = (fade ? keys : []).map(function(k){ return { label: "Side " + hide[k], a: L[k], post: " " + u }; }).concat([{ label: "Perimeter", a: pe, post: " " + u }]), last = bx.length - 1;
  var sl = [[last, shown, "Nearly. Add the sides you had to work out, too."], [last, area(p), "That is the area. Perimeter is the distance round the edge."]];
  var zm = ["Nearly. Add the sides you worked out too.", "That is the area. Perimeter goes round."];
  if(r6(2 * (bb[0] + bb[1])) !== pe){ sl.push([last, r6(2 * (bb[0] + bb[1])), "That is the outer rectangle. The notch has edges inside it that count too."]); zm.push("That is the outer rectangle. Count the notch edges."); }
  return { q: (fade ? "Walk round the edge. Side " + hide[keys[0]] + " is done for you: " + how + ". Find side " + hide[keys[1]] + ", then the perimeter." : "Find the perimeter. Work out any missing sides first."),
    fig: fig(p, { unit: u, grid: grid, hide: hide, walk: true }),
    boxes: bx, slips: sl,
    hint: "Start at a corner and add every side as you go round, including the ones inside notches.",
    why: "All the sides: " + L.map(fm).join(" + ") + " = <b>" + fm(pe) + " " + u + "</b>.",
    ez: { q: fade ? "Side " + hide[keys[0]] + " is done: " + how + ". Find side " + hide[keys[1]] + ", then the perimeter." : "Find the perimeter.",
      hint: "Start at a corner. Add every side.", slips: zs(sl, zm) } };
}
function edgeQ(p, u, price){
  var pe = perim(p), c = r6(pe * price);
  return { q: "[[Trim]] is going all the way round the edge of [[place]]. It costs &pound;" + mo(price) + " per metre. How much is needed, and the cost?",
    fig: fig(p, { unit: u, walk: true }),
    boxes: [{ label: "Length", a: pe, post: " " + u }, { label: "Cost", a: c, pre: "&pound;", show: mo(c) }],
    slips: [[0, area(p), "That is the area. Trim goes round the edge."], [0, r6(2 * (box(p)[0] + box(p)[1])), "That is the outer rectangle. Include the edges that go into the notch."], [1, r6(area(p) * price), "That cost used the area. Use the length round the edge."]],
    hint: "Add every edge, then multiply by the price per metre.",
    why: edges(p).map(fm).join(" + ") + " = " + fm(pe) + " " + u + ". " + fm(pe) + X + "&pound;" + mo(price) + " = <b>&pound;" + mo(c) + "</b>.",
    ez: { q: "[[Trim]] goes round the edge. It is &pound;" + mo(price) + " a metre. How much, and the cost?", hint: "Add every edge. Then times by the price.",
      slips: zs3(["That is the area. Trim goes round.", "That is the outer rectangle. Count the notch edges.", "That cost used the area. Use the edge."]) } };
}
function cmpShape(pa, pb, u, grid){
  var a = perim(pa), b = perim(pb), ans = a > b ? 0 : b > a ? 1 : 2, how = "A: " + fm(a) + " " + u + ". B: " + fm(b) + " " + u + ".", sl = {};
  [0, 1, 2].forEach(function(k){ if(k !== ans) sl[k] = (ans === 2 ? "Walk round both. " : k === 2 ? "Walk round both: they differ. " : "Walk round both. ") + how; });
  return { q: "Which shape has the longer <b>perimeter</b>?", fig: twoFig(pa, pb, { unit: u, grid: grid }, { unit: u, grid: grid }),
    options: ["A", "B", "They are the same"], answer: ans, fixed: true, slips: sl,
    hint: "Cutting a piece off a corner moves edges without changing their total. Cutting into the middle of a side adds new edges.",
    why: how + (ans === 2 ? " <b>The same</b>, even though the areas are different." : " So <b>" + "AB".charAt(ans) + "</b>."),
    ez: { hint: "Walk round each one. Add the sides.", why: how + (ans === 2 ? " <b>The same</b>." : " So <b>" + "AB".charAt(ans) + "</b>.") } };
}

var LEARN2 = fig(Ush(10, 6, 3, 4, 2), { hide: { 4: "a", 7: "b" }, note: "Across: 3 + 4 + a = 10, so a = 3. Down: b = 6." });

(window.A2PACKS = window.A2PACKS || {})["core-rectangle-rooms"] = {
  a2: true,
  id: "a2-core-rectangle-rooms",
  title: "Rectangle rooms",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 25,
  line: "Area and perimeter of rectangles, and of rooms built from rectangles.",
  blurb: "Rooms shaped like T, U and stairs, all made from rectangles. Four short chunks: one rectangle, missing lengths, splitting into rectangles, and walking round the edge. You design your own room at the end. New shapes every time you come back.",
  note: "Area and perimeter for rooms made of rectangles. Four five minute chunks and a room to design at the end. The shapes change each go, so have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Box room", line: "Box room: small shapes on squared paper, count or multiply." },
    { id: "medium", name: "Apartment", line: "Apartment: T, U and stair shaped rooms with whole metres." },
    { id: "spicy", name: "Mansion", line: "Mansion: decimal lengths, take away methods and perimeter shortcuts." }
  ],
  themes: {
    time: { name: "Time travel", w: { place: "the portal hall", trim: "glow strip" } },
    football: { name: "Football", w: { place: "the clubhouse", trim: "team colour tape" } },
    horror: { name: "Horror", w: { place: "the crypt", trim: "warning tape" } },
    fishing: { name: "Fishing", w: { place: "the boathouse", trim: "rope edging" } },
    music: { name: "Music", w: { place: "the stage", trim: "LED strip" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: fig(Tsh(10, 3, 3, 4, 5), { rects: [[0, 0, 10, 3, "30"], [3, 3, 4, 5, "20"]], note: "Two rectangles: 30 + 20 = 50 m&#178;" }),
  steps: [

    /* ---------- chunk 1: one rectangle ---------- */
    { type: "learn", topic: "One rectangle", title: "Inside and around",
      ez: { title: "Area and perimeter", html: "<p><b>Area</b>: the squares inside. 5 &times; 3 = <b>15</b>.</p><p><b>Perimeter</b>: round the edge. 5 + 3 + 5 + 3 = <b>16 cm</b>.</p>" },
      fig: fig(Rsh(6, 4), { grid: true, unit: "m", note: "Area: 24 squares inside. Perimeter: 6 + 4 + 6 + 4 = 20 m.",
        extra: A.egg(A.bird(470, 36, 0.55, "#19c39a"), "A green finch landed on the room plan. It walked the perimeter, 20 m, and then had a lie down.") }),
      html: "<p><b>Area</b> is the space inside, measured in squares (m&sup2;). For a rectangle, length &times; width: 6 &times; 4 = <b>24 m&sup2;</b>.</p>" +
        "<p><b>Perimeter</b> is the distance all the way round, measured in metres. Add all four sides: 6 + 4 + 6 + 4 = <b>20 m</b>.</p>" +
        "<p>Every room in this activity is built from rectangles, so these two ideas do all the work.</p>",
      lv: { mild: { fig: fig(Rsh(5, 3), { grid: true, unit: "cm", note: "15 squares inside. 5 + 3 + 5 + 3 = 16 cm round." }),
        html: "<p><b>Area</b> is how many squares are inside. Count them, or do 5 &times; 3 = <b>15 squares</b> (15 cm&sup2;).</p><p><b>Perimeter</b> is the distance round the edge: 5 + 3 + 5 + 3 = <b>16 cm</b>.</p>" } } },

    G("num", "One rectangle", [
      [rectQ(8, 5, "m"), rectQ(5, 3, "cm", true), rectQ(6.4, 3.5, "m")],
      [rectQ(7, 3, "m"), rectQ(4, 4, "cm", true), rectQ(7.2, 4.5, "m")],
      [rectQ(9, 6, "m"), rectQ(6, 2, "cm", true), rectQ(5.6, 2.8, "m")]
    ]),

    G("num", "One rectangle", [
      [sideA(36, 4, "m"), sideA(12, 3, "cm", true), sideP(26, 8, "m")],
      [sideA(42, 6, "m"), sideA(10, 2, "cm", true), sideP(30, 9.5, "m")],
      [sideA(48, 8, "m"), sideA(8, 4, "cm", true), sideP(17, 4.5, "m")]
    ]),

    G("mc", "One rectangle", [
      [cmp(6, 4, 8, 3, "perim", "m"), cmp(4, 3, 5, 2, "area", "cm"), cmp(7, 5, 9, 3, "area", "m")],
      [cmp(5, 4, 10, 2, "perim", "m"), cmp(3, 3, 4, 2, "area", "cm"), cmp(6, 6, 9, 4, "area", "m")],
      [cmp(9, 2, 6, 3, "perim", "m"), cmp(6, 1, 3, 3, "area", "cm"), cmp(4.5, 4, 6, 3, "area", "m")]
    ]),

    G("num", "One rectangle", [
      [squareQ("perim", 28, "m"), squareQ("side", 4, "cm", true), squareQ("area", 64, "m")],
      [squareQ("perim", 36, "m"), squareQ("side", 3, "cm", true), squareQ("area", 2.25, "m")],
      [squareQ("perim", 44, "m"), squareQ("side", 5, "cm", true), squareQ("area", 0.49, "m")]
    ]),

    /* ---------- chunk 2: missing lengths ---------- */
    { type: "learn", topic: "Missing lengths", title: "Across one side equals across the other",
      ez: { title: "Missing sides", html: "<p>Count the squares along the edge.</p><p>Or take away: 6 &minus; 2 &minus; 2 = <b>2 cm</b>.</p>" },
      fig: LEARN2,
      html: "<p>Plans often leave some sides off. You can always find them, because the shape is made of rectangles.</p>" +
        "<p><b>Across:</b> the pieces along the top add up to the whole bottom. 3 + 4 + <b>a</b> = 10, so a = 10 &minus; 3 &minus; 4 = <b>3 m</b>.</p>" +
        "<p><b>Down:</b> the pieces down one side add up to the whole other side. Here the left side <b>b</b> matches the right side: <b>6 m</b>.</p>",
      lv: { mild: { fig: fig(Ssh(6, 5, 2, 2, 2, 1), { grid: true, unit: "cm", hide: { 4: "a" }, note: "Count the squares: a = 2 cm" }),
        html: "<p>Some sides are missing their numbers. On squared paper you can count the squares along the edge.</p><p>Or use the other side: the bottom is 6, and the top pieces are 2 and 2, so the last piece is 6 &minus; 2 &minus; 2 = <b>2 cm</b>.</p>" } } },

    G("num", "Missing lengths", [
      [missQ(Ssh(9, 7, 3, 2, 3, 2), { 4: "a", 5: "b" }, "m", false, true, "a = 9 &minus; 3 &minus; 3 = 3 m"),
       missQ(Ssh(6, 5, 2, 1, 2, 2), { 4: "a", 5: "b" }, "cm", true, true, "a = 6 &minus; 2 &minus; 2 = 2 cm (count the squares to check)"),
       missQ(Ssh(8.4, 6.5, 2.5, 1.8, 3.2, 2.1), { 4: "a", 5: "b" }, "m", false, true, "a = 8.4 &minus; 2.5 &minus; 3.2 = 2.7 m")],
      [missQ(Ssh(12, 8, 4, 3, 5, 2), { 4: "a", 5: "b" }, "m", false, true, "a = 12 &minus; 4 &minus; 5 = 3 m"),
       missQ(Ssh(7, 5, 3, 1, 2, 1), { 4: "a", 5: "b" }, "cm", true, true, "a = 7 &minus; 3 &minus; 2 = 2 cm (count the squares to check)"),
       missQ(Ssh(9.6, 7.2, 3.4, 2.5, 2.8, 1.9), { 4: "a", 5: "b" }, "m", false, true, "a = 9.6 &minus; 3.4 &minus; 2.8 = 3.4 m")],
      [missQ(Ssh(10, 9, 2, 4, 3, 2), { 4: "a", 5: "b" }, "m", false, true, "a = 10 &minus; 2 &minus; 3 = 5 m"),
       missQ(Ssh(8, 6, 2, 2, 3, 2), { 4: "a", 5: "b" }, "cm", true, true, "a = 8 &minus; 2 &minus; 3 = 3 cm (count the squares to check)"),
       missQ(Ssh(7.5, 6.4, 1.6, 2.2, 2.7, 1.5), { 4: "a", 5: "b" }, "m", false, true, "a = 7.5 &minus; 1.6 &minus; 2.7 = 3.2 m")]
    ]),

    G("num", "Missing lengths", [
      [missQ(Tsh(12, 3, 4, 5, 6), { 2: "a", 7: "b" }, "m"), missQ(Tsh(6, 2, 2, 2, 3), { 2: "a", 7: "b" }, "cm", true), missQ(Tsh(10.5, 2.4, 3.6, 3.2, 4.5), { 2: "a", 7: "b" }, "m")],
      [missQ(Tsh(11, 4, 3, 4, 5), { 2: "a", 7: "b" }, "m"), missQ(Tsh(7, 2, 2, 3, 2), { 2: "a", 7: "b" }, "cm", true), missQ(Tsh(9.8, 3.1, 2.7, 2.9, 3.6), { 2: "a", 7: "b" }, "m")],
      [missQ(Tsh(14, 3, 5, 6, 7), { 2: "a", 7: "b" }, "m"), missQ(Tsh(5, 1, 1, 2, 3), { 2: "a", 7: "b" }, "cm", true), missQ(Tsh(12.4, 2.6, 4.1, 3.5, 5.2), { 2: "a", 7: "b" }, "m")]
    ]),

    G("mc", "Missing lengths", [
      [mcSide(12, 4, 3, 7, 2, "m"), mcSide(8, 2, 3, 5, 2, "cm"), mcSide(11.5, 3.8, 2.6, 6.4, 1.9, "m")],
      [mcSide(10, 3, 4, 6, 3, "m"), mcSide(7, 2, 2, 4, 2, "cm"), mcSide(9.4, 2.7, 3.5, 5.8, 2.2, "m")],
      [mcSide(14, 5, 4, 8, 3, "m"), mcSide(9, 3, 3, 5, 1, "cm"), mcSide(13.2, 4.5, 3.9, 7.5, 2.6, "m")]
    ]),

    G("num", "Missing lengths", [
      [missQ(Ush(11, 7, 3, 5, 3), { 4: "a", 7: "b" }, "m"), missQ(Ush(7, 4, 2, 3, 2), { 4: "a", 7: "b" }, "cm", true), missQ(Ush(12.6, 7.5, 3.4, 4.8, 2.9), { 4: "a", 7: "b" }, "m")],
      [missQ(Ush(13, 8, 4, 4, 5), { 4: "a", 7: "b" }, "m"), missQ(Ush(6, 5, 1, 3, 2), { 4: "a", 7: "b" }, "cm", true), missQ(Ush(10.4, 6.8, 2.6, 5.1, 3.3), { 4: "a", 7: "b" }, "m")],
      [missQ(Ush(9, 6, 2, 4, 2), { 4: "a", 7: "b" }, "m"), missQ(Ush(8, 4, 3, 2, 3), { 4: "a", 7: "b" }, "cm", true), missQ(Ush(14.2, 8.4, 4.4, 3.7, 4.6), { 4: "a", 7: "b" }, "m")]
    ]),

    /* ---------- chunk 3: split it up ---------- */
    { type: "learn", topic: "Split it up", title: "Split into rectangles, then add",
      ez: { title: "Split it up", html: "<p><b>Split</b> into rectangles. Then <b>add</b>.</p><p>12 + 6 = <b>18 squares</b>.</p>" },
      fig: fig(Tsh(10, 3, 3, 4, 5), { rects: [[0, 0, 10, 3, "10 x 3 = 30"], [3, 3, 4, 5, "4 x 5 = 20"]], note: "30 + 20 = 50 m&#178;" }),
      html: "<p>To find the area of a shape made from rectangles, <b>split it</b> into rectangles, find each area, and <b>add</b>.</p>" +
        "<p>The T: top bar 10 &times; 3 = 30, stem 4 &times; 5 = 20. Area <b>50 m&sup2;</b>.</p>" +
        "<p>Another way: draw the big rectangle around it and <b>take away</b> the empty bits. Both ways give the same answer, so pick the one with fewer sums.</p>",
      lv: { mild: { fig: fig(Tsh(6, 2, 2, 2, 3), { grid: true, unit: "cm", rects: [[0, 0, 6, 2, "12"], [2, 2, 2, 3, "6"]], note: "12 + 6 = 18 squares" }),
        html: "<p>Split the shape into rectangles. Count or multiply each one, then add.</p><p>Top: 6 &times; 2 = 12 squares. Stem: 2 &times; 3 = 6 squares. Total <b>18 squares</b> (18 cm&sup2;).</p>" } } },

    G("num", "Split it up", [
      [areaFade(12, 3, 4, 4, 5, "m"), areaFade(6, 2, 2, 2, 3, "cm", true), areaFade(10.5, 2.4, 3.6, 3.2, 4.5, "m")],
      [areaFade(9, 2, 3, 3, 6, "m"), areaFade(5, 2, 1, 3, 2, "cm", true), areaFade(8.6, 1.5, 2.4, 3.8, 3.5, "m")],
      [areaFade(14, 4, 5, 4, 6, "m"), areaFade(7, 1, 2, 3, 3, "cm", true), areaFade(11.2, 2.5, 4.2, 2.8, 5.5, "m")]
    ]),

    G("num", "Split it up", [
      [areaU(11, 7, 3, 5, 3, "m"), areaU(6, 4, 2, 2, 2, "cm", true), areaU(12.6, 7.5, 3.4, 4.8, 2.9, "m")],
      [areaU(13, 8, 4, 4, 5, "m"), areaU(7, 3, 2, 3, 1, "cm", true), areaU(10.4, 6.8, 2.6, 5.1, 3.3, "m")],
      [areaU(9, 6, 2, 4, 2, "m"), areaU(5, 5, 1, 3, 3, "cm", true), areaU(14.2, 8.4, 4.4, 3.7, 4.6, "m")]
    ]),

    G("mc", "Split it up", [
      [mcSplit(9, 7, 3, 2, 3, 2, "m"), mcSplit(6, 5, 2, 1, 2, 2, "cm"), mcSplit(8.4, 6.5, 2.5, 1.8, 3.2, 2.1, "m")],
      [mcSplit(12, 8, 4, 3, 5, 2, "m"), mcSplit(7, 5, 3, 1, 2, 1, "cm"), mcSplit(9.6, 7.2, 3.4, 2.5, 2.8, 1.9, "m")],
      [mcSplit(10, 9, 2, 4, 3, 2, "m"), mcSplit(8, 6, 2, 2, 3, 2, "cm"), mcSplit(7.5, 6.4, 1.6, 2.2, 2.7, 1.5, "m")]
    ]),

    G("num", "Split it up", [
      [floorQ(Ush(10, 6, 3, 4, 2), "m", 12), floorQ(Tsh(5, 2, 1, 3, 2), "cm", 2, true, "Each square is one carpet tile"), floorQ(Ssh(9.5, 6.2, 3.5, 1.8, 2.5, 2.4), "m", 18.5)],
      [floorQ(Tsh(11, 3, 4, 3, 5), "m", 15), floorQ(Ush(6, 4, 2, 2, 1), "cm", 3, true, "Each square is one carpet tile"), floorQ(Ush(11.4, 6.5, 3.2, 4.4, 2.5), "m", 22.4)],
      [floorQ(Ssh(10, 8, 3, 2, 4, 3), "m", 9), floorQ(Ssh(6, 4, 2, 1, 2, 1), "cm", 4, true, "Each square is one carpet tile"), floorQ(Tsh(12.5, 3.2, 4.5, 3.6, 4.8), "m", 16.75)]
    ], { explain: true }),

    /* ---------- chunk 4: round the edge ---------- */
    { type: "learn", topic: "Round the edge", title: "Walk all the way round",
      ez: { title: "Walk round", html: "<p>Walk round the edge. <b>Add</b> every side.</p><p>The edges inside the gap count too.</p>" },
      fig: fig(Ush(10, 6, 3, 4, 2), { walk: true, note: "3 + 2 + 4 + 2 + 3 + 6 + 10 + 6 = 36 m" }),
      html: "<p>Perimeter: start at a corner and walk round, adding every side. Find any missing sides first.</p>" +
        "<p>The U: 3 + 2 + 4 + 2 + 3 + 6 + 10 + 6 = <b>36 m</b>. Do not forget the edges <b>inside</b> the notch: they are part of the walk.</p>" +
        "<p>A shortcut for later: for L, T and stair shapes, the perimeter is the same as the rectangle around them. A notch cut into the middle of a side adds its two inside edges.</p>",
      lv: { mild: { fig: fig(Ush(6, 4, 2, 2, 2), { grid: true, unit: "cm", walk: true, note: "2 + 2 + 2 + 2 + 2 + 4 + 6 + 4 = 24 cm" }),
        html: "<p>Perimeter: walk round the edge and add every side. Count the squares along each edge if you like.</p><p>2 + 2 + 2 + 2 + 2 + 4 + 6 + 4 = <b>24 cm</b>. The edges inside the gap count too.</p>" } } },

    G("num", "Round the edge", [
      [perimQ(Ssh(9, 7, 3, 2, 3, 2), { 4: "a", 5: "b" }, "m", false, true, "a = 9 &minus; 3 &minus; 3 = 3 m"),
       perimQ(Ssh(6, 5, 2, 1, 2, 2), { 4: "a", 5: "b" }, "cm", true, true, "a = 6 &minus; 2 &minus; 2 = 2 cm"),
       perimQ(Ush(12.6, 7.5, 3.4, 4.8, 2.9), { 4: "a", 3: "b" }, "m", false, true, "a = 12.6 &minus; 3.4 &minus; 4.8 = 4.4 m")],
      [perimQ(Ssh(12, 8, 4, 3, 5, 2), { 4: "a", 5: "b" }, "m", false, true, "a = 12 &minus; 4 &minus; 5 = 3 m"),
       perimQ(Ssh(7, 5, 3, 1, 2, 1), { 4: "a", 5: "b" }, "cm", true, true, "a = 7 &minus; 3 &minus; 2 = 2 cm"),
       perimQ(Ush(10.4, 6.8, 2.6, 5.1, 3.3), { 4: "a", 3: "b" }, "m", false, true, "a = 10.4 &minus; 2.6 &minus; 5.1 = 2.7 m")],
      [perimQ(Ssh(10, 9, 2, 4, 3, 2), { 4: "a", 5: "b" }, "m", false, true, "a = 10 &minus; 2 &minus; 3 = 5 m"),
       perimQ(Ssh(8, 6, 2, 2, 3, 2), { 4: "a", 5: "b" }, "cm", true, true, "a = 8 &minus; 2 &minus; 3 = 3 cm"),
       perimQ(Ush(14.2, 8.4, 4.4, 3.7, 4.6), { 4: "a", 3: "b" }, "m", false, true, "a = 14.2 &minus; 4.4 &minus; 3.7 = 6.1 m")]
    ]),

    G("num", "Round the edge", [
      [perimQ(Tsh(12, 3, 4, 5, 6), { 2: "a", 7: "b" }, "m"), perimQ(Tsh(6, 2, 2, 2, 3), {}, "cm", true), perimQ(Ush(11.5, 6.4, 3.8, 2.6, 1.9), { 4: "a", 7: "b" }, "m")],
      [perimQ(Tsh(11, 4, 3, 4, 5), { 2: "a", 7: "b" }, "m"), perimQ(Tsh(5, 2, 1, 3, 2), {}, "cm", true), perimQ(Ush(9.4, 5.8, 2.7, 3.5, 2.2), { 4: "a", 7: "b" }, "m")],
      [perimQ(Tsh(14, 3, 5, 6, 7), { 2: "a", 7: "b" }, "m"), perimQ(Tsh(7, 1, 2, 3, 3), {}, "cm", true), perimQ(Ush(13.2, 7.5, 4.5, 3.9, 2.6), { 4: "a", 7: "b" }, "m")]
    ]),

    G("num", "Round the edge", [
      [edgeQ(Ush(10, 6, 3, 4, 2), "m", 2.5), edgeQ(Rsh(5, 3), "m", 2), edgeQ(Ush(12.6, 7.5, 3.4, 4.8, 2.9), "m", 3.45)],
      [edgeQ(Tsh(11, 3, 4, 3, 5), "m", 3), edgeQ(Rsh(6, 4), "m", 3), edgeQ(Tsh(10.5, 2.4, 3.6, 3.2, 4.5), "m", 4.2)],
      [edgeQ(Ush(9, 6, 2, 4, 2), "m", 4), edgeQ(Rsh(4, 4), "m", 5), edgeQ(Ush(14.2, 8.4, 4.4, 3.7, 4.6), "m", 2.85)]
    ], { explain: true }),

    G("mc", "Round the edge", [
      [cmpShape(Rsh(8, 5), Ush(8, 5, 3, 2, 2), "m"), cmpShape(Rsh(5, 2), Rsh(4, 3), "cm", true), cmpShape(Rsh(7.5, 4.8), Ssh(7.5, 4.8, 2.5, 1.6, 2.5, 1.6), "m")],
      [cmpShape(Ush(9, 6, 3, 3, 3), Rsh(9, 6), "m"), cmpShape(Rsh(6, 1), Rsh(3, 3), "cm", true), cmpShape(Ush(8.4, 5.7, 2.9, 2.6, 2.2), Rsh(8.4, 5.7), "m")],
      [cmpShape(Rsh(10, 4), Ush(10, 4, 4, 2, 3), "m"), cmpShape(Rsh(4, 2), Rsh(3, 3), "cm", true), cmpShape(Ssh(9.2, 6.5, 3.1, 2.4, 2.8, 1.7), Rsh(9.2, 6.5), "m")]
    ])
  ],

  ez: {
    realWorld: { title: "Floor plans", html: "<p>House adverts show the area of each room.</p><p>Castles and Roman villas had floor plans too.</p>" },
    make: { intro: "Design a room. The card works out the area and perimeter." }
  },

  realWorld: {
    title: "Floor plans are everywhere",
    html: "<p>Estate agents print the area of every room on house adverts, flooring shops need it to price a job, and architects check perimeters for walls, skirting and fences. Almost every real room is a rectangle, or a few rectangles stuck together.</p>" +
      "<p>For our big question: if we could time travel, which rooms would you want to see? Castles, Roman villas and old palaces all had floor plans like these, drawn out long before anyone had a tape measure like ours.</p>",
    fig: pic(420, 150, "Jay holding a floor plan, with Bonnie", A.jay(100, 50, 0.85, "smile") +
      '<g transform="translate(170 70) rotate(-4)"><rect width="120" height="74" fill="#ffffff" stroke="' + INK + '" stroke-width="2"/><path d="M14 14h60v20h32v30h-92z" fill="#fde7b0" stroke="' + INK + '" stroke-width="2"/></g>' +
      A.bonnie(350, 102, 0.6, "sit") + A.bubble(210, 8, 140, 50, "When I was in\nChina...", 228))
  },

  make: {
    title: "Design your own room",
    intro: "Pick a size, and a corner to cut out if you like. The card draws it and works out the area and perimeter. Save it, stick it up, or send it to Jay.",
    fields: [
      { id: "name", label: "Room name", ph: "Bonnie's den", max: 24 },
      { id: "len", label: "Length (m)", ph: "8", max: 5 },
      { id: "wid", label: "Width (m)", ph: "5", max: 5 },
      { id: "cw", label: "Corner cut: across (m)", ph: "3", max: 5 },
      { id: "ch", label: "Corner cut: down (m)", ph: "2", max: 5 }
    ],
    svg: function(v){
      function num(x, d){ var n = parseFloat(x); return n >= 0 && n < 1000 ? n : d; }
      var W = num(v.len, 8) || 8, H = num(v.wid, 5) || 5, cw = num(v.cw, 0), ch = num(v.ch, 0);
      if(cw >= W || ch >= H || !cw || !ch){ cw = 0; ch = 0; }
      var p = cw ? [[0, 0], [W - cw, 0], [W - cw, ch], [W, ch], [W, H], [0, H]] : Rsh(W, H), s = Math.min(260 / W, 210 / H), x0 = 40 + (260 - W * s) / 2, y0 = 110 + (210 - H * s) / 2;
      var d = "M" + p.map(function(a){ return (x0 + a[0] * s).toFixed(1) + " " + (y0 + a[1] * s).toFixed(1); }).join("L") + "Z";
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#eef6ee"/>' +
        fit(40, 60, v.name, 28, 470, { b: 1, c: "#141a33" }) +
        '<text x="40" y="86" ' + F + ' font-size="13" fill="#1f7a4d" letter-spacing="2">FLOOR PLAN</text>' +
        '<path d="' + d + '" fill="#fde7b0" stroke="#141a33" stroke-width="5" stroke-linejoin="round"/>' +
        '<text x="' + (x0 + W * s / 2) + '" y="' + (y0 + H * s + 22) + '" text-anchor="middle" ' + F + ' font-size="14" font-weight="700" fill="#141a33">' + fm(W) + ' m</text>' +
        '<text x="' + (x0 - 8) + '" y="' + (y0 + H * s / 2 + 5) + '" text-anchor="end" ' + F + ' font-size="14" font-weight="700" fill="#141a33">' + fm(H) + ' m</text>' +
        '<text x="340" y="160" ' + F + ' font-size="13" fill="#1f7a4d" letter-spacing="2">AREA</text>' +
        '<text x="340" y="192" ' + F + ' font-size="28" font-weight="700" fill="#141a33">' + fm(area(p)) + ' m&#178;</text>' +
        '<text x="340" y="240" ' + F + ' font-size="13" fill="#1f7a4d" letter-spacing="2">PERIMETER</text>' +
        '<text x="340" y="272" ' + F + ' font-size="28" font-weight="700" fill="#141a33">' + fm(perim(p)) + ' m</text>' +
        A.bonnie(520, 330, 0.7, "sit") +
        '</svg>';
    }
  }
};
})();
