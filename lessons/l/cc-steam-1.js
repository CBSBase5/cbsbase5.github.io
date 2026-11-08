/* ==========================================================
   Lessons - Cultural Calendar: STEAM for Good (7 to 11 December 2026)
   Problem solving: science, technology, engineering, art and maths
   as ways of fixing things. The week follows a real design cycle:
     1 hook (inventions that fixed a problem), 2 explore (spot a real
     problem), 3 dig deeper (design and sketch), 4 make (a rough
     prototype, then test it), 5 share (a 60 second pitch) and the finish.
   Whole school: neutral words. Shape as /lessons/l/rel-assert-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, C = A.cci, INK = "#0a2f38";
var PURPLE = "#3a0ca3", BLUE = "#4361ee", CYAN = "#4cc9f0", PINK = "#f72585", YELLOW = "#ffc247", GREEN = "#1e9e5a", ORANGE = "#ef7724", GREY = "#9aa5ad";

/* a road at night with cat's eyes glowing */
function road(w, h, on){
  var g = '<rect width="' + w + '" height="' + h + '" fill="#1d3d47"/>' +
    '<path d="M' + (w * 0.42) + ' 0L0 ' + h + 'H' + w + 'L' + (w * 0.58) + ' 0z" fill="#3b4b4f"/>';
  for(var i = 0; i < 6; i++){
    var t = i / 6, y = 40 + t * t * (h - 60), x = w / 2, r = 5 + t * 18;
    g += '<rect x="' + (x - r * 0.6).toFixed(1) + '" y="' + (y - r * 0.3).toFixed(1) + '" width="' + (r * 1.2).toFixed(1) + '" height="' + (r * 0.6).toFixed(1) + '" fill="#fffdf8" opacity=".5"/>';
    if(on) g += '<g class="twinkle" style="animation-delay:-' + (i * 0.3) + 's"><circle cx="' + (x - r * 1.6).toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (r * 0.45).toFixed(1) + '" fill="' + YELLOW + '"/><circle cx="' + (x + r * 1.6).toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (r * 0.45).toFixed(1) + '" fill="' + YELLOW + '"/></g>';
  }
  return g + '<circle cx="' + (w * 0.85) + '" cy="50" r="22" fill="#fff6d6"/>';
}
/* the design cycle as a loop of five icons */
function cycle(cx, cy, r, step){
  var items = [["search", "Spot", PINK], ["pencil", "Sketch", ORANGE], ["toolbox", "Build", BLUE], ["flask", "Test", GREEN], ["mic", "Pitch", PURPLE]], g = "";
  g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + GREY + '" stroke-width="6" stroke-dasharray="14 10" class="dash"/>';
  items.forEach(function(it, i){
    var a = -Math.PI / 2 + i * 2 * Math.PI / 5, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r, hot = step === i + 1;
    g += '<g' + (step ? "" : ' data-s="' + (i + 1) + '"') + '><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (hot ? 54 : 44) + '" fill="' + (hot ? it[2] : "#fffdf8") + '" stroke="' + INK + '" stroke-width="4"/>' +
      C(it[0], x, y - 4, hot ? 52 : 42, hot ? "#fffdf8" : it[2]) + T(x, y + (hot ? 78 : 68), it[1], 24, { a: "middle", f: 1 }) + '</g>';
  });
  return g;
}
/* a sketch on squared paper with labels */
function sketch(){
  var g = '<rect x="20" y="20" width="480" height="380" rx="10" fill="#fffdf8" stroke="' + INK + '" stroke-width="4"/>';
  for(var i = 1; i < 12; i++) g += '<path d="M' + (20 + i * 40) + ' 20V400M20 ' + (20 + i * 34) + 'H500" stroke="#dbe6f5" stroke-width="1.5"/>';
  g += '<g data-s="1"><path d="M140 300h240l-30 -140h-180z" fill="none" stroke="' + BLUE + '" stroke-width="5" stroke-linejoin="round"/><path d="M200 160v-50h120v50" fill="none" stroke="' + BLUE + '" stroke-width="5"/></g>' +
    '<g data-s="2"><path d="M380 230l60 -40" stroke="' + INK + '" stroke-width="2.5"/>' + T(440, 180, "bin lid", 20, { a: "middle", f: 1 }) +
    '<path d="M150 260l-70 -20" stroke="' + INK + '" stroke-width="2.5"/>' + T(80, 225, "handle", 20, { a: "middle", f: 1 }) + '</g>' +
    '<g data-s="3">' + T(260, 360, "made from: a box, card and tape", 22, { a: "middle", c: PINK }) + '</g>';
  return g;
}

window.B5LESSON = {
  id: "cc-steam-1",
  title: "STEAM for Good",
  mins: 30,
  startMins: 5,
  finishMins: 6,
  cover: {
    line: "What is one problem round here you could actually fix? A week of spotting, sketching, building and pitching.",
    art: A.ccScene("steam-for-good") || S("0 0 600 400", cycle(300, 200, 140, 0))
  },

  warm: {
    wordle: { word: "BUILD", hint: "What engineers do with their ideas.", say: "Quick one. Clue straight away if it stalls." }
  },
  warms: {
    2: { wyr: { a: "Invent something that saves time", b: "Invent something that saves the planet",
      twist: "The best inventions often do both.", say: "Tap a side for each person." } },
    3: { wordle: { word: "SKETCH", hint: "Six letters. A quick drawing of an idea, not a perfect one.", say: "Six letters: say so before they start." } },
    4: { wyr: { a: "Build it and it works first time", b: "Build it, break it, and make it better",
      twist: "Nearly every invention breaks first. That is how it gets good.", say: "Leads straight into today's build." } },
    5: { wordle: { word: "PITCH", hint: "A short talk to sell your idea.", say: "Last part this week." } }
  },

  objective: {
    formal: "use a design process to solve a real problem.",
    mission: "Spot a problem, sketch a fix, build a rough version, test it and pitch it in 60 seconds.",
    success: [
      "Say a real problem in one sentence",
      "Sketch and label a fix",
      "Pitch it, or help someone else pitch theirs"
    ],
    say: "Rough is fine all week. Nobody needs to be good at drawing or making."
  },

  sections: [
    {
      kind: "hook", part: 1, title: "Inventions that fixed a real problem.", mins: 15,
      slides: [
        {
          type: "predict",
          title: "What problem did this fix?",
          q: "Cat's eyes are little reflectors in the middle of the road. What problem did they fix?",
          opts: ["Seeing the road at night and in fog", "Stopping cats crossing", "Making roads look nice"],
          a: 0,
          why: "In the 1930s, Percy Shaw from Halifax invented them. The story goes that he got the idea from a cat's eyes shining in his car lights. His road studs help drivers see the road in the dark.",
          say: "Votes first, then reveal."
        },
        {
          title: "Cat's eyes",
          text: "A simple idea, millions of times over. No electricity needed: they reflect car headlights.",
          art: S("0 0 520 420", road(520, 420, true)),
          say: "Ask: what else on the way to school is there to fix a problem?"
        },
        {
          title: "STEAM is a toolbox",
          text: "Five tools for fixing things:",
          stack: true, artWidth: 1250,
          art: S("0 0 1000 260", C("flask", 100, 100, 110, GREEN) + C("laptop", 300, 100, 110, BLUE) + C("gear", 500, 100, 110, ORANGE) + C("palette", 700, 100, 110, PINK) + C("ruler", 900, 100, 110, PURPLE) +
            T(100, 200, "Science", 26, { a: "middle", f: 1 }) + T(300, 200, "Technology", 26, { a: "middle", f: 1 }) + T(500, 200, "Engineering", 26, { a: "middle", f: 1 }) + T(700, 200, "Art", 26, { a: "middle", f: 1 }) + T(900, 200, "Maths", 26, { a: "middle", f: 1 })),
          say: "Art is in there because design matters: a fix people don't like using does not get used."
        },
        {
          title: "This week",
          text: "The same steps real engineers and designers use:",
          art: S("0 0 520 440", cycle(260, 210, 150, 0)),
          say: "Click through the five steps. One a day, more or less."
        }
      ],
      check: {
        q: "What does the A in STEAM stand for?",
        opts: ["Art", "Animals", "Apps"],
        a: 0,
        why: "Art: design, colour and how something looks and feels to use.",
        say: "Quick one."
      }
    },
    {
      kind: "explore", part: 2, title: "Spot a real problem.", mins: 16,
      slides: [
        {
          title: "Small annoyances count",
          text: "The best problems to fix are small, real and bug lots of people:",
          pts: ["A squeaky door", "A messy shelf nobody can find anything on", "Coats falling off pegs", "Not knowing what is on today"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", C("door", 140, 130, 120, "#8d6e3f") + C("book", 380, 130, 120, BLUE) + C("search", 260, 300, 140, PINK)),
          say: "Ask: what bugs you, around here? Collect a few on the board."
        },
        {
          type: "sort",
          title: "Can we fix it this week?",
          q: "Which of these problems could the group actually fix?",
          bins: ["We could fix it", "Too big for this week"],
          cards: [
            { t: "Pencils always go missing", b: 0 },
            { t: "Climate change", b: 1 },
            { t: "The door slams loudly", b: 0 },
            { t: "Traffic jams in the whole town", b: 1 },
            { t: "Nobody knows whose water bottle is whose", b: 0 },
            { t: "The plants keep getting forgotten", b: 0 }
          ],
          why: "Big problems matter too, but small ones are where inventors start.",
          say: "Some could go either way. That is a good argument to have."
        },
        {
          title: "Say it in one sentence",
          text: "A good problem fits in one sentence:",
          art: S("0 0 520 420", A.bubble(40, 60, 440, 70, "The problem is...", 30) + '<g data-s="1">' + A.bubble(60, 170, 420, 70, "...water bottles get mixed up...", 24) + '</g>' +
            '<g data-s="2">' + A.bubble(30, 280, 470, 70, "...so people drink from the wrong one.", 22) + '</g>'),
          say: "Ask anyone who wants to: what is your problem, in one sentence?"
        },
        {
          type: "vote",
          title: "Our problem",
          q: "Which problem should the group work on this week?",
          opts: ["One from our board", "Mixed up water bottles", "Forgotten plants", "Each person picks their own"],
          why: "The winner is the problem for Wednesday, Thursday and Friday.",
          say: "Write the winner big. Each person picking their own is fine too."
        }
      ],
      check: {
        q: "What makes a good problem to fix this week?",
        opts: ["Small, real, and it bugs lots of people", "As big as possible", "Something nobody cares about"],
        a: 0,
        why: "Small and real means you can actually fix it, and test whether it worked.",
        say: "Pull it back to the chosen problem."
      }
    },
    {
      kind: "explore", part: 3, title: "Design it: sketch and label.", mins: 16,
      slides: [
        {
          title: "Sketch it big and simple",
          text: "A sketch is not art homework. It is a way to think on paper:",
          pts: ["Draw the fix, big and simple", "Label the parts", "Say what it is made from"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", sketch()),
          say: "Use paper, the board or the doodle pad. Stick people and boxes are fine."
        },
        {
          title: "Three ideas beat one",
          text: "Designers sketch lots of quick ideas, then pick the best. The first idea is rarely the one.",
          art: S("0 0 560 420", [0, 1, 2].map(function(i){ return '<g transform="translate(' + (30 + i * 175) + ' 80) rotate(' + (i - 1) * 4 + ' 80 120)"><rect width="160" height="220" rx="8" fill="#fffdf8" stroke="' + INK + '" stroke-width="3.5"/>' +
            C(["bulb", "gear", "puzzle"][i], 80, 100, 90, [ORANGE, BLUE, PINK][i]) + T(80, 190, "Idea " + (i + 1), 22, { a: "middle", f: 1 }) + '</g>'; }).join("") +
            '<g data-s="1">' + C("star", 445, 70, 60, YELLOW) + '</g>'),
          say: "Ask: how would you pick the best one? (Cheap, quick to make, fixes the problem.)"
        },
        {
          type: "predict",
          title: "How many tries?",
          q: "Roughly how many prototypes did James Dyson make before his first bagless vacuum cleaner worked?",
          opts: ["About 5", "About 50", "More than 5,000"],
          a: 2,
          why: "More than 5,000. He has said it took 5,127 tries. Every failed one taught him something.",
          say: "Votes first. This sets up tomorrow: breaking things is part of the job."
        }
      ],
      check: {
        q: "Why sketch before you build?",
        opts: ["To try ideas quickly and cheaply", "Because it looks nice", "To avoid building anything"],
        a: 0,
        why: "Sketches are fast and free. Fixing a sketch is easier than fixing a build.",
        say: "Tomorrow: build it."
      }
    },
    {
      kind: "explain", part: 4, title: "Make it: build, test, break, fix.", mins: 18,
      slides: [
        {
          title: "Build a rough version",
          text: "A prototype is a first try, not a finished thing:",
          pts: ["Junk modelling, card and tape are perfect", "Make the main part work. Ignore the rest", "Take a photo before you test it"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", A.scene(520, 420, { ground: 380, time: "day", sun: [440, 80] }) + C("toolbox", 140, 300, 130, ORANGE) + C("tape", 290, 320, 90, GREY) + C("scissors", 400, 300, 100, BLUE) +
            '<g class="sway">' + C("gear", 260, 140, 110, PURPLE) + '</g>'),
          say: "Easier: build just one part. Bigger: make it actually work."
        },
        {
          title: "Test it, break it, fix it",
          text: "Something always goes wrong. That is the useful bit.",
          art: S("0 0 520 440", cycle(260, 210, 150, 4)),
          say: "Try it for real. Ask: what went wrong? Change one thing and test again."
        },
        {
          type: "vote",
          title: "How did the test go?",
          q: "Honestly, first test:",
          opts: ["It worked!", "Half worked", "Fell apart", "Haven't tested yet"],
          why: "Every answer is progress. Fell apart means you know what to fix.",
          say: "Celebrate the disasters as much as the wins."
        }
      ],
      check: {
        q: "Your prototype breaks in the test. What now?",
        opts: ["Work out why, change one thing and test again", "Give up", "Hide it"],
        a: 0,
        why: "Find out why, change one thing, test again. That is engineering.",
        say: "Tomorrow: the pitch."
      }
    },
    {
      kind: "explain", part: 5, title: "Share it: a 60 second pitch.", mins: 12,
      slides: [
        {
          title: "The 60 second pitch",
          text: "Three bits, then stop:",
          pts: ["<b>The problem</b>: one sentence", "<b>The fix</b>: show it, or the sketch", "<b>Why it matters</b>: who it helps"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", C("mic", 150, 220, 160, PURPLE) + C("timer", 370, 160, 120, ORANGE) + '<g data-s="3">' + T(370, 290, "60 seconds", 30, { a: "middle", f: 1 }) + '</g>'),
          say: "Pitch to the group, to one person, or let your sketch do the talking. All count."
        },
        {
          type: "vote",
          title: "The panel",
          q: "Which pitch got the panel's vote? (Or vote on the idea you'd use most.)",
          opts: ["Idea A", "Idea B", "Idea C", "All of them, obviously"],
          why: "The best ideas are the ones people would actually use.",
          say: "Name the ideas on the board as A, B and C first. Keep it kind: everyone who pitched gets a cheer."
        }
      ],
      check: {
        q: "What is one problem round here you could actually fix?",
        opts: ["A small, real one, like mixed up water bottles", "Nothing can be fixed", "Only problems far away"],
        a: 0,
        why: "Small, real problems are where every inventor starts.",
        say: "Round off the week: what did your group fix?"
      }
    }
  ],

  realworld: {
    title: "Jobs that fix things",
    text: "Engineers, product designers, app developers and environmental scientists all spend their days doing what you did this week: spot, sketch, build, test, pitch.",
    art: S("0 0 560 420", A.scene(560, 420, { ground: 370, time: "day", sun: [470, 80] }) + C("hardhat", 140, 270, 110, YELLOW) + C("laptop", 290, 280, 110, BLUE) + C("leaf", 430, 270, 110, GREEN)),
    say: "Ask: which of these would suit you?"
  },

  exit: [
    { q: "What is a prototype?", opts: ["A rough first version to test", "The finished product", "A kind of robot"], a: 0, why: "A rough first version, made to be tested and improved." },
    { q: "What do engineers do when a test fails?", opts: ["Find out why and try again", "Stop", "Blame the test"], a: 0, why: "Failure is information. Change one thing, test again." }
  ]
};
})();
