/* ==========================================================
   Base 5 - Catch Jay out
   Jay has had a go at some questions and slipped up somewhere.
   The student taps the line where he first goes wrong, then sees
   why. One at a time, from the HQ home page. Right first go is
   10 sparks, second go 6, and seeing the answer still earns 3,
   the same as everywhere else in the HQ.

   Three banks, matched to each HQ:
     gcse   EGW and LP (GCSE maths and English)
     l1     LW (Functional Skills Level 1)
     entry  LC, HK and JT (the foundation targets)
   Each item: { id, s: "maths" | "english", q, lines: [...],
                wrong: index of the first wrong line, why }
   Saves { done: { id: "right1" | "right2" | "shown" }, summary }
   in <prefix>catchjay.v1. ASCII only, &pound; for pounds.
   ========================================================== */
(function(){
"use strict";

var BANK = {
 entry: [
  { id: "e1", s: "maths", q: "47 + 38", lines: ["40 + 30 = 70", "7 + 8 = 15", "70 + 15 = 75"], wrong: 2, why: "70 + 15 is 85. Jay dropped the ten that came from 7 + 8." },
  { id: "e2", s: "maths", q: "63 - 28", lines: ["60 - 20 = 40", "3 - 8 is tricky, so I did 8 - 3 = 5", "40 + 5 = 45"], wrong: 1, why: "You cannot flip it round. Take 28 from 63 another way: 63 - 30 = 33, then add the 2 back. That makes 35." },
  { id: "e3", s: "maths", q: "6 x 7", lines: ["6 x 7 is 6 x 5 add 6 x 2", "6 x 5 = 30", "6 x 2 = 12", "30 + 12 = 44"], wrong: 3, why: "30 + 12 is 42. Every line before that was spot on." },
  { id: "e4", s: "maths", q: "Three drinks cost &pound;1.20 each. Jay pays with &pound;5. How much change?", lines: ["&pound;1.20 x 3 = &pound;3.60", "&pound;5 - &pound;3.60 = &pound;2.40"], wrong: 1, why: "Count up from &pound;3.60: 40p makes &pound;4, then &pound;1 more makes &pound;5. That is &pound;1.40 change." },
  { id: "e5", s: "maths", q: "A film starts at 6:45pm and lasts 1 hour 30 minutes. When does it end?", lines: ["6:45 + 1 hour = 7:45", "7:45 + 30 minutes = 8:25"], wrong: 1, why: "15 minutes gets you to 8:00, and 15 more makes 8:15. There are 60 minutes in an hour, not 100." },
  { id: "e6", s: "maths", q: "How many centimetres in 2.5 metres?", lines: ["1 metre = 100 cm", "2 metres = 200 cm", "0.5 of a metre = 5 cm", "200 + 5 = 205 cm"], wrong: 2, why: "Half a metre is half of 100 cm: 50 cm. So 2.5 metres is 250 cm." },
  { id: "e7", s: "maths", q: "Write 3,406 in words", lines: ["three thousand", "four hundred", "and sixty"], wrong: 2, why: "The 0 is in the tens place, so there are no tens. It is three thousand, four hundred and six." },
  { id: "e8", s: "maths", q: "Half of 74", lines: ["Half of 70 = 30", "Half of 4 = 2", "30 + 2 = 32"], wrong: 0, why: "Half of 70 is 35, so half of 74 is 37." },
  { id: "e9", s: "english", q: "Jay wrote: on monday we went to the park.", lines: ["A sentence starts with a capital, so: On", "monday stays small, it is just a day", "It ends with a full stop"], wrong: 1, why: "Days of the week always get a capital letter: Monday." },
  { id: "e10", s: "english", q: "Jay's spelling list", lines: ["because", "friend", "beutiful", "Wednesday"], wrong: 2, why: "It is beautiful, with b-e-a-u. Think big elephants are useful." },
  { id: "e11", s: "english", q: "Jay makes some words into more than one", lines: ["box becomes boxes", "baby becomes babys", "dog becomes dogs"], wrong: 1, why: "When a word ends in a consonant then y, the y changes to ies: babies." },
  { id: "e12", s: "english", q: "Jay emails the council about a broken streetlight", lines: ["Dear Sir or Madam,", "I am writing about the broken streetlight on Mill Road.", "Cya later, Jay"], wrong: 2, why: "A formal email needs a formal ending, like Yours faithfully, then the full name. Cya is for friends." }
 ],
 l1: [
  { id: "l1", s: "maths", q: "A &pound;45 jacket has 20% off. What is the sale price?", lines: ["10% of &pound;45 = &pound;4.50", "20% = &pound;9", "&pound;45 - &pound;9 = &pound;35"], wrong: 2, why: "&pound;45 - &pound;9 is &pound;36. The method was right all the way down." },
  { id: "l2", s: "maths", q: "A room is 6 m long and 4 m wide. What is its area?", lines: ["Area = length + width", "6 + 4 = 10 square metres"], wrong: 0, why: "Area is length times width: 6 x 4 = 24 square metres. Adding them gives half the perimeter." },
  { id: "l3", s: "maths", q: "Share &pound;30 in the ratio 1 : 2", lines: ["1 + 2 = 3 parts", "&pound;30 / 3 = &pound;10 a part", "So it is &pound;10 and &pound;30"], wrong: 2, why: "The second share is 2 parts: 2 x &pound;10 = &pound;20. Check: &pound;10 + &pound;20 = &pound;30." },
  { id: "l4", s: "maths", q: "Find the mean of 4, 6, 8 and 10", lines: ["4 + 6 + 8 + 10 = 26", "26 / 4 = 6.5"], wrong: 0, why: "4 + 6 + 8 + 10 is 28, and 28 / 4 = 7." },
  { id: "l5", s: "maths", q: "A bus leaves at 14:50. The journey is 35 minutes. When does it arrive?", lines: ["14:50 + 10 minutes = 15:00", "35 - 10 = 25 minutes left", "15:00 + 25 minutes = 15:35"], wrong: 2, why: "15:00 add 25 minutes is 15:25." },
  { id: "l6", s: "maths", q: "Work out 3/4 of 60", lines: ["60 / 4 = 15", "15 + 3 = 18"], wrong: 1, why: "One quarter is 15, so three quarters is 15 x 3 = 45. Jay added instead of multiplying." },
  { id: "l7", s: "maths", q: "A map scale is 1 cm to 2 km. Two towns are 4.5 cm apart. How far is that?", lines: ["1 cm = 2 km", "4.5 x 2 = 8 km"], wrong: 1, why: "4.5 x 2 = 9 km. 4 x 2 is 8, then the half adds one more." },
  { id: "l8", s: "maths", q: "It is -3 degrees and the temperature rises by 7 degrees. What is it now?", lines: ["Start at -3", "-3 + 7 = -10"], wrong: 1, why: "Rising means going up the number line: -3 up 7 is 4 degrees." },
  { id: "l9", s: "english", q: "Jay writes to his landlord", lines: ["Dear Mr Patel,", "I am writing to ask about the heating in my flat.", "Yours faithfully,"], wrong: 2, why: "When you know the person's name, end with Yours sincerely. Yours faithfully goes with Dear Sir or Madam." },
  { id: "l10", s: "english", q: "Jay fixes: The dogs bone was huge.", lines: ["The bone belongs to the dog, so it needs an apostrophe", "So it should be dogs'"], wrong: 1, why: "For one dog, the apostrophe goes before the s: dog's. Dogs' would mean lots of dogs sharing one bone." },
  { id: "l11", s: "english", q: "A leaflet says: Book now, only 3 places left! Jay works out its main purpose.", lines: ["It tells you there are places left", "So its main purpose is to inform"], wrong: 1, why: "Only 3 places left is there to hurry you into booking. The main purpose is to persuade." },
  { id: "l12", s: "english", q: "Jay checks: There coats are on the bus.", lines: ["The word is about whose coats they are", "There is right, because it is a place"], wrong: 1, why: "The coats belong to them, so it is their. There is for places." }
 ],
 gcse: [
  { id: "g1", s: "maths", q: "Expand 3(x + 4)", lines: ["3 x x = 3x", "3 x 4 = 7", "So 3x + 7"], wrong: 1, why: "3 x 4 is 12, so it is 3x + 12. Jay added the 3 and the 4." },
  { id: "g2", s: "maths", q: "Solve 2x + 5 = 17", lines: ["2x = 17 + 5", "2x = 22", "x = 11"], wrong: 0, why: "Undo + 5 by taking 5 away: 2x = 12, so x = 6. Check: 2 x 6 + 5 = 17." },
  { id: "g3", s: "maths", q: "A triangle has angles of 50 and 60 degrees. Find the third.", lines: ["Angles in a triangle add up to 360", "50 + 60 = 110", "360 - 110 = 250"], wrong: 0, why: "Angles in a triangle add up to 180. It is 360 in a quadrilateral or round a point. The answer is 70 degrees." },
  { id: "g4", s: "maths", q: "Increase &pound;80 by 15%", lines: ["10% of &pound;80 = &pound;8", "5% = &pound;2", "15% = &pound;10", "&pound;80 + &pound;10 = &pound;90"], wrong: 1, why: "5% is half of 10%, so it is &pound;4. Then 15% is &pound;12 and the answer is &pound;92." },
  { id: "g5", s: "maths", q: "A bag has 3 red and 5 blue counters. Find P(red).", lines: ["Total counters = 3 + 5 = 8", "P(red) = 3/5"], wrong: 1, why: "Probability is out of the total, so P(red) = 3/8. Jay put red over blue." },
  { id: "g6", s: "maths", q: "Find the area of a circle with radius 5 cm (use 3.14)", lines: ["Area = 2 x pi x r", "= 2 x 3.14 x 5", "= 31.4 square cm"], wrong: 0, why: "That is the circumference formula. Area is pi x r x r: 3.14 x 25 = 78.5 square cm." },
  { id: "g7", s: "maths", q: "Simplify the ratio 12 : 18", lines: ["Both numbers divide by 3", "12 : 18 = 4 : 6, and that is as simple as it gets"], wrong: 1, why: "4 and 6 both still divide by 2, so it simplifies to 2 : 3. Dividing by 6 gets there in one go." },
  { id: "g8", s: "maths", q: "Write 0.0045 in standard form", lines: ["Move the decimal point 3 places to get 4.5", "So it is 4.5 x 10 to the power 3"], wrong: 1, why: "For a small number the power is negative: 4.5 x 10 to the power -3." },
  { id: "g9", s: "english", q: "Jay analyses: The wind screamed across the bay.", lines: ["This is a simile", "because the wind is given a human action"], wrong: 0, why: "A simile uses like or as. Giving the wind a human action is personification. Jay's reason was right, his label was not." },
  { id: "g10", s: "english", q: "Jay writes about structure in an extract", lines: ["The writer opens on a calm harbour", "then the storm arrives", "so the focus shifts from calm to danger", "This is called a cliffhanger"], wrong: 3, why: "A cliffhanger leaves you hanging at the end. This is a shift in focus, or a contrast. The first three lines were good." },
  { id: "g11", s: "english", q: "Jay corrects: Their going to the beach, its sunny.", lines: ["Their becomes they're", "its becomes it's", "The comma in the middle is fine"], wrong: 2, why: "Two full sentences joined by a comma is a comma splice. Use a full stop or a semicolon: They're going to the beach; it's sunny." },
  { id: "g12", s: "english", q: "Jay plans a viewpoint article on school uniform", lines: ["Grab the reader in the first line", "My opening: In this article I will talk about school uniform."], wrong: 1, why: "Announcing what you will do is not a hook. Try a question, a short bold statement or a surprising fact instead." }
 ]
};

var LEVEL = { EGW: "gcse", LP: "gcse", LW: "l1", LC: "entry", HK: "entry", JT: "entry" };

window.B5Catch = {
  bank: function(who){ return BANK[LEVEL[who] || "entry"]; }
};
})();
