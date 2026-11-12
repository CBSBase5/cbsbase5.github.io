/* ==========================================================
   Base 5 Lessons - Relational (PSHE and RSE)
   Autumn 2 Week 6 (7 to 11 Dec 2026): Personal Safety
   The trust plan leaves this week blank, so it is written from the
   Autumn 2 overview targets and milestones for each tier. Tier 1 on
   the board for everyone, "Going further" slides for Tiers 2 and 3.
   Sensitive strands and the full tier plan: /lessons/notes.html?l=rel-week-6
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


/* four places: home, school, out and about, online */
function placesArt(){
  function card(x, n, label, inner){
    return '<g data-s="' + n + '"><g class="float" style="animation-delay:-' + n + 's"><rect x="' + x + '" y="40" width="250" height="230" rx="22" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<g transform="translate(' + (x + 125) + ' 150)">' + inner + '</g>' + T(x + 125, 250, label, 28, { a: "middle", f: 1 }) + '</g></g>';
  }
  var home = '<path d="M-60 0l60 -54l60 54v54h-120z" fill="' + ORANGE + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/><rect x="-16" y="20" width="32" height="34" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="3"/><path d="M-70 4l70 -64l70 64" fill="none" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/>';
  var school = '<rect x="-64" y="-30" width="128" height="84" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="4"/><path d="M-74 -30h148l-74 -40z" fill="' + PINK + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/><rect x="-44" y="-10" width="24" height="20" fill="#bfe6ef" stroke="' + INK + '" stroke-width="3"/><rect x="20" y="-10" width="24" height="20" fill="#bfe6ef" stroke="' + INK + '" stroke-width="3"/><rect x="-12" y="20" width="24" height="34" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="3"/>';
  var out = '<g transform="translate(0 50) scale(1.2)">' + A.icon("bus", 0, 0, 1) + '</g><path d="M-80 54h160" stroke="' + INK + '" stroke-width="4"/>';
  var online = '<g transform="translate(0 50) scale(1.1)">' + A.icon("phone", 0, 0, 1) + '</g><g class="pulse"><circle cx="34" cy="-50" r="14" fill="' + PINK + '" stroke="' + INK + '" stroke-width="3"/>' + T(34, -44, "1", 16, { a: "middle", f: 1, c: CREAM }) + '</g>';
  return S("0 0 1100 300", card(20, 1, "Home", home) + card(290, 2, "School", school) + card(560, 3, "Out and about", out) + card(830, 4, "Online", online));
}
/* a dodgy message on a phone */
function phoneArt(lines, from){
  var g = '<rect width="560" height="440" rx="22" fill="#e8e5fa"/><g transform="translate(150 20)"><rect width="260" height="400" rx="36" fill="' + INK + '"/><rect x="14" y="40" width="232" height="320" rx="10" fill="' + CREAM + '"/>' +
    '<rect x="14" y="40" width="232" height="44" fill="#d7d1f2"/>' + T(130, 70, from, 18, { a: "middle", f: 1 }) +
    '<rect x="28" y="100" width="200" height="' + (30 + lines.length * 26) + '" rx="14" fill="#e6f6fb" stroke="' + INK + '" stroke-width="2"/>' +
    lines.map(function(l, i){ return T(42, 128 + i * 26, l, 17, { b: 1 }); }).join("") + '</g>' +
    '<g data-s="1"><g class="wobble"><g transform="translate(440 120)">' + ICON.warning + '</g></g></g>';
  return S("0 0 560 440", g);
}
/* stop, think, choose, tell */
function stctArt(){
  var st = [["Stop", PINK], ["Think", YELLOW], ["Choose", TEAL], ["Tell", PURPLE]], g = '<rect width="1200" height="300" rx="22" fill="#e8e5fa"/>';
  st.forEach(function(s, i){
    var cx = 150 + i * 300;
    g += '<g data-s="' + (i + 1) + '"><g class="float" style="animation-delay:-' + i + 's"><path d="M' + (cx - 70) + ' 70h140l40 70l-40 70h-140l-40 -70z" fill="' + INK + '" transform="translate(0 8)"/><path d="M' + (cx - 70) + ' 70h140l40 70l-40 70h-140l-40 -70z" fill="' + s[1] + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
      T(cx, 152, s[0], 40, { a: "middle", f: 1, c: i === 1 ? INK : CREAM }) + '</g></g>';
  });
  return S("0 0 1200 300", g + A.bonnie(1150, 270, 0.4, "happy"));
}

window.B5LESSON = {
  id: "rel-week-6",
  title: "Safe moves",
  mins: 15,
  cc: [
    { week: "STEAM for Good", line: "Loads of safety stuff (seatbelts, smoke alarms, the report button) was invented by people solving a problem for good." }
  ],
  startMins: 4,
  finishMins: 5,
  cover: { line: "Spotting risk, trusting your gut, and picking the safe move. Home, school, out and about, and online.", art: S("0 0 560 400", A.scene(560, 400, { ground: 340, time: "dusk", sun: [470, 70] }) + kid(200, 190, 1.1, { top: TEAL, hair: "#2b1a0e" }) + '<g transform="translate(360 200) scale(1.3)" class="float">' + ICON.shield + '</g>' + A.bonnie(470, 310, 0.45, "happy")) },

  warm: {
    wordle: { word: "SAFE", hint: "Protected from harm, and feeling OK.", say: "Four letters." },
    wyr: {
      a: "Have a superpower that warns you about danger", b: "Have a superpower that gets you out of danger",
      twist: "You already have a bit of the first one. It's called your gut feeling.",
      say: "Tap a side each."
    }
  },
  warms: {
    2: { wordle: { word: "SCAM", hint: "A trick to get your money or details.", say: "Quick one." } },
    3: { wyr: {
      a: "Always tell someone where you're going", b: "Always have a charged phone",
      twist: "The real answer is both. But if you had to pick, telling someone wins.",
      say: "Tap a side each."
    } }
  },

  recap: {
    items: [
      { q: "Influence or pressure: \"Do it or I'll tell everyone\"?", a: "Pressure. A threat makes no too costly." },
      { q: "The choice steps?", a: "Notice, think, choose. And you can change your mind." }
    ],
    say: "From last week."
  },

  objective: {
    formal: "know basic safety rules in different places, recognise risks, and choose a safe action, including online.",
    mission: "Become a risk spotter, and learn the safe moves.",
    success: ["Name a safety rule for home, school, out and online", "Spot a risk in a situation", "Pick a safe action, and who to tell"],
    say: "Three words this week: safe, risk, trusted adult."
  },

  sections: [
    {
      kind: "hook", part: 1, title: "Safety everywhere.", mins: 8,
      slides: [
        { title: "This week's words", stack: true, artWidth: 1150,
          art: tiles([["Safe", ICON.shield], ["Risk", ICON.warning], ["Trusted adult", ICON.adult]]),
          text: "<b>Safe</b>: protected, and feeling OK. <b>Risk</b>: a chance something goes wrong. <b>Trusted adult</b>: a grown-up who listens and helps.",
          say: "Ask: who are trusted adults for you? (Here: Jay, Holly, Helen. At home: whoever it is for you.) No need to name them out loud." },
        { title: "Four places", art: placesArt(), stack: true, artWidth: 1150,
          text: "Every place has its own safety rules. Some you already know without thinking.",
          say: "Click through. Ask for one rule for each before the sort." },
        {
          type: "sort", title: "Which place is this rule for?", q: "Sort the safety rules.",
          bins: ["Home", "School", "Out and about", "Online"],
          cards: [
            { t: "Don't open the door to strangers", b: 0 }, { t: "Know where the fire exits are", b: 1 },
            { t: "Cross at a crossing", b: 2 }, { t: "Keep passwords private", b: 3 },
            { t: "Tell staff if you leave the room", b: 1 }, { t: "Tell someone where you're going", b: 2 },
            { t: "Don't share your location publicly", b: 3 }, { t: "Don't leave the hob on", b: 0 }
          ],
          why: "Some rules work in more than one place. Telling someone where you are works everywhere.",
          say: "Argue about the edge cases. That's the good bit."
        }
      ],
      check: { q: "A trusted adult is someone who...", opts: ["Listens and helps keep you safe", "Is just older than you", "You met online"], a: 0, why: "Listens and helps. Being older isn't enough on its own." }
    },
    {
      kind: "explore", part: 2, title: "Risk spotter.", mins: 10,
      slides: [
        { title: "Your built-in alarm", art: body([[200, 90, "Uneasy feeling", 1], [222, 190, "Heart speeds up", 2], [200, 250, "Tummy flips", 3], [120, 330, "Want to get away", 4]]), artLeft: true,
          text: "Your body often spots risk before your brain does. If something feels off, take it seriously.",
          say: "Your gut isn't always right, but it's always worth listening to. Step back, then think." },
        {
          type: "predict", title: "You've won!",
          q: "A message: \"You've WON a new phone! Tap the link and enter your bank details in 10 mins!\" Safe move?",
          opts: ["Don't tap. Delete it, or show a trusted adult", "Tap fast before time runs out", "Send it to your mates so they can win too"],
          a: 0,
          why: "Rushing you, a prize from nowhere, and asking for details: three scam signs at once.",
          say: "The hurry is the giveaway. Real prizes don't need your bank details in ten minutes."
        },
        { title: "Spot the signs", art: phoneArt(["Hey, you seem really", "mature for your age.", "Don't tell anyone we", "chat ok? Send a pic?"], "new_friend_99"), artLeft: true,
          pts: ["Too much, too fast", "Keep it secret", "Asking for photos"], build: true, ptsFrom: 1,
          say: "Someone you don't know in real life. Safe moves: don't reply, block, report, tell a trusted adult. You're never in trouble for telling." },
        {
          type: "vote", kicker: "Risky, or fine?", title: "Quick fire",
          q: "Walking home alone in the dark with headphones on, phone on 3%.",
          opts: ["Fine", "A bit risky", "Risky"],
          why: "It's not about panic. Small changes help: one ear free, phone charged, someone knows when you'll be home.",
          say: "Try a couple more out loud: lending your login to a mate; posting your school uniform and street on a public account."
        },
        { kicker: "Going further", title: "Images can't be unsent",
          art: S("0 0 560 420", '<rect width="560" height="420" rx="22" fill="#e8e5fa"/><g transform="translate(140 260) scale(1.4)">' + A.icon("phone", 0, 0, 1) + '</g>' + '<g class="drift"><rect x="250" y="80" width="90" height="70" rx="8" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="3"/><rect x="330" y="160" width="90" height="70" rx="8" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="3"/><rect x="420" y="70" width="90" height="70" rx="8" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="3"/></g>' + T(280, 360, "Once it's sent, it's out of your hands.", 24, { a: "middle", f: 1 })),
          text: "Someone pressuring you for a photo is never your fault. If an image gets shared, there is help to get it taken down.",
          say: "Tiers 2 and 3. Childline and the IWF run Report Remove for under 18s. Sharing nudes of anyone under 18 is illegal, even of yourself, but the school's job is to help, not to get you in trouble. Details in the staff notes." }
      ],
      check: { q: "An online stranger says: \"Keep our chats secret.\" That's...", opts: ["A warning sign: tell a trusted adult", "Normal, they're just private", "A compliment"], a: 0, why: "Safe adults don't ask young people to keep secrets from other adults." }
    },
    {
      kind: "explain", part: 3, title: "The safe move.", mins: 6,
      slides: [
        { title: "Stop, think, choose, tell", art: stctArt(), stack: true, artWidth: 1150,
          text: "When something feels risky: stop, think about your options, choose the safest one, and tell someone.",
          say: "Telling isn't grassing. It's the bit that gets help." },
        {
          type: "predict", title: "Meet up?",
          q: "Someone you've only met online wants to meet up, just you two. Safe move?",
          opts: ["Tell a trusted adult before anything else", "Go, but tell them to meet somewhere busy", "Go and don't tell anyone"],
          a: 0,
          why: "Tell first. People online aren't always who they say they are. A trusted adult can help you decide safely.",
          say: "Ask: why might they want it to be just the two of you?"
        },
        {
          type: "predict", title: "The video",
          q: "A mate shows you a video that makes you feel really uncomfortable. Safe move?",
          opts: ["Say \"Not for me\", look away, tell someone if it keeps bugging you", "Keep watching so you don't look soft", "Share it so it's not just you"],
          a: 0,
          why: "Your feelings are information. You can step away, and talking about it helps.",
          say: "If anyone's seen something that's stuck with them, they can talk to Jay, Holly or Helen. No trouble."
        },
        { kicker: "Going further", title: "When it's serious", art: tiles([["999", ICON.warning], ["Childline", ICON.adult], ["CEOP", ICON.shield]]), stack: true, artWidth: 1100,
          text: "<b>999</b>: danger right now. <b>Childline</b>: 0800 1111, any time. <b>CEOP</b>: report someone online making you feel unsafe.",
          say: "Tiers 2 and 3. CEOP is part of the National Crime Agency; the report button is on its Safety Centre site. 101 is the police for non-emergencies." }
      ],
      check: { q: "The last step of the safe move is...", opts: ["Tell someone", "Keep it to yourself", "Post about it"], a: 0, why: "Tell. That's how help arrives." }
    }
  ],

  realworld: {
    title: "Safety, grown up",
    text: "Travelling on your own. Your first job, with its fire drills and safety training. Your own flat, with its locks and smoke alarm. The safe moves come with you.",
    art: S("0 0 560 420", A.scene(560, 420, { ground: 340, time: "night", sun: [470, 70] }) + '<g transform="translate(150 330) scale(1.3)">' + A.icon("bus", 0, 0, 1) + '</g>' + kid(360, 200, 1, { top: ORANGE, skin: "#c98e63", hair: "#1c1c1c", long: true }) + '<g transform="translate(470 230) scale(.6)">' + ICON.shield + '</g>'),
    say: "Ask: which of these would you most like to feel ready for?"
  },

  exit: [
    { q: "\"Enter your bank details in 10 minutes to claim your prize!\" is...", opts: ["A scam", "A lucky day"], a: 0, why: "Hurry plus details plus a prize from nowhere: scam." },
    { q: "Stop, think, choose...", opts: ["Tell", "Forget"], a: 0, why: "Tell. Always the last step." }
  ],

  driving: {
    angle: "Time travel would be the riskiest trip ever. Would you still go? What would your safe moves be?",
    opts: ["Still going", "Too risky", "Pass"],
    say: "Fun one to end the term's PHSE on. What safety rule would you need in 1066? In 3026?"
  },

  surprise: { at: "sections.0.slides.1", kind: "bambi", x: 1420, y: 640, w: 120, say: "Bambi's safety rule: never stand where Bonnie is about to zoom. Learned the hard way." },

  notes: {
    week: "Autumn 2, Week 6 (7 to 11 December 2026)",
    theme: "Personal Safety",
    written: "The trust plan has no activities for this week (blank template), so this week was written for Base 5 from the Autumn 2 overview targets and milestones, in the same shape as Weeks 1 to 4. Swap in the trust's version if one arrives.",
    words: [["Safe", "Protected from harm, and feeling OK."], ["Risk", "A chance that something could go wrong or cause harm."], ["Trusted adult", "A grown-up you can go to who will listen and help keep you safe."]],
    car: [["Tiers 1 and 2", "Where do you feel safest, and why? What would you do if something online made you feel uneasy?"], ["Tier 3", "Why might someone not tell anyone when something online goes wrong? What would make it easier?"]],
    shape: [
      ["Monday, part 1: hook", "Words of the week, four places, and the Which place is this rule for? sort (Tier 1 milestone: basic safety rules in familiar settings)."],
      ["Thursday, part 2: explore", "Built-in alarm, the scam message, spot the signs (grooming red flags online), risky or fine, and a Going further slide on images."],
      ["Friday, part 3: explain", "Stop, think, choose, tell; meeting up; the uncomfortable video; and a Going further slide on where to report and get help."],
      ["Off the board", "Wednesday is a trip day: a good chance to talk through real safety rules out and about on the way."]
    ],
    tiers: [
      { n: 1, target: "I can identify basic safety rules and strategies for personal safety in different settings (home, school, community, online)",
        milestones: ["I can identify basic safety rules in familiar settings", "I can recognise potential risks in different environments", "I can choose a safe action in a given situation"],
        board: "Everything on the board is pitched here.",
        more: ["Make a safety card to keep: three trusted adults (or places), one safe phrase ('I need to check with someone first'), and Childline's number.", "Walk the route on the trip: point out real safety rules at the bus stop, the road and the venue. Students choose the safe action at one point of the day.", "Online settings check, one to one, on the student's own apps if they're happy to: who can see my posts, is my location off, how do I block and report?"] },
      { n: 2, target: "I can explore power in relationships",
        milestones: ["I understand what is meant by consent in all personal relationships, including sexual ones, and understand capacity and withdrawing consent", "I can recognise situations where boundaries may be crossed"],
        board: "Thursday's 'Images can't be unsent' and Friday's 'When it's serious'.",
        more: ["Sharing images (small group): creating or sharing a nude or semi-nude image of anyone under 18 is illegal, including of yourself. Schools follow national guidance and respond to it as a safeguarding issue, not to criminalise young people. Report Remove (Childline and the IWF) helps under 18s get images taken down.", "Pressure for images is a crossed boundary, whoever it comes from (a stranger, a friend or a boyfriend or girlfriend). Withdrawing consent applies here too: 'I've changed my mind, please delete it.'", "Online scams and peer pressure: what the pressure looks like (hurry, secrecy, flattery, threats) and what a safe action is."] },
      { n: 3, target: "I can explore what unhealthy relationships look like",
        milestones: ["I know the support available when relationships are unsafe and recognise the indicators of domestic abuse", "I know what female genital mutilation (FGM) and breast ironing or flattening are and why they are illegal"],
        board: "Friday's 'When it's serious' slide only. Nothing below goes on the board.",
        more: ["Sextortion (small group): someone threatens to share an image unless the young person sends more or pays. Don't pay, don't send more, stop replying, keep the messages, tell a trusted adult, report to CEOP. It is never the young person's fault, and help is available even if they sent something first.", "FGM (staff led, factual and brief): cutting or changing a girl's or woman's genitals for no medical reason. It has been illegal in the UK since 1985; it is also illegal to take someone abroad for it. It causes serious lifelong harm. Breast ironing or flattening (pressing or pounding a girl's developing breasts) is child abuse. Both are safeguarding matters: anyone worried should tell a trusted adult.", "Support when relationships are unsafe: trusted adult, Helen (DSL), Childline, the National Domestic Abuse Helpline (0808 2000 247), 999 in an emergency. Children who see or hear domestic abuse are victims of it too."],
        care: ["Teachers have a legal duty to report to the police if a girl under 18 tells them she has had FGM, or if they see signs of it, as well as telling Helen (DSL). Know this before teaching the FGM strand.", "Plan the FGM, sextortion and domestic abuse content with Helen first. Small group or one to one only, never in front of Tier 1 students, never as a game, with a way to step out without explaining.", "Any disclosure: listen, don't promise secrecy, don't investigate, record it in the student's own words, and pass it to Helen the same day."] }
    ],
    safeguard: ["Let Helen (DSL) know when the Tier 2 image and Tier 3 FGM, sextortion and domestic abuse content is planned, and check whether any student needs a heads up or a different plan.", "Check the school's online safety and RSE policies for how image sharing incidents are handled, so you can say accurately what happens if a student tells you."],
    support: ["Trusted adults in school: Jay, Holly, Helen (DSL)", "Childline: 0800 1111, any time, free", "Report Remove (Childline and the IWF): getting an image taken down", "CEOP Safety Centre: report online abuse or grooming", "National Domestic Abuse Helpline: 0808 2000 247", "Police: 999 in an emergency, 101 otherwise"]
  }
};
})();
