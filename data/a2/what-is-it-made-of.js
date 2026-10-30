/* Base 5 Autumn 2 activity: What is it made of?
   Science. Objects and materials, properties, choosing the right material
   for the job, and where materials come from, ending with a material hunt
   challenge card to take away from the screen. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, extra){ extra = extra || ""; return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (/fill=/.test(extra) ? "" : ' fill="#141a33"') + extra + '>' + s + '</text>'; }

/* little drawings of everyday objects, each centred on 0,0 */
var ICON = {
  chair: '<path d="M-20 -34v54M20 -34v54M-20 -34h40M-20 -18h40M-20 0h40" stroke="#8a5a2b" stroke-width="6" stroke-linecap="round"/><path d="M-24 0h48v8h-48z" fill="#b07a43"/><path d="M-20 8v26M20 8v26" stroke="#8a5a2b" stroke-width="6" stroke-linecap="round"/>',
  window: '<rect x="-28" y="-32" width="56" height="64" rx="3" fill="#bfe9ff" stroke="#5b6180" stroke-width="5"/><path d="M0 -32v64M-28 0h56" stroke="#5b6180" stroke-width="4"/><path d="M-20 -24l10 -0M-20 -18l14 -12" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>',
  bottle: '<path d="M-8 -36h16v12q14 8 14 24v34q0 6 -6 6h-32q-6 0 -6 -6v-34q0 -16 14 -24z" fill="#d6f1ff" fill-opacity=".9" stroke="#3a8fd6" stroke-width="3"/><rect x="-9" y="-42" width="18" height="8" rx="2" fill="#3a8fd6"/><rect x="-14" y="2" width="28" height="14" fill="#3a8fd6" fill-opacity=".5"/>',
  spoon: '<ellipse cx="0" cy="-22" rx="12" ry="16" fill="#c5cad6" stroke="#5b6180" stroke-width="3"/><path d="M0 -6v42" stroke="#9aa1b5" stroke-width="7" stroke-linecap="round"/>',
  jumper: '<path d="M-14 -30q14 10 28 0l26 12 -8 22 -10 -4v36h-44v-36l-10 4 -8 -22z" fill="#e04848" stroke="#9c2a2a" stroke-width="3" stroke-linejoin="round"/><path d="M-22 26h44" stroke="#9c2a2a" stroke-width="3" stroke-dasharray="3 3"/>',
  fork: '<path d="M0 -6v40" stroke="#9aa1b5" stroke-width="6" stroke-linecap="round"/><path d="M-10 -34v18q0 10 10 10q10 0 10 -10v-18M0 -34v22" stroke="#9aa1b5" stroke-width="4" fill="none" stroke-linecap="round"/>',
  wspoon: '<ellipse cx="0" cy="-22" rx="11" ry="15" fill="#c99a63" stroke="#8a5a2b" stroke-width="3"/><path d="M0 -6v42" stroke="#b07a43" stroke-width="7" stroke-linecap="round"/>',
  pan: '<ellipse cx="-6" cy="4" rx="26" ry="10" fill="#6b7389"/><path d="M-32 4v8q26 16 52 0v-8" fill="#4a5168"/><path d="M20 4h22" stroke="#4a5168" stroke-width="7" stroke-linecap="round"/>',
  jar: '<rect x="-20" y="-24" width="40" height="52" rx="8" fill="#e8f7ff" stroke="#3a8fd6" stroke-width="3"/><rect x="-22" y="-34" width="44" height="12" rx="3" fill="#e04848"/><path d="M-12 -14v26" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>',
  key: '<circle cx="-14" cy="0" r="12" fill="none" stroke="#c9a227" stroke-width="6"/><path d="M-2 0h36M24 0v10M32 0v8" stroke="#c9a227" stroke-width="6" stroke-linecap="round"/>',
  tub: '<path d="M-26 -14h52l-6 40h-40z" fill="#8a5cf6" fill-opacity=".8" stroke="#5b3cc4" stroke-width="3"/><rect x="-30" y="-22" width="60" height="10" rx="3" fill="#5b3cc4"/>',
  can: '<rect x="-18" y="-28" width="36" height="56" rx="4" fill="#c5cad6" stroke="#5b6180" stroke-width="3"/><rect x="-18" y="-12" width="36" height="22" fill="#19c39a"/><ellipse cx="0" cy="-28" rx="18" ry="4" fill="#9aa1b5"/>',
  sock: '<path d="M-10 -32h20v34l14 10q8 8 0 16h-26q-12 0 -10 -12z" fill="#ffd23f" stroke="#c27c00" stroke-width="3" stroke-linejoin="round"/><path d="M-10 -24h20M-10 -18h20" stroke="#c27c00" stroke-width="2.5"/>'
};
function icon(name, x, y, s){ return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' + ICON[name] + '</g>'; }

/* object versus material */
var OBJ =
  '<svg viewBox="0 0 520 200" role="img" aria-label="Five objects and what they are made of: a chair made of wood, a window made of glass, a bottle made of plastic, a spoon made of metal, a jumper made of fabric">' +
  '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  [["chair", "Chair", "wood", "#8a5a2b"], ["window", "Window", "glass", "#3a8fd6"], ["bottle", "Bottle", "plastic", "#5b3cc4"], ["spoon", "Spoon", "metal", "#5b6180"], ["jumper", "Jumper", "fabric", "#c2185b"]].map(function(o, k){
    var x = 58 + k * 101;
    return icon(o[0], x, 74) + T(x, 140, o[1], 15, ' text-anchor="middle" font-weight="700"') + T(x, 164, o[2], 15, ' text-anchor="middle" font-weight="700" fill="' + o[3] + '"');
  }).join("") +
  T(16, 192, "Object: the thing.", 13, ' fill="#5b6180"') + T(200, 192, "Material: what it is made of.", 13, ' fill="#5b6180"') +
  A.egg(A.bonnie(505, 178, 0.38, "sit"), "Bonnie is made of poodle. Soft, bendy, a bit absorbent, not magnetic, and no tail.") +
  '</svg>';

/* the kitchen counting picture */
var KITCHEN =
  '<svg viewBox="0 0 520 220" role="img" aria-label="Eight kitchen things on a shelf: a fork, a wooden spoon, a pan, a glass jar, a key, a plastic tub, a tin can and a wool sock">' +
  '<rect width="520" height="220" rx="16" fill="#eef6ff"/>' +
  '<path d="M10 92h500M10 196h500" stroke="#8a5a2b" stroke-width="6" stroke-linecap="round"/>' +
  [["fork", "fork"], ["wspoon", "wooden spoon"], ["pan", "pan"], ["jar", "glass jar"]].map(function(o, k){ var x = 70 + k * 126; return icon(o[0], x, 50, 0.9) + T(x, 112, o[1], 13, ' text-anchor="middle"'); }).join("") +
  [["key", "key"], ["tub", "plastic tub"], ["can", "tin can"], ["sock", "wool sock"]].map(function(o, k){ var x = 70 + k * 126; return icon(o[0], x, 154, 0.9) + T(x, 214, o[1], 13, ' text-anchor="middle"'); }).join("") +
  '</svg>';

/* properties: pairs of opposites */
function tile(x, y, w, title, a, b, art){ return '<g transform="translate(' + x + ' ' + y + ')"><rect width="' + w + '" height="86" rx="12" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' + art + T(10, 22, title, 14, ' font-weight="700"') + T(10, 76, a + " / " + b, 13, ' fill="#5b6180"') + '</g>'; }
var PROPS =
  '<svg viewBox="0 0 520 210" role="img" aria-label="Four kinds of property: hard or soft, bendy or stiff, see through or not, waterproof or soaks up water">' +
  '<rect width="520" height="210" rx="16" fill="#f3efff"/>' +
  tile(16, 16, 236, "Hard or soft?", "rock", "cushion", '<circle cx="54" cy="44" r="14" fill="#8a93b8"/><rect x="100" y="34" width="44" height="22" rx="10" fill="#ff8fb1"/>') +
  tile(268, 16, 236, "Bendy or stiff?", "rubber", "brick", '<path d="M44 52q20 -26 40 0" stroke="#141a33" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="120" y="34" width="44" height="20" fill="#c2553a"/>') +
  tile(16, 112, 236, "See through or not?", "glass", "wood", '<rect x="40" y="30" width="34" height="28" fill="#bfe9ff" stroke="#3a8fd6" stroke-width="2"/><rect x="112" y="30" width="34" height="28" fill="#b07a43"/>') +
  tile(268, 112, 236, "Waterproof or soaks it up?", "plastic", "towel", '<path d="M60 30q8 12 0 20q-8 -8 0 -20z" fill="#3a8fd6"/><rect x="44" y="52" width="34" height="6" fill="#5b3cc4"/><rect x="120" y="40" width="40" height="18" rx="4" fill="#19c39a"/>') +
  '</svg>';

/* the chocolate teapot */
var TEAPOT =
  '<svg viewBox="0 0 520 200" role="img" aria-label="A chocolate teapot melting. Right shape, wrong material. Jay looks doubtful.">' +
  '<rect width="520" height="200" rx="16" fill="#fff4ea"/>' +
  '<ellipse cx="150" cy="110" rx="70" ry="52" fill="#6b3f1f"/><path d="M80 100q-40 -6 -44 -40" stroke="#6b3f1f" stroke-width="12" fill="none" stroke-linecap="round"/>' +
  '<path d="M218 92q34 4 30 40" stroke="#6b3f1f" stroke-width="12" fill="none" stroke-linecap="round"/><ellipse cx="150" cy="60" rx="34" ry="10" fill="#7a4c2c"/><circle cx="150" cy="48" r="8" fill="#7a4c2c"/>' +
  '<path d="M100 150q4 22 0 30M140 160q4 18 0 26M184 152q4 16 0 22" stroke="#6b3f1f" stroke-width="9" stroke-linecap="round"/>' +
  '<path d="M110 40q-6 -14 4 -24M150 30q-6 -14 4 -24M190 40q-6 -14 4 -24" stroke="#9aa1b5" stroke-width="3" fill="none"/>' +
  T(266, 92, "Right shape,", 17, ' font-weight="700"') + T(266, 116, "wrong material.", 17, ' font-weight="700" fill="#c2185b"') +
  A.jay(460, 110, 0.75, "hmm") +
  '</svg>';

/* where materials come from */
function arrowRow(y, raw, mat, rawArt){ return rawArt + T(110, y + 6, raw, 15, ' font-weight="700"') + '<path d="M200 ' + y + 'h56M246 ' + (y - 8) + 'l12 8 -12 8" stroke="#141a33" stroke-width="3" fill="none"/>' + T(270, y + 6, mat, 15, ' font-weight="700" fill="#0f7d5e"'); }
var EARTH =
  '<svg viewBox="0 0 520 240" role="img" aria-label="Where materials come from: trees to wood and paper, sand to glass, oil to plastic, rock called ore to metal">' +
  '<rect width="520" height="240" rx="16" fill="#eef8f3"/>' +
  arrowRow(36, "Trees", "wood, paper", '<path d="M62 50v-14" stroke="#8a5a2b" stroke-width="6"/><circle cx="62" cy="26" r="16" fill="#19c39a"/>') +
  arrowRow(90, "Sand", "glass", '<path d="M40 102q22 -26 44 0z" fill="#e8c77a"/>') +
  arrowRow(144, "Oil", "plastic", '<path d="M62 128q14 18 0 28q-14 -10 0 -28z" fill="#141a33"/>') +
  arrowRow(198, "Rock (ore)", "metal", '<path d="M40 210l10 -22 24 -6 14 18 -10 12z" fill="#8a93b8"/><circle cx="62" cy="200" r="3" fill="#c9a227"/>') +
  '<rect x="396" y="20" width="114" height="56" rx="10" fill="#ffffff" stroke="#19c39a" stroke-width="2"/>' + T(406, 44, "Natural:", 13, ' font-weight="700"') + T(406, 64, "used as found", 13) +
  '<rect x="396" y="90" width="114" height="56" rx="10" fill="#ffffff" stroke="#8a5cf6" stroke-width="2"/>' + T(406, 114, "Made by people:", 13, ' font-weight="700"') + T(406, 134, "changed first", 13) +
  A.egg(A.bird(462, 196, 0.8, "#8a5a2b"), "Birds build nests from natural materials: twigs, moss, mud and the odd bit of fluff. Jay has strong opinions about the best nests.") +
  '</svg>';

function esc(t){ return String(t == null ? "" : t).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function wrap(t, n, max){ var w = String(t == null ? "" : t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if(!x) return; while(x.length > n){ if(cur){ out.push(cur); cur = ""; } out.push(x.slice(0, n)); x = x.slice(n); } if((cur + " " + x).trim().length > n){ out.push(cur.trim()); cur = x; } else cur = (cur + " " + x).trim(); }); if(cur) out.push(cur); return out.slice(0, max || 2); }

(window.A2PACKS = window.A2PACKS || {})["what-is-it-made-of"] = {
  a2: true,
  id: "a2-what-is-it-made-of",
  title: "What is it made of?",
  subject: "Science",
  bodyClass: "subj-home subj-pillar",
  mins: 25,
  line: "Everything around you is made of materials. What they are like decides what they are good for.",
  blurb: "Objects and the materials they are made of, what materials are like, and where they come from. Four short chunks, then a material hunt challenge card to take away from the screen.",
  note: "Materials: what things are made of, what they are like, and where they come from, ready for a material hunt away from the screen. Four five minute chunks. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Cardboard", line: "Cardboard: everyday objects and the materials they are made of." },
    { id: "medium", name: "Steel", line: "Steel: properties, and why a material gets picked for a job." },
    { id: "spicy", name: "Diamond", line: "Diamond: the scientist's words, conductors and insulators, and what will run out." }
  ],
  themes: {
    time: { name: "Time travel", w: { place: "the time machine", metal: "the time machine door", fabric: "the time traveller's cloak", wood: "the old ship's wheel", glass: "the porthole window", plastic: "the control buttons" } },
    football: { name: "Football", w: { place: "the stadium", metal: "the goalposts", fabric: "the team shirt", wood: "the dugout bench", glass: "the trophy cabinet door", plastic: "the shin pads" } },
    horror: { name: "Horror", w: { place: "the haunted house", metal: "the iron gate", fabric: "the old curtains", wood: "the creaky floorboards", glass: "the dusty window", plastic: "the torch case" } },
    fishing: { name: "Fishing", w: { place: "the lake", metal: "the hook", fabric: "the woolly hat", wood: "the jetty", glass: "the fish tank", plastic: "the float" } },
    music: { name: "Music", w: { place: "the theatre", metal: "the microphone stand", fabric: "the stage curtain", wood: "the guitar body", glass: "the stage light lens", plastic: "the guitar pick" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: OBJ,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Objects and materials", title: "The thing, and what it is made of",
      fig: OBJ,
      html: "<p>An <b>object</b> is a thing: a chair, a window, a bottle.</p>" +
        "<p>A <b>material</b> is what the object is made of: wood, glass, plastic, metal, fabric, rock, rubber, paper.</p>" +
        "<p>Look around [[place]]. Everything there is made of at least one material.</p>",
      ez: { title: "Thing and stuff", html: "<p>An <b>object</b> is a thing, like a chair.</p><p>A <b>material</b> is what it is made of: wood.</p>" },
      lv: {
        mild: { html: "<p>An <b>object</b> is a thing, like a chair.</p><p>A <b>material</b> is what it is made of, like wood.</p>" },
        spicy: { html: "<p>An <b>object</b> is a thing. A <b>material</b> is the stuff it is made from.</p>" +
          "<p>Most objects are made of <b>several</b> materials, each doing a different job. A bike has a steel or aluminium frame, rubber tyres, a plastic seat and maybe a fabric bag.</p>" +
          "<p>Scientists group materials by what they are like (their <b>properties</b>) and where they come from. That is where we are heading.</p>" } } },

    { type: "match", topic: "Objects and materials",
      q: "Match each thing to the material it is made of.",
      pairs: [["[[Metal]]", "Metal"], ["[[Fabric]]", "Fabric"], ["[[Wood]]", "Wood"], ["[[Glass]]", "Glass"]],
      hint: "Picture it. What would it feel like to touch?",
      why: "Each object is made of the material that suits its job.",
      ez: { q: "Match each thing to its material.", hint: "What would it feel like?", why: "Each thing is made of a material that suits it." },
      lv: {
        mild: { pairs: [["[[Metal]]", "Metal"], ["[[Fabric]]", "Fabric"], ["[[Wood]]", "Wood"]] },
        spicy: { pairs: [["[[Metal]]", "Metal"], ["[[Fabric]]", "Fabric"], ["[[Wood]]", "Wood"], ["[[Glass]]", "Glass"], ["[[Plastic]]", "Plastic"]] } } },

    { type: "mc", topic: "Objects and materials",
      q: "Which one is a <b>material</b>, not an object?",
      options: ["Glass", "A window", "A bottle", "A mirror"],
      answer: 0,
      slips: { 1: "A window is an object. It is made of a material: glass.", 2: "A bottle is an object. It could be made of glass or plastic.", 3: "A mirror is an object. It is made of glass with a shiny coat on the back." },
      hint: "Which one could be used to make the others?",
      why: "Glass is a material. Windows, bottles and mirrors are objects made from it.",
      ez: { hint: "What are the other 2 made of?", why: "<b>Wood</b> is a material. Chairs are made of it.", slips: { 1: "A chair is a thing. It is made of wood.", 2: "A table is a thing. It is made of wood." } },
      lv: {
        mild: { q: "Which one is a material?", options: ["Wood", "A chair", "A table"],
          slips: { 1: "A chair is an object. It can be made of wood.", 2: "A table is an object. It can be made of wood." },
          hint: "Which one are the other two made of?", why: "Wood is a material. Chairs and tables are made of it." },
        spicy: { q: "A bike is one object. Which list names only <b>materials</b>?",
          options: ["Steel, rubber, plastic", "Frame, tyres, seat", "Bike, helmet, lock"],
          slips: { 1: "Frame, tyres and seat are parts: smaller objects. What are they made of?", 2: "Those are all objects." },
          hint: "Look for the list of stuff, not things.", why: "Steel, rubber and plastic are materials. The frame, tyres and seat are parts made from them." } } },

    { type: "sort", topic: "Objects and materials",
      q: "Sort these objects by the material they are usually made of.",
      buckets: ["Metal", "Wood", "Fabric"],
      cards: [["a door key", 0], ["a pencil", 1], ["a sock", 2], ["a coin", 0], ["a cricket bat", 1], ["a pillowcase", 2]],
      hint: "Think about what each one feels like in your hand.",
      why: "Keys and coins are metal, pencils and cricket bats are wood, socks and pillowcases are fabric.",
      ez: { q: "What is each one made of? Sort them.", hint: "How does it feel in your hand?", why: "Key and coin: metal. Pencil: wood. Sock: fabric." },
      lv: {
        mild: { cards: [["a door key", 0], ["a pencil", 1], ["a sock", 2], ["a coin", 0]] },
        spicy: { buckets: ["Metal", "Wood", "Fabric", "Glass"],
          cards: [["a door key", 0], ["a pencil", 1], ["a sock", 2], ["a paperclip", 0], ["a cricket bat", 1], ["a pillowcase", 2], ["a jam jar", 3], ["a window pane", 3]] } } },

    { type: "num", topic: "Objects and materials",
      q: "Look at the shelves. How many of the things are made of <b>metal</b>?",
      ez: { q: "Look at the shelves. How many things are <b>metal</b>?", hint: "Metal is often shiny. Check both shelves.", why: "Fork, pan, key, tin can: <b>4</b>.", slips: [[null, "Close! The tin and the key are metal too."], [null, "1 too many. The spoon is wood."], [null, "Look along both shelves again."]] },
      fig: KITCHEN,
      boxes: [{ label: "Metal things", a: 4 }],
      slips: [[3, "Close. Look again: the tin can and the key are metal too."], [5, "One too many. The wooden spoon is wood, not metal."], [2, "Look again along both shelves."]],
      hint: "Metal things are often grey or shiny. Check both shelves.",
      why: "The fork, the pan, the key and the tin can: <b>4</b> metal things." },

    { type: "text", topic: "Objects and materials",
      q: "In your own words: what is everything around [[place]] made of?",
      need: [["material", "materials", "made of", "made from", "stuff"]],
      slips: [[["wood", "metal", "plastic", "glass"], "Good examples. Now say what they all are: materials."]],
      model: "Everything is made of materials, like wood, metal or plastic.",
      hint: "The word starts with m.",
      why: "Everything is made of materials. Saying it in your own words, with an example or two, is exactly the idea.",
      ez: { q: "What is everything around [[place]] made of?", hint: "The word starts with m.", why: "Everything is made of <b>materials</b>.", slips: [[null, "Good examples! What are they all called?"]] },
      lv: { spicy: { q: "In your own words: what is everything around [[place]] made of? Give two examples of objects and their materials.",
        model: "Everything is made of materials: a chair is made of wood, and a window is made of glass." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "What is it like?", title: "Properties: what a material is like",
      fig: PROPS,
      html: "<p>A <b>property</b> is what a material is like. Properties often come in opposite pairs:</p>" +
        "<p><b>hard</b> or <b>soft</b>, <b>bendy</b> or <b>stiff</b>, <b>see through</b> or not, <b>waterproof</b> or <b>soaks up water</b>, <b>magnetic</b> or not.</p>" +
        "<p>Scientists find properties by testing: drip water on it, hold a magnet near it, try to bend it.</p>",
      ez: { title: "Properties", html: "<p>A <b>property</b> is what a material is like.</p><p>Hard or soft? Bendy or stiff? See through?</p>" },
      lv: {
        mild: { html: "<p>A <b>property</b> is what a material is like.</p><p>Is it <b>hard</b> or <b>soft</b>? <b>Bendy</b> or <b>stiff</b>? Can you <b>see through</b> it? Does water <b>soak in</b> or <b>run off</b>?</p>" },
        spicy: { html: "<p>A <b>property</b> is what a material is like. Scientists use exact words:</p>" +
          "<p><b>transparent</b> (see through) or <b>opaque</b>; <b>flexible</b> or <b>rigid</b>; <b>absorbent</b> or <b>waterproof</b>; <b>magnetic</b>; <b>brittle</b> (snaps or shatters); <b>durable</b> (lasts a long time).</p>" +
          "<p>A <b>conductor</b> lets heat or electricity pass through it, like metal. An <b>insulator</b> does not, like plastic, wood or rubber.</p>" } } },

    { type: "mc", topic: "What is it like?",
      q: "Why is [[glass]] made of glass?",
      options: ["You can see through it", "It is soft and bendy", "It soaks up water"],
      answer: 0,
      slips: { 1: "Glass is hard and stiff. That is not why it is used here.", 2: "Glass is waterproof: water runs straight off." },
      hint: "What do you do with a window?",
      why: "Glass is see through, so light gets in and you can see through it.",
      ez: { q: "Why is [[glass]] made of glass?", hint: "What do you do with a window?", why: "You can <b>see through</b> glass.", slips: { 1: "Glass is hard and stiff.", 2: "Water runs off glass." } },
      lv: { spicy: { q: "Which word means you can see clearly through a material?",
        options: ["Transparent", "Opaque", "Absorbent", "Flexible"],
        slips: { 1: "Opaque is the opposite: light cannot get through.", 2: "Absorbent means it soaks up liquid.", 3: "Flexible means it bends." },
        hint: "Trans means across or through.", why: "Transparent materials let light straight through, like glass or clear plastic." } } },

    { type: "widget", topic: "What is it like?", unscored: true,
      title: "Test lab",
      html: "<p>Pick a material, then pick a test, and see what happens. Try a few. Your results fill in the table.</p>",
      ez: { html: "<p>Pick a material. Pick a test. See what happens!</p>" },
      mount: function(el, api){
        var d = api.data;
        if(!d.res || typeof d.res !== "object") d.res = {};
        var MATS = {
          wood: { name: "Wood", col: "#b07a43", r: { magnet: ["no", "No pull at all."], water: ["soaks slowly", "Soaks in slowly. Wood is a bit absorbent, which is why fences get painted."], bend: ["stiff", "Stiff. A thick piece will not bend by hand."], light: ["opaque", "No light gets through."], elec: ["no", "No. Dry wood is an insulator."] } },
          steel: { name: "Steel", col: "#9aa1b5", r: { magnet: ["sticks", "It sticks! Steel has iron in it, so it is magnetic."], water: ["runs off", "Water runs straight off. Waterproof."], bend: ["stiff", "Stiff. A steel bar will not bend by hand."], light: ["opaque", "No light gets through."], elec: ["conducts", "The bulb lights up. Metals conduct electricity."] } },
          glass: { name: "Glass", col: "#bfe9ff", r: { magnet: ["no", "No pull."], water: ["runs off", "Water runs off. Waterproof."], bend: ["snaps", "Stiff and brittle: it would crack or shatter rather than bend. Best not try that at home."], light: ["see through", "Light goes straight through. Transparent."], elec: ["no", "No. Glass is an insulator."] } },
          wool: { name: "Wool", col: "#ffd23f", r: { magnet: ["no", "No pull."], water: ["soaks", "It soaks the water up. Absorbent."], bend: ["bends", "Floppy and bendy. Flexible."], light: ["a little", "A little light sneaks through the gaps, but you cannot see through it."], elec: ["no", "No. Wool is an insulator."] } },
          plastic: { name: "Clear plastic", col: "#d6f1ff", r: { magnet: ["no", "No pull."], water: ["runs off", "Water runs off. Waterproof."], bend: ["bends", "It bends, then springs back. Flexible."], light: ["see through", "Clear plastic lets light through. Transparent."], elec: ["no", "No. Plastic is an insulator, which is why it covers wires."] } },
          alu: { name: "Aluminium foil", col: "#dfe3ec", r: { magnet: ["no", "No pull! Surprise: not every metal is magnetic. Aluminium is not."], water: ["runs off", "Water runs off. Waterproof."], bend: ["bends", "Thin foil bends and crumples easily."], light: ["opaque", "No light gets through."], elec: ["conducts", "The bulb lights up. Aluminium is a metal, and metals conduct."] } }
        };
        var TESTS = { magnet: "Magnet", water: "Water drop", bend: "Bend it", light: "Hold to the light", elec: "Bulb circuit" };
        var lv = api.level || "medium";
        var mats = lv === "mild" ? ["wood", "steel", "glass", "wool"] : lv === "spicy" ? ["wood", "steel", "glass", "wool", "plastic", "alu"] : ["wood", "steel", "glass", "wool", "plastic"];
        var tests = lv === "spicy" ? ["magnet", "water", "bend", "light", "elec"] : ["magnet", "water", "bend", "light"];
        var cur = d.m && mats.indexOf(d.m) >= 0 ? d.m : mats[0];
        function btns(list, key, names){ return list.map(function(k){ return '<button type="button" class="btn btn-quiet" data-' + key + '="' + k + '" style="margin:3px">' + names(k) + '</button>'; }).join(""); }
        el.innerHTML = '<p class="tiny" style="margin:.2em 0">1. Pick a material</p><div class="tl-m">' + btns(mats, "m", function(k){ return MATS[k].name; }) + '</div>' +
          '<p class="tiny" style="margin:.6em 0 .2em">2. Pick a test</p><div class="tl-t">' + btns(tests, "t", function(k){ return TESTS[k]; }) + '</div>' +
          '<svg viewBox="0 0 520 110" style="width:100%;max-width:560px;display:block;margin:10px auto 0" role="img" aria-label="The test result"></svg>' +
          '<p class="tl-msg" aria-live="polite" style="font-weight:700;min-height:1.4em;margin:.4em 0"></p>' +
          '<div style="overflow-x:auto"><table class="tl-tab" style="border-collapse:collapse;font-size:.9em;min-width:100%"></table></div>';
        var svg = el.querySelector("svg"), msg = el.querySelector(".tl-msg"), tab = el.querySelector(".tl-tab");
        function testArt(t){
          if(t === "magnet") return '<path d="M330 30v30a26 26 0 0 0 52 0v-30" stroke="#e04848" stroke-width="14" fill="none"/><path d="M330 30h0M382 30h0" stroke="#9aa1b5" stroke-width="14"/>';
          if(t === "water") return '<path d="M356 22q20 28 0 44q-20 -16 0 -44z" fill="#3a8fd6"/>';
          if(t === "bend") return '<path d="M320 70q36 -50 72 0" stroke="#141a33" stroke-width="5" fill="none"/><path d="M384 58l8 12 -14 2" stroke="#141a33" stroke-width="5" fill="none"/>';
          if(t === "light") return '<circle cx="356" cy="50" r="16" fill="#ffd23f"/><path d="M356 20v-8M356 80v8M326 50h-8M386 50h8M335 29l-6 -6M377 29l6 -6M335 71l-6 6M377 71l6 6" stroke="#f2a516" stroke-width="4" stroke-linecap="round"/>';
          return '<circle cx="356" cy="46" r="16" fill="#fff6bf" stroke="#141a33" stroke-width="3"/><rect x="348" y="62" width="16" height="12" fill="#9aa1b5"/><path d="M320 90h72" stroke="#141a33" stroke-width="3"/>';
        }
        function draw(t){
          var m = MATS[cur];
          var s = '<rect width="520" height="110" rx="14" fill="#f3efff"/>' +
            '<rect x="24" y="22" width="160" height="66" rx="10" fill="' + m.col + '" stroke="#141a33" stroke-width="2.5"/>' +
            '<text x="104" y="61" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="15" font-weight="700" fill="#141a33">' + m.name + '</text>';
          if(t){ s += '<path d="M204 55h70M264 47l12 8 -12 8" stroke="#141a33" stroke-width="3" fill="none"/>' + testArt(t) +
            '<text x="420" y="62" font-family="Verdana,Arial,sans-serif" font-size="15" font-weight="700" fill="#5b3cc4">' + m.r[t][0] + '</text>'; }
          svg.innerHTML = s;
        }
        function table(){
          var h = '<tr><th style="text-align:left;padding:4px 6px;border-bottom:2px solid #d7dbea"></th>' + tests.map(function(t){ return '<th style="text-align:left;padding:4px 6px;border-bottom:2px solid #d7dbea">' + TESTS[t] + '</th>'; }).join("") + '</tr>';
          mats.forEach(function(k){
            h += '<tr><th style="text-align:left;padding:4px 6px;border-bottom:1px solid #eceef5">' + MATS[k].name + '</th>' + tests.map(function(t){ return '<td style="padding:4px 6px;border-bottom:1px solid #eceef5">' + (d.res[k + "|" + t] ? MATS[k].r[t][0] : "") + '</td>'; }).join("") + '</tr>';
          });
          tab.innerHTML = h;
        }
        function mark(){
          Array.prototype.forEach.call(el.querySelectorAll("[data-m]"), function(b){ b.setAttribute("aria-pressed", b.getAttribute("data-m") === cur ? "true" : "false"); b.style.outline = b.getAttribute("data-m") === cur ? "3px solid #8a5cf6" : ""; });
        }
        el.addEventListener("click", function(ev){
          var b = ev.target.closest("button"); if(!b || !el.contains(b)) return;
          if(b.hasAttribute("data-m")){ cur = b.getAttribute("data-m"); d.m = cur; api.save(); mark(); draw(null); msg.textContent = MATS[cur].name + " is ready. Pick a test."; return; }
          var t = b.getAttribute("data-t"); if(!t) return;
          d.res[cur + "|" + t] = 1; api.save();
          draw(t); msg.textContent = MATS[cur].name + ", " + TESTS[t].toLowerCase() + ": " + MATS[cur].r[t][1];
          table();
          if(Object.keys(d.res).length >= 3) api.done("done");
        });
        mark(); draw(null); table();
        msg.textContent = Object.keys(d.res).length ? "Your results so far are in the table. Test away." : "";
      },
      report: function(d){ return "Test lab: " + Object.keys((d && d.res) || {}).length + " tests run."; } },

    { type: "sort", topic: "What is it like?",
      q: "Sort them. Does water run off, or soak in?",
      buckets: ["Waterproof", "Soaks up water"],
      cards: [["a rubber boot", 0], ["a towel", 1], ["a plastic bag", 0], ["a sponge", 1], ["a glass bottle", 0], ["kitchen roll", 1]],
      hint: "Which ones would you use to dry something?",
      why: "Rubber, plastic and glass are waterproof. Towels, sponges and kitchen roll are absorbent: that is their whole job.",
      ez: { q: "Does water run off, or soak in?", hint: "Which would dry you?", why: "Boots and bags are waterproof. Towels soak it up." },
      lv: {
        mild: { cards: [["a rubber boot", 0], ["a towel", 1], ["a plastic bag", 0], ["a sponge", 1]] },
        spicy: { q: "Sort them. Conductor of electricity, or insulator?",
          buckets: ["Conductor", "Insulator"],
          cards: [["copper wire", 0], ["plastic cable cover", 1], ["a steel spoon", 0], ["a wooden spoon", 1], ["aluminium foil", 0], ["a rubber glove", 1]],
          hint: "Metals conduct. Most other materials insulate.",
          why: "Copper, steel and aluminium are metals: conductors. Plastic, wood and rubber are insulators, which is why cables are wrapped in plastic." } } },

    { type: "match", topic: "What is it like?",
      q: "Match each property to the test that would show it.",
      pairs: [["See through", "Hold it up to the light"], ["Waterproof", "Drip water on it"], ["Bendy", "Try to bend it gently"], ["Magnetic", "Hold a magnet near it"]],
      hint: "What would you actually do to find out?",
      why: "Every property has a test. That is how scientists know.",
      ez: { q: "Match each property to its test.", hint: "What would you do to find out?", why: "Every property has a test." },
      lv: {
        mild: { pairs: [["See through", "Hold it up to the light"], ["Waterproof", "Drip water on it"], ["Bendy", "Try to bend it gently"]] },
        spicy: { pairs: [["Transparent", "Hold it up to the light"], ["Absorbent", "Drip water on it"], ["Flexible", "Try to bend it gently"], ["Magnetic", "Hold a magnet near it"], ["Conductor", "Put it in a circuit with a bulb"]] } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Right material for the job", title: "Right material for the job",
      fig: TEAPOT,
      html: "<p>Objects are made from materials with the <b>right properties for the job</b>.</p>" +
        "<p>Wellies are rubber: waterproof and bendy. Windows are glass: see through and waterproof. A teapot made of chocolate would be the right shape, but it would melt the moment you poured the tea in.</p>",
      ez: { title: "Right for the job", html: "<p>Pick the material that does the <b>job</b>.</p><p>A chocolate teapot would melt!</p>" },
      lv: {
        mild: { html: "<p>We pick the material that does the job.</p><p>Wellies are rubber, so your feet stay dry.<br>A chocolate teapot would melt!</p>" },
        spicy: { html: "<p>Designers choose a material for its <b>properties</b>, but they also weigh up <b>cost</b>, <b>weight</b>, how <b>durable</b> it is, and whether it can be <b>recycled</b>.</p>" +
          "<p>There is often a trade off. Steel is strong but heavy. Aluminium is lighter but costs more. Plastic is cheap and waterproof, but much of it is hard to recycle.</p>" +
          "<p>A chocolate teapot fails the simplest test: the properties do not fit the job at all.</p>" } } },

    { type: "mc", topic: "Right material for the job",
      q: "Why are wellies made of rubber?",
      options: ["Rubber is waterproof and bendy", "Rubber is see through", "Rubber is magnetic"],
      answer: 0,
      slips: { 1: "Wellies are not see through. Think about puddles.", 2: "Rubber is not magnetic, and wellies do not need to be." },
      hint: "What do wellies have to keep out?",
      why: "Rubber keeps water out and bends when you walk.",
      ez: { hint: "What do wellies keep out?", why: "Rubber keeps water out and <b>bends</b>.", slips: { 1: "Wellies are not see through. Think puddles.", 2: "Wellies do not need to be magnetic." } },
      lv: { spicy: { q: "Why are aeroplane bodies usually made of aluminium rather than steel?",
        options: ["It is strong but much lighter", "It is magnetic", "It is transparent"],
        slips: { 1: "Aluminium is not magnetic, and that would not help a plane fly.", 2: "Aluminium is opaque. The windows are the see through bits." },
        hint: "What does a plane need to be, to get off the ground?",
        why: "Aluminium is strong and light, so the plane uses less fuel. Weight matters as much as strength here." } } },

    { type: "mc", topic: "Right material for the job",
      q: "Which would make a <b>terrible</b> umbrella?",
      options: ["Paper", "Plastic", "Waterproof nylon fabric"],
      answer: 0,
      slips: { 1: "Plastic is waterproof, so it would keep you dry.", 2: "Waterproof fabric is what most umbrellas are made of." },
      hint: "Which one soaks up water and goes soggy?",
      why: "Paper soaks up water and falls apart. The umbrella would be soggy in seconds.",
      ez: { q: "Which would make a <b>terrible</b> umbrella?", hint: "Which one goes soggy?", why: "<b>Paper</b> soaks up water and falls apart.", slips: { 1: "Plastic keeps you dry.", 2: "Most umbrellas are made of this." } },
      lv: { spicy: { q: "A designer wants a cup for hot drinks that is comfortable to hold. Which is the <b>worst</b> choice?",
        options: ["Thin steel, because it conducts heat to your hand", "Ceramic, because it is a poor conductor of heat", "Thick card with a sleeve, because it insulates"],
        slips: { 1: "Ceramic mugs work well: heat moves through them slowly.", 2: "Card with a sleeve is how takeaway cups keep your hand cool." },
        hint: "Which material lets heat travel through it fast?",
        why: "Steel is a good conductor, so the heat would reach your hand quickly. Ouch." } } },

    { type: "text", topic: "Right material for the job", explain: true,
      q: "A frying pan has a metal base but a plastic or wooden handle. Why is the handle not metal?",
      need: [["hot", "heat", "burn", "warm", "insulat", "conduct"]],
      slips: [[["look", "colour", "pretty", "nice", "cheap"], "Think about what happens to the pan when it is on the cooker."]],
      model: "Metal gets hot, so a plastic or wooden handle stops you burning your hand.",
      hint: "What happens to metal on a hot cooker?",
      why: "Metal conducts heat, so a metal handle would get hot. Plastic and wood are insulators, so the handle stays cool enough to hold.",
      ez: { q: "A pan has a plastic handle. Why not metal?", hint: "What happens to metal on a cooker?", why: "Metal gets <b>hot</b>. Plastic stays cool to hold.", slips: [[null, "Think about the pan on the cooker."]] },
      lv: {
        mild: { q: "A frying pan has a metal part and a plastic handle. Why is the handle plastic, not metal?",
          model: "The metal gets hot and the plastic does not, so you do not burn your hand." },
        spicy: { q: "A frying pan has a metal base but a plastic or wooden handle. Explain why, using the words conductor or insulator.",
          need: [["conduct", "insulat"]],
          model: "Metal is a good conductor of heat, so the base heats the food. Plastic and wood are insulators, so the handle stays cool to hold.",
          slips: [[["hot", "heat", "burn"], "Right idea. Now have a go with the science words: conductor or insulator."]] } } },

    { type: "multi", topic: "Right material for the job",
      q: "You need a coat that keeps you dry. Pick the good materials.",
      options: ["Waterproof nylon", "Wool", "Paper", "Rubber coated cotton"],
      answers: [0, 3],
      hint: "Which ones would stop rain getting in?",
      why: "Waterproof nylon and rubber coated cotton keep rain out. Wool is warm, but it soaks up water. Paper goes soggy.",
      ez: { q: "You need a window. Pick <b>all</b> you can see through.", hint: "Which let light in?", why: "Glass and clear plastic are see through." },
      lv: {
        mild: { q: "You need a window. Pick the materials you could see through.", options: ["Glass", "Wood", "Clear plastic", "Brick"], answers: [0, 2],
          hint: "Which ones let light through?", why: "Glass and clear plastic are see through. Wood and brick are not." },
        spicy: { q: "A tent for a wild camping trip. Pick the properties its material needs.",
          options: ["Waterproof", "Lightweight", "Flexible", "Transparent", "Magnetic", "Strong enough to survive wind"], answers: [0, 1, 2, 5],
          hint: "You carry it, fold it, and sleep in it in the rain.",
          why: "It has to keep rain out, be light to carry, fold up, and not tear in the wind. It does not need to be see through or magnetic." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Where materials come from", title: "Every material starts with the Earth",
      fig: EARTH,
      html: "<p>Every material starts as something from the Earth.</p>" +
        "<p><b>Natural</b> materials are used almost as they are found: wood, wool, cotton, stone, clay.</p>" +
        "<p>Other materials are <b>made by people</b>, by changing raw materials: glass from sand, plastic from oil, metal from rock called ore, paper from wood.</p>" +
        "<p>Next up: a material hunt, away from the screen.</p>",
      ez: { title: "From the Earth", html: "<p><b>Natural:</b> wood, wool, stone.</p><p><b>Made by people:</b> glass from sand, plastic from oil.</p>" },
      lv: {
        mild: { html: "<p>Every material comes from the Earth.</p><p><b>Natural</b> ones we use as they are: wood, wool, stone.</p><p>Others are <b>made by people</b>, who change them first: glass is made from sand, plastic from oil.</p>" },
        spicy: { html: "<p>Every material starts as a <b>raw material</b> from the Earth or its atmosphere: glass from sand, plastic from crude oil, metals from ores dug out of rock, paper from trees.</p>" +
          "<p>Some raw materials are <b>renewable</b>: trees, cotton and sheep grow again. Others are <b>finite</b>: oil and metal ores took millions of years to form, and will run out.</p>" +
          "<p>That is why <b>recycling</b> matters. Glass and aluminium can be recycled again and again. Most plastics cannot, and many end up in landfill or the sea.</p>" } } },

    { type: "sort", topic: "Where materials come from",
      q: "Sort them: natural, or made by people?",
      buckets: ["Natural", "Made by people"],
      cards: [["wool", 0], ["plastic", 1], ["wood", 0], ["glass", 1], ["stone", 0], ["paper", 1]],
      hint: "Has it been changed in a factory, or used as it was found?",
      why: "Wool, wood and stone are used as found. Plastic, glass and paper are made by changing a raw material.",
      ez: { q: "Natural, or made by people?", hint: "Made in a factory?", why: "Wool and wood are natural. Plastic and glass are made." },
      lv: {
        mild: { cards: [["wool", 0], ["plastic", 1], ["wood", 0], ["glass", 1]] },
        spicy: { q: "Sort the raw materials: can it grow again, or will it run out?",
          buckets: ["Renewable", "Finite (will run out)"],
          cards: [["trees for wood", 0], ["crude oil for plastic", 1], ["cotton plants", 0], ["copper ore", 1], ["sheep for wool", 0], ["coal", 1]],
          hint: "Living things can grow again. Things dug out of the ground took millions of years.",
          why: "Trees, cotton and sheep can grow again. Oil, ore and coal took millions of years to form, so once used, they are gone." } } },

    { type: "match", topic: "Where materials come from",
      q: "Match each raw material to what it is made into.",
      pairs: [["Sand", "Glass"], ["Oil", "Plastic"], ["Trees", "Paper"], ["Rock (ore)", "Metal"]],
      hint: "Glass is made by melting something you find on a beach.",
      why: "Sand melts into glass, oil becomes plastic, trees become paper, and ore is heated to get metal out.",
      ez: { q: "What is each one made into?", hint: "Glass comes from the beach.", why: "Sand to glass. Oil to plastic. Trees to paper." },
      lv: {
        mild: { pairs: [["Sand", "Glass"], ["Oil", "Plastic"], ["Trees", "Paper"]] },
        spicy: { pairs: [["Sand", "Glass"], ["Crude oil", "Plastic"], ["Trees", "Paper"], ["Iron ore", "Steel"], ["Clay", "Bricks"]] } } },

    { type: "mc", topic: "Where materials come from",
      q: "Which of these is made by people?",
      options: ["Plastic", "Wool", "Stone", "Wood"],
      answer: 0,
      slips: { 1: "Wool comes from sheep. It is spun, but it is a natural material.", 2: "Stone is dug up and used as it is: natural.", 3: "Wood comes from trees: natural." },
      hint: "Which one could never be found lying around in nature?",
      why: "Plastic is made from oil in a factory. The others are natural.",
      ez: { hint: "Where does wool grow?", why: "Wool grows on <b>sheep</b>. It is natural.", slips: { 1: "Wool is spun, but it grows on sheep." } },
      lv: {
        mild: { q: "Is wool natural, or made by people?", options: ["Natural: it comes from sheep", "Made by people in a factory"], fixed: true,
          slips: { 1: "Wool is spun into yarn, but it grows on sheep. Natural." },
          hint: "Where does wool grow?", why: "Wool grows on sheep, so it is natural." },
        spicy: { q: "Which material can be recycled again and again without getting worse?",
          options: ["Glass", "Paper", "Most plastics"],
          slips: { 1: "Paper fibres get shorter each time, so it can only be recycled a handful of times.", 2: "Most plastics get weaker when recycled, and many cannot be recycled at all." },
          hint: "Think about something that is just melted and shaped again.",
          why: "Glass can be melted and remade endlessly without losing quality. Aluminium can too." } } },

    { type: "write", topic: "Where materials come from",
      q: "Get ready for a material hunt away from the screen. Where will you look, and which material do you think you will find the most of? Write as much or as little as you like. It only goes to Jay if you choose.",
      fig: KITCHEN,
      starters: ["I will look in", "I think I will find lots of", "I want to test", "I was surprised that"],
      checklist: ["I said where I will look", "I made a guess about the most common material"],
      minWords: 15,
      ez: { q: "Get ready for a material hunt. Where will you look?" },
      lv: {
        mild: { minWords: 6, starters: ["I will look in", "I think there will be lots of"] },
        spicy: { minWords: 35, checklist: ["I said where I will look", "I made a guess about the most common material", "I said which property I most want to test", "I mentioned natural or made by people"] } } }
  ],

  ez: {
    realWorld: { title: "Ages named after materials", html: "<p>The <b>Stone Age</b>. The <b>Bronze Age</b>. The <b>Iron Age</b>.</p><p>What will they call ours? The Plastic Age?</p>" },
    make: { intro: "Find 5 things. What is each made of?" }
  },

  realWorld: {
    title: "Ages named after materials",
    html: "<p>Engineers, builders, fashion designers and chefs all choose materials every day. So do material scientists, who invent new ones, like fabric that keeps you dry but lets sweat out.</p>" +
      "<p>History is named after materials: the <b>Stone Age</b>, the <b>Bronze Age</b>, the <b>Iron Age</b>. If we could time travel, should we? A trip to the Stone Age would mean no plastic, no glass and no metal at all. And what would people in the future call our age? Maybe the Plastic Age.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A time portal next to a stone axe, a bronze bowl and an iron key">' + A.portal(70, 75, 52) +
      '<path d="M170 110l26 -60 16 6 -14 58z" fill="#8a93b8"/><path d="M200 60l30 40" stroke="#8a5a2b" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M250 80h60q-4 30 -30 30q-26 0 -30 -30z" fill="#c27c00"/>' +
      '<circle cx="350" cy="88" r="10" fill="none" stroke="#5b6180" stroke-width="5"/><path d="M360 88h30M382 88v8" stroke="#5b6180" stroke-width="5"/>' +
      T(166, 136, "Stone", 13, ' font-weight="700"') + T(258, 136, "Bronze", 13, ' font-weight="700"') + T(350, 136, "Iron", 13, ' font-weight="700"') +
      A.bird(390, 30, 0.7, "#ff5d5d") + '</svg>'
  },

  make: {
    title: "Your material hunt card",
    intro: "Take this card on a hunt: find five things, write down what they are made of and one property each. Fill it in by hand, then send Jay a photo if you like.",
    fields: [
      { id: "where", label: "Where I will hunt", ph: "My kitchen", max: 30 },
      { id: "guess", label: "My guess for the most common material", ph: "Plastic", max: 24 },
      { id: "name", label: "Hunter", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      function tx(x, y, t, sz, w, c, a){ return '<text x="' + x + '" y="' + y + '" font-family="Verdana,Arial,sans-serif" font-size="' + sz + '"' + (w ? ' font-weight="700"' : "") + (a ? ' text-anchor="' + a + '"' : "") + ' fill="' + (c || "#141a33") + '">' + t + '</text>'; }
      var where = wrap(v.where, 24, 1)[0] || "", guess = wrap(v.guess, 20, 1)[0] || "";
      var s = '<rect width="600" height="460" rx="22" fill="#19c39a"/>' +
        '<rect x="14" y="14" width="572" height="432" rx="16" fill="#fffdf6"/>' +
        tx(36, 58, "MATERIAL HUNT", 28, 1, "#0f7d5e") +
        '<circle cx="530" cy="50" r="24" fill="none" stroke="#141a33" stroke-width="5"/><path d="M547 67l20 20" stroke="#141a33" stroke-width="7" stroke-linecap="round"/>' +
        tx(36, 92, "Where: " + esc(where), 17, 1) + tx(36, 118, "My guess for the most common: " + esc(guess), 15, 0, "#5b6180");
      var cols = [36, 220, 380], heads = ["Object", "Material", "One property"];
      s += '<rect x="28" y="138" width="544" height="34" rx="6" fill="#ffd23f"/>';
      heads.forEach(function(h, k){ s += tx(cols[k], 161, h, 15, 1); });
      for(var r = 0; r < 5; r++){
        var y = 172 + r * 40;
        s += '<rect x="28" y="' + y + '" width="544" height="40" fill="' + (r % 2 ? "#ffffff" : "#f4f1ea") + '"/>' + tx(36, y + 26, String(r + 1) + ".", 14, 0, "#8a93b8");
      }
      s += '<path d="M212 138v234M372 138v234" stroke="#d7dbea" stroke-width="2"/>' +
        '<rect x="28" y="138" width="544" height="234" rx="6" fill="none" stroke="#141a33" stroke-width="2"/>' +
        tx(36, 400, "Most common material I found: ..............................", 14, 0) +
        tx(36, 430, "Hunter: " + esc(v.name), 14, 0, "#5b6180");
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 460">' + s + '</svg>';
    }
  }
};
})();
