/* ==========================================================
   Base 5 Lessons - Human and Social
   Myths and legends, lesson 1 of 3: Myth, legend or folk tale?
   45 minutes (first half of the Thursday project slot).
   Leads into the HQ activity "Myths then and now".
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", PLUM = "#7b4b8f";

function people(x, y){
  var g = "", cols = ["#3f6f8f", "#e2557a", "#7a7f1e", "#ef7724"];
  [-120, -60, 60, 120].forEach(function(dx, i){
    g += '<g transform="translate(' + (x + dx) + ' ' + y + ')"><path d="M-22 0q0 -40 22 -40t22 40z" fill="' + cols[i] + '" stroke="' + INK + '" stroke-width="3"/><circle cx="0" cy="-52" r="14" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3"/></g>';
  });
  return g;
}
function sky(){ var g = "", pts = [[80, 60], [190, 30], [300, 80], [430, 40], [560, 70], [650, 30], [720, 90]]; pts.forEach(function(p){ g += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="#ffc247"/>'; }); return g; }

window.B5LESSON = {
  id: "hs-myths-1",
  title: "Myth, legend or folk tale?",
  mins: 45,
  cover: {
    line: "Before science, before books, people explained the world with stories. Some of them are still going.",
    art: S("0 0 760 440", '<rect width="760" height="440" fill="#1d3d47"/>' + sky() + '<path d="M0 360h760v80H0z" fill="#2d4a2f"/>' +
      I("fire", 380, 380, 1.3) + people(380, 380) + A.bonnie(560, 362, 0.55) + '<circle cx="640" cy="90" r="38" fill="#fff6d6"/>')
  },

  warm: {
    wordle: { word: "LEGEND", hint: "A story about a hero that might be partly true. Robin Hood is one.", say: "Six letters this time." },
    wyr: {
      a: "Meet a real dragon", b: "Meet a real mermaid",
      artA: S("0 0 300 200", '<path d="M80 150q-30 -60 30 -80q20 -40 60 -20q50 -10 60 40q40 10 30 50z" fill="#3fae6a" stroke="' + INK + '" stroke-width="4"/><circle cx="210" cy="90" r="6" fill="' + INK + '"/><path d="M230 120q30 -6 40 -24" stroke="#ef7724" stroke-width="8" stroke-linecap="round"/>'),
      artB: S("0 0 300 200", '<path d="M150 70q30 0 30 40t-20 50q20 10 40 0q-10 30 -40 20q-30 -10 -40 -40q-10 -40 30 -70z" fill="#20adca" stroke="' + INK + '" stroke-width="4"/><circle cx="150" cy="50" r="22" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3"/><path d="M128 44q22 -40 46 0" stroke="#e2557a" stroke-width="10" fill="none"/>'),
      twist: "Dragons turn up in old stories all over the world, from Wales to China. One idea is that people dug up dinosaur bones and needed an explanation.",
      say: "Tap a side for each person. Ask what they'd do once they'd met it."
    }
  },

  recap: {
    items: [
      { q: "Name a story everyone seems to know, but nobody remembers learning.", a: "Fairy tales, ghost stories, Robin Hood, the Loch Ness Monster..." },
      { q: "Before science, what did people think made thunder?", a: "Lots of things. The Norse said it was the god Thor and his hammer." },
      { q: "Where do old stories live now?", a: "Films, games, books, days of the week, even brand names." }
    ],
    say: "Any answer that sounds like a story counts."
  },

  objective: {
    formal: "explain the difference between a myth, a legend and a folk tale, and why people told them.",
    mission: "Become story detectives: work out what kind of story it is, and what it was for.",
    success: ["Sort a story into myth, legend or folk tale", "Say why people told them", "Spot old myths in everyday life"],
    say: "Read the mission. Ask: who knows a good monster story?"
  },

  sections: [
    {
      kind: "hook", title: "Before science, there were stories.", mins: 8,
      slides: [
        {
          title: "Why does it thunder?",
          text: "Thousands of years ago, nobody knew why the sun moved, why it thundered, or why winter came.",
          pts: ["So people told stories to explain it", "Stories got passed on round fires, for hundreds of years"],
          build: true, ptsFrom: 1,
          art: S("0 0 560 420", '<rect width="560" height="420" rx="16" fill="#1d3d47"/>' + I("cloud", 200, 130, 1.4) + I("cloud", 360, 110, 1.1) +
            '<g data-s="1">' + I("bolt", 290, 260, 1.4) + '</g><path d="M0 360h560v60H0z" fill="#2d4a2f"/>' + '<g data-s="2">' + I("fire", 280, 380, 1) + people(280, 380) + '</g>'),
          say: "Ask: if you'd never heard of science, what would YOU guess thunder was?"
        },
        {
          type: "predict",
          title: "The Greek story of winter",
          q: "The ancient Greeks had a story to explain why winter comes every year. Which one?",
          opts: [
            "A goddess is so sad when her daughter goes to the underworld that nothing grows",
            "The sun gets tired and has a long nap",
            "A giant eats all the warm weather"
          ],
          a: 0,
          why: "Demeter, goddess of the harvest, grieves every year when her daughter Persephone has to spend months in the underworld. While she is sad, nothing grows: winter. When Persephone comes back: spring.",
          say: "The other two are made up. Though the nap one is relatable."
        }
      ],
      check: {
        q: "What were most myths for?",
        opts: ["Explaining how the world works", "Selling things", "Getting out of chores"],
        a: 0,
        why: "Mostly explaining the world: seasons, thunder, the sun, where people came from.",
        say: "Quick one."
      }
    },
    {
      kind: "explore", title: "Three kinds of old story, and a famous outlaw.", mins: 15,
      slides: [
        {
          title: "Three kinds of old story",
          stack: true, artWidth: 1300,
          text: "They get mixed up all the time. Here is the difference:",
          art: A.iconRow([["bolt", "Myth", "gods, monsters, why things are"], ["sword", "Legend", "a hero, maybe partly true"], ["beanstalk", "Folk tale", "everyday people, a lesson"]], { build: true, s: 1.1, h: 250 }),
          say: "Click through. Ask for an example of each before the sort."
        },
        {
          type: "sort",
          title: "Sort the stories",
          q: "Myth, legend or folk tale?",
          bins: ["Myth", "Legend", "Folk tale"],
          cards: [
            { t: "Thor makes thunder with his hammer", b: 0 },
            { t: "King Arthur pulls a sword from a stone", b: 1 },
            { t: "Jack climbs a beanstalk to a giant's castle", b: 2 },
            { t: "Persephone's trip to the underworld makes winter", b: 0 },
            { t: "Robin Hood robs the rich to give to the poor", b: 1 },
            { t: "The Three Little Pigs", b: 2 }
          ],
          say: "Arguing is good here. Some stories are a bit of both."
        },
        {
          type: "predict",
          title: "Was Robin Hood real?",
          q: "What do historians think?",
          opts: ["Definitely real. We have his records", "Nobody knows for sure", "No. He was made up for a film"],
          a: 1,
          why: "Records from the 1200s mention outlaws nicknamed 'Robehod', but nobody has proved there was one real Robin. A bit of truth, a lot of story: that is what makes it a legend.",
          say: "Ask: why might people want Robin Hood to be real?"
        }
      ],
      check: {
        q: "A story about a real king, with some made up bits added over the years. What kind of story is it?",
        opts: ["Myth", "Legend", "Folk tale"],
        a: 1,
        why: "A legend: about a real or possibly real person, with the story growing each time it is told.",
        say: "Hands up or tap."
      }
    },
    {
      kind: "explain", title: "Why bother telling them, and why they never went away.", mins: 10,
      slides: [
        {
          title: "Why bother?",
          text: "Old stories were not just for fun. They did jobs:",
          pts: ["<b>Explain</b> the world before science could", "<b>Teach</b> a lesson: don't be greedy, be brave", "<b>Bring people together</b>: our heroes, our place", "<b>Pass the time</b> on long, dark nights"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", '<rect width="520" height="420" rx="16" fill="#1d3d47"/>' + sky() + '<path d="M0 340h520v80H0z" fill="#2d4a2f"/>' + I("fire", 260, 360, 1.2) + people(260, 360) + A.bambi(440, 300, 0.6)),
          say: "Ask: which job do films and games do now?"
        },
        {
          type: "vote",
          title: "Modern myths?",
          q: "Which modern thing is most like an old myth?",
          opts: ["Superhero films", "Ghost stories", "Urban legends", "Stories about your football club"],
          why: "Arguably all of them. Superheroes are basically gods with better costumes.",
          say: "Ask for one reason per answer."
        }
      ],
      check: {
        q: "Why did people tell myths before science?",
        opts: ["To explain things they could not explain yet", "Because there was no TV", "To get out of doing chores"],
        a: 0,
        why: "Mainly to explain the world. Though no TV probably helped.",
        say: "Let them have the TV one."
      }
    }
  ],

  realworld: {
    title: "You say a myth every week",
    text: "Wednesday is Woden's day. Thursday is Thor's day. Friday is named after the goddess Frigg. Planets are named after Roman gods, and a big sports brand is named after the Greek goddess of victory.",
    art: S("0 0 560 420", I("bolt", 150, 230, 1.6) + I("star", 380, 200, 1.4) + I("globe", 420, 380, 1.1) + A.T(150, 290, "Thursday", 30, { a: "middle", f: 1 }) + A.bird(80, 90, 0.9)),
    say: "Ask: which day would you rename, and after which god?"
  },

  exit: [
    { q: "A story that explains thunder with a god is a...", opts: ["Myth", "Legend", "Folk tale"], a: 0, why: "A myth: gods, monsters, explaining the world." },
    { q: "Robin Hood is best described as a...", opts: ["Myth", "Legend", "Folk tale"], a: 1, why: "A legend: maybe partly true, mostly story." },
    { q: "A story passed down by ordinary people, often with a lesson, is a...", opts: ["Myth", "Legend", "Folk tale"], a: 2, why: "A folk tale, like Jack and the Beanstalk." }
  ],

  driving: {
    angle: "If you could go back and find out whether Robin Hood or King Arthur were real, would you? Or is the story better as a mystery?",
    opts: ["Go and check", "Leave the mystery", "Pass"],
    say: "Ask: what would we lose if we found out the truth?"
  },

  surprise: {
    at: "sections.1.slides.0", kind: "bambi", x: 1430, y: 640, w: 130,
    say: "Bambi: legendary. Some say she is a myth. She is not. She is just very regal."
  }
};
})();
