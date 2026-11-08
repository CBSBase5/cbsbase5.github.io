/* ==========================================================
   Base 5 Lessons - Preparation for Adulthood
   Careers for the future, lesson 1 of 3: What even is a career?
   30 minutes (Friday PFA): one warm up. Leads into "Careers fair scout".
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a", SLATE = "#3f6f8f";

function path(){
  var stops = [[90, 300, "Saturday job"], [270, 230, "Course or apprenticeship"], [460, 170, "First proper job"], [650, 110, "Better at it, more pay"], [850, 60, "Maybe your own business"]];
  var g = '<path class="dash" d="M60 330C200 330 200 240 300 240S420 180 500 175S620 120 700 112S820 60 940 50" stroke="' + SLATE + '" stroke-width="8" fill="none" stroke-linecap="round"/>';
  stops.forEach(function(st, i){
    g += '<g data-s="' + (i + 1) + '"><circle class="pulse" cx="' + st[0] + '" cy="' + st[1] + '" r="20" fill="' + [PINK, ORANGE, YELLOW, TEAL, SLATE][i] + '" stroke="' + INK + '" stroke-width="4"/>' +
      T(st[0], st[1] - 34, st[2], 22, { a: "middle", b: 1 }) + '</g>';
  });
  return S("0 0 1000 400", g + '<g class="float">' + A.bonnie(880, 330, 0.5) + '</g>');
}

window.B5LESSON = {
  id: "pfa-careers-1",
  title: "What even is a career?",
  mins: 30,
  startMins: 4,
  finishMins: 5,
  cover: { line: "A job is what you do on Saturday. A career is the whole road. Let's look at the road.", art: S("0 0 700 420", A.scene(700, 420, { ground: 380, sun: [600, 70] }) + '<g class="float">' + I("briefcase", 240, 330, 2) + '</g>' + I("helmet", 470, 360, 1.4) + '<g class="float">' + A.bird(560, 150, 0.9) + '</g>') },

  warm: {
    wordle: { word: "CAREER", hint: "The whole path of jobs you do over your life.", say: "Six letters." },
    wyr: { a: "One job your whole life", b: "A different job every year", twist: "Most people end up somewhere in between: a few jobs, sometimes a big change. Changing direction is normal.", say: "Quick." }
  },

  recap: {
    items: [
      { q: "Name five jobs in 20 seconds.", a: "Anything counts. Bonus points for a weird one." },
      { q: "What's the difference between a job and a hobby?", a: "A job pays you. A hobby you do for fun. Some lucky people turn one into the other." }
    ],
    say: "Keep it fast and silly."
  },

  objective: {
    formal: "explain the difference between a job and a career, and name routes into work after school.",
    mission: "Map the road from now to a job you'd actually want.",
    success: ["Say what a career is", "Name some routes after school", "Know that changing direction is normal"],
    say: "No pressure to know what you want to do. Most adults didn't either."
  },

  sections: [
    {
      kind: "hook", title: "Jobs and careers.", mins: 5,
      slides: [
        { title: "Job or career?", text: "A <b>job</b> is the work you do now. A <b>career</b> is the road your jobs make over your whole life.", stack: true, artWidth: 1250, art: path(),
          say: "Click through the road. Ask: does everyone's road look like this? (No: they wiggle.)" }
      ],
      check: { q: "A career is...", opts: ["The path your jobs make over time", "One job forever", "A type of car"], a: 0, why: "The whole road, wiggles included." }
    },
    {
      kind: "explore", title: "Job or career?", mins: 10,
      slides: [
        {
          type: "sort", title: "Job, or a career?", q: "One thing now, or a road over time?",
          bins: ["A job", "A career"],
          cards: [
            { t: "Working Saturdays in a cafe", b: 0 }, { t: "Training as a chef, then running a kitchen", b: 1 },
            { t: "Delivering leaflets one weekend", b: 0 }, { t: "Apprentice electrician, then qualified electrician", b: 1 },
            { t: "Dog sitting for a neighbour", b: 0 }, { t: "Mechanic, then opening your own garage", b: 1 }
          ],
          say: "Ask: could any of the jobs turn into a career? (Dog sitting to running a kennels...)"
        },
        {
          type: "predict", title: "Earn while you learn",
          q: "Which route lets you get paid while you learn a trade?",
          opts: ["An apprenticeship", "Sitting at home", "A gap year on the sofa"],
          a: 0,
          why: "An apprenticeship: a real job with training built in. College, supported internships and sixth form are other routes, and lots of people mix them."
        }
      ],
      check: { q: "Changing career later in life is...", opts: ["Normal: lots of people do it", "Not allowed", "Only for famous people"], a: 0, why: "Normal. Plenty of people change direction at 30, 40 or 50." }
    },
    {
      kind: "explain", title: "Routes after school.", mins: 6,
      slides: [
        {
          title: "Some roads after school",
          stack: true, artWidth: 1300,
          art: A.iconRow([["book", "College", "courses and skills"], ["helmet", "Apprenticeship", "paid, with training"], ["briefcase", "Supported internship", "learning in a workplace"], ["star", "Straight into work", "and learn on the job"]], { build: true, s: 0.95, h: 250 }),
          say: "There's no right one. Ask: which sounds most like you, right now?"
        },
        {
          type: "vote", title: "Right now...", q: "Which road sounds most like you today?",
          opts: ["College", "Apprenticeship", "Straight into work", "No idea yet, and that's fine"],
          say: "'No idea yet' is the most common answer at any age."
        }
      ],
      check: { q: "Do you need to know your career now?", opts: ["No, most people work it out as they go", "Yes, today", "Only if you're 12"], a: 0, why: "Most people work it out as they go." }
    }
  ],

  realworld: {
    title: "Careers fairs are for snooping",
    text: "At a careers fair you can wander round, pick up free pens, and ask people what their job is really like. Nobody expects you to sign up for anything.",
    art: S("0 0 560 400", A.scene(560, 400, { ground: 370, hills: false, sun: false }) + '<rect x="40" y="200" width="200" height="170" fill="#fbe3ea" stroke="' + INK + '" stroke-width="4"/><rect x="300" y="200" width="200" height="170" fill="#e1edf5" stroke="' + INK + '" stroke-width="4"/>' + '<g class="float">' + I("briefcase", 140, 300, 1) + I("helmet", 400, 300, 1.1) + '</g>' + A.jay(280, 140, 1.2)),
    say: "Link to the Careers fair scout activity in their HQs."
  },

  exit: [
    { q: "Working one Saturday in a cafe is...", opts: ["A job", "A career"], a: 0, why: "A job. It could become part of a career." },
    { q: "An apprenticeship is...", opts: ["Paid work with training", "A holiday"], a: 0, why: "Earn while you learn." }
  ],

  driving: {
    angle: "If you could time travel forward and see future you at work, would you look? Or would you rather find out the long way?",
    opts: ["Show me", "I'll find out myself", "Only if it's a cool job"],
    say: "Light end."
  },

  surprise: { at: "sections.0.slides.0", kind: "bonnie", x: 1460, y: 150, w: 110, say: "Bonnie's career path: puppy, sofa inspector, senior sofa inspector." }
};
})();
