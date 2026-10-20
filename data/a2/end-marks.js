/* Base 5 Autumn 2 activity: Question or exclamation?
   English. Question marks, exclamation marks and full stops, and choosing
   the end mark for the meaning. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, extra){ extra = extra || ""; return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (/fill=/.test(extra) ? "" : ' fill="#141a33"') + extra + '>' + s + '</text>'; }
function chip(x, y, t, c){ var w = 18 + t.length * 10; return '<rect x="' + (x - w / 2) + '" y="' + (y - 18) + '" width="' + w + '" height="28" rx="14" fill="' + c + '" stroke="#141a33" stroke-width="2"/>' + T(x, y + 1, t, 15, ' text-anchor="middle" font-weight="700"'); }

/* the question mark and its words */
var QFIG =
  '<svg viewBox="0 0 520 210" role="img" aria-label="A big question mark surrounded by question words: who, what, where, when, why, how, can, do, is">' +
  '<rect width="520" height="210" rx="16" fill="#eef6ff"/>' +
  '<circle cx="260" cy="105" r="66" fill="#3a8fd6"/>' + T(260, 140, "?", 96, ' text-anchor="middle" font-weight="700" fill="#ffffff"') +
  chip(90, 44, "Who", "#ffd23f") + chip(80, 104, "What", "#ffd23f") + chip(96, 164, "Where", "#ffd23f") +
  chip(430, 44, "When", "#ffd23f") + chip(440, 104, "Why", "#ffd23f") + chip(426, 164, "How", "#ffd23f") +
  chip(186, 26, "Can", "#bfe9ff") + chip(340, 26, "Do", "#bfe9ff") + chip(260, 196, "Is", "#bfe9ff") +
  A.egg(A.bird(488, 196, 0.6, "#8a5cf6"), "Who? Who? An owl, asking questions all night. Jay approves of owls.") +
  '</svg>';

/* the exclamation burst */
var EXFIG =
  '<svg viewBox="0 0 520 210" role="img" aria-label="A big exclamation mark in a burst, with feelings around it: surprise, excitement, fear, anger, loud">' +
  '<rect width="520" height="210" rx="16" fill="#fff1f4"/>' +
  '<path d="M260 22l18 40 42 -18 -10 44 44 14 -40 24 26 36 -44 -4 -4 44 -32 -30 -32 30 -4 -44 -44 4 26 -36 -40 -24 44 -14 -10 -44 42 18z" fill="#ff5d8f" stroke="#141a33" stroke-width="2.5"/>' +
  T(260, 142, "!", 84, ' text-anchor="middle" font-weight="700" fill="#ffffff"') +
  chip(84, 48, "Surprise", "#ffd23f") + chip(76, 108, "Excitement", "#ffd23f") + chip(90, 168, "Fear", "#ffd23f") +
  chip(440, 48, "Anger", "#ffd23f") + chip(446, 108, "Pain", "#ffd23f") + chip(432, 168, "Loud", "#ffd23f") +
  A.egg(A.bonnie(484, 178, 0.42, "sit"), "Bonnie only speaks in exclamation marks. Woof!") +
  '</svg>';

/* Jay and the goblin */
var GOBLIN =
  '<svg viewBox="0 0 420 170" role="img" aria-label="Jay shouting at a little goblin who has his bird book">' +
  '<rect width="420" height="170" rx="16" fill="#f4f1ea"/>' +
  A.jay(100, 68, 0.95, "wow") + A.bubble(160, 12, 190, 36, "Unhand me, goblin __", 190) +
  '<g transform="translate(290 120)"><ellipse cx="0" cy="20" rx="26" ry="22" fill="#6bbf59"/><circle cx="0" cy="-12" r="20" fill="#7fd36a"/>' +
  '<path d="M-18 -18l-16 -10 10 16M18 -18l16 -10 -10 16" fill="#7fd36a"/><circle cx="-7" cy="-14" r="3" fill="#141a33"/><circle cx="7" cy="-14" r="3" fill="#141a33"/>' +
  '<path d="M-6 -4q6 5 12 0" stroke="#141a33" stroke-width="2" fill="none"/>' +
  '<rect x="16" y="6" width="30" height="22" rx="3" fill="#3a8fd6" stroke="#141a33" stroke-width="2"/></g>' +
  T(342, 160, "bird book", 13, ' fill="#5b6180"') +
  '</svg>';

/* how to choose */
var FLOW =
  '<svg viewBox="0 0 520 230" role="img" aria-label="Choosing the end mark. Is it asking something? Yes: question mark. No: is it a strong feeling or a shout? Yes: exclamation mark. No: full stop.">' +
  '<rect width="520" height="230" rx="16" fill="#f3efff"/>' +
  '<rect x="24" y="20" width="270" height="50" rx="12" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' + T(40, 51, "Is it asking something?", 16, ' font-weight="700"') +
  '<path d="M294 45h70M354 37l12 8 -12 8" stroke="#141a33" stroke-width="3" fill="none"/>' + T(312, 36, "Yes", 14, ' font-weight="700" fill="#0f7d5e"') +
  '<circle cx="410" cy="45" r="30" fill="#3a8fd6"/>' + T(410, 60, "?", 40, ' text-anchor="middle" font-weight="700" fill="#ffffff"') +
  '<path d="M100 70v34M92 96l8 10 8 -10" stroke="#141a33" stroke-width="3" fill="none"/>' + T(112, 94, "No", 14, ' font-weight="700" fill="#c2185b"') +
  '<rect x="24" y="110" width="270" height="50" rx="12" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' + T(40, 132, "Strong feeling", 16, ' font-weight="700"') + T(40, 152, "or a shout?", 16, ' font-weight="700"') +
  '<path d="M294 135h70M354 127l12 8 -12 8" stroke="#141a33" stroke-width="3" fill="none"/>' + T(312, 126, "Yes", 14, ' font-weight="700" fill="#0f7d5e"') +
  '<circle cx="410" cy="135" r="30" fill="#ff5d8f"/>' + T(410, 150, "!", 40, ' text-anchor="middle" font-weight="700" fill="#ffffff"') +
  '<path d="M100 160v26M92 178l8 10 8 -10" stroke="#141a33" stroke-width="3" fill="none"/>' + T(112, 182, "No", 14, ' font-weight="700" fill="#c2185b"') +
  '<circle cx="100" cy="208" r="16" fill="#19c39a"/><circle cx="100" cy="208" r="5" fill="#141a33"/>' + T(126, 214, "Full stop: calm telling", 15, ' font-weight="700"') +
  '</svg>';

/* a text message with gaps */
var PHONE =
  '<svg viewBox="0 0 520 220" role="img" aria-label="A phone with a text conversation. Each message has a gap where the end mark goes.">' +
  '<rect width="520" height="220" rx="16" fill="#eef8f3"/>' +
  '<rect x="150" y="8" width="220" height="204" rx="22" fill="#141a33"/><rect x="160" y="26" width="200" height="170" rx="10" fill="#ffffff"/>' +
  '<rect x="170" y="38" width="150" height="30" rx="12" fill="#e4e7f2"/>' + T(180, 58, "Where are you", 14) + '<rect x="297" y="44" width="16" height="18" rx="3" fill="none" stroke="#e04848" stroke-width="2" stroke-dasharray="3 2"/>' +
  '<rect x="200" y="78" width="150" height="30" rx="12" fill="#bfe9ff"/>' + T(210, 98, "Nearly there", 14) + '<rect x="320" y="84" width="16" height="18" rx="3" fill="none" stroke="#e04848" stroke-width="2" stroke-dasharray="3 2"/>' +
  '<rect x="170" y="118" width="150" height="30" rx="12" fill="#e4e7f2"/>' + T(180, 138, "Are you close", 14) + '<rect x="297" y="124" width="16" height="18" rx="3" fill="none" stroke="#e04848" stroke-width="2" stroke-dasharray="3 2"/>' +
  '<rect x="200" y="158" width="150" height="30" rx="12" fill="#bfe9ff"/>' + T(210, 178, "Look up, I see", 14) + '<rect x="326" y="164" width="16" height="18" rx="3" fill="none" stroke="#e04848" stroke-width="2" stroke-dasharray="3 2"/>' +
  T(30, 110, "Read it out", 15, ' font-weight="700"') + T(30, 130, "loud: hear", 15) + T(30, 150, "the marks.", 15) +
  T(392, 100, "Voice up?", 15, ' font-weight="700" fill="#3a5bd6"') + T(392, 120, "That is ?", 15) + T(392, 150, "Loud?", 15, ' font-weight="700" fill="#c2185b"') + T(392, 170, "That is !", 15) +
  '</svg>';

function esc(t){ return String(t == null ? "" : t).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function wrap(t, n, max){ var w = String(t == null ? "" : t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if(!x) return; while(x.length > n){ if(cur){ out.push(cur); cur = ""; } out.push(x.slice(0, n)); x = x.slice(n); } if((cur + " " + x).trim().length > n){ out.push(cur.trim()); cur = x; } else cur = (cur + " " + x).trim(); }); if(cur) out.push(cur); return out.slice(0, max || 3); }

var MARKS = ["A question mark", "An exclamation mark", "A full stop"];

(window.A2PACKS = window.A2PACKS || {})["end-marks"] = {
  a2: true,
  id: "a2-end-marks",
  title: "Question or exclamation?",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "Asking gets a question mark. A strong feeling gets an exclamation mark. Calm telling gets a full stop.",
  blurb: "Question marks, exclamation marks and full stops, and how to choose the right one for what you mean. Four short chunks, then a speech bubble poster to make.",
  note: "Question marks and exclamation marks, and picking the right end mark. Four five minute chunks and a speech bubble poster at the end. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Whisper", line: "Whisper: short sentences, one end mark at a time." },
    { id: "medium", name: "Chatter", line: "Chatter: trickier sentences, like ones that start with How but are not questions." },
    { id: "spicy", name: "Shout", line: "Shout: hidden questions, questions that do not want an answer, and marks used for effect." }
  ],
  themes: {
    time: { name: "Time travel", w: { who: "the time traveller", place: "the year 1900", thing: "the time machine", big: "a dinosaur" } },
    football: { name: "Football", w: { who: "the striker", place: "the stadium", thing: "the match ball", big: "a goal in the last minute" } },
    horror: { name: "Horror", w: { who: "the night porter", place: "the old hotel", thing: "the torch", big: "a ghost" } },
    fishing: { name: "Fishing", w: { who: "the angler", place: "the lake", thing: "the rod", big: "a giant pike" } },
    music: { name: "Music", w: { who: "the singer", place: "the theatre", thing: "the microphone", big: "a standing ovation" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: FLOW,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Asking something", title: "Asking? Use a question mark",
      fig: QFIG,
      html: "<p>A <b>question</b> asks something. It wants an answer. It ends with a <b>question mark</b> (?).</p>" +
        "<p>Lots of questions start with <b>who, what, where, when, why</b> or <b>how</b>. Others start with <b>can, do, is, are</b> or <b>will</b>.</p>" +
        "<p class=\"a2task\">Where is [[thing]]?<br>Can you see [[who]]?</p>",
      lv: {
        mild: { html: "<p>A <b>question</b> asks something. It ends with a <b>question mark</b> (?).</p><p class=\"a2task\">Where is [[thing]]?<br>Can you see it?</p>" },
        spicy: { html: "<p>A <b>direct question</b> asks something and ends with a <b>question mark</b> (?). It often starts with a question word (who, what, where, when, why, how) or a verb (can, do, is, have, will).</p>" +
          "<p class=\"a2task\">Where is [[thing]]?</p>" +
          "<p>Watch out for <b>indirect</b> questions. They talk <b>about</b> a question without asking it, so they end with a full stop:</p>" +
          "<p class=\"a2task\">I wonder where [[thing]] is.<br>[[Who]] asked where [[thing]] was.</p>" } } },

    { type: "mc", topic: "Asking something",
      q: "Which one is a question?",
      options: ["Can you help me find [[thing]]?", "[[Who]] put [[thing]] by the door.", "Please help me find [[thing]]."],
      answer: 0,
      slips: { 1: "That tells you where it is. It does not ask anything.", 2: "That asks for help, but it is worded as telling someone. Can you... is the question." },
      hint: "Which one could you answer with yes or no?",
      why: "\"Can you help me...?\" asks something, so it is a question and ends with a question mark.",
      lv: {
        mild: { options: ["Where is [[thing]]?", "[[Thing]] is here.", "I can see [[thing]]."],
          slips: { 1: "That tells you something. It does not ask.", 2: "That tells you something. It does not ask." },
          hint: "Look for Where.", why: "\"Where is...?\" asks something. It is a question." },
        spicy: { q: "Which one is a <b>direct</b> question?",
          options: ["Have you seen [[thing]]?", "I wonder where [[thing]] went.", "[[Who]] asked where [[thing]] was."],
          slips: { 1: "It is about a question, but it does not ask one directly. That is an indirect question: full stop.", 2: "That reports what someone asked. It tells you, so it is a full stop." },
          hint: "Which one is actually asking you something?",
          why: "\"Have you seen...?\" asks directly. The other two only talk about a question." } } },

    { type: "sort", topic: "Asking something",
      q: "Sort them. Is it asking or telling? (The end marks are missing.)",
      buckets: ["Asking: ?", "Telling: ."],
      cards: [["Where is the toilet", 0], ["What time is it", 0], ["[[Who]] is at [[place]]", 1], ["I am hungry", 1]],
      hint: "Read each one aloud. Does your voice go up, like you want an answer?",
      why: "Where and What are asking. The other two tell you something.",
      lv: {
        medium: { cards: [["Where is the toilet", 0], ["What time is it", 0], ["[[Who]] is at [[place]]", 1], ["I am hungry", 1], ["Do you like it", 0], ["The door is open", 1]] },
        spicy: { cards: [["Where is the toilet", 0], ["Is it raining", 0], ["[[Who]] is at [[place]]", 1], ["I asked what time it was", 1], ["Do you like it", 0], ["I wonder if the door is open", 1]],
          why: "\"I asked what time it was\" and \"I wonder if...\" are indirect: they talk about a question, so they are telling." } } },

    { type: "mc", topic: "Asking something",
      q: "What end mark does this need?<p class=\"a2task\">How many people are at [[place]]</p>",
      options: MARKS, answer: 0, fixed: true,
      slips: { 1: "Nobody is shouting. It starts with How many: it is asking.", 2: "It is not telling. How many... wants an answer." },
      hint: "Does it want an answer?",
      why: "\"How many...\" asks something, so it needs a question mark.",
      lv: { spicy: { q: "What end mark does this need?<p class=\"a2task\">I asked how many people were at [[place]]</p>",
        answer: 2,
        slips: { 0: "It has a question inside it, but it is telling you what I asked. Reported questions take a full stop.", 1: "No strong feeling here: just calm telling." },
        hint: "Is it asking you, or telling you what someone asked?",
        why: "It reports a question rather than asking one, so it ends with a full stop." } } },

    { type: "text", topic: "Asking something",
      q: "Write a question you could ask [[who]]. Start it with who, what, where, when, why or how, and end it with a question mark.",
      need: [["who", "what", "where", "when", "why", "how"]],
      slips: [[["i like", "i am", "i think"], "That sounds like telling. A question asks something: try starting with What or Where."]],
      model: "What is the best part of your day?",
      hint: "Think of something you would like to know about them.",
      why: "Any question that asks them something works, as long as it ends with a question mark.",
      lv: {
        mild: { q: "Write a question you could ask [[who]]. You could start with what, where, can or do. End it with a question mark.",
          need: [["who", "what", "where", "when", "why", "how", "can", "do", "does", "is", "are", "will", "did"]],
          model: "Where do you live?" },
        spicy: { q: "Write a question to ask [[who]] that does <b>not</b> start with a question word. Start with a verb like can, do, is, are, have or will. End it with a question mark.",
          need: [["can", "could", "do", "does", "did", "is", "are", "was", "were", "have", "has", "will", "would", "should"]],
          model: "Have you ever been scared at work?",
          hint: "Questions like \"Is it...\" or \"Have you...\" flip the order of the words." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Strong feelings", title: "Strong feeling? Use an exclamation mark",
      fig: EXFIG,
      html: "<p>An <b>exclamation mark</b> (!) shows a <b>strong feeling</b>: surprise, excitement, fear, anger or pain. It is also used when something is said loudly or urgently.</p>" +
        "<p class=\"a2task\">Wow, [[big]]!<br>Watch out!<br>Ouch, my toe!</p>",
      lv: {
        mild: { html: "<p>An <b>exclamation mark</b> (!) shows a <b>big feeling</b> or a <b>shout</b>.</p><p class=\"a2task\">Wow, [[big]]!<br>Help!</p>" },
        spicy: { html: "<p>An <b>exclamation mark</b> (!) shows strong feeling or urgency. It also ends an <b>exclamative</b> sentence: ones that start <b>What a...</b> or <b>How...</b> but are not asking anything.</p>" +
          "<p class=\"a2task\">What a night that was!<br>How brave you were!<br>Get down, now!</p>" +
          "<p>In careful writing, one is plenty. Never stack them up like this!!!</p>" } } },

    { type: "mc", topic: "Strong feelings",
      q: "A goblin has grabbed Jay's bird book. Jay shouts: \"Unhand me, goblin\". Which end mark should go in the gap?",
      fig: GOBLIN,
      options: MARKS, answer: 1, fixed: true,
      slips: { 0: "Jay is not asking the goblin anything. He is shouting.", 2: "A full stop is calm. Jay is not calm. He wants his bird book back." },
      hint: "Is Jay calm, or shouting?",
      why: "Jay is shouting with a strong feeling, so it is an exclamation mark: \"Unhand me, goblin!\"" },

    { type: "match", topic: "Strong feelings",
      q: "Match each exclamation to the feeling behind it.",
      pairs: [["Wow, [[big]]!", "Surprise"], ["Watch out, it is falling!", "Danger"], ["Yes, we did it!", "Excitement"], ["Get out of my room!", "Anger"]],
      hint: "Watch out is a warning. Yes, we did it is a celebration.",
      why: "Every one is a strong feeling. That is why they all end with an exclamation mark.",
      lv: {
        mild: { pairs: [["Wow, [[big]]!", "Surprise"], ["Watch out, it is falling!", "Danger"], ["Yes, we did it!", "Happy"]] },
        spicy: { pairs: [["Wow, [[big]]!", "Surprise"], ["Watch out, it is falling!", "Danger"], ["Yes, we did it!", "Excitement"], ["Get out of my room!", "Anger"], ["Ouch, my toe!", "Pain"]] } } },

    { type: "mc", topic: "Strong feelings", explain: true,
      q: "Which one needs an exclamation mark?",
      options: ["What a night at [[place]] that was", "What time do we get to [[place]]", "We get to [[place]] at three"],
      answer: 0,
      slips: { 1: "It starts with What, but this one really asks: question mark.", 2: "That is calm telling: full stop." },
      hint: "Two start with What. Only one is really asking.",
      why: "\"What a night that was\" is not asking anything. It is a strong feeling, so it takes an exclamation mark.",
      lv: {
        mild: { options: ["Help, the boat is sinking", "The boat is blue", "Where is the boat"],
          slips: { 1: "That is calm telling: a full stop.", 2: "That is asking: a question mark." },
          hint: "Which one would you shout?", why: "\"Help, the boat is sinking\" would be shouted. It needs an exclamation mark." },
        spicy: { options: ["How brave you were", "How did you get here", "I asked how you got here"],
          slips: { 1: "This one really asks, so it needs a question mark.", 2: "That reports a question. Full stop." },
          hint: "All three use How. Which one is a feeling, not a question?",
          why: "\"How brave you were\" is an exclamative: a strong feeling, not a question." } } },

    { type: "sort", topic: "Strong feelings",
      q: "Sort them. Calm, or a strong feeling? (The end marks are missing.)",
      buckets: ["Calm: .", "Strong feeling: !"],
      cards: [["Stop, that is hot", 1], ["The kettle is hot", 0], ["Wow, look at that", 1], ["I had toast for breakfast", 0]],
      hint: "Which ones would you say loudly?",
      why: "Stop and Wow are said with feeling. The other two are calm facts.",
      lv: {
        medium: { cards: [["Stop, that is hot", 1], ["The kettle is hot", 0], ["Wow, look at that", 1], ["I had toast for breakfast", 0], ["Get down now", 1], ["We got down at six", 0]] },
        spicy: { cards: [["Stop, that is hot", 1], ["The kettle is hot", 0], ["What a mess", 1], ["She said it was a mess", 0], ["How rude", 1], ["He told me how it went", 0]],
          why: "\"What a mess\" and \"How rude\" are exclamatives. The calm ones report or describe." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Choose the mark", title: "Three marks, one choice",
      fig: FLOW,
      html: "<p>Every sentence needs an end mark. To choose, ask two questions:</p>" +
        "<p>1. Is it <b>asking</b> something? Use a <b>question mark</b>.<br>2. Is it a <b>strong feeling</b> or a <b>shout</b>? Use an <b>exclamation mark</b>.<br>If neither, it is calm telling: use a <b>full stop</b>.</p>" +
        "<p>The same words can change meaning with a different mark. \"You are coming.\" is a fact. \"You are coming?\" is checking. \"You are coming!\" is excited.</p>",
      lv: { mild: { html: "<p>Every sentence needs an end mark.</p><p>Asking? <b>?</b><br>Big feeling or a shout? <b>!</b><br>Calm telling? <b>.</b></p>" } } },

    { type: "widget", topic: "Choose the mark", unscored: true,
      title: "Tap the end mark",
      html: "<p>Each sentence is missing its end mark. Tap the one you think fits. Change your mind as often as you like.</p>",
      mount: function(el, api){
        var d = api.data;
        if(!d.marks || typeof d.marks !== "object") d.marks = {};
        d.tries = d.tries || 0;
        var tk = typeof api.tok === "function" ? api.tok : function(x){ return x; };
        var SETS = {
          mild: [["Where is [[thing]]", "?", "Where is asking. Asking needs a question mark."],
            ["Wow, [[big]]", "!", "Wow is a big surprise. That needs an exclamation mark."],
            ["[[Who]] is at [[place]]", ".", "This one is calm telling. It needs a full stop."],
            ["Can you see it", "?", "Can you... is asking. It needs a question mark."],
            ["Help", "!", "Help is shouted. It needs an exclamation mark."],
            ["I like chips", ".!", "That is telling. A full stop works (or ! if you really love chips)."]],
          medium: [["What time does it start", "?", "What time... wants an answer: question mark."],
            ["That was amazing", "!.", "Either works: ! if you say it with feeling, . if it is calm."],
            ["[[Who]] went home at six", ".", "Calm telling: full stop."],
            ["Did you hear that", "?", "Did you... is asking: question mark."],
            ["Get out of the way, it is falling", "!", "An urgent warning: exclamation mark."],
            ["How brilliant that was", "!", "It starts with How, but it is not asking. It is a strong feeling."]],
          spicy: [["I wonder where [[thing]] is", ".", "It is about a question but does not ask one. Indirect questions take a full stop."],
            ["Why would anyone miss this", "?", "A question that does not need an answer still takes a question mark."],
            ["What a night that was", "!", "What a... is an exclamation, not a question."],
            ["She asked if we were ready", ".", "A reported question tells you what was asked. Full stop."],
            ["Are we nearly there yet", "?", "A direct question: question mark."],
            ["How dare you", "!", "How dare you is a strong feeling, not a real question."]]
        };
        var set = SETS[api.level] || SETS.mild;
        var NAMES = { ".": "full stop", "?": "question mark", "!": "exclamation mark" };
        var html = '<div style="display:grid;gap:10px">';
        set.forEach(function(r, i){
          html += '<div class="em-row" data-i="' + i + '" style="border:2px solid #d7dbea;border-radius:12px;padding:10px 12px;background:#ffffff">' +
            '<div style="font-size:1.25em;font-weight:700;color:#141a33">' + tk(r[0]) + '<span class="em-box" style="display:inline-block;min-width:1.2em;margin-left:2px;border-bottom:3px dashed #8a93b8;text-align:center;color:#3a5bd6"></span></div>' +
            '<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">' +
            ['.', '?', '!'].map(function(m){ return '<button type="button" class="btn btn-quiet" data-m="' + m + '" aria-label="' + NAMES[m] + '" style="min-width:3em;font-size:1.3em;font-weight:700">' + m + '</button>'; }).join("") +
            '</div><p class="tiny em-fb" aria-live="polite" style="margin:.4em 0 0;min-height:1.2em"></p></div>';
        });
        html += '</div><p class="em-all" aria-live="polite" style="font-weight:700;margin-top:10px;min-height:1.2em"></p>';
        el.innerHTML = html;
        function paint(i){
          var row = el.querySelector('.em-row[data-i="' + i + '"]'), m = d.marks[i], r = set[i];
          if(!row) return;
          row.querySelector(".em-box").textContent = m || "";
          var fb = row.querySelector(".em-fb");
          if(!m){ fb.textContent = ""; row.style.borderColor = "#d7dbea"; return; }
          var ok = r[1].indexOf(m) >= 0;
          row.style.borderColor = ok ? "#19c39a" : "#ffd23f";
          fb.textContent = ok ? "Yes. " + r[2] : "Have another think. " + r[2];
        }
        function all(){
          var n = 0;
          set.forEach(function(r, i){ if(d.marks[i] && r[1].indexOf(d.marks[i]) >= 0) n++; });
          el.querySelector(".em-all").textContent = n === set.length ? "All six sorted. Lovely ear for it." : n + " of " + set.length + " fit so far.";
        }
        el.addEventListener("click", function(ev){
          var b = ev.target.closest("button[data-m]"); if(!b) return;
          var row = b.closest(".em-row"); if(!row) return;
          var i = +row.getAttribute("data-i");
          d.marks[i] = b.getAttribute("data-m"); d.tries++;
          paint(i); all(); api.save();
          if(d.tries >= 3 || Object.keys(d.marks).length >= 3) api.done("done");
        });
        set.forEach(function(r, i){ paint(i); });
        all();
      },
      report: function(d){ var m = (d && d.marks) || {}; return "Tap the end mark: " + Object.keys(m).length + " sentences marked."; } },

    { type: "mc", topic: "Choose the mark",
      q: "Read this: <b>\"You are coming?\"</b> The words sound like telling, but it ends with a question mark. How does it sound?",
      options: ["Checking or surprised, with the voice going up at the end", "A calm fact", "A loud shout"],
      answer: 0,
      slips: { 1: "A calm fact would end with a full stop.", 2: "A shout would end with an exclamation mark." },
      hint: "Say it out loud with the voice going up at the end.",
      why: "The question mark turns a statement into checking: \"You are coming? Really?\"",
      lv: {
        mild: { q: "Read this: <b>\"Is it time to go?\"</b> What does the question mark tell you?",
          options: ["Someone is asking", "Someone is shouting", "Someone is calmly telling"],
          slips: { 1: "Shouting would be an exclamation mark.", 2: "Calm telling would be a full stop." },
          hint: "What does a question mark always mean?", why: "A question mark means someone is asking." },
        spicy: { q: "Same words, three marks: <b>You are coming.</b> / <b>You are coming?</b> / <b>You are coming!</b> Which one sounds delighted?",
          options: ["The one with the exclamation mark", "The one with the question mark", "The one with the full stop"],
          slips: { 1: "The question mark sounds unsure, as if checking.", 2: "The full stop is flat and calm, maybe even a bit cold." },
          hint: "Which mark shows a strong feeling?",
          why: "The exclamation mark adds strong feeling, so it sounds delighted. Same words, different meaning." } } },

    { type: "mc", topic: "Choose the mark", explain: true,
      q: "[[Who]] sends a text: <b>Can you come to [[place]] tomorrow</b>. Which end mark, and why?",
      options: ["A question mark, because it asks something", "A full stop, because it is only a text message", "An exclamation mark, because it is important"],
      answer: 0,
      slips: { 1: "Texts still need the right mark. Can you... is asking.", 2: "Important is not the same as a strong feeling. It is asking." },
      hint: "Look at the first two words.",
      why: "\"Can you...\" asks something, so it ends with a question mark, even in a text.",
      lv: { spicy: { q: "<b>Could you close the door</b> is said as a polite request. Which end mark?",
        options: ["A question mark: it is worded as a question, even though it is really a request", "A full stop: it is really an order", "No mark: requests do not need one"],
        slips: { 1: "Some writers do use a full stop for very formal requests, but the standard choice is a question mark, because it is worded as a question.", 2: "Every sentence needs an end mark." },
        hint: "How are the words put together? Could you... is a question shape.",
        why: "It is worded as a question (Could you...?), so it takes a question mark, even though it politely asks someone to do something." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Marks with a purpose", title: "Marks with a purpose",
      fig: PHONE,
      html: "<p>Writers choose end marks on purpose.</p>" +
        "<p><b>One ! is plenty.</b> If every sentence shouts, nothing stands out. Save it for the moment that really matters.</p>" +
        "<p><b>Watch out for How and What.</b> \"How do I get there?\" asks. \"How brilliant that was!\" does not.</p>",
      lv: {
        mild: { html: "<p>Here is a trick: read your writing <b>out loud</b>.</p><p>If your voice goes <b>up</b> at the end, it is asking: <b>?</b><br>If you would say it <b>loudly</b>, it is a strong feeling: <b>!</b><br>Otherwise: <b>.</b></p>" },
        spicy: { html: "<p>Writers choose end marks for effect.</p>" +
          "<p><b>Rhetorical questions</b> do not want an answer. \"Why spend another weekend indoors?\" makes the reader think, and quietly suggests the answer. They still take a question mark.</p>" +
          "<p><b>Indirect questions</b> do not ask at all. \"I wonder why we wait.\" takes a full stop.</p>" +
          "<p><b>Exclamation marks</b> lose power if they are everywhere. One, in the right place, hits hard.</p>" } } },

    { type: "multi", topic: "Marks with a purpose",
      q: "Pick the sentences that need a <b>question mark</b>.",
      options: ["How amazing it was", "How do I get to [[place]]", "I asked how to get there", "Is it far"],
      answers: [1, 3],
      hint: "Two of them really ask. Two start like questions but do not ask.",
      why: "\"How do I get to...\" and \"Is it far\" ask. \"How amazing it was\" is a feeling (!). \"I asked how...\" reports a question (.).",
      lv: {
        mild: { options: ["Where are you", "I am at [[place]]", "Are you coming", "It is cold"], answers: [0, 2],
          hint: "Which ones would you answer?", why: "\"Where are you\" and \"Are you coming\" ask something, so they need question marks." },
        spicy: { options: ["Who would not want a day at [[place]]", "I wonder who would say no", "Why wait any longer", "She asked why we waited"], answers: [0, 2],
          hint: "Rhetorical questions still take a question mark. Indirect ones do not.",
          why: "\"Who would not want...\" and \"Why wait...\" are rhetorical questions: still questions, so ?. The other two only talk about a question." } } },

    { type: "mc", topic: "Marks with a purpose",
      q: "A writer puts an exclamation mark at the end of every single sentence. What happens?",
      options: ["Nothing stands out, so the exclamation marks lose their punch", "The writing becomes more exciting every time", "The reader thinks every sentence is a question"],
      answer: 0,
      slips: { 1: "It works the other way: if everything shouts, nothing stands out.", 2: "That would be question marks, not exclamation marks." },
      hint: "Imagine someone who shouts every word.",
      why: "If every sentence shouts, the reader stops noticing. One exclamation mark in the right place does more.",
      lv: {
        mild: { q: "Your friend texts: \"We won the cup.\" You are really excited. How should you end your reply: <b>That is brilliant</b>",
          options: MARKS, answer: 1, fixed: true,
          slips: { 0: "You are not asking anything. You are excited.", 2: "A full stop sounds calm. You are really excited." },
          hint: "How do you feel?", why: "You are excited, so an exclamation mark shows it: \"That is brilliant!\"" },
        spicy: { q: "An advert for [[place]] begins: <b>\"Why spend another weekend indoors?\"</b> Why does the writer use a question here?",
          options: ["To get the reader thinking, and to hint at the answer: you should not", "Because the writer does not know the answer", "To show the writer is shouting"],
          slips: { 1: "The writer knows the answer they want. It is a rhetorical question.", 2: "Shouting would be an exclamation mark." },
          hint: "Does the advert really want you to write back with an answer?",
          why: "It is a rhetorical question: it pulls the reader in and nudges them towards the writer's answer." } } },

    { type: "write", topic: "Marks with a purpose",
      q: "Imagine you have just arrived at [[place]]. Write a short postcard home. Have a go at using at least one question mark and one exclamation mark. It only goes to Jay if you choose.",
      starters: ["Guess where I am", "You will never believe", "Wow", "Can you", "I wonder"],
      checklist: ["I asked a question and ended it with ?", "I used ! for a strong feeling", "I used full stops for the calm bits"],
      minWords: 30,
      lv: {
        mild: { minWords: 12, starters: ["Guess where I am", "Wow", "Can you", "It is"] },
        spicy: { minWords: 50, checklist: ["I used a direct question with ?", "I used ! once, where it matters most", "I used a rhetorical question or an indirect question", "I used full stops for the calm bits"] } } }
  ],

  realWorld: {
    title: "End marks change what people hear",
    html: "<p>Texts, emails and signs all rely on end marks. \"See you later.\" and \"See you later?\" mean different things, and a message in all exclamation marks can come across as cross. Getting them right means people hear what you meant.</p>" +
      "<p>Our big question is a question for a reason: <b>If we could time travel, should we?</b> It asks, so it ends with a question mark. Your answer will probably need full stops, and maybe one exclamation mark at the end.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A time portal with a question mark, a full stop and an exclamation mark coming out of it">' + A.portal(80, 75, 56) +
      '<circle cx="200" cy="50" r="24" fill="#3a8fd6"/>' + T(200, 62, "?", 32, ' text-anchor="middle" font-weight="700" fill="#ffffff"') +
      '<circle cx="262" cy="96" r="24" fill="#19c39a"/><circle cx="262" cy="96" r="6" fill="#141a33"/>' +
      '<circle cx="324" cy="56" r="24" fill="#ff5d8f"/>' + T(324, 68, "!", 32, ' text-anchor="middle" font-weight="700" fill="#ffffff"') +
      A.bird(380, 120, 0.7, "#ffd23f") + '</svg>'
  },

  make: {
    title: "Make a speech bubble poster",
    intro: "One question and one exclamation, in two speech bubbles. Pop the end marks in yourself. Save it, put it on the wall, or send it to Jay if you like.",
    fields: [
      { id: "q", label: "A question you would ask someone from the past", ph: "What do you do for fun?", max: 70 },
      { id: "ex", label: "Something you would shout if you saw it", ph: "Wow, a real knight!", max: 60 },
      { id: "name", label: "By", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      function tx(x, y, t, sz, w, c, a){ return '<text x="' + x + '" y="' + y + '" font-family="Verdana,Arial,sans-serif" font-size="' + sz + '"' + (w ? ' font-weight="700"' : "") + (a ? ' text-anchor="' + a + '"' : "") + ' fill="' + (c || "#141a33") + '">' + t + '</text>'; }
      var q = wrap(v.q, 21, 3), ex = wrap(v.ex, 21, 3);
      var s = '<rect width="600" height="420" rx="22" fill="#1d3a6b"/>' +
        '<circle cx="70" cy="70" r="120" fill="#3a8fd6" fill-opacity=".35"/><circle cx="560" cy="380" r="140" fill="#ff5d8f" fill-opacity=".3"/>' +
        tx(300, 50, "ASK IT. SHOUT IT.", 26, 1, "#ffd23f", "middle") +
        '<path d="M40 76h330q16 0 16 16v104q0 16 -16 16H120l-26 26 4 -26H56q-16 0 -16 -16V92q0 -16 16 -16z" fill="#ffffff"/>' +
        '<circle cx="482" cy="140" r="42" fill="#3a8fd6"/>' + tx(482, 158, "?", 52, 1, "#ffffff", "middle");
      q.forEach(function(l, k){ s += tx(60, 118 + k * 32, esc(l), 21, 1); });
      s += '<path d="M230 252h314q16 0 16 16v86q0 16 -16 16H244q-16 0 -16 -16v-60l-20 -14 20 -6v-6q0 -16 16 -16z" fill="#fff1f4"/>' +
        '<circle cx="168" cy="310" r="42" fill="#ff5d8f"/>' + tx(168, 328, "!", 52, 1, "#ffffff", "middle");
      ex.forEach(function(l, k){ s += tx(250, 290 + k * 30, esc(l), 19, 1, "#c2185b"); });
      s += tx(40, 400, "By " + esc(v.name), 15, 0, "#9fd3ff");
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">' + s + '</svg>';
    }
  }
};
})();
