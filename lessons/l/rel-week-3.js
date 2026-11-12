/* ==========================================================
   Base 5 Lessons - Relational (PSHE and RSE)
   Autumn 2 Week 3 (16 to 20 Nov 2026): Conflict and Assertiveness
   From the trust plan (26/27 SB Relational Pillar), Tier 1 on the
   board for everyone, "Going further" slides for Tiers 2 and 3.
   Sensitive strands and the full tier plan: /lessons/notes.html?l=rel-week-3
   Split over the week's three 15 minute PHSE slots:
     part 1 (Monday) hook, part 2 (Thursday) explore,
     part 3 (Friday) explain and the finish.
   Folds in "Asking for what I need" and "Under pressure" from the
   earlier series. Shape as /lessons/l/ac-arch-1.js. ASCII only.
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


/* a pen tug of war, three ways */
function penArt(){
  function pen(x, y, r){ return '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ')"><rect x="-50" y="-8" width="90" height="16" rx="6" fill="' + PINK + '" stroke="' + INK + '" stroke-width="3"/><path d="M40 -8l18 8l-18 8z" fill="#f3e7c9" stroke="' + INK + '" stroke-width="3"/><rect x="-50" y="-8" width="16" height="16" rx="4" fill="' + INK + '"/></g>'; }
  return S("0 0 620 440", '<rect width="620" height="440" rx="20" fill="#e8e5fa"/><rect x="30" y="300" width="560" height="22" rx="8" fill="#b5793f" stroke="' + INK + '" stroke-width="3"/>' +
    kid(170, 160, 1, { top: ORANGE, hair: "#2b1a0e" }) + kid(450, 160, 1, { top: GREEN, skin: "#8d5a3b", hair: "#1c1c1c", mood: "ok" }) +
    '<g class="float">' + pen(450, 270, -10) + '</g>' +
    talk(20, 20, 330, ["That's my pen. Can", "I have it back, please?"], { size: 23 }) + A.bonnie(560, 286, 0.38, "happy"));
}
/* the three steps, as hand signs */
function stepsArt(){
  function sign(cx, n, inner, label){
    return '<g data-s="' + n + '"><rect x="' + (cx - 90) + '" y="40" width="180" height="230" rx="22" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="5"/><circle cx="' + (cx - 64) + '" cy="66" r="20" fill="' + PURPLE + '"/>' + T(cx - 64, 75, String(n), 24, { a: "middle", f: 1, c: CREAM }) +
      '<g transform="translate(' + cx + ' 150)" class="float">' + inner + '</g>' + T(cx, 248, label, 26, { a: "middle", f: 1 }) + '</g>';
  }
  var stop = '<path d="M-28 -44h56l20 20v48l-20 20h-56l-20 -20v-48z" fill="' + PINK + '" stroke="' + INK + '" stroke-width="4"/>' + T(0, 9, "STOP", 22, { a: "middle", f: 1, c: CREAM });
  var breathe = '<circle r="44" fill="#7fc8e0" stroke="' + INK + '" stroke-width="4" class="pulse"/><path d="M-20 0q10 -14 20 0t20 0" stroke="' + INK + '" stroke-width="4" fill="none"/>';
  var sayit = '<rect x="-48" y="-34" width="96" height="58" rx="16" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="4"/><path d="M-24 24l-8 18l24 -18" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' + T(0, 2, "I feel...", 18, { a: "middle", f: 1 }) + T(0, 20, "I need...", 18, { a: "middle", f: 1 });
  return S("0 0 660 300", sign(110, 1, stop, "Stop, notice") + sign(330, 2, breathe, "Breathe slowly") + sign(550, 3, sayit, "Say what I need"));
}
/* the awful advice show */
function showArt(line1, line2){
  return S("0 0 620 440", '<rect width="620" height="440" rx="20" fill="#1d3d47"/>' +
    '<g class="twinkle"><circle cx="60" cy="40" r="5" fill="' + YELLOW + '"/><circle cx="560" cy="60" r="5" fill="' + YELLOW + '"/><circle cx="300" cy="24" r="4" fill="' + YELLOW + '"/></g>' +
    '<rect x="40" y="70" width="540" height="60" rx="12" fill="' + PINK + '" stroke="' + CREAM + '" stroke-width="4"/>' + T(310, 112, "ABSOLUTELY AWFUL ADVICE", 32, { a: "middle", f: 1, c: CREAM }) +
    '<rect x="60" y="330" width="500" height="80" rx="10" fill="#b5793f" stroke="' + INK + '" stroke-width="4"/>' +
    A.jay(170, 250, 1.6, "surprised") + talk(250, 160, 340, [line1, line2], { size: 22 }));
}

window.B5LESSON = {
  id: "rel-week-3",
  title: "Row, or sort it?",
  mins: 15,
  cc: [
    { week: "Anti-Bullying Week", line: "Calm and clear words are one of the best things to have ready when something is not OK." }
  ],
  startMins: 4,
  finishMins: 5,
  cover: { line: "Disagreeing without it turning into a war. (Owls welcome. Dragons, have a sit down.)", art: S("0 0 560 400", A.scene(560, 400, { ground: 350, time: "day", sun: [480, 60] }) + kid(130, 210, 1, { top: ORANGE, hair: "#2b1a0e", mood: "cross" }) + kid(430, 210, 1, { top: GREEN, skin: "#8d5a3b", hair: "#1c1c1c", long: true, mood: "talk" }) +
    '<g transform="translate(280 120) scale(1.1)">' + ICON.clash + '</g><g transform="translate(280 300) scale(.6)" class="float">' + ICON.owl + '</g>') },

  warm: {
    wordle: { word: "CALM", hint: "The voice that works best in an argument. Not loud, not silent.", say: "Four letters this time." },
    wyr: {
      a: "Always win every argument, but nobody likes you much", b: "Lose most arguments, but everyone trusts you",
      twist: "Plot twist: being trusted tends to win you more arguments in the end.",
      say: "Tap a side each. Ask what 'winning' an argument even means."
    }
  },
  warms: {
    2: { wordle: { word: "TRUCE", hint: "When both sides agree to stop arguing for a bit.", say: "Quick Wordle." } },
    3: { wyr: {
      a: "Say yes to a plan, then be allowed to change your mind", b: "Have to stick to every yes forever",
      twist: "Changing your mind is allowed. That's today's big idea.",
      say: "Tap a side each."
    } }
  },

  recap: {
    items: [
      { q: "Mouse, dragon or owl: which one gets their pen back best?", a: "Owl. Calm, clear, no having a go." },
      { q: "A fair plan starts with...", a: "Listening to both people." }
    ],
    say: "From before."
  },

  objective: {
    formal: "recognise that disagreements are normal, notice what my body tells me, and say what I need calmly and clearly.",
    mission: "Swap the shout and the silence for a calm, clear voice.",
    success: ["Say one calm phrase I can use", "Notice where I feel it in my body", "Tell a disagreement from a crossed boundary"],
    say: "Three words this week: disagreement, assertiveness, compromise."
  },

  sections: [
    {
      kind: "hook", part: 1, title: "My calm voice.", mins: 8,
      slides: [
        { title: "This week's words", stack: true, artWidth: 1150,
          art: tiles([["Disagreement", ICON.clash], ["Assertiveness", ICON.owl], ["Compromise", ICON.bridge]]),
          text: "<b>Disagreement</b>: different opinions or wishes. <b>Assertive</b>: clear and respectful. <b>Compromise</b>: both adjust to agree.",
          say: "Click through. Ask: can you disagree with a mate and still be mates? (Yes. All the time.)" },
        { title: "Three calm phrases", art: S("0 0 480 440", A.scene(480, 440, { ground: 400, time: "dusk", sun: [420, 60] }) + kid(150, 250, 1.1, { top: PURPLE, skin: "#c98e63", hair: "#2b1a0e" }) +
            talk(200, 30, 260, ["No thank you."], { right: true, s: 1, size: 24 }) + talk(190, 110, 280, ["Please stop."], { right: true, s: 2, size: 24 }) + talk(210, 190, 250, ["I need a minute."], { right: true, s: 3, size: 24 }) +
            '<g transform="translate(400 350) scale(.55)">' + ICON.owl + '</g>'),
          pts: ["\"No thank you.\"", "\"I don't like that, please stop.\"", "\"I need a minute.\""], build: true, ptsFrom: 1,
          note: "Looking near someone's face is fine. Eye contact isn't needed.",
          say: "Anyone who fancies it picks one and says it once in a steady voice. Passing is fine. Ask: when might you need these?" },
        {
          type: "predict", kicker: "Get your pen back", title: "Someone has your pen",
          q: "Three ways to get it back. Which one works?",
          opts: ["Grab it and shout", "Say nothing and stew", "\"That's my pen. Can I have it back, please?\""],
          a: 2,
          why: "Grabbing turns it into a fight. Silence means you lose your pen and feel rubbish. Calm and clear usually works.",
          say: "If staff fancy it, act all three with Holly playing the pen thief. Everyone gets a point for having a go."
        },
        { title: "The owl way", art: penArt(), wideArt: true,
          pts: ["Say what happened", "Say what you want", "Keep your voice steady"], build: true, ptsFrom: 1,
          say: "Point out: no insults, no 'you always'. Just the facts and the ask." }
      ],
      check: { q: "Disagreements with friends are...", opts: ["Normal. Everyone has them", "A sign the friendship is over", "Always someone's fault"], a: 0, why: "Normal. What matters is how you sort them." }
    },
    {
      kind: "explore", part: 2, title: "What my body tells me.", mins: 10,
      slides: [
        { title: "Where do I feel it?", art: body([[200, 56, "Hot face", 1], [200, 240, "Tight tummy", 2], [222, 190, "Fast heart", 3], [120, 330, "Clenched fists", 4]]), artLeft: true,
          text: "Someone takes the beanbag you wanted. Where would you feel it?",
          say: "Three slow breaths first. Then hand on the part where you'd feel it, or just point at the picture. Link to zones: which zone are we heading into?" },
        { title: "Three steps", art: stepsArt(), stack: true, artWidth: 1100,
          text: "Before the words come out: stop and notice, breathe, then say what you need.",
          say: "Teach the hand actions: hand up for stop, hand on tummy for breathe, open hand for say it. 'I feel ___. I need ___.' is the owl recipe from before." },
        {
          type: "vote", kicker: "I wonder what we could do", title: "Same seat",
          q: "Hayley and Ben both want the same seat. What would you try?",
          opts: ["Talk", "Take turns", "Get an adult", "Walk away"],
          why: "Any of these can work. What doesn't work: grabbing, shouting or a silent sulk.",
          say: "Anyone who wants to can stand by a corner instead of voting. Then try: 'We're playing my game instead.'"
        },
        {
          type: "sort", title: "Disagreement or boundary crossed?", q: "Not every row is the same. Sort them.",
          bins: ["Just a disagreement", "Boundary crossed", "Need more info"],
          cards: [
            { t: "Different music choices", b: 0 }, { t: "Reading their messages after they said no", b: 1 },
            { t: "Window open or closed", b: 0 }, { t: "Posting a photo they asked you not to", b: 1 },
            { t: "Wanting a different game", b: 0 }, { t: "A mate goes quiet in the group chat", b: 2 }
          ],
          why: "Disagreements get sorted with a compromise. A crossed boundary needs it to stop.",
          say: "Go further for anyone ready: nobody owes anyone access to their body, private messages or passwords, even to compromise."
        }
      ],
      check: { q: "Step one when you feel a row coming is...", opts: ["Stop and notice my body", "Shout first, think later", "Win at all costs"], a: 0, why: "Stop and notice. The words go better after a breath." }
    },
    {
      kind: "explain", part: 3, title: "Changing your mind, and hearing no.", mins: 6,
      slides: [
        {
          type: "predict", title: "The photo",
          q: "Jamie said Alex could post their photo. Then: \"Actually, please don't post it.\" Can Jamie change their mind?",
          opts: ["Yes. A yes can become a no", "No. A yes is a yes"],
          a: 0,
          why: "Permission can be taken back. Alex can feel annoyed, and still not post it.",
          say: "Push: Alex spent ages editing it. Does that change anything? (No. Feeling annoyed is fine. Posting anyway, guilt tripping or arguing till Jamie gives in is not.)"
        },
        { kicker: "Game show", title: "Absolutely Awful Advice", art: showArt("Ask every thirty seconds.", "They'll give in eventually!"), wideArt: true,
          text: "Our presenter gives terrible advice. Your job: shout CUT, spot the problem, and fix it.",
          say: "Jay plays the presenter. Message from a viewer: 'My friend won't lend me their headphones.' Anyone can call cut, raise a hand or show a stop sign." },
        {
          type: "predict", kicker: "Cut!", title: "Fix the advice",
          q: "Better advice for the headphones viewer?",
          opts: ["Accept the no and find another option", "Ask louder", "Just take them when they're not looking"],
          a: 0,
          why: "Asking again and again is pressure. A no is a no, even if you're excited, curious or you'd already started.",
          say: "Presenter's excuse: 'But I'm only curious!' Does that change anything? (No.)"
        },
        {
          type: "predict", kicker: "Going further", title: "Same question, different meaning",
          q: "Two people ask a partner to share their location. They say no. Which reply is coercion?",
          opts: ["\"OK. Message me when you're home?\"", "\"Fine. But I'll tell everyone your private business.\""],
          a: 1,
          why: "The question was the same. What matters is what happens when someone says no. A threat makes no too costly to say.",
          say: "Tiers 2 and 3. Coercion: using pressure, guilt or threats so someone can't really choose. The person being pressured is never the one who has to fix it. Who could help?"
        }
      ],
      check: { q: "Morgan agreed to lend a controller, then changed their mind. The friend says \"You promised. Give it here.\" Who needs to change?", opts: ["The friend", "Morgan"], a: 0, why: "Morgan is allowed to change their mind. The friend should accept it." }
    }
  ],

  realworld: {
    title: "Calm and clear, for life",
    text: "Sorting a problem with a manager. Agreeing chores with flatmates. Sending food back in a restaurant. Calm and clear works everywhere.",
    art: S("0 0 560 420", A.scene(560, 420, { ground: 340, time: "day", sun: [480, 70] }) + kid(180, 200, 1, { top: TEAL, hair: "#4a2c17" }) + kid(380, 200, 1, { top: ORANGE, skin: "#c98e63", hair: "#1c1c1c", long: true }) + talk(160, 40, 260, ["Can we sort this?"], { size: 24 })),
    say: "Ask: which of these would be hardest to do calmly? Anti-Bullying Week link: calm and clear is how you back someone up too."
  },

  exit: [
    { q: "The assertive way to get your pen back is...", opts: ["Calm and clear words", "Grab it", "Say nothing"], a: 0, why: "Calm, clear, no having a go." },
    { q: "Someone says yes, then changes their mind. That is...", opts: ["Allowed", "Not allowed"], a: 0, why: "A yes can become a no. The other person's job is to accept it." }
  ],

  driving: {
    angle: "If you could time travel to stop one famous row in history, would you? Or should people sort their own rows?",
    opts: ["Stop it", "Let them sort it", "Pass"],
    say: "Keep it light. Some rows changed history for the better."
  },

  surprise: { at: "sections.1.slides.0", kind: "bonnie", x: 1420, y: 660, w: 120, say: "Bonnie's calm voice: one small woof. Then she lies on the beanbag. Compromise, Bonnie style." },

  notes: {
    week: "Autumn 2, Week 3 (16 to 20 November 2026)",
    theme: "Conflict and Assertiveness in Relationships",
    words: [["Disagreement", "When people have different opinions, feelings or wishes."], ["Assertiveness", "Expressing your thoughts, feelings and needs clearly and respectfully."], ["Compromise", "Finding an agreement where people make adjustments to reach a solution."]],
    car: [["All tiers", "What could a person do to stay calm when they disagree with a friend? Can you disagree with a friend and still be friends? Why?"]],
    shape: [
      ["Monday, part 1: hook", "Trust Motivation Monday (My calm voice: three phrases) and Taskmaster Tuesday (Get your pen back, three ways)."],
      ["Thursday, part 2: explore", "Therapeutic Thursday (Where do I feel it?), the Skill Up three steps, Wondering Wednesday (Talk, take turns, get an adult, walk away) and the Tier 2 Disagreement or boundary crossed sort."],
      ["Friday, part 3: explain", "Tier 2 Therapeutic Thursday (consent withdrawn: the photo), Focus Friday (Absolutely Awful Advice game show) and a Tier 3 Going further slide on coercion."],
      ["Off the board", "Wednesday is a trip day: the Car Chat questions fit the journey. Focus Friday Tier 1 (one word: no, three ways) works as a Breathe Out."]
    ],
    tiers: [
      { n: 1, target: "I can explore assertiveness in relationships",
        milestones: ["I can understand what it feels like in my body when I don't want to do something", "I can understand how to say 'no' when I don't want to do something", "I can really listen when someone else says 'no'"],
        board: "Everything on the board is pitched here.",
        more: ["One word, no: say it shouted, mumbled, then calm and clear. Which is easiest to hear? Silly questions answered with a calm 'No, thank you'. Each student picks the no they'll use this weekend: a word, a phrase or a hand signal.", "Skill Up: act out or direct two characters who both want the last turn on a game, using the three steps. Students who'd rather not act can be the coach (thumbs up for calm, clear words).", "Each student makes a calm plan for one scenario: what my body tells me, what I will say, what I could do next. Say it, draw it or show it. Floor book evidence in different colours."] },
      { n: 2, target: "I can understand the concept of consent (in peer and intimate relationships) and the importance of respecting others' boundaries",
        milestones: ["I can explain what consent means", "I can recognise situations where boundaries may be crossed", "I can demonstrate appropriate behaviour when consent is refused or withdrawn"],
        board: "Thursday's sort, Friday's photo slide and the Absolutely Awful Advice game.",
        more: ["Consent means giving active permission for something involving your body, space or personal items. It is given willingly and freely, without exploitation, threat or fear, by a person who has the capacity to agree.", "Which is the clearer boundary: 'Fine, whatever' or 'No, please stop'? A refusal does not need a special tone to count.", "Scenarios: 'Please don't tickle me' / 'Chill out, it's funny'. 'I don't want to be in that TikTok, please delete it' / 'Too late, we've filmed it'. Write a response that respects the boundary.", "Agree or disagree line: 'Friends must always meet halfway'; 'A password should be shared for just five minutes'; 'We could alternate music choices'; 'No to a photo means keep asking until they agree'. Don't debate whether someone deserves a boundary.", "Skill Up: the Snack Attack short film (assumptions and conflict), then the biscuits scene: call Pause when asking turns into pressure."] },
      { n: 3, target: "I can explore managing control and coercion in relationships",
        milestones: ["I understand what is meant by control, power balance and coercion in a relationship", "I know the support available when relationships are unsafe and recognise the indicators of domestic abuse"],
        board: "Friday's 'Same question, different meaning' slide.",
        more: ["Case cards with reveals (Free choice / Under pressure / Need more information): the location request answered kindly; the cancelled plan with a threat to share private business; the expensive gift used to demand passwords. Look at the consequences of saying no, not just the wording.", "Script editors: rewrite controlling messages (instant replies or I'll post your messages; don't expect me to speak to you again; keep your location on; you owe me) using three rules: name the feeling or request, remove guilt, threats and demands, leave room for a genuine no.", "Feelings and actions: jealousy can be understandable; it does not give anyone a right to another person's phone. The person feeling it is responsible for what they do with it.", "Advice panel with reveals: disappointment expressed respectfully; an adult refusing a partner money for essentials and threatening them; messages that continue after being asked to stop, demanding proof of location and threatening to turn up."],
        care: ["Domestic abuse indicators (controlling money, monitoring, threats, demanding proof of where someone is) can land close to home for some students. Keep everything on fictional characters, give a clear way to pass, and tell students before the session that it is coming up.", "Students should never be advised to investigate or confront someone themselves. The route is a trusted adult or Helen (DSL).", "If anything is disclosed, follow the school's safeguarding procedure and speak to Helen the same day."] }
    ],
    safeguard: ["Let Helen (DSL) know the Tier 3 coercion and domestic abuse strand is being taught this week, and check whether any student needs a heads up or a different plan.", "Image sharing (the TikTok and photo scenarios): if a student mentions an image of themselves being shared, Childline and the IWF's Report Remove service can help get it taken down; tell Helen."],
    clips: [["Snack Attack (short film)", "Tier 2 Skill Up: what did you assume at first, and what changed your mind?"]],
    clipsLine: "Clips the trust plan suggests. They are not on the board, so play them from YouTube if you want them.",
    support: ["Trusted adults in school: Jay, Holly, Helen (DSL)", "Childline: 0800 1111, any time, free", "Report Remove (Childline and the IWF) for an image shared online", "In an emergency: 999"]
  }
};
})();
