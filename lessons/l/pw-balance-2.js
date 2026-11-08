/* ==========================================================
   Base 5 Lessons - Physical World and Exploration
   Balance and control, lesson 2 of 3: Slow is smooth
   45 minutes (Wednesday 1:15). Leads into "What helps me move".
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a", OLIVE = "#7a7f1e";

/* a rounded person. o: feet (half gap), knee (bend), arms ("out"|"down"|"up"), col, core (glow the middle) */
function kid(x, y, o){
  o = o || {};
  var f = o.feet || 18, k = o.knee || 0, col = o.col || TEAL, hip = -70 + k * 0.5;
  var g = '<g transform="translate(' + x + ' ' + y + ')">' +
    '<ellipse cx="0" cy="4" rx="' + (f + 30) + '" ry="7" fill="' + INK + '" opacity=".12"/>' +
    '<path d="M-8 ' + hip + 'L' + (-f - k * 0.3) + ' ' + (-36 + k * 0.2) + 'L' + (-f) + ' -4M8 ' + hip + 'L' + (f + k * 0.3) + ' ' + (-36 + k * 0.2) + 'L' + f + ' -4" stroke="#2c4a6b" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
    '<path d="M' + (-f - 12) + ' 0h20M' + (f - 8) + ' 0h20" stroke="' + INK + '" stroke-width="10" stroke-linecap="round"/>' +
    '<rect x="-24" y="' + (hip - 70) + '" width="48" height="80" rx="22" fill="' + col + '" stroke="' + INK + '" stroke-width="3.5"/>';
  if(o.core) g += '<ellipse class="pulse" cx="0" cy="' + (hip - 22) + '" rx="30" ry="24" fill="' + YELLOW + '" opacity=".55"/>';
  var ay = hip - 58;
  g += o.arms === "out" ? '<path d="M-20 ' + ay + 'L-78 ' + (ay + 4) + 'M20 ' + ay + 'L78 ' + (ay + 4) + '" stroke="#f1c7a1" stroke-width="12" stroke-linecap="round"/>'
    : o.arms === "up" ? '<path d="M-18 ' + ay + 'L-40 ' + (ay - 50) + 'M18 ' + ay + 'L40 ' + (ay - 50) + '" stroke="#f1c7a1" stroke-width="12" stroke-linecap="round"/>'
    : '<path d="M-22 ' + ay + 'L-30 ' + (ay + 50) + 'M22 ' + ay + 'L30 ' + (ay + 50) + '" stroke="#f1c7a1" stroke-width="12" stroke-linecap="round"/>';
  g += '<circle cx="0" cy="' + (hip - 96) + '" r="24" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3.5"/>' +
    '<path d="M-24 ' + (hip - 100) + 'q4 -26 24 -26t24 26q-10 -10 -24 -8t-24 8z" fill="#6b4423"/>' +
    '<circle cx="-8" cy="' + (hip - 94) + '" r="3.2" fill="' + INK + '"/><circle cx="8" cy="' + (hip - 94) + '" r="3.2" fill="' + INK + '"/>' +
    '<path d="M-7 ' + (hip - 84) + 'q7 6 14 0" stroke="' + INK + '" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>';
  return g;
}

window.B5LESSON = {
  id: "pw-balance-2",
  title: "Slow is smooth",
  mins: 45,
  cover: { line: "Rushing makes you wobble. Going slow makes you good. Then fast follows.", art: S("0 0 700 420", A.scene(700, 420, { ground: 380, sun: [600, 80] }) + '<g class="sway">' + kid(250, 378, { feet: 34, knee: 20, arms: "out", col: PINK }) + '</g>' + kid(450, 378, { feet: 18, arms: "down", col: OLIVE }) + A.bonnie(590, 345, 0.55)) },

  warm: {
    wordle: { word: "STEADY", hint: "Calm and not wobbly. Like Bambi, mostly.", say: "Six letters." },
    wyr: { a: "Carry a full cup of tea across a room", b: "Carry an egg on a spoon up the stairs", twist: "Both work best slowly, looking ahead, with soft knees. Same trick.", say: "Try one for real if there's a cup and a spoon handy (no tea)." }
  },

  recap: {
    items: [
      { q: "What's your base of support?", a: "The space between and under your feet." },
      { q: "Why bend your knees to balance?", a: "It lowers your centre of mass, so you're steadier." },
      { q: "How does balance get better?", a: "Practice, little and often." }
    ],
    say: "From last Wednesday."
  },

  objective: {
    formal: "explain how warming up, core strength and slow practice improve control of a movement.",
    mission: "Learn the trainers' secret: slow is smooth, and smooth gets fast.",
    success: ["Say why we warm up", "Say what your core does", "Break a skill into small steps"],
    say: "Moving about is allowed throughout."
  },

  sections: [
    {
      kind: "hook", title: "Slow is smooth, smooth is fast.", mins: 8,
      slides: [
        { title: "Slow is smooth", text: "Coaches in lots of sports say it: <b>slow is smooth, and smooth is fast</b>.", pts: ["Practise slowly and you get it right", "Get it right lots of times and it becomes smooth", "Smooth gets faster on its own"], build: true, ptsFrom: 1,
          art: S("0 0 480 400", A.scene(480, 400, { ground: 360 }) + '<g class="float">' + kid(240, 358, { feet: 30, knee: 10, arms: "out", col: TEAL }) + '</g>'),
          say: "Ask: what have you learned slowly first? (Riding a bike, a game combo, a dance.)" },
        {
          type: "predict", title: "Why slowly?",
          q: "Why do gymnasts practise new moves slowly first?",
          opts: ["So their body learns the movement exactly right", "Because they're tired", "To annoy the coach"],
          a: 0,
          why: "Your brain learns the exact pattern you practise. Practise it wobbly and fast, and you learn wobbly."
        }
      ],
      check: { q: "'Slow is smooth' means...", opts: ["Practise slowly to get it right, speed comes later", "Always move slowly", "Smooth floors are slippery"], a: 0, why: "Get it right slowly, then speed follows." }
    },
    {
      kind: "explore", title: "Warm ups and your core.", mins: 15,
      slides: [
        { title: "Your core", text: "Your <b>core</b> is the muscles round your middle: tummy, back and sides. They hold you steady while your arms and legs move.",
          art: S("0 0 480 400", A.scene(480, 400, { ground: 360, hills: false }) + kid(240, 358, { feet: 28, knee: 6, arms: "out", col: TEAL, core: true }) + T(380, 200, "core", 30, { f: 1, c: ORANGE })),
          say: "Try: stand on one leg, then gently tense your tummy. Most people wobble less." },
        {
          type: "sort", title: "Helps control, or hurts it?", q: "Sort them.",
          bins: ["Helps control", "Hurts control"],
          cards: [
            { t: "Warming up first", b: 0 }, { t: "Rushing", b: 1 }, { t: "Breaking it into small steps", b: 0 },
            { t: "Being really tired", b: 1 }, { t: "Practising little and often", b: 0 }, { t: "Not looking where you're going", b: 1 }
          ],
          say: "Ask: which one do you do most?"
        },
        {
          type: "predict", title: "Warm up",
          q: "Why warm up before moving hard?",
          opts: ["Warm muscles work better and are less likely to get hurt", "To get sweaty", "It's the law"],
          a: 0,
          why: "Warm muscles stretch and react better, so you move more smoothly and are less likely to pull something."
        }
      ],
      check: { q: "Your core is...", opts: ["The muscles round your middle", "Your heart", "An apple bit"], a: 0, why: "Tummy, back and sides. (An apple has one too.)" }
    },
    {
      kind: "explain", title: "Break it down.", mins: 10,
      slides: [
        { title: "Break it down", text: "Any tricky move can be split into small steps. A balance on one leg:", stack: true, artWidth: 1200,
          art: S("0 0 1000 300", A.scene(1000, 300, { ground: 270, sun: false, hills: false, clouds: false }) +
            '<g data-s="1">' + kid(160, 268, { feet: 30, knee: 10, arms: "down", col: PINK }) + T(160, 40, "1. Feet apart", 24, { a: "middle", f: 1 }) + '</g>' +
            '<g data-s="2">' + kid(400, 268, { feet: 30, knee: 10, arms: "out", col: PINK }) + T(400, 40, "2. Arms out", 24, { a: "middle", f: 1 }) + '</g>' +
            '<g data-s="3">' + kid(640, 268, { feet: 12, knee: 14, arms: "out", col: PINK, core: true }) + T(640, 40, "3. Core on, feet close", 24, { a: "middle", f: 1 }) + '</g>' +
            '<g data-s="4"><g class="sway">' + kid(870, 268, { feet: 4, knee: 4, arms: "out", col: PINK }) + '</g>' + T(870, 40, "4. Lift one foot", 24, { a: "middle", f: 1 }) + '</g>'),
          say: "Have a go together, step by step, if the room's up for it." },
        {
          type: "vote", title: "Your move", q: "Which would you most like to get smooth at?",
          opts: ["A football skill", "A dance move", "A climbing move", "Something else"],
          say: "Ask: what would step 1 be?"
        }
      ],
      check: { q: "Learning a tricky move is easier if you...", opts: ["Break it into small steps", "Do it all at once, fast", "Watch TV instead"], a: 0, why: "Small steps, slowly, then put them together." }
    }
  ],

  realworld: {
    title: "Control is everywhere",
    text: "Carrying a tray of drinks. Skateboarding. Getting off a moving bus. Footballers, dancers, surgeons and builders all practise slowly first.",
    art: S("0 0 560 400", A.scene(560, 400, { ground: 360, time: "dusk", sun: [460, 80] }) + '<g class="sway">' + kid(220, 358, { feet: 30, knee: 16, arms: "out", col: ORANGE }) + '</g>' + I("bike", 420, 340, 1.4)),
    say: "Ask: who's the most in control person you know?"
  },

  exit: [
    { q: "Slow is smooth, and smooth is...", opts: ["Fast", "Boring"], a: 0, why: "Fast: speed comes from getting it right." },
    { q: "Warming up helps because...", opts: ["Warm muscles work better", "It's fun to sweat"], a: 0, why: "Warm muscles work better and get hurt less." },
    { q: "Your core is...", opts: ["Muscles round your middle", "Your elbows"], a: 0, why: "Tummy, back and sides." }
  ],

  driving: {
    angle: "If you could time travel and learn a skill from the best person in history, who would you pick? Should you, if it means skipping the slow practice?",
    opts: ["Yes, skip to good", "No, the practice is the point", "Pass"],
    say: "Ask: what do you lose by skipping the slow bit?"
  },

  surprise: { at: "sections.1.slides.0", kind: "bambi", x: 1460, y: 580, w: 120, say: "Bambi has excellent core strength. She has never once wobbled. She would like that noted." }
};
})();
