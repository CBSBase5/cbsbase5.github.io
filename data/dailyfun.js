/* ==========================================================
   Base 5 - Today's two, on the home page
   1. Jay's mistake of the day: Jay says something with one thing
      wrong in it. Tap the bit you think is wrong, or ask to see it,
      then read why people slip there.
      Each weekday has a subject:
        Monday maths, Tuesday words (spelling and punctuation),
        Wednesday time travel (history), Thursday science,
        Friday Jay's own real life slip. Weekends mix them all.
   2. Would you rather: a time travel choice, with what happens
      next for whichever one you pick. Jay and HB can add their own
      picks from /teacher/picks.html (they show after you choose).

   On Cultural Calendar days (cal, below) both items match the
   day, with a link to that day's game when there is one.

   B5FUN.forDay(date) -> { key, kind, kindName, slip, wyr, event, n }
   B5FUN.today(list)  -> the old one a day picker (still works)
   Preview any day on the home page with ?funday=2026-11-05

   Add more in the same shapes; the order does not matter.
   Plain ASCII only. Use ' for apostrophes.
   ========================================================== */
window.B5FUN = {

  /* [what Jay says, the bit that is wrong, the fix, why people slip here] */
  slips: {
    maths: [
      ["There are 60 seconds in a minute and 60 minutes in an hour, so there are 360 seconds in an hour.", "360 seconds", "60 x 60 is 3,600, so an hour has 3,600 seconds.", "It is easy to do 60 x 6 instead of 60 x 60. Times by 60, then times by 60 again."],
      ["A week has 7 days, so a fortnight has 15 days.", "15 days", "A fortnight is two weeks: 14 days.", "The word comes from fourteen nights. That is the clue hiding in it."],
      ["Half of 50 is 20.", "20", "Half of 50 is 25.", "Halving numbers that end in 5 tens catches people out. Half of 40 is 20, and half of the last 10 is 5 more."],
      ["A triangle has four sides.", "four sides", "A triangle has three sides. Four sides is a quadrilateral.", "Tri means three, like a tricycle has three wheels."],
      ["10% of 80 is 10.", "is 10", "10% of 80 is 8. Divide by 10.", "10% sounds like 10, but it means one tenth. Split 80 into 10 equal parts and take one."],
      ["A metre is 10 centimetres.", "10 centimetres", "A metre is 100 centimetres.", "10 is how many millimetres are in a centimetre, so the two get swapped. Centi means hundredth."],
      ["7 x 8 is 54.", "54", "7 x 8 is 56.", "54 is 6 x 9, a close neighbour. A trick: 5, 6, 7, 8 reads as 56 = 7 x 8."],
      ["Quarter past three is 3:25.", "3:25", "Quarter past three is 3:15.", "A quarter of an hour is 15 minutes, because four quarters make 60."],
      ["A dozen eggs is ten eggs.", "ten eggs", "A dozen is twelve.", "We count in tens almost everywhere, so ten feels right. A dozen is an old way of counting in twelves."],
      ["A square number is any number that ends in a zero.", "ends in a zero", "A square number is a number times itself, like 4, 9, 16 and 25.", "Square numbers really do make squares: 3 rows of 3 dots is 9."],
      ["There are 100 years in a millennium.", "100 years", "A millennium is 1,000 years. 100 years is a century.", "Century and millennium are both long times. Mill comes from the Latin for a thousand."],
      ["Half past four is 4:50.", "4:50", "Half past four is 4:30.", "Half of 100 is 50, but there are 60 minutes in an hour, not 100. Half of 60 is 30."],
      ["The opposite of a mirror image is a translation.", "a translation", "A mirror image is a reflection. A translation is a slide.", "Lots of maths words sound alike. Reflection flips, rotation turns, translation slides."],
      ["A right angle is 180 degrees.", "180 degrees", "A right angle is 90 degrees. 180 degrees is a straight line.", "Both are special angles, so they get swapped. A right angle is a square corner, like the corner of a book."],
      ["0.5 is smaller than 0.25, because 5 is smaller than 25.", "0.5 is smaller than 0.25", "0.5 is bigger. It is the same as 0.50, which is more than 0.25.", "Decimals do not work like whole numbers. Give them the same number of digits, then compare."],
      ["There are 1,000 grams in a pound.", "in a pound", "There are 1,000 grams in a kilogram. A pound is about 454 grams.", "Pounds and kilograms both measure weight, so they get mixed up. Kilo means a thousand."],
      ["An hour and a half is 90 seconds.", "90 seconds", "An hour and a half is 90 minutes.", "The number is right and the unit is wrong. Always check the word after the number."],
      ["A pizza is cut into 8 slices. I ate 2, so I ate half of it.", "half of it", "2 out of 8 is a quarter. Half would be 4 slices.", "Two feels like a half because there are two halves. Look at how many slices there are in total."],
      ["The number 3,070 is three thousand and seven.", "three thousand and seven", "It is three thousand and seventy. The 7 is in the tens column.", "Zeros hold places. Read it column by column: thousands, hundreds, tens, ones."]
    ],
    words: [
      ["The word 'their' means over in that place.", "over in that place", "That is 'there'. 'Their' means belonging to them.", "They sound the same. Spot the word here inside there: there is about places."],
      ["The dog wagged it's tail.", "it's", "The dog wagged its tail. It's means it is.", "Apostrophes often show belonging, but its is the odd one out. Try saying it is: if that does not fit, no apostrophe."],
      ["I went to london on saturday.", "london on saturday", "London and Saturday both need capital letters.", "Names of places, days and months always start with a capital letter."],
      ["Your the best.", "Your", "You're the best. You're means you are.", "Say it out loud as you are. If that works, it needs the apostrophe."],
      ["Do you want to come fishing.", "fishing.", "It is a question, so it ends with a question mark: Do you want to come fishing?", "Questions often start with do, can, are or what. Check how the sentence starts."],
      ["I have two dog's.", "dog's", "I have two dogs. No apostrophe for more than one.", "An apostrophe does not make a plural. It is for belonging (the dog's lead) or missing letters."],
      ["Tomorow is Friday.", "Tomorow", "Tomorrow has one M and two Rs.", "Say it slowly in three parts, to mor row, and you can hear where the double R goes."],
      ["I would of come, but I was busy.", "would of", "It is would have, or would've.", "Would've sounds like would of when you say it fast. Of never comes straight after would, could or should."],
      ["We was late for the bus.", "We was", "In Standard English it is we were.", "Lots of people say we was out loud. In writing, was goes with I, he, she and it, and were goes with we, you and they."],
      ["That was definately the best day.", "definately", "Definitely. There is a finite hiding in the middle.", "People say it fast, so it sounds like ate. Spot the word finite inside: de finite ly."],
      ["There are lots of fishs in the lake.", "fishs", "The plural is fish (or fishes, for lots of different kinds).", "Some words do not add an s: one sheep, two sheep, one fish, lots of fish."],
      ["The childrens coats were everywhere.", "childrens", "It is children's. Children is already plural, so it just needs 's.", "The apostrophe goes straight after the word for the owners. The owners are the children."],
      ["I bought apples pears and bananas.", "apples pears", "Commas separate the items in a list: apples, pears and bananas.", "In a list, a comma goes between each item. Usually not before the last and."],
      ["My birthday is in febuary.", "febuary", "February: a capital F, and an R after the B.", "Lots of people skip the first R when they say it, so they skip it when they spell it too."],
      ["Wich one do you want?", "Wich", "Which, with an H after the W.", "Which and witch sound the same. Which asks a question. A witch has a broomstick."]
    ],
    history: [
      ["The Great Fire of London was in 1066.", "1066", "It was 1666. 1066 is the Battle of Hastings.", "Both dates end in 66, exactly 600 years apart."],
      ["The first person to walk on the Moon was Buzz Lightyear.", "Buzz Lightyear", "It was Neil Armstrong, in 1969. Buzz Aldrin went second.", "Buzz Lightyear was named after Buzz Aldrin, so the names get tangled."],
      ["Doctor Who first appeared on TV in 2005.", "2005", "It started in 1963. 2005 was when it came back.", "The show had a long break after 1989, so lots of people think the 2005 one was the start."],
      ["Dinosaurs and people lived at the same time.", "lived at the same time", "The last big dinosaurs died out about 66 million years before the first people.", "Films and cartoons put them together all the time. The real gap is enormous."],
      ["The Titanic sank on its tenth trip.", "tenth trip", "It sank on its very first voyage, in April 1912.", "It is so famous that people assume it had sailed for years. It sank five days after leaving Southampton."],
      ["The Wright brothers' first flight lasted 12 hours.", "12 hours", "It lasted about 12 seconds.", "Twelve is right but the unit is wrong. Planes got better very fast after 1903."],
      ["The Romans built Hadrian's Wall to keep out the Vikings.", "the Vikings", "It was built around AD 122, hundreds of years before the Vikings, at the northern edge of Roman Britain.", "Invaders get mixed up. Romans came first, then the Anglo Saxons, then the Vikings."],
      ["Queen Victoria was queen during the Second World War.", "Queen Victoria", "Victoria died in 1901. King George VI was king during the Second World War.", "Victoria reigned for so long that she feels like she was there for everything."],
      ["The Second World War ended in 1918.", "1918", "1918 is when the First World War ended. The Second ended in 1945.", "Two world wars, two end dates. The First is 1914 to 1918, the Second is 1939 to 1945."],
      ["The pyramids at Giza were built by the Romans.", "the Romans", "They were built by the ancient Egyptians. The Great Pyramid is about 4,500 years old, far older than Rome.", "Anything really old gets called Roman. The pyramids were already ancient when the Romans saw them."],
      ["Henry VIII had three wives.", "three wives", "He had six.", "A rhyme helps: divorced, beheaded, died, divorced, beheaded, survived."],
      ["People in the Middle Ages thought the Earth was flat.", "thought the Earth was flat", "Most educated people knew it was round. Greek thinkers had worked that out over 2,000 years earlier.", "It is a myth from much later stories, and it stuck."],
      ["The first iPhone came out in 1997.", "1997", "It came out in 2007.", "Ten years out. Phones changed so fast that 2007 already feels like ancient history."],
      ["Mary Seacole and Florence Nightingale were nurses in the Second World War.", "the Second World War", "They cared for soldiers in the Crimean War, in the 1850s.", "Wars blur together. The Crimean War was nearly a hundred years before the Second World War."]
    ],
    science: [
      ["Water boils at 50 degrees Celsius.", "50 degrees", "Water boils at 100 degrees Celsius (at sea level).", "Water is very hot long before it boils. Up a high mountain it really does boil at a bit less than 100."],
      ["The Sun goes round the Earth once a day.", "The Sun goes round the Earth", "The Earth spins once a day, and goes round the Sun once a year.", "It looks like the Sun moves across the sky. It is really us spinning."],
      ["A spider has six legs.", "six legs", "Spiders have eight legs. Insects have six.", "Spiders get called insects, but they are arachnids. Count the legs to tell them apart."],
      ["Light from the Sun reaches Earth in about 8 hours.", "8 hours", "It takes about 8 minutes.", "Light is the fastest thing there is, about 300,000 km every second, so even 150 million km is quick."],
      ["An octopus has six arms.", "six arms", "An octopus has eight arms.", "Octo means eight, like an octagon has eight sides."],
      ["Penguins live at the North Pole.", "the North Pole", "Wild penguins live in the southern half of the world, including Antarctica.", "Polar bears live in the far north and penguins in the south, so they never meet in the wild."],
      ["Plants get their food from the soil.", "from the soil", "Plants make their own food from light, air and water. That is photosynthesis.", "Plants do take water and minerals from the soil, so it looks like that is their food."],
      ["Bats are blind.", "blind", "No bat is blind. Many see well, and some also use echoes to find their way in the dark.", "The saying blind as a bat has been around for centuries. It is just not true."],
      ["Sound travels faster than light.", "Sound travels faster than light", "Light is far faster. That is why you see lightning before you hear the thunder.", "You hear and see things at almost the same time nearby, so the difference is hard to notice."],
      ["Ice is heavier than water, so it sinks.", "heavier than water, so it sinks", "Ice is less dense than water, so it floats. That is why ponds freeze on top.", "Solids are usually denser than liquids. Water is the odd one out."],
      ["Babies have 206 bones and adults have about 300.", "Babies have 206 bones and adults have about 300", "It is the other way round. Babies have about 300, some join together, and adults have 206.", "You would expect bigger people to have more bones. Growing joins some of them up."],
      ["Goldfish can only remember things for 3 seconds.", "3 seconds", "Goldfish can remember things for months, and they can be trained.", "It is a popular joke that turned into a myth."],
      ["Mars is the closest planet to the Sun.", "Mars", "Mercury is the closest. Mars is fourth.", "Mars is the planet people talk about most, so it gets put first."],
      ["Wires are wrapped in plastic because electricity flows through plastic really well.", "flows through plastic really well", "Plastic is an insulator: electricity does not flow through it easily. It keeps the metal inside safe to touch.", "The plastic is there for a reason, so it is easy to guess the wrong reason."],
      ["A whale is a type of fish.", "a type of fish", "Whales are mammals. They breathe air and feed their babies milk.", "Whales live in the sea and have fins, so they look like fish."]
    ],
    jay: [
      ["Bonnie is a poodle, so she is a type of cat.", "a type of cat", "Poodles are dogs. Bonnie would like a word.", "She is small and fluffy, which fools some people. She is definitely a dog."],
      ["I put some salted crisps out for the birds in my garden.", "salted crisps", "Salty food is bad for birds. Seeds, oats or a bit of fruit are much better.", "If people like it, it feels like birds will too. Their bodies cannot cope with much salt."],
      ["Bonnie wagged her tail when I got home.", "wagged her tail", "Bonnie has no tail. Whatever she wagged, it was not that.", "Dogs and tails go together in our heads. Not every dog has one."],
      ["A robin is a big black bird.", "a big black bird", "A robin is small, with a red orange breast. Big and black sounds more like a crow.", "Jay likes birds, so honestly he should know this one."],
      ["As I always say: my ears are a toilet.", "are a toilet", "It is: my ears are NOT a toilet. One small word changes everything.", "Leave out not and the whole meaning flips."],
      ["I set my alarm for 7pm so I would be up in time for school.", "7pm", "7am is the morning. 7pm is the evening, so Jay would be very late.", "am is before midday and pm is after. It is easy to tap the wrong one."],
      ["I walked Bonnie 2 kilometres, which is 200 metres.", "200 metres", "2 km is 2,000 metres. Kilo means a thousand.", "Moving between units means times or divide by 1,000, and it is easy to drop a zero."],
      ["In the wise words of my late, great grandfather: go.", "go", "The wise words were: stop.", "A classic, said a thousand times. Still got it wrong."],
      ["I paid 50p for a 1 pound coffee and got 50p change.", "got 50p change", "50p is not enough for a 1 pound coffee. Jay still owes 50p.", "You only get change when you pay more than the price."],
      ["Owls can turn their heads all the way round, 360 degrees.", "all the way round, 360 degrees", "Owls can turn their heads about 270 degrees: three quarters of the way round.", "Owls look like they can do a full circle. 270 is still very impressive."],
      ["When I was in China, I climbed the Eiffel Tower.", "the Eiffel Tower", "The Eiffel Tower is in Paris, in France. In China it might have been the Great Wall.", "Famous landmarks get muddled. Paris for the Eiffel Tower."],
      ["I left at 3:45 and got home at 4:15, so the journey took 70 minutes.", "70 minutes", "From 3:45 to 4:15 is 30 minutes.", "Time does not work in hundreds. Count up to the hour first (15 minutes), then 15 more."],
      ["Flamingos are born pink.", "born pink", "Flamingo chicks are grey or white. They turn pink from the food they eat.", "We only ever see the grown up ones, so we picture them pink from the start."],
      ["Bonnie is a toy poodle, so she runs on batteries.", "runs on batteries", "Toy just means the smallest size of poodle. She runs on biscuits.", "Toy has two meanings, and Jay picked the wrong one."],
      ["I ran a marathon before breakfast: all 26 metres of it. Outrageous.", "26 metres", "A marathon is about 26 miles, or 42 km. 26 metres is about one length of a swimming pool.", "Miles and metres both start with m. Very different distances."]
    ],
    /* weekends also use these */
    mix: [
      ["There are 12 months in a year and December is the eleventh.", "the eleventh", "December is the twelfth month. November is the eleventh.", "Dec means ten (like a decade), from an old calendar, so December's name does not help here."],
      ["England's capital is Manchester.", "Manchester", "It is London.", "Manchester is one of England's biggest cities, but the capital is London."],
      ["Christmas Day is the 26th of December.", "the 26th", "Christmas Day is the 25th. The 26th is Boxing Day.", "The two days sit side by side, so they swap easily."]
    ]
  },

  /* [question, choice A, what happens if A, choice B, what happens if B] */
  wyr: [
    ["Would you rather...", "visit the dinosaurs for one hour", "Lovely. Hide behind a fern and do not sneeze.", "visit the year 3026 for one hour", "Lovely. Try not to get run over by something that floats."],
    ["Would you rather...", "meet yourself at age seven", "Seven year old you thinks you are very old and very cool.", "meet yourself at age seventy", "Seventy year old you laughs and will not say why."],
    ["Would you rather...", "time travel with Bonnie", "She is no help at all, but very good company.", "time travel with a T. rex", "Excellent bodyguard. Terrible at fitting in the time machine."],
    ["Would you rather...", "only go backwards in time", "You will never know how anything ends. Bring snacks.", "only go forwards in time", "No going back for anything you forgot. Pack carefully."],
    ["Would you rather...", "watch the first ever football match in 1872", "It finishes 0 0. Still, you were there.", "watch a football match in 2126", "The ball hovers. Nobody is sure if that is allowed."],
    ["Would you rather...", "bring a Victorian kid to 2026", "They are amazed by everything, especially the toaster.", "go to school in Victorian times", "Slates instead of laptops. No PE, just marching."],
    ["Would you rather...", "know your own future", "No surprises, good or bad. Hmm.", "never find out what happens", "Everything stays a surprise. Even Tuesdays."],
    ["Would you rather...", "fix one tiny mistake from your past", "Done. You will never know what else changed.", "leave the past exactly as it is", "Probably wise. Time travel is messy."],
    ["Would you rather...", "live in a castle in 1066", "Draughty, smoky, but you have a moat.", "live in a space station in 2100", "Great view. Showers are tricky."],
    ["Would you rather...", "bring back one extinct animal", "Your pick wanders in. Somebody fetch a bigger fence.", "send one modern invention back 500 years", "People are very confused by your phone. No signal, either."],
    ["Would you rather...", "have a time machine that only goes back one minute", "Perfect for redoing a bad joke.", "have one that only goes forward to Friday", "Every week becomes very short."],
    ["Would you rather...", "see the pyramids being built", "Very hot and very loud. Nobody asks you to help.", "see the Moon landing from Mission Control", "Everybody is holding their breath. You too."],
    ["Would you rather...", "talk to animals in the past", "The dodos have a lot to say.", "talk to robots in the future", "They are very polite and a bit smug."],
    ["Would you rather...", "swap lives with someone from 100 years ago for a day", "No phone, but you get to ride a horse to school.", "swap with someone from 100 years in the future", "You have no idea how anything works. Neither do they, here."],
    ["Would you rather...", "your time machine looked like a phone box", "Classic. Someone keeps trying to make a call.", "your time machine looked like a shopping trolley", "Nobody suspects a thing. The wheels squeak through history."],
    ["Would you rather...", "be famous in the past", "A statue of you, somewhere, with a slightly wrong nose.", "be famous in the future", "Your name is on a spaceship. Spelled wrong."],
    ["Would you rather...", "eat food from 1500", "Lots of bread, some mystery meat, no crisps.", "eat food from 2500", "It comes as a cube. It tastes like toast, apparently."],
    ["Would you rather...", "go back and see your favourite band's first gig", "Twelve people there. One of them is you.", "go forward to their last ever gig", "Bring tissues."],
    ["Would you rather...", "lose your time machine in the past", "You become a very confusing legend.", "lose it in the future", "Someone puts it in a museum and charges you to see it."],
    ["Would you rather...", "have a time machine that is very fast but very loud", "Everyone in history hears you coming.", "one that is very slow but silent", "You arrive just after everything finished."],
    ["Would you rather...", "meet the person who invented school", "You have some questions.", "meet the person who invents the last homework ever", "You shake their hand. Firmly."],
    ["Would you rather...", "visit Chilton Bridge 100 years ago", "Fields everywhere. Someone is ploughing where Base 5 will be.", "visit Chilton Bridge 100 years from now", "There is a statue of Bonnie. Of course there is."],
    ["Would you rather...", "be able to pause time", "Great for lie ins. Terrible for queues, oddly.", "be able to rewind time by ten seconds", "Never drop a sandwich again."],
    ["Would you rather...", "travel back to see a volcano erupt, from far away", "Very loud, very orange, very glad you are far away.", "travel forward to see a new island appear", "It is small, steaming and has no name yet. Name it."],
    ["Would you rather...", "have a robot from the future as a friend", "Helpful, but it corrects your grammar.", "have a knight from the past as a friend", "Loyal, but they challenge the bus driver to a duel."]
  ],

  /* Cultural Calendar days. on: "MM-DD" every year, "YYYY-MM-DD" one year only,
     or { month, weekday } (weekday 0 is Sunday) for every one of those in that month.
     link: [game, href] when the day has its own game; otherwise the Cultural calendar shelf.
     pool: several { slip, wyr } for days that come round more than once. */
  cal: [
    { id: "wmhd", name: "World Mental Health Day", on: ["10-10"], link: ["Endorphin House", "/practice/endorphin-house.html"],
      slip: ["Talking about how you feel is a sign of weakness.", "a sign of weakness", "Talking about feelings takes courage, and it often helps. That is what today is about.", "Old ideas about being tough stick around. Lots of very strong people talk about how they feel."],
      wyr: ["Would you rather...", "unwind with a walk outside", "Fresh air and a bit of sky. Bonnie approves.", "unwind with music in a quiet corner", "Headphones on, world off for a bit. Also good."] },
    { id: "bhm", name: "Black History Month", on: [{ month: 10, weekday: 3 }], link: ["Sankofa", "/practice/sankofa.html"],
      pool: [
        { slip: ["The Windrush arrived in Britain in 1984.", "1984", "HMT Empire Windrush docked at Tilbury in June 1948, bringing people from the Caribbean to live and work in Britain.", "The same four digits, shuffled. 1948, not 1984."],
          wyr: ["Would you rather...", "travel back to Tilbury docks in 1948", "Crowds, suitcases, grey skies and a lot of brave people.", "travel to an early Notting Hill Carnival", "Steel bands and colour everywhere. It began in the 1960s."] },
        { slip: ["Walter Tull was a famous swimmer.", "a famous swimmer", "Walter Tull was a footballer for Tottenham and Northampton, and became one of the first black officers in the British Army.", "His story is told less often than it should be, so the details get lost."],
          wyr: ["Would you rather...", "watch Walter Tull play for Tottenham in 1909", "Heavy leather ball, big crowds, very muddy boots.", "watch Tottenham play in 2109", "The pitch is on a moon. The ball still goes over the bar."] },
        { slip: ["Mary Seacole was a nurse from Scotland.", "from Scotland", "Mary Seacole was born in Jamaica in 1805. She travelled to the Crimean War to care for soldiers.", "She is famous in Britain, so people guess she was British born."],
          wyr: ["Would you rather...", "sail with Mary Seacole to the Crimea", "Weeks at sea, then a lot of hard, brave work.", "help her run the British Hotel for soldiers", "Soup, tea and bandages. Very busy."] },
        { slip: ["Black History Month in the UK is in February.", "February", "In the UK it is October. In the USA it is February.", "Both countries mark it, in different months."],
          wyr: ["Would you rather...", "fly the Sankofa bird back to 1948", "Look back to go forward. The bird knows the way.", "find one true story nobody has told you yet", "Ask someone older. They might surprise you."] }
      ] },
    { id: "halloween", name: "Halloween", on: ["10-31"],
      slip: ["Pumpkins are vegetables that grow underground.", "grow underground", "Pumpkins grow on long vines along the ground, and they are really a fruit: they have seeds inside.", "Lots of big vegetables grow underground, like potatoes. Pumpkins sit on top."],
      wyr: ["Would you rather...", "spend Halloween in a haunted castle in 1500", "Real torches, real draughts, possibly real ghosts.", "spend it on a space station in 2500", "The ghost is a hologram. Still a bit scary."] },
    { id: "bonfire", name: "Bonfire Night", on: ["11-05"],
      slip: ["Guy Fawkes tried to blow up the Houses of Parliament in 1805.", "1805", "It was 1605: the Gunpowder Plot.", "Two hundred years out. 1605 was in the time of King James I."],
      wyr: ["Would you rather...", "watch the fireworks from a hill far away", "Quiet, cold, and the whole sky lights up.", "watch them closer, with ear defenders", "Big colours, warm hands round a cup."] },
    { id: "diwali", name: "Diwali", on: ["2026-11-08"],
      slip: ["Diwali is known as the festival of snow.", "snow", "Diwali is the festival of lights. People light small lamps called diyas.", "It is in the autumn, when it gets dark early, which is part of why the lights matter."],
      wyr: ["Would you rather...", "make a rangoli pattern", "Bright coloured powder, careful hands, a big pattern on the floor.", "light a row of diyas", "Small flames, calm glow, all along the window."] },
    { id: "armistice", name: "Armistice Day", on: ["11-11"],
      slip: ["The First World War ended at 11 o'clock on the 12th of November.", "the 12th", "It ended at 11am on 11 November 1918: the eleventh hour of the eleventh day of the eleventh month.", "The pattern of elevens is the clue."],
      wyr: ["Would you rather...", "find out about someone from your area who served", "Old records can show their name, their street and their job.", "make a poppy to remember them", "Paper, red and black. Simple and careful."] },
    { id: "kindness", name: "World Kindness Day", on: ["11-13"],
      slip: ["Being kind only counts if someone sees you do it.", "only counts if someone sees you do it", "Kindness counts even when nobody notices. Small, quiet kind things still help.", "We notice kind things when we see them, so it feels like that is the point."],
      wyr: ["Would you rather...", "leave a kind note for someone to find", "They never know who it was. Mysterious and kind.", "say something kind to someone's face", "Slightly awkward, then really nice."] },
    { id: "oddsocks", name: "Odd Socks Day", on: ["2026-11-16"],
      slip: ["Odd Socks Day is about wearing socks that match perfectly.", "socks that match perfectly", "It is about odd socks: a fun way to show everyone is different, and that is fine. It starts Anti Bullying Week.", "The name gives it away, but only if you read it twice."],
      wyr: ["Would you rather...", "wear one stripy sock and one spotty sock", "Bold. Very bold.", "wear two different colours", "Subtle odd socks. Only the sharp eyed spot it."] },
    { id: "cin", name: "Children in Need", on: ["2026-11-20"],
      slip: ["Pudsey Bear wears a bandage over his nose.", "over his nose", "Pudsey has a spotty bandana over one eye.", "Everyone knows Pudsey has something on his face. Where is the tricky bit."],
      wyr: ["Would you rather...", "wear something spotty for the day", "Spots everywhere. Very on theme.", "do a sponsored silence", "Very peaceful. Surprisingly hard."] },
    { id: "standrew", name: "St Andrew's Day", on: ["11-30"],
      slip: ["St Andrew is the patron saint of Wales.", "Wales", "St Andrew is the patron saint of Scotland. Wales has St David.", "Four nations, four saints: George, Andrew, David and Patrick."],
      wyr: ["Would you rather...", "climb a Scottish mountain", "Wind, rain, then the best view of your life.", "swim in a Scottish loch", "Very cold. Keep an eye out for anything with a long neck."] },
    { id: "hanukkah", name: "Hanukkah", on: ["2026-12-04"],
      slip: ["Hanukkah lasts for one day.", "one day", "Hanukkah lasts eight nights. One more candle is lit each night.", "Lots of festivals are one day long, so it is easy to assume."],
      wyr: ["Would you rather...", "spin a dreidel", "Round and round, fingers crossed for the right letter.", "eat a warm doughnut", "Sugar on your nose for the rest of the day."] },
    { id: "christmas", name: "Christmas Day", on: ["12-25"],
      slip: ["Christmas Day is the 26th of December.", "the 26th", "Christmas Day is the 25th. The 26th is Boxing Day.", "The two days sit side by side, so they swap easily."],
      wyr: ["Would you rather...", "spend Christmas in Victorian London", "Candles, carol singers and a very big pudding.", "spend Christmas on the Moon", "The paper hats float off. The crackers are very quiet."] },
    { id: "newyear", name: "New Year's Day", on: ["01-01"],
      slip: ["There are 364 days in a normal year.", "364 days", "A normal year has 365 days. A leap year has 366.", "52 weeks of 7 days is 364, so it is very close. There is one day left over."],
      wyr: ["Would you rather...", "see the new year in at midnight", "Fireworks, cheering, very sleepy afterwards.", "wake up early on New Year's Day", "Quiet streets, a fresh start, nobody else about."] },
    { id: "burns", name: "Burns Night", on: ["01-25"],
      slip: ["Robert Burns was a famous Welsh footballer.", "a famous Welsh footballer", "Robert Burns was a Scottish poet, born in 1759. Burns Night marks his birthday.", "Famous names get mixed up across sports, poems and countries."],
      wyr: ["Would you rather...", "write a four line poem about your day", "It does not even have to rhyme.", "listen to someone else read theirs", "Easy. Clapping is optional."] },
    { id: "cny", name: "Chinese New Year", on: ["2027-02-06"],
      slip: ["2027 is the Year of the Dragon.", "the Dragon", "2027 is the Year of the Goat. The Dragon was 2024.", "There are twelve animals in turn, so they are easy to lose track of."],
      wyr: ["Would you rather...", "watch a lion dance", "Drums, cymbals and a lion that blinks.", "make a red paper lantern", "Folded, cut and hung up. Red is for luck."] },
    { id: "pancake", name: "Pancake Day", on: ["2027-02-09"],
      slip: ["Pancake Day is always on a Friday.", "a Friday", "Pancake Day is Shrove Tuesday, so it is always a Tuesday. The date moves because it depends on Easter.", "The date changes every year, so people assume the day does too."],
      wyr: ["Would you rather...", "flip a pancake really high", "Will it land? Nobody knows. Not even the pancake.", "have one with lemon and sugar", "Classic. No flipping needed."] },
    { id: "stdavid", name: "St David's Day", on: ["03-01"],
      slip: ["The symbols of Wales are the rose and the thistle.", "the rose and the thistle", "For Wales it is the daffodil and the leek. The rose is England's and the thistle is Scotland's.", "Each nation has its own plant, so they are easy to swap."],
      wyr: ["Would you rather...", "explore a Welsh castle", "Wales has hundreds. Pick one with a good tower.", "learn to say hello in Welsh", "Shwmae. Now you can say hello in Wales."] },
    { id: "iwd", name: "International Women's Day", on: ["03-08"],
      slip: ["Marie Curie won a Nobel Prize for inventing the telephone.", "inventing the telephone", "Marie Curie won two Nobel Prizes, in physics and chemistry, for her work on radioactivity.", "Famous scientists and famous inventions get matched up wrongly all the time."],
      wyr: ["Would you rather...", "spend a day in Marie Curie's lab in 1900", "Glowing jars on the shelf. Do not touch.", "fly with Amelia Earhart", "Small plane, big sky, very cold ears."] },
    { id: "stpatrick", name: "St Patrick's Day", on: ["03-17"],
      slip: ["St Patrick is the patron saint of Scotland.", "Scotland", "St Patrick is the patron saint of Ireland.", "Four nations, four saints: George, Andrew, David and Patrick."],
      wyr: ["Would you rather...", "go to a St Patrick's Day parade", "Music, green everywhere, a very tall hat.", "walk the Giant's Causeway", "Thousands of stone columns, like giant stepping stones."] },
    { id: "earthday", name: "Earth Day", on: ["04-22"],
      slip: ["Earth is the biggest planet in the Solar System.", "the biggest planet", "Jupiter is the biggest. More than 1,000 Earths would fit inside it.", "Earth feels huge to us, because it is all we know."],
      wyr: ["Would you rather...", "plant a tree that lives 500 years", "Somebody in 2526 sits in its shade.", "clean a beach for a day", "Sore back, full bags, very clean sand."] },
    { id: "stgeorge", name: "St George's Day", on: ["04-23"],
      slip: ["St George is famous for fighting a giant.", "a giant", "The legend says he fought a dragon.", "Old legends are full of giants and dragons, so they get swapped."],
      wyr: ["Would you rather...", "meet a friendly dragon", "It is very warm to stand next to.", "be a knight for a day", "The armour is heavy. Nobody warned you about the stairs."] }
  ],

  kinds: {
    maths: "Maths Monday", words: "Word Tuesday", history: "Time travel Wednesday", science: "Science Thursday",
    jay: "Jay's own Friday slip", mix: "Weekend mix"
  }
};

(function(F){
  function pad(n){ return (n < 10 ? "0" : "") + n; }
  function key(d){ return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function dayNo(d){ return Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(d.getFullYear(), 0, 0)) / 86400000); }
  /* a count of weeks (Monday to Sunday) since 1970, so each subject moves on once a week */
  function weekNo(d){ return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000 + 3) / 7); }
  function eventOn(d){
    var k = key(d), md = k.slice(5);
    for(var i = 0; i < F.cal.length; i++){
      var e = F.cal[i];
      for(var j = 0; j < e.on.length; j++){
        var o = e.on[j];
        if(typeof o === "string" ? (o === k || o === md) : (d.getMonth() + 1 === o.month && d.getDay() === o.weekday)) return e;
      }
    }
    return null;
  }
  var ORDER = [null, "maths", "words", "history", "science", "jay", null];
  F.forDay = function(d){
    d = d || new Date();
    var n = dayNo(d), ev = eventOn(d), kind = ORDER[d.getDay()] || "mix", slip, wyr;
    if(ev){
      var one = ev.pool ? ev.pool[Math.floor((d.getDate() - 1) / 7) % ev.pool.length] : ev;
      slip = one.slip; wyr = one.wyr;
    } else {
      var list = F.slips[kind];
      if(kind === "mix"){ list = []; for(var s in F.slips) list = list.concat(F.slips[s]); }
      slip = list[(kind === "mix" ? n : weekNo(d)) % list.length];
      wyr = F.wyr[n % F.wyr.length];
    }
    return { key: key(d), n: n, kind: ev ? "event" : kind, kindName: ev ? ev.name : F.kinds[kind], slip: slip, wyr: wyr, event: ev };
  };
  /* the old picker: the day of the year, so it is the same for everyone */
  F.today = function(list){ return list[dayNo(new Date()) % list.length]; };
  /* every slip still in the old shape, for anything that used F.mistakes */
  F.mistakes = [];
  for(var s in F.slips) F.mistakes = F.mistakes.concat(F.slips[s]);
})(window.B5FUN);
