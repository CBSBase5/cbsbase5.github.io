/* Base 5 core target activity: Link it up.
   English. How sentences hold together in a paragraph: pointing words
   (he, she, it, they, this), linking words (and, but, so, because, then)
   and sticking to one idea. Replayable: most questions carry two more
   versions. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
var LVS = ["mild", "medium", "spicy"], START = "mild";
function ext(a, b){ for(var k in b) if(Object.prototype.hasOwnProperty.call(b, k)) a[k] = b[k]; return a; }
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }
function task(h){ return '<div class="a2task">' + h + '</div>'; }

/* Question builder: each version is {fields, medium:{...}, spicy:{...}}. o:[right, others] becomes
   options (the right one moves a place each version) and s:[slip for each other option] becomes
   slips. Version 1 is the base; the rest become vary, each with every level written out. */
function res(v, L, vi){
  var o = {};
  Object.keys(v).forEach(function(k){ if(LVS.indexOf(k) < 0) o[k] = v[k]; });
  if(v[L]) ext(o, v[L]);
  if(o.o){
    var right = o.o[0], rest = o.o.slice(1), t = vi % o.o.length, opts = rest.slice(), sl = {};
    opts.splice(t, 0, right);
    (o.s || []).forEach(function(m, j){ if(m) sl[j < t ? j : j + 1] = m; });
    o.options = opts; o.answer = t; o.slips = sl; delete o.o; delete o.s;
  }
  return o;
}
function Q(type, topic, flags, vers){
  var all = [], R = vers.map(function(v, vi){ var r = {}; LVS.forEach(function(L){ r[L] = res(v, L, vi); all.push(r[L]); }); return r; });
  var keys = {}; all.forEach(function(o){ Object.keys(o).forEach(function(k){ keys[k] = 1; }); });
  all.forEach(function(o){ Object.keys(keys).forEach(function(k){ if(!(k in o)) o[k] = null; }); });
  function others(r){ var lv = {}; LVS.forEach(function(L){ if(L !== START) lv[L] = r[L]; }); return lv; }
  var step = ext(ext({ type: type, topic: topic }, flags || {}), R[0][START]);
  step.lv = others(R[0]);
  if(R.length > 1) step.vary = R.slice(1).map(function(r){ return ext(ext({}, r[START]), { lv: others(r) }); });
  return step;
}

/* ---------- pictures ---------- */
/* one chain link, sideways, with a word in it */
function link(x, y, w, col, word){
  return '<rect x="' + x + '" y="' + (y - 22) + '" width="' + w + '" height="44" rx="22" fill="none" stroke="' + col + '" stroke-width="9"/>' +
    (word ? T(x + w / 2, y + 6, word, 16, { a: "middle", b: 1 }) : "");
}

/* a pointing word, with an arrow back to the thing it means */
var POINT = '<svg viewBox="0 0 520 190" role="img" aria-label="Two sentences: Bonnie found a stick. She carried it home. Arrows show She points back to Bonnie and it points back to the stick">' +
  '<rect width="520" height="190" rx="16" fill="#f4f1ea"/>' +
  '<rect x="20" y="96" width="480" height="70" rx="12" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
  T(40, 140, '<tspan font-weight="700" fill="#c25400">Bonnie</tspan> found a <tspan font-weight="700" fill="#1a7fb0">stick</tspan>. <tspan font-weight="700" fill="#c25400">She</tspan> carried <tspan font-weight="700" fill="#1a7fb0">it</tspan> home.', 22) +
  '<path d="M292 116q-110 -70 -220 -2" fill="none" stroke="#ff8a5c" stroke-width="3.5"/><path d="M68 106l2 14 12 -6z" fill="#ff8a5c"/>' +
  '<path d="M394 116q-80 -54 -160 -2" fill="none" stroke="#22b8e6" stroke-width="3.5"/><path d="M234 106l2 14 12 -6z" fill="#22b8e6"/>' +
  T(190, 40, "points back", 13, { a: "middle", b: 1, c: "#c25400" }) + T(330, 64, "points back", 13, { a: "middle", b: 1, c: "#1a7fb0" }) +
  A.bonnie(470, 54, 0.55, "sit") +
  '</svg>';

/* linking words as links in a chain */
var CHAIN = '<svg viewBox="0 0 540 190" role="img" aria-label="Linking words as links in a chain: and adds, but changes direction, because gives a reason, so shows a result, then shows what came next">' +
  '<rect width="540" height="190" rx="16" fill="#f4f1ea"/>' +
  [["and", "adds more", "#19c39a"], ["but", "changes", "#ff8a5c"], ["because", "a reason", "#8a5cf6"], ["so", "a result", "#22b8e6"], ["then", "what next", "#f2a516"]].map(function(c, k){
    var x = 18 + k * 102;
    return link(x, 74, 96, c[2], c[0]) + T(x + 48, 128, c[1], 13, { a: "middle", b: 1, c: "#3a4060" });
  }).join("") +
  A.egg(A.bird(500, 158, 0.6, "#3a8fd6"), "A bird, holding the chain together. It is stronger than it looks.") +
  T(270, 170, "Each link word joins two ideas, and tells you how they join.", 13, { a: "middle" }) +
  '</svg>';

/* a chain that holds, and one with a link that wanders off */
var ONEIDEA = '<svg viewBox="0 0 520 200" role="img" aria-label="A strong chain where every link is about the same idea, and a broken chain where one link has wandered off">' +
  '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  T(30, 34, "Sticks to one idea", 15, { b: 1, c: "#138a6c" }) +
  [0, 1, 2, 3].map(function(k){ return link(30 + k * 100, 70, 110, "#19c39a"); }).join("") +
  T(30, 134, "One link wanders off", 15, { b: 1, c: "#c23b3b" }) +
  link(30, 168, 110, "#22b8e6") + link(130, 168, 110, "#22b8e6") +
  '<g transform="rotate(-24 300 150)">' + link(260, 150, 110, "#ff8a5c") + '</g>' + link(380, 168, 110, "#22b8e6") +
  T(316, 116, "?", 22, { b: 1, c: "#c23b3b" }) +
  '</svg>';

/* the three steps from choppy to linked */
var STEPS = '<svg viewBox="0 0 540 220" role="img" aria-label="Three steps: choppy sentences, then pointing words swapped in, then linking words added">' +
  '<rect width="540" height="220" rx="16" fill="#f4f1ea"/>' +
  [["Choppy", ["Jay saw a bird.", "Jay liked the bird.", "Jay took a photo."]],
   ["1. Point back", ["Jay saw a bird.", "He liked it.", "He took a photo."]],
   ["2. Link up", ["Jay saw a bird", "and he liked it,", "so he took a photo."]]].map(function(c, k){
    var x = 16 + k * 176;
    return '<rect x="' + x + '" y="40" width="160" height="120" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
      T(x + 80, 28, c[0], 15, { a: "middle", b: 1 }) +
      c[1].map(function(l, j){ return T(x + 10, 76 + j * 28, l.replace(/\b(He|it|and|so)\b/g, '<tspan font-weight="700" fill="#c25400">$1</tspan>'), 13); }).join("") +
      (k < 2 ? '<path d="M' + (x + 160) + ' 100h12" stroke="#141a33" stroke-width="3"/>' : "");
  }).join("") +
  T(270, 196, "3. Check it all sticks to one idea.", 14, { a: "middle", b: 1 }) +
  '</svg>';

(window.A2PACKS = window.A2PACKS || {})["core-link-it-up"] = {
  a2: true,
  id: "a2-core-link-it-up",
  title: "Link it up",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "Pointing words, linking words and sticking to one idea: the things that turn separate sentences into a paragraph.",
  blurb: "How sentences hold hands. Four short chunks: pointing words like she and it, linking words like but and so, sticking to one idea, and linking up a paragraph yourself. A link chain card to make at the end. The questions change each time you come back.",
  note: "Link it up: the little words that join sentences into a paragraph. Four five minute chunks and a link card to make. The questions change every go, so come back whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Paperclip", line: "Paperclip: two sentences at a time, the simplest links." },
    { id: "medium", name: "Bike chain", line: "Bike chain: whole paragraphs, more linking words, and pointing words like this." },
    { id: "spicy", name: "Anchor chain", line: "Anchor chain: formal links, pointing words that could point two ways, and close calls." }
  ],
  themes: {
    time: { name: "Time travel", w: { obj: "the time machine", adj1: "very old", adj2: "covered in rust", fix: "polished it" } },
    football: { name: "Football", w: { obj: "the ball", adj1: "brand new", adj2: "covered in mud", fix: "cleaned it" } },
    horror: { name: "Horror", w: { obj: "the door", adj1: "very heavy", adj2: "creaking loudly", fix: "oiled it" } },
    fishing: { name: "Fishing", w: { obj: "the boat", adj1: "quite small", adj2: "letting in water", fix: "patched it" } },
    music: { name: "Music", w: { obj: "the guitar", adj1: "very old", adj2: "out of tune", fix: "tuned it" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: CHAIN,
  steps: [

    /* ---------- chunk 1: pointing words ---------- */
    { type: "learn", topic: "Pointing words", title: "Pointing words",
      fig: POINT,
      html: "<p>Saying the same name again and again sounds clunky: <b>Bonnie found a stick. Bonnie carried the stick home.</b></p>" +
        "<p>So we use <b>pointing words</b>: <b>he, she, it, they</b>. They point back to someone or something we have already said.</p>" +
        "<p><b>Bonnie found a stick. She carried it home.</b> She points back to Bonnie. It points back to the stick.</p>",
      lv: {
        medium: { html: "<p>Pointing words (<b>pronouns</b>) like <b>he, she, it, they, him, her, them</b> stop us repeating names, and they link one sentence to the one before.</p>" +
          "<p><b>This</b> and <b>that</b> can point back to a whole idea: <b>The bus was late again. This made everyone grumpy.</b> This means the bus being late.</p>" +
          "<p>Say the name first, then point back to it.</p>" },
        spicy: { html: "<p>Pronouns and words like <b>this</b>, <b>these</b> and <b>such</b> build <b>cohesion</b>: each sentence reaches back to the one before.</p>" +
          "<p>The risk is <b>ambiguity</b>. <b>Jay told Alex he had won.</b> Who won? When a pronoun could point two ways, use the name again, or rewrite the sentence.</p>" +
          "<p>A good rule: a pronoun points to the <b>nearest sensible</b> noun. If the nearest one is not what you mean, fix it.</p>" } } },

    Q("mc", "Pointing words", null, [
      { q: "Which pointing word could replace [[obj]] the second time?" + task("[[Obj]] was [[adj1]]. [[Obj]] was [[adj2]]."),
        o: ["It", "They", "She"],
        s: ["They is for more than one. There is only one here.", "She is for a girl or woman."],
        hint: "It is one thing, not a person.",
        why: "<b>[[Obj]] was [[adj1]]. It was [[adj2]].</b> It points back to one thing.",
        medium: { q: "Which pointing word fills the gap?" + task("The birds landed on the feeder. ___ ate all the seed."),
          o: ["They", "It", "He"], s: ["It is for one thing. There are lots of birds.", "He is for one boy or man."],
          why: "<b>They</b> points back to the birds: more than one." },
        spicy: { q: "Which sentence is <b>unclear</b>, because the pointing word could point two ways?",
          o: ["Jay told Alex he had won.", "Jay told Bonnie she was a good dog.", "The birds saw the cat, so they flew away."],
          s: ["She can only be Bonnie here. Jay is a he.", "They can only be the birds: the cat is just one."],
          why: "Jay and Alex could both be he. Who won? Use the name again: <b>Jay told Alex that Alex had won.</b>" } },
      { q: "Which pointing word could replace the second <b>Bonnie</b>?" + task("Bonnie ran to the park. Bonnie found a stick."),
        o: ["She", "It", "They"],
        s: ["It is for a thing. Bonnie is a she.", "They is for more than one."],
        hint: "Bonnie is a girl dog.",
        why: "<b>Bonnie ran to the park. She found a stick.</b>",
        medium: { q: "Which pointing word fills the gap?" + task("Jay lost his keys. He looked everywhere for ___."),
          o: ["them", "it", "him"], s: ["It is for one thing. Keys means more than one.", "Him is for a boy or man."],
          why: "<b>Them</b> points back to the keys." },
        spicy: { q: "Which sentence is <b>unclear</b>, because the pointing word could point two ways?",
          o: ["Bonnie and her friend Daisy played until she was tired.", "Jay fed the birds until they flew off.", "The team lost, but it played well."],
          s: ["They can only be the birds.", "It can only be the team."],
          why: "Who was tired, Bonnie or Daisy? Both are she. Better: <b>until Daisy was tired.</b>" } },
      { q: "Which pointing word could replace <b>Jay and Bonnie</b> the second time?" + task("Jay and Bonnie went out. Jay and Bonnie got wet."),
        o: ["They", "He", "It"],
        s: ["He is just one person. There are two here.", "It is for a thing."],
        hint: "How many are there?",
        why: "<b>Jay and Bonnie went out. They got wet.</b>",
        medium: { q: "Which pointing word fills the gap?" + task("The bus was late again. ___ made everyone grumpy."),
          o: ["This", "They", "She"], s: ["They is for more than one person or thing. Here it is one whole idea.", "She is for a girl or woman."],
          why: "<b>This</b> points back to the whole idea: the bus being late." },
        spicy: { q: "Which sentence is <b>unclear</b>, because the pointing word could point two ways?",
          o: ["The manager phoned the referee because she was angry.", "The manager phoned the referee because the match had been cancelled.", "Jay waved at the birds because he was happy."],
          s: ["No pronoun at all, so nothing can point the wrong way.", "He can only be Jay: the birds would be they."],
          why: "Was the manager angry, or the referee? Both could be she." } }
    ]),

    Q("mc", "Pointing words", { explain: true }, [
      { q: "What does <b>It</b> point back to?" + task("Jay found an old map. It showed a hidden lake."),
        o: ["The map", "Jay", "The lake"],
        s: ["Jay is a he, not an it.", "The lake comes after It, so It cannot be pointing back to it."],
        hint: "Pointing words point back.",
        why: "The map showed a hidden lake. It points back to the map.",
        medium: { q: "What does <b>This</b> point back to?" + task("The bus was late again. This made everyone grumpy."),
          o: ["The bus being late", "The bus", "Everyone"],
          s: ["Close, but the bus itself did not make people grumpy. Its being late did.", "Everyone comes after, and they are the ones who got grumpy."],
          why: "This points back to the whole idea: the bus being late." },
        spicy: { q: "What does <b>These</b> point back to?" + task("Herons, egrets and storks all wade in shallow water. These birds have long legs for a reason."),
          o: ["Herons, egrets and storks", "Long legs", "Shallow water"],
          s: ["Long legs come after These.", "Water is not a bird."],
          why: "<b>These birds</b> points back to all three kinds." } },
      { q: "What does <b>It</b> point back to?" + task("Jay shouted, \"Unhand me, goblin!\" It had grabbed his hat."),
        o: ["The goblin", "Jay", "The hat"],
        s: ["Jay is a he. And his hat is the thing being grabbed.", "The hat cannot grab itself."],
        hint: "Who grabbed the hat?",
        why: "The goblin had grabbed his hat. It points back to the goblin. His points to Jay.",
        medium: { q: "What does <b>That</b> point back to?" + task("Bonnie ate a whole loaf of bread. That was a bad idea."),
          o: ["Bonnie eating the loaf", "The bread", "Bonnie"],
          s: ["The bread was not the bad idea. Eating all of it was.", "Bonnie is not an idea, even if she has a lot of them."],
          why: "That points back to the whole idea: Bonnie eating the loaf." },
        spicy: { q: "What does <b>This</b> point back to?" + task("Robins sing all winter, even in the dark. This helps them keep their patch safe."),
          o: ["Robins singing all winter", "The dark", "Their patch"],
          s: ["The dark does not keep a patch safe.", "The patch is what is being kept safe."],
          why: "This points back to the singing. The singing keeps their patch safe." } },
      { q: "What does <b>They</b> point back to?" + task("The ducks swam over to us. They wanted our bread."),
        o: ["The ducks", "Us", "The bread"],
        s: ["We would be we, not they.", "Bread does not want things."],
        hint: "Who wanted the bread?",
        why: "They points back to the ducks.",
        medium: { q: "What does <b>it</b> point back to?" + task("Jay put the seed in the feeder, then hung it on a branch."),
          o: ["The feeder", "The seed", "The branch"],
          s: ["You cannot hang seed on a branch.", "The branch is where it was hung."],
          why: "He hung the feeder on a branch." },
        spicy: { q: "What does <b>Such</b> point back to?" + task("Some people think time travel would let us fix past mistakes. Such ideas are popular in films."),
          o: ["The idea of fixing past mistakes", "Films", "Some people"],
          s: ["Films come after.", "People are not ideas."],
          why: "Such ideas points back to the idea of fixing past mistakes with time travel." } }
    ]),

    Q("mc", "Pointing words", null, [
      { q: "Which version sounds best?",
        o: ["[[Obj]] was [[adj1]]. It was also [[adj2]].", "[[Obj]] was [[adj1]]. [[Obj]] was [[adj2]].", "It was [[adj1]]. It was [[adj2]]."],
        s: ["The same name twice sounds clunky.", "We never find out what it is. Say the name first."],
        hint: "Say the name once, then point back.",
        why: "Name it first, then point back with It.",
        medium: { o: ["Jay bought a cake. He cut it into eight pieces and gave them out.", "Jay bought a cake. Jay cut the cake into eight pieces and Jay gave the pieces out.", "He bought it. He cut it into eight and gave them out."],
          s: ["Correct, but very clunky: Jay three times, cake twice.", "We never find out who or what."] },
        spicy: { o: ["Jay told Alex that Alex had won the prize.", "Jay told Alex he had won the prize.", "He told him he had won it."],
          s: ["Who won? He could be either of them.", "Nobody is named at all."],
          why: "When a pronoun could point two ways, use the name again." } },
      { q: "Which version sounds best?",
        o: ["Bonnie saw a squirrel. She barked at it.", "Bonnie saw a squirrel. Bonnie barked at the squirrel.", "She saw it. She barked at it."],
        s: ["Correct, but the names are repeated.", "We never find out who or what."],
        hint: "Say the names once, then point back.",
        why: "Names first, then She and it.",
        medium: { o: ["The birds found the feeder. They ate until it was empty.", "The birds found the feeder. The birds ate until the feeder was empty.", "They found it. They ate until it was empty."],
          s: ["Correct, but clunky: everything twice.", "Who found what? No names at all."] },
        spicy: { o: ["Bonnie chased the cat until the cat was tired.", "Bonnie chased the cat until she was tired.", "She chased it until it was tired."],
          s: ["Who was tired? Bonnie and the cat could both be she.", "Nobody is named at all."],
          why: "Repeating the noun is better than leaving the reader guessing." } },
      { q: "Which version sounds best?",
        o: ["The team won. They were so happy.", "The team won. The team were so happy.", "They won. They were so happy."],
        s: ["Correct, but the team twice is clunky.", "We never find out who won."],
        hint: "Say who first, then point back.",
        why: "Say who, then point back with They.",
        medium: { o: ["Our class planted some seeds. We watered them every day.", "Our class planted some seeds. Our class watered the seeds every day.", "We planted them. We watered them every day."],
          s: ["Correct, but clunky.", "Planted what? We never find out."] },
        spicy: { o: ["The manager phoned the referee because the referee was angry.", "The manager phoned the referee because she was angry.", "She phoned her because she was angry."],
          s: ["Who was angry? Both could be she.", "Three shes. Nobody can follow this."],
          why: "Using the noun again removes the guessing." } }
    ]),

    /* ---------- chunk 2: linking words ---------- */
    { type: "learn", topic: "Linking words", title: "Linking words",
      fig: CHAIN,
      html: "<p><b>Linking words</b> join ideas together, like links in a chain. Each one tells you <b>how</b> the ideas join.</p>" +
        "<p><b>and</b> adds more. <b>but</b> changes direction. <b>because</b> gives a reason. <b>so</b> shows a result. <b>then</b> says what came next.</p>" +
        "<p><b>I was cold, so I put a coat on.</b></p>",
      lv: {
        medium: { html: "<p>Linking words join ideas, inside a sentence or from one sentence to the next.</p>" +
          "<p><b>Adding:</b> and, also, as well. <b>Changing direction:</b> but, however, although. <b>Reasons:</b> because, since. <b>Results:</b> so, as a result. <b>Order:</b> then, after that, finally.</p>" +
          "<p>At the start of a sentence, many take a comma: <b>However, it rained.</b> <b>After that, we went home.</b></p>" },
        spicy: { html: "<p>Formal writing uses a wider set of connectives, each with a precise job.</p>" +
          "<p><b>Adding:</b> furthermore, moreover, in addition. <b>Contrast:</b> however, nevertheless, on the other hand. <b>Cause and effect:</b> therefore, consequently, as a result. <b>Example:</b> for instance. <b>Conclusion:</b> overall, in conclusion.</p>" +
          "<p>Pick the one that matches the logic, not just one that sounds clever. <b>However</b> where you mean <b>therefore</b> confuses the reader.</p>" } } },

    Q("mc", "Linking words", null, [
      { q: "Which linking word fills the gap?" + task("I was hungry, ___ I made some toast."),
        o: ["so", "but", "because"],
        s: ["But shows a change, and making toast is not a surprise when you are hungry.", "\"I was hungry because I made toast\" puts things the wrong way round."],
        hint: "Making toast was the result of being hungry.",
        why: "<b>so</b> shows a result: hungry, so toast.",
        medium: { q: "Which linking word fills the gap?" + task("We waited for an hour. ___, the bus never came."),
          o: ["However", "Because", "Also"], s: ["Because needs a reason after it, and this is a surprise.", "Also adds more of the same, but this is a let down."],
          why: "<b>However</b> changes direction: we waited, but it did not come." },
        spicy: { q: "Which connective fits best?" + task("Time travel could let us see history first hand. ___, one small change might alter the future."),
          o: ["On the other hand", "Therefore", "Furthermore"],
          s: ["Therefore means because of this, and the danger is not caused by seeing history.", "Furthermore adds another plus point, but this is a minus."],
          why: "It moves from a reason for to a reason against, so it needs a contrast." } },
      { q: "Which linking word fills the gap?" + task("I wanted to go outside, ___ it was raining."),
        o: ["but", "so", "because"],
        s: ["So would mean the rain made you want to go out.", "Because would mean the rain was why you wanted to go out."],
        hint: "Something got in the way.",
        why: "<b>but</b> changes direction: wanted to, but rain.",
        medium: { q: "Which linking word fills the gap?" + task("[[Obj]] was [[adj2]]. ___, we [[fix]]."),
          o: ["As a result", "However", "For example"], s: ["However would mean a surprise, but fixing it makes sense.", "For example would need an example of something."],
          why: "<b>As a result</b> shows what happened because of the problem." },
        spicy: { q: "Which connective fits best?" + task("Diaries let us see the past without changing it. ___, they may be the safest time machine we have."),
          o: ["Therefore", "Nevertheless", "For instance"],
          s: ["Nevertheless means despite that, but this follows on from it.", "For instance needs an example."],
          why: "<b>Therefore</b> draws a conclusion from what came before." } },
      { q: "Which linking word fills the gap?" + task("Bonnie barked ___ she saw a squirrel."),
        o: ["because", "but", "so"],
        s: ["But would mean the squirrel was a surprise reason not to bark.", "\"Bonnie barked so she saw a squirrel\" means barking made the squirrel appear."],
        hint: "Why did she bark?",
        why: "<b>because</b> gives the reason.",
        medium: { q: "Which linking word fills the gap?" + task("First, we put up the tent. ___, we lit the stove."),
          o: ["After that", "Because", "However"], s: ["Because needs a reason.", "However means a change of direction, but this is just the next step."],
          why: "<b>After that</b> shows what came next." },
        spicy: { q: "Which connective fits best?" + task("Robins are fierce defenders of their patch. ___, they will fight their own reflection in a window."),
          o: ["For instance", "However", "Consequently"],
          s: ["However would mean a contrast, but this backs up the point.", "Close, but fighting a reflection is an example of being fierce, not a result of it."],
          why: "It is an example of the point, so <b>For instance</b>." } }
    ]),

    Q("match", "Linking words", null, [
      { q: "Match each linking word to its job.",
        pairs: [["and", "Adds more"], ["but", "Changes direction"], ["because", "Gives a reason"], ["so", "Shows a result"]],
        hint: "Which one gives a reason?",
        why: "and adds, but changes direction, because gives a reason, so shows a result.",
        medium: { pairs: [["also", "Adds more"], ["however", "Changes direction"], ["because", "Gives a reason"], ["as a result", "Shows a result"], ["after that", "What came next"]] },
        spicy: { pairs: [["furthermore", "Adds more"], ["nevertheless", "Contrast"], ["consequently", "Cause and effect"], ["for instance", "Gives an example"], ["in conclusion", "Sums up"]] } },
      { q: "Match each sentence to the job its linking word is doing.",
        pairs: [["I ran, and I jumped.", "Adds more"], ["I ran, but I fell.", "Changes direction"], ["I ran because I was late.", "Gives a reason"]],
        hint: "Look at the little joining word.",
        why: "and adds, but changes direction, because gives a reason.",
        medium: { pairs: [["We ate. Also, we danced.", "Adds more"], ["We ate. However, nobody was full.", "Changes direction"], ["We ate because we were starving.", "Gives a reason"], ["We ate too much, so we felt ill.", "Shows a result"], ["We ate. Then we went home.", "What came next"]] },
        spicy: { pairs: [["It is fun. Moreover, it is cheap.", "Adds more"], ["It is fun. Nevertheless, it is risky.", "Contrast"], ["It was risky. Consequently, it was banned.", "Cause and effect"], ["Some places are risky, for instance cliffs.", "Gives an example"], ["Overall, it was worth it.", "Sums up"]] } },
      { q: "Match each start to the best ending.",
        pairs: [["I was tired,", "so I went to bed."], ["I was tired,", "but I stayed up."], ["I went to bed", "because I was tired."]],
        hint: "So for a result, but for a change, because for a reason.",
        why: "Each linking word sets up what kind of ending comes next.",
        medium: { pairs: [["It was raining,", "so we stayed in."], ["It was raining.", "However, we still went out."], ["We stayed in", "because it was raining."], ["We stayed in all day.", "After that, we were bored."]] },
        spicy: { pairs: [["The bridge was damaged.", "Consequently, it was closed."], ["The bridge was damaged.", "Nevertheless, people still crossed it."], ["The bridge was damaged.", "Furthermore, the road was flooded."], ["Some bridges were damaged,", "for instance the one on Mill Lane."]] } }
    ]),

    Q("text", "Linking words", null, [
      { q: "Join these two sentences into one, with a linking word." + task("It was cold. We wore hats."),
        need: [["so", "and", "because", "which", "therefore", "as a result"], ["cold"], ["hat"]],
        model: "It was cold, so we wore hats.",
        slips: [[["but", "however"], "But shows a change. Wearing hats in the cold is not a surprise."]],
        hint: "Wearing hats was the result of the cold.",
        why: "<b>It was cold, so we wore hats.</b> Or <b>We wore hats because it was cold.</b>",
        medium: { q: "Join these two sentences into one, with a linking word that shows a <b>reason</b>." + task("We wore hats. It was cold."),
          need: [["because", "since", "as"], ["hat"], ["cold"]], model: "We wore hats because it was cold.",
          slips: [[["but", "however"], "But shows a change, not a reason."], [["so"], "So shows a result. Here the cold is the reason, so try because."]] },
        spicy: { q: "Rewrite as two sentences, with a formal connective that shows <b>cause and effect</b>." + task("It was cold. We wore hats."),
          need: [["therefore", "consequently", "as a result", "because of this", "for this reason"], ["cold"], ["hat"]], model: "It was cold. As a result, we wore hats.",
          slips: [[["however", "nevertheless"], "That shows contrast. Hats are the result, not a surprise."], [["so"], "So works, but it is not a formal connective. Try therefore or as a result."]],
          why: "<b>It was cold. Consequently, we wore hats.</b> Or therefore, or as a result." } },
      { q: "Join these two sentences into one, with a linking word." + task("I like football. I am not very good at it."),
        need: [["but", "although", "though", "however", "yet"], ["football"]],
        model: "I like football, but I am not very good at it.",
        slips: [[["so", "because"], "So and because show a result or a reason. This is more of a surprise: try but."]],
        hint: "The second part is a bit of a surprise.",
        why: "<b>I like football, but I am not very good at it.</b> But changes direction.",
        medium: { q: "Join these two sentences into one, starting with <b>Although</b>." + task("I like football. I am not very good at it."),
          need: [["although", "though"], ["football"]], model: "Although I like football, I am not very good at it.",
          slips: [[["but"], "But works, but try starting the sentence with Although."]] },
        spicy: { q: "Rewrite as two sentences, with a formal connective that shows <b>contrast</b>." + task("I like football. I am not very good at it."),
          need: [["however", "nevertheless", "on the other hand", "even so"], ["football"]], model: "I like football. However, I am not very good at it.",
          slips: [[["but"], "But works in a sentence, but try a formal connective like however."]],
          why: "<b>I like football. Nevertheless, I am not very good at it.</b>" } },
      { q: "Join these two sentences into one, with a linking word." + task("The bus was late. We missed the film."),
        need: [["so", "and", "which", "because", "therefore", "as a result"], ["bus"], ["film"]],
        model: "The bus was late, so we missed the film.",
        slips: [[["but", "however"], "But shows a change. Missing the film is a result of the bus."]],
        hint: "Missing the film was the result.",
        why: "<b>The bus was late, so we missed the film.</b>",
        medium: { q: "Join these two sentences into one, with a linking word that shows a <b>reason</b>." + task("We missed the film. The bus was late."),
          need: [["because", "since", "as"], ["bus"], ["film"]], model: "We missed the film because the bus was late.",
          slips: [[["but", "however"], "But shows a change, not a reason."], [["so"], "So shows a result. Here the bus is the reason, so try because."]] },
        spicy: { q: "Rewrite as two sentences, with a formal connective that shows <b>cause and effect</b>." + task("The bus was late. We missed the film."),
          need: [["therefore", "consequently", "as a result", "because of this", "for this reason"], ["bus"], ["film"]], model: "The bus was late. As a result, we missed the film.",
          slips: [[["however", "nevertheless"], "That shows contrast, but this is cause and effect."], [["so"], "So works, but it is not a formal connective."]],
          why: "<b>The bus was late. Consequently, we missed the film.</b>" } }
    ]),

    /* ---------- chunk 3: one idea ---------- */
    { type: "learn", topic: "Stick to one idea", title: "One idea, one chain",
      fig: ONEIDEA,
      html: "<p>Pointing words and linking words only work if every sentence is about the <b>same idea</b>.</p>" +
        "<p>If one sentence wanders off to something else, the chain breaks and the reader gets lost.</p>",
      lv: {
        medium: { html: "<p>A linked paragraph is a chain: each sentence connects to the last <b>and</b> to the main idea.</p>" +
          "<p>A sentence that wanders off breaks the chain. You can usually spot it because no pointing word or linking word would join it on.</p>" },
        spicy: { html: "<p>Cohesion (the links) and coherence (one clear idea) work together. A paragraph can be full of linking words and still not hang together if one sentence drifts.</p>" +
          "<p>The trickiest drifts are <b>near misses</b>: on the same broad topic, but not on this paragraph's point. In a paragraph about why robins sing, a fact about their eggs is about robins, but it breaks the chain.</p>" } } },

    Q("mc", "Stick to one idea", null, [
      { q: "This paragraph is about <b>why I like winter</b>. Which sentence wanders off?" + task("I love winter. I can wear my big coat. Snow is fun to play in. My cousin has a cat."),
        o: ["My cousin has a cat.", "I can wear my big coat.", "Snow is fun to play in."],
        s: ["The coat is a reason to like winter.", "Snow is a reason to like winter."],
        hint: "Which one is not about winter?",
        why: "The cat has nothing to do with winter. The chain breaks there.",
        medium: { o: ["My cousin has a cat called Snowy.", "I can wear my big coat.", "Snow is fun to play in.", "Hot chocolate tastes better when it is cold."],
          s: ["The coat is a reason to like winter.", "Snow is a reason to like winter.", "Hot chocolate in the cold is a reason too."],
          why: "Snowy sounds wintry, but a cat is not a reason to like winter." },
        spicy: { q: "This paragraph is about <b>why robins sing</b>. Which sentence wanders off?" + task("Robins sing to warn other robins away from their patch. They also sing to attract a mate. Robins lay four or five eggs. Some even sing at night under street lights."),
          o: ["Robins lay four or five eggs.", "They also sing to attract a mate.", "Some even sing at night under street lights."],
          s: ["That is another reason they sing.", "That is still about singing."],
          why: "It is about robins, but not about singing. A near miss." } },
      { q: "This paragraph is about <b>Bonnie's walk</b>. Which sentence wanders off?" + task("Bonnie went for a walk. She sniffed every tree. Pizza is my favourite food. Then she rolled in a puddle."),
        o: ["Pizza is my favourite food.", "She sniffed every tree.", "Then she rolled in a puddle."],
        s: ["Sniffing trees is part of the walk.", "Rolling in a puddle is part of the walk. Sadly."],
        hint: "Which one is not about the walk?",
        why: "Pizza is not part of Bonnie's walk. Unless she found some.",
        medium: { o: ["Bonnie's brother lives in Leeds.", "She sniffed every tree.", "Then she rolled in a puddle.", "After that, she refused to walk any further."],
          s: ["Part of the walk.", "Part of the walk.", "Part of the walk, and very Bonnie."],
          why: "It is about Bonnie's family, not the walk." },
        spicy: { q: "This paragraph is about <b>why the walk went badly</b>. Which sentence wanders off?" + task("The walk did not go to plan. It started pouring as soon as we left. Bonnie refused to move. Bonnie's favourite toy is a red ball. In the end, Jay carried her home."),
          o: ["Bonnie's favourite toy is a red ball.", "It started pouring as soon as we left.", "In the end, Jay carried her home."],
          s: ["The rain is part of why it went badly.", "That is how it ended, so it belongs."],
          why: "It is about Bonnie, but not about the walk going badly." } },
      { q: "This paragraph is all about [[obj]]. Which sentence wanders off?" + task("[[Obj]] was [[adj1]]. It was [[adj2]], so we [[fix]]. My favourite colour is green."),
        o: ["My favourite colour is green.", "It was [[adj2]], so we [[fix]].", "[[Obj]] was [[adj1]]."],
        s: ["That links back with It and so.", "That is the topic."],
        hint: "Which one is not about [[obj]]?",
        why: "The colour has nothing to do with [[obj]]. No pointing word or linking word could join it on.",
        medium: { o: ["My cousin got a new phone last week.", "It was [[adj2]], so we [[fix]].", "[[Obj]] was [[adj1]].", "After that, it worked perfectly."],
          s: ["That links back with It and so.", "That is the topic.", "That links back with After that and it."] },
        spicy: { q: "This paragraph is about <b>how we fixed [[obj]]</b>. Which sentence wanders off?" + task("[[Obj]] was [[adj2]]. First, we [[fix]]. After that, it worked perfectly. [[Obj]] was first made in 1952."),
          o: ["[[Obj]] was first made in 1952.", "First, we [[fix]].", "After that, it worked perfectly."],
          s: ["That is the first step of fixing it.", "That is the result of fixing it."],
          why: "It is about the same thing, but it is history, not fixing. A near miss." } }
    ]),

    Q("mc", "Stick to one idea", null, [
      { q: "Which sentence links on best after this one?" + task("Bonnie loves the park."),
        o: ["She runs round the pond every morning.", "Jay's car is blue.", "Pizza is nice."],
        s: ["Nothing to do with Bonnie or the park.", "Nothing to do with Bonnie or the park."],
        hint: "Look for one that points back to Bonnie.",
        why: "<b>She</b> points back to Bonnie, and the pond is in the park.",
        medium: { o: ["She runs round the pond every morning.", "The park has a pond.", "Parks are found in most towns."],
          s: ["It is about the park, but it does not link back to Bonnie loving it.", "It drifts away to parks in general."] },
        spicy: { q: "Which sentence links on best, keeping the same idea <b>and</b> using a link?" + task("Bonnie loves the park more than anywhere."),
          o: ["This is mainly because of the ducks, which she is sure are her friends.", "The park has a pond with ducks.", "Ducks can live for ten years."],
          s: ["On topic, but nothing links it to Bonnie loving the park.", "It drifts off to ducks in general."],
          why: "<b>This</b> points back and <b>because</b> gives a reason, all on the same idea." } },
      { q: "Which sentence links on best after this one?" + task("Our team won the cup."),
        o: ["We were so proud of ourselves.", "My dad likes cheese.", "It is Tuesday."],
        s: ["Nothing to do with the cup.", "Nothing to do with the cup."],
        hint: "Which one is still about the team winning?",
        why: "<b>We</b> points back to the team, and it is still about winning.",
        medium: { o: ["It was the first time we had ever won it.", "Cups are often made of silver.", "The other team wore blue."],
          s: ["About cups in general, not our win.", "About the other team, and it does not link on."] },
        spicy: { q: "Which sentence links on best, keeping the same idea <b>and</b> using a link?" + task("Our team won the cup for the first time."),
          o: ["As a result, the whole town came out to celebrate.", "The cup is made of silver.", "Football was invented in England."],
          s: ["About the cup, but it does not connect to the win.", "Drifts off to history."],
          why: "<b>As a result</b> links the celebration to the win." } },
      { q: "Which sentence links on best after this one?" + task("[[Obj]] was [[adj2]]."),
        o: ["So we [[fix]].", "I like crisps.", "The sky is blue."],
        s: ["Nothing to do with [[obj]].", "Nothing to do with [[obj]]."],
        hint: "Which one follows on?",
        why: "<b>So</b> links the fix to the problem, and <b>it</b> points back.",
        medium: { o: ["It took us an hour, but we [[fix]].", "Lots of things get old.", "My friend has one too."],
          s: ["Drifts off to things in general.", "Sort of on topic, but it does not follow on from the problem."] },
        spicy: { q: "Which sentence links on best, keeping the same idea <b>and</b> using a link?" + task("[[Obj]] was [[adj2]]."),
          o: ["Consequently, we [[fix]] before anyone used it.", "It is a popular kind of thing.", "Nevertheless, it is made of metal."],
          s: ["Vague, and it does not follow on.", "Nevertheless shows contrast, but there is no contrast here."],
          why: "<b>Consequently</b> links the fix to the problem, and <b>it</b> points back." } }
    ]),

    Q("sort", "Stick to one idea", null, [
      { q: "The paragraph is about <b>a rainy day</b>. Do these sentences stick to it?",
        buckets: ["Sticks to the idea", "Wanders off"],
        cards: [["It rained all day.", 0], ["We stayed in and played games.", 0], ["My shoes are size 6.", 1], ["Jay likes jam.", 1]],
        hint: "Is it about the rainy day?",
        why: "Rain and games indoors stick to the idea. Shoes and jam wander off.",
        medium: { cards: [["It rained all day.", 0], ["We stayed in and played games.", 0], ["Bonnie refused to go out.", 0], ["My shoes are size 6.", 1], ["Rain is made of water.", 1], ["Last summer was really hot.", 1]],
          why: "Rain facts and last summer are about weather, but not about this rainy day." },
        spicy: { q: "The paragraph is about <b>why the rainy day turned out well</b>. Do these sentences stick to it?",
          cards: [["We stayed in and finally finished the film.", 0], ["Bonnie fell asleep on my feet.", 0], ["Nobody minded, because we had popcorn.", 0], ["Rain is made of water.", 1], ["Last summer was really hot.", 1], ["The forecast said it would rain.", 1]],
          why: "The forecast is about the rain, but not about why the day went well. A near miss." } },
      { q: "The paragraph is about <b>Jay's bird feeder</b>. Do these sentences stick to it?",
        buckets: ["Sticks to the idea", "Wanders off"],
        cards: [["Jay has a bird feeder.", 0], ["Robins visit it every day.", 0], ["I had chips for tea.", 1], ["My bike is red.", 1]],
        hint: "Is it about the feeder?",
        why: "The feeder and the robins stick to the idea. Chips and bikes wander off.",
        medium: { cards: [["Jay has a bird feeder.", 0], ["Robins visit it every day.", 0], ["He fills it every morning.", 0], ["I had chips for tea.", 1], ["Penguins cannot fly.", 1], ["Jay's car is blue.", 1]],
          why: "Penguins are birds, but not at Jay's feeder." },
        spicy: { q: "The paragraph is about <b>how to keep a bird feeder busy</b>. Do these sentences stick to it?",
          cards: [["Fill it every morning, even in winter.", 0], ["Hang it near a bush, so small birds feel safe.", 0], ["Keep it clean, because dirty feeders spread disease.", 0], ["Robins are the UK's favourite bird.", 1], ["Penguins cannot fly.", 1], ["Jay's feeder is green.", 1]],
          why: "The feeder being green is about the feeder, but not about keeping it busy." } },
      { q: "The paragraph is about <b>sports day</b>. Do these sentences stick to it?",
        buckets: ["Sticks to the idea", "Wanders off"],
        cards: [["I ran in the relay.", 0], ["Our team came second.", 0], ["My gran has a dog.", 1], ["I like maths.", 1]],
        hint: "Is it about sports day?",
        why: "The relay and the result stick. The dog and maths wander off.",
        medium: { cards: [["I ran in the relay.", 0], ["Our team came second.", 0], ["After that, we had ice lollies.", 0], ["My gran has a dog.", 1], ["The Olympics are every four years.", 1], ["I like maths.", 1]],
          why: "The Olympics are sport, but not our sports day." },
        spicy: { q: "The paragraph is about <b>why our team came second</b>. Do these sentences stick to it?",
          cards: [["We dropped the baton in the relay.", 0], ["Our best runner was off sick.", 0], ["However, we won the tug of war.", 0], ["The ice lollies were orange.", 1], ["The Olympics are every four years.", 1], ["Sports day started at ten.", 1]],
          why: "The tug of war links with However: it explains how close we came. The start time is about sports day, but not about why we came second." } }
    ]),

    /* ---------- chunk 4: link it up (worked example, then fade) ---------- */
    { type: "learn", topic: "Link it up", title: "Watch some choppy sentences link up",
      fig: STEPS,
      html: "<p>Here are three choppy sentences:</p>" + task("Jay saw a bird. Jay liked the bird. Jay took a photo.") +
        "<p><b>1. Point back.</b> Swap the repeated names for pointing words: <b>Jay saw a bird. He liked it. He took a photo.</b></p>" +
        "<p><b>2. Link up.</b> Add linking words to show how the ideas join: <b>Jay saw a bird and he liked it, so he took a photo.</b></p>" +
        "<p><b>3. Check.</b> Is it all about one idea? Yes: the bird.</p>",
      lv: { spicy: { html: "<p>Here are four choppy sentences:</p>" + task("Jay saw a heron. Jay wanted a photo of the heron. The heron flew off. Jay was too slow.") +
        "<p><b>1. Point back:</b> <b>Jay saw a heron. He wanted a photo of it. It flew off. He was too slow.</b> Careful: two its or hes in a row can blur.</p>" +
        "<p><b>2. Link up</b>, choosing links that match the logic: <b>Jay saw a heron and wanted a photo of it. However, he was too slow, and the heron flew off.</b></p>" +
        "<p><b>3. Check:</b> one idea (the missed photo), no pointing word that could point two ways.</p>" } } },

    Q("mc", "Link it up", { explain: true }, [
      { q: "<b>Step 1 is done</b> (pointing words). Step 2: which linking word joins them best?" + task("Bonnie heard a noise, ___ she barked."),
        o: ["so", "but", "because"],
        s: ["But would mean barking was a surprise. It is not, for Bonnie.", "\"heard a noise because she barked\" gets things the wrong way round."],
        hint: "Barking was the result.",
        why: "<b>Bonnie heard a noise, so she barked.</b>",
        medium: { q: "<b>Step 1 is done</b>. Step 2: which link joins these best?" + task("The birds found the feeder. ___, they emptied it in an hour."),
          o: ["After that", "However", "Because"], s: ["However means a change of direction, but this follows on.", "Because needs a reason after it."] },
        spicy: { q: "<b>Step 1 is done</b>. Step 2: which connective matches the logic?" + task("The heron stood perfectly still. ___, it caught a fish."),
          o: ["Eventually", "However", "For instance"],
          s: ["However would mean a contrast, but catching a fish is what waiting still is for.", "It is not an example of standing still."],
          why: "<b>Eventually</b> shows the result came after a long wait." } },
      { q: "<b>Step 1 is done</b> (pointing words). Step 2: which linking word joins them best?" + task("We went to the beach, ___ it was too windy."),
        o: ["but", "so", "because"],
        s: ["So would mean the wind was why you went.", "Because would mean the wind was the reason you went."],
        hint: "Something did not go to plan.",
        why: "<b>We went to the beach, but it was too windy.</b>",
        medium: { q: "<b>Step 1 is done</b>. Step 2: which link joins these best?" + task("We packed a picnic. ___, it rained all afternoon."),
          o: ["Sadly,", "So", "Because"], s: ["So would mean packing caused the rain.", "Because needs a reason after it."] },
        spicy: { q: "<b>Step 1 is done</b>. Step 2: which connective matches the logic?" + task("We packed a picnic and checked the forecast. ___, it rained all afternoon."),
          o: ["Despite this", "As a result", "Furthermore"],
          s: ["The rain was not caused by checking the forecast.", "Furthermore adds a similar point, but this is a let down."],
          why: "<b>Despite this</b> shows the rain came even though you planned." } },
      { q: "<b>Step 1 is done</b> (pointing words). Step 2: which linking word joins them best?" + task("The film was long, ___ I loved it."),
        o: ["but", "so", "because"],
        s: ["So would mean you loved it because it was long.", "Because would mean it was long because you loved it."],
        hint: "Long might sound like a bad thing.",
        why: "<b>The film was long, but I loved it.</b>",
        medium: { q: "<b>Step 1 is done</b>. Step 2: which link joins these best?" + task("The film was three hours long. ___, nobody wanted it to end."),
          o: ["Even so", "So", "Because"], s: ["So would mean the length made people want more.", "Because needs a reason."] },
        spicy: { q: "<b>Step 1 is done</b>. Step 2: which connective matches the logic?" + task("The film was three hours long. ___, the cinema was packed."),
          o: ["Nevertheless", "Therefore", "For instance"],
          s: ["Therefore would mean it was packed because it was long.", "Packed is not an example of long."],
          why: "<b>Nevertheless</b> shows a contrast: long, but still packed." } }
    ]),

    Q("mc", "Link it up", null, [
      { q: "<b>Steps 1 and 2, on your own.</b> Which is the best linked version?" + task("The cake was ready. The cake smelled amazing. We ate the cake."),
        o: ["The cake was ready and it smelled amazing, so we ate it.", "The cake was ready. The cake smelled amazing. We ate the cake.", "It was ready and it smelled amazing, so we ate it."],
        s: ["That is the choppy version.", "We never find out what it is."],
        hint: "Name it first, point back, add links.",
        why: "Name it once, point back with it, join with and and so.",
        medium: { q: "<b>Steps 1 and 2, on your own.</b> Which is the best linked version?" + task("Jay found a nest. Jay did not touch the nest. Jay watched the nest from far away."),
          o: ["Jay found a nest. He did not touch it, but he watched it from far away.", "Jay found a nest. Jay did not touch the nest. Jay watched the nest from far away.", "He found it. He did not touch it, so he watched it."],
          s: ["Still choppy.", "Who found what? And so does not match the logic."] },
        spicy: { q: "<b>Steps 1 and 2, on your own.</b> Which is the best linked version?" + task("The storm hit the town. The storm knocked down trees. The council closed the roads. People stayed at home."),
          o: ["The storm hit the town and knocked down trees. As a result, the council closed the roads, so people stayed at home.", "The storm hit the town. However, it knocked down trees. Furthermore, the council closed the roads.", "It hit the town and knocked them down, so they closed them and they stayed home."],
          s: ["However and furthermore do not match the logic. This is cause and effect.", "Too many pointing words: nobody can follow who did what."],
          why: "Links that match the logic (cause and effect) and pointing words that are clear." } },
      { q: "<b>Steps 1 and 2, on your own.</b> Which is the best linked version?" + task("Bonnie saw a cat. Bonnie chased the cat. The cat ran up a tree."),
        o: ["Bonnie saw a cat and chased it, but it ran up a tree.", "Bonnie saw a cat. Bonnie chased the cat. The cat ran up a tree.", "She saw it and chased it, but it ran up it."],
        s: ["That is the choppy version.", "It ran up it? Too many pointing words."],
        hint: "Name them first, point back, add links.",
        why: "Names first, then it, and links that show what happened.",
        medium: { q: "<b>Steps 1 and 2, on your own.</b> Which is the best linked version?" + task("The team trained hard. The team won the final. The team lifted the cup."),
          o: ["The team trained hard, so they won the final. After that, they lifted the cup.", "The team trained hard. The team won the final. The team lifted the cup.", "They trained hard, but they won it, and they lifted it."],
          s: ["Still choppy.", "But does not match the logic, and we never find out who or what."] },
        spicy: { q: "<b>Steps 1 and 2, on your own.</b> Which is the best linked version?" + task("Scientists want to visit the past. Visiting the past could be dangerous. A small change could alter history."),
          o: ["Scientists want to visit the past. However, this could be dangerous, because a small change could alter history.", "Scientists want to visit the past. Therefore, it could be dangerous. For instance, a small change could alter history.", "They want to visit it, but it could be dangerous, because it could alter it."],
          s: ["Therefore says the danger is caused by wanting to go, which does not make sense.", "Four its: nobody can follow."],
          why: "However for the contrast, this to point back, because for the reason." } },
      { q: "<b>Steps 1 and 2, on your own.</b> Which is the best linked version?" + task("[[Obj]] was [[adj2]]. We [[fix]]. [[Obj]] was fine again."),
        o: ["[[Obj]] was [[adj2]], so we [[fix]]. After that, it was fine again.", "[[Obj]] was [[adj2]]. We [[fix]]. [[Obj]] was fine again.", "It was [[adj2]], so we [[fix]], and it was fine again."],
        s: ["That is the choppy version.", "We never find out what it is."],
        hint: "Name it first, point back, add links.",
        why: "Name it, link with so and after that, point back with it.",
        medium: { q: "<b>Steps 1 and 2, on your own.</b> Which is the best linked version?" + task("[[Obj]] was [[adj1]]. [[Obj]] was [[adj2]]. We [[fix]]. [[Obj]] was fine again."),
          o: ["[[Obj]] was [[adj1]] and it was [[adj2]], so we [[fix]]. After that, it was fine again.", "[[Obj]] was [[adj1]]. [[Obj]] was [[adj2]]. We [[fix]]. [[Obj]] was fine again.", "It was [[adj1]], but it was [[adj2]], because we [[fix]]."],
          s: ["Still choppy.", "But and because do not match the logic, and we never find out what it is."] },
        spicy: { q: "<b>Steps 1 and 2, on your own.</b> Which is the best linked version?" + task("[[Obj]] was [[adj2]]. Nobody could use it. We [[fix]]. [[Obj]] was fine again."),
          o: ["[[Obj]] was [[adj2]], so nobody could use it. Consequently, we [[fix]], and after that it was fine again.", "[[Obj]] was [[adj2]]. Nevertheless, nobody could use it. For instance, we [[fix]].", "It was [[adj2]], so nobody could use it, so we [[fix]], so it was fine."],
          s: ["Nevertheless and for instance do not match the logic.", "So, so, so: one link word doing every job, and we never find out what it is."],
          why: "Varied links that match the logic, and the noun named first." } }
    ]),

    Q("order", "Link it up", null, [
      { q: "<b>All three steps, on your own.</b> Use the pointing words and linking words to put this paragraph in order.",
        items: ["Jay filled the bird feeder.", "Then he hung it on a branch.", "After that, a robin landed on it.", "It ate all the seed."],
        hint: "Which sentence names Jay and the feeder?",
        why: "The names come first. Then he, it, then and after that link the rest on.",
        medium: { items: ["Jay filled the bird feeder.", "Then he hung it on a branch.", "After that, a robin landed on it.", "It ate all the seed.", "Jay was delighted."] },
        spicy: { items: ["Jay filled the bird feeder before breakfast.", "He hung it on the lowest branch of the apple tree.", "Within minutes, a robin had landed on it.", "However, a squirrel soon chased it off.", "Consequently, Jay now owns a squirrel proof feeder."] } },
      { q: "<b>All three steps, on your own.</b> Use the pointing words and linking words to put this paragraph in order.",
        items: ["Bonnie found a muddy puddle.", "She rolled in it.", "Then she ran inside.", "Now the sofa is brown too."],
        hint: "Which sentence names Bonnie and the puddle?",
        why: "Names first. Then she and it point back, and then links on.",
        medium: { items: ["Bonnie found a muddy puddle.", "She rolled in it.", "Then she ran inside.", "After that, she jumped on the sofa.", "Now the sofa is brown too."] },
        spicy: { items: ["Bonnie found the muddiest puddle in the park.", "Without hesitating, she rolled in it.", "Then she raced home ahead of Jay.", "Unfortunately, the back door was open.", "As a result, the sofa is now the same colour as Bonnie."] } },
      { q: "<b>All three steps, on your own.</b> Use the pointing words and linking words to put this paragraph in order.",
        items: ["We made a cake for Jay.", "We put candles on it.", "Then we gave it to him.", "He said it was outrageous."],
        hint: "Which sentence names the cake and Jay?",
        why: "Names first. Then it and him point back, and then links on.",
        medium: { items: ["We made a cake for Jay.", "First we mixed it.", "Then we baked it.", "After that, we gave it to him.", "He said it was outrageous."] },
        spicy: { items: ["We secretly made a cake for Jay's birthday.", "First, we baked it in the school kitchen.", "However, it came out shaped like a pancake.", "Nevertheless, we decorated it with birds.", "When we gave it to him, he called it outrageous, in a good way."] } }
    ]),

    { type: "write", topic: "Link it up",
      q: "Only if you fancy it: link these up in your own words. Use a pointing word and a linking word." + task("Jay lost his hat. Jay looked for the hat. Bonnie had the hat."),
      starters: ["Jay lost his hat, so", "He looked for it, but", "In the end,"],
      checklist: ["I used a pointing word (he, she, it, they)", "I used a linking word (and, but, so, because, then)", "It is all about one idea"],
      minWords: 12,
      lv: { medium: { q: "Only if you fancy it: write a short paragraph (three or four sentences) about a time something went wrong. Use pointing words and at least two different linking words.", minWords: 35,
          checklist: ["I named people and things first, then pointed back", "I used two different linking words", "It sticks to one idea"] },
        spicy: { q: "Only if you fancy it: write a short paragraph arguing one side of <b>should we time travel?</b> Use at least one formal connective and make sure no pointing word could point two ways.", minWords: 60,
          checklist: ["One clear idea", "At least one formal connective (however, therefore, as a result...)", "Every pointing word is clear"] } } }
  ],

  realWorld: {
    title: "Where you would use this",
    html: "<p>Any time you explain what happened, you link: telling a friend about your weekend, writing a message to say why you are late, explaining a fault at work. Without links it sounds like a list. With links it makes sense.</p>" +
      "<p>For our big question, if we could time travel, should we? Every time travel story runs on <b>because</b> and <b>so</b>: they went back, <b>so</b> something changed, <b>because</b> one tiny thing was different. Cause and effect links are how you would explain the risks.</p>",
    fig: '<svg viewBox="0 0 440 150" role="img" aria-label="The time portal, linked to Jay by a chain with the words so and because">' + A.portal(70, 76, 52) +
      link(130, 76, 84, "#22b8e6", "so") + link(206, 76, 120, "#8a5cf6", "because") + A.jay(380, 52, 0.75, "wink") + '</svg>'
  },

  make: {
    title: "Make a link chain card",
    intro: "Two ideas and the link that joins them. Funny, true, or both. Keep it, put it up, or send it to Jay.",
    fields: [
      { id: "s1", label: "First idea", ph: "It started to rain", max: 36 },
      { id: "link", label: "Linking word", ph: "so", max: 14 },
      { id: "s2", label: "Second idea", ph: "Bonnie refused to move", max: 36 },
      { id: "name", label: "Linked by", ph: "B5", max: 20 }
    ],
    svg: function(v){
      function box(y, txt, col){
        var ls = wrap(txt, 24, 2);
        return '<rect x="40" y="' + y + '" width="520" height="84" rx="16" fill="' + col + '" fill-opacity=".25" stroke="#141a33" stroke-width="3"/>' +
          ls.map(function(l, k){ return T(300, y + (ls.length > 1 ? 36 : 52) + k * 30, esc(l), 26, { a: "middle", b: 1 }); }).join("");
      }
      var lk = esc(wrap(v.link, 14, 1)[0] || ""), lw = Math.max(160, String(v.link || "").length * 17 + 70);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">' +
        '<rect width="600" height="420" rx="24" fill="#fffdf6"/>' +
        '<rect x="12" y="12" width="576" height="396" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        T(40, 52, "LINK IT UP", 20, { b: 1, c: "#8a5cf6" }) +
        box(70, v.s1, "#19c39a") +
        '<rect x="' + (300 - lw / 2) + '" y="164" width="' + lw + '" height="72" rx="36" fill="#ffffff" stroke="#f2a516" stroke-width="12"/>' + T(300, 209, lk, 24, { a: "middle", b: 1 }) +
        box(250, v.s2, "#22b8e6") +
        T(40, 380, "Linked by: " + esc(wrap(v.name, 20, 1)[0] || ""), 16, { c: "#5b6180" }) +
        A.bird(540, 372, 0.8, "#ff8a5c") +
        '</svg>';
    }
  }
};
})();
