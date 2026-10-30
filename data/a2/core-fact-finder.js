/* Base 5 core target activity: Fact finder.
   English. Finding simple facts in short texts: who, where, when, how
   many, how much. Tickets and fact files drawn in SVG. Replayable: most
   questions have two extra versions for the next goes. ASCII only. */
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
function P(t){ return '<p class="a2task">' + t + '</p>'; }
function ext(a, b){ for(var k in b) if(Object.prototype.hasOwnProperty.call(b, k)) a[k] = b[k]; return a; }
function S(type, topic, o, vary){ var s = ext({ type: type, topic: topic }, o); if(vary) s.vary = vary; return s; }
var PD = '&#163;';

/* question words and the kind of fact each one hunts for */
var QW = '<svg viewBox="0 0 520 200" role="img" aria-label="Question words: who hunts for a person, where for a place, when for a time or day, how many for a number">' +
  '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  [["WHO?", "a person", "#ffd23f", '<circle cx="0" cy="-10" r="12" fill="#f6d1b0" stroke="#141a33" stroke-width="2.5"/><path d="M-20 22q20 -22 40 0z" fill="#22b8e6" stroke="#141a33" stroke-width="2.5"/>'],
   ["WHERE?", "a place", "#19c39a", '<path d="M0 24q-20 -22 -20 -34a20 20 0 0 1 40 0q0 12 -20 34z" fill="#ff5d5d" stroke="#141a33" stroke-width="2.5"/><circle cx="0" cy="-10" r="7" fill="#ffffff"/>'],
   ["WHEN?", "a time or day", "#22b8e6", '<circle r="22" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/><path d="M0 0v-14M0 0h10" stroke="#141a33" stroke-width="3" stroke-linecap="round"/>'],
   ["HOW MANY?", "a number", "#ff5d8f", T(0, 10, "123", 24, { a: "middle", b: 1 })]
  ].map(function(c, k){
    var x = 66 + k * 129;
    return '<g transform="translate(' + x + ' 0)"><rect x="-56" y="18" width="112" height="164" rx="14" fill="' + c[2] + '" fill-opacity=".3" stroke="#141a33" stroke-width="2"/>' +
      T(0, 46, c[0], 15, { a: "middle", b: 1 }) + '<g transform="translate(0 96)">' + c[3] + '</g>' +
      T(0, 150, "hunt for", 12, { a: "middle" }) + T(0, 168, c[1], 13, { a: "middle", b: 1 }) + '</g>';
  }).join("") +
  A.egg(A.bird(492, 16, 0.5, "#8a5cf6"), "WHAT kind of bird? A small purple one. WHERE? Top corner. WHEN? Right now. Fact found.") +
  '</svg>';

/* ---------- tickets: three, one per go ---------- */
var TK = [
  { day: "Saturday", date: "Saturday 14 June", old: "Friday 13 June", doors: "6.30pm", start: "7pm", last: "7.15pm", end: "9.30pm", row: "D", seat: 12, door: 3, adult: 8, child: 5 },
  { day: "Friday", date: "Friday 3 May", old: "Thursday 2 May", doors: "7pm", start: "7.30pm", last: "7.45pm", end: "10pm", row: "B", seat: 4, door: 1, adult: 12, child: 7 },
  { day: "Sunday", date: "Sunday 21 September", old: "Saturday 20 September", doors: "1pm", start: "2pm", last: "2.15pm", end: "4.30pm", row: "K", seat: 20, door: 2, adult: 6, child: 4 }
];
function ticket(d, lv, egg){
  var rows = lv === "spicy" ?
    ["Date: " + d.date, "(moved from " + d.old + ")", "Doors " + d.doors + "  |  Show " + d.start, "Last entry " + d.last + "  |  Ends about " + d.end,
     "Upper Circle, Row " + d.row + ", Seat " + d.seat + ", use door " + d.door, "Adult " + PD + d.adult + "  |  Under 16 " + PD + d.child, "Booking fee 50p per ticket"] :
    lv === "medium" ?
    ["Date: " + d.date, "Doors open: " + d.doors, "Starts: " + d.start + "  |  Ends: " + d.end, "Seat: Row " + d.row + ", Seat " + d.seat, "Adult " + PD + d.adult + "  |  Under 16 " + PD + d.child] :
    ["Date: " + d.date, "Starts: " + d.start, "Seat: Row " + d.row + ", Seat " + d.seat, "Price: " + PD + d.adult];
  var h = 110 + rows.length * 24;
  return '<svg viewBox="0 0 520 ' + h + '" role="img" aria-label="A ticket for [[show]] at [[venue]]. ' + esc(rows.join(". ")).replace(/&amp;#163;/g, "pounds ") + '">' +
    '<rect x="6" y="6" width="508" height="' + (h - 12) + '" rx="14" fill="#fff4d6" stroke="#141a33" stroke-width="2.5"/>' +
    '<path d="M404 14v' + (h - 28) + '" stroke="#141a33" stroke-width="2" stroke-dasharray="6 5"/>' +
    '<rect x="6" y="6" width="398" height="40" rx="14" fill="#ff8a5c" fill-opacity=".5"/>' +
    T(24, 34, "[[Show]]", 20, { b: 1 }) + T(24, 70, "[[Venue]]", 14, { c: "#3a4060" }) +
    rows.map(function(r, k){ return T(24, 102 + k * 24, r, 14); }).join("") +
    '<g transform="translate(460 ' + (h / 2) + ') rotate(-90)">' + T(0, 6, "ADMIT ONE", 16, { a: "middle", b: 1, c: "#3a4060" }) + '</g>' +
    (egg ? A.egg(A.bird(460, h - 34, 0.55, "#3a8fd6"), "A bird with no ticket. It is going to watch from the roof for free.") : "") +
    '</svg>';
}
function tf(d, egg){ return { fig: ticket(d, "mild", egg), lv: { medium: { fig: ticket(d, "medium", egg) }, spicy: { fig: ticket(d, "spicy", egg) } } }; }
var DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
function qDay(d){
  var o = DAYS.filter(function(x){ return x !== d.day; });
  var others = [o[d.seat % 6], o[(d.seat + 3) % 6]];
  return { q: "What day is it on?", fig: ticket(d, "mild"),
    options: [d.day, others[0], others[1]], answer: 0,
    slips: { any: "Find the word <b>Date</b> on the ticket. The day is right after it." },
    hint: "Look for the word Date.",
    why: "The ticket says <b>" + d.date + "</b>, so it is on a " + d.day + ".",
    ez: { slips: { any: "Find <b>Date</b>. The day comes next." }, why: "It says <b>" + d.date + "</b>." },
    lv: { medium: { fig: ticket(d, "medium") },
      spicy: { q: "What date should you go?", fig: ticket(d, "spicy"),
        options: [d.date, d.old, "Any day that week"],
        slips: { 1: "That was the old date. The ticket says it moved.", 2: "The ticket gives one date." },
        why: "It moved from " + d.old + " to <b>" + d.date + "</b>. Read the small line under the date." } } };
}
function qStart(d){
  return { q: "What time does it start?", fig: ticket(d, "mild"),
    options: [d.start, "Row " + d.row, "&pound;" + d.adult], answer: 0,
    slips: { 1: "That is where you sit.", 2: "That is the price." },
    hint: "A time has am or pm.",
    why: "<b>" + d.start + "</b>. A time is easy to scan for: look for pm.",
    ez: { why: "<b>" + d.start + "</b>. Look for pm." },
    lv: {
      medium: { fig: ticket(d, "medium"), options: [d.start, d.doors, d.end],
        slips: { 1: "That is when the doors open. It starts a bit later.", 2: "That is when it ends." },
        why: "It starts at <b>" + d.start + "</b>. Doors open at " + d.doors + ", so you can get your seat first." },
      spicy: { q: "What time does the show itself start?", fig: ticket(d, "spicy"), options: [d.start, d.doors, d.last, d.end],
        slips: { 1: "That is when the doors open.", 2: "That is the latest you can get in.", 3: "That is roughly when it ends." },
        why: "Four times on one ticket. The show starts at <b>" + d.start + "</b>." } } };
}
function qPrice(d){
  return { q: "How much is a ticket?", fig: ticket(d, "mild"),
    boxes: [{ label: "Price", a: d.adult, pre: "&pound;" }],
    slips: [[d.seat, "That is your seat number. Look for the pound sign."]],
    hint: "Look for the pound sign.",
    why: "The ticket says <b>&pound;" + d.adult + "</b>.",
    ez: { slips: [[d.seat, "That is your seat. Look for &pound;."]], hint: "Look for &pound;." },
    lv: {
      medium: { q: "You are under 16. How much is your ticket?", fig: ticket(d, "medium"),
        boxes: [{ label: "Price", a: d.child, pre: "&pound;" }],
        slips: [[d.adult, "That is the adult price. Find Under 16."]],
        why: "Under 16 is <b>&pound;" + d.child + "</b>." },
      spicy: { q: "One adult ticket, with the booking fee. How much altogether?", fig: ticket(d, "spicy"),
        boxes: [{ label: "Total", a: d.adult + 0.5, pre: "&pound;" }],
        slips: [[d.adult, "Nearly. Add the 50p booking fee."], [d.child + 0.5, "That is the under 16 price plus the fee."]],
        hint: "Adult price, plus 50p.",
        why: "&pound;" + d.adult + " + 50p = <b>&pound;" + (d.adult + 0.5).toFixed(2) + "</b>." } } };
}
function qSeat(d){
  return { q: "Where will you sit?", fig: ticket(d, "mild"),
    options: ["Row " + d.row + ", Seat " + d.seat, "Row " + d.seat + ", Seat " + d.row, "Row " + d.start], answer: 0,
    slips: { 1: "Swapped round. On this ticket, rows are letters and seats are numbers.", 2: "That is the start time." },
    hint: "Find the word Seat.",
    why: "<b>Row " + d.row + ", Seat " + d.seat + "</b>.",
    ez: { slips: { 1: "Swapped round. Rows are letters here.", 2: "That is the start time." } },
    lv: {
      medium: { fig: ticket(d, "medium") },
      spicy: { q: "Which door should you use?", fig: ticket(d, "spicy"),
        options: ["Door " + d.door, "Door " + d.seat, "Door " + d.row],
        slips: { 1: "That is your seat number.", 2: "That is your row." },
        why: "The seat line ends with <b>use door " + d.door + "</b>. Easy to miss at the end of a line." } } };
}

/* ---------- fact files: three animals, one per go ---------- */
var ROBIN = '<g transform="translate(0 6)">' + A.bird(0, 0, 2.2, "#8a5a36") + '<ellipse cx="18" cy="2" rx="13" ry="14" fill="#f2702a"/></g>';
var HOG = '<g><path d="M-48 18q4 -50 48 -52q40 0 46 46z" fill="#7a4c2c" stroke="#141a33" stroke-width="2.5"/>' +
  '<path d="M-40 -6l-8 -10M-28 -22l-6 -14M-12 -30l-2 -14M6 -32l4 -14M22 -26l8 -12M34 -14l12 -8" stroke="#3b2414" stroke-width="4" stroke-linecap="round"/>' +
  '<path d="M46 12q12 -2 18 6q-8 8 -20 4z" fill="#d9b48a" stroke="#141a33" stroke-width="2"/><circle cx="64" cy="18" r="3" fill="#141a33"/><circle cx="50" cy="10" r="2.5" fill="#141a33"/>' +
  '<path d="M-30 18v8M-6 18v8M20 18v8" stroke="#3b2414" stroke-width="5" stroke-linecap="round"/></g>';
var OWL = '<g><ellipse cx="0" cy="12" rx="36" ry="44" fill="#c98b3e" stroke="#141a33" stroke-width="2.5"/>' +
  '<path d="M0 -36q-34 -4 -30 26q4 26 30 30q26 -4 30 -30q4 -30 -30 -26z" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
  '<circle cx="-11" cy="-8" r="5" fill="#141a33"/><circle cx="11" cy="-8" r="5" fill="#141a33"/><path d="M-3 4l3 8 3 -8z" fill="#c98b3e"/>' +
  '<path d="M-12 54l-4 8M-4 54v8M12 54l4 8M4 54v8" stroke="#f2a516" stroke-width="3" stroke-linecap="round"/></g>';
var FF = [
  { name: "robin", Name: "Robin", pic: ROBIN, look: "Brown back and an orange red chest", eats: "Worms, insects and seeds", lives: "Gardens, parks and woods", size: 14,
    fun: "Robins sing all year round, even in winter.", extra: "Most robins live for about 2 years.", n2: 2, no: "Fish",
    keys: ["worm", "insect", "seed", "garden", "park", "wood", "brown", "orange", "red", "14", "sing", "winter", "2 years", "two years"],
    para: "The robin is one of the easiest garden birds to spot, thanks to its orange red chest and brown back. It feeds mostly on worms, insects and seeds, and lives in gardens, parks and woods. It is only about 14 cm long. Robins sing all year round, even in winter. Most live for about 2 years." },
  { name: "hedgehog", Name: "Hedgehog", pic: HOG, look: "Brown, with about 5000 spines", eats: "Beetles, worms and slugs", lives: "Hedges, gardens and woods", size: 25,
    fun: "Hedgehogs sleep all winter. This is called hibernating.", extra: "A hedgehog can walk about 2 km in one night.", n2: 5000, no: "Grass",
    keys: ["beetle", "worm", "slug", "hedge", "garden", "wood", "brown", "spine", "5000", "25", "sleep", "hibernat", "winter", "2 km", "night"],
    para: "Hedgehogs are brown, and covered in about 5000 spines. They hunt at night for beetles, worms and slugs, and live in hedges, gardens and woods. A grown hedgehog is about 25 cm long. They sleep all winter, which is called hibernating. One can walk about 2 km in a single night." },
  { name: "barn owl", Name: "Barn owl", pic: OWL, look: "White face and a golden brown back", eats: "Mice and voles", lives: "Barns, farmland and old trees", size: 35,
    fun: "Barn owls do not hoot. They screech.", extra: "A barn owl can turn its head about 270 degrees.", n2: 270, no: "Fruit",
    keys: ["mice", "mouse", "vole", "barn", "farm", "tree", "white", "golden", "brown", "35", "hoot", "screech", "270", "head"],
    para: "With its white, heart shaped face and golden brown back, the barn owl is hard to mistake. It hunts mice and voles over farmland, and nests in barns and old trees. It is about 35 cm long. Barn owls do not hoot: they screech. One can turn its head about 270 degrees." }
];
function factfile(d, lv, egg){
  var top = '<rect x="6" y="6" width="508" height="36" rx="12" fill="#19c39a" fill-opacity=".45"/>' + T(24, 31, "FACT FILE: " + d.Name.toUpperCase(), 17, { b: 1 }) +
    '<circle cx="92" cy="140" r="70" fill="#e8f7ff" stroke="#141a33" stroke-width="2"/><g transform="translate(92 140)">' + d.pic + '</g>' +
    (egg ? A.egg('<g transform="translate(92 236)">' + A.bonnie(0, 0, 0.32, "sit") + '</g>', "Bonnie would like a fact file too. Eats: biscuits. Lives: on the sofa. Size: small but loud.") : "");
  var body = "", y = 70;
  if(lv === "spicy"){
    wrap(d.para, 37, 12).forEach(function(l){ body += T(186, y, esc(l), 14); y += 21; });
  } else {
    var rows = [["Looks like", d.look], ["Eats", d.eats], ["Lives", d.lives], ["Size", "About " + d.size + " cm long"]];
    if(lv === "medium") rows.push(["Did you know?", d.fun + " " + d.extra]);
    rows.forEach(function(r){
      body += T(186, y, r[0], 13, { b: 1, c: "#1d5f99" });
      wrap(r[1], 38, 3).forEach(function(l){ y += 19; body += T(186, y, esc(l), 14); });
      y += 26;
    });
  }
  var h = Math.max(y + 4, 260);
  return '<svg viewBox="0 0 520 ' + h + '" role="img" aria-label="A fact file about the ' + d.name + '">' +
    '<rect x="6" y="6" width="508" height="' + (h - 12) + '" rx="12" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' + top + body + '</svg>';
}
function fq(d, o, med, spi){
  o.fig = factfile(d, "mild");
  o.lv = { medium: ext({ fig: factfile(d, "medium") }, med || {}), spicy: ext({ fig: factfile(d, "spicy") }, spi || {}) };
  return o;
}
function qEats(d){
  return fq(d, { q: "What does a " + d.name + " eat?", options: [d.eats, d.lives, d.look], answer: 0,
    slips: { 1: "That is where it lives.", 2: "That is what it looks like." },
    hint: "Find the word Eats.", why: "<b>" + d.eats + "</b>. The label Eats takes you straight there.",
    ez: { why: "<b>" + d.eats + "</b>. Look under Eats." } }, null,
    { options: [d.eats, d.lives, d.look, d.no], slips: { 1: "That is where it lives.", 2: "That is what it looks like.", 3: "Is that anywhere in the text? Only pick what you can point to." },
      hint: "No labels this time. Scan for food words.", why: "<b>" + d.eats + "</b>. With no labels, you scan for food words instead." });
}
function qLives(d){
  return fq(d, { q: "Where does a " + d.name + " live?", options: [d.lives, d.eats, "About " + d.size + " cm"], answer: 0,
    slips: { 1: "That is what it eats.", 2: "That is its size." },
    hint: "Where questions want a place.", why: "<b>" + d.lives + "</b>. Where wants a place." }, null,
    { hint: "Scan for place words.", why: "<b>" + d.lives + "</b>. Places are easy to scan for: gardens, woods, farms." });
}
function qSize(d){
  return fq(d, { q: "How long is a " + d.name + "?", boxes: [{ label: "Length", a: d.size, post: "cm" }],
    slips: [[d.n2, "That number is about something else. Find the one with cm."]],
    hint: "Look for cm.", why: "About <b>" + d.size + " cm</b>.",
    ez: { slips: [[d.n2, "Find the number with cm."]] } }, null,
    { hint: "There is more than one number. Which has cm after it?", why: "About <b>" + d.size + " cm</b>. The other number is about something else, so the cm was the clue." });
}
function qAny(d){
  return fq(d, { q: "Type <b>one</b> fact about the " + d.name + " from the fact file. Copy it, or use your own words.",
    need: [d.keys], model: d.Name + "s eat " + d.eats.toLowerCase() + ".",
    hint: "Pick any row and copy it out.", why: "Anything the fact file says counts, like \"" + d.Name + "s eat " + d.eats.toLowerCase() + "\".",
    ez: { q: "Type <b>1</b> fact about the " + d.name + ".", hint: "Copy any row.", why: "Any fact from the file counts." } });
}

/* ---------- in the text or not: three short texts, one per go ---------- */
var IN = [
  { text: "The lighthouse is on a small island. It is 30 metres tall. It is painted red and white. A keeper lived there until 1990.",
    yes: ["It is 30 metres tall.", "It is on a small island.", "It is painted red and white."], no: ["It is the tallest lighthouse in England.", "The keeper had a dog."], opp: ["It is painted blue."] },
  { text: "Ravi's shop opens at 9. It sells bread, milk and comics. It is closed on Sundays. Ravi has run it for 20 years.",
    yes: ["It sells comics.", "It opens at 9.", "Ravi has run it for 20 years."], no: ["It sells sweets.", "Ravi is 60 years old."], opp: ["It is open on Sundays."] },
  { text: "The school field has 2 goals and a running track. It gets very muddy in winter. Rabbits live under the hedge.",
    yes: ["Rabbits live under the hedge.", "There are 2 goals.", "There is a running track."], no: ["Foxes live there too.", "The track is 400 metres long."], opp: ["It stays dry all winter."] }
];
function qIn(d){
  return { q: P(d.text) + "Sort them. Does the text say it?",
    buckets: ["The text says it", "The text does not say it"],
    cards: [[d.yes[0], 0], [d.yes[1], 0], [d.no[0], 1], [d.no[1], 1]],
    slips: { any: "Only put it in \"says it\" if you can point to the words." },
    hint: "Can you put your finger on it?",
    why: "If you can point to it, the text says it. Sensible guesses do not count.",
    ez: { slips: { any: "Can you point to the words?" }, why: "Point to it? Then the text says it." },
    lv: {
      medium: { cards: [[d.yes[0], 0], [d.yes[1], 0], [d.yes[2], 0], [d.no[0], 1], [d.no[1], 1]] },
      spicy: { q: P(d.text) + "Sort them. Does the text say it, say the opposite, or not say at all?",
        buckets: ["The text says it", "The text says the opposite", "The text does not say"],
        cards: [[d.yes[0], 0], [d.yes[2], 0], [d.opp[0], 1], [d.no[0], 2], [d.no[1], 2]],
        slips: { any: "\"Says the opposite\" means the text tells you it is not true. \"Does not say\" means it never comes up." },
        why: "Three kinds: it says so, it says the opposite, or it never comes up. Only the first counts as a fact from the text." } } };
}

(window.A2PACKS = window.A2PACKS || {})["core-fact-finder"] = {
  a2: true,
  id: "a2-core-fact-finder",
  title: "Fact finder",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "Hunting for facts in short texts: who, where, when, how many, how much.",
  blurb: "The question tells you what to hunt for, then you scan for it. Tickets, fact files and short texts, in four chunks, with a fact file of your own to make at the end. New tickets and animals each time you come back.",
  note: "Fact finder: hunting for facts in tickets, fact files and short texts. Four five minute chunks and a fact file to make. Different ones each time you come back, so have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Spotter", line: "Spotter: short texts with labels, one fact at a time." },
    { id: "medium", name: "Tracker", line: "Tracker: more facts on the page, and some that look alike." },
    { id: "spicy", name: "Detective", line: "Detective: no labels, small print, and facts that hide at the end of a line." }
  ],
  themes: {
    time: { name: "Time travel", w: { show: "Time Travel Live", venue: "The Time Museum", who: "Zed the time traveller" } },
    football: { name: "Football", w: { show: "The Cup Final", venue: "City Stadium", who: "the goalkeeper" } },
    horror: { name: "Horror", w: { show: "Midnight Ghost Tour", venue: "The Old Hotel", who: "the night guard" } },
    fishing: { name: "Fishing", w: { show: "Lake Fishing Match", venue: "Willow Lake", who: "the angler" } },
    music: { name: "Music", w: { show: "The Big Gig", venue: "The Concert Hall", who: "the drummer" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: QW,
  steps: [

    /* ---------- chunk 1: the question tells you what to hunt for ---------- */
    { type: "learn", topic: "Question words", title: "The question tells you what to hunt for",
      fig: QW,
      html: "<p>A <b>fact</b> is a bit of information the text gives you.</p>" +
        "<p>Before you look, check the question word. <b>Who</b> wants a person. <b>Where</b> wants a place. <b>When</b> wants a time or a day. <b>How many</b> wants a number.</p>" +
        "<p>Then you know what you are hunting for.</p>",
      lv: {
        medium: { html: "<p>A <b>fact</b> is a bit of information the text gives you.</p><p>The question word tells you what kind of fact to hunt for: <b>who</b> (a person), <b>where</b> (a place), <b>when</b> (a time or day), <b>how many</b> (a number), <b>how much</b> (a price or amount).</p>" +
          "<p>Texts often have lots of facts of the same kind, like three different times. Read the question carefully to know which one you want.</p>" },
        spicy: { html: "<p>A <b>fact</b> is a bit of information the text gives you. The question word tells you what kind: <b>who, where, when, how many, how much, why</b>.</p>" +
          "<p>The rest of the question narrows it down. \"When does it <b>start</b>?\" and \"When do the <b>doors open</b>?\" both want a time, but not the same one.</p>" +
          "<p>Sometimes a fact has changed (\"moved from Friday\"), or sits at the very end of a line. Read the whole line before you answer.</p>" } },
      ez: { title: "What to hunt for", html: "<p>The <b>question word</b> tells you what to find.</p><p>Who: a person. Where: a place. When: a time. How many: a number.</p>" } },

    { type: "match", topic: "Question words",
      q: "Match each question word to the kind of fact it hunts for.",
      pairs: [["Who?", "A person"], ["Where?", "A place"], ["When?", "A time or day"], ["How many?", "A number"]],
      slips: { any: "Look at the picture. Each word has its own kind of answer." },
      hint: "Who is about people.",
      why: "Who: a person. Where: a place. When: a time or day. How many: a number.",
      ez: { q: "Match each word to what it hunts for.", slips: { any: "Look at the picture." } },
      lv: {
        medium: { pairs: [["Who?", "A person"], ["Where?", "A place"], ["When?", "A time or day"], ["How many?", "A number"], ["How much?", "A price or amount"]] },
        spicy: { pairs: [["Who?", "A person"], ["Where?", "A place"], ["When?", "A time or day"], ["How many?", "A number of things"], ["How much?", "A price or amount"], ["Why?", "A reason"]] } } },

    S("mc", "Question words", {
      q: P("Kit has a cat called Pickle. Pickle is black and white. He is six years old.") + "What is the cat called?",
      options: ["Pickle", "Kit", "Black and white"], answer: 0,
      slips: { 1: "Kit is the person who owns the cat.", 2: "That is the colour." },
      hint: "Find the word called.",
      why: "\"A cat called <b>Pickle</b>.\"",
      lv: {
        medium: { q: P("Kit lives on Mill Road with her gran and a cat called Pickle. Pickle is black and white, and he is six years old. He sleeps on Gran's bed every night.") + "Where does Pickle sleep?",
          options: ["On Gran's bed", "On Mill Road", "With Kit", "In a basket"],
          slips: { 1: "That is the road they live on.", 2: "He lives with Kit, but where does he sleep?", 3: "That is not in the text." },
          hint: "Find the word sleeps.", why: "\"He sleeps on <b>Gran's bed</b> every night.\"" },
        spicy: { q: P("Kit, who lives on Mill Road with her gran, adopted Pickle from a rescue centre three years ago. He was three then: a skinny black and white kitten who hid under the sofa for a week. Now he sleeps on Gran's bed every night.") + "How old is Pickle now?",
          options: ["Six", "Three", "One week", "It does not say"],
          slips: { 1: "That is how old he was when Kit adopted him.", 2: "That is how long he hid under the sofa.", 3: "Not in one place, but you can put two facts together." },
          hint: "Two facts: how old he was, and how long ago.", why: "He was three, three years ago, so he is <b>six</b> now. Two facts, put together." } } },
      [ { q: P("The bus to town leaves at 8 o'clock. It is the number 42. It stops outside the shop.") + "What number is the bus?",
          options: ["42", "8", "The shop"], answer: 0,
          slips: { 1: "8 is the time it leaves.", 2: "That is where it stops." },
          hint: "Find the word number.", why: "\"It is the number <b>42</b>.\"",
          lv: {
            medium: { q: P("The number 42 bus leaves the park at 8.15 every morning. It stops outside the post office and gets to town at 8.40. On Sundays it does not run.") + "What time does the bus get to town?",
              options: ["8.40", "8.15", "42", "Sunday"],
              slips: { 1: "That is when it leaves the park.", 2: "That is the bus number.", 3: "That is when it does not run." },
              hint: "Find the words gets to town.", why: "\"Gets to town at <b>8.40</b>.\"" },
            spicy: { q: P("From Monday, the number 42 will leave the park ten minutes earlier than now, at 8.05. It will still stop outside the post office, and should reach town by 8.30. There is still no Sunday bus.") + "What time will the bus leave the park from Monday?",
              options: ["8.05", "8.30", "10 minutes", "Monday"],
              slips: { 1: "That is when it reaches town.", 2: "That is how much earlier, not the time.", 3: "That is when the change starts." },
              hint: "Find the word leave.", why: "\"Leave the park ... at <b>8.05</b>.\"" } } },
        { q: P("Bonnie went to the vet on Tuesday. The vet was called Sam. Bonnie was very good.") + "When did Bonnie go to the vet?",
          options: ["Tuesday", "Sam", "The vet"], answer: 0,
          slips: { 1: "Sam is a who, not a when.", 2: "That is where she went." },
          hint: "When wants a day or a time.", why: "\"On <b>Tuesday</b>.\"",
          lv: {
            medium: { q: P("On Tuesday morning, Bonnie had her check up at Green Lane Vets. The vet, Sam, said her teeth were perfect. She got a biscuit for sitting still.") + "Who is the vet?",
              options: ["Sam", "Bonnie", "Green Lane", "Jay"],
              slips: { 1: "Bonnie is the patient.", 2: "That is the name of the place.", 3: "Jay is not in this text." },
              hint: "Who wants a person.", why: "\"The vet, <b>Sam</b>.\"" },
            spicy: { q: P("Bonnie's check up was booked for Monday, but Green Lane Vets rang to move it to Tuesday morning. Sam, the vet who usually sees her, was off sick, so a vet called Priya checked her over instead.") + "Who checked Bonnie over?",
              options: ["Priya", "Sam", "Green Lane", "Bonnie"],
              slips: { 1: "Sam usually sees her, but was off sick.", 2: "That is the place.", 3: "Bonnie is the patient." },
              hint: "Read to the end of the sentence.", why: "Sam was off sick, so <b>Priya</b> checked her. The fact changed halfway through the text." } } } ]),

    S("num", "Question words", {
      q: P("The garden club planted 12 sunflowers and 5 apple trees. 3 birds have moved into the bird box.") + "How many apple trees did they plant?",
      boxes: [{ label: "Apple trees", a: 5 }],
      slips: [[12, "12 is the sunflowers. Find the words apple trees."], [3, "3 is the birds."]],
      hint: "Find the words apple trees. The number is just before.",
      ez: { hint: "Find the words apple trees." },
      why: "\"<b>5</b> apple trees.\"",
      lv: {
        medium: { q: P("The garden club meets every Thursday. This year they planted 12 sunflowers, 5 apple trees and 8 rows of potatoes. 3 birds have already moved into the new bird box, and 2 hedgehogs visit at night.") + "How many rows of potatoes did they plant?",
          boxes: [{ label: "Rows", a: 8 }],
          slips: [[12, "12 is the sunflowers."], [5, "5 is the apple trees."], [3, "3 is the birds."]],
          hint: "Find potatoes.", why: "\"<b>8</b> rows of potatoes.\"" },
        spicy: { q: P("The garden club meets every Thursday. This year they planted a dozen sunflowers, five apple trees and twice as many pear trees. Three blue tits have already moved into the bird box.") + "How many sunflowers did they plant?",
          boxes: [{ label: "Sunflowers", a: 12 }],
          slips: [[5, "5 is the apple trees."], [10, "10 is the pear trees."], [3, "3 is the blue tits."]],
          hint: "How many is a dozen?", why: "A dozen is <b>12</b>. Numbers can hide as words." } } },
      [ { q: P("The cafe sells 4 kinds of cake. A drink costs 2 pounds. It is open 6 days a week.") + "How many kinds of cake does it sell?",
          boxes: [{ label: "Kinds of cake", a: 4 }],
          slips: [[2, "2 is the price of a drink."], [6, "6 is the days it is open."]],
          hint: "Find the word cake.", why: "\"<b>4</b> kinds of cake.\"",
          lv: {
            medium: { q: P("The cafe on the corner sells 4 kinds of cake and 9 kinds of sandwich. A drink costs 2 pounds. It is open 6 days a week, and has 15 tables.") + "How many tables does it have?",
              boxes: [{ label: "Tables", a: 15 }],
              slips: [[4, "4 is the cakes."], [9, "9 is the sandwiches."], [6, "6 is the days."]],
              hint: "Find the word tables.", why: "\"<b>15</b> tables.\"" },
            spicy: { q: P("The corner cafe now sells nine sandwiches, half a dozen cakes and three soups. It is open every day except Monday, and seats forty people.") + "How many days a week is it open?",
              boxes: [{ label: "Days", a: 6 }],
              slips: [[7, "Every day except Monday: take one away."], [9, "9 is the sandwiches."], [3, "3 is the soups."]],
              hint: "Every day except one.", why: "Every day except Monday is <b>6</b> days. The fact is there, but you have to work it out." } } },
        { q: P("Jay saw 7 birds on Monday. On Tuesday he saw 3. He wrote them all in his notebook.") + "How many birds did Jay see on Tuesday?",
          boxes: [{ label: "Birds", a: 3 }],
          slips: [[7, "7 is Monday."], [10, "That adds both days. The question is only about Tuesday."]],
          ez: { slips: [[7, "7 is Monday."], [10, "Just Tuesday, not both days."]] },
          hint: "Find Tuesday.", why: "\"On Tuesday he saw <b>3</b>.\"",
          lv: {
            medium: { q: P("Jay keeps a bird notebook. On Monday he saw 7 birds, including 2 robins. On Tuesday it rained and he saw only 3. On Wednesday he saw 11, his best day.") + "How many birds did Jay see on Wednesday?",
              boxes: [{ label: "Birds", a: 11 }],
              slips: [[7, "7 is Monday."], [3, "3 is Tuesday."], [2, "2 is the robins on Monday."]],
              hint: "Find Wednesday.", why: "\"On Wednesday he saw <b>11</b>.\"" },
            spicy: { q: P("Jay's bird notebook: Monday was a quiet seven. Tuesday, washed out, managed just three. Wednesday brought eleven, including a pair of goldfinches.") + "How many goldfinches did Jay see?",
              boxes: [{ label: "Goldfinches", a: 2 }],
              slips: [[11, "11 is all the birds on Wednesday."], [7, "7 is Monday."]],
              hint: "How many is a pair?", why: "A pair is <b>2</b>." } } } ]),

    /* ---------- chunk 2: scan a ticket ---------- */
    { type: "learn", topic: "Ticket", title: "Scan, do not read every word",
      fig: ticket(TK[0], "mild", true),
      html: "<p>When you hunt for a fact, you do not need to read every word. Let your eyes <b>scan</b> for what it looks like.</p>" +
        "<p>A time has <b>pm</b> or <b>am</b>. A price has a <b>pound sign</b>. A day has a capital letter, like <b>Saturday</b>. Labels like <b>Date</b> and <b>Seat</b> help too.</p>",
      lv: { medium: { fig: ticket(TK[0], "medium", true) },
        spicy: { fig: ticket(TK[0], "spicy", true), html: "<p>When you hunt for a fact, <b>scan</b>: let your eyes run over the page looking for the shape of the answer. Times have pm, prices have a pound sign.</p>" +
          "<p>Small print matters. A ticket might say the date has moved, or hide a door number at the end of a line. Once you find the right line, read all of it.</p>" } },
      ez: { title: "Scan for it", html: "<p>No need to read every word. <b>Scan</b> for the answer.</p><p>A time has <b>pm</b>. A price has <b>&pound;</b>.</p>" },
      vary: [ ext({ html: "<p>Here is a different ticket this time. Let your eyes <b>scan</b> for what you need, instead of reading every word.</p><p>A time has <b>pm</b>. A price has a <b>pound sign</b>. Labels like <b>Date</b> and <b>Seat</b> help too.</p>",
          ez: { title: "Scan for it", html: "<p>A new ticket. <b>Scan</b> for the answer.</p><p>A time has <b>pm</b>. A price has <b>&pound;</b>.</p>" } }, tf(TK[1], true)),
        ext({ html: "<p>Here is a different ticket this time. Let your eyes <b>scan</b> for what you need, instead of reading every word.</p><p>A time has <b>pm</b>. A price has a <b>pound sign</b>. Labels like <b>Date</b> and <b>Seat</b> help too.</p>",
          ez: { title: "Scan for it", html: "<p>A new ticket. <b>Scan</b> for the answer.</p><p>A time has <b>pm</b>. A price has <b>&pound;</b>.</p>" } }, tf(TK[2], true)) ] },

    S("mc", "Ticket", qDay(TK[0]), [qDay(TK[1]), qDay(TK[2])]),
    S("mc", "Ticket", qStart(TK[0]), [qStart(TK[1]), qStart(TK[2])]),
    S("num", "Ticket", qPrice(TK[0]), [qPrice(TK[1]), qPrice(TK[2])]),
    S("mc", "Ticket", ext({ explain: true }, qSeat(TK[0])), [qSeat(TK[1]), qSeat(TK[2])]),

    /* ---------- chunk 3: a fact file ---------- */
    { type: "learn", topic: "Fact file", title: "Fact files have labels",
      fig: factfile(FF[0], "mild", true),
      html: "<p>A fact file puts facts under <b>labels</b>: Eats, Lives, Size. The label tells you where to look.</p><p>Have a look at this one about a bird Jay sees a lot. Then go fact hunting.</p>",
      lv: { medium: { fig: factfile(FF[0], "medium", true) },
        spicy: { fig: factfile(FF[0], "spicy", true), html: "<p>Some fact files have labels. This one is written as a paragraph, so there are no labels to help.</p><p>So scan for the kind of word you need: food words for <b>eats</b>, place words for <b>lives</b>, <b>cm</b> for size.</p>" } },
      ez: { html: "<p>Fact files have <b>labels</b>: Eats, Lives, Size.</p><p>The label shows you where to look.</p>" },
      vary: [1, 2].map(function(k){ var d = FF[k];
        return { html: "<p>A fact file puts facts under <b>labels</b>: Eats, Lives, Size. The label tells you where to look.</p><p>This time it is the " + d.name + ". Have a look, then go fact hunting.</p>",
          ez: { html: "<p>This time: the " + d.name + ". Fact files have <b>labels</b>.</p><p>The label shows you where to look.</p>" },
          fig: factfile(d, "mild", true), lv: { medium: { fig: factfile(d, "medium", true) },
            spicy: { fig: factfile(d, "spicy", true), html: "<p>This fact file about the " + d.name + " is a paragraph, so there are no labels to help.</p><p>Scan for the kind of word you need: food words for <b>eats</b>, place words for <b>lives</b>, <b>cm</b> for size.</p>" } } }; }) },

    S("mc", "Fact file", qEats(FF[0]), [qEats(FF[1]), qEats(FF[2])]),
    S("mc", "Fact file", qLives(FF[0]), [qLives(FF[1]), qLives(FF[2])]),
    S("num", "Fact file", qSize(FF[0]), [qSize(FF[1]), qSize(FF[2])]),
    S("text", "Fact file", qAny(FF[0]), [qAny(FF[1]), qAny(FF[2])]),

    /* ---------- chunk 4: is it in the text? ---------- */
    { type: "learn", topic: "Point to it", title: "If you can point to it, it is in the text",
      fig: '<svg viewBox="0 0 520 190" role="img" aria-label="A finger pointing at a line of text: point to it. A thought bubble with a question mark: just a guess">' +
        '<rect width="520" height="190" rx="16" fill="#f4f1ea"/>' +
        '<rect x="24" y="24" width="270" height="140" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
        [0, 1, 2, 3, 4].map(function(k){ return '<rect x="40" y="' + (42 + k * 22) + '" width="' + (k === 4 ? 140 : 236) + '" height="8" rx="4" fill="' + (k === 2 ? "#ffd23f" : "#c9cbd6") + '"/>'; }).join("") +
        '<path d="M300 92h-28" stroke="#141a33" stroke-width="3"/><path d="M276 84l-10 8 10 8z" fill="#141a33"/>' +
        '<rect x="304" y="78" width="56" height="28" rx="12" fill="#f6d1b0" stroke="#141a33" stroke-width="2.5"/>' +
        T(332, 140, "Point to it", 14, { a: "middle", b: 1 }) +
        '<circle cx="450" cy="70" r="40" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/><circle cx="414" cy="122" r="8" fill="#ffffff" stroke="#141a33" stroke-width="2"/><circle cx="402" cy="140" r="5" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
        T(450, 84, "?", 40, { a: "middle", b: 1, c: "#8a5cf6" }) + T(450, 172, "Just a guess", 14, { a: "middle", b: 1 }) + '</svg>',
      html: "<p>Some things <b>sound</b> like facts, but the text never says them.</p><p>Here is the test: can you <b>point to the words</b>? If you can, it is a fact from the text. If you cannot, it is a guess, even a sensible one.</p>",
      ez: { html: "<p>Can you <b>point to the words</b>?</p><p>Yes: it is a fact. No: it is a guess.</p>" },
      lv: { spicy: { html: "<p>Some things <b>sound</b> like facts, but the text never says them. The test: can you <b>point to the words</b>?</p><p>There are three kinds: the text <b>says it</b>, the text <b>says the opposite</b> (so it is not true), or the text <b>does not say</b> at all. Only the first is a fact from the text.</p>" } } },

    S("sort", "Point to it", qIn(IN[0]), [qIn(IN[1]), qIn(IN[2])]),

    S("mc", "Point to it", {
      q: P("Mo has a red bike. He rides it to the park every Saturday. It has a bell and a basket.") + "Which fact is in the text?",
      options: ["The bike has a basket.", "The bike is new.", "Mo rides to school."], answer: 0,
      slips: { 1: "The text does not say it is new.", 2: "He rides to the park, not school." },
      hint: "Point to the words.", why: "\"It has a bell and a <b>basket</b>.\" You can point to it.",
      lv: {
        medium: { options: ["The bike has a basket.", "The bike is new.", "Mo rides to school.", "Mo goes to the park on Sundays."],
          slips: { 1: "The text does not say it is new.", 2: "He rides to the park, not school.", 3: "Have another look at the day." } },
        spicy: { q: P("Mo saved for a year to buy his red bike. Now he rides it to the park every Saturday, with his little sister in the seat behind. It has a bell, a basket and a very loud horn.") + "Which fact is in the text?",
          options: ["Mo's sister goes with him on Saturdays.", "Mo's bike cost a lot of money.", "Mo rides to the park every day.", "The horn is louder than the bell."],
          slips: { 1: "Saving for a year hints it was expensive, but the text never says the cost.", 2: "Only on Saturdays.", 3: "The horn is very loud, but the text does not compare it with the bell." },
          why: "\"With his little sister in the seat behind\" is right there in the text. The others are guesses." } } },
      [ { q: P("The pond has 6 frogs. It has a little wooden bridge. Ducks come in the spring.") + "Which fact is in the text?",
          options: ["Ducks come in the spring.", "There are fish in the pond.", "The bridge is red."], answer: 0,
          slips: { 1: "Fish are not in the text.", 2: "It says wooden, not red." },
          hint: "Point to the words.", why: "\"Ducks come in the <b>spring</b>.\"",
          lv: {
            medium: { options: ["Ducks come in the spring.", "There are fish in the pond.", "The bridge is red.", "There are 8 frogs."],
              slips: { 1: "Fish are not in the text.", 2: "It says wooden, not red.", 3: "Have another look at the number." } },
            spicy: { q: P("Half a dozen frogs share the pond with a family of moorhens. A little wooden bridge crosses the narrow end. Every spring, a pair of ducks arrives and stays until autumn.") + "Which fact is in the text?",
              options: ["There are 6 frogs in the pond.", "The ducks stay all year.", "The moorhens built a nest under the bridge.", "There are more ducks than frogs."],
              slips: { 1: "Spring until autumn is not all year.", 2: "Possible, but the text never says it.", 3: "A pair is 2, and half a dozen is 6." },
              why: "Half a dozen is 6, so \"6 frogs\" is in the text, just in different words." } } },
        { q: P("Jay's gran makes jam. She uses plums from her tree. She gives a jar to Jay every year.") + "Which fact is in the text?",
          options: ["Gran uses plums from her tree.", "Jay does not like jam.", "Gran makes cakes."], answer: 0,
          slips: { 1: "The text does not say that.", 2: "It says jam, not cakes." },
          hint: "Point to the words.", why: "\"She uses <b>plums from her tree</b>.\"",
          lv: {
            medium: { options: ["Gran uses plums from her tree.", "Jay does not like jam.", "Gran makes cakes.", "Gran gives Jay two jars."],
              slips: { 1: "The text does not say that.", 2: "It says jam, not cakes.", 3: "Have another look: how many jars?" } },
            spicy: { q: P("Every September, Jay's gran turns the plums from her garden tree into jam. Most jars go to the church fair, but one, always labelled in green pen, is saved for Jay.") + "Which fact is in the text?",
              options: ["Jay's jar has a green label.", "Gran grows plums and apples.", "Jay eats his jam on toast.", "The church fair is in September."],
              slips: { 1: "Only plums are in the text.", 2: "A guess. The text never says how he eats it.", 3: "The jam is made in September. The text does not say when the fair is." },
              why: "\"Labelled in green pen\" is right there. The September and fair facts are about different things." } } } ]),

    { type: "mc", topic: "Point to it", explain: true,
      q: P("Bonnie loves the park. She chases pigeons but never catches one. She always has a drink from the fountain.") + "[[Who]] says: \"Bonnie catches lots of pigeons.\" Is that a fact from the text?",
      fig: '<svg viewBox="0 0 320 130" role="img" aria-label="Bonnie and a pigeon">' + A.bonnie(110, 72, 1, "stand") + A.bird(250, 70, 0.9, "#8c8c9c") + '</svg>',
      options: ["No: the text says she never catches one.", "Yes: it says she chases pigeons."], answer: 0, fixed: true,
      slips: { 1: "Chasing is not catching. Point to the words about catching." },
      hint: "Find the word catches.", why: "The text says she <b>never catches one</b>. It says the opposite.",
      ez: { q: P("Bonnie loves the park. She chases pigeons but never catches one. She always has a drink from the fountain.") + "[[Who]] says: \"Bonnie catches lots of pigeons.\" Is that in the text?",
        slips: { 1: "Chasing is not catching." }, why: "It says she <b>never catches one</b>." },
      lv: { spicy: { q: P("Bonnie adores the park. She has chased every pigeon in it, and she is yet to catch a single one. She always ends with a drink from the fountain.") + "[[Who]] says: \"Bonnie is a good pigeon catcher.\" Is that a fact from the text?",
        options: ["No: \"yet to catch a single one\" means she has never caught one.", "Yes: she has chased every pigeon.", "The text does not say either way."],
        slips: { 1: "Chasing is not catching.", 2: "It does say: \"yet to catch a single one\"." },
        why: "\"Yet to catch a single one\" means none so far. The text says the opposite." } } }
  ],

  ez: {
    realWorld: { html: "<p>Bus times, prices, platforms. You hunt for facts every day.</p><p>A time traveller needs facts fast. What year is it?</p>" },
    make: { intro: "Pick anything, even Bonnie. Give it 3 facts. Send it to Jay if you like." }
  },

  realWorld: {
    title: "Fact finding, every day",
    html: "<p>You hunt for facts all the time: what time the bus goes, which platform, how much the tickets are, what is in a sandwich. Scan for the shape, then read the line.</p>" +
      "<p>For our big question: if we could time travel, should we? A time traveller would need facts fast: what year is it, where am I, when does the portal close? Get one wrong and you could be stuck in 1066.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to the time portal with a timetable">' + A.portal(76, 75, 56) +
      '<rect x="160" y="26" width="110" height="98" rx="8" fill="#fff4d6" stroke="#141a33" stroke-width="2"/>' + T(215, 48, "PORTAL", 13, { a: "middle", b: 1 }) +
      T(172, 72, "1066  9am", 12) + T(172, 92, "1850  2pm", 12) + T(172, 112, "2090  6pm", 12) +
      A.jay(340, 66, 0.8, "wow") + '</svg>'
  },

  make: {
    title: "Make your own fact file",
    intro: "Pick anything: an animal, a place, a game, a team, a band, even Bonnie. Give it three facts, things someone could point to. Keep it, stick it up, or send it to Jay.",
    fields: [
      { id: "topic", label: "My fact file is about", ph: "Pigeons", max: 24 },
      { id: "f1", label: "Fact 1", ph: "They live in towns and cities.", max: 50 },
      { id: "f2", label: "Fact 2", ph: "They eat seeds and crumbs.", max: 50 },
      { id: "f3", label: "Fact 3", ph: "They can fly about 80 km an hour.", max: 50 },
      { id: "name", label: "Fact finder", ph: "B5", max: 24 }
    ],
    svg: function(v){
      function row(y, n, txt, col){
        var ls = wrap(txt, 34, 2);
        return '<rect x="30" y="' + y + '" width="540" height="72" rx="14" fill="' + col + '" fill-opacity=".25"/>' +
          '<circle cx="62" cy="' + (y + 36) + '" r="18" fill="' + col + '"/>' + T(62, y + 43, String(n), 18, { a: "middle", b: 1, c: "#ffffff" }) +
          ls.map(function(l, k){ return T(94, y + (ls.length > 1 ? 30 : 43) + k * 24, esc(l), 19, { b: 1 }); }).join("");
      }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#ffffff"/>' +
        '<rect x="12" y="12" width="576" height="376" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        '<rect x="12" y="12" width="576" height="60" rx="18" fill="#19c39a" fill-opacity=".45"/>' +
        T(30, 52, "FACT FILE: " + esc(String(wrap(v.topic, 24, 1)[0] || "").toUpperCase()), 20, { b: 1 }) +
        row(88, 1, v.f1, "#3a8fd6") + row(170, 2, v.f2, "#e8862a") + row(252, 3, v.f3, "#8a5cf6") +
        T(30, 366, "Fact finder: " + esc(wrap(v.name, 24, 1)[0] || ""), 17, { b: 1, c: "#5b6180" }) +
        A.bird(540, 360, 0.8, "#3a8fd6") +
        '</svg>';
    }
  }
};
})();
