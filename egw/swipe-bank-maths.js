/* ==========================================================
   EGW's GCSE HQ: swipe deck cards: Maths (Edexcel 1MA1 Foundation)
   40 quick true or false fact cards. Each links to the activity
   chunk that teaches it: [activity id, chunk number].
   ========================================================== */
window.EGWSWIPE = (window.EGWSWIPE || []).concat([

  /* ---------- maths-number ---------- */
  { s: "maths", t: "In 3 + 4 &times; 5 you multiply first, so the answer is 23.", a: true,
    fix: "Yes. BIDMAS: 4 &times; 5 = 20, then 3 + 20 = 23. Going left to right gives 35, which is the classic slip.", link: ["maths-number", 1] },
  { s: "maths", t: "0.25 is bigger than 0.3, because 25 is bigger than 3.", a: false,
    fix: "False. 0.3 = 0.30, which is bigger than 0.25. Compare the tenths first: 3 tenths beats 2 tenths.", link: ["maths-number", 1] },
  { s: "maths", t: "A prime number has exactly two factors.", a: true,
    fix: "Yes: 1 and itself. That is why 1 is not prime: it only has one factor.", link: ["maths-number", 3] },
  { s: "maths", t: "1/3 + 1/4 = 2/7", a: false,
    fix: "False. Never add the bottoms. Use a common denominator: 4/12 + 3/12 = 7/12.", link: ["maths-number", 7] },
  { s: "maths", t: "Multiplying a number always makes it bigger.", a: false,
    fix: "False. The word \"always\" is the trap. Multiplying by something between 0 and 1 makes it smaller: 8 &times; &frac12; = 4.", link: ["maths-number", 7] },

  /* ---------- maths-money ---------- */
  { s: "maths", t: "To increase an amount by 5%, multiply it by 1.5.", a: false,
    fix: "False. 5% is 0.05, so the multiplier is 1.05. Multiplying by 1.5 is a 50% increase.", link: ["maths-money", 2] },
  { s: "maths", t: "Percentage change = change &divide; original amount &times; 100.", a: true,
    fix: "Yes. Always divide by the amount you started with, not the new amount. Profit and loss work the same way.", link: ["maths-money", 3] },
  { s: "maths", t: "Jay shares 15 treats between Bonnie and another dog in the ratio 2 : 3. Bonnie gets 6.", a: true,
    fix: "Yes. 2 + 3 = 5 parts, so one part is 15 &divide; 5 = 3 treats. Bonnie gets 2 &times; 3 = 6, the other dog gets 9.", link: ["maths-money", 4] },
  { s: "maths", t: "After a 20% rise a coat costs &pound;60. Take 20% off &pound;60 to find the old price.", a: false,
    fix: "False. Divide by the multiplier: &pound;60 &divide; 1.2 = &pound;50. Taking 20% off &pound;60 gives &pound;48, because 20% of &pound;60 is bigger than 20% of &pound;50.", link: ["maths-money", 6] },

  /* ---------- maths-algebra ---------- */
  { s: "maths", t: "3a + 2b simplifies to 5ab.", a: false,
    fix: "False. 3a and 2b are unlike terms, so they cannot be collected. 3a + 2b is already as simple as it gets.", link: ["maths-algebra", 2] },
  { s: "maths", t: "3(x + 4) = 3x + 4", a: false,
    fix: "False. Multiply everything inside the bracket by 3: 3(x + 4) = 3x + 12.", link: ["maths-algebra", 2] },
  { s: "maths", t: "To solve 2x + 3 = 11, you could take 3 from both sides first.", a: true,
    fix: "Yes. Undo the adding first: 2x = 8. Then divide by 2: x = 4. Check: 2 &times; 4 + 3 = 11.", link: ["maths-algebra", 3] },
  { s: "maths", t: "On a number line, x &gt; 3 is shown with an open circle at 3.", a: true,
    fix: "Yes. Open circle: 3 is not included. A filled in circle means the end number counts, as in x &ge; 3.", link: ["maths-algebra", 5] },

  /* ---------- maths-simultaneous ---------- */
  { s: "maths", t: "A length is 8 cm to the nearest cm. Its error interval is 7.5 &le; L &lt; 8.5.", a: true,
    fix: "Yes. Go half a unit down and half a unit up. The top end uses &lt;, because 8.5 would round up to 9.", link: ["maths-simultaneous", 1] },
  { s: "maths", t: "Truncating 7.89 to 1 decimal place gives 7.9.", a: false,
    fix: "False. Truncating means chopping off the extra digits, so 7.89 becomes 7.8. Rounding would give 7.9.", link: ["maths-simultaneous", 2] },
  { s: "maths", t: "A cafe has 3 starters and 4 mains, so there are 7 possible two course meals.", a: false,
    fix: "False. Each starter can go with 4 mains, so 3 &times; 4 = 12 meals. Multiply the options; do not add them.", link: ["maths-simultaneous", 3] },
  { s: "maths", t: "For 2x + 3y = 12 and 5x &minus; 3y = 9, add the equations to remove y.", a: true,
    fix: "Yes. Different signs: add. 3y and &minus;3y cancel, leaving 7x = 21, so x = 3 and then y = 2.", link: ["maths-simultaneous", 4] },

  /* ---------- maths-graphs ---------- */
  { s: "maths", t: "4, 7, 10, 13 goes up in 3s, so its nth term is n + 3.", a: false,
    fix: "False. Going up in 3s means 3n. The zero term is 1, so it is 3n + 1. Check n = 1: 3 + 1 = 4.", link: ["maths-graphs", 1] },
  { s: "maths", t: "The point (2, 5) is 2 across and 5 up.", a: true,
    fix: "Yes. x comes first, then y, like a before b in the alphabet.", link: ["maths-graphs", 3] },
  { s: "maths", t: "The line y = 4 goes straight up and down.", a: false,
    fix: "False. y = 4 is flat across: every point on it has a y coordinate of 4. It is x = 4 that goes straight up and down.", link: ["maths-graphs", 4] },
  { s: "maths", t: "The line y = 3x &minus; 1 has gradient 3 and crosses the y axis at &minus;1.", a: true,
    fix: "Yes. In y = mx + c, m is the gradient and c is where the line cuts the y axis.", link: ["maths-graphs", 5] },

  /* ---------- maths-angles ---------- */
  { s: "maths", t: "The angles in a quadrilateral add up to 180&deg;.", a: false,
    fix: "False. They add up to 360&deg;. A quadrilateral splits into two triangles: 2 &times; 180&deg; = 360&deg;.", link: ["maths-angles", 1] },
  { s: "maths", t: "Alternate angles on parallel lines add up to 180&deg;.", a: false,
    fix: "False. Alternate angles (the Z shape) are equal. It is co interior angles (the C shape) that add up to 180&deg;.", link: ["maths-angles", 2] },
  { s: "maths", t: "A parallelogram has two lines of symmetry.", a: false,
    fix: "False. It has no lines of symmetry: fold it either way and the halves never match. It does have rotational symmetry of order 2.", link: ["maths-angles", 3] },
  { s: "maths", t: "The exterior angles of a polygon add up to 360&deg;.", a: true,
    fix: "Yes. So each exterior angle of a regular hexagon is 360 &divide; 6 = 60&deg;, and each interior angle is 180 &minus; 60 = 120&deg;.", link: ["maths-angles", 4] },
  { s: "maths", t: "Bearings are measured clockwise from North and written with three figures.", a: true,
    fix: "Yes. So a bearing of 45&deg; is written 045&deg;. Stand at the place after the word \"from\", face North and turn clockwise.", link: ["maths-angles", 5] },

  /* ---------- maths-construct ---------- */
  { s: "maths", t: "Two triangles with the same three angles must be congruent.", a: false,
    fix: "False. AAA is not enough: one could be a bigger copy of the other, so they are similar. For congruence you need SSS, SAS, ASA or RHS.", link: ["maths-construct", 1] },
  { s: "maths", t: "When a shape is enlarged to make a similar shape, the angles stay the same.", a: true,
    fix: "Yes. Only the lengths change, all by the same scale factor. Matching angles are equal.", link: ["maths-construct", 2] },
  { s: "maths", t: "On a 1 : 50 000 map, 2 cm on the map is 1 km in real life.", a: true,
    fix: "Yes. 2 &times; 50 000 = 100 000 cm, which is 1000 m, which is 1 km.", link: ["maths-construct", 3] },
  { s: "maths", t: "A plan is the view of a 3D shape from the front.", a: false,
    fix: "False. A plan is the view from above, like one of Jay's birds looking down. Views from the front and side are elevations.", link: ["maths-construct", 6] },

  /* ---------- maths-measures ---------- */
  { s: "maths", t: "The area of a triangle is base &times; height.", a: false,
    fix: "False. It is half of base &times; height. A triangle is half of a rectangle with the same base and height.", link: ["maths-measures", 1] },
  { s: "maths", t: "Double the length and the width of a rectangle, and its area doubles too.", a: false,
    fix: "False. The area becomes four times as big, because 2 &times; 2 = 4. A 3 by 4 rectangle (12) becomes 6 by 8 (48).", link: ["maths-measures", 1] },
  { s: "maths", t: "The volume of a cuboid is length &times; width &times; height.", a: true,
    fix: "Yes, and the units are cubed, such as cm&sup3;. Area and surface area use squared units, such as cm&sup2;.", link: ["maths-measures", 3] },
  { s: "maths", t: "Hypotenuse 10 cm, another side 6 cm: the third side of this right angled triangle is 11.7 cm.", a: false,
    fix: "False. That adds the squares. For a shorter side, subtract: 10&sup2; &minus; 6&sup2; = 64, and &radic;64 = 8 cm. The hypotenuse is always the longest side.", link: ["maths-measures", 5] },
  { s: "maths", t: "In SOH CAH TOA, tan &theta; = opposite &divide; adjacent.", a: true,
    fix: "Yes. sin = opposite &divide; hypotenuse, cos = adjacent &divide; hypotenuse, tan = opposite &divide; adjacent. Check the calculator is in degrees.", link: ["maths-measures", 6] },

  /* ---------- maths-probability ---------- */
  { s: "maths", t: "A fair coin lands on heads 5 times in a row, so tails is now more likely.", a: false,
    fix: "False. The coin has no memory. Each flip is independent, so the probability of tails is still &frac12;.", link: ["maths-probability", 1] },
  { s: "maths", t: "If the probability of rain is 0.3, the probability of no rain is 0.7.", a: true,
    fix: "Yes. All the outcomes add up to 1, so P(not rain) = 1 &minus; 0.3 = 0.7.", link: ["maths-probability", 2] },
  { s: "maths", t: "Rolling two ordinary dice gives 12 possible outcomes.", a: false,
    fix: "False. Each of the 6 outcomes on one dice pairs with 6 on the other: 6 &times; 6 = 36. A sample space grid shows them all.", link: ["maths-probability", 3] },
  { s: "maths", t: "On a tree diagram, you multiply the probabilities along the branches.", a: true,
    fix: "Yes. Along the branches: multiply. Then add the results of different routes that give the outcome you want.", link: ["maths-probability", 7] },

  /* ---------- averages (taught in Statistics) ---------- */
  { s: "maths", t: "The median of 7, 2, 9, 4, 5 is 9, because 9 is in the middle.", a: false,
    fix: "False. Put the numbers in order first: 2, 4, 5, 7, 9, so the median is 5. The mean is different: 27 &divide; 5 = 5.4.", link: ["stats-averages", 1] }
]);
