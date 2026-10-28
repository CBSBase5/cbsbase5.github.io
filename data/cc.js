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


  /* More about each job, for its card: key: [outdoors, people, hands on,
     screens (each out of 5), three skills, ways in]. Ways in letters:
     c college course, a apprenticeship, u university, j learn on the job. */
  JOBX: {
    teacher:[1,5,3,2,["Patience", "Explaining", "Planning"],"u"],
    caretaker:[3,2,5,1,["Fixing", "Keeping calm", "Spotting problems"],"jc"],
    pastoral:[1,5,2,2,["Listening", "Kindness", "Staying calm"],"cuj"],
    office:[0,4,1,5,["Organising", "Phone voice", "Quick typing"],"caj"],
    coach:[5,5,4,1,["Encouraging", "Planning drills", "Energy"],"ca"],
    physio:[1,5,5,1,["Knowing the body", "Patience", "Gentle hands"],"ua"],
    outdoor:[5,5,5,0,["Safety", "Climbing and paddling", "Leading groups"],"caj"],
    trainer:[3,5,4,2,["Motivating", "Planning", "Knowing muscles"],"ca"],
    interpreter:[1,5,3,1,["BSL", "Quick thinking", "Concentration"],"ua"],
    salt:[1,5,3,2,["Listening", "Patience", "Creative ideas"],"ua"],
    deafteacher:[1,5,3,2,["BSL", "Explaining", "Patience"],"u"],
    access:[2,4,2,4,["Noticing", "Problem solving", "Design"],"ucj"],
    carer:[1,5,4,1,["Kindness", "Patience", "Reliable"],"caj"],
    activities:[2,5,4,1,["Fun ideas", "Organising", "Energy"],"cj"],
    nurse:[0,5,5,2,["Calm", "Caring", "Quick thinking"],"ua"],
    museum:[0,4,4,2,["Curiosity", "Careful hands", "Storytelling"],"ucj"],
    aerospace:[1,3,4,4,["Maths", "Design", "Teamwork"],"ua"],
    astronomer:[1,2,2,5,["Maths", "Patience", "Night owl"],"u"],
    robotics:[0,3,5,4,["Coding", "Building", "Problem solving"],"ua"],
    scicomms:[2,5,2,4,["Explaining", "Curiosity", "Confidence"],"u"],
    counsellor:[0,5,0,1,["Listening", "Trust", "Calm"],"uc"],
    youth:[3,5,3,1,["Fun", "Listening", "Fairness"],"cuj"],
    psych:[0,5,1,3,["Listening", "Curiosity", "Research"],"u"],
    sportspro:[5,4,5,1,["Training", "Grit", "Teamwork"],"j"],
    chef:[0,3,5,0,["Speed", "Taste", "Teamwork"],"cja"],
    photo:[4,4,3,4,["A good eye", "Patience", "Editing"],"cj"],
    events:[3,5,3,3,["Organising", "Calm", "Lists"],"cj"],
    museum2:[0,4,4,2,["Curiosity", "Careful hands", "Storytelling"],"ucj"],
    firefighter:[5,4,5,1,["Bravery", "Teamwork", "Fitness"],"aj"],
    paramedic:[4,5,5,1,["Calm", "Quick thinking", "Caring"],"ua"],
    sailor:[5,4,5,2,["Teamwork", "Discipline", "Sea legs"],"j"],
    fundraiser:[3,5,2,3,["Persuading", "Ideas", "Confidence"],"cj"],
    advocate:[1,5,1,3,["Speaking up", "Listening", "Fairness"],"cuj"],
    onlinesafe:[0,4,1,5,["Tech know how", "Explaining", "Spotting risks"],"cuj"],
    safeguard:[0,5,1,3,["Noticing", "Trust", "Calm"],"uj"],
    volunteer:[3,5,2,3,["Organising", "Remembering names", "Kindness"],"cj"],
    wildlife:[5,2,4,2,["Patience", "Animal know how", "Outdoorsy"],"uca"],
    community:[4,5,2,2,["Chatting", "Fairness", "Getting things done"],"cuj"],
    baker:[0,2,5,0,["Early starts", "Precise", "Creative"],"caj"],
    musician:[2,4,5,2,["Practice", "Performing", "Listening"],"cuj"],
    travel:[1,5,1,4,["Planning", "Calm", "Geography"],"caj"],
    photo2:[3,5,3,4,["A good eye", "Making people smile", "Editing"],"cj"],
    engineer:[2,3,5,3,["Maths", "Building", "Problem solving"],"ua"],
    developer:[0,3,1,5,["Coding", "Logic", "Patience"],"uaj"],
    designer:[0,3,4,4,["Drawing", "Ideas", "Testing"],"ua"],
    envsci:[4,3,3,4,["Curiosity", "Research", "Outdoorsy"],"u"],
    ptbusy:[3,5,4,2,["Motivating", "Planning", "Knowing muscles"],"ca"],
    fireworks:[4,4,3,3,["Organising", "Safety", "Calm"],"cj"],
    historian:[0,2,2,4,["Curiosity", "Reading", "Detective work"],"u"],
    coachlife:[1,5,0,2,["Listening", "Encouraging", "Asking questions"],"cj"],
    mp:[2,5,1,3,["Speaking", "Arguing", "Listening"],"j"],
    lawyer:[0,4,0,4,["Reading", "Arguing", "Detail"],"ua"],
    journalist:[3,5,1,4,["Asking questions", "Writing", "Curiosity"],"uaj"],
    election:[0,3,3,2,["Accuracy", "Fairness", "Stamina"],"j"],
    dumplings:[0,3,5,0,["Speed", "Taste", "Teamwork"],"cja"],
    performer:[1,4,5,0,["Rhythm", "Fitness", "Teamwork"],"cj"],
    translator:[0,4,0,4,["Two languages", "Listening", "Accuracy"],"u"],
    calligrapher:[0,1,5,0,["Steady hands", "Patience", "Art"],"j"],
    architect:[2,4,3,5,["Drawing", "Maths", "Imagination"],"ua"],
    gamedev:[0,3,1,5,["Coding", "Ideas", "Playtesting"],"uaj"],
    labtech:[0,2,5,3,["Careful", "Organised", "Science"],"ac"],
    cyber:[0,2,1,5,["Puzzles", "Coding", "Thinking sneaky"],"ua"],
    ai:[0,3,1,5,["Maths", "Coding", "Curiosity"],"u"],
    moderator:[0,2,0,5,["Judgement", "Fairness", "Calm"],"j"],
    webdev:[0,3,1,5,["Coding", "Design", "Testing"],"uaj"],
    electrician:[3,3,5,1,["Safety", "Maths", "Fixing"],"ac"],
    hair:[0,5,5,1,["Steady hands", "Chatting", "Style"],"ca"],
    mechanic:[1,2,5,2,["Fixing", "Listening for clues", "Patience"],"ac"],
    chefapp:[0,3,5,0,["Knife skills", "Speed", "Teamwork"],"a"],
    researcher:[0,3,4,4,["Curiosity", "Patience", "Science"],"u"],
    trains:[3,3,5,3,["Maths", "Building", "Problem solving"],"ua"],
    historian2:[0,2,2,4,["Curiosity", "Reading", "Detective work"],"u"],
    writer:[1,2,1,5,["Writing", "Curiosity", "Deadlines"],"uj"],
    careers:[0,5,1,3,["Listening", "Encouraging", "Job know how"],"uc"],
    tester:[0,2,1,5,["Patience", "Noticing bugs", "Gaming"],"j"],
    vetnurse:[1,4,5,1,["Calm", "Caring", "Animal know how"],"ac"],
    builder:[5,3,5,0,["Strength", "Measuring", "Teamwork"],"ac"],
    datasci:[0,3,1,5,["Maths", "Coding", "Spotting patterns"],"u"],
    piengineer:[2,3,5,3,["Maths", "Building", "Problem solving"],"ua"],
    pilot:[3,3,4,4,["Focus", "Maths", "Calm"],"j"],
    mathsteach:[0,5,2,2,["Maths", "Explaining", "Patience"],"u"],
    comedian:[1,5,1,1,["Timing", "Confidence", "Ideas"],"j"],
    tvprod:[1,5,2,4,["Organising", "Ideas", "Calm under pressure"],"uaj"],
    charity:[2,5,2,3,["Kindness", "Organising", "Getting things done"],"cuj"],
    librarian:[0,4,2,3,["Reading", "Organising", "Helping"],"uj"],
    actor:[1,5,4,1,["Remembering lines", "Confidence", "Voices"],"cuj"],
    author:[1,1,1,5,["Imagination", "Writing", "Sticking at it"],"j"],
    narrator:[0,1,1,2,["Voices", "Reading aloud", "Stamina"],"j"],
    astronaut:[5,4,5,4,["Science", "Fitness", "Calm"],"u"],
    marine:[5,2,4,3,["Science", "Swimming", "Patience"],"u"],
    historianG:[0,2,2,4,["Curiosity", "Reading", "Detective work"],"u"],
    roast:[0,3,5,0,["Speed", "Taste", "Teamwork"],"cja"],
    reenactor:[4,4,4,0,["History", "Costume", "Performing"],"j"],
    farmer:[5,2,5,1,["Hard work", "Animals", "Early starts"],"caj"],
    nutrition:[0,4,2,3,["Science", "Explaining", "Food know how"],"u"],
    schoolcook:[0,4,5,0,["Speed", "Organising", "Food safety"],"caj"],
    foodsci:[0,3,4,3,["Science", "Tasting", "Ideas"],"ua"],
    dietitian:[0,5,1,3,["Science", "Listening", "Kindness"],"u"],
    stats:[0,2,0,5,["Maths", "Accuracy", "Spotting patterns"],"u"],
    codebreaker:[0,3,0,5,["Puzzles", "Maths", "Keeping secrets"],"ua"],
    satellite:[0,3,5,4,["Maths", "Building", "Precision"],"ua"],
    astrophoto:[5,1,3,5,["Patience", "Cameras", "Night owl"],"j"],
    treesurgeon:[5,2,5,0,["Climbing", "Safety", "Strength"],"ac"],
    solar:[4,3,4,3,["Maths", "Building", "Safety"],"ua"],
    recycling:[3,4,3,2,["Organising", "Explaining", "Planet know how"],"cj"],
    captain:[5,4,3,3,["Leading", "Navigating", "Calm"],"j"],
    lifeguard:[4,4,4,0,["Swimming", "Watching", "First aid"],"j"],
    underwater:[5,2,4,4,["Diving", "Cameras", "Patience"],"j"],
    caseworker:[1,5,1,3,["Listening", "Organising", "Kindness"],"uj"],
    newteacher:[1,5,3,2,["Patience", "Explaining", "Welcoming"],"u"],
    homechef:[0,3,5,0,["Speed", "Taste", "Teamwork"],"cja"],
    graphic:[0,3,2,5,["Drawing", "Ideas", "Colour"],"cua"],
    equality:[0,5,1,3,["Fairness", "Speaking up", "Listening"],"uj"],
    dj:[1,5,3,4,["Music taste", "Timing", "Reading the room"],"j"],
    gamewriter:[0,3,1,5,["Writing", "Characters", "Jokes"],"uj"],
    screen:[0,3,1,5,["Writing", "Characters", "Sticking at it"],"uj"],
    materials:[0,3,4,3,["Science", "Testing", "Ideas"],"u"],
    packaging:[0,3,4,4,["Drawing", "Ideas", "Making"],"ua"],
    seaclean:[5,3,4,1,["Swimming", "Planet know how", "Teamwork"],"uj"],
    chemist:[0,3,5,3,["Science", "Careful hands", "Curiosity"],"ua"],
    sfx:[1,4,5,2,["Making", "Safety", "Imagination"],"cj"]
  },

  weeks: [

    /* ======================= AUTUMN 1 ======================= */
    {
      id:"new-beginnings", half:"a1", start:"2026-09-03", end:"2026-09-11",
      title:"New Beginnings", long:"New Beginnings: belonging and our school community",
      q:"What makes a place feel like yours?",
      why:"Everyone needs somewhere they feel safe, liked and ready.",
      try:[
        {"i":"door","t":"Find your safe spot in school","mins":10,"need":[],"steps":["Wander round the building with someone you trust.","Notice where you feel calmest: quiet, bright, or busy.","Tell an adult it is your spot, so they know where to find you."],"easier":"Pick a spot from photos or a map instead of walking round.","bigger":"Make a sign or a symbol for your spot."},
        {"i":"people","t":"Name two people you trust","mins":5,"need":["Paper or the doodle pad"],"steps":["Draw yourself in the middle.","Add two people you would go to if something felt wrong.","Add where you can find each of them."],"easier":"Just say the names to an adult.","bigger":"Add people at home and online too, each in a different colour.","note":"If something is happening to you right now, tell any adult you trust. You will not be in trouble for telling.","link":["Open the doodle pad","/tools/doodle.html"]},
        {"i":"palette","t":"Add a mark to the shared artwork","mins":15,"need":["The big shared paper","Pens, paint or stickers"],"steps":["Find a space on the class artwork.","Add something that is you: a colour, a shape, a word.","Have a look at what everyone else added."],"easier":"One colour, one shape. Done.","bigger":"Hide a tiny detail that people have to hunt for."},
        {"i":"map","t":"Do the school scavenger hunt","mins":20,"need":["The hunt list","Someone to go with"],"steps":["Grab a list and a partner.","Find each place and tick it off.","Bring back one thing you did not know was there."],"easier":"Do half the list.","bigger":"Make a hunt for someone else to do."},
        {"i":"puzzle","t":"Play a team building game","mins":15,"need":["A group","A bit of space"],"steps":["Pick a game: human knot, tallest tower or pass the pattern.","Agree one rule as a group before you start.","After, say one thing your team did well."],"easier":"Watch a round first and join in when you are ready.","bigger":"Invent a team game of your own."}
      ],
      jobs:["teacher","caretaker","pastoral","office"],
      game:{ title:"Personnel File", href:"/tools/profile.html", verb:"Open", blurb:"Fill in a very official file all about you. Fibs allowed." },
      look:{ bg:"#0e7c86", bg2:"#13a3a0", ink:"#ffffff", pop:"#ffd23f", pop2:"#ef7724", motif:"door", pattern:"confetti" }
    },
    {
      id:"fitness-day", half:"a1", start:"2026-09-14", end:"2026-09-18",
      title:"Fitness Day", long:"National Fitness Day",
      q:"What gets you moving without it feeling like a chore?",
      why:"Moving helps your head as much as your body.",
      try:[
        {"i":"shoe","t":"Walk a lap of the site","mins":15,"need":["Shoes for outside"],"steps":["Pick a route round the site.","Walk it at your own speed, alone or with someone.","Spot one thing you have never noticed before."],"easier":"Half a lap counts.","bigger":"Time it, then try to beat it next week."},
        {"i":"music","t":"Make up a 30 second dance","mins":15,"need":["A song","A bit of space"],"steps":["Pick a song you like.","Make up four moves and put them in an order.","Do it to the music. Show someone, or don't."],"easier":"Copy someone else's moves.","bigger":"Teach your dance to the group."},
        {"i":"heart","t":"Find your heartbeat, then jump","mins":10,"need":["A timer"],"steps":["Two fingers on your neck or wrist. Count the beats for 15 seconds.","Do 30 seconds of star jumps.","Count again. How much faster is it?"],"easier":"Just feel it change. No counting.","bigger":"Try three different moves and compare them."},
        {"i":"tree","t":"Head out to Forest School","mins":30,"need":["Outdoor clothes"],"steps":["Get outside with your group.","Try one thing that gets you moving: climb, carry, build.","Notice how you feel before and after."],"easier":"A short walk round the edge.","bigger":"Build a mini obstacle course from logs."},
        {"i":"horse","t":"Try hobby horsing. Yes, really.","mins":15,"need":["A hobby horse, or a broom with a sock head","Cones or bags for jumps"],"steps":["Make or borrow a horse.","Set out three low jumps.","Ride the course. Style points count."],"easier":"Just trot in a circle.","bigger":"Run a show jumping contest.","why":"Hobby horsing is a real sport. It started in Finland and now has competitions."}
      ],
      link:["National Fitness Day","https://ukactive.com/national-fitness-day/get-involved/"],
      jobs:["coach","physio","outdoor","trainer"],
      game:{ title:"Training Plan", href:"/practice/training-plan.html", verb:"Open", blurb:"Build a routine of your own, then tick off the days you do it." },
      look:{ bg:"#ff5a36", bg2:"#ff8c42", ink:"#1a1a2e", pop:"#fff275", pop2:"#2ec4b6", motif:"shoe", pattern:"rays" }
    },
    {
      id:"sign-languages", half:"a1", start:"2026-09-21", end:"2026-09-25",
      title:"Sign Languages", long:"International Day of Sign Languages",
      q:"How many ways can you talk without speaking?",
      why:"Words are only one way in. Hands, symbols and screens all count.",
      try:[
        {"i":"hand","t":"Learn your name in BSL","mins":10,"need":["The BSL alphabet"],"steps":["Open the BSL page or an alphabet chart.","Find each letter of your first name.","Fingerspell it slowly, then faster."],"easier":"Just your first letter.","bigger":"Learn the name of everyone on your table.","link":["Open Sign It: BSL","/practice/bsl.html"]},
        {"i":"people","t":"Sign hello to three people","mins":5,"need":[],"steps":["Learn the sign for hello on the BSL page.","Sign it to three people today.","See who signs it back."],"easier":"One person counts.","bigger":"Add 'how are you?' too.","link":["Open Sign It: BSL","/practice/bsl.html"]},
        {"i":"speech","t":"Say a sentence in symbols","mins":10,"need":["Symbol cards or the doodle pad"],"steps":["Pick a short sentence, like 'I want a drink'.","Draw or find a symbol for each word.","Show someone. Can they read it?"],"easier":"Two symbols: want, drink.","bigger":"Make symbol cards for a whole morning routine.","link":["Open the doodle pad","/tools/doodle.html"]},
        {"i":"sign","t":"Make a sign everyone can read","mins":20,"need":["Paper and thick pens"],"steps":["Pick a room or door that needs a sign.","Use a picture, a word and a big clear arrow.","Test it: can someone find the place without asking?"],"easier":"Just a picture.","bigger":"Add the BSL sign for the word."},
        {"i":"clock","t":"Five minutes, gestures only","mins":5,"need":["A timer"],"steps":["Set a timer for five minutes.","No talking. Point, gesture, draw, mime.","After, talk about what was easy and what was hard."],"easier":"Two minutes.","bigger":"Plan something as a group, in silence."}
      ],
      link:["International Day of Sign Languages","https://www.un.org/en/observances/sign-languages-day"],
      jobs:["interpreter","salt","deafteacher","access"],
      game:{ title:"Sign It: BSL", href:"/practice/bsl.html", verb:"Play", blurb:"A visual dictionary of BSL signs. Line them up into phrases of your own." },
      look:{ bg:"#5b2a86", bg2:"#8e44ad", ink:"#ffffff", pop:"#ffd166", pop2:"#06d6a0", motif:"hand", pattern:"dots" }
    },
    {
      id:"older-persons", half:"a1", start:"2026-09-28", end:"2026-10-02",
      title:"Generations", long:"International Day of Older Persons",
      q:"What could someone older teach you in ten minutes?",
      why:"Every age has something worth swapping.",
      try:[
        {"i":"mic","t":"Interview someone older","mins":20,"need":["Three questions","Someone older: family, staff or a neighbour"],"steps":["Pick three questions, like 'What was school like?'","Ask, and listen. Jot down the best answer.","Tell someone else the best bit."],"easier":"One question.","bigger":"Record it (ask first) and make a short clip.","link":["Open Ask someone older","/practice/ask-someone-older.html"]},
        {"i":"clock","t":"Then and now: spot the change","mins":15,"need":[],"steps":["Pick a thing: phones, music, school dinners.","Find a picture of it from 50 years ago.","List three things that changed, and one that did not."],"easier":"Just compare two pictures.","bigger":"Make a then and now poster."},
        {"i":"dice","t":"Play a game your grandparents played","mins":15,"need":["Marbles, jacks, cards or a skipping rope"],"steps":["Ask someone older what they used to play.","Learn the rules.","Play a round. Better than you expected?"],"easier":"Watch a round first.","bigger":"Teach it to the whole group."},
        {"i":"swap","t":"Teach a skill, learn one back","mins":20,"need":[],"steps":["Pick something you are good at: a game, an app, a trick.","Teach it to someone older.","Ask them to teach you one of theirs."],"easier":"Show it rather than teach it.","bigger":"Run a skill swap stall."}
      ],
      link:["International Day of Older Persons","https://ageing-better.org.uk/international-day-older-people-1-october-2026"],
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
      try:[
        {"i":"card","t":"Make a profile card of a Black scientist","mins":20,"need":["Card or the doodle pad"],"steps":["Pick someone, like Mae Jemison, Maggie Aderin-Pocock or George Washington Carver.","Find their face, their big idea and one surprising fact.","Make it look like a trading card, with stats."],"easier":"Name, picture and one fact.","bigger":"Make a full deck with your group.","link":["Open the doodle pad","/tools/doodle.html"]},
        {"i":"rocket","t":"Design a space habitat","mins":25,"need":["Paper, junk modelling or the doodle pad"],"steps":["Decide who lives there, and for how long.","Draw where they sleep, eat, grow food and get air.","Label one clever idea that keeps them alive."],"easier":"Draw just the bedroom.","bigger":"Build a model from junk."},
        {"i":"star","t":"Plan a space mission","mins":20,"need":[],"steps":["Pick a place: the Moon, Mars, or somewhere wild.","Choose a crew of three and what each one does.","Pack five things. Only five."],"easier":"Pick the place and one thing to pack.","bigger":"Design the mission patch."},
        {"i":"palette","t":"Find an artist inspired by space","mins":15,"need":[],"steps":["Look up Afrofuturism art with your teacher.","Pick a piece you like.","Make a tiny piece in the same style."],"easier":"Just say what you like about it.","bigger":"Make an album cover for a space band."}
      ],
      link:["World Space Week","https://www.worldspaceweek.org/p/what-is-wsw"],
      jobs:["aerospace","astronomer","robotics","scicomms"],
      game:{ title:"Sankofa", href:"/practice/sankofa.html", verb:"Play", blurb:"Fly back through Black British history and bring the colour back." },
      look:{ bg:"#1b1b3a", bg2:"#3a1c71", ink:"#ffffff", pop:"#f6bd2b", pop2:"#2ec27e", motif:"sankofa", pattern:"stars" }
    },
    {
      id:"mental-health", half:"a1", start:"2026-10-12", end:"2026-10-16",
      title:"Mental Health Week", long:"World Mental Health and Wellbeing Week",
      q:"What actually helps when your head gets loud?",
      why:"Knowing your own toolkit, and who to ask, makes hard days smaller.",
      try:[
        {"i":"toolbox","t":"Build a wellbeing toolkit","mins":15,"need":["A box, a bag or the doodle pad"],"steps":["Think of things that help you feel calm or OK.","Pick five: a song, a fidget, a place, a person, a snack.","Draw them, or put them in a box."],"easier":"Three things.","bigger":"Make a pocket sized card version."},
        {"i":"people","t":"Name your trusted adults","mins":5,"need":[],"steps":["Think who in school you would go to.","Write or draw two names.","Check where to find them each day."],"easier":"One name.","bigger":"Add someone outside school too.","note":"If something is happening to you right now, tell any adult you trust. You will not be in trouble for telling."},
        {"i":"music","t":"Make a calm playlist","mins":15,"need":[],"steps":["Pick songs that slow you down.","Aim for five.","Try it next time things get loud."],"easier":"One song.","bigger":"Make a hype playlist too, for flat days."},
        {"i":"leaf","t":"Ten minutes outside","mins":10,"need":[],"steps":["Go outside, with an adult if you need to.","Find something green, something moving and a sound.","Notice how you feel after."],"easier":"Five minutes by the door.","bigger":"Make it a daily thing for a week."},
        {"i":"smile","t":"One kind thing, in secret","mins":5,"need":[],"steps":["Pick someone.","Do something kind without them knowing it was you.","Notice how it feels."],"easier":"Hold a door open.","bigger":"One a day, all week."}
      ],
      link:["World Mental Health Day","https://www.who.int/campaigns/world-mental-health-day"],
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
      try:[
        {"i":"rangoli","t":"Make a rangoli pattern","mins":20,"need":["Chalk, coloured paper or coloured rice"],"steps":["Start with a dot or a circle in the middle.","Repeat the same shape all the way round, like petals.","Add colour layer by layer, working outwards."],"easier":"Colour in a printed rangoli outline.","bigger":"Make a giant chalk one outside.","why":"At Diwali, rangoli are made by the door to welcome guests and good luck."},
        {"i":"lantern","t":"Build a paper lantern","mins":20,"need":["A sheet of paper","Scissors","Tape or glue"],"steps":["Fold the paper in half the long way.","Cut slits from the fold, stopping 2cm from the edge.","Unfold, roll it into a tube and tape it. Add a handle."],"easier":"Ask for one with the slits already cut.","bigger":"Make a string of lanterns for the room.","note":"Use an LED tea light inside, never a real flame."},
        {"i":"flower","t":"Spot Day of the Dead symbols","mins":15,"need":[],"steps":["Look at a picture of a Day of the Dead ofrenda (a family altar).","Spot the marigolds, candles, sugar skulls and papel picado.","Pick one and find out what it means."],"easier":"Spot just the marigolds.","bigger":"Cut your own papel picado flag from tissue paper.","why":"Day of the Dead (Dia de los Muertos) is a Mexican celebration remembering loved ones, full of colour, food and music."},
        {"i":"torch","t":"Play with light and shadow","mins":15,"need":["A torch","Your hands or paper shapes"],"steps":["Make the room a bit darker.","Shine the torch at a wall.","Make shadow animals, or put on a shadow puppet show."],"easier":"Just make your hand shadow bigger and smaller.","bigger":"Put on a one minute shadow play."},
        {"i":"scales","t":"Compare two festivals","mins":15,"need":[],"steps":["Pick two: Diwali, Day of the Dead or Bonfire Night.","Find out what each one is for.","Spot one thing that is the same and one that is different."],"easier":"Just find the thing that is the same.","bigger":"Make a Venn diagram poster.","why":"Diwali is celebrated by Hindus, Sikhs and Jains. Bonfire Night remembers the failed plot of 1605."}
      ],
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
      try:[
        {"i":"poppy","t":"Make a poppy artwork","mins":20,"need":["Red and black paper, or paint"],"steps":["Cut or paint four red petals.","Add a black centre.","Add it to a group display, or keep it."],"easier":"Colour in a poppy outline.","bigger":"Make a poppy field with your group.","why":"Poppies grew on the battlefields of the First World War, so they became a way to remember."},
        {"i":"clock","t":"Join the two minute silence","mins":2,"need":[],"steps":["At 11am on 11 November, lots of the country stops.","Stay still and quiet for two minutes.","Think about anyone you like: people who served, or someone you miss."],"easier":"Sit somewhere comfortable. Fidgets are fine.","bigger":"Find out why it happens at 11am."},
        {"i":"helmet","t":"Find out who serves near you","mins":15,"need":[],"steps":["Pick one: fire, police, ambulance, coastguard or armed forces.","Find your nearest station or base on a map.","Find one thing they did this year."],"easier":"Just find the nearest fire station.","bigger":"Write a question to send them."},
        {"i":"gift","t":"Try a Children in Need challenge","mins":30,"need":[],"steps":["Pick a silly, safe challenge: odd socks, a sponsored silence, a bake (nut free).","Agree it with your teacher.","Do it, then rate it out of 10."],"easier":"Wear something spotty.","bigger":"Raise real money as a group.","link":["BBC Children in Need","https://www.bbcchildreninneed.co.uk/"]},
        {"i":"letter","t":"Thank someone who helps","mins":10,"need":["Card, paper or the writing pad"],"steps":["Pick someone: a cleaner, a cook, a driver, a nurse.","Write or draw a thank you. Short is fine.","Give it to them, or post it."],"easier":"Say thank you out loud.","bigger":"Make a thank you wall for the whole school.","link":["Open the writing pad","/tools/write.html"]}
      ],
      link:["Armistice Day, Royal British Legion","https://www.britishlegion.org.uk/get-involved/remembrance/armistice-day"],
      jobs:["firefighter","paramedic","sailor","fundraiser"],
      game:null,
      look:{ bg:"#a4161a", bg2:"#d90429", ink:"#ffffff", pop:"#161a1d", pop2:"#f5ebe0", motif:"poppy", pattern:"dots" }
    },
    {
      id:"anti-bullying", half:"a2", start:"2026-11-16", end:"2026-11-20",
      title:"Anti-Bullying Week", long:"Anti-Bullying Week: Break the Silence",
      q:"What could you say when something is not OK?",
      why:"Speaking up, getting help and backing each other up stops bullying growing.",
      try:[
        {"i":"speech","t":"Practise a speaking up line","mins":10,"need":[],"steps":["Pick a line you could say, like 'Not cool. Leave it.'","Practise it with someone, in a calm voice.","Pick an adult you could tell, too."],"easier":"Just pick the line.","bigger":"Role play a scene, then swap parts.","note":"If something is happening to you right now, tell any adult you trust. You will not be in trouble for telling."},
        {"i":"people","t":"Know your trusted adults","mins":5,"need":[],"steps":["Think who in school you would go to.","Write or draw two names.","Check where to find them each day."],"easier":"One name.","bigger":"Add someone outside school too.","note":"If something is happening to you right now, tell any adult you trust. You will not be in trouble for telling."},
        {"i":"phone","t":"Online or offline: spot it","mins":15,"need":["Made up examples from your teacher"],"steps":["Look at a few made up examples.","Sort them: online, offline, or both.","For each one, say who could help."],"easier":"Sort three.","bigger":"Find the report button on an app you use."},
        {"i":"palette","t":"Make a kindness poster","mins":20,"need":["Paper and thick pens"],"steps":["Pick one kind message, short and punchy.","Make it big and bold.","Put it where people will see it."],"easier":"One word, really big.","bigger":"Make a set of three."},
        {"i":"hand","t":"Write a class pledge","mins":15,"need":["Big paper"],"steps":["As a group, list what makes the room feel safe.","Turn the top three into 'We...' sentences.","Everyone adds a handprint or signature, if they want to."],"easier":"Add your handprint.","bigger":"Share it with another class."}
      ],
      link:["Anti-Bullying Alliance","https://anti-bullyingalliance.org.uk/"],
      jobs:["advocate","onlinesafe","psych","safeguard"],
      game:null,
      look:{ bg:"#0077b6", bg2:"#00b4d8", ink:"#ffffff", pop:"#ffd60a", pop2:"#ff006e", motif:"megaphone", pattern:"stripes" }
    },
    {
      id:"giving-tuesday", half:"a2", start:"2026-11-23", end:"2026-11-27",
      title:"Giving Tuesday", long:"Giving Tuesday: giving, kindness and community",
      q:"What could you give that costs nothing?",
      why:"Time, skills and kindness all count as giving.",
      try:[
        {"i":"smile","t":"Try a kindness challenge","mins":0,"need":[],"steps":["Pick three small kind things to do today.","Do them, quietly or not.","Tick them off."],"easier":"One thing.","bigger":"Kindness bingo for the whole week."},
        {"i":"search","t":"Research a charity","mins":20,"need":[],"steps":["Pick something you care about: animals, the sea, people, sport.","Find a charity that helps with it.","Find one thing they did with the money they raised."],"easier":"Look at one charity's website.","bigger":"Pitch your charity to the group."},
        {"i":"hands","t":"Volunteer for an hour","mins":60,"need":[],"steps":["Pick a job that helps: a litter pick, the garden, the kitchen.","Agree it with an adult.","Do it, then think about how it went."],"easier":"Ten minutes counts.","bigger":"Plan a group volunteering morning."},
        {"i":"coin","t":"Plan a donation budget","mins":20,"need":[],"steps":["Imagine you have 100 pounds to give away.","Split it between three causes.","Explain your split in one sentence."],"easier":"Two causes.","bigger":"Find out what 10 pounds buys for each one.","link":["Open the calculator","/tools/calculator.html"]},
        {"i":"toolbox","t":"Fix something for someone","mins":20,"need":[],"steps":["Find something broken or messy: a game, a shelf, a display.","Fix it, with help if you need it.","Show the owner."],"easier":"Tidy something up.","bigger":"Run a repair cafe hour."}
      ],
      jobs:["fundraiser","volunteer","wildlife","community"],
      game:null,
      look:{ bg:"#ffbe0b", bg2:"#ffd166", ink:"#2b0f6b", pop:"#fb5607", pop2:"#3a86ff", motif:"gift", pattern:"confetti" }
    },
    {
      id:"christmas-around-the-world", half:"a2", start:"2026-11-30", end:"2026-12-04",
      title:"Christmas Around the World", long:"Christmas Around the World: celebrations, traditions, beliefs",
      q:"How does the rest of the world do December?",
      why:"Same season. Very different music, food, stories and traditions.",
      try:[
        {"i":"globe","t":"Pin traditions on a world map","mins":20,"need":["A world map","Sticky notes"],"steps":["Pick five countries.","Find one winter tradition for each.","Pin it on the map with a tiny drawing."],"easier":"Three countries.","bigger":"Make an advent board: a tradition a day.","link":["Christmas around the world","https://www.whychristmas.com/cultures/"]},
        {"i":"music","t":"Music from three countries","mins":15,"need":[],"steps":["Pick three countries.","Find a festive song from each one.","Rate them: dance, cry or skip?"],"easier":"One song.","bigger":"Make a world winter playlist."},
        {"i":"tree","t":"Make a decoration from somewhere else","mins":20,"need":["Paper, scissors, glue"],"steps":["Pick one: a Filipino star lantern (a parol), a Swedish straw goat, a paper chain.","Look at a picture of it.","Make your own version from paper."],"easier":"A paper chain.","bigger":"Decorate a whole window."},
        {"i":"chefhat","t":"Taste something festive and new","mins":15,"need":["Food your teacher has checked"],"steps":["Pick a festive food from another country.","Try a tiny taste.","Thumbs up, sideways or down?"],"easier":"Look at it and smell it. That counts.","bigger":"Help make it.","note":"Check allergies with an adult first. School food is nut free."},
        {"i":"book","t":"Share a family tradition","mins":10,"need":[],"steps":["Think of something your family does in winter, big or tiny. It does not have to be Christmas.","Draw it, or tell it.","Hear someone else's."],"easier":"Pass, or share a made up one.","bigger":"Make a class book of traditions."}
      ],
      jobs:["baker","musician","travel","photo2"],
      game:null,
      look:{ bg:"#0b6e4f", bg2:"#08a045", ink:"#ffffff", pop:"#e63946", pop2:"#ffd166", motif:"tree", pattern:"snow" }
    },
    {
      id:"steam-for-good", half:"a2", start:"2026-12-07", end:"2026-12-11",
      title:"STEAM for Good", long:"STEAM for Good: problem solving",
      q:"What is one problem round here you could actually fix?",
      why:"Science, tech, engineering, art and maths are all just ways of fixing things.",
      try:[
        {"i":"search","t":"Spot a real problem","mins":15,"need":[],"steps":["Walk round and look for small annoyances: a squeaky door, a messy shelf.","Pick one that bugs lots of people.","Say it in one sentence: 'The problem is...'"],"easier":"Pick from a list of problems.","bigger":"Ask five people what bugs them."},
        {"i":"pencil","t":"Sketch a design","mins":15,"need":["Paper or the doodle pad"],"steps":["Draw your fix, big and simple.","Label the parts.","Add what it is made from."],"easier":"One drawing, no labels.","bigger":"Draw three ideas and pick the best.","link":["Open the doodle pad","/tools/doodle.html"]},
        {"i":"gear","t":"Build a prototype","mins":30,"need":["Junk modelling, card, tape"],"steps":["Build a rough version. Rough is fine.","Make sure the main part works.","Take a photo."],"easier":"Build just one part.","bigger":"Make it actually work."},
        {"i":"flask","t":"Test it, break it, fix it","mins":20,"need":[],"steps":["Try it out for real.","Write down what went wrong. Something always does.","Change one thing and test again."],"easier":"Test it once.","bigger":"Test it three times and keep notes."},
        {"i":"mic","t":"Pitch it in 60 seconds","mins":10,"need":[],"steps":["Say the problem.","Show your fix.","Say why it matters. Stop at 60 seconds."],"easier":"Pitch to one person.","bigger":"Run a mini Dragons' Den."}
      ],
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
      try:[
        {"i":"list","t":"Write one tiny resolution","mins":5,"need":[],"steps":["Think small. Tiny is easier to keep.","Write it down: 'I will...'","Put it somewhere you will see it."],"easier":"Say it out loud.","bigger":"Check in on it every Friday."},
        {"i":"globe","t":"Find a new year tradition elsewhere","mins":15,"need":[],"steps":["Pick a country.","Find how they see in the new year, like twelve grapes at midnight in Spain.","Try a tiny version."],"easier":"Find just one.","bigger":"Compare three."},
        {"i":"calendar","t":"Guess the day people give up","mins":10,"need":[],"steps":["Guess when most people give up their resolution.","Ask people in the room when they gave up theirs.","Make a chart of the answers."],"easier":"Just make a guess.","bigger":"Some call the second Friday in January Quitters Day. Was your class right?"},
        {"i":"clock","t":"Message to you, a year from now","mins":15,"need":["Paper or the writing pad"],"steps":["Write a message to yourself.","Say what you hope happens, and make one prediction.","Seal it. Open it next January."],"easier":"One sentence.","bigger":"Make a whole class time capsule.","link":["Open the writing pad","/tools/write.html"]}
      ],
      jobs:["ptbusy","fireworks","historian","coachlife"],
      game:null,
      look:{ bg:"#1d3557", bg2:"#2b5d8a", ink:"#ffffff", pop:"#ffd166", pop2:"#ef476f", motif:"firework", pattern:"confetti" }
    },
    {
      id:"democracy-day", half:"sp1", start:"2027-01-11", end:"2027-01-15", draft:true,
      title:"Democracy Day", long:"Democracy Day in Cape Verde",
      q:"Should everyone get a say?",
      why:"Cape Verde marks the day in 1991 it held its first election with more than one party.",
      try:[
        {"i":"ballot","t":"Run a class vote","mins":15,"need":["Paper slips","A box or a hat"],"steps":["Pick something real to vote on: the next film, a break game.","Everyone votes in secret.","Count it and announce it. Fair is fair."],"easier":"A show of hands.","bigger":"Run it with candidates and speeches."},
        {"i":"map","t":"Find Cape Verde on a map","mins":10,"need":["A map or globe"],"steps":["Find Africa, then look west into the Atlantic.","Find the ten islands of Cape Verde.","Find one fact about life there."],"easier":"Just find it.","bigger":"Plan a trip round the islands."},
        {"i":"speech","t":"Debate one small rule","mins":20,"need":[],"steps":["Pick a small rule.","Half argue for it, half against.","Vote at the end. Did anyone change their mind?"],"easier":"Just say which side you are on.","bigger":"Argue the side you disagree with."},
        {"i":"pencil","t":"Design a fair voting system","mins":20,"need":[],"steps":["Decide who gets to vote, and how.","Decide how to stop cheating.","Test it on a silly question."],"easier":"Just answer the first question.","bigger":"Compare it with how the UK votes."}
      ],
      link:["Democracy, BBC Bitesize","https://www.bbc.co.uk/bitesize/articles/zygmqfr"],
      jobs:["mp","lawyer","journalist","election"],
      game:null,
      look:{ bg:"#003893", bg2:"#1f4fb2", ink:"#ffffff", pop:"#f7d116", pop2:"#cf2027", motif:"ballot", pattern:"stars" }
    },
    {
      id:"lunar-new-year", half:"sp1", start:"2027-01-18", end:"2027-01-22", draft:true,
      title:"Chinese New Year", long:"Chinese New Year",
      q:"Which animal year were you born in?",
      why:"2027 is the Year of the Goat: lanterns, red envelopes and a lot of noise.",
      try:[
        {"i":"lantern","t":"Make a red lantern","mins":20,"need":["Red paper","Scissors","Tape or glue"],"steps":["Fold the paper in half the long way.","Cut slits from the fold, stopping 2cm from the edge.","Unfold, roll into a tube and tape it. Add a tassel."],"easier":"Ask for one with the slits already cut.","bigger":"Make a string of lanterns.","note":"Use an LED light inside, never a real flame."},
        {"i":"horse","t":"Find your zodiac animal","mins":10,"need":[],"steps":["Find the year you were born.","Find your animal on the twelve animal zodiac.","Read what your animal is meant to be like. True?"],"easier":"Just find the animal.","bigger":"Find the animals for your whole family."},
        {"i":"dragon","t":"Design a dragon dance","mins":20,"need":["Card, paper or fabric"],"steps":["Draw a dragon head on card.","Add a long body from paper or fabric.","Move it as a group, head first."],"easier":"Just make the head.","bigger":"Add music and a whole routine."},
        {"i":"letter","t":"Write a good luck message","mins":10,"need":["Red paper","A gold or black pen"],"steps":["Fold a small red envelope, or use red paper.","Write a short good luck wish.","Give it to someone."],"easier":"One word.","bigger":"Make one for everyone in the group.","why":"At Chinese New Year, red envelopes are given for luck. Red is the lucky colour."}
      ],
      link:["When is Chinese New Year?","https://www.chinahighlights.com/travelguide/festivals/when-chinese-new-year.htm"],
      jobs:["dumplings","performer","translator","calligrapher"],
      game:null,
      look:{ bg:"#b5121b", bg2:"#e5383b", ink:"#fff8e7", pop:"#ffd60a", pop2:"#7b2cbf", motif:"lantern", pattern:"rays" }
    },
    {
      id:"steam-january", half:"sp1", start:"2027-01-25", end:"2027-01-29", draft:true,
      title:"STEAM Challenge", long:"STEAM activity",
      q:"Can you build it with what is on the table?",
      why:"Engineers usually start with not quite enough. That is the fun part.",
      try:[
        {"i":"gear","t":"Build the tallest tower","mins":20,"need":["Spaghetti and marshmallows, or paper and tape"],"steps":["Set a timer for 15 minutes.","Build the tallest tower that stands on its own.","Measure it, then work out why it wobbled."],"easier":"Build in a pair.","bigger":"Make it hold a tennis ball on top."},
        {"i":"bridge","t":"Make a paper bridge hold a book","mins":20,"need":["Paper","Two piles of books","Coins for weights"],"steps":["Make a gap between two piles of books.","Fold paper into a bridge across it. Try folding it like a fan.","Add coins until it fails."],"easier":"One flat sheet first, then a folded one.","bigger":"Use only one sheet and beat the record."},
        {"i":"pencil","t":"Draw it before you build it","mins":10,"need":["Paper or the doodle pad"],"steps":["Pick what you will build.","Draw it from the front and from the side.","Label one thing that makes it strong."],"easier":"One drawing.","bigger":"Draw it to scale.","link":["Open the doodle pad","/tools/doodle.html"]},
        {"i":"flask","t":"Test, tweak, test again","mins":15,"need":[],"steps":["Test your build.","Change one thing only.","Test again. Better or worse?"],"easier":"Test once.","bigger":"Keep a results table."}
      ],
      jobs:["engineer","architect","gamedev","labtech"],
      game:null,
      look:{ bg:"#06d6a0", bg2:"#1b9aaa", ink:"#073b4c", pop:"#ffd166", pop2:"#ef476f", motif:"bridge", pattern:"grid" }
    },
    {
      id:"safer-internet", half:"sp1", start:"2027-02-01", end:"2027-02-05", draft:true,
      title:"Safer Internet Day", long:"Safer Internet Day",
      q:"How do you know if something online is real?",
      why:"Apps, AI and adverts all want something from you. Knowing that keeps you in charge.",
      try:[
        {"i":"robot","t":"Spot the AI made picture","mins":15,"need":["Pictures from your teacher"],"steps":["Look at a set of pictures.","Check the hands, any writing, the shadows and the background.","Guess: real or AI? Then check."],"easier":"Look at two.","bigger":"Make a 'how to spot it' guide."},
        {"i":"padlock","t":"Make a strong password","mins":10,"need":[],"steps":["Pick three random words.","Stick them together, like TeapotRiverJump.","Make a practice one only. Never share a real one, even with friends."],"easier":"Just pick the three words.","bigger":"Find out what two step login is."},
        {"i":"phone","t":"Check an app's settings","mins":15,"need":["An app you use"],"steps":["Pick an app.","Find its privacy settings.","Check who can see your stuff and who can message you."],"easier":"Find where the settings are.","bigger":"Help someone else check theirs."},
        {"i":"people","t":"Know who to tell","mins":5,"need":[],"steps":["If something online upsets you, it is not your fault.","Screenshot it if you can.","Tell an adult you trust."],"easier":"Just name the adult.","bigger":"Find the report button on two apps.","note":"If something is happening to you right now, tell any adult you trust. You will not be in trouble for telling."}
      ],
      link:["Safer Internet Day","https://saferinternet.org.uk/safer-internet-day"],
      jobs:["cyber","ai","moderator","webdev"],
      game:null,
      look:{ bg:"#0f172a", bg2:"#1e3a5f", ink:"#e2e8f0", pop:"#22d3ee", pop2:"#a3e635", motif:"padlock", pattern:"grid" }
    },
    {
      id:"apprenticeships", half:"sp1", start:"2027-02-08", end:"2027-02-12", draft:true,
      title:"Apprenticeship Week", long:"National Apprenticeship Week",
      q:"Could you get paid while you learn?",
      why:"Apprenticeships mean real work, real pay and a qualification at the end.",
      try:[
        {"i":"search","t":"Find an apprenticeship near you","mins":20,"need":[],"steps":["Open the apprenticeship finder.","Search for something you are into.","Pick one and find out what you would actually do."],"easier":"Just look at one.","bigger":"Find three and compare them.","link":["Find an apprenticeship","https://www.findapprenticeship.service.gov.uk/"]},
        {"i":"hardhat","t":"Look up three jobs","mins":15,"need":[],"steps":["Pick three jobs you have heard of but do not really know.","Find out what a normal day looks like.","Pick the one you would try for a week."],"easier":"One job.","bigger":"Find out how you would get into each."},
        {"i":"speech","t":"Ask an adult about their first job","mins":10,"need":[],"steps":["Pick an adult.","Ask what their first job was, and what went wrong.","Share the funniest answer."],"easier":"One question.","bigger":"Ask five people and compare."},
        {"i":"list","t":"List what you are already good at","mins":10,"need":[],"steps":["Write down three things you are good at. Anything counts.","Next to each one, write a job that uses it.","Circle the one that surprised you."],"easier":"One thing.","bigger":"Ask someone else what they think you are good at."}
      ],
      link:["Careerpilot","https://www.careerpilot.org.uk/"],
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
      try:[
        {"i":"card","t":"Make a profile card of an LGBT+ scientist","mins":20,"need":["Card or the doodle pad"],"steps":["Pick someone, like Alan Turing or Sally Ride.","Find their big idea and one surprising fact.","Make it look like a trading card."],"easier":"Name, picture and one fact.","bigger":"Make a deck with your group.","link":["Open the doodle pad","/tools/doodle.html"]},
        {"i":"calendar","t":"Build a timeline of rights in the UK","mins":20,"need":[],"steps":["Find three dates, like 1967, 2005 and 2014.","Find what changed on each one.","Put them on a line, with a picture each."],"easier":"One date.","bigger":"Add dates from other countries."},
        {"i":"pencil","t":"Write a short poem","mins":15,"need":["Paper or the writing pad"],"steps":["Pick a person or an idea from this week.","Write four lines about them.","Read it out, or don't."],"easier":"Two lines.","bigger":"Enter it into a poetry competition.","link":["Open the writing pad","/tools/write.html"]},
        {"i":"speech","t":"Why do some names get forgotten?","mins":10,"need":[],"steps":["Think of a famous scientist everyone knows.","Now think of one you only found out about this week.","Talk about why one got remembered and one did not."],"easier":"Just listen to the talk.","bigger":"Make a 'should be famous' list."}
      ],
      link:["LGBT+ History Month","https://lgbtplushistorymonth.co.uk/"],
      jobs:["researcher","trains","historian2","writer"],
      game:null,
      look:{ bg:"#3d348b", bg2:"#7678ed", ink:"#ffffff", pop:"#f7b801", pop2:"#f35b04", motif:"rainbow", pattern:"rays" }
    },
    {
      id:"careers-week", half:"sp2", start:"2027-03-01", end:"2027-03-05", draft:true,
      title:"Careers Week", long:"National Careers Week",
      q:"What job would you do for free?",
      why:"The things you are into now can point at jobs you have never heard of.",
      try:[
        {"i":"search","t":"Try a careers quiz","mins":15,"need":[],"steps":["Open a careers quiz.","Answer honestly. No wrong answers.","Look at your top three jobs. Any surprises?"],"easier":"Just look at the job list.","bigger":"Look up how to get into your top one.","link":["Careerpilot","https://www.careerpilot.org.uk/"]},
        {"i":"list","t":"Look at your action plan","mins":10,"need":["Your action plan"],"steps":["Find your plan from your careers chat.","Pick one step on it.","Do one tiny bit of that step."],"easier":"Just read it.","bigger":"Update it with something new."},
        {"i":"speech","t":"Ask three adults about their jobs","mins":15,"need":[],"steps":["Pick three adults.","Ask: what do you actually do all day?","Pick the job that sounds best."],"easier":"One adult.","bigger":"Ask what they wanted to be at your age."},
        {"i":"star","t":"Pick a dream job and a backup","mins":10,"need":[],"steps":["Pick a dream job. Any size.","Pick a backup that uses the same skills.","Draw yourself doing both."],"easier":"Just the dream job.","bigger":"Find out what each one pays."}
      ],
      jobs:["careers","tester","vetnurse","builder"],
      game:null,
      look:{ bg:"#118ab2", bg2:"#06aed5", ink:"#ffffff", pop:"#ffd166", pop2:"#ef476f", motif:"compass", pattern:"dots" }
    },
    {
      id:"pi-day", half:"sp2", start:"2027-03-08", end:"2027-03-12", draft:true,
      title:"Pi Day", long:"Pi Day, 14 March",
      q:"Why does every circle hide the same number?",
      why:"Pi is about 3.14 and it never ends. People mark it on 14 March: 3/14.",
      try:[
        {"i":"search","t":"Measure round things with string","mins":15,"need":["String","A ruler","Round things: a plate, a tin, a bin"],"steps":["Wrap string round a round thing, then measure the string.","Measure straight across the middle.","Divide the first by the second. Close to 3.14?"],"easier":"Measure just one thing.","bigger":"Measure five and find the average.","link":["Open the calculator","/tools/calculator.html"]},
        {"i":"pi","t":"Make a pi paper chain","mins":20,"need":["Paper strips in ten colours"],"steps":["Give each digit 0 to 9 its own colour.","Pi starts 3.14159. Add a link for each digit.","How long can the group make it?"],"easier":"The first ten digits.","bigger":"Beat last year's chain."},
        {"i":"dice","t":"How many digits can you remember?","mins":10,"need":[],"steps":["Look at the first twenty digits of pi.","Hide them and write down as many as you can.","Try a trick: turn them into a rhythm or a story."],"easier":"The first five.","bigger":"Learn fifty."},
        {"i":"pencil","t":"Draw a pi skyline","mins":15,"need":["Squared paper"],"steps":["Each digit of pi is a building.","Its height is the digit: 3 squares, 1 square, 4 squares...","Add windows and a night sky."],"easier":"Five buildings.","bigger":"Do the first thirty digits."}
      ],
      link:["International Day of Mathematics","https://www.idm314.org/"],
      jobs:["datasci","piengineer","pilot","mathsteach"],
      game:null,
      look:{ bg:"#2d00f7", bg2:"#6a00f4", ink:"#ffffff", pop:"#f20089", pop2:"#ffd60a", motif:"pi", pattern:"grid" }
    },
    {
      id:"red-nose-day", half:"sp2", start:"2027-03-15", end:"2027-03-19", draft:true,
      title:"Red Nose Day", long:"Red Nose Day",
      q:"Can being silly change something serious?",
      why:"Comic Relief turns jokes and red noses into money for people who need it.",
      try:[
        {"i":"nose","t":"Wear something red","mins":0,"need":["Anything red"],"steps":["Find something red: a nose, a sock, a hat.","Wear it today.","Spot the most red person in school."],"easier":"A red sticker counts.","bigger":"Go completely red."},
        {"i":"smile","t":"Tell your worst joke","mins":5,"need":[],"steps":["Find the worst joke you know.","Tell it to someone.","Rate the groan out of ten."],"easier":"Write it down instead.","bigger":"Run a worst joke contest."},
        {"i":"coin","t":"Plan a tiny fundraiser","mins":20,"need":[],"steps":["Pick an idea: a bake sale (nut free), a sponsored silence, odd socks.","Agree it with your teacher.","Plan who does what, and when."],"easier":"Pick the idea.","bigger":"Actually run it."},
        {"i":"heart","t":"Find out where the money goes","mins":15,"need":[],"steps":["Open the Comic Relief website with your teacher.","Find one project the money pays for.","Tell someone about it."],"easier":"Look at one picture.","bigger":"Find three projects."}
      ],
      link:["Comic Relief","https://www.comicrelief.com/"],
      jobs:["comedian","fundraiser","tvprod","charity"],
      game:null,
      look:{ bg:"#e63946", bg2:"#ff595e", ink:"#ffffff", pop:"#ffca3a", pop2:"#1982c4", motif:"nose", pattern:"dots" }
    },
    {
      id:"shakespeare-week", half:"sp2", start:"2027-03-22", end:"2027-03-26", draft:true,
      title:"Shakespeare Week", long:"National Reading Month and Shakespeare Week",
      q:"Why are we still reading a writer from 400 years ago?",
      why:"Shakespeare wrote down words you still use every day.",
      try:[
        {"i":"book","t":"Find a book you would actually finish","mins":15,"need":[],"steps":["Think about what you like: funny, scary, short, graphic novel.","Ask a librarian or adult for three ideas.","Read the first page of each. Keep the best one."],"easier":"Look at the covers only.","bigger":"Read it all, then tell someone."},
        {"i":"mask","t":"Act out a two line scene","mins":10,"need":["A partner"],"steps":["Get two lines from a play, one each.","Say them in a silly voice, then a serious one.","Swap parts."],"easier":"Read it, don't act it.","bigger":"Add a third person and a fight scene."},
        {"i":"speech","t":"Learn a Shakespeare insult","mins":5,"need":[],"steps":["Find a Shakespeare insult, like 'Thou art a boil.'","Practise saying it dramatically.","Use it on a willing friend. Only a willing one."],"easier":"Read one out.","bigger":"Make up your own in the same style."},
        {"i":"pencil","t":"Invent a brand new word","mins":10,"need":[],"steps":["Shakespeare invented loads of words.","Make up a word for something that has no word yet.","Write what it means and use it in a sentence."],"easier":"Just the word.","bigger":"Get the whole group using it."}
      ],
      jobs:["librarian","actor","author","narrator"],
      game:null,
      look:{ bg:"#6a4c93", bg2:"#8b5fbf", ink:"#ffffff", pop:"#ffca3a", pop2:"#8ac926", motif:"mask", pattern:"stripes" }
    },
    {
      id:"steam-march", half:"sp2", start:"2027-03-29", end:"2027-04-02", draft:true,
      title:"STEAM Projects", long:"STEAM activity: space, deep sea, virtual world",
      q:"Space, the deep sea or inside a computer: where would you build a base?",
      why:"Three places people cannot easily live. Engineers are working on all three.",
      try:[
        {"i":"rocket","t":"Design a space base","mins":25,"need":["Paper, junk modelling or the doodle pad"],"steps":["Pick a planet or moon.","Draw rooms for sleeping, food, air and fun.","Label one thing that keeps people safe."],"easier":"One room.","bigger":"Build a model.","link":["Open the doodle pad","/tools/doodle.html"]},
        {"i":"fish","t":"Sketch a deep sea station","mins":20,"need":[],"steps":["Draw the station on the sea floor.","Add how people get in and out.","Add three creatures that swim past."],"easier":"Just the outside.","bigger":"Add how it gets power."},
        {"i":"laptop","t":"Build a virtual world","mins":30,"need":[],"steps":["Open a game maker.","Make one level with a start, a challenge and an end.","Get someone to play it."],"easier":"Change one level someone else made.","bigger":"Add a secret.","link":["Open Jump Lab","/practice/jump-lab.html"]},
        {"i":"gear","t":"Test one part of it","mins":20,"need":[],"steps":["Pick one part: an airlock, a window, a wheel.","Build it from card.","Test it. What would fail first?"],"easier":"Just pick the part.","bigger":"Fix what failed and test again."}
      ],
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
      try:[
        {"i":"dragon","t":"Draw your own dragon","mins":15,"need":["Paper or the doodle pad"],"steps":["Pick a dragon type: fire, ice, tiny, very lazy.","Draw it big.","Give it a name and one weakness."],"easier":"Colour one in.","bigger":"Make a dragon trading card.","link":["Open the doodle pad","/tools/doodle.html"]},
        {"i":"chefhat","t":"Cook a classic English dish","mins":45,"need":["A kitchen and an adult"],"steps":["Pick one: a pie, a crumble, scones.","Follow a simple recipe with an adult.","Taste it. Would you make it again?"],"easier":"Help with one step.","bigger":"Cook it for the group.","note":"Check allergies first. School food is nut free."},
        {"i":"map","t":"Find where George came from","mins":10,"need":["A map"],"steps":["The story says George was a Roman soldier.","He came from what is now Turkey. Find it on the map.","Measure how far it is from here."],"easier":"Just find Turkey.","bigger":"Find the other countries that have St George as their saint."},
        {"i":"rose","t":"Make a red rose","mins":15,"need":["Red and green paper","Glue"],"steps":["Cut a spiral from a circle of red paper.","Roll it up from the outside in, and glue the base.","Add green leaves."],"easier":"Draw one.","bigger":"Make a bunch."}
      ],
      jobs:["historianG","roast","reenactor","farmer"],
      game:null,
      look:{ bg:"#fdf0d5", bg2:"#f3dcae", ink:"#6b0f0f", pop:"#c1121f", pop2:"#386641", motif:"dragon", pattern:"stripes" }
    },
    {
      id:"brain-brilliance", half:"su1", start:"2027-04-26", end:"2027-05-07", draft:true,
      title:"Brain Brilliance", long:"Brain Brilliance: food, mood and health (two weeks)",
      q:"Does what you eat change how you feel?",
      why:"Food, mood and focus are all connected. Picky eaters included.",
      try:[
        {"i":"apple","t":"Try a food rainbow","mins":15,"need":["Pictures or real food"],"steps":["Look at foods of lots of colours.","Pick one colour you do not usually eat.","Look at it, smell it, or try a tiny bit. All count."],"easier":"Just sort pictures by colour.","bigger":"Make a rainbow plate."},
        {"i":"glass","t":"Notice a day with more water","mins":0,"need":["A water bottle"],"steps":["Have a water bottle near you all day.","Sip when you think of it.","Notice how your head feels by the end of the day."],"easier":"Just one extra drink.","bigger":"Try it for a week."},
        {"i":"brain","t":"Brain food or not? Guess","mins":10,"need":[],"steps":["Look at a set of foods.","Guess which ones help your brain.","Check the answers. Any surprises?"],"easier":"Guess three.","bigger":"Make your own quiz."},
        {"i":"chefhat","t":"Make a snack you would eat again","mins":20,"need":["Snack ingredients your teacher has checked"],"steps":["Pick a simple snack.","Make it, your way.","Would you make it again? Why?"],"easier":"Help someone else make theirs.","bigger":"Write the recipe card.","note":"Check allergies first. School food is nut free."}
      ],
      jobs:["nutrition","schoolcook","foodsci","dietitian"],
      game:null,
      look:{ bg:"#8ac926", bg2:"#52b788", ink:"#123524", pop:"#ff595e", pop2:"#ffca3a", motif:"apple", pattern:"dots" }
    },
    {
      id:"women-in-maths", half:"su1", start:"2027-05-10", end:"2027-05-14", draft:true,
      title:"Women in Maths", long:"Women in mathematics: Katherine Johnson",
      q:"Could you do the maths that put people in space?",
      why:"Katherine Johnson's sums helped send astronauts into orbit and bring them home.",
      try:[
        {"i":"rocket","t":"Plot a rocket's path","mins":20,"need":["Squared paper"],"steps":["Draw the Earth in one corner.","Plot a curve for the rocket going up and round.","Mark where it lands back home."],"easier":"Draw the curve freehand.","bigger":"Use coordinates for every point."},
        {"i":"film","t":"Watch Hidden Figures (PG)","mins":120,"need":["The film"],"steps":["Watch with the group.","Look out for Katherine Johnson doing the sums.","Talk about one bit that stuck."],"easier":"Watch a clip.","bigger":"Find out what happened to her after."},
        {"i":"dice","t":"Race a calculator","mins":10,"need":["A partner with a calculator"],"steps":["One of you uses your head, one uses the calculator.","Try easy sums first, like 10 times 7.","Who wins? When does the calculator win?"],"easier":"Five sums.","bigger":"Learn a trick to beat it.","link":["Open the calculator","/tools/calculator.html"]},
        {"i":"card","t":"Make a card for a woman in maths","mins":20,"need":["Card or the doodle pad"],"steps":["Pick someone: Katherine Johnson, Ada Lovelace or Maryam Mirzakhani.","Find what they worked out.","Make a trading card with stats."],"easier":"Name, picture and one fact.","bigger":"Make a full set.","link":["Open the doodle pad","/tools/doodle.html"]}
      ],
      jobs:["aerospace","datasci","stats","codebreaker"],
      game:null,
      look:{ bg:"#0d1b2a", bg2:"#1b3a5b", ink:"#e0e1dd", pop:"#ffb703", pop2:"#8ecae6", motif:"star", pattern:"grid" }
    },
    {
      id:"astronomy-week", half:"su1", start:"2027-05-17", end:"2027-05-21", draft:true,
      title:"Astronomy Week", long:"Astronomy Week",
      q:"What is up there tonight?",
      why:"Look up this week. The Moon and the planets put on a show.",
      try:[
        {"i":"telescope","t":"Spot the Moon tonight","mins":5,"need":["A clear sky"],"steps":["Look up tonight.","Find the Moon. What shape is it?","Draw it."],"easier":"Look at a photo instead.","bigger":"Spot a planet too."},
        {"i":"star","t":"Invent your own constellation","mins":15,"need":["Black paper","A white pen or stickers"],"steps":["Dot some stars on the paper.","Join them up into a picture.","Give it a name and a story."],"easier":"Just dots and lines.","bigger":"Make a whole sky map."},
        {"i":"rocket","t":"Build a straw rocket","mins":20,"need":["A straw","Paper","Tape"],"steps":["Roll paper round a pencil to make a tube, and close one end.","Add fins.","Put it on a straw and blow. How far does it go?"],"easier":"Use a ready made one.","bigger":"Change the fins and test again."},
        {"i":"moon","t":"Track the Moon's shape for a week","mins":5,"need":["A notebook"],"steps":["Look at the Moon each night.","Draw its shape.","After a week, spot the pattern."],"easier":"Three nights.","bigger":"Find out why it changes."}
      ],
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
      try:[
        {"i":"leaf","t":"Plant something","mins":20,"need":["Seeds, soil and a pot"],"steps":["Fill a pot with soil.","Plant a seed, not too deep.","Water it, then check it every day."],"easier":"Water an existing plant.","bigger":"Plant a whole bed."},
        {"i":"bin","t":"Do a litter pick","mins":30,"need":["Gloves","A grabber","A bag"],"steps":["Pick an area with an adult.","Collect what you find.","Count it. What was the most common thing?"],"easier":"Ten minutes.","bigger":"Make a chart of what you found.","note":"Wear gloves. Leave anything sharp for an adult."},
        {"i":"search","t":"Check one room for waste","mins":15,"need":[],"steps":["Pick a room.","Look for lights on, taps dripping, paper in the wrong bin.","Make one suggestion to fix it."],"easier":"Spot one thing.","bigger":"Do the whole school."},
        {"i":"palette","t":"Design a poster for change","mins":20,"need":["Paper and pens"],"steps":["Pick one thing you want people to do.","Say it in five words or fewer.","Make it big and bold."],"easier":"One picture, no words.","bigger":"Make a set for the school."}
      ],
      jobs:["envsci","treesurgeon","solar","recycling"],
      game:null,
      look:{ bg:"#2d6a4f", bg2:"#40916c", ink:"#ffffff", pop:"#ffd166", pop2:"#b7e4c7", motif:"globe", pattern:"waves" }
    },
    {
      id:"ocean-day", half:"su2", start:"2027-06-07", end:"2027-06-11", draft:true,
      title:"World Ocean Day", long:"World Ocean Day, 8 June",
      q:"How much of the sea have we actually explored?",
      why:"Most of the ocean has never been seen by a person. And the UK is surrounded by it.",
      try:[
        {"i":"map","t":"Label the seas around the UK","mins":15,"need":["A map of the UK"],"steps":["Find the North Sea, the Irish Sea and the English Channel.","Label them.","Find the sea nearest to school."],"easier":"Just the nearest one.","bigger":"Add the ports too."},
        {"i":"wave","t":"Make a sea sensory tray","mins":20,"need":["Sand, shells, water, a tray"],"steps":["Put sand at one end and water at the other.","Add shells and stones.","Make waves. Find the shells."],"easier":"Just play with one that is ready.","bigger":"Add a tiny model harbour."},
        {"i":"fish","t":"Draw a creature nobody has found","mins":15,"need":["Paper or the doodle pad"],"steps":["Imagine the deep, dark sea.","Draw a creature that could live there. Lights? Huge eyes?","Give it a name and a superpower."],"easier":"Colour one in.","bigger":"Make it from clay.","link":["Open the doodle pad","/tools/doodle.html"]},
        {"i":"anchor","t":"Find your nearest port","mins":10,"need":["A map"],"steps":["Find the coast nearest to school.","Find the nearest port.","Find one thing ships carry there."],"easier":"Just find the coast.","bigger":"Track a real ship online."}
      ],
      link:["World Ocean Day","https://worldoceanday.org/resources/"],
      jobs:["marine","captain","lifeguard","underwater"],
      game:null,
      look:{ bg:"#0077b6", bg2:"#00b4d8", ink:"#ffffff", pop:"#ffd166", pop2:"#90e0ef", motif:"fish", pattern:"waves" }
    },
    {
      id:"refugee-week", half:"su2", start:"2027-06-14", end:"2027-06-18", draft:true,
      title:"Refugee Week", long:"Refugee Week (or the Summer Solstice)",
      q:"What does courage look like on an ordinary day?",
      why:"Refugee Week celebrates people who rebuilt their lives here, and everything they brought with them.",
      try:[
        {"i":"film","t":"Watch a short film and talk","mins":15,"need":["A film your teacher picks"],"steps":["Watch the short film.","Talk about one moment that stood out.","Say one word for how it made you feel."],"easier":"Just watch.","bigger":"Write a message to the main character."},
        {"i":"heart","t":"Write about a brave everyday moment","mins":15,"need":["Paper or the writing pad"],"steps":["Think of a time you did something hard, big or small.","Write or draw what happened.","Add how you felt after."],"easier":"One sentence.","bigger":"Make a group courage wall.","link":["Open the writing pad","/tools/write.html"]},
        {"i":"chefhat","t":"Try food from a new country","mins":15,"need":["Food your teacher has checked"],"steps":["Pick a dish from another country.","Try a tiny taste.","Thumbs up, sideways or down?"],"easier":"Look and smell. That counts.","bigger":"Help cook it.","note":"Check allergies first. School food is nut free."},
        {"i":"hands","t":"Find a way to welcome someone","mins":10,"need":[],"steps":["Think what helps on a first day somewhere new.","Pick one thing you could do: a smile, show them round, save a seat.","Do it for someone new."],"easier":"Just think of the idea.","bigger":"Make a welcome pack for new students."}
      ],
      link:["Refugee Week","https://refugeeweek.org.uk/"],
      jobs:["translator","caseworker","newteacher","homechef"],
      game:null,
      look:{ bg:"#f9c74f", bg2:"#f9844a", ink:"#1d3557", pop:"#43aa8b", pop2:"#577590", motif:"hands", pattern:"dots" }
    },
    {
      id:"pride-month", half:"su2", start:"2027-06-21", end:"2027-06-25", draft:true,
      title:"Pride Month", long:"Pride Month, with the school Pride event",
      q:"What does it mean to be proud of who you are?",
      why:"Pride celebrates LGBTQ+ people, and the right of everyone to be themselves.",
      try:[
        {"i":"palette","t":"Make a Pride badge","mins":15,"need":["Card, pens, a safety pin or tape"],"steps":["Draw a circle.","Fill it with stripes or a design you like.","Wear it, or give it away."],"easier":"Colour one in.","bigger":"Design one for the school event."},
        {"i":"rainbow","t":"Find out what the colours mean","mins":10,"need":[],"steps":["Look at the first rainbow flag from 1978.","Each colour had a meaning: red for life, yellow for sunlight, green for nature.","Find the rest."],"easier":"Name the colours.","bigger":"Find out how the flag changed over time."},
        {"i":"speech","t":"A time you felt proud","mins":10,"need":[],"steps":["Think of a time you felt proud of yourself.","Tell someone, or draw it.","Listen to theirs."],"easier":"Just think of it.","bigger":"Make a pride wall."},
        {"i":"music","t":"Build the Pride event playlist","mins":15,"need":[],"steps":["Pick songs that make people feel good.","Check they are OK for school.","Add them to the group list."],"easier":"One song.","bigger":"Plan the running order."}
      ],
      jobs:["events","graphic","equality","dj"],
      game:null,
      look:{ bg:"#ff006e", bg2:"#8338ec", ink:"#ffffff", pop:"#ffbe0b", pop2:"#3a86ff", motif:"rainbow", pattern:"rays" }
    },
    {
      id:"writing-day", half:"su2", start:"2027-06-28", end:"2027-07-02", draft:true,
      title:"National Writing Day", long:"National Writing Day",
      q:"Could you tell a whole story in 24 words?",
      why:"National Writing Day is about writing for fun, not for marks.",
      try:[
        {"i":"pencil","t":"Write a 24 word story","mins":15,"need":["Paper or the writing pad"],"steps":["Pick a character and a problem.","Write the whole story in exactly 24 words.","Count them. Cut or add."],"easier":"Write any short story.","bigger":"Write three.","link":["National Writing Day","https://firststory.org.uk/writeday/"]},
        {"i":"dice","t":"Roll a random story start","mins":10,"need":["A dice"],"steps":["Roll for a character: 1 a pirate, 2 a teacher, 3 a dog...","Roll for a place and a problem.","Write the first line."],"easier":"Roll and say it out loud.","bigger":"Finish the story."},
        {"i":"mic","t":"Read it out, or do not","mins":5,"need":[],"steps":["Choose: read it, have someone read it, or keep it.","If reading, go slowly.","Everyone claps either way."],"easier":"Keep it.","bigger":"Record it."},
        {"i":"book","t":"Swap stories with someone","mins":10,"need":[],"steps":["Swap with a partner.","Read theirs.","Say one thing you liked."],"easier":"Read someone else's.","bigger":"Make a class story book."}
      ],
      jobs:["author","gamewriter","journalist","screen"],
      game:null,
      look:{ bg:"#fefae0", bg2:"#f1dfb6", ink:"#283618", pop:"#bc6c25", pop2:"#606c38", motif:"pencil", pattern:"stripes" }
    },
    {
      id:"plastic-free-july", half:"su2", start:"2027-07-05", end:"2027-07-09", draft:true,
      title:"Plastic Free July", long:"Plastic Free July",
      q:"Could you go a whole day without plastic?",
      why:"Plastic lasts hundreds of years. Lots of it gets used once.",
      try:[
        {"i":"bottle","t":"Count the plastic in one bag","mins":15,"need":["A bag of shopping or the bin"],"steps":["Tip out a bag of shopping, carefully.","Count every bit of plastic.","Which could be swapped for something else?"],"easier":"Count three things.","bigger":"Weigh it."},
        {"i":"bin","t":"Swap one plastic thing","mins":0,"need":[],"steps":["Pick one plastic thing you use: a bottle, a bag, a straw.","Find a swap.","Use the swap for a week."],"easier":"Just pick the thing.","bigger":"Swap three."},
        {"i":"toolbox","t":"Make something from rubbish","mins":30,"need":["Clean rubbish","Tape and glue"],"steps":["Collect clean plastic rubbish.","Make something useful or silly.","Name it."],"easier":"Decorate something.","bigger":"Make something you will really use."},
        {"i":"search","t":"Spot plastic you could skip","mins":10,"need":[],"steps":["Walk round school.","Spot plastic used once and thrown away.","Suggest one swap."],"easier":"Spot one.","bigger":"Write to someone who could change it."}
      ],
      link:["Plastic Free July","https://www.awarenessdays.com/awareness-days-calendar/plastic-free-july/"],
      jobs:["materials","recycling","packaging","seaclean"],
      game:null,
      look:{ bg:"#2ec4b6", bg2:"#3ddbd9", ink:"#011627", pop:"#ff9f1c", pop2:"#fdfffc", motif:"bottle", pattern:"waves" }
    },
    {
      id:"dry-ice", half:"su2", start:"2027-07-19", end:"2027-07-23", draft:true,
      title:"Dry Ice Science", long:"STEAM: the dry ice experiment",
      q:"What happens when something skips being a liquid?",
      why:"Dry ice goes straight from solid to gas, and it looks like magic.",
      try:[
        {"i":"flask","t":"Watch dry ice fog, with an adult","mins":15,"need":["An adult with dry ice","Warm water"],"steps":["Your teacher drops dry ice into warm water.","Watch the fog roll out.","Wave your hand through it. What happens?"],"easier":"Watch from further back.","bigger":"Add food colouring to the water.","note":"Never touch dry ice. It is so cold it burns. Only adults handle it."},
        {"i":"balloon","t":"Blow up a balloon without blowing","mins":10,"need":["A bottle","A balloon","An adult"],"steps":["Your teacher puts a little dry ice in a bottle.","A balloon goes over the top.","Watch it blow itself up."],"easier":"Just watch.","bigger":"Predict how big it will get, then measure."},
        {"i":"pencil","t":"Predict first, then watch","mins":10,"need":[],"steps":["Before each test, guess what will happen.","Write or draw your guess.","Watch. Were you right?"],"easier":"Say your guess out loud.","bigger":"Keep a results table."},
        {"i":"speech","t":"Explain it in one sentence","mins":5,"need":[],"steps":["Dry ice is frozen carbon dioxide.","It goes straight from solid to gas.","Explain the fog in your own words, in one sentence."],"easier":"Say one word that describes it.","bigger":"Explain it to someone younger."}
      ],
      jobs:["chemist","sfx","foodsci","labtech"],
      game:null,
      look:{ bg:"#caf0f8", bg2:"#90e0ef", ink:"#03045e", pop:"#7209b7", pop2:"#f72585", motif:"flask", pattern:"snow" }
    }
  ]
};
