/* Base 5 Autumn 2 activity: Whose side?
   English. Spotting whose point of view is in a text, the two sides of
   an argument, and the words that show which side a writer is on.
   ASCII only. */
(function(){
var FF = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, size, txt, col, extra){ return '<text x="' + x + '" y="' + y + '" ' + FF + ' font-size="' + size + '" fill="' + (col || "#141a33") + '"' + (extra || "") + '>' + txt + '</text>'; }
var B = ' font-weight="700"', MID = ' text-anchor="middle"';

/* a simple person: x, y, shirt colour, hair colour, mood (1 happy, 0 flat, -1 worried) */
function person(x, y, shirt, hair, mood){
  var m = mood > 0 ? '<path d="M-9 10q9 8 18 0" stroke="#3b2414" stroke-width="3" fill="none" stroke-linecap="round"/>' :
    mood < 0 ? '<path d="M-9 14q9 -7 18 0" stroke="#3b2414" stroke-width="3" fill="none" stroke-linecap="round"/>' :
    '<path d="M-8 12h16" stroke="#3b2414" stroke-width="3" stroke-linecap="round"/>';
  return '<g transform="translate(' + x + ' ' + y + ')"><path d="M-32 64q0 -32 32 -34q32 2 32 34z" fill="' + shirt + '"/>' +
    '<circle r="24" fill="#f2c7a2"/><path d="M-24 -4q-2 -24 24 -24q26 0 24 24q-8 -12 -24 -12q-16 0 -24 12z" fill="' + hair + '"/>' +
    '<circle cx="-8" cy="0" r="3" fill="#1b1b1b"/><circle cx="8" cy="0" r="3" fill="#1b1b1b"/>' + m + '</g>';
}

/* three voices about one plan */
var VOICES =
  '<svg viewBox="0 0 540 250" role="img" aria-label="Three people with speech bubbles giving different views about a plan">' +
  '<rect width="540" height="250" rx="16" fill="#f4f1ea"/>' +
  person(90, 170, "#2f6f8f", "#2a2a2a", 1) + person(270, 170, "#19c39a", "#c98a3a", 1) + person(450, 170, "#ff7a45", "#7a4c2c", -1) +
  T(90, 246, 13, 'the boss', "#141a33", B + MID) + T(270, 246, 13, 'a fan', "#141a33", B + MID) + T(450, 246, 13, 'a neighbour', "#141a33", B + MID) +
  A2ART.bubble(14, 14, 156, 70, "It will bring\nin visitors!", 80) +
  A2ART.bubble(196, 14, 150, 70, "I cannot\nwait!", 262) +
  A2ART.bubble(372, 14, 156, 70, "Too noisy.\nNobody asked us.", 440) +
  '</svg>';

/* a see saw with for and against */
var SEESAW =
  '<svg viewBox="0 0 520 210" role="img" aria-label="A see saw with reasons for on one side and reasons against on the other">' +
  '<rect width="520" height="210" rx="16" fill="#eef6ff"/>' +
  '<path d="M260 150l-30 46h60z" fill="#5b6180"/>' +
  '<g transform="rotate(-6 260 150)"><rect x="50" y="142" width="420" height="14" rx="7" fill="#c99a63" stroke="#7a5532" stroke-width="2"/>' +
  '<rect x="70" y="92" width="150" height="48" rx="10" fill="#19c39a" fill-opacity=".35" stroke="#0f7a5f" stroke-width="2.5"/>' + T(145, 123, 17, 'FOR', "#0f7a5f", B + MID) +
  '<rect x="300" y="92" width="150" height="48" rx="10" fill="#ff5d8f" fill-opacity=".35" stroke="#d63c6c" stroke-width="2.5"/>' + T(375, 123, 17, 'AGAINST', "#d63c6c", B + MID) + '</g>' +
  T(260, 34, 16, 'Two sides of one argument', "#141a33", B + MID) +
  T(260, 60, 13, 'Each side has reasons. Weigh them up.', "#5b6180", MID) +
  A2ART.egg(A2ART.bird(476, 120, 0.7, "#ff5d5d"), "A bird sitting on the fence. Jay says that is allowed, sometimes.") +
  '</svg>';

/* two headlines, one story */
var HEADS =
  '<svg viewBox="0 0 540 220" role="img" aria-label="Two newspaper headlines about the same plan, one excited and one angry">' +
  '<rect width="540" height="220" rx="16" fill="#f4f1ea"/>' +
  '<g transform="rotate(-2 135 110)"><rect x="20" y="24" width="230" height="170" rx="6" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
  T(135, 52, 13, 'THE TOWN CRIER', "#5b6180", B + MID) + '<path d="M36 62h198" stroke="#141a33" stroke-width="2"/>' +
  T(135, 92, 19, 'Exciting plan', "#0f7a5f", B + MID) + T(135, 118, 19, 'to save town', "#0f7a5f", B + MID) +
  '<rect x="40" y="134" width="190" height="8" rx="3" fill="#e6e1d2"/><rect x="40" y="150" width="160" height="8" rx="3" fill="#e6e1d2"/><rect x="40" y="166" width="176" height="8" rx="3" fill="#e6e1d2"/></g>' +
  '<g transform="rotate(2 405 110)"><rect x="290" y="24" width="230" height="170" rx="6" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
  T(405, 52, 13, 'THE TOWN TIMES', "#5b6180", B + MID) + '<path d="M306 62h198" stroke="#141a33" stroke-width="2"/>' +
  T(405, 92, 19, 'Fury over', "#d63c6c", B + MID) + T(405, 118, 19, 'noisy scheme', "#d63c6c", B + MID) +
  '<rect x="310" y="134" width="190" height="8" rx="3" fill="#e6e1d2"/><rect x="310" y="150" width="160" height="8" rx="3" fill="#e6e1d2"/><rect x="310" y="166" width="176" height="8" rx="3" fill="#e6e1d2"/></g>' +
  T(270, 214, 13, 'same plan, two sides', "#5b6180", MID) +
  '</svg>';

/* the longer article for chunk 4 */
var ART = {
  mild: "<p class=\"a2task\"><b>Big plan for [[place]]</b><br>[[Place]] wants to [[change]]. [[Boss]] said, \"This will bring in lots of new visitors.\" [[Fan]] said, \"I cannot wait!\" But [[neighbour]] said, \"It will be too noisy.\" The town will vote in March.</p>",
  medium: "<p class=\"a2task\"><b>Big plan for [[place]]</b><br>[[Place]] wants to [[change]]. [[Boss]] said, \"This will bring hundreds of new visitors and keep [[place]] going for years.\" [[Fan]] agreed: \"I cannot wait. It is exactly what we need.\" " +
    "But not everyone is happy. [[Neighbour]] said, \"It will be noisy and busy, and nobody asked us.\" A council officer said the plan would cost 2 million pounds. The town will vote in March.</p>",
  spicy: "<p class=\"a2task\"><b>Residents fear for peace and quiet</b><br>[[Place]] has announced a controversial scheme to [[change]]. [[Boss]] claimed it would \"bring hundreds of new visitors\", though no figures have been published. " +
    "[[Fan]] was predictably delighted. However, [[neighbour]], who has lived nearby for 40 years, said quietly, \"Nobody asked us. Once it is done, it cannot be undone.\" The 2 million pound plan goes to a vote in March. Whether the town will be listening is another matter.</p>"
};

(window.A2PACKS = window.A2PACKS || {})["whose-side"] = {
  a2: true,
  id: "a2-whose-side",
  title: "Whose side?",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "Whose view is it? What are the two sides? Which side is the writer on?",
  blurb: "Spotting whose point of view you are reading, the two sides of an argument, and the little words that show which side a writer is on. Four short chunks, with a two sides card to make at the end.",
  note: "Points of view: whose view it is, the two sides of an argument, and which side the writer is on. Four five minute chunks and a two sides card to make. Have a go if you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Bystander", line: "Bystander: clear speech bubbles, one view at a time." },
    { id: "medium", name: "Referee", line: "Referee: articles with more than one view, and both sides of an argument." },
    { id: "spicy", name: "Judge and jury", line: "Judge and jury: sneaky word choices and writers who take a side without saying so." }
  ],
  themes: {
    time: { name: "Time travel", w: { place: "the time museum", change: "open a time portal to 1850", boss: "the museum boss", fan: "a history fan", neighbour: "a neighbour", crowd: "visitors" } },
    football: { name: "Football", w: { place: "the town football club", change: "build a bigger stadium on the park", boss: "the club chairman", fan: "a season ticket holder", neighbour: "a local dog walker", crowd: "fans" } },
    horror: { name: "Horror", w: { place: "the old hospital", change: "run ghost tours every night", boss: "the tour company owner", fan: "a ghost hunter", neighbour: "a neighbour next door", crowd: "ghost hunters" } },
    fishing: { name: "Fishing", w: { place: "the lake", change: "let speedboats use the water", boss: "the lake owner", fan: "a speedboat owner", neighbour: "a local angler", crowd: "boaters" } },
    music: { name: "Music", w: { place: "the old theatre", change: "swap the seats for a standing area", boss: "the theatre manager", fan: "a young gig goer", neighbour: "an older regular", crowd: "gig goers" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: VOICES,
  steps: [

    /* ---------- chunk 1: whose view? ---------- */
    { type: "learn", topic: "Whose view?", title: "A point of view belongs to someone",
      fig: VOICES,
      html: "<p>A <b>point of view</b> is how one person sees something. Different people can look at the same plan and see it very differently.</p>" +
        "<p>The plan: <b>[[Place]] wants to [[change]]</b>.</p>" +
        "<p>To find whose view it is, look for <b>who is speaking</b>: speech marks, a name, or words like <b>said</b> and <b>thinks</b>.</p>",
      ez: { title: "Whose view?", html: "<p>A <b>point of view</b> is how one person sees it.</p><p>Look for <b>who is speaking</b>.</p>" },
      lv: { spicy: { html: "<p>A <b>point of view</b> is how one person sees something. Different people can look at the same plan and see it very differently.</p>" +
        "<p>The plan: <b>[[Place]] wants to [[change]]</b>.</p>" +
        "<p>Look for who is speaking: speech marks, <b>according to</b>, <b>claimed</b>, <b>argued</b>. Then ask a sharper question: <b>what do they gain or lose?</b> Where someone stands often shapes what they see.</p>" } } },

    { type: "mc", topic: "Whose view?",
      q: "Look at the picture. Who is <b>against</b> the plan?",
      fig: VOICES,
      options: ["The neighbour", "The boss", "The fan"],
      answer: 0,
      slips: { 1: "The boss thinks it will bring in visitors. That is for the plan.", 2: "The fan cannot wait. That is for the plan." },
      hint: "Who sounds worried?",
      ez: { q: "Who is <b>against</b> the plan?", why: "The neighbour says it is too noisy. <b>Against</b>.", slips: { 1: "The boss wants visitors. That is for.", 2: "The fan cannot wait. That is for." } },
      why: "The neighbour says it is too noisy and nobody asked them. That is a view against the plan." },

    { type: "match", topic: "Whose view?",
      q: "Match each person to their point of view.",
      pairs: [["[[Boss]]", "It will bring in visitors and money."], ["[[Fan]]", "It will be really exciting."], ["[[Neighbour]]", "It will be noisy, and nobody asked."]],
      hint: "Think about how each person would feel about the plan.",
      ez: { q: "Match each person to their view.", hint: "How would each one feel?", why: "The boss wants visitors. The fan wants fun. The neighbour wants quiet." },
      why: "Each person sees the plan from where they stand: the boss wants visitors, the fan wants excitement, the neighbour wants quiet.",
      lv: { spicy: { q: "Match each person to what they might gain or lose.",
        pairs: [["[[Boss]]", "Gains money and keeps the business going."], ["[[Fan]]", "Gains something exciting to do."], ["[[Neighbour]]", "Loses peace and quiet."], ["A council officer", "Has to check the cost is fair."]],
        hint: "Who earns from it, who enjoys it, who has to live with it, and who has to pay for it?",
        why: "Where someone stands shapes their view. That does not make them wrong, but it helps you weigh up what they say." } } },

    { type: "mc", topic: "Whose view?", explain: true,
      q: "Why might [[boss]] be keen on the plan?",
      options: ["It would help their business.", "They are the neighbour.", "They have never heard of it."],
      answer: 0,
      slips: { 1: "Have another look: the boss and the neighbour are different people.", 2: "The boss is the one making the plan, so they know all about it." },
      hint: "What does the boss want more of?",
      ez: { hint: "Pleased or worried?", why: "<b>For it</b>. They want visitors.", slips: { 1: "The boss wants visitors. That sounds pleased." } },
      why: "More visitors means more money for [[place]]. That helps explain the boss's point of view.",
      lv: {
        mild: { q: "Is [[boss]] for or against the plan?", options: ["For it", "Against it"], fixed: true,
          slips: { 1: "The boss says it will bring in visitors. That sounds pleased." },
          hint: "Does the boss sound pleased or worried?",
          why: "The boss is for it. They think it will bring in visitors." },
        spicy: { q: "[[Boss]] says the plan will bring hundreds of visitors. Why should a reader be a little careful with that?",
          options: ["The boss gains from the plan, so they may make it sound better than it is.", "Bosses always tell lies.", "Hundreds is too big a number to be real."],
          slips: { 1: "That is too strong. The boss may be right; we just know they have a reason to sound keen.", 2: "Hundreds of visitors is possible. The question is whether we have proof." },
          hint: "Think about what the boss gains.",
          why: "The boss has something to gain, so their view may lean one way. A careful reader looks for proof, like figures." } } },

    /* ---------- chunk 2: two sides ---------- */
    { type: "learn", topic: "Two sides", title: "Every argument has two sides",
      fig: SEESAW,
      html: "<p>An argument usually has <b>two sides</b>: the people <b>for</b> something and the people <b>against</b> it.</p>" +
        "<p>Each side gives <b>reasons</b>. A <b>balanced</b> text gives both sides. A <b>one sided</b> text only gives one.</p>",
      ez: { title: "Two sides", html: "<p>An argument has <b>two sides</b>: <b>for</b> and <b>against</b>.</p><p><b>Balanced</b> means both sides.</p>" },
      lv: { spicy: { html: "<p>An argument usually has <b>two sides</b>: <b>for</b> and <b>against</b>. Each side gives reasons.</p>" +
        "<p>A <b>balanced</b> text gives both sides fairly. A <b>one sided</b> text only gives one. The sneaky middle: a text that mentions both sides but gives one side more space, better quotes or the last word. It looks balanced, but it leans.</p>" } } },

    { type: "sort", topic: "Two sides",
      q: "The plan: [[place]] wants to [[change]]. Sort the reasons.",
      buckets: ["For the plan", "Against the plan"],
      cards: [["It will bring in more [[crowd]].", 0], ["It will be noisy.", 1], ["It will make money for the town.", 0], ["It will cost 2 million pounds.", 1], ["It will create new jobs.", 0], ["Nobody asked the people who live nearby.", 1]],
      hint: "Would the boss say it, or the neighbour?",
      ez: { q: "Sort the reasons: for or against the plan?", hint: "Boss or neighbour?", why: "Visitors and money are <b>for</b>. Noise is <b>against</b>." },
      why: "Visitors, money and jobs are reasons for. Noise, cost and not being asked are reasons against.",
      lv: { mild: { cards: [["It will bring in more [[crowd]].", 0], ["It will be noisy.", 1], ["It will make money for the town.", 0], ["Nobody asked the people who live nearby.", 1]] } } },

    { type: "widget", topic: "Two sides", unscored: true,
      title: "Weigh it up",
      ez: { html: "Tap a reason to put it on the see saw. There is no right answer." },
      html: "Tap a reason to put it on the see saw: once for <b>for</b>, again for <b>against</b>, again to take it off. Give each one a weight: does it matter a little or a lot to you? There is no right answer here.",
      mount: function(el, api){
        var R = ["More [[crowd]] would come.", "It would be noisy at night.", "It makes money for the town.", "It costs 2 million pounds.", "New jobs for local people.", "Nobody asked the neighbours."].map(api.tok);
        var d = api.data;
        if(!d.side) d.side = R.map(function(){ return 0; });
        if(!d.wt) d.wt = R.map(function(){ return 1; });
        var NS = "http://www.w3.org/2000/svg";
        var svgHost = document.createElement("div");
        var list = document.createElement("div");
        list.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:8px;margin:10px 0";
        var out = document.createElement("p");
        var rows = R.map(function(r, k){
          var row = document.createElement("div");
          row.style.cssText = "display:flex;gap:6px;align-items:center;border:2px solid #141a33;border-radius:10px;padding:6px 8px;background:#fff";
          var b = document.createElement("button");
          b.type = "button";
          b.style.cssText = "flex:1;text-align:left;font:inherit;background:none;border:0;color:#141a33;cursor:pointer;padding:4px";
          var w = document.createElement("button");
          w.type = "button";
          w.style.cssText = "font:inherit;font-size:.85rem;border:2px solid #141a33;border-radius:8px;background:#fffbe0;color:#141a33;cursor:pointer;padding:3px 8px;white-space:nowrap";
          b.onclick = function(){ d.side[k] = (d.side[k] + 1) % 3; draw(); api.save(); };
          w.onclick = function(){ d.wt[k] = d.wt[k] === 1 ? 2 : 1; draw(); api.save(); };
          row.appendChild(b); row.appendChild(w); list.appendChild(row);
          return { row: row, b: b, w: w };
        });
        function draw(){
          var f = 0, a = 0;
          rows.forEach(function(r, k){
            var s = d.side[k];
            r.b.innerHTML = (s === 1 ? '<b style="color:#0f7a5f">FOR:</b> ' : s === 2 ? '<b style="color:#d63c6c">AGAINST:</b> ' : "") + R[k];
            r.row.style.background = s === 1 ? "#d4f5ea" : s === 2 ? "#ffe0ea" : "#fff";
            r.w.textContent = d.wt[k] === 2 ? "matters a lot" : "matters a little";
            if(s === 1) f += d.wt[k]; if(s === 2) a += d.wt[k];
          });
          var tilt = Math.max(-12, Math.min(12, (a - f) * 3));
          svgHost.innerHTML = '<svg viewBox="0 0 520 170" role="img" aria-label="A see saw showing the weight of reasons for and against" style="width:100%;max-width:520px;height:auto;display:block;margin:0 auto">' +
            '<rect width="520" height="170" rx="14" fill="#eef6ff"/>' +
            '<path d="M260 120l-26 40h52z" fill="#5b6180"/>' +
            '<g transform="rotate(' + tilt + ' 260 120)"><rect x="50" y="112" width="420" height="12" rx="6" fill="#c99a63" stroke="#7a5532" stroke-width="2"/>' +
            '<rect x="70" y="' + (102 - f * 10) + '" width="140" height="' + (10 + f * 10) + '" rx="6" fill="#19c39a" stroke="#0f7a5f" stroke-width="2"/>' +
            '<rect x="310" y="' + (102 - a * 10) + '" width="140" height="' + (10 + a * 10) + '" rx="6" fill="#ff5d8f" stroke="#d63c6c" stroke-width="2"/></g>' +
            '<text x="140" y="26" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="16" font-weight="700" fill="#0f7a5f">FOR ' + f + '</text>' +
            '<text x="380" y="26" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="16" font-weight="700" fill="#d63c6c">AGAINST ' + a + '</text></svg>';
          var placed = d.side.filter(function(s){ return s > 0; }).length;
          out.innerHTML = placed < 2 ? "Put a few reasons on the see saw." :
            "<b>" + (f > a ? "For wins, for you." : a > f ? "Against wins, for you." : "Perfectly balanced. Tricky one.") + "</b> Someone else might weigh the same reasons differently. That is what a point of view is.";
          if(placed >= 2 && !d.had){ d.had = true; api.save(); api.done("done"); }
        }
        el.appendChild(svgHost); el.appendChild(list); el.appendChild(out);
        draw();
        if(d.had) api.done("done");
      },
      report: function(d){ return d && d.side ? "Weighed up " + d.side.filter(function(s){ return s > 0; }).length + " reasons" : ""; } },

    { type: "mc", topic: "Two sides",
      q: "Which text is <b>balanced</b>?",
      options: ["Some people love the plan because it brings visitors. Others worry about the noise.", "The plan is brilliant. It brings visitors, money and jobs.", "The plan is awful. It is noisy and expensive."],
      answer: 0,
      slips: { 1: "That only gives reasons for. A balanced text gives both sides.", 2: "That only gives reasons against. A balanced text gives both sides." },
      hint: "Which one gives both sides?",
      ez: { q: "Which one is <b>balanced</b>?", why: "It gives a reason for and against.", slips: { 1: "That only gives for.", 2: "That only gives against." } },
      why: "It gives a reason for and a reason against. That is balanced.",
      lv: { spicy: { q: "Which text <b>looks</b> balanced but actually leans to one side?",
        options: ["A few people moaned about noise. But the plan will bring hundreds of visitors, new jobs and a brighter future for everyone.", "Some people love the plan because it brings visitors. Others worry about the noise.", "The plan is awful. It is noisy and expensive."],
        slips: { 1: "That one gives each side one reason, fairly. It is genuinely balanced.", 2: "That one does not even look balanced: it only gives one side." },
        hint: "Look at how much space each side gets, and which side gets the last word.",
        why: "It mentions the noise, but calls it moaning and gives it one quick line. The other side gets three reasons and the last word." } } },

    { type: "text", topic: "Two sides",
      q: "Here is a reason <b>for</b> the plan: <b>It will bring in more [[crowd]].</b><br>Write one reason <b>against</b> it.",
      need: [["noise", "noisy", "loud", "busy", "cost", "money", "expensive", "traffic", "parking", "mess", "litter", "nobody", "asked", "quiet", "late", "night", "crowd", "crowded", "spoil", "ruin", "damage", "danger", "dangerous", "unsafe", "pollution", "wildlife", "fish", "park", "rubbish", "neighbours", "people"]],
      model: "It will make the area noisy and busy.",
      hint: "Think about the neighbour. What would worry them?",
      ez: { q: "A reason <b>for</b>: <b>It will bring in more [[crowd]].</b><br>Write a reason <b>against</b>.", hint: "What would worry the neighbour?", why: "Noise, cost or traffic are reasons <b>against</b>." },
      why: "Noise, cost, traffic and mess are all reasons against. Being able to give the other side is a big part of understanding an argument." },

    /* ---------- chunk 3: picking a side with words ---------- */
    { type: "learn", topic: "Words that take a side", title: "Words can take a side",
      fig: HEADS,
      html: "<p>Two newspapers tell the same story. One says <b>exciting plan</b>. The other says <b>noisy scheme</b>.</p>" +
        "<p>Same plan, different words, different side. Words like <b>exciting</b> and <b>save</b> lean <b>for</b>. Words like <b>fury</b>, <b>noisy</b> and <b>scheme</b> lean <b>against</b>.</p>",
      ez: { title: "Words take a side", html: "<p><b>Exciting plan</b> is for. <b>Noisy scheme</b> is against.</p><p>Same plan. Different words.</p>" },
      lv: { spicy: { html: "<p>Two newspapers tell the same story. One says <b>exciting plan to save town</b>. The other says <b>fury over noisy scheme</b>.</p>" +
        "<p>Writers pick a side with <b>loaded words</b>: plan or <b>scheme</b>, crowd or <b>mob</b>, said or <b>claimed</b>, careful or <b>timid</b>. They also choose <b>who gets quoted</b>, <b>who gets the last word</b>, and what goes in the <b>headline</b>.</p>" +
        "<p>Different readers can take different meanings from the same text too: what sounds lively to one person sounds noisy to another.</p>" } } },

    { type: "mc", topic: "Words that take a side",
      q: "Which headline is <b>against</b> the plan?",
      options: ["Fury over noisy scheme", "Exciting plan to save town", "Plan to go to a vote in March"],
      answer: 0,
      slips: { 1: "Exciting and save are positive words. That headline is for the plan.", 2: "That one just gives a fact. It does not take a side." },
      hint: "Look for angry or worried words.",
      ez: { hint: "Look for angry words.", why: "Fury and noisy make it sound <b>bad</b>.", slips: { 1: "Exciting is a happy word. That is for.", 2: "That is just a fact." } },
      why: "Fury, noisy and scheme all make the plan sound bad.",
      lv: { spicy: { q: "Which headline sounds neutral, taking no side?",
        options: ["Plan to go to a vote in March", "Fury over noisy scheme", "Exciting plan to save town", "Brave boss battles moaning neighbours"],
        slips: { 1: "Fury and scheme lean against.", 2: "Exciting and save lean for.", 3: "Brave and moaning are loaded: that leans for." },
        hint: "Which one only gives a fact?",
        why: "A vote in March is just a fact. No loaded words, no side taken." } } },

    { type: "match", topic: "Words that take a side",
      q: "Each pair means nearly the same thing. Match the plain word to the word that sounds <b>against</b>.",
      pairs: [["plan", "scheme"], ["crowd", "mob"], ["said", "claimed"], ["busy", "packed out"]],
      hint: "Which word makes it sound worse?",
      ez: { q: "Match each word to a word that sounds <b>bad</b>.", hint: "Which one sounds worse?", why: "Scheme sounds sneaky. Mob sounds scary." },
      why: "Scheme sounds sneaky, mob sounds dangerous, claimed sounds like it might not be true, and packed out sounds uncomfortable.",
      lv: {
        mild: { q: "Match each plain word to a word that makes it sound <b>bad</b>.", pairs: [["plan", "scheme"], ["crowd", "mob"], ["busy", "packed out"]] },
        spicy: { q: "Match each plain word to a word that makes it sound <b>good</b>.",
          pairs: [["plan", "vision"], ["crowd", "buzzing atmosphere"], ["change", "fresh start"], ["cost", "investment"]],
          hint: "Which phrase makes it sound like something to celebrate?",
          why: "Writers who are for something pick words like vision, investment and fresh start. Same facts, sunnier side." } } },

    { type: "multi", topic: "Words that take a side", explain: true,
      q: "<b>The noisy scheme will bring a mob of [[crowd]] to our quiet streets.</b><br>Pick the words that show the writer is against the plan.",
      options: ["noisy", "scheme", "mob", "will", "streets"],
      answers: [0, 1, 2],
      hint: "Look for the words that make it sound bad.",
      ez: { q: "<b>The noisy plan will ruin our quiet streets.</b><br>Pick the 2 words that sound bad." },
      why: "Noisy, scheme and mob are loaded. Our quiet streets also makes you side with the people living there.",
      lv: {
        mild: { q: "<b>The noisy plan will ruin our quiet streets.</b><br>Pick the words that show the writer does not like the plan.",
          options: ["noisy", "ruin", "plan", "streets"], answers: [0, 1],
          hint: "Two words make it sound bad.",
          why: "Noisy and ruin make the plan sound bad." },
        spicy: { q: "<b>[[Boss]] claimed the scheme would help, though no figures have been published.</b><br>Pick the words and phrases that quietly cast doubt on the boss.",
          options: ["claimed", "scheme", "though no figures have been published", "would help", "[[Boss]]"], answers: [0, 1, 2],
          hint: "Three choices make you trust the boss a little less.",
          why: "Claimed suggests it might not be true, scheme sounds sneaky, and no figures hints there is no proof." } } },

    /* ---------- chunk 4: read it and weigh it up ---------- */
    { type: "learn", topic: "Read it and weigh it up", title: "One article, lots of views",
      html: "<p>Last chunk. Have a read of this news report. Look for whose views are in it, and which side the writer might be on.</p>" + ART.medium,
      ez: { title: "Lots of views", html: "<p>Read this news report. Who is for? Who is against?</p>" + ART.mild },
      lv: { mild: { html: "<p>Last chunk. Have a read of this short news report. Look for who is for the plan and who is against it.</p>" + ART.mild },
            spicy: { html: "<p>Last chunk. Have a read of this report. Look for whose views are in it, and the choices that show the writer's own side, even though they never say it.</p>" + ART.spicy } } },

    { type: "multi", topic: "Read it and weigh it up",
      q: "Pick the <b>two</b> people who are <b>for</b> the plan.",
      options: ["[[Boss]]", "[[Fan]]", "[[Neighbour]]", "A council officer"],
      answers: [0, 1],
      hint: "Who sounds keen?",
      ez: { q: "Pick the <b>2</b> people <b>for</b> the plan.", why: "The boss and the fan are keen." },
      why: "The boss and the fan are both keen. The neighbour is against it. The council officer just gives a fact.",
      lv: { mild: { options: ["[[Boss]]", "[[Fan]]", "[[Neighbour]]"],
        why: "The boss and the fan are both keen. The neighbour is against it." } } },

    { type: "mc", topic: "Read it and weigh it up",
      q: "Is the report balanced?",
      options: ["Yes: it gives people for and against.", "No: it only gives the boss's side.", "No: it only gives the neighbour's side."],
      answer: 0,
      slips: { 1: "Look again: the neighbour gets a say too.", 2: "Look again: the boss and the fan get a say too." },
      hint: "Does it give both sides?",
      ez: { why: "<b>Yes</b>. It gives for and against.", slips: { 1: "The neighbour has a say too.", 2: "The boss and the fan have a say too." } },
      why: "It quotes people for (the boss and the fan) and against (the neighbour), and adds facts like the cost and the vote.",
      lv: { spicy: { q: "Which side does the writer lean towards?",
        options: ["Against: the headline, the loaded words and the last word all favour the neighbour.", "For: the boss is quoted first.", "Neither: the writer only gives facts."],
        slips: { 1: "Being quoted first does not mean being favoured. Look at the headline and the ending.", 2: "Look at controversial, claimed, predictably and the last line. Those are not just facts." },
        hint: "Look at the headline, the verbs (said or claimed) and the very last sentence.",
        why: "Residents fear in the headline, claimed and predictably about the other side, quietly for the neighbour, and the last line all lean against." } } },

    { type: "mc", topic: "Read it and weigh it up",
      q: "Which sentence is a <b>fact</b> in the report, not anyone's view?",
      options: ["The town will vote in March.", "It will be too noisy.", "I cannot wait!"],
      answer: 0,
      slips: { 1: "That is the neighbour's view.", 2: "That is the fan's view." },
      hint: "Which one could you check on a calendar?",
      ez: { q: "Which one is a <b>fact</b>, not a view?", hint: "Which could you check on a calendar?", why: "You can check the vote date. The rest are views." },
      why: "The vote date can be checked. The other two are people's points of view.",
      lv: {
        medium: { options: ["The plan would cost 2 million pounds.", "It will be noisy and busy.", "It is exactly what we need."],
          slips: { 1: "That is the neighbour's view.", 2: "That is the fan's view." },
          hint: "Which one has a figure someone could check?",
          why: "The cost comes from a council officer and can be checked. The other two are views." },
        spicy: { q: "<b>[[Fan]] was predictably delighted.</b> What does <b>predictably</b> do?",
          options: ["It makes the fan's view sound unsurprising, so it counts for less.", "It shows the fan is against the plan.", "It is a fact about the fan."],
          slips: { 1: "Delighted means the fan is for it.", 2: "Predictably is the writer's judgement, not a checkable fact." },
          hint: "How does predictably make you feel about the fan?",
          why: "Predictably shrugs the fan off: of course they like it. It is a small word choice that takes the neighbour's side." } } },

    { type: "text", topic: "Read it and weigh it up", stretch: true,
      q: "Whose side are you on? Write one sentence with <b>because</b>. Either side is fine, and so is the middle.",
      need: [["because", "cos", "since", "as"]],
      model: "I am on the neighbour's side because people who live nearby should be asked first.",
      slips: [[["for", "against", "agree", "side"], "Nice. Now add because and a reason."]],
      hint: "Start with I am on ... side because ...",
      ez: { q: "Whose side are you on? Write 1 sentence with <b>because</b>.", why: "Any side works. Just give a reason." },
      why: "Any side works, as long as you give a reason. That is how to make your own point of view count." }
  ],

  ez: {
    realWorld: { title: "Votes, news and our big question", html: "<p>Votes and news have two sides.</p><p>Should we time travel? Whose side are you on?</p>" },
    make: { intro: "Pick a question. Give a reason for and against." }
  },
  realWorld: {
    title: "Votes, news and our big question",
    html: "<p>Every time there is a vote, a news story or a family argument about where to go on holiday, there are two sides. Spotting whose view you are reading helps you make up your own mind.</p>" +
      "<p>Our big question has two sides as well: <b>If we could time travel, should we?</b> One side: we could learn so much. Other side: we might change things we cannot undo. Whose side are you on?</p>",
    fig: '<svg viewBox="0 0 420 140" role="img" aria-label="Jay by a time portal weighing it up">' + A2ART.portal(80, 70, 56) + A2ART.jay(250, 50, 0.85, "hmm") +
      A2ART.bubble(300, 6, 112, 52, "Should we,\nthough?", 304) + '</svg>'
  },

  make: {
    title: "Make a two sides card",
    intro: "Pick any question you like, give a reason on each side, then say where you stand. Keep it or send it to Jay.",
    fields: [
      { id: "q", label: "The question", ph: "Should Base 5 get a class pet?", max: 60 },
      { id: "for", label: "A reason for", ph: "It would be calming to look after.", max: 70 },
      { id: "against", label: "A reason against", ph: "Who looks after it in the holidays?", max: 70 },
      { id: "me", label: "Where I stand", ph: "For, as long as it is a bird.", max: 50 }
    ],
    svg: function(v){
      function e(t){ return String(t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n, max){ var w = String(t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n){ if(cur.trim()) out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max); }
      function lines(t, x, y, n, max, size, col, anchor){ return wrap(t, n, max).map(function(l, k){ return '<text x="' + x + '" y="' + (y + k * (size + 6)) + '"' + (anchor ? ' text-anchor="middle"' : '') + ' font-family="Verdana,Arial,sans-serif" font-size="' + size + '" fill="' + col + '">' + e(l) + '</text>'; }).join(""); }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420">' +
        '<rect width="640" height="420" rx="24" fill="#fffdf6"/>' +
        '<rect x="20" y="20" width="600" height="86" rx="16" fill="#2d2466"/>' +
        lines(v.q, 320, wrap(v.q, 34, 2).length > 1 ? 56 : 71, 34, 2, 22, "#ffffff", true) +
        '<rect x="20" y="124" width="292" height="170" rx="16" fill="#d4f5ea" stroke="#0f7a5f" stroke-width="3"/>' +
        '<text x="40" y="156" font-family="Verdana,Arial,sans-serif" font-size="17" font-weight="700" fill="#0f7a5f">FOR</text>' +
        lines(v["for"], 40, 190, 21, 4, 17, "#141a33") +
        '<rect x="328" y="124" width="292" height="170" rx="16" fill="#ffe0ea" stroke="#d63c6c" stroke-width="3"/>' +
        '<text x="348" y="156" font-family="Verdana,Arial,sans-serif" font-size="17" font-weight="700" fill="#d63c6c">AGAINST</text>' +
        lines(v.against, 348, 190, 21, 4, 17, "#141a33") +
        '<rect x="20" y="312" width="600" height="88" rx="16" fill="#fff4c2" stroke="#141a33" stroke-width="3"/>' +
        '<text x="40" y="342" font-family="Verdana,Arial,sans-serif" font-size="15" font-weight="700" fill="#141a33">WHERE I STAND</text>' +
        lines(v.me, 40, 372, 40, 2, 19, "#141a33") +
        '</svg>';
    }
  }
};
})();
