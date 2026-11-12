/* ==========================================================
   Base 5 Lessons - Relational (PSHE and RSE)
   Autumn 2 Week 5 (30 Nov to 4 Dec 2026): Choice and Autonomy
   The trust plan leaves this week blank, so it is written from the
   Autumn 2 overview targets and milestones for each tier. Tier 1 on
   the board for everyone, "Going further" slides for Tiers 2 and 3.
   Sensitive strands and the full tier plan: /lessons/notes.html?l=rel-week-5
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


/* a signpost at a crossroads */
function signpostArt(){
  function arm(y, r, label, col, n){ return '<g class="float" style="animation-delay:-' + n + 's"><g transform="translate(280 ' + y + ') rotate(' + r + ')"><path d="M0 -26h170l30 26l-30 26h-170z" fill="' + col + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' + T(92, 9, label, 24, { a: "middle", f: 1, c: CREAM }) + '</g></g>'; }
  function armL(y, r, label, col, n){ return '<g class="float" style="animation-delay:-' + n + 's"><g transform="translate(280 ' + y + ') rotate(' + r + ')"><path d="M0 -26h-170l-30 26l30 26h170z" fill="' + col + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' + T(-92, 9, label, 24, { a: "middle", f: 1, c: CREAM }) + '</g></g>'; }
  return S("0 0 560 440", A.scene(560, 440, { ground: 380, time: "day", sun: [490, 60] }) +
    '<rect x="268" y="70" width="24" height="320" rx="6" fill="#b5793f" stroke="' + INK + '" stroke-width="4"/>' +
    arm(110, -6, "My choice", TEAL, 1) + armL(180, 4, "Their choice", ORANGE, 2) + arm(250, 5, "Choose together", PURPLE, 3) +
    kid(110, 270, 0.8, { top: YELLOW, hair: "#4a2c17" }) + A.bonnie(450, 350, 0.45, "happy"));
}
/* a gentle nudge and a big shove */
function nudgeArt(){
  return S("0 0 620 420", '<rect width="620" height="420" rx="22" fill="#e8e5fa"/>' +
    '<path d="M310 30v360" stroke="' + INK + '" stroke-width="3" stroke-dasharray="10 8"/>' +
    T(160, 60, "Influence", 30, { a: "middle", f: 1, c: TEAL }) + T(460, 60, "Pressure", 30, { a: "middle", f: 1, c: PINK }) +
    kid(110, 210, 0.85, { top: TEAL, hair: "#1c1c1c" }) + kid(220, 210, 0.85, { top: YELLOW, skin: "#c98e63", hair: "#2b1a0e", long: true }) +
    talk(40, 80, 240, ["Fancy it? No", "worries if not."], { size: 20 }) +
    '<g data-s="1">' + kid(410, 210, 0.85, { top: PINK, hair: "#4a2c17", mood: "cross" }) + kid(530, 210, 0.85, { top: GREEN, skin: "#8d5a3b", hair: "#1c1c1c", mood: "sad" }) +
    '<g class="wobble"><path d="M450 300l40 -10l-6 -14l30 22l-34 14l-4 -12l-38 8z" fill="' + ORANGE + '" stroke="' + INK + '" stroke-width="3"/></g>' +
    talk(340, 80, 260, ["Don't be boring.", "Everyone else is."], { size: 20, right: true }) + '</g>');
}
/* the choice steps as a path of stones */
function chooseArt(){
  var steps = [["Notice", ICON.head], ["Think", ICON.fork], ["Choose", ICON.wheel], ["Can change", ICON.bridge]];
  var g = '<rect width="1200" height="300" rx="22" fill="#e8e5fa"/><path class="dash" d="M150 170H1050" stroke="' + PURPLE + '" stroke-width="6" opacity=".6"/>';
  steps.forEach(function(st, i){
    var cx = 150 + i * 300;
    g += '<g data-s="' + (i + 1) + '"><circle cx="' + cx + '" cy="138" r="86" fill="' + INK + '"/><circle cx="' + cx + '" cy="130" r="86" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="5"/><g transform="translate(' + cx + ' 128) scale(.85)" class="float">' + st[1] + '</g>' + T(cx, 266, st[0], 32, { a: "middle", f: 1 }) + '</g>';
  });
  return S("0 0 1200 300", g);
}

window.B5LESSON = {
  id: "rel-week-5",
  title: "Whose choice is it?",
  mins: 15,
  cc: [
    { week: "Christmas Around the World", line: "Everyone does December differently. Their traditions, their choice. Yours, yours." }
  ],
  startMins: 4,
  finishMins: 5,
  cover: { line: "Making your own choices, and letting other people make theirs.", art: signpostArt() },

  warm: {
    wordle: { word: "CHOICE", hint: "Picking what you want from the options you have.", say: "Six letters this time." },
    wyr: {
      a: "Choose every meal for a year", b: "Choose every film you watch for a year",
      twist: "Either way, nobody else gets a vote. Is that brilliant, or a bit lonely?",
      say: "Tap a side each."
    }
  },
  warms: {
    2: { wyr: {
      a: "Have someone else make all your choices for a week", b: "Make every choice for everyone in Base 5 for a week",
      twist: "Both sound tiring. Choosing for other people is a lot of responsibility.",
      say: "Tap a side each."
    } },
    3: { wordle: { word: "FREE", hint: "A real yes is given ___ly: no pressure, no threats.", say: "Four letters." } }
  },

  recap: {
    items: [
      { q: "Unhelpful self-talk: \"If I say no, nobody will like me.\" Balanced version?", a: "\"I'm allowed to say no. Real friends respect it.\"" },
      { q: "What turns a sorry into a real repair?", a: "Changing what you do next." }
    ],
    say: "From last week."
  },

  objective: {
    formal: "recognise which choices are mine and which are other people's, tell influence from pressure, and make a choice that's really mine.",
    mission: "Work out whose choice it is, spot the pressure, and choose like an owl.",
    success: ["Say whose choice something is", "Spot when influence turns into pressure", "Use the choice steps"],
    say: "Three words this week: choice, autonomy, influence."
  },

  sections: [
    {
      kind: "hook", part: 1, title: "Mine, yours, or ours?", mins: 8,
      slides: [
        { title: "This week's words", stack: true, artWidth: 1150,
          art: tiles([["Choice", ICON.fork], ["Autonomy", ICON.wheel], ["Influence", ICON.magnet]]),
          text: "<b>Choice</b>: picking from your options. <b>Autonomy</b>: freedom to make your own decisions. <b>Influence</b>: how words or actions sway someone.",
          say: "Autonomy is the big one. It's you at the steering wheel of your own life. Ask: what's a choice you made today that was all yours?" },
        {
          type: "sort", title: "Whose choice?", q: "Sort them into the right box.",
          bins: ["My choice", "Their choice", "We choose together"],
          cards: [
            { t: "What I wear today", b: 0 }, { t: "Who my friend hangs out with", b: 1 },
            { t: "Which film we watch together", b: 2 }, { t: "Whether I hug someone", b: 0 },
            { t: "Whether a friend lends me their game", b: 1 }, { t: "Where we go on Saturday", b: 2 },
            { t: "Whether someone hugs me", b: 0 }
          ],
          why: "Your body, your stuff, your time: your choice. Their stuff: their choice. Shared plans: a fair plan, together.",
          say: "The hug cards matter: your body is always your choice, and theirs is always theirs."
        },
        { title: "When it's a no, inside", art: body([[200, 90, "Jaw goes tight", 1], [142, 176, "Shoulders tense", 2], [200, 250, "Tummy drops", 3], [210, 470, "Feet want to go", 4]]), artLeft: true,
          text: "Your body often knows you don't want to do something before your words do.",
          say: "Ask: what does a 'no' feel like in your body? Everyone's is different. Noticing it is step one of choosing." }
      ],
      check: { q: "Whether someone hugs you is...", opts: ["Your choice", "Their choice", "Whoever asks first"], a: 0, why: "Your body, your choice. Every time." }
    },
    {
      kind: "explore", part: 2, title: "Influence or pressure?", mins: 10,
      slides: [
        { title: "Nudge or shove?", art: nudgeArt(), wideArt: true,
          text: "Influence leaves the choice with you. Pressure tries to take it away.",
          say: "Click to show the shove. Ask: how can you tell the difference? (What happens if you say no.)" },
        {
          type: "sort", title: "Influence or pressure?", q: "Sort what people say.",
          bins: ["Influence", "Pressure"],
          cards: [
            { t: "\"Fancy coming? No worries if not.\"", b: 0 }, { t: "\"Everyone else is. Don't be boring.\"", b: 1 },
            { t: "\"I loved that film, you might too.\"", b: 0 }, { t: "\"If you cared about me, you would.\"", b: 1 },
            { t: "\"Here's what I'd do, but it's up to you.\"", b: 0 }, { t: "\"Do it or I'll tell everyone.\"", b: 1 }
          ],
          why: "Guilt, threats and 'everyone else is' all push. Influence leaves room for a no.",
          say: "Ask which pressure line is the sneakiest. (Usually the guilt one.)"
        },
        {
          type: "predict", title: "A very quiet okay",
          q: "Taylor says \"okay\" very quietly when a popular friend suggests sharing a photo of them. Is that a free yes?",
          opts: ["Yes, they said okay", "Pressure, definitely", "Can't tell yet: pause and check"],
          a: 2,
          why: "A quiet okay doesn't prove a free yes, or pressure. Pause, and check without persuading: \"You sure? It's fine not to.\"",
          say: "We can't judge a yes just from someone looking happy or sounding confident."
        },
        {
          type: "vote", kicker: "Going further", title: "Power",
          q: "Can a friendship be truly equal if one person is way more popular?",
          opts: ["Yes", "No", "Depends"],
          why: "It depends on what they do with it. Popularity can make it harder to say no, so the more popular person has to check more carefully.",
          say: "Tiers 2 and 3. Influence plus popularity can quietly become power. What would a fair friend do with that power?"
        }
      ],
      check: { q: "\"Do it, or I'll tell everyone your secret.\" That is...", opts: ["Pressure, with a threat", "Just influence"], a: 0, why: "A threat makes saying no too costly. That's pressure." }
    },
    {
      kind: "explain", part: 3, title: "Choose like an owl.", mins: 6,
      slides: [
        { title: "The choice steps", art: chooseArt(), stack: true, artWidth: 1150,
          text: "Notice how you feel. Think about your options. Choose. And you're allowed to change your mind.",
          say: "Click through the four. The last one surprises people: changing your mind is part of choosing, not a failure of it." },
        {
          type: "predict", title: "The group chat dare",
          q: "The group chat dares you to film a prank on someone. Everyone's adding laughing faces. Owl move?",
          opts: ["\"Nah, I'm good.\" Then leave it there", "Do it so you don't look boring", "Film it but don't post it"],
          a: 0,
          why: "Short, clear, no speech needed. The laughing faces aren't your choice. What you do is.",
          say: "Ask: what makes this one hard? (An audience.) Who could you tell if the prank goes ahead anyway?"
        },
        {
          type: "predict", title: "Help, or take over?",
          q: "You're stuck on something. A mate grabs it and does it all for you. Better way for them to help?",
          opts: ["\"Want some help, or want a go first?\"", "Just do it. Quicker.", "Laugh and leave you to it"],
          a: 0,
          why: "Autonomy means you can accept help, or turn it down. Asking first lets you choose.",
          say: "Link back to Week 2: support that fits."
        },
        { kicker: "Going further", title: "A real yes is...", art: tiles([["Free", ICON.shield], ["Changeable", ICON.bridge], ["Able to decide", ICON.head]]), stack: true, artWidth: 1100,
          text: "<b>Free</b>: no pressure, threats or guilt. <b>Changeable</b>: it can become a no at any time. <b>Able</b>: the person is able to understand and decide.",
          say: "Tiers 2 and 3: this is consent. Same rules for borrowing a phone, a photo, or anything to do with someone's body. 'Able to decide' is capacity: someone asleep, very drunk or too young can't give a real yes. Age of consent and the law are in the staff notes: small group only." }
      ],
      check: { q: "Changing your mind after you've chosen is...", opts: ["Allowed. It's part of choosing", "Not allowed once you've said yes"], a: 0, why: "Allowed. A yes can become a no." }
    }
  ],

  realworld: {
    title: "More choices every year",
    text: "Voting at 18. Picking a job, a course, a flat, a bank. Who you let into your life. Adult life is mostly choices, so practising now helps.",
    art: S("0 0 560 420", A.scene(560, 420, { ground: 340, time: "day", sun: [480, 70] }) + '<g transform="translate(150 230)">' + ICON.fork.replace(/stroke-width="10"/g, 'stroke-width="14"') + '</g>' + kid(330, 190, 1, { top: PURPLE, skin: "#8d5a3b", hair: "#1c1c1c" }) + '<g transform="translate(470 120)" class="float">' + ICON.trophy + '</g>'),
    say: "Ask: which adult choice would you most like to make for yourself? Which sounds scary?"
  },

  exit: [
    { q: "Which is pressure, not influence?", opts: ["\"If you cared about me, you would.\"", "\"Fancy it? No worries if not.\""], a: 0, why: "Guilt is pressure. The other leaves room for no." },
    { q: "Whose choice is what you do with your own body?", opts: ["Yours", "Whoever asks"], a: 0, why: "Always yours." }
  ],

  driving: {
    angle: "If you could time travel, would you go back and change a choice you made? Or keep them all?",
    opts: ["Change one", "Keep them all", "Pass"],
    say: "No need to say which. Some 'wrong' choices teach us the most."
  },

  surprise: { at: "sections.0.slides.1", kind: "bonnie", x: 1440, y: 650, w: 120, say: "Bonnie's choices today: nap, snack, nap. Full autonomy. No regrets." },

  notes: {
    week: "Autumn 2, Week 5 (30 November to 4 December 2026)",
    theme: "Choice and Autonomy",
    written: "The trust plan has no activities for this week (blank template), so this week was written for Base 5 from the Autumn 2 overview targets and milestones, in the same shape as Weeks 1 to 4. Swap in the trust's version if one arrives.",
    words: [["Choice", "Picking what you want from the options you have."], ["Autonomy", "Having the freedom to make your own decisions and choices."], ["Influence", "The effect our words or actions can have on someone's feelings or decisions."]],
    car: [["Tiers 1 and 2", "What's a choice you made this week that was all yours? Who helps you when a choice feels big?"], ["Tier 3", "When does persuading someone turn into pressuring them? What would you notice first?"]],
    shape: [
      ["Monday, part 1: hook", "Words of the week, Whose choice? sort (my choice, their choice, together), and what a no feels like in the body (Tier 1 milestone 1)."],
      ["Thursday, part 2: explore", "Influence or pressure (sort, plus the quiet okay from the Week 1 Tier 2 Skill Up) and a Going further vote on popularity and power."],
      ["Friday, part 3: explain", "The choice steps, the group chat dare, help or take over, and a Going further slide on what makes a real yes (consent: free, changeable, able to decide)."],
      ["Off the board", "Wednesday is a trip day: the Car Chat questions fit the journey."]
    ],
    tiers: [
      { n: 1, target: "I can explore assertiveness in relationships",
        milestones: ["I can understand what it feels like in my body when I don't want to do something", "I can understand how to say 'no' when I don't want to do something", "I can really listen when someone else says 'no'"],
        board: "Everything on the board is pitched here.",
        more: ["Choice cards one to one: two options (activity, snack, seat), the student chooses and says why, then changes their mind once on purpose, with staff modelling 'OK, no problem'.", "Body map: draw or point to where a no lives for them, and agree a signal they could use in Base 5 when they need a minute."] },
      { n: 2, target: "I can understand the concept of consent (in peer and intimate relationships) and the importance of respecting others' boundaries",
        milestones: ["I can explain what consent means", "I can recognise situations where boundaries may be crossed", "I can demonstrate appropriate behaviour when consent is refused or withdrawn", "I understand what expectations might be of having a romantic relationship, including the age of consent"],
        board: "Thursday's power vote and Friday's 'A real yes is...' slide.",
        more: ["Consent flowchart (from Week 1 Taskmaster Tuesday): an everyday scenario (borrowing an item, sharing a photo, a hug) with branches for an active yes, a hesitant maybe, and a clear no. What should happen on the maybe branch? (Pause and check; a maybe is not a yes.)", "Expectations in a romantic relationship: both people choose, both can say no, both can end it. Pressure to do things 'because you're together' is still pressure.", "Age of consent (small group, staff led): in the UK the age of consent to any sexual activity is 16, whatever anyone's gender or sexuality. The law is there to protect young people, not to criminalise them; under 13s cannot consent in law at all. Anyone worried about something that has happened can talk to a trusted adult."] },
      { n: 3, target: "I can explore what unhealthy relationships look like",
        milestones: ["I understand what sexual violence is and understand the legality, including strangulation and rape", "I know the support available when relationships are unsafe and recognise the indicators of domestic abuse"],
        board: "Friday's 'A real yes is...' slide only. Nothing below goes on the board.",
        more: ["Consent in law (England and Wales, Sexual Offences Act 2003): a person consents if they agree by choice and have the freedom and capacity to make that choice. Someone asleep, unconscious, very drunk or under 16 cannot give consent. Sex without consent is rape. Being in a relationship or married does not change this.", "Non-fatal strangulation or suffocation is a specific criminal offence (since 2022). It is dangerous even when it leaves no marks, and 'they agreed to it' is not a defence where serious harm is caused. Explain it plainly and briefly because it appears in online content young people may have seen; do not describe or discuss methods.", "Unsafe relationships: link back to Week 3's indicators (control of money, monitoring, threats, demanding proof). Where can someone go? Trusted adult, Helen (DSL), the National Domestic Abuse Helpline (0808 2000 247), Childline, 999 in an emergency."],
        care: ["Small group or one to one only, staff led, never in front of Tier 1 students and never as a game. Plan it with Helen (DSL) first and check whether anyone's history means it should be adapted or done differently.", "Give the session a clear start and end, a way to step out without explaining, and a calm activity afterwards. Expect questions to come later, not in the session.", "Any disclosure: listen, don't promise secrecy, don't investigate, record it in the student's own words and pass it to Helen the same day."] }
    ],
    safeguard: ["Let Helen (DSL) know before the Tier 2 age of consent and Tier 3 sexual violence content is taught, and agree who will be around afterwards.", "Families: the school's RSE policy sets out what parents are told and any right to withdraw from sex education (not relationships education). Check the policy before teaching the Tier 3 strands."],
    support: ["Trusted adults in school: Jay, Holly, Helen (DSL)", "Childline: 0800 1111, any time, free", "National Domestic Abuse Helpline: 0808 2000 247, free, 24 hours", "In an emergency: 999"]
  }
};
})();
