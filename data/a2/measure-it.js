/* Base 5 Autumn 2 activity: Measure it.
   Maths. Length, mass, capacity and time with standard units, read
   from rulers, jugs, dials and clocks, then recorded. ASCII only. */
(function(){
var A = window.A2ART;
var FONT = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }
function fm(v){ return String(Math.round(v * 1000) / 1000); }

/* a 12 cm ruler with something lying along it from a to b (cm) */
function ruler(a, b, extra){
  var x0 = 34, k = 38, top = 96, s = "";
  s += '<svg viewBox="0 0 520 170" role="img" aria-label="A ruler in centimetres. The [[item]] lies along it from ' + a + ' to ' + b + '.">';
  s += '<rect width="520" height="170" rx="16" fill="#f4f1ea"/>';
  s += '<rect x="' + (x0 + a * k) + '" y="54" width="' + ((b - a) * k) + '" height="28" rx="8" fill="#ff8a5c" stroke="#141a33" stroke-width="2.5"/>';
  s += '<path d="M' + (x0 + a * k) + ' 50V' + top + 'M' + (x0 + b * k) + ' 50V' + top + '" stroke="#e04848" stroke-width="2" stroke-dasharray="4 3"/>';
  s += T(x0 + (a + b) / 2 * k, 42, "[[Item]]", 14, { b: 1, a: "middle" });
  s += '<rect x="18" y="' + top + '" width="488" height="58" rx="6" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/>';
  var p = "";
  for(var i = 0; i <= 120; i++){
    var x = x0 + i * k / 10, h = i % 10 === 0 ? 20 : i % 5 === 0 ? 14 : 8;
    p += "M" + x + " " + top + "v" + h;
  }
  s += '<path d="' + p + '" stroke="#141a33" stroke-width="1.6"/>';
  for(var c = 0; c <= 12; c++) s += T(x0 + c * k, top + 36, String(c), 13, { a: "middle", b: 1 });
  s += T(x0 - 6, top + 53, "cm", 13);
  return s + (extra || "") + '</svg>';
}

/* a measuring jug, filled to level, ticks every minor, numbers every lab */
function jug(max, lab, minor, level, unit, extra){
  unit = unit || "ml";
  var y0 = 214, hgt = 160, s = "";
  function Y(v){ return y0 - v / max * hgt; }
  s += '<svg viewBox="0 0 420 240" role="img" aria-label="A measuring jug marked in ' + unit + ' with [[liquid]] in it">';
  s += '<rect width="420" height="240" rx="16" fill="#f4f1ea"/>';
  s += '<path d="M138 46q-48 10 -44 64q4 46 46 52" fill="none" stroke="#141a33" stroke-width="9" stroke-linecap="round"/>';
  s += '<rect x="140" y="' + Y(level) + '" width="140" height="' + (y0 - Y(level)) + '" fill="#22b8e6" fill-opacity=".55"/>';
  s += '<path d="M' + 140 + ' ' + Y(level) + 'h140" stroke="#1b7fa6" stroke-width="3"/>';
  s += '<path d="M130 30h160l-6 8v178q0 8 -8 8h-132q-8 0 -8 -8v-178z" fill="#ffffff" fill-opacity=".25" stroke="#141a33" stroke-width="3"/>';
  var n = Math.round(max / minor), p = "";
  for(var i = 0; i <= n; i++){
    var v = i * minor, y = Y(v), big = Math.abs(v / lab - Math.round(v / lab)) < 1e-6;
    p += "M284 " + y + "h-" + (big ? 22 : 12);
    if(big && i > 0) s += T(292, y + 5, fm(v) + " " + unit, 13, { b: 1 });
  }
  s += '<path d="' + p + '" stroke="#141a33" stroke-width="2"/>';
  s += '<rect x="148" y="190" width="104" height="22" rx="6" fill="#ffffff" fill-opacity=".85"/>' + T(200, 206, "[[Liquid]]", 13, { a: "middle", b: 1, c: "#1b5f7a" });
  return s + (extra || "") + '</svg>';
}

/* a kitchen scale dial from 0 to max, needle at val */
function dial(max, lab, minor, val, unit, extra){
  var cx = 210, cy = 146, r = 88, s = "";
  function pt(v, rr){ var a = (-120 + 240 * v / max) * Math.PI / 180; return [cx + rr * Math.sin(a), cy - rr * Math.cos(a)]; }
  s += '<svg viewBox="0 0 420 260" role="img" aria-label="A kitchen scale dial in ' + unit + ' with a [[load]] on top">';
  s += '<rect width="420" height="260" rx="16" fill="#f4f1ea"/>';
  s += '<rect x="150" y="10" width="120" height="30" rx="8" fill="#8a5cf6" stroke="#141a33" stroke-width="2.5"/>' + T(210, 30, "[[Load]]", 13, { a: "middle", b: 1, c: "#ffffff" });
  s += '<rect x="110" y="40" width="200" height="8" rx="4" fill="#5b6180"/>';
  s += '<rect x="96" y="48" width="228" height="204" rx="26" fill="#e04848" stroke="#141a33" stroke-width="3"/>';
  s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 12) + '" fill="#ffffff" stroke="#141a33" stroke-width="3"/>';
  var n = Math.round(max / minor), p = "", labs = "";
  for(var i = 0; i <= n; i++){
    var v = i * minor, big = Math.abs(v / lab - Math.round(v / lab)) < 1e-6;
    var o = pt(v, r), q = pt(v, r - (big ? 16 : 9));
    p += "M" + o[0].toFixed(1) + " " + o[1].toFixed(1) + "L" + q[0].toFixed(1) + " " + q[1].toFixed(1);
    if(big){ var t = pt(v, r - 30); labs += '<text x="' + t[0].toFixed(1) + '" y="' + (t[1] + 5).toFixed(1) + '" ' + FONT + ' font-size="14" font-weight="700" text-anchor="middle" fill="#141a33" stroke="#ffffff" stroke-width="4" paint-order="stroke">' + fm(v) + '</text>'; }
  }
  s += '<path d="' + p + '" stroke="#141a33" stroke-width="2.2"/>';
  var nd = pt(val, r - 6);
  s += '<path d="M' + cx + ' ' + cy + 'L' + nd[0].toFixed(1) + ' ' + nd[1].toFixed(1) + '" stroke="#e04848" stroke-width="4" stroke-linecap="round"/>';
  s += '<circle cx="' + cx + '" cy="' + cy + '" r="7" fill="#141a33"/>' + labs;
  s += T(cx, cy + 50, unit, 16, { a: "middle", b: 1 });
  return s + (extra || "") + '</svg>';
}

/* clock faces */
function clock(x, y, r, hh, mm, label){
  var s = '<g transform="translate(' + x + ' ' + y + ')"><circle r="' + r + '" fill="#ffffff" stroke="#141a33" stroke-width="3"/>';
  for(var i = 1; i <= 12; i++){
    var a = i * 30 * Math.PI / 180;
    s += T((Math.sin(a) * (r - 14)).toFixed(1), (-Math.cos(a) * (r - 14) + 5).toFixed(1), String(i), 13, { a: "middle" });
  }
  var ma = mm * 6 * Math.PI / 180, ha = ((hh % 12) * 30 + mm * 0.5) * Math.PI / 180;
  s += '<path d="M0 0L' + (Math.sin(ha) * r * 0.42).toFixed(1) + ' ' + (-Math.cos(ha) * r * 0.42).toFixed(1) + '" stroke="#141a33" stroke-width="5" stroke-linecap="round"/>';
  s += '<path d="M0 0L' + (Math.sin(ma) * r * 0.6).toFixed(1) + ' ' + (-Math.cos(ma) * r * 0.6).toFixed(1) + '" stroke="#e04848" stroke-width="3.5" stroke-linecap="round"/>';
  s += '<circle r="4" fill="#141a33"/></g>';
  if(label) s += T(x, y + r + 22, label, 14, { a: "middle", b: 1 });
  return s;
}
function clocks(h1, m1, h2, m2){
  function tt(h, m){ return h + ":" + (m < 10 ? "0" : "") + m; }
  return '<svg viewBox="0 0 460 190" role="img" aria-label="Two clocks: it starts at ' + tt(h1, m1) + ' and ends at ' + tt(h2, m2) + '">' +
    '<rect width="460" height="190" rx="16" fill="#f4f1ea"/>' +
    clock(110, 82, 60, h1, m1, "Starts " + tt(h1, m1)) + clock(350, 82, 60, h2, m2, "Ends " + tt(h2, m2)) +
    '<path d="M190 82h80" stroke="#19c39a" stroke-width="5" stroke-linecap="round"/><path d="M262 70l14 12 -14 12" fill="none" stroke="#19c39a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';
}

/* a time line with jumps */
function hops(times, jumps){
  var n = times.length, x0 = 50, w = 420, s = "";
  s += '<svg viewBox="0 0 520 150" role="img" aria-label="A time line from ' + times[0] + ' to ' + times[n - 1] + ' in jumps">';
  s += '<rect width="520" height="150" rx="16" fill="#f4f1ea"/><path d="M30 104h460" stroke="#141a33" stroke-width="3"/>';
  var xs = times.map(function(t, k){ return x0 + w * k / (n - 1); });
  jumps.forEach(function(j, k){
    var a = xs[k], b = xs[k + 1], m = (a + b) / 2;
    s += '<path d="M' + a + ' 100Q' + m + ' 30 ' + b + ' 100" fill="none" stroke="#19c39a" stroke-width="4"/>';
    s += '<rect x="' + (m - 30) + '" y="40" width="60" height="26" rx="13" fill="#ffffff" stroke="#19c39a" stroke-width="2.5"/>' + T(m, 59, j, 14, { a: "middle", b: 1 });
  });
  xs.forEach(function(x, k){ s += '<circle cx="' + x + '" cy="104" r="6" fill="#141a33"/>' + T(x, 132, times[k], 15, { a: "middle", b: 1 }); });
  return s + '</svg>';
}

/* the four things we measure */
var FOUR = '<svg viewBox="0 0 520 210" role="img" aria-label="Four things we measure: length with a ruler, mass with scales, capacity with a jug, time with a clock">' +
  '<rect width="520" height="210" rx="16" fill="#f4f1ea"/>' +
  [["Length", "mm cm m km", "#ffd23f", '<rect x="-38" y="-10" width="76" height="20" rx="3" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/><path d="M-28 -10v9M-14 -10v6M0 -10v9M14 -10v6M28 -10v9" stroke="#141a33" stroke-width="2"/>'],
   ["Mass", "g kg", "#8a5cf6", '<rect x="-30" y="-12" width="60" height="30" rx="8" fill="#e04848" stroke="#141a33" stroke-width="2.5"/><circle cx="0" cy="3" r="10" fill="#fff" stroke="#141a33" stroke-width="2"/><path d="M0 3l5 -6" stroke="#141a33" stroke-width="2"/><rect x="-22" y="-22" width="44" height="8" rx="3" fill="#5b6180"/>'],
   ["Capacity", "ml l", "#22b8e6", '<path d="M-18 -26h36v44q0 6 -6 6h-24q-6 0 -6 -6z" fill="#fff" stroke="#141a33" stroke-width="2.5"/><rect x="-16" y="-2" width="32" height="20" fill="#22b8e6" fill-opacity=".6"/><path d="M18 -18q14 2 12 18q-2 10 -12 10" fill="none" stroke="#141a33" stroke-width="3"/>'],
   ["Time", "s min h", "#19c39a", '<circle r="24" fill="#fff" stroke="#141a33" stroke-width="2.5"/><path d="M0 0v-16M0 0l11 6" stroke="#141a33" stroke-width="3" stroke-linecap="round"/>']
  ].map(function(c, k){
    var x = 70 + k * 127;
    return '<g transform="translate(' + x + ' 76)"><circle r="46" fill="' + c[2] + '" fill-opacity=".3" stroke="#141a33" stroke-width="2.5"/>' + c[3] +
      T(0, 74, c[0], 16, { a: "middle", b: 1 }) + T(0, 96, c[1], 14, { a: "middle", c: "#3a4060" }) + '</g>';
  }).join("") + '</svg>';

/* a record sheet: guess, tool, number and unit */
var RECORD = '<svg viewBox="0 0 520 200" role="img" aria-label="A record sheet with columns: thing, guess, measured">' +
  '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  '<rect x="24" y="20" width="472" height="164" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
  '<path d="M24 60h472M24 102h472M24 144h472M210 20v164M350 20v164" stroke="#141a33" stroke-width="2"/>' +
  T(40, 46, "Thing", 15, { b: 1 }) + T(226, 46, "Guess", 15, { b: 1 }) + T(366, 46, "Measured", 15, { b: 1 }) +
  T(40, 88, "Table", 15) + T(226, 88, "100 cm", 15, { c: "#5b6180" }) + T(366, 88, "120 cm", 15, { b: 1, c: "#1f9d63" }) +
  T(40, 130, "Mug", 15) + T(226, 130, "500 ml", 15, { c: "#5b6180" }) + T(366, 130, "350 ml", 15, { b: 1, c: "#1f9d63" }) +
  T(40, 172, "Bag", 15) + T(226, 172, "2 kg", 15, { c: "#5b6180" }) + T(366, 172, "1.5 kg", 15, { b: 1, c: "#1f9d63" }) +
  A2ART.egg(A2ART.bird(470, 172, 0.55, "#3a8fd6"), "Jay's guess for this bird: about 20 g. Most small garden birds weigh less than a pound coin and a half.") +
  '</svg>';

/* the measure hunt: guess, then measure, things around you */
var UNITS = ["mm", "cm", "m", "km", "g", "kg", "ml", "l", "seconds", "minutes", "hours"];
function huntWidget(el, api){
  var d = api.data || {};
  if(!Array.isArray(d.rows)) d.rows = [];
  var html = '<div class="a2task"><h4>Measure hunt</h4><p>Away from the screen, if you like. Pick up to four things near you. Guess first, then measure with a ruler, tape, scales, jug or timer. Close enough is great.</p>' +
    '<div class="mh" style="display:grid;gap:10px;margin-top:8px"></div></div>';
  el.innerHTML = html;
  var host = el.querySelector(".mh");
  var css = "font:inherit;padding:8px;border-radius:10px;border:2px solid #141a33;background:#fffdf8;min-width:0";
  for(var k = 0; k < 4; k++){
    (function(k){
      var r = d.rows[k] || (d.rows[k] = { what: "", guess: "", got: "", unit: "cm" });
      var row = document.createElement("div");
      row.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:6px;align-items:center";
      row.innerHTML = '<input type="text" maxlength="30" aria-label="Thing ' + (k + 1) + '" placeholder="Thing ' + (k + 1) + '" style="' + css + '">' +
        '<input type="text" maxlength="10" aria-label="Guess" placeholder="Guess" style="' + css + '">' +
        '<input type="text" maxlength="10" aria-label="Measured" placeholder="Measured" style="' + css + '">' +
        '<select aria-label="Unit" style="' + css + '">' + UNITS.map(function(u){ return '<option>' + u + '</option>'; }).join("") + '</select>';
      var ins = row.querySelectorAll("input"), sel = row.querySelector("select");
      ins[0].value = r.what || ""; ins[1].value = r.guess || ""; ins[2].value = r.got || ""; sel.value = r.unit || "cm";
      function keep(){
        r.what = ins[0].value; r.guess = ins[1].value; r.got = ins[2].value; r.unit = sel.value;
        try{ api.save(); }catch(e){}
        if(r.what.trim() && (r.got.trim() || r.guess.trim())) api.done("done");
      }
      [ins[0], ins[1], ins[2]].forEach(function(x){ x.oninput = keep; });
      sel.onchange = keep;
      host.appendChild(row);
    })(k);
  }
}

(window.A2PACKS = window.A2PACKS || {})["measure-it"] = {
  a2: true,
  id: "a2-measure-it",
  title: "Measure it",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 25,
  line: "How long, how heavy, how much it holds, how long it takes. Read it, then write the number and the unit.",
  blurb: "Measuring length, mass, capacity and time: picking the unit, reading rulers, jugs, dials and clocks, and writing it down properly. Five short chunks, a measure hunt if you fancy it, and a measuring card to make at the end.",
  note: "Measuring things for real: rulers, jugs, scales and clocks. Five five minute chunks and a measure hunt, whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Pocket ruler", line: "Pocket ruler: whole numbers, every line labelled, starting from 0." },
    { id: "medium", name: "Tape measure", line: "Tape measure: millimetres, lines without numbers, and times across the hour." },
    { id: "spicy", name: "Laser measure", line: "Laser measure: snapped rulers, decimals, changing units and longer times." }
  ],
  themes: {
    time: { name: "Time travel", w: { item: "time crystal", liquid: "fuel", load: "box of spare parts", event: "the time jump test", trip: "the walk to the time lab" } },
    football: { name: "Football", w: { item: "whistle", liquid: "squash", load: "bag of balls", event: "training", trip: "the away trip" } },
    horror: { name: "Horror", w: { item: "candle", liquid: "green slime", load: "pumpkin", event: "the ghost tour", trip: "the drive to the old hospital" } },
    fishing: { name: "Fishing", w: { item: "float", liquid: "lake water", load: "carp", event: "the fishing lesson", trip: "the drive to the lake" } },
    music: { name: "Music", w: { item: "harmonica", liquid: "water", load: "speaker", event: "the rehearsal", trip: "the trip to the theatre" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: FOUR,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Pick the unit", title: "Four things we measure",
      fig: FOUR,
      html: "<p>We measure four main things.</p>" +
        "<p><b>Length:</b> how long. Use <b>cm</b> or <b>m</b>. <b>Mass:</b> how heavy. Use <b>g</b> or <b>kg</b>. <b>Capacity:</b> how much it holds. Use <b>ml</b> or <b>l</b> (litres). <b>Time:</b> how long it takes. Use <b>minutes</b> or <b>hours</b>.</p>" +
        "<p>A number on its own is not enough. \"The [[item]] is 7\" could mean anything. \"The [[item]] is 7 cm\" tells the whole story.</p>",
      lv: {
        medium: { html: "<p>We measure four main things, each with its own units.</p>" +
          "<p><b>Length:</b> mm for tiny things, cm for small things, m for rooms, km for journeys. <b>Mass:</b> g for light things, kg for heavy things. <b>Capacity:</b> ml for cups, l for buckets and baths. <b>Time:</b> seconds, minutes, hours.</p>" +
          "<p>Always write the unit. \"[[Trip]] is 3\" could be 3 m or 3 km. Quite a difference.</p>" },
        spicy: { html: "<p>Four things to measure, and the links between their units:</p>" +
          "<p><b>Length:</b> 10 mm = 1 cm, 100 cm = 1 m, 1 000 m = 1 km. <b>Mass:</b> 1 000 g = 1 kg. <b>Capacity:</b> 1 000 ml = 1 l. <b>Time:</b> 60 seconds = 1 minute, 60 minutes = 1 hour.</p>" +
          "<p>Pick the unit that gives a sensible sized number. [[Trip]] could be 2.5 km or 2 500 000 mm. Both are true, but only one is easy to picture.</p>" } } },

    { type: "match", topic: "Pick the unit",
      q: "Match each question to the tool that answers it.",
      pairs: [["How long is it?", "Ruler or tape measure"], ["How heavy is it?", "Scales"], ["How much does it hold?", "Measuring jug"], ["How long does it take?", "Clock or timer"]],
      slips: { any: "Think about what each tool shows: lines along an edge, a needle, lines up the side, or hands going round." },
      hint: "A jug has lines up the side. Scales have a needle or a screen.",
      why: "Ruler for length, scales for mass, jug for capacity, clock for time.",
      lv: { spicy: { pairs: [["How long is it?", "Ruler or tape measure"], ["How heavy is it?", "Scales"], ["How much does it hold?", "Measuring jug"], ["How long does it take?", "Clock or timer"], ["How far is the journey?", "A map or a car trip meter"]] } } },

    { type: "sort", topic: "Pick the unit",
      q: "Sort the units. What does each one measure?",
      buckets: ["Length", "Mass", "Capacity", "Time"],
      cards: [["cm", 0], ["m", 0], ["g", 1], ["kg", 1], ["ml", 2], ["litres", 2], ["minutes", 3], ["hours", 3]],
      slips: { any: "Lengths are m words, masses are g words, capacities are l words. Time has its own." },
      hint: "Grams go with heavy. Litres go with holding.",
      why: "cm and m are lengths. g and kg are masses. ml and litres are capacities. Minutes and hours are times.",
      lv: {
        medium: { cards: [["mm", 0], ["km", 0], ["g", 1], ["kg", 1], ["ml", 2], ["litres", 2], ["seconds", 3], ["hours", 3]],
          why: "mm and km are lengths. g and kg are masses. ml and litres are capacities. Seconds and hours are times." },
        spicy: { q: "Sensible or not? Sort them.",
          buckets: ["Sensible", "Not sensible"],
          cards: [["A [[item]] 9 cm long", 0], ["A [[item]] 9 km long", 1], ["A mug holding 300 ml", 0], ["A mug holding 300 litres", 1], ["An adult weighing 70 kg", 0], ["An adult weighing 70 g", 1]],
          slips: { any: "Picture each one. Would it fit in your hand, your kitchen, or nowhere at all?" },
          hint: "Picture it. A 9 km [[item]] would stretch across a town.",
          why: "9 cm, 300 ml and 70 kg are sensible. 9 km, 300 litres and 70 g use a unit that is far too big or far too small." } } },

    { type: "mc", topic: "Pick the unit",
      q: "Which unit would you use for the length of a [[item]]?",
      options: ["cm", "km", "kg", "litres"],
      answer: 0,
      slips: { 1: "A km is a long way, about a 12 minute walk. Far too big for this.", 2: "kg tells you how heavy, not how long.", 3: "Litres tell you how much a container holds." },
      hint: "It is small enough to hold in your hand.",
      why: "Small things are measured in <b>cm</b>.",
      lv: {
        medium: { q: "Which unit would you use for [[trip]]?",
          options: ["km", "cm", "mm", "ml"],
          slips: { 1: "cm are tiny steps. The number would be enormous.", 2: "mm are even tinier than cm.", 3: "ml is for how much a container holds." },
          hint: "Journeys are long.",
          why: "Journeys are measured in <b>km</b>." },
        spicy: { q: "About how heavy is a [[load]]?",
          options: ["5 kg", "5 g", "500 kg", "0.5 g"],
          slips: { 1: "5 g is about the mass of a sugar cube. Far too light.", 2: "500 kg is about as heavy as a horse.", 3: "0.5 g is lighter than a paper clip." },
          hint: "Could you lift it with two hands?",
          why: "About <b>5 kg</b>: heavy enough to need both hands, light enough to carry." } } },

    { type: "mc", topic: "Pick the unit",
      q: "Jay says: \"My water bottle holds 500 litres.\" What is the slip?",
      fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay holding up a water bottle">' + A2ART.jay(90, 46, 0.85, "wow") +
        '<rect x="160" y="70" width="34" height="68" rx="10" fill="#22b8e6" fill-opacity=".6" stroke="#141a33" stroke-width="2.5"/><rect x="168" y="58" width="18" height="14" rx="3" fill="#141a33"/>' +
        A2ART.bubble(214, 18, 192, 52, "My bottle holds\n500 litres!", 226) + '</svg>',
      options: ["It should be 500 ml.", "Nothing, that sounds right.", "It should be 500 km."],
      answer: 0, fixed: true,
      slips: { 1: "500 litres would fill about three baths. Outrageous, for a water bottle.", 2: "km is for distance, not how much a bottle holds." },
      hint: "How many bottles would it take to fill a bath?",
      why: "A water bottle holds about <b>500 ml</b>, which is half a litre. Jay needs a smaller bottle, or very strong arms.",
      lv: {
        medium: { q: "Jay writes: \"[[Trip]] was 6 cm.\" What is the slip?",
          fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay looking puzzled">' + A2ART.jay(90, 46, 0.85, "hmm") + A2ART.bubble(170, 24, 220, 52, "[[Trip]]\nwas 6 cm.", 182) + '</svg>',
          options: ["It should be 6 km.", "Nothing, that is right.", "It should be 6 kg."],
          slips: { 1: "6 cm is shorter than your finger. You could not take a trip that short.", 2: "kg is for mass, not distance." },
          hint: "Picture 6 cm with your fingers.",
          why: "A journey is measured in <b>km</b>. 6 cm is about the length of a finger." },
        spicy: { q: "Jay says: \"Bonnie weighs 3 000 kg.\" What is the slip?",
          fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay and Bonnie">' + A2ART.jay(80, 46, 0.85, "hmm") + A2ART.bonnie(196, 96, 0.9, "sit") + A2ART.bubble(236, 18, 170, 52, "Bonnie weighs\n3 000 kg.", 246) + '</svg>',
          options: ["It should be 3 kg, which is 3 000 g.", "Nothing, poodles are heavy.", "It should be 3 000 ml."],
          slips: { 1: "3 000 kg is about as heavy as two cars. Outrageous, for a toy poodle.", 2: "ml is for capacity, not mass." },
          hint: "A toy poodle is about as heavy as a big bag of potatoes.",
          why: "Bonnie is about <b>3 kg</b>, which is 3 000 g. Jay mixed up kg and g." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Rulers", title: "Reading a ruler",
      fig: ruler(0, 7, A2ART.egg(A2ART.bird(470, 40, 0.6, "#ff5d5d"), "A bird perched on the ruler. About 14 cm long, beak to tail. Jay measured it with his eyes.")),
      html: "<p>Here is how to measure with a ruler, step by step.</p>" +
        "<p><b>1.</b> Line one end up with the <b>0</b>, not the edge of the ruler.<br><b>2.</b> Look at the other end.<br><b>3.</b> Read the number it lands on, and write the unit.</p>" +
        "<p>This [[item]] starts at 0 and ends at 7. So it is <b>7 cm</b> long.</p>",
      lv: {
        medium: { fig: ruler(0, 6.4),
          html: "<p>Each centimetre is split into 10 small steps called <b>millimetres</b> (mm). 10 mm = 1 cm.</p>" +
            "<p><b>1.</b> Start at 0.<br><b>2.</b> Count the whole cm: 6.<br><b>3.</b> Count the small steps after it: 4.<br><b>4.</b> So it is <b>6.4 cm</b>, the same as <b>64 mm</b>.</p>" },
        spicy: { fig: ruler(2, 9.3),
          html: "<p>Snapped ruler, or something that does not start at 0? Subtract.</p>" +
            "<p><b>1.</b> Read where it starts: 2 cm.<br><b>2.</b> Read where it ends: 9.3 cm.<br><b>3.</b> Length = end minus start: 9.3 &minus; 2 = <b>7.3 cm</b>, which is 73 mm.</p>" +
            "<p>Reading only the end would give 9.3 cm: 2 cm too long.</p>" } } },

    { type: "num", topic: "Rulers",
      q: "Your turn, with the first step done for you. The [[item]] starts at 0. Where does it end, and how long is it?",
      fig: ruler(0, 9),
      boxes: [{ label: "Ends at", a: 9 }, { label: "Length", a: 9, post: "cm" }],
      slips: [[0, 10, "That is one line past the end. Follow the red dashed line down."], [0, 8, "One line short. Follow the red dashed line down from the end."]],
      hint: "Follow the red dashed line down from the end of the [[item]].",
      why: "It starts at 0 and ends at 9, so it is <b>9 cm</b> long.",
      lv: {
        medium: { q: "Your turn, with the steps laid out. Count the whole cm, then the small steps, then give the length in mm.",
          fig: ruler(0, 8.3),
          boxes: [{ label: "Whole cm", a: 8 }, { label: "Extra small steps", a: 3 }, { label: "Length", a: 83, post: "mm" }],
          slips: [[2, 8.3, "8.3 is right in cm. This box wants mm: 8.3 cm = 83 mm."], [2, 11, "Do not add 8 and 3. 8 cm is 80 mm, then 3 more."], [1, 7, "Count the small steps after the 8, not back from the 9."]],
          hint: "8 cm is 80 mm.",
          why: "8 whole cm and 3 small steps: 8.3 cm, which is <b>83 mm</b>." },
        spicy: { q: "Your turn, with the steps laid out. Start, end, then subtract.",
          fig: ruler(3, 11.6),
          boxes: [{ label: "Starts at", a: 3 }, { label: "Ends at", a: 11.6 }, { label: "Length", a: 8.6, post: "cm" }],
          slips: [[2, 11.6, "That is where it ends. Take away the start: 11.6 minus 3."], [2, 14.6, "That adds the start on. Subtract it instead."]],
          hint: "End minus start.",
          why: "11.6 &minus; 3 = <b>8.6 cm</b>." } } },

    { type: "num", topic: "Rulers",
      q: "Now on your own. How long is the [[item]]?",
      fig: ruler(0, 5),
      boxes: [{ label: "Length", a: 5, post: "cm" }],
      slips: [[6, "It looks like the 0 line was counted as 1. Start counting at 0."], [4, "One short. Look at the line the end of the [[item]] lands on."]],
      hint: "Look at the number under the red dashed line at the end.",
      why: "It ends at 5, so it is <b>5 cm</b> long.",
      lv: {
        medium: { fig: ruler(0, 5.7),
          q: "Now on your own. How long is the [[item]], in cm?",
          boxes: [{ label: "Length", a: 5.7, post: "cm" }],
          slips: [[57, "57 is right in mm. This box wants cm: 57 mm = 5.7 cm."], [5.3, "Count the small steps forward from the 5, not back from the 6."], [6.7, "Check the whole cm again: the end is between 5 and 6."]],
          hint: "Whole cm first, then the small steps after it.",
          why: "5 whole cm and 7 small steps: <b>5.7 cm</b>." },
        spicy: { fig: ruler(1.5, 9),
          q: "Now on your own. How long is the [[item]], in cm?",
          boxes: [{ label: "Length", a: 7.5, post: "cm" }],
          slips: [[9, "That is where it ends. It starts at 1.5, so take that away."], [10.5, "That adds the start on. Subtract it: 9 minus 1.5."], [8.5, "Check the start again. It is 1.5, not 0.5."], [8, "Close. The start is 1.5, so take away the half too."]],
          hint: "End minus start.",
          why: "9 &minus; 1.5 = <b>7.5 cm</b>." } } },

    { type: "mc", topic: "Rulers", explain: true,
      q: "Jay's ruler has snapped. The [[item]] goes from 4 to 10. How long is it?",
      fig: ruler(4, 10),
      options: ["6 cm", "10 cm", "4 cm", "14 cm"],
      answer: 0,
      slips: { 1: "10 is where it ends. It started at 4, not 0.", 2: "4 is where it starts.", 3: "That adds them. Count the steps from 4 to 10 instead." },
      hint: "Count the cm steps from 4 to 10.",
      why: "From 4 to 10 is 6 steps: <b>6 cm</b>.",
      lv: {
        medium: { q: "Which of these is the same as 45 mm?", fig: "",
          options: ["4.5 cm", "45 cm", "0.45 cm", "450 cm"],
          slips: { 1: "45 cm would be ten times too long. There are 10 mm in each cm.", 2: "0.45 cm is less than half a cm. Too small.", 3: "450 cm is longer than a car." },
          hint: "10 mm make 1 cm. How many lots of 10 in 45?",
          why: "45 mm &divide; 10 = <b>4.5 cm</b>." },
        spicy: { q: "Which is longer: 8.5 cm or 82 mm?", fig: "",
          options: ["8.5 cm", "82 mm", "They are the same"], fixed: true,
          slips: { 1: "82 is the bigger number, but mm are tiny. Change 8.5 cm into mm first.", 2: "Turn them both into mm and compare: 85 mm and 82 mm." },
          hint: "Change them both to mm.",
          why: "8.5 cm = 85 mm, and 85 mm is longer than 82 mm. So <b>8.5 cm</b>." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Jugs and scales", title: "Reading a jug or a dial",
      fig: jug(1000, 100, 100, 300, "ml"),
      html: "<p>Jugs and scales have lines with numbers.</p>" +
        "<p><b>1.</b> Get your eyes level with the top of the [[liquid]].<br><b>2.</b> Find the line it is level with.<br><b>3.</b> Read the number, and write the unit.</p>" +
        "<p>Here the [[liquid]] is level with <b>300</b>. So there is <b>300 ml</b>.</p>",
      lv: {
        medium: { fig: jug(1000, 200, 50, 650, "ml"),
          html: "<p>Not every line has a number. Work out what each small step is worth.</p>" +
            "<p><b>1.</b> Take two labels next to each other: 600 and 800. The gap is 200.<br><b>2.</b> Count the steps between them: 4.<br><b>3.</b> 200 &divide; 4 = <b>50 ml</b> a step.<br><b>4.</b> The [[liquid]] is one step past 600: <b>650 ml</b>.</p>" },
        spicy: { fig: dial(5, 1, 0.2, 2.6, "kg", A2ART.egg(A2ART.bonnie(372, 214, 0.5, "sit"), "Bonnie wants a go on the scales. About 3 kg, and most of it is fluff.")),
          html: "<p>The same trick works on a dial.</p>" +
            "<p><b>1.</b> Labels 2 and 3: a gap of 1 kg.<br><b>2.</b> There are 5 steps between them.<br><b>3.</b> 1 &divide; 5 = <b>0.2 kg</b> a step.<br><b>4.</b> The needle is 3 steps past 2: 2 + 0.6 = <b>2.6 kg</b>, which is <b>2 600 g</b>.</p>" } } },

    { type: "num", topic: "Jugs and scales",
      q: "How much [[liquid]] is in the jug?",
      fig: jug(1000, 100, 100, 600, "ml"),
      boxes: [{ label: "Amount", a: 600, post: "ml" }],
      slips: [[700, "That is the line above. Find the line the top of the [[liquid]] is level with."], [500, "That is the line below. Look where the top of the [[liquid]] is."], [6, "Nearly: the label says 600, not 6."]],
      hint: "Find the line the top of the [[liquid]] touches.",
      why: "The top of the [[liquid]] is level with 600: <b>600 ml</b>.",
      lv: {
        medium: { fig: jug(1000, 200, 50, 350, "ml"),
          slips: [[300, "Each small step is worth 50 here, not 100. Count again from 200."], [400, "400 is the labelled line just above. The [[liquid]] is one step below it."], [250, "Count the steps up from 200 again: each one is 50."]],
          hint: "200 split into 4 steps: each step is 50.",
          why: "Each step is 50 ml. Three steps past 200 is <b>350 ml</b>." },
        spicy: { q: "How much [[liquid]] is in the jug? Give it in ml.",
          fig: jug(2, 0.5, 0.1, 1.3, "l"),
          slips: [[1.3, "1.3 is right in litres. The box wants ml: 1.3 l = 1 300 ml."], [130, "1 litre is 1 000 ml, so 0.3 l is 300 ml, not 30."], [1150, "Check the step size: 0.5 split into 5 steps is 0.1 a step."], [1200, "One step short. Count up from the 1 again."]],
          hint: "Work it out in litres first, then times by 1 000.",
          why: "Each step is 0.1 l. Three steps past 1 is 1.3 l, which is <b>1 300 ml</b>." } } },

    { type: "num", topic: "Jugs and scales",
      q: "How heavy is the [[load]]?",
      fig: dial(10, 1, 1, 4, "kg", A2ART.egg(A2ART.bonnie(372, 214, 0.5, "sit"), "Bonnie wants a go on the scales. About 3 kg, and most of it is fluff.")),
      boxes: [{ label: "Mass", a: 4, post: "kg" }],
      slips: [[5, "That is the number just past the needle. Look exactly where the red needle points."], [3, "That is the number just before the needle. Look exactly where it points."]],
      hint: "Follow the red needle to the number it points at.",
      why: "The needle points at 4: <b>4 kg</b>.",
      lv: {
        medium: { q: "How heavy is the [[load]]? Give it in kg, then in g.",
          fig: dial(5, 1, 0.5, 2.5, "kg"),
          boxes: [{ label: "In kg", a: 2.5, post: "kg" }, { label: "In g", a: 2500, post: "g" }],
          slips: [[0, 2, "The needle is past the 2, half way to 3. Each small step is 0.5 kg."], [0, 3, "The needle has not reached 3. It is half way between 2 and 3."], [1, 250, "1 kg is 1 000 g, so 2.5 kg is 2 500 g."], [1, 25, "1 kg is 1 000 g, so 2.5 kg is 2 500 g."]],
          hint: "Half way between 2 and 3. Then 1 kg = 1 000 g.",
          why: "Half way between 2 and 3 is 2.5 kg, which is <b>2 500 g</b>." },
        spicy: { q: "How heavy is the [[load]]? Give it in g.",
          fig: dial(5, 1, 0.2, 3.4, "kg"),
          boxes: [{ label: "Mass", a: 3400, post: "g" }],
          slips: [[3.4, "3.4 is right in kg. The box wants g: 3.4 kg = 3 400 g."], [340, "1 kg is 1 000 g, so 3.4 kg is 3 400 g."], [3200, "One step short. Each step is 0.2 kg, which is 200 g."], [3600, "One step too far. Count the steps from 3 again."]],
          hint: "Each step is 0.2 kg. Then times by 1 000.",
          why: "Two steps past 3 is 3.4 kg, which is <b>3 400 g</b>." } } },

    { type: "order", topic: "Jugs and scales",
      q: "Put them in order, from least to most.",
      items: ["100 ml", "500 ml", "1 litre", "2 litres"],
      slips: { any: "1 litre is the same as 1 000 ml. That helps with the ones in litres." },
      hint: "1 litre is 1 000 ml.",
      why: "100 ml, 500 ml, then 1 litre (1 000 ml), then 2 litres (2 000 ml).",
      lv: {
        medium: { items: ["250 ml", "0.5 litres", "750 ml", "1.2 litres"],
          hint: "Turn the litres into ml: 0.5 l is 500 ml.",
          why: "250 ml, 0.5 l (500 ml), 750 ml, 1.2 l (1 200 ml)." },
        spicy: { items: ["80 ml", "0.125 litres", "300 ml", "1.05 litres", "1 500 ml"],
          hint: "Turn everything into ml.",
          why: "80 ml, 0.125 l (125 ml), 300 ml, 1.05 l (1 050 ml), 1 500 ml." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "How long did it take?", title: "Count on from start to end",
      fig: clocks(3, 0, 3, 30),
      html: "<p>To find how long something took, count on from the start time to the end time.</p>" +
        "<p>[[Event]] starts at 3:00 and ends at 3:30. Count on in fives as the red hand goes round: 5, 10, 15, 20, 25, 30. It took <b>30 minutes</b>.</p>" +
        "<p>Half an hour is 30 minutes. A whole hour is 60 minutes.</p>",
      lv: {
        medium: { fig: hops(["2:45", "3:00", "3:20"], ["+15", "+20"]),
          html: "<p>Across an o'clock, jump in two steps.</p>" +
            "<p>[[Event]] runs from 2:45 to 3:20.<br><b>1.</b> Jump to the next o'clock: 2:45 to 3:00 is 15 minutes.<br><b>2.</b> Jump to the end: 3:00 to 3:20 is 20 minutes.<br><b>3.</b> Add the jumps: 15 + 20 = <b>35 minutes</b>.</p>" +
            "<p>Careful: 320 minus 245 gives 75, but an hour is 60 minutes, not 100.</p>" },
        spicy: { fig: hops(["10:50", "11:00", "12:00", "12:15"], ["+10", "+60", "+15"]),
          html: "<p>For longer times, jump to the next o'clock, then whole hours, then the rest.</p>" +
            "<p>[[Event]] runs from 10:50 to 12:15.<br><b>1.</b> 10:50 to 11:00: 10 minutes.<br><b>2.</b> 11:00 to 12:00: 60 minutes.<br><b>3.</b> 12:00 to 12:15: 15 minutes.<br><b>4.</b> 10 + 60 + 15 = <b>85 minutes</b>, which is <b>1 hour 25 minutes</b>.</p>" +
            "<p>Subtracting like normal numbers (1215 minus 1050) gives 165: a classic trap, because hours are 60 minutes, not 100.</p>" } } },

    { type: "num", topic: "How long did it take?",
      q: "[[Event]] starts at 3:00 and ends at 3:20. Count on in fives. How many fives is that, and how many minutes?",
      fig: clocks(3, 0, 3, 20),
      boxes: [{ label: "Fives", a: 4 }, { label: "Minutes", a: 20 }],
      slips: [[1, 4, "4 is the number of fives. Each five is 5 minutes: 5, 10, 15, 20."], [1, 25, "One five too many. The red hand stops on the 4."], [0, 20, "20 is the minutes. How many fives make 20?"]],
      hint: "The red hand moves from 12 to 4. Count 5, 10, 15, 20.",
      why: "4 fives: 5, 10, 15, 20. So it lasts <b>20 minutes</b>.",
      lv: {
        medium: { q: "[[Event]] starts at 4:40 and ends at 5:25. Fill in the jumps, then the total.",
          fig: hops(["4:40", "5:00", "5:25"], ["?", "?"]),
          boxes: [{ label: "4:40 to 5:00", a: 20, post: "min" }, { label: "5:00 to 5:25", a: 25, post: "min" }, { label: "Total", a: 45, post: "min" }],
          slips: [[2, 85, "That is 525 minus 440. Minutes go up to 60, not 100. Add the jumps instead."], [0, 40, "4:40 to 5:00 is from 40 up to 60: 20 minutes."], [0, 60, "4:40 to 5:00 is from 40 up to 60: 20 minutes."]],
          hint: "From 40 minutes to the o'clock is 20.",
          why: "20 + 25 = <b>45 minutes</b>." },
        spicy: { q: "[[Event]] runs from 9:35 to 11:10. Fill in the jumps, then the total in minutes.",
          fig: hops(["9:35", "10:00", "11:00", "11:10"], ["?", "?", "?"]),
          boxes: [{ label: "9:35 to 10:00", a: 25, post: "min" }, { label: "10:00 to 11:00", a: 60, post: "min" }, { label: "11:00 to 11:10", a: 10, post: "min" }, { label: "Total", a: 95, post: "min" }],
          slips: [[3, 175, "That is 1110 minus 935, treating time like hundreds. Add the jumps instead."], [1, 100, "An hour is 60 minutes, not 100."], [0, 65, "9:35 to 10:00 is from 35 up to 60: 25 minutes."]],
          hint: "One hour is 60 minutes.",
          why: "25 + 60 + 10 = <b>95 minutes</b>, which is 1 hour 35 minutes." } } },

    { type: "num", topic: "How long did it take?", explain: true,
      q: "Now on your own. [[Event]] starts at 7:00 and ends at 7:45. How long is it?",
      fig: clocks(7, 0, 7, 45),
      boxes: [{ label: "Minutes", a: 45, post: "min" }],
      slips: [[9, "9 is the number of fives. Each five is 5 minutes."], [15, "15 is what is left of the hour. Count from 7:00 to 7:45 instead."], [40, "Count on in fives again, all the way to the 9."]],
      hint: "The red hand goes from 12 to 9. Count in fives.",
      why: "9 fives: <b>45 minutes</b>. That is three quarters of an hour.",
      lv: {
        medium: { q: "Now on your own. [[Event]] starts at 11:50 and ends at 12:25. How long is it?",
          fig: hops(["11:50", "12:00", "12:25"], ["?", "?"]),
          boxes: [{ label: "Minutes", a: 35, post: "min" }],
          slips: [[75, "That is 1225 minus 1150. An hour is 60 minutes, not 100. Jump to 12:00 first."], [25, "That is only the jump after 12:00. Add the 10 minutes before it."], [10, "That is only the first jump. Add the 25 after 12:00."]],
          hint: "11:50 to 12:00, then 12:00 to 12:25.",
          why: "10 + 25 = <b>35 minutes</b>." },
        spicy: { q: "Now on your own. [[Event]] starts at 1:40 pm and ends at 3:05 pm. How long is it, in hours and minutes?",
          fig: "",
          boxes: [{ label: "Hours", a: 1, post: "h" }, { label: "Minutes", a: 25, post: "min" }],
          slips: [[1, 65, "Treating times like hundreds gives 165, but 65 minutes is more than an hour. Use jumps: 20 + 60 + 5."], [0, 2, "Two hours would take you to 3:40. It finishes before that."], [1, 45, "Check the first jump: 1:40 to 2:00 is 20 minutes."]],
          hint: "1:40 to 2:00, 2:00 to 3:00, 3:00 to 3:05.",
          why: "20 + 60 + 5 = 85 minutes, which is <b>1 hour 25 minutes</b>." } } },

    { type: "mc", topic: "How long did it take?",
      q: "Which is the same as half an hour?",
      options: ["30 minutes", "50 minutes", "12 minutes"],
      answer: 0,
      slips: { 1: "That treats an hour as 100 minutes. An hour is 60, so half is 30.", 2: "12 is the number at the top of the clock, not half an hour." },
      hint: "An hour is 60 minutes. What is half of 60?",
      why: "Half of 60 minutes is <b>30 minutes</b>.",
      lv: {
        medium: { q: "Which is the same as 1 hour 15 minutes?",
          options: ["75 minutes", "115 minutes", "65 minutes"],
          slips: { 1: "That treats an hour as 100 minutes. It is 60 + 15.", 2: "Check the adding: 60 + 15." },
          hint: "1 hour is 60 minutes.",
          why: "60 + 15 = <b>75 minutes</b>." },
        spicy: { q: "Which is the same as 2.5 hours?",
          options: ["2 hours 30 minutes", "2 hours 50 minutes", "250 minutes"],
          slips: { 1: "0.5 of an hour is half of 60, which is 30 minutes, not 50.", 2: "2.5 hours is 150 minutes. Hours are 60 minutes, not 100." },
          hint: "What is half of 60?",
          why: "0.5 hours is 30 minutes, so 2.5 hours is <b>2 hours 30 minutes</b>." } } },

    /* ---------- chunk 5 ---------- */
    { type: "learn", topic: "Record it", title: "Guess, measure, write it down",
      fig: RECORD,
      html: "<p>Good measurers do three things.</p>" +
        "<p><b>1. Guess first.</b> It trains your eye.<br><b>2. Measure</b> with the right tool.<br><b>3. Write it down</b> with the number <b>and</b> the unit.</p>" +
        "<p>Guesses do not need to be close. Seeing how far off they were is half the fun.</p>",
      lv: { spicy: { html: "<p>Good measurers do four things.</p>" +
        "<p><b>1. Guess first.</b> It trains your eye.<br><b>2. Pick the tool and the unit</b> that suit the size.<br><b>3. Measure twice</b> if it matters.<br><b>4. Write it down</b> with the number, the unit, and how exact it is, like \"to the nearest cm\".</p>" +
        "<p>Builders say: measure twice, cut once.</p>" } } },

    { type: "mc", topic: "Record it",
      q: "Which is the best way to write down how long a table is?",
      options: ["120 cm", "120", "Quite long", "120 kg"],
      answer: 0,
      slips: { 1: "120 what? It needs a unit.", 2: "Quite long is a describing word. Nobody could check it.", 3: "kg is for mass, not length." },
      hint: "Number and unit.",
      why: "<b>120 cm</b> has a number and a length unit. Anyone could check it.",
      lv: {
        medium: { q: "Which is the best way to write down the length of [[trip]]?",
          options: ["4.5 km", "4 500 000 mm", "4.5", "4.5 kg"],
          slips: { 1: "That is the same distance, but the number is so big it is hard to picture.", 2: "4.5 what? It needs a unit.", 3: "kg is for mass, not distance." },
          hint: "Pick the unit that suits a journey.",
          why: "<b>4.5 km</b>: a number, and a unit that suits a journey." },
        spicy: { q: "Two people measure the same [[item]]. One gets 8.4 cm, the other 8.6 cm. What is the most sensible next step?",
          options: ["Measure again, lining it up with 0", "Always pick the bigger one", "Write 8 cm and stop", "Weigh it instead"],
          slips: { 1: "Bigger is not always more accurate. Check how it was measured.", 2: "That throws away detail. A careful measure can do better.", 3: "Weighing tells you mass, not length." },
          hint: "Measure twice, cut once.",
          why: "Measure again carefully. One of them probably did not start at 0." } } },

    { type: "widget", topic: "Record it", unscored: true,
      title: "Measure hunt",
      html: "<p>A real world bit, only if you fancy it. Your list can go to Jay with the rest if you send it.</p>",
      mount: huntWidget,
      report: function(d){
        var r = (d && d.rows || []).filter(function(x){ return x && x.what && (x.got || x.guess); });
        return r.length ? "Measure hunt: " + r.map(function(x){ return x.what + " (guess " + (x.guess || "-") + ", measured " + (x.got || "-") + " " + x.unit + ")"; }).join("; ") : "";
      } },

    { type: "text", topic: "Record it",
      q: "Write one measurement as a sentence: what it is, the number and the unit. One from your hunt, or one you know.",
      need: [["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "half"],
        ["mm", "cm", "m", "km", "g", "kg", "ml", "l", "litre", "metre", "meter", "millimetre", "centimetre", "kilometre", "gram", "kilogram", "kilo", "second", "minute", "hour", "min", "sec", "h"]],
      model: "The table is 120 cm long.",
      slips: [[["long", "big", "heavy", "small", "short"], "Swap the describing word for a number and a unit, like 120 cm."]],
      hint: "Something like: The mug holds 350 ml.",
      why: "A number and a unit, so anyone could check it. Like: The mug holds 350 ml." }
  ],

  realWorld: {
    title: "Measuring is everywhere",
    html: "<p>Cooks weigh flour in grams. Nurses measure medicine in ml. Builders measure in mm, because a gap of 5 mm can stop a door shutting. Bus and train timetables are all about how long it takes.</p>" +
      "<p>For our big question: if we could time travel, should we? Go back 200 years and people measured in inches, feet, pounds and pints, and towns did not always agree on how big those were. Measuring in the same units is what lets everyone share. A time traveller would need to pack a conversion chart.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to a time portal, holding up a ruler">' + A2ART.portal(80, 75, 56) + A2ART.jay(240, 48, 0.85, "smile") +
      '<rect x="168" y="112" width="20" height="36" rx="3" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>' +
      A2ART.bubble(290, 6, 124, 52, "Inches?\nPints? Hmm.", 294) + '</svg>'
  },

  make: {
    title: "Make a measuring card",
    intro: "One thing you measured (or would like to), with the number and the unit. Keep it, stick it up, or send it to Jay.",
    fields: [
      { id: "what", label: "What I measured", ph: "The kitchen table", max: 40 },
      { id: "result", label: "Number and unit", ph: "120 cm long", max: 20 },
      { id: "tool", label: "What I used", ph: "A tape measure", max: 30 },
      { id: "name", label: "Measured by", ph: "Agent Tape", max: 24 }
    ],
    svg: function(v){
      var what = wrap(v.what, 23, 2), res = wrap(v.result, 20, 1)[0] || "", tool = wrap(v.tool, 34, 1)[0] || "", nm = wrap(v.name, 24, 1)[0] || "";
      var tk = "";
      for(var i = 0; i <= 54; i++) tk += "M" + (30 + i * 10) + " 352v" + (i % 10 === 0 ? 22 : i % 5 === 0 ? 15 : 9);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#fffdf6"/>' +
        '<rect x="12" y="12" width="576" height="376" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        T(36, 60, "MEASURED IT", 24, { b: 1, c: "#e07a1f" }) +
        what.map(function(l, k){ return T(36, 104 + k * 32, esc(l), 26, { b: 1 }); }).join("") +
        '<rect x="36" y="170" width="400" height="74" rx="14" fill="#ffd23f" fill-opacity=".45"/>' +
        T(52, 220, esc(res), Math.min(30, Math.floor(380 / Math.max(1, res.length) / 0.62)), { b: 1 }) +
        T(36, 286, "Tool: " + esc(tool), 18) +
        T(36, 320, "Measured by: " + esc(nm), 18, { c: "#5b6180" }) +
        '<g transform="translate(520 92)"><circle r="46" fill="#19c39a" fill-opacity=".25" stroke="#141a33" stroke-width="3"/>' +
        '<rect x="-34" y="-10" width="68" height="20" rx="3" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/><path d="M-24 -10v9M-12 -10v6M0 -10v9M12 -10v6M24 -10v9" stroke="#141a33" stroke-width="2"/></g>' +
        '<rect x="20" y="346" width="560" height="34" rx="6" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/><path d="' + tk + '" stroke="#141a33" stroke-width="1.6"/>' +
        '</svg>';
    }
  }
};
})();
