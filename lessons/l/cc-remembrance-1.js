/* ==========================================================
   Lessons - Cultural Calendar: Remembrance (9 to 13 November 2026)
   Remembrance, Service and Giving: Armistice Day (Wednesday 11th)
   and BBC Children in Need (Friday 13th).
   Five 30 minute parts, one each morning at 10:00:
     1 Monday hook, 2 Tuesday explore, 3 Wednesday dig deeper
     (Armistice Day), 4 Thursday make, 5 Friday share and finish.
   Whole school: any base can teach it from /cc/, so the words
   are neutral ("your teacher", no Base 5 in jokes).
   Shape as /lessons/l/rel-assert-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, C = A.cci, INK = "#0a2f38";
var RED = "#c8102e", DARK = "#7d0f12", CREAM = "#fff7ec", GREEN = "#2f6b3a", PURPLE = "#6a3d9a", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247";

/* a poppy: four petals, a dark middle and a leaf */
function poppy(x, y, s, cls){
  s = s || 1;
  return '<g' + (cls ? ' class="' + cls + '"' : "") + '><g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<path d="M0 10 Q-4 40 2 70" stroke="' + GREEN + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<path d="M2 50 q18 -14 30 -6 q-14 14 -30 6z" fill="' + GREEN + '"/>' +
    '<ellipse cx="-18" cy="-12" rx="24" ry="20" fill="' + RED + '" transform="rotate(-20 -18 -12)"/>' +
    '<ellipse cx="18" cy="-12" rx="24" ry="20" fill="' + RED + '" transform="rotate(20 18 -12)"/>' +
    '<ellipse cx="-14" cy="12" rx="22" ry="18" fill="#a50d24"/>' +
    '<ellipse cx="14" cy="12" rx="22" ry="18" fill="#a50d24"/>' +
    '<circle cx="0" cy="0" r="11" fill="' + INK + '"/><circle cx="-3" cy="-3" r="3" fill="#3b4b4f"/></g></g>';
}
function coloured(x, y, s, col, mid){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<ellipse cx="-16" cy="-10" rx="22" ry="18" fill="' + col + '" stroke="' + INK + '" stroke-width="2.5" transform="rotate(-20 -16 -10)"/>' +
    '<ellipse cx="16" cy="-10" rx="22" ry="18" fill="' + col + '" stroke="' + INK + '" stroke-width="2.5" transform="rotate(20 16 -10)"/>' +
    '<ellipse cx="-12" cy="12" rx="20" ry="16" fill="' + col + '" stroke="' + INK + '" stroke-width="2.5"/>' +
    '<ellipse cx="12" cy="12" rx="20" ry="16" fill="' + col + '" stroke="' + INK + '" stroke-width="2.5"/>' +
    '<circle cx="0" cy="0" r="10" fill="' + (mid || INK) + '"/></g>';
}
function field(w, h, n){
  var g = A.scene(w, h, { ground: h - 70, time: "dusk", sun: [w - 120, 90], hills: true, clouds: false });
  for(var i = 0; i < n; i++){
    var x = 40 + (i * 97) % (w - 60), y = h - 40 - (i * 37) % 60, s = 0.35 + ((i * 13) % 10) / 40;
    g += poppy(x, y, s, i % 3 === 0 ? "sway" : "");
  }
  return g;
}
/* a clock face at 11 o'clock */
function clock11(x, y, r){
  return '<g transform="translate(' + x + ' ' + y + ')"><circle r="' + r + '" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="5"/>' +
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function(i){ var a = i * Math.PI / 6; return '<circle cx="' + (Math.sin(a) * r * 0.8).toFixed(1) + '" cy="' + (-Math.cos(a) * r * 0.8).toFixed(1) + '" r="' + (i % 3 ? 3 : 5) + '" fill="' + INK + '"/>'; }).join("") +
    '<path d="M0 0L' + (Math.sin(-Math.PI / 6) * r * 0.5).toFixed(1) + ' ' + (-Math.cos(-Math.PI / 6) * r * 0.5).toFixed(1) + '" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/>' +
    '<path d="M0 0V' + (-r * 0.72).toFixed(1) + '" stroke="' + RED + '" stroke-width="5" stroke-linecap="round"/><circle r="7" fill="' + INK + '"/></g>';
}
/* a stone memorial with lines for names */
function memorial(x, y, s){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
    '<path d="M-90 0h180v-24h-20v-150l-20 -40h-100l-20 40v150h-20z" fill="#d9d2c3" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
    '<path d="M-14 -200h28v-30h-28z" fill="#d9d2c3" stroke="' + INK + '" stroke-width="4"/>' +
    [0, 1, 2, 3, 4, 5].map(function(i){ return '<path d="M-48 ' + (-150 + i * 20) + 'h' + (70 + (i % 3) * 13) + '" stroke="#8a8478" stroke-width="5" stroke-linecap="round"/>'; }).join("") +
    poppy(-60, -12, 0.45) + poppy(-20, -8, 0.42) + poppy(30, -10, 0.45) + '</g>';
}
/* giving now: a heart held in two hands, with sparkles */
function giving(x, y, s){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' + C("hands", 0, 40, 150, ORANGE) +
    '<g class="pulse">' + C("heart", 0, -40, 110, "#e2557a") + '</g>' + C("star", -90, -90, 40, YELLOW) + C("star", 90, -70, 32, YELLOW) + '</g>';
}

window.B5LESSON = {
  id: "cc-remembrance-1",
  title: "Remembrance",
  mins: 30,
  startMins: 5,
  finishMins: 6,
  cover: {
    line: "How do you say thank you to people you never met? Five mornings, one big question.",
    art: A.ccScene("remembrance") || S("0 0 700 420", field(700, 420, 12))
  },

  /* Monday's warm up */
  warm: {
    wordle: { word: "POPPY", hint: "A red flower you will see on coats and buildings all week.", say: "If it stalls, give the clue. It is a quick one." }
  },
  /* a warm up for each later morning */
  warms: {
    2: { wyr: { a: "Be able to talk to animals", b: "Be able to talk to anyone from 100 years ago",
      twist: "Today is about both, as it happens: people from long ago, and some very brave animals.", say: "Tap a side for each person. No reasons needed." } },
    3: { wordle: { word: "QUIET", hint: "What lots of the country goes at 11 o'clock today.", say: "Today is Armistice Day. Keep the warm up light." } },
    4: { wyr: { a: "Make something with your hands", b: "Write or say something kind",
      twist: "Today you can do either. Or both. Or just watch.", say: "This leads straight into today's choice." } },
    5: { wordle: { word: "SPOTS", hint: "Lots of people wear these today, for Children in Need.", say: "Children in Need is tonight." } }
  },

  objective: {
    formal: "understand why people remember, and some ways to say thank you to people we never met.",
    mission: "Crack the poppy code, get ready for Wednesday's silence, and pick a way to say thank you.",
    success: [
      "Say why the poppy is the symbol",
      "Say what happens at 11 o'clock on 11 November",
      "Pick a way to say thank you, if I want to"
    ],
    say: "Read the mission. Everyone takes part in their own way: watching counts."
  },

  sections: [
    {
      kind: "hook", part: 1, title: "Why is everyone wearing a flower?", mins: 14,
      slides: [
        {
          title: "Spot it this week",
          text: "Coats, buses, shop windows, football shirts. One little red flower everywhere.",
          art: S("0 0 560 420", field(560, 420, 9) + poppy(280, 210, 1.6, "float")),
          say: "Ask: who has seen one already this week? Where?"
        },
        {
          type: "predict",
          title: "Why a poppy?",
          q: "Out of every flower, why did people pick this one?",
          opts: ["It grew on the battlefields of the First World War", "It is the national flower of Britain", "It was the King's favourite"],
          a: 0,
          why: "After the fighting, poppies grew all over the churned up fields in Belgium and France. Soldiers noticed them. The flower became the way to remember the people who died there.",
          say: "Votes first, then reveal. The national flower of England is actually the rose."
        },
        {
          title: "Eleven, eleven, eleven",
          text: "The First World War stopped at a very exact time.",
          pts: ["The <b>11th</b> hour", "of the <b>11th</b> day", "of the <b>11th</b> month, in 1918"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", clock11(260, 200, 150) + '<g data-s="4">' + T(260, 400, "11 November", 34, { a: "middle", f: 1, c: RED }) + '</g>'),
          say: "The agreement to stop fighting was called the Armistice. That is why Wednesday is called Armistice Day."
        },
        {
          type: "vote",
          title: "This week",
          q: "Which bit of the week sounds most like you?",
          opts: ["The two minute silence", "Making something", "Finding out about the animals", "Children in Need on Friday"],
          why: "There is a bit of all of these coming up, one each morning.",
          say: "No wrong answers. This just helps you know who to hand what to."
        }
      ],
      check: {
        q: "What happens at 11 o'clock on 11 November?",
        opts: ["Lots of the country stops for two minutes of silence", "Everyone has an early lunch", "The clocks go back"],
        a: 0,
        why: "At 11 o'clock, lots of people stop and stay quiet for two minutes, to remember.",
        say: "Mention that the silence is on Wednesday, after this session."
      }
    },
    {
      kind: "explore", part: 2, title: "Who do we remember?", mins: 16,
      slides: [
        {
          title: "Not just soldiers",
          text: "Remembrance is for everyone who served and everyone affected:",
          pts: ["Soldiers, sailors and air crew", "Nurses, doctors and ambulance drivers", "People from all over the world, like the more than a million soldiers from India", "Families waiting at home"],
          build: true, ptsFrom: 1,
          art: S("0 0 560 420", A.scene(560, 420, { ground: 360, time: "day", sun: [480, 80] }) +
            C("helmet", 140, 190, 110, DARK) + C("cross", 280, 170, 110, RED) + C("globe", 420, 190, 110, TEAL) + '<g data-s="4">' + C("people", 280, 320, 110, INK) + '</g>'),
          say: "Soldiers came from India, Africa, the Caribbean and across the world. Ask: did anyone know that?"
        },
        {
          title: "Animals served too",
          text: "Horses pulled guns and carts. Dogs carried messages and found the injured. Pigeons flew messages home when nothing else could get through.",
          art: S("0 0 560 420", A.scene(560, 420, { ground: 370, time: "dusk", sun: [90, 90] }) +
            C("horse", 160, 300, 150, "#6b4423") + C("paw", 400, 320, 90, INK) + '<g class="float">' + A.bird(380, 130, 1.3) + '</g>'),
          say: "A pigeon called Cher Ami was given a medal for carrying a message that saved soldiers' lives. Animals still get medals today: the Dickin Medal."
        },
        {
          type: "sort",
          title: "Not every poppy is red",
          q: "Match each poppy to what it stands for. Guess if you need to.",
          bins: ["Red poppy", "White poppy", "Purple poppy"],
          cards: [
            { t: "Remembers the armed forces", b: 0 },
            { t: "Sold by the Royal British Legion since 1921", b: 0 },
            { t: "Stands for peace", b: 1 },
            { t: "Hopes for a world with no more wars", b: 1 },
            { t: "Remembers the animals", b: 2 },
            { t: "For horses, dogs and pigeons", b: 2 }
          ],
          why: "People pick the one that means most to them. Some wear two.",
          say: "Drag or call it. All three are fine to wear: it is a personal choice."
        },
        {
          title: "Three poppies",
          text: "Which would you wear? You do not have to choose.",
          stack: true, artWidth: 1150,
          art: S("0 0 900 300", coloured(170, 130, 2, RED) + coloured(450, 130, 2, "#fffdf8", GREEN) + coloured(730, 130, 2, PURPLE) +
            T(170, 270, "Red: remembering", 26, { a: "middle", f: 1 }) + T(450, 270, "White: peace", 26, { a: "middle", f: 1 }) + T(730, 270, "Purple: animals", 26, { a: "middle", f: 1 })),
          say: "Quick hands up or a tap each, if anyone fancies it."
        }
      ],
      check: {
        q: "Which animals carried messages in the First World War?",
        opts: ["Pigeons and dogs", "Cats and goldfish", "Parrots"],
        a: 0,
        why: "Pigeons and dogs both carried messages. Horses did a lot of the heavy pulling.",
        say: "Let them enjoy the goldfish option."
      }
    },
    {
      kind: "explore", part: 3, title: "Armistice Day: the two minute silence.", mins: 16,
      slides: [
        {
          title: "Today at 11 o'clock",
          text: "At 11 o'clock, lots of the country stops for two minutes. Shops, stations, schools, even some motorway services.",
          pts: ["Stay still and quiet, if you can", "Fidgets, sitting, eyes open: all fine", "Think about anyone: people who served, or someone you miss"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", clock11(260, 190, 140) + '<g data-s="3">' + poppy(420, 330, 0.8, "sway") + '</g>'),
          say: "Talk through how your group will do it. Some students find silence hard: a quiet fidget or stepping out calmly is fine."
        },
        {
          type: "vote",
          title: "In the silence",
          q: "What might you think about? Keep it in your head if you prefer.",
          opts: ["People who served", "Someone I miss", "Just staying calm", "Pass"],
          why: "Any of these is a good way to spend two minutes. Passing is a good answer too.",
          say: "No one has to share who or why. Tap only if people want to."
        },
        {
          title: "Memorials everywhere",
          text: "Almost every town and village has a war memorial with names on it. People lay wreaths there on Remembrance Sunday.",
          art: S("0 0 560 420", A.scene(560, 420, { ground: 380, time: "dusk", sun: [460, 80], clouds: false }) + memorial(280, 380, 1.4)),
          say: "Ask: does anyone know where the nearest one is? Lots are in a park, a churchyard or by the high street."
        },
        {
          type: "sort",
          title: "Ways people remember",
          q: "Sound, sight or silence?",
          bins: ["Something you hear", "Something you see", "Something you do quietly"],
          cards: [
            { t: "The Last Post played on a bugle", b: 0 },
            { t: "Church bells", b: 0 },
            { t: "A wreath of poppies", b: 1 },
            { t: "Names on a memorial", b: 1 },
            { t: "Two minutes of silence", b: 2 },
            { t: "Thinking about someone", b: 2 }
          ],
          say: "Some could go in two boxes. Arguing about it is fine."
        }
      ],
      check: {
        q: "Why do people stay silent for two minutes?",
        opts: ["To remember and show respect", "Because they are told off", "To save electricity"],
        a: 0,
        why: "The silence is a way of saying thank you, and of remembering, together.",
        say: "Remind everyone of the plan for 11 o'clock."
      }
    },
    {
      kind: "explain", part: 4, title: "Make it: a way to say thank you.", mins: 18,
      slides: [
        {
          type: "vote",
          title: "Pick a make",
          q: "Which would you like to try? You can swap, mix or just watch.",
          opts: ["A poppy artwork", "A thank you to someone who helps", "A poppy field, as a group", "Watch and chat"],
          why: "All four count. Pick what feels good today.",
          say: "Go with the most taps, or let people do different ones."
        },
        {
          title: "A poppy artwork",
          text: "Paper, paint or the doodle pad all work:",
          pts: ["Four red petals, overlapping", "A black middle", "A green stalk and a leaf", "Add it to the group's display, or keep it"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", '<g data-s="1">' + coloured(260, 170, 2.4, RED, "none") + '</g><g data-s="2"><circle cx="260" cy="170" r="24" fill="' + INK + '"/></g><g data-s="3"><path d="M262 220q-6 80 4 170" stroke="' + GREEN + '" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M264 320q40 -30 70 -14q-30 30 -70 14z" fill="' + GREEN + '"/></g>'),
          say: "Easier: colour a poppy outline. Bigger: a whole poppy field as a group."
        },
        {
          title: "A thank you that lands",
          text: "Think of someone who helps every day: a cook, a cleaner, a driver, a nurse, a crossing patrol.",
          pts: ["Say who it is for", "Say one thing they do", "Say thank you. Short is perfect"],
          build: true, ptsFrom: 1,
          art: S("0 0 520 420", '<rect x="90" y="70" width="340" height="250" rx="18" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="5"/>' +
            '<path d="M90 90l170 120l170 -120" stroke="' + INK + '" stroke-width="5" fill="none" stroke-linejoin="round"/>' + poppy(400, 300, 0.6) +
            '<g data-s="3">' + A.bubble(150, 340, 230, 52, "Thank you!", 26) + '</g>'),
          say: "Writing, drawing or saying it out loud all count. They can hand it over later, or not."
        },
        {
          title: "People who serve today",
          text: "Remembering is also about the people keeping us safe now.",
          stack: true, artWidth: 1250,
          art: S("0 0 1000 260", C("helmet", 120, 110, 120, "#d63b2f") + C("cross", 320, 110, 120, "#1e9e5a") + C("anchor", 520, 110, 120, TEAL) + C("shield", 720, 110, 120, "#3f6f8f") + C("hands", 900, 110, 120, ORANGE) +
            T(120, 220, "Firefighters", 24, { a: "middle", f: 1 }) + T(320, 220, "Paramedics", 24, { a: "middle", f: 1 }) + T(520, 220, "Lifeboat crews", 24, { a: "middle", f: 1 }) + T(720, 220, "Armed forces", 24, { a: "middle", f: 1 }) + T(900, 220, "Volunteers", 24, { a: "middle", f: 1 })),
          say: "Most lifeboat crews are volunteers. Ask: which job would you pick?"
        }
      ],
      check: {
        q: "Which of these is a way of saying thank you to people you never met?",
        opts: ["Wearing a poppy", "Ignoring it all", "Only saying it to people you know"],
        a: 0,
        why: "A poppy, a silence, a visit to a memorial: all ways of saying thank you to people you never met.",
        say: "Pull the week's question back up: how do you say thank you to people you never met?"
      }
    },
    {
      kind: "explain", part: 5, title: "Giving now: Children in Need.", mins: 12,
      slides: [
        {
          title: "Tonight: Children in Need",
          text: "Remembrance looks back. Children in Need helps right now: money raised goes to projects for children and young people all over the UK.",
          art: S("0 0 520 420", A.scene(520, 420, { ground: 370, time: "day", sun: [440, 80] }) + giving(260, 200, 1.3)),
          say: "The appeal show is on BBC One tonight. Ask: has anyone done something for it before?"
        },
        {
          type: "vote",
          title: "A silly, safe challenge",
          q: "If your group did a Children in Need challenge, which one?",
          opts: ["Odd socks day", "A sponsored silence", "A nut free bake sale", "Wear something spotty"],
          why: "Any of these works. Check with your teacher before planning a real one.",
          say: "Just for fun unless your base is actually doing one."
        }
      ],
      check: {
        q: "What is the difference between Remembrance and Children in Need?",
        opts: ["One remembers the past, one helps people now", "They are the same thing", "One is only for adults"],
        a: 0,
        why: "Remembrance says thank you for the past. Children in Need gives to people now. Both are about caring for people you may never meet.",
        say: "This links straight to the week's big question."
      }
    }
  ],

  realworld: {
    title: "Remembering, everywhere",
    text: "A minute's silence before a football match. A poppy on a lapel. Names on a bench. A wreath at the memorial. Once you know what they mean, you start noticing them.",
    art: S("0 0 560 420", A.scene(560, 420, { ground: 370, time: "dusk", sun: [460, 90] }) + C("ball", 140, 300, 90, INK) + memorial(330, 370, 0.9) + poppy(480, 330, 0.7, "sway")),
    say: "Ask: where have you seen one of these?"
  },

  exit: [
    { q: "Why is the poppy the symbol of Remembrance?", opts: ["It grew on the battlefields", "It smells nice", "It is easy to draw"], a: 0, why: "Poppies grew where the fighting had been, so they became the way to remember." },
    { q: "How do you say thank you to people you never met?", opts: ["A silence, a poppy or a thank you to someone who helps now", "You can't", "Only with money"], a: 0, why: "Remembering them, and helping people now, both count." }
  ]
};
})();
