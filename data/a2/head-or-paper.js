/* Base 5 Autumn 2 activity: Head or paper, then check.
   Maths. Multiply and divide whole numbers and decimals in your head or
   on paper, then check with the inverse. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
var M = 'font-family="Courier New,Courier,monospace"';
var X = "&#215;", D = "&#247;";
function T(x, y, s, size, extra){ extra = extra || ""; return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 15) + '"' + (/fill=/.test(extra) ? "" : ' fill="#141a33"') + ' ' + extra + '>' + s + '</text>'; }
function Tm(x, y, s, size, extra){ extra = extra || ""; return '<text x="' + x + '" y="' + y + '" ' + M + ' font-size="' + (size || 28) + '" font-weight="700"' + (/fill=/.test(extra) ? "" : ' fill="#141a33"') + ' text-anchor="middle" ' + extra + '>' + s + '</text>'; }

/* start card: Jay working one out in his head, and one on paper */
var START =
  '<svg viewBox="0 0 520 220" role="img" aria-label="Jay doing a sum in his head, next to a notepad with a column sum on it">' +
  '<rect width="520" height="220" rx="16" fill="#eef6ff"/>' +
  A2ART.jay(90, 110, 0.9, "hmm") +
  A2ART.bubble(130, 14, 130, 56, "25 x 4\nis 100...", 150) +
  '<g transform="rotate(4 400 115)"><rect x="310" y="22" width="180" height="180" rx="8" fill="#fffbe0" stroke="#141a33" stroke-width="2.5"/>' +
  '<path d="M310 52h180" stroke="#e04848" stroke-width="2"/>' +
  Tm(420, 90, "3 4 7") + Tm(420, 126, X + "   6") + '<path d="M350 138h110" stroke="#141a33" stroke-width="3"/>' +
  Tm(420, 172, "2 0 8 2") + T(330, 44, "on paper", 14, 'font-weight="700"') + '</g>' +
  A2ART.egg(A2ART.bird(286, 196, 0.6, "#19c39a"), "A bird doing its two times table. It only gets as far as tweet, tweet.") +
  '</svg>';

/* head or paper: two signposts */
var CHOOSE =
  '<svg viewBox="0 0 520 210" role="img" aria-label="Head: friendly numbers like tens, doubles and fives. Paper: lots of digits and carrying.">' +
  '<rect width="520" height="210" rx="16" fill="#f4f1ea"/>' +
  '<rect x="20" y="20" width="230" height="170" rx="14" fill="#ffd23f" fill-opacity=".35" stroke="#141a33" stroke-width="2.5"/>' +
  '<circle cx="70" cy="70" r="30" fill="#f6d1b0" stroke="#141a33" stroke-width="2"/><path d="M41 64q-2 -32 29 -32q31 0 29 32q-8 -16 -29 -16q-21 0 -29 16z" fill="#6b3f1f"/>' +
  '<circle cx="60" cy="72" r="3" fill="#141a33"/><circle cx="80" cy="72" r="3" fill="#141a33"/><path d="M61 84q9 7 18 0" stroke="#141a33" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
  '<path d="M96 52q10 -10 22 -4" stroke="#141a33" stroke-width="2" fill="none"/>' +
  T(116, 66, "In my head", 17, 'font-weight="700"') +
  T(40, 124, "tens: 30 " + X + " 4", 15) + T(40, 148, "doubles: 4 " + X + " 15", 15) + T(40, 172, "fives: 25 " + X + " 8", 15) +
  '<rect x="270" y="20" width="230" height="170" rx="14" fill="#22b8e6" fill-opacity=".3" stroke="#141a33" stroke-width="2.5"/>' +
  '<rect x="292" y="40" width="44" height="54" rx="4" fill="#fff" stroke="#141a33" stroke-width="2"/><path d="M300 56h28M300 68h28M300 80h20" stroke="#141a33" stroke-width="2"/>' +
  T(350, 66, "On paper", 17, 'font-weight="700"') +
  T(290, 124, "lots of digits: 347 " + X + " 6", 15) + T(290, 148, "carrying: 1872 " + D + " 8", 15) + T(290, 172, "awkward decimals", 15) +
  '</svg>';

/* area model: m x (a + b) */
function area(m, a, b, note){
  var wa = 300, wb = 110;
  return '<svg viewBox="0 0 520 220" role="img" aria-label="A rectangle ' + m + ' by ' + a + ' plus ' + b + ', split into two parts">' +
    '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
    '<rect x="60" y="50" width="' + wa + '" height="110" fill="#22b8e6" fill-opacity=".45" stroke="#141a33" stroke-width="2.5"/>' +
    '<rect x="' + (60 + wa) + '" y="50" width="' + wb + '" height="110" fill="#ffd23f" fill-opacity=".6" stroke="#141a33" stroke-width="2.5"/>' +
    T(60 + wa / 2, 38, a, 18, 'text-anchor="middle" font-weight="700"') + T(60 + wa + wb / 2, 38, b, 18, 'text-anchor="middle" font-weight="700"') +
    T(44, 112, m, 18, 'text-anchor="end" font-weight="700"') +
    T(60 + wa / 2, 112, m + " " + X + " " + a + " = " + (+(m * a).toFixed(4)), 17, 'text-anchor="middle" font-weight="700"') +
    T(60 + wa + wb / 2, 112, (+(m * b).toFixed(4)), 17, 'text-anchor="middle" font-weight="700"') +
    T(260, 198, note, 16, 'text-anchor="middle" font-weight="700"') +
    '</svg>';
}

/* place value slide: digits move, the point stays */
function pv(numStr, shift, label){
  var cols = ["Th", "H", "T", "O", "t", "h", "th", "tth"], ex = [3, 2, 1, 0, -1, -2, -3, -4];
  function digits(s, sh){
    var p = s.indexOf("."), whole = p < 0 ? s : s.slice(0, p), frac = p < 0 ? "" : s.slice(p + 1), m = {};
    for(var i = 0; i < whole.length; i++) m[whole.length - 1 - i + sh] = whole.charAt(i);
    for(var j = 0; j < frac.length; j++) m[-(j + 1) + sh] = frac.charAt(j);
    /* drop leading and trailing zeros that do nothing, then fill gaps back to the ones column */
    var nz = Object.keys(m).map(Number).filter(function(k){ return m[k] !== "0"; });
    var hi = Math.max.apply(null, nz.concat([0])), lo = Math.min.apply(null, nz.concat([0]));
    var out = {};
    for(var e = hi; e >= lo; e--) out[e] = m[e] != null ? m[e] : "0";
    return out;
  }
  var a = digits(numStr, 0), b = digits(numStr, shift), cw = 52, x0 = 52;
  function row(dm, y, col){
    var s = "";
    ex.forEach(function(e, k){ if(dm[e] != null) s += Tm(x0 + k * cw + cw / 2, y, dm[e], 30, 'fill="' + col + '"'); });
    return s;
  }
  var s = '<svg viewBox="0 0 520 230" role="img" aria-label="' + label + '">' +
    '<rect width="520" height="230" rx="16" fill="#f4f1ea"/>';
  cols.forEach(function(c, k){
    s += '<rect x="' + (x0 + k * cw) + '" y="18" width="' + cw + '" height="170" fill="' + (ex[k] < 0 ? "#e8f7ff" : "#fffbe0") + '" stroke="#141a33" stroke-opacity=".25" stroke-width="1.5"/>' +
      T(x0 + k * cw + cw / 2, 40, c, 14, 'text-anchor="middle" font-weight="700"');
  });
  s += '<circle cx="' + (x0 + 4 * cw) + '" cy="88" r="5" fill="#141a33"/><circle cx="' + (x0 + 4 * cw) + '" cy="158" r="5" fill="#141a33"/>' +
    row(a, 98, "#141a33") + row(b, 168, "#1f7a54") +
    (shift > 0 ?
      '<path d="M330 128H210M222 120l-12 8 12 8" stroke="#e04848" stroke-width="3" fill="none" stroke-linecap="round"/>' + T(340, 133, "slide left " + shift, 14, 'font-weight="700" fill="#c03030"') :
      '<path d="M190 128H310M298 120l12 8 -12 8" stroke="#e04848" stroke-width="3" fill="none" stroke-linecap="round"/>' + T(320, 133, "slide right " + (-shift), 14, 'font-weight="700" fill="#c03030"')) +
    T(260, 216, label, 15, 'text-anchor="middle" font-weight="700"') + '</svg>';
  return s;
}

/* column multiplication by a one digit number, carries shown small */
function colMul(top, m, blank){
  var ds = String(top).split("").map(Number), n = ds.length, cw = 30, xr = 200, c = 0, ans = [], carries = [], lines = [];
  for(var i = n - 1; i >= 0; i--){
    var p = ds[i] * m + c;
    lines.push(ds[i] + " " + X + " " + m + (c ? " + " + c : "") + " = " + p + (i > 0 && p >= 10 ? ", carry " + Math.floor(p / 10) : ""));
    ans.unshift(i > 0 ? p % 10 : p); c = Math.floor(p / 10); carries[i] = i > 0 ? c : 0;
  }
  var full = ans.join(""), s = '<svg viewBox="0 0 520 220" role="img" aria-label="' + top + ' times ' + m + ' in columns">' +
    '<rect width="520" height="220" rx="16" fill="#fffbe0"/>';
  ds.forEach(function(d, k){ s += Tm(xr - (n - 1 - k) * cw, 56, d); });
  s += Tm(xr - n * cw, 96, X) + Tm(xr, 96, m) + '<path d="M' + (xr - (n + 1) * cw) + ' 110h' + ((n + 1.6) * cw) + '" stroke="#141a33" stroke-width="3"/>';
  if(blank){
    for(var b = 0; b <= n; b++) s += '<rect x="' + (xr - b * cw - 13) + '" y="124" width="26" height="32" rx="4" fill="#fff" stroke="#141a33" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="4 3"/>';
    return s + T(270, 70, "Start on the right.", 15, 'font-weight="700"') + T(270, 100, "Write the ones digit,", 15) + T(270, 124, "carry the tens.", 15) + '</svg>';
  }
  full.split("").forEach(function(d, k){ s += Tm(xr - (full.length - 1 - k) * cw, 148, d, 28, 'fill="#1f7a54"'); });
  /* the carry out of column j sits small under column j - 1 */
  for(var q = 1; q < n; q++){ if(carries[q]) s += T(xr - (n - q) * cw + 8, 176, carries[q], 15, 'fill="#e04848" font-weight="700"'); }
  lines.forEach(function(l, k){ s += T(270, 50 + k * 30, l, 15); });
  return s + T(270, 50 + lines.length * 30, "Answer: " + full, 16, 'font-weight="700" fill="#1f7a54"') + '</svg>';
}

/* bus stop division, works with a decimal point in the number */
function bus(numStr, dv){
  var ch = String(numStr).split(""), cw = 30, x0 = 120, r = 0, top = [], small = [], lines = [], started = false;
  ch.forEach(function(c, k){
    if(c === "."){ top.push("."); small.push(""); return; }
    var nn = r * 10 + Number(c), q = Math.floor(nn / dv);
    small.push(r ? String(r) : "");
    lines.push(nn + " " + D + " " + dv + " = " + q + (nn % dv ? " r " + (nn % dv) : ""));
    r = nn % dv;
    if(q || started || ch[k + 1] === "." || k === ch.length - 1){ started = true; top.push(String(q)); } else top.push("");
  });
  var w = ch.length * cw, s = '<svg viewBox="0 0 520 220" role="img" aria-label="' + numStr + ' divided by ' + dv + ' using the bus stop method">' +
    '<rect width="520" height="220" rx="16" fill="#fffbe0"/>' +
    Tm(x0 - 26, 130, dv) + '<path d="M' + (x0 - 8) + ' 152V92h' + (w + 14) + '" stroke="#141a33" stroke-width="3" fill="none"/>';
  ch.forEach(function(c, k){
    var x = x0 + 8 + k * cw + cw / 2;
    s += Tm(x, 132, c) + (top[k] ? Tm(x, 78, top[k], 28, 'fill="#1f7a54"') : "");
    if(small[k]) s += T(x - 18, 114, small[k], 15, 'fill="#e04848" font-weight="700"');
  });
  lines.forEach(function(l, k){ s += T(310, 44 + k * 28, l, 15); });
  return s + T(310, 44 + lines.length * 28, "Answer: " + top.join(""), 16, 'font-weight="700" fill="#1f7a54"') + '</svg>';
}

/* decimals: take the point out, put it back */
function pointOut(a, b, bare, ans, dp){
  return '<svg viewBox="0 0 520 210" role="img" aria-label="Take the decimal points out, multiply, then put them back">' +
    '<rect width="520" height="210" rx="16" fill="#e8f7ff"/>' +
    T(30, 44, "1  Take the points out", 15, 'font-weight="700"') + T(300, 44, a + " " + X + " " + b, 18) +
    T(30, 94, "2  Multiply", 15, 'font-weight="700"') + T(300, 94, bare, 18) +
    T(30, 144, "3  Count decimal places", 15, 'font-weight="700"') + T(300, 144, dp + " in the question", 18) +
    T(30, 194, "4  Put them back", 15, 'font-weight="700"') + T(300, 194, ans, 20, 'font-weight="700" fill="#1f7a54"') +
    '</svg>';
}

/* inverse: there and back again */
function inv(a, op, b, c, opBack){
  return '<svg viewBox="0 0 520 200" role="img" aria-label="' + a + ' goes to ' + c + ', and the inverse takes it back">' +
    '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
    '<rect x="30" y="66" width="120" height="64" rx="12" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' + T(90, 108, a, 24, 'text-anchor="middle" font-weight="700"') +
    '<rect x="370" y="66" width="120" height="64" rx="12" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' + T(430, 108, c, 24, 'text-anchor="middle" font-weight="700"') +
    '<path d="M160 74q100 -60 200 0" stroke="#3a8fd6" stroke-width="4" fill="none"/><path d="M346 62l14 12 -18 4" stroke="#3a8fd6" stroke-width="4" fill="none"/>' +
    T(260, 34, op + " " + b, 20, 'text-anchor="middle" font-weight="700" fill="#2a6fb0"') +
    '<path d="M360 122q-100 60 -200 0" stroke="#19a37a" stroke-width="4" fill="none"/><path d="M174 134l-14 -12 18 -4" stroke="#19a37a" stroke-width="4" fill="none"/>' +
    T(260, 184, opBack + " " + b + " to check", 18, 'text-anchor="middle" font-weight="700" fill="#137a5a"') +
    '</svg>';
}

function esc(t){ return String(t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n){ if(cur.trim()) out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }

(window.A2PACKS = window.A2PACKS || {})["head-or-paper"] = {
  a2: true,
  id: "a2-head-or-paper",
  title: "Head or paper, then check",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 25,
  line: "Some sums are quicker in your head, some are safer on paper. Either way, you can check them.",
  blurb: "Times and divide, with whole numbers and decimals: when to do it in your head, how to do it on paper, and how to check it by undoing it. Four short chunks, and a trick card to make at the end.",
  note: "Times and divide in your head or on paper, then checking it by undoing it. Four five minute chunks and a trick card at the end. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Doodle", line: "Doodle: whole numbers, times and divide by one digit." },
    { id: "medium", name: "Notebook", line: "Notebook: bigger numbers, carrying, and sliding decimals by 10 and 100." },
    { id: "spicy", name: "Chalkboard", line: "Chalkboard: decimals times decimals, dividing by decimals, exam style." }
  ],
  themes: {
    time: { name: "Time travel", w: { things: "time crystals", box: "crate", shop: "the museum shop", person: "the time traveller" } },
    football: { name: "Football", w: { things: "match tickets", box: "kit bag", shop: "the club shop", person: "the kit manager" } },
    horror: { name: "Horror", w: { things: "candles", box: "creaky crate", shop: "the haunted gift shop", person: "the night porter" } },
    fishing: { name: "Fishing", w: { things: "bait tubs", box: "tackle box", shop: "the tackle shop", person: "the angler" } },
    music: { name: "Music", w: { things: "show tickets", box: "prop trunk", shop: "the theatre shop", person: "the stage manager" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: START,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Head or paper?", title: "Pick your tool",
      fig: CHOOSE,
      html: "<p>Before you start a times or divide, ask: <b>head or paper?</b></p>" +
        "<p><b>Head</b> when the numbers are friendly: tens, doubles, fives, 25s. 30 " + X + " 4 is 3 " + X + " 4 with a zero on the end: 120.</p>" +
        "<p><b>Paper</b> when there are lots of digits or carrying, like 347 " + X + " 6. Writing it down stops numbers falling out of your head.</p>" +
        "<p>Either way, the last move is the same: <b>check it</b>.</p>",
      ez: { title: "Head or paper?", html: "<p><b>Head</b> for easy numbers: 30 " + X + " 2.</p><p><b>Paper</b> for big ones: 67 " + X + " 8. Then <b>check</b>.</p>" },
      lv: {
        mild: { html: "<p>Ask: <b>head or paper?</b></p><p><b>Head</b> for friendly numbers: 30 " + X + " 2, 5 " + X + " 4, 40 " + D + " 2.</p><p><b>Paper</b> for lots of digits: 67 " + X + " 8.</p><p>Then <b>check it</b>.</p>" },
        spicy: { html: "<p>Before you start, ask: <b>head or paper?</b></p>" +
          "<p><b>Head</b> when there is a shortcut: 0.5 " + X + " 46 is half of 46, 2.5 " + X + " 4 is 10, and 7.2 " + D + " 0.9 is the same as 72 " + D + " 9.</p>" +
          "<p><b>Paper</b> when there are several digits on both sides, like 8.47 " + X + " 3.9. Exams give marks for working, so writing it down pays twice.</p>" +
          "<p>Either way, finish by <b>checking with the inverse</b>.</p>" } } },

    { type: "sort", topic: "Head or paper?",
      q: "Head or paper? Sort them the way most people would.",
      buckets: ["In my head", "On paper"],
      cards: [["40 " + X + " 3", 0], ["347 " + X + " 6", 1], ["60 " + D + " 2", 0], ["1872 " + D + " 8", 1], ["25 " + X + " 4", 0], ["736 " + X + " 9", 1]],
      hint: "Tens, doubles and 25s are friendly. Three or four digits with carrying are not.",
      why: "Friendly numbers can be done in your head. Big numbers with carrying are safer written down.",
      ez: { q: "Head or paper? Sort them.", hint: "Tens and 5s are easy.", why: "Easy numbers in your head. Big ones on paper." },
      lv: {
        mild: { cards: [["20 " + X + " 3", 0], ["67 " + X + " 8", 1], ["10 " + X + " 5", 0], ["96 " + D + " 4", 1]] },
        spicy: { cards: [["0.5 " + X + " 46", 0], ["8.47 " + X + " 3.9", 1], ["2.5 " + X + " 4", 0], ["452.6 " + D + " 7", 1], ["7.2 " + D + " 0.9", 0], ["38.6 " + X + " 47", 1]],
          why: "Halves, 2.5 " + X + " 4 and 72 " + D + " 9 have shortcuts. Lots of digits on both sides is paper work." } } },

    { type: "mc", topic: "Head or paper?",
      q: "Which trick makes 25 " + X + " 16 easy in your head?",
      options: ["16 is 4 " + X + " 4, so do 25 " + X + " 4 = 100, then 100 " + X + " 4", "Add 25 sixteen times", "Do 25 " + X + " 1 and 25 " + X + " 6, then join them up"],
      answer: 0,
      slips: { 1: "That works, but it is slow and easy to lose count. Look for a 25 " + X + " 4 hiding in there.", 2: "Joining digits does not work for times. 16 is not 1 and 6, it is 10 and 6." },
      hint: "Four 25s make 100.",
      why: "25 " + X + " 4 = 100 and 100 " + X + " 4 = 400. Splitting 16 into 4 " + X + " 4 makes it easy.",
      ez: { q: "A quick way to do 4 " + X + " 15?", hint: "Times 4 is double, double.", why: "Double 15 is 30. Double 30 is <b>60</b>.", slips: { 1: "That works, but it is slow.", 2: "15 is 10 and 5. Not 1 and 5." } },
      lv: {
        mild: { q: "What is a quick way to do 4 " + X + " 15 in your head?",
          options: ["Double 15, then double again", "Add 4 fifteen times", "Do 4 " + X + " 1 and 4 " + X + " 5, then join them up"],
          slips: { 1: "That works, but it is slow. Times by 4 is double, then double again.", 2: "Joining digits does not work for times. 15 is 10 and 5, not 1 and 5." },
          hint: "Times by 4 is the same as doubling twice.",
          why: "Double 15 is 30, double 30 is 60. So 4 " + X + " 15 = 60." },
        spicy: { q: "Which trick makes 0.25 " + X + " 36 easy in your head?",
          options: ["0.25 is a quarter, so halve 36 and halve again", "Times 36 by 25, then add a point anywhere", "Do 0 " + X + " 36, then 25 " + X + " 36"],
          slips: { 1: "The point cannot go anywhere: it has a fixed place. A quarter is a quicker route.", 2: "0.25 is not two separate numbers. It is one quarter." },
          hint: "What fraction is 0.25?",
          why: "0.25 is a quarter. Half of 36 is 18, half of 18 is 9. So 0.25 " + X + " 36 = 9." } } },

    { type: "num", topic: "Head or paper?", explain: true,
      q: "Have a go in your head: 25 " + X + " 16",
      boxes: [{ label: "Answer", a: 400 }],
      slips: [[40, "Close, but there is a zero missing. 25 " + X + " 4 is 100, and 100 " + X + " 4 is 400."], [100, "That is 25 " + X + " 4. Now times it by 4 again."], [41, "That is 25 add 16. This one is a times."]],
      hint: "25 " + X + " 4 = 100. Then times by 4 again.",
      why: "25 " + X + " 16 = 25 " + X + " 4 " + X + " 4 = 100 " + X + " 4 = <b>400</b>.",
      ez: { q: "In your head: 4 " + X + " 15", hint: "Double 15. Then double again.", slips: [[null, "That is double 15. Double once more."], [null, "That is 4 add 15. This is a times."]] },
      lv: {
        mild: { q: "Have a go in your head: 4 " + X + " 15", boxes: [{ label: "Answer", a: 60 }],
          slips: [[30, "That is double 15. Double it once more."], [19, "That is 4 add 15. This one is a times."]],
          hint: "Double 15, then double again.",
          why: "Double 15 is 30, double 30 is <b>60</b>." },
        spicy: { q: "Have a go in your head: 0.25 " + X + " 36", boxes: [{ label: "Answer", a: 9 }],
          slips: [[18, "That is half. A quarter is half of a half: halve again."], [900, "That is 25 " + X + " 36. The point matters: 0.25 is only a quarter."], [90, "Check the size: a quarter of 36 has to be less than 36 and less than half of it."]],
          hint: "A quarter: halve, then halve again.",
          why: "Half of 36 is 18, half of 18 is <b>9</b>." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Tricks in your head", title: "Split it up",
      fig: area(7, 40, 6, "280 + 42 = 322"),
      html: "<p>7 " + X + " 46 looks hard. Split 46 into <b>40 and 6</b>.</p>" +
        "<p>7 " + X + " 40 = 280. 7 " + X + " 6 = 42. Add them: 280 + 42 = <b>322</b>.</p>" +
        "<p>Dividing splits too: 84 " + D + " 4 is 80 " + D + " 4 = 20 and 4 " + D + " 4 = 1, so <b>21</b>. To divide by 4, you can also halve and halve again.</p>",
      ez: { html: "<p>3 " + X + " 24: split 24 into <b>20 and 4</b>.</p><p>60 + 12 = <b>72</b>.</p>" },
      lv: {
        mild: { fig: area(3, 20, 4, "60 + 12 = 72"),
          html: "<p>3 " + X + " 24: split 24 into <b>20 and 4</b>.</p><p>3 " + X + " 20 = 60. 3 " + X + " 4 = 12.</p><p>Add them: 60 + 12 = <b>72</b>.</p><p>To divide by 2, halve it. 48 " + D + " 2 is 24.</p>" },
        spicy: { fig: area(4, 3, 0.6, "12 + 2.4 = 14.4"),
          html: "<p>Decimals split too. 4 " + X + " 3.6: split 3.6 into <b>3 and 0.6</b>.</p>" +
            "<p>4 " + X + " 3 = 12. 4 " + X + " 0.6 = 2.4 (because 4 " + X + " 6 = 24, and 0.6 is ten times smaller). Add them: <b>14.4</b>.</p>" +
            "<p>Dividing: 9.6 " + D + " 4 is half of 9.6 (4.8), then half again: <b>2.4</b>.</p>" } } },

    { type: "num", topic: "Tricks in your head",
      q: "Your turn, with the steps laid out: 8 " + X + " 37",
      boxes: [{ label: "8 " + X + " 30 =", a: 240 }, { label: "8 " + X + " 7 =", a: 56 }, { label: "Add them:", a: 296 }],
      slips: [[2, 247, "You added the 7 instead of timesing it. 8 " + X + " 7 is 56."], [0, 24, "8 " + X + " 30 is ten times bigger than 8 " + X + " 3."]],
      hint: "8 " + X + " 3 = 24, so 8 " + X + " 30 = 240.",
      why: "240 + 56 = <b>296</b>.",
      ez: { q: "Your turn: 4 " + X + " 23", hint: "4 " + X + " 2 = 8. So 4 " + X + " 20 = 80.", slips: [[null, null, "You added the 3. 4 " + X + " 3 is 12."], [null, null, "4 " + X + " 20 is 10 times 4 " + X + " 2."]] },
      lv: {
        mild: { q: "Your turn, with the steps laid out: 4 " + X + " 23",
          boxes: [{ label: "4 " + X + " 20 =", a: 80 }, { label: "4 " + X + " 3 =", a: 12 }, { label: "Add them:", a: 92 }],
          slips: [[2, 83, "You added the 3 instead of timesing it. 4 " + X + " 3 is 12."], [0, 8, "4 " + X + " 20 is ten times bigger than 4 " + X + " 2."]],
          hint: "4 " + X + " 2 = 8, so 4 " + X + " 20 = 80.",
          why: "80 + 12 = <b>92</b>." },
        spicy: { q: "Your turn, with the steps laid out: 6 " + X + " 4.7",
          boxes: [{ label: "6 " + X + " 4 =", a: 24 }, { label: "6 " + X + " 0.7 =", a: 4.2 }, { label: "Add them:", a: 28.2 }],
          slips: [[1, 42, "6 " + X + " 7 is 42, but this is 0.7, ten times smaller."], [1, 0.42, "0.7 has one decimal place, so the answer has one: 4.2."], [2, 24.7, "You added the 0.7 instead of timesing it."]],
          hint: "6 " + X + " 7 = 42, so 6 " + X + " 0.7 = 4.2.",
          why: "24 + 4.2 = <b>28.2</b>." } } },

    { type: "num", topic: "Tricks in your head",
      q: "[[Shop]] sells [[things]] in packs of 58. How many in 6 packs? Split it in your head.",
      boxes: [{ label: "[[Things]]", a: 348 }],
      slips: [[308, "You timesed the 50 but just added the 8. 6 " + X + " 8 is 48."], [64, "That is 58 add 6. Six packs means times."], [300, "That is 6 " + X + " 50. Add on 6 " + X + " 8 as well."]],
      hint: "6 " + X + " 50, then 6 " + X + " 8, then add.",
      why: "6 " + X + " 50 = 300 and 6 " + X + " 8 = 48. 300 + 48 = <b>348</b>.",
      ez: { q: "Packs of 34 [[things]]. How many in 5 packs?", hint: "5 " + X + " 30, then 5 " + X + " 4. Add.", why: "150 + 20 = <b>170</b>.", slips: [[null, "You added the 4. 5 " + X + " 4 is 20."], [null, "That is 34 add 5. Try times."], [null, "That is 5 " + X + " 30. Add 5 " + X + " 4 too."]] },
      lv: {
        mild: { q: "[[Shop]] sells [[things]] in packs of 34. How many in 5 packs? Split it in your head.",
          boxes: [{ label: "[[Things]]", a: 170 }],
          slips: [[154, "You timesed the 30 but just added the 4. 5 " + X + " 4 is 20."], [39, "That is 34 add 5. Five packs means times."], [150, "That is 5 " + X + " 30. Add on 5 " + X + " 4 as well."]],
          hint: "5 " + X + " 30, then 5 " + X + " 4, then add.",
          why: "5 " + X + " 30 = 150 and 5 " + X + " 4 = 20. 150 + 20 = <b>170</b>." },
        spicy: { q: "At [[shop]], one pack of [[things]] costs 3.80 pounds. What do 7 packs cost? Split it in your head.",
          boxes: [{ label: "Cost", a: 26.6, pre: "&#163;" }],
          slips: [[21.8, "You timesed the 3 but just added the 0.80. 7 " + X + " 0.8 is 5.6."], [21.56, "7 " + X + " 0.8 is 5.6, not 0.56. Check the decimal places."], [266, "Right digits. Now the point: 7 lots of about 4 pounds is about 28 pounds."]],
          hint: "7 " + X + " 3, then 7 " + X + " 0.8, then add.",
          why: "7 " + X + " 3 = 21 and 7 " + X + " 0.8 = 5.6. 21 + 5.6 = <b>26.60</b> pounds." } } },

    { type: "num", topic: "Tricks in your head",
      q: "Divide in your head: 96 " + D + " 4",
      boxes: [{ label: "Answer", a: 24 }],
      slips: [[48, "That is halving once. Dividing by 4 means halve, then halve again."], [384, "That is 96 " + X + " 4. This one is a divide, so it gets smaller."], [21, "Split it: 80 " + D + " 4 = 20 and 16 " + D + " 4 = 4."]],
      hint: "Halve 96, then halve again. Or split it into 80 and 16.",
      why: "Half of 96 is 48, half of 48 is <b>24</b>.",
      ez: { q: "In your head: 68 " + D + " 2", hint: "Halve 60. Halve 8.", why: "30 and 4 make <b>34</b>.", slips: [[null, "That is 68 " + X + " 2. Halve it instead."], [null, "That is halving twice. Halve once."]] },
      lv: {
        mild: { q: "Divide in your head: 68 " + D + " 2", boxes: [{ label: "Answer", a: 34 }],
          slips: [[136, "That is 68 " + X + " 2. Dividing by 2 makes it smaller: halve it."], [17, "That is halving twice. Divide by 2 only needs one halve."]],
          hint: "Halve the 60, halve the 8.",
          why: "Half of 60 is 30, half of 8 is 4. <b>34</b>." },
        spicy: { q: "Divide in your head: 9.6 " + D + " 4", boxes: [{ label: "Answer", a: 2.4 }],
          slips: [[24, "Right digits. Check the point: 9.6 is under 10, so the answer is under 3."], [4.8, "That is halving once. Halve again to divide by 4."], [38.4, "That is 9.6 " + X + " 4. Dividing makes it smaller."]],
          hint: "Halve 9.6, then halve again.",
          why: "Half of 9.6 is 4.8, half of 4.8 is <b>2.4</b>." } } },

    { type: "learn", topic: "Tricks in your head", title: "Slide the digits",
      fig: pv("3.7", 2, "3.7 " + X + " 100 = 370: the digits slide two places"),
      html: "<p>Times by 10 or 100: the <b>digits slide left</b>, one place for each zero. The decimal point stays still.</p>" +
        "<p>3.7 " + X + " 100 = <b>370</b>. A zero fills the empty ones column.</p>" +
        "<p>Divide by 10 or 100: the digits slide <b>right</b>.</p>",
      ez: { html: "<p>Times 10: the digits <b>slide left</b>.</p><p>14 " + X + " 10 = <b>140</b>.</p>" },
      lv: {
        mild: { fig: pv("14", 1, "14 " + X + " 10 = 140: the digits slide one place"),
          html: "<p>Times by 10: the <b>digits slide left</b> one place.</p><p>14 " + X + " 10 = <b>140</b>. A zero fills the gap.</p>" },
        spicy: { fig: pv("52", -3, "52 " + D + " 1000 = 0.052: three places right"),
          html: "<p>Times or divide by 10, 100 or 1000: the <b>digits slide</b>, one place for each zero. The point stays still.</p>" +
            "<p>52 " + D + " 1000 = <b>0.052</b>. Zeros hold the empty places.</p>" +
            "<p>This is how dividing by a decimal works too: 4.8 " + D + " 0.6 is the same as 48 " + D + " 6, because both numbers slid the same way.</p>" } } },

    { type: "mc", topic: "Tricks in your head",
      q: "4.6 " + X + " 100 = ?",
      options: ["460", "4.600", "46", "0.046"],
      answer: 0,
      slips: { 1: "Zeros on the end of a decimal do not change it. The digits need to slide two places left.", 2: "That is one slide, for times 10. Times 100 slides two places.", 3: "That slid the other way. Times makes it bigger." },
      hint: "Times 100: the digits slide two places to the left.",
      why: "4 slides into the hundreds, 6 into the tens, and a zero fills the ones: <b>460</b>.",
      ez: { hint: "Slide left. Add a zero.", slips: { 1: "Slide the digits. Do not add 10 on.", 2: "23.0 is still 23.", 3: "That slid right. Times makes it bigger." } },
      lv: {
        mild: { q: "23 " + X + " 10 = ?", options: ["230", "2310", "23.0", "2.3"],
          slips: { 1: "Do not just stick a 10 on the end. Slide the digits one place left and fill the gap with a zero.", 2: "23.0 is still 23. Times 10 makes it bigger.", 3: "That slid the other way. Times makes it bigger." },
          hint: "Slide the digits one place left. Fill the gap with a zero.",
          why: "23 " + X + " 10 = <b>230</b>." },
        spicy: { q: "0.36 " + D + " 100 = ?", options: ["0.0036", "36", "0.036", "3.6"],
          slips: { 1: "That slid the other way. Dividing makes it smaller.", 2: "That is one slide, for divide by 10. Divide by 100 slides two places.", 3: "That is bigger than 0.36. Divide makes it smaller." },
          hint: "Divide by 100: the digits slide two places to the right.",
          why: "Two slides right: 0.36, 0.036, <b>0.0036</b>." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "On paper", title: "Write it down, one column at a time",
      routes: [
        { name: "Times", fig: colMul(347, 6), html: "<p><b>Short multiplication.</b> Start on the right. Times each digit, write the ones digit down, <b>carry</b> the tens to the next column.</p><p>347 " + X + " 6 = <b>2082</b>.</p>" },
        { name: "Divide", fig: bus("1872", 8), html: "<p><b>Bus stop division.</b> Start on the left. How many 8s in each digit? Any <b>remainder</b> hops to the next digit.</p><p>1872 " + D + " 8 = <b>234</b>.</p>" }
      ],
      ez: { title: "On paper", routes: ["<p>Start on the right. Write 8, <b>carry</b> 1.</p><p>46 " + X + " 3 = <b>138</b>.</p>", "<p>Start on the left. The 1 left <b>hops</b> over.</p><p>72 " + D + " 3 = <b>24</b>.</p>"] },
      lv: {
        mild: { routes: [
          { name: "Times", fig: colMul(46, 3), html: "<p>Start on the right. 6 " + X + " 3 = 18: write 8, carry 1.</p><p>4 " + X + " 3 = 12, add the carry: 13.</p><p>46 " + X + " 3 = <b>138</b>.</p>" },
          { name: "Divide", fig: bus("72", 3), html: "<p>Start on the left. 7 " + D + " 3 = 2, remainder 1. The 1 hops over to make 12.</p><p>12 " + D + " 3 = 4. So 72 " + D + " 3 = <b>24</b>.</p>" }
        ] },
        spicy: { routes: [
          { name: "Times", fig: pointOut("3.68", "7", "368 " + X + " 7 = 2576", "25.76", "2"), html: "<p><b>Decimals times.</b> Take the points out, multiply as whole numbers, then count the decimal places in the question and put that many back.</p><p>0.3 " + X + " 0.4: 3 " + X + " 4 = 12, two decimal places, so <b>0.12</b>.</p>" },
          { name: "Divide", fig: bus("45.6", 3), html: "<p><b>Dividing by a decimal.</b> Slide both numbers until you are dividing by a whole number: 4.56 " + D + " 0.3 is the same as 45.6 " + D + " 3.</p><p>Then bus stop, keeping the point in line: <b>15.2</b>.</p>" }
        ] } } },

    { type: "num", topic: "On paper",
      q: "Have a go at 258 " + X + " 4 the same way. One row at a time.",
      fig: colMul(258, 4, true),
      boxes: [{ label: "8 " + X + " 4 =", a: 32 }, { label: "5 " + X + " 4 + carry 3 =", a: 23 }, { label: "2 " + X + " 4 + carry 2 =", a: 10 }, { label: "Answer:", a: 1032 }],
      slips: [[3, 832, "Looks like a carry went missing. Each carry gets added to the next column."], [1, 20, "Do not forget the carry of 3 from the first column."], [3, 8232, "Write only the ones digit in each column and carry the tens."]],
      hint: "Right to left. Write the ones digit, carry the tens.",
      why: "32: write 2 carry 3. 20 + 3 = 23: write 3 carry 2. 8 + 2 = 10. <b>1032</b>.",
      ez: { q: "Now you: 57 " + X + " 3. 1 row at a time.", hint: "7 " + X + " 3 = 21. Write 1, carry 2.", why: "15 + 2 = 17. <b>171</b>.", slips: [[null, null, "The carry went missing. Add it on."], [null, null, "Add the carry of 2."], [null, null, "Write the ones digit. Carry the tens."]] },
      lv: {
        mild: { q: "Have a go at 57 " + X + " 3 the same way. One row at a time.",
          fig: colMul(57, 3, true),
          boxes: [{ label: "7 " + X + " 3 =", a: 21 }, { label: "5 " + X + " 3 + carry 2 =", a: 17 }, { label: "Answer:", a: 171 }],
          slips: [[2, 151, "Looks like the carry went missing. Add it to the next column."], [1, 15, "Do not forget the carry of 2."], [2, 1521, "Write only the ones digit, and carry the tens."]],
          hint: "7 " + X + " 3 = 21: write 1, carry 2.",
          why: "21: write 1 carry 2. 15 + 2 = 17. <b>171</b>." },
        spicy: { q: "Have a go at 3.68 " + X + " 7, one step at a time.",
          fig: pointOut("3.68", "7", "368 " + X + " 7 = ?", "?", "?"),
          boxes: [{ label: "368 " + X + " 7 =", a: 2576 }, { label: "Decimal places in 3.68:", a: 2 }, { label: "Answer:", a: 25.76 }],
          slips: [[2, 257.6, "Count the decimal places in 3.68: two, so the answer needs two."], [2, 2576, "Put the point back. 3.68 is about 4, so the answer is about 28."], [0, 2156, "A carry went missing. Check each column."]],
          hint: "Take the point out, multiply, then put two decimal places back.",
          why: "368 " + X + " 7 = 2576. Two decimal places: <b>25.76</b>." } } },

    { type: "num", topic: "On paper",
      q: "Now a bus stop: 936 " + D + " 4. One step at a time.",
      boxes: [{ label: "9 " + D + " 4 = 2 remainder", a: 1 }, { label: "13 " + D + " 4 = 3 remainder", a: 1 }, { label: "16 " + D + " 4 =", a: 4 }, { label: "Answer:", a: 234 }],
      slips: [[3, 2134, "Only the answers to each step go on top. The remainders hop across underneath."], [3, 232, "The remainder of 1 hops over to make 13, not 3."]],
      hint: "How many 4s in 9? Two, with 1 left over. The 1 hops onto the 3.",
      why: "2 r 1, then 13 " + D + " 4 = 3 r 1, then 16 " + D + " 4 = 4. <b>234</b>.",
      ez: { q: "Bus stop: 72 " + D + " 3. 1 step at a time.", hint: "How many 3s in 7?", slips: [[null, null, "Only the answers go on top."], [null, null, "The 1 left over hops on. Make 12."]] },
      lv: {
        mild: { q: "Now a bus stop: 72 " + D + " 3. One step at a time.",
          boxes: [{ label: "7 " + D + " 3 = 2 remainder", a: 1 }, { label: "12 " + D + " 3 =", a: 4 }, { label: "Answer:", a: 24 }],
          slips: [[2, 214, "Only the answers to each step go on top. The remainder hops across underneath."], [2, 20, "Do not stop at the 2. The 1 left over hops over to make 12."]],
          hint: "How many 3s in 7? Two, with 1 left over.",
          why: "7 " + D + " 3 = 2 r 1. 12 " + D + " 3 = 4. <b>24</b>." },
        spicy: { q: "4.56 " + D + " 0.3. Slide both numbers first, then bus stop.",
          boxes: [{ label: "Slid: ? " + D + " 3, where ? is", a: 45.6 }, { label: "Answer:", a: 15.2 }],
          slips: [[1, 1.52, "Check the size: 4.56 " + D + " 0.3 is like 4.5 " + D + " a third, about 15."], [1, 152, "Keep the point in line with the point in 45.6."], [0, 4.56, "Slide both numbers one place so you divide by 3, not 0.3."]],
          hint: "Times both by 10: 45.6 " + D + " 3.",
          why: "45.6 " + D + " 3: 4 " + D + " 3 = 1 r 1, 15 " + D + " 3 = 5, then the point, 6 " + D + " 3 = 2. <b>15.2</b>." } } },

    { type: "num", topic: "On paper",
      q: "On your own: 486 " + X + " 7. Use the working space if you like.",
      boxes: [{ label: "Answer", a: 3402 }],
      slips: [[2862, "The carries went missing. Each one gets added to the next column."], [493, "That is 486 add 7. This one is a times."], [3362, "Check the middle column: 8 " + X + " 7 = 56, plus the carry of 4."]],
      hint: "6 " + X + " 7 = 42: write 2, carry 4. Keep going left.",
      why: "42: write 2 carry 4. 56 + 4 = 60: write 0 carry 6. 28 + 6 = 34. <b>3402</b>.",
      ez: { q: "On your own: 68 " + X + " 4", hint: "8 " + X + " 4 = 32. Write 2, carry 3.", why: "24 + 3 = 27. <b>272</b>.", slips: [[null, "The carry went missing. Carry the 3."], [null, "That is 68 add 4. Try times."], [null, "Write the ones digit. Carry the tens."]] },
      lv: {
        mild: { q: "On your own: 68 " + X + " 4. Use the working space if you like.",
          boxes: [{ label: "Answer", a: 272 }],
          slips: [[242, "The carry went missing. 8 " + X + " 4 = 32: carry the 3."], [72, "That is 68 add 4. This one is a times."], [2432, "Write only the ones digit, and carry the tens."]],
          hint: "8 " + X + " 4 = 32: write 2, carry 3.",
          why: "32: write 2 carry 3. 24 + 3 = 27. <b>272</b>." },
        spicy: { q: "On your own: 2.4 " + X + " 0.3",
          boxes: [{ label: "Answer", a: 0.72 }],
          slips: [[7.2, "2.4 has one decimal place and 0.3 has one, so the answer needs two."], [72, "Put the points back: two decimal places altogether."], [0.072, "One place too many. Count: one in 2.4, one in 0.3, two altogether."]],
          hint: "24 " + X + " 3, then count the decimal places.",
          why: "24 " + X + " 3 = 72. Two decimal places: <b>0.72</b>. Sense check: 2.4 " + X + " a bit under a third is a bit under 0.8." } } },

    { type: "num", topic: "On paper",
      q: "On your own: 2135 " + D + " 7. Watch out for a hiding zero.",
      boxes: [{ label: "Answer", a: 305 }],
      slips: [[35, "A zero is hiding. 7 does not go into 3, so write 0 above it and hop the 3 over."], [3005, "Only one step has no 7s in it. Check each digit again."]],
      hint: "21 " + D + " 7 = 3. Then 3 " + D + " 7 = 0 remainder 3. Then 35 " + D + " 7.",
      why: "3, then 0 (remainder 3), then 35 " + D + " 7 = 5. <b>305</b>.",
      ez: { q: "On your own: 78 " + D + " 3", slips: [[null, "The 1 left over hops on. Make 18."], [null, "That is 78 " + X + " 3. Divide makes it smaller."]] },
      lv: {
        mild: { q: "On your own: 78 " + D + " 3.",
          boxes: [{ label: "Answer", a: 26 }],
          slips: [[22, "7 " + D + " 3 is 2 remainder 1. The 1 hops over to make 18."], [234, "That is 78 " + X + " 3. Dividing makes it smaller."]],
          hint: "7 " + D + " 3 = 2 remainder 1.",
          why: "7 " + D + " 3 = 2 r 1. 18 " + D + " 3 = 6. <b>26</b>." },
        spicy: { q: "On your own: 61.2 " + D + " 0.6. Watch out for a hiding zero.",
          boxes: [{ label: "Answer", a: 102 }],
          slips: [[12, "A zero is hiding: 6 does not go into 1, so write 0 above it."], [10.2, "Slide both numbers first, so you divide by 6, not 0.6."], [1.02, "Check the size: dividing by less than 1 makes it bigger."]],
          hint: "Slide both: 612 " + D + " 6.",
          why: "612 " + D + " 6: 6 " + D + " 6 = 1, 1 " + D + " 6 = 0 r 1, 12 " + D + " 6 = 2. <b>102</b>." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Check it", title: "Undo it to check it",
      fig: inv("234", X, "8", "1872", D),
      html: "<p>Times and divide <b>undo</b> each other. They are called <b>inverse</b> operations.</p>" +
        "<p>1872 " + D + " 8 = 234? Check by going back the other way: 234 " + X + " 8. If you land on 1872, it is right.</p>" +
        "<p>A quick size check helps too: 1872 " + D + " 8 is roughly 1600 " + D + " 8 = 200, so 234 is a sensible size.</p>",
      ez: { html: "<p>Times and divide <b>undo</b> each other.</p><p>84 " + D + " 4 = 21? Check: 21 " + X + " 4 = 84. Yes!</p>" },
      lv: {
        mild: { fig: inv("21", X, "4", "84", D),
          html: "<p>Times and divide <b>undo</b> each other.</p><p>84 " + D + " 4 = 21? Check it: 21 " + X + " 4 = 84. Yes.</p><p>If you do not land back where you started, have another look.</p>" },
        spicy: { fig: inv("15.2", X, "0.3", "4.56", D),
          html: "<p>Times and divide are <b>inverse operations</b>: each undoes the other.</p>" +
            "<p>4.56 " + D + " 0.3 = 15.2? Check: 15.2 " + X + " 0.3 = 4.56. It lands back, so it is right.</p>" +
            "<p>Add an <b>estimate</b> as a second check: 4.5 " + D + " 0.3 is like asking how many 30p in 4.50 pounds. About 15.</p>" } } },

    { type: "mc", topic: "Check it",
      q: "Which one checks 312 " + D + " 6 = 52?",
      options: ["52 " + X + " 6", "312 " + X + " 6", "52 " + D + " 6", "312 take away 6"],
      answer: 0,
      slips: { 1: "That makes a huge number. Start from the answer, 52, and undo the divide.", 2: "Dividing again does not undo a divide. Times undoes it.", 3: "Take away undoes add, not divide." },
      hint: "Start from the answer and do the opposite.",
      why: "The opposite of " + D + " 6 is " + X + " 6. 52 " + X + " 6 = 312, so it is right.",
      ez: { hint: "Start from the answer. Do the opposite.", why: "21 " + X + " 4 = 84. So it is right.", slips: { 1: "That gets huge. Start from 21.", 2: "Times undoes a divide." } },
      lv: {
        mild: { q: "Which one checks 84 " + D + " 4 = 21?", options: ["21 " + X + " 4", "84 " + X + " 4", "21 " + D + " 4"],
          slips: { 1: "That makes a huge number. Start from the answer, 21, and do the opposite.", 2: "Dividing again does not undo a divide. Times undoes it." },
          why: "21 " + X + " 4 = 84, so it is right." },
        spicy: { q: "Which one checks 2.4 " + X + " 0.3 = 0.72?", options: ["0.72 " + D + " 0.3", "0.72 " + X + " 0.3", "2.4 " + D + " 0.3", "0.72 take away 0.3"],
          slips: { 1: "Timesing again does not undo a times. Divide undoes it.", 2: "That starts from the question, not the answer.", 3: "Take away undoes add, not times." },
          why: "0.72 " + D + " 0.3 = 2.4, so it lands back where it started." } } },

    { type: "mc", topic: "Check it", explain: true,
      q: "Jay worked out 642 " + D + " 6 = 17. Check it with the inverse. What do you find?",
      fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay with a speech bubble">' + A2ART.jay(90, 54, 0.85, "wow") +
        A2ART.bubble(160, 16, 220, 56, "642 / 6 = 17.\nOutrageous? Me?", 176) + '</svg>',
      options: ["17 " + X + " 6 = 102, so it is out. It should be 107", "17 " + X + " 6 = 642, so Jay is right", "17 " + X + " 6 = 102, so it should be 102"],
      answer: 0,
      slips: { 1: "Have another go at 17 " + X + " 6: 10 " + X + " 6 = 60 and 7 " + X + " 6 = 42.", 2: "102 is where the check lands, not the answer. The check shows Jay lost a hiding zero." },
      hint: "Work out 17 " + X + " 6. Does it land on 642?",
      why: "17 " + X + " 6 = 102, nowhere near 642. Jay skipped the hiding zero: 6 " + D + " 6 = 1, 4 " + D + " 6 = 0 r 4, 42 " + D + " 6 = 7. The answer is 107.",
      ez: { q: "Jay says 48 " + D + " 4 = 11. Check it. What do you find?", hint: "Work out 11 " + X + " 4.", why: "11 " + X + " 4 = 44, not 48. It is <b>12</b>.", slips: { 1: "Try again. Four 11s is 44." } },
      lv: {
        mild: { q: "Jay worked out 48 " + D + " 4 = 11. Check it with the inverse. What do you find?",
          fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay with a speech bubble">' + A2ART.jay(90, 54, 0.85, "wow") +
            A2ART.bubble(160, 16, 220, 56, "48 / 4 = 11.\nOutrageous? Me?", 176) + '</svg>',
          options: ["11 " + X + " 4 = 44, so it is out. It should be 12", "11 " + X + " 4 = 48, so Jay is right"],
          slips: { 1: "Have another go at 11 " + X + " 4. Four 11s is 44." },
          hint: "Work out 11 " + X + " 4. Does it land on 48?",
          why: "11 " + X + " 4 = 44, not 48. 4 more is one more 4, so the answer is 12." },
        spicy: { q: "Jay worked out 4.8 " + D + " 0.06 = 8. Check it with the inverse. What do you find?",
          fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay with a speech bubble">' + A2ART.jay(90, 54, 0.85, "wow") +
            A2ART.bubble(160, 16, 230, 56, "4.8 / 0.06 = 8.\nOutrageous? Me?", 176) + '</svg>',
          options: ["8 " + X + " 0.06 = 0.48, so it is out. It should be 80", "8 " + X + " 0.06 = 4.8, so Jay is right", "8 " + X + " 0.06 = 0.48, so it should be 0.8"],
          slips: { 1: "Have another go at 8 " + X + " 0.06: 8 " + X + " 6 = 48, with two decimal places.", 2: "Dividing by a number under 1 makes it bigger, not smaller. Slide both: 480 " + D + " 6." },
          hint: "Work out 8 " + X + " 0.06. Does it land on 4.8?",
          why: "8 " + X + " 0.06 = 0.48, ten times too small. Slide both numbers: 480 " + D + " 6 = 80." } } },

    { type: "multi", topic: "Check it",
      q: "Which of these are right? Check each one with the inverse.",
      fig: '<svg viewBox="0 0 320 120" role="img" aria-label="Bonnie the poodle with a pencil">' + A2ART.bonnie(150, 64, 1, "sit") +
        A2ART.egg('<text x="230" y="110" ' + F + ' font-size="13" fill="#141a33" fill-opacity=".45">woof</text>', "Bonnie checked them all by sniffing. Her method needs work.") + '</svg>',
      options: ["45 " + X + " 3 = 135", "128 " + D + " 4 = 32", "56 " + X + " 7 = 382", "306 " + D + " 9 = 24"],
      answers: [0, 1],
      hint: "For a times, divide back. For a divide, times back.",
      why: "135 " + D + " 3 = 45 and 32 " + X + " 4 = 128 both land back. 382 " + D + " 7 does not give 56 (56 " + X + " 7 = 392), and 24 " + X + " 9 = 216, not 306 (it should be 34).",
      ez: { q: "Which are right? Check each one.", hint: "Times? Divide back. Divide? Times back.", why: "The first 2 land back. The others do not." },
      lv: {
        mild: { options: ["12 " + X + " 4 = 48", "60 " + D + " 5 = 12", "7 " + X + " 8 = 54", "45 " + D + " 5 = 8"],
          why: "48 " + D + " 4 = 12 and 12 " + X + " 5 = 60 land back. 7 " + X + " 8 is 56, and 8 " + X + " 5 = 40, not 45 (it should be 9)." },
        spicy: { options: ["2.5 " + X + " 0.4 = 1", "7.2 " + D + " 0.9 = 8", "0.3 " + X + " 0.3 = 0.9", "4.8 " + D + " 0.06 = 8"],
          why: "1 " + D + " 0.4 = 2.5 and 8 " + X + " 0.9 = 7.2 land back. 0.3 " + X + " 0.3 is 0.09 (two decimal places), and 8 " + X + " 0.06 = 0.48, so that one should be 80." } } },

    { type: "text", topic: "Check it", stretch: true,
      q: "Someone says 1404 " + D + " 9 = 156. How could you check it without dividing again? Write it in your own words.",
      need: [["times", "x", "multiply", "multiplied", "multiplying"], ["9", "nine"]],
      model: "Work out 156 x 9 and see if it lands on 1404.",
      slips: [[["divide", "divided", "dividing"], "Dividing again just repeats it. Undo it instead: which operation undoes a divide?"]],
      hint: "Start from 156 and undo the divide.",
      why: "156 " + X + " 9 = 1404, so it is right. Times undoes divide.",
      ez: { q: "Is 84 " + D + " 4 = 21? How could you check?", hint: "Start from 21. Undo the divide.", why: "21 " + X + " 4 = 84. So it is right.", slips: [[null, "Dividing again repeats it. What undoes divide?"]] },
      lv: {
        mild: { q: "Someone says 84 " + D + " 4 = 21. How could you check it? Write it in your own words.",
          need: [["times", "x", "multiply", "multiplied", "multiplying", "lots"], ["4", "four"]],
          model: "Do 21 x 4 and see if it makes 84.",
          hint: "Start from 21 and undo the divide.",
          why: "21 " + X + " 4 = 84, so it is right." },
        spicy: { q: "Someone says 15.2 " + X + " 0.3 = 4.56. How could you check it with the inverse? Then give a quick estimate too, if you like.",
          need: [["divide", "divided", "dividing", "/"], ["0.3", "4.56", "15.2"]],
          model: "Work out 4.56 / 0.3 and see if it gives 15.2. Estimate: 15 x 0.3 is about 4.5.",
          slips: [[["times", "multiply"], "Timesing again does not undo a times. Which operation undoes it?"]],
          hint: "Start from 4.56 and undo the times.",
          why: "4.56 " + D + " 0.3 = 15.2, so it lands back. Estimate: 15 " + X + " 0.3 = 4.5, close to 4.56." } } }
  ],

  ez: {
    realWorld: { title: "No calculator? No problem", html: "<p>Bills, pizza, paint. People <b>check</b> sums every day.</p><p>100 years ago? No calculators. Just head and paper.</p>" },
    make: { intro: "Your best trick, an example, and how to check it." }
  },

  realWorld: {
    title: "No calculator? No problem",
    html: "<p>Checking a bill, sharing a pizza cost, working out how much paint for a wall, spotting a price that does not add up in a shop: people do these in their head or on the back of a receipt every day. Checking it is what stops a mistake costing you money.</p>" +
      "<p>For our big question: if we could time travel, should we? Go back 100 years and there are no phones and no calculators. Head and paper would be all you had. Good job you can check your own answers.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A time portal next to a paper receipt">' + A2ART.portal(80, 75, 56) +
      '<g transform="rotate(-4 290 75)"><path d="M230 14h120v120l-10 -8 -10 8 -10 -8 -10 8 -10 -8 -10 8 -10 -8 -10 8 -10 -8 -10 8 -10 -8 -10 8z" fill="#fff" stroke="#141a33" stroke-width="2"/>' +
      T(244, 40, "3 " + X + " 2.40", 14) + T(244, 64, "= 7.20", 14, 'font-weight="700"') + T(244, 94, "check:", 14) + T(244, 116, "7.20 " + D + " 3", 14) + '</g>' +
      A2ART.bird(386, 30, 0.7, "#ff5d5d") + '</svg>'
  },

  make: {
    title: "Make a trick card",
    intro: "Your favourite trick from today, with an example and how you would check it. Keep it in your pencil case or send it to Jay.",
    fields: [
      { id: "trick", label: "My favourite trick", ph: "Split the big number into tens and ones", max: 70 },
      { id: "eg", label: "An example", ph: "7 x 46 = 280 + 42 = 322", max: 40 },
      { id: "check", label: "How I check it", ph: "322 / 7 should give 46", max: 40 },
      { id: "name", label: "Card by", ph: "Number ninja", max: 24 }
    ],
    svg: function(v){
      var tr = wrap(v.trick, 28, 3), y = 0;
      function tx(x, yy, t, sz, w, c){ return '<text x="' + x + '" y="' + yy + '" font-family="Verdana,Arial,sans-serif" font-size="' + sz + '"' + (w ? ' font-weight="700"' : "") + ' fill="' + (c || "#ffffff") + '">' + t + '</text>'; }
      var s = "";
      for(var gx = 30; gx < 600; gx += 30) s += '<path d="M' + gx + ' 0V440" stroke="#ffffff" stroke-opacity=".07"/>';
      for(var gy = 30; gy < 440; gy += 30) s += '<path d="M0 ' + gy + 'H600" stroke="#ffffff" stroke-opacity=".07"/>';
      var body = tx(36, 60, "TRICK CARD", 28, 1, "#ffd23f") +
        tx(36, 98, "My trick:", 15, 0, "#a8e6cf") +
        tr.map(function(l, k){ return tx(36, 130 + k * 30, esc(l), 22, 1); }).join("");
      y = 130 + tr.length * 30 + 10;
      body += tx(36, y, "For example:", 15, 0, "#a8e6cf") + wrap(v.eg, 38, 2).map(function(l, k){ return tx(36, y + 26 + k * 24, esc(l), 19, 1); }).join("");
      body += tx(36, 324, "How I check it:", 15, 0, "#a8e6cf") + wrap(v.check, 40, 2).map(function(l, k){ return tx(36, 350 + k * 24, esc(l), 18, 1, "#ffd23f"); }).join("") +
        tx(36, 416, "Card by: " + esc(v.name), 15, 0, "#a8e6cf");
      var badge = '<g transform="translate(510 70)"><circle r="44" fill="#ffd23f"/><text y="-4" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="15" font-weight="700" fill="#1e3d2f">HEAD</text>' +
        '<text y="16" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="13" fill="#1e3d2f">or paper</text></g>';
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 440">' +
        '<rect width="600" height="440" rx="22" fill="#1e3d2f"/>' + s +
        '<rect x="12" y="12" width="576" height="416" rx="16" fill="none" stroke="#a8e6cf" stroke-width="3"/>' +
        body + badge + '</svg>';
    }
  }
};
})();
