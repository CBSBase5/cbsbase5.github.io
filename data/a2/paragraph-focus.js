/* Base 5 Autumn 2 activity: What is it about?
   English. The focus of a paragraph, and how its sentences link. ASCII only. */
(function(){
var A = window.A2ART;
var F = "Verdana,Arial,sans-serif";
function T(x, y, t, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" font-family="' + F + '" font-size="' + (o.s || 15) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.f || "#141a33") + '">' + t + '</text>';
}

/* a spotlight on the focus, three sentences pointing in, one drifting away */
var FOCUS =
  '<svg viewBox="0 0 520 230" role="img" aria-label="Three sentences point at one focus. One sentence drifts off on its own.">' +
  '<rect width="520" height="230" rx="16" fill="#f4f1ea"/>' +
  '<path d="M260 20l-70 150h140z" fill="#ffd23f" fill-opacity=".35"/>' +
  '<circle cx="260" cy="150" r="52" fill="#fff" stroke="#141a33" stroke-width="3"/>' +
  T(260, 146, "the", { a: "middle", s: 15 }) + T(260, 168, "FOCUS", { a: "middle", s: 18, b: 1, f: "#e04848" }) +
  [[24, 40], [24, 122], [24, 196]].map(function(p, k){
    return '<rect x="' + p[0] + '" y="' + (p[1] - 20) + '" width="130" height="30" rx="8" fill="' + ["#22b8e6", "#19c39a", "#ff5d8f"][k] + '" fill-opacity=".35" stroke="#141a33" stroke-width="2"/>' +
      T(p[0] + 65, p[1], "Sentence " + (k + 1), { a: "middle", s: 14, b: 1 }) +
      '<path d="M' + (p[0] + 134) + ' ' + (p[1] - 5) + 'L200 ' + (150 + (k - 1) * 18) + '" stroke="#141a33" stroke-width="2.5" marker-end="url(#pfA)"/>';
  }).join("") +
  '<defs><marker id="pfA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#141a33"/></marker></defs>' +
  '<g transform="rotate(8 430 70)"><rect x="370" y="50" width="130" height="30" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2" stroke-dasharray="6 4"/>' +
  T(435, 70, "Off topic", { a: "middle", s: 14, f: "#5b6180" }) + '</g>' +
  T(435, 112, "drifts away", { a: "middle", s: 13, f: "#5b6180" }) +
  A.egg(A.bird(452, 180, 0.8, "#8a5cf6"), "This bird has flown right off topic. Outrageous.") +
  '</svg>';

/* three links in a chain: the ways sentences hold on to the focus */
var CHAIN =
  '<svg viewBox="0 0 520 170" role="img" aria-label="A chain of three links: same word, pointing word, another name">' +
  '<rect width="520" height="170" rx="16" fill="#eef6fb"/>' +
  [["Same word", "the rod ... the rod", "#ffd23f"], ["Pointing word", "it, she, they, this", "#19c39a"], ["Another name", "the old building", "#ff5d8f"]].map(function(c, k){
    var x = 95 + k * 165;
    return '<rect x="' + (x - 72) + '" y="34" width="144" height="70" rx="35" fill="' + c[2] + '" fill-opacity=".35" stroke="#141a33" stroke-width="5"/>' +
      T(x, 76, c[0], { a: "middle", s: 15, b: 1 }) +
      T(x, 136, c[1], { a: "middle", s: 13, f: "#3b4160" });
  }).join("") +
  '<path d="M167 69h26M332 69h26" stroke="#141a33" stroke-width="8" stroke-linecap="round"/>' +
  '</svg>';

/* an umbrella: the focus covers every sentence in the paragraph */
var BRELLA =
  '<svg viewBox="0 0 520 220" role="img" aria-label="An umbrella labelled the focus keeps three sentences dry. One sentence outside gets rained on.">' +
  '<rect width="520" height="220" rx="16" fill="#f1f3fb"/>' +
  '<path d="M60 96q150 -110 300 0q-25 -14 -50 0q-25 -14 -50 0q-25 -14 -50 0q-25 -14 -50 0q-25 -14 -50 0q-25 -14 -50 0z" fill="#22b8e6" stroke="#141a33" stroke-width="3"/>' +
  T(210, 66, "the focus", { a: "middle", s: 17, b: 1, f: "#ffffff" }) +
  '<path d="M210 96v84q0 14 -14 14" fill="none" stroke="#141a33" stroke-width="4" stroke-linecap="round"/>' +
  [0, 1, 2].map(function(k){ var x = 80 + k * 90; return '<rect x="' + x + '" y="112" width="76" height="28" rx="6" fill="#fff" stroke="#141a33" stroke-width="2"/>' + T(x + 38, 131, "S" + (k + 1), { a: "middle", s: 14, b: 1 }); }).join("") +
  '<rect x="392" y="150" width="96" height="28" rx="6" fill="#fff" stroke="#141a33" stroke-width="2" stroke-dasharray="5 4"/>' + T(440, 169, "off topic", { a: "middle", s: 13, f: "#5b6180" }) +
  [[400, 40], [430, 70], [460, 30], [480, 100], [410, 110], [450, 125]].map(function(d){ return '<path d="M' + d[0] + ' ' + d[1] + 'l-5 12" stroke="#3a8fd6" stroke-width="3" stroke-linecap="round"/>'; }).join("") +
  '</svg>';

/* a page with paragraphs, each with its own focus tag */
function page(n){
  var tags = ["Getting in", "The food", "The big moment"].slice(0, n);
  return '<svg viewBox="0 0 520 ' + (40 + n * 70) + '" role="img" aria-label="A page split into paragraphs, each with its own focus">' +
    '<rect width="520" height="' + (40 + n * 70) + '" rx="16" fill="#fffdf6" stroke="#141a33" stroke-opacity=".2" stroke-width="2"/>' +
    tags.map(function(t, k){
      var y = 24 + k * 70;
      return '<path d="M44 ' + (y + 6) + 'h250M24 ' + (y + 22) + 'h270M24 ' + (y + 38) + 'h200" stroke="#9aa0b8" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M304 ' + (y + 22) + 'h40" stroke="#141a33" stroke-width="2.5" stroke-dasharray="4 4"/>' +
        '<rect x="350" y="' + (y + 4) + '" width="150" height="36" rx="18" fill="' + ["#ffd23f", "#19c39a", "#ff5d8f"][k] + '" fill-opacity=".45" stroke="#141a33" stroke-width="2"/>' +
        T(425, y + 28, t, { a: "middle", s: 14, b: 1 });
    }).join("") + '</svg>';
}

var BONNIE_FIG = '<svg viewBox="0 0 320 150" role="img" aria-label="Bonnie the poodle">' +
  A.egg(A.bonnie(160, 92, 1.25, "sit"), "Bonnie, on being picked up for a cuddle: Unhand me, goblin.") + '</svg>';

/* paragraph builder sentences, by level: [sentence, belongs] */
var BUILD = {
  mild: { focus: "[[Place]] at night", s: [
    ["At night, [[place]] goes very quiet.", 1], ["Most of the lights are switched off.", 1], ["The doors are locked until morning.", 1],
    ["Bonnie likes sausages.", 0], ["Pizza was first made in Italy.", 0]] },
  medium: { focus: "[[Place]] at night", s: [
    ["At night, [[place]] goes very quiet.", 1], ["Most of the lights are switched off.", 1], ["Only one window still glows.", 1], ["The doors stay locked until morning.", 1],
    ["In the daytime, it is packed with people.", 0], ["The road outside was built in 1900.", 0]] },
  spicy: { focus: "Why [[place]] feels strange at night", s: [
    ["After dark, every sound seems twice as loud.", 1], ["Only one window still glows, and nobody knows who leaves it on.", 1], ["Shadows stretch across the floor like long fingers.", 1],
    ["In the daytime, the cafe sells forty pies an hour.", 0], ["The building was painted blue in 1985.", 0], ["Even the bravest visitors walk a little faster.", 1]] }
};

(window.A2PACKS = window.A2PACKS || {})["paragraph-focus"] = {
  a2: true,
  id: "a2-paragraph-focus",
  title: "What is it about?",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "Every paragraph has a focus: the one thing all its sentences are about.",
  blurb: "Finding the focus of a paragraph, and seeing how its sentences hold on to it. Four short chunks, with a focus card to make at the end.",
  note: "Finding what a paragraph is about, and how its sentences link together. Four five minute chunks and a focus card at the end. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Point and shoot", line: "Point and shoot: short paragraphs, and the focus is easy to spot." },
    { id: "medium", name: "Close up", line: "Close up: longer paragraphs, with sentences that drift a little." },
    { id: "spicy", name: "Sharp focus", line: "Sharp focus: the focus is an idea, not just a word, and you have to work it out." }
  ],
  themes: {
    time: { name: "Time travel", w: { thing: "time machine", place: "the museum", who: "Captain Vega", event: "launch day" } },
    football: { name: "Football", w: { thing: "match ball", place: "the stadium", who: "the goalkeeper", event: "the cup final" } },
    horror: { name: "Horror", w: { thing: "torch", place: "the old hotel", who: "the night porter", event: "the night shift" } },
    fishing: { name: "Fishing", w: { thing: "fishing rod", place: "the boat house", who: "the angler", event: "the fishing contest" } },
    music: { name: "Music", w: { thing: "microphone", place: "the theatre", who: "the singer", event: "opening night" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: FOCUS,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "One paragraph, one focus", title: "A paragraph is about one thing",
      fig: FOCUS,
      html: "<p>A paragraph is a group of sentences that are all about <b>one thing</b>. That one thing is the <b>focus</b>.</p>" +
        "<p class=\"a2task\">The [[thing]] was very old. It had a long scratch down one side. [[Who]] had kept it for twenty years. It still worked perfectly.</p>" +
        "<p>Every sentence talks about the [[thing]]. So the focus is <b>the [[thing]]</b>.</p>",
      lv: { spicy: { html: "<p>A paragraph is a group of sentences that are all about <b>one thing</b>. That one thing is the <b>focus</b>.</p>" +
        "<p>In a lot of real writing the focus is an <b>idea</b>, not just a word. Ask: what is this paragraph really saying about it?</p>" +
        "<p class=\"a2task\">The [[thing]] was very old. It had a long scratch down one side. [[Who]] had kept it for twenty years. It still worked perfectly.</p>" +
        "<p>The word that keeps coming back is the [[thing]]. The idea is sharper: <b>the [[thing]] is old, but still good</b>.</p>" } } ,
      ez: { title: "One focus", html: "<p>A paragraph is about <b>one thing</b>.</p><p>That one thing is its <b>focus</b>.</p>" } },

    { type: "mc", topic: "One paragraph, one focus",
      q: "<p class=\"a2task\">The [[thing]] was very old. It had a long scratch down one side. [[Who]] had kept it for twenty years. It still worked perfectly.</p>What is this paragraph mostly about?",
      options: ["The [[thing]]", "[[Who]]", "Twenty years"],
      answer: 0,
      slips: { 1: "[[Who]] is in one sentence. Which thing is in every sentence?", 2: "Twenty years is a detail in one sentence, not the focus." },
      hint: "Which thing does every sentence talk about?",
      why: "Every sentence is about the [[thing]]: how old it is, the scratch, how long it was kept, and that it works.",
      ez: { q: "<p class=\"a2task\">The [[thing]] was very old. It had a long scratch down one side. [[Who]] had kept it for twenty years. It still worked perfectly.</p>What is it mostly about?",
        hint: "What is in every sentence?", why: "Every sentence is about the [[thing]].", slips: { 1: "[[Who]] is in 1 sentence. What is in all of them?", 2: "That is a small detail." } },
      lv: {
        medium: { q: "<p class=\"a2task\">[[Who]] had kept the same [[thing]] for twenty years. It had a long scratch down one side, and one corner was chipped. Everyone told her to get a new one. She never listened, because it still worked perfectly.</p>What is this paragraph mostly about?",
          options: ["[[Who]] and her old [[thing]]", "Everyone [[who]] knows", "How to fix a scratch"],
          slips: { 1: "Other people are in one sentence. The rest is about her and the [[thing]].", 2: "Nobody fixes anything here. The scratch is just a detail." },
          why: "Every sentence is about her old [[thing]]: how long she has had it, what it looks like, and why she keeps it." },
        spicy: { q: "<p class=\"a2task\">Twenty years, one long scratch and a chipped corner. Everyone told [[who]] to replace it. She would just smile and hold the [[thing]] a little tighter. Some things, she said, are worth keeping.</p>Which is the best way to say what this paragraph is about?",
          options: ["Why the old [[thing]] matters to [[who]]", "What the [[thing]] looks like", "Other people's advice", "How to look after your kit"],
          slips: { 1: "The scratch and the corner are only in the first sentence. Look at where the paragraph ends up.", 2: "The advice is one sentence. She ignores it, which tells you something bigger.", 3: "Nobody looks after anything here. Think about how she feels." },
          why: "The details all build one idea: the [[thing]] is old and battered, but it matters to her, so she keeps it." } } },

    { type: "mc", topic: "One paragraph, one focus",
      q: "<p class=\"a2task\">[[Place]] is at the end of a long road. It has a big red door. Bonnie likes sausages. Inside, there are lots of rooms.</p>Which sentence does <b>not</b> belong?",
      options: ["[[Place]] is at the end of a long road.", "It has a big red door.", "Bonnie likes sausages.", "Inside, there are lots of rooms."],
      answer: 2, fixed: true,
      slips: { 0: "This one is about where [[place]] is. It belongs.", 1: "\"It\" means [[place]] here, so it belongs.", 3: "The rooms are inside [[place]], so it belongs." },
      hint: "Three sentences are about [[place]]. Find the one that is not.",
      why: "Bonnie does like sausages, but this paragraph is about [[place]]. She has wandered in from somewhere else.",
      ez: { q: "<p class=\"a2task\">[[Place]] is at the end of a long road. It has a big red door. Bonnie likes sausages. Inside, there are lots of rooms.</p>Which one does <b>not</b> belong?",
        hint: "Find the one not about [[place]].", why: "It is about Bonnie, not [[place]]. Sausages, though!",
        slips: { 0: "That is about [[place]]. It fits.", 1: "It means [[place]]. It fits.", 3: "The rooms are in [[place]]. It fits." } },
      lv: {
        medium: { q: "<p class=\"a2task\">[[Place]] is at the end of a long road. It has a big red door with a brass handle. The road was built in 1900 by a team of twenty workers. Inside, there are more rooms than anyone has counted.</p>Which sentence does <b>not</b> belong?",
          options: ["[[Place]] is at the end of a long road.", "It has a big red door with a brass handle.", "The road was built in 1900 by a team of twenty workers.", "Inside, there are more rooms than anyone has counted."],
          slips: { 0: "This tells you where [[place]] is, so it belongs.", 1: "\"It\" points back to [[place]], so it belongs.", 3: "The rooms are inside [[place]], so it belongs." },
          hint: "One sentence picks up a word and runs off with it.",
          why: "The road sentence grabs the word \"road\" and drifts off to talk about the road instead of [[place]]." },
        spicy: { q: "<p class=\"a2task\">[[Place]] sits at the end of a long road, hidden by trees. Its red door is the only splash of colour for miles. The trees were planted by a farmer who later moved to Scotland. Once you step inside, the quiet is almost loud.</p>Which sentence breaks the focus?",
          options: ["[[Place]] sits at the end of a long road, hidden by trees.", "Its red door is the only splash of colour for miles.", "The trees were planted by a farmer who later moved to Scotland.", "Once you step inside, the quiet is almost loud."],
          slips: { 0: "This sets the scene for [[place]]. It belongs.", 1: "\"Its\" points back to [[place]]. It belongs.", 3: "Inside means inside [[place]], so it belongs." },
          hint: "One sentence follows a detail somewhere else entirely.",
          why: "The farmer has nothing to do with [[place]]. The sentence hooks on to \"trees\" and wanders off." } } },

    { type: "sort", topic: "One paragraph, one focus",
      q: "These sentences got mixed up. Sort them into two paragraphs.",
      buckets: ["About [[who]]", "About [[place]]"],
      cards: [["[[Who]] has short dark hair.", 0], ["She always wears a green coat.", 0], ["[[Place]] has a big red door.", 1], ["It has lots of rooms.", 1]],
      hint: "\"She\" is a person. \"It\" is a thing or a place.",
      why: "Hair and a coat go with [[who]]. A door and rooms go with [[place]].",
      ez: { q: "Sort them into 2 paragraphs.", hint: "She is a person. It is a place.", why: "Hair and coat: [[who]]. Door and rooms: [[place]]." },
      lv: {
        medium: { cards: [["[[Who]] has short dark hair.", 0], ["She is always the first one there.", 0], ["Her boots are always muddy.", 0], ["[[Place]] has a big red door.", 1], ["Its windows are tall and dusty.", 1], ["Nobody has painted its walls for years.", 1]],
          hint: "She and her point to a person. It and its point to a place.",
          why: "She and her keep the focus on [[who]]. It and its keep the focus on [[place]]." },
        spicy: { buckets: ["About [[who]]", "About [[place]]", "Fits neither"],
          cards: [["She hums when she is nervous.", 0], ["Her boots are always muddy.", 0], ["Its floorboards creak with every step.", 1], ["Nobody has painted its walls for years.", 1], ["Penguins cannot fly.", 2], ["The bus was late on Tuesday.", 2]],
          hint: "Look at the pointing words: she, her, its. Two cards have none and no link at all.",
          why: "She and her point to [[who]], its points to [[place]]. Penguins and the bus have no link to either focus." } } },

    { type: "mc", topic: "One paragraph, one focus",
      q: "Two people wrote about [[event]]. Which paragraph keeps one focus?" +
        "<p class=\"a2task\"><b>A:</b> [[Event]] started badly. First the rain came. Then the lights went out. By the end, though, everyone was smiling.</p>" +
        "<p class=\"a2task\"><b>B:</b> [[Event]] started badly. My cousin has a new puppy. Rain is made of water. I like toast.</p>",
      options: ["Paragraph A", "Paragraph B", "Both of them"],
      answer: 0, fixed: true,
      slips: { 1: "B jumps from [[event]] to a puppy, then rain, then toast. Four sentences, four focuses.", 2: "Only one of them sticks to [[event]] all the way through." },
      hint: "Which one is still talking about [[event]] in its last sentence?",
      why: "Every sentence in A is about how [[event]] went. B wanders off after the first sentence.",
      ez: { q: "Which one sticks to one focus?" +
          "<p class=\"a2task\"><b>A:</b> [[Event]] started badly. First the rain came. Then the lights went out. By the end, though, everyone was smiling.</p>" +
          "<p class=\"a2task\"><b>B:</b> [[Event]] started badly. My cousin has a new puppy. Rain is made of water. I like toast.</p>",
        hint: "Which still talks about [[event]] at the end?", why: "A stays on [[event]]. B wanders off.",
        slips: { 1: "B jumps to a puppy, then rain, then toast.", 2: "Only 1 of them sticks to [[event]]." } },
      lv: { spicy: { q: "Two people wrote about [[event]]. Which paragraph keeps one focus?" +
        "<p class=\"a2task\"><b>A:</b> [[Event]] started badly. First the rain came, then the lights went out. By the end, though, everyone was smiling.</p>" +
        "<p class=\"a2task\"><b>B:</b> [[Event]] started badly. My cousin, who has a new puppy, was there too. Puppies need lots of walks. Ours goes out three times a day.</p>",
        slips: { 1: "B drifts a step at a time: the event, then the cousin, then the puppy, then walks. Each link is small, but the focus has gone.", 2: "One of them drifts away, one small step at a time." },
        why: "A stays on how [[event]] went. B drifts one small link at a time until it is talking about dog walks." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "How the sentences link", title: "Sentences hold hands",
      fig: CHAIN,
      html: "<p>Sentences in a paragraph link together to keep the focus. There are three easy ways to spot the links.</p>" +
        "<p><b>Same word:</b> the word comes back. <b>Pointing word:</b> it, she, he, they or this points back to something. <b>Another name:</b> the same thing gets a new name.</p>" +
        "<p class=\"a2task\">[[Who]] picked up the [[thing]]. <b>She</b> looked at <b>it</b> carefully. The [[thing]] was cold.</p>" +
        "<p><b>She</b> points back to [[who]]. <b>It</b> points back to the [[thing]]. The [[thing]] comes back as the same word.</p>" ,
      ez: { html: "<p>Sentences <b>link</b> to keep the focus.</p><p><b>She</b> and <b>it</b> point back. Or the same word comes back.</p>" } },

    { type: "mc", topic: "How the sentences link",
      q: "<p class=\"a2task\">[[Who]] picked up the [[thing]]. She looked at it carefully.</p>What does <b>it</b> point back to?",
      options: ["The [[thing]]", "[[Who]]", "Carefully"],
      answer: 0,
      slips: { 1: "[[Who]] is a person, so she gets \"she\", not \"it\".", 2: "\"Carefully\" says how she looked. \"It\" points back to a thing." },
      hint: "What did she pick up?",
      why: "\"It\" points back to the [[thing]]. That link keeps both sentences on the same focus.",
      ez: { why: "<b>It</b> means the [[thing]].", slips: { 1: "[[Who]] is a person. That is she.", 2: "Carefully says how. It is a thing." } },
      lv: {
        medium: { q: "<p class=\"a2task\">[[Who]] left the [[thing]] by the door of [[place]]. When she came back, it had gone.</p>What does <b>it</b> point back to?",
          options: ["The [[thing]]", "The door", "[[Place]]"],
          slips: { 1: "The door is still there. What could have gone missing?", 2: "[[Place]] has not gone anywhere. Something smaller has." },
          hint: "What would make sense if it had gone?",
          why: "The [[thing]] is what she left, so the [[thing]] is what had gone." },
        spicy: { q: "<p class=\"a2task\">The lights flickered, the doors slammed and the [[thing]] stopped working. This made [[who]] wonder if she should leave.</p>What does <b>This</b> point back to?",
          options: ["Everything that happened in the first sentence", "The doors", "The [[thing]]", "[[Who]]"],
          slips: { 1: "The doors are part of it, but not all of it.", 2: "The [[thing]] is one of three things that happened.", 3: "\"This\" made [[who]] wonder, so it cannot be her." },
          hint: "\"This\" can point back to a whole idea, not just one word.",
          why: "\"This\" sums up everything in the first sentence: the lights, the doors and the [[thing]]. All of it together made her wonder." } } },

    { type: "multi", topic: "How the sentences link",
      q: "<p class=\"a2task\">[[Who]] arrived at [[place]] early. She was nervous. Her hands were shaking. She took a deep breath.</p>Pick the words that point back to [[who]].",
      options: ["She", "Her", "early", "nervous", "breath"],
      answers: [0, 1],
      hint: "Look for the small words that stand in for a person.",
      why: "\"She\" and \"Her\" both point back to [[who]]. They keep every sentence on her.",
      ez: { q: "<p class=\"a2task\">[[Who]] arrived at [[place]] early. She was nervous. Her hands were shaking. She took a deep breath.</p>Pick the words that mean [[who]].",
        hint: "Small words that stand for a person.", why: "<b>She</b> and <b>Her</b> mean [[who]]." },
      lv: {
        medium: { q: "<p class=\"a2task\">[[Who]] and her friend arrived at [[place]] early. They were nervous. Their hands were shaking. Nobody else was there yet.</p>Pick the words that point back to <b>both</b> of them.",
          options: ["They", "Their", "her", "Nobody", "early"],
          answers: [0, 1],
          hint: "Which words mean more than one person?",
          why: "\"They\" and \"Their\" point back to both people. \"Her\" is only [[who]], and \"Nobody\" is everyone else." },
        spicy: { q: "<p class=\"a2task\">[[Place]] has stood empty for years. The old building creaks in the wind. Its windows are cracked. Nobody goes near the place any more.</p>Pick the <b>three</b> words or phrases that keep the focus on [[place]].",
          options: ["The old building", "Its", "the place", "the wind", "Nobody"],
          answers: [0, 1, 2],
          hint: "One is another name, one is a pointing word, one is a short way of saying it again.",
          why: "\"The old building\" is another name, \"Its\" is a pointing word, and \"the place\" says it again. Three different links, one focus." } } },

    { type: "order", topic: "How the sentences link",
      q: "Put these in order to make a paragraph. The links will help.",
      items: ["[[Who]] found a box at [[place]].", "Inside it was a note.", "The note said: see you at midnight."],
      hint: "\"It\" needs the box to come first. \"The note\" needs the note to come first.",
      why: "Each sentence holds on to the one before: the box, then inside it, then the note.",
      ez: { q: "Put these in order. The links help.", hint: "The box comes first.", why: "The box, then inside it, then the note." },
      lv: {
        medium: { items: ["[[Who]] found a box at [[place]].", "It was covered in thick dust.", "Inside it was a folded note.", "The note said: see you at midnight."] },
        spicy: { items: ["[[Who]] found a box at [[place]].", "It was covered in thick dust.", "Inside it was a folded note.", "The note said: see you at midnight.", "She has not slept since."],
          why: "Each sentence holds on to the one before. The last one only works once you know about the note, so it has to come at the end." } } },

    { type: "mc", topic: "How the sentences link", explain: true,
      q: "<p class=\"a2task\">The [[thing]] was very old. It still worked perfectly.</p>Why do these two sentences belong together?",
      options: ["Both are about the [[thing]], and \"it\" points back to it.", "They are both short.", "They both start with a capital letter.", "They both end with a full stop."],
      answer: 0,
      slips: { 1: "Lots of sentences are short. That does not make them belong together.", 2: "Every sentence starts with a capital letter.", 3: "Every sentence ends with a full stop or a mark like it." },
      hint: "What are both sentences talking about?",
      why: "They share a focus, the [[thing]], and the word \"it\" links the second one back to the first.",
      ez: { q: "<p class=\"a2task\">The [[thing]] was very old. It still worked perfectly.</p>Why do they belong together?",
        hint: "What are both about?", why: "Both are about the [[thing]]. <b>It</b> links them.",
        slips: { 1: "Lots of sentences are short.", 2: "Every sentence has a capital.", 3: "Every sentence has a full stop." } },
      lv: { spicy: { q: "<p class=\"a2task\">[[Place]] has stood empty for years. The old building creaks in the wind.</p>Why do these two sentences belong together?",
        options: ["\"The old building\" is another name for [[place]], so the focus stays the same.", "They are both about the wind.", "They both use the word \"the\".", "They are both about being empty."],
        slips: { 1: "Only the second one mentions wind.", 2: "Lots of sentences use \"the\". That is not a link.", 3: "Only the first one says it is empty." },
        why: "The second sentence gives [[place]] another name, \"the old building\". Same focus, new words." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Say what it is about", title: "Say it in one line",
      fig: BRELLA,
      html: "<p>To find the focus, ask: <b>what does every sentence talk about?</b> The focus is the umbrella they all fit under.</p>" +
        "<p class=\"a2task\">[[Who]] gets up at six. She has toast. Then she checks her bag twice.</p>" +
        "<p>Every sentence is about her getting ready. So you can say: <b>This paragraph is about [[who]] getting ready.</b></p>",
      lv: { spicy: { html: "<p>To find the focus, ask: <b>what does every sentence talk about?</b> The focus is the umbrella they all fit under.</p>" +
        "<p class=\"a2task\">[[Who]] gets up at six. She has toast. Then she checks her bag twice, and once more by the door.</p>" +
        "<p>\"This paragraph is about [[who]]\" is true, but blurry. Sharper: <b>This paragraph is about [[who]] being nervous and careful as she gets ready.</b> Checking three times tells you that.</p>" } } ,
      ez: { html: "<p>Ask: <b>what is every sentence about?</b></p><p>Then say it in 1 line.</p>" } },

    { type: "text", topic: "Say what it is about",
      q: "<p class=\"a2task\">Bonnie is a small brown poodle. She has curly fur and no tail. She loves walks in the park. Her favourite treat is a crunchy biscuit.</p>Finish this: <b>This paragraph is about ...</b>",
      fig: BONNIE_FIG,
      need: [["bonnie", "poodle", "dog", "jay's dog", "jays dog"]],
      model: "This paragraph is about Bonnie.",
      slips: [[["walk", "park"], "Walks are in one sentence. Who is every sentence about?"], [["biscuit", "treat"], "The treat is in one sentence. Who is every sentence about?"]],
      hint: "Who is in every single sentence?",
      why: "Every sentence is about Bonnie: what she is, what she looks like, what she loves.",
      ez: { hint: "Who is in every sentence?", why: "Every sentence is about Bonnie.",
        slips: [[[], "Walks are in 1 sentence. Who is in all of them?"], [[], "The treat is in 1 sentence. Who is in all of them?"]] },
      lv: { spicy: { q: "<p class=\"a2task\">Bonnie is a small brown poodle with no tail. She will sit for a biscuit, but not for anything else. When Jay says \"walk\", she spins in circles. If he says \"bath\", she hides under the sofa.</p>Finish this, as sharply as you can: <b>This paragraph is about ...</b>",
        model: "This paragraph is about Bonnie and how she only does what she wants.",
        why: "Bonnie is the focus. A sharper answer says what the paragraph shows about her: she has a mind of her own, and words like walk and bath change everything." } } },

    { type: "mc", topic: "Say what it is about",
      q: "<p class=\"a2task\">During [[event]], the rain did not stop. Puddles filled every corner. Everyone's coats were soaked. Even the umbrellas gave up.</p>Which heading suits this paragraph best?",
      options: ["A very wet day", "Coats", "Umbrellas", "Corners"],
      answer: 0,
      slips: { 1: "Coats are in one sentence. What do all four sentences have in common?", 2: "Umbrellas are in the last sentence only.", 3: "Corners are a tiny detail." },
      hint: "What is the same in every sentence?",
      why: "Rain, puddles, soaked coats, broken umbrellas: it is all about how wet it was.",
      ez: { q: "<p class=\"a2task\">During [[event]], the rain did not stop. Puddles filled every corner. Everyone's coats were soaked. Even the umbrellas gave up.</p>Which heading fits best?",
        hint: "What is in every sentence?", why: "Rain, puddles, wet coats. A very wet day!",
        slips: { 1: "Coats are in 1 sentence.", 2: "Umbrellas are only at the end.", 3: "Corners are a tiny detail." } },
      lv: { spicy: { options: ["Nothing could stand up to the rain", "Coats and umbrellas", "What to wear in bad weather", "A day out"],
        slips: { 1: "Those are two details. The heading needs the idea they show.", 2: "The paragraph does not give advice. It tells you what happened.", 3: "True, but blurry. It does not say anything about the rain." },
        why: "Every sentence shows the rain winning: puddles everywhere, coats soaked, even the umbrellas giving up. The best heading says that idea." } } },

    { type: "text", topic: "Say what it is about", explain: true,
      q: "<p class=\"a2task\">[[Who]] loves [[event]]. She gets there an hour early every time.</p>How do these two sentences belong together? Write it in your own words.",
      need: [["she", "both", "same", "her", "points", "about"]],
      model: "Both sentences are about [[who]]. She points back to her.",
      slips: [[["short", "capital", "full stop"], "That is true of lots of sentences. What are both of them talking about?"]],
      hint: "Who are both sentences about? Which word points back?",
      why: "Both sentences are about [[who]], and \"She\" points back to her. Same focus, linked by a pointing word.",
      ez: { q: "<p class=\"a2task\">[[Who]] loves [[event]]. She gets there an hour early every time.</p>How do they belong together? Use your own words.",
        hint: "Start with: Both sentences are about ...", why: "Both are about [[who]]. <b>She</b> points back to her.",
        slips: [[[], "True of lots of sentences. Who are both about?"]] },
      lv: { mild: { hint: "Try starting with: Both sentences are about ..." } } },

    { type: "mc", topic: "Say what it is about",
      q: "<p class=\"a2task\">During [[event]], the rain did not stop. Puddles filled every corner. Everyone's coats were soaked.</p>Which sentence would fit at the end?",
      options: ["Even the umbrellas blew inside out.", "The car park was built in 1990.", "My favourite colour is blue."],
      answer: 0,
      slips: { 1: "That sentence is about building a car park, not the rain.", 2: "That is about you, not the rain." },
      hint: "Which one keeps talking about the rain?",
      why: "Umbrellas blowing inside out keeps the focus on the wet, wild weather.",
      ez: { hint: "Which one is about the rain?", why: "Umbrellas keep it on the wet weather.", slips: { 1: "That is about a car park.", 2: "That is about you, not the rain." } },
      lv: { spicy: { options: ["Even the umbrellas blew inside out.", "Some people say rain is good for gardens.", "The car park was built in 1990.", "Rain can be measured in millimetres."],
        slips: { 1: "It is about rain, but it changes the focus to gardens and what people think. The paragraph is about this one wet day.", 2: "A car park being built is a different focus.", 3: "That is a fact about rain in general, not about this day." },
        why: "The paragraph is about rain spoiling this one day. Only the umbrellas sentence keeps that exact focus." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Focus finder", title: "A longer piece",
      fig: page(2),
      html: "<p>Longer pieces have more than one paragraph. Each paragraph has its own focus. Have a read.</p>" +
        "<p class=\"a2task\">We got to [[place]] at ten. The queue was very long. It took an hour to get in.</p>" +
        "<p class=\"a2task\">Inside, the food was great. I had hot soup. My friend had a big bowl of chips.</p>",
      lv: {
        medium: { fig: page(3), html: "<p>Longer pieces have more than one paragraph. Each paragraph has its own focus. Have a read.</p>" +
          "<p class=\"a2task\">We got to [[place]] at ten. The queue went right round the corner, and it took an hour to get in.</p>" +
          "<p class=\"a2task\">Inside, the food was great. I had hot tomato soup. My friend had a big bowl of chips and said it was the best thing all week.</p>" +
          "<p class=\"a2task\">Then it was time for [[event]]. Everyone rushed to find a good spot.</p>" },
        spicy: { fig: page(3), html: "<p>Longer pieces have more than one paragraph. Each paragraph has its own focus. Have a read.</p>" +
          "<p class=\"a2task\">We reached [[place]] just after ten, only to find a queue snaking round the corner. An hour later, still shuffling forward, we had learned every crack in the pavement.</p>" +
          "<p class=\"a2task\">Inside, though, the wait was soon forgotten. The soup was hot, the chips were salty, and my friend declared it the best lunch of her life.</p>" +
          "<p class=\"a2task\">Then it was time for [[event]], and the whole room went quiet.</p>" } } ,
      ez: { html: "<p>Each paragraph has its own focus. Have a read.</p>" +
        "<p class=\"a2task\">We got to [[place]] at ten. The queue was very long. It took an hour to get in.</p>" +
        "<p class=\"a2task\">Inside, the food was great. I had hot soup. My friend had a big bowl of chips.</p>" } },

    { type: "mc", topic: "Focus finder",
      q: "What is the <b>first</b> paragraph about?" +
        "<p class=\"a2task\">We got to [[place]] at ten. The queue was very long. It took an hour to get in.</p>",
      options: ["Getting in", "The food", "Ten o'clock"],
      answer: 0,
      slips: { 1: "The food is the next paragraph.", 2: "Ten is a detail. What is the whole paragraph about?" },
      hint: "What do the queue and the hour have in common?",
      why: "Arriving, the queue and the hour all tell you about getting in.",
      ez: { hint: "The queue, the hour ... what is it about?", why: "The queue and the wait. It is about getting in.", slips: { 1: "The food is next.", 2: "Ten is a small detail." } },
      lv: { medium: { q: "What is the <b>first</b> paragraph about?" +
          "<p class=\"a2task\">We got to [[place]] at ten. The queue went right round the corner, and it took an hour to get in.</p>" },
        spicy: { q: "Which is the best way to say what the <b>first</b> paragraph is about?" +
          "<p class=\"a2task\">We reached [[place]] just after ten, only to find a queue snaking round the corner. An hour later, still shuffling forward, we had learned every crack in the pavement.</p>",
          options: ["The long, boring wait to get in", "Cracks in the pavement", "What time they arrived", "The best lunch ever"],
          slips: { 1: "The cracks are a detail. They show you how long and dull the wait was.", 2: "The time is one detail. The rest is about the wait.", 3: "That is the next paragraph." },
          why: "Every detail, even the cracks in the pavement, is there to show how long and dull the wait was." } } },

    { type: "mc", topic: "Focus finder",
      q: "What is the <b>second</b> paragraph about?" +
        "<p class=\"a2task\">Inside, the food was great. I had hot soup. My friend had a big bowl of chips.</p>",
      options: ["The food", "The queue", "My friend"],
      answer: 0,
      slips: { 1: "The queue was the first paragraph.", 2: "My friend is in one sentence. What is in all of them?" },
      hint: "Soup, chips ... what are they?",
      why: "Every sentence is about the food: it was great, the soup, the chips.",
      ez: { why: "Soup and chips. It is about the food.", slips: { 1: "The queue was paragraph 1.", 2: "My friend is in 1 sentence." } },
      lv: { medium: { q: "What is the <b>second</b> paragraph about?" +
          "<p class=\"a2task\">Inside, the food was great. I had hot tomato soup. My friend had a big bowl of chips and said it was the best thing all week.</p>" },
        spicy: { q: "Which is the best way to say what the <b>second</b> paragraph is about?" +
          "<p class=\"a2task\">Inside, though, the wait was soon forgotten. The soup was hot, the chips were salty, and my friend declared it the best lunch of her life.</p>",
          options: ["A great lunch made up for the wait", "Soup and chips", "My friend's opinions", "Salt"],
          slips: { 1: "Those are the details. What idea do they add up to?", 2: "Her opinion is one part of it, about the lunch.", 3: "Salt is one tiny detail." },
          why: "\"Though\" and \"the wait was soon forgotten\" link back to paragraph one. The focus is a great lunch that made the wait worth it." } } },

    { type: "widget", topic: "Focus finder", unscored: true,
      title: "Build a paragraph",
      html: "Here is a focus. Tap the sentences that belong to it to build a paragraph. Tap again to take one out. When you are happy, tap <b>Check my paragraph</b>.",
      ez: { html: "Tap the sentences that fit the focus. Then tap <b>Check my paragraph</b>." },
      mount: function(el, api){
        var lv = BUILD[api.level] ? api.level : "medium";
        var set = BUILD[lv], list = set.s.map(function(s){ return [api.tok(s[0]), s[1]]; });
        var d = api.data;
        if(d.lv !== lv){ d.lv = lv; d.on = []; d.checked = false; }
        var box = document.createElement("div");
        box.innerHTML = '<p style="margin:8px 0"><b>Focus:</b> <span style="background:#ffd23f;padding:2px 8px;border-radius:8px;color:#141a33">' + api.tok(set.focus) + '</span></p>';
        var para = document.createElement("div");
        para.style.cssText = "min-height:56px;padding:12px;border-radius:12px;border:3px dashed #141a33;background:#fffdf6;color:#141a33;line-height:1.6;margin:8px 0";
        var pool = document.createElement("div");
        pool.style.cssText = "display:flex;flex-direction:column;gap:8px;margin:10px 0";
        var out = document.createElement("p");
        var go = document.createElement("button");
        go.type = "button"; go.className = "btn"; go.textContent = "Check my paragraph";
        var btns = list.map(function(s, k){
          var b = document.createElement("button");
          b.type = "button";
          b.style.cssText = "text-align:left;font:inherit;padding:10px 12px;border-radius:10px;border:2px solid #141a33;background:#fff;color:#141a33;cursor:pointer";
          b.textContent = s[0];
          b.onclick = function(){
            if(d.checked) return;
            var i = d.on.indexOf(k);
            if(i >= 0) d.on.splice(i, 1); else d.on.push(k);
            draw(); api.save();
          };
          pool.appendChild(b);
          return b;
        });
        function draw(){
          para.textContent = d.on.length ? d.on.map(function(k){ return list[k][0]; }).join(" ") : "Your paragraph builds up here.";
          btns.forEach(function(b, k){
            var on = d.on.indexOf(k) >= 0, fits = list[k][1] === 1;
            b.style.background = on ? "#d8f5ec" : "#fff";
            b.style.borderStyle = "solid";
            if(d.checked){
              b.style.borderColor = fits ? "#0f7a5f" : "#c28a00";
              if(on !== fits) b.style.borderStyle = "dashed";
              b.style.cursor = "default";
            }
          });
          if(d.checked){
            var want = list.filter(function(s){ return s[1] === 1; }).length;
            var got = d.on.filter(function(k){ return list[k][1] === 1; }).length;
            var extra = d.on.length - got;
            out.innerHTML = "You found <b>" + got + " of " + want + "</b> sentences that fit the focus." +
              (extra ? " " + extra + " of yours wandered off topic (dashed edge). See how they talk about something else?" : " Nothing off topic crept in. Sharp work.") +
              " The solid green edges show the ones that belong.";
            go.textContent = "Have another go";
          }else{
            out.textContent = "";
            go.textContent = "Check my paragraph";
          }
        }
        go.onclick = function(){
          if(d.checked){ d.checked = false; d.on = []; draw(); api.save(); return; }
          if(!d.on.length){ out.textContent = "Tap a sentence or two first."; return; }
          d.checked = true; draw(); api.save(); api.done("done");
        };
        el.appendChild(box); el.appendChild(para); el.appendChild(pool); el.appendChild(go); el.appendChild(out);
        draw();
      } }
  ],

  realWorld: {
    title: "Finding the paragraph you need",
    html: "<p>Nobody reads a whole guidebook, a manual or a long web page from top to bottom. People skim for the paragraph whose focus they need: <b>how to get there</b>, <b>what it costs</b>, <b>what to watch out for</b>.</p>" +
      "<p>Picture a time traveller's guide to Victorian London. If we could time travel, the paragraph about staying safe might be the one worth finding fast.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to a time portal, wondering which paragraph to read">' + A.portal(76, 76, 54) + A.jay(240, 56, 0.85, "hmm") +
      A.bubble(292, 8, 120, 52, "Which bit do\nI need?", 296) + '</svg>'
  },

  ez: {
    realWorld: { html: "<p>People skim for the paragraph they need.</p><p>A time traveller would look for <b>staying safe</b> first!</p>" },
    make: { intro: "Pick a focus. Write 3 short sentences about it." }
  },

  make: {
    title: "Make a focus card",
    intro: "Pick a focus, then write three short sentences that all belong to it. Keep it, stick it up, or send it to Jay.",
    fields: [
      { id: "focus", label: "My focus", ph: "My best day out", max: 30 },
      { id: "s1", label: "Sentence 1", ph: "We went to the seaside in July.", max: 70 },
      { id: "s2", label: "Sentence 2", ph: "It was hot, so we got ice lollies.", max: 70 },
      { id: "s3", label: "Sentence 3", ph: "We stayed until the sun went down.", max: 70 }
    ],
    svg: function(v){
      function e(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n, m){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if(cur && (cur + " " + x).length > n){ out.push(cur); cur = x; } else cur = cur ? cur + " " + x : x; }); if(cur) out.push(cur); return out.slice(0, m); }
      var cols = ["#22b8e6", "#19c39a", "#ff5d8f"];
      var fl = wrap(v.focus, 22, 2);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 440">' +
        '<rect width="600" height="440" rx="24" fill="#fffbe9"/>' +
        '<path d="M120 150q180 -150 360 0q-30 -16 -60 0q-30 -16 -60 0q-30 -16 -60 0q-30 -16 -60 0q-30 -16 -60 0q-30 -16 -60 0z" fill="#22b8e6" stroke="#141a33" stroke-width="3"/>' +
        '<text x="300" y="44" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="16" font-weight="700" fill="#141a33" letter-spacing="3">FOCUS CARD</text>' +
        fl.map(function(l, k){ return '<text x="300" y="' + (102 + k * 26 - (fl.length - 1) * 10) + '" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="22" font-weight="700" fill="#ffffff">' + e(l) + '</text>'; }).join("") +
        [v.s1, v.s2, v.s3].map(function(s, k){
          var y = 172 + k * 86, ls = wrap(s, 40, 2);
          return '<rect x="40" y="' + y + '" width="520" height="72" rx="12" fill="#ffffff" stroke="' + cols[k] + '" stroke-width="4"/>' +
            '<circle cx="70" cy="' + (y + 36) + '" r="16" fill="' + cols[k] + '"/><text x="70" y="' + (y + 42) + '" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="16" font-weight="700" fill="#141a33">' + (k + 1) + '</text>' +
            ls.map(function(l, j){ return '<text x="100" y="' + (y + (ls.length > 1 ? 30 : 42) + j * 24) + '" font-family="Verdana,Arial,sans-serif" font-size="18" fill="#141a33">' + e(l) + '</text>'; }).join("");
        }).join("") +
        '</svg>';
    }
  }
};
})();
