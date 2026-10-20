/* Base 5 Autumn 2 activity: What makes it stand?
   Aesthetic and Creative. Triangles, wide bases, strong joints, good
   materials and loads, ending with a build challenge card. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, extra){ return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 15) + '" fill="#141a33"' + (extra || "") + '>' + s + '</text>'; }
function line(x1, y1, x2, y2, col, w){ return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + (col || "#8a5a2b") + '" stroke-width="' + (w || 7) + '" stroke-linecap="round"/>'; }
function dot(x, y, col){ return '<circle cx="' + x + '" cy="' + y + '" r="7" fill="' + (col || "#ff5d8f") + '" stroke="#141a33" stroke-width="2"/>'; }
function arrow(x1, y, x2, col){ var d = x2 > x1 ? -10 : 10; return '<path d="M' + x1 + ' ' + y + 'H' + x2 + 'M' + (x2 + d) + ' ' + (y - 8) + 'L' + x2 + ' ' + y + 'L' + (x2 + d) + ' ' + (y + 8) + '" stroke="' + (col || "#e04848") + '" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; }

/* a square folds over, a triangle stays put */
var SHAPES =
  '<svg viewBox="0 0 520 220" role="img" aria-label="A square frame pushed sideways leans over. A triangle frame pushed sideways stays the same shape.">' +
  '<rect width="520" height="220" rx="16" fill="#eef6ff"/>' +
  '<path d="M60 170h140M60 170l40 -100h140" stroke="none"/>' +
  '<path d="M70 170L190 170L230 60L110 60Z" fill="none" stroke="#141a33" stroke-opacity=".35" stroke-width="4" stroke-dasharray="8 6"/>' +
  line(70, 170, 190, 170) + line(70, 170, 70, 50) + line(190, 170, 190, 50) + line(70, 50, 190, 50) +
  dot(70, 170) + dot(190, 170) + dot(70, 50) + dot(190, 50) + arrow(10, 50, 58) +
  T(70, 205, "Square: leans over", 15, ' font-weight="700"') +
  line(320, 170, 460, 170) + line(320, 170, 390, 50) + line(460, 170, 390, 50) +
  dot(320, 170) + dot(460, 170) + dot(390, 50) + arrow(300, 50, 376) +
  T(318, 205, "Triangle: stays put", 15, ' font-weight="700"') +
  '<path d="M0 186h520" stroke="#7a5532" stroke-width="3"/>' +
  '</svg>';

/* a bridge frame made of triangles: n sections along the bottom */
function truss(n){
  var w = 400 / n, x0 = 60, yb = 150, yt = 60, s = "";
  for(var k = 0; k < n; k++) s += line(x0 + k * w, yb, x0 + (k + 1) * w, yb, "#8a5a2b", 6);
  for(var k2 = 0; k2 < n - 1; k2++) s += line(x0 + (k2 + 0.5) * w, yt, x0 + (k2 + 1.5) * w, yt, "#8a5a2b", 6);
  for(var j = 0; j < n; j++){ s += line(x0 + j * w, yb, x0 + (j + 0.5) * w, yt, "#b07a40", 6) + line(x0 + (j + 0.5) * w, yt, x0 + (j + 1) * w, yb, "#b07a40", 6); }
  for(var p = 0; p <= n; p++) s += dot(x0 + p * w, yb, "#ffd23f");
  for(var q = 0; q < n; q++) s += dot(x0 + (q + 0.5) * w, yt, "#ffd23f");
  return '<svg viewBox="0 0 520 200" role="img" aria-label="A bridge frame made of triangles">' +
    '<rect width="520" height="200" rx="16" fill="#e8f7ff"/>' +
    '<path d="M0 170q130 -18 260 0t260 0v30H0z" fill="#22b8e6" fill-opacity=".45"/>' +
    '<rect x="20" y="150" width="40" height="50" fill="#9aa3b8"/><rect x="460" y="150" width="40" height="50" fill="#9aa3b8"/>' + s +
    '</svg>';
}

/* a frame with three sections, one of them only squares */
var FRAME =
  '<svg viewBox="0 0 520 240" role="img" aria-label="A tall frame in three sections. Section A has triangles, section B is only squares, section C has triangles.">' +
  '<rect width="520" height="240" rx="16" fill="#f4f1ea"/>' +
  (function(){
    var s = "", xs = [150, 270], ys = [210, 150, 90, 30];
    for(var k = 0; k < 4; k++) s += line(150, ys[k], 270, ys[k]);
    s += line(150, 210, 150, 30) + line(270, 210, 270, 30);
    s += line(150, 210, 270, 150, "#b07a40") + line(270, 90, 150, 30, "#b07a40");
    ys.forEach(function(y){ s += dot(150, y, "#ffd23f") + dot(270, y, "#ffd23f"); });
    s += T(300, 186, "C", 22, ' font-weight="700"') + T(300, 126, "B", 22, ' font-weight="700"') + T(300, 66, "A", 22, ' font-weight="700"');
    return s;
  })() +
  '<path d="M0 214h520" stroke="#7a5532" stroke-width="3"/>' +
  T(340, 140, "Which part", 15) + T(340, 160, "will wobble?", 15) +
  '</svg>';

/* three towers: tall and thin, middling, short and wide */
var BASES =
  '<svg viewBox="0 0 520 230" role="img" aria-label="Three towers. A is tall and thin. B is medium. C is short with a wide base.">' +
  '<rect width="520" height="230" rx="16" fill="#eef6ff"/>' +
  '<path d="M0 196h520" stroke="#7a5532" stroke-width="4"/>' +
  '<rect x="80" y="36" width="30" height="160" fill="#ff8a5c" stroke="#141a33" stroke-width="3"/>' +
  '<path d="M240 196L262 96h36l22 100z" fill="#ffd23f" stroke="#141a33" stroke-width="3"/>' +
  '<path d="M370 196L410 136h40l40 60z" fill="#19c39a" stroke="#141a33" stroke-width="3"/>' +
  T(87, 220, "A", 18, ' font-weight="700"') + T(272, 220, "B", 18, ' font-weight="700"') + T(422, 220, "C", 18, ' font-weight="700"') +
  A2ART.egg(A2ART.bird(98, 24, 0.6, "#3a8fd6"), "A bird on the wobbliest tower. It is not worried: it can fly.") +
  '</svg>';

/* centre of mass: one stays, one falls */
var TIPS =
  '<svg viewBox="0 0 520 240" role="img" aria-label="Two leaning blocks. In A the dot is above the base. In B the dot is past the edge of the base.">' +
  '<rect width="520" height="240" rx="16" fill="#f4f1ea"/>' +
  '<path d="M0 200h520" stroke="#7a5532" stroke-width="4"/>' +
  '<g transform="rotate(-14 160 200)"><rect x="110" y="70" width="100" height="130" fill="#22b8e6" fill-opacity=".55" stroke="#141a33" stroke-width="3"/></g>' +
  '<circle cx="185" cy="132" r="8" fill="#e04848"/><path d="M185 132V200" stroke="#e04848" stroke-width="3" stroke-dasharray="6 5"/>' +
  '<path d="M110 206h100" stroke="#141a33" stroke-width="5"/>' +
  '<g transform="rotate(-34 420 200)"><rect x="390" y="40" width="60" height="160" fill="#ff8a5c" fill-opacity=".6" stroke="#141a33" stroke-width="3"/></g>' +
  '<circle cx="465" cy="140" r="8" fill="#e04848"/><path d="M465 140V200" stroke="#e04848" stroke-width="3" stroke-dasharray="6 5"/>' +
  '<path d="M370 206h55" stroke="#141a33" stroke-width="5"/>' +
  T(150, 230, "A", 18, ' font-weight="700"') + T(400, 230, "B", 18, ' font-weight="700"') +
  T(14, 28, "Red dot: centre of mass. Black bar: the base.", 14) +
  '</svg>';

/* three joints */
var JOINTS =
  '<svg viewBox="0 0 520 200" role="img" aria-label="Three joints. A: two sticks just touching with a tiny bit of tape. B: sticks overlapping with tape wrapped round. C: overlapping, wrapped, with a small triangle plate across the corner.">' +
  '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  line(40, 150, 140, 150) + line(140, 150, 140, 50) + '<rect x="132" y="142" width="14" height="10" fill="#cfd8e6"/>' +
  line(210, 150, 320, 150) + line(300, 160, 300, 50) + '<rect x="288" y="136" width="26" height="28" rx="4" fill="#cfd8e6" stroke="#141a33" stroke-width="1.5"/>' +
  line(380, 150, 490, 150) + line(470, 160, 470, 50) + '<path d="M470 150L420 150L470 100z" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/><rect x="458" y="136" width="26" height="28" rx="4" fill="#cfd8e6" stroke="#141a33" stroke-width="1.5"/>' +
  T(80, 186, "A", 18, ' font-weight="700"') + T(250, 186, "B", 18, ' font-weight="700"') + T(420, 186, "C", 18, ' font-weight="700"') +
  '</svg>';

/* push and pull */
var LOADS =
  '<svg viewBox="0 0 520 220" role="img" aria-label="A post being squashed from both ends, and a rope being pulled from both ends.">' +
  '<rect width="520" height="220" rx="16" fill="#eef6ff"/>' +
  '<rect x="110" y="60" width="40" height="110" rx="4" fill="#b07a40" stroke="#141a33" stroke-width="3"/>' +
  '<path d="M130 18V52M120 40l10 12 10 -12M130 212V178M120 190l10 -12 10 12" stroke="#e04848" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
  T(60, 120, "Squash", 15, ' font-weight="700" text-anchor="end"') +
  '<path d="M370 60q6 55 0 110" stroke="#c99a63" stroke-width="8" fill="none"/>' +
  '<path d="M370 52V18M360 30l10 -12 10 12M370 178V212M360 200l10 12 10 -12" stroke="#3a8fd6" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
  T(400, 120, "Stretch", 15, ' font-weight="700"') +
  T(70, 150, "push", 14, ' text-anchor="end"') + T(400, 145, "pull", 14) +
  '</svg>';

var START =
  '<svg viewBox="0 0 440 220" role="img" aria-label="A tower made of triangles with Jay looking up at it">' +
  '<rect width="440" height="220" rx="16" fill="#eef6ff"/>' +
  '<path d="M0 200h440" stroke="#7a5532" stroke-width="4"/>' +
  line(200, 200, 240, 40, "#8a5a2b", 6) + line(320, 200, 280, 40, "#8a5a2b", 6) + line(240, 40, 280, 40, "#8a5a2b", 6) +
  line(210, 160, 310, 160, "#8a5a2b", 5) + line(220, 120, 300, 120, "#8a5a2b", 5) + line(230, 80, 290, 80, "#8a5a2b", 5) +
  line(200, 200, 310, 160, "#b07a40", 4) + line(210, 160, 300, 120, "#b07a40", 4) + line(220, 120, 290, 80, "#b07a40", 4) + line(230, 80, 280, 40, "#b07a40", 4) +
  '<rect x="236" y="20" width="48" height="20" rx="4" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/>' +
  A2ART.jay(90, 112, 0.85, "wow") +
  '</svg>';

function esc(t){ return String(t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n){ if(cur.trim()) out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }

(window.A2PACKS = window.A2PACKS || {})["what-makes-it-stand"] = {
  a2: true,
  id: "a2-what-makes-it-stand",
  title: "What makes it stand?",
  subject: "Aesthetic and Creative",
  bodyClass: "subj-home subj-pillar",
  mins: 25,
  line: "Triangles, wide bases, strong joints and the right stuff: the secrets of things that stay up.",
  blurb: "What strong structures have in common, so your own build stays standing. Four short chunks, then a build challenge card to take away from the screen.",
  note: "What makes a structure stand up, ready for a build challenge away from the screen. Four five minute chunks. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Sandcastle", line: "Sandcastle: the big ideas, one at a time, with lots of pictures." },
    { id: "medium", name: "Treehouse", line: "Treehouse: the big ideas, and why they work." },
    { id: "spicy", name: "Skyscraper", line: "Skyscraper: the engineer's words, like centre of mass, compression and buckling." }
  ],
  themes: {
    time: { name: "Time travel", w: { tower: "clock tower", top: "giant clock", crew: "the time engineers" } },
    football: { name: "Football", w: { tower: "floodlight tower", top: "floodlights", crew: "the stadium builders" } },
    horror: { name: "Horror", w: { tower: "creaky bell tower", top: "rusty old bell", crew: "the night watch" } },
    fishing: { name: "Fishing", w: { tower: "harbour lookout", top: "lookout hut", crew: "the harbour crew" } },
    music: { name: "Music", w: { tower: "lighting rig", top: "stage lights", crew: "the stage crew" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: START,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Shapes that stay strong", title: "Triangles keep their shape",
      fig: SHAPES,
      html: "<p>Push the top corner of a square frame and it leans over. Keep pushing and it folds flat.</p>" +
        "<p>Push a triangle and it <b>stays put</b>. A triangle cannot change shape unless one of its sides bends or snaps.</p>" +
        "<p>That is why [[crew]] put triangles all over the [[tower]].</p>",
      lv: {
        mild: { html: "<p>Push a square and it leans over.</p><p>Push a triangle and it <b>stays put</b>.</p><p>Triangles make things strong.</p>" },
        spicy: { html: "<p>A square frame with loose corners can change shape without any side changing length. It leans into a diamond and folds flat.</p>" +
          "<p>A triangle cannot do that. Once three sides are fixed, the angles are fixed too. Engineers call this being <b>rigid</b>.</p>" +
          "<p>The fix for a wobbly square is a <b>diagonal brace</b>: one extra piece corner to corner, which turns it into two triangles.</p>" } } },

    { type: "widget", topic: "Shapes that stay strong", unscored: true,
      title: "Push test",
      html: "<p>Give each frame a push and see what happens. Then try adding a diagonal to the square, if you like.</p>",
      mount: function(el, api){
        var d = api.data;
        d.pushes = d.pushes || 0; d.brace = !!d.brace;
        el.innerHTML = '<svg viewBox="0 0 520 220" style="width:100%;max-width:560px;display:block;margin:0 auto" role="img" aria-label="A square frame and a triangle frame"></svg>' +
          '<div class="qnav" style="flex-wrap:wrap;gap:8px">' +
          '<button type="button" class="btn" data-a="sq">Push the square</button>' +
          '<button type="button" class="btn" data-a="tri">Push the triangle</button>' +
          '<button type="button" class="btn btn-quiet" data-a="brace"></button>' +
          '</div><p class="tiny" aria-live="polite" style="min-height:1.4em"></p>';
        var svg = el.querySelector("svg"), msg = el.querySelector("p.tiny"), bb = el.querySelector("[data-a=brace]");
        var lean = 0, jig = 0, busy = false;
        function L(x1, y1, x2, y2, c){ return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + (c || "#8a5a2b") + '" stroke-width="7" stroke-linecap="round"/>'; }
        function P(x, y){ return '<circle cx="' + x + '" cy="' + y + '" r="7" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>'; }
        function draw(){
          var dx = 120 * Math.sin(lean), dy = 120 * Math.cos(lean);
          var a = [70, 180], b = [190, 180], c = [190 + dx, 180 - dy], e = [70 + dx, 180 - dy];
          var s = '<rect width="520" height="220" rx="16" fill="#eef6ff"/><path d="M0 188h520" stroke="#7a5532" stroke-width="3"/>' +
            L(a[0], a[1], b[0], b[1]) + L(a[0], a[1], e[0], e[1]) + L(b[0], b[1], c[0], c[1]) + L(e[0], e[1], c[0], c[1]) +
            (d.brace ? L(a[0], a[1], c[0], c[1], "#19c39a") : "") + P(a[0], a[1]) + P(b[0], b[1]) + P(c[0], c[1]) + P(e[0], e[1]) +
            L(320 + jig, 180, 460 + jig, 180) + L(320 + jig, 180, 390 + jig, 60) + L(460 + jig, 180, 390 + jig, 60) +
            P(320 + jig, 180) + P(460 + jig, 180) + P(390 + jig, 60) +
            '<text x="70" y="212" font-family="Verdana,Arial,sans-serif" font-size="14" fill="#141a33">' + (d.brace ? "Square with a diagonal" : "Square") + '</text>' +
            '<text x="345" y="212" font-family="Verdana,Arial,sans-serif" font-size="14" fill="#141a33">Triangle</text>';
          svg.innerHTML = s;
          bb.textContent = d.brace ? "Take the diagonal off" : "Add a diagonal to the square";
        }
        function anim(fn, ms, end){
          var t0 = null; busy = true;
          function f(t){ if(t0 === null) t0 = t; var k = Math.min(1, (t - t0) / ms); fn(k); draw(); if(k < 1) requestAnimationFrame(f); else { busy = false; if(end) end(); } }
          requestAnimationFrame(f);
        }
        function had(){ d.pushes++; api.save(); api.done("done"); }
        el.querySelector(".qnav").onclick = function(ev){
          var b = ev.target.closest("button"); if(!b || busy) return;
          var act = b.getAttribute("data-a");
          if(act === "brace"){ d.brace = !d.brace; lean = 0; api.save(); draw(); msg.textContent = d.brace ? "Now the square is two triangles. Push it and see." : "Back to a plain square."; return; }
          if(act === "sq"){
            if(d.brace){ anim(function(k){ lean = Math.sin(k * Math.PI) * 0.03; }, 400); msg.textContent = "With the diagonal it is two triangles, so it stays put."; }
            else { var from = lean; anim(function(k){ lean = from + (0.75 - from) * k; }, 600, function(){ setTimeout(function(){ anim(function(k){ lean = 0.75 * (1 - k); }, 500); }, 700); }); msg.textContent = "It leaned right over. Squares need a bit of help."; }
            had(); return;
          }
          if(act === "tri"){ anim(function(k){ jig = Math.sin(k * Math.PI * 2) * 3; }, 400); msg.textContent = "The triangle did not change shape at all."; had(); }
        };
        draw();
        if(d.pushes) msg.textContent = "You have pushed " + d.pushes + " times so far. Push away.";
      },
      report: function(d){ return "Push test: " + ((d && d.pushes) || 0) + " pushes" + (d && d.brace ? ", tried a diagonal brace." : "."); } },

    { type: "mc", topic: "Shapes that stay strong",
      q: "Which frame keeps its shape best when you push it?",
      options: ["A triangle", "A square", "A long thin rectangle"],
      answer: 0,
      slips: { 1: "A square leans over when you push a corner. It needs a diagonal to help.", 2: "A rectangle is a stretched square, so it leans over too." },
      hint: "Think about the push test. Which one did not budge?",
      why: "A triangle cannot change shape unless a side breaks. That makes it the strongest frame shape.",
      lv: {
        mild: { options: ["A triangle", "A square"], slips: { 1: "A square leans over when you push it." } },
        spicy: { q: "A square frame on the [[tower]] wobbles. What is the best fix?",
          options: ["Add a diagonal brace from corner to corner", "Make every side thicker", "Add a fifth side to make a pentagon", "Paint it to protect it"],
          slips: { 1: "Thicker sides are stronger pieces, but the corners can still swing. The shape still leans.", 2: "A pentagon can change shape too. Only triangles are rigid.", 3: "Paint stops rust. It does not stop wobbling." },
          hint: "Which fix turns the square into triangles?",
          why: "A diagonal brace splits the square into two triangles, and triangles are rigid." } } },

    { type: "num", topic: "Shapes that stay strong", explain: true,
      q: "Bridges are full of triangles. How many triangles can you count in this bridge?",
      fig: truss(3),
      boxes: [{ label: "Triangles", a: 5 }],
      slips: [[3, "You found the ones pointing up. Look for upside down ones in between them too."], [2, "Those are the upside down ones. Count the ones pointing up as well."]],
      hint: "Count the ones pointing up first, then the upside down ones in the gaps.",
      why: "3 point up and 2 point down: <b>5</b> triangles. Each one keeps the bridge from leaning.",
      lv: {
        mild: { fig: truss(2), boxes: [{ label: "Triangles", a: 3 }],
          slips: [[2, "You found the ones pointing up. There is one upside down in the middle too."], [1, "Look again: some point up as well."]],
          why: "2 point up and 1 points down: <b>3</b> triangles." },
        spicy: { fig: truss(5), boxes: [{ label: "Triangles", a: 9 }],
          slips: [[5, "You found the ones pointing up. Count the upside down ones between them as well."], [4, "Those are the upside down ones. Add the ones pointing up."], [10, "One too many. The upside down ones only sit between the others, so there is one fewer of them."]],
          why: "5 point up and 4 point down: <b>9</b> triangles. Notice the pattern: n sections gives 2n take away 1 triangles." } } },

    { type: "mc", topic: "Shapes that stay strong",
      q: "Look at the frame. Which part will wobble when the wind blows?",
      fig: FRAME,
      options: ["Part A", "Part B", "Part C"], answer: 1, fixed: true,
      slips: { 0: "Part A has a diagonal, so it is made of triangles.", 2: "Part C has a diagonal, so it is made of triangles." },
      hint: "Find the part with no diagonal.",
      why: "Part B is just a square. It has no diagonal, so it can lean over.",
      lv: { spicy: { q: "Which part needs a brace, and why?",
        options: ["Part B, because it is a square with no diagonal", "Part A, because it is at the top", "Part C, because it carries the most weight", "None of them, the frame is rigid"],
        answer: 0, fixed: false,
        slips: { 1: "Being at the top does not make it wobble. Look for the missing diagonal.", 2: "C does carry the most weight, but it already has a diagonal, so it keeps its shape.", 3: "One part has no diagonal, so the frame is not rigid all the way up." },
        why: "Part B has no diagonal, so it can lean over and the whole frame leans with it. One brace fixes it." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "A wide base",
      title: "Wide at the bottom",
      fig: BASES,
      html: "<p>A tall thin tower tips over easily. A <b>wide base</b> makes it much steadier.</p>" +
        "<p>Try it on a bus: stand with your feet together and you wobble. Stand with your feet apart and you stay steady.</p>" +
        "<p>Keeping the heavy stuff low helps too. That is why the [[tower]] is wider at the bottom than the top.</p>",
      lv: {
        mild: { html: "<p>Tall and thin falls over easily.</p><p><b>Wide at the bottom</b> stays up.</p><p>Stand with your feet apart and you are steadier too.</p>" },
        spicy: { fig: TIPS,
          html: "<p>Everything has a balance point called its <b>centre of mass</b>. The weight acts as if it all sits at that point.</p>" +
            "<p>If the centre of mass stays above the base, the object stands. If it leans past the edge of the base, it topples. In the picture, A will stand and B will fall.</p>" +
            "<p>So a <b>wide base</b> and <b>heavy things low down</b> both make a structure harder to tip.</p>" } } },

    { type: "mc", topic: "A wide base",
      q: "Which tower is the hardest to knock over?",
      fig: BASES,
      options: ["A", "B", "C"], answer: 2, fixed: true,
      slips: { 0: "A is tall and thin, so the smallest push could tip it.", 1: "B is steadier than A, but C has the widest base." },
      hint: "Look at the bottom of each tower. Which one is widest?",
      why: "C is short with the widest base, so it is the hardest to tip.",
      lv: { spicy: { q: "Both blocks are leaning. Which one will fall over?",
        fig: TIPS, options: ["A", "B", "Both of them", "Neither of them"], answer: 1,
        slips: { 0: "In A the red dot is still above the base, so it rocks back.", 2: "Check where the red dot is in A. It is still above the base.", 3: "In B the red dot has gone past the edge of the base." },
        hint: "Is the red dot above the black bar or past it?",
        why: "In B the centre of mass has moved past the edge of its base, so it topples. A rocks back." } } },

    { type: "order", topic: "A wide base",
      q: "Put these in order, from <b>easiest</b> to tip over to <b>hardest</b>.",
      items: ["A tall thin pole", "A tall tower with a wider base", "A short tower with a wide base", "A short wide tower with heavy blocks at the bottom"],
      slips: { any: "Wider bases and heavy things low down make it harder to tip." },
      hint: "Tall and thin tips first. Short, wide and heavy at the bottom tips last.",
      why: "The wider the base and the lower the weight, the harder it is to tip.",
      lv: {
        mild: { items: ["Tall and thin", "Medium", "Short and wide"] },
        spicy: { items: ["A tall pole with a heavy weight on top", "A tall thin pole", "A tall tower with a wide base", "A wide tower with its heavy parts at the bottom"],
          why: "A heavy top raises the centre of mass, so it tips first. A wide base and a low centre of mass are the steadiest." } } },

    { type: "mc", topic: "A wide base", explain: true,
      q: "Bonnie is much steadier standing on four legs than sitting up on two. Why?",
      fig: '<svg viewBox="0 0 320 160" role="img" aria-label="Bonnie the poodle standing on four legs">' + A2ART.bonnie(170, 96, 1.3, "stand") +
        A2ART.egg('<text x="270" y="150" ' + F + ' font-size="13" fill="#141a33" fill-opacity=".45">woof</text>', "Bonnie would like you to know she is a very steady dog. Four legs, no tail, no wobbles.") + '</svg>',
      options: ["Four legs spread apart make a wider base", "She is brown", "She has no tail"],
      answer: 0,
      slips: { 1: "Brown is lovely, but colour does not hold anything up.", 2: "True, Bonnie has no tail. Outrageous. But a tail does not hold her up." },
      hint: "Think about feet apart on a bus.",
      why: "Four legs spread out make a wide base, just like a wide tower.",
      lv: { spicy: { options: ["Her four feet make a wider base, so her centre of mass stays above it", "Four legs make her lighter", "Her centre of mass moves to her head", "She has no tail"],
        slips: { 1: "She weighs the same however she stands.", 2: "Her centre of mass stays near her middle.", 3: "True, Bonnie has no tail. Outrageous. But it does not hold her up." },
        why: "Four feet spread out give a wide base, so her centre of mass has a long way to lean before it passes the edge." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Joints and materials",
      title: "Joints are the weak spots",
      fig: JOINTS,
      html: "<p>Where two pieces meet is called a <b>joint</b>. Most structures break at a joint, not in the middle of a piece.</p>" +
        "<p>Strong joints <b>overlap</b> the pieces, <b>wrap</b> them firmly, and add a little <b>triangle</b> across the corner.</p>" +
        "<p>The other secret is the <b>material</b>: stiff things for legs, light things up high, nothing soggy.</p>",
      lv: {
        mild: { html: "<p>Where two pieces meet is a <b>joint</b>.</p><p>Joints break first.</p><p>Overlap the pieces and wrap them tight to make them strong.</p>" },
        spicy: { html: "<p>Where two pieces meet is a <b>joint</b>. Forces have to pass through it, so it is usually the first thing to fail.</p>" +
          "<p>A good joint has plenty of <b>contact area</b> (the pieces overlap), is fixed firmly, and often has a small triangular plate across the corner called a <b>gusset</b>.</p>" +
          "<p>Materials are chosen for their properties: <b>strong when squashed</b> (stone, concrete), <b>strong when pulled</b> (steel cable, string), and <b>strong for their weight</b> (wood, aluminium).</p>" } } },

    { type: "mc", topic: "Joints and materials",
      q: "Which joint will hold best?",
      fig: JOINTS,
      options: ["A", "B", "C"], answer: 2, fixed: true,
      slips: { 0: "A only just touches, with a tiny bit of tape. It would snap apart first.", 1: "B is good: it overlaps and is wrapped. C does all that and adds a triangle." },
      hint: "Look for overlap, wrapping and a triangle.",
      why: "C overlaps, is wrapped, and has a triangle plate across the corner, so it cannot fold.",
      lv: { spicy: { q: "Which joint will hold best, and what is the triangle plate called?",
        options: ["A, it uses the least tape", "B, it is wrapped", "C, it has a gusset across the corner", "C, it has a brace on the bottom"],
        answer: 2, fixed: true,
        slips: { 0: "Less tape means less holding it together. A would snap apart first.", 1: "B is good, but C adds a gusset too.", 3: "Right joint, but the corner plate is called a gusset." },
        why: "C overlaps, is wrapped, and has a <b>gusset</b>: a triangle plate that stops the corner folding." } } },

    { type: "match", topic: "Joints and materials",
      q: "Match each material to what it is good at.",
      pairs: [["Steel", "Very strong and stiff"], ["Wood", "Light and easy to cut"], ["String", "Good for pulling, no good for pushing"], ["Glass", "You can see through it"]],
      slips: { any: "Think about how each one feels and what it is used for." },
      hint: "Which one floppy thing is still good for pulling?",
      why: "Each material has jobs it is good at. Builders pick the one that suits the job.",
      lv: {
        mild: { pairs: [["Steel", "Very strong"], ["String", "Good for pulling"], ["Glass", "You can see through it"]] },
        spicy: { pairs: [["Concrete", "Strong in compression (squashing)"], ["Steel cable", "Strong in tension (pulling)"], ["Aluminium", "Strong for its weight"], ["Rubber", "Flexible, soaks up shakes"]],
          why: "Engineers match the material to the force: concrete for squashing, cable for pulling, light metals up high, rubber to soak up movement." } } },

    { type: "sort", topic: "Joints and materials",
      q: "You are building a model [[tower]]. Sort these: good for the legs or not?",
      buckets: ["Good for the legs", "Not good for the legs"],
      cards: [["Dry spaghetti", 0], ["Cooked spaghetti", 1], ["Rolled up paper tubes", 0], ["Wet tissue", 1], ["Lolly sticks", 0], ["Jelly", 1]],
      slips: { any: "Legs need to be stiff. Anything soggy or wobbly will flop." },
      hint: "Would it stay straight if you held it upright?",
      why: "Dry spaghetti, paper tubes and lolly sticks are stiff. Cooked spaghetti, wet tissue and jelly flop.",
      lv: {
        mild: { cards: [["Dry spaghetti", 0], ["Cooked spaghetti", 1], ["Lolly sticks", 0], ["Jelly", 1]] },
        spicy: { cards: [["Spaghetti bundled in threes", 0], ["One long strand of spaghetti", 1], ["Short paper tubes", 0], ["A single flat sheet of paper", 1], ["Lolly sticks glued in a triangle", 0], ["Marshmallows stacked up", 1]],
          why: "Bundles, tubes and triangles resist bending. A single long strand or a flat sheet bends sideways under load, and marshmallows squash." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Loads and your plan",
      title: "Push and pull",
      fig: LOADS,
      html: "<p>The weight a structure holds is called the <b>load</b>. The [[top]] is the load on the [[tower]].</p>" +
        "<p>Some parts get <b>squashed</b> by the load, like the legs. Some parts get <b>stretched</b>, like a rope holding something up.</p>" +
        "<p>Good builders know which parts get squashed and which get stretched, and make each part strong enough.</p>",
      lv: {
        mild: { html: "<p>The weight on top is the <b>load</b>.</p><p>The load <b>squashes</b> the legs.</p><p>Strong legs hold the load up.</p>" },
        spicy: { html: "<p>The weight a structure carries is its <b>load</b>. A load can cause <b>compression</b> (squashing) or <b>tension</b> (stretching).</p>" +
          "<p>Long thin parts under compression can suddenly bend sideways. This is called <b>buckling</b>, and it is how most spaghetti towers fail.</p>" +
          "<p>To stop buckling, make parts <b>shorter</b>, <b>bundle</b> them together, or <b>brace</b> them halfway with triangles.</p>" } } },

    { type: "mc", topic: "Loads and your plan",
      q: "The [[top]] sits on the [[tower]]. What does its weight do to the legs?",
      options: ["Squashes them", "Stretches them", "Nothing at all"],
      answer: 0,
      slips: { 1: "Stretching is a pull, like a rope. Weight on top pushes down.", 2: "Any weight on top pushes down on the legs below it." },
      hint: "Think of standing on an empty can.",
      why: "Weight on top pushes down, so the legs get squashed.",
      lv: { spicy: { q: "A long thin spaghetti leg suddenly bends sideways under the load. What is happening, and what could fix it?",
        options: ["Buckling: make it shorter, bundle it, or brace it", "Tension: pull it tighter", "Rusting: keep it dry", "Bending: use cooked spaghetti instead"],
        slips: { 1: "Tension is stretching. This leg is being squashed.", 2: "Spaghetti does not rust. Something about its shape is the problem.", 3: "Cooked spaghetti would flop even sooner." },
        hint: "Long, thin and squashed. What is the word for bending sideways?",
        why: "That is <b>buckling</b>. Shorter, bundled or braced legs resist it." } } },

    { type: "multi", topic: "Loads and your plan",
      q: "Pick <b>everything</b> that will help your build stand.",
      options: ["Triangles", "A wide base", "Strong joints", "The heaviest part at the very top", "Square frames with no diagonals"],
      answers: [0, 1, 2],
      hint: "Three of these are the big ideas from today.",
      why: "Triangles, a wide base and strong joints. A heavy top and unbraced squares make it wobble.",
      lv: {
        mild: { options: ["Triangles", "A wide base", "Wobbly legs"], answers: [0, 1], why: "Triangles and a wide base help. Wobbly legs do not." },
        spicy: { options: ["Triangles in every section", "A wide base with a low centre of mass", "Gussets at the joints", "Short or bundled legs to stop buckling", "The load placed high on one side", "Long single strands for legs"],
          answers: [0, 1, 2, 3],
          why: "Rigid triangles, a low wide base, strong joints and buckle proof legs. A load high on one side moves the centre of mass towards the edge." } } },

    { type: "write", topic: "Loads and your plan",
      q: "Plan a tower you could build away from the screen: spaghetti and marshmallows, rolled paper and tape, or anything you fancy. What will you do to make it stand? Write as much or as little as you like. It only goes to Jay if you choose.",
      fig: START,
      starters: ["I will use", "My base will be", "I will put triangles", "My joints will", "I think it will be"],
      checklist: ["I said what I will build with", "I used at least one of the big ideas"],
      minWords: 20,
      lv: { mild: { minWords: 8, starters: ["I will use", "I will put triangles", "My base will be wide"] },
        spicy: { minWords: 40, checklist: ["I said what I will build with", "I explained how I will stop it tipping", "I explained how I will stop it buckling"] } } }
  ],

  realWorld: {
    title: "Engineers do this every day",
    html: "<p>Look out for triangles next time you are out: electricity pylons, cranes, bridges and roof beams are full of them. Structural engineers use the same ideas you used today.</p>" +
      "<p>Old castles and cathedrals have wide bases and thick walls. They were built hundreds of years ago with no computers. If we could time travel, we could ask the builders how they knew. Some of what they knew came from watching things fall down.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A pylon made of triangles and a time portal">' + A2ART.portal(70, 75, 52) +
      line(240, 140, 270, 20, "#5b6180", 4) + line(320, 140, 290, 20, "#5b6180", 4) + line(270, 20, 290, 20, "#5b6180", 4) +
      line(240, 140, 310, 100, "#5b6180", 3) + line(250, 100, 300, 60, "#5b6180", 3) + line(260, 60, 290, 20, "#5b6180", 3) +
      line(250, 100, 310, 100, "#5b6180", 3) + line(260, 60, 300, 60, "#5b6180", 3) + line(220, 50, 340, 50, "#5b6180", 4) +
      A2ART.bird(356, 40, 0.7, "#ff5d5d") + '</svg>'
  },

  make: {
    title: "Your build challenge card",
    intro: "Take this card away from the screen and have a go at a build. Fill in the gaps by hand after, and send Jay a photo if you like.",
    fields: [
      { id: "stuff", label: "I will build with", ph: "Spaghetti and marshmallows", max: 50 },
      { id: "idea", label: "My big idea to make it stand", ph: "Triangles all the way up and a wide base", max: 80 },
      { id: "guess", label: "How tall I think it will get", ph: "40 cm", max: 16 },
      { id: "name", label: "Chief engineer", ph: "Builder B5", max: 24 }
    ],
    svg: function(v){
      var idea = wrap(v.idea, 28, 3), stuff = wrap(v.stuff, 26, 2), y = 0, s = "";
      for(var gx = 20; gx < 600; gx += 20) s += '<path d="M' + gx + ' 0V420" stroke="#ffffff" stroke-opacity=".08"/>';
      for(var gy = 20; gy < 420; gy += 20) s += '<path d="M0 ' + gy + 'H600" stroke="#ffffff" stroke-opacity=".08"/>';
      function tx(x, yy, t, sz, w, c){ return '<text x="' + x + '" y="' + yy + '" font-family="Verdana,Arial,sans-serif" font-size="' + sz + '"' + (w ? ' font-weight="700"' : "") + ' fill="' + (c || "#ffffff") + '">' + t + '</text>'; }
      var body = tx(36, 58, "BUILD CHALLENGE", 26, 1, "#ffd23f") +
        tx(36, 96, "Building with:", 15, 0, "#9fd3ff") +
        stuff.map(function(l, k){ return tx(36, 120 + k * 24, esc(l), 20, 1); }).join("");
      y = 120 + stuff.length * 24 + 16;
      body += tx(36, y, "My big idea:", 15, 0, "#9fd3ff") +
        idea.map(function(l, k){ return tx(36, y + 24 + k * 24, esc(l), 18, 1); }).join("");
      body += tx(36, 330, "My guess: " + esc(v.guess), 17, 1) +
        tx(36, 362, "Actual height: ............ cm", 17, 0) +
        tx(36, 396, "Chief engineer: " + esc(v.name), 15, 0, "#9fd3ff");
      var tower = '<g stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none">' +
        '<path d="M430 360L470 120M560 360L520 120M470 120H520M440 300H550M450 240H540M460 180H530M430 360L550 300M440 300L540 240M450 240L530 180M460 180L520 120"/></g>' +
        '<rect x="462" y="98" width="66" height="22" rx="4" fill="#ffd23f"/>' +
        '<path d="M410 360H580" stroke="#ffd23f" stroke-width="4"/>';
      var ticks = ["Triangles", "Wide base", "Strong joints"].map(function(t, k){
        return '<rect x="400" y="' + (20 + k * 26) + '" width="16" height="16" rx="3" fill="none" stroke="#ffffff" stroke-width="2"/>' + tx(424, 34 + k * 26, t, 14, 0);
      }).join("");
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">' +
        '<rect width="600" height="420" rx="22" fill="#1d3a6b"/>' + s +
        '<rect x="12" y="12" width="576" height="396" rx="16" fill="none" stroke="#9fd3ff" stroke-width="3"/>' +
        body + tower + ticks + '</svg>';
    }
  }
};
})();
