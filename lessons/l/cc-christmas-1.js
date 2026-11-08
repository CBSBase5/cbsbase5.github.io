/* ==========================================================
   Lessons - Cultural Calendar: Christmas Around the World
   (30 November to 4 December 2026). Celebrations, traditions, beliefs.
   Not everyone celebrates Christmas, so the week looks at December
   all over the world: Hanukkah starts on the evening of Friday 4th.
   Five 30 minute parts, one each morning:
     1 hook (Christmas, somewhere else), 2 explore (traditions by
     country), 3 dig deeper (December's other celebrations), 4 make
     (a decoration from somewhere else), 5 share (our traditions,
     world music) and the finish.
   Whole school: neutral words, sharing is always optional.
   Shape as /lessons/l/rel-assert-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, C = A.cci, CT = A.ccTile, INK = "#0a2f38";
var GREEN = "#0b6e4f", RED = "#e63946", GOLD = "#ffd166", BLUE = "#3a86ff", TEAL = "#007291", ORANGE = "#ef7724", PURPLE = "#7b4b8f";

/* a star lantern (a parol, from the Philippines) */
function parol(x, y, s, cls){
  s = s || 1;
  var pts = [], i;
  for(i = 0; i < 10; i++){ var r = i % 2 ? 26 : 60, a = -Math.PI / 2 + i * Math.PI / 5; pts.push((Math.cos(a) * r).toFixed(1) + " " + (Math.sin(a) * r).toFixed(1)); }
  return '<g' + (cls ? ' class="' + cls + '"' : "") + '><g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<circle r="64" fill="' + GOLD + '" opacity=".25"/>' +
    '<path d="M' + pts.join("L") + 'Z" fill="' + RED + '" stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round"/>' +
    '<circle r="16" fill="' + GOLD + '" stroke="' + INK + '" stroke-width="3"/>' +
    '<path d="M-20 54q-6 30 -14 50M0 58v50M20 54q6 30 14 50" stroke="' + GOLD + '" stroke-width="5" stroke-linecap="round" fill="none"/></g></g>';
}
/* a menorah with n candles lit (of eight, plus the helper in the middle) */
function menorah(x, y, s, lit){
  s = s || 1; lit = lit == null ? 8 : lit;
  var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-110 0h220M0 0v60M-40 60h80" stroke="' + GOLD + '" stroke-width="10" stroke-linecap="round"/>';
  for(var i = 0; i < 9; i++){
    var cx = -100 + i * 25, h = i === 4 ? 70 : 50, on = i === 4 || (i < 4 ? i : i - 1) < lit;
    g += '<rect x="' + (cx - 5) + '" y="' + (-h) + '" width="10" height="' + h + '" fill="#fffdf8" stroke="' + INK + '" stroke-width="2"/>' +
      (on ? '<path class="flicker" d="M' + cx + ' ' + (-h - 22) + 'q8 10 0 18q-8 -8 0 -18z" fill="' + ORANGE + '"/>' : "");
  }
  return g + '</g>';
}
function tree(x, y, s){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><path d="M0 -150l70 110h-30l50 70h-180l50 -70h-30z" fill="' + GREEN + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
    '<rect x="-14" y="30" width="28" height="30" fill="#8d6e3f" stroke="' + INK + '" stroke-width="3"/>' +
    '<g class="twinkle"><circle cx="-30" cy="-30" r="7" fill="' + RED + '"/><circle cx="24" cy="-70" r="7" fill="' + GOLD + '"/><circle cx="40" cy="10" r="7" fill="' + BLUE + '"/><circle cx="-50" cy="20" r="7" fill="' + GOLD + '"/></g>' +
    C("star", 0, -158, 46, GOLD) + '</g>';
}
/* a postcard from a country: a coloured picture panel, a stamp and the name */
function postcard(x, y, name, icon, col, rot, step){
  return '<g' + (step ? ' data-s="' + step + '"' : "") + '><g transform="translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ')"><g class="float" style="animation-delay:-' + (x % 7) / 2 + 's">' +
    '<rect x="-82" y="-104" width="164" height="208" rx="10" fill="' + INK + '" transform="translate(6 8)"/>' +
    '<rect x="-82" y="-104" width="164" height="208" rx="10" fill="#fffdf8" stroke="' + INK + '" stroke-width="4"/>' +
    '<rect x="-68" y="-90" width="136" height="120" rx="6" fill="' + col + '"/>' +
    '<circle cx="-36" cy="-62" r="10" fill="#fffdf8" opacity=".5"/><path d="M-68 10q34 -24 68 -6t68 -8v34h-136z" fill="#fffdf8" opacity=".25"/>' +
    C(icon, 0, -32, 76, "#fffdf8", col) +
    '<rect x="40" y="-98" width="34" height="40" fill="' + GOLD + '" stroke="' + INK + '" stroke-width="2" stroke-dasharray="4 3"/>' +
    T(0, 70, name, 24, { a: "middle", f: 1 }) + '</g></g></g>';
}
function world(){ return ""; }

window.B5LESSON = {
  id: "cc-christmas-1",
  title: "Christmas Around the World",
  mins: 30,
  startMins: 5,
  finishMins: 6,
  cover: {
    line: "How does the rest of the world do December? Same season, very different traditions.",
    art: A.ccScene("christmas-around-the-world") || S("0 0 600 400", tree(300, 300, 1.4))
  },

  warm: {
    wordle: { word: "LIGHT", hint: "Lots of December celebrations around the world are full of it.", say: "Quick one. Clue straight away if it stalls." }
  },
  warms: {
    2: { wyr: { a: "Christmas on a hot beach", b: "Christmas in deep snow",
      twist: "Both happen. In Australia and much of the south, December is summer.", say: "Tap a side for each person." } },
    3: { wordle: { word: "CANDLE", hint: "Six letters today. Lit one more each night for eight nights.", say: "Six letters: say so before they start." } },
    4: { wyr: { a: "Make a decoration", b: "Make a playlist",
      twist: "You can do either today. Or both, if you are quick.", say: "Leads into today's making." } },
    5: { wordle: { word: "MUSIC", hint: "Every country's December has its own.", say: "Last part this week." } }
  },

  objective: {
    formal: "compare how people around the world celebrate in winter, and respect different traditions and beliefs.",
    mission: "Travel round the world in a week, borrow a tradition, and make something from somewhere else.",
    success: [
      "Name a tradition from another country",
      "Say why not everyone celebrates Christmas",
      "Share a tradition of my own, if I want to"
    ],
    say: "Families do December very differently, and some do not celebrate at all. Sharing is always optional."
  },

  sections: [
    {
      kind: "hook", part: 1, title: "Christmas, but somewhere else.", mins: 15,
      slides: [
        {
          type: "predict",
          title: "Guess the country",
          q: "In which country do lots of families eat fried chicken for Christmas dinner?",
          opts: ["Japan", "France", "Brazil"],
          a: 0,
          why: "Japan. Christmas is not a big religious festival there, but a fried chicken Christmas became a tradition in the 1970s, and people book weeks ahead.",
          say: "Votes first, then reveal. Expect groans."
        },
        {
          title: "Around the world",
          text: "A few traditions you might not know:",
          stack: true, artWidth: 1300,
          art: S("0 0 1000 300", postcard(110, 150, "Mexico", "sun", RED, -4, 1) + postcard(305, 150, "Iceland", "book", BLUE, 3, 2) + postcard(500, 150, "Ethiopia", "calendar", GREEN, -2, 3) +
            postcard(695, 150, "Philippines", "star", "#d4a017", 4, 4) + postcard(890, 150, "Australia", "wave", ORANGE, -3, 5)),
          say: "Mexico: Las Posadas, nine nights of processions. Iceland: books on Christmas Eve. Ethiopia: Christmas on 7 January. Philippines: star lanterns from September. Australia: the beach."
        },
        {
          type: "vote",
          title: "Which would you try?",
          q: "Which tradition would you most like to try?",
          opts: ["Books and hot chocolate on Christmas Eve", "Christmas at the beach", "Star lanterns everywhere", "A nine night street party"],
          why: "Tomorrow there are more to choose from.",
          say: "No wrong answers."
        }
      ],
      check: {
        q: "Why is Christmas in summer in Australia?",
        opts: ["It is in the south half of the world, so December is summer", "They move it to July", "Australia has no winter"],
        a: 0,
        why: "When it is winter in the north, it is summer in the south. So lots of Australians have Christmas at the beach.",
        say: "A quick globe gesture helps here."
      }
    },
    {
      kind: "explore", part: 2, title: "Traditions by country.", mins: 16,
      slides: [
        {
          type: "sort",
          title: "Where does it come from?",
          q: "Match each tradition to a country. Guess if you need to.",
          bins: ["Mexico", "Sweden", "Iceland", "Philippines"],
          cards: [
            { t: "Breaking a pinata", b: 0 },
            { t: "Poinsettia plants, first grown there", b: 0 },
            { t: "Saint Lucia Day, with a crown of candles", b: 1 },
            { t: "A giant straw goat", b: 1 },
            { t: "Thirteen cheeky Yule Lads", b: 2 },
            { t: "The book flood: books on Christmas Eve", b: 2 },
            { t: "Star lanterns called parols", b: 3 },
            { t: "A Christmas season that starts in September", b: 3 }
          ],
          why: "Lots of traditions travel too: the Christmas tree came to Britain from Germany.",
          say: "Drag or call it. Guessing is the fun part."
        },
        {
          title: "Same idea, different shape",
          text: "Almost everywhere, December traditions share a few things:",
          pts: ["<b>Light</b> in the darkest month", "<b>Food</b> shared with others", "<b>Giving</b> something", "<b>Music</b> and stories"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", '<g data-s="1">' + parol(130, 120, 0.9, "float") + '</g><g data-s="2">' + CT("chefhat", 380, 120, 120, INK) + '</g>' +
            '<g data-s="3">' + CT("gift", 130, 310, 120, RED) + '</g><g data-s="4">' + CT("music", 380, 310, 120, PURPLE) + '</g>'),
          say: "Ask: which of these four matters most to you in winter?"
        },
        {
          title: "Not everyone, not the same day",
          text: "Christmas is not on the same day for everyone who celebrates it:",
          pts: ["Most churches: 25 December", "Many Orthodox Christians, like lots of people in Ethiopia and Egypt: 7 January", "In the Netherlands, many children get presents on 5 December, from Sinterklaas"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", CT("calendar", 260, 200, 260, TEAL)),
          say: "Different calendars, different days. Nobody is wrong."
        }
      ],
      check: {
        q: "Which country is famous for giving books on Christmas Eve?",
        opts: ["Iceland", "Mexico", "Japan"],
        a: 0,
        why: "Iceland's book flood: new books on Christmas Eve, then reading in bed.",
        say: "Ask: would you like a book flood?"
      }
    },
    {
      kind: "explore", part: 3, title: "December's other celebrations.", mins: 16,
      slides: [
        {
          title: "Not everyone celebrates Christmas",
          text: "Lots of people celebrate other things in winter, or nothing at all. All of that is fine.",
          art: S("0 0 560 420", A.scene(560, 420, { ground: 380, time: "night" }) + menorah(280, 300, 1.4, 1)),
          say: "Keep it light and respectful. No one has to say what their family does."
        },
        {
          title: "Hanukkah starts this Friday",
          text: "Hanukkah, the Jewish festival of lights, starts on the evening of Friday 4 December this year and lasts eight nights.",
          pts: ["One more candle is lit each night", "Families play the dreidel, a spinning top game", "People eat foods fried in oil, like latkes and doughnuts"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", menorah(260, 300, 1.6, 8)),
          say: "Hanukkah remembers the rededication of the Temple in Jerusalem, and oil that lasted eight days."
        },
        {
          type: "sort",
          title: "Winter celebrations",
          q: "When do these happen?",
          bins: ["In December", "In January"],
          cards: [
            { t: "Hanukkah, this year", b: 0 },
            { t: "The winter solstice, the shortest day", b: 0 },
            { t: "Christmas in Ethiopia", b: 1 },
            { t: "Kwanzaa starts", b: 0 },
            { t: "La Befana brings presents in Italy", b: 1 },
            { t: "Sinterklaas in the Netherlands", b: 0 }
          ],
          why: "December and January are full of celebrations, all over the world.",
          say: "Solstice: 21 December. Kwanzaa: 26 December. La Befana: 6 January."
        }
      ],
      check: {
        q: "What is a good way to talk about traditions that are different from yours?",
        opts: ["Be curious and respectful", "Say yours is the only right one", "Laugh at them"],
        a: 0,
        why: "Curious and respectful. Asking questions kindly is how you learn.",
        say: "This matters more than any fact this week."
      }
    },
    {
      kind: "explain", part: 4, title: "Make it: a decoration from somewhere else.", mins: 18,
      slides: [
        {
          type: "vote",
          title: "Pick a make",
          q: "Which would you like to make? Swap, mix or just watch.",
          opts: ["A star lantern (parol), from the Philippines", "A paper chain", "A snowflake, cut from paper", "A world winter playlist instead"],
          why: "Paper, scissors and glue for the first three. A screen for the playlist.",
          say: "Let people pick different ones."
        },
        {
          title: "A paper star lantern",
          text: "A simple version of a parol:",
          pts: ["Draw a big five point star on card", "Cut it out and colour it in bright colours", "Add paper tails along the bottom", "Hang it in a window"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", A.scene(520, 420, { ground: 400, time: "night", hills: false }) + parol(260, 190, 1.8, "float")),
          say: "In the Philippines, whole streets light up with these. Easier: a paper chain."
        },
        {
          title: "Or: a world winter playlist",
          text: "Pick three countries and find a winter song from each one. Rate each: dance, cry or skip?",
          art: S("0 0 520 420", CT("music", 160, 160, 140, PURPLE) + CT("globe", 360, 160, 140, BLUE) + '<g class="pulse">' + CT("headset", 260, 320, 110, INK) + '</g>'),
          say: "Your teacher picks or checks the songs before playing them."
        }
      ],
      check: {
        q: "Where do parols, star lanterns, come from?",
        opts: ["The Philippines", "Sweden", "Mexico"],
        a: 0,
        why: "The Philippines, where the Christmas season starts in September.",
        say: "Quick one."
      }
    },
    {
      kind: "explain", part: 5, title: "Share it: our own traditions.", mins: 12,
      slides: [
        {
          title: "Your winter, your way",
          text: "Think of something your family does in winter, big or tiny. It does not have to be Christmas. Draw it, tell it, or pass.",
          art: S("0 0 520 420", A.scene(520, 420, { ground: 380, time: "night" }) + tree(150, 330, 0.9) + menorah(370, 340, 0.8, 4) + C("cup", 270, 360, 60, ORANGE)),
          say: "Passing is a fine answer. Made up traditions are allowed too."
        },
        {
          type: "vote",
          title: "Borrow one",
          q: "If our group borrowed one tradition this month, which?",
          opts: ["A book and hot chocolate afternoon", "Star lanterns in the window", "A world music morning", "Something fried and delicious (nut free)"],
          why: "The winner is a nice thing to suggest to your teacher.",
          say: "Fun ending. No promises needed."
        }
      ],
      check: {
        q: "How does the rest of the world do December?",
        opts: ["In lots of different ways, with light, food, giving and music", "Exactly the same as here", "They don't do anything"],
        a: 0,
        why: "Same season, very different traditions, and many share the same ideas underneath.",
        say: "Round off the week."
      }
    }
  ],

  realworld: {
    title: "Jobs in the festive season",
    text: "Bakers, musicians, market traders, travel agents and photographers are busiest in December. Some jobs, like grotto helpers and extra delivery drivers, only exist at this time of year.",
    art: S("0 0 560 420", A.scene(560, 420, { ground: 370, time: "dusk", sun: [470, 80] }) + C("chefhat", 140, 280, 110, INK) + C("music", 280, 270, 110, PURPLE) + C("camera", 420, 280, 110, TEAL)),
    say: "Ask: which job would you pick for December?"
  },

  exit: [
    { q: "Why do some people have Christmas on 7 January?", opts: ["They follow a different church calendar", "They forgot", "It snowed"], a: 0, why: "Many Orthodox churches use a different calendar, so Christmas lands on 7 January." },
    { q: "Hanukkah is called the festival of...", opts: ["Lights", "Food", "Snow"], a: 0, why: "Lights: one more candle each night for eight nights." }
  ]
};
})();
