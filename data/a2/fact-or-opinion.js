/* Base 5 Autumn 2 activity: Fact or opinion?
   English. Sorting facts from opinions, explaining the choice, finding
   both in a real text, and different points of view. ASCII only. */
(function(){
var FF = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, size, txt, col, extra){ return '<text x="' + x + '" y="' + y + '" ' + FF + ' font-size="' + size + '" fill="' + (col || "#141a33") + '"' + (extra || "") + '>' + txt + '</text>'; }
var B = ' font-weight="700"', MID = ' text-anchor="middle"';

/* the two test questions */
var TESTS =
  '<svg viewBox="0 0 520 220" role="img" aria-label="Two questions: could I check it? Then it is a fact. Could someone disagree? Then it is an opinion.">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  '<rect x="170" y="14" width="180" height="44" rx="12" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' + T(260, 42, 16, 'A statement', "#141a33", B + MID) +
  '<path d="M220 58L120 96M300 58L400 96" stroke="#141a33" stroke-width="3" fill="none"/>' +
  '<rect x="20" y="96" width="210" height="50" rx="12" fill="#19c39a" fill-opacity=".3" stroke="#0f7a5f" stroke-width="2.5"/>' + T(125, 127, 15, 'Could I check it?', "#141a33", B + MID) +
  '<rect x="290" y="96" width="210" height="50" rx="12" fill="#ff5d8f" fill-opacity=".3" stroke="#d63c6c" stroke-width="2.5"/>' + T(395, 118, 15, 'Could someone', "#141a33", B + MID) + T(395, 137, 15, 'reasonably disagree?', "#141a33", B + MID) +
  '<path d="M125 146v26M395 146v26" stroke="#141a33" stroke-width="3"/>' +
  '<rect x="65" y="172" width="120" height="36" rx="18" fill="#0f7a5f"/>' + T(125, 196, 16, 'FACT', "#fff", B + MID) +
  '<rect x="325" y="172" width="140" height="36" rx="18" fill="#d63c6c"/>' + T(395, 196, 16, 'OPINION', "#fff", B + MID) +
  '</svg>';

/* the "because" sentence frame */
var BECAUSE =
  '<svg viewBox="0 0 520 190" role="img" aria-label="Sentence frames: it is a fact because I could check it by. It is an opinion because the word shows">' +
  '<rect width="520" height="190" rx="16" fill="#eef6ff"/>' +
  '<rect x="18" y="20" width="484" height="66" rx="14" fill="#fff" stroke="#0f7a5f" stroke-width="2.5"/>' +
  T(36, 48, 15, 'It is a <tspan fill="#0f7a5f" font-weight="700">FACT</tspan> because I could check it by', "#141a33") +
  '<rect x="36" y="58" width="200" height="20" rx="4" fill="#d4f5ea"/>' + T(44, 73, 13, 'counting, measuring ...', "#0f7a5f") +
  '<rect x="18" y="104" width="484" height="66" rx="14" fill="#fff" stroke="#d63c6c" stroke-width="2.5"/>' +
  T(36, 132, 15, 'It is an <tspan fill="#d63c6c" font-weight="700">OPINION</tspan> because the word <tspan fill="#d63c6c" font-weight="700">best</tspan> shows', "#141a33") +
  T(36, 158, 15, 'what someone thinks.', "#141a33") +
  A2ART.egg(A2ART.bird(478, 158, 0.6, "#ffd23f"), "A bird's opinion: worms are delicious. A fact: worms are not delicious to Jay.") +
  '</svg>';

/* a leaflet with stars */
var REVIEW =
  '<svg viewBox="0 0 520 170" role="img" aria-label="A review leaflet with stars and a highlighter">' +
  '<rect width="520" height="170" rx="16" fill="#fffbe0"/>' +
  '<rect x="30" y="18" width="250" height="136" rx="8" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
  T(48, 46, 16, 'REVIEW', "#141a33", B) +
  [0, 1, 2, 3, 4].map(function(k){ return '<path transform="translate(' + (60 + k * 30) + ' 70) scale(.9)" d="M0 -12l3.5 7.5 8 1-6 5.5 1.5 8-7 -4-7 4 1.5 -8-6 -5.5 8 -1z" fill="' + (k < 4 ? "#ffd23f" : "#e6e1d2") + '" stroke="#141a33" stroke-width="1.5"/>'; }).join("") +
  '<rect x="48" y="92" width="210" height="10" rx="3" fill="#d4f5ea"/><rect x="48" y="112" width="170" height="10" rx="3" fill="#ffe0ea"/><rect x="48" y="132" width="190" height="10" rx="3" fill="#d4f5ea"/>' +
  '<g transform="translate(320 64)"><rect x="0" y="0" width="22" height="16" rx="4" fill="#19c39a"/>' + T(32, 14, 15, 'green = fact', "#141a33") +
  '<rect x="0" y="34" width="22" height="16" rx="4" fill="#ff5d8f"/>' + T(32, 48, 15, 'pink = opinion', "#141a33") + '</g>' +
  '</svg>';

/* two people, one fact */
function face(x, y, col, hair){
  return '<g transform="translate(' + x + ' ' + y + ')"><path d="M-34 70q0 -34 34 -36q34 2 34 36z" fill="' + col + '"/>' +
    '<circle r="26" fill="#f2c7a2"/><path d="M-26 -6q-2 -26 26 -26q28 0 26 26q-8 -14 -26 -14q-18 0 -26 14z" fill="' + hair + '"/>' +
    '<circle cx="-9" cy="2" r="3" fill="#1b1b1b"/><circle cx="9" cy="2" r="3" fill="#1b1b1b"/></g>';
}
var POV =
  '<svg viewBox="0 0 520 220" role="img" aria-label="Two people share one fact but have different opinions about it">' +
  '<rect width="520" height="220" rx="16" fill="#f4f1ea"/>' +
  face(70, 120, "#3a8fd6", "#2a2a2a") + face(450, 120, "#ff7a45", "#c98a3a") +
  '<path d="M70 150q-14 6 0 12" fill="none"/>' +
  '<g transform="translate(70 128)"><path d="M-10 6q10 8 20 0" stroke="#3b2414" stroke-width="3" fill="none" stroke-linecap="round"/></g>' +
  '<g transform="translate(450 128)"><path d="M-10 10q10 -8 20 0" stroke="#3b2414" stroke-width="3" fill="none" stroke-linecap="round"/></g>' +
  '<rect x="190" y="96" width="140" height="56" rx="12" fill="#19c39a" fill-opacity=".3" stroke="#0f7a5f" stroke-width="2.5"/>' +
  T(260, 120, 14, 'THE FACT', "#0f7a5f", B + MID) + T(260, 142, 15, 'it lasted 3 hours', "#141a33", MID) +
  A2ART.bubble(20, 12, 160, 54, "3 hours flew by!", 60) + A2ART.bubble(340, 12, 162, 54, "3 hours? Too long.", 460) +
  '<path d="M150 124h36M334 124h36" stroke="#141a33" stroke-width="2.5" stroke-dasharray="5 4"/>' +
  T(260, 196, 14, 'same fact, two points of view', "#5b6180", MID) +
  '</svg>';

/* the review, sentence by sentence: [text, 1 if opinion] */
var SENT = {
  mild: [["[[Place]] opens at 9am.", 0], ["It costs 5 pounds to get in.", 0], ["The [[highlight]] is brilliant.", 1], ["There is a cafe next to the gate.", 0], ["You should go on a sunny day.", 1]],
  medium: [["[[Place]] is open every day from 9am to 5pm.", 0], ["Tickets cost 8 pounds, or 4 pounds for under 16s.", 0], ["I went last Sunday with my cousin.", 0],
    ["The [[highlight]] is easily the best part.", 1], ["The cafe sells hot food until 3pm.", 0], ["Sadly, the toilets were a disgrace.", 1], ["You should get there early to beat the queues.", 1]],
  spicy: [["[[Place]] opened in 1987 and now gets around 2000 visitors a week.", 0], ["Tickets cost 8 pounds, which is shockingly expensive for what you get.", 1],
    ["The [[highlight]] is, without doubt, the finest in the country.", 1], ["Last year, the cafe won a local award for its soup.", 0], ["Parking is free after 4pm.", 0],
    ["Frankly, the gift shop is a rip off.", 1], ["Any family looking for a day out would be mad to miss it.", 1]]
};
function reviewHtml(lv){
  return '<p class="a2task"><b>Review: [[place]]</b><br>' + SENT[lv].map(function(s){ return s[0]; }).join(" ") + '</p>';
}

(window.A2PACKS = window.A2PACKS || {})["fact-or-opinion"] = {
  a2: true,
  id: "a2-fact-or-opinion",
  title: "Fact or opinion?",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "Sort it, say why, then find both in a real review.",
  blurb: "Sorting facts from opinions and saying why, then hunting for both in a real review, then two people with one fact and two points of view. Four short chunks, with a review card to make at the end.",
  note: "Sorting facts from opinions and explaining why, then finding both in a review. Four five minute chunks and a review card to make. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Spotter", line: "Spotter: short, clear sentences. One clue at a time." },
    { id: "medium", name: "Sorter", line: "Sorter: longer texts, and saying why you sorted it that way." },
    { id: "spicy", name: "Judge", line: "Judge: mixed sentences, sneaky opinions and points of view." }
  ],
  themes: {
    time: { name: "Time travel", w: { place: "the time museum", highlight: "Victorian street", thing: "time machine", event: "the trip to 1850", dur: "3 hours", pa: "the tour guide", pb: "a visitor" } },
    football: { name: "Football", w: { place: "the stadium tour", highlight: "trophy room", thing: "match ball", event: "the cup final", dur: "3 hours", pa: "the home manager", pb: "an away fan" } },
    horror: { name: "Horror", w: { place: "the old hospital tour", highlight: "dark basement", thing: "torch", event: "the ghost walk", dur: "3 hours", pa: "the ghost guide", pb: "a visitor" } },
    fishing: { name: "Fishing", w: { place: "the fishery", highlight: "big lake", thing: "fishing rod", event: "the fishing match", dur: "3 hours", pa: "the match organiser", pb: "an angler" } },
    music: { name: "Music", w: { place: "the theatre tour", highlight: "costume room", thing: "microphone", event: "the musical", dur: "3 hours", pa: "the director", pb: "a theatre critic" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: TESTS,
  steps: [

    /* ---------- chunk 1: sort it ---------- */
    { type: "learn", topic: "Sort it", title: "Two questions sort almost anything",
      fig: TESTS,
      html: "<p>Ask two questions about any statement.</p>" +
        "<p><b>Could I check it?</b> Count it, measure it, look it up, see it. If yes, it is a <b>fact</b>.</p>" +
        "<p><b>Could someone reasonably disagree?</b> If two people could think different things and both be fair, it is an <b>opinion</b>.</p>",
      lv: { spicy: { html: "<p>Ask two questions about any statement.</p>" +
        "<p><b>Could I check it?</b> If yes, it is a <b>fact</b>, even if checking shows it is untrue.</p>" +
        "<p><b>Could someone reasonably disagree?</b> If yes, it is an <b>opinion</b>, even if most people agree with it.</p>" +
        "<p>Some sentences are both: a fact with an opinion bolted on. \"Tickets cost 8 pounds, which is a rip off.\" Sort those by the part that is doing the persuading.</p>" } } },

    { type: "sort", topic: "Sort it",
      q: "Sort them: fact or opinion?",
      buckets: ["Fact", "Opinion"],
      cards: [["The [[thing]] is 2 metres long.", 0], ["The [[thing]] is far too big.", 1], ["[[Event]] starts at 7pm.", 0], ["[[Event]] is the best night of the year.", 1], ["Tickets cost 10 pounds.", 0], ["Everybody should go.", 1]],
      hint: "For each card ask: could I check it, or could someone disagree?",
      why: "Lengths, times and prices can be checked. Far too big, the best and should are opinions someone could disagree with.",
      lv: {
        mild: { cards: [["The [[thing]] is 2 metres long.", 0], ["The [[thing]] is far too big.", 1], ["[[Event]] starts at 7pm.", 0], ["[[Event]] is the best night of the year.", 1]] },
        spicy: { cards: [["The [[thing]] is 2 metres long.", 0], ["At 2 metres, the [[thing]] is ridiculously long.", 1], ["[[Event]] starts at 7pm.", 0], ["Most people agree [[event]] is the best night of the year.", 1], ["The moon is made of cheese.", 0], ["It is a fact that tickets are too pricey.", 1]],
          hint: "Two traps: a statement can be checkable and untrue, and saying \"it is a fact\" does not make it one.",
          why: "The moon one is checkable (and false), so it sorts as a fact type statement. Ridiculously long, best and too pricey are opinions, however they are dressed up." } } },

    { type: "mc", topic: "Sort it",
      q: "<b>[[Place]] has a cafe.</b><br>Fact or opinion?",
      options: ["Fact", "Opinion"], fixed: true,
      answer: 0,
      slips: { 1: "Have a look for a clue word. There is no best, should or I think. You could go and see the cafe." },
      hint: "Could you go and see it?",
      why: "You could go and see the cafe. Nobody could reasonably disagree that it is there.",
      lv: {
        medium: { q: "<b>The cafe at [[place]] is a bit pricey.</b><br>Fact or opinion?", answer: 1,
          slips: { 0: "Prices are facts, but a bit pricey is a judgement. One person's pricey is another person's bargain." },
          hint: "Could someone reasonably disagree?",
          why: "Pricey is a judgement. Someone with more money might call it cheap." },
        spicy: { q: "<b>Over half of visitors to [[place]] buy something at the cafe.</b><br>Fact or opinion?", answer: 0,
          slips: { 1: "It sounds like it is selling the cafe, but it could be checked with the till records." },
          hint: "Could someone count it?",
          why: "Till records could check it. It might be used to persuade, but it is still a fact type statement." } } },

    { type: "mc", topic: "Sort it",
      q: "Bonnie barks: \"This is the comfiest cushion in the house.\" Fact or opinion?",
      fig: '<svg viewBox="0 0 360 150" role="img" aria-label="Bonnie the poodle on a cushion">' +
        '<ellipse cx="120" cy="128" rx="80" ry="18" fill="#e04848"/><ellipse cx="120" cy="122" rx="74" ry="14" fill="#ff7272"/>' + A2ART.bonnie(120, 80, 0.85, "sit") +
        A2ART.bubble(196, 14, 150, 52, "Comfiest\ncushion ever.", 210) + '</svg>',
      options: ["Opinion", "Fact"], fixed: true,
      answer: 0,
      slips: { 1: "Comfiest is a judgement. Another dog might prefer the sofa." },
      hint: "Look for the clue word.",
      why: "Comfiest is what Bonnie thinks. Another dog might disagree, and nobody could measure comfy." },

    /* ---------- chunk 2: say why ---------- */
    { type: "learn", topic: "Say why", title: "Say why with because",
      fig: BECAUSE,
      html: "<p>Sorting is half the job. The other half is saying <b>why</b>.</p>" +
        "<p>For a fact: <b>It is a fact because I could check it by</b> counting, measuring, looking it up or seeing it.</p>" +
        "<p>For an opinion: <b>It is an opinion because the word</b> best (or amazing, or should) <b>shows what someone thinks.</b></p>",
      lv: { spicy: { html: "<p>Sorting is half the job. The other half is saying <b>why</b>, and the best answers point at the exact words.</p>" +
        "<p><b>Fact:</b> name the part you could check and how. \"The 1987 could be looked up.\"</p>" +
        "<p><b>Opinion:</b> name the word doing the judging, and say why someone could disagree. \"Shockingly expensive judges the price; someone else might think 8 pounds is fair.\"</p>" } } },

    { type: "mc", topic: "Say why",
      q: "<b>The [[highlight]] is the best part of [[place]].</b><br>Which is the best explanation?",
      options: ["It is an opinion because the word best shows what someone thinks.", "It is an opinion because it is about [[place]].", "It is a fact because it says the [[highlight]]."],
      answer: 0,
      slips: { 1: "Being about [[place]] does not make it an opinion. Point at the clue word.", 2: "Naming a thing does not make the sentence a fact. Look at what it says about it." },
      hint: "A good explanation points at the clue word.",
      why: "Pointing at best explains it. Someone else might think a different part is best.",
      lv: { spicy: { q: "<b>Tickets cost 8 pounds, which is shockingly expensive.</b><br>Which is the strongest explanation?",
        options: ["The price can be checked, but shockingly expensive judges it, and someone else might think 8 pounds is fair.", "It is a fact because it has a number in it.", "It is an opinion because it is about money."],
        slips: { 1: "The number is the checkable part. The rest of the sentence adds a judgement.", 2: "Money can be a fact. Point at the words doing the judging." } } } },

    { type: "text", topic: "Say why", explain: true,
      q: "Explain why this is a fact. Start with <b>It is a fact because</b> if you like.<br><b>[[Event]] starts at 7pm.</b>",
      need: [["check", "look", "poster", "ticket", "clock", "website", "see", "time", "find"]],
      model: "It is a fact because I could check the time on a poster.",
      slips: [[["good", "nice", "fun", "late", "early"], "That is a judgement about the time. Say how you could check it."]],
      hint: "Where could you check what time something starts?",
      why: "You could check the time on a poster, a ticket or a website, so it is a fact.",
      lv: { spicy: { q: "Explain why this is an opinion, pointing at the exact word or words.<br><b>Any family looking for a day out would be mad to miss [[place]].</b>",
        need: [["mad", "miss", "family", "judge", "judgement", "opinion", "disagree", "think", "view", "check"]],
        model: "Mad to miss is a judgement. Some families might not enjoy it, so people could disagree.",
        hint: "Which words judge? Could someone reasonably disagree?",
        why: "Would be mad to miss judges it and pushes you. Lots of families could reasonably choose somewhere else." } } },

    { type: "text", topic: "Say why",
      q: "Now explain why this is an opinion.<br><b>The [[thing]] is amazing.</b>",
      need: [["amazing", "think", "feel", "opinion", "disagree", "someone", "people", "check", "agree", "view"]],
      model: "It is an opinion because the word amazing shows what someone thinks.",
      hint: "Which word shows what someone thinks?",
      why: "Amazing is the clue word. Someone else might think the [[thing]] is boring.",
      lv: { spicy: { q: "Now a fact in disguise. Explain why this is a fact type statement, even though it sounds persuasive.<br><b>Last year, the cafe won a local award for its soup.</b>",
        need: [["check", "look", "record", "award", "news", "list", "find", "prove", "website", "paper"]],
        model: "You could check the award list or the local news to see if it won.",
        hint: "How could you check whether something won an award?",
        why: "An award is on record somewhere. It is there to persuade you, but it can be checked." } } },

    { type: "match", topic: "Say why",
      q: "Match each statement to the best reason.",
      pairs: [["There are 40 seats.", "Fact: I could count them."], ["The seats are uncomfortable.", "Opinion: someone could find them comfy."], ["It opened in 2001.", "Fact: I could look it up."], ["You should sit at the front.", "Opinion: should shows what someone thinks."]],
      hint: "Find the two facts first, then match each opinion to its clue.",
      why: "Each fact has a way to check it. Each opinion has a clue that someone could disagree with.",
      lv: { mild: { pairs: [["There are 40 seats.", "Fact: I could count them."], ["The seats are uncomfortable.", "Opinion: someone could find them comfy."], ["You should sit at the front.", "Opinion: should shows what someone thinks."]] } } },

    /* ---------- chunk 3: find both in a review ---------- */
    { type: "learn", topic: "Find both", title: "A real review",
      fig: REVIEW,
      html: "<p>Reviews mix facts and opinions together. Have a read of this one. Next, you get a highlighter.</p>" + reviewHtml("medium"),
      lv: { mild: { html: "<p>Reviews mix facts and opinions together. Have a read of this short one. Next, you get a highlighter.</p>" + reviewHtml("mild") },
            spicy: { html: "<p>Reviews mix facts and opinions together, sometimes in the same sentence. Have a read. Next, you get a highlighter.</p>" + reviewHtml("spicy") } } },

    { type: "widget", topic: "Find both", unscored: true,
      title: "Highlight the opinions",
      html: "Tap any sentence that has an opinion in it. It turns pink. Tap again to take it back. When you are happy, tap <b>Check my highlights</b>.",
      mount: function(el, api){
        var lv = SENT[api.level] ? api.level : "medium";
        var list = SENT[lv].map(function(s){ return [api.tok(s[0]), s[1]]; });
        var d = api.data;
        if(!d.lv || d.lv !== lv){ d.lv = lv; d.on = []; d.checked = false; }
        var wrap = document.createElement("div");
        wrap.style.cssText = "display:flex;flex-direction:column;gap:8px;margin:10px 0";
        var out = document.createElement("p");
        var go = document.createElement("button");
        go.type = "button"; go.className = "btn"; go.textContent = "Check my highlights";
        var btns = list.map(function(s, k){
          var b = document.createElement("button");
          b.type = "button";
          b.style.cssText = "text-align:left;font:inherit;padding:10px 12px;border-radius:10px;border:2px solid #141a33;background:#fff;color:#141a33;cursor:pointer";
          b.textContent = s[0];
          b.onclick = function(){
            if(d.checked) return;
            var i = d.on.indexOf(k);
            if(i >= 0) d.on.splice(i, 1); else d.on.push(k);
            draw(); api.save();
          };
          wrap.appendChild(b);
          return b;
        });
        function draw(){
          btns.forEach(function(b, k){
            var on = d.on.indexOf(k) >= 0, op = list[k][1] === 1;
            b.style.background = on ? "#ffd0de" : "#fff";
            b.style.borderStyle = "solid";
            if(d.checked){
              b.style.borderColor = op ? "#d63c6c" : "#0f7a5f";
              if(on !== op) b.style.borderStyle = "dashed";
              b.style.cursor = "default";
            }
          });
          if(d.checked){
            var ops = list.filter(function(s){ return s[1] === 1; }).length;
            var hit = d.on.filter(function(k){ return list[k][1] === 1; }).length;
            var extra = d.on.length - hit;
            out.innerHTML = "<b>You found " + hit + " of the " + ops + " opinions.</b> " +
              (extra ? "You also highlighted " + extra + " fact" + (extra === 1 ? "" : "s") + " (dashed): have another look at " + (extra === 1 ? "it" : "them") + " and ask, could I check it? " : "") +
              (hit < ops ? "The dashed pink borders show opinions you could still catch. " : "") +
              "Pink borders are opinions, green borders are facts.";
            go.textContent = "Have another go";
          }else{
            out.textContent = d.on.length + " highlighted so far.";
            go.textContent = "Check my highlights";
          }
        }
        go.onclick = function(){
          if(d.checked){ d.checked = false; d.on = []; draw(); api.save(); return; }
          d.checked = true; draw(); api.save(); api.done("done");
        };
        el.appendChild(wrap); el.appendChild(go); el.appendChild(out);
        draw();
      } },

    { type: "multi", topic: "Find both",
      q: "Pick the <b>three</b> facts from the review.",
      options: ["[[Place]] is open every day from 9am to 5pm.", "Tickets cost 8 pounds, or 4 pounds for under 16s.", "The cafe sells hot food until 3pm.", "The [[highlight]] is easily the best part.", "Sadly, the toilets were a disgrace."],
      answers: [0, 1, 2],
      hint: "Look for times and prices.",
      why: "Opening times, prices and when hot food stops can all be checked. Best part and a disgrace are opinions.",
      lv: {
        mild: { q: "Pick the <b>two</b> facts from the review.",
          options: ["[[Place]] opens at 9am.", "It costs 5 pounds to get in.", "The [[highlight]] is brilliant.", "You should go on a sunny day."], answers: [0, 1],
          hint: "Look for a time and a price.",
          why: "A time and a price can be checked. Brilliant and should are opinions." },
        spicy: { q: "Pick the <b>three</b> sentences that are only fact, with no opinion added.",
          options: ["[[Place]] opened in 1987 and now gets around 2000 visitors a week.", "Last year, the cafe won a local award for its soup.", "Parking is free after 4pm.", "Tickets cost 8 pounds, which is shockingly expensive for what you get.", "Frankly, the gift shop is a rip off."],
          answers: [0, 1, 2],
          hint: "One sentence has a price in it but then adds a judgement.",
          why: "Dates, visitor numbers, awards and parking times can all be checked. The ticket sentence starts as fact but adds shockingly expensive." } } },

    { type: "mc", topic: "Find both",
      q: "<b>Sadly, the toilets were a disgrace.</b><br>Why is this an opinion?",
      options: ["A disgrace is a judgement. Someone else might think the toilets were fine.", "It is about toilets.", "It happened in the past."],
      answer: 0,
      slips: { 1: "Toilets can be in a fact too: \"There are 4 toilets.\" Look at what it says about them.", 2: "Facts can be about the past too, like a date. Look for the judging words." },
      hint: "Which words judge the toilets?",
      why: "Disgrace (and sadly) judge them. That could be argued with, so it is an opinion.",
      lv: {
        mild: { q: "<b>You should go on a sunny day.</b><br>Why is this an opinion?",
          options: ["Should shows what the writer thinks you ought to do.", "It is about the weather.", "It has the word day in it."],
          slips: { 1: "The weather can be a fact: \"It rained on Monday.\" Look for the clue word.", 2: "Day is not a clue word. Look for should." },
          hint: "Look for should.",
          why: "Should tells you what the writer thinks. Someone else might love it in the rain." },
        spicy: { q: "<b>Frankly, the gift shop is a rip off.</b><br>What does <b>Frankly</b> do in this sentence?",
          options: ["It tells you an honest opinion is coming, which makes it sound more trustworthy.", "It turns the sentence into a fact.", "It tells you the name of the shop."],
          slips: { 1: "Frankly does the opposite: it flags a personal view.", 2: "It is not a name here. It is a signal word." },
          hint: "Think about how frankly makes the writer sound.",
          why: "Frankly signals a personal opinion, and makes the writer sound honest, so you are more likely to believe it." } } },

    { type: "num", topic: "Find both",
      q: "How many sentences in the review are only facts?",
      boxes: [{ label: "Fact sentences", a: 4 }],
      slips: [[3, "Close. Did you count the sentence about going last Sunday? That could be checked."], [7, "That is every sentence. Three of them have opinions."], [5, "One too many. Should get there early is advice: an opinion."]],
      hint: "Go sentence by sentence: could I check all of it?",
      why: "There are <b>4</b>: the opening times, the prices, last Sunday, and the hot food until 3pm.",
      lv: {
        mild: { boxes: [{ label: "Fact sentences", a: 3 }],
          slips: [[2, "Close. There is one more: the cafe next to the gate could be seen."], [5, "That is every sentence. Brilliant and should are opinions."], [4, "One too many. Should is a clue word."]],
          why: "There are <b>3</b>: opens at 9am, costs 5 pounds, and the cafe next to the gate." },
        spicy: { boxes: [{ label: "Fact sentences", a: 3 }],
          slips: [[4, "One too many. The ticket sentence starts as fact but adds an opinion."], [2, "Close. The soup award could be checked too."], [7, "That is every sentence. Four of them add a judgement."]],
          why: "There are <b>3</b>: opened in 1987 with 2000 visitors, the soup award, and free parking after 4pm." } } },

    /* ---------- chunk 4: points of view ---------- */
    { type: "learn", topic: "Points of view", title: "Same fact, different points of view",
      fig: POV,
      html: "<p>Two people can agree on a fact and still have different opinions about it.</p>" +
        "<p class=\"a2task\">[[Event]] lasted [[dur]].<br><b>[[Pa]]:</b> \"[[Dur]] flew by. Every minute was worth it.\"<br><b>[[Pb]]:</b> \"[[Dur]]? Far too long. I nearly fell asleep.\"</p>" +
        "<p>The fact stays the same. The <b>point of view</b> is how each person feels about it.</p>",
      lv: { spicy: { html: "<p>Two people can agree on a fact and still have different opinions about it.</p>" +
        "<p class=\"a2task\">[[Event]] lasted [[dur]].<br><b>[[Pa]]:</b> \"[[Dur]] flew by. Every minute was worth it.\"<br><b>[[Pb]]:</b> \"[[Dur]]? Far too long. I nearly fell asleep.\"</p>" +
        "<p>Ask <b>whose</b> point of view it is. [[Pa]] helped make it happen, so may want it to sound good. Writers also shape facts with little words: <b>only</b> 40 people came, or <b>a full</b> 40 people came. Same fact, different spin.</p>" } } },

    { type: "mc", topic: "Points of view",
      q: "What do [[pa]] and [[pb]] <b>agree</b> on?",
      options: ["[[Event]] lasted [[dur]].", "It flew by.", "It was far too long."],
      answer: 0,
      slips: { 1: "That is [[pa]]'s opinion. [[Pb]] does not agree.", 2: "That is [[pb]]'s opinion. [[Pa]] would not agree." },
      hint: "Find the part they both say.",
      why: "They both agree it lasted [[dur]]. That is the fact. Everything else is their own point of view." },

    { type: "sort", topic: "Points of view",
      q: "Who said it? Sort each line to the person.",
      buckets: ["[[Pa]]", "[[Pb]]"],
      cards: [["Every minute was worth it.", 0], ["I nearly fell asleep.", 1], ["[[Dur]] flew by.", 0], ["Far too long.", 1]],
      hint: "One person loved it, one did not.",
      why: "[[Pa]] enjoyed it. [[Pb]] did not. Same [[dur]], two points of view." },

    { type: "mc", topic: "Points of view", explain: true,
      q: "Is one of them right and one of them wrong?",
      options: ["No. They are both opinions, so both can be fair.", "Yes. [[Pa]] is right because they are in charge.", "Yes. [[Pb]] is right because they said it second."],
      answer: 0,
      slips: { 1: "Being in charge does not make an opinion a fact.", 2: "The order people speak in does not decide anything." },
      hint: "Can an opinion be checked?",
      why: "Opinions cannot be checked, so neither is right or wrong. Only the fact, [[dur]], could be checked.",
      lv: { spicy: { q: "<b>Only 40 people came to [[event]].</b><br>Which word turns the fact into a point of view?",
        options: ["Only", "40", "people", "came"],
        slips: { 1: "40 is the fact. You could count it.", 2: "People is just who came.", 3: "Came is just the action." },
        hint: "Which word tells you how to feel about the number?",
        why: "Only makes 40 sound disappointing. \"A full 40 people came\" uses the same fact for the opposite view." } } },

    { type: "text", topic: "Points of view", stretch: true,
      q: "Your turn, if you like. Here is a fact: <b>It rained all day.</b> Write an opinion about it from someone who was glad.",
      need: [["glad", "love", "loved", "great", "good", "happy", "best", "brilliant", "amazing", "nice", "lovely", "perfect", "fun", "cosy", "fantastic", "enjoy", "enjoyed", "like", "liked", "think", "relief", "pleased", "thankful"]],
      model: "I loved it. The rain was perfect for staying in and reading.",
      hint: "Who might be glad of rain? A gardener, a duck, someone who wanted a day indoors.",
      why: "Same fact, happy point of view. A gardener and a picnicker would feel very differently about it.",
      lv: { spicy: { q: "Your turn, if you like. Write <b>two</b> sentences about [[event]], both using the fact that 40 people came: one making it sound good, one making it sound bad.",
        need: [["40", "forty"], ["only", "just", "full", "whole", "packed", "empty", "great", "poor", "sad", "disappointing", "brilliant", "amazing", "good", "bad", "few", "whopping", "massive", "busy", "quiet"]],
        model: "A whopping 40 people packed in to watch. Sadly, only 40 people bothered to turn up.",
        hint: "Use a word like a whopping or a full for good, and only or just for bad.",
        why: "Little words like only and a whopping spin the same fact into opposite points of view." } } }
  ],

  realWorld: {
    title: "Reviews before you go anywhere",
    html: "<p>Before a trip, a meal or a gig, most people read reviews. Pulling the facts (prices, times, distances) away from the opinions helps you decide for yourself.</p>" +
      "<p>Our big question works this way too: <b>If we could time travel, should we?</b> Facts can tell us what the past was like. Whether we <i>should</i> go is a point of view, and people will disagree.</p>",
    fig: '<svg viewBox="0 0 420 140" role="img" aria-label="Jay by a time portal">' + A2ART.portal(80, 70, 56) + A2ART.jay(250, 50, 0.85, "smile") +
      A2ART.bubble(300, 6, 112, 52, "Fact, or\nopinion?", 304) + '</svg>'
  },

  make: {
    title: "Make a review card",
    intro: "Pick anything: a place, a snack, a song, a film. Give one fact and one opinion. Keep it, put it on the wall, or send it to Jay.",
    fields: [
      { id: "thing", label: "What are you reviewing?", ph: "The school minibus", max: 32 },
      { id: "fact", label: "A fact about it", ph: "It has 16 seats.", max: 70 },
      { id: "op", label: "Your opinion of it", ph: "It is the best way to start a trip.", max: 70 },
      { id: "stars", label: "Stars out of 5", ph: "4", max: 2 }
    ],
    svg: function(v){
      function e(t){ return String(t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n, max){ var w = String(t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n){ if(cur.trim()) out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max); }
      var n = parseInt(v.stars, 10); if(isNaN(n)) n = 0; n = Math.max(0, Math.min(5, n));
      var stars = [0, 1, 2, 3, 4].map(function(k){ return '<path transform="translate(' + (420 + k * 34) + ' 60) scale(1.2)" d="M0 -12l3.5 7.5 8 1-6 5.5 1.5 8-7 -4-7 4 1.5 -8-6 -5.5 8 -1z" fill="' + (k < n ? "#ffd23f" : "#e6e1d2") + '" stroke="#141a33" stroke-width="1.5"/>'; }).join("");
      var title = wrap(v.thing, 20, 2);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#fffdf6"/>' +
        '<rect x="0" y="0" width="600" height="110" rx="24" fill="#2d2466"/><rect x="0" y="80" width="600" height="30" fill="#2d2466"/>' +
        '<text x="34" y="40" font-family="Verdana,Arial,sans-serif" font-size="15" font-weight="700" fill="#ffd23f" letter-spacing="3">MY REVIEW</text>' +
        title.map(function(l, k){ return '<text x="34" y="' + (72 + k * 26) + '" font-family="Verdana,Arial,sans-serif" font-size="22" font-weight="700" fill="#fff">' + e(l) + '</text>'; }).join("") +
        stars +
        '<rect x="30" y="134" width="540" height="110" rx="14" fill="#d4f5ea" stroke="#0f7a5f" stroke-width="3"/>' +
        '<text x="50" y="162" font-family="Verdana,Arial,sans-serif" font-size="15" font-weight="700" fill="#0f7a5f">FACT</text>' +
        wrap(v.fact, 36, 3).map(function(l, k){ return '<text x="50" y="' + (190 + k * 24) + '" font-family="Verdana,Arial,sans-serif" font-size="19" fill="#141a33">' + e(l) + '</text>'; }).join("") +
        '<rect x="30" y="260" width="540" height="110" rx="14" fill="#ffe0ea" stroke="#d63c6c" stroke-width="3"/>' +
        '<text x="50" y="288" font-family="Verdana,Arial,sans-serif" font-size="15" font-weight="700" fill="#d63c6c">OPINION</text>' +
        wrap(v.op, 36, 3).map(function(l, k){ return '<text x="50" y="' + (316 + k * 24) + '" font-family="Verdana,Arial,sans-serif" font-size="19" fill="#141a33">' + e(l) + '</text>'; }).join("") +
        '</svg>';
    }
  }
};
})();
