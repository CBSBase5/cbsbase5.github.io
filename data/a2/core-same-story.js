/* Base 5 core target activity: Same story, new look.
   English. Themes (the big idea a story is about) and the conventions
   that tell you what kind of text you are reading: fairy tales, horror,
   comics, news reports, adverts and recipes. One story, retold in three
   looks, drawn in SVG. Replayable: most questions have two extra
   versions for the next goes. ASCII only. */
(function(){
var A = window.A2ART;
var FONT = 'font-family="Verdana,Arial,sans-serif"';
var SERIF = 'font-family="Georgia,Times New Roman,serif"';
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + (o.serif ? SERIF : FONT) + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') + (o.i ? ' font-style="italic"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }
function ext(a, b){ for(var k in b) if(Object.prototype.hasOwnProperty.call(b, k)) a[k] = b[k]; return a; }
function P(t){ return '<p class="a2task">' + t + '</p>'; }
function S(type, topic, fn, sets, extra){ var s = ext(ext({ type: type, topic: topic }, fn(sets[0])), extra || {}); s.vary = [fn(sets[1]), fn(sets[2])]; return s; }

/* ---------- pictures ---------- */
var THEMES = '<svg viewBox="0 0 520 190" role="img" aria-label="Themes are big ideas: friendship, being brave, good and evil, not giving up">' +
  '<rect width="520" height="190" rx="16" fill="#f4f1ea"/>' +
  [["Friendship", "#ff5d8f", '<path d="M0 16c-30 -18 -26 -40 -10 -40c6 0 10 6 10 10c0 -4 4 -10 10 -10c16 0 20 22 -10 40z" fill="#ff5d8f" stroke="#141a33" stroke-width="2.5"/>'],
   ["Being brave", "#22b8e6", '<path d="M0 -26l22 8v12c0 18 -10 28 -22 34c-12 -6 -22 -16 -22 -34v-12z" fill="#22b8e6" stroke="#141a33" stroke-width="2.5"/>'],
   ["Good and evil", "#ffd23f", '<circle cx="-10" cy="0" r="18" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/><path d="M14 -18a18 18 0 1 0 0 36a14 14 0 1 1 0 -36z" fill="#3a4060" stroke="#141a33" stroke-width="2.5"/>'],
   ["Not giving up", "#19c39a", '<path d="M-24 20l14 -16 12 10 22 -30" fill="none" stroke="#141a33" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 -20l8 -2 -2 8z" fill="#141a33" stroke="#141a33" stroke-width="3"/>']
  ].map(function(c, k){
    var x = 66 + k * 129;
    return '<g transform="translate(' + x + ' 0)"><circle cx="0" cy="78" r="46" fill="' + c[1] + '" fill-opacity=".25" stroke="#141a33" stroke-width="2"/><g transform="translate(0 80)">' + c[2] + '</g>' +
      T(0, 158, c[0], 14, { a: "middle", b: 1 }) + '</g>';
  }).join("") + T(260, 182, "A theme is the big idea underneath the story", 12, { a: "middle", c: "#3a4060" }) + '</svg>';

var GENRES = '<svg viewBox="0 0 520 230" role="img" aria-label="Three covers: a fairy tale with a castle and Once upon a time, a horror story with a dark house and a moon, and a comic with panels and POW">' +
  '<rect width="520" height="230" rx="16" fill="#f4f1ea"/>' +
  /* fairy tale */
  '<rect x="20" y="16" width="150" height="196" rx="8" fill="#fff4d6" stroke="#141a33" stroke-width="2.5"/>' +
  '<path d="M60 150v-50h12v-14h10v14h16v-24h12v24h14v-14h10v14h12v50z" fill="#c9a7f0" stroke="#141a33" stroke-width="2"/><path d="M90 150v-20q5 -8 10 0v20z" fill="#3a4060"/>' +
  T(95, 44, "Once upon", 15, { a: "middle", serif: 1, i: 1 }) + T(95, 62, "a time...", 15, { a: "middle", serif: 1, i: 1 }) + T(95, 186, "Fairy tale", 14, { a: "middle", b: 1 }) +
  /* horror */
  '<rect x="185" y="16" width="150" height="196" rx="8" fill="#2b2140" stroke="#141a33" stroke-width="2.5"/>' +
  '<circle cx="300" cy="50" r="16" fill="#f4f1ea"/><path d="M220 150v-40l30 -24 30 24v40z" fill="#141a33" stroke="#8a8aa0" stroke-width="2"/>' +
  '<rect x="232" y="116" width="10" height="12" fill="#ffd23f"/><rect x="258" y="116" width="10" height="12" fill="#141a33" stroke="#8a8aa0"/>' +
  T(260, 186, "Horror", 14, { a: "middle", b: 1, c: "#ffffff" }) +
  A.egg('<g transform="translate(212 46)"><path d="M0 0q8 -8 16 0q8 -8 16 0" fill="none" stroke="#8a8aa0" stroke-width="2.5"/></g>', "Even in a horror story, Jay would stop to check what kind of bird that is.") +
  /* comic */
  '<rect x="350" y="16" width="150" height="196" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
  '<rect x="360" y="26" width="62" height="66" fill="#cfe8f5" stroke="#141a33" stroke-width="2"/><rect x="428" y="26" width="62" height="66" fill="#ffe1ea" stroke="#141a33" stroke-width="2"/>' +
  '<rect x="360" y="98" width="130" height="62" fill="#fff4d6" stroke="#141a33" stroke-width="2"/>' +
  '<path d="M392 104l8 14 14 -8 -2 16 16 4 -14 8 8 14 -16 -4 -4 14 -8 -12 -12 10 0 -16 -16 0 10 -12 -10 -12 16 -2z" fill="#ffd23f" stroke="#141a33" stroke-width="1.5"/>' +
  T(408, 139, "POW!", 11, { a: "middle", b: 1 }) + A.bubble(434, 36, 50, 34, "Hi!", 446) +
  T(425, 186, "Comic", 14, { a: "middle", b: 1 }) + '</svg>';

var TYPES = '<svg viewBox="0 0 520 230" role="img" aria-label="Three text types: a news report with a headline, an advert with a price and buy now, and a recipe with ingredients and method">' +
  '<rect width="520" height="230" rx="16" fill="#f4f1ea"/>' +
  '<rect x="20" y="16" width="150" height="196" rx="4" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
  T(95, 40, "THE DAILY NEWS", 11, { a: "middle", b: 1, serif: 1 }) + '<path d="M30 48h130" stroke="#141a33" stroke-width="2"/>' +
  T(30, 72, "Headline", 16, { b: 1, serif: 1 }) + [0, 1, 2, 3, 4, 5].map(function(k){ return '<rect x="30" y="' + (86 + k * 12) + '" width="' + (k === 5 ? 80 : 130) + '" height="5" rx="2" fill="#c9cbd6"/>'; }).join("") +
  T(30, 172, "\"Quote,\" said...", 11, { i: 1 }) + T(95, 200, "News report", 13, { a: "middle", b: 1 }) +
  '<rect x="185" y="16" width="150" height="196" rx="12" fill="#ffd23f" fill-opacity=".5" stroke="#141a33" stroke-width="2.5"/>' +
  T(260, 52, "NEW!", 24, { a: "middle", b: 1, c: "#e8862a" }) + T(260, 84, "The best", 14, { a: "middle", b: 1 }) + T(260, 102, "thing ever", 14, { a: "middle", b: 1 }) +
  '<circle cx="260" cy="138" r="22" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' + T(260, 144, "&#163;3", 15, { a: "middle", b: 1 }) +
  '<rect x="210" y="166" width="100" height="22" rx="11" fill="#19c39a" stroke="#141a33" stroke-width="1.5"/>' + T(260, 182, "Buy now!", 12, { a: "middle", b: 1 }) + T(260, 206, "Advert", 13, { a: "middle", b: 1 }) +
  '<rect x="350" y="16" width="150" height="196" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
  T(362, 40, "Ingredients", 13, { b: 1, c: "#1d5f99" }) + [0, 1, 2].map(function(k){ return '<circle cx="366" cy="' + (54 + k * 14) + '" r="3" fill="#141a33"/><rect x="374" y="' + (51 + k * 14) + '" width="80" height="5" rx="2" fill="#c9cbd6"/>'; }).join("") +
  T(362, 112, "Method", 13, { b: 1, c: "#1d5f99" }) + [1, 2, 3].map(function(k){ return T(362, 118 + k * 15, k + ".", 11, { b: 1 }) + '<rect x="376" y="' + (111 + k * 15) + '" width="90" height="5" rx="2" fill="#c9cbd6"/>'; }).join("") +
  T(425, 200, "Recipe", 13, { a: "middle", b: 1 }) + '</svg>';

/* ---------- the same story in three looks, three stories ---------- */
function kitten(x, y){ return '<g transform="translate(' + x + ' ' + y + ')"><ellipse cx="0" cy="8" rx="14" ry="10" fill="#8c8c9c"/><circle cx="10" cy="-4" r="9" fill="#8c8c9c"/><path d="M4 -10l2 -8 5 6zM12 -11l4 -7 3 8z" fill="#8c8c9c"/><circle cx="13" cy="-5" r="1.6" fill="#141a33"/></g>'; }
function person(x, y, col){ return '<g transform="translate(' + x + ' ' + y + ')"><circle cx="0" cy="-22" r="11" fill="#f6d1b0" stroke="#141a33" stroke-width="2"/><path d="M-14 16v-16q0 -10 14 -10t14 10v16z" fill="' + col + '" stroke="#141a33" stroke-width="2"/></g>'; }
function fox(x, y){ return '<g transform="translate(' + x + ' ' + y + ')"><path d="M-16 -6l6 -14 6 10 8 0 6 -10 6 14q-2 14 -16 16q-14 -2 -16 -16z" fill="#e8862a" stroke="#141a33" stroke-width="2"/><path d="M-6 6l6 6 6 -6z" fill="#ffffff"/><circle cx="-5" cy="-2" r="1.8" fill="#141a33"/><circle cx="5" cy="-2" r="1.8" fill="#141a33"/></g>'; }
var ST = [
  { key: "kitten", theme: "Kindness", others: ["Good and evil", "Greed"], spicyTheme: "Kindness to someone who cannot help themselves", spicyOthers: ["Good always beats evil", "Being careful in bad weather", "Wanting more than you need"],
    panels: [
      { cap: "A cold, wet night.", sfx: "", say: "Mew!", draw: function(x){ return '<path d="M' + (x + 20) + ' 50l-6 14M' + (x + 60) + ' 46l-6 14M' + (x + 110) + ' 52l-6 14M' + (x + 140) + ' 44l-6 14" stroke="#3a8fd6" stroke-width="2"/>' + kitten(x + 70, 130); } },
      { cap: "[[Who]] hears a sound.", sfx: "", say: "Who's there?", draw: function(x){ return person(x + 60, 134, "#2f6f8f") + kitten(x + 118, 140); } },
      { cap: "Safe and warm.", sfx: "PURR!", say: "", draw: function(x){ return person(x + 56, 134, "#2f6f8f") + kitten(x + 96, 132); } } ],
    head: "Lost Kitten Found Safe", sub: "Rescued from storm drain",
    news: "A kitten missing for three days was found on Tuesday night. [[Who]] heard crying from a drain on Mill Road. \"I could not just walk past,\" they said.",
    quote: "\"I could not just walk past,\" they said.",
    tale: "Once upon a time, on a cold and stormy night, a tiny kitten was lost and alone. Along came [[who]], who had the kindest heart in all the land. They lifted the kitten from the dark drain and carried it home. And the kitten lived happily ever after.",
    kw: ["kitten", "cat", "rescue", "saved", "found", "drain", "lost"], model: "Lost Kitten Saved From Drain" },
  { key: "dark", theme: "Being brave", others: ["Friendship", "Greed"], spicyTheme: "Facing your fear to help others", spicyOthers: ["Good always beats evil", "The dangers of old houses", "Wanting to be famous"],
    panels: [
      { cap: "The lights go out.", sfx: "CLICK!", say: "", dark: 1, draw: function(x){ return '<circle cx="' + (x + 80) + '" cy="96" r="18" fill="#3a4060" stroke="#8a8aa0" stroke-width="2"/>'; } },
      { cap: "The switch is in the cellar...", sfx: "", say: "I can do this.", dark: 1, draw: function(x){ return person(x + 60, 140, "#8a5cf6") + '<path d="M' + (x + 100) + ' 150h40v-10h-30v-10h-20" fill="none" stroke="#8a8aa0" stroke-width="3"/>'; } },
      { cap: "Light!", sfx: "", say: "Hooray!", draw: function(x){ return '<circle cx="' + (x + 120) + '" cy="88" r="16" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>' + person(x + 60, 140, "#8a5cf6"); } } ],
    head: "Hero Brings Back Party Lights", sub: "Guest faces fear of the dark",
    news: "Guests at a birthday party were plunged into darkness on Saturday. [[Who]], who is afraid of the dark, went down to the cellar alone to flip the switch. \"My knees were shaking,\" they said.",
    quote: "\"My knees were shaking,\" they said.",
    tale: "Once upon a time, the castle fell dark. Everyone was too afraid to go down to the deep, black cellar. Everyone except [[who]]. Their knees shook, but down they went, step by step. And the castle glowed once more.",
    kw: ["dark", "light", "lights", "cellar", "hero", "brave", "power", "party", "fear"], model: "Brave Guest Saves Party" },
  { key: "flood", theme: "Friendship", others: ["Good and evil", "Greed"], spicyTheme: "Enemies who become friends", spicyOthers: ["Good always beats evil", "The power of nature", "Wanting more than you need"],
    panels: [
      { cap: "The river rises.", sfx: "WHOOSH!", say: "", draw: function(x){ return '<path d="M' + (x + 8) + ' 140q20 -12 40 0t40 0 40 0 30 0v24h-150z" fill="#3a8fd6" fill-opacity=".6"/>' + fox(x + 50, 116) + A.bird(x + 120, 106, 0.8, "#141a33"); } },
      { cap: "A crow finds a log.", sfx: "", say: "Climb on!", draw: function(x){ return '<rect x="' + (x + 30) + '" y="132" width="100" height="16" rx="8" fill="#8a5a36"/>' + A.bird(x + 100, 122, 0.8, "#141a33") + fox(x + 52, 120); } },
      { cap: "Friends from now on.", sfx: "", say: "Thanks, mate!", draw: function(x){ return fox(x + 54, 130) + A.bird(x + 104, 128, 0.8, "#141a33"); } } ],
    head: "Unlikely Pair Escape Flood", sub: "Fox and crow share a log",
    news: "A fox and a crow were seen floating to safety on a log during Sunday's floods. Wildlife expert Dr Amir Noor said: \"Normally they would never share anything.\"",
    quote: "\"Normally they would never share anything.\"",
    tale: "Once upon a time, a proud fox and a clever crow could not stand each other. Then the great flood came, and the crow found a log just big enough for two. \"Climb on,\" said the crow. From that day on, they were the best of friends.",
    kw: ["fox", "crow", "flood", "log", "friend", "friends", "pair", "escape"], model: "Fox and Crow Escape Flood" }
];
function comic(d, egg){
  var s = '<svg viewBox="0 0 520 210" role="img" aria-label="A comic strip in three panels: ' + esc(d.panels.map(function(p){ return p.cap + " " + p.say + " " + p.sfx; }).join(". ")) + '">' +
    '<rect width="520" height="210" fill="#ffffff"/>';
  d.panels.forEach(function(p, k){
    var x = 8 + k * 170;
    s += '<rect x="' + x + '" y="8" width="164" height="194" fill="' + (p.dark ? "#2b2140" : "#fffdf6") + '" stroke="#141a33" stroke-width="3"/>' + p.draw(x) +
      '<rect x="' + x + '" y="8" width="164" height="26" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>' + T(x + 8, 26, p.cap, 11, { b: 1 });
    if(p.say) s += A.bubble(x + 10, 42, Math.max(64, p.say.length * 9 + 26), 34, p.say, x + 30);
    if(p.sfx) s += T(x + 82, 186, p.sfx, 22, { a: "middle", b: 1, c: "#e8862a" });
  });
  if(egg) s += A.egg('<g transform="translate(496 186)">' + A.bonnie(0, 0, 0.28, "sit") + '</g>', "Bonnie has snuck into the last panel. She is not in the story. She just likes being in pictures.");
  return s + '</svg>';
}
function news(d){
  var body = wrap(d.news, 68, 6);
  return '<svg viewBox="0 0 520 ' + (128 + body.length * 20) + '" role="img" aria-label="A news report. Headline: ' + esc(d.head) + '. ' + esc(d.news) + '">' +
    '<rect x="4" y="4" width="512" height="' + (120 + body.length * 20) + '" rx="4" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
    T(260, 28, "THE WEEKLY POST", 13, { a: "middle", b: 1, serif: 1 }) + '<path d="M18 36h484" stroke="#141a33" stroke-width="2"/>' +
    T(20, 68, esc(d.head), 24, { b: 1, serif: 1 }) + T(20, 92, esc(d.sub), 14, { i: 1, c: "#3a4060", serif: 1 }) +
    body.map(function(l, k){ return T(20, 122 + k * 20, esc(l), 14, { serif: 1 }); }).join("") + '</svg>';
}
function tale(d){
  var lines = wrap(d.tale, 54, 8);
  return '<svg viewBox="0 0 520 ' + (60 + lines.length * 24) + '" role="img" aria-label="A storybook page: ' + esc(d.tale) + '">' +
    '<rect x="4" y="4" width="512" height="' + (52 + lines.length * 24) + '" rx="10" fill="#fff4d6" stroke="#8a5a36" stroke-width="3"/>' +
    '<rect x="14" y="14" width="492" height="' + (32 + lines.length * 24) + '" rx="6" fill="none" stroke="#c9a7f0" stroke-width="2" stroke-dasharray="2 4"/>' +
    lines.map(function(l, k){ return T(30, 44 + k * 24, esc(l), 16, { serif: 1, i: k === 0 }); }).join("") + '</svg>';
}

/* ---------- chunk 4 builders ---------- */
function qComic(d){
  return { q: "Here is the story in a new look. What kind of text is it?", fig: comic(d, true),
    options: ["Comic", "News report", "Fairy tale"], answer: 0,
    slips: { 1: "A news report has a headline and columns of writing.", 2: "A fairy tale starts with Once upon a time." },
    hint: "Look at the boxes and the bubbles.", why: "Panels, speech bubbles and a sound effect: it is a <b>comic</b>.",
    ez: { q: "What kind of text is this?", why: "Panels and bubbles: a <b>comic</b>.", slips: { 1: "News has a headline.", 2: "A fairy tale starts with Once upon a time." } },
    lv: { medium: { options: ["Comic", "News report", "Fairy tale", "Advert"], slips: { 1: "A news report has a headline and columns.", 2: "A fairy tale starts with Once upon a time.", 3: "An advert tries to sell you something." } },
      spicy: { q: "You can tell this is a comic before reading a single word. Which conventions give it away?",
        options: ["Panels, speech bubbles and a sound effect", "A headline and a quote", "Once upon a time and a happy ending", "A price and Buy now"],
        slips: { 1: "Those belong to a news report.", 2: "Those belong to a fairy tale.", 3: "Those belong to an advert." },
        why: "Panels split the story into moments, bubbles show speech, and sound effects let you hear it. All comic conventions." } } };
}
function qNews(d){
  return { q: "Same story, another look. What kind of text is it now?", fig: news(d),
    options: ["News report", "Recipe", "Comic"], answer: 0,
    slips: { 1: "A recipe has ingredients and a method.", 2: "A comic has panels and bubbles." },
    hint: "Look at the big words at the top.", why: "A headline, the name of the paper and a quote: it is a <b>news report</b>.",
    ez: { q: "What kind of text is it now?", why: "A headline and a quote: a <b>news report</b>.", slips: { 1: "A recipe has ingredients.", 2: "A comic has panels." } },
    lv: { medium: { options: ["News report", "Recipe", "Comic", "Fairy tale"], slips: { 1: "A recipe has ingredients and a method.", 2: "A comic has panels and bubbles.", 3: "No Once upon a time here." } },
      spicy: { q: "Which convention of a news report is <b>" + d.quote + "</b>?",
        options: ["A quote from someone involved, to make it feel real", "A headline, to grab attention", "A happy ending", "A call to action, telling you to buy"],
        slips: { 1: "The headline is the big line at the top.", 2: "News reports do not need happy endings.", 3: "That belongs to adverts." },
        why: "News reports quote real people to show the story is true and to add a human voice." } } };
}
function qTheme(d){
  return { q: "Here is the fairy tale version. All three looks tell the same story. What is the theme?", fig: tale(d),
    options: [d.theme, d.others[0], d.others[1]], answer: 0,
    slips: { 1: "Is there a baddie in it? Look again at what happens.", 2: "Does anyone want more than they need?" },
    hint: "What does the main character do that matters?", why: "The look changes, but the theme stays the same: <b>" + d.theme.toLowerCase() + "</b>.",
    ez: { q: "Now a fairy tale. What is the theme?", hint: "What does the hero do?", why: "Same theme in every look: <b>" + d.theme.toLowerCase() + "</b>.", slips: { 1: "Is there a baddie in it?", 2: "Does anyone want more than they need?" } },
    lv: { medium: { options: [d.theme].concat(d.others, ["Not giving up"]), slips: { 1: "Is there a baddie in it?", 2: "Does anyone want more than they need?", 3: "Close, but is that what the story is mostly about?" } },
      spicy: { options: [d.spicyTheme].concat(d.spicyOthers),
        slips: { 1: "There is no real villain in this story.", 2: "That is a detail of the setting, not the big idea.", 3: "Nobody in the story wants that." },
        why: "<b>" + d.spicyTheme + "</b>. Comic, news or fairy tale, the big idea underneath stays put." } } };
}
function qHead(d){
  return { q: "Have a go: write a <b>headline</b> for the story, as if it was going in the newspaper. Short and punchy.", fig: comic(d),
    need: [d.kw], model: d.model,
    ez: { q: "Have a go: write a <b>headline</b> for this story.", hint: "Who, plus what happened. About 5 words.", why: "Something like \"" + d.model + "\". Short, with the main thing." },
    hint: "Who or what, plus what happened. Five words or so.",
    why: "Something like \"" + d.model + "\". Headlines are short, leave out little words, and tell you the main thing.",
    lv: { spicy: { q: "Have a go: write a <b>headline</b> for the story, then think about what a fairy tale title would be instead. Type the headline.", hint: "Headlines are short and present tense: \"Fox and Crow Escape Flood\", not \"A fox and a crow escaped\"." } } };
}

(window.A2PACKS = window.A2PACKS || {})["core-same-story"] = {
  a2: true,
  id: "a2-core-same-story",
  title: "Same story, new look",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "The big idea a story is about, and the clues that tell you what kind of text you are reading.",
  blurb: "Themes are the big ideas underneath a story. Conventions are the clues that tell you if it is a fairy tale, a horror story, a comic, a news report, an advert or a recipe. Four short chunks, ending with one story told in three looks, and a card to make. New stories each time you come back.",
  note: "Same story, new look: themes, and the clues that tell you what kind of text something is. Four five minute chunks and a card to make. New stories every time you come back, so have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Bookworm", line: "Bookworm: short texts, and the clearest clues." },
    { id: "medium", name: "Critic", line: "Critic: more choices, and clues that look alike." },
    { id: "spicy", name: "Director", line: "Director: why writers use each convention, and mixed up genres." }
  ],
  themes: {
    time: { name: "Time travel", w: { who: "Zed" } },
    football: { name: "Football", w: { who: "the keeper" } },
    horror: { name: "Horror", w: { who: "the guard" } },
    fishing: { name: "Fishing", w: { who: "the angler" } },
    music: { name: "Music", w: { who: "the drummer" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: GENRES,
  steps: [

    /* ---------- chunk 1: themes ---------- */
    { type: "learn", topic: "Themes", title: "A theme is the big idea underneath",
      fig: THEMES,
      ez: { title: "The big idea", html: "<p>A <b>theme</b> is the big idea in a story.</p><p>Like friendship, or being brave.</p>" },
      html: "<p>Every story is <b>about</b> something bigger than what happens. That big idea is the <b>theme</b>.</p>" +
        "<p>A story about two kids sharing a bike might really be about <b>friendship</b>. A story about a knight and a dragon might be about <b>good and evil</b>, or <b>being brave</b>.</p>" +
        "<p>The same theme turns up in all kinds of stories.</p>",
      lv: { spicy: { html: "<p>A <b>theme</b> is the big idea underneath a story, not the plot. The plot is what happens; the theme is what it is <b>about</b>.</p>" +
        "<p>Themes are often bigger than one word: not just \"friendship\" but \"friends can come from unlikely places\". You find them by asking: what does the main character learn, or what does the story want us to think?</p>" } } },

    { type: "mc", topic: "Themes",
      q: P("Mia and Sam always walked to school together. One day, Sam broke his leg. Every morning after that, Mia carried his bag and walked slowly beside him.") + "What is the theme?",
      options: ["Friendship", "Being brave", "Good and evil"], answer: 0,
      slips: { 1: "Nobody faces something scary here.", 2: "There is no baddie in this story." },
      hint: "What does Mia do for Sam?", why: "Mia sticks by Sam when things get hard. The theme is <b>friendship</b>.",
      ez: { why: "Mia sticks by Sam. That is <b>friendship</b>." },
      lv: {
        medium: { options: ["Friendship", "Being brave", "Good and evil", "Greed"], slips: { 1: "Nobody faces something scary here.", 2: "There is no baddie in this story.", 3: "Nobody wants more than they need." } },
        spicy: { q: P("Everyone said Mia would stop walking to school with Sam once he broke his leg. It took twice as long, and she was late three times. She never once complained.") + "Which is the best way to put the theme?",
          options: ["Real friends stick by you when things get hard", "Being late is never OK", "Good always beats evil", "Accidents can happen to anyone"],
          slips: { 1: "Being late is a detail. What does the story want us to think about Mia?", 2: "There is no villain here.", 3: "True, but the story is about what Mia does next." },
          why: "The story is about loyalty. \"Never once complained\" shows it." } },
      vary: [
        { q: P("The diving board was very high. [[Who]] was scared. They took a deep breath, walked to the end and jumped.") + "What is the theme?",
          options: ["Being brave", "Friendship", "Greed"], answer: 0,
          slips: { 1: "Nobody is helping a friend here.", 2: "Nobody wants more than they need." },
          hint: "How does [[who]] feel, and what do they do anyway?", why: "Scared, but they jump anyway. The theme is <b>being brave</b>.",
          ez: { hint: "Scared, but what do they do?", why: "Scared, but they jump. That is <b>being brave</b>." },
          lv: { medium: { options: ["Being brave", "Friendship", "Greed", "Good and evil"], slips: { 1: "Nobody is helping a friend here.", 2: "Nobody wants more than they need.", 3: "There is no baddie." } },
            spicy: { q: P("For three weeks, [[who]] had climbed the ladder to the top board and climbed back down again. Today, their legs were shaking just as much. They walked to the edge anyway.") + "Which is the best way to put the theme?",
              options: ["Being brave means doing it even while you are scared", "Diving is dangerous", "You should never give in to fear", "Good always beats evil"],
              slips: { 1: "A detail of the setting, not the big idea.", 2: "Close, but their legs are still shaking. The fear does not go away.", 3: "There is no villain here." },
              why: "\"Just as much\" and \"anyway\" show the point: bravery is not having no fear." } } },
        { q: P("The wicked queen wanted all the gold in the land. A kind girl and her fox tricked the queen and gave the gold back to the village.") + "What is the theme?",
          options: ["Good and evil", "Being brave", "Friendship"], answer: 0,
          slips: { 1: "Close, but the story is mainly about the wicked queen against the kind girl.", 2: "The girl and fox work together, but the big idea is about the queen." },
          hint: "Who is the baddie, and who wins?", why: "A wicked queen against a kind girl, and kindness wins: <b>good and evil</b>.",
          ez: { why: "Wicked queen, kind girl, and kind wins: <b>good and evil</b>.", slips: { 1: "Close. It is mostly the queen against the girl.", 2: "They work together. The big idea is the queen." } },
          lv: { medium: { options: ["Good and evil", "Being brave", "Friendship", "Not giving up"], slips: { 1: "Close, but the big idea is wicked against kind.", 2: "They work together, but the big idea is about the queen.", 3: "Nobody keeps failing and trying again." } },
            spicy: { q: P("The queen had gold enough for a hundred lifetimes, yet she taxed the village until the children went hungry. In the end, it was a girl with nothing but a clever fox who took it all back.") + "Which is the best way to put the theme?",
              options: ["Greed is defeated by kindness and cleverness", "Foxes are clever animals", "Queens should not have gold", "Children should be fed"],
              slips: { 1: "A detail, not the big idea.", 2: "Too narrow. What does the story say about greed?", 3: "True, but that is a detail of what went wrong." },
              why: "Greed (the queen) against kindness and cleverness (the girl and fox), and the good side wins." } } }
      ] },

    { type: "match", topic: "Themes",
      q: "Match each story to its theme.",
      pairs: [["A boy keeps trying to ride his bike, even after falling ten times.", "Not giving up"], ["A hero stops a cruel king.", "Good and evil"], ["Two lonely people become best mates.", "Friendship"]],
      slips: { any: "Ask: what is the big idea underneath?" },
      hint: "Falling ten times and still trying is about...", why: "Each story has one big idea underneath.",
      ez: { hint: "Trying again and again is about...", slips: { any: "What is the big idea?" } },
      lv: { medium: { pairs: [["A boy keeps trying to ride his bike, even after falling ten times.", "Not giving up"], ["A hero stops a cruel king.", "Good and evil"], ["Two lonely people become best mates.", "Friendship"], ["A girl stands up to a bully, even though she is shaking.", "Being brave"]] },
        spicy: { pairs: [["A boy keeps trying to ride his bike, even after falling ten times.", "Not giving up"], ["A hero stops a cruel king.", "Good and evil"], ["Two lonely people become best mates.", "Friendship"], ["A girl stands up to a bully, even though she is shaking.", "Being brave"], ["A man finds treasure but loses all his friends.", "Greed"]] } },
      vary: [
        { pairs: [["A team loses every match but keeps training, and wins the last game.", "Not giving up"], ["A witch tries to curse a town, and a kind boy breaks the spell.", "Good and evil"], ["A new kid sits alone until someone shares their lunch.", "Friendship"]],
          ez: { hint: "Trying again and again is about...", slips: { any: "What is the big idea?" } },
          lv: { medium: { pairs: [["A team loses every match but keeps training, and wins the last game.", "Not giving up"], ["A witch tries to curse a town, and a kind boy breaks the spell.", "Good and evil"], ["A new kid sits alone until someone shares their lunch.", "Friendship"], ["A shy singer goes on stage, even with her hands shaking.", "Being brave"]] },
            spicy: { pairs: [["A team loses every match but keeps training, and wins the last game.", "Not giving up"], ["A witch tries to curse a town, and a kind boy breaks the spell.", "Good and evil"], ["A new kid sits alone until someone shares their lunch.", "Friendship"], ["A shy singer goes on stage, even with her hands shaking.", "Being brave"], ["A dragon guards a mountain of gold it will never spend.", "Greed"]] } } },
        { pairs: [["An angler fishes all day with no bites, comes back the next day and lands a huge carp.", "Not giving up"], ["A superhero saves the city from a villain.", "Good and evil"], ["A dog and a cat who hated each other end up sharing a bed.", "Friendship"]],
          ez: { hint: "Trying again and again is about...", slips: { any: "What is the big idea?" } },
          lv: { medium: { pairs: [["An angler fishes all day with no bites, comes back the next day and lands a huge carp.", "Not giving up"], ["A superhero saves the city from a villain.", "Good and evil"], ["A dog and a cat who hated each other end up sharing a bed.", "Friendship"], ["A boy goes into the dark woods to find his lost sister.", "Being brave"]] },
            spicy: { pairs: [["An angler fishes all day with no bites, comes back the next day and lands a huge carp.", "Not giving up"], ["A superhero saves the city from a villain.", "Good and evil"], ["A dog and a cat who hated each other end up sharing a bed.", "Friendship"], ["A boy goes into the dark woods to find his lost sister.", "Being brave"], ["A king wishes everything he touches turns to gold, then cannot eat.", "Greed"]] } } }
      ] },

    { type: "mc", topic: "Themes", explain: true,
      q: "The story about Mia carrying Sam's bag is about friendship. Which of these stories has the <b>same theme</b>?",
      options: ["Two rival pirates share their last bit of food on a desert island.", "A knight fights a dragon to save a town.", "A runner trips but finishes the race."], answer: 0,
      slips: { 1: "That is more good and evil, or being brave.", 2: "That is more not giving up." },
      hint: "Which one is about people sticking together?", why: "Totally different story, same big idea: <b>friendship</b>. Themes travel between stories.",
      ez: { q: "Mia's story is about friendship. Which one has the <b>same theme</b>?", why: "New story, same big idea: <b>friendship</b>.", slips: { 1: "That is more good and evil.", 2: "That is more not giving up." } },
      lv: { spicy: { options: ["Two rival pirates share their last bit of food on a desert island.", "A knight fights a dragon to save a town.", "A runner trips but finishes the race.", "A pirate buries his treasure so nobody else can have it."],
        slips: { 1: "Good and evil, or being brave.", 2: "Not giving up.", 3: "That is greed: the opposite of sharing." } } },
      vary: [
        { q: "The diving board story is about being brave. Which of these stories has the <b>same theme</b>?",
          options: ["A girl who is scared of dogs pats one for the first time.", "Two friends build a den together.", "A greedy man steals all the cakes."], answer: 0,
          slips: { 1: "That is friendship.", 2: "That is greed." },
          hint: "Which one is about facing a fear?", why: "Scared, but doing it anyway: <b>being brave</b>, again.",
          ez: { q: "The diving story is about being brave. Which one has the <b>same theme</b>?" },
          lv: { spicy: { options: ["A girl who is scared of dogs pats one for the first time.", "Two friends build a den together.", "A greedy man steals all the cakes.", "A dog chases a cat up a tree."], slips: { 1: "That is friendship.", 2: "That is greed.", 3: "A dog is in it, but is anyone facing a fear?" } } } },
        { q: "The wicked queen story is about good and evil. Which of these stories has the <b>same theme</b>?",
          options: ["A small robot stops an evil robot army from taking over.", "A boy learns to swim after many tries.", "Two cousins finally make up after an argument."], answer: 0,
          slips: { 1: "That is not giving up.", 2: "That is friendship." },
          hint: "Which one has a baddie?", why: "A villain and a hero, and good wins: <b>good and evil</b>, in a robot costume.",
          ez: { q: "The queen story is good and evil. Which one has the <b>same theme</b>?", why: "Good wins: <b>good and evil</b>, in a robot costume." },
          lv: { spicy: { options: ["A small robot stops an evil robot army from taking over.", "A boy learns to swim after many tries.", "Two cousins finally make up after an argument.", "A robot builds a better robot."], slips: { 1: "That is not giving up.", 2: "That is friendship.", 3: "Robots again, but is there a baddie?" } } } }
      ] },

    /* ---------- chunk 2: genre clues ---------- */
    { type: "learn", topic: "Story clues", title: "Conventions are clues",
      ez: { title: "Clues", html: "<p>Each kind of story has clues. They are called <b>conventions</b>.</p><p>Fairy tale: Once upon a time. Horror: the dark. Comic: POW!</p>" },
      fig: GENRES,
      html: "<p>Each kind of story has its own <b>conventions</b>: the usual things you expect to find in it.</p>" +
        "<p><b>Fairy tale:</b> Once upon a time, castles, magic, a baddie, happily ever after.<br><b>Horror:</b> the dark, creaks and screams, something hiding, short scary sentences.<br><b>Comic:</b> panels, speech bubbles, sound effects like POW!</p>",
      lv: { spicy: { html: "<p>Each genre has <b>conventions</b>: the things readers expect.</p>" +
        "<p><b>Fairy tale:</b> Once upon a time, magic, a clear hero and villain, three tries, a happy ending.<br><b>Horror:</b> darkness, isolation, <b>suspense</b> (making you wait), very short sentences, something unseen.<br><b>Comic:</b> panels, bubbles, captions, sound effects.</p>" +
        "<p>Writers can also <b>break</b> or <b>mix</b> conventions on purpose: a fairy tale opening that turns into horror is unsettling because you expected something cosy.</p>" } } },

    { type: "mc", topic: "Story clues",
      q: P("Once upon a time, in a castle by the sea, there lived a princess with a magic ring.") + "What kind of story is this?",
      options: ["Fairy tale", "Horror", "Comic"], answer: 0,
      slips: { 1: "Nothing scary here, yet.", 2: "There are no panels or speech bubbles." },
      hint: "How does it start?", why: "\"Once upon a time\", a castle and magic: a <b>fairy tale</b>.",
      ez: { why: "Once upon a time, a castle and magic: a <b>fairy tale</b>." },
      lv: {
        medium: { options: ["Fairy tale", "Horror", "Comic", "News report"], slips: { 1: "Nothing scary here, yet.", 2: "There are no panels or bubbles.", 3: "News is about real events, with dates and quotes." } },
        spicy: { q: P("Once upon a time, in a castle at the top of the hill, the candles went out one by one. Something was scratching inside the walls.") + "What is the writer doing?",
          options: ["Starting like a fairy tale, then turning it into horror", "Writing a normal happy fairy tale", "Writing a news report about a castle", "Writing a comic"],
          slips: { 1: "Candles going out and scratching in the walls are not cosy.", 2: "\"Once upon a time\" is never how news starts.", 3: "There are no panels or bubbles." },
          why: "A fairy tale opening, then horror conventions: darkness and something hidden. Mixing genres makes it creepier." } },
      vary: [
        { q: P("The door creaked open. It was dark. Something was breathing behind it.") + "What kind of story is this?",
          options: ["Horror", "Fairy tale", "Recipe"], answer: 0,
          slips: { 1: "No Once upon a time, no castle, no magic.", 2: "A recipe tells you how to cook." },
          hint: "How does it make you feel?", why: "A creaking door, darkness and something breathing: <b>horror</b>.",
          ez: { why: "A creak, the dark, and breathing: <b>horror</b>.", slips: { 1: "No Once upon a time, no magic." } },
          lv: { medium: { options: ["Horror", "Fairy tale", "Recipe", "Advert"], slips: { 1: "No Once upon a time, no castle.", 2: "A recipe tells you how to cook.", 3: "Nothing is for sale." } },
            spicy: { q: P("The door creaked. Silence. Then, slowly, the handle began to turn.") + "Why does the writer use the one word sentence <b>Silence.</b>?",
              options: ["To build suspense by making the reader wait", "To give a happy ending", "To show someone is talking", "To list what you need"],
              slips: { 1: "The handle is turning. Not very happy.", 2: "There is no speech here.", 3: "That is a recipe convention." },
              why: "Very short sentences slow everything down and make you wait. That is suspense, a horror convention." } } },
        { q: "What kind of story is this?",
          fig: '<svg viewBox="0 0 520 170" role="img" aria-label="Two comic panels: a hero says Look out, then a sound effect CRASH">' +
            '<rect x="8" y="8" width="250" height="154" fill="#cfe8f5" stroke="#141a33" stroke-width="3"/>' + person(80, 140, "#e04848") + A.bubble(110, 26, 120, 36, "Look out!", 120) +
            '<rect x="264" y="8" width="248" height="154" fill="#fff4d6" stroke="#141a33" stroke-width="3"/>' + T(388, 100, "CRASH!", 40, { a: "middle", b: 1, c: "#e8862a" }) + '</svg>',
          options: ["Comic", "Horror", "Recipe"], answer: 0,
          slips: { 1: "It might be exciting, but look at the boxes and bubbles.", 2: "A recipe has ingredients and a method." },
          hint: "Look at the boxes and the bubble.", why: "Panels, a speech bubble and a sound effect: a <b>comic</b>.",
          ez: { why: "Panels and a bubble: a <b>comic</b>.", slips: { 1: "Look at the boxes and bubbles." } },
          lv: { medium: { options: ["Comic", "Horror", "Recipe", "News report"], slips: { 1: "Look at the boxes and bubbles.", 2: "A recipe has ingredients and a method.", 3: "News has a headline and columns." } },
            spicy: { q: "Comics can show sound. Which convention is <b>CRASH!</b>?", options: ["A sound effect, in big letters, so you can hear the action", "A caption, telling you where it is", "A speech bubble", "A headline"],
              slips: { 1: "A caption is a box of narration, usually at the top.", 2: "Nobody is saying it.", 3: "Headlines belong to news." },
              why: "Sound effects (onomatopoeia) in big letters let a silent page make noise." } } }
      ] },

    { type: "sort", topic: "Story clues",
      q: "Sort the clues. Which kind of story would you find each one in?",
      buckets: ["Fairy tale", "Horror", "Comic"],
      cards: [["Once upon a time", 0], ["Happily ever after", 0], ["A creaking door at night", 1], ["A scream in the dark", 1], ["Speech bubbles", 2], ["POW!", 2]],
      slips: { any: "Have a look at the three covers in the last card." },
      hint: "Bubbles and POW belong together.", why: "Each genre has its own clues.",
      ez: { q: "Sort the clues into the right story.", slips: { any: "Look at the 3 covers on the last card." } },
      lv: { spicy: { cards: [["Once upon a time", 0], ["A magic wish granted three times", 0], ["A light that flickers, then dies", 1], ["Very short sentences to build suspense", 1], ["Speech bubbles", 2], ["A sound effect in big letters", 2], ["Panels, one moment in each", 2]] } },
      vary: [
        { cards: [["A wicked witch", 0], ["A magic wand", 0], ["Footsteps behind you", 1], ["A ghost in the mirror", 1], ["Panels", 2], ["BANG!", 2]],
          ez: { q: "Sort the clues into the right story.", slips: { any: "Look at the 3 covers on the last card." } },
          lv: { spicy: { cards: [["A talking animal who helps the hero", 0], ["The youngest child wins in the end", 0], ["Being alone in a big empty house", 1], ["Something you hear but never see", 1], ["A thought bubble, all cloudy", 2], ["A caption box: Meanwhile...", 2], ["ZAP!", 2]] } } },
        { cards: [["A castle on a hill", 0], ["A fairy godmother", 0], ["Blood on the floor", 1], ["A shadow at the window", 1], ["A thought bubble", 2], ["WHAM!", 2]],
          ez: { q: "Sort the clues into the right story.", slips: { any: "Look at the 3 covers on the last card." } },
          lv: { spicy: { cards: [["Things happen in threes", 0], ["A clear lesson at the end", 0], ["A phone with no signal", 1], ["The reader knows something the hero does not", 1], ["Speed lines behind a runner", 2], ["Panels getting bigger at the exciting bit", 2], ["KAPOW!", 2]] } } }
      ] },

    { type: "multi", topic: "Story clues",
      q: "Pick <b>all</b> the fairy tale conventions.",
      options: ["Once upon a time", "A magic object", "Good beats evil", "Happily ever after", "A price list", "A headline"], answers: [0, 1, 2, 3],
      slips: { any: "Four of them belong in fairy tales. Prices and headlines belong somewhere else." },
      hint: "Think of a fairy tale you know.", why: "Once upon a time, magic, good beating evil and a happy ending. Prices are adverts, headlines are news.",
      ez: { why: "Once upon a time, and happily ever after." },
      lv: { mild: { options: ["Once upon a time", "Happily ever after", "A price list", "A headline"], answers: [0, 1], slips: { any: "Two belong in fairy tales." } } },
      vary: [
        { q: "Pick <b>all</b> the horror conventions.",
          options: ["Darkness", "A creaking door", "Something hiding", "Short scary sentences", "Ingredients", "Buy now!"], answers: [0, 1, 2, 3],
          slips: { any: "Four of them belong in horror. Ingredients and Buy now belong somewhere else." },
          hint: "What makes a story scary?", why: "Darkness, creaks, something hiding and short sentences. Ingredients are recipes, Buy now is adverts.",
          ez: { why: "Darkness, and a creaking door." },
          lv: { mild: { options: ["Darkness", "A creaking door", "Ingredients", "Buy now!"], answers: [0, 1], slips: { any: "Two belong in horror." } } } },
        { q: "Pick <b>all</b> the comic conventions.",
          options: ["Panels", "Speech bubbles", "Sound effects like BOOM", "Captions", "A method", "A headline"], answers: [0, 1, 2, 3],
          slips: { any: "Four of them belong in comics. A method and a headline belong somewhere else." },
          hint: "Picture a comic page.", why: "Panels, bubbles, sound effects and captions. A method is recipes, a headline is news.",
          ez: { why: "Panels, and speech bubbles." },
          lv: { mild: { options: ["Panels", "Speech bubbles", "A method", "A headline"], answers: [0, 1], slips: { any: "Two belong in comics." } } } }
      ] },

    /* ---------- chunk 3: text type clues ---------- */
    { type: "learn", topic: "Text clues", title: "Real world texts have conventions too",
      fig: TYPES,
      ez: { title: "Real texts have clues too", html: "<p><b>News:</b> a headline. <b>Advert:</b> a price.</p><p><b>Recipe:</b> ingredients, then steps.</p>" },
      html: "<p>It is not just stories. Everyday texts have conventions too.</p>" +
        "<p><b>News report:</b> a headline, who, what, where and when, quotes from people.<br><b>Advert:</b> a slogan, words like NEW and BEST, a price, Buy now!<br><b>Recipe:</b> a list of ingredients, then a method in numbered steps.</p>",
      lv: { spicy: { html: "<p>Everyday texts have conventions, and each one does a job for the reader.</p>" +
        "<p><b>News report:</b> a headline, the who, what, where and when in the first line, quotes to prove it happened.<br><b>Advert:</b> a slogan, persuasive words, a promise about how you will feel, a price, a <b>call to action</b> (Buy now!).<br><b>Recipe:</b> ingredients with amounts, a method in order, bossy verbs (Stir, Bake).</p>" } } },

    { type: "mc", topic: "Text clues",
      q: P("<b>DOG SAVES DUCKLINGS</b><br>A dog called Pip rescued three ducklings from Hill Park pond on Monday. \"She just jumped in,\" said her owner.") + "What kind of text is this?",
      options: ["News report", "Advert", "Recipe"], answer: 0,
      slips: { 1: "Nothing is for sale.", 2: "There is no cooking." },
      hint: "Big headline, a day, a quote.", why: "A headline, what happened, when, and a quote: a <b>news report</b>.",
      ez: { why: "A headline, a day and a quote: a <b>news report</b>." },
      lv: { medium: { options: ["News report", "Advert", "Recipe", "Fairy tale"], slips: { 1: "Nothing is for sale.", 2: "There is no cooking.", 3: "No Once upon a time, and it says Monday." } },
        spicy: { q: P("<b>DOG SAVES DUCKLINGS</b><br>A dog called Pip rescued three ducklings from Hill Park pond on Monday. \"She just jumped in,\" said her owner.") + "Which convention shows the writer wants you to believe it really happened?",
          options: ["The quote from her owner", "The capital letters", "The word dog", "The full stop"],
          slips: { 1: "Capitals grab attention, but do not prove anything.", 2: "Every dog story has that.", 3: "Every text has full stops." },
          why: "Quoting a real person who was there is how news shows its story is true." } },
      vary: [
        { q: P("<b>NEW! The Super Squeaky Ball</b><br>Only &pound;3! Your dog will LOVE it. Buy yours today!") + "What kind of text is this?",
          options: ["Advert", "News report", "Comic"], answer: 0,
          slips: { 1: "It is not telling you about something that happened.", 2: "No panels or bubbles." },
          hint: "Is it trying to get you to do something?", why: "NEW, a price and Buy yours today: an <b>advert</b>.",
          ez: { hint: "What does it want you to do?", slips: { 1: "Nothing happened. It is selling.", 2: "No panels or bubbles." } },
          lv: { medium: { options: ["Advert", "News report", "Comic", "Recipe"], slips: { 1: "Nothing happened; it is selling.", 2: "No panels or bubbles.", 3: "No ingredients." } },
            spicy: { q: P("<b>NEW! The Super Squeaky Ball</b><br>Only &pound;3! Your dog will LOVE it. Buy yours today!") + "What is <b>Your dog will LOVE it</b> doing?",
              options: ["Promising how you, and your dog, will feel", "Telling you the price", "Telling you where to buy it", "Giving you a fact you could check"],
              slips: { 1: "The price is \"Only &pound;3\".", 2: "It does not say where.", 3: "Nobody can check that every dog will love it." },
              why: "Adverts sell feelings as well as things. LOVE in capitals makes the promise louder." } } },
        { q: P("<b>Cheese on Toast</b><br>You will need: 2 slices of bread, butter, cheese.<br>1. Toast the bread.<br>2. Add the cheese.<br>3. Grill for 3 minutes.") + "What kind of text is this?",
          options: ["Recipe", "Horror story", "News report"], answer: 0,
          slips: { 1: "Nothing scary, unless you burn it.", 2: "No headline or quotes." },
          hint: "What do you need, and what do you do?", why: "What you need, then numbered steps: a <b>recipe</b>.",
          ez: { why: "What you need, then steps: a <b>recipe</b>." },
          lv: { medium: { options: ["Recipe", "Horror story", "News report", "Advert"], slips: { 1: "Nothing scary.", 2: "No headline or quotes.", 3: "Nothing is for sale." } },
            spicy: { q: P("<b>Cheese on Toast</b><br>You will need: 2 slices of bread, butter, cheese.<br>1. Toast the bread.<br>2. Add the cheese.<br>3. Grill for 3 minutes.") + "Why do the steps start with bossy verbs like <b>Toast</b>, <b>Add</b> and <b>Grill</b>?",
              options: ["They tell you exactly what to do, one action at a time", "To make it sound exciting", "Because recipes are rude", "To tell you what happened yesterday"],
              slips: { 1: "Recipes want clear, not exciting.", 2: "Bossy verbs are not rude, just clear.", 3: "Recipes are about what you do now." },
              why: "Imperative (bossy) verbs at the start of each step make the instructions quick to follow." } } }
      ] },

    { type: "match", topic: "Text clues",
      q: "Match each convention to the kind of text it belongs to.",
      pairs: [["A headline", "News report"], ["A price and Buy now!", "Advert"], ["A list of ingredients", "Recipe"], ["Speech bubbles", "Comic"]],
      slips: { any: "Picture each text. Where would you see it?" },
      hint: "Ingredients are for cooking.", why: "Each convention has a home.",
      ez: { q: "Match each clue to its text." },
      lv: { medium: { pairs: [["A headline", "News report"], ["A price and Buy now!", "Advert"], ["A list of ingredients", "Recipe"], ["Speech bubbles", "Comic"], ["Once upon a time", "Fairy tale"]] },
        spicy: { pairs: [["A headline", "News report"], ["A call to action", "Advert"], ["Bossy verbs in numbered steps", "Recipe"], ["Panels", "Comic"], ["A happy ending with a lesson", "Fairy tale"], ["Suspense", "Horror"]] } },
      vary: [
        { pairs: [["A quote from someone who was there", "News report"], ["A catchy slogan", "Advert"], ["A method in numbered steps", "Recipe"], ["Sound effects like BANG!", "Comic"]],
          ez: { q: "Match each clue to its text." },
          lv: { medium: { pairs: [["A quote from someone who was there", "News report"], ["A catchy slogan", "Advert"], ["A method in numbered steps", "Recipe"], ["Sound effects like BANG!", "Comic"], ["A creaking door at midnight", "Horror"]] },
            spicy: { pairs: [["Who, what, where, when in the first line", "News report"], ["A promise about how you will feel", "Advert"], ["Amounts and cooking times", "Recipe"], ["Captions in boxes", "Comic"], ["Things happen in threes", "Fairy tale"], ["Something unseen", "Horror"]] } } },
        { pairs: [["The name of the newspaper at the top", "News report"], ["Words like NEW and BEST", "Advert"], ["Oven temperatures", "Recipe"], ["Panels", "Comic"]],
          ez: { q: "Match each clue to its text." },
          lv: { medium: { pairs: [["The name of the newspaper at the top", "News report"], ["Words like NEW and BEST", "Advert"], ["Oven temperatures", "Recipe"], ["Panels", "Comic"], ["A fairy godmother", "Fairy tale"]] },
            spicy: { pairs: [["A short, punchy headline in the present tense", "News report"], ["Persuasive words like only and best", "Advert"], ["An ingredients list with amounts", "Recipe"], ["Speed lines", "Comic"], ["A clear villain", "Fairy tale"], ["Being trapped alone", "Horror"]] } } }
      ] },

    { type: "mc", topic: "Text clues", explain: true,
      q: P("<b>Bird Cake</b><br>1. Melt the lard.<br>2. Stir in the bird seed.<br>3. Pour into a pot and leave to set.") + "Jay's recipe for bird cake is missing something recipes nearly always have. What?",
      options: ["A list of ingredients", "A headline", "Speech bubbles"], answer: 0,
      slips: { 1: "Headlines are for news.", 2: "Speech bubbles are for comics." },
      hint: "Before you start cooking, what do you need to know?", why: "It has a title and a method, but no <b>ingredients list</b>. The birds will have to wait.",
      ez: { q: P("<b>Bird Cake</b><br>1. Melt the lard.<br>2. Stir in the bird seed.<br>3. Pour into a pot and leave to set.") + "Jay's recipe is missing something. What?", hint: "What do you need before you cook?", why: "No <b>ingredients list</b>. The birds will have to wait." },
      lv: { spicy: { options: ["A list of ingredients with amounts", "A headline", "A call to action", "A quote from the chef"], slips: { 1: "Headlines are for news.", 2: "That is an advert convention.", 3: "That is more like news." } } },
      vary: [
        { q: P("A cat called Moss was rescued from a tree outside the library on Friday. Firefighter Jo Lee said: \"He was very calm about it.\"") + "This news report is missing something news reports nearly always have. What?",
          options: ["A headline", "An ingredients list", "Once upon a time"], answer: 0,
          slips: { 1: "That is for recipes.", 2: "That is for fairy tales." },
          hint: "What is usually in big letters at the top?", why: "It has who, what, where, when and a quote, but no <b>headline</b>.",
          ez: { q: P("A cat called Moss was rescued from a tree outside the library on Friday. Firefighter Jo Lee said: \"He was very calm about it.\"") + "This news report is missing something. What?", hint: "What is big at the top?", why: "There is no <b>headline</b>." },
          lv: { spicy: { options: ["A headline", "An ingredients list", "A call to action", "A happy ending"], slips: { 1: "That is for recipes.", 2: "That is for adverts.", 3: "News does not need one." } } } },
        { q: P("<b>NEW! The Glow Torch</b><br>The brightest torch you will ever own. Perfect for camping.") + "This advert is missing something adverts nearly always have. What?",
          options: ["A price, or telling you to buy it", "A method", "Panels"], answer: 0,
          slips: { 1: "That is for recipes.", 2: "That is for comics." },
          hint: "What does an advert want you to do in the end?", why: "It has NEW and a slogan, but no price and no <b>call to action</b>, like Buy now!",
          ez: { q: P("<b>NEW! The Glow Torch</b><br>The brightest torch you will ever own. Perfect for camping.") + "This advert is missing something. What?", hint: "What does an advert want you to do?", why: "No price, and no <b>Buy now!</b>" },
          lv: { spicy: { options: ["A call to action, like Buy now!", "A method", "Panels", "A quote from a witness"], slips: { 1: "That is for recipes.", 2: "That is for comics.", 3: "That is for news." } } } }
      ] },

    /* ---------- chunk 4: one story, three looks ---------- */
    { type: "learn", topic: "Three looks", title: "Same story, new look",
      fig: comic(ST[0], true),
      html: "<p>Last bit. Here is one story, told three ways: as a <b>comic</b>, a <b>news report</b> and a <b>fairy tale</b>.</p>" +
        "<p>The conventions change the look. The theme underneath stays the same.</p>",
      ez: { title: "One story, 3 looks", html: "<p>One story. 3 looks: <b>comic</b>, <b>news</b>, <b>fairy tale</b>.</p><p>The theme stays the same.</p>" },
      vary: [{ fig: comic(ST[1], true), ez: { title: "One story, 3 looks", html: "<p>One story. 3 looks: <b>comic</b>, <b>news</b>, <b>fairy tale</b>.</p><p>The theme stays the same.</p>" } },
        { fig: comic(ST[2], true), ez: { title: "One story, 3 looks", html: "<p>One story. 3 looks: <b>comic</b>, <b>news</b>, <b>fairy tale</b>.</p><p>The theme stays the same.</p>" } }] },

    S("mc", "Three looks", qComic, ST),
    S("mc", "Three looks", qNews, ST),
    S("mc", "Three looks", qTheme, ST),
    S("text", "Three looks", qHead, ST)
  ],

  realWorld: {
    title: "Conventions, everywhere",
    html: "<p>Knowing the conventions tells you what a text wants from you. An advert wants your money. A news report wants you to believe it. A horror story wants you to jump. Spotting that helps you read it the right way.</p>" +
      "<p>For our big question: if we could time travel, should we? That question is a theme in itself. Writers have asked it in comics, films, fairy tales and even adverts. Same big idea, lots of new looks.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="The time portal with three small covers: comic, news and fairy tale">' + A.portal(70, 75, 54) +
      '<rect x="150" y="30" width="70" height="90" rx="6" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' + T(185, 80, "POW!", 13, { a: "middle", b: 1, c: "#e8862a" }) +
      '<rect x="232" y="30" width="70" height="90" rx="2" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' + T(267, 52, "NEWS", 12, { a: "middle", b: 1, serif: 1 }) + '<path d="M240 64h54M240 76h54M240 88h40" stroke="#c9cbd6" stroke-width="4"/>' +
      '<rect x="314" y="30" width="70" height="90" rx="6" fill="#fff4d6" stroke="#8a5a36" stroke-width="2"/>' + T(349, 72, "Once", 12, { a: "middle", i: 1, serif: 1 }) + T(349, 88, "upon...", 12, { a: "middle", i: 1, serif: 1 }) + '</svg>'
  },

  ez: {
    realWorld: { title: "Clues are everywhere", html: "<p>An advert wants your money. A horror story wants you to jump.</p><p>Clues help you read it right.</p>" },
    make: { intro: "Pick a story you know. Name its theme. Write its first line in a new look." }
  },

  make: {
    title: "Make a new look card",
    intro: "Pick a story you know: a film, a game, a book, even a match. Name its theme, then pick a new look and write its first line in that style. Keep it, stick it up, or send it to Jay.",
    fields: [
      { id: "story", label: "The story", ph: "A goalkeeper saves the last penalty", max: 50 },
      { id: "theme", label: "Its theme", ph: "Not giving up", max: 30 },
      { id: "look", label: "New look", ph: "Fairy tale", max: 20 },
      { id: "line", label: "First line in the new look", ph: "Once upon a time, a keeper stood alone in a great green field.", max: 100 },
      { id: "name", label: "Written by", ph: "B5", max: 24 }
    ],
    svg: function(v){
      var st = wrap(v.story, 44, 2), ln = wrap(v.line, 38, 3);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#fffdf6"/>' +
        '<rect x="12" y="12" width="576" height="376" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        T(30, 56, "SAME STORY, NEW LOOK", 24, { b: 1, c: "#8a5cf6" }) +
        st.map(function(l, k){ return T(30, 90 + k * 24, esc(l), 18, { b: 1, c: "#3a4060" }); }).join("") +
        '<rect x="30" y="140" width="250" height="40" rx="20" fill="#ff5d8f" fill-opacity=".3"/>' + T(46, 166, "Theme: " + esc(wrap(v.theme, 18, 1)[0] || ""), 14, { b: 1 }) +
        '<rect x="300" y="140" width="270" height="40" rx="20" fill="#22b8e6" fill-opacity=".3"/>' + T(316, 166, "Look: " + esc(wrap(v.look, 20, 1)[0] || ""), 14, { b: 1 }) +
        '<rect x="30" y="198" width="540" height="130" rx="14" fill="#fff4d6" stroke="#8a5a36" stroke-width="2"/>' +
        ln.map(function(l, k){ return T(48, 236 + k * 32, esc(l), 21, { serif: 1, i: 1 }); }).join("") +
        T(30, 364, "Written by: " + esc(wrap(v.name, 24, 1)[0] || ""), 16, { b: 1, c: "#5b6180" }) +
        A.bird(548, 360, 0.7, "#3a8fd6") +
        '</svg>';
    }
  }
};
})();
