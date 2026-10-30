/* Base 5 core target activity: Built for effect.
   English. Structural features at sentence and text level, and the
   effect each one has on a reader: name the feature, then say what it
   does. Always available and replayable (vary). ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }

/* a blueprint of a text, for the start card */
var PRINT = '<svg viewBox="0 0 520 220" role="img" aria-label="A blueprint of a page of writing with its structural features labelled">' +
  '<rect width="520" height="220" rx="16" fill="#1d4e89"/>' +
  (function(){ var s = ""; for(var x = 20; x < 520; x += 20) s += '<path d="M' + x + ' 0v220" stroke="#ffffff" stroke-opacity=".08"/>'; for(var y = 20; y < 220; y += 20) s += '<path d="M0 ' + y + 'h520" stroke="#ffffff" stroke-opacity=".08"/>'; return s; })() +
  '<rect x="40" y="22" width="190" height="180" rx="6" fill="none" stroke="#ffffff" stroke-width="2.5"/>' +
  '<rect x="56" y="36" width="140" height="14" rx="3" fill="#ffffff"/>' +
  '<path d="M56 66h158M56 76h150M56 86h158M56 96h120" stroke="#ffffff" stroke-opacity=".7" stroke-width="4"/>' +
  '<path d="M56 116h70" stroke="#ffd23f" stroke-width="5"/>' +
  '<path d="M56 136h158M56 146h158M56 156h140" stroke="#ffffff" stroke-opacity=".7" stroke-width="4"/>' +
  '<path d="M56 178h40" stroke="#ff8fb1" stroke-width="5"/>' +
  '<g stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4 3"><path d="M200 43H262"/><path d="M130 116H262"/><path d="M100 178H262"/></g>' +
  T(268, 48, "Heading: tells you what is coming", 13, { c: "#ffffff", b: 1 }) +
  T(268, 121, "One line paragraph: stands out", 13, { c: "#ffd23f", b: 1 }) +
  T(268, 183, "Short ending: hits hard", 13, { c: "#ff8fb1", b: 1 }) +
  A.egg(A.bird(482, 92, 0.62, "#ffd23f"), "A bird on the blueprint. Jay says every good building needs a bird table.") +
  '</svg>';

/* four sentence level tools in a 2 x 2 grid */
var SENT = '<svg viewBox="0 0 520 260" role="img" aria-label="Four sentence tools: short sentences make it faster and tenser, openers set up what comes next, questions make you think, lists pile it on">' +
  '<rect width="520" height="260" rx="16" fill="#f4f1ea"/>' +
  [["Short sentences", "faster and tenser", "#ff8a5c"], ["Openers", "set up what comes next", "#ffd23f"], ["Questions", "make the reader think", "#22b8e6"], ["Lists", "pile it on", "#19c39a"]].map(function(c, k){
    var x = 12 + (k % 2) * 252, y = 12 + Math.floor(k / 2) * 122, pic = "";
    if(k === 0) pic = [150, 120, 80, 44, 24, 12].map(function(w, j){ return '<rect x="' + (x + 16) + '" y="' + (y + 16 + j * 9) + '" width="' + w + '" height="5" rx="2" fill="#141a33"/>'; }).join("");
    if(k === 1) pic = '<rect x="' + (x + 16) + '" y="' + (y + 22) + '" width="214" height="30" rx="6" fill="#ffffff" stroke="#141a33" stroke-width="1.5"/><rect x="' + (x + 20) + '" y="' + (y + 26) + '" width="128" height="22" rx="4" fill="#ffd23f"/>' + T(x + 24, y + 42, "Without warning,", 13, { b: 1 }) + T(x + 152, y + 42, "the...", 13);
    if(k === 2) pic = T(x + 40, y + 66, "?", 56, { b: 1, c: "#1d4e89" }) + T(x + 90, y + 40, "Have you", 13) + T(x + 90, y + 58, "ever...?", 13);
    if(k === 3) pic = ["nets,", "rods,", "bait,", "flies..."].map(function(t, j){ return T(x + 20 + j * 52, y + 32 + j * 8, t, 13, { b: 1 }); }).join("");
    return '<rect x="' + x + '" y="' + y + '" width="244" height="114" rx="12" fill="' + c[2] + '" fill-opacity=".28" stroke="#141a33" stroke-width="2"/>' + pic +
      T(x + 16, y + 88, c[0], 15, { b: 1 }) + T(x + 16, y + 105, c[1], 13);
  }).join("") + '</svg>';

/* a page layout with text level features */
var PAGE = '<svg viewBox="0 0 520 260" role="img" aria-label="A page with text level features labelled: heading, subheading, paragraphs, a one line paragraph and bullet points">' +
  '<rect width="520" height="260" rx="16" fill="#eef3fb"/>' +
  '<rect x="24" y="14" width="200" height="232" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
  '<rect x="40" y="28" width="150" height="16" rx="3" fill="#141a33"/>' +
  '<rect x="40" y="54" width="90" height="9" rx="2" fill="#22b8e6"/>' +
  '<path d="M40 76h168M40 86h168M40 96h168M40 106h140" stroke="#9aa3bd" stroke-width="5"/>' +
  '<path d="M40 126h80" stroke="#ff5d8f" stroke-width="6"/>' +
  '<path d="M40 146h168M40 156h120" stroke="#9aa3bd" stroke-width="5"/>' +
  '<g fill="#19c39a"><circle cx="44" cy="180" r="4"/><circle cx="44" cy="196" r="4"/><circle cx="44" cy="212" r="4"/></g>' +
  '<path d="M54 180h90M54 196h70M54 212h100" stroke="#9aa3bd" stroke-width="5"/>' +
  '<g stroke="#141a33" stroke-width="1.5"><path d="M194 36H254"/><path d="M134 58H254"/><path d="M212 91H254"/><path d="M124 126H254"/><path d="M160 196H254"/></g>' +
  T(260, 41, "Heading: what it is about", 13, { b: 1 }) +
  T(260, 63, "Subheading: find your way", 13, { b: 1 }) +
  T(260, 96, "Long paragraph: slows down", 13, { b: 1 }) +
  T(260, 131, "One line paragraph: stands out", 13, { b: 1 }) +
  T(260, 201, "Bullet points: quick to scan", 13, { b: 1 }) +
  '</svg>';

/* openings, endings and repeats: a story path that loops back */
var LOOP = '<svg viewBox="0 0 520 210" role="img" aria-label="A story path from opening to ending. The same object appears at the start, middle and end. One ending loops back to the opening, another stops on a question mark.">' +
  '<rect width="520" height="210" rx="16" fill="#fff6e8"/>' +
  '<path d="M60 120C140 60 220 160 300 110S430 90 460 120" fill="none" stroke="#141a33" stroke-width="4" stroke-linecap="round"/>' +
  '<path d="M460 132C440 196 100 196 64 134" fill="none" stroke="#8a5cf6" stroke-width="3" stroke-dasharray="8 6"/><path d="M58 126l2 16 12 -9z" fill="#8a5cf6"/>' +
  '<circle cx="60" cy="120" r="16" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/><circle cx="460" cy="120" r="16" fill="#ff8a5c" stroke="#141a33" stroke-width="2.5"/>' +
  T(60, 82, "Opening", 14, { a: "middle", b: 1 }) + T(460, 82, "Ending", 14, { a: "middle", b: 1 }) +
  [[60, 126], [262, 124], [460, 126]].map(function(p){ return '<g transform="translate(' + p[0] + ' ' + p[1] + ')"><circle r="7" fill="#ffffff" stroke="#141a33" stroke-width="2"/><path d="M0 0v-4M0 0h3" stroke="#141a33" stroke-width="1.5"/></g>'; }).join("") +
  T(262, 152, "the same clock, again", 12, { a: "middle" }) +
  T(260, 196, "Back to the start: it feels complete", 13, { a: "middle", b: 1, c: "#5b3fc4" }) +
  T(500, 46, "?", 34, { a: "end", b: 1, c: "#e0602e" }) + T(410, 32, "or stop on a cliffhanger", 12, { a: "end" }) +
  A.egg('<g transform="translate(160 40)">' + A.bonnie(0, 0, 0.32, "stand") + '</g>', "Bonnie's walks have a circular structure. They start at the sofa and end at the sofa, with a lot of sniffing in the middle.") +
  '</svg>';

/* name it, show it, say what it does */
var NSE = '<svg viewBox="0 0 520 190" role="img" aria-label="Three steps: name the feature, show it with a quote, say what it does to the reader">' +
  '<rect width="520" height="190" rx="16" fill="#f4f1ea"/>' +
  [["1 Name it", "short sentences", "#ffd23f"], ["2 Show it", "\"Then nothing.\"", "#22b8e6"], ["3 Effect", "tense, on edge", "#19c39a"]].map(function(c, k){
    var x = 16 + k * 128;
    return '<rect x="' + x + '" y="40" width="114" height="92" rx="12" fill="' + c[2] + '" fill-opacity=".35" stroke="#141a33" stroke-width="2"/>' +
      T(x + 57, 70, c[0], 14, { a: "middle", b: 1 }) + T(x + 57, 102, c[1], 12, { a: "middle" }) +
      (k < 2 ? '<path d="M' + (x + 116) + ' 86h10l-4 -5M' + (x + 126) + ' 86l-4 5" stroke="#141a33" stroke-width="2" fill="none"/>' : "");
  }).join("") +
  A.jay(446, 104, 0.72, "smile") + A.bubble(398, 10, 112, 40, "Then: why?", 440) +
  T(16, 170, "Name the feature, quote it, then say what it does to the reader.", 13, { b: 1 }) +
  '</svg>';

(window.A2PACKS = window.A2PACKS || {})["core-built-for-effect"] = {
  a2: true,
  id: "a2-core-built-for-effect",
  title: "Built for effect",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "Writers build a text on purpose. Name the structure they chose, then say what it does to the reader.",
  blurb: "How writers use sentences, paragraphs, openings and endings to make a reader feel something. Four short chunks: sentences, paragraphs and layout, openings and endings, then saying feature plus effect in your own words. A feature card to make at the end. New questions every time you come back.",
  note: "Built for effect: spotting how a text is built, and what that does to the reader. Four five minute chunks and a card to make. It changes a bit every time, so come back to it whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Bricks", line: "Bricks: one feature at a time, and the feeling it gives." },
    { id: "medium", name: "Builder", line: "Builder: name the feature and say what it does." },
    { id: "spicy", name: "Architect", line: "Architect: precise effects, why here, and comments an examiner would like." }
  ],
  themes: {
    time: { name: "Time travel", w: { who: "the time traveller", thing: "the old pocket watch", event: "the trip to 1066",
      tense: "The dial spun. The lights flickered. Then nothing.",
      calm: "The time machine hummed softly as the traveller leaned back, sipped a mug of tea and watched the centuries drift past the window like clouds.",
      gone: "The portal was gone.",
      list: "There were knights, dinosaurs, rockets, robots, castles and kings, all squashed into one afternoon.",
      open: "Run, before it closes.",
      ask: "Have you ever wished you could visit the past?",
      cliff: "Then, behind them, the portal began to open again.",
      rep: "Wrong year. Wrong place. Wrong time." } },
    football: { name: "Football", w: { who: "the striker", thing: "the signed ball", event: "the cup final",
      tense: "He stepped up. The crowd went quiet. He ran.",
      calm: "The striker strolled out onto the pitch in the warm evening sun, waving to the fans and chatting to his teammates as the stands slowly filled up.",
      gone: "The cup was gone.",
      list: "There were flags, drums, scarves, songs, flares and floodlights, all crammed into one corner of the ground.",
      open: "Ten seconds left.",
      ask: "Have you ever wished you could play at Wembley?",
      cliff: "Then the referee walked over to the screen.",
      rep: "Wrong pass. Wrong foot. Wrong result." } },
    horror: { name: "Horror", w: { who: "the night porter", thing: "the cracked mirror", event: "the night shift",
      tense: "The lift stopped. The lights died. Something breathed.",
      calm: "The night porter wandered along the bright, warm corridor, humming to himself and thinking about the sandwich waiting for him in the staff room.",
      gone: "The bed was empty.",
      list: "There were cobwebs, rusty trolleys, broken lamps, dusty files, cracked tiles and doors that would not shut.",
      open: "Do not look behind you.",
      ask: "Have you ever wondered what really happens after dark?",
      cliff: "Then the door handle began to turn.",
      rep: "Wrong floor. Wrong door. Wrong night." } },
    fishing: { name: "Fishing", w: { who: "the angler", thing: "the old rod", event: "the match day",
      tense: "The float dipped. The line went tight. Snap.",
      calm: "The angler sat by the still, misty lake, pouring a cup of coffee from his flask and watching the ducks drift slowly across the water.",
      gone: "The fish was gone.",
      list: "There were rods, nets, hooks, flies, floats, flasks and a very old sandwich in the bottom of the bag.",
      open: "The line screamed.",
      ask: "Have you ever wished you could catch a record breaking carp?",
      cliff: "Then something huge moved under the boat.",
      rep: "Wrong bait. Wrong spot. Wrong day." } },
    music: { name: "Music", w: { who: "the singer", thing: "the battered guitar", event: "opening night",
      tense: "The lights went down. The crowd held its breath. One note.",
      calm: "The singer sat on the edge of the empty stage in the afternoon light, strumming gently and humming a tune she had not finished yet.",
      gone: "Her voice was gone.",
      list: "There were cables, amps, drums, lights, speakers, roadies and one very nervous drummer.",
      open: "Three. Two. One.",
      ask: "Have you ever wished you could sing in front of thousands?",
      cliff: "Then the power went off.",
      rep: "Wrong key. Wrong song. Wrong crowd." } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: PRINT,
  steps: [

    /* ---------- chunk 1: sentence level ---------- */
    { type: "learn", topic: "Sentences for effect", title: "Sentences are tools",
      fig: SENT,
      html: "<p>Structure is <b>how a text is built</b>: the shape of the sentences, the order of the ideas, where it starts and ends. Writers choose it on purpose, to make you feel something.</p>" +
        "<p><b>Short sentences</b> speed up the pace and build tension. A one word sentence like \"Silence.\" stops you dead. <b>Long sentences</b> slow things down and feel calm or detailed.</p>" +
        "<p><b>Openers</b> (\"Without warning,\" \"Slowly,\" \"Deep underground,\") set up what is coming before it arrives. <b>Questions</b> pull the reader in. <b>Lists</b> pile things up to show how much there is.</p>" +
        "<p>The big move: never stop at naming it. Say <b>what it does to the reader</b>, and if you can, <b>why it matters at that moment</b>.</p>",
      ez: { title: "Sentences are tools", html: "<p><b>Short</b> sentences feel fast and tense.</p><p><b>Long</b> sentences feel slow and calm.</p>" },
      lv: {
        mild: { html: "<p>Writers choose how to build their sentences, to make you feel something.</p>" +
          "<p><b>Short sentences</b> feel fast and tense. <b>Long sentences</b> feel slow and calm.</p>" +
          "<p>A <b>question</b> makes you think. A <b>list</b> shows there is a lot of something.</p>" },
        medium: { html: "<p>Structure is how a text is built. Writers choose it on purpose.</p>" +
          "<p><b>Short sentences</b> speed up the pace and build tension. <b>Long sentences</b> slow it down. <b>Openers</b> like \"Without warning,\" set up what is coming. <b>Questions</b> make the reader think. <b>Lists</b> show how much there is.</p>" +
          "<p>Always say two things: the <b>feature</b>, and what it <b>does to the reader</b>.</p>" } } },

    { type: "mc", topic: "Sentences for effect", explain: true,
      q: "\"[[Tense]]\" What is the best comment on the effect of these short sentences?",
      options: ["They speed up the pace, so the reader feels each moment land and the tension builds", "They make the text easier for young children to read", "They show the writer could not think of longer sentences", "They describe the setting in lots of detail"],
      answer: 0,
      slips: { 1: "Short sentences can be easier to read, but here the writer chose them for a feeling, not for young readers.", 2: "Writers choose short sentences on purpose. Ask what they make you feel.", 3: "Lots of detail usually needs longer sentences. These are quick and bare." },
      hint: "How fast do you read them? How does that feel?",
      why: "Short sentences make you read in quick bursts, one moment at a time. That speed builds tension.",
      ez: { q: "\"[[Tense]]\" Short sentences. How do they feel?", hint: "Read them fast.", why: "<b>Tense</b>. Short sentences feel quick and sharp.", slips: { 1: "Long sentences feel calm. These are short.", 2: "Short sentences wake you up." } },
      lv: { mild: { q: "\"[[Tense]]\" These sentences are short. How do they make you feel?",
        options: ["Tense, like something is about to happen", "Calm and sleepy", "Bored"],
        slips: { 1: "Calm and sleepy is more what long, slow sentences do.", 2: "Short sentences are quick. They tend to wake you up, not bore you." },
        hint: "Read them fast. How does it feel?", why: "Short sentences are quick and sharp. They make you feel tense." } },
      vary: [
        { q: "\"[[Calm]]\" Why might the writer use one long, flowing sentence here?",
          options: ["It slows the pace right down, so the reader relaxes along with the character", "It makes the moment feel tense and frightening", "It shows the writer forgot to use full stops", "It makes the reader rush to the end"],
          answer: 0,
          slips: { 1: "Tension usually comes from short, sharp sentences. This one drifts along.", 2: "The commas and \"and\" are a choice: they keep it flowing.", 3: "A long sentence with gentle detail slows you down rather than rushing you." },
          hint: "Does this sentence hurry or take its time?",
          why: "One long sentence full of gentle detail makes you read slowly. The calm pace matches the calm moment, and it can make a later shock hit harder.",
          ez: { q: "\"[[Calm]]\" One long sentence. How does it feel?", hint: "Does it hurry?", why: "<b>Slow and calm</b>. Long sentences take their time.", slips: { 1: "Short sentences feel fast. This one is long.", 2: "Nothing angry happens here." } },
      lv: { mild: { q: "\"[[Calm]]\" This is one long sentence. How does it feel?",
            options: ["Slow and calm", "Fast and scary", "Angry"],
            slips: { 1: "Fast and scary is more what short sentences do.", 2: "Nothing angry happens. Look at how gently it moves." },
            hint: "Does it hurry or take its time?", why: "Long, gentle sentences feel slow and calm." } } },
        { q: "Jay reads a long, boring paragraph about car parks. Then he writes one sentence on its own: \"Outrageous.\" What does the one word sentence do?",
          options: ["It stops the reader suddenly, so Jay's reaction feels strong and a bit funny", "It explains exactly why the paragraph was boring", "It adds more detail about the car parks", "It slows the reader down gently"],
          answer: 0,
          slips: { 1: "One word cannot explain much. Its power is in how sudden it is.", 2: "It adds no new detail. It gives a reaction.", 3: "After a long paragraph, one word is a sudden stop, not a gentle slow down." },
          hint: "Long, long, long... then one word. What happens to your reading?",
          why: "After all that length, one word is a sudden stop. The contrast makes the reaction land hard, which is why it is funny.",
          ez: { q: "Jay writes a long, boring bit. Then: \"Outrageous.\" How does it feel?", hint: "Long, long, then one word.", why: "<b>Sudden and strong</b>. One word stops you.", slips: { 1: "One word is a sudden stop.", 2: "It is different from the rest." } },
      lv: { mild: { q: "Jay writes a long, boring paragraph. Then one word on its own: \"Outrageous.\" How does the one word feel?",
            options: ["Sudden and strong", "Slow and gentle", "Boring like the rest"],
            slips: { 1: "One word after a long paragraph is a sudden stop.", 2: "It is different from the rest, and that is the point." },
            hint: "Long, long, long... then one word.", why: "One word after a long paragraph feels sudden and strong. Outrageous." } } }
      ] },

    { type: "match", topic: "Sentences for effect",
      q: "Match each sentence feature to the effect it usually has on a reader.",
      pairs: [["Short sentences", "Speed up the pace and build tension"], ["A question to the reader", "Makes the reader stop and think about their own view"], ["A long list", "Piles up detail to show how much there is"], ["Opening with \"Without warning,\"", "Warns the reader a surprise is coming"]],
      slips: { any: "Look for the effect words that match the shape: quick, think, pile up, surprise." },
      hint: "A list piles things up. A question asks you something.",
      why: "Each feature has a typical effect. The skill is choosing the one that fits the moment.",
      ez: { q: "Match each one to a feeling.", hint: "A list has lots of things.", why: "Each feature gives a feeling.", slips: { any: "Think: fast, think, or lots?" } },
      lv: { mild: { q: "Match each feature to how it makes you feel.", pairs: [["Short sentences", "Tense and fast"], ["A question", "Makes you think"], ["A long list", "There is a lot of it"]] } },
      vary: [
        { q: "Match each feature to its effect.",
          pairs: [["One long, flowing sentence", "Slows the pace so the moment feels calm"], ["A one word sentence", "Stops the reader dead, like a shock"], ["Opening with \"Slowly,\"", "Stretches the moment out and builds suspense"], ["Opening with a place, like \"Deep underground,\"", "Sets the scene before the action starts"]],
          slips: { any: "Think about speed: what slows you down, what stops you dead?" },
          hint: "A one word sentence is the biggest stop of all.",
          why: "Long sentences slow you down, one word stops you, and openers set up how you read what follows.",
          ez: { q: "Match each one to a feeling.", hint: "One word is a big stop.", why: "Each feature gives a feeling.", slips: { any: "What is slow? What is a shock?" } },
      lv: { mild: { q: "Match each feature to how it makes you feel.", pairs: [["A long sentence", "Slow and calm"], ["A one word sentence", "A sudden shock"], ["Starting with \"Slowly,\"", "Waiting, wondering what happens"]] } } },
        { q: "Match each example to the feature it shows.",
          pairs: [["\"[[Ask]]\"", "Question to the reader"], ["\"Without warning, the floor gave way.\"", "Sentence opener"], ["\"[[List]]\"", "List"], ["\"Silence.\"", "One word sentence"]],
          slips: { any: "Find the one with a question mark first, then the one word one." },
          hint: "Look at the punctuation: question marks, lots of commas, a single full stop.",
          why: "Naming the feature correctly is step one. Then you can say what it does.",
          ez: { q: "Match each example to its name.", hint: "Look at the marks: ? and commas.", why: "Name the feature first. Then say what it does.", slips: { any: "Find the question mark first." } },
      lv: { mild: { q: "Match each example to the feature it shows.", pairs: [["\"[[Ask]]\"", "A question"], ["\"[[List]]\"", "A list"], ["\"Silence.\"", "A one word sentence"]] } } }
      ] },

    { type: "mc", topic: "Sentences for effect",
      q: "\"Without warning, [[Gone]]\" Why start the sentence with \"Without warning,\"?",
      options: ["It tells the reader something sudden is coming, so they feel the jolt before they know what it is", "It tells the reader what time of day it is", "It slows the sentence down so it feels calm", "It shows who is speaking"],
      answer: 0,
      slips: { 1: "\"Without warning\" is not a time. It is about suddenness.", 2: "It does the opposite: it gets you ready for a sudden change.", 3: "There is no speech here. The opener is about how the event happens." },
      hint: "What does \"without warning\" tell you before the main bit arrives?",
      why: "The opener sets up the surprise. You feel the jolt even before you read what happened.",
      ez: { q: "\"Without warning, [[Gone]]\" What do the first 2 words tell you?", hint: "A warning tells you first.", why: "<b>Something sudden</b> is about to happen.", slips: { 1: "It is not a time of day.", 2: "It means a surprise is coming." } },
      lv: { mild: { q: "\"Without warning, [[Gone]]\" What do the first words, \"Without warning,\" tell you?",
        options: ["Something sudden is about to happen", "It is the morning", "Everyone is calm"],
        slips: { 1: "\"Without warning\" is not a time of day.", 2: "\"Without warning\" means a surprise is coming." },
        hint: "Warning means being told something is coming.", why: "\"Without warning\" tells you something sudden is about to happen." } },
      vary: [
        { q: "\"Slowly, very slowly, [[who]] opened the door.\" What is the effect of starting with \"Slowly, very slowly,\"?",
          options: ["It stretches the moment out, so the reader has to wait and the suspense builds", "It makes the action feel quick and sudden", "It tells the reader where the door is", "It is just there to make the sentence longer"],
          answer: 0,
          slips: { 1: "\"Slowly\" does the opposite of quick. It makes you wait.", 2: "Where would be a place opener. This one is about how.", 3: "Writers do not add words just for length. Ask what the delay does to you." },
          hint: "How do you feel while you wait to find out what is behind the door?",
          why: "Putting the slowness first makes you wait for the main action. Waiting builds suspense.",
          ez: { q: "\"Slowly, very slowly, [[who]] opened the door.\" How does it feel?", hint: "Slowly means it takes a while.", why: "You <b>wait</b>, so you wonder what is coming.", slips: { 1: "Slowly means it takes a long time.", 2: "No food here. Unless you are Bonnie." } },
      lv: { mild: { q: "\"Slowly, very slowly, [[who]] opened the door.\" How does starting with \"Slowly\" make you feel?",
            options: ["Like I am waiting, wondering what is behind it", "Like it all happened in a flash", "Hungry"],
            slips: { 1: "\"Slowly\" means it takes a long time.", 2: "Nothing about food here, unless you are thinking of Bonnie." },
            hint: "Slowly means it takes a while.", why: "\"Slowly\" makes you wait, and waiting makes you wonder what is coming." } } },
        { q: "\"Deep under the city, in a room nobody had opened for fifty years, [[thing]] sat waiting.\" Why might the writer put the place first?",
          options: ["It builds the setting and the mystery first, so the object feels important when it finally appears", "It hides the place so the reader never finds out", "It makes the sentence quick and punchy", "It shows the object is not important"],
          answer: 0,
          slips: { 1: "The place is not hidden: it is given first, in detail.", 2: "This is a long sentence that takes its time, not a punchy one.", 3: "Making the reader wait for it usually makes something feel more important, not less." },
          hint: "What do you know, and what are you waiting for, by the time you reach the end?",
          why: "The place opener sets up a mysterious setting. By the time the object arrives, you are curious about it.",
          ez: { q: "\"Deep under the city, in a room nobody had opened for fifty years, [[thing]] sat waiting.\" What do the first words tell you?", hint: "Deep under the city is a place.", why: "<b>Where</b> it is. It sounds mysterious.", slips: { 1: "It is a place, not a time.", 2: "Nobody is talking here." } },
      lv: { mild: { q: "\"Deep under the city, in a room nobody had opened for fifty years, [[thing]] sat waiting.\" What do the first words tell you?",
            options: ["Where it is, and that it is a bit mysterious", "What time it is", "Who is talking"],
            slips: { 1: "\"Deep under the city\" is a place, not a time.", 2: "Nobody is talking here." },
            hint: "Deep under the city is a place.", why: "Starting with the place sets the scene, and it sounds mysterious." } } }
      ] },

    { type: "mc", topic: "Sentences for effect",
      q: "\"[[List]]\" What is the effect of the long list?",
      options: ["It piles up detail so the reader feels how crowded and busy it is", "It slows the story down because nothing important is happening", "It makes the reader feel calm and relaxed", "It asks the reader a question"],
      answer: 0,
      slips: { 1: "A list can slow things a little, but here the point is how much there is.", 2: "A long pile up of things tends to feel busy, not relaxing.", 3: "There is no question mark. It is a list." },
      hint: "How many things are there? How does that feel?",
      why: "Listing item after item gives the reader the feeling of too much at once: busy, crowded, a bit overwhelming.",
      ez: { q: "\"[[List]]\" This is a list. What does it show?", hint: "Count the things.", why: "<b>A lot</b> of stuff is there.", slips: { 1: "Count them. There are lots.", 2: "Lots of things sounds busy." } },
      lv: { mild: { q: "\"[[List]]\" This is a list. What does it show?",
        options: ["There is a lot of stuff there", "There is nothing there", "It is very quiet"],
        slips: { 1: "Count the things. There are lots.", 2: "A big list of things sounds busy, not quiet." },
        hint: "Count the things in the list.", why: "A long list shows there is a lot of something." } },
      vary: [
        { q: "\"[[Ask]]\" Why might a writer open with a question like this?",
          options: ["It speaks straight to the reader, so they think about their own answer and feel involved", "It shows the writer does not know the answer", "It gives the reader a fact", "It ends the text"],
          answer: 0,
          slips: { 1: "Writers usually know where they are going. The question is for you to think about.", 2: "A question does not give a fact. It asks you something.", 3: "This one opens the text. It is a way in." },
          hint: "Who is the question talking to?",
          why: "A question to the reader (a rhetorical question) makes you answer it in your head. Now you are involved.",
          ez: { q: "\"[[Ask]]\" Why start with a question?", hint: "Who is it asking?", why: "It makes you <b>think</b> of your answer.", slips: { 1: "A question asks. It does not tell.", 2: "Questions wake you up." } },
      lv: { mild: { q: "\"[[Ask]]\" Why start with a question?",
            options: ["It makes you think about your own answer", "It tells you a fact", "It makes you sleepy"],
            slips: { 1: "A question does not tell you a fact. It asks you something.", 2: "Questions tend to wake you up a bit." },
            hint: "Who is it asking?", why: "A question makes you think about your own answer." } } },
        { q: "\"It was cheap, it was quick and it was brilliant fun.\" What is the effect of this list of three?",
          options: ["It sounds complete and memorable, so the point sticks in the reader's head", "It shows there were exactly three things there", "It makes the reader feel scared", "It slows the text down so it feels sad"],
          answer: 0,
          slips: { 1: "Three is a pattern here, not a count of objects.", 2: "Nothing scary here. The pattern makes it sound positive and certain.", 3: "The rhythm is upbeat. It is not sad." },
          hint: "Say it out loud. Why does three feel just right?",
          why: "Lists of three have a strong rhythm. They sound finished and certain, so the reader remembers them.",
          ez: { q: "\"It was cheap, it was quick and it was brilliant fun.\" 3 good things. What does that do?", hint: "Good or bad things?", why: "It sounds <b>really good</b>, and it sticks.", slips: { 1: "All 3 are good things.", 2: "Nothing scary here." } },
      lv: { mild: { q: "\"It was cheap, it was quick and it was brilliant fun.\" This says three good things. What does that do?",
            options: ["Makes it sound really good and easy to remember", "Makes it sound bad", "Makes it sound scary"],
            slips: { 1: "All three things are good things.", 2: "Nothing scary here." },
            hint: "Are the three things good or bad?", why: "Three good things in a row make it sound really good, and the rhythm sticks." } } }
      ] },

    /* ---------- chunk 2: text level ---------- */
    { type: "learn", topic: "Paragraphs and layout", title: "The shape of the whole text",
      fig: PAGE,
      html: "<p>Zoom out from sentences and look at the <b>whole text</b>.</p>" +
        "<p><b>Paragraph length:</b> long paragraphs slow you down and give detail. Paragraphs that get shorter and shorter speed things up. A <b>one line paragraph</b> stands alone, so it stands out: a shock, a turning point, a key idea.</p>" +
        "<p><b>Headings and subheadings</b> tell the reader what each part is about and help them find what they need. <b>Bullet points</b> make information quick to scan.</p>" +
        "<p><b>Order of information:</b> news puts the most important facts first. Stories often hold back key information to keep you reading.</p>",
      ez: { title: "The whole text", html: "<p>A line <b>on its own</b> stands out.</p><p><b>Headings</b> help you find things.</p>" },
      lv: {
        mild: { html: "<p>Now look at the <b>whole text</b>.</p>" +
          "<p>A <b>paragraph on its own line</b> stands out. <b>Headings</b> tell you what each part is about. <b>Bullet points</b> are quick to read.</p>" },
        medium: { html: "<p>Now look at the <b>whole text</b>.</p>" +
          "<p>Long paragraphs slow you down. A <b>one line paragraph</b> stands out. <b>Headings and subheadings</b> help you find things. <b>Bullet points</b> are quick to scan.</p>" +
          "<p>The <b>order</b> matters too: news puts the most important facts first.</p>" } } },

    { type: "mc", topic: "Paragraphs and layout",
      q: "A story has three long paragraphs about [[event]]. Then a paragraph on its own line: \"[[Gone]]\" Why put it on its own line?",
      options: ["Set apart after long paragraphs, it stands out as a shock and makes the reader pause on it", "Because a new person has started speaking", "To fill up space at the bottom of the page", "Because it is the least important sentence"],
      answer: 0,
      slips: { 1: "A new speaker does get a new line, but nobody is speaking here. This is a choice for effect.", 2: "Writers do not leave lines for space. Ask what it does to the reader.", 3: "Usually the opposite: on its own line it gets the spotlight." },
      hint: "Long, long, long... then one line. Where does your eye go?",
      why: "The contrast with the long paragraphs makes the single line jump out. The reader stops on it, so the shock lands.",
      ez: { q: "Long paragraphs, then one line on its own: \"[[Gone]]\" Why?", hint: "Where does your eye go?", why: "So it <b>stands out</b>.", slips: { 1: "It is not just to fill space.", 2: "On its own, it matters more." } },
      lv: { mild: { q: "After some long paragraphs, the writer puts one line on its own: \"[[Gone]]\" Why?",
        options: ["So it stands out", "To fill space", "Because it does not matter"],
        slips: { 1: "Writers do not leave lines just to fill space.", 2: "On its own line, it matters even more." },
        hint: "Where does your eye go?", why: "On its own line, it stands out, so you notice it." } },
      vary: [
        { q: "A leaflet about [[event]] uses subheadings: \"Getting there\", \"What to bring\", \"Staying safe\". What do they do for the reader?",
          options: ["They break the text into clear parts, so the reader can jump straight to what they need", "They make the leaflet feel scary and tense", "They tell the reader the writer's opinion", "They make the leaflet longer and harder to read"],
          answer: 0,
          slips: { 1: "Subheadings in a leaflet are about clarity, not tension.", 2: "These subheadings just label each part. They do not give an opinion.", 3: "They make it easier, not harder: you can skip to the bit you want." },
          hint: "Imagine you only want to know what to bring.",
          why: "Subheadings organise the information. A reader can skim, find \"What to bring\" and go straight there.",
          ez: { q: "A leaflet has subheadings like \"What to bring\". What are they for?", hint: "You want to know what to bring.", why: "To help you <b>find</b> the part you need.", slips: { 1: "Subheadings are signposts.", 2: "They help you find things fast." } },
      lv: { mild: { q: "A leaflet has subheadings like \"Getting there\" and \"What to bring\". What are they for?",
            options: ["To help you find the part you need", "To make it scary", "To make it longer"],
            slips: { 1: "Subheadings are not scary. They are signposts.", 2: "They help you find things quickly." },
            hint: "Imagine you only want to know what to bring.", why: "Subheadings help you find the part you need." } } },
        { q: "In a chase scene, each paragraph is shorter than the one before. By the end they are one line each. What is the effect?",
          options: ["The pace speeds up, so the reader feels the chase getting faster and more desperate", "The reader gets more and more detail about the setting", "It shows the writer was running out of time", "The story slows down and becomes calm"],
          answer: 0,
          slips: { 1: "Shorter paragraphs give less detail, not more. They are about speed.", 2: "It is a deliberate choice. Ask what it does to the reader.", 3: "Shorter and shorter speeds up, it does not calm down." },
          hint: "What happens to your reading speed as the paragraphs shrink?",
          why: "Shrinking paragraphs make you read faster and faster, so the structure feels like the chase itself.",
          ez: { q: "In a chase, the paragraphs get shorter. How does it feel?", hint: "Short bits: fast or slow?", why: "<b>Faster</b>. Short bits feel quick.", slips: { 1: "Shorter bits make you read faster.", 2: "Shorter bits wake you up." } },
      lv: { mild: { q: "In a chase, the paragraphs get shorter and shorter. How does that feel?",
            options: ["Faster and faster", "Slower and calmer", "Sleepy"],
            slips: { 1: "Shorter paragraphs make you read faster.", 2: "Shorter paragraphs wake you up." },
            hint: "Do you read short bits fast or slow?", why: "Short paragraphs feel fast, so the chase feels faster." } } }
      ] },

    { type: "sort", topic: "Paragraphs and layout",
      q: "Sort them: is it a <b>sentence level</b> feature or a <b>text level</b> feature?",
      buckets: ["Sentence level", "Text level (the whole text)"],
      cards: [["Short sentences", 0], ["A rhetorical question", 0], ["A list", 0], ["A sentence opener", 0], ["Headings and subheadings", 1], ["A one line paragraph", 1], ["Bullet points", 1], ["The order of the paragraphs", 1]],
      slips: { any: "Ask: does it happen inside one sentence, or does it shape the whole text?" },
      hint: "Inside one sentence, or across the whole page?",
      why: "Sentence level is the shape of a sentence. Text level is how the whole thing is organised.",
      ez: { hint: "One sentence, or the whole page?", why: "Some sit in 1 sentence. Some shape the page.", slips: { any: "Is it in 1 sentence, or the whole page?" } },
      lv: { mild: { q: "Sort them: inside a <b>sentence</b>, or the <b>whole text</b>?", buckets: ["Inside a sentence", "The whole text"], cards: [["Short sentences", 0], ["A list", 0], ["Headings", 1], ["Bullet points", 1]] } },
      vary: [
        { cards: [["\"Silence.\"", 0], ["\"Without warning,\" at the start", 0], ["\"Have you ever...?\"", 0], ["Lots of items with commas", 0], ["A big bold title", 1], ["The ending links back to the opening", 1], ["The most important facts come first", 1], ["Paragraphs get shorter and shorter", 1]],
          ez: { hint: "One sentence, or the whole page?", why: "Some sit in 1 sentence. Some shape the page.", slips: { any: "Is it in 1 sentence, or the whole page?" } },
      lv: { mild: { q: "Sort them: inside a <b>sentence</b>, or the <b>whole text</b>?", buckets: ["Inside a sentence", "The whole text"], cards: [["\"Silence.\"", 0], ["\"Have you ever...?\"", 0], ["A big bold title", 1], ["Bullet points down the side", 1]] } } },
        { cards: [["A long, flowing sentence", 0], ["A list of three", 0], ["Starting with \"Slowly,\"", 0], ["A one word sentence", 0], ["A flashback to years before", 1], ["A cliffhanger ending", 1], ["A paragraph on its own line", 1], ["A subheading", 1]],
          ez: { hint: "One sentence, or the whole page?", why: "Some sit in 1 sentence. Some shape the page.", slips: { any: "Is it in 1 sentence, or the whole page?" } },
      lv: { mild: { q: "Sort them: inside a <b>sentence</b>, or the <b>whole text</b>?", buckets: ["Inside a sentence", "The whole text"], cards: [["A long sentence", 0], ["A one word sentence", 0], ["A subheading", 1], ["A paragraph on its own line", 1]] } } }
      ] },

    { type: "order", topic: "Paragraphs and layout",
      q: "A news report puts the most important information first. Put these parts in the usual order.",
      items: ["Headline: the big news in a few words", "First paragraph: who, what, where, when", "More detail about what happened", "A quote from someone who was there", "Background, and what happens next"],
      slips: { any: "News starts with the biggest facts and saves the background for the end." },
      hint: "What would a reader who only reads the start need?",
      why: "Many people only read the top of a news story, so the key facts go first and the extra detail comes later.",
      ez: { q: "Put the news report in order.", hint: "Big news first.", why: "Headline first. What happens next goes last.", slips: { any: "The big news comes first." } },
      lv: { mild: { q: "Put these parts of a news report in order.", items: ["Headline", "What happened", "What happens next"] } },
      vary: [
        { q: "Put these parts of a story in the usual order.",
          items: ["Opening: meet [[who]] and the setting", "A problem appears", "Things get worse", "The climax: the most tense moment", "Ending: how it all turns out"],
          slips: { any: "The most tense moment usually comes near the end, not the start." },
          hint: "Calm, then trouble, then worse, then the big moment.",
          why: "Building up from calm to the climax keeps the tension rising, so the reader keeps going.",
          ez: { q: "Put the story in order.", hint: "Calm, then trouble, then sorted.", why: "Meet them. A problem. Then it is sorted.", slips: { any: "The problem comes before it is sorted." } },
      lv: { mild: { q: "Put these parts of a story in order.", items: ["Meet [[who]]", "A problem happens", "The problem is sorted"] } } },
        { q: "Put these parts of a persuasive leaflet in the order that works best.",
          items: ["An eye catching headline", "The problem", "The solution", "Evidence that it works", "What to do now: sign up today"],
          slips: { any: "Grab attention first, and tell the reader what to do at the very end, when they are convinced." },
          hint: "Grab them, worry them, fix it, prove it, then ask.",
          why: "The order leads the reader step by step from interested to convinced, then tells them what to do while they feel it.",
          ez: { q: "Put the leaflet in order.", hint: "Grab them first.", why: "Grab them. Give the facts. Say what to do.", slips: { any: "What to do comes last." } },
      lv: { mild: { q: "Put these parts of a leaflet in order.", items: ["A headline to grab you", "The facts", "What to do now"] } } }
      ] },

    /* ---------- chunk 3: openings, endings and repetition ---------- */
    { type: "learn", topic: "Openings, endings and repeats", title: "Where it starts, where it ends, what comes back",
      fig: LOOP,
      html: "<p><b>Openings:</b> starting in the middle of the action drops you straight in and makes you ask questions. Starting with a question or a mystery makes you curious.</p>" +
        "<p><b>Endings:</b> a <b>cliffhanger</b> leaves you in suspense. A <b>circular</b> ending comes back to the opening, so the text feels complete and you notice what has changed. A <b>call to action</b> tells the reader what to do next.</p>" +
        "<p><b>Repetition:</b> a word, phrase or object that comes back again and again sticks in your head and shows it matters.</p>" +
        "<p>Watch for <b>shifts</b> too: a jump back in time (flashback), or zooming from a wide view to one small detail.</p>",
      ez: { title: "Starts and ends", html: "<p>Start in the <b>action</b> to grab them.</p><p>A <b>cliffhanger</b> leaves them wanting more.</p>" },
      lv: {
        mild: { html: "<p>How a text <b>starts</b> and <b>ends</b> is a choice too.</p>" +
          "<p>Starting in the <b>middle of the action</b> grabs you. A <b>cliffhanger</b> ending leaves you wanting more.</p>" +
          "<p>Saying something <b>again and again</b> makes it stick.</p>" },
        medium: { html: "<p><b>Openings:</b> starting in the middle of the action grabs you. A question or a mystery makes you curious.</p>" +
          "<p><b>Endings:</b> a <b>cliffhanger</b> leaves you in suspense. A <b>circular</b> ending comes back to the opening and feels complete.</p>" +
          "<p><b>Repetition:</b> saying something again and again makes it stick and shows it matters.</p>" } } },

    { type: "mc", topic: "Openings, endings and repeats",
      q: "A story opens with: \"[[Open]]\" What is the effect of starting like this?",
      options: ["It drops the reader straight into the action, so they ask questions and want to find out what is going on", "It explains the setting clearly before anything happens", "It tells the reader how the story will end", "It makes the opening slow and relaxing"],
      answer: 0,
      slips: { 1: "Nothing is explained yet. That is the point: you are dropped in.", 2: "It gives nothing away about the ending.", 3: "Sudden and short is the opposite of slow and relaxing." },
      hint: "What do you know? What do you want to know?",
      why: "Starting in the middle of the action hooks you. You do not know who, where or why, so you read on to find out.",
      ez: { q: "A story starts: \"[[Open]]\" How does it feel?", hint: "Do you know what is going on?", why: "You <b>want to know</b> what is going on.", slips: { 1: "A sudden start wakes you up.", 2: "It gives nothing away yet." } },
      lv: { mild: { q: "A story starts: \"[[Open]]\" How does this start make you feel?",
        options: ["I want to know what is going on", "Sleepy", "I already know the ending"],
        slips: { 1: "A sudden start tends to wake you up.", 2: "It gives nothing away. That is why you want to know more." },
        hint: "Do you know what is going on yet?", why: "Starting in the action makes you want to find out what is going on." } },
      vary: [
        { q: "A story starts and ends with [[thing]] on a shelf. At the start it is shiny. At the end it is covered in dust. What does this circular structure do?",
          options: ["It makes the story feel complete, and shows the reader how much has changed", "It shows the writer could not think of a new ending", "It leaves the reader on a cliffhanger", "It makes the story feel rushed"],
          answer: 0,
          slips: { 1: "Coming back to the start is a deliberate choice. Look at what is different.", 2: "A cliffhanger leaves things open. This one closes the loop.", 3: "Returning to the start tends to feel finished, not rushed." },
          hint: "Same object, start and end. What is different about it?",
          why: "Returning to the opening closes the loop. The dust makes you notice how much time has passed and what has changed.",
          ez: { q: "A story starts and ends with [[thing]]. Why?", hint: "Think of a loop.", why: "It feels <b>finished</b>, like a loop.", slips: { 1: "It is on purpose.", 2: "A loop feels finished." } },
      lv: { mild: { q: "A story starts and ends with [[thing]]. Why go back to the start?",
            options: ["It makes the story feel finished", "It is a mistake", "It makes it scary"],
            slips: { 1: "It is on purpose.", 2: "Going back to the start feels finished, more than scary." },
            hint: "Think of a loop.", why: "Going back to the start makes it feel finished, like a loop." } } },
        { q: "A chapter ends: \"[[Cliff]]\" What is the effect of ending here?",
          options: ["It leaves the reader in suspense, desperate to read the next chapter", "It answers all the questions so the reader feels calm", "It sums up the whole chapter", "It goes back to the opening"],
          answer: 0,
          slips: { 1: "Nothing is answered: that is what makes it a cliffhanger.", 2: "It is a new event, not a summary.", 3: "That would be a circular ending. This one leaves things hanging." },
          hint: "Do you know what happens next?",
          why: "A cliffhanger stops just before you find out. The suspense pulls you on to the next part.",
          ez: { q: "A chapter ends: \"[[Cliff]]\" How does it feel?", hint: "What happens next?", why: "You <b>want to read on</b>. It is a cliffhanger.", slips: { 1: "Nothing is sorted yet.", 2: "Most people turn the page here." } },
      lv: { mild: { q: "A chapter ends: \"[[Cliff]]\" How does it make you feel?",
            options: ["I want to know what happens next", "Everything is sorted", "Bored"],
            slips: { 1: "Nothing is sorted yet.", 2: "Most people want to turn the page here." },
            hint: "Do you know what happens next?", why: "It stops just before you find out, so you want to read on. That is a cliffhanger." } } }
      ] },

    { type: "mc", topic: "Openings, endings and repeats",
      q: "\"[[Rep]]\" What is the effect of repeating \"Wrong\"?",
      options: ["It hammers the word home, so the reader feels everything going badly at once", "It shows the writer only knows one word", "It makes the moment feel calm and peaceful", "It tells the reader the exact time"],
      answer: 0,
      slips: { 1: "Repetition is a choice. Ask why the writer keeps coming back to it.", 2: "Repeating a negative word over and over does not feel calm.", 3: "There is no time given here." },
      hint: "Read it aloud. What does the repeated word do?",
      why: "Each repeat hits like a drumbeat. The pattern makes the reader feel the mistakes piling up.",
      ez: { q: "\"[[Rep]]\" Wrong comes again and again. What does that do?", hint: "Read it out loud.", why: "It <b>sticks</b>. It all feels bad.", slips: { 1: "Wrong, wrong, wrong is not calm.", 2: "Writers repeat words on purpose." } },
      lv: { mild: { q: "\"[[Rep]]\" The word \"Wrong\" comes again and again. What does that do?",
        options: ["Makes it stick, so you feel it is all going badly", "Makes it calm", "Nothing at all"],
        slips: { 1: "Wrong, wrong, wrong does not feel calm.", 2: "Writers repeat words on purpose." },
        hint: "Read it out loud.", why: "Saying it again and again makes it stick." } },
      vary: [
        { q: "A clock is mentioned at the start, in the middle and at the end of a story. Each time it is closer to midnight. Why keep bringing it back?",
          options: ["It reminds the reader that time is running out, so the tension keeps building", "It shows the story is set in a clock shop", "It is there so the reader can learn to tell the time", "It slows the story down and makes it relaxing"],
          answer: 0,
          slips: { 1: "It could be, but the writer is using it for more than the setting. Midnight is getting closer.", 2: "The clock is a signal to the reader, not a lesson.", 3: "Time running out is the opposite of relaxing." },
          hint: "What is getting closer each time?",
          why: "A repeated detail that changes each time works like a countdown. The reader feels the pressure build.",
          ez: { q: "A clock keeps coming back, nearer midnight each time. Why?", hint: "What is getting closer?", why: "<b>Time is running out</b>. It feels tense.", slips: { 1: "It is a signal, not a lesson.", 2: "Running out of time is not calm." } },
      lv: { mild: { q: "A clock keeps coming back in a story, closer to midnight each time. Why?",
            options: ["To show time is running out", "To teach you to tell the time", "To make it calm"],
            slips: { 1: "It is a signal in the story, not a lesson.", 2: "Running out of time is not calm." },
            hint: "What is getting closer?", why: "It shows time running out, so it feels more and more tense." } } },
        { q: "In a speech, every paragraph starts with \"We can\". What is the effect of the repeated opener?",
          options: ["It builds a strong rhythm and makes the speaker sound confident, so the audience feels united", "It shows the speaker is lost and confused", "It makes the speech feel scary", "It hides the speaker's main point"],
          answer: 0,
          slips: { 1: "Repeating it on purpose sounds certain, not lost.", 2: "\"We can\" is hopeful, not scary.", 3: "Repeating it puts the main point right at the front, again and again." },
          hint: "How would a crowd feel hearing \"We can\" again and again?",
          why: "Repeated openers create a rhythm. \"We\" includes the audience, and repeating it makes everyone feel part of it.",
          ez: { q: "A speech keeps saying \"We can\". How does it sound?", hint: "Say \"We can\" 3 times.", why: "<b>Strong and hopeful</b>.", slips: { 1: "Saying it on purpose sounds sure.", 2: "\"We can\" is hopeful." } },
      lv: { mild: { q: "A speech keeps saying \"We can\" at the start of each part. How does that sound?",
            options: ["Strong and hopeful", "Lost and confused", "Scary"],
            slips: { 1: "Saying it on purpose sounds sure, not lost.", 2: "\"We can\" is hopeful." },
            hint: "Say \"We can\" three times, loudly.", why: "Saying it again and again sounds strong and hopeful." } } }
      ] },

    { type: "multi", topic: "Openings, endings and repeats",
      q: "Structure is how a text is built. Pick <b>all</b> the structural features.",
      options: ["A one line paragraph", "A cliffhanger ending", "A flashback to years before", "A simile, like \"as cold as ice\"", "Alliteration, like \"silent shadows slid\"", "A circular ending"],
      answers: [0, 1, 2, 5],
      slips: { any: "Similes and alliteration are about word choice (language). Structure is about shape, order and position." },
      hint: "Is it about which words, or about where things go and in what order?",
      why: "One line paragraphs, cliffhangers, flashbacks and circular endings are all about shape and order. Similes and alliteration are language features.",
      ez: { q: "Pick <b>2</b> about how the text is built.", hint: "Which words, or where things go?", why: "Own line and cliffhanger are shape. Spooky is a word.", slips: { any: "A describing word is word choice." } },
      lv: { mild: { q: "Pick the <b>two</b> features about how a text is built.", options: ["A paragraph on its own line", "A cliffhanger ending", "A describing word, like \"spooky\""], answers: [0, 1],
        slips: { any: "A describing word is about word choice. The other two are about how the text is built." },
        why: "A paragraph on its own line and a cliffhanger ending are about how the text is built. A describing word is word choice." } },
      vary: [
        { options: ["Short sentences", "The most important facts first", "Paragraphs that get shorter", "A metaphor, like \"the room was a fridge\"", "Onomatopoeia, like \"crash\"", "A repeated opener"],
          answers: [0, 1, 2, 5],
          why: "Sentence length, the order of facts, paragraph length and repeated openers are structure. Metaphor and onomatopoeia are about the words.",
          ez: { q: "Pick <b>2</b> about how the text is built.", hint: "Which words, or where things go?", why: "Short sentences and headings are shape. Crash is a word.", slips: { any: "A sound word is word choice." } },
      lv: { mild: { q: "Pick the <b>two</b> features about how a text is built.", options: ["Short sentences", "Headings", "A sound word, like \"crash\""], answers: [0, 1],
            slips: { any: "A sound word is about word choice. Short sentences and headings are about how the text is built." },
            why: "Short sentences and headings are about how it is built. \"Crash\" is word choice." } } },
        { options: ["Opening in the middle of the action", "Subheadings", "Zooming in from a wide view to one detail", "A powerful verb, like \"smashed\"", "Personification, like \"the wind howled\"", "Ending with a call to action"],
          answers: [0, 1, 2, 5],
          why: "Where it opens, how it is divided, where the focus moves and how it ends are structure. Verbs and personification are language.",
          ez: { q: "Pick <b>2</b> about how the text is built.", hint: "Which words, or where things go?", why: "Starting in the action and subheadings are shape.", slips: { any: "A strong word is word choice." } },
      lv: { mild: { q: "Pick the <b>two</b> features about how a text is built.", options: ["Starting in the middle of the action", "Subheadings", "A strong word, like \"smashed\""], answers: [0, 1],
            slips: { any: "A strong word is about word choice. The other two are about how the text is built." },
            why: "Starting in the action and subheadings are about how it is built. \"Smashed\" is word choice." } } }
      ] },

    /* ---------- chunk 4: feature, then effect ---------- */
    { type: "learn", topic: "Feature, then effect", title: "Say it like an architect",
      fig: NSE,
      html: "<p>Here is a full comment, built in three parts.</p>" +
        "<p class=\"a2task\"><b>1 Name it:</b> The writer uses a series of short sentences.<br><b>2 Show it:</b> \"[[Tense]]\"<br><b>3 Effect:</b> This speeds up the pace, so the reader feels each moment land one after another. It builds tension <b>because</b> we sense something is about to go wrong.</p>" +
        "<p>Watch out for comments that would fit any text, like \"it makes it interesting\" or \"it makes you want to read on\". Say <b>what</b> the reader feels and <b>why here</b>.</p>" +
        "<p>Next you fill in a missing part, then you try a whole one. Have a go whenever you are ready.</p>",
      ez: { title: "Name it, show it, say it", html: "<p><b>Name it</b>. <b>Show it</b>. Say how it <b>feels</b>.</p><p class=\"a2task\">Short sentences. \"[[Tense]]\" It feels tense.</p>" },
      lv: {
        mild: { html: "<p>Here is a comment in three parts.</p>" +
          "<p class=\"a2task\"><b>1 Name it:</b> short sentences.<br><b>2 Show it:</b> \"[[Tense]]\"<br><b>3 Effect:</b> This makes the reader feel tense.</p>" +
          "<p>Next you fill in one part. Then try a whole one.</p>" },
        medium: { html: "<p>Here is a full comment in three parts.</p>" +
          "<p class=\"a2task\"><b>1 Name it:</b> The writer uses short sentences.<br><b>2 Show it:</b> \"[[Tense]]\"<br><b>3 Effect:</b> This speeds up the pace and makes the reader feel tense.</p>" +
          "<p>Try to say a feeling, not just \"it makes it interesting\". Next you fill in a missing part, then try a whole one.</p>" } } },

    { type: "text", topic: "Feature, then effect",
      q: "Parts 1 and 2 are done. Have a go at part 3, the effect.<br><b>1</b> The writer uses short sentences. <b>2</b> \"[[Tense]]\" <b>3</b> This...",
      need: [["tens", "suspens", "nerv", "fast", "quick", "pace", "speed", "drama", "worr", "scar", "fear", "edge", "anxi", "panic", "sudden", "rush", "jump"]],
      slips: [[["interesting", "read on", "good", "better"], "That could fit any text. Name the feeling, like tense, or what happens to the pace."]],
      model: "This speeds up the pace and builds tension, so the reader feels on edge.",
      hint: "Is it fast or slow? Calm or tense?",
      why: "Short sentences speed up the pace and build tension. Saying the feeling, and why, is what makes a comment strong.",
      ez: { q: "Finish it.<br>Short sentences: \"[[Tense]]\" This makes the reader feel...", hint: "Fast or slow? Calm or tense?", why: "Short sentences feel <b>tense</b>.", slips: [[null, "Try a feeling word, like tense."]] },
      lv: { mild: { q: "Finish the comment.<br>The writer uses short sentences: \"[[Tense]]\" This makes the reader feel...", model: "This makes the reader feel tense and nervous." } },
      vary: [
        { q: "Parts 1 and 2 are done. Have a go at part 3, the effect.<br><b>1</b> The writer opens with a question to the reader. <b>2</b> \"[[Ask]]\" <b>3</b> This...",
          need: [["think", "wonder", "involv", "curio", "imagin", "engag", "personal", "agree", "answer", "connect", "relate", "draw", "pull", "own"]],
          slips: [[["interesting", "read on", "good", "better"], "That could fit any text. Say what the question makes the reader do in their head."]],
          model: "This makes the reader think about their own answer, so they feel involved straight away.",
          hint: "What do you do in your head when someone asks you a question?",
          why: "A question pulls the reader in: they answer it in their head, so they are involved from the first line.",
          ez: { q: "Finish it.<br>A question: \"[[Ask]]\" This makes the reader...", hint: "What do you do when asked?", why: "A question makes the reader <b>think</b>.", slips: [[null, "Say what the reader does in their head."]] },
      lv: { mild: { q: "Finish the comment.<br>The writer starts with a question: \"[[Ask]]\" This makes the reader...", model: "This makes the reader think about it." } } },
        { q: "Parts 1 and 2 are done. Have a go at part 3, the effect.<br><b>1</b> The writer ends the chapter on a cliffhanger. <b>2</b> \"[[Cliff]]\" <b>3</b> This...",
          need: [["suspens", "want", "wonder", "curio", "next", "hang", "tens", "guess", "find out", "desperat", "keen", "unsure", "worr", "nerv"]],
          slips: [[["interesting", "good", "better"], "That could fit any text. Say what the reader feels when the chapter stops right there."]],
          model: "This leaves the reader in suspense, desperate to find out what happens next.",
          hint: "How do you feel when a chapter stops right there?",
          why: "A cliffhanger stops before the answer. The suspense makes the reader want the next chapter.",
          ez: { q: "Finish it.<br>The chapter ends: \"[[Cliff]]\" This makes the reader...", hint: "How do you feel here?", why: "A cliffhanger makes you <b>want more</b>.", slips: [[null, "Say how the reader feels here."]] },
      lv: { mild: { q: "Finish the comment.<br>The chapter ends: \"[[Cliff]]\" This makes the reader...", model: "This makes the reader want to know what happens next." } } }
      ] },

    { type: "text", topic: "Feature, then effect",
      q: "Now parts 1 and 3. After three long paragraphs, the writer puts this on its own line: \"[[Gone]]\" Name the feature <b>and</b> say its effect.",
      need: [["line", "paragraph", "on its own", "alone", "single", "short", "by itself"], ["shock", "stand", "emphas", "drama", "notice", "focus", "surpris", "impact", "attention", "importan", "tens", "sudden", "pause", "stop", "spotlight", "highlight"]],
      slips: [[["interesting", "read on"], "Good start. Now be precise: what does standing alone make the reader notice or feel?"]],
      model: "The writer uses a one line paragraph. It stands out after the long paragraphs, so the reader stops and feels the shock.",
      hint: "Part 1: what is special about how it is laid out? Part 3: what does it make you notice?",
      why: "A one line paragraph after long ones grabs the spotlight. The reader pauses, so the moment hits hard.",
      ez: { q: "This line is on its own: \"[[Gone]]\" Finish: \"It is on its own line, so it...\"", hint: "What does it make you notice?", why: "On its own, it <b>stands out</b>.", slips: [[null, "What does being alone make you notice?"]] },
      lv: { mild: { q: "This line is on its own: \"[[Gone]]\" Finish: \"It is on its own line, so it...\"",
        need: [["stand", "notice", "shock", "surpris", "importan", "see", "big", "attention", "out", "matter"]],
        model: "It is on its own line, so it stands out." } },
      vary: [
        { q: "Now parts 1 and 3. \"[[List]]\" Name the feature <b>and</b> say its effect.",
          need: [["list"], ["lot", "much", "busy", "many", "overwhelm", "build", "pile", "detail", "amount", "crowd", "variety", "everything", "full", "chaos", "messy", "packed"]],
          slips: [[["interesting", "read on"], "Good start. Now be precise: what does all that piling up make the reader feel?"]],
          model: "The writer uses a long list. It piles up detail, so the reader feels how busy and crowded it is.",
          hint: "Part 1: lots of commas. Part 3: how much is there?",
          why: "A list piles thing on thing. The reader feels the amount: busy, crowded, a bit too much.",
          ez: { hint: "How much stuff is there?", why: "A list shows <b>a lot</b> of stuff.", slips: [[null, "How much is there? Say that."]] },
      lv: { mild: { q: "\"[[List]]\" Finish: \"It is a list, so it shows...\"",
            need: [["lot", "much", "busy", "many", "loads", "full", "everything", "crowd"]],
            model: "It is a list, so it shows there is a lot of stuff." } } },
        { q: "Now parts 1 and 3. \"[[Rep]]\" Name the feature <b>and</b> say its effect.",
          need: [["repeat", "repetition", "same", "again", "pattern"], ["emphas", "stand", "rhythm", "remember", "memor", "build", "stress", "tens", "notice", "drama", "importan", "stick", "pile", "frustrat", "bad", "hammer", "beat"]],
          slips: [[["interesting", "read on"], "Good start. Now be precise: what does hearing it again and again do to the reader?"]],
          model: "The writer uses repetition of \"Wrong\". It builds a rhythm, so the reader feels the mistakes piling up.",
          hint: "Part 1: which word keeps coming back? Part 3: what does that drumbeat do?",
          why: "Repetition makes a word stick. Here it hammers home that everything is going wrong.",
          ez: { hint: "Which word keeps coming back?", why: "Saying it again makes it <b>stick</b>.", slips: [[null, "What does hearing it again do?"]] },
      lv: { mild: { q: "\"[[Rep]]\" Finish: \"The word Wrong is repeated, so it...\"",
            need: [["stick", "stand", "remember", "notice", "bad", "importan", "strong", "wrong", "worse"]],
            model: "The word Wrong is repeated, so it sticks in your head." } } }
      ] },

    { type: "mc", topic: "Feature, then effect", explain: true,
      q: "Which comment on \"[[Tense]]\" is the strongest?",
      options: ["The short sentences speed up the pace so the reader feels each beat, building tension because it seems something is about to go wrong.", "The writer uses short sentences.", "The short sentences make it interesting and make you want to read on.", "Something scary happens and the character is in danger."],
      answer: 0,
      slips: { 1: "That names the feature, but stops there. Add what it does to the reader.", 2: "\"Interesting\" and \"read on\" could be said about any text. Name the feeling and why.", 3: "That retells what happens. A structure comment talks about how it is built." },
      hint: "Look for one that names it, says the effect, and says why.",
      why: "The strongest comment names the feature, says the precise effect on the reader, and explains why it works at this moment.",
      ez: { hint: "Find a feature and a feeling.", why: "It says short sentences, and tense.", slips: { 1: "True, but no feeling.", 2: "Good how? Say a feeling." } },
      lv: { mild: { q: "Which comment on \"[[Tense]]\" is best?",
        options: ["The short sentences make me feel tense.", "There are some sentences.", "It is good."],
        slips: { 1: "True, but it does not say the feature or the feeling.", 2: "Good how? Try saying a feeling." },
        hint: "Find the one that says a feature and a feeling.", why: "It names the feature (short sentences) and the feeling (tense)." } },
      vary: [
        { q: "Which comment on the one line paragraph \"[[Gone]]\" is the strongest?",
          options: ["Placed alone after long paragraphs, the line stands out, forcing the reader to pause so the shock really lands.", "There is a one line paragraph.", "The one line paragraph makes it more exciting.", "Something has gone missing, which is bad."],
          answer: 0,
          slips: { 1: "That spots the feature, then stops. What does it do?", 2: "\"More exciting\" is vague. What exactly does the reader do or feel?", 3: "That is what happens, not how it is built." },
          hint: "Name it, effect, why here.",
          why: "It names the feature, says what the reader does (pauses) and feels (shock), and why it works after long paragraphs.",
          ez: { q: "\"[[Gone]]\" is on its own line. Which comment is best?", hint: "Which says what it does?", why: "It says what it does: it <b>stands out</b>.", slips: { 1: "True, but what does it do?", 2: "Nice how? Say what it does." } },
      lv: { mild: { q: "Which comment on \"[[Gone]]\" (on its own line) is best?",
            options: ["It is on its own line, so it stands out and feels like a shock.", "It is a line.", "It is nice."],
            slips: { 1: "True, but say what it does.", 2: "Nice how? Say what it does." },
            hint: "Find the one that says what it does.", why: "It says the feature and what it does: it stands out like a shock." } } },
        { q: "Which comment on the cliffhanger \"[[Cliff]]\" is the strongest?",
          options: ["Ending the chapter just before the answer leaves the reader in suspense, so they feel they have to read the next chapter.", "The chapter ends with a cliffhanger.", "The ending is really good and interesting.", "Then something else happens at the end."],
          answer: 0,
          slips: { 1: "That names it, but does not say what it does.", 2: "\"Good and interesting\" fits anything. Name the feeling.", 3: "That retells the plot. Talk about why it ends there." },
          hint: "Name it, effect, why here.",
          why: "It says what the structure is, what the reader feels (suspense), and why (the answer is held back).",
          ez: { hint: "Find the one with a feeling.", why: "It names the cliffhanger and a feeling.", slips: { 1: "True, but how does it feel?", 2: "Good how? Say a feeling." } },
      lv: { mild: { q: "Which comment on \"[[Cliff]]\" is best?",
            options: ["It is a cliffhanger, so I want to know what happens next.", "It is the end.", "It is good."],
            slips: { 1: "True, but say how it makes you feel.", 2: "Good how? Say how it makes you feel." },
            hint: "Find the one with a feeling in it.", why: "It names the cliffhanger and how it makes you feel." } } }
      ] },

    { type: "text", topic: "Feature, then effect", stretch: true,
      q: "All three parts, if you fancy it. \"[[Open]]\" is the first line of a story. Write a comment: name the feature, and say its effect on the reader.",
      need: [["open", "start", "first", "begin", "middle", "action", "short", "sentence"], ["question", "wonder", "curio", "want", "know", "hook", "grab", "drop", "straight", "tens", "sudden", "attention", "confus", "urgent", "panic", "excit", "drama", "thrown"]],
      slips: [[["interesting", "read on"], "Nearly. Be precise: what does the reader not know yet, and how does that feel?"]],
      model: "The writer opens in the middle of the action with a short sentence. It drops the reader straight in, so they want to know what is going on.",
      hint: "Feature: where does it start? Effect: what questions pop into your head?",
      why: "Opening in the middle of the action hooks the reader: they have questions straight away, so they keep reading.",
      ez: { q: "If you like: \"[[Open]]\" starts a story. Finish: \"It starts in the action, so the reader...\"", hint: "What do you want to know?", why: "Starting in the action makes you <b>want to know</b> more.", slips: [[null, "What does the reader not know yet?"]] },
      lv: { mild: { q: "If you fancy it: \"[[Open]]\" is how a story starts. Finish: \"It starts in the action, so the reader...\"",
        need: [["want", "know", "wonder", "excit", "grab", "hook", "tens", "curio", "ask", "question"]],
        model: "It starts in the action, so the reader wants to know what is going on." } } }
  ],

  ez: {
    realWorld: { title: "Built for effect", html: "<p>Trailers, news and adverts are all <b>built for effect</b>.</p><p>Writing home from the past? Dinosaur first!</p>" },
    make: { intro: "Pick 1 feature. Say what it does to the reader." }
  },

  realWorld: {
    title: "Structure is everywhere",
    html: "<p>Film trailers cut faster and faster, then go black on one line. News websites put the biggest fact in the headline. Adverts end with \"Book now\". Posts online use one line paragraphs so every line stands out. All of it is built for effect.</p>" +
      "<p>For our big question: if you could time travel and wrote home about it, what would you put first? The dinosaur, or the weather? And would you end on a cliffhanger, so they beg you to go back?</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay by the time portal holding a postcard">' + A.portal(76, 75, 56) + A.jay(240, 60, 0.85, "wow") +
      A.bubble(286, 8, 126, 52, "Dinosaur first.\nObviously.", 290) + '</svg>'
  },

  make: {
    title: "Make a feature card",
    intro: "One structural feature, an example, and what it does to the reader. Keep it as a revision card, stick it on the wall, or send it to Jay.",
    fields: [
      { id: "feature", label: "The feature", ph: "A one line paragraph", max: 34 },
      { id: "quote", label: "An example", ph: "The portal was gone.", max: 60 },
      { id: "effect", label: "What it does to the reader", ph: "It stands out, so the reader stops and feels the shock.", max: 90 },
      { id: "name", label: "Architect", ph: "B5", max: 24 }
    ],
    svg: function(v){
      var grid = ""; for(var x = 24; x < 600; x += 24) grid += '<path d="M' + x + ' 0v400" stroke="#ffffff" stroke-opacity=".07"/>'; for(var y = 24; y < 400; y += 24) grid += '<path d="M0 ' + y + 'h600" stroke="#ffffff" stroke-opacity=".07"/>';
      var q = wrap('"' + (v.quote || "") + '"', 40, 2), ef = wrap(v.effect, 40, 3);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#1d4e89"/>' + grid +
        '<rect x="16" y="16" width="568" height="368" rx="18" fill="none" stroke="#ffffff" stroke-width="3" stroke-dasharray="12 8"/>' +
        T(40, 64, "BUILT FOR EFFECT", 24, { b: 1, c: "#ffd23f" }) +
        T(40, 104, "FEATURE", 13, { b: 1, c: "#9cc4ef" }) + T(40, 132, esc(wrap(v.feature, 34, 1)[0] || ""), 24, { b: 1, c: "#ffffff" }) +
        T(40, 170, "EXAMPLE", 13, { b: 1, c: "#9cc4ef" }) + q.map(function(l, k){ return T(40, 194 + k * 24, esc(l), 17, { c: "#ffffff" }); }).join("") +
        T(40, 258, "EFFECT ON THE READER", 13, { b: 1, c: "#9cc4ef" }) + ef.map(function(l, k){ return T(40, 284 + k * 24, esc(l), 17, { b: 1, c: "#ffffff" }); }).join("") +
        T(40, 364, "Architect: " + esc(wrap(v.name, 24, 1)[0] || ""), 15, { c: "#ffd23f" }) +
        '<g transform="translate(520 300)"><path d="M-36 30L0 -26L36 30z" fill="none" stroke="#ffd23f" stroke-width="4" stroke-linejoin="round"/><path d="M0 -26v56M-18 2h36" stroke="#ffd23f" stroke-width="2.5"/></g>' +
        A.bird(536, 56, 0.7, "#ffd23f") +
        '</svg>';
    }
  }
};
})();
