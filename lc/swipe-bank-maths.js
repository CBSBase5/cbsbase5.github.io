/* ==========================================================
   LC's Night Shift HQ: swipe deck cards: Maths
   (Maths Foundation 2 to 3, built from Jay's baselines, no exam)
   40 quick true or false fact cards. Each links to the activity
   chunk that teaches it: [activity id, chunk number].
   ========================================================== */
window.EGWSWIPE = (window.EGWSWIPE || []).concat([

  /* ---------- place-value ---------- */
  { s: "maths", t: "In 352, the 5 is worth 50.", a: true,
    fix: "Yes. The 5 is in the tens place. 5 tens make 50.", link: ["place-value", 1] },
  { s: "maths", t: "Four thousand and six is written 406.", a: false,
    fix: "False. It is 4006. Thousands need four digits. The zeros hold the hundreds and the tens.", link: ["place-value", 2] },
  { s: "maths", t: "300, 40 and 7 are the parts of 347.", a: true,
    fix: "Yes. 300 + 40 + 7 = 347. The parts add up to the whole.", link: ["place-value", 3] },
  { s: "maths", t: "With the cards 3, 9 and 1, the biggest number is 391.", a: false,
    fix: "False. Put the biggest digit first. The biggest number is 931.", link: ["place-value", 4] },
  { s: "maths", t: "Locker 609 has a bigger number than locker 690.", a: false,
    fix: "False. The hundreds match. Then look at the tens: 9 tens beats 0 tens. So 690 is bigger.", link: ["place-value", 5] },
  { s: "maths", t: "0 to 100 in 10 equal steps means each step is 10.", a: true,
    fix: "Yes. 100 shared into 10 steps is 10 each. Find one step first, then count.", link: ["place-value", 6] },
  { s: "maths", t: "84 rounds up to 90, to the nearest 10.", a: false,
    fix: "False. 84 is nearer to 80. The ones digit is 4, and 4 or less rounds down.", link: ["place-value", 7] },

  /* ---------- add-subtract ---------- */
  { s: "maths", t: "6 and 4 make 10, so 60 and 40 make 100.", a: true,
    fix: "Yes. Bonds to 10 help with bonds to 100. 6 tens and 4 tens make 10 tens.", link: ["add-subtract", 1] },
  { s: "maths", t: "To add 9 quickly, add 10 and then add 1 more.", a: false,
    fix: "False. Adding 10 is 1 too many, so take 1 away. 56 + 9: 56 + 10 = 66, then 65.", link: ["add-subtract", 2] },
  { s: "maths", t: "In column adding, you start with the hundreds on the left.", a: false,
    fix: "False. Start on the right, with the ones. Then any carry goes into the next column.", link: ["add-subtract", 3] },
  { s: "maths", t: "52 &minus; 17: in the ones, you do 7 &minus; 2.", a: false,
    fix: "False. That swaps the digits round. Exchange a ten instead: 12 &minus; 7 = 5. The answer is 35.", link: ["add-subtract", 4] },
  { s: "maths", t: "In 25 + what = 60, the missing number is 35.", a: true,
    fix: "Yes. Whole take away a part: 60 &minus; 25 = 35.", link: ["add-subtract", 5] },
  { s: "maths", t: "You can check a take away sum by adding.", a: true,
    fix: "Yes. Adding undoes taking away. 70 &minus; 30 = 40, and 40 + 30 = 70.", link: ["add-subtract", 6] },
  { s: "maths", t: "In a story, the word left usually means add.", a: false,
    fix: "False. Left usually means take away. Altogether and total usually mean add.", link: ["add-subtract", 7] },

  /* ---------- times-divide ---------- */
  { s: "maths", t: "3 groups of 5 is the same as 5 groups of 3.", a: true,
    fix: "Yes. You can times in any order. Both make 15.", link: ["times-divide", 1] },
  { s: "maths", t: "Every multiple of 5 ends in 5 or 0.", a: true,
    fix: "Yes. Count in 5s: 5, 10, 15, 20, 25. The last digit is always 5 or 0.", link: ["times-divide", 2] },
  { s: "maths", t: "4 &times; 7 = 24.", a: false,
    fix: "False. 4 &times; 7 = 28. Double the 2s: 2 &times; 7 = 14, and double 14 is 28.", link: ["times-divide", 3] },
  { s: "maths", t: "Double 36 is 62.", a: false,
    fix: "False. Double 30 is 60. Double 6 is 12. 60 + 12 = 72.", link: ["times-divide", 4] },
  { s: "maths", t: "Share 15 cupcakes into 3 boxes, and each box gets 5.", a: true,
    fix: "Yes. 15 &divide; 3 = 5. Check: 3 &times; 5 = 15.", link: ["times-divide", 5] },
  { s: "maths", t: "A remainder can be bigger than the number of boxes.", a: false,
    fix: "False. The remainder is always smaller. If it was bigger, every box could have one more.", link: ["times-divide", 6] },
  { s: "maths", t: "In a story, share and split often mean divide.", a: true,
    fix: "Yes. You split a total into equal groups. Rows of and lots of often mean times.", link: ["times-divide", 7] },

  /* ---------- measures ---------- */
  { s: "maths", t: "1 litre is the same as 100 ml.", a: false,
    fix: "False. 1 litre is 1000 ml. Ten cups of 100 ml fill a 1 litre bottle.", link: ["measures", 1] },
  { s: "maths", t: "Before you read a scale, find what one gap is worth.", a: true,
    fix: "Yes. Gaps can go up in 2s, 5s, 10s or 100s. Find one gap, then count on.", link: ["measures", 2] },
  { s: "maths", t: "To read a jug, get your eyes level with the water.", a: true,
    fix: "Yes. Put the jug on a flat table and get down low. Looking from above can trick you.", link: ["measures", 3] },
  { s: "maths", t: "1 kg is the same as 1000 g.", a: true,
    fix: "Yes. Kilo means 1000. So 1 kilogram is 1000 grams.", link: ["measures", 4] },
  { s: "maths", t: "Line a candle up with 1 on the ruler to measure it.", a: false,
    fix: "False. Line it up with 0. Starting at 1 makes it look 1 cm longer than it is.", link: ["measures", 5] },
  { s: "maths", t: "900 g is heavier than 1 kg.", a: false,
    fix: "False. 1 kg is 1000 g, and 1000 g is more than 900 g. Make the units the same first.", link: ["measures", 6] },
  { s: "maths", t: "Pudding for 4 uses 250 ml milk. For 8, use 500 ml.", a: true,
    fix: "Yes. 8 people is double 4 people. Double 250 ml is 500 ml.", link: ["measures", 7] },

  /* ---------- money-time ---------- */
  { s: "maths", t: "3 pounds and 5 pence is written &pound;3.5.", a: false,
    fix: "False. It is &pound;3.05. After the dot there are always two numbers. &pound;3.50 is 3 pounds and 50 pence.", link: ["money-time", 1] },
  { s: "maths", t: "&pound;1.50 and &pound;1.20 make &pound;2.70.", a: true,
    fix: "Yes. &pound;1 and &pound;1 make &pound;2. 50p and 20p make 70p. So &pound;2.70.", link: ["money-time", 2] },
  { s: "maths", t: "A &pound;3.70 pudding paid with &pound;5 gives &pound;1.30 change.", a: true,
    fix: "Yes. &pound;3.70 to &pound;4 is 30p. &pound;4 to &pound;5 is &pound;1. So &pound;1.30.", link: ["money-time", 3] },
  { s: "maths", t: "When the long hand points to 6, it is half past.", a: true,
    fix: "Yes. The long hand has gone half way round. Half past is 30 minutes past the hour.", link: ["money-time", 4] },
  { s: "maths", t: "The night bus leaves at quarter to 8. That is 8:45.", a: false,
    fix: "False. Quarter to 8 is 15 minutes before 8. That is 45 minutes past 7, so 7:45.", link: ["money-time", 5] },
  { s: "maths", t: "A cafe open from 6pm to midnight is open for 5 hours.", a: false,
    fix: "False. Count on from 6: 7, 8, 9, 10, 11, 12. That is 6 hours. Midnight is 12 o'clock.", link: ["money-time", 7] },

  /* ---------- charts-shapes ---------- */
  { s: "maths", t: "In a tally, each gate stands for 4.", a: false,
    fix: "False. A gate is 4 lines with a fifth line across. So each gate is 5. Count gates in 5s.", link: ["charts-shapes", 1] },
  { s: "maths", t: "To read a bar, look across from its top to the scale.", a: true,
    fix: "Yes. And check what the scale goes up in. It might be 1s, 2s, 5s or 10s.", link: ["charts-shapes", 3] },
  { s: "maths", t: "A pentagon has 6 sides.", a: false,
    fix: "False. Pent is 5, so a pentagon has 5 sides. Hex is 6, so a hexagon has 6.", link: ["charts-shapes", 4] },
  { s: "maths", t: "A cube has 8 vertices.", a: true,
    fix: "Yes. A vertex is a corner. A cube has 8 corners, 6 faces and 12 edges.", link: ["charts-shapes", 5] },
  { s: "maths", t: "A rectangle has 4 lines of symmetry.", a: false,
    fix: "False. A rectangle has 2. Fold it corner to corner and the halves do not match. A square has 4.", link: ["charts-shapes", 6] },
  { s: "maths", t: "An obtuse angle is bigger than a right angle.", a: true,
    fix: "Yes. Obtuse is bigger than a square corner. Acute is smaller.", link: ["charts-shapes", 7] }
]);
