/* Base 5 Autumn 2 activity: Factors and multiples.
   Maths. The words multiple, factor and factor pair. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, extra){ return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '" fill="#141a33" ' + (extra || "") + '>' + s + '</text>'; }

/* a staircase of jumps: multiples of n */
function jumps(n, count, note){
  var w = 520, x0 = 26, x1 = 494, max = n * count, k = (x1 - x0) / max;
  var out = '<svg viewBox="0 0 520 150" role="img" aria-label="Jumps of ' + n + ' landing on its multiples">' +
    '<rect width="520" height="150" rx="14" fill="#f4f1ea"/><path d="M' + x0 + ' 96H' + x1 + '" stroke="#141a33" stroke-width="3"/>';
  for(var i = 0; i <= max; i++){
    var x = x0 + i * k, hit = i % n === 0;
    out += '<path d="M' + x + ' ' + (hit ? 86 : 91) + 'v' + (hit ? 20 : 10) + '" stroke="#141a33" stroke-width="' + (hit ? 2.5 : 1) + '" stroke-opacity="' + (hit ? 1 : .4) + '"/>';
    if(hit && i > 0){
      out += '<circle cx="' + x + '" cy="96" r="7" fill="#ff8a3d"/>' + T(x, 126, String(i), 14, 'text-anchor="middle" font-weight="700"');
      var px = x - n * k;
      out += '<path d="M' + (px + 3) + ' 86Q' + ((px + x) / 2) + ' 46 ' + (x - 3) + ' 86" fill="none" stroke="#ff8a3d" stroke-width="3"/>';
    }
  }
  out += T(x0, 126, "0", 14, 'text-anchor="middle"');
  if(note) out += T(260, 26, note, 15, 'text-anchor="middle" font-weight="700"');
  return out + '</svg>';
}

/* all the rectangles you can make from n squares */
function rects(n, pairs, note){
  /* each rectangle drawn wide (rows = the smaller factor), stacked down the page */
  var rowsTot = 0; pairs.forEach(function(p){ rowsTot += Math.min(p[0], p[1]); });
  var maxC = 0; pairs.forEach(function(p){ maxC = Math.max(maxC, Math.max(p[0], p[1])); });
  var cell = Math.max(6, Math.min(22, Math.floor(380 / maxC), Math.floor(210 / rowsTot)));
  var y = 18, body = '';
  pairs.forEach(function(p){
    var r = Math.min(p[0], p[1]), c = Math.max(p[0], p[1]);
    for(var i = 0; i < r; i++) for(var j = 0; j < c; j++) body += '<rect x="' + (20 + j * cell) + '" y="' + (y + i * cell) + '" width="' + (cell - 1) + '" height="' + (cell - 1) + '" rx="1" fill="#22b8e6"/>';
    body += T(20 + c * cell + 14, y + r * cell / 2 + 6, r + " &#215; " + c, 16, 'font-weight="700"');
    y += r * cell + 16;
  });
  var H = y + (note ? 30 : 4);
  return '<svg viewBox="0 0 520 ' + H + '" role="img" aria-label="Every rectangle made from ' + n + ' squares">' +
    '<rect width="520" height="' + H + '" rx="14" fill="#f4f1ea"/>' + body +
    (note ? T(260, H - 14, note, 15, 'text-anchor="middle" font-weight="700"') : '') + '</svg>';
}

/* factor pairs as a rainbow */
function rainbow(n, list){
  var W = 520, x0 = 40, x1 = 480, step = (x1 - x0) / (list.length - 1);
  var cols = ["#e04848", "#ff8a3d", "#ffd23f", "#19c39a", "#22b8e6", "#8a5cf6"];
  var out = '<svg viewBox="0 0 520 170" role="img" aria-label="Factor rainbow for ' + n + '">' + '<rect width="520" height="170" rx="14" fill="#f4f1ea"/>';
  for(var i = 0; i < Math.floor(list.length / 2); i++){
    var a = x0 + i * step, b = x0 + (list.length - 1 - i) * step;
    out += '<path d="M' + a + ' 118Q' + ((a + b) / 2) + ' ' + (118 - (b - a) * 0.42) + ' ' + b + ' 118" fill="none" stroke="' + cols[i % cols.length] + '" stroke-width="5"/>';
  }
  list.forEach(function(f, i){ out += '<circle cx="' + (x0 + i * step) + '" cy="130" r="16" fill="#fff" stroke="#141a33" stroke-width="2"/>' + T(x0 + i * step, 136, String(f), 15, 'text-anchor="middle" font-weight="700"'); });
  out += T(260, 164, "Factors of " + n + ": each arch joins a pair that multiplies to " + n, 13, 'text-anchor="middle"');
  return out + '</svg>';
}

var WORDS =
  '<svg viewBox="0 0 520 190" role="img" aria-label="Factors go into a number; multiples come out of the times table">' +
  '<rect width="520" height="190" rx="16" fill="#f4f1ea"/>' +
  '<rect x="200" y="62" width="120" height="66" rx="14" fill="#ffd23f" stroke="#141a33" stroke-width="3"/>' + T(260, 106, "12", 32, 'text-anchor="middle" font-weight="700"') +
  ['1', '2', '3', '4', '6'].map(function(f, k){ return '<g>' + '<circle cx="' + (40 + (k % 3) * 52) + '" cy="' + (54 + Math.floor(k / 3) * 60) + '" r="20" fill="#d9f3ff" stroke="#22b8e6" stroke-width="2.5"/>' + T(40 + (k % 3) * 52, 60 + Math.floor(k / 3) * 60, f, 16, 'text-anchor="middle" font-weight="700"') + '</g>'; }).join("") +
  T(92, 172, "factors go in", 15, 'text-anchor="middle" font-weight="700" fill="#1a6e93"') +
  '<path d="M170 95h22" stroke="#141a33" stroke-width="3"/><path d="M186 89l8 6 -8 6" fill="none" stroke="#141a33" stroke-width="3"/>' +
  '<path d="M326 95h22" stroke="#141a33" stroke-width="3"/><path d="M342 89l8 6 -8 6" fill="none" stroke="#141a33" stroke-width="3"/>' +
  ['12', '24', '36', '48', '60'].map(function(f, k){ return '<g><circle cx="' + (380 + (k % 3) * 52) + '" cy="' + (54 + Math.floor(k / 3) * 60) + '" r="20" fill="#ffe3cf" stroke="#ff8a3d" stroke-width="2.5"/>' + T(380 + (k % 3) * 52, 60 + Math.floor(k / 3) * 60, f, 15, 'text-anchor="middle" font-weight="700"') + '</g>'; }).join("") +
  T(432, 172, "multiples come out", 15, 'text-anchor="middle" font-weight="700" fill="#b4541a"') +
  '</svg>';

var START =
  '<svg viewBox="0 0 520 190" role="img" aria-label="A number tree with factors as roots and multiples as branches">' +
  '<rect width="520" height="190" rx="16" fill="#eaf6ff"/>' +
  '<path d="M0 150h520v40H0z" fill="#8fd18a"/>' +
  '<rect x="248" y="70" width="24" height="84" fill="#7a5532"/>' +
  '<circle cx="260" cy="62" r="56" fill="#19c39a" fill-opacity=".85"/>' +
  T(260, 72, "12", 30, 'text-anchor="middle" font-weight="700"') +
  '<path d="M260 154l-40 30M260 154l40 30M260 154v34" stroke="#7a5532" stroke-width="5"/>' +
  T(24, 40, "Factors: the roots", 15, 'font-weight="700"') + T(24, 62, "1, 2, 3, 4, 6, 12", 14) +
  T(340, 150, "Multiples: it grows", 15, 'font-weight="700"') + T(340, 172, "12, 24, 36, 48...", 14) +
  A2ART.egg(A2ART.bird(312, 26, 0.75, "#ff5d5d"), "A bird in the factor tree. Jay counted: it has 2 legs, and 2 is a factor of 12. Coincidence? Yes.") +
  '</svg>';

/* widget: build rectangles from n squares */
function mountRects(el, api){
  var opts = api.level === "mild" ? [6, 8, 10, 12] : api.level === "medium" ? [12, 16, 18, 24] : [24, 30, 36, 13];
  var d = api.data; d.found = d.found || {};
  var n = d.n && opts.indexOf(d.n) >= 0 ? d.n : opts[0];
  el.innerHTML = '<div class="frbtns" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px"></div>' +
    '<p class="frq" style="margin:4px 0"></p>' +
    '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><label>Rows <input class="frr" type="number" min="1" max="40" style="width:64px"></label>' +
    '<label>Columns <input class="frc" type="number" min="1" max="40" style="width:64px"></label>' +
    '<button type="button" class="btn frgo">Try it</button></div>' +
    '<div class="frpic" style="margin-top:10px;text-align:center"></div>' +
    '<p class="frout" aria-live="polite"></p>';
  var bw = el.querySelector(".frbtns"), pic = el.querySelector(".frpic"), out = el.querySelector(".frout");
  opts.forEach(function(o){
    var b = document.createElement("button"); b.type = "button"; b.className = "a2chip"; b.textContent = o + " squares";
    b.onclick = function(){ n = o; d.n = o; api.save(); draw(); };
    bw.appendChild(b);
  });
  function list(){ return (d.found[n] || []).slice().sort(function(a, b){ return a - b; }); }
  function draw(){
    [].forEach.call(bw.children, function(x){ x.setAttribute("aria-pressed", x.textContent === n + " squares" ? "true" : "false"); });
    var f = list();
    el.querySelector(".frq").innerHTML = "Make a rectangle from <b>" + n + "</b> squares. Rows found so far: <b>" + (f.length ? f.join(", ") : "none yet") + "</b>";
    pic.innerHTML = ""; out.textContent = "";
  }
  el.querySelector(".frgo").onclick = function(){
    var r = parseInt(el.querySelector(".frr").value, 10), c = parseInt(el.querySelector(".frc").value, 10);
    if(!(r > 0 && c > 0)){ out.textContent = "Pop a number in each box first."; return; }
    var cell = Math.max(6, Math.min(22, Math.floor(300 / Math.max(r, c))));
    var svg = '<svg viewBox="0 0 ' + (c * cell + 4) + ' ' + (r * cell + 4) + '" style="max-width:320px;max-height:240px;width:100%" role="img" aria-label="' + r + ' by ' + c + ' rectangle">';
    for(var i = 0; i < r; i++) for(var j = 0; j < c; j++) svg += '<rect x="' + (2 + j * cell) + '" y="' + (2 + i * cell) + '" width="' + (cell - 1) + '" height="' + (cell - 1) + '" fill="' + (r * c === n ? "#22b8e6" : "#ffb35c") + '"/>';
    pic.innerHTML = svg + '</svg>';
    if(r * c === n){
      d.found[n] = d.found[n] || [];
      [r, c].forEach(function(x){ if(d.found[n].indexOf(x) < 0) d.found[n].push(x); });
      api.save();
      out.innerHTML = "Yes: " + r + " &times; " + c + " = " + n + ". So " + r + " and " + c + " are a <b>factor pair</b> of " + n + ".";
      el.querySelector(".frq").innerHTML = "Make a rectangle from <b>" + n + "</b> squares. Factors found so far: <b>" + list().join(", ") + "</b>";
      if(!api.resolved()) api.done("done");
    } else {
      out.innerHTML = "That makes " + (r * c) + " squares, not " + n + ". Have another go, if you like.";
    }
  };
  draw();
}

(window.A2PACKS = window.A2PACKS || {})["factors-multiples"] = {
  a2: true,
  id: "a2-factors-multiples",
  title: "Factors and multiples",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 20,
  line: "Multiples come out of a times table. Factors go into a number exactly.",
  blurb: "What the words multiple and factor mean, and how to tell them apart. Four short chunks, and a number profile to make at the end.",
  note: "The words multiple and factor, with pictures. Four five minute chunks and a number profile at the end. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Seedling", line: "Seedling: multiples and factors of small numbers." },
    { id: "medium", name: "Sapling", line: "Sapling: bigger numbers, every factor pair, and numbers in common." },
    { id: "spicy", name: "Old oak", line: "Old oak: primes, common factors and common multiples." }
  ],
  themes: {
    time: { name: "Time travel", w: { items: "time crystals", rows: "shelves", who: "the time traveller", every: "every 4 years a leap year comes round" } },
    football: { name: "Football", w: { items: "players", rows: "lines", who: "the coach", every: "every 4 years a World Cup comes round" } },
    horror: { name: "Horror", w: { items: "gravestones", rows: "rows", who: "the night porter", every: "every 4 nights the old lift breaks" } },
    fishing: { name: "Fishing", w: { items: "hooks", rows: "trays", who: "the angler", every: "every 4 days the lake is restocked" } },
    music: { name: "Music", w: { items: "dancers", rows: "lines", who: "the choreographer", every: "every 4 beats the chorus kicks in" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: START,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Multiples", title: "Multiples: the numbers a times table lands on",
      fig: jumps(3, 7, "Jumps of 3 land on the multiples of 3"),
      html: "<p>Count in threes: 3, 6, 9, 12, 15, 18, 21. These are the <b>multiples of 3</b>.</p>" +
        "<p>A multiple is any answer in that times table. 12 is a multiple of 3 because 4 &times; 3 = 12.</p>" +
        "<p>Multiples go on forever, and they are never smaller than the number itself.</p>",
      lv: { spicy: { html: "<p>The <b>multiples</b> of 3 are the answers in the 3 times table: 3, 6, 9, 12, 15... and on forever.</p>" +
        "<p>A number is a multiple of 3 if 3 goes into it with nothing left over. 3 000 003 is a multiple of 3 (1 000 001 &times; 3).</p>" +
        "<p>Every number is a multiple of itself, and a multiple of 1.</p>" } } },

    { type: "multi", topic: "Multiples",
      q: "Pick <b>all</b> the multiples of 5.",
      options: ["10", "15", "25", "12", "52"],
      answers: [0, 1, 2],
      hint: "Count in fives: 5, 10, 15, 20, 25...",
      why: "10, 15 and 25 are in the 5 times table. 12 and 52 are not: they end in 2.",
      lv: {
        medium: { q: "Pick <b>all</b> the multiples of 6.", options: ["18", "36", "54", "26", "46"], answers: [0, 1, 2],
          hint: "6, 12, 18, 24, 30, 36...", why: "18 = 3 &times; 6, 36 = 6 &times; 6 and 54 = 9 &times; 6. 26 and 46 end in 6 but are not in the 6s." },
        spicy: { q: "Pick <b>all</b> the multiples of 7.", options: ["49", "63", "91", "57", "77"], answers: [0, 1, 2, 4],
          hint: "Check each one: 7 times what?", why: "49 = 7 &times; 7, 63 = 9 &times; 7, 77 = 11 &times; 7, 91 = 13 &times; 7. 57 is 8 &times; 7 + 1." } } },

    { type: "num", topic: "Multiples",
      q: "What is the 6th multiple of 4?",
      fig: jumps(4, 6, "Six jumps of 4"),
      boxes: [{ label: "6th multiple of 4", a: 24 }],
      slips: [[10, "That adds 6 and 4. The 6th multiple is 6 jumps of 4."], [20, "That is the 5th. One more jump."], [6, "6 is how many jumps. Where do you land?"]],
      hint: "Count in fours six times: 4, 8, 12...",
      why: "4, 8, 12, 16, 20, <b>24</b>. The 6th multiple of 4 is 6 &times; 4.",
      lv: {
        medium: { q: "What is the 9th multiple of 7?", fig: jumps(7, 9, "Nine jumps of 7"), boxes: [{ label: "9th multiple of 7", a: 63 }],
          slips: [[16, "That adds 9 and 7. The 9th multiple is 9 &times; 7."], [56, "That is the 8th. One more jump."], [72, "72 is 9 &times; 8."]],
          hint: "9 &times; 7.", why: "The 9th multiple of 7 is 9 &times; 7 = <b>63</b>." },
        spicy: { q: "What is the first multiple of 8 that is bigger than 100?", fig: jumps(8, 13, "Jumps of 8 past 100"), boxes: [{ label: "First multiple over 100", a: 104 }],
          slips: [[96, "96 is a multiple of 8, but it is below 100."], [108, "108 is not in the 8s: 13 &times; 8 = 104."], [100, "100 &divide; 8 leaves 4 over."]],
          hint: "12 &times; 8 = 96. One more 8.", why: "12 &times; 8 = 96, then 13 &times; 8 = <b>104</b>." } } },

    { type: "mc", topic: "Multiples",
      q: "[[Every]]. Which of these years is a multiple of 4?",
      options: ["2028", "2026", "2030", "2031"],
      answer: 0,
      slips: { 1: "2026 &divide; 4 leaves 2 over.", 2: "2030 is in the 2s and the 10s, but not the 4s.", 3: "2031 is odd, so it cannot be a multiple of 4." },
      hint: "2000 is in the 4s. Then look at the 28, 26, 30 or 31.",
      why: "2000 is a multiple of 4 and so is 28 (7 &times; 4). So 2028 is too.",
      lv: { mild: { q: "Which of these is a multiple of 4?", options: ["28", "26", "30", "31"],
        slips: { 1: "26 &divide; 4 leaves 2 over.", 2: "30 is not in the 4s: 28, then 32.", 3: "31 is odd, so it cannot be a multiple of 4." },
        hint: "Count in fours: 4, 8, 12, 16, 20, 24...", why: "28 = 7 &times; 4." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Factors", title: "Factors: the numbers that go in exactly",
      fig: rects(12, [[1, 12], [2, 6], [3, 4]], "12 squares make three rectangles"),
      html: "<p>A <b>factor</b> of 12 is a number that goes into 12 with nothing left over.</p>" +
        "<p>Try making rectangles from 12 squares: 1 row of 12, 2 rows of 6, 3 rows of 4. The rows and columns are the factors: <b>1, 2, 3, 4, 6 and 12</b>.</p>" +
        "<p>5 is not a factor: 5 rows would leave 2 squares over.</p>",
      lv: {
        medium: { fig: rects(24, [[1, 24], [2, 12], [3, 8], [4, 6]], "24 squares make four rectangles"),
          html: "<p>A <b>factor</b> of 24 goes into 24 with nothing left over.</p><p>Rectangles from 24 squares: 1 &times; 24, 2 &times; 12, 3 &times; 8 and 4 &times; 6. So the factors of 24 are <b>1, 2, 3, 4, 6, 8, 12 and 24</b>.</p>" +
            "<p>Factors are never bigger than the number. Multiples are never smaller. That is the easiest way to tell the words apart.</p>" },
        spicy: { fig: rects(13, [[1, 13]], "13 squares only make one rectangle"),
          html: "<p>A <b>factor</b> goes into a number with nothing left over.</p>" +
            "<p>Some numbers only make one rectangle. 13 squares can only be 1 row of 13. Its only factors are 1 and 13.</p>" +
            "<p>A number with <b>exactly two</b> factors, 1 and itself, is a <b>prime</b>. 2, 3, 5, 7, 11 and 13 are prime. 1 is not prime: it only has one factor.</p>" } } },

    { type: "widget", topic: "Factors", unscored: true,
      title: "Rectangle builder",
      html: "<p>Pick a number of squares, then try rows and columns to make a rectangle. Every rectangle that works gives you a factor pair. Find as many as you like.</p>",
      mount: mountRects },

    { type: "multi", topic: "Factors",
      q: "Pick <b>all</b> the factors of 10.",
      options: ["1", "2", "5", "10", "20", "3"],
      answers: [0, 1, 2, 3],
      hint: "Which numbers go into 10 with nothing left?",
      why: "1 &times; 10 and 2 &times; 5. So 1, 2, 5 and 10. 20 is a multiple of 10, not a factor.",
      lv: {
        medium: { q: "Pick <b>all</b> the factors of 18.", options: ["1", "2", "3", "6", "9", "18", "36", "4"], answers: [0, 1, 2, 3, 4, 5],
          why: "1 &times; 18, 2 &times; 9, 3 &times; 6. 36 is a multiple, and 4 leaves 2 over." },
        spicy: { q: "Pick <b>all</b> the prime numbers.", options: ["2", "9", "11", "15", "17", "1"], answers: [0, 2, 4],
          hint: "A prime has exactly two factors.", why: "2, 11 and 17 have only 1 and themselves. 9 = 3 &times; 3 and 15 = 3 &times; 5. 1 has only one factor, so it is not prime." } } },

    { type: "num", topic: "Factors",
      q: "How many factors does 6 have?",
      fig: rects(6, [[1, 6], [2, 3]], "6 squares make two rectangles"),
      boxes: [{ label: "How many factors", a: 4 }],
      slips: [[2, "That counts the rectangles. Each one gives two factors."], [3, "Check again: 1, 2, 3 and 6."], [6, "6 is the number. Count its factors: 1, 2, 3, 6."]],
      hint: "Read the rows and columns: 1, 6, 2, 3.",
      why: "1, 2, 3 and 6: <b>4</b> factors.",
      lv: {
        medium: { q: "How many factors does 36 have?", fig: rects(36, [[1, 36], [2, 18], [3, 12], [4, 9], [6, 6]], "36 squares"),
          boxes: [{ label: "How many factors", a: 9 }],
          slips: [[10, "6 &times; 6 uses the same factor twice. Count 6 once."], [5, "That counts the rectangles. Each gives two factors, apart from 6 &times; 6."], [8, "Check you have all of 1, 2, 3, 4, 6, 9, 12, 18, 36."]],
          hint: "List them in pairs: 1 and 36, 2 and 18...", why: "1, 2, 3, 4, 6, 9, 12, 18, 36: <b>9</b> factors. 6 &times; 6 only adds one." },
        spicy: { q: "How many factors does 48 have?", fig: rects(48, [[1, 48], [2, 24], [3, 16], [4, 12], [6, 8]], "48 squares"),
          boxes: [{ label: "How many factors", a: 10 }],
          slips: [[5, "That counts the pairs. Each pair is two factors."], [9, "Check: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48."], [8, "Check you have 16 and 3 as well."]],
          hint: "List them in pairs: 1 and 48, 2 and 24...", why: "1, 2, 3, 4, 6, 8, 12, 16, 24, 48: <b>10</b> factors." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Factor pairs", title: "Factor pairs come in twos",
      fig: rainbow(20, [1, 2, 4, 5, 10, 20]),
      html: "<p>Factors come in <b>pairs</b> that multiply to the number. For 20: 1 &times; 20, 2 &times; 10, 4 &times; 5.</p>" +
        "<p>Start at 1 and work up. When the pairs meet in the middle, you have found them all.</p>" +
        "<p>Here is a full worked one for 18. 1 &times; 18. 2 &times; 9. 3 &times; 6. Try 4: no. Try 5: no. Next is 6, which we already have. Done.</p>",
      lv: { spicy: { fig: rainbow(60, [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]),
        html: "<p>Factors come in <b>pairs</b>. Start at 1 and work up until the pairs meet.</p>" +
          "<p>Worked example for 60: 1 &times; 60, 2 &times; 30, 3 &times; 20, 4 &times; 15, 5 &times; 12, 6 &times; 10. Try 7, 8, 9: none work. Next is 10, already found. Done: 12 factors.</p>" } } },

    { type: "num", topic: "Factor pairs",
      q: "Fill in the missing factor pairs of 16. The first one is done: 1 &times; 16.",
      boxes: [{ label: "2 &times; ?", a: 8 }, { label: "4 &times; ?", a: 4 }],
      slips: [[0, 14, "That takes 2 away. 2 times what makes 16?"], [1, 12, "That takes 4 away. 4 times what makes 16?"]],
      hint: "2 times what makes 16? 4 times what?",
      why: "2 &times; <b>8</b> = 16 and 4 &times; <b>4</b> = 16. 4 pairs with itself.",
      lv: {
        medium: { q: "Fill in the missing factor pairs of 30. The first one is done: 1 &times; 30.",
          boxes: [{ label: "2 &times; ?", a: 15 }, { label: "3 &times; ?", a: 10 }, { label: "5 &times; ?", a: 6 }],
          slips: [[0, 28, "That takes 2 away. 2 times what makes 30?"], [1, 27, "That takes 3 away. 3 times what makes 30?"]],
          hint: "Halve 30 for the first one.", why: "2 &times; 15, 3 &times; 10, 5 &times; 6." },
        spicy: { q: "Find every factor pair of 72. Fill in the partners.",
          boxes: [{ label: "2 &times; ?", a: 36 }, { label: "3 &times; ?", a: 24 }, { label: "4 &times; ?", a: 18 }, { label: "6 &times; ?", a: 12 }, { label: "8 &times; ?", a: 9 }],
          slips: [[2, 16, "4 &times; 16 = 64. Try 4 &times; 18."], [4, 8, "8 &times; 8 = 64. 8 times what makes 72?"]],
          hint: "Halve, then a third, then a quarter.", why: "72 = 2 &times; 36 = 3 &times; 24 = 4 &times; 18 = 6 &times; 12 = 8 &times; 9." } } },

    { type: "num", topic: "Factor pairs",
      q: "No help this time. [[Who]] has 15 [[items]] to set out in equal [[rows]]. Not 1 row, not 15. How many in each row, if there are 3 [[rows]]?",
      boxes: [{ label: "In each row", a: 5 }],
      slips: [[12, "That takes 3 away. 3 times what makes 15?"], [45, "That multiplies. You are splitting 15 into 3 [[rows]]."]],
      hint: "3 times what makes 15?",
      why: "3 &times; <b>5</b> = 15. 3 and 5 are a factor pair of 15.",
      lv: {
        medium: { q: "No help this time. [[Who]] has 42 [[items]] to set out in equal [[rows]]. 6 [[rows]] of 7 is one way. If there are 3 [[rows]] instead, how many in each?",
          boxes: [{ label: "In each", a: 14 }],
          slips: [[39, "That takes 3 away. 3 times what makes 42?"], [7, "7 is the answer for 6 [[rows]]. With half as many [[rows]], each one holds twice as many."], [126, "That multiplies. You are splitting 42 into 3."]],
          hint: "Half as many [[rows]] means twice as many in each.",
          why: "3 &times; <b>14</b> = 42. Halving the [[rows]] doubles each one: 6 &times; 7 becomes 3 &times; 14." },
        spicy: { q: "No help this time. [[Who]] needs the [[items]] in equal [[rows]] and has 37 of them. How many different ways (counting 1 &times; 37 and 37 &times; 1 as different) can it be done?",
          boxes: [{ label: "Ways", a: 2 }],
          slips: [[1, "1 &times; 37 and 37 &times; 1 count as two."], [4, "37 is prime: it has no other factors."]],
          hint: "Is 37 prime?", why: "37 is prime, so only 1 &times; 37 and 37 &times; 1: <b>2</b> ways." } } },

    { type: "mc", topic: "Factor pairs", explain: true,
      q: "Bonnie lists the factors of 12 as 1, 2, 3, 4, 12. What has she missed?",
      fig: '<svg viewBox="0 0 420 140" role="img" aria-label="Bonnie with a list">' + A2ART.bonnie(90, 74, 1, "sit") + A2ART.bubble(170, 20, 200, 46, "1, 2, 3, 4, 12", 182) + '</svg>',
      options: ["6", "24", "5", "Nothing"],
      answer: 0,
      slips: { 1: "24 is a multiple of 12, not a factor.", 2: "5 does not go into 12 exactly.", 3: "Check the pairs: 2 pairs with 6." },
      hint: "Pair them up. Who is 2's partner?",
      why: "2 &times; 6 = 12, so 6 is a factor too. Pairing them up stops you missing one. Good effort for a dog.",
      lv: {
        medium: { q: "Bonnie lists the factors of 28 as 1, 2, 4, 7, 28. What has she missed?",
          fig: '<svg viewBox="0 0 420 140" role="img" aria-label="Bonnie with a list">' + A2ART.bonnie(90, 74, 1, "sit") + A2ART.bubble(170, 20, 200, 46, "1, 2, 4, 7, 28", 182) + '</svg>',
          options: ["14", "56", "3", "Nothing"],
          slips: { 1: "56 is a multiple of 28.", 2: "3 does not go into 28.", 3: "Check the pairs: 2 pairs with something." },
          why: "2 &times; 14 = 28. Pairing up stops you missing one." },
        spicy: { q: "Bonnie says 51 is prime. Is she right?",
          fig: '<svg viewBox="0 0 420 140" role="img" aria-label="Bonnie with a list">' + A2ART.bonnie(90, 74, 1, "sit") + A2ART.bubble(170, 20, 200, 46, "51 is prime!", 182) + '</svg>',
          options: ["No: 51 = 3 &times; 17", "Yes: it is odd", "Yes: it is not in the 2s or 5s", "No: 51 = 7 &times; 7"],
          slips: { 1: "Odd does not mean prime: 9 is odd.", 2: "Try 3: the digits add to 6.", 3: "7 &times; 7 is 49." },
          hint: "Add the digits to test for 3.", why: "5 + 1 = 6, so 3 goes in: 51 = 3 &times; 17. Not prime." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Factor or multiple?", title: "Which word?",
      fig: WORDS,
      html: "<p><b>Factors</b> go into a number. They are the same size or smaller.</p>" +
        "<p><b>Multiples</b> come out of the times table. They are the same size or bigger.</p>" +
        "<p>3 is a factor of 12, and 12 is a multiple of 3. Same fact, said from the other side.</p>",
      lv: { spicy: { html: "<p><b>Factors</b> go in; <b>multiples</b> come out. 3 is a factor of 12; 12 is a multiple of 3.</p>" +
        "<p>A <b>common factor</b> goes into two numbers: 4 is a common factor of 12 and 20. The biggest one is the <b>highest common factor</b> (4).</p>" +
        "<p>A <b>common multiple</b> is in both times tables: 60 is a common multiple of 12 and 20. The smallest one is the <b>lowest common multiple</b> (60).</p>" } } },

    { type: "sort", topic: "Factor or multiple?",
      q: "Think about 8. Sort these numbers.",
      buckets: ["Factor of 8", "Multiple of 8"],
      cards: [["1", 0], ["2", 0], ["4", 0], ["16", 1], ["24", 1], ["40", 1]],
      hint: "Smaller numbers that go in are factors. Bigger ones in the 8 times table are multiples.",
      why: "1, 2 and 4 go into 8. 16, 24 and 40 are in the 8 times table. (8 itself is both.)",
      lv: {
        medium: { q: "Think about 12. Sort these numbers.", buckets: ["Factor of 12", "Multiple of 12", "Neither"],
          cards: [["3", 0], ["6", 0], ["36", 1], ["60", 1], ["5", 2], ["30", 2]],
          why: "3 and 6 go into 12. 36 and 60 are in the 12s. 5 does not go in, and 30 is not in the 12s." },
        spicy: { q: "Think about 18 and 24. Sort these numbers.", buckets: ["Common factor", "Common multiple", "Neither"],
          cards: [["6", 0], ["3", 0], ["72", 1], ["144", 1], ["9", 2], ["48", 2]],
          why: "6 and 3 go into both. 72 and 144 are in both times tables. 9 only goes into 18, and 48 is only in the 24s." } } },

    { type: "mc", topic: "Factor or multiple?",
      q: "Fill the gap: \"5 is a ______ of 20.\"",
      options: ["factor", "multiple"],
      answer: 0, fixed: true,
      slips: { 1: "5 is smaller and goes into 20, so it is a factor. 20 is the multiple." },
      hint: "Does 5 go into 20, or come out of a times table?",
      why: "5 goes into 20 exactly (4 times). So 5 is a factor of 20, and 20 is a multiple of 5.",
      lv: {
        medium: { q: "Which sentence is true?", options: ["7 is a factor of 63.", "63 is a factor of 7.", "7 is a multiple of 63.", "63 is a factor of 9."], fixed: false,
          slips: { 1: "63 cannot go into 7: it is bigger.", 2: "7 is smaller than 63, so it cannot be a multiple of it.", 3: "63 is bigger than 9. It is a multiple of 9." },
          why: "9 &times; 7 = 63, so 7 is a factor of 63." },
        spicy: { q: "What is the lowest common multiple of 6 and 8?", options: ["24", "48", "2", "14"], fixed: false,
          slips: { 1: "48 is a common multiple, but there is a smaller one.", 2: "2 is the highest common factor.", 3: "That adds them." },
          hint: "List the 8s and stop at the first one in the 6s.", why: "8, 16, 24. 24 is also 4 &times; 6. So the LCM is 24." } } },

    { type: "num", topic: "Factor or multiple?",
      q: "I am a multiple of 4. I am also a factor of 16. I am bigger than 4 and smaller than 16. What am I?",
      boxes: [{ label: "Mystery number", a: 8 }],
      slips: [[12, "12 is a multiple of 4, but it does not go into 16."], [4, "4 is not bigger than 4."], [16, "16 is not smaller than 16."]],
      hint: "List the factors of 16, then pick the one in the 4s.",
      why: "Factors of 16: 1, 2, 4, 8, 16. Only <b>8</b> is a multiple of 4 between 4 and 16.",
      lv: {
        medium: { q: "I am a multiple of 6. I am also a factor of 60. I am between 20 and 40. What am I?", boxes: [{ label: "Mystery number", a: 30 }],
          slips: [[24, "24 is a multiple of 6, but it does not go into 60."], [36, "36 is a multiple of 6, but 60 &divide; 36 leaves some over."], [20, "20 goes into 60, but it is not in the 6s."]],
          hint: "List the 6s between 20 and 40: 24, 30, 36.", why: "<b>30</b> is 5 &times; 6, and 2 &times; 30 = 60." },
        spicy: { q: "Two lights flash: one every 6 seconds, one every 10 seconds. They flash together now. How many seconds until they next flash together?",
          boxes: [{ label: "Seconds", a: 30 }],
          slips: [[60, "60 works, but they meet sooner."], [16, "That adds them. You need the lowest common multiple."], [2, "2 is the highest common factor."]],
          hint: "Lowest common multiple of 6 and 10.", why: "6, 12, 18, 24, 30 and 10, 20, 30. They meet at <b>30</b> seconds." } } }
  ],

  realWorld: {
    title: "Where you would use this",
    html: "<p>Factors help when you set out chairs in equal rows, share into equal teams, or cut a sheet into equal pieces. Multiples help with anything that repeats: bus times, shifts, things that come round every few days.</p>" +
      "<p>For our big question: a time traveller who knows [[every]] can work out which years to visit. That is just multiples of 4.</p>",
    fig: '<svg viewBox="0 0 420 140" role="img" aria-label="Jay by the time portal">' + A2ART.portal(80, 70, 56) + A2ART.jay(250, 50, 0.85, "smile") +
      A2ART.bubble(298, 6, 116, 52, "2028, 2032,\n2036...", 302) + '</svg>'
  },

  make: {
    title: "Make a number profile",
    intro: "Pick a favourite number and give it a profile card. Stick it on the wall or send it to Jay.",
    fields: [
      { id: "num", label: "My number", ph: "24", max: 8 },
      { id: "factors", label: "Its factors", ph: "1, 2, 3, 4, 6, 8, 12, 24", max: 60 },
      { id: "mults", label: "Its first few multiples", ph: "24, 48, 72, 96", max: 40 },
      { id: "fact", label: "A fun fact about it", ph: "It has 8 factors. Bonnie approves.", max: 60 }
    ],
    svg: function(v){
      function e(t){ return String(t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n){ var w = String(t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n){ if(cur.trim()) out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, 2); }
      function lines(t, x, y, n, size){ return wrap(t, n).map(function(l, k){ return '<text x="' + x + '" y="' + (y + k * (size + 6)) + '" font-family="Verdana,Arial,sans-serif" font-size="' + size + '" fill="#141a33">' + e(l) + '</text>'; }).join(""); }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380">' +
        '<rect width="600" height="380" rx="24" fill="#eef9f2"/>' +
        '<circle cx="110" cy="120" r="76" fill="#19c39a"/><circle cx="110" cy="120" r="64" fill="#fff"/>' +
        '<text x="110" y="138" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="' + (String(v.num).length > 4 ? 26 : 46) + '" font-weight="700" fill="#141a33">' + e(v.num) + '</text>' +
        '<text x="216" y="70" font-family="Verdana,Arial,sans-serif" font-size="15" font-weight="700" fill="#1a6e93" letter-spacing="2">FACTORS</text>' + lines(v.factors, 216, 96, 30, 19) +
        '<text x="216" y="166" font-family="Verdana,Arial,sans-serif" font-size="15" font-weight="700" fill="#b4541a" letter-spacing="2">MULTIPLES</text>' + lines(v.mults, 216, 192, 30, 19) +
        '<rect x="30" y="250" width="540" height="100" rx="14" fill="#fff" stroke="#19c39a" stroke-width="3"/>' + lines(v.fact, 50, 290, 46, 19) +
        '</svg>';
    }
  }
};
})();
