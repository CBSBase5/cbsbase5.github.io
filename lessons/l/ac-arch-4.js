/* ==========================================================
   Base 5 Lessons - Aesthetic and Creative
   Architecture and construction, lesson 4 of 4: Buildings of 3026
   45 minutes (Monday 1:15). Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a", GREEN = "#3f9a5a", GLASS = "#bfe6ef", WOOD = "#b5793f";

function eco(x, y, s){
  var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
    '<path d="M-110 0V-150H110V0Z" fill="' + WOOD + '" stroke="' + INK + '" stroke-width="4"/>';
  for(var i = 0; i < 4; i++) g += '<path d="M-110 ' + (-30 - i * 30) + 'H110" stroke="#8a5a2b" stroke-width="2"/>';
  g += '<rect x="-80" y="-120" width="50" height="50" fill="' + GLASS + '" stroke="' + INK + '" stroke-width="3"/><rect x="30" y="-120" width="50" height="50" fill="' + GLASS + '" stroke="' + INK + '" stroke-width="3"/>' +
    '<rect x="-20" y="-60" width="40" height="60" fill="' + PINK + '" stroke="' + INK + '" stroke-width="3"/>' +
    '<g data-s="1"><path d="M-120 -150Q0 -190 120 -150Z" fill="' + GREEN + '" stroke="' + INK + '" stroke-width="4"/><circle cx="-60" cy="-172" r="12" fill="' + GREEN + '" stroke="' + INK + '" stroke-width="3"/><circle cx="50" cy="-176" r="14" fill="' + GREEN + '" stroke="' + INK + '" stroke-width="3"/></g>' +
    '<g data-s="2"><rect class="pulse" x="70" y="-230" width="80" height="44" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="3" transform="rotate(-15 110 -208)"/><path d="M84 -214l56 -14M90 -200l56 -14" stroke="#7fd0e6" stroke-width="2"/></g>' +
    '<g data-s="3"><path d="M-150 0q20 -40 40 0" fill="#7fbfd0" stroke="' + INK + '" stroke-width="3"/><rect x="-160" y="-46" width="40" height="46" rx="6" fill="#7fbfd0" stroke="' + INK + '" stroke-width="3"/>' + T(-140, -54, "rain", 18, { a: "middle" }) + '</g>' +
    '</g>';
  return g;
}

window.B5LESSON = {
  id: "ac-arch-4",
  title: "Buildings of 3026",
  mins: 45,
  cover: { line: "You've learned what makes a building stand, last and get drawn. Now: what should we build next?", art: S("0 0 700 440", A.scene(700, 440, { ground: 410, sun: [600, 80] }) + eco(350, 408, 1.3) + A.bonnie(580, 372, 0.5) + A.bird(150, 120, 0.9)) },

  warm: {
    wordle: { word: "FUTURE", hint: "The time that hasn't happened yet. 3026 is in it.", say: "Six letters." },
    wyr: {
      a: "Live in a house that floats", b: "Live in a house underground",
      twist: "Both exist already. Floating homes are being built in places that flood, and some underground homes stay warm all year with very little heating.",
      say: "Ask: what's the first problem you'd have?"
    }
  },

  recap: {
    items: [
      { q: "What is a plan?", a: "The view from above, with the roof off." },
      { q: "On a 1:50 plan, how long is 4 cm in real life?", a: "4 x 50 = 200 cm: 2 metres." },
      { q: "How is a door shown on a plan?", a: "A line with an arc showing the swing." }
    ],
    say: "From last Monday."
  },

  objective: {
    formal: "explain how form, function and the environment shape the design of a building.",
    mission: "Design the buildings of 3026, in your head and out loud: what would they need to do?",
    success: ["Say what form and function mean", "Name ways buildings can be kinder to the planet", "Explain a design choice"],
    say: "Read the mission. This is the last architecture lesson."
  },

  sections: [
    {
      kind: "hook", title: "Form and function.", mins: 8,
      slides: [
        {
          title: "Form and function",
          pts: ["<b>Function</b>: what the building has to do (keep people dry, hold 300 pupils, store trains)", "<b>Form</b>: what it looks like", "Architects argue about which matters most. Have done for centuries."],
          build: true, ptsFrom: 1,
          art: S("0 0 520 400", A.scene(520, 400, { ground: 380, sun: [440, 60] }) + eco(170, 378, 0.9) + '<path d="M330 378V200Q410 120 490 200V378Z" fill="' + GLASS + '" stroke="' + INK + '" stroke-width="4"/>'),
          say: "Ask: which matters more, how it looks or what it does?"
        },
        {
          type: "vote", title: "Your call", q: "If you had to pick one, which matters more?",
          opts: ["Form: how it looks", "Function: what it does", "Both, equally"],
          why: "A famous architect said 'form follows function': work out the job first, and the look comes from that. Plenty of people disagree."
        }
      ],
      check: { q: "A building's 'function' is...", opts: ["What it has to do", "What colour it is", "How old it is"], a: 0, why: "What it has to do." }
    },
    {
      kind: "explore", title: "Building for a hotter, busier planet.", mins: 15,
      slides: [
        { title: "Kinder to the planet", text: "Buildings use loads of energy. Future ones will need to use less:", art: S("0 0 560 440", A.scene(560, 440, { ground: 420, sun: [80, 70] }) + eco(300, 418, 1.3)),
          pts: ["A green roof soaks up rain and keeps it cool", "Solar panels make electricity", "Rain is collected and used again"], build: true, ptsFrom: 1,
          say: "Click through the three. Ask which they'd want on their house." },
        {
          type: "sort", title: "Saves energy, or wastes it?", q: "Sort the design ideas.",
          bins: ["Saves energy", "Wastes energy"],
          cards: [
            { t: "Thick insulation in the walls", b: 0 }, { t: "Windows that don't close properly", b: 1 },
            { t: "Solar panels on the roof", b: 0 }, { t: "Heating left on with doors open", b: 1 },
            { t: "Big windows facing the sun in winter", b: 0 }, { t: "Lights on all night in empty offices", b: 1 }
          ],
          say: "Ask which one is easiest to do at home."
        },
        {
          type: "predict", title: "Wooden skyscrapers?",
          q: "Some new tall buildings are being made mostly from...",
          opts: ["Specially made wood", "Cardboard", "Ice"],
          a: 0,
          why: "Engineered wood: layers glued together so it's very strong. Trees soak up carbon as they grow, so wood can be kinder to the planet than concrete or steel.",
          say: "Link back to lesson 1: the right stuff for the job."
        }
      ],
      check: { q: "Which helps a building use less energy?", opts: ["Good insulation", "Leaving doors open", "More lights"], a: 0, why: "Insulation keeps the heat in, so less heating is needed." }
    },
    {
      kind: "explain", title: "Your building, out loud.", mins: 10,
      slides: [
        {
          type: "vote", title: "Base 5 in 3026", q: "If Base 5 had a new building in 3026, what should it have most?",
          opts: ["A quiet room", "A climbing wall", "A garden on the roof", "A dog room for Bonnie"],
          why: "No wrong answer. Architects call this a design brief: a list of what the building must do for the people using it.",
          say: "Ask for one reason each. This is a real design conversation."
        },
        {
          title: "Every design is a choice",
          pts: ["Who is it for?", "What does it need to do?", "What should it be made of?", "How will it stay up, and how will it last?"],
          build: true, ptsFrom: 1,
          art: S("0 0 480 400", A.scene(480, 400, { ground: 380, hills: false }) + eco(240, 380, 1.1) + A.jay(410, 330, 1.2)),
          say: "The last question pulls in all four lessons."
        }
      ],
      check: { q: "A design brief is...", opts: ["A list of what a building must do for its users", "A very short building", "The architect's lunch"], a: 0, why: "The list of needs a design has to meet." }
    }
  ],

  realworld: {
    title: "Someone designs every building",
    text: "Every school, house, shop and station was somebody's design choice. Architects, engineers, builders, surveyors and planners all have a say, and some of those jobs could be yours.",
    art: S("0 0 560 420", A.scene(560, 420, { ground: 400, time: "dusk", sun: [90, 90] }) + eco(280, 398, 1.2) + '<g class="float">' + A.bird(470, 80, 0.9) + '</g>'),
    say: "Ask: which of those jobs sounds most interesting?"
  },

  exit: [
    { q: "'Form' means...", opts: ["What a building looks like", "What it does"], a: 0, why: "Form is the look. Function is the job." },
    { q: "Which helps a building save energy?", opts: ["Solar panels and insulation", "Leaving lights on"], a: 0, why: "Making energy, and keeping heat in." },
    { q: "Of everything in these four lessons, what keeps a building up?", opts: ["Shape, base and materials", "Paint"], a: 0, why: "Shape (triangles, arches), a good base, and the right materials." }
  ],

  driving: {
    angle: "If you could time travel to 3026 and see what we build, should you bring the designs back? Or let people work it out themselves?",
    opts: ["Bring them back", "Let people work it out", "Pass"],
    say: "Ask: what if the 3026 buildings aren't better?"
  },

  surprise: { at: "sections.1.slides.0", kind: "bonnie", x: 1460, y: 140, w: 110, say: "Bonnie's design brief for 3026: underfloor heating. That's it. That's the whole brief." }
};
})();

/* ---------- Rework, 23 Nov 2026 ----------
   Hot take opener (the hook comes straight after it), harder questions with
   tempting wrong answers, and something for the room to do on every slide.
   Read by lessons/engine.js (opener, rework, do, type "hot", bleed).
   Board edits (edits) still win over anything here. */
(function(L){
if(!L) return;
L.opener = [
  { take: "A building that looks ugly has failed, even if it works perfectly.", flip: "People have argued about this for centuries. Famous artists signed a letter calling the Eiffel Tower ugly when it was being built. Now it is one of the most loved buildings on Earth." }
];
L.rework = {
  "sections.0.slides.0.do": { how: "point", ask: "Point at something in this room that is all function and no form.", a: "Radiators, plug sockets, fire doors. They just do a job." },
  "sections.0.check": { q: "A train station's 'function' includes...", opts: ["Moving lots of people safely and quickly", "Having a famous clock", "Looking modern", "Being in the town centre"], a: 0, why: "Function is the job it does. A famous clock and a modern look are form, or nice extras." },
  "sections.1.slides.0.bleed": true,
  "sections.1.slides.0.do": { how: "pair", ask: "Which of these could this school add next year?", a: "Solar panels and rain butts are the cheapest starts. A green roof needs a strong, flat roof." },
  "sections.1.slides.2.opts": ["Specially made wood", "Recycled plastic", "Carbon fibre"],
  "sections.1.slides.2.why": "Engineered wood, sometimes called mass timber: layers glued crossways so it is very strong. Some wooden towers are now over 80 metres tall.",
  "sections.1.slides.+": { type: "hot", take: "Building with wood is bad for the planet because it means cutting down trees.", flip: "It is more complicated. Trees store carbon, and replanted forests grow it back. Making concrete and steel releases a lot of carbon. Many scientists say wood is the greener choice, as long as the forests are replaced." },
  "sections.1.check": { q: "In winter, which loses the most heat from a house?", opts: ["A roof with no insulation", "Opening the front door twice a day", "One old light bulb", "The fridge"], a: 0, why: "About a quarter of a home's heat can escape through an uninsulated roof." },
  "sections.2.slides.1.bleed": true,
  "sections.2.slides.1.do": { how: "think", ask: "Answer one of the four questions for your dream building.", a: "Any answer works if you can say why." },
  "sections.2.check": { q: "A design brief is...", opts: ["What the building must do, and who it is for", "The first sketch of the building", "The architect's price", "The planning permission letter"], a: 0, why: "The brief comes first: the jobs and the people. Sketches come after." },
  "realworld.do": { how: "hands", ask: "Which job would you pick: architect, engineer, builder, surveyor or planner?", a: "Engineers make it stand up, surveyors measure, planners decide what can go where." },
  "exit.0": { q: "'Form' means...", opts: ["What a building looks like", "What it does", "What it is made of"], a: 0, why: "Form is the look. Function is the job." },
  "exit.1": { q: "Which saves the most energy?", opts: ["Insulation and solar panels", "Bigger windows everywhere", "Taller ceilings"], a: 0, why: "Big windows and tall ceilings usually lose heat. Insulation keeps it in; solar makes power." },
  "exit.2": { q: "Of these four lessons, what keeps a building up?", opts: ["Shape, base and materials", "Looks and colour", "Height and glass"], a: 0, why: "Shape, base and materials, every time." }
};
})(window.B5LESSON);
