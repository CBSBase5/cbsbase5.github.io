/* Base 5 Autumn 2 activity: Move, balance, control.
   Physical World. Big moves (balance, jumping, throwing) and small moves
   (laces, zips, cutlery, pens). ASCII only. */
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

/* a simple figure: head plus limbs as lines, given joint points */
function person(x, y, p, col){
  col = col || "#2f6f8f";
  function L(a, b, w){ return '<path d="M' + (x + a[0]) + ' ' + (y + a[1]) + 'L' + (x + b[0]) + ' ' + (y + b[1]) + '" stroke="' + col + '" stroke-width="' + (w || 9) + '" stroke-linecap="round"/>'; }
  var hip = p.hip || [0, 0], neck = p.neck || [0, -50];
  return '<g>' +
    L(hip, p.lk || [-8, 34]) + L(p.lk || [-8, 34], p.lf || [-10, 70]) +
    L(hip, p.rk || [8, 34]) + L(p.rk || [8, 34], p.rf || [10, 70]) +
    L(hip, neck, 12) +
    L(neck, p.le || [-20, -28], 8) + L(p.le || [-20, -28], p.lh || [-26, -4], 8) +
    L(neck, p.re || [20, -28], 8) + L(p.re || [20, -28], p.rh || [26, -4], 8) +
    '<circle cx="' + (x + (p.head || [0, -68])[0]) + '" cy="' + (y + (p.head || [0, -68])[1]) + '" r="15" fill="#f6d1b0" stroke="#141a33" stroke-width="2"/>' +
    '</g>';
}
var POSES = {
  together: { lf: [-4, 70], rf: [4, 70], lk: [-4, 34], rk: [4, 34], le: [-12, -26], lh: [-14, 0], re: [12, -26], rh: [14, 0] },
  wide: { lf: [-34, 70], rf: [34, 70], lk: [-18, 34], rk: [18, 34], le: [-30, -46], lh: [-50, -52], re: [30, -46], rh: [50, -52] },
  oneleg: { lf: [-4, 70], lk: [-4, 34], rk: [22, 24], rf: [8, 40], le: [-28, -46], lh: [-46, -54], re: [28, -46], rh: [46, -54] },
  tiptoe: { lf: [-4, 74], rf: [4, 74], lk: [-4, 36], rk: [4, 36], le: [-8, -76], lh: [-10, -100], re: [8, -76], rh: [10, -100], hip: [0, 2] },
  low: { hip: [0, 18], neck: [6, -30], head: [10, -48], lk: [-30, 24], lf: [-34, 70], rk: [30, 24], rf: [34, 70], le: [-30, -16], lh: [-56, -14], re: [36, -16], rh: [60, -14] }
};

/* big moves and small moves */
var BIGSMALL = '<svg viewBox="0 0 520 220" role="img" aria-label="Big moves use big muscles, like jumping. Small moves use hands and fingers, like doing up a zip.">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  '<rect x="16" y="16" width="236" height="188" rx="14" fill="#ffd23f" fill-opacity=".3"/>' +
  '<rect x="268" y="16" width="236" height="188" rx="14" fill="#22b8e6" fill-opacity=".25"/>' +
  person(134, 100, { lf: [-22, 58], rf: [22, 58], lk: [-24, 30], rk: [24, 30], le: [-30, -70], lh: [-40, -92], re: [30, -70], rh: [40, -92] }, "#e07a1f") +
  '<path d="M96 170q38 14 76 0" stroke="#141a33" stroke-width="2.5" fill="none" stroke-dasharray="5 4"/>' +
  T(134, 196, "Big moves", 16, { b: 1, a: "middle" }) +
  /* a hand on a zip */
  '<g transform="translate(386 96)"><rect x="-50" y="-60" width="100" height="120" rx="12" fill="#8a5cf6" stroke="#141a33" stroke-width="2.5"/>' +
  '<path d="M0 -60v120" stroke="#141a33" stroke-width="2"/><path d="M-4 -50h8M-4 -40h8M-4 -30h8M-4 -20h8M-4 -10h8M-4 0h8" stroke="#c8ccd2" stroke-width="3"/>' +
  '<rect x="-7" y="4" width="14" height="22" rx="3" fill="#c8ccd2" stroke="#141a33" stroke-width="2"/>' +
  '<path d="M6 22q24 -10 38 6q6 14 -10 22q-20 6 -32 -6z" fill="#f6d1b0" stroke="#141a33" stroke-width="2"/></g>' +
  T(386, 196, "Small moves", 16, { b: 1, a: "middle" }) + '</svg>';

/* balance stances */
function stances(list){
  return '<svg viewBox="0 0 520 220" role="img" aria-label="Different ways to stand, from wobbly to steady">' +
    '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' + '<path d="M16 178h488" stroke="#141a33" stroke-width="3"/>' +
    list.map(function(it, k){
      var x = 520 / (list.length + 1) * (k + 1);
      var foot = POSES[it[0]];
      var l = foot.lf[0], r = (foot.rf || foot.lf)[0];
      return person(x, 108, POSES[it[0]]) +
        '<path d="M' + (x + Math.min(l, r) - 6) + ' 184h' + (Math.abs(r - l) + 12) + '" stroke="#e04848" stroke-width="5" stroke-linecap="round"/>' +
        T(x, 206, it[1], 14, { b: 1, a: "middle" });
    }).join("") + '</svg>';
}
var STANCES = stances([["together", "A: feet together"], ["wide", "B: feet apart"], ["oneleg", "C: one leg"]]);
var STANCES_SPICY = '<svg viewBox="0 0 520 230" role="img" aria-label="Centre of gravity over the base of support">' +
  '<rect width="520" height="230" rx="16" fill="#f4f1ea"/><path d="M16 186h488" stroke="#141a33" stroke-width="3"/>' +
  person(150, 116, POSES.wide) + '<path d="M110 192h80" stroke="#e04848" stroke-width="6" stroke-linecap="round"/>' +
  '<circle cx="150" cy="104" r="8" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/><path d="M150 112v74" stroke="#141a33" stroke-width="2" stroke-dasharray="5 4"/>' +
  T(150, 216, "Steady: dot over the red", 13, { b: 1, a: "middle" }) +
  '<g transform="rotate(14 370 186)">' + person(370, 116, POSES.together) + '</g>' + '<path d="M354 192h24" stroke="#e04848" stroke-width="6" stroke-linecap="round"/>' +
  '<circle cx="392" cy="104" r="8" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/><path d="M392 112v74" stroke="#141a33" stroke-width="2" stroke-dasharray="5 4"/>' +
  T(370, 216, "Tipping: dot past the red", 13, { b: 1, a: "middle" }) +
  T(260, 34, "Yellow dot: centre of gravity", 13, { a: "middle" }) + T(260, 54, "Red line: base of support", 13, { a: "middle", c: "#e04848" }) + '</svg>';

/* the four parts of a throw */
var THROW = '<svg viewBox="0 0 560 240" role="img" aria-label="Four parts of a throw: ready, step, swing, follow through">' +
  '<rect width="560" height="240" rx="16" fill="#f4f1ea"/><g transform="translate(0 22)"><path d="M16 176h528" stroke="#141a33" stroke-width="3"/>' +
  person(80, 106, { le: [-20, -26], lh: [-12, -6], re: [18, -28], rh: [22, -4] }) + '<circle cx="104" cy="98" r="8" fill="#ff5d5d" stroke="#141a33" stroke-width="2"/>' +
  person(210, 106, { lf: [-34, 70], lk: [-26, 34], rk: [10, 34], rf: [16, 70], le: [-36, -40], lh: [-58, -46], re: [30, -50], rh: [48, -76] }) + '<circle cx="258" cy="26" r="8" fill="#ff5d5d" stroke="#141a33" stroke-width="2"/>' +
  person(340, 106, { lf: [-34, 70], lk: [-26, 34], rk: [10, 34], rf: [16, 70], neck: [-6, -50], head: [-8, -68], le: [-34, -30], lh: [-40, -6], re: [-24, -76], rh: [-40, -96] }) + '<circle cx="302" cy="6" r="8" fill="#ff5d5d" stroke="#141a33" stroke-width="2"/>' +
  person(470, 106, { lf: [-26, 70], lk: [-20, 34], rk: [16, 26], rf: [38, 52], neck: [-14, -46], head: [-20, -62], le: [-30, -20], lh: [-30, 4], re: [-38, -40], rh: [-58, -24] }) +
  [["1 Ready", 80], ["2 Step", 210], ["3 Swing", 340], ["4 Follow through", 470]].map(function(t){ return T(t[1], 204, t[0], 14, { b: 1, a: "middle" }); }).join("") +
  '</g></svg>';

/* jump and land */
var JUMP = '<svg viewBox="0 0 520 270" role="img" aria-label="A jump: bend, swing arms, push, land with soft knees">' +
  '<rect width="520" height="270" rx="16" fill="#f4f1ea"/><g transform="translate(0 50)"><path d="M16 180h488" stroke="#141a33" stroke-width="3"/>' +
  person(80, 110, POSES.low) +
  person(210, 98, { lf: [-6, 70], rf: [6, 70], lk: [-4, 34], rk: [4, 34], le: [-14, -78], lh: [-18, -102], re: [14, -78], rh: [18, -102] }) +
  person(340, 60, { lf: [-20, 50], rf: [24, 54], lk: [-20, 24], rk: [20, 24], le: [-30, -60], lh: [-36, -86], re: [30, -60], rh: [36, -86] }) +
  '<path d="M250 100q50 -90 90 -100q40 10 70 90" fill="none" stroke="#141a33" stroke-width="2" stroke-dasharray="6 5"/>' +
  person(460, 110, POSES.low) + '<path d="M420 186h80" stroke="#19c39a" stroke-width="6" stroke-linecap="round"/>' +
  [["Bend", 80], ["Swing, push", 210], ["Fly", 340], ["Soft landing", 460]].map(function(t){ return T(t[1], 206, t[0], 14, { b: 1, a: "middle" }); }).join("") + '</g></svg>';

/* small skills */
var SMALL = '<svg viewBox="0 0 560 210" role="img" aria-label="Small skills: tying laces, doing a zip, using a knife and fork, holding a pen">' +
  '<rect width="560" height="210" rx="16" fill="#f4f1ea"/>' +
  /* laces */
  '<g transform="translate(76 90)"><path d="M-46 20v-24q0 -8 8 -8h22q8 16 30 18l20 4q12 4 12 14v8h-92z" fill="#ff8a3d" stroke="#141a33" stroke-width="2.5"/>' +
  '<path d="M-6 -14q-26 -30 -6 -34q14 0 6 34q22 -30 34 -18q6 12 -34 18" fill="none" stroke="#fff" stroke-width="4"/><path d="M-6 -14q-26 -30 -6 -34q14 0 6 34q22 -30 34 -18q6 12 -34 18" fill="none" stroke="#141a33" stroke-width="1.5"/></g>' +
  T(76, 180, "Laces", 15, { b: 1, a: "middle" }) +
  /* zip */
  '<g transform="translate(212 90)"><rect x="-34" y="-50" width="68" height="100" rx="10" fill="#8a5cf6" stroke="#141a33" stroke-width="2.5"/><path d="M0 -50v100" stroke="#141a33" stroke-width="2"/>' +
  '<path d="M-4 -40h8M-4 -30h8M-4 -20h8M-4 -10h8M-4 0h8M-4 10h8M-4 20h8M-4 30h8" stroke="#c8ccd2" stroke-width="3"/><rect x="-7" y="22" width="14" height="20" rx="3" fill="#c8ccd2" stroke="#141a33" stroke-width="2"/></g>' +
  T(212, 180, "Zips", 15, { b: 1, a: "middle" }) +
  /* fork and knife */
  '<g transform="translate(348 90)"><ellipse cx="0" cy="18" rx="46" ry="22" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
  '<path d="M-26 -50v40M-32 -50v18q0 6 6 6t6 -6v-18" fill="none" stroke="#5b6180" stroke-width="3.5" stroke-linecap="round"/>' +
  '<path d="M26 -50q10 10 4 40" fill="#c8ccd2" stroke="#5b6180" stroke-width="3"/><path d="M30 -10v20" stroke="#5b6180" stroke-width="4"/></g>' +
  T(348, 180, "Cutlery", 15, { b: 1, a: "middle" }) +
  /* pen */
  '<g transform="translate(484 90) rotate(30)"><rect x="-6" y="-56" width="12" height="96" rx="4" fill="#22b8e6" stroke="#141a33" stroke-width="2.5"/><path d="M-6 40l6 14 6 -14z" fill="#141a33"/>' +
  '<circle cx="-10" cy="22" r="7" fill="#f6d1b0" stroke="#141a33" stroke-width="1.5"/><circle cx="10" cy="22" r="7" fill="#f6d1b0" stroke="#141a33" stroke-width="1.5"/><circle cx="0" cy="10" r="7" fill="#f6d1b0" stroke="#141a33" stroke-width="1.5"/></g>' +
  T(484, 180, "Pens", 15, { b: 1, a: "middle" }) +
  A2ART.egg(A2ART.bird(530, 28, 0.55, "#19c39a"), "Birds tie no laces at all. Jay thinks this is very sensible of them.") +
  '</svg>';

/* bunny ears laces, four little frames */
function laceFrame(k){
  var s = "";
  if(k === 0) s = '<path d="M-30 10l60 -20M30 10l-60 -20" stroke="#ff8a3d" stroke-width="5" stroke-linecap="round"/>';
  if(k === 1) s = '<path d="M-30 10q0 -40 -6 -40q-14 0 6 40" fill="none" stroke="#ff8a3d" stroke-width="5"/><path d="M30 10q0 -40 6 -40q14 0 -6 40" fill="none" stroke="#ff8a3d" stroke-width="5"/>';
  if(k === 2) s = '<path d="M-10 10q-30 -40 -10 -44q10 0 10 24" fill="none" stroke="#ff8a3d" stroke-width="5"/><path d="M10 10q30 -40 10 -44q-10 0 -10 24" fill="none" stroke="#ff8a3d" stroke-width="5"/><path d="M-14 -10q14 10 28 0" fill="none" stroke="#141a33" stroke-width="2"/>';
  if(k === 3) s = '<path d="M0 0q-36 -26 -30 -34q8 -6 30 34q22 -40 30 -34q6 8 -30 34" fill="none" stroke="#ff8a3d" stroke-width="5"/><path d="M0 0l-20 30M0 0l20 30" stroke="#ff8a3d" stroke-width="5" stroke-linecap="round"/>';
  return s;
}
var LACES = '<svg viewBox="0 0 520 190" role="img" aria-label="Bunny ears laces in four steps">' +
  '<rect width="520" height="190" rx="16" fill="#f4f1ea"/>' +
  ["1 Cross and tuck", "2 Make two loops", "3 Cross the loops", "4 Tuck and pull"].map(function(t, k){
    var x = 70 + k * 127;
    return '<rect x="' + (x - 56) + '" y="20" width="112" height="120" rx="12" fill="#fff" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
      '<g transform="translate(' + x + ' 86)">' + laceFrame(k) + '</g>' + T(x, 166, t, 13, { b: 1, a: "middle" });
  }).join("") + '</svg>';

/* the balance timer, for real */
function timerWidget(el, api){
  var d = api.data || {};
  el.innerHTML = '<div class="a2task"><h4>Balance timer</h4><p>Stand somewhere clear, near a wall or a chair in case of wobbles. Tap Start, lift one foot, and tap Stop when your foot touches down. Only if you fancy it.</p>' +
    '<p class="bt" style="font-size:2.4rem;font-weight:700;margin:6px 0">0.0 s</p>' +
    '<div class="qnav"><button type="button" class="btn bl">Start: left foot down</button><button type="button" class="btn br">Start: right foot down</button><button type="button" class="btn btn-quiet bs" disabled>Stop</button></div>' +
    '<p class="bres" style="font-weight:700"></p></div>';
  var out = el.querySelector(".bt"), res = el.querySelector(".bres"), stop = el.querySelector(".bs");
  var t0 = 0, iv = null, which = "";
  function show(){
    res.textContent = (d.left ? "Standing on left: best " + d.left + " s. " : "") + (d.right ? "Standing on right: best " + d.right + " s." : "");
  }
  function go(side){
    if(iv) clearInterval(iv);
    which = side; t0 = Date.now(); stop.disabled = false;
    iv = setInterval(function(){
      if(!document.body.contains(el)){ clearInterval(iv); iv = null; return; }
      out.textContent = ((Date.now() - t0) / 1000).toFixed(1) + " s";
    }, 100);
  }
  el.querySelector(".bl").onclick = function(){ go("left"); };
  el.querySelector(".br").onclick = function(){ go("right"); };
  stop.onclick = function(){
    if(!iv) return;
    clearInterval(iv); iv = null; stop.disabled = true;
    var s = Math.round((Date.now() - t0) / 100) / 10;
    out.textContent = s.toFixed(1) + " s";
    if(!d[which] || s > d[which]) d[which] = s;
    try{ api.save(); }catch(err){}
    show();
    api.done("done");
  };
  show();
}

var TRY = ["Balance: one foot, then the other", "Balance: walk heel to toe along a line", "Jump: as far as you can from standing, with a soft landing", "Throw: a soft ball or rolled up socks at a target, ten goes", "Laces: tie a bow", "Zip: do up a coat zip", "Cutlery: cut something soft with a knife and fork", "Pen: write your name with a tripod grip"];
function tryWidget(el, api){
  var d = api.data || {};
  if(!Array.isArray(d.ticks)) d.ticks = [];
  el.innerHTML = '<div class="a2task"><h4>Try it challenge</h4><p>Pick any you like, in any order, away from the screen. Tick the ones you had a go at. Having a go is the whole point.</p><div class="xlist"></div></div>';
  var list = el.querySelector(".xlist");
  TRY.forEach(function(t, k){
    var lab = document.createElement("label");
    lab.style.cssText = "display:flex;gap:10px;align-items:center;margin:8px 0;font-size:1rem;cursor:pointer";
    var cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = !!d.ticks[k];
    cb.style.cssText = "width:22px;height:22px";
    cb.onchange = function(){ d.ticks[k] = cb.checked; try{ api.save(); }catch(err){} api.done("done"); };
    lab.appendChild(cb); lab.appendChild(document.createTextNode(t));
    list.appendChild(lab);
  });
}

(window.A2PACKS = window.A2PACKS || {})["move-balance-control"] = {
  a2: true,
  id: "a2-move-balance-control",
  title: "Move, balance, control",
  subject: "Physical World",
  bodyClass: "subj-home subj-pillar",
  mins: 20,
  line: "Big moves like balancing, jumping and throwing. Small moves like laces, zips, cutlery and pens.",
  blurb: "How your body does big moves and small moves, and a few tricks that make each one easier. Four short chunks with things to try, and a personal best card to make at the end.",
  note: "Big moves and small moves: balance, jumping, throwing, laces, zips and pens. Four five minute chunks and a try it challenge, whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Wobbly", line: "Wobbly: the main tricks for each move, one at a time." },
    { id: "medium", name: "Steady", line: "Steady: why the tricks work, and putting steps in order." },
    { id: "spicy", name: "Rock solid", line: "Rock solid: centre of gravity, force and timing." }
  ],
  themes: {
    time: { name: "Time travel", w: { target: "the portal", ball: "beanbag", place: "the time machine" } },
    football: { name: "Football", w: { target: "the goal", ball: "football", place: "the changing room" } },
    horror: { name: "Horror", w: { target: "the haunted well", ball: "pumpkin beanbag", place: "the night porter's office" } },
    fishing: { name: "Fishing", w: { target: "the bait bucket", ball: "beanbag", place: "the tackle shed" } },
    music: { name: "Music", w: { target: "the big drum", ball: "beanbag", place: "the dressing room" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: BIGSMALL,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Big moves, small moves", title: "Your body does big moves and small moves",
      fig: BIGSMALL,
      html: "<p><b>Big moves</b> use the big muscles in your legs, arms and middle: balancing, jumping, throwing, running.</p>" +
        "<p><b>Small moves</b> use your hands and fingers: laces, zips, buttons, cutlery and pens.</p>" +
        "<p>Both get easier with tricks and practice. Everyone finds some easier than others. Jay is great at throwing and terrible at tiny buttons.</p>",
      lv: { spicy: { html: "<p><b>Gross motor skills</b> are big moves using large muscle groups: balancing, jumping, throwing, running.</p>" +
          "<p><b>Fine motor skills</b> are small, precise moves of the hands and fingers: laces, zips, cutlery, writing.</p>" +
          "<p>Most real tasks mix the two. Catching a ball needs big moves to get there, and small moves to close your fingers at the right time. Jay is great at throwing and terrible at tiny buttons.</p>" } } },

    { type: "sort", topic: "Big moves, small moves",
      q: "Big move or small move?",
      buckets: ["Big move", "Small move"],
      cards: [["Jumping over a puddle", 0], ["Doing up a zip", 1], ["Throwing a [[ball]]", 0], ["Tying laces", 1], ["Standing on one leg", 0], ["Writing your name", 1]],
      hint: "Does it use your whole body, or mainly your fingers?",
      why: "Jumping, throwing and balancing use the whole body. Zips, laces and writing are mostly fingers.",
      lv: { spicy: { q: "Gross motor or fine motor?", buckets: ["Gross motor", "Fine motor"],
        cards: [["Jumping over a puddle", 0], ["Doing up a zip", 1], ["Throwing a [[ball]]", 0], ["Threading a needle", 1], ["Walking along a low wall", 0], ["Cutting with a knife and fork", 1], ["Climbing stairs", 0]] } } },

    { type: "mc", topic: "Big moves, small moves",
      q: "Which one needs <b>both</b> big moves and small moves?",
      options: ["Catching a ball", "Standing still", "Sleeping"],
      answer: 0,
      slips: { 1: "Standing still uses a little balance, but your fingers are not doing much.", 2: "Very restful. Not many moves at all." },
      hint: "Which one needs your body to get there and your fingers to grip?",
      why: "You move your body to where the ball is going, then close your fingers round it. Big and small together." },

    { type: "multi", topic: "Big moves, small moves",
      q: "Which of these could help <b>any</b> move get easier? Pick all that fit.",
      options: ["Practising a little, often", "Breaking it into small steps", "Watching someone do it slowly", "Only trying once"],
      answers: [0, 1, 2],
      slips: { any: "Think about how you got good at something you can already do." },
      hint: "Think about how you got good at something you can already do.",
      why: "Little and often, small steps, and watching slowly all help. One go is a start, not the end." },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Balance", title: "Tricks for balance",
      fig: STANCES,
      html: "<p>Three tricks make balancing easier:</p>" +
        "<p><b>Feet apart</b>: a wider base is steadier. <b>Arms out</b>: they help you correct wobbles. <b>Eyes on one spot</b>: pick something still to look at.</p>" +
        "<p>The red line under each person shows how much ground their feet cover. The wider it is, the steadier they are.</p>",
      lv: { spicy: { fig: STANCES_SPICY,
        html: "<p>Your <b>centre of gravity</b> is the point where your weight balances, usually just below your belly button. Your <b>base of support</b> is the ground your feet cover.</p>" +
          "<p>You stay balanced while your centre of gravity is above your base. Lean past the edge and you tip.</p>" +
          "<p>So: widen your base (feet apart), lower your centre of gravity (bend your knees), and use your arms to shift weight back over the middle. Eyes on one still spot help your brain keep track.</p>" } } },

    { type: "mc", topic: "Balance",
      q: "Look at the three people. Who is the steadiest?",
      fig: STANCES,
      options: ["B: feet apart", "A: feet together", "C: one leg"], fixed: true,
      answer: 0,
      slips: { 1: "Feet together gives a small base. Look at the red lines.", 2: "One leg is the smallest base of all. Look at the red lines." },
      hint: "Look at how long each red line is.",
      why: "B has the widest base, so B is the steadiest. That is why surfers and goalkeepers stand with feet apart.",
      lv: { spicy: { q: "Someone on a moving bus starts to wobble. Which change helps most, and why?",
        fig: STANCES_SPICY,
        options: ["Feet apart and knees bent: wider base, lower centre of gravity", "Stand on tiptoes: it makes you lighter", "Feet together: it keeps you neat", "Look at the moving traffic outside"],
        slips: { 1: "Tiptoes shrink your base and raise your centre of gravity. Wobblier.", 2: "Feet together makes the base smaller, so it is easier to tip.", 3: "Moving things confuse your balance. A still spot works better." },
        hint: "Think about the base and the centre of gravity.",
        why: "A wider base and a lower centre of gravity keep the yellow dot over the red line, even when the bus jolts." } } },

    { type: "multi", topic: "Balance",
      q: "You are standing on one leg. Pick <b>all</b> the things that would help.",
      options: ["Arms out to the sides", "Eyes on one still spot", "A slight bend in the standing knee", "Spinning round", "Shutting your eyes"],
      answers: [0, 1, 2],
      slips: { any: "Arms, eyes and knees can all help. Which ones calm the wobble, and which ones add to it?" },
      hint: "Which ones calm the wobble, and which ones add to it?",
      why: "Arms out, a still spot and soft knees all help. Spinning and shutting your eyes make balance much harder.",
      lv: { mild: { q: "Standing on one leg. Pick the <b>two</b> things that help.",
        options: ["Arms out to the sides", "Eyes on one still spot", "Spinning round", "Shutting your eyes"], answers: [0, 1],
        why: "Arms out and eyes on one spot help. Spinning and shutting your eyes make it harder." } } },

    { type: "widget", topic: "Balance", unscored: true,
      title: "Try it: one leg balance",
      html: "<p>If you are somewhere you can stand up, have a go. If not, save it for later.</p>",
      mount: timerWidget,
      report: function(d){ return d && (d.left || d.right) ? "Balance: left " + (d.left || "-") + " s, right " + (d.right || "-") + " s." : ""; } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Jump and throw", title: "Jumps and throws have steps",
      routes: [
        { name: "Throw", fig: THROW, html: "<p>A good throw has four parts:</p><p><b>1 Ready:</b> stand side on, eyes on [[target]]. <b>2 Step:</b> step forward with the <b>opposite</b> foot to your throwing arm. <b>3 Swing:</b> bring the arm over fast. <b>4 Follow through:</b> let your arm keep going towards the target.</p>" },
        { name: "Jump", fig: JUMP, html: "<p>A good standing jump:</p><p><b>Bend</b> your knees. <b>Swing</b> your arms back, then forward and up as you <b>push</b>. <b>Land soft</b>: bend your knees as your feet touch down, like a spring.</p>" }
      ],
      lv: { spicy: { routes: [
        { name: "Throw", fig: THROW, html: "<p>A throw passes power up the body like a whip: <b>legs, hips, shoulder, arm, hand</b>.</p><p>Stepping with the <b>opposite</b> foot lets your hips turn, so the power from your legs reaches the arm. The <b>follow through</b> keeps the arm speeding up right until the release, instead of braking early.</p>" },
        { name: "Jump", fig: JUMP, html: "<p>Bending first loads your leg muscles like a spring. The arm swing adds upward force at just the right moment.</p><p>Landing with bent knees spreads the stopping force over a longer time, so each bit of that time has less force. Stiff legs stop you in a split second, and your joints feel all of it.</p>" }
      ] } } },

    { type: "order", topic: "Jump and throw",
      q: "Put the four parts of a throw in order.",
      items: ["Ready: side on, eyes on [[target]]", "Step with the opposite foot", "Swing the arm over", "Follow through towards [[target]]"],
      hint: "You get ready first and follow through last.",
      why: "Ready, step, swing, follow through. Unhand me, goblin: that [[ball]] is going in." },

    { type: "mc", topic: "Jump and throw",
      q: "You throw with your right arm. Which foot steps forward?",
      fig: THROW,
      options: ["Left foot", "Right foot", "Both feet together"],
      answer: 0,
      slips: { 1: "Same side feels natural, but it blocks your hips from turning. Try the opposite foot.", 2: "Feet together means no step, so you lose the power from your legs." },
      hint: "It is the opposite foot to the throwing arm.",
      why: "Right arm, left foot. The opposite foot lets your body turn and add power." },

    { type: "mc", topic: "Jump and throw", explain: true,
      q: "Why do you bend your knees when you land from a jump?",
      fig: JUMP,
      options: ["To soak up the bump, like a spring", "To look cool", "So you can jump again straight away"],
      answer: 0,
      slips: { 1: "It might look cool, but there is a better reason. Think about your knees.", 2: "That can help a bit, but the main reason is the landing itself." },
      hint: "Think about what straight, stiff legs would feel like on landing.",
      why: "Bent knees soak up the bump, so your joints do not take a big jolt.",
      lv: { spicy: { q: "Why does landing with bent knees protect your joints?",
        options: ["It makes the stopping take longer, so the force at each moment is smaller", "It makes you lighter as you land", "It stops gravity working", "It makes the ground softer"],
        slips: { 1: "Your weight stays the same whatever your knees do.", 2: "Gravity keeps working the whole time.", 3: "The ground does not change. Your legs do." },
        hint: "Think about stopping quickly versus stopping slowly.",
        why: "Same amount of stopping, spread over a longer time, so the force at any one moment is smaller." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Small skills", title: "Small skills have tricks too",
      fig: SMALL,
      html: "<p><b>Laces:</b> the bunny ears way makes two loops and ties them. <b>Zips:</b> hook the bottom in, hold it with one hand, pull up with the other. " +
        "<b>Cutlery:</b> fork holds still, knife saws gently. <b>Pens:</b> a <b>tripod grip</b>, with the pen resting on the middle finger and pinched by the thumb and first finger.</p>" +
        "<p>If a small skill is tricky, tools can help too: a chunky pen grip, elastic laces, a zip puller. More on that another day.</p>" },

    { type: "order", topic: "Small skills",
      q: "Bunny ears laces. Put the steps in order.",
      fig: LACES,
      items: ["Cross the laces and tuck one under", "Make two loops, like bunny ears", "Cross the loops over", "Tuck one loop through and pull both tight"],
      hint: "Look at the four pictures.",
      why: "Cross and tuck, two loops, cross the loops, tuck and pull." },

    { type: "match", topic: "Small skills",
      q: "Match each small skill to its trick.",
      pairs: [["Zip", "Hold the bottom still, pull up"], ["Knife and fork", "Fork holds, knife saws"], ["Pen", "Tripod grip"], ["Laces", "Two bunny ear loops"]],
      hint: "Think about what each hand is doing.",
      why: "Each small skill has a trick. Lots of them are about one hand holding still while the other moves.",
      lv: { spicy: { pairs: [["Zip", "Hold the bottom still, pull up"], ["Knife and fork", "Fork holds, knife saws"], ["Pen", "Tripod grip"], ["Laces", "Two bunny ear loops"], ["Buttons", "Push halfway, pinch from the other side"]] } } },

    { type: "mc", topic: "Small skills",
      q: "In a lot of small skills, what is the <b>other</b> hand doing?",
      options: ["Holding things still", "Nothing at all", "Waving"],
      answer: 0,
      slips: { 1: "Watch someone do a zip. The other hand is busy.", 2: "That would make the zip very tricky." },
      hint: "Think of the zip, or the fork.",
      why: "One hand holds still, the other does the fiddly bit. The fork holds while the knife cuts. The bottom of the zip is held while the other hand pulls.",
      lv: { spicy: { q: "Writing gets tiring fast. Which is the most likely fix to try first?",
        options: ["Loosen the grip and rest the side of the hand on the table", "Press harder so the pen does not slip", "Write faster to finish sooner", "Hold the pen right at the very top"],
        slips: { 1: "Pressing harder makes the hand muscles tire faster.", 2: "Speed usually means tighter muscles and messier writing.", 3: "Holding at the top gives you less control, not more." },
        hint: "Tired hands usually mean muscles working too hard.",
        why: "A lighter grip and a resting hand let the small muscles do less work, so they tire more slowly." } } },

    { type: "widget", topic: "Small skills", unscored: true,
      title: "Try it challenge",
      html: "<p>Away from the screen, whenever you are ready. Results can go to Jay with the rest if you send it.</p>",
      mount: tryWidget,
      report: function(d){ var n = d && d.ticks ? d.ticks.filter(Boolean).length : 0; return n ? "Try it challenge: had a go at " + n + " of " + TRY.length + "." : ""; } }
  ],

  realWorld: {
    title: "Where you use this",
    html: "<p>Every day, all day: getting dressed, eating, carrying shopping, getting on a moving bus. Jobs use it too: chefs, builders, nurses, mechanics and footballers all rely on balance and control.</p>" +
      "<p>For our big question: if we could time travel, should we? Imagine stepping out of a time machine onto a wobbly old ship deck. Feet apart, knees bent, eyes on the horizon.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay balancing next to a time portal">' + A2ART.portal(80, 75, 58) + A2ART.jay(240, 46, 0.85, "wink") +
      A2ART.bubble(290, 6, 120, 52, "Feet apart,\nknees bent.", 294) + '</svg>'
  },

  make: {
    title: "Make a personal best card",
    intro: "Write down what you tried and how it went. Beat it next time, or do not. Send it to Jay if you like.",
    fields: [
      { id: "big", label: "A big move I tried", ph: "One leg balance: 12 seconds", max: 40 },
      { id: "small", label: "A small move I tried", ph: "Tied a bow on my laces", max: 40 },
      { id: "trick", label: "My best trick", ph: "Eyes on one spot", max: 40 },
      { id: "name", label: "Name on the card", ph: "Captain Steady", max: 24 }
    ],
    svg: function(v){
      function rows(y, label, txt, col){
        var ls = wrap(txt, 40, 2);
        return '<rect x="30" y="' + y + '" width="540" height="84" rx="14" fill="' + col + '" fill-opacity=".3"/>' +
          T(50, y + 24, label, 14, { b: 1, c: "#5b6180" }) + ls.map(function(l, k){ return T(50, y + 48 + k * 24, esc(l), 18, { b: 1 }); }).join("");
      }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">' +
        '<rect width="600" height="420" rx="24" fill="#fffdf6"/>' +
        '<rect x="12" y="12" width="576" height="396" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        T(30, 56, "PERSONAL BEST", 26, { b: 1, c: "#e07a1f" }) +
        '<g transform="translate(530 42)"><path d="M-22 -16h44v12a22 22 0 0 1 -44 0z" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/><path d="M0 18v8M-12 28h24" stroke="#141a33" stroke-width="3"/></g>' +
        rows(76, "Big move", v.big, "#ffd23f") +
        rows(168, "Small move", v.small, "#22b8e6") +
        rows(260, "Best trick", v.trick, "#19c39a") +
        T(30, 380, "Mover: " + esc(wrap(v.name, 24, 1)[0] || ""), 20, { b: 1 }) +
        '</svg>';
    }
  }
};
})();
