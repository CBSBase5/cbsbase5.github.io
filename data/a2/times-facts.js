/* Base 5 Autumn 2 activity: Fact factory.
   Maths. Times facts to 12 x 12, and using them to divide. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, extra){ return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '" fill="#141a33" ' + (extra || "") + '>' + s + '</text>'; }

/* r rows of c dots, each row sitting in its own tray */
function arr(r, c, col, label){
  var gap = c > 8 ? 22 : 28, rad = c > 8 ? 8 : 10;
  var w = Math.max(320, c * gap + 80), hgt = r * (gap + 6) + (label ? 60 : 30);
  var out = '<svg viewBox="0 0 ' + w + ' ' + hgt + '" style="max-height:300px" role="img" aria-label="' + r + ' rows of ' + c + ' dots">' +
    '<rect width="' + w + '" height="' + hgt + '" rx="14" fill="#f4f1ea"/>';
  var x0 = (w - c * gap) / 2;
  for(var i = 0; i < r; i++){
    var y = 18 + i * (gap + 6);
    out += '<rect x="' + (x0 - 8) + '" y="' + y + '" width="' + (c * gap + 16) + '" height="' + gap + '" rx="8" fill="#fff" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>';
    for(var j = 0; j < c; j++) out += '<circle cx="' + (x0 + gap / 2 + j * gap) + '" cy="' + (y + gap / 2) + '" r="' + rad + '" fill="' + (col || "#ff8a3d") + '"/>';
  }
  if(label) out += T(w / 2, hgt - 18, label, 16, 'text-anchor="middle" font-weight="700"');
  return out + '</svg>';
}

/* hops along a number line: n jumps of size step */
function hops(step, n, note){
  var max = step * n, x0 = 30, x1 = 490, k = (x1 - x0) / max;
  var out = '<svg viewBox="0 0 520 150" role="img" aria-label="' + n + ' jumps of ' + step + ' along a number line">' +
    '<rect width="520" height="150" rx="14" fill="#f4f1ea"/>' +
    '<path d="M' + x0 + ' 96H' + x1 + '" stroke="#141a33" stroke-width="3"/>';
  for(var i = 0; i <= n; i++){
    var x = x0 + i * step * k;
    out += '<path d="M' + x + ' 88v16" stroke="#141a33" stroke-width="2.5"/>' + T(x, 124, String(i * step), 13, 'text-anchor="middle"');
    if(i < n){
      var x2 = x0 + (i + 1) * step * k, mx = (x + x2) / 2;
      out += '<path d="M' + (x + 3) + ' 86Q' + mx + ' 40 ' + (x2 - 3) + ' 86" fill="none" stroke="#8a5cf6" stroke-width="3"/>' +
        T(mx, 52, String(i + 1), 13, 'text-anchor="middle" font-weight="700" fill="#8a5cf6"');
    }
  }
  if(note) out += T(260, 24, note, 15, 'text-anchor="middle" font-weight="700"');
  return out + '</svg>';
}

/* one array, four facts */
function family(r, c){
  var p = r * c;
  var gap = 24, x0 = 30, y0 = 26;
  var out = '<svg viewBox="0 0 520 ' + Math.max(170, r * gap + 60) + '" role="img" aria-label="An array and its four facts">' +
    '<rect width="520" height="' + Math.max(170, r * gap + 60) + '" rx="14" fill="#f4f1ea"/>';
  for(var i = 0; i < r; i++) for(var j = 0; j < c; j++) out += '<circle cx="' + (x0 + 12 + j * gap) + '" cy="' + (y0 + 12 + i * gap) + '" r="9" fill="#22b8e6"/>';
  var fx = Math.max(x0 + c * gap + 40, 230);
  [[r + " &#215; " + c + " = " + p, "#141a33"], [c + " &#215; " + r + " = " + p, "#141a33"], [p + " &#247; " + r + " = " + c, "#1f9d63"], [p + " &#247; " + c + " = " + r, "#1f9d63"]].forEach(function(f, k){
    out += '<rect x="' + fx + '" y="' + (18 + k * 36) + '" width="200" height="30" rx="8" fill="#fff" stroke="' + f[1] + '" stroke-opacity=".4" stroke-width="2"/>' +
      T(fx + 100, 39 + k * 36, f[0], 17, 'text-anchor="middle" font-weight="700" fill="' + f[1] + '"');
  });
  return out + '</svg>';
}

var START =
  '<svg viewBox="0 0 520 190" role="img" aria-label="A little factory turning groups of dots into numbers">' +
  '<rect width="520" height="190" rx="16" fill="#f4f1ea"/>' +
  '<rect x="150" y="50" width="220" height="100" rx="10" fill="#ffd23f" stroke="#141a33" stroke-width="3"/>' +
  '<path d="M180 50v-26h30v26M300 50v-36h30v36" fill="#c9c2b2" stroke="#141a33" stroke-width="3"/>' +
  '<circle cx="195" cy="10" r="8" fill="#fff" fill-opacity=".8"/><circle cx="318" cy="2" r="6" fill="#fff" fill-opacity=".8"/>' +
  T(260, 108, "3 &#215; 4", 28, 'text-anchor="middle" font-weight="700"') +
  '<path d="M20 160h480" stroke="#141a33" stroke-width="4"/>' +
  [0, 1, 2].map(function(k){ return '<g transform="translate(' + (34 + k * 36) + ' 120)"><rect width="30" height="30" rx="5" fill="#fff" stroke="#141a33" stroke-width="2"/><circle cx="8" cy="10" r="4" fill="#ff8a3d"/><circle cx="22" cy="10" r="4" fill="#ff8a3d"/><circle cx="8" cy="22" r="4" fill="#ff8a3d"/><circle cx="22" cy="22" r="4" fill="#ff8a3d"/></g>'; }).join("") +
  '<g transform="translate(420 112)"><rect width="66" height="40" rx="8" fill="#19c39a" stroke="#141a33" stroke-width="2.5"/>' + T(33, 28, "12", 22, 'text-anchor="middle" font-weight="700"') + '</g>' +
  '<path d="M380 132h28" stroke="#141a33" stroke-width="3" marker-end="none"/><path d="M402 126l8 6 -8 6" fill="none" stroke="#141a33" stroke-width="3"/>' +
  A2ART.egg(A2ART.bonnie(470, 60, 0.55, "sit"), "Bonnie is the factory inspector. She checks every fact by sniffing it. All good so far.") +
  '</svg>';

var BIRDS = function(n, seeds){
  var out = '<svg viewBox="0 0 520 150" role="img" aria-label="Birds waiting for seeds">' +
    '<rect width="520" height="150" rx="14" fill="#eaf6ff"/><path d="M0 118h520" stroke="#7a5532" stroke-width="6"/>';
  var cols = ["#3a8fd6", "#ff5d5d", "#19c39a", "#ffd23f", "#8a5cf6", "#ff8a3d", "#3a8fd6", "#ff5d5d", "#19c39a"];
  for(var i = 0; i < n; i++) out += A2ART.bird(40 + i * (440 / Math.max(1, n - 1)), 96, 0.85, cols[i % cols.length]);
  out += T(260, 30, seeds + " seeds to share", 16, 'text-anchor="middle" font-weight="700"');
  out += A2ART.egg('<g transform="translate(486 24)"><circle r="12" fill="#fff" stroke="#141a33" stroke-width="2"/>' + T(0, 5, "?", 14, 'text-anchor="middle" font-weight="700"') + '</g>', "Jay once spent a whole lunch counting the pigeons on the roof. He got 11. Then one flew off. Outrageous.");
  return out + '</svg>';
};

/* widget: tap the times grid, see the array and its family */
function mountGrid(el, api){
  var N = api.level === "mild" ? 10 : 12;
  var d = api.data; d.taps = d.taps || [];
  el.innerHTML = '<div class="ffwrap" style="overflow-x:auto"></div><div class="ffout" style="margin-top:10px;text-align:center" aria-live="polite"></div>' +
    '<p class="tiny" style="margin-top:6px">Tapped so far: <span class="ffn">' + d.taps.length + '</span>. Three is plenty, but have as many goes as you like.</p>';
  var wrap = el.querySelector(".ffwrap"), out = el.querySelector(".ffout");
  var tbl = '<table style="border-collapse:collapse;margin:0 auto;font-family:Verdana,Arial,sans-serif;font-size:13px"><tr><th style="padding:2px;min-width:24px;color:#141a33">&#215;</th>';
  for(var c = 1; c <= N; c++) tbl += '<th style="padding:2px;min-width:24px;color:#141a33">' + c + '</th>';
  tbl += '</tr>';
  for(var r = 1; r <= N; r++){
    tbl += '<tr><th style="padding:2px;color:#141a33">' + r + '</th>';
    for(var c2 = 1; c2 <= N; c2++){
      tbl += '<td style="padding:1px"><button type="button" data-r="' + r + '" data-c="' + c2 + '" aria-label="' + r + ' times ' + c2 + '" style="width:26px;height:26px;padding:0;border:1px solid #c9c2b2;border-radius:5px;background:#fffbe9;color:#141a33;font-size:11px;cursor:pointer">' + (r * c2) + '</button></td>';
    }
    tbl += '</tr>';
  }
  wrap.innerHTML = tbl + '</table>';
  function show(r, c){
    var p = r * c;
    out.innerHTML = '<div style="max-width:420px;margin:0 auto">' + arr(r, c, "#22b8e6", r + " rows of " + c) + '</div>' +
      '<p style="font-size:1.05rem;margin:6px 0"><b>' + r + ' &times; ' + c + ' = ' + p + '</b> &nbsp; ' + c + ' &times; ' + r + ' = ' + p +
      ' &nbsp; ' + p + ' &divide; ' + r + ' = ' + c + ' &nbsp; ' + p + ' &divide; ' + c + ' = ' + r + '</p>';
    [].forEach.call(wrap.querySelectorAll("button"), function(b){
      var br = +b.getAttribute("data-r"), bc = +b.getAttribute("data-c");
      var on = (br === r && bc <= c) || (bc === c && br <= r);
      b.style.background = (br === r && bc === c) ? "#ffd23f" : on ? "#d9f3ff" : "#fffbe9";
    });
  }
  wrap.addEventListener("click", function(e){
    var b = e.target.closest ? e.target.closest("button") : null;
    if(!b) return;
    var r = +b.getAttribute("data-r"), c = +b.getAttribute("data-c");
    show(r, c);
    var k = r + "x" + c;
    if(d.taps.indexOf(k) < 0){ d.taps.push(k); api.save(); }
    el.querySelector(".ffn").textContent = d.taps.length;
    if(d.taps.length >= 3 && !api.resolved()) api.done("done");
  });
  if(d.taps.length){ var last = d.taps[d.taps.length - 1].split("x"); if(+last[0] <= N && +last[1] <= N) show(+last[0], +last[1]); }
}

(window.A2PACKS = window.A2PACKS || {})["times-facts"] = {
  a2: true,
  id: "a2-times-facts",
  title: "Fact factory",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 20,
  line: "Times facts go both ways. Know one, and you can divide with it too.",
  blurb: "Times facts up to 12 &times; 12, and how one times fact gives you division facts for free. Four short chunks, and a fact card to make at the end.",
  note: "Times facts, and how they help you divide. Four five minute chunks with a fact card at the end. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Small batch", line: "Small batch: the 2, 3, 4, 5 and 10 times tables." },
    { id: "medium", name: "Full shift", line: "Full shift: every table up to 12 &times; 12, including the tricky 6s, 7s, 8s and 9s." },
    { id: "spicy", name: "Overtime", line: "Overtime: 12 &times; 12 facts stretched to tens and decimals." }
  ],
  themes: {
    time: { name: "Time travel", w: { items: "time crystals", pack: "capsule", packs: "capsules", who: "the time traveller", place: "the time lab" } },
    football: { name: "Football", w: { items: "footballs", pack: "net bag", packs: "net bags", who: "the kit manager", place: "the training ground" } },
    horror: { name: "Horror", w: { items: "candles", pack: "creaky box", packs: "creaky boxes", who: "the night porter", place: "the old hospital" } },
    fishing: { name: "Fishing", w: { items: "floats", pack: "tackle tray", packs: "tackle trays", who: "the angler", place: "the bait shop" } },
    music: { name: "Music", w: { items: "tickets", pack: "envelope", packs: "envelopes", who: "the stage manager", place: "the box office" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: START,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Groups of", title: "Times means groups of",
      fig: arr(3, 5, "#ff8a3d", "3 rows of 5 makes 15"),
      html: "<p><b>3 &times; 5</b> means <b>3 groups of 5</b>.</p>" +
        "<p>Picture 3 [[packs]] with 5 [[items]] in each. Count in fives: 5, 10, 15. So 3 &times; 5 = 15.</p>" +
        "<p>Turn the picture on its side and it is 5 rows of 3. Same dots, same answer: 5 &times; 3 = 15 too.</p>",
      lv: {
        medium: { fig: arr(6, 7, "#ff8a3d", "6 rows of 7 makes 42"),
          html: "<p><b>6 &times; 7</b> means <b>6 groups of 7</b>.</p>" +
            "<p>Picture 6 [[packs]] with 7 [[items]] in each. You could count in sevens, or use a fact you know: 5 &times; 7 = 35, then one more 7 makes 42.</p>" +
            "<p>Turn it on its side: 7 &times; 6 = 42 as well. Every fact you learn is really two.</p>" },
        spicy: { fig: arr(8, 12, "#ff8a3d", "8 rows of 12 makes 96"),
          html: "<p><b>8 &times; 12</b> means <b>8 groups of 12</b>. Split the 12 into 10 and 2: 8 &times; 10 = 80 and 8 &times; 2 = 16, so 96.</p>" +
            "<p>Every fact works both ways round, so the 12 &times; 12 grid only has 78 different facts to know, not 144.</p>" +
            "<p>And one fact grows into lots more: 8 &times; 12 = 96 means 80 &times; 12 = 960 and 0.8 &times; 12 = 9.6.</p>" } } },

    { type: "mc", topic: "Groups of",
      q: "Which times fact matches the picture?",
      fig: arr(4, 2, "#19c39a", ""),
      options: ["4 &times; 2 = 8", "4 + 2 = 6", "4 &times; 3 = 12"],
      answer: 0,
      slips: { 1: "That adds the 4 and the 2. Times means groups: 4 rows with 2 in each.", 2: "Count along one row: there are 2 in each, not 3." },
      hint: "How many rows? How many in each row?",
      why: "4 rows with 2 in each is 4 &times; 2 = 8. Count in twos: 2, 4, 6, 8.",
      lv: {
        medium: { fig: arr(6, 8, "#19c39a", ""), options: ["6 &times; 8 = 48", "6 + 8 = 14", "6 &times; 8 = 42", "6 &times; 9 = 54"],
          slips: { 1: "That adds them. Times means 6 groups of 8.", 2: "42 is 6 &times; 7. There are 8 in each row.", 3: "Count along a row again: 8 in each, not 9." },
          hint: "6 rows of 8. If 5 eights are 40, what is one more 8?",
          why: "6 rows of 8 is 6 &times; 8 = 48. Five eights are 40, plus one more 8 is 48." },
        spicy: { fig: arr(7, 12, "#19c39a", ""), options: ["7 &times; 12 = 84", "7 &times; 12 = 74", "7 + 12 = 19", "7 &times; 11 = 77"],
          slips: { 1: "Close. 7 &times; 10 = 70 and 7 &times; 2 = 14, so it is 84, not 74.", 2: "That adds them. Times means 7 groups of 12.", 3: "Count along a row: there are 12, not 11." },
          hint: "Split the 12: 7 &times; 10 and 7 &times; 2.",
          why: "7 &times; 10 = 70 and 7 &times; 2 = 14. Together that is 84." } } },

    { type: "num", topic: "Groups of",
      q: "[[Who]] puts 5 [[items]] in each [[pack]]. There are 4 [[packs]]. How many [[items]] altogether?",
      boxes: [{ label: "[[Items]]", a: 20 }],
      slips: [[9, "That is 5 + 4. Times means groups: 4 groups of 5."], [25, "That is 5 groups of 5. There are 4 [[packs]]."], [15, "That is 3 groups of 5. One more 5."]],
      hint: "Count in fives, once for each [[pack]]: 5, 10, ...",
      why: "4 groups of 5 is 4 &times; 5 = <b>20</b>.",
      lv: {
        medium: { q: "[[Who]] puts 7 [[items]] in each [[pack]]. There are 8 [[packs]]. How many [[items]] altogether?",
          boxes: [{ label: "[[Items]]", a: 56 }],
          slips: [[15, "That is 7 + 8. Times means 8 groups of 7."], [54, "54 is 6 &times; 9. A handy one: 5, 6, 7, 8 gives 56 = 7 &times; 8."], [49, "That is 7 groups of 7. There are 8 [[packs]]."]],
          hint: "Try 5, 6, 7, 8: the digits 5 and 6, then 7 &times; 8.",
          why: "8 groups of 7 is 8 &times; 7 = <b>56</b>. Remember it as 5, 6, 7, 8: 56 = 7 &times; 8." },
        spicy: { q: "[[Who]] puts 12 [[items]] in each [[pack]]. There are 90 [[packs]]. How many [[items]] altogether?",
          boxes: [{ label: "[[Items]]", a: 1080 }],
          slips: [[108, "That is 9 &times; 12. There are 90 [[packs]], ten times as many."], [102, "That adds 12 and 90. Times means 90 groups of 12."], [10800, "One zero too many. 9 &times; 12 = 108, then times 10 once."]],
          hint: "Start with 9 &times; 12, then make it ten times bigger.",
          why: "9 &times; 12 = 108, and 90 is ten times 9, so the answer is ten times bigger: <b>1080</b>." } } },

    { type: "mc", topic: "Groups of",
      q: "Which one has the same answer as 3 &times; 5?",
      options: ["5 &times; 3", "3 + 5", "35"],
      answer: 0,
      slips: { 1: "3 + 5 = 8, but 3 &times; 5 = 15.", 2: "35 just puts the digits side by side. 3 &times; 5 = 15." },
      hint: "Turn the picture of 3 rows of 5 on its side.",
      why: "3 rows of 5 turned round is 5 rows of 3. Both make 15.",
      lv: {
        medium: { q: "Which one has the same answer as 7 &times; 9?", options: ["9 &times; 7", "7 + 9", "79", "7 &times; 8"],
          slips: { 1: "7 + 9 = 16, but 7 &times; 9 = 63.", 2: "79 puts the digits side by side. 7 &times; 9 = 63.", 3: "7 &times; 8 is one 7 fewer: 56." },
          why: "Times facts work both ways round: 7 &times; 9 = 9 &times; 7 = 63." },
        spicy: { q: "Which one has the same answer as 6 &times; 8?", options: ["3 &times; 16", "6 + 8", "12 &times; 16", "68"],
          slips: { 1: "6 + 8 = 14, but 6 &times; 8 = 48.", 2: "That doubles both numbers, which makes it four times bigger.", 3: "68 puts the digits side by side." },
          hint: "Try halving one number and doubling the other.",
          why: "Halve the 6 and double the 8: 3 &times; 16 = 48, same as 6 &times; 8. Halve one, double the other, and the answer stays put." } } },

    { type: "num", topic: "Groups of", explain: true,
      q: "Picture 6 dogs just like Bonnie. Each one has 4 paws. How many paws altogether?",
      fig: '<svg viewBox="0 0 420 130" role="img" aria-label="Bonnie the poodle">' + A2ART.bonnie(110, 70, 1, "stand") + A2ART.bubble(210, 16, 180, 46, "Paws, not tails.\nI have no tail.", 222) + '</svg>',
      boxes: [{ label: "Paws", a: 24 }],
      slips: [[10, "That is 6 + 4. Six groups of 4 is 6 &times; 4."], [20, "That is 5 &times; 4. One more dog's paws."], [28, "That is 7 &times; 4. One dog too many."]],
      hint: "Count in fours, once for each dog.",
      why: "6 groups of 4 is 6 &times; 4 = <b>24</b> paws. And still no tails.",
      lv: {
        medium: { q: "Picture 9 dogs just like Bonnie. Each one has 4 paws. How many paws altogether?",
          boxes: [{ label: "Paws", a: 36 }],
          slips: [[13, "That is 9 + 4. Nine groups of 4 is 9 &times; 4."], [32, "That is 8 &times; 4. One more dog."], [40, "That is 10 &times; 4. One dog fewer."]],
          hint: "10 dogs would be 40 paws. Take one dog away.",
          why: "9 &times; 4 = <b>36</b>. Or: 10 &times; 4 = 40, then take away one dog's 4 paws." },
        spicy: { q: "A dog show has 70 poodles just like Bonnie. Each one has 4 paws. How many paws altogether?",
          boxes: [{ label: "Paws", a: 280 }],
          slips: [[28, "That is 7 &times; 4. There are 70 dogs, ten times as many."], [74, "That adds 70 and 4. Times means 70 groups of 4."], [2800, "One zero too many: 7 &times; 4 = 28, then times 10 once."]],
          hint: "7 &times; 4, then ten times bigger.",
          why: "7 &times; 4 = 28, so 70 &times; 4 = <b>280</b>." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Fact families", title: "One picture, four facts",
      fig: family(3, 4),
      html: "<p>Look at the 3 rows of 4. You can read it four ways.</p>" +
        "<p>Two <b>times</b> facts: 3 &times; 4 = 12 and 4 &times; 3 = 12.</p>" +
        "<p>Two <b>divide</b> facts: share 12 into 3 rows and each row has 4. Share 12 into rows of 4 and you get 3 rows.</p>" +
        "<p>These four are a <b>fact family</b>. Know one, and you know them all.</p>",
      lv: {
        medium: { fig: family(6, 7), html: "<p>6 rows of 7 gives four facts.</p><p>Times: 6 &times; 7 = 42 and 7 &times; 6 = 42.</p><p>Divide: 42 &divide; 6 = 7 and 42 &divide; 7 = 6.</p><p>That is a <b>fact family</b>. The biggest number always stays at the start of a divide fact.</p>" },
        spicy: { fig: family(6, 7), html: "<p>6 rows of 7 gives four facts: 6 &times; 7 = 42, 7 &times; 6 = 42, 42 &divide; 6 = 7 and 42 &divide; 7 = 6.</p>" +
          "<p>Scale it and the family grows: 60 &times; 7 = 420, so 420 &divide; 7 = 60. And 0.6 &times; 7 = 4.2, so 4.2 &divide; 7 = 0.6.</p>" +
          "<p>Whatever you do to one number in the times fact, the matching number in the divide fact does the same.</p>" } } },

    { type: "multi", topic: "Fact families",
      q: "4 &times; 6 = 24. Pick <b>all</b> the facts in the same family.",
      fig: arr(4, 6, "#22b8e6", "4 rows of 6"),
      options: ["6 &times; 4 = 24", "24 &divide; 4 = 6", "24 &divide; 6 = 4", "24 &minus; 4 = 20", "4 + 6 = 10"],
      answers: [0, 1, 2],
      hint: "The family only uses 4, 6 and 24, with times or divide.",
      why: "6 &times; 4, 24 &divide; 4 and 24 &divide; 6 all use the same three numbers. Taking away and adding are a different job.",
      lv: {
        medium: { q: "7 &times; 8 = 56. Pick <b>all</b> the facts in the same family.", fig: arr(7, 8, "#22b8e6", "7 rows of 8"),
          options: ["8 &times; 7 = 56", "56 &divide; 7 = 8", "56 &divide; 8 = 7", "56 &minus; 8 = 48", "7 + 8 = 15"],
          hint: "The family only uses 7, 8 and 56, with times or divide.",
          why: "8 &times; 7, 56 &divide; 7 and 56 &divide; 8 use the same three numbers. Adding and taking away are not in the family." },
        spicy: { q: "9 &times; 12 = 108. Pick <b>all</b> the facts that follow from it.", fig: arr(9, 12, "#22b8e6", "9 rows of 12"),
          options: ["1080 &divide; 12 = 90", "108 &divide; 9 = 12", "0.9 &times; 12 = 10.8", "108 &divide; 12 = 8", "9 + 12 = 108"],
          answers: [0, 1, 2],
          hint: "Check each one still uses 9, 12 and 108, perhaps made ten times bigger or smaller.",
          why: "1080 &divide; 12 = 90 and 0.9 &times; 12 = 10.8 are the same family scaled by 10. 108 &divide; 12 is 9, not 8." } } },

    { type: "num", topic: "Fact families",
      q: "Use 5 &times; 6 = 30. What is 30 &divide; 5?",
      boxes: [{ label: "30 &divide; 5", a: 6 }],
      slips: [[25, "That takes 5 away from 30. Divide asks how many fives make 30."], [150, "That multiplies. Divide is the other way: 30 shared into 5."], [5, "5 is the number you divide by. How many fives make 30?"]],
      hint: "5 times what makes 30?",
      why: "5 &times; 6 = 30, so 30 &divide; 5 = <b>6</b>.",
      lv: {
        medium: { q: "Use 8 &times; 9 = 72. What is 72 &divide; 8?", boxes: [{ label: "72 &divide; 8", a: 9 }],
          slips: [[64, "That takes 8 away from 72. Divide asks how many eights make 72."], [8, "8 is what you divide by. How many eights make 72?"], [576, "That multiplies. Divide goes back the other way."]],
          hint: "8 times what makes 72?", why: "8 &times; 9 = 72, so 72 &divide; 8 = <b>9</b>." },
        spicy: { q: "Use 7 &times; 12 = 84. What is 840 &divide; 12?", boxes: [{ label: "840 &divide; 12", a: 70 }],
          slips: [[7, "84 &divide; 12 is 7, but 840 is ten times bigger, so the answer is too."], [700, "Too big. 840 is only ten times 84, so the answer is ten times 7."], [828, "That takes 12 away. Divide asks how many twelves make 840."]],
          hint: "84 &divide; 12 = 7. What happens when 84 becomes 840?", why: "84 &divide; 12 = 7, and 840 is ten times 84, so 840 &divide; 12 = <b>70</b>." } } },

    { type: "match", topic: "Fact families",
      q: "Match each times fact to a divide fact from its family.",
      pairs: [["2 &times; 5 = 10", "10 &divide; 5 = 2"], ["3 &times; 4 = 12", "12 &divide; 3 = 4"], ["4 &times; 10 = 40", "40 &divide; 10 = 4"], ["3 &times; 5 = 15", "15 &divide; 3 = 5"]],
      hint: "Find the divide fact that starts with the answer to the times fact.",
      why: "The biggest number in the family goes first in the divide fact.",
      lv: {
        medium: { pairs: [["6 &times; 7 = 42", "42 &divide; 6 = 7"], ["8 &times; 9 = 72", "72 &divide; 9 = 8"], ["7 &times; 12 = 84", "84 &divide; 7 = 12"], ["6 &times; 8 = 48", "48 &divide; 8 = 6"]] },
        spicy: { pairs: [["0.6 &times; 7 = 4.2", "4.2 &divide; 7 = 0.6"], ["9 &times; 11 = 99", "99 &divide; 9 = 11"], ["12 &times; 12 = 144", "144 &divide; 12 = 12"], ["8 &times; 70 = 560", "560 &divide; 8 = 70"]],
          why: "Each divide fact starts with the times answer and gives back one of the numbers you multiplied, decimals and tens included." } } },

    { type: "sort", topic: "Fact families",
      q: "The family of 3 &times; 8 = 24. Sort each fact: in the family or not?",
      buckets: ["In the family", "Not in this family"],
      cards: [["8 &times; 3 = 24", 0], ["24 &divide; 8 = 3", 0], ["24 &divide; 3 = 8", 0], ["3 + 8 = 11", 1], ["24 &divide; 4 = 6", 1], ["8 &minus; 3 = 5", 1]],
      hint: "Members use only 3, 8 and 24, and only times or divide.",
      why: "24 &divide; 4 = 6 is true, but it belongs to the family of 4 &times; 6. Adding and taking away are not in times families.",
      lv: {
        medium: { q: "The family of 7 &times; 9 = 63. Sort each fact: in the family or not?",
          cards: [["9 &times; 7 = 63", 0], ["63 &divide; 7 = 9", 0], ["63 &divide; 9 = 7", 0], ["7 + 9 = 16", 1], ["72 &divide; 9 = 8", 1], ["63 &minus; 9 = 54", 1]],
          hint: "Members use only 7, 9 and 63, and only times or divide.",
          why: "72 &divide; 9 = 8 is true, but it lives in the family of 8 &times; 9." },
        spicy: { q: "The family of 6 &times; 12 = 72, scaled up and down. Sort each one.",
          cards: [["720 &divide; 12 = 60", 0], ["7.2 &divide; 6 = 1.2", 0], ["60 &times; 12 = 720", 0], ["72 &divide; 8 = 9", 1], ["6 + 12 = 18", 1], ["7.2 &divide; 12 = 6", 1]],
          hint: "Check the numbers are 6, 12 and 72, each maybe ten times bigger or smaller, and still fit together.",
          why: "7.2 &divide; 12 is 0.6, not 6. 72 &divide; 8 = 9 is true, but it belongs to 8 &times; 9." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Divide with a times table", title: "Stuck on a divide? Ask a times question",
      fig: hops(5, 7, "5 times what makes 35?"),
      html: "<p>To work out <b>35 &divide; 5</b>, flip it round: <b>5 times what makes 35?</b></p>" +
        "<p>Count up in fives and keep track: 5, 10, 15, 20, 25, 30, 35. That is 7 jumps.</p>" +
        "<p>So 5 &times; 7 = 35, which means 35 &divide; 5 = 7.</p>",
      lv: {
        medium: { fig: hops(8, 7, "8 times what makes 56?"),
          html: "<p>To work out <b>56 &divide; 8</b>, flip it round: <b>8 times what makes 56?</b></p>" +
            "<p>You could count up in eights: 8, 16, 24, 32, 40, 48, 56. That is 7 jumps.</p>" +
            "<p>Quicker: start from a fact you know. 5 &times; 8 = 40. Two more eights make 56. So 7 &times; 8 = 56, and 56 &divide; 8 = 7.</p>" },
        spicy: { fig: hops(6, 8, "6 times what makes 48?"),
          html: "<p>To work out <b>4.8 &divide; 6</b>, flip it round: <b>6 times what makes 4.8?</b></p>" +
            "<p>Ignore the decimal for a moment. 6 &times; 8 = 48.</p>" +
            "<p>4.8 is ten times smaller than 48, so the answer is ten times smaller than 8: 4.8 &divide; 6 = 0.8.</p>" +
            "<p>Check it: 6 &times; 0.8 = 4.8. It works.</p>" } } },

    { type: "num", topic: "Divide with a times table",
      q: "Your turn, with the steps laid out. Fill both gaps: 5 &times; ___ = 40, so 40 &divide; 5 = ___",
      fig: hops(5, 8, "Count in fives up to 40"),
      boxes: [{ label: "5 &times; ? = 40", a: 8 }, { label: "40 &divide; 5", a: 8 }],
      slips: [[0, 35, "That takes 5 away from 40. Count the jumps of 5 instead."], [0, 200, "That multiplies 40 by 5. Count how many fives make 40."]],
      hint: "Count the jumps on the number line.",
      why: "8 jumps of 5 make 40, so 5 &times; <b>8</b> = 40 and 40 &divide; 5 = <b>8</b>. Both gaps have the same answer.",
      lv: {
        medium: { q: "Your turn, with the steps laid out. Fill both gaps: 9 &times; ___ = 63, so 63 &divide; 9 = ___",
          fig: hops(9, 7, "Count in nines up to 63"),
          boxes: [{ label: "9 &times; ? = 63", a: 7 }, { label: "63 &divide; 9", a: 7 }],
          slips: [[0, 54, "That takes 9 away from 63. How many nines make 63?"], [0, 6, "6 nines are 54. One more nine."]],
          hint: "10 nines would be 90. Or count up: 9, 18, 27...",
          why: "9 &times; <b>7</b> = 63, so 63 &divide; 9 = <b>7</b>." },
        spicy: { q: "Your turn, with the steps laid out. Fill both gaps: 7 &times; ___ = 5.6, so 5.6 &divide; 7 = ___",
          fig: hops(7, 8, "7 times what makes 56?"),
          boxes: [{ label: "7 &times; ? = 5.6", a: 0.8 }, { label: "5.6 &divide; 7", a: 0.8 }],
          slips: [[0, 8, "7 &times; 8 = 56. But 5.6 is ten times smaller, so the answer is too."], [0, 0.08, "One place too far. 7 &times; 0.08 = 0.56."]],
          hint: "7 &times; 8 = 56. Now make it ten times smaller.",
          why: "7 &times; 8 = 56, so 7 &times; <b>0.8</b> = 5.6 and 5.6 &divide; 7 = <b>0.8</b>." } } },

    { type: "num", topic: "Divide with a times table",
      q: "No steps this time. [[Who]] has 30 [[items]] to pack in [[packs]] of 10. How many [[packs]]?",
      boxes: [{ label: "[[Packs]]", a: 3 }],
      slips: [[20, "That takes away one [[pack]]. How many tens make 30?"], [300, "That multiplies. You are sharing 30 into tens."], [40, "That adds. How many tens make 30?"]],
      hint: "10 times what makes 30?",
      why: "10 &times; 3 = 30, so 30 &divide; 10 = <b>3</b> [[packs]].",
      lv: {
        medium: { q: "No steps this time. [[Who]] has 54 [[items]] to pack in [[packs]] of 6. How many [[packs]]?",
          boxes: [{ label: "[[Packs]]", a: 9 }],
          slips: [[48, "That takes away one [[pack]]. How many sixes make 54?"], [324, "That multiplies. You are sharing 54 into sixes."], [8, "8 sixes are 48. One more."]],
          hint: "6 times what makes 54?",
          why: "6 &times; 9 = 54, so 54 &divide; 6 = <b>9</b> [[packs]]." },
        spicy: { q: "No steps this time. [[Who]] has 1320 [[items]] to pack in [[packs]] of 12. How many [[packs]]?",
          boxes: [{ label: "[[Packs]]", a: 110 }],
          slips: [[11, "132 &divide; 12 = 11, but 1320 is ten times bigger."], [1308, "That takes away one [[pack]]. How many twelves make 1320?"], [1100, "One zero too many: ten times 11 is 110."]],
          hint: "12 &times; 11 = 132. Then ten times bigger.",
          why: "12 &times; 11 = 132, so 1320 &divide; 12 = <b>110</b>." } } },

    { type: "mc", topic: "Divide with a times table",
      q: "Which times fact helps you work out 18 &divide; 3?",
      options: ["3 &times; 6 = 18", "3 + 15 = 18", "18 &times; 3 = 54"],
      answer: 0,
      slips: { 1: "That is an adding fact. Divide needs a times fact.", 2: "18 &times; 3 makes it bigger. You want 3 times what makes 18." },
      hint: "3 times what makes 18?",
      why: "3 &times; 6 = 18, so 18 &divide; 3 = 6.",
      lv: {
        medium: { q: "Which times fact helps you work out 63 &divide; 7?", options: ["7 &times; 9 = 63", "7 &times; 8 = 56", "63 &minus; 7 = 56", "63 &times; 7 = 441"],
          slips: { 1: "56 is close, but you need to land on 63.", 2: "That is taking away. Divide needs a times fact.", 3: "That makes it bigger. You want 7 times what makes 63." },
          hint: "7 times what makes 63?", why: "7 &times; 9 = 63, so 63 &divide; 7 = 9." },
        spicy: { q: "Which times fact helps you work out 7.2 &divide; 8?", options: ["8 &times; 9 = 72", "8 &times; 7 = 56", "72 &minus; 8 = 64", "7.2 &times; 8 = 57.6"],
          slips: { 1: "56 is 8 &times; 7. You need to reach 72.", 2: "That is taking away. Divide needs a times fact.", 3: "That multiplies. You want 8 times what makes 7.2." },
          hint: "Ignore the decimal: 8 times what makes 72?", why: "8 &times; 9 = 72, so 8 &times; 0.9 = 7.2 and 7.2 &divide; 8 = 0.9." } } },

    { type: "num", topic: "Divide with a times table", explain: true,
      q: "Jay shares 24 seeds equally between the 4 birds on his fence. How many seeds does each bird get?",
      fig: BIRDS(4, 24),
      boxes: [{ label: "Seeds each", a: 6 }],
      slips: [[20, "That takes 4 away. Share 24 into 4 equal piles."], [96, "That multiplies. Sharing makes each pile smaller."], [28, "That adds. Sharing makes each pile smaller."]],
      hint: "4 times what makes 24?",
      why: "4 &times; 6 = 24, so each bird gets <b>6</b> seeds.",
      lv: {
        medium: { q: "Jay shares 72 seeds equally between the 8 birds on his fence. How many seeds does each bird get?",
          fig: BIRDS(8, 72), boxes: [{ label: "Seeds each", a: 9 }],
          slips: [[64, "That takes 8 away. Share 72 into 8 equal piles."], [8, "8 is the number of birds. 8 times what makes 72?"], [576, "That multiplies. Sharing makes each pile smaller."]],
          hint: "8 times what makes 72?", why: "8 &times; 9 = 72, so each bird gets <b>9</b> seeds." },
        spicy: { q: "Jay has 1.08 kg of seed to share equally between the 9 birds on his fence. How many kilograms does each bird get?",
          fig: BIRDS(9, "1.08 kg of"), boxes: [{ label: "Each bird", a: 0.12, post: "kg" }],
          slips: [[12, "9 &times; 12 = 108, but 1.08 is a hundred times smaller."], [1.2, "One place out. 9 &times; 1.2 = 10.8."], [0.012, "One place too far. 9 &times; 0.012 = 0.108."]],
          hint: "9 &times; 12 = 108. How much smaller is 1.08 than 108?",
          why: "9 &times; 12 = 108, and 1.08 is a hundred times smaller, so each bird gets <b>0.12 kg</b>. That is 120 g: a very well fed bird." } } },

    /* ---------- chunk 4 ---------- */
    { type: "widget", topic: "Factory floor", unscored: true,
      title: "The fact grid",
      html: "<p>Every times fact lives somewhere on this grid. Tap any number to see its rows of dots and its whole family. Try a few you find tricky, if you like.</p>",
      mount: mountGrid },

    { type: "num", topic: "Factory floor",
      q: "Quick fire, in any order you like.",
      boxes: [{ label: "4 &times; 5", a: 20 }, { label: "20 &divide; 4", a: 5 }, { label: "3 &times; 10", a: 30 }, { label: "30 &divide; 3", a: 10 }],
      slips: [[1, 16, "20 &divide; 4: that took 4 away. How many fours make 20?"], [3, 27, "30 &divide; 3: that took 3 away. How many threes make 30?"]],
      hint: "The second one comes from the first, and the fourth from the third.",
      why: "4 &times; 5 = 20 gives 20 &divide; 4 = 5. 3 &times; 10 = 30 gives 30 &divide; 3 = 10.",
      lv: {
        medium: { boxes: [{ label: "7 &times; 8", a: 56 }, { label: "56 &divide; 7", a: 8 }, { label: "9 &times; 6", a: 54 }, { label: "54 &divide; 9", a: 6 }],
          slips: [[0, 54, "7 &times; 8: remember 5, 6, 7, 8. That gives 56."], [2, 56, "9 &times; 6 is 54. 56 is 7 &times; 8."]],
          why: "7 &times; 8 = 56 gives 56 &divide; 7 = 8. 9 &times; 6 = 54 gives 54 &divide; 9 = 6." },
        spicy: { boxes: [{ label: "12 &times; 11", a: 132 }, { label: "4.8 &divide; 6", a: 0.8 }, { label: "90 &times; 7", a: 630 }, { label: "0.36 &divide; 4", a: 0.09 }],
          slips: [[1, 8, "4.8 &divide; 6: 48 &divide; 6 = 8, then ten times smaller."], [3, 0.9, "0.36 &divide; 4: 36 &divide; 4 = 9, then a hundred times smaller."], [2, 63, "90 &times; 7: 9 &times; 7 = 63, then ten times bigger."]],
          hint: "Find the plain times fact underneath, then shift the place value.",
          why: "12 &times; 11 = 132. 48 &divide; 6 = 8, so 4.8 &divide; 6 = 0.8. 9 &times; 7 = 63, so 90 &times; 7 = 630. 36 &divide; 4 = 9, so 0.36 &divide; 4 = 0.09." } } },

    { type: "mc", topic: "Factory floor",
      q: "One of these came off the factory line with a slip. Which one?",
      options: ["4 &times; 5 = 20", "3 &times; 5 = 18", "2 &times; 10 = 20", "5 &times; 5 = 25"],
      answer: 1,
      slips: { 0: "Count in fives four times: 5, 10, 15, 20. That one is fine.", 2: "Two tens make 20. That one is fine.", 3: "Five fives make 25. That one is fine." },
      hint: "Count in fives for each one.",
      why: "3 &times; 5 is 15 (5, 10, 15). 18 would be 3 &times; 6.",
      lv: {
        medium: { options: ["7 &times; 8 = 54", "6 &times; 9 = 54", "12 &times; 4 = 48", "11 &times; 7 = 77"],
          answer: 0, slips: { 1: "6 &times; 9 = 54 is fine. Check the one that also says 54.", 2: "12 &times; 4 = 48 is fine: 10 fours and 2 fours.", 3: "11 &times; 7 = 77 is fine." },
          hint: "5, 6, 7, 8.", why: "7 &times; 8 is 56, not 54. The 54 belongs to 6 &times; 9." },
        spicy: { options: ["12 &times; 7 = 84", "9 &times; 0.8 = 7.2", "11 &times; 12 = 122", "60 &times; 6 = 360"],
          answer: 2, slips: { 0: "12 &times; 7 = 84 is fine: 70 + 14.", 1: "9 &times; 8 = 72, so 9 &times; 0.8 = 7.2. Fine.", 3: "6 &times; 6 = 36, so 60 &times; 6 = 360. Fine." },
          hint: "Split the 12 into 10 and 2 for the one with 11.", why: "11 &times; 12 = 120 + 12 = 132, not 122." } } },

    { type: "order", topic: "Factory floor", stretch: true,
      q: "Put these in order, smallest answer first.",
      items: ["2 &times; 3", "4 &times; 2", "3 &times; 4", "5 &times; 3", "4 &times; 5"],
      hint: "Work each one out first: 6, 8, 12...",
      why: "6, 8, 12, 15, 20.",
      lv: {
        medium: { items: ["6 &times; 6", "7 &times; 6", "9 &times; 5", "8 &times; 6", "7 &times; 8"], hint: "Work each one out first.", why: "36, 42, 45, 48, 56." },
        spicy: { items: ["60 &divide; 12", "0.7 &times; 8", "4.8 &divide; 0.8", "0.9 &times; 9", "72 &divide; 8"], hint: "Work each one out first, then line them up.", why: "60 &divide; 12 = 5, 0.7 &times; 8 = 5.6, 4.8 &divide; 0.8 = 6, 0.9 &times; 9 = 8.1 and 72 &divide; 8 = 9." } } }
  ],

  realWorld: {
    title: "The calculator that time travels with you",
    html: "<p>Packing, sharing, splitting a bill, working out how many boxes you need: people use times facts every day without a calculator.</p>" +
      "<p>And for our big question: if you went back 200 years, there would be no phones and no calculators. The only one that comes with you is in your head. Every times fact you know is something you would still have in 1826.</p>",
    fig: '<svg viewBox="0 0 420 140" role="img" aria-label="Jay stepping out of a time portal">' + A2ART.portal(80, 70, 56) + A2ART.jay(250, 50, 0.85, "wow") +
      A2ART.bubble(298, 6, 116, 52, "7 x 8 = 56\nin any year!", 302) + '</svg>'
  },

  make: {
    title: "Make a fact card",
    intro: "Pick one times fact you want to remember, add its divide facts and a trick that helps. Stick it on the wall or send it to Jay.",
    fields: [
      { id: "fact", label: "My times fact", ph: "7 x 8 = 56", max: 24 },
      { id: "div", label: "A divide fact from its family", ph: "56 / 8 = 7", max: 24 },
      { id: "trick", label: "A trick to remember it", ph: "5, 6, 7, 8: 56 is 7 times 8", max: 60 },
      { id: "name", label: "Factory worker", ph: "Fact maker B5", max: 24 }
    ],
    svg: function(v){
      function e(t){ return String(t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n){ var w = String(t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n){ if(cur.trim()) out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, 2); }
      var fs = String(v.fact).length > 14 ? 34 : 48;
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380">' +
        '<rect width="600" height="380" rx="24" fill="#fff6dc"/>' +
        '<rect x="0" y="0" width="600" height="70" rx="24" fill="#ffd23f"/><rect x="0" y="40" width="600" height="30" fill="#ffd23f"/>' +
        '<path d="M0 70h600" stroke="#141a33" stroke-width="4" stroke-dasharray="20 10"/>' +
        '<text x="36" y="48" font-family="Verdana,Arial,sans-serif" font-size="24" font-weight="700" fill="#141a33" letter-spacing="3">FACT FACTORY</text>' +
        '<text x="300" y="150" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="' + fs + '" font-weight="700" fill="#141a33">' + e(v.fact) + '</text>' +
        '<text x="300" y="200" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="26" fill="#1f9d63">' + e(v.div) + '</text>' +
        wrap(v.trick, 40).map(function(l, k){ return '<text x="300" y="' + (252 + k * 28) + '" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="20" fill="#141a33">' + e(l) + '</text>'; }).join("") +
        '<text x="36" y="350" font-family="Verdana,Arial,sans-serif" font-size="17" fill="#5b6180">Made by: ' + e(v.name) + '</text>' +
        '<g transform="translate(520 330) rotate(-10)"><circle r="34" fill="none" stroke="#e04848" stroke-width="5"/><text y="7" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="17" font-weight="700" fill="#e04848">QC OK</text></g>' +
        '</svg>';
    }
  }
};
})();
