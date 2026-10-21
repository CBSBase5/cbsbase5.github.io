/* Base 5 Autumn 2 activity: My yes, my no.
   Relational (PSHE and RSE), Building connections: assertiveness.
   Noticing your body's no signals, ways of saying no that feel OK,
   and really listening when someone else says no. Everyday,
   friendly situations only. Calm, no judgement. ASCII only. */
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

/* an outline person with the places a no signal often shows up */
function outline(x, y, col){
  return '<g transform="translate(' + x + ' ' + y + ')">' +
    '<circle cx="0" cy="-92" r="26" fill="#f6d1b0" stroke="#141a33" stroke-width="2.5"/>' +
    '<path d="M-34 -58q34 -12 68 0l10 70q-8 6 -16 0l-4 -40v110h-18l-6 -64l-6 64h-18v-110l-4 40q-8 6 -16 0z" fill="' + (col || "#cfe8f5") + '" stroke="#141a33" stroke-width="2.5" stroke-linejoin="round"/>' +
    '</g>';
}
function spot(x, y, col){ return '<circle cx="' + x + '" cy="' + y + '" r="9" fill="' + col + '" stroke="#141a33" stroke-width="2"/>'; }
function lab(x1, y1, x2, y2, s, a){ return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="#141a33" stroke-width="1.5"/>' + T(x2 + (a === "end" ? -6 : 6), y2 + 5, s, 13, { b: 1, a: a }); }

/* body signals */
var BODY = '<svg viewBox="0 0 520 260" role="img" aria-label="An outline of a person with body signals marked: hot face, tense shoulders, heart beating faster, tight tummy, clenched hands, feet wanting to move away">' +
  '<rect width="520" height="260" rx="16" fill="#f4f1ea"/>' +
  outline(260, 140) +
  spot(260, 46, "#ff8a5c") + lab(272, 46, 360, 30, "Hot face") +
  spot(236, 86, "#ffd23f") + lab(226, 86, 150, 60, "Tense shoulders", "end") +
  spot(272, 100, "#ff5d8f") + lab(282, 100, 370, 86, "Heart beating faster") +
  spot(260, 130, "#8a5cf6") + lab(270, 132, 370, 140, "Tight or fluttery tummy") +
  spot(214, 152, "#19c39a") + lab(204, 152, 150, 150, "Clenched hands", "end") +
  spot(244, 238, "#22b8e6") + lab(234, 238, 150, 222, "Want to step away", "end") +
  A.egg('<g transform="translate(470 222)">' + A.bonnie(0, 0, 0.36, "sit") + '</g>', "Bonnie has a very clear no. When it rains, she sits down on the path and will not move. Jay always listens.") +
  '</svg>';

/* ways of saying no */
var WAYS = '<svg viewBox="0 0 520 220" role="img" aria-label="Three ways of saying no: words, your body, and not right now">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  [["Words", "#ffd23f", '"No thanks."'], ["Body", "#22b8e6", "Shake your head"], ["Not yet", "#19c39a", '"Not right now."']].map(function(c, k){
    var x = 90 + k * 170;
    return '<g transform="translate(' + x + ' 0)"><rect x="-74" y="20" width="148" height="180" rx="16" fill="' + c[1] + '" fill-opacity=".3" stroke="#141a33" stroke-width="2"/>' +
      T(0, 50, c[0], 17, { a: "middle", b: 1 }) +
      (k === 1 ? '<circle cx="0" cy="110" r="28" fill="#f6d1b0" stroke="#141a33" stroke-width="2.5"/><circle cx="-9" cy="104" r="3" fill="#141a33"/><circle cx="9" cy="104" r="3" fill="#141a33"/><path d="M-9 122h18" stroke="#141a33" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M-46 100q-8 10 0 20M46 100q8 10 0 20" fill="none" stroke="#141a33" stroke-width="3" stroke-linecap="round"/>'
       : '<rect x="-58" y="78" width="116" height="54" rx="14" fill="#ffffff" stroke="#141a33" stroke-width="2"/><path d="M-20 132l-6 16 22 -16" fill="#ffffff" stroke="#141a33" stroke-width="2" stroke-linejoin="round"/>' + T(0, 111, c[2], 13, { a: "middle", b: 1 })) +
      T(0, 182, k === 1 ? c[2] : "Calm and clear", 13, { a: "middle" }) + '</g>';
  }).join("") + '</svg>';

/* hearing a no */
var HEAR = '<svg viewBox="0 0 520 200" role="img" aria-label="Jay asks to borrow something, the answer is no, and Jay says no worries">' +
  '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  A.jay(110, 112, 0.9, "smile") + A.bubble(30, 14, 170, 48, "Can I borrow\n[[item]]?", 100) +
  '<g transform="translate(400 112)"><circle cx="0" cy="-10" r="30" fill="#f6d1b0" stroke="#141a33" stroke-width="2.5"/><circle cx="-10" cy="-16" r="3" fill="#141a33"/><circle cx="10" cy="-16" r="3" fill="#141a33"/><path d="M-9 2h18" stroke="#141a33" stroke-width="3" stroke-linecap="round"/><path d="M-36 24q36 -10 72 0v50h-72z" fill="#8a5cf6" stroke="#141a33" stroke-width="2.5"/></g>' +
  A.bubble(330, 14, 150, 44, "Nah, not today.", 390) +
  '<rect x="160" y="150" width="200" height="38" rx="12" fill="#19c39a" fill-opacity=".35" stroke="#141a33" stroke-width="2"/>' + T(260, 175, "\"No worries.\"", 16, { a: "middle", b: 1 }) +
  '</svg>';

/* my no phrases picker */
var PHRASES = ["No thanks.", "Not right now.", "I'd rather not.", "Nah, I'm alright.", "Maybe another time.", "No, but we could do something else.",
  "I need a minute.", "A shake of my head", "A hand up, like stop", "Stepping away", "Getting Jay or another adult", "Pointing to a no card"];
function phraseWidget(el, api){
  var d = api.data || {};
  if(!Array.isArray(d.on)) d.on = [];
  el.innerHTML = '<div class="a2task"><h4>My ways of saying no</h4><p>Tap any that feel OK for you, or that you might try. Everyone\'s list is different, and you can change it any time.</p>' +
    '<div class="hp" style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0"></div>' +
    '<label style="display:flex;flex-direction:column;gap:4px;font-weight:700;margin-top:6px">My own way<input type="text" maxlength="60" class="ho" style="font:inherit;font-weight:400;padding:8px;border-radius:10px;border:2px solid #141a33;background:#fffdf8"></label>' +
    '<p class="hn" style="font-weight:700;margin:8px 0 0"></p></div>';
  var host = el.querySelector(".hp"), other = el.querySelector(".ho"), note = el.querySelector(".hn");
  function count(){ var n = d.on.filter(Boolean).length + (d.other && d.other.trim() ? 1 : 0); note.textContent = n ? n + " on your list." : ""; }
  PHRASES.forEach(function(t, k){
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

(window.A2PACKS = window.A2PACKS || {})["my-yes-my-no"] = {
  a2: true,
  id: "a2-my-yes-my-no",
  title: "My yes, my no",
  subject: "Relational",
  bodyClass: "subj-home subj-pillar",
  mins: 20,
  line: "Noticing your body's no, saying no in a way that feels OK, and hearing it when someone else says no.",
  blurb: "Everyone gets to say yes, no or not right now. Four short chunks: your body's no signals, ways of saying no, really listening to someone else's no, and your own list. A yes and no card to make at the end.",
  note: "My yes, my no: noticing when you do not want to do something, ways of saying so, and hearing someone else's no. Four five minute chunks and a card to make, whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Tune in", line: "Tune in: the main signals and some simple ways of saying no." },
    { id: "medium", name: "Speak up", line: "Speak up: why the signals happen, and picking the right way to say it." },
    { id: "spicy", name: "Ally mode", line: "Ally mode: pressure tricks, and backing up other people's no as well as your own." }
  ],
  themes: {
    time: { name: "Time travel", w: { ask: "a time traveller asks to borrow your time pod for the weekend", item: "the time pod remote", mate: "Zed the time traveller" } },
    football: { name: "Football", w: { ask: "a mate asks to swap your signed shirt for his old one", item: "your football", mate: "your teammate" } },
    horror: { name: "Horror", w: { ask: "a friend wants to watch the scariest film ever, at midnight", item: "your torch", mate: "your friend" } },
    fishing: { name: "Fishing", w: { ask: "someone at the lake asks to borrow your best rod", item: "your bait box", mate: "your fishing buddy" } },
    music: { name: "Music", w: { ask: "a friend wants to post a video of you singing", item: "your headphones", mate: "your bandmate" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: WAYS,
  steps: [

    /* ---------- chunk 1: step 1, what a no feels like in my body ---------- */
    { type: "learn", topic: "Body signals", title: "Your body often knows first",
      fig: BODY,
      html: "<p>Imagine [[ask]]. Maybe you are fine with it. Maybe you are not.</p>" +
        "<p>When you do not want to do something, your body often notices first. You might get a <b>tight or fluttery tummy</b>, a <b>hot face</b>, a <b>faster heartbeat</b>, <b>tense shoulders</b> or <b>clenched hands</b>, or just want to <b>step away</b> or go quiet.</p>" +
        "<p>These are your body's no signals. They are useful information, not something wrong with you. Everyone's are a bit different.</p>",
      lv: {
        medium: { html: "<p>Imagine [[ask]]. Your body might answer before you do.</p>" +
          "<p>Your brain is always checking whether things feel OK. When something does not, it gives your body a nudge: a <b>tight tummy</b>, a <b>hot face</b>, a <b>faster heartbeat</b>, <b>tense shoulders</b>, <b>clenched hands</b>, or wanting to <b>step away</b>.</p>" +
          "<p>Noticing the nudge early gives you time to choose what you want to say. Everyone's signals are a bit different, and that is fine.</p>" },
        spicy: { html: "<p>Imagine [[ask]]. Before you have thought it through, your body may already have an opinion.</p>" +
          "<p>A part of your brain called the <b>amygdala</b> checks every situation for anything that does not feel OK. If it is unsure, it switches on your body's alarm: faster heart, hot face, tight tummy, tense muscles, the urge to step away or freeze. People call it a <b>gut feeling</b>.</p>" +
          "<p>Nervous excitement can feel similar, so it helps to check in: is this a <b>not right now</b>, a <b>not ever</b>, or actually a nervous <b>yes</b>? You are the one who decides.</p>" } } },

    { type: "multi", topic: "Body signals",
      q: "Pick <b>all</b> the things that can be a body's no signal.",
      fig: BODY,
      options: ["A tight or fluttery tummy", "A hot face", "Wanting to step away", "A heart beating faster", "Feeling relaxed and comfy"],
      answers: [0, 1, 2, 3],
      slips: { any: "Four of them can be no signals. Relaxed and comfy usually means things feel OK." },
      hint: "Look at the picture.",
      why: "A tight tummy, a hot face, wanting to step away and a faster heartbeat can all be your body saying no. Relaxed and comfy is more of a yes feeling.",
      lv: { spicy: { options: ["A tight or fluttery tummy", "A hot face", "Wanting to step away", "A heart beating faster", "Freezing and going quiet", "Feeling relaxed and comfy"], answers: [0, 1, 2, 3, 4],
        slips: { any: "Five of them can be no signals, freezing included. Relaxed and comfy usually means things feel OK." },
        why: "All of those except relaxed and comfy can be your body's alarm. Freezing and going quiet is one people often miss." } } },

    { type: "match", topic: "Body signals",
      q: "Match each signal to where you might feel it.",
      pairs: [["Butterflies", "Tummy"], ["Hot cheeks", "Face"], ["Thumping", "Heart"], ["Clenched", "Hands"]],
      slips: { any: "Think about where in your body you would notice each one." },
      hint: "Hot cheeks are on your face.",
      why: "Butterflies in your tummy, hot cheeks on your face, a thumping heart, clenched hands. Noticing where is the first step." },

    { type: "mc", topic: "Body signals",
      q: "Say [[ask]], and you notice a tight tummy. What is a good first step?",
      options: ["Pause and check in with yourself: do I want to?", "Ignore it and say yes straight away", "Decide the feeling is silly"],
      answer: 0,
      slips: { 1: "Saying yes straight away skips the useful bit: checking what you actually want.", 2: "The feeling is not silly. It is information." },
      hint: "What does the feeling give you time to do?",
      why: "A pause to check in. Then you can decide, rather than going along with it on autopilot.",
      lv: { spicy: { options: ["Pause and check in: is it a not right now, a not ever, or a nervous yes?", "Say yes quickly so the feeling goes away", "Say no to everything, just in case"],
        slips: { 1: "The feeling might fade, but you might have agreed to something you did not want.", 2: "Some nervous feelings are a yes in disguise. Checking in helps you tell which." },
        why: "Checking in tells you what the feeling is about. Then the choice is yours." } } },

    { type: "mc", topic: "Body signals", explain: true,
      q: "Is this true? \"If I get a no feeling, something is wrong with me.\"",
      options: ["Not true: it is my body giving me useful information", "True: I should not feel like that"],
      answer: 0, fixed: true,
      slips: { 1: "Everyone gets no feelings. They are there to help you." },
      hint: "Does everyone get them?",
      why: "Not true at all. Everyone has no signals. They are your body looking out for you." },

    /* ---------- chunk 2: step 2, how to say no ---------- */
    { type: "learn", topic: "Saying no", title: "Ways of saying no",
      fig: WAYS,
      html: "<p>There are lots of ways of saying no. Pick the ones that feel OK for you.</p>" +
        "<p><b>Words:</b> \"No thanks.\" \"I'd rather not.\"<br><b>Your body:</b> a shake of the head, a hand up, stepping away.<br><b>Not yet:</b> \"Not right now.\" \"Maybe another time.\"</p>" +
        "<p>Calm and clear works best. And you do not have to give a reason: a no is enough on its own.</p>",
      lv: {
        medium: { html: "<p>There are lots of ways of saying no: <b>words</b> (\"No thanks\"), your <b>body</b> (a shake of the head, a hand up, stepping away), or <b>not yet</b> (\"Not right now\").</p>" +
          "<p>Calm and clear works best: a clear word, a steady voice, and looking at the person if that feels OK. You do not have to give a reason.</p>" +
          "<p>If they ask again, try the <b>broken record</b>: say the same calm no again, in the same words. No need for a bigger reason.</p>" },
        spicy: { html: "<p>Saying no clearly and calmly, without being rude and without giving in, is called being <b>assertive</b>. It sits in the middle: not going along with everything, and not blowing up either.</p>" +
          "<p>Tools that help: the <b>broken record</b> (the same calm no, again), an <b>I statement</b> (\"I don't want to\"), and, only if you want to, an <b>alternative</b> (\"No, but we could do this instead\").</p>" +
          "<p>A no never needs a reason. Giving one is your choice, not a rule.</p>" } } },

    { type: "mc", topic: "Saying no",
      q: "Which no is clearest?",
      options: ["\"No thanks, I don't want to.\"", "\"Erm, maybe, I don't know...\"", "Shouting \"GO AWAY!\""],
      answer: 0,
      slips: { 1: "Maybe and I don't know can sound like a yes is coming. If you mean no, a clear no helps.", 2: "It is clear, but shouting can turn it into an argument. Calm and clear works better." },
      hint: "Calm and clear.",
      why: "\"No thanks, I don't want to\" is calm and clear. Nobody has to guess what you mean.",
      lv: { spicy: { q: "Which one is assertive: clear, calm, not rude and not giving in?",
        options: ["\"No thanks, I don't want to.\"", "\"Erm, OK then, if you really want...\"", "\"That is the worst idea ever, go away!\""],
        slips: { 1: "That is going along with it. Assertive means saying what you want.", 2: "That is clear, but aggressive. Assertive is the calm middle." },
        why: "Clear, calm and kind: that is assertive." } } },

    { type: "match", topic: "Saying no",
      q: "Match each way of saying no to an example.",
      pairs: [["Using words", "\"No thanks.\""], ["Using your body", "A shake of the head"], ["Not yet", "\"Not right now, maybe later.\""], ["Offering something else", "\"No, but we could do this instead.\""]],
      slips: { any: "Look for the one with no words at all first." },
      hint: "Which example has no words in it?",
      why: "Words, body, not yet and offering something else are all ways of saying no. You can pick whichever fits." },

    { type: "order", topic: "Saying no",
      q: "Put this plan for saying no in order.",
      items: ["Notice the feeling", "Take a breath", "Say no, calmly and clearly", "Do something else"],
      slips: { any: "What has to happen before you know you want to say no?" },
      hint: "It starts in your body.",
      why: "Notice, breathe, say it, then move on to something else. Noticing comes first.",
      lv: { mild: { items: ["Notice the feeling", "Say no, calmly and clearly", "Do something else"] } } },

    { type: "mc", topic: "Saying no",
      q: "Do you have to give a reason when you say no?",
      options: ["No: a no is enough on its own", "Yes, always, or it does not count"],
      answer: 0, fixed: true,
      slips: { 1: "You can give a reason if you want to, but a no counts without one." },
      hint: "Does a no need a reason to count?",
      why: "A no counts on its own. Giving a reason is up to you.",
      lv: { medium: { q: "They ask again after you have said no. What is the broken record trick?",
          options: ["Say the same calm no again", "Make up a bigger excuse", "Give in so it stops"], answer: 0, fixed: false,
          slips: { 1: "You do not need a bigger reason. The same calm no is enough.", 2: "Giving in teaches them that asking again works." },
          hint: "A broken record plays the same bit again and again.",
          why: "Same words, same calm voice, as many times as you need." },
        spicy: { q: "They ask again after you have said no. What is the broken record trick?",
          options: ["Say the same calm no again", "Make up a bigger excuse", "Give in so it stops"], answer: 0, fixed: false,
          slips: { 1: "You do not need a bigger reason. The same calm no is enough.", 2: "Giving in teaches them that asking again works." },
          hint: "A broken record plays the same bit again and again.",
          why: "Same words, same calm voice, as many times as you need." } } },

    { type: "text", topic: "Saying no",
      q: "Write one way of saying no that would feel OK for you.",
      need: [["no", "not", "rather", "nah", "pass", "don't", "dont", "nope", "later", "another time"]],
      model: "No thanks, not right now.",
      hint: "Short is fine: \"No thanks\" counts.",
      why: "Any calm, clear no that feels OK for you is a good one to have ready." },

    /* ---------- chunk 3: step 3, really listening to someone else's no ---------- */
    { type: "learn", topic: "Hearing no", title: "When someone else says no",
      fig: HEAR,
      html: "<p>Other people get to say no too. When someone says no, it means <b>stop</b>.</p>" +
        "<p>Really listening looks like this: you stop asking, you say something like \"no worries\", and you find something else to do.</p>" +
        "<p>Sometimes people mean no without the word: they look away, go quiet, step back, or say \"maybe later\" or \"I'm not sure\". If you cannot tell, you can ask: \"Is that a no?\"</p>",
      lv: {
        medium: { html: "<p>Other people get to say no too, and when they do, it means <b>stop</b>.</p>" +
          "<p>Really listening: stop asking, say \"no worries\", and let it be OK. People trust someone who hears their no the first time, so it makes friendships stronger, not weaker.</p>" +
          "<p>No does not always come as the word. Looking away, going quiet, stepping back, \"maybe later\" and \"I'm not sure\" can all mean no. If you are not sure, ask.</p>" },
        spicy: { html: "<p>Hearing someone's no the first time is a big part of being trusted.</p>" +
          "<p>Not listening is not always obvious. Watch out for <b>pressure tricks</b>: <b>nagging</b> (asking again and again), <b>guilt trips</b> (\"I thought you were my friend\"), <b>bribes</b> (\"I'll give you something if you do\") and <b>everyone else is</b>. They are all ways of not hearing a no.</p>" +
          "<p>No can come without the word, too: going quiet, looking away, \"maybe later\". And being an ally means backing up other people's no, not only your own.</p>" } } },

    { type: "mc", topic: "Hearing no",
      q: "You ask [[mate]] if you can borrow [[item]], and they say no. What shows you are really listening?",
      fig: HEAR,
      options: ["Say \"no worries\" and leave it", "Ask again five more times", "Go quiet and sulk until they change their mind"],
      answer: 0,
      slips: { 1: "Asking again and again is not hearing the no.", 2: "Sulking puts pressure on them to change their answer." },
      hint: "Look at the picture.",
      why: "\"No worries\", and leave it. That shows you heard them, and they will trust you more for it." },

    { type: "multi", topic: "Hearing no",
      q: "Pick <b>all</b> the signs that someone might mean no, even without the word.",
      options: ["They look away and go quiet", "They step back", "They say \"maybe later\"", "They say \"I'm not sure...\"", "They smile and say \"yes please!\""],
      answers: [0, 1, 2, 3],
      slips: { any: "Four of them can mean no. \"Yes please\" with a smile is a clear yes." },
      hint: "Which one is a clear yes?",
      why: "Going quiet, stepping back, \"maybe later\" and \"I'm not sure\" can all mean no. If you cannot tell, ask." },

    { type: "sort", topic: "Hearing no",
      q: "Someone has said no. Sort these into listening to the no, and not listening.",
      buckets: ["Listening to the no", "Not listening"],
      cards: [["\"No worries.\"", 0], ["\"OK, I'll ask someone else.\"", 0], ["\"Please please please please.\"", 1], ["\"I thought you were my friend.\"", 1], ["Taking it anyway", 1]],
      slips: { any: "Ask: does this let the no be OK, or push to change it?" },
      hint: "Does it let the no stand?",
      why: "\"No worries\" and asking someone else let the no stand. Begging, guilt trips and taking it anyway are all not listening.",
      lv: { spicy: { q: "Sort these into listening to the no, and pressure tricks.",
        buckets: ["Listening to the no", "Pressure tricks"],
        cards: [["\"No worries.\"", 0], ["\"OK, I'll ask someone else.\"", 0], ["\"Fair enough, another time maybe.\"", 0], ["\"Please please please please.\"", 1], ["\"I thought you were my friend.\"", 1], ["\"I'll give you a fiver if you do.\"", 1], ["\"Everyone else is doing it.\"", 1]],
        why: "Nagging, guilt trips, bribes and everyone else is are all pressure tricks. Listening means letting the no stand." } } },

    { type: "mc", topic: "Hearing no", explain: true,
      q: "You have said no, but someone keeps pushing. What could you do?",
      options: ["Say no again, and tell Jay or an adult you trust", "Keep it a secret", "Give in so it stops"],
      answer: 0,
      slips: { 1: "You do not have to keep it to yourself. Telling someone you trust is always OK.", 2: "Giving in is not your job. Your no counts." },
      hint: "Who could help?",
      why: "Your no counts. If someone will not hear it, say it again and tell Jay or another adult you trust. That is never telling tales.",
      lv: { spicy: { q: "A friend keeps pushing someone else who has said no. What could an ally do?",
        options: ["Back up their no, and tell Jay or an adult you trust if it carries on", "Laugh along so nobody feels awkward", "Stay out of it, it is not your business"],
        slips: { 1: "Laughing along can feel like joining in the pushing.", 2: "Staying out of it leaves them on their own with it." },
        hint: "What does an ally do?",
        why: "Backing up someone's no, and getting an adult if it carries on, is what an ally does." } } },

    /* ---------- chunk 4: my list and my card ---------- */
    { type: "learn", topic: "My yes and no", title: "Your list",
      html: "<p>Last bit. Everyone's yes and no looks different, so here is a space to choose the ways that feel OK for you.</p>" +
        "<p>There are no right answers here, and you can change your mind any time.</p>" },

    { type: "widget", topic: "My yes and no", unscored: true,
      title: "My ways of saying no",
      html: "<p>Just for you. Your list can go to Jay with the rest, only if you choose to send it.</p>",
      mount: phraseWidget,
      report: function(d){
        var on = (d && d.on || []).map(function(v, k){ return v ? PHRASES[k] : ""; }).filter(Boolean);
        if(d && d.other && String(d.other).trim()) on.push(String(d.other).trim());
        return on.length ? "My ways of saying no: " + on.join(" / ") : "";
      } },

    { type: "write", topic: "My yes and no",
      q: "Only if you like: tell Jay about a time saying no, or hearing a no, went well.",
      starters: ["A time I said no was", "My body told me by", "Something that helped was", "A time someone said no to me and I", "Next time I might"],
      checklist: ["I said what happened", "I said what helped, or what I might try"],
      minWords: 20,
      lv: { spicy: { minWords: 40, checklist: ["I said what happened", "I named a signal or a way of saying no", "I said what I might try next time"] } } }
  ],

  realWorld: {
    title: "Yes and no, everywhere",
    html: "<p>You get asked things all the time: to join a game online, to share a picture in a group chat, to lend something, to go somewhere after school. Every one of them gets a yes, a no or a not right now, and every one of them is yours to choose.</p>" +
      "<p>For our big question: if we could time travel, should we? Imagine a time traveller turns up and offers you a trip. Exciting! But you would still get to say yes, no or not right now, and a good time traveller would listen to your answer.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to the time portal saying not right now">' + A.portal(76, 75, 56) + A.jay(240, 60, 0.85, "wink") +
      A.bubble(286, 8, 124, 52, "Not right now,\nthanks!", 290) + '</svg>'
  },

  make: {
    title: "Make a yes and no card",
    intro: "Your own card: how your body tells you, how you like to say no, and how you show you have heard someone else's no. Keep it, stick it up, or send it to Jay.",
    fields: [
      { id: "signal", label: "My body tells me by", ph: "A tight tummy", max: 40 },
      { id: "say", label: "How I like to say no", ph: "No thanks, not right now", max: 40 },
      { id: "hear", label: "When someone says no, I", ph: "Say no worries and leave it", max: 40 },
      { id: "name", label: "Name on the card", ph: "B5", max: 24 }
    ],
    svg: function(v){
      function row(y, label, txt, col){
        var ls = wrap(txt, 30, 2);
        return '<rect x="30" y="' + y + '" width="420" height="78" rx="14" fill="' + col + '" fill-opacity=".3"/>' +
          T(48, y + 24, label, 14, { b: 1, c: "#3a4060" }) + ls.map(function(l, k){ return T(48, y + 48 + k * 22, esc(l), 17, { b: 1 }); }).join("");
      }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#fffdf6"/>' +
        '<rect x="12" y="12" width="576" height="376" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        T(30, 56, "MY YES, MY NO", 26, { b: 1, c: "#8a5cf6" }) +
        row(74, "My body tells me by", v.signal, "#ff8a5c") + row(160, "How I like to say no", v.say, "#ffd23f") + row(246, "When someone says no, I", v.hear, "#19c39a") +
        T(30, 362, "Card owner: " + esc(wrap(v.name, 24, 1)[0] || ""), 18, { b: 1 }) +
        /* a little traffic light: yes, not right now, no */
        '<g transform="translate(522 200)"><rect x="-34" y="-104" width="68" height="208" rx="18" fill="#3a4060" stroke="#141a33" stroke-width="3"/>' +
        '<circle cx="0" cy="-64" r="22" fill="#19c39a" stroke="#141a33" stroke-width="2"/><circle cx="0" cy="0" r="22" fill="#ffd23f" stroke="#141a33" stroke-width="2"/><circle cx="0" cy="64" r="22" fill="#e04848" stroke="#141a33" stroke-width="2"/>' +
        T(0, -59, "yes", 12, { a: "middle", b: 1 }) + T(0, 5, "not yet", 10, { a: "middle", b: 1 }) + T(0, 69, "no", 12, { a: "middle", b: 1, c: "#ffffff" }) + '</g>' +
        '</svg>';
    }
  }
};
})();
