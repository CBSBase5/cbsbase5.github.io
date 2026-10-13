/* ==========================================================
   LC's Night Shift HQ: daily drop question bank: Maths
   (Maths Foundation 2 to 3, built from Jay's baselines, no exam)
   32 quick questions, one or two minutes each. Each links
   to the activity chunk that teaches the skill: [activity id, chunk number].
   ========================================================== */
window.EGWDAILY = (window.EGWDAILY || []).concat([

  /* ---------- place-value: Place value ---------- */
  { s: "maths", type: "num", q: "Look at 586. What is the 8 worth?",
    boxes: [{ label: "The 8 is worth", a: 80, tol: 0.01, pre: "", post: "" }],
    hint: "Which place is the 8 in: hundreds, tens or ones?",
    why: "The 8 is in the tens place. 8 tens make <b>80</b>. So 586 is 500 and 80 and 6.",
    link: ["place-value", 1] },

  { s: "maths", type: "mc", q: "Which number is two thousand and fifty?",
    options: ["2050", "2500", "20050", "2005"], answer: 0,
    hint: "Thousands come first. Then hundreds, tens and ones.",
    why: "2 thousands, 0 hundreds, 5 tens and 0 ones make <b>2050</b>. The zeros hold the empty places. 2500 is two thousand five hundred.",
    link: ["place-value", 2] },

  { s: "maths", type: "num", q: "The whole is 80. One part is 35. What is the other part?",
    boxes: [{ label: "Other part", a: 45, tol: 0.01, pre: "", post: "" }],
    hint: "Take the part away from the whole.",
    why: "80 &minus; 35 = <b>45</b>. Check it: 35 + 45 = 80. The parts add up to the whole.",
    link: ["place-value", 3] },

  { s: "maths", type: "mc", q: "Four lockers in an empty gym. Which locker number is the biggest?",
    options: ["790", "709", "779", "97"], answer: 0,
    hint: "Look at the hundreds first. If they match, look at the tens.",
    why: "97 has no hundreds, so it is the smallest. The others all have 7 hundreds. Then look at the tens: 9 tens beats 7 tens and 0 tens. So <b>790</b>.",
    link: ["place-value", 5] },

  { s: "maths", type: "num", q: "What number is halfway between 400 and 500?",
    boxes: [{ label: "Halfway", a: 450, tol: 0.01, pre: "", post: "" }],
    hint: "How far is it from 400 to 500? Find half of that.",
    why: "From 400 to 500 is 100. Half of 100 is 50. So 400 + 50 = <b>450</b>.",
    link: ["place-value", 6] },

  { s: "maths", type: "num", q: "Round 74 to the nearest 10.",
    boxes: [{ label: "Rounded", a: 70, tol: 0.01, pre: "", post: "" }],
    hint: "Is 74 nearer to 70 or to 80?",
    why: "74 is between 70 and 80. The ones digit is 4. 4 or less rounds down. So <b>70</b>.",
    link: ["place-value", 7] },

  /* ---------- add-subtract: Adding and taking away ---------- */
  { s: "maths", type: "mc", q: "Which pair makes 100?",
    options: ["65 and 35", "65 and 45", "60 and 45", "55 and 55"], answer: 0,
    hint: "Add the tens. Then add the ones.",
    why: "60 and 30 make 90. 5 and 5 make 10. So 65 and 35 make <b>100</b>. 55 and 55 make 110, one ten too many.",
    link: ["add-subtract", 1] },

  { s: "maths", type: "num", q: "Work it out in your head. 38 + 9",
    boxes: [{ label: "Answer", a: 47, tol: 0.01, pre: "", post: "" }],
    hint: "Add 10. Then take away 1.",
    why: "38 + 10 = 48. That is 1 too many, so take away 1. The answer is <b>47</b>.",
    link: ["add-subtract", 2] },

  { s: "maths", type: "num", q: "Add in columns. 256 + 137",
    boxes: [{ label: "Answer", a: 393, tol: 0.01, pre: "", post: "" }],
    hint: "Start with the ones. 6 + 7 is more than 10, so carry 1.",
    why: "Ones: 6 + 7 = 13. Write 3 and carry 1. Tens: 5 + 3 + 1 = 9. Hundreds: 2 + 1 = 3. The answer is <b>393</b>.",
    link: ["add-subtract", 3] },

  { s: "maths", type: "num", q: "Take away in columns. 543 &minus; 218",
    boxes: [{ label: "Answer", a: 325, tol: 0.01, pre: "", post: "" }],
    hint: "3 take away 8 does not work. Exchange a ten for ten ones.",
    why: "Ones: swap a ten, so 13 &minus; 8 = 5. Tens: 3 &minus; 1 = 2. Hundreds: 5 &minus; 2 = 3. The answer is <b>325</b>.",
    link: ["add-subtract", 4] },

  { s: "maths", type: "mc", q: "Which sum checks this one? 600 &minus; 245 = 355",
    options: ["355 + 245", "600 + 245", "355 &minus; 245", "600 + 355"], answer: 0,
    hint: "Adding undoes taking away.",
    why: "Add the answer to the number you took away. 355 + 245 = 600, so the take away was right.",
    link: ["add-subtract", 6] },

  { s: "maths", type: "num", q: "The empty mall has 420 lights. 165 are flickering. How many are not flickering?",
    boxes: [{ label: "Not flickering", a: 255, tol: 0.01, pre: "", post: "lights" }],
    hint: "Is the answer more or less than 420? Take away.",
    why: "420 &minus; 165 = <b>255</b> lights. Check it: 255 + 165 = 420.",
    link: ["add-subtract", 7] },

  /* ---------- times-divide: Times and share ---------- */
  { s: "maths", type: "num", q: "A ghost tour costs &pound;5 for each person. How much for 7 people?",
    boxes: [{ label: "Cost", a: 35, tol: 0.001, pre: "&pound;", post: "", show: "35" }],
    hint: "Count up in 5s, seven times.",
    why: "7 &times; 5 = 35. Count in 5s: 5, 10, 15, 20, 25, 30, 35. So <b>&pound;35</b>.",
    link: ["times-divide", 2] },

  { s: "maths", type: "num", q: "What is 6 &times; 4?",
    boxes: [{ label: "Answer", a: 24, tol: 0.01, pre: "", post: "" }],
    hint: "Stuck on the 4s? Do 6 &times; 2, then double it.",
    why: "6 &times; 2 = 12. Double 12 is <b>24</b>.",
    link: ["times-divide", 3] },

  { s: "maths", type: "num", q: "Double 45.",
    boxes: [{ label: "Double", a: 90, tol: 0.01, pre: "", post: "" }],
    hint: "Split it. Double the 40, then double the 5.",
    why: "Double 40 is 80. Double 5 is 10. 80 + 10 = <b>90</b>.",
    link: ["times-divide", 4] },

  { s: "maths", type: "mc", q: "Share 17 cupcakes into 5 boxes. What do you get?",
    options: ["3 in each, 2 left over", "2 in each, 7 left over", "4 in each, 3 left over", "3 in each, 3 left over"], answer: 0,
    hint: "How many 5s fit into 17?",
    why: "5 &times; 3 = 15. That leaves 2. So <b>3 in each, 2 left over</b>. The remainder is always smaller than the number of boxes.",
    link: ["times-divide", 6] },

  { s: "maths", type: "num", q: "The old cinema has 8 rows. Each row has 5 seats. How many seats?",
    boxes: [{ label: "Seats", a: 40, tol: 0.01, pre: "", post: "seats" }],
    hint: "Rows of means times.",
    why: "8 rows of 5 is 8 &times; 5 = <b>40</b> seats.",
    link: ["times-divide", 7] },

  /* ---------- measures: Measuring ---------- */
  { s: "maths", type: "num", q: "How many millilitres are in 2 litres?",
    boxes: [{ label: "Millilitres", a: 2000, tol: 0.01, pre: "", post: "ml" }],
    hint: "1 litre is 1000 ml.",
    why: "1 litre is 1000 ml. So 2 litres is 1000 + 1000 = <b>2000 ml</b>.",
    link: ["measures", 1] },

  { s: "maths", type: "mc", q: "On a scale, 0 to 10 has 5 gaps. What is each gap worth?",
    options: ["2", "5", "1", "10"], answer: 0,
    hint: "Share 10 into 5 equal gaps.",
    why: "10 &divide; 5 = <b>2</b>. Count the gaps: 2, 4, 6, 8, 10. The number of gaps is not the same as what each gap is worth.",
    link: ["measures", 2] },

  { s: "maths", type: "num", q: "A jug has 400 ml of water. How much more fills it to 1 litre?",
    boxes: [{ label: "More", a: 600, tol: 0.01, pre: "", post: "ml" }],
    hint: "1 litre is 1000 ml. Count on from 400.",
    why: "1 litre is 1000 ml. 1000 &minus; 400 = <b>600 ml</b>.",
    link: ["measures", 3] },

  { s: "maths", type: "mc", q: "Which is the best guess for the length of a pencil?",
    options: ["15 cm", "15 m", "150 cm", "1 m"], answer: 0,
    hint: "A pencil fits in your hand. 1 metre is 100 cm.",
    why: "<b>15 cm</b> is about right. 1 m and 150 cm are longer than your arm. 15 m is longer than a bus!",
    link: ["measures", 5] },

  { s: "maths", type: "num", q: "A pudding for 4 people needs 150 g of sugar. How much for 8 people?",
    boxes: [{ label: "Sugar", a: 300, tol: 0.01, pre: "", post: "g" }],
    hint: "8 people is double 4 people.",
    why: "8 is double 4. Double 150 g is <b>300 g</b>.",
    link: ["measures", 7] },

  /* ---------- money-time: Money and time ---------- */
  { s: "maths", type: "num", q: "A brownie is &pound;1.40. A jelly pot is 85p. How much altogether?",
    boxes: [{ label: "Total", a: 2.25, tol: 0.001, pre: "&pound;", post: "", show: "2.25" }],
    hint: "Add the pence first. 100 pence makes another &pound;1.",
    why: "40p + 85p = 125p. That is &pound;1.25. Then &pound;1 + &pound;1.25 = <b>&pound;2.25</b>.",
    link: ["money-time", 2] },

  { s: "maths", type: "num", q: "A pudding costs &pound;3.60. You pay with &pound;5. How much change?",
    boxes: [{ label: "Change", a: 1.4, tol: 0.001, pre: "&pound;", post: "", show: "1.40" }],
    hint: "Count up to the next pound. Then count up in pounds.",
    why: "&pound;3.60 to &pound;4 is 40p. &pound;4 to &pound;5 is &pound;1. Your change is <b>&pound;1.40</b>.",
    link: ["money-time", 3] },

  { s: "maths", type: "mc", q: "What does a digital clock show at quarter to 9?",
    options: ["8:45", "9:45", "9:15", "8:15"], answer: 0,
    hint: "Quarter to 9 is before 9 o'clock.",
    why: "Quarter to 9 is 15 minutes before 9. That is 45 minutes past 8. So <b>8:45</b>.",
    link: ["money-time", 5] },

  { s: "maths", type: "mc", q: "A pudding bakes from 3 o'clock to quarter past 4. How long is that?",
    options: ["1 hour and 15 minutes", "1 hour and 25 minutes", "15 minutes", "4 hours and 15 minutes"], answer: 0,
    hint: "Count on to 4 o'clock first.",
    why: "3 o'clock to 4 o'clock is 1 hour. Then 15 more minutes. That is <b>1 hour and 15 minutes</b>.",
    link: ["money-time", 6] },

  { s: "maths", type: "num", q: "The night market is open for 3 weeks. How many days is that?",
    boxes: [{ label: "Days", a: 21, tol: 0.01, pre: "", post: "days" }],
    hint: "How many days are in 1 week?",
    why: "There are 7 days in a week. 3 &times; 7 = <b>21</b> days.",
    link: ["money-time", 7] },

  /* ---------- charts-shapes: Charts and shapes ---------- */
  { s: "maths", type: "num", q: "A tally has 3 gates and 2 more lines. What number is that?",
    boxes: [{ label: "Number", a: 17, tol: 0.01, pre: "", post: "" }],
    hint: "Each gate is 5. Count the gates in 5s.",
    why: "Count the gates: 5, 10, 15. Then the 2 lines: 16, <b>17</b>.",
    link: ["charts-shapes", 1] },

  { s: "maths", type: "num", q: "In a pictogram, one cake means 2 puddings. How many puddings is 3 and a half cakes?",
    boxes: [{ label: "Puddings", a: 7, tol: 0.01, pre: "", post: "puddings" }],
    hint: "Count in 2s for the whole cakes. Half a cake is 1.",
    why: "3 cakes: 2, 4, 6. Half a cake is 1 pudding. 6 + 1 = <b>7</b>.",
    link: ["charts-shapes", 2] },

  { s: "maths", type: "mc", q: "A bar chart goes up in 2s. A bar stops halfway between 6 and 8. What is it?",
    options: ["7", "6", "8", "5"], answer: 0,
    hint: "What number is in the middle of 6 and 8?",
    why: "The scale goes 6, then 8. Halfway between them is <b>7</b>.",
    link: ["charts-shapes", 3] },

  { s: "maths", type: "mc", q: "Which 3D shape has 6 square faces?",
    options: ["Cube", "Sphere", "Cylinder", "Square based pyramid"], answer: 0,
    hint: "Think of a dice.",
    why: "A <b>cube</b> has 6 square faces, 12 edges and 8 vertices. A square based pyramid has just 1 square face.",
    link: ["charts-shapes", 5] },

  { s: "maths", type: "num", q: "How many right angles does a square have?",
    boxes: [{ label: "Right angles", a: 4, tol: 0.01, pre: "", post: "" }],
    hint: "A right angle is a square corner. Count the corners.",
    why: "Every corner of a square is a square corner. A square has 4 corners, so <b>4</b> right angles.",
    link: ["charts-shapes", 7] }
]);
