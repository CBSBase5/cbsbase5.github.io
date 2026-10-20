/* Base 5 Autumn 2 activity: Pick the format.
   English. Letters, diaries, instructions and travelogues: what each
   one looks like, and choosing the right one for the job. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';

/* one little page of each format */
function page(kind, x, y){
  var o = '<g transform="translate(' + x + ' ' + y + ')">';
  var bg = { letter: "#fffbe0", diary: "#ffeef4", how: "#e8f7ff", trav: "#e9fbf3", review: "#fff1e0", report: "#eef0ff" }[kind];
  o += '<rect x="0" y="0" width="104" height="132" rx="8" fill="' + bg + '" stroke="#141a33" stroke-width="2.5"/>';
  function lines(y0, n, w){ var s = ""; for(var k = 0; k < n; k++) s += '<path d="M12 ' + (y0 + k * 14) + 'h' + (w || 80) + '" stroke="#141a33" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>'; return s; }
  if(kind === "letter"){
    o += '<text x="10" y="24" ' + F + ' font-size="14" font-weight="700" fill="#141a33">Dear...</text>' + lines(40, 4) +
      '<text x="10" y="120" ' + F + ' font-size="13" fill="#141a33">Love from</text>';
  }else if(kind === "diary"){
    o += '<rect x="0" y="0" width="104" height="30" rx="8" fill="#ff5d8f"/><text x="10" y="21" ' + F + ' font-size="13" font-weight="700" fill="#fff">Mon 3 Nov</text>' +
      lines(48, 4) + '<path d="M52 118c-6 -7 -14 -9 -14 -16a7 7 0 0 1 14 -2a7 7 0 0 1 14 2c0 7 -8 9 -14 16z" fill="#ff5d8f"/>';
  }else if(kind === "how"){
    o += '<text x="10" y="24" ' + F + ' font-size="14" font-weight="700" fill="#141a33">How to</text>';
    for(var k = 0; k < 3; k++) o += '<circle cx="20" cy="' + (46 + k * 28) + '" r="10" fill="#22b8e6"/><text x="20" y="' + (51 + k * 28) + '" text-anchor="middle" ' + F + ' font-size="13" font-weight="700" fill="#fff">' + (k + 1) + '</text>' +
      '<path d="M36 ' + (46 + k * 28) + 'h56" stroke="#141a33" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>';
  }else if(kind === "trav"){
    o += '<path d="M16 108q10 -40 36 -30t38 -54" fill="none" stroke="#19c39a" stroke-width="4" stroke-dasharray="7 6"/>' +
      [[16, 108], [52, 78], [90, 24]].map(function(p){ return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="8" fill="#e04848" stroke="#141a33" stroke-width="2"/>'; }).join("") +
      '<text x="10" y="22" ' + F + ' font-size="13" font-weight="700" fill="#141a33">My trip</text>';
  }else if(kind === "review"){
    o += '<text x="10" y="24" ' + F + ' font-size="14" font-weight="700" fill="#141a33">Review</text>';
    for(var j = 0; j < 4; j++) o += '<path transform="translate(' + (20 + j * 22) + ' 46)" d="M0 -9l2.6 5.6 6 .7 -4.5 4.1 1.2 6 -5.3 -3 -5.3 3 1.2 -6 -4.5 -4.1 6 -.7z" fill="#f2a516"/>';
    o += lines(74, 3);
  }else if(kind === "report"){
    o += '<text x="10" y="24" ' + F + ' font-size="14" font-weight="700" fill="#141a33">Report</text>' +
      '<rect x="10" y="36" width="50" height="10" rx="3" fill="#8a5cf6"/>' + lines(60, 1) + '<rect x="10" y="78" width="50" height="10" rx="3" fill="#8a5cf6"/>' + lines(102, 1);
  }
  return o + '</g>';
}
function formats(kinds, names){
  var n = kinds.length, gap = (560 - n * 104) / (n + 1);
  return '<svg viewBox="0 0 560 200" role="img" aria-label="Little pages showing ' + names.join(", ") + '">' +
    '<rect width="560" height="200" rx="16" fill="#f4f1ea"/>' +
    kinds.map(function(k, i){
      var x = gap + i * (104 + gap);
      return page(k, x, 16) + '<text x="' + (x + 52) + '" y="182" text-anchor="middle" ' + F + ' font-size="15" font-weight="700" fill="#141a33">' + names[i] + '</text>';
    }).join("") + '</svg>';
}
var FOUR = formats(["letter", "diary", "how", "trav"], ["Letter", "Diary", "Instructions", "Travelogue"]);
var SIX = formats(["letter", "diary", "how", "trav", "review", "report"], ["Letter", "Diary", "How to", "Travel", "Review", "Report"]);
var FOUR_EGG = FOUR.replace("</svg>", A2ART.egg(A2ART.bird(536, 26, 0.6, "#ffd23f"), "A bird with a postcard in its beak. Jay says it is the only post he ever wants.") + "</svg>");

/* purpose, audience, format */
var PAF = '<svg viewBox="0 0 520 190" role="img" aria-label="Ask why am I writing, then who will read it, then pick the format">' +
  '<rect width="520" height="190" rx="16" fill="#f4f1ea"/>' +
  '<g transform="translate(90 84)"><circle r="46" fill="#fff" stroke="#e04848" stroke-width="5"/><circle r="30" fill="none" stroke="#e04848" stroke-width="5"/><circle r="12" fill="#e04848"/></g>' +
  '<g transform="translate(260 84)"><circle cx="-20" cy="-14" r="13" fill="#22b8e6"/><path d="M-42 24q22 -40 44 0z" fill="#22b8e6"/><circle cx="18" cy="-18" r="15" fill="#19c39a"/><path d="M-8 26q26 -46 52 0z" fill="#19c39a"/></g>' +
  page("trav", 380, 20) +
  '<path d="M146 84h46M316 84h50" stroke="#141a33" stroke-width="4" marker-end="url(#pfA)"/>' +
  '<defs><marker id="pfA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0l10 5 -10 5z" fill="#141a33"/></marker></defs>' +
  '<text x="90" y="160" text-anchor="middle" ' + F + ' font-size="15" font-weight="700" fill="#141a33">Why am I writing?</text>' +
  '<text x="260" y="160" text-anchor="middle" ' + F + ' font-size="15" font-weight="700" fill="#141a33">Who will read it?</text>' +
  '<text x="432" y="174" text-anchor="middle" ' + F + ' font-size="15" font-weight="700" fill="#141a33">So: which one?</text>' +
  '</svg>';

/* the shape of a travelogue, as a route */
var ROUTE = '<svg viewBox="0 0 540 200" role="img" aria-label="A travelogue is a route: title, setting off, stops in order, heading home">' +
  '<rect width="540" height="200" rx="16" fill="#e9fbf3"/>' +
  '<path d="M50 150C120 40 180 170 260 100S400 30 490 120" fill="none" stroke="#19c39a" stroke-width="6" stroke-dasharray="12 9"/>' +
  [[50, 150, "Set off"], [170, 112, "Stop 1"], [260, 100, "Stop 2"], [370, 64, "Stop 3"], [490, 120, "Home"]].map(function(p, k){
    return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="14" fill="' + (k === 0 || k === 4 ? "#ffd23f" : "#e04848") + '" stroke="#141a33" stroke-width="2.5"/>' +
      '<text x="' + p[0] + '" y="' + (p[1] + 36) + '" text-anchor="middle" ' + F + ' font-size="14" font-weight="700" fill="#141a33">' + p[2] + '</text>';
  }).join("") +
  '<rect x="16" y="14" width="150" height="34" rx="8" fill="#fff" stroke="#141a33" stroke-width="2"/><text x="91" y="37" text-anchor="middle" ' + F + ' font-size="15" font-weight="700" fill="#141a33">Title first</text>' +
  '</svg>';

function box(h){ return '<p class="a2task">' + h + '</p>'; }

(window.A2PACKS = window.A2PACKS || {})["pick-format"] = {
  a2: true,
  id: "a2-pick-format",
  title: "Pick the format",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "Letter, diary, instructions or travelogue? Every job has a shape that fits it.",
  blurb: "Spotting the shape a piece of writing needs, and picking the right one for the job. Four short chunks, with a format card to make at the end.",
  note: "Letters, diaries, instructions and travelogues: spotting them, and picking the right one for the job. Four five minute chunks and a card to make. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Postcard", line: "Postcard: four formats, one big clue at a time." },
    { id: "medium", name: "Logbook", line: "Logbook: who it is for and why, and how that changes the format." },
    { id: "spicy", name: "Editor in chief", line: "Editor in chief: more formats, tone, and structure for a real audience." }
  ],
  themes: {
    time: { name: "Time travel", w: { trip: "my trip through time", ride: "the time machine", stop1: "a Roman fort", stop2: "a Victorian market", seen: "a knight on a horse", gear: "a pocket watch", newbie: "time traveller", boss: "the head of the Time Office" } },
    football: { name: "Football", w: { trip: "the away trip to the cup final", ride: "the team coach", stop1: "the motorway services", stop2: "the stadium", seen: "the floodlights come on", gear: "my scarf", newbie: "fan", boss: "the club secretary" } },
    horror: { name: "Horror", w: { trip: "my night shift at the old hotel", ride: "the creaky lift", stop1: "the empty lobby", stop2: "the long corridor", seen: "a light flickering in room 13", gear: "a torch", newbie: "night porter", boss: "the hotel manager" } },
    fishing: { name: "Fishing", w: { trip: "my fishing trip to the lake", ride: "the little boat", stop1: "the tackle shop", stop2: "the jetty", seen: "a heron catch a fish", gear: "my rod", newbie: "angler", boss: "the lake warden" } },
    music: { name: "Music", w: { trip: "the theatre tour", ride: "the tour bus", stop1: "the stage door", stop2: "the rehearsal room", seen: "the red curtain go up", gear: "my script", newbie: "cast member", boss: "the theatre manager" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: FOUR,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Spot the format", title: "Every piece of writing has a shape",
      fig: FOUR_EGG,
      html: "<p>The same trip could be written up in lots of ways. Each way is called a <b>format</b>, and each one has a shape you can spot.</p>" +
        "<p><b>Letter:</b> starts with Dear, ends with Love from or Yours. Written to one person.</p>" +
        "<p><b>Diary:</b> a date at the top. Told by I, about my day and how I felt. Just for me.</p>" +
        "<p><b>Instructions:</b> a How to title, then numbered steps that tell you what to do.</p>" +
        "<p><b>Travelogue:</b> the story of a journey, told by I or we, stop by stop, in order.</p>",
      lv: { spicy: { fig: SIX, html: "<p>The same trip could be written up in lots of ways. Each way is called a <b>format</b>.</p>" +
        "<p><b>Letter</b> (Dear... Love from), <b>diary</b> (a date, my feelings), <b>instructions</b> (How to, numbered steps) and <b>travelogue</b> (a journey told in order) are the big four.</p>" +
        "<p>Two more for you: a <b>review</b> judges something and often gives it a rating. A <b>report</b> gives facts, grouped in sections with headings, and keeps the writer's feelings out.</p>" } } },

    { type: "mc", topic: "Spot the format",
      q: "Have a read. Which format is this?" + box("Dear Gran,<br>I am having a brilliant time on [[trip]]. Today I saw [[seen]]. See you soon.<br>Love from me"),
      options: ["A letter", "A diary", "Instructions", "A travelogue"],
      answer: 0, fixed: true,
      slips: { 1: "A diary is written to yourself. This one starts Dear Gran, so it is going to someone else.", 2: "There are no numbered steps telling anyone what to do.", 3: "It does talk about the trip, but Dear Gran and Love from are the big clues." },
      hint: "Look at the very first and very last lines.",
      why: "Dear at the top and Love from at the bottom: a letter, written to one person.",
      lv: { spicy: {
        q: "Have a read. Which format is this?" + box("[[Stop2]]: four stars out of five. The seats were comfy, but the queue was far too long. Worth a visit, but take a snack."),
        options: ["A review", "A report", "A letter", "A travelogue"],
        slips: { 1: "A report sticks to facts. This one gives an opinion and a star rating.", 2: "There is no Dear or Love from. It is not written to one person.", 3: "There is no journey here, just a judgement of one place." },
        hint: "Is it telling a story, giving facts, or judging something?",
        why: "Four stars, comfy, far too long, worth a visit: it judges the place and rates it. That is a review." } } },

    { type: "mc", topic: "Spot the format",
      q: "Which format is this?" + box("How to get to [[stop2]]<br>1. Pack [[gear]].<br>2. Get on [[ride]].<br>3. Get off at [[stop1]] and follow the signs."),
      options: ["A letter", "A diary", "Instructions", "A travelogue"],
      answer: 2, fixed: true,
      slips: { 0: "No Dear at the top, and it is not sharing news with anyone.", 1: "No date and no feelings. It tells you what to do.", 3: "A travelogue tells what happened. This tells you what to do next." },
      hint: "Look at the title and the numbers.",
      why: "A How to title and numbered steps that tell you what to do: instructions.",
      lv: { medium: {
          q: "Which format is this? There are no numbers this time." + box("Getting to [[stop2]]<br>First, pack [[gear]]. Next, get on [[ride]]. Get off at [[stop1]], then follow the signs. Do not stop for snacks."),
          hint: "Look at the first word of each sentence. Is it telling you to do something?",
          why: "Pack, get on, get off, follow, do not stop: bossy verbs that tell you what to do. Instructions, even without numbers." },
        spicy: {
          q: "Which format is this?" + box("Visiting [[stop2]]<br><u>Opening times</u><br>Every day, 9am to 5pm.<br><u>Getting there</u><br>Take [[ride]] to [[stop1]]. It takes 20 minutes."),
          options: ["A report", "A review", "A diary", "A travelogue"],
          answer: 0,
          slips: { 1: "There is no opinion or rating here. Every line could be checked.", 2: "No date, no I, no feelings.", 3: "Nobody is telling the story of a journey. It is facts under headings." },
          hint: "Look at the headings, and whether there are any feelings at all.",
          why: "Facts grouped under headings, with no feelings: a report." } } },

    { type: "match", topic: "Spot the format",
      q: "Match each format to its biggest clue.",
      pairs: [["Letter", "Starts with Dear"], ["Diary", "A date, and how I felt"], ["Instructions", "Numbered steps"], ["Travelogue", "A journey, stop by stop"]],
      slips: { any: "Think about the one thing each format nearly always has." },
      hint: "Picture each little page from the start of this chunk.",
      why: "Dear for letters, a date and feelings for diaries, steps for instructions, stops in order for travelogues.",
      lv: { spicy: { pairs: [["Letter", "Starts with Dear"], ["Diary", "A date, and how I felt"], ["Instructions", "Numbered steps"], ["Travelogue", "A journey, stop by stop"], ["Review", "A star rating"], ["Report", "Facts under headings"]],
        why: "Each format has a clue that gives it away. Reviews rate things; reports group facts under headings." } } },

    { type: "mc", topic: "Spot the format", explain: true,
      q: "Which one is the start of a travelogue?",
      options: ["At 9am I climbed into [[ride]]. First we stopped at [[stop1]], then we rolled on to [[stop2]].",
        "Monday. Dear diary, I am so tired today. Nothing much happened and I feel fed up.",
        "Climb into [[ride]]. Sit down. Wait for the bell."],
      answer: 0,
      slips: { 1: "That is about one day and how someone feels. No journey from place to place.", 2: "That is telling you what to do. Climb, sit, wait: instructions." },
      hint: "Which one moves from place to place, in order?",
      why: "It follows a journey in order (9am, first, then) and it is told by I. That is a travelogue." },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Clues on the page", title: "Clues before you read a word",
      fig: '<svg viewBox="0 0 520 220" role="img" aria-label="A travelogue page with its clues labelled">' +
        '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
        '<rect x="24" y="18" width="250" height="186" rx="10" fill="#e9fbf3" stroke="#141a33" stroke-width="2.5"/>' +
        '<text x="40" y="48" ' + F + ' font-size="16" font-weight="700" fill="#141a33">My big trip</text>' +
        '<text x="40" y="82" ' + F + ' font-size="14" fill="#141a33"><tspan font-weight="700" fill="#e04848">At 9am</tspan> I set off.</text>' +
        '<text x="40" y="112" ' + F + ' font-size="14" fill="#141a33"><tspan font-weight="700" fill="#e04848">First</tspan> we went to</text>' +
        '<text x="40" y="132" ' + F + ' font-size="14" fill="#141a33">the <tspan font-weight="700" fill="#2f6fb0">old fort</tspan>.</text>' +
        '<text x="40" y="162" ' + F + ' font-size="14" fill="#141a33"><tspan font-weight="700" fill="#e04848">Later</tspan> <tspan font-weight="700" fill="#8a5cf6">I</tspan> saw a</text>' +
        '<text x="40" y="182" ' + F + ' font-size="14" fill="#141a33">knight on a horse.</text>' +
        '<g ' + F + ' font-size="14" font-weight="700">' +
        '<text x="300" y="52" fill="#141a33">A title for the trip</text>' +
        '<text x="300" y="96" fill="#e04848">Time words</text>' +
        '<text x="300" y="136" fill="#2f6fb0">Place names</text>' +
        '<text x="300" y="176" fill="#8a5cf6">Told by I or we</text></g>' +
        '</svg>',
      html: "<p>Every format leaves clues. For a travelogue, look for:</p>" +
        "<p><b>A title</b> that names the trip. <b>Time words</b> like first, later, at 9am. <b>Place names</b> for each stop. <b>I or we</b>, because the writer went on the journey.</p>" +
        "<p>Spot the clues and you know the format before you have read it all.</p>" },

    { type: "multi", topic: "Clues on the page",
      q: "Pick the <b>three</b> clues that tell you something is a travelogue.",
      options: ["It is told by I or we.", "It moves from place to place in order.", "It uses time words like first and later.", "It has numbered steps.", "It starts with Dear."],
      answers: [0, 1, 2],
      slips: { any: "Numbered steps belong to instructions, and Dear belongs to a letter." },
      hint: "Two of these belong to other formats.",
      why: "I or we, place to place, and time words. Numbered steps are instructions; Dear is a letter." },

    { type: "mc", topic: "Clues on the page",
      q: "Odd one out. Three of these would be in a diary. Which one would not?",
      options: ["Tuesday 4th November", "I felt nervous all day.", "Dear diary, today was strange.", "2. Turn left at [[stop1]]."],
      answer: 3,
      slips: { 0: "A date at the top is a big diary clue.", 1: "Feelings are what diaries are for.", 2: "Lots of diaries start just like this." },
      hint: "Which one tells you to do something?",
      why: "A numbered step telling you to turn left belongs in instructions, not a diary.",
      lv: { spicy: { q: "Odd one out. Three of these would be in a report. Which one would not?",
        options: ["Opening times: 9am to 5pm", "Tickets cost 4 pounds.", "Getting there: take [[ride]].", "Honestly, it was the best day of my life!"],
        slips: { 0: "Opening times are a fact under a heading. Very report.", 1: "A price is a fact you could check.", 2: "A heading with a fact after it is exactly how reports work." },
        hint: "Reports keep the writer's feelings out.",
        why: "\"Best day of my life\" is a feeling. Reports stick to facts, so it belongs in a diary or a travelogue." } } },

    { type: "sort", topic: "Clues on the page",
      q: "Sort the lines. Which format did each one come from?",
      buckets: ["Letter", "Instructions"],
      cards: [["Dear Grandad,", 0], ["Love from me", 0], ["I hope you are well.", 0], ["1. Pack [[gear]].", 1], ["2. Get on [[ride]].", 1], ["3. Wait at [[stop1]].", 1]],
      slips: { any: "Lines that talk to one person go in a letter. Lines that tell you what to do go in instructions." },
      hint: "Does the line talk to someone, or tell someone what to do?",
      why: "Dear, Love from and I hope you are well talk to one person. The numbered lines tell you what to do.",
      lv: { medium: { buckets: ["Letter", "Diary", "Instructions"],
          cards: [["Dear Grandad,", 0], ["Love from me", 0], ["Friday 7th November", 1], ["I felt so excited I could not sleep.", 1], ["1. Pack [[gear]].", 2], ["2. Get on [[ride]].", 2]],
          why: "Letters talk to one person, diaries keep a date and feelings, instructions give steps." },
        spicy: { buckets: ["Diary", "Review", "Report"],
          cards: [["Friday 7th November", 0], ["I felt so excited I could not sleep.", 0], ["Three stars: good, not great.", 1], ["I would not pay that much again.", 1], ["Opening times: 9am to 5pm", 2], ["There are 40 seats in each room.", 2]],
          why: "Diaries hold dates and feelings, reviews judge and rate, reports give checkable facts." } } },

    { type: "text", topic: "Clues on the page",
      q: "Letters usually start with the same word. Which word? Type it in.",
      need: [["dear"]],
      model: "Dear",
      slips: [[["hiya", "hello", "hey"], "That works for a text message. Letters usually start with a more old fashioned word."]],
      hint: "Look back at the letter at the start. It is the very first word.",
      why: "Letters start with <b>Dear</b>, then the person's name.",
      lv: { medium: {
          q: "Finish this travelogue line with a time word at the start: \"___ we reached [[stop2]].\" Type the whole sentence.",
          need: [["then", "next", "later", "after", "finally", "soon", "eventually", "by", "at", "an hour", "in the"]],
          model: "Later we reached [[stop2]].",
          slips: [[["dear", "love from"], "That is a letter word. Try a word that says when, like later or next."]],
          hint: "Try later, next, then or after that.",
          why: "Time words like later and next move a travelogue along, so the reader can follow the journey." },
        spicy: {
          q: "You are writing a formal letter to [[boss]], who you have never met. Type the greeting you would start with.",
          need: [["dear"]],
          model: "Dear Sir or Madam,",
          slips: [[["hiya", "hi ", "hey", "yo", "alright"], "That is friendly, but you do not know this person. Formal letters start with Dear."]],
          hint: "Start with the letter word, then a polite way to address someone whose name you do not know.",
          why: "<b>Dear Sir or Madam</b> works when you do not know their name. If you do, Dear and their name is fine." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Who is it for?", title: "Why am I writing, and who will read it?",
      fig: PAF,
      html: "<p>Before you pick a format, ask two questions. <b>Why am I writing?</b> That is the purpose. <b>Who will read it?</b> That is the audience.</p>" +
        "<p>Help someone do something: <b>instructions</b>. Tell one person your news: <b>a letter</b>. Keep a private record of how you felt: <b>a diary</b>. Take a reader along on your journey: <b>a travelogue</b>.</p>",
      lv: { medium: { html: "<p>Before you pick a format, ask two questions. <b>Why am I writing?</b> (purpose) <b>Who will read it?</b> (audience)</p>" +
          "<p>Help someone do something: <b>instructions</b>. Tell one person your news: <b>a letter</b>. A private record of feelings: <b>a diary</b>. Take a reader along on the journey: <b>a travelogue</b>.</p>" +
          "<p>The audience changes the tone too. A letter to your best mate can say Hiya. A letter to [[boss]] says Dear, and stays polite.</p>" },
        spicy: { html: "<p>Editors ask: <b>purpose</b> (why), <b>audience</b> (who), then <b>format</b> (which shape) and <b>structure</b> (how it is laid out).</p>" +
          "<p>Help someone do it: instructions. News for one person: letter. Private feelings: diary. Take a reader on the journey: travelogue. Judge it: review. Inform with checkable facts: report.</p>" +
          "<p>Audience also shapes tone and layout. [[Boss]] gets a formal letter. A reader on a phone needs short paragraphs with headings, not one long block.</p>" } } },

    { type: "mc", topic: "Who is it for?",
      q: "A new [[newbie]] needs to get from [[stop1]] to [[stop2]] on their own. Which format would help most?",
      options: ["Instructions", "A diary", "A letter", "A travelogue"],
      answer: 0, fixed: true,
      slips: { 1: "A diary is for you, about your feelings. It would not tell them where to go.", 2: "A letter could work, but steps in order are much easier to follow on the way.", 3: "A travelogue tells what happened to you. They need to know what to do." },
      hint: "They need to <b>do</b> something, one step at a time.",
      why: "When someone needs to do something step by step, instructions are the format that fits." },

    { type: "mc", topic: "Who is it for?", explain: true,
      q: "You want readers to feel like they came along on [[trip]], stop by stop. Which format?",
      options: ["Instructions", "A diary", "A letter", "A travelogue"],
      answer: 3, fixed: true,
      slips: { 0: "Instructions tell people what to do, not what happened to you.", 1: "A diary is private, mostly about feelings. These readers want the journey.", 2: "A letter is for one person. This is for lots of readers." },
      hint: "Lots of readers, a journey, stop by stop.",
      why: "A travelogue takes lots of readers along on a journey, in order. That is its whole job.",
      lv: { spicy: { q: "A travel website wants something that makes readers feel they came along on [[trip]], and helps them decide if they would go. Which format fits best?",
        options: ["A report", "A diary", "A review", "A travelogue"],
        slips: { 0: "A report has the facts, but it keeps feelings out. Readers would not feel they came along.", 1: "A diary is private. A website needs something written for strangers.", 2: "A review judges, but it does not take readers along stop by stop." },
        why: "A travelogue takes readers along the journey, and a good one shows what was worth it on the way. It can include a bit of judgement, but the journey is the backbone." } } },

    { type: "match", topic: "Who is it for?",
      q: "Match each job to the format that fits it.",
      pairs: [["Tell Gran your news", "Letter"], ["Keep a private record of how you felt", "Diary"], ["Show someone how to do it", "Instructions"], ["Take readers along on the journey", "Travelogue"]],
      slips: { any: "Ask: why am I writing, and who will read it?" },
      hint: "Ask why for each one: news, feelings, help or a journey?",
      why: "News for one person: letter. Feelings for me: diary. Help: instructions. A journey for readers: travelogue.",
      lv: { spicy: { pairs: [["Tell Gran your news", "Letter"], ["Keep a private record of how you felt", "Diary"], ["Show someone how to do it", "Instructions"], ["Take readers along on the journey", "Travelogue"], ["Say if it was worth the money", "Review"], ["Give the opening times and prices", "Report"]],
        why: "Every job has a best fit. Judging is a review; checkable facts are a report." } } },

    { type: "mc", topic: "Who is it for?",
      q: "Who is a diary written for, most of the time?",
      options: ["Me, the writer", "My whole class", "Readers of a newspaper"],
      answer: 0, fixed: true,
      slips: { 1: "A diary is usually private. You would not normally share it with the class.", 2: "Newspapers want reports and articles, not someone's private diary." },
      hint: "Think about who keeps a diary, and who reads it.",
      why: "A diary is usually just for the person writing it.",
      lv: { medium: { q: "You are writing to [[boss]] to ask if you can go on [[trip]]. Which opening fits best?",
          options: ["Dear Sir or Madam, I am writing to ask if I could join the trip.", "Hiya mate! Can I come or what?", "Yo. Trip. Me. Yes?"],
          slips: { 1: "Fine for a friend, but [[boss]] is someone you need to be polite to.", 2: "Ha. Outrageous. Fun, but this reader needs a polite letter." },
          hint: "Who is the audience? Someone you know well, or someone in charge?",
          why: "Someone in charge gets a formal letter: Dear, full sentences, polite." },
        spicy: { q: "A travelogue for a website that people read on their phones. Which structure helps that reader most?",
          options: ["Short paragraphs, with a heading for each stop", "One long paragraph, so nothing breaks up the story", "Numbered steps for the reader to follow"],
          slips: { 1: "On a small screen, one huge block is hard to read. Readers lose their place.", 2: "Numbered steps are instructions. This reader wants the journey, not orders." },
          hint: "Think about reading on a small screen, maybe on a bus.",
          why: "Short paragraphs with a heading per stop let a phone reader scan, stop, and find their place again. The audience shaped the structure." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Pick and plan", title: "The shape of a travelogue",
      fig: ROUTE,
      html: "<p>A travelogue follows a route. A <b>title</b> names the trip. Then <b>setting off</b>: where you started. Then each <b>stop</b>, in the order you got there. Then <b>heading home</b>, and what you thought of it all.</p>" +
        "<p>If the reader could draw your route on a map from your writing, you have nailed it.</p>",
      lv: { spicy: { html: "<p>A travelogue follows a route: a <b>title</b>, <b>setting off</b>, each <b>stop</b> in order, then <b>heading home</b> with a look back.</p>" +
        "<p>As editor, you also choose the <b>structure</b> for your reader: one paragraph per stop, a heading for each stop on a website, a photo caption for a magazine. Same format, shaped for the audience.</p>" } } },

    { type: "order", topic: "Pick and plan",
      q: "Put the parts of a travelogue in order, first to last.",
      items: ["A title naming the trip", "Setting off: where I started", "The first stop", "The next stop", "Heading home, and what I thought"],
      slips: { any: "Follow the route: name it, set off, the stops, then home." },
      hint: "It goes the same way as the journey itself.",
      why: "Title, set off, the stops in order, then home. Just like the route." },

    { type: "mc", topic: "Pick and plan",
      q: "Which is the best title for a travelogue?",
      options: ["[[Trip]]: a journey in three stops", "How to pack a bag", "Dear Gran"],
      answer: 0,
      slips: { 1: "That is a title for instructions.", 2: "That is how a letter starts, not a title." },
      hint: "Which one names the trip?",
      why: "A travelogue title names the journey, so the reader knows where they are going.",
      lv: { spicy: { q: "Which title would hook a reader for a travelogue on a website?",
        options: ["[[Trip]]: three stops I will never forget", "A report on the facilities at [[stop2]]", "Instructions for visiting [[stop1]]"],
        slips: { 1: "Fine for a report, but it promises facts, not a journey.", 2: "That promises steps to follow, not a journey to come along on." },
        hint: "Which one names the journey and makes you want to come along?",
        why: "It names the trip, promises stops, and hints at feelings. Readers want to know what happened." } } },

    { type: "mc", topic: "Pick and plan",
      q: "Jay went bird watching and wants his class to picture every stop along the way. What should he write?",
      fig: '<svg viewBox="0 0 340 150" role="img" aria-label="Jay with a bird">' + A2ART.jay(110, 46, 0.9, "wow") +
        A2ART.egg(A2ART.bird(240, 70, 1.1, "#ff5d5d"), "A robin. Jay says he could watch them all day. He has, once.") + '</svg>',
      options: ["A travelogue", "Instructions", "A diary that nobody reads"],
      answer: 0,
      slips: { 1: "Instructions would tell the class what to do, not what Jay saw.", 2: "A private diary would not reach the class at all." },
      hint: "Readers, a journey, every stop.",
      why: "Readers picturing every stop of a journey: a travelogue. Probably with far too many birds in it." },

    { type: "text", topic: "Pick and plan", stretch: true,
      q: "Have a go at the first sentence of a travelogue about [[trip]]. Use I or we.",
      need: [["i", "we", "my", "our"]],
      model: "At nine o'clock I climbed into [[ride]] and we set off.",
      hint: "Say when and how you set off. Start with At or First if you like.",
      why: "A good opening says when you set off and how, told by I or we. The reader is already on the way with you." }
  ],

  realWorld: {
    title: "Picking a format is an everyday thing",
    html: "<p>Adults do this all the time: a quick message to a friend, a polite email to a boss, step by step notes for a new worker, a review of a holiday. Same news, different shape.</p>" +
      "<p>And for our big question: if we could time travel, a traveller would need all of them. Instructions to work the machine, a diary for the scary bits, a letter home, and a travelogue so everyone else can come along.</p>",
    fig: '<svg viewBox="0 0 440 150" role="img" aria-label="A portal with four kinds of writing coming out">' + A2ART.portal(80, 75, 58) +
      page("letter", 168, 10).replace('translate(168 10)', 'translate(168 10) scale(.95)') + page("trav", 290, 10).replace('translate(290 10)', 'translate(290 10) scale(.95)') + '</svg>'
  },

  make: {
    title: "Make a format card",
    intro: "A job, the format you would pick, and why. Stick it by your desk or send it to Jay.",
    fields: [
      { id: "job", label: "The job", ph: "Tell my nan about the trip", max: 60 },
      { id: "fmt", label: "The format I would pick", ph: "A letter", max: 24 },
      { id: "why", label: "Why it fits", ph: "She loves getting post", max: 70 }
    ],
    svg: function(v){
      function e(t){ return String(t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n, m){ var w = String(t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n){ if(cur.trim()) out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, m); }
      var job = wrap(v.job, 30, 2), why = wrap(v.why, 36, 2), fmt = wrap(v.fmt, 16, 2);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380">' +
        '<rect width="600" height="380" rx="24" fill="#fdf6e3"/>' +
        '<rect x="14" y="14" width="572" height="352" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        '<path d="M14 92h572" stroke="#141a33" stroke-width="3" stroke-dasharray="10 8"/>' +
        '<text x="40" y="66" font-family="Verdana,Arial,sans-serif" font-size="24" font-weight="700" fill="#2f6fb0" letter-spacing="3">FORMAT PICK</text>' +
        '<text x="40" y="132" font-family="Verdana,Arial,sans-serif" font-size="17" fill="#5b6180">The job</text>' +
        job.map(function(l, k){ return '<text x="40" y="' + (164 + k * 32) + '" font-family="Verdana,Arial,sans-serif" font-size="26" font-weight="700" fill="#141a33">' + e(l) + '</text>'; }).join("") +
        '<text x="40" y="268" font-family="Verdana,Arial,sans-serif" font-size="17" fill="#5b6180">Why it fits</text>' +
        why.map(function(l, k){ return '<text x="40" y="' + (298 + k * 28) + '" font-family="Verdana,Arial,sans-serif" font-size="21" fill="#141a33">' + e(l) + '</text>'; }).join("") +
        '<g transform="translate(486 196) rotate(8)"><rect x="-80" y="-58" width="160" height="116" rx="12" fill="#ffd23f" stroke="#141a33" stroke-width="3"/>' +
        '<text y="-26" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="15" fill="#141a33">I would pick</text>' +
        fmt.map(function(l, k){ return '<text y="' + (8 + k * 26) + '" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="21" font-weight="700" fill="#141a33">' + e(l) + '</text>'; }).join("") + '</g>' +
        '</svg>';
    }
  }
};
})();
