/* ==========================================================
   Base 5 - Today's two, on the home page
   1. Jay's mistake of the day: Jay says something with one thing
      wrong in it. Tap the bit that is wrong, then pick what it
      should say, then read why people slip there. Spotting it
      earns 1 spark for the HQ last opened on that device.
      The slips follow the Autumn 2 targets by name only (never a
      student's own milestone wording: this page is public). On
      the day a shared pillar activity lands, the slip leads into
      it (pins, below); other days rotate through the targets.
   2. Would you rather: Mondays, Wednesdays and Fridays are set in
      that week's time machine year (era, below); Tuesdays and
      Thursdays are silly everyday ones. Picking one reveals a
      twist. Jay and Holly add their own picks from
      /teacher/picks.html (they show after you choose).

   School days only: weekends and holidays keep the last school
   day's pair (before term starts, the first day's pair shows).
   On Cultural Calendar days the would you rather matches the day.

   B5FUN.forDay(date) -> { key, n, target, kindName, slip, wyr,
                           wyrKind, era, event }
     slip: { s: what Jay says, w: the wrong bit, c: [right, other,
             other], f: the fix, y: why people slip here }
     wyr:  [question, choice A, twist A, choice B, twist B]
   Preview any day on the home page with ?funday=2026-11-05

   Add more in the same shapes; the order does not matter.
   Plain ASCII only. Use ' for apostrophes.
   ========================================================== */
window.B5FUN = {

  /* the Autumn 2 targets, by name only, with a short label for the card */
  targets: {
    "eng-infer":     "Reading between the lines",
    "eng-factop":    "Fact or opinion",
    "eng-cohesion":  "Linking ideas",
    "eng-organise":  "Organising writing",
    "eng-punct":     "Punctuation",
    "maths-number":  "Number",
    "maths-shape":   "Shape and measure",
    "ac-arch":       "Architecture",
    "hs-myths":      "Myths and legends",
    "pw-adventure":  "Adventure",
    "pw-balance":    "Balance and control",
    "pfa-careers":   "Careers",
    "pfa-transport": "Getting around",
    "se-earth":      "Earth and sky",
    "rel-assert":    "Speaking up"
  },

  /* the days a shared pillar activity lands (data/a2/_build/plan.py),
     so that day's slip leads into it */
  pins: {
    "2026-11-06": "pfa-transport", "2026-11-09": "ac-arch",      "2026-11-11": "pw-adventure",
    "2026-11-12": "hs-myths",      "2026-11-13": "pfa-careers",  "2026-11-18": "pw-balance",
    "2026-11-20": "pfa-transport", "2026-11-23": "ac-arch",      "2026-11-25": "pw-adventure",
    "2026-11-27": "pfa-careers",   "2026-12-02": "pw-balance",   "2026-12-03": "hs-myths",
    "2026-12-10": "se-earth"
  },

  /* every other school day takes the next target from this list */
  rot: ["eng-punct", "maths-number", "eng-infer", "maths-shape", "se-earth", "eng-factop", "maths-number",
        "rel-assert", "eng-cohesion", "maths-shape", "eng-organise", "pw-balance", "maths-number", "eng-punct",
        "pfa-careers", "maths-shape", "eng-infer", "ac-arch", "eng-factop", "pw-adventure", "hs-myths", "pfa-transport"],

  /* the slips, by target. c[0] is the right one; the page shuffles them. */
  slips: {
    "eng-punct": [
      { s: "On saturday I took Bonnie to the park.", w: "saturday", c: ["Saturday", "SATURDAY", "saturday,"],
        f: "Days of the week start with a capital letter: Saturday.", y: "Days of the week are names, and names get capitals. Months do too." },
      { s: "Bonnies lead is bright orange.", w: "Bonnies", c: ["Bonnie's", "Bonnies'", "Bonnie,s"],
        f: "It is Bonnie's lead. The apostrophe shows the lead belongs to her.", y: "Bonnies with no apostrophe would mean more than one Bonnie, which is a frightening thought." },
      { s: "Where is the remote.", w: "remote.", c: ["remote?", "remote!", "remote,"],
        f: "It is a question, so it needs a question mark: Where is the remote?", y: "Questions often start with where, what, why, who or how. That is the clue." },
      { s: "I bought eggs milk bread and a cake.", w: "eggs milk bread", c: ["eggs, milk, bread", "eggs. Milk. Bread", "eggs! milk! bread"],
        f: "Items in a list are split up with commas: eggs, milk, bread and a cake.", y: "Without commas the list runs together. You usually do not need one before the and." }
    ],
    "eng-infer": [
      { s: "Bonnie hid under the table, shaking, when the fireworks started. She was clearly bored.", w: "bored", c: ["scared", "sleepy", "hungry"],
        f: "Hiding and shaking are clues she was scared, not bored.", y: "Inference means using clues. The words never say scared, but hiding and shaking tell you." },
      { s: "He came in soaking wet, shook out his umbrella and said it was a lovely sunny day.", w: "a lovely sunny day", c: ["pouring with rain", "very windy", "freezing cold"],
        f: "Soaking wet plus an umbrella means it was raining.", y: "Look for clues in what people do and carry, not only in what they say." },
      { s: "Her hands were covered in flour and the kitchen smelled sweet, so she must have been fixing a car.", w: "fixing a car", c: ["baking", "painting", "gardening"],
        f: "Flour and a sweet smell point to baking.", y: "Each clue narrows it down. Flour on its own could be a few things. Flour plus a sweet smell is baking." },
      { s: "The whole crowd groaned and put their heads in their hands, so their team must have scored.", w: "scored", c: ["missed", "won the cup", "bought a pie"],
        f: "Groaning with heads in hands means something went badly. Their team probably missed.", y: "How people react is a strong clue. Cheering would mean a goal." }
    ],
    "eng-factop": [
      { s: "Pizza is the best food in the world, and that is a fact.", w: "that is a fact", c: ["that is my opinion", "that is the law", "that is science"],
        f: "Best is a matter of taste, so it is an opinion.", y: "Words like best, worst, nicest and boring usually signal an opinion. A fact can be checked." },
      { s: "Here is a fact: Bonnie is the cutest dog ever.", w: "a fact", c: ["an opinion", "a measurement", "a law"],
        f: "Cutest is Jay's opinion. A very strong opinion, but an opinion.", y: "If people could fairly disagree, it is an opinion. Somebody out there prefers cats." },
      { s: "London is the capital of England. That is just my opinion.", w: "my opinion", c: ["a fact", "a guess", "a feeling"],
        f: "London being the capital can be checked, so it is a fact.", y: "If you can check it somewhere reliable, like a map or an atlas, it is a fact." },
      { s: "In my opinion, water boils at 100 degrees Celsius.", w: "In my opinion,", c: ["It is a fact that", "Some days,", "On Tuesdays,"],
        f: "It can be tested with a thermometer, so it is a fact, not an opinion.", y: "Saying in my opinion does not turn a fact into an opinion. It can still be checked." }
    ],
    "eng-cohesion": [
      { s: "I wanted to go outside. However, it was sunny, so I went.", w: "However", c: ["Luckily", "Instead", "Although"],
        f: "However means but, and sunshine is not a reason to stay in. Luckily fits.", y: "Linking words carry meaning. However needs something going the other way." },
      { s: "Finally, I boiled the kettle. Then I made a cup of tea.", w: "Finally", c: ["First", "Lastly", "Meanwhile"],
        f: "The kettle comes before the tea, so it needs First.", y: "Order words like first, then and finally have to match what actually happened." },
      { s: "The film was really long. Because of this, it felt very short.", w: "felt very short", c: ["was hard to sit through", "was free", "was in French"],
        f: "Because of this means the next part follows from the last. A long film is hard to sit through.", y: "Linking phrases promise a connection, so the ideas either side have to fit together." },
      { s: "I love birds. For example, I hate them.", w: "I hate them", c: ["robins and blackbirds", "Bonnie", "on Fridays"],
        f: "For example has to be followed by an example of what came before: robins and blackbirds.", y: "For example promises an example, so whatever comes next has to be one." }
    ],
    "eng-organise": [
      { s: "My postcard from China starts: Dear Sir or Madam, I am writing to complain about the Great Wall.", w: "Dear Sir or Madam, I am writing to complain about", c: ["Hi everyone, greetings from", "Chapter One:", "Ingredients:"],
        f: "A postcard to friends is chatty: Hi everyone, greetings from the Great Wall.", y: "Who it is for decides the format. A complaint letter is a whole different shape." },
      { s: "In my travel diary, the whole week goes in one giant paragraph.", w: "one giant paragraph", c: ["a new paragraph for each day", "one bullet point", "a footnote"],
        f: "Start a new paragraph for each day, or each new place.", y: "A new paragraph tells the reader something has changed: time, place, person or topic." },
      { s: "A recipe should start with the method and end with the ingredients.", w: "start with the method and end with the ingredients", c: ["list the ingredients first, then the method", "have no ingredients", "be written as a poem"],
        f: "Ingredients come first, so you can get everything ready, then the method.", y: "Writing is organised around what the reader needs first." },
      { s: "To start a new part of my travel blog, I use a heading in tiny grey letters.", w: "tiny grey letters", c: ["a clear, bold subheading", "no gap at all", "the same font as everything else"],
        f: "A clear subheading signposts the new part.", y: "Signposts help readers find their way, so they need to stand out." }
    ],
    "maths-number": [
      { s: "7 x 8 is 54.", w: "54", c: ["56", "48", "63"],
        f: "7 x 8 is 56.", y: "54 is 6 x 9, a close neighbour. A trick: 5, 6, 7, 8 reads as 56 = 7 x 8." },
      { s: "Any number ending in 5 can be divided by 2 exactly.", w: "by 2", c: ["by 5", "by 3", "by 10"],
        f: "Numbers ending in 5 or 0 divide by 5 exactly. Only even numbers divide exactly by 2.", y: "Even numbers end in 0, 2, 4, 6 or 8. Anything ending in 5 is odd." },
      { s: "5 is a factor of 12.", w: "5", c: ["6", "7", "8"],
        f: "6 is a factor of 12, because 2 x 6 = 12. 12 divided by 5 leaves a remainder.", y: "A factor divides in exactly, with nothing left over." },
      { s: "Rounded to the nearest ten, 47 is 40.", w: "40", c: ["50", "45", "47"],
        f: "47 rounds up to 50, because the 7 is 5 or more.", y: "Look at the ones digit: 5 or more rounds up, 4 or less rounds down." },
      { s: "I estimated 49 x 21 as about 100.", w: "about 100", c: ["about 1,000", "about 70", "about 10,000"],
        f: "Round to 50 x 20, which is 1,000.", y: "Round each number first, then multiply. It is easy to drop a zero." }
    ],
    "maths-shape": [
      { s: "The thermometer says minus 3, so it is warmer than 2 degrees.", w: "warmer", c: ["colder", "exactly as warm", "twice as warm"],
        f: "Minus 3 is colder than 2 degrees: 5 degrees colder.", y: "Below zero, a bigger number means colder. Minus 3 is further down the scale." },
      { s: "A metre is 10 centimetres.", w: "10 centimetres", c: ["100 centimetres", "1,000 centimetres", "12 inches"],
        f: "A metre is 100 centimetres.", y: "10 is how many millimetres are in a centimetre, so the two get swapped. Centi means hundredth." },
      { s: "A room 4 metres by 3 metres has an area of 7 square metres.", w: "7 square metres", c: ["12 square metres", "14 square metres", "7 metres"],
        f: "Area is length times width: 4 x 3 = 12 square metres.", y: "Adding the sides is the start of perimeter. Area is how much floor, so multiply." },
      { s: "On a map where 1 cm stands for 1 km, my 5 cm walk is 50 km.", w: "50 km", c: ["5 km", "500 km", "half a km"],
        f: "Each centimetre is 1 km, so 5 cm is 5 km.", y: "Read the scale carefully: it tells you what one unit on the map is worth." },
      { s: "The jug holds 1.5 litres, which is 150 millilitres.", w: "150 millilitres", c: ["1,500 millilitres", "15 millilitres", "15,000 millilitres"],
        f: "1 litre is 1,000 ml, so 1.5 litres is 1,500 ml.", y: "Milli means thousandth, so times by 1,000." }
    ],
    "ac-arch": [
      { s: "Triangles are the weakest shape you can put in a bridge.", w: "the weakest", c: ["the strongest", "the roundest", "the bendiest"],
        f: "Triangles are one of the strongest shapes: they do not squash out of shape when pushed. Bridges and roofs are full of them.", y: "A square can lean over into a diamond. A triangle cannot change shape without a side breaking." },
      { s: "An arch is strong because all the weight pushes straight down into the middle.", w: "straight down into the middle", c: ["round the curve and down the sides", "up into the sky", "nowhere at all"],
        f: "An arch carries the weight round the curve and down the sides into the ground.", y: "The keystone at the top locks it, but the weight travels round the curve." },
      { s: "Builders put the foundations on the roof.", w: "on the roof", c: ["under the ground", "on the walls", "in the windows"],
        f: "Foundations go under the ground, spreading the building's weight.", y: "Foundations are found at the bottom. That is the clue." },
      { s: "An architect's plan shows the building from the side.", w: "from the side", c: ["from directly above", "from inside a cupboard", "from the future"],
        f: "A plan is drawn from directly above. A drawing from the side is called an elevation.", y: "Architects use different views. Plan means looking straight down." }
    ],
    "hs-myths": [
      { s: "The Minotaur was half man and half horse.", w: "half horse", c: ["half bull", "half eagle", "half fish"],
        f: "The Minotaur was half man, half bull. Half man, half horse is a centaur.", y: "Greek myths are full of mixed up creatures, so they get swapped." },
      { s: "Medusa could turn people to stone just by sneezing at them.", w: "sneezing at them", c: ["looking at them", "singing to them", "poking them"],
        f: "In the myth, anyone who looked at Medusa turned to stone.", y: "Her power is in her eyes, which is why the hero in the story used a shiny shield as a mirror." },
      { s: "King Arthur pulled the sword out of a loaf of bread.", w: "a loaf of bread", c: ["a stone", "a tree", "a horse"],
        f: "In the legend, Arthur pulled the sword from a stone, which proved he should be king.", y: "Legends have lots of famous objects, and they are easy to muddle." },
      { s: "A legend is a story that is completely true, every word of it.", w: "completely true, every word of it", c: ["often based on something real, but stretched", "always about dragons", "written last week"],
        f: "A legend may be based on real people or events, but the story has been stretched over time.", y: "Legends get retold for hundreds of years, and each teller adds a bit." }
    ],
    "pw-adventure": [
      { s: "For a long walk on the moors, flip flops are the best thing to wear.", w: "flip flops", c: ["walking boots", "slippers", "wellies with holes in"],
        f: "Walking boots grip and support your ankles.", y: "Kit has to suit the ground. Rocks and mud need grip." },
      { s: "Before an adventure, nobody needs to know where you are going.", w: "nobody needs to know", c: ["someone at home should know", "only Bonnie should know", "you should keep it a secret"],
        f: "Always tell someone where you are going and when you will be back.", y: "If anything goes wrong, someone knows where to look. It is the first rule of adventures." },
      { s: "On a compass, the needle always points south.", w: "south", c: ["north", "east", "at Jay"],
        f: "The compass needle points north.", y: "Remember the order clockwise: Never Eat Shredded Wheat. North, East, South, West." },
      { s: "Climbers wear a helmet to keep their hair tidy.", w: "to keep their hair tidy", c: ["to protect their head", "to keep warm", "to look taller"],
        f: "Helmets protect against bumps and falling stones.", y: "Safety kit always has a job. Jay's hair is beyond help anyway." }
    ],
    "pw-balance": [
      { s: "It is easier to balance on one leg with your eyes shut.", w: "easier", c: ["harder", "exactly the same", "only easier on Tuesdays"],
        f: "It is harder with your eyes shut. Your eyes help your brain work out which way is up.", y: "Balance uses your eyes, your ears and your muscles together. Take one away and it gets wobbly." },
      { s: "Your sense of balance mostly comes from your elbows.", w: "your elbows", c: ["inside your ears", "your eyebrows", "your knees"],
        f: "Tiny parts deep inside your ears, filled with fluid, help you balance.", y: "That is why spinning round makes you dizzy: the fluid keeps moving after you stop." },
      { s: "Bending your knees makes you less steady when you land a jump.", w: "less steady", c: ["more steady", "taller", "louder"],
        f: "Bending your knees soaks up the landing and keeps you steady.", y: "Stiff legs pass the bump straight up your body." },
      { s: "Standing with your feet close together is the steadiest way to stand.", w: "close together", c: ["about shoulder width apart", "crossed over", "on tiptoe"],
        f: "Feet about shoulder width apart give you a wider, steadier base.", y: "A wider base is harder to tip over, like a table with its legs at the corners." }
    ],
    "pfa-careers": [
      { s: "A vet looks after people's teeth.", w: "people's teeth", c: ["animals", "cars", "computers"],
        f: "A vet looks after animals. A dentist looks after teeth.", y: "Lots of jobs have short names that are easy to mix up." },
      { s: "An electrician mostly fixes leaking pipes.", w: "leaking pipes", c: ["wiring and lights", "shoes", "teeth"],
        f: "Electricians work on wiring, sockets and lights. Plumbers fix pipes.", y: "Both work in houses and both get called out in emergencies, so they get confused." },
      { s: "A CV is a list of your favourite snacks.", w: "your favourite snacks", c: ["your skills and experience", "your passwords", "your enemies"],
        f: "A CV sums up your skills, experience and qualifications for an employer.", y: "CV is short for curriculum vitae: Latin for the story of your life. Snacks optional." },
      { s: "On an apprenticeship, you never get paid while you learn.", w: "never get paid", c: ["get paid", "pay the boss", "get paid in biscuits"],
        f: "Apprentices are paid while they learn on the job.", y: "It is real work with training built in, so it comes with a wage." }
    ],
    "pfa-transport": [
      { s: "A red traffic light means go.", w: "go", c: ["stop", "go faster", "turn left"],
        f: "Red means stop. Green means go.", y: "Red is used for danger and stopping almost everywhere." },
      { s: "The 14:30 train leaves at half past two in the morning.", w: "in the morning", c: ["in the afternoon", "at midnight", "next week"],
        f: "14:30 is the 24 hour clock: half past two in the afternoon.", y: "After 12:00, take away 12 to get the afternoon time. 14 take away 12 is 2." },
      { s: "A return ticket only gets you there, not back.", w: "only gets you there, not back", c: ["gets you there and back", "gets you nowhere", "is always free"],
        f: "A return covers there and back. A single only goes one way.", y: "Return means coming back. That is the clue." },
      { s: "Bus timetables list the times in alphabetical order.", w: "alphabetical order", c: ["time order", "random order", "size order"],
        f: "Timetables go in time order, earliest first.", y: "Find your stop, then read along to the next time after now." }
    ],
    "se-earth": [
      { s: "The air we breathe is mostly oxygen.", w: "mostly oxygen", c: ["mostly nitrogen", "mostly carbon dioxide", "mostly helium"],
        f: "Air is about 78% nitrogen and about 21% oxygen.", y: "We need oxygen, so it feels like it should be the main part. It is only about a fifth." },
      { s: "Granite is a soft rock that crumbles in your hand.", w: "a soft rock that crumbles in your hand", c: ["a very hard rock", "a type of metal", "a liquid"],
        f: "Granite is a very hard rock, used for worktops and old buildings.", y: "Some rocks, like chalk, really do crumble. Granite is not one of them." },
      { s: "Clouds are made of smoke.", w: "smoke", c: ["tiny drops of water or ice", "dust and glitter", "cotton wool"],
        f: "Clouds are billions of tiny water droplets or ice crystals.", y: "They look soft and fluffy, but they are water." },
      { s: "The Earth's core is the coldest part of the planet.", w: "the coldest", c: ["the hottest", "the wettest", "the windiest"],
        f: "The core is the hottest part: roughly as hot as the surface of the Sun.", y: "The deeper you go under our feet, the hotter it gets." }
    ],
    "rel-assert": [
      { s: "Being assertive means getting your own way by shouting.", w: "by shouting", c: ["by saying what you need, calmly and clearly", "by staying silent", "by sulking"],
        f: "Assertive means saying what you think or need, calmly and clearly, while respecting other people.", y: "Shouting is aggressive. Saying nothing is passive. Assertive sits in the middle." },
      { s: "If a friend asks you to do something you do not want to do, you have to say yes.", w: "you have to say yes", c: ["you can say no", "you have to say maybe", "you have to move house"],
        f: "You can say no. A good friend will respect it.", y: "Saying no can feel awkward, but it is allowed, and it is often kinder for both of you." },
      { s: "Saying I feel annoyed when you take my pen without asking is a rude thing to say.", w: "a rude thing to say", c: ["an assertive thing to say", "a secret", "a lie"],
        f: "That is an I statement: it says how you feel and why, without blaming.", y: "I statements talk about your own feelings, so they are less likely to start an argument." },
      { s: "Good eye contact means staring without blinking for a whole minute.", w: "staring without blinking for a whole minute", c: ["looking now and then, as much as feels OK", "never looking at anyone", "winking a lot"],
        f: "Looking now and then, as much as feels OK, is plenty. Looking near someone's face works too.", y: "Eye contact feels different for everyone. Staring is a lot for anybody." }
    ]
  },

  /* [question, choice A, twist A, choice B, twist B]. Set in that week's time machine year. */
  era: {
    "2026": [
      ["Would you rather...", "have a phone that never needs charging", "It only plays one song. Forever.", "have a laptop that never crashes", "It reads everything you type out loud, in Jay's voice."],
      ["Would you rather...", "be invisible for a day", "Only to Bonnie. She keeps walking into you.", "be able to fly for a day", "Only one metre off the ground. Brilliant for puddles."],
      ["Would you rather...", "have every bus turn up the moment you reach the stop", "It always goes to the seaside.", "have every door open by itself for you", "Including the fridge. At 3am. Loudly."]
    ],
    "1999": [
      ["Would you rather...", "go back to 1999 with a smartphone", "No signal, no apps, no wifi. It is a very shiny calculator.", "bring a 1999 computer back to 2026", "It takes four minutes to switch on and sounds like a robot gargling."],
      ["Would you rather...", "use 1999 internet for a week", "Every time someone picks up the house phone, you get kicked off.", "have a 1999 mobile for a week", "The only game on it is a snake. You get very, very good at it."],
      ["Would you rather...", "keep all your photos on a floppy disk", "It cannot even hold one photo from your phone.", "keep all your music on cassettes", "To find a song, you rewind it with a pencil."]
    ],
    "1969": [
      ["Would you rather...", "be an astronaut on the Moon in 1969", "The computer flying your spaceship is less powerful than a calculator.", "watch it live on TV at home", "The TV is black and white and the picture is very fuzzy. Everyone cries anyway."],
      ["Would you rather...", "fly on Concorde's very first flight in 1969", "It is a test flight. There are no snacks.", "ride on the first ever jumbo jet in 1969", "It is so big you lose Bonnie somewhere on board."],
      ["Would you rather...", "go to a giant music festival in 1969", "It rains for three days. Your tent is now a pond.", "stay at home with the radio", "There are only a handful of stations, and one is reading the shipping forecast."]
    ],
    "1851": [
      ["Would you rather...", "visit the Great Exhibition in 1851", "It is in a giant glass building and it is boiling. Someone faints next to the steam engines.", "ride a steam train in 1851", "Open carriage. You arrive covered head to toe in soot."],
      ["Would you rather...", "be a Victorian inventor", "Your invention is a toaster. Nobody has electricity yet.", "be a Victorian photographer", "Everyone has to sit perfectly still for ages. Bonnie refuses."],
      ["Would you rather...", "send a message by telegraph in 1851", "You pay for every word, so you send: BONNIE FINE STOP SEND BISCUITS STOP", "send a letter by horse and cart", "It arrives four days later, smelling slightly of horse."]
    ],
    "1066": [
      ["Would you rather...", "be in Harold's army in 1066", "You have just marched all the way down from Yorkshire. Your feet are not happy.", "be in William's army in 1066", "You crossed the Channel in a wooden boat with your horse. The horse was not impressed."],
      ["Would you rather...", "live in a brand new castle in 1066", "It is made of wood. The stone ones come later.", "live in the village next to it", "You share your house with the pigs. They are warm, at least."],
      ["Would you rather...", "help stitch a giant tapestry about 1066", "It is about 70 metres long and you are on the bit with all the horses.", "be the one who tells the story out loud", "There are no books. You have to remember every word, every night."]
    ],
    "65,000,000 BC": [
      ["Would you rather...", "ride a Triceratops", "Very bumpy, and it stops for leaves every ten seconds.", "ride a giant flying reptile", "No saddle, and it does not really do landings."],
      ["Would you rather...", "be the size of a T. rex", "Your arms are still tiny. You cannot reach your own nose.", "be the size of a tiny dinosaur", "You are very fast, and everything thinks you are a snack."],
      ["Would you rather...", "bring a dinosaur egg back to 2026", "It hatches in Base 5. Bonnie is furious.", "bring back a fossil instead", "It is fossilised dinosaur poo. Scientists call it a coprolite, and it is genuinely rare."]
    ],
    "3026": [
      ["Would you rather...", "have a robot do all your chores in 3026", "It does them perfectly, then asks for a pay rise.", "have a house that cleans itself", "It also cleans you. Every morning. Without asking."],
      ["Would you rather...", "go on holiday to Mars", "The journey takes months. Bring a very long book.", "go on holiday under the sea", "Lovely hotel, but the fish keep staring in through the window."],
      ["Would you rather...", "eat a meal from 3026", "It is a pill that tastes of a roast dinner. Gravy included, somehow.", "cook your own food in 3026", "The oven talks, and it has opinions about your cooking."]
    ]
  },

  /* [question, choice A, twist A, choice B, twist B]. Tuesdays and Thursdays. */
  silly: [
    ["Would you rather...", "have a pet that can talk", "It only talks about you. To everyone.", "have a pet that can tidy your room", "It tidies everything into one big pile. Very neatly."],
    ["Would you rather...", "only be able to whisper", "Everyone leans in closer. Very close.", "only be able to shout", "You are now in charge of all the announcements."],
    ["Would you rather...", "have spaghetti for hair", "Bonnie follows you everywhere.", "have fingers made of chips", "You get hungry every time you count to ten."],
    ["Would you rather...", "always have to hop instead of walk", "You become the fastest hopper in the country. There is a trophy.", "always have to walk backwards", "You always know exactly where you have been."],
    ["Would you rather...", "have a theme tune that plays when you walk in", "It is played on a kazoo.", "have a laugh track after everything you say", "It laughs at the serious bits too."],
    ["Would you rather...", "be able to talk to birds", "They only want to talk about crisps.", "be able to talk to fish", "They forget what they were saying halfway through."],
    ["Would you rather...", "never have to queue again", "You always arrive just after it closes.", "never have to wait for toast", "It is always slightly burnt."],
    ["Would you rather...", "swap voices with Bonnie for a day", "You can only bark, and she gives a long speech about biscuits.", "swap places with Jay for a day", "You have to write tomorrow's would you rather. It is harder than it looks."],
    ["Would you rather...", "have a sandwich that refills itself", "It is always egg.", "have a drink that never goes warm", "It is always slightly too cold. Your teeth hurt."],
    ["Would you rather...", "sneeze glitter", "It is everywhere. Forever.", "hiccup bubbles", "Everyone stops to pop them. Lovely, but slow."],
    ["Would you rather...", "live in a house made of cheese", "You get a lot of visitors. Mice, mainly.", "live in a house made of jelly", "Every time someone shuts the door, the whole house wobbles."],
    ["Would you rather...", "have a remote that pauses real life", "The batteries run out on the good bit.", "have a remote that fast forwards", "You skip lunch by accident."],
    ["Would you rather...", "be followed everywhere by a friendly pigeon", "It brings you one chip every morning. You never ask where from.", "be followed everywhere by a very polite duck", "It quacks once every time you say something clever."],
    ["Would you rather...", "have socks that are always warm", "They are always slightly damp too.", "have shoes that never come undone", "They also never come off."]
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
  ]
};

(function(F){
  function pad(n){ return (n < 10 ? "0" : "") + n; }
  function key(d){ return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parse(iso){ var p = iso.split("-"); return new Date(+p[0], +p[1] - 1, +p[2], 12); }
  function dayNo(d){ return Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(d.getFullYear(), 0, 0)) / 86400000); }
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

  /* every school day this term, in order, from /data/term.js */
  var SD = null;
  function schoolDays(){
    if(SD) return SD;
    SD = [];
    var T = window.B5TERM;
    if(!T || !T.weeks || !T.schoolDays) return SD;
    T.weeks.forEach(function(w){
      T.schoolDays(w).forEach(function(k){ SD.push({ iso: T.iso(T.dateOf(w, k)), week: w }); });
    });
    return SD;
  }
  /* the school day a date belongs to: itself, or the last one before it */
  function resolve(d){
    var t = key(d), L = schoolDays(), best = -1;
    if(!L.length){
      var back = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
      while(back.getDay() === 0 || back.getDay() === 6) back.setDate(back.getDate() - 1);
      return { iso: key(back), date: back, i: -1, week: null };
    }
    for(var i = 0; i < L.length; i++){ if(L[i].iso <= t) best = i; else break; }
    if(best < 0) best = 0;
    return { iso: L[best].iso, date: parse(L[best].iso), i: best, week: L[best].week };
  }
  function eraDay(dow){ return dow === 1 || dow === 3 || dow === 5; }

  F.forDay = function(d){
    d = d || new Date();
    var R = resolve(d), day = R.date, n = dayNo(day), dow = day.getDay(), L = schoolDays();
    /* the slip: a pinned target, or the next one round */
    var tgt, occ;
    if(R.i < 0){ tgt = F.rot[n % F.rot.length]; occ = Math.floor(n / F.rot.length); }
    else {
      var r = 0, seen = {};
      for(var i = 0; i <= R.i; i++){
        tgt = F.pins[L[i].iso] || F.rot[r++ % F.rot.length];
        seen[tgt] = (seen[tgt] || 0) + 1;
      }
      occ = seen[tgt] - 1;
    }
    var pool = F.slips[tgt] || F.slips["maths-number"], slip = pool[occ % pool.length];
    /* the would you rather: the day's event, the week's era, or a silly one */
    var ev = eventOn(day), wyr, kind, era = R.week && R.week.era ? R.week.era : null;
    if(ev){
      var one = ev.pool ? ev.pool[Math.floor((day.getDate() - 1) / 7) % ev.pool.length] : ev;
      wyr = one.wyr; kind = "event";
    } else if(eraDay(dow) && era && F.era[era.year]){
      var pos = 0;
      for(var j = 0; j < R.i; j++) if(L[j].week === R.week && eraDay(parse(L[j].iso).getDay())) pos++;
      wyr = F.era[era.year][pos % F.era[era.year].length]; kind = "era";
    } else {
      var c = 0;
      if(R.i < 0) c = n;
      else for(var k = 0; k < R.i; k++) if(!eraDay(parse(L[k].iso).getDay())) c++;
      wyr = F.silly[c % F.silly.length]; kind = "silly";
    }
    return { key: R.iso, n: n, target: tgt, kindName: F.targets[tgt] || "", slip: slip,
      wyr: wyr, wyrKind: kind, era: kind === "era" ? era : null, event: ev };
  };
})(window.B5FUN);
