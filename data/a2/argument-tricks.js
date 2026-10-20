/* Base 5 Autumn 2 activity: Argument tricks.
   English. How writers use facts and opinions to build a viewpoint:
   statistics, expert opinion, emotive language, rhetorical questions,
   and explaining their effect. ASCII only. */
(function(){
var A = window.A2ART;
var FONT = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') + (o.i ? ' font-style="italic"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }

/* ---------- pictures ---------- */
/* a viewpoint held up by facts and opinions */
var BUILD = '<svg viewBox="0 0 520 250" role="img" aria-label="A viewpoint banner held up by pillars: two facts and two opinions">' +
  '<rect width="520" height="250" rx="16" fill="#f4f1ea"/>' +
  '<path d="M50 80h420l-30 -64h-360z" fill="#ffd23f" stroke="#141a33" stroke-width="3"/>' +
  T(260, 42, "VIEWPOINT", 13, { b: 1, a: "middle", c: "#5b6180" }) + T(260, 66, "[[Slogan]]", 15, { b: 1, a: "middle" }) +
  [["Fact", "#22b8e6", 90], ["Opinion", "#ff5d8f", 190], ["Fact", "#22b8e6", 290], ["Opinion", "#ff5d8f", 390]].map(function(p){
    return '<rect x="' + p[2] + '" y="80" width="60" height="130" fill="' + p[1] + '" fill-opacity=".55" stroke="#141a33" stroke-width="2.5"/>' +
      '<path d="M' + (p[2] + 15) + ' 90v110M' + (p[2] + 45) + ' 90v110" stroke="#141a33" stroke-opacity=".2" stroke-width="2"/>' +
      T(p[2] + 30, 232, p[0], 14, { b: 1, a: "middle" });
  }).join("") +
  '<path d="M40 212h440" stroke="#141a33" stroke-width="4"/>' +
  A2ART.egg(A2ART.bird(488, 30, 0.6, "#19c39a"), "A bird perched on the viewpoint. It has a very good view. Jay approves.") +
  '</svg>';

/* the four tricks */
var ICON = {
  stat: '<rect x="-24" y="-4" width="12" height="24" fill="#141a33"/><rect x="-6" y="-16" width="12" height="36" fill="#141a33"/><rect x="12" y="-28" width="12" height="48" fill="#141a33"/>',
  expert: '<circle cy="-8" r="11" fill="#f0c4a0" stroke="#141a33" stroke-width="2"/><path d="M-22 -22l22 -10 22 10 -22 10z" fill="#141a33"/><path d="M16 -20v12" stroke="#141a33" stroke-width="2"/><path d="M-16 26q0 -20 16 -20q16 0 16 20z" fill="#ffffff" stroke="#141a33" stroke-width="2"/>',
  emotive: '<path d="M0 22l-22 -22a12 12 0 0 1 22 -14a12 12 0 0 1 22 14z" fill="#e04848" stroke="#141a33" stroke-width="2"/>',
  rq: '<path d="M-12 -12q0 -16 14 -16q14 0 14 14q0 10 -12 14v8" fill="none" stroke="#141a33" stroke-width="6" stroke-linecap="round"/><circle cx="2" cy="22" r="4" fill="#141a33"/>'
};
var TRICKS = '<svg viewBox="0 0 520 210" role="img" aria-label="Four argument tricks: statistic, expert opinion, emotive language, rhetorical question">' +
  '<rect width="520" height="210" rx="16" fill="#f4f1ea"/>' +
  [["stat", "Statistic", "numbers", "#ffd23f"], ["expert", "Expert", "opinion", "#22b8e6"], ["emotive", "Emotive", "language", "#ff5d8f"], ["rq", "Rhetorical", "question", "#19c39a"]].map(function(c, k){
    var x = 70 + k * 127;
    return '<g transform="translate(' + x + ' 76)"><circle r="46" fill="' + c[3] + '" fill-opacity=".4" stroke="#141a33" stroke-width="2.5"/>' + ICON[c[0]] + '</g>' +
      T(x, 152, c[1], 15, { b: 1, a: "middle" }) + T(x, 172, c[2], 14, { a: "middle", c: "#5b6180" });
  }).join("") + '</svg>';

/* trick, quote, effect */
var CHAIN = '<svg viewBox="0 0 540 170" role="img" aria-label="Explaining a trick: name the trick, give the quote, say the effect on the reader">' +
  '<rect width="540" height="170" rx="16" fill="#f4f1ea"/>' +
  [["Name the", "trick", "#ffd23f"], ["Give the", "quote", "#22b8e6"], ["Say the", "effect", "#ff5d8f"]].map(function(b, k){
    var x = 24 + k * 176;
    return '<rect x="' + x + '" y="34" width="140" height="84" rx="14" fill="' + b[2] + '" fill-opacity=".45" stroke="#141a33" stroke-width="2.5"/>' +
      T(x + 70, 70, b[0], 15, { a: "middle" }) + T(x + 70, 94, b[1], 18, { b: 1, a: "middle" }) +
      (k < 2 ? '<path d="M' + (x + 146) + ' 76h24M' + (x + 162) + ' 68l8 8 -8 8" fill="none" stroke="#141a33" stroke-width="3"/>' : '');
  }).join("") +
  T(270, 150, "...to make the reader think, feel or do something.", 14, { a: "middle", c: "#5b6180" }) + '</svg>';

/* a leaflet: the argument text with a colour key */
var LEAFLET = '<svg viewBox="0 0 520 200" role="img" aria-label="A campaign leaflet with a megaphone and the slogan">' +
  '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  '<rect x="110" y="16" width="300" height="168" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5" transform="rotate(-3 260 100)"/>' +
  '<g transform="rotate(-3 260 100)">' + T(260, 52, "[[Slogan]]", 14, { b: 1, a: "middle", c: "#e04848" }) +
  '<path d="M140 74h236M140 92h200M140 110h226M140 128h160M140 146h214" stroke="#141a33" stroke-opacity=".25" stroke-width="5" stroke-linecap="round"/></g>' +
  '<g transform="translate(52 100)"><path d="M-30 -12h14l34 -22v68l-34 -22h-14z" fill="#ff8a3d" stroke="#141a33" stroke-width="2.5"/><path d="M26 -14q10 14 0 28M34 -24q18 24 0 48" fill="none" stroke="#141a33" stroke-width="2.5" stroke-linecap="round"/></g>' +
  A2ART.egg(A2ART.bonnie(452, 128, 0.8, "sit") + '<g transform="translate(462 60) rotate(8)"><rect x="-44" y="-16" width="88" height="30" rx="4" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' + T(0, 4, "More walks!", 13, { b: 1, a: "middle" }) + '</g>',
    "Bonnie is running her own campaign: More walks! Her only trick is the puppy eyes. It works every time.") +
  '</svg>';

(window.A2PACKS = window.A2PACKS || {})["argument-tricks"] = {
  a2: true,
  id: "a2-argument-tricks",
  title: "Argument tricks",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "Writers mix facts and opinions to win you over. Learn their tricks, spot them, and say how they work.",
  blurb: "How writers use facts, opinions and four classic tricks to build an argument, and how to explain why they work. Four short chunks, with a campaign poster to make at the end.",
  note: "How arguments use facts, opinions and a few sneaky tricks. Four five minute chunks and a campaign poster to make at the end. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Soapbox", line: "Soapbox: spot the facts and opinions, and meet the tricks." },
    { id: "medium", name: "Campaigner", line: "Campaigner: find the tricks in a text and say what they do." },
    { id: "spicy", name: "Spin doctor", line: "Spin doctor: dodgy statistics, and explaining effects with precision." }
  ],
  themes: {
    time: { name: "Time travel", w: { slogan: "Free museum for students!",
      claim: "The time museum should be free for every student.",
      fact: "An adult ticket costs 18 pounds.", fact2: "The museum opened in 1902.",
      opinion: "The museum is the most exciting place in the city.",
      stat: "Last year, 7 out of 10 students said they could not afford a ticket.",
      expert: "Dr Amara Okafor, a history professor, says museums are the best classroom there is.",
      emotive: "It is heartbreaking to see young people locked out of their own history.",
      rq: "Why should the past only belong to people with money?" } },
    football: { name: "Football", w: { slogan: "Cheaper tickets for young fans!",
      claim: "The club should cut ticket prices for under 18s.",
      fact: "An adult ticket costs 35 pounds.", fact2: "The ground holds 12000 fans.",
      opinion: "Saturday afternoons at the ground are the best part of the week.",
      stat: "Only 1 in 20 fans at the last home game was under 18.",
      expert: "Sam Reid, a youth coach for 20 years, says young fans are the future of the game.",
      emotive: "It is a crying shame that loyal young fans are priced out of the stands.",
      rq: "What happens to a club when the next generation stops coming?" } },
    horror: { name: "Horror", w: { slogan: "Open the old hospital at night!",
      claim: "The old hospital should open for night tours.",
      fact: "The hospital was built in 1890.", fact2: "The east wing has 40 empty rooms.",
      opinion: "The east wing is the creepiest place in town.",
      stat: "A survey found 8 out of 10 local people would buy a ticket.",
      expert: "Professor Lin, an expert on old buildings, says the hospital is one of the finest in the country.",
      emotive: "Leaving this beautiful, eerie building to crumble in the dark would be a tragedy.",
      rq: "Who would not want to walk those creaking corridors at midnight?" } },
    fishing: { name: "Fishing", w: { slogan: "Keep our lake clean!",
      claim: "Litter should be banned at the lake, with big fines.",
      fact: "The lake is 2 kilometres long.", fact2: "The lake is home to 14 kinds of fish.",
      opinion: "Dawn is the most peaceful time to fish.",
      stat: "Volunteers pulled 300 kilograms of rubbish out of the lake last spring.",
      expert: "Dr Patel, a river scientist, says plastic is one of the biggest dangers to fish.",
      emotive: "Imagine a beautiful old carp tangled in a crisp packet.",
      rq: "Do we really want our children to fish in a rubbish tip?" } },
    music: { name: "Music", w: { slogan: "A musical every year!",
      claim: "Every school should put on a musical every year.",
      fact: "The school hall has 200 seats.", fact2: "Rehearsals take about 10 weeks.",
      opinion: "Musicals are the best kind of show.",
      stat: "In one study, 9 out of 10 students in a school show felt more confident afterwards.",
      expert: "Ms Grant, a theatre director, says the stage teaches teamwork better than any classroom.",
      emotive: "Picture a shy student taking a bow while the whole hall cheers.",
      rq: "Why would any school say no to that?" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: TRICKS,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Facts and opinions in an argument", title: "An argument is built",
      fig: BUILD,
      html: "<p>An <b>argument</b> tries to get you to agree with a <b>viewpoint</b>. The viewpoint is an opinion: \"[[Claim]]\"</p>" +
        "<p>To hold it up, writers use <b>facts</b> (things you could check) and more <b>opinions</b> (feelings and judgements).</p>" +
        "<p>Fact: \"[[Fact]]\" You could check that. Opinion: \"[[Opinion]]\" Someone else might disagree.</p>",
      lv: { spicy: { html: "<p>An <b>argument</b> is built to make you agree with a <b>viewpoint</b>, which is always an opinion: \"[[Claim]]\"</p>" +
        "<p>Writers <b>choose</b> which facts to include. A fact can be true and still be picked because it helps one side. Opinions then tell you how to feel about those facts.</p>" +
        "<p>So the question is not just \"fact or opinion?\" but \"<b>why has the writer put this here?</b>\"</p>" } } },

    { type: "mc", topic: "Facts and opinions in an argument",
      q: "Which sentence is the writer's <b>viewpoint</b>: the thing they want you to agree with?",
      options: ["[[Claim]]", "[[Fact]]", "[[Fact2]]"],
      answer: 0,
      slips: { 1: "That is a fact the writer might use, but it is not what they want you to agree with.", 2: "That is a checkable fact. A viewpoint says what should happen or what is best." },
      hint: "Look for \"should\".",
      why: "\"Should\" tells you this is what the writer wants. Everything else in the argument is there to back it up." },

    { type: "sort", topic: "Facts and opinions in an argument",
      q: "Sort these sentences from the argument.",
      buckets: ["Fact: you could check it", "Opinion: someone could disagree"],
      cards: [["[[Fact]]", 0], ["[[Opinion]]", 1], ["[[Fact2]]", 0], ["[[Emotive]]", 1]],
      hint: "Could you check it with a ticket, a map, a record or a count?",
      why: "Facts can be checked. Opinions are feelings or judgements that someone could disagree with.",
      lv: { medium: { cards: [["[[Fact]]", 0], ["[[Opinion]]", 1], ["[[Fact2]]", 0], ["[[Emotive]]", 1], ["[[Claim]]", 1], ["[[Stat]]", 0]],
          why: "Facts and statistics can be checked. The viewpoint, the feelings and the judgements are opinions." },
            spicy: { cards: [["[[Fact]]", 0], ["[[Opinion]]", 1], ["[[Fact2]]", 0], ["[[Emotive]]", 1], ["[[Claim]]", 1], ["[[Stat]]", 0]],
          why: "The statistic is checkable, so it is a fact, even though the writer picked it to help their side." } } },

    { type: "mc", topic: "Facts and opinions in an argument",
      q: "Why would a writer put a fact in an argument?",
      options: ["To make the argument sound true and solid", "To make the argument funnier", "To fill up space"],
      answer: 0,
      slips: { 1: "Facts are not usually there for jokes. They make the argument look trustworthy.", 2: "Good writers do not waste words. Every fact is there for a reason." },
      hint: "What does a fact you could check do to how much you trust it?",
      why: "Facts make an argument look reliable, so you are more likely to believe the opinions around them.",
      lv: { spicy: { q: "Why might a writer mix facts <b>and</b> opinions in the same paragraph?",
        options: ["Facts make it seem solid, opinions tell the reader how to feel about it", "Because they could not find enough facts", "To confuse the reader so they give up", "Opinions are just facts that are harder to check"],
        slips: { 1: "Maybe, but the mix is usually on purpose. Each part has a job.", 2: "Arguments want you to keep reading and agree, not give up.", 3: "An opinion is a judgement, not a hard to check fact." },
        why: "The facts build trust. The opinions steer your feelings. Together they push you towards the viewpoint." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Four tricks", title: "Four classic tricks",
      fig: TRICKS,
      html: "<p><b>Statistic:</b> a number or amount, to sound proven. \"[[Stat]]\"</p>" +
        "<p><b>Expert opinion:</b> someone who knows a lot agrees. \"[[Expert]]\"</p>" +
        "<p><b>Emotive language:</b> words that make you feel something. \"[[Emotive]]\"</p>" +
        "<p><b>Rhetorical question:</b> a question that does not need an answer. It makes you think the answer is obvious. \"[[Rq]]\"</p>",
      lv: { spicy: { html: "<p><b>Statistic:</b> numbers sound objective. \"[[Stat]]\" Ask: who counted, and how many?</p>" +
        "<p><b>Expert opinion:</b> borrows someone's authority. \"[[Expert]]\" It is still an opinion: another expert might disagree.</p>" +
        "<p><b>Emotive language:</b> chosen words that trigger feelings: pity, anger, excitement. \"[[Emotive]]\"</p>" +
        "<p><b>Rhetorical question:</b> the answer is built into the question. \"[[Rq]]\" It positions the reader as already agreeing.</p>" } } },

    { type: "match", topic: "Four tricks",
      q: "Match each trick to its example.",
      pairs: [["Statistic", "[[Stat]]"], ["Emotive language", "[[Emotive]]"], ["Rhetorical question", "[[Rq]]"]],
      hint: "Numbers, feelings, a question.",
      why: "Numbers are statistics. Strong feeling words are emotive. A question that does not need answering is rhetorical.",
      lv: { medium: { pairs: [["Statistic", "[[Stat]]"], ["Expert opinion", "[[Expert]]"], ["Emotive language", "[[Emotive]]"], ["Rhetorical question", "[[Rq]]"]] },
            spicy: { pairs: [["Statistic", "[[Stat]]"], ["Expert opinion", "[[Expert]]"], ["Emotive language", "[[Emotive]]"], ["Rhetorical question", "[[Rq]]"]] } } },

    { type: "mc", topic: "Four tricks",
      q: "\"[[Rq]]\" Which trick is this?",
      options: ["Rhetorical question", "Statistic", "Expert opinion"],
      answer: 0,
      slips: { 1: "There is no number here. Look at the end of the sentence.", 2: "Nobody with special knowledge is quoted here." },
      hint: "Look at the punctuation at the end.",
      why: "It is a question, but the writer is not waiting for an answer. They want you to think the answer is obvious.",
      lv: { spicy: { options: ["Rhetorical question", "Statistic", "Expert opinion", "Emotive language only"],
        slips: { 1: "No number here.", 2: "Nobody is quoted.", 3: "It may have feeling in it, but its shape is a question with an obvious answer built in." } } } },

    { type: "mc", topic: "Four tricks",
      q: "Which sentence uses <b>emotive language</b>?",
      options: ["[[Emotive]]", "[[Fact]]", "[[Fact2]]"],
      answer: 0,
      slips: { 1: "That is a plain fact. No feelings there.", 2: "That is a checkable fact. Emotive language makes you feel something." },
      hint: "Which one makes you feel something?",
      why: "It uses feeling words to pull at your emotions, so you care about the issue." },

    { type: "mc", topic: "Four tricks", explain: true,
      q: "Why does an <b>expert opinion</b> help an argument?",
      options: ["We trust people who know a lot, so we are more likely to agree", "It is always a fact", "It has a number in it"],
      answer: 0,
      slips: { 1: "An expert is still giving an opinion. It just sounds more trustworthy.", 2: "That would be a statistic." },
      hint: "Why would you listen to a doctor about health?",
      why: "Experts sound trustworthy, so their opinion makes the writer's viewpoint seem sensible.",
      lv: { spicy: { q: "\"[[Expert]]\" Why is this still an opinion?",
        options: ["It is the expert's view: another expert could disagree", "It is not: experts only say facts", "Because there is no number in it", "Because the expert might not be real"],
        slips: { 1: "Experts give judgements too. Knowing a lot does not turn a judgement into a fact.", 2: "Lots of facts have no numbers. It is the judgement that makes it an opinion.", 3: "Even a real, brilliant expert is giving a view here." },
        why: "It is a judgement. The fact is that they said it. What they said is still an opinion, borrowed to add authority." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Spot them in a text", title: "A real argument",
      fig: LEAFLET,
      html: "<p>Here is a short argument. Read it once, slowly, and watch for the tricks.</p>" +
        "<p class=\"a2task\">[[Claim]] [[Fact]] [[Stat]] [[Expert]] [[Emotive]] [[Rq]]</p>",
      lv: { mild: { html: "<p>Here is a short argument. Read it once, slowly.</p>" +
        "<p class=\"a2task\">[[Claim]] [[Fact]] [[Opinion]] [[Rq]]</p>" } } },

    { type: "multi", topic: "Spot them in a text",
      q: "Pick the <b>two</b> sentences from the argument that a reader could check.",
      options: ["[[Fact]]", "[[Stat]]", "[[Emotive]]", "[[Claim]]"],
      answers: [0, 1],
      hint: "One is a price or measurement, one has a number of people or things.",
      why: "The fact and the statistic can both be checked. The others are feelings and a viewpoint.",
      lv: { mild: { q: "Pick the sentence from the argument that a reader could check.",
        options: ["[[Fact]]", "[[Opinion]]", "[[Claim]]"], answers: [0],
        hint: "Which one could you check?",
        why: "You could check that. The others are what the writer thinks." } } },

    { type: "sort", topic: "Spot them in a text",
      q: "Sort each sentence by its trick.",
      buckets: ["Statistic", "Expert opinion", "Emotive language", "Rhetorical question"],
      cards: [["[[Stat]]", 0], ["[[Expert]]", 1], ["[[Emotive]]", 2], ["[[Rq]]", 3], ["Over half of all teenagers agree.", 0], ["A top scientist backs the plan.", 1], ["Think of the lonely, forgotten animals.", 2], ["Do you want to be the one who did nothing?", 3]],
      hint: "Number? Person who knows? Feelings? A question?",
      why: "Each trick has a shape: numbers, a trusted person, feeling words, or a question with the answer built in.",
      lv: { mild: { q: "Sort the sentences from the argument.",
          buckets: ["Fact", "Opinion"],
          cards: [["[[Fact]]", 0], ["[[Opinion]]", 1], ["[[Claim]]", 1], ["[[Fact2]]", 0]],
          hint: "Could you check it?",
          why: "Facts can be checked. Opinions are what someone thinks." },
            spicy: { cards: [["[[Stat]]", 0], ["[[Expert]]", 1], ["[[Emotive]]", 2], ["[[Rq]]", 3], ["Studies show the number has doubled since 2010.", 0], ["Doctors agree the risk is real.", 1], ["It would be a disgrace to stand by and let this happen.", 2], ["Can we honestly say we tried?", 3]],
          why: "Notice how vague some are: which studies? Which doctors? Spin doctors love a vague expert." } } },

    { type: "mc", topic: "Spot them in a text",
      q: "Jay writes: \"Birds make the best pets. 9 out of 10 people agree!\" He asked 10 people at his bird watching club. What is the problem?",
      fig: '<svg viewBox="0 0 420 160" role="img" aria-label="Jay holding up a sign that says 9 out of 10 agree">' + A2ART.jay(90, 54, 0.85, "wink") +
        '<g transform="translate(270 70) rotate(-4)"><rect x="-100" y="-40" width="200" height="80" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
        T(0, -6, "9 out of 10", 20, { b: 1, a: "middle", c: "#e04848" }) + T(0, 22, "agree!", 18, { b: 1, a: "middle" }) + '</g>' +
        A2ART.bird(390, 136, 0.6, "#3a8fd6") + '</svg>',
      options: ["He only asked bird fans, so of course they agreed", "9 out of 10 is too small a number", "Birds cannot be pets"],
      answer: 0,
      slips: { 1: "9 out of 10 sounds big. The problem is who he asked.", 2: "Plenty of people keep birds. The problem is the people he asked." },
      hint: "Who did he ask?",
      why: "A statistic is only as good as who was asked. Ten bird fans will not tell you what everyone thinks.",
      lv: { mild: { q: "Jay writes: \"Birds make the best pets. 9 out of 10 people agree!\" Which part is a <b>statistic</b>?",
          options: ["9 out of 10 people agree", "Birds make the best pets"],
          slips: { 1: "That is Jay's opinion. A statistic has numbers." },
          hint: "Look for the numbers.",
          why: "9 out of 10 is a statistic. It makes Jay's opinion sound proven. (He asked 10 people at his bird club. Outrageous.)" },
            spicy: { options: ["The sample is tiny and biased: ten bird fans", "9 out of 10 is not a real statistic", "Opinions can never use statistics", "He should have used a percentage instead"],
          slips: { 1: "It is a real statistic. It is just from a bad sample.", 2: "They often do. The question is whether the numbers are fair.", 3: "90% would hide the same problem." },
          why: "Ten people, all bird fans: too few, and all on one side. A careful reader always asks who was counted." } } },

    { type: "mc", topic: "Spot them in a text",
      q: "Why might the writer end with \"[[Rq]]\"?",
      options: ["To leave the reader thinking, and nudge them to agree", "Because the writer does not know the answer", "To test the reader, like a quiz"],
      answer: 0,
      slips: { 1: "The writer knows the answer they want. That is the trick.", 2: "Nobody is marking your answer. It is there to make you agree." },
      hint: "What answer does the writer want you to think of?",
      why: "Ending on a rhetorical question leaves the obvious answer ringing in your head as you finish.",
      lv: { spicy: { options: ["It leaves the reader to supply the answer, so the conclusion feels like their own idea", "It shows the writer is unsure", "It invites the reader to argue back", "It adds a statistic at the end"],
        slips: { 1: "The opposite: the writer is so sure they let you say it.", 2: "The answer is built in, so arguing back feels silly.", 3: "There is no number in it." },
        why: "If you answer it in your head, you have agreed without being told to. That is why it works as an ending." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Why it works", title: "Say what the trick does",
      fig: CHAIN,
      html: "<p>Spotting a trick is step one. The skill is saying <b>what it does to the reader</b>.</p>" +
        "<p>Try this shape: <b>The writer uses</b> a statistic, <b>\"[[Stat]]\"</b>, <b>to make the reader</b> feel the argument is proven.</p>" +
        "<p>Useful words: makes the reader feel, makes it seem, persuades, suggests, so that.</p>",
      lv: { spicy: { html: "<p>Spotting is easy. Explaining the <b>effect</b> precisely is the skill.</p>" +
        "<p><b>The writer uses</b> a statistic, \"[[Stat]]\", <b>which suggests</b> the problem is real and measurable, <b>so the reader</b> feels the viewpoint is the sensible, evidence based side.</p>" +
        "<p>Precise verbs help: suggests, implies, positions the reader, creates a sense of, makes the opposite view seem.</p>" } } },

    { type: "mc", topic: "Why it works",
      q: "Which is the best explanation of this statistic? \"[[Stat]]\"",
      options: ["It makes the argument seem proven, because numbers sound reliable", "It is a statistic", "It makes the text longer"],
      answer: 0,
      slips: { 1: "That names the trick but does not say what it does to the reader.", 2: "That is true of any sentence. What does this one do to the reader?" },
      hint: "Which one says what it does to the reader?",
      why: "It names the effect: numbers make the viewpoint sound proven.",
      lv: { spicy: { options: ["It suggests the problem is real and measurable, so the viewpoint seems the evidence based side", "It proves the writer is right", "It is a statistic, which is a persuasive technique", "It makes the reader feel sad"],
        slips: { 1: "One number cannot prove an opinion. It makes it <b>seem</b> more solid.", 2: "That names the trick but stops before the effect.", 3: "Statistics work on trust more than feelings. That is emotive language's job." },
        why: "It names what the number suggests and how that positions the reader. Effect, not just label." } } },

    { type: "text", topic: "Why it works", explain: true,
      q: "Finish the sentence: \"A rhetorical question makes the reader...\"",
      need: [["think", "wonder", "agree", "feel", "imagine", "answer", "ask", "consider", "realise", "realize", "believe"]],
      slips: [[["question mark", "a question"], "That says what it is. Now say what it does to the reader: think? agree?"]],
      model: "think about the answer and agree with the writer.",
      hint: "What happens in your head when you read a question?",
      why: "You answer it in your head, and the answer is the one the writer wanted.",
      lv: { medium: { q: "Explain the effect of \"[[Rq]]\" Start: \"The writer uses a rhetorical question to make the reader...\"",
          need: [["reader", "you", "us", "people", "audience"], ["think", "feel", "agree", "wonder", "imagine", "consider", "realise", "realize", "believe", "answer"]],
          model: "The writer uses a rhetorical question to make the reader think the answer is obvious and agree." },
            spicy: { q: "Explain the effect of \"[[Rq]]\" in one sentence. Name the trick, then say what it does to the reader.",
          need: [["rhetorical", "question"], ["reader", "you", "us", "people", "audience"], ["think", "feel", "agree", "wonder", "imagine", "consider", "realise", "realize", "believe", "answer", "suggest", "imply", "position"]],
          model: "The rhetorical question positions the reader to answer it for themselves, so they feel they have reached the writer's conclusion on their own.",
          hint: "Name it (rhetorical question), then say what it makes the reader do or feel." } } },

    { type: "write", topic: "Why it works",
      q: "Have a go at a short argument of your own, if you like. Pick something you care about, give your viewpoint, and use at least two tricks. Jay would love to read it.",
      starters: ["I believe", "Did you know that", "Imagine", "Why should"],
      checklist: ["My viewpoint", "A fact or a statistic", "Emotive language", "A rhetorical question"],
      minWords: 30,
      lv: { mild: { minWords: 20, checklist: ["My viewpoint", "A fact", "A question"] },
            spicy: { minWords: 60, checklist: ["My viewpoint", "A statistic", "An expert opinion", "Emotive language", "A rhetorical question to finish"] } } }
  ],

  realWorld: {
    title: "Tricks are everywhere",
    html: "<p>Adverts, charity appeals, election leaflets and opinion columns all use these tricks. Spotting them means you decide for yourself instead of being steered.</p>" +
      "<p>For our big question, if we could time travel, should we? Imagine two campaign posters: one for and one against. Which tricks would each side use? And which facts might each leave out?</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to a time portal, thinking about both sides">' + A2ART.portal(80, 75, 58) + A2ART.jay(240, 46, 0.85, "hmm") +
      A2ART.bubble(290, 6, 124, 52, "For or\nagainst?", 294) + '</svg>'
  },

  make: {
    title: "Make a campaign poster",
    intro: "Your own campaign: a slogan, a statistic and a rhetorical question. Use the example, or change it to something you care about. Keep it or send it to Jay.",
    fields: [
      { id: "slogan", label: "Slogan (your viewpoint)", ph: "[[Slogan]]", max: 40 },
      { id: "stat", label: "A statistic or fact", ph: "[[Stat]]", max: 100 },
      { id: "rq", label: "A rhetorical question", ph: "[[Rq]]", max: 90 },
      { id: "name", label: "Campaign name", ph: "The B5 Campaign", max: 28 }
    ],
    svg: function(v){
      var sl = wrap(v.slogan, 20, 2), st = wrap(v.stat, 40, 3), rq = wrap(v.rq, 38, 3);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 440">' +
        '<rect width="600" height="440" rx="24" fill="#ffd23f"/>' +
        '<rect x="16" y="16" width="568" height="408" rx="18" fill="#fffbe9" stroke="#141a33" stroke-width="4"/>' +
        '<g transform="translate(70 76)"><path d="M-30 -12h14l34 -22v68l-34 -22h-14z" fill="#e04848" stroke="#141a33" stroke-width="2.5"/><path d="M26 -14q10 14 0 28M34 -24q18 24 0 48" fill="none" stroke="#141a33" stroke-width="2.5" stroke-linecap="round"/></g>' +
        sl.map(function(l, k){ return T(130, 70 + k * 38, esc(l), 32, { b: 1, c: "#e04848" }); }).join("") +
        '<rect x="40" y="150" width="520" height="' + (24 + st.length * 26) + '" rx="12" fill="#e8f7ff" stroke="#141a33" stroke-width="2.5"/>' +
        st.map(function(l, k){ return T(60, 178 + k * 26, esc(l), 18); }).join("") +
        '<path d="M60 274h480q16 0 16 16v' + (rq.length * 26 + 2) + 'q0 16 -16 16h-420l-20 18 -4 -18h-36q-16 0 -16 -16v-' + (rq.length * 26 + 2) + 'q0 -16 16 -16z" transform="translate(-12 0)" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
        rq.map(function(l, k){ return T(60, 302 + k * 26, esc(l), 19, { b: 1, i: 1 }); }).join("") +
        T(560, 410, esc(wrap(v.name, 28, 1)[0] || ""), 15, { b: 1, a: "end", c: "#5b6180" }) +
        '</svg>';
    }
  }
};
})();
