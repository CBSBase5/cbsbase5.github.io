/* ==========================================================
   EGW's GCSE HQ - daily drop question bank: Maths (Edexcel 1MA1 Foundation)
   32 quick questions, one or two minutes each. Each links to the
   activity chunk that teaches the skill: [activity id, chunk number].
   ========================================================== */
window.EGWDAILY = (window.EGWDAILY || []).concat([

  /* ---------- maths-number ---------- */
  { s: "maths", type: "mc", q: "Work out 3 + 4 &times; 5 &minus; 2.",
    options: ["21", "33", "15", "25"], answer: 0,
    hint: "BIDMAS: multiplication comes before adding and subtracting.",
    why: "Multiply first: 4 &times; 5 = 20. Then 3 + 20 &minus; 2 = <b>21</b>. Working left to right gives 7 &times; 5 &minus; 2 = 33, which is the classic slip.",
    link: ["maths-number", 1] },

  { s: "maths", type: "num", q: "Round 0.04718 to 2 significant figures.",
    boxes: [{ label: "Answer", a: 0.047, tol: 0.0000001, pre: "", post: "" }],
    hint: "Zeros at the front do not count. Start counting at the first digit that is not zero.",
    why: "The first significant figure is the 4, the second is the 7. The next digit is 1, so round down: <b>0.047</b>. Leading zeros hold the place but are never significant.",
    link: ["maths-number", 2] },

  { s: "maths", type: "num", q: "One bus leaves the station every 12 minutes and another every 18 minutes. They both leave at 9 am. How many minutes until they next leave together?",
    boxes: [{ label: "Minutes", a: 36, tol: 0.01, pre: "", post: "minutes" }],
    hint: "You want the lowest common multiple of 12 and 18. List the multiples of each.",
    why: "Multiples of 12: 12, 24, <b>36</b>. Multiples of 18: 18, <b>36</b>. The LCM is 36, so they leave together again after <b>36 minutes</b>, at 9:36 am.",
    link: ["maths-number", 4] },

  { s: "maths", type: "num", q: "Write 0.00052 in standard form, A &times; 10<sup>n</sup>.",
    boxes: [{ label: "A", a: 5.2, tol: 0.0001, pre: "", post: "" }, { label: "n", a: -4, tol: 0.0001, pre: "", post: "" }],
    hint: "A must be at least 1 and less than 10. Small numbers have a negative power.",
    why: "A = 5.2. To get from 5.2 to 0.00052 the digits move 4 places to the right, so it is 5.2 &times; 10<sup>&minus;4</sup>: <b>n = &minus;4</b>.",
    link: ["maths-number", 6] },

  { s: "maths", type: "mc", q: "Work out 2/5 + 1/3.",
    options: ["11/15", "3/8", "3/15", "2/15"], answer: 0,
    hint: "Find a common denominator: a number that both 5 and 3 go into.",
    why: "Use fifteenths: 2/5 = 6/15 and 1/3 = 5/15, so the total is <b>11/15</b>. Adding tops and bottoms (3/8) is the slip to avoid.",
    link: ["maths-number", 7] },

  /* ---------- maths-money ---------- */
  { s: "maths", type: "num", q: "Without a calculator, work out 35% of &pound;60.",
    boxes: [{ label: "35% of &pound;60", a: 21, tol: 0.001, pre: "&pound;", post: "" }],
    hint: "Find 10% first, then build 35% from 10% and 5% pieces.",
    why: "10% = &pound;6, so 30% = &pound;18. 5% is half of 10%, &pound;3. 35% = 18 + 3 = <b>&pound;21</b>.",
    link: ["maths-money", 1] },

  { s: "maths", type: "mc", q: "Which multiplier increases an amount by 4%?",
    options: ["1.04", "1.4", "0.04", "0.96"], answer: 0,
    hint: "Start from 100%, add the increase, then change that percentage to a decimal.",
    why: "100% + 4% = 104% = <b>1.04</b>. 1.4 would be a 40% increase, and 0.96 is a 4% decrease.",
    link: ["maths-money", 2] },

  { s: "maths", type: "num", q: "A bike goes up in price from &pound;250 to &pound;290. Work out the percentage increase.",
    boxes: [{ label: "Percentage increase", a: 16, tol: 0.01, pre: "", post: "%" }],
    hint: "Find the change first, then divide by the ORIGINAL price.",
    why: "Change = 290 &minus; 250 = 40. Percentage change = 40 &divide; 250 &times; 100 = <b>16%</b>. Always divide by the original amount, not the new one.",
    link: ["maths-money", 3] },

  { s: "maths", type: "num", q: "Jay shares 84 dog biscuits between Bonnie and the dog next door in the ratio 3 : 4. Bonnie gets the smaller share. How many biscuits does the dog next door get?",
    boxes: [{ label: "Larger share", a: 48, tol: 0.01, pre: "", post: "biscuits" }],
    hint: "Add the ratio parts to find how many parts there are, then find one part.",
    why: "3 + 4 = 7 parts. 84 &divide; 7 = 12 biscuits per part. The larger share is 4 &times; 12 = <b>48</b> (and Bonnie gets 36).",
    link: ["maths-money", 4] },

  /* ---------- maths-algebra ---------- */
  { s: "maths", type: "num", q: "Expand and simplify 3(x + 4) + 2(x &minus; 1). Write it in the form ax + b.",
    boxes: [{ label: "a", a: 5, tol: 0.0001, pre: "", post: "" }, { label: "b", a: 10, tol: 0.0001, pre: "", post: "" }],
    hint: "Multiply everything inside each bracket by the number outside, then collect the x terms and the numbers.",
    why: "3x + 12 + 2x &minus; 2 = <b>5x + 10</b>. Watch the sign: 2 &times; &minus;1 = &minus;2.",
    link: ["maths-algebra", 2] },

  { s: "maths", type: "num", q: "Solve 5x &minus; 7 = 18.",
    boxes: [{ label: "x =", a: 5, tol: 0.0001, pre: "", post: "" }],
    hint: "Undo the &minus;7 first, then undo the &times;5. Do the same to both sides.",
    why: "Add 7 to both sides: 5x = 25. Divide both sides by 5: <b>x = 5</b>. Check: 5 &times; 5 &minus; 7 = 18.",
    link: ["maths-algebra", 3] },

  { s: "maths", type: "num", q: "I think of a number. I multiply it by 4, then subtract 3. The answer is 25. What was my number?",
    boxes: [{ label: "My number", a: 7, tol: 0.0001, pre: "", post: "" }],
    hint: "Call the number n and write the words as an equation, or work backwards from 25.",
    why: "4n &minus; 3 = 25, so 4n = 28 and <b>n = 7</b>. Working backwards does the same: 25 + 3 = 28, then 28 &divide; 4 = 7.",
    link: ["maths-algebra", 4] },

  { s: "maths", type: "mc", q: "n is an integer and &minus;2 &lt; n &le; 2. Which list shows every value n could be?",
    options: ["&minus;1, 0, 1, 2", "&minus;2, &minus;1, 0, 1, 2", "&minus;2, &minus;1, 0, 1", "&minus;1, 0, 1"], answer: 0,
    hint: "&lt; means the end number is NOT included. &le; means it is.",
    why: "&minus;2 &lt; n rules out &minus;2, and n &le; 2 lets 2 in. So n is <b>&minus;1, 0, 1, 2</b>. Integers include zero and negatives.",
    link: ["maths-algebra", 5] },

  /* ---------- maths-simultaneous ---------- */
  { s: "maths", type: "num", q: "A length is 6.4 cm, rounded to 1 decimal place. Write down the error interval: the smallest value it could be, and the value it must be less than.",
    boxes: [{ label: "Lower bound", a: 6.35, tol: 0.0001, pre: "", post: "cm" }, { label: "Upper bound", a: 6.45, tol: 0.0001, pre: "", post: "cm" }],
    hint: "Rounding to 1 decimal place means the real value is within half of 0.1 either side.",
    why: "Half of 0.1 is 0.05, so 6.4 &minus; 0.05 = <b>6.35</b> and 6.4 + 0.05 = <b>6.45</b>. The interval is 6.35 &le; length &lt; 6.45, because 6.45 itself would round up to 6.5.",
    link: ["maths-simultaneous", 1] },

  { s: "maths", type: "num", q: "Truncate 8.379 to 1 decimal place.",
    boxes: [{ label: "Answer", a: 8.3, tol: 0.0001, pre: "", post: "" }],
    hint: "Truncating means chopping off the extra digits. No rounding up.",
    why: "Keep one decimal place and chop the rest: <b>8.3</b>. Rounding would give 8.4, but truncating never rounds up.",
    link: ["maths-simultaneous", 2] },

  { s: "maths", type: "num", q: "At a cafe, 2 coffees and 1 cake cost &pound;7.10. 1 coffee and 1 cake cost &pound;4.30. Work out the cost of one coffee and of one cake.",
    boxes: [{ label: "One coffee", a: 2.8, tol: 0.001, pre: "&pound;", post: "" }, { label: "One cake", a: 1.5, tol: 0.001, pre: "&pound;", post: "" }],
    hint: "The two orders differ by exactly one coffee. What does that tell you?",
    why: "2c + k = 7.10 and c + k = 4.30. Subtract: c = <b>&pound;2.80</b>. Then k = 4.30 &minus; 2.80 = <b>&pound;1.50</b>. Check: 2 &times; 2.80 + 1.50 = 7.10.",
    link: ["maths-simultaneous", 7] },

  /* ---------- maths-graphs ---------- */
  { s: "maths", type: "num", q: "Find the nth term of the sequence 5, 8, 11, 14, ... Write it in the form an + b.",
    boxes: [{ label: "a", a: 3, tol: 0.0001, pre: "", post: "" }, { label: "b", a: 2, tol: 0.0001, pre: "", post: "" }],
    hint: "The difference between terms gives the number in front of n. Then compare 3n with the sequence.",
    why: "It goes up by 3, so start with 3n: 3, 6, 9, 12. Each term is 2 more, so the nth term is <b>3n + 2</b>. Check: n = 1 gives 5.",
    link: ["maths-graphs", 1] },

  { s: "maths", type: "num", q: "Find the midpoint of the points (2, 5) and (8, &minus;1).",
    boxes: [{ label: "x coordinate", a: 5, tol: 0.0001, pre: "", post: "" }, { label: "y coordinate", a: 2, tol: 0.0001, pre: "", post: "" }],
    hint: "Midpoint: add the two x values and halve, then add the two y values and halve.",
    why: "x: (2 + 8) &divide; 2 = 5. y: (5 + &minus;1) &divide; 2 = 4 &divide; 2 = 2. The midpoint is <b>(5, 2)</b>.",
    link: ["maths-graphs", 3] },

  { s: "maths", type: "mc", q: "What is the gradient of the line y = 4 &minus; 2x?",
    options: ["&minus;2", "4", "2", "&minus;4"], answer: 0,
    hint: "In y = mx + c, the gradient is the number multiplying x, sign and all.",
    why: "y = 4 &minus; 2x is the same as y = &minus;2x + 4, so m = <b>&minus;2</b> and the line slopes downwards. The 4 is the y intercept, not the gradient.",
    link: ["maths-graphs", 5] },

  /* ---------- maths-angles ---------- */
  { s: "maths", type: "num", q: "Two angles in a triangle are 48&deg; and 75&deg;. Work out the third angle.",
    boxes: [{ label: "Third angle", a: 57, tol: 0.01, pre: "", post: "&deg;" }],
    hint: "Angles in a triangle add up to 180&deg;.",
    why: "48 + 75 = 123, and 180 &minus; 123 = <b>57&deg;</b>. Reason: angles in a triangle add up to 180&deg;.",
    link: ["maths-angles", 1] },

  { s: "maths", type: "mc", q: "Two parallel lines are crossed by another line. What is true about a pair of alternate angles?",
    options: ["They are equal", "They add up to 180&deg;", "They add up to 360&deg;", "They add up to 90&deg;"], answer: 0,
    hint: "Alternate angles make a Z shape.",
    why: "Alternate angles (the Z shape) are <b>equal</b>. It is co interior angles (the C shape) that add up to 180&deg;.",
    link: ["maths-angles", 2] },

  { s: "maths", type: "num", q: "Each exterior angle of a regular polygon is 24&deg;. How many sides does it have?",
    boxes: [{ label: "Number of sides", a: 15, tol: 0.01, pre: "", post: "" }],
    hint: "The exterior angles of any polygon add up to 360&deg;.",
    why: "Number of sides = 360 &divide; exterior angle = 360 &divide; 24 = <b>15</b>.",
    link: ["maths-angles", 4] },

  { s: "maths", type: "num", q: "The point (5, 1) is translated 4 squares to the left and 2 squares up. Where does it end up?",
    boxes: [{ label: "x coordinate", a: 1, tol: 0.0001, pre: "", post: "" }, { label: "y coordinate", a: 3, tol: 0.0001, pre: "", post: "" }],
    hint: "Left and right change the x coordinate. Up and down change the y coordinate.",
    why: "x: 5 &minus; 4 = 1. y: 1 + 2 = 3. The new point is <b>(1, 3)</b>. As a column vector, this translation is &minus;4 on top and 2 underneath.",
    link: ["maths-angles", 6] },

  /* ---------- maths-construct ---------- */
  { s: "maths", type: "num", q: "Two rectangles are similar. The small one is 4 cm by 6 cm. The short side of the large one is 10 cm. How long is its long side?",
    boxes: [{ label: "Long side", a: 15, tol: 0.01, pre: "", post: "cm" }],
    hint: "Find the scale factor from the two short sides, then use it on the long side.",
    why: "Scale factor = 10 &divide; 4 = 2.5. Long side = 6 &times; 2.5 = <b>15 cm</b>. Adding 6 cm to each side is the trap: similar means multiply, not add.",
    link: ["maths-construct", 2] },

  { s: "maths", type: "num", q: "A map has a scale of 1 : 50 000. Two villages are 6 cm apart on the map. How far apart are they in real life, in kilometres?",
    boxes: [{ label: "Real distance", a: 3, tol: 0.0001, pre: "", post: "km" }],
    hint: "Multiply by 50 000 to get centimetres. There are 100 000 cm in a kilometre.",
    why: "6 &times; 50 000 = 300 000 cm. 300 000 &divide; 100 000 = <b>3 km</b> (100 cm in a metre, 1000 m in a kilometre).",
    link: ["maths-construct", 3] },

  { s: "maths", type: "num", q: "a is the column vector with 3 on top and &minus;2 underneath. b is the column vector with &minus;1 on top and 5 underneath. Work out a + 2b.",
    boxes: [{ label: "Top number", a: 1, tol: 0.0001, pre: "", post: "" }, { label: "Bottom number", a: 8, tol: 0.0001, pre: "", post: "" }],
    hint: "Double each number in b first, then add the top numbers together and the bottom numbers together.",
    why: "2b has &minus;2 on top and 10 underneath. Top: 3 + &minus;2 = <b>1</b>. Bottom: &minus;2 + 10 = <b>8</b>.",
    link: ["maths-construct", 7] },

  /* ---------- maths-measures ---------- */
  { s: "maths", type: "num", q: "A circle has a radius of 5 cm. Work out its area. Give your answer to 1 decimal place.",
    boxes: [{ label: "Area", a: 78.5, tol: 0.05, pre: "", post: "cm&sup2;" }],
    hint: "Area of a circle = &pi; &times; radius squared. Square the radius before multiplying by &pi;.",
    why: "&pi; &times; 5&sup2; = &pi; &times; 25 = 78.539... = <b>78.5 cm&sup2;</b>. Using the diameter instead gives 314.2, a common slip.",
    link: ["maths-measures", 2] },

  { s: "maths", type: "num", q: "A car travels 135 miles in 2 hours 15 minutes. Work out its average speed in miles per hour.",
    boxes: [{ label: "Average speed", a: 60, tol: 0.01, pre: "", post: "mph" }],
    hint: "Speed = distance &divide; time, with the time in hours. 15 minutes is a quarter of an hour.",
    why: "2 hours 15 minutes = 2.25 hours. 135 &divide; 2.25 = <b>60 mph</b>. Typing 2.15 for the time is the classic slip.",
    link: ["maths-measures", 4] },

  { s: "maths", type: "num", q: "A right angled triangle has shorter sides of 9 cm and 12 cm. Work out the length of the longest side.",
    boxes: [{ label: "Hypotenuse", a: 15, tol: 0.01, pre: "", post: "cm" }],
    hint: "Pythagoras: square the two shorter sides, add, then square root.",
    why: "9&sup2; + 12&sup2; = 81 + 144 = 225, and &radic;225 = <b>15 cm</b>. For the longest side you add the squares; for a shorter side you subtract.",
    link: ["maths-measures", 5] },

  /* ---------- maths-probability ---------- */
  { s: "maths", type: "num", q: "A bag holds only red, blue and green counters. P(red) = 0.35 and P(blue) = 0.4. Work out P(green).",
    boxes: [{ label: "P(green)", a: 0.25, tol: 0.0001, pre: "", post: "" }],
    hint: "The probabilities of all the possible outcomes add up to 1.",
    why: "0.35 + 0.4 = 0.75, and 1 &minus; 0.75 = <b>0.25</b>.",
    link: ["maths-probability", 2] },

  { s: "maths", type: "mc", q: "Two fair six sided dice are rolled and the scores are added. What is the probability of a total of 7?",
    options: ["1/6", "1/12", "7/36", "1/11"], answer: 0,
    hint: "A sample space grid has 6 &times; 6 = 36 outcomes. How many of them add to 7?",
    why: "Six pairs make 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). So P = 6/36 = <b>1/6</b>. There are 11 possible totals, but they are not equally likely, so 1/11 is wrong.",
    link: ["maths-probability", 3] },

  { s: "maths", type: "num", q: "Jay keeps count at a bird feeder. Of the last 50 birds, 18 were robins. Estimate the probability that the next bird is a robin, then how many robins Jay could expect in the next 400 birds.",
    boxes: [{ label: "Estimated probability", a: 0.36, tol: 0.0001, pre: "", post: "" }, { label: "Expected robins in 400 birds", a: 144, tol: 0.01, pre: "", post: "" }],
    hint: "Relative frequency = how many times it happened &divide; total number of goes. Then multiply by 400.",
    why: "18 &divide; 50 = <b>0.36</b>. Expected number = 0.36 &times; 400 = <b>144</b>. It is an estimate: the more birds Jay counts, the more reliable it gets.",
    link: ["maths-probability", 4] }
]);
