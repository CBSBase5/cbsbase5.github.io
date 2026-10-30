/* Base 5 Autumn 2 activity: Text skeleton.
   English. The features that hold a text together (headings, subheadings,
   bullets, topic sentences, openings and endings) and what they do to the
   reader. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, extra){ extra = extra || ""; return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (/fill=/.test(extra) ? "" : ' fill="#141a33"') + extra + '>' + s + '</text>'; }
function bar(x, y, w, h, c){ return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + Math.min(5, h / 2) + '" fill="' + c + '"/>'; }
function tag(x, y, label, tx, ty, c){
  return '<path d="M' + tx + ' ' + ty + 'L' + (x - 6) + ' ' + (y - 5) + '" stroke="' + c + '" stroke-width="2.5" fill="none"/>' +
    '<circle cx="' + tx + '" cy="' + ty + '" r="4" fill="' + c + '"/>' + T(x, y, label, 14, ' font-weight="700" fill="' + c + '"');
}

/* a page with its skeleton labelled */
var SKELETON =
  '<svg viewBox="0 0 520 260" role="img" aria-label="A page with its parts labelled: heading, subheading, bullet points and a paragraph">' +
  '<rect width="520" height="260" rx="16" fill="#eef3fb"/>' +
  '<rect x="24" y="16" width="250" height="228" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
  bar(42, 32, 200, 18, "#141a33") +
  bar(42, 66, 120, 12, "#e04848") +
  '<circle cx="50" cy="94" r="4" fill="#141a33"/>' + bar(60, 90, 140, 8, "#8a93b8") +
  '<circle cx="50" cy="110" r="4" fill="#141a33"/>' + bar(60, 106, 110, 8, "#8a93b8") +
  '<circle cx="50" cy="126" r="4" fill="#141a33"/>' + bar(60, 122, 160, 8, "#8a93b8") +
  bar(42, 148, 120, 12, "#e04848") +
  bar(42, 172, 210, 8, "#f2a516") + bar(42, 188, 200, 8, "#8a93b8") + bar(42, 204, 190, 8, "#8a93b8") + bar(42, 220, 120, 8, "#8a93b8") +
  tag(330, 46, "Heading", 246, 41, "#141a33") +
  tag(330, 80, "Subheading", 166, 72, "#e04848") +
  tag(330, 116, "Bullet points", 224, 110, "#3a5bd6") +
  tag(330, 180, "Topic sentence", 256, 176, "#c27c00") +
  tag(330, 216, "Paragraph", 236, 208, "#5b6180") +
  A.egg(A.bird(486, 236, 0.7, "#19c39a"), "Even birds have skeletons. Theirs are hollow and very light, which helps them fly. Jay could talk about this for hours.") +
  '</svg>';

/* the themed leaflet */
var LEAFLET =
  '<svg viewBox="0 0 520 300" role="img" aria-label="A leaflet with a heading, three subheadings, bullet points and a numbered list">' +
  '<rect width="520" height="300" rx="14" fill="#fff8e6" stroke="#141a33" stroke-width="2.5"/>' +
  '<rect x="0" y="0" width="520" height="46" rx="14" fill="#2d2466"/>' + '<rect x="0" y="30" width="520" height="16" fill="#2d2466"/>' +
  T(20, 30, "[[Head]]", 19, ' font-weight="700" fill="#ffffff"') +
  T(20, 74, "What you will do", 16, ' font-weight="700" fill="#e04848"') +
  T(30, 96, "&#8226; [[Do1]]", 14) + T(30, 116, "&#8226; [[Do2]]", 14) +
  T(20, 148, "What to bring", 16, ' font-weight="700" fill="#e04848"') +
  T(30, 170, "&#8226; [[Kit1]]", 14) + T(30, 190, "&#8226; [[Kit2]]", 14) + T(30, 210, "&#8226; [[Kit3]]", 14) +
  T(20, 242, "How to book", 16, ' font-weight="700" fill="#e04848"') +
  T(30, 264, "1. Fill in the form", 14) + T(30, 284, "2. Pay 5 pounds", 14) +
  A.egg(A.bonnie(470, 250, 0.55, "sit"), "Bonnie read the leaflet. She skipped straight to What to bring, to check for treats.") +
  '</svg>';

/* a paragraph: one sentence leads, the rest back it up */
var TOPIC =
  '<svg viewBox="0 0 520 210" role="img" aria-label="A paragraph: the first sentence says what it is about, and the other sentences back it up">' +
  '<rect width="520" height="210" rx="16" fill="#f4f1ea"/>' +
  bar(24, 26, 300, 26, "#ffd23f") + T(36, 45, "Topic sentence", 15, ' font-weight="700"') +
  bar(24, 72, 260, 20, "#d7dbea") + T(36, 87, "detail", 13) +
  bar(24, 104, 280, 20, "#d7dbea") + T(36, 119, "detail", 13) +
  bar(24, 136, 240, 20, "#d7dbea") + T(36, 151, "detail", 13) +
  '<path d="M300 82q50 -10 40 -30M316 114q60 -20 30 -62M276 146q90 -30 76 -94" stroke="#c27c00" stroke-width="2.5" fill="none" stroke-dasharray="6 5"/>' +
  T(360, 44, "Says what the", 14, ' font-weight="700"') + T(360, 62, "paragraph is", 14, ' font-weight="700"') + T(360, 80, "about", 14, ' font-weight="700"') +
  T(360, 130, "Details back", 14) + T(360, 148, "it up", 14) +
  T(24, 192, "Read the first sentence and you know what is coming.", 14, ' fill="#5b6180"') +
  '</svg>';

/* opening, middle, ending */
var ENDS =
  '<svg viewBox="0 0 520 230" role="img" aria-label="A page with the opening and the ending highlighted">' +
  '<rect width="520" height="230" rx="16" fill="#eef8f3"/>' +
  '<rect x="24" y="14" width="210" height="202" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
  bar(38, 28, 182, 40, "#ff5d8f") + bar(38, 82, 170, 8, "#d7dbea") + bar(38, 98, 180, 8, "#d7dbea") + bar(38, 114, 160, 8, "#d7dbea") + bar(38, 130, 176, 8, "#d7dbea") + bar(38, 146, 150, 8, "#d7dbea") +
  bar(38, 164, 182, 40, "#19c39a") +
  T(254, 44, "Opening: the hook", 16, ' font-weight="700" fill="#c2185b"') + T(254, 64, "Makes you want to read on", 14) +
  T(254, 112, "Middle: the details", 16, ' font-weight="700" fill="#5b6180"') +
  T(254, 178, "Ending: land it", 16, ' font-weight="700" fill="#0f7d5e"') + T(254, 198, "Sums up, or says what next", 14) +
  '</svg>';

/* feature then effect */
var EFFECT =
  '<svg viewBox="0 0 520 200" role="img" aria-label="Feature, then effect: what the writer did, then what it does to the reader. Jay says feature, then effect.">' +
  '<rect width="520" height="200" rx="16" fill="#f3efff"/>' +
  '<rect x="20" y="30" width="150" height="70" rx="12" fill="#ffffff" stroke="#8a5cf6" stroke-width="3"/>' + T(36, 58, "Feature", 17, ' font-weight="700" fill="#5b3cc4"') + T(36, 82, "what they did", 14) +
  '<path d="M178 65h46M214 55l12 10 -12 10" stroke="#141a33" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
  '<rect x="232" y="30" width="150" height="70" rx="12" fill="#ffffff" stroke="#19c39a" stroke-width="3"/>' + T(248, 58, "Effect", 17, ' font-weight="700" fill="#0f7d5e"') + T(248, 82, "what it does", 14) +
  T(20, 140, "The writer uses ___", 15) + T(20, 164, "so that the reader ___.", 15) +
  A.jay(450, 62, 0.8, "smile") + A.bubble(384, 120, 128, 52, "Feature, then\neffect.", 430) +
  '</svg>';

function esc(t){ return String(t == null ? "" : t).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function wrap(t, n, max){ var w = String(t == null ? "" : t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if(!x) return; while(x.length > n){ if(cur){ out.push(cur); cur = ""; } out.push(x.slice(0, n)); x = x.slice(n); } if((cur + " " + x).trim().length > n){ out.push(cur.trim()); cur = x; } else cur = (cur + " " + x).trim(); }); if(cur) out.push(cur); return out.slice(0, max || 3); }

var KITPARA = "<p class=\"a2task\">There are a few things you will need to bring. Top of the list is [[kit1]]. Pack [[kit2]] in case it turns cold. Finally, do not forget [[kit3]].</p>";

(window.A2PACKS = window.A2PACKS || {})["text-skeleton"] = {
  a2: true,
  id: "a2-text-skeleton",
  title: "Text skeleton",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "Headings, topic sentences, openings and endings: the bones that hold a text up, and what they do to the reader.",
  blurb: "The skeleton of a text: the features that organise it and hold it together, and what each one does to the reader. Four short chunks, then you plan a skeleton of your own.",
  note: "The bones of a text: headings, topic sentences, openings and endings, and what they do to the reader. Four five minute chunks and a skeleton to plan at the end. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Sketch", line: "Sketch: spot the features you can see, like headings and bullet points." },
    { id: "medium", name: "Blueprint", line: "Blueprint: topic sentences, openings and endings, and how they hold a text together." },
    { id: "spicy", name: "X-ray", line: "X-ray: say what each choice does to the reader, the way an exam answer would." }
  ],
  themes: {
    time: { name: "Time travel", w: { head: "Time Tours: Trips to the Past", act: "the tour", place: "the time station", who: "your guide", kit1: "a watch", kit2: "a warm coat", kit3: "a map", do1: "visit a Roman market", do2: "watch a castle being built" } },
    football: { name: "Football", w: { head: "Summer Football Camp", act: "the camp", place: "the training ground", who: "the coach", kit1: "boots", kit2: "a warm top", kit3: "a water bottle", do1: "play in a five a side tournament", do2: "practise penalties" } },
    horror: { name: "Horror", w: { head: "The Haunted Hotel Night Tour", act: "the night tour", place: "the old hotel", who: "the night porter", kit1: "a torch", kit2: "a warm coat", kit3: "spare batteries", do1: "explore the empty ballroom", do2: "ride the lift that moves by itself" } },
    fishing: { name: "Fishing", w: { head: "Willow Lake Fishing Weekend", act: "the weekend", place: "Willow Lake", who: "the lake warden", kit1: "a rod", kit2: "a warm hat", kit3: "bait", do1: "learn to cast a long way", do2: "fish from the jetty" } },
    music: { name: "Music", w: { head: "Summer Theatre School", act: "the course", place: "the theatre", who: "the director", kit1: "comfy shoes", kit2: "a warm jumper", kit3: "a water bottle", do1: "learn a song from a musical", do2: "perform on the main stage" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: SKELETON,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Bones you can see", title: "Every text has a skeleton",
      fig: SKELETON,
      html: "<p>Under the words, a text has a skeleton that holds it up. Some of the bones you can see straight away:</p>" +
        "<p><b>Heading:</b> what the whole text is about. <b>Subheading:</b> what one section is about. <b>Bullet points:</b> a quick list of separate things. <b>Numbered list:</b> steps that go in order.</p>" +
        "<p>Writers choose these on purpose, to help a reader find their way around.</p>",
      lv: {
        mild: { html: "<p>A text has a skeleton that holds it up.</p><p>The <b>heading</b> says what it is all about. A <b>subheading</b> says what one part is about. <b>Bullet points</b> make a quick list.</p>" },
        spicy: { html: "<p>Under the words, every text has a skeleton. In exams these are called <b>structural</b> or <b>organisational features</b>.</p>" +
          "<p>Some are visible: <b>headings, subheadings, bullet points, numbered lists, bold text, captions</b>. Others sit inside the writing: <b>topic sentences, the opening, the ending</b>, and the little words that link one part to the next.</p>" +
          "<p>Spotting them is the easy half. The marks come from saying <b>why</b> the writer chose them.</p>" } } ,
      ez: { html: "<p>A <b>heading</b> says what it is all about.</p><p>A <b>subheading</b> is for 1 part. <b>Bullet points</b> make a list.</p>" } },

    { type: "match", topic: "Bones you can see",
      q: "Match each feature to its job.",
      pairs: [["Heading", "Says what the whole text is about"], ["Subheading", "Says what one section is about"], ["Bullet points", "A quick list of separate things"], ["Numbered list", "Steps that go in order"]],
      hint: "Start with the biggest one. The heading covers everything.",
      why: "Heading for the whole thing, subheadings for sections, bullets for lists, numbers for steps in order.",
      ez: { q: "Match each one to its job.", hint: "The heading covers everything.", why: "Heading: all of it. Subheading: 1 part. Bullets: a list." },
      lv: {
        mild: { pairs: [["Heading", "Says what the whole text is about"], ["Subheading", "Says what one part is about"], ["Bullet points", "A quick list of things"]] },
        spicy: { pairs: [["Heading", "Says what the whole text is about"], ["Subheading", "Says what one section is about"], ["Bullet points", "A quick list of separate things"], ["Numbered list", "Steps that go in order"], ["Bold text", "Makes a key word stand out"], ["Caption", "Explains a picture"]] } } },

    { type: "mc", topic: "Bones you can see",
      q: "In this leaflet, what is <b>What to bring</b>?",
      fig: LEAFLET,
      options: ["A subheading", "The heading", "A bullet point", "A caption"],
      answer: 0,
      slips: { 1: "The heading is the big one at the very top: [[head]]. What to bring only covers one part.", 2: "The bullet points are the items under it, like [[kit1]].", 3: "A caption sits under a picture. This sits above a list." },
      hint: "Does it cover the whole leaflet, or just one section?",
      why: "What to bring tells you what one section is about, so it is a subheading." ,
      ez: { hint: "Is it for all of it, or 1 part?", why: "It is for 1 part. So it is a subheading.",
        slips: { 1: "The heading is the big one at the top.", 2: "The bullets are the items under it.", 3: "A caption goes under a picture." } } },

    { type: "mc", topic: "Bones you can see",
      q: "The writer wants to list the kit: [[kit1]], [[kit2]] and [[kit3]]. Which feature fits best?",
      options: ["Bullet points", "A long paragraph", "A heading for each item"],
      answer: 0,
      slips: { 1: "A paragraph works, but the reader has to dig the items out. A list is quicker to scan.", 2: "Three headings for three small items would make the leaflet huge and messy." },
      hint: "Separate things, no order needed.",
      why: "Bullet points let the reader see the whole list at a glance, a bit like a shopping list.",
      ez: { q: "A list of kit: [[kit1]], [[kit2]], [[kit3]]. Which feature fits?", hint: "Separate things. No order.", why: "Bullets show the list at a glance.",
        slips: { 1: "A list is quicker to scan.", 2: "3 headings would be messy." } },
      lv: { spicy: { q: "The How to book section has two steps that must be done in order. Bullet points or a numbered list?",
        options: ["A numbered list, because the order matters", "Bullet points, because they look neater", "Either, it makes no difference"],
        slips: { 1: "Bullets are great for a list in any order. Here the order matters, so numbers help.", 2: "It does make a difference: numbers tell the reader what to do first." },
        hint: "Would it matter if someone paid before filling in the form?",
        why: "Numbers show the order of the steps, so the reader follows them one at a time." } } },

    { type: "sort", topic: "Bones you can see",
      q: "Sort these bits of information under the right subheading.",
      buckets: ["What you will do", "What to bring"],
      cards: [["[[Do1]]", 0], ["[[Kit1]]", 1], ["[[Do2]]", 0], ["[[Kit3]]", 1]],
      hint: "Is it something you do, or something you pack?",
      why: "Things to do go together, things to pack go together. Grouping like this is exactly what subheadings are for.",
      ez: { q: "Sort each one under its subheading.", hint: "Do it, or pack it?", why: "Things to do together. Things to pack together." },
      lv: {
        medium: { buckets: ["What you will do", "What to bring", "How to book"],
          cards: [["[[Do1]]", 0], ["[[Kit1]]", 1], ["Fill in the form", 2], ["[[Do2]]", 0], ["[[Kit2]]", 1], ["Pay 5 pounds", 2]] },
        spicy: { buckets: ["What you will do", "What to bring", "How to book"],
          cards: [["[[Do1]]", 0], ["[[Kit1]]", 1], ["Fill in the form", 2], ["[[Do2]]", 0], ["[[Kit2]]", 1], ["Places sell out fast, so book early", 2], ["Bring a packed lunch", 1]],
          why: "Each section keeps to one job. Book early belongs with booking, and a packed lunch is something to bring, even though food sounds like an activity." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Topic sentences", title: "The first sentence leads the way",
      fig: TOPIC,
      html: "<p>Inside a paragraph, there is a hidden bone: the <b>topic sentence</b>. It is usually the first sentence, and it says what the whole paragraph is about.</p>" + KITPARA +
        "<p>The first sentence tells you the paragraph is about kit. Every other sentence backs it up with a detail.</p>",
      lv: {
        mild: { html: "<p>The <b>topic sentence</b> is usually the first one in a paragraph. It says what the paragraph is about.</p>" + KITPARA + "<p>The first sentence says: this is about kit.</p>" },
        spicy: { html: "<p>Inside each paragraph is a hidden bone: the <b>topic sentence</b>. It says what the paragraph is about, and every other sentence backs it up.</p>" + KITPARA +
          "<p>It is usually first, so a reader can skim the first lines and get the gist. Sometimes a writer saves it for <b>last</b>, to sum up like a punchline.</p>" } } ,
      ez: { html: "<p>The <b>topic sentence</b> is usually first.</p><p>It says what the paragraph is about.</p>" } },

    { type: "mc", topic: "Topic sentences",
      q: "Read the paragraph. Which is the topic sentence?" + KITPARA,
      options: ["There are a few things you will need to bring.", "Top of the list is [[kit1]].", "Pack [[kit2]] in case it turns cold.", "Finally, do not forget [[kit3]]."],
      answer: 0,
      slips: { 1: "That is one item: a detail. Which sentence covers all of them?", 2: "That is one item: a detail. Which sentence covers all of them?", 3: "That is the last detail. The topic sentence covers the whole paragraph." },
      hint: "Which sentence is the umbrella that all the others sit under?",
      why: "\"There are a few things you will need to bring\" covers every other sentence. The rest are details.",
      ez: { q: "Which is the topic sentence?" + KITPARA, hint: "Which one covers all the others?", why: "The first one covers all the rest.",
        slips: { 1: "That is 1 item. A detail.", 2: "That is 1 item. A detail.", 3: "That is the last detail." } },
      lv: { spicy: { q: "This one is trickier. Which is the topic sentence?<p class=\"a2task\">You will be on your feet for most of the day. The timetable is packed from 9am until 6pm. Even the breaks are short. In short, [[act]] is harder than it looks.</p>",
        options: ["In short, [[act]] is harder than it looks.", "You will be on your feet for most of the day.", "The timetable is packed from 9am until 6pm.", "Even the breaks are short."],
        slips: { 1: "It comes first, but it is only one detail about being busy.", 2: "That is a detail backing up the main point.", 3: "That is a detail backing up the main point." },
        hint: "The topic sentence is not always first. Look for the one that sums up.",
        why: "Here the writer saves the topic sentence for last. \"In short\" is the clue: it sums up all the details before it." } } },

    { type: "order", topic: "Topic sentences",
      q: "Put the paragraph back together: topic sentence first, then the details.",
      items: ["There are a few things you will need to bring.", "Top of the list is [[kit1]].", "Pack [[kit2]] in case it turns cold.", "Finally, do not forget [[kit3]]."],
      hint: "Find the umbrella sentence first. \"Finally\" is a clue for the end.",
      why: "Topic sentence, then the details, with \"Finally\" landing the last one.",
      ez: { q: "Topic sentence first. Then the details.", hint: "Finally goes at the end.", why: "Topic sentence, then details. Finally comes last." },
      lv: { spicy: { q: "Put this paragraph in order so it hangs together.",
        items: ["Getting to [[place]] is easier than you might think.", "A bus leaves the town centre every half hour.", "From the stop, it is a five minute walk.", "If you would rather drive, there is free parking.", "Either way, you will be there in no time."],
        hint: "Topic sentence first. \"From the stop\" needs the bus to come before it. \"Either way\" sums up two choices.",
        why: "Topic sentence, the bus, then the walk from the bus stop, then the other choice, then a sentence that sums up both ways. Words like \"From the stop\" and \"Either way\" are glue that tie the sentences together." } } },

    { type: "mc", topic: "Topic sentences",
      q: "Which subheading fits this paragraph best?<p class=\"a2task\">On the first morning, you will [[do1]]. After lunch, you will [[do2]]. Every evening ends with a hot chocolate and a chat with [[who]].</p>",
      options: ["What you will do", "What to bring", "How to book", "Getting there"],
      answer: 0,
      slips: { 1: "Nothing in it is something to pack.", 2: "There is nothing about forms or paying.", 3: "It is about what happens once you are there, not the journey." },
      hint: "What is every sentence about?",
      why: "Every sentence is about something you will do, so the subheading is What you will do." ,
      ez: { q: "Which subheading fits best?<p class=\"a2task\">On the first morning, you will [[do1]]. After lunch, you will [[do2]]. Every evening ends with a hot chocolate and a chat with [[who]].</p>",
        why: "It is all things you will do.", slips: { 1: "Nothing here is to pack.", 2: "Nothing about forms or paying.", 3: "It is not about the journey." } } },

    { type: "text", topic: "Topic sentences", explain: true,
      q: "Here are the details for a paragraph: <b>it costs 5 pounds, you book online, places sell out fast.</b> Write a topic sentence to go at the start.",
      need: [["book", "booking", "booked", "place", "places", "ticket", "tickets", "sign", "cost", "costs", "price", "pay", "paying", "join", "get"]],
      slips: [[["5 pounds", "five pounds"], "That is one of the details. A topic sentence covers all three, like \"Booking a place is easy.\""]],
      model: "Booking a place is quick and easy.",
      hint: "All three details are about one thing. What is it? Say that in one sentence.",
      why: "Something like \"Booking a place is quick and easy\" covers the price, the website and the rush." ,
      ez: { q: "Write a topic sentence for these: <b>it costs 5 pounds, you book online, places sell out fast.</b>", hint: "All 3 are about 1 thing. What?", why: "Like \"Booking a place is easy.\"",
        slips: [[[], "That is 1 detail. Cover all 3, like: Booking is easy."]] } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Openings and endings", title: "Hook them in, then land it",
      fig: ENDS,
      html: "<p>The <b>opening</b> is a hook: it makes the reader want to keep going. Writers often use a <b>question</b>, a <b>surprising number</b>, a <b>little scene</b> or a <b>quote</b>.</p>" +
        "<p>The <b>ending</b> lands the text. It might sum up, tell the reader what to do next, or <b>circle back</b> to the opening so the text feels finished.</p>",
      lv: {
        mild: { html: "<p>The <b>opening</b> hooks you in, often with a question.</p><p>The <b>ending</b> finishes things off, often by telling you what to do next.</p>" },
        spicy: { html: "<p><b>Openings</b> hook: a question, a surprising number, a little scene, a quote. Each one makes the reader curious in a different way.</p>" +
          "<p><b>Endings</b> land it: a summary, a call to action (what to do next), or a <b>circular ending</b> that echoes the opening. A circular ending makes a text feel complete, like a story that comes home.</p>" } } ,
      ez: { html: "<p>The <b>opening</b> hooks you in.</p><p>The <b>ending</b> finishes it off.</p>" } },

    { type: "match", topic: "Openings and endings",
      q: "Match each opening to the kind of hook it uses.",
      pairs: [["Have you ever wanted to [[do1]]?", "A question"], ["Over 3000 people came to [[place]] last year.", "A surprising number"], ["Picture it: [[place]], early morning, totally silent.", "A little scene"]],
      hint: "Look for the question mark, then the number.",
      why: "A question makes you want the answer. A big number makes you sit up. A little scene drops you straight in.",
      ez: { q: "Match each opening to its hook.", hint: "Look for the ? and the number.", why: "Question. Big number. Little scene." },
      lv: { medium: { pairs: [["Have you ever wanted to [[do1]]?", "A question"], ["Over 3000 people came to [[place]] last year.", "A surprising number"], ["Picture it: [[place]], early morning, totally silent.", "A little scene"], ["\"In the wise words of my late, great grandfather: stop.\"", "A quote"]] },
        spicy: { pairs: [["Have you ever wanted to [[do1]]?", "A question"], ["Over 3000 people came to [[place]] last year.", "A surprising number"], ["Picture it: [[place]], early morning, totally silent.", "A little scene"], ["\"In the wise words of my late, great grandfather: stop.\"", "A quote"]] } } },

    { type: "mc", topic: "Openings and endings",
      q: "Which is the best <b>ending</b> for the leaflet?",
      options: ["So grab [[kit1]], book a place, and we will see you at [[place]].", "There is also a car park round the back.", "Firstly, you will need to bring [[kit1]]."],
      answer: 0,
      slips: { 1: "A new little detail at the very end leaves the reader hanging. Endings round things off.", 2: "\"Firstly\" starts things off. Endings land them." },
      hint: "Which one tells the reader what to do next?",
      why: "It tells the reader what to do next and sends them off. That is a strong ending." ,
      ez: { hint: "Which says what to do next?", why: "It tells the reader what to do next.", slips: { 1: "A new detail at the end leaves you hanging.", 2: "Firstly starts things. It does not end them." } } },

    { type: "mc", topic: "Openings and endings", explain: true,
      q: "The leaflet opens with: \"Have you ever wanted to [[do1]]?\" It ends with: \"Now you can.\" What is the writer doing?",
      options: ["Circling back to the opening, so the text feels finished", "Adding a brand new fact at the end", "Starting a new section"],
      answer: 0,
      slips: { 1: "\"Now you can\" is not new information. It answers something from earlier.", 2: "Nothing new starts. It is the very last line." },
      hint: "What question did the opening ask?",
      why: "The ending answers the opening question. That is a circular ending: the text comes home to where it started.",
      ez: { q: "Start: \"Have you ever wanted to [[do1]]?\" End: \"Now you can.\" What does the ending do?", hint: "What did the start ask?", why: "It answers the question from the start.",
        slips: { 1: "Now you can is an answer, not a question.", 2: "There is no list here." } },
      lv: {
        mild: { q: "The leaflet starts: \"Have you ever wanted to [[do1]]?\" It ends: \"Now you can.\" What does the ending do?",
          options: ["Answers the question from the start", "Asks a new question", "Gives a new list"],
          slips: { 1: "\"Now you can\" is not a question. It is an answer.", 2: "There is no list here, just one short sentence." },
          why: "The start asked a question and the end answers it. It feels finished." },
        spicy: { q: "The leaflet opens with \"Have you ever wanted to [[do1]]?\" and ends with \"Now you can.\" Which comment explains the effect best?",
          options: ["The circular ending answers the opening question, which makes the text feel complete and leaves the reader feeling it is possible.", "The writer uses a question and a short sentence.", "The ending is short because the writer ran out of things to say."],
          slips: { 1: "That names the features but never says what they do to the reader.", 2: "That is a guess about the writer, not a comment on the effect." },
          hint: "The best comment says what the writer did <b>and</b> what it does to the reader.",
          why: "It names the feature (circular ending) and explains the effect (complete, and it feels possible)." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "What it does to the reader", title: "Feature, then effect",
      fig: EFFECT,
      html: "<p>Spotting a feature is half the job. The other half is saying <b>what it does to the reader</b>.</p>" +
        "<p class=\"a2task\">The writer uses <b>subheadings</b> so that the reader <b>can find the part they need quickly</b>.</p>" +
        "<p>Useful effects: find things quickly, follow steps in order, feel curious, remember the main point, feel the text is finished.</p>",
      lv: {
        mild: { html: "<p>Every feature does a job for the reader.</p><p class=\"a2task\">The writer uses <b>bullet points</b> so that the reader <b>can see the list quickly</b>.</p>" },
        spicy: { html: "<p>Spotting a feature gets you started. The marks come from the <b>effect</b>: what it does to the reader.</p>" +
          "<p class=\"a2task\">The writer uses a <b>one line paragraph</b>, \"Nobody answered.\", which makes it stand out on the page and slows the reader down, building tension.</p>" +
          "<p>Cohesion counts too. Words like <b>this, these, however, as a result</b> point back to what came before, so each paragraph hooks on to the last one and the reader follows the argument without getting lost.</p>" } } ,
      ez: { html: "<p>Every feature helps the reader.</p><p class=\"a2task\"><b>Bullet points</b> help the reader <b>see the list fast</b>.</p>" } },

    { type: "mc", topic: "What it does to the reader",
      q: "Why does the leaflet use subheadings?",
      fig: LEAFLET,
      options: ["So the reader can find the part they need quickly", "To make the leaflet longer", "Because every text has to have them"],
      answer: 0,
      slips: { 1: "Subheadings add a few words, but that is not why writers use them.", 2: "Lots of texts, like stories and letters, have no subheadings at all. It is a choice." },
      hint: "Think about someone who only wants to know what to bring.",
      why: "Subheadings split the leaflet up, so a reader can jump straight to the bit they need.",
      ez: { hint: "Someone only wants to know what to bring.", why: "So you can jump to the bit you need.", slips: { 1: "That is not why writers use them.", 2: "Lots of texts have none. It is a choice." } },
      lv: { spicy: { q: "A spooky story has long paragraphs, then a paragraph that is just three words: \"Nobody came back.\" What is the effect?",
        fig: "",
        options: ["The short paragraph stands out and makes the reader stop, so the moment hits harder", "It shows the writer was in a hurry", "It makes the story easier to skim for facts"],
        slips: { 1: "It is a deliberate choice, not a rush. Ask what it does to the reader.", 2: "Skimming for facts is what subheadings help with. This is about feeling." },
        hint: "Imagine reading it. What does your eye do when it hits a tiny paragraph?",
        why: "After long paragraphs, a tiny one jumps out and makes the reader pause. That builds tension and makes the line stick." } } },

    { type: "multi", topic: "What it does to the reader",
      q: "Pick the <b>two</b> comments that say what the feature does to the reader, not just what it is.",
      options: ["The writer uses bullet points.", "The bullet points let the reader see the whole kit list at a glance.", "There is a heading at the top.", "The question at the start makes the reader want to read on to find the answer."],
      answers: [1, 3],
      hint: "Look for the ones that mention the reader.",
      why: "Naming a feature is a start. The two picks go further and say what it does to the reader.",
      ez: { hint: "Look for the reader.", why: "It says how bullets help the reader." },
      lv: {
        mild: { q: "Pick the comment that says how it helps the reader.",
          options: ["There are bullet points.", "The bullet points help the reader see the list quickly.", "There is a heading."], answers: [1],
          why: "It says how the bullet points help the reader." },
        spicy: { options: ["The writer uses bullet points.", "The bullet points let the reader see the whole kit list at a glance.", "The leaflet has a structure.", "The opening question makes the reader curious, so they read on to find the answer.", "The ending is at the end."],
          why: "Two comments name a feature and an effect. The others only describe what is there." } } },

    { type: "text", topic: "What it does to the reader",
      q: "Finish the comment: \"The writer uses a numbered list for How to book so that the reader...\"",
      need: [["order", "first", "step", "steps", "follow", "know", "next", "right", "sequence", "one at a time", "what to do"]],
      slips: [[["neat", "nice", "pretty", "longer"], "Think about what the numbers help the reader do, not how it looks."]],
      model: "can follow the steps in the right order.",
      hint: "Numbers tell you what comes first.",
      why: "The numbers show the order, so the reader knows what to do first and what to do next.",
      ez: { q: "Finish it: \"The writer uses a numbered list so that the reader...\"", hint: "Numbers tell you what is first.", why: "So the reader knows what to do first and next.",
        slips: [[[], "Not how it looks. What do the numbers help you do?"]] },
      lv: { spicy: { q: "A paragraph explains why [[place]] closed for a year. The next paragraph begins: \"<b>This</b> is why the new owners started again.\" What does the word <b>This</b> do?",
        need: [["back", "previous", "before", "last", "earlier", "refer", "refers", "link", "links", "linking", "connect", "connects", "join", "joins", "points"]],
        slips: [[["start", "starts", "first word"], "It is the first word, but what is it pointing at?"]],
        model: "It points back to the last paragraph, so it links the two ideas together.",
        hint: "Which earlier thing is \"this\" talking about?",
        why: "\"This\" points back to what the last paragraph explained, hooking the two paragraphs together. That is cohesion: the reader never loses the thread." } } },

    { type: "write", topic: "What it does to the reader",
      q: "Have a go at commenting on the leaflet's skeleton. Pick one or two features and say what each one does for the reader. It only goes to Jay if you choose.",
      fig: LEAFLET,
      starters: ["The writer uses", "so that the reader", "This helps the reader", "The subheadings"],
      checklist: ["I named a feature", "I said what it does to the reader"],
      ez: { q: "Only if you like: pick a feature. What does it do for the reader?" },
      minWords: 25,
      lv: {
        mild: { minWords: 10, starters: ["The leaflet has", "This helps the reader", "The bullet points"], checklist: ["I named a feature", "I said how it helps"] },
        spicy: { q: "Have a go at an exam style answer: how has the writer structured the leaflet to help the reader? Pick two or three features, and for each one say what it does. It only goes to Jay if you choose.",
          minWords: 60, checklist: ["I named at least two features", "I said the effect of each one", "I mentioned the opening, the ending or a topic sentence", "I used a word like this, also or however to link my points"] } } }
  ],

  realWorld: {
    title: "Skeletons are everywhere",
    html: "<p>Every website, leaflet, news article and instruction booklet has a skeleton. People rarely read every word: they skim the headings, read the first lines, and jump to the bit they need. Good structure lets them do that.</p>" +
      "<p>Imagine a guide for travellers to the past. If we could time travel, should we? Whatever you think, the guide would need a really clear skeleton: <b>What to wear</b>, <b>What not to say</b>, and <b>How to get home</b>. That last subheading would be the one everybody turns to first.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A time portal and a guide book with subheadings">' + A.portal(70, 75, 52) +
      '<rect x="160" y="18" width="160" height="118" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
      T(172, 44, "What to wear", 13, ' font-weight="700" fill="#e04848"') + bar(172, 52, 120, 6, "#d7dbea") +
      T(172, 80, "What not to say", 13, ' font-weight="700" fill="#e04848"') + bar(172, 88, 110, 6, "#d7dbea") +
      T(172, 116, "How to get home", 13, ' font-weight="700" fill="#e04848"') + bar(172, 124, 130, 6, "#d7dbea") +
      A.bird(372, 60, 0.8, "#ff5d5d") + '</svg>'
  },

  ez: {
    realWorld: { html: "<p>People skim headings to find what they need.</p><p>A time travel guide would need <b>How to get home</b>!</p>" },
    make: { intro: "A heading, 3 subheadings and a hook." }
  },

  make: {
    title: "Plan a skeleton",
    intro: "Plan the skeleton for a guide or leaflet of your own: a heading, three subheadings and an opening hook. Save it, or send it to Jay if you like.",
    fields: [
      { id: "head", label: "Heading", ph: "A Visitor Guide to 1066", max: 40 },
      { id: "s1", label: "Subheading 1", ph: "What to wear", max: 30 },
      { id: "s2", label: "Subheading 2", ph: "What not to say", max: 30 },
      { id: "s3", label: "Subheading 3", ph: "How to get home", max: 30 },
      { id: "hook", label: "Opening hook", ph: "Have you ever wanted to meet a real knight?", max: 90 },
      { id: "name", label: "Planned by", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      function tx(x, y, t, sz, w, c){ return '<text x="' + x + '" y="' + y + '" font-family="Verdana,Arial,sans-serif" font-size="' + sz + '"' + (w ? ' font-weight="700"' : "") + ' fill="' + (c || "#ffffff") + '">' + t + '</text>'; }
      var head = wrap(v.head, 20, 2), hook = wrap(v.hook, 30, 3), y = 0, s = "";
      s += tx(36, 52, "TEXT SKELETON", 16, 1, "#9fd3ff");
      head.forEach(function(l, k){ s += tx(36, 88 + k * 30, esc(l), 24, 1); });
      y = 88 + head.length * 30 + 4;
      s += tx(36, y, "Hook:", 14, 0, "#ffd23f");
      hook.forEach(function(l, k){ s += tx(36, y + 22 + k * 22, esc(l), 16, 0); });
      y = y + 22 + hook.length * 22 + 14;
      [v.s1, v.s2, v.s3].forEach(function(sub, k){
        var line = wrap(sub, 24, 1)[0] || "";
        s += '<path d="M36 ' + (y + k * 50) + 'h12" stroke="#ff8fb1" stroke-width="4" stroke-linecap="round"/>' + tx(56, y + 6 + k * 50, esc(line), 18, 1, "#ff8fb1") +
          '<rect x="56" y="' + (y + 16 + k * 50) + '" width="220" height="6" rx="3" fill="#ffffff" fill-opacity=".35"/>';
      });
      var spine = '<g stroke="#ffffff" stroke-opacity=".9" stroke-width="5" stroke-linecap="round" fill="none">' +
        '<path d="M520 70V360"/><path d="M495 110q25 -12 50 0M488 150q32 -14 64 0M484 190q36 -14 72 0M488 230q32 -14 64 0M495 270q25 -12 50 0"/></g>' +
        '<circle cx="520" cy="52" r="24" fill="none" stroke="#ffffff" stroke-width="5"/><circle cx="512" cy="48" r="4" fill="#ffffff"/><circle cx="528" cy="48" r="4" fill="#ffffff"/>';
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 440">' +
        '<rect width="600" height="440" rx="22" fill="#14213d"/>' +
        '<rect x="12" y="12" width="576" height="416" rx="16" fill="none" stroke="#9fd3ff" stroke-width="3"/>' +
        s + spine + tx(36, 412, "Planned by " + esc(v.name), 14, 0, "#9fd3ff") + '</svg>';
    }
  }
};
})();
