/* Base 5 Autumn 2 activity: Can you check it?
   English. Facts are things you could check. ASCII only. */
(function(){
var A = window.A2ART;

/* a magnifying glass over four ways of checking */
var CHECKS =
  '<svg viewBox="0 0 520 200" role="img" aria-label="Four ways to check a fact: count it, measure it, look it up, see it">' +
  '<rect x="0" y="0" width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  [["Count it", "#ffd23f", '<circle cx="0" cy="-6" r="6" fill="#141a33"/><circle cx="16" cy="-6" r="6" fill="#141a33"/><circle cx="-16" cy="-6" r="6" fill="#141a33"/><circle cx="8" cy="10" r="6" fill="#141a33"/><circle cx="-8" cy="10" r="6" fill="#141a33"/>'],
   ["Measure it", "#22b8e6", '<rect x="-30" y="-8" width="60" height="16" rx="3" fill="#fff" stroke="#141a33" stroke-width="2.5"/><path d="M-20 -8v8M-10 -8v5M0 -8v8M10 -8v5M20 -8v8" stroke="#141a33" stroke-width="2"/>'],
   ["Look it up", "#19c39a", '<rect x="-22" y="-18" width="44" height="34" rx="3" fill="#fff" stroke="#141a33" stroke-width="2.5"/><path d="M0 -18v34" stroke="#141a33" stroke-width="2"/><path d="M-16 -8h10M-16 0h10M6 -8h10M6 0h10" stroke="#141a33" stroke-width="2"/>'],
   ["See it", "#ff5d8f", '<path d="M-26 0q26 -24 52 0q-26 24 -52 0z" fill="#fff" stroke="#141a33" stroke-width="2.5"/><circle cx="0" cy="0" r="8" fill="#141a33"/>']
  ].map(function(c, k){
    var x = 70 + k * 127;
    return '<g transform="translate(' + x + ' 82)"><circle r="44" fill="' + c[1] + '" fill-opacity=".35" stroke="#141a33" stroke-width="2.5"/>' + c[2] +
      '<text y="72" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="16" font-weight="700" fill="#141a33">' + c[0] + '</text></g>';
  }).join("") +
  A2ART.egg(A2ART.bird(492, 26, 0.7, "#3a8fd6"), "A bird, checking the facts from above. Jay would approve.") +
  '</svg>';

/* a notice board with three notes, themed */
function board(notes){
  return '<svg viewBox="0 0 520 230" role="img" aria-label="A notice board with three notes">' +
    '<rect x="4" y="4" width="512" height="222" rx="14" fill="#c99a63" stroke="#7a5532" stroke-width="5"/>' +
    notes.map(function(n, k){
      var x = 22 + k * 166, r = [-3, 2, -1][k];
      return '<g transform="rotate(' + r + ' ' + (x + 72) + ' 110)"><rect x="' + x + '" y="28" width="146" height="170" rx="6" fill="' + ["#fffbe0", "#e8f7ff", "#ffeef4"][k] + '" stroke="#141a33" stroke-opacity=".25" stroke-width="2"/>' +
        '<circle cx="' + (x + 73) + '" cy="40" r="7" fill="#e04848"/>' +
        '<text x="' + (x + 12) + '" y="64" font-family="Verdana,Arial,sans-serif" font-size="13" font-weight="700" fill="#141a33">Note ' + "ABC".charAt(k) + '</text>' +
        n.map(function(line, j){ return '<text x="' + (x + 12) + '" y="' + (88 + j * 20) + '" font-family="Verdana,Arial,sans-serif" font-size="13" fill="#141a33">' + line + '</text>'; }).join("") + '</g>';
    }).join("") + '</svg>';
}

(window.A2PACKS = window.A2PACKS || {})["fact-check"] = {
  a2: true,
  id: "a2-fact-check",
  title: "Can you check it?",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "A fact is something you could check. Count it, measure it, look it up or see it.",
  blurb: "Spotting facts: the things in a text that you could actually check. Four short chunks, with a fact card to make at the end.",
  note: "Spotting facts: the things you could actually check. Four five minute chunks, and a fact card to make at the end. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Rumour", line: "Rumour: short sentences, one fact at a time." },
    { id: "medium", name: "Report", line: "Report: longer texts, facts mixed in with other things." },
    { id: "spicy", name: "Investigation", line: "Investigation: tricky ones, like facts that turn out to be wrong." }
  ],
  themes: {
    time: { name: "Time travel", w: { place: "the museum", thing: "time machine", thing2: "portal", who: "the time traveller", event: "the trip back to 1966", big: "Big Ben", num: "3", unit: "minutes", score: "1966 is the year England won the World Cup" } },
    football: { name: "Football", w: { place: "the stadium", thing: "match ball", thing2: "goal net", who: "the striker", event: "the cup final", big: "Wembley", num: "3", unit: "goals", score: "the match ended 2 1" } },
    horror: { name: "Horror", w: { place: "the old hospital", thing: "torch", thing2: "lift", who: "the night porter", event: "the night shift", big: "the clock tower", num: "3", unit: "doors", score: "the lift stops at floor 3" } },
    fishing: { name: "Fishing", w: { place: "the lake", thing: "rod", thing2: "keep net", who: "the angler", event: "the match day", big: "the boat house", num: "3", unit: "fish", score: "the biggest carp weighed 9 kg" } },
    music: { name: "Music", w: { place: "the theatre", thing: "microphone", thing2: "stage", who: "the singer", event: "opening night", big: "the West End", num: "3", unit: "songs", score: "the show runs for 2 hours" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: CHECKS,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Could you check it?", title: "A fact is something you could check",
      fig: CHECKS,
      html: "<p>If you could <b>count it, measure it, look it up or see it</b>, it is a fact.</p>" +
        "<p><b>[[Place]] has [[num]] [[unit]].</b> You could count them. That is a fact.</p>" +
        "<p><b>[[Place]] is brilliant.</b> You cannot count, measure or look up brilliant. That is not a fact.</p>",
      lv: { spicy: { html: "<p>If you could <b>count it, measure it, look it up or see it</b>, it is a fact.</p>" +
        "<p>Here is the twist: a fact can be checked <b>even if it turns out to be wrong</b>. \"[[Big]] is 3 metres tall\" is a checkable statement. Checking it shows it is wrong, but it is still the kind of thing you can check.</p>" +
        "<p>So the question is never \"is it true?\" first. It is \"<b>could I check it?</b>\"</p>" } } },

    { type: "mc", topic: "Could you check it?",
      q: "Which one could you check?",
      options: ["[[Place]] has [[num]] [[unit]].", "[[Place]] is the best place ever.", "[[Place]] feels a bit scary."],
      answer: 0,
      slips: { 1: "\"Best\" is what someone thinks. You cannot count or measure best.", 2: "\"Feels scary\" is a feeling. Two people could feel different things." },
      hint: "Which one could you count?",
      why: "You could count the [[unit]]. Counting is checking, so it is a fact.",
      lv: { spicy: { q: "Which one is the kind of thing you could check?",
        options: ["[[Place]] is the best place ever.", "[[Place]] opened in 1850.", "[[Place]] is better than anywhere else.", "Everyone loves [[place]]."],
        answer: 1,
        slips: { 0: "\"Best\" is an opinion: you cannot measure it.", 2: "\"Better than anywhere\" is a judgement, not a check.", 3: "\"Everyone\" sounds checkable, but \"loves\" is a feeling. You could not ask every person alive." },
        why: "You could look up when it opened. Even if the date turned out wrong, it is still checkable." } } },

    { type: "sort", topic: "Could you check it?",
      q: "Sort them. Could you check it?",
      buckets: ["I could check it", "I could not check it"],
      cards: [["The [[thing]] is 2 metres long.", 0], ["The [[thing]] is cool.", 1], ["[[Who]] has [[num]] bags.", 0], ["[[Who]] is annoying.", 1]],
      hint: "Ask: could I count it, measure it, look it up or see it?",
      why: "Metres and bags can be measured and counted. Cool and annoying are what someone thinks.",
      lv: { medium: { cards: [["The [[thing]] is 2 metres long.", 0], ["The [[thing]] is cool.", 1], ["[[Who]] has [[num]] bags.", 0], ["[[Who]] is annoying.", 1], ["[[Event]] starts at 7pm.", 0], ["[[Event]] will be amazing.", 1]] },
            spicy: { cards: [["The [[thing]] is 2 metres long.", 0], ["The [[thing]] is far too long.", 1], ["[[Event]] starts at 7pm.", 0], ["[[Event]] will be amazing.", 1], ["[[Big]] is 500 metres tall.", 0], ["[[Big]] is the most famous place in Britain.", 1]],
              why: "\"[[Big]] is 500 metres tall\" is checkable (and you would find it is wrong). \"Far too long\" and \"most famous\" are judgements." } } },

    { type: "mc", topic: "Could you check it?", explain: true,
      q: "Bonnie says: \"I am a brown poodle.\" Could you check it?",
      fig: '<svg viewBox="0 0 300 150" role="img" aria-label="Bonnie the poodle">' + A2ART.bonnie(150, 92, 1.3, "sit") + '</svg>',
      options: ["Yes, you could see it.", "No, it is just what Bonnie thinks."],
      answer: 0, fixed: true,
      slips: { 1: "Brown is a colour you can see, and poodle is a kind of dog you can look up." },
      hint: "Could you see it with your own eyes?",
      why: "You could look at her. Brown and poodle are both things you can see. Bonnie has no tail, too. Also checkable." },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Facts on a notice board",
      title: "Facts hide in among other things",
      fig: board([["[[Event]]", "starts at 7pm."], ["[[Event]]", "will be the", "best night ever."], ["Tickets cost", "5 pounds."]]),
      html: "<p>Real texts mix facts with other things: feelings, guesses and what people think.</p>" +
        "<p>Note A has a time. You could check a time. Note C has a price. You could check a price. Note B is a guess about the future.</p>" },

    { type: "mc", topic: "Facts on a notice board",
      q: "Which note is <b>not</b> a fact?",
      fig: board([["[[Event]]", "starts at 7pm."], ["[[Event]]", "will be the", "best night ever."], ["Tickets cost", "5 pounds."]]),
      options: ["Note A", "Note B", "Note C"], answer: 1, fixed: true,
      slips: { 0: "Note A gives a time. You could check a time on a clock or a poster.", 2: "Note C gives a price. You could check a price." },
      hint: "Which one could nobody check yet?",
      why: "\"Best night ever\" is a guess and an opinion. Nobody can check it." },

    { type: "multi", topic: "Facts on a notice board",
      q: "Pick the <b>two</b> facts.",
      options: ["The [[thing2]] is red.", "The [[thing2]] is ugly.", "There are [[num]] [[unit]].", "This is a fun day out."],
      answers: [0, 2],
      hint: "Look for a colour you could see and a number you could count.",
      why: "Red can be seen. [[num]] [[unit]] can be counted. Ugly and fun are what someone thinks.",
      lv: { spicy: { q: "Pick the <b>two</b> statements that could be checked.",
        options: ["Last year, [[score]].", "Nobody will ever forget it.", "The [[thing2]] was made in 1999.", "It was the greatest moment in history."],
        answers: [0, 2],
        why: "A result and a date can be looked up. \"Nobody will forget\" and \"greatest\" are claims nobody can check." } } },

    { type: "text", topic: "Facts on a notice board",
      q: "Write <b>one</b> fact about the room you are in right now. Something anyone could check.",
      need: [["there", "is", "are", "has", "have", "the", "my", "a", "it"]],
      model: "There are four chairs in this room.",
      hint: "Count something, or say a colour you can see.",
      why: "Anything you can count, measure or see in the room works. \"There are 4 chairs\" is a fact. \"This room is boring\" is not." },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "How would you check it?",
      title: "Every fact has a way to check it",
      html: "<p>When you spot a fact, ask <b>how</b> you would check it.</p>" +
        "<p><b>Count it:</b> how many. <b>Measure it:</b> how long, how heavy, how hot. <b>Look it up:</b> dates, prices, records. <b>See it:</b> colours, shapes, what is there.</p>",
      fig: CHECKS },

    { type: "match", topic: "How would you check it?",
      q: "Match each fact to how you would check it.",
      pairs: [["There are [[num]] [[unit]].", "Count it"], ["The [[thing]] is 2 metres long.", "Measure it"], ["[[Place]] opened in 1850.", "Look it up"], ["The [[thing2]] is red.", "See it"]],
      hint: "Numbers of things: count. Metres: measure. Years: look up. Colours: see.",
      why: "Each fact has its own way to check it. That is what makes it a fact." },

    { type: "mc", topic: "How would you check it?",
      q: "\"The [[thing]] weighs 3 kilograms.\" How would you check it?",
      options: ["Weigh it on scales.", "Ask a friend if they like it.", "Count the letters in the word."],
      answer: 0,
      slips: { 1: "Liking something is an opinion. It cannot tell you the weight.", 2: "Counting letters would not tell you how heavy it is." },
      hint: "Kilograms are a weight.",
      why: "Kilograms are measured on scales." },

    { type: "num", topic: "How would you check it?",
      q: "Count the birds in the picture. Then finish the fact: \"There are ___ birds.\"",
      fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Some birds on a wire">' +
        '<path d="M0 70q210 40 420 0" stroke="#141a33" stroke-width="3" fill="none"/>' +
        A2ART.bird(70, 64, 0.9, "#3a8fd6") + A2ART.bird(150, 74, 0.9, "#ff5d5d") + A2ART.bird(230, 78, 0.9, "#19c39a") + A2ART.bird(310, 72, 0.9, "#ffd23f") + A2ART.bird(380, 62, 0.9, "#8a5cf6") +
        A2ART.egg('<text x="396" y="138" font-family="Verdana" font-size="11" fill="#141a33" fill-opacity=".45">psst</text>', "Jay's favourite thing about this question: all of it. He likes birds.") +
        '</svg>',
      boxes: [{ label: "Birds", a: 5 }],
      slips: [[4, "Close. Count again, touching each bird as you go. There is one more."], [6, "One too many. Count again, one at a time."]],
      hint: "Point at each bird as you count.",
      why: "There are <b>5</b> birds. You checked it by counting, so \"There are 5 birds\" is a fact.",
      lv: { spicy: { q: "The poster says \"Six birds live on this wire.\" Count them. Is the poster right? Type how many there really are.",
        why: "There are <b>5</b>. The poster's statement was checkable, and checking shows it is wrong. It was still a fact-type statement: you could test it." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Fact hunt",
      title: "Fact hunt",
      html: "<p>Last one. Here is a short piece about [[event]]. Read it once, then hunt for the facts.</p>" +
        "<p class=\"a2task\">[[Event]] took place at [[place]]. It started at 7pm and finished at 9pm. There were 200 people there. It was the most exciting night of the year, and everyone went home happy. [[Who]] arrived on the number 12 bus.</p>",
      lv: { mild: { html: "<p>Last one. Here is a short piece. Read it once, then hunt for the facts.</p>" +
        "<p class=\"a2task\">[[Event]] was at [[place]]. It started at 7pm. It was great fun.</p>" } } },

    { type: "mc", topic: "Fact hunt",
      q: "Which of these is a fact from the piece?",
      options: ["It started at 7pm.", "It was the most exciting night of the year.", "Everyone went home happy."],
      answer: 0,
      slips: { 1: "\"Most exciting\" is someone's opinion.", 2: "You could not check that every single person was happy." },
      hint: "Find the one with a time in it.",
      why: "A time can be checked.",
      lv: { mild: { options: ["It started at 7pm.", "It was great fun."], slips: { 1: "\"Great fun\" is what someone thinks." } } } },

    { type: "multi", topic: "Fact hunt",
      q: "Pick <b>all three</b> facts from the piece.",
      options: ["There were 200 people there.", "It finished at 9pm.", "[[Who]] arrived on the number 12 bus.", "It was the most exciting night of the year.", "Everyone went home happy."],
      answers: [0, 1, 2],
      hint: "A number of people, a time, and a bus number.",
      why: "200 people, 9pm and the number 12 bus can all be checked. The other two are opinions.",
      lv: { mild: { q: "Pick the fact from the piece.",
        options: ["It was at [[place]].", "It was great fun."], answers: [0],
        why: "Where it happened can be checked. Great fun is an opinion." } } },

    { type: "text", topic: "Fact hunt", stretch: true,
      q: "Turn this opinion into a fact: \"[[Event]] was really long.\" Write a sentence that someone could check.",
      need: [["hour", "hours", "minute", "minutes", "pm", "am", "o'clock", "oclock", "1", "2", "3", "4", "5", "6", "7", "8", "9", "two", "three"]],
      slips: [[["really long", "very long", "so long"], "That still says how it felt. Put a time or a number in instead."]],
      model: "[[Event]] lasted for 2 hours.",
      hint: "Use a number of hours or minutes.",
      why: "\"It lasted 2 hours\" can be checked on a clock. \"Really long\" is how it felt." }
  ],

  realWorld: {
    title: "Fact checkers are a real job",
    html: "<p>News teams pay people to check facts before a story goes out. They ask the same question you have been asking: <b>could I check it, and how?</b></p>" +
      "<p>It matters for our big question too. If someone came back from the past and told you what they saw, which parts could you check?</p>",
    fig: '<svg viewBox="0 0 420 140" role="img" aria-label="A time traveller stepping out of a portal">' + A2ART.portal(80, 70, 56) + A2ART.jay(250, 50, 0.85, "hmm") +
      A2ART.bubble(300, 6, 112, 52, "Could I\ncheck it?", 304) + '</svg>'
  },

  make: {
    title: "Make a fact card",
    intro: "One fact, and how you would check it. Stick it on the wall or send it to Jay.",
    fields: [
      { id: "fact", label: "My fact", ph: "There are 6 windows in Base 5.", max: 70 },
      { id: "how", label: "How you could check it", ph: "Count them.", max: 40 },
      { id: "name", label: "Fact checker", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      function e(t){ return String(t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n){ var w = String(t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, 3); }
      var lines = wrap(v.fact, 30);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380">' +
        '<rect width="600" height="380" rx="24" fill="#fffbe9"/>' +
        '<rect x="14" y="14" width="572" height="352" rx="18" fill="none" stroke="#141a33" stroke-width="4" stroke-dasharray="14 8"/>' +
        '<text x="40" y="66" font-family="Verdana,Arial,sans-serif" font-size="22" font-weight="700" fill="#e04848" letter-spacing="3">CHECKED FACT</text>' +
        lines.map(function(l, k){ return '<text x="40" y="' + (122 + k * 40) + '" font-family="Verdana,Arial,sans-serif" font-size="32" font-weight="700" fill="#141a33">' + e(l) + '</text>'; }).join("") +
        '<text x="40" y="282" font-family="Verdana,Arial,sans-serif" font-size="20" fill="#141a33">How to check: ' + e(v.how) + '</text>' +
        '<text x="40" y="330" font-family="Verdana,Arial,sans-serif" font-size="18" fill="#5b6180">Fact checker: ' + e(v.name) + '</text>' +
        '<g transform="translate(500 290) rotate(-12)"><circle r="56" fill="none" stroke="#1f9d63" stroke-width="6"/><text y="8" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="22" font-weight="700" fill="#1f9d63">TRUE?</text></g>' +
        '</svg>';
    }
  }
};
})();
