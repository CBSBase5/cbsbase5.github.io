/* ==========================================================
   Base 5 Lessons - Aesthetic and Creative
   Architecture and construction, lesson 3 of 4: Draw like an architect
   45 minutes (Monday 1:15). Leads into "Draw like an architect".
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a", BLUE = "#3a7bd5";

function planView(x, y, s, step){
  var g = '<g' + (step ? ' data-s="' + step + '"' : "") + ' transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
    '<rect x="0" y="0" width="300" height="220" fill="#fffdf8" stroke="' + INK + '" stroke-width="10"/>' +
    '<path d="M170 0V220" stroke="' + INK + '" stroke-width="6"/>' +
    '<rect x="110" y="214" width="44" height="12" fill="#fffdf8"/><path d="M110 220L110 176" stroke="' + INK + '" stroke-width="3"/><path d="M110 176A44 44 0 0 1 154 220" fill="none" stroke="' + INK + '" stroke-width="2" stroke-dasharray="5 4"/>' +
    '<rect x="164" y="80" width="12" height="40" fill="#fffdf8"/><path d="M170 80V120" stroke="' + INK + '" stroke-width="2"/><path d="M170 80A40 40 0 0 1 210 120" fill="none" stroke="' + INK + '" stroke-width="2" stroke-dasharray="5 4"/>' +
    '<rect x="40" y="-6" width="80" height="12" fill="#fffdf8"/><path d="M40 -4H120M40 0H120M40 4H120" stroke="' + BLUE + '" stroke-width="2"/>' +
    '<rect x="294" y="40" width="12" height="70" fill="#fffdf8"/><path d="M296 40V110M300 40V110M304 40V110" stroke="' + BLUE + '" stroke-width="2"/>' +
    '<rect x="196" y="140" width="80" height="60" rx="6" fill="#f3d9e2" stroke="' + INK + '" stroke-width="2.5"/><rect x="200" y="144" width="30" height="20" rx="4" fill="#fff" stroke="' + INK + '" stroke-width="2"/>' +
    '<rect x="20" y="30" width="60" height="40" rx="4" fill="#e3f1f4" stroke="' + INK + '" stroke-width="2.5"/>' +
    T(85, 140, "Living", 18, { a: "middle" }) + T(236, 50, "Bedroom", 18, { a: "middle" }) + '</g>';
  return g;
}
function elevation(x, y, s, step){
  return '<g' + (step ? ' data-s="' + step + '"' : "") + ' transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
    '<path d="M0 220V90L150 0L300 90V220Z" fill="#fbe3ea" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/><path d="M0 90H300" stroke="' + INK + '" stroke-width="3"/>' +
    '<rect x="40" y="120" width="70" height="50" fill="#bfe6ef" stroke="' + INK + '" stroke-width="3"/><path d="M75 120V170M40 145H110" stroke="' + INK + '" stroke-width="2"/>' +
    '<rect x="190" y="120" width="70" height="50" fill="#bfe6ef" stroke="' + INK + '" stroke-width="3"/><path d="M225 120V170M190 145H260" stroke="' + INK + '" stroke-width="2"/>' +
    '<rect x="125" y="140" width="50" height="80" fill="' + PINK + '" stroke="' + INK + '" stroke-width="3"/><circle cx="165" cy="182" r="4" fill="' + INK + '"/>' +
    '<rect x="200" y="20" width="30" height="50" fill="#c8664a" stroke="' + INK + '" stroke-width="3"/></g>';
}
function twoViews(){
  return S("0 0 820 380", planView(40, 70, 1, 1) + T(190, 345, "Plan: from above", 26, { a: "middle", f: 1 }) +
    elevation(470, 80, 1, 2) + T(620, 345, "Elevation: from the side", 26, { a: "middle", f: 1 }) +
    '<g data-s="1">' + A.bird(190, 30, 0.8) + '<path d="M190 52V62" stroke="' + INK + '" stroke-width="3" stroke-dasharray="4 4"/></g>');
}
function symbols(){
  var g = "";
  var items = [
    ['<rect x="-50" y="-6" width="100" height="12" fill="' + INK + '"/>', "Wall", "thick line"],
    ['<path d="M-40 0V-60" stroke="' + INK + '" stroke-width="4"/><path d="M-40 -60A60 60 0 0 1 20 0" fill="none" stroke="' + INK + '" stroke-width="3" stroke-dasharray="6 5"/><path d="M-50 0H-40M20 0H50" stroke="' + INK + '" stroke-width="10"/>', "Door", "arc shows the swing"],
    ['<path d="M-50 -6H50M-50 0H50M-50 6H50" stroke="' + BLUE + '" stroke-width="3"/>', "Window", "three thin lines"],
    ['<rect x="-40" y="-60" width="80" height="80" fill="none" stroke="' + INK + '" stroke-width="3"/><path d="M-40 -44H40M-40 -28H40M-40 -12H40M-40 4H40" stroke="' + INK + '" stroke-width="2"/><path d="M0 14V-50M-8 -40L0 -52L8 -40" stroke="' + ORANGE + '" stroke-width="3" fill="none"/>', "Stairs", "arrow points up"]
  ];
  items.forEach(function(it, i){
    var cx = 125 + i * 250;
    g += '<g data-s="' + (i + 1) + '"><g transform="translate(' + cx + ' 120)">' + it[0] + '</g>' + T(cx, 196, it[1], 28, { a: "middle", f: 1 }) + T(cx, 228, it[2], 20, { a: "middle" }) + '</g>';
  });
  return S("0 0 1000 250", g);
}

window.B5LESSON = {
  id: "ac-arch-3",
  title: "Draw like an architect",
  mins: 45,
  cover: { line: "Before anything gets built, somebody draws it. From above, from the side, and to scale.", art: twoViews() },

  warm: {
    wordle: { word: "SCALE", hint: "A map uses one. So does a plan: 1 cm on paper is 50 cm in real life.", say: "Five letters." },
    wyr: {
      a: "Design a house for Bonnie", b: "Design a house for a giant",
      artA: S("-120 -90 240 170", A.bonnie(0, 0, 1.2)), artB: S("0 0 300 200", '<rect x="40" y="20" width="220" height="180" fill="#fbe3ea" stroke="' + INK + '" stroke-width="4"/><rect x="120" y="110" width="60" height="90" fill="' + PINK + '" stroke="' + INK + '" stroke-width="3"/>'),
      twist: "Bonnie's house would need a sofa and a biscuit cupboard. The giant's would need a door as tall as a bus.",
      say: "Ask: what would be the first thing on the plan?"
    }
  },

  recap: {
    items: [
      { q: "What did the Romans build the Pantheon dome from?", a: "Concrete, nearly 1,900 years ago." },
      { q: "What made skyscrapers possible?", a: "Steel frames and safe lifts." },
      { q: "What helps a building last?", a: "Tough materials, looking after it, being useful, and a bit of luck." }
    ],
    say: "From last Monday."
  },

  objective: {
    formal: "read and draw simple plans and elevations using architects' symbols and scale.",
    mission: "Learn the secret language architects use to tell builders exactly what to make.",
    success: ["Tell a plan from an elevation", "Read the symbols for doors, windows and stairs", "Use a scale to find a real size"],
    say: "Read the mission."
  },

  sections: [
    {
      kind: "hook", title: "From above, and from the side.", mins: 8,
      slides: [
        { title: "Two ways to look at a building", text: "Architects draw the same building in different views:", stack: true, artWidth: 1150, art: twoViews(),
          say: "The bird is looking down: that's the plan. Ask: what can you see in one view but not the other?" },
        {
          type: "predict", title: "Name that view",
          q: "A drawing shows a building as if you are a bird looking straight down, with the roof taken off. What is it called?",
          opts: ["A plan", "An elevation", "A selfie"],
          a: 0,
          why: "A plan: the view from above with the roof off, so you can see the rooms."
        }
      ],
      check: { q: "Which view shows how tall the roof is?", opts: ["The elevation", "The plan"], a: 0, why: "The elevation shows the side, so you see the height." }
    },
    {
      kind: "explore", title: "Symbols and scale.", mins: 15,
      slides: [
        { title: "Architects' symbols", text: "Every architect uses the same symbols, so any builder can read the plan:", stack: true, artWidth: 1300, art: symbols(),
          say: "Ask someone to point to the door on the earlier plan (press M to jump back)." },
        {
          type: "sort", title: "Plan or elevation?", q: "Which drawing would show this?",
          bins: ["Plan (from above)", "Elevation (from the side)"],
          cards: [
            { t: "Which way the doors open", b: 0 }, { t: "How tall the roof is", b: 1 },
            { t: "The shape of the windows from outside", b: 1 }, { t: "The layout of the rooms", b: 0 },
            { t: "Where the bed goes", b: 0 }, { t: "What the front of the house looks like", b: 1 }
          ],
          say: "Ask why each one fits."
        },
        {
          title: "Scale: shrinking it to fit",
          text: "A real house won't fit on paper, so we shrink everything by the same amount.",
          pts: ["<b>1:50</b> means 1 cm on paper is 50 cm in real life", "2 cm on paper is 1 metre", "Multiply the drawing by 50 to get the real size"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 300", '<rect x="40" y="40" width="160" height="120" fill="#fffdf8" stroke="' + INK + '" stroke-width="6"/>' + T(120, 190, "8 cm on paper", 22, { a: "middle", f: 1 }) +
            '<path d="M230 100H290M278 88L292 100L278 112" stroke="' + ORANGE + '" stroke-width="5" fill="none"/>' + T(260, 80, "x 50", 24, { a: "middle", f: 1, c: ORANGE }) +
            '<rect x="310" y="20" width="190" height="160" fill="#fbe3ea" stroke="' + INK + '" stroke-width="6"/>' + T(405, 210, "4 m for real", 22, { a: "middle", f: 1 })),
          say: "8 x 50 = 400 cm, which is 4 metres."
        },
        {
          type: "predict", title: "How long is the wall?",
          q: "On a 1:50 plan, a wall is 6 cm long. How long is the real wall?",
          opts: ["3 metres", "6 metres", "50 cm"],
          a: 0,
          why: "6 x 50 = 300 cm, which is 3 metres.",
          say: "Calculators are fine."
        }
      ],
      check: { q: "On a plan, a door is shown by...", opts: ["A line with an arc for the swing", "Three thin lines", "A drawing of a doorbell"], a: 0, why: "A line with an arc. Three thin lines is a window." }
    },
    {
      kind: "explain", title: "Why draw it first?", mins: 10,
      slides: [
        {
          title: "Why draw it first?",
          pts: ["<b>Mistakes are cheap on paper</b>, and very expensive in concrete", "<b>Builders need exact sizes</b>", "<b>Everyone agrees</b> before work starts", "<b>The council checks</b> plans before big building work"],
          build: true, ptsFrom: 1,
          art: S("0 0 480 400", planView(60, 60, 1.2) + A.jay(420, 340, 1.1)),
          say: "Ask: what's the most expensive mistake you could make building a house?"
        },
        {
          type: "vote", title: "Pencil or computer?", q: "Would you rather design by hand or on a computer?",
          opts: ["By hand", "On a computer", "Both"],
          why: "Most architects use computer design (CAD) now, but lots still sketch by hand first to get ideas down fast."
        }
      ],
      check: { q: "Why do architects draw plans before building?", opts: ["Fixing a mistake on paper is much cheaper", "Builders like pictures", "It's tradition"], a: 0, why: "Rubbing out a line is cheaper than knocking down a wall." }
    }
  ],

  realworld: {
    title: "Plans are everywhere",
    text: "Floor plans when people look at houses to rent or buy. Flat pack furniture instructions. The fire escape map on the back of a door. All plans, all using the same tricks.",
    art: S("0 0 560 420", planView(110, 80, 1.1) + A.bird(470, 60, 0.9)),
    say: "Ask: where's the nearest fire escape plan to this room?"
  },

  exit: [
    { q: "A view from above, with the roof off, is a...", opts: ["Plan", "Elevation"], a: 0, why: "A plan." },
    { q: "Three thin lines in a wall on a plan mean...", opts: ["A window", "A door", "A crack"], a: 0, why: "A window. A door has an arc." },
    { q: "On a 1:50 plan, 2 cm is...", opts: ["1 metre", "2 metres", "50 cm"], a: 0, why: "2 x 50 = 100 cm = 1 metre." }
  ],

  driving: {
    angle: "If you could take a laptop with design software back to the Romans, should you? They managed the Pantheon without it.",
    opts: ["Yes, imagine what they'd build", "No, they did fine", "Pass"],
    say: "Ask: what might change if they had it?"
  },

  surprise: { at: "sections.1.slides.2", kind: "bonnie", x: 1460, y: 700, w: 110, say: "Bonnie's plan for the perfect house: one room. It is entirely sofa." }
};
})();
