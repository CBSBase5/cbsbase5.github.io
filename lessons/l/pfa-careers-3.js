/* ==========================================================
   Base 5 Lessons - Preparation for Adulthood
   Careers for the future, lesson 3 of 3: What suits me?
   30 minutes (Friday PFA, last day of term): one warm up.
   Leads into "Career explorer". Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a";

function dial(x, y, left, right, pos, step){
  return '<g data-s="' + step + '" transform="translate(' + x + ' ' + y + ')"><rect x="0" y="-12" width="420" height="24" rx="12" fill="#e6dfd2" stroke="' + INK + '" stroke-width="3"/>' +
    '<circle class="pulse" cx="' + (pos * 420) + '" cy="0" r="20" fill="' + PINK + '" stroke="' + INK + '" stroke-width="4"/>' +
    T(-16, 8, left, 24, { a: "end", b: 1 }) + T(436, 8, right, 24, { b: 1 }) + '</g>';
}

window.B5LESSON = {
  id: "pfa-careers-3",
  title: "What suits me?",
  mins: 30,
  startMins: 4,
  finishMins: 5,
  cover: { line: "Indoors or outdoors? People, things or ideas? The clues to a good fit are already in you.", art: S("0 0 700 420", A.scene(700, 420, { ground: 380, sun: [110, 80] }) + '<g class="float">' + I("star", 350, 220, 2.2) + '</g>' + A.jay(200, 330, 1.4) + A.bonnie(500, 350, 0.6) + A.bambi(600, 320, 0.6)) },

  warm: {
    wordle: { word: "SKILL", hint: "Something you're good at, or getting good at.", say: "Five letters, last lesson of term." },
    wyr: { a: "Work outdoors in the rain", b: "Work indoors with no windows", twist: "Neither is perfect. Most jobs are a mix, and knowing which you prefer is useful.", say: "Quick." }
  },

  recap: {
    items: [
      { q: "Name a job that vanished.", a: "Lamplighter, knocker upper, switchboard operator..." },
      { q: "Which skills stay useful?", a: "Caring, fixing, ideas, talking and calming people." }
    ],
    say: "From last Friday."
  },

  objective: {
    formal: "match my interests and strengths to types of work.",
    mission: "Find your own clues: what you like, what you're good at, and where that might lead.",
    success: ["Say if I lean to people, things or ideas", "Name one strength that isn't a school subject", "Name a job that might fit"],
    say: "Nothing here is a decision. It's just clues."
  },

  sections: [
    {
      kind: "hook", title: "Your clues.", mins: 5,
      slides: [
        { title: "Your clue dials", text: "Everyone sits somewhere different on these. There's no right end:", stack: true, artWidth: 1150,
          art: S("0 -40 760 360", dial(170, 20, "Indoors", "Outdoors", 0.6, 1) + dial(170, 110, "Quiet", "Busy", 0.3, 2) + dial(170, 200, "Screens", "Hands on", 0.7, 3) + dial(170, 290, "On my own", "In a team", 0.4, 4)),
          say: "Ask each person to say where they'd put themselves on one dial. Passing is fine." }
      ],
      check: { q: "Is there a right end of each dial?", opts: ["No, both ends suit different jobs", "Yes, always outdoors", "Yes, always busy"], a: 0, why: "Both ends suit different jobs." }
    },
    {
      kind: "explore", title: "People, things or ideas?", mins: 10,
      slides: [
        {
          type: "sort", title: "People, things or ideas?", q: "What is each job mostly about?",
          bins: ["People", "Things", "Ideas"],
          cards: [
            { t: "Nurse", b: 0 }, { t: "Mechanic", b: 1 }, { t: "Game designer", b: 2 },
            { t: "Care worker", b: 0 }, { t: "Carpenter", b: 1 }, { t: "Scientist", b: 2 }
          ],
          say: "Many jobs are a mix: ask which ones could go in two boxes."
        },
        {
          type: "predict", title: "A good fit",
          q: "Someone loves animals and being outdoors. Which might suit them?",
          opts: ["Farm worker, dog walker or vet nurse", "Office accountant", "Call centre"],
          a: 0,
          why: "Jobs with animals and fresh air match both clues. The others could still suit them, but would miss both."
        }
      ],
      check: { q: "A carpenter's job is mostly about...", opts: ["Things", "People", "Ideas"], a: 0, why: "Things: making and fixing with wood." }
    },
    {
      kind: "explain", title: "Strengths you might not count.", mins: 6,
      slides: [
        {
          title: "Strengths aren't just subjects",
          pts: ["Being calm with animals", "Noticing tiny details", "Being good at game strategy", "Making people laugh", "Fixing or taking things apart"],
          build: true, ptsFrom: 1,
          art: S("0 0 480 400", A.scene(480, 400, { ground: 360 }) + A.bonnie(150, 320, 0.8) + '<g class="float">' + I("star", 340, 200, 1.6) + '</g>'),
          say: "Ask: which of these are you good at? Anyone can name one for someone else, kindly."
        }
      ],
      check: { q: "Which of these counts as a strength for work?", opts: ["All of them", "Only maths", "Only English"], a: 0, why: "All of them. Employers want lots of different strengths." }
    }
  ],

  realworld: {
    title: "Careers advisers are free",
    text: "Schools and colleges have careers advisers whose whole job is helping you find a good fit. You can ask them anything, as many times as you like.",
    art: S("0 0 560 400", A.scene(560, 400, { ground: 360, time: "dusk", sun: [460, 80] }) + A.jay(200, 300, 1.6) + '<g class="float">' + I("briefcase", 400, 320, 1.4) + '</g>'),
    say: "Ask: what would you ask a careers adviser?"
  },

  exit: [
    { q: "A nurse's job is mostly about...", opts: ["People", "Things"], a: 0, why: "People." },
    { q: "Being calm with animals is...", opts: ["A real strength for work", "Not useful"], a: 0, why: "A real strength: vets, kennels, farms and more." }
  ],

  driving: {
    angle: "If time travel let you try a different job in a different century every day for a week, should you? Which century first?",
    opts: ["Yes, history first", "Yes, future first", "No, one job is plenty"],
    say: "Last lesson of term. Have fun with it."
  },

  surprise: { at: "sections.0.slides.0", kind: "bambi", x: 1450, y: 600, w: 120, say: "Bambi's dial settings: outdoors, quiet, hands on, in a team of one. Regal." }
};
})();
