/* Base 5 Autumn 2 activity: Map scales.
   Maths. Reading a scale on a map or plan, and using it to find real distances. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, extra){ return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (/fill=/.test(extra || "") ? "" : ' fill="#141a33"') + ' ' + (extra || "") + '>' + s + '</text>'; }

/* the map: 10 by 6 squares, roads along the grid, four places */
var SQ = 36, X0 = 30, Y0 = 30;
var SPOTS = [
  { k: "[[Spot1]]", c: 1, r: 5, lx: 14, ly: 22, col: "#ff5d5d" },
  { k: "[[Spot2]]", c: 1, r: 1, lx: -14, ly: -16, col: "#8a5cf6" },
  { k: "[[Spot3]]", c: 7, r: 1, lx: -30, ly: -16, col: "#ffb300" },
  { k: "[[Spot4]]", c: 7, r: 4, lx: 16, ly: 5, col: "#19c39a" }
];
function px(c){ return X0 + c * SQ; }
function py(r){ return Y0 + r * SQ; }
function mapSvg(o){
  o = o || {};
  var out = '<svg viewBox="0 0 520 300" style="max-height:340px" role="img" aria-label="' + (o.aria || "A map on a grid with four places") + '">' +
    '<rect width="520" height="300" rx="14" fill="#eaf4e4"/>' +
    '<rect x="' + X0 + '" y="' + Y0 + '" width="' + 10 * SQ + '" height="' + 6 * SQ + '" fill="#dcefd2" stroke="#7aa36a" stroke-width="2"/>';
  for(var i = 1; i < 10; i++) out += '<path d="M' + px(i) + ' ' + Y0 + 'v' + 6 * SQ + '" stroke="#7aa36a" stroke-opacity=".35"/>';
  for(var j = 1; j < 6; j++) out += '<path d="M' + X0 + ' ' + py(j) + 'h' + 10 * SQ + '" stroke="#7aa36a" stroke-opacity=".35"/>';
  /* a lake and some trees for decoration */
  out += '<ellipse cx="' + px(4) + '" cy="' + py(3.4) + '" rx="42" ry="22" fill="#9fd3f0"/>' +
    [[4.6, 0.45], [9, 2.3], [9.3, 5.4], [4.6, 5.3]].map(function(t){ return '<circle cx="' + px(t[0]) + '" cy="' + py(t[1]) + '" r="9" fill="#5fa152"/>'; }).join("");
  /* roads */
  out += '<path d="M' + px(1) + ' ' + py(5) + 'V' + py(1) + 'H' + px(7) + 'V' + py(4) + 'M' + px(1) + ' ' + py(5) + 'H' + px(7) + 'V' + py(4) + '" fill="none" stroke="#c9c2b2" stroke-width="9" stroke-linejoin="round"/>';
  if(o.route) out += '<path d="' + o.route + '" fill="none" stroke="#e04848" stroke-width="5" stroke-dasharray="10 6" stroke-linejoin="round"/>';
  SPOTS.forEach(function(s){
    out += '<circle cx="' + px(s.c) + '" cy="' + py(s.r) + '" r="10" fill="' + s.col + '" stroke="#141a33" stroke-width="2.5"/>' +
      T(px(s.c) + s.lx, py(s.r) + s.ly, s.k, 13, 'font-weight="700"');
  });
  /* north arrow and key */
  out += '<g transform="translate(450 60)"><path d="M0 -26l10 26h-20z" fill="#141a33"/>' + T(0, 20, "N", 15, 'text-anchor="middle" font-weight="700"') + '</g>';
  if(o.key) out += T(408, 130, o.key[0], 13, 'font-weight="700"') + (o.key[1] ? T(408, 150, o.key[1], 13, 'font-weight="700"') : "") + (o.key[2] ? T(408, 170, o.key[2], 13, 'font-weight="700"') : "");
  out += '<rect x="410" y="196" width="' + SQ + '" height="' + SQ + '" fill="#dcefd2" stroke="#7aa36a" stroke-width="2"/>' + T(454, 220, "= 1 sq", 13);
  out += A.egg(A.bird(px(9.4), py(0.5), 0.55, "#3a8fd6"), "When I was in China, the map said the hotel was 2 cm away. It was a three hour walk. Always check the scale. (Jay)");
  return out + '</svg>';
}
var R23 = "M" + px(1) + " " + py(1) + "H" + px(7);

/* a scale bar with a path above it. labels at equal spacing; end = where the path stops, in segments */
function bar(labels, end){
  var x0 = 50, W = 400, seg = W / (labels.length - 1), xe = x0 + end * seg;
  var out = '<svg viewBox="0 0 520 190" role="img" aria-label="A path drawn above a scale bar">' +
    '<rect width="520" height="190" rx="14" fill="#f4f1ea"/>' +
    '<path d="M' + x0 + ' 60H' + xe + '" stroke="#e04848" stroke-width="5" stroke-dasharray="10 6"/>' +
    '<circle cx="' + x0 + '" cy="60" r="9" fill="#ff5d5d" stroke="#141a33" stroke-width="2.5"/><circle cx="' + xe + '" cy="60" r="9" fill="#ffb300" stroke="#141a33" stroke-width="2.5"/>' +
    T(x0, 38, "[[Spot1]]", 13, 'text-anchor="middle" font-weight="700"') + T(xe, 38, "[[Spot3]]", 13, 'text-anchor="middle" font-weight="700"') +
    '<path d="M' + xe + ' 72V112" stroke="#141a33" stroke-width="1.5" stroke-dasharray="4 4"/>';
  for(var i = 0; i < labels.length - 1; i++){
    out += '<rect x="' + (x0 + i * seg) + '" y="112" width="' + seg + '" height="14" fill="' + (i % 2 ? "#fff" : "#141a33") + '" stroke="#141a33" stroke-width="2"/>';
  }
  labels.forEach(function(l, i){ out += T(x0 + i * seg, 150, l, 14, 'text-anchor="middle" font-weight="700"'); });
  return out + '</svg>';
}

/* two pins with a ruler under them */
function ruler(cm, note){
  var x0 = 40, k = 44, xe = x0 + cm * k, n = Math.ceil(cm) + 1;
  var out = '<svg viewBox="0 0 520 200" role="img" aria-label="Two places ' + cm + ' cm apart, with a ruler">' +
    '<rect width="520" height="200" rx="14" fill="#eaf4e4"/>' +
    '<path d="M' + x0 + ' 58H' + xe + '" stroke="#e04848" stroke-width="5" stroke-dasharray="10 6"/>' +
    '<circle cx="' + x0 + '" cy="58" r="9" fill="#8a5cf6" stroke="#141a33" stroke-width="2.5"/><circle cx="' + xe + '" cy="58" r="9" fill="#19c39a" stroke="#141a33" stroke-width="2.5"/>' +
    T(x0 - 10, 34, "[[Spot2]]", 13, 'font-weight="700"') + T(xe + 16, 63, "[[Spot4]]", 13, 'font-weight="700"') +
    '<rect x="' + (x0 - 14) + '" y="84" width="' + (Math.max(n, 1) * k + 14) + '" height="54" rx="4" fill="#ffe28a" stroke="#141a33" stroke-width="2"/>';
  for(var i = 0; i <= n * 10 - 10; i++){
    var x = x0 + i * k / 10, big = i % 10 === 0, mid = i % 5 === 0;
    out += '<path d="M' + x + ' 84v' + (big ? 20 : mid ? 13 : 7) + '" stroke="#141a33" stroke-width="' + (big ? 2 : 1) + '"/>';
    if(big) out += T(x, 124, String(i / 10), 13, 'text-anchor="middle"');
  }
  out += '<path d="M' + xe + ' 68V84" stroke="#141a33" stroke-width="1.5" stroke-dasharray="3 3"/>';
  if(note) out += T(260, 174, note, 15, 'text-anchor="middle" font-weight="700"');
  return out + '</svg>';
}

/* map to real and back */
function conv(scale, mul, div){
  return '<svg viewBox="0 0 520 210" role="img" aria-label="Map to real life: multiply. Real life to map: divide.">' +
    '<rect width="520" height="210" rx="14" fill="#f4f1ea"/>' +
    '<rect x="30" y="66" width="150" height="70" rx="14" fill="#dcefd2" stroke="#141a33" stroke-width="3"/>' + T(105, 108, "On the map", 15, 'text-anchor="middle" font-weight="700"') +
    '<rect x="340" y="66" width="150" height="70" rx="14" fill="#ffd23f" stroke="#141a33" stroke-width="3"/>' + T(415, 108, "In real life", 15, 'text-anchor="middle" font-weight="700"') +
    '<path d="M190 70Q260 20 330 70" fill="none" stroke="#1f9d63" stroke-width="4"/><path d="M318 58l14 12 -18 4" fill="none" stroke="#1f9d63" stroke-width="4"/>' +
    T(260, 34, mul, 16, 'text-anchor="middle" font-weight="700" fill="#1f9d63"') +
    '<path d="M330 132Q260 182 190 132" fill="none" stroke="#c0392b" stroke-width="4"/><path d="M202 144l-14 -12 18 -4" fill="none" stroke="#c0392b" stroke-width="4"/>' +
    T(260, 186, div, 16, 'text-anchor="middle" font-weight="700" fill="#c0392b"') +
    T(260, 106, scale, 13, 'text-anchor="middle" fill-opacity=".8"') +
    '</svg>';
}

/* a room on a plan, with lengths in cm */
function planRoom(a, b, note){
  return '<svg viewBox="0 0 520 220" role="img" aria-label="A room on a plan, ' + a + ' by ' + b + '">' +
    '<rect width="520" height="220" rx="14" fill="#eef3fb"/>' +
    '<rect x="110" y="40" width="240" height="130" fill="#fff" stroke="#1d3557" stroke-width="5"/>' +
    '<path d="M180 170h40" stroke="#fff" stroke-width="7"/><path d="M180 170q0 -40 40 -40" fill="none" stroke="#1d3557" stroke-width="1.5"/>' +
    T(230, 30, a, 15, 'text-anchor="middle" font-weight="700" fill="#1d3557"') + T(100, 110, b, 15, 'text-anchor="end" font-weight="700" fill="#1d3557"') +
    T(370, 100, note, 14, 'font-weight="700" fill="#1d3557"') + '</svg>';
}

/* widget: tap places in order to build a route, then work out the real distance */
function mountRoute(el, api){
  var tk = api.tok || function(x){ return x; };
  var cfgs = {
    mild: { per: 100, unit: "m", say: "Each square on the map is 100 m in real life." },
    medium: { per: 0.5, unit: "km", say: "Each square is 1 cm. The scale is 1 cm = 0.5 km." },
    spicy: { per: 0.25, unit: "km", say: "Each square is 1 cm. The scale is 1 : 25 000." }
  };
  var c = cfgs[api.level] || cfgs.medium;
  var d = api.data; d.tries = d.tries || [];
  var route = [];
  el.innerHTML = '<p class="tiny">' + c.say + ' Tap places in the order you would visit them. Roads follow the grid.</p>' +
    '<div class="msmap"></div>' +
    '<p class="msout" aria-live="polite" style="text-align:center;min-height:1.4em;margin:6px 0">Tap a place to start your route.</p>' +
    '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center">' +
    '<label style="display:flex;gap:6px;align-items:center;font-weight:700">Real distance <input class="msin" type="text" inputmode="decimal" autocomplete="off" style="width:7em;font:inherit;padding:6px 8px;border-radius:8px;border:2px solid #141a33"> ' + c.unit + '</label>' +
    '<button type="button" class="btn mscheck">Check</button><button type="button" class="btn msshow">Show me</button><button type="button" class="btn msclear">Start again</button></div>' +
    '<p class="msfb" aria-live="polite" style="text-align:center;min-height:1.4em"></p>';
  var host = el.querySelector(".msmap"), out = el.querySelector(".msout"), fb = el.querySelector(".msfb"), inp = el.querySelector(".msin");
  function legPath(){
    if(route.length < 2) return "";
    var s = "M" + px(SPOTS[route[0]].c) + " " + py(SPOTS[route[0]].r);
    for(var i = 1; i < route.length; i++){ var b = SPOTS[route[i]]; s += "H" + px(b.c) + "V" + py(b.r); }
    return s;
  }
  function squares(){
    var n = 0;
    for(var i = 1; i < route.length; i++){ var a = SPOTS[route[i - 1]], b = SPOTS[route[i]]; n += Math.abs(a.c - b.c) + Math.abs(a.r - b.r); }
    return n;
  }
  function real(){ return Math.round(squares() * c.per * 1000) / 1000; }
  function draw(){
    host.innerHTML = tk(mapSvg({ route: legPath(), aria: "Route map. Tap the places to plan a route." }));
    [].forEach.call(host.querySelectorAll("circle"), function(ci){
      var x = +ci.getAttribute("cx"), y = +ci.getAttribute("cy");
      SPOTS.forEach(function(s, k){
        if(px(s.c) === x && py(s.r) === y && +ci.getAttribute("r") === 10){
          ci.setAttribute("tabindex", "0"); ci.setAttribute("role", "button");
          ci.setAttribute("aria-label", tk(s.k)); ci.style.cursor = "pointer";
          ci.addEventListener("click", function(){ pick(k); });
          ci.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); pick(k); } });
        }
      });
    });
    var names = route.map(function(k){ return tk(SPOTS[k].k); });
    out.innerHTML = route.length ? "Route: " + names.join(" to ") + (route.length > 1 ? ". That is <b>" + squares() + " squares</b> on the map." : ". Now tap the next place.") : "Tap a place to start your route.";
  }
  function pick(k){
    try{
      if(route.length && route[route.length - 1] === k) return;
      if(route.length >= 6) route = [];
      route.push(k); fb.textContent = ""; draw();
    }catch(e){ out.textContent = "Tap a place to start again."; }
  }
  function finish(how, v){
    d.tries.push({ squares: squares(), answer: v, how: how });
    if(d.tries.length > 10) d.tries.shift();
    api.save();
    if(!api.resolved()) api.done("done");
  }
  el.querySelector(".mscheck").onclick = function(){
    if(route.length < 2){ fb.textContent = "Tap at least two places first, if you like."; return; }
    var v = parseFloat(String(inp.value).replace(/[^0-9.\-]/g, ""));
    if(isNaN(v)){ fb.textContent = "Pop a number in the box first."; return; }
    if(Math.abs(v - real()) < 0.001) fb.innerHTML = "Spot on: " + squares() + " &#215; " + c.per + " = <b>" + real() + " " + c.unit + "</b>.";
    else if(Math.abs(v - squares()) < 0.001) fb.innerHTML = "That is the number of squares on the map. Times it by " + c.per + " for real life.";
    else fb.innerHTML = "Not quite yet. Try " + squares() + " &#215; " + c.per + ".";
    finish("check", v);
  };
  el.querySelector(".msshow").onclick = function(){
    if(route.length < 2){ fb.textContent = "Tap at least two places first, if you like."; return; }
    fb.innerHTML = squares() + " squares &#215; " + c.per + " " + c.unit + " = <b>" + real() + " " + c.unit + "</b>.";
    finish("shown", null);
  };
  el.querySelector(".msclear").onclick = function(){ route = []; fb.textContent = ""; inp.value = ""; draw(); };
  draw();
}

(window.A2PACKS = window.A2PACKS || {})["map-scales"] = {
  a2: true,
  id: "a2-map-scales",
  title: "Map scales",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 25,
  line: "A map is a small drawing of a big place. The scale tells you how big.",
  blurb: "Reading the scale on a map or plan, and using it to find real distances. Four short chunks, a route planner to play with, and a journey card to make at the end.",
  note: "Using the scale on a map or plan to work out real distances. Four five minute chunks, a route planner, and a journey card at the end. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Stroll", line: "Stroll: grid maps where each square is a set distance." },
    { id: "medium", name: "Road trip", line: "Road trip: scales like 1 cm = 2 km, scale bars and plans." },
    { id: "spicy", name: "Expedition", line: "Expedition: ratio scales like 1 : 50 000, unit changes and areas." }
  ],
  themes: {
    time: { name: "Time travel", w: { spot1: "portal", spot2: "castle", spot3: "old mill", spot4: "stone circle", who: "the time traveller" } },
    football: { name: "Football", w: { spot1: "stadium", spot2: "training pitch", spot3: "club shop", spot4: "car park", who: "the coach" } },
    horror: { name: "Horror", w: { spot1: "crypt", spot2: "creepy tower", spot3: "old well", spot4: "abandoned fair", who: "the night porter" } },
    fishing: { name: "Fishing", w: { spot1: "jetty", spot2: "tackle shop", spot3: "boat house", spot4: "reed bed", who: "the angler" } },
    music: { name: "Music", w: { spot1: "theatre", spot2: "stage door", spot3: "bandstand", spot4: "music shop", who: "the singer" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: mapSvg({ key: ["1 square", "= 1 cm"] }),
  steps: [

    /* ---------- chunk 1: what a scale means ---------- */
    { type: "learn", topic: "What a scale tells you", title: "A small drawing of a big place",
      fig: mapSvg({ key: ["1 cm on the map", "= 1 km for real"] }),
      html: "<p>A map is a small drawing of a real place. Everything is shrunk by the same amount.</p>" +
        "<p>The <b>scale</b> tells you how much. <b>1 cm = 1 km</b> means every 1 cm on the map stands for 1 km in real life.</p>" +
        "<p>On this map each square is 1 cm. So from the [[spot2]] to the [[spot3]] along the road is 6 squares: <b>6 km</b> in real life.</p>",
      ez: { html: "<p>A map is a <b>small drawing</b> of a real place.</p><p>Here, <b>each square is 100 m</b>. 6 squares is 600 m.</p>" },
      lv: {
        mild: { fig: mapSvg({ key: ["1 square", "= 100 m"] }),
          html: "<p>A map is a small drawing of a real place.</p>" +
            "<p>The <b>scale</b> tells you how far things really are. On this map, <b>each square is 100 m</b> in real life.</p>" +
            "<p>Count the squares, then count in hundreds. From the [[spot2]] to the [[spot3]] is 6 squares: 100, 200, 300, 400, 500, 600. That is <b>600 m</b>.</p>" },
        spicy: { fig: mapSvg({ key: ["1 : 100 000", "1 cm = 1 km"] }),
          html: "<p>A map is a scale drawing: every length is shrunk by the same factor.</p>" +
            "<p>A <b>ratio scale</b> like <b>1 : 100 000</b> means 1 unit on the map is 100 000 of the same unit in real life. So 1 cm on the map is 100 000 cm = 1 000 m = <b>1 km</b>.</p>" +
            "<p>Handy facts: 100 cm = 1 m, and 100 000 cm = 1 km. On this map, the [[spot2]] to the [[spot3]] is 6 cm, so 6 km.</p>" } } },

    { type: "mc", topic: "What a scale tells you",
      q: "A map says <b>1 cm = 1 km</b>. What does that mean?",
      options: ["Every 1 cm on the map is 1 km in real life.", "The map is 1 km wide.", "You can walk 1 km in 1 minute."],
      answer: 0,
      slips: { 1: "The scale is about how much each bit of map stands for, not how big the paper is.", 2: "The scale says nothing about time. It links map lengths to real lengths." },
      hint: "It links a length on paper to a length in the real world.",
      why: "Each 1 cm you measure on the map stands for 1 km out there.",
      ez: { slips: { 1: "It is not about counting squares.", 2: "The real place is 100 m. Not the paper." },
        hint: "Paper, or the real world?", why: "1 square is 100 m in real life." },
      lv: {
        mild: { q: "A map says <b>each square = 100 m</b>. What does that mean?",
          options: ["Each square on the map is 100 m in real life.", "The map has 100 squares.", "Each square is 100 m wide on the paper."],
          slips: { 1: "It is not counting squares. It tells you how far one square is in real life.", 2: "The paper squares are tiny. It is the real place that is 100 m." },
          hint: "Is 100 m on the paper, or out in the real world?",
          why: "One square on the map stands for 100 m out in the real world." },
        spicy: { q: "A map has the scale <b>1 : 50 000</b>. What does that mean?",
          options: ["1 cm on the map is 50 000 cm in real life.", "1 cm on the map is 50 000 km in real life.", "The map covers 50 000 square km.", "The map is 50 000 times smaller than a normal map."],
          slips: { 1: "Same unit on both sides: 1 cm to 50 000 cm. That is only 500 m.", 2: "The ratio is about lengths, not the area covered.", 3: "It is 50 000 times smaller than the real place, not than another map." },
          hint: "A ratio uses the same unit on both sides.",
          why: "1 : 50 000 means 1 cm stands for 50 000 cm, which is 500 m." } } },

    { type: "num", topic: "What a scale tells you",
      q: "On this map each square is 1 cm, and the scale is <b>1 cm = 2 km</b>. How far is it along the road from the [[spot2]] to the [[spot3]]?",
      fig: mapSvg({ route: R23, key: ["1 square = 1 cm", "1 cm = 2 km"] }),
      boxes: [{ label: "Real distance", a: 12, post: "km" }],
      slips: [[6, "6 cm is the distance on the map. Each cm is 2 km in real life."], [3, "That divides. Map to real life multiplies: 6 &#215; 2."], [8, "6 + 2 adds. Each of the 6 cm is worth 2 km: multiply."]],
      hint: "Count the squares, then times by 2.",
      why: "6 squares = 6 cm on the map. 6 &#215; 2 = <b>12 km</b>.",
      ez: { q: "Each square is <b>100 m</b>. How far from the [[spot2]] to the [[spot3]]?",
        slips: [[6, "6 is the squares. Each is 100 m."], [60, "Each square is 100 m, not 10 m."], [106, "Count in hundreds: 100, 200, 300."]] },
      lv: {
        mild: { q: "Each square is <b>100 m</b>. How far is it along the road from the [[spot2]] to the [[spot3]]?",
          fig: mapSvg({ route: R23, key: ["1 square", "= 100 m"] }),
          boxes: [{ label: "Real distance", a: 600, post: "m" }],
          slips: [[6, "6 is the squares on the map. Each square is 100 m in real life."], [60, "Each square is 100 m, not 10 m."], [106, "Count in hundreds: 100, 200, 300..."]],
          hint: "Count the squares, then count in hundreds.",
          why: "6 squares, each 100 m: <b>600 m</b>." },
        spicy: { q: "Each square is 1 cm and the scale is <b>1 : 50 000</b>. How far is it along the road from the [[spot2]] to the [[spot3]], in km?",
          fig: mapSvg({ route: R23, key: ["1 square = 1 cm", "1 : 50 000"] }),
          boxes: [{ label: "Real distance", a: 3, post: "km" }],
          slips: [[300000, "300 000 is right, in cm. Change to km: divide by 100 000."], [30, "Check the zeros: 300 000 cm = 3 000 m = 3 km."], [6, "6 cm is on the map. Multiply by 50 000 first."]],
          hint: "6 &#215; 50 000 cm, then change cm to km.",
          why: "6 &#215; 50 000 = 300 000 cm = 3 000 m = <b>3 km</b>." } } },

    { type: "num", topic: "What a scale tells you",
      q: "Some maps use a <b>scale bar</b> instead. Line the path up with the bar. How far is it from the [[spot1]] to the [[spot3]]?",
      fig: bar(["0", "1 km", "2 km", "3 km", "4 km"], 2.5),
      boxes: [{ label: "Real distance", a: 2.5, post: "km" }],
      slips: [[2, "It goes past the 2 km mark. Look at where it stops: half way to 3."], [3, "It stops before 3 km. Half way between 2 and 3."], [5, "That counts the blocks in halves. Read the labels on the bar instead."]],
      hint: "It stops half way between two labels.",
      why: "The path stops half way between 2 km and 3 km: <b>2.5 km</b>.",
      ez: { q: "Use the <b>scale bar</b>. How far from the [[spot1]] to the [[spot3]]?",
        slips: [[3, "3 is the blocks. Read the label."], [40, "Follow the dotted line down."]] },
      lv: {
        mild: { q: "This map uses a <b>scale bar</b>. Line the path up with the bar. How far is it from the [[spot1]] to the [[spot3]]?",
          fig: bar(["0", "10 m", "20 m", "30 m", "40 m", "50 m"], 3),
          boxes: [{ label: "Real distance", a: 30, post: "m" }],
          slips: [[3, "3 is the number of blocks. Read the label under the end of the path."], [40, "Check where the path stops: the dotted line points at the label."]],
          hint: "Follow the dotted line down to the bar.",
          why: "The path stops right above <b>30 m</b>." },
        spicy: { q: "Line the path up with the scale bar. How far is it from the [[spot1]] to the [[spot3]], in metres?",
          fig: bar(["0", "500 m", "1 km", "1.5 km", "2 km"], 3.5),
          boxes: [{ label: "Real distance", a: 1750, post: "m" }],
          slips: [[1.75, "1.75 is right in km. The question asks for metres: 1 km = 1 000 m."], [1500, "It goes past 1.5 km. Half a block more is another 250 m."], [3.5, "That is the number of blocks. Each block is 500 m."]],
          hint: "Each block is 500 m. Count the blocks to the end.",
          why: "3.5 blocks &#215; 500 m = <b>1 750 m</b>, or 1.75 km." } } },

    /* ---------- chunk 2: map to real life ---------- */
    { type: "learn", topic: "Map to real life", title: "Measure, then multiply",
      fig: ruler(3.5, "Scale: 1 cm = 2 km"),
      html: "<p>Here is a worked example.</p>" +
        "<p><b>1. Measure</b> the distance on the map with a ruler: 3.5 cm.</p>" +
        "<p><b>2. Read the scale:</b> 1 cm = 2 km.</p>" +
        "<p><b>3. Multiply:</b> 3.5 &#215; 2 = <b>7 km</b> in real life.</p>" +
        "<p>Map to real life is always a multiply, because real life is bigger.</p>",
      ez: { html: "<p><b>Measure</b> on the map: 4 cm. Each cm is 10 m.</p><p>4 lots of 10 m = <b>40 m</b>. Real life is bigger.</p>" },
      lv: {
        mild: { fig: ruler(4, "Scale: 1 cm = 10 m"),
          html: "<p>Here is a worked example.</p>" +
            "<p><b>1. Measure</b> on the map with a ruler: 4 cm.</p>" +
            "<p><b>2. Read the scale:</b> 1 cm = 10 m.</p>" +
            "<p><b>3. Times:</b> 4 lots of 10 m = <b>40 m</b>.</p>" +
            "<p>Real life is always bigger than the map, so the answer gets bigger.</p>" },
        spicy: { fig: ruler(3.5, "Scale: 1 : 25 000"),
          html: "<p>Here is a worked example with a ratio scale.</p>" +
            "<p><b>1. Measure:</b> 3.5 cm on the map.</p>" +
            "<p><b>2. Multiply by the scale:</b> 3.5 &#215; 25 000 = 87 500 cm in real life.</p>" +
            "<p><b>3. Change the units:</b> 87 500 cm &#247; 100 = 875 m, or &#247; 100 000 = <b>0.875 km</b>.</p>" +
            "<p>The unit change is where most slips happen. Write the cm answer down first, then convert.</p>" } } },

    { type: "num", topic: "Map to real life",
      q: "Your turn, with some of it done. The scale is <b>1 cm = 3 km</b>. Read the ruler, then multiply.",
      fig: ruler(4, "Scale: 1 cm = 3 km"),
      boxes: [{ label: "Map distance", a: 4, post: "cm" }, { label: "Real distance: 4 &#215; 3 =", a: 12, post: "km" }],
      slips: [[1, 7, "4 + 3 adds. Each of the 4 cm is worth 3 km: multiply."], [1, 4, "4 cm is on the map. Times by 3 for real life."]],
      hint: "Where does the green pin sit on the ruler?",
      why: "4 cm on the map. 4 &#215; 3 = <b>12 km</b>.",
      ez: { q: "<b>1 cm = 10 m</b>. Read the ruler. Then times by 10.",
        slips: [[1, 15, "That adds. You need 5 lots of 10."], [1, 5, "5 cm is the map. Times by 10."]], hint: "Where is the green pin?" },
      lv: {
        mild: { q: "Your turn, with some of it done. The scale is <b>1 cm = 10 m</b>. Read the ruler, then times by 10.",
          fig: ruler(5, "Scale: 1 cm = 10 m"),
          boxes: [{ label: "Map distance", a: 5, post: "cm" }, { label: "Real distance: 5 lots of 10 =", a: 50, post: "m" }],
          slips: [[1, 15, "5 + 10 adds. You need 5 lots of 10."], [1, 5, "5 cm is on the map. Times by 10 for real life."]],
          why: "5 cm on the map. 5 lots of 10 = <b>50 m</b>." },
        spicy: { q: "Your turn, with some of it done. The scale is <b>1 : 25 000</b>. Read the ruler, multiply, then change to km.",
          fig: ruler(8, "Scale: 1 : 25 000"),
          boxes: [{ label: "Map distance", a: 8, post: "cm" }, { label: "Real distance in cm", a: 200000, post: "cm" }, { label: "Real distance in km", a: 2, post: "km" }],
          slips: [[2, 20, "Check the zeros: 200 000 &#247; 100 000 = 2."], [2, 2000, "2 000 is in metres. One more step to km."], [1, 20000, "8 &#215; 25 000 = 200 000. Check the zeros."]],
          hint: "8 &#215; 25 000. Then 100 000 cm = 1 km.",
          why: "8 &#215; 25 000 = 200 000 cm = 2 000 m = <b>2 km</b>." } } },

    { type: "num", topic: "Map to real life", explain: true,
      q: "The scale is <b>1 cm = 5 km</b>. Two places are 2.5 cm apart on the map. How far apart are they in real life?",
      boxes: [{ label: "Real distance", a: 12.5, post: "km" }],
      slips: [[7.5, "2.5 + 5 adds. Multiply instead."], [0.5, "That divides. Map to real life multiplies."], [10, "Do not forget the half: 2 &#215; 5 = 10, plus 0.5 &#215; 5."]],
      hint: "2 &#215; 5, then add half of 5.",
      why: "2.5 &#215; 5 = 10 + 2.5 = <b>12.5 km</b>.",
      ez: { q: "<b>1 cm = 100 m</b>. Two places are 6 cm apart. How far for real?",
        slips: [[106, "That adds. You need 6 lots of 100."], [60, "6 lots of 100, not 10."], [6, "6 cm is the map. Count in hundreds."]], hint: "Count in hundreds 6 times." },
      lv: {
        mild: { q: "The scale is <b>1 cm = 100 m</b>. Two places are 6 cm apart on the map. How far is that in real life?",
          boxes: [{ label: "Real distance", a: 600, post: "m" }],
          slips: [[106, "That adds. You need 6 lots of 100."], [60, "6 lots of 100, not 10."], [6, "6 cm is on the map. Count in hundreds."]],
          hint: "Count in hundreds six times.",
          why: "6 lots of 100 m = <b>600 m</b>." },
        spicy: { q: "The scale is <b>1 : 50 000</b>. Two places are 7.4 cm apart on the map. How far apart are they in real life, in km?",
          boxes: [{ label: "Real distance", a: 3.7, post: "km" }],
          slips: [[370000, "Right in cm. Now change to km: divide by 100 000."], [37, "Check the zeros: 370 000 cm = 3 700 m = 3.7 km."], [370, "370 is not quite it. 370 000 cm &#247; 100 000 = 3.7 km."]],
          hint: "7.4 &#215; 50 000 = 7.4 &#215; 100 000 &#247; 2.",
          why: "7.4 &#215; 50 000 = 370 000 cm = <b>3.7 km</b>." } } },

    { type: "mc", topic: "Map to real life",
      q: "The same 3 km walk is drawn on two maps. Map A: 1 cm = 1 km. Map B: 1 cm = 500 m. On which map is the line longer?",
      options: ["Map B", "Map A", "Both the same"],
      answer: 0, fixed: true,
      slips: { 1: "Map A needs 3 cm (3 &#215; 1 km). Map B needs 6 cm, because each cm is only 500 m.", 2: "The real walk is the same, but each map shrinks it by a different amount." },
      hint: "How many cm does each map need for 3 km?",
      why: "A: 3 cm. B: 6 cm. When each cm stands for less, the map is bigger and shows more detail.",
      ez: { q: "Map A: 1 square is 100 m. Map B: 1 square is 10 m. Which map needs more squares for 100 m?",
        slips: { 1: "On Map A, 100 m is just 1 square.", 2: "The squares are worth different amounts." },
        hint: "How many squares make 100 m?", why: "A needs 1 square. B needs 10 squares." },
      lv: {
        mild: { q: "Map A: each square is 100 m. Map B: each square is 10 m. The same 100 m walk is drawn on both. On which map does it take more squares?",
          slips: { 1: "On Map A, 100 m is just 1 square. On Map B it is 10 squares.", 2: "The walk is the same, but the squares are worth different amounts." },
          hint: "How many squares make 100 m on each map?",
          why: "Map A: 1 square. Map B: 10 squares. Map B is a close up map." },
        spicy: { q: "Which map shows more detail of a town: one at 1 : 10 000 or one at 1 : 100 000?",
          options: ["1 : 10 000", "1 : 100 000", "They show the same detail"],
          slips: { 1: "At 1 : 100 000, 1 cm is a whole km: a town would be tiny on the page.", 2: "Different scales shrink the town by different amounts, so the detail differs." },
          hint: "At each scale, how much real distance does 1 cm cover?",
          why: "At 1 : 10 000, 1 cm is 100 m. At 1 : 100 000, 1 cm is 1 km. The smaller number after the colon means a bigger, more detailed map." } } },

    /* ---------- chunk 3: real life to map ---------- */
    { type: "learn", topic: "Real life to map", title: "Going backwards: divide",
      fig: conv("Scale: 1 cm = 2 km", "&#215; 2", "&#247; 2"),
      html: "<p>Sometimes you know the real distance and need to draw it. Then you go backwards.</p>" +
        "<p><b>Map to real life: multiply.</b> <b>Real life to map: divide.</b></p>" +
        "<p>Example: a real road is 6 km and the scale is 1 cm = 2 km. 6 &#247; 2 = <b>3 cm</b> on the map.</p>" +
        "<p>Building plans use scales too. A plan at 1 cm = 1 m shows a 5 m wall as 5 cm.</p>",
      ez: { title: "Going backwards", html: "<p>Map to real life: <b>times</b>. Real life to map: <b>divide</b>.</p><p>50 m with 10 m squares is <b>5 squares</b>.</p>" },
      lv: {
        mild: { fig: conv("Each square = 10 m", "&#215; 10", "&#247; 10"),
          html: "<p>Sometimes you know the real distance and want to draw it. Go backwards.</p>" +
            "<p>Each square is 10 m. A real wall is 50 m long. How many tens in 50? <b>5 squares</b>.</p>" +
            "<p>Map to real life: times. Real life to map: share, or divide.</p>" },
        spicy: { fig: conv("Scale: 1 : 200", "&#215; 200", "&#247; 200"),
          html: "<p>To draw something to scale, go backwards: <b>divide by the scale</b>.</p>" +
            "<p>But first make the units match. A real wall is 9 m on a 1 : 200 plan: 9 m = 900 cm, and 900 &#247; 200 = <b>4.5 cm</b> on the plan.</p>" +
            "<p>Areas are different: a plan at 1 : 100 shrinks each length by 100, so the area shrinks by 100 &#215; 100. Safest: scale the lengths first, then find the area.</p>" } } },

    { type: "num", topic: "Real life to map",
      q: "A real path is <b>15 km</b> long. The scale is <b>1 cm = 5 km</b>. How long is it on the map?",
      boxes: [{ label: "Map distance", a: 3, post: "cm" }],
      slips: [[75, "That multiplies. Real life to map divides."], [10, "15 &#8722; 5 takes away. Think: how many 5s in 15?"]],
      hint: "15 &#247; 5.",
      why: "15 &#247; 5 = <b>3 cm</b>. Check: 3 &#215; 5 = 15 km.",
      ez: { q: "Each square is <b>10 m</b>. A fence is <b>50 m</b>. How many squares?",
        slips: [[500, "That multiplies. How many 10s in 50?"], [40, "That takes away. Count in tens to 50."]] },
      lv: {
        mild: { q: "Each square is <b>10 m</b>. A real fence is <b>50 m</b> long. How many squares long is it on the map?",
          boxes: [{ label: "Squares", a: 5 }],
          slips: [[500, "That multiplies. Real life to map goes the other way: how many 10s in 50?"], [40, "50 &#8722; 10 takes away. Count in tens: 10, 20, 30, 40, 50."]],
          hint: "Count in tens up to 50.",
          why: "10, 20, 30, 40, 50: <b>5 squares</b>." },
        spicy: { q: "A real wall is <b>9 m</b> long. On a plan with scale <b>1 : 200</b>, how long is it?",
          boxes: [{ label: "Plan length", a: 4.5, post: "cm" }],
          slips: [[1800, "That multiplies. Real to plan divides."], [0.045, "Change 9 m to cm first: 900 cm."], [45, "Check: 900 &#247; 200 = 4.5, not 45."]],
          hint: "9 m = 900 cm. Then &#247; 200.",
          why: "900 cm &#247; 200 = <b>4.5 cm</b>." } } },

    { type: "match", topic: "Real life to map",
      q: "The scale is <b>1 cm = 2 km</b>. Match each map distance to its real distance.",
      pairs: [["3 cm", "6 km"], ["4.5 cm", "9 km"], ["0.5 cm", "1 km"], ["10 cm", "20 km"]],
      hint: "Times each one by 2.",
      why: "Each cm is 2 km, so double the map distance.",
      ez: { q: "Each square is <b>10 m</b>. Match them up." },
      lv: {
        mild: { q: "Each square is <b>10 m</b>. Match each number of squares to the real distance.",
          pairs: [["2 squares", "20 m"], ["5 squares", "50 m"], ["8 squares", "80 m"]],
          hint: "Count in tens.",
          why: "Each square is 10 m, so count in tens." },
        spicy: { q: "Match each scale to what 1 cm stands for.",
          pairs: [["1 : 100 000", "1 km"], ["1 : 25 000", "250 m"], ["1 : 50 000", "500 m"], ["1 : 100", "1 m"]],
          hint: "Write the number in cm, then change to m: divide by 100.",
          why: "25 000 cm = 250 m. 50 000 cm = 500 m. 100 000 cm = 1 km. 100 cm = 1 m." } } },

    { type: "num", topic: "Real life to map",
      q: "On this plan, <b>1 cm = 2 m</b>. The room is 3 cm by 2.5 cm on the plan. How big is the real room?",
      fig: planRoom("3 cm", "2.5 cm", "1 cm = 2 m"),
      boxes: [{ label: "Real length", a: 6, post: "m" }, { label: "Real width", a: 5, post: "m" }],
      slips: [[0, 1.5, "That divides. Plan to real life multiplies: 3 &#215; 2."], [1, 4.5, "2.5 + 2 adds. Multiply: 2.5 &#215; 2."]],
      hint: "Times each one by 2.",
      why: "3 &#215; 2 = <b>6 m</b>, and 2.5 &#215; 2 = <b>5 m</b>.",
      ez: { q: "<b>1 cm = 1 m</b>. The plan is 5 cm by 4 cm. How big is the real room?",
        slips: [[0, 50, "1 cm is 1 m. So 5 cm is 5 m."]] },
      lv: {
        mild: { q: "On this plan, <b>1 cm = 1 m</b>. The room is 5 cm by 4 cm on the plan. How big is the real room?",
          fig: planRoom("5 cm", "4 cm", "1 cm = 1 m"),
          boxes: [{ label: "Real length", a: 5, post: "m" }, { label: "Real width", a: 4, post: "m" }],
          slips: [[0, 50, "1 cm stands for 1 m here, so 5 cm is just 5 m."]],
          hint: "Every 1 cm is 1 m.",
          why: "5 cm = <b>5 m</b>, and 4 cm = <b>4 m</b>." },
        spicy: { q: "On this plan the scale is <b>1 : 50</b>. The room is 9 cm by 7 cm on the plan. Find the real length, width and floor area.",
          fig: planRoom("9 cm", "7 cm", "1 : 50"),
          boxes: [{ label: "Real length", a: 4.5, post: "m" }, { label: "Real width", a: 3.5, post: "m" }, { label: "Real area", a: 15.75, post: "m&#178;" }],
          slips: [[2, 63, "63 is the area on the plan, in cm&#178;. Scale the lengths first, then multiply."], [2, 16, "16 m is the perimeter. Area multiplies length by width."], [0, 450, "450 is in cm. Change to m: 4.5 m."]],
          hint: "9 &#215; 50 = 450 cm = 4.5 m. Then the width. Then multiply.",
          why: "4.5 m by 3.5 m. 4.5 &#215; 3.5 = <b>15.75 m&#178;</b>." } } },

    /* ---------- chunk 4: plan a route ---------- */
    { type: "widget", topic: "Plan a route", unscored: true,
      title: "Route planner",
      html: "<p>Plan a trip round the map for [[who]]. Tap the places in order, then work out how far it is in real life. Try a few routes, if you like.</p>",
      ez: { html: "<p>Plan a trip for [[who]]. Tap the places in order.</p><p>How far is it for real?</p>" },
      mount: mountRoute },

    { type: "num", topic: "Plan a route",
      q: "[[Who]] goes from the [[spot1]] to the [[spot2]] (3 cm on the map), then on to the [[spot3]] (4.5 cm). The scale is <b>1 cm = 2 km</b>. How far is the whole trip?",
      boxes: [{ label: "Total real distance", a: 15, post: "km" }],
      slips: [[7.5, "7.5 cm is on the map. Times by 2 for real life."], [9, "That is just the second part. Add the first part too."], [6, "That is just the first part. Add the second part too."]],
      hint: "Add the map distances first: 3 + 4.5. Then times by 2.",
      why: "3 + 4.5 = 7.5 cm. 7.5 &#215; 2 = <b>15 km</b>.",
      ez: { q: "[[Who]] walks 2 squares, then 3 more. Each is <b>100 m</b>. How far?",
        slips: [[5, "5 squares. Each one is 100 m."], [200, "Add the second part too."], [300, "Add the first part too."]], hint: "2 + 3, then count in hundreds." },
      lv: {
        mild: { q: "[[Who]] walks 2 squares, then 3 more squares. Each square is <b>100 m</b>. How far is that altogether?",
          boxes: [{ label: "Total real distance", a: 500, post: "m" }],
          slips: [[5, "5 squares on the map. Each is 100 m in real life."], [200, "That is only the first part. Add the second part too."], [300, "That is only the second part. Add the first part too."]],
          hint: "2 + 3 squares, then count in hundreds.",
          why: "5 squares &#215; 100 m = <b>500 m</b>." },
        spicy: { q: "On a <b>1 : 25 000</b> map, a walk has two legs: 6 cm and 10 cm. [[Who]] walks at 4 km per hour. Find the real distance, then the time in minutes.",
          boxes: [{ label: "Real distance", a: 4, post: "km" }, { label: "Time", a: 60, post: "minutes" }],
          slips: [[1, 1, "1 is the time in hours. The box asks for minutes."], [0, 400000, "That is in cm. Divide by 100 000 for km."], [0, 16, "16 cm is on the map. Multiply by 25 000 first."]],
          hint: "16 cm &#215; 25 000 = 400 000 cm. At 4 km per hour, 4 km takes...",
          why: "16 &#215; 25 000 = 400 000 cm = <b>4 km</b>. At 4 km per hour that is 1 hour = <b>60 minutes</b>." } } },

    { type: "mc", topic: "Plan a route",
      q: "Which scale would suit a map of a whole country?",
      options: ["1 cm = 10 km", "1 cm = 100 m", "1 cm = 1 m", "1 cm = 1 mm"],
      answer: 0,
      slips: { 1: "That suits a town or a walk. A whole country would need a map hundreds of metres long.", 2: "1 cm = 1 m suits a room plan. A country map would be enormous.", 3: "That would make the map ten times bigger than the real country!" },
      hint: "A country is hundreds of km across. The map has to fit on a page.",
      why: "At 1 cm = 10 km, a country 500 km across fits in 50 cm. The others would not fit anywhere.",
      ez: { slips: { 1: "That suits a room plan.", 2: "That map would be bigger than the country!" },
        hint: "The map has to fit on a page.", why: "1 cm = 10 km. A country fits on a page." },
      lv: {
        mild: { options: ["1 cm = 10 km", "1 cm = 1 m", "1 cm = 1 mm"],
          slips: { 1: "1 cm = 1 m suits a room plan. A country map would be enormous.", 2: "That would make the map bigger than the real country!" } },
        spicy: { q: "A map is <b>1 : 25 000</b>, but its scale bar has torn off. Which scale bar would match?",
          options: ["4 cm = 1 km", "1 cm = 25 km", "2.5 cm = 1 km", "1 cm = 2.5 km"],
          slips: { 1: "25 000 cm is 250 m, not 25 km.", 2: "At 1 : 25 000, 1 cm = 250 m, so 1 km needs 4 cm.", 3: "1 cm = 250 m = 0.25 km, not 2.5 km." },
          hint: "First find what 1 cm stands for. How many of those make 1 km?",
          why: "1 cm = 25 000 cm = 250 m. Four lots of 250 m make 1 km, so <b>4 cm = 1 km</b>." } } }
  ],

  ez: {
    realWorld: { html: "<p>Walkers, drivers and sat navs all use <b>scales</b>.</p><p>Would a 200 year old map still be right?</p>" },
    make: { intro: "Pick 2 places and a scale. The card works out the real distance. Send it to Jay if you like." }
  },

  realWorld: {
    title: "Scales get people where they are going",
    html: "<p>Walkers, delivery drivers, pilots, architects and sat navs all use scales. Before a walk, you can measure the route on a map and know if it is 2 km or 20 km.</p>" +
      "<p>For our big question: maps from 200 years ago used scales too. If you could time travel with a modern map, would the distances still be right? Roads move, rivers shift and coastlines wear away. Would you trust the old map or the new one?</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay with a time portal, looking at a map">' + A.portal(70, 75, 54) + A.jay(220, 52, 0.8, "wow") +
      A.bubble(274, 8, 136, 52, "Check the\nscale first!", 280) + '</svg>'
  },

  make: {
    title: "Make a journey card",
    intro: "Pick two places, measure the distance on a map (or make one up), and add the scale. The card works out the real distance. Save it, or send it to Jay.",
    fields: [
      { id: "from", label: "From", ph: "Base 5", max: 26 },
      { id: "to", label: "To", ph: "the seaside", max: 26 },
      { id: "cm", label: "Map distance in cm", ph: "6", max: 6 },
      { id: "per", label: "Scale: 1 cm = how many km?", ph: "2", max: 6 },
      { id: "by", label: "Navigator", ph: "Captain B5", max: 24 }
    ],
    svg: function(v){
      function e(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function cut(t, n){ t = String(t || ""); return t.length > n ? t.slice(0, n - 1) + "." : t; }
      function r2(n){ return Math.round(n * 1000) / 1000; }
      var cm = parseFloat(v.cm), per = parseFloat(v.per), ok = cm > 0 && per > 0 && cm < 100000 && per < 100000;
      var real = ok ? r2(cm * per) + " km" : "?";
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380">' +
        '<rect width="600" height="380" rx="24" fill="#eaf4e4"/>' +
        '<g stroke="#7aa36a" stroke-opacity=".25">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function(i){ return '<path d="M' + i * 50 + ' 0v380"/>'; }).join("") + [1, 2, 3, 4, 5, 6, 7].map(function(i){ return '<path d="M0 ' + i * 50 + 'h600"/>'; }).join("") + '</g>' +
        '<rect x="14" y="14" width="572" height="352" rx="18" fill="none" stroke="#2f5d2a" stroke-width="4"/>' +
        '<text x="40" y="58" font-family="Verdana,Arial,sans-serif" font-size="18" font-weight="700" fill="#2f5d2a" letter-spacing="3">JOURNEY CARD</text>' +
        '<path d="M80 250C180 120 300 300 420 150" fill="none" stroke="#e04848" stroke-width="6" stroke-dasharray="14 9"/>' +
        '<circle cx="80" cy="250" r="14" fill="#8a5cf6" stroke="#141a33" stroke-width="3"/><circle cx="420" cy="150" r="14" fill="#19c39a" stroke="#141a33" stroke-width="3"/>' +
        '<text x="50" y="290" font-family="Verdana,Arial,sans-serif" font-size="18" font-weight="700" fill="#141a33">' + e(cut(v.from, 22)) + '</text>' +
        '<text x="560" y="122" text-anchor="end" font-family="Verdana,Arial,sans-serif" font-size="18" font-weight="700" fill="#141a33">' + e(cut(v.to, 22)) + '</text>' +
        '<rect x="330" y="214" width="230" height="96" rx="12" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
        '<text x="346" y="242" font-family="Verdana,Arial,sans-serif" font-size="15" fill="#141a33">' + e(cut(v.cm, 6)) + ' cm at 1 cm = ' + e(cut(v.per, 6)) + ' km</text>' +
        '<text x="346" y="268" font-family="Verdana,Arial,sans-serif" font-size="15" fill="#141a33">Real distance:</text>' +
        '<text x="346" y="296" font-family="Verdana,Arial,sans-serif" font-size="24" font-weight="700" fill="#c0392b">' + e(real) + '</text>' +
        '<g transform="translate(520 60)"><path d="M0 -24l10 24h-20z" fill="#141a33"/><text y="20" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="15" font-weight="700" fill="#141a33">N</text></g>' +
        '<text x="40" y="350" font-family="Verdana,Arial,sans-serif" font-size="16" fill="#5b6180">Navigator: ' + e(cut(v.by, 24)) + '</text>' +
        '</svg>';
    }
  }
};
})();
