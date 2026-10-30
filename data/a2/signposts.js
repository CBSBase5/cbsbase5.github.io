/* Base 5 Autumn 2 activity: Signposts.
   English. Headings and sections: grouping information so a reader
   can find their way. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';

/* a wooden signpost with three arms */
var POST = '<svg viewBox="0 0 520 210" role="img" aria-label="A signpost with three arms: each points to a different part">' +
  '<rect width="520" height="210" rx="16" fill="#e9f6ff"/>' +
  '<path d="M0 180q130 -20 260 0t260 0v30H0z" fill="#8fd18a"/>' +
  '<rect x="150" y="40" width="16" height="150" rx="4" fill="#8a5a36"/>' +
  [["Getting there", 40, "#ffd23f", 1], ["Food", 86, "#ff8fb1", -1], ["Things to see", 132, "#7fd9f0", 1]].map(function(a){
    var w = 170, x = a[3] > 0 ? 166 : 150 - w;
    var tip = a[3] > 0 ? 'M' + (x + w) + ' ' + a[1] + 'l22 17 -22 17z' : 'M' + x + ' ' + a[1] + 'l-22 17 22 17z';
    return '<rect x="' + x + '" y="' + a[1] + '" width="' + w + '" height="34" fill="' + a[2] + '" stroke="#141a33" stroke-width="2.5"/>' +
      '<path d="' + tip + '" fill="' + a[2] + '" stroke="#141a33" stroke-width="2.5"/>' +
      '<text x="' + (x + w / 2) + '" y="' + (a[1] + 23) + '" text-anchor="middle" ' + F + ' font-size="15" font-weight="700" fill="#141a33">' + a[0] + '</text>';
  }).join("") +
  A2ART.bonnie(430, 146, 0.75, "sit") +
  '</svg>';
var POST_EGG = POST.replace("</svg>", A2ART.egg(A2ART.bird(158, 30, 0.6, "#3a8fd6"), "A bird sitting on top of the signpost. It does not need directions. It can fly.") + "</svg>");

/* a leaflet page: sections is [[heading, [lines]]], heading null = no heading */
function leaflet(title, sections, w){
  w = w || 520;
  var y = 74, out = "";
  sections.forEach(function(s){
    if(s[0]){
      out += '<rect x="24" y="' + (y - 18) + '" width="' + (w - 48) + '" height="26" rx="6" fill="#2f6fb0"/>' +
        '<text x="36" y="' + y + '" ' + F + ' font-size="15" font-weight="700" fill="#fff">' + s[0] + '</text>';
      y += 28;
    }
    s[1].forEach(function(l){ out += '<text x="36" y="' + y + '" ' + F + ' font-size="14" fill="#141a33">' + l + '</text>'; y += 21; });
    y += 14;
  });
  var hgt = y + 4;
  return '<svg viewBox="0 0 ' + w + ' ' + hgt + '" role="img" aria-label="A leaflet page">' +
    '<rect x="4" y="4" width="' + (w - 8) + '" height="' + (hgt - 8) + '" rx="12" fill="#fffdf6" stroke="#141a33" stroke-width="2.5"/>' +
    '<text x="24" y="38" ' + F + ' font-size="19" font-weight="700" fill="#141a33">' + title + '</text>' + out + '</svg>';
}

/* the same words, with and without signposts */
var BEFORE_AFTER = '<svg viewBox="0 0 540 220" role="img" aria-label="A block of text with no headings next to the same text split into sections with headings">' +
  '<rect width="540" height="220" rx="16" fill="#f4f1ea"/>' +
  '<rect x="20" y="20" width="230" height="170" rx="8" fill="#fff" stroke="#141a33" stroke-width="2"/>' +
  (function(){ var s = ""; for(var k = 0; k < 9; k++) s += '<path d="M36 ' + (40 + k * 17) + 'h' + (k === 8 ? 100 : 196) + '" stroke="#141a33" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>'; return s; })() +
  '<text x="135" y="208" text-anchor="middle" ' + F + ' font-size="14" font-weight="700" fill="#141a33">Where is the food bit?</text>' +
  '<path d="M262 104h26" stroke="#141a33" stroke-width="4"/><path d="M286 96l12 8 -12 8z" fill="#141a33"/>' +
  '<rect x="306" y="20" width="214" height="170" rx="8" fill="#fff" stroke="#141a33" stroke-width="2"/>' +
  [["Getting there", "#ffd23f"], ["Food", "#ff8fb1"], ["Things to see", "#7fd9f0"]].map(function(h, k){
    var y = 30 + k * 54;
    return '<rect x="318" y="' + y + '" width="140" height="20" rx="4" fill="' + h[1] + '"/><text x="324" y="' + (y + 15) + '" ' + F + ' font-size="13" font-weight="700" fill="#141a33">' + h[0] + '</text>' +
      '<path d="M322 ' + (y + 32) + 'h170M322 ' + (y + 44) + 'h110" stroke="#141a33" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>';
  }).join("") +
  '<text x="413" y="208" text-anchor="middle" ' + F + ' font-size="14" font-weight="700" fill="#141a33">Found it!</text></svg>';

/* three boxes with things being dropped in */
var GROUPS = '<svg viewBox="0 0 540 200" role="img" aria-label="Three boxes, each holding the facts that belong together">' +
  '<rect width="540" height="200" rx="16" fill="#f4f1ea"/>' +
  [["Getting there", "#ffd23f", ["bus", "car park"]], ["Food", "#ff8fb1", ["cafe", "picnic"]], ["Things to see", "#7fd9f0", ["rooms", "tours"]]].map(function(b, k){
    var x = 22 + k * 172;
    return '<rect x="' + x + '" y="30" width="152" height="140" rx="12" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
      '<rect x="' + x + '" y="30" width="152" height="34" rx="12" fill="' + b[1] + '" stroke="#141a33" stroke-width="2.5"/>' +
      '<text x="' + (x + 76) + '" y="53" text-anchor="middle" ' + F + ' font-size="14" font-weight="700" fill="#141a33">' + b[0] + '</text>' +
      b[2].map(function(t, j){ return '<rect x="' + (x + 16) + '" y="' + (78 + j * 42) + '" width="120" height="32" rx="8" fill="' + b[1] + '" fill-opacity=".35" stroke="#141a33" stroke-width="1.5"/>' +
        '<text x="' + (x + 76) + '" y="' + (99 + j * 42) + '" text-anchor="middle" ' + F + ' font-size="14" fill="#141a33">' + t + '</text>'; }).join("");
  }).join("") + '</svg>';

(window.A2PACKS = window.A2PACKS || {})["signposts"] = {
  a2: true,
  id: "a2-signposts",
  title: "Signposts",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "Headings are signposts. They show a reader where everything is.",
  blurb: "Using headings to group information so a reader can find their way. Four short chunks, then a mini guide page to make at the end.",
  note: "Headings and sections: grouping things so a reader can find them. Four five minute chunks and a mini guide page to make. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Footpath", line: "Footpath: short guides, one heading at a time." },
    { id: "medium", name: "High street", line: "High street: more sections, and headings you write yourself." },
    { id: "spicy", name: "Motorway", line: "Motorway: subheadings, matching styles, and the best order for the reader." }
  ],
  themes: {
    time: { name: "Time travel", w: { place: "the Time Museum", bus: "the number 66 bus", park: "the car park by the clock", cafe: "the Victorian tea room", snack: "a picnic area", see1: "the dinosaur hall", see2: "the Roman soldiers", open: "10am to 4pm", price: "5 pounds" } },
    football: { name: "Football", w: { place: "the stadium tour", bus: "the number 9 bus", park: "the car park by gate C", cafe: "the pie stand", snack: "the fan cafe", see1: "the trophy room", see2: "the changing rooms", open: "10am to 4pm", price: "8 pounds" } },
    horror: { name: "Horror", w: { place: "the haunted hotel", bus: "the late night bus", park: "the car park by the gates", cafe: "the midnight cafe", snack: "a vending machine on floor 13", see1: "the mirror maze", see2: "the old ballroom", open: "6pm to midnight", price: "6 pounds" } },
    fishing: { name: "Fishing", w: { place: "the fishing lake", bus: "the number 12 bus", park: "the car park by the jetty", cafe: "the lakeside cafe", snack: "a picnic bench", see1: "the carp pond", see2: "the boat house", open: "6am to 8pm", price: "10 pounds a day" } },
    music: { name: "Music", w: { place: "the theatre tour", bus: "the number 22 bus", park: "the car park by the stage door", cafe: "the theatre cafe", snack: "an ice cream stall", see1: "the costume room", see2: "the backstage tour", open: "10am to 6pm", price: "7 pounds" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  ez: {
    realWorld: { html: "<p>Menus, websites and game guides all use headings.</p><p>A time travel guide needs one most: <b>Getting home</b>.</p>" },
    make: { intro: "A title and three headings, with a line under each." }
  },
  startFig: POST,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "What a heading does", title: "A heading is a signpost",
      fig: POST_EGG,
      html: "<p>A <b>heading</b> is a short title at the top of a part of a page. It tells the reader what that part is about.</p>" +
        "<p>Like a signpost on a path, it points the way. Want to know about food? Look for the <b>Food</b> heading. No need to read everything else first.</p>",
      ez: { html: "<p>A <b>heading</b> is a short title. It says what that part is about.</p><p>Like a <b>signpost</b>, it points the way.</p>" } },

    { type: "learn", topic: "What a heading does", title: "Same words, easier to find",
      fig: BEFORE_AFTER,
      html: "<p>On the left, everything is in one big lump. Finding the bit about food means reading it all.</p>" +
        "<p>On the right, the same words are split into <b>sections</b>, each with a heading. Your eyes jump straight to the part you need.</p>",
      ez: { html: "<p>Left: one big lump. Right: <b>sections</b> with headings.</p><p>Your eyes jump to what you need.</p>" },
      lv: { spicy: { html: "<p>On the left, everything is in one big lump. On the right, the same words are split into <b>sections</b>, each with a heading.</p>" +
        "<p>Readers <b>scan</b> before they read. Headings let them skip straight to what they need, and they show how the whole text is organised at a glance. That is why guides, websites and leaflets use them.</p>" } } },

    { type: "mc", topic: "What a heading does",
      q: "Read this part of a guide. Which heading fits it best?" + '<p class="a2task">You can get a hot dinner at [[cafe]]. There is also [[snack]].</p>',
      options: ["Food", "Getting there", "Things to see"],
      answer: 0,
      slips: { 1: "This part is not about how to get there. Look for what you can do there.", 2: "Nothing here is about things to look at. What can you get?" },
      hint: "What is every sentence about?",
      why: "Both sentences are about eating, so <b>Food</b> is the signpost that fits.",
      ez: { q: "Which heading fits?" + '<p class="a2task">You can get a hot dinner at [[cafe]]. There is also [[snack]].</p>', slips: { 1: "It is not about getting there.", 2: "Nothing here is to look at." },
        why: "Both are about eating: <b>Food</b>." },
      lv: { medium: { q: "Read this part of a guide. Which heading fits it best?" + '<p class="a2task">Take [[bus]] from the town centre. If you drive, use [[park]]. It takes about 20 minutes either way.</p>',
          options: ["Getting there", "Food", "Opening times"],
          slips: { 1: "Nothing here is about eating.", 2: "There is a time in it, but it is how long the trip takes, not when it opens." },
          hint: "What is every sentence about? Buses, cars, how long...",
          why: "Bus, car park, how long it takes: it is all about <b>Getting there</b>." },
        spicy: { q: "Read this part of a guide. Which heading fits it best?" + '<p class="a2task">Steps lead down to [[see1]], but there is a lift by the main door. Wheelchairs can be borrowed for free from the front desk.</p>',
          options: ["Access", "Things to see", "Prices"],
          slips: { 1: "[[See1]] is mentioned, but the section is really about getting around if steps are hard.", 2: "Free is mentioned, but the whole section is not about what things cost." },
          hint: "Ignore single words. What is the whole section for?",
          why: "Lifts, steps and wheelchairs are all about getting in and around. <b>Access</b> covers the whole section." } } },

    { type: "mc", topic: "What a heading does",
      q: "Which of these is a heading?",
      options: ["Opening times", "We open at 10 in the morning and close at 4 in the afternoon every day.", "and then we went home"],
      answer: 0,
      slips: { 1: "That is a full sentence with all the details. A heading is short.", 2: "That is part of a sentence from a story, not a signpost." },
      hint: "Headings are short and tell you what the section is about.",
      why: "<b>Opening times</b> is short and names what the section is about. That is a heading.",
      ez: { slips: { 1: "That is a full sentence. Headings are short.", 2: "That is part of a story." }, hint: "Headings are short.", why: "<b>Opening times</b> is short and clear." },
      lv: { spicy: { q: "Which is the most useful heading for a section about tickets and what they cost?",
        options: ["Prices", "Some information you might find interesting", "Read this"],
        slips: { 1: "It is long and vague. A reader could not tell what the section is about.", 2: "It does not say what the section is about at all." },
        why: "<b>Prices</b> is short and tells the reader exactly what they will find there." } } },

    { type: "match", topic: "What a heading does",
      q: "Match each heading to the line that belongs under it.",
      pairs: [["Getting there", "Take [[bus]]."], ["Food", "Try [[cafe]]."], ["Things to see", "Visit [[see1]]."]],
      slips: { any: "Read each line and ask: is it about travel, eating or looking?" },
      hint: "Take a bus: travel. Try a cafe: eating. Visit a room: looking.",
      why: "Each line sits under the signpost that matches what it is about.",
      ez: { q: "Match each heading to its line.", slips: { any: "Is it travel, eating or looking?" }, hint: "Bus: travel. Cafe: eating. Visit: looking.", why: "Each line goes under the heading that fits." },
      lv: { medium: { pairs: [["Getting there", "Take [[bus]]."], ["Food", "Try [[cafe]]."], ["Things to see", "Visit [[see1]]."], ["Opening times", "We are open [[open]]."]] },
        spicy: { pairs: [["Getting there", "Take [[bus]]."], ["Food", "Try [[cafe]]."], ["Things to see", "Visit [[see1]]."], ["Opening times", "We are open [[open]]."], ["Prices", "Entry costs [[price]]."]] } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Group it", title: "Things that go together, stay together",
      fig: GROUPS,
      html: "<p>Before you write headings, <b>group</b> your information. Put everything about getting there in one pile, everything about food in another.</p>" +
        "<p>Each pile becomes a <b>section</b>, and each section gets a heading.</p>",
      ez: { html: "<p><b>Group</b> the things that go together.</p><p>Each group gets a heading.</p>" } },

    { type: "sort", topic: "Group it",
      q: "Sort these into the right section.",
      buckets: ["Getting there", "Food"],
      cards: [["Take [[bus]].", 0], ["Park in [[park]].", 0], ["Have lunch at [[cafe]].", 1], ["There is [[snack]].", 1]],
      slips: { any: "Ask of each card: is it about travelling, or about eating?" },
      hint: "Travelling or eating?",
      why: "Buses and parking help you get there. Lunch and snacks are food.",
      ez: { slips: { any: "Is it travelling, or eating?" }, why: "Bus and parking: getting there. Lunch and snacks: food." },
      lv: { medium: { buckets: ["Getting there", "Food", "Things to see"],
          cards: [["Take [[bus]].", 0], ["Park in [[park]].", 0], ["Have lunch at [[cafe]].", 1], ["There is [[snack]].", 1], ["Do not miss [[see1]].", 2], ["Then head to [[see2]].", 2]] },
        spicy: { buckets: ["Getting there", "Food", "Things to see", "Prices"],
          cards: [["Take [[bus]].", 0], ["Park in [[park]].", 0], ["Have lunch at [[cafe]].", 1], ["Do not miss [[see1]].", 2], ["Entry costs [[price]].", 3], ["Under fives get in free.", 3], ["The bus is free with your ticket.", 0]],
          why: "Careful with the last one: it mentions free and ticket, but it is really about the bus, so it lives in Getting there." } } },

    { type: "mc", topic: "Group it",
      q: "Odd one out. Which line is in the wrong section?" + leaflet("[[Place]]", [["Food", ["Have lunch at [[cafe]].", "Take [[bus]].", "There is [[snack]]."]]]),
      options: ["Have lunch at [[cafe]].", "Take [[bus]].", "There is [[snack]]."],
      answer: 1, fixed: true,
      slips: { 0: "Lunch is food, so that one is in the right place.", 2: "A snack is food too. Look for the one about travel." },
      hint: "Which one is not about eating?",
      why: "Taking the bus is about getting there. It belongs in a different section.",
      ez: { q: "Which line is in the wrong section?" + leaflet("[[Place]]", [["Food", ["Have lunch at [[cafe]].", "Take [[bus]].", "There is [[snack]]."]]]), slips: { 0: "Lunch is food.", 2: "A snack is food too." },
        why: "The bus is about <b>getting there</b>." },
      lv: { spicy: { q: "Odd one out. Which line is in the wrong section?" + leaflet("[[Place]]", [["Things to see", ["Start at [[see1]].", "Then try [[see2]].", "Entry costs [[price]]."]]]),
        options: ["Start at [[see1]].", "Then try [[see2]].", "Entry costs [[price]]."],
        answer: 2,
        slips: { 0: "That one is a thing to see.", 1: "That is another thing to see." },
        why: "The price is not a thing to see. It belongs under a <b>Prices</b> heading." } } },

    { type: "multi", topic: "Group it", explain: true,
      q: "Pick the <b>two</b> lines that belong under <b>Things to see</b>.",
      options: ["Visit [[see1]].", "Do not miss [[see2]].", "Take [[bus]].", "Have lunch at [[cafe]]."],
      answers: [0, 1],
      hint: "Which two are about looking at something?",
      why: "[[See1]] and [[see2]] are both things to see. The bus is getting there, and lunch is food.",
      ez: { q: "Pick <b>two</b> lines for <b>Things to see</b>.", hint: "Which two are things to look at?", why: "[[See1]] and [[see2]]. Things to look at." },
      lv: { spicy: { q: "Pick <b>all</b> the lines that belong under <b>Things to see</b>.",
        options: ["Visit [[see1]].", "Do not miss [[see2]].", "Look out for the giant clock in the hall.", "Take [[bus]].", "Have lunch at [[cafe]].", "We are open [[open]]."],
        answers: [0, 1, 2],
        why: "Three things to look at. The others belong under Getting there, Food and Opening times." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Good headings", title: "What makes a good heading?",
      fig: '<svg viewBox="0 0 520 190" role="img" aria-label="Good heading: short and clear. Not so good: long and vague">' +
        '<rect width="520" height="190" rx="16" fill="#f4f1ea"/>' +
        '<rect x="24" y="30" width="210" height="44" rx="8" fill="#2f6fb0"/><text x="40" y="59" ' + F + ' font-size="18" font-weight="700" fill="#fff">Food</text>' +
        '<circle cx="270" cy="52" r="18" fill="#19c39a"/><path d="M261 52l6 7 12 -14" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '<text x="300" y="58" ' + F + ' font-size="15" fill="#141a33">Short. Says what it is.</text>' +
        '<rect x="24" y="106" width="210" height="58" rx="8" fill="#9aa3b5"/><text x="34" y="130" ' + F + ' font-size="13" fill="#fff">Some stuff that you</text><text x="34" y="150" ' + F + ' font-size="13" fill="#fff">might want later on</text>' +
        '<circle cx="270" cy="135" r="18" fill="#f2b705"/><text x="270" y="142" text-anchor="middle" ' + F + ' font-size="20" font-weight="700" fill="#fff">?</text>' +
        '<text x="300" y="141" ' + F + ' font-size="15" fill="#141a33">Long. Says nothing.</text></svg>',
      html: "<p>A good heading is <b>short</b> (often one to four words) and <b>clear</b>: it names exactly what the section is about.</p>" +
        "<p>It usually starts with a capital letter and has no full stop.</p>",
      ez: { html: "<p>A good heading is <b>short</b> and <b>clear</b>.</p><p>It says what the part is about.</p>" },
      lv: { spicy: { html: "<p>A good heading is <b>short</b> and <b>clear</b>: it names exactly what the section is about.</p>" +
        "<p>Good guides also keep headings <b>matching</b> in style. All short names (Food, Prices, Getting there), or all questions (Where can I eat? How much is it?). Mixing styles looks messy.</p>" +
        "<p>A big section can have <b>subheadings</b> inside it, like smaller signs off the main road: under Food, you might have Cafe and Picnics.</p>" } } },

    { type: "mc", topic: "Good headings",
      q: "Which heading is clearest for a section about what time it opens?",
      options: ["Opening times", "Some times", "A section with lots of information about what time things happen"],
      answer: 0,
      slips: { 1: "Some times of what? A reader would not know.", 2: "Far too long. A heading should be quick to read." },
      hint: "Short, and says exactly what it is.",
      why: "<b>Opening times</b> is short and tells you exactly what is there.",
      ez: { q: "Which heading is best for when it opens?", slips: { 1: "Some times of what?", 2: "Far too long." }, why: "<b>Opening times</b>. Short and clear." },
      lv: { spicy: { q: "These headings are on one page: <b>Where is it? How do I get there?</b> and one more. Which one matches best?",
        options: ["What can I eat?", "Food", "food stuff and snacks."],
        slips: { 1: "Food is a fine heading on its own, but the others are questions. Keep the style matching.", 2: "Lower case, a full stop, and a different style. Not a match." },
        hint: "Look at the style of the other two headings.",
        why: "The other headings are questions, so a question matches: <b>What can I eat?</b>" } } },

    { type: "text", topic: "Good headings",
      q: "Write a heading for this section." + '<p class="a2task">Do not miss [[see1]]. After that, have a look at [[see2]].</p>',
      need: [["see", "visit", "look", "explore", "highlights", "sights", "what to", "must", "do", "rooms", "tour", "best bits", "attractions", "don't miss", "dont miss", "not to miss"]],
      model: "Things to see",
      slips: [[["food", "eat", "lunch"], "That would be a food section. This one is about things you look at."], [["bus", "getting there", "travel"], "That is how you get there. This section is about what you find once you arrive."]],
      hint: "What are both sentences about? Places to look at.",
      why: "<b>Things to see</b> or <b>What to visit</b> both work. They say what the section is about in a few words.",
      ez: { slips: [[null, "That is a food heading. This is about looking."], [null, "That is getting there. This is what you find."]], hint: "Both are places to look at.", why: "<b>Things to see</b> works. Short and clear." },
      lv: { spicy: {
        q: "Write a subheading for this part of the Food section. Match the style of the other subheading, which is <b>Where can I get a hot meal?</b>" + '<p class="a2task">You are welcome to bring your own lunch. There are benches near [[see2]], and bins on every path.</p>',
        need: [["?"], ["picnic", "own", "lunch", "bring", "packed", "eat", "food", "bench"]],
        model: "Can I bring a picnic?",
        slips: [[["picnics"], "Good word, but the other subheading is a question. Can you make it match?"]],
        hint: "Make it a question, ending in a question mark.",
        why: "<b>Can I bring a picnic?</b> matches the question style, and names the section clearly." } } },

    { type: "order", topic: "Good headings",
      q: "Put these sections in the order a visitor needs them.",
      items: ["Getting there", "Opening times", "Things to see", "Food"],
      slips: { any: "Think about a visit from start to end: travel, can I get in, what is there, then lunch." },
      hint: "What does a visitor need to know first?",
      why: "First get there, check it is open, see things, then eat. Lots of orders could work; this one follows the visit.",
      ez: { q: "Put them in order for a visitor.", slips: { any: "Think of a visit, start to end." }, why: "Getting there first. Going home last." },
      lv: { mild: { items: ["Getting there", "Things to see", "Going home"], why: "Getting there first, going home last, the visit in the middle." },
        spicy: { items: ["Getting there", "Opening times and prices", "Things to see", "Food", "Going home"],
          why: "It follows the visit: plan the trip, check it is open and what it costs, then the day itself, then home." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Signpost a page", title: "Your turn to be the guide",
      fig: leaflet("[[Place]]", [["Getting there", ["Take [[bus]]."]], ["Food", ["Try [[cafe]]."]], ["Things to see", ["Visit [[see1]]."]]]),
      html: "<p>Last chunk. You are making a guide page for [[place]]. Pick a heading for each section and watch the page sort itself out.</p>",
      ez: { html: "<p>Now make a guide page for [[place]].</p>" } },

    { type: "widget", topic: "Signpost a page", unscored: true,
      title: "Pick the signposts",
      html: "<p>Pick a heading for each section. If you like, change your mind and see what happens to the page.</p>",
      ez: { html: "<p>Pick a heading for each part.</p>" },
      mount: function(el, api){
        var d = api.data;
        d.pick = d.pick || {};
        var spicy = api.level === "spicy", mild = api.level === "mild";
        var secs = [
          { lines: [api.tok("Take [[bus]]."), api.tok("Or park in [[park]].")], right: "Getting there" },
          { lines: [api.tok("Have lunch at [[cafe]]."), api.tok("There is also [[snack]].")], right: "Food" },
          { lines: [api.tok("Start at [[see1]]."), api.tok("Then visit [[see2]].")], right: "Things to see" }
        ];
        if(!mild) secs.push({ lines: [api.tok("Open [[open]]."), api.tok("Entry costs [[price]].")], right: "Times and prices" });
        var choices = secs.map(function(s){ return s.right; }).concat(spicy ? ["Stuff", "Read this bit"] : ["Stuff"]);
        function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
        el.innerHTML = '<div class="sp-picks" style="display:grid;gap:8px;margin:6px 0 12px"></div><div class="sp-page"></div><p class="tiny sp-msg"></p>';
        var picks = el.querySelector(".sp-picks"), pageEl = el.querySelector(".sp-page"), msg = el.querySelector(".sp-msg");
        secs.forEach(function(s, k){
          var lab = document.createElement("label");
          lab.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-weight:700";
          var sel = document.createElement("select");
          sel.style.cssText = "font:inherit;padding:6px 8px;border-radius:8px;border:2px solid #141a33";
          sel.innerHTML = '<option value="">Pick a heading</option>' + choices.map(function(c){ return '<option>' + esc(c) + '</option>'; }).join("");
          sel.value = d.pick[k] || "";
          sel.onchange = function(){ d.pick[k] = sel.value; api.save(); draw(); };
          lab.appendChild(document.createTextNode("Section " + (k + 1) + ": " + s.lines[0] + " "));
          lab.appendChild(sel);
          picks.appendChild(lab);
        });
        function draw(){
          var y = 70, out = "";
          secs.forEach(function(s, k){
            var hd = d.pick[k];
            if(hd){ out += '<rect x="24" y="' + (y - 18) + '" width="472" height="26" rx="6" fill="#2f6fb0"/><text x="36" y="' + y + '" font-family="Verdana,Arial,sans-serif" font-size="15" font-weight="700" fill="#fff">' + esc(hd) + '</text>'; y += 28; }
            s.lines.forEach(function(l){ out += '<text x="36" y="' + y + '" font-family="Verdana,Arial,sans-serif" font-size="14" fill="#141a33">' + esc(l) + '</text>'; y += 21; });
            y += 12;
          });
          pageEl.innerHTML = '<svg viewBox="0 0 520 ' + (y + 6) + '" role="img" aria-label="Your guide page"><rect x="4" y="4" width="512" height="' + (y - 2) + '" rx="12" fill="#fffdf6" stroke="#141a33" stroke-width="2.5"/>' +
            '<text x="24" y="38" font-family="Verdana,Arial,sans-serif" font-size="19" font-weight="700" fill="#141a33">' + esc(api.tok("[[Place]]")) + '</text>' + out + '</svg>';
          var n = secs.filter(function(s, k){ return d.pick[k]; }).length;
          var fit = secs.filter(function(s, k){ return d.pick[k] === s.right; }).length;
          if(n < secs.length) msg.textContent = n ? "Nice. Keep going if you fancy it." : "";
          else if(fit === secs.length) msg.textContent = "Every section has a clear signpost. A reader could find anything on this page in a second.";
          else msg.textContent = "Every section has a heading. Have a look: does each one say what is underneath it? Swap any you like.";
          if(n) api.done("done");
        }
        draw();
      },
      report: function(d){ return d && d.pick ? "headings picked: " + Object.keys(d.pick).map(function(k){ return d.pick[k] || "-"; }).join(", ") : ""; } },

    { type: "mc", topic: "Signpost a page",
      q: "Jay made a guide to the park for Bonnie. Which heading is missing?" + leaflet("Bonnie's park guide", [["Best sticks", ["By the big oak tree."]], [null, ["The water bowl is by the gate.", "Biscuits are in Jay's pocket."]]]),
      options: ["Snacks and drinks", "Best sticks", "Getting there"],
      answer: 0,
      slips: { 1: "That heading is already used, and the second section is not about sticks.", 2: "Nothing in that section is about how to get to the park." },
      hint: "What are the water bowl and the biscuits for?",
      why: "Water and biscuits: <b>Snacks and drinks</b>. Bonnie would read that section first.",
      ez: { q: "Jay made Bonnie a park guide. Which heading is missing?" + leaflet("Bonnie's park guide", [["Best sticks", ["By the big oak tree."]], [null, ["The water bowl is by the gate.", "Biscuits are in Jay's pocket."]]]),
        slips: { 1: "That one is used already.", 2: "Nothing here is about getting there." }, hint: "What are the water and biscuits for?", why: "<b>Snacks and drinks</b>. Bonnie would read it first!" } },

    { type: "write", topic: "Signpost a page", stretch: true,
      q: "If you like, have a go at a mini guide to a place you know: your room, Base 5, a park. Give it a title and two or three headings, with a line or two under each.",
      starters: ["Getting there", "Things to see", "Food", "Top tip", "Opening times"],
      checklist: ["I have a title", "Each section has a heading", "Each line is under the right heading"],
      minWords: 25,
      ez: { q: "Only if you like: make a mini guide. A title, and 2 or 3 headings." } }
  ],

  realWorld: {
    title: "Signposts are everywhere",
    html: "<p>Menus, websites, timetables, game guides and leaflets all use headings so people can find things fast. Nobody reads a whole menu just to find the puddings.</p>" +
      "<p>For our big question: a guide for time travellers would need clear signposts too. Getting there, what to see, and the most important section of all: <b>Getting home</b>.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A portal with a signpost pointing home">' + A2ART.portal(90, 75, 58) +
      '<rect x="250" y="40" width="12" height="100" fill="#8a5a36"/><rect x="200" y="44" width="150" height="34" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/>' +
      '<path d="M350 44l20 17 -20 17z" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/>' +
      '<text x="275" y="67" text-anchor="middle" ' + F + ' font-size="15" font-weight="700" fill="#141a33">Getting home</text></svg>'
  },

  make: {
    title: "Make a mini guide page",
    intro: "A title and three signposts, with a line under each. Put it on the wall or send it to Jay.",
    fields: [
      { id: "title", label: "Guide title", ph: "A guide to Base 5", max: 32 },
      { id: "h1", label: "Heading 1", ph: "Getting there", max: 22 },
      { id: "l1", label: "Line under heading 1", ph: "Up the stairs, first door on the left.", max: 60 },
      { id: "h2", label: "Heading 2", ph: "Things to see", max: 22 },
      { id: "l2", label: "Line under heading 2", ph: "The bird poster on the wall.", max: 60 },
      { id: "h3", label: "Heading 3", ph: "Top tip", max: 22 },
      { id: "l3", label: "Line under heading 3", ph: "Ask Jay about birds. Or do not.", max: 60 }
    ],
    svg: function(v){
      function e(t){ return String(t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n, m){ var w = String(t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n){ if(cur.trim()) out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, m); }
      var cols = ["#ffd23f", "#ff8fb1", "#7fd9f0"], y = 120, body = "";
      [["h1", "l1"], ["h2", "l2"], ["h3", "l3"]].forEach(function(p, k){
        body += '<rect x="40" y="' + y + '" width="520" height="36" rx="8" fill="' + cols[k] + '" stroke="#141a33" stroke-width="2.5"/>' +
          '<text x="56" y="' + (y + 25) + '" font-family="Verdana,Arial,sans-serif" font-size="19" font-weight="700" fill="#141a33">' + e(v[p[0]]) + '</text>';
        y += 60;
        wrap(v[p[1]], 46, 2).forEach(function(l){ body += '<text x="56" y="' + y + '" font-family="Verdana,Arial,sans-serif" font-size="17" fill="#141a33">' + e(l) + '</text>'; y += 24; });
        y += 14;
      });
      var t = wrap(v.title, 30, 2);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 ' + (y + 30) + '">' +
        '<rect width="600" height="' + (y + 30) + '" rx="24" fill="#fffdf6"/>' +
        '<rect x="14" y="14" width="572" height="' + (y + 2) + '" rx="18" fill="none" stroke="#2f6fb0" stroke-width="5"/>' +
        t.map(function(l, k){ return '<text x="40" y="' + (t.length > 1 ? 56 + k * 32 : 70) + '" font-family="Verdana,Arial,sans-serif" font-size="28" font-weight="700" fill="#141a33">' + e(l) + '</text>'; }).join("") +
        '</svg>';
    }
  }
};
})();
