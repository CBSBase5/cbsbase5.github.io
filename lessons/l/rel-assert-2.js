/* ==========================================================
   Base 5 Lessons - Relational (PSHE and RSE)
   Assertiveness in relationships, lesson 2 of 4: My yes, my no
   Split over the week's three 15 minute PHSE slots (hook, explore,
   explain). Leads into the HQ activity "My yes, my no".
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", PURPLE = "#6a5acd", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247";

function owl(x, y, s){
  return '<g class="float" style="animation-delay:-' + ((x % 7) / 2) + 's"><g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><ellipse cx="0" cy="22" rx="42" ry="48" fill="#9a6b45"/><ellipse cx="0" cy="36" rx="26" ry="30" fill="#e9d2b4"/>' +
    '<path d="M-34 -18l-6 -22l20 14zM34 -18l6 -22l-20 14z" fill="#9a6b45"/><circle cx="-15" cy="-6" r="15" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/><circle cx="15" cy="-6" r="15" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/>' +
    '<circle cx="-15" cy="-6" r="6" fill="' + INK + '"/><circle cx="15" cy="-6" r="6" fill="' + INK + '"/><path d="M-6 8l6 10l6 -10z" fill="' + ORANGE + '"/></g></g>';
}
function circleArt(){
  return S("0 0 560 420", '<circle cx="280" cy="215" r="140" fill="#e8e5fa" stroke="' + PURPLE + '" stroke-width="5" stroke-dasharray="16 12"/>' +
    '<g transform="translate(280 250)"><circle cx="0" cy="-74" r="22" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3"/><path d="M-34 30q0 -80 34 -80t34 80z" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="3"/><circle cx="-8" cy="-76" r="3" fill="' + INK + '"/><circle cx="8" cy="-76" r="3" fill="' + INK + '"/></g>' +
    '<g data-s="1">' + T(280, 52, "My stuff", 26, { a: "middle", f: 1 }) + '</g><g data-s="2">' + T(490, 222, "My time", 26, { a: "middle", f: 1 }) + '</g>' +
    '<g data-s="3">' + T(280, 395, "My body and space", 26, { a: "middle", f: 1 }) + '</g><g data-s="4">' + T(72, 222, "My feelings", 26, { a: "middle", f: 1 }) + '</g>');
}

window.B5LESSON = {
  id: "rel-assert-2",
  title: "My yes, my no",
  mins: 15,
  cc: [
    { week: "Anti-Bullying Week", line: "A clear, calm no is one of the best tools there is, for you and for anyone you back up." }
  ],
  startMins: 5,
  finishMins: 5,
  cover: { line: "Saying no without being a dragon. Hearing no without turning into one.", art: S("0 0 560 380", A.scene(560, 380, { ground: 340, time: "dusk", sun: false }) + owl(160, 190, 1.6) + A.bubble(250, 70, 260, 70, "No thanks.", 34)) },

  warm: {
    wordle: { word: "SPACE", hint: "Personal ___: the bubble around you.", say: "Quick one." },
    wyr: {
      a: "Have to say yes to everything for a whole day", b: "Have to say no to everything for a whole day",
      twist: "There is a whole film about the yes one. It does not go smoothly.",
      say: "Tap a side each. Ask what would go wrong first."
    }
  },

  recap: {
    items: [
      { q: "Mouse, dragon or owl: which one is assertive?", a: "The owl: clear about what they need, without having a go." },
      { q: "What is the owl recipe?", a: "I feel ... when ... I'd like ..." }
    ],
    say: "From last week."
  },

  objective: {
    formal: "say no clearly and respectfully, and respect other people's no.",
    mission: "Practise the owl no, and the owl way of hearing no.",
    success: ["Say what a boundary is", "Pick an owl way to say no", "Respond well when someone says no to me"],
    say: "Read the mission."
  },

  sections: [
    {
      kind: "hook", part: 1, title: "Boundaries: the lines around what you are OK with.", mins: 7,
      slides: [
        { title: "Your yes, your no", text: "A <b>boundary</b> is a line for what you are OK with. Everybody has them, and everybody's are different.", art: circleArt(),
          say: "Click through the four. Stress: your boundaries are yours. They can change, and that's allowed." },
        {
          type: "vote", title: "Honestly...", q: "Who is hardest to say no to?",
          opts: ["Someone you like", "Someone in charge", "A group of people", "Someone pushy"],
          why: "All of them can be hard. Saying no to someone you like is often hardest, because you don't want to upset them.",
          say: "No reasons needed. Passing is fine."
        }
      ],
      check: { q: "What is a boundary?", opts: ["A line for what you are OK with", "A fence round a field", "A rule only adults have"], a: 0, why: "A line for what you are OK with. (A fence round a field is also a boundary, to be fair.)" }
    },
    {
      kind: "explore", part: 2, title: "Ways to say no.", mins: 11,
      slides: [
        {
          title: "Owl ways to say no",
          pts: ["<b>Polite no</b>: \"No thanks, I'm alright.\"", "<b>Firm no</b>: \"No. I've said no.\"", "<b>No, plus an idea</b>: \"Not today. Saturday?\"", "<b>Just no</b>: \"No.\" That is a full sentence."],
          build: true, ptsFrom: 1,
          art: S("0 0 480 420", owl(240, 250, 2)),
          say: "Ask which one feels easiest to say. All four are owl."
        },
        {
          type: "sort", title: "Owl no, or not quite?", q: "Which of these are clear, calm no's?",
          bins: ["Owl no", "Not quite"],
          cards: [
            { t: "\"No thanks, I'm alright.\"", b: 0 }, { t: "\"Ugh... I suppose so.\"", b: 1 },
            { t: "\"NO! Go away, weirdo!\"", b: 1 }, { t: "\"Not today. Maybe Saturday?\"", b: 0 },
            { t: "\"No.\"", b: 0 }, { t: "\"Maybe... I don't know... OK.\"", b: 1 }
          ],
          say: "Ask: which of the 'not quite' ones is mouse, which is dragon?"
        },
        {
          type: "predict", title: "Do you need a reason?",
          q: "When you say no, do you always have to give a reason?",
          opts: ["No. 'No' can be enough", "Yes, always", "Only if they ask twice"],
          a: 0,
          why: "A reason can help, but you never owe one. 'No' is a full sentence.",
          say: "This one often surprises people."
        }
      ],
      check: { q: "Someone asks to borrow your phone and you don't want to lend it. Owl answer?", opts: ["\"No, sorry. I'd rather not.\"", "\"Fine... here.\"", "\"Get lost.\""], a: 0, why: "Clear and calm. No need to explain." }
    },
    {
      kind: "explain", part: 3, title: "Hearing no, like an owl.", mins: 6,
      slides: [
        {
          title: "When someone says no to you",
          pts: ["<b>Accept it</b>: \"OK, no worries.\"", "<b>Don't push</b>: asking again and again is pressure", "<b>It's not always about you</b>: they might have their own reasons", "<b>A yes after lots of pushing</b> isn't a real yes"],
          build: true, ptsFrom: 1,
          art: S("-140 -110 280 230", A.bonnie(0, 10, 1.5) + A.bubble(-130, -100, 260, 50, "Biscuit? No? Fine.", 20, "right")),
          say: "Key message: a yes you got by pushing is not a real yes."
        },
        {
          type: "predict", title: "The park",
          q: "You ask a friend to come to the park. They say no. Best response?",
          opts: ["\"OK, no worries. Another time?\"", "\"Please please please please\"", "\"Fine. You're boring then.\""],
          a: 0,
          why: "Accept it, keep the door open. The friendship is worth more than the trip to the park."
        }
      ],
      check: { q: "If you keep asking until someone says yes, that is...", opts: ["Pressure, not a real yes", "Good persuading", "Being an owl"], a: 0, why: "Pressure. A real yes is one someone gives freely." }
    }
  ],

  realworld: {
    title: "No protects you",
    text: "Turning down the extended warranty in a shop. Saying no to a scam phone call. Not doing a shift you can't manage. Leaving a group chat that makes you feel rubbish. A clear no protects your time, your money and you.",
    art: S("0 0 560 420", A.scene(560, 420, { ground: 330, time: "dusk", sun: [470, 80] }) + I("phone", 200, 300, 2) + I("coin", 400, 260, 2)),
    say: "Ask: which one would be hardest to say no to?"
  },

  exit: [
    { q: "Do you always have to give a reason for saying no?", opts: ["Yes", "No"], a: 1, why: "No. 'No' is a full sentence." },
    { q: "Someone says no to you. The owl response is...", opts: ["Accept it", "Keep asking", "Sulk until they change their mind"], a: 0, why: "Accept it. Pushing turns it into pressure." }
  ],

  driving: {
    angle: "If you could go back and give a younger you one tip about saying no, would you? (No need to share it.)",
    opts: ["Yes, one tip", "No, they'll work it out", "Pass"],
    say: "Keep it general. Nobody needs to share anything."
  },

  surprise: { at: "sections.1.slides.0", kind: "bambi", x: 1440, y: 620, w: 120, say: "Bambi's no: a slow, regal turn of the head. Nobody argues with that." }
};
})();
