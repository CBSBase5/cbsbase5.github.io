/* Base 5 Autumn 2 activity: Hidden messages.
   Human and Social. The morals, warnings and values hiding inside myths,
   legends and fables, then a legend hunt challenge away from the screen.
   All stories here are retold or made up for Base 5. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, extra){ extra = extra || ""; return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 15) + '"' + (/fill=/.test(extra) ? "" : ' fill="#141a33"') + ' ' + extra + '>' + s + '</text>'; }

/* three kinds of hidden message */
var TYPES =
  '<svg viewBox="0 0 520 210" role="img" aria-label="Three kinds of hidden message: a moral, a warning and a value">' +
  '<rect width="520" height="210" rx="16" fill="#f4f1ea"/>' +
  [["Moral", "how to behave", "#ff5d8f", '<path d="M0 14c-22 -14 -26 -30 -14 -38c8 -5 14 0 14 6c0 -6 6 -11 14 -6c12 8 8 24 -14 38z" fill="#fff" stroke="#141a33" stroke-width="2.5"/>'],
   ["Warning", "what to watch out for", "#ffb020", '<path d="M0 -26l26 44h-52z" fill="#fff" stroke="#141a33" stroke-width="2.5" stroke-linejoin="round"/><path d="M0 -10v14" stroke="#141a33" stroke-width="4" stroke-linecap="round"/><circle cx="0" cy="11" r="2.6" fill="#141a33"/>'],
   ["Value", "what matters to people", "#22b8e6", '<path d="M0 -26l7 16 17 1 -13 11 4 17 -15 -9 -15 9 4 -17 -13 -11 17 -1z" fill="#fff" stroke="#141a33" stroke-width="2.5" stroke-linejoin="round"/>']
  ].map(function(c, k){
    var x = 90 + k * 170;
    return '<g transform="translate(' + x + ' 80)"><circle r="46" fill="' + c[2] + '" fill-opacity=".45" stroke="#141a33" stroke-width="2.5"/>' + c[3] +
      '<text y="76" text-anchor="middle" ' + F + ' font-size="18" font-weight="700" fill="#141a33">' + c[0] + '</text>' +
      '<text y="100" text-anchor="middle" ' + F + ' font-size="13" fill="#141a33">' + c[1] + '</text></g>';
  }).join("") + '</svg>';

/* the start card: an old scroll with a secret message peeking out */
var START =
  '<svg viewBox="0 0 520 220" role="img" aria-label="An old scroll with a magnifying glass over a hidden message, and Jay looking on">' +
  '<rect width="520" height="220" rx="16" fill="#2d2466"/>' +
  '<circle cx="470" cy="44" r="22" fill="#fff6c9"/><circle cx="460" cy="38" r="20" fill="#2d2466"/>' +
  '<circle cx="60" cy="40" r="2" fill="#fff"/><circle cx="140" cy="24" r="2" fill="#fff"/><circle cx="400" cy="90" r="2" fill="#fff"/><circle cx="300" cy="20" r="2" fill="#fff"/>' +
  '<path d="M180 50h220q16 0 16 16v100q0 16 -16 16h-220z" fill="#f3e2b8" stroke="#7a5532" stroke-width="3"/>' +
  '<rect x="166" y="40" width="22" height="152" rx="11" fill="#c99a63" stroke="#7a5532" stroke-width="3"/>' +
  '<path d="M206 82h150M206 104h170M206 126h120M206 148h160" stroke="#7a5532" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/>' +
  '<circle cx="330" cy="120" r="40" fill="#fffbe0" fill-opacity=".85" stroke="#141a33" stroke-width="5"/>' +
  '<path d="M358 148l36 36" stroke="#141a33" stroke-width="10" stroke-linecap="round"/>' +
  T(330, 116, "the real", 13, 'text-anchor="middle" font-weight="700"') + T(330, 134, "message", 13, 'text-anchor="middle" font-weight="700"') +
  A2ART.jay(80, 116, 0.8, "hmm") +
  '</svg>';

/* Jay telling a story: the class in joke is the hidden surprise */
var TELL =
  '<svg viewBox="0 0 420 150" role="img" aria-label="Jay about to tell a story">' +
  '<rect width="420" height="150" rx="16" fill="#eef6ff"/>' + A2ART.jay(80, 52, 0.85, "smile") +
  A2ART.egg(A2ART.bubble(150, 14, 230, 56, "When I was in China...", 168), "...that is a story for another day. Jay has a lot of those.") + '</svg>';

/* the shepherd boy */
var WOLF =
  '<svg viewBox="0 0 520 210" role="img" aria-label="A boy on a hill with sheep shouting wolf, and a wolf hiding behind a rock">' +
  '<rect width="520" height="210" rx="16" fill="#d9f0ff"/>' +
  '<path d="M0 170q130 -110 260 -60t260 30v70H0z" fill="#8fd18a"/><path d="M0 190q200 -40 520 -20v40H0z" fill="#6bb86a"/>' +
  [[90, 150], [130, 140], [175, 132], [215, 140]].map(function(p){
    return '<g transform="translate(' + p[0] + ' ' + p[1] + ')"><ellipse rx="18" ry="12" fill="#fff" stroke="#141a33" stroke-width="2"/><circle cx="16" cy="-6" r="7" fill="#3b3b3b"/><path d="M-10 10v8M8 10v8" stroke="#3b3b3b" stroke-width="3"/></g>';
  }).join("") +
  '<g transform="translate(300 96)"><circle cx="0" cy="-26" r="13" fill="#f6d1b0" stroke="#141a33" stroke-width="2"/><path d="M-13 -30q13 -16 26 0" fill="#6b3f1f"/>' +
  '<ellipse cx="2" cy="-20" rx="4" ry="5" fill="#3b2414"/><path d="M-12 -12h24l4 38h-32z" fill="#e07a1f" stroke="#141a33" stroke-width="2"/><path d="M-6 26v18M6 26v18" stroke="#141a33" stroke-width="4"/>' +
  '<path d="M12 -8l20 -22" stroke="#7a5532" stroke-width="4" stroke-linecap="round"/></g>' +
  A2ART.bubble(330, 18, 96, 40, "WOLF!", 336) +
  '<path d="M420 160q30 -40 70 -10v40h-70z" fill="#9aa3b8" stroke="#141a33" stroke-width="2"/>' +
  '<g transform="translate(450 140)"><path d="M-20 0l6 -18 6 12 8 -2 8 2 6 -12 6 18z" fill="#5b6180" stroke="#141a33" stroke-width="2"/><circle cx="-6" cy="-2" r="2.5" fill="#ffd23f"/><circle cx="8" cy="-2" r="2.5" fill="#ffd23f"/></g>' +
  A2ART.egg('<g transform="translate(40 186) scale(.45)">' + A2ART.bonnie(0, 0, 1, "sit") + '</g>', "Not a wolf. Just Bonnie, who has no tail and would never cry wolf. She might cry dinner.") +
  '</svg>';

/* Icarus in three pictures */
function panel(x, title, body){
  return '<g transform="translate(' + x + ' 14)"><rect width="160" height="182" rx="10" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' + body +
    '<rect x="0" y="144" width="160" height="38" rx="10" fill="#141a33"/><rect x="0" y="144" width="160" height="12" fill="#141a33"/>' +
    '<text x="80" y="169" text-anchor="middle" ' + F + ' font-size="13" font-weight="700" fill="#fff">' + title + '</text></g>';
}
function wing(x, y, s, flip){ return '<g transform="translate(' + x + ' ' + y + ') scale(' + (flip ? -s : s) + ' ' + s + ')"><path d="M0 0q30 -30 60 -24q-10 10 -14 10q10 2 14 8q-14 4 -20 2q6 6 4 10q-24 2 -44 -6z" fill="#fff6e0" stroke="#7a5532" stroke-width="2"/></g>'; }
function flyer(x, y, s){ return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + wing(-4, 0, 0.8, true) + wing(4, 0, 0.8) + '<circle cx="0" cy="-12" r="8" fill="#f6d1b0" stroke="#141a33" stroke-width="1.5"/><path d="M-6 -4h12l2 22h-16z" fill="#3a8fd6" stroke="#141a33" stroke-width="1.5"/></g>'; }
var ICARUS =
  '<svg viewBox="0 0 520 210" role="img" aria-label="Three pictures. A father fixing wings to his son and warning him. The son flying close to the sun. Feathers falling into the sea.">' +
  '<rect width="520" height="210" rx="16" fill="#f4f1ea"/>' +
  panel(10, "Not too high!", '<rect x="0" y="0" width="160" height="144" rx="10" fill="#d9f0ff"/><path d="M0 120h160v24H0z" fill="#c9a66b"/>' + flyer(64, 90, 0.95) +
    '<circle cx="136" cy="62" r="12" fill="#f6d1b0" stroke="#141a33" stroke-width="1.5"/><path d="M124 56q12 -14 24 0" fill="#bfbfbf"/><path d="M124 74h24l4 46h-32z" fill="#7a5532"/>') +
  panel(180, "Higher, higher", '<rect x="0" y="0" width="160" height="144" rx="10" fill="#9fd3ff"/><circle cx="118" cy="38" r="26" fill="#ffd23f"/>' +
    '<path d="M118 4v-4M150 38h6M140 14l4 -4M140 62l4 4" stroke="#ffb020" stroke-width="3"/>' + flyer(76, 66, 1.1) + '<path d="M60 130q40 -12 100 0" stroke="#3a8fd6" stroke-width="3" fill="none"/>') +
  panel(350, "Splash", '<rect x="0" y="0" width="160" height="144" rx="10" fill="#d9f0ff"/><path d="M0 100q40 -12 80 0t80 0v44H0z" fill="#22b8e6"/>' +
    '<path d="M40 30q6 -6 12 0M90 46q6 -6 12 0M64 70q6 -6 12 0M110 22q6 -6 12 0" stroke="#7a5532" stroke-width="2.5" fill="none"/>' +
    '<path d="M70 98l-8 -16M80 96v-20M90 98l8 -16" stroke="#fff" stroke-width="4" stroke-linecap="round"/>') +
  '</svg>';

/* choice, then what happens, then the message */
var CLUE =
  '<svg viewBox="0 0 520 170" role="img" aria-label="A choice leads to what happens, and what happens points to the message">' +
  '<rect width="520" height="170" rx="16" fill="#f4f1ea"/>' +
  [["A choice", "#ffd23f"], ["What happens", "#ff8a5c"], ["The message", "#19c39a"]].map(function(c, k){
    var x = 20 + k * 172;
    return '<rect x="' + x + '" y="44" width="136" height="76" rx="14" fill="' + c[1] + '" fill-opacity=".55" stroke="#141a33" stroke-width="2.5"/>' +
      T(x + 68, 89, c[0], 16, 'text-anchor="middle" font-weight="700"') +
      (k < 2 ? '<path d="M' + (x + 142) + ' 82h26M' + (x + 160) + ' 74l8 8 -8 8" stroke="#141a33" stroke-width="3" fill="none" stroke-linecap="round"/>' : "");
  }).join("") +
  T(260, 152, "Reward or trouble at the end is the biggest clue.", 14, 'text-anchor="middle"') + '</svg>';

/* Midas */
var MIDAS =
  '<svg viewBox="0 0 520 200" role="img" aria-label="A king with a crown touching an apple and a cup, which have turned to gold">' +
  '<rect width="520" height="200" rx="16" fill="#3a2a5c"/>' +
  '<g transform="translate(120 112)"><path d="M-46 80q0 -50 46 -54q46 4 46 54z" fill="#8a2a4a"/><circle cx="0" cy="-10" r="30" fill="#f6d1b0" stroke="#141a33" stroke-width="2"/>' +
  '<path d="M-26 -34l8 -26 10 16 8 -20 8 20 10 -16 8 26z" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>' +
  '<circle cx="-10" cy="-12" r="3" fill="#141a33"/><circle cx="10" cy="-12" r="3" fill="#141a33"/><path d="M-10 6q10 -6 20 0" stroke="#141a33" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
  '<path d="M-20 10q20 26 40 0" fill="#bfbfbf"/></g>' +
  '<path d="M170 140q40 -10 70 -6" stroke="#f6d1b0" stroke-width="12" stroke-linecap="round"/>' +
  '<circle cx="290" cy="128" r="28" fill="#ffd23f" stroke="#b8860b" stroke-width="3"/><path d="M290 100q4 -12 12 -14" stroke="#b8860b" stroke-width="3" fill="none"/>' +
  '<path d="M276 116q4 -6 10 -6" stroke="#fff6c9" stroke-width="4" fill="none" stroke-linecap="round"/>' +
  '<path d="M370 96h50l-8 50h-34z" fill="#ffd23f" stroke="#b8860b" stroke-width="3"/><path d="M386 146v20M374 168h40" stroke="#b8860b" stroke-width="4"/>' +
  '<path d="M330 60l6 -12 6 12 -6 12z M440 70l5 -10 5 10 -5 10z M250 50l5 -10 5 10 -5 10z" fill="#fff6c9"/>' +
  T(380, 40, "All gold. Nothing to eat.", 14, 'text-anchor="middle" font-weight="700" fill="#fff6c9"') + '</svg>';

/* a modern legend being told at night: an owl is the hidden surprise */
var NIGHT =
  '<svg viewBox="0 0 520 190" role="img" aria-label="People telling a legend around a lantern at night">' +
  '<rect width="520" height="190" rx="16" fill="#1d1a3a"/>' +
  '<circle cx="80" cy="44" r="20" fill="#fff6c9"/><circle cx="200" cy="30" r="2" fill="#fff"/><circle cx="330" cy="54" r="2" fill="#fff"/><circle cx="420" cy="22" r="2" fill="#fff"/>' +
  '<path d="M0 160h520v30H0z" fill="#2b2650"/>' +
  '<path d="M250 160v-50" stroke="#7a5532" stroke-width="4"/><rect x="236" y="98" width="28" height="36" rx="6" fill="#ffd23f" stroke="#141a33" stroke-width="2"/><circle cx="250" cy="116" r="30" fill="#ffd23f" fill-opacity=".18"/>' +
  [[170, 1], [330, -1], [120, 1], [380, -1]].map(function(p, k){
    return '<g transform="translate(' + p[0] + ' ' + (k > 1 ? 150 : 140) + ')"><circle cx="0" cy="-34" r="12" fill="#3a3466"/><path d="M-16 20q0 -40 16 -40q16 0 16 40z" fill="#3a3466"/></g>';
  }).join("") +
  A2ART.egg('<g transform="translate(470 120)"><ellipse rx="16" ry="20" fill="#8a6a4a"/><circle cx="-6" cy="-8" r="6" fill="#fff6c9"/><circle cx="6" cy="-8" r="6" fill="#fff6c9"/><circle cx="-6" cy="-8" r="2.5" fill="#141a33"/><circle cx="6" cy="-8" r="2.5" fill="#141a33"/><path d="M-3 0l3 5 3 -5z" fill="#f2a516"/><path d="M-10 -18l4 6M10 -18l-4 6" stroke="#8a6a4a" stroke-width="4"/></g>',
    "An owl. In lots of old stories, owls stand for wisdom. Jay likes birds, so he approves of this message.") +
  '</svg>';

/* challenge checklist, away from the screen */
var HUNT = [
  "Ask someone at home for a myth, legend, fable or old saying from their family or culture",
  "Ask them what they think its hidden message is",
  "Tell someone one story from today and see if they can spot the message",
  "Spot a hidden message in a film, song or advert you like",
  "Find a modern urban myth and work out what it is warning people about"
];
function huntWidget(el, api){
  var d = api.data || {};
  if(!Array.isArray(d.ticks)) d.ticks = [];
  el.innerHTML = '<div class="a2task"><h4>Legend hunt</h4><p>Away from the screen, whenever suits you. Pick any you fancy, in any order. Tick the ones you had a go at. One is plenty.</p><div class="xlist"></div>' +
    '<p class="tiny" style="margin-top:8px">If you like, jot down what you found on the card at the end and send it to Jay.</p></div>';
  var list = el.querySelector(".xlist");
  HUNT.forEach(function(t, k){
    var lab = document.createElement("label");
    lab.style.cssText = "display:flex;gap:10px;align-items:flex-start;margin:8px 0;font-size:1rem;cursor:pointer";
    var cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = !!d.ticks[k];
    cb.style.cssText = "width:22px;height:22px;flex:none;margin-top:2px";
    cb.onchange = function(){ d.ticks[k] = cb.checked; try{ api.save(); }catch(err){} if(!api.resolved()) api.done("done"); };
    lab.appendChild(cb); lab.appendChild(document.createTextNode(t));
    list.appendChild(lab);
  });
}
/* easy read for LC: the same hunt, in fewer words */
var HUNT_EZ = [
  "Ask someone at home for an old story from their family",
  "Ask them what its hidden message is",
  "Tell someone a story from today. Can they spot the message?",
  "Spot a hidden message in a film, song or advert",
  "Find a modern urban myth. What does it warn about?"
];
function huntWidgetEz(el, api){
  var d = api.data || {};
  if(!Array.isArray(d.ticks)) d.ticks = [];
  el.innerHTML = '<div class="a2task"><h4>Legend hunt</h4><p>Away from the screen. Pick any you like. One is plenty.</p><div class="xlist"></div>' +
    '<p class="tiny" style="margin-top:8px">Jot it on the card at the end, if you like.</p></div>';
  var list = el.querySelector(".xlist");
  HUNT_EZ.forEach(function(t, k){
    var lab = document.createElement("label");
    lab.style.cssText = "display:flex;gap:10px;align-items:flex-start;margin:8px 0;font-size:1rem;cursor:pointer";
    var cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = !!d.ticks[k];
    cb.style.cssText = "width:22px;height:22px;flex:none;margin-top:2px";
    cb.onchange = function(){ d.ticks[k] = cb.checked; try{ api.save(); }catch(err){} if(!api.resolved()) api.done("done"); };
    lab.appendChild(cb); lab.appendChild(document.createTextNode(t));
    list.appendChild(lab);
  });
}

function esc(t){ return String(t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n){ if(cur.trim()) out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }

var STORY_WOLF = "<p class=\"a2task\"><b>The boy who shouted wolf</b> (a very old fable, retold)<br>" +
  "A boy was looking after the village sheep on a hill. He was bored. So he shouted, \"Wolf! Wolf!\" and the villagers dropped everything and ran up the hill to help. There was no wolf. The boy laughed.<br>" +
  "The next day, he did it again. Up they ran. No wolf. He laughed even harder.<br>" +
  "On the third day, a real wolf crept out from behind a rock. The boy shouted \"Wolf!\" as loud as he could. Down in the village, people shook their heads and carried on with their work. Nobody came, and the wolf scattered the whole flock.</p>";
var STORY_WOLF_MILD = "<p class=\"a2task\"><b>The boy who shouted wolf</b><br>" +
  "A boy looked after sheep on a hill. He was bored. He shouted, \"Wolf!\" The villagers ran to help. There was no wolf. He laughed.<br>" +
  "He did it again. No wolf.<br>" +
  "Then a real wolf came. He shouted, \"Wolf!\" Nobody came. They did not believe him any more.</p>";

var STORY_ICARUS = "<p class=\"a2task\"><b>The boy who flew too high</b> (a Greek myth, retold)<br>" +
  "Daedalus was a clever inventor, trapped on an island with his son, Icarus. To escape, he built two pairs of wings from feathers and wax.<br>" +
  "\"Fly in the middle,\" he told Icarus. \"Too low and the sea spray will soak the feathers. Too high and the sun will melt the wax.\"<br>" +
  "They took off. Icarus loved it. He swooped and spun, and he forgot everything his father had said. Higher and higher he climbed, until the sun softened the wax and the feathers drifted away one by one. Icarus fell into the sea, and his father flew home alone.</p>";
var STORY_ICARUS_MILD = "<p class=\"a2task\"><b>The boy who flew too high</b><br>" +
  "Icarus and his dad made wings from feathers and wax.<br>" +
  "His dad said, \"Do not fly too high. The sun will melt the wax.\"<br>" +
  "Icarus loved flying. He went higher and higher. The wax melted. The feathers fell off, and Icarus fell into the sea.</p>";

var STORY_MIDAS = "<p class=\"a2task\"><b>The golden touch</b> (a Greek myth, retold)<br>" +
  "King Midas already had more gold than anyone in his kingdom, but he always wanted more. One day he was granted a wish. \"Let everything I touch turn to gold,\" he said.<br>" +
  "At first it was wonderful. Twigs, stones and doors all turned to gold. Then he sat down to dinner. His bread turned to gold. His water turned to gold. He could not eat or drink a thing.<br>" +
  "Hungry and frightened, Midas begged for the wish to be taken back. He was told to wash in the river, and the golden touch flowed away. From then on, he cared far less about gold.</p>";
var STORY_MIDAS_MILD = "<p class=\"a2task\"><b>The golden touch</b><br>" +
  "King Midas loved gold. He made a wish: \"Let everything I touch turn to gold.\"<br>" +
  "His chair turned to gold. Great! Then his dinner turned to gold. He could not eat. His drink turned to gold. He could not drink.<br>" +
  "He washed in the river to make the wish go away. After that, he did not care so much about gold.</p>";

(window.A2PACKS = window.A2PACKS || {})["hidden-messages"] = {
  a2: true,
  id: "a2-hidden-messages",
  title: "Hidden messages",
  subject: "Human and Social",
  bodyClass: "subj-home subj-pillar",
  mins: 25,
  line: "Old stories have a secret job. Find the moral, the warning or the value hiding inside.",
  blurb: "Myths, legends and fables were told to teach something. Four short chunks to spot the hidden message, then a legend hunt to try away from the screen, and a message card to make.",
  note: "The hidden messages inside myths and legends, then a legend hunt away from the screen. Four five minute chunks. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Campfire", line: "Campfire: short stories, one clear message each." },
    { id: "medium", name: "Storyteller", line: "Storyteller: longer stories, and the clues that point to the message." },
    { id: "spicy", name: "Myth buster", line: "Myth buster: why people told these stories, and whether the message still holds." }
  ],
  themes: {
    time: { name: "Time travel", w: {
      lname: "The museum hourglass",
      legend: "Visitors say the old hourglass in the museum will give you one extra hour if you turn it and ask politely. One visitor wanted more. He turned it again and again, grabbing hour after hour. When he finally stepped outside, the trees had grown tall, his friends had grown up, and his own hair had turned grey. He had taken so many hours that he had missed his whole life.",
      short: "The old hourglass in the museum gives you one extra hour if you ask politely. One visitor turned it again and again for more and more hours. When he stepped outside, his friends had grown up and his hair was grey. He had missed everything.",
      msg: "Do not grab more than you need", not1: "Hourglasses are good for telling the time", not2: "Museums are full of old things",
      clue: "He turned it again and again, and missed everything", nc1: "The hourglass is in a museum", nc2: "Visitors talk about the hourglass" } },
    football: { name: "Football", w: {
      lname: "The golden boots",
      legend: "Players whisper that a pair of golden boots hangs in the old changing room. Wear them and every shot goes in. One striker found them and wore them every match. He never passed, never tackled and never said well done to anyone. He scored a hundred goals, but by the end of the season nobody would play with him, and the team lost the final.",
      short: "A pair of golden boots hangs in the old changing room. Wear them and every shot goes in. One striker wore them and never passed to anyone. By the end of the season nobody would play with him, and the team lost.",
      msg: "Being part of a team matters more than being the star", not1: "Golden boots help you score", not2: "Changing rooms are full of secrets",
      clue: "He never passed, and nobody would play with him", nc1: "The boots hang in the old changing room", nc2: "The boots are golden" } },
    horror: { name: "Horror", w: {
      lname: "The lift to floor 13",
      legend: "In the old hospital, the lift has a button for floor 13 that only glows at midnight. The night porter tells every new worker the same thing: never press it. One new worker laughed and pressed it anyway. The doors opened onto a corridor of flickering lights that went on and on. He walked all night looking for the way back. At sunrise he was found asleep in the lift, holding a key that nobody could explain.",
      short: "In the old hospital, a lift button for floor 13 glows at midnight. The night porter says: never press it. One new worker laughed and pressed it. He walked all night down a flickering corridor, looking for the way back.",
      msg: "Listen to warnings from people who know the place", not1: "Lifts are quicker than the stairs", not2: "Hospitals are busy at night",
      clue: "He laughed at the warning and pressed it anyway", nc1: "The button only glows at midnight", nc2: "The lights in the corridor flicker" } },
    fishing: { name: "Fishing", w: {
      lname: "The giant pike of Black Mere",
      legend: "Anglers say the giant pike of Black Mere will grant one wish to anyone who sets it free. One angler hooked it at dawn. He wished for a full net every day, and the pike agreed. But then he kept the pike anyway, to show off to his friends. From that day on, his net came up empty every single time, and the pike was never seen again.",
      short: "The giant pike of Black Mere grants a wish if you set it free. One angler caught it and made his wish, then kept the pike anyway to show off. From that day, his net always came up empty.",
      msg: "Keep your promises, even when nobody can make you", not1: "Pike are the biggest fish in the lake", not2: "Dawn is the best time to fish",
      clue: "He made the wish, then kept the pike anyway", nc1: "He hooked it at dawn", nc2: "The lake is called Black Mere" } },
    music: { name: "Music", w: {
      lname: "The ghost in the top balcony",
      legend: "Theatre crews say a ghost sits in the top balcony on every opening night. If the cast are kind to the crew, the ghost claps and the show is a hit. One star was rude to everyone backstage: the dressers, the lighting team, even the cleaner. On opening night, her microphone crackled, her shoes went missing and the spotlight never quite found her.",
      short: "A ghost sits in the top balcony on opening night. If the cast are kind to the crew, it claps. One star was rude to everyone backstage. On opening night, her microphone crackled and her shoes went missing.",
      msg: "Treat everyone with respect, not just the important people", not1: "Theatres are haunted", not2: "Opening night is the most exciting night",
      clue: "She was rude to the crew, and her show went badly", nc1: "The ghost sits in the top balcony", nc2: "It happens on opening night" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: START,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Stories with a secret job", title: "Every old story has a job",
      fig: TYPES,
      html: "<p>Long before books and screens, people told stories out loud: <b>myths</b>, <b>legends</b> and <b>fables</b>. They were fun, but they also had a secret job. They carried a <b>hidden message</b>.</p>" +
        "<p>Most hidden messages are one of three kinds. A <b>moral</b> tells you how to behave. A <b>warning</b> tells you what to watch out for. A <b>value</b> shows what mattered to the people telling it.</p>",
      lv: {
        mild: { html: "<p>Old stories have a <b>hidden message</b>. The story is trying to teach you something.</p><p>A <b>moral</b>: how to behave. A <b>warning</b>: what to watch out for. A <b>value</b>: what matters to people.</p>" },
        spicy: { html: "<p>Before writing was common, stories were how people passed things on. A <b>myth</b> often explains the world (gods, the sun, the seasons). A <b>legend</b> is about a hero or a place, sometimes based on something real. A <b>fable</b> is a short story, often with animals, built around one lesson.</p>" +
          "<p>The hidden message is usually a <b>moral</b> (how to behave), a <b>warning</b> (what to fear or avoid) or a <b>value</b> (what the group cares about). Spotting it tells you as much about the people who told the story as about the story itself.</p>" } } ,
      ez: { title: "Every old story has a job", html: "<p>Old stories hide a <b>message</b>.</p><p><b>Moral</b>: how to act. <b>Warning</b>: watch out. <b>Value</b>: what matters.</p>" } },

    { type: "sort", topic: "Stories with a secret job",
      q: "Sort these hidden messages. Moral, warning or value?",
      buckets: ["Moral: how to behave", "Warning: watch out", "Value: what matters"],
      cards: [["Share what you have", 0], ["Do not swim in the deep pool", 1], ["Family matters most", 2], ["Help people who need it", 0], ["Stay out of the forest after dark", 1], ["Being brave is important", 2]],
      hint: "A moral says how to act. A warning says what to avoid. A value says what is important.",
      ez: { q: "Moral, warning or value? Sort them.", hint: "Moral is how to act. Warning is danger.", why: "Sharing is a moral. Pool and forest are warnings. Family is a value." },
      why: "Sharing and helping are how to behave. The pool and the forest are dangers. Family and bravery are things people care about.",
      lv: {
        mild: { cards: [["Share what you have", 0], ["Do not swim in the deep pool", 1], ["Family matters most", 2], ["Stay out of the forest after dark", 1]] },
        spicy: { cards: [["Pride comes before a fall", 1], ["Treat guests well, whoever they are", 0], ["Cleverness beats strength", 2], ["Do not trust a stranger who offers you a shortcut", 1], ["Keep your word, even when it costs you", 0], ["The land belongs to everyone who looks after it", 2]],
          why: "Pride and shortcuts are things to fear. Treating guests well and keeping your word are how to behave. Cleverness and caring for the land are what a group values. Some could fit two boxes: that is fine to talk about." } } },

    { type: "learn", topic: "Stories with a secret job", title: "A fable to try",
      fig: WOLF,
      html: STORY_WOLF,
      lv: { mild: { html: STORY_WOLF_MILD } } },

    { type: "mc", topic: "Stories with a secret job",
      q: "What is the hidden message in the boy who shouted wolf?",
      options: ["If you tell lies, people stop believing you, even when you tell the truth", "Wolves are dangerous animals", "Looking after sheep is boring"],
      answer: 0,
      slips: { 1: "Wolves are in the story, but the story is not really about wolves. What happens to the boy, and why?", 2: "He was bored, but that is how it starts, not what it teaches." },
      hint: "Why did nobody come on the third day?",
      why: "Nobody came because he had lied twice. The message: lies cost you trust.",
      ez: { q: "What is the hidden message?", hint: "Why did nobody come at the end?", why: "He lied twice. So nobody believed him.", slips: { 1: "There is a wolf. But why did nobody help?" } },
      lv: {
        mild: { options: ["If you tell lies, people stop believing you", "Wolves are dangerous"],
          slips: { 1: "There is a wolf in it, but why did nobody come to help?" } },
        spicy: { q: "Which is the <b>best</b> reading of the hidden message?",
          options: ["Trust is easy to lose and hard to win back", "Never shout in a village", "Villagers should always check twice", "Wolves come out on the third day"],
          slips: { 1: "Shouting is not the problem. Shouting things that are not true is.", 2: "Interesting, but the story puts the blame on the boy, not the villagers.", 3: "That is a detail of this story, not a message for life." },
          why: "The boy loses something he cannot get back quickly: people's trust. That works far beyond sheep and wolves." } } },

    { type: "mc", topic: "Stories with a secret job", explain: true,
      q: "Which part of the story shows the message most clearly?",
      fig: TELL,
      options: ["On the third day, nobody came", "He was looking after sheep", "The wolf hid behind a rock"],
      answer: 0,
      slips: { 1: "That sets the scene. Look for the moment the boy pays for what he did.", 2: "That is exciting, but look for what the villagers did." },
      hint: "Look near the end, where things go badly for the boy.",
      why: "Nobody coming is the result of his lies. That is where the message shows.",
      ez: { q: "Which part shows the message best?", hint: "Look at the end.", why: "Nobody came because of his lies.", slips: { 1: "That is the start. Look at the end." } },
      lv: {
        mild: { options: ["Nobody came", "He was looking after sheep"],
          slips: { 1: "That is how it starts. Look at the end." } },
        spicy: { options: ["Nobody came, and the flock was lost", "He was bored on the hill", "He laughed even harder", "The wolf crept out from behind a rock"],
          slips: { 1: "Boredom is why he lied, not what the story teaches.", 2: "That shows he did not care, but the message lands when it costs him.", 3: "That is the danger arriving. What do the villagers do about it?" },
          why: "The cost of his lies arrives at the end. Storytellers often put the message where the consequence is." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Find the clue", title: "Look at what happens",
      routes: [
        { name: "Read it", fig: CLUE, html: "<p>The biggest clue to a hidden message is <b>what happens</b> after a choice. Who is rewarded? Who ends up in trouble? Why?</p>" + STORY_ICARUS },
        { name: "See it", fig: ICARUS, html: "<p>Here is the same myth in three pictures. Look for the choice, and what happens after it.</p><p>1. His father fixes on the wings and warns him: not too high, or the sun will melt the wax.<br>2. Icarus loves flying and goes higher and higher.<br>3. The wax melts, the feathers fall, and Icarus falls into the sea.</p>" }
      ],
      lv: {
        mild: { routes: [
          { name: "Read it", fig: CLUE, html: "<p>Clue: look at <b>what happens</b> at the end.</p>" + STORY_ICARUS_MILD },
          { name: "See it", fig: ICARUS, html: "<p>1. Dad says: not too high.<br>2. Icarus goes higher and higher.<br>3. The wax melts. Splash.</p>" }
        ] } } },

    { type: "mc", topic: "Find the clue",
      q: "What did Daedalus warn Icarus about?",
      fig: ICARUS,
      options: ["Flying too high, because the sun would melt the wax", "Flying at night, because he would get lost", "Flying alone, because he would get bored"],
      answer: 0,
      slips: { 1: "Night is not in the story. Look at the first picture.", 2: "He was not alone: they flew together. Look at what his father said." },
      hint: "Look at the first picture.",
      why: "Too high, and the sun would melt the wax. (Too low, and the sea would soak the feathers.)" ,
      ez: { why: "Too high. The sun would melt the wax.", slips: { 1: "Night is not in it. Look at picture 1.", 2: "They flew together. What did Dad say?" } } },

    { type: "mc", topic: "Find the clue",
      q: "What is the hidden message in the Icarus myth?",
      options: ["Listen to good advice, even when you are having fun", "Never try to fly", "The sun is very hot"],
      answer: 0,
      slips: { 1: "Flying went fine at first. The trouble came from one choice. Which one?", 2: "True, but that is a fact in the story, not what it teaches about how to live." },
      hint: "What did Icarus forget, and what happened?",
      why: "He forgot his father's advice when he got carried away, and it cost him everything.",
      ez: { q: "What is the hidden message?", hint: "What did Icarus forget?", why: "He forgot Dad's advice. It cost him.", slips: { 1: "Flying was fine. Going too high was not." } },
      lv: {
        mild: { options: ["Listen to good advice", "Never try to fly"],
          slips: { 1: "Flying was fine. The trouble came when he went too high." } },
        spicy: { q: "Which reading of the message fits the story best?",
          options: ["Thinking you are unstoppable can lead to a fall", "Inventors should not test their own inventions", "Children should never be allowed to take risks", "The sea is more dangerous than the sun"],
          slips: { 1: "The wings worked fine when used as Daedalus said.", 2: "Daedalus let him fly. The story is about going too far, not about taking any risk at all.", 3: "Both are dangers in the story, but the message is about the choice Icarus made." },
          why: "Icarus got carried away and thought he could go anywhere. People sometimes call this being too proud. A related English saying is \"pride comes before a fall\"." } } },

    { type: "multi", topic: "Find the clue",
      q: "Which details are clues to the message? Pick <b>two</b>.",
      options: ["His father warns him not to fly too high", "Icarus goes higher and higher", "The wings are made of feathers and wax", "They were trapped on an island"],
      answers: [0, 1],
      hint: "Look for the warning, and the choice that ignores it.",
      why: "The warning and the choice to ignore it point straight at the message. The feathers and the island are just the setting.",
      ez: { q: "Which detail is the biggest clue?", hint: "Look for the warning.", why: "The warning is the clue." },
      lv: {
        mild: { q: "Which detail is the biggest clue to the message?",
          options: ["Dad says do not fly too high", "The wings have feathers"], answers: [0],
          why: "The warning is the clue. Feathers are just how the wings are made." },
        spicy: { q: "Which details are clues to the message? Pick <b>three</b>.",
          options: ["His father warns him to fly in the middle", "He forgot everything his father had said", "Higher and higher he climbed", "Daedalus was a clever inventor", "They were trapped on an island"],
          answers: [0, 1, 2],
          why: "The warning, the forgetting and the climbing build the message. The inventor and the island set up the story." } } },

    { type: "text", topic: "Find the clue",
      q: "In your own words, what is Icarus trying to teach us? One sentence is plenty.",
      need: [["listen", "advice", "warn", "careful", "told", "show", "too", "high", "proud", "confident", "rule", "dad", "father", "parent", "safe", "danger", "limit", "carried", "ignore", "sensible", "unstoppable"]],
      model: "Listen to good advice, even when you are having fun.",
      hint: "Think about what Icarus should have done.",
      why: "Anything like \"listen to advice\" or \"do not get carried away\" fits. Different words, same message." ,
      ez: { q: "What is Icarus trying to teach us? A few words is plenty.", hint: "What should Icarus have done?", why: "Like <b>listen to advice</b>. Any words that mean that." } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Still true today?", title: "An old message in a new world",
      fig: MIDAS,
      html: STORY_MIDAS + "<p>Messages from very old stories often still fit today. The magic is not the point. The message is.</p>",
      lv: {
        mild: { html: STORY_MIDAS_MILD + "<p>Old stories can still teach us things today.</p>" },
        spicy: { html: STORY_MIDAS + "<p>Ask two questions about any old story: <b>why might people have told it?</b> And <b>does the message still hold today?</b> A story about a king and gold might once have warned rulers about greed. Today it could fit anyone chasing money, followers or likes.</p>" } } },

    { type: "mc", topic: "Still true today?",
      q: "What is the hidden message in the golden touch?",
      options: ["Wanting more and more can cost you the things that really matter", "Gold is the best thing to have", "Always wash your hands before dinner"],
      answer: 0,
      slips: { 1: "Midas had loads of gold and was miserable. The story says the opposite.", 2: "He did wash in the river, but that is how the wish ended, not what the story teaches." },
      hint: "Did all that gold make Midas happy?",
      why: "His greed turned his food and drink to gold. More was not better.",
      ez: { q: "What is the hidden message?", hint: "Did the gold make him happy?", why: "Too much gold. He could not even eat.", slips: { 1: "He could not eat. Was that good?" } },
      lv: {
        mild: { options: ["Wanting too much can go badly", "Gold is the best thing to have"],
          slips: { 1: "He had lots of gold and could not even eat. Was that good?" } },
        spicy: { options: ["Greed can destroy the ordinary things that keep you alive and happy", "Wishes are dangerous, so never make one", "Kings should share their gold with the kingdom", "Rivers can wash away magic"],
          slips: { 1: "Close, but the problem was what he wished for, not wishing at all.", 2: "A fair idea, but the story never mentions sharing.", 3: "That is a detail of the plot, not a message." },
          why: "Midas had everything he wanted and could not eat. The message is about greed, and what it can cost you." } } },

    { type: "match", topic: "Still true today?",
      q: "Match each old story to a modern situation with the same message.",
      pairs: [["The boy who shouted wolf", "Someone keeps faking being ill, so nobody believes them when they really are"], ["Icarus", "Someone speeds because it feels great, even though they were told to slow down"], ["The golden touch", "Someone spends every penny on stuff and has nothing left for food"]],
      hint: "Lies, ignoring advice, and greed. Which modern one matches each?",
      why: "Lies lose trust. Ignoring advice when you are carried away is dangerous. Greed costs you what matters. Same messages, new places.",
      ez: { q: "Match each old story to a story today.", hint: "Lies. Not listening. Greed.", why: "Same messages, new places." },
      lv: {
        spicy: { q: "Why might people have told each story? Match each one to a likely reason.",
          pairs: [["A water spirit pulls children into the river", "To keep children away from dangerous water"], ["A small hero wins by being clever, not strong", "To show the people valued quick thinking"], ["A king loses everything through greed", "To warn rulers not to grab too much"], ["A liar is not believed when it matters", "To keep a small village honest"]],
          hint: "Ask: who would want this story told, and what were they worried about?",
          why: "Stories often protected people or passed on what a group cared about. Working out why a story was told is part of reading its hidden message." } } },

    { type: "mc", topic: "Still true today?",
      q: "Someone says: \"Midas is just a story about magic, so it has nothing to teach us.\" What is the best reply?",
      options: ["The magic is not the point: the message about greed still fits real life", "They are right: magic is not real, so it is useless", "Gold is not worth much these days anyway"],
      answer: 0,
      slips: { 1: "Magic is not real, but people chasing more and more is very real.", 2: "Gold is still worth a lot, and anyway the message is not really about gold." },
      hint: "Is greed still around today?",
      why: "A story can be made up and still be true about people. That is what makes a hidden message last for thousands of years.",
      ez: { q: "Someone says: \"Midas is just magic. It teaches nothing.\" What is the best reply?", hint: "Are people still greedy today?", why: "Made up, but still true about people.", slips: { 1: "Magic is not real. But wanting too much is." } },
      lv: {
        mild: { options: ["The message about wanting too much still fits today", "Magic is not real, so it is useless"],
          slips: { 1: "Magic is not real, but people wanting too much is." } },
        spicy: { options: ["A story can be invented and still say something true about people", "Myths only matter to historians", "If a story is not real, its message cannot be real either", "The message only fits kings, not ordinary people"],
          slips: { 1: "Historians do study them, but the messages are for everyone.", 2: "Made up stories can still carry real truths. That is how fables work.", 3: "Anyone can be greedy. The king just makes it bigger and easier to see." },
          why: "Fiction is a way of showing real truths about people. That is why these stories have lasted for thousands of years." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Legends of your world", title: "Legends are still being made",
      fig: NIGHT,
      html: "<p>People still make up legends today. You might hear them as urban myths, \"a friend of a friend\" stories or spooky tales. They carry hidden messages too.</p>" +
        "<p class=\"a2task\"><b>[[Lname]]</b><br>[[Legend]]</p>",
      lv: { mild: { html: "<p>People still tell legends today. Here is one.</p><p class=\"a2task\"><b>[[Lname]]</b><br>[[Short]]</p>" } } },

    { type: "mc", topic: "Legends of your world",
      q: "What is the hidden message in <b>[[Lname]]</b>?",
      options: ["[[Msg]]", "[[Not1]]", "[[Not2]]"],
      answer: 0,
      slips: { 1: "That might be true, but it is not what the story is trying to teach. Look at what happens to the main character.", 2: "That is the setting, not the message. What choice gets someone into trouble?" },
      hint: "Look for the choice someone makes, and what happens after.",
      why: "[[Msg]]. The trouble at the end shows it." ,
      ez: { hint: "What choice causes trouble?", why: "[[Msg]]. Look at the trouble at the end.", slips: { 1: "Maybe true, but look at what happens.", 2: "That is the setting. What choice causes trouble?" } } },

    { type: "mc", topic: "Legends of your world", explain: true,
      q: "Which detail is the biggest clue to that message?",
      options: ["[[Clue]]", "[[Nc1]]", "[[Nc2]]"],
      answer: 0,
      slips: { 1: "That sets the scene. Look for a choice and what it leads to.", 2: "That is a detail, but it does not point to the message. Look for the choice." },
      hint: "Choice, then what happens. Find both.",
      why: "[[Clue]]: a choice and what it led to. That is where the message lives." ,
      ez: { q: "Which detail is the biggest clue?", hint: "A choice, then what happens.", why: "[[Clue]]. A choice, then trouble.", slips: { 1: "That sets the scene. Find a choice.", 2: "A detail, but not the clue. Find a choice." } } },

    { type: "write", topic: "Legends of your world",
      q: "Get ready for the legend hunt. Think of a myth, legend, fable, or even a film or song you know. What is its hidden message? Is it a moral, a warning or a value? Write as much or as little as you like. It only goes to Jay if you choose.",
      fig: TYPES,
      starters: ["A story I know is", "I think its hidden message is", "The clue is when", "It is a moral / warning / value because", "I think it is still true today because"],
      checklist: ["I named a story", "I said what I think its message is"],
      ez: { q: "Only if you like: think of a story, film or song. What is its hidden message?" },
      minWords: 15,
      lv: {
        mild: { minWords: 6, starters: ["A story I know is", "I think it teaches us", "The clue is when"] },
        spicy: { minWords: 35, checklist: ["I named a story", "I said what I think its message is", "I gave the detail that shows it", "I said whether it still holds today, and why"],
          starters: ["One story I know well is", "Its hidden message seems to be", "The clearest clue is when", "People might have told it because", "Today, the message still holds / does not hold because"] } } },

    { type: "widget", topic: "Legends of your world", unscored: true,
      title: "Your challenge, away from the screen",
      html: "<p>A real world task for whenever you are ready. Results can go to Jay with the rest, if you send it.</p>",
      mount: huntWidget,
      ez: { title: "Away from the screen", html: "<p>A real world task. Only if you like.</p>", mount: huntWidgetEz },
      report: function(d){ var n = d && d.ticks ? d.ticks.filter(Boolean).length : 0; return n ? "Legend hunt: had a go at " + n + " of " + HUNT.length + "." : ""; } }
  ],

  realWorld: {
    title: "Hidden messages are everywhere",
    html: "<p>Films, songs, adverts, road safety campaigns and fairy tales all carry hidden messages. Spotting them means you get to decide whether you agree, instead of just soaking them up.</p>" +
      "<p>For our big question: if we could time travel, should we? Old myths are the closest thing we have to messages from the past. The Icarus myth was told over two thousand years ago, and its warning still lands today. You do not need a time machine to hear what those people were worried about.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="An old scroll coming out of a time portal">' + A2ART.portal(90, 75, 56) +
      '<g transform="rotate(-6 270 75)"><path d="M190 40h150q12 0 12 12v56q0 12 -12 12h-150z" fill="#f3e2b8" stroke="#7a5532" stroke-width="3"/><rect x="180" y="32" width="18" height="96" rx="9" fill="#c99a63" stroke="#7a5532" stroke-width="3"/>' +
      '<text x="270" y="74" text-anchor="middle" ' + F + ' font-size="14" font-weight="700" fill="#5a3a1a">Not too high!</text>' +
      '<text x="270" y="96" text-anchor="middle" ' + F + ' font-size="13" fill="#5a3a1a">love, the past</text></g>' +
      A2ART.bird(380, 32, 0.7, "#3a8fd6") + '</svg>'
  },

  ez: {
    realWorld: { html: "<p>Films, songs and adverts hide messages too.</p><p>Icarus is over 2000 years old. Its warning still works today!</p>" },
    make: { intro: "One story and its hidden message. Is it still true today?" }
  },

  make: {
    title: "Make a hidden message card",
    intro: "One story, its hidden message, and whether it still holds today. Use one from today, or one you found on your legend hunt. Keep it, or send it to Jay.",
    fields: [
      { id: "story", label: "The story", ph: "The boy who shouted wolf", max: 40 },
      { id: "msg", label: "Its hidden message", ph: "If you tell lies, people stop believing you", max: 80 },
      { id: "kind", label: "Moral, warning or value?", ph: "Moral", max: 20 },
      { id: "today", label: "Still true today?", ph: "Yes, trust is still hard to win back", max: 60 },
      { id: "name", label: "Found by", ph: "Message hunter", max: 24 }
    ],
    svg: function(v){
      function tx(x, y, t, sz, w, c, a){ return '<text x="' + x + '" y="' + y + '" font-family="Georgia,Verdana,serif" font-size="' + sz + '"' + (w ? ' font-weight="700"' : "") + (a ? ' text-anchor="' + a + '"' : "") + ' fill="' + (c || "#4a2c12") + '">' + t + '</text>'; }
      var story = wrap(v.story, 30, 2), msg = wrap(v.msg, 30, 3), today = wrap(v.today, 40, 2), y = 0, s = "";
      s += tx(300, 74, "HIDDEN MESSAGE", 24, 1, "#8a2a2a", "middle");
      s += story.map(function(l, k){ return tx(300, 112 + k * 28, esc(l), 22, 1, "#4a2c12", "middle"); }).join("");
      y = 112 + story.length * 28 + 14;
      s += '<path d="M150 ' + (y - 10) + 'H450" stroke="#a0784a" stroke-width="2" stroke-dasharray="6 6"/>';
      s += msg.map(function(l, k){ return tx(300, y + 26 + k * 30, esc(l), 22, 0, "#2b1a0a", "middle"); }).join("");
      y += 26 + msg.length * 30 + 10;
      s += tx(300, y + 10, "Kind: " + esc(v.kind), 17, 1, "#8a2a2a", "middle");
      s += tx(300, y + 44, "Still true today?", 15, 0, "#7a5532", "middle") + today.map(function(l, k){ return tx(300, y + 68 + k * 24, esc(l), 17, 0, "#2b1a0a", "middle"); }).join("");
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500">' +
        '<rect width="600" height="500" rx="20" fill="#2d2466"/>' +
        '<path d="M70 30h460q20 0 20 20v400q0 20 -20 20h-460q-20 0 -20 -20v-400q0 -20 20 -20z" fill="#f3e2b8" stroke="#7a5532" stroke-width="4"/>' +
        '<rect x="40" y="20" width="520" height="22" rx="11" fill="#c99a63" stroke="#7a5532" stroke-width="3"/>' +
        '<rect x="40" y="458" width="520" height="22" rx="11" fill="#c99a63" stroke="#7a5532" stroke-width="3"/>' +
        s +
        '<g transform="translate(500 82)"><circle r="30" fill="#b3261e"/><circle r="22" fill="none" stroke="#7a1712" stroke-width="3"/><text y="7" text-anchor="middle" font-family="Georgia,serif" font-size="20" font-weight="700" fill="#f3e2b8">B5</text></g>' +
        tx(80, 440, "Found by: " + esc(v.name), 15, 0, "#7a5532") + '</svg>';
    }
  }
};
})();
