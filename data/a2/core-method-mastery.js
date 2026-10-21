/* Base 5 core target activity: Method mastery.
   Maths. Mental and written methods for multiplying and dividing
   whole numbers and decimals: split it, double and halve, nudge to a
   near ten, grid and column multiplication, bus stop division, and
   using one known fact to find others. Replayable: most questions
   carry two extra versions (vary). ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"', INK = "#141a33";
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + (o.mono ? 'font-family="Courier New,Courier,monospace"' : F) + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || INK) + '">' + s + '</text>';
}
function pic(w, h, aria, inner){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + aria + '"><rect width="' + w + '" height="' + h + '" rx="16" fill="#f4f1ea"/>' + inner + '</svg>'; }
function r6(x){ return Math.round(x * 1e6) / 1e6; }
function fm(x){ return String(r6(x)); }
function mo(x){ return (Math.round(x * 100) / 100).toFixed(2); }
function sf1(x){ if(!x) return 0; var p = Math.pow(10, Math.floor(Math.log(Math.abs(x)) / Math.LN10 + 1e-9)); return r6(Math.round(x / p) * p); }
function noCarry(ai, b){ var s = String(ai), out = String(+s.charAt(0) * b); for(var i = 1; i < s.length; i++) out += String((+s.charAt(i) * b) % 10); return +out; }
function dps(x){ var s = fm(x), i = s.indexOf("."); return i < 0 ? 0 : s.length - i - 1; }
var X = " &times; ", D = " &divide; ", SX = " &#215; ", SD = " &#247; ";
/* text that squashes itself to fit a width, for the make card */
function fit(x, y, t, size, w, o){ var s = esc(t), est = s.length * size * 0.72; return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + size + '"' + (o.b ? ' font-weight="700"' : '') + (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + o.c + '"' + (est > w ? ' textLength="' + w + '" lengthAdjust="spacingAndGlyphs"' : '') + '>' + s + '</text>'; }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 2); }
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }

/* one step built from up to three versions, each [medium, mild, spicy] */
function G(type, topic, sets, extra){
  function one(v){ var o = {}; Object.keys(v[0]).forEach(function(k){ o[k] = v[0][k]; }); o.lv = { mild: v[1], spicy: v[2] }; return o; }
  var s = { type: type, topic: topic }, b = one(sets[0]);
  Object.keys(b).forEach(function(k){ s[k] = b[k]; });
  if(sets.length > 1) s.vary = sets.slice(1).map(one);
  Object.keys(extra || {}).forEach(function(k){ s[k] = extra[k]; });
  return s;
}

/* ---------- pictures ---------- */

/* three ways to do it in your head */
function stratFig(p){
  var cols = ["#ffd23f", "#22b8e6", "#19c39a"], names = ["Split it", "Double and halve", "Nudge it"];
  return pic(600, 250, "Three ways to multiply in your head: split it, double and halve, nudge it",
    p.map(function(lines, k){
      var x = 16 + k * 192;
      return '<rect x="' + x + '" y="16" width="180" height="198" rx="14" fill="' + cols[k] + '" fill-opacity=".3" stroke="' + INK + '" stroke-width="2"/>' +
        T(x + 90, 44, names[k], 16, { b: 1, a: "middle" }) +
        lines.map(function(l, j){ return T(x + 90, 82 + j * 30, l, j === 0 || j === lines.length - 1 ? 16 : 14, { a: "middle", b: j === lines.length - 1 }); }).join("");
    }).join("") +
    A.egg(A.bird(560, 234, 0.5, "#ff5d5d"), "A robin doing 2 x 2 in its head. Four worms. Jay says that is the bird version of mental maths."));
}

/* area model for splitting: t and o across the top, b down the side */
function partFig(t, o, b, hide){
  var W = 360, wt = Math.max(150, Math.min(290, W * t / (t + o))), wo = W - wt, x0 = 110, y0 = 54, hh = 92;
  return pic(520, 230, "A rectangle split into two parts to multiply " + fm(t + o) + " by " + b,
    '<rect x="' + x0 + '" y="' + y0 + '" width="' + wt + '" height="' + hh + '" fill="#ffd23f" fill-opacity=".55" stroke="' + INK + '" stroke-width="2.5"/>' +
    '<rect x="' + (x0 + wt) + '" y="' + y0 + '" width="' + wo + '" height="' + hh + '" fill="#22b8e6" fill-opacity=".45" stroke="' + INK + '" stroke-width="2.5"/>' +
    T(x0 + wt / 2, y0 - 12, fm(t), 17, { b: 1, a: "middle" }) + T(x0 + wt + wo / 2, y0 - 12, fm(o), 17, { b: 1, a: "middle" }) +
    T(x0 - 12, y0 + hh / 2 + 6, String(b), 17, { b: 1, a: "end" }) +
    T(x0 + wt / 2, y0 + hh / 2 + 7, fm(t * b), 19, { b: 1, a: "middle" }) +
    T(x0 + wt + wo / 2, y0 + hh / 2 + 7, hide ? "?" : fm(o * b), 19, { b: 1, a: "middle", c: hide ? "#b03030" : INK }) +
    T(260, 196, hide ? fm(t * b) + " + ? = ?" : fm(t * b) + " + " + fm(o * b) + " = " + fm((t + o) * b), 18, { b: 1, a: "middle" }));
}

/* grid method: A split into tens and ones across, B down; hideRow hides the bottom row */
function gridFig(A_, B_, hideRow, note){
  var at = Math.floor(A_ / 10) * 10, ao = A_ % 10, bt = Math.floor(B_ / 10) * 10, bo = B_ % 10;
  var cols = at ? [at, ao] : [ao], rows = bt ? [bt, bo] : [bo];
  var cw = 120, ch = 52, x0 = 260 - cols.length * cw / 2 + 20, y0 = 50, out = "";
  out += '<rect x="' + (x0 - 70) + '" y="' + (y0 - 38) + '" width="66" height="34" rx="8" fill="#141a33"/>' + T(x0 - 37, y0 - 15, "&#215;", 18, { b: 1, a: "middle", c: "#ffffff" });
  cols.forEach(function(c, i){ out += T(x0 + i * cw + cw / 2, y0 - 14, String(c), 18, { b: 1, a: "middle" }); });
  rows.forEach(function(r, j){
    out += T(x0 - 37, y0 + j * ch + ch / 2 + 6, String(r), 18, { b: 1, a: "middle" });
    cols.forEach(function(c, i){
      var hid = hideRow && (rows.length > 1 ? j === rows.length - 1 : i === cols.length - 1);
      out += '<rect x="' + (x0 + i * cw) + '" y="' + (y0 + j * ch) + '" width="' + cw + '" height="' + ch + '" fill="' + (hid ? "#ffffff" : (i ? "#22b8e6" : "#ffd23f")) + '" fill-opacity="' + (hid ? 1 : 0.4) + '" stroke="' + INK + '" stroke-width="2.5"/>' +
        T(x0 + i * cw + cw / 2, y0 + j * ch + ch / 2 + 7, hid ? "?" : String(c * r), 19, { b: 1, a: "middle", c: hid ? "#b03030" : INK });
    });
  });
  var h = y0 + rows.length * ch + 58;
  return pic(520, h, "Grid method for " + A_ + " times " + B_, out + T(260, h - 22, note || "Add every box to get the answer.", 16, { b: 1, a: "middle" }));
}

/* short division (bus stop) */
function shortDiv(ds, d){
  var out = [], r = 0;
  for(var i = 0; i < ds.length; i++){
    var ch = ds.charAt(i);
    if(ch === "."){ out.push({ point: true }); continue; }
    var cur = r * 10 + (+ch), q = Math.floor(cur / d); r = cur % d;
    out.push({ cur: cur, qd: q, r: r, digit: ch });
  }
  return out;
}
function busFig(ds, d, show, note, egg){
  var st = shortDiv(ds, d), cw = 44, x0 = 170, y0 = 120, n = 0, out = "";
  out += T(x0 - 26, y0, String(d), 34, { b: 1, a: "middle" });
  out += '<path d="M' + (x0 - 6) + ' ' + (y0 + 12) + 'q14 -24 0 -50h' + (st.length * cw + 20) + '" fill="none" stroke="' + INK + '" stroke-width="3.5"/>';
  st.forEach(function(s, i){
    var cx = x0 + 22 + i * cw;
    if(s.point){ out += T(cx, y0, ".", 34, { b: 1, a: "middle" }) + T(cx, y0 - 58, ".", 34, { b: 1, a: "middle", c: "#1f9d63" }); return; }
    var prev = null; for(var k = i - 1; k >= 0; k--) if(!st[k].point){ prev = st[k]; break; }
    out += T(cx, y0, s.digit, 34, { b: 1, a: "middle" });
    if(prev && prev.r && n <= show) out += T(cx - 16, y0 - 18, String(prev.r), 16, { b: 1, a: "middle", c: "#b03030" });
    if(n < show) out += T(cx, y0 - 58, String(s.qd), 34, { b: 1, a: "middle", c: "#1f9d63" });
    else if(show >= 0) out += T(cx, y0 - 58, "?", 30, { b: 1, a: "middle", c: "#9aa0b8" });
    n++;
  });
  return pic(520, 200, "Short division of " + ds + " by " + d, out + T(260, 182, note || "", 15, { b: 1, a: "middle" }) + (!egg ? "" :
    A.egg('<g transform="translate(470 40)">' + A.bird(0, 0, 0.5, "#19c39a") + '</g>', "This bird is waiting for the bus. It has been waiting since 2019. It is a bus stop joke.")));
}

/* a column multiplication on paper, right aligned */
function colFig(lines, note){
  var out = "", x = 330, y = 46;
  lines.forEach(function(l){
    if(l === "-"){ out += '<path d="M' + (x - 150) + ' ' + (y - 16) + 'H' + (x + 6) + '" stroke="' + INK + '" stroke-width="2.5"/>'; y += 6; return; }
    out += T(x, y, l, 24, { b: 1, a: "end", mono: 1 }); y += 34;
  });
  return pic(520, y + 34, "A column multiplication written out", '<rect x="150" y="14" width="220" height="' + (y - 14) + '" rx="6" fill="#ffffff" stroke="' + INK + '" stroke-opacity=".3" stroke-width="2"/>' +
    out + A.jay(440, y - 70, 0.6, "hmm") + T(260, y + 18, note || "", 14, { a: "middle" }));
}

/* estimate, work it out, check */
var FLOW = pic(600, 200, "Estimate, then work it out, then check",
  [["Estimate", "#ffd23f", "About 14 x 4", "= 56"], ["Work it out", "#22b8e6", "14 x 3.65", "= 51.10"], ["Check", "#19c39a", "Is 51.10 near 56?", "Yes, near enough"]].map(function(c, k){
    var x = 20 + k * 196;
    return '<rect x="' + x + '" y="20" width="168" height="110" rx="14" fill="' + c[1] + '" fill-opacity=".35" stroke="' + INK + '" stroke-width="2"/>' +
      T(x + 84, 48, c[0], 16, { b: 1, a: "middle" }) + T(x + 84, 82, c[2], 14, { a: "middle" }) + T(x + 84, 108, c[3], 14, { b: 1, a: "middle" }) +
      (k < 2 ? '<path d="M' + (x + 172) + ' 75h20l-6 -6M' + (x + 192) + ' 75l-6 6" stroke="' + INK + '" stroke-width="3" fill="none"/>' : "");
  }).join("") + A.bonnie(70, 158, 0.42, "stand") + T(110, 178, "Bonnie checks every receipt. She cannot read, but she tries.", 13, {}));

/* ---------- question makers ---------- */

function partFade(t, o, b){
  var P1 = r6(t * b), P2 = r6(o * b), tot = r6((t + o) * b);
  var sl = [[1, r6(P1 + o), "It looks like the " + fm(o) + " was added on rather than multiplied. Both parts get multiplied by " + b + "."],
            [1, P1, "That is just the first part. Add on " + fm(o) + X + b + " as well."]];
  if(o < 1){ sl.push([0, r6(P2 * 10), fm(o) + " is a tenth of " + fm(o * 10) + ", so " + fm(o) + X + b + " is a tenth of " + fm(o * 10 * b) + "."]);
    sl.push([1, r6(P1 + P2 * 10), "Check the decimal part: " + fm(o) + X + b + " is " + fm(P2) + ", not " + fm(P2 * 10) + "."]); }
  return { q: "Split <b>" + fm(t + o) + X + b + "</b> into " + fm(t) + " and " + fm(o) + ". The first part is done for you: " + fm(t) + X + b + " = " + fm(P1) + ". Have a go at the rest.",
    fig: partFig(t, o, b, true),
    boxes: [{ label: fm(o) + X + b + " =", a: P2 }, { label: "Total", a: tot }],
    slips: sl, hint: "Multiply " + fm(o) + " by " + b + ", then add the two parts together.",
    why: fm(t) + X + b + " = " + fm(P1) + " and " + fm(o) + X + b + " = " + fm(P2) + ". Together that is <b>" + fm(tot) + "</b>." };
}
function mcNear(n, b, R){
  var Dd = r6(R - n), opt = [fm(R) + X + b + ", then take away " + fm(Dd * b), fm(R) + X + b + ", then take away " + fm(Dd), fm(R) + X + b + ", then add " + fm(Dd * b)];
  return { q: "Nudge it to a friendly number. Which of these gives <b>" + fm(n) + X + b + "</b>?",
    options: opt, answer: 0,
    slips: { 1: "You nudged " + fm(n) + " up by " + fm(Dd) + ", but you did that " + b + " times (once for each lot). So take away " + b + " lots of " + fm(Dd) + ", which is " + fm(Dd * b) + ".",
             2: fm(R) + " is bigger than " + fm(n) + ", so " + fm(R) + X + b + " is too big. Take away, do not add." },
    hint: "You made " + fm(n) + " a bit bigger, " + b + " times over.",
    why: fm(R) + X + b + " = " + fm(R * b) + ". You added " + fm(Dd) + " to each of the " + b + " lots, so take away " + fm(Dd * b) + ": <b>" + fm(n * b) + "</b>." };
}
function numNear(n, b, R){
  var Dd = r6(R - n), ans = r6(n * b);
  return { q: "Work out <b>" + fm(n) + X + b + "</b> in your head. Nudging " + fm(n) + " to " + fm(R) + " might help.",
    boxes: [{ label: fm(n) + X + b + " =", a: ans }],
    slips: [[r6(R * b - Dd), "Nearly. You took away " + fm(Dd) + " once, but there are " + b + " lots of it. Take away " + fm(Dd * b) + "."],
            [r6(R * b), "That is " + fm(R) + X + b + ". Now take away the extra bit: " + fm(Dd) + X + b + "."],
            [r6(R * b + Dd * b), fm(R) + " is bigger than " + fm(n) + ", so take the extra away instead of adding it."]],
    hint: fm(R) + X + b + ", then take away " + b + " lots of " + fm(Dd) + ".",
    why: fm(R) + X + b + " = " + fm(R * b) + ", take away " + fm(Dd * b) + ", gives <b>" + fm(ans) + "</b>." };
}
function halveDouble(a, b){
  var ans = r6(a * b);
  return { q: "Make <b>" + fm(a) + X + b + "</b> friendlier: halve " + fm(a) + " and double " + b + ". The answer stays the same.",
    boxes: [{ label: "Half of " + fm(a), a: r6(a / 2) }, { label: "Double " + b, a: 2 * b }, { label: "So " + fm(a) + X + b + " =", a: ans }],
    slips: [[2, r6(ans / 4), "It looks like both numbers were halved. Halve one and double the other, so it balances."],
            [2, r6(ans * 4), "It looks like both numbers were doubled. Halve one and double the other."],
            [0, r6(a * 2), "That doubled " + fm(a) + ". This one gets halved."]],
    hint: "Halving one number and doubling the other keeps the answer the same. Keep going if it helps.",
    why: fm(a / 2) + X + (2 * b) + " is the same as " + fm(a) + X + b + ". It comes to <b>" + fm(ans) + "</b>." };
}
function gridFade(A_, B_, dp){
  var at = Math.floor(A_ / 10) * 10, ao = A_ % 10, bt = Math.floor(B_ / 10) * 10, bo = B_ % 10, P = A_ * B_;
  var Av = dp ? r6(A_ / 10) : A_, ans = dp ? r6(P / 10) : P, boxes, sl;
  if(bt){
    boxes = [{ label: at + X + bo + " =", a: at * bo }, { label: ao + X + bo + " =", a: ao * bo }, { label: A_ + X + B_ + " =", a: P }];
    sl = [[0, (at / 10) * bo, at + " is " + (at / 10) + " tens, so " + at + X + bo + " is " + (at * bo) + "."], [2, P - ao * bo, "One box is missing from the total. Add all four boxes."], [2, at * bt + ao * bt, "That is only the top row. Add the bottom row too."]];
  } else {
    boxes = [{ label: ao + X + bo + " =", a: ao * bo }, { label: A_ + X + B_ + " =", a: P }];
    sl = [[1, at * bo + ao, "It looks like the " + ao + " was added on. It needs multiplying by " + bo + " too."], [1, at * bo, "That is only the first box. Add on " + ao + X + bo + "."]];
  }
  if(dp){ boxes.push({ label: "So " + fm(Av) + X + B_ + " =", a: ans });
    sl.push([boxes.length - 1, P, "Nearly there. " + fm(Av) + " has one decimal place, so the answer needs one too."]);
    sl.push([boxes.length - 1, r6(P / 100), "Count the decimal places in the question: just one, so one in the answer."]); }
  return { q: (dp ? "Find <b>" + fm(Av) + X + B_ + "</b>. Do " + A_ + X + B_ + " on the grid first" : "Grid method for <b>" + A_ + X + B_ + "</b>. The top row is done for you") +
      (dp ? " (the top row is done), then put the point back." : ". Have a go at the rest."),
    fig: gridFig(A_, B_, true, bt ? "Top row: " + (at * bt) + " and " + (ao * bt) + ". Bottom row: your turn." : "First box: " + (at * bo) + ". Second box: your turn."),
    boxes: boxes, slips: sl,
    hint: "Each box is the number on top times the number at the side. Then add every box.",
    why: (bt ? at + X + bt + " = " + (at * bt) + ", " + ao + X + bt + " = " + (ao * bt) + ", " + at + X + bo + " = " + (at * bo) + ", " + ao + X + bo + " = " + (ao * bo) + ". " :
      at + X + bo + " = " + (at * bo) + " and " + ao + X + bo + " = " + (ao * bo) + ". ") + "Total " + P + "." + (dp ? " One decimal place: <b>" + fm(ans) + "</b>." : " So <b>" + P + "</b>.") };
}
function mulInd(a, b){
  var da = dps(a), db = dps(b), ai = Math.round(a * Math.pow(10, da)), bi = Math.round(b * Math.pow(10, db)), dp = da + db, ans = r6(a * b), sc = Math.pow(10, dp);
  var sl = [];
  if(bi < 10 && !dp && noCarry(ai, bi) !== ans) sl.push([noCarry(ai, bi), "Looks like a carry went missing. When a column makes 10 or more, write the ones and carry the tens to the next column."]);
  if(bi >= 10){ var noZero = r6((ai * (bi % 10) + ai * Math.floor(bi / 10)) / sc); if(noZero !== ans) sl.push([noZero, "Check the tens row: it is " + ai + X + (Math.floor(bi / 10) * 10) + ", so it needs a zero placeholder at the end."]); }
  if(dp){ sl.push([r6(ans * 10), "The digits are right. Count the decimal places: " + dp + " in the question, so " + dp + " in the answer."]);
          sl.push([r6(ans / 10), "The digits are right. Count the decimal places: " + dp + " in the question, so " + dp + " in the answer."]);
          if(ai * bi !== ans * 10 && ai * bi !== ans / 10) sl.push([ai * bi, "That is " + ai + X + bi + ". Now put the decimal point back in: " + dp + " decimal place" + (dp > 1 ? "s" : "") + "."]); }
  return { q: "Work out <b>" + fm(a) + X + fm(b) + "</b>. Grid or column, whichever suits you." + (dp ? " Ignore the points first, then put them back." : ""),
    boxes: [{ label: "Answer", a: ans }], slips: sl,
    hint: dp ? "Do " + ai + X + bi + ", then count the decimal places in the question." : "Split " + bi + " into parts, multiply each part, then add.",
    why: (dp ? ai + X + bi + " = " + (ai * bi) + ". There " + (dp > 1 ? "are " + dp + " decimal places" : "is 1 decimal place") + " in the question, so the answer is <b>" + fm(ans) + "</b>." :
      bi >= 10 ? ai + X + (bi - bi % 10) + " = " + ai * (bi - bi % 10) + " and " + ai + X + (bi % 10) + " = " + ai * (bi % 10) + ". Add them: <b>" + fm(ans) + "</b>." :
      fm(a) + X + fm(b) + " = <b>" + fm(ans) + "</b>.") + " Estimate to check: about " + fm(sf1(a)) + X + fm(sf1(b)) + " = " + fm(sf1(a) * sf1(b)) + "." };
}
function mcDp(a, b, a2, b2){
  var P = r6(a * b), ans = r6(a2 * b2), opts = [ans, r6(ans * 10), r6(ans / 10), r6(ans * 100)];
  var say = {}; say[1] = "That is ten times too big."; say[2] = "That is ten times too small."; say[3] = "That is a hundred times too big.";
  var how = " Compare " + fm(a2) + X + fm(b2) + " with " + fm(a) + X + fm(b) + ": count the decimal places (or the zeros) and move the digits that many places.";
  return { q: fm(a) + X + fm(b) + " = " + fm(P) + ". Use that to find <b>" + fm(a2) + X + fm(b2) + "</b>.",
    options: opts.map(fm), answer: 0,
    slips: { 1: say[1] + how, 2: say[2] + how, 3: say[3] + how },
    hint: "Same digits. The only question is where the point goes. A rough estimate helps.",
    why: "Same digits as " + fm(P) + ". " + fm(a2) + X + fm(b2) + " = <b>" + fm(ans) + "</b>." };
}
function divFade(ds, d){
  var st = shortDiv(ds, d).filter(function(s){ return !s.point; }), give = st[0].qd === 0 ? 2 : 1, nx = st[give], ans = r6(parseFloat(ds) / d);
  var said = st.slice(0, give).map(function(s){ return s.cur + D + d + " = " + s.qd + (s.r ? " remainder " + s.r + ", so carry the " + s.r : "") + "."; }).join(" ");
  var sl = nx.r ? [[0, nx.r, "That is the remainder. The digit on top is how many whole " + d + "s fit into " + nx.cur + "."]] : [];
  var nc = +ds.replace(".", "").split("").map(function(c){ return Math.floor(+c / d); }).join(""); if(ds.indexOf(".") < 0 && nc !== ans) sl.push([1, nc, "Looks like a remainder did not get carried. Carry what is left over to the next digit."]);
  if(ds.indexOf(".") >= 0) sl.push([1, r6(ans * 10), "Keep the decimal point on top lined up with the point underneath."]);
  return { q: "Bus stop for <b>" + ds + D + d + "</b>. Done for you: " + said + " Have a go at the next digit, then the whole answer.",
    fig: busFig(ds, d, give, "The small red numbers are the carries."),
    boxes: [{ label: nx.cur + D + d + " =", a: nx.qd }, { label: "So " + ds + D + d + " =", a: ans }], slips: sl,
    hint: "How many " + d + "s fit into " + nx.cur + "? Any remainder is carried to the next digit.",
    why: st.map(function(s){ return s.cur + D + d + " = " + s.qd + (s.r ? " r " + s.r : ""); }).join(", ") + ". So the answer is <b>" + fm(ans) + "</b>. Check: " + fm(ans) + X + d + " = " + ds + "." };
}
function divInd(ds, d){
  var ans = r6(parseFloat(ds) / d), st = shortDiv(ds, d), qs = "", lead = true;
  st.forEach(function(s){ if(s.point){ qs += "."; lead = false; return; } if(lead && s.qd === 0 && qs === "") return; lead = false; qs += s.qd; });
  var sl = [], nz = parseFloat(qs.replace(/(\d)0(?=\d)/g, "$1"));
  if(!isNaN(nz) && r6(nz) !== ans) sl.push([nz, "A zero went missing. When " + d + " does not go into a number, write 0 on top and carry the whole number."]);
  var nc = +ds.split("").map(function(c){ return Math.floor(+c / d); }).join("");
  if(ds.indexOf(".") < 0 && nc !== ans && nc !== nz) sl.push([nc, "Looks like a remainder did not get carried. Carry what is left over to the next digit."]);
  if(ds.indexOf(".") >= 0){ sl.push([r6(ans * 10), "Keep the decimal point on top lined up with the point underneath."]); sl.push([r6(ans / 10), "Keep the decimal point on top lined up with the point underneath."]); }
  return { q: "Work out <b>" + fm(parseFloat(ds)) + D + d + "</b>." + (ds !== fm(parseFloat(ds)) ? " If it does not finish, put a zero on the end and keep going." : ""),
    boxes: [{ label: "Answer", a: ans }], slips: sl,
    hint: "Bus stop: one digit at a time, carrying the remainder.",
    why: st.filter(function(s){ return !s.point; }).map(function(s){ return s.cur + D + d + " = " + s.qd + (s.r ? " r " + s.r : ""); }).join(", ") + ". Answer <b>" + fm(ans) + "</b>." };
}
function divMoney(a, n){
  var ans = r6(a / n);
  return { q: "&pound;" + mo(a) + " is shared equally between " + n + " of [[who]]. How much each?",
    boxes: [{ label: "Each", a: ans, pre: "&pound;", show: mo(ans) }],
    slips: [[r6(ans * 10), "Keep the point lined up: " + mo(a) + D + n + " is about " + fm(Math.round(a / n)) + "."], [r6(ans / 10), "Too small. Estimate: " + mo(a) + D + n + " is about " + fm(Math.round(a / n)) + "."], [r6(ans * 100), "That is in pence. Write it in pounds: &pound;" + mo(ans) + "."]],
    hint: "Bus stop, with the point on top lined up with the point underneath.",
    why: mo(a) + D + n + " = <b>&pound;" + mo(ans) + "</b> each. Check: " + mo(ans) + X + n + " = " + mo(a) + "." };
}
function divDec(a, d){
  var k = dps(d), m = Math.pow(10, k), A2 = r6(a * m), D2 = r6(d * m), ans = r6(a / d);
  var sl = [[r6(a / D2), "You changed " + fm(d) + " into " + fm(D2) + " but left " + fm(a) + " alone. Do the same to both: " + fm(A2) + D + fm(D2) + "."], [r6(ans / 10), "Ten times too small. Dividing by a number less than 1 makes the answer bigger."]];
  if(k > 1) sl.push([r6(ans / 100), "Both numbers need multiplying by " + m + " here, because " + fm(d) + " has " + k + " decimal places."]);
  var seen = {}; sl = sl.filter(function(r){ if(seen[r[0]]) return false; seen[r[0]] = 1; return true; });
  return { q: "Work out <b>" + fm(a) + D + fm(d) + "</b>. Tip: multiply both numbers by " + (k > 1 ? m : "10") + " first, so you divide by a whole number.",
    boxes: [{ label: "Answer", a: ans }], slips: sl,
    hint: fm(a) + D + fm(d) + " is the same as " + fm(A2) + D + fm(D2) + ".",
    why: fm(a) + D + fm(d) + " = " + fm(A2) + D + fm(D2) + " = <b>" + fm(ans) + "</b>. Check: " + fm(ans) + X + fm(d) + " = " + fm(a) + "." };
}
function mcCheck(a, d){
  var q = r6(a / d);
  return { q: "Bonnie (somehow) worked out <b>" + fm(a) + D + fm(d) + " = " + fm(q) + "</b>. Which check would show it is right?",
    options: [fm(q) + X + fm(d) + " = " + fm(a), fm(a) + X + fm(d) + " = " + fm(a * d), fm(q) + " + " + fm(d) + " = " + fm(q + d)], answer: 0,
    slips: { 1: "That makes an even bigger number. It does not undo the divide.", 2: "Adding does not undo dividing. Multiplying does." },
    hint: "What undoes a divide?",
    why: "Multiplying undoes dividing. " + fm(q) + X + fm(d) + " = " + fm(a) + ", so Bonnie is right. Good dog." };
}
function moneyMul(n, p, per){
  var ans = r6(n * p);
  return { q: per ? "[[Who]] buys " + fm(n) + " metres of [[line]] at &pound;" + mo(p) + " per metre. What is the cost?" : "[[Who]] buys " + n + " [[items]] at &pound;" + mo(p) + " each. What is the total?",
    boxes: [{ label: "Total", a: ans, pre: "&pound;", show: mo(ans) }],
    slips: [[r6(ans * 100), "That looks like pence. Write it in pounds: &pound;" + mo(ans) + "."], [r6(ans * 10), "Ten times too big. Estimate: about " + fm(Math.round(n)) + X + fm(Math.round(p)) + " = " + fm(Math.round(n) * Math.round(p)) + "."], [r6(ans / 10), "Ten times too small. Estimate: about " + fm(Math.round(n)) + X + fm(Math.round(p)) + " = " + fm(Math.round(n) * Math.round(p)) + "."]],
    hint: "Estimate first, then work it out. Your answer should be near the estimate.",
    why: fm(n) + X + mo(p) + " = <b>&pound;" + mo(ans) + "</b>. Estimate: " + fm(Math.round(n)) + X + fm(Math.round(p)) + " = " + fm(Math.round(n) * Math.round(p)) + ", close enough." };
}
function known(a, b, m1, m2, d1, d2){
  var P = a * b, x = r6(m1 * m2), y = r6(d1 / d2);
  return { q: "You know <b>" + a + X + b + " = " + P + "</b>. Use it to find these, no starting from scratch.",
    boxes: [{ label: fm(m1) + X + fm(m2) + " =", a: x }, { label: fm(d1) + D + fm(d2) + " =", a: y }],
    slips: [[0, r6(x * 10), "Same digits, but ten times too big. Count the decimal places (or the zeros)."], [0, r6(x / 10), "Same digits, but ten times too small. Count the decimal places (or the zeros)."],
            [1, r6(y * 10), "Ten times too big. Check: does your answer " + X.trim() + " " + fm(d2) + " make " + fm(d1) + "?"], [1, r6(y / 10), "Ten times too small. Check: does your answer " + X.trim() + " " + fm(d2) + " make " + fm(d1) + "?"]],
    hint: "Same digits every time. Ask how much bigger or smaller each number is than in the fact.",
    why: fm(m1) + X + fm(m2) + " = <b>" + fm(x) + "</b> and " + fm(d1) + D + fm(d2) + " = <b>" + fm(y) + "</b>. Every answer uses the digits of " + P + " or " + a + "." };
}
function change(have, n, p){
  var cost = r6(n * p), ans = r6(have - cost);
  return { q: "[[Who]] has &pound;" + mo(have) + " and buys " + n + " [[items]] at &pound;" + mo(p) + " each. How much is left?",
    boxes: [{ label: "Left", a: ans, pre: "&pound;", show: mo(ans) }],
    slips: [[cost, "That is the cost. Now take it away from &pound;" + mo(have) + "."], [r6(have - p), "That is only one of them. There are " + n + "."], [r6(have + cost), "Buying things leaves less money, so take away."]],
    hint: "Two steps: the cost first, then what is left.",
    why: n + X + mo(p) + " = &pound;" + mo(cost) + ". Then " + mo(have) + " take away " + mo(cost) + " = <b>&pound;" + mo(ans) + "</b>." };
}
function packs(per, pp, single, need){
  var a = r6(need * single), b = r6(need / per * pp), ans = r6(a - b);
  return { q: "A pack of " + per + " [[items]] costs &pound;" + mo(pp) + ". One on its own costs &pound;" + mo(single) + ". [[Who]] needs " + need + ". How much is saved by buying packs instead of singles?",
    boxes: [{ label: "Saved", a: ans, pre: "&pound;", show: mo(ans) }],
    slips: [[a, "That is the cost of " + need + " singles. Now work out the packs and find the difference."], [b, "That is the cost of the packs. The saving is the difference between the two ways."], [r6(per * single - pp), "That is the saving on one pack. [[Who]] needs " + (need / per) + " packs."]],
    hint: need + " singles cost " + need + X + mo(single) + ". You need " + (need / per) + " packs.",
    why: "Singles: " + need + X + mo(single) + " = &pound;" + mo(a) + ". Packs: " + (need / per) + X + mo(pp) + " = &pound;" + mo(b) + ". Saving: <b>&pound;" + mo(ans) + "</b>." };
}

(window.A2PACKS = window.A2PACKS || {})["core-method-mastery"] = {
  a2: true,
  id: "a2-core-method-mastery",
  title: "Method mastery",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 25,
  line: "Times and divide, your way: in your head, on a grid, or at the bus stop.",
  blurb: "Ways to multiply and divide, with whole numbers and decimals. Four short chunks: in your head, grid and column, bus stop division, then using it for real. You make a strategy badge at the end. Come back any time: the numbers change each go.",
  note: "Multiplying and dividing, whichever way suits you. Four five minute chunks and a strategy badge at the end. The numbers change every time you come back, so have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Apprentice", line: "Apprentice: whole numbers, times by one digit, friendly sharing." },
    { id: "medium", name: "Expert", line: "Expert: bigger whole numbers, two digit times two digit, and money." },
    { id: "spicy", name: "Grand master", line: "Grand master: decimals all the way, dividing by decimals, and using one fact to get loads more." }
  ],
  themes: {
    time: { name: "Time travel", w: { who: "the time crew", item: "time ticket", items: "time tickets", line: "rope" } },
    football: { name: "Football", w: { who: "the squad", item: "match ticket", items: "match tickets", line: "goal net cord" } },
    horror: { name: "Horror", w: { who: "the ghost hunters", item: "torch", items: "torches", line: "rope" } },
    fishing: { name: "Fishing", w: { who: "the angling club", item: "float", items: "floats", line: "fishing line" } },
    music: { name: "Music", w: { who: "the band", item: "set of strings", items: "sets of strings", line: "speaker cable" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: stratFig([["46 x 7", "40 x 7 = 280", "6 x 7 = 42", "= 322"], ["16 x 25", "= 8 x 50", "= 4 x 100", "= 400"], ["99 x 8", "100 x 8 = 800", "take away 8", "= 792"]]),
  steps: [

    /* ---------- chunk 1: in your head ---------- */
    { type: "learn", topic: "In your head", title: "Split it, double and halve, nudge it",
      fig: stratFig([["46 x 7", "40 x 7 = 280", "6 x 7 = 42", "= 322"], ["16 x 25", "= 8 x 50", "= 4 x 100", "= 400"], ["99 x 8", "100 x 8 = 800", "take away 8", "= 792"]]),
      html: "<p>Three tricks for doing it in your head. Pick whichever feels easiest for the numbers in front of you.</p>" +
        "<p><b>Split it:</b> break one number into friendly parts, multiply each part, add them up.</p>" +
        "<p><b>Double and halve:</b> halve one number and double the other. The answer stays the same, and the sum often gets much easier.</p>" +
        "<p><b>Nudge it:</b> move to a near ten (or a near whole number), multiply, then fix the extra bit.</p>",
      lv: {
        mild: { fig: stratFig([["23 x 4", "20 x 4 = 80", "3 x 4 = 12", "= 92"], ["14 x 5", "= 7 x 10", "", "= 70"], ["19 x 3", "20 x 3 = 60", "take away 3", "= 57"]]) },
        spicy: { fig: stratFig([["4.6 x 7", "4 x 7 = 28", "0.6 x 7 = 4.2", "= 32.2"], ["3.2 x 25", "= 1.6 x 50", "= 0.8 x 100", "= 80"], ["2.99 x 6", "3 x 6 = 18", "take away 0.06", "= 17.94"]]),
          html: "<p>The same three tricks work with decimals, and they are often quicker than writing it out.</p>" +
            "<p><b>Split it:</b> 4.6 is 4 and 0.6. Do each part. 0.6 &times; 7 is a tenth of 6 &times; 7.</p>" +
            "<p><b>Double and halve:</b> keep halving one number and doubling the other until you hit 10 or 100.</p>" +
            "<p><b>Nudge it:</b> 2.99 is 3 take away 0.01. Six lots of 3, take away six lots of 0.01.</p>" } } },

    G("num", "In your head", [
      [partFade(40, 6, 7), partFade(20, 3, 4), partFade(4, 0.6, 7)],
      [partFade(50, 8, 6), partFade(30, 4, 3), partFade(5, 0.8, 6)],
      [partFade(70, 3, 9), partFade(40, 2, 5), partFade(7, 0.3, 9)]
    ]),

    G("mc", "In your head", [
      [mcNear(99, 8, 100), mcNear(19, 4, 20), mcNear(2.99, 6, 3)],
      [mcNear(49, 6, 50), mcNear(29, 3, 30), mcNear(4.98, 5, 5)],
      [mcNear(199, 4, 200), mcNear(39, 2, 40), mcNear(5.99, 7, 6)]
    ]),

    G("num", "In your head", [
      [numNear(59, 7, 60), numNear(29, 3, 30), numNear(3.99, 4, 4)],
      [numNear(39, 6, 40), numNear(19, 5, 20), numNear(1.99, 7, 2)],
      [numNear(98, 5, 100), numNear(49, 2, 50), numNear(4.95, 4, 5)]
    ]),

    G("num", "In your head", [
      [halveDouble(16, 25), halveDouble(14, 5), halveDouble(3.2, 25)],
      [halveDouble(24, 25), halveDouble(18, 5), halveDouble(4.4, 25)],
      [halveDouble(14, 50), halveDouble(12, 5), halveDouble(0.6, 50)]
    ], { explain: true }),

    /* ---------- chunk 2: grid and column ---------- */
    { type: "learn", topic: "Grid and column", title: "Split both numbers into a grid",
      fig: gridFig(34, 26, false, "600 + 80 + 180 + 24 = 884"),
      html: "<p>For bigger numbers, split <b>both</b> numbers into tens and ones. Each box is one small times.</p>" +
        "<p>34 &times; 26: 30 &times; 20 = 600, 4 &times; 20 = 80, 30 &times; 6 = 180, 4 &times; 6 = 24. Add every box: <b>884</b>.</p>" +
        "<p>The column method does exactly the same sums, just stacked up. Use whichever you trust.</p>",
      lv: {
        mild: { fig: gridFig(36, 4, false, "120 + 24 = 144"),
          html: "<p>Split the bigger number into tens and ones. Each box is one small times.</p><p>36 &times; 4: 30 &times; 4 = 120 and 6 &times; 4 = 24. Add the boxes: <b>144</b>.</p>" },
        spicy: { fig: gridFig(34, 26, false, "34 x 26 = 884, so 3.4 x 2.6 = 8.84"),
          html: "<p>Decimals: take the points out, multiply the whole numbers, then put the points back.</p>" +
            "<p>3.4 &times; 2.6: first 34 &times; 26 = 884 (grid or column). The question has <b>two</b> decimal places altogether (one in 3.4, one in 2.6), so the answer has two: <b>8.84</b>.</p>" +
            "<p>Sense check: 3 &times; 3 = 9, and 8.84 is close. 88.4 would be outrageous.</p>" } } },

    G("num", "Grid and column", [
      [gridFade(43, 27, 0), gridFade(36, 3, 0), gridFade(43, 27, 1)],
      [gridFade(52, 34, 0), gridFade(47, 3, 0), gridFade(52, 34, 1)],
      [gridFade(65, 23, 0), gridFade(28, 5, 0), gridFade(65, 23, 1)]
    ]),

    G("num", "Grid and column", [
      [mulInd(58, 34), mulInd(64, 3), mulInd(2.8, 4.6)],
      [mulInd(47, 36), mulInd(53, 4), mulInd(3.6, 2.4)],
      [mulInd(73, 28), mulInd(38, 6), mulInd(5.3, 1.7)]
    ]),

    G("mc", "Grid and column", [
      [mcDp(26, 34, 2.6, 34), mcDp(13, 3, 13, 30), mcDp(26, 34, 2.6, 0.34)],
      [mcDp(37, 15, 3.7, 15), mcDp(21, 4, 21, 40), mcDp(37, 15, 0.37, 1.5)],
      [mcDp(48, 21, 48, 2.1), mcDp(12, 4, 120, 4), mcDp(48, 21, 4.8, 0.21)]
    ]),

    { type: "mc", topic: "Grid and column",
      q: "Jay did <b>58 &times; 34</b> in columns and got 406. He thinks something is up. Where did it slip?",
      fig: colFig(["58", "x  34", "-", "232", "174", "-", "406"], "Jay's working. Hmm."),
      options: ["The second row is 58 x 30, so it needs a 0 on the end: 1740", "58 x 4 is not 232", "He should have taken the rows away, not added them"],
      answer: 0,
      slips: { 1: "58 &times; 4 = 232 is right. Look at the second row: what is the 3 really worth?", 2: "The rows always get added. Each row is one part of the sum." },
      hint: "The 3 in 34 is in the tens column. What is it really worth?",
      why: "The 3 means 30, so the second row is 58 &times; 30 = 1740. Then 232 + 1740 = <b>1972</b>. An estimate (60 &times; 30 = 1800) would have caught it.",
      lv: {
        mild: { q: "Jay did <b>26 &times; 3</b> in columns and got 68. He thinks something is up. Where did it slip?",
          fig: colFig(["26", "x   3", "-", "68"], "Jay's working. Hmm."),
          options: ["6 x 3 = 18: he forgot to carry the 1 ten", "2 x 3 is not 6", "He should have added 26 and 3"],
          slips: { 1: "2 &times; 3 = 6 is right. Look at 6 &times; 3 first.", 2: "It is a times question, so adding will not help." },
          hint: "Start with the ones: what is 6 &times; 3?",
          why: "6 &times; 3 = 18: write the 8 and carry the 1. Then 2 &times; 3 = 6, plus the 1 carried, is 7. So <b>78</b>." },
        spicy: { q: "Jay did <b>2.7 &times; 4.3</b> and got 116.1. He thinks something is up. Where did it slip?",
          fig: colFig(["27", "x  43", "-", "81", "1080", "-", "1161", "= 116.1 ?"], "Jay's working. Hmm."),
          options: ["There are two decimal places in the question, so it should be 11.61", "27 x 43 is not 1161", "The 1080 row should be 108"],
          slips: { 1: "27 &times; 43 = 1161 is right. Look at where the point went.", 2: "The 4 means 40, so 27 &times; 40 = 1080 is right." },
          hint: "Estimate: about 3 &times; 4. Is 116.1 anywhere near?",
          why: "27 &times; 43 = 1161 is fine. 2.7 and 4.3 have one decimal place each, so two altogether: <b>11.61</b>. Estimate 3 &times; 4 = 12 agrees." } } },

    /* ---------- chunk 3: bus stop division ---------- */
    { type: "learn", topic: "Bus stop division", title: "One digit at a time, carry the rest",
      fig: busFig("852", 6, 9, "8 / 6 = 1 r 2, 25 / 6 = 4 r 1, 12 / 6 = 2. Answer 142.", true),
      html: "<p>Short division works left to right, one digit at a time.</p>" +
        "<p>852 &divide; 6: 6 into 8 goes <b>1</b>, remainder 2. Carry the 2 to make 25. 6 into 25 goes <b>4</b>, remainder 1. Carry the 1 to make 12. 6 into 12 goes <b>2</b>. Answer: <b>142</b>.</p>" +
        "<p>If it does not go, write <b>0</b> on top and carry the whole digit. Check by multiplying back: 142 &times; 6 = 852.</p>",
      lv: {
        mild: { fig: busFig("72", 4, 9, "7 / 4 = 1 r 3, then 32 / 4 = 8. Answer 18.", true),
          html: "<p>Short division works left to right, one digit at a time.</p><p>72 &divide; 4: 4 into 7 goes <b>1</b>, remainder 3. Carry the 3 to make 32. 4 into 32 goes <b>8</b>. Answer: <b>18</b>.</p><p>Check by multiplying back: 18 &times; 4 = 72.</p>" },
        spicy: { fig: busFig("45.6", 8, 9, "Point on top lines up with the point below. Answer 5.7.", true),
          html: "<p>With decimals, the point on top sits right above the point underneath. Everything else is the same.</p>" +
            "<p>45.6 &divide; 8: 8 into 4 does not go (0, carry 4). 8 into 45 goes <b>5</b> r 5. Carry to make 56. 8 into 56 goes <b>7</b>. Answer <b>5.7</b>.</p>" +
            "<p>Dividing <b>by</b> a decimal? Multiply both numbers by 10 (or 100) first. 9.6 &divide; 0.3 is the same as 96 &divide; 3 = 32.</p>" } } },

    G("num", "Bus stop division", [
      [divFade("936", 4), divFade("72", 4), divFade("45.6", 8)],
      [divFade("774", 3), divFade("96", 6), divFade("29.4", 7)],
      [divFade("852", 6), divFade("85", 5), divFade("38.4", 6)]
    ]),

    G("num", "Bus stop division", [
      [divInd("618", 6), divInd("65", 5), divInd("7.40", 4)],
      [divInd("832", 8), divInd("96", 8), divInd("13.80", 4)],
      [divInd("545", 5), divInd("84", 6), divInd("9.30", 6)]
    ]),

    G("num", "Bus stop division", [
      [divMoney(8.75, 5), divMoney(8.4, 2), divDec(9.6, 0.3)],
      [divMoney(9.36, 4), divMoney(6.8, 2), divDec(7.2, 0.4)],
      [divMoney(7.15, 5), divMoney(9.6, 3), divDec(4.5, 0.09)]
    ]),

    G("mc", "Bus stop division", [
      [mcCheck(744, 6), mcCheck(48, 4), mcCheck(5.58, 0.6)],
      [mcCheck(972, 9), mcCheck(65, 5), mcCheck(8.4, 0.7)],
      [mcCheck(856, 8), mcCheck(84, 7), mcCheck(1.56, 0.12)]
    ]),

    /* ---------- chunk 4: use it for real ---------- */
    { type: "learn", topic: "Use it for real", title: "Estimate, work it out, check",
      fig: FLOW,
      html: "<p>Real problems come in words. Three moves keep you safe:</p>" +
        "<p><b>Estimate</b> with rounded numbers, <b>work it out</b> with the method you trust, then <b>check</b> your answer is near the estimate.</p>" +
        "<p>Money has two decimal places, so &pound;51.1 is written &pound;51.10.</p>" },

    G("num", "Use it for real", [
      [moneyMul(14, 3.65), moneyMul(4, 2.5), moneyMul(2.6, 4.85, true)],
      [moneyMul(12, 4.75), moneyMul(3, 4.2), moneyMul(3.4, 2.95, true)],
      [moneyMul(16, 2.45), moneyMul(5, 1.5), moneyMul(1.8, 6.45, true)]
    ]),

    G("num", "Use it for real", [
      [divMoney(86.4, 6), divMoney(36, 4), divMoney(157.5, 14)],
      [divMoney(73.5, 7), divMoney(42, 6), divMoney(201.6, 16)],
      [divMoney(94.4, 8), divMoney(32, 4), divMoney(116.25, 15)]
    ]),

    G("num", "Use it for real", [
      [known(47, 36, 47, 3.6, 1692, 47), known(12, 5, 12, 50, 60, 5), known(47, 36, 4.7, 3.6, 169.2, 3.6)],
      [known(38, 24, 3.8, 24, 912, 38), known(15, 4, 150, 4, 60, 4), known(38, 24, 0.38, 2.4, 91.2, 2.4)],
      [known(53, 17, 53, 1.7, 901, 53), known(13, 6, 13, 60, 78, 6), known(53, 17, 5.3, 0.17, 90.1, 1.7)]
    ], { explain: true }),

    G("num", "Use it for real", [
      [change(50, 3, 12.75), change(20, 3, 4), packs(6, 13.5, 2.4, 12)],
      [change(40, 4, 8.35), change(10, 2, 3), packs(4, 9.8, 2.75, 12)],
      [change(30, 6, 3.45), change(15, 4, 2), packs(5, 11.25, 2.5, 15)]
    ])
  ],

  realWorld: {
    title: "The day the pennies changed",
    html: "<p>Until 15 February 1971, there were <b>240 pennies</b> in a pound in the UK. Then the country switched to decimal money: 100 pence in a pound. Overnight, everyone's money sums turned into the decimal methods you have just used.</p>" +
      "<p>For our big question: if you time travelled back to 1970 with a calculator and your methods, the shop sums would still trip you up. Would you rather have their money or ours?</p>",
    fig: pic(420, 150, "Jay stepping out of a time portal holding an old coin", A.portal(80, 75, 56) + A.jay(240, 50, 0.85, "wow") +
      '<circle cx="175" cy="120" r="16" fill="#e0a84a" stroke="' + INK + '" stroke-width="2"/>' + T(175, 125, "1d", 12, { b: 1, a: "middle" }) +
      A.bubble(290, 8, 124, 52, "240 pennies?\nOutrageous.", 296))
  },

  make: {
    title: "Make a strategy badge",
    intro: "Your favourite trick, with an example you like. Save it, stick it up, or send it to Jay.",
    fields: [
      { id: "trick", label: "My favourite trick", ph: "Nudge it", max: 22 },
      { id: "ex", label: "An example", ph: "99 x 8 = 800 - 8 = 792", max: 34 },
      { id: "tip", label: "My tip", ph: "Take away once for every lot", max: 40 },
      { id: "name", label: "Badge holder", ph: "Grand master B5", max: 22 }
    ],
    svg: function(v){
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#141a33"/>' +
        '<circle cx="160" cy="200" r="128" fill="#ffd23f"/><circle cx="160" cy="200" r="112" fill="none" stroke="#141a33" stroke-width="4" stroke-dasharray="10 8"/>' +
        '<text x="160" y="150" text-anchor="middle" ' + F + ' font-size="16" font-weight="700" fill="#141a33" letter-spacing="2">METHOD</text>' +
        '<text x="160" y="172" text-anchor="middle" ' + F + ' font-size="16" font-weight="700" fill="#141a33" letter-spacing="2">MASTER</text>' +
        '<text x="160" y="232" text-anchor="middle" ' + F + ' font-size="46" font-weight="700" fill="#141a33">&#215; &#247;</text>' +
        fit(160, 266, v.name, 14, 160, { a: "middle", c: "#141a33" }) +
        '<text x="320" y="92" ' + F + ' font-size="15" fill="#9fb0ff" letter-spacing="2">MY TRICK</text>' +
        fit(320, 128, v.trick, 24, 250, { b: 1, c: "#ffffff" }) +
        '<text x="320" y="184" ' + F + ' font-size="15" fill="#9fb0ff" letter-spacing="2">EXAMPLE</text>' +
        fit(320, 214, v.ex, 16, 250, { b: 1, c: "#ffffff" }) +
        '<text x="320" y="270" ' + F + ' font-size="15" fill="#9fb0ff" letter-spacing="2">TIP</text>' +
        wrap(v.tip, 22, 2).map(function(l, k){ return fit(320, 300 + k * 24, l, 16, 250, { c: "#ffffff" }); }).join("") +
        A.bird(548, 360, 0.8, "#22b8e6") +
        '</svg>';
    }
  }
};
})();
