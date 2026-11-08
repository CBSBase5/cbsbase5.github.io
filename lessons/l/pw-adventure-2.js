/* ==========================================================
   Base 5 Lessons - Physical World and Exploration
   Adventure activities, lesson 2 of 3: Plan it safe
   45 minutes (Wednesday 1:15). Leads into "Design an expedition".
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", OLIVE = "#7a7f1e", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a";

function four(build){
  return A.iconRow([["map", "Where?", "the route"], ["helmet", "What?", "the kit"], ["cloud", "Weather?", "check the forecast"], ["phone", "Who knows?", "where and when back"]], { build: build, s: 1, h: 250 });
}
function hill(){
  return S("0 0 560 420", A.scene(560, 420, { ground: 400, hills: false, sun: [500, 60] }) + '<path d="M0 400L180 120L300 260L380 180L560 400Z" fill="#9aa86a" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
    '<path d="M150 170L180 120L210 165Z" fill="#fff"/>' +
    '<g data-s="1"><rect x="20" y="300" width="150" height="84" rx="12" fill="#fffdf8" stroke="' + INK + '" stroke-width="3"/>' + T(95, 334, "Car park", 22, { a: "middle" }) + T(95, 368, "20&#176;C", 30, { a: "middle", f: 1, c: ORANGE }) + '</g>' +
    '<g data-s="2">' + T(250, 110, "Top: 12&#176;C", 30, { a: "middle", f: 1, c: TEAL }) + T(250, 80, "1,200 m up", 22, { a: "middle" }) + I("cloud", 380, 100, 0.8) + '</g>' +
    A.bird(80, 80, 0.8));
}

window.B5LESSON = {
  id: "pw-adventure-2",
  title: "Plan it safe",
  mins: 45,
  cover: { line: "The best adventures look spontaneous and are secretly very well planned.", art: S("0 0 700 420", A.scene(700, 420, { ground: 380, sun: [600, 70] }) + '<g class="float">' + I("map", 200, 320, 2.4) + '</g>' + I("helmet", 470, 360, 1.8) + A.bonnie(610, 345, 0.5)) },

  warm: {
    wordle: { word: "ROUTE", hint: "The way you plan to go, from start to finish.", say: "Five letters." },
    wyr: {
      a: "Lost in a forest with a paper map, no phone", b: "Lost in a forest with a phone on 1% battery",
      artA: S("0 0 300 200", I("map", 150, 180, 1.8)), artB: S("0 0 300 200", I("phone", 150, 190, 1.8)),
      twist: "A paper map never runs out of battery. Mountain rescue teams still tell walkers to carry one, and to know how to use it.",
      say: "Ask: what would you do first?"
    }
  },

  recap: {
    items: [
      { q: "What is the difference between a hazard and a risk?", a: "A hazard could hurt you. The risk is how likely it is, and how bad." },
      { q: "Where do good adventures happen?", a: "In the stretch zone. And you choose where yours is." },
      { q: "Halfway up a climbing wall and want to come down?", a: "Say so. Coming down is always allowed." }
    ],
    say: "From last Wednesday."
  },

  objective: {
    formal: "plan a safe outdoor adventure, thinking about the route, kit, weather and who knows where we are.",
    mission: "Plan a day out so well that even if something goes wrong, nobody minds.",
    success: ["Name the four planning questions", "Pick the right kit for a trip", "Change a plan when the weather changes"],
    say: "Read the mission."
  },

  sections: [
    {
      kind: "hook", title: "Four questions before any adventure.", mins: 8,
      slides: [
        { title: "The four questions", text: "Every good adventure plan answers these:", stack: true, artWidth: 1300, art: four(true),
          say: "Click through. Ask which one people forget most." },
        {
          type: "predict", title: "Why do people need rescuing?",
          q: "Most UK mountain rescue call outs happen because of...",
          opts: ["Bears", "Simple things: slips, getting lost, darkness or bad weather", "Aliens"],
          a: 1,
          why: "Mostly simple things: a slip on a path, getting lost, being caught out by the dark or the weather. Which is why the four questions matter.",
          say: "Bears: no. Not in Britain, anyway."
        }
      ],
      check: { q: "Which question helps most if you get lost?", opts: ["Who knows where we are?", "What colour is my coat?", "Did I bring crisps?"], a: 0, why: "If someone knows your route and when you'll be back, they know where to look." }
    },
    {
      kind: "explore", title: "Kit and weather.", mins: 15,
      slides: [
        {
          type: "sort", title: "Pack it or leave it?", q: "A day's walk in the hills in November.",
          bins: ["Pack it", "Leave it"],
          cards: [
            { t: "Waterproof jacket", b: 0 }, { t: "Water", b: 0 }, { t: "Snacks", b: 0 }, { t: "A map", b: 0 },
            { t: "Charged phone", b: 0 }, { t: "Flip flops", b: 1 }, { t: "A full size duvet", b: 1 }, { t: "Brand new boots, never worn", b: 1 }
          ],
          why: "New boots give blisters: wear them in first.",
          say: "The boots one catches people out."
        },
        {
          title: "It gets colder as you go up",
          text: "Mountains have their own weather.",
          pts: ["Roughly a degree colder for every 150 metres up", "More wind on the tops", "Weather can change fast, so check before and keep an eye on it"],
          build: true, ptsFrom: 3,
          art: hill(),
          say: "Ask: what would you wear at the car park? What at the top?"
        },
        {
          type: "predict", title: "Change of plan",
          q: "The forecast says heavy rain and wind from 2pm. Your walk was 10am to 4pm. Best plan?",
          opts: ["A shorter route, back by 1pm", "Go anyway, it'll be fine", "Swim it"],
          a: 0,
          why: "Change the plan, not the weather. A shorter route still counts as an adventure.",
          say: "Changing plans is a skill, not a failure."
        }
      ],
      check: { q: "When should you check the weather?", opts: ["Before you go, and keep an eye on it", "Only once you're wet", "Never, it ruins the surprise"], a: 0, why: "Before you go, and while you're out." }
    },
    {
      kind: "explain", title: "Telling someone, and running late.", mins: 10,
      slides: [
        {
          title: "Tell someone",
          text: "Before any adventure, someone at home should know:",
          pts: ["Where you're going, and your route", "When you're setting off", "When you'll be back", "What to do if you're not"],
          build: true, ptsFrom: 1,
          art: S("0 0 480 420", A.scene(480, 420, { ground: 390, hills: false }) + '<g class="float">' + I("phone", 240, 350, 2.6) + '</g>' + A.bubble(60, 40, 360, 60, "Back by 4!", 30)),
          say: "Ask: who would you tell?"
        },
        {
          type: "predict", title: "Running late",
          q: "You said you'd be back at 4. It's 3:30 and you're running late. What now?",
          opts: ["Message them a new time", "Say nothing, they'll work it out", "Turn your phone off"],
          a: 0,
          why: "A quick message stops people worrying, and stops a rescue being started for nothing.",
          say: "Ask: what might happen if nobody heard?"
        }
      ],
      check: { q: "What does a good adventure plan have?", opts: ["Route, kit, weather, and who knows", "Snacks only", "Vibes"], a: 0, why: "All four. Snacks are strongly recommended as well." }
    }
  ],

  realworld: {
    title: "Every trip has a plan like this",
    text: "Before Base 5 goes anywhere, Jay fills in a plan like this one: where, what kit, the weather, and who to call. Walkers, climbers, sailors and school trips all do the same.",
    art: S("0 0 560 420", four(false).replace('viewBox="0 0 1000 250"', 'viewBox="0 0 1000 250" x="0" y="80" width="560" height="140"') + A.jay(470, 330, 1.4)),
    say: "Ask: what should be in the plan for our next trip?"
  },

  exit: [
    { q: "Which is most important to leave at home?", opts: ["Brand new boots you've never worn", "A waterproof", "Water"], a: 0, why: "New boots give blisters. Wear them in first." },
    { q: "The higher you go, the...", opts: ["Colder it gets", "Warmer it gets"], a: 0, why: "Colder: roughly a degree for every 150 metres." },
    { q: "You're running late. Best move?", opts: ["Message the person who knows your plan", "Say nothing"], a: 0, why: "A quick message stops people worrying." }
  ],

  driving: {
    angle: "Explorers in the past had no forecast, no phone and often no map of where they were going. Would you swap your phone for their kind of adventure?",
    opts: ["Yes, proper adventure", "No, I like my phone", "Only for a day"],
    say: "Ask: what would be better without a phone? What would be worse?"
  },

  surprise: { at: "sections.1.slides.1", kind: "bonnie", x: 1470, y: 760, w: 100, say: "Bonnie's weather plan: refuse to go out if it is raining. Then go out anyway because of the biscuits." }
};
})();
