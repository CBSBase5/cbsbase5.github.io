/* Base 5 core target activity: Get the gist.
   English. Reading short texts for what they are mostly about, the
   main points, and what they hint without saying. Replayable: most
   questions have two extra versions for the next goes. ASCII only. */
(function(){
var A = window.A2ART;
var FONT = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }
function P(t){ return '<p class="a2task">' + t + '</p>'; }

/* the whole text, squeezed into a one breath version */
var GIST = '<svg viewBox="0 0 520 210" role="img" aria-label="A whole page of text, squeezed down to the gist: what you would tell a mate in one breath">' +
  '<rect width="520" height="210" rx="16" fill="#f4f1ea"/>' +
  '<rect x="30" y="22" width="150" height="150" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
  [0, 1, 2, 3, 4, 5, 6, 7].map(function(k){ return '<rect x="46" y="' + (40 + k * 16) + '" width="' + (k % 3 === 2 ? 86 : 118) + '" height="6" rx="3" fill="' + (k === 1 ? "#ffd23f" : "#c9cbd6") + '"/>'; }).join("") +
  T(105, 194, "The whole text", 14, { a: "middle", b: 1 }) +
  '<path d="M196 98h96" stroke="#141a33" stroke-width="4" stroke-linecap="round"/><path d="M288 86l16 12 -16 12z" fill="#141a33"/>' +
  T(248, 84, "squeeze it", 13, { a: "middle" }) +
  '<rect x="318" y="52" width="176" height="92" rx="18" fill="#19c39a" fill-opacity=".3" stroke="#141a33" stroke-width="2.5"/>' +
  T(406, 90, "The gist", 20, { a: "middle", b: 1 }) + T(406, 116, "in one breath", 14, { a: "middle" }) +
  T(406, 194, "What you would tell a mate", 14, { a: "middle", b: 1 }) +
  A.egg(A.bird(492, 30, 0.7, "#3a8fd6"), "A bird reading over your shoulder. The gist, as far as the bird is concerned: no seeds in this text.") +
  '</svg>';

/* two paragraphs, each giving one main point */
var POINTS = '<svg viewBox="0 0 520 220" role="img" aria-label="Two paragraphs. Each one gives a main point. Put the points together and you have the gist of the whole text">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  [0, 1].map(function(k){
    var y = 22 + k * 92;
    return '<rect x="24" y="' + y + '" width="230" height="78" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
      '<rect x="38" y="' + (y + 14) + '" width="190" height="8" rx="4" fill="' + (k ? "#ff8a5c" : "#22b8e6") + '"/>' +
      [1, 2, 3].map(function(j){ return '<rect x="38" y="' + (y + 14 + j * 16) + '" width="' + (j === 3 ? 120 : 196) + '" height="6" rx="3" fill="#c9cbd6"/>'; }).join("") +
      '<path d="M262 ' + (y + 39) + 'h44" stroke="#141a33" stroke-width="3"/><path d="M302 ' + (y + 31) + 'l12 8 -12 8z" fill="#141a33"/>' +
      '<rect x="320" y="' + (y + 18) + '" width="110" height="42" rx="12" fill="' + (k ? "#ff8a5c" : "#22b8e6") + '" fill-opacity=".35" stroke="#141a33" stroke-width="2"/>' +
      T(375, y + 45, "Point " + (k + 1), 16, { a: "middle", b: 1 });
  }).join("") +
  '<path d="M440 40q24 0 24 30v26q0 10 10 10q-10 0 -10 10v26q0 30 -24 30" fill="none" stroke="#141a33" stroke-width="3"/>' +
  T(492, 110, "gist", 16, { a: "middle", b: 1 }) +
  '</svg>';

/* the iceberg: what it says, and the bigger part it hints */
var ICE = '<svg viewBox="0 0 520 240" role="img" aria-label="An iceberg. The small tip above the water is what the text says. The big part under the water is what it hints">' +
  '<rect width="520" height="240" rx="16" fill="#dff3fb"/>' +
  '<rect y="92" width="520" height="148" rx="0" fill="#3a8fd6" fill-opacity=".45"/>' +
  '<path d="M0 92q30 -8 60 0t60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0" fill="none" stroke="#1d5f99" stroke-width="3"/>' +
  '<path d="M206 92l34 -56 22 18 30 -14 26 52z" fill="#ffffff" stroke="#141a33" stroke-width="2.5" stroke-linejoin="round"/>' +
  '<path d="M206 92l-40 58 30 60 90 16 70 -40 4 -60 -42 -34z" fill="#e8f7ff" stroke="#141a33" stroke-width="2.5" stroke-linejoin="round"/>' +
  T(30, 40, "What it SAYS", 17, { b: 1 }) + T(30, 62, "the words you can see", 13) +
  '<path d="M170 46q30 0 56 14" fill="none" stroke="#141a33" stroke-width="2"/>' +
  T(30, 152, "What it HINTS", 17, { b: 1, c: "#ffffff" }) + T(30, 174, "the bigger part,", 13, { c: "#ffffff" }) + T(30, 192, "under the surface", 13, { c: "#ffffff" }) +
  T(388, 150, "Clue in the words", 12, { b: 1, c: "#ffffff" }) + T(388, 170, "+ what you know", 12, { b: 1, c: "#ffffff" }) + T(388, 190, "= the hint", 12, { b: 1, c: "#ffffff" }) +
  A.bird(254, 30, 0.6, "#ff5d5d") +
  '</svg>';

/* postcards for the last chunk: three of them, one per go */
function card(lines, egg){
  return '<svg viewBox="0 0 520 270" role="img" aria-label="A postcard: ' + esc(lines.join(" ")) + '">' +
    '<rect x="6" y="6" width="508" height="258" rx="12" fill="#fffaf0" stroke="#141a33" stroke-width="2.5"/>' +
    '<path d="M352 30v210" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
    lines.map(function(l, k){ return T(24, 40 + k * 23, esc(l), 15); }).join("") +
    '<rect x="430" y="24" width="62" height="74" rx="4" fill="#ffffff" stroke="#141a33" stroke-width="2" stroke-dasharray="4 3"/>' +
    (egg ? A.egg(A.bird(461, 62, 0.8, "#19c39a"), "A bird stamp. Jay would keep the postcard just for this.") : A.bird(461, 62, 0.8, "#19c39a")) +
    '<path d="M372 150h124M372 180h124M372 210h124" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
    '</svg>';
}
function pc(t, egg){ return card(wrap(t, 37, 10), egg); }
var NAN = {
  mild: "Hi! I am at the seaside. It rains every day. But the hotel is nice. Love, Nan",
  medium: "Hello love! The hotel is lovely and the sea is right outside. It has rained every single day, so I have read four books. Grandad has found a cafe with the best chips ever, so he is happy. See you Sunday. Love, Nan",
  spicy: "Greetings from sunny (ha!) Seabrook. Day six of rain. I have now read every book in the hotel, twice. The staff are lovely and the food is wonderful, so I am not complaining much. Grandad has found the best chip shop in England. Home Sunday. Nan"
};
var RORY = {
  mild: "We went to the theme park. The queues were long. The big ride was the best! From Rory",
  medium: "We got to the theme park at 9am. The queues were massive, so we only went on three rides all day. My feet are killing me and Mum says never again! But the big coaster was amazing. From Rory",
  spicy: "Theme park report: in at 9, out at 6, and a grand total of three rides. Three! We spent more time in queues than on anything with wheels. Mum has said \"never again\" twice, and Dad has gone very quiet. Still, the big coaster was worth every minute. Rory"
};
var DEV = {
  mild: "I am camping. A goat ate my lunch! But the stars are great. From Uncle Dev",
  medium: "The tent leaked on the first night. Then a goat ate my sandwich! Still, the stars are amazing and the lake is so clear you can see the fish. I am staying one more night. Uncle Dev",
  spicy: "Camping update: night one, the tent became a paddling pool. Day two, a goat stole my lunch and showed no remorse. And yet I have just booked another night. You cannot see stars like these in the city, and the lake is clear as glass. Uncle Dev"
};

(window.A2PACKS = window.A2PACKS || {})["core-get-the-gist"] = {
  a2: true,
  id: "a2-core-get-the-gist",
  title: "Get the gist",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "What a short text is mostly about, its main points, and what it hints without saying.",
  blurb: "Short texts, read for the gist: what they are mostly about, the main points, and the hints hiding under the surface. Four short chunks, with a gist card to make at the end. New texts each time you come back.",
  note: "Get the gist: short texts, read for what they are mostly about and what they hint. Four five minute chunks and a card to make. Different texts every time you come back, so have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Sneak peek", line: "Sneak peek: very short texts, and the one big thing they say." },
    { id: "medium", name: "Good read", line: "Good read: short paragraphs, the main points, and a few hints to spot." },
    { id: "spicy", name: "Mind reader", line: "Mind reader: livelier texts, jokes and hints the writer never says out loud." }
  ],
  themes: {
    time: { name: "Time travel", w: { who: "Zed the time traveller", place: "the time museum", event: "the trip to 1066", thing: "time pod key", crew: "the time crew" } },
    football: { name: "Football", w: { who: "the new striker", place: "the stadium", event: "the cup final", thing: "match ball", crew: "the squad" } },
    horror: { name: "Horror", w: { who: "the night guard", place: "the old hotel", event: "the midnight tour", thing: "torch", crew: "the ghost hunters" } },
    fishing: { name: "Fishing", w: { who: "the angler", place: "the lake", event: "the fishing match", thing: "best rod", crew: "the fishing club" } },
    music: { name: "Music", w: { who: "the drummer", place: "the concert hall", event: "the big gig", thing: "microphone", crew: "the band" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: GIST,
  steps: [

    /* ---------- chunk 1: what is it mostly about? ---------- */
    { type: "learn", topic: "Mostly about", title: "The gist is the one breath version",
      fig: GIST,
      html: "<p>The <b>gist</b> is what a text is <b>mostly</b> about.</p>" +
        "<p>Imagine a mate asks, \"What did it say?\" You would not read the whole thing out. You would tell them the main thing, in one breath. That is the gist.</p>" +
        "<p>The other bits are <b>details</b>: times, reasons, little extras. Useful, but not the main thing.</p>",
      lv: {
        mild: { html: "<p>The <b>gist</b> is what a text is <b>mostly</b> about.</p><p>If a mate asked \"What did it say?\", the gist is what you would tell them, in one breath.</p>" },
        spicy: { html: "<p>The <b>gist</b> is what a text is <b>mostly</b> about: the one breath version you would give a mate.</p>" +
          "<p>Livelier texts make it harder, because jokes, reasons and colourful details get in the way. Try this: cover the text and ask, <b>what has changed, or what does the writer want me to know?</b></p>" +
          "<p>Watch out for answers that are true but too small (a detail), or that go further than the text does.</p>" } } },

    { type: "mc", topic: "Mostly about", explain: true,
      q: P("[[Event]] has been moved. It was going to be this Saturday, but a big storm is on the way. It will now happen next Saturday instead. Tickets still work, and the start time is the same.") + "What is the gist?",
      options: ["[[Event]] has moved to next Saturday because of a storm.", "A big storm is on the way.", "The start time is the same.", "[[Event]] has been cancelled for good."],
      answer: 0,
      slips: { 1: "That is the reason it moved, not the main thing. What would a mate need to know?", 2: "A small detail near the end.", 3: "Have another look: it has moved, not been cancelled." },
      hint: "What has happened to [[event]]?",
      why: "The gist: [[event]] has moved to next Saturday. The storm, the tickets and the time are details.",
      lv: {
        mild: { q: P("[[Event]] is not on this Saturday now. A storm is coming. It is on next Saturday.") + "What is it mostly about?",
          options: ["[[Event]] is on next Saturday now.", "A storm is coming.", "[[Event]] is on this Saturday."],
          slips: { 1: "The storm is why it moved. The main thing is the new day.", 2: "Have another look. It is not on this Saturday now." },
          why: "It is mostly about the new day: next Saturday." },
        spicy: { q: P("Anyone hoping to enjoy [[event]] this weekend will need a little more patience. Forecasters are warning of 70 mile an hour winds, and the organisers say nobody's safety is worth the risk. Every ticket will be valid next Saturday, and anyone who cannot make the new date can ask for a refund.") + "Which is the best gist?",
          options: ["[[Event]] is put back a week for safety, and tickets still count.", "Winds of 70 miles an hour are forecast.", "Refunds are there for anyone who asks.", "[[Event]] is cancelled because nobody bought tickets."],
          slips: { 1: "A detail. It explains why, but it is not the whole point.", 2: "Only for people who cannot make the new date. A detail.", 3: "Nothing says tickets did not sell. Stick to what the text gives you." },
          why: "One breath: put back a week, for safety, tickets still count." } },
      vary: [
        { q: P("Bonnie has a new bed. Her old one was chewed to bits, so Jay bought a bigger one with a soft blue cushion. She sniffed it for ages, then curled up and fell asleep.") + "What is the gist?",
          options: ["Bonnie has a new bed, and she seems to like it.", "The cushion is blue.", "Bonnie chewed her old bed.", "Jay has bought himself a new bed."],
          answer: 0,
          slips: { 1: "A small detail about the bed.", 2: "That is why she needed a new one. The main thing is the new bed.", 3: "Have another look: whose bed is it?" },
          hint: "Who is it about, and what is new?",
          why: "Mostly about Bonnie's new bed. Falling asleep on it hints that she likes it.",
          lv: {
            mild: { q: P("Bonnie has a new bed. It is blue. She likes it.") + "What is it mostly about?",
              options: ["Bonnie's new bed", "The colour blue", "Jay's new bed"],
              slips: { 1: "Blue is a small detail.", 2: "Have another look: whose bed is it?" },
              why: "It is mostly about Bonnie's new bed." },
            spicy: { q: P("After three years of loyal service, and one very determined chewing session, Bonnie's old bed has been retired. The new one is twice the size, with a cushion so thick it barely fits through the door. She circled it suspiciously for ten minutes. She has not left it since.") + "Which is the best gist?",
              options: ["Bonnie's chewed bed has been replaced, and she loves the new one.", "The new cushion barely fits through the door.", "Bonnie does not trust her new bed.", "The old bed lasted three years."],
              slips: { 1: "A funny detail, not the main point.", 2: "Only at first. The last line tells you how it ended.", 3: "A detail about the old bed." },
              why: "Old bed out, new bed in, and \"has not left it since\" tells you she loves it." } } },
        { q: P("The cafe at [[place]] is shut for two weeks. It is getting a new kitchen. Until it opens again, there is a snack van by the front gate.") + "What is the gist?",
          options: ["The cafe at [[place]] is shut for two weeks, but there is a snack van.", "The cafe is getting a new kitchen.", "The snack van is by the front gate.", "The cafe at [[place]] has shut forever."],
          answer: 0,
          slips: { 1: "That is why it is shut. The main thing is what is happening.", 2: "A detail: where the van is.", 3: "It says two weeks, not forever." },
          hint: "What has changed, and for how long?",
          why: "Cafe shut for two weeks, snack van instead. The kitchen and the gate are details.",
          lv: {
            mild: { q: P("The cafe at [[place]] is shut this week. Go to the snack van.") + "What is it mostly about?",
              options: ["The cafe is shut, so use the snack van.", "The snack van is new.", "The cafe is open."],
              slips: { 1: "It does not say the van is new.", 2: "Have another look: it is shut this week." },
              why: "Mostly about the cafe being shut, and where to go instead." },
            spicy: { q: P("Regulars at [[place]] will have to find their bacon rolls somewhere else for a fortnight. The cafe closes on Monday while a new kitchen goes in, which the manager promises will mean \"faster food and fewer burnt toasties\". A snack van will sit by the front gate in the meantime.") + "Which is the best gist?",
              options: ["The cafe shuts for two weeks for a new kitchen, with a van in the meantime.", "The cafe burns a lot of toasties.", "The snack van will sell bacon rolls.", "The manager of the cafe is leaving."],
              slips: { 1: "A joke from the manager, not the main point.", 2: "The text never says what the van sells.", 3: "Nothing says the manager is leaving." },
              why: "Two weeks shut, new kitchen, van by the gate. The toasties are a joke on the side." } } }
      ] },

    { type: "mc", topic: "Mostly about",
      q: P("Hi all. Bird club starts this Wednesday at lunch, in Base 5. You do not need to know anything about birds. I will bring binoculars and biscuits. Jay") + "A mate missed this message. What would you tell them?",
      options: ["There is a bird club on Wednesday lunchtimes in Base 5, and anyone can go.", "Jay is bringing biscuits.", "You need to know about birds to go.", "Jay has some binoculars."],
      answer: 0,
      slips: { 1: "True, but small. Would your mate know when and where to go?", 2: "Have another look: you do not need to know anything.", 3: "A detail. Your mate still would not know when or where." },
      hint: "What, when and where.",
      why: "What, when and where: bird club, Wednesday lunch, Base 5. That is the gist.",
      lv: {
        mild: { q: P("Bird club is on Wednesday at lunch. Come to Base 5! Jay") + "A mate missed this. What would you tell them?",
          options: ["Bird club is on Wednesday lunch, in Base 5.", "Jay likes Base 5.", "Bird club is on Friday."],
          slips: { 1: "It does not say that. What is happening?", 2: "Have another look at the day." },
          why: "Bird club, Wednesday lunch, Base 5." },
        spicy: { q: P("Calling all beginners, experts and the mildly curious: Bird Club is back. Wednesdays, 12:30, Base 5. No experience needed and no tests, I promise. Binoculars provided. Biscuits provided too, but only while they last, so do not be late. Jay") + "A mate missed this. What is the best one breath version?",
          options: ["Bird Club is back on Wednesday lunchtimes in Base 5, and anyone can go.", "The biscuits run out, so be on time.", "Bird Club is only for people who know about birds.", "There will be a bird test at Bird Club."],
          slips: { 1: "A fun detail at the end, not the main message.", 2: "\"Beginners\" and \"no experience needed\" say the opposite.", 3: "Jay promises there are no tests." },
          why: "Back, Wednesdays, Base 5, open to anyone. The biscuit warning is a joke on the side." } } },

    { type: "sort", topic: "Mostly about",
      q: P("[[Crew]] are raising money for a guide dog charity. They are doing a sponsored walk on Sunday. It is ten miles long. Bonnie is coming too, on a short lead.") + "Sort them: the gist, or a small detail?",
      buckets: ["The gist", "A small detail"],
      cards: [["[[Crew]] are raising money for a guide dog charity.", 0], ["The walk is on Sunday.", 1], ["It is ten miles long.", 1], ["Bonnie is coming too.", 1]],
      slips: { any: "Only one card is the gist. The rest are times, lengths and extras." },
      hint: "Which one could you say in one breath and your mate would get it?",
      why: "The gist is the charity walk. Sunday, ten miles and Bonnie are details.",
      lv: {
        mild: { cards: [["[[Crew]] are raising money for a guide dog charity.", 0], ["The walk is on Sunday.", 1], ["Bonnie is coming too.", 1]] },
        spicy: { q: P("[[Crew]] are raising money for a guide dog charity. They are doing a sponsored walk on Sunday. It is ten miles long. Bonnie is coming too, on a short lead.") + "Sort them: the gist, a detail, or something the text never says?",
          buckets: ["The gist", "A detail", "Not in the text"],
          cards: [["[[Crew]] are raising money for a guide dog charity.", 0], ["The walk is on Sunday.", 1], ["It is ten miles long.", 1], ["Bonnie will walk all ten miles.", 2], ["Guide dogs cost a lot to train.", 2]],
          slips: { any: "Careful with the last two. They sound sensible, but does the text actually say them?" },
          why: "The charity walk is the gist. The text says Bonnie is coming, not that she walks all ten miles, and it never mentions the cost of training." } } },

    { type: "text", topic: "Mostly about",
      q: P("On Monday, [[who]] lost the [[thing]]. Everyone looked for it all week. On Friday, Bonnie found it under the sofa, a bit chewed.") + "In your own words, what is the gist? A few words is plenty.",
      need: [["found", "find", "finds", "turned up", "back", "got it"]],
      model: "Bonnie found the lost [[thing]].",
      slips: [[["lost", "looked"], "That is how it starts. What happened in the end?"]],
      hint: "How does it end?",
      why: "Something like \"Bonnie found the lost [[thing]]\" sums it up. Monday, the sofa and the chewing are details.",
      lv: { spicy: { q: P("On Monday, [[who]] lost the [[thing]]. Everyone searched for days. Posters went up. Someone even blamed a ghost. On Friday, Bonnie trotted out from under the sofa with it in her mouth, looking very pleased with herself.") + "In your own words, what is the gist? One sentence is plenty." } } },

    /* ---------- chunk 2: main points ---------- */
    { type: "learn", topic: "Main points", title: "Some texts have two main points",
      fig: POINTS,
      html: "<p>A longer text can have <b>two or three main points</b>. Often each paragraph gives one.</p>" +
        "<p>Find the main point of each paragraph, put them together, and you have the gist of the whole thing.</p>",
      lv: {
        mild: { html: "<p>Some texts tell you <b>two</b> big things.</p><p>Look for both. Put them together and you have the gist.</p>" },
        spicy: { html: "<p>A longer text can have <b>two or three main points</b>, often one per paragraph. The first sentence of a paragraph is a good place to look, but not always.</p>" +
          "<p>Watch for words like <b>but</b>, <b>however</b> and <b>on the other hand</b>: they often mean a new main point is on the way.</p>" } } },

    { type: "multi", topic: "Main points",
      q: P("[[Crew]] had a brilliant week. On Tuesday they won an award for all their hard work.") + P("But there is some bad news too. Their minibus has broken down, so they will have to walk to [[place]] for a while.") + "Pick the <b>two</b> main points.",
      options: ["[[Crew]] won an award.", "Their minibus has broken down.", "The award was on a Tuesday.", "Minibuses are expensive to fix."],
      answers: [0, 1],
      slips: { any: "One main point in each paragraph. The others are a detail, and something the text never says." },
      hint: "One from each paragraph.",
      why: "Paragraph one: they won an award. Paragraph two: the minibus broke down. Tuesday is a detail.",
      lv: {
        mild: { q: P("[[Crew]] won a prize! But their minibus is broken. They will walk for now.") + "Pick the <b>two</b> big things it tells you.",
          options: ["[[Crew]] won a prize.", "Their minibus is broken.", "Minibuses are blue."], answers: [0, 1],
          slips: { any: "Two big things: some good news and some bad news." },
          why: "A prize, and a broken minibus." },
        spicy: { q: P("It has been a week of highs for [[crew]]. On Tuesday, their years of effort were finally recognised with a regional award, and the local paper called them \"the best in the county\".") +
            P("However, the celebrations did not last. On Thursday their ancient minibus gave up for good, and with no money left to replace it, they face a long walk to [[place]] until further notice.") + "Pick the <b>two</b> main points.",
          options: ["[[Crew]] won a regional award.", "Their minibus has broken down for good and cannot be replaced yet.", "The local paper called them the best in the county.", "The award came with prize money.", "They will stop going to [[place]]."],
          answers: [0, 1],
          slips: { any: "One main point per paragraph. Watch out for details, and for ideas the text never says." },
          why: "Highs: the award. Lows: the minibus. \"However\" was the signal that a new main point was coming." } },
      vary: [
        { q: P("Jay went bird watching on Saturday. He saw a kingfisher, which he has wanted to see for years.") + P("Sadly, it rained all afternoon. His sandwiches got soggy and he had to go home early.") + "Pick the <b>two</b> main points.",
          options: ["Jay finally saw a kingfisher.", "The rain spoiled the afternoon.", "Jay's sandwiches got soggy.", "Kingfishers are blue."],
          answers: [0, 1],
          slips: { any: "One main point in each paragraph. Soggy sandwiches are a detail." },
          hint: "One from each paragraph.",
          why: "The good bit (the kingfisher) and the bad bit (the rain). The sandwiches are a detail.",
          lv: {
            mild: { q: P("Jay saw a kingfisher! But then it rained. He went home.") + "Pick the <b>two</b> big things it tells you.",
              options: ["Jay saw a kingfisher.", "It rained.", "Jay has a car."], answers: [0, 1],
              slips: { any: "A good thing and a bad thing." },
              why: "He saw a kingfisher, and then it rained." },
            spicy: { q: P("For years, Jay had heard that kingfishers lived along the canal, but he had never seen one. On Saturday his patience paid off: a flash of electric blue, and there it was, perched on a branch.") +
                P("The rest of the day was less kind. By two o'clock the rain was so heavy that his notebook turned to mush, and he squelched home early.") + "Pick the <b>two</b> main points.",
              options: ["Jay finally saw a kingfisher after years of trying.", "Heavy rain cut his day short.", "His notebook turned to mush.", "Kingfishers only live by canals.", "Jay will never go bird watching again."],
              answers: [0, 1],
              slips: { any: "One main point per paragraph. Watch out for a detail and two ideas the text never says." },
              why: "The kingfisher, and the rain. The notebook is a detail, and nothing says he will give up." } } },
        { q: P("The new skate park opened on Friday. Over 200 people came to try it out.") + P("Some people living nearby are not happy. They say it is too noisy at night.") + "Pick the <b>two</b> main points.",
          options: ["The new skate park opened and lots of people came.", "Some neighbours say it is too noisy.", "It opened on a Friday.", "The skate park will close."],
          answers: [0, 1],
          slips: { any: "One main point in each paragraph. Friday is a detail, and nothing says it will close." },
          hint: "One from each paragraph.",
          why: "It opened and was popular, and some neighbours are unhappy about the noise.",
          lv: {
            mild: { q: P("The skate park is open! Lots of people came. But some people say it is too loud.") + "Pick the <b>two</b> big things it tells you.",
              options: ["The skate park is open.", "Some people say it is too loud.", "Skate parks are free."], answers: [0, 1],
              slips: { any: "A good thing and a not so good thing." },
              why: "It is open, and some people say it is loud." },
            spicy: { q: P("Friday's opening of the new skate park drew a crowd of more than 200, with queues stretching past the bus stop. Local riders called it \"the best thing to happen to this town in years\".") +
                P("Not everyone is celebrating. Residents of nearby Elm Road have complained about noise late at night, and a council meeting has been called.") + "Pick the <b>two</b> main points.",
              options: ["The skate park opened to a big, excited crowd.", "Some residents have complained about the noise.", "Queues went past the bus stop.", "The council has closed the skate park.", "Elm Road is next to the bus stop."],
              answers: [0, 1],
              slips: { any: "A meeting has been called, but nothing has been decided. Look for one main point per paragraph." },
              why: "Popular opening, and noise complaints. \"Not everyone is celebrating\" signals the second point." } } }
      ] },

    { type: "match", topic: "Main points",
      q: "Three short paragraphs from one leaflet about [[place]]. Match each to its main point.",
      pairs: [["You can get there on the number 9 bus, or park in the big car park next door.", "How to get there"], ["It opens at 10 and closes at 5, every day except Monday.", "When it is open"], ["Bring a coat, as it can get cold, and a packed lunch if you like.", "What to bring"]],
      slips: { any: "Look for the big clue in each one: a bus, a time, or things to carry." },
      hint: "Buses and car parks are about getting there.",
      why: "Each paragraph has one job. Put the three jobs together and you have the gist of the leaflet.",
      lv: {
        spicy: { pairs: [["The number 9 stops right outside, and the car park next door is free after 4.", "How to get there"], ["Doors open at 10 and close at 5, but last entry is 4.", "When it is open"], ["It gets chilly inside, so layers are a good idea. Packed lunches are welcome.", "What to bring"], ["Adults pay 6 pounds, and under 16s go free with an adult.", "How much it costs"]] } },
      vary: [
        { q: "Three short paragraphs from a guide to keeping a pet rabbit. Match each to its main point.",
          pairs: [["Rabbits need a big hutch, plus space to run around every day.", "Where it lives"], ["Give them hay, fresh greens and clean water.", "What it eats"], ["Check their teeth and claws, and brush them in spring.", "Keeping it healthy"]],
          slips: { any: "Look for the big clue in each one: a hutch, food, or teeth and claws." },
          hint: "Hay and greens are food.",
          why: "Home, food, health: one job for each paragraph.",
          lv: { spicy: { pairs: [["A hutch alone is not enough: they need a run, ideally with something to hide in.", "Where it lives"], ["Most of their diet should be hay, with a handful of greens and fresh water.", "What it eats"], ["Their teeth never stop growing, so check them, along with claws, every week.", "Keeping it healthy"], ["Rabbits get lonely, so most do better living with another rabbit.", "Company"]] } } },
        { q: "Three short paragraphs from a page about [[event]]. Match each to its main point.",
          pairs: [["Tickets are 5 pounds, or 3 pounds if you book early.", "Cost"], ["It starts at 7pm, so please arrive by quarter to.", "Time"], ["There is a lift and a quiet room if anyone needs one.", "Help on the night"]],
          slips: { any: "Look for the big clue: money, a time, or something to help people." },
          hint: "Pounds are about cost.",
          why: "Cost, time, help: one job for each paragraph.",
          lv: { spicy: { pairs: [["Book before Friday and you save 2 pounds on each ticket.", "Cost"], ["Doors at 6.45, curtain up at 7, and it all wraps up by 9.", "Time"], ["Step free access, plus a quiet room for anyone who needs a break.", "Help on the night"], ["The car park fills fast, so the bus or a lift is your best bet.", "Getting there"]] } } }
      ] },

    { type: "mc", topic: "Main points",
      q: "A text says two things: <b>the [[place]] cafe has new opening times</b>, and <b>it now sells hot food</b>. Which sentence covers <b>both</b> main points?",
      options: ["The cafe at [[place]] has new opening times and now sells hot food.", "The cafe at [[place]] has new opening times.", "The cafe at [[place]] now sells hot food.", "The cafe at [[place]] is a good place to eat."],
      answer: 0,
      slips: { 1: "Only half. What about the food?", 2: "Only half. What about the times?", 3: "That is an opinion, and it misses both points." },
      hint: "Look for the one with both bits in.",
      why: "A gist of the whole text covers every main point, squeezed together.",
      lv: { spicy: { q: "A text makes three points: <b>the [[place]] cafe has new opening times</b>, <b>it now sells hot food</b>, and <b>prices have gone up a little</b>. Which is the best gist?",
        options: ["The cafe at [[place]] has new times, hot food and slightly higher prices.", "The cafe at [[place]] now sells hot food.", "The cafe at [[place]] has new times and hot food.", "The cafe at [[place]] is getting too expensive."],
        slips: { 1: "Only one of the three points.", 2: "Close, but it misses the prices.", 3: "That is a judgement. The text says prices went up \"a little\"." },
        why: "All three points, squeezed into one sentence." } } },

    /* ---------- chunk 3: what it hints ---------- */
    { type: "learn", topic: "Under the surface", title: "Texts hint more than they say",
      fig: ICE,
      html: "<p>Writers do not always say things straight out. Like an iceberg, there is often more <b>under the surface</b>.</p>" +
        "<p>\"[[Who]] checked the clock again. Their coat was already on.\" It never says they want to leave. But the clues, plus what you know, tell you they do.</p>" +
        "<p>That is reading the hint: <b>clue in the words + what you know = the hint</b>.</p>",
      lv: {
        mild: { html: "<p>Sometimes a text gives you a <b>clue</b> instead of saying it.</p><p>\"Their coat was on. They kept looking at the door.\" It does not say \"they want to go\". But you can tell.</p>" },
        spicy: { html: "<p>Writers often leave the most interesting part <b>under the surface</b>: feelings, opinions, even jokes.</p>" +
          "<p>Watch for small choices: a word like <b>finally</b> or <b>still</b>, a short sentence after a long one, a fact that seems out of place, or a writer saying the opposite of what they mean to be funny.</p>" +
          "<p>A good hint is always <b>backed by a clue</b> in the words. If you cannot point to one, it is a guess.</p>" } } },

    { type: "mc", topic: "Under the surface",
      q: P("[[Who]] looked at the clock for the fifth time. Their coat was already on. \"Is it nearly finished?\" they asked.") + "What does this hint?",
      options: ["[[Who]] wants to leave.", "[[Who]] is cold.", "[[Who]] is enjoying it.", "[[Who]] has lost their watch."],
      answer: 0,
      slips: { 1: "Possible, but the clock and the question point somewhere else.", 2: "Checking the clock five times usually means the opposite.", 3: "They can see a clock. The text does not mention a watch." },
      hint: "Why would you keep looking at a clock?",
      why: "Checking the clock, coat on, asking if it is nearly finished: all clues that they want to go.",
      lv: {
        mild: { q: P("[[Who]] has their coat on. They keep looking at the door.") + "What does this hint?",
          options: ["[[Who]] wants to go.", "[[Who]] wants to stay all day.", "[[Who]] is asleep."],
          slips: { 1: "The coat and the door are clues. Do they point to staying?", 2: "Looking at the door means they are awake." },
          why: "Coat on and looking at the door: they want to go." },
        spicy: { q: P("\"It was lovely,\" said [[who]], already halfway out of the door. \"Really. We must do it again some time.\" They did not leave a phone number.") + "What is the writer hinting?",
          options: ["[[Who]] did not really enjoy it, and is not keen to come back.", "[[Who]] had a lovely time and wants to come back soon.", "[[Who]] has lost their phone.", "[[Who]] is late for something important."],
          slips: { 1: "That is what the words say. Do the actions match them?", 2: "The text does not say that. The missing number is a clue about something else.", 3: "Possible, but nothing points to it. Look at the last sentence." },
          why: "The words say lovely, but halfway out of the door and no phone number say otherwise." } },
      vary: [
        { q: P("Bonnie sat by the front door. She had her lead in her mouth. Her eyes did not leave Jay.") + "What does this hint?",
          options: ["Bonnie wants to go for a walk.", "Bonnie is hungry.", "Bonnie is tired and wants a nap.", "Bonnie is scared of the door."],
          answer: 0,
          slips: { 1: "A bowl would be the clue for hungry. What is in her mouth?", 2: "Tired dogs lie down. She is sitting up, watching.", 3: "She is sitting right next to it." },
          hint: "What is in her mouth?",
          why: "Her lead, by the door, watching Jay: she is asking for a walk without saying a word.",
          lv: {
            mild: { q: P("Bonnie has her lead in her mouth. She sits by the door.") + "What does this hint?",
              options: ["Bonnie wants a walk.", "Bonnie wants a bath.", "Bonnie wants to sleep."],
              slips: { 1: "What do you use a lead for?", 2: "She is sitting by the door, ready." },
              why: "A lead and the door: she wants a walk." },
            spicy: { q: P("Bonnie had not moved from the mat by the front door in twenty minutes. Every time Jay stood up, her ears lifted. Every time he sat back down, she let out a long, dramatic sigh.") + "What is the writer hinting?",
              options: ["Bonnie is waiting for Jay to take her out, and is getting impatient.", "Bonnie is unwell and needs a vet.", "Bonnie is angry with Jay for no reason.", "Bonnie likes lying on the mat."],
              slips: { 1: "Nothing points to her being ill. Her ears lift when Jay stands up.", 2: "There is a reason. Where is she waiting?", 3: "True, but too small. Why that mat, and why the sighs?" },
              why: "By the front door, ears up when he stands, sighs when he sits: she is waiting to go out." } } },
        { q: P("[[Who]] opened the present. They smiled, said \"Oh. Thanks,\" and put it straight back in the box.") + "What does this hint?",
          options: ["[[Who]] does not really like the present.", "[[Who]] loves the present.", "[[Who]] is saving it for later.", "[[Who]] already has three of them."],
          answer: 0,
          slips: { 1: "They smiled, but what did they do with it?", 2: "Possible, but \"Oh\" and putting it straight back are clues.", 3: "The text never says that." },
          hint: "Look at what they do, not just what they say.",
          why: "A short \"Oh. Thanks\" and straight back in the box: they are being polite, but they do not love it.",
          lv: {
            mild: { q: P("[[Who]] opens a present. They say \"Oh.\" They put it away fast.") + "What does this hint?",
              options: ["[[Who]] does not like it much.", "[[Who]] loves it.", "[[Who]] cannot open it."],
              slips: { 1: "If they loved it, would they put it away fast?", 2: "It says they opened it." },
              why: "\"Oh\" and putting it away fast: they do not like it much." },
            spicy: { q: P("\"It's... wow. Really practical,\" said [[who]], turning the socks over in their hands. \"You shouldn't have.\" The socks went in a drawer that afternoon and were never seen again.") + "What is the writer hinting?",
              options: ["[[Who]] is being polite, but does not like the socks.", "[[Who]] thinks the socks are wonderful.", "[[Who]] is cross that someone spent money on them.", "[[Who]] lost the socks by accident."],
              slips: { 1: "Listen to the pauses, and look at where the socks ended up.", 2: "\"You shouldn't have\" is a polite saying here, not real anger.", 3: "\"Never seen again\" is the writer joking that they were hidden away on purpose." },
              why: "The pause, \"practical\" and the drawer all hint that the socks were not a hit." } } }
      ] },

    { type: "mc", topic: "Under the surface",
      q: P("[[Crew]] had trained every day for a month. On the morning of [[event]], nobody spoke on the way there. [[Who]] could not eat breakfast.") + "Which clue best shows that [[who]] is nervous?",
      options: ["[[Who]] could not eat breakfast.", "[[Crew]] had trained for a month.", "It was the morning of [[event]].", "They travelled there together."],
      answer: 0,
      slips: { 1: "That shows they worked hard, not how they feel.", 2: "That is when it happens, not a feeling.", 3: "That does not tell you how anyone feels." },
      hint: "Which clue is about a feeling in the body?",
      why: "Not being able to eat is a common sign of nerves. Nobody speaking backs it up.",
      lv: {
        mild: { q: P("It is the day of [[event]]. [[Who]] cannot eat. Their hands shake.") + "Which clue shows [[who]] is nervous?",
          options: ["Their hands shake.", "It is the day of [[event]].", "It is breakfast time."],
          slips: { 1: "That is when, not how they feel.", 2: "The text does not say that." },
          why: "Shaking hands show nerves." },
        spicy: { q: P("[[Crew]] had trained every day for a month. On the morning of [[event]], the minibus was silent. [[Who]] tied and retied their laces four times, then checked their bag for the third time.") + "Which clue best shows that [[who]] is anxious, not just careful?",
          options: ["Retying their laces four times.", "Training every day for a month.", "Bringing a bag.", "Travelling on the minibus."],
          slips: { 1: "That shows hard work, not anxiety on the day.", 2: "Bringing a bag is normal. Checking it three times is the clue, but laces four times is stronger.", 3: "That is just how they got there." },
          why: "Doing the same thing again and again, more than you need to, is a sign of nerves." } } },

    { type: "match", topic: "Under the surface",
      q: "Match each clue to what it hints.",
      pairs: [["She yawned and rubbed her eyes.", "She is tired."], ["He slammed the door.", "He is angry."], ["They cheered and hugged.", "They are happy."], ["Her teeth were chattering.", "She is cold."]],
      slips: { any: "Picture someone doing it. How would they feel?" },
      hint: "Yawning is a body clue.",
      why: "Each action is a clue. Clue + what you know = the hint.",
      lv: {
        mild: { pairs: [["She yawned.", "She is tired."], ["He slammed the door.", "He is angry."], ["They cheered.", "They are happy."]] },
        spicy: { pairs: [["He gave a one word answer and stared at his phone.", "He does not want to talk."], ["She read the letter, smiled, and read it again.", "It is good news."], ["They kept glancing at the back door.", "They are planning to slip out."], ["He laughed a little too loudly at the joke.", "He is pretending to find it funny."]] } } },

    { type: "mc", topic: "Under the surface",
      q: P("We waited an hour for our food. The chips were cold. Still, the view was nice. We will not be rushing back.") + "What does the writer think of the cafe?",
      options: ["They did not enjoy it, apart from the view.", "They loved it and will go back soon.", "They thought the chips were the best part.", "They did not go inside."],
      answer: 0,
      slips: { 1: "\"Not rushing back\" says the opposite.", 2: "Cold chips are a complaint.", 3: "They waited for food, so they were there." },
      hint: "What does \"we will not be rushing back\" really mean?",
      why: "It never says \"bad\", but the wait, the cold chips and \"not rushing back\" all hint it. Only the view gets a nice word.",
      lv: {
        mild: { q: P("The food was cold. We waited a long time. We will not go back.") + "Did they like the cafe?",
          options: ["No, they did not like it.", "Yes, they loved it.", "They did not go."],
          slips: { 1: "Cold food and a long wait. Would you love that?", 2: "They waited for food, so they were there." },
          why: "Cold food, a long wait and not going back: they did not like it." },
        spicy: { q: P("The cafe promises \"food in five minutes\". We timed it: fifty. The chips arrived at roughly room temperature, which at least matched the welcome. The view of the harbour, to be fair, is lovely.") + "What does the writer think of the cafe?",
          options: ["Poor food and service, though the view is good.", "Good food, but the view lets it down.", "The staff were very warm and friendly.", "They would recommend it for a quick lunch."],
          slips: { 1: "It is the other way round. Which part gets the only kind word?", 2: "\"Matched the welcome\" means the welcome was as cold as the chips.", 3: "Fifty minutes is not quick." },
          why: "The writer never says \"bad\". The timing, the jokes about temperature and \"to be fair\" do the work." } },
      vary: [
        { q: P("The film was two hours long. I checked my phone a lot. My friend fell asleep. The popcorn was good though.") + "What does the writer think of the film?",
          options: ["It was boring.", "It was the best film ever.", "It was too scary.", "It was too short."],
          answer: 0,
          slips: { 1: "Would you check your phone a lot during the best film ever?", 2: "Nobody falls asleep in a scary film.", 3: "Two hours is not short." },
          hint: "What do people do when something is boring?",
          why: "Checking the phone and falling asleep hint it was boring. Only the popcorn gets praise.",
          lv: {
            mild: { q: P("The film was long. My friend fell asleep. I looked at my phone.") + "Did they like the film?",
              options: ["No, it was boring.", "Yes, it was exciting.", "They did not watch it."],
              slips: { 1: "Do people fall asleep in exciting films?", 2: "They were there, looking at a phone." },
              why: "Falling asleep and phones out: it was boring." },
            spicy: { q: P("The film runs for two hours and forty minutes, and you feel every one of them. My friend got a full night's sleep. I learned a lot about my phone. The popcorn was the most exciting thing on screen, and it was in my lap.") + "What does the writer think of the film?",
              options: ["It was far too long and very dull.", "It was long but worth it.", "It was frightening.", "The popcorn was too salty."],
              slips: { 1: "\"Feel every one of them\" is not praise.", 2: "Nobody gets a full night's sleep in a scary film.", 3: "The popcorn joke is about the film being dull." },
              why: "Every line is a joke about how dull it was. The writer never says \"boring\"." } } },
        { q: P("The hotel room was tiny. The shower was cold. But the breakfast was amazing, and the staff could not do enough for us.") + "What does the writer think of the hotel?",
          options: ["The room was poor, but the food and staff were great.", "Everything was bad.", "Everything was perfect.", "The writer never stayed there."],
          answer: 0,
          slips: { 1: "Look after the word \"But\".", 2: "A tiny room and a cold shower are not perfect.", 3: "They talk about their room, so they stayed." },
          hint: "What changes after \"But\"?",
          why: "Two complaints, then \"But\", then two big compliments. A mixed review.",
          lv: {
            mild: { q: P("The room was small. But the breakfast was great!") + "What does the writer think?",
              options: ["The room was small, but breakfast was good.", "Everything was bad.", "Breakfast was awful."],
              slips: { 1: "Look after \"But\".", 2: "It says great." },
              why: "One bad bit, one good bit." },
            spicy: { q: P("Our room could have fitted in a lift, and the shower had two settings: cold and colder. And yet, I would go back tomorrow. Breakfast was a feast, and the staff remembered our names by day two.") + "What does the writer think of the hotel?",
              options: ["The room was poor, but the people and the food make it worth it.", "It was awful and they want a refund.", "The room was the best part.", "The staff were rude."],
              slips: { 1: "\"I would go back tomorrow\" says otherwise.", 2: "The room gets the jokes. It is the weak spot.", 3: "Remembering your name is a sign of good service." },
              why: "\"And yet\" turns it round: the room is a joke, but they would go back." } } }
      ] },

    /* ---------- chunk 4: postcards, all together ---------- */
    { type: "learn", topic: "Postcard", title: "Last one: a postcard",
      fig: pc(NAN.medium, true),
      html: "<p>Last bit. Postcards are short, so they are perfect for getting the gist. Have a read of this one whenever you are ready.</p>" +
        "<p>Ask yourself: what is it <b>mostly</b> about, and what does it <b>hint</b>?</p>",
      lv: { mild: { fig: pc(NAN.mild, true) }, spicy: { fig: pc(NAN.spicy, true) } },
      vary: [
        { html: "<p>Last bit. Postcards are short, so they are perfect for getting the gist. Have a read of this one from Rory whenever you are ready.</p><p>Ask yourself: what is it <b>mostly</b> about, and what does it <b>hint</b>?</p>",
          fig: pc(RORY.medium, true), lv: { mild: { fig: pc(RORY.mild, true) }, spicy: { fig: pc(RORY.spicy, true) } } },
        { html: "<p>Last bit. Postcards are short, so they are perfect for getting the gist. Have a read of this one from Uncle Dev whenever you are ready.</p><p>Ask yourself: what is it <b>mostly</b> about, and what does it <b>hint</b>?</p>",
          fig: pc(DEV.medium, true), lv: { mild: { fig: pc(DEV.mild, true) }, spicy: { fig: pc(DEV.spicy, true) } } }
      ] },

    { type: "mc", topic: "Postcard",
      q: "What is the gist of Nan's postcard?",
      fig: pc(NAN.medium),
      options: ["Nan is having a nice holiday by the sea, even with the rain.", "It has rained every day.", "Grandad likes chips.", "Nan wants to come home early."],
      answer: 0,
      slips: { 1: "True, but only part of it. Is she having a bad time?", 2: "A detail about Grandad.", 3: "Nothing says that. She says the hotel is lovely." },
      hint: "Where is she, and is she having a good time?",
      why: "Holiday, by the sea, nice despite the rain. The chips and books are details.",
      lv: {
        mild: { fig: pc(NAN.mild), options: ["Nan is on holiday at the seaside.", "Nan likes the rain.", "Nan is at home."],
          slips: { 1: "It says it rains, not that she likes it.", 2: "Have another look: where is she?" }, why: "Nan is on holiday at the seaside." },
        spicy: { fig: pc(NAN.spicy), options: ["Nan's holiday is very rainy, but she is still enjoying it.", "Nan has read every book in the hotel.", "Grandad has found a chip shop.", "Nan is furious about the weather."],
          slips: { 1: "A detail, and a clue about the rain.", 2: "A detail about Grandad.", 3: "\"I am not complaining much\" says otherwise." }, why: "Rainy, but lovely staff and food: she is enjoying it." } },
      vary: [
        { q: "What is the gist of Rory's postcard?", fig: pc(RORY.medium),
          options: ["A long, tiring day at the theme park, but the big coaster was amazing.", "Rory got there at 9am.", "Rory's feet hurt.", "Rory went on every ride in the park."],
          answer: 0,
          slips: { 1: "A detail: the time.", 2: "True, but only part of it.", 3: "Only three rides. Have another look." },
          hint: "Where was he, and how did it go?",
          why: "Theme park, lots of queues, but the coaster made it worth it.",
          lv: {
            mild: { fig: pc(RORY.mild), options: ["Rory went to a theme park.", "Rory went to the seaside.", "The queues were short."],
              slips: { 1: "Have another look: where did he go?", 2: "It says the queues were long." }, why: "Rory went to a theme park." },
            spicy: { fig: pc(RORY.spicy), options: ["Lots of queuing and fed up parents, but one brilliant coaster.", "They arrived at 9 and left at 6.", "Dad has gone very quiet.", "Rory had the best day of his life."],
              slips: { 1: "A detail: the times.", 2: "A detail, and a hint.", 3: "Too far. Only one ride was worth it." }, why: "Queues, grumpy parents, one great coaster." } } },
        { q: "What is the gist of Uncle Dev's postcard?", fig: pc(DEV.medium),
          options: ["Camping has gone wrong a bit, but Dev loves it and is staying longer.", "A goat ate Dev's sandwich.", "The lake is very clear.", "Dev is coming home early because of the rain."],
          answer: 0,
          slips: { 1: "A funny detail.", 2: "A detail.", 3: "Have another look at the last line." },
          hint: "Is he coming home, or staying?",
          why: "Some problems, but he loves it and is staying another night.",
          lv: {
            mild: { fig: pc(DEV.mild), options: ["Dev is camping and having a good time.", "Dev is at a goat farm.", "Dev hates camping."],
              slips: { 1: "A goat turns up, but where is he?", 2: "\"The stars are great\" says otherwise." }, why: "Dev is camping, and he likes it." },
            spicy: { fig: pc(DEV.spicy), options: ["Things went wrong, but he is enjoying it so much he has booked another night.", "A goat stole his lunch.", "His tent filled with water.", "He would rather be in the city."],
              slips: { 1: "A detail.", 2: "A detail.", 3: "He says you cannot see stars like these in the city." }, why: "Problems, \"and yet\" another night booked." } } }
      ] },

    { type: "mc", topic: "Postcard", explain: true,
      q: "Nan says she has read four books. What does that hint?",
      fig: pc(NAN.medium),
      options: ["She has spent a lot of time indoors because of the rain.", "She works in a library.", "She does not like the sea.", "The hotel sells books."],
      answer: 0,
      slips: { 1: "Nothing points to her job.", 2: "Nothing says that. Why might she be indoors?", 3: "The text does not say where the books came from." },
      hint: "What was the weather doing?",
      why: "Rain every day + four books = lots of time inside. It never says so, but the clues add up.",
      lv: {
        mild: { q: "Nan says \"But the hotel is nice.\" What does that hint?", fig: pc(NAN.mild),
          options: ["She is still having an OK time.", "She wants to go home now.", "The hotel is shut."],
          slips: { 1: "\"Nice\" is a happy word.", 2: "She is staying in it." }, why: "Rain, \"but\" the hotel is nice: she is still OK." },
        spicy: { q: "Nan writes \"sunny (ha!)\". What is she hinting?", fig: pc(NAN.spicy),
          options: ["It is not sunny at all, and she is joking about it.", "It is very sunny.", "She is laughing at Grandad.", "Seabrook is famous for its sunshine."],
          slips: { 1: "Day six of rain. Have another look.", 2: "The \"ha!\" is about the weather word just before it.", 3: "She is joking because it is the opposite." }, why: "Saying the opposite of what you mean, with a \"ha!\", is a joke. It has rained for six days." } },
      vary: [
        { q: "Rory says Mum says \"never again\". What does that hint?", fig: pc(RORY.medium),
          options: ["Mum did not enjoy the day much.", "Mum wants to go again tomorrow.", "Mum works at the theme park.", "Mum lost her ticket."],
          answer: 0,
          slips: { 1: "\"Never again\" means the opposite.", 2: "Nothing points to that.", 3: "Nothing points to that." },
          hint: "When do people say \"never again\"?",
          why: "People say \"never again\" after something they did not enjoy. The queues are the clue.",
          lv: {
            mild: { q: "\"The big ride was the best!\" How did Rory feel about it?", fig: pc(RORY.mild),
              options: ["He loved it.", "He hated it.", "He did not go on it."],
              slips: { 1: "\"The best\" is a happy word.", 2: "He says it was the best, so he went on it." }, why: "\"The best!\" means he loved it." },
            spicy: { q: "\"Dad has gone very quiet.\" What is the writer hinting?", fig: pc(RORY.spicy),
              options: ["Dad is fed up or worn out, but not saying so.", "Dad has lost his voice from screaming on rides.", "Dad is asleep.", "Dad loved every minute."],
              slips: { 1: "Possible, but there were only three rides. The queues are the bigger clue.", 2: "Nothing says he is asleep.", 3: "Mum's \"never again\" sits right next to it. Does that sound like a great day?" },
              why: "Right after Mum's \"never again\", going quiet hints that Dad has had enough too." } } },
        { q: "Dev says \"I am staying one more night.\" What does that hint?", fig: pc(DEV.medium),
          options: ["He is enjoying it, even with the problems.", "He is lost and cannot get home.", "The goat will not let him leave.", "He hates camping."],
          answer: 0,
          slips: { 1: "Nothing says he is lost.", 2: "A funny idea, but the goat only took a sandwich.", 3: "Would you stay longer somewhere you hate?" },
          hint: "Would you stay longer somewhere you did not like?",
          why: "Choosing to stay longer, after all that, hints he is loving it.",
          lv: {
            mild: { q: "\"But the stars are great.\" How does Dev feel?", fig: pc(DEV.mild),
              options: ["Happy, even after the goat.", "Cross, and wants to go home.", "Scared of the stars."],
              slips: { 1: "\"Great\" is a happy word.", 2: "\"Great\" is not a scared word." }, why: "\"But\" the stars are great: he is happy." },
            spicy: { q: "\"A goat stole my lunch and showed no remorse.\" What is the writer doing here?", fig: pc(DEV.spicy),
              options: ["Joking, by talking about the goat as if it were a person.", "Saying the goat said sorry.", "Making a complaint to the campsite.", "Warning that goats are dangerous."],
              slips: { 1: "No remorse means not sorry at all.", 2: "The tone is too jokey for a complaint.", 3: "It only took a lunch. He is being funny." },
              why: "Goats do not feel sorry. Talking about one as if it should is a joke, and it shows he is not too bothered." } } }
      ] },

    { type: "text", topic: "Postcard", stretch: true,
      q: "In your own words, what is Nan's postcard mostly about? A few words is plenty.",
      fig: pc(NAN.medium),
      need: [["holiday", "seaside", "sea", "hotel", "away", "trip", "beach", "rain"]],
      model: "Nan is on a rainy holiday by the sea.",
      hint: "Where is she?",
      why: "Something like \"Nan is having a nice, rainy holiday by the sea\" gets the gist.",
      lv: { mild: { fig: pc(NAN.mild) }, spicy: { fig: pc(NAN.spicy), q: "In one sentence, what is Nan's postcard mostly about, including what it hints?" } },
      vary: [
        { q: "In your own words, what is Rory's postcard mostly about? A few words is plenty.", fig: pc(RORY.medium),
          need: [["theme park", "rides", "ride", "coaster", "park", "queue", "queues"]],
          model: "A day at a theme park with long queues.",
          hint: "Where did he go?",
          why: "Something like \"A long day at a theme park, but the coaster was great\" gets the gist.",
          lv: { mild: { fig: pc(RORY.mild) }, spicy: { fig: pc(RORY.spicy), q: "In one sentence, what is Rory's postcard mostly about, including what it hints?" } } },
        { q: "In your own words, what is Uncle Dev's postcard mostly about? A few words is plenty.", fig: pc(DEV.medium),
          need: [["camp", "camping", "tent", "lake", "stars", "goat", "trip"]],
          model: "Dev is camping and loving it.",
          hint: "Where is he?",
          why: "Something like \"Dev's camping trip went wrong, but he loves it\" gets the gist.",
          lv: { mild: { fig: pc(DEV.mild) }, spicy: { fig: pc(DEV.spicy), q: "In one sentence, what is Uncle Dev's postcard mostly about, including what it hints?" } } }
      ] }
  ],

  realWorld: {
    title: "Getting the gist, every day",
    html: "<p>You get the gist all the time: skimming a group chat, a letter home, a news headline, the back of a game box. Nobody reads every word of everything.</p>" +
      "<p>For our big question: if we could time travel, should we? A traveller landing in 1850 would need the gist of things fast: a poster, a newspaper, what people were hinting at. Getting the gist could keep you out of trouble.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay by the time portal, reading a newspaper from the past">' + A.portal(76, 75, 56) +
      '<rect x="160" y="40" width="96" height="76" rx="4" fill="#fffaf0" stroke="#141a33" stroke-width="2" transform="rotate(-6 208 78)"/>' +
      T(208, 66, "1850", 14, { a: "middle", b: 1 }) + '<path d="M174 82h66M174 94h66M174 106h44" stroke="#141a33" stroke-opacity=".4" stroke-width="3" transform="rotate(-6 208 78)"/>' +
      A.jay(320, 62, 0.8, "hmm") + A.bubble(270, 4, 140, 44, "So the gist is...", 320) + '</svg>'
  },

  make: {
    title: "Make a gist card",
    intro: "Pick anything you have read or watched lately: a message, a video, a film, a game's story. Give its gist in one breath, plus a hint it never said out loud. Keep it, stick it up, or send it to Jay.",
    fields: [
      { id: "what", label: "What I read or watched", ph: "The new episode", max: 40 },
      { id: "gist", label: "The gist, in one breath", ph: "The hero finally finds the lost map.", max: 80 },
      { id: "hint", label: "A hint it never said", ph: "I think the map is a fake.", max: 70 },
      { id: "name", label: "Name on the card", ph: "B5", max: 24 }
    ],
    svg: function(v){
      var g = wrap(v.gist, 28, 3), h = wrap(v.hint, 36, 2);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#fffdf6"/>' +
        '<rect x="12" y="12" width="576" height="376" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        T(36, 58, "GOT THE GIST", 26, { b: 1, c: "#1f9d63" }) +
        T(36, 90, esc(wrap(v.what, 40, 1)[0] || ""), 18, { b: 1, c: "#5b6180" }) +
        '<rect x="30" y="108" width="430" height="136" rx="16" fill="#19c39a" fill-opacity=".22"/>' +
        T(48, 134, "In one breath", 14, { b: 1, c: "#3a4060" }) +
        g.map(function(l, k){ return T(48, 168 + k * 30, esc(l), 22, { b: 1 }); }).join("") +
        '<path d="M30 262h540" stroke="#3a8fd6" stroke-width="3" stroke-dasharray="10 6"/>' +
        T(36, 290, "Under the surface", 14, { b: 1, c: "#3a4060" }) +
        h.map(function(l, k){ return T(36, 318 + k * 24, esc(l), 18); }).join("") +
        T(36, 374, "Card by: " + esc(wrap(v.name, 24, 1)[0] || ""), 16, { b: 1, c: "#5b6180" }) +
        /* a little iceberg */
        '<g transform="translate(520 170)"><path d="M-30 20l18 -40 14 10 14 -12 14 42z" fill="#ffffff" stroke="#141a33" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<path d="M-44 20h90" stroke="#3a8fd6" stroke-width="3"/><path d="M-30 20l-16 34 26 24 46 -8 16 -50z" fill="#cfe8f5" stroke="#141a33" stroke-width="2.5" stroke-linejoin="round"/></g>' +
        A.bird(520, 110, 0.7, "#ff5d5d") +
        '</svg>';
    }
  }
};
})();
