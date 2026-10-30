/* Base 5 Autumn 2 activity: Says who?
   English. How you know a fact is a fact, and the clue words that
   give an opinion away. ASCII only. */
(function(){
var A = window.A2ART;
var FF = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, size, txt, col, extra){ return '<text x="' + x + '" y="' + y + '" ' + FF + ' font-size="' + size + '" fill="' + (col || "#141a33") + '"' + (extra || "") + '>' + txt + '</text>'; }
var B = ' font-weight="700"', MID = ' text-anchor="middle"';

/* "It is a fact because I could ___ it" with four tiles */
var HOW =
  '<svg viewBox="0 0 520 210" role="img" aria-label="It is a fact because I could count it, measure it, look it up or see it">' +
  '<rect width="520" height="210" rx="16" fill="#f4f1ea"/>' +
  '<rect x="20" y="16" width="480" height="46" rx="23" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
  T(260, 46, 17, 'It is a fact because I could ...', "#141a33", B + MID) +
  [["count it", "#ffd23f"], ["measure it", "#22b8e6"], ["look it up", "#19c39a"], ["see it", "#ff5d8f"]].map(function(c, k){
    var x = 20 + k * 122;
    return '<path d="M260 62L' + (x + 54) + ' 96" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
      '<rect x="' + x + '" y="96" width="108" height="92" rx="14" fill="' + c[1] + '" fill-opacity=".4" stroke="#141a33" stroke-width="2.5"/>' +
      T(x + 54, 150, 15, c[0], "#141a33", B + MID);
  }).join("") + '</svg>';

/* opinion clue words floating round a magnifying glass */
var CLUES =
  '<svg viewBox="0 0 520 220" role="img" aria-label="Opinion clue words: I think, best, should, amazing, worst, I feel">' +
  '<rect width="520" height="220" rx="16" fill="#fff4f7"/>' +
  [["I think", 70, 50], ["best", 210, 40], ["should", 380, 48], ["amazing", 90, 170], ["worst", 250, 186], ["I feel", 420, 168]].map(function(w){
    var wd = w[0].length * 11 + 30;
    return '<rect x="' + (w[1] - wd / 2) + '" y="' + (w[2] - 22) + '" width="' + wd + '" height="34" rx="17" fill="#ff5d8f" fill-opacity=".25" stroke="#d63c6c" stroke-width="2"/>' +
      T(w[1], w[2], 17, w[0], "#7a1238", B + MID);
  }).join("") +
  '<g transform="translate(250 104)"><circle r="42" fill="#fff" fill-opacity=".7" stroke="#141a33" stroke-width="6"/><path d="M30 30l34 34" stroke="#141a33" stroke-width="12" stroke-linecap="round"/>' +
  T(0, 8, 20, 'clue?', "#141a33", B + MID) + '</g>' +
  A2ART.egg(A2ART.bird(470, 96, 0.75, "#3a8fd6"), "A bird with an opinion: seeds are the best. Jay agrees, apart from the seeds.") +
  '</svg>';

/* one sentence, two jobs */
var SPLIT =
  '<svg viewBox="0 0 520 190" role="img" aria-label="A sentence split into a fact part and an opinion part">' +
  '<rect width="520" height="190" rx="16" fill="#f4f1ea"/>' +
  '<rect x="16" y="40" width="270" height="52" rx="12" fill="#19c39a" fill-opacity=".3" stroke="#0f7a5f" stroke-width="2.5"/>' +
  T(151, 72, 15, 'The cafe opened in 1990,', "#141a33", B + MID) +
  '<rect x="296" y="40" width="208" height="52" rx="12" fill="#ff5d8f" fill-opacity=".3" stroke="#d63c6c" stroke-width="2.5"/>' +
  T(400, 72, 15, 'and it is amazing.', "#141a33", B + MID) +
  T(151, 124, 14, 'FACT', "#0f7a5f", B + MID) + T(151, 146, 13, 'I could look it up', "#141a33", MID) +
  T(400, 124, 14, 'OPINION', "#d63c6c", B + MID) + T(400, 146, 13, 'Says who?', "#141a33", MID) +
  T(260, 26, 13, 'one sentence, two jobs', "#5b6180", MID) +
  '</svg>';

/* a highlighter for the hunt */
var PEN =
  '<svg viewBox="0 0 420 110" role="img" aria-label="A highlighter pen marking an opinion">' +
  '<rect width="420" height="110" rx="14" fill="#fffbe0"/>' +
  '<rect x="30" y="40" width="210" height="30" rx="4" fill="#ff5d8f" fill-opacity=".45"/>' +
  T(40, 61, 16, 'It was amazing!', "#141a33", B) +
  '<g transform="translate(300 55) rotate(-30)"><rect x="-60" y="-14" width="100" height="28" rx="6" fill="#ff5d8f" stroke="#141a33" stroke-width="2.5"/><path d="M40 -10l22 6v8l-22 6z" fill="#ffd0de" stroke="#141a33" stroke-width="2.5"/></g>' +
  A2ART.egg(A2ART.bonnie(380, 66, 0.5, "sit"), "Bonnie's opinion: walks are the best. Hard to argue with.") +
  '</svg>';

var OPW = ["think", "feel", "believe", "reckon", "best", "worst", "amazing", "brilliant", "boring", "terrible", "awful", "great", "fantastic", "fun", "exciting",
  "should", "must", "love", "hate", "favourite", "epic", "rubbish", "good", "bad", "cool", "beautiful", "ugly", "clearly", "obviously", "surely", "perfect",
  "wonderful", "dull", "nice", "lovely", "horrible", "scary", "greatest", "worth", "too", "excellent", "incredible", "awesome", "annoying", "silly", "ridiculous"];
var SNEAKY = OPW.filter(function(w){ return ["think", "best", "worst"].indexOf(w) < 0; }).concat(["everyone", "nobody", "far too"]);
var DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

var TXT = {
  mild: "<p>Last chunk. Read this short piece, then hunt for the opinions.</p>" +
    "<p class=\"a2task\">[[Event]] is at [[place]]. It starts at [[start]]. I think it will be amazing. You should come along.</p>",
  medium: "<p>Last chunk. Read this piece, then hunt for the opinions.</p>" +
    "<p class=\"a2task\">[[Event]] is at [[place]] this Saturday. It starts at [[start]] and tickets cost 6 pounds. I think it is the best day out in town. [[Who]] has run it for 10 years. You should bring a friend. The last one was amazing!</p>",
  spicy: "<p>Last chunk. Read this piece, then hunt for the opinions. Some of them are sneaky.</p>" +
    "<p class=\"a2task\">[[Event]] is at [[place]] this Saturday, starting at [[start]]. Tickets cost 6 pounds, which is clearly a bargain. Everyone agrees it is the highlight of the year. [[Who]] has run it for 10 years. Surely nobody would want to miss it. Around 300 people came last time.</p>"
};

(window.A2PACKS = window.A2PACKS || {})["says-who"] = {
  a2: true,
  id: "a2-says-who",
  title: "Says who?",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "How you know a fact is a fact, and the clue words that give an opinion away.",
  blurb: "Saying how you know something is a fact, then spotting the little words that show an opinion. Four short chunks, with a fact and opinion card to make at the end.",
  note: "Saying how you know a fact is a fact, and spotting opinion clue words. Four five minute chunks and a card to make. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Whisper", line: "Whisper: short sentences, one clue at a time." },
    { id: "medium", name: "Chatter", line: "Chatter: longer sentences where facts and opinions get mixed up." },
    { id: "spicy", name: "Hot take", line: "Hot take: sneaky opinions that dress up as facts." }
  ],
  themes: {
    time: { name: "Time travel", w: { place: "the museum", spots: "seats", thing: "time machine", who: "the tour guide", event: "the time travel tour", start: "10am", fans: "visitors" } },
    football: { name: "Football", w: { place: "the stadium", spots: "seats", thing: "match ball", who: "the coach", event: "the cup final", start: "3pm", fans: "fans" } },
    horror: { name: "Horror", w: { place: "the old hospital", spots: "beds", thing: "torch", who: "the ghost guide", event: "the ghost walk", start: "11pm", fans: "ghost hunters" } },
    fishing: { name: "Fishing", w: { place: "the lake", spots: "fishing pegs", thing: "fishing rod", who: "the lake keeper", event: "the fishing match", start: "6am", fans: "anglers" } },
    music: { name: "Music", w: { place: "the theatre", spots: "seats", thing: "microphone", who: "the director", event: "opening night", start: "7pm", fans: "theatre fans" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: CLUES,
  steps: [

    /* ---------- chunk 1: how do you know? ---------- */
    { type: "learn", topic: "How do you know?", title: "Say how you know",
      fig: HOW,
      ez: { title: "Say how you know", html: "<p>A <b>fact</b> is something you could check.</p><p>Count it. Measure it. Look it up. See it.</p>" },
      html: "<p>A fact is something you could check. If someone asks <b>how do you know it is a fact?</b>, tell them how you would check it.</p>" +
        "<p><b>[[Place]] has 40 [[spots]].</b> How do I know it is a fact? <b>Because I could count the [[spots]].</b></p>" +
        "<p>That is all it takes: say <b>count it, measure it, look it up</b> or <b>see it</b>.</p>",
      lv: { spicy: { html: "<p>A fact is something you could check. If someone asks <b>how do you know it is a fact?</b>, tell them how you would check it.</p>" +
        "<p>A sharp answer names <b>the part</b> you would check and <b>how</b>: \"The 40 is a fact because I could count the [[spots]].\"</p>" +
        "<p>Watch out: a sentence can have a checkable part and a feeling part. Only the checkable part is the fact.</p>" } } },

    { type: "mc", topic: "How do you know?",
      q: "<b>[[Place]] has 40 [[spots]].</b><br>How do you know this is a fact?",
      options: ["I could count the [[spots]].", "I like the [[spots]].", "The [[spots]] look comfy."],
      answer: 0,
      slips: { 1: "Liking them is what you think. It does not tell anyone how many there are.", 2: "Looking comfy is a feeling about them. Comfy cannot be counted." },
      hint: "Which answer says how you would check it?",
      why: "You could count them. Counting is a way of checking, so it is a fact.",
      ez: { why: "You could <b>count</b> them. That checks it.", slips: { 1: "Liking them is what you think.", 2: "Comfy is a feeling. You cannot count it." } },
      lv: {
        medium: { q: "<b>[[Event]] starts at [[start]].</b><br>How do you know this is a fact?",
          options: ["I could check the time on a poster or a ticket.", "It sounds like a good time to start.", "Lots of people say so."],
          slips: { 1: "Sounding good is an opinion about the time. Say how you would check it.", 2: "Lots of people saying something does not check it. A poster or ticket would." },
          why: "A start time can be checked on a poster, a ticket or a website. That is how you know it is a fact." },
        spicy: { q: "<b>[[Event]] lasted 90 minutes, which felt like forever.</b><br>Which part is a fact, and how would you know?",
          options: ["90 minutes: I could time it on a clock.", "Felt like forever: I could ask how people felt.", "The whole sentence: it has a number in it.", "None of it: it is all a feeling."],
          slips: { 1: "Asking people tells you their feelings, and feelings can differ. That part is opinion.", 2: "Having a number in it does not make every word a fact. Felt like forever is a feeling.", 3: "Have another look at 90 minutes. A clock could check that." },
          why: "90 minutes can be timed on a clock. Felt like forever is how it seemed to someone." } } },

    { type: "match", topic: "How do you know?",
      q: "Match each fact to how you would know it is a fact.",
      pairs: [["[[Who]] has 3 bags.", "I could count them."], ["The door is 2 metres tall.", "I could measure it."], ["[[Place]] opened in 1990.", "I could look it up."], ["The door is red.", "I could see it."]],
      hint: "How many: count. How tall: measure. A year: look it up. A colour: see it.",
      why: "Every fact has a way to check it. Saying that way is how you explain it is a fact.",
      ez: { hint: "How many: count. How tall: measure. Colour: see.", why: "Every fact has a way to check it." },
      lv: {
        mild: { pairs: [["[[Who]] has 3 bags.", "I could count them."], ["The door is 2 metres tall.", "I could measure it."], ["The door is red.", "I could see it."]] },
        spicy: { pairs: [["[[Who]] was born in 1995.", "I could look at a birth certificate."], ["The bag weighs 4 kg.", "I could weigh it on scales."], ["It rained on Monday.", "I could check a weather record."], ["There are 12 steps up to the door.", "I could count them."]],
          hint: "Think about what each fact is: a date, a weight, the weather, a number of things.",
          why: "Different facts need different checks: documents, scales, records, counting. Each one could be checked by anyone." } } },

    { type: "text", topic: "How do you know?", explain: true,
      q: "Finish the sentence in your own words.<br><b>There are 3 windows in Base 5.</b> I know it is a fact because I could ...",
      need: [["count", "see", "look", "check", "spot"]],
      model: "count the windows.",
      slips: [[["like", "nice", "good", "pretty", "big"], "That is what you think of the windows. Say how you would check: count, measure, look it up or see."]],
      hint: "How would you find out how many windows there are?",
      why: "You could count them, or see them. Either way, anyone could check, so it is a fact.",
      ez: { q: "Finish it.<br><b>There are 3 windows in Base 5.</b> I know it is a fact because I could ...", hint: "How would you find out how many?",
        why: "You could <b>count</b> them. Anyone could check.", slips: [[["like", "nice", "good", "pretty", "big"], "That is what you think. Say how you would check."]] },
      lv: { spicy: { q: "Explain how you know this is a fact. One sentence is plenty.<br><b>[[Place]] is 200 metres from the bus stop.</b>",
        need: [["measure", "walk", "map", "count", "step", "check", "look", "tape", "pace", "app", "wheel"]],
        model: "I could measure the distance on a map.",
        slips: [[["near", "close", "far", "short"], "Near and far are judgements. Say how you would find the 200 metres."]],
        hint: "How do people measure a distance like that?",
        why: "You could measure it on a map, pace it out or use a measuring wheel. A distance can be checked." } } },

    { type: "mc", topic: "How do you know?",
      q: "Jay says: \"Bonnie weighs 3 kilograms.\" How could you know it is a fact?",
      fig: '<svg viewBox="0 0 420 160" role="img" aria-label="Jay and Bonnie the poodle">' + A2ART.jay(90, 62, 0.85, "smile") +
        A2ART.bubble(150, 10, 190, 52, "Bonnie weighs\n3 kilograms.", 168) + A2ART.bonnie(330, 112, 0.9, "sit") + '</svg>',
      options: ["Put her on some scales.", "Ask Bonnie.", "Look at how fluffy she is."],
      answer: 0,
      slips: { 1: "Bonnie is a very good dog, but she is not great at talking. Scales would tell you.", 2: "Fluffy does not tell you kilograms. Scales do." },
      hint: "Kilograms are a weight.",
      why: "Weigh her on scales. If the scales say 3 kg, the fact checks out. Bonnie would probably want a treat for helping.",
      ez: { q: "How could you check what Jay says?", why: "Weigh her on <b>scales</b>. Bonnie wants a treat now.", slips: { 1: "Bonnie is a good dog. But she cannot talk!" } } },

    /* ---------- chunk 2: opinion clue words ---------- */
    { type: "learn", topic: "Opinion clue words", title: "Opinions leave clues",
      fig: CLUES,
      ez: { title: "Opinions leave clues", html: "<p>An <b>opinion</b> is what someone thinks.</p><p>Clue words: <b>I think, best, amazing, should</b>.</p>" },
      html: "<p>An <b>opinion</b> is what someone thinks or feels. Somebody else could think something different, and nobody could check who is right.</p>" +
        "<p>Opinions often carry <b>clue words</b>:</p>" +
        "<ul><li><b>I think, I feel, I believe</b></li><li><b>best, worst</b>, and judging words like <b>amazing, boring, brilliant</b></li><li><b>should</b>, when someone says what they think ought to happen</li></ul>",
      lv: { spicy: { html: "<p>An <b>opinion</b> is what someone thinks or feels. Somebody else could think something different, and nobody could check who is right.</p>" +
        "<p>The easy clue words are <b>I think, best, should, amazing</b>. The sneaky ones push you to agree without saying it is just a view:</p>" +
        "<ul><li><b>clearly, obviously, surely</b></li><li><b>everyone knows, nobody would</b></li><li><b>must, far too</b></li></ul>" +
        "<p>If a word judges something or tells you how to feel, it is an opinion clue.</p>" } } },

    { type: "multi", topic: "Opinion clue words",
      q: "Pick the opinion clue words.",
      options: ["best", "metres", "amazing", "Tuesday", "I think", "seven"],
      answers: [0, 2, 4],
      hint: "Which words show what someone thinks or feels? The others are things you could check.",
      why: "Best, amazing and I think show what someone thinks. Metres, Tuesday and seven are things you could check.",
      ez: { hint: "2 are what someone thinks.", why: "<b>Best</b> and <b>amazing</b> are what someone thinks." },
      lv: {
        mild: { options: ["best", "amazing", "10", "Monday"], answers: [0, 1],
          hint: "Two of these are about what someone thinks. Two are a number and a day.",
          why: "Best and amazing show what someone thinks. 10 and Monday are things you could check." },
        spicy: { q: "Pick the words that push an opinion.", options: ["clearly", "kilometres", "obviously", "1066", "surely", "should"], answers: [0, 2, 4, 5],
          hint: "Four of them tell you what to think. Two are things you could check.",
          why: "Clearly, obviously, surely and should all push a view. Kilometres and 1066 are things you could measure or look up." } } },

    { type: "mc", topic: "Opinion clue words",
      q: "Which word shows this is an opinion?<br><b>[[Place]] is the best place in town.</b>",
      options: ["best", "place", "town"],
      answer: 0,
      slips: { 1: "Place just names where. It does not tell you what anyone thinks.", 2: "Town tells you where it is. Look for the word that judges it." },
      hint: "Which word judges it?",
      why: "Best is a judgement. Someone else might think somewhere else is best.",
      ez: { q: "Which word shows an opinion?<br><b>[[Place]] is the best place in town.</b>", why: "<b>Best</b> is what someone thinks.", slips: { 1: "Place just names where.", 2: "Town says where. Find the judging word." } },
      lv: {
        medium: { q: "Which word shows this is an opinion?<br><b>You should try the cafe at [[place]].</b>",
          options: ["should", "cafe", "try"],
          slips: { 1: "A cafe is a thing you could see. Look for the word that says what someone thinks you ought to do.", 2: "Try is the action. The clue is the word telling you that you ought to." },
          hint: "Which word tells you what someone thinks you ought to do?",
          why: "Should is a clue word. It tells you what the writer thinks you ought to do." },
        spicy: { q: "Which word is pushing you to agree?<br><b>Obviously, [[place]] needs a bigger car park.</b>",
          options: ["Obviously", "car park", "bigger"],
          slips: { 1: "A car park is a thing you could see and measure. Look for the word that tells you to agree.", 2: "Bigger compares sizes, which could be measured. One word in there tells you to agree without a reason." },
          hint: "Which word tells you to agree without giving a reason?",
          why: "Obviously tells you to agree without giving any reason. Needs is part of the opinion too." } } },

    { type: "text", topic: "Opinion clue words",
      q: "Turn this fact into an opinion. Add an opinion clue word.<br><b>[[Event]] starts at [[start]].</b>",
      need: [OPW],
      model: "I think [[event]] will be amazing.",
      slips: [[["starts at", "start at"], "That still reads like a fact. Pop in a clue word, like best, amazing or I think."]],
      hint: "Try starting with I think, or add a word like amazing or boring.",
      why: "Once you add a word like amazing, boring or I think, it becomes what someone thinks.",
      ez: { q: "Make this an opinion. Add a clue word.<br><b>[[Event]] starts at [[start]].</b>", hint: "Try I think, or amazing.", why: "A clue word makes it an opinion.",
        slips: [[["starts at", "start at"], "Still a fact. Add a clue word, like amazing."]] },
      lv: { spicy: { q: "Turn this fact into an opinion <b>without</b> using I think, best or worst.<br><b>[[Event]] starts at [[start]].</b>",
        need: [SNEAKY],
        model: "Surely [[event]] starts far too early.",
        slips: [[["i think", "best", "worst"], "That works as an opinion, but have a go without I think, best or worst. Try clearly, surely, far too or a judging word like dull."], [["starts at", "start at"], "That still reads like a fact. Add a word that judges the time, like far too early."]],
        hint: "Try surely, clearly, far too early or a judging word.",
        why: "Words like surely and far too early judge the time. Someone else might think it is perfect." } } },

    { type: "mc", topic: "Opinion clue words",
      q: "Jay says this. Is it a fact or an opinion?",
      fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay saying pigeons are the best birds">' + A2ART.jay(80, 60, 0.85, "wow") +
        A2ART.bubble(140, 8, 240, 70, "Outrageous! Pigeons\nare the best birds.", 158) + A2ART.bird(330, 116, 0.9, "#8c96a8") + '</svg>',
      options: ["An opinion: best is what Jay thinks.", "A fact: Jay said it, so it must be true."],
      answer: 0, fixed: true,
      slips: { 1: "Even Jay's opinions are opinions. Best is the clue word, and plenty of people prefer robins." },
      hint: "Look for a clue word.",
      why: "Best is a clue word. Jay thinks it. Someone else might say robins, or owls.",
      ez: { why: "<b>Best</b> is a clue word. Some say robins!", slips: { 1: "Even Jay's opinions are opinions! Best is the clue." } },
      lv: { spicy: { q: "Jay says this. Which part could you actually check?",
        options: ["That pigeons are birds.", "That pigeons are the best birds.", "Neither part."], fixed: false,
        slips: { 1: "Best is Jay's opinion, a strong one, but still an opinion.", 2: "One part can be looked up in any bird book." },
        hint: "Which part could you look up in a bird book?",
        why: "Pigeons are birds: you could look that up. The best part is Jay's opinion." } } },

    /* ---------- chunk 3: says who? ---------- */
    { type: "learn", topic: "Says who?", title: "One sentence, two jobs",
      fig: SPLIT,
      ez: { title: "Says who?", html: "<p>A fact and an opinion can share a sentence.</p><p>Spot an opinion? Ask <b>says who?</b></p>" },
      html: "<p>Sometimes a fact and an opinion share one sentence.</p>" +
        "<p><b>The cafe opened in 1990, and it is amazing.</b></p>" +
        "<p>Opened in 1990: you could look it up. It is amazing: <b>says who?</b> That part is somebody's opinion.</p>" +
        "<p>When you spot an opinion, ask <b>says who?</b> Someone thinks it. Not everyone would agree.</p>",
      lv: { spicy: { html: "<p>Sometimes a fact and an opinion share one sentence.</p>" +
        "<p><b>The cafe opened in 1990, and it is amazing.</b> Opened in 1990: look it up. Amazing: <b>says who?</b></p>" +
        "<p>Watch for opinions in disguise: <b>everyone knows</b>, <b>it is a fact that</b>, <b>research shows</b>. They sound like facts, but ask <b>says who?</b> and <b>why would they say it?</b></p>" } } },

    { type: "mc", topic: "Says who?",
      q: "Which part is the opinion?<br><b>[[Event]] starts at [[start]], and it will be brilliant.</b>",
      options: ["it will be brilliant", "[[Event]] starts at [[start]]"],
      answer: 0,
      slips: { 1: "A start time can be checked on a poster. Look for the clue word." },
      hint: "Find the clue word, then the part around it.",
      why: "Brilliant is a clue word. The start time could be checked.",
      ez: { slips: { 1: "You can check a start time. Find the clue word." } },
      lv: {
        medium: { q: "Which part is the opinion?<br><b>[[Who]] has worked here for 10 years and is the friendliest person in [[place]].</b>",
          options: ["has worked here for 10 years", "is the friendliest person in [[place]]"], answer: 1,
          slips: { 0: "10 years could be checked with work records. Look for the judging word." },
          hint: "Friendliest is a judging word.",
          why: "Friendliest is a judgement. Someone else might find a different person friendlier." },
        spicy: { q: "Which part is the opinion?<br><b>Built in 1990 and visited by 300 people a week, [[place]] is clearly the heart of the town.</b>",
          options: ["is clearly the heart of the town", "Built in 1990", "visited by 300 people a week"],
          slips: { 1: "A building date can be looked up.", 2: "Visitors can be counted. The facts are there to make the opinion sound strong." },
          hint: "Find the sneaky clue word.",
          why: "Clearly the heart of the town is a judgement. The two facts are there to make it sound convincing." } } },

    { type: "sort", topic: "Says who?",
      q: "Sort them: fact or opinion?",
      buckets: ["Fact: I could check it", "Opinion: says who?"],
      cards: [["[[Place]] is open on Saturdays.", 0], ["You should visit [[place]].", 1], ["[[Who]] is 30 years old.", 0], ["[[Who]] is the nicest person here.", 1], ["The [[thing]] costs 20 pounds.", 0], ["The [[thing]] is worth every penny.", 1]],
      hint: "Look for clue words: should, nicest, worth every penny.",
      why: "Days, ages and prices can be checked. Should, nicest and worth every penny are what someone thinks.",
      ez: { hint: "Look for should and nicest.", why: "Days and ages can be checked. Should and nicest are opinions." },
      lv: {
        mild: { cards: [["[[Place]] is open on Saturdays.", 0], ["You should visit [[place]].", 1], ["[[Who]] is 30 years old.", 0], ["[[Who]] is the nicest person here.", 1]] },
        spicy: { cards: [["[[Place]] is open on Saturdays.", 0], ["Everyone knows [[place]] is the best.", 1], ["[[Who]] is 30 years old.", 0], ["It is a fact that [[who]] is the nicest person here.", 1], ["Surely the [[thing]] is worth 20 pounds.", 1], ["The [[thing]] costs 20 pounds.", 0]],
          hint: "Watch for disguises: everyone knows, it is a fact that, surely.",
          why: "Saying \"it is a fact that\" does not make it one. Nicest, best and worth are still opinions." } } },

    { type: "text", topic: "Says who?", explain: true,
      q: "Explain how you know this is an opinion.<br><b>[[Place]] is boring.</b>",
      need: [["think", "feel", "boring", "opinion", "agree", "different", "people", "check", "like", "view", "fun", "says", "someone", "measure", "count"]],
      model: "Boring is what someone thinks. Other people might not agree.",
      hint: "Could you count or measure boring? Who decides if it is boring?",
      why: "Boring is a judgement. One person might be bored, another might love it. You could not check it.",
      ez: { q: "How do you know this is an opinion?<br><b>[[Place]] is boring.</b>", hint: "Could you count boring?", why: "<b>Boring</b> is what someone thinks. You cannot check it." },
      lv: { spicy: { q: "Explain why this is still an opinion, even though it sounds like a fact.<br><b>Everyone knows [[place]] is the best.</b>",
        need: [["best", "everyone", "opinion", "think", "check", "agree", "view", "ask", "sound", "judge", "prove"]],
        model: "Best is an opinion, and you could not check what everyone thinks.",
        hint: "Two things to think about: the word best, and the word everyone.",
        why: "Best is a judgement, and nobody could ask everyone. Everyone knows is a trick to make an opinion sound like a fact." } } },

    { type: "mc", topic: "Says who?",
      q: "Says who?<br><b>My nan says [[place]] is too cold.</b><br>Who thinks [[place]] is too cold?",
      options: ["My nan thinks it.", "Everyone thinks it.", "Nobody thinks it: it is a fact."],
      answer: 0,
      slips: { 1: "Only one person said it. Somebody else might find it warm.", 2: "Too cold is a judgement. Someone does think it: look for who said it." },
      hint: "Look for who is doing the saying.",
      why: "It is nan's opinion. Too cold for one person might be fine for another.",
      ez: { q: "Says who?<br><b>My nan says [[place]] is too cold.</b><br>Who thinks it is too cold?", why: "It is <b>nan's</b> opinion.", slips: { 1: "Only 1 person said it.", 2: "Someone does think it. Who said it?" } },
      lv: {
        medium: { q: "Says who?<br><b>Our [[fans]] say [[place]] is the friendliest place around.</b>",
          options: ["The [[fans]] think it.", "Everybody in the world thinks it.", "Nobody: it is a checked fact."],
          slips: { 1: "Only some people said it. Others might disagree.", 2: "Friendliest is a judgement. It is what the [[fans]] think." },
          hint: "Who is doing the saying?",
          why: "It is the [[fans]]' opinion. Friendliest cannot be measured." },
        spicy: { q: "Says who?<br><b>\"Research shows [[fans]] are happier at [[place]].\"</b> (from a leaflet made by [[place]])",
          options: ["The people who run [[place]]: they want you to visit.", "Independent researchers with nothing to gain.", "Nobody: it is a checked fact."],
          slips: { 1: "Look at who made the leaflet. Nothing says anyone independent checked it.", 2: "Research shows sounds like a fact, but there is no research named. And happier is hard to measure." },
          hint: "Who made the leaflet, and what do they want?",
          why: "The leaflet was made by [[place]], and they want visitors. Research shows, with no research named, is a disguise." } } },

    /* ---------- chunk 4: opinion hunt ---------- */
    { type: "learn", topic: "Opinion hunt", title: "Opinion hunt",
      fig: PEN,
      html: TXT.medium,
      lv: { mild: { html: TXT.mild }, spicy: { html: TXT.spicy } },
      ez: { html: TXT.mild.replace("<p>Last chunk. Read this short piece, then hunt for the opinions.</p>", "<p>Read this. Then hunt for the opinions.</p>") } },

    { type: "multi", topic: "Opinion hunt",
      q: "Pick the <b>three</b> sentences with an opinion in them.",
      options: ["[[Event]] is at [[place]] this Saturday.", "It starts at [[start]] and tickets cost 6 pounds.", "I think it is the best day out in town.", "[[Who]] has run it for 10 years.", "You should bring a friend.", "The last one was amazing!"],
      answers: [2, 4, 5],
      hint: "Look for I think, best, should and amazing.",
      why: "I think, best, should and amazing are the clues. The place, time, price and 10 years could all be checked.",
      lv: {
        mild: { q: "Pick the <b>two</b> sentences with an opinion in them.",
          options: ["[[Event]] is at [[place]].", "It starts at [[start]].", "I think it will be amazing.", "You should come along."], answers: [2, 3],
          hint: "Look for I think, amazing and should.",
          why: "I think, amazing and should are clues. The place and time could be checked." },
        spicy: { options: ["[[Event]] is at [[place]] this Saturday, starting at [[start]].", "Tickets cost 6 pounds, which is clearly a bargain.", "Everyone agrees it is the highlight of the year.", "[[Who]] has run it for 10 years.", "Surely nobody would want to miss it.", "Around 300 people came last time."],
          answers: [1, 2, 4],
          hint: "One sentence starts as a fact and then sneaks an opinion in.",
          why: "Clearly a bargain, everyone agrees, and surely are all opinions. The ticket price itself is a fact, but the sentence adds a judgement." } } },

    { type: "mc", topic: "Opinion hunt",
      q: "<b>The last one was amazing!</b><br>Which is the clue word?",
      options: ["amazing", "last", "was"],
      answer: 0,
      slips: { 1: "Last tells you which one. It does not judge it.", 2: "Was is just a linking word. Look for the judging word." },
      hint: "Which word judges it?",
      why: "Amazing is a judging word. Someone else might have found it dull.",
      ez: { q: "<b>I think it will be amazing.</b><br>Which word is the clue?", slips: { 1: "It is a tiny word. Find the judging word.", 2: "Will is about the future." } },
      lv: {
        mild: { q: "<b>I think it will be amazing.</b><br>Which word tells you what someone thinks of it?",
          options: ["amazing", "it", "will"],
          slips: { 1: "It is a tiny pointing word. Look for the word that judges.", 2: "Will is about the future. Look for the word that judges." } },
        spicy: { q: "<b>Surely nobody would want to miss it.</b><br>Which word is pushing you to agree?",
          options: ["Surely", "want", "miss"],
          slips: { 1: "Want is part of the claim, but one word is doing the pushing.", 2: "Miss is just the action. Look at the very first word." },
          hint: "Look at how the sentence starts.",
          why: "Surely tells you to agree without giving a reason. Nobody is a big claim too: nobody could check that." } } },

    { type: "num", topic: "Opinion hunt",
      q: "How many sentences in the piece have an opinion in them?",
      boxes: [{ label: "Sentences", a: 3 }],
      slips: [[2, "Close. Look again for should, and for amazing."], [6, "That is every sentence. Some could be checked, like the place and the price."], [4, "One too many. 10 years could be checked."]],
      hint: "Go sentence by sentence and ask: says who?",
      why: "There are <b>3</b>: I think it is the best, you should bring a friend, and the last one was amazing.",
      ez: { q: "How many sentences have an opinion?", slips: [[4, "That is every sentence."], [1, "Close. Look for should."], [3, "One too many."]] },
      lv: {
        mild: { boxes: [{ label: "Sentences", a: 2 }],
          slips: [[4, "That is every sentence. The place and the time could be checked."], [1, "Close. There is one more: look for should."], [3, "One too many. The time could be checked."]],
          why: "There are <b>2</b>: I think it will be amazing, and you should come along." },
        spicy: { slips: [[2, "Close. Did you count the sentence about tickets? It starts as a fact, then clearly sneaks in."], [4, "One too many. Around 300 people came is something you could check."], [6, "That is every sentence. The place, the 10 years and the 300 people could be checked."]],
          why: "There are <b>3</b>: clearly a bargain, everyone agrees, and surely nobody would want to miss it." } } },

    { type: "text", topic: "Opinion hunt", stretch: true,
      q: "Your turn, if you like. Write your own opinion about the [[thing]], with a clue word in it.",
      need: [OPW],
      model: "I think the [[thing]] is brilliant.",
      hint: "Start with I think, or use a word like best, boring or amazing.",
      why: "Any sentence with a clue word like I think, best or amazing shows it is your opinion.",
      ez: { q: "If you like: write an opinion about the [[thing]].", hint: "Start with I think.", why: "A clue word shows it is your opinion." },
      lv: { spicy: { q: "Your turn, if you like. Write one sentence about [[place]] with a fact <b>and</b> an opinion in it.",
        need: [DIGITS, OPW],
        model: "[[Place]] has 40 [[spots]], and it is the best place in town.",
        slips: [[["think", "best", "amazing", "boring"], "The opinion is there. Add a fact with a number in it, like a year or how many."]],
        hint: "Put a number in for the fact, then add a clue word for the opinion.",
        why: "A number makes a checkable fact, and a clue word adds the opinion. One sentence, two jobs." } } }
  ],

  realWorld: {
    title: "Adverts and reviews",
    html: "<p>Adverts, reviews and posts online mix facts with opinions all the time. Asking <b>says who?</b> helps you work out what to trust.</p>" +
      "<p>It fits our big question too. If a time traveller came back and said \"1850 was amazing\", says who? That is their opinion. \"There were no cars\" is something you could check.</p>",
    fig: '<svg viewBox="0 0 420 140" role="img" aria-label="Jay next to a time portal asking says who">' + A2ART.portal(80, 70, 56) + A2ART.jay(250, 50, 0.85, "hmm") +
      A2ART.bubble(300, 6, 104, 34, "Says who?", 304) + '</svg>'
  },

  ez: {
    realWorld: { title: "Adverts and reviews", html: "<p>Adverts and reviews mix facts and opinions.</p><p>Ask <b>says who?</b></p>" },
    make: { intro: "One thing. One fact. One opinion.", fields: [{ label: "A fact you could check" }] }
  },

  make: {
    title: "Make a fact and opinion card",
    intro: "One thing, one fact about it, one opinion about it. Stick it on the wall or send it to Jay, if you fancy it.",
    fields: [
      { id: "fact", label: "A fact (something you could check)", ph: "Bonnie has four legs.", max: 70 },
      { id: "op", label: "An opinion about the same thing", ph: "Bonnie is the best dog in the world.", max: 70 },
      { id: "who", label: "Says who?", ph: "Jay", max: 24 }
    ],
    svg: function(v){
      function e(t){ return String(t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n){ var w = String(t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n){ if(cur.trim()) out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, 5); }
      function lines(t, x, y){ return wrap(t, 18).map(function(l, k){ return '<text x="' + x + '" y="' + (y + k * 25) + '" font-family="Verdana,Arial,sans-serif" font-size="18" font-weight="700" fill="#141a33">' + e(l) + '</text>'; }).join(""); }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 380">' +
        '<rect width="640" height="380" rx="24" fill="#fffbe9"/>' +
        '<text x="320" y="52" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="26" font-weight="700" fill="#141a33">SAYS WHO?</text>' +
        '<rect x="24" y="76" width="288" height="230" rx="18" fill="#d4f5ea" stroke="#0f7a5f" stroke-width="4"/>' +
        '<text x="44" y="112" font-family="Verdana,Arial,sans-serif" font-size="18" font-weight="700" fill="#0f7a5f">FACT</text>' +
        '<text x="44" y="136" font-family="Verdana,Arial,sans-serif" font-size="14" fill="#0f7a5f">I could check it</text>' +
        lines(v.fact, 44, 172) +
        '<rect x="328" y="76" width="288" height="230" rx="18" fill="#ffe0ea" stroke="#d63c6c" stroke-width="4"/>' +
        '<text x="348" y="112" font-family="Verdana,Arial,sans-serif" font-size="18" font-weight="700" fill="#d63c6c">OPINION</text>' +
        '<text x="348" y="136" font-family="Verdana,Arial,sans-serif" font-size="14" fill="#d63c6c">Someone thinks it</text>' +
        lines(v.op, 348, 172) +
        '<text x="320" y="346" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="20" fill="#141a33">Says who? ' + e(v.who) + '</text>' +
        '</svg>';
    }
  }
};
})();
