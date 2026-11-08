/* ==========================================================
   Base 5 Lessons - Physical World and Exploration
   Adventure activities, lesson 1 of 3: What makes it an adventure?
   45 minutes (Wednesday 1:15). Leads into "Design an expedition".
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", OLIVE = "#7a7f1e", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a";

function wallArt(){
  var g = '<rect x="250" y="20" width="260" height="380" rx="10" fill="#d7cbb4" stroke="' + INK + '" stroke-width="4"/>';
  var holds = [[290, 360, PINK], [350, 320, YELLOW], [300, 270, TEAL], [400, 250, ORANGE], [330, 200, PINK], [440, 170, YELLOW], [360, 120, TEAL], [460, 80, ORANGE], [300, 70, YELLOW]];
  holds.forEach(function(h){ g += '<ellipse cx="' + h[0] + '" cy="' + h[1] + '" rx="14" ry="10" fill="' + h[2] + '" stroke="' + INK + '" stroke-width="2.5"/>'; });
  g += '<path d="M380 30V200" stroke="#b5793f" stroke-width="4"/><circle cx="380" cy="30" r="8" fill="#6c7a80" stroke="' + INK + '" stroke-width="2"/>' +
    '<path d="M380 30Q560 120 560 390" stroke="#b5793f" stroke-width="4" fill="none"/>' +
    '<g transform="translate(380 230)"><circle cx="0" cy="-34" r="13" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3"/><path d="M-14 -44q14 -14 28 0z" fill="' + ORANGE + '"/><path d="M0 -20v32M0 12l-14 26M0 12l16 22M0 -12l-20 -18M0 -12l20 -26" stroke="' + INK + '" stroke-width="7" stroke-linecap="round" fill="none"/></g>' +
    '<g transform="translate(560 390)"><circle cx="0" cy="-74" r="11" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3"/><path d="M0 -62v30M0 -32l-12 30M0 -32l12 30M0 -54l-14 10" stroke="' + INK + '" stroke-width="7" stroke-linecap="round" fill="none"/></g>';
  return g;
}
function zones(){
  return '<g data-s="1"><circle cx="300" cy="220" r="190" fill="#f6c9c9" stroke="' + INK + '" stroke-width="4"/>' + T(300, 58, "Panic zone", 26, { a: "middle", f: 1 }) + '</g>' +
    '<g data-s="2"><circle cx="300" cy="230" r="130" fill="#ffe3a1" stroke="' + INK + '" stroke-width="4"/>' + T(300, 132, "Stretch zone", 26, { a: "middle", f: 1 }) + '</g>' +
    '<g data-s="1"><circle cx="300" cy="250" r="70" fill="#cfeee0" stroke="' + INK + '" stroke-width="4"/>' + T(300, 258, "Comfort", 24, { a: "middle", f: 1 }) + '</g>' +
    '<g data-s="3">' + T(520, 160, "Adventure", 28, { f: 1, c: "#7a5a00" }) + T(520, 192, "lives here", 24) + '<path d="M512 176q-60 0 -84 20" stroke="' + INK + '" stroke-width="3" fill="none"/></g>';
}

window.B5LESSON = {
  id: "pw-adventure-1",
  title: "What makes it an adventure?",
  mins: 45,
  cover: {
    line: "Climbing, kayaking, caving, zip wires. What makes something scary in a good way?",
    art: S("0 0 700 440", I("mountain", 200, 380, 2.4) + I("mountain", 470, 380, 1.6) + I("tree", 610, 400, 1.1) + I("tree", 90, 410, 0.9) +
      '<path d="M0 400h700" stroke="' + INK + '" stroke-width="4"/><path d="M60 120L640 260" stroke="' + INK + '" stroke-width="3"/>' +
      '<g transform="translate(330 205)"><path d="M0 -8v30" stroke="' + INK + '" stroke-width="3"/><circle cx="0" cy="34" r="12" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3"/><path d="M0 46v24M0 54l-16 10M0 54l16 -8M0 70l-10 20M0 70l12 18" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
      A.bonnie(520, 362, 0.5))
  },

  warm: {
    wordle: { word: "CLIMB", hint: "What you do up a wall, a tree or a mountain.", say: "Five letters." },
    wyr: {
      a: "Climb Everest in 1953", b: "Explore Mars in 2100",
      artA: S("0 0 300 200", I("mountain", 150, 190, 1.8)),
      artB: S("0 0 300 200", '<circle cx="150" cy="110" r="76" fill="#c8553d" stroke="' + INK + '" stroke-width="4"/><circle cx="120" cy="90" r="14" fill="#a8432f"/><circle cx="180" cy="140" r="10" fill="#a8432f"/><circle cx="170" cy="70" r="7" fill="#a8432f"/>'),
      twist: "In 1953 Edmund Hillary and Tenzing Norgay were the first known people to stand on top of Everest, in wool and leather, carrying heavy oxygen tanks.",
      say: "Ask: what would you pack?"
    }
  },

  recap: {
    items: [
      { q: "What is the most adventurous thing you have done?", a: "Anything new or a bit scary counts. Go Ape definitely counts." },
      { q: "What makes something scary but fun?", a: "A challenge, a bit of risk, not knowing what happens next, and knowing someone has your back." },
      { q: "Name some kit for being outdoors.", a: "Boots, waterproofs, a helmet, a map, water, snacks, a phone." }
    ],
    say: "Keep it light. 'Nothing' is a fine answer to the first one."
  },

  objective: {
    formal: "explain what makes an activity an adventure, and the difference between a hazard and a risk.",
    mission: "Find the recipe for a good adventure: scary enough to be fun, safe enough to come home.",
    success: ["Name some adventure activities", "Tell a hazard from a risk", "Say how a risk can be made smaller"],
    say: "Read the mission. Ask: what is the scariest fun thing they can think of?"
  },

  sections: [
    {
      kind: "hook", title: "Adventure activities: what is out there?", mins: 8,
      slides: [
        {
          title: "Adventure activities",
          text: "Things people do outdoors for the challenge, the view, or the buzz:",
          stack: true, artWidth: 1300,
          art: A.iconRow([["mountain", "Climbing"], ["boat", "Kayaking"], ["map", "Orienteering"], ["tree", "High ropes"], ["helmet", "Caving"]], { build: true, s: 1, h: 240 }),
          say: "Ask who has tried any of them. Go Ape at Moors Valley counts as high ropes."
        },
        {
          type: "vote",
          title: "Pick one",
          q: "If you could try one tomorrow, which would it be?",
          opts: ["Climbing", "Kayaking", "Zip wire", "None, thanks"],
          say: "'None, thanks' is a proper answer. Tap for each person."
        }
      ],
      check: {
        q: "What do adventure activities have in common?",
        opts: ["A challenge, with risk that is managed", "They are always dangerous", "They are always indoors"],
        a: 0,
        why: "A challenge with some risk, but the risk is managed: kit, training, instructors, rules.",
        say: "Quick one."
      }
    },
    {
      kind: "explore", title: "Hazards, risks, and the good kind of scared.", mins: 15,
      slides: [
        {
          title: "Hazard or risk?",
          text: "Two words that sound the same but are not:",
          pts: ["A <b>hazard</b> is something that could hurt you: a cliff edge, a cold river", "A <b>risk</b> is how likely it is to happen, and how bad", "You cannot always remove the hazard, but you can shrink the risk"],
          build: true, ptsFrom: 1,
          art: S("0 0 700 440", wallArt()),
          say: "The climbing wall: the height is the hazard. The rope, harness and belayer make the risk small."
        },
        {
          type: "sort",
          title: "Hazard, or a way to shrink the risk?",
          q: "Sort them.",
          bins: ["Hazard", "Shrinks the risk"],
          cards: [
            { t: "Slippery rocks", b: 0 },
            { t: "Grippy boots", b: 1 },
            { t: "A cold, fast river", b: 0 },
            { t: "A buoyancy aid", b: 1 },
            { t: "Getting lost", b: 0 },
            { t: "A map, and telling someone your route", b: 1 },
            { t: "Falling off a climbing wall", b: 0 },
            { t: "A helmet and a trained belayer", b: 1 }
          ],
          say: "Pairs go together: each hazard has its fix."
        },
        {
          title: "The good kind of scared",
          text: "You get to choose your own stretch. Everyone's zones are different, and they change day to day.",
          art: S("0 0 700 440", zones()),
          say: "Panic zone is not a failure: it is information. Saying 'not today' is a skill climbers use all the time."
        }
      ],
      check: {
        q: "Where does a good adventure happen?",
        opts: ["Comfort zone", "Stretch zone", "Panic zone"],
        a: 1,
        why: "The stretch zone: hard enough to be exciting, not so hard that it is miserable. And only you know where yours is.",
        say: "Ask: is your stretch zone the same as your friend's?"
      }
    },
    {
      kind: "explain", title: "Who keeps it safe, and coming back down.", mins: 10,
      slides: [
        {
          title: "Who keeps the risk small?",
          stack: true, artWidth: 1300,
          text: "Lots of people and things, and one of them is you:",
          art: A.iconRow([["helmet", "Kit", "checked before use"], ["map", "A plan", "route, times, weather"], ["walk", "Instructors", "trained, qualified"], ["phone", "Who to tell", "where you will be"], ["star", "You", "saying enough"]], { build: true, s: 0.9, h: 250 }),
          say: "Land on the last one: you are part of the safety plan."
        },
        {
          type: "predict",
          title: "Halfway up",
          q: "You are halfway up a climbing wall and want to come down. What happens?",
          opts: ["You say so, and the belayer lowers you down", "You have to finish", "You jump"],
          a: 0,
          why: "Coming down is always allowed. Saying 'take' or 'lower me' is part of climbing, not giving up.",
          say: "Bonnie would never climb. Bonnie would sit at the bottom and supervise."
        }
      ],
      check: {
        q: "Which one is a hazard?",
        opts: ["A steep drop", "A helmet", "An instructor"],
        a: 0,
        why: "The drop could hurt you. The helmet and the instructor make the risk smaller.",
        say: "Last check."
      }
    }
  ],

  realworld: {
    title: "Adventure is closer than you think",
    text: "Go Ape at Moors Valley was one. Climbing walls, forests, rivers and the coast all have adventures in them, most with an instructor and the right kit. Some are free: a walk somewhere new counts.",
    art: S("0 0 560 420", I("mountain", 180, 390, 2) + I("tree", 420, 400, 1.6) + I("tree", 500, 410, 1.1) + A.bird(470, 110, 0.9) + '<path d="M0 400h560" stroke="' + INK + '" stroke-width="4"/>'),
    say: "Ask: what adventure would you want Base 5 to try next?"
  },

  exit: [
    { q: "Something that could hurt you is a...", opts: ["Hazard", "Risk", "Helmet"], a: 0, why: "A hazard. The risk is how likely and how bad." },
    { q: "Which of these shrinks the risk of getting lost?", opts: ["Telling someone your route", "Walking faster", "Leaving your phone at home"], a: 0, why: "Telling someone your route (and taking a map) means people know where to look." },
    { q: "Where do good adventures happen?", opts: ["Comfort zone", "Stretch zone", "Panic zone"], a: 1, why: "The stretch zone, and you get to choose where yours is." }
  ],

  driving: {
    angle: "Hillary and Tenzing on Everest in 1953, or the first people on Mars. If you could time travel to join one adventure in history, should you? What if you changed how it turned out?",
    opts: ["Go, but just watch", "Go and join in", "Stay home with a biscuit"],
    say: "Ask: is it still an adventure if you already know how it ends?"
  },

  surprise: {
    at: "sections.1.slides.2", kind: "bonnie", x: 1440, y: 700, w: 120,
    say: "Bonnie's comfort zone: the sofa. Her stretch zone: the other end of the sofa."
  }
};
})();
