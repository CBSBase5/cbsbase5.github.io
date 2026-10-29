/* ==========================================================
   LW's Skills HQ: daily drop question bank: Maths
   (Pearson Edexcel Functional Skills Mathematics, Level 1)
   32 quick everyday questions, one or two minutes each. Each links
   to the activity chunk that teaches the skill: [activity id, chunk number].
   ========================================================== */
window.EGWDAILY = (window.EGWDAILY || []).concat([

  /* ---------- number ---------- */
  { s: "maths", type: "num", q: "A football stadium holds <b>forty two thousand and seven</b> people. Write this number in figures.",
    boxes: [{ label: "In figures", a: 42007, tol: 0.01, pre: "", post: "" }],
    hint: "Write the thousands part first, then the rest. Empty columns still need a zero.",
    why: "Forty two thousand is 42,000. The seven goes in the ones column, with zeros holding the hundreds and tens: <b>42,007</b>. Writing 427 or 42,700 are the usual slips.",
    link: ["number", 1] },

  { s: "maths", type: "mc", q: "At 6 am the temperature is &minus;4&deg;C. By midday it has gone up by 9 degrees. What is the temperature at midday?",
    options: ["5&deg;C", "13&deg;C", "&minus;13&deg;C", "&minus;5&deg;C"], answer: 0,
    hint: "Count up to zero first, then carry on with what is left of the 9.",
    why: "From &minus;4 up to 0 is 4 degrees. That leaves 5 more of the 9, so it reaches <b>5&deg;C</b>. 13 comes from adding 4 and 9 and forgetting the minus.",
    link: ["number", 2] },

  { s: "maths", type: "num", q: "No calculator. A builder orders 1000 bricks at &pound;0.45 each. What is the total cost?",
    boxes: [{ label: "Total cost", a: 450, tol: 0.001, pre: "&pound;", post: "", show: "450.00" }],
    hint: "Times by 1000 moves every digit three places to the left.",
    why: "0.45 &times; 1000: the digits move three places left, giving 450. The bricks cost <b>&pound;450</b>. Sense check: about half a pound each, so about half of 1000 pounds.",
    link: ["number", 3] },

  { s: "maths", type: "num", q: "No calculator. A cinema screen has 18 rows with 24 seats in each row. How many seats is that altogether?",
    boxes: [{ label: "Seats", a: 432, tol: 0.01, pre: "", post: "seats" }],
    hint: "Split 18 into 10 and 8. Work out 24 &times; 10 and 24 &times; 8, then add.",
    why: "24 &times; 10 = 240 and 24 &times; 8 = 192. Then 240 + 192 = <b>432 seats</b>. Splitting a two digit number into easy pieces keeps it manageable without a calculator.",
    link: ["number", 5] },

  { s: "maths", type: "num", q: "A taxi firm uses this formula: <b>fare = &pound;3 + &pound;2 for each mile</b>. How much is a 7 mile journey?",
    boxes: [{ label: "Fare", a: 17, tol: 0.001, pre: "&pound;", post: "", show: "17.00" }],
    hint: "Do the per mile part first, then add the fixed &pound;3.",
    why: "7 miles &times; &pound;2 = &pound;14. Then add the &pound;3: 14 + 3 = <b>&pound;17</b>. Adding first, (3 + 2) &times; 7 = &pound;35, is the slip to avoid.",
    link: ["number", 7] },

  { s: "maths", type: "mc", q: "Estimate the cost of 31 cinema tickets at &pound;8.95 each.",
    options: ["About &pound;270", "About &pound;27", "About &pound;2700", "About &pound;240"], answer: 0,
    hint: "Round each number to something easy: 31 is close to 30, and &pound;8.95 is close to &pound;9.",
    why: "30 &times; &pound;9 = <b>about &pound;270</b>. The exact answer is &pound;277.45, so the estimate is close. &pound;240 comes from rounding &pound;8.95 down to &pound;8, which is the wrong way.",
    link: ["number", 8] },

  /* ---------- fdp ---------- */
  { s: "maths", type: "mc", q: "A pizza is cut into 8 equal slices. You eat 6 of them. What fraction of the pizza have you eaten, in its simplest form?",
    options: ["3/4", "2/3", "3/8", "1/6"], answer: 0,
    hint: "Write it as slices eaten over total slices, then divide the top and bottom by the same number.",
    why: "6 out of 8 is 6/8. Divide the top and bottom by 2: <b>3/4</b>. 3/8 halves the top but forgets to halve the bottom.",
    link: ["fdp", 1] },

  { s: "maths", type: "num", q: "A coat costs &pound;85. In the sale it has <b>2/5 off</b>. What is the sale price?",
    boxes: [{ label: "Sale price", a: 51, tol: 0.001, pre: "&pound;", post: "", show: "51.00" }],
    hint: "Find 2/5 of &pound;85 first: divide by the bottom, times by the top. Then take it off.",
    why: "85 &divide; 5 = 17, and 17 &times; 2 = &pound;34 off. The sale price is 85 &minus; 34 = <b>&pound;51</b>. Stopping at &pound;34 gives the saving, not the price.",
    link: ["fdp", 2] },

  { s: "maths", type: "num", q: "No calculator. A meal costs &pound;48. You leave a 15% tip. How much is the tip?",
    boxes: [{ label: "Tip", a: 7.2, tol: 0.001, pre: "&pound;", post: "", show: "7.20" }],
    hint: "Find 10% first, then 5% is half of that.",
    why: "10% of &pound;48 = &pound;4.80. 5% is half of that, &pound;2.40. So 15% = 4.80 + 2.40 = <b>&pound;7.20</b>. Money always gets two decimal places.",
    link: ["fdp", 4] },

  { s: "maths", type: "num", q: "You save &pound;800 in an account that pays <b>5% simple interest</b> a year. How much interest do you earn in 3 years?",
    boxes: [{ label: "Interest", a: 120, tol: 0.001, pre: "&pound;", post: "", show: "120.00" }],
    hint: "Simple interest is the same amount every year. Find one year's interest first.",
    why: "5% of &pound;800 = &pound;40 a year. Over 3 years: 40 &times; 3 = <b>&pound;120</b>. The account would then hold &pound;920, but the question asks for the interest only.",
    link: ["fdp", 5] },

  { s: "maths", type: "num", q: "Squash and water are mixed in the ratio <b>1 : 5</b>. You want 1.2 litres of drink altogether. How much squash do you need?",
    boxes: [{ label: "Squash", a: 200, tol: 0.01, pre: "", post: "ml" }],
    hint: "Change 1.2 litres to ml. Then add the parts of the ratio and find one part.",
    why: "1.2 litres = 1200 ml. There are 1 + 5 = 6 parts, so one part is 1200 &divide; 6 = <b>200 ml</b> of squash, with 1000 ml of water. Dividing by 5 forgets the squash's own part.",
    link: ["fdp", 7] },

  { s: "maths", type: "mc", q: "Washing up liquid comes in a 500 ml bottle for &pound;1.20 or a 750 ml bottle for &pound;1.65. Which is the better value?",
    options: ["The 750 ml bottle: 22p per 100 ml, against 24p", "The 500 ml bottle: 24p per 100 ml, against 22p", "The 500 ml bottle, because it costs less", "They are the same value"], answer: 0,
    hint: "Work out the cost of 100 ml for each bottle.",
    why: "500 ml is 5 lots of 100 ml: 120 &divide; 5 = 24p. 750 ml is 7.5 lots: 165 &divide; 7.5 = 22p. Lower cost per 100 ml wins, so <b>the 750 ml bottle</b> is better value. Cheaper overall is not the same as better value.",
    link: ["fdp", 8] },

  /* ---------- money-time ---------- */
  { s: "maths", type: "num", q: "No calculator. You buy a magazine for &pound;3.45 and a drink for &pound;1.20. You pay with a &pound;10 note. How much change do you get?",
    boxes: [{ label: "Change", a: 5.35, tol: 0.001, pre: "&pound;", post: "", show: "5.35" }],
    hint: "Add the two prices first. Then count up from the total to &pound;10.",
    why: "3.45 + 1.20 = &pound;4.65. Count up: 35p takes you to &pound;5, then &pound;5 more to &pound;10. Change: <b>&pound;5.35</b>.",
    link: ["money-time", 1] },

  { s: "maths", type: "mc", q: "A bus leaves at 4:45 pm. What is that on the 24 hour clock?",
    options: ["16:45", "14:45", "04:45", "18:45"], answer: 0,
    hint: "From 1 pm onwards, add 12 to the hour.",
    why: "4 + 12 = 16, so 4:45 pm is <b>16:45</b>. 04:45 would be early morning, before sunrise.",
    link: ["money-time", 4] },

  { s: "maths", type: "num", q: "A rehearsal for your musical starts at 13:45 and finishes at 16:20. How long is it?",
    boxes: [{ label: "Hours", a: 2, tol: 0.01, pre: "", post: "hours" }, { label: "Minutes", a: 35, tol: 0.01, pre: "", post: "minutes" }],
    hint: "Count on: jump to the next o'clock, then whole hours, then the rest.",
    why: "13:45 to 14:00 is 15 minutes. 14:00 to 16:00 is 2 hours. 16:00 to 16:20 is 20 minutes. Total: <b>2 hours 35 minutes</b>. Doing 16.20 &minus; 13.45 = 2.75 treats an hour as 100 minutes.",
    link: ["money-time", 5] },

  { s: "maths", type: "num", q: "You work from 09:00 to 15:30 on Saturday and are paid &pound;10.80 an hour. How much do you earn? Use a calculator if you like.",
    boxes: [{ label: "Pay", a: 70.2, tol: 0.001, pre: "&pound;", post: "", show: "70.20" }],
    hint: "Find the length of the shift, and write the half hour as 0.5 before you multiply.",
    why: "09:00 to 15:30 is 6 hours 30 minutes, which is 6.5 hours. 6.5 &times; 10.80 = <b>&pound;70.20</b>. Typing 6.30 instead of 6.5 gives &pound;68.04, the classic slip.",
    link: ["money-time", 7] },

  { s: "maths", type: "num", q: "A recipe needs 1.25 kg of potatoes. How many grams is that?",
    boxes: [{ label: "Grams", a: 1250, tol: 0.01, pre: "", post: "g" }],
    hint: "1 kg = 1000 g. Big unit to small unit: multiply.",
    why: "1.25 &times; 1000 = <b>1250 g</b>. Going to a smaller unit means there are more of them, so the number gets bigger.",
    link: ["money-time", 8] },

  /* ---------- shape ---------- */
  { s: "maths", type: "num", q: "A rectangular garden is 9 m long and 6.5 m wide. How much fencing is needed to go all the way round?",
    boxes: [{ label: "Fencing", a: 31, tol: 0.001, pre: "", post: "m" }],
    hint: "A rectangle has four sides: two long and two short. Add all four.",
    why: "9 + 6.5 + 9 + 6.5 = <b>31 m</b>. Adding just two sides (15.5 m) only gets you halfway round.",
    link: ["shape", 1] },

  { s: "maths", type: "num", q: "A bedroom floor is a rectangle 4.5 m long and 3 m wide. What is its area?",
    boxes: [{ label: "Area", a: 13.5, tol: 0.001, pre: "", post: "m&sup2;" }],
    hint: "Area of a rectangle = length &times; width.",
    why: "4.5 &times; 3 = <b>13.5 m&sup2;</b>. Area is counted in squares, so the unit is m&sup2;. Adding the sides gives perimeter instead.",
    link: ["shape", 2] },

  { s: "maths", type: "num", q: "A storage box is a cuboid 40 cm long, 30 cm wide and 25 cm high. What is its volume?",
    boxes: [{ label: "Volume", a: 30000, tol: 0.01, pre: "", post: "cm&sup3;" }],
    hint: "Volume of a cuboid = length &times; width &times; height.",
    why: "40 &times; 30 = 1200, then 1200 &times; 25 = <b>30,000 cm&sup3;</b>. Volume is counted in cubes, so the unit is cm&sup3;.",
    link: ["shape", 3] },

  { s: "maths", type: "mc", q: "You are facing North. You make a quarter turn <b>anticlockwise</b>. Which way are you facing now?",
    options: ["West", "East", "South", "North East"], answer: 0,
    hint: "Clockwise goes N, E, S, W. Anticlockwise goes the other way.",
    why: "A quarter turn is 90&deg;. Anticlockwise from North takes you to <b>West</b>. Clockwise would have taken you to East.",
    link: ["shape", 7] },

  { s: "maths", type: "num", q: "A wall is 5 m wide and 2.4 m high. One tin of paint covers 5 m&sup2;. How many tins do you need for one coat?",
    boxes: [{ label: "Tins", a: 3, tol: 0.01, pre: "", post: "tins" }],
    hint: "Find the area of the wall, divide by what one tin covers, then think about what you can actually buy.",
    why: "Area = 5 &times; 2.4 = 12 m&sup2;. 12 &divide; 5 = 2.4 tins. You cannot buy 0.4 of a tin, and 2 would not be enough, so round up: <b>3 tins</b>.",
    link: ["shape", 8] },

  /* ---------- data ---------- */
  { s: "maths", type: "mc", q: "In a pictogram about a car park, one symbol stands for 10 cars. Tuesday shows 3 and a half symbols. How many cars is that?",
    options: ["35", "30", "3.5", "45"], answer: 0,
    hint: "Read the key. Then work out what half a symbol is worth.",
    why: "3 whole symbols = 30 cars. Half a symbol is half of 10, which is 5. So 30 + 5 = <b>35 cars</b>.",
    link: ["data", 2] },

  { s: "maths", type: "mc", q: "Minutes spent getting ready in the morning (whole numbers from 0 to 59) are going to be grouped. Which set of groups works best?",
    options: ["0 to 19, 20 to 39, 40 to 59", "0 to 20, 20 to 40, 40 to 60", "0 to 15, 20 to 35, 40 to 59", "0 to 29, 25 to 59"], answer: 0,
    hint: "Check two things: could any value fit in two groups, and could any value fit in none?",
    why: "<b>0 to 19, 20 to 39, 40 to 59</b> has no gaps and no overlaps. In 0 to 20, 20 to 40, the value 20 fits two groups. In 0 to 15, 20 to 35, the value 17 has nowhere to go.",
    link: ["data", 5] },

  { s: "maths", type: "num", q: "Over five days Ella walks 3 km, 5 km, 4 km, 7 km and 2 km. Find the mean distance and the range.",
    boxes: [{ label: "Mean", a: 4.2, tol: 0.001, pre: "", post: "km" }, { label: "Range", a: 5, tol: 0.001, pre: "", post: "km" }],
    hint: "Mean: add them all up, then divide by how many there are. Range: biggest minus smallest.",
    why: "Total = 3 + 5 + 4 + 7 + 2 = 21. Mean = 21 &divide; 5 = <b>4.2 km</b>. Range = 7 &minus; 2 = <b>5 km</b>.",
    link: ["data", 6] },

  { s: "maths", type: "mc", q: "Over a month, Route A buses were a mean of 6 minutes late, with a range of 25 minutes. Route B buses were a mean of 8 minutes late, with a range of 4 minutes. You need a bus you can rely on. Which answer is strongest?",
    options: ["Route B: its mean is a bit higher, but its range of 4 minutes is much smaller, so it is more reliable", "Route A, because 6 is less than 8", "Route A, because its range is bigger", "Route B, because 8 is bigger than 6"], answer: 0,
    hint: "Reliable means consistent. Which figure tells you about consistency? A strong answer uses the mean and the range.",
    why: "A small range means the times are close together, so <b>Route B</b> is the one to rely on, even though it is a little later on average. The strongest answer gives the decision and both figures.",
    link: ["data", 7] },

  { s: "maths", type: "num", q: "A bag has 4 red, 5 blue and 3 green counters. You take one without looking. What is the probability it is blue? Give it as a fraction.",
    boxes: [{ label: "P(blue)", a: 5 / 12, tol: 0.0001, pre: "", post: "", show: "5/12" }],
    hint: "Probability = number of blue counters &divide; total number of counters.",
    why: "There are 4 + 5 + 3 = 12 counters, and 5 are blue. P(blue) = <b>5/12</b>. Writing 5/7 compares blue with the others, instead of with the total.",
    link: ["data", 8] },

  /* ---------- problems ---------- */
  { s: "maths", type: "mc", q: "Leah joined a gym in 2024. It costs &pound;22 a month, and she goes 3 times a week. How much does she pay for 6 months? Which numbers do you need?",
    options: ["22 and 6", "22, 3 and 6", "2024, 22 and 6", "3 and 6"], answer: 0,
    hint: "Read the last sentence first. What is it asking, and does the cost depend on how often she goes?",
    why: "The cost is per month, so you need <b>22 and 6</b>: 22 &times; 6 = &pound;132. The year she joined and how often she goes are scenery.",
    link: ["problems", 1] },

  { s: "maths", type: "num", q: "A caf&eacute; packs cakes in boxes of 6. It needs to deliver 75 cakes. How many boxes does it need?",
    boxes: [{ label: "Boxes", a: 13, tol: 0.01, pre: "", post: "boxes" }],
    hint: "How many 6s fit into 75? Then think about the cakes left over.",
    why: "75 &divide; 6 = 12.5. Twelve boxes hold only 72 cakes, so the last 3 need a box too: <b>13 boxes</b>. When everything must fit, round up.",
    link: ["problems", 2] },

  { s: "maths", type: "mc", q: "Kai has &pound;40. He wants 3 T shirts at &pound;12.99 each. Does he have enough money? Which answer would earn the decision mark?",
    options: ["Yes, because 3 &times; &pound;12.99 = &pound;38.97, which is less than &pound;40", "Yes", "&pound;38.97", "No, because 3 &times; &pound;12.99 = &pound;38.97"], answer: 0,
    hint: "The decision mark needs two things together.",
    why: "The mark needs the decision AND the figures that back it up. 3 &times; 12.99 = &pound;38.97, which is under &pound;40, so <b>yes, with &pound;1.03 to spare</b>. A bare yes, or figures with no decision, miss it.",
    link: ["problems", 4] },

  { s: "maths", type: "mc", q: "Ruth works out 6 &times; &pound;19.95 and writes &pound;1197.00. Which check shows something has slipped?",
    options: ["Estimate: 6 &times; &pound;20 = &pound;120, so &pound;1197 is about ten times too big", "Do 6 &times; 19.95 again in exactly the same way", "Check the answer has a &pound; sign", "Add 6 and 19.95 to see if it matches"], answer: 0,
    hint: "A good check uses a different calculation, such as an estimate or the inverse.",
    why: "Rounding &pound;19.95 to &pound;20 gives about &pound;120, nowhere near &pound;1197. The real answer is <b>&pound;119.70</b>: the decimal point slipped. Repeating the same sum can repeat the same slip.",
    link: ["problems", 5] },

  { s: "maths", type: "num", q: "Three friends share a taxi fare of &pound;23 equally. The calculator shows 7.666666667. How much does each pay, to the nearest penny?",
    boxes: [{ label: "Each pays", a: 7.67, tol: 0.001, pre: "&pound;", post: "", show: "7.67" }],
    hint: "Money needs 2 decimal places. Look at the third decimal place to decide whether to round up.",
    why: "7.666... to 2 decimal places: the next digit is 6, so round up to <b>&pound;7.67</b>. Writing &pound;7.66 cuts it off without rounding.",
    link: ["problems", 6] }
]);
