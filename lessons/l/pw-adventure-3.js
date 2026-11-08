/* ==========================================================
   Base 5 Lessons - Physical World and Exploration
   Adventure activities, lesson 3 of 3: On the rope
   45 minutes (Wednesday 1:15). Leads into "Adventure day".
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a", STEEL = "#6c7a80", WOOD = "#b5793f";

function wall(){
  var g = '<rect x="200" y="20" width="260" height="380" rx="10" fill="#d7cbb4" stroke="' + INK + '" stroke-width="4"/>';
  [[240, 360, PINK], [300, 320, YELLOW], [250, 270, TEAL], [350, 250, ORANGE], [280, 200, PINK], [390, 170, YELLOW], [310, 120, TEAL], [410, 80, ORANGE]].forEach(function(h){ g += '<ellipse cx="' + h[0] + '" cy="' + h[1] + '" rx="14" ry="10" fill="' + h[2] + '" stroke="' + INK + '" stroke-width="2.5"/>'; });
  g += '<g data-s="1"><path d="M330 30V210" stroke="' + WOOD + '" stroke-width="4"/><circle cx="330" cy="30" r="9" fill="' + STEEL + '" stroke="' + INK + '" stroke-width="2"/>' + T(345, 36, "anchor", 20) + '</g>' +
    '<g transform="translate(330 240)"><circle cx="0" cy="-34" r="13" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3"/><path d="M-14 -44q14 -14 28 0z" fill="' + ORANGE + '"/><path d="M0 -20v32M0 12l-14 26M0 12l16 22M0 -12l-20 -18M0 -12l20 -26" stroke="' + INK + '" stroke-width="7" stroke-linecap="round" fill="none"/><rect x="-10" y="4" width="20" height="10" rx="3" fill="' + TEAL + '"/></g>' +
    '<g data-s="2"><path d="M330 30Q520 120 530 330" stroke="' + WOOD + '" stroke-width="4" fill="none"/><g transform="translate(540 400)"><circle cx="0" cy="-74" r="11" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3"/><path d="M0 -62v30M0 -32l-12 30M0 -32l12 30M0 -54l-14 10" stroke="' + INK + '" stroke-width="7" stroke-linecap="round" fill="none"/><rect x="-10" y="-40" width="20" height="10" rx="3" fill="' + TEAL + '"/></g>' + T(540, 300, "belayer", 20, { a: "middle" }) + '</g>' +
    '<g data-s="3">' + T(150, 240, "climber", 20, { a: "middle" }) + '<path d="M176 236L300 230" stroke="' + INK + '" stroke-width="2" stroke-dasharray="4 4"/></g>';
  return S("0 0 640 420", g);
}

window.B5LESSON = {
  id: "pw-adventure-3",
  title: "On the rope",
  mins: 45,
  cover: { line: "Harness, helmet, rope and a partner you trust. How climbing keeps a scary sport safe.", art: wall() },

  warm: {
    wordle: { word: "HELMET", hint: "You wear it on your head when climbing, cycling or caving.", say: "Six letters." },
    wyr: {
      a: "Climb a wall with your eyes shut", b: "Climb a wall wearing oven gloves",
      twist: "Some climbers really do practise with their eyes shut, to learn to feel for the holds. Nobody practises in oven gloves. Yet.",
      say: "Ask: which would be harder?"
    }
  },

  recap: {
    items: [
      { q: "What are the four planning questions?", a: "Where (route)? What (kit)? Weather? Who knows where we are?" },
      { q: "Why leave brand new boots at home?", a: "They give blisters. Wear them in first." },
      { q: "Halfway up a climbing wall and want down?", a: "Say so. Coming down is always allowed." }
    ],
    say: "From the last two Wednesdays."
  },

  objective: {
    formal: "describe the kit, checks and calls that keep climbers safe.",
    mission: "Learn how two people and a rope make one of the scariest sports one of the safest.",
    success: ["Name the main climbing kit", "Say what a buddy check is", "Know the calls climbers use"],
    say: "Read the mission."
  },

  sections: [
    {
      kind: "hook", title: "How a climbing wall works.", mins: 8,
      slides: [
        { title: "Top rope climbing", text: "The rope runs from the climber, up through an anchor at the top, and down to a partner on the ground.", art: wall(), wideArt: true, photo: { src: "https://commons.wikimedia.org/wiki/Special:FilePath/Belaying8.jpg?width=800", alt: "A climber on a rope with a belayer holding the rope below", caption: "Climber and belayer", credit: "Photo: Wikimedia Commons, CC BY-SA 3.0" },
          say: "Click through: anchor, belayer, climber. Ask: who is doing the most important job?" },
        {
          type: "predict", title: "Who holds the rope?",
          q: "The person on the ground who manages the rope is called the...",
          opts: ["Belayer", "Driver", "Rope boss"],
          a: 0,
          why: "The belayer. They take in rope as the climber goes up, and hold them if they slip.",
          say: "Rope boss is a better name, to be fair."
        }
      ],
      check: { q: "On a top rope, where does the rope go?", opts: ["From the climber, up through the anchor, down to the belayer", "Just tied round the climber's waist", "Nowhere, it's decoration"], a: 0, why: "Up through the anchor and down to the belayer." }
    },
    {
      kind: "explore", title: "Kit, checks and calls.", mins: 15,
      slides: [
        {
          title: "The buddy check", text: "Before every single climb, partners check each other:",
          pts: ["Helmet on and done up", "Harness on, buckles done up", "Knot tied properly (a figure of eight)", "Belay device set up and locked"],
          build: true, ptsFrom: 1,
          art: S("0 0 480 400", A.scene(480, 400, { ground: 360, time: "day", sun: [400, 70] }) + I("helmet", 140, 160, 1.6) + I("rope", 340, 180, 1.7) + A.bonnie(240, 330, 0.7)),
          say: "Even world champions do this every time. It is not a sign of being new."
        },
        {
          type: "sort", title: "Climbing call or not?", q: "Which ones would you hear at a climbing wall?",
          bins: ["Climbing call", "Not a call"],
          cards: [
            { t: "\"Take!\" (hold me on the rope)", b: 0 }, { t: "\"Lower!\" (let me down)", b: 0 },
            { t: "\"Climb when ready\"", b: 0 }, { t: "\"Yeehaw\"", b: 1 },
            { t: "\"Is it lunch yet?\"", b: 1 }, { t: "\"Slack\" (give me more rope)", b: 0 }
          ],
          say: "Different walls use slightly different words: the instructor always explains theirs."
        },
        {
          type: "predict", title: "A rest",
          q: "Your arms are tired halfway up. What do you shout so the belayer holds you still?",
          opts: ["\"Take!\"", "\"Pizza!\"", "\"Faster!\""],
          a: 0,
          why: "\"Take!\" The belayer pulls the rope tight and you can sit back in your harness and rest."
        }
      ],
      check: { q: "When do climbers do a buddy check?", opts: ["Before every climb", "Only the first time", "Only if the instructor is watching"], a: 0, why: "Before every climb. Every time." }
    },
    {
      kind: "explain", title: "Trusting the system.", mins: 10,
      slides: [
        {
          title: "Falling off is normal",
          pts: ["On a top rope you only drop a tiny bit", "The kit is built to hold far more than a person weighs", "The belayer is ready the whole time", "Talking to each other is what makes it work"],
          build: true, ptsFrom: 1,
          art: S("0 0 480 400", '<path d="M240 20V200" stroke="' + WOOD + '" stroke-width="5"/>' + '<g transform="translate(240 260)"><circle cx="0" cy="-34" r="16" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3"/><path d="M0 -18v36M0 18l-16 30M0 18l16 30M0 -8l-24 10M0 -8l24 10" stroke="' + INK + '" stroke-width="8" stroke-linecap="round" fill="none"/></g>' + T(240, 370, "Sitting back in the harness", 24, { a: "middle", f: 1 })),
          say: "Lots of walls let you practise a small fall on purpose, with an instructor."
        },
        {
          type: "vote", title: "Would you?", q: "Would you have a go on a climbing wall?",
          opts: ["Yes, can't wait", "Maybe, with someone I trust", "Bottom few holds only", "No thanks"],
          say: "All four are fine answers."
        }
      ],
      check: { q: "What makes climbing on a rope safe?", opts: ["Kit, checks and good communication", "Luck", "Climbing really fast"], a: 0, why: "Good kit, buddy checks, and climber and belayer talking to each other." }
    }
  ],

  realworld: {
    title: "Climbing is everywhere now",
    text: "Most towns have an indoor climbing wall, and climbing was in the Olympics for the first time at Tokyo 2020. The same kit, checks and calls are used everywhere from a school wall to a mountain.",
    art: wall(),
    say: "Ask: would anyone want to try a wall as a Base 5 trip?"
  },

  exit: [
    { q: "The person managing the rope on the ground is the...", opts: ["Belayer", "Referee"], a: 0, why: "The belayer." },
    { q: "To be held still on the rope you shout...", opts: ["\"Take!\"", "\"Faster!\""], a: 0, why: "\"Take!\"" },
    { q: "A buddy check happens...", opts: ["Before every climb", "Once a year"], a: 0, why: "Before every climb." }
  ],

  driving: {
    angle: "Would you rather time travel back to watch the first people reach the top of Everest in 1953, or forward to watch climbing at the 2056 Olympics?",
    opts: ["Everest, 1953", "Olympics, 2056", "Neither, I'm scared of heights"],
    say: "The third option is completely valid."
  },

  surprise: { at: "sections.1.slides.0", kind: "bird", x: 1450, y: 150, say: "Birds don't need a buddy check. They have wings. Cheating, really." }
};
})();
