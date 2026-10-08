/* ==========================================================
   EGW's GCSE HQ - swipe deck cards: GCSE Statistics (Edexcel 1ST0)
   40 quick true or false fact cards, content on both tiers only.
   Each links to the activity chunk that teaches it:
   [activity id, chunk number].
   ========================================================== */
window.EGWSWIPE = (window.EGWSWIPE || []).concat([

  /* ---------- sampling and collecting data ---------- */
  { s: "stats", t: "Bonnie the poodle's mass in kg is discrete data, because it is a number.", a: false,
    fix: "False. Mass is measured, so it is continuous: Bonnie could weigh 6.37 kg. Discrete data is counted, like how many birds Jay has.", link: ["stats-sampling", 1] },
  { s: "stats", t: "In a simple random sample, every member of the population has an equal chance of being chosen.", a: true,
    fix: "Yes. That is what random means in statistics: not whoever is handy, but the same chance for everyone on the sampling frame.", link: ["stats-sampling", 3] },
  { s: "stats", t: "Taking a bigger sample fixes a biased sampling method.", a: false,
    fix: "False. A bigger sample makes results more reliable, but a biased method stays biased. Asking 500 people leaving a gym still misses people who never go.", link: ["stats-sampling", 5] },
  { s: "stats", t: "'Don't you agree school starts too early?' is a leading question.", a: true,
    fix: "Yes. It nudges people towards agreeing. A neutral version: 'What do you think of the school start time?'", link: ["stats-sampling", 6] },
  { s: "stats", t: "A hypothesis should be written as a question, such as 'Do Year 11s sleep less?'", a: false,
    fix: "False. A hypothesis is a statement you can test, like 'Year 11 students sleep less than Year 7 students.' It could turn out to be wrong.", link: ["stats-sampling", 7] },

  /* ---------- cleaning data ---------- */
  { s: "stats", t: "Clean your data before you calculate anything, because one bad value can wreck a mean.", a: true,
    fix: "Yes. In the enquiry cycle, cleaning comes after collecting and before processing. Keep a note of each change so someone else could check it.", link: ["stats-cleaning", 1] },
  { s: "stats", t: "A spreadsheet may count 'Yes', 'yes' and 'Y' as three different answers.", a: true,
    fix: "Yes. So recode them all to one form, such as Yes, before you count. Otherwise one group gets split into three.", link: ["stats-cleaning", 2] },
  { s: "stats", t: "If someone leaves 'number of pets' blank, count their answer as zero.", a: false,
    fix: "False. A blank is not a zero: you do not know the answer. Leave it out of that calculation and divide by the number of values you used.", link: ["stats-cleaning", 3] },
  { s: "stats", t: "An outlier should be removed even after it has been checked and found to be genuine.", a: false,
    fix: "False. A genuine value stays, even if it is awkward. Only remove a value if it is an error, and check it against the original source first.", link: ["stats-cleaning", 4] },
  { s: "stats", t: "Class intervals of '10 to 20 minutes' and '20 to 30 minutes' do not overlap.", a: false,
    fix: "False. A time of 20 fits in both, so they overlap. Inequalities fix it: 10 &lt; t &le; 20, then 20 &lt; t &le; 30.", link: ["stats-cleaning", 6] },

  /* ---------- experiments ---------- */
  { s: "stats", t: "The explanatory variable is the one you change; the response variable is the one you measure.", a: true,
    fix: "Yes. Anything else that could affect the response is an extraneous variable. Keeping those the same makes it a fair test.", link: ["stats-experiments", 1] },
  { s: "stats", t: "In a natural experiment, the experimenter does not change the explanatory variable.", a: true,
    fix: "Yes. It changes by itself and the experimenter just records what happens. Little control and hard to repeat, but good for things you could not set up.", link: ["stats-experiments", 3] },
  { s: "stats", t: "If results are reliable, they must also be valid.", a: false,
    fix: "False. Reliable means you get similar results again; valid means it measures the right thing. A tape measure missing its first 10 cm is reliable but wrong.", link: ["stats-experiments", 4] },
  { s: "stats", t: "If the data supports a hypothesis, you can say the experiment proves it.", a: false,
    fix: "False. Data supports, or does not support, a hypothesis. It never proves it: another experiment could give different results.", link: ["stats-experiments", 5] },

  /* ---------- tables and charts ---------- */
  { s: "stats", t: "A pie chart shows proportions, but not how many, unless you know the total.", a: true,
    fix: "Yes. Frequency = angle &divide; 360 &times; total. A 90&deg; sector is 30 people out of 120, but only 10 people out of 40.", link: ["stats-charts", 3] },
  { s: "stats", t: "Without a key, '1 | 2' in a stem and leaf diagram could mean 12, 1.2 or 120.", a: true,
    fix: "Yes. That is why every stem and leaf diagram needs a key, such as '1 | 2 means 12 seconds'.", link: ["stats-charts", 4] },
  { s: "stats", t: "On a frequency polygon, you plot each point at the top end of its class.", a: false,
    fix: "False. A frequency polygon uses the midpoint of each class. The top end is for cumulative frequency, and the two are easy to mix up.", link: ["stats-charts", 5] },
  { s: "stats", t: "When a bar chart's frequency axis starts at 40, small differences can look huge.", a: true,
    fix: "Yes. That is a truncated axis, a classic misleading graph trick. In the exam, name the trick and its effect: the difference looks much bigger than it is.", link: ["stats-charts", 8] },

  /* ---------- averages and spread ---------- */
  { s: "stats", t: "The range is one of the three averages.", a: false,
    fix: "False. The range measures spread: largest minus smallest. The three averages are the mean, the median and the mode.", link: ["stats-averages", 1] },
  { s: "stats", t: "One very large value changes the mean much more than the median.", a: true,
    fix: "Yes. The mean uses every value, so an outlier drags it. Pocket money &pound;8, &pound;10, &pound;12, &pound;15, &pound;80: mean &pound;25, median &pound;12.", link: ["stats-averages", 2] },
  { s: "stats", t: "Frequency table mean: divide the total of f &times; x by the number of rows.", a: false,
    fix: "False. Divide by the total frequency, which is how many values there are, not by the number of rows in the table.", link: ["stats-averages", 3] },
  { s: "stats", t: "An estimated mean from grouped data uses the midpoint of each class.", a: true,
    fix: "Yes. You do not know the exact values, so you assume each one sits at its class midpoint. That is why it is only an estimate.", link: ["stats-averages", 4] },
  { s: "stats", t: "A smaller interquartile range means the data is more spread out.", a: false,
    fix: "False. A smaller IQR means the middle half is bunched closer together, so the data is more consistent. A bigger IQR means more varied.", link: ["stats-averages", 8] },

  /* ---------- scatter graphs and correlation ---------- */
  { s: "stats", t: "Negative correlation means that as one variable goes up, the other tends to go down.", a: true,
    fix: "Yes. Describe it with type, strength and context: 'As the temperature rises, hot chocolate sales tend to fall.'", link: ["stats-correlation", 2] },
  { s: "stats", t: "Ice cream sales and sunburn cases are correlated, so ice cream must cause sunburn.", a: false,
    fix: "False. Correlation does not prove causation. Hot sunny weather is a third variable that pushes both up.", link: ["stats-correlation", 3] },
  { s: "stats", t: "A line of best fit has to pass through the origin, (0, 0).", a: false,
    fix: "False. It does not need to go through (0, 0) or through any data point. It should go through the double mean point and follow the trend.", link: ["stats-correlation", 4] },
  { s: "stats", t: "Predicting outside the range of the data is called extrapolation, and it can be unreliable.", a: true,
    fix: "Yes. There is no data to show the pattern carries on. Predicting inside the range is interpolation, which is fairly reliable.", link: ["stats-correlation", 5] },

  /* ---------- time series ---------- */
  { s: "stats", t: "Seasonal variation means the general direction of the data over several years.", a: false,
    fix: "False. That is the trend. Seasonal variation is a pattern that repeats over a fixed period, like gas use peaking every winter.", link: ["stats-time-series", 2] },
  { s: "stats", t: "A 4 point moving average suits quarterly data, because a year has four quarters.", a: true,
    fix: "Yes. Each window holds one of every season, so the highs and lows cancel out and the trend shows through.", link: ["stats-time-series", 3] },
  { s: "stats", t: "A 4 point moving average is plotted at the 4th time period it covers.", a: false,
    fix: "False. Plot it at the middle of its period: halfway between the 2nd and 3rd. Odd window, on a point; even window, between two points.", link: ["stats-time-series", 4] },
  { s: "stats", t: "A trend line is drawn through the moving averages, not through the original zigzag data.", a: true,
    fix: "Yes. The moving averages smooth out the seasons, so a straight line through them, balanced either side, shows the trend.", link: ["stats-time-series", 5] },

  /* ---------- index numbers and rates ---------- */
  { s: "stats", t: "In an index number series, the base year has an index of 100.", a: true,
    fix: "Yes. Index = price this year &divide; price in the base year &times; 100, so the base year itself gives exactly 100.", link: ["stats-index-numbers", 1] },
  { s: "stats", t: "An index of 85 means the price is 85% higher than in the base year.", a: false,
    fix: "False. It is 15% lower, because 100 &minus; 85 = 15. Index minus 100 gives the percentage change since the base year.", link: ["stats-index-numbers", 1] },
  { s: "stats", t: "Index numbers let you compare price rises fairly between cheap and expensive items.", a: true,
    fix: "Yes. A 30p rise on a 60p bar (index 150) is a far bigger change than &pound;2.10 on a &pound;21 ticket (index 110).", link: ["stats-index-numbers", 2] },
  { s: "stats", t: "Town A has more births than Town B, so Town A must have the higher birth rate.", a: false,
    fix: "False. A bigger town will have more births anyway. Compare rates per 1000 people: births &divide; population &times; 1000.", link: ["stats-index-numbers", 5] },

  /* ---------- probability and risk ---------- */
  { s: "stats", t: "If P(rain) = 0.15, then P(no rain) = 0.85.", a: true,
    fix: "Yes. The probabilities of all the possible outcomes add up to 1, so P(not A) = 1 &minus; P(A).", link: ["stats-probability", 1] },
  { s: "stats", t: "With two coins, HT and TH are the same outcome, so there are three outcomes.", a: false,
    fix: "False. HT and TH are different, so there are four: HH, HT, TH, TT. That makes P(one head and one tail) = 2/4.", link: ["stats-probability", 2] },
  { s: "stats", t: "If P(red) = 0.25, the expected number of reds in 200 spins is 50.", a: true,
    fix: "Yes. Expected frequency = probability &times; trials = 0.25 &times; 200 = 50. It is an average, not a promise: you might get 46 or 55.", link: ["stats-probability", 3] },
  { s: "stats", t: "If a headline says a risk has doubled, the risk must now be high.", a: false,
    fix: "False. Ask: doubled from what? 1 in 10 000 rising to 2 in 10 000 is a relative risk of 2, but still a tiny absolute risk.", link: ["stats-probability", 4] },
  { s: "stats", t: "A fair coin landed on heads five times in a row, so tails is more likely next.", a: false,
    fix: "False. Coin throws are independent: the coin has no memory. P(tails) is still 0.5. For independent events, P(A and B) = P(A) &times; P(B).", link: ["stats-probability", 6] }

]);
