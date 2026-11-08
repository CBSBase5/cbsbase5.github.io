/* ==========================================================
   Lessons - Cultural Calendar: Anti-Bullying Week (16 to 20 November 2026)
   Theme: Break the Silence. Five 30 minute parts, one each morning:
     1 hook (what bullying is), 2 explore (the kinds, online too),
     3 dig deeper (bystander to upstander), 4 make (trusted adults,
     a kindness poster), 5 share (a group pledge) and the finish.
   Whole school: neutral words, made up examples only, never about
   anyone in the room. Shape as /lessons/l/rel-assert-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, C = A.cci, CT = A.ccTile, INK = "#0a2f38";
var BLUE = "#0077b6", SKY = "#00b4d8", PINK = "#ff006e", YELLOW = "#ffd60a", TEAL = "#007291", ORANGE = "#ef7724", GREEN = "#1e9e5a", GREY = "#9aa5ad";

/* a simple round person, coloured, with a face that can be happy, flat or sad */
var HAIR = ["#3b2a1e", "#6b4423", "#c98a3a", "#1d1d1d", "#8a3b1e"];
function pal(x, y, col, face, s, cls){
  s = s || 1; face = face || "happy";
  var h = HAIR[Math.abs(Math.round(x * 3 + y)) % HAIR.length], k = Math.abs(Math.round(x)) % 3;
  var mouth = face === "happy" ? 'M-9 0q9 8 18 0' : face === "sad" ? 'M-9 6q9 -7 18 0' : 'M-8 3h16';
  var hair = k === 0 ? '<path d="M-29 -16q2 -30 29 -30t29 30q-12 -12 -29 -12t-29 12z" fill="' + h + '"/>'
    : k === 1 ? '<path d="M-30 -10q-2 -36 30 -36t30 36q-4 -20 -16 -22q-10 10 -30 4q-8 4 -14 18z" fill="' + h + '"/><circle cx="24" cy="-34" r="9" fill="' + h + '"/>'
    : '<path d="M-31 6q-6 -50 31 -52t31 52q-4 -24 -10 -30q-20 4 -42 -6q-8 10 -10 36z" fill="' + h + '"/>';
  return '<g' + (cls ? ' class="' + cls + '"' : "") + '><g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<ellipse cx="0" cy="74" rx="40" ry="7" fill="' + INK + '" opacity=".14"/>' +
    '<path d="M-34 72q0 -50 34 -50t34 50z" fill="' + col + '" stroke="' + INK + '" stroke-width="3.5"/>' +
    '<path d="M-26 38q-10 14 -8 30M26 38q10 14 8 30" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>' +
    '<rect x="-8" y="10" width="16" height="12" fill="#f1c7a1"/>' +
    '<circle cx="0" cy="-12" r="28" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3.5"/>' + hair +
    '<circle cx="-10" cy="-12" r="3.6" fill="' + INK + '"/><circle cx="10" cy="-12" r="3.6" fill="' + INK + '"/>' +
    '<circle cx="-17" cy="-2" r="5" fill="#e2557a" opacity=".25"/><circle cx="17" cy="-2" r="5" fill="#e2557a" opacity=".25"/>' +
    '<path d="' + mouth + '" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>';
}
function group(x, y, cols, s){
  return cols.map(function(c, i){ return pal(x + (i - (cols.length - 1) / 2) * 76 * (s || 1), y, c, "happy", s || 1); }).join("");
}
/* a megaphone with sound lines */
function shout(x, y, s){
  return '<g transform="translate(' + x + ' ' + y + ')">' + C("megaphone", 0, 0, 120 * (s || 1), PINK) +
    '<g class="pulse"><path d="M' + (70 * (s || 1)) + ' -30q16 30 0 60M' + (90 * (s || 1)) + ' -46q26 46 0 92" stroke="' + INK + '" stroke-width="4" fill="none" stroke-linecap="round"/></g></g>';
}
function phoneMsg(x, y, lines, col){
  return '<g transform="translate(' + x + ' ' + y + ')"><rect x="-90" y="-150" width="180" height="300" rx="26" fill="' + INK + '"/><rect x="-78" y="-130" width="156" height="250" rx="12" fill="#f4f7fb"/>' +
    lines.map(function(l, i){ return '<rect x="-66" y="' + (-112 + i * 62) + '" width="132" height="48" rx="14" fill="' + (i % 2 ? "#fffdf8" : (col || SKY)) + '" stroke="' + INK + '" stroke-width="2"/>' + T(0, -82 + i * 62, l, 18, { a: "middle" }); }).join("") + '</g>';
}

window.B5LESSON = {
  id: "cc-antibullying-1",
  title: "Anti-Bullying Week",
  mins: 30,
  startMins: 5,
  finishMins: 6,
  cover: {
    line: "What could you say when something is not OK? This year's theme: Break the Silence.",
    art: A.ccScene("anti-bullying") || S("0 0 600 400", group(300, 250, [BLUE, PINK, YELLOW, GREEN]))
  },

  warm: {
    wordle: { word: "SPEAK", hint: "What you do when you break the silence.", say: "Quick one. Clue straight away if it stalls." }
  },
  warms: {
    2: { wyr: { a: "Have a friend who always tells you the truth", b: "Have a friend who always backs you up",
      twist: "Best of all is a friend who does both. That is a lot of what this week is about.", say: "Tap a side for each person. No reasons needed." } },
    3: { wordle: { word: "BRAVE", hint: "How it feels to speak up. Sometimes it is a tiny bit of this.", say: "Keep the warm up light." } },
    4: { wyr: { a: "Get one kind message from a stranger", b: "Get five kind messages from friends",
      twist: "Both feel good. Kind words are free, and they work.", say: "This leads into today's making." } },
    5: { wordle: { word: "TRUST", hint: "The adults you can go to have yours.", say: "Last part this week." } }
  },

  objective: {
    formal: "recognise bullying, and know what to say and who to go to when something is not OK.",
    mission: "Spot it, find the words, and build a room where nobody stays silent.",
    success: [
      "Say what makes something bullying",
      "Pick a line I could say",
      "Name an adult I could go to"
    ],
    say: "Before anything else: if something is happening to anyone right now, they can tell any adult they trust, and they will not be in trouble for telling."
  },

  sections: [
    {
      kind: "hook", part: 1, title: "What actually counts as bullying?", mins: 15,
      slides: [
        {
          title: "Break the Silence",
          text: "Bullying grows when nobody says anything. This week is about the words that stop it.",
          art: S("0 0 560 420", A.scene(560, 420, { ground: 380, time: "day", sun: [480, 80] }) + group(250, 300, [BLUE, PINK, YELLOW], 1.1) + shout(470, 230, 0.8)),
          say: "Ask: what could 'break the silence' mean? Any answer is fine."
        },
        {
          title: "Bullying has a shape",
          text: "Not every falling out is bullying. Bullying usually has all of these:",
          pts: ["It is <b>on purpose</b>", "It <b>keeps happening</b>", "It is <b>hard to stop</b>: one side has more power", "It <b>hurts</b>: bodies, feelings or friendships"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", '<g data-s="1">' + CT("search", 140, 110, 110, BLUE) + '</g><g data-s="2">' + CT("timer", 380, 110, 110, ORANGE) + '</g>' +
            '<g data-s="3">' + CT("scales", 140, 290, 110, INK) + '</g><g data-s="4">' + CT("heart", 380, 290, 110, PINK) + '</g>'),
          say: "This is how the Anti-Bullying Alliance describes it. A one off argument still matters, it just is not usually called bullying."
        },
        {
          type: "sort",
          title: "Bullying, or a fall out?",
          q: "Made up examples. Which box? Some are tricky.",
          bins: ["Probably bullying", "A one off fall out"],
          cards: [
            { t: "Someone is left out of the group chat every day, on purpose", b: 0 },
            { t: "Two friends argue about a game, then make up", b: 1 },
            { t: "Someone keeps taking another person's lunch, all week", b: 0 },
            { t: "A rude comment once, then an apology", b: 1 },
            { t: "A group laughs at the same person every lesson", b: 0 },
            { t: "Someone is grumpy and snaps once", b: 1 }
          ],
          why: "If it is on purpose, keeps happening and is hard to stop, it is probably bullying. If you are not sure, you can still tell someone.",
          say: "Drag or call it. If people disagree, that is useful: talk about which part of the shape is missing."
        }
      ],
      check: {
        q: "Which one sounds most like bullying?",
        opts: ["Someone is picked on again and again, and can't make it stop", "Two people disagree once", "Someone has a bad day"],
        a: 0,
        why: "On purpose, again and again, and hard to stop: that is the shape of bullying.",
        say: "Repeat: you never have to be sure before you tell someone."
      }
    },
    {
      kind: "explore", part: 2, title: "Bullying can look different.", mins: 16,
      slides: [
        {
          title: "Four kinds",
          text: "It does not have to be loud to count.",
          stack: true, artWidth: 1250,
          art: S("0 0 1000 270", CT("hand", 125, 100, 120, ORANGE) + CT("speech", 375, 100, 120, PINK) + CT("people", 625, 100, 120, BLUE) + CT("phone", 875, 100, 120, INK) +
            T(125, 200, "Physical", 28, { a: "middle", f: 1 }) + T(375, 200, "Words", 28, { a: "middle", f: 1 }) + T(625, 200, "Leaving out", 28, { a: "middle", f: 1 }) + T(875, 200, "Online", 28, { a: "middle", f: 1 }) +
            T(125, 240, "pushing, taking things", 20, { a: "middle" }) + T(375, 240, "names, threats", 20, { a: "middle" }) + T(625, 240, "rumours, ignoring", 20, { a: "middle" }) + T(875, 240, "messages, posts", 20, { a: "middle" })),
          say: "Ask: which kind is hardest for adults to spot? (Usually leaving out and online.)"
        },
        {
          type: "sort",
          title: "Which kind?",
          q: "Made up examples again. Pick the best box.",
          bins: ["Physical", "Words", "Leaving out", "Online"],
          cards: [
            { t: "Hiding someone's bag again and again", b: 0 },
            { t: "Calling someone a name every day", b: 1 },
            { t: "Telling everyone not to sit with someone", b: 2 },
            { t: "Sharing a photo to laugh at someone", b: 3 },
            { t: "Spreading a made up story about someone", b: 2 },
            { t: "Mean comments under someone's game video", b: 3 }
          ],
          say: "Some fit two boxes. That is fine: it is still bullying either way."
        },
        {
          title: "Online is still real",
          text: "Online bullying can follow you home. The good news: every app has tools.",
          pts: ["<b>Screenshot</b> it, so there is proof", "<b>Block</b> and <b>report</b> it", "<b>Tell</b> an adult, even if it feels small"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", phoneMsg(260, 210, ["who even asked", "lol", "you alright?", "ignore them"], SKY) + '<g data-s="2">' + CT("padlock", 420, 330, 80, BLUE) + '</g>'),
          say: "Ask: does anyone know where the report button is on an app they use? No need to name the app."
        }
      ],
      check: {
        q: "What is a good first move if something mean happens online?",
        opts: ["Screenshot it, block it and tell an adult", "Reply with something meaner", "Delete everything and say nothing"],
        a: 0,
        why: "Proof, a block, and an adult who can help. Replying usually makes it bigger.",
        say: "Telling is not grassing. It is how things get sorted."
      }
    },
    {
      kind: "explore", part: 3, title: "From bystander to upstander.", mins: 16,
      slides: [
        {
          title: "Bystander or upstander?",
          text: "A <b>bystander</b> sees it and says nothing. An <b>upstander</b> does something, even something small.",
          art: S("0 0 560 420", A.scene(560, 420, { ground: 380, time: "day", sun: false }) + pal(130, 300, GREY, "flat", 1, "sway") + pal(280, 300, BLUE, "sad", 1) + pal(430, 300, PINK, "happy", 1, "float") +
            T(130, 410, "bystander", 22, { a: "middle", f: 1 }) + T(430, 410, "upstander", 22, { a: "middle", f: 1 }) + A.bubble(340, 90, 200, 52, "You alright?", 24)),
          say: "Make it clear: being an upstander does not mean stepping into danger."
        },
        {
          title: "Small moves count",
          text: "You do not have to be a hero. Any of these helps:",
          pts: ["<b>Say something</b>: \"Not cool. Leave it.\"", "<b>Check in</b>: \"You alright?\"", "<b>Include</b>: \"Come and sit with us.\"", "<b>Tell</b> an adult. That counts as speaking up."],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", '<g data-s="1">' + A.bubble(30, 30, 260, 56, "Not cool. Leave it.", 22) + '</g><g data-s="2">' + A.bubble(230, 120, 260, 56, "You alright?", 22) + '</g>' +
            '<g data-s="3">' + A.bubble(30, 210, 300, 56, "Come and sit with us.", 22) + '</g><g data-s="4">' + CT("people", 400, 330, 120, GREEN) + '</g>'),
          say: "Ask: which feels most doable? Telling an adult is always on the list."
        },
        {
          type: "vote",
          title: "Your line",
          q: "Which line could you actually say? Keep it in your head if you like.",
          opts: ["\"Not cool. Leave it.\"", "\"You alright?\"", "\"Come and sit with us.\"", "Tell an adult instead"],
          why: "Every one of these breaks the silence. Pick the one that fits you.",
          say: "Anyone can try saying theirs out loud, in a calm voice. Passing is fine."
        }
      ],
      check: {
        q: "Which of these is being an upstander?",
        opts: ["Quietly telling an adult what you saw", "Laughing along so you fit in", "Filming it"],
        a: 0,
        why: "Telling an adult is one of the most useful upstander moves there is.",
        say: "Filming it usually makes it worse for the person it is happening to."
      }
    },
    {
      kind: "explain", part: 4, title: "Make it: trusted adults and kind words.", mins: 18,
      slides: [
        {
          title: "Your trusted adults",
          text: "Think of two adults you could go to. Write, draw or just think the names.",
          pts: ["One in school", "One outside school", "Where you can find them each day"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", A.scene(520, 420, { ground: 380, time: "day", sun: [430, 80] }) + '<g data-s="1">' + pal(160, 290, TEAL, "happy", 1.1, "float") + '</g><g data-s="2">' + pal(360, 290, ORANGE, "happy", 1.1, "float") + '</g>'),
          say: "No one has to share names. If someone cannot think of anyone, you are a good start."
        },
        {
          type: "vote",
          title: "Pick a make",
          q: "What would you like to make? Swap, mix or just watch.",
          opts: ["A kindness poster", "A one word sign, really big", "Kind messages for a wall", "Watch and chat"],
          why: "Short, bold and kind works best.",
          say: "Go with the most taps, or let people do different ones."
        },
        {
          title: "A poster that works",
          text: "The best posters can be read from across the room:",
          pts: ["One short message", "Huge, bold letters", "One picture, not ten", "Put it where people will see it"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", '<rect x="110" y="40" width="300" height="340" rx="10" fill="#fffdf8" stroke="' + INK + '" stroke-width="5" transform="rotate(-3 260 210)"/>' +
            '<g data-s="1">' + T(260, 150, "BE THE", 48, { a: "middle", f: 1, c: BLUE }) + T(260, 210, "ONE WHO", 48, { a: "middle", f: 1, c: BLUE }) + T(260, 270, "SPEAKS UP", 48, { a: "middle", f: 1, c: PINK }) + '</g>' +
            '<g data-s="3">' + C("megaphone", 260, 330, 70, ORANGE) + '</g>'),
          say: "Easier: one word, really big. Bigger: a set of three."
        }
      ],
      check: {
        q: "Who can you tell if something is happening to you?",
        opts: ["Any adult you trust", "Nobody, you have to sort it alone", "Only your best friend"],
        a: 0,
        why: "Any adult you trust. You will not be in trouble for telling.",
        say: "Say it plainly once more. This is the most important line of the week."
      }
    },
    {
      kind: "explain", part: 5, title: "Share it: our group pledge.", mins: 12,
      slides: [
        {
          title: "What makes a room feel safe?",
          text: "Together: what makes this room feel OK to be in?",
          art: S("0 0 520 420", A.scene(520, 420, { ground: 380, time: "day", sun: [440, 80] }) + group(260, 300, [BLUE, PINK, YELLOW, GREEN], 0.95) + '<g class="pulse">' + C("heart", 260, 110, 90, PINK) + '</g>'),
          say: "Collect a few ideas out loud or on the board. Anything goes."
        },
        {
          type: "vote",
          title: "Our top line",
          q: "Which 'We...' line should go on our pledge?",
          opts: ["We include people", "We speak up, or tell someone", "We keep it kind online too", "We give people space when they need it"],
          why: "The top one goes on the pledge. Anyone who wants to can add a handprint or a signature.",
          say: "Write the winner big. Signing is optional."
        }
      ],
      check: {
        q: "What does 'Break the Silence' mean?",
        opts: ["Saying something, or telling someone, when something is not OK", "Being really loud all the time", "Never being quiet in lessons"],
        a: 0,
        why: "Breaking the silence means not letting bullying hide. Any small move counts.",
        say: "Pull it all together: spot it, say something, tell someone."
      }
    }
  ],

  realworld: {
    title: "Adults deal with this too",
    text: "Workplaces have rules about bullying. Apps have report buttons. Football clubs, game servers and colleges all have someone whose job is to sort it out. Speaking up is a skill for life.",
    art: S("0 0 560 420", A.scene(560, 420, { ground: 370, time: "day", sun: [470, 80] }) + C("clipboard", 140, 270, 110, BLUE) + C("phone", 290, 270, 110, INK) + C("ball", 440, 280, 100, PINK)),
    say: "Ask: who would you go to if this happened at a job?"
  },

  exit: [
    { q: "Bullying is usually...", opts: ["On purpose, repeated and hard to stop", "Any argument at all", "Only ever physical"], a: 0, why: "On purpose, again and again, and hard to stop." },
    { q: "What could you say when something is not OK?", opts: ["\"Not cool. Leave it.\" Or tell an adult.", "Nothing, it is not your business", "Join in"], a: 0, why: "A calm line, a check in, or telling an adult. All of them break the silence." }
  ]
};
})();
