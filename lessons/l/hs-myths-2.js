/* ==========================================================
   Base 5 Lessons - Human and Social
   Myths and legends, lesson 2 of 3: Legends of Britain
   45 minutes (first half of the Thursday project slot).
   Leads into the HQ activity "Myths then and now".
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", PLUM = "#7b4b8f", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a";

function nessie(x, y, s){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><path d="M-90 0q10 -30 30 0M-40 0q12 -40 34 0" fill="#3fae6a" stroke="' + INK + '" stroke-width="3"/>' +
    '<path d="M10 0q-6 -70 30 -90q24 -8 30 10q-16 0 -22 8q-10 20 -8 72z" fill="#3fae6a" stroke="' + INK + '" stroke-width="3"/><circle cx="56" cy="-82" r="3.4" fill="' + INK + '"/>' +
    '<path d="M-110 4q15 -8 30 0t30 0t30 0t30 0t30 0t30 0t30 0" stroke="#7fbfd0" stroke-width="4" fill="none"/></g>';
}
function cat(x, y, s){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><ellipse cx="0" cy="-20" rx="26" ry="22" fill="#ef7724" stroke="' + INK + '" stroke-width="3"/>' +
    '<circle cx="-14" cy="-46" r="16" fill="#ef7724" stroke="' + INK + '" stroke-width="3"/><path d="M-28 -56l2 -16l10 10M-4 -58l4 -14l6 14" fill="#ef7724" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<circle cx="-19" cy="-48" r="2.6" fill="' + INK + '"/><circle cx="-9" cy="-48" r="2.6" fill="' + INK + '"/><path d="M24 -18q20 -10 14 -30" stroke="#ef7724" stroke-width="6" fill="none" stroke-linecap="round"/></g>';
}
function phoneGame(){
  var lines = [["A brave leader fought invaders.", 1], ["A brave king fought invaders with a great sword.", 2], ["King Arthur pulled a magic sword from a stone!", 3], ["...and a lady in a lake gave him another one, and a wizard helped, and...", 4]];
  var g = "";
  lines.forEach(function(l, i){
    var w = Math.round(l[0].length * 11.6 + 50), y = 30 + i * 100;
    g += '<g data-s="' + l[1] + '"><rect x="20" y="' + y + '" width="' + Math.min(w, 950) + '" height="70" rx="16" fill="#fffdf8" stroke="' + INK + '" stroke-width="3.5"/>' + T(40, y + 44, l[0], 24) + '</g>';
  });
  return S("0 0 980 440", g);
}

window.B5LESSON = {
  id: "hs-myths-2",
  title: "Legends of Britain",
  mins: 45,
  cover: { line: "King Arthur, Robin Hood, Nessie and a very lucky cat. How much of it actually happened?", art: S("0 0 700 420", nessie(330, 330, 1.6) + I("sword", 120, 380, 1.4) + cat(600, 380, 1.3) + A.bird(560, 80, 0.8)) },

  warm: {
    wordle: { word: "ARTHUR", hint: "A legendary king with a round table.", say: "Six letters." },
    wyr: {
      a: "Find Excalibur", b: "Find the Loch Ness Monster",
      artA: S("0 0 300 200", I("sword", 150, 180, 1.6)), artB: S("0 0 300 200", nessie(140, 170, 1)),
      twist: "The most famous photo of Nessie, from 1934, turned out to be a toy submarine with a model head stuck on. That was only admitted in 1994.",
      say: "Ask: what would you do with whichever you found?"
    }
  },

  recap: {
    items: [
      { q: "What is a myth?", a: "A story with gods or monsters, often explaining how the world works." },
      { q: "What is a legend?", a: "A story about a hero or place that might be partly true." },
      { q: "Was Robin Hood real?", a: "Nobody knows for sure. Old records mention outlaws called 'Robehod'." }
    ],
    say: "From last Thursday."
  },

  objective: {
    formal: "explain how British legends mix real history with made up story.",
    mission: "Separate the history from the story in Britain's most famous legends.",
    success: ["Spot the bit of truth in a legend", "Explain how stories grow over time", "Say why places love their legends"],
    say: "Read the mission."
  },

  sections: [
    {
      kind: "hook", title: "Four British legends.", mins: 8,
      slides: [
        {
          title: "Four British legends", stack: true, artWidth: 1300,
          text: "Every part of Britain has one. Here are four of the most famous:",
          art: S("0 0 1000 250",
            '<g data-s="1">' + I("sword", 125, 150, 1) + T(125, 196, "King Arthur", 26, { a: "middle", f: 1 }) + T(125, 228, "a king and his knights", 20, { a: "middle" }) + '</g>' +
            '<g data-s="2">' + I("tree", 375, 150, 1) + T(375, 196, "Robin Hood", 26, { a: "middle", f: 1 }) + T(375, 228, "an outlaw in Sherwood", 20, { a: "middle" }) + '</g>' +
            '<g data-s="3">' + nessie(625, 140, 0.7) + T(625, 196, "Nessie", 26, { a: "middle", f: 1 }) + T(625, 228, "a monster in a loch", 20, { a: "middle" }) + '</g>' +
            '<g data-s="4">' + cat(875, 150, 1.1) + T(875, 196, "Dick Whittington", 26, { a: "middle", f: 1 }) + T(875, 228, "and his famous cat", 20, { a: "middle" }) + '</g>'),
          say: "Click through. Ask what people already know about each."
        },
        {
          type: "predict", title: "Dick Whittington",
          q: "The pantomime says a poor boy and his cat made a fortune in London. Was there a real Dick Whittington?",
          opts: ["Yes: Richard Whittington was Lord Mayor of London. The cat is probably made up", "No, totally made up", "Yes, and the cat became Mayor too"],
          a: 0,
          why: "Richard Whittington was real: a rich merchant who was Lord Mayor of London four times, around 600 years ago. There is no evidence for the cat. Sorry, cat.",
          say: "Ask: why might people add a cat to the story?"
        }
      ],
      check: { q: "A legend usually has...", opts: ["Some truth and a lot of story", "No truth at all", "Only true facts"], a: 0, why: "A grain of truth, then a lot of story on top." }
    },
    {
      kind: "explore", title: "Probably true, or probably story?", mins: 15,
      slides: [
        {
          type: "sort", title: "Truth or story?", q: "Sort each bit of each legend.",
          bins: ["Probably true", "Probably story"],
          cards: [
            { t: "There were outlaws hiding in English forests", b: 0 }, { t: "Robin split one arrow with another arrow", b: 1 },
            { t: "Richard Whittington was Lord Mayor of London", b: 0 }, { t: "His cat made him rich", b: 1 },
            { t: "There is a very deep loch in Scotland called Loch Ness", b: 0 }, { t: "A dinosaur lives in it", b: 1 },
            { t: "British leaders fought invaders around 1,500 years ago", b: 0 }, { t: "A lady in a lake handed Arthur a magic sword", b: 1 }
          ],
          say: "Each legend has one of each. Arguing is welcome."
        },
        {
          title: "How stories grow",
          text: "Every time a story is told, someone adds a bit. Over hundreds of years:",
          stack: true, artWidth: 1250, art: phoneGame(),
          say: "Like passing a message down a very long line of people, for a thousand years."
        },
        {
          type: "predict", title: "The Nessie photo",
          q: "The famous 1934 photo of Nessie's head and neck was actually...",
          opts: ["A real monster", "A toy submarine with a model head", "A floating log"],
          a: 1,
          why: "A toy submarine with a model head. The people involved admitted it in 1994, sixty years later.",
          say: "Ask: why would someone fake it?"
        }
      ],
      check: { q: "Why do legends change over time?", opts: ["Each teller adds or changes bits", "Books rewrite themselves", "They don't change"], a: 0, why: "Each person who tells the story adds a little." }
    },
    {
      kind: "explain", title: "Why we keep telling them.", mins: 10,
      slides: [
        {
          title: "Why keep them?",
          pts: ["<b>Pride</b>: this is our place, our hero", "<b>Good beats bad</b>: Robin helps the poor, Arthur protects the land", "<b>Hope</b>: Arthur is meant to come back when Britain needs him", "<b>Visitors</b>: legends bring tourists, and their money"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", I("sword", 260, 330, 2.6) + A.bambi(430, 320, 0.6)),
          say: "Ask: does our town have a legend?"
        },
        {
          type: "vote", title: "If only", q: "Which legend would you most want to be true?",
          opts: ["King Arthur", "Robin Hood", "Nessie", "Whittington's cat"],
          say: "Ask for one reason each."
        }
      ],
      check: { q: "Why might a town love its legend?", opts: ["It brings pride, and visitors", "It makes the weather better", "It's the law"], a: 0, why: "Pride, and visitors who spend money there." }
    }
  ],

  realworld: {
    title: "Legends still sell",
    text: "Nottingham has a Robin Hood statue outside the castle. Loch Ness has gift shops full of Nessies. There is a new King Arthur or Robin Hood film every few years. Legends are good for business.",
    art: S("0 0 560 420", nessie(280, 330, 1.8) + A.bird(450, 90, 0.9)),
    say: "Ask: what would a Base 5 legend be?"
  },

  exit: [
    { q: "Richard Whittington was...", opts: ["A real Lord Mayor of London", "A made up character", "A cat"], a: 0, why: "Real. The cat is probably the made up bit." },
    { q: "The 1934 Nessie photo was...", opts: ["A hoax", "Proof of a monster"], a: 0, why: "A hoax: a toy submarine with a model head." },
    { q: "Legends grow because...", opts: ["Each teller adds a bit", "Nobody tells them"], a: 0, why: "Every retelling adds something." }
  ],

  driving: {
    angle: "If you went back in time and found out King Arthur never existed, would you tell everyone? Should we?",
    opts: ["Tell everyone the truth", "Keep the legend going", "Pass"],
    say: "Ask: what would we lose if we knew for sure?"
  },

  surprise: { at: "sections.1.slides.1", kind: "bird", x: 1440, y: 120, say: "Tweet. (Bird for: I once caught a worm THIS big. No, THIS big. Honestly, it was enormous.)" }
};
})();
