/* Base 5 Autumn 2 activity: Written methods.
   Maths. Short and long multiplication, short division, whole numbers
   and decimals, worked example then fade. ASCII only. */
(function(){
var A = window.A2ART;
var INK = "#141a33", F = ' font-family="Verdana,Arial,sans-serif"';
var CARRY = "#d9480f", ANS = "#1f6fb2";

function tx(x, y, s, size, fill, more){
  return '<text x="' + x + '" y="' + y + '"' + F + ' font-size="' + size + '" fill="' + (fill || INK) + '"' + (more || "") + '>' + s + '</text>';
}
/* a blank to fill, drawn as a dashed box */
function blank(cx, y, w){
  w = w || 22;
  return '<rect x="' + (cx - w / 2) + '" y="' + (y - 23) + '" width="' + w + '" height="29" rx="5" fill="#f3eeff" stroke="#8a5cf6" stroke-width="2" stroke-dasharray="5 3"/>';
}
/* squared maths paper behind a sum */
function paper(W, H, R, cw){
  var p = '<rect width="' + W + '" height="' + H + '" rx="16" fill="#f7fbff"/>', x, y;
  for(x = R; x > 8; x -= cw) p += '<path d="M' + x + ' 8V' + (H - 8) + '" stroke="#dbe7f5" stroke-width="1.5"/>';
  for(x = R + cw; x < W - 8; x += cw) p += '<path d="M' + x + ' 8V' + (H - 8) + '" stroke="#dbe7f5" stroke-width="1.5"/>';
  for(y = 34; y < H - 8; y += 20) p += '<path d="M8 ' + y + 'H' + (W - 8) + '" stroke="#e8eff8" stroke-width="1"/>';
  return p;
}

/* A written column method. rows: {t, op, small, rule, col, hl:[i], note}
   t is right aligned; "?" in t is a blank to fill; small rows are carries. */
function cols(rows, o){
  o = o || {};
  var cw = 30, R = o.right || 200, W = o.w || 440, y = 10, out = "", n = 0;
  rows.forEach(function(r){ if(r.t) n = Math.max(n, r.t.length); });
  rows.forEach(function(r){
    var big = !r.small;
    y += big ? 40 : 22;
    if(r.rule) out += '<path d="M' + (R - (n + 1) * cw) + ' ' + (y - 30) + 'H' + (R + 4) + '" stroke="' + INK + '" stroke-width="3"/>';
    var t = r.t || "";
    for(var i = 0; i < t.length; i++){
      var ch = t.charAt(i), cx = R - (t.length - i - 0.5) * cw;
      if(ch === " ") continue;
      if(ch === "?"){ out += blank(cx, y); continue; }
      var fill = (r.hl && r.hl.indexOf(i) >= 0) ? CARRY : (r.col || (big ? INK : CARRY));
      out += tx(cx, y, ch, big ? 26 : 15, fill, ' text-anchor="middle" font-weight="700"');
    }
    if(r.op) out += tx(R - (n + 0.5) * cw, y, r.op, 26, INK, ' text-anchor="middle" font-weight="700"');
    if(r.note) out += tx(R + 22, y - 4, r.note, 14, "#5b6180");
  });
  var H = o.h || (y + 22);
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (o.label || "A written method set out in columns") + '">' +
    paper(W, H, R, cw) + out + (o.extra || "") + '</svg>';
}

/* Short division, the bus stop. top and q line up digit for digit;
   carries[i] is the small remainder that hops in front of top[i]. */
function bus(d, top, q, carries, o){
  o = o || {};
  var cw = 34, L = o.left || 110, n = top.length, yq = 62, yd = 116, W = o.w || 440, H = o.h || 150, out = "";
  out += '<rect width="' + W + '" height="' + H + '" rx="16" fill="#f7fbff"/>';
  if(o.hi != null) out += '<rect x="' + (L + 12 + o.hi * cw - 20) + '" y="' + (yd - 32) + '" width="' + (cw + 22) + '" height="44" rx="10" fill="#ffd23f" fill-opacity=".45"/>';
  out += tx(L - 12, yd, d, 28, INK, ' text-anchor="end" font-weight="700"');
  out += '<path d="M' + L + ' ' + (yd + 10) + 'q9 -24 0 -46H' + (L + n * cw + 18) + '" fill="none" stroke="' + INK + '" stroke-width="3"/>';
  for(var i = 0; i < n; i++){
    var cx = L + 12 + (i + 0.5) * cw;
    out += tx(cx, yd, top.charAt(i), 28, INK, ' text-anchor="middle" font-weight="700"');
    var c = (carries || "").charAt(i);
    if(c && c !== " ") out += tx(cx - 17, yd - 14, c, 15, CARRY, ' text-anchor="middle" font-weight="700"');
    var qc = (q || "").charAt(i);
    if(qc === "?") out += blank(cx, yq);
    else if(qc && qc !== " ") out += tx(cx, yq, qc, 28, o.qcol || ANS, ' text-anchor="middle" font-weight="700"');
  }
  if(o.note) out += tx(L + n * cw + 40, yd - 4, o.note, 14, "#5b6180");
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (o.label || "Short division set out as a bus stop") + '">' + out + (o.extra || "") + '</svg>';
}

/* The grid method: split both numbers, multiply each part, add the lot. */
function grid(cs, rs, cells, total, o){
  o = o || {};
  var w = 110, h = 52, x0 = 80, y0 = 50, W = 440, out = "", fills = ["#fff3c4", "#d9f3ff", "#e6f9ef", "#ffe3ec"];
  var H = y0 + rs.length * h + 58;
  out += '<rect width="' + W + '" height="' + H + '" rx="16" fill="#f7fbff"/>';
  out += tx(x0 - 40, y0 - 16, "&#215;", 24, INK, ' text-anchor="middle" font-weight="700"');
  cs.forEach(function(c, k){ out += tx(x0 + k * w + w / 2, y0 - 14, c, 20, ANS, ' text-anchor="middle" font-weight="700"'); });
  rs.forEach(function(r, j){
    out += tx(x0 - 40, y0 + j * h + h / 2 + 7, r, 20, ANS, ' text-anchor="middle" font-weight="700"');
    cs.forEach(function(c, k){
      out += '<rect x="' + (x0 + k * w) + '" y="' + (y0 + j * h) + '" width="' + w + '" height="' + h + '" fill="' + fills[(j * 2 + k) % 4] + '" stroke="' + INK + '" stroke-width="2.5"/>';
      var v = cells[j][k];
      if(v === "?") out += blank(x0 + k * w + w / 2, y0 + j * h + h / 2 + 9, 46);
      else out += tx(x0 + k * w + w / 2, y0 + j * h + h / 2 + 8, v, 20, INK, ' text-anchor="middle" font-weight="700"');
    });
  });
  var yt = y0 + rs.length * h + 38;
  out += tx(x0 - 50, yt, total.replace(/\?/g, ""), 17, INK, ' font-weight="700"');
  if(total.indexOf("?") >= 0) out += blank(x0 - 50 + total.replace(/\?/g, "").length * 9.6 + 34, yt + 3, 56);
  var gx = x0 + cs.length * w + 20;
  if(o.side) out += o.side(gx);
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (o.label || "The grid method") + '">' + out + '</svg>';
}

/* ---------- chunk 1 pictures ---------- */
var C1 = {
  mild: cols([{ t: "347" }, { t: "6", op: "&#215;" }, { t: "2082", rule: true, col: ANS }, { t: " 24 ", small: true }], { label: "347 times 6 worked in columns, answer 2082",
    h: 200, extra: A.jay(392, 74, 0.7, "smile") + A.bubble(236, 22, 120, 50, "Ones first,\nthen carry.", 330) +
      A.egg(A.bird(300, 172, 0.55, "#19c39a"), "A bird on the maths paper. Jay says it is the best column on the page.") }),
  medium: cols([{ t: "2658" }, { t: "7", op: "&#215;" }, { t: "18606", rule: true, col: ANS }, { t: " 445 ", small: true }], { label: "2658 times 7 worked in columns, answer 18606",
    h: 200, extra: A.jay(392, 74, 0.7, "smile") + A.bubble(236, 22, 120, 50, "Ones first,\nthen carry.", 330) +
      A.egg(A.bird(300, 172, 0.55, "#19c39a"), "A bird on the maths paper. Jay says it is the best column on the page.") }),
  spicy: cols([{ t: "347" }, { t: "6", op: "&#215;" }, { t: "2082", rule: true, col: ANS, note: "so 3.47 &#215; 6 = 20.82" }, { t: " 24 ", small: true }], { label: "347 times 6 worked in columns, then the point put back: 20.82",
    h: 200, extra: A.egg(A.bird(300, 172, 0.55, "#19c39a"), "A bird on the maths paper. Jay says it is the best column on the page.") })
};
var C1FADE = {
  mild: cols([{ t: "258" }, { t: "4", op: "&#215;" }, { t: "2", rule: true, col: ANS, note: "8 &#215; 4 = 32" }, { t: "3 ", small: true }], { label: "258 times 4 with only the ones done" }),
  medium: cols([{ t: "4186" }, { t: "6", op: "&#215;" }, { t: "6", rule: true, col: ANS, note: "6 &#215; 6 = 36" }, { t: "3 ", small: true }], { label: "4186 times 6 with only the ones done" }),
  spicy: cols([{ t: "258" }, { t: "4", op: "&#215;" }, { t: "2", rule: true, col: ANS, note: "8 &#215; 4 = 32" }, { t: "3 ", small: true }], { label: "258 times 4 with only the ones done" })
};
var C1SLIP = {
  mild: cols([{ t: "274" }, { t: "3", op: "&#215;" }, { t: "812", rule: true, col: ANS, note: "Answer: 812" }, { t: "21 ", small: true }], { label: "274 times 3 worked out as 812, with a slip somewhere" }),
  medium: cols([{ t: "1568" }, { t: "9", op: "&#215;" }, { t: "13512", rule: true, col: ANS, note: "Answer: 13,512" }, { t: " 467 ", small: true }], { label: "1568 times 9 worked out as 13512, with a slip somewhere" }),
  spicy: '<svg viewBox="0 0 440 150" role="img" aria-label="0.36 times 7 worked out as 25.2">' +
    '<rect width="440" height="150" rx="16" fill="#f7fbff"/>' +
    tx(30, 44, "0.36 &#215; 7 = ?", 22, INK, ' font-weight="700"') +
    tx(30, 84, "36 &#215; 7 = 252", 20, INK) +
    tx(30, 122, "so 0.36 &#215; 7 = 25.2", 20, ANS, ' font-weight="700"') +
    A.jay(370, 50, 0.62, "hmm") + '</svg>'
};

/* ---------- chunk 2 pictures ---------- */
var C2 = {
  mild: grid(["40", "6"], ["20", "3"], [["800", "120"], ["120", "18"]], "800 + 120 + 120 + 18 = 1058", { label: "46 times 23 by the grid method, answer 1058",
    side: function(x){ return tx(x, 70, "46 = 40 + 6", 14, "#5b6180") + tx(x, 94, "23 = 20 + 3", 14, "#5b6180"); } }),
  medium: cols([{ t: "156" }, { t: "34", op: "&#215;" }, { t: "624", rule: true, note: "156 &#215; 4" }, { t: "4680", hl: [3], note: "156 &#215; 30 (0 holds the place)" }, { t: "5304", rule: true, col: ANS, note: "add them up" }], { label: "156 times 34 by long multiplication, answer 5304", right: 170 }),
  spicy: cols([{ t: "46" }, { t: "23", op: "&#215;" }, { t: "138", rule: true, note: "46 &#215; 3" }, { t: "920", hl: [2], note: "46 &#215; 20" }, { t: "1058", rule: true, col: ANS, note: "so 4.6 &#215; 2.3 = 10.58" }], { label: "46 times 23 by long multiplication, then the point put back: 10.58", right: 170 })
};
var C2FADE = {
  mild: grid(["30", "7"], ["20", "4"], [["600", "140"], ["?", "?"]], "Total: ?", { label: "37 times 24 by the grid method, two boxes still to fill" }),
  medium: cols([{ t: "238" }, { t: "45", op: "&#215;" }, { t: "1190", rule: true, note: "238 &#215; 5" }, { t: "????", note: "238 &#215; 40" }, { t: "?????", rule: true, note: "total" }], { label: "238 times 45, second row still to fill", right: 196 }),
  spicy: cols([{ t: "38" }, { t: "27", op: "&#215;" }, { t: "266", rule: true, note: "38 &#215; 7" }, { t: "???", note: "38 &#215; 20" }, { t: "????", rule: true, note: "then put the point back" }], { label: "38 times 27, second row still to fill", right: 170 })
};

/* ---------- chunk 3 pictures ---------- */
var C3 = {
  mild: bus("4", "852", "213", "  1", { note: "852 &#247; 4 = 213", label: "852 divided by 4 as a bus stop, answer 213",
    extra: A.bonnie(392, 104, 0.55, "sit") }),
  medium: bus("6", "3474", " 579", " 345", { note: "= 579", label: "3474 divided by 6 as a bus stop, answer 579",
    extra: A.bonnie(400, 104, 0.5, "sit") }),
  spicy: bus("6", "14.58", " 2.43", " 1 21", { note: "= 2.43", label: "14.58 divided by 6 as a bus stop, answer 2.43",
    extra: A.bonnie(408, 104, 0.5, "sit") })
};
var C3SLIP = {
  mild: bus("6", "624", "1 4", "  2", { note: "Answer: 14", label: "624 divided by 6 worked out as 14" }),
  medium: bus("4", "4836", "12 9", "   3", { note: "Answer: 129", label: "4836 divided by 4 worked out as 129" }),
  spicy: '<svg viewBox="0 0 440 150" role="img" aria-label="0.84 divided by 0.2 worked out as 0.42">' +
    '<rect width="440" height="150" rx="16" fill="#f7fbff"/>' +
    tx(30, 44, "0.84 &#247; 0.2 = ?", 22, INK, ' font-weight="700"') +
    tx(30, 84, "0.84 &#247; 2 = 0.42", 20, INK) +
    tx(30, 122, "Answer: 0.42", 20, ANS, ' font-weight="700"') +
    A.jay(370, 50, 0.62, "hmm") + '</svg>'
};

/* ---------- chunk 4 picture: multiply and divide undo each other ---------- */
function loop(a, b, c){
  return '<svg viewBox="0 0 440 170" role="img" aria-label="' + a + ' times ' + b + ' is ' + c + ', and ' + c + ' divided by ' + b + ' is ' + a + '">' +
    '<rect width="440" height="170" rx="16" fill="#f4f1ea"/>' +
    '<rect x="24" y="24" width="160" height="50" rx="12" fill="#d9f3ff" stroke="' + INK + '" stroke-width="2.5"/>' +
    tx(104, 56, a + " &#215; " + b + " = " + c, 18, INK, ' text-anchor="middle" font-weight="700"') +
    '<rect x="256" y="96" width="160" height="50" rx="12" fill="#e6f9ef" stroke="' + INK + '" stroke-width="2.5"/>' +
    tx(336, 128, c + " &#247; " + b + " = " + a, 18, INK, ' text-anchor="middle" font-weight="700"') +
    '<path d="M190 46q110 0 140 44" fill="none" stroke="#8a5cf6" stroke-width="4" stroke-linecap="round"/><path d="M322 82l9 10 3 -13" fill="none" stroke="#8a5cf6" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M250 124q-110 0 -140 -44" fill="none" stroke="#ff8a3d" stroke-width="4" stroke-linecap="round"/><path d="M118 88l-9 -10 -3 13" fill="none" stroke="#ff8a3d" stroke-width="4" stroke-linecap="round"/>' +
    tx(260, 34, "divide undoes it", 14, "#5b6180") + tx(30, 146, "multiply undoes it", 14, "#5b6180") +
    A.egg(tx(404, 30, "psst", 13, "#141a33", ' fill-opacity=".45"'), "When I was in China... I still checked my answers backwards. Every time. Jay") +
    '</svg>';
}

/* ---------- the stepper widget: short division, one step at a time ---------- */
function mountBus(el, api){
  var P = { mild: ["4", "936"], medium: ["7", "5082"], spicy: ["5", "25.35"] }[api.level] || ["4", "936"];
  var d = +P[0], top = P[1], i, steps = [], rem = 0;
  for(i = 0; i < top.length; i++){
    var ch = top.charAt(i);
    if(ch === "."){ steps.push({ dot: true, i: i }); continue; }
    var cur = rem * 10 + (+ch), qq = Math.floor(cur / d);
    steps.push({ i: i, cur: cur, q: qq, rem: cur - qq * d });
    rem = cur - qq * d;
  }
  var data = api.data;
  if(data.p !== top){ data.p = top; data.k = 0; data.tries = 0; }
  function skipDots(){ while(steps[data.k] && steps[data.k].dot) data.k++; }
  skipDots();
  el.innerHTML = '<div class="wmfig"></div>' +
    '<div class="wmask" style="margin:10px 0 0;padding:12px 14px;border-radius:14px;border:2px dashed #8a5cf6;background:#fbf9ff">' +
    '<p class="wmq" style="margin:0 0 8px;font-weight:700"></p>' +
    '<div class="wmrow" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">' +
    '<input type="text" inputmode="numeric" aria-label="Your digit" style="width:5em;font:inherit;font-size:1.2rem;padding:8px 10px;border-radius:10px;border:2px solid #141a33">' +
    '<button type="button" class="btn wmgo">Try it</button><button type="button" class="btn btn-quiet wmshow">Show me this step</button></div>' +
    '<p class="wmfb" aria-live="polite" style="margin:10px 0 0"></p></div>';
  var figEl = el.querySelector(".wmfig"), qEl = el.querySelector(".wmq"), fb = el.querySelector(".wmfb"), inp = el.querySelector("input"), row = el.querySelector(".wmrow");
  function nextDigit(j){ for(var m = j + 1; m < steps.length; m++){ if(!steps[m].dot) return steps[m].i; } return -1; }
  function draw(){
    var q = [], c = [];
    for(var m = 0; m < top.length; m++){ q.push(" "); c.push(" "); }
    steps.forEach(function(s, j){
      if(j >= data.k) return;
      q[s.i] = s.dot ? "." : String(s.q);
      if(!s.dot && s.rem > 0){ var nx = nextDigit(j); if(nx >= 0) c[nx] = String(s.rem); }
    });
    var now = steps[data.k];
    figEl.innerHTML = bus(String(d), top, q.join(""), c.join(""), { hi: now ? now.i : null, label: top + " divided by " + d + ", step by step" });
    if(!now){
      var ans = String(parseFloat(q.join("").replace(/ /g, "")));
      qEl.innerHTML = "All done: " + top + " &divide; " + d + " = " + ans + ".";
      row.style.display = "none";
      fb.innerHTML = "Check it backwards, if you like: " + ans + " &times; " + d + " = " + top + ". Multiplying undoes dividing.";
      if(!api.resolved()) api.done("done");
      return;
    }
    qEl.innerHTML = "How many " + d + "s go into <b>" + now.cur + "</b>?";
    row.style.display = "flex";
  }
  function landed(s, said){
    var more = nextDigit(data.k) >= 0;
    var msg = said + d + " &times; " + s.q + " = " + (d * s.q) + (s.rem ? ", remainder " + s.rem + "." : ", nothing left over.");
    if(s.q === 0) msg = (said === "Yes. " ? "Yes, none go in: " : "None go in: ") + d + " is bigger than " + s.cur + ". " + (data.k === 0 ? "Leave it blank, or write a 0." : "Write a 0 on top to hold the place.");
    if(s.rem && more) msg += " The " + s.rem + " hops across to the next digit.";
    data.k++; skipDots(); data.tries = 0; api.save();
    inp.value = ""; fb.innerHTML = ""; draw();
    fb.innerHTML = msg + (fb.innerHTML ? "<br>" + fb.innerHTML : "");
  }
  el.querySelector(".wmgo").addEventListener("click", function(){
    var s = steps[data.k]; if(!s) return;
    var g = parseInt(String(inp.value).trim(), 10);
    if(isNaN(g)){ fb.innerHTML = "Pop a number in the box first, whenever you are ready."; return; }
    if(g === s.q){ landed(s, "Yes. "); return; }
    data.tries = (data.tries || 0) + 1; api.save();
    if(g * d > s.cur) fb.innerHTML = "Close. " + g + " lots of " + d + " is " + (g * d) + ", which is more than " + s.cur + ". Try a smaller number.";
    else fb.innerHTML = "Nearly. " + g + " lots of " + d + " is " + (g * d) + ", and there is room for one more " + d + " in " + s.cur + ".";
  });
  inp.addEventListener("keydown", function(e){ if(e.key === "Enter") el.querySelector(".wmgo").click(); });
  el.querySelector(".wmshow").addEventListener("click", function(){ var s = steps[data.k]; if(s) landed(s, "Here it is: "); });
  draw();
}

(window.A2PACKS = window.A2PACKS || {})["written-methods"] = {
  a2: true,
  id: "a2-written-methods",
  title: "Written methods",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 25,
  line: "Big sums on paper: one column at a time, carry what is left, and check it backwards.",
  blurb: "Multiplying and dividing on paper, with whole numbers and decimals. Each method starts with one done for you, then one half done, then one on your own. Four short chunks, and a method card to make at the end.",
  note: "Written methods for multiplying and dividing, whole numbers and decimals. Four five minute chunks with a method card at the end. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Pencil", line: "Pencil: whole numbers, the grid method, and short division." },
    { id: "medium", name: "Fountain pen", line: "Fountain pen: bigger whole numbers, long multiplication and remainders as decimals." },
    { id: "spicy", name: "Quill", line: "Quill: decimals in every method, including dividing by a decimal." }
  ],
  themes: {
    time: { name: "Time travel", w: { thing: "time crystal", things: "time crystals", box: "crate", boxes: "crates", crew: "the time crew", place: "the time lab" } },
    football: { name: "Football", w: { thing: "shirt", things: "shirts", box: "kit bag", boxes: "kit bags", crew: "the squad", place: "the training ground" } },
    horror: { name: "Horror", w: { thing: "candle", things: "candles", box: "dusty crate", boxes: "dusty crates", crew: "the night shift", place: "the old hospital" } },
    fishing: { name: "Fishing", w: { thing: "hook", things: "hooks", box: "tackle box", boxes: "tackle boxes", crew: "the angling club", place: "the lake" } },
    music: { name: "Music", w: { thing: "programme", things: "programmes", box: "bundle", boxes: "bundles", crew: "the cast", place: "the theatre" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: C1.mild,
  steps: [

    /* ---------- chunk 1: short multiplication ---------- */
    { type: "learn", topic: "Short multiplication", title: "One column at a time",
      fig: C1.mild,
      html: "<p>Line the numbers up on the right. Start with the <b>ones</b>, then the tens, then the hundreds.</p>" +
        "<p><b>7 &times; 6 = 42.</b> Write the 2. Carry the 4 under the tens column.</p>" +
        "<p><b>4 &times; 6 = 24</b>, plus the 4 you carried makes 28. Write the 8, carry the 2.</p>" +
        "<p><b>3 &times; 6 = 18</b>, plus the 2 makes 20. Nothing left to multiply, so write 20.</p>" +
        "<p>So <b>347 &times; 6 = 2,082</b>. The small orange numbers are the carries.</p>",
      lv: {
        medium: { fig: C1.medium,
          html: "<p>Line the numbers up on the right. Start with the <b>ones</b> and work left.</p>" +
            "<p><b>8 &times; 7 = 56.</b> Write 6, carry 5.</p>" +
            "<p><b>5 &times; 7 = 35</b>, plus 5 is 40. Write 0, carry 4.</p>" +
            "<p><b>6 &times; 7 = 42</b>, plus 4 is 46. Write 6, carry 4.</p>" +
            "<p><b>2 &times; 7 = 14</b>, plus 4 is 18. Write 18.</p>" +
            "<p>So <b>2,658 &times; 7 = 18,606</b>. Notice the 0 in the tens: a column can come out as 0, and it still gets written.</p>" },
        spicy: { fig: C1.spicy,
          html: "<p>Decimals use exactly the same method. The trick: <b>take the point out, multiply, then put it back</b>.</p>" +
            "<p><b>3.47 &times; 6:</b> work out 347 &times; 6 in columns. 7 &times; 6 = 42, carry 4. 4 &times; 6 + 4 = 28, carry 2. 3 &times; 6 + 2 = 20. That gives 2,082.</p>" +
            "<p>3.47 has <b>two</b> digits after the point, so the answer needs two as well: <b>20.82</b>.</p>" +
            "<p>Sense check: 3.47 is about 3.5, and 3.5 &times; 6 = 21. So 20.82 sounds right, and 208.2 would not.</p>" } } },

    { type: "num", topic: "Short multiplication",
      q: "Jay has started this one and left you the rest. The ones are done: 8 &times; 4 = 32, so 2 is written and 3 is carried. Finish it off.",
      fig: C1FADE.mild,
      boxes: [{ label: "Tens: 5 &times; 4 + 3 =", a: 23 }, { label: "258 &times; 4 =", a: 1032 }],
      slips: [[0, 20, "That is 5 &times; 4. Add the 3 that was carried."], [1, 802, "Looks like the carries got left behind. Add each one into the next column."], [1, 832, "So close. In the hundreds, 2 &times; 4 = 8, plus the 2 carried from the tens makes 10."]],
      hint: "Tens: 5 &times; 4 = 20, add the carried 3. Write the 3 and carry the 2. Hundreds: 2 &times; 4, then add that 2.",
      why: "Tens: 20 + 3 = 23, write 3, carry 2. Hundreds: 8 + 2 = 10. So 258 &times; 4 = <b>1,032</b>.",
      lv: {
        medium: { q: "Jay has started this one. The ones are done: 6 &times; 6 = 36, so 6 is written and 3 is carried. Finish it off.",
          fig: C1FADE.medium,
          boxes: [{ label: "Tens: 8 &times; 6 + 3 =", a: 51 }, { label: "4,186 &times; 6 =", a: 25116 }],
          slips: [[0, 48, "That is 8 &times; 6. Add the 3 that was carried."], [1, 24686, "Looks like the carries got left behind. Add each one into the next column."]],
          hint: "Tens: 48 + 3 = 51, write 1 and carry 5. Hundreds: 1 &times; 6 + 5. Thousands: 4 &times; 6 plus whatever you carry.",
          why: "Tens: 51, write 1 carry 5. Hundreds: 6 + 5 = 11, write 1 carry 1. Thousands: 24 + 1 = 25. So 4,186 &times; 6 = <b>25,116</b>." },
        spicy: { q: "Jay has started 2.58 &times; 4 by doing 258 &times; 4 without the point. The ones are done. Finish the whole number sum, then put the point back.",
          boxes: [{ label: "258 &times; 4 =", a: 1032 }, { label: "So 2.58 &times; 4 =", a: 10.32 }],
          slips: [[1, 103.2, "Count the digits after the point in 2.58: there are two, so the answer needs two."], [1, 1032, "That is the whole number answer. Now put the point back."], [0, 802, "Looks like the carries got left behind."]],
          hint: "258 &times; 4: tens 5 &times; 4 + 3 = 23, hundreds 2 &times; 4 + 2 = 10. Then two digits after the point.",
          why: "258 &times; 4 = 1,032. 2.58 has two decimal places, so <b>10.32</b>. Sense check: about 2.5 &times; 4 = 10." } } },

    { type: "num", topic: "Short multiplication", explain: true,
      q: "Your turn, start to finish. Have a go at <b>463 &times; 7</b>.",
      fig: cols([{ t: "463" }, { t: "7", op: "&#215;" }, { t: "????", rule: true }], { label: "463 times 7 set out in columns" }),
      boxes: [{ label: "463 &times; 7 =", a: 3241 }],
      slips: [[2821, "Looks like the carries got left behind. 3 &times; 7 = 21, so carry the 2 into the tens."], [3221, "Nearly. Tens: 6 &times; 7 = 42, plus the carried 2 is 44. Write 4, carry 4."]],
      hint: "Ones: 3 &times; 7 = 21. Write 1, carry 2. Then 6 &times; 7 and add the 2.",
      why: "3 &times; 7 = 21: write 1, carry 2. 6 &times; 7 + 2 = 44: write 4, carry 4. 4 &times; 7 + 4 = 32. So <b>3,241</b>.",
      lv: {
        medium: { q: "Your turn, start to finish. Have a go at <b>3,907 &times; 8</b>.",
          fig: cols([{ t: "3907" }, { t: "8", op: "&#215;" }, { t: "?????", rule: true }], { label: "3907 times 8 set out in columns" }),
          boxes: [{ label: "3,907 &times; 8 =", a: 31256 }],
          slips: [[31206, "The tens: 0 &times; 8 is 0, but the 5 you carried still goes in. That column is 5."], [24256, "Thousands: 3 &times; 8 = 24, plus the 7 carried from the hundreds."]],
          hint: "Ones: 7 &times; 8 = 56. Watch the 0 in the tens: it still collects the carry.",
          why: "56: write 6, carry 5. 0 &times; 8 + 5 = 5. 9 &times; 8 = 72: write 2, carry 7. 3 &times; 8 + 7 = 31. So <b>31,256</b>." },
        spicy: { q: "Your turn, start to finish. Have a go at <b>6.09 &times; 7</b>.",
          fig: cols([{ t: "609" }, { t: "7", op: "&#215;" }, { t: "????", rule: true, note: "then put the point back" }], { label: "609 times 7 set out in columns" }),
          boxes: [{ label: "6.09 &times; 7 =", a: 42.63 }],
          slips: [[4263, "That is 609 &times; 7. Now put the point back: two digits after it."], [426.3, "Count the digits after the point in 6.09: there are two, so 42.63."], [42.03, "Tens: 0 &times; 7 is 0, plus the 6 you carried."]],
          hint: "Work out 609 &times; 7, then give the answer two decimal places. Sense check: about 6 &times; 7 = 42.",
          why: "609 &times; 7 = 4,263. Two decimal places in 6.09, so <b>42.63</b>. Close to 6 &times; 7 = 42, so it makes sense." } } },

    { type: "mc", topic: "Short multiplication",
      q: "Someone worked out 274 &times; 3 and got 812. Where did it go off track?",
      fig: C1SLIP.mild,
      options: ["The ones column", "The tens column", "The hundreds column", "It is all fine"],
      answer: 1, fixed: true,
      slips: { 0: "4 &times; 3 = 12: write 2, carry 1. The ones are fine.", 2: "2 &times; 3 = 6, plus the 2 carried makes 8. That part is fine.", 3: "Have a look at the tens: 7 &times; 3 = 21, and there was a 1 carried." },
      hint: "Redo each column yourself, carries and all, and compare.",
      why: "Tens: 7 &times; 3 = 21, plus the carried 1 makes 22. Write 2, carry 2. The answer is <b>822</b>.",
      lv: {
        medium: { q: "Someone worked out 1,568 &times; 9 and got 13,512. Where did it go off track?",
          fig: C1SLIP.medium,
          options: ["The ones column", "The tens column", "The hundreds column", "The thousands column"],
          answer: 2,
          slips: { 0: "8 &times; 9 = 72: write 2, carry 7. Fine.", 1: "6 &times; 9 = 54, plus 7 is 61: write 1, carry 6. Fine.", 3: "The thousands only came out odd because of the column before it. Look one step earlier." },
          hint: "Check which carry never got added in.",
          why: "Hundreds: 5 &times; 9 = 45, plus the carried 6 makes 51. Write 1, carry 5. Then 9 + 5 = 14. The answer is <b>14,112</b>." },
        spicy: { q: "Someone worked out 0.36 &times; 7 and got 25.2. What happened?",
          fig: C1SLIP.spicy,
          options: ["36 &times; 7 = 252 is off", "The decimal point drifted", "It is all fine", "The answer should be 252"],
          answer: 1, fixed: true,
          slips: { 0: "36 &times; 7 = 252 is right: 30 &times; 7 = 210, 6 &times; 7 = 42.", 2: "Sense check: 0.36 is about a third. A third of 7 is not 25.", 3: "252 is the whole number answer. The point still needs putting back." },
          hint: "How many digits after the point in 0.36?",
          why: "0.36 has two decimal places, so the answer needs two: <b>2.52</b>. And a third of 7 is a bit over 2, so that fits." } } },

    /* ---------- chunk 2: long multiplication ---------- */
    { type: "learn", topic: "Long multiplication", title: "Two digits? Split it up",
      fig: C2.mild,
      html: "<p>When both numbers have two digits, split them into tens and ones and multiply every part. That is the <b>grid method</b>.</p>" +
        "<p><b>46 &times; 23:</b> 46 is 40 and 6. 23 is 20 and 3.</p>" +
        "<p>40 &times; 20 = 800 (4 &times; 2 = 8, and two tens make it a hundred times bigger). 6 &times; 20 = 120. 40 &times; 3 = 120. 6 &times; 3 = 18.</p>" +
        "<p>Add the four boxes: 800 + 120 + 120 + 18 = <b>1,058</b>.</p>",
      lv: {
        medium: { fig: C2.medium,
          html: "<p><b>Long multiplication</b> is short multiplication done twice, then added.</p>" +
            "<p><b>156 &times; 34:</b> first 156 &times; 4 = 624.</p>" +
            "<p>Next 156 &times; 30. Write a <b>0</b> in the ones first (it holds the place, because you are multiplying by tens), then do 156 &times; 3 = 468 next to it: 4,680.</p>" +
            "<p>Add the two rows: 624 + 4,680 = <b>5,304</b>.</p>" },
        spicy: { fig: C2.spicy,
          html: "<p>Decimal times decimal: <b>take both points out, multiply, then put them back</b>.</p>" +
            "<p><b>4.6 &times; 2.3</b> becomes 46 &times; 23. Long multiplication: 46 &times; 3 = 138, and 46 &times; 20 = 920 (with the 0 holding the place). Add: 1,058.</p>" +
            "<p>Count the decimal places in <b>both</b> numbers: one in 4.6 and one in 2.3 makes two. So <b>10.58</b>.</p>" +
            "<p>Sense check: about 5 &times; 2 = 10. Yes.</p>" } } },

    { type: "num", topic: "Long multiplication",
      q: "Half done: <b>37 &times; 24</b>. The top row is filled in. Have a go at the two empty boxes and the total.",
      fig: C2FADE.mild,
      boxes: [{ label: "30 &times; 4 =", a: 120 }, { label: "7 &times; 4 =", a: 28 }, { label: "Total", a: 888 }],
      slips: [[0, 12, "3 &times; 4 = 12, but it is 30, so ten times bigger: 120."], [2, 740, "That is the top row only. Add the bottom two boxes as well."]],
      hint: "Add all four boxes: 600 + 140 + your two.",
      why: "30 &times; 4 = 120 and 7 &times; 4 = 28. 600 + 140 + 120 + 28 = <b>888</b>.",
      lv: {
        medium: { q: "Half done: <b>238 &times; 45</b>. The first row, 238 &times; 5, is there. Have a go at the second row and the total.",
          fig: C2FADE.medium,
          boxes: [{ label: "238 &times; 40 =", a: 9520 }, { label: "Total", a: 10710 }],
          slips: [[0, 952, "That is 238 &times; 4. You are multiplying by 40, so start with a 0 to hold the place."], [1, 2142, "Looks like the placeholder 0 went missing in the second row."]],
          hint: "Write a 0 first, then 238 &times; 4 next to it. Then add 1,190.",
          why: "238 &times; 40 = 9,520. 1,190 + 9,520 = <b>10,710</b>." },
        spicy: { q: "Half done: <b>3.8 &times; 2.7</b>, worked as 38 &times; 27. The first row is there. Have a go at the rest.",
          fig: C2FADE.spicy,
          boxes: [{ label: "38 &times; 20 =", a: 760 }, { label: "38 &times; 27 =", a: 1026 }, { label: "3.8 &times; 2.7 =", a: 10.26 }],
          slips: [[0, 76, "That is 38 &times; 2. It is 20, so start with a 0 to hold the place."], [2, 102.6, "Count the decimal places in both numbers: one plus one makes two."], [2, 1026, "That is the whole number answer. Now put the point back."]],
          hint: "266 + 760. Then two decimal places altogether.",
          why: "38 &times; 20 = 760. 266 + 760 = 1,026. Two decimal places in total, so <b>10.26</b>. About 4 &times; 3 = 12, so it is in the right area." } } },

    { type: "num", topic: "Long multiplication",
      q: "On your own now, any method you like: <b>52 &times; 16</b>.",
      boxes: [{ label: "52 &times; 16 =", a: 832 }],
      slips: [[312, "That is 52 &times; 6. There is a 52 &times; 10 to add as well."], [364, "Looks like 52 &times; 1 instead of 52 &times; 10. The 1 is really a ten."]],
      hint: "Grid: 50 and 2 across, 10 and 6 down. Four boxes, then add.",
      why: "500 + 20 + 300 + 12 = <b>832</b>.",
      lv: {
        medium: { q: "On your own now: <b>324 &times; 27</b>.",
          boxes: [{ label: "324 &times; 27 =", a: 8748 }],
          slips: [[2916, "Looks like the placeholder 0 went missing in the second row: 324 &times; 20 = 6,480."], [2268, "That is 324 &times; 7. Add 324 &times; 20 as well."]],
          hint: "324 &times; 7, then 324 &times; 20 with a 0 holding the place, then add.",
          why: "324 &times; 7 = 2,268. 324 &times; 20 = 6,480. Add: <b>8,748</b>." },
        spicy: { q: "On your own now: <b>5.4 &times; 0.32</b>.",
          boxes: [{ label: "5.4 &times; 0.32 =", a: 1.728 }],
          slips: [[17.28, "Count the decimal places in both: one in 5.4 and two in 0.32 makes three."], [1728, "That is 54 &times; 32. Now put the points back: three decimal places."], [0.1728, "Three decimal places altogether, not four: 1.728."]],
          hint: "54 &times; 32 first. Then count every digit after a point in the question.",
          why: "54 &times; 32 = 1,728. Three decimal places, so <b>1.728</b>. Sense check: about 5 &times; 0.3 = 1.5." } } },

    { type: "mc", topic: "Long multiplication",
      q: "In the grid, why is 40 &times; 20 equal to 800?",
      fig: C2.mild,
      options: ["4 &times; 2 = 8, and two tens make it a hundred times bigger", "40 + 20 is 60, then add the rest", "4 &times; 2 = 8, then add one zero", "Because 800 looks about right"],
      answer: 0,
      slips: { 1: "Each box is a times, not an add.", 2: "One zero would give 80. There are two tens (40 and 20), so two zeros.", 3: "Feeling it is right is a good start. The reason is 4 &times; 2 with two tens." },
      hint: "40 is 4 tens. 20 is 2 tens.",
      why: "4 &times; 2 = 8. Ten times ten makes it a hundred times bigger: <b>800</b>.",
      lv: {
        medium: { q: "In long multiplication, why does the second row start with a 0?",
          fig: C2.medium,
          options: ["You are really multiplying by tens, so it holds the place", "To make the answer look neater", "Because the number on top ends in a 0", "So the rows have the same number of digits"],
          slips: { 1: "It changes the value, not just the look: it makes every digit ten times bigger.", 2: "The top number is 156. The 0 comes from the 3 being 30.", 3: "The rows often have different lengths. The 0 is there because the 3 is really 30." },
          hint: "In 156 &times; 34, what is the 3 really worth?",
          why: "The 3 is really 30. Writing the 0 first makes 156 &times; 3 land in the tens: 4,680." },
        spicy: { q: "Which estimate tells you 3.8 &times; 2.7 = 10.26 is about right?",
          fig: '<svg viewBox="0 0 440 130" role="img" aria-label="3.8 rounds to 4 and 2.7 rounds to 3">' +
            '<rect width="440" height="130" rx="16" fill="#f7fbff"/>' +
            tx(30, 46, "3.8 &#215; 2.7 = 10.26", 22, INK, ' font-weight="700"') +
            tx(30, 92, "3.8 is about ?", 18, ANS, ' font-weight="700"') + tx(220, 92, "2.7 is about ?", 18, ANS, ' font-weight="700"') +
            A.egg(A.bird(410, 104, 0.5, "#ffd23f"), "Outrageous. A bird doing estimates. Jay is very proud.") + '</svg>',
          options: ["4 &times; 3 = 12", "3 &times; 2 = 6", "40 &times; 30 = 1,200", "0.4 &times; 0.3 = 0.12"],
          slips: { 1: "Rounding both down pulls it a long way off. Round to the nearest whole number: 4 and 3.", 2: "That is 100 times too big: 3.8 rounds to 4, not 40.", 3: "That is 100 times too small: 3.8 rounds to 4, not 0.4." },
          hint: "Round each number to the nearest whole number.",
          why: "3.8 is about 4 and 2.7 is about 3. 4 &times; 3 = 12, close to 10.26. 102.6 or 1.026 would fail this check." } } },

    /* ---------- chunk 3: short division ---------- */
    { type: "learn", topic: "Short division", title: "The bus stop",
      fig: C3.mild,
      html: "<p>Short division goes left to right, the other way to multiplying. The number you divide by waits outside the bus stop.</p>" +
        "<p><b>852 &divide; 4.</b> How many 4s in 8? <b>2</b>. Write it on top.</p>" +
        "<p>How many 4s in 5? <b>1</b>, with 1 left over. The 1 hops across in front of the 2, making 12.</p>" +
        "<p>How many 4s in 12? <b>3</b>. So 852 &divide; 4 = <b>213</b>.</p>",
      lv: {
        medium: { fig: C3.medium,
          html: "<p>Short division goes left to right. The number you divide by waits outside the bus stop.</p>" +
            "<p><b>3,474 &divide; 6.</b> How many 6s in 3? None, so the 3 hops across: 34.</p>" +
            "<p>34 &divide; 6 = <b>5</b> remainder 4. The 4 hops: 47. 47 &divide; 6 = <b>7</b> remainder 5. The 5 hops: 54. 54 &divide; 6 = <b>9</b>.</p>" +
            "<p>So 3,474 &divide; 6 = <b>579</b>. If there is something left at the very end, write .0 after the number and keep going: the remainder hops into the tenths.</p>" },
        spicy: { fig: C3.spicy,
          html: "<p>Short division with a decimal: <b>the point on top sits right above the point underneath</b>. Then divide as normal.</p>" +
            "<p><b>14.58 &divide; 6:</b> 14 &divide; 6 = 2 r 2, so 25. 25 &divide; 6 = 4 r 1, so 18. 18 &divide; 6 = 3. Answer <b>2.43</b>.</p>" +
            "<p>Dividing <b>by</b> a decimal? Make it whole first. Multiply both numbers by 10 (or 100) and the answer does not change: <b>7.2 &divide; 0.4</b> is the same as 72 &divide; 4 = <b>18</b>.</p>" +
            "<p>Bonnie is waiting at this bus stop. She has no tail to wag, so she just looks hopeful.</p>" } } },

    { type: "widget", topic: "Short division", unscored: true,
      title: "Step through it",
      html: "<p>One step at a time. The yellow highlight shows the digit you are on. Type how many go in, or tap <b>Show me this step</b> whenever you like.</p>",
      mount: mountBus },

    { type: "num", topic: "Short division", explain: true,
      q: "Over to you: <b>735 &divide; 5</b>.",
      fig: bus("5", "735", "???", "", { label: "735 divided by 5 as a bus stop" }),
      boxes: [{ label: "735 &divide; 5 =", a: 147 }],
      slips: [[101, "Looks like the remainders did not hop across. 7 &divide; 5 = 1 remainder 2, so the next number is 23."], [146, "Nearly. Last step: 35 &divide; 5 = 7."]],
      hint: "7 &divide; 5 = 1 remainder 2. The 2 hops in front of the 3.",
      why: "7 &divide; 5 = 1 r 2. 23 &divide; 5 = 4 r 3. 35 &divide; 5 = 7. So <b>147</b>. Check: 147 &times; 5 = 735.",
      lv: {
        medium: { q: "Over to you: <b>2,916 &divide; 9</b>.",
          fig: bus("9", "2916", "????", "", { label: "2916 divided by 9 as a bus stop" }),
          boxes: [{ label: "2,916 &divide; 9 =", a: 324 }],
          slips: [[3024, "The first digit: 2 &divide; 9 is 0, so the 2 hops across to make 29. You do not need a 0 at the front."], [314, "Nearly. 29 &divide; 9 = 3 r 2, so the next number is 21, and 21 &divide; 9 = 2 r 3."]],
          hint: "2 &divide; 9 is 0, so start with 29 &divide; 9.",
          why: "29 &divide; 9 = 3 r 2. 21 &divide; 9 = 2 r 3. 36 &divide; 9 = 4. So <b>324</b>. Check: 324 &times; 9 = 2,916." },
        spicy: { q: "Over to you: <b>9.36 &divide; 0.4</b>.",
          fig: '<svg viewBox="0 0 440 110" role="img" aria-label="9.36 divided by 0.4 becomes 93.6 divided by 4">' +
            '<rect width="440" height="110" rx="16" fill="#f7fbff"/>' +
            tx(30, 46, "9.36 &#247; 0.4", 22, INK, ' font-weight="700"') +
            tx(30, 86, "&#215; 10 both:  93.6 &#247; 4", 20, ANS, ' font-weight="700"') + '</svg>',
          boxes: [{ label: "9.36 &divide; 0.4 =", a: 23.4 }],
          slips: [[2.34, "That is 9.36 &divide; 4. Multiply both by 10 first: 93.6 &divide; 4."], [234, "Keep the point lined up: 93.6 &divide; 4 = 23.4."]],
          hint: "Multiply both by 10 to make the divisor whole. Then bus stop 93.6 &divide; 4.",
          why: "93.6 &divide; 4: 9 &divide; 4 = 2 r 1, 13 &divide; 4 = 3 r 1, 16 &divide; 4 = 4. So <b>23.4</b>. Check: how many 0.4s in 9.36? Lots, so a big answer fits." } } },

    { type: "num", topic: "Short division",
      q: "Some sums leave a bit over. <b>97 &divide; 4</b>: how many whole 4s, and what is left?",
      fig: bus("4", "97", "??", "", { label: "97 divided by 4 as a bus stop", note: "remainder ?" }),
      boxes: [{ label: "Answer", a: 24 }, { label: "Remainder", a: 1 }],
      slips: [[0, 25, "25 &times; 4 = 100, which is more than 97. One fewer."], [1, 3, "Check: 24 &times; 4 = 96, so 97 leaves 1."]],
      hint: "9 &divide; 4 = 2 r 1, so 17. How many 4s in 17?",
      why: "9 &divide; 4 = 2 r 1. 17 &divide; 4 = 4 r 1. So <b>24 remainder 1</b>. Check: 24 &times; 4 + 1 = 97.",
      lv: {
        medium: { q: "Some sums leave a bit over. Keep going past the point: <b>87 &divide; 4</b> as a decimal.",
          fig: bus("4", "87.00", "?????", "", { label: "87.00 divided by 4 as a bus stop" }),
          boxes: [{ label: "87 &divide; 4 =", a: 21.75 }],
          slips: [[21.3, "21 remainder 3 is not 21.3. Carry the 3 into the tenths: 30 &divide; 4."], [21.7, "Nearly. 30 &divide; 4 = 7 r 2, so keep going: 20 &divide; 4 = 5."]],
          hint: "87 &divide; 4 = 21 r 3. Write .00 after 87 and let the 3 hop into the tenths.",
          why: "21 r 3. Then 30 &divide; 4 = 7 r 2, and 20 &divide; 4 = 5. So <b>21.75</b>." },
        spicy: { q: "Keep going past the point: <b>23 &divide; 8</b> as a decimal.",
          fig: bus("8", "23.000", "??????", "", { label: "23.000 divided by 8 as a bus stop" }),
          boxes: [{ label: "23 &divide; 8 =", a: 2.875 }],
          slips: [[2.7, "2 remainder 7 is not 2.7. Carry the 7 into the tenths: 70 &divide; 8."], [2.87, "Nearly. There is still 4 left: 40 &divide; 8 = 5."]],
          hint: "23 &divide; 8 = 2 r 7. Add .000 and keep dividing.",
          why: "2 r 7. 70 &divide; 8 = 8 r 6. 60 &divide; 8 = 7 r 4. 40 &divide; 8 = 5. So <b>2.875</b>." } } },

    { type: "mc", topic: "Short division",
      q: "Someone worked out 624 &divide; 6 and got 14. What happened?",
      fig: C3SLIP.mild,
      options: ["6 &divide; 6 = 1 is off", "A 0 is missing over the 2", "24 &divide; 6 = 4 is off", "It is all fine"],
      answer: 1, fixed: true,
      slips: { 0: "6 &divide; 6 = 1 is right.", 2: "24 &divide; 6 = 4 is right.", 3: "Check it backwards: 14 &times; 6 = 84, not 624." },
      hint: "How many 6s in 2?",
      why: "2 &divide; 6 = 0 remainder 2. That 0 has to be written, or the 4 slides into the tens. 624 &divide; 6 = <b>104</b>.",
      lv: {
        medium: { q: "Someone worked out 4,836 &divide; 4 and got 129. What happened?",
          fig: C3SLIP.medium,
          options: ["4 &divide; 4 = 1 is off", "8 &divide; 4 = 2 is off", "A 0 is missing over the 3", "It is all fine"],
          answer: 2,
          slips: { 0: "4 &divide; 4 = 1 is right.", 1: "8 &divide; 4 = 2 is right.", 3: "Check it backwards: 129 &times; 4 = 516, nowhere near 4,836." },
          hint: "How many 4s in 3?",
          why: "3 &divide; 4 = 0 remainder 3. The 0 must be written. 4,836 &divide; 4 = <b>1,209</b>." },
        spicy: { q: "Someone worked out 0.84 &divide; 0.2 and got 0.42. What happened?",
          fig: C3SLIP.spicy,
          options: ["0.84 &divide; 2 = 0.42 is off", "They divided by 2, not 0.2: both needed multiplying by 10 first", "It is all fine", "The answer should be 42"],
          answer: 1, fixed: true,
          slips: { 0: "0.84 &divide; 2 = 0.42 is right. It is just not the question.", 2: "Sense check: how many 0.2s in 0.84? More than one, so 0.42 cannot be it.", 3: "Multiply both by 10, not by 100: 8.4 &divide; 2." },
          hint: "Make the divisor whole first.",
          why: "Multiply both by 10: 8.4 &divide; 2 = <b>4.2</b>. Check: 4.2 &times; 0.2 = 0.84." } } },

    /* ---------- chunk 4: use it, check it ---------- */
    { type: "learn", topic: "Use it, check it", title: "Pick the method, then check it backwards",
      fig: loop("48", "9", "432"),
      html: "<p>Real problems do not say \"multiply\". Ask: am I making <b>lots of the same</b> (multiply), or <b>sharing or grouping</b> (divide)?</p>" +
        "<p>Then check it backwards. Multiplying and dividing undo each other: if 48 &times; 9 = 432, then 432 &divide; 9 must give 48.</p>" +
        "<p>In the wise words of Jay's late, great grandfather: stop. And check.</p>",
      lv: { spicy: { fig: loop("2.75", "36", "99"),
        html: "<p>Real problems do not say \"multiply\". Ask: am I making <b>lots of the same</b> (multiply), or <b>sharing or grouping</b> (divide)?</p>" +
          "<p>Then check twice. <b>Backwards:</b> if 2.75 &times; 36 = 99, then 99 &divide; 36 must give 2.75. <b>Estimate:</b> 3 &times; 36 = 108, so 99 is in the right area.</p>" +
          "<p>In the wise words of Jay's late, great grandfather: stop. And check.</p>" } } },

    { type: "num", topic: "Use it, check it",
      q: "[[Crew]] has 18 [[boxes]]. Each one holds 24 [[things]]. How many [[things]] is that altogether?",
      boxes: [{ label: "[[Things]]", a: 432 }],
      slips: [[216, "The 1 in 18 is really a ten, so that row is 24 &times; 10 = 240."], [42, "That adds 18 and 24. Lots of the same means multiply."]],
      hint: "18 lots of 24. Grid: 10 and 8 down, 20 and 4 across.",
      why: "24 &times; 18: 200 + 40 + 160 + 32 = <b>432</b> [[things]].",
      lv: {
        medium: { q: "[[Crew]] has 35 [[boxes]]. Each one holds 156 [[things]]. How many [[things]] is that altogether?",
          boxes: [{ label: "[[Things]]", a: 5460 }],
          slips: [[1248, "Looks like the placeholder 0 went missing: 156 &times; 30 = 4,680."], [780, "That is 156 &times; 5. Add 156 &times; 30 as well."]],
          hint: "156 &times; 5, then 156 &times; 30, then add.",
          why: "156 &times; 5 = 780. 156 &times; 30 = 4,680. Add: <b>5,460</b> [[things]]." },
        spicy: { q: "Each [[thing]] costs &pound;2.75. [[Crew]] buys 36 of them. What is the total cost?",
          boxes: [{ label: "Total", a: 99, pre: "&pound;" }],
          slips: [[990, "275 &times; 36 = 9,900, and 2.75 has two decimal places: 99.00."], [9.9, "275 &times; 36 = 9,900, and 2.75 has two decimal places: 99.00."], [9900, "That is in pence. Put the point back: &pound;99.00."]],
          hint: "275 &times; 36 without the point, then two decimal places.",
          why: "275 &times; 36 = 9,900, so 2.75 &times; 36 = <b>&pound;99.00</b>. Estimate: 3 &times; 36 = 108. Close." } } },

    { type: "num", topic: "Use it, check it",
      q: "432 [[things]] are shared equally between 9 [[boxes]]. How many go in each?",
      boxes: [{ label: "In each", a: 48 }],
      slips: [[47, "Close. 47 &times; 9 = 423, so 9 would be left over. One more each."], [49, "Close. 49 &times; 9 = 441, a few too many."], [3888, "Sharing means divide. 432 &divide; 9."]],
      hint: "Bus stop: 43 &divide; 9 = 4 remainder 7. Then 72 &divide; 9.",
      why: "43 &divide; 9 = 4 r 7. 72 &divide; 9 = 8. So <b>48</b> in each. Check: 48 &times; 9 = 432.",
      lv: {
        medium: { q: "1,350 [[things]] are shared equally between 6 [[boxes]]. How many go in each?",
          boxes: [{ label: "In each", a: 225 }],
          slips: [[208, "The 1 left from 13 &divide; 6 needs to hop across to make 15."], [8100, "Sharing means divide. 1,350 &divide; 6."]],
          hint: "1 &divide; 6 is 0, so start with 13 &divide; 6.",
          why: "13 &divide; 6 = 2 r 1. 15 &divide; 6 = 2 r 3. 30 &divide; 6 = 5. So <b>225</b>. Check: 225 &times; 6 = 1,350." },
        spicy: { q: "[[Crew]] splits a &pound;68.40 bill equally between 12 people. How much each?",
          boxes: [{ label: "Each", a: 5.7, pre: "&pound;" }],
          slips: [[57, "Keep the point lined up above the point: &pound;5.70."], [5.07, "84 &divide; 12 = 7 goes straight after the point: 5.70."]],
          hint: "68 &divide; 12 = 5 r 8. The 8 hops past the point: 84 &divide; 12.",
          why: "68 &divide; 12 = 5 r 8. 84 &divide; 12 = 7. So <b>&pound;5.70</b> each. Check: 5.70 &times; 12 = 68.40." } } },

    { type: "mc", topic: "Use it, check it",
      q: "You found 432 &divide; 9 = 48. Which calculation checks it?",
      fig: loop("48", "9", "432"),
      options: ["48 &times; 9", "48 + 9", "432 &times; 9", "48 &divide; 9"],
      answer: 0,
      slips: { 1: "Adding does not undo dividing. Multiplying does.", 2: "That would make it much bigger. Multiply the answer, not the start number.", 3: "That divides again. To undo a divide, multiply." },
      hint: "What undoes dividing?",
      why: "Multiplying undoes dividing: 48 &times; 9 = 432. Back where you started, so it checks out.",
      lv: {
        medium: { q: "You found 1,350 &divide; 6 = 225. Which calculation checks it?",
          fig: loop("225", "6", "1350"),
          options: ["225 &times; 6", "225 + 6", "1,350 &times; 6", "225 &divide; 6"],
          why: "Multiplying undoes dividing: 225 &times; 6 = 1,350." },
        spicy: { q: "You found 2.75 &times; 36 = 99. Which calculation checks it backwards?",
          fig: loop("2.75", "36", "99"),
          options: ["99 &divide; 36 should give 2.75", "99 &times; 36 should give 2.75", "99 + 36 should give 2.75", "36 &divide; 99 should give 2.75"],
          slips: { 1: "To undo a multiply, divide.", 2: "Adding does not undo multiplying.", 3: "Right idea, but the other way round: 99 shared into 36." },
          hint: "What undoes multiplying?",
          why: "Dividing undoes multiplying: 99 &divide; 36 = 2.75." } } },

    { type: "write", topic: "Use it, check it", stretch: true,
      q: "Teach it back, if you fancy it: make up a problem for Jay that needs a written method. Solve it yourself too, and say how you checked it.",
      starters: ["[[Crew]] has", "Each [[box]] holds", "I worked it out by", "I checked it by"],
      checklist: ["A problem with real numbers in it", "Your method, step by step", "The answer, and how you checked it"],
      minWords: 15 }
  ],

  realWorld: {
    title: "No calculator? No problem",
    html: "<p>Some exam papers do not allow a calculator, and lots of jobs need a quick sum on paper: builders working out materials, cooks scaling a recipe, anyone splitting a bill.</p>" +
      "<p>For our big question: if you went back a couple of hundred years, there would be no calculators at all. Shopkeepers, ship navigators and bank clerks did every sum like this, with a quill. Would you trust their maths? Would they trust yours?</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A time traveller with a quill and a sum on paper">' +
      A.portal(70, 76, 54) +
      '<rect x="160" y="40" width="130" height="92" rx="6" fill="#fffbe9" stroke="#141a33" stroke-width="2.5"/>' +
      tx(174, 72, "347", 18, INK, ' font-weight="700"') + tx(174, 96, "&#215;  6", 18, INK, ' font-weight="700"') +
      '<path d="M172 104h70" stroke="#141a33" stroke-width="2"/>' + tx(174, 124, "2082", 18, ANS, ' font-weight="700"') +
      '<path d="M268 128L330 22" stroke="#8a5a36" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M330 22q-2 40 -40 78q-10 -44 40 -78z" fill="#ffffff" stroke="#141a33" stroke-width="2"/><path d="M326 30L294 92" stroke="#141a33" stroke-opacity=".3" stroke-width="1.5"/>' +
      A.jay(370, 50, 0.7, "wow") + '</svg>'
  },

  make: {
    title: "Make a method card",
    intro: "One sum, done your way, with your top tip. Keep it in your book, stick it on the wall, or send it to Jay.",
    fields: [
      { id: "sum", label: "My sum", ph: "347 x 6", max: 24 },
      { id: "ans", label: "The answer", ph: "2,082", max: 16 },
      { id: "tip", label: "My top tip", ph: "Start with the ones and carry into the next column.", max: 80 },
      { id: "name", label: "Made by", ph: "Column captain", max: 24 }
    ],
    svg: function(v){
      function e(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ while(x.length > n){ if(cur.trim()){ out.push(cur.trim()); cur = ""; } out.push(x.slice(0, n)); x = x.slice(n); } if((cur + " " + x).trim().length > n){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, 3); }
      var sum = String(v.sum || "").slice(0, 24), ans = String(v.ans || "").slice(0, 16), tip = wrap(v.tip, 34);
      function fit(t, room, big){ return Math.max(16, Math.min(big, Math.floor(room / (Math.max(1, t.length) * 0.72)))); }
      var fs = fit(sum, 370, 40), fa = fit("= " + ans, 370, 40);
      var g = "", x, y;
      for(x = 30; x < 600; x += 30) g += '<path d="M' + x + ' 20V380" stroke="#dbe7f5" stroke-width="1.5"/>';
      for(y = 30; y < 390; y += 30) g += '<path d="M20 ' + y + 'H580" stroke="#dbe7f5" stroke-width="1.5"/>';
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#f7fbff"/>' + g +
        '<rect x="14" y="14" width="572" height="372" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        '<rect x="30" y="30" width="250" height="40" rx="10" fill="#1f6fb2"/>' +
        '<text x="44" y="58" font-family="Verdana,Arial,sans-serif" font-size="20" font-weight="700" fill="#ffffff" letter-spacing="2">METHOD CARD</text>' +
        '<text x="44" y="138" font-family="Verdana,Arial,sans-serif" font-size="' + fs + '" font-weight="700" fill="#141a33">' + e(sum) + '</text>' +
        '<text x="44" y="190" font-family="Verdana,Arial,sans-serif" font-size="' + fa + '" font-weight="700" fill="#1f6fb2">= ' + e(ans) + '</text>' +
        '<text x="44" y="240" font-family="Verdana,Arial,sans-serif" font-size="16" font-weight="700" fill="#d9480f">TOP TIP</text>' +
        tip.map(function(l, k){ return '<text x="44" y="' + (270 + k * 28) + '" font-family="Verdana,Arial,sans-serif" font-size="20" fill="#141a33">' + e(l) + '</text>'; }).join("") +
        '<text x="44" y="366" font-family="Verdana,Arial,sans-serif" font-size="16" fill="#5b6180">Made by ' + e(v.name) + '</text>' +
        '<g transform="translate(518 82) rotate(-10)"><circle r="50" fill="#fff3c4" stroke="#141a33" stroke-width="3"/>' +
        '<text y="-6" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="13" font-weight="700" fill="#141a33">CHECKED</text>' +
        '<text y="14" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="13" font-weight="700" fill="#141a33">BACKWARDS</text></g>' +
        A.bird(500, 330, 0.9, "#3a8fd6") +
        '</svg>';
    }
  }
};
})();
