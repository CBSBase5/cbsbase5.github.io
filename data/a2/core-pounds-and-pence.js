/* Base 5 core activity: Pounds and pence.
   Maths. Writing money correctly (the pound sign, two digits of pence,
   or p on its own), adding prices, change from a note, and shopping
   sums. Replayable: most questions have two extra versions.
   The pound sign is always written as the HTML entity. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
var PD = "&pound;", X = " &times; ";
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function r2(x){ return Math.round(x * 100) / 100; }
function c(x){ return Math.round(x * 100); }            /* pounds to pence */
function M(x){ return r2(x).toFixed(2); }               /* 3.5 to "3.50" */
function P(x){ return PD + M(x); }                       /* 3.5 to the pound sign and 3.50 */
function pb(label, x){ return { label: label, a: r2(x), pre: PD, show: M(x) }; }
function pp(label, n){ return { label: label, a: n, post: "p" }; }

function lvl(v){
  if(!v.mild) return v;
  var o = {};
  Object.keys(v.mild).forEach(function(k){ o[k] = v.mild[k]; });
  o.lv = { medium: noEz(v.medium || v.mild), spicy: noEz(v.spicy || v.mild) };
  /* easy read (LC): ez is for the first level only. A version can add its own ez next to mild. */
  if(v.ez){ var e = {}; Object.keys(o.ez || {}).forEach(function(k){ e[k] = o.ez[k]; }); Object.keys(v.ez).forEach(function(k){ e[k] = v.ez[k]; }); o.ez = e; }
  return o;
}
function noEz(x){ if(!x || !x.ez) return x; var o = {}; Object.keys(x).forEach(function(k){ if(k !== "ez") o[k] = x[k]; }); return o; }
function S(type, topic, vs, extra){
  var s = lvl(vs[0]);
  s.type = type; s.topic = topic;
  Object.keys(extra || {}).forEach(function(k){ s[k] = extra[k]; });
  if(vs.length > 1) s.vary = vs.slice(1).map(lvl);
  return s;
}
function MC(q, right, wrongs, hint, why, fig){
  var sl = {};
  wrongs.forEach(function(w, k){ sl[k + 1] = w[1]; });
  return { q: q, fig: fig || "", options: [right].concat(wrongs.map(function(w){ return w[0]; })), answer: 0, slips: sl, hint: hint, why: why };
}
function N(q, boxes, slips, hint, why, fig, z){
  function keep(s){ var b = boxes[s.length === 3 ? s[0] : 0]; return b && Math.abs(s[s.length === 3 ? 1 : 0] - b.a) > 1e-9; }
  var o = { q: q, fig: fig || "", boxes: boxes, slips: slips.filter(keep), hint: hint, why: why };
  if(z){ var e = {}; ["q", "hint", "why"].forEach(function(k){ if(z[k] != null) e[k] = z[k]; });
    if(z.s){ e.slips = []; slips.forEach(function(s, i){ if(keep(s)) e.slips.push(s.length === 3 ? [null, null, z.s[i]] : [null, z.s[i]]); }); }
    o.ez = e; }
  return o;
}

/* ---------- pictures ---------- */
/* how a price is written */
var TAG = '<svg viewBox="0 0 520 220" role="img" aria-label="A price tag showing 3 pounds 05, with each part labelled">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  '<path d="M120 60h240l40 40l-40 40h-240z" fill="#ffd23f" stroke="#141a33" stroke-width="3" stroke-linejoin="round"/><circle cx="370" cy="100" r="7" fill="#f4f1ea" stroke="#141a33" stroke-width="2"/>' +
  T(150, 116, PD, 44, { b: 1 }) + T(190, 116, "3", 44, { b: 1 }) + T(222, 116, ".", 44, { b: 1, c: "#e04848" }) + T(240, 116, "05", 44, { b: 1, c: "#1f7fbf" }) +
  '<path d="M162 128v30M203 128v30M231 120v38M270 128v30" stroke="#141a33" stroke-width="1.5"/>' +
  T(150, 176, "pound", 12, { a: "middle", b: 1 }) + T(150, 190, "sign", 12, { a: "middle", b: 1 }) + T(203, 176, "pounds", 12, { a: "middle", b: 1 }) +
  T(231, 206, "dot", 12, { a: "middle", b: 1, c: "#e04848" }) + T(290, 176, "pence: always", 12, { a: "middle", b: 1, c: "#1f7fbf" }) + T(290, 190, "two digits", 12, { a: "middle", b: 1, c: "#1f7fbf" }) +
  T(420, 46, "or, under a pound:", 13, { a: "middle" }) + T(420, 74, "75p", 24, { a: "middle", b: 1 }) +
  A.egg(A.bird(80, 70, 0.75, "#3a8fd6"), "A bird looking at the price. Jay says it is window shopping. For seeds.") +
  '</svg>';

/* a receipt with items [name, pounds]; total shown or "?" */
function receipt(items, total){
  var h = 96 + items.length * 30 + 50;
  var s = '<svg viewBox="0 0 520 ' + h + '" role="img" aria-label="A receipt">' +
    '<rect width="520" height="' + h + '" rx="16" fill="#e8f7ff"/>' +
    '<rect x="120" y="14" width="280" height="' + (h - 28) + '" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
    T(260, 44, "RECEIPT", 15, { a: "middle", b: 1 });
  items.forEach(function(it, k){
    var y = 80 + k * 30;
    s += T(140, y, it[0], 14) + T(384, y, typeof it[1] === "string" ? it[1] : P(it[1]), 14, { a: "end", b: 1 });
  });
  var ty = 80 + items.length * 30;
  s += '<path d="M140 ' + (ty - 12) + 'h244" stroke="#141a33" stroke-width="2" stroke-dasharray="5 4"/>' +
    T(140, ty + 16, "TOTAL", 15, { b: 1 }) + T(384, ty + 16, total == null ? "?" : P(total), 15, { a: "end", b: 1 }) +
    A.egg(A.bird(450, h - 40, 0.6, "#ff5d5d"), "A bird on the receipt. Jay bought bird seed. Again.") + '</svg>';
  return s;
}

/* lining up the dots */
function column(rows, total){
  var s = '<svg viewBox="0 0 520 ' + (80 + rows.length * 34) + '" role="img" aria-label="Prices written in a column with the dots lined up">' +
    '<rect width="520" height="' + (80 + rows.length * 34) + '" rx="16" fill="#f4f1ea"/>';
  rows.forEach(function(r, k){
    var t = M(r), d = t.indexOf("."), y = 44 + k * 34;
    s += T(250, y, PD + t.slice(0, d), 22, { a: "end", b: 1 }) + T(256, y, ".", 22, { a: "middle", b: 1, c: "#e04848" }) + T(262, y, t.slice(d + 1), 22, { b: 1, c: "#1f7fbf" });
    if(k === rows.length - 1) s += T(170, y, "+", 22, { b: 1 });
  });
  var y = 44 + rows.length * 34;
  s += '<path d="M170 ' + (y - 22) + 'h150" stroke="#141a33" stroke-width="2.5"/>';
  if(total != null){ var t2 = M(total), d2 = t2.indexOf("."); s += T(250, y + 4, PD + t2.slice(0, d2), 22, { a: "end", b: 1 }) + T(256, y + 4, ".", 22, { a: "middle", b: 1, c: "#e04848" }) + T(262, y + 4, t2.slice(d2 + 1), 22, { b: 1, c: "#1f7fbf" }); }
  s += T(400, 40, "Dots in", 13, { a: "middle", c: "#e04848", b: 1 }) + T(400, 58, "a straight line", 13, { a: "middle", c: "#e04848", b: 1 });
  return s + '</svg>';
}

/* counting up from the price to the note */
function hops(price, note, mode){
  var next = Math.ceil(price - 1e-9) === price ? price : Math.ceil(price), x0 = 50, x1 = 470;
  function X(v){ return x0 + (v - price) / (note - price) * (x1 - x0); }
  var nx = next === note ? X(note) : Math.max(X(next), x0 + 120);
  var s = '<svg viewBox="0 0 520 170" role="img" aria-label="Counting up from the price to the note">' +
    '<rect width="520" height="170" rx="16" fill="#f4f1ea"/><path d="M' + x0 + ' 110H' + x1 + '" stroke="#141a33" stroke-width="3"/>';
  [[x0, P(price)], [nx, P(next)], [x1, P(note)]].forEach(function(p, k){ if(k === 1 && (next === note || mode === "bare")) return; s += '<path d="M' + p[0] + ' 100v20" stroke="#141a33" stroke-width="2.5"/>' + T(p[0], 144, p[1], 14, { a: "middle", b: 1 }); });
  function arc(a, b, label){ var m = (a + b) / 2; return '<path d="M' + (a + 4) + ' 100Q' + m + ' 40 ' + (b - 4) + ' 100" fill="none" stroke="#8a5cf6" stroke-width="3"/><path d="M' + (b - 4) + ' 100l-9 -6M' + (b - 4) + ' 100l-1 -11" stroke="#8a5cf6" stroke-width="3"/>' + T(m, 56, label, 15, { a: "middle", b: 1, c: "#8a5cf6" }); }
  if(mode === "bare") return s + T(260, 60, "Count up from the price to the note", 14, { a: "middle", b: 1, c: "#8a5cf6" }) + '</svg>';
  if(next !== price) s += arc(x0, nx, mode ? "+ ?p" : "+" + c(next - price) + "p");
  if(next !== note) s += arc(nx, x1, mode ? "+ " + PD + "?" : "+" + PD + (note - next));
  return s + '</svg>';
}

/* two deals side by side */
function deals(a, b){
  function tag(x, title, l1, l2, col){
    return '<g transform="translate(' + x + ' 0)"><path d="M0 30h170l30 50l-30 50h-170z" fill="' + col + '" stroke="#141a33" stroke-width="3" stroke-linejoin="round"/>' +
      T(20, 60, title, 15, { b: 1 }) + T(20, 88, l1, 15) + T(20, 112, l2, 15, { b: 1 }) + '</g>';
  }
  return '<svg viewBox="0 0 520 160" role="img" aria-label="Two deals, A and B">' + '<rect width="520" height="160" rx="16" fill="#f4f1ea"/>' +
    tag(30, "Deal A", a[0], a[1], "#cfe8f5") + tag(280, "Deal B", b[0], b[1], "#ffd9e4") + '</svg>';
}

/* ---------- question builders ---------- */
/* write an amount in pounds, typed */
function TX(words, ans, hint){
  var sl = [[["pound", "pence"], "Have a go with numbers only: the pounds, a dot, then two digits for the pence."], [["p"], "In pounds there is no p on the end. The dot does that job."]];
  var zl = [[null, "Numbers only. Pounds, a dot, 2 digits."], [null, "No p on the end. The dot does that."]];
  var d = ans.split(".");
  if(d[0] === "0"){ sl.push([["." + d[1]], "Nearly. With no pounds, put a 0 before the dot."]); zl.push([null, "Nearly. Put a 0 before the dot."]); }
  if(d[1].charAt(1) === "0"){ sl.push([[d[0] + "." + d[1].charAt(0)], "Nearly. Pence always takes two digits, so put the 0 on the end."]); zl.push([null, "Nearly. Pence needs 2 digits. Add a 0."]); }
  if(d[1].charAt(0) === "0"){ sl.push([[d[0] + "." + d[1].charAt(1)], "That would be " + d[1].charAt(1) + "0 pence. For " + +d[1] + "p, write ." + d[1] + "."]); zl.push([null, "That is " + d[1].charAt(1) + "0 pence. Write ." + d[1] + "."]); }
  sl.push([[d[0] === "0" ? d[1] : d[0] + d[1]], "Put a dot between the pounds and the pence."]); zl.push([null, "Put a dot between pounds and pence."]);
  return { q: "Write " + words + " the money way: pounds, a dot, then two digits of pence. The pound sign is optional here, in case your keyboard has not got one.",
    need: [[ans]], exact: true, model: ans, slips: sl, hint: hint || "Pounds, a dot, then two digits for the pence.",
    why: "It is written <b>" + PD + ans + "</b>.",
    ez: { q: "Write " + words + " in pounds. Use a dot.", hint: hint || "Pounds, a dot, 2 digits.", slips: zl } };
}
/* pence to pounds and pounds to pence */
function CV(pence, pounds){
  var a = r2(pence / 100), b = c(pounds), sl = [[0, r2(pence / 10), "That is ten times too big. 100p make " + PD + "1, so divide by 100."], [1, b / 10, "That is ten times too small. Each pound is 100p."]];
  if(pence % 100 < 10 && pence % 100 > 0) sl.push([0, r2(Math.floor(pence / 100) + (pence % 100) / 10), pence + "p is " + Math.floor(pence / 100) + " pounds and " + pence % 100 + " pence, so it is " + P(a) + "."]);
  if(b % 100 < 10 && b % 100 > 0) sl.push([1, Math.floor(b / 100) * 10 + b % 100, P(pounds) + " is " + Math.floor(b / 100) + " pounds and " + b % 100 + " pence: " + Math.floor(b / 100) * 100 + "p + " + b % 100 + "p."]);
  var zs = ["10 times too big. Divide by 100.", "10 times too small. 1 pound is 100p."];
  if(pence % 100 < 10 && pence % 100 > 0) zs.push(pence + "p is " + P(a) + ".");
  if(b % 100 < 10 && b % 100 > 0) zs.push(P(pounds) + " is " + b + "p.");
  return N("Swap them over. 100p make " + PD + "1.", [pb(pence + "p in pounds", a), pp(P(pounds) + " in pence", b)], sl,
    "To go from pence to pounds, divide by 100. To go from pounds to pence, times by 100.",
    pence + "p = <b>" + P(a) + "</b> and " + P(pounds) + " = <b>" + b + "p</b>.", "",
    { hint: "Divide by 100, or times by 100.", s: zs });
}

/* adding with the steps laid out */
function addMild(a, b){
  var pa = c(a) % 100, pbb = c(b) % 100, la = Math.floor(a), lb = Math.floor(b), t = r2(a + b);
  return N("Your turn, with the steps laid out. A [[i1]] costs " + P(a) + " and a [[i2]] costs " + P(b) + ". What do they cost together?",
    [pp("Pence: " + pa + "p + " + pbb + "p =", pa + pbb), { label: "Pounds: " + PD + la + " + " + PD + lb + " =", a: la + lb, pre: PD }, pb("Total", t)],
    [[2, pa + pbb, "That is just the pence. Put the pounds with it."], [2, la + lb, "That is just the pounds. Put the pence with it."], [2, c(t), "That is in pence. The total box is in pounds."]],
    "Pence first, then pounds, then put them together.", "Pence: " + (pa + pbb) + "p. Pounds: " + PD + (la + lb) + ". Total: <b>" + P(t) + "</b>.", column([a, b]),
    { q: "A [[i1]] is " + P(a) + ". A [[i2]] is " + P(b) + ". Add them.", hint: "Pence first, then pounds.",
      s: ["Just the pence. Add the pounds.", "Just the pounds. Add the pence.", "That is in pence. This box is pounds."] });
}
function addMed(a, b){
  var pa = c(a) % 100, pbb = c(b) % 100, la = Math.floor(a), lb = Math.floor(b), ps = pa + pbb, t = r2(a + b);
  return N("Your turn, with the steps laid out. A [[i1]] costs " + P(a) + " and a [[i2]] costs " + P(b) + ". What do they cost together?",
    [pp("Pence: " + pa + "p + " + pbb + "p =", ps), pb(ps + "p in pounds is", ps / 100), pb("Total: " + PD + (la + lb) + " + that =", t)],
    [[1, ps, "That is in pence. 100p make " + PD + "1, so " + ps + "p is " + P(ps / 100) + "."], [2, r2(la + lb + (ps - 100) / 100), "Did you lose the pound? " + ps + "p is " + PD + "1 and " + (ps - 100) + "p."]],
    "When the pence go past 100, that makes another pound.", ps + "p is " + P(ps / 100) + ". " + PD + (la + lb) + " + " + P(ps / 100) + " = <b>" + P(t) + "</b>.", column([a, b]));
}
function addSp(a, b, cp){
  var ab = r2(a + b), t = r2(a + b + cp / 100);
  return N("Your turn, with the steps laid out. A [[i1]] costs " + P(a) + ", a [[i2]] costs " + P(b) + " and a [[i3]] costs " + cp + "p. What is the total?",
    [pb(cp + "p in pounds", cp / 100), pb(P(a) + " + " + P(b) + " =", ab), pb("Total", t)],
    [[0, cp, "That would be " + cp + " pounds. In pounds, " + cp + "p is " + P(cp / 100) + "."], [2, r2(ab + cp), "That adds " + cp + " pounds, not " + cp + " pence."]],
    "Write every price in pounds first, then line up the dots.", cp + "p = " + P(cp / 100) + ". " + P(a) + " + " + P(b) + " = " + P(ab) + ". Total: <b>" + P(t) + "</b>.", column([a, b, cp / 100]));
}
/* total of a list of [token, pounds] */
function total(items){ return r2(items.reduce(function(s, x){ return s + x[1]; }, 0)); }
function addQ(q, items, hint, fig){
  var t = total(items), pen = items.reduce(function(s, x){ return s + c(x[1]) % 100; }, 0), lb = items.reduce(function(s, x){ return s + Math.floor(x[1]); }, 0);
  var sl = [[c(t), "That is in pence. The box is in pounds: " + c(t) + "p is " + P(t) + "."], [pen / 100, "That is just the pence. Add the pounds too."], [lb, "That is just the pounds. Add the pence too."]];
  if(pen >= 100) sl.push([r2(lb + (pen % 100) / 100), "Did you lose a pound? The pence add up to " + pen + "p, which is " + P(pen / 100) + "."]);
  var zs = ["That is in pence. This box is pounds.", "Just the pence. Add the pounds.", "Just the pounds. Add the pence."];
  if(pen >= 100) zs.push("Lost a pound? " + pen + "p is " + P(pen / 100) + ".");
  return N(q, [pb("Total", t)], sl, hint, items.map(function(x){ return P(x[1]); }).join(" + ") + " = <b>" + P(t) + "</b>.", fig, { s: zs });
}

/* change: count up from the price */
function chFade(price, note){
  var next = Math.ceil(price - 1e-9), up = c(next - price), rest = note - next, ch = r2(note - price);
  return N("Your turn, with the steps laid out. A [[i1]] costs " + P(price) + ". You pay with a " + PD + note + " note. Count up to find your change.",
    [pp("Up to " + PD + next + ": +", up), { label: "Then up to " + PD + note + ": +", a: rest, pre: PD }, pb("Change", ch)],
    [[0, c(price) % 100, "That is the pence in the price. How many more pence to reach " + PD + next + "?"], [2, r2(rest + (c(price) % 100) / 100), "Check the pence: it is " + up + "p up to the next pound, not " + c(price) % 100 + "p."], [2, r2(note + price), "That adds. Change is the gap from the price up to the note."]],
    "Count up in two hops: first to the next whole pound, then to the note.", "+" + up + "p, then +" + PD + rest + ". Change: <b>" + P(ch) + "</b>.", hops(price, note, "q"),
    { q: "A [[i1]] is " + P(price) + ". You pay with " + PD + note + ". Count up.", hint: "Up to " + PD + next + ". Then to " + PD + note + ".",
      s: ["How many pence up to " + PD + next + "?", "Check the pence. It is " + up + "p up to " + PD + next + ".", "That adds. Count up instead."] });
}
function chSlips(price, note){
  var ch = r2(note - price), pen = c(price) % 100;
  var sl = [[r2(note + price), "That adds. Change is the gap from the price up to the note."], [r2(note - Math.floor(price)), "That takes away the pounds but not the pence."]];
  if(pen) sl.push([r2(Math.floor(ch) + pen / 100), "Check the pence. Count up from " + pen + "p to the next pound: that is " + (100 - pen) + "p."]);
  return sl;
}
function chZ(price, note){
  var pen = c(price) % 100, z = ["That adds. Count up instead.", "Take away the pence too."];
  if(pen) z.push("Check the pence. " + pen + "p up to the next pound is " + (100 - pen) + "p.");
  return z;
}
function chQ(price, note, what){
  var ch = r2(note - price);
  return N("Fewer steps now. A [[" + (what || "i2") + "]] costs " + P(price) + ". You pay with " + (note === 2 ? "a " + PD + "2 coin" : "a " + PD + note + " note") + ". How much change?", [pb("Change", ch)], chSlips(price, note),
    "Count up from " + P(price) + " to the next pound, then to " + PD + note + ".", "Count up from " + P(price) + " to " + PD + note + ": <b>" + P(ch) + "</b>.", hops(price, note, "bare"),
    { q: "A [[" + (what || "i2") + "]] is " + P(price) + ". You pay with " + PD + note + ". What is the change?", hint: "Count up to " + PD + note + ".", s: chZ(price, note) });
}
/* buy a list, pay with a note: total and change */
function shopQ(items, note, words){
  var t = total(items), ch = r2(note - t);
  return N("On your own now. At [[shop]] you buy " + words + ". You pay with a " + PD + note + " note. What is the total, and your change?", [pb("Total", t), pb("Change", ch)],
    [[0, c(t), "That is in pence. The box is in pounds."]].concat(chSlips(t, note).map(function(s){ return [1, s[0], s[1]]; })),
    "Add everything up first. Then count up from the total to " + PD + note + ".",
    "Total: " + items.map(function(x){ return P(x[1]); }).join(" + ") + " = <b>" + P(t) + "</b>. Change from " + PD + note + ": <b>" + P(ch) + "</b>.",
    receipt(items.map(function(x){ return [x[0], x[2] || x[1]]; })),
    { q: "You buy " + words + ". You pay with " + PD + note + ". Total and change?", hint: "Add up first. Then count up.",
      s: ["That is in pence. This box is pounds."].concat(chZ(t, note)) });
}
/* did the till get it right? */
function tillQ(what, cost, note, said){
  var ch = r2(note - cost), right = Math.abs(ch - said) < 1e-9, o = [], sl = {};
  var wrongs = [r2(said + 1), r2(said - 0.1), r2(said + 0.1), r2(said - 1), r2(ch + 1), r2(ch - 0.1), r2(said + 0.05), r2(said * 10), r2(said + 0.2)].filter(function(v, k, a){ return v > 0 && Math.abs(v - ch) > 1e-9 && Math.abs(v - said) > 1e-9 && a.indexOf(v) === k; });
  o.push(right ? "Yes, that is right" : "No, it should be " + P(ch));
  o.push(right ? "No, it should be " + P(wrongs[0]) : "Yes, that is right");
  o.push("No, it should be " + P(wrongs[1])); o.push("No, it should be " + P(wrongs[2]));
  sl[1] = right ? "Count up from " + P(cost) + " to " + PD + note + " to check." : "Check it: count up from " + P(cost) + " to " + PD + note + ".";
  sl[2] = "Count up again carefully: to the next pound first, then to " + PD + note + "."; sl[3] = sl[2];
  return { q: "Jay buys " + what + " for " + P(cost) + " and pays with a " + PD + note + " note. The till says his change is " + P(said) + ". Is it right?",
    fig: '<svg viewBox="0 0 420 160" role="img" aria-label="Jay at the till, looking surprised">' + '<rect width="420" height="160" rx="14" fill="#f4f1ea"/>' +
      '<rect x="250" y="70" width="140" height="70" rx="8" fill="#9aa3b5" stroke="#141a33" stroke-width="2.5"/><rect x="266" y="82" width="108" height="26" rx="4" fill="#19c39a"/>' + T(320, 101, P(said), 15, { a: "middle", b: 1 }) +
      A.jay(110, 62, 0.85, "wow") + A.bubble(160, 10, 120, 40, "Outrageous?", 170) + '</svg>',
    options: o, answer: 0, slips: sl, hint: "Work out the change yourself, then compare.",
    why: "Count up from " + P(cost) + " to " + PD + note + ": " + P(ch) + ". " + (right ? "The till is <b>right</b>. Not outrageous after all." : "The till is wrong: it should be <b>" + P(ch) + "</b>."),
    ez: { q: "Jay buys " + what + " for " + P(cost) + ". He pays with " + PD + note + ". The till says " + P(said) + " change. Is it right?",
      hint: "Work it out. Then compare.", why: "The change is <b>" + P(ch) + "</b>. " + (right ? "The till is right." : "The till is not right."),
      slips: { 1: "Count up from " + P(cost) + " to " + PD + note + ".", 2: "Count up again. Next pound first.", 3: "Count up again. Next pound first." } } };
}

(window.A2PACKS = window.A2PACKS || {})["core-pounds-and-pence"] = {
  a2: true,
  id: "a2-core-pounds-and-pence",
  title: "Pounds and pence",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 20,
  line: "Writing money the right way, adding up prices and working out your change.",
  blurb: "Money, the everyday way: writing amounts correctly, adding prices, working out change from a note, and a few shopping sums. Four short chunks, new prices each time you come back, and a receipt to make at the end.",
  note: "Writing money, adding prices and working out change. Four five minute chunks, with new prices each time you come back. Have a go whenever suits you.",
  sure: true,
  levels: [
    { id: "mild", name: "Coin purse", line: "Coin purse: writing amounts, adding two prices, change from a note." },
    { id: "medium", name: "Wallet", line: "Wallet: carrying the pence, three or more items, change from " + PD + "20." },
    { id: "spicy", name: "Bank vault", line: "Bank vault: rounding to the nearest penny, discounts and best buys." }
  ],
  themes: {
    time: { name: "Time travel", w: { shop: "the museum gift shop", i1: "fossil", i2: "toy sundial", i3: "map of Rome" } },
    football: { name: "Football", w: { shop: "the club shop", i1: "scarf", i2: "programme", i3: "water bottle" } },
    horror: { name: "Horror", w: { shop: "the haunted house shop", i1: "glow stick", i2: "rubber spider", i3: "mask" } },
    fishing: { name: "Fishing", w: { shop: "the tackle shop", i1: "float", i2: "pack of hooks", i3: "tub of bait" } },
    music: { name: "Music", w: { shop: "the merch stand", i1: "badge", i2: "poster", i3: "wristband" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: TAG,
  steps: [

    /* ---------- chunk 1: writing money ---------- */
    S("learn", "Writing money", [{
      mild: { title: "How money is written",
        html: "<p>Write the <b>pound sign</b>, then the pounds, a <b>dot</b>, then <b>two digits</b> for the pence.</p>" +
          "<p class=\"a2task\">" + PD + "3.05 is 3 pounds and 5 pence.<br>" + PD + "3.50 is 3 pounds and 50 pence.<br>Under a pound, write 75p or " + PD + "0.75.</p>" +
          "<p>Use the pound sign <b>or</b> the p, never both.</p>",
        fig: TAG },
      ez: { title: "Writing money", html: "<p>Pounds, a <b>dot</b>, then <b>2 digits</b> of pence.</p><p class=\"a2task\">" + PD + "3.05 &nbsp; " + PD + "3.50 &nbsp; 75p</p>" },
      medium: { title: "How money is written",
        html: "<p>Write the <b>pound sign</b>, then the pounds, a <b>dot</b>, then <b>two digits</b> for the pence. Use the pound sign or the p, never both.</p>" +
          "<p class=\"a2task\">A calculator drops the end zero: it shows <b>4.5</b> for " + PD + "4.50. When you write it as money, put the zero back.</p>",
        fig: TAG },
      spicy: { title: "How money is written",
        html: "<p>Money is always written to <b>two decimal places</b>: the pounds, a dot, then two digits for the pence.</p>" +
          "<p class=\"a2task\">A calculator can give too many digits. 10 &divide; 3 shows 3.333333. Round to the <b>nearest penny</b>: " + PD + "3.33.<br>If the third digit is 5 or more, round up: 12.3456 becomes " + PD + "12.35.</p>",
        fig: TAG }
    }]),

    S("mc", "Writing money", [
      { mild: MC("Which is the right way to write <b>three pounds and five pence</b>?", PD + "3.05", [[PD + "3.5", "That is 3 pounds and 50 pence. Pence always takes two digits."], [PD + "3.05p", "That has the pound sign and the p. Use one or the other."], [PD + "305", "That is three hundred and five pounds. Put a dot between the pounds and pence."]], "Five pence needs two digits: 05.", "<b>" + PD + "3.05</b>: pound sign, 3, a dot, then 05."),
        ez: { q: "Which one is <b>3 pounds and 5 pence</b>?", hint: "5 pence is 05.", why: "<b>" + PD + "3.05</b>.", slips: { 1: "That is 3 pounds 50. Pence needs 2 digits.", 2: "Use " + PD + " or p. Not both.", 3: "Put a dot between pounds and pence." } },
        medium: MC("Which is the right way to write <b>twelve pounds and eight pence</b>?", PD + "12.08", [[PD + "12.8", "That is 12 pounds and 80 pence. Eight pence is 08."], [PD + "12.80", "That is 12 pounds and 80 pence. Eight pence is 08."], [PD + "1208", "That is over a thousand pounds. Put a dot between the pounds and pence."]], "Eight pence needs two digits: 08.", "<b>" + PD + "12.08</b>."),
        spicy: MC("A calculator shows <b>12.3456</b> for a price. What is that to the nearest penny?", PD + "12.35", [[PD + "12.34", "The next digit is 5, so round the pence up."], [PD + "12.3456", "Money only has two decimal places. Round to the nearest penny."], [PD + "12.3", "That drops the pence digit. Money needs two decimal places."]], "Look at the third decimal place. 5 or more rounds up.", "12.3456 is between 12.34 and 12.35. The next digit is 5, so round up: <b>" + PD + "12.35</b>.") },
      { mild: MC("Which is the right way to write <b>seven pounds and fifty pence</b>?", PD + "7.50", [[PD + "7.5p", "That has the pound sign and the p. And pence needs two digits."], [PD + "75", "That is seventy five pounds. Put a dot between the pounds and pence."], [PD + "7.05", "That is 7 pounds and 5 pence. Fifty pence is 50."]], "Fifty pence is written 50.", "<b>" + PD + "7.50</b>."),
        ez: { q: "Which one is <b>7 pounds and 50 pence</b>?", hint: "50 pence is 50.", why: "<b>" + PD + "7.50</b>.", slips: { 1: "Use " + PD + " or p. Not both.", 2: "That is 75 pounds. Add a dot.", 3: "That is 7 pounds and 5 pence." } },
        medium: MC("A calculator shows <b>4.5</b> for a price. How should you write it as money?", PD + "4.50", [[PD + "4.5", "Money needs two digits of pence. Put the zero back."], [PD + "4.05", "That is 4 pounds and 5 pence. The calculator meant 50 pence."], ["4.5p", "That is less than 5 pence. The calculator was showing pounds."]], "The calculator drops the end zero.", "4.5 means 4 pounds and 50 pence: <b>" + PD + "4.50</b>."),
        spicy: MC(PD + "10 is shared equally between 3 people. The calculator shows <b>3.333333</b>. How much does each person get, to the nearest penny?", PD + "3.33", [[PD + "3.34", "The next digit is 3, so round down."], [PD + "3.3", "That drops the pence digit. Money needs two decimal places."], [PD + "3.333", "Money only has two decimal places. Round to the nearest penny."]], "Look at the third decimal place. Under 5 rounds down.", "The third digit is 3, so round down: <b>" + PD + "3.33</b>. There is 1p left over. Jay says it goes to Bonnie.") },
      { mild: MC("Which is the right way to write <b>ninety pence</b>?", "90p", [[PD + "90", "That is ninety pounds. Use p for pence, or write " + PD + "0.90."], [PD + "0.90p", "That has the pound sign and the p. Use one or the other."], ["0.90p", "That is less than a penny. Write 90p or " + PD + "0.90."]], "Under a pound you can just use p.", "<b>90p</b>, or " + PD + "0.90."),
        ez: { q: "Which one is <b>90 pence</b>?", hint: "Under a pound, just use p.", why: "<b>90p</b>, or " + PD + "0.90.", slips: { 1: "That is 90 pounds.", 2: "Use " + PD + " or p. Not both.", 3: "That is less than 1p. Try 90p." } },
        medium: MC("Which is the right way to write <b>forty pounds and four pence</b>?", PD + "40.04", [[PD + "40.4", "That is 40 pounds and 40 pence. Four pence is 04."], [PD + "44", "That is forty four pounds. Keep the pounds and pence apart with a dot."], [PD + "40.40", "That is 40 pounds and 40 pence. Four pence is 04."]], "Four pence needs two digits: 04.", "<b>" + PD + "40.04</b>."),
        spicy: MC("A calculator shows <b>0.075</b> for a cost in pounds. What is that to the nearest penny?", PD + "0.08", [[PD + "0.07", "The next digit is 5, so round up."], [PD + "0.75", "That is 75 pence. 0.075 is less than 10 pence."], [PD + "0.80", "That is 80 pence. 0.075 is less than 10 pence."]], "0.07 is 7p and 0.08 is 8p. Which is it nearer?", "0.075 is halfway between 7p and 8p, and halfway rounds up: <b>" + PD + "0.08</b>, or 8p.") }
    ]),

    S("text", "Writing money", [
      { mild: TX("<b>four pounds and twenty pence</b>", "4.20"), medium: TX("<b>1250p</b>", "12.50", "Divide by 100: 1250p is 12 pounds and 50 pence."), spicy: TX("<b>2050p</b>", "20.50", "Divide by 100, then make sure there are two digits of pence.") },
      { mild: TX("<b>85p</b>", "0.85", "No pounds, so it starts with 0."), medium: TX("<b>nine pounds and nine pence</b>", "9.09"), spicy: TX("<b>one hundred and two pounds and five pence</b>", "102.05") },
      { mild: TX("<b>six pounds and seven pence</b>", "6.07", "Seven pence needs two digits: 07."), medium: TX("<b>305p</b>", "3.05", "Divide by 100: 305p is 3 pounds and 5 pence."), spicy: TX("the calculator answer <b>18.4</b> (it is in pounds)", "18.40", "Put the missing zero back.") }
    ]),

    S("sort", "Writing money", (function(){
      function SO(cards){ return { q: "Sort them. Written the right way, or has a slip?", buckets: ["Written the right way", "Has a slip"], cards: cards,
        hint: "Check for: two digits of pence, a dot, and the pound sign or the p, never both.", why: "The right ones have two digits of pence and use the pound sign or the p, not both.",
        ez: { q: "Sort them. The right way, or a slip?", hint: "2 digits of pence. " + PD + " or p, not both.", why: "Right ones: 2 digits of pence, and " + PD + " or p." } }; }
      var Q = PD;
      return [
        { mild: SO([[Q + "2.50", 0], ["75p", 0], [Q + "2.5", 1], [Q + "1.50p", 1], [Q + "10.09", 0], ["3.40p", 1]]),
          medium: SO([[Q + "15.60", 0], [Q + "15.6", 1], [Q + "0.09", 0], ["9p", 0], [Q + "1.009", 1], [Q + "20.5", 1]]),
          spicy: SO([[Q + "1250.00", 0], [Q + "12.505", 1], [Q + "0.01", 0], ["0.5p", 1], [Q + "99.99", 0], [Q + "7.5", 1]]) },
        { mild: SO([[Q + "4.30", 0], ["30p", 0], [Q + "4.3", 1], [Q + "0.30p", 1], [Q + "12.05", 0], ["12.05p", 1]]),
          medium: SO([[Q + "8.08", 0], [Q + "8.8", 1], [Q + "0.60", 0], ["60p", 0], [Q + "60p", 1], [Q + "16.400", 1]]),
          spicy: SO([[Q + "305.10", 0], [Q + "305.1", 1], [Q + "0.07", 0], [Q + "0.007", 1], ["99p", 0], [Q + "3.999", 1]]) },
        { mild: SO([[Q + "8.99", 0], ["5p", 0], [Q + "0.05", 0], [Q + "8.9", 1], [Q + "5p", 1], ["0.05p", 1]]),
          medium: SO([[Q + "20.02", 0], [Q + "20.2", 1], [Q + "1.10", 0], [Q + "1.1", 1], ["45p", 0], [Q + "45p", 1]]),
          spicy: SO([[Q + "1000.50", 0], [Q + "1000.5", 1], [Q + "12.35", 0], [Q + "12.345", 1], ["1p", 0], ["0.1p", 1]]) }
      ];
    })()),

    S("num", "Writing money", [
      { mild: CV(350, 2.08), medium: CV(1250, 10.09), spicy: CV(12345, 50.05) },
      { mild: CV(470, 1.05), medium: CV(2008, 0.99), spicy: CV(99999, 0.1) },
      { mild: CV(905, 3.6), medium: CV(1500, 7.7), spicy: CV(10050, 1.01) }
    ]),

    /* ---------- chunk 2: adding prices ---------- */
    S("learn", "Adding prices", [{
      mild: { title: "Worked example: adding two prices",
        html: "<p>Line up the dots, then add the pence and the pounds.</p>" +
          "<p class=\"a2task\"><b>" + PD + "2.45 + " + PD + "1.30</b><br>Step 1: pence first. 45p + 30p = 75p.<br>Step 2: pounds. " + PD + "2 + " + PD + "1 = " + PD + "3.<br>Step 3: put them together: <b>" + PD + "3.75</b>.</p>",
        fig: column([2.45, 1.3], 3.75) },
      ez: { title: "Adding 2 prices", html: "<p>Add the <b>pence</b>. Then add the <b>pounds</b>.</p><p class=\"a2task\">45p + 30p = 75p. " + PD + "2 + " + PD + "1 = " + PD + "3. So <b>" + PD + "3.75</b>.</p>" },
      medium: { title: "Worked example: when the pence go past a pound",
        html: "<p>Line up the dots, then add the pence and the pounds. If the pence come to 100 or more, that makes another pound.</p>" +
          "<p class=\"a2task\"><b>" + PD + "3.85 + " + PD + "2.40</b><br>Step 1: pence first. 85p + 40p = 125p.<br>Step 2: 125p is " + PD + "1.25.<br>Step 3: pounds. " + PD + "3 + " + PD + "2 = " + PD + "5, and " + PD + "5 + " + PD + "1.25 = <b>" + PD + "6.25</b>.</p>",
        fig: column([3.85, 2.4], 6.25) },
      spicy: { title: "Worked example: mixed pounds and pence",
        html: "<p>Write every price in pounds first, then line up the dots.</p>" +
          "<p class=\"a2task\"><b>" + PD + "12.99 + " + PD + "4.50 + 85p</b><br>Step 1: 85p is " + PD + "0.85.<br>Step 2: " + PD + "12.99 + " + PD + "4.50 = " + PD + "17.49.<br>Step 3: " + PD + "17.49 + " + PD + "0.85 = <b>" + PD + "18.34</b>.</p>" +
          "<p>Quick check: about " + PD + "13 + " + PD + "4.50 + " + PD + "1 is about " + PD + "18.50. Close, so it makes sense.</p>",
        fig: column([12.99, 4.5, 0.85], 18.34) }
    }]),

    S("num", "Adding prices", [
      { mild: addMild(1.45, 2.4), medium: addMed(4.75, 1.6), spicy: addSp(8.75, 15.49, 65) },
      { mild: addMild(1.2, 3.65), medium: addMed(1.99, 2.45), spicy: addSp(23.4, 6.95, 99) },
      { mild: addMild(5.32, 2.16), medium: addMed(7.6, 3.85), spicy: addSp(14.25, 9.8, 45) }
    ]),

    S("num", "Adding prices", [
      { mild: addQ("Fewer steps now. A [[i3]] costs " + P(1.25) + " and a [[i1]] costs " + P(2.6) + ". What do they cost together?", [["", 1.25], ["", 2.6]], "Pence first: 25p + 60p. Then the pounds."),
        ez: { q: "A [[i3]] is " + P(1.25) + ". A [[i1]] is " + P(2.6) + ". Add them." },
        medium: addQ("Fewer steps now. A [[i3]] costs " + P(2.75) + " and a [[i1]] costs " + P(1.5) + ". What do they cost together?", [["", 2.75], ["", 1.5]], "Pence first: 75p + 50p. That is more than a pound."),
        spicy: addQ("Fewer steps now. A [[i3]] costs " + P(16.85) + " and a [[i1]] costs 95p. What do they cost together?", [["", 16.85], ["", 0.95]], "95p is " + P(0.95) + ". Line up the dots.") },
      { mild: addQ("Fewer steps now. A [[i3]] costs " + P(3.1) + " and a [[i1]] costs " + P(0.85) + ". What do they cost together?", [["", 3.1], ["", 0.85]], "Pence first: 10p + 85p. Then the pounds."),
        ez: { q: "A [[i3]] is " + P(3.1) + ". A [[i1]] is " + P(0.85) + ". Add them." },
        medium: addQ("Fewer steps now. A [[i3]] costs " + P(5.65) + " and a [[i1]] costs " + P(3.55) + ". What do they cost together?", [["", 5.65], ["", 3.55]], "Pence first: 65p + 55p. That is more than a pound."),
        spicy: addQ("Fewer steps now. A [[i3]] costs " + P(27.49) + " and a [[i1]] costs 78p. What do they cost together?", [["", 27.49], ["", 0.78]], "78p is " + P(0.78) + ". Line up the dots.") },
      { mild: addQ("Fewer steps now. A [[i3]] costs " + P(4.4) + " and a [[i1]] costs " + P(1.35) + ". What do they cost together?", [["", 4.4], ["", 1.35]], "Pence first: 40p + 35p. Then the pounds."),
        ez: { q: "A [[i3]] is " + P(4.4) + ". A [[i1]] is " + P(1.35) + ". Add them." },
        medium: addQ("Fewer steps now. A [[i3]] costs " + P(8.9) + " and a [[i1]] costs " + P(2.25) + ". What do they cost together?", [["", 8.9], ["", 2.25]], "Pence first: 90p + 25p. That is more than a pound."),
        spicy: addQ("Fewer steps now. A [[i3]] costs " + P(39.99) + " and a [[i1]] costs 67p. What do they cost together?", [["", 39.99], ["", 0.67]], "67p is " + P(0.67) + ". Line up the dots.") }
    ]),

    S("num", "Adding prices", (function(){
      function R(list, hint){
        var items = list.map(function(x, k){ return ["[[I" + (k + 1) + "]]", x]; });
        var o = addQ("On your own now. Here is a receipt from [[shop]]. What is the total?", items, hint, receipt(items));
        o.ez.q = "What is the total on this receipt?";
        return o;
      }
      return [
        { mild: R([1.2, 2.3, 3.05], "Pence first, then pounds."), medium: R([4.35, 2.8, 6.5], "Pence first. They come to more than a pound."), spicy: R([12.99, 7.45, 0.89], "Quick check with rounding: about " + PD + "13 + " + PD + "7.50 + " + PD + "1.") },
        { mild: R([2.1, 1.45, 4.2], "Pence first, then pounds."), medium: R([7.99, 3.25, 1.6], "Pence first. They come to more than a pound."), spicy: R([24.5, 3.99, 11.65], "Quick check with rounding: about " + PD + "24.50 + " + PD + "4 + " + PD + "11.50.") },
        { mild: R([3.3, 0.45, 2.1], "Pence first, then pounds."), medium: R([9.45, 4.7, 2.95], "Pence first. They come to more than a pound."), spicy: R([45.99, 18.75, 6.49], "Quick check with rounding: about " + PD + "46 + " + PD + "19 + " + PD + "6.50.") }
      ];
    })()),

    S("mc", "Adding prices", [
      { mild: MC("Without working it out exactly, about how much is " + P(2.99) + " + " + P(3.99) + "?", "About " + PD + "7", [["About " + PD + "5", "Round each one: " + P(2.99) + " is nearly " + PD + "3, " + P(3.99) + " is nearly " + PD + "4."], ["About " + PD + "70", "That is ten times too much. Each price is only a few pounds."], ["About 70p", "Each price is nearly a few pounds, so the total is several pounds."]], "Round each price to the nearest pound.", PD + "3 + " + PD + "4 = <b>about " + PD + "7</b>. The exact answer is " + P(6.98) + "."),
        ez: { q: "<b>About</b> how much is " + P(2.99) + " + " + P(3.99) + "?", hint: "Round to the nearest pound.", why: PD + "3 + " + PD + "4 = <b>about " + PD + "7</b>.", slips: { 1: "Round them. Nearly " + PD + "3 and " + PD + "4.", 2: "That is 10 times too much.", 3: "Each one is a few pounds." } },
        medium: MC("Without working it out exactly, about how much is " + P(4.99) + " + " + P(2.95) + " + " + P(7.05) + "?", "About " + PD + "15", [["About " + PD + "13", "Round each one to the nearest pound: 5, 3 and 7."], ["About " + PD + "150", "That is ten times too much."], ["About " + PD + "12", "Round each one to the nearest pound: 5, 3 and 7."]], "Round each price to the nearest pound.", PD + "5 + " + PD + "3 + " + PD + "7 = <b>about " + PD + "15</b>. Exactly, it is " + P(14.99) + "."),
        spicy: MC("Use rounding to find the <b>exact</b> cost of 3 at " + P(4.99) + " each.", P(14.97), [[P(15.03), "4.99 is 1p less than " + PD + "5, so take the 3p away."], [P(14.99), "Each one is 1p less than " + PD + "5. That is 3p less altogether."], [P(12.97), "3 x " + PD + "5 is " + PD + "15, not " + PD + "13."]], "Each is 1p less than " + PD + "5. Work out 3 x " + PD + "5, then adjust.", "3 x " + PD + "5 = " + PD + "15. Each is 1p less, so take away 3p: <b>" + P(14.97) + "</b>.") },
      { mild: MC("Without working it out exactly, about how much is " + P(1.95) + " + " + P(4.05) + "?", "About " + PD + "6", [["About " + PD + "5", "Round each one: about " + PD + "2 and about " + PD + "4."], ["About " + PD + "60", "That is ten times too much."], ["About " + PD + "8", "Round each one: about " + PD + "2 and about " + PD + "4."]], "Round each price to the nearest pound.", PD + "2 + " + PD + "4 = <b>about " + PD + "6</b>. Exactly, it is " + P(6) + "."),
        ez: { q: "<b>About</b> how much is " + P(1.95) + " + " + P(4.05) + "?", hint: "Round to the nearest pound.", why: PD + "2 + " + PD + "4 = <b>about " + PD + "6</b>.", slips: { 1: "Round them. About " + PD + "2 and " + PD + "4.", 2: "That is 10 times too much.", 3: "Round them. About " + PD + "2 and " + PD + "4." } },
        medium: MC("Without working it out exactly, about how much is " + P(11.99) + " + " + P(3.95) + " + " + P(1.05) + "?", "About " + PD + "17", [["About " + PD + "15", "Round each one to the nearest pound: 12, 4 and 1."], ["About " + PD + "170", "That is ten times too much."], ["About " + PD + "20", "That is a bit high. Round each one: 12, 4 and 1."]], "Round each price to the nearest pound.", PD + "12 + " + PD + "4 + " + PD + "1 = <b>about " + PD + "17</b>. Exactly, it is " + P(16.99) + "."),
        spicy: MC("Use rounding to find the <b>exact</b> cost of 4 at " + P(9.99) + " each.", P(39.96), [[P(40.04), "9.99 is 1p less than " + PD + "10, so take the 4p away."], [P(39.99), "Each one is 1p less than " + PD + "10. That is 4p less altogether."], [P(36.96), "4 x " + PD + "10 is " + PD + "40, not " + PD + "37."]], "Each is 1p less than " + PD + "10.", "4 x " + PD + "10 = " + PD + "40. Take away 4p: <b>" + P(39.96) + "</b>.") },
      { mild: MC("Without working it out exactly, about how much is " + P(9.99) + " + " + P(0.99) + "?", "About " + PD + "11", [["About " + PD + "10", "Round both: " + P(0.99) + " is nearly " + PD + "1 too."], ["About " + PD + "110", "That is ten times too much."], ["About " + PD + "19", "99p is under a pound, not " + PD + "9."]], "Round each price to the nearest pound.", PD + "10 + " + PD + "1 = <b>about " + PD + "11</b>. Exactly, it is " + P(10.98) + "."),
        ez: { q: "<b>About</b> how much is " + P(9.99) + " + " + P(0.99) + "?", hint: "Round to the nearest pound.", why: PD + "10 + " + PD + "1 = <b>about " + PD + "11</b>.", slips: { 1: "99p is nearly " + PD + "1 too.", 2: "That is 10 times too much.", 3: "99p is under a pound." } },
        medium: MC("Without working it out exactly, about how much is " + P(19.99) + " + " + P(9.99) + " + " + P(4.99) + "?", "About " + PD + "35", [["About " + PD + "33", "Round each one: 20, 10 and 5."], ["About " + PD + "350", "That is ten times too much."], ["About " + PD + "30", "Round each one: 20, 10 and 5."]], "Round each price to the nearest pound.", PD + "20 + " + PD + "10 + " + PD + "5 = <b>about " + PD + "35</b>. Exactly, it is " + P(34.97) + "."),
        spicy: MC("Use rounding to find the <b>exact</b> total of " + P(19.98) + " + " + P(5.99) + ".", P(25.97), [[P(26.03), "Both are a little under, so take the pennies away."], [P(25.99), "19.98 is 2p under and 5.99 is 1p under. That is 3p altogether."], [P(24.97), PD + "20 + " + PD + "6 is " + PD + "26, not " + PD + "25."]], PD + "20 + " + PD + "6, then adjust for the pennies.", PD + "20 + " + PD + "6 = " + PD + "26. Take away 2p and 1p: <b>" + P(25.97) + "</b>.") }
    ], { explain: true }),

    /* ---------- chunk 3: change ---------- */
    S("learn", "Change from a note", [{
      mild: { title: "Worked example: count up to find change",
        html: "<p>Change is the gap from the price up to what you paid. The easiest way: <b>count up</b>.</p>" +
          "<p class=\"a2task\"><b>Price " + PD + "3.60, paid with " + PD + "5</b><br>Step 1: up to the next pound. " + PD + "3.60 to " + PD + "4 is 40p.<br>Step 2: up to the note. " + PD + "4 to " + PD + "5 is " + PD + "1.<br>Step 3: add the hops: " + PD + "1 + 40p = <b>" + PD + "1.40</b>.</p>",
        fig: hops(3.6, 5) },
      ez: { title: "Count up for change", html: "<p><b>Count up</b> from the price to the note.</p><p class=\"a2task\">" + PD + "3.60 to " + PD + "4 is 40p. " + PD + "4 to " + PD + "5 is " + PD + "1. Change: <b>" + PD + "1.40</b>.</p>" },
      medium: { title: "Worked example: count up to find change",
        html: "<p>Change is the gap from the price up to what you paid. The easiest way: <b>count up</b>.</p>" +
          "<p class=\"a2task\"><b>Price " + PD + "13.45, paid with " + PD + "20</b><br>Step 1: " + PD + "13.45 to " + PD + "14 is 55p.<br>Step 2: " + PD + "14 to " + PD + "20 is " + PD + "6.<br>Step 3: " + PD + "6 + 55p = <b>" + PD + "6.55</b>.</p>",
        fig: hops(13.45, 20) },
      spicy: { title: "Worked example: count up to find change",
        html: "<p>Count up from the price, in hops that are easy to add.</p>" +
          "<p class=\"a2task\"><b>Price " + PD + "27.83, paid with " + PD + "50</b><br>Step 1: " + PD + "27.83 to " + PD + "28 is 17p.<br>Step 2: " + PD + "28 to " + PD + "50 is " + PD + "22.<br>Step 3: " + PD + "22 + 17p = <b>" + PD + "22.17</b>.</p>" +
          "<p>Check: " + PD + "27.83 + " + PD + "22.17 should make " + PD + "50. It does.</p>",
        fig: hops(27.83, 50) }
    }]),

    S("num", "Change from a note", [
      { mild: chFade(2.25, 5), medium: chFade(8.15, 20), spicy: chFade(34.06, 50) },
      { mild: chFade(6.7, 10), medium: chFade(16.9, 20), spicy: chFade(41.52, 50) },
      { mild: chFade(1.85, 5), medium: chFade(12.35, 20), spicy: chFade(18.64, 50) }
    ]),

    S("num", "Change from a note", [
      { mild: chQ(1.75, 5), medium: chQ(7.35, 20), spicy: chQ(23.67, 50) },
      { mild: chQ(4.2, 10), medium: chQ(14.99, 20), spicy: chQ(49.01, 50) },
      { mild: chQ(0.65, 2), medium: chQ(11.4, 20), spicy: chQ(12.48, 50) }
    ]),

    S("num", "Change from a note", [
      { mild: shopQ([["[[I1]]", 1.2], ["[[I2]]", 2.5]], 5, "a [[i1]] at " + P(1.2) + " and a [[i2]] at " + P(2.5)),
        medium: shopQ([["[[I1]]", 4.35], ["[[I2]]", 2.8], ["[[I3]]", 6.5]], 20, "a [[i1]] at " + P(4.35) + ", a [[i2]] at " + P(2.8) + " and a [[i3]] at " + P(6.5)),
        spicy: shopQ([["3 x [[i1]]", 22.47, "3 x " + P(7.49)], ["[[I2]]", 12.99]], 50, "3 x [[i1]] at " + P(7.49) + " each and a [[i2]] at " + P(12.99)) },
      { mild: shopQ([["[[I1]]", 3.15], ["[[I2]]", 2.4]], 10, "a [[i1]] at " + P(3.15) + " and a [[i2]] at " + P(2.4)),
        medium: shopQ([["[[I1]]", 7.99], ["[[I2]]", 3.25], ["[[I3]]", 1.6]], 20, "a [[i1]] at " + P(7.99) + ", a [[i2]] at " + P(3.25) + " and a [[i3]] at " + P(1.6)),
        spicy: shopQ([["2 x [[i1]]", 31.5, "2 x " + P(15.75)], ["4 x [[i2]]", 7.96, "4 x " + P(1.99)]], 50, "2 x [[i1]] at " + P(15.75) + " each and 4 x [[i2]] at " + P(1.99) + " each") },
      { mild: shopQ([["[[I1]]", 0.85], ["[[I2]]", 2.1]], 5, "a [[i1]] at " + P(0.85) + " and a [[i2]] at " + P(2.1)),
        medium: shopQ([["[[I1]]", 9.45], ["[[I2]]", 4.7], ["[[I3]]", 2.95]], 20, "a [[i1]] at " + P(9.45) + ", a [[i2]] at " + P(4.7) + " and a [[i3]] at " + P(2.95)),
        spicy: shopQ([["5 x [[i1]]", 19.95, "5 x " + P(3.99)], ["[[I2]]", 24.5]], 50, "5 x [[i1]] at " + P(3.99) + " each and a [[i2]] at " + P(24.5)) }
    ]),

    S("mc", "Change from a note", [
      { mild: tillQ("bird seed", 6.45, 10, 4.65), medium: tillQ("a bird table", 13.75, 20, 7.25), spicy: tillQ("2 bird boxes", 32.85, 50, 17.25) },
      { mild: tillQ("a bird feeder", 2.3, 5, 3.7), medium: tillQ("a bird bath", 18.4, 20, 1.6), spicy: tillQ("2 bird books at " + P(24.99) + " each,", 49.98, 50, 0.02) },
      { mild: tillQ("fat balls", 7.8, 10, 2.2), medium: tillQ("a big bag of seed", 11.05, 20, 9.05), spicy: tillQ("3 feeders at " + P(12.35) + " each,", 37.05, 50, 13.05) }
    ], { explain: true }),

    /* ---------- chunk 4: shopping trip ---------- */
    S("num", "Shopping trip", (function(){
      function times(n, each){
        var t = r2(n * each);
        return N("At [[shop]], a [[i3]] costs " + P(each) + ". How much for " + n + " of them?", [pb("Cost", t)],
          [[r2(n + each), "That adds " + n + ". Multiply instead."], [c(t), "That is in pence. The box is in pounds."], [r2((n - 1) * each), "That is one too few."]],
          n + X + P(each) + ": try " + n + X + PD + Math.floor(each) + " and " + n + X + (c(each) % 100) + "p, then add.",
          n + X + PD + Math.floor(each) + " = " + PD + n * Math.floor(each) + ", " + n + X + (c(each) % 100) + "p = " + P(n * (c(each) % 100) / 100) + ". Total: <b>" + P(t) + "</b>.", "",
          { q: "A [[i3]] is " + P(each) + ". How much for " + n + "?", hint: "Pounds first. Then the pence.", s: ["That adds " + n + ". Times instead.", "That is in pence. This box is pounds.", "That is 1 too few."] });
      }
      function off(pc, was, words){
        var d = r2(was * pc / 100), now = r2(was - d);
        return N("Sale at [[shop]]: " + words + " off a [[i3]] that was " + P(was) + ". How much is taken off, and what is the sale price?", [pb("Taken off", d), pb("Sale price", now)],
          [[1, d, "That is the amount taken off. Take it away from " + P(was) + "."], [0, now, "That is the sale price. The first box is how much is taken off."], [1, r2(was + d), "That adds the discount. It is a sale, so take it away."]],
          pc === 33.333333 ? "A third: divide by 3." : "10% is " + P(was / 10) + ". Build " + words + " from that.",
          words + " of " + P(was) + " is " + P(d) + ". " + P(was) + " take away " + P(d) + " is <b>" + P(now) + "</b>.");
      }
      return [
        { mild: times(2, 1.5), medium: times(4, 2.35), spicy: off(20, 24.5, "20%") },
        { mild: times(3, 1.2), medium: times(6, 1.45), spicy: off(15, 36, "15%") },
        { mild: times(2, 2.25), medium: times(3, 4.99), spicy: off(33.333333, 27.6, "a third") }
      ];
    })()),

    S("mc", "Shopping trip", (function(){
      var OPT = ["Deal A is cheaper", "Deal B is cheaper", "They cost the same"];
      function D(a, b, ca, cb, why, hint, q){
        var ans = Math.abs(ca - cb) < 1e-9 ? 2 : ca < cb ? 0 : 1, sl = {};
        [0, 1, 2].forEach(function(k){ if(k !== ans) sl[k] = k === 2 ? "Work out both exactly. One is cheaper." : "Work out the cost each way, then compare."; });
        var zl = {}; Object.keys(sl).forEach(function(k){ zl[k] = +k === 2 ? "Work out both. 1 is cheaper." : "Work out both. Then compare."; });
        return { q: q || "At [[shop]], which is the cheaper way to buy the [[i2]]?", fig: deals(a, b), options: OPT, answer: ans, slips: sl, hint: hint, why: why,
          ez: q ? { slips: zl } : { q: "Which deal is cheaper?", slips: zl } };
      }
      return [
        { mild: D(["Buy 2 singles", PD + "1.80 each"], ["2 for", PD + "3.20"], 3.6, 3.2, "2 at " + P(1.8) + " is " + P(3.6) + ". The deal is " + P(3.2) + ", so <b>Deal B is cheaper</b>.", "Work out 2 at " + P(1.8) + " first."),
          ez: { why: "2 at " + P(1.8) + " is " + P(3.6) + ". <b>Deal B is cheaper</b>." },
          medium: D(["Buy 3 singles", PD + "1.65 each"], ["3 for", PD + "5.00"], 4.95, 5, "3 at " + P(1.65) + " is " + P(4.95) + ". That beats the " + P(5) + " deal, so <b>Deal A is cheaper</b>. Not every deal is a deal.", "Work out 3 at " + P(1.65) + " first."),
          spicy: D(["Pack of 6", "for " + PD + "4.20"], ["Pack of 10", "for " + PD + "6.50"], 0.7, 0.65, "A: " + P(4.2) + " &divide; 6 = 70p each. B: " + P(6.5) + " &divide; 10 = 65p each. <b>Deal B is cheaper</b> per item.", "Work out the price of one in each deal.") },
        { mild: D(["Buy 2 singles", PD + "2.50 each"], ["2 for", PD + "5.20"], 5, 5.2, "2 at " + P(2.5) + " is " + P(5) + ". That is less than " + P(5.2) + ", so <b>Deal A is cheaper</b>. Outrageous deal, that one.", "Work out 2 at " + P(2.5) + " first."),
          ez: { why: "2 at " + P(2.5) + " is " + P(5) + ". <b>Deal A is cheaper</b>." },
          medium: D(["Buy 4 singles", PD + "2.20 each"], ["4 for", PD + "8.00"], 8.8, 8, "4 at " + P(2.2) + " is " + P(8.8) + ". The deal is " + P(8) + ", so <b>Deal B is cheaper</b>.", "Work out 4 at " + P(2.2) + " first."),
          spicy: D(["250 g bag", "for " + PD + "1.80"], ["400 g bag", "for " + PD + "3.00"], 0.72, 0.75, "Per 100 g: A is " + P(1.8) + " &divide; 2.5 = 72p, B is " + P(3) + " &divide; 4 = 75p. <b>Deal A is cheaper</b> for the amount.", "Work out the price of 100 g in each.", "Jay is buying bird seed. Which bag is cheaper for the amount you get?") },
        { mild: D(["Buy 2 singles", PD + "1.25 each"], ["2 for", PD + "2.50"], 2.5, 2.5, "2 at " + P(1.25) + " is " + P(2.5) + ". The deal is " + P(2.5) + " too. <b>They cost the same</b>.", "Work out 2 at " + P(1.25) + " first."),
          ez: { why: "Both are " + P(2.5) + ". <b>They cost the same</b>." },
          medium: D(["Buy 3 singles", PD + "3.15 each"], ["3 for", PD + "9.45"], 9.45, 9.45, "3 at " + P(3.15) + " is " + P(9.45) + ", exactly the deal price. <b>They cost the same</b>.", "Work out 3 at " + P(3.15) + " first."),
          spicy: D(["Pack of 4", "for " + PD + "3.60"], ["Pack of 9", "for " + PD + "8.10"], 0.9, 0.9, "A: " + P(3.6) + " &divide; 4 = 90p each. B: " + P(8.1) + " &divide; 9 = 90p each. <b>They cost the same</b>.", "Work out the price of one in each deal.") }
      ];
    })(), { fixed: true }),

    S("num", "Shopping trip", (function(){
      function split(bill, n, tip){
        var t = tip ? r2(bill * (1 + tip / 100)) : bill, each = r2(t / n), raw = t / n;
        var boxes = tip ? [pb("Bill with the tip", t), pb("Each person pays", each)] : [pb("Each person pays", each)];
        var lo = Math.floor(raw * 100) / 100, hi = Math.ceil(raw * 100) / 100, up = each > lo + 1e-9;
        var sl = tip ? [[1, r2(bill / n), "That shares the bill before the tip. Add the " + tip + "% first."], [1, up ? lo : hi, "Check the rounding: the next digit is " + (up ? "5 or more, so round up." : "less than 5, so round down.")]] :
          [[r2(bill * n), "That multiplies. Share it instead."], [c(each), "That is in pence. The box is in pounds."], [r2(bill - n), "That takes away " + n + ". Share it equally instead."]];
        return N(tip ? n + " friends share a bill of " + P(bill) + " and add a " + tip + "% tip. What is the bill with the tip, and what does each person pay, to the nearest penny?" :
            (n === 2 ? "Jay buys a big bag of bird seed for " + P(bill) + " and shares the cost with a friend. How much does each pay?" : n + " friends share a bill of " + P(bill) + " equally. How much does each pay?"),
          boxes, sl, tip ? "10% of " + P(bill) + " is " + P(bill / 10) + (tip === 15 ? ", and 5% is half of that" : "") + ". Add the tip, then divide by " + n + "." : "Divide " + P(bill) + " by " + n + ". Think of it in pence if that helps.",
          (tip ? P(bill) + " + " + tip + "% = " + P(t) + ". " : "") + P(t) + " &divide; " + n + " = <b>" + P(each) + "</b> each." + (n === 2 ? " Bonnie does not pay. She has no pockets." : ""), "",
          tip ? null : { q: (n === 2 ? "Jay and a friend share " + P(bill) + "." : n + " friends share " + P(bill) + ".") + " How much each?",
            hint: n === 2 ? "Halve it." : "Divide by " + n + ".",
            why: P(t) + " &divide; " + n + " = <b>" + P(each) + "</b> each." + (n === 2 ? " Bonnie has no pockets." : ""),
            s: ["That multiplies. Share it instead.", "That is in pence. This box is pounds.", "That takes away. Share it instead."] });
      }
      return [
        { mild: split(9, 2), medium: split(27.6, 3), spicy: split(55.3, 3, 10) },
        { mild: split(6.4, 2), medium: split(34.4, 4), spicy: split(72.5, 3, 10) },
        { mild: split(5.5, 2), medium: split(45.5, 5), spicy: split(38.4, 7, 15) }
      ];
    })())
  ],

  ez: {
    realWorld: { title: "Old money", html: "<p>In 1970, a pound was 240 pennies!</p><p>A price could look like <b>2/6</b>. Tricky change for a time traveller.</p>" },
    make: { intro: "Make a shop receipt. It adds it all up for you.", fields: [null, null, { label: "Price of thing 1 in pounds" }, null, { label: "Price of thing 2 in pounds" }, { label: "Paid with, in pounds" }] }
  },

  realWorld: {
    title: "Money changes over time",
    html: "<p>You use this every time you shop, check a receipt, split a bill or save up for something.</p>" +
      "<p>For our big question: if you travelled back to 1970, your money would make no sense there. Britain only went decimal in 1971. Before that, a pound was 240 pennies, and a price might be written <b>2/6</b>: two shillings and sixpence, which became 12 and a half new pence. Would you trust yourself with the change?</p>",
    fig: '<svg viewBox="0 0 520 180" role="img" aria-label="A price tag from 1970 reading 2 shillings and 6 pence, a time portal, and a tag from 1971 reading 12 and a half pence">' +
      '<rect width="520" height="180" rx="16" fill="#f4f1ea"/>' +
      '<path d="M30 50h150l30 40l-30 40h-150z" fill="#e8d9b5" stroke="#141a33" stroke-width="3" stroke-linejoin="round"/>' + T(46, 80, "1970", 14, { b: 1 }) + T(46, 112, "2/6", 26, { b: 1 }) +
      A.portal(260, 90, 46) +
      '<path d="M330 50h150l30 40l-30 40h-150z" fill="#ffd23f" stroke="#141a33" stroke-width="3" stroke-linejoin="round"/>' + T(346, 80, "1971", 14, { b: 1 }) + T(346, 112, "12 1/2p", 22, { b: 1 }) + '</svg>'
  },

  make: {
    title: "Make a receipt",
    intro: "Your own shop, two things to buy, and what you pay with. The receipt works out the total and the change, written the right way. Keep it, stick it up or send it to Jay.",
    fields: [
      { id: "shop", label: "Shop name", ph: "Base 5 Bird Supplies", max: 24 },
      { id: "i1", label: "Thing 1", ph: "Bird seed", max: 18 },
      { id: "p1", label: "Price of thing 1 (pounds, like 3.45)", ph: "3.45", max: 7 },
      { id: "i2", label: "Thing 2", ph: "Squeaky toy for Bonnie", max: 22 },
      { id: "p2", label: "Price of thing 2 (pounds)", ph: "1.80", max: 7 },
      { id: "paid", label: "Paid with (pounds)", ph: "10", max: 6 }
    ],
    svg: function(v){
      function e(t){ return String(t).replace(/[&<>]/g, function(ch){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch]; }); }
      function num(t){ var n = parseFloat(String(t).replace(/[^0-9.]/g, "")); return isNaN(n) ? 0 : r2(n); }
      var p1 = num(v.p1), p2 = num(v.p2), paid = num(v.paid), t = r2(p1 + p2), ch = r2(paid - t);
      function row(y, a, b, big){ return '<text x="150" y="' + y + '" ' + F + ' font-size="' + (big ? 22 : 18) + '"' + (big ? ' font-weight="700"' : '') + ' fill="#141a33">' + a + '</text><text x="450" y="' + y + '" ' + F + ' font-size="' + (big ? 22 : 18) + '" font-weight="700" text-anchor="end" fill="#141a33">' + b + '</text>'; }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">' +
        '<rect width="600" height="420" rx="24" fill="#e8f7ff"/>' +
        '<path d="M120 20h360v360' + (function(){ var z = ""; for(var i = 0; i < 24; i++) z += i % 2 ? "l-15 -12" : "l-15 12"; return z; })() + 'z" fill="#ffffff" stroke="#141a33" stroke-width="3"/>' +
        '<text x="300" y="64" ' + F + ' font-size="22" font-weight="700" text-anchor="middle" fill="#141a33">' + e(v.shop) + '</text>' +
        '<path d="M150 84h300" stroke="#141a33" stroke-width="2"/>' +
        row(124, e(v.i1), P(p1)) + row(160, e(v.i2), P(p2)) +
        '<path d="M150 182h300" stroke="#141a33" stroke-width="2" stroke-dasharray="6 5"/>' +
        row(218, "TOTAL", P(t), true) + row(260, "Paid", P(paid)) +
        (ch >= 0 ? row(300, "Change", P(ch), true) : '<text x="300" y="300" ' + F + ' font-size="18" font-weight="700" text-anchor="middle" fill="#8a5cf6">Not quite enough yet: ' + P(-ch) + ' more</text>') +
        '<text x="300" y="346" ' + F + ' font-size="15" text-anchor="middle" fill="#5b6180">Thank you for shopping</text>' +
        '</svg>';
    }
  }
};
})();
