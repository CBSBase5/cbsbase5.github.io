/* ==========================================================
   Lessons - Cultural Calendar extra: Message received
   A stand alone 30 minute Remembrance lesson (12 November 2026),
   for a group that has already been through the week's five part
   Remembrance lesson. Not linked to a timetable slot: the No Jay
   day page offers it, and it sits in the Lessons library.
   Hook: the Christmas truce of 1914. Explore: how messages got
   through (runners, dogs, pigeons, lamps, wires, the field postcard).
   Explain: crack and send Morse as a group.
   Whole school safe wording ("your teacher"). ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, C = A.cci, CT = A.ccTile, INK = "#0a2f38";
var RED = "#c8102e", DARK = "#7d0f12", CREAM = "#fff7ec", GREEN = "#2f6b3a", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", MUD = "#6b4f33";

var MORSE = { A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--",
  N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--.." };

/* dots and dashes for one letter, left edge at x, centred on y */
function marks(code, x, y, u, col){
  var g = "", cx = x;
  code.split("").forEach(function(c){
    if(c === ".") { g += '<circle cx="' + (cx + u * 0.5) + '" cy="' + y + '" r="' + (u * 0.42) + '" fill="' + col + '"/>'; cx += u * 1.5; }
    else { g += '<rect x="' + cx + '" y="' + (y - u * 0.36) + '" width="' + (u * 2.4) + '" height="' + (u * 0.72) + '" rx="' + (u * 0.36) + '" fill="' + col + '"/>'; cx += u * 3.2; }
  });
  return g;
}
/* the whole alphabet as a key, four columns */
function key(){
  var g = '<rect x="10" y="10" width="980" height="480" rx="26" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="5"/>';
  Object.keys(MORSE).forEach(function(l, i){
    var col = Math.floor(i / 7), row = i % 7, x = 40 + col * 245, y = 62 + row * 62;
    g += T(x, y + 11, l, 34, { f: 1, c: DARK }) + marks(MORSE[l], x + 42, y, 15, INK);
  });
  return g;
}
/* a word written in Morse, letter by letter, each letter its own build step */
function word(w, x, y, u, steps, from){
  var g = "", cx = x;
  w.split("").forEach(function(l, i){
    var code = MORSE[l];
    if(!code){ cx += u * 3; return; }
    var wdt = code.split("").reduce(function(n, c){ return n + (c === "." ? 1.5 : 3.2); }, 0) * u;
    g += '<g>' + marks(code, cx, y, u, INK) + '</g>';
    if(steps) g += '<g data-s="' + (i + 1 + (from || 0)) + '">' + T(cx + wdt / 2 - u * 0.4, y + u * 2.4, l, u * 1.8, { a: "middle", f: 1, c: RED }) + '</g>';
    cx += wdt + u * 1.6;
  });
  return g;
}
/* two trenches and no man's land, with a football in the middle */
function truce(w, h){
  var g = A.scene(w, h, { ground: h - 120, time: "night", sun: [w - 110, 80], clouds: false });
  g += '<rect x="0" y="' + (h - 120) + '" width="' + w + '" height="120" fill="#7a6a52"/>';
  g += '<path d="M0 ' + (h - 120) + 'h150v40h-150z" fill="' + MUD + '"/><path d="M' + (w - 150) + ' ' + (h - 120) + 'h150v40h-150z" fill="' + MUD + '"/>';
  for(var i = 0; i < 9; i++){ var x = 30 + i * 14; g += '<rect x="' + x + '" y="' + (h - 132) + '" width="12" height="12" fill="#c9b48a" stroke="' + INK + '" stroke-width="2"/>'; g += '<rect x="' + (w - 30 - i * 14 - 12) + '" y="' + (h - 132) + '" width="12" height="12" fill="#c9b48a" stroke="' + INK + '" stroke-width="2"/>'; }
  g += '<g class="float">' + C("ball", w / 2, h - 150, 70, INK) + '</g>';
  g += C("people", w * 0.3, h - 175, 90, "#c9d6a8") + C("people", w * 0.7, h - 175, 90, "#d8dde3");
  return g;
}
/* the tick box postcard soldiers sent home */
function postcard(){
  var lines = ["I am quite well.", "I have been admitted into hospital.", "I have received your letter.", "Letter follows at first opportunity.", "I have received no letter from you lately."];
  var g = '<rect x="20" y="20" width="620" height="380" rx="14" fill="#f3e6c8" stroke="' + INK + '" stroke-width="5"/>' +
    T(330, 70, "FIELD SERVICE POST CARD", 28, { a: "middle", f: 1, c: DARK });
  lines.forEach(function(t, i){
    var y = 120 + i * 52;
    g += '<rect x="56" y="' + (y - 22) + '" width="28" height="28" rx="4" fill="#fffdf8" stroke="' + INK + '" stroke-width="3"/>' + T(100, y, t, 24, {});
    if(i === 0 || i === 2) g += '<g data-s="' + (i === 0 ? 1 : 2) + '"><path d="M60 ' + (y - 8) + 'l8 9l14 -18" stroke="' + RED + '" stroke-width="5" fill="none" stroke-linecap="round"/></g>';
    else g += '<g data-s="3"><path d="M96 ' + (y - 8) + 'h' + (t.length * 11.5) + '" stroke="' + INK + '" stroke-width="4"/></g>';
  });
  return g;
}

window.B5LESSON = {
  id: "cc-remembrance-2",
  title: "Message received",
  mins: 30,
  startMins: 4,
  finishMins: 5,
  cover: {
    line: "No phones, no internet, shells overhead. How did a message get home?",
    art: S("0 0 700 420", truce(700, 420))
  },

  warm: {
    wordle: { word: "MORSE", hint: "A code made of dots and dashes. You will be using it in a minute.", say: "If it stalls, give the clue." },
    wyr: { a: "Send a message by pigeon", b: "Send a message by dog", twist: "Both really happened. Today you find out which was faster.", say: "Tap a side each. No reasons needed." }
  },

  objective: {
    formal: "find out how messages got through in the First World War, and send a short message in Morse code.",
    mission: "Hear about a football match nobody planned, find out how messages got through, then crack and send a code.",
    success: [
      "Say one way a message got through",
      "Crack a short Morse message as a group",
      "Send one of my own, if I want to"
    ],
    say: "Everyone takes part in their own way. Watching and decoding in your head counts."
  },

  sections: [
    {
      kind: "hook", part: 0, title: "Christmas 1914.", mins: 8,
      slides: [
        {
          title: "Christmas Eve, 1914",
          text: "Freezing trenches, often less than 100 metres apart.",
          pts: ["Singing from the other side", "Carols, in German and English", "Someone climbed out"],
          build: true, ptsFrom: 1,
          art: S("0 0 560 420", truce(560, 420)),
          say: "Five months into the war. Read it slowly and let 'someone climbed out' hang for a second."
        },
        {
          type: "predict",
          title: "What happened next?",
          q: "On Christmas Day, in no man's land, what did lots of soldiers do?",
          opts: ["Shook hands, swapped gifts and some played football", "Kept fighting as normal", "Went home for Christmas"],
          a: 0,
          why: "It was called the Christmas truce. Soldiers swapped chocolate, buttons and cigarettes, buried their dead together, and in some places kicked a ball about.",
          say: "Votes first, then reveal. It was not everywhere along the front, and it did not happen again on the same scale."
        },
        {
          type: "vote",
          title: "Would you have climbed out?",
          q: "Your enemy waves a white flag and shouts Happy Christmas. Do you go?",
          opts: ["Yes, straight out", "Wait and watch first", "No chance", "Pass"],
          why: "Soldiers on both sides made every one of these choices. All of them make sense.",
          say: "No reasons needed. If someone wants to say why, brilliant."
        }
      ],
      check: {
        q: "What was the Christmas truce?",
        opts: ["An unofficial break in the fighting at Christmas 1914", "The end of the war", "A football league"],
        a: 0,
        why: "Nobody in charge planned it. The soldiers did it themselves.",
        say: "Link: news of it only reached home through letters. Which brings us to messages."
      }
    },
    {
      kind: "explore", part: 0, title: "Getting a message through.", mins: 9,
      slides: [
        {
          title: "No phones. No internet.",
          text: "Telephone wires ran along the trenches, but shells kept cutting them. So what else?",
          stack: true, artWidth: 1250,
          art: S("0 0 1000 260", CT("shoe", 110, 110, 120, ORANGE) + CT("paw", 310, 110, 120, MUD) + CT("letter", 500, 110, 120, TEAL) + CT("torch", 690, 110, 120, "#c98a12") + CT("phone", 890, 110, 120, INK) +
            T(110, 220, "Runners", 24, { a: "middle", f: 1 }) + T(310, 220, "Dogs", 24, { a: "middle", f: 1 }) + T(500, 220, "Pigeons", 24, { a: "middle", f: 1 }) + T(690, 220, "Lamps", 24, { a: "middle", f: 1 }) + T(890, 220, "Wires", 24, { a: "middle", f: 1 })),
          say: "Ask: which one would you trust with something important?"
        },
        {
          type: "sort",
          title: "Animal, person or kit?",
          q: "Sort how each message travelled.",
          bins: ["Animal", "Person", "Kit"],
          cards: [
            { t: "A tiny tube clipped to a leg, flying home", b: 0 },
            { t: "A canister on a collar, dodging shell holes", b: 0 },
            { t: "A runner sprinting between trenches", b: 1 },
            { t: "A signaller waving flags", b: 1 },
            { t: "A lamp flashing long and short blinks", b: 2 },
            { t: "A telephone line, until a shell cuts it", b: 2 }
          ],
          why: "Animals were often the safest bet. A pigeon is small, fast, and hard to hit.",
          say: "Drag or call it. The pigeon one usually goes first."
        },
        {
          title: "The tick box postcard",
          text: "Soldiers could send a card home with ready made lines. Tick what is true, cross out the rest. Writing anything else and it went in the bin.",
          art: S("0 0 660 420", postcard()),
          say: "Ask: what does a family at home know from this card? And what do they not know?"
        },
        {
          type: "predict",
          title: "Blacked out",
          q: "Normal letters home sometimes arrived with words blacked out. Why?",
          opts: ["An officer checked them, so no secrets reached the enemy", "The ink ran in the rain", "The post office did not like swearing"],
          a: 0,
          why: "It was called censorship. Where you were, what you were planning, how many of you: all blacked out in case the letter was captured.",
          say: "The swearing option gets a laugh. Some of that was crossed out too."
        }
      ],
      check: {
        q: "Why did pigeons matter so much?",
        opts: ["They still got through when the wires were cut", "They could talk", "They were cheaper than stamps"],
        a: 0,
        why: "When shells cut the phone lines, a pigeon could still fly home with the message.",
        say: "Pigeons and dogs were given medals for it. The Dickin Medal still goes to brave animals today."
      }
    },
    {
      kind: "explain", part: 0, title: "Crack the code.", mins: 9,
      slides: [
        {
          title: "Morse code",
          text: "Every letter is a pattern of short (dot) and long (dash). Lamps flashed it, wires clicked it, radios beeped it.",
          stack: true, artWidth: 1250,
          art: S("0 0 1000 500", key()),
          say: "Leave this up a moment. Point out E is just one dot: the most used letter gets the shortest code."
        },
        {
          title: "Incoming message",
          text: "Crack it one letter at a time. Shout out, point, or work it out in your head.",
          stack: true, artWidth: 1250,
          art: S("0 0 1000 300", word("THANK", 60, 70, 20, true) + word("YOU", 60, 200, 20, true, 5)),
          say: "Click to reveal each letter after the group has a go. Flick back to the key if needed."
        },
        {
          type: "predict",
          title: "The famous one",
          q: "... --- ... is the most famous message ever sent in Morse. What does it say?",
          opts: ["SOS", "OK", "HI"],
          a: 0,
          why: "Three short, three long, three short: SOS, the call for help. Easy to tap, easy to spot, even through noise.",
          say: "Tap it on the table together: short short short, long long long, short short short."
        },
        {
          type: "vote",
          title: "Send one",
          q: "Pick a way to send a short word. Everyone else cracks it.",
          opts: ["Tap it on the table", "Flash a torch", "Draw the dots and dashes", "Just decode"],
          why: "Short words work best: HI, YES, NO, or someone's initials.",
          say: "Go back to the key slide so senders can read it off. Your teacher can go first to model it."
        }
      ],
      check: {
        q: "In Morse code, what is a dash?",
        opts: ["A long signal", "A short signal", "A gap between words"],
        a: 0,
        why: "Dots are short, dashes are long. The gaps between them matter too.",
        say: "Quick one to finish."
      }
    }
  ],

  realworld: {
    title: "Still out there",
    text: "Pilots still hear Morse from navigation beacons. Radio fans send it round the world for fun. And if you fancy flying a message yourself, Pigeon Post is in the game vault.",
    art: S("0 0 560 420", A.scene(560, 420, { ground: 370, time: "day", sun: [460, 80] }) + C("plane", 150, 140, 110, TEAL) + C("satellite", 420, 150, 100, INK) + '<g class="float">' + A.bird(290, 260, 1.4) + '</g>'),
    say: "Pigeon Post is on the Cultural Calendar page if anyone has time left."
  },

  exit: [
    { q: "How did lots of messages get through when the wires were cut?", opts: ["Pigeons, dogs and runners", "Email", "They did not"], a: 0, why: "Animals and runners carried messages when the wires were down." },
    { q: "What happened at Christmas 1914?", opts: ["Soldiers met in no man's land, and some played football", "The war ended", "Nothing"], a: 0, why: "The Christmas truce: soldiers chose a day of peace themselves." }
  ]
};
})();
