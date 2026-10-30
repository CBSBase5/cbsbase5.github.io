/* Base 5 Autumn 2 activity: Speed, distance, time.
   Maths. Speed = distance / time, finding distance and time,
   minutes as parts of an hour, and planning a journey. ASCII only. */
(function(){
var A = window.A2ART;
var F = "Verdana,Arial,sans-serif";
function T(x, y, t, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" font-family="' + F + '" font-size="' + (o.s || 15) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.f || "#141a33") + '">' + t + '</text>';
}
/* a little bus, facing right, nose at x */
function bus(x, y, s, col){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
    '<rect x="-64" y="-34" width="64" height="30" rx="7" fill="' + (col || "#ffd23f") + '" stroke="#141a33" stroke-width="2.5"/>' +
    '<rect x="-56" y="-28" width="14" height="11" rx="2" fill="#bfe6fa"/><rect x="-38" y="-28" width="14" height="11" rx="2" fill="#bfe6fa"/><rect x="-20" y="-28" width="14" height="11" rx="2" fill="#bfe6fa"/>' +
    '<circle cx="-48" cy="-3" r="7" fill="#141a33"/><circle cx="-14" cy="-3" r="7" fill="#141a33"/><circle cx="-48" cy="-3" r="2.5" fill="#d9d8e6"/><circle cx="-14" cy="-3" r="2.5" fill="#d9d8e6"/></g>';
}
/* a step by step working box */
function work(lines){ return '<div class="a2task">' + lines.map(function(l){ return '<p style="margin:4px 0">' + l + '</p>'; }).join("") + '</div>'; }

/* the road: 120 km in 2 hours, 60 km each hour */
var ROAD =
  '<svg viewBox="0 0 520 200" role="img" aria-label="A road 120 kilometres long split into two 60 kilometre hours. A bus travels along it.">' +
  '<rect width="520" height="200" rx="16" fill="#eef6fb"/>' +
  '<rect x="30" y="96" width="460" height="30" rx="4" fill="#5b6180"/><path d="M40 111H480" stroke="#ffffff" stroke-width="3" stroke-dasharray="14 10"/>' +
  '<path d="M40 136V150M260 136V150M480 136V150" stroke="#141a33" stroke-width="3"/>' +
  T(40, 170, "0 km", { a: "middle", s: 14 }) + T(260, 170, "60 km", { a: "middle", s: 14, b: 1 }) + T(480, 170, "120 km", { a: "middle", s: 14, b: 1 }) +
  '<path d="M44 60H256M264 60H476" stroke="#e04848" stroke-width="3"/><path d="M44 52v16M256 52v16M264 52v16M476 52v16" stroke="#e04848" stroke-width="3"/>' +
  T(150, 46, "1st hour: 60 km", { a: "middle", s: 14, b: 1, f: "#e04848" }) + T(370, 46, "2nd hour: 60 km", { a: "middle", s: 14, b: 1, f: "#e04848" }) +
  bus(300, 100, 0.9) +
  T(260, 192, "120 km in 2 hours is 60 km in each hour: 60 km/h", { a: "middle", s: 13, f: "#3b4160" }) +
  '</svg>';

/* the triangle: D over S and T */
var TRI =
  '<svg viewBox="0 0 520 220" role="img" aria-label="The speed distance time triangle: D on top, S and T underneath">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  '<path d="M140 22L250 196H30z" fill="#ffd23f" fill-opacity=".45" stroke="#141a33" stroke-width="3.5"/>' +
  '<path d="M84 118H196M140 118V196" stroke="#141a33" stroke-width="3"/>' +
  T(140, 98, "D", { a: "middle", s: 34, b: 1 }) + T(102, 174, "S", { a: "middle", s: 30, b: 1 }) + T(178, 174, "T", { a: "middle", s: 30, b: 1 }) +
  T(290, 56, "Cover the one you want:", { s: 15, b: 1 }) +
  T(290, 96, "D = S x T", { s: 20, b: 1, f: "#e04848" }) +
  T(290, 136, "S = D &#247; T", { s: 20, b: 1, f: "#1f6fb5" }) +
  T(290, 176, "T = D &#247; S", { s: 20, b: 1, f: "#1f9d63" }) +
  A.egg(A.bird(486, 196, 0.55, "#19c39a"), "Top speed of a peregrine falcon in a dive: over 300 km/h. Jay checked. Twice. He likes birds.") +
  '</svg>';

/* a clock: quarters of an hour as decimals */
var CLOCK =
  '<svg viewBox="0 0 520 220" role="img" aria-label="A clock split into quarters. 15 minutes is 0.25 hours, 30 minutes is 0.5, 45 minutes is 0.75">' +
  '<rect width="520" height="220" rx="16" fill="#f1f3fb"/>' +
  '<g transform="translate(120 110)">' +
  '<path d="M0 0V-84A84 84 0 0 1 84 0z" fill="#ffd23f"/><path d="M0 0H84A84 84 0 0 1 0 84z" fill="#22b8e6" fill-opacity=".7"/><path d="M0 0V84A84 84 0 0 1 -84 0z" fill="#19c39a" fill-opacity=".7"/>' +
  '<circle r="84" fill="none" stroke="#141a33" stroke-width="3.5"/>' +
  [0, 1, 2, 3].map(function(k){ var a = k * Math.PI / 2; return '<path d="M' + (76 * Math.sin(a)).toFixed(1) + ' ' + (-76 * Math.cos(a)).toFixed(1) + 'L' + (86 * Math.sin(a)).toFixed(1) + ' ' + (-86 * Math.cos(a)).toFixed(1) + '" stroke="#141a33" stroke-width="3"/>'; }).join("") +
  '<path d="M0 0V-60M0 0L-48 0" stroke="#141a33" stroke-width="4" stroke-linecap="round"/><circle r="5" fill="#141a33"/></g>' +
  T(250, 52, "15 minutes = 1/4 hour = 0.25 h", { s: 15, b: 1 }) +
  T(250, 88, "30 minutes = 1/2 hour = 0.5 h", { s: 15, b: 1 }) +
  T(250, 124, "45 minutes = 3/4 hour = 0.75 h", { s: 15, b: 1 }) +
  T(250, 160, "20 minutes = 1/3 hour", { s: 15, b: 1 }) +
  T(250, 196, "1 h 30 min = 1.5 h (not 1.3)", { s: 15, b: 1, f: "#e04848" }) +
  '</svg>';

/* two legs of a journey */
var LEGS =
  '<svg viewBox="0 0 520 200" role="img" aria-label="A journey in two legs, with a stop in the middle. Add the distances and add the times.">' +
  '<rect width="520" height="200" rx="16" fill="#f3f7ee"/>' +
  '<path d="M50 120Q150 60 250 110T470 100" fill="none" stroke="#5b6180" stroke-width="14" stroke-linecap="round"/>' +
  '<path d="M50 120Q150 60 250 110T470 100" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="10 8"/>' +
  '<circle cx="50" cy="120" r="12" fill="#19c39a" stroke="#141a33" stroke-width="2.5"/><circle cx="250" cy="110" r="12" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/>' +
  '<path d="M470 100V58" stroke="#141a33" stroke-width="3"/><path d="M470 58h30l-8 9 8 9h-30z" fill="#e04848"/>' +
  T(50, 154, "Start", { a: "middle", s: 14, b: 1 }) + T(250, 146, "Stop", { a: "middle", s: 14, b: 1 }) + T(470, 134, "Finish", { a: "middle", s: 14, b: 1 }) +
  T(150, 56, "Leg 1", { a: "middle", s: 14, b: 1, f: "#1f6fb5" }) + T(360, 66, "Leg 2", { a: "middle", s: 14, b: 1, f: "#1f6fb5" }) +
  T(260, 184, "Whole journey: total distance &#247; total time", { a: "middle", s: 14, b: 1, f: "#e04848" }) +
  '</svg>';

(window.A2PACKS = window.A2PACKS || {})["speed-distance-time"] = {
  a2: true,
  id: "a2-speed-distance-time",
  title: "Speed, distance, time",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 25,
  line: "Speed is how far you go in each hour. Know two of speed, distance and time, and you can find the third.",
  blurb: "Working out speed, distance and time, with worked examples to follow, then minutes as parts of an hour and planning a real journey. Four short chunks, with a journey card to make at the end.",
  note: "Speed, distance and time, with worked examples to follow and a journey card at the end. Four five minute chunks. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Cruise", line: "Cruise: whole numbers and whole hours, finding the speed." },
    { id: "medium", name: "Express", line: "Express: finding speed, distance or time, with half hours." },
    { id: "spicy", name: "Warp speed", line: "Warp speed: minutes into hours, decimals, and whole journey averages." }
  ],
  themes: {
    time: { name: "Time travel", w: { mover: "the hover bus", who: "the time traveller", from: "the lab", to: "the old castle" } },
    football: { name: "Football", w: { mover: "the team coach", who: "the winger", from: "the training ground", to: "the away ground" } },
    horror: { name: "Horror", w: { mover: "the night bus", who: "the night porter", from: "the town centre", to: "the haunted manor" } },
    fishing: { name: "Fishing", w: { mover: "the tackle van", who: "the angler", from: "home", to: "the lake" } },
    music: { name: "Music", w: { mover: "the tour bus", who: "the dancer", from: "the theatre", to: "the next venue" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  ez: {
    realWorld: { html: "<p>Sat navs and bus apps use speed, distance and time.</p><p>A time machine would break the sums!</p>" },
    make: { intro: "Where to, how far, how fast? The card finds the time." }
  },
  startFig: ROAD,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "What speed means", title: "Speed is distance in each hour",
      fig: ROAD,
      html: "<p><b>Speed</b> tells you how far something goes in each hour (or each second, or each minute).</p>" +
        "<p><b>Speed = distance &#247; time</b></p>" +
        work(["<b>Worked example.</b> [[Mover]] goes 120 km in 2 hours.", "Speed = distance &#247; time", "Speed = 120 &#247; 2 = <b>60 km/h</b>", "km/h means kilometres per hour: 60 km in every hour."]),
      ez: { html: "<p><b>Speed</b> is how far you go in each hour.</p>" + work(["[[Mover]] goes 120 km in 2 hours.", "120 &#247; 2 = <b>60 km/h</b>"]) },
      lv: { spicy: { html: "<p><b>Speed</b> is the distance covered in each unit of time.</p>" +
        "<p><b>Speed = distance &#247; time</b>, and the units come along for the ride: km &#247; hours gives km/h, metres &#247; seconds gives m/s.</p>" +
        work(["<b>Worked example.</b> [[Mover]] goes 195 km in 3 hours.", "Speed = 195 &#247; 3 = <b>65 km/h</b>", "<b>Another.</b> [[Who]] sprints 100 m in 12.5 seconds.", "Speed = 100 &#247; 12.5 = <b>8 m/s</b>"]) } } },

    { type: "num", topic: "What speed means",
      q: "[[Mover]] travels 150 km in 3 hours. What is its average speed?",
      boxes: [{ label: "Speed", a: 50, post: "km/h" }],
      slips: [[450, "That is distance times time. Speed is distance <b>divided by</b> time."], [153, "That adds the numbers. Speed is distance divided by time."], [147, "That takes away. Speed is distance divided by time."]],
      hint: "Speed = distance &#247; time = 150 &#247; 3",
      why: "150 &#247; 3 = <b>50 km/h</b>. It covers 50 km in every hour.",
      ez: { q: "[[Mover]] goes 80 km in 2 hours. What is its speed?", slips: [[null, "That times them. Divide instead."], [null, "That adds. Divide instead."], [null, "That takes away. Divide instead."]],
        why: "80 &#247; 2 = <b>40 km/h</b>." },
      lv: { mild: { q: "[[Mover]] travels 80 km in 2 hours. What is its average speed?",
          boxes: [{ label: "Speed", a: 40, post: "km/h" }],
          slips: [[160, "That is distance times time. Speed is distance <b>divided by</b> time."], [82, "That adds the numbers. Speed is distance divided by time."], [78, "That takes away. Divide instead."]],
          hint: "Speed = distance &#247; time = 80 &#247; 2",
          why: "80 &#247; 2 = <b>40 km/h</b>. It covers 40 km in every hour." },
        spicy: { q: "[[Mover]] travels 195 km in 3 hours, then another 105 km in 2 hours. What is its average speed for the second part only?",
          boxes: [{ label: "Speed", a: 52.5, post: "km/h" }],
          slips: [[60, "That is the whole journey: 300 &#247; 5. The question asks about the second part only."], [65, "That is the first part. The question asks about the second part only."], [210, "That is distance times time. Divide instead."]],
          hint: "Second part only: 105 &#247; 2",
          why: "105 &#247; 2 = <b>52.5 km/h</b>. Always check which part of the journey the question is about." } } },

    { type: "num", topic: "What speed means",
      q: "[[Who]] walks 12 km in 4 hours. What is the average walking speed?",
      boxes: [{ label: "Speed", a: 3, post: "km/h" }],
      slips: [[48, "That is distance times time. Divide instead."], [0.33, "That is time divided by distance, upside down. Distance goes first."], [0.333, "That is time divided by distance, upside down. Distance goes first."], [8, "That takes away. Divide instead."]],
      hint: "12 &#247; 4",
      why: "12 &#247; 4 = <b>3 km/h</b>. A gentle stroll, maybe with a stop for some birdwatching.",
      ez: { q: "[[Who]] walks 10 km in 2 hours. What is the speed?" },
      lv: { mild: { q: "[[Who]] walks 10 km in 2 hours. What is the average walking speed?",
          boxes: [{ label: "Speed", a: 5, post: "km/h" }],
          slips: [[20, "That is distance times time. Divide instead."], [8, "That takes away. Divide instead."], [12, "That adds. Divide instead."]],
          hint: "10 &#247; 2",
          why: "10 &#247; 2 = <b>5 km/h</b>." },
        spicy: { q: "[[Who]] walks 9 km in 1.5 hours. What is the average walking speed?",
          boxes: [{ label: "Speed", a: 6, post: "km/h" }],
          slips: [[13.5, "That is distance times time. Divide instead."], [0.1667, "That is time divided by distance. Distance goes first."], [0.17, "That is time divided by distance. Distance goes first."]],
          hint: "9 &#247; 1.5. If that feels tricky, double both: 18 &#247; 3.",
          why: "9 &#247; 1.5 = <b>6 km/h</b>. Doubling both numbers (18 &#247; 3) gives the same answer and is easier to do in your head." } } },

    { type: "mc", topic: "What speed means",
      q: "Which of these is a <b>speed</b>?",
      options: ["60 km/h", "60 km", "60 minutes", "60 kg"],
      answer: 0,
      slips: { 1: "60 km is a distance. A speed says how far <b>per</b> hour.", 2: "60 minutes is a time.", 3: "60 kg is a weight." },
      hint: "Look for \"per\" hiding in the unit.",
      why: "km/h means kilometres <b>per</b> hour. That per is the giveaway: distance per time is a speed.",
      ez: { slips: { 1: "60 km is a distance.", 2: "60 minutes is a time.", 3: "60 kg is a weight." }, hint: "Look for per in the unit.", why: "km/h means km <b>per</b> hour. That is a speed." },
      lv: { spicy: { q: "Which of these is the <b>fastest</b>?",
        options: ["20 metres per second", "60 km/h", "1 km per minute", "1000 metres per hour"],
        slips: { 1: "60 km/h is the same as 1 km per minute. Try turning 20 m/s into km/h: times 3600, then divide by 1000.", 2: "1 km per minute is 60 km/h. Turn 20 m/s into km/h and compare.", 3: "1000 metres per hour is only 1 km/h: walking pace for a snail with ambition." },
        hint: "Turn them all into km/h. 20 m/s: 20 x 3600 = 72 000 m per hour.",
        why: "20 m/s x 3600 = 72 000 m per hour = <b>72 km/h</b>. That beats 60 km/h (which is the same as 1 km per minute) and 1 km/h." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "The triangle", title: "Finding distance or time",
      fig: TRI,
      html: "<p>The triangle holds all three. Cover the one you want and the other two show you the sum.</p>" +
        work(["<b>Worked example: distance.</b> [[Mover]] goes at 50 km/h for 3 hours.", "Cover D: S x T", "D = 50 x 3 = <b>150 km</b>"]) +
        work(["<b>Worked example: time.</b> [[Mover]] goes 240 km at 60 km/h.", "Cover T: D &#247; S", "T = 240 &#247; 60 = <b>4 hours</b>"]) +
        "<p>Next, the steps get filled in less and less, until you are doing it on your own.</p>",
      ez: { html: "<p>Cover the one you want on the triangle.</p>" + work(["<b>Distance.</b> 20 km/h for 2 hours.", "20 x 2 = <b>40 km</b>"]) + work(["<b>Time.</b> 60 km at 30 km/h.", "60 &#247; 30 = <b>2 hours</b>"]) },
      lv: { mild: { html: "<p>The triangle holds all three. Cover the one you want and the other two show you the sum.</p>" +
          work(["<b>Worked example: distance.</b> [[Mover]] goes at 20 km/h for 2 hours.", "Cover D: S x T", "D = 20 x 2 = <b>40 km</b>"]) +
          work(["<b>Worked example: time.</b> [[Mover]] goes 60 km at 30 km/h.", "Cover T: D &#247; S", "T = 60 &#247; 30 = <b>2 hours</b>"]) +
          "<p>Next, the steps get filled in less and less, until you are doing it on your own.</p>" },
        spicy: { html: "<p>The triangle holds all three. Cover the one you want.</p>" +
          work(["<b>Worked example: distance.</b> [[Mover]] goes at 48 km/h for 2.5 hours.", "D = S x T = 48 x 2.5", "48 x 2 = 96, and 48 x 0.5 = 24, so D = <b>120 km</b>"]) +
          work(["<b>Worked example: time.</b> [[Mover]] goes 210 km at 60 km/h.", "T = D &#247; S = 210 &#247; 60 = <b>3.5 hours</b>", "3.5 hours = 3 hours 30 minutes"]) +
          "<p>Next, the steps get filled in less and less, until you are doing it on your own.</p>" } } },

    { type: "num", topic: "The triangle",
      q: "[[Mover]] travels at 40 km/h for 3 hours. How far does it go?" + work(["Cover D: S x T", "D = 40 x 3 = ?"]),
      boxes: [{ label: "Distance", a: 120, post: "km" }],
      slips: [[13.3, "That divides. Covering D leaves S and T side by side, which means multiply."], [13.33, "That divides. Covering D leaves S and T side by side, which means multiply."], [43, "That adds. S and T side by side means multiply."]],
      hint: "The working is set up for you: 40 x 3.",
      why: "D = 40 x 3 = <b>120 km</b>.",
      ez: { q: "[[Mover]] goes at 30 km/h for 2 hours. How far?" + work(["D = 30 x 2 = ?"]) },
      lv: { mild: { q: "[[Mover]] travels at 30 km/h for 2 hours. How far does it go?" + work(["Cover D: S x T", "D = 30 x 2 = ?"]),
          boxes: [{ label: "Distance", a: 60, post: "km" }],
          slips: [[15, "That divides. Covering D leaves S x T: multiply."], [32, "That adds. Multiply instead."]],
          hint: "30 x 2",
          why: "D = 30 x 2 = <b>60 km</b>." },
        spicy: { q: "[[Mover]] travels at 64 km/h for 1.5 hours. How far does it go?" + work(["D = S x T = 64 x 1.5", "64 x 1 = 64, and 64 x 0.5 = ?", "D = 64 + ? = ?"]),
          boxes: [{ label: "Distance", a: 96, post: "km" }],
          slips: [[42.67, "That divides. Covering D means multiply."], [74, "Check the half: 64 x 0.5 is half of 64, which is 32."], [65.5, "That adds 64 and 1.5. Multiply instead."]],
          hint: "Half of 64 is 32. Then add.",
          why: "64 + 32 = <b>96 km</b>. Splitting 1.5 into 1 and 0.5 makes it easy." } } },

    { type: "num", topic: "The triangle",
      q: "[[Mover]] travels 180 km at 60 km/h. How long does the journey take? Fill in the working.",
      boxes: [{ label: "Distance", a: 180, pre: "T =" }, { label: "Speed", a: 60, pre: "&#247;" }, { label: "Time", a: 3, pre: "=", post: "hours" }],
      slips: [[2, 10800, "That multiplies. Covering T leaves D over S: divide."], [2, 0.333, "That is speed &#247; distance. Distance goes on top."]],
      hint: "Cover T: D over S. 180 &#247; 60.",
      why: "T = 180 &#247; 60 = <b>3 hours</b>.",
      ez: { q: "[[Mover]] goes 80 km at 40 km/h. How long does it take?", slips: [[null, null, "That multiplies. Divide."], [null, null, "Distance goes on top."]], hint: "80 &#247; 40." },
      lv: { mild: { q: "[[Mover]] travels 80 km at 40 km/h. How long does the journey take? Fill in the working.",
          boxes: [{ label: "Distance", a: 80, pre: "T =" }, { label: "Speed", a: 40, pre: "&#247;" }, { label: "Time", a: 2, pre: "=", post: "hours" }],
          slips: [[2, 3200, "That multiplies. Covering T means divide."], [2, 0.5, "That is speed &#247; distance. Distance goes on top."]],
          hint: "Cover T: D over S. 80 &#247; 40.",
          why: "T = 80 &#247; 40 = <b>2 hours</b>." },
        spicy: { q: "[[Mover]] travels 210 km at 84 km/h. How long does the journey take, in hours? Fill in the working.",
          boxes: [{ label: "Distance", a: 210, pre: "T =" }, { label: "Speed", a: 84, pre: "&#247;" }, { label: "Time", a: 2.5, pre: "=", post: "hours" }],
          slips: [[2, 0.4, "That is speed &#247; distance. Distance goes on top."], [2, 17640, "That multiplies. Covering T means divide."], [2, 2.3, "Careful: 2.5 hours is 2 hours 30 minutes, written as a decimal 2.5."]],
          hint: "210 &#247; 84. Try: how many 84s in 210? Two make 168, and 42 is left, which is half of 84.",
          why: "T = 210 &#247; 84 = <b>2.5 hours</b> (2 hours 30 minutes)." } } },

    { type: "num", topic: "The triangle",
      q: "[[Mover]] travels at 45 km/h for 4 hours. How far does it go? This time, no working given.",
      boxes: [{ label: "Distance", a: 180, post: "km" }],
      slips: [[11.25, "That divides. Distance means S x T: multiply."], [49, "That adds. Multiply instead."]],
      hint: "Which letter are you finding? Cover it.",
      why: "D = S x T = 45 x 4 = <b>180 km</b>.",
      ez: { q: "[[Mover]] goes at 25 km/h for 4 hours. How far?", slips: [[null, "That divides. Multiply."], [null, "That adds. Multiply."]], hint: "Cover D on the triangle." },
      lv: { mild: { q: "[[Mover]] travels at 25 km/h for 4 hours. How far does it go? This time, no working given.",
          boxes: [{ label: "Distance", a: 100, post: "km" }],
          slips: [[6.25, "That divides. Distance means S x T: multiply."], [29, "That adds. Multiply instead."]],
          why: "D = 25 x 4 = <b>100 km</b>." },
        spicy: { q: "[[Who]] cycles 27 km at 12 km/h. How long does it take, in hours? No working given.",
          boxes: [{ label: "Time", a: 2.25, post: "hours" }],
          slips: [[324, "That multiplies. Time means D &#247; S."], [0.44, "That is speed &#247; distance. Distance goes on top."], [2.15, "27 &#247; 12 is 2 remainder 3, but the remainder is 3 twelfths of an hour: 0.25, not 0.15."], [2.3, "27 &#247; 12 is 2 remainder 3. Three twelfths is a quarter: 0.25."]],
          hint: "Cover T: 27 &#247; 12. Two twelves are 24, with 3 left over.",
          why: "T = 27 &#247; 12 = <b>2.25 hours</b>. That is 2 hours and a quarter: 2 hours 15 minutes." } } },

    { type: "mc", topic: "The triangle", explain: true,
      q: "You know the distance and the speed. Which calculation finds the <b>time</b>?",
      options: ["distance &#247; speed", "speed &#247; distance", "distance x speed", "speed + distance"],
      answer: 0,
      slips: { 1: "That is upside down. On the triangle, D sits on top of S.", 2: "Multiplying makes the number bigger. Cover T: D sits over S, so divide.", 3: "Adding mixes up kilometres and kilometres per hour. Cover T on the triangle." },
      hint: "Cover T on the triangle. What is left?",
      why: "Cover T and you see D over S: <b>distance &#247; speed</b>.",
      ez: { q: "Which sum finds the <b>time</b>?", slips: { 1: "Upside down. D sits on top.", 2: "Times makes it bigger. Divide.", 3: "Cover T on the triangle." }, why: "<b>distance &#247; speed</b>." } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Minutes and hours", title: "Minutes are parts of an hour",
      fig: CLOCK,
      html: "<p>Speeds in km/h need the time in <b>hours</b>. So minutes need turning into parts of an hour first.</p>" +
        "<p>An hour has <b>60</b> minutes, not 100. So 30 minutes is half an hour: <b>0.5</b> hours, not 0.3.</p>" +
        work(["<b>Worked example.</b> [[Mover]] goes 90 km in 1 hour 30 minutes.", "1 hour 30 minutes = 1.5 hours", "Speed = 90 &#247; 1.5 = <b>60 km/h</b>"]),
      ez: { html: "<p>Half an hour is 30 minutes.</p>" + work(["[[Mover]] goes 30 km in half an hour.", "30 + 30 = <b>60 km/h</b>"]) },
      lv: { mild: { html: "<p>Speeds in km/h need the time in <b>hours</b>.</p>" +
          "<p>Half an hour is 30 minutes. In half an hour you go <b>half</b> as far as in a whole hour.</p>" +
          work(["<b>Worked example.</b> [[Mover]] goes 30 km in half an hour.", "In a whole hour it would go 30 + 30 = 60 km.", "Speed = <b>60 km/h</b>"]) },
        spicy: { html: "<p>For km/h, the time must be in <b>hours</b>. To turn minutes into hours, <b>divide by 60</b>.</p>" +
          "<p>45 minutes = 45 &#247; 60 = 0.75 h. 20 minutes = 20 &#247; 60 = 1/3 h. 1 hour 12 minutes = 1.2 h.</p>" +
          work(["<b>Worked example.</b> [[Mover]] goes 50 km in 40 minutes.", "40 minutes = 40 &#247; 60 = 2/3 hour", "Speed = 50 &#247; 2/3 = 50 x 3 &#247; 2 = <b>75 km/h</b>"]) +
          "<p>Watch out: 1.3 hours is <b>not</b> 1 hour 30 minutes. It is 1 hour 18 minutes (0.3 x 60).</p>" } } },

    { type: "num", topic: "Minutes and hours",
      q: "Write <b>45 minutes</b> as a decimal of an hour.",
      boxes: [{ label: "Hours", a: 0.75, post: "h" }],
      slips: [[0.45, "45 minutes is not 0.45 hours: an hour has 60 minutes, not 100. Divide 45 by 60."], [45, "That is still in minutes. Divide by 60 to get hours."], [4.5, "Divide 45 by 60, not by 10."]],
      hint: "45 &#247; 60. Or: 45 minutes is three quarters of an hour.",
      why: "45 &#247; 60 = <b>0.75 hours</b>: three quarters of an hour.",
      ez: { slips: [[null, "30 minutes is half an hour: 0.5."], [null, "That is minutes. Half an hour is 0.5."]], hint: "A half is 0.5.", why: "<b>0.5 hours</b>." },
      lv: { mild: { q: "Write <b>30 minutes</b> as a decimal of an hour.",
          boxes: [{ label: "Hours", a: 0.5, post: "h" }],
          slips: [[0.3, "30 minutes is not 0.3 hours. It is half an hour, and a half is 0.5."], [30, "That is still in minutes. 30 minutes is half an hour."]],
          hint: "30 minutes is half an hour. How do you write a half as a decimal?",
          why: "30 minutes is half an hour: <b>0.5 hours</b>." },
        spicy: { q: "Write <b>1 hour 12 minutes</b> as a decimal of an hour.",
          boxes: [{ label: "Hours", a: 1.2, post: "h" }],
          slips: [[1.12, "12 minutes is not 0.12 hours. Divide 12 by 60."], [72, "That is the time in minutes. Divide by 60 for hours."]],
          hint: "12 &#247; 60, then add the 1 hour.",
          why: "12 &#247; 60 = 0.2, so 1 hour 12 minutes = <b>1.2 hours</b>." } } },

    { type: "num", topic: "Minutes and hours",
      q: "[[Mover]] travels 90 km in 1 hour 30 minutes. What is its average speed?",
      boxes: [{ label: "Speed", a: 60, post: "km/h" }],
      slips: [[[69.2, 69.23, 69.231], "That used 1.3 hours. 1 hour 30 minutes is 1.5 hours."], [1, "That divided by 90 minutes. Change the time into hours first: 1.5 hours."], [135, "That multiplies. Speed is distance &#247; time."]],
      hint: "Change the time to hours first: 1.5 hours. Then 90 &#247; 1.5.",
      why: "1 hour 30 minutes = 1.5 hours. 90 &#247; 1.5 = <b>60 km/h</b>.",
      ez: { q: "[[Mover]] goes 25 km in half an hour. What is its speed?", slips: [[null, "That is half an hour. Double it."], [null, "That halves it. Double it."]], hint: "25 + 25.", why: "25 + 25 = <b>50 km/h</b>." },
      lv: { mild: { q: "[[Mover]] travels 25 km in half an hour. How far would it go in a whole hour? So what is its speed?",
          boxes: [{ label: "Speed", a: 50, post: "km/h" }],
          slips: [[25, "That is how far it goes in <b>half</b> an hour. A whole hour is two halves."], [12.5, "That halves it. A whole hour is twice as long, so double it."]],
          hint: "A whole hour is two half hours. 25 + 25.",
          why: "25 + 25 = 50 km in an hour: <b>50 km/h</b>." },
        spicy: { q: "[[Mover]] travels 50 km in 40 minutes. What is its average speed in km/h?",
          boxes: [{ label: "Speed", a: 75, post: "km/h" }],
          slips: [[1.25, "That is km per <b>minute</b>. Times by 60 for km per hour."], [125, "That used 0.4 hours. 40 minutes is 40 &#247; 60 = 2/3 of an hour."], [33.3, "That multiplies by 2/3. Divide by 2/3 instead (times by 3, divide by 2)."], [33.33, "That multiplies by 2/3. Divide by 2/3 instead (times by 3, divide by 2)."]],
          hint: "50 km in 40 minutes. How far in 20 minutes? Then in 60?",
          why: "50 km in 40 minutes is 25 km every 20 minutes, so 75 km in 60 minutes: <b>75 km/h</b>." } } },

    { type: "num", topic: "Minutes and hours",
      q: "[[Mover]] travels 100 km at 40 km/h. How long does it take? Give your answer in hours and minutes.",
      boxes: [{ label: "Hours", a: 2, post: "h" }, { label: "Minutes", a: 30, post: "min" }],
      slips: [[1, 50, "2.5 hours is not 2 hours 50 minutes. The 0.5 is half an hour: 30 minutes."], [1, 5, "The 0.5 is half an hour, which is 30 minutes."]],
      hint: "T = 100 &#247; 40 = 2.5 hours. Now turn the 0.5 into minutes.",
      why: "100 &#247; 40 = 2.5 hours = <b>2 hours 30 minutes</b>.",
      ez: { q: "[[Mover]] goes 120 km at 40 km/h. How many hours?", slips: [[null, "That multiplies. Divide."], [null, "That takes away. Divide."]] },
      lv: { mild: { q: "[[Mover]] travels 120 km at 40 km/h. How many hours does it take?",
          boxes: [{ label: "Hours", a: 3, post: "h" }],
          slips: [[4800, "That multiplies. Time is distance &#247; speed."], [80, "That takes away. Divide instead."]],
          hint: "How many 40s make 120?",
          why: "120 &#247; 40 = <b>3 hours</b>." },
        spicy: { q: "[[Mover]] travels 130 km at 50 km/h. How long does it take? Give your answer in hours and minutes.",
          boxes: [{ label: "Hours", a: 2, post: "h" }, { label: "Minutes", a: 36, post: "min" }],
          slips: [[1, 60, "2.6 hours is not 2 hours 60 minutes. 0.6 of an hour is 0.6 x 60."], [1, 6, "0.6 of an hour is 0.6 x 60 minutes."]],
          hint: "130 &#247; 50 = 2.6 hours. Then 0.6 x 60.",
          why: "130 &#247; 50 = 2.6 hours. 0.6 x 60 = 36, so <b>2 hours 36 minutes</b>." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Plan the journey", title: "Putting it all together",
      fig: LEGS,
      html: "<p>Real journeys are rarely one simple sum. A good plan:</p>" +
        "<p><b>1.</b> Write down what you know (with units). <b>2.</b> Pick the formula: cover the letter you want. <b>3.</b> Make the units match (minutes into hours). <b>4.</b> Ask: does the answer make sense?</p>" +
        "<p>For a journey with stops, work out each leg, then add up the distances and add up the times.</p>",
      ez: { html: "<p>Write what you know. Cover the letter you want.</p><p>Then check: does it make sense?</p>" },
      lv: { spicy: { html: "<p>A good plan for any speed question:</p>" +
        "<p><b>1.</b> Write what you know, with units. <b>2.</b> Cover the letter you want. <b>3.</b> Make the units match. <b>4.</b> Sense check.</p>" +
        "<p>For a journey in legs, the <b>average speed for the whole journey</b> is total distance &#247; total time. It is <b>not</b> the average of the two speeds, because the legs can take different amounts of time.</p>" } } },

    { type: "widget", topic: "Plan the journey", unscored: true,
      title: "Speed machine",
      html: "<p>Set a speed and a time, then press Go. Can you land exactly on the flag? There is more than one way to do it. Have a play.</p>",
      ez: { html: "<p>Pick a speed and a time. Can you hit the flag?</p>" },
      mount: function(el, api){
        var d = api.data, tk = api.tok || function(t){ return t; };
        var goal = { mild: 100, medium: 150, spicy: 135 }[api.level] || 150;
        if(d.goal !== goal){ d.goal = goal; d.s = 30; d.t = 1; d.hits = []; d.goes = 0; }
        d.hits = d.hits || [];
        el.innerHTML = '<svg viewBox="0 0 520 170" style="width:100%;max-width:560px;display:block;margin:0 auto" role="img" aria-label="A road from 0 to 200 kilometres with a flag"></svg>' +
          '<div style="display:grid;gap:10px;max-width:560px;margin:10px auto">' +
          '<label style="font-weight:700">Speed (km/h): <span data-o="s"></span><input type="range" min="5" max="100" step="5" data-i="s" style="width:100%"></label>' +
          '<label style="font-weight:700">Time (hours): <span data-o="t"></span><input type="range" min="0.5" max="4" step="0.5" data-i="t" style="width:100%"></label></div>' +
          '<div class="qnav" style="flex-wrap:wrap;gap:8px"><button type="button" class="btn" data-a="go">Go</button></div>' +
          '<p class="tiny" aria-live="polite" style="min-height:2.6em"></p>';
        var svg = el.querySelector("svg"), msg = el.querySelector("p.tiny");
        var iS = el.querySelector("[data-i=s]"), iT = el.querySelector("[data-i=t]");
        var oS = el.querySelector("[data-o=s]"), oT = el.querySelector("[data-o=t]");
        iS.value = d.s; iT.value = d.t;
        var pos = 0, busy = false;
        function X(km){ return 40 + Math.min(km, 200) * 2.2; }
        function draw(){
          oS.textContent = d.s; oT.textContent = d.t;
          var s = '<rect width="520" height="170" rx="16" fill="#eef6fb"/>' +
            '<rect x="30" y="86" width="460" height="28" rx="4" fill="#5b6180"/><path d="M40 100H480" stroke="#ffffff" stroke-width="3" stroke-dasharray="14 10"/>';
          for(var k = 0; k <= 200; k += 50) s += '<path d="M' + X(k) + ' 120v10" stroke="#141a33" stroke-width="2.5"/>' + T(X(k), 150, k + " km", { a: "middle", s: 13 });
          s += '<path d="M' + X(goal) + ' 86V40" stroke="#141a33" stroke-width="3"/><path d="M' + X(goal) + ' 40h30l-8 9 8 9h-30z" fill="#e04848"/>' +
            T(X(goal) - 8, 54, tk("[[To]]") + ": " + goal + " km", { s: 13, b: 1, a: "end" }) +
            T(40, 32, tk("[[From]]"), { s: 13, b: 1 }) +
            bus(X(pos) + 20, 92, 0.75);
          svg.innerHTML = s;
        }
        iS.oninput = function(){ d.s = +iS.value; api.save(); oS.textContent = d.s; };
        iT.oninput = function(){ d.t = +iT.value; api.save(); oT.textContent = d.t; };
        el.querySelector("[data-a=go]").onclick = function(){
          if(busy) return;
          var dist = d.s * d.t, end = dist;
          busy = true; pos = 0; var t0 = null;
          function f(ts){
            if(t0 === null) t0 = ts;
            var k = Math.min(1, (ts - t0) / 1200);
            pos = end * k; draw();
            if(k < 1){ requestAnimationFrame(f); return; }
            busy = false; d.goes = (d.goes || 0) + 1;
            var line = "Distance = speed x time = " + d.s + " x " + d.t + " = " + dist + " km. ";
            if(Math.abs(dist - goal) < 1e-9){
              var key = d.s + "x" + d.t;
              if(d.hits.indexOf(key) < 0) d.hits.push(key);
              line += tk("Spot on, you made it to [[to]]!") + (d.hits.length > 1 ? " That is " + d.hits.length + " different ways so far." : " Can you find another speed and time that also works?");
            }else if(dist > 200){ line += "Off the end of the map. Outrageous. Try a lower speed or a shorter time."; }
            else line += dist < goal ? "Not quite there: " + (goal - dist) + " km to go." : "Overshot by " + (dist - goal) + " km.";
            msg.textContent = line;
            api.save(); api.done("done");
          }
          requestAnimationFrame(f);
        };
        draw();
        if(d.goes) api.done("done");
      } },

    { type: "num", topic: "Plan the journey",
      q: "Two ways to get to [[to]]. <b>Route A:</b> 120 km on the motorway at 60 km/h. <b>Route B:</b> 60 km on country roads at 40 km/h. How long does each route take, in hours?",
      boxes: [{ label: "Route A", a: 2, post: "hours" }, { label: "Route B", a: 1.5, post: "hours" }],
      slips: [[1, 1.3, "Careful: 60 &#247; 40 is 1.5, which is 1 hour 30 minutes."], [0, 7200, "That multiplies. Time is distance &#247; speed."], [1, 2400, "That multiplies. Time is distance &#247; speed."]],
      hint: "Time = distance &#247; speed for each route.",
      why: "Route A: 120 &#247; 60 = <b>2 hours</b>. Route B: 60 &#247; 40 = <b>1.5 hours</b>. The slower road wins, because it is so much shorter.",
      ez: { q: "<b>A:</b> 120 km at 60 km/h. <b>B:</b> 40 km at 40 km/h. How many hours each?", slips: [[null, null, "That multiplies. Divide."], [null, null, "That multiplies. Divide."]],
        hint: "Distance &#247; speed.", why: "A: <b>2 hours</b>. B: <b>1 hour</b>." },
      lv: { mild: { q: "Two ways to get to [[to]]. <b>Route A:</b> 120 km at 60 km/h. <b>Route B:</b> 40 km at 40 km/h. How many hours does each route take?",
          boxes: [{ label: "Route A", a: 2, post: "hours" }, { label: "Route B", a: 1, post: "hours" }],
          slips: [[0, 7200, "That multiplies. Time is distance &#247; speed."], [1, 1600, "That multiplies. Time is distance &#247; speed."]],
          why: "Route A: 120 &#247; 60 = <b>2 hours</b>. Route B: 40 &#247; 40 = <b>1 hour</b>. Route B is quicker even though it is slower." },
        spicy: { q: "Two ways to get to [[to]]. <b>Route A:</b> 126 km on the motorway at 70 km/h. <b>Route B:</b> 78 km on country roads at 52 km/h. How long does each take, in hours?",
          boxes: [{ label: "Route A", a: 1.8, post: "hours" }, { label: "Route B", a: 1.5, post: "hours" }],
          slips: [[0, 1.48, "Check: 126 &#247; 70. Seventy goes once with 56 left, and 56 &#247; 70 = 0.8."], [1, 1.3, "Careful: 78 &#247; 52 = 1.5, which is 1 hour 30 minutes."]],
          hint: "126 &#247; 70 and 78 &#247; 52. For the second, 52 + 26 = 78, and 26 is half of 52.",
          why: "Route A: 126 &#247; 70 = <b>1.8 hours</b> (1 hour 48 minutes). Route B: 78 &#247; 52 = <b>1.5 hours</b>. Route B saves 18 minutes." } } },

    { type: "num", topic: "Plan the journey", explain: true,
      q: "A journey has two legs. Leg 1: 90 km at 45 km/h. Leg 2: 30 km at 30 km/h. What is the <b>total time</b> for the journey?",
      boxes: [{ label: "Total time", a: 3, post: "hours" }],
      slips: [[2, "That is just leg 1. Add on the time for leg 2."], [1, "That is just leg 2. Add on the time for leg 1."], [1.6, "That divides the total distance by the sum of the speeds. Work out each leg's time, then add."]],
      hint: "Leg 1: 90 &#247; 45. Leg 2: 30 &#247; 30. Then add.",
      why: "Leg 1 takes 90 &#247; 45 = 2 hours. Leg 2 takes 30 &#247; 30 = 1 hour. Total: <b>3 hours</b>.",
      ez: { q: "150 km in all. 2 hours, then 1 hour. What is the speed?", slips: [[null, "The whole trip is 3 hours."], [null, "That is the distance. Divide by the time."], [null, "That multiplies. Divide."]],
        hint: "2 + 1 hours. Then 150 &#247; that.", why: "150 &#247; 3 = <b>50 km/h</b>." },
      lv: { mild: { q: "A journey has two legs. Leg 1 takes 2 hours. Leg 2 takes 1 hour. The whole journey is 150 km. What is the average speed?",
          boxes: [{ label: "Speed", a: 50, post: "km/h" }],
          slips: [[75, "That divides by 2 hours only. The whole journey takes 2 + 1 = 3 hours."], [150, "That is the distance. Divide it by the total time."], [450, "That multiplies. Speed is distance &#247; time."]],
          hint: "Total time first: 2 + 1. Then 150 &#247; that.",
          why: "Total time 3 hours. 150 &#247; 3 = <b>50 km/h</b>." },
        spicy: { q: "Leg 1: 100 km in 2 hours. Leg 2: 80 km in 1 hour. What is the average speed for the <b>whole</b> journey?",
          boxes: [{ label: "Speed", a: 60, post: "km/h" }],
          slips: [[65, "That is the average of the two speeds (50 and 80). Use total distance &#247; total time instead: the slower leg lasted longer."], [90, "That divides the total distance by 2 hours. The total time is 3 hours."]],
          hint: "Total distance: 100 + 80. Total time: 2 + 1.",
          why: "180 km &#247; 3 hours = <b>60 km/h</b>. Averaging the speeds gives 65, which is too high: more of the journey was spent at the slower speed." } } },

    { type: "mc", topic: "Plan the journey",
      q: "Jay says he cycled to school this morning at an average speed of 300 km/h. Does that make sense?",
      fig: '<svg viewBox="0 0 360 150" role="img" aria-label="Jay looking rather pleased with himself">' + '<rect width="360" height="150" rx="16" fill="#f4f1ea"/>' + A.jay(120, 54, 0.85, "wink") +
        A.bubble(190, 20, 150, 52, "300 km/h.\nEasily.", 200) + '</svg>',
      options: ["No, that is far too fast for a bike.", "Yes, that is a normal cycling speed.", "Yes, if the school is close."],
      answer: 0,
      slips: { 1: "A normal bike ride is more like 15 to 25 km/h. 300 km/h is faster than most trains.", 2: "Speed does not depend on how far it is. 300 km/h would be faster than a racing car on a straight." },
      hint: "How fast does a car go on the motorway? Is a bike faster than that?",
      why: "300 km/h is faster than a racing car. Outrageous. A sense check like this catches slips, like a decimal point that has wandered: 30.0 km/h would be a very speedy cyclist, but possible.",
      ez: { q: "Jay says he cycled at 300 km/h. Does that make sense?", slips: { 1: "Bikes go about 20 km/h.", 2: "300 km/h is faster than a racing car." }, hint: "Is a bike faster than a car?", why: "<b>No</b>. That is faster than a racing car!" },
      lv: { spicy: { q: "Jay says he cycled 6 km to school in 12 minutes, so his average speed was 0.5 km/h. Which is true?",
        options: ["He forgot to turn minutes into hours: it is 30 km/h.", "0.5 km/h is right.", "It should be 72 km/h."],
        slips: { 1: "6 &#247; 12 = 0.5 km per <b>minute</b>, not per hour. Times by 60.", 2: "That multiplies 6 by 12. 12 minutes is 0.2 hours, and 6 &#247; 0.2 = 30." },
        hint: "12 minutes is 0.2 hours. Or: 0.5 km per minute, times 60.",
        why: "6 &#247; 12 = 0.5 km per <b>minute</b>. Times 60 gives <b>30 km/h</b>. Speedy, but possible. 0.5 km/h would be slower than a snail on a sticky day. Always sense check." } } }
  ],

  realWorld: {
    title: "Every journey planner does this",
    html: "<p>Sat navs, train timetables and bus apps all use speed, distance and time to work out when you will arrive. Pilots, delivery drivers and race teams use it every day.</p>" +
      "<p>Our big question is <b>if we could time travel, should we?</b> A time machine would be the one journey where the sums break: it covers hundreds of years in no time at all. Until then, the best way to win time back is to plan the journey well.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to a time portal doing a sum">' + A.portal(80, 75, 56) + A.jay(250, 52, 0.85, "hmm") +
      A.bubble(296, 6, 118, 52, "1000 years in\nno time at all?", 306) + '</svg>'
  },

  make: {
    title: "Make a journey card",
    intro: "Plan a real or dream journey: where to, how far, and how fast. The card works out the time for you. Keep it, or send it to Jay.",
    fields: [
      { id: "to", label: "Where to?", ph: "Bonnie's favourite beach", max: 36 },
      { id: "km", label: "Distance (km)", ph: "150", max: 6 },
      { id: "kmh", label: "Average speed (km/h)", ph: "60", max: 5 },
      { id: "by", label: "Travelling by", ph: "Train", max: 22 }
    ],
    svg: function(v){
      function e(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ while(x.length > n){ if(cur.trim()) out.push(cur.trim()); out.push(x.slice(0, n)); x = x.slice(n); cur = ""; } if((cur + " " + x).trim().length > n){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max); }
      var km = parseFloat(String(v.km || "").replace(/[^0-9.]/g, "")), sp = parseFloat(String(v.kmh || "").replace(/[^0-9.]/g, ""));
      var time = "?";
      if(km > 0 && sp > 0){
        var hrs = km / sp, h = Math.floor(hrs), m = Math.round((hrs - h) * 60);
        if(m === 60){ h++; m = 0; }
        time = (h ? h + " h " : "") + m + " min";
      }
      var to = wrap(v.to, 24, 2);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#fffaf0"/>' +
        '<rect x="0" y="0" width="600" height="70" rx="24" fill="#1f6fb5"/><rect x="0" y="40" width="600" height="30" fill="#1f6fb5"/>' +
        '<text x="34" y="46" font-family="Verdana,Arial,sans-serif" font-size="22" font-weight="700" fill="#ffffff" letter-spacing="3">JOURNEY CARD</text>' +
        '<text x="34" y="112" font-family="Verdana,Arial,sans-serif" font-size="15" fill="#5b6180">DESTINATION</text>' +
        to.map(function(t, k){ return '<text x="34" y="' + (146 + k * 36) + '" font-family="Verdana,Arial,sans-serif" font-size="30" font-weight="700" fill="#141a33">' + e(t) + '</text>'; }).join("") +
        '<path d="M34 230H566" stroke="#141a33" stroke-opacity=".15" stroke-width="2"/>' +
        '<text x="34" y="262" font-family="Verdana,Arial,sans-serif" font-size="15" fill="#5b6180">DISTANCE</text>' +
        '<text x="34" y="296" font-family="Verdana,Arial,sans-serif" font-size="24" font-weight="700" fill="#141a33">' + e(v.km) + ' km</text>' +
        '<text x="220" y="262" font-family="Verdana,Arial,sans-serif" font-size="15" fill="#5b6180">SPEED</text>' +
        '<text x="220" y="296" font-family="Verdana,Arial,sans-serif" font-size="24" font-weight="700" fill="#141a33">' + e(v.kmh) + ' km/h</text>' +
        '<text x="400" y="262" font-family="Verdana,Arial,sans-serif" font-size="15" fill="#5b6180">TIME</text>' +
        '<text x="400" y="296" font-family="Verdana,Arial,sans-serif" font-size="24" font-weight="700" fill="#e04848">' + e(time) + '</text>' +
        '<text x="34" y="344" font-family="Verdana,Arial,sans-serif" font-size="18" fill="#141a33">By ' + e(v.by) + '</text>' +
        '<text x="34" y="374" font-family="Verdana,Arial,sans-serif" font-size="14" fill="#5b6180">Time = distance &#247; speed</text>' +
        bus(560, 370, 0.8, "#ffd23f") +
        '</svg>';
    }
  }
};
})();
