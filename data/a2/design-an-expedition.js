/* Base 5 Autumn 2 activity: Design an expedition.
   Physical World. Route, timings, kit, weather and who to tell. ASCII only. */
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

/* ---------- the map: 8 by 5 squares ---------- */
var GX = 20, GY = 20, SQ = 46, COLS = 8, ROWS = 5;
function cx(c){ return GX + SQ / 2 + c * SQ; }
function cy(r){ return GY + SQ / 2 + r * SQ; }
var ROUTE = [[0, 4], [3, 4], [3, 2], [6, 2]];
function mapBase(hill){
  var w = COLS * SQ, h = ROWS * SQ, s = "";
  s += '<rect x="' + GX + '" y="' + GY + '" width="' + w + '" height="' + h + '" rx="10" fill="#e3f2d3" stroke="#141a33" stroke-width="2.5"/>';
  if(hill){
    s += '<ellipse cx="' + cx(6) + '" cy="' + cy(2) + '" rx="66" ry="52" fill="#d7e8b8" stroke="#a0784a" stroke-width="2"/>' +
      '<ellipse cx="' + cx(6) + '" cy="' + cy(2) + '" rx="44" ry="34" fill="#cfe0a8" stroke="#a0784a" stroke-width="2"/>' +
      '<ellipse cx="' + cx(6) + '" cy="' + cy(2) + '" rx="26" ry="18" fill="#c4d897" stroke="#a0784a" stroke-width="2"/>';
  }
  for(var c = 1; c < COLS; c++) s += '<path d="M' + (GX + c * SQ) + ' ' + GY + 'v' + h + '" stroke="#141a33" stroke-opacity=".12" stroke-width="1.5"/>';
  for(var r = 1; r < ROWS; r++) s += '<path d="M' + GX + ' ' + (GY + r * SQ) + 'h' + w + '" stroke="#141a33" stroke-opacity=".12" stroke-width="1.5"/>';
  /* woods */
  [[0.6, 0.6], [1.4, 0.5], [1.0, 1.3], [1.9, 1.0], [6.9, 4.1], [7.4, 3.5], [6.3, 4.4]].forEach(function(p){
    s += '<circle cx="' + (GX + p[0] * SQ) + '" cy="' + (GY + p[1] * SQ) + '" r="15" fill="#5fae5a" stroke="#2f7a3a" stroke-width="2"/>';
  });
  /* road with a crossing */
  s += '<rect x="' + (GX + 2 * SQ + 2) + '" y="' + GY + '" width="16" height="' + h + '" fill="#9aa0a6"/>' +
    '<path d="M' + (GX + 2 * SQ + 10) + ' ' + GY + 'v' + h + '" stroke="#fff" stroke-width="2" stroke-dasharray="8 8"/>';
  for(var k = 0; k < 4; k++) s += '<rect x="' + (GX + 2 * SQ + 2) + '" y="' + (cy(4) - 14 + k * 8) + '" width="16" height="4" fill="#fff"/>';
  /* river and bridge */
  s += '<path d="M' + (GX + 4.4 * SQ) + ' ' + GY + 'q30 57 -6 115q-30 58 10 115" fill="none" stroke="#5bb8e8" stroke-width="16" stroke-linecap="round"/>' +
    '<rect x="' + (GX + 4.4 * SQ - 26) + '" y="' + (cy(2) - 9) + '" width="40" height="18" rx="3" fill="#a0784a" stroke="#5a3b1c" stroke-width="2"/>';
  return s;
}
function marker(c, r, label, fill){
  return '<circle cx="' + cx(c) + '" cy="' + cy(r) + '" r="13" fill="' + fill + '" stroke="#141a33" stroke-width="2.5"/>' +
    T(cx(c), cy(r) + 5, label, 14, { b: 1, a: "middle", c: fill === "#141a33" ? "#fff" : "#141a33" });
}
function routePath(pts){
  return '<polyline points="' + pts.map(function(p){ return cx(p[0]) + "," + cy(p[1]); }).join(" ") + '" fill="none" stroke="#e04848" stroke-width="5" stroke-dasharray="10 6" stroke-linecap="round" stroke-linejoin="round"/>';
}
function mapFig(o){
  o = o || {};
  var scale = o.scale || "250 m";
  return '<svg viewBox="0 0 620 270" role="img" aria-label="A map with a walking route from the school gate to [[dest]]">' +
    '<rect width="620" height="270" rx="16" fill="#f4f1ea"/>' +
    mapBase(o.hill) + (o.route === false ? "" : routePath(ROUTE)) +
    marker(0, 4, "S", "#ffd23f") + (o.route === false ? "" : marker(3, 4, "1", "#fff") + marker(3, 2, "2", "#fff")) + marker(6, 2, "F", "#141a33") +
    A2ART.egg(A.bird(GX + 1.1 * SQ, GY + 0.95 * SQ, 0.55, "#ff5d5d"), "A robin in the woods. Jay says birds are the best part of any walk.") +
    T(410, 46, "Key", 15, { b: 1 }) +
    T(410, 74, "S  School gate", 13) +
    (o.route === false ? "" : T(410, 98, "1  [[Cp1]]", 13) + T(410, 122, "2  [[Cp2]]", 13)) +
    T(410, 146, "F  [[Dest]]", 13) +
    '<rect x="410" y="164" width="' + SQ + '" height="10" fill="#141a33"/>' + T(462, 174, "1 square = " + scale, 13) +
    T(410, 204, "Road and crossing", 13, { c: "#5b6180" }) + T(410, 226, "River and bridge", 13, { c: "#5b6180" }) +
    (o.hill ? T(410, 248, "Hill: 200 m climb", 13, { c: "#7a5532", b: 1 }) : "") +
    '</svg>';
}

/* a clock face with a shaded slice of minutes */
function clockFig(mins, label){
  var a = mins / 60 * 2 * Math.PI, r = 58, x = 90 + r * Math.sin(a), y = 90 - r * Math.cos(a);
  var big = mins > 30 ? 1 : 0;
  return '<g>' + '<circle cx="90" cy="90" r="64" fill="#fff" stroke="#141a33" stroke-width="3"/>' +
    (mins >= 60 ? '<circle cx="90" cy="90" r="' + r + '" fill="#ffd23f" fill-opacity=".7"/>' :
      '<path d="M90 90V' + (90 - r) + 'A' + r + ' ' + r + ' 0 ' + big + ' 1 ' + x.toFixed(1) + ' ' + y.toFixed(1) + 'z" fill="#ffd23f" fill-opacity=".7"/>') +
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function(k){ var t = k / 12 * 2 * Math.PI; return '<path d="M' + (90 + 56 * Math.sin(t)).toFixed(1) + ' ' + (90 - 56 * Math.cos(t)).toFixed(1) + 'L' + (90 + 62 * Math.sin(t)).toFixed(1) + ' ' + (90 - 62 * Math.cos(t)).toFixed(1) + '" stroke="#141a33" stroke-width="2"/>'; }).join("") +
    T(90, 180, label, 15, { b: 1, a: "middle" }) + '</g>';
}
function feet(x, y){
  return '<g transform="translate(' + x + ' ' + y + ')"><ellipse cx="0" cy="0" rx="6" ry="10" fill="#141a33"/><ellipse cx="14" cy="-12" rx="6" ry="10" fill="#141a33"/></g>';
}
var PACE = '<svg viewBox="0 0 520 200" role="img" aria-label="One kilometre of walking takes about fifteen minutes">' +
  '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  '<g transform="translate(10 0)">' + clockFig(15, "15 minutes") + '</g>' +
  T(205, 96, "=", 40, { b: 1 }) +
  feet(260, 110) + feet(300, 100) + feet(340, 110) + feet(380, 100) + feet(420, 110) +
  '<path d="M250 140h220" stroke="#141a33" stroke-width="3"/><path d="M250 132v16M470 132v16" stroke="#141a33" stroke-width="3"/>' +
  T(360, 172, "about 1 km of walking", 15, { b: 1, a: "middle" }) + '</svg>';
var PACE_SPICY = '<svg viewBox="0 0 520 200" role="img" aria-label="Twelve minutes for each kilometre, plus ten minutes for each 100 metres of climbing">' +
  '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  '<g transform="translate(0 0)">' + clockFig(12, "12 min per km") + '</g>' +
  T(190, 96, "+", 40, { b: 1 }) +
  '<path d="M240 160L330 70L420 160z" fill="#cfe0a8" stroke="#7a5532" stroke-width="3"/>' +
  '<path d="M330 70v90" stroke="#7a5532" stroke-width="2" stroke-dasharray="5 4"/>' + T(322, 150, "100 m up", 14, { b: 1, a: "end" }) +
  T(330, 188, "10 extra minutes", 15, { b: 1, a: "middle" }) + '</svg>';

/* kit: a rucksack with what goes in */
var KIT = '<svg viewBox="0 0 520 220" role="img" aria-label="A rucksack with water, a snack, a waterproof, a warm layer, a charged phone, a map and a first aid kit">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  '<rect x="30" y="50" width="110" height="140" rx="26" fill="#2f6f8f" stroke="#141a33" stroke-width="3"/>' +
  '<rect x="48" y="110" width="74" height="50" rx="10" fill="#3f86aa" stroke="#141a33" stroke-width="2.5"/>' +
  '<path d="M55 50q30 -36 60 0" fill="none" stroke="#141a33" stroke-width="5"/>' +
  [["Water", '<rect x="-8" y="-20" width="16" height="34" rx="5" fill="#5bb8e8" stroke="#141a33" stroke-width="2"/>'],
   ["Snack", '<rect x="-16" y="-10" width="32" height="20" rx="4" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>'],
   ["Waterproof", '<path d="M-16 14v-20l8 -8h16l8 8v20z" fill="#ff8a3d" stroke="#141a33" stroke-width="2"/>'],
   ["Warm layer", '<path d="M-16 14v-20l8 -8h16l8 8v20z" fill="#8a5cf6" stroke="#141a33" stroke-width="2"/>'],
   ["Phone", '<rect x="-9" y="-16" width="18" height="32" rx="4" fill="#141a33"/><rect x="-6" y="-12" width="12" height="20" fill="#19c39a"/>'],
   ["Map", '<path d="M-18 -12l12 -4 12 4 12 -4v26l-12 4 -12 -4 -12 4z" fill="#fff" stroke="#141a33" stroke-width="2"/>'],
   ["First aid", '<rect x="-15" y="-12" width="30" height="24" rx="4" fill="#fff" stroke="#e04848" stroke-width="2.5"/><path d="M0 -6v12M-6 0h12" stroke="#e04848" stroke-width="3"/>']
  ].map(function(it, k){
    var col = k % 4, row = Math.floor(k / 4), x = 200 + col * 85, y = 72 + row * 90;
    return '<g transform="translate(' + x + ' ' + y + ')">' + it[1] + '</g>' + T(x, y + 42, it[0], 13, { a: "middle", b: 1 });
  }).join("") + '</svg>';

/* a forecast strip */
function sym(kind){
  if(kind === "sun") return '<circle r="16" fill="#ffd23f" stroke="#e0a800" stroke-width="2"/>' + [0, 1, 2, 3, 4, 5, 6, 7].map(function(k){ var t = k / 8 * 2 * Math.PI; return '<path d="M' + (21 * Math.cos(t)).toFixed(1) + ' ' + (21 * Math.sin(t)).toFixed(1) + 'L' + (28 * Math.cos(t)).toFixed(1) + ' ' + (28 * Math.sin(t)).toFixed(1) + '" stroke="#e0a800" stroke-width="3" stroke-linecap="round"/>'; }).join("");
  var cloud = '<path d="M-22 10a12 12 0 0 1 2 -22a16 16 0 0 1 30 -2a12 12 0 0 1 12 24z" fill="#cfd6e0" stroke="#5b6180" stroke-width="2"/>';
  if(kind === "cloud") return cloud;
  if(kind === "rain") return cloud + '<path d="M-12 18l-4 10M0 18l-4 10M12 18l-4 10" stroke="#3a8fd6" stroke-width="3" stroke-linecap="round"/>';
  if(kind === "wind") return '<path d="M-24 -8h30q10 0 10 -8M-24 2h40q10 0 10 8M-24 12h22" fill="none" stroke="#5b6180" stroke-width="3.5" stroke-linecap="round"/>';
  return "";
}
function forecast(slots){
  return '<svg viewBox="0 0 520 190" role="img" aria-label="A weather forecast for the day">' +
    '<rect width="520" height="190" rx="16" fill="#e8f4fb"/>' + T(20, 30, "Forecast", 16, { b: 1 }) +
    slots.map(function(s, k){
      var x = 75 + k * 125;
      return '<rect x="' + (x - 52) + '" y="42" width="104" height="134" rx="12" fill="#fff" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
        T(x, 64, s[0], 14, { b: 1, a: "middle" }) + '<g transform="translate(' + x + ' 104)">' + sym(s[1]) + '</g>' +
        T(x, 150, s[2], 15, { b: 1, a: "middle" }) + T(x, 168, s[3] || "", 13, { a: "middle", c: "#5b6180" });
    }).join("") + '</svg>';
}
var FC_MILD = forecast([["9am", "sun", "12 C", "light wind"], ["12pm", "cloud", "13 C", "light wind"], ["3pm", "rain", "11 C", "rain"], ["6pm", "rain", "9 C", "rain"]]);
var FC_SPICY = forecast([["9am", "rain", "6 C", "gusts 50 mph"], ["12pm", "wind", "5 C", "gusts 55 mph"], ["3pm", "rain", "5 C", "gusts 50 mph"], ["6pm", "wind", "4 C", "gusts 45 mph"]]);

/* a route card, left with someone at home or school */
var CARD = '<svg viewBox="0 0 520 220" role="img" aria-label="Jay holding a route card that says where, who with, and back by">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  A.jay(86, 96, 1, "smile") +
  '<g transform="rotate(-3 330 110)"><rect x="200" y="28" width="280" height="168" rx="10" fill="#fffbe0" stroke="#141a33" stroke-width="2.5"/>' +
  '<rect x="200" y="28" width="280" height="34" rx="10" fill="#19c39a"/>' + T(216, 52, "ROUTE CARD", 16, { b: 1 }) +
  T(216, 88, "Where: [[Dest]]", 14) + T(216, 114, "Who with: [[Group]]", 14) + T(216, 140, "Back by: 11:00", 14) + T(216, 166, "If late: call school", 14) +
  '</g></svg>';

/* the route drawing widget */
function routeWidget(el, api){
  var d = api.data || {};
  if(!Array.isArray(d.route)) d.route = [];
  var per = api.level === "spicy" ? 500 : 250, perKm = api.level === "spicy" ? 12 : 15;
  el.innerHTML = '<div class="xmap" style="max-width:640px"></div>' +
    '<p class="xout" aria-live="polite" style="font-weight:700;margin:8px 0"></p>' +
    '<div class="qnav"><button type="button" class="btn btn-quiet xundo">Undo</button><button type="button" class="btn btn-quiet xclear">Start again</button></div>';
  var host = el.querySelector(".xmap"), out = el.querySelector(".xout");
  function draw(){
    var cells = "";
    for(var r = 0; r < ROWS; r++) for(var c = 0; c < COLS; c++)
      cells += '<rect data-c="' + c + '" data-r="' + r + '" x="' + (GX + c * SQ) + '" y="' + (GY + r * SQ) + '" width="' + SQ + '" height="' + SQ + '" fill="#ffffff" fill-opacity="0" style="cursor:pointer"/>';
    var pts = d.route;
    host.innerHTML = '<svg viewBox="0 0 620 270" role="img" aria-label="A map to draw your own route on">' +
      '<rect width="620" height="270" rx="16" fill="#f4f1ea"/>' + mapBase(false) +
      (pts.length > 1 ? routePath(pts) : "") +
      pts.map(function(p, k){ return '<circle cx="' + cx(p[0]) + '" cy="' + cy(p[1]) + '" r="' + (k === 0 ? 9 : 5) + '" fill="' + (k === 0 ? "#ffd23f" : "#e04848") + '" stroke="#141a33" stroke-width="2"/>'; }).join("") +
      cells +
      T(410, 46, "Tap squares", 15, { b: 1 }) + T(410, 70, "to draw a route.", 13) + T(410, 94, "Tap the last one", 13) + T(410, 114, "again to undo it.", 13) +
      '<rect x="410" y="140" width="' + SQ + '" height="10" fill="#141a33"/>' + T(462, 150, "= " + per + " m", 13) +
      '</svg>';
    var n = Math.max(0, pts.length - 1), m = n * per, mins = Math.round(m / 1000 * perKm);
    out.textContent = pts.length < 2 ? "Tap a square to start, then tap more squares to walk your route." :
      "Your route: " + n + " square" + (n === 1 ? "" : "s") + ", " + m + " m (" + (m / 1000) + " km). Walking time about " + mins + " minutes.";
  }
  function add(c, r){
    var pts = d.route, last = pts[pts.length - 1];
    if(last && last[0] === c && last[1] === r){ pts.pop(); return; }
    if(!last){ pts.push([c, r]); return; }
    var x = last[0], y = last[1], guard = 0;
    while((x !== c || y !== r) && guard++ < 20){
      if(x !== c) x += c > x ? 1 : -1; else y += r > y ? 1 : -1;
      pts.push([x, y]);
    }
  }
  host.addEventListener("click", function(e){
    var t = e.target;
    if(!t || !t.getAttribute || t.getAttribute("data-c") == null) return;
    add(+t.getAttribute("data-c"), +t.getAttribute("data-r"));
    try{ api.save(); }catch(err){}
    draw();
    if(d.route.length > 2) api.done("done");
  });
  el.querySelector(".xundo").onclick = function(){ d.route.pop(); try{ api.save(); }catch(err){} draw(); };
  el.querySelector(".xclear").onclick = function(){ d.route.length = 0; try{ api.save(); }catch(err){} draw(); };
  draw();
}

/* a before you go checklist, to use for real */
var GO_LIST = ["Pick somewhere local to walk to", "Look at a map and plan the route", "Work out how long it will take", "Check the forecast", "Pack the kit", "Fill in a route card", "Tell someone where you are going and when you will be back", "Go, and enjoy it"];
function checkWidget(el, api){
  var d = api.data || {};
  if(!Array.isArray(d.ticks)) d.ticks = [];
  el.innerHTML = '<div class="a2task"><h4>Expedition challenge</h4><p>Away from the screen, whenever you are ready. Tick things off as you go, if you like. Your ticks are saved here and can go to Jay with your results.</p><div class="xlist"></div></div>';
  var list = el.querySelector(".xlist");
  GO_LIST.forEach(function(t, k){
    var lab = document.createElement("label");
    lab.style.cssText = "display:flex;gap:10px;align-items:center;margin:8px 0;font-size:1rem;cursor:pointer";
    var cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = !!d.ticks[k];
    cb.style.cssText = "width:22px;height:22px";
    cb.onchange = function(){ d.ticks[k] = cb.checked; try{ api.save(); }catch(err){} api.done("done"); };
    lab.appendChild(cb); lab.appendChild(document.createTextNode(t));
    list.appendChild(lab);
  });
}

(window.A2PACKS = window.A2PACKS || {})["design-an-expedition"] = {
  a2: true,
  id: "a2-design-an-expedition",
  title: "Design an expedition",
  subject: "Physical World",
  bodyClass: "subj-home subj-pillar",
  mins: 25,
  line: "Where you are going, how long it takes, what to pack, and who knows.",
  blurb: "Planning a local expedition, one piece at a time: the route, the timings, the kit and weather, and staying safe. Four short chunks, a route card to make, and a challenge to try for real if you fancy it.",
  note: "Planning a local expedition: route, timings, kit, weather and who to tell. Four five minute chunks, a route card to make, and a real walk if you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Ramble", line: "Ramble: count the squares, simple times, the key bits of kit." },
    { id: "medium", name: "Trek", line: "Trek: distances in metres, timings with stops, weather decisions." },
    { id: "spicy", name: "Summit", line: "Summit: hills, the timing rule walkers use, and plan B calls." }
  ],
  themes: {
    time: { name: "Time travel", w: { dest: "the castle ruins", cp1: "the market cross", cp2: "the old windmill", silly: "a suit of armour", group: "your crew" } },
    football: { name: "Football", w: { dest: "the football ground", cp1: "the corner shop", cp2: "the training pitches", silly: "the trophy cabinet", group: "your squad" } },
    horror: { name: "Horror", w: { dest: "the old lighthouse", cp1: "the crooked lamp post", cp2: "the graveyard gate", silly: "a coffin", group: "your night shift crew" } },
    fishing: { name: "Fishing", w: { dest: "the lake", cp1: "the tackle shop", cp2: "the old boat house", silly: "a whole rowing boat", group: "your fishing buddies" } },
    music: { name: "Music", w: { dest: "the open air theatre", cp1: "the bandstand", cp2: "the stage door cafe", silly: "a grand piano", group: "your cast" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: mapFig(),
  steps: [

    /* ---------- chunk 1: the route ---------- */
    { type: "learn", topic: "Plan the route", title: "An expedition is a journey with a plan",
      fig: mapFig(),
      html: "<p>An expedition is a journey you plan before you set off. Today: a walk from the school gate to [[dest]].</p>" +
        "<p>A route has a <b>start</b> (S), some <b>checkpoints</b> on the way (1 and 2), and a <b>finish</b> (F). Checkpoints help you know you are on track.</p>" +
        "<p>The map has a <b>scale</b>: each square is 250 metres of real ground. Four squares make 1 km.</p>",
      ez: { title: "Plan a journey", html: "<p>Walk from <b>S</b> to <b>1</b>, then <b>2</b>, then <b>F</b>.</p><p>F is [[dest]]. Count the squares!</p>" },
      lv: { mild: { html: "<p>An expedition is a journey you plan before you set off. Today: a walk from the school gate to [[dest]].</p>" +
          "<p>The red line is the <b>route</b>. It goes from <b>S</b> (start) to <b>1</b>, then <b>2</b>, then <b>F</b> (finish).</p>" +
          "<p>You can count the squares to see how far it is.</p>" },
        spicy: { fig: mapFig({ scale: "500 m", hill: true }),
          html: "<p>An expedition is a journey you plan before you set off: a route, timings, kit, and a way for people to know where you are.</p>" +
          "<p>This route runs from <b>S</b> through checkpoints <b>1</b> and <b>2</b> to <b>F</b>, [[dest]]. On this map each square is <b>500 m</b>, so two squares make 1 km.</p>" +
          "<p>The rings round F are <b>contour lines</b>: they show a hill. The closer the rings, the steeper it is. Hills take longer, so the plan has to allow for them.</p>" } } },

    { type: "mc", topic: "Plan the route",
      q: "On the map, what is checkpoint 2?",
      fig: mapFig(),
      options: ["[[Cp2]]", "[[Dest]]", "The school gate"],
      answer: 0,
      slips: { 1: "[[Dest]] is F, the finish. Look at the key for number 2.", 2: "The school gate is S, the start. Look at the key for number 2." },
      hint: "Find the circle with a 2 in it, then look it up in the key.",
      why: "Checkpoint 2 is [[cp2]]. When you reach it, you know you are more than halfway.",
      ez: { q: "On the map, what is checkpoint 2?", hint: "Find the 2. Look at the key.", why: "Checkpoint 2 is <b>[[cp2]]</b>.", slips: { 1: "[[Dest]] is F, the finish.", 2: "The school gate is S, the start." } },
      lv: { spicy: { q: "Which part of the route is likely to be the slowest?", fig: mapFig({ scale: "500 m", hill: true }),
        options: ["From 2 up to F, over the hill", "From S to 1, on the flat", "Crossing the road at the crossing"],
        slips: { 1: "Flat walking is the quickest kind. Look for the contour rings.", 2: "A crossing takes a moment, but it is short. Where are the contour rings?" },
        hint: "Look for the rings on the map.",
        why: "The rings round F show a hill. Walking uphill is slower, so that stretch needs extra time." } } },

    { type: "num", topic: "Plan the route", explain: true,
      q: "Each square is 250 m. How long is the route, in metres?",
      fig: mapFig(),
      boxes: [{ label: "Route length", a: 2000, post: "m" }],
      slips: [[8, "That is the number of squares. Each one is 250 m, so times it by 250."], [2250, "That is 9 squares. Count the moves from square to square, not the start square."], [2, "2 km is right! The box wants it in metres: 1 km is 1000 m."]],
      hint: "Count the squares the red line moves through, then times by 250.",
      why: "The route moves 8 squares. 8 x 250 m = <b>2000 m</b>, which is 2 km.",
      ez: { q: "How many squares long is the route?", hint: "Start on S. Count each move.", why: "3, then 2, then 3. <b>8 squares</b>.", slips: [[null, "So close! Do not count the start square."], [null, "Nearly. Count each square the line moves into."]] },
      lv: { mild: { q: "How many squares long is the route? Count each move from one square to the next.",
          boxes: [{ label: "Squares", a: 8 }],
          slips: [[9, "So close. You counted the start square too. Count the moves, from S to the next square and on."], [7, "Nearly. Count again, touching each square the line moves into."]],
          hint: "Start on S. Count 1 each time the red line moves into a new square.",
          why: "3 squares to checkpoint 1, 2 up to checkpoint 2, then 3 to F. That is <b>8 squares</b>." },
        spicy: { q: "Each square is 500 m. How long is the route, in km?", fig: mapFig({ scale: "500 m", hill: true }),
          boxes: [{ label: "Route length", a: 4, post: "km" }],
          slips: [[8, "That is the number of squares. Two squares make 1 km."], [4000, "That is in metres. The box wants km: 1000 m is 1 km."], [4.5, "That counts the start square too. Count the moves only."]],
          hint: "Count the moves, then halve it (two squares make 1 km).",
          why: "8 squares x 500 m = 4000 m, which is <b>4 km</b>." } } },

    { type: "widget", topic: "Plan the route", unscored: true,
      title: "Draw your own route",
      html: "<p>Have a go at drawing a route of your own from the school gate. Maybe one that avoids the road, or visits the woods. The map works out how far it is.</p>",
      ez: { html: "<p>Draw your own route. The map says how far.</p>" },
      mount: routeWidget,
      report: function(d){ return d && d.route && d.route.length > 1 ? "Drew a route " + (d.route.length - 1) + " squares long." : ""; } },

    /* ---------- chunk 2: timings ---------- */
    { type: "learn", topic: "How long will it take?", title: "Walking takes time",
      fig: PACE,
      html: "<p>A good guess for walking: <b>1 km takes about 15 minutes</b>.</p>" +
        "<p><b>Worked example.</b> The route is 2 km. Walking: 2 x 15 = 30 minutes. Add a snack stop of 15 minutes. Total: 30 + 15 = <b>45 minutes</b>.</p>" +
        "<p>Leave at 10:00, back at 10:45.</p>",
      ez: { title: "Walking takes time", html: "<p><b>1 km takes about 15 minutes.</b></p><p>2 km: 15 + 15 = <b>30 minutes</b>.</p>" },
      lv: { mild: { html: "<p>A good guess for walking: <b>1 km takes about 15 minutes</b>.</p>" +
          "<p><b>Worked example.</b> The route is 2 km. That is 15 minutes, then 15 more. 15 + 15 = <b>30 minutes</b>.</p>" +
          "<p>Leave at 10:00, there by 10:30.</p>" },
        spicy: { fig: PACE_SPICY,
          html: "<p>Walkers use a rule for timings: <b>12 minutes for every km</b> on the flat (that is 5 km an hour), plus <b>10 minutes for every 100 m you climb</b>.</p>" +
          "<p><b>Worked example.</b> 3 km with a 100 m climb. Flat: 3 x 12 = 36 minutes. Climb: 100 m = 10 minutes. Total: 36 + 10 = <b>46 minutes</b>.</p>" +
          "<p>Then add any stops on top.</p>" } } },

    { type: "num", topic: "How long will it take?",
      q: "Your turn, with the steps laid out. A 3 km route with one 15 minute snack stop.",
      boxes: [{ label: "Walking: 3 x 15 =", a: 45, post: "minutes" }, { label: "Total with the stop:", a: 60, post: "minutes" }],
      slips: [[0, 3, "That is the km. Each km takes 15 minutes, so 3 x 15."], [1, 45, "That is just the walking. Add the 15 minute stop too."], [0, 18, "That is 3 + 15. It is 3 lots of 15: 15 + 15 + 15."]],
      hint: "3 lots of 15, then add 15 for the stop.",
      why: "3 x 15 = <b>45</b> minutes walking. 45 + 15 = <b>60</b> minutes altogether: one hour.",
      ez: { q: "The walk is 3 km. 1 km takes 15 minutes. How long in all?", hint: "Add 15, 3 times.", why: "15 + 15 + 15 = <b>45 minutes</b>.", slips: [[null, "That is 2 km. There are 3 lots of 15."], [null, "That is 1 km. Add the other 2."], [null, "That is 3 + 15. Try 15, 3 times."]] },
      lv: { mild: { q: "Your turn. The route to [[dest]] is 3 km. Each km takes 15 minutes. How long is the walk?",
          boxes: [{ label: "15 + 15 + 15 =", a: 45, post: "minutes" }],
          slips: [[30, "That is 2 km. There are 3 lots of 15."], [15, "That is just 1 km. Add on the other two."], [18, "That is 3 + 15. It is 15, three times."]],
          hint: "Add 15, three times.",
          why: "15 + 15 + 15 = <b>45 minutes</b>." },
        spicy: { q: "Your turn, with the steps laid out. 4 km, climbing 200 m.",
          boxes: [{ label: "Flat: 4 x 12 =", a: 48, post: "min" }, { label: "Climb: 200 m =", a: 20, post: "min" }, { label: "Total:", a: 68, post: "min" }],
          slips: [[1, 2, "Ten minutes for every 100 m: 200 m is two lots of 10."], [2, 48, "That is the flat time. Add the climb time on top."], [0, 60, "That is 15 minutes a km. This rule uses 12."]],
          hint: "4 lots of 12, then 10 for each 100 m, then add them.",
          why: "4 x 12 = <b>48</b>. 200 m climb = <b>20</b>. Total <b>68 minutes</b>, which is 1 hour 8 minutes." } } },

    { type: "mc", topic: "How long will it take?",
      q: "Now on your own. 4 km of walking, one 15 minute stop. You leave at 1:00pm. When are you back?",
      options: ["2:15pm", "2:00pm", "1:15pm", "2:30pm"],
      answer: 0,
      slips: { 1: "That is the walking only. Add the 15 minute stop too.", 2: "That is just the stop. The walking takes 4 x 15 = 60 minutes as well.", 3: "That adds two stops. There is only one." },
      hint: "4 x 15 for walking, plus 15. Then count on from 1:00.",
      why: "4 x 15 = 60 minutes, plus 15 = 75 minutes. 1:00pm plus 1 hour 15 minutes is <b>2:15pm</b>.",
      ez: { q: "You leave at 10:00. You walk 30 minutes. When do you get there?", hint: "30 minutes is half an hour.", why: "<b>10:30</b>. Half an hour later.", slips: { 1: "That is 3 minutes.", 2: "That is an hour and a half." } },
      lv: { mild: { q: "You leave at 10:00 and walk for 30 minutes. What time do you get there?",
          options: ["10:30", "10:03", "11:30"],
          slips: { 1: "That is 3 minutes. 30 minutes is half an hour.", 2: "That is an hour and a half. 30 minutes is just half an hour." },
          hint: "30 minutes is half an hour.",
          why: "10:00 plus half an hour is <b>10:30</b>." },
        spicy: { q: "Now on your own. 6 km, climbing 300 m, plus a 20 minute lunch stop. You leave at 9:30am. When are you back?",
          options: ["11:32am", "11:12am", "11:02am", "10:42am"],
          slips: { 1: "That leaves out lunch. Add the 20 minutes.", 2: "That leaves out the climb: 300 m is 30 minutes.", 3: "That is the flat time only. Add the climb and lunch." },
          hint: "6 x 12, plus 30 for the climb, plus 20 for lunch.",
          why: "72 + 30 + 20 = 122 minutes, which is 2 hours 2 minutes. 9:30am plus that is <b>11:32am</b>." } } },

    { type: "mc", topic: "How long will it take?",
      q: "In late November it gets dark at about 4pm. The walk takes 1 hour 15 minutes. Which is the latest start that still gets you back by 4pm?",
      options: ["2:45pm", "3:15pm", "3:45pm"], fixed: true,
      answer: 0,
      slips: { 1: "Starting at 3:15pm gets you back at 4:30pm, in the dark.", 2: "Starting at 3:45pm gets you back at 5pm, well after dark." },
      hint: "Count back 1 hour 15 minutes from 4pm.",
      why: "4pm take away 1 hour is 3pm. Take away 15 more minutes: <b>2:45pm</b>.",
      ez: { q: "Dark at 4pm. The walk takes 1 hour. Which start is safe?", hint: "Add 1 hour to each one.", why: "2pm plus 1 hour is 3pm. Before dark.", slips: { 1: "3:30 plus 1 hour is 4:30. Dark!", 2: "4pm is when it gets dark." } },
      lv: { mild: { q: "It gets dark at 4pm. Your walk takes 1 hour. Which start time gets you back before dark?",
          options: ["2pm", "3:30pm", "4pm"],
          slips: { 1: "3:30pm plus an hour is 4:30pm. That is after dark.", 2: "4pm is when it gets dark. You would walk the whole way in the dark." },
          hint: "Add 1 hour to each start time.",
          why: "2pm plus 1 hour is 3pm, before dark." },
        spicy: { q: "Sunset is 4pm. You want 30 minutes spare before sunset. The route takes 2 hours 15 minutes. Latest start?",
          options: ["1:15pm", "1:45pm", "12:45pm", "2:15pm"], fixed: false,
          slips: { 1: "That gets you back at 4pm exactly, with nothing spare. Take off the 30 minutes too.", 2: "That works, with a whole hour spare. You could leave half an hour later.", 3: "That gets you back at 4:30pm, after sunset." },
          hint: "Back by 3:30pm. Then count back 2 hours 15 minutes.",
          why: "Be back by 3:30pm. 3:30pm take away 2 hours 15 minutes is <b>1:15pm</b>." } } },

    /* ---------- chunk 3: kit and weather ---------- */
    { type: "learn", topic: "Kit and weather", title: "Pack for the walk and the weather",
      fig: KIT,
      html: "<p>Everyone needs the same few things: <b>water</b>, a <b>snack</b>, a <b>waterproof</b>, a <b>warm layer</b>, a <b>charged phone</b>, a <b>map</b> and a small <b>first aid kit</b>.</p>" +
        "<p>Then add what the weather asks for: hat and gloves, or sun cream and a cap.</p>" +
        "<p>Bonnie would like you to know that dogs need water too.</p>",
      ez: { title: "Pack for the walk", html: "<p>Pack <b>water</b>, a <b>snack</b>, a <b>coat</b> and a <b>phone</b>.</p><p>Leave heavy, silly things at home.</p>" },
      lv: { mild: { html: "<p>Pack the important things: <b>water</b>, a <b>snack</b>, a <b>coat</b> for rain, a <b>warm layer</b> and a <b>phone</b>.</p><p>Leave the heavy, silly things at home.</p>" } } },

    { type: "sort", topic: "Kit and weather",
      q: "Pack it, or leave it at home?",
      buckets: ["Pack it", "Leave it at home"],
      cards: [["A bottle of water", 0], ["A waterproof jacket", 0], ["[[Silly]]", 1], ["A snack", 0], ["A big box of books", 1], ["A charged phone", 0]],
      slips: { any: "Ask: would I need it on a walk, and could I carry it all the way?" },
      hint: "Ask: would I need it on a walk, and could I carry it all the way?",
      why: "Water, a waterproof, a snack and a phone help you on the walk. [[Silly]]? Outrageous. Leave it at home.",
      ez: { q: "Pack it, or leave it?", hint: "Would you need it? Could you carry it?", why: "Water, coat, snack, phone. [[Silly]]? Outrageous!", slips: { any: "Would you need it? Could you carry it?" } },
      lv: { spicy: { cards: [["A bottle of water", 0], ["A waterproof jacket", 0], ["[[Silly]]", 1], ["A small first aid kit", 0], ["Flip flops for the whole walk", 1], ["A paper map, in case the phone dies", 0], ["A spare warm layer", 0], ["Three full size towels", 1]],
        why: "Light, useful things go in. A paper map is a good backup, because phones run out of charge. Heavy or silly things stay at home." } } },

    { type: "learn", topic: "Kit and weather", title: "Check the forecast",
      fig: FC_MILD,
      html: "<p>Look at the forecast the day before, and again on the morning. It tells you the <b>time</b>, the <b>weather</b>, the <b>temperature</b> and the <b>wind</b>.</p>" +
        "<p>This one starts sunny, then rain arrives in the afternoon. That changes what you pack, and maybe when you go.</p>",
      ez: { title: "Check the weather", html: "<p>Check the <b>forecast</b> before you go.</p><p>This one says rain later.</p>" },
      lv: { spicy: { fig: FC_SPICY,
        html: "<p>Look at the forecast the day before, and again on the morning: <b>time</b>, <b>weather</b>, <b>temperature</b> and <b>wind</b>.</p>" +
          "<p>Wind matters more than people think. Gusts of 50 mph can knock you off balance, and wind makes it feel colder than the number says.</p>" +
          "<p>Good leaders always have a <b>plan B</b>: a shorter, lower or more sheltered route, or another day.</p>" } } },

    { type: "mc", topic: "Kit and weather",
      q: "Look at the forecast. You will be out from 12pm to 4pm. What is most worth packing?",
      fig: FC_MILD,
      options: ["A waterproof jacket", "Sunglasses and sun cream", "Nothing extra, it is sunny"],
      answer: 0,
      slips: { 1: "It is sunny at 9am, but you are out later. Look at 3pm.", 2: "Look at 3pm. What is the symbol there?" },
      hint: "Look at the 3pm picture.",
      why: "Rain arrives at 3pm, while you are still out. A waterproof keeps you dry.",
      ez: { q: "You are out from 12 to 4pm. What could you pack?", hint: "Look at 3pm.", why: "Rain comes at 3pm. Take a <b>waterproof</b>.", slips: { 1: "Sunny at 9am. Look at 3pm.", 2: "Look at 3pm. What is there?" } },
      lv: { spicy: { q: "Look at this forecast for your walk on the hill. What is the best call?", fig: FC_SPICY,
        options: ["Switch to plan B: a short, low, sheltered route, or another day", "Go anyway: a good waterproof sorts it", "Go, and do not tell anyone, so nobody worries"],
        slips: { 1: "A waterproof helps with rain, but 50 mph gusts on a hill are a balance and cold problem too.", 2: "Not telling anyone makes it riskier, not safer. Someone should always know." },
        hint: "Look at the wind numbers. Where would the wind be strongest?",
        why: "Strong gusts on high ground are a real risk. A lower, sheltered route, or another day, is the call a good leader makes." } } },

    { type: "multi", topic: "Kit and weather",
      q: "The forecast says cold and windy, 4 C. Pick <b>all</b> the things worth adding to your bag.",
      options: ["A hat", "Gloves", "A warm fleece", "Sun cream", "Shorts"],
      answers: [0, 1, 2],
      slips: { any: "Think about keeping your head, hands and body warm." },
      hint: "Think about keeping your head, hands and body warm.",
      why: "A hat, gloves and a fleece keep you warm. Sun cream and shorts are for a hot day.",
      ez: { q: "A cold day. Pick <b>2</b> things to add.", hint: "Head and hands.", why: "A hat and gloves keep you warm.", slips: { any: "Keep your head and hands warm." } },
      lv: { mild: { q: "It is a cold day. Pick the <b>two</b> things to add.",
        options: ["A hat", "Gloves", "Sunglasses", "Shorts"], answers: [0, 1],
        why: "A hat and gloves keep you warm on a cold day." } } },

    /* ---------- chunk 4: staying safe ---------- */
    { type: "learn", topic: "Staying safe", title: "Someone should always know",
      fig: CARD,
      html: "<p>Before you go, fill in a <b>route card</b> and leave it with someone: where you are going, who with, and when you will be back.</p>" +
        "<p>On the walk: stay with [[group]], cross roads at a crossing, and keep back from water.</p>" +
        "<p>If you get lost: <b>stop</b>, stay together, look at the map, and call the person who has your route card.</p>",
      ez: { title: "Someone should know", html: "<p>Tell someone <b>where</b> you go and <b>when</b> you will be back.</p><p>Lost? <b>Stop</b>. Stay together. Call.</p>" },
      lv: { spicy: { html: "<p>Before you go, fill in a <b>route card</b> and leave it with someone: where, who with, the route, and when you will be back.</p>" +
        "<p>Agree what happens if you are late: when they should call you, and when they should call for help.</p>" +
        "<p>On the way, think about each <b>hazard</b> (something that could cause harm) and what you will do about it. That is a risk assessment, and it can be done in your head in seconds.</p>" } } },

    { type: "match", topic: "Staying safe",
      q: "Match each hazard on the route to a safe plan.",
      pairs: [["A busy road", "Cross together, at the crossing"], ["The river", "Stay back from the edge"], ["Getting lost", "Stop, stay together, call"], ["Getting tired", "Rest and have a snack"]],
      slips: { any: "Think about what could happen with each one, then what would stop it." },
      hint: "Think about what could happen with each one, then what would stop it.",
      why: "Every hazard has a simple plan. Thinking of it before you go means you do not have to think in a hurry.",
      ez: { q: "Match each danger to a safe plan.", hint: "What could happen? What stops it?", why: "Every danger has a simple plan.", slips: { any: "What could happen? What would stop it?" } },
      lv: { spicy: { pairs: [["A busy road", "Cross together, at the crossing"], ["The river", "Stay back from the edge"], ["Getting lost", "Stop, stay together, call"], ["Getting tired", "Rest and have a snack"], ["Cold and wet on the hill", "Add layers, take the lower route"]] } } },

    { type: "mc", topic: "Staying safe",
      q: "You are going to be 30 minutes later than your route card says. What could you do?",
      options: ["Call or text the person who has your route card", "Nothing, it is only 30 minutes", "Run the rest of the way"],
      answer: 0,
      slips: { 1: "The person waiting does not know you are fine. A quick message stops them worrying.", 2: "Rushing makes trips and slips more likely. A message is quicker and safer." },
      ez: { q: "You will be 30 minutes late. What could you do?", hint: "Who is waiting for you?", why: "<b>Send a message</b>. Then they know you are fine.", slips: { 1: "They do not know you are fine yet.", 2: "Rushing makes slips more likely." } },
      hint: "Who is expecting you back?",
      why: "One message and everyone knows you are fine. That is exactly what the route card is for." },

    { type: "write", topic: "Staying safe",
      q: "Plan a local expedition of your own, if you like. Where would you go, how far is it, how long would it take, and what would you pack? This goes to Jay if you choose.",
      ez: { q: "Plan your own walk, if you like. Where? What would you pack?" },
      starters: ["I would walk to", "It is about", "It would take", "I would pack", "I would tell"],
      checklist: ["Where to", "How far and how long", "What to pack", "Who would know"],
      minWords: 30 },

    { type: "widget", topic: "Staying safe", unscored: true,
      title: "Try it for real",
      html: "<p>A challenge for away from the screen, whenever you fancy it: a short walk somewhere local, planned your way.</p>",
      ez: { html: "<p>Try a short local walk for real, if you fancy it.</p>" },
      mount: checkWidget,
      report: function(d){ var n = d && d.ticks ? d.ticks.filter(Boolean).length : 0; return n ? "Expedition challenge: " + n + " of " + GO_LIST.length + " ticked." : ""; } }
  ],

  ez: {
    blurb: "Plan a walk: the route, the time, the kit.",
    realWorld: { title: "Real explorers plan", html: "<p>Rescue teams and rangers use <b>route cards</b>.</p><p>A trip to the past needs the best route card ever!</p>" },
    make: { intro: "Plan a real walk. Send it to Jay if you like." }
  },

  realWorld: {
    title: "Real explorers plan like this",
    html: "<p>Mountain rescue teams, park rangers and Duke of Edinburgh groups all use route cards, timings and forecasts. Expeditions in history planned for months.</p>" +
      "<p>For our big question: if we could time travel, should we? A trip to the past would need the best route card ever. Where, when, back by, and who knows.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to a time portal with a route card">' + A.portal(80, 75, 58) + A.jay(240, 46, 0.85, "hmm") +
      A.bubble(290, 6, 120, 52, "Back by\nteatime?", 294) + '</svg>'
  },

  make: {
    title: "Make a route card",
    intro: "Plan a real walk. Keep it, stick it by the door, or send it to Jay.",
    fields: [
      { id: "where", label: "Where to", ph: "[[Dest]]", max: 32 },
      { id: "via", label: "Going via", ph: "[[Cp1]] and [[cp2]]", max: 60 },
      { id: "kit", label: "Kit", ph: "Water, snack, waterproof, phone", max: 60 },
      { id: "back", label: "Back by", ph: "11:00", max: 14 },
      { id: "told", label: "Who knows", ph: "Jay", max: 24 }
    ],
    svg: function(v){
      var via = wrap(v.via, 32, 2), kit = wrap(v.kit, 32, 2);
      function row(y, label, lines){ return T(36, y, label, 16, { b: 1, c: "#1f7a5c" }) + lines.map(function(l, k){ return T(170, y + k * 26, esc(l), 20); }).join(""); }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#fffbe0"/>' +
        '<rect x="0" y="0" width="600" height="70" rx="24" fill="#19c39a"/><rect x="0" y="46" width="600" height="24" fill="#19c39a"/>' +
        T(36, 46, "ROUTE CARD", 26, { b: 1 }) +
        '<path d="M470 52q20 -30 50 -16t50 -10" fill="none" stroke="#141a33" stroke-width="3" stroke-dasharray="7 5"/><circle cx="470" cy="52" r="7" fill="#ffd23f" stroke="#141a33" stroke-width="2"/><circle cx="570" cy="26" r="7" fill="#141a33"/>' +
        row(112, "Where to", wrap(v.where, 34, 1)) +
        row(160, "Going via", via) +
        row(236, "Kit", kit) +
        row(312, "Back by", wrap(v.back, 34, 1)) +
        row(356, "Who knows", wrap(v.told, 34, 1)) +
        '<path d="M36 128h528M36 214h528M36 290h528M36 330h528" stroke="#141a33" stroke-opacity=".15" stroke-width="2"/>' +
        '</svg>';
    }
  }
};
})();
