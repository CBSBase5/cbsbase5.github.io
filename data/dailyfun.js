/* ==========================================================
   Base 5 - two small daily things for the home page
   1. Jay's mistake of the day: Jay says something with one thing
      wrong in it. Tap to see where he slipped.
   2. Would you rather: a time travel choice, with what happens
      next for whichever one you pick.
   The day of the year picks which one shows, so everyone sees the
   same one on the same day. Add more in the same shape; the order
   does not matter. Plain ASCII only. Use ' for apostrophes.
   ========================================================== */
window.B5FUN = {

  /* [what Jay says, the bit that is wrong, the fix] */
  mistakes: [
    ["There are 60 seconds in a minute and 60 minutes in an hour, so there are 360 seconds in an hour.", "360 seconds", "60 x 60 is 3,600, so an hour has 3,600 seconds."],
    ["A week has 7 days, so a fortnight has 15 days.", "15 days", "A fortnight is two weeks: 14 days."],
    ["The Great Fire of London was in 1066.", "1066", "It was 1666. 1066 is the Battle of Hastings."],
    ["Half of 50 is 20.", "20", "Half of 50 is 25."],
    ["Bonnie is a poodle, so she is a type of cat.", "a type of cat", "Poodles are dogs. Bonnie would like a word."],
    ["A triangle has four sides.", "four sides", "A triangle has three sides. Four sides is a quadrilateral."],
    ["Water boils at 50 degrees Celsius.", "50 degrees", "Water boils at 100 degrees Celsius (at sea level)."],
    ["There are 12 months in a year and December is the eleventh.", "the eleventh", "December is the twelfth month. November is the eleventh."],
    ["10% of 80 is 10.", "is 10", "10% of 80 is 8. Divide by 10."],
    ["The first person to walk on the Moon was Buzz Lightyear.", "Buzz Lightyear", "It was Neil Armstrong, in 1969. Buzz Aldrin went second."],
    ["A metre is 10 centimetres.", "10 centimetres", "A metre is 100 centimetres."],
    ["Doctor Who first appeared on TV in 2005.", "2005", "It started in 1963. 2005 was when it came back."],
    ["7 x 8 is 54.", "54", "7 x 8 is 56."],
    ["The Sun goes round the Earth once a day.", "The Sun goes round the Earth", "The Earth spins once a day, and goes round the Sun once a year."],
    ["Quarter past three is 3:25.", "3:25", "Quarter past three is 3:15. A quarter of an hour is 15 minutes."],
    ["A spider has six legs.", "six legs", "Spiders have eight legs. Insects have six."],
    ["England's capital is Manchester.", "Manchester", "It is London."],
    ["A dozen eggs is ten eggs.", "ten eggs", "A dozen is twelve."],
    ["Dinosaurs and people lived at the same time.", "lived at the same time", "The last big dinosaurs died out about 66 million years before the first people."],
    ["The opposite of a mirror image is a translation.", "a translation", "A mirror image is a reflection. A translation is a slide."],
    ["Christmas Day is the 26th of December.", "the 26th", "Christmas Day is the 25th. The 26th is Boxing Day."],
    ["A square number is any number that ends in a zero.", "ends in a zero", "A square number is a number times itself, like 4, 9, 16 and 25."],
    ["The Titanic sank on its tenth trip.", "tenth trip", "It sank on its very first voyage, in 1912."],
    ["There are 100 years in a millennium.", "100 years", "A millennium is 1,000 years. 100 years is a century."],
    ["Light from the Sun reaches Earth in about 8 hours.", "8 hours", "It takes about 8 minutes."],
    ["The word 'their' means over in that place.", "over in that place", "That is 'there'. 'Their' means belonging to them."],
    ["An octopus has six arms.", "six arms", "An octopus has eight arms. Octo means eight."],
    ["Half past four is 4:50.", "4:50", "Half past four is 4:30."],
    ["Penguins live at the North Pole.", "the North Pole", "Wild penguins live in the southern half of the world, including Antarctica."],
    ["The Wright brothers' first flight lasted 12 hours.", "12 hours", "It lasted about 12 seconds."]
  ],

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
    ["Would you rather...", "be able to pause time", "Great for lie-ins. Terrible for queues, oddly.", "be able to rewind time by ten seconds", "Never drop a sandwich again."],
    ["Would you rather...", "travel back to see a volcano erupt, from far away", "Very loud, very orange, very glad you are far away.", "travel forward to see a new island appear", "It is small, steaming and has no name yet. Name it."],
    ["Would you rather...", "have a robot from the future as a friend", "Helpful, but it corrects your grammar.", "have a knight from the past as a friend", "Loyal, but they challenge the bus driver to a duel."]
  ]
};

/* which one shows today: the day of the year, so it is the same for everyone */
window.B5FUN.today = function(list){
  var d = new Date(), start = new Date(d.getFullYear(), 0, 0);
  var n = Math.floor((d - start) / 86400000);
  return list[n % list.length];
};
