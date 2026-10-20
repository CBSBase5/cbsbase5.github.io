/* Base 5 Autumn 2 activity: Convert it.
   Maths. Converting between units: cm and m, g and kg, ml and l,
   minutes and hours, pence and pounds. ASCII only. */
(function(){
var A = window.A2ART;
var FONT = 'font-family="Verdana,Arial,sans-serif"';
var INK = "#141a33";
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || INK) + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }

/* ---------- pictures ---------- */
var MAGIC = [["1 m", "100 cm", "#22b8e6"], ["1 kg", "1000 g", "#19c39a"], ["1 l", "1000 ml", "#8a5cf6"], ["1 hour", "60 min", "#ff8a3d"], ["&#163;1", "100p", "#ffd23f"]];
var FIVE = '<svg viewBox="0 0 540 190" role="img" aria-label="The five magic numbers: 1 m is 100 cm, 1 kg is 1000 g, 1 l is 1000 ml, 1 hour is 60 minutes, 1 pound is 100p">' +
  '<rect width="540" height="190" rx="16" fill="#f4f1ea"/>' +
  MAGIC.map(function(c, k){
    var x = 16 + k * 104;
    return '<rect x="' + x + '" y="26" width="92" height="124" rx="12" fill="#fff" stroke="' + c[2] + '" stroke-width="4"/>' +
      '<rect x="' + x + '" y="26" width="92" height="40" rx="12" fill="' + c[2] + '"/><rect x="' + x + '" y="50" width="92" height="16" fill="' + c[2] + '"/>' +
      T(x + 46, 54, c[0], 17, { b: 1, a: "middle" }) + T(x + 46, 98, "=", 18, { a: "middle", c: "#5b6180" }) + T(x + 46, 130, c[1], 17, { b: 1, a: "middle" });
  }).join("") +
  T(270, 178, "Time is the odd one out: 60, not 100 or 1000.", 14, { a: "middle", c: "#5b6180" }) +
  A2ART.egg(A2ART.bird(522, 20, 0.5, "#19c39a"), "1 bird = 1 bird. The easiest conversion of all. Jay's favourite.") + '</svg>';

/* the stairs: big unit at the top, small at the bottom */
function STAIRS(big, small, by, eg){
  return '<svg viewBox="0 0 540 230" role="img" aria-label="Big unit to small unit: multiply. Small unit to big unit: divide.">' +
    '<rect width="540" height="230" rx="16" fill="#f4f1ea"/>' +
    '<path d="M150 50h120v60h120v60h-240z" fill="#fde7b0" stroke="' + INK + '" stroke-width="3"/>' +
    T(210, 88, big, 22, { b: 1, a: "middle" }) + T(330, 150, small, 22, { b: 1, a: "middle" }) + T(210, 44, "big unit", 13, { a: "middle", c: "#5b6180" }) + T(330, 188, "small unit", 13, { a: "middle", c: "#5b6180" }) +
    '<path d="M282 60q60 -10 60 36" fill="none" stroke="#e04848" stroke-width="4"/><path d="M334 92l8 12 8 -12z" fill="#e04848"/>' +
    T(360, 56, "x " + by, 20, { b: 1, c: "#e04848" }) + T(360, 76, "number gets bigger", 13, { c: "#e04848" }) +
    '<path d="M120 150q-50 -10 -30 -70" fill="none" stroke="#3a8fd6" stroke-width="4"/><path d="M84 88l8 -12 6 13z" fill="#3a8fd6"/>' +
    T(40, 186, "/ " + by, 20, { b: 1, c: "#3a8fd6" }) + T(40, 206, "number gets smaller", 13, { c: "#3a8fd6" }) +
    (eg ? T(520, 214, eg, 15, { b: 1, a: "end" }) : "") + '</svg>';
}

/* a metre stick split into 100 cm */
var METRE = '<svg viewBox="0 0 540 170" role="img" aria-label="Three metre sticks, each 100 cm, making 300 cm">' +
  '<rect width="540" height="170" rx="16" fill="#f4f1ea"/>' +
  [0, 1, 2].map(function(k){
    var x = 30 + k * 160, out = '<rect x="' + x + '" y="50" width="160" height="34" fill="' + ["#ffd23f", "#22b8e6", "#ff5d8f"][k] + '" stroke="' + INK + '" stroke-width="2.5"/>';
    for(var i = 1; i < 10; i++) out += '<path d="M' + (x + i * 16) + ' 50v' + (i === 5 ? 16 : 9) + '" stroke="' + INK + '" stroke-width="1.5"/>';
    return out + T(x + 80, 76, "1 m", 15, { b: 1, a: "middle" }) + T(x + 80, 108, "100 cm", 14, { a: "middle" });
  }).join("") +
  T(270, 36, "3 m", 18, { b: 1, a: "middle" }) + T(270, 146, "3 x 100 = 300 cm", 18, { b: 1, a: "middle", c: "#1f9d63" }) + '</svg>';

/* a jug: 250 ml marks */
var JUG = '<svg viewBox="0 0 540 220" role="img" aria-label="A 1 litre jug marked every 250 ml">' +
  '<rect width="540" height="220" rx="16" fill="#f4f1ea"/>' +
  '<path d="M180 30h150l-10 170h-130z" fill="#e8f7ff" stroke="' + INK + '" stroke-width="3"/>' +
  '<path d="M186 100h138l-6 100h-126z" fill="#22b8e6" fill-opacity=".55"/>' +
  '<path d="M330 50q50 10 40 60q-6 30 -46 30" fill="none" stroke="' + INK + '" stroke-width="5"/>' +
  [[50, "1000 ml = 1 l"], [87, "750 ml"], [125, "500 ml"], [162, "250 ml"]].map(function(m){
    return '<path d="M184 ' + m[0] + 'h30" stroke="' + INK + '" stroke-width="2.5"/>' + T(170, m[0] + 5, m[1], 14, { b: 1, a: "end" });
  }).join("") +
  T(400, 180, "Each mark: 250 ml", 14, { c: "#5b6180" }) + '</svg>';

/* a clock: 60 minutes go round once */
var CLOCK = '<svg viewBox="0 0 540 210" role="img" aria-label="A clock: 60 minutes make 1 hour, and 90 minutes is 1 hour 30 minutes">' +
  '<rect width="540" height="210" rx="16" fill="#f4f1ea"/>' +
  '<circle cx="130" cy="104" r="76" fill="#fff" stroke="' + INK + '" stroke-width="4"/>' +
  '<path d="M130 104L130 28A76 76 0 1 1 129.9 28Z" fill="#ff8a3d" fill-opacity=".35"/>' +
  (function(){ var o = ""; for(var i = 0; i < 12; i++){ var a = i * Math.PI / 6; o += '<path d="M' + (130 + 66 * Math.sin(a)).toFixed(1) + ' ' + (104 - 66 * Math.cos(a)).toFixed(1) + 'L' + (130 + 74 * Math.sin(a)).toFixed(1) + ' ' + (104 - 74 * Math.cos(a)).toFixed(1) + '" stroke="' + INK + '" stroke-width="3"/>'; } return o; })() +
  '<path d="M130 104V44" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/><circle cx="130" cy="104" r="5" fill="' + INK + '"/>' +
  T(130, 200, "60 min = 1 hour", 15, { b: 1, a: "middle" }) +
  T(250, 70, "90 minutes", 20, { b: 1 }) + T(250, 104, "= 60 + 30", 18) + T(250, 140, "= 1 hour 30 min", 20, { b: 1, c: "#1f9d63" }) +
  T(250, 176, "Not 1.30 and not 1.9!", 14, { c: "#5b6180" }) + '</svg>';

/* a plain clock for questions (no worked answer on it) */
var CLOCK0 = '<svg viewBox="0 0 540 210" role="img" aria-label="A clock: 60 minutes make 1 hour">' +
  '<rect width="540" height="210" rx="16" fill="#f4f1ea"/>' +
  '<circle cx="130" cy="104" r="76" fill="#fff" stroke="' + INK + '" stroke-width="4"/>' +
  '<path d="M130 104L130 28A76 76 0 1 1 129.9 28Z" fill="#ff8a3d" fill-opacity=".35"/>' +
  (function(){ var o = ""; for(var i = 0; i < 12; i++){ var a = i * Math.PI / 6; o += '<path d="M' + (130 + 66 * Math.sin(a)).toFixed(1) + ' ' + (104 - 66 * Math.cos(a)).toFixed(1) + 'L' + (130 + 74 * Math.sin(a)).toFixed(1) + ' ' + (104 - 74 * Math.cos(a)).toFixed(1) + '" stroke="' + INK + '" stroke-width="3"/>'; } return o; })() +
  '<path d="M130 104V44" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/><circle cx="130" cy="104" r="5" fill="' + INK + '"/>' +
  T(250, 90, "Once round the clock:", 18) + T(250, 124, "60 minutes = 1 hour", 22, { b: 1, c: "#e04848" }) +
  T(250, 160, "Time uses 60, not 100.", 15, { c: "#5b6180" }) + '</svg>';

/* scales: compare in the same unit */
function SCALES(l, r, tipLeft){
  var tilt = tipLeft === 0 ? 0 : tipLeft ? -6 : 6;
  return '<svg viewBox="0 0 540 220" role="img" aria-label="A balance comparing ' + l + ' and ' + r + '">' +
    '<rect width="540" height="220" rx="16" fill="#f4f1ea"/>' +
    '<path d="M270 70v110M220 196h100" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    '<g transform="rotate(' + tilt + ' 270 70)"><path d="M120 70h300" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M120 70l-36 60h72z M420 70l-36 60h72z" fill="none" stroke="' + INK + '" stroke-width="2"/>' +
    '<path d="M80 130h80q-6 22 -40 22t-40 -22z" fill="#ffd23f" stroke="' + INK + '" stroke-width="2.5"/>' +
    '<path d="M380 130h80q-6 22 -40 22t-40 -22z" fill="#22b8e6" stroke="' + INK + '" stroke-width="2.5"/>' +
    T(120, 147, l, 16, { b: 1, a: "middle" }) + T(420, 147, r, 16, { b: 1, a: "middle" }) + '</g>' +
    '<circle cx="270" cy="70" r="7" fill="#e04848"/></svg>';
}

/* Jay's bird feeder */
var FEEDER = '<svg viewBox="0 0 520 210" role="img" aria-label="Jay next to a bird feeder with a bird on it, and a bag of seed">' +
  '<rect width="520" height="210" rx="16" fill="#e8f7ff"/><rect y="180" width="520" height="30" fill="#9ccc65"/>' +
  '<path d="M150 180V40" stroke="#7a5532" stroke-width="6"/><path d="M110 60h80" stroke="#7a5532" stroke-width="5"/>' +
  '<path d="M150 60v14" stroke="' + INK + '" stroke-width="2"/><rect x="130" y="74" width="40" height="70" rx="8" fill="#e8f7ff" stroke="' + INK + '" stroke-width="3"/>' +
  '<rect x="134" y="100" width="32" height="40" rx="5" fill="#d2a050"/><path d="M122 146h56" stroke="' + INK + '" stroke-width="4"/>' +
  A2ART.bird(196, 136, 0.8, "#ff5d5d") +
  '<path d="M250 180v-58q0 -10 10 -10h50q10 0 10 10v58z" fill="#c99a63" stroke="' + INK + '" stroke-width="3"/>' + T(285, 156, "SEED", 14, { b: 1, a: "middle" }) +
  A2ART.jay(420, 96, 0.9, "smile") + '</svg>';

(window.A2PACKS = window.A2PACKS || {})["convert-it"] = {
  a2: true,
  id: "a2-convert-it",
  title: "Convert it",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 25,
  line: "Switch between units: cm and m, g and kg, ml and l, minutes and hours, pence and pounds.",
  blurb: "Converting between units. Four short chunks: the magic numbers, big to small, small to big, and mixed units in real life. You make your own conversion card at the end.",
  note: "Switching between units like cm and m, or minutes and hours. Four five minute chunks and a conversion card to make, whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Small change", line: "Small change: whole numbers, one step at a time." },
    { id: "medium", name: "Switcheroo", line: "Switcheroo: decimals, hours and minutes, and mixed units." },
    { id: "spicy", name: "Unit wizard", line: "Unit wizard: mm and km, tricky decimals, and problems with more than one step." }
  ],
  themes: {
    time: { name: "Time travel", w: { long: "time machine cable", heavy: "bag of fossils", drink: "bottle of time machine fuel", event: "trip to the past", buy: "museum ticket" } },
    football: { name: "Football", w: { long: "goal net rope", heavy: "kit bag", drink: "water bottle", event: "match", buy: "match programme" } },
    horror: { name: "Horror", w: { long: "creepy old rope", heavy: "bag of rusty keys", drink: "bottle of bubbling potion", event: "ghost walk", buy: "torch battery" } },
    fishing: { name: "Fishing", w: { long: "fishing line", heavy: "carp", drink: "flask of tea", event: "fishing match", buy: "bag of bait" } },
    music: { name: "Music", w: { long: "microphone cable", heavy: "speaker", drink: "bottle of water", event: "show", buy: "show programme" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: FIVE,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "The magic numbers", title: "Five magic numbers",
      fig: FIVE,
      html: "<p>Converting means writing the same amount in a different unit. You only need five <b>magic numbers</b>.</p>" +
        "<p>1 m = <b>100</b> cm. 1 kg = <b>1000</b> g. 1 l = <b>1000</b> ml. 1 hour = <b>60</b> minutes. &pound;1 = <b>100</b>p.</p>",
      lv: { spicy: { html: "<p>Converting means writing the same amount in a different unit. Learn the <b>magic numbers</b>:</p>" +
        "<p>1 m = <b>100</b> cm. 1 kg = <b>1000</b> g. 1 l = <b>1000</b> ml. 1 hour = <b>60</b> minutes. &pound;1 = <b>100</b>p.</p>" +
        "<p>Two more for you: 1 cm = <b>10</b> mm, and 1 km = <b>1000</b> m. \"Kilo\" always means a thousand.</p>" } } },

    { type: "match", topic: "The magic numbers",
      q: "Match each one to the same amount.",
      pairs: [["1 m", "100 cm"], ["1 kg", "1000 g"], ["1 hour", "60 minutes"], ["&pound;1", "100p"]],
      hint: "Look back at the five magic numbers, if you like.",
      why: "1 m = 100 cm, 1 kg = 1000 g, 1 hour = 60 minutes, &pound;1 = 100p.",
      lv: { medium: { pairs: [["1 m", "100 cm"], ["1 kg", "1000 g"], ["1 l", "1000 ml"], ["1 hour", "60 minutes"], ["&pound;1", "100p"]] },
        spicy: { pairs: [["1 m", "100 cm"], ["1 kg", "1000 g"], ["1 hour", "60 minutes"], ["&pound;1", "100p"], ["1 cm", "10 mm"], ["1 km", "1000 m"]] } } },

    { type: "sort", topic: "The magic numbers",
      q: "Which magic number links each pair?",
      buckets: ["100", "1000", "60"],
      cards: [["cm and m", 0], ["g and kg", 1], ["minutes and hours", 2], ["pence and pounds", 0]],
      hint: "Only one pair uses 60.",
      why: "cm and m, and pence and pounds, use 100. g and kg use 1000. Minutes and hours use 60.",
      lv: { medium: { cards: [["cm and m", 0], ["g and kg", 1], ["minutes and hours", 2], ["pence and pounds", 0], ["ml and l", 1]],
          why: "cm/m and p/&pound; use 100. g/kg and ml/l use 1000. Minutes and hours use 60." },
        spicy: { buckets: ["10", "100", "1000", "60"],
          cards: [["mm and cm", 0], ["cm and m", 1], ["m and km", 2], ["ml and l", 2], ["minutes and hours", 3], ["seconds and minutes", 3]],
          hint: "Kilo means 1000. Time uses 60. Millimetres to centimetres is the small one.",
          why: "mm/cm: 10. cm/m: 100. m/km and ml/l: 1000. Seconds, minutes and hours: 60." } } },

    { type: "mc", topic: "The magic numbers",
      q: "How many minutes are in one hour?",
      options: ["60", "100", "1000"],
      answer: 0,
      slips: { 1: "Time is the odd one out: it uses 60, not 100.", 2: "That is the number for kilograms and litres." },
      hint: "Think of a clock: the minute hand goes round once.",
      why: "60 minutes make 1 hour. Time does not use 100.",
      lv: { spicy: { q: "How many seconds are in one hour?",
          options: ["3600", "360", "6000"],
          slips: { 1: "That is 60 x 6. You need 60 x 60.", 2: "That uses 100 somewhere. Time is 60 seconds in a minute, 60 minutes in an hour." },
          hint: "60 seconds in a minute, 60 minutes in an hour.",
          why: "60 x 60 = 3600 seconds in an hour." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Big to small", title: "Big unit to small unit: multiply",
      routes: [
        { name: "Worked example", fig: STAIRS("m", "cm", 100, "3 m = 3 x 100 = 300 cm"),
          html: "<p>Going from a <b>big unit</b> to a <b>small unit</b>, you need <b>more</b> of them, so <b>multiply</b>.</p>" +
            "<p>Convert 3 m to cm.<br><b>Step 1:</b> the magic number for m and cm is 100.<br><b>Step 2:</b> big to small, so multiply: 3 x 100.<br><b>Answer:</b> 300 cm.</p>" },
        { name: "See it", fig: METRE,
          html: "<p>Every metre is 100 cm. Three metres side by side are 100 + 100 + 100 = <b>300 cm</b>. Multiplying is just a quick way to do that.</p>" }
      ],
      lv: { spicy: { routes: [
        { name: "Worked example", fig: STAIRS("kg", "g", 1000, "2.35 kg = 2350 g"),
          html: "<p>Big unit to small unit: you need <b>more</b> of them, so <b>multiply</b>.</p>" +
            "<p>Convert 2.35 kg to g.<br><b>Step 1:</b> the magic number for kg and g is 1000.<br><b>Step 2:</b> big to small, so multiply: 2.35 x 1000. Each digit moves three places bigger.<br><b>Answer:</b> 2350 g.</p>" },
        { name: "See it", fig: METRE,
          html: "<p>Every metre is 100 cm, so 3 m is 300 cm. Same idea with kilograms: every kg is 1000 g, so 2 kg is 2000 g and 0.35 kg is 350 g. Together: 2350 g.</p>" } ] } } },

    { type: "num", topic: "Big to small",
      q: "Fill in the steps. Convert 4 kg to grams.",
      fig: STAIRS("kg", "g", "?"),
      boxes: [{ label: "Multiply by", a: 1000 }, { label: "Grams", a: 4000, post: "g" }],
      slips: [[0, 100, "That is the number for cm and m. For g and kg, it is 1000."], [1, 400, "That multiplied by 100. Kilograms to grams uses 1000."]],
      hint: "1 kg = 1000 g.",
      why: "Multiply by 1000: 4 x 1000 = <b>4000 g</b>.",
      lv: { medium: { q: "Fill in the steps. Convert 2.4 kg to grams.",
          boxes: [{ label: "Multiply by", a: 1000 }, { label: "Grams", a: 2400, post: "g" }],
          slips: [[0, 100, "That is the number for cm and m. For g and kg, it is 1000."], [1, 240, "That multiplied by 100. Kilograms to grams uses 1000."], [1, 2.4, "Big to small: the number should get bigger."]],
          hint: "1 kg = 1000 g. 2.4 x 1000.",
          why: "2.4 x 1000 = <b>2400 g</b>." },
        spicy: { q: "Fill in the steps. Convert 0.85 km to metres.",
          fig: STAIRS("km", "m", "?"),
          boxes: [{ label: "Multiply by", a: 1000 }, { label: "Metres", a: 850, post: "m" }],
          slips: [[0, 100, "Kilo means 1000."], [1, 85, "That multiplied by 100. Kilometres to metres uses 1000."], [1, 8500, "One place too far. 0.85 x 1000 = 850."]],
          hint: "1 km = 1000 m. 0.85 x 1000.",
          why: "0.85 x 1000 = <b>850 m</b>." } } },

    { type: "num", topic: "Big to small",
      q: "The [[event]] lasts 3 hours. How many minutes is that?",
      fig: CLOCK0,
      boxes: [{ label: "Minutes", a: 180, post: "min" }],
      slips: [[300, "That used 100. An hour is 60 minutes."], [63, "That added. Each hour is 60 minutes, so multiply."]],
      hint: "3 lots of 60.",
      why: "3 x 60 = <b>180 minutes</b>.",
      lv: { medium: { q: "The [[event]] lasts 2.5 hours. How many minutes is that?",
          boxes: [{ label: "Minutes", a: 150, post: "min" }],
          slips: [[250, "That used 100. An hour is 60 minutes."], [125, "Half an hour is 30 minutes, not 5."]],
          hint: "2 hours is 120 minutes. Half an hour is 30 more.",
          why: "2 x 60 = 120, plus half of 60 = 30. Total: <b>150 minutes</b>." },
        spicy: { q: "The [[event]] lasts 3.75 hours. How many minutes is that?",
          boxes: [{ label: "Minutes", a: 225, post: "min" }],
          slips: [[375, "That used 100. An hour is 60 minutes."], [255, "That reads .75 as 75 minutes. 0.75 of an hour is three quarters: 45 minutes."]],
          hint: "3 hours, plus three quarters of an hour.",
          why: "3 x 60 = 180, and 0.75 x 60 = 45. Total: <b>225 minutes</b>." } } },

    { type: "num", topic: "Big to small",
      q: "A [[buy]] costs &pound;4. How many pence is that?",
      boxes: [{ label: "Pence", a: 400, post: "p" }],
      slips: [[40, "That is only 40p. Each pound is 100p."], [4000, "That used 1000. Pounds to pence uses 100."]],
      hint: "&pound;1 = 100p.",
      why: "4 x 100 = <b>400p</b>.",
      lv: { medium: { q: "A [[buy]] costs &pound;3.45. How many pence is that?",
          boxes: [{ label: "Pence", a: 345, post: "p" }],
          slips: [[34.5, "That multiplied by 10. Pounds to pence uses 100."], [3450, "That used 1000. Pounds to pence uses 100."]],
          hint: "3.45 x 100.",
          why: "3.45 x 100 = <b>345p</b>." },
        spicy: { q: "A [[buy]] costs &pound;12.05. How many pence is that?",
          boxes: [{ label: "Pence", a: 1205, post: "p" }],
          slips: [[125, "The zero matters: it shows there are no tens of pence. 12.05 x 100 = 1205."], [1250, "That reads .05 as 50p. It is 5p."]],
          hint: "12.05 x 100. Watch the zero.",
          why: "12.05 x 100 = <b>1205p</b>." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Small to big", title: "Small unit to big unit: divide",
      routes: [
        { name: "Worked example", fig: STAIRS("m", "cm", 100, "250 cm = 250 / 100 = 2.5 m"),
          html: "<p>Going from a <b>small unit</b> to a <b>big unit</b>, you need <b>fewer</b> of them, so <b>divide</b>.</p>" +
            "<p>Convert 250 cm to m.<br><b>Step 1:</b> the magic number for cm and m is 100.<br><b>Step 2:</b> small to big, so divide: 250 / 100.<br><b>Answer:</b> 2.5 m.</p>" },
        { name: "Time", fig: CLOCK,
          html: "<p>Time is the tricky one, because an hour is <b>60</b> minutes, not 100.</p>" +
            "<p>90 minutes: take out one hour (60 minutes) and 30 minutes are left. So 90 minutes is <b>1 hour 30 minutes</b>.</p>" }
      ] },

    { type: "num", topic: "Small to big",
      q: "Fill in the steps. A [[drink]] holds 3000 ml. How many litres?",
      fig: JUG,
      boxes: [{ label: "Divide by", a: 1000 }, { label: "Litres", a: 3, post: "l" }],
      slips: [[0, 100, "That is the number for cm and m. For ml and l, it is 1000."], [1, 30, "That divided by 100. Millilitres to litres uses 1000."], [1, 3000000, "Small to big: divide, so the number gets smaller."]],
      hint: "1000 ml = 1 l.",
      why: "3000 / 1000 = <b>3 litres</b>.",
      lv: { medium: { q: "Fill in the steps. A [[drink]] holds 750 ml. How many litres?",
          boxes: [{ label: "Divide by", a: 1000 }, { label: "Litres", a: 0.75, post: "l" }],
          slips: [[0, 100, "For ml and l, the magic number is 1000."], [1, 7.5, "That divided by 100. Millilitres to litres uses 1000."], [1, 750000, "Small to big: divide, so the number gets smaller."]],
          hint: "750 / 1000. Look at the jug: 750 ml is three quarters of a litre.",
          why: "750 / 1000 = <b>0.75 l</b>. Three quarters of a litre." },
        spicy: { q: "Fill in the steps. A [[drink]] holds 2250 ml. How many litres?",
          boxes: [{ label: "Divide by", a: 1000 }, { label: "Litres", a: 2.25, post: "l" }],
          slips: [[0, 100, "For ml and l, the magic number is 1000."], [1, 22.5, "That divided by 100. Millilitres to litres uses 1000."], [1, 2.5, "Close. 2250 / 1000 = 2.25, not 2.5."]],
          hint: "2250 / 1000. Each digit moves three places smaller.",
          why: "2250 / 1000 = <b>2.25 l</b>." } } },

    { type: "num", topic: "Small to big",
      q: "You have 600p. How many pounds is that?",
      boxes: [{ label: "Pounds", a: 6, pre: "&pound;" }],
      slips: [[60, "That divided by 10. Pence to pounds uses 100."], [60000, "Small to big: divide, so the number gets smaller."]],
      hint: "600 / 100.",
      why: "600 / 100 = <b>&pound;6</b>.",
      lv: { medium: { q: "You have 1250p. How much is that in pounds?",
          boxes: [{ label: "Pounds", a: 12.5, pre: "&pound;" }],
          slips: [[125, "That divided by 10. Pence to pounds uses 100."], [1.25, "That divided by 1000. Pence to pounds uses 100."]],
          hint: "1250 / 100.",
          why: "1250 / 100 = <b>&pound;12.50</b>." },
        spicy: { q: "You have 3005p. How much is that in pounds?",
          boxes: [{ label: "Pounds", a: 30.05, pre: "&pound;" }],
          slips: [[30.5, "That is &pound;30.50. 3005p is &pound;30 and 5p, so &pound;30.05."], [300.5, "That divided by 10. Pence to pounds uses 100."]],
          hint: "3005 / 100. How many whole pounds, and how many pence left?",
          why: "3005 / 100 = <b>&pound;30.05</b>: 30 pounds and 5 pence." } } },

    { type: "num", topic: "Small to big", explain: true,
      q: "The [[event]] lasts 120 minutes. How many hours is that?",
      fig: CLOCK0,
      boxes: [{ label: "Hours", a: 2, post: "hours" }],
      slips: [[1.2, "That divided by 100. An hour is 60 minutes."], [12, "That divided by 10. An hour is 60 minutes."]],
      hint: "How many 60s make 120?",
      why: "120 / 60 = <b>2 hours</b>.",
      lv: { medium: { q: "The [[event]] lasts 90 minutes. How long is that in hours and minutes?",
          boxes: [{ label: "Hours", a: 1 }, { label: "Minutes", a: 30 }],
          slips: [[1, 50, "90 / 60 = 1.5, but 0.5 of an hour is 30 minutes, not 50."], [0, 0.9, "That divided by 100. An hour is 60 minutes."]],
          hint: "One hour is 60 minutes. How many minutes are left over?",
          why: "90 = 60 + 30, so <b>1 hour 30 minutes</b>." },
        spicy: { q: "The [[event]] lasts 200 minutes. How long is that in hours and minutes?",
          boxes: [{ label: "Hours", a: 3 }, { label: "Minutes", a: 20 }],
          slips: [[1, 33, "200 / 60 = 3.33, but 0.33 of an hour is 20 minutes, not 33."], [0, 2, "Two hours is only 120 minutes. Three hours is 180."]],
          hint: "How many whole 60s fit into 200? Then what is left?",
          why: "3 x 60 = 180, and 200 - 180 = 20. So <b>3 hours 20 minutes</b>." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Mixed units", title: "Same unit first, then compare",
      fig: SCALES("1.2 kg", "900 g", true),
      html: "<p>When two amounts are in different units, <b>convert one so they match</b>. Then compare or add.</p>" +
        "<p>1.2 kg or 900 g? Convert: 1.2 kg = 1200 g. Now it is easy: <b>1200 g is heavier</b> than 900 g. The bigger number (900) was not the bigger amount.</p>" },

    { type: "mc", topic: "Mixed units",
      q: "Which [[heavy]] is heavier?",
      fig: SCALES("2 kg", "1500 g", 0),
      options: ["The 2 kg one", "The 1500 g one", "They weigh the same"],
      answer: 0, fixed: true,
      slips: { 1: "1500 looks bigger, but 2 kg is 2000 g.", 2: "Convert first: 2 kg = 2000 g." },
      hint: "Turn the kg into grams.",
      why: "2 kg = 2000 g, which is more than 1500 g.",
      lv: { medium: { fig: SCALES("1.2 kg", "900 g", 0), options: ["The 1.2 kg one", "The 900 g one", "They weigh the same"],
          slips: { 1: "900 looks bigger than 1.2, but 1.2 kg is 1200 g.", 2: "Convert first: 1.2 kg = 1200 g." },
          why: "1.2 kg = 1200 g, which is more than 900 g." },
        spicy: { fig: SCALES("0.65 kg", "640 g", 0), options: ["The 0.65 kg one", "The 640 g one", "They weigh the same"],
          slips: { 1: "Convert first: 0.65 kg = 650 g, which is 10 g more.", 2: "Very close. 0.65 kg = 650 g, so not quite the same." },
          why: "0.65 kg = 650 g, which is 10 g more than 640 g." } } },

    { type: "num", topic: "Mixed units",
      q: "You pour 1 l and then 500 ml into a big jug. How many ml altogether?",
      fig: JUG,
      boxes: [{ label: "Altogether", a: 1500, post: "ml" }],
      slips: [[501, "That added 1 and 500. Change the 1 l into 1000 ml first."], [600, "1 l is 1000 ml, not 100 ml."]],
      hint: "1 l = 1000 ml.",
      why: "1000 ml + 500 ml = <b>1500 ml</b>.",
      lv: { medium: { q: "You pour 1.5 l and then 750 ml into a big jug. How many litres altogether?",
          boxes: [{ label: "Altogether", a: 2.25, post: "l" }],
          slips: [[751.5, "That added 1.5 and 750 in different units. Make them match first."], [9, "That added 1.5 and 7.5. 750 ml is 0.75 l."], [2250, "Right amount, but in ml. The question asks for litres."]],
          hint: "750 ml = 0.75 l. Then add.",
          why: "1.5 + 0.75 = <b>2.25 l</b>." },
        spicy: { q: "A 2 l [[drink]] is poured into cups of 250 ml. How many cups can be filled?",
          boxes: [{ label: "Cups", a: 8 }],
          slips: [[0.008, "That divided 2 by 250 in different units. Change 2 l into ml first."], [80, "2 l is 2000 ml, not 20 000 ml. 2000 / 250 = 8."], [4, "That is 1 litre's worth. There are 2 litres."]],
          hint: "2 l = 2000 ml. How many 250s in 2000?",
          why: "2000 / 250 = <b>8 cups</b>." } } },

    { type: "order", topic: "Mixed units",
      q: "Put them in order, shortest first.",
      items: ["50 cm", "1 m", "150 cm", "3 m"],
      hint: "Turn them all into cm first.",
      why: "In cm: 50, 100, 150, 300.",
      lv: { medium: { items: ["90 cm", "1.2 m", "150 cm", "2 m"], why: "In cm: 90, 120, 150, 200." },
        spicy: { items: ["850 mm", "0.9 m", "95 cm", "1.05 m"], hint: "Turn them all into cm (or all into mm) first.", why: "In cm: 85, 90, 95, 105." } } },

    { type: "num", topic: "Mixed units",
      q: "Jay's bird feeder holds 2 kg of seed. Seed comes in 500 g bags. How many bags fill it?",
      fig: FEEDER,
      boxes: [{ label: "Bags", a: 4 }],
      slips: [[250, "That divided 500 by 2. Change 2 kg into grams first: 2000 g."], [1000, "That is the grams in one kg. How many 500 g bags make 2000 g?"]],
      hint: "2 kg = 2000 g. How many 500s in 2000?",
      why: "2000 / 500 = <b>4 bags</b>. The birds are very grateful.",
      lv: { medium: { q: "Jay's bird feeder holds 1.5 kg of seed. Seed comes in 500 g bags. How many bags fill it?",
          boxes: [{ label: "Bags", a: 3 }],
          slips: [[0.003, "Different units. Change 1.5 kg into grams first."], [1500, "That is the grams. How many 500 g bags make 1500 g?"]],
          hint: "1.5 kg = 1500 g.",
          why: "1500 / 500 = <b>3 bags</b>." },
        spicy: { q: "Jay buys 3 bags of bird seed, each 750 g. How many kilograms is that altogether?",
          boxes: [{ label: "Kilograms", a: 2.25, post: "kg" }],
          slips: [[2250, "That is the grams. Divide by 1000 for kg."], [22.5, "That divided by 100. Grams to kg uses 1000."]],
          hint: "3 x 750 g, then turn it into kg.",
          why: "3 x 750 = 2250 g, and 2250 / 1000 = <b>2.25 kg</b>. Outrageous amounts of seed. The birds approve." } } }
  ],

  realWorld: {
    title: "Converting is everywhere",
    html: "<p>Recipes in grams, drinks in millilitres, journeys in minutes, prices in pence and pounds. Cooks, builders, nurses and shop staff convert all day long.</p>" +
      "<p>For our big question: people in the past used feet, pounds and pints, and old money had 240 pennies in a pound. If we could time travel, should we? You would need to learn a whole new set of magic numbers.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A time portal, an old coin and a modern coin, with Jay">' + A2ART.portal(70, 75, 54) +
      '<circle cx="180" cy="80" r="34" fill="#c98a3a" stroke="#141a33" stroke-width="3"/>' + T(180, 86, "1d", 18, { b: 1, a: "middle" }) +
      '<path d="M222 80h30" stroke="#141a33" stroke-width="3"/><path d="M250 74l10 6 -10 6z" fill="#141a33"/>' +
      '<circle cx="296" cy="80" r="30" fill="#ffd23f" stroke="#141a33" stroke-width="3"/>' + T(296, 86, "&#163;1", 18, { b: 1, a: "middle" }) +
      A2ART.jay(375, 52, 0.62, "wow") + '</svg>'
  },

  make: {
    title: "Make a conversion card",
    intro: "Your own pocket card: the magic numbers, your best tip, and two conversions you worked out. Keep it, or send it to Jay.",
    fields: [
      { id: "tip", label: "My top tip", ph: "Big to small, multiply. Small to big, divide.", max: 70 },
      { id: "ex1", label: "One I worked out", ph: "3 m = 300 cm", max: 34 },
      { id: "ex2", label: "Another one", ph: "90 minutes = 1 hour 30 minutes", max: 34 },
      { id: "name", label: "Unit wizard", ph: "The Converter", max: 24 }
    ],
    svg: function(v){
      var tip = wrap(v.tip, 28, 2), e1 = wrap(v.ex1, 26, 2), e2 = wrap(v.ex2, 26, 2), nm = wrap(v.name, 20, 1);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">' +
        '<rect width="640" height="400" rx="24" fill="#141a33"/>' +
        '<rect x="16" y="16" width="608" height="368" rx="18" fill="#fffbe9"/>' +
        T(40, 60, "CONVERSION CARD", 24, { b: 1, c: "#e04848" }) +
        MAGIC.map(function(c, k){
          var y = 92 + k * 46;
          return '<rect x="40" y="' + y + '" width="230" height="36" rx="8" fill="' + c[2] + '" fill-opacity=".3"/>' +
            T(56, y + 25, c[0], 17, { b: 1 }) + T(130, y + 25, "=", 17) + T(150, y + 25, c[1], 17, { b: 1 });
        }).join("") +
        T(300, 104, "MY TOP TIP", 13, { b: 1, c: "#5b6180" }) + tip.map(function(l, i){ return T(300, 130 + i * 24, esc(l), 16, { b: 1 }); }).join("") +
        T(300, 200, "I WORKED OUT", 13, { b: 1, c: "#5b6180" }) +
        e1.map(function(l, i){ return T(300, 226 + i * 22, esc(l), 17); }).join("") +
        e2.map(function(l, i){ return T(300, 280 + i * 22, esc(l), 17); }).join("") +
        T(600, 360, "Unit wizard: " + esc(nm[0] || ""), 15, { b: 1, a: "end", c: "#5b6180" }) +
        '</svg>';
    }
  }
};
})();
