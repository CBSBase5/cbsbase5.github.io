/* Base 5 core target activity: Spin detector.
   English. Following the line of an argument, spotting points of view,
   and how facts (statistics, experts, charts) and opinions (loaded words,
   opinion dressed as fact) are used to persuade. Always available and
   replayable (vary). ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }

/* a dial with a needle; v from 0 (straight) to 1 (full spin) */
function dial(x, y, r, v){
  var a = Math.PI * (1 - v), nx = x + Math.cos(a) * r * 0.8, ny = y - Math.sin(a) * r * 0.8;
  return '<path d="M' + (x - r) + ' ' + y + 'A' + r + ' ' + r + ' 0 0 1 ' + (x + r) + ' ' + y + 'z" fill="#ffffff" stroke="#141a33" stroke-width="3"/>' +
    '<path d="M' + (x - r + 8) + ' ' + y + 'A' + (r - 8) + ' ' + (r - 8) + ' 0 0 1 ' + x + ' ' + (y - r + 8) + '" fill="none" stroke="#19c39a" stroke-width="8"/>' +
    '<path d="M' + x + ' ' + (y - r + 8) + 'A' + (r - 8) + ' ' + (r - 8) + ' 0 0 1 ' + (x + r - 8) + ' ' + y + '" fill="none" stroke="#ff8a5c" stroke-width="8"/>' +
    '<path d="M' + x + ' ' + y + 'L' + nx.toFixed(1) + ' ' + ny.toFixed(1) + '" stroke="#141a33" stroke-width="4" stroke-linecap="round"/><circle cx="' + x + '" cy="' + y + '" r="6" fill="#141a33"/>';
}

var DETECT = '<svg viewBox="0 0 520 200" role="img" aria-label="A spin detector with a dial pointing towards spin">' +
  '<rect width="520" height="200" rx="16" fill="#2d2466"/>' +
  '<rect x="150" y="24" width="220" height="150" rx="18" fill="#8a5cf6" stroke="#141a33" stroke-width="3"/>' +
  dial(260, 120, 72, 0.82) +
  T(260, 162, "SPIN DETECTOR", 14, { a: "middle", b: 1, c: "#ffffff" }) +
  T(196, 138, "straight", 11, { a: "middle", b: 1, c: "#ffffff" }) + T(324, 138, "spin", 11, { a: "middle", b: 1, c: "#ffffff" }) +
  '<path d="M370 60q40 -30 80 0" fill="none" stroke="#ffd23f" stroke-width="3" stroke-dasharray="6 5"/><path d="M370 90q60 -40 120 0" fill="none" stroke="#ffd23f" stroke-width="3" stroke-dasharray="6 5"/>' +
  A.egg(A.bird(80, 110, 0.9, "#22b8e6"), "A bird on the detector. Birds are never spin. They just say tweet and mean it.") +
  '</svg>';

/* the line of an argument as a train line */
var LINE = '<svg viewBox="0 0 520 170" role="img" aria-label="The line of an argument: claim, reasons, evidence, the other side, knock it down, conclusion">' +
  '<rect width="520" height="170" rx="16" fill="#eef3fb"/>' +
  '<path d="M50 80H470" stroke="#141a33" stroke-width="8" stroke-linecap="round"/>' +
  [["Claim", "#ffd23f"], ["Reasons", "#22b8e6"], ["Evidence", "#19c39a"], ["Other side", "#ff8fb1"], ["Knock it", "#ff8a5c"], ["Conclusion", "#ffd23f"]].map(function(c, k){
    var x = 50 + k * 84;
    return '<circle cx="' + x + '" cy="80" r="15" fill="' + c[1] + '" stroke="#141a33" stroke-width="3"/>' +
      T(x, k % 2 ? 128 : 48, c[0], 13, { a: "middle", b: 1 }) + (k === 4 ? T(x, 144, "down", 13, { a: "middle", b: 1 }) : "");
  }).join("") +
  '</svg>';

/* one article, several voices */
var VOICES = '<svg viewBox="0 0 520 220" role="img" aria-label="An article with three voices: one for, one against, and the writer">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  '<rect x="170" y="20" width="180" height="180" rx="8" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
  '<rect x="186" y="34" width="148" height="14" rx="3" fill="#141a33"/>' +
  '<path d="M186 66h148M186 80h148M186 94h120M186 116h148M186 130h148M186 144h100M186 166h148M186 180h90" stroke="#9aa3bd" stroke-width="5"/>' +
  A.bubble(14, 30, 140, 56, "\"I am all\nfor it!\"", 120) + T(84, 116, "FOR", 14, { a: "middle", b: 1, c: "#1f9d63" }) +
  A.bubble(366, 30, 140, 56, "\"We cannot\nsleep!\"", 400) + T(436, 116, "AGAINST", 14, { a: "middle", b: 1, c: "#c4461f" }) +
  '<g transform="translate(470 150) rotate(30)"><rect x="-6" y="-34" width="12" height="52" rx="3" fill="#8a5cf6"/><path d="M-6 18l6 14 6 -14z" fill="#141a33"/></g>' +
  T(366, 200, "and the writer", 13, { b: 1 }) +
  '</svg>';

/* a bar chart; from = where the axis starts */
function chart(title, la, va, lb, vb, from, egg){
  var top = 100, H = 118, x0 = 70, sc = function(v){ return 170 - (v - from) / (top - from) * H; };
  var tick = "";
  [from, from + (top - from) / 2, top].forEach(function(t){ tick += '<path d="M' + (x0 - 5) + ' ' + sc(t) + 'h5" stroke="#141a33" stroke-width="2"/>' + T(x0 - 9, sc(t) + 4, String(Math.round(t)), 12, { a: "end" }); });
  return '<svg viewBox="0 0 300 220" role="img" aria-label="' + title + ': ' + la + ' ' + va + ', ' + lb + ' ' + vb + ', axis starts at ' + from + '">' +
    '<rect width="300" height="220" rx="14" fill="#ffffff" stroke="#141a33" stroke-opacity=".2"/>' +
    T(150, 26, title, 13, { a: "middle", b: 1 }) +
    '<path d="M' + x0 + ' 40V170H280" fill="none" stroke="#141a33" stroke-width="2.5"/>' + tick +
    '<rect x="100" y="' + sc(va) + '" width="60" height="' + (170 - sc(va)) + '" fill="#8a5cf6"/>' +
    '<rect x="200" y="' + sc(vb) + '" width="60" height="' + (170 - sc(vb)) + '" fill="#9aa3bd"/>' +
    T(130, 190, la, 12, { a: "middle", b: 1 }) + T(230, 190, lb, 12, { a: "middle", b: 1 }) +
    T(130, sc(va) - 6, va + "%", 12, { a: "middle", b: 1 }) + T(230, sc(vb) - 6, vb + "%", 12, { a: "middle", b: 1 }) +
    (egg ? A.egg(A.bird(256, sc(vb) - 30, 0.55, "#ffd23f"), egg) : "") +
    '</svg>';
}
function two(a, b){ return '<svg viewBox="0 0 620 230" role="img" aria-label="The same numbers on two charts. On the left the axis starts at 0 and the bars look nearly the same. On the right the axis starts at 90 and one bar looks much bigger.">' +
  '<g transform="translate(5 5)">' + a.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "") + '</g><g transform="translate(315 5)">' + b.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "") + '</g></svg>'; }
var CHARTS = two(chart("Axis from 0: honest", "Us", 96, "Them", 94, 0), chart("Axis from 90: spin", "Us", 96, "Them", 94, 90, "A bird sitting on the shortest bar. It is not bothered by the spin. Jay would be proud."));

/* word swaps: neutral and loaded */
var WORDS = '<svg viewBox="0 0 520 200" role="img" aria-label="Neutral words and loaded words: said becomes blasted, change becomes disaster, people becomes heroes">' +
  '<rect width="520" height="200" rx="16" fill="#fff6e8"/>' +
  T(120, 34, "Neutral", 15, { a: "middle", b: 1 }) + T(360, 34, "Loaded", 15, { a: "middle", b: 1, c: "#c4461f" }) +
  [["said", "blasted"], ["a change", "a disaster"], ["the players", "our heroes"]].map(function(p, k){
    var y = 56 + k * 46;
    return '<rect x="50" y="' + y + '" width="140" height="34" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' + T(120, y + 23, p[0], 15, { a: "middle" }) +
      '<path d="M200 ' + (y + 17) + 'h76l-8 -6M276 ' + (y + 17) + 'l-8 6" fill="none" stroke="#141a33" stroke-width="2.5"/>' +
      '<rect x="290" y="' + y + '" width="140" height="34" rx="10" fill="#ffe1d3" stroke="#c4461f" stroke-width="2.5"/>' + T(360, y + 23, p[1], 15, { a: "middle", b: 1 });
  }).join("") +
  '<g transform="translate(476 120)">' + dial(0, 0, 30, 0.9) + '</g>' +
  '</svg>';

/* the chunk 1 article, themed */
var ARTICLE = "<p class=\"a2task\">[[Plan]] should be shut down. It costs the town too much, it causes traffic jams every weekend, and it is ruining the high street. Last year, 300 people complained about the traffic. Some people say it brings money into local shops. But most of that money goes straight to the company that runs it. It is time to shut [[plan]] down for good.</p>";
var NEWS = "<p class=\"a2task\">Plans to make [[plan]] even bigger were announced on Monday. Shop owner Sam Reed said: \"It brings me loads of customers. I am all for it.\" Resident Mo Ahmed disagrees: \"The noise goes on until midnight. We cannot sleep.\" The company says it will \"listen to everyone\". Sadly, as usual, the people who actually live here will be ignored.</p>";

(window.A2PACKS = window.A2PACKS || {})["core-spin-detector"] = {
  a2: true,
  id: "a2-core-spin-detector",
  title: "Spin detector",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "Follow an argument, see whose side everyone is on, and catch the facts and opinions being used to win you over.",
  blurb: "Spin is when facts and opinions are bent to push you one way. Four short chunks: following the line of an argument, points of view, facts used for effect, and opinions in disguise. A spin report to make at the end. New questions every time you come back.",
  note: "Spin detector: following an argument and catching the tricks writers use to win you over. Four five minute chunks and a spin report to make. It changes each time, so come back to it whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Scan", line: "Scan: what is the writer saying, and which side are they on?" },
    { id: "medium", name: "Deep scan", line: "Deep scan: spot the facts, the opinions and the tricks." },
    { id: "spicy", name: "Spin doctor", line: "Spin doctor: think like the writer. How is each trick used, and what does it do to you?" }
  ],
  themes: {
    time: { name: "Time travel", w: { plan: "the new time portal in the town centre", fans: "time tourists", expert: "a professor of time travel", trip: "a trip to ancient Egypt" } },
    football: { name: "Football", w: { plan: "the new stadium", fans: "fans", expert: "a sports scientist", trip: "a stadium tour" } },
    horror: { name: "Horror", w: { plan: "the ghost tour at the old hospital", fans: "visitors", expert: "a local historian", trip: "a midnight ghost walk" } },
    fishing: { name: "Fishing", w: { plan: "the new fishing lake", fans: "anglers", expert: "a fish biologist", trip: "a day on the lake" } },
    music: { name: "Music", w: { plan: "the new music venue", fans: "gig goers", expert: "a sound engineer", trip: "a festival weekend" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: DETECT,
  steps: [

    /* ---------- chunk 1: follow the line ---------- */
    { type: "learn", topic: "Follow the line", title: "An argument is a line you can follow",
      fig: LINE,
      ez: { title: "Follow the argument", html: "<p>An argument wants you to <b>agree</b>.</p>" + ARTICLE + "<p>The <b>main point</b> is first and last.</p>" },
      html: "<p>An argument travels along a line. Here is a short one. Read it once, whenever you are ready.</p>" + ARTICLE +
        "<p><b>Claim:</b> what the writer wants you to believe (shut it down). <b>Reasons:</b> why (cost, traffic, the high street). <b>Evidence:</b> facts to back it up (300 complaints). <b>The other side:</b> \"Some people say...\" <b>Knock it down:</b> \"But...\" <b>Conclusion:</b> the claim again, stronger.</p>" +
        "<p>Spin doctor tip: writers mention the other side so they <b>look fair</b>, then knock it down straight away so they get the last word.</p>",
      lv: {
        mild: { html: "<p>An argument is someone trying to get you to agree with them. Here is a short one.</p>" + ARTICLE +
          "<p>The <b>main point</b> comes first: shut it down. Then the <b>reasons</b>: cost, traffic, the high street. The end says the main point again.</p>" },
        medium: { html: "<p>An argument travels along a line. Here is a short one.</p>" + ARTICLE +
          "<p><b>Claim:</b> what the writer wants you to believe. <b>Reasons:</b> why. <b>Evidence:</b> facts to back it up. <b>The other side:</b> \"Some people say...\" then \"But...\" to knock it down. <b>Conclusion:</b> the claim again.</p>" } } },

    { type: "mc", topic: "Follow the line",
      q: "In the article, what is the writer's main claim?",
      options: ["[[Plan]] should be shut down for good", "[[Plan]] brings money into local shops", "300 people complained last year", "The company that runs it is very successful"],
      answer: 0,
      slips: { 1: "That is the other side's point, which the writer mentions so they can knock it down.", 2: "That is evidence. It backs up the claim but it is not the claim.", 3: "The writer never says that. They say the money goes to the company." },
      hint: "What does the writer want you to believe? Look at the first and last lines.",
      why: "The first and last sentences both say it: shut it down. Everything else is there to support that claim.",
      ez: { hint: "Read the first line.", why: "The first and last lines say: shut it down.", slips: { 1: "They want the opposite.", 2: "They do not want more traffic." } },
      lv: { mild: { q: "In the article, what does the writer want?",
        options: ["[[Plan]] to be shut down", "[[Plan]] to get bigger", "More traffic"],
        slips: { 1: "Look at the first line. They want the opposite.", 2: "The writer complains about traffic. They do not want more." },
        hint: "Read the first line.", why: "The first and last lines both say it: shut it down." } },
      vary: [
        { q: "\"School should start at 10am. Teenagers' body clocks make them sleepy early in the morning. A study found students did better in tests after a later start. Some say parents need to get to work. But a later start for students does not stop breakfast clubs opening early.\" What is the main claim?",
          options: ["School should start at 10am", "Teenagers are sleepy in the morning", "Parents need to get to work", "Breakfast clubs open early"],
          answer: 0,
          slips: { 1: "That is a reason. It explains why, but it is not the main claim.", 2: "That is the other side, which the writer knocks down.", 3: "That is part of the knock down, not the claim." },
          hint: "Which sentence is everything else trying to prove?",
          why: "Every other sentence supports one idea: start at 10am. That is the claim.",
          ez: { why: "The first line says: start at 10am.", slips: { 1: "Later, not earlier.", 2: "They only ask for a later start." } },
          lv: { mild: { q: "\"School should start at 10am. Teenagers are sleepy early in the morning.\" What does the writer want?",
            options: ["School to start at 10am", "School to start earlier", "No school at all"],
            slips: { 1: "Later, not earlier. Read the first line again.", 2: "Tempting, but they only ask for a later start." },
            hint: "Read the first line.", why: "The first line says it: start at 10am." } } },
        { q: "\"Bonnie should visit Base 5 every Friday. Dogs help people feel calm. In one survey, 8 out of 10 students said they felt happier after stroking a dog. Some say dogs are messy. But Bonnie is tiny, and she has no tail to knock things over.\" What is the main claim?",
          options: ["Bonnie should visit Base 5 every Friday", "Dogs help people feel calm", "Dogs are messy", "Bonnie has no tail"],
          answer: 0,
          slips: { 1: "That is a reason for the claim.", 2: "That is the other side, which the writer knocks down.", 3: "True, but it is a detail used to knock down the other side." },
          hint: "What does the writer want to happen?",
          why: "Everything supports one claim: Bonnie on Fridays. (Jay says he would need to ask Bonnie first.)",
          ez: { why: "The first line says: Bonnie on Fridays.", slips: { 1: "They want the opposite.", 2: "No cats here. Bonnie is relieved." } },
          lv: { mild: { q: "\"Bonnie should visit Base 5 every Friday. Dogs help people feel calm.\" What does the writer want?",
            options: ["Bonnie to visit on Fridays", "Bonnie to stay at home", "A cat instead"],
            slips: { 1: "They want the opposite. Read the first line.", 2: "No cats were mentioned. Bonnie is relieved." },
            hint: "Read the first line.", why: "The first line says it: Bonnie on Fridays." } } }
      ] },

    { type: "match", topic: "Follow the line",
      q: "Match each sentence from the article to its job in the argument.",
      pairs: [["\"Last year, 300 people complained about the traffic.\"", "Evidence"], ["\"Some people say it brings money into local shops.\"", "The other side"], ["\"But most of that money goes straight to the company.\"", "Knocking down the other side"], ["\"It is time to shut it down for good.\"", "Conclusion"]],
      slips: { any: "Look for the clue words: \"Some people say\" and \"But\" are big signposts." },
      hint: "\"Some people say\" brings in the other side. \"But\" knocks it down.",
      why: "Each sentence has a job. Seeing the jobs is how you follow the line of an argument.",
      ez: { slips: { any: "Look for clue words like \"Some people say\"." }, hint: "\"Some people say\" is the other side.", why: "Each sentence has a job." },
      lv: { mild: { q: "Match each sentence to its job.", pairs: [["\"[[Plan]] should be shut down.\"", "The main point"], ["\"It causes traffic jams every weekend.\"", "A reason"], ["\"Some people say it brings money in.\"", "The other side"]] } },
      vary: [
        { q: "Match each sentence to its job. The argument is about banning phones at lunch.",
          pairs: [["\"Phones should be banned at lunch.\"", "Claim"], ["\"People stop talking to each other.\"", "Reason"], ["\"Some argue phones are needed in an emergency.\"", "The other side"], ["\"But the office phone is always there.\"", "Knocking down the other side"]],
          slips: { any: "Find the claim first: it is what the writer wants." },
          hint: "\"Some argue\" brings in the other side. \"But\" knocks it down.",
          why: "Claim, reason, the other side, knock it down. Same line, different topic.",
          ez: { slips: { any: "Find the main point first." }, hint: "\"Some argue\" is the other side.", why: "Main point, reason, then the other side." },
          lv: { mild: { q: "Match each sentence to its job.", pairs: [["\"Phones should be banned at lunch.\"", "The main point"], ["\"People stop talking to each other.\"", "A reason"], ["\"Some argue phones are needed.\"", "The other side"]] } } },
        { q: "Match each sentence to its job. The argument is about [[trip]].",
          pairs: [["\"Everyone should try [[trip]].\"", "Claim"], ["\"Nine out of ten people who went would go again.\"", "Evidence"], ["\"Some say it is too expensive.\"", "The other side"], ["\"So book it. You will not regret it.\"", "Conclusion"]],
          slips: { any: "Numbers are usually evidence. \"So\" often starts a conclusion." },
          hint: "The number is a clue. \"So\" is a clue.",
          why: "Claim, evidence, the other side, conclusion. Spotting the jobs shows you how the writer is steering you.",
          ez: { slips: { any: "Numbers are usually facts." }, hint: "The number is a clue.", why: "Main point, fact, then the other side." },
          lv: { mild: { q: "Match each sentence to its job.", pairs: [["\"Everyone should try [[trip]].\"", "The main point"], ["\"Nine out of ten people loved it.\"", "A fact to back it up"], ["\"Some say it is too expensive.\"", "The other side"]] } } }
      ] },

    { type: "mc", topic: "Follow the line", explain: true,
      q: "\"Some people say it brings money into local shops. But most of that money goes straight to the company.\" Why does the writer mention the other side at all?",
      options: ["To look fair, then knock it down straight away so their own view gets the last word", "Because the writer has changed their mind", "To prove the other side is right", "By accident, it does not fit the argument"],
      answer: 0,
      slips: { 1: "The conclusion still says shut it down. They have not changed their mind.", 2: "The \"But\" straight after shows they do not agree with it.", 3: "It is a deliberate move. Writers use it a lot." },
      hint: "What comes straight after the other side's point?",
      why: "Mentioning the other side makes the writer seem reasonable. Knocking it down at once means you finish on their side.",
      ez: { why: "\"But\" shows the writer disagrees.", slips: { 1: "Look at the word But.", 2: "But shows they disagree." } },
      lv: { mild: { q: "\"Some people say it brings money in. But most of that money goes to the company.\" Does the writer agree with \"some people\"?",
        options: ["No: the word But shows they disagree", "Yes, they agree", "They do not say"],
        slips: { 1: "Look at the word straight after: But.", 2: "They do: But shows they disagree." },
        hint: "Look at the word But.", why: "\"But\" shows the writer disagrees with the other side." } },
      vary: [
        { q: "\"Of course, some will say [[fans]] love it. Well, they would say that.\" What is the writer doing?",
          options: ["Bringing in the other side, then dismissing it so it sounds silly", "Agreeing with the [[fans]]", "Giving a fact with evidence", "Concluding the argument"],
          answer: 0,
          slips: { 1: "\"Well, they would say that\" brushes them off. That is not agreeing.", 2: "There is no evidence here, only a brush off.", 3: "This is in the middle, dealing with the other side." },
          hint: "How does \"Well, they would say that\" make the other side sound?",
          why: "The writer mentions the other side, then dismisses it without any evidence. It is a quick way to make it sound unimportant.",
          ez: { why: "That last bit brushes them off.", slips: { 1: "That last bit brushes them off.", 2: "Nothing says the writer loves it." } },
          lv: { mild: { q: "\"Some will say [[fans]] love it. Well, they would say that.\" Does the writer agree with them?",
            options: ["No, they brush it off", "Yes, totally", "They love it too"],
            slips: { 1: "\"Well, they would say that\" is brushing it off.", 2: "Nothing here says the writer loves it." },
            hint: "How does the last bit sound?", why: "\"Well, they would say that\" brushes the other side off." } } },
        { q: "An argument ends: \"So the choice is simple. Shut it down, or watch our town die.\" What is the writer doing in this conclusion?",
          options: ["Making it sound like there are only two choices, and one is a disaster, so the reader feels pushed to agree", "Giving a balanced summary of both sides", "Introducing a brand new piece of evidence", "Admitting the other side has a point"],
          answer: 0,
          slips: { 1: "Balanced would give both sides fairly. \"Watch our town die\" is not fair to the other side.", 2: "No new facts here. It is pressure, not evidence.", 3: "Nothing here gives the other side any credit." },
          hint: "Are there really only two choices?",
          why: "It squashes the argument into two options and makes one sound terrible. That is spin: it pushes you, it does not prove anything.",
          ez: { q: "\"So the choice is simple. Shut it down, or watch our town die.\" How should you feel?", hint: "\"Watch our town die\" is big.", why: "Worried, so you agree with the writer.", slips: { 1: "\"Watch our town die\" is not calm.", 2: "\"Die\" is a scary word." } },
          lv: { mild: { q: "\"So the choice is simple. Shut it down, or watch our town die.\" How does this ending want you to feel?",
            options: ["Worried, so you agree to shut it", "Calm and relaxed", "Happy about it"],
            slips: { 1: "\"Watch our town die\" is not calming.", 2: "\"Die\" is a scary word. It is not trying to make you happy." },
            hint: "\"Watch our town die\" is a big phrase.", why: "It wants you worried, so you agree with the writer." } } }
      ] },

    /* ---------- chunk 2: points of view ---------- */
    { type: "learn", topic: "Points of view", title: "One article, lots of voices",
      fig: VOICES,
      ez: { title: "Lots of voices", html: "<p>A <b>point of view</b> is what someone thinks.</p>" + NEWS + "<p>Sam likes it. Mo does not. \"Sadly\" shows the <b>writer</b> is not happy.</p>" },
      html: "<p>A <b>point of view</b> is what someone thinks about the issue. News articles often have several.</p>" + NEWS +
        "<p>Sam is <b>for</b> it. Mo is <b>against</b> it. The company is vague. And the writer? Look at the last line: \"Sadly, as usual... actually... ignored\". Little words like these give the writer's own view away.</p>" +
        "<p>Spin doctor tip: the writer also <b>chooses</b> whose voices go in, how much space each gets, and who gets the last word. That choice is a point of view too.</p>",
      lv: { mild: { html: "<p>A <b>point of view</b> is what someone thinks.</p>" + NEWS +
        "<p>Sam likes it. Mo does not. The last line shows what the <b>writer</b> thinks: \"Sadly\" means they are not happy about it.</p>" } } },

    { type: "mc", topic: "Points of view",
      q: "In the news piece, what is the <b>writer's</b> own point of view?",
      options: ["They think the people who live nearby are being ignored, and they are not happy about it", "They are all for the plans, like Sam", "They have no view: the whole piece is neutral", "They think the company will listen to everyone"],
      answer: 0,
      slips: { 1: "That is Sam's view. The writer is a separate voice.", 2: "Most of it is reporting, but \"Sadly, as usual\" in the last line is an opinion.", 3: "The company says that. The writer's last line suggests they do not believe it." },
      hint: "Look at the very last sentence. Which words are opinions?",
      why: "\"Sadly, as usual\" and \"actually\" show the writer sides with the residents and does not trust the company.",
      ez: { why: "\"Sadly\" shows the writer is unhappy.", slips: { 1: "That is Sam. Look at the last line.", 2: "\"Sadly\" shows they care." } },
      lv: { mild: { q: "In the news piece, how does the <b>writer</b> feel?",
        options: ["Unhappy: they think local people will be ignored", "Excited, like Sam", "They do not care"],
        slips: { 1: "That is Sam. Look at the writer's last line.", 2: "\"Sadly\" shows they do care." },
        hint: "Look at the word \"Sadly\".", why: "\"Sadly\" shows the writer is unhappy about it." } },
      vary: [
        { q: "\"The new rules were introduced on Friday. Unbelievably, nobody thought to ask the players.\" What is the writer's view?",
          options: ["They think it is wrong that the players were not asked", "They think the new rules are brilliant", "They have no view at all", "They think the players asked for the rules"],
          answer: 0,
          slips: { 1: "Nothing praises the rules. \"Unbelievably\" is a complaint.", 2: "The first sentence is neutral, but \"Unbelievably\" is an opinion.", 3: "The opposite: nobody asked them." },
          hint: "Which single word shows a feeling?",
          why: "\"Unbelievably\" gives it away: the writer is annoyed the players were left out.",
          ez: { why: "\"Unbelievably\" shows they are annoyed.", slips: { 1: "\"Unbelievably\" is a cross word.", 2: "Ha. Look at \"Unbelievably\"." } },
          lv: { mild: { q: "\"Unbelievably, nobody thought to ask the players.\" How does the writer feel?",
            options: ["Annoyed", "Pleased", "Sleepy"],
            slips: { 1: "\"Unbelievably\" is a cross word, not a pleased one.", 2: "Ha. Look at \"Unbelievably\"." },
            hint: "Look at \"Unbelievably\".", why: "\"Unbelievably\" shows they are annoyed." } } },
        { q: "\"At last, after years of waiting, [[plan]] is finally open.\" What is the writer's view?",
          options: ["They are pleased it has opened, and think it took too long", "They are against it opening", "They have no view", "They think it opened too early"],
          answer: 0,
          slips: { 1: "\"At last\" and \"finally\" are happy, relieved words.", 2: "\"At last\" and \"finally\" are opinions. A neutral version would just say it opened.", 3: "\"After years of waiting\" means the opposite: too late, if anything." },
          hint: "Which words would a neutral report leave out?",
          why: "\"At last\", \"years of waiting\" and \"finally\" show relief and support. A neutral report would just say it opened.",
          ez: { hint: "Something finally happened. How do you feel?", why: "\"At last\" and \"finally\" sound pleased.", slips: { 1: "\"At last\" is a happy phrase.", 2: "Nothing scary here." } },
          lv: { mild: { q: "\"At last, [[plan]] is finally open.\" How does the writer feel?",
            options: ["Pleased", "Angry", "Scared"],
            slips: { 1: "\"At last\" is a relieved, happy phrase.", 2: "Nothing scary in \"finally open\"." },
            hint: "How do you feel when something finally happens?", why: "\"At last\" and \"finally\" sound pleased." } } }
      ] },

    { type: "multi", topic: "Points of view",
      q: "Pick <b>all</b> the words from the news piece that show the writer's opinion.",
      options: ["Sadly", "as usual", "actually", "announced", "Monday", "said"],
      answers: [0, 1, 2],
      slips: { any: "Three of them carry a feeling. \"Announced\", \"Monday\" and \"said\" are plain reporting." },
      hint: "Which words could you remove and still have the facts?",
      why: "\"Sadly\", \"as usual\" and \"actually\" add the writer's feelings. The others just report what happened.",
      ez: { hint: "Which words show a feeling?", slips: { any: "Monday and said are plain words." }, why: "\"Sadly\" and \"as usual\" show a feeling." },
      lv: { mild: { q: "Pick the <b>two</b> words that show a feeling.", options: ["Sadly", "as usual", "Monday", "said"], answers: [0, 1],
        slips: { any: "Two of them carry a feeling. Monday and said are just plain words." }, why: "\"Sadly\" and \"as usual\" show how the writer feels." } },
      vary: [
        { q: "\"The team suffered yet another embarrassing defeat on Saturday, losing 3 0 at home.\" Pick <b>all</b> the words that show the writer's opinion.",
          options: ["suffered", "yet another", "embarrassing", "Saturday", "3 0", "at home"],
          answers: [0, 1, 2],
          slips: { any: "Three of them carry a feeling. The day, the score and the place are facts." },
          why: "\"Suffered\", \"yet another\" and \"embarrassing\" add the writer's view. Saturday, 3 0 and at home can be checked.",
          ez: { hint: "Which word shows a feeling?", slips: { any: "Saturday and team are plain words." }, why: "\"Embarrassing\" is a feeling." },
          lv: { mild: { q: "\"The team had an embarrassing defeat on Saturday.\" Pick the word that shows a feeling.", options: ["embarrassing", "Saturday", "team"], answers: [0],
            slips: { any: "Saturday and team are plain words. Which one is a feeling?" }, why: "\"Embarrassing\" is the writer's feeling." } } },
        { q: "\"Brave volunteers spent a freezing Sunday cleaning the lake, collecting 40 bags of rubbish.\" Pick <b>all</b> the words that show the writer's opinion.",
          options: ["Brave", "freezing", "volunteers", "Sunday", "40 bags", "the lake"],
          answers: [0, 1],
          slips: { any: "Two of them are the writer's own take. The rest are facts you could check. (Freezing can be a fact, but here it is used to make them sound heroic.)" },
          why: "\"Brave\" and \"freezing\" make the volunteers sound heroic. The rest are facts.",
          ez: { q: "\"Brave volunteers cleaned the lake on Sunday.\" Which word is praise?", hint: "Which word is praise?", slips: { any: "Sunday and lake are plain words." }, why: "\"Brave\" is praise." },
          lv: { mild: { q: "\"Brave volunteers cleaned the lake on Sunday.\" Pick the word that shows what the writer thinks.", options: ["Brave", "Sunday", "lake"], answers: [0],
            slips: { any: "Sunday and lake are plain words. Which one is praise?" }, why: "\"Brave\" is the writer praising them." } } }
      ] },

    { type: "mc", topic: "Points of view",
      q: "In the news piece, Mo (against) gets the last quote, and then the writer finishes on \"ignored\". What is the effect of this order?",
      options: ["The reader finishes with the against side ringing in their ears, so they are more likely to side with the residents", "It makes the piece perfectly balanced", "It makes Sam's view seem the strongest", "It has no effect: order does not matter"],
      answer: 0,
      slips: { 1: "Both sides are there, but the order is not neutral. Who gets the last word?", 2: "Sam comes first and is quickly forgotten.", 3: "Order matters a lot. People remember what they hear last." },
      hint: "What is the last thing the reader reads?",
      why: "Choosing who speaks last is a quiet kind of spin. The writer lets the against side and their own view close the piece.",
      ez: { hint: "Read the last line.", why: "The last line says locals are ignored.", slips: { 1: "Look at the writer's last line.", 2: "The writer does not trust the company." } },
      lv: { mild: { q: "In the news piece, whose side is the writer on?", options: ["Mo and the residents", "Sam the shop owner", "The company"],
        slips: { 1: "Sam is quoted, but the writer's last line is about residents being ignored.", 2: "The writer does not trust the company." },
        hint: "Read the last line again.", why: "The last line is about people who live there being ignored. The writer is on their side." },
        medium: { q: "In the news piece, whose side is the writer on, and how can you tell?", options: ["The residents: the last line says they will be ignored", "Sam's: he is quoted first", "The company's: they promise to listen"],
          slips: { 1: "Being quoted first does not mean the writer agrees.", 2: "The writer's \"as usual\" suggests they do not believe the company." },
          hint: "Read the last line again.", why: "The writer finishes on the residents being ignored, with a sad, cross tone. That shows their side." } } },

    /* ---------- chunk 3: facts used for effect ---------- */
    { type: "learn", topic: "Facts used for effect", title: "Facts can be spun too",
      fig: CHARTS,
      ez: { title: "Facts can be spun", html: "<p><b>Numbers</b> and <b>experts</b> sound true.</p><p>Same numbers. One chart makes the gap look big.</p>" },
      html: "<p>Facts sound solid, so writers use them to persuade. But they <b>choose</b> which facts, and how to show them.</p>" +
        "<p><b>Statistics</b> sound certain and scientific. Watch out for small samples (\"9 out of 10 people asked\", but only 10 were asked) and words like \"up to\".</p>" +
        "<p><b>Expert quotes</b> borrow someone's authority. Ask: are they an expert in <b>this</b>?</p>" +
        "<p><b>Charts</b> can spin too. Both charts above show the same numbers, 96 and 94. Start the axis at 90 and a tiny gap looks huge.</p>",
      lv: { mild: { html: "<p>Facts sound true, so writers use them to win you over.</p>" +
        "<p><b>Numbers</b> sound sure. <b>Experts</b> sound clever. But always ask: is the whole story here?</p>" +
        "<p>Both charts show the same numbers. The one on the right makes the gap look much bigger.</p>" } } },

    { type: "mc", topic: "Facts used for effect",
      q: "Why does the writer of the first article include \"Last year, 300 people complained about the traffic\"?",
      options: ["A precise number sounds certain, so the problem seems big and real, not just the writer's opinion", "To show the writer counted the complaints personally", "To give the other side's point of view", "To make the article longer"],
      answer: 0,
      slips: { 1: "We do not know who counted. The point is how the number makes it sound.", 2: "Complaints support the writer's side, not the other side.", 3: "Every sentence in a short argument has a job. This one is evidence." },
      hint: "How does a number make a claim sound?",
      why: "A statistic turns \"people are annoyed\" into something that sounds measured and proven. Spin doctor question: 300 out of how many?",
      ez: { q: "Why say \"300 people complained\"?", hint: "Do numbers sound more true?", why: "A number makes it sound real and big.", slips: { 1: "It is not a joke. It backs up the point.", 2: "The number is there to win you over." } },
      lv: { mild: { q: "Why does the writer say \"300 people complained\"?",
        options: ["A number makes it sound true and big", "To make it funny", "Because they like the number 300"],
        slips: { 1: "Nothing funny here. It is backing up the argument.", 2: "The number is there to persuade you." },
        hint: "Does a number make it sound more true?", why: "A number makes the problem sound real and big." } },
      vary: [
        { q: "An advert says: \"Up to 50% off everything!\" Why is \"up to\" a bit of spin?",
          options: ["Only one item might be 50% off, but the big number sticks in your head", "It means everything is exactly half price", "It means prices have gone up", "It is a guarantee you will save money"],
          answer: 0,
          slips: { 1: "\"Up to\" means as much as. Most things might be much less.", 2: "\"Up to\" is about the discount, not prices rising.", 3: "\"Up to\" promises nothing. It just sets the top limit." },
          hint: "What does \"up to\" actually promise?",
          why: "\"Up to\" sets the maximum. The advert wants you to remember 50% and forget the \"up to\".",
          ez: { q: "\"Up to 50% off!\" Is everything half price?", why: "Only some things might be half price.", slips: { 1: "\"Up to\" means as much as.", 2: "\"Off\" means cheaper." } },
          lv: { mild: { q: "\"Up to 50% off!\" Does that mean everything is half price?",
            options: ["No: only some things might be that cheap", "Yes, everything", "It means it costs more"],
            slips: { 1: "\"Up to\" means as much as. Not everything.", 2: "\"Off\" means cheaper, not more." },
            hint: "\"Up to\" means as much as.", why: "\"Up to\" means only some things might be half price." } } },
        { q: "\"A report found that [[fans]] spend 2 million pounds in the town every year.\" A writer who wants to <b>keep</b> [[plan]] uses this. What effect do they want?",
          options: ["A huge, precise figure makes the benefit feel undeniable, so closing it sounds foolish", "They want the reader to feel the money is wasted", "They want to show both sides fairly", "They want the reader to check the report themselves"],
          answer: 0,
          slips: { 1: "A writer who wants to keep it is using the number as a good thing.", 2: "One big number on one side is not balance.", 3: "They are hoping you will just be impressed, not go and check." },
          hint: "How does 2 million sound next to \"shut it down\"?",
          why: "A big, exact number sounds official and impressive. Spin doctor question: who wrote the report, and how much does the town spend on traffic?",
          ez: { why: "A big number sounds good for the town.", slips: { 1: "Here, spending money is a good thing.", 2: "Big numbers impress people." } },
          lv: { mild: { q: "\"[[Fans]] spend 2 million pounds in the town every year.\" Why use this number?",
            options: ["A big number makes it sound really good for the town", "To make it sound bad", "To make it boring"],
            slips: { 1: "Spending money in the town is shown as a good thing here.", 2: "Big numbers tend to impress, not bore." },
            hint: "Does 2 million sound big?", why: "A big number makes it sound really good for the town." } } }
      ] },

    { type: "num", topic: "Facts used for effect",
      q: "An advert says: \"9 out of 10 [[fans]] loved it!\" The tiny print says: <i>20 people asked</i>. How many people actually said they loved it?",
      boxes: [{ label: "People", a: 18, post: "people" }],
      slips: [[9, "9 out of 10 is a fraction, not the number of people. 20 people were asked."], [90, "90 is the percentage. How many people is 9 out of 10 of 20?"], [10, "Out of 20, not 10. Each 10 people gives 9, so 20 gives twice as many."]],
      hint: "20 is two lots of 10. Each lot of 10 gives 9 people.",
      why: "<b>18</b> people. \"9 out of 10\" sounds like loads, but it is only 18 people. A tiny sample makes the claim sound bigger than it is.",
      ez: { q: "\"9 out of 10 [[fans]] loved it!\" The tiny print says: only 10 people were asked. How many loved it?", why: "<b>9</b> people. It sounds like loads.", slips: [[10, "10 were asked. 9 loved it."], [90, "That is a percentage. How many people?"]] },
      lv: { mild: { q: "\"9 out of 10 [[fans]] loved it!\" The tiny print says <i>only 10 people were asked</i>. How many people loved it?",
        boxes: [{ label: "People", a: 9, post: "people" }], slips: [[10, "10 were asked. 9 out of the 10 loved it."], [90, "That is the percentage. How many people?"]],
        hint: "9 out of 10.", why: "<b>9</b> people. It sounds like loads, but it is just 9 people." } },
      vary: [
        { q: "A headline says: \"Sales DOUBLE!\" The figures: last year 4 tickets were sold. How many tickets were sold this year?",
          boxes: [{ label: "Tickets", a: 8, post: "tickets" }],
          slips: [[2, "Double means twice as many, not half."], [4, "That is last year. Double it."], [6, "Double 4 is 4 + 4."]],
          hint: "Double means two lots.",
          why: "<b>8</b> tickets. \"Sales DOUBLE!\" sounds huge, but it is only 8 tickets. Spin uses the size of the change to hide the size of the numbers.",
          ez: { q: "\"Sales DOUBLE!\" Last year 2 tickets were sold. Double means twice as many. How many now?", why: "<b>4</b> tickets. Big word, small number." },
          lv: { mild: { q: "\"Sales DOUBLE!\" Last year 2 tickets were sold. Double means twice as many. How many this year?",
            boxes: [{ label: "Tickets", a: 4, post: "tickets" }], slips: [[2, "That is last year. Double it."], [1, "Double means more, not less."]],
            hint: "2 + 2.", why: "<b>4</b> tickets. \"DOUBLE!\" sounds big, but it is only 4." } } },
        { q: "\"Complaints have fallen by half!\" The figures: last year there were 6 complaints. How many complaints were there this year?",
          boxes: [{ label: "Complaints", a: 3, post: "complaints" }],
          slips: [[12, "Fallen by half means half as many, not double."], [6, "That is last year. Fallen by half means half of 6."]],
          hint: "Half of 6.",
          why: "<b>3</b> complaints. \"Fallen by half\" sounds like a huge success, but it is a change of 3. Big claim, small numbers.",
          ez: { why: "<b>2</b>. Big word, small number." },
          lv: { mild: { q: "\"Complaints have halved!\" Last year there were 4. Half of 4 is?",
            boxes: [{ label: "Complaints", a: 2, post: "complaints" }], slips: [[8, "Halved means fewer, not more."], [4, "That is last year. Half of it."]],
            hint: "Half of 4.", why: "<b>2</b>. It sounds big, but it is only 2 fewer." } } }
      ] },

    { type: "mc", topic: "Facts used for effect", explain: true,
      q: "A club puts this chart on its website. What is the spin?",
      fig: chart("Happy fans", "Us", 96, "Rivals", 94, 90),
      options: ["The axis starts at 90, so a tiny 2% gap looks huge", "The chart shows the rivals are much happier", "There is no spin: the bars are drawn correctly", "The chart has made up the numbers"],
      answer: 0,
      slips: { 1: "Look at the numbers: 96 is more than 94.", 2: "The bars are the right height for an axis starting at 90. That choice is the spin.", 3: "The numbers might be true. The trick is how they are drawn." },
      hint: "Look at the numbers on the side. Where does the axis start?",
      why: "96 and 94 are almost the same. Starting the axis at 90 stretches a 2% gap into a giant one. True numbers, spun picture.",
      ez: { q: "96 and 94 are close. Do the bars look close?", hint: "Look at the bars.", why: "A tiny gap looks big. That is spin.", slips: { 1: "Look again. One bar is much taller.", 2: "The Us bar is the tall one." } },
      lv: { mild: { q: "This chart shows 96 and 94. They are nearly the same. Does the chart make them look nearly the same?",
        options: ["No: one bar looks much bigger than it should", "Yes, they look the same", "The rivals look bigger"],
        slips: { 1: "Look again: one bar is much taller.", 2: "The Us bar is the tall one." },
        hint: "Look at how tall the bars are.", why: "The chart makes a tiny gap look big. That is spin." } },
      vary: [
        { q: "A council poster shows this chart about recycling. What is the spin?",
          fig: chart("Homes recycling", "This year", 82, "Last year", 80, 76),
          options: ["The axis starts at 76, so a 2% rise looks like a massive jump", "Recycling has gone down", "The chart is honest because the axis starts at zero", "The poster is hiding that recycling doubled"],
          answer: 0,
          slips: { 1: "82 is more than 80. It went up, a little.", 2: "Look at the bottom number on the axis. It is not zero.", 3: "From 80 to 82 is a small rise, not double." },
          hint: "Find the lowest number on the axis.",
          why: "82 and 80 are close. An axis starting at 76 makes the difference look three times as big.",
          ez: { q: "82 and 80 are close. Do the bars look close?", hint: "Look at the bars.", slips: { 1: "Look again. One bar is much taller." } },
          lv: { mild: { q: "This chart shows 82 and 80. Nearly the same. Does it make them look nearly the same?",
            fig: chart("Homes recycling", "This year", 82, "Last year", 80, 76),
            options: ["No: one bar looks much bigger", "Yes, they look the same", "Last year looks bigger"],
            slips: { 1: "Look again: one bar is much taller.", 2: "This year is the tall one." },
            hint: "Look at how tall the bars are.", why: "A tiny gap looks big. That is spin." } } },
        { q: "Here is the same kind of chart drawn a different way. Is there spin in how it is drawn?",
          fig: chart("Happy [[fans]]", "Us", 96, "Rivals", 94, 0),
          options: ["No: the axis starts at 0, so the bars honestly look almost the same", "Yes: the axis should start at 90", "Yes: the rivals look much happier", "Yes: the bars are too tall"],
          answer: 0,
          slips: { 1: "Starting at 90 is the trick that exaggerates the gap.", 2: "The bars are nearly the same, because the numbers are nearly the same.", 3: "Tall bars are fine when the numbers are high." },
          hint: "Where does this axis start?",
          why: "With the axis at 0, 96 and 94 look as close as they really are. Being able to say \"no spin here\" is part of the skill too.",
          ez: { q: "96 and 94 are close. Do the bars look close?", why: "This chart is fair. Close numbers, close bars.", slips: { 1: "Look again. They are almost the same." } },
          lv: { mild: { q: "This chart shows 96 and 94. Do the bars look nearly the same?",
            fig: chart("Happy [[fans]]", "Us", 96, "Rivals", 94, 0),
            options: ["Yes: this one is fair", "No, one is much bigger", "The rivals look bigger"],
            slips: { 1: "Look again: they are almost the same.", 2: "They are almost the same height." },
            hint: "Look at the bars.", why: "This chart is fair: close numbers, close bars." } } }
      ] },

    { type: "mc", topic: "Facts used for effect",
      q: "\"[[Expert]] says [[plan]] is the best thing to happen to the town in fifty years.\" Why include this quote?",
      options: ["An expert sounds trustworthy, so their opinion feels like a fact, even though it is still an opinion", "Because it is a fact that can be checked", "To show the other side of the argument", "Because experts are never wrong"],
      answer: 0,
      slips: { 1: "\"The best thing in fifty years\" is a judgement. An expert said it, but it is still an opinion.", 2: "It supports the writer's side.", 3: "Experts can be wrong, and an opinion from an expert is still an opinion." },
      hint: "Is \"the best thing in fifty years\" checkable?",
      why: "The expert's title lends authority. Spin doctor question: is this person an expert in towns, or in something else?",
      ez: { why: "Experts sound like they know. You believe them.", slips: { 1: "Experts can make mistakes too.", 2: "It is there to win you over." } },
      lv: { mild: { q: "\"[[Expert]] says it is the best thing ever.\" Why put an expert in?",
        options: ["Experts sound like they know, so you believe it more", "Experts are always right", "To make it funny"],
        slips: { 1: "Experts can still be wrong, and \"best thing ever\" is an opinion.", 2: "It is there to persuade, not to be funny." },
        hint: "Why do we listen to experts?", why: "An expert sounds like they know, so you believe it more." } },
      vary: [
        { q: "An advert for trainers says: \"Famous pop star Kai Lee says these trainers make you run faster.\" What is the spin?",
          options: ["Kai Lee is famous, but not an expert in running or trainers, so it is borrowed fame, not evidence", "Kai Lee is a running scientist, so it must be true", "The advert gives a statistic", "The advert shows both sides"],
          answer: 0,
          slips: { 1: "Kai Lee is a pop star. Being famous is not the same as being an expert.", 2: "No numbers here, only a famous name.", 3: "Only one side is here: buy them." },
          hint: "What is Kai Lee famous for?",
          why: "Using a celebrity borrows their fame. It feels convincing, but it tells you nothing about running.",
          ez: { why: "Famous is not the same as expert.", slips: { 1: "Pop stars know about music.", 2: "TV does not make you an expert." } },
          lv: { mild: { q: "\"Pop star Kai Lee says these trainers make you run faster.\" Is a pop star an expert on running?",
            options: ["No: they are famous, but not a running expert", "Yes, pop stars know everything", "Yes, because they are on TV"],
            slips: { 1: "Pop stars know about music, not trainers.", 2: "Being on TV does not make you an expert." },
            hint: "What do pop stars know about?", why: "Famous is not the same as expert." } } },
        { q: "To end an argument, a TV presenter says: \"As my grandad always said: stop.\" Does quoting a wise relative make the argument stronger?",
          options: ["It sounds wise and final, but it is not evidence: it just borrows someone's authority", "Yes: it is a statistic", "Yes: grandfathers are experts in everything", "No: it makes the presenter sound unsure"],
          answer: 0,
          slips: { 1: "No numbers here. It is a quote.", 2: "Loved and wise, yes. Expert in this argument? We do not know.", 3: "It sounds very sure. That is why it works." },
          hint: "Does it prove anything, or does it just sound good?",
          why: "Quoting someone respected makes a point feel settled. It is persuasive, but it is not proof. (It does usually work in Base 5, mind.)",
          ez: { why: "It sounds wise, but proves nothing.", slips: { 1: "It is a quote, not a fact." } },
          lv: { mild: { q: "A TV presenter says: \"As my grandad always said: stop.\" Does it prove the presenter is right?",
            options: ["No, but it sounds wise and makes people stop", "Yes, it is a fact", "It is a number"],
            slips: { 1: "It is a quote, not a fact you can check.", 2: "No numbers here." },
            hint: "Can you check it?", why: "It sounds wise, but it does not prove anything. It still works, though." } } }
      ] },

    /* ---------- chunk 4: opinions in disguise ---------- */
    { type: "learn", topic: "Opinions in disguise", title: "Spot it, name it, say what it does",
      fig: WORDS,
      ez: { title: "Loaded words", html: "<p><b>Loaded words</b> carry a feeling. \"Blasted\" is a loaded \"said\".</p><p class=\"a2task\">\"Greedy bosses have ruined [[plan]].\"<br><b>1 Spot it:</b> Greedy, ruined.<br><b>2 Name it:</b> loaded words.<br><b>3 What it does:</b> makes you cross.</p>" },
      html: "<p>Opinions often dress up to look like something else.</p>" +
        "<p><b>Loaded words</b> carry a feeling: \"blasted\" instead of \"said\", \"disaster\" instead of \"change\". <b>Opinion as fact:</b> \"Everyone knows...\", \"Clearly...\", \"The truth is...\". <b>Generalising:</b> \"all\", \"always\", \"never\".</p>" +
        "<p class=\"a2task\">Worked example: \"Greedy bosses have ruined [[plan]] again.\"<br><b>1 Spot it:</b> \"Greedy\", \"ruined\", \"again\".<br><b>2 Name it:</b> loaded words.<br><b>3 Say what it does:</b> they make the bosses sound selfish and the damage sound permanent, so the reader feels angry and blames the bosses, without any evidence being given.</p>" +
        "<p>Next, some parts are filled in for you, then you try one on your own.</p>",
      lv: {
        mild: { html: "<p>Some words carry a feeling. They are called <b>loaded words</b>. \"Blasted\" is a loaded way of saying \"said\".</p>" +
          "<p class=\"a2task\">Example: \"Greedy bosses have ruined [[plan]].\"<br><b>1 Spot it:</b> \"Greedy\", \"ruined\".<br><b>2 Name it:</b> loaded words.<br><b>3 What it does:</b> makes you cross with the bosses.</p>" },
        medium: { html: "<p>Opinions often dress up. <b>Loaded words</b> carry a feeling (\"blasted\", \"disaster\"). <b>Opinion as fact</b> starts with \"Everyone knows...\" or \"Clearly...\".</p>" +
          "<p class=\"a2task\">Worked example: \"Greedy bosses have ruined [[plan]] again.\"<br><b>1 Spot it:</b> \"Greedy\", \"ruined\".<br><b>2 Name it:</b> loaded words.<br><b>3 What it does:</b> makes the reader angry with the bosses.</p>" } } },

    { type: "sort", topic: "Opinions in disguise",
      q: "Sort the ways of reporting the same thing: <b>neutral</b> or <b>loaded</b>?",
      buckets: ["Neutral", "Loaded"],
      cards: [["The manager said", 0], ["The manager raged", 1], ["Prices rose", 0], ["Prices rocketed", 1], ["A group of [[fans]]", 0], ["A mob of [[fans]]", 1], ["The plan changed", 0], ["The plan was wrecked", 1]],
      slips: { any: "Ask: does this word add a feeling, or just say what happened?" },
      hint: "Raged, rocketed, mob and wrecked all add drama.",
      why: "Loaded words do the same job as neutral ones, plus a feeling. That extra feeling is the spin.",
      ez: { q: "Sort: <b>plain</b> or <b>loaded</b>?", hint: "Loaded words add drama.", slips: { any: "Does it add a feeling?" }, why: "Loaded words add a feeling. That is spin." },
      lv: { mild: { q: "Sort the words: <b>plain</b> or <b>loaded</b> with a feeling?", buckets: ["Plain", "Loaded"], cards: [["said", 0], ["raged", 1], ["a group", 0], ["a mob", 1]] } },
      vary: [
        { cards: [["The player left the club", 0], ["The player betrayed the club", 1], ["The council decided", 0], ["The council forced it through", 1], ["Some people complained", 0], ["Furious locals slammed it", 1], ["It costs more than planned", 0], ["It is a shocking waste", 1]],
          ez: { q: "Sort: <b>plain</b> or <b>loaded</b>?", hint: "Loaded words add drama.", slips: { any: "Does it add a feeling?" }, why: "Loaded words add a feeling. That is spin." },
          lv: { mild: { q: "Sort the words: <b>plain</b> or <b>loaded</b> with a feeling?", buckets: ["Plain", "Loaded"], cards: [["left", 0], ["betrayed", 1], ["complained", 0], ["slammed", 1]] } } },
        { cards: [["Volunteers helped", 0], ["Heroes stepped in", 1], ["The building is old", 0], ["The building is crumbling", 1], ["The crowd was loud", 0], ["The crowd was deafening", 1], ["The idea is new", 0], ["The idea is genius", 1]],
          ez: { q: "Sort: <b>plain</b> or <b>loaded</b>?", hint: "Loaded words add drama.", slips: { any: "Does it add a feeling?" }, why: "Loaded words add a feeling. That is spin." },
          lv: { mild: { q: "Sort the words: <b>plain</b> or <b>loaded</b> with a feeling?", buckets: ["Plain", "Loaded"], cards: [["helpers", 0], ["heroes", 1], ["old", 0], ["crumbling", 1]] } } }
      ] },

    { type: "mc", topic: "Opinions in disguise",
      q: "\"Everyone knows [[plan]] is a waste of money.\" What is the trick, and what does it do?",
      options: ["An opinion dressed up as a fact: \"Everyone knows\" makes the reader feel silly for disagreeing", "A statistic: it gives the exact cost", "An expert quote: it borrows someone's authority", "A neutral fact: it can be checked"],
      answer: 0,
      slips: { 1: "There is no number here.", 2: "No expert is named. \"Everyone\" is nobody in particular.", 3: "\"A waste of money\" is a judgement. You could not check what everyone knows." },
      hint: "Could you check what \"everyone\" knows?",
      why: "\"Everyone knows\" pretends the opinion is already agreed. It pressures the reader to go along with it.",
      ez: { hint: "Can you check what everyone knows?", why: "It is an opinion dressed as a fact.", slips: { 1: "A waste of money is what someone thinks.", 2: "There is no number here." } },
      lv: { mild: { q: "\"Everyone knows [[plan]] is a waste of money.\" Is this a fact or an opinion?",
        options: ["An opinion pretending to be a fact", "A fact", "A number"],
        slips: { 1: "\"A waste of money\" is what someone thinks.", 2: "There is no number here." },
        hint: "Could you check what everyone knows?", why: "It is an opinion dressed up as a fact." } },
      vary: [
        { q: "Two headlines for the same news. A: \"Council approves [[plan]]\". B: \"Council forces [[plan]] on furious locals\". What has headline B done?",
          options: ["Used loaded words, \"forces\" and \"furious\", to make the reader side against the council", "Given more facts than headline A", "Stayed neutral, just like A", "Shown the council's point of view"],
          answer: 0,
          slips: { 1: "B has no extra facts, just extra feeling.", 2: "\"Forces\" and \"furious\" are not neutral words.", 3: "B makes the council sound like a bully. That is not their view." },
          hint: "Which words in B are not in A?",
          why: "Same event, different words. \"Forces\" and \"furious\" spin it so the council looks like a bully.",
          ez: { why: "B uses loaded words. The council looks bad.", slips: { 1: "A is plain. Look for forces and furious.", 2: "Forces and furious are loaded." } },
          lv: { mild: { q: "Headline A: \"Council approves [[plan]]\". Headline B: \"Council forces [[plan]] on furious locals\". Which one has loaded words?",
            options: ["B", "A", "Neither"], fixed: true,
            slips: { 1: "A is plain. Look for forces and furious.", 2: "\"Forces\" and \"furious\" are loaded." },
            hint: "Look for forces and furious.", why: "B uses loaded words to make the council look bad." } } },
        { q: "\"[[Fans]] always leave rubbish everywhere.\" What is the trick?",
          options: ["A generalisation: \"always\" and \"everywhere\" make a few cases sound like every single time", "A statistic: it says how much rubbish", "A fair point that shows both sides", "A fact you could easily check"],
          answer: 0,
          slips: { 1: "There is no number, just \"always\".", 2: "There is only one side here, and it is not kind.", 3: "You could never check \"always\" and \"everywhere\"." },
          hint: "Look at \"always\" and \"everywhere\".",
          why: "Words like \"always\", \"never\" and \"all\" stretch a few examples into a rule. It makes the reader judge a whole group.",
          ez: { why: "\"Always\" turns a few times into every time.", slips: { 1: "Every person, every time? You cannot check that.", 2: "\"Always\" is not a number." } },
          lv: { mild: { q: "\"[[Fans]] always leave rubbish everywhere.\" Is \"always\" fair?",
            options: ["No: it makes it sound like every single time", "Yes, it is a fact", "It is a number"],
            slips: { 1: "Every single person, every single time? You could not check that.", 2: "\"Always\" is not a number." },
            hint: "Every single time?", why: "\"Always\" stretches a few times into every time." } } }
      ] },

    { type: "text", topic: "Opinions in disguise",
      q: "Steps 1 and 2 are done. Have a go at step 3.<br>\"Reckless [[fans]] have trashed the town yet again.\"<br><b>1 Spot it:</b> \"Reckless\", \"trashed\", \"yet again\". <b>2 Name it:</b> loaded words. <b>3 What it does to the reader:</b>",
      need: [["angry", "cross", "annoy", "blame", "bad", "against", "dislike", "hate", "judge", "worse", "negative", "think", "feel", "believe", "side", "upset", "disgust"]],
      slips: [[["persuade", "convince"], "True, but persuade them to think what? Name the feeling or the view it pushes."]],
      model: "They make the [[fans]] sound careless and the damage sound huge, so the reader feels angry and blames them, without any evidence.",
      hint: "How do these words want you to feel about the [[fans]]?",
      why: "Loaded words push a feeling (anger, blame) without proving anything. Saying that is what makes it a comment, not just spotting.",
      ez: { q: "\"Reckless [[fans]] have trashed the town.\" Loaded words: Reckless, trashed. Finish: \"They make the reader feel...\"", hint: "How do you feel about the [[fans]]?", why: "Loaded words push a feeling, like anger.", slips: [[["persuade", "convince"], "Yes. But what feeling?"]] },
      lv: { mild: { q: "\"Reckless [[fans]] have trashed the town.\" The loaded words are \"Reckless\" and \"trashed\". Finish: \"They make the reader feel...\"",
        model: "They make the reader feel angry with the [[fans]]." } },
      vary: [
        { q: "Steps 1 and 2 are done. Have a go at step 3.<br>\"Clearly, [[plan]] is the best thing ever to happen here.\"<br><b>1 Spot it:</b> \"Clearly\". <b>2 Name it:</b> opinion presented as fact. <b>3 What it does to the reader:</b>",
          need: [["agree", "silly", "obvious", "fact", "true", "question", "doubt", "argue", "pressure", "push", "certain", "sure", "believe", "accept", "convince"]],
          slips: [[["interesting", "good"], "Say what \"Clearly\" does to someone who might disagree."]],
          model: "It makes the opinion sound obvious and certain, so the reader feels silly to disagree and accepts it.",
          hint: "What does \"Clearly\" suggest about anyone who disagrees?",
          why: "\"Clearly\" presents an opinion as if it is already proven, pressuring the reader to agree without evidence.",
          ez: { q: "\"Clearly, [[plan]] is the best thing ever.\" Trick word: Clearly. Finish: \"It makes the reader...\"", hint: "What if you disagree?", why: "\"Clearly\" makes an opinion sound true.", slips: [[["interesting", "good"], "What does Clearly do to you?"]] },
          lv: { mild: { q: "\"Clearly, [[plan]] is the best thing ever.\" The trick word is \"Clearly\". Finish: \"It makes the reader...\"",
            model: "It makes the reader think it must be true." } } },
        { q: "Steps 1 and 2 are done. Have a go at step 3.<br>\"Dr Ray, a top scientist, says [[trip]] is totally safe.\"<br><b>1 Spot it:</b> \"Dr Ray, a top scientist\". <b>2 Name it:</b> expert quote. <b>3 What it does to the reader:</b>",
          need: [["trust", "believe", "safe", "sure", "true", "convinc", "reliab", "author", "confident", "reassur", "know", "expert", "worry"]],
          slips: [[["interesting", "good"], "Say how the title \"top scientist\" changes how much the reader believes it."]],
          model: "It makes the claim sound trustworthy, so the reader believes it is safe, even though we are not told what Dr Ray is an expert in.",
          hint: "Why does \"top scientist\" make you believe it more?",
          why: "An expert quote borrows authority. The reader trusts the claim, often without asking if the expert knows about this topic.",
          ez: { q: "\"Dr Ray, a top scientist, says it is totally safe.\" Finish: \"Using an expert makes the reader...\"", hint: "Do you trust a top scientist?", why: "An expert makes you believe it more.", slips: [[["interesting", "good"], "Do you believe it more or less?"]] },
          lv: { mild: { q: "\"Dr Ray, a top scientist, says it is totally safe.\" Finish: \"Using an expert makes the reader...\"",
            model: "Using an expert makes the reader believe it more." } } }
      ] },

    { type: "text", topic: "Opinions in disguise", stretch: true,
      q: "On your own, if you fancy it. \"Only a fool would vote against [[plan]].\" Name the trick <b>and</b> say what it does to the reader.",
      need: [["loaded", "fool", "insult", "emotive", "opinion", "word", "pressure", "attack", "name"], ["silly", "stupid", "agree", "embarrass", "pressure", "scared", "afraid", "fool", "feel", "against", "vote", "think", "push", "nobody wants"]],
      slips: [[["persuade", "convince"], "Good start. Now say how: what does the word \"fool\" make the reader worry about?"]],
      model: "The writer uses the loaded word \"fool\". It makes the reader feel they would look stupid if they disagreed, so they are pushed to agree.",
      hint: "Trick: which word is an insult? Effect: how would you feel about disagreeing?",
      why: "Calling anyone who disagrees a fool is loaded language. It pressures the reader through embarrassment instead of evidence.",
      ez: { hint: "How would you feel disagreeing?", why: "\"Fool\" makes you scared to disagree.", slips: [[["persuade", "convince"], "Good start. What does fool make you worry about?"]] },
      lv: { mild: { q: "If you fancy it: \"Only a fool would vote against [[plan]].\" The loaded word is \"fool\". Finish: \"It makes the reader...\"",
        need: [["silly", "stupid", "agree", "embarrass", "scared", "afraid", "fool", "feel", "vote", "think", "bad"]],
        model: "It makes the reader scared of looking silly, so they agree." } } }
  ],

  realWorld: {
    title: "Spin is everywhere",
    html: "<p>Adverts, news headlines, posts online, even school election speeches. Every time someone wants you to buy, vote, click or agree, there is a chance of spin. You now have the detector: follow the line, check whose voice it is, ask how the facts are being used, and spot opinions in disguise.</p>" +
      "<p>For our big question: imagine an advert. \"TimeHop! 9 out of 10 travellers came home!\" Detector on. What happened to the tenth? If we could time travel, should we? You would want the facts without the spin before deciding.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay by the time portal, suspicious of a time travel advert">' + A.portal(76, 75, 56) + A.jay(240, 60, 0.85, "hmm") +
      A.bubble(286, 8, 126, 52, "And the\ntenth one?", 290) + '</svg>'
  },

  ez: {
    realWorld: { title: "Spin is everywhere", html: "<p>Adverts. Headlines. Posts online.</p><p>\"9 out of 10 time travellers came home!\" And the tenth?</p>" },
    make: { intro: "Catch some spin, or make one up. Name the trick." }
  },

  make: {
    title: "Make a spin report",
    intro: "Catch some spin from an advert, a headline or a post, or make one up. Say the claim, the trick and what it is trying to do to you. Keep it, stick it up, or send it to Jay.",
    fields: [
      { id: "claim", label: "The claim I caught", ph: "Everyone knows our pizza is the best in town.", max: 70 },
      { id: "trick", label: "The trick", ph: "Opinion dressed up as a fact", max: 34 },
      { id: "effect", label: "What it wants me to think or feel", ph: "That I would be silly to eat anywhere else.", max: 70 },
      { id: "name", label: "Detective", ph: "B5", max: 24 }
    ],
    svg: function(v){
      var c = wrap('"' + (v.claim || "") + '"', 34, 2), ef = wrap(v.effect, 34, 2);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#2d2466"/>' +
        '<rect x="16" y="16" width="568" height="368" rx="18" fill="#fffdf6"/>' +
        T(40, 62, "SPIN REPORT", 26, { b: 1, c: "#8a5cf6" }) +
        T(40, 98, "CLAIM", 13, { b: 1, c: "#5b6180" }) + c.map(function(l, k){ return T(40, 124 + k * 26, esc(l), 18, { b: 1 }); }).join("") +
        T(40, 196, "TRICK", 13, { b: 1, c: "#5b6180" }) + T(40, 222, esc(wrap(v.trick, 34, 1)[0] || ""), 18, { b: 1, c: "#c4461f" }) +
        T(40, 262, "WHAT IT WANTS ME TO THINK", 13, { b: 1, c: "#5b6180" }) + ef.map(function(l, k){ return T(40, 288 + k * 26, esc(l), 17); }).join("") +
        T(40, 362, "Detective: " + esc(wrap(v.name, 24, 1)[0] || ""), 15, { b: 1, c: "#5b6180" }) +
        '<g transform="translate(500 120)">' + dial(0, 0, 60, 0.85) + T(0, 26, "SPIN", 14, { a: "middle", b: 1 }) + '</g>' +
        '<g transform="translate(500 300) rotate(-12)"><rect x="-70" y="-24" width="140" height="48" rx="8" fill="none" stroke="#8a5cf6" stroke-width="5"/>' + T(0, 8, "CAUGHT", 22, { a: "middle", b: 1, c: "#8a5cf6" }) + '</g>' +
        '</svg>';
    }
  }
};
})();
