/* Base 5 core target activity: Format match.
   English. Letters, diaries and instructions: what each one looks like
   (greetings, I and a date, numbered steps) and matching the format to
   the job. Replayable: most questions carry two more versions. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
var LVS = ["mild", "medium", "spicy"], START = "mild";
function ext(a, b){ for(var k in b) if(Object.prototype.hasOwnProperty.call(b, k)) a[k] = b[k]; return a; }
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }
function task(h){ return '<div class="a2task">' + h + '</div>'; }

/* Question builder: each version is {fields, medium:{...}, spicy:{...}}. o:[right, others] becomes
   options (the right one moves a place each version) and s:[slip for each other option] becomes
   slips. Version 1 is the base; the rest become vary, each with every level written out. */
function res(v, L, vi){
  var o = {};
  Object.keys(v).forEach(function(k){ if(LVS.indexOf(k) < 0) o[k] = v[k]; });
  if(v[L]) ext(o, v[L]);
  if(o.o){
    var right = o.o[0], rest = o.o.slice(1), t = vi % o.o.length, opts = rest.slice(), sl = {};
    opts.splice(t, 0, right);
    (o.s || []).forEach(function(m, j){ if(m) sl[j < t ? j : j + 1] = m; });
    o.options = opts; o.answer = t; o.slips = sl; delete o.o; delete o.s;
  }
  return o;
}
function Q(type, topic, flags, vers){
  var all = [], R = vers.map(function(v, vi){ var r = {}; LVS.forEach(function(L){ r[L] = res(v, L, vi); all.push(r[L]); }); return r; });
  var keys = {}; all.forEach(function(o){ Object.keys(o).forEach(function(k){ keys[k] = 1; }); });
  all.forEach(function(o){ Object.keys(keys).forEach(function(k){ if(!(k in o)) o[k] = null; }); });
  function others(r){ var lv = {}; LVS.forEach(function(L){ if(L !== START) lv[L] = r[L]; }); return lv; }
  var step = ext(ext({ type: type, topic: topic }, flags || {}), R[0][START]);
  step.lv = others(R[0]);
  if(R.length > 1) step.vary = R.slice(1).map(function(r){ return ext(ext({}, r[START]), { lv: others(r) }); });
  return step;
}

/* ---------- pictures ---------- */
function rule(x, y, w){ return '<path d="M' + x + ' ' + y + 'h' + w + '" stroke="#9aa0b8" stroke-width="4" stroke-linecap="round"/>'; }
function rules(x, y, n, w){ var s = ""; for(var k = 0; k < n; k++) s += rule(x, y + k * 14, w - (k * 29) % 34); return s; }

/* four little pages, one per format */
function page(kind, x, y){
  var o = '<g transform="translate(' + x + ' ' + y + ')">';
  var bg = { letter: "#fffbe0", diary: "#ffeef4", how: "#e8f7ff", poster: "#e9fbf3" }[kind];
  o += '<rect width="104" height="132" rx="8" fill="' + bg + '" stroke="#141a33" stroke-width="2.5"/>';
  if(kind === "letter") o += T(10, 26, "Dear...", 14, { b: 1 }) + rules(12, 44, 4, 80) + T(10, 118, "Love from", 12);
  if(kind === "diary") o += '<rect width="104" height="28" rx="8" fill="#ff5d8f"/>' + T(10, 19, "Monday", 13, { b: 1, c: "#ffffff" }) + T(10, 48, "Today I...", 13, { b: 1 }) + rules(12, 66, 3, 80) +
    '<path d="M52 120c-6 -7 -13 -9 -13 -15a6.5 6.5 0 0 1 13 -2a6.5 6.5 0 0 1 13 2c0 6 -7 8 -13 15z" fill="#ff5d8f"/>';
  if(kind === "how"){ o += T(10, 24, "How to", 14, { b: 1 });
    for(var k = 0; k < 3; k++) o += '<circle cx="20" cy="' + (46 + k * 28) + '" r="10" fill="#22b8e6"/>' + T(20, 51 + k * 28, String(k + 1), 13, { a: "middle", b: 1, c: "#ffffff" }) + rule(36, 46 + k * 28, 54); }
  if(kind === "poster") o += T(52, 34, "BIG", 24, { a: "middle", b: 1, c: "#19a07c" }) + T(52, 58, "SALE!", 20, { a: "middle", b: 1, c: "#ff5d5d" }) +
    '<circle cx="52" cy="92" r="20" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>' + T(52, 98, "Sat", 14, { a: "middle", b: 1 }) + rule(26, 122, 52);
  return o + '</g>';
}
var FOUR = '<svg viewBox="0 0 560 200" role="img" aria-label="Four formats: a letter starts with Dear, a diary has a day and I, instructions have numbered steps, a poster has a big title">' +
  '<rect width="560" height="200" rx="16" fill="#f4f1ea"/>' +
  [["letter", "Letter"], ["diary", "Diary"], ["how", "Instructions"], ["poster", "Poster"]].map(function(p, i){
    var x = 25 + i * 131;
    return page(p[0], x, 16) + T(x + 52, 182, p[1], 15, { a: "middle", b: 1 });
  }).join("") +
  A.egg(A.bird(540, 24, 0.55, "#ff5d8f"), "A bird with a tiny letter in its beak. Jay says it is the only post he ever wants.") +
  '</svg>';

/* a labelled letter */
function tag(x, y, s, x2){ return '<path d="M' + x + ' ' + (y - 5) + 'H' + x2 + '" stroke="#141a33" stroke-width="1.5" stroke-dasharray="4 3"/>' + T(x2 + 6, y, s, 14, { b: 1, c: "#8a3a00" }); }
var LETTER = '<svg viewBox="0 0 520 240" role="img" aria-label="A letter with its parts labelled: greeting at the top, the message in the middle, the sign off and name at the end">' +
  '<rect width="520" height="240" rx="16" fill="#f4f1ea"/>' +
  '<rect x="30" y="14" width="290" height="212" rx="8" fill="#fffbe0" stroke="#141a33" stroke-width="2.5"/>' +
  T(48, 48, "Dear Alex,", 18, { b: 1 }) +
  T(48, 82, "Thank you for the bird book.", 13) + T(48, 102, "I have read it twice already!", 13) + T(48, 122, "See you on Saturday.", 13) +
  T(48, 170, "Love from", 15, { b: 1 }) + T(48, 194, "Jay", 15, { b: 1 }) +
  tag(150, 48, "Greeting", 340) + tag(260, 102, "Message", 340) + tag(150, 182, "Sign off + name", 340) +
  A.egg('<g transform="translate(282 136)"><rect x="-20" y="-24" width="40" height="46" fill="#ffffff" stroke="#141a33" stroke-width="2" stroke-dasharray="3 2"/>' + A.bird(0, 0, 0.6, "#3a8fd6") + '</g>', "A bird stamp. Jay has a whole drawer of them. Outrageous.") +
  '</svg>';

/* a labelled diary page */
var DIARY = '<svg viewBox="0 0 520 240" role="img" aria-label="A diary page with its parts labelled: the date at the top, I and my, and how the writer felt">' +
  '<rect width="520" height="240" rx="16" fill="#f4f1ea"/>' +
  '<rect x="30" y="14" width="290" height="212" rx="8" fill="#ffeef4" stroke="#141a33" stroke-width="2.5"/>' +
  '<rect x="30" y="14" width="290" height="40" rx="8" fill="#ff5d8f"/>' + T(48, 41, "Tuesday 4 November", 16, { b: 1, c: "#ffffff" }) +
  T(48, 86, 'Today <tspan font-weight="700" fill="#c2185b">I</tspan> went to the park.', 14) +
  T(48, 110, '<tspan font-weight="700" fill="#c2185b">I</tspan> saw a heron with <tspan font-weight="700" fill="#c2185b">my</tspan> dad.', 14) +
  T(48, 150, "I felt so happy!", 14, { b: 1 }) +
  tag(240, 36, "Date", 340) + tag(150, 98, "I, me, my", 340) + tag(180, 150, "Feelings", 340) +
  '</svg>';

/* labelled instructions */
var HOWTO = '<svg viewBox="0 0 520 250" role="img" aria-label="Instructions with their parts labelled: a How to title, a You will need list, numbered steps that start with bossy verbs">' +
  '<rect width="520" height="250" rx="16" fill="#f4f1ea"/>' +
  '<rect x="30" y="12" width="290" height="226" rx="8" fill="#e8f7ff" stroke="#141a33" stroke-width="2.5"/>' +
  T(48, 42, "How to feed the birds", 16, { b: 1 }) +
  T(48, 70, "You will need:", 13, { b: 1 }) + T(56, 88, "&#8226; a feeder   &#8226; bird seed", 13) +
  [["Fill", " the feeder with seed."], ["Hang", " it on a branch."], ["Wait", " quietly and watch."]].map(function(s, k){
    var y = 124 + k * 34;
    return '<circle cx="58" cy="' + (y - 5) + '" r="11" fill="#22b8e6"/>' + T(58, y, String(k + 1), 13, { a: "middle", b: 1, c: "#ffffff" }) +
      T(78, y, '<tspan font-weight="700" fill="#c25400">' + s[0] + '</tspan>' + s[1], 13);
  }).join("") +
  tag(250, 42, "Title: How to...", 340) + tag(200, 80, "You will need", 340) +
  '<path d="M240 158H334" stroke="#141a33" stroke-width="1.5" stroke-dasharray="4 3"/>' + T(340, 152, "Numbered steps", 14, { b: 1, c: "#8a3a00" }) + T(340, 172, "Bossy verbs first", 14, { b: 1, c: "#c25400" }) +
  '</svg>';

(window.A2PACKS = window.A2PACKS || {})["core-format-match"] = {
  a2: true,
  id: "a2-core-format-match",
  title: "Format match",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "Letters, diaries and instructions each have their own shape. Spot the clues, and match the format to the job.",
  blurb: "Every kind of writing has a shape: Dear at the top of a letter, I and a date in a diary, numbered steps in instructions. Four short chunks, and a little letter card to make at the end. The questions change each time you come back.",
  note: "Format match: spotting what makes a letter a letter, a diary a diary, and instructions easy to follow. Four five minute chunks and a letter card to make. The questions change every go, so come back whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Snap", line: "Snap: one big clue at a time." },
    { id: "medium", name: "Matchmaker", line: "Matchmaker: more formats, and picking the right one for the job." },
    { id: "spicy", name: "Mastermind", line: "Mastermind: formal letters, smaller clues, and why each layout works." }
  ],
  themes: {
    time: { name: "Time travel", w: { place: "the year 1966", day: "my first trip in the time machine", pal: "Zed the time traveller", task: "set the time machine dial" } },
    football: { name: "Football", w: { place: "the big match", day: "match day", pal: "the team captain", task: "pump up a football" } },
    horror: { name: "Horror", w: { place: "the haunted house", day: "the night in the haunted house", pal: "the ghost hunter", task: "make a spooky lantern" } },
    fishing: { name: "Fishing", w: { place: "the lake", day: "my first fishing trip", pal: "the bait shop owner", task: "set up a fishing rod" } },
    music: { name: "Music", w: { place: "the gig", day: "the night of the gig", pal: "the band manager", task: "tune a guitar" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: FOUR,
  steps: [

    /* ---------- chunk 1: spot the format ---------- */
    { type: "learn", topic: "Spot the format", title: "Every format has a shape",
      fig: FOUR,
      html: "<p>You can often tell what kind of writing something is before you read a word.</p>" +
        "<p>A <b>letter</b> starts with <b>Dear</b>. A <b>diary</b> has a <b>day</b> at the top and uses <b>I</b>. <b>Instructions</b> have <b>numbered steps</b>. A <b>poster</b> has a <b>big title</b> and not many words.</p>",
      lv: {
        medium: { html: "<p>Every format has a shape, and the shape is a clue.</p>" +
          "<p><b>Letters</b>: a greeting (<b>Dear...</b>) and a sign off (<b>Love from</b>, <b>Best wishes</b>). <b>Diaries</b>: a date, <b>I</b> and <b>my</b>, and feelings. <b>Instructions</b>: a <b>How to</b> title, numbered steps, bossy verbs. <b>Posters</b>: a big title, few words, bright and bold.</p>" +
          "<p>The shape is not random. Each one fits its job.</p>" },
        spicy: { html: "<p>Format follows purpose. Each layout exists because of who reads it and why.</p>" +
          "<p>A <b>letter</b> talks to one reader, so it greets them by name and signs off. A <b>diary</b> is written for yourself, so it is first person, dated and honest about feelings. <b>Instructions</b> are for someone doing a task, so they are numbered, in order, and start with commands. A <b>poster</b> is read from across a room in seconds, so it is short and big.</p>" +
          "<p>Formal or informal changes the details too: <b>Dear Sir or Madam</b> is a different letter from <b>Hiya!</b></p>" } } },

    Q("mc", "Spot the format", null, [
      { q: "Have a read. Which format is this?" + task("Dear Alex,<br>Thank you for the card. I loved the robin on the front.<br>Love from Jay"),
        o: ["A letter", "A diary", "Instructions"],
        s: ["A diary is written to yourself. This one is written to Alex.", "There are no steps to follow."],
        hint: "Look at the very first word.",
        why: "<b>Dear Alex</b> at the top and <b>Love from</b> at the end: that is a letter.",
        medium: { o: ["A letter", "A diary", "Instructions", "A poster"], s: ["A diary is written to yourself, not to Alex.", "There are no steps to follow.", "A poster would be a big title and a few words."] },
        spicy: { q: "Which format is this, exactly?" + task("Dear Sir or Madam,<br>I am writing to ask whether your shop has any weekend jobs.<br>Yours faithfully,<br>A. Morgan"),
          o: ["A formal letter", "An informal letter", "A diary"],
          s: ["Informal letters say things like Hi and Love from. This one is very polite and does not know the reader's name.", "It is written to someone else, not to the writer."],
          why: "<b>Dear Sir or Madam</b> and <b>Yours faithfully</b>: a formal letter to someone whose name you do not know." } },
      { q: "Have a read. Which format is this?" + task("Friday<br>Today I went to [[place]]. I was nervous at first, but I had a brilliant time."),
        o: ["A diary", "A letter", "Instructions"],
        s: ["There is no Dear at the top and no sign off.", "Nobody is being told what to do."],
        hint: "Look for a day, and the word I.",
        why: "A day at the top, <b>I</b>, and how the writer felt: that is a diary.",
        medium: { o: ["A diary", "A letter", "Instructions", "A poster"], s: ["There is no Dear and no sign off.", "Nobody is being told what to do.", "Far too many words for a poster."] },
        spicy: { q: "Which format is this, exactly?" + task("I still cannot believe it. After all that worrying, [[day]] went fine. Better than fine. I think I am actually proud of myself."),
          o: ["A diary", "A formal letter", "A set of instructions"],
          s: ["No greeting and no reader named. And formal letters would not sound this chatty.", "No steps and no commands."],
          why: "No date here, but it is first person, private and full of feelings. That is diary writing." } },
      { q: "Have a read. Which format is this?" + task("How to make a bird feeder<br>1. Spread suet on a pine cone.<br>2. Roll it in seed.<br>3. Hang it on a branch."),
        o: ["Instructions", "A diary", "A letter"],
        s: ["A diary says what I did. This tells you what to do.", "There is no Dear and no sign off."],
        hint: "Look at the numbers.",
        why: "A <b>How to</b> title and numbered steps: instructions.",
        medium: { o: ["Instructions", "A diary", "A letter", "A poster"], s: ["A diary says what I did. This tells you what to do.", "There is no Dear and no sign off.", "A poster would have a big title and hardly any words."] },
        spicy: { q: "Which format is this, exactly?" + task("Before you start, check the glue is dry. Next, thread the string through the hole. Finally, tie a double knot."),
          o: ["Instructions", "A diary", "A formal letter"],
          s: ["It tells the reader what to do, not what I did.", "No greeting, no sign off, no reader named."],
          why: "No numbers this time, but commands (<b>check, thread, tie</b>) and order words (<b>before, next, finally</b>) make it instructions." } }
    ]),

    Q("match", "Spot the format", null, [
      { q: "Match each format to its biggest clue.",
        pairs: [["Letter", "Starts with Dear..."], ["Diary", "I, me and a day at the top"], ["Instructions", "Numbered steps"]],
        hint: "Which one starts with Dear?",
        why: "Dear for letters, I and a day for diaries, numbers for instructions.",
        medium: { pairs: [["Letter", "Starts with Dear..."], ["Diary", "I, me and a day at the top"], ["Instructions", "Numbered steps"], ["Poster", "A big title and few words"]] },
        spicy: { pairs: [["Formal letter", "Dear Sir or Madam"], ["Informal letter", "Hiya! Guess what..."], ["Diary", "First person, dated, private"], ["Instructions", "Commands in order"], ["Poster", "Readable from across a room"]] } },
      { q: "Match each format to the way it ends or signs off.",
        pairs: [["Letter", "Love from Jay"], ["Instructions", "Step 4: enjoy!"], ["Diary", "I am so tired. Night night!"]],
        hint: "Which one has a name after Love from?",
        why: "Letters sign off with a name. Instructions end on the last step. A diary ends with the writer's own thoughts.",
        medium: { pairs: [["Letter", "Love from Jay"], ["Instructions", "Step 4: enjoy!"], ["Diary", "I am so tired. Night night!"], ["Poster", "Free entry! Everyone welcome!"]] },
        spicy: { pairs: [["Formal letter", "Yours faithfully"], ["Informal letter", "See you soon! Love, Jay"], ["Diary", "I wonder if tomorrow will be better."], ["Instructions", "Finally, switch it off at the wall."], ["Poster", "Book now! Limited places!"]] } },
      { q: "Match each job to the format that fits it.",
        pairs: [["Saying thank you to a friend for a present", "Letter"], ["Remembering your own day", "Diary"], ["Showing someone how to [[task]]", "Instructions"]],
        hint: "Which one is written for yourself?",
        why: "A thank you goes to someone else, a diary is for you, and steps show someone how.",
        medium: { pairs: [["Saying thank you to a friend for a present", "Letter"], ["Remembering your own day", "Diary"], ["Showing someone how to [[task]]", "Instructions"], ["Telling the whole school about a cake sale", "Poster"]] },
        spicy: { pairs: [["Asking a company about a job", "Formal letter"], ["Thanking your aunt for a present", "Informal letter"], ["Working out how you feel about a tricky week", "Diary"], ["Helping someone [[task]]", "Instructions"], ["Getting people to a cake sale", "Poster"]] } }
    ]),

    Q("mc", "Spot the format", null, [
      { q: "Odd one out. Three of these would be in a letter. Which one would <b>not</b>?",
        o: ["1. Turn the handle.", "Dear Alex,", "Love from Jay", "Thank you for the card."],
        s: ["That is a greeting. Every letter starts with one.", "That is a sign off. It goes at the end of a letter.", "Letters often say thank you."],
        hint: "Which one is telling you to do something, step by step?",
        why: "A numbered step belongs in instructions, not a letter.",
        spicy: { o: ["Step 2: remove the lid.", "Dear Ms Patel,", "Yours sincerely,", "I am writing to ask about the job."],
          s: ["A formal greeting. Right at home in a letter.", "A formal sign off. Right at home in a letter.", "A formal first line. Right at home in a letter."] } },
      { q: "Odd one out. Three of these would be in a diary. Which one would <b>not</b>?",
        o: ["Step 3: add the water.", "Tuesday 4 March", "Today I went to [[place]].", "I felt really happy."],
        s: ["A date at the top is a diary clue.", "I and today: very diary.", "Feelings belong in a diary."],
        hint: "Which one tells someone else what to do?",
        why: "A numbered step is from instructions.",
        spicy: { o: ["Yours faithfully,", "Tuesday 4 March", "I am still thinking about what happened at [[place]].", "Maybe tomorrow I will feel braver."],
          s: ["A date is a diary clue.", "First person thoughts: diary.", "Private hopes and worries are diary writing."] } },
      { q: "Odd one out. Three of these would be in instructions. Which one would <b>not</b>?",
        o: ["Dear Sir or Madam,", "You will need:", "1. Open the box.", "2. Take out the parts."],
        s: ["A kit list is part of instructions.", "A numbered step: instructions.", "Another numbered step."],
        hint: "Which one is a greeting?",
        why: "<b>Dear Sir or Madam</b> starts a letter.",
        spicy: { o: ["I felt a bit silly at first.", "You will need:", "Next, tighten the screw.", "Warning: the edges are sharp."],
          s: ["A kit list is part of instructions.", "A command with an order word: instructions.", "Warnings are common in instructions."] } }
    ]),

    /* ---------- chunk 2: letters (worked example, then fade) ---------- */
    { type: "learn", topic: "Letters", title: "Inside a letter",
      fig: LETTER,
      html: "<p>A letter is written <b>to someone</b>. It has three parts:</p>" +
        "<p><b>1. Greeting:</b> Dear, then their name, then a comma. <b>Dear Alex,</b><br><b>2. Message:</b> what you want to say.<br><b>3. Sign off:</b> <b>Love from</b> or <b>From</b>, then your name.</p>",
      lv: {
        medium: { html: "<p>A letter is written <b>to someone</b>, so it has a greeting and a sign off.</p>" +
          "<p><b>1. Greeting:</b> <b>Dear</b> + name + comma. <b>Dear Alex,</b> or <b>Dear Mr Khan,</b><br><b>2. Message:</b> say why you are writing, then the details.<br><b>3. Sign off:</b> it matches the reader. A friend gets <b>Love from</b> or <b>See you soon</b>. Someone you do not know well gets <b>Best wishes</b> or <b>Kind regards</b>.</p>" },
        spicy: { html: "<p>Formal letters have fixed rules, and readers notice when you break them.</p>" +
          "<p><b>Your address</b> top right, then the <b>date</b>. <b>Greeting:</b> if you know the name, <b>Dear Ms Patel,</b> and sign off <b>Yours sincerely,</b>. If you do not, <b>Dear Sir or Madam,</b> and sign off <b>Yours faithfully,</b>.</p>" +
          "<p>The first line says why you are writing: <b>I am writing to...</b>. No slang, no exclamation marks, full sentences.</p>" } } },

    Q("mc", "Letters", null, [
      { q: "<b>Step 1, the greeting.</b> Jay is writing to his friend Alex. Which goes at the top?",
        o: ["Dear Alex,", "Love from Alex", "Step 1: Alex"],
        s: ["That is a sign off. It goes at the end.", "That is from instructions, not a letter."],
        hint: "Greetings start with Dear.",
        why: "<b>Dear</b>, then the name, then a comma.",
        medium: { q: "<b>Step 1, the greeting.</b> You are writing to the head of the local football club, Mr Khan. Which greeting fits?",
          o: ["Dear Mr Khan,", "Hiya Khanny!", "Love from Mr Khan"],
          s: ["Fine for a mate, but too chatty for someone you do not know.", "That is a sign off, and it has his name in it instead of yours."] },
        spicy: { q: "<b>Step 1, the greeting.</b> A formal letter to a company. You do not know who will read it. Which greeting?",
          o: ["Dear Sir or Madam,", "Dear Company,", "Hi there,"],
          s: ["Close, but not the set phrase. Formal letters to an unknown reader use Sir or Madam.", "Too informal for a company."],
          why: "When you do not know the name, the formal greeting is <b>Dear Sir or Madam,</b>." } },
      { q: "<b>Step 1, the greeting.</b> You are writing a thank you letter to Bonnie. Which goes at the top?",
        o: ["Dear Bonnie,", "From Bonnie", "1. Bonnie"],
        s: ["From goes at the end, before the writer's name.", "Numbers are for steps in instructions."],
        hint: "Greetings start with Dear.",
        why: "<b>Dear Bonnie,</b> Whether she can read it is another question.",
        medium: { q: "<b>Step 1, the greeting.</b> You are writing to [[pal]], who you have only met once. Which greeting fits?",
          o: ["Dear [[pal]],", "Yo!", "Yours sincerely,"],
          s: ["Too casual for someone you have only met once.", "That is a sign off. It goes at the end."] },
        spicy: { q: "<b>Step 1, the greeting.</b> A formal letter to Ms Patel, a manager you have never met. Which greeting?",
          o: ["Dear Ms Patel,", "Dear Sir or Madam,", "Hiya Ms Patel,"],
          s: ["You know her name, so use it. Sir or Madam is only for when you do not.", "Hiya is far too casual for a manager you have never met."],
          why: "You know the name, so <b>Dear Ms Patel,</b>." } },
      { q: "<b>Step 1, the greeting.</b> You are writing to [[pal]] about [[place]]. Which goes at the top?",
        o: ["Dear [[pal]],", "Love from [[pal]]", "Step 1: [[pal]]"],
        s: ["That is a sign off, for the end.", "Steps are for instructions."],
        hint: "Greetings start with Dear.",
        why: "<b>Dear</b>, then the name, then a comma.",
        medium: { q: "<b>Step 1, the greeting.</b> You are writing to your cousin, who you know really well. Which greeting fits best?",
          o: ["Hi Sam,", "Dear Sir or Madam,", "Yours faithfully,"],
          s: ["Far too formal for a cousin.", "That is a formal sign off, for the end."],
          why: "For someone you know well, a friendly greeting like <b>Hi Sam,</b> or <b>Dear Sam,</b> fits." },
        spicy: { q: "<b>Step 1, the greeting.</b> An email to the general enquiries address of a museum. Which greeting is best?",
          o: ["Dear Sir or Madam,", "Hey museum!", "Dear Bob,"],
          s: ["Far too casual for a formal email.", "You do not know who reads it, so you cannot guess a name."],
          why: "An unknown reader at a formal address: <b>Dear Sir or Madam,</b>." } }
    ]),

    Q("mc", "Letters", null, [
      { q: "<b>Step 3, the sign off.</b> Which goes at the end of a letter to a friend?",
        o: ["Love from Jay", "Dear Jay,", "Step 4: Jay"],
        s: ["That is a greeting. It goes at the top.", "That is from instructions."],
        hint: "It says who the letter is from.",
        why: "<b>Love from</b>, then your name. It tells the reader who wrote it.",
        medium: { q: "<b>Step 3, the sign off.</b> You wrote to Mr Khan at the football club. Which sign off fits?",
          o: ["Best wishes, Jay", "Love you loads! Jay xx", "Dear Jay,"],
          s: ["Lovely for family, but too close for someone you do not know well.", "That is a greeting, for the top."] },
        spicy: { q: "<b>Step 3, the sign off.</b> You started with <b>Dear Sir or Madam,</b>. Which sign off matches?",
          o: ["Yours faithfully,", "Yours sincerely,", "Cheers,"],
          s: ["Sincerely goes with a name, like Dear Ms Patel. Sir or Madam goes with faithfully.", "Too casual for a formal letter."],
          why: "Sir or Madam goes with <b>Yours faithfully</b>. A trick to remember: no name, so you have to have faith it reaches the right person." } },
      { q: "<b>Step 3, the sign off.</b> You wrote to Bonnie. Which goes at the end?",
        o: ["From your friend in Base 5", "Dear Bonnie,", "1. Bonnie"],
        s: ["That is a greeting. It goes at the top.", "Numbers are for steps."],
        hint: "It says who the letter is from.",
        why: "A sign off says who it is from. Bonnie will want to know.",
        medium: { q: "<b>Step 3, the sign off.</b> You wrote to [[pal]], who you have only met once. Which sign off fits?",
          o: ["Best wishes,", "Luv ya!!", "Dear [[pal]],"],
          s: ["Too chatty for someone you have only met once.", "That is a greeting, not a sign off."] },
        spicy: { q: "<b>Step 3, the sign off.</b> You started with <b>Dear Ms Patel,</b>. Which sign off matches?",
          o: ["Yours sincerely,", "Yours faithfully,", "See ya!"],
          s: ["Faithfully goes with Sir or Madam. You used her name, so it is sincerely.", "Far too casual for a formal letter."],
          why: "A name in the greeting goes with <b>Yours sincerely</b>." } },
      { q: "<b>Step 3, the sign off.</b> You wrote to [[pal]]. Which goes at the end?",
        o: ["From Jay", "Dear [[pal]],", "Step 1: [[pal]]"],
        s: ["That is a greeting, for the top.", "That is from instructions."],
        hint: "It says who the letter is from.",
        why: "<b>From</b>, then your name.",
        medium: { q: "<b>Step 3, the sign off.</b> You wrote to your cousin, who you know really well. Which sign off fits best?",
          o: ["See you soon, Jay", "Yours faithfully,", "Dear Jay,"],
          s: ["Far too formal for a cousin.", "That is a greeting, for the top."] },
        spicy: { q: "<b>Step 3, the sign off.</b> You emailed the museum's enquiries address, starting <b>Dear Sir or Madam,</b>. Which sign off?",
          o: ["Yours faithfully,", "Yours sincerely,", "Love from"],
          s: ["Sincerely goes with a named person.", "Far too personal for a museum."],
          why: "Sir or Madam goes with <b>Yours faithfully</b>." } }
    ]),

    Q("order", "Letters", null, [
      { q: "<b>All three steps, on your own.</b> Put this letter in order, top to bottom.",
        items: ["Dear Alex,", "Thank you for the bird book.", "I have read it twice already.", "Love from Jay"],
        hint: "Greeting first, sign off last.",
        why: "Greeting, message, sign off. The shape of every letter.",
        medium: { items: ["Dear Mr Khan,", "I am writing to ask about joining the club.", "I have played for two years.", "Best wishes,", "Jay"] },
        spicy: { items: ["14 Elm Road, Chilton", "3 November 2026", "Dear Ms Patel,", "I am writing to apply for the weekend job.", "Yours sincerely,", "A. Morgan"] } },
      { q: "<b>All three steps, on your own.</b> Put this letter in order, top to bottom.",
        items: ["Dear Bonnie,", "Thank you for being such a good dog.", "Sorry I ate your biscuit.", "From your friend in Base 5"],
        hint: "Greeting first, sign off last.",
        why: "Greeting, message, sign off.",
        medium: { items: ["Dear [[pal]],", "I am writing to say thank you.", "Your help with [[place]] was brilliant.", "Best wishes,", "Jay"] },
        spicy: { items: ["2 Mill Lane, Chilton", "10 March 2027", "Dear Sir or Madam,", "I am writing to complain about a broken toaster.", "Yours faithfully,", "A. Morgan"] } },
      { q: "<b>All three steps, on your own.</b> Put this letter in order, top to bottom.",
        items: ["Dear [[pal]],", "I had a great time at [[place]].", "Can we go again soon?", "From Jay"],
        hint: "Greeting first, sign off last.",
        why: "Greeting, message, sign off.",
        medium: { items: ["Hi Sam,", "Guess what happened at [[place]]!", "I will tell you all about it on Saturday.", "See you soon,", "Jay"] },
        spicy: { items: ["7 High Street, Chilton", "21 June 2027", "Dear Mr Okafor,", "I am writing to thank you for the work experience.", "Yours sincerely,", "A. Morgan"] } }
    ]),

    Q("text", "Letters", null, [
      { q: "Type a greeting for a letter to Jay.",
        need: [["dear", "hi", "hello", "hiya", "hey", "to"]],
        model: "Dear Jay,",
        slips: [[["love from", "from", "yours"], "That is a sign off. A greeting is how you start: Dear..."]],
        hint: "Dear, then the name.",
        why: "<b>Dear Jay,</b> or <b>Hi Jay,</b> both work. Jay would be very happy to get a letter.",
        medium: { q: "Type a greeting for a letter to Mr Khan, who runs the football club. You have never met him.",
          need: [["dear"]], model: "Dear Mr Khan,",
          slips: [[["hi", "hiya", "hey", "yo"], "Friendly, but for someone you have never met, Dear is safer."]],
          hint: "Dear, then his title and name.", why: "<b>Dear Mr Khan,</b> is polite and clear." },
        spicy: { q: "Type the greeting for a formal letter to a company, when you do not know who will read it.",
          need: [["dear"]], model: "Dear Sir or Madam,",
          slips: [[["hi", "hiya", "hey", "to whom"], "The set phrase for an unknown reader starts with Dear..."]],
          hint: "Dear, then two polite words joined by or.", why: "<b>Dear Sir or Madam,</b> is the standard formal greeting." } },
      { q: "Type a greeting for a letter to Bonnie.",
        need: [["dear", "hi", "hello", "hiya", "hey", "to"]],
        model: "Dear Bonnie,",
        slips: [[["love from", "from", "yours"], "That is a sign off. A greeting is how you start: Dear..."]],
        hint: "Dear, then the name.",
        why: "<b>Dear Bonnie,</b> She would probably prefer a biscuit, but it is a lovely start.",
        medium: { q: "Type a greeting for a letter to [[pal]], who you have only met once.",
          need: [["dear"]], model: "Dear [[pal]],",
          slips: [[["hi", "hiya", "hey", "yo"], "Friendly, but for someone you have met once, Dear is safer."]],
          hint: "Dear, then the name.", why: "<b>Dear</b> plus the name is polite and clear." },
        spicy: { q: "Type the greeting for a formal letter to Ms Patel, a manager you have never met.",
          need: [["dear"]], model: "Dear Ms Patel,",
          slips: [[["hi", "hiya", "hey", "sir or madam"], "You know her name, so it is Dear, then Ms and her surname."]],
          hint: "Dear, her title, her surname.", why: "<b>Dear Ms Patel,</b> Title and surname, no first name." } },
      { q: "Type a greeting for a letter to a pen pal called Max.",
        need: [["dear", "hi", "hello", "hiya", "hey", "to"]],
        model: "Dear Max,",
        slips: [[["love from", "from", "yours"], "That is a sign off. A greeting is how you start: Dear..."]],
        hint: "Dear, then the name.",
        why: "<b>Dear Max,</b> or <b>Hi Max,</b> both work for a pen pal.",
        medium: { q: "Type a greeting for an email to Mrs Lee, who runs the bird sanctuary. You have never met her.",
          need: [["dear"]], model: "Dear Mrs Lee,",
          slips: [[["hi", "hiya", "hey", "yo"], "Friendly, but for someone you have never met, Dear is safer."]],
          hint: "Dear, then her title and name.", why: "<b>Dear Mrs Lee,</b> is polite and clear." },
        spicy: { q: "Type the greeting for a formal email to the enquiries address of a museum.",
          need: [["dear"]], model: "Dear Sir or Madam,",
          slips: [[["hi", "hiya", "hey"], "The set phrase for an unknown reader starts with Dear..."]],
          hint: "You do not know who will read it.", why: "<b>Dear Sir or Madam,</b> for an unknown reader." } }
    ]),

    /* ---------- chunk 3: diaries ---------- */
    { type: "learn", topic: "Diaries", title: "Inside a diary",
      fig: DIARY,
      html: "<p>A diary is written <b>for yourself</b>, about your own day.</p>" +
        "<p>It has the <b>day or date</b> at the top. It uses <b>I</b>, <b>me</b> and <b>my</b>. It often says how you <b>felt</b>.</p>",
      lv: {
        medium: { html: "<p>A diary is written <b>for yourself</b>, about your own life.</p>" +
          "<p>Clues: the <b>date</b> at the top, <b>first person</b> (I, me, my, we), <b>past tense</b> (I went, I saw), and <b>feelings</b> (I felt nervous, I loved it).</p>" +
          "<p>No greeting is needed, though some people write <b>Dear Diary</b> for fun.</p>" },
        spicy: { html: "<p>A diary is private, so its voice is honest and informal: <b>first person</b>, <b>past tense</b> for what happened, <b>present tense</b> for how you feel now.</p>" +
          "<p>Good diary writing does more than list events. It <b>reflects</b>: why something mattered, what you wonder, what you might do next time.</p>" +
          "<p>Some diaries are written to be read later by other people. Then the writer explains more, because the reader was not there.</p>" } } },

    Q("mc", "Diaries", null, [
      { q: "Which sentence comes from a diary?",
        o: ["Today I went to [[place]] and I loved it.", "Step 2: open the box.", "Dear Sir or Madam,"],
        s: ["That is a step from instructions.", "That is the start of a letter."],
        hint: "Look for I and today.",
        why: "<b>Today I...</b> is a big diary clue.",
        medium: { q: "Which sentence is written like a diary, in the first person?",
          o: ["I was so tired after [[day]].", "He was so tired after [[day]].", "Be sure to rest after [[day]]."],
          s: ["He is third person: it is about someone else.", "That is an instruction, telling the reader what to do."] },
        spicy: { q: "Which sentence <b>reflects</b>, like the best diary writing?",
          o: ["I think I was quiet because I did not know anyone yet.", "I went to [[place]]. Then I came home.", "Arrive at [[place]] by ten."],
          s: ["It is diary style, but it only lists what happened.", "That is an instruction."],
          why: "It explains <b>why</b>, not just what. That is reflection." } },
      { q: "Which sentence comes from a diary?",
        o: ["I felt nervous this morning, but it went well.", "Bring a coat.", "BIG SALE THIS SATURDAY!"],
        s: ["That is an instruction.", "That is from a poster."],
        hint: "Look for I and a feeling.",
        why: "<b>I felt...</b>: a diary.",
        medium: { q: "Which sentence is written like a diary, in the first person?",
          o: ["We got lost twice on the way to [[place]].", "They got lost twice on the way to [[place]].", "Follow the signs to [[place]]."],
          s: ["They is third person: about other people.", "That is an instruction."] },
        spicy: { q: "Which sentence <b>reflects</b>, like the best diary writing?",
          o: ["Next time, I might ask for help sooner.", "I had chips for tea.", "Ask for help if you need it."],
          s: ["Diary style, but just a fact about the day.", "An instruction, aimed at someone else."],
          why: "Thinking about next time is reflection." } },
      { q: "Which sentence comes from a diary?",
        o: ["My best bit of today was seeing a robin.", "Turn the handle twice.", "Yours sincerely,"],
        s: ["That is a step from instructions.", "That is the end of a letter."],
        hint: "Look for my and today.",
        why: "<b>My best bit of today</b>: a diary. Jay would approve of the robin.",
        medium: { q: "Which sentence is written like a diary, in the first person?",
          o: ["My hands were freezing at [[place]].", "Her hands were freezing at [[place]].", "Wear gloves at [[place]]."],
          s: ["Her is third person: about someone else.", "That is an instruction."] },
        spicy: { q: "Which sentence <b>reflects</b>, like the best diary writing?",
          o: ["I wonder why it bothered me so much.", "It rained all day.", "Bring an umbrella."],
          s: ["A fact about the day, not a reflection.", "An instruction."],
          why: "Wondering why is reflection." } }
    ]),

    Q("multi", "Diaries", { explain: true }, [
      { q: "Pick <b>all</b> the clues that this is a diary." + task("Saturday<br>Today I went to [[place]] with my cousin. I was nervous at first, but I loved it."),
        options: ["A day at the top", "It uses I and my", "It says how the writer felt", "It has numbered steps", "It starts with Dear Sir"],
        answers: [0, 1, 2],
        slips: { any: "Three clues are there. There are no numbered steps and no Dear Sir." },
        hint: "Look at the top line, the little words, and the feelings.",
        why: "A day, I and my, and feelings: three diary clues.",
        spicy: { options: ["A day at the top", "First person", "Past tense for what happened", "Feelings", "A formal sign off", "Commands in order"], answers: [0, 1, 2, 3],
          slips: { any: "Four clues. No sign off and no commands." } } },
      { q: "Pick <b>all</b> the clues that this is a diary." + task("Monday 2 March<br>I scored my first ever goal today. My legs were shaking and I could not stop grinning."),
        options: ["A date at the top", "It uses I and my", "It says how the writer felt", "It ends with Love from", "It tells you what to do"],
        answers: [0, 1, 2],
        slips: { any: "Three clues. It does not sign off and it does not tell anyone what to do." },
        hint: "Date, little words, feelings.",
        why: "A date, I and my, and feelings.",
        spicy: { options: ["A date at the top", "First person", "Past tense for what happened", "Feelings", "A greeting", "Numbered steps"], answers: [0, 1, 2, 3],
          slips: { any: "Four clues. No greeting and no steps." } } },
      { q: "Pick <b>all</b> the clues that this is a diary." + task("Wednesday<br>I took Bonnie for a walk in the rain. My socks got soaked. I was grumpy, but she was so happy."),
        options: ["A day at the top", "It uses I and my", "It says how the writer felt", "It has a big title in capitals", "It starts with Dear Sir"],
        answers: [0, 1, 2],
        slips: { any: "Three clues. No poster title and no letter greeting." },
        hint: "Day, little words, feelings.",
        why: "A day, I and my, and feelings. And Bonnie, who loves rain more than socks do.",
        spicy: { options: ["A day at the top", "First person", "Past tense for what happened", "Feelings", "A formal greeting", "Bossy verbs"], answers: [0, 1, 2, 3],
          slips: { any: "Four clues. No greeting and no commands." } } }
    ]),

    Q("sort", "Diaries", null, [
      { q: "Sort them. Diary sentence, or not?",
        buckets: ["Diary (I, me, my)", "Not a diary"],
        cards: [["I went swimming today.", 0], ["My dinner was lovely.", 0], ["Turn left at the gate.", 1], ["Dear Alex,", 1]],
        hint: "Diary sentences are about the writer: I, me, my.",
        why: "I and my go in the diary. A step and a greeting belong to other formats.",
        medium: { cards: [["I went swimming today.", 0], ["My dinner was lovely.", 0], ["We got home late.", 0], ["She went swimming today.", 1], ["Turn left at the gate.", 1], ["Dear Alex,", 1]],
          why: "First person (I, my, we) is diary. She is about someone else." },
        spicy: { cards: [["I went swimming today.", 0], ["We got home late.", 0], ["I keep thinking about what she said.", 0], ["She went swimming today.", 1], ["Turn left at the gate.", 1], ["Yours sincerely,", 1], ["The swimming pool opens at 7am.", 1]],
          why: "First person and reflection go in the diary. Third person, commands, sign offs and plain facts do not." } },
      { q: "Sort them. Diary sentence, or not?",
        buckets: ["Diary (I, me, my)", "Not a diary"],
        cards: [["I felt brave today.", 0], ["My friend made me laugh.", 0], ["2. Stir the mix.", 1], ["Love from Jay", 1]],
        hint: "Diary sentences are about the writer.",
        why: "I and my go in the diary. A step and a sign off belong to other formats.",
        medium: { cards: [["I felt brave today.", 0], ["My friend made me laugh.", 0], ["We watched a film.", 0], ["He felt brave today.", 1], ["2. Stir the mix.", 1], ["Love from Jay", 1]],
          why: "First person is diary. He is about someone else." },
        spicy: { cards: [["I felt brave today.", 0], ["We watched a film.", 0], ["I am not sure I did the right thing.", 0], ["He felt brave today.", 1], ["2. Stir the mix.", 1], ["Dear Sir or Madam,", 1], ["The film is 90 minutes long.", 1]],
          why: "First person and reflection go in the diary." } },
      { q: "Sort them. Diary sentence, or not?",
        buckets: ["Diary (I, me, my)", "Not a diary"],
        cards: [["I saw a heron at [[place]].", 0], ["My feet hurt.", 0], ["You will need a pen.", 1], ["SALE NOW ON!", 1]],
        hint: "Diary sentences are about the writer.",
        why: "I and my go in the diary. A kit list and a poster line do not.",
        medium: { cards: [["I saw a heron at [[place]].", 0], ["My feet hurt.", 0], ["We laughed all the way home.", 0], ["They saw a heron at [[place]].", 1], ["You will need a pen.", 1], ["SALE NOW ON!", 1]],
          why: "First person is diary. They is about other people." },
        spicy: { cards: [["I saw a heron at [[place]].", 0], ["We laughed all the way home.", 0], ["I wish I had said something.", 0], ["They saw a heron at [[place]].", 1], ["You will need a pen.", 1], ["SALE NOW ON!", 1], ["Herons can live for 15 years.", 1]],
          why: "First person and reflection go in the diary." } }
    ]),

    /* ---------- chunk 4: instructions ---------- */
    { type: "learn", topic: "Instructions", title: "Inside instructions",
      fig: HOWTO,
      html: "<p>Instructions tell someone <b>how to do something</b>.</p>" +
        "<p>They have a <b>How to</b> title, a list of what <b>you will need</b>, and <b>numbered steps</b> in order.</p>" +
        "<p>Each step starts with a <b>bossy verb</b>: <b>Fill</b>, <b>Hang</b>, <b>Wait</b>.</p>",
      lv: {
        medium: { html: "<p>Instructions help someone <b>do a task</b>, so everything is about being easy to follow.</p>" +
          "<p>A <b>How to</b> title. A <b>You will need</b> list. <b>Numbered steps</b> in the right order. Each step starts with a <b>bossy verb</b> (a command): <b>Fill, Hang, Press, Stir</b>.</p>" +
          "<p>One action per step, and the detail that matters: <b>Stir for one minute</b>, not <b>Stir it for a bit</b>.</p>" },
        spicy: { html: "<p>Instructions use the <b>imperative</b>: commands with no I, he or she (<b>Thread the needle</b>). They are in strict <b>chronological order</b>, either numbered or with order words (<b>First, Next, Finally</b>).</p>" +
          "<p>Good ones are <b>precise</b> (how long, how much, which one), add <b>warnings</b> or <b>tips</b> where needed, and may use <b>subheadings</b> for longer tasks.</p>" +
          "<p>Everything serves one reader: someone in the middle of the task, glancing back for the next step.</p>" } } },

    Q("mc", "Instructions", null, [
      { q: "Which line is written as an instruction?",
        o: ["Put the seed in the feeder.", "I put the seed in the feeder.", "Jay put the seed in the feeder."],
        s: ["That says what I did, like a diary.", "That says what Jay did. It does not tell you to do anything."],
        hint: "An instruction starts with a bossy verb.",
        why: "<b>Put</b> is a bossy verb. It tells the reader what to do.",
        spicy: { q: "Which instruction is the most precise?",
          o: ["Put two scoops of seed in the feeder.", "Put some seed in.", "You could maybe add seed if you like."],
          s: ["Some is vague. How much?", "Not a clear command, and still no amount."],
          why: "A bossy verb and an exact amount." } },
      { q: "Which line is written as an instruction?",
        o: ["Press the green button.", "I pressed the green button.", "The button is green."],
        s: ["That says what I did.", "That describes the button but does not tell you to do anything."],
        hint: "An instruction starts with a bossy verb.",
        why: "<b>Press</b> is a bossy verb.",
        spicy: { q: "Which instruction is the most precise?",
          o: ["Hold the green button for five seconds.", "Press a button for a while.", "Try pressing something."],
          s: ["Which button, and how long is a while?", "Not precise at all."],
          why: "Which button, and exactly how long." } },
      { q: "Which line is written as an instruction?",
        o: ["Stir the paint.", "I stirred the paint.", "The paint was very runny."],
        s: ["That says what I did.", "That describes the paint."],
        hint: "An instruction starts with a bossy verb.",
        why: "<b>Stir</b> is a bossy verb.",
        spicy: { q: "Which instruction is the most precise?",
          o: ["Stir the paint for one minute.", "Stir it for a bit.", "Give it a stir or something."],
          s: ["A bit could mean anything.", "Vague, and no time."],
          why: "A bossy verb and an exact time." } }
    ]),

    Q("order", "Instructions", null, [
      { q: "Put the steps for planting a seed in order.",
        items: ["Fill a pot with soil", "Make a small hole", "Drop the seed in", "Cover it and water it"],
        hint: "What do you need before you can make a hole?",
        why: "Soil, hole, seed, water. Instructions only work in the right order.",
        medium: { items: ["Fill a pot with soil", "Make a hole with your finger", "Drop the seed in", "Cover it with soil", "Water it gently"] },
        spicy: { items: ["First, fill a pot with soil", "Next, make a hole 2 cm deep", "Then drop the seed in", "Cover it with soil", "Finally, water it gently"] } },
      { q: "Put the steps for making a paper plane in order.",
        items: ["Fold the paper in half", "Fold the top corners in", "Fold down the wings", "Throw it gently"],
        hint: "Throwing comes last!",
        why: "Fold, fold, fold, throw.",
        medium: { items: ["Fold the paper in half", "Open it up again", "Fold the top corners in", "Fold down the wings", "Throw it gently"] },
        spicy: { items: ["First, fold the paper in half lengthways", "Open it up again", "Next, fold the top corners to the middle", "Then fold down each wing", "Finally, throw it gently"] } },
      { q: "Put the steps for brushing Bonnie in order.",
        items: ["Get the soft brush", "Ask Bonnie to sit", "Brush gently from head to back", "Give her a treat"],
        hint: "The treat comes at the end. Bonnie would like it at the start.",
        why: "Brush, sit, brush, treat. No tail to brush, so it is quick.",
        medium: { items: ["Get the soft brush", "Ask Bonnie to sit", "Brush her ears gently", "Brush from head to back", "Give her a treat"] },
        spicy: { items: ["First, get the soft brush", "Ask Bonnie to sit", "Next, brush her ears gently", "Then brush from head to back", "Finally, give her a treat"] } }
    ]),

    Q("sort", "Instructions", null, [
      { q: "Which part of the instructions does each line go in?",
        buckets: ["You will need", "Steps"],
        cards: [["A pot", 0], ["Some soil", 0], ["1. Fill the pot.", 1], ["2. Plant the seed.", 1]],
        hint: "Things go in the list. Actions go in the steps.",
        why: "Things you need go in the list. Things you do go in the steps.",
        medium: { cards: [["A pot", 0], ["Some soil", 0], ["A seed", 0], ["1. Fill the pot.", 1], ["2. Plant the seed.", 1], ["3. Water it.", 1]] },
        spicy: { buckets: ["You will need", "Steps", "Warning or tip"],
          cards: [["A pot", 0], ["Some soil", 0], ["1. Fill the pot.", 1], ["2. Plant the seed.", 1], ["Tip: a sunny window works best.", 2], ["Careful: do not overwater it.", 2]] } },
      { q: "Which part of the instructions does each line go in?",
        buckets: ["You will need", "Steps"],
        cards: [["Bread", 0], ["Butter", 0], ["1. Toast the bread.", 1], ["2. Spread the butter.", 1]],
        hint: "Things go in the list. Actions go in the steps.",
        why: "Bread and butter are things. Toasting and spreading are actions.",
        medium: { cards: [["Bread", 0], ["Butter", 0], ["A knife", 0], ["1. Toast the bread.", 1], ["2. Spread the butter.", 1], ["3. Cut it in half.", 1]] },
        spicy: { buckets: ["You will need", "Steps", "Warning or tip"],
          cards: [["Bread", 0], ["Butter", 0], ["1. Toast the bread.", 1], ["2. Spread the butter.", 1], ["Careful: the toaster gets hot.", 2], ["Tip: soft butter spreads more easily.", 2]] } },
      { q: "Which part of the instructions does each line go in?",
        buckets: ["You will need", "Steps"],
        cards: [["Paint", 0], ["A brush", 0], ["1. Dip the brush.", 1], ["2. Paint the shape.", 1]],
        hint: "Things go in the list. Actions go in the steps.",
        why: "Paint and a brush are things. Dipping and painting are actions.",
        medium: { cards: [["Paint", 0], ["A brush", 0], ["Water", 0], ["1. Dip the brush.", 1], ["2. Paint the shape.", 1], ["3. Wash the brush.", 1]] },
        spicy: { buckets: ["You will need", "Steps", "Warning or tip"],
          cards: [["Paint", 0], ["A brush", 0], ["1. Dip the brush.", 1], ["2. Paint the shape.", 1], ["Tip: let each layer dry first.", 2], ["Careful: some paint stains clothes.", 2]] } }
    ]),

    { type: "mc", topic: "Instructions", explain: true,
      q: "Jay wrote how to feed the birds like a diary: <b>Today I filled the feeder, then I hung it up.</b> Why might someone who wants to do it themselves prefer instructions?",
      options: ["Numbered steps with bossy verbs are easier to follow", "Diaries are always too short", "Birds cannot read diaries"],
      answer: 0,
      slips: { 1: "Diaries can be any length. The problem is that it tells you what Jay did, not what you should do.", 2: "True, but the birds are not the ones following it." },
      hint: "Who is the reader, and what are they trying to do?",
      why: "The reader wants to do it. Numbered steps and bossy verbs tell them exactly what to do next.",
      lv: { spicy: { q: "Jay wrote how to feed the birds like a diary: <b>Today I filled the feeder, then I hung it up.</b> What is the best reason to turn it into instructions?",
        options: ["The reader is doing the task, so they need commands in order they can glance back at", "Instructions are more formal than diaries", "Diaries cannot have more than one step"],
        slips: { 1: "Instructions can be friendly. The reason is about what the reader is doing.", 2: "A diary can describe lots of steps. It just does not tell the reader what to do." },
        why: "Format follows purpose: someone mid task needs short commands, in order, that are easy to find again." } } },

    { type: "write", topic: "Instructions",
      q: "Only if you fancy it: write instructions for something you are good at. A game, a snack, a trick, how to [[task]]. Give it a <b>How to</b> title and at least three numbered steps.",
      starters: ["How to", "You will need:", "1.", "2.", "3."],
      checklist: ["I wrote a How to title", "My steps are numbered and in order", "Each step starts with a bossy verb"],
      minWords: 15,
      lv: { medium: { minWords: 25, checklist: ["I wrote a How to title", "I wrote a You will need list", "My steps are numbered and in order", "Each step starts with a bossy verb"] },
        spicy: { minWords: 40, checklist: ["Title and You will need list", "Steps in order, starting with commands", "Each step is precise (how long, how much)", "At least one tip or warning"] } } }
  ],

  realWorld: {
    title: "Where you would use this",
    html: "<p>Every day you meet these formats: letters and emails from school, instructions on a game or a recipe, posters on the wall. Knowing the shape helps you read them faster and write your own.</p>" +
      "<p>For our big question, if we could time travel, should we? In 1666 a man called Samuel Pepys wrote in his <b>diary</b> about the Great Fire of London. Over 350 years later we can still read what he saw and felt. Diaries and letters might be the safest time machine we have: we can visit the past without changing it.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="An old diary dated 1666 next to the time portal">' + A.portal(80, 76, 54) +
      '<g transform="translate(220 22) rotate(-4)"><rect width="150" height="110" rx="6" fill="#d8b27a" stroke="#141a33" stroke-width="2.5"/><rect x="8" y="8" width="134" height="94" rx="4" fill="#fdf3dc"/>' +
      T(20, 34, "2 September 1666", 12, { b: 1 }) + rule(20, 52, 110) + rule(20, 68, 96) + rule(20, 84, 104) + '</g>' +
      A.bird(392, 30, 0.6, "#3a8fd6") + '</svg>'
  },

  make: {
    title: "Make a letter card",
    intro: "A tiny letter, in the right shape: a greeting, a message and a sign off. To anyone you like: Jay, Bonnie, a friend, a future you. Keep it, put it up, or send it to Jay.",
    fields: [
      { id: "to", label: "Dear...", ph: "Bonnie", max: 16 },
      { id: "msg", label: "Your message", ph: "Thank you for being the best dog in Base 5.", max: 90 },
      { id: "off", label: "Sign off", ph: "Love from", max: 18 },
      { id: "name", label: "Your name or nickname", ph: "B5", max: 18 }
    ],
    svg: function(v){
      var ls = wrap(v.msg, 24, 4);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="20" fill="#fffbe0"/>' +
        '<rect x="12" y="12" width="576" height="376" rx="16" fill="none" stroke="#141a33" stroke-width="4"/>' +
        '<path d="M420 40v320" stroke="#141a33" stroke-opacity=".25" stroke-width="3"/>' +
        T(40, 72, "Dear " + esc(wrap(v.to, 16, 1)[0] || "") + ",", 26, { b: 1 }) +
        ls.map(function(l, k){ return T(40, 128 + k * 36, esc(l), 22); }).join("") +
        T(40, 298, esc(wrap(v.off, 18, 1)[0] || ""), 22, { b: 1 }) + T(40, 330, esc(wrap(v.name, 18, 1)[0] || ""), 22, { b: 1 }) +
        T(40, 96, "greeting", 13, { c: "#9a8a5a" }) + T(40, 364, "sign off and name", 13, { c: "#9a8a5a" }) +
        '<rect x="462" y="40" width="96" height="112" fill="#ffffff" stroke="#141a33" stroke-width="2.5" stroke-dasharray="5 3"/>' + A.bird(510, 100, 1.2, "#ff5d8f") +
        '<path d="M446 226h120M446 266h120M446 306h120" stroke="#141a33" stroke-opacity=".3" stroke-width="3"/>' +
        '</svg>';
    }
  }
};
})();
