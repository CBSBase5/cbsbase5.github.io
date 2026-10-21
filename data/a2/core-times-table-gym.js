/* Base 5 core activity: Times table gym.
   Maths. Quick recall of times facts to 12 x 12, patterns and tricks,
   building a fact from one you know, and the matching divide facts.
   Calm: no timers. Replayable: most questions have two extra versions.
   ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
var X = " &times; ", D = " &divide; ";
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function r6(x){ return Math.round(x * 1e6) / 1e6; }

/* a level set {mild, medium, spicy} becomes base fields plus lv */
function lvl(v){
  if(!v.mild) return v;
  var o = {};
  Object.keys(v.mild).forEach(function(k){ o[k] = v.mild[k]; });
  o.lv = { medium: v.medium || v.mild, spicy: v.spicy || v.mild };
  return o;
}
/* a step from versions: the first is the original, the rest become vary */
function S(type, topic, vs, extra){
  var s = lvl(vs[0]);
  s.type = type; s.topic = topic;
  Object.keys(extra || {}).forEach(function(k){ s[k] = extra[k]; });
  if(vs.length > 1) s.vary = vs.slice(1).map(lvl);
  return s;
}

/* likely slips for one fact in box k */
function factSlips(k, a, b){
  var p = r6(a * b), out = [], f = a + X + b;
  function add(v, msg){ v = r6(v); if(v !== p && v > 0 && !out.some(function(o){ return o[1] === v; })) out.push([k, v, msg]); }
  if(a === Math.round(a) && b === Math.round(b) && a <= 12 && b <= 12){
    add(a + b, "For " + f + ": that is " + a + " + " + b + ". Times means " + a + " groups of " + b + ".");
    add(p - b, "For " + f + ": that is one group of " + b + " short.");
    add(p + b, "For " + f + ": that is one group of " + b + " too many.");
  } else {
    add(p * 10, "For " + f + ": check the place value. That is ten times too big.");
    add(p / 10, "For " + f + ": check the place value. That is ten times too small.");
  }
  return out;
}
/* a few quick facts in boxes */
function reps(q, pairs, hint){
  var slips = [];
  pairs.forEach(function(p, k){ slips = slips.concat(factSlips(k, p[0], p[1])); });
  return { q: q, fig: "",
    boxes: pairs.map(function(p){ return { label: p[0] + X + p[1] + " =", a: r6(p[0] * p[1]) }; }),
    slips: slips, hint: hint,
    why: pairs.map(function(p){ return p[0] + X + p[1] + " = <b>" + r6(p[0] * p[1]) + "</b>"; }).join(", ") + "." };
}
/* mc builder: right answer first, wrongs as [text, slip]; the engine shuffles */
function MC(q, right, wrongs, hint, why, fig){
  var sl = {};
  wrongs.forEach(function(w, k){ sl[k + 1] = w[1]; });
  return { q: q, fig: fig || "", options: [right].concat(wrongs.map(function(w){ return w[0]; })), answer: 0, slips: sl, hint: hint, why: why };
}
/* num builder, one or more boxes */
function N(q, boxes, slips, hint, why, fig){ return { q: q, fig: fig || "", boxes: boxes, slips: slips, hint: hint, why: why }; }

/* a groups of b: the usual slips */
function grp(a, b, unit){
  var p = r6(a * b);
  return [[r6(a + b), "That is " + a + " + " + b + ". Multiply instead."], [r6(p - b), "That is " + (a - 1) + X + b + ", one " + unit + " short."], [r6(p + b), "That is " + (a + 1) + X + b + ", one " + unit + " too many."]]
    .filter(function(r){ return r[0] !== p && r[0] > 0; });
}
/* spot the fact with a slip: list of [a, b, claimed], exactly one claimed is off */
function oddQ(list, hint){
  function f(x){ return x[0] + X + x[1] + " = " + x[2]; }
  var bad = list.filter(function(x){ return r6(x[0] * x[1]) !== x[2]; })[0];
  return MC("One of these came out of the gym with a slip. Which one?", f(bad),
    list.filter(function(x){ return x !== bad; }).map(function(x){ return [f(x), "That one checks out: " + f(x) + ". Look again at the others."]; }),
    hint, bad[0] + X + bad[1] + " is <b>" + r6(bad[0] * bad[1]) + "</b>, not " + bad[2] + ".");
}
function WAY(t, right, wrongs, hint, why){ return MC("Stuck on " + t + "? Which is a good way to build it?", right, wrongs, hint, why); }
function rowsQ(r, c, hint){
  var p = r * c;
  return N("[[Who]] lines up [[items]] in rows at [[place]]: " + r + " rows of " + c + ". How many [[items]] altogether?", [{ label: "[[Items]]", a: p }],
    grp(r, c, "row"), hint, r + X + c + " = <b>" + p + "</b>.", arr(r, c));
}
function trayQ(r, c, t, hint){
  var p = r * c;
  return N("[[Who]] lines up [[items]] on trays: " + r + " rows of " + c + " on each tray. How many on one tray, and on " + t + " trays?", [{ label: "One tray", a: p }, { label: t + " trays", a: p * t }],
    grp(r, c, "row").map(function(x){ return [0, x[0], x[1]]; }).concat([[1, p + t, "That adds " + t + ". Multiply one tray by " + t + "."]]), hint,
    r + X + c + " = <b>" + p + "</b>, and " + p + X + t + " = <b>" + p * t + "</b>.", arr(r, c));
}
function feedQ(n, k, hint){
  return N("Jay fills " + n + " bird feeders with " + k + " fat balls each. How many fat balls is that?", [{ label: "Fat balls", a: n * k }],
    grp(n, k, "feeder"), hint, n + X + k + " = <b>" + n * k + "</b>. The birds are very pleased.", feeders(n, k));
}
function tubQ(t){
  var p = 12 * t;
  return N("Fat balls come in tubs of 12. Jay buys " + t + " tubs for the winter. How many fat balls is that?", [{ label: "Fat balls", a: p }],
    [[12 + t, "That is 12 + " + t + ". Multiply instead."], [10 * t, "That is " + t + X + "10. Each tub has 12, so add " + t + X + "2 too."], [p - 12, "That is one tub short."]],
    t + X + "12 is " + t + X + "10 plus " + t + X + "2.", t + X + "10 = " + 10 * t + ", " + t + X + "2 = " + 2 * t + ", so <b>" + p + "</b>. That is a lot of very happy birds.", feeders(0, 0, "12"));
}
function dblQ(m, n){
  var times = { 4: 2, 8: 3, 16: 4 }[m], v = n, list = [];
  for(var i = 0; i < times; i++){ v = r6(v * 2); list.push(v); }
  var p = list[times - 1];
  return N("No steps this time. What is " + m + X + n + "?", [{ label: m + X + n + " =", a: p }],
    [[list[times - 2], "That is " + (m / 2) + X + n + ". One more double."], [r6(m + n), "That is " + m + " + " + n + ". Double " + n + " instead."], [r6(p - n), "That is " + (m - 1) + X + n + ". One more " + n + "."]],
    "Double " + n + " " + ["", "", "twice", "three times", "four times"][times] + ".", list.join(", ").replace(/, ([^,]*)$/, ", <b>$1</b>") + ".");
}
function nineQ(nn, n){
  var p = nn * n, ten = (nn + 1) * n, w = [[String(ten), "That is " + (nn + 1) + X + n + ". Take away one " + n + "."]];
  if(nn === 9){
    var sw = String(p).split("").reverse().join("");
    w.push(p < 100 && +sw !== p ? [sw, "The digits are swapped. The tens digit is one less than " + n + "."] : [String(ten - 1), "That takes away 1. Take away one " + n + "."]);
    w.push([String(8 * n), "That is 8" + X + n + ". One more " + n + "."]);
  } else {
    w.push([String(ten + n), "That adds " + n + ". 99 lots is one lot fewer than 100, so take it away."]);
    w.push([String(90 * n), "That is 90" + X + n + ". It is 99, nearly 100."]);
  }
  return MC("Use the nines trick. What is " + nn + X + n + "?", String(p), w, (nn + 1) + X + n + ", then take away " + n + ".", ten + " take away " + n + " is <b>" + p + "</b>.");
}
function halfQ(m, n){
  var big = r6(m * 2), bp = r6(big * n), p = r6(m * n);
  return N("One more trick: <b>" + m + " lots is half of " + big + (big === 1 ? " lot" : " lots") + "</b>. " + big + X + n + " is " + bp + ". What is " + m + X + n + "?", [{ label: m + X + n + " =", a: p }],
    [[bp, "That is " + big + X + n + ". Halve it."], [r6(m + n), "That is " + m + " + " + n + "."], [r6(bp + m), "That adds " + m + ". Halve " + bp + " instead."]],
    "Half of " + bp + ".", "Half of " + bp + " is <b>" + p + "</b>.");
}
function knowQ(k, t, b, flip){
  var kp = k * b, tp = t * b, up = t > k, f = function(g){ return flip ? b + X + g : g + X + b; };
  return N("Fewer steps now. You know " + f(k) + " = " + kp + ". What is " + f(t) + "?", [{ label: f(t) + " =", a: tp }],
    [[up ? kp + 1 : kp - 1, "That " + (up ? "adds" : "takes away") + " 1. " + (up ? "Add" : "Take away") + " one " + b + "."], [up ? kp + t : kp - t, "That " + (up ? "adds " : "takes away ") + t + ". " + (up ? "Add" : "Take away") + " one " + b + "."], [(2 * k - t) * b, "That goes the wrong way. " + f(t) + " is " + (up ? "one more" : "one fewer") + " " + b + "."]]
      .filter(function(r){ return r[0] !== tp && r[0] > 0; }),
    f(t) + " is " + f(k) + (up ? " and one more " : ", take away one ") + b + ".", kp + (up ? " + " : " take away ") + b + " = <b>" + tp + "</b>.");
}
function ownQ(a, b, hint){
  return N("On your own now. [[Who]] packs " + a + " [[boxes]] with " + b + " [[items]] in each. How many [[items]]?", [{ label: "[[Items]]", a: a * b }],
    grp(a, b, "group"), hint, a + X + b + " = <b>" + a * b + "</b>.");
}

/* ---------- pictures ---------- */
/* r rows of c dots; rows from split onwards in a second colour */
function arr(r, c, label, split){
  var gap = c > 9 ? 22 : 28, rad = c > 9 ? 8 : 10;
  var w = Math.max(340, c * gap + 80), hgt = r * gap + (label ? 64 : 34);
  var out = '<svg viewBox="0 0 ' + w + ' ' + hgt + '" style="max-height:320px" role="img" aria-label="' + r + ' rows of ' + c + ' dots">' +
    '<rect width="' + w + '" height="' + hgt + '" rx="14" fill="#f4f1ea"/>';
  var x0 = (w - c * gap) / 2;
  for(var i = 0; i < r; i++){
    var col = split != null && i >= split ? "#ff8a3d" : "#22b8e6";
    for(var j = 0; j < c; j++) out += '<circle cx="' + (x0 + gap / 2 + j * gap) + '" cy="' + (17 + gap / 2 + i * gap) + '" r="' + rad + '" fill="' + col + '"/>';
  }
  if(label) out += T(w / 2, hgt - 20, label, 16, { a: "middle", b: 1 });
  return out + '</svg>';
}

/* a dumbbell with a fact on each plate */
function bell(x, y, s, l, r){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<rect x="-80" y="-5" width="160" height="10" rx="5" fill="#7b8299"/>' +
    '<rect x="-74" y="-34" width="26" height="68" rx="7" fill="#141a33"/><rect x="48" y="-34" width="26" height="68" rx="7" fill="#141a33"/>' +
    '<rect x="-96" y="-24" width="20" height="48" rx="6" fill="#ff5d8f"/><rect x="76" y="-24" width="20" height="48" rx="6" fill="#ff5d8f"/>' +
    (l ? T(-61, 58, l, 15, { a: "middle", b: 1 }) : "") + (r ? T(61, 58, r, 15, { a: "middle", b: 1 }) : "") + '</g>';
}
var START = '<svg viewBox="0 0 520 210" role="img" aria-label="Jay next to a dumbbell, with a bird perched on the bar">' +
  '<rect width="520" height="210" rx="16" fill="#f4f1ea"/>' +
  '<rect x="0" y="170" width="520" height="40" fill="#d9cfbd"/>' +
  A.jay(90, 92, 0.9, "smile") + A.bubble(140, 14, 172, 46, "No clock. Just reps.", 150) +
  bell(370, 128, 1, "7" + X + "8", "56") +
  A.egg(A.bird(370, 106, 0.6, "#ffd23f"), "A bird doing pull ups on the bar. Twelve reps. Jay counted every one.") +
  '</svg>';

/* doubling ladder: 2s, 4s, 8s */
function ladder(n){
  var rows = [[2, "#ffd23f"], [4, "#22b8e6"], [8, "#19c39a"]];
  var out = '<svg viewBox="0 0 520 200" role="img" aria-label="Doubling: 2 times ' + n + ', then double for 4 times, then double for 8 times">' +
    '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>';
  rows.forEach(function(r, k){
    var x = 40 + k * 160;
    out += '<rect x="' + x + '" y="50" width="130" height="80" rx="14" fill="' + r[1] + '" fill-opacity=".4" stroke="#141a33" stroke-width="2.5"/>' +
      T(x + 65, 84, r[0] + X + n, 18, { a: "middle", b: 1 }) + T(x + 65, 112, "= " + r[0] * n, 18, { a: "middle", b: 1 });
    if(k < 2) out += '<path d="M' + (x + 134) + ' 90h22" stroke="#141a33" stroke-width="3"/><path d="M' + (x + 150) + ' 82l8 8 -8 8" fill="none" stroke="#141a33" stroke-width="3"/>' +
      T(x + 145, 40, "double", 13, { a: "middle", c: "#8a5cf6", b: 1 });
  });
  out += T(260, 170, "4s are double the 2s. 8s are double the 4s.", 15, { a: "middle" });
  return out + '</svg>';
}

/* the nines: tens go up, ones go down */
var NINES = (function(){
  var out = '<svg viewBox="0 0 520 220" role="img" aria-label="The 9 times table: the tens digit goes up by one and the ones digit goes down by one">' +
    '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>';
  for(var i = 1; i <= 10; i++){
    var x = 30 + (i - 1) * 47, p = 9 * i, t = Math.floor(p / 10), o = p % 10;
    out += '<rect x="' + x + '" y="40" width="42" height="96" rx="10" fill="#fff" stroke="#141a33" stroke-opacity=".35" stroke-width="2"/>' +
      T(x + 21, 66, "9" + X + i, 11, { a: "middle" }) +
      T(x + 13, 106, t ? String(t) : "0", 22, { a: "middle", b: 1, c: "#1f7fbf" }) + T(x + 29, 106, String(o), 22, { a: "middle", b: 1, c: "#e0682b" });
  }
  out += T(30, 168, "Tens go up: 0, 1, 2, 3 ...", 15, { c: "#1f7fbf", b: 1 }) + T(30, 192, "Ones go down: 9, 8, 7, 6 ...", 15, { c: "#e0682b", b: 1 }) +
    T(490, 180, "and the digits add to 9", 13, { a: "end" });
  return out + '</svg>';
})();

/* fact family triangle */
function tri(top, l, r, hide){
  return '<svg viewBox="0 0 520 220" role="img" aria-label="A fact triangle with ' + top + ' at the top and ' + l + ' and ' + r + ' at the bottom">' +
    '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
    '<path d="M150 190L250 24L350 190z" fill="#fffbe0" stroke="#141a33" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M190 128h120" stroke="#141a33" stroke-width="2"/><path d="M250 128v62" stroke="#141a33" stroke-width="2"/>' +
    T(250, 104, String(top), 24, { a: "middle", b: 1 }) + T(212, 170, String(l), 22, { a: "middle", b: 1, c: "#1f7fbf" }) + T(288, 170, String(r), 22, { a: "middle", b: 1, c: "#e0682b" }) +
    T(370, 60, l + X + r + " = " + top, 15, { b: 1 }) + T(370, 92, top + D + l + " = " + (hide ? "?" : r), 15, { b: 1, c: "#1f9d63" }) + T(370, 124, top + D + r + " = " + (hide ? "?" : l), 15, { b: 1, c: "#1f9d63" }) +
    T(30, 60, "Cover", 13) + T(30, 78, "the one", 13) + T(30, 96, "you need", 13) +
    '</svg>';
}

/* bird feeders: n feeders with k fat balls each */
function feeders(n, k, tubLabel){
  var out = '<svg viewBox="0 0 520 190" role="img" aria-label="' + (tubLabel ? "A tub of fat balls" : n + " bird feeders with " + k + " fat balls in each") + '">' +
    '<rect width="520" height="190" rx="16" fill="#e8f7ff"/><path d="M0 168h520" stroke="#19c39a" stroke-width="10"/>';
  if(tubLabel){
    out += '<rect x="190" y="50" width="140" height="110" rx="14" fill="#ffd23f" stroke="#141a33" stroke-width="3"/>' +
      T(260, 96, tubLabel, 16, { a: "middle", b: 1 }) + T(260, 124, "fat balls", 14, { a: "middle" }) +
      A.bird(380, 140, 0.8, "#ff5d5d");
  } else {
    var gap = Math.min(80, 440 / n), x0 = 260 - gap * (n - 1) / 2;
    for(var i = 0; i < n; i++){
      var x = x0 + i * gap;
      out += '<path d="M' + x + ' 14v14" stroke="#141a33" stroke-width="2"/><rect x="' + (x - 14) + '" y="28" width="28" height="' + (k * 15 + 10) + '" rx="8" fill="#fff" fill-opacity=".7" stroke="#141a33" stroke-width="2.5"/>';
      for(var j = 0; j < k; j++) out += '<circle cx="' + x + '" cy="' + (40 + j * 15) + '" r="6" fill="#c99a63"/>';
    }
    out += A.egg(A.bird(x0 + 24, 158, 0.6, "#3a8fd6"), "This bird is waiting very patiently. Jay says patience is a superpower.");
  }
  return out + '</svg>';
}

/* the old shilling: 12 pennies */
var SHILLING = '<svg viewBox="0 0 520 170" role="img" aria-label="An old shilling coin worth 12 old pennies">' +
  '<rect width="520" height="170" rx="16" fill="#f4f1ea"/>' +
  '<circle cx="90" cy="84" r="52" fill="#d7dbe3" stroke="#141a33" stroke-width="3"/>' + T(90, 92, "1s", 26, { a: "middle", b: 1 }) +
  T(176, 94, "=", 30, { a: "middle", b: 1 }) +
  (function(){ var s = ""; for(var i = 0; i < 12; i++) s += '<circle cx="' + (226 + (i % 6) * 44) + '" cy="' + (58 + Math.floor(i / 6) * 50) + '" r="18" fill="#c87533" stroke="#141a33" stroke-width="2"/>' + T(226 + (i % 6) * 44, 63 + Math.floor(i / 6) * 50, "1d", 12, { a: "middle", b: 1, c: "#fff" }); return s; })() +
  T(260, 152, "Before 1971: 12 pennies in a shilling", 14, { a: "middle" }) +
  '</svg>';

(window.A2PACKS = window.A2PACKS || {})["core-times-table-gym"] = {
  a2: true,
  id: "a2-core-times-table-gym",
  title: "Times table gym",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 20,
  line: "Times facts are like reps at the gym: come back often and they get stronger. No clock, no rush.",
  blurb: "A calm workout for times facts: quick reps, patterns and tricks, building a fact from one you know, and turning facts round to divide. Four short chunks, new numbers each time you come back, and a gym card to make at the end.",
  note: "A calm times table workout with no clock. Four five minute chunks, and the numbers change each time you come back. Have a go whenever suits you.",
  sure: true,
  levels: [
    { id: "mild", name: "Light weights", line: "Light weights: smaller facts, one or two steps at a time, with tricks to help." },
    { id: "medium", name: "Full circuit", line: "Full circuit: everything up to 12 x 12, including the 7s, 8s and 12s." },
    { id: "spicy", name: "Heavy lifting", line: "Heavy lifting: use facts to 12 x 12 with tens, hundreds and decimals." }
  ],
  themes: {
    time: { name: "Time travel", w: { who: "the time traveller", items: "time crystals", box: "crate", boxes: "crates", place: "the time machine" } },
    football: { name: "Football", w: { who: "the kit manager", items: "footballs", box: "kit bag", boxes: "kit bags", place: "the training ground" } },
    horror: { name: "Horror", w: { who: "the night porter", items: "candles", box: "trunk", boxes: "trunks", place: "the old mansion" } },
    fishing: { name: "Fishing", w: { who: "the angler", items: "floats", box: "tackle box", boxes: "tackle boxes", place: "the lake" } },
    music: { name: "Music", w: { who: "the roadie", items: "drumsticks", box: "flight case", boxes: "flight cases", place: "the gig" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: START,
  steps: [

    /* ---------- chunk 1: warm up ---------- */
    S("learn", "Warm up", [{
      mild: { title: "Welcome to the gym",
        html: "<p>Times facts are like reps at the gym. Every time you come back, they get a bit stronger. There is no clock here, so take each one at whatever pace suits you.</p>" +
          "<p>A times fact means <b>groups of</b>. 4" + X + "3 means <b>4 rows of 3</b>. Count them in the picture: 3, 6, 9, 12.</p>",
        fig: arr(4, 3, "4" + X + "3 = 12") },
      medium: { title: "Welcome to the gym",
        html: "<p>Times facts are like reps at the gym. Every time you come back, they get a bit stronger. There is no clock here, so take each one at whatever pace suits you.</p>" +
          "<p>A times fact means <b>groups of</b>. 6" + X + "7 means <b>6 rows of 7</b>. You can swap it round too: 7 rows of 6 is the same 42.</p>",
        fig: arr(6, 7, "6" + X + "7 = 42") },
      spicy: { title: "One fact, lots of lifts",
        html: "<p>No clock here, so take each one at whatever pace suits you.</p>" +
          "<p>One fact you know unlocks lots more. 6" + X + "7 = 42, so:</p>" +
          "<p class=\"a2task\">60" + X + "7 = 420 (ten times bigger)<br>60" + X + "70 = 4200 (ten times, then ten times again)<br>0.6" + X + "7 = 4.2 (ten times smaller)</p>",
        fig: arr(6, 7, "6" + X + "7 = 42, then scale it") }
    }]),

    S("num", "Warm up", [
      { mild: reps("Three quick reps. Take them in any order you like.", [[2, 6], [5, 4], [10, 3]], "Count in 2s, 5s and 10s if that helps."),
        medium: reps("Three quick reps. Take them in any order you like.", [[6, 7], [8, 4], [9, 12]], "Swap the order if one way round feels easier."),
        spicy: reps("Three quick reps. The first one helps with the other two.", [[7, 8], [70, 8], [0.7, 8]], "7" + X + "8 first, then ten times bigger and ten times smaller.") },
      { mild: reps("Three quick reps. Take them in any order you like.", [[3, 4], [5, 7], [2, 9]], "Count in 3s, 5s and 2s if that helps."),
        medium: reps("Three quick reps. Take them in any order you like.", [[7, 7], [6, 8], [12, 5]], "Swap the order if one way round feels easier."),
        spicy: reps("Three quick reps. The first one helps with the other two.", [[6, 9], [60, 90], [0.6, 9]], "6" + X + "9 first. 60" + X + "90 is ten times, then ten times again.") },
      { mild: reps("Three quick reps. Take them in any order you like.", [[4, 5], [10, 8], [3, 6]], "Count in 5s, 10s and 3s if that helps."),
        medium: reps("Three quick reps. Take them in any order you like.", [[8, 9], [7, 4], [11, 12]], "11" + X + "12 is 10" + X + "12 plus one more 12."),
        spicy: reps("Three quick reps. The first one helps with the other two.", [[12, 7], [120, 7], [1.2, 7]], "12" + X + "7 first, then ten times bigger and ten times smaller.") }
    ]),

    S("num", "Warm up", [
      { mild: rowsQ(3, 5, "Count in 5s, once for each row."), medium: rowsQ(6, 7, "5" + X + "7 is 35. One more row of 7."), spicy: trayQ(9, 12, 5, "9" + X + "12 is 10" + X + "12 take away 12. Then times 5: half of times 10.") },
      { mild: rowsQ(4, 6, "Double 6, then double again."), medium: rowsQ(8, 6, "Double 6, double again, double again."), spicy: trayQ(12, 8, 25, "10" + X + "8 plus 2" + X + "8. Then 25 trays is 100 trays divided by 4.") },
      { mild: rowsQ(2, 9, "Double 9."), medium: rowsQ(7, 9, "7" + X + "10 is 70. Each row is one less than 10."), spicy: trayQ(11, 12, 50, "10" + X + "12 plus 12. Then times 100 and halve.") }
    ]),

    S("mc", "Warm up", [
      { mild: oddQ([[2, 8, 18], [5, 4, 20], [3, 3, 9], [10, 6, 60]], "Count each one in steps."),
        medium: oddQ([[7, 8, 54], [6, 6, 36], [9, 4, 36], [12, 3, 36]], "Three of them make 36. Check the odd one."),
        spicy: oddQ([[12, 90, 1800], [70, 8, 560], [0.6, 7, 4.2], [9, 0.4, 3.6]], "Find the basic fact in each, then check the place value.") },
      { mild: oddQ([[5, 9, 40], [3, 5, 15], [4, 4, 16], [2, 12, 24]], "Count each one in steps."),
        medium: oddQ([[6, 9, 56], [8, 8, 64], [7, 12, 84], [11, 11, 121]], "Use a trick on each: 9s, doubling, 10s."),
        spicy: oddQ([[0.9, 7, 0.63], [80, 60, 4800], [1.1, 12, 13.2], [120, 5, 600]], "Find the basic fact in each, then check the place value.") },
      { mild: oddQ([[4, 6, 28], [10, 7, 70], [3, 8, 24], [5, 6, 30]], "Count each one in steps."),
        medium: oddQ([[8, 12, 92], [12, 12, 144], [7, 6, 42], [9, 9, 81]], "Use a trick on each: 10s, doubling, 9s."),
        spicy: oddQ([[60, 70, 420], [7, 0.12, 0.84], [11, 1.2, 13.2], [8, 300, 2400]], "Count the zeros and decimal places in the question and the answer.") }
    ]),

    S("num", "Warm up", [
      { mild: feedQ(4, 5, "Count in 5s, once for each feeder."), medium: feedQ(7, 6, "5" + X + "6 is 30. Then 2 more feeders."), spicy: tubQ(15) },
      { mild: feedQ(3, 6, "Count in 6s: 6, 12 ..."), medium: feedQ(9, 7, "10" + X + "7 is 70. One feeder fewer."), spicy: tubQ(25) },
      { mild: feedQ(6, 2, "Count in 2s: 2, 4, 6 ..."), medium: feedQ(8, 4, "Double 8, then double again."), spicy: tubQ(35) }
    ]),

    /* ---------- chunk 2: patterns and tricks ---------- */
    S("learn", "Patterns and tricks", [{
      mild: { title: "Worked example: the doubling trick",
        html: "<p>The 4s are <b>double the 2s</b>. So to times by 4, double and then double again.</p>" +
          "<p class=\"a2task\"><b>Worked example: 4" + X + "6</b><br>Step 1: double 6 is 12.<br>Step 2: double 12 is 24.<br>So 4" + X + "6 = <b>24</b>.</p>",
        fig: ladder(6) },
      medium: { title: "Worked example: the doubling trick",
        html: "<p>The 4s are double the 2s, and the 8s are <b>double the 4s</b>. So to times by 8, double three times.</p>" +
          "<p class=\"a2task\"><b>Worked example: 8" + X + "7</b><br>Step 1: double 7 is 14.<br>Step 2: double 14 is 28.<br>Step 3: double 28 is 56.<br>So 8" + X + "7 = <b>56</b>.</p>",
        fig: ladder(7) },
      spicy: { title: "Worked example: the doubling trick",
        html: "<p>Doubling works on any number. Times by 4: double twice. By 8: three times. By 16: four times.</p>" +
          "<p class=\"a2task\"><b>Worked example: 8" + X + "35</b><br>Step 1: double 35 is 70.<br>Step 2: double 70 is 140.<br>Step 3: double 140 is 280.<br>So 8" + X + "35 = <b>280</b>.</p>",
        fig: ladder(7) }
    }]),

    S("num", "Patterns and tricks", (function(){
      function dbl(m, n){
        var vals = [], v = n, times = { 4: 2, 8: 3, 16: 4 }[m];
        for(var i = 0; i < times; i++){ v = r6(v * 2); vals.push(v); }
        var slips = [];
        if(r6(n + 2) !== vals[0]) slips.push([0, r6(n + 2), "That is " + n + " + 2. Doubling means " + n + " + " + n + "."]);
        for(var k = 1; k < times; k++) slips.push([k, vals[k - 1], "That is the same as the box before. Double it once more."]);
        return N("Your turn, with the steps laid out. Work out " + m + X + n + " by doubling.",
          vals.map(function(x, k){ return { label: k ? "Double again =" : "Double " + n + " =", a: x }; }),
          slips, "Doubling means adding a number to itself.",
          "Double " + n + " is " + vals.join(", then ") + ". So " + m + X + n + " = <b>" + vals[times - 1] + "</b>.");
      }
      return [
        { mild: dbl(4, 7), medium: dbl(8, 6), spicy: dbl(8, 45) },
        { mild: dbl(4, 9), medium: dbl(8, 9), spicy: dbl(8, 2.5) },
        { mild: dbl(4, 12), medium: dbl(8, 12), spicy: dbl(16, 15) }
      ];
    })()),

    S("num", "Patterns and tricks", [
      { mild: dblQ(4, 8), medium: dblQ(8, 9), spicy: dblQ(8, 1.25) },
      { mild: dblQ(4, 11), medium: dblQ(8, 8), spicy: dblQ(16, 25) },
      { mild: dblQ(4, 6), medium: dblQ(8, 11), spicy: dblQ(8, 0.75) }
    ]),

    S("learn", "Patterns and tricks", [{
      mild: { title: "The nines pattern",
        html: "<p>Look along the 9s. The <b>tens go up</b> by one each time and the <b>ones go down</b> by one. The digits always add up to 9.</p>" +
          "<p>Another trick: <b>9 lots is 10 lots, take one away</b>. 9" + X + "4: 10" + X + "4 is 40, take away 4 is 36.</p>",
        fig: NINES },
      spicy: { title: "The nines trick, scaled up",
        html: "<p>9 lots is <b>10 lots, take one away</b>. 9" + X + "7: 70 take away 7 is 63.</p>" +
          "<p>It works for 99 too: 99 lots is <b>100 lots, take one away</b>. 99" + X + "6: 600 take away 6 is 594.</p>",
        fig: NINES }
    }]),

    S("mc", "Patterns and tricks", [
      { mild: nineQ(9, 4), medium: nineQ(9, 7), spicy: nineQ(99, 7) },
      { mild: nineQ(9, 3), medium: nineQ(9, 8), spicy: nineQ(99, 12) },
      { mild: nineQ(9, 5), medium: nineQ(9, 12), spicy: nineQ(99, 4) }
    ]),

    S("num", "Patterns and tricks", [
      { mild: halfQ(5, 8), medium: halfQ(5, 18), spicy: halfQ(5, 4.6) },
      { mild: halfQ(5, 6), medium: halfQ(5, 16), spicy: halfQ(50, 48) },
      { mild: halfQ(5, 12), medium: halfQ(5, 24), spicy: halfQ(0.5, 38) }
    ], { explain: true }),

    /* ---------- chunk 3: build from a fact you know ---------- */
    S("learn", "Build from a fact you know", [{
      mild: { title: "Worked example: build it from a fact you know",
        html: "<p>Stuck on a fact? Start from one you <b>do</b> know, then add or take away a group.</p>" +
          "<p class=\"a2task\"><b>Worked example: 3" + X + "6</b><br>Step 1: I know 2" + X + "6 = 12.<br>Step 2: 3" + X + "6 is one more 6: 12 + 6 = 18.<br>So 3" + X + "6 = <b>18</b>.</p>",
        fig: arr(3, 6, "2 rows of 6, and 1 more row", 2) },
      medium: { title: "Worked example: build it from a fact you know",
        html: "<p>Stuck on a fact? Start from one you <b>do</b> know, then add or take away some groups.</p>" +
          "<p class=\"a2task\"><b>Worked example: 6" + X + "8</b><br>Step 1: I know 5" + X + "8 = 40.<br>Step 2: 6" + X + "8 is one more 8: 40 + 8 = 48.<br>So 6" + X + "8 = <b>48</b>.</p>",
        fig: arr(6, 8, "5 rows of 8, and 1 more row", 5) },
      spicy: { title: "Worked example: split it into facts you know",
        html: "<p>Bigger facts split into two you know. Split the bigger number into tens and ones.</p>" +
          "<p class=\"a2task\"><b>Worked example: 13" + X + "7</b><br>Step 1: 10" + X + "7 = 70.<br>Step 2: 3" + X + "7 = 21.<br>Step 3: 70 + 21 = 91.<br>So 13" + X + "7 = <b>91</b>.</p>",
        fig: arr(13, 7, "10 rows of 7, and 3 more rows", 10) }
    }]),

    S("num", "Build from a fact you know", (function(){
      function two(a, b){ /* (a-1) x b, then one more b */
        var p1 = (a - 1) * b, p = a * b;
        return N("Your turn, with the steps laid out. Work out " + a + X + b + ".",
          [{ label: "Step 1: " + (a - 1) + X + b + " =", a: p1 }, { label: "Step 2: one more " + b + " =", a: p }],
          [[1, p1 + 1, "That adds 1. Add one more " + b + "."], [1, p1 + a, "That adds " + a + ". Add one more " + b + "."]].filter(function(r){ return r[1] !== p; }),
          "Step 2 is step 1 plus " + b + ".", (a - 1) + X + b + " = " + p1 + ", and " + p1 + " + " + b + " = <b>" + p + "</b>.", arr(a, b, "", a - 1));
      }
      function three(a, b, split){ /* split a into split and a-split */
        var r = a - split, p1 = split * b, p2 = r * b;
        return N("Your turn, with the steps laid out. Work out " + a + X + b + ".",
          [{ label: "Step 1: " + split + X + b + " =", a: p1 }, { label: "Step 2: " + r + X + b + " =", a: p2 }, { label: "Step 3: add them =", a: p1 + p2 }],
          [[2, p1 + r, "That adds " + r + ". Add the whole of step 2."], [2, p1 + p2 + b, "That is one group of " + b + " too many."]].filter(function(x){ return x[1] !== p1 + p2; }),
          "Step 3 is step 1 plus step 2.", split + X + b + " = " + p1 + ", " + r + X + b + " = " + p2 + ", so " + a + X + b + " = <b>" + (p1 + p2) + "</b>.", arr(a, b, "", split));
      }
      return [
        { mild: two(3, 7), medium: three(7, 8, 5), spicy: three(14, 6, 10) },
        { mild: two(3, 8), medium: three(7, 6, 5), spicy: three(13, 8, 10) },
        { mild: two(3, 9), medium: three(7, 12, 5), spicy: three(15, 12, 10) }
      ];
    })()),

    S("num", "Build from a fact you know", [
      { mild: knowQ(10, 11, 4), medium: knowQ(10, 9, 12), spicy: knowQ(12, 13, 12) },
      { mild: knowQ(5, 6, 3), medium: knowQ(6, 7, 6), spicy: knowQ(25, 26, 4) },
      { mild: knowQ(10, 9, 6), medium: knowQ(10, 11, 8), spicy: knowQ(6, 7, 15, true) }
    ]),

    S("num", "Build from a fact you know", [
      { mild: ownQ(3, 9, "Any trick you like: 2" + X + "9 and one more 9, or 3" + X + "10 take away 3."), medium: ownQ(7, 9, "Any trick you like: 7" + X + "10 take away 7 works well."), spicy: ownQ(13, 9, "Split 13 into 10 and 3, or do 13" + X + "10 take away 13.") },
      { mild: ownQ(6, 3, "5" + X + "3 and one more 3."), medium: ownQ(6, 12, "6" + X + "10 and 6" + X + "2."), spicy: ownQ(12, 16, "10" + X + "16 and 2" + X + "16.") },
      { mild: ownQ(4, 7, "Double 7, then double again."), medium: ownQ(8, 7, "Double 7 three times, or 5" + X + "7 and 3" + X + "7."), spicy: ownQ(21, 8, "20" + X + "8 and one more 8.") }
    ]),

    S("mc", "Build from a fact you know", [
      { mild: WAY("3" + X + "8", "2" + X + "8 = 16, then add one more 8", [["2" + X + "8 = 16, then add 3", "Add a whole group of 8, not the 3."], ["3 + 8 = 11", "That adds instead of times."], ["Write 38", "That puts the digits side by side. 3" + X + "8 means 3 groups of 8."]], "3 groups of 8 is 2 groups and one more group.", "16 + 8 = <b>24</b>."),
        medium: WAY("7" + X + "9", "7" + X + "10 = 70, then take away 7", [["7" + X + "10 = 70, then take away 9", "Take away one group of 7. There are 7 groups."], ["7" + X + "10 = 70, then take away 1", "Each of the 7 groups is 1 smaller, so take away 7."], ["7 + 9 = 16", "That adds instead of times."]], "7 groups of 10, but each group is one less.", "70 take away 7 is <b>63</b>."),
        spicy: WAY("19" + X + "8", "20" + X + "8 = 160, then take away 8", [["20" + X + "8 = 160, then take away 1", "There is one group of 8 too many, so take away 8."], ["19" + X + "10 = 190, then take away 8", "That would need to take away 2" + X + "19, not 8."], ["9" + X + "8 + 10 = 82", "That loses most of the groups. 19 lots is 10 lots and 9 lots."]], "20 lots is one lot too many.", "160 take away 8 is <b>152</b>.") },
      { mild: WAY("6" + X + "4", "5" + X + "4 = 20, then add one more 4", [["5" + X + "4 = 20, then add 6", "Add a whole group of 4, not the 6."], ["6 + 4 = 10", "That adds instead of times."], ["Write 64", "That puts the digits side by side. 6" + X + "4 means 6 groups of 4."]], "6 groups of 4 is 5 groups and one more group.", "20 + 4 = <b>24</b>."),
        medium: WAY("8" + X + "6", "8" + X + "5 = 40, then add 8", [["8" + X + "5 = 40, then add 6", "8" + X + "6 is 8 lots of 6, which is 8 lots of 5 plus 8 lots of 1. Add 8."], ["8" + X + "5 = 40, then add 1", "Each of the 8 groups grows by 1, so add 8."], ["8 + 6 = 14", "That adds instead of times."]], "8 groups of 6 is 8 groups of 5, with 1 more in each group.", "40 + 8 = <b>48</b>."),
        spicy: WAY("29" + X + "6", "30" + X + "6 = 180, then take away 6", [["30" + X + "6 = 180, then take away 1", "There is one group of 6 too many, so take away 6."], ["30" + X + "6 = 180, then take away 29", "Take away one group of 6, not 29."], ["20" + X + "6 + 9 = 129", "That only adds 9, not 9 lots of 6."]], "30 lots is one lot too many.", "180 take away 6 is <b>174</b>.") },
      { mild: WAY("9" + X + "5", "10" + X + "5 = 50, then take away 5", [["10" + X + "5 = 50, then take away 9", "Take away one group of 5."], ["10" + X + "5 = 50, then add 5", "9 lots is fewer than 10 lots, so take away."], ["9 + 5 = 14", "That adds instead of times."]], "9 lots is 10 lots, take one away.", "50 take away 5 is <b>45</b>."),
        medium: WAY("12" + X + "7", "10" + X + "7 = 70, plus 2" + X + "7 = 14", [["10" + X + "7 = 70, plus 2", "Add 2 groups of 7, not just 2."], ["12" + X + "10 = 120, then take away 7", "That would need to take away 3" + X + "12."], ["12 + 7 = 19", "That adds instead of times."]], "12 is 10 and 2.", "70 + 14 = <b>84</b>."),
        spicy: WAY("21" + X + "12", "20" + X + "12 = 240, then add 12", [["20" + X + "12 = 240, then add 1", "Add one more group of 12, not 1."], ["21" + X + "10 = 210, then add 2", "Add 21" + X + "2, which is 42."], ["2" + X + "12 + 1" + X + "12 = 36", "That is 3" + X + "12. The 2 means 20."]], "21 lots is 20 lots and one more.", "240 + 12 = <b>252</b>.") }
    ]),

    /* ---------- chunk 4: turn it round ---------- */
    S("learn", "Turn it round", [{
      mild: { title: "Worked example: two divides for free",
        html: "<p>Every times fact gives you <b>two divide facts</b> for free.</p>" +
          "<p class=\"a2task\"><b>Worked example</b><br>I know 4" + X + "5 = 20.<br>So 20" + D + "5 = 4, and 20" + D + "4 = 5.</p>" +
          "<p>Stuck on a divide? Turn it into a times question. 20" + D + "5 means <b>how many 5s make 20?</b></p>",
        fig: tri(20, 4, 5) },
      medium: { title: "Worked example: two divides for free",
        html: "<p>Every times fact gives you <b>two divide facts</b> for free.</p>" +
          "<p class=\"a2task\"><b>Worked example</b><br>I know 6" + X + "7 = 42.<br>So 42" + D + "7 = 6, and 42" + D + "6 = 7.</p>" +
          "<p>Stuck on a divide? Turn it into a times question. 42" + D + "7 means <b>how many 7s make 42?</b></p>",
        fig: tri(42, 6, 7) },
      spicy: { title: "Worked example: divides from a fact",
        html: "<p>Every times fact gives you divides for free, scaled up or down too.</p>" +
          "<p class=\"a2task\"><b>Worked example</b><br>I know 7" + X + "8 = 56.<br>So 560" + D + "8 = 70 (ten times bigger)<br>and 5.6" + D + "7 = 0.8 (ten times smaller).</p>",
        fig: tri(56, 7, 8) }
    }]),

    S("num", "Turn it round", (function(){
      function fam(a, b){
        var p = a * b;
        return N("Your turn. You know " + a + X + b + " = " + p + ". Use it for both divides.",
          [{ label: p + D + b + " =", a: a }, { label: p + D + a + " =", a: b }],
          [[0, p - b, "That takes away instead of dividing."], [1, p - a, "That takes away instead of dividing."], [0, p * b, "That times instead of dividing."]].filter(function(r){ return r[1] !== (r[0] ? b : a) && r[1] > 0; }),
          "How many " + b + "s make " + p + "? How many " + a + "s make " + p + "?",
          p + D + b + " = <b>" + a + "</b> and " + p + D + a + " = <b>" + b + "</b>.", tri(p, a, b, true));
      }
      function famS(a, b, big, small){ /* big: p*10 / b ; small: p/10 / a */
        var p = a * b;
        return N("Your turn. You know " + a + X + b + " = " + p + ". Use it for both divides.",
          [{ label: big + D + b + " =", a: r6(big / b) }, { label: small + D + a + " =", a: r6(small / a) }],
          [[0, a, "That is " + p + D + b + ". " + big + " is bigger, so the answer is bigger too."], [1, b, "That is " + p + D + a + ". " + small + " is ten times smaller, so the answer is too."], [1, r6(b / 100), "Check the place value: that is a hundred times too small."]],
          "Find the basic fact, then think about how the numbers have been scaled.",
          big + D + b + " = <b>" + r6(big / b) + "</b> and " + small + D + a + " = <b>" + r6(small / a) + "</b>.", tri(p, a, b));
      }
      return [
        { mild: fam(5, 6), medium: fam(7, 8), spicy: famS(7, 8, 560, 5.6) },
        { mild: fam(3, 7), medium: fam(9, 6), spicy: famS(6, 9, 540, 5.4) },
        { mild: fam(4, 9), medium: fam(12, 7), spicy: famS(12, 4, 4800, 4.8) }
      ];
    })()),

    S("num", "Turn it round", (function(){
      function share(n, k){
        var a = n / k;
        return N("On your own now. [[Who]] shares " + n + " [[items]] equally between " + k + " [[boxes]]. How many in each?",
          [{ label: "In each [[box]]", a: a }],
          [[n - k, "That takes " + k + " away. Share them out instead."], [n + k, "That adds. Share them out instead."], [n * k, "That times. Share them out instead."], [a + 1, "One too many. Check: " + k + X + (a + 1) + " is " + k * (a + 1) + "."], [a - 1, "One too few. Check: " + k + X + (a - 1) + " is " + k * (a - 1) + "."]],
          "Turn it round: " + k + X + "what = " + n + "?", k + X + a + " = " + n + ", so there are <b>" + a + "</b> in each.");
      }
      return [
        { mild: share(32, 4), medium: share(63, 7), spicy: share(840, 12) },
        { mild: share(18, 3), medium: share(96, 12), spicy: share(960, 8) },
        { mild: share(45, 5), medium: share(56, 8), spicy: share(3600, 60) }
      ];
    })()),

    S("match", "Turn it round", (function(){
      function M(list){
        return { q: "Match each times fact to a divide fact it gives you for free.",
          pairs: list.map(function(x){ var p = r6(x[0] * x[1]); return [x[0] + X + x[1] + " = " + p, x[3] || (p + D + x[0] + " = " + x[1])]; }),
          hint: "Look for the same three numbers.", why: "Each pair uses the same three numbers. That is what makes them one family." };
      }
      return [
        { mild: M([[2, 6], [5, 3], [4, 10], [3, 9]]), medium: M([[6, 7], [8, 9], [12, 4], [7, 7]]),
          spicy: M([[7, 8, 0, "560" + D + "8 = 70"], [6, 9, 0, "5.4" + D + "9 = 0.6"], [12, 11, 0, "1320" + D + "11 = 120"], [4, 7, 0, "2.8" + D + "4 = 0.7"]]) },
        { mild: M([[3, 4], [5, 8], [2, 9], [10, 6]]), medium: M([[9, 6], [8, 12], [7, 11], [6, 8]]),
          spicy: M([[9, 8, 0, "7.2" + D + "8 = 0.9"], [6, 12, 0, "720" + D + "12 = 60"], [11, 11, 0, "12.1" + D + "11 = 1.1"], [7, 6, 0, "4200" + D + "60 = 70"]]) },
        { mild: M([[4, 5], [3, 6], [2, 11], [5, 7]]), medium: M([[12, 12], [7, 9], [8, 4], [6, 11]]),
          spicy: M([[8, 8, 0, "640" + D + "8 = 80"], [3, 12, 0, "3.6" + D + "12 = 0.3"], [9, 7, 0, "6.3" + D + "9 = 0.7"], [5, 11, 0, "550" + D + "11 = 50"]]) }
      ];
    })()),

    S("mc", "Turn it round", (function(){
      var BJ = '<svg viewBox="0 0 420 160" role="img" aria-label="Jay and Bonnie">' + '<rect width="420" height="160" rx="14" fill="#f4f1ea"/>' + A.jay(120, 60, 0.85, "hmm") + A.bonnie(300, 100, 1, "sit") + '</svg>';
      var OPTS = ["Both of them", "Only Jay", "Only Bonnie", "Neither of them"];
      function JB(jay, bon, ans, why){
        var sl = {};
        var say = ["Check each one with a times fact.", "Jay is right, and Bonnie is right too. Check both.", "Bonnie is right, and Jay is right too. Check both.", "At least one of them is right. Check each with a times fact."];
        if(ans !== 0) say[0] = "Check each one. One of them has a slip.";
        if(ans === 1) say[2] = "Check Bonnie's with a times fact.";
        if(ans === 2) say[1] = "Check Jay's with a times fact.";
        OPTS.forEach(function(o, k){ if(k !== ans) sl[k] = say[k]; });
        return { q: "Jay says: \"" + jay + "\" Bonnie gives a little woof that means: \"" + bon + "\" Who is right?", fig: BJ,
          options: OPTS, answer: ans, slips: sl, hint: "Turn each divide into a times fact and check it.", why: why };
      }
      return [
        { mild: JB("I know 4" + X + "5 = 20, so 20" + D + "4 = 5.", "So 20" + D + "5 = 4 too.", 0, "Both are right. One times fact gives two divides."),
          medium: JB("I know 9" + X + "6 = 54, so 54" + D + "9 = 6.", "So 54" + D + "6 = 9 too.", 0, "Both are right. One times fact gives two divides."),
          spicy: JB("I know 8" + X + "7 = 56, so 5.6" + D + "8 = 0.7.", "So 560" + D + "7 = 80.", 0, "Both are right. 8" + X + "0.7 = 5.6 and 7" + X + "80 = 560.") },
        { mild: JB("I know 3" + X + "8 = 24, so 24" + D + "8 = 3.", "So 24" + D + "3 = 8 too.", 0, "Both are right. One times fact gives two divides."),
          medium: JB("I know 7" + X + "8 = 56, so 56" + D + "7 = 8.", "So 56" + D + "8 = 7 too.", 0, "Both are right. One times fact gives two divides."),
          spicy: JB("I know 9" + X + "12 = 108, so 1080" + D + "12 = 90.", "So 10.8" + D + "9 = 1.2.", 0, "Both are right. 12" + X + "90 = 1080 and 9" + X + "1.2 = 10.8.") },
        { mild: JB("I know 6" + X + "3 = 18, so 18" + D + "3 = 6.", "So 18" + D + "6 = 2.", 1, "Only Jay. 18" + D + "6 = 3, because 6" + X + "3 = 18. Bonnie is forgiven: she is a poodle."),
          medium: JB("I know 12" + X + "6 = 72, so 72" + D + "12 = 7.", "So 72" + D + "6 = 12.", 2, "Only Bonnie. 72" + D + "12 = 6, not 7. In the wise words of Jay's late, great grandfather: stop, and check it."),
          spicy: JB("I know 6" + X + "8 = 48, so 4.8" + D + "6 = 8.", "So 480" + D + "8 = 60.", 2, "Only Bonnie. 4.8" + D + "6 = 0.8, because 6" + X + "0.8 = 4.8. Outrageous, Jay.") }
      ];
    })(), { fixed: true, explain: true }),

    S("num", "Turn it round", (function(){
      function cool(a, b, c, d, e, f){
        /* a x b, c / d, ? x e = f */
        var p = r6(a * b), q = r6(c / d), m = r6(f / e);
        return N("Cool down: one of each kind. Take them in any order.",
          [{ label: a + X + b + " =", a: p }, { label: c + D + d + " =", a: q }, { label: "Missing number: ?" + X + e + " = " + f, a: m }],
          factSlips(0, a, b).concat([[1, r6(c - d), "For " + c + D + d + ": that takes away. Share instead."], [2, r6(f - e), "For the missing number: that takes away. Ask what times " + e + " makes " + f + "."]].filter(function(r){ return r[1] > 0; })),
          "The last one is a divide in disguise: " + f + D + e + ".",
          a + X + b + " = <b>" + p + "</b>, " + c + D + d + " = <b>" + q + "</b>, and <b>" + m + "</b>" + X + e + " = " + f + ".");
      }
      return [
        { mild: cool(6, 5, 20, 4, 3, 27), medium: cool(8, 7, 84, 12, 9, 108), spicy: cool(0.8, 9, 630, 7, 12, 1.44) },
        { mild: cool(3, 7, 30, 5, 4, 32), medium: cool(9, 6, 77, 11, 8, 96), spicy: cool(1.2, 6, 720, 9, 7, 4.9) },
        { mild: cool(10, 9, 22, 2, 5, 40), medium: cool(12, 6, 81, 9, 7, 49), spicy: cool(60, 0.7, 5.4, 6, 11, 1320) }
      ];
    })())
  ],

  realWorld: {
    title: "Times tables were everyday money once",
    html: "<p>Packs of 6 and 12, a crate of 24, a bus every 12 minutes: times facts turn up whenever things come in groups.</p>" +
      "<p>For our big question: if you travelled back to Britain before 1971, you would really need your 12s. There were <b>12 pennies in a shilling</b>, so 3 shillings was 36 pennies. Would you cope with the shopping? Jay reckons you would.</p>",
    fig: SHILLING
  },

  make: {
    title: "Make a gym card",
    intro: "Your strongest fact, or one you are working on, and the trick that helps. Keep it, stick it on the wall or send it to Jay.",
    fields: [
      { id: "fact", label: "My fact", ph: "7 x 8 = 56", max: 18 },
      { id: "trick", label: "The trick that helps", ph: "5, 6, 7, 8: 56 = 7 x 8", max: 46 },
      { id: "name", label: "Gym member", ph: "B5 lifter", max: 20 }
    ],
    svg: function(v){
      function e(t){ return String(t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n){ var w = String(t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, 2); }
      var tr = wrap(v.trick, 30);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380">' +
        '<rect width="600" height="380" rx="24" fill="#141a33"/>' +
        '<rect x="14" y="14" width="572" height="352" rx="18" fill="none" stroke="#ffd23f" stroke-width="4"/>' +
        '<text x="40" y="64" ' + F + ' font-size="20" font-weight="700" fill="#ffd23f" letter-spacing="4">TIMES TABLE GYM</text>' +
        '<text x="40" y="150" ' + F + ' font-size="54" font-weight="700" fill="#ffffff">' + e(v.fact) + '</text>' +
        tr.map(function(l, k){ return '<text x="40" y="' + (206 + k * 30) + '" ' + F + ' font-size="22" fill="#cfe8f5">' + e(l) + '</text>'; }).join("") +
        '<text x="40" y="328" ' + F + ' font-size="18" fill="#ffffff">Member: ' + e(v.name) + '</text>' +
        '<g transform="translate(470 300) scale(0.6)">' +
          '<rect x="-80" y="-5" width="160" height="10" rx="5" fill="#cfd3dd"/>' +
          '<rect x="-74" y="-34" width="26" height="68" rx="7" fill="#ffd23f"/><rect x="48" y="-34" width="26" height="68" rx="7" fill="#ffd23f"/>' +
          '<rect x="-96" y="-24" width="20" height="48" rx="6" fill="#ff5d8f"/><rect x="76" y="-24" width="20" height="48" rx="6" fill="#ff5d8f"/></g>' +
        '</svg>';
    }
  }
};
})();
