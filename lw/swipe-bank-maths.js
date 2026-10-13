/* ==========================================================
   LW's Skills HQ: swipe deck cards: Maths
   (Pearson Edexcel Functional Skills Mathematics, Level 1)
   40 quick true or false fact cards. Each links to the activity
   chunk that teaches it: [activity id, chunk number].
   ========================================================== */
window.EGWSWIPE = (window.EGWSWIPE || []).concat([

  /* ---------- number ---------- */
  { s: "maths", t: "Two hundred and six thousand and fifty is written 20,650.", a: false,
    fix: "False. It is 206,050: 206 thousand, then 050. The zero holds the hundreds place.", link: ["number", 1] },
  { s: "maths", t: "From &minus;5&deg;C to 8&deg;C is a rise of 13 degrees.", a: true,
    fix: "Yes. 5 degrees up to zero, then 8 more: 5 + 8 = 13. Across zero, split the jump at zero.", link: ["number", 2] },
  { s: "maths", t: "To multiply 4.2 by 100, just add two zeros to get 4.200.", a: false,
    fix: "False. Zeros on the end of a decimal change nothing. The digits move two places left: 4.2 &times; 100 = 420.", link: ["number", 3] },
  { s: "maths", t: "You can check 724 &minus; 358 = 366 by working out 366 + 358.", a: true,
    fix: "Yes. Adding undoes subtracting. 366 + 358 = 724, so the subtraction is right.", link: ["number", 4] },
  { s: "maths", t: "6&sup2; means 6 &times; 2, so it equals 12.", a: false,
    fix: "False. Squared means times by itself: 6&sup2; = 6 &times; 6 = 36.", link: ["number", 6] },
  { s: "maths", t: "A plumber charges &pound;35 call out plus &pound;28 an hour. A 2 hour job costs &pound;91.", a: true,
    fix: "Yes. 28 &times; 2 = 56, then 56 + 35 = &pound;91. Do the per hour part first, then add the call out.", link: ["number", 7] },
  { s: "maths", t: "3478 rounded to the nearest 100 is 3500.", a: true,
    fix: "Yes. Look at the tens digit: it is 7, which is 5 or more, so round up to 3500.", link: ["number", 8] },

  /* ---------- fdp ---------- */
  { s: "maths", t: "2/3 is bigger than 3/4.", a: false,
    fix: "False. Make the bottoms the same: 8/12 against 9/12, so 3/4 is bigger.", link: ["fdp", 1] },
  { s: "maths", t: "To find 3/5 of &pound;40, divide by 5, then times by 3.", a: true,
    fix: "Yes. 40 &divide; 5 = 8, then 8 &times; 3 = &pound;24. Divide by the bottom, times by the top.", link: ["fdp", 2] },
  { s: "maths", t: "0.45 is bigger than 0.5, because it has more digits.", a: false,
    fix: "False. Fill with zeros: 0.45 against 0.50. Longer is not bigger, so 0.5 wins.", link: ["fdp", 3] },
  { s: "maths", t: "A price goes up 10%, then down 10%. It ends up back where it started.", a: false,
    fix: "False. &pound;40 up 10% is &pound;44. Then 10% off &pound;44 is &pound;4.40, leaving &pound;39.60. The second 10% is of a bigger amount.", link: ["fdp", 5] },
  { s: "maths", t: "0.6 is the same as 6%.", a: false,
    fix: "False. Times by 100: 0.6 = 60%. 6% would be 0.06.", link: ["fdp", 6] },
  { s: "maths", t: "Shared in the ratio 2 : 3, &pound;45 gives shares of &pound;18 and &pound;27.", a: true,
    fix: "Yes. 2 + 3 = 5 parts, so one part is &pound;9. Then 2 &times; 9 = 18 and 3 &times; 9 = 27, which add back to 45.", link: ["fdp", 7] },
  { s: "maths", t: "If 3 bags of compost cost &pound;12, then 7 bags cost &pound;28.", a: true,
    fix: "Yes. Find one first: 12 &divide; 3 = &pound;4 a bag. Then 7 &times; 4 = &pound;28.", link: ["fdp", 8] },

  /* ---------- money-time ---------- */
  { s: "maths", t: "&pound;6.35p is a correct way to write six pounds thirty five.", a: false,
    fix: "False. Use pounds or pence, never both: &pound;6.35 or 635p.", link: ["money-time", 1] },
  { s: "maths", t: "The bigger pack is always the better value.", a: false,
    fix: "False. The word \"always\" is the trap. Work out the cost of the same amount of each, such as per 100 g, then compare.", link: ["money-time", 3] },
  { s: "maths", t: "4:30 pm on the 24 hour clock is 14:30.", a: false,
    fix: "False. From 1 pm, add 12 to the hour: 4 + 12 = 16, so it is 16:30.", link: ["money-time", 4] },
  { s: "maths", t: "From 09:45 to 11:20 is 1 hour 35 minutes.", a: true,
    fix: "Yes. 15 minutes to 10:00, 1 hour to 11:00, then 20 minutes more: 1 hour 35 minutes.", link: ["money-time", 5] },
  { s: "maths", t: "On most bus timetables, each column is one bus and each row is a stop.", a: true,
    fix: "Yes. Find your stop's row, then follow one column all the way. A dash means that bus does not stop there.", link: ["money-time", 6] },
  { s: "maths", t: "Four and a half hours of work is 4.30 hours on a calculator.", a: false,
    fix: "False. Half an hour is 0.5, so it is 4.5 hours. Change minutes into parts of an hour before you multiply.", link: ["money-time", 7] },
  { s: "maths", t: "750 ml is the same as 0.75 litres.", a: true,
    fix: "Yes. 1000 ml = 1 litre, so divide by 1000: 750 &divide; 1000 = 0.75.", link: ["money-time", 8] },

  /* ---------- shape ---------- */
  { s: "maths", t: "Perimeter is measured in square metres.", a: false,
    fix: "False. Perimeter is the length around the edge, so it is in m or cm. Area is in m&sup2;.", link: ["shape", 1] },
  { s: "maths", t: "A box 30 cm by 20 cm by 10 cm has a volume of 6000 cm&sup3;.", a: true,
    fix: "Yes. Volume = length &times; width &times; height: 30 &times; 20 &times; 10 = 6000 cm&sup3;.", link: ["shape", 3] },
  { s: "maths", t: "A plan is the view of a shape from directly above.", a: true,
    fix: "Yes. The view from the front or the side is called an elevation.", link: ["shape", 4] },
  { s: "maths", t: "At a scale of 1 cm to 2 m, 4.5 cm on a plan means 9 m.", a: true,
    fix: "Yes. Drawing to real life: multiply. 4.5 &times; 2 = 9 m.", link: ["shape", 5] },
  { s: "maths", t: "An obtuse angle is smaller than a right angle.", a: false,
    fix: "False. That is an acute angle. Obtuse angles are bigger than 90&deg; but smaller than 180&deg;.", link: ["shape", 6] },
  { s: "maths", t: "Facing North, a quarter turn clockwise leaves you facing West.", a: false,
    fix: "False. Clockwise from North goes to East. A quarter turn anticlockwise would take you to West.", link: ["shape", 7] },
  { s: "maths", t: "If a wall needs 2.1 tins of paint, buying 2 tins will do.", a: false,
    fix: "False. When you need enough, round up: buy 3. Round down only when the question asks how many will fit.", link: ["shape", 8] },

  /* ---------- data ---------- */
  { s: "maths", t: "If one pictogram symbol stands for 4 people, half a symbol stands for 2.", a: true,
    fix: "Yes. Half of 4 is 2. Always read the key first, then work out the part symbols.", link: ["data", 2] },
  { s: "maths", t: "On a bar chart, each grid line always goes up in 1s.", a: false,
    fix: "False. The word \"always\" is the trap. Lines can go up in 2s, 5s or 10s, so check the scale first.", link: ["data", 3] },
  { s: "maths", t: "On a line graph, the steeper the line, the faster the change.", a: true,
    fix: "Yes. A steep line means a big change in a short time. A flat line means no change.", link: ["data", 4] },
  { s: "maths", t: "The groups 0 to 5, 5 to 10 and 10 to 15 are fine for grouping data.", a: false,
    fix: "False. They overlap: a 5 or a 10 would fit in two groups. Use 0 to 4, 5 to 9, 10 to 14 instead.", link: ["data", 5] },
  { s: "maths", t: "The mean of 6, 9, 4, 8 and 8 is 7.", a: true,
    fix: "Yes. Add them: 35. Divide by how many there are: 35 &divide; 5 = 7.", link: ["data", 6] },
  { s: "maths", t: "A bag has 3 red and 7 blue counters. The probability of red is 3/7.", a: false,
    fix: "False. Divide by the total, not by the others. There are 10 counters, so P(red) = 3/10.", link: ["data", 8] },

  /* ---------- problems ---------- */
  { s: "maths", t: "In a wordy question, reading the last sentence first tells you what is being asked.", a: true,
    fix: "Yes. Then circle the numbers you need and cross out the scenery, like dates and names.", link: ["problems", 1] },
  { s: "maths", t: "The word \"altogether\" in a question always means add.", a: false,
    fix: "False. It might mean times: 4 tickets at &pound;6 altogether is 4 &times; 6. Picture what is happening to the numbers.", link: ["problems", 2] },
  { s: "maths", t: "A wrong final answer with clear working can still earn marks.", a: true,
    fix: "Yes. Many marks are for the method. A wrong answer on its own scores nothing, so working is your safety net.", link: ["problems", 3] },
  { s: "maths", t: "A bare \"yes\" is enough to get the decision mark.", a: false,
    fix: "False. You need the decision and the figures that back it up: \"Yes, because it costs &pound;84 and he has &pound;90.\"", link: ["problems", 4] },
  { s: "maths", t: "Doing exactly the same sum again counts as checking your answer.", a: false,
    fix: "False. A check has to be a different calculation, like the inverse or an estimate. The same sum can repeat the same slip.", link: ["problems", 5] },
  { s: "maths", t: "If your calculator shows 7.2 for a shopping bill, you write &pound;7.20.", a: true,
    fix: "Yes. Money always gets two decimal places. 7.2 means 7 pounds and 20 pence, not &pound;7.02.", link: ["problems", 6] }
]);
