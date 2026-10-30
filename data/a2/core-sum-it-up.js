/* Base 5 core target activity: Sum it up.
   English. Summarising a short text of three paragraphs: the main idea
   of each paragraph, the key details that back each one up, then
   joining the main ideas into a short summary. Worked example then
   fade. Replayable: most questions have two extra versions (a new text
   each go). ASCII only. */
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
function lc(t){ return t.charAt(0).toLowerCase() + t.slice(1); }
function ext(a, b){ for(var k in b) if(Object.prototype.hasOwnProperty.call(b, k)) a[k] = b[k]; return a; }
/* easy read (LC): plain words for the first level only, so lv.medium and lv.spicy never carry ez */
function EZ(lv, o, z){ if(lv === "mild") o.ez = z; return o; }
function txt(d){ return d.p.map(function(p, k){ return '<p class="a2task"><b>' + (k + 1) + '.</b> ' + p + '</p>'; }).join(""); }
/* build one question from a level set {mild, medium, spicy} of texts */
function L(fn, set){ var o = fn(set.mild, "mild"); o.lv = { medium: fn(set.medium, "medium"), spicy: fn(set.spicy, "spicy") }; return o; }
function S(type, topic, fn, sets, extra){ var s = ext(ext({ type: type, topic: topic }, L(fn, sets[0])), extra || {}); s.vary = [L(fn, sets[1]), L(fn, sets[2])]; return s; }

/* ---------- pictures ---------- */
var STACK = '<svg viewBox="0 0 520 230" role="img" aria-label="Three paragraphs, each with a short label saying what it is mostly about">' +
  '<rect width="520" height="230" rx="16" fill="#f4f1ea"/>' +
  [["#22b8e6", "Getting there"], ["#19c39a", "On the beach"], ["#ff8a5c", "Going home"]].map(function(c, k){
    var y = 18 + k * 68;
    return '<rect x="24" y="' + y + '" width="250" height="56" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
      T(36, y + 22, String(k + 1), 14, { b: 1, c: "#5b6180" }) +
      [0, 1].map(function(j){ return '<rect x="56" y="' + (y + 14 + j * 18) + '" width="' + (j ? 150 : 200) + '" height="7" rx="3" fill="#c9cbd6"/>'; }).join("") +
      '<path d="M284 ' + (y + 28) + 'h40" stroke="#141a33" stroke-width="3"/><path d="M320 ' + (y + 20) + 'l12 8 -12 8z" fill="#141a33"/>' +
      '<rect x="340" y="' + (y + 8) + '" width="156" height="40" rx="10" fill="' + c[0] + '" fill-opacity=".4" stroke="#141a33" stroke-width="2"/>' +
      T(418, y + 34, c[1], 15, { a: "middle", b: 1 });
  }).join("") + '</svg>';

var BACK = '<svg viewBox="0 0 520 220" role="img" aria-label="A main idea in the middle. Two key details point into it and prove it. One extra detail floats off to the side: just extra">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  '<rect x="170" y="80" width="180" height="60" rx="30" fill="#ffd23f" fill-opacity=".6" stroke="#141a33" stroke-width="2.5"/>' + T(260, 116, "Main idea", 18, { a: "middle", b: 1 }) +
  '<rect x="16" y="20" width="132" height="44" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' + T(82, 47, "Key detail", 14, { a: "middle", b: 1 }) +
  '<rect x="16" y="156" width="132" height="44" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' + T(82, 183, "Key detail", 14, { a: "middle", b: 1 }) +
  '<path d="M148 52q20 10 30 34M148 168q20 -10 30 -34" fill="none" stroke="#1f9d63" stroke-width="3.5"/>' +
  '<path d="M172 80l8 10 2 -12zM172 140l8 -10 2 12z" fill="#1f9d63"/>' +
  T(110, 112, "backs it up", 13, { a: "middle", b: 1, c: "#1f9d63" }) +
  '<rect x="388" y="24" width="116" height="44" rx="10" fill="#ffffff" stroke="#141a33" stroke-opacity=".4" stroke-width="2" stroke-dasharray="6 4"/>' + T(446, 51, "Extra bit", 14, { a: "middle", c: "#5b6180" }) +
  T(446, 92, "nice, but not", 12, { a: "middle", c: "#5b6180" }) + T(446, 108, "needed", 12, { a: "middle", c: "#5b6180" }) +
  A.bird(450, 170, 0.8, "#3a8fd6") + '</svg>';

var WORKED = '<svg viewBox="0 0 520 300" role="img" aria-label="A worked example. Step 1: a label for each paragraph: found a hedgehog in the snow, looked after at the rescue centre, set free in spring. Step 2: keep the key details. Step 3: join the labels into one summary">' +
  '<rect width="520" height="300" rx="16" fill="#f4f1ea"/>' +
  T(20, 30, "Step 1: a label for each paragraph", 15, { b: 1, c: "#1d5f99" }) +
  [["1", "Found a hedgehog in the snow"], ["2", "Looked after at the rescue centre"], ["3", "Set free in spring"]].map(function(r, k){
    return '<rect x="20" y="' + (42 + k * 34) + '" width="360" height="28" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="1.5"/>' + T(32, 61 + k * 34, r[0] + ".  " + r[1], 14);
  }).join("") +
  T(20, 168, "Step 2: key details", 15, { b: 1, c: "#1d5f99" }) + T(200, 168, "tiny, cold  /  fed, gained weight  /  April, the garden", 12, { c: "#3a4060" }) +
  T(20, 200, "Step 3: join them up", 15, { b: 1, c: "#1d5f99" }) +
  '<rect x="20" y="210" width="480" height="74" rx="12" fill="#19c39a" fill-opacity=".3" stroke="#141a33" stroke-width="2"/>' +
  T(34, 236, "A tiny hedgehog found in the snow was looked", 15, { b: 1 }) + T(34, 258, "after at a rescue centre, then set free in spring.", 15, { b: 1 }) +
  A.egg(A.bird(470, 80, 0.8, "#ff5d5d"), "A bird watching the hedgehog story. It has its own summary: found worm, ate worm.") +
  '</svg>';

var CHECK = '<svg viewBox="0 0 520 200" role="img" aria-label="A summary checklist: every paragraph, short, nothing new">' +
  '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  '<rect x="24" y="20" width="330" height="160" rx="12" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
  T(44, 50, "Summary check", 17, { b: 1 }) +
  ["Every paragraph is in it", "It is short", "Nothing new or made up"].map(function(t, k){
    return '<rect x="44" y="' + (66 + k * 36) + '" width="24" height="24" rx="5" fill="#e6f7ef" stroke="#141a33" stroke-width="2"/>' +
      '<path d="M49 ' + (78 + k * 36) + 'l6 7 11 -14" fill="none" stroke="#1f9d63" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' + T(80, 84 + k * 36, t, 15);
  }).join("") +
  A.egg('<g transform="translate(440 120)">' + A.bonnie(0, 0, 0.9, "sit") + '</g>', "Bonnie's summary of her whole day: walk, biscuit, sofa, biscuit, sofa. Every paragraph, short, nothing made up. Perfect.") +
  '</svg>';

/* ---------- texts for chunks 1 and 2: three goes x three levels ---------- */
var X = [
  { mild: { p: ["[[Crew]] went to the seaside by train. The train was very busy.", "At the beach, they made a big sandcastle. Then they had ice cream.", "On the way home, everyone fell asleep. It was a long day."],
      lab: ["Getting to the seaside", "Fun on the beach", "Going home"],
      det: [["They went by train.", "The train was very busy."], ["They made a big sandcastle.", "They had ice cream."], ["Everyone fell asleep.", "It was a long day."]], no: "They went swimming in the sea." },
    medium: { p: ["[[Crew]] set off for the seaside at 8am. The train was packed, so most of them stood for the whole hour.", "The beach was worth it. They built a sandcastle taller than Bonnie, played football on the sand and queued for ice creams that melted faster than they could eat them.", "By the train home, everyone was worn out. Half of them fell asleep before the first stop, and one person left their shoes on the platform."],
      lab: ["The journey there", "A great time on the beach", "A tired trip home"],
      det: [["The train was packed.", "Most of them stood for an hour."], ["They built a huge sandcastle.", "They played football on the sand."], ["Half of them fell asleep.", "Someone left their shoes on the platform."]], no: "They saw a seal in the harbour." },
    spicy: { p: ["The day began badly for [[crew]]. The 8am train was so crowded that most of them stood, wedged against the doors, for a full hour.", "Once they reached the sand, though, the mood lifted. There was a sandcastle contest (won, narrowly, by the team with a bucket), a scrappy game of beach football, and ice creams that dripped down every wrist.", "The journey home was quieter. Sunburnt and sandy, half the group dozed off before the first stop, and nobody noticed one pair of trainers left behind on the platform."],
      lab: ["A difficult journey there", "A brilliant day on the beach", "A worn out, quiet trip home"],
      det: [["The train was so crowded most of them stood.", "They were wedged against the doors."], ["There was a sandcastle contest.", "They played beach football."], ["Half the group dozed off.", "They were sunburnt and sandy."]], no: "The train broke down on the way." } },
  { mild: { p: ["The Shah family wanted a dog. They chose a small puppy called Biscuit.", "In the first week, Biscuit chewed a shoe. She cried at night.", "Now Biscuit is happy. She sleeps all night in her bed."],
      lab: ["Getting a puppy", "A hard first week", "Settled in now"],
      det: [["They wanted a dog.", "The puppy was called Biscuit."], ["Biscuit chewed a shoe.", "She cried at night."], ["Biscuit is happy.", "She sleeps all night."]], no: "Biscuit is a poodle." },
    medium: { p: ["The Shah family had wanted a dog for years. In March, they visited a rescue centre and came home with a small, nervous puppy called Biscuit.", "The first week was hard. Biscuit chewed two shoes and a remote control, and she cried every night until someone sat with her.", "Three months on, it is a different story. Biscuit sleeps through the night, walks nicely on her lead and greets everyone at the door."],
      lab: ["Getting Biscuit", "A tough first week", "Happy and settled now"],
      det: [["They visited a rescue centre.", "They came home with a nervous puppy."], ["Biscuit chewed two shoes and a remote.", "She cried every night."], ["She sleeps through the night.", "She walks nicely on her lead."]], no: "Biscuit was the smallest puppy there." },
    spicy: { p: ["After years of pleading from the children, the Shah family finally gave in. A trip to the rescue centre in March ended with a small, trembling puppy called Biscuit curled up on the back seat.", "Nobody had warned them about the first week. Two shoes, one remote control and a corner of the sofa did not survive, and every night ended with Biscuit howling until somebody came downstairs.", "Three months later, the house is calm. Biscuit sleeps right through, trots beside them on walks and greets every visitor as if they were a long lost friend."],
      lab: ["Finally getting a dog", "A chaotic first week", "A calm, settled dog now"],
      det: [["They went to a rescue centre in March.", "The children had pleaded for years."], ["She chewed shoes, a remote and the sofa.", "She howled every night."], ["She sleeps right through.", "She trots beside them on walks."]], no: "The family nearly took Biscuit back." } },
  { mild: { p: ["A class made a garden. They dug two beds and filled them with soil.", "They grew beans and potatoes. The beans grew very tall.", "In July they had a party. They ate the food they grew."],
      lab: ["Making the garden", "What grew", "The party"],
      det: [["They dug two beds.", "They filled them with soil."], ["They grew beans and potatoes.", "The beans grew very tall."], ["They had a party in July.", "They ate the food they grew."]], no: "They grew strawberries." },
    medium: { p: ["In September, a class turned an empty corner of the field into a garden. They dug two raised beds, filled them with soil and put a bird box on the fence.", "By spring, things were growing fast. The runner beans climbed taller than the fence, the potatoes needed digging up twice, and the slugs only ate a few tomatoes.", "In July, the class held a harvest party. Everyone ate potato salad and bean soup made from their own crops, and parents took home what was left."],
      lab: ["Building the garden", "Lots of things growing", "A harvest party"],
      det: [["They dug two raised beds.", "They filled the beds with soil."], ["The beans climbed taller than the fence.", "The potatoes needed digging up twice."], ["They ate potato salad and bean soup.", "Parents took home what was left."]], no: "The garden won a prize." },
    spicy: { p: ["Last September, the empty corner behind the field was little more than nettles. Within a month, a class had cleared it, built two raised beds and barrowed in a tonne of soil.", "Spring proved the effort worthwhile. Runner beans scrambled past the top of the fence, the potato crop had to be dug twice, and even the slugs left enough tomatoes to go round.", "It all ended with a harvest party in July: bean soup, potato salad and a table of leftovers for families to take home. The nettles have not been seen since."],
      lab: ["Turning a weedy corner into a garden", "A really good growing season", "Celebrating with a harvest party"],
      det: [["They cleared the nettles.", "They built two raised beds."], ["The beans grew past the fence.", "The potatoes had to be dug twice."], ["They made bean soup and potato salad.", "Families took leftovers home."]], no: "The garden won the town's best garden award." } }
];

/* ---------- texts for chunks 3 and 4 ---------- */
var Y = [
  { mild: { p: ["The town library was shut for a year. The roof had a big hole.", "Now it is open again. It has a games room and a cafe.", "Lots of people came in the first week. Some came every day."],
      lab: ["The library was shut", "Open again, with new things", "Lots of people came"],
      sum: "The library was shut for a year, but it is open again with new things, and lots of people have been.",
      miss: "The library was shut for a year, but now it is open again with a games room and a cafe.",
      extra: "The library was shut, but it is open again and lots of people came. It is the best library in the country.",
      long: "The town library was shut for a year because the roof had a big hole and now it is open again and it has a games room and a cafe and lots of people came in the first week and some came every day.",
      kw: [["shut", "closed", "roof", "hole", "repair", "fixed", "year"], ["open", "games", "cafe", "people", "came", "busy", "popular", "visit"]] },
    medium: { p: ["For a whole year, the town library sat empty. A storm had torn a hole in the roof, and rain had ruined hundreds of books.", "This month it finally reopened, and it is not the same place. There is a gaming room, a cafe with sofas and a quiet room for anyone who needs a break.", "It has been a huge hit. More than 500 people visited in the first week, and the gaming room is booked up until Christmas."],
      lab: ["Shut for a year after a storm", "Reopened with new rooms", "A big success"], t3: "The gaming room is booked until Christmas.",
      sum: "After a year shut because of storm damage, the library has reopened with new rooms, and it has been a big success.",
      miss: "After a year shut because of storm damage, the library has reopened with a gaming room, a cafe and a quiet room.",
      extra: "The library was shut for a year, then reopened with new rooms and has been a hit. The council should have fixed the roof sooner.",
      long: "For a whole year the library sat empty because a storm tore a hole in the roof and rain ruined hundreds of books, and this month it reopened with a gaming room, a cafe with sofas and a quiet room, and more than 500 people visited in the first week, and the gaming room is booked until Christmas.",
      kw: [["shut", "closed", "storm", "roof", "empty", "damage", "year"], ["open", "new", "gaming", "cafe", "success", "hit", "popular", "500", "visit", "busy"]] },
    spicy: { p: ["For twelve months, the town library was a sad sight: windows boarded, doors chained, a tarpaulin flapping where a storm had ripped through the roof and soaked hundreds of books.", "Its reopening this month revealed a building transformed. Alongside the shelves there is now a gaming room, a cafe with deep sofas and a quiet room for anyone who needs a break from the noise.", "Judging by the numbers, the town approves. Over 500 visitors came through the doors in the first week, and the gaming room is fully booked until Christmas."],
      lab: ["Closed for a year after a storm", "Reopened and transformed", "Hugely popular"], t3: "The gaming room is fully booked until Christmas.",
      sum: "Closed for a year by storm damage, the library has reopened transformed, with new rooms, and is proving hugely popular.",
      miss: "Closed for a year by storm damage, the library has reopened transformed, with a gaming room, a cafe and a quiet room.",
      extra: "Closed for a year by a storm, the library has reopened with new rooms and is hugely popular, which proves young people prefer games to books.",
      long: "For twelve months the library was boarded up and chained, with a tarpaulin where a storm ripped the roof and soaked hundreds of books, and this month it reopened with a gaming room, a cafe with deep sofas and a quiet room, and over 500 visitors came in the first week and the gaming room is booked until Christmas.",
      kw: [["shut", "closed", "storm", "roof", "boarded", "damage", "year", "twelve"], ["open", "transform", "new", "gaming", "cafe", "popular", "500", "visit", "busy", "approve"]] } },
  { mild: { p: ["[[Crew]] wanted to help the animal shelter. They planned a cake sale.", "On the day, they sold lots of cakes. The chocolate ones went first.", "They made 120 pounds. They gave it all to the shelter."],
      lab: ["Planning to help", "The cake sale", "The money raised"],
      sum: "[[Crew]] held a cake sale to help the animal shelter, and gave the 120 pounds they made to the shelter.",
      miss: "[[Crew]] wanted to help the animal shelter, so they planned a cake sale and sold lots of cakes.",
      extra: "[[Crew]] held a cake sale and raised 120 pounds for the animal shelter. Next year they will raise 500 pounds.",
      long: "[[Crew]] wanted to help the animal shelter so they planned a cake sale and on the day they sold lots of cakes and the chocolate ones went first and they made 120 pounds and gave it all to the shelter.",
      kw: [["cake", "sale", "bake", "baking", "help"], ["shelter", "money", "pounds", "120", "raised", "raise", "charity", "animal", "gave"]] },
    medium: { p: ["When [[crew]] heard the local animal shelter was short of money, they decided to help. They spent two weeks planning a cake sale and making posters.", "The sale itself was a sell out. Over 80 cakes went in under an hour, with the chocolate brownies gone in ten minutes.", "Altogether they raised 120 pounds, counted out on a kitchen table. The shelter used it to buy blankets and food for the winter."],
      lab: ["Deciding to help the shelter", "A sell out sale", "What the money did"], t3: "The money was counted on a kitchen table.",
      sum: "[[Crew]] held a cake sale to help the animal shelter. It sold out, and the 120 pounds raised bought winter blankets and food.",
      miss: "[[Crew]] planned a cake sale to help the animal shelter, and it sold out in under an hour.",
      extra: "[[Crew]] held a sell out cake sale and raised 120 pounds for blankets and food at the shelter. Brownies are the best cake to sell.",
      long: "When [[crew]] heard the animal shelter was short of money they spent two weeks planning a cake sale and making posters, and over 80 cakes went in under an hour, with the brownies gone in ten minutes, and they raised 120 pounds which bought blankets and food for the winter.",
      kw: [["cake", "sale", "bake", "help"], ["shelter", "money", "pounds", "120", "raised", "blanket", "food", "winter"]] },
    spicy: { p: ["News that the local animal shelter was struggling to pay its bills spread quickly, and [[crew]] were not going to sit back. Two weeks of planning, posters and late night baking followed.", "The sale was over almost before it began. More than 80 cakes vanished in under an hour; the brownies lasted barely ten minutes.", "The final total, 120 pounds (counted twice to be sure), may not sound huge, but the shelter turned it into warm blankets and a winter's supply of food for its dogs."],
      lab: ["Stepping in to help a struggling shelter", "A sale that sold out fast", "A small total that made a big difference"], t3: "The money was counted twice.",
      sum: "[[Crew]] organised a cake sale to help a struggling animal shelter; it sold out fast, and the 120 pounds paid for winter blankets and food.",
      miss: "[[Crew]] organised a cake sale to help a struggling animal shelter, and it sold out in under an hour.",
      extra: "[[Crew]] organised a cake sale for a struggling shelter, which sold out and paid for blankets and food. The council should give the shelter more money.",
      long: "News that the shelter was struggling spread and [[crew]] spent two weeks planning, making posters and baking late at night, and more than 80 cakes vanished in under an hour with the brownies lasting ten minutes, and the 120 pounds, counted twice, turned into blankets and a winter's food for the dogs.",
      kw: [["cake", "sale", "bake", "help", "organis"], ["shelter", "money", "pounds", "120", "raised", "blanket", "food", "winter", "difference"]] } },
  { mild: { p: ["Swifts are birds. They come to the UK in May. They fly all the way from Africa.", "Swifts do almost everything in the air. They eat and even sleep while flying.", "There are fewer swifts now. Nest boxes can help them."],
      lab: ["Swifts come from Africa", "Life in the air", "Swifts need help"],
      sum: "Swifts fly from Africa to the UK, live almost all their lives in the air, and nest boxes can help them now there are fewer.",
      miss: "Swifts fly from Africa to the UK in May and do almost everything in the air.",
      extra: "Swifts come from Africa, live in the air, and nest boxes help them. They are the best birds in the world.",
      long: "Swifts are birds and they come to the UK in May and they fly all the way from Africa and they do almost everything in the air and they eat and even sleep while flying and there are fewer swifts now and nest boxes can help them.",
      kw: [["africa", "fly", "flies", "flying", "come", "arrive", "air", "travel"], ["fewer", "nest", "box", "help", "less", "falling"]] },
    medium: { p: ["Every May, swifts arrive in the UK after flying around 10,000 km from Africa. They stay just three months before heading back.", "Swifts spend almost their whole lives in the air. They eat insects on the wing, drink raindrops and can even sleep while flying.", "Sadly, the number of swifts in the UK has halved in 25 years, partly because old buildings with gaps for nests are being knocked down. Special nest boxes put up under roofs are helping."],
      lab: ["A long journey from Africa", "A life lived in the air", "Fewer swifts, but boxes help"], t3: "The boxes go under roofs.",
      sum: "Swifts fly from Africa each May and live almost entirely in the air. Their numbers have halved, but nest boxes are helping.",
      miss: "Swifts fly 10,000 km from Africa each May and live almost entirely in the air.",
      extra: "Swifts fly from Africa, live in the air and are in decline, though nest boxes help. Everyone should be made to put up a nest box.",
      long: "Every May swifts arrive after flying 10,000 km from Africa and stay three months, and they spend almost their whole lives in the air eating insects, drinking raindrops and sleeping while flying, and their numbers have halved in 25 years because old buildings are knocked down, but nest boxes under roofs are helping.",
      kw: [["africa", "fly", "flies", "arrive", "journey", "air", "may"], ["halved", "fewer", "nest", "box", "help", "less", "decline", "falling"]] },
    spicy: { p: ["Each May, after a journey of around 10,000 km from Africa, the first swifts scream over British rooftops. Their visit is brief: by August they are gone again.", "Few birds are so completely creatures of the air. Swifts feed on insects mid flight, drink from falling rain, and are thought to sleep on the wing, landing only to nest.", "Yet their future here is uncertain. UK numbers have halved in 25 years, largely because modern buildings leave no gaps to nest in. Specially designed nest boxes, fitted under the eaves, are starting to turn things around."],
      lab: ["A short summer visit from Africa", "Built for life in the air", "Declining, but nest boxes offer hope"], t3: "The boxes are fitted under the eaves.",
      sum: "Swifts make a brief summer visit from Africa and live almost entirely in the air; their numbers have halved, but nest boxes are offering hope.",
      miss: "Swifts make a brief summer visit from Africa and are so suited to the air that they feed, drink and sleep in flight.",
      extra: "Swifts visit from Africa, live on the wing and are declining, though nest boxes help. Modern buildings are ugly anyway.",
      long: "Each May after 10,000 km from Africa the swifts scream over rooftops and leave by August, and they feed, drink and probably sleep in the air, landing only to nest, and their numbers have halved in 25 years because modern buildings have no gaps, but nest boxes under the eaves are starting to help.",
      kw: [["africa", "visit", "summer", "fly", "journey", "air", "wing"], ["halved", "fewer", "nest", "box", "hope", "help", "decline", "uncertain"]] } }
];

/* ---------- question builders ---------- */
function qPara(n){
  return function(d, lv){
    var o = n === 0 ? [d.lab[0], d.det[0][1], d.lab[1]] : [d.lab[1], d.det[1][0], d.lab[2]];
    if(lv === "spicy") o.push(n === 0 ? d.lab[2] : d.lab[0]);
    var other = n === 0 ? [2, 3] : [3, 1], sl = { 1: "That is one detail in paragraph " + (n + 1) + ". What is the whole paragraph about?" };
    sl[2] = "That is what paragraph " + other[0] + " is about."; if(lv === "spicy") sl[3] = "That is what paragraph " + other[1] + " is about.";
    return EZ(lv, { q: txt(d) + "What is paragraph <b>" + (n + 1) + "</b> mostly about?", options: o, answer: 0, slips: sl,
      hint: "Which label covers every sentence in paragraph " + (n + 1) + "?",
      why: "Paragraph " + (n + 1) + " is mostly about <b>" + lc(d.lab[n]) + "</b>. Everything in it fits under that label." },
      { slips: { 1: "That is one detail. What is it all about?", 2: "That is paragraph " + other[0] + "." }, hint: "Which label fits every sentence?",
        why: "<b>" + d.lab[n] + "</b>. It fits the whole paragraph." });
  };
}
function qOrder(d, lv){
  return EZ(lv, { q: txt(d) + "Put the main ideas in the order the text gives them.", items: d.lab.slice(),
    hint: "One label for each paragraph, top to bottom.", why: "1: " + d.lab[0] + ". 2: " + d.lab[1] + ". 3: " + d.lab[2] + ". Those three, joined up, are most of a summary already." },
    { q: txt(d) + "Put the main ideas in order.", hint: "Top to bottom.", why: "1: " + d.lab[0] + ". 2: " + d.lab[1] + ". 3: " + d.lab[2] + "." });
}
function qBack(d, lv){
  var o = [d.det[0][0], d.det[2][0], d.no], sl = { 1: "That is a detail, but it backs up paragraph 3.", 2: "That is not in the text at all." };
  if(lv === "spicy"){ o.push(d.det[1][1]); sl[3] = "That backs up paragraph 2."; }
  return EZ(lv, { q: txt(d) + "Which detail backs up the main idea <b>" + lc(d.lab[0]) + "</b>?", options: o, answer: 0, slips: sl,
    hint: "Look in paragraph 1.", why: "\"" + d.det[0][0] + "\" is in paragraph 1, and it backs up " + lc(d.lab[0]) + "." },
    { q: txt(d) + "Which detail backs up <b>" + lc(d.lab[0]) + "</b>?", slips: { 1: "That backs up paragraph 3.", 2: "That is not in the text." },
      why: "It is in paragraph 1." });
}
function qSortDet(d, lv){
  var cards = lv === "mild" ? [[d.det[0][0], 0], [d.det[1][0], 1], [d.det[2][0], 2]] :
    lv === "medium" ? [[d.det[0][0], 0], [d.det[0][1], 0], [d.det[1][0], 1], [d.det[2][0], 2], [d.det[2][1], 2]] :
    [[d.det[0][0], 0], [d.det[0][1], 0], [d.det[1][0], 1], [d.det[1][1], 1], [d.det[2][0], 2], [d.no, 3]];
  var b = d.lab.slice(); if(lv === "spicy") b.push("Not in the text");
  return EZ(lv, { q: txt(d) + "Sort the details. Which main idea does each one back up?", buckets: b, cards: cards,
    slips: { any: "Find each detail in the text. Which paragraph is it in?" },
    hint: "Each detail lives in one paragraph.", why: "Each key detail backs up the main idea of the paragraph it comes from." + (lv === "spicy" ? " One was never in the text at all." : "") },
    { q: txt(d) + "Which main idea does each detail back up?", slips: { any: "Which paragraph is it in?" }, hint: "Each one is in one paragraph.",
      why: "Each detail backs up its own paragraph." });
}
function qPick(d, lv){
  var o = [d.det[2][0], d.det[2][1], d.det[1][0]]; if(lv !== "mild") o.push(d.no); if(lv === "spicy") o.push(d.det[0][1]);
  return EZ(lv, { q: txt(d) + "Pick <b>both</b> details that back up <b>" + lc(d.lab[2]) + "</b>.", options: o, answers: [0, 1],
    slips: { any: "Both are in paragraph 3. Watch out for details from other paragraphs, and things the text never says." },
    hint: "Look in paragraph 3.", why: "\"" + d.det[2][0] + "\" and \"" + d.det[2][1] + "\" are both in paragraph 3." },
    { q: txt(d) + "Pick <b>both</b> details for <b>" + lc(d.lab[2]) + "</b>.", slips: { any: "Both are in paragraph 3." }, why: "Both are in paragraph 3." });
}
function qFade3(d, lv){
  var o = lv === "mild" ? [d.lab[2], d.lab[0], d.lab[1]] : [d.lab[2], d.t3, d.lab[0]];
  var sl = lv === "mild" ? { 1: "That is paragraph 1, already done.", 2: "That is paragraph 2, already done." } : { 1: "That is a small detail in paragraph 3, not the whole idea.", 2: "That is paragraph 1, already done." };
  if(lv === "spicy"){ o.push(d.lab[1]); sl[3] = "That is paragraph 2, already done."; }
  return EZ(lv, { q: txt(d) + "Step 1 is half done: paragraph 1 is <b>" + lc(d.lab[0]) + "</b>, paragraph 2 is <b>" + lc(d.lab[1]) + "</b>. Your turn: what is paragraph 3 mostly about?",
    options: o, answer: 0, slips: sl, hint: "One label that covers all of paragraph 3.", why: "Paragraph 3: <b>" + lc(d.lab[2]) + "</b>." },
    { q: txt(d) + "What is paragraph <b>3</b> mostly about?", slips: { 1: "That is paragraph 1.", 2: "That is paragraph 2." }, hint: "One label for all of paragraph 3." });
}
function qFadeJoin(d, lv){
  return EZ(lv, { q: txt(d) + "Steps 1 and 2 are done. The labels are: <b>" + d.lab.map(lc).join(" / ") + "</b>. Step 3: which summary joins them up?",
    options: [d.sum, d.miss, d.long], answer: 0,
    slips: { 1: "Close, but it leaves out paragraph 3.", 2: "That copies nearly everything. A summary is short." },
    hint: "Short, and all three labels in it.", why: "It has all three main ideas, joined up, and it is short." },
    { q: txt(d) + "Labels: <b>" + d.lab.map(lc).join(" / ") + "</b>. Which summary joins them up?", slips: { 1: "It leaves out paragraph 3.", 2: "Too long. A summary is short." },
      hint: "Short, with all three labels.", why: "All three ideas, and short." });
}
function qOwn(d, lv){
  return EZ(lv, { q: txt(d) + "Your turn, all three steps. Sum up the whole text in one or two sentences, in your own words if you can.",
    need: d.kw, model: d.sum,
    hint: "Label each paragraph in your head first, then join the labels up.",
    why: "Something like: \"" + d.sum + "\" Yours does not have to match. If it covers every paragraph and is short, it works." },
    { q: txt(d) + "Sum it all up in 1 or 2 sentences.", hint: "Label each paragraph. Then join them.", why: "Like: \"" + d.sum + "\"" });
}
var CHK = ["It misses out a paragraph.", "It adds something the text does not say.", "It is far too long: it copies nearly everything.", "Nothing: it is a good summary."];
function qChk(kind, who, ezWho){
  return function(d, lv){
    var ans = { miss: 0, extra: 1, long: 2 }[kind], sl = {};
    var say = ["Check: is every paragraph in it? Look for paragraph 3.", "Check: is everything in it from the text? Look at the last sentence.", "Check: is it short? Count the ands."];
    [0, 1, 2, 3].forEach(function(k){ if(k !== ans) sl[k] = k === 3 ? "Have another look with the checklist. Something is not quite right." : say[ans]; });
    var zsay = ["Is every paragraph in it? Check paragraph 3.", "Is it all from the text? Check the end.", "Is it short? Count the ands."], zsl = {};
    [0, 1, 2, 3].forEach(function(k){ if(k !== ans) zsl[k] = k === 3 ? "Try the checklist again." : zsay[ans]; });
    return EZ(lv, { q: txt(d) + who + " <b>\"" + d[kind] + "\"</b> What is not quite right?", options: CHK, answer: ans, fixed: true, slips: sl,
      hint: "Use the checklist: every paragraph, short, nothing new.",
      why: ["It leaves out paragraph 3: " + lc(d.lab[2]) + ".", "The last part is an opinion or a guess. The text never says it.", "It copies almost every detail. A summary keeps the main ideas and leaves the rest."][ans] },
      { q: txt(d) + (ezWho || who) + " <b>\"" + d[kind] + "\"</b> What is not quite right?", slips: zsl, hint: "Every paragraph, short, nothing new.",
        why: ["It leaves out paragraph 3.", "The end is not in the text.", "It copies nearly everything."][ans] });
  };
}

(window.A2PACKS = window.A2PACKS || {})["core-sum-it-up"] = {
  a2: true,
  id: "a2-core-sum-it-up",
  title: "Sum it up",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "Three short paragraphs: a label for each, the details that back them up, then one short summary.",
  blurb: "Summing up a short text in three steps: label each paragraph, keep the key details, join the labels up. Four short chunks, with a summary card to make at the end. A new text each time you come back.",
  note: "Sum it up: three steps to a short summary, with a worked example to start. Four five minute chunks and a summary card to make. New texts every time you come back, so have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Bite size", line: "Bite size: very short paragraphs, one easy idea in each." },
    { id: "medium", name: "Full plate", line: "Full plate: longer paragraphs, more details to sort." },
    { id: "spicy", name: "Chef's special", line: "Chef's special: lively writing, near misses and details that are not in the text at all." }
  ],
  themes: {
    time: { name: "Time travel", w: { crew: "the time crew", who: "Zed the time traveller" } },
    football: { name: "Football", w: { crew: "the squad", who: "the captain" } },
    horror: { name: "Horror", w: { crew: "the ghost hunters", who: "the night guard" } },
    fishing: { name: "Fishing", w: { crew: "the fishing club", who: "the angler" } },
    music: { name: "Music", w: { crew: "the band", who: "the drummer" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  ez: {
    realWorld: { html: "<p>You sum up films, matches and your weekend.</p><p>Back from the past? Sum it up in 3 ideas!</p>" },
    make: { intro: "Sum up a film, a match or your weekend. One or two sentences." }
  },
  startFig: STACK,
  steps: [

    /* ---------- chunk 1: a label for each paragraph ---------- */
    { type: "learn", topic: "Label it", title: "Each paragraph has one main idea",
      fig: STACK,
      html: "<p>A paragraph is a group of sentences about <b>one thing</b>. That one thing is its <b>main idea</b>.</p>" +
        "<p>A handy trick: give each paragraph a <b>label</b>, just a few words, like a sticker on a box. \"Getting there.\" \"On the beach.\" \"Going home.\"</p>" +
        "<p>A good label covers <b>every</b> sentence in the paragraph, not just one.</p>",
      ez: { title: "One main idea", html: "<p>Each paragraph has <b>one main idea</b>.</p><p>Give it a short <b>label</b>, like a sticker on a box.</p>" },
      lv: { spicy: { html: "<p>Each paragraph has <b>one main idea</b>. Give it a <b>label</b> of a few words, like a sticker on a box.</p>" +
        "<p>A good label covers <b>every</b> sentence. If it only fits one sentence, it is a detail. If it would fit the whole text, it is too big.</p>" +
        "<p>Lively writing hides the main idea behind jokes and description. Ask: if I took away the colourful bits, what is left?</p>" } } },

    S("mc", "Label it", qPara(0), X),
    S("mc", "Label it", qPara(1), X),
    S("order", "Label it", qOrder, X),

    /* ---------- chunk 2: key details ---------- */
    { type: "learn", topic: "Key details", title: "Key details back up the main idea",
      fig: BACK,
      html: "<p>Each main idea has <b>key details</b> that back it up. They are the proof.</p>" +
        "<p>\"Getting to the seaside\" is backed up by \"They went by train.\" That detail is in the same paragraph, and it shows the main idea is right.</p>" +
        "<p>Some details are just extras. And watch out for things that sound right but are not in the text at all.</p>",
      ez: { html: "<p><b>Key details</b> back up the main idea. They are the proof.</p><p>Watch out for things not in the text.</p>" } },

    S("mc", "Key details", qBack, X),
    S("sort", "Key details", qSortDet, X),
    S("multi", "Key details", qPick, X, { explain: true }),

    /* ---------- chunk 3: boil it down, worked example then fade ---------- */
    { type: "learn", topic: "Boil it down", title: "Three steps to a summary",
      fig: WORKED,
      html: "<p>Here is one Jay did earlier. The text:</p>" +
        "<p class=\"a2task\"><b>1.</b> In January, a tiny hedgehog was found in the snow. It was very cold.<br><b>2.</b> At the rescue centre, it was fed every day and gained weight.<br><b>3.</b> In April, it was let go in the garden where it was found.</p>" +
        "<p><b>Step 1:</b> a label for each paragraph. <b>Step 2:</b> keep the key details in mind. <b>Step 3:</b> join the labels into one or two short sentences.</p>",
      ez: { html: "<p><b>1.</b> Label each paragraph. <b>2.</b> Keep key details. <b>3.</b> Join the labels up.</p>" },
      lv: { spicy: { html: "<p>Here is one Jay did earlier. The text:</p>" +
        "<p class=\"a2task\"><b>1.</b> In January, a tiny hedgehog was found in the snow. It was very cold.<br><b>2.</b> At the rescue centre, it was fed every day and gained weight.<br><b>3.</b> In April, it was let go in the garden where it was found.</p>" +
        "<p><b>Step 1:</b> label each paragraph. <b>Step 2:</b> note the key details. <b>Step 3:</b> join the labels into one or two sentences.</p>" +
        "<p>Notice what got left out: the month, the weight, the garden. A summary keeps the main ideas, and only the details that really matter, like <b>tiny</b>.</p>" } } },

    { type: "order", topic: "Boil it down",
      q: "Put the steps for a summary in order.",
      items: ["Give each paragraph a label", "Keep the key details in mind", "Join the labels into a short summary", "Check: every paragraph, short, nothing new"],
      slips: { any: "Have a look at the worked example. What did Jay do first?" },
      hint: "It starts with the paragraphs, one at a time.",
      why: "Label, details, join, check.",
      ez: { q: "Put the summary steps in order.", slips: { any: "What did Jay do first?" }, hint: "Start with the paragraphs.", why: "Label, join, check." },
      lv: { mild: { items: ["Give each paragraph a label", "Join the labels into a short summary", "Check it"] } } },

    S("mc", "Boil it down", qFade3, Y),
    S("mc", "Boil it down", qFadeJoin, Y),
    S("text", "Boil it down", qOwn, Y),

    /* ---------- chunk 4: check a summary ---------- */
    { type: "learn", topic: "Check it", title: "The summary check",
      fig: CHECK,
      html: "<p>Last bit. Some people have had a go at summing up the same text. Each one has something not quite right.</p>" +
        "<p>Use the check: is <b>every paragraph</b> in it? Is it <b>short</b>? Is there <b>nothing new</b> or made up?</p>",
      ez: { html: "<p>Is <b>every paragraph</b> in it? Is it <b>short</b>? Is there <b>nothing new</b>?</p>" } },

    S("mc", "Check it", qChk("miss", "[[Who]] wrote:"), Y),
    S("mc", "Check it", qChk("extra", "Jay wrote:"), Y, { explain: true }),
    S("mc", "Check it", qChk("long", "Bonnie dictated this one, between biscuits:", "Bonnie wrote this one:"), Y)
  ],

  realWorld: {
    title: "Summing up, every day",
    html: "<p>You sum things up all the time: telling someone about a film without spoiling it, a match report in three lines, the \"in short\" bit at the top of a news story, a message to someone who missed a lesson.</p>" +
      "<p>For our big question: if we could time travel, should we? If you came back from a trip to the past, everyone would want to know what it was like. You would need to sum it up: three main ideas, not three hours of every detail.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay stepping out of the time portal with a short summary">' + A.portal(76, 75, 56) +
      A.jay(230, 64, 0.8, "smile") + A.bubble(272, 4, 140, 74, "Dinosaurs. Big.\nVery big.\nBack now.", 290) + '</svg>'
  },

  make: {
    title: "Make a summary card",
    intro: "Sum up anything you like: a film, an episode, a match, a book, your weekend. One or two short sentences, plus the key detail you would keep. Keep it, stick it up, or send it to Jay.",
    fields: [
      { id: "what", label: "What I am summing up", ph: "Saturday's match", max: 40 },
      { id: "sum", label: "My summary", ph: "We went 2 down, fought back, and won in the last minute.", max: 110 },
      { id: "key", label: "The key detail I would keep", ph: "The winner came in the 90th minute.", max: 60 },
      { id: "name", label: "Summed up by", ph: "B5", max: 24 }
    ],
    svg: function(v){
      var s = wrap(v.sum, 34, 4), k = wrap(v.key, 40, 2);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#fffdf6"/>' +
        '<rect x="12" y="12" width="576" height="376" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        T(34, 58, "IN SHORT", 26, { b: 1, c: "#e8862a" }) +
        T(34, 88, esc(wrap(v.what, 44, 1)[0] || ""), 17, { b: 1, c: "#5b6180" }) +
        '<rect x="28" y="104" width="544" height="150" rx="16" fill="#ffd23f" fill-opacity=".3"/>' +
        s.map(function(l, j){ return T(46, 140 + j * 32, esc(l), 22, { b: 1 }); }).join("") +
        T(34, 284, "Key detail", 14, { b: 1, c: "#1f9d63" }) +
        k.map(function(l, j){ return T(34, 310 + j * 24, esc(l), 18); }).join("") +
        T(34, 372, "Summed up by: " + esc(wrap(v.name, 24, 1)[0] || ""), 16, { b: 1, c: "#5b6180" }) +
        A.bird(548, 360, 0.7, "#3a8fd6") +
        '</svg>';
    }
  }
};
})();
