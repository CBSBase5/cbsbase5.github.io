/* ==========================================================
   Base 5 Lessons - Preparation for Adulthood
   Transport and travel, lesson 1 of 3: Ways to get about
   30 minutes (Friday PFA): one warm up. Leads into "Getting around".
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a";

function rating(x, y, n, col){ var g = ""; for(var i = 0; i < 3; i++) g += '<circle cx="' + (x + i * 26) + '" cy="' + y + '" r="10" fill="' + (i < n ? col : "#e6dfd2") + '" stroke="' + INK + '" stroke-width="2"/>'; return g; }
function row(y, ic, name, fast, cheap, easy, step){
  return '<g data-s="' + step + '">' + I(ic, 90, y + 30, 0.55) + T(160, y + 10, name, 26, { f: 1 }) +
    rating(470, y, fast, ORANGE) + rating(640, y, cheap, TEAL) + rating(810, y, easy, PINK) + '</g>';
}

window.B5LESSON = {
  id: "pfa-transport-1",
  title: "Ways to get about",
  mins: 30,
  startMins: 4,
  finishMins: 5,
  cover: {
    line: "Bus, train, tram, taxi, bike, feet. Picking the right one is half the journey.",
    art: S("0 0 700 420", '<path d="M0 360h700" stroke="' + INK + '" stroke-width="4"/>' + I("bus", 150, 360, 1.6) + I("train", 470, 360, 1.7) + I("bike", 320, 230, 0.9) + I("walk", 640, 360, 1.1) + A.bird(600, 90, 0.9) + A.bonnie(70, 330, 0.45))
  },

  warm: {
    wordle: { word: "TRAIN", hint: "It runs on rails and stops at stations.", say: "Quick one: we only have half an hour." },
    wyr: {
      a: "Travel by steam train in 1851", b: "Travel by driverless pod in 2051",
      artA: S("0 0 300 200", I("train", 150, 170, 1.8)),
      artB: S("0 0 300 200", '<ellipse cx="150" cy="120" rx="110" ry="50" fill="#bfe6ef" stroke="' + INK + '" stroke-width="4"/><circle cx="90" cy="168" r="14" fill="' + INK + '"/><circle cx="210" cy="168" r="14" fill="' + INK + '"/>'),
      twist: "In 1851 millions of people took the train to London to see the Great Exhibition. For lots of them it was their first ever train ride.",
      say: "Tap a side for each person."
    }
  },

  recap: {
    items: [
      { q: "How did you get to school today?", a: "Taxi, minibus, car, bus, walking: all transport." },
      { q: "Name three ways to travel without a car.", a: "Bus, train, tram, bike, walking, ferry, scooter..." }
    ],
    say: "Fast. Two cards only today."
  },

  objective: {
    formal: "compare types of transport and choose the right one for a journey.",
    mission: "Plan how to get from A to B like a pro: fastest, cheapest, or easiest.",
    success: ["Name the main types of public transport", "Say which is best for different journeys", "Know what to have ready before a trip"],
    say: "Read the mission."
  },

  sections: [
    {
      kind: "hook", title: "So many ways to get about.", mins: 5,
      slides: [
        {
          title: "So many ways",
          stack: true, artWidth: 1300,
          text: "Most journeys have more than one option:",
          art: A.iconRow([["walk", "Walk"], ["bike", "Bike"], ["bus", "Bus"], ["train", "Train"], ["taxi", "Taxi"], ["boat", "Ferry"]], { build: false, s: 0.95, h: 230 }),
          say: "Ask: which have you used on your own? With someone?"
        }
      ],
      check: {
        q: "Which of these is public transport?",
        opts: ["A bus", "Your own bike", "Walking"],
        a: 0,
        why: "A bus: anyone can pay and get on. Bikes and walking are your own transport.",
        say: "Quick one."
      }
    },
    {
      kind: "explore", title: "Fast, cheap or easy?", mins: 10,
      slides: [
        {
          title: "Fast, cheap or easy?",
          text: "Usually you get two out of three.",
          stack: true, artWidth: 1150,
          art: S("0 0 940 400",
            T(470, 40, "Fast", 26, { a: "middle", f: 1, c: ORANGE }) + T(640, 40, "Cheap", 26, { a: "middle", f: 1, c: TEAL }) + T(810, 40, "Easy", 26, { a: "middle", f: 1, c: PINK }) +
            row(80, "walk", "Walk", 1, 3, 3, 1) + row(150, "bus", "Bus", 2, 2, 2, 2) + row(220, "train", "Train", 3, 1, 2, 3) + row(290, "taxi", "Taxi", 3, 0, 3, 4) + row(360, "bike", "Bike", 2, 3, 1, 5)),
          say: "Argue about the dots. Is walking always easy? Is a train always fast?"
        },
        {
          type: "sort",
          title: "Best way for the journey?",
          q: "Walk, bus or train?",
          bins: ["Walk", "Bus", "Train"],
          cards: [
            { t: "To the corner shop, 5 minutes away", b: 0 },
            { t: "Into town, 3 miles", b: 1 },
            { t: "To London from the south coast", b: 2 },
            { t: "To a friend's house two streets away", b: 0 },
            { t: "To the cinema across town", b: 1 },
            { t: "To Scotland", b: 2 }
          ],
          say: "Some could go either way. That's fine: ask why."
        }
      ],
      check: {
        q: "Which is usually fastest for a long journey between cities?",
        opts: ["Train", "Bus", "Walking"],
        a: 0,
        why: "Usually the train. Coaches are often cheaper but slower.",
        say: "Quick."
      }
    },
    {
      kind: "explain", title: "What to have ready.", mins: 6,
      slides: [
        {
          title: "Before you go",
          stack: true, artWidth: 1300,
          text: "Four things make almost any journey smoother:",
          art: A.iconRow([["ticket", "A ticket or pass", "or money, or a card"], ["map", "The route", "and where to get off"], ["phone", "A charged phone", "and who to call"], ["star", "A plan B", "if it goes wrong"]], { build: true, s: 0.95, h: 250 }),
          say: "Plan B gets a whole lesson in two weeks."
        },
        {
          type: "predict",
          title: "No bus",
          q: "Your bus doesn't turn up. What is the best first move?",
          opts: ["Check the timetable or app for the next one", "Walk home, 10 miles", "Move into the bus shelter"],
          a: 0,
          why: "Check when the next one is. Buses are often late, not cancelled. If it is a long wait, then think about plan B.",
          say: "Let them enjoy the third option."
        }
      ],
      check: {
        q: "Before a bus trip, which is most useful to know?",
        opts: ["Where to get off", "The driver's name", "What colour the bus is"],
        a: 0,
        why: "Where to get off. Colour helps a bit. The driver's name, less so.",
        say: "Last check."
      }
    }
  ],

  realworld: {
    title: "Your ticket to everything",
    text: "College, a job, seeing friends, a day at the coast: getting about on your own opens up most of adult life. Every journey you plan now is practice.",
    art: S("0 0 560 400", '<path d="M0 360h560" stroke="' + INK + '" stroke-width="4"/>' + I("train", 280, 360, 2.2) + I("ticket", 280, 160, 1.3)),
    say: "Ask: where would you go first if you could get there on your own?"
  },

  exit: [
    { q: "For a 5 minute trip to the shop, the best option is usually...", opts: ["Walking", "A train", "A taxi"], a: 0, why: "Walking: free, and probably quicker than waiting for anything." },
    { q: "Which should you know before getting on a bus?", opts: ["Where to get off", "How many seats it has"], a: 0, why: "Where to get off, and roughly how long it takes." }
  ],

  driving: {
    angle: "If time travel existed, would we still need buses? Or would you rather a bus that also goes to 1851?",
    opts: ["Time machine, obviously", "Buses, they're reliable-ish", "A time travelling bus"],
    say: "Fun one to end the week."
  },

  surprise: {
    at: "sections.1.slides.0", kind: "bird", x: 1440, y: 160,
    say: "Birds: fast, free and easy. Three out of three. Show offs."
  }
};
})();
