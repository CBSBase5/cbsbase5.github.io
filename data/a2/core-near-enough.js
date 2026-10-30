/* Base 5 core target activity: Near enough.
   Maths. Rounding to a whole number, one decimal place and two
   decimal places: money, measurements and calculator answers.
   Replayable: most questions carry two extra versions (vary). ASCII only. */
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
function rnd(x, dp){ var m = Math.pow(10, dp); return Math.round(x * m + 1e-7) / m; }
function fx(x, dp){ return rnd(x, dp).toFixed(dp); }
function cut(x, dp){ var m = Math.pow(10, dp); return Math.floor(x * m + 1e-7) / m; }
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function fit(x, y, t, size, w, o){ var s = esc(t), est = s.length * size * 0.72; return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + size + '"' + (o.b ? ' font-weight="700"' : '') + (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + o.c + '"' + (est > w ? ' textLength="' + w + '" lengthAdjust="spacingAndGlyphs"' : '') + '>' + s + '</text>'; }
function nz(x){ return +(+x).toPrecision(12); }
function dig(x, k){ var s = String(nz(x)), i = s.indexOf("."); return i < 0 || i + k >= s.length ? 0 : +s.charAt(i + k); }
var PL = ["", "first", "second", "third"];
function dpw(dp){ return dp === 0 ? "the nearest whole number" : dp + " decimal place" + (dp > 1 ? "s" : ""); }

function clean(o){
  function keep(r){ var b = r.length === 3 ? r[0] : 0; return !(o.boxes[b] && Math.abs(r[r.length - 2] - o.boxes[b].a) < 1e-9); }
  if(o.boxes && Array.isArray(o.slips)) o.slips = o.slips.filter(keep);
  if(o.boxes && o.ez && Array.isArray(o.ez.slips)) o.ez.slips = o.ez.slips.filter(keep);
  return o;
}
/* easy read (LC): the first level's ez sits on the step itself; no other level carries one */
function noEz(v){ if(!v || !v.ez) return v; var o = {}; Object.keys(v).forEach(function(k){ if(k !== "ez") o[k] = v[k]; }); return o; }
function G(type, topic, sets, extra){
  sets.forEach(function(v){ v.forEach(clean); });
  function one(v){ var o = {}; Object.keys(v[0]).forEach(function(k){ if(k !== "ez") o[k] = v[0][k]; }); if(v[1].ez) o.ez = v[1].ez; o.lv = { mild: noEz(v[1]), spicy: noEz(v[2]) }; return o; }
  var s = { type: type, topic: topic }, b = one(sets[0]);
  Object.keys(b).forEach(function(k){ s[k] = b[k]; });
  if(sets.length > 1) s.vary = sets.slice(1).map(one);
  Object.keys(extra || {}).forEach(function(k){ s[k] = extra[k]; });
  return s;
}

/* ---------- pictures ---------- */

/* a number line from lo to hi with ten steps, a marker at x, the halfway tick picked out */
function lineFig(lo, hi, x, dp, egg){
  var x0 = 60, x1 = 460, y = 110, step = (hi - lo) / 10, out = "", px = x0 + (x - lo) / (hi - lo) * (x1 - x0), near = rnd(x, dp), nx = x0 + (near - lo) / (hi - lo) * (x1 - x0);
  out += '<path d="M' + (x0 - 14) + ' ' + y + 'H' + (x1 + 14) + '" stroke="' + INK + '" stroke-width="3"/>';
  for(var k = 0; k <= 10; k++){
    var tx = x0 + k * (x1 - x0) / 10, big = k === 0 || k === 10, mid = k === 5;
    out += '<path d="M' + tx + ' ' + (y - (big ? 16 : mid ? 12 : 7)) + 'V' + (y + (big ? 16 : mid ? 12 : 7)) + '" stroke="' + (mid ? "#e07b24" : INK) + '" stroke-width="' + (big ? 3 : 2) + '"/>';
  }
  out += T(x0, y + 40, fx(lo, dp), 18, { b: 1, a: "middle" }) + T(x1, y + 40, fx(hi, dp), 18, { b: 1, a: "middle" }) + T((x0 + x1) / 2, y + 34, "halfway " + fm(lo + 5 * step), 12, { a: "middle", c: "#b8641c" });
  out += '<path d="M' + px + ' ' + (y - 52) + 'V' + (y - 10) + '" stroke="#1f6f8b" stroke-width="3"/><path d="M' + (px - 7) + ' ' + (y - 18) + 'l7 10 7 -10" fill="#1f6f8b"/>' +
    '<rect x="' + (px - 38) + '" y="' + (y - 82) + '" width="76" height="30" rx="8" fill="#1f6f8b"/>' + T(px, y - 61, fm(x), 16, { b: 1, a: "middle", c: "#ffffff" });
  out += '<path d="M' + px + ' ' + (y + 58) + 'Q' + ((px + nx) / 2) + ' ' + (y + 80) + ' ' + nx + ' ' + (y + 58) + '" fill="none" stroke="#1f9d63" stroke-width="3" stroke-dasharray="6 4"/>' +
    '<circle cx="' + nx + '" cy="' + y + '" r="9" fill="none" stroke="#1f9d63" stroke-width="3"/>';
  if(egg) out += A.egg(A.bird(x1 - 30, y - 20, 0.55, "#ff5d5d"), "A robin perched at the end of the line. Jay says it is rounding itself up to a whole bird.");
  return pic(520, 210, "A number line from " + fm(lo) + " to " + fm(hi) + " with " + fm(x) + " marked", out);
}

/* place value boxes: keep digit in yellow, decider in blue */
function digitFig(xs, dp, note){
  var s = String(xs), i = s.indexOf("."), cw = 56, x0 = 260 - s.length * cw / 2, out = "";
  for(var k = 0; k < s.length; k++){
    var ch = s.charAt(k), keep = k === i + dp || (dp === 0 && k === i - 1), dec = k === i + dp + 1 || (dp === 0 && k === i + 1), cx = x0 + k * cw;
    if(ch === "."){ out += T(cx + cw / 2, 92, ".", 40, { b: 1, a: "middle" }); continue; }
    out += '<rect x="' + (cx + 3) + '" y="50" width="' + (cw - 6) + '" height="56" rx="8" fill="' + (keep ? "#ffd23f" : dec ? "#22b8e6" : "#ffffff") + '" fill-opacity="' + (keep || dec ? 0.6 : 1) + '" stroke="' + INK + '" stroke-width="2"/>' +
      T(cx + cw / 2, 90, ch, 30, { b: 1, a: "middle" });
    if(keep) out += T(cx + cw / 2, 132, "keep", 13, { b: 1, a: "middle", c: "#8a6a00" });
    if(dec) out += T(cx + cw / 2, 132, "decider", 13, { b: 1, a: "middle", c: "#1f6f8b" });
  }
  return pic(520, 190, "The digits of " + s + " with the digit to keep and the decider picked out",
    T(260, 32, "Rounding to " + dpw(dp), 15, { b: 1, a: "middle" }) + out + T(260, 168, note || "Decider 5 or more: round up. 4 or less: keep it.", 14, { b: 1, a: "middle", c: "#1f6f8b" }));
}

/* a calculator showing a long answer */
function calcFig(sum, shows, egg){
  return pic(520, 200, "A calculator showing " + shows,
    '<rect x="150" y="16" width="220" height="170" rx="18" fill="#2d3550"/>' +
    '<rect x="166" y="32" width="188" height="56" rx="6" fill="#cfe5c8"/>' +
    T(346, 52, esc(sum), 13, { a: "end", mono: 1 }) + T(346, 80, shows, 22, { b: 1, a: "end", mono: 1 }) +
    [0, 1, 2, 3].map(function(r){ return [0, 1, 2, 3].map(function(c){ return '<rect x="' + (172 + c * 46) + '" y="' + (100 + r * 21) + '" width="38" height="15" rx="4" fill="' + (c === 3 ? "#e07b24" : "#5b6480") + '"/>'; }).join(""); }).join("") +
    (egg ? A.egg('<g transform="translate(440 150)">' + A.bonnie(0, 0, 0.5, "sit") + '</g>', "Bonnie tried to use the calculator. She pressed 7 with her nose, then lost interest. Near enough.") : ""));
}

/* ---------- question makers ---------- */

function mcLine(lo, hi, x, dp, egg){
  var near = rnd(x, dp), other = near === rnd(lo, dp) ? rnd(hi, dp) : rnd(lo, dp);
  return { q: "Which is <b>" + fm(x) + "</b> nearer to?", fig: lineFig(lo, hi, x, dp, egg), options: [fx(near, dp), fx(other, dp)], answer: 0, fixed: false,
    slips: { 1: "Look at the halfway mark (" + fm((lo + hi) / 2) + "). " + fm(x) + " is on the " + (near > other ? "upper" : "lower") + " side of it." },
    hint: "Is it past halfway?", why: fm(x) + " is " + (near > other ? "past" : "before") + " halfway, so it is nearer to <b>" + fx(near, dp) + "</b>.",
    ez: { slips: { 1: "Look at halfway: " + fm((lo + hi) / 2) + "." }, why: fm(x) + " is " + (near > other ? "past" : "before") + " halfway. So <b>" + fx(near, dp) + "</b>." } };
}
function wholeQ(x, unit, ctx){
  var ans = rnd(x, 0), oth = ans > x ? Math.floor(x) : Math.ceil(x), d = dig(x, 1);
  return { q: ctx + " Round it to the nearest whole " + unit + ".",
    boxes: [{ label: "Nearest whole " + unit, a: ans }],
    slips: [[oth, "Look at the first digit after the point: it is " + d + ", so " + (d >= 5 ? "round up." : "keep the whole number as it is.")], [rnd(x, 1), "That still has a decimal. The nearest whole number has no decimal part."]],
    hint: "Look at the digit straight after the point. 5 or more rounds up.",
    why: "The digit after the point is " + d + (d >= 5 ? ", so round up" : ", so it stays") + ": <b>" + ans + " " + unit + "</b>.",
    ez: { q: ctx + " Round to the nearest whole " + unit + ".",
      slips: [[oth, "The digit after the point is " + d + ". " + (d >= 5 ? "Round up." : "Keep it.")], [rnd(x, 1), "Whole numbers have no decimal."]],
      hint: "After the point: 5 or more rounds up.", why: "After the point is " + d + ". So <b>" + ans + " " + unit + "</b>." } };
}
function sortQ(cards){ return { q: "Rounding each to the nearest whole number: does it go <b>up</b> or stay <b>down</b>?", cards: cards,
  hint: "Only the first digit after the point decides.", why: "First digit after the point 5 or more: up. 4 or less: down. Digits further along do not matter.",
  ez: { q: "Nearest whole number: <b>up</b> or <b>down</b>?", why: "5 or more after the point: up. 4 or less: down." } }; }
function sc(xs){ return xs.map(function(x){ return [fm(x), rnd(x, 0) > x ? 0 : 1]; }); }
function dpFade(xs, dp){
  var x = +xs, keep = dp ? dig(xs, dp) : +xs.charAt(xs.indexOf(".") - 1), dec = dig(xs, dp + 1), ans = rnd(x, dp), lab = PL[dp];
  return { q: "Round <b>" + xs + "</b> to " + dpw(dp) + ". Find the digit to keep, then the decider, then round.",
    fig: digitFig(xs, dp),
    boxes: [{ label: dp ? "Digit in the " + lab + " decimal place" : "The ones digit (just before the point)", a: keep }, { label: "The decider (next digit)", a: dec }, { label: "Rounded", a: ans, show: fx(x, dp) }],
    slips: [[0, dig(xs, dp + 1), dp ? "That is the next digit along. Count " + dp + " place" + (dp > 1 ? "s" : "") + " after the point." : "That is the decider. The digit you keep is the one just before the point."], [1, xs.length > xs.indexOf(".") + dp + 2 ? dig(xs, dp + 2) : -1, "That is one too far along. The decider is straight after the digit you keep."],
            dec >= 5 ? [2, cut(x, dp), "The decider is " + dec + ", which is 5 or more, so the kept digit goes up one."] : [2, r6(cut(x, dp) + Math.pow(10, -dp)), "The decider is " + dec + ", which is 4 or less, so the kept digit stays as it is."], [2, rnd(x, dp === 1 ? 2 : 1), "That is rounded to " + dpw(dp === 1 ? 2 : 1) + ". Count again."], [2, rnd(x, 0), "That is the nearest whole number. Keep " + dp + " digit" + (dp > 1 ? "s" : "") + " after the point."]],
    hint: "Decider 5 or more: the kept digit goes up. 4 or less: it stays.",
    why: "Keep the " + keep + ", the decider is " + dec + (dec >= 5 ? ", so round up" : ", so it stays") + ": <b>" + fx(x, dp) + "</b>.",
    ez: { q: "Round <b>" + xs + "</b> to " + dpw(dp) + ". Fill each box.",
      slips: [[0, dig(xs, dp + 1), dp ? "Count " + dp + " place" + (dp > 1 ? "s" : "") + " after the point." : "That is the decider. Keep the digit before the point."], [1, xs.length > xs.indexOf(".") + dp + 2 ? dig(xs, dp + 2) : -1, "One too far. The decider is next along."],
        dec >= 5 ? [2, cut(x, dp), "The decider is 5 or more. Go up one."] : [2, r6(cut(x, dp) + Math.pow(10, -dp)), "The decider is 4 or less. It stays."], [2, rnd(x, dp === 1 ? 2 : 1), "Count the places again."], [2, rnd(x, 0), "Keep " + dp + " digit" + (dp > 1 ? "s" : "") + " after the point."]],
      hint: "Decider 5 or more: go up." } };
}
function dpQ(x, dp, ctx, unit, pre){
  var ans = rnd(x, dp), wrongDir = rnd(x, dp) > x ? cut(x, dp) : r6(cut(x, dp) + Math.pow(10, -dp)), sl = [[wrongDir, "Check the decider (the digit straight after): " + dig(x, dp + 1) + (dig(x, dp + 1) >= 5 ? " rounds up." : " stays.")]];
  [0, 1, 2].forEach(function(o){ if(o !== dp) sl.push([rnd(x, o), "That is rounded to " + dpw(o) + ". This one asks for " + dpw(dp) + "."]); });
  return { q: ctx + " Round it to <b>" + dpw(dp) + "</b>.",
    boxes: [{ label: "Rounded", a: ans, pre: pre, post: unit ? " " + unit : "", show: fx(x, dp) }], slips: sl,
    hint: "Find the digit in place " + dp + " after the point, then look at the next one.",
    why: fm(x) + " to " + dpw(dp) + " is <b>" + (pre || "") + fx(x, dp) + (unit ? " " + unit : "") + "</b>. The decider was " + dig(x, dp + 1) + "." };
}
function mcRound(x, dp, lead){
  var c = fx(x, dp), opts = [c], sl = {}, esl = {};
  function add(v, why, sh){ if(opts.indexOf(v) < 0 && opts.length < 4){ sl[opts.length] = why; esl[opts.length] = sh; opts.push(v); } }
  var s = String(x), i = s.indexOf("."), d = +s.charAt(i + dp), dec = dig(x, dp + 1);
  if(d === 9 && dec >= 5) add(s.slice(0, i + dp) + "10", "A 9 that rounds up becomes 10, so it carries into the next digit along, just like adding.", "A 9 that goes up carries, like adding.");
  add(cut(x, dp).toFixed(dp), dec >= 5 ? "The decider is " + dec + ", so this one rounds up." : "Check the decider again: this one stays.", dec >= 5 ? "The decider is " + dec + ". Round up." : "Check the decider. It stays.");
  add(fx(x, dp + 1), "That has too many decimal places. Stop at " + dp + ".", "Too many decimal places.");
  if(dp > 0) add(fx(x, dp - 1), "That has too few decimal places. Keep " + dp + ".", "Too few decimal places.");
  add(r6(cut(x, dp) + Math.pow(10, -dp)).toFixed(dp), "That rounded up when the decider says keep it.", "The decider says keep it.");
  return { q: (lead || "") + "What is <b>" + fm(x) + "</b> to " + dpw(dp) + "?", options: opts, answer: 0, slips: sl,
    hint: "Find the decider. If you round up a 9, it carries.",
    why: "Decider " + dec + (dec >= 5 ? ", round up" : ", keep it") + ": <b>" + c + "</b>." + (d === 9 && dec >= 5 ? " The 9 becomes 10 and carries, and we still write " + dp + " decimal place" + (dp > 1 ? "s" : "") + "." : ""),
    ez: { slips: esl, hint: "Find the decider. A 9 carries." } };
}
function calcQ(sum, val, dp, ctx, pre, unit){
  val = nz(val); var shows = String(+val.toPrecision(10)), ans = rnd(val, dp), sl = [[cut(val, dp), "Look at the decider: " + dig(val, dp + 1) + ". " + (dig(val, dp + 1) >= 5 ? "That rounds up." : "That stays.")]];
  [0, 1, 2].forEach(function(o){ if(o !== dp) sl.push([rnd(val, o), "That is to " + dpw(o) + ". Here you want " + dpw(dp) + "."]); });
  return { q: ctx + " The calculator shows " + shows + ". Round it to <b>" + dpw(dp) + "</b>.", fig: calcFig(sum, shows),
    boxes: [{ label: "Rounded", a: ans, pre: pre, post: unit ? " " + unit : "", show: fx(val, dp) }], slips: sl,
    hint: "Ignore everything after the decider.", why: shows + " to " + dpw(dp) + " is <b>" + (pre || "") + fx(val, dp) + (unit ? " " + unit : "") + "</b>.",
    ez: { q: "The calculator shows " + shows + ". Round to <b>" + dpw(dp) + "</b>.",
      slips: [[cut(val, dp), "The decider is " + dig(val, dp + 1) + ". " + (dig(val, dp + 1) >= 5 ? "Round up." : "It stays.")]].concat([0, 1, 2].filter(function(o){ return o !== dp; }).map(function(o){ return [rnd(val, o), "That is " + dpw(o) + ". Try " + dpw(dp) + "."]; })) } };
}
function split(total, n){
  var v = nz(total / n), ans = rnd(v, 2), shows = String(+v.toPrecision(10));
  return { q: "&pound;" + total.toFixed(2) + " is split equally between " + n + ". The calculator shows " + shows + ". How much each, to the nearest penny?", fig: calcFig(total + " / " + n + " =", shows),
    boxes: [{ label: "Each", a: ans, pre: "&pound;", show: fx(v, 2) }],
    slips: [[cut(v, 2), "Check the third digit after the point: it decides, and it says round up."], [rnd(v, 1), "Money needs two decimal places: pounds and pence."], [rnd(v, 0), "That is to the nearest pound. Pennies means two decimal places."], [r6(cut(v, 2) + 0.01), "Check the third digit after the point: it says keep it."]],
    hint: "Pennies means 2 decimal places.", why: shows + " rounds to <b>&pound;" + fx(v, 2) + "</b> each." };
}
function matchQ(pairs){ return { q: "Match each thing to a sensible way to round it.", pairs: pairs,
  hint: "How precise would anyone actually need it?", why: "Pick the rounding that is useful: money to the penny, people to whole ones, and measurements to whatever your ruler or timer can show.",
  ez: { q: "Match each thing to its rounding.", hint: "How exact does it need to be?", why: "Money to the penny. People in whole ones." } }; }
function avgQ(vals, dp, unit){
  var tot = r6(vals.reduce(function(a, b){ return a + b; }, 0)), mean = nz(tot / vals.length), ans = rnd(mean, dp);
  return { q: "[[Who]] timed [[event]] " + vals.length + " times: " + vals.map(fm).join(", ") + " " + unit + ". Add them up, divide by " + vals.length + " for the mean, then round to " + dpw(dp) + ".",
    boxes: [{ label: "Total", a: tot, post: " " + unit }, { label: "Mean, rounded", a: ans, post: " " + unit, show: fx(mean, dp) }],
    slips: [[1, cut(mean, dp), "Check the decider: the digit straight after place " + dp + "."], [1, r6(tot / (vals.length - 1)), "Divide by how many there are: " + vals.length + "."], [1, rnd(mean, dp + 1), "Round to " + dpw(dp) + ", one fewer digit."]],
    hint: "Total &divide; " + vals.length + ", then round.",
    why: "Total " + fm(tot) + ". " + fm(tot) + " &divide; " + vals.length + " = " + String(+mean.toPrecision(7)) + ", which rounds to <b>" + fx(mean, dp) + " " + unit + "</b>.",
    ez: { q: "[[Who]] timed [[event]] " + vals.length + " times: " + vals.map(fm).join(", ") + " " + unit + ". Add them. Divide by " + vals.length + ". Then round.",
      slips: [[1, cut(mean, dp), "Check the decider."], [1, r6(tot / (vals.length - 1)), "Divide by " + vals.length + "."], [1, rnd(mean, dp + 1), "Round to " + dpw(dp) + "."]],
      why: "Total " + fm(tot) + ". Divide by " + vals.length + " and round: <b>" + fx(mean, dp) + " " + unit + "</b>." } };
}
function jayQ(x, dp){
  var right = fx(x, dp), wrong = fx(rnd(x, dp + 1), dp), mid = fx(x, dp + 1);
  return { q: "Jay rounded <b>" + fm(x) + "</b> to " + dpw(dp) + " in two steps: first " + fm(x) + " to " + mid + ", then " + mid + " to " + wrong + ". Is that right?",
    fig: pic(420, 130, "Jay looking unsure", A.jay(80, 46, 0.75, "hmm") + A.bubble(160, 20, 240, 70, fm(x) + " -> " + mid + " -> " + wrong + "\nNear enough?", 172)),
    options: ["No: round in one go, so it is " + right, "Yes, " + wrong + " is right", "No, it should be " + mid], answer: 0,
    slips: { 1: "Rounding twice can push a number up when it should stay. Only the one digit straight after the kept digit decides.", 2: "That still has too many decimal places for " + dpw(dp) + "." },
    hint: "Go back to the start. Which digit is straight after the one you keep?",
    why: "In one go: the decider in " + fm(x) + " is " + dig(x, dp + 1) + ", so it is <b>" + right + "</b>. Rounding in two steps sneaks the wrong digit up.",
    ez: { q: "Jay rounded <b>" + fm(x) + "</b> in two steps: " + mid + ", then " + wrong + ". Is that right?",
      slips: { 1: "Round once. Only the next digit decides.", 2: "Too many decimal places." },
      hint: "Which digit is right after the one you keep?", why: "In one go, the decider is " + dig(x, dp + 1) + ". So <b>" + right + "</b>." } };
}
function twoWays(x, a, b){
  function lb(d){ return d === -1 ? "Nearest 10" : d === 0 ? "Nearest whole number" : "To " + dpw(d); }
  function rr(v, d){ return d === -1 ? Math.round(v / 10 + 1e-9) * 10 : rnd(v, d); }
  return { q: "Round <b>" + fm(x) + "</b> two ways.",
    boxes: [{ label: lb(a), a: rr(x, a), show: a > 0 ? fx(x, a) : String(rr(x, a)) }, { label: lb(b), a: rr(x, b), show: b > 0 ? fx(x, b) : String(rr(x, b)) }],
    slips: [[0, rr(x, b), "That one is the other rounding. Check which box is which."], [1, rr(x, a), "That one is the other rounding. Check which box is which."]],
    hint: "Each one has its own decider.", why: fm(x) + ": " + lb(a).toLowerCase() + " is <b>" + (a > 0 ? fx(x, a) : rr(x, a)) + "</b>, " + lb(b).toLowerCase() + " is <b>" + (b > 0 ? fx(x, b) : rr(x, b)) + "</b>.",
    ez: { slips: [[0, rr(x, b), "That goes in the other box."], [1, rr(x, a), "That goes in the other box."]] } };
}
function bounds(x, dp, unit){
  var h = 0.5 * Math.pow(10, -dp), lo = r6(x - h), hi = r6(x + h);
  return { q: "A length is " + fx(x, dp) + " " + unit + ", rounded to " + dpw(dp) + ". What is the <b>smallest</b> it could really be? And what does it always stay <b>below</b>?",
    boxes: [{ label: "Smallest", a: lo, post: " " + unit }, { label: "Stays below", a: hi, post: " " + unit }],
    slips: [[0, r6(x - 2 * h), "That would round to something else. Go half a step down, not a whole step."], [1, r6(x + 2 * h), "That would round to something else. Go half a step up."], [0, r6(x - h / 10), "Further down than that still rounds to " + fx(x, dp) + ". Half a step is " + fm(h) + "."]],
    hint: "Half a step down and half a step up. A step here is " + fm(2 * h) + ".",
    why: "Anything from <b>" + fm(lo) + "</b> up to (but not including) <b>" + fm(hi) + "</b> rounds to " + fx(x, dp) + "." };
}

(window.A2PACKS = window.A2PACKS || {})["core-near-enough"] = {
  a2: true,
  id: "a2-core-near-enough",
  title: "Near enough",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 20,
  line: "Rounding: to a whole number, to one decimal place, and to the nearest penny.",
  blurb: "Rounding money, measurements and those long calculator answers. Four short chunks: whole numbers, one decimal place, two decimal places, then picking the right rounding for the job. You make a near enough card at the end. New numbers every time you come back.",
  note: "Rounding, for real things: money, times and calculator answers. Four five minute chunks and a card to make. The numbers change each go, so dip in whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Ballpark", line: "Ballpark: whole numbers and the nearest 10, one digit after the point." },
    { id: "medium", name: "Close call", line: "Close call: whole numbers, one and two decimal places, money and calculator answers." },
    { id: "spicy", name: "Photo finish", line: "Photo finish: tricky 9s, rounding traps, and how big or small a rounded number could really be." }
  ],
  themes: {
    time: { name: "Time travel", w: { who: "the time traveller", thing: "the time crystal", event: "the portal jump" } },
    football: { name: "Football", w: { who: "the striker", thing: "the kit bag", event: "the sprint drill" } },
    horror: { name: "Horror", w: { who: "the ghost hunter", thing: "the old lantern", event: "the dash down the corridor" } },
    fishing: { name: "Fishing", w: { who: "the angler", thing: "the carp", event: "the reel in" } },
    music: { name: "Music", w: { who: "the drummer", thing: "the amplifier", event: "the drum solo" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: lineFig(3, 4, 3.7, 0, true),
  steps: [

    /* ---------- chunk 1: nearest whole number ---------- */
    { type: "learn", topic: "Nearest whole number", title: "Which whole number is it nearer?",
      fig: lineFig(3, 4, 3.7, 0, true),
      ez: { title: "Nearest whole number", html: "<p>Look at the <b>first digit after the point</b>.</p><p>5 or more: round up. 4 or less: it stays.</p>" },
      html: "<p>3.7 sits between 3 and 4. It is past halfway (3.5), so it is nearer <b>4</b>.</p>" +
        "<p>You do not need to draw a line every time. Just look at the <b>first digit after the point</b>: <b>5 or more, round up</b>. 4 or less, the whole number stays.</p>" +
        "<p>3.7 goes to 4. 3.2 stays as 3. 3.5 is exactly halfway, and halfway always rounds <b>up</b>, to 4.</p>",
      lv: { spicy: { html: "<p>Only the <b>first digit after the point</b> decides: 5 or more rounds up, 4 or less stays.</p>" +
        "<p>Watch the traps. 4.49 rounds to <b>4</b>, because the 4 decides and the 9 after it does not matter. 19.5 rounds to <b>20</b>, because the 9 carries over.</p>" } } },

    G("mc", "Nearest whole number", [
      [mcLine(12, 13, 12.38, 0), mcLine(6, 7, 6.8, 0), mcLine(19, 20, 19.52, 0)],
      [mcLine(8, 9, 8.61, 0), mcLine(2, 3, 2.3, 0), mcLine(4, 5, 4.49, 0)],
      [mcLine(25, 26, 25.47, 0), mcLine(9, 10, 9.6, 0), mcLine(7, 8, 7.501, 0)]
    ]),

    G("num", "Nearest whole number", [
      [wholeQ(3.62, "kg", "[[Thing]] weighs 3.62 kg."), wholeQ(4.7, "kg", "[[Thing]] weighs 4.7 kg."), wholeQ(14.49, "kg", "[[Thing]] weighs 14.49 kg.")],
      [wholeQ(2.86, "kg", "Bonnie weighs 2.86 kg (she would like that kept quiet)."), wholeQ(2.4, "kg", "Bonnie weighs 2.4 kg."), wholeQ(29.51, "kg", "[[Thing]] weighs 29.51 kg.")],
      [wholeQ(12.48, "metre", "[[Who]] measured a length of 12.48 m."), wholeQ(8.5, "metre", "[[Who]] measured a length of 8.5 m."), wholeQ(99.5, "metre", "[[Who]] measured a length of 99.5 m.")]
    ]),

    G("num", "Nearest whole number", [
      [wholeQ(14.49, "pound", "A ticket for [[event]] costs &pound;14.49."), wholeQ(6.8, "pound", "A snack costs &pound;6.80."), wholeQ(149.5, "pound", "A ticket for [[event]] costs &pound;149.50.")],
      [wholeQ(23.5, "pound", "A hoodie costs &pound;23.50."), wholeQ(3.2, "pound", "A drink costs &pound;3.20."), wholeQ(9.95, "pound", "A phone case costs &pound;9.95.")],
      [wholeQ(7.09, "pound", "A pizza costs &pound;7.09."), wholeQ(5.5, "pound", "A pen costs &pound;5.50."), wholeQ(199.49, "pound", "Headphones cost &pound;199.49.")]
    ]),

    G("sort", "Nearest whole number", [
      [sortQ(sc([4.6, 4.3, 12.51, 12.49, 7.05, 7.5])), sortQ(sc([4.6, 4.3, 7.5, 7.1])), sortQ(sc([4.49, 4.51, 19.5, 19.45, 0.5, 0.49]))],
      [sortQ(sc([3.8, 3.4, 15.62, 15.38, 9.09, 9.9])), sortQ(sc([3.8, 3.4, 9.9, 9.1])), sortQ(sc([2.499, 2.5, 29.95, 29.49, 0.51, 0.099]))],
      [sortQ(sc([6.5, 6.45, 20.71, 20.29, 1.15, 1.85])), sortQ(sc([6.5, 6.2, 1.9, 1.4])), sortQ(sc([5.449, 5.55, 99.5, 99.49, 0.45, 0.95]))]
    ], { buckets: ["Rounds up", "Stays down"] }),

    /* ---------- chunk 2: one decimal place ---------- */
    { type: "learn", topic: "One decimal place", title: "Keep one digit after the point",
      fig: digitFig("2.36", 1, "Keep the 3. The decider is 6, so the 3 goes up: 2.4"),
      ez: { title: "Keep, then decide", html: "<p>Keep the whole number. The next digit is the <b>decider</b>.</p><p>6.8: the 8 says go up. So <b>7</b>.</p>" },
      html: "<p>To round to <b>1 decimal place</b>, keep one digit after the point. The digit after that is the <b>decider</b>.</p>" +
        "<p>2.36: keep the 3, the decider is 6. 6 is 5 or more, so the 3 goes up to 4: <b>2.4</b>.</p>" +
        "<p>2.32 would be <b>2.3</b>. And watch the 9s: 4.96 rounds to <b>5.0</b>, because the 9 goes up to 10 and carries. Keep the 0 to show it is 1 decimal place.</p>",
      lv: { mild: { fig: digitFig("6.8", 0, "Keep the 6. The decider is 8, so the 6 goes up: 7"),
        html: "<p>Here is the same idea with boxes. Keep the whole number. The first digit after the point is the <b>decider</b>.</p>" +
          "<p>6.8: keep the 6, the decider is 8, which is 5 or more. So the 6 goes up: <b>7</b>.</p><p>6.3 would stay as <b>6</b>.</p>" } } },

    G("num", "One decimal place", [
      [dpFade("5.47", 1), dpFade("8.6", 0), dpFade("3.952", 1)],
      [dpFade("12.83", 1), dpFade("3.4", 0), dpFade("0.649", 1)],
      [dpFade("7.15", 1), dpFade("15.5", 0), dpFade("19.97", 1)]
    ]),

    G("num", "One decimal place", [
      [dpQ(12.47, 1, "[[Who]] finished [[event]] in 12.47 seconds.", "s"), wholeQ(9.6, "second", "[[Who]] finished [[event]] in 9.6 seconds."), dpQ(9.951, 1, "[[Who]] finished [[event]] in 9.951 seconds.", "s")],
      [dpQ(3.85, 1, "[[Thing]] is 3.85 m from the door.", "m"), wholeQ(11.2, "second", "[[Who]] finished [[event]] in 11.2 seconds."), dpQ(0.96, 1, "[[Thing]] is 0.96 m from the door.", "m")],
      [dpQ(26.04, 1, "[[Event]] took 26.04 seconds.", "s"), wholeQ(15.5, "second", "[[Event]] took 15.5 seconds."), dpQ(39.98, 1, "[[Event]] took 39.98 seconds.", "s")]
    ]),

    G("mc", "One decimal place", [
      [mcRound(4.96, 1), mcRound(5.5, 0), mcRound(9.97, 1)],
      [mcRound(2.98, 1), mcRound(8.4, 0), mcRound(0.97, 1)],
      [mcRound(6.95, 1), mcRound(2.5, 0), mcRound(19.951, 1)]
    ]),

    G("num", "One decimal place", [
      [calcQ("22 / 7 =", 22 / 7, 1, "[[Who]] works out 22 &divide; 7."), calcQ("13 / 2 =", 6.5, 0, "A recipe needs 13 &divide; 2."), calcQ("1 / 0.7 =", 1 / 0.7, 1, "[[Who]] works out 1 &divide; 0.7.")],
      [calcQ("10 / 6 =", 10 / 6, 1, "[[Who]] works out 10 &divide; 6."), calcQ("9 / 4 =", 2.25, 0, "A recipe needs 9 &divide; 4."), calcQ("50 / 7 =", 50 / 7, 1, "[[Who]] works out 50 &divide; 7.")],
      [calcQ("17 / 3 =", 17 / 3, 1, "[[Who]] works out 17 &divide; 3."), calcQ("23 / 4 =", 5.75, 0, "A recipe needs 23 &divide; 4."), calcQ("2 / 0.3 =", 2 / 0.3, 1, "[[Who]] works out 2 &divide; 0.3.")]
    ], { explain: true }),

    /* ---------- chunk 3: two decimal places ---------- */
    { type: "learn", topic: "Two decimal places", title: "Two digits after the point: pounds and pence",
      fig: calcFig("10 / 3 =", "3.333333333", true),
      ez: { title: "Pounds and pence", html: "<p>Calculators show too many digits.</p><p>3.333333333 to the nearest pound is <b>&pound;3</b>.</p>" },
      html: "<p>Money uses <b>2 decimal places</b>: the pence. Calculators do not care about pence, so they show far too many digits.</p>" +
        "<p>&pound;10 split between 3: the calculator shows 3.333333333. Keep two digits after the point (3.33), the decider is the third one (3), so it stays: <b>&pound;3.33</b> each.</p>" +
        "<p>&pound;20 split between 3 shows 6.666666667. Keep 6.66, decider 6, round up: <b>&pound;6.67</b>.</p>",
      lv: { mild: { html: "<p>Money uses pounds and pence. A calculator often shows far too many digits.</p>" +
        "<p>&pound;10 split between 3 shows 3.333333333. To the <b>nearest pound</b>, the first digit after the point is 3, so it stays: about <b>&pound;3</b> each.</p>" } } },

    G("num", "Two decimal places", [
      [dpFade("7.0849", 2), dpFade("4.62", 0), dpFade("2.9951", 2)],
      [dpFade("15.326", 2), dpFade("11.38", 0), dpFade("0.0972", 2)],
      [dpFade("3.4567", 2), dpFade("7.51", 0), dpFade("9.995", 2)]
    ]),

    G("num", "Two decimal places", [
      [split(25, 3), wholeQ(8.33, "pound", "&pound;25 split between 3 is &pound;8.33 each."), split(100, 7)],
      [split(20, 3), wholeQ(6.67, "pound", "&pound;20 split between 3 is &pound;6.67 each."), split(50, 6)],
      [split(10, 6), wholeQ(2.5, "pound", "&pound;10 split between 4 is &pound;2.50 each."), split(200, 9)]
    ]),

    G("mc", "Two decimal places", [
      [mcRound(3.14159, 2), mcRound(47.6, 0), mcRound(2.995, 2)],
      [mcRound(0.6666, 2), mcRound(12.5, 0), mcRound(14.0049, 2)],
      [mcRound(5.6789, 2), mcRound(99.4, 0), mcRound(0.0951, 2)]
    ]),

    G("num", "Two decimal places", [
      [calcQ("2 x 3.14159 x 1.5 =", 2 * 3.14159 * 1.5, 2, "The distance round a round table is 2 &times; 3.14159 &times; 1.5 m.", "", "m"), calcQ("7 x 1.9 =", 7 * 1.9, 0, "Seven bags of 1.9 kg.", "", "kg"), calcQ("17.5 x 1.175 =", 17.5 * 1.175, 2, "A price with 17.5% added is 17.5 &times; 1.175.", "&pound;")],
      [calcQ("5 / 12 =", 5 / 12, 2, "Five out of twelve, as a decimal, is 5 &divide; 12."), calcQ("4 x 2.6 =", 4 * 2.6, 0, "Four bottles of 2.6 litres.", "", "litres"), calcQ("39.99 x 0.85 =", 39.99 * 0.85, 2, "A price with 15% off is 39.99 &times; 0.85.", "&pound;")],
      [calcQ("1 / 7 =", 1 / 7, 2, "One seventh as a decimal is 1 &divide; 7."), calcQ("3 x 4.7 =", 3 * 4.7, 0, "Three planks of 4.7 m.", "", "m"), calcQ("64.5 x 0.7 =", 64.5 * 0.7, 2, "A price with 30% off is 64.5 &times; 0.7.", "&pound;")]
    ]),

    /* ---------- chunk 4: pick the rounding ---------- */
    { type: "learn", topic: "Pick the rounding", title: "The job decides how near is near enough",
      fig: pic(520, 190, "Three examples of rounding for the job: money, people, a race time",
        [["Money", "#ffd23f", "&#163;3.33", "to the penny"], ["People", "#22b8e6", "27", "whole ones"], ["Race time", "#19c39a", "9.58 s", "to 0.01 s"]].map(function(c, k){
          var x = 26 + k * 162;
          return '<rect x="' + x + '" y="20" width="144" height="130" rx="14" fill="' + c[1] + '" fill-opacity=".35" stroke="' + INK + '" stroke-width="2"/>' +
            T(x + 72, 50, c[0], 16, { b: 1, a: "middle" }) + T(x + 72, 100, c[2], 28, { b: 1, a: "middle" }) + T(x + 72, 134, c[3], 13, { a: "middle" });
        }).join("") + T(260, 176, "Nobody pays 3.333333 pounds, and nobody brings 26.7 people.", 13, { a: "middle" })),
      ez: { title: "The job decides", html: "<p>Money: to the penny. People: whole numbers.</p><p>Always round in <b>one go</b>.</p>" },
      html: "<p>How you round depends on what the number is <b>for</b>.</p>" +
        "<p><b>Money:</b> to the penny (2 decimal places). <b>People and things you count:</b> whole numbers. <b>Measurements:</b> as precise as the tool, like a ruler to the nearest mm or a race clock to 0.01 s.</p>" +
        "<p>And always round in <b>one go</b>, from the original number. Rounding in steps can sneak a digit up that should have stayed.</p>" },

    G("match", "Pick the rounding", [
      [matchQ([["A bus fare", "To the penny"], ["How many people came", "A whole number"], ["A sprint time", "To 0.01 of a second"], ["The distance to the moon", "To the nearest 1000 km"]]),
       matchQ([["A price", "To the penny"], ["Chairs in a room", "A whole number"], ["A rough guess at a price", "To the nearest pound"]]),
       matchQ([["A share of a bill", "To the penny"], ["Crowd at a match", "To the nearest 100"], ["A 100 m world record", "To 0.01 of a second"], ["A person's height", "To the nearest cm"], ["Petrol price per litre", "To 0.1 of a penny"]])],
      [matchQ([["Pocket money", "To the penny"], ["Pupils in a class", "A whole number"], ["A swimming race", "To 0.01 of a second"], ["Population of a city", "To the nearest 1000"]]),
       matchQ([["A pizza price", "To the penny"], ["Goals scored", "A whole number"], ["A quick money guess", "To the nearest pound"]]),
       matchQ([["Splitting a taxi fare", "To the penny"], ["Fans in a stadium", "To the nearest 100"], ["A Formula 1 lap", "To 0.001 of a second"], ["Your weight", "To the nearest 0.1 kg"], ["The age of the Earth", "To the nearest 100 million years"]])],
      [matchQ([["A cinema ticket", "To the penny"], ["Dogs at the park", "A whole number"], ["A 50 m dash", "To 0.01 of a second"], ["Distance from London to Paris", "To the nearest km"]]),
       matchQ([["A bag of crisps", "To the penny"], ["Players on a team", "A whole number"], ["Rough cost of a day out", "To the nearest pound"]]),
       matchQ([["A wage per hour", "To the penny"], ["Visitors to a museum in a year", "To the nearest 1000"], ["A bobsleigh run", "To 0.01 of a second"], ["A baby's weight", "To the nearest 0.01 kg"], ["Distance to the Sun", "To the nearest million km"]])]
    ]),

    G("num", "Pick the rounding", [
      [avgQ([12.4, 11.9, 12.8], 1, "s"), avgQ([4, 5, 5], 0, "s"), avgQ([9.87, 10.02, 9.95, 10.11], 2, "s")],
      [avgQ([15.2, 14.8, 15.7], 1, "s"), avgQ([7, 8, 8], 0, "s"), avgQ([21.43, 21.08, 20.96, 21.5], 2, "s")],
      [avgQ([8.3, 8.8, 9.1], 1, "s"), avgQ([10, 11, 13], 0, "s"), avgQ([5.66, 5.71, 5.59, 5.83], 2, "s")]
    ]),

    G("mc", "Pick the rounding", [
      [jayQ(6.248, 1), jayQ(2.45, 0), jayQ(2.4449, 2)],
      [jayQ(3.449, 1), jayQ(7.48, 0), jayQ(5.1349, 2)],
      [jayQ(0.847, 1), jayQ(4.46, 0), jayQ(8.0045, 2)]
    ]),

    G("num", "Pick the rounding", [
      [twoWays(7.3864, 1, 2), twoWays(47.6, 0, -1), bounds(7.4, 1, "m")],
      [twoWays(15.0652, 1, 2), twoWays(83.4, 0, -1), bounds(12.6, 1, "m")],
      [twoWays(0.4651, 1, 2), twoWays(65.5, 0, -1), bounds(3.25, 2, "m")]
    ], { explain: true })
  ],

  realWorld: {
    title: "Near enough changed with time",
    html: "<p>Sports timing is rounding you can watch. In 1968, Jim Hines ran 100 m in <b>9.95 seconds</b>, the first time under 10 seconds with electronic timing. Before electronic clocks, races were timed by hand with stopwatches and recorded only to the nearest <b>tenth</b> of a second.</p>" +
      "<p>For our big question: if you could time travel back to an old race with a modern timer, the results might change. Would it be fair to rewrite the record books?</p>",
    fig: pic(420, 150, "Jay at a time portal holding a stopwatch", A.portal(80, 75, 56) + A.jay(240, 50, 0.85, "wow") +
      '<circle cx="180" cy="116" r="20" fill="#ffffff" stroke="' + INK + '" stroke-width="3"/><path d="M180 116v-12M180 116l8 5" stroke="' + INK + '" stroke-width="2.5"/><rect x="175" y="90" width="10" height="7" fill="' + INK + '"/>' +
      A.bubble(290, 8, 124, 52, "9.95 or 9.9?\nOutrageous.", 296))
  },

  ez: {
    realWorld: { title: "Near enough changed with time", html: "<p>In 1968 Jim Hines ran 100 m in <b>9.95 seconds</b>.</p><p>Old stopwatches only showed tenths.</p>" },
    make: { intro: "A number from your life. Exact, then rounded." }
  },

  make: {
    title: "Make a near enough card",
    intro: "A number from your life, exact and rounded. Save it, stick it up, or send it to Jay.",
    fields: [
      { id: "what", label: "What it is", ph: "My walk to the shop", max: 28 },
      { id: "exact", label: "The exact number", ph: "1.38 km", max: 16 },
      { id: "near", label: "Near enough", ph: "about 1.4 km", max: 18 },
      { id: "how", label: "How I rounded", ph: "to 1 decimal place", max: 26 }
    ],
    svg: function(v){
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380">' +
        '<rect width="600" height="380" rx="24" fill="#fff6e0"/>' +
        '<rect x="14" y="14" width="572" height="352" rx="18" fill="none" stroke="#e07b24" stroke-width="4"/>' +
        '<text x="40" y="62" ' + F + ' font-size="16" font-weight="700" fill="#e07b24" letter-spacing="3">NEAR ENOUGH</text>' +
        fit(40, 104, v.what, 24, 520, { b: 1, c: "#141a33" }) +
        '<rect x="40" y="134" width="240" height="120" rx="14" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
        '<text x="160" y="164" text-anchor="middle" ' + F + ' font-size="13" fill="#5b6180">exactly</text>' +
        fit(160, 214, v.exact, 30, 210, { b: 1, a: "middle", c: "#141a33" }) +
        '<path d="M292 194h18l-6 -6M310 194l-6 6" stroke="#141a33" stroke-width="3" fill="none"/>' +
        '<rect x="320" y="134" width="240" height="120" rx="14" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>' +
        '<text x="440" y="164" text-anchor="middle" ' + F + ' font-size="13" fill="#5b6180">near enough</text>' +
        fit(440, 214, v.near, 30, 210, { b: 1, a: "middle", c: "#141a33" }) +
        fit(40, 300, "Rounded " + String(v.how || ""), 18, 400, { c: "#141a33" }) +
        A.bird(520, 320, 0.9, "#22b8e6") +
        '</svg>';
    }
  }
};
})();
