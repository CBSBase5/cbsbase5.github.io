/* Base 5 Autumn 2 activity: Room plans.
   Maths. Perimeter and area of rectangles, such as rooms and floor plans. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, extra){ return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (/fill=/.test(extra || "") ? "" : ' fill="#141a33"') + ' ' + (extra || "") + '>' + s + '</text>'; }
var SQ = "m&#178;";

/* a room drawn on a grid of 1 m squares.
   o.edge: colour the outline; o.fill: colour the squares; o.nums: number the squares;
   o.lab: write the side lengths; o.q: label the bottom and right sides "?"; o.extra: more drawing */
function grid(c, r, o){
  o = o || {};
  var s = o.s || 34, x0 = 56, y0 = 34, W = c * s, H = r * s;
  var vw = o.vw || Math.max(W + 140, 320), vh = H + 90;
  var out = '<svg viewBox="0 0 ' + vw + ' ' + vh + '" style="max-height:300px" role="img" aria-label="A room ' + c + ' squares long and ' + r + ' squares wide">' +
    '<rect width="' + vw + '" height="' + vh + '" rx="14" fill="#f4f1ea"/>';
  for(var i = 0; i < r; i++) for(var j = 0; j < c; j++){
    out += '<rect x="' + (x0 + j * s) + '" y="' + (y0 + i * s) + '" width="' + s + '" height="' + s + '" fill="' + (o.fill || "#fffbe9") + '" fill-opacity="' + (o.fill ? ".55" : "1") + '" stroke="#141a33" stroke-opacity=".25" stroke-width="1.5"/>';
    if(o.nums) out += T(x0 + j * s + s / 2, y0 + i * s + s / 2 + 5, String(i * c + j + 1), 13, 'text-anchor="middle"');
  }
  out += '<rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + H + '" fill="none" stroke="' + (o.edge || "#141a33") + '" stroke-width="' + (o.edge ? 6 : 3) + '" stroke-linejoin="round"/>';
  if(o.lab){
    out += T(x0 + W / 2, y0 - 10, c + " m", 15, 'text-anchor="middle" font-weight="700"') +
      T(x0 - 10, y0 + H / 2 + 5, r + " m", 15, 'text-anchor="end" font-weight="700"') +
      T(x0 + W / 2, y0 + H + 26, o.q ? "? m" : c + " m", 15, 'text-anchor="middle" font-weight="700"') +
      T(x0 + W + 10, y0 + H / 2 + 5, o.q ? "? m" : r + " m", 15, 'font-weight="700"');
  }
  if(o.key) out += T(x0, vh - 12, "Each square is 1 m by 1 m", 13, 'fill-opacity=".75"');
  return out + (o.extra || "") + '</svg>';
}

/* a plain rectangle with its sides labelled (not to scale for big numbers) */
function rect(top, side, o){
  o = o || {};
  var w = o.w || 240, h = o.h || 130, x0 = 90, y0 = 36;
  return '<svg viewBox="0 0 440 ' + (h + 90) + '" style="max-height:260px" role="img" aria-label="A rectangle ' + top + ' by ' + side + '">' +
    '<rect width="440" height="' + (h + 90) + '" rx="14" fill="#f4f1ea"/>' +
    '<rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + h + '" fill="' + (o.fill || "#e8f7ff") + '" stroke="#141a33" stroke-width="4"/>' +
    T(x0 + w / 2, y0 - 10, top, 15, 'text-anchor="middle" font-weight="700"') +
    T(x0 - 10, y0 + h / 2 + 5, side, 15, 'text-anchor="end" font-weight="700"') +
    (o.q ? T(x0 + w / 2, y0 + h + 26, o.q[0], 15, 'text-anchor="middle" font-weight="700" fill="#c0392b"') + T(x0 + w + 10, y0 + h / 2 + 5, o.q[1], 15, 'font-weight="700" fill="#c0392b"') : "") +
    (o.name ? T(x0 + w / 2, y0 + h / 2 + 5, o.name, 15, 'text-anchor="middle"') : "") +
    (o.extra || "") + '</svg>';
}

/* the perimeter walk, with Bonnie doing the walking */
var WALK = grid(5, 3, { vw: 470, edge: "#ff8a1f", lab: true, key: true, extra:
  '<path d="M150 26l12 8 -12 8" fill="none" stroke="#ff8a1f" stroke-width="3"/>' +
  '<path d="M218 70l8 12 8 -12" fill="none" stroke="#ff8a1f" stroke-width="3"/>' +
  '<path d="M150 128l-12 8 12 8" fill="none" stroke="#ff8a1f" stroke-width="3"/>' +
  A.bonnie(330, 62, 0.6, "stand") +
  T(300, 120, "5 + 3 + 5 + 3", 15, 'font-weight="700"') + T(300, 142, "= 16 m", 15, 'font-weight="700" fill="#c25e00"') });

/* edge, inside or across */
var WHICH = '<svg viewBox="0 0 520 170" role="img" aria-label="Three rooms: A has its edge marked, B has its inside shaded, C has a line across it">' +
  '<rect width="520" height="170" rx="14" fill="#f4f1ea"/>' +
  [0, 1, 2].map(function(k){
    var x = 30 + k * 165;
    return '<rect x="' + x + '" y="30" width="130" height="90" fill="' + (k === 1 ? "#19c39a" : "#fffbe9") + '" fill-opacity="' + (k === 1 ? ".6" : "1") + '" stroke="' + (k === 0 ? "#ff8a1f" : "#141a33") + '" stroke-width="' + (k === 0 ? 7 : 2) + '"/>' +
      (k === 2 ? '<path d="M' + x + ' 75h130" stroke="#ff8a1f" stroke-width="6"/>' : "") +
      T(x + 65, 150, "ABC".charAt(k), 18, 'text-anchor="middle" font-weight="700"');
  }).join("") + '</svg>';

/* two rooms side by side */
function two(a, b, la, lb){
  var s = 30;
  function one(x, d, lab){
    var out = "";
    for(var i = 0; i < d[1]; i++) for(var j = 0; j < d[0]; j++) out += '<rect x="' + (x + j * s) + '" y="' + (40 + i * s) + '" width="' + s + '" height="' + s + '" fill="#fffbe9" stroke="#141a33" stroke-opacity=".25"/>';
    return out + '<rect x="' + x + '" y="40" width="' + d[0] * s + '" height="' + d[1] * s + '" fill="none" stroke="#141a33" stroke-width="3"/>' +
      T(x, 28, lab, 15, 'font-weight="700"');
  }
  return '<svg viewBox="0 0 520 220" style="max-height:240px" role="img" aria-label="Room A and Room B">' +
    '<rect width="520" height="220" rx="14" fill="#f4f1ea"/>' + one(40, a, la) + one(300, b, lb) + '</svg>';
}

/* the floor plan of [[place]]: 10 m by 6 m, three rooms. o.grid draws 1 m squares; o.hide leaves labels off */
function plan(o){
  o = o || {};
  var s = 32, x0 = 70, y0 = 46, hide = o.hide || {};
  var out = '<svg viewBox="0 0 470 300" style="max-height:320px" role="img" aria-label="A floor plan of [[place]] with three rooms">' +
    '<rect width="470" height="300" rx="14" fill="#eef3fb"/>';
  if(o.grid){
    for(var i = 0; i < 6; i++) for(var j = 0; j < 10; j++) out += '<rect x="' + (x0 + j * s) + '" y="' + (y0 + i * s) + '" width="' + s + '" height="' + s + '" fill="#fff" stroke="#3a6fb0" stroke-opacity=".25"/>';
  } else out += '<rect x="' + x0 + '" y="' + y0 + '" width="320" height="192" fill="#fff"/>';
  out += '<rect x="' + x0 + '" y="' + y0 + '" width="192" height="192" fill="#ffd23f" fill-opacity=".22"/>' +
    '<rect x="' + (x0 + 192) + '" y="' + y0 + '" width="128" height="128" fill="#22b8e6" fill-opacity=".18"/>' +
    '<rect x="' + (x0 + 192) + '" y="' + (y0 + 128) + '" width="128" height="64" fill="#ff5d8f" fill-opacity=".18"/>' +
    '<rect x="' + x0 + '" y="' + y0 + '" width="320" height="192" fill="none" stroke="#1d3557" stroke-width="5"/>' +
    '<path d="M' + (x0 + 192) + ' ' + y0 + 'v192M' + (x0 + 192) + ' ' + (y0 + 128) + 'h128" stroke="#1d3557" stroke-width="4"/>' +
    /* doors: gaps with a swing */
    '<path d="M' + (x0 + 192) + ' ' + (y0 + 150) + 'v26" stroke="#eef3fb" stroke-width="6"/><path d="M' + (x0 + 192) + ' ' + (y0 + 150) + 'q-24 0 -24 26" fill="none" stroke="#1d3557" stroke-width="1.5"/>' +
    '<path d="M' + (x0 + 80) + ' ' + (y0 + 192) + 'h32" stroke="#eef3fb" stroke-width="7"/>' +
    T(x0 + 96, y0 + 100, "[[Room]]", 14, 'text-anchor="middle" font-weight="700"') +
    T(x0 + 256, y0 + 68, "[[Room2]]", 13, 'text-anchor="middle" font-weight="700"') +
    T(x0 + 256, y0 + 166, "[[Room3]]", 13, 'text-anchor="middle" font-weight="700"');
  function lab(k, x, y, t, anchor){ if(!hide[k]) out += T(x, y, t, 15, 'text-anchor="' + (anchor || "middle") + '" font-weight="700" fill="#1d3557"'); }
  lab("top1", x0 + 96, y0 - 10, "6 m");
  lab("top2", x0 + 256, y0 - 10, "4 m");
  lab("left", x0 - 10, y0 + 101, "6 m", "end");
  lab("right2", x0 + 330, y0 + 69, "4 m", "start");
  lab("right3", x0 + 330, y0 + 165, "2 m", "start");
  lab("bottom", x0 + 160, y0 + 222, "10 m");
  if(o.key) out += T(x0, 292, "Each square is 1 m by 1 m", 13, 'fill-opacity=".75"');
  out += A.egg(A.bird(440, 30, 0.6, "#3a8fd6"), "A bird on the roof, checking the plan from above. Jay says every building needs one.");
  return out + '</svg>';
}

/* widget: tap two corners to build a room, see its perimeter and area */
function mountBuilder(el, api){
  var C = 12, R = 8;
  var d = api.data; d.rooms = d.rooms || [];
  var goals = {
    mild: { t: "Challenge, if you like: make a room with an area of 6 " + SQ + ".", ok: function(w, h){ return w * h === 6; } },
    medium: { t: "Challenge, if you like: make a room with an area of 24 " + SQ + " and a perimeter of 20 m.", ok: function(w, h){ return w * h === 24 && 2 * (w + h) === 20; } },
    spicy: { t: "Challenge, if you like: make a room with an area of 36 " + SQ + " and the smallest perimeter you can.", ok: function(w, h){ return w * h === 36 && w === h; } }
  };
  var goal = goals[api.level] || goals.medium;
  el.innerHTML = '<p class="tiny">' + goal.t + ' Each square is 1 m by 1 m.</p>' +
    '<div class="rbgrid" style="display:grid;grid-template-columns:repeat(' + C + ',1fr);gap:2px;max-width:440px;margin:6px auto"></div>' +
    '<p class="rbout" aria-live="polite" style="text-align:center;min-height:2.8em;margin:8px 0">Tap a square for one corner of your room.</p>' +
    '<p class="rblist tiny" style="text-align:center;margin:0"></p>';
  var gw = el.querySelector(".rbgrid"), out = el.querySelector(".rbout"), list = el.querySelector(".rblist");
  var cells = [], a = null, box = null;
  for(var r = 0; r < R; r++) for(var c = 0; c < C; c++){
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Row " + (r + 1) + ", column " + (c + 1));
    b.style.cssText = "aspect-ratio:1;min-height:26px;padding:0;border:1px solid #c9c2b2;border-radius:4px;background:#fffbe9;cursor:pointer";
    (function(rr, cc){ b.onclick = function(){ tap(rr, cc); }; })(r, c);
    gw.appendChild(b); cells.push(b);
  }
  function paint(){
    cells.forEach(function(b, k){
      var r = Math.floor(k / C), c = k % C, inBox = box && r >= box.r0 && r <= box.r1 && c >= box.c0 && c <= box.c1;
      b.style.background = inBox ? "#9be3c6" : (a && !box && a.r === r && a.c === c) ? "#ffd23f" : "#fffbe9";
    });
  }
  function showList(){
    list.innerHTML = d.rooms.length ? "Rooms you have made: " + d.rooms.map(function(x){ return x.w + " by " + x.h; }).join(", ") : "";
  }
  function tap(r, c){
    try{
      if(!a || box){ a = { r: r, c: c }; box = null; paint(); out.textContent = "Now tap the opposite corner."; return; }
      box = { r0: Math.min(a.r, r), r1: Math.max(a.r, r), c0: Math.min(a.c, c), c1: Math.max(a.c, c) };
      var w = box.c1 - box.c0 + 1, h = box.r1 - box.r0 + 1, P = 2 * (w + h), Ar = w * h;
      paint();
      out.innerHTML = "<b>" + w + " m by " + h + " m.</b> Perimeter: " + w + " + " + h + " + " + w + " + " + h + " = <b>" + P + " m</b>. Area: " + w + " &#215; " + h + " = <b>" + Ar + " " + SQ + "</b>." +
        (goal.ok(w, h) || goal.ok(h, w) ? "<br>That meets the challenge. Jay would call that outrageous (in a good way)." : "");
      d.rooms.push({ w: w, h: h });
      if(d.rooms.length > 8) d.rooms.shift();
      showList();
      api.save();
      if(!api.resolved()) api.done("done");
    }catch(e){ out.textContent = "Tap a square to start again."; }
  }
  showList();
}

(window.A2PACKS = window.A2PACKS || {})["room-plans"] = {
  a2: true,
  id: "a2-room-plans",
  title: "Room plans",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 25,
  line: "Round the edge is the perimeter. The floor inside is the area.",
  blurb: "Perimeter and area of rooms and floor plans. Four short chunks, with a room builder to play with and a room plan card to make at the end.",
  note: "Working out the edge and the floor space of rooms on a plan. Four five minute chunks, a room builder to play with, and a plan card at the end. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Shed", line: "Shed: rooms on a grid, counting edges and squares." },
    { id: "medium", name: "House", line: "House: real room sizes in metres, adding and multiplying." },
    { id: "spicy", name: "Mansion", line: "Mansion: decimals, mixed units, missing sides and working backwards." }
  ],
  themes: {
    time: { name: "Time travel", w: { place: "the time lab", room: "control room", room2: "portal room", room3: "store", who: "the time traveller", edge: "glowing tape", cover: "metal floor panels" } },
    football: { name: "Football", w: { place: "the clubhouse", room: "changing room", room2: "physio room", room3: "kit room", who: "the manager", edge: "white line paint", cover: "artificial grass" } },
    horror: { name: "Horror", w: { place: "the haunted hotel", room: "ballroom", room2: "cellar", room3: "lift lobby", who: "the night porter", edge: "creepy fairy lights", cover: "dusty carpet" } },
    fishing: { name: "Fishing", w: { place: "the boat house", room: "tackle shop", room2: "bait room", room3: "drying room", who: "the angler", edge: "rope", cover: "decking boards" } },
    music: { name: "Music", w: { place: "the theatre", room: "rehearsal room", room2: "dressing room", room3: "costume store", who: "the stage manager", edge: "stage lights", cover: "dance floor" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: plan({}),
  steps: [

    /* ---------- chunk 1: perimeter ---------- */
    { type: "learn", topic: "Round the edge", title: "Perimeter: all the way round",
      fig: WALK,
      ez: { title: "Perimeter", html: "<p>The <b>perimeter</b> is all the way round the edge.</p><p>5 + 3 + 5 + 3 = <b>16 m</b></p>" },
      html: "<p>The <b>perimeter</b> is the distance all the way round the edge of a shape. Think of a fence, or Bonnie walking round the walls.</p>" +
        "<p>[[Who]] wants [[edge]] round the walls of the [[room]]. It is 5 m long and 3 m wide. Walk round it: 5 + 3 + 5 + 3 = <b>16 m</b>.</p>" +
        "<p>Opposite walls of a rectangle match, so two numbers tell you all four walls.</p>",
      lv: {
        mild: { html: "<p>The <b>perimeter</b> is the distance all the way round the edge. Think of a fence, or Bonnie walking round the walls.</p>" +
          "<p>Each little side of a square is 1 m. Count them as you go round: 5 along the top, 3 down, 5 along the bottom, 3 up.</p>" +
          "<p>5 + 3 + 5 + 3 = <b>16 m</b>. That is how much [[edge]] [[who]] needs for the [[room]].</p>" },
        spicy: { html: "<p>The <b>perimeter</b> is the distance all the way round the edge.</p>" +
          "<p>For a rectangle there is a shortcut: add the length and the width, then double. 2 &#215; (5 + 3) = <b>16 m</b>.</p>" +
          "<p>It works with decimals too: a room 4.5 m by 3 m has perimeter 2 &#215; (4.5 + 3) = 2 &#215; 7.5 = <b>15 m</b>.</p>" +
          "<p>Watch the units: if one side is in cm and one in m, change them to match first.</p>" } } },

    { type: "mc", topic: "Round the edge",
      q: "Which picture shows the perimeter?",
      fig: WHICH,
      options: ["A: the line all round the edge", "B: the space inside", "C: a line across the middle"],
      answer: 0, fixed: true,
      slips: { 1: "The space inside is the area. That is the next chunk.", 2: "A line across does not go round the edge. Perimeter goes all the way round." },
      hint: "Perimeter is like a fence round a field.",
      why: "The perimeter is the edge, all the way round, like a fence.",
      ez: { slips: { 1: "The inside is the area.", 2: "Perimeter goes all the way round." }, hint: "Like a fence round a field.", why: "The perimeter is the edge, all the way round." },
      lv: { spicy: { q: "A rectangular room has a perimeter of 20 m. Which could be its size?", fig: "", fixed: false,
        options: ["6 m by 4 m", "10 m by 10 m", "5 m by 4 m", "10 m by 2 m"],
        slips: { 1: "10 + 10 = 20 is only two walls. All four walls would make 40 m.", 2: "5 + 4 + 5 + 4 = 18 m. Just short.", 3: "10 + 2 + 10 + 2 = 24 m." },
        hint: "Add the length and the width, then double.",
        why: "2 &#215; (6 + 4) = 2 &#215; 10 = <b>20 m</b>." } } },

    { type: "num", topic: "Round the edge",
      q: "The [[room2]] is 7 m long and 4 m wide. Fill in the missing walls, then add all four.",
      fig: rect("7 m", "4 m", { q: ["? m", "? m"], name: "[[Room2]]" }),
      boxes: [{ label: "Bottom wall", a: 7, post: "m" }, { label: "Right wall", a: 4, post: "m" }, { label: "Perimeter: 7 + 4 + 7 + 4 =", a: 22, post: "m" }],
      slips: [[2, 11, "11 m is two walls. Add all four: 7 + 4 + 7 + 4."], [2, 28, "28 is 7 &#215; 4, which is the area. For the edge, add."]],
      hint: "Opposite walls match. The bottom matches the top.",
      why: "Bottom 7 m, right 4 m. 7 + 4 + 7 + 4 = <b>22 m</b>.",
      ez: { q: "Count round the edge. Each little side is 1 m.", slips: [[8, "8 is inside. Count round the edge."], [6, "Keep going all the way round."]], hint: "4 along, 2 down, 4 along, 2 up." },
      lv: {
        mild: { q: "Count round the edge of this rug. Each little side is 1 m. The first few are counted for you.",
          fig: grid(4, 2, { edge: "#ff8a1f", key: true, extra: T(73, 26, "1", 13, 'text-anchor="middle" font-weight="700" fill="#c25e00"') + T(107, 26, "2", 13, 'text-anchor="middle" font-weight="700" fill="#c25e00"') + T(141, 26, "3", 13, 'text-anchor="middle" font-weight="700" fill="#c25e00"') }),
          boxes: [{ label: "Perimeter", a: 12, post: "m" }],
          slips: [[8, "8 is the squares inside. Count the little sides round the edge."], [6, "That is the top and one side. Keep going all the way round."]],
          hint: "4 along the top, 2 down the side, 4 along the bottom, 2 up.",
          why: "4 + 2 + 4 + 2 = <b>12 m</b>." },
        spicy: { q: "The [[room2]] is 6.5 m long and 4 m wide. Use the shortcut.",
          fig: rect("6.5 m", "4 m", { name: "[[Room2]]" }),
          boxes: [{ label: "Length + width", a: 10.5, post: "m" }, { label: "Double it: perimeter", a: 21, post: "m" }],
          slips: [[1, 10.5, "That is half way round. Double it for all four walls."], [1, 26, "26 is 6.5 &#215; 4, the area. For the edge, add then double."]],
          hint: "6.5 + 4 first, then times 2.",
          why: "6.5 + 4 = 10.5, and 2 &#215; 10.5 = <b>21 m</b>." } } },

    { type: "num", topic: "Round the edge", explain: true,
      q: "[[Who]] wants [[edge]] all round the [[room3]]. It is 8 m long and 5 m wide. How much is needed?",
      fig: rect("8 m", "5 m", { name: "[[Room3]]" }),
      boxes: [{ label: "Perimeter", a: 26, post: "m" }],
      slips: [[13, "13 m covers two walls. Double it for all four."], [40, "40 is 8 &#215; 5, the area. The edge needs adding."]],
      hint: "8 + 5 + 8 + 5.",
      why: "8 + 5 + 8 + 5 = <b>26 m</b>.",
      ez: { q: "A rug is 3 m by 2 m. How far round is it?", slips: [[5, "Keep going round."], [6, "6 is inside. Count round the edge."]] },
      lv: {
        mild: { q: "A rug is 3 m long and 2 m wide. How far is it all the way round?",
          fig: grid(3, 2, { lab: true, key: true }),
          boxes: [{ label: "Perimeter", a: 10, post: "m" }],
          slips: [[5, "5 m is the top and one side. Keep going round."], [6, "6 is the squares inside. Count round the edge."]],
          hint: "3 + 2 + 3 + 2.",
          why: "3 + 2 + 3 + 2 = <b>10 m</b>." },
        spicy: { q: "The [[room3]] is 450 cm long and 3 m wide. Find the perimeter in metres.",
          fig: rect("450 cm", "3 m", { name: "[[Room3]]" }),
          boxes: [{ label: "Perimeter", a: 15, post: "m" }],
          slips: [[906, "450 is in cm and 3 is in m. Change 450 cm to 4.5 m first."], [13.5, "13.5 is the area. Perimeter adds the sides."], [7.5, "That is one length and one width. Double it."]],
          hint: "100 cm = 1 m, so 450 cm = 4.5 m.",
          why: "450 cm = 4.5 m. 2 &#215; (4.5 + 3) = <b>15 m</b>." } } },

    /* ---------- chunk 2: area ---------- */
    { type: "learn", topic: "Covering the floor", title: "Area: the squares inside",
      fig: grid(5, 3, { fill: "#19c39a", nums: true, lab: true, key: true }),
      ez: { title: "Area", html: "<p>The <b>area</b> is the squares inside.</p><p>Each square is 1 " + SQ + ". 3 rows of 5 is <b>15</b>.</p>" },
      html: "<p>The <b>area</b> is how much floor there is: the number of squares it takes to cover it.</p>" +
        "<p>This floor is 5 m long and 3 m wide. That is 3 rows of 5 squares: 5 &#215; 3 = <b>15 square metres</b>, written 15 " + SQ + ".</p>" +
        "<p><b>Area of a rectangle = length &#215; width.</b></p>",
      lv: {
        mild: { html: "<p>The <b>area</b> is how much floor there is. Count the squares that cover it.</p>" +
          "<p>Each square is 1 m by 1 m. We call it 1 <b>square metre</b>, written 1 " + SQ + ".</p>" +
          "<p>Count them: there are <b>15</b>. A quicker way: 3 rows of 5 is 15.</p>" },
        spicy: { html: "<p>The <b>area</b> is the space inside: how many 1 m by 1 m squares cover the floor.</p>" +
          "<p><b>Area = length &#215; width.</b> Here 5 &#215; 3 = 15 " + SQ + ".</p>" +
          "<p>Decimals work the same way, and part squares count too: a floor 2.5 m by 4 m is 2.5 &#215; 4 = <b>10 " + SQ + "</b>.</p>" +
          "<p>Units matter: m is a length, " + SQ + " is an area. Both sides must be in the same unit before you multiply.</p>" } } },

    { type: "num", topic: "Covering the floor",
      q: "The [[room]] is 6 m long and 4 m wide. How many square metres of [[cover]] would cover the floor?",
      fig: rect("6 m", "4 m", { fill: "#d9f5ea", name: "[[Room]]" }),
      boxes: [{ label: "Area", a: 24, post: SQ }],
      slips: [[20, "20 m is the perimeter, round the edge. Area multiplies."], [10, "6 + 4 = 10. For area, multiply: 6 &#215; 4."]],
      hint: "Length &#215; width.",
      why: "6 &#215; 4 = <b>24 " + SQ + "</b>.",
      ez: { slips: [[14, "That is round the edge. Count inside."], [7, "Count every square. Or 3 rows of 4."]] },
      lv: {
        mild: { q: "Count the squares. Each one is 1 " + SQ + ". What is the area?",
          fig: grid(4, 3, { fill: "#19c39a", key: true }),
          boxes: [{ label: "Area", a: 12, post: SQ }],
          slips: [[14, "14 is the count round the edge. Count the squares inside."], [7, "4 + 3 = 7. Count every square, or do 3 rows of 4."]],
          hint: "3 rows of 4.",
          why: "3 rows of 4 squares: <b>12 " + SQ + "</b>." },
        spicy: { q: "The [[room]] is 5.5 m long and 4 m wide. What is its area?",
          fig: rect("5.5 m", "4 m", { fill: "#d9f5ea", name: "[[Room]]" }),
          slips: [[19, "19 m is the perimeter."], [9.5, "5.5 + 4. Multiply instead."], [20, "Check the half: 5.5 &#215; 4 is 5 &#215; 4 plus 0.5 &#215; 4."]],
          boxes: [{ label: "Area", a: 22, post: SQ }],
          hint: "5 &#215; 4 = 20, and half of 4 is 2.",
          why: "5.5 &#215; 4 = 20 + 2 = <b>22 " + SQ + "</b>." } } },

    { type: "sort", topic: "Covering the floor",
      q: "Is each job about the edge or the inside? Sort them.",
      ez: { q: "Edge or inside? Sort them.", hint: "A line round, or filling the space?", why: "Fences go round: perimeter. Floors fill: area." },
      buckets: ["Perimeter (round the edge)", "Area (covers the inside)"],
      cards: [["[[Edge]] round the walls", 0], ["[[Cover]] for the floor", 1], ["A fence round a garden", 0], ["Paint for a ceiling", 1], ["Tiles for a bathroom floor", 1], ["A frame round a picture", 0]],
      hint: "Is it a line round the outside, or does it fill the space?",
      why: "Fences, frames and [[edge]] go round the edge: perimeter. Floors, ceilings and tiles fill the space: area.",
      lv: {
        mild: { cards: [["[[Edge]] round the walls", 0], ["[[Cover]] for the floor", 1], ["A fence round a garden", 0], ["Paint for a ceiling", 1]] },
        spicy: { cards: [["[[Edge]] round the walls", 0], ["[[Cover]] for the floor", 1], ["Skirting board round a room", 0], ["Turf for a lawn", 1], ["Ribbon round a cake", 0], ["Wallpaper for one wall", 1], ["A hedge round a field", 0]],
          why: "Skirting, ribbon and hedges follow the edge: perimeter. Turf, floors and wallpaper cover a surface: area (yes, a wall has an area too)." } } },

    { type: "num", topic: "Covering the floor",
      q: "The [[room2]] is 9 m long and 4 m wide. Find its area.",
      fig: rect("9 m", "4 m", { fill: "#d9f5ea", name: "[[Room2]]" }),
      boxes: [{ label: "Area", a: 36, post: SQ }],
      slips: [[26, "26 m is the perimeter."], [13, "9 + 4. Multiply for area."]],
      hint: "9 &#215; 4.",
      why: "9 &#215; 4 = <b>36 " + SQ + "</b>.",
      ez: { q: "What is the area of this mat?", slips: [[14, "That is round the edge. Count inside."], [7, "Try 2 rows of 5."]] },
      lv: {
        mild: { q: "What is the area of this mat? Count the squares, or count the rows.",
          fig: grid(5, 2, { fill: "#22b8e6", key: true }),
          boxes: [{ label: "Area", a: 10, post: SQ }],
          slips: [[14, "14 is round the edge. Count the squares inside."], [7, "5 + 2. Try 2 rows of 5 instead."]],
          hint: "2 rows of 5.",
          why: "2 rows of 5: <b>10 " + SQ + "</b>." },
        spicy: { q: "The [[room2]] is 3.2 m long and 2.5 m wide. Find its area.",
          fig: rect("3.2 m", "2.5 m", { fill: "#d9f5ea", name: "[[Room2]]" }),
          boxes: [{ label: "Area", a: 8, post: SQ }],
          slips: [[11.4, "11.4 m is the perimeter."], [5.7, "3.2 + 2.5. Multiply instead."], [6.4, "That is 3.2 &#215; 2. Add on 3.2 &#215; 0.5 too."]],
          hint: "3.2 &#215; 2 = 6.4, and 3.2 &#215; 0.5 = 1.6.",
          why: "6.4 + 1.6 = <b>8 " + SQ + "</b>." } } },

    { type: "mc", topic: "Covering the floor",
      q: "Room A is 6 m by 4 m. Room B is 5 m by 5 m. They have the same perimeter, 20 m. Which has more floor?",
      fig: two([6, 4], [5, 5], "Room A: 6 m by 4 m", "Room B: 5 m by 5 m"),
      options: ["Room A", "Room B", "They are the same"],
      answer: 1, fixed: true,
      slips: { 0: "Room A is 6 &#215; 4 = 24 " + SQ + ". Work out Room B as well.", 2: "Their perimeters match, but the floor inside does not. Try length &#215; width for each." },
      hint: "Work out length &#215; width for both.",
      why: "A: 6 &#215; 4 = 24 " + SQ + ". B: 5 &#215; 5 = 25 " + SQ + ". Same edge, different floor. Squarer rooms hold more.",
      ez: { q: "Same edge. Which room has more squares inside?", slips: { 0: "A has 8. Now count B.", 2: "A has 8. B has 9." }, why: "A has 8. B has 9. B has more floor." },
      lv: {
        mild: { q: "Room A and Room B have the same edge: 12 m each. Which has more squares inside?",
          fig: two([4, 2], [3, 3], "Room A", "Room B"),
          slips: { 0: "Count Room A: 2 rows of 4 is 8. Now count Room B.", 2: "Count them both: A has 8, B has 9." },
          hint: "Count the squares in each.",
          why: "A has 8 squares. B has 9. Same edge, but B has more floor." },
        spicy: { q: "Room A is 8 m by 2.5 m. Room B is 5.5 m by 5 m. Both have a perimeter of 21 m. Which has more floor?",
          fig: "",
          slips: { 0: "8 &#215; 2.5 = 20 " + SQ + ". Now try 5.5 &#215; 5.", 2: "Same perimeter does not mean same area: 20 " + SQ + " and 27.5 " + SQ + "." },
          why: "A: 8 &#215; 2.5 = 20 " + SQ + ". B: 5.5 &#215; 5 = 27.5 " + SQ + ". The squarer room wins by 7.5 " + SQ + "." } } },

    /* ---------- chunk 3: floor plans ---------- */
    { type: "learn", topic: "Reading a floor plan", title: "A map of a building, from above",
      fig: plan({}),
      ez: { title: "Floor plans", html: "<p>A <b>floor plan</b> shows a building from above.</p><p>Each square is 1 m by 1 m.</p>" },
      html: "<p>A <b>floor plan</b> is a drawing of a building seen from above, like a bird would see it with the roof off. Lengths are written along the walls.</p>" +
        "<p>This is [[place]]. The whole building is 10 m by 6 m, split into three rooms.</p>" +
        "<p>If a length is missing, look across: <b>opposite walls match</b>, and the parts along one side add up to the whole side.</p>",
      lv: {
        mild: { fig: plan({ grid: true, key: true }),
          html: "<p>A <b>floor plan</b> is a drawing of a building from above, like a bird would see it with the roof off.</p>" +
            "<p>This is [[place]]. Each square on the plan is 1 m by 1 m, so you can count lengths and squares.</p>" +
            "<p>The [[room]] is 6 squares wide and 6 squares tall.</p>" },
        spicy: { fig: plan({ hide: { top2: 1, right3: 1 } }),
          html: "<p>A <b>floor plan</b> is a drawing of a building from above. Lengths are written along the walls, but plans often leave some off.</p>" +
            "<p>This is [[place]]: 10 m by 6 m, with three rooms. Two lengths are missing on purpose.</p>" +
            "<p>Use the whole sides: the bottom wall is 10 m and the [[room]] takes 6 m of it, so the rooms on the right are 10 &#8722; 6 = <b>4 m</b> wide. Work out the rest the same way.</p>" } } },

    { type: "num", topic: "Reading a floor plan",
      q: "What is the perimeter of the [[room2]]? It is 4 m by 4 m.",
      fig: plan({}),
      boxes: [{ label: "Perimeter", a: 16, post: "m" }],
      slips: [[8, "8 m is two walls. Add all four."], [10, "10 m is the whole building's bottom wall. Just the [[room2]] here."]],
      hint: "4 + 4 + 4 + 4.",
      why: "4 + 4 + 4 + 4 = <b>16 m</b>.",
      ez: { q: "How wide is the [[room]]? Count along the top.", slips: [[10, "That is the whole building."], [4, "That is the [[room2]]. Look left."]], hint: "Count along the top of the yellow room." },
      lv: {
        mild: { q: "How wide is the [[room]]? Count the squares along its top wall.",
          fig: plan({ grid: true, key: true }),
          boxes: [{ label: "Width", a: 6, post: "m" }],
          slips: [[10, "10 m is the whole building. Count just above the [[room]]."], [4, "4 m is the [[room2]]. Look at the big room on the left."]],
          hint: "Count the squares along the top of the yellow room.",
          why: "The [[room]] is <b>6 m</b> wide." },
        spicy: { q: "The plan does not say how tall the [[room3]] is. Work it out.",
          fig: plan({ hide: { top2: 1, right3: 1 } }),
          boxes: [{ label: "Height of the [[room3]]", a: 2, post: "m" }],
          slips: [[4, "4 m is the [[room2]] above it. The two together make the 6 m side."], [6, "6 m is the whole side. Take off the [[room2]]'s 4 m."]],
          hint: "The right side is 6 m in total.",
          why: "6 &#8722; 4 = <b>2 m</b>." } } },

    { type: "num", topic: "Reading a floor plan",
      q: "What is the area of the [[room]]? It is 6 m by 6 m.",
      fig: plan({}),
      boxes: [{ label: "Area", a: 36, post: SQ }],
      slips: [[24, "24 m is its perimeter."], [12, "6 + 6. Multiply for area."]],
      hint: "6 &#215; 6.",
      why: "6 &#215; 6 = <b>36 " + SQ + "</b>.",
      ez: { slips: [[12, "That is round the edge. Count inside."], [6, "Count every square. 2 rows of 4."]], hint: "The pink room. 2 rows of 4." },
      lv: {
        mild: { q: "Count the squares in the [[room3]]. What is its area?",
          fig: plan({ grid: true, key: true }),
          boxes: [{ label: "Area", a: 8, post: SQ }],
          slips: [[12, "12 is round its edge. Count the squares inside."], [6, "4 + 2. Count every square: 2 rows of 4."]],
          hint: "It is the pink room. 2 rows of 4.",
          why: "2 rows of 4: <b>8 " + SQ + "</b>." },
        spicy: { q: "What is the area of the [[room3]]?",
          fig: plan({ hide: { top2: 1, right3: 1 } }),
          boxes: [{ label: "Area", a: 8, post: SQ }],
          slips: [[24, "That is 4 &#215; 6, but the [[room3]] is not the full 6 m tall. It is 2 m."], [12, "12 m is its perimeter."], [16, "16 " + SQ + " is the [[room2]] above it."]],
          hint: "You found its height. Its width matches the [[room2]].",
          why: "4 m by 2 m: 4 &#215; 2 = <b>8 " + SQ + "</b>." } } },

    { type: "num", topic: "Reading a floor plan", explain: true,
      q: "What is the area of the whole of [[place]]? Add up the three rooms, or use the whole building.",
      fig: plan({}),
      boxes: [{ label: "Area", a: 60, post: SQ }],
      slips: [[32, "32 m is the perimeter of the whole building."], [16, "10 + 6. Multiply for area."], [52, "Check the [[room3]]: 4 &#215; 2 = 8."]],
      hint: "10 &#215; 6, or 36 + 16 + 8.",
      why: "10 &#215; 6 = 60. Or 36 + 16 + 8 = 60. Both give <b>60 " + SQ + "</b>.",
      ez: { q: "Area of the [[room2]]? Try 4 rows of 4.", slips: [[8, "That is 2 rows. There are 4."], [4, "That is 1 row. There are 4."]], hint: "The blue room." },
      lv: {
        mild: { q: "What is the area of the [[room2]]? Count, or use 4 rows of 4.",
          fig: plan({ grid: true, key: true }),
          boxes: [{ label: "Area", a: 16, post: SQ }],
          slips: [[8, "That is two rows. There are 4 rows of 4."], [4, "That is one row. There are 4 rows of 4."]],
          hint: "It is the blue room.",
          why: "4 rows of 4: <b>16 " + SQ + "</b>." },
        spicy: { q: "What percentage of the whole floor is the [[room]]?",
          fig: plan({ hide: { top2: 1, right3: 1 } }),
          boxes: [{ label: "Percentage", a: 60, post: "%" }],
          slips: [[36, "36 " + SQ + " is its area. Compare it with the whole floor: 36 out of 60."], [40, "40% is the other two rooms together."]],
          hint: "Whole floor: 10 &#215; 6 = 60. Then 36 out of 60.",
          why: "36 &#247; 60 = 0.6, which is <b>60%</b>." } } },

    /* ---------- chunk 4: design your own ---------- */
    { type: "widget", topic: "Design a room", unscored: true,
      title: "Room builder",
      html: "<p>Tap one corner square, then the opposite corner, to draw a room. The builder works out its perimeter and area. Have a go at the challenge, or just play.</p>",
      ez: { html: "<p>Tap 2 corners to make a room. See its perimeter and area.</p>" },
      mount: mountBuilder },

    { type: "num", topic: "Design a room",
      q: "[[Who]] needs a [[room3]] with an area of 30 " + SQ + ". It is 6 m long. How wide must it be?",
      fig: rect("6 m", "? m", { fill: "#d9f5ea", name: "30 " + SQ }),
      boxes: [{ label: "Width", a: 5, post: "m" }],
      slips: [[24, "30 &#8722; 6 takes away. Think: 6 times what makes 30?"], [180, "That is 30 &#215; 6. Divide instead."]],
      hint: "6 &#215; ? = 30.",
      why: "30 &#247; 6 = <b>5 m</b>. Check: 6 &#215; 5 = 30.",
      ez: { q: "A rug: area 12 " + SQ + ", 4 m long. How wide?", slips: [[8, "How many rows of 4 make 12?"], [48, "That multiplies. How many rows of 4 make 12?"]], hint: "4, 8, 12. How many rows?", why: "3 rows of 4 make 12. So <b>3 m</b>." },
      lv: {
        mild: { q: "A rug has an area of 12 " + SQ + ". It is 4 m long. How wide is it?",
          fig: grid(4, 1, { fill: "#ffd23f", key: true, extra: T(210, 70, "rows of 4 ...", 14, 'font-weight="700"') }),
          boxes: [{ label: "Width", a: 3, post: "m" }],
          slips: [[8, "12 take away 4 is 8. Think rows: how many rows of 4 make 12?"], [48, "That multiplies. How many rows of 4 make 12?"]],
          hint: "4, 8, 12. How many rows is that?",
          why: "3 rows of 4 make 12, so it is <b>3 m</b> wide." },
        spicy: { q: "A room has a perimeter of 30 m. It is 9 m long. How wide is it?",
          fig: rect("9 m", "? m", { fill: "#d9f5ea", name: "P = 30 m" }),
          slips: [[21, "30 &#8722; 9 takes off one wall. Two walls are 9 m: 30 &#8722; 18 = 12, then halve."], [12, "12 m is both widths together. Halve it."], [15, "15 is half the perimeter: length + width. Now take off the 9."]],
          boxes: [{ label: "Width", a: 6, post: "m" }],
          hint: "Half the perimeter is length + width.",
          why: "30 &#247; 2 = 15, and 15 &#8722; 9 = <b>6 m</b>." } } },

    { type: "mc", topic: "Design a room",
      q: "Which unit is right for the area of a room?",
      options: ["" + SQ + " (square metres)", "m (metres)", "kg (kilograms)", "ml (millilitres)"],
      answer: 0,
      slips: { 1: "Metres measure a length, like the perimeter.", 2: "Kilograms measure weight.", 3: "Millilitres measure liquid." },
      hint: "Area is counted in squares.",
      why: "Area counts squares, so it is square metres, " + SQ + ".",
      ez: { q: "Which unit is right for area?", slips: { 1: "Metres are for length.", 2: "Kilograms are for weight.", 3: "Millilitres are for liquid." }, hint: "Area counts squares.", why: "Area counts squares: " + SQ + "." },
      lv: { spicy: { q: "A floor is 4 m by 3 m, which is 12 " + SQ + ". How many cm&#178; is that?",
        options: ["120 000 cm&#178;", "1 200 cm&#178;", "12 000 cm&#178;", "120 cm&#178;"],
        slips: { 1: "That multiplies by 100 once. But 1 " + SQ + " is 100 cm by 100 cm, which is 10 000 cm&#178;.", 2: "Close. 1 " + SQ + " is 100 &#215; 100 = 10 000 cm&#178;, so 12 " + SQ + " is 120 000.", 3: "That only multiplies by 10." },
        hint: "Change the sides to cm first: 400 cm by 300 cm.",
        why: "400 &#215; 300 = <b>120 000 cm&#178;</b>. Each " + SQ + " holds 10 000 cm&#178;." } } },

    { type: "text", topic: "Design a room", stretch: true,
      q: "In your own words, what is the difference between perimeter and area?",
      ez: { q: "What is the difference between perimeter and area?", slips: [[["same"], "One goes round. One fills the space."]], model: "Perimeter is round the edge. Area is the space inside.", hint: "A fence, and a carpet.", why: "Perimeter goes round, like a fence. Area fills, like a carpet." },
      need: [["edge", "round", "around", "outside", "border", "fence"], ["inside", "cover", "squares", "space", "floor", "fill"]],
      model: "Perimeter is the distance round the edge, and area is the space inside.",
      slips: [[["same"], "They sound alike, but one is a line round the edge and the other fills the space."]],
      hint: "One is like a fence. The other is like a carpet.",
      why: "Perimeter goes round the edge (a fence). Area fills the inside (a carpet)." }
  ],

  realWorld: {
    title: "Plans are how buildings get made",
    html: "<p>Architects, builders, carpet fitters and estate agents use plans like these every day. Before a floor is laid, someone works out the area. Before a fence goes up, someone works out the perimeter.</p>" +
      "<p>And for our big question: if you could time travel to watch a castle being built, the builders would be pacing out walls and counting squares, just like you. Would you go back to check their sums?</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to a time portal, holding a plan">' + A.portal(70, 75, 54) + A.jay(220, 52, 0.8, "smile") +
      A.bubble(276, 8, 132, 52, "Measure twice,\ncut once.", 282) + '</svg>'
  },

  ez: {
    realWorld: { title: "Plans build buildings", html: "<p>Builders and carpet fitters use plans every day.</p><p>Area for floors. Perimeter for fences.</p>" },
    make: { intro: "Design a room. The card works out the rest." }
  },

  make: {
    title: "Make a room plan card",
    intro: "Design a room: give it a name and a size. The card draws it and works out the perimeter and area for you. Save it, or send it to Jay.",
    fields: [
      { id: "room", label: "Room name", ph: "Bonnie's dream bedroom", max: 40 },
      { id: "len", label: "Length in metres", ph: "5", max: 6 },
      { id: "wid", label: "Width in metres", ph: "4", max: 6 },
      { id: "by", label: "Designed by", ph: "Architect B5", max: 24 }
    ],
    svg: function(v){
      function e(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n){ if(cur.trim()) out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, 2).map(function(l){ return l.length > n ? l.slice(0, n - 1) + "." : l; }); }
      function r2(n){ return Math.round(n * 100) / 100; }
      var L = parseFloat(v.len), W = parseFloat(v.wid);
      var ok = L > 0 && W > 0 && L < 10000 && W < 10000;
      var name = wrap(v.room || "My room", 24);
      var bx = 40, by = 152, bw = 300, bh = 166, drawing;
      if(ok){
        var k = Math.min(bw / L, bh / W), w = L * k, h = W * k, x = bx + (bw - w) / 2, y = by + (bh - h) / 2;
        drawing = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#d9f5ea" stroke="#1d3557" stroke-width="5"/>' +
          '<text x="' + (x + w / 2) + '" y="' + (y - 8) + '" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="15" font-weight="700" fill="#1d3557">' + e(r2(L)) + ' m</text>' +
          '<text x="' + (x - 8) + '" y="' + (y + h / 2 + 5) + '" text-anchor="end" font-family="Verdana,Arial,sans-serif" font-size="15" font-weight="700" fill="#1d3557">' + e(r2(W)) + ' m</text>';
      } else {
        drawing = '<rect x="' + (bx + 40) + '" y="' + (by + 30) + '" width="220" height="130" fill="none" stroke="#1d3557" stroke-width="3" stroke-dasharray="10 8"/>' +
          '<text x="' + (bx + 150) + '" y="' + (by + 100) + '" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="15" fill="#1d3557">Pop in a length and width</text>';
      }
      var P = ok ? r2(2 * (L + W)) + " m" : "?", Ar = ok ? r2(L * W) + " m&#178;" : "?";
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380">' +
        '<rect width="600" height="380" rx="24" fill="#eef3fb"/>' +
        '<g stroke="#3a6fb0" stroke-opacity=".15">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function(i){ return '<path d="M' + i * 50 + ' 0v380"/>'; }).join("") + [1, 2, 3, 4, 5, 6, 7].map(function(i){ return '<path d="M0 ' + i * 50 + 'h600"/>'; }).join("") + '</g>' +
        '<rect x="14" y="14" width="572" height="352" rx="18" fill="none" stroke="#1d3557" stroke-width="4"/>' +
        '<text x="40" y="56" font-family="Verdana,Arial,sans-serif" font-size="18" font-weight="700" fill="#3a6fb0" letter-spacing="3">ROOM PLAN</text>' +
        name.map(function(l, i){ return '<text x="40" y="' + (90 + i * 30) + '" font-family="Verdana,Arial,sans-serif" font-size="26" font-weight="700" fill="#1d3557">' + e(l) + '</text>'; }).join("") +
        drawing +
        '<rect x="370" y="150" width="200" height="120" rx="12" fill="#fff" stroke="#1d3557" stroke-width="2.5"/>' +
        '<text x="386" y="184" font-family="Verdana,Arial,sans-serif" font-size="16" fill="#1d3557">Perimeter</text>' +
        '<text x="386" y="210" font-family="Verdana,Arial,sans-serif" font-size="22" font-weight="700" fill="#c25e00">' + P + '</text>' +
        '<text x="386" y="238" font-family="Verdana,Arial,sans-serif" font-size="16" fill="#1d3557">Area</text>' +
        '<text x="386" y="262" font-family="Verdana,Arial,sans-serif" font-size="22" font-weight="700" fill="#1f9d63">' + Ar + '</text>' +
        '<text x="40" y="350" font-family="Verdana,Arial,sans-serif" font-size="16" fill="#5b6180">Designed by: ' + e(String(v.by || "").slice(0, 24)) + '</text>' +
        '</svg>';
    }
  }
};
})();
