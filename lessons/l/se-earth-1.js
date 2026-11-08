/* ==========================================================
   Base 5 Lessons - Scientific and Environmental
   Earth and atmosphere, lesson 1 of 3: Inside the Earth
   45 minutes (first half of the Thursday project slot).
   Leads into "What is it made of?". Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a", GREEN = "#1e9e5a";

/* the Earth cut open: layers appear on build steps when build is true */
function earth(cx, cy, r, build, labels){
  var g = '<defs><radialGradient id="ec" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6c2"/><stop offset="1" stop-color="' + YELLOW + '"/></radialGradient></defs>';
  var L = [
    [r, "#5b8fd6", "Crust", "the thin outside we live on", 1],
    [r * 0.94, "#e2553a", "Mantle", "hot rock that flows very slowly", 2],
    [r * 0.55, ORANGE, "Outer core", "liquid iron and nickel", 3],
    [r * 0.2, "url(#ec)", "Inner core", "solid metal, as hot as the Sun's surface", 4]
  ];
  L.forEach(function(l, i){
    g += '<g' + (build ? ' data-s="' + l[4] + '"' : "") + '><circle cx="' + cx + '" cy="' + cy + '" r="' + l[0] + '" fill="' + l[1] + '" stroke="' + INK + '" stroke-width="' + (i ? 2.5 : 5) + '"' + (i === 3 ? ' class="pulse"' : "") + '/>' +
      (labels ? '<path d="M' + (cx + l[0] * 0.7) + ' ' + (cy - l[0] * 0.7) + 'L' + (cx + r + 40) + ' ' + (cy - r + 40 + i * 80) + '" stroke="' + INK + '" stroke-width="2.5"/>' +
        T(cx + r + 50, cy - r + 46 + i * 80, l[2], 26, { f: 1 }) + T(cx + r + 50, cy - r + 74 + i * 80, l[3], 19) : "") + '</g>';
  });
  if(!build) g += '<path d="M' + cx + ' ' + (cy - r) + 'A' + r + ' ' + r + ' 0 0 0 ' + (cx - r) + ' ' + cy + 'L' + cx + ' ' + cy + 'Z" fill="#4f8f4a" opacity=".0"/>';
  return g;
}
function volcano(x, y, s){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><path d="M-120 0L-30 -120h60L120 0Z" fill="#7a6a5a" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
    '<path d="M-30 -120q30 30 60 0" fill="#e2553a"/><path d="M-12 -112q-6 40 -26 70M10 -112q10 40 30 64" stroke="#e2553a" stroke-width="10" fill="none" stroke-linecap="round"/>' +
    '<g class="float"><circle cx="-10" cy="-160" r="18" fill="#9aa0a6"/><circle cx="16" cy="-190" r="24" fill="#b0b5ba"/><circle cx="-4" cy="-226" r="20" fill="#c9ccd0"/></g></g>';
}

window.B5LESSON = {
  id: "se-earth-1",
  title: "Inside the Earth",
  mins: 45,
  cover: { line: "We've been to the Moon, but nobody has ever dug more than 12 km down. So how do we know what's inside?", art: S("0 0 700 440", '<rect width="700" height="440" fill="#1d3d47"/>' + [[60, 50], [180, 400], [640, 60], [600, 380], [90, 300]].map(function(p, i){ return '<circle class="twinkle" style="animation-delay:' + i * 0.4 + 's" cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="#fff6d6"/>'; }).join("") + earth(300, 220, 180, false, false) + A.bird(560, 120, 0.9)) },

  warm: {
    wordle: { word: "CRUST", hint: "The outside of a pie, a loaf, or a planet.", say: "Five letters." },
    wyr: { a: "Travel to the centre of the Earth", b: "Travel to the bottom of the ocean", twist: "People have reached the deepest part of the ocean, about 11 km down. The deepest hole ever dug is about 12 km. The centre of the Earth is about 6,400 km down.", say: "Ask: what would you take?" }
  },

  recap: {
    items: [
      { q: "What's the ground under the school made of?", a: "Soil, then rock. Keep going and it gets hotter and hotter." },
      { q: "Name something that comes out of the ground.", a: "Lava, water, oil, coal, metals, gems, dinosaur bones." },
      { q: "What shape is the Earth?", a: "Nearly a ball, very slightly squashed." }
    ],
    say: "Any sensible answer counts."
  },

  objective: {
    formal: "describe the layers of the Earth and how scientists know about them.",
    mission: "Slice the planet open (safely) and find out what's in the middle.",
    success: ["Name the four main layers", "Say one thing about each", "Explain how we know"],
    say: "Read the mission."
  },

  sections: [
    {
      kind: "hook", title: "Four layers, like a peach.", mins: 8,
      slides: [
        { title: "Inside the Earth", stack: true, artWidth: 1250, art: S("0 0 1000 480", earth(300, 240, 210, true, true)),
          say: "Click through each layer. Peach comparison: skin is the crust, flesh is the mantle, stone is the core." },
        {
          type: "predict", title: "How deep have we dug?",
          q: "The deepest hole people have ever dug goes down about...",
          opts: ["12 km", "600 km", "Right to the centre"],
          a: 0,
          why: "About 12 km, in Russia. It didn't even get through the crust. The centre is about 6,400 km down."
        }
      ],
      check: { q: "Which layer do we live on?", opts: ["The crust", "The mantle", "The inner core"], a: 0, why: "The crust: the thin, rocky outside." }
    },
    {
      kind: "explore", title: "What's each layer like?", mins: 15,
      slides: [
        {
          type: "sort", title: "Crust, mantle or core?", q: "Where does each one belong?",
          bins: ["Crust", "Mantle", "Core"],
          cards: [
            { t: "Where we live", b: 0 }, { t: "Hot rock that flows very slowly", b: 1 }, { t: "A ball of iron in the middle", b: 2 },
            { t: "Thinner under the oceans", b: 0 }, { t: "Where magma for volcanoes comes from", b: 1 }, { t: "Liquid metal that makes Earth's magnetic field", b: 2 }
          ],
          say: "The magnetic field is why compasses work."
        },
        { title: "Volcanoes: a window inside", text: "Magma from the mantle sometimes pushes up through cracks in the crust. When it comes out, we call it <b>lava</b>.",
          art: S("0 0 480 420", A.scene(480, 420, { ground: 380, time: "dusk", sun: [420, 80] }) + volcano(240, 380, 1.4)),
          say: "Ask: magma or lava? (Underground, magma. Outside, lava.)" },
        {
          type: "predict", title: "How do we know?",
          q: "Nobody has been there. So how do scientists know what's inside the Earth?",
          opts: ["Earthquake waves travel through it, and change speed in each layer", "Someone drilled to the middle", "They guessed"],
          a: 0,
          why: "Earthquake waves bend and change speed as they pass through different layers. Some can't get through the liquid outer core at all, which is how we know it's liquid."
        }
      ],
      check: { q: "Lava comes from...", opts: ["Magma from the mantle", "The inner core", "Rain"], a: 0, why: "Magma from the mantle, pushing up through the crust." }
    },
    {
      kind: "explain", title: "Hot, heavy and moving.", mins: 10,
      slides: [
        { title: "The Earth is still busy", pts: ["The crust is cracked into huge pieces called <b>plates</b>", "The slow mantle underneath moves them a few centimetres a year", "That's about as fast as your fingernails grow", "Where plates meet: earthquakes, volcanoes, mountains"], build: true, ptsFrom: 1,
          art: S("0 0 480 420", '<rect width="480" height="420" fill="#1d3d47"/>' + earth(240, 210, 170, false, false)),
          say: "Ask: is anywhere in the UK on the edge of a plate? (No, which is why big earthquakes are rare here.)" },
        {
          type: "vote", title: "Scariest layer?", q: "Which layer would you least like to visit?",
          opts: ["Crust", "Mantle", "Outer core", "Inner core"],
          say: "Just for fun."
        }
      ],
      check: { q: "The pieces the crust is broken into are called...", opts: ["Plates", "Bowls", "Slices"], a: 0, why: "Plates, which move very slowly." }
    }
  ],

  realworld: {
    title: "The Earth under your feet",
    text: "Iceland is built on a split between two plates, so it has volcanoes and hot springs. Compasses point north because of the liquid core. Every metal you've ever touched came out of the crust.",
    art: S("0 0 560 420", A.scene(560, 420, { ground: 380, time: "dusk", sun: [460, 90] }) + volcano(280, 380, 1.2)),
    say: "Ask: which metal thing is closest to you right now?"
  },

  exit: [
    { q: "The layer we live on is the...", opts: ["Crust", "Core"], a: 0, why: "The crust." },
    { q: "The outer core is...", opts: ["Liquid metal", "Ice"], a: 0, why: "Liquid iron and nickel." },
    { q: "Scientists learn about the inside of the Earth from...", opts: ["Earthquake waves", "Digging to the middle"], a: 0, why: "Earthquake waves." }
  ],

  driving: {
    angle: "If you could time travel 200 million years back, the continents were all joined in one giant landmass. Would you go and walk across it?",
    opts: ["Yes, big walk", "No, dinosaurs", "Pass"],
    say: "Fun one. The supercontinent was called Pangaea."
  },

  surprise: { at: "sections.1.slides.1", kind: "bird", x: 1450, y: 160, say: "Birds fly over volcanoes all the time. They do not recommend it." }
};
})();
