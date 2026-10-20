/* Base 5 Autumn 2 activity: Plan the trip.
   Maths. Hours and minutes, journey times, timetables and a trip budget.
   Millbrook and Kingsmere are made up places. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
var P = "&#163;";
function T(x, y, s, size, extra){ extra = extra || ""; return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 15) + '"' + (/fill=/.test(extra) ? "" : ' fill="#141a33"') + ' ' + extra + '>' + s + '</text>'; }

/* the timetable data, in minutes after midnight */
var BUS = [[485, 497, 510], [515, 527, 540], [545, 557, 570], [575, 587, 600]];
var TRAIN = [522, 552, 582, 612], RIDE = 56, WALK = 15;
function hm(m, twelve){
  var h = Math.floor(m / 60) % 24, mm = m % 60;
  if(twelve){ var hh = h % 12 || 12; return hh + ":" + (mm < 10 ? "0" : "") + mm; }
  return (h < 10 ? "0" : "") + h + ":" + (mm < 10 ? "0" : "") + mm;
}

/* a clock face cut into quarters */
var CLOCK =
  '<svg viewBox="0 0 520 220" role="img" aria-label="A clock face split into quarters: 15, 30, 45 and 60 minutes">' +
  '<rect width="520" height="220" rx="16" fill="#eef6ff"/>' +
  '<g transform="translate(130 110)"><circle r="84" fill="#fff" stroke="#141a33" stroke-width="4"/>' +
  '<path d="M0 0V-84A84 84 0 0 1 84 0z" fill="#ffd23f" fill-opacity=".7"/><path d="M0 0H84A84 84 0 0 1 0 84z" fill="#22b8e6" fill-opacity=".45"/>' +
  '<path d="M0 0V84A84 84 0 0 1 -84 0z" fill="#19c39a" fill-opacity=".4"/>' +
  (function(){ var s = ""; for(var k = 0; k < 12; k++){ var a = k * Math.PI / 6; s += '<path d="M' + (Math.sin(a) * 72).toFixed(1) + ' ' + (-Math.cos(a) * 72).toFixed(1) + 'L' + (Math.sin(a) * 82).toFixed(1) + ' ' + (-Math.cos(a) * 82).toFixed(1) + '" stroke="#141a33" stroke-width="3"/>'; } return s; })() +
  '<path d="M0 0V-60" stroke="#141a33" stroke-width="5" stroke-linecap="round"/><circle r="6" fill="#141a33"/>' +
  T(28, -30, "15", 15, 'font-weight="700"') + T(28, 46, "30", 15, 'font-weight="700"') + T(-50, 46, "45", 15, 'font-weight="700"') + '</g>' +
  T(260, 50, "60 minutes = 1 hour", 18, 'font-weight="700"') +
  T(260, 86, "30 minutes = half an hour", 15) + T(260, 114, "15 minutes = a quarter", 15) + T(260, 142, "45 minutes = three quarters", 15) +
  T(260, 182, "90 minutes = 1 h 30 min", 15, 'font-weight="700" fill="#1f7a54"') +
  '</svg>';

var CLOCK_SPICY =
  '<svg viewBox="0 0 520 220" role="img" aria-label="Decimal hours and minutes side by side">' +
  '<rect width="520" height="220" rx="16" fill="#eef6ff"/>' +
  T(30, 40, "Hours as decimals", 17, 'font-weight="700"') +
  [["0.1 h", "6 min"], ["0.25 h", "15 min"], ["0.5 h", "30 min"], ["0.75 h", "45 min"], ["1.2 h", "1 h 12 min"]].map(function(r, k){
    var y = 72 + k * 30;
    return '<rect x="30" y="' + (y - 20) + '" width="110" height="26" rx="6" fill="#ffd23f" fill-opacity=".6"/>' + T(85, y, r[0], 15, 'text-anchor="middle" font-weight="700"') +
      '<path d="M150 ' + (y - 7) + 'h40M182 ' + (y - 13) + 'l8 6 -8 6" stroke="#141a33" stroke-width="2.5" fill="none"/>' + T(200, y, r[1], 15);
  }).join("") +
  T(340, 40, "24 hour clock", 17, 'font-weight="700"') +
  [["09:15", "9:15 am"], ["12:30", "12:30 pm"], ["14:30", "2:30 pm"], ["23:40", "11:40 pm"], ["00:20", "12:20 am"]].map(function(r, k){
    var y = 72 + k * 30;
    return T(340, y, r[0], 15, 'font-weight="700"') + T(410, y, r[1], 15);
  }).join("") + '</svg>';

/* hops along a time line */
function hops(stops, gaps, total){
  var n = stops.length, x0 = 50, x1 = 470, s = '<svg viewBox="0 0 520 190" role="img" aria-label="Counting on from ' + stops[0] + ' to ' + stops[n - 1] + '">' +
    '<rect width="520" height="190" rx="16" fill="#f4f1ea"/><path d="M30 120H490" stroke="#141a33" stroke-width="3"/>';
  var xs = stops.map(function(t, k){ return x0 + k * (x1 - x0) / (n - 1); });
  stops.forEach(function(t, k){ s += '<path d="M' + xs[k] + ' 108v24" stroke="#141a33" stroke-width="3"/>' + T(xs[k], 156, t, 16, 'text-anchor="middle" font-weight="700"'); });
  gaps.forEach(function(g, k){
    var a = xs[k], b = xs[k + 1], m = (a + b) / 2;
    s += '<path d="M' + (a + 6) + ' 110Q' + m + ' 46 ' + (b - 6) + ' 110" stroke="' + ["#e07a1f", "#3a8fd6", "#1f9d63", "#8a5cf6"][k % 4] + '" stroke-width="3.5" fill="none"/>' +
      '<path d="M' + (b - 6) + ' 110l-3 -12M' + (b - 6) + ' 110l-11 -6" stroke="' + ["#e07a1f", "#3a8fd6", "#1f9d63", "#8a5cf6"][k % 4] + '" stroke-width="3.5" stroke-linecap="round"/>' +
      T(m, 66, g, 15, 'text-anchor="middle" font-weight="700"');
  });
  if(total) s += T(260, 182, total, 15, 'text-anchor="middle" font-weight="700" fill="#1f7a54"');
  return s + '</svg>';
}

/* the timetable */
function timetable(twelve){
  var s = '<svg viewBox="0 0 520 300" role="img" aria-label="A bus timetable from Millbrook to the Station, and a train timetable from the Station to Kingsmere">' +
    '<rect width="520" height="300" rx="16" fill="#fffdf6"/>';
  function table(y, title, col, rows){
    var out = '<rect x="16" y="' + y + '" width="488" height="30" rx="8" fill="' + col + '"/>' + T(30, y + 21, title, 15, 'font-weight="700" fill="#ffffff"');
    rows.forEach(function(r, k){
      var yy = y + 30 + k * 30;
      out += '<rect x="16" y="' + yy + '" width="488" height="30" fill="' + (k % 2 ? "#ffffff" : "#f1f3f8") + '"/>' + T(30, yy + 21, r[0], 15, 'font-weight="700"');
      r[1].forEach(function(t, j){ out += T(214 + j * 76, yy + 21, t, 15, 'text-anchor="middle"'); });
    });
    return out;
  }
  s += table(14, "Bus 7", "#e07a1f", [
    ["Millbrook", BUS.map(function(b){ return hm(b[0], twelve); })],
    ["Town Centre", BUS.map(function(b){ return hm(b[1], twelve); })],
    ["Station", BUS.map(function(b){ return hm(b[2], twelve); })]
  ]);
  s += table(156, "Train to Kingsmere", "#2a6fb0", [
    ["Station", TRAIN.map(function(t){ return hm(t, twelve); })],
    ["Kingsmere", TRAIN.map(function(t){ return hm(t + RIDE, twelve); })]
  ]);
  s += T(30, 270, "Kingsmere station to [[dest]]: " + WALK + " minutes on foot", 14, 'fill="#5b6180"') +
    A2ART.egg(A2ART.bird(486, 270, 0.55, "#e07a1f"), "The 7 bird. Never late, never needs a ticket. Jay is jealous.") + '</svg>';
  return s;
}
var TT12 = timetable(true), TT24 = timetable(false);

/* fares board */
var FARES =
  '<svg viewBox="0 0 520 210" role="img" aria-label="A fares board with bus and train prices">' +
  '<rect width="520" height="210" rx="16" fill="#1d2b4f"/>' +
  T(30, 40, "FARES", 20, 'font-weight="700" fill="#ffd23f" letter-spacing="3"') +
  [["Bus single", P + "2.00"], ["Bus return", P + "3.50"], ["Train single", P + "8.40"], ["Train return", P + "12.60"]].map(function(r, k){
    var y = 78 + k * 32;
    return T(30, y, r[0], 17, 'fill="#ffffff"') + '<path d="M180 ' + (y - 5) + 'H330" stroke="#ffffff" stroke-opacity=".3" stroke-dasharray="3 5"/>' + T(400, y, r[1], 18, 'text-anchor="end" font-weight="700" fill="#ffd23f"');
  }).join("") +
  '<g transform="translate(468 140) scale(.62)">' + A2ART.bonnie(0, 0, 1, "sit") + '</g>' +
  A2ART.egg('<text x="440" y="200" ' + F + ' font-size="13" fill="#9fd3ff">dogs?</text>', "On most British trains, dogs travel free. Bonnie has never paid a fare in her life. Outrageous.") +
  '</svg>';

var START =
  '<svg viewBox="0 0 520 210" role="img" aria-label="A bus and a train on a route to a big day out, with Jay checking his watch">' +
  '<rect width="520" height="210" rx="16" fill="#eef6ff"/>' +
  '<path d="M150 150Q260 60 330 120T500 80" stroke="#141a33" stroke-width="4" stroke-dasharray="10 8" fill="none"/>' +
  '<g transform="translate(190 120)"><rect x="-30" y="-20" width="60" height="34" rx="8" fill="#e07a1f" stroke="#141a33" stroke-width="2"/><rect x="-22" y="-14" width="14" height="12" fill="#fff"/><rect x="-4" y="-14" width="14" height="12" fill="#fff"/><circle cx="-16" cy="16" r="6" fill="#141a33"/><circle cx="16" cy="16" r="6" fill="#141a33"/></g>' +
  '<g transform="translate(360 112)"><rect x="-40" y="-18" width="80" height="32" rx="10" fill="#2a6fb0" stroke="#141a33" stroke-width="2"/><rect x="-30" y="-12" width="16" height="12" fill="#fff"/><rect x="-8" y="-12" width="16" height="12" fill="#fff"/><rect x="14" y="-12" width="16" height="12" fill="#fff"/></g>' +
  '<g transform="translate(486 60)"><path d="M0 22V-18" stroke="#141a33" stroke-width="3"/><path d="M0 -18l22 6 -22 8z" fill="#ff5d8f"/></g>' +
  A2ART.jay(78, 100, 0.85, "smile") +
  '<g transform="translate(130 176)"><circle r="16" fill="#fff" stroke="#141a33" stroke-width="3"/><path d="M0 0V-10M0 0l7 4" stroke="#141a33" stroke-width="2.5" stroke-linecap="round"/></g>' +
  '</svg>';

/* widget: pick a bus and a train, see if you make it */
function planner(el, api){
  var d = api.data, twelve = api.level === "mild";
  var target = api.level === "spicy" ? 630 : 660;
  var dest = api.tok ? api.tok("at [[dest]]").slice(3) : "the event";
  el.innerHTML = '<p class="tiny">Be at ' + dest + ' by <b>' + hm(target, twelve) + '</b>. Pick a bus, then a train. The planner works out the rest.</p>' +
    '<p style="margin:8px 0 4px;font-weight:700">Bus from Millbrook</p><div class="pb" style="display:flex;gap:6px;flex-wrap:wrap"></div>' +
    '<p style="margin:10px 0 4px;font-weight:700">Train from the Station</p><div class="pt" style="display:flex;gap:6px;flex-wrap:wrap"></div>' +
    '<div class="pfig" style="margin-top:10px"></div><p class="pout" aria-live="polite" style="min-height:2.6em;margin:6px 0"></p>';
  var pb = el.querySelector(".pb"), pt = el.querySelector(".pt"), fig = el.querySelector(".pfig"), out = el.querySelector(".pout");
  function chip(host, label, on, fn){
    var b = document.createElement("button"); b.type = "button"; b.className = "a2chip"; b.textContent = label;
    b.setAttribute("aria-pressed", on ? "true" : "false"); b.onclick = fn; host.appendChild(b);
  }
  function draw(){
    pb.innerHTML = ""; pt.innerHTML = "";
    BUS.forEach(function(b, k){ chip(pb, hm(b[0], twelve), d.bus === k, function(){ d.bus = k; go(); }); });
    TRAIN.forEach(function(t, k){ chip(pt, hm(t, twelve), d.train === k, function(){ d.train = k; go(); }); });
    if(d.bus == null || d.train == null){ fig.innerHTML = ""; out.textContent = d.bus == null ? "Pick a bus first, if you like." : "Now pick a train."; return; }
    var b = BUS[d.bus], tDep = TRAIN[d.train], tArr = tDep + RIDE, there = tArr + WALK;
    if(tDep < b[2]){
      fig.innerHTML = "";
      out.innerHTML = "That train leaves at " + hm(tDep, twelve) + ", but the bus only reaches the station at " + hm(b[2], twelve) + ". You would see it pulling away. Try a later train.";
      return;
    }
    var wait = tDep - b[2], total = there - b[0], early = target - there;
    var x0 = 24, W = 352, from = 480, to = 690;
    function X(m){ return x0 + (m - from) / (to - from) * W; }
    var s = '<svg viewBox="0 0 400 136" style="width:100%;max-width:560px;display:block" role="img" aria-label="Your journey on a time line">' +
      '<rect width="400" height="136" rx="12" fill="#f4f1ea"/>';
    for(var m = from; m <= to; m += 30) s += '<path d="M' + X(m) + ' 30V86" stroke="#141a33" stroke-opacity=".15"/>' + (m % 60 === 0 ? '<text x="' + X(m) + '" y="104" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="13" fill="#141a33">' + hm(m, twelve) + '</text>' : "");
    s += '<rect x="' + X(b[0]) + '" y="44" width="' + (X(b[2]) - X(b[0])) + '" height="28" rx="6" fill="#e07a1f"/>' +
      '<rect x="' + X(b[2]) + '" y="52" width="' + Math.max(1, X(tDep) - X(b[2])) + '" height="12" fill="#9aa3b8"/>' +
      '<rect x="' + X(tDep) + '" y="44" width="' + (X(tArr) - X(tDep)) + '" height="28" rx="6" fill="#2a6fb0"/>' +
      '<rect x="' + X(tArr) + '" y="44" width="' + (X(there) - X(tArr)) + '" height="28" rx="6" fill="#19c39a"/>' +
      '<path d="M' + X(target) + ' 22V90" stroke="#e04848" stroke-width="3" stroke-dasharray="5 4"/>' +
      '<text x="' + X(target) + '" y="18" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="13" font-weight="700" fill="#c03030">be there</text>' +
      [["bus", "#e07a1f"], ["wait", "#9aa3b8"], ["train", "#2a6fb0"], ["walk", "#19c39a"]].map(function(c, k){ return '<rect x="' + (24 + k * 92) + '" y="114" width="14" height="14" rx="3" fill="' + c[1] + '"/><text x="' + (44 + k * 92) + '" y="126" font-family="Verdana,Arial,sans-serif" font-size="13" fill="#141a33">' + c[0] + '</text>'; }).join("") + '</svg>';
    fig.innerHTML = s;
    out.innerHTML = "Leave " + hm(b[0], twelve) + ", wait " + wait + " minutes at the station, arrive at " + dest + " at <b>" + hm(there, twelve) + "</b>. " +
      "Whole journey: <b>" + Math.floor(total / 60) + " h " + (total % 60) + " min</b>. " +
      (early >= 0 ? (early === 0 ? "Exactly on time. Brave." : early + " minutes to spare.") : "That is " + (-early) + " minutes late. Try an earlier one?");
    d.plans = (d.plans || 0) + 1;
    d.last = { leave: hm(b[0], twelve), arrive: hm(there, twelve), mins: total, onTime: early >= 0 };
    try{ api.save(); }catch(e){}
    if(!api.resolved()) api.done("done");
  }
  function go(){ draw(); try{ api.save(); }catch(e){} }
  draw();
}

function esc(t){ return String(t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n){ if(cur.trim()) out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }

(window.A2PACKS = window.A2PACKS || {})["plan-the-trip"] = {
  a2: true,
  id: "a2-plan-the-trip",
  title: "Plan the trip",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 25,
  line: "Hours and minutes, timetables and a budget: everything you need to get there on time.",
  blurb: "Planning a journey: changing minutes and hours, working out how long it takes, reading a timetable and costing the trip. Four short chunks, a journey planner to play with, and a trip card to make at the end.",
  note: "Planning a journey: times, timetables and costs. Four five minute chunks with a planner to try, and a trip card at the end. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Day trip", line: "Day trip: hours and minutes, a simple timetable, pounds and pence." },
    { id: "medium", name: "Weekender", line: "Weekender: the 24 hour clock, journey times and a trip budget." },
    { id: "spicy", name: "Globetrotter", line: "Globetrotter: decimal hours, connections, discounts and currency." }
  ],
  themes: {
    time: { name: "Time travel", w: { dest: "the time travel museum", start: "the museum tour" } },
    football: { name: "Football", w: { dest: "the stadium", start: "kick off" } },
    horror: { name: "Horror", w: { dest: "the haunted castle", start: "the ghost tour" } },
    fishing: { name: "Fishing", w: { dest: "the lake", start: "the fishing match" } },
    music: { name: "Music", w: { dest: "the theatre", start: "the show" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: START,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Hours and minutes", title: "60, not 100",
      fig: CLOCK,
      html: "<p>Time does not work in hundreds. There are <b>60 minutes in an hour</b>.</p>" +
        "<p>Minutes to hours: take away 60s. 140 minutes is 60 + 60 + 20, so <b>2 h 20 min</b>.</p>" +
        "<p>Hours to minutes: times by 60, then add the extra minutes. 2 h 15 min is 120 + 15 = <b>135 minutes</b>.</p>" +
        "<p>Timetables use the <b>24 hour clock</b>: 14:30 is 2:30 in the afternoon.</p>",
      lv: {
        mild: { html: "<p>There are <b>60 minutes in an hour</b>.</p><p>Half an hour is 30 minutes. A quarter of an hour is 15 minutes.</p><p>100 minutes is 60 + 40, so <b>1 hour 40 minutes</b>.</p>" },
        spicy: { fig: CLOCK_SPICY,
          html: "<p>There are 60 minutes in an hour, so <b>decimal hours are not minutes</b>. 1.5 hours is 1 hour and half of 60: <b>1 h 30 min</b>. 0.2 hours is 0.2 " + "&#215;" + " 60 = 12 minutes.</p>" +
            "<p>The trap: 1.20 hours is <b>not</b> 1 h 20 min. It is 1 h 12 min.</p>" +
            "<p>Minutes to decimal hours: divide by 60. 45 minutes is 45 " + "&#247;" + " 60 = 0.75 hours.</p>" } } },

    { type: "num", topic: "Hours and minutes",
      q: "A coach trip takes 140 minutes. How long is that in hours and minutes?",
      boxes: [{ label: "Hours", a: 2 }, { label: "Minutes", a: 20 }],
      slips: [[1, 40, "That treats an hour as 100 minutes. An hour is 60 minutes."], [0, 1, "Two lots of 60 fit into 140."]],
      hint: "60 + 60 = 120. How many minutes are left over?",
      why: "140 = 60 + 60 + 20, so <b>2 h 20 min</b>.",
      lv: {
        mild: { q: "A bus ride takes 100 minutes. How long is that in hours and minutes?",
          boxes: [{ label: "Hours", a: 1 }, { label: "Minutes", a: 40 }],
          slips: [[1, 0, "100 minutes is more than 1 hour. Take away 60 and see what is left."], [0, 10, "Not quite: an hour is 60 minutes, so 100 minutes is 1 hour and a bit."]],
          hint: "100 take away 60 is how many?",
          why: "100 = 60 + 40, so <b>1 h 40 min</b>." },
        spicy: { q: "A flight takes 1.75 hours. How long is that in hours and minutes?",
          boxes: [{ label: "Hours", a: 1 }, { label: "Minutes", a: 45 }],
          slips: [[1, 75, "0.75 of an hour is not 75 minutes. It is three quarters of 60."], [1, 7.5, "0.75 " + "&#215;" + " 60 is 45, not 7.5."]],
          hint: "0.75 is three quarters. What is three quarters of 60?",
          why: "0.75 " + "&#215;" + " 60 = 45, so <b>1 h 45 min</b>." } } },

    { type: "num", topic: "Hours and minutes",
      q: "The walk takes 2 hours 15 minutes. How many minutes is that?",
      boxes: [{ label: "Minutes", a: 135 }],
      slips: [[215, "Two hours is 120 minutes, not 200."], [75, "Two hours is two lots of 60."], [17, "This one is a times: 2 " + "&#215;" + " 60, then add 15."]],
      hint: "2 " + "&#215;" + " 60, then add 15.",
      why: "2 " + "&#215;" + " 60 = 120, and 120 + 15 = <b>135 minutes</b>.",
      lv: {
        mild: { q: "The walk takes 1 hour 20 minutes. How many minutes is that?",
          boxes: [{ label: "Minutes", a: 80 }],
          slips: [[120, "1 hour is 60 minutes, not 100."], [21, "1 hour is 60 minutes. Add the 20."]],
          hint: "60 + 20.",
          why: "60 + 20 = <b>80 minutes</b>." },
        spicy: { q: "A journey takes 2 h 45 min. Write it in hours, as a decimal.",
          boxes: [{ label: "Hours", a: 2.75 }],
          slips: [[2.45, "45 minutes is three quarters of an hour: 0.75, not 0.45."], [165, "That is in minutes. In hours, divide by 60."]],
          hint: "45 " + "&#247;" + " 60 = ?",
          why: "45 " + "&#247;" + " 60 = 0.75, so <b>2.75 hours</b>." } } },

    { type: "match", topic: "Hours and minutes",
      q: "Match the 24 hour times to the 12 hour times.",
      pairs: [["14:30", "2:30 pm"], ["09:15", "9:15 am"], ["21:45", "9:45 pm"], ["00:20", "12:20 am"]],
      hint: "For afternoon and evening, take 12 away from the hour.",
      why: "14 take away 12 is 2, so 14:30 is 2:30 pm. 21:45 is 9:45 pm. 00:20 is just after midnight.",
      lv: {
        mild: { q: "Match each one to the same amount of time.",
          pairs: [["Half an hour", "30 minutes"], ["A quarter of an hour", "15 minutes"], ["1 hour", "60 minutes"], ["Three quarters of an hour", "45 minutes"]],
          hint: "Think of a clock cut into quarters.",
          why: "A whole hour is 60 minutes, half is 30, a quarter is 15, three quarters is 45." },
        spicy: { q: "Match each decimal time to minutes.",
          pairs: [["0.5 hours", "30 minutes"], ["0.25 hours", "15 minutes"], ["0.1 hours", "6 minutes"], ["1.2 hours", "72 minutes"]],
          hint: "Times each one by 60.",
          why: "0.1 " + "&#215;" + " 60 = 6 and 1.2 " + "&#215;" + " 60 = 72. Not 10, not 120." } } },

    { type: "mc", topic: "Hours and minutes",
      q: "Which is the same as 1.5 hours?",
      options: ["1 hour 30 minutes", "1 hour 50 minutes", "150 minutes", "1 hour 5 minutes"],
      answer: 0,
      slips: { 1: "0.5 of an hour is half an hour, which is 30 minutes, not 50.", 2: "1.5 hours is 90 minutes. 150 treats an hour as 100 minutes.", 3: "0.5 is a half, not 5 minutes." },
      hint: "0.5 is a half. What is half an hour?",
      why: "1.5 hours is 1 hour and a half: <b>1 h 30 min</b>.",
      lv: {
        mild: { q: "How many minutes are in half an hour?", options: ["30", "50", "60"],
          slips: { 1: "An hour is 60 minutes, not 100, so half is 30.", 2: "60 minutes is a whole hour." },
          hint: "Half of 60.",
          why: "Half of 60 is <b>30</b>." },
        spicy: { q: "Which is the same as 1.2 hours?", options: ["1 hour 12 minutes", "1 hour 20 minutes", "1 hour 2 minutes", "120 minutes"],
          slips: { 1: "The classic trap. 0.2 of an hour is 0.2 " + "&#215;" + " 60 = 12 minutes.", 2: "0.2 " + "&#215;" + " 60 is 12, not 2.", 3: "1.2 " + "&#215;" + " 60 is 72 minutes, not 120." },
          hint: "0.2 " + "&#215;" + " 60 = ?",
          why: "0.2 " + "&#215;" + " 60 = 12, so <b>1 h 12 min</b>." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "How long does it take?", title: "Count on in hops",
      fig: hops(["10:45", "11:00", "12:00", "12:20"], ["15 min", "1 hour", "20 min"], "1 hour 35 minutes"),
      html: "<p>To find how long a journey takes, <b>count on in hops</b>: to the next o'clock, then whole hours, then the minutes left.</p>" +
        "<p>10:45 to 12:20: 15 minutes to 11:00, 1 hour to 12:00, then 20 minutes. Total <b>1 hour 35 minutes</b>.</p>" +
        "<p>Do not take away times like normal numbers: 1220 take away 1045 gives 175, but there is no such thing as 75 minutes past the hour.</p>",
      lv: {
        mild: { fig: hops(["9:40", "10:00", "10:15"], ["20 min", "15 min"], "35 minutes"),
          html: "<p>Count on in hops.</p><p>9:40 to 10:00 is <b>20 minutes</b>. 10:00 to 10:15 is <b>15 minutes</b>.</p><p>20 + 15 = <b>35 minutes</b>.</p>" },
        spicy: { fig: hops(["22:50", "23:00", "01:00", "01:15"], ["10 min", "2 hours", "15 min"], "2 hours 25 minutes"),
          html: "<p>Count on in hops: to the next o'clock, whole hours, then the minutes left. It works past midnight too.</p>" +
            "<p>22:50 to 01:15: 10 minutes to 23:00, 2 hours to 01:00, then 15 minutes. Total <b>2 h 25 min</b>.</p>" +
            "<p>Taking away like normal numbers fails here twice: once because of the 60 minutes, and again because the clock goes back to 00:00.</p>" } } },

    { type: "num", topic: "How long does it take?",
      q: "A coach leaves at 09:35 and arrives at 11:10. Fill in the hops.",
      fig: hops(["09:35", "10:00", "11:00", "11:10"], ["?", "?", "?"]),
      boxes: [{ label: "09:35 to 10:00", a: 25, post: "min" }, { label: "10:00 to 11:00", a: 60, post: "min", alts: [1] }, { label: "11:00 to 11:10", a: 10, post: "min" }, { label: "Total: hours", a: 1 }, { label: "and minutes", a: 35 }],
      slips: [[0, 35, "From 35 minutes past to the next o'clock is 25 minutes, not 35."], [4, 75, "That is 175 take away 100. Count the hops instead."]],
      hint: "From 09:35, how many minutes to 10:00?",
      why: "25 + 60 + 10 = 95 minutes, which is <b>1 h 35 min</b>.",
      lv: {
        mild: { q: "A bus leaves at 2:45 and arrives at 3:20. Fill in the hops.",
          fig: hops(["2:45", "3:00", "3:20"], ["?", "?"]),
          boxes: [{ label: "2:45 to 3:00", a: 15, post: "min" }, { label: "3:00 to 3:20", a: 20, post: "min" }, { label: "Total", a: 35, post: "min" }],
          slips: [[0, 55, "From 2:45 to 3:00 is a quarter of an hour, 15 minutes."], [2, 75, "That is 320 take away 245. Add the hops instead: 15 + 20."]],
          hint: "From 2:45, how many minutes to 3:00?",
          why: "15 + 20 = <b>35 minutes</b>." },
        spicy: { q: "A night bus leaves at 22:50 and arrives at 01:15. Fill in the hops.",
          fig: hops(["22:50", "23:00", "01:00", "01:15"], ["?", "?", "?"]),
          boxes: [{ label: "22:50 to 23:00", a: 10, post: "min" }, { label: "23:00 to 01:00", a: 2, post: "hours" }, { label: "01:00 to 01:15", a: 15, post: "min" }, { label: "Total: hours", a: 2 }, { label: "and minutes", a: 25 }],
          slips: [[1, 22, "23:00 to 01:00 goes through midnight: 23:00 to 00:00 is 1 hour, then 1 more."], [3, 21, "That is taking away backwards round the clock. Count the hops forwards."]],
          hint: "23:00 to midnight is 1 hour. Midnight to 01:00 is another.",
          why: "10 min + 2 hours + 15 min = <b>2 h 25 min</b>." } } },

    { type: "num", topic: "How long does it take?", explain: true,
      q: "A train leaves at 08:42 and arrives at 09:38. How long does it take?",
      boxes: [{ label: "Minutes", a: 56 }],
      slips: [[96, "That is 938 take away 842. Times do not work in hundreds. Count on: 18 minutes to 09:00, then 38 more."], [104, "Count on from 08:42: 18 minutes to 09:00, then 38 minutes to 09:38."]],
      hint: "08:42 to 09:00 is 18 minutes. Then add on to 09:38.",
      why: "18 + 38 = <b>56 minutes</b>.",
      lv: {
        mild: { q: "The bus leaves at 8:05 and gets to the station at 8:30. How many minutes?",
          boxes: [{ label: "Minutes", a: 25 }],
          slips: [[35, "Count on from 8:05: 5 minutes to 8:10, then 20 more to 8:30."], [30, "8:05 is 5 minutes past, not o'clock. Count from 8:05."]],
          hint: "8:05 to 8:30. Count on in fives.",
          why: "From 5 past to half past is <b>25 minutes</b>." },
        spicy: { q: "A flight leaves at 23:40 and lands at 02:05 (same time zone). How long is the flight?",
          boxes: [{ label: "Hours", a: 2 }, { label: "Minutes", a: 25 }],
          slips: [[0, 21, "Going past midnight: count on to 00:00, then on to 02:05."], [1, 65, "Count the hops: 20 minutes to midnight, 2 hours, then 5 minutes."]],
          hint: "23:40 to 00:00, then 00:00 to 02:00, then 5 more minutes.",
          why: "20 min + 2 hours + 5 min = <b>2 h 25 min</b>." } } },

    { type: "num", topic: "How long does it take?",
      q: "[[Start]] begins at 11:00. It is a 15 minute walk from the station. What is the latest time you can get off the train?",
      boxes: [{ label: "Hour", a: 10 }, { label: "Minutes", a: 45 }],
      slips: [[1, 85, "Count back 15 minutes from 11:00: it goes back into the 10 o'clock hour."], [0, 11, "Going back 15 minutes from 11:00 takes you before 11 o'clock."]],
      hint: "Count back 15 minutes from 11:00.",
      why: "15 minutes before 11:00 is <b>10:45</b>.",
      lv: {
        mild: { q: "[[Start]] begins at 4:00. It takes 20 minutes to walk there. What time should you leave?",
          boxes: [{ label: "Hour", a: 3 }, { label: "Minutes", a: 40 }],
          slips: [[1, 80, "Count back 20 minutes from 4:00 and you are in the 3 o'clock hour."], [1, 20, "That is 20 minutes past. Count back 20 minutes from 4:00."]],
          hint: "Count back 20 minutes from 4 o'clock.",
          why: "20 minutes before 4:00 is <b>3:40</b>." },
        spicy: { q: "[[Start]] begins at 19:30. The journey takes 1 h 50 min, and you want 15 minutes to find your seat. Latest time to leave home?",
          boxes: [{ label: "Hour", a: 17 }, { label: "Minutes", a: 25 }],
          slips: [[1, 15, "Total time needed is 2 h 5 min. Count back from 19:30."], [0, 18, "Count back 2 hours first: 17:30. Then 5 more minutes."]],
          hint: "Add the times: 1 h 50 min + 15 min = 2 h 5 min. Count back from 19:30.",
          why: "2 h 5 min before 19:30 is <b>17:25</b>." } } },

    { type: "mc", topic: "How long does it take?",
      q: "Jay says 10:45 to 12:20 is \"1 hour 75 minutes\". What happened?",
      fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay with a speech bubble">' + A2ART.jay(80, 52, 0.85, "hmm") +
        A2ART.bubble(150, 16, 240, 56, "1220 - 1045 = 175.\nSo 1 h 75 min?", 166) + '</svg>',
      options: ["He took away like normal numbers, but an hour is 60 minutes, not 100", "He added the times instead of taking away", "He read a different bus from the timetable"],
      answer: 0,
      slips: { 1: "1220 take away 1045 is 175: he did take away. The trouble is what 175 means.", 2: "The times are fine. Look at how he worked it out." },
      hint: "Can you have 75 minutes past the hour?",
      why: "Taking away in hundreds does not work for time. Count on in hops: 15 min + 1 hour + 20 min = 1 h 35 min.",
      lv: {
        mild: { q: "Jay says 9:50 to 10:10 is 60 minutes. How long is it really?",
          fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay with a speech bubble">' + A2ART.jay(80, 52, 0.85, "hmm") +
            A2ART.bubble(150, 16, 220, 56, "1010 - 950 = 60.\nSo 60 minutes?", 166) + '</svg>',
          options: ["20 minutes", "60 minutes", "40 minutes"],
          slips: { 1: "Count on: 9:50 to 10:00 is 10 minutes, then 10 more.", 2: "Count on from 9:50: 10 minutes to 10:00, then 10 more." },
          hint: "9:50 to 10:00, then 10:00 to 10:10.",
          why: "10 + 10 = <b>20 minutes</b>. Taking away like normal numbers does not work for time." },
        spicy: { q: "Jay says 23:40 to 01:10 is \"22 hours 30 minutes\". What happened?",
          fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay with a speech bubble">' + A2ART.jay(80, 52, 0.85, "hmm") +
            A2ART.bubble(150, 16, 240, 56, "23:40 to 01:10...\n22 h 30 min?", 166) + '</svg>',
          options: ["He counted backwards from 23:40 to 01:10. Forwards, it is only 1 h 30 min", "He forgot there are 60 minutes in an hour", "He is right: it is nearly a whole day"],
          slips: { 1: "His minutes are fine. Which way round the clock did he go?", 2: "From 23:40 to 01:10 the next night would be a day and a half. The next morning is much closer." },
          hint: "Count forwards: 20 minutes to midnight, then 1 h 10 min.",
          why: "Forwards: 20 min + 1 h 10 min = <b>1 h 30 min</b>. Unhand me, goblin: nobody is on that bus for 22 hours." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Read the timetable", title: "Read down a column",
      fig: TT24,
      html: "<p>Each <b>row</b> is a stop. Each <b>column</b> is one bus or train. To follow one journey, pick a column and <b>read down</b> it.</p>" +
        "<p>The bus that leaves Millbrook at 08:35 gets to the Town Centre at 08:47 and the Station at 09:00.</p>" +
        "<p>To arrive by a certain time, start at the <b>bottom</b>: find the last arrival that is early enough, then read <b>up</b> to see when it leaves.</p>",
      lv: { mild: { fig: TT12,
        html: "<p>Each <b>row</b> is a stop. Each <b>column</b> is one bus.</p><p>Pick a column and <b>read down</b>. The 8:35 bus from Millbrook gets to the Station at 9:00.</p>" } } },

    { type: "mc", topic: "Read the timetable",
      q: "You want to be at the Station by 09:15. What is the latest bus from Millbrook you can catch?",
      fig: TT24,
      options: ["08:05", "08:35", "09:05", "09:35"],
      answer: 1, fixed: true,
      slips: { 0: "That one works, but you would wait at the station for ages. Look for the latest one that still arrives by 09:15.", 2: "That one reaches the Station at 09:30. Too late.", 3: "That one reaches the Station at 10:00. Too late." },
      hint: "Look along the Station row for the last time before 09:15. Then read up.",
      why: "The Station row has 09:00, the last one before 09:15. Read up: it leaves Millbrook at <b>08:35</b>.",
      lv: { mild: { q: "You want to be at the Station by 9:15. What is the latest bus from Millbrook you can catch?", fig: TT12,
        options: ["8:05", "8:35", "9:05", "9:35"],
        slips: { 0: "That works, but you would wait a long time. Find the latest one that gets there by 9:15.", 2: "That one gets to the Station at 9:30. Too late.", 3: "That one gets to the Station at 10:00. Too late." },
        hint: "Look along the Station row for the last time before 9:15.",
        why: "The Station row says 9:00, then read up: <b>8:35</b>." } } },

    { type: "num", topic: "Read the timetable",
      q: "How long does the bus take from Millbrook to the Station?",
      fig: TT24,
      boxes: [{ label: "Minutes", a: 25 }],
      slips: [[12, "That is Millbrook to the Town Centre. Keep reading down to the Station."], [13, "That is the Town Centre to the Station. Start from Millbrook."], [65, "Count on: 08:05 to 08:30 is 25 minutes."]],
      hint: "Pick any column. Millbrook 08:05, Station 08:30.",
      why: "08:05 to 08:30 is <b>25 minutes</b>, and every bus takes the same.",
      lv: {
        mild: { q: "The 8:35 bus leaves Millbrook. What time does it get to the Town Centre?", fig: TT12,
          boxes: [{ label: "Hour", a: 8 }, { label: "Minutes", a: 47 }],
          slips: [[1, 17, "That is the 8:05 bus. Find the column that starts at 8:35."], [1, 0, "That is the Station. The Town Centre is the middle row."]],
          hint: "Find 8:35 in the Millbrook row, then go down one.",
          why: "Down one from 8:35: <b>8:47</b>." },
        spicy: { q: "You catch the 08:35 bus and then the first train you can. How long from leaving Millbrook to arriving in Kingsmere?",
          boxes: [{ label: "Hours", a: 1 }, { label: "Minutes", a: 33 }],
          slips: [[1, 21, "You cannot catch the 08:42 train: the bus only reaches the Station at 09:00. Take the 09:12."], [1, 25, "That leaves out the wait at the Station. Count from 08:35 to 10:08."]],
          hint: "Bus gets in at 09:00. Next train 09:12, arriving 10:08. Count on from 08:35.",
          why: "08:35 to 10:08: 25 min to 09:00, 1 hour to 10:00, 8 min. <b>1 h 33 min</b>, including a 12 minute wait." } } },

    { type: "num", topic: "Read the timetable",
      q: "The 08:35 bus reaches the Station at 09:00. The next train leaves at 09:12. How long is the wait?",
      fig: TT24,
      boxes: [{ label: "Minutes", a: 12 }],
      slips: [[42, "The 08:42 train has already gone by 09:00. Look at the 09:12 one."], [88, "That is 912 take away 824. Count on from 09:00 to 09:12."]],
      hint: "Count on from 09:00 to 09:12.",
      why: "09:00 to 09:12 is <b>12 minutes</b>. Time for a snack.",
      lv: {
        mild: { q: "Buses leave Millbrook at 8:05, 8:35 and 9:05. How long between each bus?", fig: TT12,
          boxes: [{ label: "Minutes", a: 30 }],
          slips: [[70, "Count on from 8:35 to 9:05: 25 minutes to 9:00, then 5."], [60, "That is two buses apart. From one bus to the next is half that."]],
          hint: "8:05 to 8:35. Half an hour?",
          why: "Every <b>30 minutes</b>: half an hour." },
        spicy: { q: "You must be at [[dest]] by 11:00. The walk from Kingsmere station is 15 minutes. What is the latest bus from Millbrook you can catch?",
          boxes: [{ label: "Hour", a: 9 }, { label: "Minutes", a: 5 }],
          slips: [[1, 35, "The 09:35 bus reaches the Station at 10:00. The 10:12 train gets in at 11:08, plus the walk: too late."], [1, 0, "Work backwards: arrive Kingsmere by 10:45, so the 09:42 train. Which bus gets you to the Station before 09:42?"]],
          hint: "Work backwards: Kingsmere by 10:45. Which train? Then which bus gets to the Station in time for it?",
          why: "The 09:42 train arrives 10:38, walk to 10:53. The bus that reaches the Station before 09:42 leaves Millbrook at <b>09:05</b>." } } },

    { type: "widget", topic: "Read the timetable", unscored: true,
      title: "Journey planner",
      html: "<p>Have a go at planning the whole journey from Millbrook to [[dest]]. Try a few combinations and see which gets you there in time with the shortest wait.</p>",
      mount: planner,
      report: function(d){ return d && d.last ? "Journey planner: tried " + (d.plans || 1) + " plans. Last one left at " + d.last.leave + " and arrived " + d.last.arrive + (d.last.onTime ? ", on time." : ", late.") : ""; } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Budget the trip", title: "What will it cost?",
      fig: FARES,
      html: "<p>Add up every part of the journey. A <b>return</b> ticket (there and back) is often cheaper than two singles: a train return is " + P + "12.60, but two singles are " + P + "16.80.</p>" +
        "<p>Then take the travel away from your <b>budget</b> to see what is left for food and fun.</p>" +
        "<p>Keep pounds and pence straight: 350p is " + P + "3.50, because 100p is " + P + "1.</p>",
      lv: {
        mild: { html: "<p>Add up the tickets.</p><p>100p is " + P + "1. So 350p is <b>" + P + "3.50</b>.</p><p>A bus return is " + P + "3.50. Two people need two tickets: " + P + "3.50 + " + P + "3.50 = <b>" + P + "7</b>.</p>" },
        spicy: { html: "<p>Add up every part, and look for savings. A <b>railcard</b> often takes <b>a third off</b> a train fare: " + P + "12.60 " + "&#247;" + " 3 = " + P + "4.20 off, so you pay " + P + "8.40.</p>" +
          "<p>Going abroad? Use the exchange rate. If " + P + "1 = 1.15 euros, then pounds to euros: <b>times by 1.15</b>. Euros to pounds: <b>divide by 1.15</b>.</p>" +
          "<p>Sense check: euros to pounds should give a slightly smaller number.</p>" } } },

    { type: "num", topic: "Budget the trip",
      q: "One person needs a bus return and a train return. Use the fares board. What is the total?",
      fig: FARES,
      boxes: [{ label: "Total", a: 16.1, pre: P }],
      slips: [[16.01, "Check the pence: 50p + 60p = 110p, which is " + P + "1.10."], [15.1, "Line up the pence: 3.50 + 12.60. The 50p and 60p make " + P + "1.10."], [10.4, "That is the two singles. The question asks for returns."]],
      hint: P + "3.50 + " + P + "12.60.",
      why: P + "3.50 + " + P + "12.60 = <b>" + P + "16.10</b>.",
      lv: {
        mild: { q: "A bus return is " + P + "3.50. How much for 2 people?",
          boxes: [{ label: "Total", a: 7, pre: P }],
          slips: [[6, "Do not forget the 50p each time: 50p + 50p is another pound."], [3.5, "That is for one person. Two people need two tickets."]],
          hint: P + "3.50 + " + P + "3.50.",
          why: P + "3 + " + P + "3 = " + P + "6, and 50p + 50p = " + P + "1. <b>" + P + "7</b>." },
        spicy: { q: "With a railcard, a third comes off the train fare. The train return is " + P + "12.60. What do you pay?",
          boxes: [{ label: "You pay", a: 8.4, pre: P }],
          slips: [[4.2, "That is the third you save. Take it away from " + P + "12.60."], [9.6, "A third of " + P + "12.60 is " + P + "4.20, not " + P + "3."], [12.27, "A third is not 33p. Divide " + P + "12.60 by 3."]],
          hint: "12.60 " + "&#247;" + " 3, then take that away.",
          why: P + "12.60 " + "&#247;" + " 3 = " + P + "4.20. " + P + "12.60 take away " + P + "4.20 = <b>" + P + "8.40</b>." } } },

    { type: "num", topic: "Budget the trip",
      q: "Your budget is " + P + "25. Travel is " + P + "16.10 and lunch at [[dest]] is " + P + "4.75. How much is left?",
      boxes: [{ label: "Left", a: 4.15, pre: P }],
      slips: [[5.15, "Check the pence: 16.10 + 4.75 = 20.85, and 25.00 take away 20.85 is 4.15."], [8.9, "That only takes off the travel. Take off lunch as well."], [20.85, "That is what you spend. Take it away from " + P + "25 to see what is left."]],
      hint: "Add up what you spend first, then take it away from " + P + "25.",
      why: P + "16.10 + " + P + "4.75 = " + P + "20.85. " + P + "25 take away " + P + "20.85 = <b>" + P + "4.15</b>.",
      lv: {
        mild: { q: "You have " + P + "10. The bus is " + P + "3.50 and a snack at [[dest]] is " + P + "2.50. How much is left?",
          boxes: [{ label: "Left", a: 4, pre: P }],
          slips: [[6, "That is what you spend. Take it away from " + P + "10."], [6.5, "That only takes off the bus. Take off the snack as well."]],
          hint: P + "3.50 + " + P + "2.50 first.",
          why: P + "3.50 + " + P + "2.50 = " + P + "6. " + P + "10 take away " + P + "6 = <b>" + P + "4</b>." },
        spicy: { q: "A trip abroad: " + P + "1 = 1.15 euros. A museum ticket costs 23 euros. How much is that in pounds?",
          boxes: [{ label: "In pounds", a: 20, pre: P }],
          slips: [[26.45, "That turned pounds into euros. Euros to pounds: divide by 1.15."], [21.85, "Divide by 1.15, do not take away 1.15."]],
          hint: "Euros to pounds: 23 " + "&#247;" + " 1.15.",
          why: "23 " + "&#247;" + " 1.15 = <b>" + P + "20</b>. Sense check: a bit smaller than 23. Yes." } } },

    { type: "mc", topic: "Budget the trip", explain: true,
      q: "You are going there and back by train. Which is cheaper?",
      fig: FARES,
      options: ["One return at " + P + "12.60", "Two singles", "They cost the same"],
      answer: 0,
      slips: { 1: "Two singles are 2 " + "&#215;" + " " + P + "8.40 = " + P + "16.80.", 2: "Work out two singles: 2 " + "&#215;" + " " + P + "8.40." },
      hint: "Two singles: 2 " + "&#215;" + " " + P + "8.40.",
      why: "Two singles cost " + P + "16.80, so the return saves " + P + "4.20.",
      lv: {
        mild: { q: "Which is the same as 350p?", fig: null, options: [P + "3.50", P + "35.00", P + "0.35"],
          slips: { 1: "That is 3500p. 100p is " + P + "1, so 350p is 3 pounds and 50p.", 2: "That is 35p." },
          hint: "100p = " + P + "1.",
          why: "300p is " + P + "3, plus 50p: <b>" + P + "3.50</b>." },
        spicy: { q: "4 friends going there and back by train. Which is cheapest?",
          options: ["4 returns, each with a third off", "A group ticket: " + P + "38 for all 4", "4 returns at full price", "8 singles at full price"],
          slips: { 1: "Close. But 4 " + "&#215;" + " " + P + "8.40 = " + P + "33.60, which beats " + P + "38.", 2: "4 " + "&#215;" + " " + P + "12.60 = " + P + "50.40.", 3: "8 " + "&#215;" + " " + P + "8.40 = " + P + "67.20." },
          hint: "Work each one out: 4 " + "&#215;" + " " + P + "8.40, " + P + "38, 4 " + "&#215;" + " " + P + "12.60, 8 " + "&#215;" + " " + P + "8.40.",
          why: "4 discounted returns: 4 " + "&#215;" + " " + P + "8.40 = <b>" + P + "33.60</b>, cheaper than the " + P + "38 group ticket." } } }
  ],

  realWorld: {
    title: "Planning gets you there",
    html: "<p>School trips, a first day at college, a job interview, a gig or a match: getting there on time means reading a timetable, counting on in hours and minutes, and knowing what it will cost. Apps help, but when a train is cancelled, being able to replan yourself is a superpower.</p>" +
      "<p>For our big question: if we could time travel, should we? Here is a real one from the past. Before the railways, towns across Britain set their own clocks by the sun, so Bristol ran about 10 minutes behind London. Train timetables were so confusing that in the 1840s the railways started using one shared time for the whole country. Timetables changed time itself.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A train coming out of a time portal">' + A2ART.portal(80, 75, 56) +
      '<g transform="translate(170 70)"><rect x="0" y="0" width="150" height="46" rx="12" fill="#2a6fb0" stroke="#141a33" stroke-width="2.5"/><rect x="14" y="10" width="26" height="16" fill="#fff"/><rect x="50" y="10" width="26" height="16" fill="#fff"/><rect x="86" y="10" width="26" height="16" fill="#fff"/>' +
      '<circle cx="30" cy="50" r="9" fill="#141a33"/><circle cx="120" cy="50" r="9" fill="#141a33"/></g>' +
      '<path d="M150 124H410" stroke="#7a5532" stroke-width="4"/>' + A2ART.bird(380, 34, 0.7, "#19c39a") + '</svg>'
  },

  make: {
    title: "Make a trip plan card",
    intro: "Plan a real trip you would like to do, or the one from today. Fill it in, then keep it or send it to Jay.",
    fields: [
      { id: "to", label: "Going to", ph: "Kingsmere for the day", max: 40 },
      { id: "leave", label: "Leave at", ph: "08:35", max: 12 },
      { id: "arrive", label: "Arrive by", ph: "10:23", max: 12 },
      { id: "how", label: "How I get there", ph: "Bus 7 to the Station, then the 09:12 train", max: 70 },
      { id: "cost", label: "Cost", ph: "16.10 pounds return", max: 24 },
      { id: "name", label: "Planner", ph: "Trip boss", max: 24 }
    ],
    svg: function(v){
      function tx(x, y, t, sz, w, c, a){ return '<text x="' + x + '" y="' + y + '" font-family="Verdana,Arial,sans-serif" font-size="' + sz + '"' + (w ? ' font-weight="700"' : "") + (a ? ' text-anchor="' + a + '"' : "") + ' fill="' + (c || "#141a33") + '">' + t + '</text>'; }
      var to = wrap(v.to, 20, 2), how = wrap(v.how, 36, 2), s = "";
      s += '<rect width="600" height="380" rx="24" fill="#fffdf6"/>' +
        '<rect x="0" y="0" width="600" height="70" rx="24" fill="#2a6fb0"/><rect x="0" y="40" width="600" height="30" fill="#2a6fb0"/>' +
        tx(30, 46, "TRIP PLAN", 26, 1, "#ffffff") + tx(570, 46, "B5 RAIL", 15, 1, "#ffd23f", "end") +
        '<circle cx="0" cy="210" r="18" fill="#2d2466"/><circle cx="600" cy="210" r="18" fill="#2d2466"/>' +
        '<path d="M22 210H578" stroke="#141a33" stroke-opacity=".25" stroke-width="2" stroke-dasharray="8 6"/>';
      s += tx(30, 102, "To", 14, 0, "#5b6180") + to.map(function(l, k){ return tx(30, 130 + k * 28, esc(l), 22, 1); }).join("");
      s += tx(400, 102, "Leave", 14, 0, "#5b6180") + tx(400, 132, esc(v.leave), 20, 1, "#e07a1f") +
        tx(400, 166, "Arrive", 14, 0, "#5b6180") + tx(400, 196, esc(v.arrive), 20, 1, "#1f7a54");
      s += tx(30, 244, "How", 14, 0, "#5b6180") + how.map(function(l, k){ return tx(30, 270 + k * 24, esc(l), 17, 1); }).join("");
      s += tx(30, 336, "Cost: " + esc(v.cost), 18, 1, "#2a6fb0") + tx(30, 362, "Planner: " + esc(v.name), 14, 0, "#5b6180");
      s += '<g transform="translate(500 320)"><rect x="-40" y="-26" width="80" height="44" rx="10" fill="#2a6fb0"/><rect x="-30" y="-18" width="16" height="14" fill="#fff"/><rect x="-8" y="-18" width="16" height="14" fill="#fff"/><rect x="14" y="-18" width="16" height="14" fill="#fff"/><circle cx="-24" cy="22" r="7" fill="#141a33"/><circle cx="24" cy="22" r="7" fill="#141a33"/></g>';
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380">' + s + '</svg>';
    }
  }
};
})();
