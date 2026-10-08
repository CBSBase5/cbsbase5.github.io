/* ==========================================================
   EGW's GCSE HQ - daily drop question bank: GCSE Statistics
   Quick questions (one or two minutes each), Foundation level,
   both tiers. Each links to the activity chunk that teaches it.
   ========================================================== */
window.EGWDAILY = (window.EGWDAILY || []).concat([

  /* ---------- sampling ---------- */
  { s: "stats", type: "mc",
    q: "Which of these is <b>continuous</b> data?",
    options: ["The number of pets in a house", "Shoe size", "Favourite colour", "The time it takes to run 100 m"],
    answer: 3,
    hint: "Continuous data is measured, and could be any value in a range, like 13.72.",
    why: "Time is measured, so it is <b>continuous</b>. Number of pets is counted (discrete), shoe size only comes in set sizes (discrete), and colour is described in words (qualitative).",
    link: ["stats-sampling", 1] },

  { s: "stats", type: "num",
    q: "A club has a list of 800 members. It wants a systematic sample of 40.",
    boxes: [
      { label: "Take every kth member. What is k?", a: 20, tol: 0, post: "" },
      { label: "The random start is member 7. Which member is chosen third?", a: 47, tol: 0, post: "" }
    ],
    hint: "k = population size &divide; sample size. Then keep adding k to the start.",
    why: "k = 800 &divide; 40 = <b>20</b>. Start at 7, then 27, then <b>47</b>. The random start is what makes it fair.",
    link: ["stats-sampling", 3] },

  { s: "stats", type: "num",
    q: "A youth club has 90 boys and 60 girls. It wants a stratified sample of 30 by gender.",
    boxes: [
      { label: "Boys in the sample", a: 18, tol: 0, post: "" },
      { label: "Girls in the sample", a: 12, tol: 0, post: "" }
    ],
    hint: "Group size &divide; population size &times; sample size. The population is 150.",
    why: "Boys: 90 &divide; 150 &times; 30 = <b>18</b>. Girls: 60 &divide; 150 &times; 30 = <b>12</b>. Check: 18 + 12 = 30. Splitting 15 and 15 would not match the club's mix.",
    link: ["stats-sampling", 4] },

  { s: "stats", type: "mc",
    q: "A survey asks: \"How many hours did you spend on homework last week?\" with boxes <b>0 to 2</b>, <b>2 to 4</b>, <b>4 to 6</b>. What is wrong with the boxes?",
    options: [
      "Some boxes overlap (2 and 4 each fit two boxes), and there is no box for more than 6 hours.",
      "There is no time frame.",
      "It is a leading question.",
      "It is an open question, so the answers will be hard to process."
    ],
    answer: 0,
    hint: "Check the boxes for overlaps and gaps. Where would someone who did 4 hours tick? Or 9 hours?",
    why: "Response boxes need <b>no overlaps</b> (2 and 4 are each in two boxes) and <b>no gaps</b> (nowhere for more than 6). The question does have a time frame (last week), it is neutral, and boxes make it closed, not open.",
    link: ["stats-sampling", 6] },

  /* ---------- cleaning ---------- */
  { s: "stats", type: "mc",
    q: "Heights of five Year 10 students were typed into a cm column: 158, 163, 1.61, 170, 155. Which value was most likely recorded in the wrong units?",
    options: ["158", "1.61", "170", "155"],
    answer: 1,
    hint: "Which value would be impossible for a teenager in centimetres?",
    why: "1.61 cm is impossible for a person. It was almost certainly written in metres: 1.61 m = <b>161 cm</b>. Convert it rather than deleting it.",
    link: ["stats-cleaning", 2] },

  { s: "stats", type: "num",
    q: "Seven students were asked how many siblings they have. Their answers: 2, 1, (blank), 0, 3, 1, 2. Work out the mean, dealing with the blank sensibly.",
    boxes: [{ label: "Mean", a: 1.5, tol: 0.001, post: "" }],
    hint: "A blank is not a zero. Use only the answers you actually have.",
    why: "Leave the blank out: 2 + 1 + 0 + 3 + 1 + 2 = 9, from 6 answers. Mean = 9 &divide; 6 = <b>1.5</b>. Dividing by 7 treats the blank as 0 siblings, which you do not know.",
    link: ["stats-cleaning", 3] },

  { s: "stats", type: "mc",
    q: "Times, t minutes, go from 0 to 30. Which set of class intervals has no gaps and no overlaps?",
    options: [
      "0 &lt; t &le; 10, 11 &lt; t &le; 20, 21 &lt; t &le; 30",
      "0 &lt; t &lt; 10, 10 &lt; t &lt; 20, 20 &lt; t &lt; 30",
      "0 &lt; t &le; 10, 10 &lt; t &le; 20, 20 &lt; t &le; 30",
      "0 to 10, 10 to 20, 20 to 30"
    ],
    answer: 2,
    hint: "Test a boundary value like 10, and one like 10.5. Each should fit in exactly one class.",
    why: "With &lt; on the left and &le; on the right, 10 goes only in the first class and 10.5 only in the second. \"0 to 10, 10 to 20\" puts 10 in two classes; starting the next class at 11 leaves 10.5 nowhere; and using &lt; on both sides leaves 10 and 20 out.",
    link: ["stats-cleaning", 6] },

  /* ---------- experiments ---------- */
  { s: "stats", type: "mc",
    q: "Lena asks: does the temperature of the water affect how fast sugar dissolves? Which is the <b>explanatory</b> variable?",
    options: ["The time the sugar takes to dissolve", "The type of sugar", "The size of the cup", "The temperature of the water"],
    answer: 3,
    hint: "The explanatory variable is the one you change on purpose.",
    why: "Lena changes the <b>temperature</b>, so it is the explanatory (independent) variable. The dissolving time is what she measures: the response variable. Sugar type and cup size are extraneous variables to keep the same.",
    link: ["stats-experiments", 1] },

  { s: "stats", type: "mc",
    q: "A researcher compares how much people walk in a town before and after a new railway station opens there. The researcher had no say in the station. What type of experiment is this?",
    options: ["A natural experiment", "A laboratory experiment", "A field experiment", "A pilot study"],
    answer: 0,
    hint: "Who changed the explanatory variable: the researcher, or nobody?",
    why: "The explanatory variable (the station) changed by itself, and the researcher just recorded what happened: a <b>natural experiment</b>. In lab and field experiments, the experimenter makes the change. A pilot study is a small trial run.",
    link: ["stats-experiments", 3] },

  { s: "stats", type: "mc",
    q: "Sam weighs the same apple five times on scales that always read 20 g too heavy. He gets 170 g every time. His results are:",
    options: ["Neither reliable nor valid", "Reliable but not valid", "Valid but not reliable", "Both reliable and valid"],
    answer: 1,
    hint: "Reliable: would you get the same again? Valid: is it measuring the true value?",
    why: "Same answer every time, so <b>reliable</b>. But every reading is 20 g out, so it does not measure the true mass: <b>not valid</b>.",
    link: ["stats-experiments", 4] },

  /* ---------- charts ---------- */
  { s: "stats", type: "num",
    q: "60 people chose a favourite hot drink. 25 chose tea. What angle should the tea sector have in a pie chart?",
    boxes: [{ label: "Angle for tea", a: 150, tol: 0, post: "degrees" }],
    hint: "Each person gets 360 &divide; 60 degrees.",
    why: "360 &divide; 60 = 6 degrees per person, so tea is 25 &times; 6 = <b>150 degrees</b>. Or 25 &divide; 60 &times; 360 = 150.",
    link: ["stats-charts", 3] },

  { s: "stats", type: "num",
    q: "An ordered stem and leaf diagram (key: 2 | 3 means 23 seconds):<br>1 | 4 7 8<br>2 | 0 3 3 6<br>3 | 1 5",
    boxes: [
      { label: "Median", a: 23, tol: 0, post: "seconds" },
      { label: "Range", a: 21, tol: 0, post: "seconds" }
    ],
    hint: "Count the leaves first: how many values are there? Then count along to the middle one.",
    why: "There are 9 values: 14, 17, 18, 20, <b>23</b>, 23, 26, 31, 35. The median is the 5th: <b>23</b>. Range: 35 &minus; 14 = <b>21</b>. Use the key to turn stem and leaf back into numbers.",
    link: ["stats-charts", 4] },

  { s: "stats", type: "mc",
    q: "For each year group, a chart needs one bar showing the total number of students, split into boys and girls. Which chart fits best?",
    options: ["A pie chart", "A scatter diagram", "A compound (stacked) bar chart", "A multiple (side by side) bar chart"],
    answer: 2,
    hint: "One bar per year group, with the parts on top of each other.",
    why: "A <b>compound bar chart</b> stacks the parts, so each bar's height is the total and the sections show the split. Side by side bars compare the parts but do not show a total as one bar.",
    link: ["stats-charts", 2] },

  { s: "stats", type: "mc",
    q: "An advert shows Phone B sold twice as many as Phone A. It draws Phone B's picture twice as tall <b>and</b> twice as wide as Phone A's. Why is this misleading?",
    options: [
      "Pictures must never be used in statistical charts.",
      "The data should have been shown in a pie chart.",
      "Phone B's picture should have been drawn smaller.",
      "The picture's area is four times as big, so Phone B looks like it sold four times as many."
    ],
    answer: 3,
    hint: "If you double the height and double the width, what happens to the area?",
    why: "2 &times; 2 = 4, so the picture covers <b>four times</b> the area for twice the sales. The eye judges the size of the whole picture. To be fair, only one dimension should double.",
    link: ["stats-charts", 8] },

  /* ---------- averages ---------- */
  { s: "stats", type: "num",
    q: "Here are six numbers: 7, 3, 9, 4, 12, 6.",
    boxes: [
      { label: "Median", a: 6.5, tol: 0.001, post: "" },
      { label: "Range", a: 9, tol: 0, post: "" }
    ],
    hint: "Order them first. With an even number of values, the median is halfway between the middle two.",
    why: "In order: 3, 4, 6, 7, 9, 12. The middle two are 6 and 7, so the median is <b>6.5</b>. Range: 12 &minus; 3 = <b>9</b>.",
    link: ["stats-averages", 1] },

  { s: "stats", type: "mc",
    q: "House prices in one street: &pound;180 000, &pound;195 000, &pound;200 000, &pound;210 000, &pound;1 200 000. Which average best describes a typical price?",
    options: ["The median, because the &pound;1 200 000 house is an outlier", "The mean, because it uses every value", "The mode, because it is the most common price", "The range, because it shows the spread"],
    answer: 0,
    hint: "One price is far from the rest. Which average does that drag?",
    why: "The <b>median</b> (&pound;200 000) ignores the extreme value. The mean (&pound;397 000) is dragged up by the outlier and is more than four of the five prices. There is no mode (all different), and the range is not an average.",
    link: ["stats-averages", 2] },

  { s: "stats", type: "num",
    q: "A team's goals in 20 matches:<br>0 goals: 4 matches<br>1 goal: 6 matches<br>2 goals: 7 matches<br>3 goals: 3 matches<br>Work out the mean number of goals per match.",
    boxes: [{ label: "Mean", a: 1.45, tol: 0.005, post: "goals" }],
    hint: "Multiply each number of goals by its frequency, add them up, then divide by the total number of matches.",
    why: "Total goals: 0 &times; 4 + 1 &times; 6 + 2 &times; 7 + 3 &times; 3 = 0 + 6 + 14 + 9 = 29. Mean = 29 &divide; 20 = <b>1.45</b>. Divide by the 20 matches, not by the 4 rows.",
    link: ["stats-averages", 3] },

  { s: "stats", type: "num",
    q: "Eleven values, in order: 2, 5, 7, 8, 10, 12, 13, 15, 18, 20, 24.",
    boxes: [
      { label: "Lower quartile", a: 7, tol: 0, post: "" },
      { label: "Upper quartile", a: 18, tol: 0, post: "" },
      { label: "Interquartile range", a: 11, tol: 0, post: "" }
    ],
    hint: "With 11 values, the lower quartile is the (11 + 1) &divide; 4 = 3rd value.",
    why: "LQ: the 3rd value, <b>7</b>. UQ: the 3 &times; 12 &divide; 4 = 9th value, <b>18</b>. IQR = 18 &minus; 7 = <b>11</b>, the spread of the middle half.",
    link: ["stats-averages", 5] },

  { s: "stats", type: "mc",
    q: "Test marks. Class A: median 62, interquartile range 8. Class B: median 58, interquartile range 15. Which is the best comparison?",
    options: [
      "Class B did better on average, and their marks were more consistent.",
      "Class A did better on average, and their marks were more consistent.",
      "Class A did better on average, but Class B's marks were more consistent.",
      "Class B did better on average, because its interquartile range is bigger."
    ],
    answer: 1,
    hint: "Compare median with median, then IQR with IQR. Smaller spread means more consistent.",
    why: "Class A's median is higher (62 against 58), so they did better on average. Their IQR is smaller (8 against 15), so their marks were <b>more consistent</b>. A bigger IQR means more spread, not better.",
    link: ["stats-averages", 8] },

  /* ---------- correlation ---------- */
  { s: "stats", type: "mc",
    q: "Which pair would you expect to show <b>negative</b> correlation?",
    options: ["Hours of revision and test score", "Shoe size and favourite TV channel", "The age of a car and its value", "Height and arm span"],
    answer: 2,
    hint: "Negative: as one goes up, the other tends to go down.",
    why: "As a car gets older its value tends to fall: <b>negative</b> correlation. Height and arm span, and revision and score, are positive. Shoe size and TV channel have no connection at all.",
    link: ["stats-correlation", 2] },

  { s: "stats", type: "mc",
    q: "Over one summer, sales of sun cream and sales of ice lollies were strongly positively correlated. What is the best explanation?",
    options: [
      "Buying sun cream makes people want ice lollies.",
      "Eating ice lollies causes sunburn, so people buy sun cream.",
      "It proves the shops put them next to each other.",
      "Hot, sunny weather makes people buy more of both."
    ],
    answer: 3,
    hint: "Correlation does not mean one causes the other. Is there a third thing behind both?",
    why: "A <b>third variable</b>, the weather, drives both. Correlation alone never proves that one thing causes the other.",
    link: ["stats-correlation", 3] },

  { s: "stats", type: "mc",
    q: "A line of best fit was drawn from data on plants between 10 cm and 40 cm tall. Using it to predict for a plant 90 cm tall is:",
    options: [
      "Extrapolation, so it may well be unreliable",
      "Interpolation, so it is fairly reliable",
      "Extrapolation, so it is very reliable",
      "Interpolation, so it may well be unreliable"
    ],
    answer: 0,
    hint: "Is 90 cm inside or outside the range of the data?",
    why: "90 cm is outside the data (10 to 40 cm), so it is <b>extrapolation</b>. There is no data to show the pattern carries on that far, so be suspicious of it. Predicting inside the range is interpolation.",
    link: ["stats-correlation", 5] },

  /* ---------- time series ---------- */
  { s: "stats", type: "mc",
    q: "An ice cream van's sales are high every summer and low every winter, and each year's sales are a little higher than the year before. Which describes this best?",
    options: [
      "No trend, just random ups and downs",
      "A rising trend with seasonal variation",
      "A falling trend with seasonal variation",
      "A rising trend with no seasonal variation"
    ],
    answer: 1,
    hint: "Two things: the overall direction over the years, and the pattern that repeats each year.",
    why: "Each year is higher, so the <b>trend is rising</b>. High every summer, low every winter is a pattern repeating each year: <b>seasonal variation</b>.",
    link: ["stats-time-series", 2] },

  { s: "stats", type: "num",
    q: "Quarterly sales (in &pound;1000s) for two years: 12, 20, 16, 8, 16, 24, 20, 12. Work out the first two 4 point moving averages.",
    boxes: [
      { label: "1st moving average", a: 14, tol: 0, post: "" },
      { label: "2nd moving average", a: 15, tol: 0, post: "" }
    ],
    hint: "Mean of the first four values, then slide along one place and do it again.",
    why: "(12 + 20 + 16 + 8) &divide; 4 = 56 &divide; 4 = <b>14</b>. Slide along: (20 + 16 + 8 + 16) &divide; 4 = 60 &divide; 4 = <b>15</b>. Each window holds one of every quarter, so the seasons cancel out.",
    link: ["stats-time-series", 3] },

  { s: "stats", type: "mc",
    q: "A 4 point moving average is worked out from quarters 1, 2, 3 and 4 of one year. Where should it be plotted?",
    options: ["At quarter 1", "At quarter 2", "Halfway between quarter 2 and quarter 3", "At quarter 4"],
    answer: 2,
    hint: "Plot a moving average at the middle of the time it covers.",
    why: "The middle of four quarters is <b>halfway between the 2nd and 3rd</b>. Plotting at the last quarter is a common slip that shifts the trend line.",
    link: ["stats-time-series", 4] },

  /* ---------- index numbers ---------- */
  { s: "stats", type: "num",
    q: "A bus fare was &pound;2.40 in 2020 and &pound;2.70 in 2025. Using 2020 as the base year, find the index number for 2025.",
    boxes: [{ label: "Index number", a: 112.5, tol: 0.01, post: "" }],
    hint: "Index = price this year &divide; price in the base year &times; 100.",
    why: "2.70 &divide; 2.40 &times; 100 = <b>112.5</b>. So the fare is 12.5% higher than in 2020. Dividing the other way round gives a number below 100, which would mean it got cheaper.",
    link: ["stats-index-numbers", 1] },

  { s: "stats", type: "num",
    q: "Using last year as the base year: a chocolate bar went from 80p to &pound;1.00, and a cinema ticket went from &pound;8.00 to &pound;9.20. Find each index number.",
    boxes: [
      { label: "Chocolate bar", a: 125, tol: 0.01, post: "" },
      { label: "Cinema ticket", a: 115, tol: 0.01, post: "" }
    ],
    hint: "Work in the same units: 80p is &pound;0.80. Then new &divide; old &times; 100 for each.",
    why: "Chocolate: 1.00 &divide; 0.80 &times; 100 = <b>125</b>. Cinema: 9.20 &divide; 8.00 &times; 100 = <b>115</b>. The ticket went up by more money (&pound;1.20 against 20p), but the chocolate went up by a bigger proportion.",
    link: ["stats-index-numbers", 2] },

  { s: "stats", type: "num",
    q: "A town's population rose from 40 000 to 43 000 over 5 years.",
    boxes: [
      { label: "Percentage change", a: 7.5, tol: 0.01, post: "%" },
      { label: "Average change per year", a: 600, tol: 0, post: "people" }
    ],
    hint: "Percentage change = change &divide; original &times; 100. Average per year = total change &divide; number of years.",
    why: "Change: 3000. Percentage: 3000 &divide; 40 000 &times; 100 = <b>7.5%</b>. Per year: 3000 &divide; 5 = <b>600</b> people. Always divide by the original value, not the new one.",
    link: ["stats-index-numbers", 5] },

  /* ---------- probability ---------- */
  { s: "stats", type: "num",
    q: "A bag has 3 red, 5 blue and 4 green counters. One is picked at random. Find P(not blue), as a fraction or a decimal.",
    boxes: [{ label: "P(not blue)", a: 7 / 12, tol: 0.005, post: "" }],
    hint: "How many counters are not blue? Or work out P(blue) and take it from 1.",
    why: "There are 12 counters and 7 are not blue, so P(not blue) = <b>7/12</b> (about 0.58). Check: P(blue) = 5/12, and 1 &minus; 5/12 = 7/12.",
    link: ["stats-probability", 1] },

  { s: "stats", type: "num",
    q: "A spinner is spun 250 times. It lands on 5 forty times.",
    boxes: [
      { label: "Relative frequency of a 5", a: 0.16, tol: 0.001, post: "" },
      { label: "Expected number of 5s in 1000 spins", a: 160, tol: 0, post: "" }
    ],
    hint: "Relative frequency: divide. Expected frequency: multiply.",
    why: "Relative frequency = 40 &divide; 250 = <b>0.16</b>. Expected 5s in 1000 spins = 0.16 &times; 1000 = <b>160</b>. That is what you would expect on average, not a guarantee.",
    link: ["stats-probability", 3] },

  { s: "stats", type: "num",
    q: "In a class of 30, 18 play football, 12 play tennis and 5 play both.",
    boxes: [
      { label: "How many play neither?", a: 5, tol: 0, post: "" },
      { label: "P(a random student plays tennis but not football)", a: 7 / 30, tol: 0.005, post: "" }
    ],
    hint: "Fill a Venn diagram from the middle out: the 5 who play both are inside the 18 and the 12.",
    why: "Football only: 18 &minus; 5 = 13. Tennis only: 12 &minus; 5 = 7. Neither: 30 &minus; 13 &minus; 5 &minus; 7 = <b>5</b>. P(tennis not football) = <b>7/30</b> (about 0.23). Adding 18 + 12 would count the 5 twice.",
    link: ["stats-probability", 5] },

  { s: "stats", type: "num",
    q: "A bus is late with probability 0.2 each day, independently. Think about two days.",
    boxes: [
      { label: "P(late on both days)", a: 0.04, tol: 0.001, post: "" },
      { label: "P(late on exactly one day)", a: 0.32, tol: 0.001, post: "" }
    ],
    hint: "Draw a tree: late 0.2, not late 0.8 on each day. Multiply along the branches; for exactly one, two routes work.",
    why: "Both: 0.2 &times; 0.2 = <b>0.04</b>. Exactly one: late then on time 0.2 &times; 0.8 = 0.16, plus on time then late 0.8 &times; 0.2 = 0.16, total <b>0.32</b>. Forgetting the second route is the usual slip.",
    link: ["stats-probability", 7] }
]);
