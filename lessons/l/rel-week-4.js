/* ==========================================================
   Base 5 Lessons - Relational (PSHE and RSE)
   Autumn 2 Week 4 (23 to 27 Nov 2026): Self Respect
   From the trust plan (26/27 SB Relational Pillar), Tier 1 on the
   board for everyone, "Going further" slides for Tiers 2 and 3.
   Full tier plan: /lessons/notes.html?l=rel-week-4
   Split over the week's three 15 minute PHSE slots:
     part 1 (Monday) hook, part 2 (Thursday) explore,
     part 3 (Friday) explain and the finish.
   Shape as /lessons/l/ac-arch-1.js. ASCII only.
   ========================================================== */
(function(){
var A = window.LART, S = A.svg, T = A.T, INK = "#0a2f38";
var PURPLE = "#6a5acd", TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a", GREEN = "#3f9a5a", CREAM = "#fffdf8";

/* a teenager: hoodie colour, skin, hair, and a mood */
function kid(x, y, s, o){
  o = o || {};
  var skin = o.skin || "#f1c7a1", hair = o.hair || "#4a2c17", top = o.top || TEAL, m = o.mood || "ok";
  var mouth = m === "sad" ? '<path d="M-8 18q8 -7 16 0" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/>'
    : m === "cross" ? '<path d="M-8 16h16" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/><path d="M-16 -6l9 4M16 -6l-9 4" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>'
    : m === "talk" ? '<ellipse cx="0" cy="16" rx="6" ry="5" fill="' + INK + '"/>'
    : '<path d="M-9 13q9 9 18 0" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
  var back = o.long ? '<path d="M-34 -4q-4 -40 34 -40t34 40v48q-10 4 -18 -2v-40h-32v40q-8 6 -18 2z" fill="' + hair + '" stroke="' + INK + '" stroke-width="3"/>' : "";
  var hairShape = o.long ? '<path d="M-30 -6q-2 -32 30 -32t30 32q-14 -16 -32 -14q-14 2 -28 14z" fill="' + hair + '"/>'
    : '<path d="M-29 -4q-2 -34 29 -34t29 34q-10 -14 -29 -14t-29 14z" fill="' + hair + '"/>';
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
    '<ellipse cx="0" cy="128" rx="44" ry="8" fill="' + INK + '" opacity=".14"/>' +
    '<path d="M-36 124v-56q0 -30 36 -30t36 30v56z" fill="' + top + '" stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round"/>' +
    '<path d="M-12 40q12 14 24 0" stroke="' + INK + '" stroke-width="3" fill="none" opacity=".5"/>' +
    back + '<circle cx="0" cy="0" r="30" fill="' + skin + '" stroke="' + INK + '" stroke-width="3.5"/>' + hairShape +
    '<circle cx="-10" cy="2" r="3.6" fill="' + INK + '"/><circle cx="10" cy="2" r="3.6" fill="' + INK + '"/>' + mouth + '</g>';
}
/* a speech bubble with one or two lines, tail at bottom left or right */
function talk(x, y, w, lines, o){
  o = o || {};
  var h = 26 + lines.length * 34, tx = o.right ? w - 56 : 34;
  return '<g transform="translate(' + x + ' ' + y + ')"' + (o.s ? ' data-s="' + o.s + '"' : "") + '>' +
    '<path d="M' + tx + ' ' + (h - 2) + 'l' + (o.right ? 16 : -6) + ' 26l' + (o.right ? 8 : 26) + ' -26z" fill="' + (o.fill || CREAM) + '" stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round"/>' +
    '<rect width="' + w + '" height="' + h + '" rx="18" fill="' + (o.fill || CREAM) + '" stroke="' + INK + '" stroke-width="3.5"/>' +
    '<rect x="' + (tx - 2) + '" y="' + (h - 6) + '" width="32" height="8" fill="' + (o.fill || CREAM) + '"/>' +
    lines.map(function(l, i){ return T(w / 2, 44 + i * 34, l, o.size || 26, { a: "middle", b: 1 }); }).join("") + '</g>';
}
function ball(x, y, r){ return '<g transform="translate(' + x + ' ' + y + ')"><circle r="' + r + '" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="3"/><path d="M0 -' + (r * 0.45) + 'l' + (r * 0.43) + ' ' + (r * 0.31) + 'l-' + (r * 0.17) + ' ' + (r * 0.5) + 'h-' + (r * 0.52) + 'l-' + (r * 0.17) + ' -' + (r * 0.5) + 'z" fill="' + INK + '"/></g>'; }
function sketchbook(x, y){ return '<g transform="translate(' + x + ' ' + y + ') rotate(-8)"><rect x="-34" y="-26" width="68" height="52" rx="5" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="3"/><path d="M-22 10q10 -24 22 -6t20 -10" stroke="' + PINK + '" stroke-width="4" fill="none"/><circle cx="16" cy="-12" r="6" fill="' + YELLOW + '"/></g>'; }


/* three (or four) round tiles with a label each: items [[label, inner svg], ...] */
function tiles(items){
  var w = 300 * items.length, g = "";
  items.forEach(function(it, i){
    var cx = 150 + i * 300, n = i + 1;
    g += '<g data-s="' + n + '"><g class="float" style="animation-delay:-' + n + 's"><circle cx="' + cx + '" cy="128" r="92" fill="' + INK + '"/><circle cx="' + cx + '" cy="120" r="92" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<circle cx="' + cx + '" cy="120" r="78" fill="' + PURPLE + '" opacity=".13"/><g transform="translate(' + cx + ' 120)">' + it[1] + '</g></g>' + T(cx, 262, it[0], 34, { a: "middle", f: 1 }) + '</g>';
  });
  return S("0 0 " + w + " 290", g);
}
/* little drawings for the tiles, each about 120 across, centred on 0 0 */
var ICON = {
  clash: '<g transform="translate(-26 -10) rotate(-8)"><rect x="-40" y="-30" width="80" height="50" rx="14" fill="' + ORANGE + '" stroke="' + INK + '" stroke-width="3.5"/><path d="M-20 20l-6 18l20 -18" fill="' + ORANGE + '" stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round"/></g><g transform="translate(28 14) rotate(8)"><rect x="-40" y="-30" width="80" height="50" rx="14" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="3.5"/><path d="M20 20l6 18l-20 -18" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round"/></g><path class="pulse" d="M0 -48l6 14l14 -6l-8 14l14 6l-16 2" stroke="' + YELLOW + '" stroke-width="5" fill="none" stroke-linecap="round"/>',
  owl: '<g transform="translate(0 -10) scale(1.05)"><ellipse cx="0" cy="22" rx="42" ry="48" fill="#9a6b45"/><ellipse cx="0" cy="36" rx="26" ry="30" fill="#e9d2b4"/><path d="M-34 -18l-6 -22l20 14zM34 -18l6 -22l-20 14z" fill="#9a6b45"/><circle cx="-15" cy="-6" r="15" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/><circle cx="15" cy="-6" r="15" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/><circle cx="-15" cy="-6" r="6" fill="' + INK + '"/><circle cx="15" cy="-6" r="6" fill="' + INK + '"/><path d="M-6 8l6 10l6 -10z" fill="' + ORANGE + '"/></g>',
  bridge: '<path d="M-64 30h128" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/><path d="M-56 30q56 -70 112 0" fill="none" stroke="' + TEAL + '" stroke-width="8"/><path d="M-36 30v-26M0 30v-38M36 30v-26" stroke="' + INK + '" stroke-width="4"/><circle cx="-56" cy="10" r="12" fill="' + ORANGE + '" stroke="' + INK + '" stroke-width="3"/><circle cx="56" cy="10" r="12" fill="' + PURPLE + '" stroke="' + INK + '" stroke-width="3"/><path class="pulse" d="M0 -30c-6 -10 -20 -6 -16 6c3 7 16 14 16 14s13 -7 16 -14c4 -12 -10 -16 -16 -6z" fill="' + PINK + '" stroke="' + INK + '" stroke-width="2.5"/>',
  trophy: '<path d="M-30 -44h60v26q0 34 -30 34t-30 -34z" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="4"/><path d="M-30 -36h-18q0 30 22 30M30 -36h18q0 30 -22 30" fill="none" stroke="' + INK + '" stroke-width="4"/><path d="M-6 16h12v16h-12z" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="3"/><rect x="-24" y="32" width="48" height="14" rx="3" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="3"/><path class="twinkle" d="M40 -56l4 10l10 4l-10 4l-4 10l-4 -10l-10 -4l10 -4z" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="2"/>',
  muscle: '<path d="M-50 30q-6 -40 20 -56q14 -8 24 4q6 10 -6 16q-10 4 -4 14q18 -14 40 -4q22 12 12 36z" fill="#f1c7a1" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/><path class="twinkle" d="M40 -40l4 10l10 4l-10 4l-4 10l-4 -10l-10 -4l10 -4z" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="2"/>',
  head: '<path d="M-36 40v-30q-14 -4 -10 -20q-2 -40 38 -42q40 2 40 38q0 30 -20 38v16z" fill="#e8e5fa" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/><g class="float"><rect x="-22" y="-30" width="58" height="34" rx="12" fill="' + CREAM + '" stroke="' + PURPLE + '" stroke-width="3"/><path d="M-10 -14h34M-10 -6h20" stroke="' + PURPLE + '" stroke-width="3" stroke-linecap="round"/></g>',
  fork: '<path d="M0 50v-40M0 10l-40 -40M0 10l40 -40" stroke="' + INK + '" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M0 50v-40M0 10l-40 -40M0 10l40 -40" stroke="' + YELLOW + '" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M-52 -42l12 12l2 -16zM52 -42l-12 12l-2 -16z" fill="' + ORANGE + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>',
  wheel: '<circle r="44" fill="none" stroke="' + INK + '" stroke-width="8"/><circle r="44" fill="none" stroke="' + TEAL + '" stroke-width="3"/><circle r="10" fill="' + ORANGE + '" stroke="' + INK + '" stroke-width="3"/><path d="M0 -44v34M0 10v34M-44 0h34M10 0h34" stroke="' + INK + '" stroke-width="5"/><g class="spin"><circle cx="0" cy="-44" r="6" fill="' + YELLOW + '"/></g>',
  magnet: '<path d="M-36 -40v40a36 36 0 0 0 72 0v-40h-22v40a14 14 0 0 1 -28 0v-40z" fill="' + PINK + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/><path d="M-36 -40h22v14h-22zM14 -40h22v14h-22z" fill="#c9ccd0" stroke="' + INK + '" stroke-width="3"/><path class="pulse" d="M-30 -56q-10 -12 0 -20M30 -56q10 -12 0 -20" stroke="' + PURPLE + '" stroke-width="4" fill="none" stroke-linecap="round"/>',
  shield: '<path d="M0 -50l42 14v26q0 40 -42 58q-42 -18 -42 -58v-26z" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/><path d="M-16 0l12 12l22 -24" stroke="' + CREAM + '" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  warning: '<path d="M0 -48l50 86h-100z" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/><path d="M0 -16v28" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/><circle cx="0" cy="26" r="5" fill="' + INK + '"/>',
  adult: '<circle cx="0" cy="-26" r="22" fill="#c98e63" stroke="' + INK + '" stroke-width="3.5"/><circle cx="-7" cy="-26" r="3" fill="' + INK + '"/><circle cx="7" cy="-26" r="3" fill="' + INK + '"/><path d="M-7 -16q7 6 14 0" stroke="' + INK + '" stroke-width="2.5" fill="none"/><path d="M-32 50v-34q0 -20 32 -20t32 20v34z" fill="' + GREEN + '" stroke="' + INK + '" stroke-width="3.5"/><rect x="10" y="10" width="18" height="24" rx="3" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.5"/><path d="M14 18h10M14 25h8" stroke="' + INK + '" stroke-width="2"/>'
};
/* a body outline with glowing spots: spots [[x, y, label, n], ...] in a 400 x 520 box */
function body(spots){
  var g = '<rect width="560" height="520" rx="22" fill="#e8e5fa"/><g transform="translate(80 0)">' +
    '<circle cx="200" cy="90" r="52" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="5"/><circle cx="182" cy="86" r="5" fill="' + INK + '"/><circle cx="218" cy="86" r="5" fill="' + INK + '"/>' +
    '<path d="M150 160q50 -20 100 0l26 150l-30 6l-10 -100v260h-34v-150h-4v150h-34v-260l-10 100l-30 -6z" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/></g>';
  spots.forEach(function(s){
    var x = s[0] + 80, y = s[1], left = s[0] < 200;
    g += '<g data-s="' + s[3] + '"><circle class="pulse" cx="' + x + '" cy="' + y + '" r="26" fill="' + ORANGE + '" opacity=".55"/><circle cx="' + x + '" cy="' + y + '" r="9" fill="' + ORANGE + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M' + x + ' ' + y + 'L' + (left ? 40 : 520) + ' ' + y + '" stroke="' + INK + '" stroke-width="2.5" stroke-dasharray="6 5"/>' +
      '<rect x="' + (left ? 8 : 400) + '" y="' + (y - 44) + '" width="152" height="34" rx="10" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      T(left ? 84 : 476, y - 20, s[2], 21, { a: "middle", f: 1 }) + '</g>';
  });
  return S("0 0 560 520", g);
}


/* the superpower shield, three sections */
function shieldArt(){
  return S("0 0 480 460", '<rect width="480" height="460" rx="22" fill="#e8e5fa"/>' +
    '<g transform="translate(240 230)"><path d="M0 -190l160 50v90q0 150 -160 230q-160 -80 -160 -230v-90z" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
    '<path d="M-160 -40h320M0 -40v226" stroke="' + INK + '" stroke-width="5"/>' +
    '<g data-s="1">' + T(0, -110, "Good at", 30, { a: "middle", f: 1, c: TEAL }) + '<g transform="translate(0 -60) scale(.6)">' + ICON.muscle + '</g></g>' +
    '<g data-s="2">' + T(-80, 40, "Proud of", 26, { a: "middle", f: 1, c: ORANGE }) + '<g transform="translate(-80 110) scale(.6)">' + ICON.trophy + '</g></g>' +
    '<g data-s="3">' + T(80, 40, "Learning", 26, { a: "middle", f: 1, c: PURPLE }) + '<g transform="translate(80 110) scale(.6)">' + ICON.fork + '</g></g></g>');
}
/* the word YET being added */
function yetArt(){
  return S("0 0 900 300", '<rect width="900" height="300" rx="22" fill="#e8e5fa"/>' +
    '<rect x="40" y="70" width="560" height="120" rx="24" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="5"/>' + T(320, 150, "I can't do this", 56, { a: "middle", f: 1 }) +
    '<g data-s="1"><g class="wobble"><rect x="600" y="50" width="250" height="150" rx="28" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="6" transform="rotate(-6 725 125)"/>' + T(725, 148, "...yet", 64, { a: "middle", f: 1, x: ' transform="rotate(-6 725 125)"' }) + '</g>' +
    A.bonnie(830, 250, 0.45, "happy") + '</g>');
}
/* a broken plate being glued */
function repairArt(){
  return S("0 0 560 420", '<rect width="560" height="420" rx="22" fill="#e8e5fa"/>' +
    '<g transform="translate(280 220)"><path d="M-150 0a150 60 0 0 0 300 0z" fill="#7fc8e0" stroke="' + INK + '" stroke-width="5"/>' +
    '<path d="M-150 0a150 60 0 0 1 300 0" fill="#bfe6ef" stroke="' + INK + '" stroke-width="5"/>' +
    '<path class="dash" d="M-20 -58l18 30l-14 26l20 30l-6 32" stroke="' + YELLOW + '" stroke-width="8" fill="none" stroke-linecap="round"/></g>' +
    '<g class="float"><g transform="translate(440 110) rotate(25)"><rect x="-18" y="-50" width="36" height="80" rx="8" fill="' + ORANGE + '" stroke="' + INK + '" stroke-width="4"/><rect x="-10" y="-70" width="20" height="22" rx="4" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="3"/>' + T(0, 0, "GLUE", 14, { a: "middle", f: 1, x: ' transform="rotate(-90)"' }) + '</g></g>' +
    T(280, 370, "Sorry is the glue. What you do next holds it.", 24, { a: "middle", f: 1 }));
}
/* first thought, balanced thought */
function thoughtArt(first, balanced){
  return S("0 0 600 440", '<rect width="600" height="440" rx="22" fill="#e8e5fa"/>' + kid(110, 260, 1, { top: TEAL, skin: "#c98e63", hair: "#1c1c1c", mood: "sad" }) +
    '<g transform="translate(200 40)"><path d="M-10 70q-10 -60 60 -60h290q60 0 60 60t-60 60h-290q-70 0 -60 -60z" fill="#f6d2d8" stroke="' + INK + '" stroke-width="4"/>' + T(190, 80, first, 20, { a: "middle", b: 1 }) + '<circle cx="-10" cy="150" r="10" fill="#f6d2d8" stroke="' + INK + '" stroke-width="3"/></g>' +
    '<g data-s="1"><g transform="translate(200 230)"><path d="M0 70q-10 -60 60 -60h260q60 0 60 60t-60 60h-260q-70 0 -60 -60z" fill="#dff5ee" stroke="' + INK + '" stroke-width="4"/>' + T(190, 64, balanced[0], 20, { a: "middle", b: 1 }) + T(190, 92, balanced[1], 20, { a: "middle", b: 1 }) + '</g></g>');
}

window.B5LESSON = {
  id: "rel-week-4",
  title: "Proud of me",
  mins: 15,
  cc: [
    { week: "Giving Tuesday", line: "Self respect isn't selfish. You can only give to others if you're looking after you too." }
  ],
  startMins: 4,
  finishMins: 5,
  cover: { line: "Strengths, self-talk, and putting things right. (Bonnie already thinks you're brilliant.)", art: S("0 0 560 380", A.scene(560, 380, { ground: 330, time: "dusk", sun: [460, 80] }) + kid(220, 180, 1.2, { top: PURPLE, hair: "#d8a24a", long: true }) + '<g transform="translate(380 160)" class="float">' + ICON.trophy + '</g>' + A.bonnie(470, 300, 0.5, "happy")) },

  warm: {
    wordle: { word: "PROUD", hint: "Feeling good about something you did, or who you are.", say: "One of this week's words." },
    wyr: {
      a: "Be brilliant at one thing", b: "Be pretty good at loads of things",
      twist: "Both are strengths. Different people, different shapes.",
      say: "Tap a side each."
    }
  },
  warms: {
    2: { wyr: {
      a: "Have a voice in your head that cheers you on", b: "Have a voice in your head that tells terrible jokes",
      twist: "Everybody has a voice in their head. This week is about making it a kinder one.",
      say: "Tap a side each. Some people have both, apparently."
    } },
    3: { wordle: { word: "SORRY", hint: "A word that helps, but only if what you do next matches it.", say: "Quick Wordle." } }
  },

  recap: {
    items: [
      { q: "Three calm phrases from last week?", a: "\"No thank you.\" \"I don't like that, please stop.\" \"I need a minute.\"" },
      { q: "Someone changes their mind after saying yes. That is...", a: "Allowed. The other person accepts it." }
    ],
    say: "From last week."
  },

  objective: {
    formal: "recognise my strengths, notice unhelpful self-talk and swap it for something kinder, and know how to put things right in a friendship.",
    mission: "Find your superpowers, upgrade your inner voice, and learn the repair kit.",
    success: ["Name a strength of mine", "Turn an unhelpful thought into a helpful one", "Pick a good way to put something right"],
    say: "Three words this week: proud, strengths, self-talk."
  },

  sections: [
    {
      kind: "hook", part: 1, title: "Strengths and superpowers.", mins: 8,
      slides: [
        { title: "This week's words", stack: true, artWidth: 1150,
          art: tiles([["Proud", ICON.trophy], ["Strengths", ICON.muscle], ["Self-talk", ICON.head]]),
          text: "<b>Proud</b>: feeling good about what you did, or who you are. <b>Strengths</b>: what you're good at. <b>Self-talk</b>: what you say to yourself.",
          say: "Click through. Ask: what is something you're quietly good at that nobody would guess?" },
        {
          type: "vote", kicker: "Strengths corners", title: "Which one is most you?",
          q: "No wrong answers. Pick one, or go and stand in that corner.",
          opts: ["Creative", "Helpful", "Brave", "Problem solver"],
          why: "Everyone's mix is different. And most people are a bit of all four.",
          say: "Read a couple out to help: 'I like helping others', 'I enjoy finding ways to fix things'. Staff vote too."
        },
        { title: "Your superpower shield", art: shieldArt(), artLeft: true,
          pts: ["Something I'm good at", "Something I'm proud of", "Something I'm learning"], build: true, ptsFrom: 1,
          note: "Draw it, say it, or keep it in your head.",
          say: "Paper only if anyone wants it. Share one section if you fancy, or none. Staff go first." }
      ],
      check: { q: "Strengths are...", opts: ["Different for everyone", "Only things you get top marks in", "Fixed forever"], a: 0, why: "Different for everyone, and they grow." }
    },
    {
      kind: "explore", part: 2, title: "Flip the script.", mins: 10,
      slides: [
        { title: "One tiny word", art: yetArt(), stack: true, artWidth: 1150,
          text: "Self-talk is the voice in your head. One word can change what it says.",
          say: "Say both versions out loud. Which one makes you more likely to have another go?" },
        {
          type: "sort", title: "Unhelpful or helpful?", q: "Sort the self-talk.",
          bins: ["Unhelpful", "Helpful"],
          cards: [
            { t: "I'm rubbish at this.", b: 0 }, { t: "I'm still learning.", b: 1 },
            { t: "Everyone is better than me.", b: 0 }, { t: "Everyone has different strengths.", b: 1 },
            { t: "I made a mistake, so I give up.", b: 0 }, { t: "Mistakes help me learn.", b: 1 },
            { t: "I can't do it.", b: 0 }, { t: "I can try a different way.", b: 1 }
          ],
          why: "Each unhelpful one has a helpful twin. Can you match them up?",
          say: "After the check, match the pairs out loud."
        },
        { title: "Jumping to conclusions", art: thoughtArt("They haven't replied. They hate me.", ["I feel worried, but I don't", "know why they haven't replied."]), wideArt: true,
          text: "A helpful thought takes the feeling seriously, without pretending we know everything.",
          say: "Click to show the balanced thought. Feeling, then helpful thought, then helpful action (ask calmly, or talk to a trusted adult)." },
        {
          type: "predict", title: "Balance it",
          q: "\"We disagreed. Our friendship is ruined.\" Best balanced thought?",
          opts: ["\"We disagreed. Friends do. We can sort it.\"", "\"Yep, ruined. Never speaking again.\"", "\"It was all my fault, as usual.\""],
          a: 0,
          why: "Disagreeing doesn't end a friendship. Remember last week?",
          say: "More to try out loud: 'They played with someone else. Nobody wants me.' 'They laughed at my mistake. I deserve it.'"
        },
        {
          type: "predict", kicker: "Going further", title: "If I say no...",
          q: "\"If I say no, nobody will like me.\" What would you tell a mate who said that?",
          opts: ["\"You're allowed to say no. Real friends respect it.\"", "\"Better say yes to everything then.\""],
          a: 0,
          why: "Someone might be disappointed. That's OK. A supportive friend respects your choices.",
          say: "Tier 2. More pairs: 'I need help, so I'm useless' / 'Asking for help helps me learn'. 'If I disagree I'm a bad friend' / 'I can disagree and still care'."
        }
      ],
      check: { q: "\"I can't do this\" becomes more helpful with which word?", opts: ["Yet", "Ever", "Never"], a: 0, why: "Yet. Small word, big difference." }
    },
    {
      kind: "explain", part: 3, title: "The repair kit.", mins: 6,
      slides: [
        { title: "Putting it right", art: repairArt(),
          pts: ["Listen", "Say sorry, honestly", "Return, replace or help", "Change what you do next"], build: true, ptsFrom: 1,
          say: "Model it: 'I interrupted you. Sorry. I'll stop and let you finish.' Ask: what if someone says sorry but keeps doing it? (The sorry stops counting.)" },
        {
          type: "predict", title: "The drawing",
          q: "A friend spills water on your drawing by accident. What would help put it right?",
          opts: ["\"Sorry! Let me help dry it, or redo it with you.\"", "Laugh and blame you for leaving it there", "Pretend it didn't happen"],
          a: 0,
          why: "Own it, say sorry, offer help. You're still allowed to feel upset about it, too.",
          say: "Ask: which one would make it worse?"
        },
        {
          type: "predict", kicker: "Help finder", title: "Ordinary row?",
          q: "Someone says they'll hurt their friend if the friend spends time with anyone else.",
          opts: ["Ordinary disagreement", "A threat: get a trusted adult"],
          a: 1,
          why: "That's a threat, not a friendship wobble. Nobody has to accept threats to keep a friend.",
          say: "Name who they could go to here: Jay, Holly, Helen."
        },
        {
          type: "vote", kicker: "Going further", title: "Approval or respect?",
          q: "\"A good friend always agrees with you.\"",
          opts: ["Agree", "Disagree", "Depends"],
          why: "Approval is agreeing with you. Respect is valuing you even when they don't. Praise like \"You're amazing, when you do what I say\" isn't support at all.",
          say: "Tiers 2 and 3. Push on the last line: what happens to someone's freedom to disagree?"
        }
      ],
      check: { q: "Someone says sorry, then does the same thing again and again. Their sorry...", opts: ["Stops meaning much", "Still fixes everything"], a: 0, why: "Repair is what you do, not just what you say." }
    }
  ],

  realworld: {
    title: "Knowing your strengths",
    text: "Job interviews ask \"What are your strengths?\" Self-talk gets you through a driving test. Repair keeps friendships going for years.",
    art: S("0 0 560 420", '<rect width="560" height="420" rx="22" fill="#e8e5fa"/><rect x="60" y="250" width="440" height="20" rx="8" fill="#b5793f" stroke="' + INK + '" stroke-width="3"/>' + kid(160, 120, 1, { top: TEAL, hair: "#4a2c17" }) + A.jay(400, 160, 1.5) + talk(220, 20, 320, ["So, what are your", "strengths?"], { size: 22, right: true })),
    say: "Ask: what would you say if an interviewer asked you that tomorrow? Shields from Monday help here."
  },

  exit: [
    { q: "Which is helpful self-talk?", opts: ["\"I'm still learning.\"", "\"I'm rubbish at this.\""], a: 0, why: "Kind and true. That's the one." },
    { q: "The best repair is...", opts: ["Sorry, plus changing what you do", "Sorry, then the same again"], a: 0, why: "Words and actions together." }
  ],

  driving: {
    angle: "If you met you from five years ago, what would you be proud to tell them?",
    opts: ["Something I can do now", "Something I got through", "Pass"],
    say: "No need to share the actual thing."
  },

  surprise: { at: "sections.1.slides.0", kind: "bambi", x: 1430, y: 620, w: 120, say: "Bambi's self-talk: 'I am regal. I am elegant. I have very long legs.' All true." },

  notes: {
    week: "Autumn 2, Week 4 (23 to 27 November 2026)",
    theme: "Self Respect",
    words: [["Proud", "Feeling good about something you have done or about who you are."], ["Strengths", "The things you are good at."], ["Self-talk", "What you say to yourself in your head."]],
    car: [["All tiers", "What is a kind thing someone could say to themselves on a tricky day? How can you tell when someone is treating you with respect?"]],
    shape: [
      ["Monday, part 1: hook", "Trust Motivation Monday (Strengths corners and the Superpower shield)."],
      ["Thursday, part 2: explore", "Taskmaster Tuesday (Flip the script), Therapeutic Thursday (first thought and balanced thought) and the Tier 2 'If I say no, nobody will like me'."],
      ["Friday, part 3: explain", "Wondering Wednesday (Repair), Focus Friday stations (Repair builder, Help finder) and the Tier 2 and 3 approval or respect question."],
      ["Off the board", "Wednesday is a trip day. Station 1 (Feelings detective: a friend leaves your group for another activity) works as a Car Chat."]
    ],
    tiers: [
      { n: 1, target: "I can explore positive qualities of healthy relationships",
        milestones: ["I understand the features of positive and stable relationships", "I understand that relationships can cause strong feelings and emotions", "I understand that all relationships have positive and less positive aspects"],
        board: "Everything on the board is pitched here.",
        more: ["Repair situations in pairs, using the action bank: Listen, Explain honestly, Apologise, Return or replace, Agree a change, Give space.", "Skill Up: the short film Alike (about eight minutes): what does the child enjoy, how do the father's responses affect them, what changes? Then a three panel comic or staff directed scene: a feeling, a respectful response, an action that repairs.", "Reflect: Taylor's friend says 'You're weird for liking that.' How might Taylor feel, what could Taylor say to themselves, what should the friend change?"] },
      { n: 2, target: "I can explore being in control of myself and still have successful and healthy relationships",
        milestones: ["I can identify characteristics and benefits of positive, strong, supportive relationships"],
        board: "Thursday's 'If I say no' slide and Friday's approval or respect vote.",
        more: ["Supportive actions and the characteristic they show: letting a friend finish (listening), saying when you can't make a plan (reliability), offering help without taking over (encouragement), not mocking a hobby (respecting difference). Stem: 'This shows ___ and could help someone feel ___ because...'", "Worried thought, balanced thought, and something a supportive friend could say: 'Would you like some help, or time to try?' 'It's not my favourite hobby, but tell me what you enjoy.' 'I see it differently, but I'll listen.'", "Approval and respect: Dove 'Reverse Selfie' clip. Does getting likes tell us whether someone feels valued? A friend's outfit you wouldn't wear: 'What do you like about it?' vs 'You look ridiculous.'"] },
      { n: 3, target: "I can explore healthy, long-term relationships",
        milestones: ["I can differentiate the elements present in different types of long-term relationships", "I understand the benefits of healthier relationships and connection"],
        board: "Friday's approval or respect vote.",
        more: ["Important in both, or depends on circumstances (close friends vs adult partners sharing a home): listening, respecting private messages and separate friendships, keeping agreements, encouraging each other's interests (both); dividing bills and jobs (depends). Twist: the friends rent a flat together.", "Fact or judgement: 'Their post got more likes than mine. I matter less.' Balanced thought, supportive action, benefit. 'I need support, I'm becoming a burden' becomes 'Needing support doesn't make me a burden.'", "Respectful feedback addresses an issue; a put-down attacks the person. Sounding calm doesn't make a comment respectful: 'You always look embarrassing. Wear what I tell you... it's for your own good.'"],
        care: ["'You're amazing when you do what I say' and comments about appearance and clothing are early signs of control. Changing your own self-talk does not remove another person's responsibility for controlling behaviour. Follow up anything that sounds close to home, and tell Helen (DSL)."] }
    ],
    clips: [["Alike (short film, about eight minutes)", "Tier 1 Skill Up: discouragement, care, and a father who changes."], ["Dove: Reverse Selfie", "Tier 2: likes, appearance and feeling valued."]],
    clipsLine: "Clips the trust plan suggests. They are not on the board, so play them from YouTube if you want them.",
    support: ["Trusted adults in school: Jay, Holly, Helen (DSL)", "Childline: 0800 1111, any time, free", "Kooth (online support for young people)"]
  }
};
})();
