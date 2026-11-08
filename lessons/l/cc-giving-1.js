/* ==========================================================
   Lessons - Cultural Calendar: Giving Tuesday (23 to 27 November 2026)
   Giving, kindness and community. Giving Tuesday itself is on
   Tuesday 1 December this year, so this week gets ready for it.
   Five 30 minute parts, one each morning:
     1 hook (giving that costs nothing), 2 explore (charities and
     causes), 3 dig deeper (a pretend 100 pounds), 4 make (a kindness
     challenge), 5 share (how it went) and the finish.
   Whole school: neutral words. Shape as /lessons/l/rel-assert-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, C = A.cci, INK = "#0a2f38";
var ORANGE = "#fb5607", BLUE = "#3a86ff", PINK = "#ff006e", PURPLE = "#8338ec", YELLOW = "#ffbe0b", GREEN = "#1e9e5a", TEAL = "#007291";

/* a gift box with a bow */
function gift(x, y, s, col, cls){
  s = s || 1; col = col || ORANGE;
  return '<g' + (cls ? ' class="' + cls + '"' : "") + '><g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<rect x="-50" y="-30" width="100" height="80" rx="6" fill="' + col + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<rect x="-58" y="-48" width="116" height="24" rx="5" fill="' + col + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<rect x="-9" y="-48" width="18" height="98" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="3"/>' +
    '<path d="M0 -48q-34 -30 -36 -6q4 10 36 6zM0 -48q34 -30 36 -6q-4 10 -36 6z" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="3"/></g></g>';
}
/* a bar for the 100 pound split */
function bars(parts){
  var x = 60, g = "";
  parts.forEach(function(p, i){
    var w = p[1] * 4;
    g += '<g data-s="' + (i + 1) + '"><rect x="' + x + '" y="150" width="' + w + '" height="90" rx="10" fill="' + p[2] + '" stroke="' + INK + '" stroke-width="3"/>' +
      T(x + w / 2, 205, p[1] + "", 30, { a: "middle", f: 1, c: "#fff" }) + T(x + w / 2, 290, p[0], 22, { a: "middle", f: 1 }) + C(p[3], x + w / 2, 100, 56, p[2]) + '</g>';
    x += w + 6;
  });
  return g;
}

window.B5LESSON = {
  id: "cc-giving-1",
  title: "Giving Tuesday",
  mins: 30,
  startMins: 5,
  finishMins: 6,
  cover: {
    line: "What could you give that costs nothing? A week of kindness, ready for Giving Tuesday on 1 December.",
    art: A.ccScene("giving-tuesday") || S("0 0 600 400", gift(300, 220, 2, ORANGE, "float"))
  },

  warm: {
    wordle: { word: "SMILE", hint: "The cheapest thing you can give. It costs nothing at all.", say: "Quick one. Clue straight away if it stalls." }
  },
  warms: {
    2: { wyr: { a: "Help animals", b: "Help people",
      twist: "No wrong answer. Charities do both, and today you get to pick a cause.", say: "Tap a side for each person." } },
    3: { wordle: { word: "MONEY", hint: "Not the only thing you can give, but today we get 100 pretend pounds of it.", say: "Keep the warm up light." } },
    4: { wyr: { a: "Do one big kind thing", b: "Do ten tiny kind things",
      twist: "Tiny ones add up fast. Today is about trying a few.", say: "This leads straight into the challenge." } },
    5: { wordle: { word: "HAPPY", hint: "How helping often makes the helper feel too.", say: "Last part this week." } }
  },

  objective: {
    formal: "understand different ways to give, and how charities help.",
    mission: "Find three things you can give that cost nothing, pick a cause, and try a kindness challenge.",
    success: [
      "Name a way to give that costs nothing",
      "Say what a charity does",
      "Try a kind thing, if I want to"
    ],
    say: "Nobody needs money for any of this week."
  },

  sections: [
    {
      kind: "hook", part: 1, title: "Giving is not just money.", mins: 15,
      slides: [
        {
          title: "What is Giving Tuesday?",
          text: "A worldwide day of giving that started in 2012. This year it is on Tuesday 1 December: a day for doing good, in any way you can.",
          art: S("0 0 560 420", A.scene(560, 420, { ground: 380, time: "day", sun: [470, 80] }) + C("globe", 280, 190, 160, BLUE) + gift(140, 320, 0.8, PINK, "float") + gift(420, 320, 0.8, PURPLE, "float")),
          say: "Ask: has anyone given something, or been given something, that did not cost money?"
        },
        {
          title: "Four things that cost nothing",
          text: "Each of these is a real gift:",
          stack: true, artWidth: 1250,
          art: S("0 0 1000 270", '<g data-s="1">' + C("clock", 125, 100, 120, BLUE) + T(125, 200, "Time", 30, { a: "middle", f: 1 }) + T(125, 240, "helping out", 20, { a: "middle" }) + '</g>' +
            '<g data-s="2">' + C("toolbox", 375, 100, 120, ORANGE) + T(375, 200, "Skills", 30, { a: "middle", f: 1 }) + T(375, 240, "fixing, teaching, making", 20, { a: "middle" }) + '</g>' +
            '<g data-s="3">' + C("smile", 625, 100, 120, YELLOW) + T(625, 200, "Kindness", 30, { a: "middle", f: 1 }) + T(625, 240, "a word, a door held", 20, { a: "middle" }) + '</g>' +
            '<g data-s="4">' + C("bag", 875, 100, 120, PURPLE) + T(875, 200, "Stuff", 30, { a: "middle", f: 1 }) + T(875, 240, "things you no longer use", 20, { a: "middle" }) + '</g>'),
          say: "Click through. Ask: which one are you best at giving?"
        },
        {
          type: "sort",
          title: "Costs money, or costs nothing?",
          q: "Sort these ways of giving.",
          bins: ["Costs money", "Costs nothing"],
          cards: [
            { t: "Buying a raffle ticket", b: 0 },
            { t: "Teaching someone a game", b: 1 },
            { t: "Holding a door", b: 1 },
            { t: "Donating to a charity", b: 0 },
            { t: "Helping tidy up after lunch", b: 1 },
            { t: "Giving away a book you have finished", b: 1 }
          ],
          why: "Most giving costs nothing at all.",
          say: "The book one is arguable: it cost money once. Fun to argue about."
        }
      ],
      check: {
        q: "Which of these is giving that costs nothing?",
        opts: ["Spending ten minutes helping someone", "Buying an expensive present", "Lending money"],
        a: 0,
        why: "Time is one of the best things to give, and it is free.",
        say: "Link back to the week's question."
      }
    },
    {
      kind: "explore", part: 2, title: "Charities: who helps with what?", mins: 16,
      slides: [
        {
          type: "predict",
          title: "What is a charity?",
          q: "Which is closest?",
          opts: ["A group that raises money and time to help a cause", "A shop that sells second hand clothes", "A kind of bank"],
          a: 0,
          why: "A charity helps a cause, not to make a profit. Many run charity shops to raise money, so the shop answer is half right.",
          say: "Votes first, then reveal."
        },
        {
          title: "Causes people care about",
          text: "There is a charity for almost anything:",
          stack: true, artWidth: 1300,
          art: S("0 0 1050 260", C("paw", 105, 100, 110, "#8d6e3f") + C("wave", 315, 100, 110, BLUE) + C("cross", 525, 100, 110, "#d63b2f") + C("people", 735, 100, 110, PURPLE) + C("ball", 945, 100, 110, GREEN) +
            T(105, 200, "Animals", 26, { a: "middle", f: 1 }) + T(315, 200, "The sea", 26, { a: "middle", f: 1 }) + T(525, 200, "Health", 26, { a: "middle", f: 1 }) + T(735, 200, "People", 26, { a: "middle", f: 1 }) + T(945, 200, "Sport", 26, { a: "middle", f: 1 })),
          say: "Ask: does anyone know a charity for one of these? Rescue centres, lifeboats and food banks are all charities."
        },
        {
          type: "vote",
          title: "Your cause",
          q: "If you could help one cause this week, which?",
          opts: ["Animals", "The sea and the planet", "People who need help", "Sport for everyone"],
          why: "The winning cause is the one to keep in mind for the rest of the week.",
          say: "Note the winner on the board: it comes back on Wednesday."
        }
      ],
      check: {
        q: "What do charities usually do with the money they raise?",
        opts: ["Spend it on their cause", "Keep it all for themselves", "Give it to the government"],
        a: 0,
        why: "Charities spend the money on their cause, like feeding animals or training lifeboat crews.",
        say: "Good charities are open about where the money goes."
      }
    },
    {
      kind: "explore", part: 3, title: "A pretend 100 pounds.", mins: 16,
      slides: [
        {
          title: "Split 100 pounds",
          text: "Imagine the group has 100 pounds to give away. Here is one way to split it:",
          stack: true, artWidth: 1150,
          art: S("0 0 560 320", bars([["Animals", 50, "#8d6e3f", "paw"], ["The sea", 30, BLUE, "wave"], ["People", 20, PURPLE, "people"]])),
          say: "This is just an example. Next you make your own."
        },
        {
          type: "vote",
          title: "Biggest share",
          q: "Which cause should get the biggest share of our 100 pounds?",
          opts: ["Animals", "The sea and the planet", "People who need help", "Sport for everyone"],
          why: "There is no right split. What matters is being able to say why.",
          say: "Then ask: how would you split the rest? Do the maths together on the board."
        },
        {
          title: "Say why in one sentence",
          text: "Giving well means thinking about it:",
          pts: ["\"I gave the most to ... because ...\"", "\"I gave some to ... because ...\"", "Different answers are fine"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", C("coin", 160, 150, 120, YELLOW) + C("coin", 260, 120, 100, YELLOW) + C("coin", 350, 160, 110, YELLOW) + '<g data-s="1">' + A.bubble(90, 270, 340, 56, "Because it matters to me.", 24) + '</g>'),
          say: "Anyone can say theirs out loud. Passing is fine."
        }
      ],
      check: {
        q: "If 100 pounds is split equally between 4 causes, how much does each get?",
        opts: ["25 pounds", "40 pounds", "10 pounds"],
        a: 0,
        why: "100 divided by 4 is 25.",
        say: "A quick bit of maths. Let anyone who likes numbers explain it."
      }
    },
    {
      kind: "explain", part: 4, title: "Make it: a kindness challenge.", mins: 18,
      slides: [
        {
          type: "vote",
          title: "Pick a challenge",
          q: "Which would you like to try today? Swap, mix or just watch.",
          opts: ["Three tiny kind things", "Fix or tidy something for someone", "Ten minutes of helping out", "Watch and chat"],
          why: "Any of these counts. Small is good.",
          say: "Let people pick different ones."
        },
        {
          title: "Kindness bingo",
          text: "Get a line, or just one. Quietly or not.",
          stack: true, artWidth: 1000,
          art: S("0 0 600 380", (function(){
            var cells = ["Hold a door", "Say thanks", "Help tidy", "Share a snack (nut free)", "Kind comment", "Teach a game", "Let someone go first", "Pick something up", "Ask how they are"], g = "";
            cells.forEach(function(c, i){
              var x = 30 + (i % 3) * 185, y = 20 + Math.floor(i / 3) * 115;
              g += '<rect x="' + x + '" y="' + y + '" width="170" height="100" rx="14" fill="' + ["#fff0dc", "#e8f0ff", "#ffe3f0"][i % 3] + '" stroke="' + INK + '" stroke-width="3"/>' +
                T(x + 85, y + 58, c.length > 18 ? c.slice(0, c.lastIndexOf(" ", 18)) : c, 18, { a: "middle", f: 1 }) +
                (c.length > 18 ? T(x + 85, y + 80, c.slice(c.lastIndexOf(" ", 18) + 1), 16, { a: "middle" }) : "");
            });
            return g;
          })()),
          say: "Draw it on the board, or just talk through it. Tick them off through the day."
        },
        {
          title: "Fixing is giving",
          text: "Something broken, messy or lost? Fixing it is a gift.",
          pts: ["Find something to fix: a game, a shelf, a display", "Fix it, with help if needed", "Show the owner"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", A.scene(520, 420, { ground: 380, time: "day", sun: [430, 80] }) + C("toolbox", 180, 290, 150, ORANGE) + '<g class="sway">' + C("wrench", 360, 250, 110, INK) + '</g>'),
          say: "Easier: tidy one thing. Bigger: run a fix it hour."
        }
      ],
      check: {
        q: "Why do tiny kind things matter?",
        opts: ["They add up, and they make someone's day better", "They don't, only big things count", "So you get a prize"],
        a: 0,
        why: "Small acts add up fast, and they often start more kindness.",
        say: "Ask: has a tiny kind thing ever made your day?"
      }
    },
    {
      kind: "explain", part: 5, title: "Share it: how did it go?", mins: 12,
      slides: [
        {
          type: "vote",
          title: "How did it feel?",
          q: "If you tried something kind this week, how did it feel?",
          opts: ["Good", "A bit awkward", "Didn't notice", "Didn't try one, and that's fine"],
          why: "Lots of people say helping makes them feel good too. Awkward is normal at first.",
          say: "No one has to say what they did."
        },
        {
          title: "Ready for Tuesday",
          text: "Giving Tuesday is on 1 December. One idea to take with you: give something that costs nothing, to someone who wouldn't expect it.",
          art: S("0 0 520 420", A.scene(520, 420, { ground: 380, time: "dusk", sun: [430, 90] }) + gift(260, 260, 1.6, ORANGE, "float") + C("star", 120, 120, 50, YELLOW) + C("star", 400, 140, 40, YELLOW)),
          say: "That is the week's big question answered, in their own way."
        }
      ],
      check: {
        q: "What could you give that costs nothing?",
        opts: ["Time, skills or kindness", "Nothing, giving always costs money", "Only presents"],
        a: 0,
        why: "Time, skills and kindness all count as giving.",
        say: "Round off the week."
      }
    }
  ],

  realworld: {
    title: "Giving at work",
    text: "Lots of jobs grow out of giving: volunteers, charity workers, fundraisers, wildlife rangers. Volunteering looks great on a CV or college application too.",
    art: S("0 0 560 420", A.scene(560, 420, { ground: 370, time: "day", sun: [470, 80] }) + C("hands", 150, 270, 120, ORANGE) + C("paw", 290, 280, 100, "#8d6e3f") + C("clipboard", 430, 270, 110, BLUE)),
    say: "Ask: which of these jobs sounds good?"
  },

  exit: [
    { q: "Which of these is a gift that costs nothing?", opts: ["Teaching someone something", "A new phone", "A gift card"], a: 0, why: "Skills and time are free to give." },
    { q: "What does a charity do?", opts: ["Raises money and time to help a cause", "Sells things for profit", "Lends money"], a: 0, why: "Charities help a cause, not to make a profit." }
  ]
};
})();
