/* ==========================================================
   Chilton Bridge School - the Cultural Calendar, 2026/27
   Every week of the year for the page at /cc/.
   One file: change it here and the page changes.

   A WEEK LOOKS LIKE THIS
     id      short name, no spaces. Also the page's link:
             cbsbase5.github.io/cc/#festivals-of-light
     half    a1, a2, sp1, sp2, su1, su2
     start   the Monday (yyyy-mm-dd). The week opens that day.
     end     the Friday.
     draft   true means the dates were moved on from last
             year's calendar and still need checking.
     title   the short name on its tile
     long    the full name, from the calendar
     q       the big question
     why     one line, kept short
     try     three to five ideas: [icon, a few words]
     jobs    four keys from JOBS below
     game    { title, href, verb, blurb } or null for the
             mystery box and the pitch builder
     more    optional extra links: [[title, href], ...]
     look    the takeover:
               bg, bg2   the background, top and bottom
               ink       words on the background
               pop, pop2 two bright colours for the art
               motif     the big picture (an icon name)
               pattern   dots, rays, stripes, confetti,
                         stars, waves, grid, snow
               scene     a hand drawn scene, if the week has one
                         (only "festivals" so far)

   Icons are the names drawn in /cc/cc-art.js.
   Plain ASCII only. Use ' for apostrophes.
   ========================================================== */

window.B5CC = {

  halves: [
    { id:"a1",  name:"Autumn 1" },
    { id:"a2",  name:"Autumn 2" },
    { id:"sp1", name:"Spring 1", note:"Dates may still move" },
    { id:"sp2", name:"Spring 2", note:"Dates may still move" },
    { id:"su1", name:"Summer 1", note:"Dates may still move" },
    { id:"su2", name:"Summer 2", note:"Dates may still move" }
  ],

  /* Holidays: the big week shows a countdown to the next week.
     Only the two known so far. Add the rest when the 2027 term
     dates are out. Outside these, a gap between weeks just keeps
     showing the last week. */
  holidays: [
    { from:"2026-10-17", to:"2026-11-01", name:"Half term" },
    { from:"2026-12-19", to:"2027-01-03", name:"Christmas holidays" }
  ],

  /* Jobs for the careers strip: key: [icon, job, one line] */
  JOBS: {
    teacher:     ["book", "Teacher", "Answers the same question five times a day. Still loves it."],
    caretaker:   ["key", "Caretaker", "Knows where every single key in the building lives."],
    pastoral:    ["heart", "Pastoral worker", "Paid to notice when your day has gone a bit wrong."],
    office:      ["headset", "Office administrator", "Picks up the phone before it finishes ringing."],
    coach:       ["whistle", "Sports coach", "Gets paid to shout nice things at people and cones."],
    physio:      ["cross", "Physiotherapist", "Fixes the bits of you that go clunk."],
    outdoor:     ["mountain", "Outdoor instructor", "Their office is a hill. Sometimes a lake."],
    trainer:     ["dumbbell", "Personal trainer", "Counts to ten for a living. Very, very slowly."],
    interpreter: ["hand", "BSL interpreter", "Turns talking into signs, live, at full speed."],
    salt:        ["speech", "Speech and language therapist", "Helps people find their words. Any kind of words."],
    deafteacher: ["book", "Teacher of the Deaf", "Teaches in two languages at the same time."],
    access:      ["sign", "Accessibility specialist", "Hunts down anything that shuts people out."],
    carer:       ["cup", "Care worker", "Knows the best biscuit tin in every house on the round."],
    activities:  ["dice", "Activities coordinator", "Runs the bingo. Takes the bingo very seriously."],
    nurse:       ["cross", "Nurse", "Stays calm when nobody else in the room is."],
    museum:      ["museum", "Museum worker", "Looks after things older than your gran's gran."],
    aerospace:   ["rocket", "Aerospace engineer", "Builds things that leave the planet on purpose."],
    astronomer:  ["telescope", "Astronomer", "Works nights. Looks up. A lot."],
    robotics:    ["robot", "Robotics engineer", "Makes machines that do as they are told. Mostly."],
    scicomms:    ["mic", "Science communicator", "Explains the universe without anyone falling asleep."],
    counsellor:  ["speech", "Counsellor", "Listens for a living. Properly listens."],
    youth:       ["people", "Youth worker", "Runs the place everyone ends up after school."],
    psych:       ["brain", "Psychologist", "Works out why people do the things they do."],
    sportspro:   ["ball", "Sports professional", "Living proof that moving is good for your head."],
    chef:        ["chefhat", "Chef", "Makes the sweets that vanish first at every party."],
    photo:       ["camera", "Photographer", "Has to catch a firework in the half second it lasts."],
    events:      ["clipboard", "Event organiser", "Plans the whole night, then spends it worrying about rain."],
    museum2:     ["museum", "Museum worker", "Looks after lanterns and masks hundreds of years old."],
    firefighter: ["helmet", "Firefighter", "Runs towards the thing everyone else runs away from."],
    paramedic:   ["cross", "Paramedic", "Brings the hospital to you, at speed."],
    sailor:      ["anchor", "Royal Navy sailor", "Works on a ship the size of a small town."],
    fundraiser:  ["megaphone", "Charity fundraiser", "Turns sponsored silliness into real money."],
    advocate:    ["megaphone", "Advocacy worker", "Makes sure your voice gets heard in the room."],
    onlinesafe:  ["shield", "Online safety adviser", "Knows every trick a dodgy app can pull."],
    safeguard:   ["heart", "Safeguarding lead", "Their whole job is keeping people safe."],
    volunteer:   ["clipboard", "Volunteer coordinator", "Organises hundreds of helpers. Remembers every name."],
    wildlife:    ["leaf", "Wildlife conservationist", "Spends whole days counting newts. Happily."],
    community:   ["people", "Community worker", "Knows everyone on the street. And their dog."],
    baker:       ["chefhat", "Baker", "Starts work at 4am so that mince pies exist."],
    musician:    ["music", "Musician", "Plays the same carol forty times every December."],
    travel:      ["plane", "Travel professional", "Gets people home for the holidays."],
    photo2:      ["camera", "Photographer", "Has to make a whole family smile at the same time."],
    engineer:    ["gear", "Engineer", "Breaks things on purpose, then makes them better."],
    developer:   ["laptop", "Software developer", "Writes instructions for computers. They ignore some."],
    designer:    ["pencil", "Product designer", "Works out how you will hold it before it exists."],
    envsci:      ["leaf", "Environmental scientist", "Works out what the planet needs next."],
    ptbusy:      ["dumbbell", "Personal trainer", "Busiest week of the year: the first one in January."],
    fireworks:   ["clipboard", "Event organiser", "Plans the fireworks. Hopes very hard for no wind."],
    historian:   ["book", "Historian", "Knows the Romans made new year promises too."],
    coachlife:   ["speech", "Life coach", "Helps people keep promises to themselves."],
    mp:          ["ballot", "Member of Parliament", "Argues for a living, in a very old building."],
    lawyer:      ["scales", "Lawyer", "Reads the small print so you do not have to."],
    journalist:  ["mic", "Journalist", "Asks the questions everyone else dodges."],
    election:    ["clipboard", "Election officer", "Counts votes until 4am. Correctly."],
    dumplings:   ["chefhat", "Chef", "Folds dumplings by the thousand."],
    performer:   ["music", "Performer", "Dances inside a dragon. Cannot see a thing."],
    translator:  ["speech", "Translator", "Lives happily between two languages."],
    calligrapher:["pencil", "Calligrapher", "Writes one character. Spends an hour on it."],
    architect:   ["hardhat", "Architect", "Draws buildings before anyone pours the concrete."],
    gamedev:     ["laptop", "Game developer", "Makes the levels you rage at."],
    labtech:     ["flask", "Lab technician", "Keeps the science running behind the scenes."],
    cyber:       ["padlock", "Cyber security analyst", "Gets paid to think like a hacker."],
    ai:          ["robot", "AI engineer", "Teaches computers. They do not always listen."],
    moderator:   ["shield", "Content moderator", "Decides what stays up and what comes down."],
    webdev:      ["laptop", "Web developer", "Builds websites. Like this one."],
    electrician: ["wrench", "Electrician", "Makes the lights come on. Safely."],
    hair:        ["scissors", "Hairdresser", "Hears everyone's news first."],
    mechanic:    ["car", "Mechanic", "Can tell what is wrong from the noise alone."],
    chefapp:     ["chefhat", "Chef", "Learns knife skills on the job, and gets paid for it."],
    researcher:  ["flask", "Medical researcher", "Hunts for answers nobody has found yet."],
    trains:      ["train", "Engineer", "Builds things that move. Big things."],
    historian2:  ["book", "Historian", "Finds the stories that went missing."],
    writer:      ["pencil", "Writer", "Puts true stories where people will read them."],
    careers:     ["compass", "Careers adviser", "Finds people jobs they did not know existed."],
    tester:      ["laptop", "Game tester", "Plays the same level four hundred times."],
    vetnurse:    ["paw", "Vet nurse", "Cuddles are in the job description. Probably."],
    builder:     ["hardhat", "Builder", "Leaves something behind that stands for a hundred years."],
    datasci:     ["chart", "Data scientist", "Finds patterns in giant piles of numbers."],
    piengineer:  ["gear", "Engineer", "Uses pi a lot more than you would guess."],
    pilot:       ["plane", "Pilot", "Does maths at thirty thousand feet."],
    mathsteach:  ["book", "Maths teacher", "Has strong opinions about pi versus pie."],
    comedian:    ["mic", "Comedian", "Gets paid when people laugh. Goes quiet when they do not."],
    tvprod:      ["camera", "TV producer", "Makes a whole night of telly happen live."],
    charity:     ["heart", "Charity worker", "Turns donations into real help."],
    librarian:   ["book", "Librarian", "Knows exactly the book you need before you do."],
    actor:       ["mask", "Actor", "Remembers a whole play. Forgets their keys."],
    author:      ["pencil", "Author", "Makes people up for a living."],
    narrator:    ["mic", "Audiobook narrator", "Does all the voices. All of them."],
    astronaut:   ["rocket", "Astronaut", "Commute: four hundred kilometres. Straight up."],
    marine:      ["fish", "Marine biologist", "Meets creatures nobody has named yet."],
    historianG:  ["book", "Historian", "Checks whether the dragon was real. Spoiler."],
    roast:       ["chefhat", "Chef", "Makes a Sunday roast on a Thursday."],
    reenactor:   ["mask", "Re-enactor", "Dresses up as a knight at weekends. For fun."],
    farmer:      ["leaf", "Farmer", "Up before the sun, every single day."],
    nutrition:   ["apple", "Nutritionist", "Knows what is in everything. Still eats cake."],
    schoolcook:  ["chefhat", "School cook", "Feeds hundreds of people before the bell."],
    foodsci:     ["flask", "Food scientist", "Invents new crisp flavours. A real job."],
    dietitian:   ["cross", "Dietitian", "Helps people eat in a way that works for them."],
    stats:       ["chart", "Statistician", "Turns a mess of numbers into the truth."],
    codebreaker: ["padlock", "Codebreaker", "Solves puzzles that keep whole countries safe."],
    satellite:   ["satellite", "Satellite engineer", "Builds things you will never see. They are up there."],
    astrophoto:  ["camera", "Astrophotographer", "Stays up all night for one photo."],
    treesurgeon: ["tree", "Tree surgeon", "Climbs trees. Gets paid for it."],
    solar:       ["sun", "Solar engineer", "Turns sunshine into electricity."],
    recycling:   ["bin", "Recycling officer", "Knows which bin. Every time."],
    captain:     ["anchor", "Ship captain", "Their car park is the whole sea."],
    lifeguard:   ["wave", "Lifeguard", "Watches the water so you can play in it."],
    underwater:  ["camera", "Underwater filmmaker", "Holds their breath for the perfect shot."],
    caseworker:  ["hands", "Caseworker", "Helps people find their feet somewhere new."],
    newteacher:  ["book", "Teacher", "Often the first friendly face in a new country."],
    homechef:    ["chefhat", "Chef", "Brings home cooking to a brand new street."],
    graphic:     ["palette", "Graphic designer", "Makes the posters you see everywhere."],
    equality:    ["scales", "Equality officer", "Makes sure the rules are fair for everyone."],
    dj:          ["music", "DJ", "Reads the room. Plays exactly the right song."],
    gamewriter:  ["laptop", "Game writer", "Writes every line the characters say."],
    screen:      ["film", "Screenwriter", "Writes the films. Hardly anyone knows their name."],
    materials:   ["flask", "Materials scientist", "Invents things that could replace plastic."],
    packaging:   ["pencil", "Packaging designer", "Makes boxes you actually want to open."],
    seaclean:    ["fish", "Marine conservationist", "Pulls plastic back out of the sea."],
    chemist:     ["flask", "Chemist", "Mixes things to see what happens. On purpose."],
    sfx:         ["film", "Special effects technician", "Makes the fog in films and on stage."]
  },

  weeks: [

    /* ======================= AUTUMN 1 ======================= */
    {
      id:"new-beginnings", half:"a1", start:"2026-09-03", end:"2026-09-11",
      title:"New Beginnings", long:"New Beginnings: belonging and our school community",
      q:"What makes a place feel like yours?",
      why:"Everyone needs somewhere they feel safe, liked and ready.",
      try:[["door","Find your safe spot in school"],["people","Name two people you trust"],["palette","Add a mark to the shared artwork"],["map","Do the school scavenger hunt"],["puzzle","Play a team building game"]],
      jobs:["teacher","caretaker","pastoral","office"],
      game:{ title:"Personnel File", href:"/tools/profile.html", verb:"Open", blurb:"Fill in a very official file all about you. Fibs allowed." },
      look:{ bg:"#0e7c86", bg2:"#13a3a0", ink:"#ffffff", pop:"#ffd23f", pop2:"#ef7724", motif:"door", pattern:"confetti" }
    },
    {
      id:"fitness-day", half:"a1", start:"2026-09-14", end:"2026-09-18",
      title:"Fitness Day", long:"National Fitness Day",
      q:"What gets you moving without it feeling like a chore?",
      why:"Moving helps your head as much as your body.",
      try:[["shoe","Walk a lap of the site"],["music","Make up a 30 second dance"],["heart","Find your heartbeat, then jump"],["tree","Head out to Forest School"],["horse","Try hobby horsing. Yes, really."]],
      jobs:["coach","physio","outdoor","trainer"],
      game:{ title:"Training Plan", href:"/practice/training-plan.html", verb:"Open", blurb:"Build a routine of your own, then tick off the days you do it." },
      look:{ bg:"#ff5a36", bg2:"#ff8c42", ink:"#1a1a2e", pop:"#fff275", pop2:"#2ec4b6", motif:"shoe", pattern:"rays" }
    },
    {
      id:"sign-languages", half:"a1", start:"2026-09-21", end:"2026-09-25",
      title:"Sign Languages", long:"International Day of Sign Languages",
      q:"How many ways can you talk without speaking?",
      why:"Words are only one way in. Hands, symbols and screens all count.",
      try:[["hand","Learn your name in BSL"],["people","Sign hello to three people"],["speech","Say a sentence in symbols"],["sign","Make a sign everyone can read"],["clock","Five minutes, gestures only"]],
      jobs:["interpreter","salt","deafteacher","access"],
      game:{ title:"Sign It: BSL", href:"/practice/bsl.html", verb:"Play", blurb:"A visual dictionary of BSL signs. Line them up into phrases of your own." },
      look:{ bg:"#5b2a86", bg2:"#8e44ad", ink:"#ffffff", pop:"#ffd166", pop2:"#06d6a0", motif:"hand", pattern:"dots" }
    },
    {
      id:"older-persons", half:"a1", start:"2026-09-28", end:"2026-10-02",
      title:"Generations", long:"International Day of Older Persons",
      q:"What could someone older teach you in ten minutes?",
      why:"Every age has something worth swapping.",
      try:[["mic","Interview someone older"],["clock","Then and now: spot the change"],["dice","Play a game your grandparents played"],["swap","Teach a skill, learn one back"]],
      jobs:["carer","activities","nurse","museum"],
      game:{ title:"Tiny Legends", href:"/practice/tiny-legends.html", verb:"Play", blurb:"Pick an older legend and fight your way through the Memory House." },
      more:[["Tiny Legends: Last Stand","/practice/last-stand.html"],["Ask someone older","/practice/ask-someone-older.html"],["Letters Home","/practice/letters-home.html"]],
      look:{ bg:"#e9a23b", bg2:"#f4c95d", ink:"#3b1f0e", pop:"#b5442c", pop2:"#fff3d6", motif:"cup", pattern:"stripes" }
    },
    {
      id:"black-history-month", half:"a1", start:"2026-10-05", end:"2026-10-09",
      title:"Black History Month", long:"Black History Month, with World Space Week",
      q:"Whose names should everyone know?",
      why:"Black scientists, engineers and astronauts helped build the future we live in.",
      try:[["card","Make a profile card of a Black scientist"],["rocket","Design a space habitat"],["star","Plan a space mission"],["palette","Find an artist inspired by space"]],
      jobs:["aerospace","astronomer","robotics","scicomms"],
      game:{ title:"Sankofa", href:"/practice/sankofa.html", verb:"Play", blurb:"Fly back through Black British history and bring the colour back." },
      look:{ bg:"#1b1b3a", bg2:"#3a1c71", ink:"#ffffff", pop:"#f6bd2b", pop2:"#2ec27e", motif:"sankofa", pattern:"stars" }
    },
    {
      id:"mental-health", half:"a1", start:"2026-10-12", end:"2026-10-16",
      title:"Mental Health Week", long:"World Mental Health and Wellbeing Week",
      q:"What actually helps when your head gets loud?",
      why:"Knowing your own toolkit, and who to ask, makes hard days smaller.",
      try:[["toolbox","Build a wellbeing toolkit"],["people","Name your trusted adults"],["music","Make a calm playlist"],["leaf","Ten minutes outside"],["smile","One kind thing, in secret"]],
      jobs:["counsellor","youth","psych","sportspro"],
      game:{ title:"Endorphin House", href:"/practice/endorphin-house.html", verb:"Play", blurb:"Do satisfying things around a house and collect endorphins." },
      look:{ bg:"#7fd1c1", bg2:"#b8e6d9", ink:"#16324f", pop:"#ff7aa2", pop2:"#ffd166", motif:"heart", pattern:"waves" }
    },

    /* ======================= AUTUMN 2 ======================= */
    {
      id:"festivals-of-light", half:"a2", start:"2026-11-02", end:"2026-11-06",
      title:"Festivals of Light", long:"Festivals of Light and Remembrance: Diwali, Day of the Dead and Bonfire Night",
      q:"Why do people light up the dark?",
      why:"Diwali, Day of the Dead and Bonfire Night all use light to celebrate, remember and get together.",
      try:[["rangoli","Make a rangoli pattern"],["lantern","Build a paper lantern"],["flower","Spot Day of the Dead symbols"],["torch","Play with light and shadow"],["scales","Compare two festivals"]],
      jobs:["chef","photo","events","museum2"],
      /* Deep Diya goes here when it is ready:
         game:{ title:"Deep Diya", href:"/practice/deep-diya.html", verb:"Play", blurb:"..." }, */
      game:null,
      look:{ bg:"#140a2e", bg2:"#3a1460", ink:"#fff7e6", pop:"#ffb627", pop2:"#ff4f81", motif:"diya", pattern:"stars", scene:"festivals" }
    },
    {
      id:"remembrance", half:"a2", start:"2026-11-09", end:"2026-11-13",
      title:"Remembrance", long:"Remembrance, Service and Giving: Armistice Day and Children in Need",
      q:"How do you say thank you to people you never met?",
      why:"Remembering the people who served, and helping the people who need it now.",
      try:[["poppy","Make a poppy artwork"],["clock","Join the two minute silence"],["helmet","Find out who serves near you"],["gift","Try a Children in Need challenge"],["letter","Thank someone who helps"]],
      jobs:["firefighter","paramedic","sailor","fundraiser"],
      game:null,
      look:{ bg:"#a4161a", bg2:"#d90429", ink:"#ffffff", pop:"#161a1d", pop2:"#f5ebe0", motif:"poppy", pattern:"dots" }
    },
    {
      id:"anti-bullying", half:"a2", start:"2026-11-16", end:"2026-11-20",
      title:"Anti-Bullying Week", long:"Anti-Bullying Week: Break the Silence",
      q:"What could you say when something is not OK?",
      why:"Speaking up, getting help and backing each other up stops bullying growing.",
      try:[["speech","Practise a speaking up line"],["people","Know your trusted adults"],["phone","Online or offline: spot it"],["palette","Make a kindness poster"],["hand","Write a class pledge"]],
      jobs:["advocate","onlinesafe","psych","safeguard"],
      game:null,
      look:{ bg:"#0077b6", bg2:"#00b4d8", ink:"#ffffff", pop:"#ffd60a", pop2:"#ff006e", motif:"megaphone", pattern:"stripes" }
    },
    {
      id:"giving-tuesday", half:"a2", start:"2026-11-23", end:"2026-11-27",
      title:"Giving Tuesday", long:"Giving Tuesday: giving, kindness and community",
      q:"What could you give that costs nothing?",
      why:"Time, skills and kindness all count as giving.",
      try:[["smile","Try a kindness challenge"],["search","Research a charity"],["hands","Volunteer for an hour"],["coin","Plan a donation budget"],["toolbox","Fix something for someone"]],
      jobs:["fundraiser","volunteer","wildlife","community"],
      game:null,
      look:{ bg:"#ffbe0b", bg2:"#ffd166", ink:"#2b0f6b", pop:"#fb5607", pop2:"#3a86ff", motif:"gift", pattern:"confetti" }
    },
    {
      id:"christmas-around-the-world", half:"a2", start:"2026-11-30", end:"2026-12-04",
      title:"Christmas Around the World", long:"Christmas Around the World: celebrations, traditions, beliefs",
      q:"How does the rest of the world do December?",
      why:"Same season. Very different music, food, stories and traditions.",
      try:[["globe","Pin traditions on a world map"],["music","Music from three countries"],["tree","Make a decoration from somewhere else"],["chefhat","Taste something festive and new"],["book","Share a family tradition"]],
      jobs:["baker","musician","travel","photo2"],
      game:null,
      look:{ bg:"#0b6e4f", bg2:"#08a045", ink:"#ffffff", pop:"#e63946", pop2:"#ffd166", motif:"tree", pattern:"snow" }
    },
    {
      id:"steam-for-good", half:"a2", start:"2026-12-07", end:"2026-12-11",
      title:"STEAM for Good", long:"STEAM for Good: problem solving",
      q:"What is one problem round here you could actually fix?",
      why:"Science, tech, engineering, art and maths are all just ways of fixing things.",
      try:[["search","Spot a real problem"],["pencil","Sketch a design"],["gear","Build a prototype"],["flask","Test it, break it, fix it"],["mic","Pitch it in 60 seconds"]],
      jobs:["engineer","developer","designer","envsci"],
      game:null,
      look:{ bg:"#3a0ca3", bg2:"#4361ee", ink:"#ffffff", pop:"#4cc9f0", pop2:"#f72585", motif:"gear", pattern:"grid" }
    },

    /* ======================= SPRING 1 (draft dates) ======================= */
    {
      id:"new-year", half:"sp1", start:"2027-01-04", end:"2027-01-08", draft:true,
      title:"New Year, New You?", long:"New Year: traditions, resolutions and dates",
      q:"Does anyone actually keep a New Year's resolution?",
      why:"People have made new year promises for thousands of years. Most give up by February.",
      try:[["list","Write one tiny resolution"],["globe","Find a new year tradition elsewhere"],["calendar","Guess the day people give up"],["clock","Message to you, a year from now"]],
      jobs:["ptbusy","fireworks","historian","coachlife"],
      game:null,
      look:{ bg:"#1d3557", bg2:"#2b5d8a", ink:"#ffffff", pop:"#ffd166", pop2:"#ef476f", motif:"firework", pattern:"confetti" }
    },
    {
      id:"democracy-day", half:"sp1", start:"2027-01-11", end:"2027-01-15", draft:true,
      title:"Democracy Day", long:"Democracy Day in Cape Verde",
      q:"Should everyone get a say?",
      why:"Cape Verde marks the day in 1991 it held its first election with more than one party.",
      try:[["ballot","Run a class vote"],["map","Find Cape Verde on a map"],["speech","Debate one small rule"],["pencil","Design a fair voting system"]],
      jobs:["mp","lawyer","journalist","election"],
      game:null,
      look:{ bg:"#003893", bg2:"#1f4fb2", ink:"#ffffff", pop:"#f7d116", pop2:"#cf2027", motif:"ballot", pattern:"stars" }
    },
    {
      id:"lunar-new-year", half:"sp1", start:"2027-01-18", end:"2027-01-22", draft:true,
      title:"Chinese New Year", long:"Chinese New Year",
      q:"Which animal year were you born in?",
      why:"2027 is the Year of the Goat: lanterns, red envelopes and a lot of noise.",
      try:[["lantern","Make a red lantern"],["horse","Find your zodiac animal"],["dragon","Design a dragon dance"],["letter","Write a good luck message"]],
      jobs:["dumplings","performer","translator","calligrapher"],
      game:null,
      look:{ bg:"#b5121b", bg2:"#e5383b", ink:"#fff8e7", pop:"#ffd60a", pop2:"#7b2cbf", motif:"lantern", pattern:"rays" }
    },
    {
      id:"steam-january", half:"sp1", start:"2027-01-25", end:"2027-01-29", draft:true,
      title:"STEAM Challenge", long:"STEAM activity",
      q:"Can you build it with what is on the table?",
      why:"Engineers usually start with not quite enough. That is the fun part.",
      try:[["gear","Build the tallest tower"],["bridge","Make a paper bridge hold a book"],["pencil","Draw it before you build it"],["flask","Test, tweak, test again"]],
      jobs:["engineer","architect","gamedev","labtech"],
      game:null,
      look:{ bg:"#06d6a0", bg2:"#1b9aaa", ink:"#073b4c", pop:"#ffd166", pop2:"#ef476f", motif:"bridge", pattern:"grid" }
    },
    {
      id:"safer-internet", half:"sp1", start:"2027-02-01", end:"2027-02-05", draft:true,
      title:"Safer Internet Day", long:"Safer Internet Day",
      q:"How do you know if something online is real?",
      why:"Apps, AI and adverts all want something from you. Knowing that keeps you in charge.",
      try:[["robot","Spot the AI made picture"],["padlock","Make a strong password"],["phone","Check an app's settings"],["people","Know who to tell"]],
      jobs:["cyber","ai","moderator","webdev"],
      game:null,
      look:{ bg:"#0f172a", bg2:"#1e3a5f", ink:"#e2e8f0", pop:"#22d3ee", pop2:"#a3e635", motif:"padlock", pattern:"grid" }
    },
    {
      id:"apprenticeships", half:"sp1", start:"2027-02-08", end:"2027-02-12", draft:true,
      title:"Apprenticeship Week", long:"National Apprenticeship Week",
      q:"Could you get paid while you learn?",
      why:"Apprenticeships mean real work, real pay and a qualification at the end.",
      try:[["search","Find an apprenticeship near you"],["hardhat","Look up three jobs"],["speech","Ask an adult about their first job"],["list","List what you are already good at"]],
      jobs:["electrician","hair","mechanic","chefapp"],
      game:null,
      look:{ bg:"#ff9f1c", bg2:"#ffbf69", ink:"#1b2021", pop:"#2ec4b6", pop2:"#cbf3f0", motif:"hardhat", pattern:"stripes" }
    },

    /* ======================= SPRING 2 (draft dates) ======================= */
    {
      id:"lgbt-history-month", half:"sp2", start:"2027-02-22", end:"2027-02-26", draft:true,
      title:"LGBT+ History Month", long:"LGBT+ History Month",
      q:"Whose stories got left out of the history books?",
      why:"LGBT+ people have shaped science, art and history, even when they had to hide who they were.",
      try:[["card","Make a profile card of an LGBT+ scientist"],["calendar","Build a timeline of rights in the UK"],["pencil","Write a short poem"],["speech","Why do some names get forgotten?"]],
      jobs:["researcher","trains","historian2","writer"],
      game:null,
      look:{ bg:"#3d348b", bg2:"#7678ed", ink:"#ffffff", pop:"#f7b801", pop2:"#f35b04", motif:"rainbow", pattern:"rays" }
    },
    {
      id:"careers-week", half:"sp2", start:"2027-03-01", end:"2027-03-05", draft:true,
      title:"Careers Week", long:"National Careers Week",
      q:"What job would you do for free?",
      why:"The things you are into now can point at jobs you have never heard of.",
      try:[["search","Try a careers quiz"],["list","Look at your action plan"],["speech","Ask three adults about their jobs"],["star","Pick a dream job and a backup"]],
      jobs:["careers","tester","vetnurse","builder"],
      game:null,
      look:{ bg:"#118ab2", bg2:"#06aed5", ink:"#ffffff", pop:"#ffd166", pop2:"#ef476f", motif:"compass", pattern:"dots" }
    },
    {
      id:"pi-day", half:"sp2", start:"2027-03-08", end:"2027-03-12", draft:true,
      title:"Pi Day", long:"Pi Day, 14 March",
      q:"Why does every circle hide the same number?",
      why:"Pi is about 3.14 and it never ends. People mark it on 14 March: 3/14.",
      try:[["search","Measure round things with string"],["pi","Make a pi paper chain"],["dice","How many digits can you remember?"],["pencil","Draw a pi skyline"]],
      jobs:["datasci","piengineer","pilot","mathsteach"],
      game:null,
      look:{ bg:"#2d00f7", bg2:"#6a00f4", ink:"#ffffff", pop:"#f20089", pop2:"#ffd60a", motif:"pi", pattern:"grid" }
    },
    {
      id:"red-nose-day", half:"sp2", start:"2027-03-15", end:"2027-03-19", draft:true,
      title:"Red Nose Day", long:"Red Nose Day",
      q:"Can being silly change something serious?",
      why:"Comic Relief turns jokes and red noses into money for people who need it.",
      try:[["nose","Wear something red"],["smile","Tell your worst joke"],["coin","Plan a tiny fundraiser"],["heart","Find out where the money goes"]],
      jobs:["comedian","fundraiser","tvprod","charity"],
      game:null,
      look:{ bg:"#e63946", bg2:"#ff595e", ink:"#ffffff", pop:"#ffca3a", pop2:"#1982c4", motif:"nose", pattern:"dots" }
    },
    {
      id:"shakespeare-week", half:"sp2", start:"2027-03-22", end:"2027-03-26", draft:true,
      title:"Shakespeare Week", long:"National Reading Month and Shakespeare Week",
      q:"Why are we still reading a writer from 400 years ago?",
      why:"Shakespeare wrote down words you still use every day.",
      try:[["book","Find a book you would actually finish"],["mask","Act out a two line scene"],["speech","Learn a Shakespeare insult"],["pencil","Invent a brand new word"]],
      jobs:["librarian","actor","author","narrator"],
      game:null,
      look:{ bg:"#6a4c93", bg2:"#8b5fbf", ink:"#ffffff", pop:"#ffca3a", pop2:"#8ac926", motif:"mask", pattern:"stripes" }
    },
    {
      id:"steam-march", half:"sp2", start:"2027-03-29", end:"2027-04-02", draft:true,
      title:"STEAM Projects", long:"STEAM activity: space, deep sea, virtual world",
      q:"Space, the deep sea or inside a computer: where would you build a base?",
      why:"Three places people cannot easily live. Engineers are working on all three.",
      try:[["rocket","Design a space base"],["fish","Sketch a deep sea station"],["laptop","Build a virtual world"],["gear","Test one part of it"]],
      jobs:["astronaut","marine","gamedev","robotics"],
      game:null,
      look:{ bg:"#03045e", bg2:"#0077b6", ink:"#ffffff", pop:"#90e0ef", pop2:"#ff9e00", motif:"rocket", pattern:"stars" }
    },

    /* ======================= SUMMER 1 (draft dates) ======================= */
    {
      id:"st-georges-day", half:"su1", start:"2027-04-19", end:"2027-04-23", draft:true,
      title:"St George's Day", long:"St George's Day, 23 April",
      q:"Who was St George, and why the dragon?",
      why:"England's patron saint gets a day of feasting and a very old dragon story. He never visited England.",
      try:[["dragon","Draw your own dragon"],["chefhat","Cook a classic English dish"],["map","Find where George came from"],["rose","Make a red rose"]],
      jobs:["historianG","roast","reenactor","farmer"],
      game:null,
      look:{ bg:"#fdf0d5", bg2:"#f3dcae", ink:"#6b0f0f", pop:"#c1121f", pop2:"#386641", motif:"dragon", pattern:"stripes" }
    },
    {
      id:"brain-brilliance", half:"su1", start:"2027-04-26", end:"2027-05-07", draft:true,
      title:"Brain Brilliance", long:"Brain Brilliance: food, mood and health (two weeks)",
      q:"Does what you eat change how you feel?",
      why:"Food, mood and focus are all connected. Picky eaters included.",
      try:[["apple","Try a food rainbow"],["glass","Notice a day with more water"],["brain","Brain food or not? Guess"],["chefhat","Make a snack you would eat again"]],
      jobs:["nutrition","schoolcook","foodsci","dietitian"],
      game:null,
      look:{ bg:"#8ac926", bg2:"#52b788", ink:"#123524", pop:"#ff595e", pop2:"#ffca3a", motif:"apple", pattern:"dots" }
    },
    {
      id:"women-in-maths", half:"su1", start:"2027-05-10", end:"2027-05-14", draft:true,
      title:"Women in Maths", long:"Women in mathematics: Katherine Johnson",
      q:"Could you do the maths that put people in space?",
      why:"Katherine Johnson's sums helped send astronauts into orbit and bring them home.",
      try:[["rocket","Plot a rocket's path"],["film","Watch Hidden Figures (PG)"],["dice","Race a calculator"],["card","Make a card for a woman in maths"]],
      jobs:["aerospace","datasci","stats","codebreaker"],
      game:null,
      look:{ bg:"#0d1b2a", bg2:"#1b3a5b", ink:"#e0e1dd", pop:"#ffb703", pop2:"#8ecae6", motif:"star", pattern:"grid" }
    },
    {
      id:"astronomy-week", half:"su1", start:"2027-05-17", end:"2027-05-21", draft:true,
      title:"Astronomy Week", long:"Astronomy Week",
      q:"What is up there tonight?",
      why:"Look up this week. The Moon and the planets put on a show.",
      try:[["telescope","Spot the Moon tonight"],["star","Invent your own constellation"],["rocket","Build a straw rocket"],["moon","Track the Moon's shape for a week"]],
      jobs:["astronomer","astronaut","satellite","astrophoto"],
      game:null,
      look:{ bg:"#10002b", bg2:"#3c096c", ink:"#ffffff", pop:"#e0aaff", pop2:"#ffd60a", motif:"moon", pattern:"stars" }
    },

    /* ======================= SUMMER 2 (draft dates) ======================= */
    {
      id:"environment-day", half:"su2", start:"2027-05-31", end:"2027-06-04", draft:true,
      title:"World Environment Day", long:"World Environment Day, 5 June",
      q:"What is one thing you would change to help the planet?",
      why:"World Environment Day asks everyone to do one thing, however small.",
      try:[["leaf","Plant something"],["bin","Do a litter pick"],["search","Check one room for waste"],["palette","Design a poster for change"]],
      jobs:["envsci","treesurgeon","solar","recycling"],
      game:null,
      look:{ bg:"#2d6a4f", bg2:"#40916c", ink:"#ffffff", pop:"#ffd166", pop2:"#b7e4c7", motif:"globe", pattern:"waves" }
    },
    {
      id:"ocean-day", half:"su2", start:"2027-06-07", end:"2027-06-11", draft:true,
      title:"World Ocean Day", long:"World Ocean Day, 8 June",
      q:"How much of the sea have we actually explored?",
      why:"Most of the ocean has never been seen by a person. And the UK is surrounded by it.",
      try:[["map","Label the seas around the UK"],["wave","Make a sea sensory tray"],["fish","Draw a creature nobody has found"],["anchor","Find your nearest port"]],
      jobs:["marine","captain","lifeguard","underwater"],
      game:null,
      look:{ bg:"#0077b6", bg2:"#00b4d8", ink:"#ffffff", pop:"#ffd166", pop2:"#90e0ef", motif:"fish", pattern:"waves" }
    },
    {
      id:"refugee-week", half:"su2", start:"2027-06-14", end:"2027-06-18", draft:true,
      title:"Refugee Week", long:"Refugee Week (or the Summer Solstice)",
      q:"What does courage look like on an ordinary day?",
      why:"Refugee Week celebrates people who rebuilt their lives here, and everything they brought with them.",
      try:[["film","Watch a short film and talk"],["heart","Write about a brave everyday moment"],["chefhat","Try food from a new country"],["hands","Find a way to welcome someone"]],
      jobs:["translator","caseworker","newteacher","homechef"],
      game:null,
      look:{ bg:"#f9c74f", bg2:"#f9844a", ink:"#1d3557", pop:"#43aa8b", pop2:"#577590", motif:"hands", pattern:"dots" }
    },
    {
      id:"pride-month", half:"su2", start:"2027-06-21", end:"2027-06-25", draft:true,
      title:"Pride Month", long:"Pride Month, with the school Pride event",
      q:"What does it mean to be proud of who you are?",
      why:"Pride celebrates LGBTQ+ people, and the right of everyone to be themselves.",
      try:[["palette","Make a Pride badge"],["rainbow","Find out what the colours mean"],["speech","A time you felt proud"],["music","Build the Pride event playlist"]],
      jobs:["events","graphic","equality","dj"],
      game:null,
      look:{ bg:"#ff006e", bg2:"#8338ec", ink:"#ffffff", pop:"#ffbe0b", pop2:"#3a86ff", motif:"rainbow", pattern:"rays" }
    },
    {
      id:"writing-day", half:"su2", start:"2027-06-28", end:"2027-07-02", draft:true,
      title:"National Writing Day", long:"National Writing Day",
      q:"Could you tell a whole story in 24 words?",
      why:"National Writing Day is about writing for fun, not for marks.",
      try:[["pencil","Write a 24 word story"],["dice","Roll a random story start"],["mic","Read it out, or do not"],["book","Swap stories with someone"]],
      jobs:["author","gamewriter","journalist","screen"],
      game:null,
      look:{ bg:"#fefae0", bg2:"#f1dfb6", ink:"#283618", pop:"#bc6c25", pop2:"#606c38", motif:"pencil", pattern:"stripes" }
    },
    {
      id:"plastic-free-july", half:"su2", start:"2027-07-05", end:"2027-07-09", draft:true,
      title:"Plastic Free July", long:"Plastic Free July",
      q:"Could you go a whole day without plastic?",
      why:"Plastic lasts hundreds of years. Lots of it gets used once.",
      try:[["bottle","Count the plastic in one bag"],["bin","Swap one plastic thing"],["toolbox","Make something from rubbish"],["search","Spot plastic you could skip"]],
      jobs:["materials","recycling","packaging","seaclean"],
      game:null,
      look:{ bg:"#2ec4b6", bg2:"#3ddbd9", ink:"#011627", pop:"#ff9f1c", pop2:"#fdfffc", motif:"bottle", pattern:"waves" }
    },
    {
      id:"dry-ice", half:"su2", start:"2027-07-19", end:"2027-07-23", draft:true,
      title:"Dry Ice Science", long:"STEAM: the dry ice experiment",
      q:"What happens when something skips being a liquid?",
      why:"Dry ice goes straight from solid to gas, and it looks like magic.",
      try:[["flask","Watch dry ice fog, with an adult"],["balloon","Blow up a balloon without blowing"],["pencil","Predict first, then watch"],["speech","Explain it in one sentence"]],
      jobs:["chemist","sfx","foodsci","labtech"],
      game:null,
      look:{ bg:"#caf0f8", bg2:"#90e0ef", ink:"#03045e", pop:"#7209b7", pop2:"#f72585", motif:"flask", pattern:"snow" }
    }
  ]
};
