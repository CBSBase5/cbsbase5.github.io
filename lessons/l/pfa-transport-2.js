/* ==========================================================
   Base 5 Lessons - Preparation for Adulthood
   Transport and travel, lesson 2 of 3: Tickets and timetables
   30 minutes (Friday PFA): one warm up. Leads into "Read the signs".
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a", SLATE = "#3f6f8f";

var STOPS = ["Bus Station", "Market Square", "Hospital", "College"];
var TIMES = [["09:05", "09:35", "10:05", "10:35"], ["09:12", "09:42", "10:12", "10:42"], ["09:20", "09:50", "10:20", "10:50"], ["09:31", "10:01", "10:31", "11:01"]];
function timetable(hl){
  var g = '<rect x="0" y="0" width="900" height="330" rx="14" fill="#fffdf8" stroke="' + INK + '" stroke-width="4"/>' +
    '<rect x="0" y="0" width="900" height="60" rx="14" fill="' + SLATE + '"/><rect x="0" y="40" width="900" height="20" fill="' + SLATE + '"/>' +
    T(24, 40, "Route 5: Bus Station to College", 26, { f: 1, c: "#fff" });
  STOPS.forEach(function(s, r){
    var y = 110 + r * 62;
    if(r % 2) g += '<rect x="4" y="' + (y - 38) + '" width="892" height="62" fill="#eef3f7"/>';
    g += T(24, y, s, 26, { f: 1 });
    TIMES[r].forEach(function(t, c){
      var x = 380 + c * 135, on = hl && hl.some(function(h){ return h[0] === r && h[1] === c; });
      if(on) g += '<rect x="' + (x - 56) + '" y="' + (y - 32) + '" width="112" height="44" rx="10" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="2.5"/>';
      g += T(x, y, t, 26, { a: "middle", b: 1 });
    });
  });
  return S("0 0 900 330", g);
}

window.B5LESSON = {
  id: "pfa-transport-2",
  title: "Tickets and timetables",
  mins: 30,
  startMins: 4,
  finishMins: 5,
  cover: { line: "Crack the timetable code, pick the right ticket, and stop chasing buses down the road.", art: S("0 0 700 420", A.scene(700, 420, { ground: 362, sun: [600, 70] }) + '<rect x="-20" y="362" width="740" height="70" fill="#8a8f96"/><path d="M0 395h700" stroke="#fffdf8" stroke-width="5" stroke-dasharray="30 22"/>' + '<g class="float">' + I("ticket", 220, 240, 2.2) + '</g><g class="drive">' + I("bus", 480, 380, 2) + '</g>' + A.bonnie(640, 345, 0.45)) },

  warm: {
    wordle: { word: "TICKET", hint: "You buy one before you get on, or show it to the driver.", say: "Six letters." },
    wyr: {
      a: "Always be 10 minutes early for everything", b: "Always be 1 minute late for everything",
      twist: "Buses wait for nobody. One minute late means watching it drive off. Ten minutes early wins, even if it is boring.",
      say: "Quick: we only have half an hour."
    }
  },

  recap: {
    items: [
      { q: "Best way to get to a shop 5 minutes away?", a: "Walking, usually." },
      { q: "Four things to have ready before a journey?", a: "A ticket or money, the route, a charged phone, and a plan B." }
    ],
    say: "From last Friday."
  },

  objective: {
    formal: "read a timetable and choose the right ticket for a journey.",
    mission: "Crack the timetable code and never miss a bus again. Well, less often.",
    success: ["Read the 24 hour clock", "Find the next bus on a timetable", "Pick single, return or day ticket"],
    say: "Read the mission."
  },

  sections: [
    {
      kind: "hook", title: "The 24 hour clock.", mins: 5,
      slides: [
        {
          title: "Timetable time",
          text: "Timetables use the 24 hour clock, so there is no am or pm to get muddled.",
          pts: ["Up to 12:00, it is the same as normal", "After 12:00, take away 12: <b>14:30</b> is half past 2 in the afternoon", "<b>17:00</b> is 5 o'clock, home time for lots of jobs"],
          build: true, ptsFrom: 1,
          art: S("0 0 480 300", '<rect x="40" y="70" width="400" height="160" rx="24" fill="' + INK + '"/>' + T(240, 185, "14:30", 96, { a: "middle", f: 1, c: YELLOW }) + T(240, 280, "= half past 2 in the afternoon", 24, { a: "middle" })),
          say: "Phone clocks often use this already. Ask someone to check theirs."
        }
      ],
      check: { q: "17:00 is...", opts: ["5 o'clock in the afternoon", "7 o'clock in the evening", "17 o'clock in the morning"], a: 0, why: "17 take away 12 is 5: 5pm." }
    },
    {
      kind: "explore", title: "Reading a real timetable.", mins: 10,
      slides: [
        { title: "Route 5", text: "Each row is a stop. Each column is one bus, all the way along the route.", stack: true, artWidth: 1150, art: timetable([[0, 0], [1, 0], [2, 0], [3, 0]]),
          say: "Point to the highlighted column: that's one bus, the 09:05, as it goes along." },
        {
          type: "predict", title: "Next bus",
          q: "You get to Market Square at 09:45. Which bus do you catch?",
          opts: ["The 10:12", "The 09:42", "The 10:05"],
          a: 0,
          why: "The 09:42 has just gone. The next one from Market Square is 10:12. (10:05 is when it leaves the Bus Station.)",
          say: "Show the timetable again with the menu if they need it (press M)."
        },
        {
          type: "predict", title: "How long?",
          q: "The 09:05 leaves the Bus Station and gets to College at 09:31. How long is the journey?",
          opts: ["26 minutes", "31 minutes", "An hour"],
          a: 0,
          why: "From 09:05 to 09:31 is 26 minutes.",
          say: "Count on from 09:05: 25 minutes gets you to 09:30, plus 1."
        }
      ],
      check: { q: "On this timetable, each row is...", opts: ["A stop", "A day of the week", "A different bus company"], a: 0, why: "A stop. Each column is one bus." }
    },
    {
      kind: "explain", title: "Picking the right ticket.", mins: 6,
      slides: [
        {
          type: "sort", title: "Which ticket?", q: "Single, return or day ticket?",
          bins: ["Single", "Return", "Day ticket"],
          cards: [
            { t: "One way, getting a lift back", b: 0 }, { t: "Into town and back home the same day", b: 1 },
            { t: "Lots of short hops around town all day", b: 2 }, { t: "Going to a friend's to stay over", b: 0 },
            { t: "To college and home again", b: 1 }, { t: "Sightseeing, on and off all day", b: 2 }
          ],
          say: "Single is one way. Return is there and back. Day ticket is as many trips as you like."
        }
      ],
      check: { q: "Going there and back the same day, which is usually cheaper than two singles?", opts: ["A return", "Two singles", "A taxi"], a: 0, why: "A return, usually. And young people's passes and railcards can cut the price even more." }
    }
  ],

  realworld: {
    title: "Apps use the same skills",
    text: "Bus and train apps show live times, but they still use stops, routes, the 24 hour clock and ticket types. Learn it once, use it everywhere: college, work, days out.",
    art: S("0 0 560 420", A.scene(560, 420, { ground: 380, time: "dusk", sun: [460, 80] }) + '<g class="float">' + I("phone", 200, 360, 2.6) + '</g>' + I("ticket", 410, 250, 1.4)),
    say: "Ask: who already uses a travel app?"
  },

  exit: [
    { q: "14:30 is...", opts: ["Half past 2 in the afternoon", "Half past 4"], a: 0, why: "14 take away 12 is 2." },
    { q: "There and back on the same day: which ticket?", opts: ["Return", "Single"], a: 0, why: "A return." }
  ],

  driving: {
    angle: "Before the railways, every town kept its own time, a few minutes different from the next. Trains made the whole country use the same clock. If you could go back, would you keep it that way?",
    opts: ["One time for everyone", "Every town its own time", "Pass"],
    say: "Fun fact to end the week. Ask what would go wrong with every town on its own time."
  },

  surprise: { at: "sections.1.slides.0", kind: "bird", x: 1450, y: 150, say: "Birds do not need timetables. They just leave when they feel like it. Must be nice." }
};
})();
