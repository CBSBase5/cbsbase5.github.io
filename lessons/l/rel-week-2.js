/* ==========================================================
   Base 5 Lessons - Relational (PSHE and RSE)
   Autumn 2 Week 2 (9 to 13 Nov 2026): Supportive Relationships
   From the trust plan (26/27 SB Relational Pillar), Tier 1 on the
   board for everyone, "Going further" slides for Tiers 2 and 3.
   Sensitive strands and the full tier plan: /lessons/notes.html?l=rel-week-2
   This week started on a Thursday, so it runs in two parts:
     part 1 (Thursday) hook and explore, part 2 (Friday) explain.
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

/* this week's three words, each on a round tile */
function wordsArt(){
  function tile(cx, label, inner, n){
    return '<g data-s="' + n + '"><g class="float" style="animation-delay:-' + n + 's"><circle cx="' + cx + '" cy="128" r="92" fill="' + INK + '"/><circle cx="' + cx + '" cy="120" r="92" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<circle cx="' + cx + '" cy="120" r="78" fill="' + PURPLE + '" opacity=".13"/><g transform="translate(' + cx + ' 120)">' + inner + '</g></g>' + T(cx, 262, label, 34, { a: "middle", f: 1 }) + '</g>';
  }
  var hands = '<path d="M-56 22q10 -26 34 -22l26 6q10 4 4 12q-6 6 -22 2" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round"/><path d="M56 -6q-12 26 -36 22l-20 -4" fill="#9a6b45" stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round"/><path d="M-60 26h-12M60 -10h12" stroke="' + INK + '" stroke-width="10" stroke-linecap="round"/>' +
    '<path class="pulse" d="M0 -48c-8 -14 -28 -8 -22 8c4 10 22 20 22 20s18 -10 22 -20c6 -16 -14 -22 -22 -8z" fill="' + PINK + '" stroke="' + INK + '" stroke-width="3"/>';
  var key = '<g transform="rotate(-30)"><circle cx="-30" cy="0" r="26" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="4"/><circle cx="-30" cy="0" r="10" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="3"/><path d="M-4 0h62v14M38 0v12" stroke="' + INK + '" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M-4 0h62" stroke="' + YELLOW + '" stroke-width="3"/></g>';
  var plant = '<path d="M-26 54h52l-8 -34h-36z" fill="' + ORANGE + '" stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round"/><path d="M0 20v-40" stroke="' + GREEN + '" stroke-width="6"/><path d="M0 -6q-30 -6 -30 -32q26 2 30 32M0 -20q28 -4 30 -30q-26 0 -30 30" fill="' + GREEN + '" stroke="' + INK + '" stroke-width="2.5"/>' +
    '<g transform="translate(46 -46) rotate(-25)"><path d="M-16 0h30v22h-30z" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="3"/><path d="M14 4l22 -12" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/></g><g class="float"><circle cx="18" cy="-22" r="3" fill="#7fc8e0"/><circle cx="10" cy="-10" r="3" fill="#7fc8e0"/></g>';
  return S("0 0 900 290", tile(150, "Support", hands, 1) + tile(450, "Trust", key, 2) + tile(750, "Commitment", plant, 3));
}

/* Alex, Sam and the football row */
function fairArt(){
  return S("0 0 620 440", A.scene(620, 440, { ground: 380, time: "day", sun: [560, 70] }) +
    '<rect x="380" y="250" width="200" height="14" rx="6" fill="#b5793f" stroke="' + INK + '" stroke-width="3"/><path d="M400 264v40M560 264v40" stroke="' + INK + '" stroke-width="6"/>' +
    kid(170, 250, 1.05, { top: ORANGE, hair: "#2b1a0e", mood: "talk" }) + '<g class="float">' + ball(110, 368, 22) + '</g>' +
    kid(470, 240, 1, { top: PURPLE, skin: "#c98e63", hair: "#1c1c1c", long: true, mood: "sad" }) + sketchbook(520, 300) +
    talk(40, 40, 330, ["You HAVE to play", "football."], { size: 28 }) +
    T(170, 430, "Alex", 26, { a: "middle", f: 1 }) + T(470, 430, "Sam", 26, { a: "middle", f: 1 }));
}

/* the fair plan recipe: three stepping stones */
function recipeArt(){
  function stone(cx, cy, n, label, icon){
    return '<g data-s="' + n + '"><ellipse cx="' + cx + '" cy="' + (cy + 12) + '" rx="120" ry="44" fill="' + INK + '"/><ellipse cx="' + cx + '" cy="' + cy + '" rx="120" ry="44" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="5"/>' +
      '<circle cx="' + (cx - 52) + '" cy="' + (cy - 4) + '" r="30" fill="' + PURPLE + '"/>' + T(cx - 52, cy + 8, String(n), 34, { a: "middle", f: 1, c: CREAM }) +
      '<g transform="translate(' + (cx + 22) + ' ' + (cy - 4) + ') scale(.95)" class="float">' + icon + '</g></g>';
  }
  var ear = '<path d="M-14 -20q24 -16 34 6q6 16 -10 26q-8 6 -6 16q2 10 -10 10" fill="#f1c7a1" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/><path d="M28 -18q12 12 0 26M40 -26q20 22 0 44" stroke="' + PURPLE + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
  var bulb = '<path d="M0 -36a24 24 0 0 0 -14 44v8h28v-8a24 24 0 0 0 -14 -44z" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="4"/><path d="M-10 26h20" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>';
  var tick = '<circle r="26" fill="' + GREEN + '" stroke="' + INK + '" stroke-width="4"/><path d="M-12 0l8 9l16 -18" stroke="' + CREAM + '" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
  return S("0 0 560 520", '<path class="dash" d="M170 110Q420 150 390 270T190 430" stroke="' + PURPLE + '" stroke-width="6" fill="none" opacity=".6"/>' +
    stone(170, 110, 1, "Listen to both", ear) + stone(390, 270, 2, "Suggest a plan", bulb) + stone(190, 430, 3, "Check with both", tick));
}

/* two people on a bench, one listening */
function listenArt(){
  return S("0 0 600 440", A.scene(600, 440, { ground: 390, time: "dusk", sun: [80, 90] }) +
    '<rect x="120" y="300" width="380" height="16" rx="6" fill="#b5793f" stroke="' + INK + '" stroke-width="3"/><path d="M150 316v70M470 316v70" stroke="' + INK + '" stroke-width="7"/>' +
    kid(220, 200, 1, { top: TEAL, skin: "#8d5a3b", hair: "#1c1c1c", mood: "sad" }) + kid(400, 200, 1, { top: YELLOW, hair: "#b5793f", long: true }) +
    talk(300, 40, 270, ["I'm listening."], { right: true }) +
    '<g class="float"><path d="M300 190q0 -14 14 -14t14 14q0 12 -14 22q-14 -10 -14 -22z" fill="' + PINK + '" opacity=".8"/></g>' + A.bonnie(540, 360, 0.42, "happy"));
}

/* a support web: you in the middle */
function webArt(){
  var spots = [[300, 70, "Friends"], [520, 170, "Family"], [450, 360, "Jay, Holly, Helen"], [120, 360, "Childline"], [80, 170, "Kooth"]];
  var g = '<rect width="600" height="440" fill="#e8e5fa" rx="20"/>';
  spots.forEach(function(p, i){ g += '<path class="dash" d="M300 220L' + p[0] + ' ' + p[1] + '" stroke="' + PURPLE + '" stroke-width="5"/>'; });
  spots.forEach(function(p, i){
    g += '<g data-s="' + (i + 1) + '"><g class="float" style="animation-delay:-' + i + 's"><circle cx="' + p[0] + '" cy="' + (p[1] + 5) + '" r="46" fill="' + INK + '"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="46" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="4"/>' +
      '<circle cx="' + (p[0] - 10) + '" cy="' + (p[1] - 6) + '" r="4" fill="' + INK + '"/><circle cx="' + (p[0] + 10) + '" cy="' + (p[1] - 6) + '" r="4" fill="' + INK + '"/><path d="M' + (p[0] - 9) + ' ' + (p[1] + 8) + 'q9 8 18 0" stroke="' + INK + '" stroke-width="3" fill="none"/></g>' +
      T(p[0], p[1] + 72, p[2], 24, { a: "middle", f: 1 }) + '</g>';
  });
  g += '<circle cx="300" cy="226" r="62" fill="' + INK + '"/><circle cx="300" cy="220" r="62" fill="' + PURPLE + '" stroke="' + INK + '" stroke-width="5"/>' + T(300, 232, "You", 34, { a: "middle", f: 1, c: CREAM });
  return S("0 0 600 440", g);
}

/* labels and behaviour: four doors */
function labelsArt(){
  var labels = [["Married", PINK, ""], ["Civil", TEAL, "partners"], ["Living", ORANGE, "together"], ["Mates for", GREEN, "years"]];
  var g = "";
  labels.forEach(function(l, i){
    var x = 30 + i * 140;
    g += '<g data-s="' + (i + 1) + '"><rect x="' + x + '" y="60" width="120" height="200" rx="10" fill="' + l[1] + '" stroke="' + INK + '" stroke-width="4"/><circle cx="' + (x + 98) + '" cy="170" r="7" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<rect x="' + (x - 2) + '" y="' + (l[2] ? 0 : 16) + '" width="124" height="' + (l[2] ? 64 : 40) + '" rx="8" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="3"/>' + T(x + 60, l[2] ? 26 : 44, l[0], 21, { a: "middle", f: 1 }) + (l[2] ? T(x + 60, 52, l[2], 21, { a: "middle", f: 1 }) : "") + '</g>';
  });
  g += '<g data-s="5">' + T(300, 320, "Behind every door:", 28, { a: "middle", f: 1 }) + T(300, 360, "listening? respect? or not?", 26, { a: "middle" }) + '</g>';
  return S("0 0 600 380", g);
}

window.B5LESSON = {
  id: "rel-week-2",
  title: "Got your back",
  mins: 15,
  cc: [
    { week: "Remembrance", line: "Remembrance is partly about the people who had each other's backs. Same idea, much smaller scale." }
  ],
  startMins: 4,
  finishMins: 5,
  cover: { line: "What supportive friends actually do. (Spoiler: it is not just being nice.)", art: listenArt() },

  warm: {
    wordle: { word: "TRUST", hint: "Feeling sure someone is honest, reliable and on your side.", say: "Quick one. It's one of this week's words." },
    wyr: {
      a: "Have a mate who always tells you the truth, even when it stings", b: "Have a mate who always makes you laugh, even on rubbish days",
      twist: "Best friends often do a bit of both. Bonnie does neither, but she does sit on your feet.",
      say: "Tap a side each. Ask: which one would you be for someone else?"
    }
  },
  warms: {
    2: { wyr: {
      a: "Be helped by someone who fixes the problem straight away", b: "Be helped by someone who just listens first",
      twist: "Most people want the listening first, even if they think they want fixing. Weird, but true.",
      say: "Tap a side each. Nobody is wrong here."
    } }
  },

  recap: {
    items: [
      { q: "Someone says no to you. What is the owl response?", a: "Accept it: \"OK, no worries.\" No pushing." },
      { q: "A yes you only got by pushing and pushing is...", a: "Pressure, not a real yes." }
    ],
    say: "From the last PHSE lessons."
  },

  objective: {
    formal: "recognise the features of positive, supportive relationships, and how to support someone in a way they actually want.",
    mission: "Spot the helpful moves, make a fair plan, and find support that fits.",
    success: ["Name two things a supportive person does", "Make a plan that listens to both people", "Ask what kind of support someone wants"],
    say: "Read the mission. Three words this week: support, trust, commitment."
  },

  sections: [
    {
      kind: "explore", part: 1, title: "Helpful, hurtful, and fair plans.", mins: 10,
      slides: [
        { title: "This week's words", art: wordsArt(), stack: true, artWidth: 1150,
          text: "<b>Support</b>: helping, in a way they want. <b>Trust</b>: sure they're honest and reliable. <b>Commitment</b>: choosing to keep putting time in.",
          say: "Click through the three. Ask: who in a film or show is properly supportive? (Fictional is fine, no need to name real people.)" },
        {
          type: "sort", title: "Helpful or hurtful?", q: "Sort what friends do. One box is for 'we can't tell yet'.",
          bins: ["Helpful", "Hurtful", "Need more info"],
          cards: [
            { t: "Asking what they'd like to do", b: 0 }, { t: "Laughing at their mistake", b: 1 },
            { t: "Including someone new", b: 0 }, { t: "Talking over them", b: 1 },
            { t: "Keeping a promise", b: 0 }, { t: "Sharing their secret with the group", b: 1 },
            { t: "They spend break on their own", b: 2 }
          ],
          why: "Wanting time alone isn't hurtful on its own. Check in, don't assume.",
          say: "The alone card is the interesting one. Some people recharge on their own, and that's fine."
        },
        { title: "Football or drawing?", art: fairArt(), wideArt: true,
          pts: ["Alex wants football", "Sam wants to draw", "Alex: \"You HAVE to play football.\""], build: true, ptsFrom: 1,
          say: "Ask: has Alex listened to Sam? What might Sam be feeling?" },
        {
          type: "vote", kicker: "Which plans are fair?", title: "Pick the fair ones",
          q: "More than one can be fair. Vote for the one you'd pick.",
          opts: ["Sam has to play football", "Do different things, meet up after", "Draw today, football tomorrow, if both are up for it"],
          why: "B and C both listen to both people. A only listens to Alex. Saying no to a plan, or suggesting a new one, is always allowed.",
          say: "Tap a vote each. Then next shows why."
        },
        { title: "The fair plan recipe", art: recipeArt(), artLeft: true,
          pts: ["Listen to both", "Suggest a plan", "Check: \"Does that work for you?\""], build: true, ptsFrom: 1,
          note: "If it doesn't work, back to step one. That's normal.",
          say: "Model it: 'I'd like football. What would you like? ... Drawing. Could we do drawing first then a kickabout? Does that work for you?'" }
      ],
      check: { q: "Jo wants music on. Alex wants it quiet. Both want to hang out. Fair plan?", opts: ["Quiet game now, music later", "Whoever shouts loudest wins", "Alex just puts up with it"], a: 0, why: "Both people get heard and both get something. That's a fair plan." }
    },
    {
      kind: "explain", part: 2, title: "Support that fits.", mins: 7,
      slides: [
        { title: "Support that fits", art: listenArt(),
          pts: ["\"That sounds...\"", "\"I'm listening.\"", "\"Would you like...?\"", "\"Thanks for telling me.\""], build: true, ptsFrom: 1,
          note: "Listening doesn't mean fixing it straight away.",
          say: "Ask which starter feels most natural to say. 'Would you like...?' is the secret weapon: it lets them choose." },
        {
          type: "predict", title: "Riley needs space",
          q: "Riley loses a game: \"I need a little space.\" Morgan wants to help. Best ending?",
          opts: ["Morgan keeps asking Riley to play again", "\"OK. I'll be nearby if you want company.\"", "Morgan tells everyone Riley is being difficult"],
          a: 1,
          why: "Morgan respects Riley's choice and leaves the door open. Support that fits.",
          say: "Ask: what might Riley be feeling? How does B show support without taking over?"
        },
        {
          type: "predict", kicker: "Wobble, or worry?", title: "Taylor and Charlie",
          q: "When Charlie says no, Taylor says: \"Then I'll tell everyone not to be your friend.\" Taylor does this a lot.",
          opts: ["Normal friendship wobble", "Needs a trusted adult"],
          a: 1,
          why: "Everyone has wobbles. Threats every time someone chooses differently is control, not friendship. Tell a trusted adult.",
          say: "Contrast with Alex and Sam: they disagreed, listened, and still met up at lunch. That's a wobble."
        },
        { kicker: "Going further", title: "A label isn't a guarantee", art: labelsArt(),
          text: "Married, civil partners, living together, mates for years. The label says nothing about whether people treat each other well.",
          say: "Tier 2 and 3. Skip if not needed. Married and civil partners: legal. Living together: cohabiting, not a legal status on its own. Ask: does married guarantee healthy? (No.)" },
        {
          type: "predict", kicker: "Going further", title: "The only one who understands",
          q: "Chloe messages Alex every night about her problems. Alex is shattered. Chloe: \"You're the only one who understands.\" Best move?",
          opts: ["Agree a time to talk, and help Chloe find other support too", "Reply whenever, forever", "Just ignore her"],
          a: 0,
          why: "You can care about someone and not be their only support. Better for both of them.",
          say: "Tier 2 and 3. Relying on someone vs expecting them to do everything. Who else could Chloe go to?"
        }
      ],
      check: { q: "A mate says: \"I don't really want to talk about it.\" Supportive reply?", opts: ["\"OK. I'm here if you change your mind.\"", "\"Just tell me, it'll help.\"", "\"Fine, whatever.\""], a: 0, why: "They get to choose. The door stays open." }
    }
  ],

  realworld: {
    title: "Your support web",
    text: "Nobody should be anyone's only support. Friends, family, trusted adults here, and services like Childline (0800 1111) and Kooth.",
    art: webArt(),
    say: "Click to build the web. Childline is free, any time. Kooth is online support for young people. Say: you never have to manage everything on your own."
  },

  exit: [
    { q: "Which is a supportive move?", opts: ["\"Would you like company, or space?\"", "Telling their secret so others understand", "Making them join in"], a: 0, why: "Asking lets them choose what support they want." },
    { q: "A fair plan...", opts: ["Listens to both people", "Gives the loudest person what they want"], a: 0, why: "Listen to both, suggest a plan, check with both." }
  ],

  driving: {
    angle: "If you time travelled, would you want someone with you who's got your back? (No need to say who.)",
    opts: ["Yes, definitely", "No, solo trip", "Pass"],
    say: "Keep it general. Who would be a good time travel buddy, in a film or book?"
  },

  surprise: { at: "sections.0.slides.2", kind: "bonnie", x: 1420, y: 640, w: 130, say: "Bonnie's fair plan: you play football, she steals the ball. Everyone wins. Mostly Bonnie." },

  notes: {
    week: "Autumn 2, Week 2 (9 to 13 November 2026)",
    theme: "Supportive Relationships",
    words: [["Support", "Helping, encouraging or caring for someone through your words or actions."], ["Trust", "Feeling confident that someone is honest, reliable and respects you."], ["Commitment", "Choosing to put time, care and effort into maintaining a relationship."]],
    extraWords: "Tier 2 adds: listening, reliability, privacy, marriage, civil partnership, cohabitation, lust and attraction.",
    car: [
      ["Tiers 1 and 2", "What does a supportive person do? Who is a supportive person in your life? Who is a supportive person from your favourite TV show or book? Why?"],
      ["Tier 3", "Can a relationship be fair if people contribute different things? What is the difference between relying on someone and expecting them to do everything?"]
    ],
    shape: [
      ["Monday 9 Nov", "Already gone this week (the week started before the plan was switched over)."],
      ["Thursday, part 1: hook and explore", "Trust Motivation Monday (Helpful or Hurtful sort) and Taskmaster Tuesday (Building a fair plan: listen to both, suggest a plan, check with both)."],
      ["Friday, part 2: explain", "Therapeutic Thursday (supportive response starters), the Skill Up 'Choose the ending' (Riley and Morgan), Focus Friday (Good connections: ordinary difficulty or behaviour that needs support), and two Going further slides from Tiers 2 and 3."],
      ["Off the board", "Wondering Wednesday (Do people feel different things? feeling cards) is a trip day: it works as a Car Chat on the way, or a Breathe Out."]
    ],
    tiers: [
      { n: 1, target: "I can explore positive qualities of healthy relationships",
        milestones: ["I understand the features of positive and stable relationships", "I understand that relationships can cause strong feelings and emotions", "I understand that all relationships have positive and less positive aspects"],
        board: "Everything on the board is pitched here.",
        more: ["Feeling cards (sad, worried, happy, annoyed, jealous, frustrated, angry) against: a friend forgets your birthday, a friend is absent, a friend gets a puppy, a friend finishes work before you, a friend invites you to a party. Talk about why people picked different feelings.", "Skill Up mission: Sam stands near a game but doesn't speak. Can we know how Sam feels? 'Would you like to join, watch first or do something else?' beats 'You have to play with us.'"] },
      { n: 2, target: "I can explore being in control of myself and still have successful and healthy relationships",
        milestones: ["I can identify characteristics and benefits of positive, strong, supportive relationships", "I can identify types of long-term relationships, including their legal status", "I can outline the differences between lust, attraction and attachment", "I can differentiate the elements present in different types of long-term relationship"],
        board: "Friday's Going further slides: 'A label isn't a guarantee' and 'The only one who understands'.",
        more: ["Listening, reliability (doing what you agreed, or explaining a change) and respecting privacy (asking before sharing someone's information).", "Carrie and Jamie have lived together for eight years and care about each other. Can we tell their status? (No: married, civil partners, cohabiting or friends are all possible.)", "Lust, attraction and attachment can overlap; attachment happens with friends and family too. Having a feeling doesn't mean acting on it, and doesn't tell you what the other person feels.", "Skill Up: Ned finds out Peter's secret (Spider-Man: Homecoming). Write the next scene keeping the friendship supportive. Closeness does not remove someone's right to privacy."] },
      { n: 3, target: "I can explore healthy, long-term relationships",
        milestones: ["I can identify types of long-term relationships, including their legal status", "I can outline the differences between lust, attraction and attachment", "I can differentiate the elements present in different types of long-term relationships", "I understand the benefits of healthier relationships and connection"],
        board: "Friday's Going further slides.",
        more: ["Relationship Detectives: identify the type (vows at a legal wedding; registered civil partners; couple sharing a home, not formalised; together twelve years) then the behaviour (reading all private messages; respecting separate friendships; sharing jobs fairly; threats when they disagree). A label can't tell you whether people treat each other well.", "Important in both, or depends on circumstances: close friends vs adult partners sharing a home. Listening matters in both; household costs depend on circumstances.", "Case B: civil partners living apart; Jo asks for constant location sharing and Kim is uncomfortable but worried refusing seems uncaring. Is Jo's anxiety a reason to agree? Shared principles: privacy, independence, reliability, listening, freedom from pressure."],
        care: ["Location sharing and checking messages are early signs of controlling behaviour. Keep it on fictional characters, and if a student connects it to home or their own relationships, follow it up afterwards and talk to Helen (DSL)."] }
    ],
    clips: [["For the Birds (Pixar short, pause at 2:30)", "Tier 1 Skill Up: how the small birds treat the big bird who tries to join. Notice one action you'd change."], ["Spider-Man: Homecoming, Ned finds out", "Tier 2 Skill Up: surprise, privacy and friendship."], ["Zootopia, the gondola scene", "Tier 3 Skill Up: Nick shares something painful; what does Judy do that shows empathy?"]],
    clipsLine: "Clips the trust plan suggests. They are not on the board (film clips can't be drawn in code), so play them from YouTube if you want them.",
    support: ["Trusted adults in school: Jay, Holly, Helen (DSL)", "Childline: 0800 1111, any time, free", "Kooth (online support for young people)", "YoungMinds", "The Mix (peer chat is for 16 plus)"]
  }
};
})();
