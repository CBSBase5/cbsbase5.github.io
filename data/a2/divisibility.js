/* Base 5 Autumn 2 activity: Divisibility detective.
   Maths. Quick tests for 2, 5 and 10 (and 3 and 4 on Spicy). ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, extra){ return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '" fill="#141a33" ' + (extra || "") + '>' + s + '</text>'; }

/* a magnifying glass over the last digit of a number */
function lens(num, note, col){
  var s = String(num), n = s.length, cw = 54, x0 = 260 - n * cw / 2;
  var out = '<svg viewBox="0 0 520 180" role="img" aria-label="A magnifying glass on the last digit of ' + s + '">' +
    '<rect width="520" height="180" rx="14" fill="#f4f1ea"/>';
  for(var i = 0; i < n; i++){
    var last = i === n - 1;
    out += T(x0 + i * cw + cw / 2, 100, s.charAt(i), 46, 'text-anchor="middle" font-weight="700"' + (last ? ' fill="' + (col || "#e04848") + '"' : ' fill-opacity=".35"'));
  }
  var lx = x0 + (n - 1) * cw + cw / 2;
  out += '<circle cx="' + lx + '" cy="84" r="30" fill="#fff" fill-opacity=".25" stroke="#141a33" stroke-width="5"/>' +
    '<path d="M' + (lx + 24) + ' 108l30 34" stroke="#7a5532" stroke-width="10" stroke-linecap="round"/>';
  if(note) out += T(260, 164, note, 16, 'text-anchor="middle" font-weight="700"');
  return out + '</svg>';
}

/* pairs: an even number pairs up, an odd number has one left over */
function pairs(n){
  var out = '<svg viewBox="0 0 520 150" role="img" aria-label="' + n + ' dots put into pairs">' + '<rect width="520" height="150" rx="14" fill="#f4f1ea"/>';
  var p = Math.floor(n / 2), x0 = 30;
  for(var i = 0; i < p; i++){
    out += '<rect x="' + (x0 + i * 46) + '" y="30" width="38" height="70" rx="10" fill="#fff" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
      '<circle cx="' + (x0 + 19 + i * 46) + '" cy="50" r="10" fill="#22b8e6"/><circle cx="' + (x0 + 19 + i * 46) + '" cy="80" r="10" fill="#22b8e6"/>';
  }
  if(n % 2) out += '<circle cx="' + (x0 + 19 + p * 46) + '" cy="50" r="10" fill="#e04848"/>' + T(x0 + 19 + p * 46, 124, "left over", 13, 'text-anchor="middle" fill="#e04848" font-weight="700"');
  out += T(500, 132, n + (n % 2 ? " is odd" : " is even"), 16, 'text-anchor="end" font-weight="700"');
  return out + '</svg>';
}

/* the three clue cards */
var CLUES =
  '<svg viewBox="0 0 520 190" role="img" aria-label="Three clue cards: last digit even for 2, 0 or 5 for 5, 0 for 10">' +
  '<rect width="520" height="190" rx="16" fill="#f4f1ea"/>' +
  [["2", "#22b8e6", "ends in", "0 2 4 6 8"], ["5", "#ff8a3d", "ends in", "0 or 5"], ["10", "#19c39a", "ends in", "0"]].map(function(c, k){
    var x = 20 + k * 166;
    return '<g transform="rotate(' + [-2, 1, -1][k] + ' ' + (x + 73) + ' 95)"><rect x="' + x + '" y="22" width="146" height="146" rx="10" fill="#fff" stroke="' + c[1] + '" stroke-width="4"/>' +
      '<rect x="' + x + '" y="22" width="146" height="44" rx="10" fill="' + c[1] + '"/><rect x="' + x + '" y="50" width="146" height="16" fill="' + c[1] + '"/>' +
      T(x + 73, 52, "Splits by " + c[0], 17, 'text-anchor="middle" font-weight="700"') +
      T(x + 73, 100, c[2], 15, 'text-anchor="middle"') +
      T(x + 73, 136, c[3], 22, 'text-anchor="middle" font-weight="700"') + '</g>';
  }).join("") + '</svg>';

var CLUES34 =
  '<svg viewBox="0 0 520 200" role="img" aria-label="Two more clue cards: digit total for 3, last two digits for 4">' +
  '<rect width="520" height="200" rx="16" fill="#f4f1ea"/>' +
  [["3", "#8a5cf6", "Add the digits.", "Total in the 3s?", "471: 4+7+1 = 12"], ["4", "#ff5d8f", "Last two digits.", "In the 4s?", "1736: 36 = 4 x 9"]].map(function(c, k){
    var x = 24 + k * 250;
    return '<rect x="' + x + '" y="20" width="222" height="160" rx="10" fill="#fff" stroke="' + c[1] + '" stroke-width="4"/>' +
      '<rect x="' + x + '" y="20" width="222" height="40" rx="10" fill="' + c[1] + '"/><rect x="' + x + '" y="46" width="222" height="14" fill="' + c[1] + '"/>' +
      T(x + 111, 47, "Splits by " + c[0], 18, 'text-anchor="middle" font-weight="700" fill="#fff"') +
      T(x + 111, 90, c[2], 15, 'text-anchor="middle"') + T(x + 111, 114, c[3], 15, 'text-anchor="middle"') +
      T(x + 111, 154, c[4], 15, 'text-anchor="middle" font-weight="700"');
  }).join("") + '</svg>';

/* hundred square strip showing a pattern of multiples */
function strip(step, from, to, note){
  var n = to - from + 1, per = 10, cw = 46, H = Math.ceil(n / per) * 42 + 46;
  var out = '<svg viewBox="0 0 520 ' + H + '" role="img" aria-label="Numbers from ' + from + ' to ' + to + ' with the multiples of ' + step + ' coloured">' +
    '<rect width="520" height="' + H + '" rx="14" fill="#f4f1ea"/>';
  for(var i = 0; i < n; i++){
    var v = from + i, r = Math.floor(i / per), c = i % per, on = v % step === 0;
    out += '<rect x="' + (28 + c * cw) + '" y="' + (14 + r * 42) + '' + '" width="40" height="36" rx="6" fill="' + (on ? "#ffd23f" : "#fff") + '" stroke="#141a33" stroke-opacity=".3" stroke-width="1.5"/>' +
      T(48 + c * cw, 38 + r * 42, String(v), 14, 'text-anchor="middle"' + (on ? ' font-weight="700"' : ''));
  }
  if(note) out += T(260, H - 14, note, 15, 'text-anchor="middle" font-weight="700"');
  return out + '</svg>';
}

var DESK =
  '<svg viewBox="0 0 520 180" role="img" aria-label="Jay at a detective desk">' +
  '<rect width="520" height="180" rx="16" fill="#efe6d6"/>' +
  '<rect x="0" y="140" width="520" height="40" fill="#7a5532"/>' +
  A2ART.jay(110, 64, 0.9, "hmm") +
  '<rect x="220" y="30" width="270" height="96" rx="8" fill="#fffbe0" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
  T(236, 58, "CASE: 3 4 5", 16, 'font-weight="700"') + T(236, 84, "Last digit: 5", 15) + T(236, 108, "Suspect: the 5 times table", 14) +
  A2ART.egg(A2ART.bird(470, 156, 0.6, "#8a5cf6"), "The detective's assistant. It has solved more cases than Jay. Unhand me, goblin.") +
  '</svg>';

/* widget: hundred square detective */
function mountSquare(el, api){
  var tests = api.level === "spicy" ? [2, 3, 4, 5, 10] : [2, 5, 10];
  var start = api.level === "medium" ? 101 : 1;
  var d = api.data; d.tried = d.tried || [];
  var cur = null, picks = {};
  el.innerHTML = '<p class="tiny">Pick a clue. Tap the numbers you think it catches. Then press Reveal to see how you did.</p>' +
    '<div class="dtbtns" style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0"></div>' +
    '<div class="dtgrid" style="display:grid;grid-template-columns:repeat(10,1fr);gap:3px;max-width:420px;margin:0 auto"></div>' +
    '<div style="text-align:center;margin-top:8px"><button type="button" class="btn dtrev">Reveal</button></div>' +
    '<p class="dtout" aria-live="polite" style="text-align:center;min-height:1.4em"></p>';
  var bw = el.querySelector(".dtbtns"), gw = el.querySelector(".dtgrid"), out = el.querySelector(".dtout");
  tests.forEach(function(t){
    var b = document.createElement("button"); b.type = "button"; b.className = "a2chip"; b.textContent = "Splits by " + t;
    b.setAttribute("aria-pressed", "false");
    b.onclick = function(){ cur = t; picks = {}; [].forEach.call(bw.children, function(x){ x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); paint(false); out.textContent = "Now tap the numbers that split by " + t + "."; };
    bw.appendChild(b);
  });
  var cells = [];
  for(var i = 0; i < 100; i++){
    var c = document.createElement("button"); c.type = "button"; c.textContent = String(start + i);
    c.style.cssText = "padding:4px 0;border:1px solid #c9c2b2;border-radius:5px;background:#fffbe9;color:#141a33;font-size:12px;cursor:pointer";
    (function(v){ c.onclick = function(){ if(!cur){ out.textContent = "Pick a clue first."; return; } picks[v] = !picks[v]; paint(false); }; })(start + i);
    gw.appendChild(c); cells.push(c);
  }
  function paint(rev){
    cells.forEach(function(c, k){
      var v = start + k, p = !!picks[v], yes = cur && v % cur === 0;
      c.style.background = rev ? (yes && p ? "#9be3c6" : yes ? "#ffd23f" : p ? "#ffd0d0" : "#fffbe9") : (p ? "#d9f3ff" : "#fffbe9");
      c.style.fontWeight = rev && yes ? "700" : "400";
    });
  }
  el.querySelector(".dtrev").onclick = function(){
    if(!cur){ out.textContent = "Pick a clue first, if you like."; return; }
    var hit = 0, miss = 0, extra = 0;
    cells.forEach(function(c, k){ var v = start + k, yes = v % cur === 0; if(yes && picks[v]) hit++; else if(yes) miss++; else if(picks[v]) extra++; });
    paint(true);
    out.innerHTML = "Green: you caught it. Yellow: one that got away. Pink: not a match. You caught <b>" + hit + "</b> of " + (hit + miss) + ".";
    if(d.tried.indexOf(cur) < 0) d.tried.push(cur);
    d.last = { test: cur, hit: hit, miss: miss, extra: extra };
    api.save();
    if(!api.resolved()) api.done("done");
  };
}

(window.A2PACKS = window.A2PACKS || {})["divisibility"] = {
  a2: true,
  id: "a2-divisibility",
  title: "Divisibility detective",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 20,
  line: "Can a number be shared out with none left over? The clues are hiding in the digits.",
  blurb: "Quick clues that tell you if a number splits evenly by 2, 5 or 10, without doing the division. Four short chunks, and a case card to make at the end.",
  note: "Spotting whether a number splits evenly by 2, 5 or 10 just from its digits. Four five minute chunks, with a case card at the end. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Rookie", line: "Rookie: two digit numbers, clues for 2, 5 and 10." },
    { id: "medium", name: "Sergeant", line: "Sergeant: big numbers, and numbers that pass more than one clue." },
    { id: "spicy", name: "Inspector", line: "Inspector: the 2, 5 and 10 clues, plus two sneaky ones for 3 and 4." }
  ],
  themes: {
    time: { name: "Time travel", w: { items: "time crystals", groups: "capsules", who: "the time traveller", thing: "portal ticket" } },
    football: { name: "Football", w: { items: "players", groups: "teams", who: "the coach", thing: "squad number" } },
    horror: { name: "Horror", w: { items: "ghosts", groups: "haunted rooms", who: "the night porter", thing: "room number" } },
    fishing: { name: "Fishing", w: { items: "maggots", groups: "hooks", who: "the angler", thing: "peg number" } },
    music: { name: "Music", w: { items: "dancers", groups: "lines", who: "the choreographer", thing: "seat number" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: DESK,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Clue one: the 2s", title: "Splits by 2? Look at the last digit",
      fig: pairs(7),
      html: "<p><b>Divisible by 2</b> means it splits into pairs with none left over. Numbers like that are <b>even</b>.</p>" +
        "<p>7 dots make 3 pairs and one left over, so 7 is odd. 8 would pair up exactly.</p>" +
        "<p>The clue: you only need the <b>last digit</b>. If it is <b>0, 2, 4, 6 or 8</b>, the whole number is even, however big it is.</p>",
      lv: { spicy: { html: "<p><b>Divisible by 2</b> means it splits into pairs with none left over. Those are the <b>even</b> numbers.</p>" +
        "<p>Why does the last digit decide it? Every ten splits into pairs already (10 = 5 pairs), so the tens, hundreds and thousands never leave anything over. Only the ones can.</p>" +
        "<p>So 3 458 is even because 8 is even. Nothing else matters.</p>" } } },

    { type: "mc", topic: "Clue one: the 2s",
      q: "Which number splits by 2 with none left over?",
      fig: lens(34, "Look at the last digit"),
      options: ["34", "35", "37", "41"],
      answer: 0,
      slips: { 1: "35 ends in 5. 5 is odd, so there would be one left over.", 2: "37 ends in 7, which is odd.", 3: "41 ends in 1, which is odd. The 4 at the front does not count." },
      hint: "Which one ends in 0, 2, 4, 6 or 8?",
      why: "34 ends in 4, which is even. So 34 splits into 17 pairs.",
      lv: {
        medium: { fig: lens(5318, "Look at the last digit"), options: ["5318", "4627", "8883", "2045"],
          slips: { 1: "4627 ends in 7, which is odd.", 2: "Lots of 8s, but it ends in 3. Only the last digit counts.", 3: "2045 starts with 2, but ends in 5. Only the last digit counts." },
          why: "5318 ends in 8, which is even." },
        spicy: { fig: lens(70096, "Look at the last digit"), options: ["70096", "86421", "44443", "20009"],
          slips: { 1: "Lots of even digits, but it ends in 1.", 2: "Four 4s, but it ends in 3.", 3: "Starts with 2, ends in 9. Only the last digit counts." },
          why: "70096 ends in 6, which is even." } } },

    { type: "sort", topic: "Clue one: the 2s",
      q: "Sort them: even or odd?",
      buckets: ["Even (splits by 2)", "Odd (one left over)"],
      cards: [["16", 0], ["23", 1], ["40", 0], ["58", 0], ["71", 1], ["19", 1]],
      hint: "Even numbers end in 0, 2, 4, 6 or 8.",
      why: "16, 40 and 58 end in 6, 0 and 8. 23, 71 and 19 end in odd digits.",
      lv: {
        medium: { cards: [["316", 0], ["823", 1], ["1040", 0], ["2 589", 1], ["7 772", 0], ["6 001", 1]], why: "Only the last digit decides: 6, 0 and 2 are even; 3, 9 and 1 are odd." },
        spicy: { cards: [["40 316", 0], ["2 223 823", 1], ["88 881", 1], ["12 350", 0], ["999 994", 0], ["60 005", 1]], why: "Only the last digit decides: 6, 0 and 4 are even; 3, 1 and 5 are odd." } } },

    { type: "num", topic: "Clue one: the 2s",
      q: "What is the next even number after 47?",
      boxes: [{ label: "Next even number", a: 48 }],
      slips: [[49, "49 ends in 9, which is odd. Even numbers end in 0, 2, 4, 6 or 8."], [46, "46 is even, but it comes before 47. You want the one after."], [50, "50 is even, but there is one closer."]],
      hint: "Count on one at a time from 47 until the last digit is even.",
      why: "48 ends in 8, so it is even. It is the very next number.",
      lv: {
        medium: { q: "What is the biggest even number below 1000?", boxes: [{ label: "Biggest even number", a: 998 }],
          slips: [[999, "999 ends in 9, which is odd."], [1000, "1000 is even, but it is not below 1000."], [996, "996 is even, but there is a bigger one."]],
          hint: "Count down from 999.", why: "999 is odd, so the next one down, <b>998</b>, is the biggest even number below 1000." },
        spicy: { q: "Using each of the digits 3, 8 and 5 once, make the biggest even number you can.", boxes: [{ label: "Biggest even number", a: 538 }],
          slips: [[853, "853 is the biggest number, but it ends in 3, so it is odd."], [583, "583 ends in 3, so it is odd."], [358, "358 is even, but you can make a bigger one with 8 still at the end."]],
          hint: "The 8 has to go last. Then put the bigger of the others first.",
          why: "The even digit 8 must be last. Then 5 before 3 gives <b>538</b>." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Clues for 5 and 10", title: "Fives end in 0 or 5. Tens end in 0.",
      fig: strip(5, 1, 30, "Count in fives: 5, 10, 15, 20, 25, 30"),
      html: "<p>Count in fives and look at the last digits: 5, 10, 15, 20, 25, 30. They only ever end in <b>5 or 0</b>.</p>" +
        "<p>Count in tens: 10, 20, 30. They always end in <b>0</b>.</p>" + CLUES +
        "<p>So a number ending in 0 passes both clues. A number ending in 5 passes the 5 clue but not the 10 clue.</p>",
      lv: { medium: { html: "<p>Count in fives and look at the last digits: 5, 10, 15, 20, 25, 30. They only ever end in <b>5 or 0</b>.</p>" +
          "<p>Count in tens: they always end in <b>0</b>.</p>" + CLUES +
          "<p>Here is a neat one: a number that splits by <b>both 2 and 5</b> always splits by 10, because 2 &times; 5 = 10. It must end in 0.</p>" },
        spicy: { html: "<p>Fives end in <b>5 or 0</b>. Tens end in <b>0</b>.</p>" + CLUES +
          "<p>Why? Every ten is two fives, so tens never leave a remainder when you split by 5. Only the ones digit can, and only 0 and 5 are fives.</p>" +
          "<p>And because 2 &times; 5 = 10, a number that passes the 2 clue and the 5 clue must end in 0.</p>" } } },

    { type: "multi", topic: "Clues for 5 and 10",
      q: "Pick <b>all</b> the numbers that split by 5.",
      options: ["35", "50", "53", "85", "58"],
      answers: [0, 1, 3],
      hint: "Look for a last digit of 0 or 5. The first digit does not matter.",
      why: "35, 50 and 85 end in 5 or 0. 53 and 58 have a 5 at the front, but the clue is at the end.",
      lv: {
        medium: { options: ["2 345", "7 000", "5 553", "9 995", "5 008"], answers: [0, 1, 3], why: "2 345, 7 000 and 9 995 end in 5 or 0. The others have fives at the front, but end in 3 and 8." },
        spicy: { q: "Pick <b>all</b> the numbers that split by both 2 and 5.", options: ["4 350", "5 555", "1 002", "80 000", "2 505"], answers: [0, 3],
          hint: "Passing both means it must end in 0.", why: "Only 4 350 and 80 000 end in 0. 5 555 and 2 505 only pass the 5 clue; 1 002 only passes the 2 clue." } } },

    { type: "sort", topic: "Clues for 5 and 10",
      q: "Sort them into the right drawer.",
      buckets: ["Splits by 10 (and 5)", "Splits by 5 but not 10", "Neither"],
      cards: [["40", 0], ["90", 0], ["25", 1], ["65", 1], ["32", 2], ["57", 2]],
      hint: "Ends in 0: first drawer. Ends in 5: middle drawer. Anything else: neither.",
      why: "40 and 90 end in 0. 25 and 65 end in 5. 32 and 57 end in neither.",
      lv: {
        medium: { cards: [["4 070", 0], ["1 900", 0], ["3 335", 1], ["8 005", 1], ["5 052", 2], ["5 501", 2]], why: "Ends in 0: by 10. Ends in 5: by 5 only. 5 052 and 5 501 end in 2 and 1, whatever the other digits say." },
        spicy: { cards: [["38 010", 0], ["700 500", 0], ["50 055", 1], ["1 235", 1], ["5 050 501", 2], ["55 552", 2]], why: "Only the last digit decides. The fives and zeros elsewhere are red herrings." } } },

    { type: "mc", topic: "Clues for 5 and 10", explain: true,
      q: "Jay says: \"75 splits by 10 because it has a 5 in it.\" What is the slip?",
      fig: '<svg viewBox="0 0 420 140" role="img" aria-label="Jay thinking">' + A2ART.jay(90, 44, 0.85, "hmm") + A2ART.bubble(170, 20, 200, 52, "75 splits by 10?\nIt has a 5 in it!", 182) + '</svg>',
      options: ["Splitting by 10 needs a last digit of 0.", "Nothing, 75 splits by 10.", "75 does not split by 5 either."],
      answer: 0, fixed: true,
      slips: { 1: "Count in tens: 70, 80. 75 is in between, so there would be 5 left over.", 2: "75 does split by 5: it ends in 5. It just does not split by 10." },
      hint: "Count in tens. Do you land on 75?",
      why: "Tens always end in 0. 75 splits by 5 (15 fives) but not by 10.",
      lv: { spicy: { q: "Jay says: \"7 510 splits by 5 but not by 10.\" What is the slip?",
        fig: '<svg viewBox="0 0 420 140" role="img" aria-label="Jay thinking">' + A2ART.jay(90, 44, 0.85, "hmm") + A2ART.bubble(170, 20, 220, 52, "7 510 splits by 5,\nbut not by 10?", 182) + '</svg>',
        options: ["It ends in 0, so it splits by 10 as well.", "Nothing, that is right.", "It does not split by 5 either."],
        slips: { 1: "Look at the last digit. A 0 passes the 10 clue.", 2: "Anything ending in 0 splits by 5 too." },
        hint: "Which digit is last?",
        why: "The last digit is 0, so it splits by 10 (and by 5 and 2 too). The 5 in the middle is a red herring." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Case files", title: "Using the clues together",
      fig: lens(130, "Ends in 0: passes 2, 5 and 10"),
      html: "<p>One number can pass more than one clue. 130 ends in 0, so it splits by 2, by 5 and by 10.</p>" +
        "<p>135 ends in 5: it passes the 5 clue only. 134 ends in 4: it passes the 2 clue only.</p>",
      lv: { spicy: { fig: CLUES34,
        html: "<p>Two more clues for Inspectors.</p>" +
          "<p><b>Splits by 3:</b> add up the digits. If the total is in the 3 times table, so is the number. 471: 4 + 7 + 1 = 12, and 12 is in the 3s, so 471 splits by 3.</p>" +
          "<p><b>Splits by 4:</b> look at the last <b>two</b> digits only. If they make a number in the 4 times table, the whole number is too. 1 736 ends in 36, and 36 = 4 &times; 9, so 1 736 splits by 4.</p>" } } },

    { type: "widget", topic: "Case files", unscored: true,
      title: "The detective's hundred square",
      html: "<p>Choose a clue, then tap every number you think it catches. Reveal shows how you did. Try as many clues as you like.</p>",
      mount: mountSquare },

    { type: "mc", topic: "Case files",
      q: "Which clue does 60 pass?",
      options: ["2, 5 and 10", "2 only", "5 only", "10 only"],
      answer: 0, fixed: true,
      slips: { 1: "60 ends in 0. Zero is even, but it also passes the 5 and 10 clues.", 2: "It ends in 0, which counts for 5 but also for 2 and 10.", 3: "It does split by 10, and by 2 and 5 as well." },
      hint: "What do numbers ending in 0 pass?",
      why: "60 ends in 0, and 0 is in all three clues.",
      lv: {
        medium: { q: "Which clues does 2 465 pass?", options: ["5 only", "2 and 5", "5 and 10", "2, 5 and 10"],
          slips: { 1: "It ends in 5, which is odd, so it fails the 2 clue.", 2: "To split by 10 it would need to end in 0.", 3: "It ends in 5, so only the 5 clue works." },
          hint: "Look at the last digit only.", why: "2 465 ends in 5: it passes the 5 clue only." },
        spicy: { q: "Which clues does 516 pass?", options: ["2, 3 and 4", "2 only", "2 and 4", "2 and 3"],
          slips: { 1: "It is even, but try the others too: 5 + 1 + 6 = 12, and 16 is in the 4s.", 2: "Check the 3 clue: 5 + 1 + 6 = 12.", 3: "Check the 4 clue: the last two digits are 16, and 16 = 4 &times; 4." },
          hint: "Even? Digit total? Last two digits?",
          why: "516 is even (2). 5 + 1 + 6 = 12, in the 3s (3). 16 is in the 4s (4)." } } },

    { type: "num", topic: "Case files",
      q: "Find the one number between 41 and 49 that splits by 5.",
      boxes: [{ label: "The number", a: 45 }],
      slips: [[40, "40 splits by 5, but it is not between 41 and 49."], [50, "50 splits by 5, but it is not between 41 and 49."]],
      hint: "It must end in 0 or 5.",
      why: "Between 41 and 49, the only number ending in 0 or 5 is <b>45</b>.",
      lv: {
        medium: { q: "How many numbers from 301 to 349 split by 10?", boxes: [{ label: "How many", a: 4 }],
          slips: [[5, "Check the ends: 300 and 350 are outside the range."], [3, "Count them: 310, 320, 330, 340."], [9, "That counts the numbers ending in 0 or 5: those split by 5."]],
          hint: "They end in 0: 310, ...", why: "310, 320, 330 and 340: <b>4</b> numbers." },
        spicy: { q: "Which number between 130 and 140 splits by both 3 and 4?", boxes: [{ label: "The number", a: 132 }],
          slips: [[135, "135 splits by 3 (1+3+5 = 9) but it is odd, so not by 4."], [136, "136 splits by 4 but 1+3+6 = 10, which is not in the 3s."], [138, "138 splits by 3, but 38 is not in the 4s."]],
          hint: "Test the 4s first: 132, 136. Then add up the digits.",
          why: "132: 1 + 3 + 2 = 6 (in the 3s) and 32 = 4 &times; 8. So <b>132</b> passes both." } } },

    { type: "match", topic: "Case files",
      q: "Match each number to the best description.",
      pairs: [["70", "Splits by 2, 5 and 10"], ["55", "Splits by 5 only"], ["38", "Splits by 2 only"], ["91", "None of these clues"]],
      hint: "Check the last digit of each.",
      why: "70 ends in 0. 55 ends in 5. 38 ends in 8. 91 ends in 1.",
      lv: {
        medium: { pairs: [["6 080", "Splits by 2, 5 and 10"], ["3 005", "Splits by 5 only"], ["5 554", "Splits by 2 only"], ["5 057", "None of these clues"]],
          why: "Only the last digit counts: 0, 5, 4 and 7." },
        spicy: { pairs: [["120", "Splits by 2, 3, 4, 5 and 10"], ["225", "Splits by 3 and 5"], ["124", "Splits by 2 and 4"], ["77", "None of these clues"]],
          why: "120: ends in 0, digit total 3, ends 20. 225: ends in 5, digit total 9. 124: even, ends 24, digit total 7. 77: odd, digit total 14." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Fair shares", title: "Detectives at work: fair shares",
      fig: strip(5, 21, 40, "Can 34 be shared into fives? 34 is not yellow."),
      html: "<p>The clues answer real questions. Can [[who]] share 34 [[items]] into [[groups]] of 5 with none left over?</p>" +
        "<p>34 ends in 4, not 0 or 5. So no: there would be some left over. You did not even need to divide.</p>" },

    { type: "mc", topic: "Fair shares",
      q: "[[Who]] has 45 [[items]]. Can they go into [[groups]] of 10 with none left over?",
      options: ["No, 45 does not end in 0.", "Yes, 45 has a 5 in it.", "Yes, any number can."],
      answer: 0, fixed: true,
      slips: { 1: "A 5 at the end passes the 5 clue, not the 10 clue.", 2: "Only numbers ending in 0 split into tens exactly." },
      hint: "What do numbers that split by 10 end in?",
      why: "45 ends in 5, so 4 [[groups]] of 10 use 40 and 5 are left over.",
      lv: {
        medium: { q: "[[Who]] has 1 236 [[items]]. Which [[groups]] would leave none over?", options: ["[[Groups]] of 2", "[[Groups]] of 5", "[[Groups]] of 10"],
          slips: { 1: "1 236 ends in 6, not 0 or 5.", 2: "1 236 does not end in 0." }, hint: "Look at the last digit: 6.", why: "1 236 ends in 6, so it splits into pairs exactly, but not into fives or tens." },
        spicy: { q: "[[Who]] has 252 [[items]]. Which [[groups]] would leave none over?", options: ["[[Groups]] of 2, 3 and 4", "[[Groups]] of 2 only", "[[Groups]] of 2 and 5", "[[Groups]] of 3 only"],
          slips: { 1: "Try the others: 2 + 5 + 2 = 9 and 52 = 4 &times; 13.", 2: "252 ends in 2, so not 5.", 3: "It is even too, so 2 works." },
          hint: "Even? Digit total? Last two digits?", why: "252 is even, 2 + 5 + 2 = 9 is in the 3s, and 52 = 4 &times; 13. All three work." } } },

    { type: "num", topic: "Fair shares",
      q: "[[Who]] has 23 [[items]] and wants [[groups]] of 5 with none left over. What is the fewest extra [[items]] needed?",
      boxes: [{ label: "Extra [[items]]", a: 2 }],
      slips: [[7, "That gets to 30. There is a closer five."], [3, "23 + 3 = 26, which ends in 6. You want a 0 or a 5."], [5, "That gets to 28. You want a number ending in 0 or 5."]],
      hint: "What is the next number after 23 that ends in 0 or 5?",
      why: "The next five is 25. 23 + <b>2</b> = 25.",
      lv: {
        medium: { q: "[[Who]] has 1 347 [[items]] and wants [[groups]] of 10 with none left over. What is the fewest extra [[items]] needed?", boxes: [{ label: "Extra [[items]]", a: 3 }],
          slips: [[53, "That gets to 1 400. There is a closer ten."], [7, "That takes away. You are adding to reach 1 350."], [8, "1 347 + 8 = 1 355, which ends in 5, not 0."]],
          hint: "What is the next number ending in 0?", why: "The next ten is 1 350. 1 347 + <b>3</b> = 1 350." },
        spicy: { q: "[[Who]] has 214 [[items]] and wants [[groups]] of 3 with none left over. What is the fewest extra [[items]] needed?", boxes: [{ label: "Extra [[items]]", a: 2 }],
          slips: [[1, "214 + 1 = 215: 2 + 1 + 5 = 8, not in the 3s."], [4, "That works, but there is a smaller number."], [6, "That gets to 220, but 2 + 2 + 0 = 4 is not in the 3s."]],
          hint: "Add one at a time and check the digit total each time.", why: "214 + 2 = 216, and 2 + 1 + 6 = 9. So <b>2</b> more." } } },

    { type: "text", topic: "Fair shares", stretch: true,
      q: "Your own case. Write a number that splits by 5 but <b>not</b> by 10, and say how you know.",
      need: [["5"], ["end", "ends", "last", "finish", "finishes"]],
      model: "85, because it ends in 5 and not 0.",
      slips: [[["0 at the end", "ends in 0", "ends with 0"], "A number ending in 0 splits by 10 as well. Try one ending in 5."]],
      hint: "It needs to end in 5.",
      why: "Any number ending in 5 works: 15, 85, 1 005. They split by 5, but the last digit is not 0, so not by 10.",
      lv: { spicy: { q: "Your own case. Write a number that splits by 3 and by 5 but <b>not</b> by 2, and say how you know.",
        need: [["5"], ["add", "total", "digits", "sum", "3"]],
        model: "45, because it ends in 5 and the digits add to 9, which is in the 3s.",
        slips: [[["ends in 0"], "Ending in 0 makes it even, so it would split by 2. Try ending in 5."]],
        hint: "It must end in 5, and its digits must add to a number in the 3s.",
        why: "Numbers like 15, 45, 75 or 105 work: they end in 5 (so odd, but split by 5) and their digits add to a number in the 3 times table." } } }
  ],

  realWorld: {
    title: "Where detectives use this",
    html: "<p>Sharing tickets between a group, packing things in boxes of 10, checking if a bill splits evenly, or whether a team can pair up for a drill: the last digit tells you before you start.</p>" +
      "<p>For our big question: a time traveller arriving in 1826 with 35 coins would want to know quickly if they could share them fairly with 5 people. No calculator, just the clue: it ends in 5, so yes.</p>",
    fig: '<svg viewBox="0 0 420 140" role="img" aria-label="Bonnie beside the time portal">' + A2ART.portal(90, 70, 56) + A2ART.bonnie(250, 80, 1, "sit") +
      A2ART.bubble(290, 8, 120, 52, "35 ends in 5.\nCase closed.", 296) + '</svg>'
  },

  make: {
    title: "Make a case card",
    intro: "Pick a number, and record which clues it passes. Stick it on the wall or send it to Jay.",
    fields: [
      { id: "num", label: "The suspect number", ph: "2 470", max: 12 },
      { id: "passes", label: "Clues it passes", ph: "2, 5 and 10", max: 30 },
      { id: "how", label: "How you know", ph: "It ends in 0, so it passes all three clues.", max: 80 },
      { id: "name", label: "Detective", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      function e(t){ return String(t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
      function wrap(t, n){ var w = String(t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n){ if(cur.trim()) out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, 3); }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380">' +
        '<rect width="600" height="380" rx="20" fill="#e9dcc3"/>' +
        '<path d="M30 60h180l20 -26h340v320H30z" fill="#f6ecd6" stroke="#7a5532" stroke-width="3"/>' +
        '<text x="48" y="96" font-family="Verdana,Arial,sans-serif" font-size="20" font-weight="700" fill="#7a5532" letter-spacing="3">CASE FILE</text>' +
        '<text x="48" y="156" font-family="Verdana,Arial,sans-serif" font-size="' + (String(v.num).length > 9 ? 34 : 46) + '" font-weight="700" fill="#141a33">' + e(v.num) + '</text>' +
        '<text x="48" y="200" font-family="Verdana,Arial,sans-serif" font-size="' + (String(v.passes).length > 22 ? 16 : 20) + '" fill="#141a33">Splits by: <tspan font-weight="700">' + e(v.passes) + '</tspan></text>' +
        wrap(v.how, 44).map(function(l, k){ return '<text x="48" y="' + (240 + k * 26) + '" font-family="Verdana,Arial,sans-serif" font-size="18" fill="#141a33">' + e(l) + '</text>'; }).join("") +
        '<text x="48" y="334" font-family="Verdana,Arial,sans-serif" font-size="16" fill="#5b4a33">Detective: ' + e(v.name) + '</text>' +
        '<g transform="translate(470 318) rotate(-10)"><rect x="-70" y="-24" width="140" height="48" rx="6" fill="none" stroke="#1f9d63" stroke-width="5"/><text y="9" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="22" font-weight="700" fill="#1f9d63">SOLVED</text></g>' +
        '</svg>';
    }
  }
};
})();
