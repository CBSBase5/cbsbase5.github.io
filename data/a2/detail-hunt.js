/* Base 5 Autumn 2 activity: Detail detectives.
   English. Finding the details that back up the main points, and
   telling key details from padding. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';

function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

/* a table: the main point is the top, the details are the legs */
var TABLE =
  '<svg viewBox="0 0 520 230" role="img" aria-label="A table. The top is the main point. The legs are the details that hold it up.">' +
  '<rect x="0" y="0" width="520" height="230" rx="16" fill="#f4f1ea"/>' +
  '<rect x="80" y="36" width="360" height="56" rx="12" fill="#ffd23f" stroke="#141a33" stroke-width="3"/>' +
  '<text x="260" y="72" text-anchor="middle" ' + F + ' font-size="22" font-weight="700" fill="#141a33">Main point</text>' +
  [130, 245, 360].map(function(x, k){
    return '<rect x="' + (x - 14) + '" y="92" width="28" height="92" rx="6" fill="' + ["#22b8e6", "#19c39a", "#ff5d8f"][k] + '" stroke="#141a33" stroke-width="3"/>' +
      '<text x="' + x + '" y="210" text-anchor="middle" ' + F + ' font-size="16" font-weight="700" fill="#141a33">Detail</text>';
  }).join("") +
  '<path d="M60 184h400" stroke="#141a33" stroke-width="3" stroke-linecap="round"/>' +
  '<text x="470" y="120" ' + F + ' font-size="14" fill="#5b6180">holds</text><text x="470" y="138" ' + F + ' font-size="14" fill="#5b6180">it up</text>' +
  '</svg>';

/* a gold pan: key details stay, padding washes through */
var PAN =
  '<svg viewBox="0 0 520 240" role="img" aria-label="A gold pan. Key details stay in the pan like gold. Padding washes away like sand.">' +
  '<rect x="0" y="0" width="520" height="240" rx="16" fill="#e8f7ff"/>' +
  '<path d="M60 70q140 120 280 0z" fill="#8a8f9c" stroke="#141a33" stroke-width="3"/>' +
  '<ellipse cx="200" cy="70" rx="140" ry="18" fill="#b9bfcc" stroke="#141a33" stroke-width="3"/>' +
  [[150, 92], [192, 104], [236, 94], [210, 84]].map(function(p){ return '<path d="M' + p[0] + ' ' + p[1] + 'l10 -8 12 3 4 10 -11 7 -13 -3z" fill="#ffd23f" stroke="#a87a00" stroke-width="2"/>'; }).join("") +
  [[120, 150], [150, 172], [190, 160], [230, 182], [262, 158], [300, 176], [170, 198], [250, 206], [210, 140]].map(function(p){ return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="#c99a63"/>'; }).join("") +
  '<path d="M360 78h40" stroke="#141a33" stroke-width="2.5"/><text x="408" y="74" ' + F + ' font-size="16" font-weight="700" fill="#a87a00">Key details</text><text x="408" y="94" ' + F + ' font-size="14" fill="#141a33">you need them</text>' +
  '<path d="M320 172h40" stroke="#141a33" stroke-width="2.5"/><text x="368" y="170" ' + F + ' font-size="16" font-weight="700" fill="#8a5a36">Padding</text><text x="368" y="190" ' + F + ' font-size="14" fill="#141a33">nice, but take it</text><text x="368" y="208" ' + F + ' font-size="14" fill="#141a33">out and nothing breaks</text>' +
  A.egg('<circle cx="40" cy="214" r="9" fill="#ffd23f" stroke="#a87a00" stroke-width="2"/>', "A stray nugget. Detectives keep everything that matters.") +
  '</svg>';

/* scanning: the question tells you what kind of detail to look for */
var SCAN =
  '<svg viewBox="0 0 520 210" role="img" aria-label="The question word tells you what to look for: when means a time or day, how much means a price, where means a place, who means a person">' +
  '<rect x="0" y="0" width="520" height="210" rx="16" fill="#f4f1ea"/>' +
  [["When?", "a time or day", "#22b8e6"], ["How much?", "a price", "#ffd23f"], ["Where?", "a place", "#19c39a"], ["Who?", "a person", "#ff5d8f"]].map(function(c, k){
    var y = 18 + k * 47;
    return '<rect x="20" y="' + y + '" width="150" height="38" rx="10" fill="' + c[2] + '" stroke="#141a33" stroke-width="2.5"/>' +
      '<text x="95" y="' + (y + 25) + '" text-anchor="middle" ' + F + ' font-size="16" font-weight="700" fill="#141a33">' + c[0] + '</text>' +
      '<path d="M182 ' + (y + 19) + 'h60l-10 -8M242 ' + (y + 19) + 'l-10 8" fill="none" stroke="#141a33" stroke-width="2.5" stroke-linecap="round"/>' +
      '<text x="256" y="' + (y + 25) + '" ' + F + ' font-size="16" fill="#141a33">look for ' + c[1] + '</text>';
  }).join("") +
  '<g transform="translate(470 150)"><circle r="26" fill="#fff" fill-opacity=".6" stroke="#141a33" stroke-width="5"/><path d="M18 18l20 20" stroke="#141a33" stroke-width="8" stroke-linecap="round"/></g>' +
  '</svg>';

/* a poster to scan */
function poster(spicy){
  return '<svg viewBox="0 0 520 300" role="img" aria-label="A poster for an open day at [[place]]">' +
    '<rect x="0" y="0" width="520" height="300" rx="16" fill="#2d2466"/>' +
    '<rect x="40" y="16" width="440" height="268" rx="10" fill="#fffbe0" stroke="#141a33" stroke-width="3"/>' +
    '<text x="260" y="52" text-anchor="middle" ' + F + ' font-size="22" font-weight="700" fill="#e04848">[[Place]]</text>' +
    '<text x="260" y="80" text-anchor="middle" ' + F + ' font-size="18" font-weight="700" fill="#141a33">OPEN DAY</text>' +
    ["Saturday 14 November", "Doors open 10am, close 4pm", "Adults &#163;6     Under 16s &#163;3", "Meet [[who]] at 2pm", "Cafe on the first floor", spicy ? "Lift by the main door. Free entry for carers." : "Lift by the main door"].map(function(l, k){
      return '<text x="64" y="' + (116 + k * 28) + '" ' + F + ' font-size="15" fill="#141a33">' + l + '</text>';
    }).join("") +
    A.egg(A.bird(452, 50, 0.7, "#3a8fd6"), "A bird on the poster. Jay would spot that before anything else.") +
    '</svg>';
}

/* a review, drawn as a tree: main points with their details hanging off */
var TREE =
  '<svg viewBox="0 0 520 250" role="img" aria-label="A longer text has more than one main point, and each main point has its own details">' +
  '<rect x="0" y="0" width="520" height="250" rx="16" fill="#f4f1ea"/>' +
  '<rect x="170" y="14" width="180" height="40" rx="10" fill="#141a33"/><text x="260" y="40" text-anchor="middle" ' + F + ' font-size="16" font-weight="700" fill="#fff">The review</text>' +
  '<path d="M260 54v14M130 68h260M130 68v14M390 68v14" stroke="#141a33" stroke-width="3" fill="none"/>' +
  '<rect x="40" y="82" width="180" height="44" rx="10" fill="#19c39a" stroke="#141a33" stroke-width="2.5"/><text x="130" y="109" text-anchor="middle" ' + F + ' font-size="15" font-weight="700" fill="#141a33">Point 1: worth it</text>' +
  '<rect x="300" y="82" width="180" height="44" rx="10" fill="#ff9f43" stroke="#141a33" stroke-width="2.5"/><text x="390" y="109" text-anchor="middle" ' + F + ' font-size="15" font-weight="700" fill="#141a33">Point 2: the cafe</text>' +
  '<path d="M90 126v24M170 126v24M350 126v24M430 126v24" stroke="#141a33" stroke-width="2.5"/>' +
  [[90, "great show"], [170, "kind staff"], [350, "stale food"], [430, "long queue"]].map(function(d){
    return '<rect x="' + (d[0] - 38) + '" y="150" width="76" height="56" rx="8" fill="#fff" stroke="#141a33" stroke-width="2"/>' +
      d[1].split(" ").map(function(w, j){ return '<text x="' + d[0] + '" y="' + (174 + j * 18) + '" text-anchor="middle" ' + F + ' font-size="13" fill="#141a33">' + w + '</text>'; }).join("");
  }).join("") +
  '<text x="260" y="234" text-anchor="middle" ' + F + ' font-size="14" fill="#5b6180">each point has its own details</text>' +
  A.egg(A.bird(250, 168, 0.6, "#19c39a"), "Even birds leave reviews. This one gave the bird feeder five stars.") +
  '</svg>';

/* the message from Jay, three ways */
var MSG = {
  mild: '<p class="a2task"><b>From Jay:</b> [[Event]] is on Friday now. It starts at 6pm. Please bring [[kit]]. Bonnie says hello.</p>',
  medium: '<p class="a2task"><b>From Jay:</b> Hi everyone. [[Event]] is moving to Friday this week. It will start at 6pm, not 7pm, so please be there by 5.45pm. Has anyone noticed how windy it has been? Please bring [[kit]]. Bonnie says hello.</p>',
  spicy: '<p class="a2task"><b>From Jay:</b> Hi all, a quick update on [[event]]. Because of building work, it moves from Thursday to Friday this week only, and it starts half an hour early, at 6.30pm. Please arrive ten minutes before the start, as the side gate will be locked, so use the main gate. The building work is for a new roof, which has been needed for years. Next week everything goes back to normal. Please bring [[kit]] as usual. Bonnie sends her regards.</p>'
};

/* the review, three ways */
var REVIEW = {
  mild: '<p class="a2task"><b>Review:</b> I went to [[place]] on Saturday. It was a great day out. The [[show]] was amazing and we stayed there for an hour. Entry was only 3 pounds. I wore my red hat. 5 stars.</p>',
  medium: '<div class="a2task"><p><b>Review: [[Place]]</b></p><p>I visited [[place]] last weekend with my cousin. Overall, it was worth every penny. The [[show]] was the highlight: we spent nearly an hour there and still wanted more. The staff were friendly and answered all our questions.</p>' +
    '<p>However, the cafe let it down. My sandwich was stale and cost 7 pounds. Outrageous. We also waited 25 minutes for a table. The car park is big, too. 4 stars out of 5.</p></div>',
  spicy: '<div class="a2task"><p><b>[[Place]] reopens: was the wait worth it?</b></p><p>[[Place]] reopened in September after a two year refit, and on the whole the wait has paid off. The new [[show]] is the clear star: hands on, well lit and, unusually, properly accessible, with step free routes and quiet hours on Sunday mornings. Visitors I spoke to had stayed well over an hour. The refit cost 4 million pounds, a figure the local paper has covered at length.</p>' +
    '<p>Less convincing is the food. A stale sandwich at 7 pounds is hard to defend, and a single till meant a 25 minute queue at lunchtime. Families on a budget may want to bring their own. Verdict: 4 stars, though the cafe needs work.</p></div>'
};

/* review sentences for the highlighter: k = key for "worth the trip", p = padding or the other point */
var HL = {
  mild: [["I went to [[place]] on Saturday.", "p"], ["The [[show]] was amazing.", "k"], ["We stayed there for an hour.", "k"], ["Entry was only 3 pounds.", "k"], ["I wore my red hat.", "p"]],
  medium: [["I visited with my cousin.", "p"], ["The [[show]] was the highlight.", "k"], ["We spent nearly an hour there and still wanted more.", "k"], ["The staff were friendly and answered all our questions.", "k"], ["My sandwich was stale and cost 7 pounds.", "o"], ["The car park is big, too.", "p"]],
  spicy: [["[[Place]] reopened in September after a two year refit.", "p"], ["The new [[show]] is hands on and well lit.", "k"], ["It has step free routes and quiet hours on Sunday mornings.", "k"], ["Visitors had stayed well over an hour.", "k"], ["The refit cost 4 million pounds.", "p"], ["A single till meant a 25 minute queue.", "o"]]
};

(window.A2PACKS = window.A2PACKS || {})["detail-hunt"] = {
  a2: true,
  id: "a2-detail-hunt",
  title: "Detail detectives",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "Main points need details to hold them up. Find the ones that matter.",
  blurb: "Hunting for the details that back up the main points, and spotting the padding. Four short chunks, with a set of case notes to make at the end.",
  note: "Detail detectives: finding the details that hold a text up, and spotting the padding. Four five minute chunks and some case notes to make at the end. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Rookie", line: "Rookie: short texts, one main point, details you can point at." },
    { id: "medium", name: "Sleuth", line: "Sleuth: texts with two paragraphs, a main point in each and padding to spot." },
    { id: "spicy", name: "Mastermind", line: "Mastermind: dense articles and reviews, where the key details are tucked in among everything else." }
  ],
  themes: {
    time: { name: "Time travel", w: { place: "the museum", event: "the history trip", kit: "a packed lunch", kitkey: "lunch", who: "the guide", whokey: "guide", show: "time machine room" } },
    football: { name: "Football", w: { place: "the stadium", event: "football training", kit: "your boots", kitkey: "boots", who: "the coach", whokey: "coach", show: "trophy room" } },
    horror: { name: "Horror", w: { place: "the old hospital", event: "the ghost walk", kit: "a torch", kitkey: "torch", who: "the night porter", whokey: "porter", show: "haunted corridor" } },
    fishing: { name: "Fishing", w: { place: "the lake centre", event: "the fishing match", kit: "your rod", kitkey: "rod", who: "the bailiff", whokey: "bailiff", show: "giant pike tank" } },
    music: { name: "Music", w: { place: "the theatre", event: "rehearsal", kit: "your song sheet", kitkey: "song", who: "the director", whokey: "director", show: "costume room" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: TABLE,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Main point and details", title: "Details hold up the main point",
      fig: TABLE,
      ez: { html: "<p>The <b>main point</b> is the big idea. <b>Details</b> back it up.</p>" +
        "<p class=\"a2task\">[[Place]] is easy to get to. The number 12 bus stops right outside. There is a big car park. The train station is a five minute walk away.</p>" +
        "<p>Bus, car park, station: they hold it up.</p>" },
      html: "<p>The <b>main point</b> is what a text is mostly saying. The <b>details</b> are the specific bits that back it up: names, numbers, times, places, examples.</p>" +
        "<p class=\"a2task\">[[Place]] is easy to get to. The number 12 bus stops right outside. There is a big car park. The train station is a five minute walk away.</p>" +
        "<p>Main point: <b>[[Place]] is easy to get to.</b> The bus, the car park and the station are the legs holding it up.</p>",
      lv: { spicy: { html: "<p>The <b>main point</b> is what a text, or a paragraph, is mostly saying. The <b>details</b> are the specific bits that back it up: names, numbers, times, places, examples.</p>" +
        "<p>Strong details are <b>specific</b>. \"It is easy to get to\" is a claim. \"The number 12 bus stops right outside\" is a detail that proves it.</p>" +
        "<p>In longer texts, each paragraph usually has its own main point, so a detective asks: <b>which point does this detail hold up, if any?</b></p>" } } },

    { type: "mc", topic: "Main point and details",
      q: "The main point is: <b>[[Place]] is easy to get to.</b> Which detail backs it up?",
      ez: { q: "Main point: <b>[[Place]] is easy to get to.</b> Which detail backs it up?", slips: { 1: "Paint does not help you get there.", 2: "A date does not help you get there." }, hint: "Which helps you get there?", why: "A bus outside makes it easy to get to." },
      options: ["The number 12 bus stops right outside.", "The walls are painted blue.", "It opened in 1950."],
      answer: 0,
      slips: { 1: "That is a detail, but paint colour does not help anyone get there.", 2: "A date is a detail, but it does not show it is easy to get to." },
      hint: "Which one would help you actually get there?",
      why: "A bus that stops outside makes it easy to get to. That detail holds up the main point.",
      lv: { spicy: { q: "The main point is: <b>[[Place]] is easy to get to.</b> Which detail backs it up best?",
        options: ["The number 12 bus stops right outside, every ten minutes.", "Lots of people say it is easy to find.", "It opened in 1950 and is very popular.", "It is near other places."],
        slips: { 1: "That repeats the claim. A detective wants something specific, like a bus number.", 2: "Specific, yes, but a date and being popular do not show it is easy to reach.", 3: "\"Near other places\" is vague. Which places? How near?" },
        why: "A named bus that comes every ten minutes is specific and it proves the point. Vague details are weak legs." } } },

    { type: "sort", topic: "Main point and details",
      q: "Sort them. Which is the main point, and which are the details?",
      ez: { q: "Sort them. Main point or detail?", hint: "The main point is the big idea.", why: "\"Great for beginners\" is the big idea. The rest prove it." },
      buckets: ["Main point", "Detail"],
      cards: [["[[Event]] is great for beginners.", 0], ["Nobody needs to bring their own kit.", 1], ["[[Who]] explains everything step by step.", 1], ["The first session is free.", 1]],
      hint: "The main point is the big idea. Details are the specific bits that prove it.",
      why: "\"Great for beginners\" is the big idea. No kit needed, step by step help and a free first go are the details that prove it.",
      lv: { spicy: {
        q: "Sort them. Main point, a detail that backs it up, or a detail that does not help the point?",
        buckets: ["Main point", "Backs it up", "Does not help the point"],
        cards: [["[[Event]] is great for beginners.", 0], ["Nobody needs to bring their own kit.", 1], ["[[Who]] explains everything step by step.", 1], ["The first session is free.", 1], ["It was first run in 2015.", 2], ["The building has 3 floors.", 2]],
        why: "Every card except the first is a detail, but only some of them hold up \"great for beginners\". A year and a number of floors are true details that do not help this point." } } },

    { type: "mc", topic: "Main point and details", explain: true,
      q: "Which of these is a <b>detail</b>, not a main point?",
      ez: { q: "Which one is a <b>detail</b>?", slips: { 1: "\"Good value\" is a big idea.", 2: "\"Worth a visit\" is a big idea." }, hint: "Which has a number?", why: "A price is a detail. It is specific." },
      options: ["Tickets cost 4 pounds.", "[[Event]] is good value.", "[[Place]] is worth a visit."],
      answer: 0,
      slips: { 1: "\"Good value\" is a big idea. A detail would prove it, like an actual price.", 2: "\"Worth a visit\" is the big idea. Details are the specific bits underneath it." },
      hint: "Which one has a number in it?",
      why: "A price is specific. \"Tickets cost 4 pounds\" is the kind of detail that could hold up \"good value\".",
      lv: { spicy: { options: ["Tickets cost 4 pounds, half the price of last year.", "[[Event]] is good value.", "[[Place]] is worth a visit.", "People should go more often."],
        slips: { 1: "\"Good value\" is a claim. A detail would prove it.", 2: "\"Worth a visit\" is a main point that needs details.", 3: "That is advice, a kind of main point. What would prove it?" } } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Key detail or padding?", title: "Key details and padding",
      fig: PAN,
      ez: { title: "Key or padding?", html: "<p><b>Key</b> details: you need them. <b>Padding</b>: nice, but not needed.</p>" + MSG.mild },
      html: "<p>Some details are <b>key</b>: you need them. Others are <b>padding</b>: friendly and chatty, but you could take them out and nothing would break.</p>" +
        "<p>Here is a message. Read it and think: what do you actually need to know?</p>" + MSG.medium,
      lv: { mild: { html: "<p>Some details are <b>key</b>: you need them. Others are <b>padding</b>: nice, but you do not need them.</p><p>Here is a message. What do you need to know?</p>" + MSG.mild },
            spicy: { html: "<p>Some details are <b>key</b>: you need them to act on the text. Others are <b>padding</b>: true and maybe interesting, but take them out and nothing breaks.</p>" +
              "<p>Watch out: a key detail can need <b>two details put together</b>. Read this one carefully.</p>" + MSG.spicy } } },

    { type: "mc", topic: "Key detail or padding?",
      q: "Which line from Jay's message is padding?",
      ez: { q: "Which line is padding?", slips: { 1: "You need the time.", 2: "You need to know what to bring." }, hint: "Which could you take out?", why: "Bonnie saying hello is lovely. But you do not need it." },
      options: ["Bonnie says hello.", "It will start at 6pm, not 7pm.", "Please bring [[kit]]."],
      answer: 0,
      slips: { 1: "You need the time, or you would turn up late.", 2: "You need to know what to bring." },
      hint: "Which one could you take out and still turn up on time with the right things?",
      why: "Bonnie saying hello is lovely, but you do not need it to get to [[event]]. Padding.",
      lv: { mild: { options: ["Bonnie says hello.", "It starts at 6pm.", "Please bring [[kit]]."], slips: { 1: "You need the time, or you would be late.", 2: "You need to know what to bring." } },
            spicy: { options: ["The building work is for a new roof, which has been needed for years.", "The side gate will be locked, so use the main gate.", "It moves from Thursday to Friday this week only."],
              slips: { 1: "You need that one, or you would be stuck at a locked gate.", 2: "You need the day, or you would turn up on the wrong night." },
              why: "Why the roof is being fixed is true, but it changes nothing you need to do. Padding. (Bonnie sending her regards is padding too.)" } } },

    { type: "mc", topic: "Key detail or padding?",
      q: "What time should you be there by?",
      ez: { why: "It starts at <b>6pm</b>." },
      options: ["5.45pm", "6pm", "7pm"],
      answer: 0, fixed: true,
      slips: { 1: "6pm is when it starts. Jay asks you to be there a bit before that.", 2: "7pm was the old time. It has moved." },
      hint: "Look for the words \"be there by\".",
      why: "The message says <b>be there by 5.45pm</b>. That is the key detail for turning up on time.",
      lv: { mild: { q: "What time does it start now?", options: ["6pm", "7pm", "5pm"], slips: { 1: "Look again at the message. It says 6pm.", 2: "Look again at the message. It says 6pm." },
              hint: "Find the word \"starts\".", why: "It starts at <b>6pm</b>. That is a key detail." },
            spicy: { q: "Put two details together. What time should you arrive?", options: ["6.20pm", "6.30pm", "6.50pm", "7pm"],
              slips: { 1: "6.30pm is the start time. Jay asks you to arrive ten minutes before it.", 2: "That is ten minutes before the old time. It moved half an hour earlier.", 3: "7pm was the old start time." },
              hint: "Find the new start time, then the bit about arriving early.",
              why: "It starts at 6.30pm, and you should arrive ten minutes before, so <b>6.20pm</b>. Two details joined into one thing you need." } } },

    { type: "sort", topic: "Key detail or padding?",
      q: "Sort the bits of Jay's message. Key detail or padding?",
      ez: { q: "Key detail or padding? Sort them.", hint: "Do you need it to turn up?", why: "Day, time and kit are key. Bonnie is padding." },
      buckets: ["Key detail", "Padding"],
      cards: [["It is on Friday.", 0], ["Be there by 5.45pm.", 0], ["Bring [[kit]].", 0], ["It has been windy.", 1], ["Bonnie says hello.", 1]],
      hint: "Ask: would I need this to turn up at the right time with the right things?",
      why: "Day, time and what to bring are key. The wind and Bonnie are friendly padding.",
      lv: { mild: { cards: [["It is on Friday.", 0], ["It starts at 6pm.", 0], ["Bring [[kit]].", 0], ["Bonnie says hello.", 1]] },
            spicy: { cards: [["It is on Friday this week.", 0], ["It starts at 6.30pm.", 0], ["Use the main gate.", 0], ["Bring [[kit]].", 0], ["The roof has been needed for years.", 1], ["Bonnie sends her regards.", 1]],
              why: "Day, time, gate and kit change what you do. The roof history and Bonnie do not." } } },

    { type: "text", topic: "Key detail or padding?",
      q: "What does Jay ask you to bring?",
      ez: { slips: [[["bonnie", "hello", "regards"], "That is padding. Look for \"bring\"."]], hint: "Find the word \"bring\".", why: "<b>Bring [[kit]]</b>. You need it." },
      need: [[" [[kitkey]]"]],
      model: "Bring [[kit]].",
      slips: [[["bonnie", "hello", "regards"], "That is the padding. Look for the word \"bring\"."]],
      hint: "Find the word \"bring\" in the message.",
      why: "The message says <b>bring [[kit]]</b>. A key detail, because you would be stuck without it." },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Scan for the detail", title: "Let the question tell you what to hunt for",
      fig: SCAN,
      ez: { title: "Scan for it", html: "<p>Look at the <b>question word</b> first.</p><p>When: a time. How much: a price. Where: a place. Who: a person.</p>" },
      html: "<p>You do not need to read every word again to find a detail. Look at the <b>question word</b> first. It tells you what kind of detail to hunt for.</p>" +
        "<p>Then run your eyes over the text for just that kind of thing: a time, a price, a place or a person. That is called <b>scanning</b>.</p>" },

    { type: "num", topic: "Scan for the detail",
      q: "How much does it cost for someone under 16?",
      ez: { q: "How much for under 16s?", slips: [[6, "That is the adult price."]], hint: "Find \"under 16s\".", why: "Under 16s pay <b>3 pounds</b>." },
      fig: poster(false),
      boxes: [{ label: "Under 16s", a: 3, pre: "&#163;" }],
      slips: [[6, "That is the adult price. Look for the words \"under 16s\"."]],
      hint: "\"How much\" means hunt for a price. There are two prices on the poster.",
      why: "Under 16s pay <b>3 pounds</b>. Adults pay 6 pounds.",
      lv: { medium: { q: "One adult and one under 16 go together. How much do they pay altogether?",
              boxes: [{ label: "Total", a: 9, pre: "&#163;" }],
              slips: [[6, "That is just the adult. Add the under 16 price too."], [3, "That is just the under 16. Add the adult price too."], [12, "That is two adult prices. One of them is under 16."]],
              hint: "Find both prices, then add them.",
              why: "6 pounds plus 3 pounds is <b>9 pounds</b>." },
            spicy: { q: "Two adults and one under 16 go together. One of the adults is a carer. How much do they pay altogether?",
              fig: poster(true),
              boxes: [{ label: "Total", a: 9, pre: "&#163;" }],
              slips: [[15, "Nearly. Check the last line of the poster: carers get in free."], [12, "That is two adults with no under 16."], [18, "That is three adult prices."]],
              hint: "Find both prices, then hunt for anything about carers.",
              why: "One adult 6 pounds, the carer free, the under 16 3 pounds: <b>9 pounds</b>. The key detail was hiding on the last line." } } },

    { type: "mc", topic: "Scan for the detail",
      q: "What time do the doors close?",
      ez: { slips: { 1: "10am is when doors open.", 2: "2pm is when you meet [[who]]." }, hint: "Find \"close\".", why: "Doors close at <b>4pm</b>." },
      fig: poster(false),
      options: ["4pm", "10am", "2pm"],
      answer: 0,
      slips: { 1: "10am is when the doors open.", 2: "2pm is when you meet [[who]]." },
      hint: "Find the word \"close\".",
      why: "Doors close at <b>4pm</b>. There are three times on the poster, so the word \"close\" is the clue.",
      lv: { spicy: { q: "You meet [[who]] at the time on the poster, then spend two and a half hours in the cafe. Will the doors still be open when you leave?",
        options: ["No: you would leave at 4.30pm, after the doors close at 4pm.", "Yes: you would leave at 3.30pm, before they close.", "Yes: the doors close at 10am, so it does not matter."],
        slips: { 1: "That is only an hour and a half after 2pm. Two and a half hours takes you past 4pm.", 2: "10am is when the doors open, not close." },
        hint: "Find when you meet [[who]], add two and a half hours, then find when the doors close.",
        why: "2pm plus two and a half hours is 4.30pm, but the doors close at 4pm. Joining two details tells you to plan differently." } } },

    { type: "mc", topic: "Scan for the detail",
      q: "Where is the cafe?",
      ez: { slips: { 1: "That is the lift.", 2: "Look for the word \"cafe\"." }, hint: "Find the word \"cafe\"." },
      fig: poster(false),
      options: ["On the first floor", "By the main door", "Outside"],
      answer: 0,
      slips: { 1: "That is where the lift is.", 2: "The poster does not say outside. Look for the word \"cafe\"." },
      hint: "\"Where\" means hunt for a place. Find the word \"cafe\".",
      why: "The cafe is on the <b>first floor</b>." },

    { type: "text", topic: "Scan for the detail",
      q: "Who do you meet at 2pm?",
      ez: { slips: [[["4pm", "10am", "cafe", "lift"], "Who means a person. Look by 2pm."]], hint: "Find 2pm on the poster.", why: "Meet <b>[[who]]</b> at 2pm." },
      fig: poster(false),
      need: [[" [[whokey]]"]],
      model: "You meet [[who]].",
      slips: [[["4pm", "10am", "cafe", "lift"], "\"Who\" means hunt for a person. Look next to 2pm."]],
      hint: "\"Who\" means hunt for a person. Find 2pm on the poster.",
      why: "The poster says <b>meet [[who]] at 2pm</b>." },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Details in a review", title: "Longer texts: a main point for each part",
      fig: TREE,
      ez: { title: "Details in a review", html: "<p>A short review. One main point, some details.</p>" + REVIEW.mild },
      html: "<p>Longer texts often have <b>more than one main point</b>, and each one has its own details. Here is a review. Read it once, then go hunting.</p>" + REVIEW.medium,
      lv: { mild: { fig: TABLE, html: "<p>Here is a short review. It has one main point and some details. Read it once, then go hunting.</p>" + REVIEW.mild },
            spicy: { html: "<p>Articles and reviews pack a lot in. Each paragraph has a main point, and the details that hold it up are mixed in with background and side facts. Read it once, then go hunting.</p>" + REVIEW.spicy } } },

    { type: "mc", topic: "Details in a review",
      q: "What is the main point of the second paragraph?",
      ez: { slips: { 1: "That is padding.", 2: "That is a detail." }, hint: "What is it mostly saying?", why: "\"It was a great day out\". The rest backs it up." },
      options: ["The cafe let the visit down.", "The car park is big.", "The [[show]] was the highlight."],
      answer: 0,
      slips: { 1: "That is a small detail, and a bit of padding.", 2: "That is from the first paragraph." },
      hint: "Read the first few words of the second paragraph.",
      why: "\"However, the cafe let it down\" is the main point. The stale sandwich and the wait are the details that hold it up.",
      lv: { mild: { q: "What is the main point of the review?", options: ["It was a great day out.", "I wore my red hat.", "Entry was 3 pounds."],
              slips: { 1: "That is padding. It does not tell us about the place.", 2: "That is a detail. It holds up the main point." },
              hint: "What is the whole review mostly saying?", why: "\"It was a great day out\" is the main point. The rest backs it up." },
            spicy: { q: "Which sentence best sums up the main point of the second paragraph?",
              options: ["The food does not match the quality of the rest.", "Families should always bring their own food.", "The refit cost too much money.", "There is only one till."],
              slips: { 1: "That is a suggestion that comes from the point, not the point itself.", 2: "The cost is in the first paragraph, and the writer never says it was too much.", 3: "That is a detail. It holds up the point." },
              hint: "The paragraph starts \"Less convincing is the food\".",
              why: "The paragraph is about the food falling short. The stale sandwich, the price and the queue are its details." } } },

    { type: "mc", topic: "Details in a review",
      q: "Which detail backs up the point that the cafe let it down?",
      ez: { slips: { 1: "That is about the writer.", 2: "That is when, not why." }, hint: "Which says something good?", why: "The [[show]] was amazing. That backs it up." },
      options: ["My sandwich was stale and cost 7 pounds.", "The staff were friendly.", "The car park is big, too.", "I visited with my cousin."],
      answer: 0,
      slips: { 1: "That backs up the first point, that it was worth it.", 2: "That does not tell us anything about the cafe.", 3: "Padding. It does not tell us about the cafe." },
      hint: "Find a detail about food.",
      why: "A stale sandwich for 7 pounds is a specific detail that proves the cafe let it down.",
      lv: { mild: { q: "Which detail shows it was a great day out?", options: ["The [[show]] was amazing.", "I wore my red hat.", "I went on Saturday."],
              slips: { 1: "That is about the writer, not the day out.", 2: "That is when, not why it was great." },
              hint: "Which one says something good about the place?", why: "The [[show]] being amazing is a detail that shows it was a great day out." },
            spicy: { q: "Which detail does <b>least</b> to back up either main point?",
              options: ["The refit cost 4 million pounds.", "Visitors had stayed well over an hour.", "A single till meant a 25 minute queue.", "It has step free routes."],
              slips: { 1: "That shows people enjoyed it: it backs up point one.", 2: "That shows the cafe struggles: it backs up point two.", 3: "That shows it is well designed: it backs up point one." },
              hint: "Which detail is true, but does not tell you whether the visit is good or the cafe is good?",
              why: "The cost is a real, specific detail, but it does not prove the visit is good or the cafe is poor. Background, not a supporting detail." } } },

    { type: "widget", topic: "Details in a review", unscored: true,
      title: "Highlighter",
      html: "<p>Tap the details that show the trip was <b>worth it</b>. Tap again to take the highlight off. When you are happy, check your highlights.</p>",
      ez: { html: "<p>Tap the details that show the trip was <b>worth it</b>. Then check.</p>" },
      mount: function(el, api){
        var d = api.data, lv = api.level || "medium";
        var rows = HL[lv] || HL.medium;
        d.on = d.on || {};
        el.innerHTML = '<div class="dh-rows" style="display:grid;gap:8px;margin:8px 0"></div>' +
          '<button type="button" class="btn dh-check">Check my highlights</button><p class="dh-msg" style="margin-top:10px"></p>';
        var box = el.querySelector(".dh-rows"), msg = el.querySelector(".dh-msg");
        var btns = rows.map(function(r, k){
          var b = document.createElement("button");
          b.type = "button";
          b.style.cssText = "text-align:left;font:inherit;padding:10px 12px;border-radius:10px;border:2px solid #141a33;background:#fff;color:#141a33;cursor:pointer";
          b.textContent = api.tok(r[0]);
          b.onclick = function(){ d.on[k] = !d.on[k]; api.save(); paint(); };
          box.appendChild(b);
          return b;
        });
        function paint(){
          btns.forEach(function(b, k){
            b.style.background = d.on[k] ? "#ffe873" : "#fff";
            b.setAttribute("aria-pressed", d.on[k] ? "true" : "false");
          });
        }
        function check(){
          var keyN = 0, keyHit = 0, extra = [];
          rows.forEach(function(r, k){
            if(r[1] === "k"){ keyN++; if(d.on[k]) keyHit++; }
            else if(d.on[k]) extra.push(r[1]);
            btns[k].style.borderColor = r[1] === "k" ? "#1f9d63" : "#141a33";
          });
          var say = "You found " + keyHit + " of the " + keyN + " details that show it was worth it (they now have green edges).";
          if(extra.indexOf("o") >= 0) say += " One you picked is a detail about the cafe: it backs up the other main point.";
          if(extra.indexOf("p") >= 0) say += " One you picked is padding or background: true, but it does not show the trip was worth it.";
          if(keyHit === keyN && !extra.length) say = "Every key detail, and no padding. Proper detective work.";
          msg.textContent = say;
          d.checked = true; api.save();
          api.done("done");
        }
        el.querySelector(".dh-check").onclick = check;
        paint();
        if(d.checked) check();
      } },

    { type: "text", topic: "Details in a review", explain: true,
      q: "Write <b>one</b> detail from the review that shows the [[show]] was good.",
      ez: { q: "Write <b>one</b> detail that shows the [[show]] was good.", slips: [[["sandwich", "stale", "queue", "till", "car park", "cousin", "hat"], "That is about something else."]], hint: "Find the [[show]] in the review.", why: "Like this: we stayed there for an hour." },
      need: [["hour", "amazing", "highlight", "hands on", "well lit", "step free", "quiet", "clear star", "wanted more"]],
      model: "We spent nearly an hour there and still wanted more.",
      slips: [[["sandwich", "stale", "queue", "till", "car park", "cousin", "hat"], "That detail is about something else. Find one about the [[show]]."]],
      hint: "Find the sentence with the [[show]] in it, then look just after it.",
      why: "Anything specific about the [[show]] works, like spending nearly an hour there. A detail, not just \"it was good\".",
      lv: { mild: { model: "The [[show]] was amazing and we stayed there for an hour." },
            spicy: { q: "Write <b>one</b> specific detail from the article that shows the [[show]] is good. Pick the strongest one you can find.",
              model: "Visitors had stayed well over an hour.",
              why: "Staying well over an hour, step free routes, quiet hours, hands on: all specific. \"The clear star\" is the writer's claim; the details are what prove it." } } }
  ],

  realWorld: {
    title: "Detail hunting is everyday reading",
    html: "<p>Letters from college, job adverts, bus times, reviews before you buy something: they are all full of details, and only some of them matter for what you need. Detectives find those first.</p>" +
      "<p>It fits our big question too. <b>If we could time travel, should we?</b> A travel guide to the past would be packed with details. Which ones would decide whether the trip is worth it, and which ones would just be padding?</p>",
    fig: '<svg viewBox="0 0 420 140" role="img" aria-label="Jay next to a time portal, wondering which details matter">' + A.portal(80, 70, 56) + A.jay(250, 50, 0.85, "hmm") +
      A.bubble(296, 4, 120, 52, "Which details\nmatter?", 300) + '</svg>'
  },

  ez: {
    realWorld: { title: "Detail hunting is everywhere", html: "<p>Letters, bus times, reviews. Find the details that matter.</p><p>A guide to the past would be full of details too!</p>" },
    make: { intro: "Pick a text. Write its main point and 2 details." }
  },

  make: {
    title: "Make your case notes",
    intro: "Pick any text you like: a poster, a message, a review. Write its main point and the two details that hold it up. Keep it, or send it to Jay.",
    fields: [
      { id: "point", label: "The main point", ph: "The museum is a brilliant day out.", max: 70 },
      { id: "d1", label: "Detail 1", ph: "The time machine room kept us busy for an hour.", max: 60 },
      { id: "d2", label: "Detail 2", ph: "Entry is only 3 pounds.", max: 60 },
      { id: "name", label: "Detective", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      function wrap(t, n, most){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if(!x) return; while(x.length > n){ if(cur.trim()){ out.push(cur.trim()); cur = ""; } out.push(x.slice(0, n)); x = x.slice(n); } if((cur + " " + x).trim().length > n){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, most); }
      var pt = wrap(v.point, 34, 2), d1 = wrap(v.d1, 40, 2), d2 = wrap(v.d2, 40, 2);
      function lines(ls, x, y, size, bold, gap){ return ls.map(function(l, k){ return '<text x="' + x + '" y="' + (y + k * gap) + '" ' + F + ' font-size="' + size + '"' + (bold ? ' font-weight="700"' : '') + ' fill="#141a33">' + esc(l) + '</text>'; }).join(""); }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 440">' +
        '<rect width="600" height="440" rx="24" fill="#f6efe0"/>' +
        '<path d="M40 24h170l20 24h330v368h-520z" fill="#e9c98f" stroke="#7a5532" stroke-width="3"/>' +
        '<text x="56" y="44" ' + F + ' font-size="15" font-weight="700" fill="#7a5532" letter-spacing="2">CASE FILE</text>' +
        '<rect x="56" y="64" width="488" height="336" rx="6" fill="#fffdf6" stroke="#7a5532" stroke-width="2"/>' +
        '<text x="76" y="98" ' + F + ' font-size="15" font-weight="700" fill="#e04848" letter-spacing="2">MAIN POINT</text>' +
        lines(pt, 76, 130, 24, true, 30) +
        '<text x="76" y="204" ' + F + ' font-size="15" font-weight="700" fill="#1f7fb8" letter-spacing="2">DETAIL 1</text>' +
        lines(d1, 76, 230, 18, false, 24) +
        '<text x="76" y="292" ' + F + ' font-size="15" font-weight="700" fill="#1f7fb8" letter-spacing="2">DETAIL 2</text>' +
        lines(d2, 76, 318, 18, false, 24) +
        '<text x="76" y="384" ' + F + ' font-size="16" fill="#5b6180">Detective: ' + esc(v.name) + '</text>' +
        '<g transform="translate(480 360)"><circle r="26" fill="#cfe9f7" fill-opacity=".7" stroke="#141a33" stroke-width="5"/><path d="M18 18l22 22" stroke="#141a33" stroke-width="8" stroke-linecap="round"/></g>' +
        '</svg>';
    }
  }
};
})();
