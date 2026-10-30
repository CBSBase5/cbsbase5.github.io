/* Base 5 Autumn 2 activity: Prove it.
   English. Backing up an inference with a detail from the text:
   point, evidence, explain. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';

function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

/* a detective's pin board: an idea joined to its clues by string */
var BOARD =
  '<svg viewBox="0 0 520 240" role="img" aria-label="A pin board. The idea, I think they are angry, is joined by string to two clues from the text.">' +
  '<rect x="4" y="4" width="512" height="232" rx="14" fill="#c99a63" stroke="#7a5532" stroke-width="5"/>' +
  '<path d="M150 92L300 58M150 92L300 168" stroke="#e04848" stroke-width="3"/>' +
  '<g transform="rotate(-3 100 92)"><rect x="30" y="48" width="140" height="92" rx="6" fill="#ffe873" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
  '<text x="44" y="80" ' + F + ' font-size="15" font-weight="700" fill="#141a33">My idea:</text><text x="44" y="106" ' + F + ' font-size="15" fill="#141a33">they are</text><text x="44" y="126" ' + F + ' font-size="15" fill="#141a33">angry</text></g>' +
  '<rect x="300" y="26" width="196" height="64" rx="6" fill="#fff" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
  '<text x="314" y="52" ' + F + ' font-size="13" font-weight="700" fill="#7a5532">CLUE</text><text x="314" y="74" ' + F + ' font-size="15" fill="#141a33">"slammed the door"</text>' +
  '<rect x="300" y="136" width="196" height="64" rx="6" fill="#fff" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
  '<text x="314" y="162" ' + F + ' font-size="13" font-weight="700" fill="#7a5532">CLUE</text><text x="314" y="184" ' + F + ' font-size="15" fill="#141a33">"threw their [[thing]]"</text>' +
  '<circle cx="150" cy="92" r="7" fill="#e04848"/><circle cx="300" cy="58" r="7" fill="#e04848"/><circle cx="300" cy="168" r="7" fill="#e04848"/>' +
  A.egg(A.bird(240, 210, 0.55, "#3a8fd6"), "A bird on the evidence board. Jay says it is a witness.") +
  '</svg>';

/* evidence strength: some clues prove an idea better than others */
var STRENGTH =
  '<svg viewBox="0 0 520 220" role="img" aria-label="Three clues with strength bars. The calendar showing 1999 is strong proof, the dust is medium, the silence is weak.">' +
  '<rect x="0" y="0" width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  '<text x="24" y="34" ' + F + ' font-size="15" font-weight="700" fill="#141a33">Idea: nobody has been here for years</text>' +
  [["Calendar says March 1999", 3, "strong"], ["Thick dust", 2, "some"], ["It was silent", 1, "weak"]].map(function(c, k){
    var y = 56 + k * 52;
    var bars = "";
    for(var b = 0; b < 3; b++) bars += '<rect x="' + (330 + b * 34) + '" y="' + (y + 6) + '" width="28" height="26" rx="4" fill="' + (b < c[1] ? ["#e08a00", "#ffd23f", "#1f9d63"][c[1] - 1] : "#fff") + '" stroke="#141a33" stroke-width="2"/>';
    return '<rect x="24" y="' + y + '" width="290" height="38" rx="8" fill="#fff" stroke="#141a33" stroke-width="2"/>' +
      '<text x="38" y="' + (y + 25) + '" ' + F + ' font-size="15" fill="#141a33">' + c[0] + '</text>' + bars +
      '<text x="444" y="' + (y + 25) + '" ' + F + ' font-size="14" font-weight="700" fill="#141a33">' + c[2] + '</text>';
  }).join("") +
  '</svg>';

/* the proof burger: point on top, evidence in the middle, explain underneath */
var BURGER =
  '<svg viewBox="0 0 520 250" role="img" aria-label="A burger. The top bun is the point, the filling is the evidence, the bottom bun is the explain.">' +
  '<rect x="0" y="0" width="520" height="250" rx="16" fill="#fff7e6"/>' +
  '<path d="M40 82q0 -64 150 -64q150 0 150 64z" fill="#e8a55a" stroke="#141a33" stroke-width="3"/>' +
  [[110, 44], [170, 34], [230, 40], [280, 56], [140, 62]].map(function(p){ return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="5" ry="3" fill="#fff6dc"/>'; }).join("") +
  '<path d="M34 98q20 -14 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0" fill="#6fcf5a" stroke="#141a33" stroke-width="2.5"/>' +
  '<rect x="44" y="100" width="292" height="40" rx="10" fill="#8a4a2a" stroke="#141a33" stroke-width="3"/>' +
  '<path d="M40 150h300l-10 10h-280z" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/>' +
  '<path d="M40 166h300q0 40 -40 40h-220q-40 0 -40 -40z" fill="#e8a55a" stroke="#141a33" stroke-width="3"/>' +
  '<path d="M350 52h24M350 120h24M350 186h24" stroke="#141a33" stroke-width="2.5"/>' +
  '<text x="382" y="48" ' + F + ' font-size="16" font-weight="700" fill="#c0392b">Point</text><text x="382" y="68" ' + F + ' font-size="14" fill="#141a33">I think...</text>' +
  '<text x="382" y="116" ' + F + ' font-size="16" font-weight="700" fill="#1f6fd1">Evidence</text><text x="382" y="136" ' + F + ' font-size="14" fill="#141a33">It says "..."</text>' +
  '<text x="382" y="182" ' + F + ' font-size="16" font-weight="700" fill="#1f9d63">Explain</text><text x="382" y="202" ' + F + ' font-size="14" fill="#141a33">This shows...</text>' +
  A.egg('<g transform="translate(190 236)"><text text-anchor="middle" ' + F + ' font-size="13" fill="#141a33" fill-opacity=".45">no nuts, no gaps in the proof</text></g>', "Proof burgers are nut free, like everything at Chilton Bridge. And they always have a filling: evidence.") +
  '</svg>';

/* texts */
var ANGRY = {
  mild: '<p class="a2task">[[Who]] stomped into [[place]]. They slammed the door. They threw their [[thing]] on the floor.</p>',
  medium: '<p class="a2task">[[Who]] walked into [[place]] and slammed the door behind them. They threw their [[thing]] on the floor, folded their arms and stared at the wall. When someone asked if they were OK, they just shrugged.</p>',
  spicy: '<p class="a2task">[[Who]] arrived at [[place]] ten minutes early. They checked their [[thing]] three times, then checked it again. Every few seconds they glanced at the clock, and when someone said hello, they jumped.</p>'
};
var EMPTY = {
  mild: '<p class="a2task">[[Old]] was silent. Dust lay thick on the [[dusty]]. A calendar on the wall still said March 1999. Cobwebs hung across the door.</p>',
  medium: '<p class="a2task">The corridor at [[old]] was silent. Dust lay thick on the [[dusty]], and a single set of footprints led away from it. A calendar on the wall still showed March 1999. Cobwebs hung across every doorway, unbroken.</p>',
  spicy: '<p class="a2task">The corridor at [[old]] was silent, apart from the hum of the strip lights. Dust lay thick on the [[dusty]]. A calendar on the wall still showed March 1999, its corner curled and yellow. Cobwebs stretched across every doorway, unbroken, and the clock above the desk had stopped at ten past four.</p>'
};
var EDGE = {
  mild: '<p class="a2task">[[Who]] stood at the edge of [[edge]]. Their knees were shaking. Their mouth was dry. Then [[moment]], and they smiled a huge smile.</p>',
  medium: '<p class="a2task">[[Who]] stood at the edge of [[edge]]. Their knees were trembling and their mouth was dry. They kept wiping their hands on their [[clothes]]. Then [[moment]], and a huge grin spread across their face.</p>',
  spicy: '<p class="a2task">[[Who]] stood at the edge of [[edge]], gripping their [[clothes]] so tightly their knuckles turned white. Their breath came in short, shallow bursts. Somebody whispered good luck; they did not seem to hear. Then [[moment]], and something changed: their shoulders dropped, their chin lifted, and a slow grin spread across their face.</p>'
};

(window.A2PACKS = window.A2PACKS || {})["prove-it"] = {
  a2: true,
  id: "a2-prove-it",
  title: "Prove it",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "You have worked something out from a text. Now show the proof.",
  blurb: "Backing up an idea about a text with a detail from it: the clue, the proof, and how it shows your idea. Four short chunks, with a proof card to make at the end.",
  note: "Prove it: backing up what you have worked out with a detail from the text. Four five minute chunks and a proof card to make at the end. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Witness", line: "Witness: short texts, find the words that prove your idea." },
    { id: "medium", name: "Detective", line: "Detective: point, evidence, explain, using the best clue you can find." },
    { id: "spicy", name: "Barrister", line: "Barrister: subtle texts, the strongest evidence, and zooming in on single words." }
  ],
  themes: {
    time: { name: "Time travel", w: { who: "the time traveller", place: "the workshop", thing: "helmet", old: "the old museum", dusty: "display case", edge: "the time portal", clothes: "coat", moment: "the portal flickered into life" } },
    football: { name: "Football", w: { who: "the striker", place: "the changing room", thing: "boots", old: "the old stadium", dusty: "trophy cabinet", edge: "the pitch", clothes: "shirt", moment: "the whistle blew" } },
    horror: { name: "Horror", w: { who: "the night porter", place: "the staff room", thing: "torch", old: "the old hospital", dusty: "reception desk", edge: "the basement stairs", clothes: "uniform", moment: "the lights flickered back on" } },
    fishing: { name: "Fishing", w: { who: "the angler", place: "the tackle shop", thing: "rod", old: "the old boat house", dusty: "rowing boat", edge: "the jetty", clothes: "waterproofs", moment: "the float dipped under the water" } },
    music: { name: "Music", w: { who: "the lead singer", place: "the dressing room", thing: "script", old: "the old theatre", dusty: "piano", edge: "the stage", clothes: "costume", moment: "the spotlight came on" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: BURGER,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Clue and idea", title: "Every good idea has a clue behind it",
      fig: BOARD,
      html: "<p>Texts do not always tell you everything. Sometimes you <b>work it out</b> from clues. That is your idea.</p>" +
        "<p>To <b>prove</b> your idea, point to the words in the text that made you think it.</p>" + ANGRY.mild +
        "<p>Idea: they are <b>angry</b>. Proof: they <b>slammed the door</b>.</p>",
      ez: { title: "Clue and idea", html: "<p>Use <b>clues</b> to work out an idea.</p>" + ANGRY.mild + "<p>Idea: <b>angry</b>. Proof: <b>slammed the door</b>.</p>" },
      lv: { medium: { html: "<p>Texts do not always tell you everything. You <b>work it out</b> from clues: that is an inference.</p>" +
              "<p>To prove an inference, point to the exact words in the text that made you think it.</p>" + ANGRY.medium +
              "<p>The text never says \"angry\". But <b>slammed the door</b> and <b>folded their arms</b> are clues that prove it.</p>" },
            spicy: { html: "<p>An <b>inference</b> is something you work out that the text does not say outright. Proving one means pointing to the exact words that led you there.</p>" +
              "<p>Subtle writers show feelings through actions and small details. Read this one closely: the feeling is never named.</p>" + ANGRY.spicy } } },

    { type: "mc", topic: "Clue and idea",
      q: "Read it again. How do you think [[who]] is feeling?" + ANGRY.mild,
      options: ["Angry", "Excited", "Sleepy"], answer: 0,
      slips: { 1: "Excited people might rush in, but would they slam the door and throw things?", 2: "Sleepy people move slowly. Stomping and slamming are loud and cross." },
      hint: "What do people do when they slam doors?",
      ez: { q: "How is [[who]] feeling?" + ANGRY.mild, hint: "Why do people slam doors?", why: "Stomping and slamming show <b>angry</b>.", slips: { 1: "Would excited people slam doors?", 2: "Sleepy people are slow. Slamming is loud." } },
      why: "Stomping, slamming and throwing are what people do when they are <b>angry</b>.",
      lv: { medium: { q: "Read it again. How do you think [[who]] is feeling?" + ANGRY.medium,
              options: ["Angry or upset", "Excited", "Sleepy"],
              why: "Slamming, throwing, folded arms and a shrug: all clues that they are <b>angry or upset</b>." },
            spicy: { q: "Read it again. How do you think [[who]] is feeling?" + ANGRY.spicy,
              options: ["Nervous", "Bored", "Angry", "Relaxed"],
              slips: { 1: "Bored people do not check things again and again, or jump when someone speaks.", 2: "Nothing is slammed or thrown. Look at the checking and the jumping.", 3: "Relaxed people do not jump when someone says hello." },
              hint: "Why would someone keep checking things and watching the clock?",
              why: "Checking over and over, watching the clock and jumping at a hello all point to <b>nervous</b>." } } },

    { type: "mc", topic: "Clue and idea",
      q: "Which words <b>prove</b> that [[who]] is angry?",
      options: ["\"They slammed the door.\"", "\"into [[place]]\"", "\"on the floor\""], answer: 0,
      slips: { 1: "Those words say where they went, not how they feel.", 2: "Those words are in the text, but they do not show anger on their own." },
      hint: "Which words show a feeling through an action?",
      ez: { q: "Which words <b>prove</b> [[who]] is angry?", hint: "Which action shows a feeling?", why: "Slamming a door is a cross action. That is the <b>proof</b>.", slips: { 1: "That says where, not how they feel.", 2: "That does not show anger." } },
      why: "Slamming a door is a loud, cross action. That is the proof.",
      lv: { medium: { options: ["\"folded their arms and stared at the wall\"", "\"walked into [[place]]\"", "\"When someone asked if they were OK\""],
              slips: { 1: "Walking into a room does not show a feeling.", 2: "That is what someone else did. Look at what [[who]] does." },
              why: "Folded arms and staring at the wall are body language that shows they are cross." },
            spicy: { q: "Which detail is the <b>strongest</b> proof that [[who]] is nervous?",
              options: ["\"They checked their [[thing]] three times, then checked it again.\"", "\"arrived at [[place]] ten minutes early\"", "\"when someone said hello\""],
              slips: { 1: "Arriving early could just mean they are keen or organised. It is weaker proof.", 2: "That is what someone else did. The clue is in how [[who]] reacts." },
              why: "Checking again and again only really makes sense if they are worried. Strong proof points to one idea and nothing else." } } },

    { type: "text", topic: "Clue and idea",
      q: "Copy some words from the text that show how [[who]] is feeling.",
      need: [["slam", "threw", "throw", "stomp", "fold", "stared", "shrug"]],
      model: "They slammed the door.",
      slips: [[["happy", "excited", "sad", "sleepy"], "That is a feeling word. The question wants words copied from the text."]],
      hint: "Look back at the text. Copy the action that shows the feeling.",
      ez: { q: "Copy words from the text that show how [[who]] feels.", hint: "Copy the action.", why: "Any action works, like <b>slammed the door</b>.", slips: [[null, "That is a feeling word. Copy words from the text."]] },
      why: "Any of the actions works: <b>stomped</b>, <b>slammed the door</b>, <b>threw their [[thing]]</b>.",
      lv: { spicy: { q: "Copy a <b>different</b> detail from the text that also shows [[who]] is nervous.",
        need: [["glanc", "clock", "jump", "check"]],
        model: "Every few seconds they glanced at the clock.",
        slips: [[["early"], "Arriving early is weaker proof. Find something they keep doing, or how they react."]],
        hint: "Look at the last sentence.",
        why: "<b>Glanced at the clock</b> and <b>they jumped</b> both show nerves." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Pick the best proof", title: "Some clues prove more than others",
      fig: STRENGTH,
      html: "<p>Not every detail proves your idea. The best proof points to <b>your idea and nothing else</b>.</p>" + EMPTY.mild +
        "<p>Idea: nobody has been here for years. A calendar from 1999 proves that much better than \"silent\": a room can be silent for one night.</p>",
      ez: { title: "The best proof", html: "<p>The best proof points to <b>your idea</b> only.</p>" + EMPTY.mild },
      lv: { medium: { html: "<p>Not every detail proves your idea. The best proof points to <b>your idea and nothing else</b>.</p>" + EMPTY.medium +
              "<p>Idea: nobody has been here for years. Which details prove it, and which ones would not?</p>" },
            spicy: { html: "<p>The strongest evidence is <b>specific</b> and points to your idea and <b>nothing else</b>. Weaker evidence fits other ideas too.</p>" + EMPTY.spicy +
              "<p>Read carefully. One detail here does not fit the idea that the place is abandoned. A good barrister notices that too.</p>" } } },

    { type: "mc", topic: "Pick the best proof",
      q: "What can you work out about [[old]]?",
      options: ["Nobody has been there for a long time.", "It is busy every day.", "It was built last week."], answer: 0,
      slips: { 1: "Busy places do not have thick dust and cobwebs.", 2: "A calendar from 1999 is a clue it has been there much longer." },
      hint: "Think about the dust, the calendar and the cobwebs.",
      ez: { hint: "Look at the dust, calendar and cobwebs.", why: "Dust, an old calendar, cobwebs. Nobody for <b>a long time</b>.", slips: { 1: "Busy places have no thick dust.", 2: "The calendar says 1999." } },
      why: "Dust, an old calendar and cobwebs all point to a place nobody has used for a long time.",
      lv: { medium: { q: "Look at the footprints. What could you work out from them?",
              options: ["Somebody has been there once, recently.", "Lots of people visit every day.", "Nobody has ever been there."],
              slips: { 1: "Lots of visitors would mean lots of footprints, and less dust.", 2: "Footprints prove somebody has been. Just one set, though." },
              hint: "How many sets of footprints are there, and what are they in?",
              why: "A <b>single</b> set of footprints in thick dust suggests one recent visitor in an otherwise empty place." },
            spicy: { q: "Which detail does <b>not</b> fit the idea that the place has been abandoned for years?",
              options: ["\"the hum of the strip lights\"", "\"its corner curled and yellow\"", "\"Cobwebs stretched across every doorway, unbroken\"", "\"the clock above the desk had stopped\""],
              slips: { 1: "Old paper curls and yellows: that fits years of being left.", 2: "Unbroken cobwebs mean nobody has walked through. That fits.", 3: "A stopped clock that nobody fixed fits being left alone." },
              hint: "Which detail suggests something is still working?",
              why: "Lights that still hum mean someone is still paying for the power. Strong readers notice the detail that does not fit." } } },

    { type: "multi", topic: "Pick the best proof",
      q: "Pick the <b>two</b> details that best prove nobody has been there for years.",
      options: ["A calendar still said March 1999.", "Dust lay thick on the [[dusty]].", "It was silent.", "There was a door."], answers: [0, 1],
      hint: "Which ones take a long time to happen?",
      ez: { q: "Pick <b>2</b> details that prove nobody has been there for years.", hint: "Which ones take a long time?", why: "An old calendar and thick dust take <b>years</b>." },
      why: "An old calendar and thick dust both take years. Silence and a door could be anywhere.",
      lv: { medium: { options: ["A calendar still showed March 1999.", "Cobwebs hung across every doorway, unbroken.", "The corridor was silent.", "A single set of footprints led away."],
              why: "The old calendar and the unbroken cobwebs prove nobody has been in or out for years. The footprints actually suggest someone has." },
            spicy: { q: "Pick the <b>two</b> most specific details that prove it has been left for years.",
              options: ["A calendar still showed March 1999, its corner curled and yellow.", "Cobwebs stretched across every doorway, unbroken.", "The corridor was silent.", "There was a desk."],
              why: "A dated calendar gone yellow and unbroken cobwebs are specific. Silent and a desk fit lots of ideas." } } },

    { type: "sort", topic: "Pick the best proof",
      q: "Sort the details. Do they prove nobody has been there for years?",
      buckets: ["Proves it", "Does not prove it"],
      cards: [["Thick dust", 0], ["A calendar from 1999", 0], ["Cobwebs across the door", 0], ["It was silent", 1], ["There was a [[dusty]]", 1]],
      hint: "Ask: would this only happen if nobody had been there for years?",
      ez: { q: "Does it prove nobody has been there for years?", hint: "Would it only happen after years?", why: "Dust, the calendar and cobwebs take time. Silence does not." },
      why: "Dust, the old calendar and cobwebs build up over time. Silence and the [[dusty]] being there do not prove anything about time.",
      lv: { spicy: { buckets: ["Strong proof", "Weak proof", "Points the other way"],
        cards: [["Calendar showing March 1999", 0], ["Clock stopped at ten past four", 0], ["Unbroken cobwebs", 0], ["It was silent", 1], ["There was a [[dusty]]", 1], ["The strip lights hum", 2]],
        why: "Dated, specific details are strong. Silence and furniture are weak. Humming lights point the other way: the power is still on." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Point, evidence, explain", title: "The proof burger",
      fig: BURGER,
      html: "<p>When you write your proof down, build it like a burger:</p>" +
        "<p><b>Point</b>: say your idea. <b>Evidence</b>: copy the words from the text, in speech marks. <b>Explain</b>: say how those words show your idea.</p>" +
        "<p class=\"a2task\"><b>Worked example</b><br>Point: I think nobody has been to [[old]] for years.<br>Evidence: It says \"a calendar on the wall still showed March 1999\".<br>Explain: This shows nobody has turned the page since 1999, so the place has been empty all that time.</p>",
      ez: { title: "Idea, because, proof", html: "<p><b>My idea</b>, because it says <b>\"words from the text\"</b>.</p><p class=\"a2task\">Nobody has been there, because it says \"dust lay thick\".</p>" },
      lv: { mild: { html: "<p>When you write your proof down, use two parts joined by <b>because</b>:</p>" +
              "<p><b>My idea</b>, because it says <b>\"the words from the text\"</b>.</p>" +
              "<p class=\"a2task\"><b>Worked example</b><br>I think nobody has been there for years, because it says \"dust lay thick on the [[dusty]]\".</p>" +
              "<p>The words from the text go in speech marks.</p>" },
            spicy: { html: "<p>Build your proof like a burger: <b>Point</b>, <b>Evidence</b> (short, exact quotation), <b>Explain</b>.</p>" +
              "<p>To make the explain really strong, <b>zoom in on one word</b> and say what it suggests.</p>" +
              "<p class=\"a2task\"><b>Worked example</b><br>Point: [[Old]] has been abandoned for years.<br>Evidence: The cobwebs are \"unbroken\".<br>Explain: \"Unbroken\" suggests not a single person has walked through any doorway, because one visitor would have torn them. The word makes the emptiness total.</p>" } } },

    { type: "order", topic: "Point, evidence, explain",
      q: "Put the proof burger together. Top bun first.",
      items: ["I think [[who]] was angry.", "It says they \"slammed the door\".", "This shows they were cross, because people slam doors when they are in a temper."],
      hint: "Idea first, then the words from the text, then how they show it.",
      ez: { q: "Build the proof. Top bun first.", hint: "Idea, because, then the words." },
      why: "Point, evidence, explain. The evidence sits in the middle, like the filling.",
      lv: { mild: { items: ["I think [[who]] was angry,", "because it says", "\"they slammed the door\"."],
              hint: "Idea first, then because, then the words from the text.",
              why: "Idea, because, then the proof in speech marks." },
            spicy: { items: ["[[Who]] is nervous before anything has even started.", "They \"checked their [[thing]] three times, then checked it again\".", "Checking again after three checks shows they cannot trust themselves to be ready: the repetition shows worry, not organisation.", "The word \"again\" makes it feel like a loop they cannot get out of."],
              hint: "Point, evidence, explain, then zoom in on one word.",
              why: "Point, evidence, explain, then a zoom on a single word to finish strongly." } } },

    { type: "match", topic: "Point, evidence, explain",
      q: "Match each part of the proof to its job.",
      pairs: [["I think nobody has been there for years.", "Point: my idea"], ["It says \"cobwebs hung across every doorway\".", "Evidence: words from the text"], ["This shows nobody has walked through, or the cobwebs would be broken.", "Explain: how the proof shows it"]],
      hint: "Which one has speech marks? That is the evidence.",
      ez: { q: "Match each part to its job.", hint: "Speech marks show the proof." },
      why: "The point is your idea, the evidence is copied from the text, and the explain joins them up.",
      lv: { mild: { pairs: [["I think nobody has been there for years", "My idea"], ["\"Dust lay thick\"", "Proof from the text"], ["because", "The word that joins them"]],
              why: "Your idea, then because, then the proof in speech marks." },
            spicy: { pairs: [["The place has been abandoned for years.", "Point"], ["The cobwebs are \"unbroken\".", "Evidence"], ["Nobody has walked through, or they would be torn.", "Explain"], ["\"Unbroken\" makes the emptiness feel total.", "Zoom on a word"]] } } },

    { type: "mc", topic: "Point, evidence, explain",
      q: "Which is the best <b>explain</b> to finish this proof?<p class=\"a2task\">Point: I think nobody has been there for years. Evidence: It says \"a calendar on the wall still showed March 1999\".</p>",
      options: ["This shows nobody has changed the calendar since 1999, so the place has been empty all that time.", "The calendar showed March 1999.", "I like calendars."], answer: 0,
      slips: { 1: "That repeats the evidence. The explain says what it shows.", 2: "That is about you, not the text." },
      hint: "The explain starts \"This shows...\" and links back to the idea.",
      ez: { hint: "Look for speech marks.", slips: { 1: "That is the idea again.", 2: "True, but it proves nothing." } },
      why: "A good explain says how the evidence proves the point: the calendar was never changed, so nobody was there.",
      lv: { mild: { q: "Which is the best way to finish this?<p class=\"a2task\">I think nobody has been there for years, because...</p>",
              options: ["it says \"dust lay thick on the [[dusty]]\".", "I think so.", "it is a story."],
              slips: { 1: "That is just the idea again. Use words from the text.", 2: "True, but it does not prove anything. Find words from the text." },
              hint: "Look for speech marks: words copied from the text.",
              why: "Words copied from the text are the proof." },
            spicy: { q: "Which explain zooms in best on a word?<p class=\"a2task\">Point: [[Who]] is nervous. Evidence: They \"glanced at the clock\" every few seconds.</p>",
              options: ["\"Glanced\" suggests quick, darting looks, as if they cannot stop themselves, which shows anxious waiting.", "This shows they looked at the clock.", "Clocks tell you the time, so they wanted to know the time.", "This proves they are nervous because it says so."],
              slips: { 1: "That repeats the evidence instead of explaining it.", 2: "That is true of anyone. Link it to the feeling.", 3: "The text never says nervous. Explain how the words show it." },
              hint: "Pick the one that says what a single word suggests.",
              why: "Zooming in on \"glanced\" shows how the writer makes the nerves feel quick and restless." } } },

    { type: "text", topic: "Point, evidence, explain", explain: true,
      q: "Finish the explain, if you like.<p class=\"a2task\">Point: I think [[who]] was angry. Evidence: It says they \"slammed the door\". Explain: This shows...</p>",
      need: [["angry", "cross", "mad", "furious", "upset", "annoyed", "temper", "rage", "hard", "loud", "force"]],
      model: "This shows they were angry, because people slam doors when they are cross.",
      slips: [[["slammed the door"], "That repeats the evidence. Say what slamming shows about how they feel."]],
      hint: "What does slamming a door tell you about how someone feels?",
      ez: { why: "Any action proves it, like <b>slammed the door</b>.", slips: [[null, "That is the idea again. Copy words from the text."]] },
      why: "The explain links the evidence back to the idea: slamming is loud and forceful, which is what people do when they are angry.",
      lv: { mild: { q: "Finish the proof.<p class=\"a2task\">I think [[who]] was angry, because it says...</p>",
              need: [["slam", "threw", "throw", "stomp"]],
              model: "\"they slammed the door\".",
              slips: [[["angry", "cross", "mad"], "That is the idea again. Copy words from the text that prove it."]],
              hint: "Copy an action from the text.",
              why: "Any of the actions proves it: <b>slammed the door</b>, <b>stomped</b>, <b>threw their [[thing]]</b>." },
            spicy: { q: "Zoom in. Why is \"slammed\" stronger proof of anger than \"closed\" would be?",
              need: [["loud", "hard", "force", "violent", "bang", "noise", "aggress", "angr", "temper", "rough"]],
              model: "Slammed means shut hard and loud, which suggests force and temper, but closed could be calm.",
              slips: [[["it says"], "Go beyond what it says. What does the word make you picture or hear?"]],
              hint: "What do you hear and picture with \"slammed\"? And with \"closed\"?",
              why: "\"Slammed\" brings noise and force; \"closed\" is neutral. The writer's word choice does the proving." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Prove it yourself", title: "Your turn to prove it",
      fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay with a speech bubble saying prove it">' + A.jay(120, 54, 0.95, "wink") + A.bubble(190, 14, 150, 52, "Go on then.\nProve it.", 200) +
        A.bonnie(330, 112, 0.6, "sit") + '</svg>',
      html: "<p>Last one. Here is a short moment. Read it, decide what you think, then prove it.</p>" + EDGE.medium,
      ez: { title: "Your turn", html: "<p>Read it. What do you think? Prove it.</p>" + EDGE.mild },
      lv: { mild: { html: "<p>Last one. Read it, decide what you think, then prove it.</p>" + EDGE.mild },
            spicy: { html: "<p>Last one. Here is a moment where something <b>changes</b>. Read it closely, then build your proof.</p>" + EDGE.spicy } } },

    { type: "mc", topic: "Prove it yourself",
      q: "How does [[who]] feel at the <b>start</b>?",
      options: ["Nervous", "Bored", "Angry"], answer: 0,
      slips: { 1: "Bored people do not tremble or have a dry mouth.", 2: "Nothing is slammed or thrown. Shaking knees and a dry mouth are signs of something else." },
      hint: "What makes knees shake and mouths go dry?",
      ez: { hint: "Why do knees shake?", why: "Shaking knees and a dry mouth: <b>nervous</b>.", slips: { 1: "Bored people do not shake.", 2: "Nothing is slammed. Shaking knees mean something else." } },
      why: "Shaking knees and a dry mouth are signs of being <b>nervous</b>.",
      lv: { spicy: { q: "How do [[who]]'s feelings <b>change</b>?",
        options: ["From nervous to confident", "From confident to nervous", "From angry to calm", "They stay nervous the whole time"],
        slips: { 1: "Look at the order. The white knuckles come first, the grin comes last.", 2: "Nothing suggests anger. Gripping tight and short breaths show fear.", 3: "Something changes after [[moment]]. Look at the shoulders and chin." },
        hint: "Compare the first sentence with the last.",
        why: "White knuckles and shallow breaths at the start; dropped shoulders, lifted chin and a grin at the end. <b>Nervous to confident</b>." } } },

    { type: "text", topic: "Prove it yourself",
      q: "Copy a detail from the text that proves they are nervous at the start.",
      need: [["knee", "dry", "mouth", "wiping", "trembl", "shak", "grip", "knuckle", "breath", "shallow", "did not seem to hear"]],
      model: "Their knees were trembling.",
      slips: [[["grin", "smile", "shoulders", "chin"], "That is from the end, after the change. Look at the start."]],
      hint: "Look at the first two sentences.",
      ez: { q: "Copy a detail that shows they are nervous at the start.", hint: "Look at the first 2 sentences.", why: "<b>Knees shaking</b> or a <b>dry mouth</b> show nerves.", slips: [[null, "That is from the end. Look at the start."]] },
      why: "<b>Knees trembling</b>, a <b>dry mouth</b>, and wiping their hands all show nerves.",
      lv: { mild: { model: "Their knees were shaking." },
            spicy: { q: "Copy the detail that best proves they have <b>stopped</b> being nervous.",
              need: [["shoulders", "chin", "grin", "dropped", "lifted"]],
              model: "Their shoulders dropped, their chin lifted.",
              slips: [[["knuckle", "breath", "grip"], "That is from before the change. Look after [[moment]]."]],
              hint: "Look after the word \"changed\".",
              why: "<b>Shoulders dropped</b> and <b>chin lifted</b> show the tension leaving them." } } },

    { type: "write", topic: "Prove it yourself",
      q: "Write your own proof about [[who]]. Use the starters if you like. It goes to Jay only if you choose to send it.",
      ez: { q: "Write your own proof about [[who]]. Use the starters if you like." },
      starters: ["I think [[who]] is...", "It says \"...\"", "This shows..."],
      checklist: ["I said my idea", "I copied words from the text in speech marks", "I explained how the words show my idea"],
      minWords: 25,
      lv: { mild: { starters: ["I think [[who]] is...", "because it says \"...\""], checklist: ["I said my idea", "I copied words from the text in speech marks"], minWords: 10 },
            spicy: { q: "Write a proof about how [[who]] changes. Use two pieces of evidence, one from before the change and one from after, and zoom in on a word if you can. It goes to Jay only if you choose to send it.",
              starters: ["At first, [[who]]...", "This is shown when...", "The word \"...\" suggests...", "By the end..."],
              checklist: ["Point about the change", "Evidence from before and after", "Explain for each", "A zoom on one word"], minWords: 50 } } }
  ],

  ez: {
    realWorld: { title: "Proof is everywhere", html: "<p>Job interviews ask for proof. So do good arguments.</p><p>Should we time travel? Make your point, then prove it.</p>" },
    make: { intro: "Pick a text. Fill in your point, evidence and explain." }
  },
  realWorld: {
    title: "Proof is everywhere",
    html: "<p>\"Give an example of a time when...\" is one of the most common job interview questions. It is point, evidence, explain. So is a good complaint, a strong argument with a friend, or a review that people actually trust.</p>" +
      "<p>Try it on our big question: <b>if we could time travel, should we?</b> Whatever you think, make your point, give your evidence, and explain it.</p>",
    fig: '<svg viewBox="0 0 420 140" role="img" aria-label="Jay by a time portal, asking for proof">' + A.portal(80, 70, 56) + A.jay(250, 50, 0.85, "hmm") +
      A.bubble(296, 4, 120, 52, "Should we?\nProve it.", 300) + '</svg>'
  },

  make: {
    title: "Make a proof card",
    intro: "Pick any text you like, or the big question. Fill in the burger: your point, your evidence and your explain. Keep it, or send it to Jay.",
    fields: [
      { id: "point", label: "Point: my idea", ph: "I think the striker is nervous.", max: 70 },
      { id: "evidence", label: "Evidence: words from the text", ph: "It says 'their knees were trembling'.", max: 70 },
      { id: "explain", label: "Explain: how it shows my idea", ph: "Trembling knees happen when you are scared of what is coming.", max: 90 },
      { id: "name", label: "Proved by", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      function wrap(t, n, most){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if(!x) return; while(x.length > n){ if(cur.trim()){ out.push(cur.trim()); cur = ""; } out.push(x.slice(0, n)); x = x.slice(n); } if((cur + " " + x).trim().length > n){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, most); }
      function block(y, h, fill, label, col, text, n){
        var ls = wrap(text, n, 3);
        return '<rect x="40" y="' + y + '" width="520" height="' + h + '" rx="18" fill="' + fill + '" stroke="#141a33" stroke-width="3"/>' +
          '<text x="62" y="' + (y + 28) + '" ' + F + ' font-size="15" font-weight="700" fill="' + col + '" letter-spacing="2">' + label + '</text>' +
          ls.map(function(l, k){ return '<text x="62" y="' + (y + 54 + k * 24) + '" ' + F + ' font-size="18" fill="#141a33">' + esc(l) + '</text>'; }).join("");
      }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 460">' +
        '<rect width="600" height="460" rx="24" fill="#fff7e6"/>' +
        '<text x="300" y="36" text-anchor="middle" ' + F + ' font-size="20" font-weight="700" fill="#141a33">PROVED IT</text>' +
        block(52, 106, "#f2c38a", "POINT", "#a8321f", v.point, 44) +
        block(168, 106, "#d8f0c8", "EVIDENCE", "#1f5fa8", v.evidence, 44) +
        block(284, 130, "#f2c38a", "EXPLAIN", "#1f7a4d", v.explain, 44) +
        '<text x="560" y="444" text-anchor="end" ' + F + ' font-size="15" fill="#5b6180">Proved by ' + esc(v.name) + '</text>' +
        '</svg>';
    }
  }
};
})();
