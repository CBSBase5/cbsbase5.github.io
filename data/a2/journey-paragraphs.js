/* Base 5 Autumn 2 activity: One stop, one paragraph.
   English. Using paragraphs to separate the stages of a journey, topic
   sentences, splitting a block, and developing each paragraph.
   Every theme carries its own short travelogue. ASCII only. */
(function(){
var A = window.A2ART;
var INK = "#141a33", F = ' font-family="Verdana,Arial,sans-serif"';
function tx(x, y, s, size, fill, more){
  return '<text x="' + x + '" y="' + y + '"' + F + ' font-size="' + size + '" fill="' + (fill || INK) + '"' + (more || "") + '>' + s + '</text>';
}
function lines(x, y, w, n, col){
  var o = "";
  for(var i = 0; i < n; i++) o += '<rect x="' + x + '" y="' + (y + i * 12) + '" width="' + (i === n - 1 ? w * 0.6 : w) + '" height="6" rx="3" fill="' + (col || "#c9c2b2") + '"/>';
  return o;
}

/* the route: four stops, each with its own paragraph */
var ROUTE = '<svg viewBox="0 0 460 250" role="img" aria-label="A journey with four stops, and one paragraph for each stop">' +
  '<rect width="460" height="250" rx="16" fill="#f4f1ea"/>' +
  '<path d="M40 34V216" stroke="#8a5cf6" stroke-width="5" stroke-dasharray="10 7" stroke-linecap="round"/>' +
  [0, 1, 2, 3].map(function(k){
    var y = 34 + k * 60, col = ["#ffd23f", "#22b8e6", "#19c39a", "#ff5d8f"][k];
    return '<circle cx="40" cy="' + y + '" r="15" fill="' + col + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      tx(40, y + 5, String(k + 1), 14, INK, ' text-anchor="middle" font-weight="700"') +
      tx(66, y + 5, "[[Stop" + (k + 1) + "]]", 15, INK, ' font-weight="700"') +
      '<rect x="296" y="' + (y - 20) + '" width="148" height="44" rx="8" fill="#ffffff" stroke="' + col + '" stroke-width="3"/>' +
      lines(308, y - 12, 124, 3) +
      '<path d="M270 ' + y + 'h20" stroke="' + col + '" stroke-width="3" stroke-linecap="round"/>';
  }).join("") +
  A.egg(A.bird(256, 230, 0.5, "#3a8fd6"), "A bird, flying the whole route without stopping once. No paragraphs for birds. Jay is a bit jealous.") +
  '</svg>';

/* one paragraph, topic sentence first */
function para(rows, label){
  var o = '<svg viewBox="0 0 460 ' + (40 + rows.length * 46) + '" role="img" aria-label="' + label + '"><rect width="460" height="' + (40 + rows.length * 46) + '" rx="16" fill="#f4f1ea"/>' +
    '<rect x="16" y="16" width="250" height="' + (rows.length * 46 + 8) + '" rx="10" fill="#ffffff" stroke="' + INK + '" stroke-width="2.5"/>';
  rows.forEach(function(r, k){
    var y = 24 + k * 46;
    o += '<rect x="26" y="' + y + '" width="230" height="38" rx="8" fill="' + r[1] + '"/>' + lines(36, y + 9, 206, 2, r[2] || "#8f8a7c") +
      '<path d="M262 ' + (y + 19) + 'h22" stroke="' + INK + '" stroke-width="2" stroke-dasharray="4 3"/>' +
      tx(292, y + 16, r[0], 14, INK, ' font-weight="700"') + (r[3] ? tx(292, y + 34, r[3], 13, "#5b6180") : "");
  });
  return o + '</svg>';
}
var TOPIC = para([["Topic sentence", "#ffd23f", "#8a6a00", "Where are we now?"], ["Detail", "#e8e4da"], ["Detail", "#e8e4da"]], "A paragraph with its first sentence highlighted as the topic sentence");
var BUILD = para([["Topic sentence", "#ffd23f", "#8a6a00", "Where are we?"], ["Details", "#d9f3ff", "#1f6fb2", "See, hear, smell"], ["Feeling", "#ffe3ec", "#b0305c", "What it meant"]], "A paragraph built from a topic sentence, details and a feeling");
var BUILD2 = para([["Topic sentence", "#ffd23f", "#8a6a00", "Where, and the focus"], ["Develop", "#d9f3ff", "#1f6fb2", "Details on that focus"], ["Develop", "#e6f9ef", "#1f9d63", "A surprise or contrast"], ["Reflect", "#ffe3ec", "#b0305c", "What it meant"]], "A developed paragraph: topic sentence, two developing sentences and a reflection");

/* a block of text with the turning points marked */
var SPLIT = '<svg viewBox="0 0 460 210" role="img" aria-label="One long block of writing, with scissors where the place and time change">' +
  '<rect width="460" height="210" rx="16" fill="#f4f1ea"/>' +
  '<rect x="16" y="16" width="270" height="178" rx="10" fill="#ffffff" stroke="' + INK + '" stroke-width="2.5"/>' +
  lines(30, 30, 240, 4) + '<path d="M22 82h260" stroke="#e04848" stroke-width="2.5" stroke-dasharray="7 5"/>' +
  lines(30, 92, 240, 4) + '<path d="M22 144h260" stroke="#e04848" stroke-width="2.5" stroke-dasharray="7 5"/>' +
  lines(30, 154, 240, 3) +
  '<g transform="translate(292 82)"><circle cx="0" cy="-6" r="6" fill="none" stroke="' + INK + '" stroke-width="2.5"/><circle cx="0" cy="6" r="6" fill="none" stroke="' + INK + '" stroke-width="2.5"/><path d="M5 -3l18 6M5 3l18 -6" stroke="' + INK + '" stroke-width="2.5"/></g>' +
  '<g transform="translate(292 144)"><circle cx="0" cy="-6" r="6" fill="none" stroke="' + INK + '" stroke-width="2.5"/><circle cx="0" cy="6" r="6" fill="none" stroke="' + INK + '" stroke-width="2.5"/><path d="M5 -3l18 6M5 3l18 -6" stroke="' + INK + '" stroke-width="2.5"/></g>' +
  tx(324, 78, "New place:", 14, INK, ' font-weight="700"') + tx(324, 96, "\"We reached...\"", 13, "#5b6180") +
  tx(324, 140, "Time moves:", 14, INK, ' font-weight="700"') + tx(324, 158, "\"By lunchtime...\"", 13, "#5b6180") +
  '</svg>';

function P(k){ return "[[A" + k + "]] [[B" + k + "]] [[C" + k + "]]"; }

(window.A2PACKS = window.A2PACKS || {})["journey-paragraphs"] = {
  a2: true,
  id: "a2-journey-paragraphs",
  title: "One stop, one paragraph",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "A travelogue is a journey on paper. Every new stop gets a new paragraph.",
  blurb: "Using paragraphs to show the stages of a journey: where to break, how to start each one, and how to make each paragraph worth reading. Four short chunks, and a postcard to write at the end.",
  note: "Paragraphs for a travelogue: one stop, one paragraph. Four five minute chunks and a postcard at the end. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Day out", line: "Day out: short paragraphs, spot where each stop begins." },
    { id: "medium", name: "Weekend away", line: "Weekend away: topic sentences, and splitting a long block into stages." },
    { id: "spicy", name: "Grand tour", line: "Grand tour: subtle breaks, changes of focus, and developing every paragraph." }
  ],
  themes: {
    time: { name: "Time travel", w: {
      trip: "a trip back to 1851",
      stop1: "the time lab", stop2: "a London station", stop3: "the Great Exhibition", stop4: "the river at sunset", stop5: "a coffee house", key5: "coffee",
      a1: "We met at the time lab just after nine.", b1: "The portal hummed like a fridge and smelled faintly of burnt toast.", c1: "I held my ticket so tightly it went soft.",
      a2: "We stepped out at a London station in 1851.", b2: "Steam hissed from every engine, and nobody looked twice at our trainers.", c2: "A boy sold us hot potatoes for a penny.",
      a3: "By lunchtime, we had reached the Great Exhibition.", b3: "The glass hall was so tall that birds were flying around inside it.", c3: "I counted eleven machines that I could not even name.",
      a4: "Our last stop was the river at sunset.", b4: "The water was brown and the smell was outrageous, but the boats were beautiful.", c4: "We jumped home at six, tired and still smelling of steam.",
      x1: "Before we left, someone checked the dials three times.", x2: "The platform was crowded with people in long coats and top hats.", x3: "One machine could fold paper into envelopes all by itself.", x4: "On the bridge, a man was selling eels from a bucket.",
      model5: "Before we jumped home, we stopped at a busy coffee house." } },
    football: { name: "Football", w: {
      trip: "an away day",
      stop1: "the coach park", stop2: "the service station", stop3: "the stadium", stop4: "the journey home", stop5: "the club shop", key5: "shop",
      a1: "We met at the coach park at seven in the morning.", b1: "It was freezing, and everyone already had their scarves on.", c1: "The coach was ten minutes late, which felt like an hour.",
      a2: "Halfway there, we stopped at a service station.", b2: "I bought a bacon roll and a bottle of water.", c2: "Somebody started a chant in the queue, and the cashier joined in.",
      a3: "At two o'clock, we finally reached the stadium.", b3: "The noise hit us before we even got through the turnstiles.", c3: "From our seats, the pitch looked impossibly green.",
      a4: "The journey home was quiet at first, because we had drawn 1 1.", b4: "Then someone replayed the late equaliser on their phone, and the whole coach cheered again.", c4: "I was asleep before we reached the motorway.",
      x1: "The driver counted us on twice, just to be sure.", x2: "The queue for the toilets stretched right past the shop.", x3: "The away end was packed into one corner, right behind the goal.", x4: "We pulled back into the coach park just before eleven.",
      model5: "After the match, we squeezed into the club shop." } },
    horror: { name: "Horror", w: {
      trip: "a night tour of the old hospital",
      stop1: "the front gate", stop2: "the long corridor", stop3: "the basement", stop4: "the way out", stop5: "the old chapel", key5: "chapel",
      a1: "We gathered at the front gate just before midnight.", b1: "The guide had a torch, a clipboard and a very serious face.", c1: "Somewhere behind the building, a gate creaked on its own.",
      a2: "Inside, the long corridor seemed to go on forever.", b2: "Every other light flickered, and our footsteps echoed back twice.", c2: "I kept glancing behind me, just in case.",
      a3: "Next, the guide led us down to the basement.", b3: "It was colder down there, and it smelled of damp and old paper.", c3: "A trolley stood in the middle of the room, and nobody would say who had moved it.",
      a4: "By half past one, we were back outside, laughing a bit too loudly.", b4: "The night air felt warm after the basement.", c4: "I did not look back at the windows. Well, only once.",
      x1: "A sign on the gate said the hospital had closed in 1974.", x2: "Every door we passed had a little round window.", x3: "The stairs down there had a handrail as cold as ice.", x4: "On the coach home, everyone checked their photos for ghosts.",
      model5: "Our last stop was the old chapel at the edge of the grounds." } },
    fishing: { name: "Fishing", w: {
      trip: "a day at the lake",
      stop1: "the bait shop", stop2: "the car park", stop3: "our peg", stop4: "the drive home", stop5: "the cafe by the lake", key5: "cafe",
      a1: "Our first stop was the bait shop at six in the morning.", b1: "It smelled of maggots and coffee.", c1: "The owner told us the carp had been feeding near the reeds.",
      a2: "We reached the lake car park just as the mist was lifting.", b2: "A heron flew low over the cars, as if it was showing us the way.", c2: "We carried the kit down the path in two trips.",
      a3: "By ten o'clock, we were set up at our peg.", b3: "For an hour, nothing happened at all.", c3: "Then my float dipped, slid sideways and vanished, and I nearly fell off my seat.",
      a4: "On the drive home, the car smelled of mud and bait.", b4: "I kept checking the photo of my carp on the scales: 9 kilograms.", c4: "Next time, I am going to beat it.",
      x1: "I bought a tub of sweetcorn as well, just in case.", x2: "Only two other cars were parked there that early.", x3: "We put every fish back carefully, with wet hands.", x4: "We stopped for chips on the way back.",
      model5: "At midday, we walked round to the cafe by the lake." } },
    music: { name: "Music", w: {
      trip: "a trip to see a musical",
      stop1: "the train", stop2: "the stage door", stop3: "the theatre", stop4: "the late train home", stop5: "the gift shop", key5: "shop",
      a1: "We caught the train into the city at four o'clock.", b1: "I read an old programme three times on the way.", c1: "My friend practised the big song under her breath.",
      a2: "Before the show, we waited at the stage door.", b2: "One of the dancers came out to sign programmes.", c2: "She said our banner was the best one she had seen all week.",
      a3: "Inside the theatre, the seats were red and the ceiling was gold.", b3: "When the lights went down, the whole room went silent.", c3: "The opening number was so loud I felt it in my chest.",
      a4: "The late train home was full of people humming the same songs.", b4: "I had glitter on my sleeve from the finale.", c4: "I am still not sure how it got there.",
      x1: "The carriage was quiet until we got near the city.", x2: "A small crowd had already gathered by the barrier.", x3: "In the interval, the queue for ice cream went right up the stairs.", x4: "We got back after midnight, still singing.",
      model5: "In the interval, we found the theatre gift shop." } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: ROUTE,
  steps: [

    /* ---------- chunk 1: one stop, one paragraph ---------- */
    { type: "learn", topic: "One stop, one paragraph",
      title: "New stop, new paragraph",
      fig: ROUTE,
      html: "<p>A <b>travelogue</b> is writing about a journey. This one is about [[trip]].</p>" +
        "<p>The simplest rule: <b>every time you arrive somewhere new, start a new paragraph</b>. The gap tells the reader \"we have moved on\", like a stop on a map.</p>" +
        "<p class=\"a2task\">" + P(1) + "</p><p class=\"a2task\">" + P(2) + "</p>" +
        "<p>Two stops, two paragraphs. You can see where one ends and the next begins before you read a word.</p>",
      lv: { spicy: { html: "<p>A <b>travelogue</b> is writing about a journey. This one is about [[trip]].</p>" +
        "<p>Each new stop gets a new paragraph. But stops are only the start. Good writers also break when the <b>focus</b> changes: time jumps on, someone new takes over the story, or the writer turns to a different side of the same place (the food, the people, how it felt).</p>" +
        "<p class=\"a2task\">" + P(1) + "</p><p class=\"a2task\">" + P(2) + "</p>" +
        "<p>Here the place changes, so the break is easy. Later on you will find quieter ones.</p>" } } },

    { type: "order", topic: "One stop, one paragraph",
      q: "Here are the four paragraphs of the travelogue, jumbled up. Put them in journey order.",
      items: [P(1), P(2), P(3), P(4)],
      hint: "Look at the first sentence of each one. Where are we, and what time is it?",
      why: "The first sentence of each paragraph says where we are: [[stop1]], [[stop2]], [[stop3]], then [[stop4]].",
      lv: { mild: { q: "Here are the four stops of the journey, jumbled up. Put them in order.",
        items: ["[[A1]]", "[[A2]]", "[[A3]]", "[[A4]]"],
        why: "[[Stop1]] first, then [[stop2]], [[stop3]] and finally [[stop4]]. Each one starts a new paragraph." } } },

    { type: "mc", topic: "One stop, one paragraph",
      q: "One sentence in this paragraph has wandered in from a different stop. Which one?<p class=\"a2task\">[[A2]] [[B2]] [[X4]] [[C2]]</p>",
      options: ["[[A2]]", "[[B2]]", "[[X4]]", "[[C2]]"],
      answer: 2, fixed: true,
      slips: { 0: "That is the topic sentence: it tells us we are at [[stop2]].", 1: "That one belongs: it describes [[stop2]].", 3: "That one belongs: it happens at [[stop2]]." },
      hint: "Which sentence happens somewhere else, or at a different time?",
      why: "That sentence belongs to [[stop4]], at the end of the trip. Each paragraph should stay at its own stop.",
      lv: { medium: { q: "One sentence in this paragraph has wandered in from a different stop. Which one?<p class=\"a2task\">[[A2]] [[B2]] [[X3]] [[C2]]</p>",
          options: ["[[A2]]", "[[B2]]", "[[X3]]", "[[C2]]"],
          why: "That sentence belongs at [[stop3]]. Keeping each stop's details together is what makes paragraphs work." },
        spicy: { q: "One sentence in this paragraph has wandered in from a different stop. Which one?<p class=\"a2task\">[[A2]] [[B2]] [[X3]] [[C2]]</p>",
          options: ["[[A2]]", "[[B2]]", "[[X3]]", "[[C2]]"],
          why: "That sentence belongs at [[stop3]]. A stray detail like that makes the reader think the journey has jumped about." } } },

    { type: "mc", topic: "One stop, one paragraph", explain: true,
      q: "The writer starts a new paragraph between these two sentences. Why?<p class=\"a2task\">...[[C2]]</p><p class=\"a2task\">[[A3]]...</p>",
      options: ["The place changes", "The second sentence is longer", "The writer ran out of room", "Paragraphs always have three sentences"],
      answer: 0,
      slips: { 1: "Sentence length is not a reason for a new paragraph. Look at where we are.", 2: "Paragraphs are not about space on the page. They show a change.", 3: "There is no fixed number. A paragraph lasts as long as the stop does." },
      hint: "Where are we in the first sentence? Where are we in the second?",
      why: "We move from [[stop2]] to [[stop3]]. A new place means a new paragraph.",
      lv: { spicy: { q: "The writer starts a new paragraph between these two sentences. What is the best explanation?<p class=\"a2task\">...[[C3]]</p><p class=\"a2task\">[[A4]]...</p>",
        options: ["Time moves on and the place changes", "To make the page look tidier", "A new person starts speaking", "The paragraph had hit a word limit"],
        slips: { 1: "Tidiness is a side effect. The reason is a change in the journey.", 2: "Nobody new speaks here. Look for a time or place change.", 3: "There is no word limit. Look at what has changed." },
        hint: "Look for words about time and words about place.",
        why: "Two changes at once: time moves on and we are somewhere new ([[stop4]]). That is a strong reason to break." } } },

    /* ---------- chunk 2: topic sentences ---------- */
    { type: "learn", topic: "Topic sentences",
      title: "The first sentence is a signpost",
      fig: TOPIC,
      html: "<p>The first sentence of a paragraph is the <b>topic sentence</b>. In a travelogue it usually tells the reader <b>where we are now</b>, and often when.</p>" +
        "<p class=\"a2task\"><b>[[A3]]</b> [[B3]] [[C3]]</p>" +
        "<p>The bold sentence moves the reader to the new stop. The others add the detail.</p>",
      lv: { spicy: { html: "<p>The first sentence of a paragraph is the <b>topic sentence</b>. It moves the reader to the new stop and sets up what the paragraph will focus on.</p>" +
        "<p class=\"a2task\"><b>[[A3]]</b> [[B3]] [[C3]]</p>" +
        "<p>A strong topic sentence does two jobs: it says where (and often when), and it hints at what comes next. \"Then we went somewhere else\" does neither.</p>" } } },

    { type: "mc", topic: "Topic sentences",
      q: "This paragraph has lost its first sentence. Which one makes the best topic sentence?<p class=\"a2task\">________ [[B4]] [[C4]]</p>",
      options: ["[[A4]]", "It was nice.", "And then we went somewhere else.", "[[X2]]"],
      answer: 0,
      slips: { 1: "\"It was nice\" could be about anywhere. The reader needs to know where we are.", 2: "That does not say where \"somewhere else\" is.", 3: "That belongs at [[stop2]], earlier in the trip." },
      hint: "Which one tells the reader where we are now?",
      why: "\"[[A4]]\" names the stop, so the reader knows exactly where the details belong.",
      lv: { spicy: { q: "This paragraph has lost its first sentence. Which one makes the best topic sentence?<p class=\"a2task\">________ [[B3]] [[C3]]</p>",
        options: ["[[A3]]", "[[X3]]", "We went to lots of places that day.", "It was the best bit of the whole trip."],
        slips: { 1: "That belongs in this paragraph, but it is a detail. It does not tell the reader we have moved.", 2: "Too general: which place?", 3: "That is an opinion, and it does not say where we are." },
        hint: "Which one moves the reader to the new place?",
        why: "\"[[A3]]\" says where (and when). The detail sentence belongs here too, just not first." } } },

    { type: "match", topic: "Topic sentences",
      q: "Match each topic sentence to the stop it starts.",
      pairs: [["[[A1]]", "Stop 1: [[stop1]]"], ["[[A2]]", "Stop 2: [[stop2]]"], ["[[A3]]", "Stop 3: [[stop3]]"], ["[[A4]]", "Stop 4: [[stop4]]"]],
      hint: "Each topic sentence names its place.",
      why: "Each topic sentence names its stop. That is why a reader can skim the first sentences and follow the whole route.",
      lv: { medium: { q: "These detail sentences have no place names in them. Match each one to the stop where it belongs.",
          pairs: [["[[X1]]", "Stop 1: [[stop1]]"], ["[[X2]]", "Stop 2: [[stop2]]"], ["[[X3]]", "Stop 3: [[stop3]]"], ["[[X4]]", "Stop 4: [[stop4]]"]],
          hint: "Picture each stop. Where would this happen?",
          why: "Details only make sense in the right paragraph. That is why each stop keeps its own." },
        spicy: { q: "These detail sentences have no place names in them. Match each one to the stop where it belongs.",
          pairs: [["[[X1]]", "Stop 1: [[stop1]]"], ["[[X2]]", "Stop 2: [[stop2]]"], ["[[X3]]", "Stop 3: [[stop3]]"], ["[[X4]]", "Stop 4: [[stop4]]"]],
          hint: "Picture each stop. Where would this happen?",
          why: "Details only make sense in the right paragraph. Put one at a different stop and the reader thinks the journey has jumped." } } },

    { type: "text", topic: "Topic sentences",
      q: "The journey gets one more stop. <b>The next stop is [[stop5]].</b> Write a topic sentence to start that paragraph. Say where you are, and when if you like.",
      need: [["[[Key5]]"], ["we", "i", "our", "my", "us"]],
      model: "[[Model5]]",
      slips: [[["it was nice", "it was good", "then we went", "somewhere"], "That could be anywhere. Name the place so the reader knows where we are."]],
      hint: "Try: \"Next, we...\" or \"After that, I...\" and name the place.",
      why: "A good topic sentence names the new place. For example: \"[[Model5]]\"" },

    /* ---------- chunk 3: split the block ---------- */
    { type: "learn", topic: "Split the block",
      title: "Find the turning points",
      fig: SPLIT,
      html: "<p>Sometimes writing comes out as one long block. To split it, hunt for the <b>turning points</b>:</p>" +
        "<p><b>New place:</b> we reached, we arrived at, inside, next. <b>Time moves on:</b> by lunchtime, later, at two o'clock, on the way home.</p>" +
        "<p class=\"a2task\">[[A2]] [[B2]] [[C2]] <b>[[A3]]</b> [[B3]] [[C3]]</p>" +
        "<p>The bold sentence is a turning point. That is where the new paragraph goes.</p>" },

    { type: "mc", topic: "Split the block",
      q: "This part was written as one block. Where should the new paragraph start?<p class=\"a2task\">[[A1]] [[B1]] [[A2]] [[B2]]</p>",
      options: ["[[B1]]", "[[A2]]", "[[B2]]"],
      answer: 1, fixed: true,
      slips: { 0: "That is still at [[stop1]]. It adds detail.", 2: "That is a detail about [[stop2]]. The break comes one sentence earlier." },
      hint: "Find the sentence where we arrive somewhere new.",
      why: "\"[[A2]]\" moves us to [[stop2]]. That is the turning point.",
      lv: {
        medium: { q: "This part was written as one block. Where should the new paragraph start?<p class=\"a2task\">[[A3]] [[B3]] [[C3]] [[A4]] [[B4]] [[C4]]</p>",
          options: ["[[B3]]", "[[C3]]", "[[A4]]", "[[B4]]"],
          answer: 2,
          slips: { 0: "Still at [[stop3]]: it is a detail.", 1: "Still at [[stop3]]: it finishes that stop.", 3: "That is a detail about [[stop4]]. The break comes one sentence earlier." },
          why: "\"[[A4]]\" moves us on in time and place. That is where [[stop4]] begins." },
        spicy: { q: "This part was written as one block, and the stop sentences have lost their place names. Where should the new paragraph start?<p class=\"a2task\">[[B2]] [[X2]] [[C2]] [[B3]] [[X3]] [[C3]]</p>",
          options: ["[[X2]]", "[[C2]]", "[[B3]]", "[[X3]]"],
          answer: 2,
          slips: { 0: "Still at [[stop2]].", 1: "Still at [[stop2]]: it finishes that stop.", 3: "That is already at [[stop3]]. The break comes one sentence earlier." },
          hint: "No place names to help. Picture each sentence: which one has moved on?",
          why: "\"[[B3]]\" is the first sentence set at [[stop3]]. Without a topic sentence the break is harder to spot, which is exactly why topic sentences help." } } },

    { type: "sort", topic: "Split the block",
      q: "Sort these sentences into the right paragraph.",
      buckets: ["[[Stop1]]", "[[Stop2]]"],
      cards: [["[[A1]]", 0], ["[[X1]]", 0], ["[[A2]]", 1], ["[[X2]]", 1]],
      hint: "Picture where each one happens.",
      why: "Each paragraph keeps its own stop's details together.",
      lv: {
        medium: { buckets: ["[[Stop2]]", "[[Stop3]]"],
          cards: [["[[B2]]", 0], ["[[X2]]", 0], ["[[C2]]", 0], ["[[B3]]", 1], ["[[X3]]", 1], ["[[C3]]", 1]] },
        spicy: { buckets: ["[[Stop2]]", "[[Stop3]]", "[[Stop4]]"],
          cards: [["[[B2]]", 0], ["[[X2]]", 0], ["[[B3]]", 1], ["[[X3]]", 1], ["[[A4]]", 2], ["[[X4]]", 2]] } } },

    { type: "mc", topic: "Split the block",
      q: "Which of these is a signal that a new paragraph might be coming?",
      options: ["Later that afternoon,", "and", "because", "very"],
      answer: 0,
      slips: { 1: "\"And\" joins things inside a sentence. It does not move the journey on.", 2: "\"Because\" explains. It stays in the same moment.", 3: "\"Very\" just makes a word stronger." },
      hint: "Which one moves time on?",
      why: "\"Later that afternoon\" jumps time forward, which is a classic paragraph turning point.",
      lv: {
        medium: { options: ["When we finally reached the top,", "which was", "so that", "but"],
          slips: { 1: "\"Which was\" adds detail to the same thing.", 2: "\"So that\" explains a reason.", 3: "\"But\" adds a contrast inside the same moment." },
          hint: "Which one tells you we have arrived somewhere?",
          why: "\"When we finally reached the top\" arrives at a new place, so a new paragraph fits." },
        spicy: { q: "Which sentence opener signals a change of <b>focus</b>, even though the place stays the same?",
          options: ["Looking back now, the best part was not the place at all.", "Next, we walked to the car park.", "After that, we got back on the bus.", "Then we arrived at the hotel."],
          slips: { 1: "That is a change of place, not just focus.", 2: "That moves us on in place and time.", 3: "That is a new place." },
          hint: "Three of them move the journey. One stays put and turns to think.",
          why: "\"Looking back now...\" stays in the same place but turns from describing to reflecting. That shift in focus deserves its own paragraph." } } },

    /* ---------- chunk 4: make each paragraph count ---------- */
    { type: "learn", topic: "Make each paragraph count",
      title: "Build a paragraph",
      fig: BUILD,
      html: "<p>A good travelogue paragraph has three parts:</p>" +
        "<p><b>Topic sentence:</b> where are we? <b>Details:</b> what did you see, hear or smell? <b>Feeling:</b> what was it like for you?</p>" +
        "<p class=\"a2task\">[[A4]] [[B4]] [[C4]]</p>" +
        "<p>One sentence on its own is a signpost with nothing behind it. A paragraph that never stops hides all the stops. Aim for one stop, told properly.</p>",
      lv: { spicy: { fig: BUILD2,
        html: "<p>At this level, a paragraph is not just \"where we went\". It <b>develops</b> one focus.</p>" +
          "<p><b>Topic sentence:</b> where, and what this paragraph is about. <b>Develop:</b> details that build the picture, then something surprising or a contrast. <b>Reflect:</b> what it meant, or how it changed your view.</p>" +
          "<p class=\"a2task\">[[A3]] [[B3]] [[C3]]</p>" +
          "<p>Ask of every sentence: does this develop the focus, or is it padding? \"It was really good\" is padding. A precise detail is development.</p>" } } },

    { type: "order", topic: "Make each paragraph count",
      q: "Put these sentences in order to build the paragraph.",
      items: ["[[A4]]", "[[B4]]", "[[C4]]"],
      hint: "Topic sentence first. The feeling or ending last.",
      why: "Where we are, then the detail, then how it ended. Readers expect that shape." },

    { type: "mc", topic: "Make each paragraph count", explain: true,
      q: "Three writers wrote about [[stop3]]. Which paragraph does the best job?",
      options: ["[[A3]] [[B3]] [[C3]]", "[[A3]]", "We went to [[stop3]]. It was good. Then we went to [[stop4]]. It was good too."],
      answer: 0,
      slips: { 1: "One sentence tells us where, but nothing about what it was like.", 2: "That squashes two stops into one paragraph and says \"good\" twice without saying why." },
      hint: "Which one has a topic sentence and details, and stays at one stop?",
      why: "It starts with where we are, adds real details, and stays at [[stop3]]. The others are too thin or cram two stops together.",
      lv: { spicy: { q: "This paragraph is about [[stop3]]. Which extra sentence would develop it best?<p class=\"a2task\">[[A3]] [[B3]] [[C3]]</p>",
        options: ["[[X3]]", "It was really, really good.", "[[X4]]", "There were lots of things there."],
        slips: { 1: "That is padding: it tells us nothing new.", 2: "That belongs to [[stop4]]. It would break the focus.", 3: "Too vague. Which things?" },
        hint: "Which one adds a precise detail about this stop?",
        why: "It adds a precise detail that belongs at [[stop3]]. The others are padding or belong elsewhere." } } },

    { type: "write", topic: "Make each paragraph count",
      q: "Your turn, if you fancy it. Write one paragraph about one stop on a journey: a real trip, or a stop on [[trip]]. Start with where you are, add some details, and end with how it felt.",
      fig: BUILD,
      starters: ["Our first stop was", "By lunchtime, we had reached", "When we arrived at", "Next, we"],
      checklist: ["Starts with where you are", "At least two details (see, hear, smell)", "Ends with how it felt", "Stays at one stop"],
      minWords: 35,
      lv: {
        mild: { minWords: 20, checklist: ["Starts with where you are", "One or two details", "How it felt"] },
        spicy: { q: "Your turn, if you fancy it. Write two paragraphs about two stops on a journey (real, or [[trip]]). Give each a clear topic sentence, and give the second one a different focus: the people, the food, or a moment that surprised you.",
          fig: BUILD2,
          checklist: ["Two paragraphs, each with a topic sentence", "Each one develops a single focus", "The break comes at a real turning point", "At least one reflection: what it meant"],
          minWords: 70 } } }
  ],

  realWorld: {
    title: "Where you would use this",
    html: "<p>Travel writers, bloggers and reviewers all paragraph by stop, because readers skim. A trip report for school, a review of a day out, even a long message about your holiday: one stop, one paragraph.</p>" +
      "<p>For our big question: if you could time travel, your travelogue would become a <b>source</b>. A historian in the future might read your paragraph about [[stop3]] to find out what it was really like. Would you want them to be able to follow your route?</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A time traveller writing up the journey">' +
      A.portal(70, 76, 54) +
      '<rect x="150" y="28" width="150" height="100" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' + lines(164, 42, 122, 3) + lines(164, 84, 122, 3, "#ffd23f") +
      A.jay(360, 50, 0.68, "smile") + '</svg>'
  },

  make: {
    title: "Write a postcard",
    intro: "One stop, one paragraph, on a postcard. Real trip or time travel, your choice. Save it, stick it up, or send it to Jay.",
    fields: [
      { id: "place", label: "Where you are", ph: "The Great Exhibition, 1851", max: 34 },
      { id: "para", label: "Your paragraph", ph: "By lunchtime we had reached the glass hall. Birds were flying around inside it! I could not name half the machines.", max: 220 },
      { id: "from", label: "From", ph: "A time traveller", max: 24 }
    ],
    svg: function(v){
      function e(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ while(x.length > n){ if(cur.trim()){ out.push(cur.trim()); cur = ""; } out.push(x.slice(0, n)); x = x.slice(n); } if((cur + " " + x).trim().length > n){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max); }
      var place = wrap(v.place, 22, 2), para = wrap(v.para, 30, 9);
      var fs = para.length > 7 ? 15 : 17, lh = para.length > 7 ? 24 : 28;
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="18" fill="#fffaf0"/>' +
        '<rect x="12" y="12" width="576" height="376" rx="14" fill="none" stroke="#e04848" stroke-width="6" stroke-dasharray="22 12"/>' +
        '<path d="M370 40V360" stroke="#c9c2b2" stroke-width="2"/>' +
        place.map(function(l, k){ return '<text x="36" y="' + (60 + k * 28) + '" font-family="Verdana,Arial,sans-serif" font-size="22" font-weight="700" fill="#141a33">' + e(l) + '</text>'; }).join("") +
        para.map(function(l, k){ return '<text x="36" y="' + (126 + k * lh) + '" font-family="Verdana,Arial,sans-serif" font-size="' + fs + '" fill="#141a33">' + e(l) + '</text>'; }).join("") +
        '<rect x="474" y="34" width="86" height="100" rx="4" fill="#ffffff" stroke="#141a33" stroke-width="2" stroke-dasharray="4 3"/>' +
        A.portal(517, 84, 34) +
        '<path d="M392 200h170M392 240h170M392 280h170" stroke="#c9c2b2" stroke-width="2"/>' +
        '<text x="392" y="194" font-family="Verdana,Arial,sans-serif" font-size="16" fill="#141a33">To: Jay</text>' +
        '<text x="392" y="234" font-family="Verdana,Arial,sans-serif" font-size="16" fill="#141a33">Base 5</text>' +
        wrap("From: " + (v.from || ""), 18, 2).map(function(l, k){ return '<text x="392" y="' + (320 + k * 20) + '" font-family="Verdana,Arial,sans-serif" font-size="14" fill="#5b6180">' + e(l) + '</text>'; }).join("") +
        A.bird(540, 360, 0.7, "#3a8fd6") +
        '</svg>';
    }
  }
};
})();
