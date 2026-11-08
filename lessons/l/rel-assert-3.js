/* ==========================================================
   Base 5 Lessons - Relational (PSHE and RSE)
   Assertiveness in relationships, lesson 3 of 4: Asking for what I need
   Split over the week's three 15 minute PHSE slots (hook, explore,
   explain). Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", PURPLE = "#6a5acd", TEAL = "#007291", ORANGE = "#ef7724";

function fcard(x, y, w, text, col, d){ return '<g class="float" style="animation-delay:-' + d + 's">' + card(x, y, w, text, col) + '</g>'; }
function card(x, y, w, text, col){ return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="64" rx="16" fill="#fffdf8" stroke="' + (col || INK) + '" stroke-width="3.5"/>' + T(x + w / 2, y + 41, text, 24, { a: "middle", b: 1 }); }

window.B5LESSON = {
  id: "rel-assert-3",
  title: "Asking for what I need",
  mins: 15,
  cc: [
    { week: "Giving Tuesday", line: "Giving Tuesday is a day for giving time and help. When you ask for help, you give someone the chance to give it." }
  ],
  startMins: 5,
  finishMins: 5,
  cover: { line: "A break, some help, a bit of quiet. Asking is a skill, and it gets easier.", art: S("0 0 560 380", fcard(40, 40, 240, "Can I have a break?", PURPLE, 0) + fcard(280, 140, 240, "Can you help me?", TEAL, 1.2) + fcard(60, 240, 260, "Can it be quieter?", ORANGE, 2.1) + A.bonnie(440, 320, 0.6)) },

  warm: {
    wordle: { word: "HELP", hint: "Four letters. Asking for it is a skill.", say: "Only four letters today." },
    wyr: { a: "Ask for help out loud", b: "Ask for help in writing", twist: "Both count. Lots of adults email rather than ask out loud.", say: "Quick." }
  },

  recap: {
    items: [
      { q: "Do you always have to give a reason for saying no?", a: "No. 'No' is a full sentence." },
      { q: "What's the owl recipe?", a: "I feel ... when ... I'd like ..." }
    ],
    say: "From the last two weeks."
  },

  objective: {
    formal: "ask for what I need clearly, using I statements, at a good moment.",
    mission: "Get better at asking: the right words, the right person, the right moment.",
    success: ["Turn a 'you' complaint into an 'I' statement", "Pick a good moment to ask", "Know who to ask for help"],
    say: "Read the mission."
  },

  sections: [
    {
      kind: "hook", part: 1, title: "Things people need to ask for.", mins: 7,
      slides: [
        {
          title: "Things worth asking for", stack: true, artWidth: 1300,
          text: "Everybody needs to ask for things, every day:",
          art: S("0 0 1000 260", card(20, 30, 220, "A break", PURPLE) + card(270, 30, 220, "Some help", TEAL) + card(520, 30, 220, "More time", ORANGE) + card(770, 30, 210, "Quiet", PURPLE) +
            card(130, 150, 320, "To be left alone for a bit", TEAL) + card(500, 150, 380, "Something done differently", ORANGE)),
          say: "Ask: which of these have you asked for this week?"
        },
        {
          type: "vote", title: "Honestly...", q: "Which is hardest to ask for?",
          opts: ["Help", "A break", "More time", "To be left alone"],
          why: "Different for everyone. Lots of people find asking for help the hardest, because it can feel like admitting something.",
          say: "No reasons needed."
        }
      ],
      check: { q: "An 'I statement' starts with...", opts: ["I", "You", "Oi"], a: 0, why: "I: 'I need...', 'I'd like...', 'I find it hard when...'" }
    },
    {
      kind: "explore", part: 2, title: "I statements, and picking the moment.", mins: 11,
      slides: [
        {
          type: "sort", title: "I or you?", q: "Which are I statements, and which are you statements?",
          bins: ["I statement", "You statement"],
          cards: [
            { t: "\"I need a break.\"", b: 0 }, { t: "\"You're so annoying.\"", b: 1 },
            { t: "\"I'd like more time for this.\"", b: 0 }, { t: "\"You never help me.\"", b: 1 },
            { t: "\"I find it hard when it's loud.\"", b: 0 }, { t: "\"You always ruin it.\"", b: 1 }
          ],
          say: "Ask: which ones would make you want to help?"
        },
        {
          type: "predict", title: "Pick the moment",
          q: "When's the best moment to ask Jay for something?",
          opts: ["When he's free and it's calm", "In the middle of a fire drill", "By shouting across the room"],
          a: 0,
          why: "When the person can actually listen. Timing changes the answer more than people think.",
          say: "Ask: how can you tell if someone is free to listen?"
        }
      ],
      check: { q: "Which is an I statement?", opts: ["\"I'd like a turn when you're done.\"", "\"You always hog it.\"", "\"Give it.\""], a: 0, why: "It says what you need without blaming." }
    },
    {
      kind: "explain", part: 3, title: "Who to ask, and what to say.", mins: 6,
      slides: [
        {
          title: "Asking for help is a skill",
          pts: ["<b>Who</b>: someone whose job it is, or someone you trust", "<b>What</b>: \"Can you help me with...?\"", "<b>When</b>: a calm moment, or right away if it's urgent", "<b>How</b>: out loud, in writing, or with a card. All count."],
          build: true, ptsFrom: 1,
          art: S("0 0 480 400", I("phone", 140, 320, 1.8) + card(220, 120, 240, "Can you help me?", TEAL) + A.jay(340, 300, 1.4)),
          say: "Stress the last point: written or a card counts just as much."
        },
        {
          type: "predict", title: "In the shop",
          q: "You can't find something in a big shop. Owl move?",
          opts: ["Ask someone who works there: \"Excuse me, where are the...?\"", "Walk round for an hour", "Give up and go home"],
          a: 0,
          why: "Staff are there for exactly this. It takes ten seconds."
        }
      ],
      check: { q: "Which counts as asking for help?", opts: ["Saying it, writing it, or showing a card", "Only saying it out loud", "Only if you cry"], a: 0, why: "Any way that gets the message across counts." }
    }
  ],

  realworld: {
    title: "Adults ask all the time",
    text: "Asking for changes at work, a quieter room at college, a longer appointment at the doctor's, help at the bank. People who ask get more of what they need.",
    art: S("0 0 560 400", A.scene(560, 400, { ground: 330, time: "day", sun: [470, 70] }) + I("briefcase", 180, 300, 2.2) + I("phone", 400, 320, 1.8)),
    say: "Ask: who's the easiest person to ask for help, and why?"
  },

  exit: [
    { q: "Which is an I statement?", opts: ["\"I need a minute.\"", "\"You're doing my head in.\""], a: 0, why: "It starts with what you need." },
    { q: "The best time to ask is usually...", opts: ["When the person can listen", "When they're busiest"], a: 0, why: "When they can listen." }
  ],

  driving: {
    angle: "If future you could time travel back with one piece of advice, would you want to hear it? Or would you rather work it out yourself?",
    opts: ["Yes, tell me", "No, I'll work it out", "Pass"],
    say: "Keep it light."
  },

  surprise: { at: "sections.1.slides.0", kind: "bird", x: 1450, y: 140, say: "Tweet. (Bird for: can I have some of your crisps? See, it's easy.)" }
};
})();
