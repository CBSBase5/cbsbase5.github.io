/* Base 5 Autumn 2 activity: Multiply or divide?
   Maths. Choosing whether to multiply or divide to solve a real problem:
   totals and parts, sharing and grouping, leftovers, two step problems.
   ASCII only. */
(function(){
var A = window.A2ART;
var INK = "#141a33", F = ' font-family="Verdana,Arial,sans-serif"';
function tx(x, y, s, size, fill, more){
  return '<text x="' + x + '" y="' + y + '"' + F + ' font-size="' + size + '" fill="' + (fill || INK) + '"' + (more || "") + '>' + s + '</text>';
}
function svg(w, h, label, body, bg){
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '"><rect width="' + w + '" height="' + h + '" rx="16" fill="' + (bg || "#f4f1ea") + '"/>' + body + '</svg>';
}

/* the bar model: one whole bar on top, equal parts underneath */
function bar(total, n, part, o){
  o = o || {};
  var x0 = 24, wd = o.wd || (o.extra ? 270 : 300), b = "", pw = wd / n;
  b += '<rect x="' + x0 + '" y="26" width="' + wd + '" height="42" rx="8" fill="#ffd23f" stroke="' + INK + '" stroke-width="2.5"/>';
  b += tx(x0 + wd / 2, 54, total, 17, INK, ' text-anchor="middle" font-weight="700"');
  for(var k = 0; k < n; k++){
    b += '<rect x="' + (x0 + k * pw) + '" y="80" width="' + pw + '" height="42" rx="6" fill="' + (k % 2 ? "#e6f9ef" : "#d9f3ff") + '" stroke="' + INK + '" stroke-width="2.5"/>';
    b += tx(x0 + k * pw + pw / 2, 107, part, n > 6 ? 13 : 16, INK, ' text-anchor="middle" font-weight="700"');
  }
  b += tx(x0, 160, o.under || "", 14, "#5b6180");
  return svg(o.w || 440, o.under ? 176 : 140, o.label || "A bar model: the whole on top, equal parts underneath", b + (o.extra || ""));
}

var START = bar("24 altogether", 4, "6", { label: "A bar of 24 split into 4 parts of 6", under: "Know the parts? Multiply. Know the whole? Divide.",
  extra: A.jay(384, 92, 0.55, "hmm") + A.bubble(318, 8, 116, 46, "Total, or\nparts?", 366) });

var LEARN1 = bar("? altogether", 4, "6", { label: "4 parts of 6, total unknown", under: "4 lots of 6: multiply. 4 x 6 = 24",
  extra: A.jay(384, 92, 0.55, "hmm") + A.bubble(318, 8, 116, 46, "Do I know\nthe total?", 366) });
var LEARN1B = bar("24 altogether", 4, "?", { label: "24 split into 4 parts, each part unknown", under: "24 split 4 ways: divide. 24 / 4 = 6",
  extra: A.jay(384, 92, 0.55, "smile") + A.bubble(312, 8, 122, 46, "Total known:\ndivide.", 366) });

/* sharing (deal out into a set number of groups) and grouping (make groups of a set size) */
function dots(cx, cy, n, col, cols){
  var o = "";
  for(var i = 0; i < n; i++){ var c = i % cols, r = Math.floor(i / cols); o += '<circle cx="' + (cx + c * 16) + '" cy="' + (cy + r * 16) + '" r="6" fill="' + col + '"/>'; }
  return o;
}
var SHAREGROUP = svg(460, 210, "Sharing: 12 dealt into 3 groups, 4 each. Grouping: 12 made into groups of 4, 3 groups.",
  '<rect x="10" y="10" width="215" height="190" rx="12" fill="#ffffff"/>' + tx(118, 36, "Sharing", 17, INK, ' text-anchor="middle" font-weight="700"') +
  tx(118, 56, "12 into 3 groups", 14, "#5b6180", ' text-anchor="middle"') +
  [0, 1, 2].map(function(k){ return '<circle cx="' + (50 + k * 68) + '" cy="110" r="28" fill="#d9f3ff" stroke="' + INK + '" stroke-width="2"/>' + dots(42 + k * 68, 102, 4, "#1f6fb2", 2); }).join("") +
  tx(118, 168, "4 in each", 16, "#1f6fb2", ' text-anchor="middle" font-weight="700"') +
  tx(118, 190, "12 / 3 = 4", 14, "#5b6180", ' text-anchor="middle"') +
  '<rect x="235" y="10" width="215" height="190" rx="12" fill="#ffffff"/>' + tx(342, 36, "Grouping", 17, INK, ' text-anchor="middle" font-weight="700"') +
  tx(342, 56, "12 in groups of 4", 14, "#5b6180", ' text-anchor="middle"') +
  [0, 1, 2].map(function(k){ return '<rect x="' + (256 + k * 62) + '" y="80" width="50" height="56" rx="14" fill="#e6f9ef" stroke="#19c39a" stroke-width="2.5" stroke-dasharray="6 3"/>' + dots(273 + k * 62, 100, 4, "#1f9d63", 2); }).join("") +
  tx(342, 168, "3 groups", 16, "#1f9d63", ' text-anchor="middle" font-weight="700"') +
  tx(342, 190, "12 / 4 = 3", 14, "#5b6180", ' text-anchor="middle"') +
  A.egg(A.bird(432, 30, 0.45, "#3a8fd6"), "Grouping birds is called a flock. Jay counted 40 starlings once. Then they moved.") , "#f4f1ea");

/* minibuses: 3 full and one with 2 people */
function seats(n, per, label){
  var buses = Math.ceil(n / per), out = "", left = n;
  for(var b = 0; b < buses; b++){
    var x = 16 + b * 106, fill = Math.min(per, left); left -= fill;
    out += '<rect x="' + x + '" y="40" width="96" height="70" rx="14" fill="' + (fill === per ? "#ffd23f" : "#fff3c4") + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<circle cx="' + (x + 22) + '" cy="116" r="9" fill="' + INK + '"/><circle cx="' + (x + 74) + '" cy="116" r="9" fill="' + INK + '"/>';
    for(var s = 0; s < per; s++){ var c = s % 4, r = Math.floor(s / 4); out += '<circle cx="' + (x + 18 + c * 20) + '" cy="' + (60 + r * 22) + '" r="7" fill="' + (s < fill ? "#1f6fb2" : "#ffffff") + '" stroke="' + INK + '" stroke-width="1.5"/>'; }
  }
  return svg(Math.max(440, 30 + buses * 106), 170, label, out + tx(16, 156, n + " people, " + per + " seats each: " + buses + " needed, even though the last is not full.", 14, "#5b6180"));
}
var BUSES = seats(26, 8, "26 people in vehicles of 8 seats: 3 full and a fourth with 2 people");

/* two step flow */
function flow(a, op1, b, op2, c, label){
  function boxAt(x, t, col){ return '<rect x="' + x + '" y="40" width="118" height="56" rx="12" fill="' + col + '" stroke="' + INK + '" stroke-width="2.5"/>' + tx(x + 59, 74, t, 15, INK, ' text-anchor="middle" font-weight="700"'); }
  function arrow(x, t){ return '<path d="M' + x + ' 68h34" stroke="#8a5cf6" stroke-width="4" stroke-linecap="round"/><path d="M' + (x + 26) + ' 60l9 8 -9 8" fill="none" stroke="#8a5cf6" stroke-width="4" stroke-linecap="round"/>' + tx(x + 17, 32, t, 15, "#8a5cf6", ' text-anchor="middle" font-weight="700"'); }
  return svg(460, 130, label, boxAt(10, a, "#d9f3ff") + arrow(132, op1) + boxAt(170, b, "#fff3c4") + arrow(292, op2) + boxAt(330, c, "#e6f9ef") +
    tx(69, 118, "what you know", 13, "#5b6180", ' text-anchor="middle"') + tx(229, 118, "step 1", 13, "#5b6180", ' text-anchor="middle"') + tx(389, 118, "step 2", 13, "#5b6180", ' text-anchor="middle"'));
}

(window.A2PACKS = window.A2PACKS || {})["multiply-or-divide"] = {
  a2: true,
  id: "a2-multiply-or-divide",
  title: "Multiply or divide?",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 20,
  line: "One question sorts it: do I know the total, or the parts?",
  blurb: "Real problems never say \"multiply\" or \"divide\". Here is how to tell which one you need, what to do with leftovers, and how to handle two step problems. Four short chunks, and a problem card to make at the end.",
  note: "Working out whether a real problem needs multiplying or dividing. Four five minute chunks and a problem card at the end. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Day trip", line: "Day trip: small numbers, groups and sharing." },
    { id: "medium", name: "Road trip", line: "Road trip: money, bigger numbers and leftovers that matter." },
    { id: "spicy", name: "Expedition", line: "Expedition: rates, decimals, recipes and best buys." }
  ],
  themes: {
    time: { name: "Time travel", w: { thing: "time crystal", things: "time crystals", group: "capsule", groups: "capsules", people: "time travellers", ride: "time pod", rides: "time pods", event: "the trip to 1850" } },
    football: { name: "Football", w: { thing: "football", things: "footballs", group: "net bag", groups: "net bags", people: "players", ride: "minibus", rides: "minibuses", event: "the away match" } },
    horror: { name: "Horror", w: { thing: "candle", things: "candles", group: "creaky box", groups: "creaky boxes", people: "ghost hunters", ride: "ghost train carriage", rides: "ghost train carriages", event: "the midnight tour" } },
    fishing: { name: "Fishing", w: { thing: "float", things: "floats", group: "tackle tray", groups: "tackle trays", people: "anglers", ride: "boat", rides: "boats", event: "the match day" } },
    music: { name: "Music", w: { thing: "ticket", things: "tickets", group: "goody bag", groups: "goody bags", people: "dancers", ride: "tour bus", rides: "tour buses", event: "the big show" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: START,
  steps: [

    /* ---------- chunk 1: total or parts? ---------- */
    { type: "learn", topic: "Total or parts?",
      title: "Do you know the total?",
      routes: [
        { name: "Multiply", fig: LEARN1,
          html: "<p>4 [[groups]], with 6 [[things]] in each. You know the <b>parts</b> but not the <b>total</b>.</p>" +
            "<p>Lots of the same thing, and you want the whole lot: <b>multiply</b>. 4 &times; 6 = 24 [[things]].</p>" },
        { name: "Divide", fig: LEARN1B,
          html: "<p>24 [[things]], split equally into 4 [[groups]]. Now you know the <b>total</b>, and you want a <b>part</b>.</p>" +
            "<p>Splitting a total up: <b>divide</b>. 24 &divide; 4 = 6 [[things]] in each.</p>" +
            "<p>Same bar, same numbers, just a different gap to fill. So ask: <b>do I already know the total?</b> Yes: divide. No: multiply.</p>" }
      ],
      lv: { spicy: { routes: [
        { name: "Multiply", fig: LEARN1,
          html: "<p>You know the parts and want the total: <b>multiply</b>. 4 [[groups]] of 6 [[things]] is 4 &times; 6 = 24.</p>" +
            "<p>Rates work the same way. <b>&pound;3 per kilogram</b> is a part: the cost of one kilogram. 5 kilograms is 5 parts, so 5 &times; 3 = &pound;15.</p>" },
        { name: "Divide", fig: LEARN1B,
          html: "<p>You know the total and want a part: <b>divide</b>. 24 &divide; 4 = 6.</p>" +
            "<p>Finding a rate is dividing: <b>&pound;15 for 5 kilograms</b> is &pound;15 &divide; 5 = &pound;3 per kilogram.</p>" +
            "<p>Watch the order. The thing you want <b>per</b> goes on the bottom: pounds per kilogram is pounds &divide; kilograms.</p>" } ] } } },

    { type: "mc", topic: "Total or parts?",
      q: "There are 5 [[groups]]. Each one holds 8 [[things]]. Which calculation finds how many [[things]] there are altogether?",
      fig: bar("? altogether", 5, "8", { label: "5 parts of 8, total unknown" }),
      options: ["5 &times; 8", "8 &divide; 5", "5 + 8", "8 &minus; 5"],
      answer: 0,
      slips: { 1: "Dividing splits a total up. Here the total is what you are looking for.", 2: "5 + 8 counts the [[groups]] and one [[group]]'s worth. Five lots of 8 is a times.", 3: "Taking away does not fit: nothing is being removed." },
      hint: "Do you know the total yet?",
      why: "You know the parts (8 in each) and how many (5). Lots of the same: 5 &times; 8 = 40.",
      lv: {
        medium: { q: "A ticket for the [[ride]] costs &pound;4.50 per person. 12 [[people]] go. Which calculation gives the total cost?",
          fig: bar("? total cost", 12, "", { label: "12 equal parts of 4.50 pounds, total unknown", under: "12 tickets, &#163;4.50 each" }),
          options: ["4.50 &times; 12", "12 &divide; 4.50", "4.50 &divide; 12", "4.50 + 12"],
          slips: { 1: "Dividing would need a total to split. The total is what you want.", 2: "That would share one ticket price between 12 people.", 3: "Adding treats it as one ticket plus 12 pounds. It is 12 tickets." },
          hint: "12 lots of the same price.",
          why: "12 lots of &pound;4.50: 4.50 &times; 12 = &pound;54." },
        spicy: { q: "A 750 g bag of snacks for [[event]] costs &pound;3. Which calculation finds the cost of 1 gram?",
          fig: bar("&#163;3 for 750 g", 6, "?", { label: "3 pounds split across 750 grams" }),
          options: ["3 &divide; 750", "750 &divide; 3", "3 &times; 750", "750 &minus; 3"],
          slips: { 1: "750 &divide; 3 = 250 is grams per pound: how much you get for &pound;1. Not the same thing.", 2: "Multiplying makes it bigger. A single gram costs far less than &pound;3.", 3: "Taking pounds from grams does not mean anything." },
          hint: "Pounds per gram: pounds on top, grams underneath.",
          why: "Pounds per gram is pounds &divide; grams: 3 &divide; 750 = &pound;0.004, less than half a penny." } } },

    { type: "sort", topic: "Total or parts?",
      q: "Sort them. Multiply or divide?",
      buckets: ["Multiply", "Divide"],
      cards: [["3 [[groups]] with 10 [[things]] in each. How many altogether?", 0], ["20 [[things]] shared between 4 [[groups]]. How many in each?", 1], ["30 [[things]] put into [[groups]] of 5. How many [[groups]]?", 1], ["6 [[people]] each bring 2 [[things]]. How many [[things]]?", 0]],
      hint: "For each one ask: do I already know the total?",
      why: "When the total is given (20, 30), you divide. When you have to build the total from equal parts, you multiply.",
      lv: {
        medium: { cards: [["Tickets are &pound;6 each. What do 15 cost?", 0], ["&pound;90 split equally between 6 [[people]]. How much each?", 1], ["A [[ride]] holds 8. How many are needed for 96 [[people]]?", 1], ["A [[ride]] travels 40 miles a day for 5 days. How far altogether?", 0], ["A 60 minute session in 12 minute slots. How many slots?", 1]] },
        spicy: { cards: [["180 miles in 3 hours. How many miles per hour?", 1], ["Paint covers 12 square metres per litre. How much area does 5 litres cover?", 0], ["1 euro is worth 85p. What are 40 euros worth?", 0], ["6 [[things]] cost &pound;2.40. What does one cost?", 1], ["How many 0.5 litre bottles can be filled from 8 litres?", 1]],
          why: "Finding a rate or a number of groups from a total: divide. Building a total from a rate: multiply. 8 &divide; 0.5 = 16 bottles: dividing by a half doubles it." } } },

    { type: "mc", topic: "Total or parts?", explain: true,
      q: "Both of these use the word \"each\". Which one needs dividing?",
      options: ["24 [[things]] are shared out so each of 4 [[groups]] gets the same. How many in each?", "Each [[group]] has 4 [[things]]. There are 24 [[groups]]. How many [[things]]?"],
      answer: 0,
      slips: { 1: "Here you know the parts (4 in each) and need the total. That is multiplying, even though it says \"each\"." },
      hint: "Ignore the word \"each\". Which one tells you the total?",
      why: "The first one gives you the total, 24, to split up: 24 &divide; 4 = 6. Words like \"each\" turn up in both kinds, so look for the total instead.",
      lv: {
        medium: { q: "Both of these use the word \"per\". Which one needs dividing?",
          options: ["A [[ride]] uses 6 litres of fuel per hour. How much does it use in 4 hours?", "A [[ride]] used 24 litres of fuel in 4 hours. How much is that per hour?"],
          answer: 1,
          slips: { 0: "Here you know one hour's worth and want the total for 4: multiply. 6 &times; 4 = 24." },
          hint: "Which one gives you the total and asks for one hour's worth?",
          why: "24 litres is a total, split over 4 hours: 24 &divide; 4 = 6 litres per hour." },
        spicy: { q: "Which one of these needs dividing?",
          options: ["A recipe for 4 people needs 300 g of flour. How much is that for 1 person?", "A recipe for 1 person needs 75 g of flour. How much for 4 people?", "Fuel costs &pound;1.50 per litre. What do 40 litres cost?"],
          answer: 0,
          slips: { 1: "Here you know one person's amount and want four: multiply.", 2: "You know the price of one litre and want 40: multiply." },
          hint: "Which one starts from a total and asks for one?",
          why: "300 g is the total for 4 people. One person's share is 300 &divide; 4 = 75 g." } } },

    { type: "num", topic: "Total or parts?",
      q: "48 [[things]] are packed into [[groups]], 6 in each. How many [[groups]] are filled?",
      fig: bar("48 altogether", 8, "6", { label: "48 split into parts of 6" }),
      boxes: [{ label: "[[Groups]]", a: 8 }],
      slips: [[288, "That multiplies. You know the total (48), so divide."], [42, "Taking away 6 once is not enough: how many sixes fit into 48?"]],
      hint: "Total known, so divide. How many 6s in 48?",
      why: "48 &divide; 6 = <b>8</b> [[groups]]. Check: 8 &times; 6 = 48.",
      lv: {
        medium: { q: "&pound;96 is split equally between 8 [[people]]. How much does each get?",
          fig: bar("&#163;96", 8, "?", { label: "96 pounds split into 8 equal parts" }),
          boxes: [{ label: "Each", a: 12, pre: "&pound;" }],
          slips: [[768, "That multiplies. You know the total (&pound;96), so divide."], [88, "That takes away 8. Splitting into 8 equal parts is dividing."]],
          hint: "Total known, so divide: 96 &divide; 8.",
          why: "96 &divide; 8 = <b>&pound;12</b> each. Check: 12 &times; 8 = 96." },
        spicy: { q: "A 750 g bag of snacks for [[event]] costs &pound;3. What is the cost per 100 g?",
          fig: bar("&#163;3 for 750 g", 6, "?", { label: "3 pounds split across 750 grams" }),
          boxes: [{ label: "Per 100 g", a: 0.4, pre: "&pound;" }],
          slips: [[0.004, "That is the cost per gram. 100 g costs 100 times as much."], [250, "That is grams per pound. You want pounds per 100 grams."], [22.5, "That multiplies. You know the total cost, so divide."]],
          hint: "750 g is 7.5 lots of 100 g. Split the &pound;3 into 7.5 parts.",
          why: "3 &divide; 7.5 = <b>&pound;0.40</b> per 100 g. Or 3 &divide; 750 = 0.004 per gram, times 100." } } },

    /* ---------- chunk 2: two kinds of divide ---------- */
    { type: "learn", topic: "Sharing or grouping",
      title: "Two kinds of divide",
      fig: SHAREGROUP,
      html: "<p>Dividing comes in two flavours, and both are &divide;.</p>" +
        "<p><b>Sharing:</b> you know how many groups. Deal the [[things]] out one at a time until they are gone. The answer is <b>how many in each</b>.</p>" +
        "<p><b>Grouping:</b> you know the size of each group. Keep making groups of that size. The answer is <b>how many groups</b>.</p>" +
        "<p>Bonnie only understands sharing, and only if she is one of the groups.</p>" },

    { type: "match", topic: "Sharing or grouping",
      q: "Match each problem to its answer. Look at what the answer is counting.",
      pairs: [["20 [[things]] shared between 4 [[groups]]", "20 &divide; 4 = 5 in each [[group]]"], ["20 [[things]] packed 4 to a [[group]]", "20 &divide; 4 = 5 [[groups]]"], ["4 [[groups]] with 5 [[things]] in each", "4 &times; 5 = 20 [[things]]"]],
      hint: "Sharing gives how many in each. Grouping gives how many groups.",
      why: "Same numbers, different answers to different questions. Always say what your answer is counting.",
      lv: {
        medium: { pairs: [["&pound;60 shared equally between 5 [[people]]", "&pound;12 each"], ["&pound;60 spent on &pound;5 tickets", "12 tickets"], ["5 tickets at &pound;12 each", "&pound;60 in total"], ["60 minutes split into 5 minute slots", "12 slots"]] },
        spicy: { pairs: [["150 miles in 3 hours", "50 miles per hour"], ["150 miles at 50 miles per hour", "3 hours"], ["3 hours at 50 miles per hour", "150 miles"], ["&pound;150 for 3 nights", "&pound;50 per night"]],
          hint: "Look at the units in each answer: miles per hour, hours, miles, pounds per night.",
          why: "Speed, time and cost per night are all multiply or divide. The units tell you which: miles &divide; hours gives miles per hour." } } },

    { type: "num", topic: "Sharing or grouping",
      q: "A [[ride]] holds 6 [[people]]. 42 [[people]] are going to [[event]]. How many [[rides]] are needed?",
      boxes: [{ label: "[[Rides]]", a: 7 }],
      slips: [[252, "That multiplies. You know the total number of [[people]], so divide."], [36, "That takes away 6 once. How many 6s fit in 42?"]],
      hint: "Grouping: how many groups of 6 in 42?",
      why: "42 &divide; 6 = <b>7</b> [[rides]]. Check: 7 &times; 6 = 42.",
      lv: {
        medium: { q: "Tickets for [[event]] cost &pound;8 each. How many tickets can you buy with &pound;96?",
          boxes: [{ label: "Tickets", a: 12 }],
          slips: [[768, "That multiplies. You know the total money, so divide."], [11, "Check: 12 &times; 8 = 96, so one more fits."]],
          hint: "Grouping: how many &pound;8s in &pound;96?",
          why: "96 &divide; 8 = <b>12</b> tickets. Check: 12 &times; 8 = 96." },
        spicy: { q: "A [[ride]] travels 0.4 km every minute. How many minutes to travel 6 km?",
          boxes: [{ label: "Minutes", a: 15 }],
          slips: [[2.4, "That multiplies. You know the total distance, so divide: 6 &divide; 0.4."], [1.5, "Check the place value: 6 &divide; 0.4 is the same as 60 &divide; 4."]],
          hint: "How many lots of 0.4 km fit into 6 km? Multiply both by 10 to make it easier.",
          why: "6 &divide; 0.4 = 60 &divide; 4 = <b>15</b> minutes. Check: 15 &times; 0.4 = 6." } } },

    { type: "mc", topic: "Sharing or grouping",
      q: "Someone typed 6 &divide; 42 into a calculator for that last question and got 0.1428... What should they have typed?",
      options: ["42 &divide; 6", "6 &times; 42", "42 &minus; 6", "It is fine as it is"],
      answer: 0,
      slips: { 1: "That would multiply. You already know the total, so it is a divide, just the other way round.", 2: "Taking away gives how many are left after one [[ride]], not how many [[rides]].", 3: "You cannot have 0.14 of a [[ride]] for 42 [[people]]. That answer is far too small." },
      hint: "With divide, order matters. Which number is the total?",
      why: "The total goes first: 42 &divide; 6 = 7. If an answer looks silly for real life, check the order.",
      lv: {
        medium: { q: "Someone typed 8 &divide; 96 into a calculator and got 0.0833... What should they have typed?",
          options: ["96 &divide; 8", "8 &times; 96", "96 &minus; 8", "It is fine as it is"],
          slips: { 1: "That multiplies. You know the total money, so divide, the other way round.", 2: "Taking away gives the money left after one ticket.", 3: "0.08 of a ticket for &pound;96? Far too small." },
          why: "Total first: 96 &divide; 8 = 12 tickets." },
        spicy: { q: "Someone typed 0.4 &divide; 6 into a calculator and got 0.0666... What should they have typed?",
          options: ["6 &divide; 0.4", "6 &times; 0.4", "6 &minus; 0.4", "It is fine as it is"],
          slips: { 1: "6 &times; 0.4 = 2.4 is the distance in 6 minutes, not the time for 6 km.", 2: "Taking away does not give a time.", 3: "0.07 of a minute for 6 km would be very fast indeed." },
          why: "Total first: 6 &divide; 0.4 = 15 minutes." } } },

    /* ---------- chunk 3: leftovers ---------- */
    { type: "learn", topic: "What about the leftovers?",
      title: "Real life decides what to do with the remainder",
      fig: BUSES,
      html: "<p>26 [[people]], and each [[ride]] holds 8. 26 &divide; 8 = 3 remainder 2 (a calculator says 3.25).</p>" +
        "<p>Nobody gets left behind, so you need <b>4</b> [[rides]]. <b>Round up</b> when everything has to fit.</p>" +
        "<p>But 26 [[things]] packed 8 to a [[group]] only makes <b>3</b> full [[groups]]. <b>Round down</b> when you can only count complete ones.</p>" +
        "<p>Same sum, two different answers. The question decides.</p>" },

    { type: "mc", topic: "What about the leftovers?",
      q: "26 [[people]] are going to [[event]]. Each [[ride]] holds 8. How many [[rides]] are needed?",
      fig: BUSES,
      options: ["4", "3", "3.25", "3 remainder 2"],
      answer: 0,
      slips: { 1: "3 [[rides]] only take 24 [[people]]. Two would be left behind.", 2: "You cannot book a quarter of a [[ride]]. Round to a whole one.", 3: "That is the right sum, but the 2 left over still need a seat." },
      hint: "Would anyone be left behind with 3?",
      why: "3 [[rides]] carry 24, so the other 2 need a fourth. Round <b>up</b> to <b>4</b>.",
      lv: {
        medium: { q: "75 [[people]] are going to [[event]]. Each [[ride]] holds 16. How many [[rides]] are needed?",
          fig: null,
          options: ["5", "4", "4.6875", "4 remainder 11"],
          slips: { 1: "4 [[rides]] only take 64. Eleven people would be left behind.", 2: "A calculator answer needs turning into a real number of [[rides]].", 3: "Right sum. Those 11 still need a seat, so one more." },
          hint: "Would anyone be left behind with 4?",
          why: "75 &divide; 16 = 4 remainder 11. Everyone has to go, so round <b>up</b> to <b>5</b>." },
        spicy: { q: "Floor tiles come in packs of 12. A floor needs 150 tiles. How many packs do you buy?",
          fig: null,
          options: ["13", "12", "12.5", "12 remainder 6"],
          slips: { 1: "12 packs is 144 tiles. Six short, so the floor would not be finished.", 2: "Shops do not sell half a pack.", 3: "Right sum. The 6 extra tiles mean one more pack." },
          hint: "Can you buy part of a pack?",
          why: "150 &divide; 12 = 12.5. You need every tile, so round <b>up</b> to <b>13</b> packs." } } },

    { type: "num", topic: "What about the leftovers?",
      q: "You have &pound;20. Each [[thing]] costs &pound;3. How many can you buy?",
      boxes: [{ label: "[[Things]]", a: 6 }],
      slips: [[7, "7 &times; 3 = &pound;21. That is &pound;1 more than you have, so round down."], [6.67, "You cannot buy part of one. Round down to whole ones."], [60, "That multiplies. You know the total money, so divide."]],
      hint: "How many 3s fit in 20? You cannot spend money you do not have.",
      why: "20 &divide; 3 = 6 remainder 2. You can only buy whole ones, so round <b>down</b>: <b>6</b>, with &pound;2 left.",
      lv: {
        medium: { q: "You have &pound;50. Tickets for [[event]] cost &pound;7 each. How many tickets can you buy?",
          boxes: [{ label: "Tickets", a: 7 }],
          slips: [[8, "8 &times; 7 = &pound;56. That is more than &pound;50, so round down."], [7.14, "You cannot buy part of a ticket. Round down."]],
          hint: "50 &divide; 7, then think: can you afford one more?",
          why: "50 &divide; 7 = 7 remainder 1. Round <b>down</b>: <b>7</b> tickets, with &pound;1 left." },
        spicy: { q: "Fuel costs &pound;1.45 per litre. You have &pound;30. How many <b>whole</b> litres can you buy?",
          boxes: [{ label: "Litres", a: 20 }],
          slips: [[21, "21 &times; 1.45 = &pound;30.45. Just over &pound;30, so round down."], [20.69, "The question asks for whole litres, so round down."], [43.5, "That multiplies. You know the money, so divide."]],
          hint: "30 &divide; 1.45, then round down.",
          why: "30 &divide; 1.45 = 20.68... You cannot spend more than &pound;30, so round <b>down</b> to <b>20</b> litres." } } },

    { type: "sort", topic: "What about the leftovers?",
      q: "Round up or round down? Sort them.",
      buckets: ["Round up", "Round down"],
      cards: [["Boxes needed to pack 30 [[things]], 8 in a box", 0], ["Full [[groups]] made from 30 [[things]], 8 in each", 1], ["Tables needed for 22 [[people]], 4 at a table", 0], ["Snacks you can buy with &pound;10 at &pound;3 each", 1]],
      hint: "Does everything have to fit (up)? Or can you only count complete ones (down)?",
      why: "If leaving some out is not allowed, round up. If you can only have whole ones, round down.",
      lv: {
        medium: { cards: [["Boxes needed to pack 30 [[things]], 8 in a box", 0], ["Full [[groups]] made from 30 [[things]], 8 in each", 1], ["Tables needed for 22 [[people]], 4 at a table", 0], ["Tickets you can afford with &pound;40 at &pound;6 each", 1], ["Weeks to save &pound;100 at &pound;15 a week", 0], ["Whole 30 cm shelves cut from a 2 m plank", 1]] },
        spicy: { cards: [["Packs of 12 tiles for a 150 tile floor", 0], ["Whole 0.3 m pieces cut from a 2 m rope", 1], ["Coaches of 53 seats for 200 [[people]]", 0], ["Litres of fuel bought with &pound;30 at &pound;1.45", 1], ["Tins of paint (2.5 litres each) for a job needing 11 litres", 0], ["Full 330 ml cans filled from 5 litres", 1]] } } },

    { type: "num", topic: "What about the leftovers?", stretch: true,
      q: "50 [[things]] are packed into [[groups]] of 6. How many full [[groups]], and how many [[things]] are left over?",
      boxes: [{ label: "Full [[groups]]", a: 8 }, { label: "Left over", a: 2 }],
      slips: [[0, 9, "9 &times; 6 = 54, more than 50. Only 8 full ones."], [1, 4, "Check: 8 &times; 6 = 48, so 50 leaves 2."]],
      hint: "How many 6s in 50? What is left?",
      why: "8 &times; 6 = 48, so <b>8</b> full [[groups]] and <b>2</b> left over.",
      lv: {
        medium: { q: "100 [[things]] are packed into [[groups]] of 7. How many full [[groups]], and how many left over?",
          boxes: [{ label: "Full [[groups]]", a: 14 }, { label: "Left over", a: 2 }],
          slips: [[0, 15, "15 &times; 7 = 105, more than 100. Only 14 full ones."], [1, 5, "Check: 14 &times; 7 = 98, so 100 leaves 2."]],
          hint: "100 &divide; 7. 14 &times; 7 = 98.",
          why: "14 &times; 7 = 98, so <b>14</b> full [[groups]] and <b>2</b> left over." },
        spicy: { q: "A 2 m rope is cut into 0.3 m pieces. How many whole pieces, and how many centimetres are left?",
          boxes: [{ label: "Whole pieces", a: 6 }, { label: "Left over", a: 20, post: "cm" }],
          slips: [[0, 7, "7 &times; 0.3 = 2.1 m. Longer than the rope."], [1, 0.2, "That is in metres. The box asks for centimetres."], [0, 6.67, "Whole pieces only."]],
          hint: "2 &divide; 0.3 is the same as 20 &divide; 3. Then what length is left?",
          why: "6 &times; 0.3 = 1.8 m. So <b>6</b> pieces, and 2 &minus; 1.8 = 0.2 m = <b>20 cm</b> left." } } },

    /* ---------- chunk 4: two steps ---------- */
    { type: "learn", topic: "Two step problems",
      title: "Two steps: one at a time",
      fig: flow("5 lots of 6", "&#215;", "30 in total", "&#247; 3", "10 each", "5 groups of 6 makes 30, shared by 3 is 10 each"),
      html: "<p>Some problems need two calculations. Do them one at a time, and ask the same question each time: <b>do I know the total?</b></p>" +
        "<p><b>5 [[groups]] with 6 [[things]] in each are shared between 3 [[people]]. How many each?</b></p>" +
        "<p>Step 1: the total is not given, so multiply. 5 &times; 6 = 30 [[things]].</p>" +
        "<p>Step 2: now the total is known, so divide. 30 &divide; 3 = <b>10 each</b>.</p>",
      lv: {
        medium: { fig: flow("8 for &#163;12", "&#247; 8", "1 for &#163;1.50", "&#215; 20", "20 for &#163;30", "8 for 12 pounds, so 1 for 1.50, so 20 for 30 pounds"),
          html: "<p>Some problems need two calculations. Do them one at a time.</p>" +
            "<p><b>A pack of 8 [[things]] costs &pound;12. How much would 20 cost?</b></p>" +
            "<p>Step 1: find the cost of <b>one</b>. The total is known, so divide: 12 &divide; 8 = &pound;1.50.</p>" +
            "<p>Step 2: now build up to 20. Multiply: 20 &times; 1.50 = <b>&pound;30</b>.</p>" +
            "<p>Going through one is the trick for loads of problems: recipes, prices, wages.</p>" },
        spicy: { fig: flow("A: 6 for &#163;4.20", "&#247; 6", "&#163;0.70 each", "vs", "B: &#163;0.65 each", "Pack A is 70p each, pack B is 65p each"),
          html: "<p>A best buy is a two step problem: find the price of <b>one</b> for each deal, then compare.</p>" +
            "<p><b>Pack A: 6 [[things]] for &pound;4.20. Pack B: 10 for &pound;6.50.</b></p>" +
            "<p>A: 4.20 &divide; 6 = &pound;0.70 each. B: 6.50 &divide; 10 = &pound;0.65 each.</p>" +
            "<p>B is better value by 5p a [[thing]]. Bigger is often cheaper per item, but not always, so always check.</p>" } } },

    { type: "num", topic: "Two step problems",
      q: "4 [[groups]] with 9 [[things]] in each are shared between 6 [[people]]. Step 1 is done for you: 4 &times; 9 = 36 [[things]]. Have a go at step 2: how many each?",
      fig: flow("4 lots of 9", "&#215;", "36 in total", "&#247; 6", "? each", "4 groups of 9 makes 36, shared by 6"),
      boxes: [{ label: "Each", a: 6 }],
      slips: [[216, "Step 2 shares the 36, so divide."], [30, "That takes away 6. Sharing between 6 is dividing."]],
      hint: "The total is now known: 36. Divide by 6.",
      why: "36 &divide; 6 = <b>6</b> each.",
      lv: {
        medium: { q: "A pack of 5 [[things]] costs &pound;7.50. How much would 12 cost? Step 1 is done: one costs 7.50 &divide; 5 = &pound;1.50. Have a go at step 2.",
          fig: flow("5 for &#163;7.50", "&#247; 5", "1 for &#163;1.50", "&#215; 12", "12 for ?", "5 for 7.50 pounds, so 1 for 1.50"),
          boxes: [{ label: "12 cost", a: 18, pre: "&pound;" }],
          slips: [[0.125, "Step 2 builds up from one to 12, so multiply."], [90, "That multiplies the pack price by 12. Use the price of one."]],
          hint: "12 lots of &pound;1.50.",
          why: "12 &times; 1.50 = <b>&pound;18</b>." },
        spicy: { q: "Pack A: 8 [[things]] for &pound;5.60. Pack B: 12 for &pound;8.04. Step 1 is done: A is 5.60 &divide; 8 = &pound;0.70 each. Have a go at B's price for one.",
          fig: flow("B: 12 for &#163;8.04", "&#247; 12", "? each", "vs", "A: &#163;0.70 each", "Pack B price for one, compared with A at 70p"),
          boxes: [{ label: "B, each", a: 0.67, pre: "&pound;" }],
          slips: [[96.48, "That multiplies. You know the total for 12, so divide."], [1.49, "That is 12 &divide; 8.04. Pounds per item is pounds &divide; items."]],
          hint: "8.04 &divide; 12.",
          why: "8.04 &divide; 12 = <b>&pound;0.67</b>. B is 3p cheaper per [[thing]], so B is the better buy." } } },

    { type: "num", topic: "Two step problems", explain: true,
      q: "3 [[groups]] with 8 [[things]] in each are shared between 4 [[people]]. How many does each get?",
      boxes: [{ label: "Each", a: 6 }],
      slips: [[24, "That is step 1: the total. Now share it between 4."], [96, "Step 2 shares, so divide."], [2, "That shares one [[group]]. Find the total of all 3 first."]],
      hint: "Step 1: total. Step 2: share.",
      why: "3 &times; 8 = 24. 24 &divide; 4 = <b>6</b> each.",
      lv: {
        medium: { q: "4 tickets for [[event]] cost &pound;15 each. 6 [[people]] split the total cost equally. How much does each pay?",
          boxes: [{ label: "Each pays", a: 10, pre: "&pound;" }],
          slips: [[60, "That is step 1: the total cost. Now split it between 6."], [2.5, "Find the total first: 4 &times; 15."]],
          hint: "Step 1: total cost. Step 2: split it.",
          why: "4 &times; 15 = &pound;60. 60 &divide; 6 = <b>&pound;10</b> each." },
        spicy: { q: "A recipe for 4 people needs 300 g of flour. How much flour for 10 people?",
          boxes: [{ label: "Flour", a: 750, post: "g" }],
          slips: [[3000, "That multiplies 300 by 10, but 300 g serves 4, not 1."], [75, "That is step 1: one person's amount. Now times by 10."], [120, "That is 300 &divide; 10 &times; 4, which flips it round. Find one person's amount first."]],
          hint: "Go through one: 300 &divide; 4 first.",
          why: "300 &divide; 4 = 75 g each. 75 &times; 10 = <b>750 g</b>." } } },

    { type: "mc", topic: "Two step problems",
      q: "Which is better value? Bag A: 2 [[things]] for &pound;1. Bag B: 5 [[things]] for &pound;2.",
      options: ["Bag A", "Bag B", "They are the same value"],
      answer: 1, fixed: true,
      slips: { 0: "Bag A is 50p each (&pound;1 &divide; 2). Check B the same way.", 2: "Find the price of one in each. They come out different." },
      hint: "Work out the price of one [[thing]] in each bag.",
      why: "A: 100p &divide; 2 = 50p each. B: 200p &divide; 5 = 40p each. <b>B</b> is cheaper per [[thing]].",
      lv: {
        medium: { q: "Which is better value? Bag A: 4 [[things]] for &pound;5.20. Bag B: 6 [[things]] for &pound;8.40.",
          answer: 0,
          slips: { 1: "B is 8.40 &divide; 6 = &pound;1.40 each. Check A the same way.", 2: "Find the price of one in each. They come out different." },
          why: "A: 5.20 &divide; 4 = &pound;1.30 each. B: 8.40 &divide; 6 = &pound;1.40 each. <b>A</b> wins, even though B is the bigger bag." },
        spicy: { q: "Which is better value? Bag A: 750 g for &pound;2.40. Bag B: 1.2 kg for &pound;3.72.",
          answer: 1,
          slips: { 0: "A is 2.40 &divide; 7.5 = 32p per 100 g. Check B the same way: 1.2 kg is 12 lots of 100 g.", 2: "Close, but not quite the same. Compare the price per 100 g." },
          hint: "Find the price per 100 g for each. 1.2 kg = 1200 g.",
          why: "A: 2.40 &divide; 7.5 = 32p per 100 g. B: 3.72 &divide; 12 = 31p per 100 g. <b>B</b>, by a penny." } } }
  ],

  realWorld: {
    title: "Every trip is a multiply or divide",
    html: "<p>Splitting a bill, booking enough seats, working out if the big pack is really cheaper, scaling a recipe: it is the same question every time. <b>Do I know the total?</b></p>" +
      "<p>For our big question: a time traveller would need to plan supplies. Food for 4 people for 5 days is a multiply. Making 60 snack bars last 5 days is a divide. Would you trust your maths to get you home?</p>",
    fig: svg(420, 150, "A time traveller planning supplies next to a portal",
      A.portal(70, 76, 54) + '<rect x="150" y="30" width="150" height="96" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
      tx(162, 56, "Supplies", 15, INK, ' font-weight="700"') + tx(162, 80, "4 people x 5 days", 13, INK) + tx(162, 102, "60 bars / 5 days", 13, INK) +
      A.jay(360, 48, 0.68, "smile"))
  },

  make: {
    title: "Make a problem card",
    intro: "Write your own real life problem, if you like. Someone else has to decide: multiply or divide? Send it to Jay and see if he gets it.",
    fields: [
      { id: "story", label: "The problem", ph: "8 friends share 32 slices of pizza equally.", max: 90 },
      { id: "ask", label: "The question", ph: "How many slices each?", max: 50 },
      { id: "ans", label: "The answer (on the back)", ph: "32 / 8 = 4 slices each", max: 30 },
      { id: "name", label: "Set by", ph: "Problem setter", max: 24 }
    ],
    svg: function(v){
      function e(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ while(x.length > n){ if(cur.trim()){ out.push(cur.trim()); cur = ""; } out.push(x.slice(0, n)); x = x.slice(n); } if((cur + " " + x).trim().length > n){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max); }
      var story = wrap(v.story, 28, 3), ask = wrap(v.ask, 28, 2), ans = wrap(v.ans, 34, 1);
      function T(x, y, s, size, fill, w){ return '<text x="' + x + '" y="' + y + '" font-family="Verdana,Arial,sans-serif" font-size="' + size + '" fill="' + fill + '"' + (w ? ' font-weight="700"' : "") + '>' + e(s) + '</text>'; }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#fff8ec"/>' +
        '<rect x="14" y="14" width="572" height="372" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        '<rect x="30" y="30" width="540" height="46" rx="12" fill="#ff8a3d"/>' +
        '<text x="300" y="62" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="22" font-weight="700" fill="#ffffff" letter-spacing="2">MULTIPLY OR DIVIDE?</text>' +
        story.map(function(l, k){ return T(40, 122 + k * 32, l, 22, "#141a33", false); }).join("") +
        ask.map(function(l, k){ return T(40, 236 + k * 32, l, 22, "#1f6fb2", true); }).join("") +
        '<path d="M30 290h540" stroke="#141a33" stroke-width="2" stroke-dasharray="8 6"/>' +
        T(40, 322, "Answer: " + (ans[0] || ""), 18, "#5b6180", false) +
        T(40, 360, "Set by " + (v.name || ""), 16, "#5b6180", false) +
        '<g transform="translate(468 136)"><rect x="0" y="0" width="90" height="34" rx="6" fill="#ffd23f" stroke="#141a33" stroke-width="2"/><rect x="0" y="40" width="44" height="34" rx="6" fill="#d9f3ff" stroke="#141a33" stroke-width="2"/><rect x="46" y="40" width="44" height="34" rx="6" fill="#e6f9ef" stroke="#141a33" stroke-width="2"/>' +
        '<text x="45" y="23" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="14" font-weight="700" fill="#141a33">total</text>' +
        '<text x="22" y="63" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="13" fill="#141a33">part</text><text x="68" y="63" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="13" fill="#141a33">part</text></g>' +
        '</svg>';
    }
  }
};
})();
