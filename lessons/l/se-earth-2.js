/* ==========================================================
   Base 5 Lessons - Scientific and Environmental
   Earth and atmosphere, lesson 2 of 3: The air up there
   45 minutes (first half of the Thursday project slot).
   Leads into "What is it made of?". Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a", GREEN = "#1e9e5a";

function pie(cx, cy, r, build){
  /* nitrogen 78, oxygen 21, argon and the rest 1 */
  function arc(a0, a1, col, step, label, sub, lx, ly){
    var p = function(a){ return [cx + r * Math.sin(a * Math.PI * 2), cy - r * Math.cos(a * Math.PI * 2)]; }, s0 = p(a0), s1 = p(a1), big = a1 - a0 > 0.5 ? 1 : 0;
    return '<g' + (build ? ' data-s="' + step + '"' : "") + '><path d="M' + cx + ' ' + cy + 'L' + s0[0].toFixed(1) + ' ' + s0[1].toFixed(1) + 'A' + r + ' ' + r + ' 0 ' + big + ' 1 ' + s1[0].toFixed(1) + ' ' + s1[1].toFixed(1) + 'Z" fill="' + col + '" stroke="' + INK + '" stroke-width="4"/>' +
      T(lx, ly, label, 30, { f: 1 }) + T(lx, ly + 30, sub, 22) + '</g>';
  }
  return arc(0, 0.78, TEAL, 1, "Nitrogen", "78 in every 100", cx + r + 30, cy + 60) + arc(0.78, 0.99, PINK, 2, "Oxygen", "21 in every 100", cx + r + 30, cy - 80) + arc(0.99, 1, YELLOW, 3, "The rest", "argon, carbon dioxide...", cx + r + 30, cy - 165);
}
function layers(){
  var L = [[0, 380, "#8fd3ec", "Troposphere", "0 to about 12 km: all our weather"], [380, 290, "#5fb3d8", "Stratosphere", "up to about 50 km: the ozone layer"], [290, 200, "#3a7fb5", "Mesosphere", "up to about 85 km: meteors burn up"], [200, 90, "#24507a", "Thermosphere", "the space station orbits up here"], [90, 0, "#0f2a40", "Space", "about 100 km up is the edge of space"]];
  var g = "";
  var ys = [[300, 400], [210, 300], [130, 210], [50, 130], [0, 50]];
  L.forEach(function(l, i){
    var y0 = ys[i][0], y1 = ys[i][1];
    g += '<g data-s="' + (i + 1) + '"><rect x="0" y="' + y0 + '" width="1000" height="' + (y1 - y0) + '" fill="' + l[2] + '"/>' +
      T(30, y0 + (y1 - y0) / 2 + 2, l[3], 26, { f: 1, c: i > 1 ? "#fffdf8" : INK }) + T(260, y0 + (y1 - y0) / 2 + 2, l[4], 21, { c: i > 1 ? "#fffdf8" : INK }) + '</g>';
  });
  g += '<g data-s="1"><g class="drift">' + I("cloud", 620, 380, 0.7) + '</g></g>' +
    '<g data-s="1"><g class="float"><path d="M760 335h70l20 -10h-20l-10 -16h-12l8 16h-40l-10 -8h-8z" fill="#fffdf8" stroke="' + INK + '" stroke-width="2"/></g></g>' +
    '<g data-s="3"><path class="dash" d="M900 140L860 190" stroke="' + YELLOW + '" stroke-width="5"/></g>' +
    '<g data-s="4"><g class="float"><rect x="760" y="76" width="60" height="16" fill="#c9ccd0" stroke="' + INK + '" stroke-width="2"/><rect x="735" y="72" width="22" height="24" fill="' + TEAL + '"/><rect x="823" y="72" width="22" height="24" fill="' + TEAL + '"/></g></g>' +
    '<rect x="0" y="400" width="1000" height="20" fill="#7fb069"/>';
  return S("0 0 1000 420", g);
}

window.B5LESSON = {
  id: "se-earth-2",
  title: "The air up there",
  mins: 45,
  cover: { line: "You breathe about 20,000 times a day. What's actually in it, and how far up does it go?", art: S("0 0 700 440", A.scene(700, 440, { ground: 400, sun: [580, 80] }) + '<g class="float">' + A.bird(220, 160, 1.2) + A.bird(320, 120, 0.8) + '</g>' + A.bonnie(150, 362, 0.55)) },

  warm: {
    wordle: { word: "OXYGEN", hint: "The gas in air that keeps you alive.", say: "Six letters." },
    wyr: { a: "Float in a hot air balloon to the edge of space", b: "Ride a rocket straight up", twist: "The balloon would run out of air to float on long before space. Air gets thinner and thinner the higher you go.", say: "Ask: which would be scarier?" }
  },

  recap: {
    items: [
      { q: "Name the layers of the Earth.", a: "Crust, mantle, outer core, inner core." },
      { q: "Where does lava come from?", a: "Magma from the mantle, pushing up through cracks in the crust." },
      { q: "How do we know what's inside the Earth?", a: "Earthquake waves travelling through it." }
    ],
    say: "From last Thursday."
  },

  objective: {
    formal: "describe what air is made of and the layers of the atmosphere.",
    mission: "Find out what's in every breath, and fly up through the sky layer by layer.",
    success: ["Say the main gases in air", "Name the layer where weather happens", "Say roughly where space starts"],
    say: "Read the mission."
  },

  sections: [
    {
      kind: "hook", title: "What's in a breath?", mins: 8,
      slides: [
        {
          type: "predict", title: "Guess first",
          q: "Most of the air you breathe is...",
          opts: ["Oxygen", "Nitrogen", "Carbon dioxide"],
          a: 1,
          why: "Nitrogen, by a long way: about 78 in every 100 bits of air. Oxygen is about 21. Most people guess oxygen.",
          say: "Most people get this wrong, which is the fun."
        },
        { title: "What's in air", stack: true, artWidth: 1050, art: S("0 0 800 400", pie(220, 210, 170, true)),
          say: "Click through. Ask: if oxygen is only 21 in every 100, why don't we run out? (Plants keep making more.)" }
      ],
      check: { q: "Which gas makes up most of the air?", opts: ["Nitrogen", "Oxygen", "Helium"], a: 0, why: "Nitrogen: about 78 in every 100." }
    },
    {
      kind: "explore", title: "Up through the layers.", mins: 15,
      slides: [
        { title: "The layers of the sky", text: "The air around Earth is called the <b>atmosphere</b>. It has layers too:", stack: true, artWidth: 1250, art: layers(),
          say: "Click from the bottom up. Planes cruise near the top of the troposphere." },
        {
          type: "sort", title: "Which layer?", q: "Low down, or way up high?",
          bins: ["Troposphere (where we are)", "Higher up"],
          cards: [
            { t: "Rain and clouds", b: 0 }, { t: "The ozone layer", b: 1 }, { t: "Birds flying", b: 0 },
            { t: "Shooting stars burning up", b: 1 }, { t: "Wind and storms", b: 0 }, { t: "The space station", b: 1 }
          ],
          say: "Planes are a trick question: they fly near the top of the troposphere."
        },
        {
          type: "predict", title: "Thin air",
          q: "Why do climbers on very high mountains often carry oxygen?",
          opts: ["The air is thinner up high, so each breath has less oxygen", "Mountains have no air at all", "It's for cooking"],
          a: 0,
          why: "Air gets thinner the higher you go. There's still oxygen, but each breath gets less of it."
        }
      ],
      check: { q: "All our weather happens in the...", opts: ["Troposphere", "Thermosphere", "Inner core"], a: 0, why: "The troposphere, the lowest layer." }
    },
    {
      kind: "explain", title: "Our blanket.", mins: 10,
      slides: [
        { title: "Why the atmosphere matters", pts: ["It gives us oxygen to breathe", "The ozone layer blocks lots of the Sun's harmful rays", "It keeps the Earth warm, like a blanket", "It burns up most space rocks before they land"], build: true, ptsFrom: 1,
          art: S("0 0 480 420", '<rect width="480" height="420" fill="#0f2a40"/><circle cx="240" cy="230" r="150" fill="#5fb3d8" opacity=".5"/><circle cx="240" cy="230" r="120" fill="#3a7fb5" stroke="' + INK + '" stroke-width="4"/><path d="M180 180q30 -30 70 0t50 40M170 270q40 10 60 -10" stroke="#3f9a5a" stroke-width="18" fill="none" stroke-linecap="round"/><circle class="pulse" cx="420" cy="60" r="30" fill="' + YELLOW + '"/>'),
          say: "Ask: which one matters most?" },
        {
          type: "vote", title: "Air quiz", q: "Which surprised you most?",
          opts: ["Air is mostly nitrogen", "Space starts about 100 km up", "Shooting stars burn up in the air", "Planes fly in the weather layer"],
          say: "100 km is about the same as driving to the next big city."
        }
      ],
      check: { q: "The ozone layer...", opts: ["Blocks lots of the Sun's harmful rays", "Makes rain", "Is made of nitrogen"], a: 0, why: "It blocks lots of harmful ultraviolet light." }
    }
  ],

  realworld: {
    title: "Air in everyday life",
    text: "Weather forecasts, aeroplane cabins being pressurised, mountain climbers, astronauts, and sun cream on a sunny day: all about the atmosphere.",
    art: layers(),
    say: "Ask: what's the weather doing today, and which layer is it in?"
  },

  exit: [
    { q: "Most of the air is...", opts: ["Nitrogen", "Oxygen"], a: 0, why: "Nitrogen, about 78 in every 100." },
    { q: "Weather happens in the...", opts: ["Troposphere", "Stratosphere"], a: 0, why: "The lowest layer." },
    { q: "Space starts about...", opts: ["100 km up", "1 km up"], a: 0, why: "About 100 km up." }
  ],

  driving: {
    angle: "If you could time travel to a time before plants made oxygen, you couldn't breathe. Should time travellers have to check the air before every trip?",
    opts: ["Yes, check first", "Just take an oxygen tank", "I'm not going"],
    say: "Fun one."
  },

  surprise: { at: "sections.1.slides.0", kind: "bird", x: 1460, y: 620, say: "Some geese fly over the Himalayas, higher than most clouds. Show offs." }
};
})();
