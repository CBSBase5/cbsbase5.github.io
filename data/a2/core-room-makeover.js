/* Base 5 core target activity: Room makeover.
   Maths. Real life area, perimeter and cost: flooring, skirting,
   paint, tiles and packs, fencing and best value. Replayable: every
   question carries two extra versions (vary). ASCII only. */
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
function fa(x){ var r = Math.round(x * 100) / 100; return r === r6(x) ? fm(x) : fm(r) + "..."; }
function up(x){ return Math.ceil(r6(x) - 1e-9); }
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function fit(x, y, t, size, w, o){ var s = esc(t), est = s.length * size * 0.72; return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + size + '"' + (o.b ? ' font-weight="700"' : '') + (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + o.c + '"' + (est > w ? ' textLength="' + w + '" lengthAdjust="spacingAndGlyphs"' : '') + '>' + s + '</text>'; }
var X = " &times; ", M2 = " m&sup2;", P = "&pound;", SM2 = " m&#178;";

/* drop any slip that would fire on a right answer (numbers can coincide) */
function clean(o){
  if(o.boxes && Array.isArray(o.slips)) o.slips = o.slips.filter(function(r){ var b = r.length === 3 ? r[0] : 0; return !(o.boxes[b] && Math.abs(r[r.length - 2] - o.boxes[b].a) < 1e-9); });
  return o;
}
/* easy read (LC): shorter wrong answer messages, matched from the full ones */
var ZS = [
  [/^That is the perimeter, the edge\..*/, "That is the edge. Area is length &times; width."],
  [/^Those two were added\..*/, "That added. Area is length &times; width."],
  [/^That cost used the perimeter\..*/, "Use the area for the cost."],
  [/^The price is for each m&sup2;.*/, "Multiply the area by the price."],
  [/^That is only two of the walls\..*/, "That is 2 walls. Add all 4."],
  [/^That is the area\. Skirting runs round the edge\.$/, "That is the area. Skirting goes round the edge."],
  [/^That multiplied\. Share the total.*/, "That multiplied. Divide instead."],
  [/^That leaves you short of skirting\..*/, "Too short. Round up."],
  [/^Shops sell whole lengths only\..*/, "Whole lengths only. Round up."],
  [/^Cost the whole lengths you buy.*/, "Cost the whole lengths you buy."],
  [/^Those were added\. Area is length.*/, "That added. Area is length &times; height."],
  [/^That is the distance round the edge of the wall\..*/, "That is the edge. Area is length &times; height."],
  [/^That would run out before the end\..*/, "Too few. Round up to a whole tin."],
  [/^That is enough for one coat\..*/, "That is 1 coat. 2 coats is double."],
  [/^That would run out\. Round up.*/, "Too few. Round up."],
  [/^That multiplied\. Area = length.*/, "That multiplied. Divide the area by the length."],
  [/^That added the rows\..*/, "That added. Multiply instead."],
  [/^The last tile.*/, "Cut tiles still count. Round up."],
  [/^That divided metres by centimetres\. (Change \S+ m into \S+ cm first).*/, "$1."],
  [/^That multiplied\. You are fitting tiles.*/, "That multiplied. Divide instead."],
  [/^That leaves you short of tiles\..*/, "Too few. Round up."],
  [/^You can only buy whole packs\..*/, "Whole packs only. Round up."],
  [/^Round up, or there will be a gap.*/, "Round up, or there is a gap."],
  [/^That is the area of the run\..*/, "That is the area. A fence goes round the edge."],
  [/^That is two sides\..*/, "That is 2 sides. Add all 4."],
  [/^That leaves a gap Bonnie.*/, "Bonnie could squeeze through! Round up."],
  [/^(.+) works out at (\S+) (each|per m&sup2;)\. (.+?) is .*cheaper\.$/, "$1 is $2 $3. $4 is cheaper."],
  [/^That is the whole rectangle.*/, "That includes the missing corner. Take it off."]
];
function zmsg(m){ if(typeof m !== "string") return m; for(var i = 0; i < ZS.length; i++) if(ZS[i][0].test(m)) return m.replace(ZS[i][0], ZS[i][1]); return m; }
function ezSlips(o){
  if(!o.ez || !o.slips) return;
  var any = false;
  if(Array.isArray(o.slips)){
    var z = o.slips.map(function(r){ var m = zmsg(r[r.length - 1]); if(m === r[r.length - 1]) return null; any = true; return r.map(function(x, j){ return j === r.length - 1 ? m : null; }); });
    if(any) o.ez.slips = z;
  } else {
    var zo = {};
    Object.keys(o.slips).forEach(function(k){ var m = zmsg(o.slips[k]); if(m !== o.slips[k]){ zo[k] = m; any = true; } });
    if(any) o.ez.slips = zo;
  }
}
function noez(x){ var o = {}; Object.keys(x).forEach(function(k){ if(k !== "ez") o[k] = x[k]; }); return o; }
function G(type, topic, sets, extra){
  sets.forEach(function(v){ v.forEach(clean); v.forEach(ezSlips); });
  /* ez comes from the first level's version only (v[1]); medium and spicy carry none */
  function one(v){ var o = noez(v[0]); o.lv = { mild: noez(v[1]), spicy: noez(v[2]) }; if(v[1].ez) o.ez = v[1].ez; return o; }
  var s = { type: type, topic: topic }, b = one(sets[0]);
  Object.keys(b).forEach(function(k){ s[k] = b[k]; });
  if(sets.length > 1) s.vary = sets.slice(1).map(one);
  Object.keys(extra || {}).forEach(function(k){ s[k] = extra[k]; });
  return s;
}

/* ---------- pictures ---------- */

/* a rectangular room from above: o.area shades the floor, o.grid draws metre squares,
   o.perim draws the edge in orange, o.door leaves a gap on the bottom wall */
function roomFig(l, w, o){
  o = o || {};
  var s = Math.min(330 / l, 150 / w), W = l * s, H = w * s, x0 = (520 - W) / 2, y0 = 44 + (160 - H) / 2, out = "";
  out += '<rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + H + '" fill="' + (o.area ? "#fde7b0" : "#ffffff") + '"/>';
  if(o.grid && l === Math.round(l) && w === Math.round(w)) for(var i = 0; i < l; i++) for(var j = 0; j < w; j++)
    out += '<rect x="' + (x0 + i * s) + '" y="' + (y0 + j * s) + '" width="' + s + '" height="' + s + '" fill="none" stroke="' + INK + '" stroke-opacity=".22" stroke-width="1.5"/>';
  out += '<rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + H + '" fill="none" stroke="' + (o.perim ? "#f08a24" : INK) + '" stroke-width="' + (o.perim ? 7 : 3.5) + '"/>';
  if(o.door){
    var dw = o.door * s, dx = x0 + W * 0.62;
    out += '<rect x="' + dx + '" y="' + (y0 + H - 6) + '" width="' + dw + '" height="12" fill="#f4f1ea"/>' +
      '<path d="M' + dx + ' ' + (y0 + H) + 'a' + dw + ' ' + dw + ' 0 0 1 ' + dw + ' ' + (-dw) + '" fill="none" stroke="' + INK + '" stroke-width="1.5" stroke-dasharray="4 3"/>' +
      '<path d="M' + (dx + dw) + ' ' + (y0 + H) + 'v' + (-dw) + '" stroke="#8a5a36" stroke-width="3"/>' +
      T(dx + dw / 2, y0 + H + 22, "door " + fm(o.door) + " m", 13, { b: 1, a: "middle", c: "#8a5a36" });
  }
  out += T(x0 + W / 2, y0 - 10, fm(l) + " m", 15, { b: 1, a: "middle" }) + T(x0 - 10, y0 + H / 2 + 5, fm(w) + " m", 15, { b: 1, a: "end" });
  if(o.inside) out += T(x0 + W / 2, y0 + H / 2 + 6, o.inside, 16, { b: 1, a: "middle", h: 1 });
  if(o.note) out += T(260, 252, o.note, 14, { b: 1, a: "middle", c: "#1f6f8b" });
  return pic(520, o.note ? 268 : 245, "A room " + fm(l) + " m by " + fm(w) + " m", out + (o.extra || ""));
}

/* the walls unrolled into one long strip; holes: [[name, width, height, wall]] */
function wallsFig(walls, h, holes, note){
  var tot = walls.reduce(function(a, b){ return a + b; }, 0), s = Math.min(420 / tot, 110 / h), x0 = 70 + (420 - tot * s) / 2, y0 = 58, out = "", x = x0;
  walls.forEach(function(wl, k){
    out += '<rect x="' + x + '" y="' + y0 + '" width="' + wl * s + '" height="' + h * s + '" fill="' + ["#cfe8f5", "#e3f4ea", "#cfe8f5", "#e3f4ea"][k % 4] + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      T(x + wl * s / 2, y0 + h * s + 20, fm(wl) + " m", 14, { b: 1, a: "middle" });
    (holes || []).forEach(function(hh){
      if(hh[3] !== k) return;
      var hw = hh[1] * s, ht = hh[2] * s, hx = x + (wl * s - hw) / 2, door = /door/i.test(hh[0]), hy = door ? y0 + h * s - ht : y0 + 12;
      out += '<rect x="' + hx + '" y="' + hy + '" width="' + hw + '" height="' + ht + '" fill="' + (door ? "#a87650" : "#ffffff") + '" stroke="' + INK + '" stroke-width="2"/>';
      if(!door) out += '<path d="M' + (hx + hw / 2) + ' ' + hy + 'v' + ht + 'M' + hx + ' ' + (hy + ht / 2) + 'h' + hw + '" stroke="' + INK + '" stroke-width="1.5"/>';
    });
    x += wl * s;
  });
  out += T(x0 - 8, y0 + h * s / 2 + 5, fm(h) + " m", 14, { b: 1, a: "end" });
  out += T(260, 36, walls.length > 1 ? "All the walls, unrolled into one long strip" : "One wall", 14, { b: 1, a: "middle" });
  if(note) out += T(260, y0 + h * s + 48, note, 14, { b: 1, a: "middle", c: "#1f6f8b" });
  return pic(520, y0 + h * s + (note ? 66 : 40), "The walls of a room unrolled into a strip, height " + fm(h) + " m", out);
}

/* square tiles on a floor, cut at the far edges */
function tilesFig(l, w, cm, note){
  var t = cm / 100, s = Math.min(360 / l, 150 / w), x0 = (520 - l * s) / 2, y0 = 40, out = "";
  for(var i = 0; i * t < l - 1e-9; i++) for(var j = 0; j * t < w - 1e-9; j++){
    var tw = Math.min(t, l - i * t) * s, th = Math.min(t, w - j * t) * s, cut = tw < t * s - 0.5 || th < t * s - 0.5;
    out += '<rect x="' + (x0 + i * t * s) + '" y="' + (y0 + j * t * s) + '" width="' + tw + '" height="' + th + '" fill="' + (cut ? "#ffd9b3" : ((i + j) % 2 ? "#8fd3c7" : "#c4ebe3")) + '" stroke="#ffffff" stroke-width="1.5"/>';
  }
  out += '<rect x="' + x0 + '" y="' + y0 + '" width="' + l * s + '" height="' + w * s + '" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
    T(x0 + l * s / 2, y0 + w * s + 22, fm(l) + " m", 15, { b: 1, a: "middle" }) + T(x0 - 10, y0 + w * s / 2 + 5, fm(w) + " m", 15, { b: 1, a: "end" });
  return pic(520, y0 + w * s + 62, "Square tiles " + cm + " cm wide covering a floor " + fm(l) + " m by " + fm(w) + " m", out + T(260, y0 + w * s + 48, note || ("Each tile is " + (cm === 100 ? "1 m" : cm + " cm") + " across"), 14, { b: 1, a: "middle", c: "#1f6f8b" }));
}

/* Bonnie's dog run with fence panels */
function fenceFig(l, w, gate, panel, egg){
  var s = Math.min(330 / l, 140 / w), W = l * s, H = w * s, x0 = (520 - W) / 2, y0 = 44, out = "";
  out += '<rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + H + '" fill="#bfe3a5"/>';
  var gx = x0 + W * 0.4, gw = gate * s;
  [[x0, y0, x0 + W, y0], [x0 + W, y0, x0 + W, y0 + H], [x0 + W, y0 + H, x0, y0 + H], [x0, y0 + H, x0, y0]].forEach(function(e){
    out += '<path d="M' + e[0] + ' ' + e[1] + 'L' + e[2] + ' ' + e[3] + '" stroke="#8a5a36" stroke-width="6"/>';
    var len = Math.sqrt(Math.pow(e[2] - e[0], 2) + Math.pow(e[3] - e[1], 2)), n = Math.floor(len / (panel * s));
    for(var k = 0; k <= n; k++){ var f = k * panel * s / len; out += '<circle cx="' + (e[0] + (e[2] - e[0]) * f) + '" cy="' + (e[1] + (e[3] - e[1]) * f) + '" r="4.5" fill="#5a341c"/>'; }
  });
  if(gate) out += '<rect x="' + gx + '" y="' + (y0 + H - 7) + '" width="' + gw + '" height="14" fill="#f4f1ea"/>' + T(gx + gw / 2, y0 + H + 22, "gate " + fm(gate) + " m", 13, { b: 1, a: "middle", c: "#8a5a36" });
  out += T(x0 + W / 2, y0 - 10, fm(l) + " m", 15, { b: 1, a: "middle" }) + T(x0 - 10, y0 + H / 2 + 5, fm(w) + " m", 15, { b: 1, a: "end" });
  var bon = A.bonnie(x0 + W * 0.25, y0 + H / 2, 0.5, "stand");
  out += egg ? A.egg(bon, "Bonnie inspected the new fence and approved it. She does not have a tail to wag, so she wiggled instead.") : bon;
  return pic(520, y0 + H + 56, "A dog run " + fm(l) + " m by " + fm(w) + " m with fence panels", out + T(260, y0 + H + 44, "Fence panels are " + fm(panel) + " m wide", 13, { a: "middle" }));
}

/* packs side by side for best value */
function valueFig(offers, unit){
  var n = offers.length, bw = 140, gap = 22, x0 = (520 - n * bw - (n - 1) * gap) / 2, out = "";
  offers.forEach(function(o, k){
    var x = x0 + k * (bw + gap);
    out += '<rect x="' + x + '" y="24" width="' + bw + '" height="150" rx="12" fill="' + ["#ffd23f", "#22b8e6", "#19c39a"][k] + '" fill-opacity=".35" stroke="' + INK + '" stroke-width="2"/>' +
      T(x + bw / 2, 52, o[0], 16, { b: 1, a: "middle" }) + T(x + bw / 2, 96, "&#163;" + mo(o[1]), 22, { b: 1, a: "middle" }) +
      T(x + bw / 2, 132, (unit === "m2" ? "covers " + fm(o[2]) + " m&#178;" : o[2] + " for the price"), 13, { a: "middle" });
  });
  return pic(520, 196, "Packs to compare for value", out);
}

/* an L shaped room: W by H with a cw by ch corner missing at the top right */
function LFig(W, H, cw, ch, o){
  o = o || {};
  var s = Math.min(320 / W, 160 / H), x0 = (520 - W * s) / 2, y0 = 40;
  function Xx(x){ return +(x0 + x * s).toFixed(1); } function Yy(y){ return +(y0 + y * s).toFixed(1); }
  var path = "M" + Xx(0) + " " + Yy(0) + "H" + Xx(W - cw) + "V" + Yy(ch) + "H" + Xx(W) + "V" + Yy(H) + "H" + Xx(0) + "Z", out = "";
  out += '<path d="' + path + '" fill="#fde7b0" stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round"/>';
  if(o.split) out += '<path d="M' + Xx(W - cw) + ' ' + Yy(ch) + 'V' + Yy(H) + '" stroke="#e07b24" stroke-width="3" stroke-dasharray="8 6"/>';
  function lab(v, hide){ return hide ? "?" : fm(v) + " m"; }
  var hid = o.hide || {};
  out += T((Xx(0) + Xx(W - cw)) / 2, Yy(0) - 10, lab(W - cw), 14, { b: 1, a: "middle" }) +
    T(Xx(W - cw) - 8, (Yy(0) + Yy(ch)) / 2 + 5, lab(ch, hid.ch), 14, { b: 1, a: "end", c: hid.ch ? "#1f6f8b" : INK }) +
    T((Xx(W - cw) + Xx(W)) / 2, Yy(ch) - 10, lab(cw, hid.cw), 14, { b: 1, a: "middle", c: hid.cw ? "#1f6f8b" : INK }) +
    T(Xx(W) + 8, (Yy(ch) + Yy(H)) / 2 + 5, lab(H - ch), 14, { b: 1 }) +
    T((Xx(0) + Xx(W)) / 2, Yy(H) + 22, lab(W), 14, { b: 1, a: "middle" }) +
    T(Xx(0) - 8, (Yy(0) + Yy(H)) / 2 + 5, lab(H), 14, { b: 1, a: "end" });
  return pic(520, Yy(H) + 44, "An L shaped room", out);
}

/* a single wall with a missing height */
function wallFig(l, area){
  var s = Math.min(300 / l, 120 / (area / l)), H = (area / l) * s, x0 = (520 - l * s) / 2;
  return pic(520, 210, "A wall " + fm(l) + " m long with an area of " + fm(area) + " square metres",
    '<rect x="' + x0 + '" y="36" width="' + l * s + '" height="' + H + '" fill="#cfe8f5" stroke="' + INK + '" stroke-width="3"/>' +
    T(260, 42 + H / 2, fm(area) + SM2, 20, { b: 1, a: "middle" }) + T(260, 60 + H, fm(l) + " m", 15, { b: 1, a: "middle" }) + T(x0 - 10, 42 + H / 2, "?", 22, { b: 1, a: "end", c: "#1f6f8b" }));
}

var LEARN1 = roomFig(5, 4, { area: true, grid: true, perim: true, door: 0.9, inside: "Area 20" + SM2, note: "Inside: area. Orange edge: perimeter, 18 m.",
  extra: A.egg(A.bird(486, 40, 0.5, "#3a8fd6"), "A blue tit flew in to check the measurements. Jay would like it known that he did not leave the window open.") });

/* ---------- question makers ---------- */

function sortQ(cards){ return { q: "Sort the jobs. Do you need the <b>area</b> (the inside) or the <b>perimeter</b> (the edge)?", cards: cards,
  ez: { q: "Sort them. <b>Area</b> is the inside. <b>Perimeter</b> is the edge.", hint: "Cover it, or go round it?", why: "Covering needs <b>area</b>. Going round needs <b>perimeter</b>." },
  hint: "Does it cover the whole surface, or go round the outside?",
  why: "Covering a surface (carpet, paint, tiles, turf) needs the area. Going round the edge (skirting, fences, trims, lights) needs the perimeter." }; }
function floorCost(l, w, p){
  var a = r6(l * w), pe = r6(2 * (l + w)), c = r6(a * p);
  return { q: "[[Boss]] wants new flooring in [[room]], which is " + fm(l) + " m by " + fm(w) + " m. Flooring costs " + P + mo(p) + " per m&sup2;. Area first, then the cost.",
    ez: { q: "Floor: " + fm(l) + " m by " + fm(w) + " m. " + P + mo(p) + " per m&sup2;.<br>Area first. Then the cost.", hint: "Length" + X + "width. Then" + X + "the price." },
    fig: roomFig(l, w, { area: true, grid: l * w <= 40 }),
    boxes: [{ label: "Area", a: a, post: M2 }, { label: "Cost", a: c, pre: P, show: mo(c) }],
    slips: [[0, pe, "That is the perimeter, the edge. Flooring covers the inside: length " + X.trim() + " width."], [0, r6(l + w), "Those two were added. Area is length " + X.trim() + " width."],
            [1, r6(pe * p), "That cost used the perimeter. Flooring is priced on the area."], [1, r6(a + p), "The price is for each m&sup2;, so multiply the area by the price."]],
    hint: "Area = length " + X.trim() + " width. Then area " + X.trim() + " price.",
    why: fm(l) + X + fm(w) + " = " + fm(a) + M2 + ". Then " + fm(a) + X + P + mo(p) + " = <b>" + P + mo(c) + "</b>." };
}
function skirt(l, w, door){
  var pe = r6(2 * (l + w)), ans = r6(pe - door), sl = [[r6(l + w), "That is only two of the walls. Go all the way round: there are four."], [r6(l * w), "That is the area. Skirting runs round the edge."]];
  if(door){ sl.push([pe, "Nearly. Skirting does not go across the doorway, so take the " + fm(door) + " m off."]); sl.push([r6(pe + door), "Take the doorway away, rather than adding it."]); }
  return { q: "Skirting board runs round the bottom of the walls in [[room]] (" + fm(l) + " m by " + fm(w) + " m)" + (door ? ", but not across the doorway, which is " + fm(door) + " m wide." : ", all the way round.") + " How many metres of skirting?",
    ez: { q: "Skirting goes round [[room]]: " + fm(l) + " m by " + fm(w) + " m." + (door ? " Skip the " + fm(door) + " m door." : "") + "<br>How many metres?", hint: "Add all 4 sides" + (door ? ". Take off the door." : ".") },
    fig: roomFig(l, w, { perim: true, door: door }),
    boxes: [{ label: "Skirting", a: ans, post: " m" }], slips: sl,
    hint: "Add all four sides" + (door ? ", then take off the door." : "."),
    why: fm(l) + " + " + fm(w) + " + " + fm(l) + " + " + fm(w) + " = " + fm(pe) + " m" + (door ? ", take away the " + fm(door) + " m door: <b>" + fm(ans) + " m</b>." : ". So <b>" + fm(ans) + " m</b>.") };
}
function lengths(total, each, price){
  var n = up(total / each), raw = r6(total / each), sl = [[r6(total * each), "That multiplied. Share the total into " + fm(each) + " m lengths: divide."]];
  if(Math.floor(raw) !== n) sl.push([Math.floor(raw), "That leaves you short of skirting. Round up: part of a length still means buying a whole one."]);
  if(raw !== n) sl.push([raw, "Shops sell whole lengths only. Round up to the next whole number."]);
  var bx = [{ label: "Lengths", a: n }];
  if(price){ bx.push({ label: "Cost", a: r6(n * price), pre: P, show: mo(n * price) }); sl.push([1, r6(raw * price), "Cost the whole lengths you buy (" + n + "), not the part answer."]); }
  return { q: "You need " + fm(total) + " m of skirting. It is sold in " + fm(each) + " m lengths" + (price ? " at " + P + mo(price) + " each" : "") + ". How many lengths do you buy" + (price ? ", and what does it cost?" : "?"),
    ez: { q: "You need " + fm(total) + " m of skirting. It comes in " + fm(each) + " m lengths" + (price ? ", " + P + mo(price) + " each" : "") + ".<br>How many lengths" + (price ? "? What cost?" : "?") },
    boxes: bx, slips: sl, hint: "Divide, then round up.",
    why: fm(total) + " &divide; " + fm(each) + " = " + fa(raw) + (raw !== n ? ", which rounds <b>up</b> to <b>" + n + "</b> lengths." : ", so <b>" + n + "</b> lengths.") + (price ? " " + n + X + P + mo(price) + " = <b>" + P + mo(n * price) + "</b>." : "") };
}
function walls(l, w, h, holes){
  var pe = r6(2 * (l + w)), wa = r6(pe * h), off = r6(holes.reduce(function(a, x){ return a + x[1] * x[2]; }, 0)), ans = r6(wa - off);
  var desc = holes.map(function(x){ return "a " + x[0] + " " + fm(x[1]) + " m by " + fm(x[2]) + " m"; }).join(" and ");
  return { q: "[[Room]] is " + fm(l) + " m by " + fm(w) + " m, and the walls are " + fm(h) + " m high. There is " + desc + (holes.length > 1 ? ", which do not" : ", which does not") + " get painted. Have a go, one step at a time.",
    fig: wallsFig([l, w, l, w], h, holes.map(function(x, k){ return [x[0], x[1], x[2], k ? 1 : 0]; })),
    boxes: [{ label: "Distance round the room", a: pe, post: " m" }, { label: "Wall area", a: wa, post: M2 }, { label: "Area to paint", a: ans, post: M2 }],
    slips: [[0, r6(l + w), "That is only two walls. Go all the way round."], [1, r6(l * w), "That is the floor area. Walls are the distance round " + X.trim() + " the height."], [1, r6(l * w * h), "That is the space inside the room (the volume). Paint goes on the walls."],
            [2, wa, "Nearly. Take off the " + holes.map(function(x){ return x[0]; }).join(" and ") + "."], [2, r6(wa + off), "Take the " + holes.map(function(x){ return x[0]; }).join(" and ") + " away rather than adding them."]],
    hint: "Unroll the walls: one long strip, the distance round the room long and " + fm(h) + " m high.",
    why: "Round the room: " + fm(pe) + " m. Strip: " + fm(pe) + X + fm(h) + " = " + fm(wa) + M2 + ". Take off " + holes.map(function(x){ return fm(x[1]) + X + fm(x[2]); }).join(" and ") + " = " + fm(off) + M2 + ": <b>" + fm(ans) + M2 + "</b>." };
}
function wallOne(l, h, hole){
  var wa = r6(l * h), off = r6(hole[1] * hole[2]), ans = r6(wa - off);
  return { q: "One wall in [[room]] is " + fm(l) + " m long and " + fm(h) + " m high. It has a " + hole[0] + " " + fm(hole[1]) + " m by " + fm(hole[2]) + " m, which does not get painted.",
    ez: { q: "A wall: " + fm(l) + " m long, " + fm(h) + " m high.<br>Do not paint the " + hole[0] + ": " + fm(hole[1]) + " m by " + fm(hole[2]) + " m.", hint: "Length" + X + "height. Take off the " + hole[0] + "." },
    fig: wallsFig([l], h, [[hole[0], hole[1], hole[2], 0]]),
    boxes: [{ label: "Whole wall", a: wa, post: M2 }, { label: "Area to paint", a: ans, post: M2 }],
    slips: [[0, r6(l + h), "Those were added. Area is length " + X.trim() + " height."], [0, r6(2 * (l + h)), "That is the distance round the edge of the wall. Area is length " + X.trim() + " height."], [1, wa, "Nearly. Take off the " + hole[0] + "."]],
    hint: "Length " + X.trim() + " height, then take off the " + hole[0] + ".",
    why: fm(l) + X + fm(h) + " = " + fm(wa) + M2 + ". The " + hole[0] + " is " + fm(off) + M2 + ", so <b>" + fm(ans) + M2 + "</b> to paint." };
}
function mcTins(area, coats, cover){
  var need = r6(area * coats / cover), n = up(need), opts = [String(n)], sl = {};
  function add(v, why){ v = String(v); if(opts.indexOf(v) < 0){ sl[opts.length] = why; opts.push(v); } }
  add(Math.floor(need), "That would run out before the end. A bit more paint means a whole extra tin.");
  add(fm(need), "Shops sell whole tins. Round up.");
  if(coats > 1) add(up(area / cover), "That is enough for one coat. Two coats means double the paint.");
  return { q: "You need to paint " + fm(area) + M2 + (coats > 1 ? ", with <b>two coats</b>" : "") + ". One tin covers " + fm(cover) + M2 + ". How many tins do you buy?",
    ez: { q: "Paint " + fm(area) + M2 + (coats > 1 ? ", <b>2 coats</b>" : "") + ". 1 tin covers " + fm(cover) + M2 + ".<br>How many tins?", hint: (coats > 1 ? "Double it. " : "") + "Divide. Then round up.", why: fm(area * coats) + " &divide; " + fm(cover) + " = " + fa(need) + ". So <b>" + n + " tins</b>." },
    options: opts, answer: 0, slips: sl,
    hint: (coats > 1 ? "Double the area for two coats. " : "") + "Divide by what one tin covers. Then round up.",
    why: (coats > 1 ? fm(area) + X + "2 = " + fm(area * 2) + M2 + ". " : "") + fm(area * coats) + " &divide; " + fm(cover) + " = " + fa(need) + ", so <b>" + n + " tins</b>. Rounding down would leave a patch unpainted." };
}
function tinsCost(area, coats, cover, price){
  var need = r6(area * coats / cover), n = up(need), c = r6(n * price), sl = [];
  if(Math.floor(need) !== n) sl.push([0, Math.floor(need), "That would run out. Round up to the next whole tin."]);
  if(need !== n) sl.push([0, need, "Shops sell whole tins. Round up."]);
  if(coats > 1 && up(area / cover) !== n) sl.push([0, up(area / cover), "That only covers one coat."]);
  if(r6(need * price) !== c) sl.push([1, r6(need * price), "Cost the whole tins you buy (" + n + ")."]);
  return { q: "Paint " + fm(area) + M2 + (coats > 1 ? ", two coats" : ", one coat") + ". A tin covers " + fm(cover) + M2 + " and costs " + P + mo(price) + ". How many tins, and what is the cost?",
    ez: { q: "Paint " + fm(area) + M2 + (coats > 1 ? ", 2 coats" : "") + ". 1 tin covers " + fm(cover) + M2 + ". It costs " + P + mo(price) + ".<br>How many tins? What cost?", hint: (coats > 1 ? "Double it. " : "") + "Divide. Round up. Then" + X + "the price." },
    boxes: [{ label: "Tins", a: n }, { label: "Cost", a: c, pre: P, show: mo(c) }], slips: sl,
    hint: "Area" + (coats > 1 ? " " + X.trim() + " 2 coats" : "") + ", divide by the cover, round up, then times the price.",
    why: fm(area * coats) + " &divide; " + fm(cover) + " = " + fa(need) + ", rounds up to " + n + " tins. " + n + X + P + mo(price) + " = <b>" + P + mo(c) + "</b>." };
}
function missingSide(area, l){
  var ans = r6(area / l);
  return { q: "A wall in [[room]] is " + fm(l) + " m long. Its area is " + fm(area) + M2 + ". How high is it?",
    ez: { q: "A wall is " + fm(l) + " m long. Its area is " + fm(area) + M2 + ".<br>How high is it?", hint: "Area &divide; length." },
    fig: wallFig(l, area),
    boxes: [{ label: "Height", a: ans, post: " m" }],
    slips: [[r6(area * l), "That multiplied. Area = length " + X.trim() + " height, so the height is area &divide; length."], [r6(area - l), "That took away. Think: " + fm(l) + X + "? = " + fm(area) + "."]],
    hint: fm(l) + X + "? = " + fm(area) + ". Divide to undo the times.",
    why: fm(area) + " &divide; " + fm(l) + " = <b>" + fm(ans) + " m</b>. Check: " + fm(l) + X + fm(ans) + " = " + fm(area) + "." };
}
function tiles(l, w, cm){
  var t = cm / 100, nl = up(l / t), nw = up(w / t), sl = [[0, r6(l / cm), "Change the tile into metres first: " + cm + " cm = " + fm(t) + " m."], [2, nl + nw, "That added the rows. Rows " + X.trim() + " columns gives the total."]];
  if(Math.floor(r6(l / t)) !== nl) sl.push([0, Math.floor(r6(l / t)), "The last tile in the row gets cut to fit, but you still need it. Round up."]);
  if(Math.floor(r6(w / t)) !== nw) sl.push([1, Math.floor(r6(w / t)), "The last tile gets cut to fit, but you still need it. Round up."]);
  return { q: "Tiles " + (cm === 100 ? "1 m (100 cm)" : cm + " cm") + " square, on a floor " + fm(l) + " m by " + fm(w) + " m. How many along each side, and how many altogether?",
    ez: { q: (cm === 100 ? "1 m" : cm + " cm") + " tiles. Floor " + fm(l) + " m by " + fm(w) + " m.<br>How many each way? How many in all?", hint: "Count along each side. Then multiply." },
    fig: tilesFig(l, w, cm, cm < 100 && (Math.floor(r6(l / t)) !== nl || Math.floor(r6(w / t)) !== nw) ? "Orange tiles get cut to fit, but you still buy them" : ""),
    boxes: [{ label: "Along " + fm(l) + " m", a: nl }, { label: "Along " + fm(w) + " m", a: nw }, { label: "Tiles altogether", a: nl * nw }], slips: sl,
    hint: "How many " + fm(t) + " m tiles fit along " + fm(l) + " m? Then along " + fm(w) + " m. Then multiply.",
    why: fm(l) + " &divide; " + fm(t) + " = " + fa(l / t) + (nl !== r6(l / t) ? " (round up to " + nl + ")" : "") + ", " + fm(w) + " &divide; " + fm(t) + " = " + fa(w / t) + (nw !== r6(w / t) ? " (round up to " + nw + ")" : "") + ". " + nl + X + nw + " = <b>" + (nl * nw) + " tiles</b>." };
}
function packsQ(n, extra, per, price){
  var need = extra ? up(n * (1 + extra / 100)) : n, pk = up(need / per), c = r6(pk * price), bx = [], sl = [], o = extra ? 1 : 0;
  if(extra){ bx.push({ label: "Tiles with extra", a: need }); sl.push([0, n + extra, "That added " + extra + " tiles. You need " + extra + "% more: " + fm(n * extra / 100) + " extra tiles."]); sl.push([0, r6(n * extra / 100), "That is just the extra bit. Add it on to " + n + "."]); }
  bx.push({ label: "Packs", a: pk }); bx.push({ label: "Cost", a: c, pre: P, show: mo(c) });
  if(Math.floor(need / per) !== pk) sl.push([o, Math.floor(need / per), "That leaves you short of tiles. Round up to a whole pack."]);
  if(r6(need / per) !== pk) sl.push([o, r6(need / per), "You can only buy whole packs. Round up."]);
  if(r6(need / per * price) !== c) sl.push([o + 1, r6(need / per * price), "Cost the whole packs you buy (" + pk + ")."]);
  return { q: "You need " + n + " tiles" + (extra ? ", plus <b>" + extra + "% extra</b> in case some break when you cut them" : "") + ". Tiles come in packs of " + per + " at " + P + mo(price) + " a pack. " + (extra ? "How many tiles, how many packs, and the cost?" : "How many packs, and the cost?"),
    ez: { q: "You need " + n + " tiles" + (extra ? ", plus " + extra + "% extra" : "") + ". A pack of " + per + " costs " + P + mo(price) + ".<br>" + (extra ? "How many tiles? Packs? Cost?" : "How many packs? What cost?"), hint: "Divide by " + per + ". Round up. Then" + X + "the price." },
    boxes: bx, slips: sl, hint: (extra ? "Find " + extra + "% of " + n + " and add it on (round up to a whole tile). " : "") + "Divide by " + per + ", round up, then times the price.",
    why: (extra ? extra + "% of " + n + " is " + fm(n * extra / 100) + ", so " + need + " tiles. " : "") + need + " &divide; " + per + " = " + fa(need / per) + ", so <b>" + pk + " packs</b>. " + pk + X + P + mo(price) + " = <b>" + P + mo(c) + "</b>." };
}
function mcConv(l, cm){
  var ans = r6(l * 100 / cm), opts = [ans, r6(l / cm), r6(l * cm)].map(fm);
  return { q: "Each tile is " + cm + " cm long" + (cm === 50 ? " (half a metre)" : "") + ". How many fit in a row " + fm(l) + " m long?", options: opts, answer: 0,
    ez: { q: "Tiles are " + cm + " cm long. How many fit in " + fm(l) + " m?" },
    slips: { 1: "That divided metres by centimetres. Change " + fm(l) + " m into " + (l * 100) + " cm first (or " + cm + " cm into " + fm(cm / 100) + " m).", 2: "That multiplied. You are fitting tiles into a length, so divide." },
    hint: fm(l) + " m is " + (l * 100) + " cm.", why: fm(l) + " m = " + (l * 100) + " cm, and " + (l * 100) + " &divide; " + cm + " = <b>" + fm(ans) + "</b>." };
}
function mcCover(cm){
  var per = r6(100 / cm), ans = r6(per * per), opts = [ans, per, r6(Math.pow(cm / 100, 2)), cm * cm].map(fm);
  return { q: "Tiles are " + cm + " cm square. How many tiles cover <b>1 m&sup2;</b>?", options: opts, answer: 0,
    slips: { 1: "That is how many fit along one side of the square metre. It is a square, so there are that many rows too.", 2: "That is the area of one tile in m&sup2;. How many of those make 1?", 3: "That is the area of one tile in cm&sup2;." },
    hint: "How many fit along 1 m? A square metre has that many rows of that many.", why: fm(per) + " tiles fit along 1 m, so " + fm(per) + X + fm(per) + " = <b>" + fm(ans) + "</b> tiles cover 1 m&sup2;." };
}
function packCover(l, w, per, cm){
  var a = r6(l * w), ta = r6(Math.pow(cm / 100, 2)), pa = r6(per * ta), pk = up(a / pa), sl = [[0, r6(2 * (l + w)), "That is the perimeter. You need the floor area."]];
  if(r6(per * cm / 100) !== pa) sl.push([1, r6(per * cm / 100), "That is how long " + per + " tiles are in a row. Each tile covers " + fm(cm / 100) + X + fm(cm / 100) + " = " + fm(ta) + M2 + "."]);
  if(Math.floor(r6(a / pa)) !== pk) sl.push([2, Math.floor(r6(a / pa)), "Round up, or there will be a gap in the floor."]);
  if(r6(a / pa) !== pk) sl.push([2, r6(a / pa), "Whole packs only. Round up."]);
  return { q: "[[Room]] is " + fm(l) + " m by " + fm(w) + " m. A pack has " + per + " tiles, each " + cm + " cm square. Find the floor area, what one pack covers, then the packs to buy.",
    ez: { q: "Floor " + fm(l) + " m by " + fm(w) + " m. A pack has " + per + " tiles, each " + (cm === 100 ? "1 m" : cm + " cm") + " square.<br>Fill in each box." },
    boxes: [{ label: "Floor area", a: a, post: M2 }, { label: "One pack covers", a: pa, post: M2 }, { label: "Packs", a: pk }], slips: sl,
    hint: "One tile covers " + fm(cm / 100) + X + fm(cm / 100) + " m&sup2;.",
    why: "Floor " + fm(a) + M2 + ". One tile " + fm(ta) + M2 + ", so a pack covers " + per + X + fm(ta) + " = " + fm(pa) + M2 + ". " + fm(a) + " &divide; " + fm(pa) + " = " + fa(a / pa) + ", so <b>" + pk + " packs</b>." };
}
function fence(l, w, gate, panel, price){
  var pe = r6(2 * (l + w)), len = r6(pe - gate), n = up(len / panel), bx = [{ label: "Length of fence", a: len, post: " m" }, { label: "Panels", a: n }], sl = [[0, r6(l * w), "That is the area of the run. A fence goes round the edge."], [0, r6(l + w), "That is two sides. Go all the way round."]];
  if(gate) sl.push([0, pe, "Nearly. The gate is not fence, so take it off."]);
  if(Math.floor(r6(len / panel)) !== n) sl.push([1, Math.floor(r6(len / panel)), "That leaves a gap Bonnie could squeeze through. Round up."]);
  if(price){ bx.push({ label: "Cost", a: r6(n * price), pre: P, show: mo(n * price) }); if(r6(len / panel * price) !== r6(n * price)) sl.push([2, r6(len / panel * price), "Cost the whole panels you buy (" + n + ")."]); }
  return { q: "Jay is fencing a dog run for Bonnie, " + fm(l) + " m by " + fm(w) + " m" + (gate ? ", leaving a " + fm(gate) + " m gap for a gate" : "") + ". Panels are " + fm(panel) + " m wide" + (price ? " and cost " + P + mo(price) + " each" : "") + ". How long is the fence, and how many panels" + (price ? ", and the cost?" : "?"),
    ez: { q: "Bonnie's dog run: " + fm(l) + " m by " + fm(w) + " m." + (gate ? " Leave a " + fm(gate) + " m gate." : "") + " Panels are " + fm(panel) + " m.<br>How long is the fence? How many panels?" + (price ? " What cost?" : ""), hint: "Add the 4 sides" + (gate ? ", take off the gate" : "") + ". Divide by " + fm(panel) + "." + (Math.floor(r6(len / panel)) !== n ? " Round up." : "") },
    fig: fenceFig(l, w, gate, panel),
    boxes: bx, slips: sl, hint: "Perimeter" + (gate ? ", take off the gate" : "") + ", divide by the panel width, round up.",
    why: "Round the edge: " + fm(pe) + " m" + (gate ? ", take off " + fm(gate) + " m for the gate: " + fm(len) + " m" : "") + ". " + fm(len) + " &divide; " + fm(panel) + " = " + fa(len / panel) + ", so <b>" + n + " panels</b>." + (price ? " " + n + X + P + mo(price) + " = <b>" + P + mo(n * price) + "</b>." : "") };
}
function bestVal(offers, unit){
  var per = offers.map(function(o){ return r6(o[1] / o[2]); }), best = per.indexOf(Math.min.apply(null, per)), sl = {}, u = unit === "m2" ? " per m&sup2;" : " each";
  offers.forEach(function(o, k){ if(k !== best) sl[k] = o[0] + " works out at " + P + mo(per[k]) + u + ". " + offers[best][0] + " is " + P + mo(per[best]) + u + ", which is cheaper."; });
  return { q: "Which is the better value?", fig: valueFig(offers, unit),
    ez: { hint: "Find the price of 1 " + (unit === "m2" ? "m&sup2;" : "pack") + " for each." },
    options: offers.map(function(o){ return o[0]; }), answer: best, fixed: true, slips: sl,
    hint: "Work out the price for one " + (unit === "m2" ? "m&sup2;" : "pack") + " for each: price &divide; " + (unit === "m2" ? "area" : "how many") + ".",
    why: offers.map(function(o, k){ return o[0] + ": " + P + mo(o[1]) + " &divide; " + fm(o[2]) + " = " + P + mo(per[k]); }).join(". ") + ". <b>" + offers[best][0] + "</b> is cheapest for each one." };
}
function budget(have, items){
  var spent = r6(items.reduce(function(a, x){ return a + x[1] * (x[2] || 1) * (1 - (x[3] || 0) / 100); }, 0)), left = r6(have - spent);
  var plain = r6(items.reduce(function(a, x){ return a + x[1] * (x[2] || 1); }, 0)), sl = [[1, r6(have + spent), "Spending leaves less, so take away."]];
  if(plain !== spent) sl.push([0, plain, "Remember the money off. Work out the discount before adding."]);
  if(items.some(function(x){ return x[2] > 1; })) sl.push([0, r6(items.reduce(function(a, x){ return a + x[1] * (1 - (x[3] || 0) / 100); }, 0)), "Some of those are several of the same thing. Multiply those first."]);
  return { q: "[[Boss]] has " + P + mo(have) + " for the makeover. The shopping list: " + items.map(function(x){ return x[0] + " " + ((x[2] || 1) > 1 ? x[2] + X + P + mo(x[1]) : P + mo(x[1])) + (x[3] ? " with " + x[3] + "% off" : ""); }).join(", ") + ". What is spent, and what is left?",
    ez: { q: "[[Boss]] has " + P + mo(have) + ".<br>" + items.map(function(x){ return x[0] + " " + ((x[2] || 1) > 1 ? x[2] + X + P + mo(x[1]) : P + mo(x[1])) + (x[3] ? ", " + x[3] + "% off" : ""); }).join("<br>") + "<br>What is spent? What is left?", hint: "Add them up. Take that from " + P + mo(have) + "." },
    boxes: [{ label: "Spent", a: spent, pre: P, show: mo(spent) }, { label: "Left", a: left, pre: P, show: mo(left) }], slips: sl,
    hint: "Cost each line first" + (items.some(function(x){ return x[3]; }) ? " (take the % off that one)" : "") + ", add them up, then take that from " + P + mo(have) + ".",
    why: items.map(function(x){ return x[0] + " " + P + mo(x[1] * (x[2] || 1) * (1 - (x[3] || 0) / 100)); }).join(", ") + ". Spent <b>" + P + mo(spent) + "</b>, left <b>" + P + mo(left) + "</b>." };
}
function Lroom(W, H, cw, ch, p, o){
  var a = r6(W * H - cw * ch), c = r6(a * p);
  return { q: "[[Room]] is L shaped. Flooring costs " + P + mo(p) + " per m&sup2;. Find the floor area, then the cost." + (o && o.hide ? " Two lengths are missing: work them out from the others." : ""),
    ez: { q: "An L shaped room. Flooring is " + P + mo(p) + " per m&sup2;.<br>Find the area. Then the cost.", hint: "Split it into 2 rectangles." },
    fig: LFig(W, H, cw, ch, o),
    boxes: [{ label: "Area", a: a, post: M2 }, { label: "Cost", a: c, pre: P, show: mo(c) }],
    slips: [[0, r6(W * H), "That is the whole rectangle, missing corner included. Take the corner off (or split it into two rectangles)."], [0, r6(2 * (W + H)), "That is the perimeter. Flooring needs the area."], [1, r6(W * H * p), "That cost includes the missing corner."]],
    hint: "Split it into two rectangles, or do the big rectangle and take off the missing corner.",
    why: "Big rectangle " + fm(W) + X + fm(H) + " = " + fm(W * H) + ", corner " + fm(cw) + X + fm(ch) + " = " + fm(cw * ch) + ". Area " + fm(a) + M2 + ". " + fm(a) + X + P + mo(p) + " = <b>" + P + mo(c) + "</b>." };
}

(window.A2PACKS = window.A2PACKS || {})["core-room-makeover"] = {
  a2: true,
  id: "a2-core-room-makeover",
  title: "Room makeover",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 25,
  line: "Flooring, skirting, paint, tiles and fences: what to buy, and what it costs.",
  blurb: "Making over a room with real maths: area for the floor and walls, perimeter for the edges, packs and tins, and best value. Four short chunks, then you plan your own room. The numbers change every time you come back.",
  note: "A room makeover with real shopping maths. Four five minute chunks, and you plan your own room at the end. The numbers change each go, so come back whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Touch up", line: "Touch up: whole metres, one wall at a time, friendly prices." },
    { id: "medium", name: "Makeover", line: "Makeover: whole rooms, money with pence, packs and tins." },
    { id: "spicy", name: "Full renovation", line: "Full renovation: decimal lengths, two coats, cut tiles, percentages and L shaped rooms." }
  ],
  themes: {
    time: { name: "Time travel", w: { room: "the time lab", boss: "the professor" } },
    football: { name: "Football", w: { room: "the changing room", boss: "the manager" } },
    horror: { name: "Horror", w: { room: "the haunted attic", boss: "the caretaker" } },
    fishing: { name: "Fishing", w: { room: "the tackle shop", boss: "the shop owner" } },
    music: { name: "Music", w: { room: "the recording studio", boss: "the producer" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: LEARN1,
  steps: [

    /* ---------- chunk 1: floor and edges ---------- */
    { type: "learn", topic: "Floor and edges", title: "Inside or edge?",
      fig: LEARN1,
      ez: { html: "<p><b>Area</b> is the inside. 5 &times; 4 = 20 m&sup2;.</p><p><b>Perimeter</b> is the edge. 5 + 4 + 5 + 4 = 18 m.</p>" },
      html: "<p>Every makeover job is one of two kinds.</p>" +
        "<p><b>Covering the inside</b> (carpet, flooring, paint, tiles) needs the <b>area</b>: length &times; width, in m&sup2;. A 5 m by 4 m floor is 5 &times; 4 = <b>20 m&sup2;</b>. At &pound;12 per m&sup2;, flooring costs 20 &times; 12 = <b>&pound;240</b>.</p>" +
        "<p><b>Going round the edge</b> (skirting board, fences, trims) needs the <b>perimeter</b>: add all four sides. 5 + 4 + 5 + 4 = <b>18 m</b>. Skirting skips the doorway, so take that off: 18 &minus; 0.9 = <b>17.1 m</b>.</p>",
      lv: { mild: { html: "<p>Every makeover job is one of two kinds.</p>" +
        "<p><b>Covering the inside</b> (carpet, paint, tiles) needs the <b>area</b>. Count the squares, or do length &times; width: 5 &times; 4 = <b>20 m&sup2;</b>.</p>" +
        "<p><b>Going round the edge</b> (skirting board, fences) needs the <b>perimeter</b>. Add all four sides: 5 + 4 + 5 + 4 = <b>18 m</b>.</p>" } } },

    G("sort", "Floor and edges", [
      [sortQ([["New carpet", 0], ["Skirting board", 1], ["Floor paint", 0], ["Fairy lights round the ceiling edge", 1], ["Wallpaper for one wall", 0], ["A fence round a garden", 1]]),
       sortQ([["New carpet", 0], ["Skirting board", 1], ["Floor tiles", 0], ["A fence round a garden", 1]]),
       sortQ([["Varnish for a table top", 0], ["Trim round a window frame", 1], ["Turf for a garden", 0], ["Edging strip round a rug", 1], ["Tiles for a bathroom wall", 0], ["Rope barrier round a stage", 1]])],
      [sortQ([["Laminate flooring", 0], ["Border tape round a noticeboard", 1], ["Ceiling paint", 0], ["Draught strip round a door", 1], ["A rug to cover the floor", 0], ["Edging round a flower bed", 1]]),
       sortQ([["Ceiling paint", 0], ["Fence for a dog run", 1], ["A rug", 0], ["Tape round a poster", 1]]),
       sortQ([["Glass for a window pane", 0], ["Sealant round a bath", 1], ["Grass seed for a lawn", 0], ["Ribbon round a cake", 1], ["Felt for a pool table", 0], ["Bunting round a field", 1]])],
      [sortQ([["Wall tiles", 0], ["Picture frame moulding", 1], ["Underlay for carpet", 0], ["Lights round a mirror", 1], ["Paint for a door", 0], ["Trim round the ceiling", 1]]),
       sortQ([["Floor paint", 0], ["Skirting board", 1], ["Wallpaper", 0], ["Lights round a window", 1]]),
       sortQ([["Solar panels on a roof", 0], ["Gutter round a roof", 1], ["Decking for a patio", 0], ["Safety tape round a hole", 1], ["Lino for a kitchen", 0], ["Rail round a balcony", 1]])]
    ], { buckets: ["Area (the inside)", "Perimeter (the edge)"] }),

    G("num", "Floor and edges", [
      [floorCost(5, 4, 12), floorCost(4, 3, 5), floorCost(4.5, 3.2, 18.5)],
      [floorCost(6, 3.5, 14), floorCost(5, 2, 7), floorCost(3.8, 2.5, 22.4)],
      [floorCost(4, 4.5, 16), floorCost(3, 3, 4), floorCost(5.2, 3.5, 15.75)]
    ]),

    G("num", "Floor and edges", [
      [skirt(5, 4, 0.9), skirt(4, 3, 0), skirt(4.5, 3.2, 0.85)],
      [skirt(6, 3.5, 1), skirt(5, 3, 0), skirt(3.8, 2.5, 0.76)],
      [skirt(4, 4.5, 0.8), skirt(3, 3, 0), skirt(5.2, 3.5, 0.9)]
    ]),

    G("num", "Floor and edges", [
      [lengths(17.1, 3), lengths(14, 2), lengths(14.55, 2.4, 6.85)],
      [lengths(18, 2.5), lengths(16, 2), lengths(11.84, 2.4, 7.2)],
      [lengths(16.2, 3), lengths(12, 3), lengths(16.5, 3.6, 9.4)]
    ], { explain: true }),

    /* ---------- chunk 2: paint the walls ---------- */
    { type: "learn", topic: "Paint the walls", title: "Unroll the walls",
      fig: wallsFig([5, 4, 5, 4], 2.5, [["door", 1, 2, 0], ["window", 1.5, 1, 1]], "18 m long, 2.5 m high: 45 m&#178;, take off door and window"),
      ez: { title: "Paint a wall", html: "<p>Wall: 4 &times; 2 = 8 m&sup2;. Take off the window: <b>7 m&sup2;</b>.</p><p>1 tin covers 3 m&sup2;. So <b>3 tins</b>.</p>" },
      html: "<p>Imagine peeling the walls off and laying them in one long strip. The strip is as long as the <b>distance round the room</b>, and as high as the walls.</p>" +
        "<p>Room 5 m by 4 m, walls 2.5 m high: round the room is 18 m, so the walls are 18 &times; 2.5 = <b>45 m&sup2;</b>. Take off the door (1 &times; 2 = 2 m&sup2;) and window (1.5 &times; 1 = 1.5 m&sup2;): <b>41.5 m&sup2;</b> to paint.</p>" +
        "<p>Tins: if one tin covers 10 m&sup2;, that is 41.5 &divide; 10 = 4.15 tins. You cannot buy 0.15 of a tin, so <b>round up to 5</b>.</p>",
      lv: {
        mild: { fig: wallsFig([4], 2, [["window", 1, 1, 0]], "4 x 2 = 8 m&#178;, take off the window: 7 m&#178;"),
          html: "<p>Area of a wall: length &times; height. A wall 4 m long and 2 m high is 4 &times; 2 = <b>8 m&sup2;</b>. Take off the window (1 m by 1 m is 1 m&sup2;): <b>7 m&sup2;</b> to paint.</p>" +
            "<p>If a tin covers 3 m&sup2;, you need 7 &divide; 3 = 2 and a bit. A bit more paint still means a whole tin, so <b>3 tins</b>.</p>" },
        spicy: { html: "<p>Peel the walls off into one long strip: as long as the <b>distance round the room</b>, as high as the walls.</p>" +
            "<p>5 m by 4 m, 2.5 m high: 18 &times; 2.5 = 45 m&sup2;. Minus door (1 &times; 2) and window (1.5 &times; 1): <b>41.5 m&sup2;</b>.</p>" +
            "<p><b>Two coats</b> doubles it: 83 m&sup2;. A tin covering 12 m&sup2; gives 83 &divide; 12 = 6.9..., so <b>7 tins</b>. Always round up, even 6.01 becomes 7.</p>" } } },

    G("num", "Paint the walls", [
      [walls(4, 3, 2.5, [["door", 1, 2]]), wallOne(5, 2, ["window", 1, 1]), walls(4.2, 3.6, 2.4, [["door", 0.9, 2], ["window", 1.5, 1.2]])],
      [walls(5, 4, 2.5, [["door", 1, 2]]), wallOne(4, 3, ["window", 1, 2]), walls(3.8, 3.2, 2.5, [["door", 0.8, 2], ["window", 1.2, 1.5]])],
      [walls(6, 4, 2.5, [["door", 1, 2], ["window", 1, 1]]), wallOne(5, 3, ["door", 1, 2]), walls(5.2, 3.5, 2.4, [["door", 0.9, 2], ["window", 2, 1.2]])]
    ]),

    G("mc", "Paint the walls", [
      [mcTins(33, 1, 10), mcTins(9, 1, 4), mcTins(33.84, 2, 12)],
      [mcTins(43, 1, 10), mcTins(10, 1, 4), mcTins(31.6, 2, 10)],
      [mcTins(47, 1, 10), mcTins(13, 1, 5), mcTins(37.56, 2, 15)]
    ]),

    G("num", "Paint the walls", [
      [tinsCost(33, 2, 15, 18), tinsCost(9, 1, 5, 6), tinsCost(33.84, 2, 10, 23.5)],
      [tinsCost(43, 2, 20, 22), tinsCost(8, 1, 3, 5), tinsCost(31.6, 2, 12, 19.75)],
      [tinsCost(28, 2, 12, 16), tinsCost(12, 1, 5, 4), tinsCost(37.56, 2, 14, 24.95)]
    ]),

    G("num", "Paint the walls", [
      [missingSide(12, 4), missingSide(10, 5), missingSide(10.8, 4.5)],
      [missingSide(15, 6), missingSide(12, 4), missingSide(9.36, 3.6)],
      [missingSide(14, 5), missingSide(8, 4), missingSide(13.75, 5.5)]
    ]),

    /* ---------- chunk 3: tiles and packs ---------- */
    { type: "learn", topic: "Tiles and packs", title: "Fit the tiles, then buy the packs",
      fig: tilesFig(3, 2, 50, "6 along, 4 down: 6 x 4 = 24 tiles"),
      ez: { title: "Fit the tiles", html: "<p>Floor 3 m by 2 m. 1 m tiles: 3 &times; 2 = <b>6 tiles</b>.</p><p>Packs of 4. So <b>2 packs</b>.</p>" },
      html: "<p>Tiles are measured in cm, rooms in m. Change one so they match: 50 cm = 0.5 m.</p>" +
        "<p>Floor 3 m by 2 m: 3 &divide; 0.5 = <b>6</b> along, 2 &divide; 0.5 = <b>4</b> down. 6 &times; 4 = <b>24 tiles</b>.</p>" +
        "<p>Packs of 10: 24 &divide; 10 = 2.4, so <b>3 packs</b>. Round up, always: nobody wants a gap in the floor.</p>",
      lv: {
        mild: { fig: tilesFig(3, 2, 100, "3 along, 2 down: 3 x 2 = 6 tiles"),
          html: "<p>Big tiles, 1 m square. Floor 3 m by 2 m: <b>3</b> along and <b>2</b> down. 3 &times; 2 = <b>6 tiles</b>.</p><p>Packs of 4: one pack is not enough, so <b>2 packs</b> (with 2 spare).</p>" },
        spicy: { fig: tilesFig(3.2, 2, 60, "6 along (5.33 rounds up), 4 down (3.33 rounds up): 24 tiles"),
          html: "<p>Change cm to m: 60 cm = 0.6 m.</p><p>Floor 3.2 m by 2 m: 3.2 &divide; 0.6 = 5.33, so <b>6</b> along (the last one gets cut). 2 &divide; 0.6 = 3.33, so <b>4</b> down. 6 &times; 4 = <b>24 tiles</b>.</p>" +
            "<p>Builders add about 10% extra for breakages. Then divide by the pack size and round up again.</p>" } } },

    G("num", "Tiles and packs", [
      [tiles(4, 3, 50), tiles(4, 3, 100), tiles(3.5, 2.4, 30)],
      [tiles(5, 2, 50), tiles(5, 2, 100), tiles(2.8, 2.1, 40)],
      [tiles(3, 3, 50), tiles(3, 3, 100), tiles(4.2, 3, 45)]
    ]),

    G("mc", "Tiles and packs", [
      [mcConv(4, 50), mcConv(3, 50), mcCover(40)],
      [mcConv(5, 25), mcConv(2, 50), mcCover(50)],
      [mcConv(3, 30), mcConv(4, 50), mcCover(20)]
    ]),

    G("num", "Tiles and packs", [
      [packsQ(48, 0, 10, 14.99), packsQ(12, 0, 4, 5), packsQ(80, 10, 12, 21.5)],
      [packsQ(40, 0, 6, 9.5), packsQ(12, 0, 5, 3), packsQ(42, 10, 8, 15.4)],
      [packsQ(36, 0, 8, 12.25), packsQ(9, 0, 2, 4), packsQ(70, 10, 9, 18.75)]
    ]),

    G("num", "Tiles and packs", [
      [packCover(4, 3, 10, 50), packCover(3, 4, 2, 100), packCover(4.8, 3.5, 8, 60)],
      [packCover(5, 3, 8, 50), packCover(5, 2, 2, 100), packCover(5.4, 3.3, 6, 60)],
      [packCover(6, 2.5, 12, 40), packCover(4, 5, 3, 100), packCover(3.9, 2.7, 10, 45)]
    ]),

    /* ---------- chunk 4: fences and best value ---------- */
    { type: "learn", topic: "Fences and best value", title: "Fence it, then shop smart",
      fig: fenceFig(6, 4, 1, 1.8, true),
      ez: { title: "Fence it", html: "<p>A fence goes round the <b>edge</b>: 16 m.</p><p>Panels are 2 m. 16 &divide; 2 = <b>8 panels</b>.</p>" },
      html: "<p>Jay is building Bonnie a dog run. A fence goes round the <b>edge</b>, so it is perimeter again: 6 + 4 + 6 + 4 = 20 m, minus a 1 m gate = <b>19 m</b>.</p>" +
        "<p>Panels are 1.8 m wide: 19 &divide; 1.8 = 10.6, so <b>11 panels</b>. Ten would leave a gap, and Bonnie finds every gap.</p>",
      lv: { mild: { fig: fenceFig(5, 3, 0, 2, true),
        html: "<p>Jay is building Bonnie a dog run. A fence goes round the <b>edge</b>: 5 + 3 + 5 + 3 = <b>16 m</b>.</p><p>Panels are 2 m wide: 16 &divide; 2 = <b>8 panels</b>.</p>" } } },

    G("num", "Fences and best value", [
      [fence(6, 4, 1, 1.8), fence(5, 3, 0, 2), fence(7.5, 4.2, 1.2, 1.83, 24.5)],
      [fence(5, 4, 1, 1.8), fence(4, 2, 0, 2), fence(6.4, 3.8, 0.9, 1.83, 22.75)],
      [fence(8, 3, 1.2, 1.8), fence(6, 4, 0, 2), fence(8.2, 5.5, 1.5, 1.83, 26)]
    ]),

    { type: "learn", topic: "Fences and best value", title: "Best value: the price of one",
      fig: valueFig([["Pack A", 18, 2], ["Pack B", 25, 3]], "m2"),
      ez: { title: "Price of one", html: "<p>Find the <b>price of one</b>.</p><p>Deal A: &pound;6 each. Deal B: &pound;5 each. <b>B</b> wins.</p>" },
      html: "<p>Bigger packs are not always cheaper. To compare, find the <b>price of one</b>: one m&sup2;, one tile, one tin.</p>" +
        "<p>Pack A: &pound;18 &divide; 2 = &pound;9 per m&sup2;. Pack B: &pound;25 &divide; 3 = &pound;8.33 per m&sup2;. <b>Pack B</b> is better value, even though it costs more.</p>",
      lv: { mild: { fig: valueFig([["Deal A", 6, 1], ["Deal B", 10, 2]], "packs"),
        html: "<p>Bigger deals are not always cheaper. Find the <b>price of one</b>.</p><p>Deal A: 1 pack for &pound;6. Deal B: 2 packs for &pound;10, which is &pound;5 each. <b>Deal B</b> is better value.</p>" } } },

    G("mc", "Fences and best value", [
      [bestVal([["Pack A", 18, 2], ["Pack B", 25, 3]], "m2"), bestVal([["Deal A", 6, 1], ["Deal B", 10, 2]], "packs"), bestVal([["Pack A", 22.4, 1.6], ["Pack B", 31.5, 2.5], ["Pack C", 39, 3]], "m2")],
      [bestVal([["Pack A", 24, 3], ["Pack B", 35, 4]], "m2"), bestVal([["Deal A", 4, 1], ["Deal B", 15, 3]], "packs"), bestVal([["Pack A", 27.6, 2.4], ["Pack B", 18.9, 1.8], ["Pack C", 33, 3]], "m2")],
      [bestVal([["Pack A", 15, 1.5], ["Pack B", 38, 4]], "m2"), bestVal([["Deal A", 8, 2], ["Deal B", 15, 5]], "packs"), bestVal([["Pack A", 45, 4.5], ["Pack B", 29.25, 2.5], ["Pack C", 52.8, 4.8]], "m2")]
    ], { explain: true }),

    G("num", "Fences and best value", [
      [budget(400, [["flooring", 240], ["paint", 18, 5], ["skirting", 8, 6]]), budget(50, [["paint", 12], ["brushes", 8], ["a roller", 6]]), budget(600, [["flooring", 266.4, 1, 15], ["paint", 23.5, 7], ["tiles", 21.5, 9]])],
      [budget(300, [["flooring", 168], ["paint", 18, 4], ["skirting", 7.5, 5]]), budget(40, [["paint", 15], ["a brush", 6], ["tape", 4]]), budget(500, [["flooring", 240, 1, 20], ["paint", 23.5, 2], ["skirting", 6.85, 7]])],
      [budget(360, [["flooring", 210], ["paint", 22, 3], ["tiles", 14.99, 5]]), budget(60, [["a rug", 24], ["paint", 18], ["a lamp", 9]]), budget(850, [["carpet", 457.6, 1, 25], ["paint", 24.95, 6], ["fence panels", 24.5, 13]])]
    ]),

    G("num", "Fences and best value", [
      [Lroom(6, 5, 2, 2, 15), Lroom(5, 4, 2, 2, 4, { split: true }), Lroom(6.4, 4.5, 2.2, 1.8, 24.5, { hide: { cw: 1, ch: 1 } })],
      [Lroom(7, 5, 3, 2, 12), Lroom(6, 4, 2, 1, 5, { split: true }), Lroom(5.6, 4.8, 2.4, 2, 28.5, { hide: { cw: 1, ch: 1 } })],
      [Lroom(8, 6, 3, 3, 11), Lroom(5, 5, 2, 3, 3, { split: true }), Lroom(7.2, 5, 3.2, 1.5, 19.95, { hide: { cw: 1, ch: 1 } })]
    ])
  ],

  ez: {
    realWorld: { title: "Estimators do this", html: "<p>Builders measure first. Then they order what they need.</p><p>Too little and the job stops. Too much wastes money.</p>" },
    make: { intro: "Draw your dream room. We work out the area for you." }
  },
  realWorld: {
    title: "Estimators do this for a living",
    html: "<p>Before any builder, decorator or flooring fitter starts a job, someone measures up and works out exactly what to order and what it will cost. That job is called an <b>estimator</b>, and it is exactly what you have just been doing.</p>" +
      "<p>Order too little and the job stops halfway with no tiles left. Order too much and the money goes on boxes nobody needs.</p>",
    fig: pic(420, 150, "Jay with a tape measure and Bonnie", A.jay(110, 50, 0.85, "smile") +
      '<rect x="170" y="104" width="44" height="34" rx="6" fill="#ffd23f" stroke="' + INK + '" stroke-width="2"/><circle cx="192" cy="121" r="9" fill="none" stroke="' + INK + '" stroke-width="2"/><path d="M214 128h120" stroke="#ffd23f" stroke-width="8"/><path d="M224 124v8M244 124v8M264 124v8M284 124v8M304 124v8M324 124v8" stroke="' + INK + '" stroke-width="1.5"/>' +
      A.bonnie(370, 102, 0.6, "sit") + A.bubble(220, 8, 150, 52, "Measure twice,\norder once.", 232))
  },

  make: {
    title: "Plan your own room",
    intro: "Your dream room, drawn to shape from your measurements, with its area and perimeter worked out for you. Save it, stick it up, or send it to Jay.",
    fields: [
      { id: "room", label: "Room name", ph: "My games room", max: 24 },
      { id: "len", label: "Length (m)", ph: "5", max: 5 },
      { id: "wid", label: "Width (m)", ph: "4", max: 5 },
      { id: "floor", label: "Floor", ph: "Dark wood", max: 22 },
      { id: "walls", label: "Walls", ph: "Midnight blue", max: 22 }
    ],
    svg: function(v){
      var l = parseFloat(v.len), w = parseFloat(v.wid);
      if(!(l > 0)) l = 5; if(!(w > 0)) w = 4; l = Math.min(l, 99); w = Math.min(w, 99);
      var s = Math.min(240 / l, 200 / w), W = l * s, H = w * s, x0 = 40 + (240 - W) / 2, y0 = 110 + (200 - H) / 2;
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#eaf4fb"/>' +
        '<path d="M0 0h600" stroke="#ffffff"/>' +
        fit(40, 62, v.room, 28, 470, { b: 1, c: "#141a33" }) +
        '<text x="40" y="88" ' + F + ' font-size="13" fill="#1f6f8b" letter-spacing="2">ROOM MAKEOVER PLAN</text>' +
        '<rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + H + '" fill="#f3d9a4" stroke="#141a33" stroke-width="6"/>' +
        '<text x="' + (x0 + W / 2) + '" y="' + (y0 - 10) + '" text-anchor="middle" ' + F + ' font-size="14" font-weight="700" fill="#141a33">' + fm(l) + ' m</text>' +
        '<text x="' + (x0 - 8) + '" y="' + (y0 + H / 2 + 5) + '" text-anchor="end" ' + F + ' font-size="14" font-weight="700" fill="#141a33">' + fm(w) + ' m</text>' +
        '<text x="320" y="150" ' + F + ' font-size="13" fill="#1f6f8b" letter-spacing="2">AREA</text>' +
        '<text x="320" y="178" ' + F + ' font-size="24" font-weight="700" fill="#141a33">' + fm(l * w) + ' m&#178;</text>' +
        '<text x="320" y="214" ' + F + ' font-size="13" fill="#1f6f8b" letter-spacing="2">PERIMETER</text>' +
        '<text x="320" y="242" ' + F + ' font-size="24" font-weight="700" fill="#141a33">' + fm(2 * (l + w)) + ' m</text>' +
        '<text x="320" y="278" ' + F + ' font-size="13" fill="#1f6f8b" letter-spacing="2">FLOOR</text>' +
        fit(320, 300, v.floor, 17, 240, { c: "#141a33" }) +
        '<text x="320" y="332" ' + F + ' font-size="13" fill="#1f6f8b" letter-spacing="2">WALLS</text>' +
        fit(320, 354, v.walls, 17, 240, { c: "#141a33" }) +
        A.bird(552, 370, 0.7, "#ff5d5d") +
        '</svg>';
    }
  }
};
})();
