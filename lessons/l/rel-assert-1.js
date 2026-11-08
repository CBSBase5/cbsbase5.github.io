/* ==========================================================
   Base 5 Lessons - Relational (PSHE and RSE)
   Assertiveness in relationships, lesson 1 of 4: Mouse, dragon or owl?
   Split over the week's three 15 minute PHSE slots:
     part 1 (Monday) hook, part 2 (Thursday) explore,
     part 3 (Friday) explain and the finish.
   Leads into the HQ activity "My yes, my no".
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, INK = "#0a2f38";
var MOUSE = "#a9a39a", DRAGON = "#3fae6a", OWL = "#9a6b45", PURPLE = "#6a5acd", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247";

function mouse(x, y, s){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
    '<path d="M38 40q40 10 30 -20" stroke="' + MOUSE + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="0" cy="30" rx="44" ry="34" fill="' + MOUSE + '"/>' +
    '<circle cx="-26" cy="-26" r="20" fill="' + MOUSE + '"/><circle cx="-26" cy="-26" r="11" fill="#f3b6c4"/>' +
    '<circle cx="24" cy="-26" r="20" fill="' + MOUSE + '"/><circle cx="24" cy="-26" r="11" fill="#f3b6c4"/>' +
    '<ellipse cx="0" cy="0" rx="32" ry="28" fill="' + MOUSE + '"/>' +
    '<circle cx="-11" cy="2" r="3.4" fill="' + INK + '"/><circle cx="11" cy="2" r="3.4" fill="' + INK + '"/>' +
    '<circle cx="0" cy="14" r="5" fill="#e2557a"/><path d="M-6 22q6 -4 12 0" stroke="' + INK + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
    '<path d="M-30 14l-18 -4M-30 18l-18 4M30 14l18 -4M30 18l18 4" stroke="' + INK + '" stroke-width="1.6"/></g>';
}
function dragon(x, y, s){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
    '<path d="M-40 20l-30 -40l20 44zM40 20l30 -40l-20 44z" fill="#2c8a52" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<ellipse cx="0" cy="34" rx="46" ry="36" fill="' + DRAGON + '"/>' +
    '<path d="M-24 -22l6 -18l8 16l6 -18l8 18l6 -16l6 18" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<ellipse cx="0" cy="0" rx="36" ry="30" fill="' + DRAGON + '"/>' +
    '<path d="M-20 -8l12 5M20 -8l-12 5" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
    '<circle cx="-12" cy="2" r="3.6" fill="' + INK + '"/><circle cx="12" cy="2" r="3.6" fill="' + INK + '"/>' +
    '<ellipse cx="0" cy="18" rx="14" ry="9" fill="' + INK + '"/><path d="M-8 12l3 5l3 -5l3 5l3 -5" fill="#fff"/>' +
    '<path d="M14 18q22 -4 30 -18q-2 14 10 10q-10 14 -40 10z" fill="' + ORANGE + '" opacity=".9"/></g>';
}
function owl(x, y, s){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
    '<ellipse cx="0" cy="22" rx="42" ry="48" fill="' + OWL + '"/>' +
    '<ellipse cx="0" cy="36" rx="26" ry="30" fill="#e9d2b4"/>' +
    '<path d="M-10 30q4 4 8 0M2 40q4 4 8 0M-10 50q4 4 8 0" stroke="' + OWL + '" stroke-width="2.4" fill="none"/>' +
    '<path d="M-34 -18l-6 -22l20 14zM34 -18l6 -22l-20 14z" fill="' + OWL + '"/>' +
    '<circle cx="-15" cy="-6" r="15" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/><circle cx="15" cy="-6" r="15" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/>' +
    '<circle cx="-15" cy="-6" r="6" fill="' + INK + '"/><circle cx="15" cy="-6" r="6" fill="' + INK + '"/>' +
    '<path d="M-6 8l6 10l6 -10z" fill="' + ORANGE + '"/>' +
    '<path d="M-42 20q-10 30 8 46M42 20q10 30 -8 46" stroke="#7a5233" stroke-width="10" fill="none" stroke-linecap="round"/>' +
    '<path d="M-12 70v8M12 70v8" stroke="' + ORANGE + '" stroke-width="5" stroke-linecap="round"/></g>';
}
/* a speech bubble with up to three lines */
function say(x, y, w, lines, col){
  var h = 22 + lines.length * 30;
  return '<g transform="translate(' + x + ' ' + y + ')"><path d="M40 ' + h + 'l-6 22l26 -22z" fill="#fffdf8" stroke="' + (col || INK) + '" stroke-width="3.5" stroke-linejoin="round"/>' +
    '<rect width="' + w + '" height="' + h + '" rx="16" fill="#fffdf8" stroke="' + (col || INK) + '" stroke-width="3.5"/>' +
    '<rect x="36" y="' + (h - 4) + '" width="22" height="8" fill="#fffdf8"/>' +
    lines.map(function(l, i){ return T(16, 38 + i * 30, l, 23, { b: i === 0 && lines.length === 1 }); }).join("") + '</g>';
}
function three(scale){
  return S("0 0 760 260", mouse(130, 140, scale || 1) + dragon(380, 140, scale || 1) + owl(630, 130, scale || 1) +
    T(130, 250, "Mouse", 28, { a: "middle", f: 1 }) + T(380, 250, "Dragon", 28, { a: "middle", f: 1 }) + T(630, 250, "Owl", 28, { a: "middle", f: 1 }));
}

window.B5LESSON = {
  id: "rel-assert-1",
  title: "Mouse, dragon or owl?",
  mins: 15,
  startMins: 5,
  finishMins: 5,
  cover: {
    line: "Three ways to speak up. Only one of them usually gets you what you need.",
    art: three(0.9)
  },

  warm: {
    wordle: { word: "VOICE", hint: "You use it to speak up. Some days it is loud, some days it is barely there.",
      say: "Quick one. If it stalls, give the clue straight away." },
    wyr: {
      a: "Have to say exactly what you think, all the time", b: "Never be able to say what you think",
      twist: "Both sound tiring. Most of life is somewhere in the middle, and that middle is what this week is about.",
      say: "Tap a side for each person. No reasons needed."
    }
  },

  recap: {
    items: [
      { q: "What does it mean to stand up for yourself?", a: "Saying what you need or want, without letting someone walk over you." },
      { q: "Name a time adults have to speak up.", a: "In a shop, at the doctor's, at work, on the phone sorting a bill." }
    ],
    say: "Keep this light. General examples only."
  },

  objective: {
    formal: "recognise passive, aggressive and assertive ways of speaking up.",
    mission: "Meet the mouse, the dragon and the owl, and work out which one gets a fair deal.",
    success: [
      "Name the three styles",
      "Spot each one in a real situation",
      "Say an owl sentence out loud, if I want to"
    ],
    say: "Read the mission. Stress this is about styles, not types of people: everyone does all three."
  },

  sections: [
    {
      kind: "hook", part: 1, title: "Someone pushes in front of you in the lunch queue.", mins: 7,
      slides: [
        {
          title: "The lunch queue",
          text: "Someone pushes in right in front of you. Three ways it could go:",
          stack: true, artWidth: 1300,
          art: S("0 0 1000 410",
            '<g data-s="1">' + mouse(150, 300, 0.95) + say(40, 110, 230, ["(says nothing)", "(eats lunch later)"], MOUSE) + T(150, 400, "Mouse", 28, { a: "middle", f: 1 }) + '</g>' +
            '<g data-s="2">' + dragon(500, 300, 0.95) + say(370, 110, 290, ["OI! Back of the", "queue. NOW."], DRAGON) + T(500, 400, "Dragon", 28, { a: "middle", f: 1 }) + '</g>' +
            '<g data-s="3">' + owl(840, 290, 0.95) + say(690, 52, 300, ["Excuse me, I was", "here first. The queue", "starts back there."], OWL) + T(840, 400, "Owl", 28, { a: "middle", f: 1 }) + '</g>'),
          say: "Click through all three. Ask: what happens next in each one? Who gets lunch? Who gets in trouble?"
        },
        {
          type: "vote",
          title: "Honestly...",
          q: "Which one would you probably do? No wrong answers.",
          opts: ["Mouse", "Dragon", "Owl", "Depends on the day"],
          why: "All of them are normal. Most people switch depending on the day, who it is, and how tired or wound up they are.",
          say: "Tap for anyone who wants to answer. Passing is fine. Next shows the line about it being normal."
        }
      ],
      check: {
        q: "Which one says what they need without having a go at anyone?",
        opts: ["Mouse", "Dragon", "Owl"],
        a: 2,
        why: "The owl. Mouse does not say what they need. Dragon says it, but by having a go. Owl says it clearly and calmly. That is called being <b>assertive</b>.",
        say: "Introduce the three words: passive (mouse), aggressive (dragon), assertive (owl)."
      }
    },
    {
      kind: "explore", part: 2, title: "Spotting mouse, dragon and owl: voice, words and body.", mins: 11,
      slides: [
        {
          title: "The clues",
          text: "You can usually tell which one is talking from three things:",
          stack: true, artWidth: 1300,
          art: S("0 0 1040 400",
            mouse(300, 80, 0.62) + dragon(590, 80, 0.62) + owl(880, 74, 0.62) +
            T(300, 160, "Mouse: passive", 26, { a: "middle", f: 1 }) + T(590, 160, "Dragon: aggressive", 26, { a: "middle", f: 1 }) + T(880, 160, "Owl: assertive", 26, { a: "middle", f: 1 }) +
            '<g data-s="1">' + T(10, 220, "Voice", 26, { f: 1, c: PURPLE }) + T(300, 220, "quiet, trails off", 24, { a: "middle" }) + T(590, 220, "loud, sharp", 24, { a: "middle" }) + T(880, 220, "steady, clear", 24, { a: "middle" }) + '</g>' +
            '<g data-s="2">' + T(10, 290, "Words", 26, { f: 1, c: PURPLE }) + T(300, 290, '"It\'s fine, whatever"', 24, { a: "middle" }) + T(590, 290, '"You ALWAYS..."', 24, { a: "middle" }) + T(880, 290, '"I\'d like..."', 24, { a: "middle" }) + '</g>' +
            '<g data-s="3">' + T(10, 360, "Body", 26, { f: 1, c: PURPLE }) + T(300, 360, "looks away, shrinks", 24, { a: "middle" }) + T(590, 360, "leans in, points", 24, { a: "middle" }) + T(880, 360, "stands steady, calm", 24, { a: "middle" }) + '</g>'),
          say: "Act each one out if you fancy it (the dragon is the fun one). Owls do not have to make eye contact: looking near someone is fine."
        },
        {
          type: "sort",
          title: "Who said it?",
          q: "Mouse, dragon or owl?",
          bins: ["Mouse", "Dragon", "Owl"],
          cards: [
            { t: "\"Oh... it doesn't matter. Have it.\"", b: 0 },
            { t: "\"Give it back or else.\"", b: 1 },
            { t: "\"I'd like my charger back after lunch, please.\"", b: 2 },
            { t: "\"Whatever. Fine.\"", b: 0 },
            { t: "\"You ALWAYS do this!\"", b: 1 },
            { t: "\"I don't fancy it today. Can we do Saturday?\"", b: 2 }
          ],
          say: "Students drag or call it. Some are arguable: 'Whatever. Fine.' can be a bit dragon too. Arguing about it is the point."
        }
      ],
      check: {
        q: "A friend borrows your headphones without asking. Which is the owl?",
        opts: ["Say nothing and buy new ones", "Snatch them back and shout", "\"I need those back. Ask me first next time.\""],
        a: 2,
        why: "The owl says what they need (the headphones back) and what they would like next time, without having a go.",
        say: "Ask: would the friendship survive each one?"
      }
    },
    {
      kind: "explain", part: 3, title: "The owl recipe, and when not to use it.", mins: 6,
      slides: [
        {
          title: "The owl recipe",
          text: "If you are stuck for words, this works almost anywhere:",
          pts: ["<b>I feel</b> ... (how it is for you)", "<b>when</b> ... (what happened, not what they are)", "<b>I'd like</b> ... (what would help)"],
          build: true, ptsFrom: 1,
          art: S("0 0 560 420", owl(110, 300, 1.1) + '<g data-s="4">' + say(200, 60, 340, ["I feel wound up when", "people push in. I'd like", "you to go to the back."], OWL) + '</g>'),
          say: "Anyone want to try one out loud? Any situation, real or silly. Passing is fine."
        },
        {
          title: "Owl doesn't mean always",
          text: "Being assertive is a choice, not a rule. Owls pick their moment.",
          pts: ["If it doesn't feel safe: walk away and tell an adult", "If you're too wound up: come back to it later", "You're allowed to change your mind"],
          build: true, ptsFrom: 1,
          art: S("-130 -110 280 230", A.bonnie(0, 10, 1.4) + A.bubble(-120, -100, 250, 50, "Bonnie's way: stare.", 20, "right")),
          say: "Key message: walking away is a smart move, not a mouse move, when someone is angry or it doesn't feel safe."
        }
      ],
      check: {
        q: "When might walking away be the best owl move?",
        opts: ["When someone is getting angry and it doesn't feel safe", "Never. Owls always stay and argue", "Only on Tuesdays"],
        a: 0,
        why: "When it doesn't feel safe, leaving and telling someone is the smart, strong choice.",
        say: "Let them enjoy the Tuesday option."
      }
    }
  ],

  realworld: {
    title: "Owls get things sorted",
    text: "Taking something faulty back to a shop. Telling the bus driver it's your stop. Saying you didn't understand at the doctor's. Asking for a break at work. Owl sentences, every one.",
    art: S("0 0 560 420", owl(280, 240, 1.6) + A.bird(470, 90, 1.1)),
    say: "Ask: which of these would be hardest? Why?"
  },

  exit: [
    { q: "Which style says what you need and respects the other person?", opts: ["Passive (mouse)", "Aggressive (dragon)", "Assertive (owl)"], a: 2, why: "Assertive: clear about what you need, without having a go." },
    { q: "Which is an owl sentence?", opts: ["\"Do it or else.\"", "\"I'd like a turn when you've finished.\"", "\"It doesn't matter, honestly.\""], a: 1, why: "\"I'd like a turn when you've finished\" says what you need, calmly." }
  ],

  driving: {
    angle: "If you could go back to a moment and swap the mouse or the dragon for the owl, would you? Or is it better to take what you learned forward? (No need to say which moment.)",
    opts: ["Go back and redo it", "Take it forward", "Pass"],
    say: "Keep it general. Nobody needs to share a moment."
  },

  surprise: {
    at: "sections.0.slides.0", kind: "bonnie", x: 1440, y: 140, w: 120,
    say: "Bonnie's style: sit down, stare at whoever has the biscuits, wait. Not mouse, not dragon. Something else entirely."
  }
};
})();
