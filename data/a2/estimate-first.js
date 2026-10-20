/* Base 5 Autumn 2 activity: Estimate first.
   Maths. Round to one significant figure, estimate before you calculate,
   and use the estimate to check an answer makes sense. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, extra){ extra = extra || ""; return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (/fill=/.test(extra) ? "" : ' fill="#141a33"') + extra + '>' + s + '</text>'; }
var X = "&#215;", D = "&#247;", ABOUT = "&#8776;";

/* a number line: where does the number sit, and which end is nearer? */
function NL(lo, hi, val, show){
  var x0 = 50, x1 = 470, mid = (lo + hi) / 2;
  function px(v){ return x0 + (v - lo) / (hi - lo) * (x1 - x0); }
  var vx = px(val), near = val >= mid ? hi : lo, nx = px(near);
  return '<svg viewBox="0 0 520 170" role="img" aria-label="A number line from ' + lo + ' to ' + hi + '. ' + show + ' is nearer to ' + near + '.">' +
    '<rect width="520" height="170" rx="16" fill="#eef6ff"/>' +
    '<path d="M' + x0 + ' 100H' + x1 + '" stroke="#141a33" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M' + x0 + ' 88v24M' + x1 + ' 88v24" stroke="#141a33" stroke-width="4"/>' +
    '<path d="M' + px(mid) + ' 84v32" stroke="#8a93b8" stroke-width="3" stroke-dasharray="5 4"/>' +
    T(x0, 138, String(lo), 16, ' text-anchor="middle" font-weight="700"') + T(x1, 138, String(hi), 16, ' text-anchor="middle" font-weight="700"') +
    T(px(mid), 138, "halfway", 13, ' text-anchor="middle" fill="#5b6180"') +
    '<circle cx="' + vx + '" cy="100" r="9" fill="#ff5d8f" stroke="#141a33" stroke-width="2.5"/>' +
    T(vx, 70, show, 17, ' text-anchor="middle" font-weight="700" fill="#c2185b"') +
    '<path d="M' + vx + ' 34Q' + ((vx + nx) / 2) + ' 6 ' + nx + ' 80" stroke="#19c39a" stroke-width="3.5" fill="none" stroke-dasharray="7 5"/>' +
    '<path d="M' + (nx - 7) + ' 70L' + nx + ' 82L' + (nx + 7) + ' 70" stroke="#19c39a" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
    T(nx, 162, "nearer", 13, ' text-anchor="middle" font-weight="700" fill="#0f7d5e"') +
    '</svg>';
}

/* round each number, then do the easy sum */
function EST(a, op, b, ra, rb, res){
  function tile(x, y, t, fill){ return '<rect x="' + (x - 56) + '" y="' + y + '" width="112" height="44" rx="10" fill="' + fill + '" stroke="#141a33" stroke-width="2.5"/>' + T(x, y + 30, t, 20, ' text-anchor="middle" font-weight="700"'); }
  function arr(x){ return '<path d="M' + x + ' 72v34M' + (x - 7) + ' 98l7 10 7 -10" stroke="#8a5cf6" stroke-width="3" fill="none" stroke-linecap="round"/>'; }
  return '<svg viewBox="0 0 520 190" role="img" aria-label="Estimate: round ' + a + ' to ' + ra + ' and ' + b + ' to ' + rb + ', then work it out: about ' + res + '">' +
    '<rect width="520" height="190" rx="16" fill="#f3efff"/>' +
    tile(100, 22, a, "#ffffff") + T(190, 52, op, 24, ' text-anchor="middle" font-weight="700"') + tile(280, 22, b, "#ffffff") +
    arr(100) + arr(280) + T(116, 94, "round", 13, ' fill="#5b3cc4"') + T(296, 94, "round", 13, ' fill="#5b3cc4"') +
    tile(100, 112, ra, "#ffd23f") + T(190, 142, op, 24, ' text-anchor="middle" font-weight="700"') + tile(280, 112, rb, "#ffd23f") +
    '<circle cx="436" cy="134" r="46" fill="#19c39a" fill-opacity=".25" stroke="#19c39a" stroke-width="3"/>' +
    T(436, 128, ABOUT, 22, ' text-anchor="middle" font-weight="700" fill="#0f7d5e"') + T(436, 154, res, 20, ' text-anchor="middle" font-weight="700"') +
    T(400, 50, "easy sum", 14, ' fill="#0f7d5e" font-weight="700"') +
    '</svg>';
}

/* the calculator that got it badly off */
function CALC(screen, est){
  return '<svg viewBox="0 0 520 210" role="img" aria-label="A calculator shows ' + screen + '. The estimate is about ' + est + '. Jay says Outrageous.">' +
    '<rect width="520" height="210" rx="16" fill="#fff4ea"/>' +
    '<rect x="30" y="20" width="150" height="172" rx="14" fill="#3b4256" stroke="#141a33" stroke-width="2.5"/>' +
    '<rect x="44" y="34" width="122" height="38" rx="5" fill="#cfe8c8"/>' + T(158, 62, screen, 20, ' text-anchor="end" font-weight="700"') +
    [0, 1, 2].map(function(r){ return [0, 1, 2].map(function(c){ return '<rect x="' + (48 + c * 40) + '" y="' + (86 + r * 34) + '" width="32" height="26" rx="5" fill="#ffffff" fill-opacity=".85"/>'; }).join(""); }).join("") +
    '<rect x="200" y="36" width="150" height="70" rx="12" fill="#ffffff" stroke="#19c39a" stroke-width="3"/>' +
    T(214, 62, "Estimate:", 14, ' fill="#0f7d5e" font-weight="700"') + T(214, 90, "about " + est, 18, ' font-weight="700"') +
    T(200, 140, "Far apart?", 15, ' font-weight="700" fill="#c2185b"') + T(200, 162, "Check again.", 15, ' font-weight="700" fill="#c2185b"') +
    A.jay(440, 120, 0.85, "wow") + A.bubble(368, 14, 136, 36, "Outrageous.", 420) +
    A.egg(A.bonnie(330, 176, 0.4, "sit"), "Bonnie estimates she is owed about 1000 treats. Jay's calculator says otherwise.") +
    '</svg>';
}

/* a receipt, rounded line by line */
var RECEIPT =
  '<svg viewBox="0 0 520 200" role="img" aria-label="A receipt: 2.89 rounds to 3, 4.15 rounds to 4, 0.95 rounds to 1. About 8 pounds altogether.">' +
  '<rect width="520" height="200" rx="16" fill="#eef8f3"/>' +
  '<path d="M60 14h200v160l-12 10 -12 -10 -12 10 -12 -10 -12 10 -12 -10 -12 10 -12 -10 -12 10 -12 -10 -12 10 -12 -10 -12 10 -12 -10 -12 10 -12 -10 -8 6z" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
  T(80, 46, "2.89", 18) + T(80, 82, "4.15", 18) + T(80, 118, "0.95", 18) +
  '<path d="M80 134h160" stroke="#141a33" stroke-width="2" stroke-dasharray="4 4"/>' + T(80, 160, "Total?", 17, ' font-weight="700"') +
  [46, 82, 118].map(function(y, k){ return '<path d="M150 ' + (y - 6) + 'h50M192 ' + (y - 12) + 'l8 6 -8 6" stroke="#8a5cf6" stroke-width="3" fill="none" stroke-linecap="round"/>' + T(214, y, ["3", "4", "1"][k], 18, ' font-weight="700" fill="#5b3cc4"'); }).join("") +
  T(300, 70, "3 + 4 + 1 = 8", 20, ' font-weight="700"') + T(300, 104, ABOUT + " 8 pounds", 20, ' font-weight="700" fill="#0f7d5e"') +
  T(300, 140, "Enough in your", 14, ' fill="#5b6180"') + T(300, 160, "pocket? Now you know.", 14, ' fill="#5b6180"') +
  A.egg(A.bird(258, 22, 0.6, "#ffd23f"), "A bird estimated the bill too. It came to about two worms.") +
  '</svg>';

function esc(t){ return String(t == null ? "" : t).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function wrap(t, n, max){ var w = String(t == null ? "" : t).split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if(!x) return; while(x.length > n){ if(cur){ out.push(cur); cur = ""; } out.push(x.slice(0, n)); x = x.slice(n); } if((cur + " " + x).trim().length > n){ out.push(cur.trim()); cur = x; } else cur = (cur + " " + x).trim(); }); if(cur) out.push(cur); return out.slice(0, max || 2); }

(window.A2PACKS = window.A2PACKS || {})["estimate-first"] = {
  a2: true,
  id: "a2-estimate-first",
  title: "Estimate first",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 25,
  line: "Round it, guess it, then check it. An estimate tells you when an answer has gone badly wrong.",
  blurb: "Rounding to make an estimate before you calculate, then using it to check an answer makes sense. Four short chunks and an estimate check card to make at the end.",
  note: "Estimating before you calculate, so you can tell when an answer looks off. Four five minute chunks and a little card to make at the end. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Squint", line: "Squint: round to the nearest 10 and estimate adding." },
    { id: "medium", name: "Eyeball", line: "Eyeball: one significant figure, estimating times and divide." },
    { id: "spicy", name: "Hawk eye", line: "Hawk eye: decimals, tricky rounding and over or under estimates." }
  ],
  themes: {
    time: { name: "Time travel", w: { item: "a time tour ticket", items: "time tour tickets", crowd: "time travellers", venue: "the time station" } },
    football: { name: "Football", w: { item: "a match ticket", items: "match tickets", crowd: "fans", venue: "the stadium" } },
    horror: { name: "Horror", w: { item: "a ghost tour ticket", items: "ghost tour tickets", crowd: "visitors", venue: "the haunted house" } },
    fishing: { name: "Fishing", w: { item: "a tub of bait", items: "tubs of bait", crowd: "anglers", venue: "the lake" } },
    music: { name: "Music", w: { item: "a theatre ticket", items: "theatre tickets", crowd: "people", venue: "the theatre" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: EST("4.85", X, "21", "5", "20", "100"),
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Round it rough", title: "Round to one significant figure",
      fig: NL(6000, 7000, 6482, "6482"),
      html: "<p>To estimate, you round each number so it has just <b>one</b> digit that is not zero. That is called rounding to <b>one significant figure</b>.</p>" +
        "<p class=\"a2task\"><b>Worked example: round 6482.</b><br>1. The first digit is <b>6</b>, in the thousands.<br>2. Look at the next digit: <b>4</b>.<br>3. 4 is less than 5, so the 6 stays. Everything after it becomes zero.<br>6482 rounds to <b>6000</b>.</p>" +
        "<p>If the next digit is 5 or more, the first digit goes up one instead.</p>",
      lv: {
        mild: { fig: NL(40, 50, 47, "47"),
          html: "<p>To estimate, we round numbers to make them easier. Here we round to the <b>nearest 10</b>.</p>" +
            "<p class=\"a2task\"><b>Worked example: round 47.</b><br>1. 47 is between 40 and 50.<br>2. Look at the ones digit: <b>7</b>.<br>3. 7 is 5 or more, so round up.<br>47 rounds to <b>50</b>.</p>" +
            "<p>If the ones digit is 4 or less, round down instead.</p>" },
        spicy: { fig: NL(0.07, 0.08, 0.0738, "0.0738"),
          html: "<p>To estimate, round each number to <b>one significant figure</b>: keep the first digit that is not zero, and turn the rest into zeros.</p>" +
            "<p class=\"a2task\"><b>Worked example: round 0.0738.</b><br>1. Skip the zeros at the front. The first digit that is not zero is <b>7</b>, in the hundredths.<br>2. Look at the next digit: <b>3</b>.<br>3. 3 is less than 5, so the 7 stays.<br>0.0738 rounds to <b>0.07</b>.</p>" +
            "<p>Watch out for 9s: 0.0952 rounds the 9 up to 10 hundredths, which is <b>0.1</b>.</p>" } } },

    { type: "num", topic: "Round it rough",
      q: "Round 362 to 1 significant figure. Most of the working is done for you.<p class=\"a2task\">The first digit is 3, in the hundreds.<br>The next digit is 6. That is 5 or more, so round up.<br>362 rounds to ___</p>",
      fig: NL(300, 400, 362, "362"),
      boxes: [{ label: "362 rounds to", a: 400 }],
      slips: [[300, "The next digit is 6, which is 5 or more, so the hundreds go up."], [360, "That is to the nearest 10. One significant figure keeps only the first digit, then zeros."], [4, "Keep the size: 362 is in the hundreds, so the answer needs zeros. 4 hundreds is 400."]],
      hint: "3 hundreds goes up to 4 hundreds.",
      why: "362 is nearer 400 than 300, so it rounds to <b>400</b>.",
      lv: {
        mild: { q: "Round 47 to the nearest 10. Most of the working is done for you.<p class=\"a2task\">47 is between 40 and 50.<br>The ones digit is 7. That is 5 or more, so round up.<br>47 rounds to ___</p>",
          fig: NL(40, 50, 47, "47"), boxes: [{ label: "47 rounds to", a: 50 }],
          slips: [[40, "7 is 5 or more, so it goes up to the next ten, not down."], [47, "That is the number itself. Rounding moves it to the nearest ten."]],
          hint: "Round up means go to the bigger ten.", why: "47 is nearer 50 than 40, so it rounds to <b>50</b>." },
        spicy: { q: "Round 0.0738 to 1 significant figure. Most of the working is done for you.<p class=\"a2task\">The first digit that is not zero is 7, in the hundredths.<br>The next digit is 3. That is less than 5, so keep the 7.<br>0.0738 rounds to ___</p>",
          fig: NL(0.07, 0.08, 0.0738, "0.0738"), boxes: [{ label: "0.0738 rounds to", a: 0.07 }],
          slips: [[0.08, "The next digit is 3, which is less than 5, so the 7 stays."], [0.1, "That is to 1 decimal place. Significant figures start from the first digit that is not zero."], [0.074, "That is 2 significant figures. Stop at the 7."], [7, "Keep the size: it is still less than 1, so 0.07."]],
          hint: "Keep the 7 where it is, in the hundredths.", why: "0.0738 is nearer 0.07 than 0.08, so it rounds to <b>0.07</b>." } } },

    { type: "num", topic: "Round it rough",
      q: "Round 6482 to 1 significant figure. This time, you fill in the steps.",
      boxes: [{ label: "The digit that decides (the one after the first)", a: 4 }, { label: "6482 rounds to", a: 6000 }],
      slips: [[1, 7000, "The deciding digit is 4, less than 5, so the 6 stays."], [1, 6500, "That keeps two digits. One significant figure keeps only the 6."], [1, 6, "Keep the size: 6 thousands is 6000."]],
      hint: "First digit 6. Which digit comes straight after it?",
      why: "The deciding digit is <b>4</b>, so the 6 stays: <b>6000</b>.",
      lv: {
        mild: { q: "Round 83 to the nearest 10. This time, you fill in the steps.",
          boxes: [{ label: "The ones digit", a: 3 }, { label: "83 rounds to", a: 80 }],
          slips: [[1, 90, "3 is 4 or less, so it rounds down to 80."], [0, 8, "8 is the tens digit. The ones digit is the last one."]],
          hint: "The ones digit is the last one.", why: "The ones digit is <b>3</b>, so round down: <b>80</b>." },
        spicy: { q: "Round 0.4862 to 1 significant figure. This time, you fill in the steps.",
          boxes: [{ label: "The digit that decides", a: 8 }, { label: "0.4862 rounds to", a: 0.5 }],
          slips: [[1, 0.4, "The deciding digit is 8, which is 5 or more, so the 4 goes up."], [1, 0.49, "That is 2 significant figures."], [0, 4, "4 is the first significant digit. The one that decides comes after it."]],
          hint: "The first digit that is not zero is 4. Look at the one after it.", why: "The deciding digit is <b>8</b>, so the 4 goes up: <b>0.5</b>." } } },

    { type: "num", topic: "Round it rough", explain: true,
      q: "Your turn, no help this time. Round 2950 to 1 significant figure.",
      boxes: [{ label: "2950 rounds to", a: 3000 }],
      slips: [[2000, "The next digit is 9, so the 2 goes up to 3."], [2900, "That is 2 significant figures. Keep just one."], [3, "Keep the size: 3 thousands is 3000."], [2950, "That is the number itself. Rounding moves it."]],
      hint: "First digit 2. Next digit 9.",
      why: "The 9 pushes the 2 up to 3: <b>3000</b>.",
      lv: {
        mild: { q: "Your turn, no help this time. Round 65 to the nearest 10.", boxes: [{ label: "65 rounds to", a: 70 }],
          slips: [[60, "When the ones digit is exactly 5, we round up."], [65, "That is the number itself. Rounding moves it to a ten."]],
          hint: "5 counts as round up.", why: "A 5 rounds up, so 65 becomes <b>70</b>." },
        spicy: { q: "Your turn, no help this time. Round 0.0952 to 1 significant figure.", boxes: [{ label: "0.0952 rounds to", a: 0.1 }],
          slips: [[0.09, "The next digit is 5, so the 9 goes up. 9 hundredths going up makes 10 hundredths, which is 0.1."], [0.095, "That is 2 significant figures."]],
          hint: "What happens when a 9 goes up one?", why: "The 5 pushes the 9 up, and 10 hundredths is <b>0.1</b>." } } },

    { type: "multi", topic: "Round it rough",
      q: "Pick <b>all</b> the numbers that round to 300 to 1 significant figure.",
      options: ["251", "349", "350", "249", "305"],
      answers: [0, 1, 4],
      hint: "Anything from 250 up to just under 350 rounds to 300.",
      why: "251, 349 and 305 all round to 300. 350 rounds up to 400 and 249 rounds down to 200.",
      lv: {
        mild: { q: "Pick <b>all</b> the numbers that round to 50 (nearest 10).", options: ["45", "54", "55", "44", "49"], answers: [0, 1, 4],
          hint: "Anything from 45 up to 54 rounds to 50.", why: "45, 54 and 49 round to 50. 55 rounds up to 60 and 44 rounds down to 40." },
        spicy: { q: "Pick <b>all</b> the numbers that round to 0.3 to 1 significant figure.", options: ["0.25", "0.349", "0.35", "0.249", "0.31"], answers: [0, 1, 4],
          hint: "Anything from 0.25 up to just under 0.35.", why: "0.25, 0.349 and 0.31 round to 0.3. 0.35 rounds up to 0.4 and 0.249 rounds down to 0.2." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Round, then work it out", title: "Estimate: round first, then do the easy sum",
      fig: EST("4.85", X, "21", "5", "20", "100"),
      html: "<p>To estimate an answer, round <b>every</b> number to 1 significant figure first. Then do the easy sum in your head.</p>" +
        "<p class=\"a2task\"><b>Worked example.</b> [[Item]] costs 4.85 pounds. 21 [[crowd]] buy one each. Roughly how much is that?<br>4.85 rounds to <b>5</b>. 21 rounds to <b>20</b>.<br>5 " + X + " 20 = <b>100</b>. So about 100 pounds.</p>" +
        "<p>The sign " + ABOUT + " means \"is about\".</p>",
      lv: {
        mild: { fig: EST("38", "+", "51", "40", "50", "90"),
          html: "<p>To estimate, round each number to the nearest 10 first. Then the sum is easy.</p>" +
            "<p class=\"a2task\"><b>Worked example.</b> 38 [[crowd]] on one bus and 51 on another. Roughly how many?<br>38 rounds to <b>40</b>. 51 rounds to <b>50</b>.<br>40 + 50 = <b>90</b>. So about 90.</p>" },
        spicy: { fig: EST("612", D, "2.9", "600", "3", "200"),
          html: "<p>Round <b>every</b> number to 1 significant figure, then do the easy sum. It works for divide too.</p>" +
            "<p class=\"a2task\"><b>Worked example.</b> Estimate 612 " + D + " 2.9.<br>612 rounds to <b>600</b>. 2.9 rounds to <b>3</b>.<br>600 " + D + " 3 = <b>200</b>.</p>" +
            "<p>With decimals under 1, think in halves and tenths: " + X + " 0.5 is halving, " + D + " 0.5 is doubling.</p>" } } },

    { type: "num", topic: "Round, then work it out",
      q: "[[Item]] costs 4.85 pounds. 21 [[crowd]] buy one each. Finish the estimate.<p class=\"a2task\">4.85 rounds to 5.<br>21 rounds to 20.<br>5 " + X + " 20 = ___ pounds</p>",
      boxes: [{ label: "About", a: 100, post: "pounds" }],
      slips: [[101.85, "That is the exact answer. Well worked out, but an estimate uses the rounded numbers."], [25, "That is 5 + 20. It is times here."]],
      hint: "5 lots of 20.",
      why: "5 " + X + " 20 = <b>100</b>, so about 100 pounds.",
      lv: {
        mild: { q: "There are 38 [[crowd]] on one bus and 51 on another. Finish the estimate.<p class=\"a2task\">38 rounds to 40.<br>51 rounds to 50.<br>40 + 50 = ___</p>",
          boxes: [{ label: "About", a: 90 }],
          slips: [[89, "That is the exact answer. Well worked out, but an estimate uses 40 + 50."], [80, "4 tens and 5 tens make 9 tens."]],
          hint: "4 tens and 5 tens.", why: "40 + 50 = <b>90</b>." },
        spicy: { q: "Estimate 7.9 " + X + " 0.48. Finish the working.<p class=\"a2task\">7.9 rounds to 8.<br>0.48 rounds to 0.5.<br>8 " + X + " 0.5 = ___</p>",
          boxes: [{ label: "About", a: 4 }],
          slips: [[40, "Times by 0.5 is the same as halving. Half of 8 is 4."], [3.792, "That is exact. Use the rounded numbers."], [16, "That is doubling. Times by 0.5 halves."]],
          hint: "Times by 0.5 means halve it.", why: "8 " + X + " 0.5 = <b>4</b>." } } },

    { type: "num", topic: "Round, then work it out",
      q: "Estimate 19 " + X + " 42. Fill in each step.",
      boxes: [{ label: "19 rounds to", a: 20 }, { label: "42 rounds to", a: 40 }, { label: "Estimate", a: 800 }],
      slips: [[2, 80, "2 tens times 4 tens: 2 " + X + " 4 = 8, then two zeros. 800."], [2, 798, "That is exact. Use 20 " + X + " 40."], [2, 60, "That is 20 + 40. It is times here."]],
      hint: "20 " + X + " 40: do 2 " + X + " 4, then put back the zeros.",
      why: "20 " + X + " 40 = <b>800</b>.",
      lv: {
        mild: { q: "Estimate 29 + 62. Fill in each step.",
          boxes: [{ label: "29 rounds to", a: 30 }, { label: "62 rounds to", a: 60 }, { label: "Estimate", a: 90 }],
          slips: [[2, 91, "That is exact. The estimate uses 30 + 60."], [0, 20, "29 is only 1 away from 30, so it rounds up."]],
          hint: "29 is very close to 30.", why: "30 + 60 = <b>90</b>." },
        spicy: { q: "Estimate 392 " + D + " 7.8. Fill in each step.",
          boxes: [{ label: "392 rounds to", a: 400 }, { label: "7.8 rounds to", a: 8 }, { label: "Estimate", a: 50 }],
          slips: [[2, 5, "400 " + D + " 8 is 50, not 5. Check: 8 " + X + " 5 is only 40."], [2, 500, "Check: 8 " + X + " 500 = 4000. Too big."], [0, 390, "That is 2 significant figures. Keep just the 4 (hundreds)."]],
          hint: "How many 8s make 400? Think 40 " + D + " 8 first.", why: "400 " + D + " 8 = <b>50</b>." } } },

    { type: "num", topic: "Round, then work it out",
      q: "Your turn, no help this time. Estimate 6.2 " + X + " 39.",
      boxes: [{ label: "About", a: 240 }],
      slips: [[241.8, "That is exact. Round first: 6 " + X + " 40."], [180, "39 rounds to 40, not 30."], [24, "6 " + X + " 4 is 24, but it is 6 " + X + " 40. 240."]],
      hint: "6.2 is about 6. 39 is about 40.",
      why: "6 " + X + " 40 = <b>240</b>.",
      lv: {
        mild: { q: "Your turn, no help this time. Estimate 71 + 18.", boxes: [{ label: "About", a: 90 }],
          slips: [[89, "That is exact. Round first: 70 + 20."], [80, "18 rounds to 20, not 10."]],
          hint: "71 is about 70. 18 is about 20.", why: "70 + 20 = <b>90</b>." },
        spicy: { q: "Your turn, no help this time. Estimate (48.7 " + X + " 9.6) " + D + " 2.1.", boxes: [{ label: "About", a: 250 }],
          slips: [[500, "Nearly. Do not forget to divide by 2 at the end."], [25, "50 " + X + " 10 = 500, then halve it: 250, not 25."]],
          hint: "50 " + X + " 10, then " + D + " 2.", why: "50 " + X + " 10 = 500, and 500 " + D + " 2 = <b>250</b>." } } },

    { type: "mc", topic: "Round, then work it out",
      q: "Which is the best estimate for 31 " + X + " 48?",
      options: ["1500", "150", "15000", "1200"],
      answer: 0,
      slips: { 1: "Check the zeros: 3 tens times 5 tens is 15 hundreds.", 2: "Too many zeros. 30 " + X + " 50 = 1500.", 3: "48 rounds to 50, not 40." },
      hint: "30 " + X + " 50.",
      why: "30 " + X + " 50 = <b>1500</b>.",
      lv: {
        mild: { q: "Which is the best estimate for 39 + 42?", options: ["80", "70", "8", "800"],
          slips: { 1: "39 rounds up to 40, not down to 30.", 2: "Far too small. 40 + 40 is 80.", 3: "Far too big. Two numbers under 50 cannot add up to anything near 800." },
          hint: "40 + 40.", why: "40 + 40 = <b>80</b>." },
        spicy: { q: "Which is the best estimate for 0.29 " + X + " 812?", options: ["240", "24", "2400", "320"],
          slips: { 1: "Check the size: 0.3 of 800 is a bit less than a third of 800.", 2: "Too big: multiplying by 0.3 makes the answer smaller than 800.", 3: "0.29 rounds to 0.3. 320 would be 0.4 " + X + " 800." },
          hint: "0.3 " + X + " 800: do 3 " + X + " 8, then think about the size.", why: "0.3 " + X + " 800 = <b>240</b>." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Does it make sense?", title: "Use the estimate to check",
      fig: CALC("1018.5", "100"),
      html: "<p>Calculators only do what you type. Miss a decimal point and they will happily give you nonsense.</p>" +
        "<p class=\"a2task\">21 [[items]] at 4.85 pounds each. The calculator says <b>1018.5</b>.<br>The estimate said <b>about 100</b>.<br>That is ten times too big. Someone typed 48.5 instead of 4.85.</p>" +
        "<p>So: <b>estimate first</b>, calculate, then check the two are close. If they are far apart, have another look.</p>",
      lv: {
        mild: { fig: CALC("189", "90"),
          html: "<p>Calculators only do what you type. One slip and the answer is nonsense.</p>" +
            "<p class=\"a2task\">38 + 51. The calculator says <b>189</b>.<br>The estimate said <b>about 90</b>.<br>That is far too big. Someone pressed an extra key.</p>" +
            "<p>Estimate first, then check the answer is close.</p>" } } },

    { type: "mc", topic: "Does it make sense?",
      q: "A shop says 19 [[items]] at 3.10 pounds each cost 589 pounds. Does that make sense?",
      options: ["No, it should be about 60 pounds", "Yes, that is about right", "No, it should be about 6 pounds"],
      answer: 0,
      slips: { 1: "Estimate: 20 " + X + " 3 = 60. 589 is nearly ten times too big.", 2: "Check: 20 " + X + " 3 = 60, not 6." },
      hint: "Round 19 and 3.10, then multiply.",
      why: "20 " + X + " 3 = 60. The real answer is 58.90, so 589 has lost its decimal point.",
      lv: {
        mild: { q: "Someone works out 38 + 51 and gets 189. The estimate is about 90. Does 189 make sense?",
          options: ["No, it should be about 90", "Yes, it looks fine"], fixed: true,
          slips: { 1: "189 is about double the estimate. Something went wrong." },
          hint: "Is 189 close to 90?", why: "189 is nowhere near 90. The real answer is 89." },
        spicy: { q: "A spreadsheet says 0.48 " + X + " 61 = 292.8. Does that make sense?",
          options: ["No, it should be about 30", "Yes, it is about right", "No, it should be about 3"],
          slips: { 1: "Estimate: 0.5 " + X + " 60 = 30. 292.8 is ten times too big.", 2: "0.5 " + X + " 60 is half of 60, which is 30." },
          hint: "0.48 is about a half.", why: "Half of 60 is 30. The real answer is 29.28, so the decimal point has slipped." } } },

    { type: "multi", topic: "Does it make sense?",
      q: "Use estimates. Pick the answers that look <b>right</b>.",
      options: ["52 " + X + " 9.8 = 509.6", "3.1 " + X + " 19 = 589", "812 " + D + " 4 = 203", "0.49 " + X + " 61 = 299"],
      answers: [0, 2],
      hint: "Estimate each one: 50 " + X + " 10, 3 " + X + " 20, 800 " + D + " 4, 0.5 " + X + " 60.",
      why: "Estimates: 500, 60, 200 and 30. So 509.6 and 203 look right. 589 and 299 are about ten times too big.",
      lv: {
        mild: { options: ["29 + 41 = 70", "58 + 22 = 180", "19 + 19 = 38", "61 + 29 = 30"], answers: [0, 2],
          hint: "Estimate each one: 30 + 40, 60 + 20, 20 + 20, 60 + 30.",
          why: "Estimates: 70, 80, 40 and 90. So 70 and 38 look right. 180 and 30 are far off." },
        spicy: { options: ["0.52 " + X + " 98 = 50.96", "31 " + X + " 0.19 = 58.9", "8.12 " + D + " 0.4 = 20.3", "0.049 " + X + " 610 = 299", "6.1 " + X + " 0.9 = 5.49"], answers: [0, 2, 4],
          hint: "Estimate each: 0.5 " + X + " 100, 30 " + X + " 0.2, 8 " + D + " 0.4, 0.05 " + X + " 600, 6 " + X + " 0.9.",
          why: "Estimates: 50, 6, 20, 30 and about 5.4. So 50.96, 20.3 and 5.49 look right. 58.9 and 299 are ten times too big." } } },

    { type: "text", topic: "Does it make sense?",
      q: "A calculator says 6.9 " + X + " 31 = 2139. How do you know that is not right? Put your estimate in your answer.",
      need: [["210", "200", "7 x 30", "7x30", "7 times 30"]],
      slips: [[["2139", "too big", "wrong"], "Yes, it does look off. Say what it should be about: round both numbers and multiply."]],
      model: "6.9 is about 7 and 31 is about 30. 7 x 30 = 210, so 2139 is about ten times too big.",
      hint: "Round 6.9 and 31, then multiply. Say that number.",
      why: "7 " + X + " 30 = 210. The calculator answer is about ten times bigger, so a decimal point has gone missing. The real answer is 213.9.",
      lv: {
        mild: { q: "Someone says 48 + 31 = 129. How do you know that is not right? Put your estimate in your answer.",
          need: [["80", "79", "50 + 30", "50+30"]],
          slips: [[["129", "too big", "wrong"], "Yes, it does look off. Say what it should be about: 50 + 30."]],
          model: "48 is about 50 and 31 is about 30, so it should be about 80, not 129.",
          hint: "Round both numbers and add.", why: "50 + 30 = 80. 129 is much too big. The real answer is 79." },
        spicy: { q: "A calculator says 412 " + D + " 0.38 = 108.4. How do you know that is not right? Put your estimate in your answer.",
          need: [["1000", "1 000", "thousand", "bigger", "larger", "more than 412", "more than 400"]],
          slips: [[["smaller", "less than"], "Careful: dividing by a number less than 1 makes the answer bigger, not smaller."]],
          model: "400 divided by 0.4 is 1000. Dividing by a number less than 1 makes it bigger, so 108.4 is far too small.",
          hint: "Estimate 400 " + D + " 0.4. Will the answer be bigger or smaller than 400?",
          why: "400 " + D + " 0.4 = 1000. Dividing by something less than 1 makes the answer <b>bigger</b>, so 108.4 cannot be right. The real answer is about 1084." } } },

    { type: "order", topic: "Does it make sense?",
      q: "Put the checking steps in order.",
      items: ["Round each number to 1 significant figure", "Work out the estimate in your head", "Do the real calculation", "Compare the answer with the estimate", "If they are far apart, check again"],
      hint: "The estimate comes before the real calculation.",
      why: "Round, estimate, calculate, compare, and check again if they do not match.",
      lv: { mild: { items: ["Round each number to the nearest 10", "Work out the estimate", "Do the real sum", "Check they are close"] } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Estimate it for real", title: "Estimating out in the world",
      fig: RECEIPT,
      html: "<p>Estimating is what people actually do in shops, on trips and at work. Nobody gets a calculator out in a queue.</p>" +
        "<p class=\"a2task\">2.89 + 4.15 + 0.95 pounds. Round each to the nearest pound: 3 + 4 + 1 = <b>about 8 pounds</b>.</p>" +
        "<p>One more trick: if you rounded the numbers <b>up</b>, your estimate is a bit <b>more</b> than the real answer. Handy when you are checking you have enough money.</p>",
      lv: {
        spicy: { html: "<p>Estimating is what people actually do in shops, on journeys and at work.</p>" +
          "<p class=\"a2task\">2.89 + 4.15 + 0.95: 3 + 4 + 1 = <b>about 8</b>. The real total is 7.99.</p>" +
          "<p>Look at the direction you rounded. Both numbers rounded <b>up</b>: the estimate is an <b>overestimate</b>. Both rounded <b>down</b>: an <b>underestimate</b>. One of each: you cannot be sure without thinking harder.</p>" +
          "<p>For a budget, an overestimate is the safe one: if the overestimate fits, the real thing fits too.</p>" } } },

    { type: "num", topic: "Estimate it for real",
      q: "7 [[items]] cost 3.85 pounds each. Estimate the total.",
      boxes: [{ label: "About", a: 28, pre: "", post: "pounds" }],
      slips: [[26.95, "That is exact. Round 3.85 to 4 first."], [21, "3.85 rounds up to 4, not down to 3."], [11, "That is 7 + 4. It is 7 lots of 4."]],
      hint: "3.85 is about 4. Then 7 lots of 4.",
      why: "7 " + X + " 4 = <b>28</b>, so about 28 pounds.",
      lv: {
        mild: { q: "You buy three things: 2.89 pounds, 4.15 pounds and 0.95 pounds. Round each to the nearest pound and estimate the total.",
          fig: RECEIPT, boxes: [{ label: "About", a: 8, post: "pounds" }],
          slips: [[7.99, "That is exact. Round first: 3 + 4 + 1."], [7, "0.95 rounds up to 1 pound, not 0."]],
          hint: "3 + 4 + 1.", why: "3 + 4 + 1 = <b>8</b>, so about 8 pounds." },
        spicy: { q: "A coach to [[venue]] drives 289 km at an average speed of 48 km per hour. Estimate how many hours the journey takes.",
          boxes: [{ label: "About", a: 6, post: "hours" }],
          slips: [[60, "300 " + D + " 50 is 6, not 60. Check the zeros."], [15000, "Time is distance divided by speed, not times."]],
          hint: "Time = distance " + D + " speed. Round to 300 and 50.", why: "300 " + D + " 50 = <b>6</b>, so about 6 hours." } } },

    { type: "mc", topic: "Estimate it for real", explain: true,
      q: "You have 50 pounds. Is it enough for 9 [[items]] at 5.85 pounds each?",
      options: ["No: about 9 " + X + " 6 = 54 pounds, which is more than 50", "Yes: about 9 " + X + " 5 = 45 pounds", "Yes: there will be loads left over"],
      answer: 0,
      slips: { 1: "5.85 is much nearer 6 than 5, so round it up.", 2: "Estimate first: 9 " + X + " 6 = 54. That is over 50." },
      hint: "5.85 is about 6.",
      why: "9 " + X + " 6 = 54. The real cost is 52.65, so 50 pounds is not quite enough.",
      lv: {
        mild: { q: "You have 20 pounds. You want 4 [[items]] at 4.80 pounds each. Is 20 pounds enough?",
          options: ["Yes: 4.80 is a bit less than 5, so it costs a bit less than 20", "No: it costs more than 20"], fixed: true,
          slips: { 1: "4.80 is less than 5, so 4 of them cost less than 4 " + X + " 5 = 20." },
          hint: "4 lots of 5 is 20. Is 4.80 more or less than 5?", why: "4 " + X + " 5 = 20, and 4.80 is a bit less than 5, so it fits. The real cost is 19.20." },
        spicy: { q: "You estimate 9.7 " + X + " 5.85 as 10 " + X + " 6 = 60. Is the real answer more or less than 60?",
          options: ["Less, because both numbers were rounded up", "More, because estimates always come out too small", "Exactly 60"],
          slips: { 1: "Estimates are not always too small. Here both numbers went up when you rounded.", 2: "Rounding changes the numbers, so the estimate is very rarely exact." },
          hint: "Did 9.7 and 5.85 go up or down when you rounded them?", why: "Both went up, so 60 is an overestimate. The real answer is 56.745." } } },

    { type: "num", topic: "Estimate it for real", stretch: true,
      q: "Estimate 21 " + X + " 3.9 " + X + " 4.8.",
      boxes: [{ label: "About", a: 400 }],
      slips: [[393.12, "That is exact. Round first: 20 " + X + " 4 " + X + " 5."], [80, "20 " + X + " 4 = 80. Then times by 5 as well: 400."], [29, "Those were added. It is times all the way."]],
      hint: "20 " + X + " 4 " + X + " 5. Try 4 " + X + " 5 first.",
      why: "4 " + X + " 5 = 20, and 20 " + X + " 20 = <b>400</b>.",
      lv: {
        mild: { q: "Estimate 4 " + X + " 19.", boxes: [{ label: "About", a: 80 }],
          slips: [[76, "That is exact. Round 19 to 20: 4 " + X + " 20."], [40, "19 rounds to 20, so 4 " + X + " 20 = 80."], [23, "That is 4 + 19. It is times here."]],
          hint: "19 is about 20.", why: "4 " + X + " 20 = <b>80</b>." },
        spicy: { q: "Estimate (0.52 " + X + " 7890) " + D + " 19.6.", boxes: [{ label: "About", a: 200 }],
          slips: [[4000, "Nearly: do not forget to divide by 20 at the end."], [20, "4000 " + D + " 20 = 200. Check the zeros."]],
          hint: "0.5 " + X + " 8000, then " + D + " 20.", why: "0.5 " + X + " 8000 = 4000, and 4000 " + D + " 20 = <b>200</b>." } } },

    { type: "widget", topic: "Estimate it for real", unscored: true,
      title: "The estimate-o-meter",
      html: "<p>Slide the marker to where you think the answer lands, then lock it in to see the real one. No pressure: it is just for fun.</p>",
      mount: function(el, api){
        var d = api.data;
        if(!Array.isArray(d.guesses)) d.guesses = [];
        var SETS = {
          mild: [["38 + 51", 89, 200], ["19 + 9", 28, 100], ["68 + 47", 115, 200]],
          medium: [["49 x 21", 1029, 2000], ["9.8 x 31", 303.8, 500], ["198 / 4", 49.5, 100]],
          spicy: [["4.85 x 21", 101.85, 200], ["612 / 2.9", 211.03, 400], ["0.48 x 79", 37.92, 100]]
        };
        var set = SETS[api.level] || SETS.medium;
        var k = (typeof d.k === "number" && d.k >= 0) ? d.k % set.length : 0;
        var locked = false;
        el.innerHTML = '<p style="font-size:1.4em;font-weight:700;text-align:center;margin:.3em 0" class="eom-q"></p>' +
          '<svg viewBox="0 0 520 110" style="width:100%;max-width:560px;display:block;margin:0 auto" role="img" aria-label="A number line with your estimate"></svg>' +
          '<div style="max-width:520px;margin:0 auto"><input type="range" min="0" step="1" style="width:100%" aria-label="Your estimate"></div>' +
          '<p class="tiny eom-v" style="text-align:center"></p>' +
          '<div class="qnav" style="flex-wrap:wrap;gap:8px;justify-content:center"><button type="button" class="btn" data-a="lock">Lock it in</button><button type="button" class="btn btn-quiet" data-a="next">Next one</button></div>' +
          '<p class="tiny eom-m" aria-live="polite" style="min-height:1.4em;text-align:center"></p>';
        var q = el.querySelector(".eom-q"), svg = el.querySelector("svg"), rng = el.querySelector("input"), vt = el.querySelector(".eom-v"), msg = el.querySelector(".eom-m");
        function pretty(s){ return String(s).replace(/ x /g, " " + String.fromCharCode(215) + " ").replace(/ \/ /g, " " + String.fromCharCode(247) + " "); }
        function fmt(n){ return Math.round(n * 100) / 100; }
        function draw(g, real){
          var c = set[k], max = c[2];
          function px(v){ return 30 + Math.max(0, Math.min(1, v / max)) * 460; }
          var s = '<rect width="520" height="110" rx="14" fill="#f3efff"/><path d="M30 60H490" stroke="#141a33" stroke-width="4" stroke-linecap="round"/>';
          [0, 0.25, 0.5, 0.75, 1].forEach(function(f){ s += '<path d="M' + px(f * max) + ' 50v20" stroke="#141a33" stroke-width="2.5"/><text x="' + px(f * max) + '" y="92" text-anchor="middle" font-family="Verdana,Arial,sans-serif" font-size="13" fill="#141a33">' + fmt(f * max) + '</text>'; });
          s += '<path d="M' + px(g) + ' 18v34" stroke="#3a5bd6" stroke-width="4"/><circle cx="' + px(g) + '" cy="18" r="8" fill="#3a5bd6"/>';
          if(real != null) s += '<path d="M' + px(real) + ' 68v-34" stroke="#19c39a" stroke-width="4"/><circle cx="' + px(real) + '" cy="30" r="8" fill="#19c39a"/>';
          svg.innerHTML = s;
        }
        function show(){
          var c = set[k];
          locked = false;
          q.textContent = pretty(c[0]) + " = ?";
          rng.max = String(c[2]); rng.step = String(c[2] / 100); rng.value = String(c[2] / 2);
          vt.textContent = "My estimate: about " + fmt(+rng.value);
          msg.textContent = "";
          draw(+rng.value, null);
        }
        rng.addEventListener("input", function(){ if(locked) return; vt.textContent = "My estimate: about " + fmt(+rng.value); draw(+rng.value, null); });
        el.querySelector(".qnav").onclick = function(ev){
          var b = ev.target.closest("button"); if(!b) return;
          var act = b.getAttribute("data-a"), c = set[k];
          if(act === "lock"){
            if(locked) return;
            locked = true;
            var g = +rng.value, off = Math.abs(g - c[1]) / c[2];
            draw(g, c[1]);
            msg.textContent = "You said about " + fmt(g) + ". The real answer is " + c[1] + ". " +
              (off <= 0.1 ? "Hawk eyed." : off <= 0.25 ? "In the right ballpark." : "Try rounding each number first, then slide again on the next one.");
            d.guesses.push({ q: c[0], guess: fmt(g), real: c[1] });
            if(d.guesses.length > 12) d.guesses = d.guesses.slice(-12);
            api.save(); api.done("done");
          } else if(act === "next"){
            k = (k + 1) % set.length; d.k = k; api.save(); show();
          }
        };
        show();
      },
      report: function(d){ var g = (d && d.guesses) || []; return "Estimate-o-meter: " + g.length + " goes" + (g.length ? " (last: " + g[g.length - 1].q + ", said " + g[g.length - 1].guess + ", real " + g[g.length - 1].real + ")." : "."); } }
  ],

  realWorld: {
    title: "Estimating is a superpower",
    html: "<p>Builders estimate how many bricks to order. Pilots estimate fuel. Shoppers estimate the bill before they reach the till. Anyone checking a bill or a payslip uses an estimate to spot a mistake.</p>" +
      "<p>If we could time travel, should we? Say you did: you would land with no phone and no calculator, and strange prices everywhere. A quick estimate would be the thing that stops you getting ripped off.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A time portal and a price tag with an estimate">' + A.portal(70, 75, 52) +
      '<path d="M170 40h130l30 35 -30 35H170z" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/><circle cx="312" cy="75" r="6" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' +
      T(184, 70, "3.95 x 6", 18, ' font-weight="700"') + T(184, 96, ABOUT + " 24", 18, ' font-weight="700" fill="#0f7d5e"') +
      A.bird(378, 50, 0.8, "#3a8fd6") + '</svg>'
  },

  make: {
    title: "Make an estimate check card",
    intro: "Pick a calculation (from today, or from real life), estimate it, then check. Save it or send it to Jay if you like.",
    fields: [
      { id: "calc", label: "The calculation", ph: "4.85 x 21", max: 28 },
      { id: "est", label: "My estimate (rounded working)", ph: "5 x 20 = 100", max: 32 },
      { id: "real", label: "The real answer", ph: "101.85", max: 20 },
      { id: "verdict", label: "Does it make sense?", ph: "Yes, it is close to 100", max: 60 },
      { id: "name", label: "Checked by", ph: "Hawk eye B5", max: 24 }
    ],
    svg: function(v){
      function tx(x, y, t, sz, w, c, a){ return '<text x="' + x + '" y="' + y + '" font-family="Verdana,Arial,sans-serif" font-size="' + sz + '"' + (w ? ' font-weight="700"' : "") + (a ? ' text-anchor="' + a + '"' : "") + ' fill="' + (c || "#141a33") + '">' + t + '</text>'; }
      var calc = wrap(v.calc, 18, 2), est = wrap(v.est, 26, 2), verdict = wrap(v.verdict, 30, 2), real = wrap(v.real, 18, 1);
      var s = '<rect width="600" height="400" rx="22" fill="#2d2466"/>' +
        '<rect x="16" y="16" width="568" height="368" rx="16" fill="#fffdf6"/>' +
        '<rect x="16" y="16" width="568" height="62" rx="16" fill="#ffd23f"/><rect x="16" y="56" width="568" height="22" fill="#ffd23f"/>' +
        tx(40, 58, "ESTIMATE FIRST", 26, 1) +
        '<circle cx="520" cy="47" r="22" fill="#2d2466"/>' + tx(520, 57, "&#8776;", 26, 1, "#ffd23f", "middle");
      s += tx(40, 106, "The sum", 14, 0, "#5b6180");
      calc.forEach(function(l, k){ s += tx(40, 136 + k * 30, esc(l), 26, 1); });
      var y = 136 + (calc.length - 1) * 30 + 28;
      s += tx(40, y, "Estimate", 14, 0, "#5b6180");
      est.forEach(function(l, k){ s += tx(40, y + 24 + k * 24, esc(l), 20, 1, "#5b3cc4"); });
      y = y + 24 + (est.length - 1) * 24 + 30;
      s += tx(40, y, "Real answer: " + esc(real[0] || ""), 18, 1, "#0f7d5e");
      verdict.forEach(function(l, k){ s += tx(40, y + 26 + k * 22, esc(l), 16, 0); });
      s += tx(40, 366, "Checked by " + esc(v.name), 14, 0, "#5b6180");
      s += '<g transform="translate(500 300) rotate(-10)"><circle r="54" fill="none" stroke="#19c39a" stroke-width="6"/>' + tx(0, -4, "MAKES", 16, 1, "#0f7d5e", "middle") + tx(0, 18, "SENSE?", 16, 1, "#0f7d5e", "middle") + '</g>';
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' + s + '</svg>';
    }
  }
};
})();
