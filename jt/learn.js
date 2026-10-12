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

var MARKS = [["", "choose"], ["?", "question mark"], [",", "comma"], [".", "full stop"], ["'", "apostrophe"], ["!", "exclamation mark"]];
var QUOTES = {};
function byId(id){ for(var i = 0; i < CH.length; i++) if(CH[i].id === id) return CH[i]; return null }
function forAct(slug){ return CH.filter(function(c){ return c.slug === slug }) }

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

var box = null, ov = null, cur = null, X = null, done = null;

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
    h += '<div class="ldone"><h3>Nicely done</h3><p>' + c.why + '</p><p class="lgain">+2 training levels for ' + act.title + '</p><div class="mbtns"><button class="btn btn-go" data-lk="finish">Back to training</button></div></div>';
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

function open(id, cb){
  var c = byId(id); if(!c) return false;
  cur = c; done = cb || null; X = fresh(c, 0);
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
  if(k === "finish"){ var cb = done, cc = c; close(); if(cb) cb(cc); return }
  if(k === "again"){ X = fresh(c, x.gen + 1); draw(); return }
  if(k === "nudge"){ x.hint = c.hint; draw(); return }
  if(k === "show"){ solve(c, x); x.shown = true; x.res = null; x.say = "Here is the answer."; x.hint = ""; draw(); return }
  if(k === "check"){
    x.tries++; var r = check(c, x); x.res = r;
    if(r.ok){ x.done = true; x.say = "" } else { x.say = r.say; if(x.tries >= 3 && !x.hint) x.say += " A nudge is free whenever you like." }
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

window.JTLearn = { chunks: CH, byId: byId, forAct: forAct, open: open, close: close, check: check, solve: solve, fresh: fresh, actInfo: null,
  isOpen: function(){ return !!cur }, state: function(){ return X }, current: function(){ return cur } };
})();
