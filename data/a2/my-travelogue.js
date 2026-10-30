/* Base 5 Autumn 2 activity: My travelogue.
   English. Planning and writing a travelogue: first person, stops in
   a logical order, time words, then a short write sent to Jay.
   ASCII only. */
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

/* a winding route with four numbered stops */
function route(labels, extra){
  var pts = [[70, 150], [190, 80], [320, 150], [450, 80]];
  var s = '<svg viewBox="0 0 520 230" role="img" aria-label="A journey on a map with four stops in order: ' + labels.join(", ") + '">' +
    '<rect width="520" height="230" rx="16" fill="#dff2d8"/>' +
    '<path d="M0 200q80 -30 160 0t180 0t180 0v30h-520z" fill="#b9e0a8"/>' +
    '<path d="M30 40q20 -16 40 0M380 190q16 -12 32 0" fill="none" stroke="#3d7a3a" stroke-width="3"/>' +
    '<path d="M70 150C120 150 140 80 190 80S270 150 320 150S400 80 450 80" fill="none" stroke="#8a4b1f" stroke-width="4" stroke-dasharray="10 8" stroke-linecap="round"/>';
  pts.forEach(function(p, k){
    s += '<path d="M' + p[0] + ' ' + p[1] + 'c-16 -18 -16 -40 0 -40s16 22 0 40z" fill="' + ["#e04848", "#ff8a5c", "#8a5cf6", "#19a07c"][k] + '" stroke="#141a33" stroke-width="2"/>' +
      '<circle cx="' + p[0] + '" cy="' + (p[1] - 24) + '" r="9" fill="#ffffff"/>' + T(p[0], p[1] - 19, String(k + 1), 13, { a: "middle", b: 1 }) +
      '<rect x="' + (p[0] - 56) + '" y="' + (p[1] + 10) + '" width="112" height="26" rx="13" fill="#ffffff" stroke="#141a33" stroke-width="1.5"/>' +
      T(p[0], p[1] + 28, labels[k], 13, { a: "middle", b: 1 });
  });
  return s + (extra || "") + '</svg>';
}
var ROUTE = route(["Set off", "Stop 1", "Stop 2", "Home"], A2ART.egg(A2ART.bird(470, 180, 0.7, "#3a8fd6"), "A bird on its own journey. Some birds fly thousands of miles every year. Jay would read that travelogue."));
var TIMEROUTE = route(["First,", "Next,", "After that,", "Finally,"]);

/* first person and third person */
var PEOPLE = '<svg viewBox="0 0 520 210" role="img" aria-label="Jay says: When I was in China. That is first person. A caption under Bonnie says: Bonnie went to the park. That is third person.">' +
  '<rect width="520" height="210" rx="16" fill="#f4f1ea"/>' +
  A2ART.jay(80, 70, 0.8, "smile") + A2ART.bubble(126, 18, 128, 54, "When I was\nin China...", 136) +
  T(130, 194, "First person: I", 15, { a: "middle", b: 1, c: "#19a07c" }) +
  '<path d="M262 24v170" stroke="#141a33" stroke-opacity=".2" stroke-width="2"/>' +
  A2ART.egg(A2ART.bonnie(330, 104, 0.95, "stand"), "Bonnie's travelogue. Day 1: sniffed a lamp post. Day 2: sniffed the same lamp post. Five stars.") +
  '<rect x="390" y="64" width="116" height="52" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' + T(400, 86, "Bonnie went", 13) + T(400, 104, "to the park.", 13) +
  T(390, 194, "Third person: she", 15, { a: "middle", b: 1, c: "#8a5cf6" }) + '</svg>';

/* a plan: where, how, three stops, the end */
var PLAN = '<svg viewBox="0 0 540 200" role="img" aria-label="A travelogue plan: where and how, stop 1, stop 2, stop 3, the end">' +
  '<rect width="540" height="200" rx="16" fill="#f4f1ea"/>' +
  [["Where", "and how?", "#ffd23f"], ["Stop 1", "saw, felt", "#ff8a5c"], ["Stop 2", "saw, felt", "#22b8e6"], ["Stop 3", "saw, felt", "#8a5cf6"], ["The end", "home", "#19c39a"]].map(function(b, k){
    var x = 18 + k * 104;
    return '<rect x="' + x + '" y="50" width="88" height="96" rx="12" fill="' + b[2] + '" fill-opacity=".35" stroke="#141a33" stroke-width="2"/>' +
      T(x + 44, 90, b[0], 15, { a: "middle", b: 1 }) + T(x + 44, 114, b[1], 13, { a: "middle", c: "#3a4060" }) +
      (k < 4 ? '<path d="M' + (x + 90) + ' 98h12M' + (x + 96) + ' 92l6 6 -6 6" fill="none" stroke="#141a33" stroke-width="2.5"/>' : "");
  }).join("") +
  T(270, 34, "My travelogue plan", 16, { a: "middle", b: 1 }) + T(270, 178, "One stop, one paragraph, in the order it happened.", 13, { a: "middle", c: "#3a4060" }) + '</svg>';

/* the route planner */
var BOXES = [["where", "Where did you go?", "Roman London"], ["how", "How did you get there?", "In the time machine"], ["s1", "Stop 1: what did you see or feel?", "A noisy market"],
  ["s2", "Stop 2", "A steamy bath house"], ["s3", "Stop 3", "Soldiers on the bridge"], ["end", "How did it end?", "Home for tea, very tired"]];
function planWidget(el, api){
  var d = api.data || {};
  el.innerHTML = '<div class="a2task"><h4>Route planner</h4><p>A real trip, a made up one, or a journey through time. Short notes are perfect: this is a plan, not the writing.</p><div class="pl" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-top:8px"></div></div>';
  var host = el.querySelector(".pl");
  BOXES.forEach(function(b){
    var lab = document.createElement("label");
    lab.style.cssText = "display:flex;flex-direction:column;gap:4px;font-weight:700;font-size:.95rem";
    lab.appendChild(document.createTextNode(b[1]));
    var inp = document.createElement("input");
    inp.type = "text"; inp.maxLength = 60; inp.placeholder = b[2];
    inp.style.cssText = "font:inherit;font-weight:400;padding:8px;border-radius:10px;border:2px solid #141a33;background:#fffdf8";
    inp.value = d[b[0]] || "";
    inp.oninput = function(){
      d[b[0]] = inp.value; try{ api.save(); }catch(e){}
      var n = BOXES.filter(function(x){ return d[x[0]] && String(d[x[0]]).trim(); }).length;
      if(n >= 2) api.done("done");
    };
    lab.appendChild(inp); host.appendChild(lab);
  });
}

(window.A2PACKS = window.A2PACKS || {})["my-travelogue"] = {
  a2: true,
  id: "a2-my-travelogue",
  title: "My travelogue",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "A travelogue tells the story of a journey: written as I, in the order it happened.",
  blurb: "Writing a travelogue: the story of a journey, told as I or we, with the stops in order so a reader can follow along. Four short chunks, a route planner, your own travelogue to send to Jay if you like, and a postcard to make at the end.",
  note: "Planning and writing a travelogue: a real trip or a journey through time. Four five minute chunks, ending with your own short travelogue, whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Day trip", line: "Day trip: short sentences, one stop at a time." },
    { id: "medium", name: "Road trip", line: "Road trip: longer pieces, time words and a paragraph for each stop." },
    { id: "spicy", name: "Grand tour", line: "Grand tour: varied openers, keeping to I and the past, and a full plan." }
  ],
  themes: {
    time: { name: "Time travel", w: { title: "My Day in Roman London", place: "the Roman market",
      t1: "At nine o'clock I stepped into the time machine and pressed the big red button.", t2: "First, I landed in a busy Roman market, full of shouting traders.",
      t3: "Next, I visited the bath house, which smelled of smoke and oil.", t4: "After lunch, I watched soldiers marching across the wooden bridge.",
      t5: "Finally, I raced back to the time machine and got home just in time for tea.",
      a1: "Set off in the time machine", a2: "The Roman market", a3: "The bath house", a4: "Home for tea" } },
    football: { name: "Football", w: { title: "My Away Day", place: "the stadium",
      t1: "At ten o'clock we climbed onto the supporters' coach outside school.", t2: "First, we stopped at a service station, and I bought a pasty.",
      t3: "Next, we arrived at the stadium and found our seats behind the goal.", t4: "In the second half, our striker scored, and I jumped so high I lost my hat.",
      t5: "Finally, we sang all the way home on the coach.",
      a1: "Coach from school", a2: "The service station", a3: "The stadium", a4: "Singing on the way home" } },
    horror: { name: "Horror", w: { title: "My Night at the Old Hospital", place: "the old hospital",
      t1: "At eight o'clock I pushed open the creaky gate of the old hospital.", t2: "First, I crept along a corridor where the lights flickered on and off.",
      t3: "Next, I took the lift to floor 13, which is not supposed to exist.", t4: "At midnight, I met the night porter, who kindly offered me a biscuit.",
      t5: "Finally, I ran all the way home and hid under my duvet.",
      a1: "The creaky gate", a2: "The flickering corridor", a3: "The lift to floor 13", a4: "Home under the duvet" } },
    fishing: { name: "Fishing", w: { title: "My Trip to the Lake", place: "the lake",
      t1: "At six o'clock we loaded the rods into the car and set off.", t2: "First, we stopped at the bait shop for a tub of maggots.",
      t3: "Next, we set up on the bank next to the old boat house.", t4: "At lunchtime, I caught a carp that was nearly as long as my arm.",
      t5: "Finally, we packed up as the sun went down and drove home.",
      a1: "Set off in the car", a2: "The bait shop", a3: "The bank by the boat house", a4: "Drive home at sunset" } },
    music: { name: "Music", w: { title: "My Trip to the West End", place: "the theatre",
      t1: "At nine o'clock I caught the train to London with my aunt.", t2: "First, we walked through the busy streets to the theatre.",
      t3: "Next, we found our seats right up in the top balcony.", t4: "In the interval, I bought an ice cream that cost almost as much as my ticket.",
      t5: "Finally, we waited at the stage door and got a signature.",
      a1: "Train to London", a2: "Walk to the theatre", a3: "Seats in the balcony", a4: "The stage door" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: ROUTE,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "What is a travelogue?", title: "A travelogue tells a journey",
      ez: { html: "<p>A <b>travelogue</b> tells the story of a journey.</p><p class=\"a2task\"><b>[[Title]]</b><br>[[T1]] [[T2]] [[T3]] [[T4]] [[T5]]</p><p>It uses <b>I</b> or <b>we</b>, in order.</p>" },
      fig: ROUTE,
      html: "<p>A <b>travelogue</b> tells the story of a journey. Here is a short one.</p>" +
        "<p class=\"a2task\"><b>[[Title]]</b><br>[[T1]] [[T2]] [[T3]] [[T4]] [[T5]]</p>" +
        "<p>It is written as <b>I</b> or <b>we</b>. The stops are <b>in the order they happened</b>, so you can follow the journey.</p>",
      lv: {
        medium: { html: "<p>A <b>travelogue</b> tells the story of a journey. Here is a short one.</p>" +
          "<p class=\"a2task\"><b>[[Title]]</b><br>[[T1]]<br>[[T2]]<br>[[T3]]<br>[[T4]]<br>[[T5]]</p>" +
          "<p>Three things make it a travelogue. It is written as <b>I</b> or <b>we</b>. It goes <b>in the order things happened</b>, with time words like First, Next and Finally. And it tells you what the writer <b>saw and felt</b> at each stop.</p>" },
        spicy: { html: "<p>A <b>travelogue</b> takes a reader on a journey they were not on.</p>" +
          "<p class=\"a2task\"><b>[[Title]]</b><br>[[T1]]<br>[[T2]]<br>[[T3]]<br>[[T4]]<br>[[T5]]</p>" +
          "<p>It works because it is <b>first person</b> (we see through the writer's eyes), <b>in a logical order</b> (so we can follow the route), and full of <b>detail and reaction</b>: what the writer saw, heard and smelled, and how they felt about it. Notice the smell in one stop and the surprise in another. Those are what make a reader feel they were there.</p>" } } },

    { type: "mc", topic: "What is a travelogue?",
      q: "Which of these is from a travelogue?",
      options: ["[[T3]]", "Turn left at the gate and walk for five minutes.", "Visit today! Tickets only 5 pounds!", "Mix the flour and the eggs in a bowl."],
      answer: 0,
      slips: { 1: "That tells you what to do. It is an instruction.", 2: "That is trying to sell you something. It is an advert.", 3: "That is a recipe step. It tells you what to do." },
      hint: "Which one tells what happened to the writer?",
      why: "It tells what happened on a journey, and it uses I or we.",
      ez: { why: "It tells a journey, with I or we.", slips: { 1: "That is an instruction.", 2: "That is an advert.", 3: "That is a recipe." } } },

    { type: "multi", topic: "What is a travelogue?",
      q: "Pick <b>all</b> the things a travelogue has.",
      options: ["Written as I or we", "Things in the order they happened", "What the writer saw and felt", "A list of ingredients", "Numbered instructions"],
      answers: [0, 1, 2],
      slips: { any: "Three are right. Ingredients and instructions belong to recipes and how to guides." },
      hint: "Ingredients and instructions belong somewhere else.",
      why: "I or we, the right order, and what the writer saw and felt.",
      ez: { slips: { any: "2 are right. Ingredients are for recipes." } },
      lv: { mild: { options: ["Written as I or we", "Things in the order they happened", "A list of ingredients"], answers: [0, 1],
        slips: { any: "Two are right. Ingredients belong in a recipe." },
        why: "I or we, and the right order. Ingredients belong in a recipe." } } },

    { type: "mc", topic: "What is a travelogue?",
      q: "In the travelogue, who is <b>I</b>?",
      options: ["The writer, who went on the journey", "The reader", "Someone the writer read about"],
      answer: 0,
      slips: { 1: "The reader was not there. That is why they are reading about it.", 2: "A travelogue is about the writer's own journey." },
      hint: "Who went on the trip?",
      why: "I is the writer. A travelogue is their own journey, told by them.",
      ez: { why: "<b>I</b> is the writer.", slips: { 1: "The reader was not there." } },
      lv: { spicy: { q: "Why is a travelogue told in the order things happened?",
        options: ["So the reader can follow the journey", "Because it makes it shorter", "So that it rhymes", "Because the best part must come first"],
        slips: { 1: "The order does not change the length.", 2: "Travelogues do not need to rhyme.", 3: "The best part can come anywhere. The order is about following the route." },
        hint: "Think about the reader who was not there.",
        why: "The reader was not there, so the order is their map. Jump about and they get lost." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Writing as me", title: "First person: I, me, my, we",
      fig: PEOPLE,
      ez: { title: "First person", html: "<p><b>First person</b> words: I, me, my, we.</p><p>Jay's favourite: <b>\"When I was in China...\"</b></p>" },
      html: "<p>Travelogues are written in the <b>first person</b>: the writer talks about themselves.</p>" +
        "<p>First person words: <b>I, me, my, we, us, our</b>.</p>" +
        "<p>Jay's favourite first person sentence starts: <b>\"When I was in China...\"</b> You may have heard it once or twice.</p>" +
        "<p>To turn a sentence into first person, swap the person: \"<b>He</b> walked into [[place]]\" becomes \"<b>I</b> walked into [[place]]\".</p>",
      lv: { spicy: { html: "<p>Travelogues are written in the <b>first person</b> (I, me, my, we, us, our), and usually in the <b>past tense</b>, because the journey has already happened.</p>" +
        "<p>Jay's favourite first person past tense sentence starts: <b>\"When I was in China...\"</b></p>" +
        "<p>The trick is keeping both steady all the way through. \"I walked into [[place]] and I <b>feel</b> nervous\" slips into the present. \"I walked into [[place]] and <b>he</b> felt nervous\" slips out of first person. Both jolt the reader.</p>" } } },

    { type: "sort", topic: "Writing as me",
      q: "Sort them: first person or not?",
      buckets: ["First person (I, we, my)", "Not first person"],
      cards: [["I caught the train.", 0], ["We found our seats.", 0], ["She bought a ticket.", 1], ["They got lost.", 1]],
      slips: { any: "Look for I, we, my or our." },
      hint: "Look for I, we, my or our.",
      why: "I and we are first person. She and they are about someone else.",
      lv: {
        medium: { cards: [["I caught the train.", 0], ["We found our seats.", 0], ["My feet ached.", 0], ["She bought a ticket.", 1], ["They got lost.", 1], ["His bag was heavy.", 1]],
          why: "I, we and my are first person. She, they and his are about someone else." },
        spicy: { q: "Sort them: first person past tense, or a slip?",
          buckets: ["First person, past tense", "A slip"],
          cards: [["I caught the train.", 0], ["We found our seats.", 0], ["My feet ached all day.", 0], ["I catch the train.", 1], ["She found our seats.", 1], ["We will get lost.", 1]],
          slips: { any: "Check two things: is it I, we or my, and has it already happened?" },
          hint: "Check two things: who, and when.",
          why: "Caught, found and ached are past, with I, we and my. Catch and will get are not past, and she is not first person." } } },

    { type: "text", topic: "Writing as me",
      q: "Rewrite this in the first person: \"He walked into [[place]].\"",
      need: [["i walked", "we walked"]],
      slips: [[["he walked", "she walked", "they walked"], "Swap he for I. That is all it takes."]],
      model: "I walked into [[place]].",
      hint: "Swap one word.",
      why: "\"I walked into [[place]].\" Swap he for I and you are in the first person.",
      ez: { q: "Rewrite with I: \"He walked into [[place]].\"", why: "\"I walked into [[place]].\" He becomes I.", slips: [[["he walked", "she walked", "they walked"], "Swap he for I."]] },
      lv: {
        medium: { q: "Rewrite this in the first person: \"She bought a ticket. Her seat was near the front.\"",
          need: [["i bought", "we bought"], ["my seat", "our seat"]],
          slips: [[["she bought"], "Swap she for I."], [["her seat"], "Swap her for my."]],
          model: "I bought a ticket. My seat was near the front.",
          hint: "Two words to swap: she and her.",
          why: "\"I bought a ticket. My seat was near the front.\" She becomes I, and her becomes my." },
        spicy: { q: "Rewrite this as first person <b>and</b> past tense: \"They will walk to [[place]] and they will feel nervous.\"",
          need: [["we walked", "i walked"], ["felt"]],
          slips: [[["will"], "Keep it in the past: walked and felt."], [["they"], "Swap they for we."]],
          model: "We walked to [[place]] and we felt nervous.",
          hint: "They becomes we. Will walk becomes walked.",
          why: "\"We walked to [[place]] and we felt nervous.\" First person, and it has already happened." } } },

    { type: "mc", topic: "Writing as me",
      q: "One sentence slips out of the first person. Which one?",
      options: ["He bought a drink.", "I got off the bus.", "We walked to [[place]].", "My feet ached."],
      answer: 0,
      slips: { 1: "That one has I, so it is first person.", 2: "That one has we, so it is first person.", 3: "That one has my, so it is first person." },
      hint: "Look for the one without I, we or my.",
      why: "\"He bought a drink\" is about someone else. In a travelogue it would be \"I bought a drink\".",
      ez: { q: "Which one is not first person?", why: "He is someone else. It should be \"I bought a drink\".", slips: { 1: "That has I.", 2: "That has we.", 3: "That has my." } },
      lv: { spicy: { q: "One sentence slips out of the past tense. Which one?",
        options: ["We walk to [[place]].", "I got off the bus.", "We had lunch by the river.", "My feet ached."],
        slips: { 1: "Got is past.", 2: "Had is past.", 3: "Ached is past." },
        hint: "Which one sounds like it is happening right now?",
        why: "\"We walk\" is present. In the travelogue it should be \"We walked\"." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "In the right order", title: "Time words keep the reader on the route",
      fig: TIMEROUTE,
      ez: { title: "Time words", html: "<p>Tell it <b>in order</b>.</p><p><b>First. Next. Then. Finally.</b></p>" },
      html: "<p>Tell the stops in the order they happened. <b>Time words</b> show the reader where they are on the journey.</p>" +
        "<p><b>First,</b> for the start. <b>Next,</b> <b>Then,</b> and <b>After that,</b> for the middle. <b>Finally,</b> for the end.</p>" +
        "<p>You can use times too: <b>At nine o'clock</b>, <b>At lunchtime</b>, <b>That evening</b>.</p>",
      lv: {
        medium: { html: "<p>Tell the stops in the order they happened, with <b>one paragraph for each stop</b>. Start each paragraph with a <b>time word</b> so the reader knows they have moved on.</p>" +
          "<p class=\"a2task\">[[T1]]<br><br>[[T2]]<br><br>[[T3]]</p>" +
          "<p>Useful time words: First, Next, Then, After that, Later, At lunchtime, That evening, Finally.</p>" },
        spicy: { html: "<p>Keep the order logical, but vary how each part opens, or it starts to sound like a list.</p>" +
          "<p><b>Time openers:</b> By midday, As the sun set. <b>Place openers:</b> Inside the gates, Further along the bank. <b>Feeling openers:</b> Nervously, Still buzzing. <b>Surprise openers:</b> Without warning, Just then.</p>" +
          "<p>A full travelogue usually follows a shape: getting there, first impressions, the best part, something unexpected, heading home and what it meant.</p>" } } },

    { type: "order", topic: "In the right order",
      q: "Put the stops of the journey in order.",
      items: ["[[A1]]", "[[A2]]", "[[A3]]", "[[A4]]"],
      slips: { any: "Where does every journey start, and where does it end?" },
      hint: "Setting off comes first. Home comes last.",
      why: "Setting off comes first, then the stops in the order they happened, then home at the end.",
      ez: { why: "Set off first. Home last." },
      lv: {
        medium: { q: "Put the sentences in order.", items: ["[[T1]]", "[[T2]]", "[[T3]]", "[[T4]]", "[[T5]]"],
          hint: "Look at the time words and the clock times.",
          why: "The time words and times show the order: setting off, First, Next, a later time, Finally." },
        spicy: { q: "Put the paragraph plan for a longer travelogue in a logical order.",
          items: ["Getting there", "First impressions", "The best part", "Something unexpected", "Heading home, and what it meant"],
          hint: "You arrive before you can have first impressions.",
          why: "Getting there, first impressions, the best part, the surprise, then home. The surprise can move about, but arriving and heading home anchor each end." } } },

    { type: "mc", topic: "In the right order",
      q: "Which word fits the gap? \"____, we got back home.\"",
      options: ["Finally", "First", "Next"],
      answer: 0,
      slips: { 1: "First is for the very start of the journey.", 2: "Next is for the middle. Getting home is the end." },
      hint: "Getting home is the end of the journey.",
      why: "<b>Finally</b> tells the reader it is the end.",
      ez: { slips: { 1: "First is for the start.", 2: "Next is for the middle." } },
      lv: {
        medium: { q: "Which word fits the gap? \"I bought my ticket. ____, I found my seat.\"",
          options: ["Then", "Before that", "First of all"],
          slips: { 1: "Before that would mean finding the seat came first.", 2: "First of all is for the very start, but this is the second thing." },
          hint: "Which happened second?",
          why: "<b>Then</b> moves the reader on to the next thing." },
        spicy: { q: "Which opener best shows that time has passed?",
          options: ["By the time the sun set,", "Also,", "For example,", "However,"],
          slips: { 1: "Also adds an idea, but does not move time on.", 2: "For example gives an example, not a time.", 3: "However shows a contrast, not time passing." },
          hint: "Which one has a time of day in it?",
          why: "<b>By the time the sun set</b> moves the reader through the day." } } },

    { type: "match", topic: "In the right order",
      q: "Match each time word to its job.",
      pairs: [["First,", "Opens the journey"], ["Next,", "Moves to the next stop"], ["Finally,", "Ends the journey"]],
      slips: { any: "Start, middle, end." },
      hint: "Start, middle, end.",
      why: "First opens, Next moves on, Finally ends.",
      lv: {
        medium: { pairs: [["First,", "Opens the journey"], ["Next,", "Moves to the next stop"], ["That evening,", "Tells the time of day"], ["Finally,", "Ends the journey"]],
          why: "First opens, Next moves on, That evening gives the time, Finally ends." },
        spicy: { q: "Match each opener to its type.",
          pairs: [["By midday,", "A time opener"], ["Inside the gates,", "A place opener"], ["Nervously,", "A feeling opener"], ["Without warning,", "A surprise opener"]],
          hint: "When, where, how it felt, or a twist?",
          why: "Mixing these keeps the order clear without every paragraph starting the same way." } } },

    { type: "mc", topic: "In the right order", explain: true,
      q: "This travelogue has got muddled. Which sentence is out of place?" +
        "<p class=\"a2task\">[[T1]]<br>[[T4]]<br>[[T2]]<br>[[T3]]<br>[[T5]]</p>",
      options: ["[[T4]]", "[[T1]]", "[[T5]]"],
      answer: 0,
      slips: { 1: "That one sets off, so it belongs at the start.", 2: "That one starts with Finally, so it belongs at the end." },
      hint: "Look at the time words. Which one is too early?",
      why: "It happens later in the day, after First and Next, so it belongs fourth.",
      ez: { q: "Which sentence is in the wrong place?" + "<p class=\"a2task\">[[T1]]<br>[[T4]]<br>[[T2]]<br>[[T3]]<br>[[T5]]</p>", hint: "Which one is too early?", why: "It happens later. It goes 4th.",
        slips: { 1: "That one sets off. It goes first.", 2: "Finally goes at the end." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Plan and write", title: "Plan it, then write it",
      fig: PLAN,
      ez: { title: "Plan, then write", html: "<p><b>Plan:</b> where you went, 3 stops, the end.</p><p><b>Write:</b> I or we, in order, with time words.</p>" },
      html: "<p>Your turn. Pick a journey: a real trip, a made up one, or a journey through time.</p>" +
        "<p><b>Plan first:</b> where you went and how, three stops with something you saw or felt at each, and how it ended.</p>" +
        "<p><b>Then write it:</b> as I or we, in order, with time words. Five sentences is a great travelogue.</p>",
      lv: {
        medium: { html: "<p>Your turn. Pick a journey: a real trip, a made up one, or a journey through time.</p>" +
          "<p><b>Plan first:</b> where and how, three stops, how it ended. <b>Then write it:</b> a short paragraph for each part, each one starting with a time word. Add what you saw and how you felt.</p>" },
        spicy: { html: "<p>Your turn. A real trip, a made up one, or a journey through time.</p>" +
          "<p><b>Plan</b> the shape: getting there, first impressions, the best part, something unexpected, heading home. <b>Write</b> a paragraph for each, first person and past tense, with varied openers and at least one detail for the senses in each paragraph.</p>" } } },

    { type: "mc", topic: "Plan and write",
      q: "Which plan is in a logical order?",
      options: ["Bus to the zoo, penguins, lunch, gift shop, bus home", "Penguins, bus home, bus to the zoo, gift shop, lunch", "Bus home, gift shop, lunch, penguins, bus to the zoo"],
      answer: 0,
      slips: { 1: "This one goes home in the middle of the day.", 2: "This one is backwards: it starts by going home." },
      hint: "Which one starts by setting off and ends by going home?",
      why: "Set off, the stops in the order they happened, then home. A reader can follow that.",
      ez: { hint: "Set off first. Home last.", why: "Set off, the stops, then home.", slips: { 2: "This one starts by going home." } } },

    { type: "widget", topic: "Plan and write", unscored: true,
      title: "Route planner",
      html: "<p>Jot down your plan, if you like. It saves as you type.</p>",
      mount: planWidget,
      report: function(d){
        var got = BOXES.filter(function(b){ return d && d[b[0]] && String(d[b[0]]).trim(); });
        return got.length ? "Plan: " + got.map(function(b){ return b[1].replace(/\?$/, "") + ": " + String(d[b[0]]).trim(); }).join("; ") : "";
      } },

    { type: "write", topic: "Plan and write",
      q: "Write your travelogue, using your plan. As I or we, in order, with time words. Send it to Jay if you would like him to read it.",
      starters: ["At nine o'clock I", "First, I", "Next, we", "After that, I", "Finally, I", "I could see", "I felt"],
      checklist: ["I wrote as I or we", "My stops are in the order they happened", "I used time words like First, Next and Finally", "I said what I saw or felt"],
      minWords: 40,
      ez: { q: "Write your travelogue, if you like. I or we, in order, with time words." },
      lv: {
        medium: { minWords: 100, q: "Write your travelogue, using your plan: a short paragraph for each part, as I or we, each starting with a time word. Send it to Jay if you would like him to read it.",
          starters: ["At nine o'clock I", "After an hour,", "At lunchtime,", "Later that afternoon,", "That evening,", "Finally,", "I felt"],
          checklist: ["I wrote as I or we", "One paragraph for each part", "Each paragraph starts with a time word", "I said what I saw and how I felt"] },
        spicy: { minWords: 180, q: "Write your travelogue: a paragraph for each part of your plan, first person and past tense, with varied openers. Send it to Jay if you would like him to read it.",
          starters: ["By the time we arrived,", "Inside the gates,", "Nervously, I", "Without warning,", "As the sun set,", "Looking back,"],
          checklist: ["First person and past tense all the way through", "A logical order a reader can follow", "Openers that vary: time, place, feeling, surprise", "A detail for the senses in each paragraph", "An ending that says what the journey meant"] } } }
  ],

  realWorld: {
    title: "Travel writing is everywhere",
    html: "<p>Travel writers, bloggers and guidebook authors write travelogues for a living. Explorers kept journals, and ship captains kept logs, so people at home could follow where they went.</p>" +
      "<p>For our big question: if we could time travel, should we? If you did, a travelogue is exactly what you would write, so everyone at home could follow your journey. Historians love old travelogues already: they are how we know what places were like hundreds of years ago.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay stepping out of a time portal with a notebook">' + A2ART.portal(80, 75, 56) + A2ART.jay(240, 48, 0.85, "wow") +
      '<rect x="170" y="104" width="34" height="42" rx="3" fill="#ffd23f" stroke="#141a33" stroke-width="2"/><path d="M176 116h22M176 124h22M176 132h14" stroke="#141a33" stroke-width="2"/>' +
      A2ART.bubble(290, 6, 126, 52, "Dear diary:\nRomans!", 294) + '</svg>'
  },

  ez: {
    realWorld: { title: "Travel writing is everywhere", html: "<p>Explorers kept journals so people could follow them.</p><p>A time traveller would write one too!</p>" },
    make: { intro: "Make a postcard from your journey. Where you went, and the best bit." }
  },

  make: {
    title: "Make a postcard",
    intro: "A postcard from your journey: where you went, the best bit, and one line of travelogue. Keep it, or send it to Jay.",
    fields: [
      { id: "where", label: "Where I went", ph: "Roman London", max: 30 },
      { id: "best", label: "The best bit", ph: "The steamy bath house", max: 40 },
      { id: "line", label: "One line of my travelogue", ph: "First, I landed in a market full of shouting traders.", max: 110 },
      { id: "from", label: "From", ph: "The Time Traveller", max: 24 }
    ],
    svg: function(v){
      var wh = wrap(v.where, 14, 2), best = wrap(v.best, 22, 2), ln = wrap(v.line, 22, 5), fr = wrap(v.from, 22, 1)[0] || "";
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">' +
        '<rect width="640" height="400" rx="18" fill="#fffaf0"/>' +
        '<rect x="10" y="10" width="620" height="380" rx="12" fill="none" stroke="#e04848" stroke-width="6" stroke-dasharray="22 12"/>' +
        /* the picture side */
        '<rect x="30" y="30" width="280" height="340" rx="10" fill="#bfe6fa"/>' +
        '<circle cx="250" cy="90" r="30" fill="#ffd23f"/>' +
        '<path d="M30 260q70 -60 140 -10t140 -30v150h-280z" fill="#7cc46a"/><path d="M30 300q90 -40 180 0t100 -10v80h-280z" fill="#4f9e48"/>' +
        '<path d="M80 370q30 -60 90 -80t60 -70" fill="none" stroke="#e8d5a8" stroke-width="10" stroke-linecap="round"/>' +
        '<rect x="44" y="44" width="250" height="' + (36 + (wh.length - 1) * 30) + '" rx="8" fill="#ffffff" fill-opacity=".85"/>' +
        wh.map(function(l, k){ return T(56, 72 + k * 30, esc(l), 22, { b: 1, c: "#e04848" }); }).join("") +
        '<path d="M330 40v320" stroke="#141a33" stroke-opacity=".25" stroke-width="2"/>' +
        /* the stamp */
        '<rect x="530" y="30" width="80" height="96" fill="#ffffff" stroke="#141a33" stroke-width="2" stroke-dasharray="4 3"/><rect x="538" y="38" width="64" height="80" fill="#8a5cf6" fill-opacity=".3"/>' +
        A2ART.bird(568, 80, 0.9, "#3a8fd6") +
        /* the message */
        T(346, 150, "The best bit:", 14, { b: 1, c: "#5b6180" }) +
        best.map(function(l, k){ return T(346, 174 + k * 22, esc(l), 17, { b: 1 }); }).join("") +
        ln.map(function(l, k){ return T(346, 236 + k * 24, esc(l), 15) + '<path d="M346 ' + (242 + k * 24) + 'h270" stroke="#141a33" stroke-opacity=".2"/>'; }).join("") +
        T(346, 372, "From " + esc(fr), 17, { b: 1, c: "#19a07c" }) +
        '</svg>';
    }
  }
};
})();
