/* ==========================================================
   Base 5 Lessons - Aesthetic and Creative
   Architecture and construction, lesson 2 of 4: Built to last
   45 minutes (Monday 1:15). Shape as /lessons/l/ac-arch-1.js.
   ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38";
var STONE = "#bdb19c", STONE_D = "#8f8471", GLASS = "#bfe6ef", TEAL = "#007291", ORANGE = "#ef7724", PINK = "#e2557a", YELLOW = "#ffc247";

function hut(x, y, s){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><path d="M-60 0V-30Q-60 -54 0 -58Q60 -54 60 -30V0Z" fill="' + STONE + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<path d="M-60 -16H60M-60 -32H60M-30 0V-16M20 0V-16M-6 -16V-32M36 -16V-32" stroke="' + STONE_D + '" stroke-width="3"/><path d="M-70 -36Q0 -100 70 -36Q0 -64 -70 -36Z" fill="#6f9a45" stroke="' + INK + '" stroke-width="4"/><rect x="-12" y="-26" width="24" height="26" rx="5" fill="#3d2a1a"/></g>';
}
function dome(x, y, s){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><rect x="-70" y="-60" width="140" height="60" fill="#e9e1cf" stroke="' + INK + '" stroke-width="4"/>' +
    '<path d="M-70 -60Q-70 -130 0 -130Q70 -130 70 -60Z" fill="#d6cbb2" stroke="' + INK + '" stroke-width="4"/><circle cx="0" cy="-128" r="8" fill="#fffdf8" stroke="' + INK + '" stroke-width="3"/>' +
    '<path d="M-50 0V-60M-25 0V-60M0 0V-60M25 0V-60M50 0V-60" stroke="' + STONE_D + '" stroke-width="4"/></g>';
}
function keep(x, y, s){
  var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><rect x="-50" y="-140" width="100" height="140" fill="' + STONE + '" stroke="' + INK + '" stroke-width="4"/>';
  for(var i = 0; i < 4; i++) g += '<rect x="' + (-50 + i * 28) + '" y="-162" width="16" height="24" fill="' + STONE + '" stroke="' + INK + '" stroke-width="4"/>';
  return g + '<path d="M-14 0V-34Q0 -52 14 -34V0Z" fill="#3d2a1a"/></g>';
}
function palace(x, y, s){
  var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><path d="M-90 0V-60Q-90 -110 0 -110Q90 -110 90 -60V0Z" fill="' + GLASS + '" stroke="' + INK + '" stroke-width="4"/>';
  for(var i = -70; i <= 70; i += 20) g += '<path d="M' + i + ' 0V-' + (Math.round(60 + Math.sqrt(Math.max(0, 8100 - i * i)) * 0.55)) + '" stroke="' + TEAL + '" stroke-width="2"/>';
  return g + '<path d="M-90 -30H90M-90 -60H90" stroke="' + TEAL + '" stroke-width="2"/></g>';
}
function sky(x, y, s){
  var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><path d="M-40 0V-260L0 -290L40 -260V0Z" fill="' + GLASS + '" stroke="' + INK + '" stroke-width="4"/>';
  for(var r = 0; r < 8; r++) g += '<path d="M-40 ' + (-30 - r * 30) + 'H40" stroke="' + TEAL + '" stroke-width="2.5" opacity=".7"/>';
  return g + '</g>';
}
function timeline(){
  return S("0 0 1000 380", '<path d="M20 330H980" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
    '<g data-s="1">' + hut(110, 328, 1) + T(110, 368, "3000 BC", 22, { a: "middle", f: 1 }) + '</g>' +
    '<g data-s="2">' + dome(300, 328, 0.9) + T(300, 368, "AD 125", 22, { a: "middle", f: 1 }) + '</g>' +
    '<g data-s="3">' + keep(490, 328, 0.95) + T(490, 368, "1100s", 22, { a: "middle", f: 1 }) + '</g>' +
    '<g data-s="4">' + palace(690, 328, 1) + T(690, 368, "1851", 22, { a: "middle", f: 1 }) + '</g>' +
    '<g data-s="5">' + sky(890, 328, 1) + T(890, 368, "Now", 22, { a: "middle", f: 1 }) + '</g>');
}

window.B5LESSON = {
  id: "ac-arch-2",
  title: "Built to last",
  mins: 45,
  cover: { line: "Mud, stone, concrete, iron, glass. A time machine ride through 5,000 years of building.", art: timeline() },

  warm: {
    wordle: { word: "STONE", hint: "The oldest buildings in Britain are made of it. So is Stonehenge.", say: "Five letters." },
    wyr: {
      a: "Live in Skara Brae, 5,000 years ago", b: "Live in the Crystal Palace, 1851",
      artA: S("0 0 300 200", hut(150, 180, 1.6)), artB: S("0 0 300 200", palace(150, 180, 1.4)),
      twist: "Skara Brae homes had stone beds and stone dressers, and they are still there in Orkney. The Crystal Palace burned down in 1936.",
      say: "Ask: what would you miss most in each?"
    }
  },

  recap: {
    items: [
      { q: "Squashed is called...?", a: "Compression. Stretched is tension." },
      { q: "Why do triangles help a structure?", a: "A triangle cannot change shape unless a side snaps." },
      { q: "What keeps a stone arch up?", a: "Every stone is squashed against its neighbours, and the keystone locks it." }
    ],
    say: "From last Monday. Take answers before revealing."
  },

  objective: {
    formal: "describe how building materials and methods have changed over time, and why.",
    mission: "Ride the time machine through 5,000 years of building, and spot what changed and what never did.",
    success: ["Put building materials in time order", "Say why building changed", "Explain why some buildings last"],
    say: "Read the mission. Ask: what is the oldest building they have been inside?"
  },

  sections: [
    {
      kind: "hook", title: "Five stops on the time machine.", mins: 8,
      slides: [
        { title: "5,000 years of building", text: "Same job every time: keep the weather out and stay up.", stack: true, artWidth: 1300, art: timeline(),
          say: "Click through each stop. Ask what each one is made of." },
        {
          type: "predict", title: "The Roman dome",
          q: "The Pantheon in Rome has a huge concrete dome that is still standing. How old is it?",
          opts: ["About 100 years", "About 500 years", "About 1,900 years"],
          a: 2,
          why: "About 1,900 years. It was finished around AD 125, and it is still the biggest dome in the world made of concrete without steel inside.",
          say: "Most people guess too young. The Romans were very good at concrete."
        }
      ],
      check: { q: "What has changed most in 5,000 years of building?", opts: ["The materials and tools", "Gravity", "The need for a roof"], a: 0, why: "The materials and tools. Gravity has not changed at all. Annoyingly." }
    },
    {
      kind: "explore", title: "Old stuff, new stuff, and why things changed.", mins: 15,
      slides: [
        {
          type: "sort", title: "Old or new?", q: "Used over 2,000 years ago, or only in the last 200 years?",
          bins: ["Over 2,000 years ago", "Last 200 years"],
          cards: [
            { t: "Stone", b: 0 }, { t: "Wood", b: 0 }, { t: "Mud bricks", b: 0 }, { t: "Concrete", b: 0 },
            { t: "Steel frames", b: 1 }, { t: "Walls made of huge glass sheets", b: 1 }, { t: "Electric lifts", b: 1 }, { t: "Concrete with steel rods inside", b: 1 }
          ],
          why: "Concrete is the trick one: the Romans had it.",
          say: "Concrete catches most people out. That's the fun."
        },
        {
          title: "Why did building change?",
          pts: ["<b>New materials</b>: iron, then steel, then huge sheets of glass", "<b>New machines</b>: cranes, lifts, power tools", "<b>More people</b> in cities, so buildings went up instead of out", "<b>New worries</b>: fire, heat, energy bills"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", '<path d="M10 400H510" stroke="' + INK + '" stroke-width="4"/>' + sky(160, 400, 1.3) + sky(300, 400, 0.9) + '<g transform="translate(420 400) scale(.95)"><path d="M-12 0V-300M12 0V-300M-60 -300H160" stroke="' + YELLOW + '" stroke-width="6"/></g>' + A.bird(470, 60, 0.8)),
          say: "Ask: which of these is most important?"
        },
        {
          type: "predict", title: "Going up",
          q: "Why could cities start building really tall in the late 1800s?",
          opts: ["Steel frames and safe lifts made it possible", "People wanted a better view", "Land suddenly became free"],
          a: 0,
          why: "Steel frames carry the weight instead of thick walls, and safe lifts mean nobody has to climb 40 floors of stairs.",
          say: "Ask: would you climb 40 floors?"
        }
      ],
      check: { q: "Which invention made tall buildings usable?", opts: ["The safe lift", "The doorbell", "The welcome mat"], a: 0, why: "The safe lift. The doorbell was less important." }
    },
    {
      kind: "explain", title: "What makes a building last?", mins: 10,
      slides: [
        {
          title: "What lasts?",
          pts: ["<b>Tough material</b>: stone shrugs off weather", "<b>Looking after it</b>: fixing roofs, gutters, cracks", "<b>Being loved or useful</b>: people repair what they need", "<b>Luck</b>: fire, floods and wars destroy a lot"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", '<path d="M10 400H510" stroke="' + INK + '" stroke-width="4"/>' + keep(260, 400, 1.6) + A.bonnie(420, 362, 0.5)),
          say: "Ask: what is the oldest thing in your house?"
        },
        {
          type: "vote", title: "Still here in 3026?", q: "Which of these is most likely to still be standing in 1,000 years?",
          opts: ["A stone church", "A glass skyscraper", "A wooden house", "None of them"],
          why: "Nobody knows. The ones most likely to last are the ones people keep repairing.",
          say: "Tap for each person, then reveal."
        }
      ],
      check: {
        q: "Skara Brae has lasted about 5,000 years. Mostly because...",
        opts: ["It is stone, and it was buried under sand for centuries", "It had a very good cleaner", "It is made of steel"],
        a: 0,
        why: "Stone walls, and sand dunes covered it until a big storm uncovered it in 1850."
      }
    }
  ],

  realworld: {
    title: "Every street is a timeline",
    text: "Look at the buildings near you: old brick terraces, newer glass offices, a church that might be hundreds of years old. You can often guess a building's age from what it is made of.",
    art: S("0 0 560 420", '<path d="M10 400H550" stroke="' + INK + '" stroke-width="4"/>' + keep(120, 400, 1.1) + palace(300, 400, 0.9) + sky(470, 400, 1.1) + A.bird(300, 120, 0.9)),
    say: "Ask: what's the oldest building on the way to school?"
  },

  exit: [
    { q: "The Romans built the Pantheon dome out of...", opts: ["Concrete", "Steel", "Glass"], a: 0, why: "Concrete, nearly 1,900 years ago." },
    { q: "Which two things made skyscrapers possible?", opts: ["Steel frames and safe lifts", "Stone and mud", "Paint and wallpaper"], a: 0, why: "Steel frames to hold them up, lifts to get people up." },
    { q: "Which helps a building last longest?", opts: ["Being looked after and repaired", "Being painted a nice colour"], a: 0, why: "Buildings people look after can last for centuries." }
  ],

  driving: {
    angle: "Would you go back to watch Skara Brae being built, or forward to see the first building on the Moon? And if you could warn the Crystal Palace about 1936, should you?",
    opts: ["Back to Skara Brae", "Forward to the Moon", "Warn the Crystal Palace"],
    say: "The third one is the real time travel dilemma. Ask what might change."
  },

  surprise: { at: "sections.1.slides.1", kind: "bird", x: 1440, y: 650, say: "Birds have been building nests the same way for millions of years. No lifts needed." }
};
})();
