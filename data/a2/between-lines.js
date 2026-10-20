/* Base 5 Autumn 2 activity: Between the lines.
   English. Working out ideas that are suggested but not said: inference from pictures and texts. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, extra){ return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (/fill=/.test(extra || "") ? "" : ' fill="#141a33"') + ' ' + (extra || "") + '>' + s + '</text>'; }

/* clue + what I know = idea, with a dripping umbrella by a door */
var RAIN = '<svg viewBox="0 0 520 240" role="img" aria-label="A dripping umbrella and a puddle by a door. Clue plus what I know makes an idea.">' +
  '<rect width="520" height="240" rx="16" fill="#f4f1ea"/>' +
  /* door */
  '<rect x="30" y="20" width="96" height="160" rx="4" fill="#8a5a36" stroke="#141a33" stroke-width="3"/><circle cx="112" cy="104" r="5" fill="#ffd23f"/>' +
  '<path d="M20 180h300" stroke="#141a33" stroke-width="3"/>' +
  /* umbrella leaning */
  '<g transform="translate(170 64) rotate(14)"><path d="M-34 30q34 -52 68 0q-11 -8 -22 0q-12 -9 -24 0q-11 -8 -22 0z" fill="#22b8e6" stroke="#141a33" stroke-width="2.5"/><path d="M0 30v80q0 10 -9 10" fill="none" stroke="#141a33" stroke-width="3"/></g>' +
  /* drips and puddle */
  '<path d="M150 112q3 6 0 9q-3 -3 0 -9zM200 124q3 6 0 9q-3 -3 0 -9zM178 150q3 6 0 9q-3 -3 0 -9z" fill="#22b8e6"/>' +
  '<ellipse cx="170" cy="182" rx="56" ry="9" fill="#22b8e6" fill-opacity=".55"/>' +
  /* wet boots */
  '<path d="M236 150h22v22h18q8 0 8 8h-48z" fill="#2f6f8f" stroke="#141a33" stroke-width="2"/><path d="M266 150h22v22h18q8 0 8 8h-48z" fill="#2f6f8f" stroke="#141a33" stroke-width="2"/>' +
  /* the sum */
  '<g ' + F + ' font-size="14" font-weight="700" fill="#141a33">' +
  '<rect x="340" y="22" width="160" height="44" rx="10" fill="#ffd23f"/><text x="420" y="49" text-anchor="middle">Clue: wet things</text>' +
  '<text x="420" y="88" text-anchor="middle" font-size="20">+</text>' +
  '<rect x="340" y="98" width="160" height="44" rx="10" fill="#9be3c6"/><text x="420" y="118" text-anchor="middle" font-size="13">What I know: rain</text><text x="420" y="134" text-anchor="middle" font-size="13">makes things wet</text>' +
  '<text x="420" y="168" text-anchor="middle" font-size="20">=</text>' +
  '<rect x="340" y="178" width="160" height="44" rx="10" fill="#fff" stroke="#141a33" stroke-width="2.5"/><text x="420" y="205" text-anchor="middle">Idea: it rained</text></g>' +
  '</svg>';

/* a party table */
var PARTY = '<svg viewBox="0 0 520 220" role="img" aria-label="A table with a cake with candles, balloons and a wrapped present">' +
  '<rect width="520" height="220" rx="16" fill="#fff4e0"/>' +
  '<path d="M60 160h400" stroke="#8a5a36" stroke-width="10" stroke-linecap="round"/><path d="M90 160v50M430 160v50" stroke="#8a5a36" stroke-width="8"/>' +
  /* cake */
  '<rect x="200" y="112" width="120" height="44" rx="6" fill="#ff8fb1" stroke="#141a33" stroke-width="2.5"/><path d="M200 126q15 10 30 0t30 0t30 0t30 0" fill="none" stroke="#fff" stroke-width="5"/>' +
  [224, 248, 272, 296].map(function(x){ return '<rect x="' + (x - 3) + '" y="92" width="6" height="20" fill="#22b8e6"/><path d="M' + x + ' 80q6 6 0 12q-6 -6 0 -12z" fill="#ffb300"/>'; }).join("") +
  /* present */
  '<rect x="350" y="122" width="54" height="34" fill="#8a5cf6" stroke="#141a33" stroke-width="2.5"/><path d="M377 122v34M350 138h54" stroke="#ffd23f" stroke-width="5"/><path d="M377 122q-14 -16 -16 -2q12 6 16 2q14 -16 16 -2q-12 6 -16 2" fill="#ffd23f"/>' +
  /* balloons */
  '<ellipse cx="110" cy="56" rx="24" ry="30" fill="#ff5d5d"/><path d="M110 86q-6 30 6 72" fill="none" stroke="#141a33" stroke-width="1.5"/>' +
  '<ellipse cx="150" cy="44" rx="22" ry="28" fill="#19c39a"/><path d="M150 72q8 40 -6 86" fill="none" stroke="#141a33" stroke-width="1.5"/>' +
  A.egg(A.bird(470, 40, 0.75, "#ffd23f"), "A bird, invited to the party. It brought seeds. Jay would say that is the best present.") +
  '</svg>';

/* a table someone left in a hurry */
var HURRY = '<svg viewBox="0 0 520 220" role="img" aria-label="A half eaten sandwich, a chair knocked back, a phone left behind and the door wide open">' +
  '<rect width="520" height="220" rx="16" fill="#eef3fb"/>' +
  '<rect x="400" y="20" width="90" height="170" fill="#141a33"/><path d="M400 20l-40 16v170l40 -16z" fill="#8a5a36" stroke="#141a33" stroke-width="2"/>' +
  '<path d="M40 140h220" stroke="#8a5a36" stroke-width="10" stroke-linecap="round"/><path d="M70 140v60M230 140v60" stroke="#8a5a36" stroke-width="8"/>' +
  /* sandwich with a bite out */
  '<ellipse cx="100" cy="132" rx="46" ry="8" fill="#fff" stroke="#141a33" stroke-width="2"/>' +
  '<path d="M70 128l50 -26 10 22q-8 2 -10 8q-8 -2 -12 6z" fill="#f2d091" stroke="#141a33" stroke-width="2"/>' +
  /* mug */
  '<rect x="150" y="106" width="30" height="30" rx="4" fill="#ff5d8f" stroke="#141a33" stroke-width="2"/><path d="M180 112q12 0 12 9t-12 9" fill="none" stroke="#141a33" stroke-width="2.5"/>' +
  /* phone */
  '<rect x="200" y="122" width="40" height="14" rx="3" fill="#141a33"/><rect x="204" y="125" width="32" height="8" rx="2" fill="#22b8e6"/>' +
  /* chair knocked back */
  '<g transform="translate(318 196) rotate(-24)"><path d="M0 0v-40h40v40M0 -40v-56" fill="none" stroke="#5b6180" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>' +
  '</svg>';

/* muddy prints to the sofa, Bonnie on top */
var MUDDY = '<svg viewBox="0 0 520 230" role="img" aria-label="Muddy paw prints lead from an open door to a sofa, where Bonnie is sitting">' +
  '<rect width="520" height="230" rx="16" fill="#f4f1ea"/>' +
  '<rect x="20" y="30" width="80" height="160" fill="#9be3c6"/><path d="M20 30h80v160h-80z" fill="none" stroke="#141a33" stroke-width="3"/><path d="M100 30l30 14v160l-30 -14z" fill="#8a5a36" stroke="#141a33" stroke-width="2"/>' +
  '<path d="M10 200h500" stroke="#141a33" stroke-width="3"/>' +
  [[140, 196], [172, 186], [204, 196], [236, 186], [268, 196], [300, 186], [330, 194]].map(function(p){
    return '<g transform="translate(' + p[0] + ' ' + p[1] + ') scale(.9)" fill="#6b4a2a"><ellipse cx="0" cy="4" rx="6" ry="5"/><circle cx="-6" cy="-4" r="2.6"/><circle cx="-2" cy="-7" r="2.6"/><circle cx="3" cy="-7" r="2.6"/><circle cx="7" cy="-4" r="2.6"/></g>';
  }).join("") +
  /* sofa */
  '<rect x="350" y="110" width="150" height="70" rx="14" fill="#3a6fb0" stroke="#141a33" stroke-width="3"/><rect x="340" y="130" width="24" height="56" rx="10" fill="#2f5d96" stroke="#141a33" stroke-width="3"/><rect x="486" y="130" width="24" height="56" rx="10" fill="#2f5d96" stroke="#141a33" stroke-width="3"/>' +
  '<path d="M380 168q6 -4 10 0M420 172q6 -4 10 0" stroke="#6b4a2a" stroke-width="5" stroke-linecap="round"/>' +
  A.bonnie(425, 108, 0.75, "sit") +
  A.egg('<g transform="translate(470 196)"><path d="M-14 -4q-8 -6 -2 -10q6 0 6 6h20q0 -6 6 -6q6 4 -2 10q8 6 2 10q-6 0 -6 -6h-20q0 6 -6 6q-6 -4 2 -10z" fill="#fff" stroke="#141a33" stroke-width="1.5"/></g>', "A bone under the sofa. Or is it one of Jay's socks? My ears are not a toilet, and this sofa is not a bin.") +
  '</svg>';

/* show, do not tell: highlighted clue words */
var SHOW = '<svg viewBox="0 0 520 210" role="img" aria-label="A sentence with the clue words slammed, threw and not a word picked out, pointing to the idea: angry or upset">' +
  '<rect width="520" height="210" rx="16" fill="#fffbe0"/>' +
  '<rect x="20" y="20" width="480" height="96" rx="10" fill="#fff" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
  '<text x="36" y="56" ' + F + ' font-size="17" fill="#141a33">[[Who]] <tspan font-weight="700" fill="#c0392b">slammed</tspan> the door,</text>' +
  '<text x="36" y="92" ' + F + ' font-size="17" fill="#141a33"><tspan font-weight="700" fill="#c0392b">threw</tspan> the bag down and <tspan font-weight="700" fill="#c0392b">did not say a word</tspan>.</text>' +
  '<path d="M260 122v30" stroke="#141a33" stroke-width="3"/><path d="M250 144l10 12 10 -12" fill="none" stroke="#141a33" stroke-width="3"/>' +
  '<rect x="150" y="160" width="220" height="40" rx="20" fill="#ff5d8f" fill-opacity=".35" stroke="#141a33" stroke-width="2"/>' +
  T(260, 186, "Idea: angry or upset", 16, 'text-anchor="middle" font-weight="700"') +
  '</svg>';

/* three ways to walk */
function prints(x, y, n, gap, s, col, stomp){
  var out = "";
  for(var k = 0; k < n; k++){
    var px = x + k * gap, py = y + (k % 2 ? 12 : -12) * s;
    out += '<ellipse cx="' + px + '" cy="' + py + '" rx="' + 11 * s + '" ry="' + 6 * s + '" fill="' + col + '"/>';
    if(stomp) out += '<path d="M' + (px - 16) + ' ' + (py - 14) + 'l-6 -6M' + px + ' ' + (py - 16) + 'v-8M' + (px + 16) + ' ' + (py - 14) + 'l6 -6" stroke="' + col + '" stroke-width="2.5" stroke-linecap="round"/>';
  }
  return out;
}
var WALKS = '<svg viewBox="0 0 520 250" role="img" aria-label="Three trails of footprints: crept, stomped and strolled">' +
  '<rect width="520" height="250" rx="16" fill="#f4f1ea"/>' +
  T(24, 50, "crept", 17, 'font-weight="700"') + prints(140, 44, 8, 30, 0.6, "#8a5cf6") + T(390, 50, "quiet, careful", 13) +
  T(24, 128, "stomped", 17, 'font-weight="700"') + prints(150, 122, 4, 66, 1.3, "#e04848", true) + T(410, 128, "cross", 13) +
  T(24, 206, "strolled", 17, 'font-weight="700"') + prints(140, 200, 5, 54, 0.9, "#1f9d63") + T(410, 206, "relaxed", 13) +
  '</svg>';

/* the story: a dark building, door ajar, a warm cup */
var NIGHT = '<svg viewBox="0 0 520 230" role="img" aria-label="A dark building at night. The door is open a crack and light spills out. A steaming cup sits on the wall.">' +
  '<rect width="520" height="230" rx="16" fill="#1d2140"/>' +
  '<circle cx="450" cy="46" r="24" fill="#fff6c8"/><circle cx="440" cy="40" r="22" fill="#1d2140"/>' +
  '<circle cx="60" cy="30" r="2" fill="#fff"/><circle cx="130" cy="60" r="1.6" fill="#fff"/><circle cx="380" cy="24" r="1.8" fill="#fff"/>' +
  '<path d="M120 200V80l110 -46 110 46v120z" fill="#2e3566" stroke="#0e1128" stroke-width="3"/>' +
  [[150, 100], [270, 100], [150, 146], [270, 146]].map(function(p){ return '<rect x="' + p[0] + '" y="' + p[1] + '" width="40" height="30" fill="#151935" stroke="#0e1128" stroke-width="2"/>'; }).join("") +
  '<rect x="212" y="140" width="36" height="60" fill="#151935"/><path d="M212 140h6v60h-6z" fill="#ffe28a"/>' +
  '<path d="M218 200l-60 26h-14l66 -26z" fill="#ffe28a" fill-opacity=".55"/>' +
  '<rect x="0" y="200" width="520" height="30" fill="#14172e"/>' +
  '<rect x="350" y="176" width="150" height="24" fill="#5b6180" stroke="#0e1128" stroke-width="2"/>' +
  '<rect x="414" y="160" width="18" height="16" rx="2" fill="#fff"/><path d="M432 164q7 0 7 5t-7 5" fill="none" stroke="#fff" stroke-width="2"/>' +
  '<path d="M418 154q-4 -6 0 -12M426 154q-4 -6 0 -12" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/>' +
  A.egg('<g transform="translate(230 30)">' + A.bird(0, 0, 0.6, "#3a8fd6") + '<text x="22" y="-12" ' + F + ' font-size="13" fill="#fff">z</text></g>', "A bird asleep on the roof. It knows exactly who left that cup. It is not telling.") +
  '</svg>';

/* the story, at three lengths */
var P1 = { mild: "It was very late. [[Who]] got off the bus. Every window at [[place]] was dark.",
  medium: "The bus dropped [[who]] at the end of the lane just after midnight. Every window at [[place]] was dark. [[Who]] checked the time, then checked it again, and walked a little faster.",
  spicy: "The last bus wheezed away and left [[who]] at the end of the lane, just after midnight. Earlier, [[who]] had told everyone, quite loudly, that being alone would be no problem at all. Every window at [[place]] was dark. [[Who]] checked the time, then checked it again, and found their feet walking faster without being asked." };
var P2 = { mild: "The door was open a little. A cup sat on the wall. It was still warm.",
  medium: "At the door, [[who]] stopped. It was open, just a crack, and a line of light lay across the step. Someone had left a cup of tea on the wall outside. It was still warm.",
  spicy: "The door was open, just a crack. A thin line of light lay across the step like a finger pointing inside. On the wall sat a cup of tea, still warm, with a biscuit balanced on the saucer, untouched." };
var P3 = { mild: "[[Who]] called, \"Hello?\" in a very small voice.",
  medium: "[[Who]] pushed the door with one finger and called, \"Hello?\" The word came out smaller than expected.",
  spicy: "[[Who]] pushed the door with one fingertip. \"Hello?\" The word came out smaller than intended, and nobody answered." };
function story(lv){ return '<div class="a2task"><p>' + P1[lv] + '</p><p>' + P2[lv] + '</p><p>' + P3[lv] + '</p></div>'; }
function bit(p, lv){ return '<div class="a2task"><p>' + p[lv] + '</p></div>'; }

(window.A2PACKS = window.A2PACKS || {})["between-lines"] = {
  a2: true,
  id: "a2-between-lines",
  title: "Between the lines",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "Writers and pictures do not tell you everything. Clue + what you know = idea.",
  blurb: "Working out what a picture or a text suggests without saying it. Four short chunks, ending with a short story to read between the lines of, and a clue card to make.",
  note: "Reading between the lines: working out what a text hints at but never says. Four five minute chunks and a clue card at the end. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Glance", line: "Glance: picture clues and short, simple texts." },
    { id: "medium", name: "Squint", line: "Squint: short stories where you put the clues together." },
    { id: "spicy", name: "Mind reader", line: "Mind reader: longer texts, with hints hidden in the writer's word choices." }
  ],
  themes: {
    time: { name: "Time travel", w: { who: "the time traveller", place: "the old observatory", thing: "time map", prize: "a golden cog" } },
    football: { name: "Football", w: { who: "the striker", place: "the training ground", thing: "match ball", prize: "a shiny trophy" } },
    horror: { name: "Horror", w: { who: "the new night porter", place: "the empty hotel", thing: "torch", prize: "a trophy shaped like a bat" } },
    fishing: { name: "Fishing", w: { who: "the angler", place: "the boat house", thing: "rod", prize: "a silver cup" } },
    music: { name: "Music", w: { who: "the singer", place: "the theatre", thing: "script", prize: "a glittering award" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: RAIN,
  steps: [

    /* ---------- chunk 1: picture clues ---------- */
    { type: "learn", topic: "Picture clues", title: "Clue + what you know = idea",
      fig: RAIN,
      html: "<p>Nobody in this picture says \"it rained\". But the umbrella is dripping, the boots are wet and there is a puddle.</p>" +
        "<p>You already know that rain makes things wet. Put the <b>clue</b> together with <b>what you know</b>, and you get an <b>idea</b>: it has been raining.</p>" +
        "<p>That is <b>reading between the lines</b>. The posh word for it is <b>inference</b>.</p>",
      lv: {
        mild: { html: "<p>Nobody says \"it rained\". But look: the umbrella is dripping, and there is a puddle.</p>" +
          "<p>You know rain makes things wet. So you can work it out: <b>it has been raining</b>.</p>" +
          "<p>Clue + what you know = idea. That is reading between the lines.</p>" },
        spicy: { html: "<p>Nobody says \"it rained\". The umbrella, the boots and the puddle are <b>clues</b>. You add <b>what you know</b> about the world, and reach an <b>idea</b>. That is an <b>inference</b>.</p>" +
          "<p>An inference is not a wild guess: you should be able to point to the clue that led you there. \"It rained\" is well supported. \"Someone hates umbrellas\" is not supported by anything here.</p>" +
          "<p>Good readers also check: is there another idea that fits the clues better?</p>" } } },

    { type: "mc", topic: "Picture clues",
      q: "Nobody has said anything yet. What is going on here?",
      fig: PARTY,
      options: ["Someone is having a birthday.", "Someone is moving house.", "It is the middle of the night."],
      answer: 0,
      slips: { 1: "Moving house would mean boxes, not a cake with candles.", 2: "Look for clues about the time. Balloons and cake fit a party better than bedtime." },
      hint: "What do candles on a cake usually mean?",
      why: "Cake with candles, balloons and a present: clues that add up to a birthday.",
      lv: { spicy: { q: "Nobody is in the picture. What is the best supported idea?",
        fig: HURRY,
        options: ["Someone left in a hurry.", "Someone finished lunch slowly and tidied up.", "Nobody has been here today.", "Someone is about to arrive for lunch."],
        slips: { 1: "Half a sandwich and a knocked chair do not look slow or tidy.", 2: "A bitten sandwich and a mug say someone was here.", 3: "The door is open and the chair is knocked back: that fits leaving, not arriving." },
        hint: "Look at the chair, the phone and the door together.",
        why: "Half eaten food, a knocked chair, a phone left behind and the door wide open: all point to someone leaving in a rush. No single clue proves it, but together they support it." } } },

    { type: "mc", topic: "Picture clues", explain: true,
      q: "Jay comes home and finds this. Who made the mess?",
      fig: MUDDY,
      options: ["Bonnie", "Jay", "A burglar"],
      answer: 0, fixed: true,
      slips: { 1: "Jay has only just come home. And those are not shoe prints.", 2: "A burglar would leave shoe prints. Look at the shape of the prints." },
      hint: "Look at the shape of the prints, and where they lead.",
      why: "Paw prints lead from the door straight to Bonnie, and there is mud on the sofa. Nobody said it, but the clues do.",
      lv: {
        medium: { q: "Jay comes home and finds this. Which clue best shows it was Bonnie?",
          options: ["The prints are paw shaped and lead to her.", "Bonnie is brown.", "The sofa is blue.", "The door is green."], fixed: false,
          slips: { 1: "Lots of things are brown. The colour does not link her to the mess.", 2: "The sofa colour does not tell us who made the mess.", 3: "The door colour is not a clue about who did it." },
          why: "Paw shaped prints that lead right to her: that clue links Bonnie to the mess." },
        spicy: { q: "Which idea is best supported by the picture?",
          options: ["Bonnie has been outside somewhere muddy.", "Bonnie hates the sofa.", "Jay left the door open on purpose.", "Bonnie is a bad dog."], fixed: false,
          slips: { 1: "Nothing in the picture tells us how she feels about the sofa. She looks quite happy on it.", 2: "The door is open, but nothing shows it was on purpose. That goes beyond the clues.", 3: "That is a judgement, not an inference from the clues. Also, outrageous." },
          why: "The prints start at the open door and they are muddy. So she came in from somewhere muddy. The other ideas go further than the clues allow." } } },

    { type: "match", topic: "Picture clues",
      q: "Match each clue to the idea it suggests.",
      pairs: [["A wet umbrella by the door", "It has been raining"], ["Yawning and rubbing eyes", "Feeling tired"], ["Sand in their shoes", "Been to the beach"], ["An empty plate with crumbs", "Someone has eaten"]],
      hint: "For each clue, ask: what usually causes that?",
      why: "Each clue plus what you know points to one idea.",
      lv: {
        medium: { pairs: [["Coat dripping, hair flat on their head", "Just came in from the rain"], ["Checks the clock every minute", "Waiting for something"], ["Whistles all the way home", "In a good mood"], ["Answers in one word and looks at the floor", "Upset or fed up"]] },
        spicy: { pairs: [["Hands shaking as they hold the [[thing]]", "Nervous"], ["Laughs a bit too loudly at the joke", "Trying to fit in"], ["Keeps glancing at the exit", "Wants to leave"], ["Says \"fine.\" and nothing else", "Not really fine"], ["Arrives an hour early, in their best clothes", "This matters to them"]],
          why: "None of these say the feeling. The behaviour is the clue, and what you know about people does the rest." } } },

    /* ---------- chunk 2: clues in sentences ---------- */
    { type: "learn", topic: "Clues in a story", title: "Writers show, they do not tell",
      fig: SHOW,
      html: "<p>Writers often <b>show</b> a feeling instead of naming it. Read this:</p>" +
        "<p class=\"a2task\">[[Who]] slammed the door, threw the bag down and did not say a word.</p>" +
        "<p>The writer never says \"angry\". But slamming, throwing and silence are clues. You know people do that when they are cross or upset. So you can infer it.</p>",
      lv: {
        mild: { html: "<p>Writers do not always say how someone feels. They give you clues.</p>" +
          "<p class=\"a2task\">[[Who]] slammed the door and did not say a word.</p>" +
          "<p>It does not say \"angry\". But slamming a door is a clue. People slam doors when they are cross. So [[who]] is probably angry or upset.</p>" },
        spicy: { html: "<p>Writers often <b>show</b> rather than <b>tell</b>, and leave the reader to do some of the work.</p>" +
          "<p class=\"a2task\">[[Who]] slammed the door, threw the bag down and did not say a word.</p>" +
          "<p>\"Slammed\" and \"threw\" are forceful verbs. The silence matters too: it suggests the feeling is too big to talk about, or that [[who]] is refusing to. Inference is often about <b>which words the writer chose</b>, and what they make you think.</p>" } } },

    { type: "mc", topic: "Clues in a story", explain: true,
      q: "<span class=\"a2task\" style=\"display:block\">[[Who]] stared at the [[thing]]. Their hands were shaking. They took a deep breath and stepped forward.</span>How does [[who]] feel?",
      options: ["Nervous", "Bored", "Sleepy"],
      answer: 0,
      slips: { 1: "Someone bored would not have shaking hands or need a deep breath.", 2: "Sleepy people yawn. Shaking hands and deep breaths suggest something else." },
      hint: "Why might your hands shake before you do something?",
      why: "Shaking hands and a deep breath are clues. They suggest [[who]] is nervous, but brave enough to step forward.",
      lv: {
        medium: { options: ["Nervous", "Bored", "Sleepy", "Angry"],
          slips: { 1: "Someone bored would not have shaking hands or need a deep breath.", 2: "Sleepy people yawn. Shaking hands suggest something else.", 3: "Angry people might shake, but the deep breath and stepping forward suggest building up courage." } },
        spicy: { q: "<span class=\"a2task\" style=\"display:block\">[[Who]] stared at the [[thing]]. Their stomach flipped. They read the same line three times without taking it in, then stepped forward anyway.</span>Which detail best shows that [[who]] is nervous rather than excited?",
          options: ["They read the same line three times without taking it in.", "They stared at the [[thing]].", "They stepped forward.", "Their stomach flipped."],
          slips: { 1: "Staring could be excitement, fear or curiosity. It does not narrow it down.", 2: "Stepping forward is an action, but it does not show the feeling.", 3: "A flipping stomach fits both nerves and excitement. Which detail only fits nerves?" },
          hint: "Which clue could not easily be excitement?",
          why: "Not being able to take in what you read is a sign of worry. A flipping stomach could be either feeling, so it is weaker evidence. \"Anyway\" adds to it: they go on despite the nerves." } } },

    { type: "text", topic: "Clues in a story",
      q: "<span class=\"a2task\" style=\"display:block\">[[Who]] walked in grinning, holding [[prize]] high above their head.</span>What do you think has happened?",
      need: [["won", "win", "winner", "winning", "first", "champion", "victory", "prize", "award", "did well", "good news", "best"]],
      model: "They have won something.",
      slips: [[["sad", "upset", "angry", "cross"], "Look at the grin and the arms up. Does that fit a bad feeling?"]],
      hint: "Why would someone hold something up high and grin?",
      why: "The grin and [[prize]] held up high suggest [[who]] has won something. The text never says \"won\": you worked it out.",
      lv: {
        medium: { q: "<span class=\"a2task\" style=\"display:block\">[[Who]] walked in grinning, holding [[prize]] high above their head.</span>What do you think has happened? Add the clue that tells you, using \"because\".",
          need: [["won", "win", "winner", "winning", "first", "champion", "victory", "prize", "award", "did well", "good news", "best"], ["because", "as", "since", "grin", "grinning", "smiling", "holding", "high", "above"]],
          model: "They have won something, because they are grinning and holding it up high." },
        spicy: { q: "<span class=\"a2task\" style=\"display:block\">[[Who]] walked in grinning, holding [[prize]] high above their head. Nobody else in the room looked up.</span>What has probably happened, and what might the last sentence suggest?",
          need: [["won", "win", "winner", "winning", "champion", "victory", "prize", "award", "did well", "success"], ["nobody", "no one", "noone", "jealous", "ignore", "ignored", "ignoring", "care", "interest", "lonely", "alone", "notice", "upset", "lost", "bitter"]],
          model: "They have won something, but nobody looking up suggests the others do not care, or are jealous.",
          hint: "The first sentence shows the win. Why might a room ignore a winner?",
          why: "The grin and the raised [[prize]] suggest a win. The others not looking up hints at something more: jealousy, not caring, or that they lost. Two clues, two inferences." } } },

    { type: "mc", topic: "Clues in a story",
      q: "<span class=\"a2task\" style=\"display:block\">[[Place]] was silent. The car park was empty, the shutters were down and only one light was still on.</span>When is this most likely to be?",
      options: ["Late, after everyone has gone home", "In the middle of a busy day", "Just as the doors open in the morning"],
      answer: 0,
      slips: { 1: "A busy day would mean people and cars. The car park is empty.", 2: "Doors opening means the shutters would be going up, not down." },
      hint: "Look at the car park and the shutters.",
      why: "Empty car park, shutters down, lights off: clues that suggest it is late and everyone has gone.",
      lv: { spicy: { q: "<span class=\"a2task\" style=\"display:block\">[[Place]] was silent. The car park was empty, the shutters were down and only one light was still on, high up in a window at the back.</span>Which idea does the last detail add?",
        options: ["Someone might still be inside.", "The building is closed for good.", "It is the middle of the day.", "The lights are broken."],
        slips: { 1: "One light on suggests someone may still be there, not that it has closed for good.", 2: "An empty car park and shutters down do not fit the middle of the day.", 3: "Nothing suggests broken lights. One light being on is the clue." },
        hint: "Why would one light be on when everything else is shut?",
        why: "Everything says closed, except that one light. The writer is hinting that someone is still there, which makes you want to read on." } } },

    /* ---------- chunk 3: word choices ---------- */
    { type: "learn", topic: "What the words suggest", title: "One word can carry a hint",
      fig: WALKS,
      html: "<p>\"Walked\" just tells you someone moved. Other words carry a hint about <b>how</b> and <b>why</b>.</p>" +
        "<p><b>Crept</b> suggests quiet and careful, maybe sneaky or scared. <b>Stomped</b> suggests cross. <b>Strolled</b> suggests relaxed, in no hurry.</p>" +
        "<p>When a word feels like it was picked on purpose, ask: <b>what does this word suggest?</b></p>",
      lv: {
        mild: { html: "<p>Some words give you a hint.</p>" +
          "<p><b>Crept</b> means walked very quietly. <b>Stomped</b> means walked with big cross steps. <b>Strolled</b> means walked slowly and relaxed.</p>" +
          "<p>They all mean \"walked\", but each one tells you something extra.</p>" },
        spicy: { html: "<p>Writers choose words for what they suggest, not just what they mean. This extra meaning is sometimes called <b>connotation</b>.</p>" +
          "<p><b>Crept</b>, <b>stomped</b> and <b>strolled</b> all mean walked. But crept suggests secrecy or fear, stomped suggests anger, strolled suggests ease.</p>" +
          "<p>It works for describing places too: a room that is \"cosy\" and one that is \"cramped\" might be the same size. The word tells you how it feels to be there.</p>" } } },

    { type: "match", topic: "What the words suggest",
      q: "Match each word to what it suggests.",
      pairs: [["crept", "Trying not to be heard"], ["stomped", "Cross"], ["strolled", "Relaxed, no rush"]],
      hint: "Picture someone doing each one.",
      why: "They all mean moved, but each one carries a different hint.",
      lv: {
        medium: { pairs: [["crept", "Trying not to be heard"], ["stomped", "Cross"], ["strolled", "Relaxed, no rush"], ["raced", "In a hurry"], ["trudged", "Tired or fed up"]] },
        spicy: { q: "Match each way of speaking to what it suggests.",
          pairs: [["muttered", "Grumbling, not wanting to be heard clearly"], ["snapped", "Irritated"], ["whispered", "Secret or scared"], ["beamed", "Delighted"], ["stammered", "Nervous or caught out"]],
          why: "\"Said\" is neutral. These verbs tell you the feeling behind the words." } } },

    { type: "mc", topic: "What the words suggest",
      q: "\"The corridor was gloomy.\" What does gloomy suggest?",
      options: ["Dark, and a bit sad or creepy", "Bright and cheerful", "Very noisy"],
      answer: 0,
      slips: { 1: "Gloomy is close to the opposite of bright and cheerful.", 2: "Gloomy is about light and mood, not sound." },
      hint: "Think of a gloomy day.",
      why: "Gloomy suggests dim light and a low, uneasy mood.",
      lv: { spicy: { q: "\"The room was small.\" and \"The room was cramped.\" What extra idea does cramped add?",
        options: ["It feels too full and uncomfortable.", "It is the smallest room in the building.", "It is cosy and warm.", "It has no windows."],
        slips: { 1: "Cramped is about how it feels, not a size ranking.", 2: "Cosy is the positive version. Cramped suggests the opposite feeling.", 3: "Nothing in the word tells us about windows." },
        hint: "Would you want to stay in a cramped room?",
        why: "Small is neutral. Cramped suggests too many things or people, and a feeling of discomfort." } } },

    { type: "mc", topic: "What the words suggest",
      q: "Which sentence <b>hints</b> that [[who]] is scared, without saying it?",
      options: ["[[Who]]'s heart thumped, and they pressed their back against the wall.", "[[Who]] was scared.", "[[Who]] sat down to eat a sandwich."],
      answer: 0,
      slips: { 1: "That one says it straight out. We want the one that only hints.", 2: "Eating a sandwich does not hint at being scared." },
      hint: "Which one makes you work it out?",
      why: "A thumping heart and backing against a wall are clues. The reader works out \"scared\" for themselves.",
      lv: { spicy: { q: "Which sentence best suggests that [[who]] does not trust the stranger?",
        options: ["[[Who]] kept one hand on the [[thing]] and never took their eyes off the stranger.", "[[Who]] did not trust the stranger.", "[[Who]] smiled and shook the stranger's hand.", "The stranger was tall and wore a grey coat."],
        slips: { 1: "That tells you directly. The question wants the one that suggests it.", 2: "A smile and a handshake suggest the opposite.", 3: "That describes the stranger, but says nothing about how [[who]] feels." },
        hint: "Which one shows distrust through actions?",
        why: "Guarding the [[thing]] and watching closely are actions that suggest distrust, without the writer ever saying it." } } },

    /* ---------- chunk 4: a story ---------- */
    { type: "learn", topic: "Read between the lines", title: "A story to read between the lines of",
      fig: NIGHT,
      html: "<p>Read it once, slowly. Notice anything that seems like a clue.</p>" + story("medium"),
      lv: { mild: { html: "<p>Read it once, slowly. Look for clues.</p>" + story("mild") },
        spicy: { html: "<p>Read it once, slowly. Notice the details the writer seems to have picked on purpose.</p>" + story("spicy") } } },

    { type: "mc", topic: "Read between the lines",
      q: bit(P1, "medium") + "How is [[who]] feeling?",
      options: ["Worried", "Bored", "Angry"],
      answer: 0,
      slips: { 1: "Someone bored would not keep checking the time and speed up.", 2: "Nothing here suggests anger. Checking the time and walking faster suggest something else." },
      hint: "Why would someone check the time twice and walk faster in the dark?",
      why: "Checking the time twice and walking faster are clues that [[who]] is worried, or uneasy about being out so late.",
      lv: {
        mild: { q: bit(P1, "mild") + "What can you work out?",
          options: ["It is night time.", "It is lunch time.", "It is a sunny morning."],
          slips: { 1: "Very late and dark windows do not fit lunch time.", 2: "Dark windows and very late do not fit a sunny morning." },
          hint: "Look at \"very late\" and the dark windows.",
          why: "Very late, and every window dark: it is night time, even though the text never says \"night\"." },
        spicy: { q: bit(P1, "spicy") + "What does \"found their feet walking faster without being asked\" suggest?",
          options: ["[[Who]] is more nervous than they want to admit.", "[[Who]] is late for another bus.", "[[Who]]'s feet hurt.", "[[Who]] enjoys running."],
          slips: { 1: "The bus has just gone. Nothing says there is another to catch.", 2: "Sore feet would slow you down, not speed you up.", 3: "\"Without being asked\" suggests the body is reacting, not choosing to exercise." },
          hint: "Think about what they told everyone earlier.",
          why: "Their body speeds up on its own, even though they said being alone was no problem. The writer is hinting that the brave talk was not quite true." } } },

    { type: "mc", topic: "Read between the lines",
      q: bit(P2, "medium") + "What can you work out from the warm tea?",
      options: ["Someone was there not long ago.", "The cup is brand new.", "It is a hot day.", "[[Who]] made the tea."],
      answer: 0,
      slips: { 1: "Warm tells you about time, not whether the cup is new.", 2: "It is just after midnight. Warm tea is not about the weather.", 3: "[[Who]] has only just arrived. Someone else made it." },
      hint: "Tea goes cold quite quickly. So how long ago was it made?",
      why: "Tea cools down fast, so if it is still warm, someone made it and left it there not long ago.",
      lv: {
        mild: { q: bit(P2, "mild") + "What can you work out from the warm cup?",
          options: ["Someone was there not long ago.", "The cup is brand new.", "It is a hot day."],
          slips: { 1: "Warm tells you about time, not whether the cup is new.", 2: "It is very late at night. Warm tea is not about the weather." } },
        spicy: { q: bit(P2, "spicy") + "The tea is still warm and the biscuit is untouched. What does that suggest?",
          options: ["Someone left suddenly, not long ago.", "Someone did not like the biscuit.", "The tea was made hours ago.", "The cup belongs to [[who]]."],
          slips: { 1: "Possible, but it does not explain why the tea was left too. Look at both clues together.", 2: "Warm tea means it was not hours ago.", 3: "[[Who]] has only just arrived." },
          hint: "Who makes tea and a biscuit, then leaves both?",
          why: "Warm means recent. Making a snack and not touching it suggests the person was interrupted, or left in a hurry. Two clues, one stronger idea." } } },

    { type: "text", topic: "Read between the lines", explain: true,
      q: bit(P3, "medium") + "What does the small voice suggest about [[who]]? Use a clue from the text.",
      need: [["scared", "nervous", "worried", "afraid", "frightened", "anxious", "uneasy", "unsure", "jumpy", "tense", "fear", "scary", "shy"], ["small", "smaller", "finger", "quiet", "voice", "pushed", "hello"]],
      model: "They are nervous, because their voice came out smaller than expected.",
      slips: [[["happy", "excited", "brave", "confident"], "A small voice and pushing with one finger suggest the opposite of confident."]],
      hint: "Why might your voice come out small?",
      why: "A voice that comes out small, and pushing with only one finger, suggest [[who]] is nervous or scared.",
      lv: {
        mild: { q: bit(P3, "mild") + "How does [[who]] feel?",
          need: [["scared", "nervous", "worried", "afraid", "frightened", "anxious", "unsure", "shy", "fear", "scary", "jumpy"]],
          model: "Scared.",
          hint: "When does your voice come out very small?",
          why: "A very small voice is a clue that [[who]] feels scared or nervous." },
        spicy: { q: bit(P3, "spicy") + "Earlier, [[who]] told everyone being alone would be no problem. Does the rest of the story agree? Explain using evidence.",
          need: [["no", "not", "disagree", "doesn't", "does not", "nervous", "scared", "worried", "afraid", "actually", "really"], ["faster", "smaller", "small", "fingertip", "checked", "voice", "intended", "feet"]],
          model: "No. They are actually nervous, because their voice comes out smaller than intended and their feet walk faster.",
          slips: [[["yes", "agree"], "Look again at the voice and the feet. Do they sound like someone with no problem at all?"]],
          hint: "Compare what they said with what their voice and feet do.",
          why: "The loud promise and the small voice do not match. The writer sets them side by side so you notice the gap: [[who]] is braver in words than in the dark." } } },

    { type: "write", topic: "Read between the lines",
      q: "Your turn, if you like. Write two or three sentences that <b>show</b> how someone feels, without using the feeling word. Jay will try to read between your lines.",
      starters: ["[[Who]] stared at the...", "Nobody said anything, but...", "Their hands..."],
      checklist: ["I did not use the feeling word", "I used an action or a detail as a clue", "A reader could work out the feeling"],
      minWords: 15,
      lv: { mild: { q: "Your turn, if you like. Write one or two sentences that show how someone feels, without saying the feeling word. Jay will try to guess it.", minWords: 8 },
        spicy: { q: "Your turn, if you like. Write a short paragraph (three to five sentences) that shows how someone feels without naming it. Try to use one carefully chosen word that carries a hint, like \"crept\" or \"cramped\". Jay will try to read between your lines.", minWords: 35,
          checklist: ["I did not name the feeling", "I used actions or details as clues", "I chose at least one word for what it suggests", "A reader could support their guess with evidence"] } } }
  ],

  realWorld: {
    title: "You read between the lines all day",
    html: "<p>A friend says \"fine.\" with a full stop. Someone checks their phone while you talk. You work out what they mean, without anyone saying it. Detectives, doctors and teachers do the same thing for a living.</p>" +
      "<p>Historians do it too. They find a burnt pot, worn steps or a note in the margin, and infer how people lived. If we could time travel, we could check their inferences. Should we? Or is working it out from the clues part of the fun?</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay thinking next to a time portal">' + A.portal(80, 75, 56) + A.jay(240, 52, 0.85, "hmm") +
      A.bubble(292, 6, 120, 52, "Clue + what\nI know...", 298) + '</svg>'
  },

  make: {
    title: "Make a clue card",
    intro: "A clue, and the idea it suggests. Make one about anything you noticed today. Save it, or send it to Jay to see if he spots the same thing.",
    fields: [
      { id: "clue", label: "I noticed...", ph: "Bonnie's lead is missing from its hook", max: 70 },
      { id: "idea", label: "So I think...", ph: "Someone has taken her for a walk", max: 70 },
      { id: "name", label: "Detective", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      function e(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n){ if(cur.trim()) out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, 3).map(function(l){ return l.length > n ? l.slice(0, n - 1) + "." : l; }); }
      function lines(arr, x, y){ return arr.map(function(l, k){ return '<text x="' + x + '" y="' + (y + k * 28) + '" font-family="Verdana,Arial,sans-serif" font-size="21" font-weight="700" fill="#141a33">' + e(l) + '</text>'; }).join(""); }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#1d2140"/>' +
        '<rect x="18" y="18" width="564" height="364" rx="18" fill="#fffbe9"/>' +
        '<text x="44" y="60" font-family="Verdana,Arial,sans-serif" font-size="20" font-weight="700" fill="#8a5cf6" letter-spacing="3">BETWEEN THE LINES</text>' +
        '<g transform="translate(520 64)"><circle r="26" fill="none" stroke="#141a33" stroke-width="6"/><circle r="20" fill="#22b8e6" fill-opacity=".3"/><path d="M18 18l22 22" stroke="#141a33" stroke-width="9" stroke-linecap="round"/></g>' +
        '<rect x="40" y="90" width="520" height="112" rx="14" fill="#ffd23f" fill-opacity=".45"/>' +
        '<text x="58" y="116" font-family="Verdana,Arial,sans-serif" font-size="15" fill="#5b4a00">I noticed</text>' + lines(wrap(v.clue, 40), 58, 144) +
        '<path d="M300 206v18" stroke="#141a33" stroke-width="3"/><path d="M290 216l10 12 10 -12" fill="none" stroke="#141a33" stroke-width="3"/>' +
        '<rect x="40" y="232" width="520" height="112" rx="14" fill="#9be3c6" fill-opacity=".6"/>' +
        '<text x="58" y="258" font-family="Verdana,Arial,sans-serif" font-size="15" fill="#145c43">So I think</text>' + lines(wrap(v.idea, 40), 58, 286) +
        '<text x="44" y="370" font-family="Verdana,Arial,sans-serif" font-size="15" fill="#5b6180">Detective: ' + e(String(v.name || "").slice(0, 24)) + '</text>' +
        '</svg>';
    }
  }
};
})();
