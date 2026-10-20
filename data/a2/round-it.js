/* Base 5 Autumn 2 activity: Round it.
   Maths. Rounding to the nearest whole number, and money and
   measurements to one or two decimal places. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
var M = 'font-family="Courier New,Courier,monospace"';
var P = "&#163;";
function T(x, y, s, size, extra){ extra = extra || ""; return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 15) + '"' + (/fill=/.test(extra) ? "" : ' fill="#141a33"') + ' ' + extra + '>' + s + '</text>'; }

/* a number line from lo to hi in tenths, a dot at v, an arrow to where it rounds */
function nline(lo, hi, v, o){
  o = o || {};
  var pre = o.pre || "", post = o.post || "", x0 = 60, x1 = 460, W = x1 - x0;
  function X(t){ return x0 + (t - lo) / (hi - lo) * W; }
  var s = '<svg viewBox="0 0 520 190" role="img" aria-label="A number line from ' + lo + ' to ' + hi + ' with a dot at ' + v + '">' +
    '<rect width="520" height="190" rx="16" fill="' + (o.bg || "#f4f1ea") + '"/>' +
    '<path d="M' + (x0 - 20) + ' 110H' + (x1 + 20) + '" stroke="#141a33" stroke-width="3"/>';
  for(var k = 0; k <= 10; k++){
    var t = lo + (hi - lo) * k / 10, big = k === 0 || k === 10, mid = k === 5;
    s += '<path d="M' + X(t) + ' ' + (big ? 92 : mid ? 96 : 102) + 'V' + (big ? 128 : mid ? 124 : 118) + '" stroke="#141a33" stroke-width="' + (big ? 3 : 2) + '"/>';
  }
  s += T(X(lo), 154, pre + (o.loLab || lo) + post, 20, 'text-anchor="middle" font-weight="700"') +
    T(X(hi), 154, pre + (o.hiLab || hi) + post, 20, 'text-anchor="middle" font-weight="700"') +
    T(X((lo + hi) / 2), 146, "halfway", 13, 'text-anchor="middle" fill="#5b6180"');
  if(v != null){
    var near = (v - lo) >= (hi - lo) / 2 ? hi : lo;
    s += '<circle cx="' + X(v) + '" cy="110" r="10" fill="#e04848" stroke="#141a33" stroke-width="2"/>' +
      T(X(v), 70, pre + (o.vLab || v) + post, 20, 'text-anchor="middle" font-weight="700" fill="#c03030"');
    if(o.arrow !== false){
      var xa = X(v), xb = X(near), dir = xb > xa ? 1 : -1;
      s += '<path d="M' + (xa + dir * 14) + ' 84Q' + ((xa + xb) / 2) + ' 50 ' + (xb - dir * 4) + ' 84" stroke="#1f9d63" stroke-width="3.5" fill="none"/>' +
        '<path d="M' + (xb - dir * 4) + ' 84l' + (-dir * 4) + ' -12M' + (xb - dir * 4) + ' 84l' + (-dir * 12) + ' -4" stroke="#1f9d63" stroke-width="3.5" stroke-linecap="round"/>';
    }
  }
  if(o.egg) s += o.egg;
  return s + '</svg>';
}

/* cut after the digit you keep, then look next door */
function cut(numStr, keep, result, note){
  var ch = numStr.split(""), cw = 40, x0 = 260 - ch.length * cw / 2;
  var s = '<svg viewBox="0 0 520 200" role="img" aria-label="' + numStr + ' rounds to ' + result + '">' +
    '<rect width="520" height="200" rx="16" fill="#e8f7ff"/>';
  ch.forEach(function(c, k){
    var x = x0 + k * cw + cw / 2, after = k > keep;
    if(k === keep + 1) s += '<circle cx="' + x + '" cy="68" r="22" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>';
    s += '<text x="' + x + '" y="80" ' + M + ' font-size="36" font-weight="700" text-anchor="middle" fill="' + (after ? (k === keep + 1 ? "#141a33" : "#9aa3b8") : "#141a33") + '">' + c + '</text>';
  });
  var cx = x0 + (keep + 1) * cw;
  s += '<path d="M' + cx + ' 30V104" stroke="#e04848" stroke-width="3" stroke-dasharray="6 5"/>' +
    T(cx, 24, "keep | next door", 13, 'text-anchor="middle" fill="#c03030" font-weight="700"') +
    '<path d="M260 112V136M250 126l10 10 10 -10" stroke="#1f9d63" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
    '<text x="260" y="174" ' + M + ' font-size="34" font-weight="700" text-anchor="middle" fill="#1f7a54">' + result + '</text>' +
    (note ? T(500, 186, note, 14, 'text-anchor="end" font-weight="700"') : "") + '</svg>';
  return s;
}

/* a ruler with a pencil along it */
function ruler(len, egg){
  var x0 = 40, cm = 44, s = '<svg viewBox="0 0 520 190" role="img" aria-label="A pencil ' + len + ' centimetres long against a ruler">' +
    '<rect width="520" height="190" rx="16" fill="#f4f1ea"/>' +
    '<rect x="' + (x0 - 14) + '" y="96" width="' + (10 * cm + 28) + '" height="64" rx="6" fill="#ffe08a" stroke="#141a33" stroke-width="2"/>';
  for(var mm = 0; mm <= 100; mm++){
    var x = x0 + mm * cm / 10, big = mm % 10 === 0, half = mm % 5 === 0;
    s += '<path d="M' + x + ' 96v' + (big ? 22 : half ? 15 : 9) + '" stroke="#141a33" stroke-width="' + (big ? 2 : 1) + '"/>';
    if(big) s += T(x, 140, mm / 10, 14, 'text-anchor="middle"');
  }
  var xe = x0 + len * cm;
  s += '<path d="M' + x0 + ' 62h' + (len * cm - 26) + 'l26 12 -26 12h-' + (len * cm - 26) + 'z" fill="#3a8fd6" stroke="#141a33" stroke-width="2"/>' +
    '<path d="M' + (xe - 26) + ' 62l26 12 -26 12z" fill="#f6d1b0" stroke="#141a33" stroke-width="2"/><path d="M' + (xe - 6) + ' 71l6 3 -6 3z" fill="#141a33"/>' +
    '<rect x="' + (x0 - 2) + '" y="62" width="14" height="24" fill="#ff8a9a" stroke="#141a33" stroke-width="2"/>' +
    '<path d="M' + xe + ' 50V100" stroke="#e04848" stroke-width="2" stroke-dasharray="4 3"/>' + T(xe, 44, len + " cm", 15, 'text-anchor="middle" font-weight="700" fill="#c03030"') +
    (egg || "") + '</svg>';
  return s;
}

/* minibuses with 8 seats each, and some people */
function buses(people, seats, n){
  var s = '<svg viewBox="0 0 520 190" role="img" aria-label="' + people + ' people and minibuses with ' + seats + ' seats each">' +
    '<rect width="520" height="190" rx="16" fill="#eef6ff"/><path d="M0 160h520" stroke="#9aa3b8" stroke-width="3"/>', left = people;
  for(var b = 0; b < n; b++){
    var x = 20 + b * 168, on = Math.min(seats, left); left -= on;
    s += '<rect x="' + x + '" y="60" width="150" height="86" rx="14" fill="' + ["#ffd23f", "#19c39a", "#ff8a5c"][b % 3] + '" stroke="#141a33" stroke-width="2.5"/>' +
      '<circle cx="' + (x + 34) + '" cy="150" r="12" fill="#141a33"/><circle cx="' + (x + 116) + '" cy="150" r="12" fill="#141a33"/>';
    for(var k = 0; k < seats; k++){
      var cx = x + 22 + (k % 4) * 35, cy = 82 + Math.floor(k / 4) * 32;
      s += '<rect x="' + (cx - 12) + '" y="' + (cy - 12) + '" width="24" height="24" rx="5" fill="#fff" stroke="#141a33" stroke-opacity=".4"/>' +
        (k < on ? '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="#2f6f8f"/>' : "");
    }
    s += T(x + 75, 46, "Bus " + (b + 1) + ": " + on + " on", 14, 'text-anchor="middle" font-weight="700"');
  }
  return s + '</svg>';
}

var START =
  '<svg viewBox="0 0 520 200" role="img" aria-label="Jay next to a number line, with 3.7 rolling towards 4">' +
  '<rect width="520" height="200" rx="16" fill="#eef6ff"/>' +
  A2ART.jay(80, 96, 0.85, "smile") +
  '<path d="M170 150H500" stroke="#141a33" stroke-width="3"/>' +
  '<path d="M190 136v28M470 136v28" stroke="#141a33" stroke-width="3"/>' +
  T(190, 186, "3", 20, 'text-anchor="middle" font-weight="700"') + T(470, 186, "4", 20, 'text-anchor="middle" font-weight="700"') +
  '<circle cx="386" cy="130" r="18" fill="#e04848" stroke="#141a33" stroke-width="2"/>' + T(386, 136, "3.7", 13, 'text-anchor="middle" font-weight="700" fill="#fff"') +
  '<path d="M410 110q30 -30 56 4" stroke="#1f9d63" stroke-width="3.5" fill="none"/><path d="M466 114l-2 -13M466 114l-12 -3" stroke="#1f9d63" stroke-width="3.5" stroke-linecap="round"/>' +
  A2ART.egg(A2ART.bird(470, 40, 0.65, "#ffd23f"), "A bird, rounded to the nearest bird. Still one bird.") +
  '</svg>';

/* widget: drag the dot, see where it rounds */
function slider(el, api){
  var d = api.data, sp = api.level === "spicy";
  d.moves = d.moves || 0;
  var lo = sp ? 300 : 30, hi = sp ? 500 : 50, div = sp ? 100 : 10;
  if(d.v == null || d.v < lo || d.v > hi) d.v = sp ? 372 : 37;
  el.innerHTML = '<div class="rnd-svg"></div>' +
    '<label style="display:block;max-width:520px;margin:6px auto"><span class="tiny">Slide the dot</span>' +
    '<input type="range" min="' + lo + '" max="' + hi + '" step="1" value="' + d.v + '" style="width:100%" aria-label="Move the dot along the number line"></label>' +
    '<p aria-live="polite" style="text-align:center;font-size:1.1rem;min-height:2.6em;margin:6px 0"></p>';
  var box = el.querySelector(".rnd-svg"), inp = el.querySelector("input"), out = el.querySelector("p");
  function fmt(i){ return sp ? (i / 100).toFixed(2) : (i / 10).toFixed(1); }
  function draw(){
    var i = d.v, whole = Math.floor(i / div), rest = i % div, up = rest >= div / 2, r = up ? whole + 1 : whole;
    var x0 = 60, x1 = 460, X = function(t){ return x0 + (t - lo) / (hi - lo) * (x1 - x0); };
    var s = '<svg viewBox="0 0 520 150" style="width:100%;max-width:560px;display:block;margin:0 auto" role="img" aria-label="Number line with the dot at ' + fmt(i) + '">' +
      '<rect width="520" height="150" rx="14" fill="#f4f1ea"/><path d="M40 90H480" stroke="#141a33" stroke-width="3"/>';
    for(var t = lo; t <= hi; t += div / 10){
      var big = t % div === 0, mid = t % (div / 2) === 0;
      s += '<path d="M' + X(t) + ' ' + (big ? 72 : mid ? 76 : 82) + 'V' + (big ? 108 : mid ? 104 : 98) + '" stroke="#141a33" stroke-width="' + (big ? 3 : 1.5) + '"/>';
      if(big) s += '<text x="' + X(t) + '" y="134" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="18" font-weight="700" fill="' + (t / div === r ? "#1f7a54" : "#141a33") + '">' + (t / div) + '</text>';
    }
    s += '<path d="M' + X(i) + ' 90Q' + ((X(i) + X(r * div)) / 2) + ' 30 ' + X(r * div) + ' 74" stroke="#1f9d63" stroke-width="3" fill="none" stroke-dasharray="6 4"/>' +
      '<circle cx="' + X(i) + '" cy="90" r="11" fill="#e04848" stroke="#141a33" stroke-width="2"/>' +
      '<text x="' + X(i) + '" y="50" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="18" font-weight="700" fill="#c03030">' + fmt(i) + '</text></svg>';
    box.innerHTML = s;
    var digit = sp ? Math.floor(rest / 10) : rest;
    out.innerHTML = rest === div / 2 ? "<b>" + fmt(i) + "</b> is exactly halfway. The rule says go up: <b>" + r + "</b>." :
      rest === 0 ? "<b>" + fmt(i) + "</b> is already a whole number." :
      "<b>" + fmt(i) + "</b>: the digit after the point is " + digit + ", so it rounds " + (up ? "up" : "down") + " to <b>" + r + "</b>." +
      (sp ? " To one decimal place it is <b>" + (Math.round(i / 10) / 10).toFixed(1) + "</b>." : "");
  }
  inp.oninput = function(){
    d.v = +inp.value; d.moves++; draw();
    try{ api.save(); }catch(e){}
    if(d.moves >= 3 && !api.resolved()) api.done("done");
  };
  draw();
}

function esc(t){ return String(t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n){ if(cur.trim()) out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }

(window.A2PACKS = window.A2PACKS || {})["round-it"] = {
  a2: true,
  id: "a2-round-it",
  title: "Round it",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 20,
  line: "Is it nearer this one or that one? Rounding whole numbers, money and measurements.",
  blurb: "Rounding to the nearest whole number, and money and measurements to one or two decimal places. Four short chunks, and a rounding rule card to make at the end.",
  note: "Rounding: whole numbers, money and measurements. Four five minute chunks, and a rule card to make at the end. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Pebble", line: "Pebble: nearest whole number, nearest pound and nearest centimetre, with number lines." },
    { id: "medium", name: "Snowball", line: "Snowball: nearest whole, nearest penny, and one decimal place." },
    { id: "spicy", name: "Planet", line: "Planet: two decimal places, sneaky nines, and sharing a bill fairly." }
  ],
  themes: {
    time: { name: "Time travel", w: { load: "the time machine battery", long: "the portal", buy: "a portal pass", shop: "the museum shop", who: "the time traveller", group: "time travellers" } },
    football: { name: "Football", w: { load: "the kit bag", long: "the goal", buy: "a match ticket", shop: "the club shop", who: "the striker", group: "fans" } },
    horror: { name: "Horror", w: { load: "the giant pumpkin", long: "the haunted corridor", buy: "a ghost tour ticket", shop: "the haunted gift shop", who: "the night porter", group: "ghost hunters" } },
    fishing: { name: "Fishing", w: { load: "the carp", long: "the fishing rod", buy: "a bag of bait", shop: "the tackle shop", who: "the angler", group: "anglers" } },
    music: { name: "Music", w: { load: "the drum kit case", long: "the stage", buy: "a show ticket", shop: "the theatre shop", who: "the singer", group: "cast members" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: START,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Nearest whole number", title: "Which one is it nearer?",
      fig: nline(3, 4, 3.7),
      html: "<p>3.7 sits between 3 and 4. It is <b>nearer to 4</b>, so 3.7 rounds to <b>4</b>.</p>" +
        "<p>The shortcut: look at the digit just after the point. <b>5 or more, go up. 4 or less, stay put.</b></p>" +
        "<p>Exactly halfway, like 3.5? The rule says go up: 4.</p>",
      lv: {
        mild: { html: "<p>3.7 is between 3 and 4.</p><p>It is <b>nearer to 4</b>. So 3.7 rounds to <b>4</b>.</p><p>Look at the digit after the point. <b>5 or more, go up.</b> 4 or less, stay put.</p>" },
        spicy: { fig: nline(19, 20, 19.6),
          html: "<p>Look at the digit just after the point. <b>5 or more, go up. 4 or less, stay put.</b> Only that digit matters: 12.49 rounds to 12, because the 4 decides, not the 9.</p>" +
            "<p>Going up can carry over: 19.6 rounds up to <b>20</b>, and 99.5 rounds up to <b>100</b>.</p>" } } },

    { type: "widget", topic: "Nearest whole number", unscored: true,
      title: "Slide and see",
      html: "<p>Slide the dot along the line and watch where it rounds to. Try to find the exact spot where it flips, if you like.</p>",
      mount: slider,
      report: function(d){ return d && d.moves ? "Slide and see: moved the dot " + d.moves + " times." : ""; } },

    { type: "mc", topic: "Nearest whole number",
      q: "Which whole number is 6.3 nearest to?",
      fig: nline(6, 7, 6.3, { arrow: false }),
      options: ["6", "7", "6.5"],
      answer: 0,
      slips: { 1: "Look at the line: 6.3 is closer to 6. The 3 is 4 or less, so it stays put.", 2: "6.5 is not a whole number. Pick 6 or 7." },
      hint: "Is the dot nearer the 6 or the 7?",
      why: "The digit after the point is 3, which is 4 or less, so it stays at <b>6</b>.",
      lv: {
        mild: { options: ["6", "7"], slips: { 1: "Look at the line: the dot is closer to 6." } },
        spicy: { q: "Round 49.62 to the nearest whole number.", fig: nline(49, 50, 49.62, { arrow: false }),
          options: ["50", "49", "49.6", "49.7"],
          slips: { 1: "The digit after the point is 6, which is 5 or more, so go up.", 2: "That is one decimal place. A whole number has nothing after the point.", 3: "That is one decimal place, and it rounded up. A whole number has nothing after the point." },
          hint: "Only the digit straight after the point decides.",
          why: "6 is 5 or more, so 49 goes up to <b>50</b>." } } },

    { type: "sort", topic: "Nearest whole number",
      q: "Rounding to the nearest whole number: up or stay put?",
      buckets: ["Goes up", "Stays put"],
      cards: [["4.2", 1], ["7.8", 0], ["1.5", 0], ["9.4", 1], ["3.6", 0], ["5.1", 1]],
      hint: "Look at the digit after the point. 5 or more goes up.",
      why: "7.8, 1.5 and 3.6 go up (8, 5 and 6 are 5 or more). 4.2, 9.4 and 5.1 stay put.",
      lv: {
        mild: { cards: [["4.2", 1], ["7.8", 0], ["9.4", 1], ["3.6", 0]] },
        spicy: { cards: [["12.49", 1], ["12.51", 0], ["8.5", 0], ["99.7", 0], ["0.45", 1], ["6.05", 1]],
          why: "Only the first digit after the point decides. 12.49 has a 4, so it stays at 12, even with a 9 behind it. 0.45 and 6.05 stay put too." } } },

    { type: "num", topic: "Nearest whole number",
      q: "[[Load]] weighs 8.6 kg. Round it to the nearest kilogram.",
      boxes: [{ label: "About", a: 9, post: "kg" }],
      slips: [[8, "The digit after the point is 6, which is 5 or more, so go up."], [8.6, "That is the exact weight. Rounded to the nearest kilogram it has nothing after the point."]],
      hint: "Is 8.6 nearer 8 or 9?",
      why: "6 is 5 or more, so it goes up: about <b>9 kg</b>.",
      lv: {
        mild: { q: "[[Load]] weighs 5.8 kg. Round it to the nearest kilogram.", fig: nline(5, 6, 5.8, { arrow: false, post: " kg" }),
          boxes: [{ label: "About", a: 6, post: "kg" }],
          slips: [[5, "Look at the line: 5.8 is much closer to 6."], [5.8, "That is the exact weight. Rounded, it has nothing after the point."]],
          hint: "Is the dot nearer 5 or 6?",
          why: "5.8 is nearer 6: about <b>6 kg</b>." },
        spicy: { q: "[[Load]] weighs 19.72 kg. Round it to the nearest kilogram.",
          boxes: [{ label: "About", a: 20, post: "kg" }],
          slips: [[19, "The 7 after the point says go up, and 19 goes up to 20."], [19.7, "That is one decimal place. Nearest kilogram means a whole number."], [110, "Going up from 19 makes 20, not 110."]],
          hint: "The digit after the point is 7. What comes after 19?",
          why: "7 is 5 or more, so 19 goes up to <b>20 kg</b>." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Money", title: "Nearest pound, nearest penny",
      fig: nline(4, 5, 4.68, { pre: P, loLab: "4.00", hiLab: "5.00", vLab: "4.68" }),
      html: "<p><b>Nearest pound:</b> look at the pence. 50p or more, go up. " + P + "4.68 rounds to <b>" + P + "5</b>.</p>" +
        "<p><b>Nearest penny</b> means two decimal places. Prices sometimes have more digits, like sharing " + P + "10 between 3 people: " + P + "3.3333... Keep two digits after the point, look at the next one: 3, so stay put. <b>" + P + "3.33</b>.</p>",
      lv: {
        mild: { html: "<p><b>Nearest pound:</b> look at the pence.</p><p><b>50p or more, go up.</b> 49p or less, stay put.</p><p>" + P + "4.68 has 68p, so it rounds up to <b>" + P + "5</b>.</p>" },
        spicy: { html: "<p><b>Nearest penny</b> means two decimal places. Keep two digits after the point and look at the third: 5 or more, go up.</p>" +
          "<p>Sharing " + P + "25 between 3: " + P + "8.3333... rounds to <b>" + P + "8.33</b>. But 3 " + P + "8.33 is " + P + "24.99, a penny short. In real life somebody pays " + P + "8.34.</p>" +
          "<p>Watch the nines: " + P + "12.995 to the nearest penny goes up to <b>" + P + "13.00</b>.</p>" } } },

    { type: "mc", topic: "Money",
      q: "Round " + P + "7.49 to the nearest pound.",
      options: [P + "7", P + "8", P + "7.50"],
      answer: 0,
      slips: { 1: "49p is less than 50p, so it stays at " + P + "7.", 2: "That is the nearest 50p. Nearest pound means whole pounds." },
      hint: "Is 49p more or less than 50p?",
      why: "49p is less than 50p, so it stays at <b>" + P + "7</b>. Just.",
      lv: {
        mild: { q: "Round " + P + "3.80 to the nearest pound.", options: [P + "4", P + "3", P + "3.80"],
          slips: { 1: "80p is more than 50p, so go up.", 2: "That is the exact price. Nearest pound means whole pounds." },
          hint: "Is 80p more or less than 50p?",
          why: "80p is more than 50p, so it goes up to <b>" + P + "4</b>." },
        spicy: { q: "Round " + P + "12.995 to the nearest penny.", options: [P + "13.00", P + "12.99", P + "12.90", P + "13.10"],
          slips: { 1: "The third digit is 5, so go up. 12.99 goes up to 13.00.", 2: "Only one digit should change at the end, and here the 9s carry all the way.", 3: "Going up one penny from 12.99 gives 13.00, not 13.10." },
          hint: "Keep two digits after the point: 12.99. The next digit is 5.",
          why: "12.99 goes up a penny, and the nines carry: <b>" + P + "13.00</b>." } } },

    { type: "num", topic: "Money",
      q: P + "10 shared between 3 people is " + P + "3.3333... Round to the nearest penny, one step at a time.",
      boxes: [{ label: "The third digit after the point is", a: 3 }, { label: "Nearest penny: " + P, a: 3.33 }],
      slips: [[1, 3.34, "The next digit is 3, which is 4 or less, so stay put."], [1, 3.3, "That is one decimal place. Pennies need two."], [1, 3, "That is the nearest pound. Pennies need two decimal places."]],
      hint: "Keep 3.33, then look at the next digit.",
      why: "3.33 and the next digit is 3, so it stays put: <b>" + P + "3.33</b>.",
      lv: {
        mild: { q: "[[Buy]] costs " + P + "6.72. Round to the nearest pound, one step at a time.",
          fig: nline(6, 7, 6.72, { pre: P, loLab: "6.00", hiLab: "7.00", vLab: "6.72", arrow: false }),
          boxes: [{ label: "How many pence?", a: 72, post: "p" }, { label: "Nearest pound: " + P, a: 7 }],
          slips: [[1, 6, "72p is more than 50p, so go up."], [1, 6.72, "That is the exact price. Nearest pound means whole pounds."]],
          hint: "72p: is that 50p or more?",
          why: "72p is 50p or more, so it goes up to <b>" + P + "7</b>." },
        spicy: { q: P + "25 shared between 3 friends is " + P + "8.3333... Round to the nearest penny. Then: if everyone pays that, how much short is the total?",
          boxes: [{ label: "Nearest penny: " + P, a: 8.33 }, { label: "Short by", a: 1, post: "p" }],
          slips: [[0, 8.34, "The third digit is 3, so the rule says stay put."], [0, 8.3, "That is one decimal place. Pennies need two."], [1, 0.01, "That is in pounds. How many pence is 0.01 pounds?"]],
          hint: "3 " + P + "8.33 = " + P + "24.99.",
          why: "<b>" + P + "8.33</b> each makes " + P + "24.99, so it is <b>1p</b> short. Someone pays " + P + "8.34." } } },

    { type: "num", topic: "Money",
      q: "At [[shop]], your [[buy]] works out at " + P + "4.236. Round it to the nearest penny.",
      boxes: [{ label: P, a: 4.24 }],
      slips: [[4.23, "The next digit is 6, which is 5 or more, so go up."], [4.2, "That is one decimal place. Pennies need two."], [4, "That is the nearest pound. Pennies need two decimal places."]],
      hint: "Keep 4.23, then look at the next digit.",
      why: "4.23 and the next digit is 6, so it goes up: <b>" + P + "4.24</b>.",
      lv: {
        mild: { q: "At [[shop]], [[buy]] costs " + P + "9.51. Round it to the nearest pound.",
          boxes: [{ label: P, a: 10 }],
          slips: [[9, "51p is more than 50p, so go up."], [9.51, "That is the exact price. Nearest pound means whole pounds."]],
          hint: "51p: is that 50p or more?",
          why: "51p is 50p or more, so 9 goes up to <b>" + P + "10</b>." },
        spicy: { q: P + "47 split between 6 friends at [[shop]] is " + P + "7.8333... Round to the nearest penny.",
          boxes: [{ label: P, a: 7.83 }],
          slips: [[7.84, "The third digit is 3, so the rule says stay put."], [7.8, "That is one decimal place. Pennies need two."], [8, "That is the nearest pound."]],
          hint: "Keep 7.83 and look at the next digit.",
          why: "7.83, next digit 3, stay put: <b>" + P + "7.83</b>." } } },

    { type: "multi", topic: "Money", explain: true,
      q: "Which prices round to " + P + "5 to the nearest pound? Pick all that do.",
      fig: '<svg viewBox="0 0 360 130" role="img" aria-label="Bonnie the poodle next to a price tag">' + A2ART.bonnie(90, 70, 1, "sit") +
        '<g transform="rotate(-8 250 60)"><rect x="180" y="30" width="140" height="64" rx="10" fill="#fffbe0" stroke="#141a33" stroke-width="2.5"/><circle cx="198" cy="62" r="6" fill="#f4f1ea" stroke="#141a33" stroke-width="2"/>' +
        T(214, 58, "Dog treats", 14) + T(214, 82, P + "4.95", 18, 'font-weight="700"') + '</g>' + '</svg>',
      options: [P + "4.50", P + "5.49", P + "4.49", P + "5.50", P + "4.95"],
      answers: [0, 1, 4],
      hint: "Anything from " + P + "4.50 up to " + P + "5.49 rounds to " + P + "5.",
      why: P + "4.50 and " + P + "4.95 go up to " + P + "5. " + P + "5.49 stays at " + P + "5. " + P + "4.49 stays at " + P + "4 and " + P + "5.50 goes up to " + P + "6. Bonnie's treats are about " + P + "5. Outrageous.",
      lv: {
        mild: { options: [P + "4.80", P + "5.20", P + "3.90", P + "6.10"], answers: [0, 1],
          hint: "Which prices are nearest to " + P + "5?",
          why: P + "4.80 goes up to " + P + "5 and " + P + "5.20 stays at " + P + "5. The others round to " + P + "4 and " + P + "6." },
        spicy: { q: "Which of these round to " + P + "5.00 to the nearest penny? Pick all that do.",
          options: [P + "4.995", P + "5.004", P + "4.994", P + "5.005"], answers: [0, 1],
          hint: "Keep two digits after the point, then look at the third.",
          why: "4.995 goes up to 5.00 and 5.004 stays at 5.00. 4.994 stays at 4.99 and 5.005 goes up to 5.01." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Measurements", title: "Keep, look next door, decide",
      fig: cut("1.46", 2, "1.5 m", "1 decimal place"),
      html: "<p>Rounding a measurement to <b>1 decimal place</b> takes three steps.</p>" +
        "<p><b>1 Keep</b> one digit after the point: 1.4. <b>2 Look next door</b>: 6. <b>3 Decide</b>: 5 or more, so the 4 goes up. 1.46 m is <b>1.5 m</b>.</p>" +
        "<p>If it rounds to a zero, keep the zero: 2.03 kg to 1 decimal place is <b>2.0 kg</b>. The zero shows how exact you were.</p>",
      lv: {
        mild: { fig: ruler(8.4, A2ART.egg(A2ART.bird(470, 36, 0.6, "#3a8fd6"), "A bird measured in centimetres. About 14 cm, nearest whole bird.")),
          html: "<p>This pencil is 8.4 cm long.</p><p>Look at the digit after the point: 4. That is 4 or less, so <b>stay put</b>.</p><p>To the nearest centimetre, the pencil is <b>8 cm</b>.</p>" },
        spicy: { fig: cut("3.996", 3, "4.00 m", "2 decimal places"),
          html: "<p>Same three steps for <b>2 decimal places</b>: keep two digits after the point, look next door, decide.</p>" +
            "<p>3.996 m: keep 3.99, next door is 6, so go up. 3.99 goes up to <b>4.00</b>, because the nines carry.</p>" +
            "<p>Write 4.00, not 4: the two zeros show it is accurate to 2 decimal places, the nearest centimetre.</p>" } } },

    { type: "num", topic: "Measurements",
      q: "Round 2.73 m to 1 decimal place. Use the three steps.",
      boxes: [{ label: "Keep:", a: 2.7 }, { label: "Next door digit:", a: 3 }, { label: "Answer:", a: 2.7, post: "m" }],
      slips: [[2, 2.8, "The next door digit is 3, which is 4 or less, so stay put."], [2, 3, "That is the nearest whole metre. Keep one digit after the point."]],
      hint: "Keep 2.7. Next door is 3.",
      why: "Keep 2.7, next door 3, stay put: <b>2.7 m</b>.",
      lv: {
        mild: { q: "The pencil is 8.4 cm long. Round it to the nearest centimetre.", fig: ruler(8.4),
          boxes: [{ label: "Digit after the point:", a: 4 }, { label: "Answer:", a: 8, post: "cm" }],
          slips: [[1, 9, "The digit after the point is 4, so stay put."], [1, 8.4, "That is the exact length. Nearest centimetre has nothing after the point."]],
          hint: "Look at the ruler. Is the end nearer 8 or 9?",
          why: "4 is 4 or less, so stay put: <b>8 cm</b>." },
        spicy: { q: "Round 5.637 kg to 2 decimal places. Use the three steps.",
          boxes: [{ label: "Keep:", a: 5.63 }, { label: "Next door digit:", a: 7 }, { label: "Answer:", a: 5.64, post: "kg" }],
          slips: [[2, 5.63, "The next door digit is 7, which is 5 or more, so go up."], [2, 5.6, "That is 1 decimal place. Keep two digits after the point."]],
          hint: "Keep 5.63. Next door is 7.",
          why: "Keep 5.63, next door 7, go up: <b>5.64 kg</b>." } } },

    { type: "num", topic: "Measurements",
      q: "[[Long]] measures 4.85 m. Round it to 1 decimal place.",
      boxes: [{ label: "Answer:", a: 4.9, post: "m" }],
      slips: [[4.8, "Next door is 5. 5 or more goes up."], [5, "That is the nearest whole metre. Keep one digit after the point."], [4.85, "That is the exact length. 1 decimal place means one digit after the point."]],
      hint: "Keep 4.8, then look next door.",
      why: "Keep 4.8, next door 5, go up: <b>4.9 m</b>.",
      lv: {
        mild: { q: "[[Long]] measures 3.6 m. Round it to the nearest metre.", fig: nline(3, 4, 3.6, { post: " m", arrow: false }),
          boxes: [{ label: "Answer:", a: 4, post: "m" }],
          slips: [[3, "The digit after the point is 6, so go up."], [3.6, "That is the exact length. Nearest metre has nothing after the point."]],
          hint: "Is 3.6 nearer 3 or 4?",
          why: "6 is 5 or more, so go up: <b>4 m</b>." },
        spicy: { q: "[[Long]] measures 6.996 m. Round it to 2 decimal places.",
          boxes: [{ label: "Answer:", a: 7, post: "m", show: "7.00" }],
          slips: [[6.99, "Next door is 6, so 6.99 goes up, and the nines carry all the way to 7.00."], [6.1, "Going up from 6.99 carries the nines: 7.00."], [7.1, "Going up one hundredth from 6.99 lands on 7.00."]],
          hint: "Keep 6.99. Next door is 6. What is one hundredth more than 6.99?",
          why: "6.99 goes up a hundredth to <b>7.00 m</b>. Write the zeros to show 2 decimal places." } } },

    { type: "mc", topic: "Measurements",
      q: "What is 2.03 kg rounded to 1 decimal place?",
      options: ["2.0 kg", "2 kg", "2.1 kg", "2.03 kg"],
      answer: 0,
      slips: { 1: "Same size, but 1 decimal place means one digit after the point, so write the zero: 2.0.", 2: "Next door is 3, which is 4 or less, so stay put.", 3: "That is the exact weight, with 2 decimal places." },
      hint: "Keep one digit after the point: 2.0. Next door is 3.",
      why: "Keep 2.0, next door 3, stay put: <b>2.0 kg</b>. The zero shows it is to 1 decimal place.",
      lv: {
        mild: { q: "What is 6.2 cm rounded to the nearest centimetre?", options: ["6 cm", "7 cm", "6.2 cm"],
          slips: { 1: "The digit after the point is 2, so stay put.", 2: "That is the exact length." },
          hint: "Is 6.2 nearer 6 or 7?",
          why: "2 is 4 or less: <b>6 cm</b>." },
        spicy: { q: "What is 0.0951 rounded to 2 decimal places?", options: ["0.10", "0.09", "0.1", "0.095"],
          slips: { 1: "Next door is 5, so the 9 goes up, and it carries.", 2: "Same size, but 2 decimal places needs two digits after the point: 0.10.", 3: "That is 3 decimal places." },
          hint: "Keep 0.09. Next door is 5.",
          why: "0.09 goes up a hundredth to <b>0.10</b>. Keep the zero to show 2 decimal places." } } },

    { type: "match", topic: "Measurements",
      q: "Match each measurement to its rounded partner (1 decimal place).",
      pairs: [["3.14 m", "3.1 m"], ["3.18 m", "3.2 m"], ["2.96 m", "3.0 m"], ["3.25 m", "3.3 m"]],
      hint: "Keep one digit after the point, then look next door.",
      why: "3.14 stays at 3.1. 3.18 goes up to 3.2. 2.96 goes up to 3.0. 3.25 goes up to 3.3.",
      lv: {
        mild: { q: "Match each measurement to the nearest whole centimetre.",
          pairs: [["3.2 cm", "3 cm"], ["3.8 cm", "4 cm"], ["4.5 cm", "5 cm"], ["6.1 cm", "6 cm"]],
          why: "3.2 stays at 3, 3.8 goes up to 4, 4.5 goes up to 5, 6.1 stays at 6." },
        spicy: { q: "Match each measurement to its rounded partner (2 decimal places).",
          pairs: [["1.234 kg", "1.23 kg"], ["1.235 kg", "1.24 kg"], ["1.299 kg", "1.30 kg"], ["1.2049 kg", "1.20 kg"]],
          why: "Only the third digit after the point decides. 1.2049 has a 4 there, so it stays at 1.20." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Round it in real life", title: "Sometimes real life decides",
      fig: buses(17, 8, 3),
      html: "<p>17 people, minibuses with 8 seats. 17 " + "&#247;" + " 8 = 2.125. The rule says 2, but 2 buses only fit 16. Someone gets left behind. You need <b>3</b>.</p>" +
        "<p>When you need enough of something (buses, boxes, tins of paint), <b>always round up</b>.</p>" +
        "<p>When you are counting how many you can afford, <b>always round down</b>: you cannot buy 3.3 tickets.</p>",
      lv: {
        mild: { html: "<p>17 people. Each minibus has 8 seats.</p><p>2 buses fit 16 people. One person is left over, so you need <b>3 buses</b>.</p><p>If you need enough of something, <b>round up</b>.</p>" } } },

    { type: "num", topic: "Round it in real life", explain: true,
      q: "21 [[group]] need minibuses with 8 seats each. 21 &#247; 8 = 2.625. How many minibuses?",
      boxes: [{ label: "Minibuses", a: 3 }],
      slips: [[2, "2 minibuses only seat 16. Some [[group]] get left behind."], [2.6, "You cannot book 2.6 minibuses. Pick a whole number that fits everyone."], [2.625, "You cannot book part of a minibus."]],
      hint: "How many people fit in 2 minibuses? Is that enough?",
      why: "2 minibuses seat 16, not enough. <b>3</b> seat 24, so everyone gets on.",
      lv: {
        mild: { q: "You have " + P + "10. [[Buy]] costs " + P + "3. 10 &#247; 3 = 3.33. How many can you buy?",
          boxes: [{ label: "How many", a: 3 }],
          slips: [[4, "4 would cost " + P + "12. You only have " + P + "10."], [3.33, "You cannot buy part of one. Pick a whole number."]],
          hint: "3 cost " + P + "9. Could you afford a 4th?",
          why: "3 cost " + P + "9, and a 4th would cost " + P + "12. So <b>3</b>, with " + P + "1 left over." },
        spicy: { q: "One tin of paint covers 12.5 square metres. The wall at [[shop]] is 41 square metres. 41 &#247; 12.5 = 3.28. How many tins?",
          boxes: [{ label: "Tins", a: 4 }],
          slips: [[3, "3 tins cover 37.5 square metres. A bit of wall would be left bare."], [3.28, "Shops do not sell 0.28 of a tin."], [3.3, "Shops do not sell part of a tin."]],
          hint: "Would 3 tins cover all 41 square metres?",
          why: "3 tins cover 37.5 square metres, not enough. You need <b>4</b>, even though the rule would say 3." } } },

    { type: "mc", topic: "Round it in real life",
      q: "Which one should you round <b>up</b>, whatever the digit?",
      options: ["Boxes needed to pack 50 cakes, 12 to a box", "How many " + P + "3 tickets you can buy with " + P + "20", "Your height to the nearest centimetre"],
      answer: 0,
      slips: { 1: "With money, you can only buy whole ones you can afford, so that one rounds down.", 2: "Height follows the normal rule: 5 or more goes up, 4 or less stays." },
      hint: "Which one needs enough of something?",
      why: "50 &#247; 12 = 4.17, but 4 boxes only hold 48 cakes. You need 5 boxes.",
      lv: {
        mild: { options: ["Boxes needed to pack 50 cakes, 12 to a box", "Your height to the nearest centimetre"],
          slips: { 1: "Height follows the normal rule." } },
        spicy: { q: "Which one should you round <b>down</b>, whatever the digit?",
          options: ["How many " + P + "3 tickets you can buy with " + P + "20", "Coaches for 130 fans, 52 to a coach", "Tins of paint for a wall", "The length of the [[long]] to 1 decimal place"],
          slips: { 1: "Coaches need enough seats, so round up.", 2: "Paint needs to cover the whole wall, so round up.", 3: "A length follows the normal rule." },
          hint: "Which one is about what you can afford?",
          why: "20 &#247; 3 = 6.67, but you cannot afford a 7th ticket (" + P + "21). Round <b>down</b> to 6." } } },

    { type: "num", topic: "Round it in real life",
      q: "[[Who]] measured [[long]] as 3.468 m. Round it two ways.",
      boxes: [{ label: "Nearest whole metre:", a: 3 }, { label: "1 decimal place:", a: 3.5 }],
      slips: [[1, 3.4, "Next door to the 4 is 6, so go up to 3.5."], [0, 4, "The digit after the point is 4, so stay put at 3."], [1, 3.47, "That is 2 decimal places."]],
      hint: "Nearest whole: look at the 4. One decimal place: keep 3.4, look at the 6.",
      why: "Nearest whole: <b>3 m</b>. 1 decimal place: <b>3.5 m</b>. Different questions, different answers.",
      lv: {
        mild: { q: "[[Who]] bought two things: " + P + "4.39 and " + P + "2.85. Round each to the nearest pound.",
          boxes: [{ label: P + "4.39 is about " + P, a: 4 }, { label: P + "2.85 is about " + P, a: 3 }],
          slips: [[0, 5, "39p is less than 50p, so stay put."], [1, 2, "85p is more than 50p, so go up."]],
          hint: "Look at the pence each time. 50p or more goes up.",
          why: "39p stays: <b>" + P + "4</b>. 85p goes up: <b>" + P + "3</b>. About " + P + "7 altogether." },
        spicy: { q: "[[Who]] measured [[long]] as 7.0649 m. Round it three ways.",
          boxes: [{ label: "Nearest whole metre:", a: 7 }, { label: "1 decimal place:", a: 7.1 }, { label: "2 decimal places:", a: 7.06 }],
          slips: [[1, 7, "Keep 7.0, next door is 6, so go up to 7.1."], [2, 7.07, "Keep 7.06, next door is 4, so stay put."], [2, 7.065, "That is 3 decimal places."]],
          hint: "Each time: keep, look next door, decide.",
          why: "<b>7 m</b>, <b>7.1 m</b> and <b>7.06 m</b>. Each one is a different level of exactness." } } }
  ],

  realWorld: {
    title: "Rounding is everywhere",
    html: "<p>Shop prices per kilogram, petrol at 147.9p a litre, a weather forecast of 13 degrees, a recipe that says about 250 g: all rounded. Splitting a bill with friends is rounding to the nearest penny, and booking enough taxis is rounding up.</p>" +
      "<p>For our big question: if we could time travel, should we? Go back before February 1971 and Britain did not use decimal money at all. There were pounds, shillings and pence, with 240 pennies in a pound. Rounding to the nearest penny would be a whole different puzzle.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to a time portal, with a speech bubble">' + A2ART.portal(70, 75, 54) + A2ART.jay(220, 52, 0.8, "wow") +
      A2ART.bubble(270, 8, 140, 56, "240 pennies\nin a pound?", 274) + '</svg>'
  },

  make: {
    title: "Make a rounding rule card",
    intro: "Your rounding rule in your own words, with an example. Stick it inside your maths book or send it to Jay.",
    fields: [
      { id: "rule", label: "My rounding rule", ph: "5 or more, go up. 4 or less, stay put.", max: 70 },
      { id: "eg", label: "My example", ph: "4.68 kg is about 5 kg", max: 40 },
      { id: "life", label: "When I would round up anyway", ph: "Booking enough minibuses", max: 50 },
      { id: "name", label: "Card by", ph: "The Rounder", max: 24 }
    ],
    svg: function(v){
      function tx(x, y, t, sz, w, c, a){ return '<text x="' + x + '" y="' + y + '" font-family="Verdana,Arial,sans-serif" font-size="' + sz + '"' + (w ? ' font-weight="700"' : "") + (a ? ' text-anchor="' + a + '"' : "") + ' fill="' + (c || "#141a33") + '">' + t + '</text>'; }
      var rule = wrap(v.rule, 28, 3), y, s = "";
      s += tx(36, 60, "ROUNDING RULE", 26, 1, "#e07a1f");
      s += rule.map(function(l, k){ return tx(36, 104 + k * 32, esc(l), 22, 1); }).join("");
      y = 104 + rule.length * 32 + 6;
      /* a little number line */
      s += '<path d="M40 ' + (y + 30) + 'H560" stroke="#141a33" stroke-width="3"/>';
      for(var k = 0; k <= 10; k++) s += '<path d="M' + (60 + k * 48) + ' ' + (y + (k % 5 ? 22 : 16)) + 'v' + (k % 5 ? 16 : 28) + '" stroke="#141a33" stroke-width="' + (k % 5 ? 1.5 : 3) + '"/>';
      s += '<path d="M60 ' + (y + 48) + 'H276" stroke="#3a8fd6" stroke-width="8" stroke-opacity=".5"/><path d="M300 ' + (y + 48) + 'H540" stroke="#1f9d63" stroke-width="8" stroke-opacity=".5"/>' +
        tx(168, y + 72, "stay put", 15, 1, "#2a6fb0", "middle") + tx(420, y + 72, "go up", 15, 1, "#137a5a", "middle");
      y += 100;
      s += tx(36, y, "For example:", 15, 0, "#5b6180") + wrap(v.eg, 34, 2).map(function(l, k){ return tx(36, y + 26 + k * 24, esc(l), 19, 1); }).join("");
      y += 80;
      s += tx(36, y, "I round up anyway when:", 15, 0, "#5b6180") + wrap(v.life, 34, 2).map(function(l, k){ return tx(36, y + 26 + k * 24, esc(l), 19, 1); }).join("");
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500">' +
        '<rect width="600" height="500" rx="24" fill="#fff7ec"/>' +
        '<rect x="12" y="12" width="576" height="476" rx="18" fill="none" stroke="#e07a1f" stroke-width="4"/>' +
        '<circle cx="530" cy="56" r="30" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/>' + tx(530, 63, "~", 26, 1, "#141a33", "middle") +
        s + tx(36, 470, "Card by: " + esc(v.name), 15, 0, "#5b6180") + '</svg>';
    }
  }
};
})();
