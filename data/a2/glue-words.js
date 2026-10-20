/* Base 5 Autumn 2 activity: Glue words.
   English. Holding a travelogue together: time markers between
   paragraphs, pointing words (they, it, this, these) and joining
   words inside sentences. ASCII only. */
(function(){
var A = window.A2ART;
var INK = "#141a33", F = ' font-family="Verdana,Arial,sans-serif"';
function tx(x, y, s, size, fill, more){
  return '<text x="' + x + '" y="' + y + '"' + F + ' font-size="' + size + '" fill="' + (fill || INK) + '"' + (more || "") + '>' + s + '</text>';
}
function bars(x, y, w, n, col){
  var o = "";
  for(var i = 0; i < n; i++) o += '<rect x="' + x + '" y="' + (y + i * 14) + '" width="' + (i === n - 1 ? w * 0.55 : w) + '" height="7" rx="3.5" fill="' + (col || "#c9c2b2") + '"/>';
  return o;
}

/* a journey line with its time markers */
function flag(x, up, label, col){
  var y = up ? 60 : 162, pole = up ? "M" + x + " 110V70" : "M" + x + " 110V150";
  return '<path d="' + pole + '" stroke="' + INK + '" stroke-width="2.5"/>' +
    '<circle cx="' + x + '" cy="110" r="9" fill="' + col + '" stroke="' + INK + '" stroke-width="2.5"/>' +
    tx(x, y, label, 14, INK, ' text-anchor="middle" font-weight="700"');
}
var TIMELINE = '<svg viewBox="0 0 460 200" role="img" aria-label="A journey line with time markers: First, Later that morning, Meanwhile, Finally">' +
  '<rect width="460" height="200" rx="16" fill="#f4f1ea"/>' +
  '<path d="M24 110H436" stroke="#8a5cf6" stroke-width="5" stroke-linecap="round"/>' +
  '<path d="M250 88H340" stroke="#22b8e6" stroke-width="4" stroke-dasharray="8 6" stroke-linecap="round"/>' +
  flag(50, true, "First,", "#ffd23f") + flag(160, false, "Later that morning,", "#ff8a3d") +
  flag(295, true, "Meanwhile,", "#22b8e6") + flag(410, false, "Finally,", "#19c39a") +
  tx(300, 136, "same time, elsewhere", 13, "#1f6fb2", ' text-anchor="middle"') +
  A.egg(A.bird(420, 40, 0.5, "#3a8fd6"), "This bird glued its nest together with mud. Jay checked. Twice.") +
  '</svg>';

/* pointing words: arrows back to what they stand for */
var POINT = '<svg viewBox="0 0 460 200" role="img" aria-label="They points back to the group, and it points back to the thing">' +
  '<rect width="460" height="200" rx="16" fill="#f4f1ea"/>' +
  '<rect x="18" y="52" width="210" height="40" rx="10" fill="#d9f3ff" stroke="' + INK + '" stroke-width="2.5"/>' + tx(123, 78, "[[Crew]]", 15, INK, ' text-anchor="middle" font-weight="700"') +
  '<rect x="330" y="52" width="90" height="40" rx="10" fill="#ffd23f" stroke="' + INK + '" stroke-width="2.5"/>' + tx(375, 78, "They", 16, INK, ' text-anchor="middle" font-weight="700"') +
  '<path d="M375 50q-70 -44 -150 -4" fill="none" stroke="#8a5cf6" stroke-width="3.5" stroke-linecap="round"/><path d="M234 38l-10 8 13 3" fill="none" stroke="#8a5cf6" stroke-width="3.5" stroke-linecap="round"/>' +
  '<rect x="18" y="132" width="210" height="40" rx="10" fill="#e6f9ef" stroke="' + INK + '" stroke-width="2.5"/>' + tx(123, 158, "the [[thing]]", 15, INK, ' text-anchor="middle" font-weight="700"') +
  '<rect x="330" y="132" width="90" height="40" rx="10" fill="#ffd23f" stroke="' + INK + '" stroke-width="2.5"/>' + tx(375, 158, "it", 16, INK, ' text-anchor="middle" font-weight="700"') +
  '<path d="M375 174q-70 30 -150 2" fill="none" stroke="#8a5cf6" stroke-width="3.5" stroke-linecap="round"/><path d="M236 186l-11 -9 13 -4" fill="none" stroke="#8a5cf6" stroke-width="3.5" stroke-linecap="round"/>' +
  tx(240, 116, "points back to", 13, "#5b6180", ' text-anchor="middle"') +
  '</svg>';

/* four glue pots, four jobs */
var POTS = '<svg viewBox="0 0 460 200" role="img" aria-label="Four glue pots: adding, contrast, reason, time">' +
  '<rect width="460" height="200" rx="16" fill="#f4f1ea"/>' +
  [["Adding", "and, also", "#19c39a"], ["Contrast", "but, although", "#ff5d8f"], ["Reason", "because, so", "#22b8e6"], ["Time", "when, while", "#ff8a3d"]].map(function(p, k){
    var x = 62 + k * 112;
    return '<path d="M' + (x - 30) + ' 58h60l-6 72q-1 10 -11 10h-26q-10 0 -11 -10z" fill="' + p[2] + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<rect x="' + (x - 34) + '" y="46" width="68" height="14" rx="5" fill="#ffffff" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<path d="M' + (x - 8) + ' 46v-14h16v14" fill="#ffffff" stroke="' + INK + '" stroke-width="2.5"/>' +
      tx(x, 104, p[0], 13, "#ffffff", ' text-anchor="middle" font-weight="700"') +
      tx(x, 170, p[1], 13, INK, ' text-anchor="middle" font-weight="700"');
  }).join("") +
  '</svg>';

/* choppy against glued */
var BEFORE = '<svg viewBox="0 0 460 190" role="img" aria-label="Choppy writing in separate bits, and glued writing joined up">' +
  '<rect width="460" height="190" rx="16" fill="#f4f1ea"/>' +
  '<rect x="16" y="34" width="200" height="140" rx="10" fill="#ffffff" stroke="' + INK + '" stroke-width="2.5"/>' + tx(116, 24, "Choppy", 15, INK, ' text-anchor="middle" font-weight="700"') +
  [0, 1, 2, 3, 4].map(function(k){ return '<rect x="' + (30 + (k % 2) * 90) + '" y="' + (50 + k * 22) + '" width="' + (60 + (k % 3) * 14) + '" height="9" rx="4" fill="#c9c2b2"/>'; }).join("") +
  '<rect x="244" y="34" width="200" height="140" rx="10" fill="#ffffff" stroke="' + INK + '" stroke-width="2.5"/>' + tx(344, 24, "Glued", 15, INK, ' text-anchor="middle" font-weight="700"') +
  bars(258, 50, 172, 6) +
  [[258, 50], [330, 64], [400, 78], [280, 92], [356, 106], [300, 120]].map(function(p){ return '<circle cx="' + p[0] + '" cy="' + (p[1] + 3.5) + '" r="6" fill="#ffd23f" stroke="' + INK + '" stroke-width="1.5"/>'; }).join("") +
  A.bonnie(116, 150, 0.32, "sit") +
  '</svg>';

var GLUED = "<b>First</b>, we set off for [[place]]. <b>Later that morning</b>, we met [[crew]]. <b>They</b> showed us a [[thing]], <b>and it</b> was even better than I had imagined. <b>Meanwhile</b>, my friend had wandered off to find [[food]]. <b>Finally</b>, we climbed back on [[ride]], tired <b>but</b> happy. <b>That day</b> is one I will never forget.";
var CHOPPY = "We set off for [[place]]. We met [[crew]]. [[Crew]] showed us a [[thing]]. The [[thing]] was even better than I had imagined. My friend had wandered off to find [[food]]. We climbed back on [[ride]]. We were tired. We were happy.";

/* the glue gun: fill each gap with a glue word */
var GAPS = {
  mild: ["%0, we set off for [[place]]. We met [[crew]]. %1 showed us a [[thing]]. %2, we climbed back on [[ride]].",
    [["First", "Finally", "Meanwhile"], 0, "The trip is just starting, so a starting word fits best: First."],
    [["They", "It", "He"], 0, "[[Crew]] are a group, so \"They\" points back to them."],
    [["Finally", "First", "Meanwhile"], 0, "This is the end of the trip, so \"Finally\" fits best."]],
  medium: ["%0, we set off for [[place]]. %1, we met [[crew]]. %2 showed us a [[thing]], and %3 was even better than I had imagined. We were starving, %4 we found [[food]]. %5, we climbed back on [[ride]], tired but happy.",
    [["First", "Finally", "Meanwhile"], 0, "The trip is just starting: First."],
    [["Later that morning", "Meanwhile", "Before that"], 0, "Time moves on here, so \"Later that morning\" fits."],
    [["They", "It", "He"], 0, "[[Crew]] are a group, so \"They\"."],
    [["it", "they", "this"], 0, "One [[thing]], so \"it\"."],
    [["so", "but", "although"], 0, "Being starving is the reason you found food, so \"so\"."],
    [["Finally", "Meanwhile", "First"], 0, "The end of the trip: Finally."]],
  spicy: ["%0 we arrived at [[place]], [[crew]] were waiting for us. %1 showed us a [[thing]], and %2 was even better than I had imagined. %3, my friend had slipped off to find [[food]]. The day was exhausting, %4 nobody wanted it to end. %5 is one I will never forget.",
    [["As soon as", "Meanwhile", "Finally"], 0, "Two things happen one straight after the other: \"As soon as\"."],
    [["They", "It", "These"], 0, "[[Crew]] are a group, so \"They\"."],
    [["it", "they", "this"], 0, "One [[thing]], so \"it\"."],
    [["Meanwhile", "Later that week", "Firstly"], 0, "Your friend was off at the same time, somewhere else: \"Meanwhile\"."],
    [["but", "so", "because"], 0, "Exhausting, yet nobody wanted it to end: a contrast, so \"but\"."],
    [["That day", "It", "These"], 0, "\"That day\" sums up everything before it. \"It\" would be too vague at the very end."]]
};
function mountGlue(el, api){
  var spec = GAPS[api.level] || GAPS.medium, tpl = api.tok(spec[0]), gaps = spec.slice(1);
  var d = api.data; if(!d.ch || d.lv !== api.level){ d.ch = {}; d.lv = api.level; }
  var sel = "font:inherit;font-weight:700;padding:3px 6px;margin:2px;border-radius:8px;border:2px dashed #8a5cf6;background:#fff8d6;color:#141a33";
  var html = tpl.replace(/%(\d)/g, function(m, k){
    var g = gaps[+k]; if(!g) return "";
    return '<select data-g="' + k + '" aria-label="Gap ' + (+k + 1) + '" style="' + sel + '"><option value="">pick</option>' +
      g[0].map(function(o, j){ return '<option value="' + j + '">' + o + '</option>'; }).join("") + '</select>';
  });
  el.innerHTML = '<p class="a2task" style="line-height:2.1">' + html + '</p><div class="glout" aria-live="polite" style="margin-top:10px"></div>';
  var out = el.querySelector(".glout");
  [].forEach.call(el.querySelectorAll("select"), function(s){ var v = d.ch[s.getAttribute("data-g")]; if(v != null) s.value = String(v); });
  function show(){
    var all = true, notes = [];
    gaps.forEach(function(g, k){
      var v = d.ch[k];
      if(v == null || v === ""){ all = false; return; }
      if(+v !== g[1]) notes.push("<li>Gap " + (k + 1) + ": \"" + g[0][+v] + "\" could work in some places. " + api.tok(g[2]) + "</li>");
    });
    if(!all){ out.innerHTML = '<p class="tiny">Fill every gap, in any order. Change your mind as often as you like.</p>'; return; }
    var glued = tpl.replace(/%(\d)/g, function(m, k){ var w = gaps[+k][0][+d.ch[k]]; return "<b>" + w + "</b>"; });
    glued = glued.replace(/(^|[.!?]\s+)<b>([a-z])/g, function(m, a, c){ return a + "<b>" + c.toUpperCase(); });
    out.innerHTML = '<p><b>Your glued version:</b></p><p>' + glued + '</p>' +
      (notes.length ? '<p>' + (notes.length === 1 ? "One" : "A few") + ' to look at again, if you like:</p><ul>' + notes.join("") + '</ul>' : '<p>Every gap holds firm. That is properly glued.</p>');
    if(!api.resolved()) api.done("done");
  }
  el.addEventListener("change", function(e){
    var s = e.target; if(!s || !s.getAttribute || s.getAttribute("data-g") == null) return;
    d.ch[s.getAttribute("data-g")] = s.value === "" ? null : +s.value;
    api.save(); show();
  });
  show();
}

(window.A2PACKS = window.A2PACKS || {})["glue-words"] = {
  a2: true,
  id: "a2-glue-words",
  title: "Glue words",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "The little words that stick a travelogue together, so the reader never gets lost.",
  blurb: "Time markers between paragraphs, pointing words like they and this, and joining words inside sentences. Four short chunks, a glue gun to try, and a glued paragraph card to make at the end.",
  note: "Glue words: the little words that hold a travelogue together. Four five minute chunks and a card to make at the end. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Glue stick", line: "Glue stick: first, next, finally, and words like they and it." },
    { id: "medium", name: "Superglue", line: "Superglue: markers like later that morning and meanwhile, this and these, and joining words." },
    { id: "spicy", name: "Welder", line: "Welder: varied markers, summing up with this and these, and joins that show exactly how ideas relate." }
  ],
  themes: {
    time: { name: "Time travel", w: { place: "ancient Rome", crew: "two Roman soldiers", thing: "gold coin", food: "bread and olives", ride: "the time pod" } },
    football: { name: "Football", w: { place: "the cup final", crew: "the players", thing: "signed shirt", food: "a pie", ride: "the coach" } },
    horror: { name: "Horror", w: { place: "the haunted pier", crew: "the ghost hunters", thing: "rusty lantern", food: "hot chocolate", ride: "the old bus" } },
    fishing: { name: "Fishing", w: { place: "the harbour", crew: "the boat crew", thing: "huge cod", food: "fish and chips", ride: "the minibus" } },
    music: { name: "Music", w: { place: "the theatre", crew: "the dancers", thing: "sequin costume", food: "ice cream", ride: "the train" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: TIMELINE,
  steps: [

    /* ---------- chunk 1: time markers ---------- */
    { type: "learn", topic: "Time markers",
      title: "Words that tell the reader when",
      fig: TIMELINE,
      html: "<p>A travelogue moves through time. <b>Time markers</b> tell the reader where we are on the journey, so they never get lost.</p>" +
        "<p><b>First, next, after that, finally</b> put things in order. <b>Later that morning, by the evening, the next day</b> jump time forward. <b>Meanwhile</b> means at the same time, somewhere else.</p>" +
        "<p class=\"a2task\">" + GLUED + "</p>" +
        "<p>They are perfect for the start of a new paragraph.</p>",
      lv: { spicy: { html: "<p>Time markers hold a travelogue together across paragraphs. At this level, pick them for <b>precision</b>, not just to fill a gap:</p>" +
        "<p><b>As soon as</b> (straight after), <b>within an hour</b> (how long), <b>by the time</b> (one thing finished before another), <b>meanwhile</b> (same time, elsewhere), <b>looking back</b> (a shift from telling to reflecting).</p>" +
        "<p class=\"a2task\">" + GLUED + "</p>" +
        "<p>Then, then, then is glue, technically. It just does not hold very well.</p>" } } },

    { type: "mc", topic: "Time markers",
      q: "Which time marker fits the gap?<p class=\"a2task\">______, we set off for [[place]].</p>",
      options: ["First", "Finally", "Meanwhile", "In the end"],
      answer: 0,
      slips: { 1: "\"Finally\" is for the end of the trip. This is the very start.", 2: "\"Meanwhile\" means at the same time as something else. Nothing has happened yet.", 3: "\"In the end\" is for the finish." },
      hint: "Is this the start, the middle or the end of the trip?",
      why: "Setting off is the start, so <b>First</b> fits.",
      lv: {
        medium: { q: "Which time marker fits the gap?<p class=\"a2task\">We arrived at [[place]] at ten. ______, the sky was dark and we were heading home.</p>",
          options: ["By the evening", "Meanwhile", "Firstly", "Before that"],
          slips: { 1: "\"Meanwhile\" is for the same time, somewhere else. Here time has moved on.", 2: "\"Firstly\" is for the start. We are near the end now.", 3: "\"Before that\" goes back in time. The sky being dark comes later." },
          hint: "How much time has passed since ten o'clock?",
          why: "Hours have passed, and it is dark, so <b>By the evening</b> fits." },
        spicy: { q: "Which time marker fits the gap?<p class=\"a2task\">I was at the front, watching [[crew]]. ______, my friend was stuck at the back of the queue for [[food]].</p>",
          options: ["Meanwhile", "Later that day", "Finally", "Afterwards"],
          slips: { 1: "\"Later that day\" moves time on. These two things happen at the same moment.", 2: "\"Finally\" is for an ending.", 3: "\"Afterwards\" puts the queue after the watching. They happen together." },
          hint: "Are these two things happening one after the other, or at the same time?",
          why: "Two things, same moment, different places: <b>Meanwhile</b>." } } },

    { type: "order", topic: "Time markers",
      q: "These paragraph openers are jumbled. Use the time markers to put them in order.",
      items: ["First, we set off for [[place]].", "Next, we met [[crew]].", "After that, they showed us a [[thing]].", "Finally, we climbed back on [[ride]]."],
      hint: "First, next, after that, finally.",
      why: "The markers do the ordering for you: First, Next, After that, Finally.",
      lv: {
        medium: { items: ["Early that morning, we set off for [[place]].", "By lunchtime, we had met [[crew]].", "Later that afternoon, they showed us a [[thing]].", "By the evening, we were back on [[ride]]."],
          hint: "Morning, lunchtime, afternoon, evening.",
          why: "Morning, lunchtime, afternoon, evening. Markers like these tell the reader exactly how far the day has moved on." },
        spicy: { items: ["As soon as we arrived at [[place]], [[crew]] came over to meet us.", "Within an hour, they had shown us a [[thing]].", "By the time the sun set, we were back on [[ride]].", "The next morning, I could still hear the crowd."],
          hint: "Look at how each marker measures time: straight away, within an hour, by sunset, the next day.",
          why: "Straight away, within an hour, by sunset, the next morning. Precise markers make the timing clear without any \"then\"." } } },

    { type: "mc", topic: "Time markers",
      q: "Which version holds together best?",
      fig: '<svg viewBox="0 0 420 120" role="img" aria-label="Jay saying: then, then, then">' + '<rect width="420" height="120" rx="16" fill="#f4f1ea"/>' +
        A.jay(70, 34, 0.7, "hmm") + A.bubble(140, 18, 250, 70, "Then... then... then...\nThen what?", 160) + '</svg>',
      options: ["Then we set off. Then we met [[crew]]. Then we went home.", "First, we set off. Later that morning, we met [[crew]]. Finally, we went home.", "We set off, we met [[crew]], we went home."],
      answer: 1,
      slips: { 0: "\"Then\" in every sentence is glue, but weak glue. It does not say how much time passed.", 2: "Commas between full sentences do not glue them. The reader cannot tell when anything happened." },
      hint: "Which one tells you how the time moves?",
      why: "Different markers show the start, the time jump and the end. \"Then then then\" says nothing new each time.",
      lv: { spicy: { q: "Which paragraph opener glues best to the paragraph before it, which ended with a two hour wait?",
        options: ["Then we went to [[place]].", "After that long wait, we finally reached [[place]].", "We went to [[place]].", "Also, [[place]] was good."],
        slips: { 0: "\"Then\" moves on, but it does not link back to the wait.", 2: "No glue at all: the reader has to guess how this connects.", 3: "\"Also\" adds, but nothing is being added to. And \"good\" is vague." },
        hint: "Which one points back to the last paragraph and forward to the new one?",
        why: "\"After that long wait\" points back to the last paragraph, and \"finally reached\" moves forward. That is two way glue." } } },

    { type: "text", topic: "Time markers",
      q: "Write the first sentence of the next paragraph, after a morning at [[place]]. Start it with a time marker.",
      need: [["later", "next", "after", "by", "meanwhile", "finally", "eventually", "that afternoon", "that evening", "the next", "soon", "once", "as soon", "before", "when", "in the afternoon", "at lunch", "at two", "at three", "at four", "at five", "then"]],
      model: "Later that afternoon, we headed down to the gift shop.",
      slips: [[["and then", "and"], "Try a marker that tells the reader when: later that afternoon, after lunch, by the evening."]],
      hint: "Try: \"Later that afternoon,\" or \"After lunch,\" then say what happened.",
      why: "Any marker that tells the reader when works. \"Later that afternoon,\" is a good one: it moves time on and suits the start of a paragraph." },

    /* ---------- chunk 2: pointing words ---------- */
    { type: "learn", topic: "Pointing words",
      title: "Words that point back",
      fig: POINT,
      html: "<p>Saying the same name again and again sounds clunky. <b>Pointing words</b> stand in for something you have already mentioned.</p>" +
        "<p><b>They</b> points back to a group. <b>It</b> points back to one thing. <b>There</b> points back to a place.</p>" +
        "<p class=\"a2task\">[[Crew]] showed us a [[thing]]. <b>They</b> said <b>it</b> was hundreds of years old.</p>" +
        "<p>The trick: the reader must always know what the word is pointing at.</p>",
      lv: {
        medium: { html: "<p><b>Pointing words</b> stand in for something you have already said, so you do not repeat yourself.</p>" +
          "<p><b>They, it, there</b> point back to a group, a thing or a place. <b>This</b> and <b>these</b> can point back to a whole idea:</p>" +
          "<p class=\"a2task\">[[Ride]] broke down twice on the way to [[place]]. <b>This</b> meant we missed the start.</p>" +
          "<p>\"This\" points back to the whole breakdown, not just one word. That is glue between sentences.</p>" },
        spicy: { html: "<p>Pointing words glue sentences together. The strongest version adds a <b>summing up noun</b>:</p>" +
          "<p class=\"a2task\">[[Ride]] broke down twice, it rained, and we lost our tickets. <b>These disasters</b> nearly ruined the day.</p>" +
          "<p>\"These disasters\" points back to three things at once and tells the reader how to see them. \"This\" on its own would be vaguer.</p>" +
          "<p>Watch for <b>ambiguity</b>: if a pointing word could point at two things, use the name instead.</p>" } } },

    { type: "mc", topic: "Pointing words",
      q: "What does <b>it</b> point back to?<p class=\"a2task\">[[Crew]] showed us a [[thing]], and it was even better than I had imagined.</p>",
      options: ["The [[thing]]", "[[Crew]]", "The whole day", "[[Place]]"],
      answer: 0,
      slips: { 1: "[[Crew]] are a group. A group would be \"they\".", 2: "The day is not mentioned in this sentence.", 3: "[[Place]] is not in this sentence." },
      hint: "\"It\" is one thing. Which single thing has just been mentioned?",
      why: "\"It\" points back to the [[thing]]: the one thing just mentioned.",
      lv: {
        medium: { q: "What does <b>This</b> point back to?<p class=\"a2task\">[[Ride]] broke down twice on the way to [[place]]. This meant we missed the start.</p>",
          options: ["The breakdowns on the way", "[[Place]]", "The start", "[[Ride]] on its own"],
          slips: { 1: "A place cannot make you miss the start.", 2: "The start is what we missed, not what caused it.", 3: "Close, but it was the breaking down that made us late, not just the vehicle." },
          hint: "What made us miss the start?",
          why: "\"This\" points back to the whole idea: breaking down twice on the way." },
        spicy: { q: "Read this sentence. What is the problem?<p class=\"a2task\">[[Crew]] met the guides at the gate, and they were soaked.</p>",
          options: ["\"They\" could mean [[crew]] or the guides", "\"They\" should be \"it\"", "Nothing, it is perfectly clear", "\"Soaked\" needs a better word"],
          slips: { 1: "Both groups are plural, so \"they\" is the right kind of word. The problem is which group.", 2: "Who was soaked? Two groups were just mentioned.", 3: "\"Soaked\" is fine. The trouble is who it describes." },
          hint: "Who exactly was soaked?",
          why: "Two groups, one \"they\": the reader cannot tell who. Fix it by naming them: \"...and the guides were soaked.\"" } } },

    { type: "mc", topic: "Pointing words", explain: true,
      q: "Which version uses pointing words to avoid repeating itself?",
      options: ["[[Crew]] showed us a [[thing]]. [[Crew]] said the [[thing]] was very old.", "[[Crew]] showed us a [[thing]]. They said it was very old.", "[[Crew]] showed us a [[thing]]. It said they was very old."],
      answer: 1,
      slips: { 0: "That repeats both names. It sounds clunky.", 2: "The pointing words are swapped: \"It\" would mean the [[thing]] was talking." },
      hint: "\"They\" for the group, \"it\" for the thing.",
      why: "\"They\" points to [[crew]] and \"it\" points to the [[thing]]. Same meaning, no repeats.",
      lv: {
        medium: { q: "Which fills the gap best?<p class=\"a2task\">We waited two hours for [[ride]]. ______ made us late for everything.</p>",
          options: ["This wait", "They", "These", "There"], answer: 0,
          slips: { 1: "\"They\" points to a group of people, and there is no group here.", 2: "\"These\" is for more than one thing.", 3: "\"There\" points to a place." },
          hint: "What made us late? Name it in a couple of words.",
          why: "\"This wait\" points back and says exactly what it is pointing at." },
        spicy: { q: "Which fills the gap best?<p class=\"a2task\">[[Ride]] broke down, it started to pour, and we lost our tickets. ______ almost ruined the trip.</p>",
          options: ["These disasters", "It", "This", "They"], answer: 0,
          slips: { 1: "\"It\" would point back to one thing, probably the rain. The reader needs all three.", 2: "\"This\" on its own could mean just the last thing: the tickets.", 3: "\"They\" sounds like a group of people." },
          hint: "Three things went badly. Which choice gathers all three?",
          why: "\"These disasters\" points back to all three and tells the reader how to see them." } } },

    { type: "multi", topic: "Pointing words",
      q: "Pick <b>all</b> the pointing words in this paragraph.<p class=\"a2task\">We reached [[place]] at noon. We stayed there for hours. [[Crew]] were brilliant, and they made us laugh. Then they showed us a [[thing]]. It was the best part of the trip.</p>",
      options: ["there", "they", "It", "noon", "brilliant", "hours"],
      answers: [0, 1, 2],
      hint: "Look for small words that stand in for a place, a group or a thing.",
      why: "\"There\" points to [[place]], \"they\" to [[crew]] and \"It\" to the [[thing]]. The others are ordinary describing words.",
      lv: { spicy: { q: "Pick <b>all</b> the words that point back to something earlier.<p class=\"a2task\">We reached [[place]] at noon. We stayed there for hours. [[Crew]] were brilliant, and they made us laugh. This was the best part of the trip. These are the moments I will remember.</p>",
        options: ["there", "they", "This", "These", "brilliant", "moments"],
        answers: [0, 1, 2, 3],
        why: "\"There\", \"they\", \"This\" and \"These\" all point back. \"Moments\" is a summing up noun, but it is \"These\" that does the pointing." } } },

    /* ---------- chunk 3: joining words ---------- */
    { type: "learn", topic: "Joining ideas",
      title: "Glue inside sentences",
      fig: POTS,
      html: "<p>Joining words glue ideas <b>inside</b> a sentence, and each one has a job:</p>" +
        "<p><b>Adding:</b> and, also. <b>Contrast:</b> but, although. <b>Reason or result:</b> because, so. <b>Time:</b> when, while, until.</p>" +
        "<p class=\"a2task\">We were starving, <b>so</b> we found [[food]]. The queue was long, <b>but</b> it was worth it.</p>" +
        "<p>Pick the one that matches how the two ideas connect.</p>",
      lv: { spicy: { html: "<p>Joining words show exactly how two ideas relate. At this level, reach past and and but:</p>" +
        "<p><b>Contrast:</b> although, whereas, however. <b>Reason or result:</b> because, therefore, as a result. <b>Adding:</b> also, furthermore. <b>Time:</b> while, until, once.</p>" +
        "<p class=\"a2task\"><b>Although</b> it was freezing, nobody wanted to leave. The tickets sold out in an hour; <b>as a result</b>, the queue went round the block.</p>" +
        "<p>Starting a sentence with \"although\" puts the surprise up front. That is a deliberate choice.</p>" } } },

    { type: "mc", topic: "Joining ideas",
      q: "Pick the glue word.<p class=\"a2task\">We were hungry, ______ we found [[food]].</p>",
      options: ["so", "but", "although", "until"],
      answer: 0,
      slips: { 1: "\"But\" is for a contrast. Being hungry and finding food go together.", 2: "\"Although\" sets up a surprise. There is no surprise here.", 3: "\"Until\" is about time. Here one thing causes the other." },
      hint: "Does the first idea cause the second?",
      why: "Being hungry is the reason, finding food is the result. <b>So</b> joins a reason to its result.",
      lv: {
        medium: { q: "Pick the glue word.<p class=\"a2task\">We had to queue for an hour, ______ the view from the top was worth it.</p>",
          options: ["but", "because", "so", "and then"],
          slips: { 1: "\"Because\" would mean the view caused the queue.", 2: "\"So\" would mean the queue caused the view.", 3: "\"And then\" is time order. The second idea pushes against the first." },
          hint: "Is the second idea a reason, a result, or a contrast?",
          why: "A long queue is a downside, a great view is an upside. A contrast: <b>but</b>." },
        spicy: { q: "Pick the glue word.<p class=\"a2task\">______ it was freezing, nobody wanted to leave [[place]].</p>",
          options: ["Although", "Because", "So", "Meanwhile"],
          slips: { 1: "\"Because\" would mean the cold made everyone stay. The cold should make them want to leave.", 2: "\"So\" cannot start this kind of sentence, and it would mean a result.", 3: "\"Meanwhile\" is for another place at the same time." },
          hint: "Freezing, but nobody wanted to leave. Which word sets up that surprise?",
          why: "<b>Although</b> sets up the surprise: you would expect people to leave the cold, but they did not." } } },

    { type: "sort", topic: "Joining ideas",
      q: "Sort the glue words by the job they do.",
      buckets: ["Adding", "Contrast", "Reason or result", "Time"],
      cards: [["and", 0], ["also", 0], ["but", 1], ["because", 2], ["so", 2], ["when", 3]],
      hint: "Adding puts more on. Contrast pushes against. Reason explains why. Time says when.",
      why: "And, also: adding. But: contrast. Because, so: reason or result. When: time.",
      lv: {
        medium: { cards: [["and", 0], ["also", 0], ["but", 1], ["although", 1], ["because", 2], ["so", 2], ["when", 3], ["while", 3]] },
        spicy: { cards: [["furthermore", 0], ["also", 0], ["however", 1], ["whereas", 1], ["therefore", 2], ["as a result", 2], ["until", 3], ["once", 3]],
          why: "Furthermore, also: adding. However, whereas: contrast. Therefore, as a result: result. Until, once: time." } } },

    { type: "text", topic: "Joining ideas", explain: true,
      q: "Join these into one sentence with a glue word.<p class=\"a2task\">We were exhausted. We kept walking.</p>",
      need: [["but", "although", "even though", "though", "yet", "still", "however"]],
      model: "We were exhausted, but we kept walking.",
      slips: [[["because", "so "], "That would mean being tired made you keep walking. Try a contrast word: but, although."], [["and"], "\"And\" joins them, but it misses the surprise. Try \"but\"."]],
      hint: "Tired, yet still walking: that is a contrast.",
      why: "\"But\" or \"although\" shows the surprise: tired, yet still going.",
      lv: {
        mild: { q: "Join these into one sentence with a glue word.<p class=\"a2task\">We were hungry. We bought [[food]].</p>",
          need: [["so", "and"]],
          model: "We were hungry, so we bought [[food]].",
          slips: [[["because"], "Careful: \"because\" would mean buying food made you hungry. Try \"so\"."], [["but"], "\"But\" is for a contrast. These two go together."]],
          hint: "Hungry, so...",
          why: "\"So\" joins the reason (hungry) to the result (buying food)." },
        spicy: { q: "Join these into one sentence that <b>starts</b> with a glue word.<p class=\"a2task\">The tickets were expensive. The day was worth every penny.</p>",
          need: [["although", "even though", "though", "despite", "while", "whilst"]],
          model: "Although the tickets were expensive, the day was worth every penny.",
          slips: [[["but"], "\"But\" works in the middle. The challenge is to start with the glue word: try \"Although\"."]],
          hint: "Start with \"Although\" and finish with a comma before the second idea.",
          why: "\"Although\" up front sets up the contrast before the reader even reaches the good news." } } },

    /* ---------- chunk 4: glue it together ---------- */
    { type: "learn", topic: "Glue it together",
      title: "From choppy to glued",
      fig: BEFORE,
      html: "<p>Here is a choppy version. Every sentence stands on its own:</p>" +
        "<p class=\"a2task\">" + CHOPPY + "</p>" +
        "<p>And the glued version, with time markers, pointing words and joining words in bold:</p>" +
        "<p class=\"a2task\">" + GLUED + "</p>" +
        "<p>Same facts. The second one reads like a journey.</p>" },

    { type: "widget", topic: "Glue it together", unscored: true,
      title: "The glue gun",
      html: "<p>Pick a glue word for each gap. You will see the whole thing glued together at the end, and a note on any gap worth another look.</p>",
      mount: mountGlue },

    { type: "mc", topic: "Glue it together",
      q: "Which version is best glued?",
      options: ["We got to [[place]]. We met [[crew]]. [[Crew]] were funny. We went home.",
        "When we got to [[place]], we met [[crew]]. They were so funny that we stayed until dark. Finally, we headed home.",
        "When we got to [[place]], we met [[crew]], and it was funny and then we went home and it was dark."],
      answer: 1,
      slips: { 0: "Choppy: no markers, no pointing words, and [[crew]] gets repeated.", 2: "Lots of \"and\", and \"it\" does not point at anything clear. Too much weak glue makes one long string." },
      hint: "Look for a time marker, a pointing word and a joining word, used well.",
      why: "\"When\" joins, \"They\" points back, \"so...that\" shows a result, and \"Finally\" marks the end.",
      lv: { spicy: { q: "A writer wants to improve the glue in this paragraph. Which change helps most?<p class=\"a2task\">We reached [[place]]. Then we met [[crew]]. Then they showed us a [[thing]]. Then it started to rain, then we left.</p>",
        options: ["Swap the run of \"then\" for varied markers and joins: \"As soon as...\", \"Within minutes...\", \"so\"", "Add more \"then\" so the order is extra clear", "Replace every pointing word with the full name", "Split every sentence into its own paragraph"],
        answer: 0,
        slips: { 1: "More \"then\" makes it even more repetitive.", 2: "That brings back the clunky repetition the pointing words removed.", 3: "These sentences belong to one stop. Splitting them breaks the paragraph." },
        hint: "What is repeated over and over?",
        why: "Varied markers and joins show how the events relate (straight after, because, at the same time), not just that one came after another." } } },

    { type: "write", topic: "Glue it together",
      q: "Your turn, if you fancy it. Rewrite the choppy version in your own words, with glue: at least one time marker, one pointing word and one joining word. Change any details you like.",
      fig: BEFORE,
      starters: ["First,", "Later that morning,", "They", "Meanwhile,", "Finally,"],
      checklist: ["A time marker or two", "A pointing word (they, it, this)", "A joining word (so, but, because)", "It reads like one journey"],
      minWords: 40,
      lv: {
        mild: { minWords: 25, checklist: ["First, next or finally", "They or it", "And, so or but"] },
        spicy: { q: "Your turn, if you fancy it. Write two linked paragraphs about a trip (real, or to [[place]]). The second paragraph should open with a marker that links back to the first, and use at least one summing up phrase like \"This delay\" or \"These moments\".",
          checklist: ["Paragraph two opens by linking back", "A summing up phrase (this + noun, these + noun)", "At least one contrast join (although, whereas, however)", "No run of \"then\""],
          minWords: 70 } } }
  ],

  realWorld: {
    title: "Where you would use this",
    html: "<p>News reports, match reports, instructions, history books and texts to a friend explaining what happened: anything that tells events in order needs glue, or the reader gets lost.</p>" +
      "<p>For our big question: a travelogue through time needs the best glue of all. \"Meanwhile, back in the present...\" is a time marker doing a huge job. If you could time travel, how would you glue together a trip that goes backwards?</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A portal with the words: meanwhile, back in the present">' +
      A.portal(70, 76, 54) +
      '<rect x="146" y="50" width="176" height="52" rx="12" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
      tx(234, 72, "Meanwhile, back", 14, INK, ' text-anchor="middle" font-weight="700"') + tx(234, 92, "in the present...", 14, INK, ' text-anchor="middle" font-weight="700"') +
      A.jay(370, 50, 0.68, "wink") + '</svg>'
  },

  make: {
    title: "Make a glued paragraph card",
    intro: "Three sentences about a trip, stuck together with glue words. The glue shows up in yellow. Save it, stick it up, or send it to Jay.",
    fields: [
      { id: "s1", label: "Start with a time marker", ph: "Later that morning, we reached the top of the tower.", max: 80 },
      { id: "s2", label: "Use a pointing word", ph: "It was taller than any building I had seen.", max: 80 },
      { id: "s3", label: "Use a joining word", ph: "My legs ached, but the view was worth it.", max: 80 },
      { id: "name", label: "Glued by", ph: "Master welder", max: 24 }
    ],
    svg: function(v){
      var GLUE = ["first", "next", "then", "later", "finally", "meanwhile", "after", "afterwards", "eventually", "by", "when", "while", "until", "once", "as", "soon", "before", "it", "they", "this", "these", "that", "those", "there", "and", "but", "so", "because", "although", "though", "however", "also", "therefore", "whereas", "yet"];
      function e(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ while(x.length > n){ if(cur.trim()){ out.push(cur.trim()); cur = ""; } out.push(x.slice(0, n)); x = x.slice(n); } if((cur + " " + x).trim().length > n){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max); }
      function line(l){
        return l.split(" ").map(function(w){
          var bare = w.toLowerCase().replace(/[^a-z]/g, "");
          return GLUE.indexOf(bare) >= 0 ? '<tspan fill="#b07800" font-weight="700">' + e(w) + '</tspan>' : e(w);
        }).join(" ");
      }
      var rows = [], cols = ["#d9f3ff", "#e6f9ef", "#ffe3ec"];
      ["s1", "s2", "s3"].forEach(function(k, i){ rows.push({ lines: wrap(v[k], 40, 2), col: cols[i] }); });
      var y = 92, body = "";
      rows.forEach(function(r){
        var h = 18 + r.lines.length * 26;
        body += '<rect x="34" y="' + y + '" width="532" height="' + h + '" rx="12" fill="' + r.col + '"/>' +
          r.lines.map(function(l, k){ return '<text x="50" y="' + (y + 30 + k * 26) + '" font-family="Verdana,Arial,sans-serif" font-size="19" fill="#141a33">' + line(l) + '</text>'; }).join("");
        y += h + 10;
        body += '<circle cx="300" cy="' + (y - 5) + '" r="7" fill="#ffd23f" stroke="#141a33" stroke-width="1.5"/>';
      });
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#fffdf4"/>' +
        '<rect x="14" y="14" width="572" height="372" rx="18" fill="none" stroke="#141a33" stroke-width="4"/>' +
        '<text x="40" y="66" font-family="Verdana,Arial,sans-serif" font-size="26" font-weight="700" fill="#141a33">Glued together</text>' +
        '<path d="M460 40q20 -14 34 4l12 36q4 14 -10 18l-30 0q-14 -4 -10 -18z" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/>' +
        '<rect x="468" y="26" width="30" height="16" rx="4" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
        body +
        '<text x="40" y="372" font-family="Verdana,Arial,sans-serif" font-size="16" fill="#5b6180">Glued by ' + e(String(v.name || "").slice(0, 24)) + '</text>' +
        '</svg>';
    }
  }
};
})();
