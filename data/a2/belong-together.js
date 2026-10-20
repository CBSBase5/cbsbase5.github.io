/* Base 5 Autumn 2 activity: Belong together.
   English. Sentences that are about the same idea belong together,
   and a group of them is a paragraph. ASCII only. */
(function(){
var A = window.A2ART;
var FONT = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = [], out = [], cur = ""; String(t || "").split(/\s+/).forEach(function(x){ while(x.length > n){ w.push(x.slice(0, n)); x = x.slice(n); } w.push(x); }); w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }

/* a sock: x, y, scale, colour, pattern ("stripe" | "spot" | "") */
function sock(x, y, s, col, pat, tilt){
  var body = '<path d="M0 0h36v62l26 13q14 8 8 22q-6 12 -22 6l-38 -18q-10 -5 -10 -16z" fill="' + col + '" stroke="#141a33" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<rect x="0" y="0" width="36" height="12" fill="#fff" fill-opacity=".55" stroke="#141a33" stroke-width="2"/>';
  if(pat === "stripe") body += '<path d="M0 28h36M0 42h36" stroke="#fff" stroke-width="5"/>';
  if(pat === "spot") body += '<circle cx="12" cy="30" r="4" fill="#fff"/><circle cx="24" cy="46" r="4" fill="#fff"/><circle cx="40" cy="78" r="4" fill="#fff"/>';
  return '<g transform="translate(' + x + ' ' + y + ') rotate(' + (tilt || 0) + ') scale(' + s + ')">' + body + '</g>';
}

/* two sentences that match, one that does not */
var SOCKS = '<svg viewBox="0 0 520 240" role="img" aria-label="Two matching socks next to two sentences about Bonnie, and an odd sock next to a sentence about a bus">' +
  '<rect width="520" height="240" rx="16" fill="#f4f1ea"/>' +
  sock(26, 26, 0.8, "#3a8fd6", "stripe", -4) + sock(80, 30, 0.8, "#3a8fd6", "stripe", 4) +
  '<rect x="170" y="22" width="330" height="40" rx="10" fill="#d6ecfb" stroke="#3a8fd6" stroke-width="2.5"/>' + T(184, 48, "Bonnie is a toy poodle.", 15) +
  '<rect x="170" y="70" width="330" height="40" rx="10" fill="#d6ecfb" stroke="#3a8fd6" stroke-width="2.5"/>' + T(184, 96, "She has brown curly fur.", 15) +
  T(170, 132, "Same idea, so they belong together.", 13, { b: 1, c: "#1f5f99" }) +
  sock(52, 142, 0.8, "#ff8a3d", "spot", 0) +
  '<rect x="170" y="156" width="330" height="40" rx="10" fill="#ffe2cc" stroke="#ff8a3d" stroke-width="2.5"/>' + T(184, 182, "The bus was late.", 15) +
  T(170, 218, "A different idea. It does not belong here.", 13, { b: 1, c: "#a8501a" }) +
  '</svg>';

/* a page with blocks of lines: n paragraphs, gaps or indents, labels */
function page(sizes, indent, labels){
  var y = 34, s = '', lab = '', k, j;
  for(k = 0; k < sizes.length; k++){
    var top = y;
    for(j = 0; j < sizes[k]; j++){
      var x = 50 + (indent && j === 0 ? 26 : 0), w = (j === sizes[k] - 1 ? 150 : 250) - (indent && j === 0 ? 26 : 0) - ((j * 37 + k * 11) % 30);
      s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="7" rx="3.5" fill="' + ["#3a8fd6", "#19c39a", "#ff8a3d", "#8a5cf6"][k % 4] + '" fill-opacity=".75"/>';
      y += 16;
    }
    if(labels) lab += '<path d="M318 ' + (top + 3) + 'h10v' + (y - top - 12) + 'h-10" fill="none" stroke="#141a33" stroke-width="2"/>' + T(338, top + (y - top) / 2 + 2, "Paragraph " + (k + 1), 14, { b: 1 });
    y += indent ? 0 : 18;
  }
  var bottom = y - (indent ? 0 : 18) + 12, h = bottom + (labels ? 40 : 14);
  return '<svg viewBox="0 0 520 ' + Math.max(h, 200) + '" role="img" aria-label="A page with ' + sizes.length + ' paragraphs">' +
    '<rect width="520" height="' + Math.max(h, 200) + '" rx="16" fill="#f4f1ea"/>' +
    '<rect x="30" y="16" width="290" height="' + (bottom - 16) + '" rx="6" fill="#fff" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' + s + lab +
    (labels ? T(30, bottom + 26, indent ? "The first line of each paragraph starts further in." : "A gap shows where a new idea starts.", 13, { c: "#5b6180" }) : "") +
    '</svg>';
}

/* two boxes of three sentences */
function boxes(a, b){
  function box(x, title, lines, col){
    return '<rect x="' + x + '" y="14" width="265" height="150" rx="12" fill="#fff" stroke="' + col + '" stroke-width="3"/>' +
      T(x + 14, 40, title, 15, { b: 1, c: col }) +
      lines.map(function(l, k){ return T(x + 14, 72 + k * 30, l, 13); }).join("");
  }
  return '<svg viewBox="0 0 560 180" role="img" aria-label="Two boxes of sentences, A and B">' +
    '<rect width="560" height="180" rx="16" fill="#f4f1ea"/>' + box(10, "Box A", a, "#1f5f99") + box(285, "Box B", b, "#7a3fc4") + '</svg>';
}

/* a washing line of sentence socks: three match, one is odd */
var LINE = '<svg viewBox="0 0 520 220" role="img" aria-label="A washing line with four socks. Three match, sock 3 is the odd one out">' +
  '<rect width="520" height="220" rx="16" fill="#e8f4fb"/>' +
  '<path d="M20 40q240 34 480 0" stroke="#7a5532" stroke-width="3" fill="none"/>' +
  [[70, "#19c39a", "stripe"], [180, "#19c39a", "stripe"], [290, "#ff5d8f", "spot"], [400, "#19c39a", "stripe"]].map(function(c, k){
    return '<rect x="' + (c[0] + 8) + '" y="' + (44 + (k === 1 || k === 2 ? 8 : 2)) + '" width="8" height="16" rx="2" fill="#c99a63" stroke="#141a33" stroke-width="1.5"/>' +
      sock(c[0], 56 + (k === 1 || k === 2 ? 8 : 2), 0.85, c[1], c[2], 0) + T(c[0] + 18, 178, "Sentence " + (k + 1), 13, { a: "middle", b: k === 2 ? 1 : 0, c: k === 2 ? "#b8235a" : "#141a33" });
  }).join("") +
  T(260, 206, "Sentence 3 is about a different idea: the odd sock.", 13, { a: "middle", b: 1 }) +
  A2ART.egg(A2ART.bird(476, 30, 0.6, "#ffd23f"), "A bird on the washing line. It is not a sock, but Jay says it can stay.") +
  '</svg>';

/* two drawers: sort the sentences by idea */
var DRAWERS = '<svg viewBox="0 0 520 230" role="img" aria-label="Muddled sentence cards sorted into two drawers: getting ready, and when we got there">' +
  '<rect width="520" height="230" rx="16" fill="#f4f1ea"/>' +
  '<rect x="150" y="14" width="96" height="30" rx="8" fill="#d6ecfb" stroke="#3a8fd6" stroke-width="2" transform="rotate(-6 198 29)"/>' +
  '<rect x="262" y="18" width="96" height="30" rx="8" fill="#ffe2cc" stroke="#ff8a3d" stroke-width="2" transform="rotate(5 310 33)"/>' +
  '<rect x="206" y="50" width="96" height="30" rx="8" fill="#d6ecfb" stroke="#3a8fd6" stroke-width="2" transform="rotate(3 254 65)"/>' +
  '<path d="M200 92l-60 30M310 92l60 30" stroke="#141a33" stroke-width="2.5" stroke-dasharray="6 5"/><path d="M134 116l14 2 -6 -12z" fill="#141a33"/><path d="M376 116l-14 2 6 -12z" fill="#141a33"/>' +
  [[30, "#3a8fd6", "#d6ecfb", "Getting ready"], [280, "#ff8a3d", "#ffe2cc", "When we got there"]].map(function(d){
    return '<rect x="' + d[0] + '" y="128" width="210" height="88" rx="10" fill="' + d[2] + '" stroke="#141a33" stroke-width="2.5"/>' +
      '<rect x="' + (d[0] + 80) + '" y="140" width="50" height="10" rx="5" fill="' + d[1] + '"/>' +
      T(d[0] + 105, 178, d[3], 15, { b: 1, a: "middle" }) + T(d[0] + 105, 202, "one paragraph", 13, { a: "middle", c: "#5b6180" });
  }).join("") +
  '</svg>';

var BONNIE = '<svg viewBox="0 0 420 170" role="img" aria-label="Bonnie the poodle asking which sentence is not about her">' +
  '<rect width="420" height="170" rx="16" fill="#f4f1ea"/>' + A2ART.bonnie(110, 104, 1.3, "sit") +
  A2ART.bubble(200, 24, 200, 54, "Which one is\nnot about me?", 214) + '</svg>';

(window.A2PACKS = window.A2PACKS || {})["belong-together"] = {
  a2: true,
  id: "a2-belong-together",
  title: "Belong together",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "Sentences about the same idea belong together, like a pair of socks. A group of them is a paragraph.",
  blurb: "Matching sentences like socks: which ones are about the same idea, what a paragraph is, and how to spot the odd sock. Four short chunks, with a paragraph card to make at the end.",
  note: "Matching sentences like socks, and finding the odd one out. Four five minute chunks and a paragraph card to make at the end, whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Odd socks", line: "Odd socks: short sentences, and the odd one sticks out." },
    { id: "medium", name: "Sock drawer", line: "Sock drawer: longer paragraphs, more sentences to sort." },
    { id: "spicy", name: "Laundry day", line: "Laundry day: sneaky sentences that share a word but not the idea." }
  ],
  themes: {
    time: { name: "Time travel", w: { who: "the time traveller", place: "the castle", event: "the trip to 1066", kit: "a map, a torch and a spare battery", sound: "the clank of swords", spot: "the drawbridge" } },
    football: { name: "Football", w: { who: "the striker", place: "the stadium", event: "the cup final", kit: "boots, shin pads and a water bottle", sound: "the roar of the crowd", spot: "the turnstiles" } },
    horror: { name: "Horror", w: { who: "the night porter", place: "the old hospital", event: "the night shift", kit: "a torch, a radio and a big bunch of keys", sound: "the hum of the lights", spot: "the lift" } },
    fishing: { name: "Fishing", w: { who: "the angler", place: "the lake", event: "the fishing match", kit: "a reel, some hooks and a tub of bait", sound: "the splash of a fish", spot: "the jetty" } },
    music: { name: "Music", w: { who: "the singer", place: "the theatre", event: "opening night", kit: "a script, a water bottle and a lucky scarf", sound: "the sound of the band tuning up", spot: "the stage door" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: SOCKS,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Same idea", title: "Sentences can be a matching pair",
      fig: SOCKS,
      html: "<p>Some sentences <b>belong together</b>, like a pair of socks. They belong together when they are about the <b>same idea</b>.</p>" +
        "<p><b>Bonnie is a toy poodle. She has brown curly fur.</b> Both sentences are about Bonnie. They match.</p>" +
        "<p><b>The bus was late.</b> That is about something else. It is an odd sock.</p>",
      lv: { spicy: { html: "<p>Sentences <b>belong together</b> when they are about the <b>same idea</b>, like a matching pair of socks.</p>" +
        "<p>Watch out: sharing a word is not the same as sharing an idea. <b>Bonnie sat by the window.</b> and <b>The window cleaner comes on Tuesdays.</b> both say \"window\", but one is about Bonnie and one is about the window cleaner. Odd socks.</p>" +
        "<p>Little words like <b>it</b>, <b>she</b>, <b>they</b> and <b>this</b> often point back to the sentence before. They are a clue that two sentences belong together.</p>" } } },

    { type: "mc", topic: "Same idea",
      q: "Which sentence belongs with this one?<p class=\"a2task\">[[Who]] packed a bag for [[event]].</p>",
      options: ["In the bag went [[kit]].", "Bonnie is a toy poodle.", "Owls hunt at night."],
      answer: 0,
      slips: { 1: "Bonnie is lovely, but this sentence is about Bonnie, not about packing.", 2: "Owls are a whole different idea. Which one is about the bag?" },
      hint: "Which one is still about the bag?",
      why: "Both sentences are about packing the bag. Same idea, so they belong together.",
      lv: {
        medium: { options: ["In the bag went [[kit]].", "Bags can be made of paper or cloth.", "Owls hunt at night."],
          slips: { 1: "It says \"bag\", but it is about what bags are made of, not about packing for [[event]].", 2: "Owls are a whole different idea." } },
        spicy: { q: "Which sentence is about the same <b>idea</b> as this one?<p class=\"a2task\">[[Who]] packed a bag for [[event]].</p>",
          options: ["In the bag went [[kit]].", "A bag of crisps costs 80p.", "[[Place]] was built in 1890.", "Bonnie hates having a bath."],
          slips: { 1: "It shares the word \"bag\", but it is about the price of crisps. Same word, different idea.", 2: "That is about [[place]], not about packing.", 3: "Poor Bonnie. But it is about her bath, not about packing." } } } },

    { type: "multi", topic: "Same idea",
      q: "Pick <b>all</b> the sentences about Bonnie.",
      options: ["Bonnie is a toy poodle.", "She has brown curly fur.", "She has no tail.", "The bus was late.", "Owls hunt at night."],
      answers: [0, 1, 2],
      hint: "\"She\" can mean Bonnie too.",
      why: "The first three are all about Bonnie. \"She\" points back to Bonnie. The bus and the owls are different ideas.",
      lv: { spicy: { q: "Pick the <b>three</b> sentences about the same idea: Bonnie's walk.",
        options: ["Bonnie pulled on her lead at the gate.", "She sniffed every lamp post on the way.", "By the park, she was ready to go home.", "Bonnie has her fur cut every six weeks.", "The park opens at 8am."],
        why: "The first three follow one walk from the gate to the park. The haircut is about Bonnie, but not about her walk. The park opening time is about the park." } } },

    { type: "sort", topic: "Same idea",
      q: "Sort the sentences by idea.",
      buckets: ["About [[place]]", "About lunch"],
      cards: [["[[Place]] was busy.", 0], ["[[Sound]] filled the air.", 0], ["We had cheese sandwiches.", 1], ["The apples were crunchy.", 1]],
      hint: "Ask: is this about the place, or about the food?",
      why: "Busy and the noise are about [[place]]. Sandwiches and apples are about lunch.",
      lv: {
        medium: { cards: [["[[Place]] was busy.", 0], ["[[Sound]] filled the air.", 0], ["There was a long queue at [[spot]].", 0], ["We had cheese sandwiches.", 1], ["The apples were crunchy.", 1], ["Lunch came in a paper bag.", 1]] },
        spicy: { cards: [["[[Place]] was packed.", 0], ["It was hard to find a seat.", 0], ["[[Sound]] filled the air.", 0], ["We had cheese sandwiches.", 1], ["They were a bit squashed.", 1], ["The apples were crunchy, too.", 1]],
          hint: "Look at the little words. What does \"it\" point back to? What does \"they\" point back to?",
          why: "\"It\" points back to [[place]], so the seat sentence is about the place. \"They\" points back to the sandwiches, so that one is about lunch." } } },

    { type: "mc", topic: "Same idea", explain: true,
      q: "Why do these two sentences belong together?<p class=\"a2task\">Bonnie is a toy poodle. She has no tail.</p>",
      fig: '<svg viewBox="0 0 300 170" role="img" aria-label="Bonnie the poodle, with no tail">' + A2ART.bonnie(150, 96, 1.3, "stand") + '</svg>',
      options: ["They are both about Bonnie.", "They both have the word \"is\".", "They are both short."],
      answer: 0,
      slips: { 1: "Look again: the second one does not say \"is\". And sharing a word is not what makes sentences match.", 2: "Lots of short sentences are about different things. What are these two about?" },
      hint: "Who is each sentence about?",
      why: "Both sentences are about Bonnie. \"She\" in the second one points back to Bonnie.",
      lv: { spicy: { q: "Why do these two sentences belong together?<p class=\"a2task\">[[Place]] was packed. It was hard to find a seat.</p>",
        options: ["They are about the same idea: how busy it was.", "They both start with a capital letter.", "They sit next to each other.", "They are both about seats."],
        slips: { 1: "Every sentence starts with a capital. That cannot be what makes these two match.", 2: "Sentences can sit side by side and still be odd socks. What idea do they share?", 3: "Only the second one mentions a seat. What are both of them about?" },
        hint: "What does \"it\" point back to?",
        why: "Both are about how busy [[place]] was. \"It\" points back to [[place]], which links them." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "What is a paragraph?", title: "A paragraph is a group of sentences about one idea",
      fig: page([3, 2, 3], false, true),
      html: "<p>A <b>paragraph</b> is a group of sentences about <b>one idea</b>.</p>" +
        "<p>When the idea changes, a new paragraph starts on a <b>new line</b>. Lots of writers leave a <b>gap</b> between paragraphs, so you can see where each one starts.</p>",
      lv: { spicy: { fig: page([3, 2, 3], true, true),
        html: "<p>A <b>paragraph</b> is a group of sentences about <b>one idea</b>. When the idea changes, a new paragraph starts on a new line.</p>" +
          "<p>Some writers leave a gap. Others <b>indent</b>: the first line starts a little way in, like in this picture.</p>" +
          "<p>The first sentence often tells you what the paragraph is about. It is called the <b>topic sentence</b>.</p>" } } },

    { type: "num", topic: "What is a paragraph?",
      q: "How many paragraphs are on this page?",
      fig: page([2, 3, 2], false, false),
      boxes: [{ label: "Paragraphs", a: 3 }],
      slips: [[7, "That is the number of lines. Count the blocks instead."], [2, "Have another look: count each block with a gap after it, and the last one too."]],
      hint: "Count the blocks, not the lines.",
      why: "There are <b>3</b> blocks of lines, with gaps between them. Each block is a paragraph.",
      lv: {
        medium: { fig: page([2, 3, 2, 3], false, false), boxes: [{ label: "Paragraphs", a: 4 }],
          slips: [[10, "That is the number of lines. Count the blocks instead."], [3, "Nearly. Count again, including the very last block."]],
          why: "There are <b>4</b> blocks of lines. Each block is a paragraph." },
        spicy: { q: "No gaps on this page. How many paragraphs are there?",
          fig: page([3, 2, 3, 2], true, false), boxes: [{ label: "Paragraphs", a: 4 }],
          slips: [[10, "That is the number of lines. Look for the lines that start further in."], [1, "No gaps, but there are still paragraphs. Look for the lines that start further in."], [3, "Nearly. Count the lines that start further in, including the very first one."]],
          hint: "Look for the lines that start a little way in.",
          why: "Four lines start further in (indented), so there are <b>4</b> paragraphs." } } },

    { type: "mc", topic: "What is a paragraph?",
      q: "What is a paragraph?",
      options: ["A group of sentences about one idea", "One very long sentence", "Any five sentences", "A heading"],
      answer: 0,
      slips: { 1: "A paragraph is usually a few sentences, not one long one.", 2: "It is not about how many. It is about sharing one idea.", 3: "A heading is a title. A paragraph is the sentences underneath." },
      hint: "Think about the socks: what makes them a set?",
      why: "A paragraph is a group of sentences that share one idea." },

    { type: "mc", topic: "What is a paragraph?",
      q: "When should a new paragraph start?",
      options: ["When the idea changes", "After every sentence", "When the line is full"],
      answer: 0,
      slips: { 1: "Then every sentence would be on its own. A paragraph holds a few sentences about one idea.", 2: "A full line just carries on onto the next line. Paragraphs are about ideas, not space." },
      hint: "What does a paragraph hold together?",
      why: "A new idea gets a new paragraph.",
      lv: {
        medium: { q: "Where should the new paragraph start?<p class=\"a2task\">1. Bonnie is a toy poodle. 2. She has brown curly fur. 3. Our school has a big field. 4. It has two football goals.</p>",
          options: ["Before sentence 2", "Before sentence 3", "Before sentence 4"], answer: 1, fixed: true,
          slips: { 0: "Sentence 2 is still about Bonnie. \"She\" points back to her.", 2: "Sentence 4 is still about the field. \"It\" points back to the field." },
          hint: "Where does the idea change from Bonnie to something else?",
          why: "Sentences 1 and 2 are about Bonnie. Sentences 3 and 4 are about the field. The new idea starts at sentence 3." },
        spicy: { q: "Where should the new paragraph start?<p class=\"a2task\">1. [[Who]] packed a bag the night before. 2. In the bag went [[kit]]. 3. The alarm was set for 6am. 4. By 9am, [[place]] was packed. 5. [[Sound]] filled the air.</p>",
          options: ["Before sentence 2", "Before sentence 3", "Before sentence 4", "Before sentence 5"], answer: 2, fixed: true,
          slips: { 0: "Sentence 2 is still about the bag.", 1: "Setting the alarm is still part of getting ready.", 3: "Sentence 5 is still about being at [[place]]." },
          hint: "Find where getting ready stops and being there begins.",
          why: "Sentences 1 to 3 are about getting ready. Sentences 4 and 5 are about being at [[place]]. The idea changes at sentence 4." } } },

    { type: "mc", topic: "What is a paragraph?",
      q: "Which box is a paragraph?",
      fig: boxes(["Our class went to the beach.", "The sand was warm.", "We built a big sandcastle."], ["Our class went to the beach.", "My phone needs charging.", "Owls hunt at night."]),
      options: ["Box A", "Box B"], answer: 0, fixed: true,
      slips: { 1: "Box B jumps from the beach to a phone to owls. Three ideas, so it is not one paragraph." },
      hint: "Which box sticks to one idea all the way through?",
      why: "Box A stays on one idea: the trip to the beach. That makes it a paragraph.",
      lv: { spicy: { fig: boxes(["Owls hunt at night.", "Night buses run every hour.", "The night sky was clear."], ["Owls hunt at night.", "They fly almost silently.", "Their big eyes see in the dark."]),
        answer: 1,
        slips: { 0: "Box A says \"night\" every time, but it is about owls, then buses, then the sky. Same word, three ideas." },
        hint: "Sharing a word is not enough. Which box keeps one idea?",
        why: "Box B stays on owls. \"They\" and \"their\" point back to the owls. Box A only shares the word \"night\"." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Odd sock", title: "Spot the odd sock",
      fig: LINE,
      html: "<p>Sometimes a sentence sneaks into a paragraph where it does not belong. It is the <b>odd sock</b>.</p>" +
        "<p>Read each sentence and ask: <b>is this about the same idea as the others?</b></p>" +
        "<p class=\"a2task\">[[Who]] packed a bag for [[event]]. In the bag went [[kit]]. My cousin has a red bike. The alarm was set for 6am.</p>" +
        "<p>Three sentences are about getting ready. The bike is the odd sock.</p>",
      lv: { spicy: { html: "<p>Sometimes a sentence sneaks into a paragraph where it does not belong. It is the <b>odd sock</b>.</p>" +
        "<p>The sneaky ones <b>share a word</b> with the paragraph, so they look as if they fit:</p>" +
        "<p class=\"a2task\">[[Who]] packed a bag for [[event]]. In the bag went [[kit]]. Paper bags were invented in 1852. The alarm was set for 6am.</p>" +
        "<p>The paper bag sentence says \"bag\", but it is a history fact, not about getting ready. Odd sock.</p>" } } },

    { type: "mc", topic: "Odd sock", explain: true,
      q: "Which sentence is the odd sock?<p class=\"a2task\">[[Who]] got to [[place]] at 9am. [[Sound]] filled the air. My nan makes great soup. [[Who]] found a spot near [[spot]].</p>",
      options: ["[[Who]] got to [[place]] at 9am.", "[[Sound]] filled the air.", "My nan makes great soup.", "[[Who]] found a spot near [[spot]]."],
      answer: 2, fixed: true,
      slips: { 0: "This one starts the paragraph off: arriving at [[place]].", 1: "The noise is part of being at [[place]]. It fits.", 3: "Finding a spot is still about being at [[place]]." },
      hint: "Three sentences are about arriving at [[place]]. Which one is not?",
      why: "Soup has nothing to do with arriving at [[place]]. In the wise words of Jay's late, great grandfather: stop. That sentence does not belong.",
      lv: {
        medium: { q: "Which sentence is the odd sock?<p class=\"a2task\">[[Who]] got to [[place]] at 9am. It was already busy. [[Sound]] filled the air. My nan makes great soup on Sundays. [[Who]] found a spot near [[spot]] and waited.</p>",
          options: ["It was already busy.", "[[Sound]] filled the air.", "My nan makes great soup on Sundays.", "[[Who]] found a spot near [[spot]] and waited."],
          slips: { 0: "\"It\" points back to [[place]]. This is about how busy it was.", 1: "The noise is part of being at [[place]].", 3: "Finding a spot is still about being at [[place]]." } },
        spicy: { q: "Which sentence is the odd sock?<p class=\"a2task\">By 9am, [[place]] was packed. People queued all the way to [[spot]]. There was nowhere left to sit. Busy people should drink plenty of water.</p>",
          options: ["By 9am, [[place]] was packed.", "People queued all the way to [[spot]].", "There was nowhere left to sit.", "Busy people should drink plenty of water."],
          answer: 3,
          slips: { 0: "This is the topic sentence: it tells you the idea (how full it was).", 1: "A long queue is part of how full it was.", 2: "Nowhere to sit shows how full it was." },
          hint: "Which one only shares a word with the others?",
          why: "It shares the word \"busy\", but it is general advice, not about how full [[place]] was." } } },

    { type: "mc", topic: "Odd sock",
      q: "Which sentence is not about Bonnie?<p class=\"a2task\">Bonnie is a brown toy poodle. She has curly fur. She has no tail. Many birds fly south in winter.</p>",
      fig: BONNIE,
      options: ["Bonnie is a brown toy poodle.", "She has curly fur.", "She has no tail.", "Many birds fly south in winter."],
      answer: 3, fixed: true,
      slips: { 0: "This one tells you who the paragraph is about.", 1: "\"She\" means Bonnie, so this is about her.", 2: "\"She\" means Bonnie. No tail is very much about her." },
      hint: "Jay likes birds, but is this paragraph about birds?",
      why: "The birds are a different idea. The other three are all about Bonnie.",
      lv: {
        medium: { q: "Which sentence is the odd sock?<p class=\"a2task\">Bonnie loves her walks. She pulls on her lead at the gate. She sniffs every lamp post. Many birds fly south in winter. When she gets home, she sleeps for an hour.</p>",
          options: ["She pulls on her lead at the gate.", "She sniffs every lamp post.", "Many birds fly south in winter.", "When she gets home, she sleeps for an hour."],
          answer: 2,
          slips: { 0: "That is part of her walk.", 1: "Sniffing lamp posts is part of her walk.", 3: "Coming home tired is the end of her walk." },
          why: "The paragraph follows Bonnie's walk. The birds are a different idea." },
        spicy: { q: "Which sentence is the odd sock?<p class=\"a2task\">Bonnie needs a haircut every six weeks. Her curly fur keeps growing and gets tangled. Poodles come in three sizes. At the groomer, she sits very still.</p>",
          options: ["Bonnie needs a haircut every six weeks.", "Her curly fur keeps growing and gets tangled.", "Poodles come in three sizes.", "At the groomer, she sits very still."],
          answer: 2,
          slips: { 0: "This is the topic sentence: the paragraph is about her haircuts.", 1: "This explains why she needs the haircut. It fits.", 3: "Sitting still at the groomer is part of the haircut." },
          hint: "The paragraph is about one thing. Which sentence is about poodles in general?",
          why: "It is about poodles in general, not about Bonnie's haircut. Close, but an odd sock." } } },

    { type: "multi", topic: "Odd sock",
      q: "This paragraph is about getting ready.<p class=\"a2task\">[[Who]] packed a bag for [[event]]. In the bag went [[kit]].</p>Pick the <b>two</b> sentences that could join it.",
      options: ["[[Who]] checked the bag twice.", "The alarm was set for 6am.", "Owls hunt at night.", "My nan makes great soup."],
      answers: [0, 1],
      hint: "Which ones are still about getting ready?",
      why: "Checking the bag and setting the alarm are both part of getting ready.",
      lv: {
        medium: { options: ["[[Who]] checked the bag twice.", "The alarm was set for 6am.", "[[Place]] has a big car park.", "Owls hunt at night.", "My nan makes great soup."],
          why: "Checking the bag and setting the alarm are part of getting ready. The car park is about [[place]], a different idea." },
        spicy: { options: ["[[Who]] checked the bag twice, just in case.", "Everything was ready by 10pm.", "Bags were first made from animal skins.", "The 6am news was about the weather."],
          hint: "Two of these only share a word or a time. Which two are really about getting ready?",
          why: "Checking the bag and being ready by 10pm are both about getting ready. The history of bags and the news only look as if they fit." } } },

    { type: "text", topic: "Odd sock",
      q: "Why is <b>My cousin has a red bike</b> the odd sock in this paragraph? Say it your way.<p class=\"a2task\">[[Who]] packed a bag for [[event]]. In the bag went [[kit]]. My cousin has a red bike. The alarm was set for 6am.</p>",
      need: [["bike", "cousin", "not about", "different", "nothing to do", "does not", "doesn't", "doesnt", "not the same", "another", "other", "off topic", "not packing"]],
      model: "It is about a bike, not about packing the bag.",
      slips: [[["red"], "Red is a colour, but the colour is not the problem. What is the sentence about?"]],
      hint: "What is the bike sentence about? What are the others about?",
      why: "The others are all about getting ready. The bike sentence is about a different idea, so it does not belong.",
      lv: { spicy: { q: "<b>Busy people should drink plenty of water</b> shares the word \"busy\" with the paragraph. Why is it still the odd sock?<p class=\"a2task\">By 9am, [[place]] was packed. People queued all the way to [[spot]]. There was nowhere left to sit. Busy people should drink plenty of water.</p>",
        need: [["advice", "different", "not about", "does not", "doesn't", "doesnt", "general", "everyone", "people", "drink", "water", "nothing to do", "not the same", "only shares", "just shares", "same word"]],
        model: "It only shares the word busy. It is advice about drinking water, not about how full [[place]] was.",
        slips: [[["busy"], "Yes, it says busy. Now say what it is really about, and what the rest is about."]],
        hint: "What is the paragraph about? What is that sentence about?",
        why: "The paragraph is about how full [[place]] was. The water sentence is general advice, so it is a different idea." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Sort the drawer", title: "Muddled sentences, sorted into paragraphs",
      fig: DRAWERS,
      html: "<p>When sentences are muddled up, sort them by <b>idea</b>, like sorting socks into drawers.</p>" +
        "<p>Each pile becomes a <b>paragraph</b>. One idea, one paragraph.</p>",
      lv: { spicy: { html: "<p>When sentences are muddled up, sort them by <b>idea</b>. Each pile becomes a paragraph.</p>" +
        "<p>Use the little pointing words to help: <b>it</b>, <b>they</b> and <b>this</b> usually belong in the same pile as the thing they point back to.</p>" } } },

    { type: "sort", topic: "Sort the drawer",
      q: "Sort the sentences into two paragraphs.",
      buckets: ["Getting ready", "When we got there"],
      cards: [["[[Who]] packed a bag the night before.", 0], ["In the bag went [[kit]].", 0], ["[[Place]] was packed.", 1], ["[[Sound]] filled the air.", 1]],
      hint: "Is it before you leave, or once you are there?",
      why: "Packing happens before. The crowd and the noise are what you find when you get there.",
      lv: {
        medium: { cards: [["[[Who]] packed a bag the night before.", 0], ["In the bag went [[kit]].", 0], ["The alarm was set for 6am.", 0], ["[[Place]] was packed.", 1], ["[[Sound]] filled the air.", 1], ["There was a long queue at [[spot]].", 1]] },
        spicy: { q: "Sort the sentences into three paragraphs.",
          buckets: ["Getting ready", "The journey", "When we got there"],
          cards: [["[[Who]] packed a bag the night before.", 0], ["It was heavier than it looked.", 0], ["The bus took forty minutes.", 1], ["It stopped at every single stop.", 1], ["[[Place]] was packed.", 2], ["[[Sound]] filled the air.", 2]],
          hint: "Two cards start with \"It\". What does each \"it\" point back to?",
          why: "The heavy \"it\" is the bag, so it goes with getting ready. The \"it\" that stops is the bus, so it goes with the journey." } } },

    { type: "mc", topic: "Sort the drawer",
      q: "One more sentence turns up:<p class=\"a2task\">The alarm was set for 6am.</p>Which paragraph does it belong in?",
      options: ["Getting ready", "When we got there"], answer: 0, fixed: true,
      slips: { 1: "Setting an alarm happens before you leave, not once you are there." },
      hint: "Does this happen before you leave, or after you arrive?",
      why: "Setting the alarm is part of getting ready.",
      lv: {
        medium: { q: "One more sentence turns up:<p class=\"a2task\">[[Who]] found a spot near [[spot]].</p>Which paragraph does it belong in?",
          answer: 1,
          slips: { 0: "Finding a spot happens once you have arrived." },
          why: "Finding a spot happens at [[place]], so it goes in the second paragraph." },
        spicy: { q: "A paragraph often starts with a topic sentence that tells you its idea. Which is the best first sentence for the <b>journey</b> paragraph?",
          options: ["Getting there took far longer than planned.", "The bus was blue.", "It stopped at every single stop.", "[[Place]] was packed."],
          answer: 0,
          slips: { 1: "True, maybe, but it does not tell the reader the idea of the paragraph.", 2: "\"It\" needs something before it to point back to, so it cannot go first.", 3: "That is about arriving. It belongs in the next paragraph." },
          hint: "Which one sums up the whole journey?",
          why: "It sums up the journey, so the reader knows what the paragraph is about before the details." } } },

    { type: "text", topic: "Sort the drawer",
      q: "Here is a paragraph about Bonnie. Have a go at writing one more sentence that belongs in it.<p class=\"a2task\">Bonnie is a brown toy poodle. She has curly fur and no tail. She loves her walks.</p>",
      need: [["bonnie", "she", "her", "dog", "poodle", "fur", "tail", "walk", "paw", "bark", "woof"]],
      model: "She likes to sleep on the sofa.",
      slips: [[["bird", "birds", "owl", "bus", "soup"], "That would be an odd sock. Keep it about Bonnie."]],
      hint: "Write anything about Bonnie. Starting with \"She\" works well.",
      why: "Any sentence about Bonnie belongs. \"She likes to sleep on the sofa\" matches the rest.",
      lv: { spicy: { q: "Here is a paragraph about Bonnie. Write a <b>topic sentence</b> that could start a new paragraph about her walks.<p class=\"a2task\">Bonnie is a brown toy poodle. She has curly fur and no tail.</p>",
        need: [["walk", "park", "lead", "outside", "stroll", "run", "lamp post"]],
        model: "Bonnie's walks are the best part of her day.",
        hint: "Tell the reader the new idea: her walks.",
        why: "A topic sentence says what the new paragraph will be about, like \"Bonnie's walks are the best part of her day.\"" } } }
  ],

  realWorld: {
    title: "Every book, article and travel blog uses paragraphs",
    html: "<p>Writers sort their sentences into paragraphs so readers do not get lost. A travel blog might have one paragraph for getting there, one for what they saw, and one for the trip home.</p>" +
      "<p>For our big question: if we could time travel, and you wrote about your trip, each stop in time would get its own paragraph. 1066 in one, 1966 in the next, the year 3000 after that.</p>",
    fig: '<svg viewBox="0 0 440 170" role="img" aria-label="A page with three paragraphs, one for each stop in time, next to a time portal">' +
      '<rect width="440" height="170" rx="16" fill="#f4f1ea"/>' +
      '<rect x="20" y="14" width="250" height="142" rx="6" fill="#fff" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
      [["1066", "#3a8fd6", 30], ["1966", "#19c39a", 72], ["3000", "#8a5cf6", 114]].map(function(p){
        return T(34, p[2] + 14, p[0], 14, { b: 1, c: p[1] }) +
          '<rect x="84" y="' + (p[2] + 4) + '" width="170" height="7" rx="3.5" fill="' + p[1] + '" fill-opacity=".7"/>' +
          '<rect x="84" y="' + (p[2] + 18) + '" width="120" height="7" rx="3.5" fill="' + p[1] + '" fill-opacity=".7"/>';
      }).join("") + A2ART.portal(350, 84, 60) + '</svg>'
  },

  make: {
    title: "Make a paragraph card",
    intro: "Pick an idea and write three sentences that belong together. Stick it up, keep it, or send it to Jay.",
    fields: [
      { id: "idea", label: "The idea", ph: "Bonnie's walks", max: 30 },
      { id: "s1", label: "Sentence 1", ph: "Bonnie loves her walks.", max: 70 },
      { id: "s2", label: "Sentence 2", ph: "She pulls on her lead at the gate.", max: 70 },
      { id: "s3", label: "Sentence 3", ph: "At home, she sleeps for an hour.", max: 70 },
      { id: "name", label: "Writer", ph: "Sock Sorter", max: 24 }
    ],
    svg: function(v){
      var para = [v.s1, v.s2, v.s3].map(function(s){ return String(s || "").trim(); }).filter(Boolean).join(" ");
      var lines = wrap(para, 38, 8), idea = wrap(v.idea, 20, 1)[0] || "";
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">' +
        '<rect width="600" height="420" rx="24" fill="#fffbe9"/>' +
        '<rect x="14" y="14" width="572" height="392" rx="18" fill="none" stroke="#141a33" stroke-width="4" stroke-dasharray="14 8"/>' +
        T(40, 60, "ONE IDEA, ONE PARAGRAPH", 18, { b: 1, c: "#3a8fd6" }) +
        T(40, 100, esc(idea), 26, { b: 1 }) +
        '<path d="M40 116h420" stroke="#ffd23f" stroke-width="5" stroke-linecap="round"/>' +
        lines.map(function(l, k){ return T(40 + (k === 0 ? 24 : 0), 154 + k * 28, esc(l), 19); }).join("") +
        T(40, 386, "Written by " + esc(wrap(v.name, 24, 1)[0] || ""), 16, { c: "#5b6180" }) +
        sock(478, 20, 0.85, "#3a8fd6", "stripe", -6) + sock(520, 26, 0.85, "#3a8fd6", "stripe", 6) +
        '</svg>';
    }
  }
};
})();
