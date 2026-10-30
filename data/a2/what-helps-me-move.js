/* Base 5 Autumn 2 activity: What helps me move.
   Physical World. Warm ups, tools and grips, breaking a skill into
   small steps, and practice: finding what helps you. Reflective, no
   judgement. ASCII only. */
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

/* a simple person from lines */
function person(x, y, arms, col){
  col = col || "#2f6f8f";
  function L(a, b, w){ return '<path d="M' + (x + a[0]) + ' ' + (y + a[1]) + 'L' + (x + b[0]) + ' ' + (y + b[1]) + '" stroke="' + col + '" stroke-width="' + (w || 9) + '" stroke-linecap="round"/>'; }
  return L([0, 0], [-10, 36]) + L([-10, 36], [-12, 70]) + L([0, 0], [10, 36]) + L([10, 36], [12, 70]) + L([0, 0], [0, -50], 12) +
    L([0, -50], arms[0]) + L(arms[0], arms[1]) + L([0, -50], arms[2]) + L(arms[2], arms[3]) +
    '<circle cx="' + x + '" cy="' + (y - 68) + '" r="15" fill="#f6d1b0" stroke="#141a33" stroke-width="2"/>';
}
/* an open hand, palm towards you */
function hand(x, y, s){
  var f = [[-26, -46, 13, 40, -12], [-11, -60, 13, 52, -4], [4, -62, 13, 54, 2], [19, -54, 13, 46, 8]];
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
    f.map(function(q){ return '<rect x="' + q[0] + '" y="' + q[1] + '" width="' + q[2] + '" height="' + q[3] + '" rx="6.5" fill="#f6d1b0" stroke="#141a33" stroke-width="2" transform="rotate(' + q[4] + ' ' + (q[0] + 6) + ' ' + (q[1] + q[3]) + ')"/>'; }).join("") +
    '<rect x="26" y="-14" width="13" height="36" rx="6.5" fill="#f6d1b0" stroke="#141a33" stroke-width="2" transform="rotate(40 30 22)"/>' +
    '<path d="M-30 -12h60v34q0 24 -30 24q-30 0 -30 -24z" fill="#f6d1b0" stroke="#141a33" stroke-width="2"/></g>';
}

/* warm ups: big and small */
var WARM = '<svg viewBox="0 0 520 220" role="img" aria-label="Warm ups: arm circles for big moves, finger wiggles for small moves">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  '<rect x="16" y="16" width="236" height="188" rx="14" fill="#ffd23f" fill-opacity=".3"/><rect x="268" y="16" width="236" height="188" rx="14" fill="#22b8e6" fill-opacity=".25"/>' +
  person(134, 112, [[-34, -64], [-58, -82], [34, -64], [58, -82]], "#e07a1f") +
  '<circle cx="76" cy="30" r="0" fill="none"/>' +
  '<path d="M60 40a22 22 0 1 1 8 30" fill="none" stroke="#141a33" stroke-width="2.5"/><path d="M66 64l3 8 8 -3" fill="none" stroke="#141a33" stroke-width="2.5"/>' +
  '<path d="M208 40a22 22 0 1 0 -8 30" fill="none" stroke="#141a33" stroke-width="2.5"/><path d="M202 64l-3 8 -8 -3" fill="none" stroke="#141a33" stroke-width="2.5"/>' +
  T(134, 196, "Big moves: arm circles", 14, { a: "middle", b: 1 }) +
  hand(386, 128, 1.15) +
  '<path d="M330 50q-6 -8 0 -16M348 36q-6 -8 0 -16M424 36q6 -8 0 -16M442 50q6 -8 0 -16" fill="none" stroke="#141a33" stroke-width="2.5" stroke-linecap="round"/>' +
  T(386, 196, "Small moves: finger wiggles", 14, { a: "middle", b: 1 }) + '</svg>';

/* tools that help */
var TOOLS = '<svg viewBox="0 0 520 220" role="img" aria-label="Tools that help: a pen grip, a chunky fork, elastic laces and a zip puller">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  [["Pen grip", "#ffd23f", '<rect x="-6" y="-40" width="12" height="70" rx="3" fill="#3a8fd6" stroke="#141a33" stroke-width="2"/><path d="M-6 30l6 12 6 -12z" fill="#f6d1b0" stroke="#141a33" stroke-width="2"/><rect x="-13" y="4" width="26" height="24" rx="10" fill="#19c39a" stroke="#141a33" stroke-width="2"/>'],
   ["Chunky fork", "#ff8a5c", '<path d="M-9 -40v18M-3 -40v18M3 -40v18M9 -40v18" stroke="#8a93a6" stroke-width="3" stroke-linecap="round"/><path d="M-11 -24h22v8h-22z" fill="#8a93a6"/><rect x="-12" y="-16" width="24" height="56" rx="11" fill="#ff5d8f" stroke="#141a33" stroke-width="2"/>'],
   ["Elastic laces", "#8a5cf6", '<path d="M-36 18q0 -26 24 -30l20 -2q14 0 18 14l10 18z" fill="#5b6180" stroke="#141a33" stroke-width="2"/><rect x="-38" y="16" width="76" height="10" rx="4" fill="#ffffff" stroke="#141a33" stroke-width="2"/><path d="M-10 -6q6 5 12 0q6 5 12 0M-6 2q6 5 12 0q6 5 12 0" fill="none" stroke="#ffd23f" stroke-width="3"/>'],
   ["Zip puller", "#22b8e6", '<rect x="-24" y="-40" width="48" height="80" rx="6" fill="#2f6f8f" stroke="#141a33" stroke-width="2"/><path d="M0 -40v80" stroke="#141a33" stroke-width="2"/><rect x="-5" y="-12" width="10" height="14" rx="2" fill="#c8ccd2" stroke="#141a33" stroke-width="1.5"/><circle cx="0" cy="16" r="12" fill="none" stroke="#ffd23f" stroke-width="5"/>']
  ].map(function(c, k){
    var x = 70 + k * 127;
    return '<g transform="translate(' + x + ' 88)"><circle r="52" fill="' + c[1] + '" fill-opacity=".25" stroke="#141a33" stroke-width="2.5"/>' + c[2] + T(0, 82, c[0], 14, { a: "middle", b: 1 }) + '</g>';
  }).join("") +
  A2ART.egg(A2ART.bird(494, 28, 0.6, "#141a33"), "Birds use tools too. Some crows poke sticks into holes to get at food. Jay thinks that is the best fact ever.") +
  '</svg>';

/* a skill broken into steps */
var STEPS = '<svg viewBox="0 0 520 220" role="img" aria-label="A staircase of four small steps up to [[skill]]">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  [0, 1, 2, 3].map(function(k){
    var x = 40 + k * 100, y = 160 - k * 34;
    return '<rect x="' + x + '" y="' + y + '" width="100" height="' + (200 - y) + '" fill="' + ["#ffd23f", "#19c39a", "#22b8e6", "#8a5cf6"][k] + '" fill-opacity=".7" stroke="#141a33" stroke-width="2.5"/>' +
      T(x + 50, y + 28, "Step " + (k + 1), 15, { a: "middle", b: 1 });
  }).join("") +
  '<path d="M460 62V20" stroke="#141a33" stroke-width="3"/><path d="M460 20l36 10 -36 10z" fill="#e04848"/>' +
  T(450, 50, "[[Skill]]", 13, { a: "end", b: 1 }) +
  person(58, 90, [[-20, -28], [-26, -6], [20, -28], [26, -6]], "#e07a1f").replace(/stroke-width="9"/g, 'stroke-width="6"').replace(/stroke-width="12"/g, 'stroke-width="8"').replace(/r="15"/, 'r="11"') +
  '</svg>';

/* little and often, or all at once */
var OFTEN = '<svg viewBox="0 0 520 230" role="img" aria-label="Two practice plans: a little every day, or one long go on one day">' +
  '<rect width="520" height="230" rx="16" fill="#f4f1ea"/>' +
  [["Little and often", [1, 1, 1, 1, 1, 1, 1], "#19c39a", 40], ["All at once", [0, 0, 0, 0, 0, 0, 7], "#ff8a5c", 128]].map(function(r){
    var y = r[3];
    return T(28, y + 16, r[0], 15, { b: 1 }) + "MTWTFSS".split("").map(function(d, k){
      var x = 200 + k * 42, h = r[1][k] * 14;
      return '<rect x="' + x + '" y="' + (y + 54 - Math.min(h, 54)) + '" width="30" height="' + Math.min(h, 54) + '" rx="4" fill="' + r[2] + '" stroke="#141a33" stroke-width="1.5"/>' +
        '<path d="M' + (x - 4) + ' ' + (y + 54) + 'h38" stroke="#141a33" stroke-width="2"/>' + T(x + 15, y + 74, d, 13, { a: "middle" });
    }).join("");
  }).join("") +
  T(28, 76, "5 minutes a day", 13, { c: "#3a4060" }) + T(28, 164, "One long go", 13, { c: "#3a4060" }) +
  A2ART.egg('<g transform="translate(116 206)">' + A2ART.bonnie(0, 0, 0.32, "sit") + '</g>', "Bonnie learned to sit with lots of tiny practices and a treat every time. Little and often works for poodles too.") +
  '</svg>';

/* my helpers picker */
var HELPERS = ["Warm up my hands first", "Warm up my body first", "A pen grip or chunky pen", "Chunky cutlery", "Elastic laces or slip on shoes", "A zip puller",
  "Breaking it into small steps", "Watching someone do it first", "Someone showing me slowly", "Practising a little and often", "A quiet space", "Music on",
  "A timer so I know when to stop", "A break when my hands get tired", "Trying it sitting down first", "Saying the steps out loud"];
function helperWidget(el, api){
  var d = api.data || {};
  if(!Array.isArray(d.on)) d.on = [];
  el.innerHTML = '<div class="a2task"><h4>My helpers</h4><p>Tap any that help you, or that you would like to try. There are no right answers here: everyone\'s list is different.</p>' +
    '<div class="hp" style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0"></div>' +
    '<label style="display:flex;flex-direction:column;gap:4px;font-weight:700;margin-top:6px">Something else that helps me<input type="text" maxlength="60" class="ho" style="font:inherit;font-weight:400;padding:8px;border-radius:10px;border:2px solid #141a33;background:#fffdf8"></label>' +
    '<p class="hn" style="font-weight:700;margin:8px 0 0"></p></div>';
  var host = el.querySelector(".hp"), other = el.querySelector(".ho"), note = el.querySelector(".hn");
  function count(){ var n = d.on.filter(Boolean).length + (d.other && d.other.trim() ? 1 : 0); note.textContent = n ? n + " helper" + (n === 1 ? "" : "s") + " on your list." : ""; }
  HELPERS.forEach(function(t, k){
    var b = document.createElement("button");
    b.type = "button"; b.className = "a2chip"; b.textContent = t;
    b.setAttribute("aria-pressed", d.on[k] ? "true" : "false");
    b.onclick = function(){ d.on[k] = !d.on[k]; b.setAttribute("aria-pressed", d.on[k] ? "true" : "false"); try{ api.save(); }catch(e){} count(); api.done("done"); };
    host.appendChild(b);
  });
  other.value = d.other || "";
  other.oninput = function(){ d.other = other.value; try{ api.save(); }catch(e){} count(); if(other.value.trim()) api.done("done"); };
  count();
}

/* the challenge card */
var TRY = ["Pick one skill you would like to feel easier", "Pick one helper to try with it", "Warm up for a minute first",
  "Have a go for five minutes, then stop", "Notice what helped, even a little bit", "Try it again on another day"];
function tryWidget(el, api){
  var d = api.data || {};
  if(!Array.isArray(d.ticks)) d.ticks = [];
  el.innerHTML = '<div class="a2task"><h4>Challenge card: try a helper</h4><p>Away from the screen, this week or whenever suits you. Any order, any amount. Tick what you tried.</p><div class="xlist"></div></div>';
  var list = el.querySelector(".xlist");
  TRY.forEach(function(t, k){
    var lab = document.createElement("label");
    lab.style.cssText = "display:flex;gap:10px;align-items:center;margin:8px 0;font-size:1rem;cursor:pointer";
    var cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = !!d.ticks[k];
    cb.style.cssText = "width:22px;height:22px;flex:none";
    cb.onchange = function(){ d.ticks[k] = cb.checked; try{ api.save(); }catch(e){} api.done("done"); };
    lab.appendChild(cb); lab.appendChild(document.createTextNode(t));
    list.appendChild(lab);
  });
}

(window.A2PACKS = window.A2PACKS || {})["what-helps-me-move"] = {
  a2: true,
  id: "a2-what-helps-me-move",
  title: "What helps me move",
  subject: "Physical World",
  bodyClass: "subj-home subj-pillar",
  mins: 20,
  line: "Warm ups, tools, small steps and practice: finding the helpers that work for you.",
  blurb: "Everyone moves differently, and everyone has helpers. Four short chunks on warm ups, tools and grips, small steps and practice, with your own helper list, a try it card, and a move kit card to make at the end.",
  note: "Finding what helps you move: warm ups, tools, small steps and practice. Four five minute chunks and a try it card, whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Warm up", line: "Warm up: the main helpers, one at a time." },
    { id: "medium", name: "In the groove", line: "In the groove: why the helpers work, and matching them to a job." },
    { id: "spicy", name: "Coach mode", line: "Coach mode: what practice does to your brain, and planning your own way in." }
  ],
  themes: {
    time: { name: "Time travel", w: { skill: "steering the time pod", pro: "time pilots", s1: "Sit back and buckle up", s2: "Both hands on the steering bar", s3: "Turn the dial to the year", s4: "Push the lever slowly forward" } },
    football: { name: "Football", w: { skill: "keepy uppies", pro: "footballers", s1: "Drop the ball onto your foot", s2: "Flick it up once and catch it", s3: "Try two flicks before the catch", s4: "Add one more flick each time" } },
    horror: { name: "Horror", w: { skill: "drawing a spooky map", pro: "special effects artists", s1: "Draw the outline of the old house", s2: "Add the rooms and corridors", s3: "Mark where the ghost was seen", s4: "Add a key and a title" } },
    fishing: { name: "Fishing", w: { skill: "tying a fishing knot", pro: "anglers", s1: "Thread the line through the hook", s2: "Wrap the end round the line five times", s3: "Push the end back through the loop", s4: "Wet it and pull it tight" } },
    music: { name: "Music", w: { skill: "a dance routine", pro: "dancers", s1: "Learn the first four counts", s2: "Learn the next four counts", s3: "Join the eight counts together", s4: "Add the music" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  ez: {
    realWorld: { html: "<p>Athletes and musicians warm up. Astronauts practise in a pool.</p><p>In 1800 people wrote with a feather!</p>" },
    make: { intro: "A skill, what helps, and your warm up." }
  },
  startFig: TOOLS,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Warm up", title: "Warm ups get you ready",
      fig: WARM,
      html: "<p>A warm up gets your body ready to move. It wakes up your muscles, loosens your joints and gets your brain switched on.</p>" +
        "<p><b>Big moves</b> like running or throwing: march on the spot, then arm circles.<br><b>Small moves</b> like writing or laces: shake your hands out, wiggle your fingers, roll your wrists.</p>" +
        "<p>A minute is plenty. Even [[pro]] warm up first, every time.</p>",
      ez: { html: "<p>A <b>warm up</b> gets your body ready.</p><p>Big moves: arm circles. Small moves: wiggle your fingers.</p>" },
      lv: {
        medium: { html: "<p>A warm up gets your body ready. It wakes up your muscles, loosens your joints and switches your brain on to the job.</p>" +
          "<p>Two rules make a good one. <b>Gentle first, then bigger.</b> And <b>match it to the job</b>: big moves for running or throwing, hand and finger moves for writing, cutting or laces.</p>" +
          "<p>Even [[pro]] warm up first, every time.</p>" },
        spicy: { html: "<p>Warming up raises the temperature of your muscles, so they stretch more easily and react faster. It gets more blood to them, and it wakes up the paths between your brain and your muscles.</p>" +
          "<p>The best warm ups <b>move</b>: leg swings, arm circles, jogging, finger wiggles. Holding a long still stretch is better saved for afterwards.</p>" +
          "<p>Then finish with an easy version of the real skill. Even [[pro]] do exactly this.</p>" } } },

    { type: "mc", topic: "Warm up",
      q: "Why do people warm up?",
      options: ["To get muscles and joints ready", "To get tired out before they start", "Because it looks good"],
      answer: 0,
      slips: { 1: "A warm up should be gentle. It gets you ready, it does not wear you out.", 2: "It might look good, but there is a better reason." },
      hint: "Think about what it does to your muscles.",
      why: "A warm up gets your muscles, joints and brain ready to move.",
      ez: { slips: { 1: "A warm up is gentle. It does not tire you.", 2: "There is a better reason." }, hint: "What does it do to your muscles?", why: "It gets your <b>muscles</b> ready to move." },
      lv: { spicy: { q: "Which is the best reason to warm up?",
        options: ["Warmer muscles stretch more easily and react faster", "It burns off energy so you are calmer", "Cold muscles cannot move at all", "It makes you stronger straight away"],
        slips: { 1: "A warm up should leave you with more energy for the real thing.", 2: "Cold muscles do move, just not as smoothly.", 3: "Strength builds over weeks of practice, not in one warm up." },
        hint: "What does heat do to a muscle?",
        why: "Warmer muscles stretch more easily and react faster, so the real skill feels smoother." } } },

    { type: "order", topic: "Warm up",
      q: "Put this warm up in order, from gentle to bigger.",
      items: ["March on the spot", "Small arm circles", "Big arm circles", "Jog on the spot"],
      slips: { any: "Start with the gentlest move, and build up." },
      hint: "Which one is the gentlest?",
      why: "Gentle first, then bigger: march, small circles, big circles, jog.",
      ez: { q: "Put it in order. Gentle first.", slips: { any: "Start with the gentlest one." }, why: "March, small circles, then big circles." },
      lv: {
        mild: { items: ["March on the spot", "Small arm circles", "Big arm circles"] },
        spicy: { items: ["March on the spot", "Arm circles and leg swings", "Jog on the spot", "An easy version of the real skill"],
          why: "Gentle, then bigger, then the real skill done easily. That last step tells your brain what is coming." } } },

    { type: "multi", topic: "Warm up",
      q: "Pick <b>all</b> the warm ups that help before writing or fiddly work.",
      options: ["Shake your hands out", "Wiggle your fingers", "Roll your wrists", "Squeeze the pen as hard as you can", "Sit on your hands"],
      answers: [0, 1, 2],
      slips: { any: "Three help. Squeezing hard tires your hands out, and sitting on them does not warm them at all." },
      hint: "Which ones move your hands and fingers gently?",
      why: "Shaking, wiggling and rolling all wake your hands up gently. Squeezing hard just tires them out.",
      ez: { q: "Pick <b>all</b> the warm ups for your hands.", slips: { any: "Two help. Sitting on them keeps them still." }, hint: "Which ones move your hands?", why: "Shake and wiggle. They wake your hands up." },
      lv: { mild: { options: ["Shake your hands out", "Wiggle your fingers", "Sit on your hands"], answers: [0, 1],
        slips: { any: "Two help. Sitting on your hands keeps them still." },
        why: "Shaking and wiggling wake your hands up. Sitting on them keeps them still." } } },

    { type: "mc", topic: "Warm up",
      q: "Is this true? \"A warm up should be really hard work.\"",
      options: ["Not true: gentle is the idea", "True: the harder the better"],
      answer: 0, fixed: true,
      slips: { 1: "Hard work would tire you out before you start. Gentle gets you ready." },
      hint: "Ready, not tired.",
      why: "A warm up is gentle. You want to start the real thing feeling ready, not worn out.",
      ez: { slips: { 1: "Hard work tires you out first." }, why: "Not true. A warm up is <b>gentle</b>." },
      lv: { spicy: { q: "Before a sprint, which warm up is better?",
        options: ["Moving warm ups like leg swings and jogging", "Holding one long stretch for a minute", "No warm up, to save energy"],
        answer: 0, fixed: true,
        slips: { 1: "Long still stretches are better after exercise. Before, moving warm ups get you ready to move.", 2: "Skipping it means cold muscles and slower reactions." },
        hint: "Moving, or still?",
        why: "Moving warm ups match what you are about to do, so your muscles and brain are ready for it." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Tools and grips", title: "Tools help everyone",
      fig: TOOLS,
      html: "<p>Everyone uses tools to make moving easier. Glasses help eyes. Football boots have studs for grip.</p>" +
        "<p>Tools can help with small moves too: a <b>pen grip</b>, <b>chunky cutlery</b>, <b>elastic laces</b>, a <b>zip puller</b>, a <b>non slip mat</b> under a plate or a bowl.</p>" +
        "<p>Using a tool is a smart choice, not a cheat.</p>",
      ez: { html: "<p>Everyone uses <b>tools</b>. Glasses. Football boots.</p><p>A pen grip is a smart choice, not a cheat.</p>" },
      lv: {
        medium: { html: "<p>Everyone uses tools to make moving easier. [[Pro]] all have their own kit.</p>" +
          "<p>Tools work by changing the job. A <b>chunky handle</b> means less squeezing, so hands tire more slowly. A <b>non slip mat</b> holds the plate, so one hand is free. A <b>zip puller</b> gives small fingers something bigger to hold.</p>" +
          "<p>Using a tool is a smart choice, not a cheat.</p>" },
        spicy: { html: "<p>A tool that makes a task fit the person is called an <b>adaptation</b>. Lots of everyday designs started like this: lever door handles, chunky kitchen gadgets, electric toothbrushes. Now everybody uses them.</p>" +
          "<p>Good adaptations change the job, not the person: <b>bigger</b> handles (less squeezing), <b>grip</b> (non slip mats, rubber pen grips), <b>fewer steps</b> (elastic laces, velcro), <b>support</b> (a sloped writing board).</p>" +
          "<p>Picking the right tool is what [[pro]] do too.</p>" } } },

    { type: "match", topic: "Tools and grips",
      q: "Match each tricky bit to a helper that might fix it.",
      pairs: [["My pen keeps slipping", "A pen grip"], ["My laces come undone", "Elastic laces or a double knot"], ["My plate slides about when I cut", "A non slip mat"], ["The zip is tiny and fiddly", "A zip puller"]],
      slips: { any: "Think about what each helper does: grips, holds still, or gives you something bigger to hold." },
      hint: "Which helper stops things sliding?",
      why: "Each helper changes the job a little, so the tricky bit gets easier.",
      ez: { q: "Match each problem to a helper.", slips: { any: "Does it grip, hold still, or give you more to hold?" }, hint: "Which one stops sliding?", why: "Each helper makes the job easier." },
      lv: { spicy: { pairs: [["My pen keeps slipping", "A pen grip"], ["My laces come undone", "Elastic laces or a double knot"], ["My plate slides about when I cut", "A non slip mat"], ["The zip is tiny and fiddly", "A zip puller"], ["My hand aches after writing for a while", "A sloped board and short breaks"]] } } },

    { type: "mc", topic: "Tools and grips", explain: true,
      q: "Jay uses binoculars to watch birds. Is that cheating at birdwatching?",
      fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay with binoculars looking at a bird">' + A2ART.jay(110, 46, 0.85, "wow") +
        '<g transform="translate(110 46)"><circle cx="-12" cy="0" r="10" fill="#141a33"/><circle cx="12" cy="0" r="10" fill="#141a33"/><rect x="-4" y="-4" width="8" height="8" fill="#141a33"/></g>' +
        A2ART.bird(330, 50, 1, "#ff5d5d") + '<path d="M140 46q90 -20 166 0" fill="none" stroke="#141a33" stroke-width="2" stroke-dasharray="5 5"/></svg>',
      options: ["No. Tools help everyone do things better.", "Yes. Real birdwatchers use their eyes only.", "Only if somebody sees him."],
      answer: 0, fixed: true,
      slips: { 1: "Expert birdwatchers use binoculars all the time. Tools are part of doing it well.", 2: "Whether anyone sees makes no difference to whether it helps." },
      hint: "Do experts use binoculars?",
      why: "Not cheating at all. It is the same with a pen grip or elastic laces: the right tool lets you do the thing.",
      ez: { q: "Jay uses binoculars to watch birds. Is that cheating?", slips: { 1: "Experts use binoculars all the time.", 2: "Who sees makes no difference." }, hint: "Do experts use them?", why: "<b>No</b>. The right tool helps you do it." } },

    { type: "sort", topic: "Tools and grips",
      q: "Cutting up food. Which of these are likely to help?",
      buckets: ["Likely to help", "Likely to make it harder"],
      cards: [["A non slip mat under the plate", 0], ["Chunky cutlery handles", 0], ["The fork holding the food still", 0], ["Rushing to finish first", 1], ["The plate balanced on your knee", 1]],
      slips: { any: "Ask: does it keep things still and steady, or wobbly and rushed?" },
      hint: "Steady and still helps. Wobbly and rushed does not.",
      why: "A mat, chunky handles and a steady fork all make cutting easier. Rushing and wobbly plates make it harder.",
      ez: { q: "Cutting up food. What helps?", slips: { any: "Is it steady, or wobbly and rushed?" }, hint: "Steady and still helps.", why: "A mat, chunky handles and a steady fork help." },
      lv: {
        medium: { q: "Writing for a long time. Which of these are likely to help?",
          cards: [["A pen grip", 0], ["Short breaks to shake your hands out", 0], ["Sitting with both feet flat on the floor", 0], ["Gripping the pen as tight as possible", 1], ["Writing on a wobbly lap", 1]],
          why: "Grips, breaks and a steady seat help. Tight grips and wobbly surfaces tire you faster." },
        spicy: { q: "[[Skill]]. Which of these are likely to help someone learn it?",
          cards: [["Watching someone do it slowly first", 0], ["Practising one small step at a time", 0], ["Kit that fits the person", 0], ["Doing the whole thing at full speed straight away", 1], ["Comparing yourself with an expert", 1]],
          why: "Watching, small steps and kit that fits all help. Full speed straight away and comparing yourself with experts tend to get in the way." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Small steps", title: "Break it into small steps",
      fig: STEPS,
      html: "<p>A tricky skill is easier in small steps. Learn one step, then add the next.</p>" +
        "<p>Here are four steps for [[skill]]:<br><b>1.</b> [[S1]].<br><b>2.</b> [[S2]].<br><b>3.</b> [[S3]].<br><b>4.</b> [[S4]].</p>" +
        "<p>Each step on its own is small enough to have a go at.</p>",
      ez: { html: "<p>Learn one <b>small step</b>, then add the next.</p><p><b>1.</b> [[S1]].<br><b>2.</b> [[S2]].<br><b>3.</b> [[S3]].<br><b>4.</b> [[S4]].</p>" },
      lv: {
        medium: { html: "<p>A tricky skill is easier in small steps. Practise step 1 until it feels OK, then add step 2, and so on. This is called <b>chaining</b>: each step links on to the last.</p>" +
          "<p><b>[[Skill]]</b>:<br><b>1.</b> [[S1]].<br><b>2.</b> [[S2]].<br><b>3.</b> [[S3]].<br><b>4.</b> [[S4]].</p>" },
        spicy: { html: "<p>Coaches break skills into steps and chain them together. There are two ways round.</p>" +
          "<p><b>Forward chaining:</b> learn step 1, then 1 and 2, then 1, 2 and 3. <b>Backward chaining:</b> someone helps with the early steps and you do the <b>last</b> step yourself, then the last two, and so on. You always finish the skill, which feels good, so it is great for things like laces.</p>" +
          "<p><b>[[Skill]]</b>: 1. [[S1]]. 2. [[S2]]. 3. [[S3]]. 4. [[S4]].</p>" } } },

    { type: "order", topic: "Small steps",
      q: "Put the steps for [[skill]] in order.",
      fig: STEPS,
      items: ["[[S1]]", "[[S2]]", "[[S3]]", "[[S4]]"],
      slips: { any: "Which step has to happen before anything else can?" },
      hint: "What would you do first of all?",
      why: "Step 1, then 2, then 3, then 4. Each step builds on the one before, and each one is small enough to practise on its own.",
      ez: { slips: { any: "What has to happen first?" }, why: "1, 2, 3, then 4. Each step builds on the last." } },

    { type: "mc", topic: "Small steps",
      q: "Tying laces feels like a lot. What is a good small first step?",
      options: ["Just practise crossing the laces over", "Do the whole bow ten times, fast", "Watch a video of a world record"],
      answer: 0,
      slips: { 1: "The whole thing, fast, is a lot at once. One small step first.", 2: "Fun, but a record is not a first step." },
      hint: "Small enough to try right now.",
      why: "Crossing the laces is one small step. When that feels OK, add the next one.",
      ez: { q: "Laces feel like a lot. What is a small first step?", slips: { 1: "That is a lot at once.", 2: "Fun, but not a first step." }, why: "Just <b>cross the laces</b>. Then add the next step." },
      lv: { spicy: { q: "Backward chaining for laces. Which step do you do yourself first?",
        options: ["Pulling the loops tight, the very last step", "Crossing the laces, the very first step", "Making the two loops, the middle step"],
        slips: { 1: "That is forward chaining. Backward chaining starts from the end.", 2: "Backward chaining starts at the very end, not the middle." },
        hint: "Backward means you start at the end.",
        why: "You do the last step yourself first, so you finish the bow every single time. Then you take on one more step." } } },

    { type: "text", topic: "Small steps", explain: true,
      q: "Think of any skill you would like to feel easier. Write one small first step for it.",
      need: [["a", "the", "to", "i", "my", "just", "practise", "practice", "try", "hold", "put", "start", "learn", "do", "make", "pick", "get", "use", "watch", "first", "one", "slow"]],
      slips: [[["cannot", "can't", "cant", "never"], "That is fine to feel. For now, have a go at one tiny first step, like: hold the pen the comfy way."]],
      model: "Just practise holding the pen the comfy way.",
      hint: "Something small enough to try for one minute.",
      ez: { q: "Pick a skill. Write one small first step.", slips: [[null, "That is OK to feel. Try one tiny step."]] },
      why: "Any small first step counts. Small steps add up." },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "What works for me", title: "Practice, and finding your helpers",
      fig: OFTEN,
      html: "<p>Practice makes a skill smoother. <b>A little and often</b> works better than one long go.</p>" +
        "<p>Mistakes are useful: they show you what to try next. And everyone's body is different, so everyone's helpers are different. There is no right list.</p>",
      ez: { html: "<p><b>A little and often</b> works best.</p><p>Everyone's helpers are different.</p>" },
      lv: {
        medium: { html: "<p>Every time you practise, your brain builds a stronger path for that move, so it gets smoother and needs less thinking. <b>A little and often</b> builds the path better than one long go.</p>" +
          "<p>Mistakes are useful information. And everyone's body is different, so everyone's helpers are different.</p>" },
        spicy: { html: "<p>Practice changes your brain. Repeating a move strengthens the connections that control it, until it runs almost on its own: people call it <b>muscle memory</b>, but it is really your brain.</p>" +
          "<p>Three things speed it up: <b>spaced practice</b> (short sessions on different days), <b>feedback</b> (noticing what happened and adjusting), and <b>sleep</b>, which is when your brain files the day's practice away.</p>" +
          "<p>Everyone's body is different, so working out your own helpers is the real skill.</p>" } } },

    { type: "mc", topic: "What works for me",
      q: "Which practice plan is likely to help most?",
      fig: OFTEN,
      options: ["5 minutes a day for a week", "One 2 hour go on Sunday", "Waiting until it feels easy before trying"],
      answer: 0,
      slips: { 1: "Long goes get tiring, and there is a week of forgetting in between.", 2: "Things feel easier because of practice, so waiting does not help it along." },
      hint: "Look at the green bars.",
      why: "A little and often. Short goes on lots of days help your brain keep hold of it.",
      ez: { slips: { 1: "Long goes get tiring.", 2: "Practice makes it easier. Waiting does not." }, why: "<b>A little and often</b> helps you remember." },
      lv: { spicy: { why: "Spaced practice: short sessions, with sleep in between, help your brain store the skill. One long go mostly gets tiring." } } },

    { type: "sort", topic: "What works for me",
      q: "Sort the thoughts. Which ones help, and which get in the way?",
      buckets: ["Thoughts that help", "Thoughts that get in the way"],
      cards: [["I cannot do it yet", 0], ["Mistakes show me what to try next", 0], ["Everyone else finds it easy", 1], ["Using a tool means I failed", 1]],
      slips: { any: "Ask: does the thought make it easier to have another go?" },
      hint: "The word \"yet\" is a helpful one.",
      why: "\"Yet\" and learning from mistakes keep you going. Comparing and thinking tools are failing get in the way, and they are not true either.",
      ez: { q: "Does each thought help, or get in the way?", slips: { any: "Does it help you have another go?" }, hint: "Yet is a helpful word.", why: "Yet and mistakes help. Comparing gets in the way." },
      lv: { spicy: { cards: [["I cannot do it yet", 0], ["Mistakes show me what to try next", 0], ["A tool is a smart choice", 0], ["Everyone else finds it easy", 1], ["Using a tool means I failed", 1], ["If it is not perfect, it does not count", 1]],
        why: "Helpful thoughts keep you having goes. Comparing, perfectionism and seeing tools as failing all get in the way." } } },

    { type: "widget", topic: "What works for me", unscored: true,
      title: "My helpers",
      html: "<p>Just for you. Your list can go to Jay with the rest if you choose to send it.</p>",
      ez: { html: "<p>Just for you. Tap what helps.</p>" },
      mount: helperWidget,
      report: function(d){
        var on = (d && d.on || []).map(function(v, k){ return v ? HELPERS[k] : ""; }).filter(Boolean);
        if(d && d.other && String(d.other).trim()) on.push(String(d.other).trim());
        return on.length ? "My helpers: " + on.join(", ") + "." : "";
      } },

    { type: "widget", topic: "What works for me", unscored: true,
      title: "Try it card",
      html: "<p>Away from the screen, whenever suits you. Ticks can go to Jay with the rest if you send it.</p>",
      ez: { html: "<p>Away from the screen. Whenever suits you.</p>" },
      mount: tryWidget,
      report: function(d){ var n = d && d.ticks ? d.ticks.filter(Boolean).length : 0; return n ? "Try a helper card: " + n + " of " + TRY.length + " ticked." : ""; } },

    { type: "write", topic: "What works for me",
      q: "Only if you like: tell Jay about a skill you are working on and what helps you with it.",
      starters: ["A skill I would like to feel easier is", "Something that helps me is", "I would like to try", "A warm up I like is", "It helps when"],
      checklist: ["I named a skill", "I named something that helps, or that I would like to try"],
      minWords: 20,
      ez: { q: "Only if you like: tell Jay a skill, and what helps." },
      lv: { spicy: { minWords: 40, checklist: ["I named a skill", "I named a helper and said why it works", "I planned how I might practise it"] } } }
  ],

  realWorld: {
    title: "Everyone has helpers",
    html: "<p>Athletes warm up before every match. Musicians warm up their fingers. Surgeons practise stitches on models before real patients. Paralympians use kit designed around their bodies. Astronauts practise every move in a giant swimming pool before they go to space.</p>" +
      "<p>For our big question: if we could time travel, should we? Helpers change with time. In 1800 people wrote with a feather and a pot of ink. A time traveller from then would be amazed by a pen grip. Every age invents new helpers, and using them is just good sense.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to a time portal, holding a feather pen">' + A2ART.portal(76, 75, 56) + A2ART.jay(240, 48, 0.85, "smile") +
      '<path d="M176 140q-6 -40 26 -70q-6 30 -20 70z" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
      A2ART.bubble(290, 6, 124, 52, "Quills? Try\na pen grip.", 294) + '</svg>'
  },

  make: {
    title: "Make a move kit card",
    intro: "Your own kit: a skill, what helps, and your warm up. Keep it, stick it up, or send it to Jay.",
    fields: [
      { id: "skill", label: "A skill I am working on", ph: "Doing up my coat zip", max: 40 },
      { id: "helper", label: "Something that helps me", ph: "A zip puller ring", max: 40 },
      { id: "warm", label: "My warm up", ph: "Finger wiggles", max: 30 },
      { id: "name", label: "Name on the card", ph: "Coach B5", max: 24 }
    ],
    svg: function(v){
      function row(y, label, txt, col){
        var ls = wrap(txt, 30, 2);
        return '<rect x="30" y="' + y + '" width="400" height="78" rx="14" fill="' + col + '" fill-opacity=".3"/>' +
          T(48, y + 24, label, 14, { b: 1, c: "#3a4060" }) + ls.map(function(l, k){ return T(48, y + 48 + k * 22, esc(l), 17, { b: 1 }); }).join("");
      }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#fffdf6"/>' +
        '<rect x="12" y="12" width="576" height="376" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        T(30, 56, "MY MOVE KIT", 26, { b: 1, c: "#19a07c" }) +
        row(74, "Working on", v.skill, "#ffd23f") + row(160, "What helps", v.helper, "#22b8e6") + row(246, "Warm up", v.warm, "#ff8a5c") +
        T(30, 362, "Kit owner: " + esc(wrap(v.name, 24, 1)[0] || ""), 18, { b: 1 }) +
        /* a toolbox */
        '<g transform="translate(512 200)"><path d="M-30 -40v-14q0 -8 8 -8h44q8 0 8 8v14" fill="none" stroke="#141a33" stroke-width="5"/>' +
        '<rect x="-56" y="-40" width="112" height="80" rx="10" fill="#e04848" stroke="#141a33" stroke-width="3"/><path d="M-56 -12h112" stroke="#141a33" stroke-width="3"/>' +
        '<rect x="-12" y="-18" width="24" height="12" rx="3" fill="#ffd23f" stroke="#141a33" stroke-width="2"/></g>' +
        '<g transform="translate(512 300)">' + hand(0, 0, 0.6) + '</g>' +
        '</svg>';
    }
  }
};
})();
