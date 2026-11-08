/* ==========================================================
   Base 5 Lessons - Relational (PSHE and RSE)
   Assertiveness in relationships, lesson 4 of 4: Under pressure
   Split over the week's three 15 minute PHSE slots (hook, explore,
   explain). Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", PURPLE = "#6a5acd", TEAL = "#007291", ORANGE = "#ef7724";

function crowd(x, y, n, cols){
  var g = "";
  for(var i = 0; i < n; i++){
    var dx = (i - (n - 1) / 2) * 70;
    g += '<g transform="translate(' + (x + dx) + ' ' + y + ')"><path d="M-24 0q0 -46 24 -46t24 46z" fill="' + cols[i % cols.length] + '" stroke="' + INK + '" stroke-width="3"/><circle cx="0" cy="-58" r="15" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3"/><circle cx="-5" cy="-60" r="2.4" fill="' + INK + '"/><circle cx="5" cy="-60" r="2.4" fill="' + INK + '"/></g>';
  }
  return g;
}

window.B5LESSON = {
  id: "rel-assert-4",
  title: "Under pressure",
  mins: 15,
  startMins: 5,
  finishMins: 5,
  cover: { line: "When the whole group wants one thing and you want another. And when someone else needs backing up.", art: S("0 0 600 360", crowd(200, 320, 4, ["#e2557a", "#7a7f1e", "#ef7724", "#3f6f8f"]) + crowd(480, 320, 1, [PURPLE]) + A.bubble(380, 140, 200, 56, "Nah, I'm OK.", 24)) },

  warm: {
    wordle: { word: "GROUP", hint: "A bunch of people together. Can make it hard to say no.", say: "Five letters." },
    wyr: { a: "Be the only one who says no", b: "Go along with something you don't want to do", twist: "Most people find the first one harder in the moment and the second one harder afterwards.", say: "Quick." }
  },

  recap: {
    items: [
      { q: "What's an I statement?", a: "Saying what you need: 'I'd like...', 'I need...', 'I find it hard when...'" },
      { q: "What is a yes you got by pushing?", a: "Not a real yes. It's pressure." }
    ],
    say: "From the last few weeks."
  },

  objective: {
    formal: "recognise group pressure and choose safe ways to stand up for myself and others.",
    mission: "Be an owl in a crowd: your own choice, and a bit of back up for someone else.",
    success: ["Spot group pressure", "Have a way out ready", "Name safe ways to back someone up"],
    say: "Read the mission."
  },

  sections: [
    {
      kind: "hook", part: 1, title: "What group pressure feels like.", mins: 7,
      slides: [
        {
          title: "Group pressure",
          text: "When everyone else is doing something, saying no feels ten times harder.",
          pts: ["It can be fun stuff: everyone's staying up late", "It can be risky stuff: everyone's dared to do something", "It can be mean stuff: everyone's laughing at someone"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 380", crowd(200, 340, 3, ["#e2557a", "#7a7f1e", "#ef7724"]) + crowd(430, 340, 1, [PURPLE]) + A.bubble(40, 60, 300, 56, "Go on, everyone else is!", 22)),
          say: "General examples only. Ask: why is it harder in a group?"
        },
        {
          type: "vote", title: "Honestly...", q: "In a group, which is hardest?",
          opts: ["Saying no to a dare", "Not laughing along", "Leaving early", "Disagreeing out loud"],
          say: "No reasons needed."
        }
      ],
      check: { q: "Why is saying no harder in a group?", opts: ["Nobody wants to be the odd one out", "Groups are louder", "It isn't harder"], a: 0, why: "Being the odd one out feels risky. Knowing that helps you spot it." }
    },
    {
      kind: "explore", part: 2, title: "Ways out, and owl lines.", mins: 11,
      slides: [
        {
          type: "sort", title: "Helpful, or not?", q: "Ways to handle group pressure.",
          bins: ["Helpful", "Not helpful"],
          cards: [
            { t: "\"Nah, I'm alright.\" and change the subject", b: 0 }, { t: "Do it anyway so nobody laughs", b: 1 },
            { t: "Leave: \"I've got to go.\"", b: 0 }, { t: "Shout at everyone", b: 1 },
            { t: "Stick with one person who agrees with you", b: 0 }, { t: "Say yes, then feel rubbish all night", b: 1 }
          ],
          say: "Leaving with an excuse is completely fine. Owls don't have to make speeches."
        },
        {
          type: "predict", title: "The dare",
          q: "Everyone's daring someone to do something risky. They don't look keen. The owl move?",
          opts: ["\"Leave it, they don't want to.\" or quietly go with them", "Join in the dare", "Film it"],
          a: 0,
          why: "Backing someone up can be one sentence, or just walking off with them. It takes one person to make it easier for everyone else to stop."
        }
      ],
      check: { q: "Which is a good way out?", opts: ["\"Nah, I'm alright.\"", "Doing it so nobody laughs"], a: 0, why: "Short, calm, no explaining needed." }
    },
    {
      kind: "explain", part: 3, title: "Backing someone else up, safely.", mins: 6,
      slides: [
        {
          title: "Being an upstander",
          text: "An <b>upstander</b> helps when they see something wrong. It doesn't have to be loud:",
          pts: ["Don't join in or laugh along", "Check on the person afterwards: \"You alright?\"", "Tell an adult you trust, privately", "Only step in if it's safe for you"],
          build: true, ptsFrom: 1,
          art: S("0 0 480 380", crowd(160, 340, 1, [TEAL]) + crowd(320, 340, 1, [PURPLE]) + A.bubble(180, 140, 200, 56, "You alright?", 24)),
          say: "Stress: telling an adult is not snitching, and it is often the bravest option."
        }
      ],
      check: { q: "Which is a safe way to be an upstander?", opts: ["Check on them after and tell a trusted adult", "Start a fight", "Post about it"], a: 0, why: "Quiet, safe, and it works." }
    }
  ],

  realworld: {
    title: "Pressure doesn't stop at school",
    text: "Workmates pushing to cut corners, friends pushing to spend money, online groups pushing to share things. The owl moves work at 15 and at 50.",
    art: S("0 0 560 400", crowd(280, 360, 4, ["#e2557a", "#7a7f1e", "#ef7724", PURPLE]) + A.bird(460, 90, 0.9)),
    say: "Ask: who would you go to if you needed back up?"
  },

  exit: [
    { q: "An upstander is someone who...", opts: ["Helps when they see something wrong", "Stands up a lot"], a: 0, why: "Helps, in a way that's safe for them." },
    { q: "Leaving a situation with an excuse is...", opts: ["A fine owl move", "Being a mouse"], a: 0, why: "Owls pick their moment, and sometimes that moment is leaving." }
  ],

  driving: {
    angle: "If you could time travel into a moment in history where a crowd did something wrong, would you be the one to say no? Would one person make a difference?",
    opts: ["Yes, one voice matters", "It would be too hard", "Pass"],
    say: "Keep it historical and general. Passing is fine."
  },

  surprise: { at: "sections.0.slides.0", kind: "bonnie", x: 1450, y: 150, w: 110, say: "Group pressure has never worked on Bonnie. Unless the group has ham." }
};
})();
