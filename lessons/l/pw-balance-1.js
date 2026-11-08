/* ==========================================================
   Base 5 Lessons - Physical World and Exploration
   Balance and control, lesson 1 of 3: Finding your balance
   45 minutes (Wednesday 1:15). Leads into "Move, balance, control".
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a";

function kid(x, y, o){
  o = o || {};
  var f = o.feet || 18, k = o.knee || 0, col = o.col || TEAL, hip = -70 + k * 0.5;
  var g = '<g transform="translate(' + x + ' ' + y + ')">' +
    '<ellipse cx="0" cy="4" rx="' + (f + 30) + '" ry="7" fill="' + INK + '" opacity=".12"/>' +
    '<path d="M-8 ' + hip + 'L' + (-f - k * 0.3) + ' ' + (-36 + k * 0.2) + 'L' + (-f) + ' -4M8 ' + hip + 'L' + (f + k * 0.3) + ' ' + (-36 + k * 0.2) + 'L' + f + ' -4" stroke="#2c4a6b" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
    '<path d="M' + (-f - 12) + ' 0h20M' + (f - 8) + ' 0h20" stroke="' + INK + '" stroke-width="10" stroke-linecap="round"/>' +
    '<rect x="-24" y="' + (hip - 70) + '" width="48" height="80" rx="22" fill="' + col + '" stroke="' + INK + '" stroke-width="3.5"/>';
  if(o.core) g += '<ellipse class="pulse" cx="0" cy="' + (hip - 22) + '" rx="30" ry="24" fill="' + YELLOW + '" opacity=".55"/>';
  var ay = hip - 58;
  g += o.arms === "out" ? '<path d="M-20 ' + ay + 'L-78 ' + (ay + 4) + 'M20 ' + ay + 'L78 ' + (ay + 4) + '" stroke="#f1c7a1" stroke-width="12" stroke-linecap="round"/>'
    : o.arms === "up" ? '<path d="M-18 ' + ay + 'L-40 ' + (ay - 50) + 'M18 ' + ay + 'L40 ' + (ay - 50) + '" stroke="#f1c7a1" stroke-width="12" stroke-linecap="round"/>'
    : '<path d="M-22 ' + ay + 'L-30 ' + (ay + 50) + 'M22 ' + ay + 'L30 ' + (ay + 50) + '" stroke="#f1c7a1" stroke-width="12" stroke-linecap="round"/>';
  g += '<circle cx="0" cy="' + (hip - 96) + '" r="24" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3.5"/>' +
    '<path d="M-24 ' + (hip - 100) + 'q4 -26 24 -26t24 26q-10 -10 -24 -8t-24 8z" fill="#6b4423"/>' +
    '<circle cx="-8" cy="' + (hip - 94) + '" r="3.2" fill="' + INK + '"/><circle cx="8" cy="' + (hip - 94) + '" r="3.2" fill="' + INK + '"/>' +
    '<path d="M-7 ' + (hip - 84) + 'q7 6 14 0" stroke="' + INK + '" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>';
  return g;
}
function person(x, y, feet, arms, lean, step, knee){
  return '<g' + (step ? ' data-s="' + step + '"' : "") + ' transform="translate(' + x + ' ' + y + ')"><g transform="rotate(' + (lean || 0) + ' 0 0)">' +
    kid(0, 0, { feet: Math.max(feet, 6), arms: arms > 40 ? "out" : "", knee: knee || 0, col: TEAL }) + '</g></g>';
}

window.B5LESSON = {
  id: "pw-balance-1",
  title: "Finding your balance",
  mins: 45,
  cover: { line: "Remember the dot that decides whether a tower falls? You have one too.", art: S("0 0 700 420", A.scene(700, 420, { ground: 380, sun: [620, 70] }) + '<g class="wobble">' + person(200, 378, 20, 26) + '</g>' + person(440, 378, 50, 70) + A.bambi(600, 300, 0.7)) },

  warm: {
    wordle: { word: "STEADY", hint: "Not wobbly. Calm and still.", say: "Six letters." },
    wyr: { a: "Walk a tightrope over a river", b: "Walk on stilts across a busy market", twist: "In 1859 a tightrope walker called Blondin crossed Niagara Falls on a rope. Later he did it blindfolded, and once carrying his manager on his back.", say: "Ask: which is scarier?" }
  },

  recap: {
    items: [
      { q: "Where does a good adventure happen?", a: "The stretch zone: hard enough to be exciting, not so hard it's miserable." },
      { q: "Halfway up a wall, how do you ask to rest?", a: "Shout \"Take!\"" },
      { q: "When does the dot make a tower fall?", a: "When a line straight down from it lands past the edge of the base." }
    ],
    say: "The last one is from the architecture lessons on Mondays."
  },

  objective: {
    formal: "explain how base of support and centre of mass affect balance in people.",
    mission: "Work out the science of not falling over, then test it on yourselves.",
    success: ["Say what base of support means", "Explain why bending your knees helps", "Use arms to balance"],
    say: "Read the mission. Standing up and wobbling is allowed."
  },

  sections: [
    {
      kind: "hook", title: "Your own balance point.", mins: 8,
      slides: [
        {
          title: "You have a dot too",
          text: "Your <b>centre of mass</b> is your balance point, roughly behind your belly button. Your <b>base of support</b> is the space between your feet.",
          pts: ["Keep the dot over the base: you stay up", "Let it drift outside: you have to step, or fall"],
          build: true, ptsFrom: 1,
          art: S("0 0 500 400", '<path d="M20 380H480" stroke="' + INK + '" stroke-width="4"/>' + person(150, 378, 30, 30) + person(350, 378, 30, 30, 14, 2)),
          say: "Try it: stand up, lean forward slowly until you have to take a step. That step is your dot leaving your base."
        },
        {
          type: "predict", title: "Hardest to push over?",
          q: "Which stance is hardest to push over?",
          opts: ["Feet together, standing tall", "Feet wide apart, knees bent", "Standing on one leg"],
          a: 1,
          why: "Feet wide (a bigger base) and knees bent (a lower dot). That's why rugby players, surfers and climbers crouch."
        }
      ],
      check: { q: "Your base of support is...", opts: ["The space between and under your feet", "Your favourite chair", "Your backbone"], a: 0, why: "The area you're standing on." }
    },
    {
      kind: "explore", title: "Wider, lower, and arms.", mins: 15,
      slides: [
        {
          title: "Three balance tricks",
          stack: true, artWidth: 1250,
          art: S("0 0 1000 300", '<path d="M20 280H980" stroke="' + INK + '" stroke-width="4"/>' +
            person(170, 270, 50, 30, 0, 1) + T(170, 60, "Wider base", 26, { a: "middle", f: 1 }) +
            '<g data-s="2">' + person(500, 270, 40, 30, 0, 0, 34) + T(500, 60, "Lower dot", 26, { a: "middle", f: 1 }) + T(500, 90, "bend your knees", 20, { a: "middle" }) + '</g>' +
            person(830, 270, 20, 80, 0, 3) + T(830, 60, "Arms out", 26, { a: "middle", f: 1 })),
          say: "Try each one standing up, if anyone fancies it."
        },
        {
          type: "sort", title: "More stable, or less?", q: "Does this make you steadier or wobblier?",
          bins: ["Steadier", "Wobblier"],
          cards: [
            { t: "Feet wider apart", b: 0 }, { t: "Standing on tiptoes", b: 1 }, { t: "Bending your knees", b: 0 },
            { t: "Carrying a heavy bag on one shoulder", b: 1 }, { t: "Arms out to the sides", b: 0 }, { t: "Eyes shut", b: 1 }
          ],
          why: "Eyes shut is wobblier because your eyes help your brain know where you are.",
          say: "Test the eyes shut one on one leg if anyone wants to."
        },
        {
          type: "predict", title: "Tightrope",
          q: "Why do tightrope walkers often carry a long pole?",
          opts: ["It spreads their weight out and slows down wobbles", "To hit birds", "It's for the photos"],
          a: 0,
          why: "A long pole is like very long arms: it makes tipping slower, so there's time to correct. Jay's birds are safe."
        }
      ],
      check: { q: "Which helps you balance?", opts: ["Bending your knees", "Standing on tiptoe", "Shutting your eyes"], a: 0, why: "A lower centre of mass is steadier." }
    },
    {
      kind: "explain", title: "Balance is a skill, not a gift.", mins: 10,
      slides: [
        {
          title: "Balance gets better with practice",
          pts: ["Your body learns from tiny wobbles", "Little and often beats one long go", "Slow movements build control", "Everyone starts wobbly"],
          build: true, ptsFrom: 1,
          art: S("0 0 480 400", '<path d="M20 380H460" stroke="' + INK + '" stroke-width="4"/>' + person(240, 378, 0, 70) + A.bonnie(400, 340, 0.6)),
          say: "Ask: what have you got better at with practice?"
        },
        {
          type: "vote", title: "Try one?", q: "Which balance challenge would you try?",
          opts: ["One leg for 30 seconds", "One leg, eyes shut", "Walking a line heel to toe", "Not today"],
          say: "Do it if the room's up for it. 'Not today' is fine."
        }
      ],
      check: { q: "The best way to get better at balance is...", opts: ["Little and often practice", "Being born good at it", "Never trying"], a: 0, why: "Little and often." }
    }
  ],

  realworld: {
    title: "Balance is everywhere",
    text: "Climbing, cycling, skating, surfing, standing on a moving bus, carrying shopping, stepping off a kerb. Your balance system works every second you're awake.",
    art: S("0 0 560 400", A.scene(560, 400, { ground: 360, time: "day", sun: [470, 70] }) + I("bike", 180, 340, 2.4) + I("bus", 420, 360, 1.6)),
    say: "Ask: where did you use balance today without noticing?"
  },

  exit: [
    { q: "Which makes you steadier?", opts: ["A wider base", "A narrower base"], a: 0, why: "A wider base gives more room before tipping." },
    { q: "Bending your knees makes your centre of mass...", opts: ["Lower", "Higher"], a: 0, why: "Lower, which is steadier." },
    { q: "Balance improves with...", opts: ["Practice", "Luck"], a: 0, why: "Practice, little and often." }
  ],

  driving: {
    angle: "Blondin crossed Niagara Falls on a tightrope in 1859. If you could time travel to watch, would you? Or would it be too nerve wracking to watch?",
    opts: ["Go and watch", "Too scary", "Pass"],
    say: "Fun one."
  },

  surprise: { at: "sections.1.slides.0", kind: "bird", x: 1450, y: 150, say: "Birds sleep standing on one leg. Show offs." }
};
})();
