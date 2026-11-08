/* ==========================================================
   Base 5 Lessons - Human and Social
   Myths and legends, lesson 3 of 3: Myths are still being made
   45 minutes (first half of the Thursday project slot).
   Leads into the HQ activity "Hidden messages".
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", PLUM = "#7b4b8f", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a";

function icarus(){
  return S("0 0 560 420", '<circle cx="440" cy="90" r="60" fill="' + YELLOW + '" stroke="' + ORANGE + '" stroke-width="6"/>' +
    '<g data-s="1" transform="translate(250 200) rotate(-10)"><path d="M-10 0l-90 -40l20 30l-30 10l100 10zM10 0l90 -40l-20 30l30 10l-100 10z" fill="#fffdf8" stroke="' + INK + '" stroke-width="3"/><circle cx="0" cy="-12" r="12" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3"/><path d="M0 0v30" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    '<g data-s="2"><path d="M330 160q4 12 0 20M350 170q4 12 0 20M370 150q4 12 0 20" stroke="' + ORANGE + '" stroke-width="4" fill="none"/>' + T(360, 230, "wax melting...", 22, { a: "middle", b: 1, c: ORANGE }) + '</g>' +
    '<g data-s="3"><path d="M0 380q30 -12 60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0" stroke="#7fbfd0" stroke-width="8" fill="none"/>' + T(150, 350, "splash", 26, { a: "middle", f: 1, c: TEAL }) + '</g>');
}
function phones(){
  var g = "";
  [[90, "My mate said..."], [300, "Did you know..."], [510, "SHARE THIS!!"]].forEach(function(p, i){
    g += '<g data-s="' + (i + 1) + '">' + I("phone", p[0], 330, 1.8) + A.bubble(p[0] - 90, 60 + i * 30, 180, 50, p[1], 18) + '</g>';
  });
  return S("0 0 600 380", g);
}

window.B5LESSON = {
  id: "hs-myths-3",
  title: "Myths are still being made",
  mins: 45,
  cover: { line: "Old myths carry hidden messages. New myths spread on phones. Time to spot both.", art: S("0 0 700 420", I("phone", 500, 380, 2.4) + I("bolt", 200, 320, 2.2) + A.bambi(370, 330, 0.7)) },

  warm: {
    wordle: { word: "MIDAS", hint: "A king who turned everything he touched into gold.", say: "Five letters." },
    wyr: {
      a: "Have the golden touch for a day", b: "Fly with wax wings for a day",
      twist: "Both come from Greek myths, and both end badly. Midas could not eat (his food turned to gold) and Icarus flew too close to the sun. That's the point: they are warnings.",
      say: "Ask: what would you touch first?"
    }
  },

  recap: {
    items: [
      { q: "What is a legend?", a: "A story about a hero or place that might be partly true." },
      { q: "Was the 1934 Nessie photo real?", a: "No: a toy submarine with a model head." },
      { q: "Why do legends grow?", a: "Every time someone tells the story, they add a bit." }
    ],
    say: "From the last two Thursdays."
  },

  objective: {
    formal: "find the hidden messages in myths, and recognise modern myths and urban legends.",
    mission: "Decode the warnings in old myths, then catch the new ones before you share them.",
    success: ["Say the message behind a myth", "Spot an urban legend", "Check something before sharing it"],
    say: "Read the mission."
  },

  sections: [
    {
      kind: "hook", title: "Icarus, and the message inside the story.", mins: 8,
      slides: [
        { title: "Icarus", text: "Icarus and his dad escaped a prison on wings made of feathers and wax. His dad warned him: not too low, not too high.", art: icarus(),
          say: "Click through. Ask: what do you think happened next?" },
        {
          type: "predict", title: "The message",
          q: "What is the Icarus myth warning people about?",
          opts: ["Don't get carried away and ignore good advice", "Don't eat wax", "Always fly at night"],
          a: 0,
          why: "Don't get carried away showing off, and listen when someone who knows warns you. People still say 'flying too close to the sun' today."
        }
      ],
      check: { q: "Many old myths were really...", opts: ["Warnings and lessons dressed up as stories", "True news reports", "Shopping lists"], a: 0, why: "Lessons in disguise: stories stick in your head better than rules." }
    },
    {
      kind: "explore", title: "Urban legends: the myths of now.", mins: 15,
      slides: [
        { title: "Modern myths", text: "Myths didn't stop. Now they spread by text, video and shares:", art: phones(),
          say: "An urban legend is a modern story people believe because a friend of a friend says it's true." },
        {
          type: "sort", title: "Real, or urban legend?", q: "Some of these are true. Some are modern myths.",
          bins: ["Really true", "Urban legend"],
          cards: [
            { t: "You swallow 8 spiders a year in your sleep", b: 1 }, { t: "An octopus has three hearts", b: 0 },
            { t: "Goldfish only remember things for 3 seconds", b: 1 }, { t: "A day on Venus is longer than its year", b: 0 },
            { t: "Alligators live in New York's sewers", b: 1 }, { t: "Some people sleep with their eyes slightly open", b: 0 }
          ],
          why: "Goldfish can remember things for months.",
          say: "The Venus one sounds made up and is true. That's the fun."
        },
        {
          type: "predict", title: "Why do people believe them?",
          q: "Why do urban legends spread so fast?",
          opts: ["They're surprising, and they come from someone we trust", "Because they're always true", "The government makes them"],
          a: 0,
          why: "A surprising story from a friend feels true, so we pass it on without checking."
        }
      ],
      check: { q: "An urban legend is...", opts: ["A modern story lots of people believe, but isn't true", "A legend about a city", "A true fact"], a: 0, why: "A modern myth, usually 'a friend of a friend said'." }
    },
    {
      kind: "explain", title: "Check before you share.", mins: 10,
      slides: [
        {
          title: "Before you share it",
          pts: ["<b>Who said it?</b> A real expert, or 'my mate's cousin'?", "<b>Can you find it somewhere trusted?</b> More than one place?", "<b>Is it trying to make you angry or scared?</b> That's a warning sign", "<b>If in doubt</b>, don't pass it on"],
          build: true, ptsFrom: 1,
          art: S("0 0 480 400", I("phone", 240, 330, 2.6) + A.jay(400, 330, 1.2, "surprised")),
          say: "Ask: has anyone believed something online that turned out to be fake?"
        },
        {
          type: "vote", title: "Modern myths", q: "Which is most like a modern myth?",
          opts: ["A fake video that goes viral", "A ghost story at a sleepover", "A rumour round school", "All of them"],
          why: "All of them. The way they spread has changed. The reasons people believe them haven't."
        }
      ],
      check: { q: "You see a shocking 'fact' online. Best first move?", opts: ["Check if trusted places say it too", "Share it straight away", "Believe it because it's shocking"], a: 0, why: "Check first. Shocking doesn't mean true." }
    }
  ],

  realworld: {
    title: "You'll meet myths every day",
    text: "Viral videos, rumours, adverts that promise miracles, 'facts' in group chats. The skills that let you decode Icarus also help you spot a fake.",
    art: phones(),
    say: "Ask: what's the daftest thing you've seen people believe online?"
  },

  exit: [
    { q: "The Icarus myth warns people...", opts: ["Not to get carried away and ignore advice", "To avoid feathers"], a: 0, why: "Don't fly too close to the sun." },
    { q: "'Goldfish have a 3 second memory' is...", opts: ["An urban legend", "True"], a: 0, why: "A myth. They remember for months." },
    { q: "Before sharing a surprising fact, you should...", opts: ["Check it somewhere trusted", "Share it fast"], a: 0, why: "Check first." }
  ],

  driving: {
    angle: "If you could go back in time and stop a myth before it started, should you? Even a fun one like Nessie?",
    opts: ["Yes, stop the fakes", "No, some myths are fun", "Pass"],
    say: "Ask: is there a difference between a harmless myth and a harmful one?"
  },

  surprise: { at: "sections.1.slides.1", kind: "bonnie", x: 1460, y: 160, w: 110, say: "Urban legend: Bonnie has never stolen a biscuit. Status: completely false." }
};
})();
