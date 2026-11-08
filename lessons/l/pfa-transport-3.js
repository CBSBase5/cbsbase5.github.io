/* ==========================================================
   Base 5 Lessons - Preparation for Adulthood
   Transport and travel, lesson 3 of 3: When it goes wrong
   30 minutes (Friday PFA): one warm up. Leads into "Read the signs".
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a", SLATE = "#3f6f8f";

function board(){
  return S("0 0 560 300", '<rect x="20" y="20" width="520" height="220" rx="12" fill="' + INK + '"/>' +
    T(50, 70, "10:12  College", 30, { f: 1, c: YELLOW }) + T(510, 70, "On time", 26, { a: "end", c: "#9fe0b4" }) +
    T(50, 130, "10:20  Town Centre", 30, { f: 1, c: YELLOW }) + '<g class="twinkle">' + T(510, 130, "Delayed", 26, { a: "end", c: YELLOW }) + '</g>' +
    T(50, 190, "10:35  Hospital", 30, { f: 1, c: YELLOW }) + T(510, 190, "Cancelled", 26, { a: "end", c: "#ffb38a" }) +
    '<path d="M150 240v40M410 240v40" stroke="' + INK + '" stroke-width="10"/>');
}

window.B5LESSON = {
  id: "pfa-transport-3",
  title: "When it goes wrong",
  mins: 30,
  startMins: 4,
  finishMins: 5,
  cover: { line: "Delays, missed stops and a dead phone. Every traveller has a bad day. Here's how to handle one.", art: board() },

  warm: {
    wordle: { word: "DELAY", hint: "When the bus or train is late, the board says this.", say: "Five letters." },
    wyr: { a: "A train that's 20 minutes late", b: "A bus that's 10 minutes early and leaves without you", twist: "Early buses are rarer than late ones, but they happen. Being at the stop a few minutes early beats both.", say: "Quick." }
  },

  recap: {
    items: [
      { q: "What is 14:30 on a timetable?", a: "Half past 2 in the afternoon." },
      { q: "There and back on the same day: which ticket?", a: "A return, usually." }
    ],
    say: "From last Friday."
  },

  objective: {
    formal: "make a sensible plan B when a journey goes wrong, and know who to ask for help.",
    mission: "Be the calmest person at the bus stop when everything goes wrong.",
    success: ["Name things that can go wrong", "Pick a good plan B", "Know who is safe to ask for help"],
    say: "Read the mission."
  },

  sections: [
    {
      kind: "hook", title: "Things that go wrong.", mins: 5,
      slides: [
        {
          title: "It happens to everyone", stack: true, artWidth: 1300,
          text: "Every traveller meets these sooner or later:",
          art: A.iconRow([["bus", "Late or cancelled"], ["map", "Missed your stop"], ["phone", "Phone died"], ["walk", "Lost"], ["coin", "Not enough money"]], { build: true, s: 0.9, h: 240 }),
          say: "Ask: which has happened to you, or someone you know?"
        }
      ],
      check: { q: "When a journey goes wrong, the first thing to do is...", opts: ["Stop, breathe, and think about plan B", "Panic loudly", "Run in a random direction"], a: 0, why: "Stop and think. Most problems have a simple fix." }
    },
    {
      kind: "explore", title: "Good plan B, or not?", mins: 10,
      slides: [
        { title: "Read the board", text: "Station and bus stop screens tell you what's changed:", art: board(),
          say: "Ask: which bus would you worry about? What would you do?" },
        {
          type: "sort", title: "Good plan B, or not?", q: "Sort the ideas.",
          bins: ["Good plan B", "Not a good idea"],
          cards: [
            { t: "Missed my stop: get off at the next one and go back", b: 0 },
            { t: "Missed my stop: stay on to the end of the line", b: 1 },
            { t: "Phone died: ask the driver or station staff", b: 0 },
            { t: "Lost: go into a shop and ask someone working there", b: 0 },
            { t: "Lost: accept a lift from a stranger", b: 1 },
            { t: "Train cancelled: check the board or ask staff for the next one", b: 0 }
          ],
          say: "The stranger lift one: always no."
        }
      ],
      check: { q: "Your phone is dead and you're lost in town. Who is safest to ask?", opts: ["Someone working: shop staff, a driver, station staff", "Anyone in a hoodie", "Nobody, just wander"], a: 0, why: "People in uniform or working in a shop are the safest people to ask." }
    },
    {
      kind: "explain", title: "Your back up card.", mins: 6,
      slides: [
        {
          title: "A back up card",
          text: "Phones die. A small card in your pocket or bag doesn't.",
          pts: ["Who to call if something goes wrong, and their number", "A second person, in case the first doesn't answer", "Keep it somewhere you'll always have it"],
          build: true, ptsFrom: 1,
          art: S("0 0 480 300", '<rect x="60" y="40" width="360" height="220" rx="18" fill="#fffdf8" stroke="' + INK + '" stroke-width="4"/><rect x="60" y="40" width="360" height="56" rx="18" fill="' + SLATE + '"/><rect x="60" y="76" width="360" height="20" fill="' + SLATE + '"/>' +
            T(240, 80, "If I need help", 26, { a: "middle", f: 1, c: "#fff" }) + T(90, 140, "Call: ...............", 24) + T(90, 190, "Or: ..................", 24) + T(90, 236, "I'm going to: .........", 22)),
          say: "Nobody needs to write real numbers here. Ask: where would you keep yours?"
        }
      ],
      check: { q: "Why carry a card as well as a phone?", opts: ["Phones run out of battery", "Cards are fashionable", "Phones are illegal on buses"], a: 0, why: "Phones die. Cards don't." }
    }
  ],

  realworld: {
    title: "Calm travellers get home",
    text: "Delays, cancellations and wrong turns happen to everyone, every day. People who stop, check, and ask the right person usually get home only a little late.",
    art: board(),
    say: "Ask: what's the calmest thing to say to yourself when it goes wrong?"
  },

  exit: [
    { q: "Missed your stop. Best plan B?", opts: ["Get off at the next one and go back", "Stay on to the end"], a: 0, why: "Next stop, then go back." },
    { q: "Who is safest to ask for help?", opts: ["Someone working there", "A stranger offering a lift"], a: 0, why: "Staff, drivers, shop workers." }
  ],

  driving: {
    angle: "If you could time travel back five minutes to catch a bus you just missed, would it be worth using a time machine for?",
    opts: ["Absolutely", "No, I'll get the next one", "Only if it's raining"],
    say: "Light end to the transport series."
  },

  surprise: { at: "sections.1.slides.0", kind: "bird", x: 1450, y: 150, say: "Bird status: on time. As always." }
};
})();
