/* Base 5 Autumn 2 activity: Read the signs.
   Preparation for Adulthood. Symbols and icons on maps, signs and
   bus timetables, then a sign spotting challenge out and about.
   ASCII only. */
(function(){
var A = window.A2ART;
var FONT = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + (o.r ? ' transform="rotate(' + o.r + ' ' + x + ' ' + y + ')"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = [], out = [], cur = ""; String(t || "").split(/\s+/).forEach(function(x){ while(x.length > n){ w.push(x.slice(0, n)); x = x.slice(n); } w.push(x); }); w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }

/* ---------- icons, each about 44 wide, centred on 0 0 ---------- */
var IC = {
  bus: '<rect x="-22" y="-22" width="44" height="44" rx="9" fill="#1f6fb0"/>' +
    '<rect x="-14" y="-14" width="28" height="24" rx="5" fill="#fff"/><rect x="-10" y="-10" width="20" height="9" rx="2" fill="#1f6fb0"/>' +
    '<circle cx="-8" cy="5" r="2.5" fill="#1f6fb0"/><circle cx="8" cy="5" r="2.5" fill="#1f6fb0"/><rect x="-12" y="10" width="5" height="6" fill="#fff"/><rect x="7" y="10" width="5" height="6" fill="#fff"/>',
  train: '<rect x="-22" y="-22" width="44" height="44" rx="9" fill="#c8102e"/>' +
    '<rect x="-12" y="-15" width="24" height="26" rx="8" fill="#fff"/><rect x="-8" y="-11" width="16" height="9" rx="2" fill="#c8102e"/>' +
    '<circle cx="-6" cy="5" r="2.5" fill="#c8102e"/><circle cx="6" cy="5" r="2.5" fill="#c8102e"/><path d="M-9 12l-5 7M9 12l5 7" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
  hospital: '<rect x="-22" y="-22" width="44" height="44" rx="6" fill="#1f6fb0"/>' +
    '<path d="M-10 -13v26M10 -13v26M-10 0h20" stroke="#fff" stroke-width="6"/>',
  parking: '<rect x="-22" y="-22" width="44" height="44" rx="6" fill="#1f6fb0"/>' +
    '<path d="M-7 15v-28h9a8.5 8.5 0 0 1 0 17h-9" fill="none" stroke="#fff" stroke-width="6" stroke-linejoin="round"/>',
  info: '<circle r="22" fill="#19a37a"/><circle cx="0" cy="-11" r="4" fill="#fff"/><rect x="-3.5" y="-3" width="7" height="17" rx="2" fill="#fff"/>',
  toilets: '<rect x="-22" y="-22" width="44" height="44" rx="6" fill="#3d4a5c"/>' +
    '<circle cx="-9" cy="-11" r="4" fill="#fff"/><rect x="-13" y="-5" width="8" height="18" rx="2" fill="#fff"/>' +
    '<circle cx="9" cy="-11" r="4" fill="#fff"/><path d="M9 -6l-7 14h14z" fill="#fff"/><rect x="6" y="6" width="6" height="8" fill="#fff"/><path d="M0 -16v32" stroke="#fff" stroke-width="1.5"/>',
  cafe: '<circle r="22" fill="#8a5a36"/><path d="M-11 -4h18v8a9 9 0 0 1 -18 0z" fill="#fff"/><path d="M7 -1a5 5 0 0 1 0 9" fill="none" stroke="#fff" stroke-width="3"/>' +
    '<path d="M-6 -9q-3 -4 0 -8M0 -9q-3 -4 0 -8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
  park: '<circle cx="-7" cy="-4" r="13" fill="#2e9e4f"/><circle cx="8" cy="-8" r="12" fill="#3fb763"/><circle cx="4" cy="6" r="11" fill="#2e9e4f"/><rect x="-2" y="8" width="5" height="14" fill="#7a5532"/>',
  visit: '<rect x="-22" y="-22" width="44" height="44" rx="6" fill="#8a4b22"/>' +
    '<path d="M0 -14l4 9 10 1 -8 7 3 10 -9 -5 -9 5 3 -10 -8 -7 10 -1z" fill="#fff"/>'
};
function icon(k, x, y, s, attrs){ return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"' + (attrs || "") + '>' + IC[k] + '</g>'; }
var NAMES = { train: "Train station", bus: "Bus stop", hospital: "Hospital", parking: "Parking", info: "Information", park: "Park", visit: "Place to visit", toilets: "Toilets", cafe: "Cafe" };

var ICONS = '<svg viewBox="0 0 520 210" role="img" aria-label="Eight symbols: bus stop, train station, hospital, parking, information, toilets, cafe, place to visit">' +
  '<rect width="520" height="210" rx="16" fill="#f4f1ea"/>' +
  ["bus", "train", "hospital", "parking", "info", "toilets", "cafe", "visit"].map(function(k, n){
    var x = 70 + (n % 4) * 127, y = 52 + Math.floor(n / 4) * 96;
    return icon(k, x, y, 1.1) + T(x, y + 40, NAMES[k], 13, { a: "middle", b: 1 });
  }).join("") + '</svg>';

/* sign shapes for medium and spicy */
var SHAPES = '<svg viewBox="0 0 520 200" role="img" aria-label="Sign shapes: a red triangle warns, a red circle says do not, a blue circle says must do, a blue rectangle gives information, a brown sign shows a place to visit">' +
  '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  '<g transform="translate(62 82)"><path d="M0 -40l40 68h-80z" fill="#fff" stroke="#d2232a" stroke-width="8" stroke-linejoin="round"/><path d="M0 -14v20" stroke="#141a33" stroke-width="6" stroke-linecap="round"/><circle cx="0" cy="17" r="3.5" fill="#141a33"/></g>' +
  T(62, 142, "Warning", 14, { a: "middle", b: 1 }) + T(62, 162, "take care", 13, { a: "middle", c: "#5b6180" }) +
  '<g transform="translate(162 78)"><circle r="36" fill="#fff" stroke="#d2232a" stroke-width="9"/>' + T(0, 9, "20", 26, { a: "middle", b: 1 }) + '</g>' +
  T(162, 142, "Do not", 14, { a: "middle", b: 1 }) + T(162, 162, "or a limit", 13, { a: "middle", c: "#5b6180" }) +
  '<g transform="translate(262 78)"><circle r="36" fill="#1f6fb0"/><path d="M-16 8l16 -18 16 18" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M0 -8v28" stroke="#fff" stroke-width="7" stroke-linecap="round"/></g>' +
  T(262, 142, "Must do", 14, { a: "middle", b: 1 }) + T(262, 162, "an order", 13, { a: "middle", c: "#5b6180" }) +
  '<g transform="translate(362 78)"><rect x="-40" y="-28" width="80" height="56" rx="6" fill="#1f6fb0"/>' + T(0, 7, "Exit", 19, { a: "middle", b: 1, c: "#fff" }) + '</g>' +
  T(362, 142, "Information", 14, { a: "middle", b: 1 }) + T(362, 162, "helps you", 13, { a: "middle", c: "#5b6180" }) +
  '<g transform="translate(462 78)"><rect x="-40" y="-28" width="80" height="56" rx="6" fill="#8a4b22"/><path d="M0 -16l4 9 10 1 -8 7 3 10 -9 -5 -9 5 3 -10 -8 -7 10 -1z" fill="#fff"/></g>' +
  T(462, 142, "Place to visit", 14, { a: "middle", b: 1 }) + T(462, 162, "brown sign", 13, { a: "middle", c: "#5b6180" }) +
  '</svg>';

/* the town map. o.routes adds bus routes 7 and 12; o.tap adds data-k to symbols and hides the key */
var SPOTS = [["train", 70, 72], ["bus", 120, 186], ["bus", 292, 186], ["bus", 216, 262], ["hospital", 84, 250], ["parking", 300, 260], ["info", 226, 112], ["park", 300, 96], ["visit", 346, 196]];
function townMap(o){
  o = o || {};
  var s = '<svg viewBox="0 0 540 310" role="img" aria-label="A town map with a key: a railway, a train station, High Street, Park Road, bus stops, a hospital, parking, an information point, a park and a place to visit">' +
    '<rect width="540" height="310" rx="16" fill="#eef3e2"/>' +
    '<rect x="10" y="10" width="364" height="290" rx="10" fill="#e3edd0"/>' +
    '<ellipse cx="302" cy="96" rx="58" ry="30" fill="#bfe0a6"/>' +
    /* railway */
    '<path d="M10 40h364" stroke="#5b6180" stroke-width="5"/><path d="M10 40h364" stroke="#fff" stroke-width="2" stroke-dasharray="8 8"/>' +
    /* roads */
    '<rect x="10" y="138" width="364" height="26" fill="#fff" stroke="#c8ccd2" stroke-width="2"/>' +
    '<rect x="168" y="10" width="26" height="290" fill="#fff" stroke="#c8ccd2" stroke-width="2"/><rect x="169" y="139" width="24" height="24" fill="#fff"/>' +
    T(70, 152, "High Street", 13, { c: "#5b6180" }) + T(181, 220, "Park Road", 13, { c: "#5b6180", r: 90 }) +
    (o.routes ? '<path d="M10 159h336" stroke="#d2232a" stroke-width="4" stroke-dasharray="10 6"/><path d="M173 300v-276" stroke="#1f6fb0" stroke-width="4" stroke-dasharray="10 6"/>' +
      '<rect x="12" y="124" width="44" height="18" rx="4" fill="#d2232a"/>' + T(34, 138, "7", 13, { a: "middle", b: 1, c: "#fff" }) +
      '<rect x="200" y="282" width="44" height="18" rx="4" fill="#1f6fb0"/>' + T(222, 296, "12", 13, { a: "middle", b: 1, c: "#fff" }) : "") +
    SPOTS.map(function(p, n){ return icon(p[0], p[1], p[2], 0.62, o.tap ? ' data-k="' + p[0] + '" data-n="' + n + '" style="cursor:pointer"' : ""); }).join("") +
    T(346, 228, "[[Dest]]", 13, { a: "middle", b: 1 }) +
    A2ART.egg(A2ART.bird(330, 74, 0.5, "#ff5d5d"), "A bird in the park. Jay would spot this before the bus stop, every time.");
  if(o.tap){
    s += '<rect x="384" y="10" width="146" height="290" rx="10" fill="#fff" stroke="#141a33" stroke-opacity=".25" stroke-width="2"/>' +
      T(457, 40, "Key", 15, { a: "middle", b: 1 }) + T(457, 140, "Hidden!", 14, { a: "middle", b: 1, c: "#8a4b22" }) +
      T(457, 166, "Tap a symbol", 13, { a: "middle", c: "#5b6180" }) + T(457, 186, "on the map to", 13, { a: "middle", c: "#5b6180" }) + T(457, 206, "find out what", 13, { a: "middle", c: "#5b6180" }) + T(457, 226, "it is.", 13, { a: "middle", c: "#5b6180" });
  } else {
    var keys = ["train", "bus", "hospital", "parking", "info", "park", "visit"];
    s += '<rect x="384" y="10" width="146" height="290" rx="10" fill="#fff" stroke="#141a33" stroke-opacity=".25" stroke-width="2"/>' + T(457, 34, "Key", 15, { a: "middle", b: 1 }) +
      keys.map(function(k, n){ var y = 58 + n * 28; return icon(k, 402, y, 0.48) + T(420, y + 5, NAMES[k], 13); }).join("");
    if(o.routes) s += '<path d="M392 258h22" stroke="#d2232a" stroke-width="4" stroke-dasharray="7 4"/>' + T(420, 263, "Bus 7", 13) +
      '<path d="M392 284h22" stroke="#1f6fb0" stroke-width="4" stroke-dasharray="7 4"/>' + T(420, 289, "Bus 12", 13);
  }
  return s + '</svg>';
}

/* timetables */
var STOPS = ["Bus Station", "Market Square", "Library", "Park Road", "[[Dest]]"];
var TT = {
  mild: { head: "Bus 7", cols: [["9:00", "9:05", "9:12", "9:20", "9:30"], ["9:30", "9:35", "9:42", "9:50", "10:00"], ["10:00", "10:05", "10:12", "10:20", "10:30"]] },
  medium: { head: "Bus 7", cols: [["8:40", "8:46", "8:55", "9:04", "9:15"], ["9:10", "9:16", "9:25", "9:34", "9:45"], ["9:40", "9:46", "9:55", "10:04", "10:15"], ["10:25", "10:31", "10:40", "10:49", "11:00"]] },
  spicy: { head: "Bus 7, Monday to Friday", cols: [["13:05", "13:11", "13:20", "13:29", "13:40"], ["13:35", "13:41", "-", "-", "14:02"], ["14:05", "14:11", "14:20", "14:29", "14:40"], ["14:50", "14:56", "15:05", "15:14", "15:25"]], tags: ["", "Express", "", ""] }
};
function table(lv, hlCol, hlRow){
  var t = TT[lv], n = t.cols.length, cw = n > 3 ? 82 : 100, x0 = 186, rh = 34, top = 60, w = x0 + n * cw + 14, h = top + STOPS.length * rh + 18;
  var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="A bus timetable: stops down the side, one column for each bus">' +
    '<rect width="' + w + '" height="' + h + '" rx="14" fill="#fff8e1"/>' +
    '<rect x="10" y="10" width="' + (w - 20) + '" height="30" rx="8" fill="#d2232a"/>' + T(22, 31, t.head, 15, { b: 1, c: "#fff" });
  if(hlRow != null) s += '<rect x="12" y="' + (top + hlRow * rh) + '" width="' + (w - 24) + '" height="' + rh + '" fill="#ffd23f" fill-opacity=".55"/>';
  if(hlCol != null) s += '<rect x="' + (x0 + hlCol * cw + 4) + '" y="' + (top - 16) + '" width="' + (cw - 8) + '" height="' + (STOPS.length * rh + 22) + '" rx="8" fill="none" stroke="#1f6fb0" stroke-width="3.5"/>';
  if(t.tags) t.tags.forEach(function(g, c){ if(g) s += T(x0 + c * cw + cw / 2, top - 2, g, 13, { a: "middle", b: 1, c: "#d2232a" }); });
  STOPS.forEach(function(st, r){
    var y = top + r * rh + 23;
    s += '<path d="M14 ' + (top + r * rh) + 'h' + (w - 28) + '" stroke="#141a33" stroke-opacity=".12"/>' + T(22, y, st, 14, { b: 1 });
    t.cols.forEach(function(col, c){ s += T(x0 + c * cw + cw / 2, y, col[r], 15, { a: "middle", b: hlCol === c && hlRow === r ? 1 : 0 }); });
  });
  return s + '</svg>';
}

/* plan, travel, if you get stuck */
var PLAN = '<svg viewBox="0 0 520 200" role="img" aria-label="Three steps for a journey: plan it, look for signs on the way, ask for help at an information point">' +
  '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  [["Before", "Map and", "timetable", "#ffd23f"], ["On the way", "Look for", "the signs", "#22b8e6"], ["If you are stuck", "Find the i,", "ask staff", "#19c39a"]].map(function(c, k){
    var x = 20 + k * 168;
    return '<rect x="' + x + '" y="20" width="148" height="160" rx="14" fill="' + c[3] + '" fill-opacity=".3" stroke="#141a33" stroke-width="2.5"/>' +
      T(x + 74, 48, c[0], 14, { a: "middle", b: 1 }) +
      (k === 0 ? '<g transform="translate(' + (x + 74) + ' 92)"><rect x="-30" y="-22" width="60" height="44" rx="4" fill="#fff" stroke="#141a33" stroke-width="2"/><path d="M-30 -6h60M-30 8h60M-10 -22v44M10 -22v44" stroke="#141a33" stroke-opacity=".4"/></g>' :
       k === 1 ? icon("bus", x + 74, 92, 1) : icon("info", x + 74, 92, 1)) +
      T(x + 74, 142, c[1], 14, { a: "middle" }) + T(x + 74, 162, c[2], 14, { a: "middle" });
  }).join("") + '</svg>';

/* ---------- widgets ---------- */
function mapWidget(el, api){
  var d = api.data || {};
  if(!d.found || typeof d.found !== "object") d.found = {};
  el.innerHTML = '<div class="rsw-map" style="max-width:640px">' + api.tok(townMap({ tap: true })) + '</div>' +
    '<p class="rsw-out" style="font-weight:700;min-height:1.5em;margin:8px 0 2px" aria-live="polite"></p><p class="tiny rsw-count"></p>';
  var out = el.querySelector(".rsw-out"), count = el.querySelector(".rsw-count");
  function tally(){ var n = Object.keys(d.found).length; count.textContent = n ? "Found " + n + " of 7 kinds of symbol." + (n >= 7 ? " That is all of them. Brilliant." : "") : "Seven kinds of symbol to find, if you like."; }
  el.querySelector(".rsw-map").addEventListener("click", function(e){
    var g = e.target && e.target.closest ? e.target.closest("[data-k]") : null;
    if(!g) return;
    var k = g.getAttribute("data-k");
    d.found[k] = 1;
    out.textContent = "That is: " + NAMES[k] + ".";
    try{ api.save(); }catch(err){}
    tally();
    api.done("done");
  });
  tally();
}

var SPOT = ["A bus stop sign", "A timetable at a bus stop", "A P for parking", "An i for information", "A toilets sign", "A brown sign for a place to visit", "A map with a key", "A red triangle warning sign"];
function spotWidget(el, api){
  var d = api.data || {};
  if(!Array.isArray(d.ticks)) d.ticks = [];
  el.innerHTML = '<div class="a2task"><h4>Sign spotter challenge</h4><p>For next time you are out and about, away from the screen. Tick the signs you spot, whenever you like. Your ticks save here and can go to Jay if you choose.</p><div class="xlist"></div>' +
    '<label style="display:flex;flex-direction:column;gap:4px;margin-top:10px;font-weight:700">The best sign I spotted<input type="text" maxlength="60" class="rsw-best" style="font:inherit;font-weight:400;padding:8px 10px;border-radius:10px;border:2px solid #141a33"></label></div>';
  var list = el.querySelector(".xlist");
  SPOT.forEach(function(t, k){
    var lab = document.createElement("label");
    lab.style.cssText = "display:flex;gap:10px;align-items:center;margin:8px 0;font-size:1rem;cursor:pointer";
    var cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = !!d.ticks[k];
    cb.style.cssText = "width:22px;height:22px";
    cb.onchange = function(){ d.ticks[k] = cb.checked; try{ api.save(); }catch(err){} api.done("done"); };
    lab.appendChild(cb); lab.appendChild(document.createTextNode(t));
    list.appendChild(lab);
  });
  var best = el.querySelector(".rsw-best");
  best.value = d.best || "";
  best.oninput = function(){ d.best = best.value.slice(0, 60); try{ api.save(); }catch(err){} api.done("done"); };
}

(window.A2PACKS = window.A2PACKS || {})["read-the-signs"] = {
  a2: true,
  id: "a2-read-the-signs",
  title: "Read the signs",
  subject: "Preparation for Adulthood",
  bodyClass: "subj-home subj-pillar",
  mins: 25,
  line: "Symbols on signs and maps, and how to read a bus timetable, so you can find your way.",
  blurb: "Reading the little pictures that help you get about: signs, map keys and bus timetables. Four short chunks, then a sign spotter challenge to take out with you, and a journey card to make at the end.",
  note: "Signs, map symbols and bus timetables, ready for our travel sessions. Four five minute chunks, a sign spotter challenge for when you are out, and a journey card to make. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Hopper", line: "Hopper: the main symbols, a simple map and a short timetable." },
    { id: "medium", name: "Express", line: "Express: sign shapes and colours, and a timetable with trickier times." },
    { id: "spicy", name: "Night owl", line: "Night owl: bus routes on a map, the 24 hour clock, and buses that skip stops." }
  ],
  themes: {
    time: { name: "Time travel", w: { dest: "Museum", trip: "the time travel exhibition at the museum" } },
    football: { name: "Football", w: { dest: "Stadium", trip: "the match at the stadium" } },
    horror: { name: "Horror", w: { dest: "Old Manor", trip: "the ghost tour at the Old Manor" } },
    fishing: { name: "Fishing", w: { dest: "Lakeside", trip: "a day fishing at the lake" } },
    music: { name: "Music", w: { dest: "Theatre", trip: "the show at the theatre" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: ICONS,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Signs and symbols", title: "Symbols are tiny pictures that save words",
      fig: ICONS,
      html: "<p>A <b>symbol</b> is a small picture that means something. You do not have to read any words to understand it.</p>" +
        "<p>A <b>bus</b> means a bus stop. A big <b>P</b> means parking. An <b>i</b> means information: a place to ask for help. A <b>star on brown</b> means a place to visit.</p>",
      lv: {
        medium: { fig: SHAPES,
          html: "<p>A <b>symbol</b> is a small picture that means something, so you do not need to read any words.</p>" +
            "<p>On road and street signs, the <b>shape and colour</b> are a clue too. A <b>red triangle</b> warns you. A <b>red circle</b> says do not, or gives a limit. A <b>blue circle</b> tells you what you must do. A <b>blue rectangle</b> gives you information. A <b>brown</b> sign points to a place to visit.</p>" },
        spicy: { fig: SHAPES,
          html: "<p>Symbols let anyone understand a sign, whatever language they speak. That is why stations and airports use so many.</p>" +
            "<p>On road and street signs, the <b>shape and colour</b> carry meaning too. <b>Triangles</b> warn. <b>Circles</b> give orders: red ones say do not (or set a limit), blue ones say must. <b>Rectangles</b> inform. <b>Brown</b> ones point to places to visit, like a museum or a castle.</p>" +
            "<p>So before you even read a sign, its shape tells you whether it is warning you, telling you, or helping you.</p>" } } },

    { type: "mc", topic: "Signs and symbols",
      q: "What does this sign mean?",
      fig: '<svg viewBox="0 0 200 120" role="img" aria-label="A blue square sign with a white letter P">' + '<rect width="200" height="120" rx="14" fill="#f4f1ea"/>' + icon("parking", 100, 60, 1.8) + '</svg>',
      options: ["Parking", "Police", "Post office"],
      answer: 0,
      slips: { 1: "Good guess from the letter. But a white P on blue is the parking sign.", 2: "A P on blue is not the post office. It is where cars can park." },
      hint: "Where would a car stop and stay?",
      why: "A white P on a blue square means parking: a place to leave a car.",
      lv: { spicy: { q: "This sign is on a rectangle, not a circle. What does that tell you, and what does it mean?",
        options: ["It gives information: parking is here", "It is an order: you must park here", "It is a warning: parking is dangerous"],
        slips: { 1: "Orders come in circles. Rectangles give information.", 2: "Warnings are triangles. This is a rectangle." },
        hint: "Rectangles inform, circles order, triangles warn.",
        why: "It is a rectangle, so it informs you: there is parking here." } } },

    { type: "match", topic: "Signs and symbols",
      q: "Match each symbol to what it means.",
      pairs: [["A bus", "Bus stop"], ["A big H", "Hospital"], ["An i", "Information"], ["A cup", "Cafe"]],
      hint: "Look back at the picture of symbols if you like.",
      why: "Each symbol is a tiny picture of the thing, or its first letter.",
      lv: {
        medium: { pairs: [["A bus", "Bus stop"], ["A big H", "Hospital"], ["An i", "Information"], ["A cup", "Cafe"], ["A red triangle", "Warning"]] },
        spicy: { pairs: [["A red triangle", "Warning: take care"], ["A red circle with 20 in it", "Do not go faster than 20"], ["A blue circle with an arrow", "You must go this way"], ["A blue rectangle", "Information"], ["A brown sign with a star", "A place to visit"]],
          why: "Triangles warn, red circles limit or ban, blue circles order, rectangles inform, brown signs point to places to visit." } } },

    { type: "mc", topic: "Signs and symbols",
      q: "You are lost in a big station and want to ask for help. Which symbol do you look for?",
      fig: '<svg viewBox="0 0 420 130" role="img" aria-label="Three symbols, A, B and C">' + '<rect width="420" height="130" rx="14" fill="#f4f1ea"/>' +
        icon("info", 80, 56, 1.3) + T(80, 114, "A", 15, { a: "middle", b: 1 }) + icon("toilets", 210, 56, 1.3) + T(210, 114, "B", 15, { a: "middle", b: 1 }) + icon("cafe", 340, 56, 1.3) + T(340, 114, "C", 15, { a: "middle", b: 1 }) + '</svg>',
      options: ["A, the i for information", "B, the toilets", "C, the cafe"],
      answer: 0, fixed: true,
      slips: { 1: "That is the toilets sign. Useful, but not for asking the way.", 2: "That is a cafe. The staff might help, but it is not the place for directions." },
      hint: "Which letter stands for information?",
      why: "The i means information. Staff there can help you find your way.",
      lv: {
        medium: { q: "You see a <b>red triangle</b> sign by the bus station. What is it doing?",
          fig: SHAPES,
          options: ["Warning you to take care", "Telling you where the toilets are", "Telling you that you must turn left"],
          slips: { 1: "Toilets would be on an information sign, a rectangle.", 2: "Must do signs are blue circles." },
          hint: "Look at the shapes picture: what does a triangle do?",
          why: "Red triangles warn you to take care: maybe a crossing, or works on the road." },
        spicy: { q: "Which sign is giving you an <b>order</b>?",
          fig: SHAPES,
          options: ["The blue circle with an arrow", "The blue rectangle saying Exit", "The brown sign with a star"],
          slips: { 1: "Rectangles inform. It helps you, but it does not give an order.", 2: "Brown signs point to places to visit." },
          hint: "Orders come in circles.",
          why: "Circles give orders. A blue circle tells you what you must do, like which way to go." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Map keys", title: "A map uses symbols, and the key tells you what they mean",
      fig: townMap({}),
      html: "<p>Maps are too small for words everywhere, so they use <b>symbols</b>. The <b>key</b> is the box that tells you what each symbol means.</p>" +
        "<p>Find a symbol on the map, then find the same symbol in the key. On this map you can find the train station, the bus stops, and the way to the [[Dest]].</p>",
      lv: { spicy: { fig: townMap({ routes: true }),
        html: "<p>Maps use <b>symbols</b>, and the <b>key</b> tells you what each one means.</p>" +
          "<p>Lines can be symbols too. On this map, a <b>red dashed line</b> shows where Bus 7 goes, and a <b>blue dashed line</b> shows Bus 12. Bus stops sit on the routes. To plan a trip, find where you are, find where you want to be, and find a route that joins them.</p>" } } },

    { type: "widget", topic: "Map keys", unscored: true,
      title: "The key has gone missing",
      html: "<p>Tap any symbol on the map to find out what it is. There are seven kinds to find, if you fancy it.</p>",
      mount: mapWidget,
      report: function(d){ var n = d && d.found ? Object.keys(d.found).length : 0; return n ? "Map symbols found: " + n + " of 7." : ""; } },

    { type: "num", topic: "Map keys",
      q: "How many bus stops are on the map?",
      fig: townMap({}),
      boxes: [{ label: "Bus stops", a: 3 }],
      slips: [[1, "There are more. Look along both roads for the blue bus symbol."], [2, "Nearly. Have a look along Park Road too."], [4, "Count again: only the blue square with a bus in it."]],
      hint: "Find the bus symbol in the key, then hunt for it on the map.",
      why: "There are <b>3</b> bus stops: two on High Street and one on Park Road.",
      lv: { spicy: { q: "How many bus stops are on the route of <b>Bus 7</b>?",
        fig: townMap({ routes: true }),
        boxes: [{ label: "Bus 7 stops", a: 2 }],
        slips: [[3, "That is all the stops on the map. One of them is on Park Road, which is Bus 12."], [1, "Look along the whole red line, both sides of Park Road."]],
        hint: "Follow the red dashed line and count the bus stops beside it.",
        why: "Bus 7 runs along High Street, which has <b>2</b> stops. The third stop is on Park Road, on Bus 12." } } },

    { type: "mc", topic: "Map keys", explain: true,
      q: "What is on the corner of High Street and Park Road?",
      fig: townMap({}),
      options: ["An information point", "The hospital", "The train station"],
      answer: 0,
      slips: { 1: "The hospital is further down, near the bottom of the map.", 2: "The train station is at the top, by the railway line." },
      hint: "Find where the two roads cross. Which symbol is right next to it?",
      why: "The green i, the information point, is right by the corner.",
      lv: { spicy: { q: "You arrive at the train station and want to get to the [[Dest]]. Which bus should you look for?",
        fig: townMap({ routes: true }),
        options: ["Bus 7", "Bus 12"], fixed: true,
        slips: { 1: "Bus 12 goes up and down Park Road. The [[Dest]] is at the end of High Street." },
        hint: "Find the brown star. Which coloured line goes past it?",
        why: "The [[Dest]] is at the end of High Street, and the red Bus 7 route runs along High Street." } } },

    { type: "mc", topic: "Map keys",
      q: "You want to go to the [[Dest]]. Which road is it on?",
      fig: townMap({}),
      options: ["High Street", "Park Road"], answer: 0, fixed: true,
      slips: { 1: "Park Road goes up and down. Find the brown star: which road is it next to?" },
      hint: "Find the brown star symbol: place to visit.",
      why: "The brown star is at the end of High Street.",
      lv: { spicy: { q: "You get off Bus 7 at the stop nearest the [[Dest]]. What else is close by?",
        fig: townMap({ routes: true }),
        options: ["Parking", "The train station", "The hospital"],
        slips: { 1: "The station is right at the other end, by the railway.", 2: "The hospital is down on the left, near Park Road." },
        hint: "Find the stop on High Street near the brown star, then look around it.",
        why: "The parking sign is just below that stop, near the [[Dest]]." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Bus timetables", title: "Reading a timetable: find the stop, read down the column",
      fig: table("mild", 1, 2),
      html: "<p>A bus timetable has the <b>stops down the side</b> and <b>one column for each bus</b>.</p>" +
        "<p><b>Worked example:</b> when does the 9:30 bus get to the Library?</p>" +
        "<p>1. Find the bus: the column that starts with <b>9:30</b> at Bus Station (circled).<br>2. Find the stop: the <b>Library</b> row (yellow).<br>3. Where they meet is the time: <b>9:42</b>.</p>",
      lv: {
        medium: { fig: table("medium", 1, 2),
          html: "<p>A bus timetable has the <b>stops down the side</b> and <b>one column for each bus</b>.</p>" +
            "<p><b>Worked example:</b> when does the 9:10 bus get to the Library?</p>" +
            "<p>1. Find the bus: the column that starts with <b>9:10</b> (circled).<br>2. Find the stop: the <b>Library</b> row (yellow).<br>3. Where they meet: <b>9:25</b>.</p>" +
            "<p>To find how long a journey takes, count on from the first time to the second: 9:10 to 9:25 is 15 minutes.</p>" },
        spicy: { fig: table("spicy", 0, 2),
          html: "<p>Stops down the side, <b>one column per bus</b>. This one uses the <b>24 hour clock</b>: 13:05 is five past one in the afternoon.</p>" +
            "<p><b>Worked example:</b> the 13:05 bus reaches the Library at <b>13:20</b> (where the circled column meets the yellow row).</p>" +
            "<p>Watch for a <b>dash</b>: it means that bus does not stop there. The Express skips the Library and Park Road, so it is quicker.</p>" +
            "<p>Times work in 60s, not 100s. 13:35 to 14:02 is 25 minutes to 14:00, then 2 more: <b>27 minutes</b>.</p>" } } },

    { type: "mc", topic: "Bus timetables",
      q: "Your turn, with a head start. The 10:00 bus is the last column. Read down it to <b>Park Road</b>. What time does it get there?",
      fig: table("mild", 2, null),
      options: ["10:20", "10:12", "9:50", "10:30"],
      answer: 0,
      slips: { 1: "That is the Library row. Park Road is one row further down.", 2: "That is Park Road, but on the 9:30 bus. Stay in the 10:00 column.", 3: "That is the last stop, the [[Dest]]. Park Road is the row before." },
      hint: "Stay in the circled column and stop at the Park Road row.",
      why: "The 10:00 column meets the Park Road row at <b>10:20</b>.",
      lv: {
        medium: { q: "Your turn, with a head start. The 9:40 bus is circled. What time does it get to <b>Park Road</b>?",
          fig: table("medium", 2, null),
          options: ["10:04", "9:55", "9:34", "10:15"],
          slips: { 1: "That is the Library row. Park Road is one row down.", 2: "That is Park Road on the 9:10 bus. Stay in the circled column.", 3: "That is the [[Dest]], the last stop. Park Road is the row before." },
          why: "The 9:40 column meets the Park Road row at <b>10:04</b>." },
        spicy: { q: "Your turn, with a head start. The 14:05 bus is circled. What time does it get to <b>Park Road</b>?",
          fig: table("spicy", 2, null),
          options: ["14:29", "14:20", "13:29", "14:40"],
          slips: { 1: "That is the Library row. Park Road is one row down.", 2: "That is Park Road on the 13:05 bus. Stay in the circled column.", 3: "That is the [[Dest]]. Park Road is the row before." },
          why: "The 14:05 column meets the Park Road row at <b>14:29</b>, about half past two." } } },

    { type: "num", topic: "Bus timetables",
      q: "How many minutes does the 9:00 bus take to get from Bus Station to the [[Dest]]?",
      fig: table("mild"),
      boxes: [{ label: "Minutes", a: 30, post: "minutes" }],
      slips: [[5, "That is only as far as Market Square. Go all the way down to the [[Dest]]."], [930, "That is the time it arrives. How long is it from 9:00 to 9:30?"]],
      hint: "It leaves at 9:00. Find when it gets to the [[Dest]], then count the minutes between.",
      why: "9:00 to 9:30 is <b>30 minutes</b>.",
      lv: {
        medium: { q: "How many minutes does the 8:40 bus take to get from Bus Station to the [[Dest]]?",
          fig: table("medium"),
          boxes: [{ label: "Minutes", a: 35, post: "minutes" }],
          slips: [[75, "Looks like 915 take away 840. Times work in 60s: 8:40 to 9:00 is 20 minutes, then 15 more."], [25, "Count again: 8:40 to 9:00 is 20 minutes, then 9:00 to 9:15 is 15."]],
          hint: "Count up to the next hour first: 8:40 to 9:00, then on to 9:15.",
          why: "8:40 to 9:00 is 20 minutes, then 15 more to 9:15. That is <b>35 minutes</b>." },
        spicy: { q: "How many minutes does the 13:35 <b>Express</b> take from Bus Station to the [[Dest]]?",
          fig: table("spicy", 1, null),
          boxes: [{ label: "Minutes", a: 27, post: "minutes" }],
          slips: [[67, "Looks like 1402 take away 1335. Times work in 60s: 13:35 to 14:00 is 25 minutes, then 2 more."], [35, "That is the normal bus (13:05 to 13:40). The Express is the circled one."], [37, "Close. 13:35 to 14:00 is 25 minutes, not 35."]],
          hint: "Count up to 14:00 first, then add the extra minutes.",
          why: "13:35 to 14:00 is 25 minutes, then 2 more to 14:02. That is <b>27 minutes</b>." } } },

    { type: "mc", topic: "Bus timetables", explain: true,
      q: "You are off to [[trip]]. Which bus from Bus Station gets to the [[Dest]] at exactly 10:00?",
      fig: table("mild"),
      options: ["The 9:30 bus", "The 9:00 bus", "The 10:00 bus"],
      answer: 0,
      slips: { 1: "That one gets there at 9:30, half an hour early. Which column has 10:00 in the [[Dest]] row?", 2: "That one leaves at 10:00, so it gets there at 10:30. A bit late." },
      hint: "Look along the [[Dest]] row for 10:00, then go up to the top of that column.",
      why: "The 9:30 bus gets to the [[Dest]] at exactly 10:00.",
      lv: {
        medium: { q: "You need to be at the [[Dest]] by 10:30 for [[trip]]. What is the <b>latest</b> bus you can catch from Bus Station?",
          fig: table("medium"),
          options: ["The 9:40 bus", "The 10:25 bus", "The 9:10 bus", "The 8:40 bus"],
          slips: { 1: "That gets there at 11:00. Half an hour late.", 2: "That works, but it is not the latest. There is a later one that still makes it.", 3: "That works, but it is the earliest, not the latest." },
          hint: "Look along the [[Dest]] row for the last time before 10:30.",
          why: "The 9:40 bus arrives at 10:15. The next one arrives at 11:00, too late." },
        spicy: { q: "You need to be at the [[Dest]] by 14:30 for [[trip]]. What is the <b>latest</b> bus you can catch from Bus Station?",
          fig: table("spicy"),
          options: ["The 13:35 Express", "The 14:05 bus", "The 13:05 bus", "The 14:50 bus"],
          slips: { 1: "That arrives at 14:40, ten minutes late.", 2: "That works, but there is a later one that still arrives in time.", 3: "That arrives at 15:25. Far too late." },
          hint: "Look along the [[Dest]] row for the last time before 14:30.",
          why: "The 13:35 Express arrives at 14:02. The 14:05 arrives at 14:40, after 14:30." } } },

    { type: "mc", topic: "Bus timetables",
      q: "What does each <b>column</b> in a bus timetable show?",
      options: ["One bus, and when it gets to each stop", "One stop, and every bus in the day", "How much the ticket costs"],
      answer: 0,
      slips: { 1: "That is a row. The stops go down the side; each column is one bus.", 2: "Prices are usually somewhere else, not in the columns." },
      hint: "Read down a column. Does the time go up as you go?",
      why: "Each column follows one bus from the first stop to the last.",
      lv: { spicy: { q: "Your friend wants to get off at the <b>Library</b>. Can they catch the 13:35 Express?",
        fig: table("spicy", 1, 2),
        options: ["No, the dash means it does not stop there", "Yes, it gets there at 13:41", "Yes, but it is late"],
        slips: { 1: "13:41 is Market Square, one row up. The Library row has a dash.", 2: "A dash is not a late bus. It means the bus does not stop there." },
        hint: "Find the Library row in the Express column. What is there?",
        why: "There is a dash, so the Express does not stop at the Library. They need the 13:05 or the 14:05." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Out and about", title: "Before, during, and if you get stuck",
      fig: PLAN,
      html: "<p><b>Before:</b> look at the map and the timetable. Know your stop and your bus.</p>" +
        "<p><b>On the way:</b> look for the signs: bus stops, the i, and the name of your stop.</p>" +
        "<p><b>If you get stuck:</b> that is fine, it happens to everyone. Find the i, or ask someone in a uniform. Jay would probably start with \"When I was in China...\" and tell you a very long story about a train. The short version: everyone gets lost sometimes, and asking works.</p>",
      lv: { spicy: { html: "<p><b>Before:</b> check the map and the timetable, and have a backup bus in mind in case one is missed. Tell someone your plan.</p>" +
        "<p><b>On the way:</b> read the signs: departure boards, platform numbers, the i, the exit signs.</p>" +
        "<p><b>If plans change:</b> a cancelled bus is annoying, not a disaster. Check the timetable for the next one, or ask at the information point. Jay would probably start with \"When I was in China...\" and tell you a very long story about a train. The short version: everyone gets lost sometimes, and asking works.</p>" } } },

    { type: "mc", topic: "Out and about",
      q: "Your bus does not turn up. What is a good thing to do first?",
      options: ["Check the timetable for the next bus", "Walk home straight away without telling anyone", "Get on any bus that comes"],
      answer: 0,
      slips: { 1: "Better to stay where people expect you, and let someone know if plans change.", 2: "Any bus might go somewhere very different. Check the number first." },
      hint: "What does the timetable tell you?",
      why: "The timetable shows when the next bus is due, so you can wait or make a new plan." },

    { type: "widget", topic: "Out and about", unscored: true,
      title: "Take it with you",
      html: "<p>A sign spotter for the next trip out, with Jay or anyone. Use it on a phone or print it, whatever suits.</p>",
      mount: spotWidget,
      report: function(d){ var n = d && d.ticks ? d.ticks.filter(Boolean).length : 0; return (n ? "Sign spotter: " + n + " of " + SPOT.length + " spotted." : "") + (d && d.best ? " Best sign: " + d.best : ""); } },

    { type: "write", topic: "Out and about",
      q: "After a trip out, have a go at telling Jay about it, if you like. Where did you go, which signs did you spot, and did a map or timetable help?",
      starters: ["We went to", "I spotted", "The sign that helped most was", "Next time I would"],
      checklist: ["Where you went", "A sign you spotted", "Something that helped"],
      minWords: 20 }
  ],

  realWorld: {
    title: "Someone designs every sign you see",
    html: "<p>Sign and map designers choose symbols so that anyone can find their way, even someone who does not read the language. Bus drivers, station staff and delivery drivers read these signs all day.</p>" +
      "<p>For our big question: if we could time travel, should we? A traveller landing in 1850 would find no bus stops and no i signs. Would they be able to find their way? What signs would help?</p>",
    fig: '<svg viewBox="0 0 440 160" role="img" aria-label="Jay next to a time portal, with an information sign">' + '<rect width="440" height="160" rx="16" fill="#f4f1ea"/>' +
      A2ART.portal(80, 80, 58) + A2ART.jay(230, 52, 0.85, "hmm") + icon("info", 372, 50, 1) + A2ART.bubble(280, 92, 150, 50, "Is there an i\nin 1850?", 290) + '</svg>'
  },

  make: {
    title: "Make a journey card",
    intro: "A card for a real or made up trip: where from, where to, which bus, and a sign to look out for. Keep it in a pocket, or send it to Jay.",
    fields: [
      { id: "from", label: "From", ph: "Bus Station", max: 24 },
      { id: "to", label: "To", ph: "The museum", max: 24 },
      { id: "bus", label: "Bus or train", ph: "Bus 7", max: 16 },
      { id: "leave", label: "Leaves at", ph: "9:30", max: 10 },
      { id: "arrive", label: "Gets there at", ph: "10:00", max: 10 },
      { id: "look", label: "A sign to look out for", ph: "The brown sign with a star", max: 50 }
    ],
    svg: function(v){
      var look = wrap(v.look, 30, 2);
      function cell(x, y, label, val, size){ return T(x, y, label, 14, { b: 1, c: "#5b6180" }) + T(x, y + 32, esc(wrap(val, 14, 1)[0] || ""), size || 24, { b: 1 }); }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380">' +
        '<rect width="600" height="380" rx="24" fill="#fff8e1"/>' +
        '<rect x="0" y="0" width="600" height="70" rx="24" fill="#d2232a"/><rect x="0" y="40" width="600" height="30" fill="#d2232a"/>' +
        T(36, 48, "JOURNEY CARD", 26, { b: 1, c: "#fff" }) + T(564, 48, esc(wrap(v.bus, 12, 1)[0] || ""), 22, { b: 1, c: "#fff", a: "end" }) +
        cell(36, 112, "FROM", v.from, 22) + cell(320, 112, "TO", v.to, 22) +
        '<path d="M36 170h528" stroke="#141a33" stroke-opacity=".2" stroke-width="2" stroke-dasharray="8 6"/>' +
        cell(36, 202, "LEAVES", v.leave, 30) + cell(320, 202, "ARRIVES", v.arrive, 30) +
        '<path d="M36 260h528" stroke="#141a33" stroke-opacity=".2" stroke-width="2" stroke-dasharray="8 6"/>' +
        T(36, 292, "LOOK OUT FOR", 14, { b: 1, c: "#5b6180" }) +
        look.map(function(l, k){ return T(36, 320 + k * 26, esc(l), 20); }).join("") +
        '<g transform="translate(520 318)">' + IC.info + '</g>' +
        '<circle cx="0" cy="190" r="16" fill="#f4f1ea"/><circle cx="600" cy="190" r="16" fill="#f4f1ea"/>' +
        '</svg>';
    }
  }
};
})();
