/* ==========================================================
   Base 5 Lessons - Preparation for Adulthood
   Careers for the future, lesson 2 of 3: Jobs that vanished, jobs that appeared
   30 minutes (Friday PFA): one warm up. Leads into "Career explorer".
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a";

function lamp(x, y, lit){
  return '<g transform="translate(' + x + ' ' + y + ')"><path d="M0 0V-200" stroke="' + INK + '" stroke-width="8"/><path d="M-22 -200h44l-8 -40h-28z" fill="' + (lit ? YELLOW : "#c9c1b3") + '" stroke="' + INK + '" stroke-width="4"/>' +
    (lit ? '<circle class="pulse" cx="0" cy="-220" r="40" fill="' + YELLOW + '" opacity=".35"/>' : "") + '</g>';
}
function drone(x, y){
  return '<g class="float" transform="translate(' + x + ' ' + y + ')"><rect x="-30" y="-10" width="60" height="20" rx="8" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="3"/><path d="M-30 -6L-56 -20M30 -6L56 -20" stroke="' + INK + '" stroke-width="4"/>' +
    '<ellipse cx="-56" cy="-24" rx="22" ry="5" fill="#c9ccd0" stroke="' + INK + '" stroke-width="2"/><ellipse cx="56" cy="-24" rx="22" ry="5" fill="#c9ccd0" stroke="' + INK + '" stroke-width="2"/><circle cx="0" cy="12" r="6" fill="' + INK + '"/></g>';
}

window.B5LESSON = {
  id: "pfa-careers-2",
  title: "Jobs that vanished, jobs that appeared",
  mins: 30,
  cc: [
    { week: "Christmas Around the World", line: "Some jobs only appear at Christmas: tree farmers, market stall holders, the grotto Santa and thousands of extra delivery drivers." },
    { week: "STEAM for Good", line: "Lots of brand new jobs use science and tech to help: wind turbine engineers, and drone pilots who check crops and search for missing walkers." }
  ],
  startMins: 4,
  finishMins: 5,
  cover: { line: "Lamplighters, knocker uppers, drone pilots. Jobs come and go. What does that mean for you?", art: S("0 0 700 420", A.scene(700, 420, { ground: 380, time: "dusk", sun: [600, 90] }) + lamp(160, 380, true) + lamp(300, 380, false) + drone(520, 170) + A.bird(620, 260, 0.8)) },

  warm: {
    wordle: { word: "ROBOT", hint: "A machine that can do jobs people used to do.", say: "Five letters." },
    wyr: {
      a: "Be a knocker upper in 1900", b: "Be a drone pilot in 2050",
      artA: S("0 0 300 200", A.scene(300, 200, { ground: 180, time: "night", sun: [240, 40] }) + '<rect x="60" y="80" width="100" height="100" fill="#c8664a" stroke="' + INK + '" stroke-width="3"/><rect x="85" y="100" width="30" height="30" fill="' + YELLOW + '"/><path d="M200 180L120 105" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>'),
      artB: S("0 0 300 200", A.scene(300, 200, { ground: 180 }) + drone(150, 90)),
      twist: "Knocker uppers walked the streets before dawn tapping on bedroom windows with long poles, so people woke up for work. Alarm clocks put them out of a job.",
      say: "Explain the knocker upper after the vote, if nobody knows."
    }
  },

  recap: {
    items: [
      { q: "What's the difference between a job and a career?", a: "A job is now. A career is the road your jobs make over time." },
      { q: "What's an apprenticeship?", a: "Paid work with training built in." }
    ],
    say: "From last Friday."
  },

  objective: {
    formal: "describe how jobs change over time and which skills stay useful.",
    mission: "Find out which jobs disappeared, which ones are new, and which skills never go out of date.",
    success: ["Name a job that disappeared", "Name a job that's new", "Say which skills stay useful"],
    say: "Read the mission."
  },

  sections: [
    {
      kind: "hook", title: "Jobs that disappeared.", mins: 5,
      slides: [
        {
          type: "predict", title: "The lamplighter",
          q: "Before electric street lights, what did a lamplighter do?",
          opts: ["Lit gas street lamps by hand every evening", "Sold lamps", "Painted lighthouses"],
          a: 0,
          why: "Every evening they walked round lighting gas street lamps with a long pole, and put them out in the morning. Electric lights ended the job.",
          say: "Ask: what replaced them?"
        }
      ],
      check: { q: "Why did the lamplighter job disappear?", opts: ["New technology: electric lights", "People stopped liking light", "Lamps were banned"], a: 0, why: "New technology did the job instead." }
    },
    {
      kind: "explore", title: "Gone, and new.", mins: 10,
      slides: [
        {
          type: "sort", title: "Vanished, or new?", q: "Mostly gone, or only appeared recently?",
          bins: ["Mostly vanished", "Appeared recently"],
          cards: [
            { t: "Lamplighter", b: 0 }, { t: "App developer", b: 1 }, { t: "Knocker upper", b: 0 },
            { t: "Drone pilot", b: 1 }, { t: "Telephone switchboard operator", b: 0 }, { t: "Wind turbine technician", b: 1 }
          ],
          say: "Ask: which of the new ones would you try?"
        },
        {
          title: "What makes a job last?",
          text: "Machines are good at repeating things. People are still better at:",
          pts: ["Caring for people and animals", "Fixing things that are all different", "Making new ideas", "Talking, calming, explaining"],
          build: true, ptsFrom: 1,
          art: S("0 0 480 400", A.scene(480, 400, { ground: 360 }) + drone(300, 120) + A.jay(150, 290, 1.4) + '<g class="float">' + A.bonnie(330, 330, 0.6) + '</g>'),
          say: "Ask: which of these are you already good at?"
        }
      ],
      check: { q: "Which skill is a machine worst at?", opts: ["Calming someone who's upset", "Adding up numbers", "Lifting boxes in a warehouse"], a: 0, why: "Caring and calming people is still very human." }
    },
    {
      kind: "explain", title: "Jobs of the future.", mins: 6,
      slides: [
        {
          type: "vote", title: "Still here in 3026?", q: "Which job is most likely to still exist in 1,000 years?",
          opts: ["Nurse", "Chef", "Farmer", "YouTuber"],
          why: "Nobody knows. Jobs looking after people, food and animals have lasted thousands of years so far.",
          say: "Ask for a reason each."
        }
      ],
      check: { q: "When new technology arrives, usually...", opts: ["Some jobs go, and new jobs appear", "Every job disappears", "Nothing changes"], a: 0, why: "Some go, new ones arrive: lamplighters went, electricians arrived." }
    }
  ],

  realworld: {
    title: "Your skills travel with you",
    text: "Being reliable, kind, good with your hands, good at sorting problems: those move with you from job to job, whatever the job is called in 20 years.",
    art: S("0 0 560 400", A.scene(560, 400, { ground: 360, time: "dusk", sun: [460, 80] }) + lamp(140, 360, true) + drone(400, 160)),
    say: "Ask: which skill would you take with you?"
  },

  exit: [
    { q: "A knocker upper used to...", opts: ["Wake people up by tapping on windows", "Build houses"], a: 0, why: "Wake people for work, before alarm clocks." },
    { q: "Which is a new job?", opts: ["Drone pilot", "Lamplighter"], a: 0, why: "Drone pilot." }
  ],

  driving: {
    angle: "If you could time travel to 1900 and tell a knocker upper that alarm clocks are coming, should you?",
    opts: ["Yes, warn them", "No, let it happen", "Pass"],
    say: "Ask: what could they do with the warning?"
  },

  surprise: { at: "sections.1.slides.1", kind: "bird", x: 1450, y: 150, say: "Birds have been doing the same job for millions of years: early worm collection. Very secure." }
};
})();
