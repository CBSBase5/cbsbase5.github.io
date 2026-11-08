/* ==========================================================
   Base 5 Lessons - Scientific and Environmental
   Earth and atmosphere, lesson 3 of 3: A changing planet
   45 minutes (first half of the Thursday project slot, last week of term).
   Leads into "What is it made of?". Shape as /lessons/l/ac-arch-1.js. ASCII only.
   Kept hopeful: what people are doing, not doom.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a", GREEN = "#1e9e5a";

function turbine(x, y, s){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><path d="M-4 0L-2 -170h4L4 0Z" fill="#fffdf8" stroke="' + INK + '" stroke-width="3"/>' +
    '<g transform="translate(0 -170)"><g class="spin">' + [0, 120, 240].map(function(a){ return '<path d="M0 0L-6 -80Q0 -90 6 -80Z" fill="#fffdf8" stroke="' + INK + '" stroke-width="3" transform="rotate(' + a + ')"/>'; }).join("") + '</g><circle r="7" fill="' + INK + '"/></g></g>';
}
function graph(){
  var pts = [[60, 300], [200, 298], [340, 292], [480, 280], [560, 250], [640, 200], [700, 150], [740, 110]];
  var d = "M" + pts.map(function(p){ return p.join(" "); }).join("L");
  return S("0 0 800 400", '<rect width="800" height="400" fill="#fffdf8"/><path d="M60 340H760M60 340V40" stroke="' + INK + '" stroke-width="4"/>' +
    T(60, 375, "1750", 20, { a: "middle" }) + T(480, 375, "1900", 20, { a: "middle" }) + T(740, 375, "Now", 20, { a: "middle", b: 1 }) +
    T(70, 30, "Carbon dioxide in the air", 22, { b: 1 }) +
    '<g data-s="1"><path d="' + d + '" stroke="' + PINK + '" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>' +
    '<g data-s="2"><circle class="pulse" cx="480" cy="280" r="14" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="3"/>' + T(480, 250, "Factories, steam, coal", 20, { a: "middle", b: 1 }) + '</g>' +
    '<g data-s="3"><circle class="pulse" cx="740" cy="110" r="14" fill="' + PINK + '" stroke="' + INK + '" stroke-width="3"/>' + T(700, 80, "about half as much again", 20, { a: "end", b: 1 }) + '</g>');
}

window.B5LESSON = {
  id: "se-earth-3",
  title: "A changing planet",
  mins: 45,
  cover: { line: "Weather changes every day. Climate changes over years. What's changing, how do we know, and what are people doing about it?", art: S("0 0 700 440", A.scene(700, 440, { ground: 400, sun: [110, 80] }) + turbine(420, 400, 1.3) + turbine(560, 400, 1) + '<g class="float">' + A.bird(250, 150, 0.9) + '</g>') },

  warm: {
    wordle: { word: "CLIMATE", hint: "The usual weather of a place, over many years.", say: "Seven letters this time." },
    wyr: { a: "A whole year of snow", b: "A whole year of sunshine", twist: "Both would be a disaster for farmers. Crops need a mix: the weather we're used to is what everything is built around.", say: "Ask: what would go wrong first?" }
  },

  recap: {
    items: [
      { q: "What's most of the air made of?", a: "Nitrogen, about 78 in every 100." },
      { q: "Where does weather happen?", a: "In the troposphere, the lowest layer." },
      { q: "Name one job the atmosphere does.", a: "Gives us oxygen, blocks harmful rays, keeps us warm, burns up space rocks." }
    ],
    say: "From the last two Thursdays."
  },

  objective: {
    formal: "explain the difference between weather and climate, and how the atmosphere is changing.",
    mission: "Read the planet's diary, and find out what people are doing about what it says.",
    success: ["Tell weather from climate", "Explain the blanket effect", "Name things people are doing to help"],
    say: "Keep it calm and hopeful. Lots of people are working on this."
  },

  sections: [
    {
      kind: "hook", title: "Weather or climate?", mins: 8,
      slides: [
        { title: "Weather and climate", pts: ["<b>Weather</b> is today: rain, sun, wind", "<b>Climate</b> is the usual pattern over about 30 years", "Weather is your mood. Climate is your personality."], build: true, ptsFrom: 1,
          art: S("0 0 480 400", A.scene(480, 400, { ground: 360 }) + '<g class="drift">' + I("cloud", 160, 140, 1.4) + '</g>' + A.bonnie(330, 330, 0.7)),
          say: "Ask: what's the climate like here? (Mild, wet, not very snowy.)" },
        {
          type: "sort", title: "Weather or climate?", q: "Today, or the pattern over years?",
          bins: ["Weather", "Climate"],
          cards: [
            { t: "It's raining right now", b: 0 }, { t: "British summers are usually mild", b: 1 }, { t: "Storm tomorrow", b: 0 },
            { t: "Deserts are dry most of the year", b: 1 }, { t: "Windy this afternoon", b: 0 }, { t: "The Arctic is cold all year", b: 1 }
          ]
        }
      ],
      check: { q: "Climate is...", opts: ["The usual weather pattern over many years", "Today's weather", "A type of cloud"], a: 0, why: "The pattern over about 30 years." }
    },
    {
      kind: "explore", title: "The planet's diary.", mins: 15,
      slides: [
        { title: "The blanket effect", text: "Some gases, like carbon dioxide, trap heat like a blanket. A bit keeps us warm enough to live. More makes the blanket thicker.",
          art: S("0 0 480 420", '<rect width="480" height="420" fill="#0f2a40"/><circle class="pulse" cx="420" cy="60" r="34" fill="' + YELLOW + '"/>' +
            '<circle cx="220" cy="260" r="175" fill="none" stroke="' + PINK + '" stroke-width="22" opacity=".45"/><circle cx="220" cy="260" r="130" fill="#3a7fb5" stroke="' + INK + '" stroke-width="4"/>' +
            '<path d="M160 210q30 -30 70 0t50 40M150 300q40 10 60 -10" stroke="#3f9a5a" stroke-width="18" fill="none" stroke-linecap="round"/>' +
            '<path class="dash" d="M400 80L260 180" stroke="' + YELLOW + '" stroke-width="5"/><path class="dash" d="M260 180L330 110" stroke="' + ORANGE + '" stroke-width="5"/>'),
          say: "Sunlight comes in, heat tries to get out, the blanket keeps some in." },
        { title: "Carbon dioxide over time", text: "Burning coal, oil and gas adds carbon dioxide. It started rising fast when factories and steam engines took off.", stack: true, artWidth: 1000, art: graph(),
          say: "Link to the 1851 steam era on the time machine." },
        {
          type: "predict", title: "Old air",
          q: "How do scientists know what the air was like 800,000 years ago?",
          opts: ["Tiny bubbles of old air trapped in deep ice", "Old photos", "Asking dinosaurs"],
          a: 0,
          why: "Snow piles up in Antarctica year after year, trapping tiny bubbles of air. Drilling deep ice cores lets scientists test air from hundreds of thousands of years ago."
        }
      ],
      check: { q: "Carbon dioxide in the air acts like...", opts: ["A blanket, trapping heat", "A fridge", "A fan"], a: 0, why: "A blanket: more of it, more heat trapped." }
    },
    {
      kind: "explain", title: "What people are doing.", mins: 10,
      slides: [
        { title: "People are on it", text: "Lots of people are working on this, right now:", pts: ["Wind and solar power instead of coal", "Electric buses and trains", "Better insulated homes (remember Architecture?)", "Planting trees and protecting forests"], build: true, ptsFrom: 1,
          art: S("0 0 480 420", A.scene(480, 420, { ground: 390, sun: [400, 70] }) + turbine(160, 390, 1.2) + turbine(290, 390, 0.9) + I("tree", 400, 390, 1.4)),
          say: "Keep it hopeful. Ask: which of these have you seen near here?" },
        {
          type: "vote", title: "Your pick", q: "Which would you most like to see more of round here?",
          opts: ["Wind turbines", "Solar panels", "More trees", "Electric buses"],
          say: "No wrong answer."
        }
      ],
      check: { q: "Which helps the blanket get less thick?", opts: ["Using wind and solar power", "Burning more coal", "Leaving the heating on with windows open"], a: 0, why: "Wind and solar make electricity without adding carbon dioxide." }
    }
  ],

  realworld: {
    title: "You'll see it everywhere",
    text: "Wind farms off the coast, solar panels on roofs, electric buses, recycling bins and weather records being broken on the news. All part of the same story.",
    art: S("0 0 560 420", A.scene(560, 420, { ground: 390, time: "dusk", sun: [460, 90] }) + turbine(170, 390, 1.3) + turbine(330, 390, 1)),
    say: "End of the Earth and atmosphere series."
  },

  exit: [
    { q: "'It's raining right now' is...", opts: ["Weather", "Climate"], a: 0, why: "Weather: today." },
    { q: "Old air is found in...", opts: ["Ice cores", "Old photos"], a: 0, why: "Bubbles trapped in deep ice." },
    { q: "Carbon dioxide traps heat like a...", opts: ["Blanket", "Fridge"], a: 0, why: "A blanket." }
  ],

  driving: {
    angle: "If we could time travel to 1851 and show people this graph, should we? Would it change what they did?",
    opts: ["Yes, show them", "No, they wouldn't listen", "Pass"],
    say: "The big time travel question, for real. Ask for a reason from each side."
  },

  surprise: { at: "sections.2.slides.0", kind: "bonnie", x: 1460, y: 700, w: 110, say: "Bonnie's climate plan: stay under the blanket. She has missed the point slightly." }
};
})();
