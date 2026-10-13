/* JT's Dugout: short learning activities.
   Thirty small hands on tasks, two for each training session.
   The game checks the finished work, so a reward means the task was really done.
   Nothing is lost for a wrong try. Nudges are free. Strings here are trusted HTML. */
(function(){
"use strict";

var PD = "&pound;";
function pw(h, w){ return '<span class="lsw" style="background:' + h + '" title="' + w + '"></span>' + w }

var CH = [
/* ---- Maths ---- */
{ id: "tt1", slug: "tiny-town", title: "Shrink the road", type: "dial",
  intro: "The real road through Tiny Town is 120 m long. On the plan, 1 cm stands for 20 m. Slide until the road on your plan is the right length.",
  sliders: [{ k: "cm", l: "Road on the plan", min: 1, max: 15, step: 1, v: 3, u: " cm" }],
  read: function(v){ return '<div class="lbar"><i style="width:' + (v.cm / 15 * 100) + '%"></i></div><p>On the plan: <b>' + v.cm + ' cm</b>. That stands for <b>' + (v.cm * 20) + ' m</b> in real life.</p>' },
  ok: function(v){ return v.cm === 6 }, sol: { cm: 6 },
  hint: "Real length divided by the scale. How many lots of 20 m fit into 120 m?",
  why: "120 divided by 20 is 6, so the road is 6 cm on the plan. Dividing by the scale shrinks real lengths." },
{ id: "tt2", slug: "tiny-town", title: "Mix the roof paint", type: "dial",
  intro: "Tiny Town roofs need 15 litres of paint. The mix is 2 parts red to 3 parts white. Set the litres so the mix is right and the total is 15.",
  sliders: [{ k: "r", l: "Red", min: 0, max: 15, step: 1, v: 5, u: " litres" }, { k: "w", l: "White", min: 0, max: 15, step: 1, v: 5, u: " litres" }],
  read: function(v){ var t = v.r + v.w; return '<div class="lmix"><i style="flex:' + v.r + ';background:#d9544d"></i><i style="flex:' + v.w + ';background:#f1ece2"></i></div><p>Total: <b>' + t + ' litres</b>. Red to white is <b>' + v.r + ' : ' + v.w + '</b>.</p>' },
  ok: function(v){ return v.r + v.w === 15 && v.r * 3 === v.w * 2 }, sol: { r: 6, w: 9 },
  hint: "2 + 3 is 5 parts. Each part is 15 divided by 5 litres.",
  why: "5 parts make 15 litres, so one part is 3 litres. Red is 2 parts (6 litres) and white is 3 parts (9 litres)." },
{ id: "na1", slug: "number-allotment", title: "Plant the beds", type: "paint", cells: 24, perRow: 6,
  intro: "The allotment has 24 beds. Pick a plant, then tap beds to plant it. Plant one quarter with carrots and three eighths with peas.",
  cols: [{ n: "Carrots", c: "#e8893a", k: 6 }, { n: "Peas", c: "#6fcf7d", k: 9 }],
  hint: "A quarter of 24 is 24 divided by 4. For eighths, find one eighth first (24 divided by 8) then multiply.",
  why: "A quarter of 24 is 6 and one eighth is 3, so three eighths is 9. The other 9 beds stay empty for now." },
{ id: "na2", slug: "number-allotment", title: "Square numbers", type: "fix",
  intro: "Square numbers come from multiplying a number by itself. Complete the pattern and the rule.",
  parts: ["Square numbers go 1, 4, 9, 16, ", { a: "25", o: ["20", "25", "30", "36"] }, ", 36, ", { a: "49", o: ["42", "45", "49", "56"] }, ", 64. The 7th square number is 7 x ", { a: "7", o: ["2", "7", "14", "49"] }, "."],
  hint: "1 x 1, 2 x 2, 3 x 3 and so on. What comes after 4 x 4?",
  why: "Each square number is a number times itself, so 5 x 5 is 25 and 7 x 7 is 49." },
{ id: "dd1", slug: "drone-dash", title: "Land on the pad", type: "dial",
  intro: "Your drone starts at (0, 0). The landing pad is at (6, 4). Across first, then up. Set the drone's position and land on the pad.",
  sliders: [{ k: "x", l: "Across (x)", min: 0, max: 10, step: 1, v: 0, u: "" }, { k: "y", l: "Up (y)", min: 0, max: 10, step: 1, v: 0, u: "" }],
  read: function(v){
    var s = '<svg viewBox="-8 -8 226 226" class="lgrid" role="img" aria-label="Grid with a drone and a landing pad">', i;
    for(i = 0; i <= 10; i++){ s += '<line x1="' + (i * 20) + '" y1="0" x2="' + (i * 20) + '" y2="200"/><line x1="0" y1="' + (i * 20) + '" x2="200" y2="' + (i * 20) + '"/>' }
    s += '<rect x="' + (6 * 20 - 8) + '" y="' + (200 - 4 * 20 - 8) + '" width="16" height="16" class="pad"/><circle cx="' + (v.x * 20) + '" cy="' + (200 - v.y * 20) + '" r="7" class="drone"/></svg>';
    return s + '<p>Drone at <b>(' + v.x + ', ' + v.y + ')</b></p>';
  },
  ok: function(v){ return v.x === 6 && v.y === 4 }, sol: { x: 6, y: 4 },
  hint: "The first number is across, the second is up. The pad is 6 across and 4 up.",
  why: "Coordinates are written (across, up). The pad at (6, 4) is 6 along and 4 up." },
{ id: "dd2", slug: "drone-dash", title: "Cave heights", type: "order",
  intro: "The drone is mapping a cave. Heights are measured from the entrance, so below it counts as negative. Put these heights in order, lowest at the top.",
  items: ["-10 m", "-3 m", "0 m", "5 m", "8 m"],
  hint: "The further below zero, the lower the height. -10 is lower than -3.",
  why: "On a number line, numbers get smaller as you go left. -10 is lower than -3, and both are below 0." },

/* ---- Digital media ---- */
{ id: "im1", slug: "inside-the-machine", title: "Match the parts", type: "pairs",
  intro: "Every computer has parts that each do one job. Match each part to what it does.",
  pairs: [["Processor", "Does the thinking and sums"], ["Memory (RAM)", "Holds what you are using right now"], ["Storage", "Keeps your files when it is switched off"], ["Screen", "Shows you the result"]],
  hint: "Which part would you lose if the power went off? Which part only shows things?",
  why: "The processor works things out, RAM is short term workspace, storage keeps files and the screen displays the result." },
{ id: "im2", slug: "inside-the-machine", title: "From key to screen", type: "order",
  intro: "You press a key and a letter appears. Put the steps in the order they happen.",
  items: ["You press a key", "The keyboard sends a signal", "The processor works out which letter it is", "The screen draws the letter"],
  hint: "Input first, then the thinking, then output at the end.",
  why: "Computers work in a loop: input, process, output. The keyboard is the input and the screen is the output." },

/* ---- Preparation for adulthood: money and planning ---- */
{ id: "pb1", slug: "party-budget", title: "Spend the party money", type: "dial",
  intro: "You have " + PD + "60 for the party. Food needs at least " + PD + "25, and music and decorations each need at least " + PD + "10. Spend all of it, and not a penny more.",
  sliders: [{ k: "f", l: "Food", min: 0, max: 40, step: 1, v: 10, u: "" }, { k: "m", l: "Music", min: 0, max: 40, step: 1, v: 10, u: "" }, { k: "d", l: "Decorations", min: 0, max: 40, step: 1, v: 10, u: "" }],
  money: true,
  read: function(v){ var t = v.f + v.m + v.d, left = 60 - t; return '<div class="lbar ' + (left < 0 ? "over" : "") + '"><i style="width:' + Math.min(100, t / 60 * 100) + '%"></i></div><p>Spent <b>' + PD + t + '</b> of ' + PD + '60. ' + (left < 0 ? 'That is ' + PD + (-left) + ' over.' : (left === 0 ? 'Nothing left over.' : 'Left: <b>' + PD + left + '</b>.')) + '</p>' },
  ok: function(v){ return v.f + v.m + v.d === 60 && v.f >= 25 && v.m >= 10 && v.d >= 10 },
  sol: { f: 30, m: 15, d: 15 },
  hint: "Spend the three minimums first (25 + 10 + 10). How much is left to share out?",
  why: "A budget is a plan for a fixed amount. Cover the must haves first, then share out what remains." },
{ id: "pb2", slug: "party-budget", title: "Need or nice to have", type: "sort", buckets: ["Need", "Nice to have"],
  intro: "Planning a party means choosing what matters most. Sort these party items.",
  items: [["Food for the guests", 0], ["A place to hold it", 0], ["Invitations, so people know", 0], ["A balloon arch", 1], ["A photo booth", 1], ["Disco lights", 1]],
  hint: "Ask: would the party still work without it?",
  why: "Needs come first in a budget. Nice to haves are what you add if there is money left." },

/* ---- English ---- */
{ id: "ob1", slug: "objection", title: "Build the argument", type: "order",
  intro: "A strong paragraph makes a claim, backs it up, explains it and links back. Put these sentences in order.",
  items: ["The school should start lunch a little later.", "In our survey, 18 of 25 students said they were hungry by 11 o'clock.", "That shows many students find it hard to concentrate before lunch.", "So a later lunch would help people learn."],
  hint: "Start with what you think. End by bringing it back to that point.",
  why: "Claim, evidence, explanation, link. Evidence is what makes a claim hard to argue with." },
{ id: "ob2", slug: "objection", title: "Evidence or opinion", type: "sort", buckets: ["Evidence, can be checked", "Opinion"],
  intro: "Good arguments rely on things you can check. Sort these.",
  items: [["The match finished 3 to 1.", 0], ["It was the best match ever.", 1], ["The survey asked 40 students.", 0], ["Everybody loves the new canteen.", 1], ["The library opens at 8.30.", 0], ["Homework is boring.", 1]],
  hint: "Could you look it up or count it? If yes, it is evidence.",
  why: "Facts can be checked. Opinions say what someone feels, so they need evidence to back them up." },
{ id: "pe1", slug: "punctuation-escape", title: "Open the doors", type: "fix",
  intro: "Each door opens with the right mark. Pick a punctuation mark for every gap.",
  marks: true,
  parts: ["Where is the match tonight", { a: "?", o: "m" }, "<br>We packed boots", { a: ",", o: "m" }, " shin pads", { a: ",", o: "m" }, " and a water bottle", { a: ".", o: "m" }, "<br>The captain", { a: "'", o: "m" }, "s armband is missing", { a: ".", o: "m" }, "<br>Watch out", { a: "!", o: "m" }],
  hint: "Questions end with a question mark. Lists use commas between items. An apostrophe shows something belongs to someone.",
  why: "Question mark for questions, commas to split a list, an apostrophe for belonging (the captain's armband) and an exclamation mark for a warning." },
{ id: "pe2", slug: "punctuation-escape", title: "Its or it's", type: "fix",
  intro: "Three little words cause lots of trouble. Pick the right one for each gap.",
  parts: ["I think ", { a: "it's", o: ["its", "it's"] }, " going to rain. The dog wagged ", { a: "its", o: ["its", "it's"] }, " tail. ", { a: "They're", o: ["There", "Their", "They're"] }, " on ", { a: "their", o: ["there", "their", "they're"] }, " way, and the keys are over ", { a: "there", o: ["there", "their", "they're"] }, "."],
  hint: "It's means it is. They're means they are. Their is about belonging, and there is about place.",
  why: "Try swapping in the long form. If 'it is' or 'they are' fits, use the apostrophe." },
{ id: "bi1", slug: "break-it-up", title: "Match day paragraphs", type: "break",
  intro: "A paragraph holds one idea. Tap between sentences to start a new paragraph where the topic changes. There are two changes.",
  sents: ["We woke early and packed our kit bags.", "Dad checked the boots and the water bottles.", "We left the house just before nine.", "At the ground, the whistle went and the game began.", "Our striker hit the post in the first minute.", "By half time we were 2 nil up.", "After the match, we shook hands with the other team.", "Then we went for chips."],
  brk: [3, 6],
  hint: "Getting ready, the match itself, and afterwards. Where does each part end?",
  why: "A new paragraph shows a change of time, place or topic: getting ready, the match, then afterwards." },
{ id: "bi2", slug: "break-it-up", title: "The farm visit", type: "break",
  intro: "Tap between sentences to start a new paragraph. Look for a change of place or person. There are two changes.",
  sents: ["We left school at nine on Monday morning.", "The journey took about an hour.", "At the farm, the first thing we saw was a huge red barn.", "Inside the barn were rows of tractors.", "Later, the farmer, Mrs Okoye, showed us the animals.", "She explained how she looks after them every day."],
  brk: [2, 4],
  hint: "Journey, then the barn, then the farmer. Where does each begin?",
  why: "The paragraph changes when we arrive somewhere new and again when a new person takes over." },

/* ---- Aesthetic and creative ---- */
{ id: "gn1", slug: "gallery-night", title: "Hang a rainbow wall", type: "order",
  intro: "The gallery wants a rainbow wall, left to right. Put the colours in rainbow order, starting with red.",
  items: [pw("#d9453d", "Red"), pw("#f08a2c", "Orange"), pw("#f1d04a", "Yellow"), pw("#4fae5c", "Green"), pw("#3f78d6", "Blue"), pw("#7d55c7", "Violet")],
  hint: "Red, orange, yellow, then green, blue and violet. Think of a rainbow after rain.",
  why: "The spectrum runs red, orange, yellow, green, blue, violet. Artists use this order to make colour wheels." },
{ id: "gn2", slug: "gallery-night", title: "Look closely", type: "pairs",
  intro: "Art has its own words. Match each word to its meaning.",
  pairs: [["Foreground", "The part of a picture nearest to you"], ["Background", "The part that is furthest away"], ["Portrait", "A picture of a person"], ["Still life", "A picture of objects set out together"]],
  hint: "Fore means in front. Which one shows objects that do not move?",
  why: "Foreground and background describe distance in a picture. Portrait and still life describe what it shows." },

/* ---- Human and social ---- */
{ id: "wr1", slug: "warning-room", title: "Spot the signs", type: "sort", buckets: ["Warning sign", "Calm sign"],
  intro: "Bodies give signals before things get hard. Sort what someone might look like.",
  items: [["Fists clenched", 0], ["Shoulders relaxed", 1], ["Talking faster and louder", 0], ["Chatting and smiling", 1], ["Pacing, cannot sit still", 0], ["Slow, steady breathing", 1]],
  hint: "Which ones show tension building up?",
  why: "Noticing early signs gives everyone time to help. A short break is easier early than late." },
{ id: "wr2", slug: "warning-room", title: "A calm plan", type: "order",
  intro: "A calm plan has steps. Put them in the order that works best.",
  items: ["Notice the early sign", "Pause what you are doing", "Name the feeling", "Choose something that helps, like a break or a drink", "Come back when you are ready"],
  hint: "You cannot choose a helpful thing until you have noticed and paused.",
  why: "Notice, pause, name, choose, return. Choosing what helps is yours to decide." },

/* ---- Science ---- */
{ id: "rl1", slug: "rot-lab", title: "How fruit rots", type: "order",
  intro: "Microbes break down fruit in stages. Put the stages in order from fresh to finished.",
  items: ["Fresh fruit with firm skin", "Brown soft patches appear", "Mould grows as microbes feed", "The fruit collapses into mush", "Only dark, crumbly compost is left"],
  hint: "Think about a banana left in a bag. What happens first, and what is the very last thing?",
  why: "Microbes feed on the fruit and break it down. At the end the nutrients go back into the soil." },
{ id: "rl2", slug: "rot-lab", title: "Faster or slower", type: "sort", buckets: ["Speeds rot up", "Slows rot down"],
  intro: "Microbes grow best in some conditions. Sort what makes food rot faster or slower.",
  items: [["A warm place", 0], ["In the fridge", 1], ["Damp and humid", 0], ["Dried out", 1], ["Cut open and uncovered", 0], ["Frozen", 1]],
  hint: "Microbes like warmth and water. What takes those away?",
  why: "Warmth, water and more surface for microbes to reach make food rot faster. Cold and dryness slow them." },

/* ---- Physical world ---- */
{ id: "rr1", slug: "river-road", title: "Source to sea", type: "order",
  intro: "A river changes along its journey. Put these parts in order from where it starts to where it ends.",
  items: ["A spring high in the hills", "A narrow, fast stream cutting a valley", "Wide bends across flat land", "A broad estuary reaching the sea"],
  hint: "Rivers start high and small, and finish low and wide.",
  why: "Rivers begin as small fast streams in high ground and widen and slow as they meet the sea." },
{ id: "rr2", slug: "river-road", title: "River words", type: "pairs",
  intro: "Match each river word to its meaning.",
  pairs: [["Source", "Where a river begins"], ["Tributary", "A smaller river that joins a bigger one"], ["Meander", "A bend in the river"], ["Estuary", "Where a river meets the sea"]],
  hint: "Source is the start. Think of a tree with branches for the one that joins.",
  why: "Source, tributary, meander and estuary are the words geographers use to describe a river's path." },

/* ---- PE ---- */
{ id: "tc1", slug: "training-camp", title: "Plan the session", type: "order",
  intro: "A good training session has a shape. Put the parts in order.",
  items: ["Warm up: light jogging and pulse raisers", "Mobilise: dynamic stretches and moving joints", "Main skills and games", "Cool down: slow walk and gentle stretches"],
  hint: "Start easy, build up, then slow down at the end.",
  why: "Warming up prepares muscles and cooling down helps the body settle. The hard work sits in the middle." },
{ id: "tc2", slug: "training-camp", title: "Before or after", type: "sort", buckets: ["Before the session", "After the session"],
  intro: "Some things belong at the start and some at the end. Sort these.",
  items: [["Easy jogging to raise the pulse", 0], ["Holding a stretch for 20 seconds", 1], ["Moving arm and leg circles", 0], ["Slow walk while your breathing settles", 1], ["Skipping and light hops", 0], ["Having a drink and a rest", 1]],
  hint: "Which ones get you ready to move, and which help you slow down?",
  why: "Warm ups raise the heart rate and loosen joints. Cool downs bring heart rate down." },

/* ---- Preparation for adulthood: brave steps ---- */
{ id: "bb1", slug: "the-brave-bit", title: "A ladder of small steps", type: "order",
  intro: "Big things feel easier in small steps. Here is a ladder for ordering a drink at a cafe. Put the steps in order, smallest first.",
  items: ["Look at the menu online", "Walk past the cafe", "Go in and stand by the door", "Ask for a drink with a friend beside you", "Order by yourself"],
  hint: "The smallest step asks the least of you. Each one is a little bigger.",
  why: "Breaking something big into small steps makes each one doable. You choose when to move up." },
{ id: "bb2", slug: "the-brave-bit", title: "What makes it doable", type: "sort", buckets: ["Helps", "Makes it harder"],
  intro: "Some things help a brave step feel possible. Sort these.",
  items: [["Going at your own pace", 0], ["Having a friend nearby", 0], ["Practising somewhere quiet first", 0], ["Trying to do it all at once", 1], ["Doing it when you are very tired", 1], ["Choosing the step yourself", 0]],
  hint: "Which of these give you more control, and which take it away?",
  why: "Control, support and practice help. Rushing and tiredness make anything harder." },

/* ---- PHSE ---- */
{ id: "lr1", slug: "late-night-radio", title: "What helps", type: "pairs",
  intro: "Different feelings need different help. Match each situation to something that could help.",
  pairs: [["Feeling wound up", "Slow breathing or a short walk"], ["Feeling lonely", "Message someone you trust"], ["Cannot get to sleep", "Dim the lights and put screens away"], ["Stuck on some work", "Take a break or ask for help"]],
  hint: "Which idea settles a busy body? Which one connects you with a person?",
  why: "There is no one fix. Matching the help to the feeling is a good skill to build." },
{ id: "lr2", slug: "late-night-radio", title: "Who to turn to", type: "sort", buckets: ["Good place to turn", "Not so helpful"],
  intro: "When something is on your mind, it helps to know where to go. Sort these.",
  items: [["A trusted adult at school", 0], ["A free helpline like Childline (0800 1111)", 0], ["Strangers' comments online", 1], ["Keeping it all to yourself", 1], ["A friend who listens", 0], ["A doctor or nurse", 0]],
  hint: "Which of these are people who know you or are trained to listen?",
  why: "Trusted people and trained helplines can really help. Strangers online do not know you or your situation." }
];

var MARKS = [["", "choose"], ["?", "question mark"], [",", "comma"], [".", "full stop"], ["'", "apostrophe"], ["!", "exclamation mark"], [";", "semicolon"], [":", "colon"]];
var QUOTES = {};
function byId(id){ for(var i = 0; i < CH.length; i++) if(CH[i].id === id) return CH[i]; return null }
function forAct(slug){ return CH.filter(function(c){ return c.slug === slug }) }

function pickOf(r, arr){ return arr[Math.floor(r() * arr.length)] }
function rint(r, a, b){ return a + Math.floor(r() * (b - a + 1)) }
function rnd(seed){ var s = (seed >>> 0) || 1; return function(){ s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 } }
function shr(arr, r){ var a = arr.slice(), i, j, t; for(i = a.length - 1; i > 0; i--){ j = Math.floor(r() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t } return a }
function shuf(n, seed){
  var a = [], i, s = seed || 7;
  for(i = 0; i < n; i++) a.push(i);
  function r(){ s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
  for(i = n - 1; i > 0; i--){ var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t }
  var same = true; for(i = 0; i < n; i++) if(a[i] !== i) same = false;
  if(same && n > 1){ a.push(a.shift()) }
  return a;
}
function hashId(id){ var h = 3, i; for(i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffff; return h }

/* ---------- challenge activities: a harder second tier, unlocked after the two warm ups ---------- */
function gridSvg(v, px, py){
  var s = '<svg viewBox="-8 -8 226 226" class="lgrid" role="img" aria-label="Grid with a drone' + (px != null ? " and a landing pad" : "") + '">', i;
  for(i = 0; i <= 10; i++){ s += '<line x1="' + (i * 20) + '" y1="0" x2="' + (i * 20) + '" y2="200"/><line x1="0" y1="' + (i * 20) + '" x2="200" y2="' + (i * 20) + '"/>' }
  if(px != null) s += '<rect x="' + (px * 20 - 8) + '" y="' + (200 - py * 20 - 8) + '" width="16" height="16" class="pad"/>';
  return s + '<circle cx="' + (v.x * 20) + '" cy="' + (200 - v.y * 20) + '" r="7" class="drone"/></svg>';
}
var CH2 = [
/* Maths */
{ id: "tt3", slug: "tiny-town", tier: 2, title: "Plan the playground", type: "dial",
  intro: "The real playground is 40 m wide and 25 m deep. On the plan, 1 cm stands for 5 m. Set both sides of the playground on your plan.",
  sliders: [{ k: "w", l: "Width on the plan", min: 1, max: 14, step: 1, v: 3, u: " cm" }, { k: "d", l: "Depth on the plan", min: 1, max: 14, step: 1, v: 3, u: " cm" }],
  read: function(v){ return '<div class="lrect"><i style="width:' + (v.w * 14) + 'px;height:' + (v.d * 14) + 'px"></i></div><p>The plan shows <b>' + v.w + ' cm by ' + v.d + ' cm</b>. That stands for <b>' + (v.w * 5) + ' m by ' + (v.d * 5) + ' m</b>.</p>' },
  ok: function(v){ return v.w === 8 && v.d === 5 }, sol: { w: 8, d: 5 },
  hint: "Divide each real length by 5 m. How many 5s fit into 40, and into 25?",
  why: "40 divided by 5 is 8 and 25 divided by 5 is 5. A scale applies to every length, not just one." },
{ id: "tt4", slug: "tiny-town", tier: 2, title: "A long walk on a small map", type: "dial",
  intro: "The town trail is 3.5 km long. On the plan, 1 cm stands for 500 m. How long is the trail on the plan?",
  sliders: [{ k: "cm", l: "Trail on the plan", min: 1, max: 20, step: 1, v: 4, u: " cm" }],
  read: function(v){ return '<div class="lbar"><i style="width:' + (v.cm / 20 * 100) + '%"></i></div><p>On the plan: <b>' + v.cm + ' cm</b>. That stands for <b>' + (v.cm * 0.5) + ' km</b> in real life.</p>' },
  ok: function(v){ return v.cm === 7 }, sol: { cm: 7 },
  hint: "500 m is half a kilometre, so every centimetre is 0.5 km. How many halves make 3.5?",
  why: "3.5 km is 3500 m, and 3500 divided by 500 is 7. Change the units first and the sum is easy." },
{ id: "na3", slug: "number-allotment", tier: 2, title: "Three crops, one plot", type: "paint", cells: 36, perRow: 6,
  intro: "The big plot has 36 beds. Plant one third with tomatoes, one quarter with beans and one sixth with herbs.",
  cols: [{ n: "Tomatoes", c: "#e0533f", k: 12 }, { n: "Beans", c: "#7bc96f", k: 9 }, { n: "Herbs", c: "#8e7be0", k: 6 }],
  hint: "Divide 36 by 3, by 4 and by 6 to find each share.",
  why: "36 divided by 3 is 12, by 4 is 9 and by 6 is 6. Together that is 27 beds, so 9 are left free." },
{ id: "na4", slug: "number-allotment", tier: 2, title: "Triangular numbers", type: "fix",
  intro: "Triangular numbers build up in rows of dots. Find the pattern and complete it.",
  parts: ["The triangular numbers go 1, 3, 6, 10, ", { a: "15", o: ["13", "14", "15", "16"] }, ", 21, ", { a: "28", o: ["26", "27", "28", "30"] }, ". Each time you add one more than before, so after 28 you add ", { a: "8", o: ["6", "7", "8", "9"] }, " to reach 36."],
  hint: "The gaps are 2, 3, 4, 5 and so on. What is the gap after 10?",
  why: "The gaps grow by one each time: +2, +3, +4, +5, +6, +7, +8. That is how each row of dots adds on." },
{ id: "dd3", slug: "drone-dash", tier: 2, title: "Two legs, one landing", type: "dial",
  intro: "The drone starts at (0, 0). It flies 3 across and 5 up, then 2 across and 1 down. Set the drone where it ends up.",
  sliders: [{ k: "x", l: "Across (x)", min: 0, max: 10, step: 1, v: 0, u: "" }, { k: "y", l: "Up (y)", min: 0, max: 10, step: 1, v: 0, u: "" }],
  read: function(v){ return gridSvg(v) + '<p>Drone at <b>(' + v.x + ', ' + v.y + ')</b></p>' },
  ok: function(v){ return v.x === 5 && v.y === 4 }, sol: { x: 5, y: 4 },
  hint: "Add the across moves together, then work out the up moves. Down takes away.",
  why: "Across: 3 + 2 is 5. Up: 5 up and 1 down is 4. Each direction can be worked out on its own." },
{ id: "dd4", slug: "drone-dash", tier: 2, title: "Battery levels", type: "order",
  intro: "Four drones show their battery as a decimal. Order them from the lowest charge to the highest.",
  items: ["0.09", "0.405", "0.45", "0.5", "0.6"],
  hint: "Compare tenths first. Then compare hundredths when the tenths match.",
  why: "Line the decimals up by place value. 0.405 is less than 0.45 because 0 hundredths is less than 5 hundredths." },
/* Digital media */
{ id: "im3", slug: "inside-the-machine", tier: 2, title: "Loading a web page", type: "order",
  intro: "You type a web address and a page appears. Put the steps in order.",
  items: ["You type the address into the browser", "The browser asks a server for the page", "The server sends the page files back", "The browser puts the files together and draws the page"],
  hint: "A request goes out first. The page can only be drawn after the files arrive.",
  why: "Browsers send a request, servers answer, and the browser builds what you see. That all happens in a blink." },
{ id: "im4", slug: "inside-the-machine", tier: 2, title: "File types", type: "pairs",
  intro: "File names end in a short code that says what is inside. Match each ending to its file.",
  pairs: [[".jpg", "A photo"], [".mp3", "A sound or song"], [".docx", "A text document"], [".mp4", "A video"]],
  hint: "Think about which one you would play, which you would read and which you would look at.",
  why: "The ending tells your computer which program should open the file." },
/* Preparation for adulthood: money */
{ id: "pb3", slug: "party-budget", tier: 2, title: "Saving for tickets", type: "dial",
  intro: "Tickets cost " + PD + "90. You can save " + PD + "12 a week. Set how many weeks you need to save, so you have enough but do not wait longer than you must.",
  sliders: [{ k: "w", l: "Weeks of saving", min: 1, max: 15, step: 1, v: 4, u: " weeks" }],
  read: function(v){ var t = v.w * 12; return '<div class="lbar ' + (t >= 90 ? "" : "over") + '"><i style="width:' + Math.min(100, t / 90 * 100) + '%"></i></div><p>Saved after ' + v.w + ' weeks: <b>' + PD + t + '</b>. ' + (t >= 90 ? "Enough for the tickets." : "Still " + PD + (90 - t) + " short.") + '</p>' },
  ok: function(v){ return v.w === 8 }, sol: { w: 8 },
  hint: "90 divided by 12 is a bit more than 7. You cannot save part of a week.",
  why: "7 weeks gives " + PD + "84, which is not enough. 8 weeks gives " + PD + "96, so round up to the next whole week." },
{ id: "pb4", slug: "party-budget", tier: 2, title: "Repeats or one off", type: "sort", buckets: ["Repeats every month", "One off cost"],
  intro: "Some costs come back again and again and some happen once. Sort these.",
  items: [["Phone contract", 0], ["A new jacket", 1], ["Bus pass", 0], ["A birthday present", 1], ["A streaming subscription", 0], ["Fixing a bike tyre", 1]],
  hint: "Would you pay it again next month without choosing to buy something new?",
  why: "Knowing which costs repeat helps you plan. They come out of your money before the one offs." },
/* English */
{ id: "ob3", slug: "objection", tier: 2, title: "Answer the other side", type: "order",
  intro: "A strong argument deals with the other view. Put this paragraph in order.",
  items: ["Some people argue homework should be banned.", "They say students need time to rest.", "However, short homework helps memory.", "So a little homework, set sensibly, is still worth doing."],
  hint: "Start with the other side. Use however to turn it around. Finish with your own point.",
  why: "Say what the other side thinks, show you understand it, then explain why you still disagree." },
{ id: "ob4", slug: "objection", tier: 2, title: "Strong or weak evidence", type: "sort", buckets: ["Strong evidence", "Weak evidence"],
  intro: "Not all evidence is equally convincing. Sort these.",
  items: [["Official figures from the council", 0], ["My cousin said so", 1], ["A survey of 200 students", 0], ["Everyone knows it", 1], ["A report from a science museum", 0], ["I saw it on a random post", 1]],
  hint: "Who counted it, and could somebody check it?",
  why: "Strong evidence comes from careful counting or trusted sources. Weak evidence is just somebody saying so." },
{ id: "pe3", slug: "punctuation-escape", tier: 2, title: "Whose is it", type: "fix",
  intro: "An apostrophe can show who something belongs to. Pick the right form for each gap.",
  parts: ["The ", { a: "dog's", o: ["dogs", "dog's", "dogs'"] }, " bowl is empty (one dog). The ", { a: "players'", o: ["players", "player's", "players'"] }, " changing room is down the hall (lots of players). ", { a: "We're", o: ["Were", "We're", "Where"] }, " late for the match."],
  hint: "One owner means apostrophe then s. Many owners that end in s means the apostrophe goes after the s.",
  why: "Dog's is one dog. Players' is more than one player. We're is we are." },
{ id: "pe4", slug: "punctuation-escape", tier: 2, title: "Colons, semicolons and commas", type: "fix",
  intro: "Three marks, three jobs. Pick the right mark for each gap.",
  marks: true,
  parts: ["I packed three things", { a: ":", o: "m" }, " boots, a bottle and a towel.<br>It was raining", { a: ";", o: "m" }, " we played anyway.<br>Although it was late", { a: ",", o: "m" }, " we kept going."],
  hint: "A colon introduces a list. A semicolon joins two sentences that belong together. A comma follows an opening phrase.",
  why: "A colon opens a list, a semicolon links two related sentences and a comma follows a starter phrase." },
{ id: "bi3", slug: "break-it-up", tier: 2, title: "The bake sale", type: "break",
  intro: "Tap between sentences to start a new paragraph when the time or topic shifts. There are two changes.",
  sents: ["Last Friday we held a bake sale for charity.", "We set up tables in the hall before school.", "Everyone brought something to sell.", "At ten o'clock the first customers arrived.", "By lunchtime nearly every cake had gone.", "Afterwards we counted the money.", "We raised 142 pounds in total.", "The head teacher thanked everyone in assembly."],
  brk: [3, 5],
  hint: "Getting ready, the sale itself, and the result. Where does each part end?",
  why: "A new paragraph marks a change of time or topic: setting up, the sale, then the result." },
{ id: "bi4", slug: "break-it-up", tier: 2, title: "Who is speaking", type: "break",
  intro: "In a story, every time someone new speaks, a new paragraph starts. Tap where each new speaker begins.",
  sents: ["\"Are you coming?\" asked Sam.", "\"In a minute,\" said Jo.", "\"We will miss the bus,\" said Sam.", "\"Then we run,\" Jo laughed."],
  brk: [1, 2, 3],
  hint: "Each line is a different person talking, so each one starts fresh.",
  why: "A new speaker means a new line. It helps the reader follow who is talking without extra words." },
/* Aesthetic and creative */
{ id: "gn3", slug: "gallery-night", tier: 2, title: "Light to dark", type: "order",
  intro: "A shaded wall goes from the lightest tone to the darkest. Put the swatches in that order.",
  items: [pw("#fbfbf4", "White"), pw("#f4e58a", "Pale yellow"), pw("#e58b2c", "Orange"), pw("#7b4a22", "Brown"), pw("#14120e", "Black")],
  hint: "Which is nearest to white, and which is nearest to black?",
  why: "Tone is how light or dark a colour is. Artists use tone to make shapes look solid." },
{ id: "gn4", slug: "gallery-night", tier: 2, title: "Warm and cool", type: "sort", buckets: ["Warm colour", "Cool colour"],
  intro: "Some colours feel warm and some feel cool. Sort these swatches.",
  items: [[pw("#d9453d", "Red"), 0], [pw("#3f78d6", "Blue"), 1], [pw("#f08a2c", "Orange"), 0], [pw("#4fae5c", "Green"), 1], [pw("#f1d04a", "Yellow"), 0], [pw("#7d55c7", "Purple"), 1]],
  hint: "Think of fire and sunshine, then of water and ice.",
  why: "Warm colours seem to come forward and cool colours seem to sit back. Mixing both makes a picture feel balanced." },
/* Human and social */
{ id: "wr3", slug: "warning-room", tier: 2, title: "Be a good friend", type: "sort", buckets: ["Kind and helpful", "Not so helpful"],
  intro: "A friend seems upset. Sort the things you could do.",
  items: [["Ask quietly if they want company", 0], ["Tell them to cheer up", 1], ["Give them space and say you are around", 0], ["Laugh it off", 1], ["Offer a drink or a walk", 0], ["Tell other people about it", 1]],
  hint: "Which ones let them choose, and which ones push or make it worse?",
  why: "Kind responses give the other person choice and keep things private. Pushing or telling others can hurt." },
{ id: "wr4", slug: "warning-room", tier: 2, title: "Sign and response", type: "pairs",
  intro: "Match what you notice with a kind response.",
  pairs: [["Quiet and looking away", "Check in gently and offer a choice"], ["Snapping at everyone", "Give a little space"], ["Worried about a test", "Break the work into small steps"], ["Excited and very loud", "Share the good news with them"]],
  hint: "A sign is a clue about a need. What would meet that need?",
  why: "Noticing the sign and matching the response is how we look after each other." },
/* Science */
{ id: "rl3", slug: "rot-lab", tier: 2, title: "Meet the microbes", type: "pairs",
  intro: "Match each word to its meaning.",
  pairs: [["Bacteria", "Tiny living things found almost everywhere"], ["Mould", "Fuzzy patches that grow on food"], ["Decomposer", "Something that breaks dead material down"], ["Compost", "Rotted material that feeds new plants"]],
  hint: "Which word is the most general, and which one describes what is left at the end?",
  why: "Decomposers break dead matter into nutrients, and compost returns those nutrients to the soil." },
{ id: "rl4", slug: "rot-lab", tier: 2, title: "A food chain", type: "order",
  intro: "Energy moves along a food chain. Put the steps in order, starting from the sun.",
  items: ["The sun's energy is captured by grass", "A rabbit eats the grass", "A fox eats the rabbit", "Microbes break the fox down when it dies"],
  hint: "Producers come first. Decomposers come at the very end.",
  why: "Plants capture the energy, animals pass it along and decomposers return the nutrients to the soil." },
/* Physical world */
{ id: "rr3", slug: "river-road", tier: 2, title: "Wearing away or dropping off", type: "sort", buckets: ["Erosion, wearing away", "Deposition, dropping off"],
  intro: "A river both wears things away and drops things off. Sort these.",
  items: [["Cutting a steep valley in the hills", 0], ["Leaving silt on the flood plain", 1], ["Wearing away the outside of a bend", 0], ["Building up a delta at the sea", 1], ["A waterfall cutting back into the rock", 0], ["A sandbar on the inside of a bend", 1]],
  hint: "Which ones take material from the land, and which add material to it?",
  why: "Erosion removes material. Deposition lays material down where the river slows." },
{ id: "rr4", slug: "river-road", tier: 2, title: "Read the map", type: "pairs",
  intro: "Maps use symbols and lines. Match each one to what it shows.",
  pairs: [["A blue line", "A river"], ["Contour lines close together", "A steep slope"], ["Contour lines far apart", "Gentle, flat ground"], ["A green area", "Woodland or a park"]],
  hint: "Close together means the height changes fast. Far apart means it barely changes.",
  why: "Contour lines join places at the same height. Squeezed lines mean steep, wide lines mean gentle." },
/* PE */
{ id: "tc3", slug: "training-camp", tier: 2, title: "Plan a full hour", type: "dial",
  intro: "You have 60 minutes. Warm up needs at least 10, cool down at least 5 and the main work at least 30. Use all 60 minutes.",
  sliders: [{ k: "w", l: "Warm up", min: 0, max: 40, step: 1, v: 5, u: " min" }, { k: "m", l: "Main work", min: 0, max: 60, step: 1, v: 20, u: " min" }, { k: "c", l: "Cool down", min: 0, max: 30, step: 1, v: 5, u: " min" }],
  read: function(v){ var t = v.w + v.m + v.c; return '<div class="lmix"><i style="flex:' + v.w + ';background:#e8b13c"></i><i style="flex:' + v.m + ';background:#e0533f"></i><i style="flex:' + v.c + ';background:#4a90d9"></i></div><p>Total: <b>' + t + ' minutes</b> of 60. ' + (t === 60 ? "That fills the hour." : (t > 60 ? (t - 60) + " too many." : (60 - t) + " left to plan.")) + '</p>' },
  ok: function(v){ return v.w + v.m + v.c === 60 && v.w >= 10 && v.c >= 5 && v.m >= 30 },
  sol: { w: 12, m: 40, c: 8 },
  hint: "Cover the three minimums first (10 + 30 + 5). Then share out what is left.",
  why: "Good plans protect the warm up and cool down, then put the rest where it matters." },
{ id: "tc4", slug: "training-camp", tier: 2, title: "Muscle match", type: "pairs",
  intro: "Different exercises work different parts of the body. Match them up.",
  pairs: [["Squats", "Strong legs"], ["Press ups", "Arms and chest"], ["Plank", "Core, the middle of the body"], ["Jogging", "Heart and lungs"]],
  hint: "Which part of your body feels it most during each one?",
  why: "A good plan mixes exercises, so legs, arms, core and heart and lungs all get a turn." },
/* Brave bit */
{ id: "bb3", slug: "the-brave-bit", tier: 2, title: "Speaking up", type: "order",
  intro: "Speaking up in a group can feel big. Here is a ladder of small steps. Put them in order, smallest first.",
  items: ["Think about what you would like to say", "Say it to one person you trust", "Say it to a small group", "Say it to the whole class"],
  hint: "Start with the step that asks the least of you.",
  why: "You decide when to climb a step. Small steps build confidence without rushing." },
{ id: "bb4", slug: "the-brave-bit", tier: 2, title: "Kind self talk", type: "sort", buckets: ["Kind to yourself", "Not so kind"],
  intro: "The things we say in our heads matter. Sort these.",
  items: [["I am trying, and that counts", 0], ["I always get it wrong", 1], ["I can do a small bit today", 0], ["Everyone is better than me", 1], ["I did it before, so I can try again", 0], ["I should just give up", 1]],
  hint: "Which ones would you say to a friend who was having a go?",
  why: "Kind self talk keeps you moving. It does not mean pretending, only being fair to yourself." },
/* PHSE */
{ id: "lr3", slug: "late-night-radio", tier: 2, title: "Winding down", type: "order",
  intro: "A good wind down helps you sleep. Put the steps in a sensible order.",
  items: ["Dim the lights", "Put screens away", "Do something calm, like reading or music", "Get into bed", "Slow breathing until sleepy"],
  hint: "Start with the environment, then your activity, then your body.",
  why: "Lowering light and screens first tells your body it is nearly time to sleep." },
{ id: "lr4", slug: "late-night-radio", tier: 2, title: "What your body says", type: "pairs",
  intro: "Feelings show up in the body. Match each body clue to what it might mean.",
  pairs: [["Butterflies in your tummy", "You may be nervous or excited"], ["Tight shoulders", "You may be stressed"], ["A heavy, tired body", "You may need rest"], ["A racing heart", "Your body is getting ready to act"]],
  hint: "Think of times you felt each one. What was going on?",
  why: "Body clues are messages. Noticing them helps you choose what to do next." }
];
CH.push.apply(CH, CH2);

/* ---------- more to see on a second go: bigger pools and changing numbers ---------- */
function setx(id, k, v){ var c = byId(id); if(c) c[k] = v }
setx("pb2", "extra", [["A way to tell guests the time", 0], ["Party hats", 1]]);
setx("ob2", "extra", [["The train takes 12 minutes.", 0], ["That film was rubbish.", 1]]);
setx("wr1", "extra", [["Jaw clenched, breathing fast", 0], ["Laughing easily", 1]]);
setx("rl2", "extra", [["Broken, bruised skin", 0], ["Sealed in a clean airtight tub", 1]]);
setx("tc2", "extra", [["High knees on the spot", 0], ["Gentle shoulder rolls to finish", 1]]);
setx("bb2", "extra", [["Taking a break when you need one", 0], ["Comparing yourself with others", 1]]);
setx("lr2", "extra", [["A parent or carer", 0], ["Arguing in an online chat at midnight", 1]]);
setx("pb4", "extra", [["A gym membership", 0], ["A new pair of boots", 1]]);
setx("ob4", "extra", [["Results from a school census", 0], ["A rumour from the playground", 1]]);
setx("wr3", "extra", [["Sit with them without pushing", 0], ["Make a joke at their expense", 1]]);
setx("rr3", "extra", [["Carving a gorge", 0], ["Spreading mud on a floodplain after floods", 1]]);
setx("bb4", "extra", [["I can ask for help", 0], ["There is no point trying", 1]]);
setx("im1", "extra", [["Keyboard", "Lets you type things in"], ["Speaker", "Lets you hear sound out"]]);
setx("gn2", "extra", [["Perspective", "Making things look near or far"], ["Sketch", "A quick rough drawing"]]);
setx("rr2", "extra", [["Floodplain", "Flat land beside a river that floods"], ["Waterfall", "Where water drops over a step of rock"]]);
setx("lr1", "extra", [["Worried about tomorrow", "Write it down and set it aside"], ["Feeling restless", "Stretch or move around for a bit"]]);
setx("im4", "extra", [[".png", "A picture with clear edges"], [".pdf", "A document that keeps its layout"]]);
setx("rl3", "extra", [["Nutrient", "Something living things need to grow"], ["Spore", "A tiny seed like cell from a mould"]]);
setx("rr4", "extra", [["A black dashed line", "A path or boundary"], ["A blue area", "A lake or the sea"]]);
setx("tc4", "extra", [["Lunges", "Strong legs and balance"], ["Cycling", "Heart, lungs and legs"]]);
setx("wr4", "extra", [["Pacing up and down", "Offer a walk and a quiet space"], ["Very quiet at lunch", "Ask if they want company"]]);
setx("lr4", "extra", [["A dry mouth", "You may be nervous"], ["Wide awake at night", "Your mind may be busy"]]);

setx("tt1", "vary", function(r){
  var L = pickOf(r, [60, 80, 100, 140, 160, 180]), w = L / 20;
  return { intro: "The real road through Tiny Town is " + L + " m long. On the plan, 1 cm stands for 20 m. Slide until the road on your plan is the right length.",
    ok: function(v){ return v.cm === w }, sol: { cm: w },
    hint: "Real length divided by the scale. How many lots of 20 m fit into " + L + " m?",
    why: L + " divided by 20 is " + w + ", so the road is " + w + " cm on the plan. Dividing by the scale shrinks real lengths." };
});
setx("tt2", "vary", function(r){
  var rt = pickOf(r, [[2, 3], [1, 4], [3, 2], [1, 2], [2, 1], [3, 1]]), a = rt[0], b = rt[1], k = rint(r, 2, 4), T = (a + b) * k;
  return { intro: "Tiny Town roofs need " + T + " litres of paint. The mix is " + a + " parts red to " + b + " parts white. Set the litres so the mix is right and the total is " + T + ".",
    sliders: [{ k: "r", l: "Red", min: 0, max: T, step: 1, v: 1, u: " litres" }, { k: "w", l: "White", min: 0, max: T, step: 1, v: 1, u: " litres" }],
    read: function(v){ var t = v.r + v.w; return '<div class="lmix"><i style="flex:' + v.r + ';background:#d9544d"></i><i style="flex:' + v.w + ';background:#f1ece2"></i></div><p>Total: <b>' + t + ' litres</b>. Red to white is <b>' + v.r + ' : ' + v.w + '</b>.</p>' },
    ok: function(v){ return v.r + v.w === T && v.r * b === v.w * a }, sol: { r: a * k, w: b * k },
    hint: a + " + " + b + " is " + (a + b) + " parts. Each part is " + T + " divided by " + (a + b) + " litres.",
    why: (a + b) + " parts make " + T + " litres, so one part is " + k + " litres. Red is " + a + " parts (" + (a * k) + " litres) and white is " + b + " parts (" + (b * k) + " litres)." };
});
setx("tt3", "vary", function(r){
  var W = 5 * rint(r, 4, 12), D = 5 * rint(r, 3, 8), w = W / 5, d = D / 5;
  return { intro: "The real playground is " + W + " m wide and " + D + " m deep. On the plan, 1 cm stands for 5 m. Set both sides of the playground on your plan.",
    ok: function(v){ return v.w === w && v.d === d }, sol: { w: w, d: d },
    hint: "Divide each real length by 5 m. How many 5s fit into " + W + ", and into " + D + "?",
    why: W + " divided by 5 is " + w + " and " + D + " divided by 5 is " + d + "." };
});
setx("tt4", "vary", function(r){
  var km = pickOf(r, [2, 2.5, 3, 3.5, 4, 4.5, 5]), cm = km * 2;
  return { intro: "The town trail is " + km + " km long. On the plan, 1 cm stands for 500 m. How long is the trail on the plan?",
    ok: function(v){ return v.cm === cm }, sol: { cm: cm },
    hint: "500 m is half a kilometre, so every centimetre is 0.5 km. How many halves make " + km + "?",
    why: km + " km is " + (km * 1000) + " m, and " + (km * 1000) + " divided by 500 is " + cm + "." };
});
setx("na1", "vary", function(r){
  var v = pickOf(r, [
    { cells: 24, perRow: 6, a: ["carrots", "one third", 8], b: ["peas", "one half", 12] },
    { cells: 30, perRow: 6, a: ["carrots", "one fifth", 6], b: ["peas", "two fifths", 12] },
    { cells: 36, perRow: 6, a: ["carrots", "one sixth", 6], b: ["peas", "one third", 12] },
    { cells: 40, perRow: 8, a: ["carrots", "one quarter", 10], b: ["peas", "three eighths", 15] }
  ]);
  return { cells: v.cells, perRow: v.perRow,
    intro: "The allotment has " + v.cells + " beds. Pick a plant, then tap beds to plant it. Plant " + v.a[1] + " with carrots and " + v.b[1] + " with peas.",
    cols: [{ n: "Carrots", c: "#e8893a", k: v.a[2] }, { n: "Peas", c: "#6fcf7d", k: v.b[2] }],
    hint: "Divide " + v.cells + " by the bottom number of each fraction. Then multiply by the top number.",
    why: v.a[1] + " of " + v.cells + " is " + v.a[2] + " and " + v.b[1] + " of " + v.cells + " is " + v.b[2] + "." };
});
setx("na2", "vary", function(r){
  var alt = pickOf(r, [
    { parts: ["Square numbers go 4, 9, 16, ", { a: "25", o: ["20", "25", "30", "36"] }, ", 36, ", { a: "49", o: ["42", "45", "49", "56"] }, ", 64. The 8th square number is 8 x ", { a: "8", o: ["2", "8", "16", "64"] }, "."] },
    { parts: ["The square numbers are 1, 4, 9, ", { a: "16", o: ["12", "15", "16", "18"] }, ", 25, ", { a: "36", o: ["30", "35", "36", "49"] }, ". The 9th square number is 9 x ", { a: "9", o: ["3", "9", "18", "81"] }, "."] }
  ]);
  return { parts: alt.parts };
});
setx("dd1", "vary", function(r){
  var px = rint(r, 2, 9), py = rint(r, 1, 8);
  return { intro: "Your drone starts at (0, 0). The landing pad is at (" + px + ", " + py + "). Across first, then up. Set the drone's position and land on the pad.",
    read: function(v){ return gridSvg(v, px, py) + '<p>Drone at <b>(' + v.x + ', ' + v.y + ')</b></p>' },
    ok: function(v){ return v.x === px && v.y === py }, sol: { x: px, y: py },
    hint: "The first number is across, the second is up. The pad is " + px + " across and " + py + " up.",
    why: "Coordinates are written (across, up). The pad at (" + px + ", " + py + ") is " + px + " along and " + py + " up." };
});
setx("dd3", "vary", function(r){
  var a = rint(r, 1, 5), b = rint(r, 2, 6), c = rint(r, 1, 4), d = rint(r, 1, Math.min(3, b)), ex = a + c, ey = b - d;
  return { intro: "The drone starts at (0, 0). It flies " + a + " across and " + b + " up, then " + c + " across and " + d + " down. Set the drone where it ends up.",
    ok: function(v){ return v.x === ex && v.y === ey }, sol: { x: ex, y: ey },
    why: "Across: " + a + " + " + c + " is " + ex + ". Up: " + b + " up and " + d + " down is " + ey + "." };
});
setx("pb1", "vary", function(r){
  var T = pickOf(r, [[60, 25, 10, 10], [80, 30, 15, 15], [100, 40, 20, 20]]);
  return { intro: "You have " + PD + T[0] + " for the party. Food needs at least " + PD + T[1] + ", and music and decorations each need at least " + PD + T[2] + ". Spend all of it, and not a penny more.",
    sliders: [{ k: "f", l: "Food", min: 0, max: Math.round(T[0] * 0.65), step: 1, v: 10, u: "" }, { k: "m", l: "Music", min: 0, max: Math.round(T[0] * 0.65), step: 1, v: 10, u: "" }, { k: "d", l: "Decorations", min: 0, max: Math.round(T[0] * 0.65), step: 1, v: 10, u: "" }],
    read: function(v){ var t = v.f + v.m + v.d, left = T[0] - t; return '<div class="lbar ' + (left < 0 ? "over" : "") + '"><i style="width:' + Math.min(100, t / T[0] * 100) + '%"></i></div><p>Spent <b>' + PD + t + '</b> of ' + PD + T[0] + '. ' + (left < 0 ? 'That is ' + PD + (-left) + ' over.' : (left === 0 ? 'Nothing left over.' : 'Left: <b>' + PD + left + '</b>.')) + '</p>' },
    ok: function(v){ return v.f + v.m + v.d === T[0] && v.f >= T[1] && v.m >= T[2] && v.d >= T[2] },
    sol: { f: T[1] + 5, m: T[0] - T[1] - 5 - T[2], d: T[2] },
    hint: "Spend the three minimums first (" + T[1] + " + " + T[2] + " + " + T[2] + "). How much is left to share out?" };
});
setx("pb3", "vary", function(r){
  var earn = pickOf(r, [10, 12, 15, 20]), goal = pickOf(r, [60, 75, 90, 110, 125]), w = Math.ceil(goal / earn);
  return { intro: "Tickets cost " + PD + goal + ". You can save " + PD + earn + " a week. Set how many weeks you need to save, so you have enough but do not wait longer than you must.",
    sliders: [{ k: "w", l: "Weeks of saving", min: 1, max: 15, step: 1, v: 4, u: " weeks" }],
    read: function(v){ var t = v.w * earn; return '<div class="lbar ' + (t >= goal ? "" : "over") + '"><i style="width:' + Math.min(100, t / goal * 100) + '%"></i></div><p>Saved after ' + v.w + ' weeks: <b>' + PD + t + '</b>. ' + (t >= goal ? "Enough for the tickets." : "Still " + PD + (goal - t) + " short.") + '</p>' },
    ok: function(v){ return v.w === w }, sol: { w: w },
    hint: goal + " divided by " + earn + " might not be a whole number. You cannot save part of a week.",
    why: "Divide the cost by the weekly saving, then round up to the next whole week: " + w + " weeks." };
});
setx("tc3", "vary", function(r){
  var T = pickOf(r, [[45, 8, 22, 5], [60, 10, 30, 5], [90, 15, 50, 10]]);
  return { intro: "You have " + T[0] + " minutes. Warm up needs at least " + T[1] + ", cool down at least " + T[3] + " and the main work at least " + T[2] + ". Use all " + T[0] + " minutes.",
    sliders: [{ k: "w", l: "Warm up", min: 0, max: 40, step: 1, v: 5, u: " min" }, { k: "m", l: "Main work", min: 0, max: 70, step: 1, v: 20, u: " min" }, { k: "c", l: "Cool down", min: 0, max: 30, step: 1, v: 5, u: " min" }],
    read: function(v){ var t = v.w + v.m + v.c; return '<div class="lmix"><i style="flex:' + v.w + ';background:#e8b13c"></i><i style="flex:' + v.m + ';background:#e0533f"></i><i style="flex:' + v.c + ';background:#4a90d9"></i></div><p>Total: <b>' + t + ' minutes</b> of ' + T[0] + '. ' + (t === T[0] ? "That fills the session." : (t > T[0] ? (t - T[0]) + " too many." : (T[0] - t) + " left to plan.")) + '</p>' },
    ok: function(v){ return v.w + v.m + v.c === T[0] && v.w >= T[1] && v.c >= T[3] && v.m >= T[2] },
    sol: { w: T[1] + 2, m: T[0] - T[1] - 2 - T[3], c: T[3] },
    hint: "Cover the three minimums first (" + T[1] + " + " + T[2] + " + " + T[3] + "). Then share out what is left." };
});
setx("pe1", "vary", function(r){
  var alt = pickOf(r, [
    ["Is the bus here yet", "?", "<br>We need a ball", ",", " cones", ",", " and bibs", ".", "<br>The coach", "'", "s whistle is lost", ".", "<br>Quick", "!"],
    ["Who has the keys", "?", "<br>Bring a coat", ",", " gloves", ",", " and a scarf", ".", "<br>The teacher", "'", "s bag is heavy", ".", "<br>Careful", "!"]
  ]), parts = [], i, ans = ["?", ",", ",", ".", "'", ".", "!"], gi = 0;
  for(i = 0; i < alt.length; i++){ var p = alt[i]; if(p === "?" || p === "," || p === "." || p === "'" || p === "!"){ parts.push({ a: ans[gi++], o: "m" }) } else parts.push(p) }
  return { parts: parts };
});
setx("pe2", "vary", function(r){
  var alt = pickOf(r, [
    { parts: [{ a: "It's", o: ["Its", "It's"] }, " a lovely day. The cat licked ", { a: "its", o: ["its", "it's"] }, " paw. ", { a: "Their", o: ["There", "Their", "They're"] }, " bags are over ", { a: "there", o: ["there", "their", "they're"] }, ", and ", { a: "they're", o: ["there", "their", "they're"] }, " ready."] },
    { parts: ["I think ", { a: "it's", o: ["its", "it's"] }, " time to go. The team lost ", { a: "its", o: ["its", "it's"] }, " first match. ", { a: "They're", o: ["There", "Their", "They're"] }, " bringing ", { a: "their", o: ["there", "their", "they're"] }, " own boots over ", { a: "there", o: ["there", "their", "they're"] }, "."] }
  ]);
  return { parts: alt.parts };
});


/* ---------- a second version for the ordering, paragraph, gap and paint ones ---------- */
function sw(c, n){ return '<span class="lsw" style="background:' + c + '" title="' + n + '"></span>' + n }
setx("gn4", "extra", [[sw("#e58b2c", "Gold"), 0], [sw("#2a9d8f", "Teal"), 1]]);
setx("dd2", "alt", [{ intro: "The drone is mapping a mine shaft. Heights are measured from the ground, so below it counts as negative. Put these heights in order, lowest at the top.", items: ["-20 m", "-7 m", "-1 m", "0 m", "12 m"], hint: "The further below zero, the lower the height. -20 is lower than -7.", why: "The further a number is to the left on a number line, the lower it is. -20 is lower than -7, and both are below 0." }]);
setx("im2", "alt", [{ intro: "You click the mouse and a menu opens. Put the steps in the order they happen.", items: ["You click the mouse", "The mouse sends a signal", "The processor works out where you clicked", "The screen draws the menu"], hint: "Input first, then the thinking, then output at the end.", why: "Input, process, output again. The mouse is the input and the screen is the output." }]);
setx("ob1", "alt", [{ intro: "A strong paragraph makes a claim, backs it up, explains it and links back. Put these sentences in order.", items: ["Our class should have a quiet reading time every day.", "In our survey, 20 of 28 students said they read less than they would like.", "That shows many of us want more time with books.", "So a daily reading time would help us enjoy reading more."], hint: "Start with what you think. End by bringing it back to that point.", why: "Claim, evidence, explanation, link. The numbers are what make the claim strong." }]);
setx("gn1", "alt", [{ intro: "The gallery wants the rainbow the other way round, right to left. Put the colours in order, starting with violet.", items: [sw("#7d55c7", "Violet"), sw("#3f78d6", "Blue"), sw("#4fae5c", "Green"), sw("#f1d04a", "Yellow"), sw("#f08a2c", "Orange"), sw("#d9453d", "Red")], hint: "It is the rainbow backwards. Violet is first, red is last.", why: "The spectrum runs red to violet. Reading it backwards starts at violet and ends at red." }]);
setx("wr2", "alt", [{ intro: "When a worry builds up, a plan helps. Put these steps in the order that works best.", items: ["Notice your body tensing", "Take three slow breaths", "Say what the worry is", "Pick one small thing you can do about it", "Do it, or ask someone to help"], hint: "Notice and calm down before you decide what to do.", why: "Notice, breathe, name it, choose a small step, act. Asking for help is a good choice." }]);
setx("rl1", "alt", [{ intro: "Bread left out goes mouldy in stages. Put the stages in order from fresh to finished.", items: ["Soft fresh bread", "The bread dries and hardens", "Fuzzy mould spots appear", "The mould spreads across the slice", "The slice crumbles and rots away"], hint: "Think about the last time you found old bread. What did you see first?", why: "Microbes need food and damp air. Over time they break the bread down." }]);
setx("rr1", "alt", [{ intro: "Water travels a long way. Put these parts of a river system in order from the rain to the sea.", items: ["Rain falls on high ground", "A small stream runs downhill", "Streams join into a wide river", "The river reaches the sea"], hint: "Water starts high and ends at the sea.", why: "Rain feeds streams, streams join into rivers and rivers carry the water down to the sea." }]);
setx("tc1", "alt", [{ intro: "Even a short fitness circuit has a shape. Put the parts in order.", items: ["Pulse raiser: gentle jogging on the spot", "Stretch the main muscles you will use", "The circuit: sprints, squats and passes", "Cool down: walk and breathe slowly"], hint: "Start gently, build up, then slow down.", why: "A warm up gets the body ready and a cool down helps it settle. The hardest part sits in the middle." }]);
setx("bb1", "alt", [{ intro: "Big things feel easier in small steps. Here is a ladder for joining a new club. Put the steps in order, smallest first.", items: ["Read about the club online", "Walk past while it is on", "Go along and watch from the door", "Join in with a friend beside you", "Join in on your own"], hint: "The smallest step asks the least of you.", why: "Small steps make a big thing doable. You choose when to climb." }]);
setx("dd4", "alt", [{ intro: "Four drones show their battery as a decimal. Order them from the lowest charge to the highest.", items: ["0.08", "0.3", "0.35", "0.5", "0.62"], hint: "Compare tenths first, then hundredths.", why: "Line the decimals up by place value. 0.3 is less than 0.35 because 0 hundredths is less than 5." }]);
setx("im3", "alt", [{ intro: "You search for a video and it starts playing. Put the steps in order.", items: ["You type a search into the box", "The browser sends your search to a server", "The server sends back a list of videos", "You pick one and the video plays"], hint: "A request goes out first, then an answer comes back.", why: "Your device sends a request, a server answers, and then you choose what to watch." }]);
setx("ob3", "alt", [{ intro: "A strong argument deals with the other view. Put this paragraph in order.", items: ["Some people say school uniform should go.", "They say it stops pupils showing who they are.", "However, uniform makes everyone look equal.", "So a simple uniform is still a good idea."], hint: "Start with the other side. Use however to turn it around.", why: "State the other view, show you understand it, then explain why you still disagree." }]);
setx("gn3", "alt", [{ intro: "A shaded wall goes from the darkest tone to the lightest. Put the swatches in that order.", items: [sw("#14120e", "Black"), sw("#5a3a64", "Dark purple"), sw("#9a6fb0", "Purple"), sw("#d9bde6", "Pale purple"), sw("#fbfbf4", "White")], hint: "Start with the one nearest to black.", why: "Tone is how light or dark a colour is. Going from dark to light gives a smooth fade." }]);
setx("rl4", "alt", [{ intro: "Energy moves along a pond food chain. Put the steps in order, starting from the sun.", items: ["The sun's energy is captured by pond weed", "A snail eats the pond weed", "A frog eats the snail", "Microbes break the frog down when it dies"], hint: "Producers come first. Decomposers come last.", why: "Plants capture the energy, animals pass it along and decomposers return nutrients to the water." }]);
setx("bb3", "alt", [{ intro: "Asking for help can feel big. Here is a ladder of small steps. Put them in order, smallest first.", items: ["Think about what you need help with", "Write it down", "Ask one person you trust", "Ask in front of the class"], hint: "Start with the step that asks the least of you.", why: "Small steps build confidence. You decide when to climb." }]);
setx("bi1", "alt", [{ intro: "Tap between sentences to start a new paragraph where the topic changes. There are two changes.", sents: ["We got up early on Saturday and found our swimming bags.", "Mum made toast while we waited for the lift.", "We arrived at the pool just before ten.", "The water was warm and the lanes were quiet.", "I swam my first full length without stopping.", "My coach gave me a high five.", "Afterwards we had hot chocolate.", "Then we went home tired and happy."], brk: [3, 7], hint: "Getting ready, the swimming, and afterwards.", why: "A new paragraph marks a new time or place: getting ready, the swim, then afterwards." }]);
setx("bi2", "alt", [{ intro: "Tap between sentences to start a new paragraph. Look for a change of place or person. There are two changes.", sents: ["We set off for the museum on Tuesday.", "The coach was full of chatter.", "In the first hall, there was a giant whale skeleton.", "It hung from the ceiling on wires.", "Later, a guide called Ms Patel showed us the fossils.", "She let us hold a real shark tooth."], brk: [2, 4], hint: "The journey, the whale hall, then the guide.", why: "The paragraph changes when we arrive somewhere new and again when a new person takes over." }]);
setx("bi3", "alt", [{ intro: "Tap between sentences to start a new paragraph when the time or topic shifts. There are two changes.", sents: ["Last month our class ran a school fair.", "We made posters and put them up all over school.", "We chose games and found prizes.", "On the day, the doors opened at noon.", "The hoopla stall had the longest queue.", "By three, nearly every ticket had been sold.", "Afterwards we counted the money.", "We raised 96 pounds for the library."], brk: [3, 6], hint: "Getting ready, the fair, then the result.", why: "A new paragraph marks a change of time or topic: planning, the fair, then the result." }]);
setx("bi4", "alt", [{ intro: "In a story, every time someone new speaks, a new paragraph starts. Tap where each new speaker begins.", sents: ["\"Can I borrow your pen?\" asked Mia.", "\"Of course,\" said Ben.", "\"It has run out,\" Mia sighed.", "\"Then try this one,\" Ben grinned."], brk: [1, 2, 3], hint: "Each line is a different person talking.", why: "A new speaker means a new line. It helps the reader follow who is talking." }]);
setx("na3", "alt", [{ cells: 24, perRow: 6, intro: "The plot has 24 beds. Plant one half with carrots, one quarter with peas and one eighth with sunflowers.", cols: [{ n: "Carrots", c: "#f08a2c", k: 12 }, { n: "Peas", c: "#7bc96f", k: 6 }, { n: "Sunflowers", c: "#f1d04a", k: 3 }], hint: "Divide 24 by 2, by 4 and by 8 to find each share.", why: "24 divided by 2 is 12, by 4 is 6 and by 8 is 3. That is 21 beds, so 3 are left free." }]);
setx("na4", "alt", [{ parts: ["The square numbers go 1, 4, 9, 16, ", { a: "25", o: ["20", "24", "25", "26"] }, ", 36, ", { a: "49", o: ["42", "48", "49", "64"] }, ". Each time you add the next odd number, so after 49 you add ", { a: "15", o: ["13", "14", "15", "16"] }, " to reach 64."], intro: "Square numbers build up as squares of dots. Find the pattern and complete it.", hint: "The gaps are 3, 5, 7, 9 and so on. What comes after 49?", why: "The gaps are the odd numbers: +3, +5, +7, +9, +11, +13, +15. Each new square adds an edge of dots." }]);
setx("pe3", "alt", [{ parts: ["The ", { a: "cat's", o: ["cats", "cat's", "cats'"] }, " basket is by the door (one cat). The ", { a: "teachers'", o: ["teachers", "teacher's", "teachers'"] }, " room is down the corridor (lots of teachers). ", { a: "They're", o: ["Their", "They're", "There"] }, " on their way."], hint: "One owner means apostrophe then s. Many owners that end in s means the apostrophe goes after the s.", why: "Cat's is one cat. Teachers' is more than one teacher. They're is they are." }]);
setx("pe4", "alt", [{ parts: ["You will need two things", { a: ":", o: "m" }, " a pencil and a ruler.<br>The bell rang", { a: ";", o: "m" }, " everyone lined up.<br>When the bell rang", { a: ",", o: "m" }, " everyone lined up."], hint: "A colon introduces a list. A semicolon joins two sentences. A comma follows an opening phrase.", why: "A colon opens a list, a semicolon links two related sentences and a comma follows a starter phrase." }]);

setx("lr3", "alt", [{ intro: "A good wake up helps you start the day. Put the steps in a sensible order.", items: ["Open the curtains", "Sit up slowly", "Drink some water", "Get dressed", "Eat breakfast"], hint: "Start with light and your body, then do the getting ready.", why: "Light and water tell your body it is time to start the day." }]);
var box = null, ov = null, cur = null, X = null, done = null, baseC = null;

/* a new instance of a chunk for replay number gen (0 = the original) */
function inst(base, gen){
  if(!gen) return base;
  var c = {}, k, r = rnd(hashId(base.id) * 7 + gen * 101), i, j;
  for(k in base) c[k] = base[k];
  if(base.alt){ var vs = [null].concat(base.alt), v0 = vs[gen % vs.length]; if(v0) for(k in v0) c[k] = v0[k] }
  if(base.type === "sort" && base.extra){
    var out = [];
    base.buckets.forEach(function(b, bi){
      var have = base.items.filter(function(it){ return it[1] === bi });
      var pool = have.concat(base.extra.filter(function(it){ return it[1] === bi }));
      shr(pool, r).slice(0, have.length).forEach(function(it){ out.push(it) });
    });
    c.items = shr(out, r);
  } else if(base.type === "pairs" && base.extra){
    c.pairs = shr(base.pairs.concat(base.extra), r).slice(0, base.pairs.length);
  }
  if(base.vary){ var o = base.vary(r); for(k in o) c[k] = o[k] }
  return c;
}

function fresh(c, gen){
  var n, i, o = { tries: 0, res: null, shown: false, hint: "", gen: gen || 0 };
  if(c.type === "order"){ o.o = shuf(c.items.length, hashId(c.id) + o.gen * 13) }
  else if(c.type === "sort"){ o.m = c.items.map(function(){ return -1 }) }
  else if(c.type === "pairs"){ o.m = c.pairs.map(function(){ return "" }); o.r = shuf(c.pairs.length, hashId(c.id) + o.gen * 13) }
  else if(c.type === "dial"){ o.v = {}; c.sliders.forEach(function(s){ o.v[s.k] = s.v }) }
  else if(c.type === "fix"){ o.g = []; c.parts.forEach(function(p){ if(typeof p !== "string") o.g.push("") }) }
  else if(c.type === "break"){ o.b = c.sents.map(function(){ return false }) }
  else if(c.type === "paint"){ o.p = []; for(i = 0; i < c.cells; i++) o.p.push(-1); o.brush = 0 }
  return o;
}

/* ---- check: returns { ok, right, total, good: [], say } ---- */
function check(c, x){
  var i, r = { ok: false, right: 0, total: 0, good: [], say: "" };
  if(c.type === "order"){
    r.total = c.items.length; x.o.forEach(function(it, pos){ if(it === pos){ r.right++; r.good.push(pos) } });
    r.ok = r.right === r.total; r.say = r.right + " of " + r.total + " are in the right place. The green ones are settled.";
  } else if(c.type === "sort"){
    r.total = c.items.length; c.items.forEach(function(it, k){ if(x.m[k] === it[1]){ r.right++; r.good.push(k) } });
    var un = x.m.filter(function(v){ return v < 0 }).length;
    r.ok = r.right === r.total; r.say = un ? "Sort every item first, then check again. " + un + " still to place." : r.right + " of " + r.total + " are sorted well. The green ones are settled.";
  } else if(c.type === "pairs"){
    r.total = c.pairs.length; c.pairs.forEach(function(p, k){ if(x.m[k] === String(k)){ r.right++; r.good.push(k) } });
    var un2 = x.m.filter(function(v){ return v === "" }).length;
    r.ok = r.right === r.total; r.say = un2 ? "Match every part first, then check. " + un2 + " still to go." : r.right + " of " + r.total + " match. The green ones are settled.";
  } else if(c.type === "dial"){
    r.total = 1; r.ok = !!c.ok(x.v); r.right = r.ok ? 1 : 0; r.say = r.ok ? "" : "Not quite yet. Have another look at the numbers, or take a nudge.";
  } else if(c.type === "fix"){
    var gi = 0; c.parts.forEach(function(p){ if(typeof p !== "string"){ r.total++; if(x.g[gi] === p.a){ r.right++; r.good.push(gi) } gi++ } });
    r.ok = r.right === r.total; r.say = r.right + " of " + r.total + " gaps are right. The green ones are settled.";
  } else if(c.type === "break"){
    var want = {}; c.brk.forEach(function(k){ want[k] = 1 }); r.total = c.brk.length;
    var extra = 0; x.b.forEach(function(on, k){ var pos = k + 1; if(on){ if(want[pos]){ r.right++; r.good.push(k) } else extra++ } });
    r.ok = r.right === r.total && extra === 0;
    r.say = r.ok ? "" : (r.right + " of " + r.total + " paragraph changes found" + (extra ? ", and " + extra + " break" + (extra > 1 ? "s" : "") + " that may not be needed" : "") + ". Have another look.");
  } else if(c.type === "paint"){
    r.total = c.cols.length; var cnt = c.cols.map(function(){ return 0 });
    x.p.forEach(function(v){ if(v >= 0) cnt[v]++ });
    c.cols.forEach(function(col, k){ if(cnt[k] === col.k){ r.right++; r.good.push(k) } });
    r.ok = r.right === r.total;
    r.say = r.ok ? "" : c.cols.map(function(col, k){ return col.n + ": " + cnt[k] + (cnt[k] === col.k ? " (right)" : "") }).join(". ") + ".";
  }
  return r;
}

function solve(c, x){
  var i, k;
  if(c.type === "order"){ x.o = c.items.map(function(a, k2){ return k2 }) }
  else if(c.type === "sort"){ x.m = c.items.map(function(it){ return it[1] }) }
  else if(c.type === "pairs"){ x.m = c.pairs.map(function(p, k2){ return String(k2) }) }
  else if(c.type === "dial"){ for(k in c.sol) x.v[k] = c.sol[k] }
  else if(c.type === "fix"){ var g = []; c.parts.forEach(function(p){ if(typeof p !== "string") g.push(p.a) }); x.g = g }
  else if(c.type === "break"){ x.b = c.sents.map(function(s, k2){ return c.brk.indexOf(k2 + 1) >= 0 }) }
  else if(c.type === "paint"){ var n = 0; x.p = x.p.map(function(){ return -1 }); c.cols.forEach(function(col, ci){ for(i = 0; i < col.k; i++) x.p[n++] = ci }) }
}

/* ---- drawing ---- */
function cls(r, k){ return r && r.good.indexOf(k) >= 0 ? " good" : "" }
function bodyHtml(c, x){
  var h = "", r = x.res, i;
  if(c.type === "order"){
    h = '<ol class="lorder">';
    x.o.forEach(function(it, pos){
      h += '<li class="lrow' + cls(r, pos) + '"><span class="ltxt">' + c.items[it] + '</span><span class="lmv"><button class="lbt" data-lk="up" data-i="' + pos + '" aria-label="Move up"' + (pos === 0 ? " disabled" : "") + '>Up</button><button class="lbt" data-lk="dn" data-i="' + pos + '" aria-label="Move down"' + (pos === x.o.length - 1 ? " disabled" : "") + '>Down</button></span></li>';
    });
    h += '</ol>';
  } else if(c.type === "sort"){
    h = '<ul class="lsort">';
    c.items.forEach(function(it, k){
      h += '<li class="lrow' + cls(r, k) + '"><span class="ltxt">' + it[0] + '</span><span class="lmv">';
      c.buckets.forEach(function(b, bi){ h += '<button class="lbt" data-lk="put" data-i="' + k + '" data-b="' + bi + '" aria-pressed="' + (x.m[k] === bi) + '">' + b + '</button>' });
      h += '</span></li>';
    });
    h += '</ul>';
  } else if(c.type === "pairs"){
    h = '<ul class="lsort">';
    c.pairs.forEach(function(p, k){
      h += '<li class="lrow' + cls(r, k) + '"><span class="ltxt"><b>' + p[0] + '</b></span><select class="lsel" data-lk="pair" data-i="' + k + '" aria-label="Meaning of ' + p[0].replace(/"/g, "") + '"><option value="">Choose one</option>';
      x.r.forEach(function(ri){ h += '<option value="' + ri + '"' + (x.m[k] === String(ri) ? " selected" : "") + '>' + c.pairs[ri][1] + '</option>' });
      h += '</select></li>';
    });
    h += '</ul>';
  } else if(c.type === "dial"){
    h = '<div class="ldial">';
    c.sliders.forEach(function(s){
      h += '<label class="lsl"><span>' + s.l + ': <b id="lv-' + s.k + '">' + x.v[s.k] + (s.money ? "" : "") + s.u + '</b></span><input type="range" data-lk="dial" data-k="' + s.k + '" min="' + s.min + '" max="' + s.max + '" step="' + s.step + '" value="' + x.v[s.k] + '"></label>';
    });
    h += '<div class="lread" id="lread" aria-live="polite">' + c.read(x.v) + '</div></div>';
  } else if(c.type === "fix"){
    h = '<p class="lfix">'; var gi = 0;
    c.parts.forEach(function(p){
      if(typeof p === "string"){ h += p; return }
      var good = r && r.good.indexOf(gi) >= 0 ? " good" : "";
      var opts = p.o === "m" ? MARKS : [["", "choose"]].concat(p.o.map(function(o){ return [o, o] }));
      h += '<select class="lsel lgap' + good + '" data-lk="gap" data-i="' + gi + '" aria-label="Gap ' + (gi + 1) + '">';
      opts.forEach(function(o){ h += '<option value="' + o[0] + '"' + (x.g[gi] === o[0] ? " selected" : "") + '>' + o[1] + '</option>' });
      h += '</select>'; gi++;
    });
    h += '</p>';
  } else if(c.type === "break"){
    h = '<div class="lpara">';
    c.sents.forEach(function(s, k){
      if(k > 0){ h += '<button class="lgapb' + (x.b[k - 1] ? " on" : "") + (r && r.good.indexOf(k - 1) >= 0 ? " good" : "") + '" data-lk="brk" data-i="' + (k - 1) + '" aria-pressed="' + x.b[k - 1] + '">' + (x.b[k - 1] ? "New paragraph starts here" : "Tap to start a new paragraph here") + '</button>' }
      h += '<span class="lsent">' + s + '</span> ';
    });
    h += '</div>';
  } else if(c.type === "paint"){
    var cnt = c.cols.map(function(){ return 0 });
    x.p.forEach(function(v){ if(v >= 0) cnt[v]++ });
    h = '<div class="lbrush" role="group" aria-label="Choose a plant">';
    c.cols.forEach(function(col, k){ h += '<button class="lbt" data-lk="brush" data-i="' + k + '" aria-pressed="' + (x.brush === k) + '"><span class="lsw" style="background:' + col.c + '"></span>' + col.n + ' (' + cnt[k] + ')</button>' });
    h += '</div><div class="lpaint" style="grid-template-columns:repeat(' + c.perRow + ',1fr)">';
    x.p.forEach(function(v, k){ h += '<button class="lcell" data-lk="cell" data-i="' + k + '" aria-label="Bed ' + (k + 1) + (v >= 0 ? ", " + c.cols[v].n : ", empty") + '" style="' + (v >= 0 ? "background:" + c.cols[v].c : "") + '"></button>' });
    h += '</div>';
  }
  return h;
}

function draw(){
  var c = cur, x = X, h = "";
  var act = (window.JTLearn.actInfo && window.JTLearn.actInfo(c.slug)) || { title: c.slug, pillar: "" };
  var solved = x.shown;
  h += '<div class="lhead"><div><span class="lpil">' + act.pillar + ' &middot; ' + act.title + '</span><h2>' + c.title + '</h2></div><button class="btn btn-quiet" data-lk="close">Leave it for now</button></div>';
  h += '<p class="lintro">' + c.intro + '</p>';
  if(x.done){
    var rw = x.reward || {}, pips = "", q;
    if(rw.cap){ pips = '<span class="lpips" aria-hidden="true">'; for(q = 0; q < rw.cap; q++) pips += '<i class="' + (q < rw.lvBefore ? "on" : (q < rw.lvAfter ? "on gain" : "")) + '" style="animation-delay:' + (0.25 + (q - rw.lvBefore) * 0.3) + 's"></i>'; pips += '</span>' }
    var gain;
    if(rw.already) gain = '<p class="lgain lgrey">Just for fun this time. This one is already banked.</p>';
    else if(c.tier === 2) gain = '<p class="lgain">+' + (rw.coins || 0) + ' coins and a mastery star for ' + act.title + '</p>';
    else gain = '<p class="lgain">+' + (rw.lvAfter - rw.lvBefore) + ' training level' + (rw.lvAfter - rw.lvBefore === 1 ? "" : "s") + ' for ' + act.title + '</p>' + pips + (rw.lvAfter >= rw.cap && rw.cap ? '<p class="lmax">' + act.title + ' is maxed out!</p>' : "");
    var mt = rw.match ? '<p class="lgain lmatch">A match is ready. Head to the dugout when you like.</p>' : "";
    h += '<div class="ldone"><h3>' + (c.tier === 2 ? "Challenge complete" : "Nicely done") + '</h3><p>' + c.why + '</p>' + gain + mt + '<div class="mbtns"><button class="btn btn-go" data-lk="finish">Back to training</button><button class="btn" data-lk="finishgo">Go to the dugout</button><button class="btn btn-quiet" data-lk="replay">Play a new version</button></div></div>';
  } else {
    h += '<div class="lbody">' + bodyHtml(c, x) + '</div>';
    h += '<div class="lmsg" id="lmsg" role="status" aria-live="polite">' + (x.say || "") + (x.hint ? '<p class="lnudge"><b>Nudge:</b> ' + x.hint + '</p>' : "") + '</div>';
    h += '<div class="mbtns">';
    if(solved){ h += '<button class="btn btn-go" data-lk="again">Try it again yourself</button>' }
    else { h += '<button class="btn btn-go" data-lk="check">Check</button><button class="btn" data-lk="nudge">Give me a nudge</button>'; if(x.tries >= 2) h += '<button class="btn btn-quiet" data-lk="show">Show me the answer</button>' }
    h += '</div>';
    if(solved) h += '<p class="hint" style="margin:8px 0 0">That is the answer. Have a go yourself when you like, and it counts once you have done it.</p>';
  }
  box.innerHTML = h;
  var f = box.querySelector("[data-lk=check],[data-lk=finish],[data-lk=again]");
  if(f && draw.focus){ f.focus(); draw.focus = false }
}

function open(id, cb, gen){
  var b0 = byId(id); if(!b0) return false;
  gen = gen || 0; baseC = b0;
  var c = inst(b0, gen);
  cur = c; done = cb || null; X = fresh(c, gen);
  box = document.getElementById("lobox"); ov = document.getElementById("lo");
  ov.classList.add("on"); draw();
  var hd = box.querySelector("h2"); if(hd){ hd.setAttribute("tabindex", "-1"); hd.focus() }
  return true;
}
function close(){ if(ov) ov.classList.remove("on"); cur = null; X = null; if(box) box.innerHTML = "" }

function onClick(e){
  if(!cur) return;
  var b = e.target.closest("[data-lk]"); if(!b) return;
  var k = b.getAttribute("data-lk"), i = +b.getAttribute("data-i"), c = cur, x = X;
  if(k === "close"){ close(); return }
  if(k === "finish"){ close(); return }
  if(k === "finishgo"){ close(); if(window.JTLearn.go) window.JTLearn.go(); return }
  if(k === "again" || k === "replay"){ cur = inst(baseC, x.gen + 1); X = fresh(cur, x.gen + 1); draw(); var h2 = box.querySelector("h2"); if(h2){ h2.setAttribute("tabindex", "-1"); h2.focus() } return }
  if(k === "nudge"){ x.hint = c.hint; draw(); return }
  if(k === "show"){ solve(c, x); x.shown = true; x.res = null; x.say = "Here is the answer."; x.hint = ""; draw(); return }
  if(k === "check"){
    x.tries++; var r = check(c, x); x.res = r;
    if(r.ok){ x.done = true; x.say = "";
      if(!x.rewarded){ x.rewarded = true; window.JTLearn.reward = null; if(done) done(baseC, x.gen); x.reward = window.JTLearn.reward }
    } else { x.say = r.say; if(x.tries >= 3 && !x.hint) x.say += " A nudge is free whenever you like." }
    draw.focus = x.done; draw(); return;
  }
  if(x.shown) return;
  x.res = null; x.say = "";
  if(k === "up" && i > 0){ var t = x.o[i]; x.o[i] = x.o[i - 1]; x.o[i - 1] = t }
  else if(k === "dn" && i < x.o.length - 1){ var t2 = x.o[i]; x.o[i] = x.o[i + 1]; x.o[i + 1] = t2 }
  else if(k === "put"){ x.m[i] = +b.getAttribute("data-b") }
  else if(k === "brk"){ x.b[i] = !x.b[i] }
  else if(k === "brush"){ x.brush = i }
  else if(k === "cell"){ x.p[i] = x.p[i] === x.brush ? -1 : x.brush }
  else return;
  draw();
  if(k === "up" || k === "dn"){ var nb = box.querySelector('[data-lk="' + k + '"][data-i="' + (k === "up" ? i - 1 : i + 1) + '"]'); if(nb) nb.focus() }
}
function onInput(e){
  if(!cur || X.shown) return;
  var t = e.target, k = t.getAttribute && t.getAttribute("data-lk"); if(!k) return;
  var x = X, c = cur;
  if(k === "dial"){
    x.v[t.getAttribute("data-k")] = +t.value; x.res = null; x.say = "";
    c.sliders.forEach(function(s){ var el = document.getElementById("lv-" + s.k); if(el) el.textContent = x.v[s.k] + s.u });
    var rd = document.getElementById("lread"); if(rd) rd.innerHTML = c.read(x.v);
    var m = document.getElementById("lmsg"); if(m && !x.hint) m.innerHTML = "";
  }
}
function onChange(e){
  if(!cur || X.shown) return;
  var t = e.target, k = t.getAttribute && t.getAttribute("data-lk"); if(!k) return;
  var i = +t.getAttribute("data-i");
  if(k === "pair"){ X.m[i] = t.value } else if(k === "gap"){ X.g[i] = t.value } else return;
  X.res = null; X.say = "";
  var fi = t.getAttribute("data-lk"), ii = t.getAttribute("data-i");
  draw();
  var again = box.querySelector('[data-lk="' + fi + '"][data-i="' + ii + '"]'); if(again) again.focus();
}

function init(){
  ov = document.getElementById("lo"); box = document.getElementById("lobox");
  if(!ov) return;
  ov.addEventListener("click", onClick);
  ov.addEventListener("input", onInput);
  ov.addEventListener("change", onChange);
  document.addEventListener("keydown", function(e){ if(e.key === "Escape" && cur) close() });
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

window.JTLearn = { chunks: CH, byId: byId, forAct: forAct, open: open, close: close, check: check, solve: solve, fresh: fresh, inst: inst, reward: null, actInfo: null, go: null,
  isOpen: function(){ return !!cur }, state: function(){ return X }, current: function(){ return cur } };
})();
