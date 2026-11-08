/* ==========================================================
   Base 5 Lessons - Physical World and Exploration
   Balance and control, lesson 3 of 3: Three points of contact
   45 minutes (Tuesday 1:15). Leads into "What helps me move".
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, I = A.icon, INK = "#0a2f38", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a", WOOD = "#b5793f";
var BELAY = { src: "https://commons.wikimedia.org/wiki/Special:FilePath/Belaying8.jpg?width=800", alt: "A climber on a rope with a belayer below", caption: "On the wall for real", credit: "Photo: Wikimedia Commons, CC BY-SA 3.0" };

/* a climber on a wall: which limbs are on holds (lh, rh, lf, rf), one lifted */
function climber(x, y, on){
  var hold = function(cx, cy, c, lit){ return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="16" ry="11" fill="' + c + '" stroke="' + INK + '" stroke-width="2.5"/>' + (lit ? '<circle class="pulse" cx="' + cx + '" cy="' + cy + '" r="22" fill="none" stroke="' + YELLOW + '" stroke-width="5"/>' : ""); };
  var lh = [x - 60, y - 130], rh = [x + 60, y - 150], lf = [x - 40, y + 30], rf = [x + 45, y + 10];
  var g = hold(lh[0], lh[1], PINK, on.lh) + hold(rh[0], rh[1], ORANGE, on.rh) + hold(lf[0], lf[1], TEAL, on.lf) + hold(rf[0], rf[1], YELLOW, on.rf) +
    hold(x + 90, y - 230, PINK) + hold(x - 90, y - 210, TEAL);
  var reach = function(p, ok, lift){ return ok ? p : [p[0] + lift[0], p[1] + lift[1]]; };
  var a = reach(lh, on.lh, [-10, -60]), b = reach(rh, on.rh, [20, -70]), c = reach(lf, on.lf, [-20, -40]), d = reach(rf, on.rf, [20, -40]);
  g += '<path d="M' + (x - 14) + ' ' + (y - 80) + 'L' + a[0] + ' ' + a[1] + 'M' + (x + 14) + ' ' + (y - 80) + 'L' + b[0] + ' ' + b[1] + '" stroke="#f1c7a1" stroke-width="13" stroke-linecap="round"/>' +
    '<path d="M' + (x - 10) + ' ' + (y - 20) + 'L' + c[0] + ' ' + c[1] + 'M' + (x + 10) + ' ' + (y - 20) + 'L' + d[0] + ' ' + d[1] + '" stroke="#2c4a6b" stroke-width="15" stroke-linecap="round"/>' +
    '<rect x="' + (x - 24) + '" y="' + (y - 96) + '" width="48" height="84" rx="22" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="3.5"/>' +
    '<circle cx="' + x + '" cy="' + (y - 122) + '" r="24" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3.5"/><path d="M' + (x - 26) + ' ' + (y - 126) + 'q26 -40 52 0z" fill="' + ORANGE + '" stroke="' + INK + '" stroke-width="3"/>' +
    '<circle cx="' + (x - 8) + '" cy="' + (y - 118) + '" r="3.2" fill="' + INK + '"/><circle cx="' + (x + 8) + '" cy="' + (y - 118) + '" r="3.2" fill="' + INK + '"/>';
  return g;
}
function wallBg(w, h){ return '<rect width="' + w + '" height="' + h + '" fill="#d7cbb4"/><path d="M0 ' + (h * 0.33) + 'H' + w + 'M0 ' + (h * 0.66) + 'H' + w + 'M' + (w * 0.33) + ' 0V' + h + 'M' + (w * 0.66) + ' 0V' + h + '" stroke="#c4b79c" stroke-width="3"/>'; }

window.B5LESSON = {
  id: "pw-balance-3",
  title: "Three points of contact",
  mins: 45,
  cover: { line: "Two hands, two feet, and one simple rule that keeps climbers (and builders on ladders) safe.", art: S("0 0 600 440", wallBg(600, 440) + '<g class="float">' + climber(300, 330, { lh: 1, rh: 0, lf: 1, rf: 1 }) + '</g>') },

  warm: {
    wordle: { word: "GRIP", hint: "Four letters. What your hands do on a climbing hold.", say: "Only four letters." },
    wyr: { a: "Climb a wall with only your legs", b: "Climb a wall with only your arms", twist: "Legs-only is closer to how good climbers climb: legs are much stronger than arms, so they push and arms mostly steady.", say: "Ask why." }
  },

  recap: {
    items: [
      { q: "Slow is smooth, and smooth is...", a: "Fast." },
      { q: "What's your core?", a: "The muscles round your middle that keep you steady." },
      { q: "On a climbing wall, what does 'Take!' mean?", a: "Hold me on the rope so I can rest." }
    ],
    say: "From the last few Tuesdays."
  },

  objective: {
    formal: "use the three points of contact rule and good technique to stay balanced while climbing.",
    mission: "Learn how climbers stay glued to the wall without being superheroes.",
    success: ["Explain three points of contact", "Say why legs do the hard work", "Spot good climbing habits"],
    say: "Read the mission."
  },

  sections: [
    {
      kind: "hook", title: "Three on, one moves.", mins: 8,
      slides: [
        { title: "Three points of contact", text: "Keep <b>three</b> of your hands and feet on holds. Move <b>one</b> at a time.", pts: ["Three on: you're steady", "One moves to the next hold", "Then it's three on again"], build: true, ptsFrom: 1,
          art: S("0 0 480 440", wallBg(480, 440) + climber(240, 330, { lh: 1, rh: 0, lf: 1, rf: 1 })), photo: BELAY,
          say: "The glowing holds are the three in contact. The right hand is reaching. Tap the photo to make it bigger." },
        {
          type: "predict", title: "Stronger?",
          q: "Which are stronger: your arms or your legs?",
          opts: ["Legs, by a long way", "Arms", "Exactly the same"],
          a: 0,
          why: "Your legs carry you around all day. Good climbers push up with their legs and use their arms mostly to stay close to the wall."
        }
      ],
      check: { q: "Three points of contact means...", opts: ["Three of your hands and feet on holds at once", "Touching the wall three times", "Three climbers at once"], a: 0, why: "Three on, one moves." }
    },
    {
      kind: "explore", title: "Good habits on the wall.", mins: 15,
      slides: [
        {
          type: "sort", title: "Good habit or not so good?", q: "Sort the climbing habits.",
          bins: ["Good habit", "Not so good"],
          cards: [
            { t: "Three points of contact", b: 0 }, { t: "Moving two limbs at once", b: 1 },
            { t: "Pushing up with your legs", b: 0 }, { t: "Hanging on bent arms", b: 1 },
            { t: "Resting on straight arms", b: 0 }, { t: "Rushing to the top", b: 1 }
          ],
          say: "Straight arms rest: your bones take the weight instead of your muscles."
        },
        {
          type: "predict", title: "Tired arms",
          q: "Your arms are burning halfway up. Best move?",
          opts: ["Straighten your arms and rest, or shout 'Take!'", "Grip harder", "Let go without telling anyone"],
          a: 0,
          why: "Straight arms rest your muscles. Or say 'Take!' and sit back in the harness. Coming down is always allowed too."
        },
        { title: "Look down for your feet", text: "Beginners look up for the next hand hold. Climbers look down for the next foot hold.",
          art: S("0 0 480 440", wallBg(480, 440) + climber(240, 300, { lh: 1, rh: 1, lf: 1, rf: 0 }) + '<path class="dash" d="M300 160Q360 240 300 330" stroke="' + ORANGE + '" stroke-width="5" fill="none"/>'),
          say: "Ask someone to step up onto a low step without using their hands: that's the legs doing it." }
      ],
      check: { q: "Which rests your arms best?", opts: ["Straight arms", "Bent arms"], a: 0, why: "Straight arms: your skeleton holds the weight." }
    },
    {
      kind: "explain", title: "The same rule, everywhere.", mins: 10,
      slides: [
        { title: "Not just climbing", text: "The three points of contact rule is used:", pts: ["On ladders at work: two feet and a hand", "Getting in and out of lorries and tractors", "On climbing frames and rocky paths"], build: true, ptsFrom: 1,
          art: S("0 0 480 420", A.scene(480, 420, { ground: 390 }) + '<path d="M180 390L250 40M300 390L370 40" stroke="' + WOOD + '" stroke-width="10"/>' + [80, 150, 220, 290, 360].map(function(yy){ return '<path d="M' + (180 + (390 - yy) * 0.2) + ' ' + yy + 'H' + (300 + (390 - yy) * 0.2) + '" stroke="' + WOOD + '" stroke-width="8"/>'; }).join("") + A.bird(420, 80, 0.8)),
          say: "Health and safety rules at work say exactly this for ladders." },
        {
          type: "vote", title: "Ready?", q: "Would you give a climbing wall a go now?",
          opts: ["Yes", "Maybe, with someone I trust", "Bottom bit only", "Not for me"],
          say: "All four are fine."
        }
      ],
      check: { q: "On a ladder, three points of contact means...", opts: ["Two feet and a hand on the ladder", "Three ladders", "Climbing with your eyes shut"], a: 0, why: "Two feet and a hand, always." }
    }
  ],

  realworld: {
    title: "Grip, push, steady",
    text: "Climbing walls, ladders, getting onto a bus, scrambling up a rocky path on a walk. Three on, one moves, legs do the work.",
    art: S("0 0 560 440", wallBg(560, 440) + '<g class="float">' + climber(280, 330, { lh: 1, rh: 1, lf: 0, rf: 1 }) + '</g>'),
    say: "End of the balance series."
  },

  exit: [
    { q: "How many points of contact should stay on?", opts: ["Three", "One", "None"], a: 0, why: "Three on, one moves." },
    { q: "Who does the hard work: arms or legs?", opts: ["Legs", "Arms"], a: 0, why: "Legs push, arms steady." },
    { q: "Arms tired: best move?", opts: ["Straight arms or 'Take!'", "Grip harder"], a: 0, why: "Rest on straight arms or ask to be held." }
  ],

  driving: {
    angle: "If you could time travel to the first ever climb of a famous mountain, would you go along? What would you take with you from now?",
    opts: ["Go, and take modern kit", "Go, but only with their kit", "Stay on the ground"],
    say: "Ask: is it fair to take modern kit?"
  },

  surprise: { at: "sections.1.slides.2", kind: "bonnie", x: 1460, y: 700, w: 110, say: "Bonnie's three points of contact: sofa, cushion, your lap." }
};
})();
