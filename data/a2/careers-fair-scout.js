/* Base 5 Autumn 2 activity: Careers fair scout.
   Preparation for Adulthood. Getting ready for a careers fair or event,
   good questions to ask, a scout plan, and coming away with three jobs
   that caught your eye. ASCII only. */
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
function person(x, y, col, s){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><circle cx="0" cy="-30" r="10" fill="#f0c4a0"/><path d="M-14 6q0 -26 14 -26q14 0 14 26z" fill="' + col + '"/></g>';
}

/* ---------- pictures ---------- */
/* a hall full of stalls; one stall changes with the theme */
var FAIR = '<svg viewBox="0 0 520 240" role="img" aria-label="A careers fair: a big hall with stalls, each with a banner and people to talk to">' +
  '<rect width="520" height="240" rx="16" fill="#f4f1ea"/>' +
  '<rect x="0" y="150" width="520" height="90" rx="0" fill="#e2dccd"/>' +
  [["College", "#8a5cf6", 70], ["Health", "#19c39a", 195], ["[[Sl]]", "#ff8a3d", 320], ["Building", "#3a8fd6", 445]].map(function(st, k){
    var x = st[2];
    return '<rect x="' + (x - 54) + '" y="52" width="108" height="34" rx="6" fill="' + st[1] + '" stroke="#141a33" stroke-width="2.5"/>' +
      T(x, 75, st[0], 14, { b: 1, a: "middle", c: "#ffffff" }) +
      '<path d="M' + (x - 46) + ' 86v26M' + (x + 46) + ' 86v26" stroke="#141a33" stroke-width="3"/>' +
      person(x + (k % 2 ? 18 : -18), 142, ["#ffd23f", "#ff5d8f", "#22b8e6", "#19c39a"][k], 1) +
      '<rect x="' + (x - 54) + '" y="126" width="108" height="36" rx="4" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
      '<rect x="' + (x - 40) + '" y="134" width="18" height="22" fill="' + st[1] + '" fill-opacity=".5"/><rect x="' + (x - 18) + '" y="134" width="18" height="22" fill="' + st[1] + '" fill-opacity=".5"/>';
  }).join("") +
  person(140, 214, "#2f6f8f", 1.1) + person(392, 220, "#e04848", 1.1) +
  T(260, 30, "CAREERS FAIR", 18, { b: 1, a: "middle" }) +
  A2ART.egg(A2ART.bird(495, 30, 0.6, "#ffd23f"), "A bird at the careers fair. It is looking for a job as a lookout. Jay says it would be brilliant.") +
  '</svg>';

/* question words in bubbles */
var QWORDS = '<svg viewBox="0 0 520 210" role="img" aria-label="Good question starters: What, How, Why, Could I">' +
  '<rect width="520" height="210" rx="16" fill="#f4f1ea"/>' +
  [["What...?", "#ffd23f", 70, 50], ["How...?", "#22b8e6", 200, 34], ["Why...?", "#19c39a", 330, 50], ["Could I...?", "#ff5d8f", 452, 34]].map(function(b){
    return '<g transform="translate(' + b[2] + ' ' + b[3] + ')"><path d="M-58 0h116q10 0 10 10v34q0 10 -10 10h-80l-14 16 -2 -16h-20q-10 0 -10 -10v-34q0 -10 10 -10z" fill="' + b[1] + '" stroke="#141a33" stroke-width="2.5"/>' +
      T(0, 34, b[0], 17, { b: 1, a: "middle" }) + '</g>';
  }).join("") +
  A2ART.jay(260, 150, 0.6, "smile") +
  T(110, 168, "Questions", 15, { b: 1, a: "middle", c: "#5b6180" }) + T(110, 190, "open up a job", 15, { b: 1, a: "middle", c: "#5b6180" }) +
  '</svg>';

/* open and closed questions as doors */
var DOORS = '<svg viewBox="0 0 520 220" role="img" aria-label="A closed door gets yes or no. An open door lets lots of information out.">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  '<rect x="60" y="40" width="100" height="150" rx="4" fill="#a0784a" stroke="#141a33" stroke-width="3"/><circle cx="144" cy="118" r="6" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>' +
  T(110, 30, "Closed", 16, { b: 1, a: "middle" }) + T(210, 100, "Yes.", 16, { b: 1, a: "middle", c: "#5b6180" }) + T(210, 128, "No.", 16, { b: 1, a: "middle", c: "#5b6180" }) +
  '<rect x="300" y="40" width="100" height="150" rx="4" fill="#3b2a18" stroke="#141a33" stroke-width="3"/><path d="M300 40l-34 12v150l34 -12z" fill="#a0784a" stroke="#141a33" stroke-width="3"/>' +
  T(350, 30, "Open", 16, { b: 1, a: "middle" }) +
  '<path d="M350 70q60 -10 100 -20M350 110q70 0 110 0M350 150q60 10 100 22" stroke="#ffd23f" stroke-width="5" fill="none" stroke-linecap="round"/>' +
  T(458, 54, "my day", 14, { b: 1, a: "middle" }) + T(470, 104, "best bit", 14, { b: 1, a: "middle" }) + T(462, 186, "training", 14, { b: 1, a: "middle" }) +
  '</svg>';

/* a floor plan with a route and a chill zone */
var PLAN = '<svg viewBox="0 0 520 250" role="img" aria-label="A plan of the fair: stalls with stars on the ones to visit, a route, and a quiet chill zone">' +
  '<rect width="520" height="250" rx="16" fill="#f4f1ea"/>' +
  '<rect x="16" y="16" width="488" height="218" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="3"/>' +
  [[60, 40], [170, 40], [280, 40], [60, 160], [170, 160], [280, 160]].map(function(p, k){
    var star = k === 0 || k === 2 || k === 4;
    return '<rect x="' + p[0] + '" y="' + p[1] + '" width="80" height="44" rx="6" fill="' + (star ? "#ffd23f" : "#e2dccd") + '" stroke="#141a33" stroke-width="2.5"/>' +
      T(p[0] + 40, p[1] + 28, "Stall " + (k + 1), 13, { b: 1, a: "middle" }) +
      (star ? '<path d="M' + (p[0] + 72) + ' ' + (p[1] - 10) + 'l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1z" fill="#ff8a3d" stroke="#141a33" stroke-width="1.5"/>' : '');
  }).join("") +
  '<path d="M30 122H320M100 122V90M210 122V154M320 122V90" fill="none" stroke="#e04848" stroke-width="4" stroke-dasharray="8 6"/>' +
  '<rect x="16" y="112" width="12" height="36" fill="#19c39a"/>' + T(34, 108, "Way in", 13, { b: 1 }) +
  '<rect x="390" y="40" width="100" height="164" rx="10" fill="#cfe7ff" stroke="#141a33" stroke-width="2.5" stroke-dasharray="6 4"/>' +
  T(440, 66, "Chill", 15, { b: 1, a: "middle" }) + T(440, 86, "zone", 15, { b: 1, a: "middle" }) +
  '<ellipse cx="420" cy="170" rx="22" ry="16" fill="#8a5cf6" fill-opacity=".6"/>' +
  A2ART.egg(A2ART.bonnie(458, 160, 0.55, "sit"), "Bonnie found the chill zone first. She is very good at breaks.") +
  '</svg>';

/* kit to take */
var KIT = '<svg viewBox="0 0 520 200" role="img" aria-label="Kit to take: a scout sheet on a clipboard, a pen, a water bottle and a bag for leaflets">' +
  '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  '<g transform="translate(70 86)"><rect x="-34" y="-46" width="68" height="88" rx="6" fill="#a0784a" stroke="#141a33" stroke-width="2.5"/><rect x="-26" y="-36" width="52" height="70" fill="#ffffff"/><rect x="-14" y="-52" width="28" height="12" rx="3" fill="#c8ccd2" stroke="#141a33" stroke-width="2"/>' +
  '<path d="M-18 -20h36M-18 -6h36M-18 8h36M-18 22h24" stroke="#141a33" stroke-width="2"/></g>' + T(70, 168, "Scout sheet", 14, { b: 1, a: "middle" }) +
  '<g transform="translate(195 86) rotate(30)"><rect x="-6" y="-44" width="12" height="76" rx="3" fill="#3a8fd6" stroke="#141a33" stroke-width="2.5"/><path d="M-6 32l6 14 6 -14z" fill="#f6d1b0" stroke="#141a33" stroke-width="2"/></g>' + T(195, 168, "Pen", 14, { b: 1, a: "middle" }) +
  '<g transform="translate(320 86)"><rect x="-18" y="-40" width="36" height="84" rx="10" fill="#22b8e6" fill-opacity=".6" stroke="#141a33" stroke-width="2.5"/><rect x="-10" y="-52" width="20" height="14" rx="3" fill="#141a33"/><path d="M-18 0h36" stroke="#ffffff" stroke-width="3"/></g>' + T(320, 168, "Water", 14, { b: 1, a: "middle" }) +
  '<g transform="translate(445 92)"><path d="M-36 -24h72l-6 66h-60z" fill="#19c39a" stroke="#141a33" stroke-width="2.5"/><path d="M-16 -24q0 -24 16 -24q16 0 16 24" fill="none" stroke="#141a33" stroke-width="3"/>' +
  '<rect x="-20" y="-34" width="18" height="26" fill="#ffffff" stroke="#141a33" stroke-width="1.5" transform="rotate(-10)"/></g>' + T(445, 168, "Leaflet bag", 14, { b: 1, a: "middle" }) +
  '</svg>';

/* a scout sheet with three jobs */
var SHEET = '<svg viewBox="0 0 560 240" role="img" aria-label="A scout sheet with space for three jobs: the job, what they do, and why it caught my eye">' +
  '<rect width="560" height="240" rx="16" fill="#f4f1ea"/>' +
  '<rect x="16" y="20" width="528" height="204" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="3"/>' +
  T(36, 50, "MY SCOUT SHEET", 17, { b: 1, c: "#e04848" }) +
  T(66, 80, "Job", 14, { b: 1, c: "#5b6180" }) + T(250, 80, "They do", 14, { b: 1, c: "#5b6180" }) + T(388, 80, "Caught my eye", 14, { b: 1, c: "#5b6180" }) +
  [0, 1, 2].map(function(k){
    var y = 96 + k * 40;
    return '<rect x="28" y="' + y + '" width="504" height="32" rx="6" fill="' + ["#fff6cc", "#e8f7ff", "#ffeef4"][k] + '"/>' +
      '<path d="M44 ' + (y + 16) + 'l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1z" transform="translate(0 -12)" fill="#ffd23f" stroke="#141a33" stroke-width="1.5"/>' +
      (k === 0 ? T(66, y + 22, "[[Job]]", 13, { b: 1 }) + T(250, y + 22, "[[Does1s]]", 13) + T(388, y + 22, "[[Eye]]", 13) : '<path d="M66 ' + (y + 20) + 'h168M250 ' + (y + 20) + 'h124M388 ' + (y + 20) + 'h132" stroke="#141a33" stroke-opacity=".25" stroke-width="2"/>');
  }).join("") +
  '</svg>';

/* ways into a job (spicy) */
var ROUTES = '<svg viewBox="0 0 520 220" role="img" aria-label="A signpost to four ways into a job: college, apprenticeship, university, straight into work">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  '<rect x="252" y="30" width="16" height="140" fill="#7a5532"/>' +
  [["College", "#8a5cf6", -1, 42], ["Apprenticeship", "#19c39a", 1, 42], ["University", "#3a8fd6", -1, 112], ["Straight to work", "#ff8a3d", 1, 112]].map(function(s){
    var w = 190, x = s[2] < 0 ? 260 - w - 4 : 264;
    return '<rect x="' + x + '" y="' + s[3] + '" width="' + w + '" height="40" fill="' + s[1] + '" stroke="#141a33" stroke-width="2.5"/>' +
      '<path d="' + (s[2] < 0 ? 'M' + x + ' ' + s[3] + 'l-18 20 18 20z' : 'M' + (x + w) + ' ' + s[3] + 'l18 20 -18 20z') + '" fill="' + s[1] + '" stroke="#141a33" stroke-width="2.5"/>' +
      T(x + w / 2, s[3] + 26, s[0], 15, { b: 1, a: "middle", c: "#ffffff" });
  }).join("") +
  T(260, 196, "Most jobs have more than one way in.", 14, { a: "middle", c: "#141a33" }) +
  '</svg>';

/* ---------- the challenge card: scout bingo ---------- */
var BINGO = ["Picked up a leaflet", "Said hello at a stall", "Found a job I had never heard of",
  "Heard about someone's working day", "Took a break when I needed one", "Asked a question",
  "Found a job linked to something I enjoy", "Spotted a course or college", "Wrote down three jobs"];
function bingoWidget(el, api){
  var d = api.data || {};
  if(!Array.isArray(d.ticks)) d.ticks = [];
  el.innerHTML = '<div class="a2task"><h4>Scout bingo</h4><p>Take this to the fair on a phone, or print the page. Tap a square whenever you do it. A line of three is a bingo, but any tick counts.</p>' +
    '<div class="bgrid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:520px"></div><p class="bmsg" style="font-weight:700;margin:10px 0 0"></p></div>';
  var grid = el.querySelector(".bgrid"), msg = el.querySelector(".bmsg");
  var LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  function draw(){
    grid.innerHTML = BINGO.map(function(t, k){
      var on = !!d.ticks[k];
      return '<button type="button" data-k="' + k + '" aria-pressed="' + on + '" style="font:inherit;font-size:.95rem;min-height:84px;cursor:pointer;padding:8px;border-radius:12px;border:3px solid ' + (on ? "#141a33" : "#d9d8e6") + ';background:' + (on ? "#ffd23f" : "#ffffff") + ';color:#141a33;font-weight:' + (on ? 700 : 400) + '">' + (on ? "&#9733; " : "") + t + '</button>';
    }).join("");
    var n = d.ticks.filter(Boolean).length;
    var bingo = LINES.some(function(l){ return l.every(function(k){ return d.ticks[k]; }); });
    msg.textContent = bingo ? "Bingo! Brilliant scouting." : n ? n + " ticked so far. Nice." : "";
  }
  grid.addEventListener("click", function(e){
    var b = e.target && e.target.closest ? e.target.closest("button[data-k]") : null;
    if(!b) return;
    var k = +b.getAttribute("data-k");
    d.ticks[k] = !d.ticks[k];
    try{ api.save(); }catch(err){}
    draw();
    api.done("done");
  });
  draw();
}

(window.A2PACKS = window.A2PACKS || {})["careers-fair-scout"] = {
  a2: true,
  id: "a2-careers-fair-scout",
  title: "Careers fair scout",
  subject: "Preparation for Adulthood",
  bodyClass: "subj-home subj-pillar",
  mins: 20,
  line: "Go in as a scout: look around, ask a question if you like, and come away with three jobs that caught your eye.",
  blurb: "Getting ready for a careers fair: what happens there, good questions to ask, a scout plan, and noting three jobs. Four short chunks, a bingo card to take along, and a scout report to make at the end.",
  note: "Getting ready for the careers fair, scout style. Four five minute chunks, a bingo card to take with you, and a scout report at the end. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Wanderer", line: "Wanderer: short and simple, with lots of pictures." },
    { id: "medium", name: "Scout", line: "Scout: open questions and a plan for the day." },
    { id: "spicy", name: "Spymaster", line: "Spymaster: follow up questions, ways into a job, and sharper notes." }
  ],
  themes: {
    time: { name: "Time travel", w: { sl: "Science", stall: "the science stall", job: "museum curator", job2: "robot engineer", job3: "archaeologist",
      does1: "looks after old objects and plans displays", does2: "designs and fixes robots", does3: "digs up clues about the past",
      does1s: "plans displays", tool: "a laser scanner", eye: "I love history" } },
    football: { name: "Football", w: { sl: "Sports", stall: "the sports stall", job: "sports coach", job2: "physio", job3: "groundsperson",
      does1: "plans training sessions and helps players improve", does2: "helps injured players get moving again", does3: "looks after the grass on the pitch",
      does1s: "runs training", tool: "a stopwatch", eye: "I love football" } },
    horror: { name: "Horror", w: { sl: "Film FX", stall: "the film effects stall", job: "special effects artist", job2: "night porter", job3: "security guard",
      does1: "makes spooky masks and smoke for films", does2: "moves patients round a hospital at night", does3: "keeps a building safe through the night",
      does1s: "makes masks", tool: "a smoke machine", eye: "I love scary films" } },
    fishing: { name: "Fishing", w: { sl: "Outdoors", stall: "the outdoors stall", job: "fishery officer", job2: "boat mechanic", job3: "park ranger",
      does1: "checks rivers and lakes are healthy for fish", does2: "fixes boat engines", does3: "looks after a country park and its wildlife",
      does1s: "checks the water", tool: "a water testing kit", eye: "I love fishing" } },
    music: { name: "Music", w: { sl: "Theatre", stall: "the theatre stall", job: "sound engineer", job2: "stage manager", job3: "costume maker",
      does1: "makes sure every voice and song sounds right", does2: "runs the show backstage and calls the cues", does3: "designs and sews the costumes",
      does1s: "runs the sound", tool: "a mixing desk", eye: "I love musicals" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: FAIR,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "What is a careers fair?", title: "A room full of jobs",
      ez: { title: "A room full of jobs", html: "<p>A <b>careers fair</b> is a room full of <b>stalls</b>.</p><p>Look round. Ask a question if you like.</p>" },
      fig: FAIR,
      html: "<p>A <b>careers fair</b> is a big room full of <b>stalls</b>. At each stall there are people who do a job, or people from a college or a company.</p>" +
        "<p>You can walk round, look, pick up a leaflet, and ask a question if you like. Nobody expects you to know what job you want.</p>" +
        "<p>Think of yourself as a <b>scout</b>. You are just looking for jobs that catch your eye. Maybe you will find [[stall]], with a [[job]] and [[tool]].</p>",
      lv: { spicy: { html: "<p>A <b>careers fair</b> is a big room full of <b>stalls</b>: employers, colleges, training providers, sometimes universities and the armed forces.</p>" +
        "<p>Each stall wants to tell you about jobs and the routes into them. You do not need a plan for your whole life. You are a <b>scout</b>: gathering information, comparing, and noticing what catches your eye.</p>" +
        "<p>Maybe you will find [[stall]], with a [[job]] and [[tool]]. A good scout leaves with names, details and a next step.</p>" } } },

    { type: "mc", topic: "What is a careers fair?",
      q: "What can you do at a careers fair?",
      options: ["Walk round, look, and ask questions if you like.", "Sit a test before you can go in.", "Sign up for a job you have to start tomorrow."],
      answer: 0,
      slips: { 1: "There is no test. It is a place to look around.", 2: "Nobody has to sign up for anything. You are just finding out." },
      hint: "Think about what a scout does: looks and finds out.",
      why: "A careers fair is for finding out. Looking, picking up leaflets and asking questions are all you need to do.",
      ez: { hint: "A scout looks and finds out.", why: "You look round, and ask if you like.", slips: { 1: "No test. You just look round.", 2: "No signing up. You just find out." } },
      lv: { spicy: { q: "What is the main point of going to a careers fair?",
        options: ["To gather information about jobs and the ways into them.", "To get a job offer on the day.", "To collect as many free pens as possible.", "To prove you already know what you want to be."],
        slips: { 1: "Some people do get offers, but that is not the point. Finding out comes first.", 2: "Free pens are a bonus, not a plan.", 3: "Most people do not know yet. That is exactly why fairs exist." },
        why: "A fair is an information hunt. You leave knowing more about jobs, and the routes into them, than when you walked in." } } },

    { type: "sort", topic: "What is a careers fair?",
      q: "Would you find it at a careers fair?",
      buckets: ["You might find this", "Probably not"],
      cards: [["Leaflets about jobs", 0], ["A swimming pool", 1], ["People who do a job", 0], ["A maths test", 1]],
      hint: "A careers fair is about finding out about jobs.",
      why: "Leaflets and people who do the job help you find out. Pools and tests are somewhere else.",
      ez: { hint: "It is all about jobs.", why: "Leaflets and people help. No pools or tests." },
      lv: { medium: { cards: [["Leaflets about jobs", 0], ["A swimming pool", 1], ["People who do a job", 0], ["A maths test", 1], ["A college stall", 0], ["A job you must take", 1]] },
            spicy: { cards: [["Information about apprenticeships", 0], ["A job you must accept", 1], ["Employers looking for future staff", 0], ["An exam to get in", 1], ["College course leaflets", 0], ["A rule that you ask every stall a question", 1]],
              why: "Fairs are full of information and people. Nothing there is compulsory: no exams, no forced jobs, and no rule about questions." } } },

    { type: "mc", topic: "What is a careers fair?",
      q: "Jay walks past a stall for a [[job2]]. He has never heard of that job. What could he do?",
      fig: '<svg viewBox="0 0 360 170" role="img" aria-label="Jay looking at a stall, thinking">' + A2ART.jay(110, 62, 0.85, "hmm") + A2ART.bubble(170, 10, 170, 52, "A [[job2]]?\nWhat is that?", 176) + '</svg>',
      options: ["Stop and have a look, or ask what it is.", "Walk past fast because he does not know it.", "Pretend he knows all about it."],
      answer: 0,
      slips: { 1: "A job you have never heard of could be the best one there. Have a look.", 2: "Pretending means you learn nothing. Asking is fine." },
      hint: "A scout is curious.",
      why: "New jobs are the whole point. Stopping, looking or asking is how you find out.",
      ez: { q: "Jay has never heard of a [[job2]]. What could he do?", hint: "A scout is curious.", why: "Stop and look, or ask. That is how you find out.", slips: { 1: "A new job could be the best one!", 2: "Pretending means you learn nothing." } },
      lv: { spicy: { options: ["Ask what a normal day is like for a [[job2]].", "Walk past: if he has not heard of it, it cannot be for him.", "Take a leaflet without reading it so it looks like he visited.", "Ask whether the [[job2]] earns more than everyone else there."],
        slips: { 1: "Lots of great jobs are ones people have never heard of.", 2: "That collects paper, not information.", 3: "Pay matters, but it is a strange first question and they will not know everyone else's pay." },
        why: "An open question about the day tells you what the job is really like." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Good questions", title: "Questions open up a job",
      ez: { title: "Good questions", html: "<p>Good questions start with <b>What</b>, <b>How</b> or <b>Why</b>.</p><p>Listening counts too.</p>" },
      fig: QWORDS,
      html: "<p>Good questions often start with <b>What</b>, <b>How</b> or <b>Why</b>.</p>" +
        "<ul><li>What do you do in a normal day?</li><li>What do you like about your job?</li><li>How did you get into it?</li><li>What would I need to learn?</li></ul>" +
        "<p>You can write your questions on your scout sheet and read them out, or show the sheet. Or just stand nearby and listen while someone else asks. That counts too.</p>",
      lv: { medium: { fig: DOORS, html: "<p>A <b>closed</b> question gets a yes or a no. \"Do you like your job?\" \"Yes.\" End of chat.</p>" +
          "<p>An <b>open</b> question gets a proper answer. \"<b>What</b> do you like about your job?\" Now they tell you the good bits.</p>" +
          "<p>Open questions often start with What, How or Why. You can write them on your scout sheet and read them out. Listening while someone else asks counts too.</p>" },
            spicy: { fig: DOORS, html: "<p>A <b>closed</b> question gets yes or no. An <b>open</b> question (What, How, Why) gets a real answer.</p>" +
          "<p>Spymaster move: the <b>follow up</b>. Listen to the answer, then pick one thing they said and ask more. \"You said you work nights. What is that like?\"</p>" +
          "<p>Three questions that cover a lot: <b>What is a normal day?</b> <b>How did you get in?</b> <b>What would I need to learn or have?</b></p>" } } },

    { type: "mc", topic: "Good questions", explain: true,
      q: "Which question will tell you the most about the job?",
      options: ["What do you do in a normal day?", "Is it good?", "Can I have a pen?"],
      answer: 0,
      slips: { 1: "\"Is it good?\" gets a yes or no. You learn very little.", 2: "Free pens are nice, but you learn nothing about the job." },
      hint: "Which one makes them talk about their work?",
      why: "Asking about a normal day gets them describing the real job.",
      ez: { hint: "Which makes them talk about work?", why: "A normal day tells you the real job.", slips: { 1: "That gets a yes or no.", 2: "A pen tells you nothing about the job." } },
      lv: { spicy: { q: "The [[job]] says: \"I work weekends in the summer.\" Which is the best follow up?",
        options: ["What is a summer weekend like for you?", "Do you like weekends?", "OK, thanks.", "Is that bad?"],
        slips: { 1: "Closed: yes or no, and it is about weekends, not the job.", 2: "That ends the chat just as it gets useful.", 3: "Closed, and it pushes them to judge it. Open questions let them explain." },
        why: "It picks up what they just said and opens it up. That is a follow up question." } } },

    { type: "match", topic: "Good questions",
      q: "Match each question to what it finds out.",
      pairs: [["What do you do in a normal day?", "What the job is like"], ["How did you get into it?", "How to get the job"], ["What do you like about it?", "The best bits"]],
      hint: "Read each question and think what the answer would be about.",
      why: "Each question unlocks a different part of the job.",
      ez: { hint: "What would the answer be about?", why: "Each question finds out something different." },
      lv: { medium: { pairs: [["What do you do in a normal day?", "What the job is like"], ["How did you get into it?", "How to get the job"], ["What do you like about it?", "The best bits"], ["What would I need to learn?", "Skills and courses"]] },
            spicy: { pairs: [["What do you do in a normal day?", "What the job is like"], ["How did you get into it?", "The route in"], ["What is the hardest part?", "The tricky bits"], ["What would I need to learn?", "Skills and courses"]] } } },

    { type: "sort", topic: "Good questions",
      q: "Which questions help you find out about the job?",
      buckets: ["Helps me find out", "Does not help much"],
      cards: [["What do you do all day?", 0], ["Where is the toilet?", 1], ["How did you start?", 0], ["Do you like cake?", 1]],
      hint: "Is it about the job?",
      why: "Questions about the day and how they started tell you about the job. Toilets and cake do not (even if cake is important).",
      ez: { why: "Questions about the job help. Toilets and cake do not." },
      lv: { medium: { q: "Sort into open and closed questions.", fig: DOORS,
          buckets: ["Open: gets a real answer", "Closed: gets yes or no"],
          cards: [["What do you do all day?", 0], ["Do you like it?", 1], ["How did you start?", 0], ["Is it hard?", 1], ["Why did you choose this job?", 0], ["Do you work weekends?", 1]],
          hint: "Could they answer with just yes or no?",
          why: "What, How and Why questions open up a chat. Do and Is questions can be answered in one word." },
            spicy: { q: "Sort into open and closed questions.", fig: DOORS,
          buckets: ["Open: gets a real answer", "Closed: gets yes or no"],
          cards: [["What made you choose this job?", 0], ["Is there an apprenticeship?", 1], ["How did you train?", 0], ["Do you need a degree?", 1], ["Tell me about the hardest day you have had.", 0], ["Is the pay good?", 1]],
          hint: "Could they answer with just yes or no? \"Tell me about\" is sneaky.",
          why: "\"Tell me about\" works like an open question. Closed questions are still useful for quick facts, like whether there is an apprenticeship." } } },

    { type: "text", topic: "Good questions",
      q: "Write one question you could ask the [[job]], if you like. It goes on your scout sheet.",
      need: [["what", "how", "why", "where", "when", "which", "who", "do", "does", "did", "is", "are", "can", "could", "would", "have", "tell"]],
      slips: [[["hello", "hi"], "A friendly start. Now add a question about the job, like \"What do you do all day?\""]],
      model: "What do you do in a normal day?",
      hint: "Start with What, How or Why.",
      why: "Any question about the job works. What, How and Why ones get the longest answers.",
      ez: { q: "Write 1 question for the [[job]], if you like.", why: "Any job question works. What, How and Why are best.", slips: [[null, "Hi! Now ask about the job."]] },
      lv: { medium: { q: "Write one <b>open</b> question you could ask the [[job]]. It goes on your scout sheet.",
          need: [["what", "how", "why", "tell", "which"]],
          slips: [[["do you", "is it", "are you", "can i"], "That one might get a yes or no. Try starting with What, How or Why."]],
          model: "How did you become a [[job]]?" },
            spicy: { q: "The [[job]] says: \"I trained for two years before I was any good.\" Write an <b>open follow up</b> question.",
          need: [["what", "how", "why", "tell", "which"], ["train", "trained", "training", "two years", "learn", "course", "years", "good", "start"]],
          slips: [[["do you", "is it", "was it", "did you"], "That might get a yes or no. Try What, How or Why."]],
          model: "What did you learn in your training?",
          hint: "Use What, How or Why, and pick up on the training.",
          why: "A good follow up picks up their exact words (training, two years) and opens them up." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Scout plan", title: "Before, during and after",
      ez: { title: "Before, during, after", html: "<p><b>Before</b>: pick stalls. <b>During</b>: look, and take breaks.</p><p><b>After</b>: write down 3 jobs.</p>" },
      fig: PLAN,
      html: "<p><b>Before:</b> look at the list of stalls and star a few that sound interesting. Pack your kit.</p>" +
        "<p><b>During:</b> start with a stall you like the look of. It is fine to take a break, step out, or sit in a quiet spot. You can go round with Jay or a friend.</p>" +
        "<p><b>After:</b> write down three jobs that caught your eye, while you still remember them.</p>",
      lv: { spicy: { html: "<p><b>Before:</b> get the list of stalls and star three to five. Mix it up: some you are sure about, and one wild card you know nothing about. Write your questions down.</p>" +
        "<p><b>During:</b> pace yourself. A quiet spot is there for a reason. Note things straight away: names, routes in, anything surprising.</p>" +
        "<p><b>After:</b> write up your three jobs and one next step, such as a website to look at or a course to find out about.</p>" } } },

    { type: "order", topic: "Scout plan",
      q: "Put the scout plan in order.",
      items: ["Look at the list of stalls", "Pack your scout sheet and pen", "Visit a stall and look around", "Ask a question or pick up a leaflet", "Write down three jobs that caught your eye"],
      hint: "Before the fair, then during, then after.",
      why: "Plan and pack first, visit and ask during, then write your jobs down after.",
      ez: { hint: "Before, then during, then after.", why: "Look at the list. Visit. Then write." },
      lv: { mild: { items: ["Look at the list of stalls", "Visit a stall and look around", "Write down three jobs"] } } },

    { type: "multi", topic: "Scout plan",
      q: "Which things are worth taking? Pick <b>all</b> that would help.",
      fig: KIT,
      options: ["A scout sheet", "A pen", "A water bottle", "A bag for leaflets", "A goblin to carry your bag", "Your duvet"],
      answers: [0, 1, 2, 3],
      slips: { any: "Unhand me, goblin! Lovely idea, but a bag does the job. Have another look at the picture." },
      hint: "Look at the picture.",
      why: "Sheet, pen, water and a bag. The goblin and the duvet can stay at home.",
      ez: { q: "What is worth taking? Pick <b>all</b>.", why: "A sheet and a pen. The duvet stays home.", slips: { any: "2 things help. The duvet can stay home." } },
      lv: { mild: { options: ["A scout sheet", "A pen", "Your duvet"], answers: [0, 1], why: "A sheet and a pen to write your jobs down. The duvet can stay at home." } } },

    { type: "mc", topic: "Scout plan",
      q: "The hall gets loud and busy. What could you do?",
      options: ["Take a break in a quieter spot, then carry on if you want to.", "Push on and ignore how you feel.", "Shout so people can hear you."],
      answer: 0,
      slips: { 1: "Your feelings are useful information. A break helps you get more out of the fair.", 2: "Shouting will not make the hall quieter. A break will help more." },
      hint: "What is the chill zone for?",
      why: "Breaks are part of the plan. Lots of people use them, and you can carry on afterwards, or not.",
      ez: { hint: "What is a quiet spot for?", why: "Take a break. Carry on after, if you want.", slips: { 1: "A break helps. Your feelings matter.", 2: "Shouting will not make it quieter." } },
      lv: { spicy: { options: ["Take a break somewhere quieter, then pick one starred stall to go back to.", "Leave and decide fairs are not for you.", "Keep going at full speed so you see every stall.", "Stand in the busiest spot until it feels normal."],
        slips: { 1: "One loud moment does not decide the whole thing. A break first.", 2: "Seeing every stall is not the goal. Good notes on a few is better.", 3: "That just uses up your energy. Pace yourself." },
        why: "Pacing yourself and coming back with a clear target is how experienced scouts do it." } } },

    { type: "mc", topic: "Scout plan", explain: true,
      q: "You only have time for a few stalls. How could you choose?",
      options: ["Pick stalls linked to things you enjoy.", "Pick the stall with the most sweets.", "Pick none and wait by the door."],
      answer: 0,
      slips: { 1: "Sweets are a bonus, not a plan.", 2: "Waiting by the door means you miss out. Even one stall is a good start." },
      hint: "What do you enjoy? Is there a stall linked to it?",
      why: "Starting with what you enjoy is a great way in. If you like [[sl]], [[stall]] is a good place to start.",
      ez: { q: "How could you choose which stalls?", hint: "What do you enjoy?", why: "Start with what you enjoy. Try [[stall]]!", slips: { 1: "Sweets are a bonus, not a plan.", 2: "Even 1 stall is a good start." } },
      lv: { spicy: { q: "You only have time for four stalls. Which plan is the smartest?",
        options: ["Three linked to things you enjoy, and one you know nothing about.", "Four stalls in a row, starting nearest the door.", "The four stalls with the longest queues.", "Only the stall your friend wants to see."],
        slips: { 1: "Near the door is easy, but it is not linked to you at all.", 2: "A long queue tells you what is popular, not what suits you.", 3: "Your friend's choice is fine for one stall, but this is your scouting mission." },
        why: "Mostly things you enjoy, plus one wild card. The wild card is where surprises come from." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Three jobs", title: "Come away with three jobs",
      ez: { title: "3 jobs", html: "<p>Your mission: find <b>3 jobs</b> you like.</p><p>Note the <b>job</b>, what they <b>do</b>, and <b>why</b> you like it.</p>" },
      fig: SHEET,
      html: "<p>Your mission: come away with <b>three jobs</b> that caught your eye.</p>" +
        "<p>For each one, write three things: the <b>job</b>, one thing they <b>do</b>, and <b>why</b> it caught your eye.</p>" +
        "<p>For example: <b>[[Job]]</b>. They [[does1]]. Caught my eye because [[eye]].</p>",
      lv: { spicy: { fig: ROUTES, html: "<p>Your mission: come away with <b>three jobs</b> that caught your eye.</p>" +
        "<p>For each one, note: the <b>job</b>, what they <b>do</b>, <b>why</b> it caught your eye, and the <b>way in</b>. Most jobs have more than one way in: college, an apprenticeship (training while you get paid), university, or starting work and learning on the job.</p>" +
        "<p>For example: <b>[[Job]]</b>. They [[does1]]. Way in: a college course, then an apprenticeship. Caught my eye because [[eye]].</p>" } } },

    { type: "mc", topic: "Three jobs",
      q: "Which note will help you most when you look at it next week?",
      options: ["[[Job]]: they [[does1]]. I liked it because [[eye]].", "Some job. It was OK.", "Stall 4."],
      answer: 0,
      slips: { 1: "Next week you will not remember which job that was.", 2: "A stall number will not mean much next week. Write the job down." },
      hint: "Which one has the job, what they do, and why?",
      why: "It has the job name, what they do and why you liked it. Future you will thank you.",
      ez: { q: "Which note will help you next week?", hint: "Job, what they do, and why.", why: "It has the job, what they do, and why.", slips: { 1: "You will forget which job that was.", 2: "Write the job, not the stall number." } },
      lv: { spicy: { options: ["[[Job]]: they [[does1]]. Way in: college then an apprenticeship. Liked it because [[eye]].", "[[Job]]: seemed good.", "[[Job]], [[job2]], [[job3]].", "Loads of jobs. Some were good."],
        slips: { 1: "It has the name, but \"seemed good\" will not help you decide anything later.", 2: "Three names but no details. You will forget what they do.", 3: "Nothing here to follow up on." },
        why: "Name, what they do, the route in and why it caught your eye. That is a note you can act on." } } },

    { type: "match", topic: "Three jobs",
      q: "Match each job to what they do.",
      pairs: [["[[Job]]", "[[Does1]]"], ["[[Job2]]", "[[Does2]]"], ["[[Job3]]", "[[Does3]]"]],
      hint: "Look for a word in the job name that links to the work.",
      why: "Every job on your scout sheet needs a line like these, so you remember what it is.",
      ez: { hint: "Find a word that links to the work.", why: "Each job needs a note like this." },
      lv: { spicy: { q: "Match each way into a job to what it means.",
        pairs: [["Apprenticeship", "Training at work while you get paid"], ["College course", "Learning skills for a job, often for one or two years"], ["University degree", "Studying a subject in depth, usually for three years"], ["Straight to work", "Starting a job and learning as you go"]],
        hint: "Which one says you get paid while you train?",
        why: "Knowing the routes means you can ask \"How did you get in?\" and understand the answer." } } },

    { type: "widget", topic: "Three jobs", unscored: true,
      title: "Take it with you: scout bingo",
      ez: { title: "Scout bingo", html: "<p>A challenge for the real fair. Your ticks save here.</p>" },
      html: "<p>This is your challenge for the real fair, away from the screen. Use it on a phone or print the page, whatever suits. Your ticks save here and can go to Jay.</p>",
      mount: bingoWidget,
      report: function(d){ var n = d && d.ticks ? d.ticks.filter(Boolean).length : 0; return n ? "Scout bingo: " + n + " of " + BINGO.length + " ticked." : ""; } },

    { type: "write", topic: "Three jobs",
      q: "After the fair (or now, if you would rather imagine it), write about your three jobs, if you like. Name each one and say why it caught your eye. Jay would love to read it.",
      starters: ["The first job that caught my eye was", "They", "I liked it because", "Another job I spotted was"],
      checklist: ["Three jobs", "What each one does", "Why it caught my eye"],
      ez: { q: "Tell Jay about your 3 jobs, if you like." },
      minWords: 20,
      lv: { spicy: { q: "After the fair (or now, imagining it), write up your three jobs, if you like. For each: what they do, the way in, and why it caught your eye. End with one next step. Jay would love to read it.",
        checklist: ["Three jobs", "What each one does", "The way in", "Why it caught my eye", "One next step"], minWords: 50 } } }
  ],

  ez: {
    realWorld: { title: "Scouting for a living", html: "<p>Careers advisers help people find new jobs.</p><p>100 years ago, lots of today's jobs did not exist!</p>" },
    make: { intro: "Your 3 jobs on a card.", fields: [null, null, null, { label: "The one I want to know more about" }, null] }
  },

  realWorld: {
    title: "Careers advisers scout for a living",
    html: "<p>Careers advisers spend their days helping people find jobs they did not know existed. The questions you practised today are the ones they use.</p>" +
      "<p>For our big question, if we could time travel, should we? Jump back 100 years and lots of today's jobs did not exist yet. Jump forward and some of the jobs waiting for you have not been invented. Scouting is a skill that never goes out of date.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to a time portal wondering about future jobs">' + A2ART.portal(80, 75, 58) + A2ART.jay(240, 46, 0.85, "wow") +
      A2ART.bubble(290, 6, 124, 52, "Jobs of the\nfuture?", 294) + '</svg>'
  },

  make: {
    title: "Make a scout report",
    intro: "Your three jobs on one card. Keep it, stick it up, or send it to Jay.",
    fields: [
      { id: "j1", label: "Job one", ph: "[[Job]]", max: 34 },
      { id: "j2", label: "Job two", ph: "[[Job2]]", max: 34 },
      { id: "j3", label: "Job three", ph: "[[Job3]]", max: 34 },
      { id: "why", label: "The one I most want to find out more about, and why", ph: "[[Job]], because [[eye]]", max: 80 },
      { id: "name", label: "Scout", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      var why = wrap(v.why, 44, 2);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">' +
        '<rect width="600" height="420" rx="24" fill="#fdf6e3"/>' +
        '<rect x="14" y="14" width="572" height="392" rx="18" fill="none" stroke="#141a33" stroke-width="4" stroke-dasharray="14 8"/>' +
        T(40, 64, "SCOUT REPORT", 26, { b: 1, c: "#e04848" }) +
        T(40, 92, "Three jobs that caught my eye", 15, { c: "#5b6180" }) +
        [v.j1, v.j2, v.j3].map(function(j, k){
          var y = 116 + k * 62, l = wrap(j, 30, 2);
          return '<rect x="40" y="' + y + '" width="520" height="52" rx="12" fill="' + ["#ffd23f", "#22b8e6", "#19c39a"][k] + '" fill-opacity=".35" stroke="#141a33" stroke-width="2.5"/>' +
            '<path d="M70 ' + (y + 12) + 'l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1z" fill="#ff8a3d" stroke="#141a33" stroke-width="1.5"/>' +
            (l.length > 1 ? T(100, y + 22, esc(l[0]), 17, { b: 1 }) + T(100, y + 42, esc(l[1]), 17, { b: 1 }) : T(100, y + 33, esc(l[0] || ""), 20, { b: 1 }));
        }).join("") +
        T(40, 324, "Most want to find out more:", 15, { b: 1, c: "#5b6180" }) +
        why.map(function(l, k){ return T(40, 348 + k * 22, esc(l), 17); }).join("") +
        T(560, 396, "Scout: " + esc(wrap(v.name, 22, 1)[0] || ""), 15, { b: 1, a: "end", c: "#5b6180" }) +
        '</svg>';
    }
  }
};
})();
