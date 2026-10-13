/* ==========================================================
   LC's Night Shift HQ: swipe deck cards: English
   (English Foundation 1 to 2, built from Jay's baselines, no exam)
   40 quick true or false fact cards. Right for true, left for false.
   link: [activity id, chunk number] for the chunk that teaches it.
   ========================================================== */
window.EGWSWIPE = (window.EGWSWIPE || []).concat([

  /* ---------- spot-it ---------- */
  { s: "english", t: "Signs use big words so you can read them fast.", a: true,
    fix: "Yes. A sign tells you one thing, fast. Read the big words first.", link: ["spot-it", 1] },
  { s: "english", t: "Most posters tell you when and where something is.", a: true,
    fix: "Yes. Look for a day, a time, a place and a price.", link: ["spot-it", 2] },
  { s: "english", t: "On a menu, &pound;2.50 means 2 pounds and 5 pence.", a: false,
    fix: "False. It means 2 pounds and 50 pence. After the dot there are always two numbers.", link: ["spot-it", 3] },
  { s: "english", t: "Open 6pm to 11pm means the cafe shuts at 6pm.", a: false,
    fix: "False. It opens at 6pm and shuts at 11pm. The first time is when it opens.", link: ["spot-it", 4] },
  { s: "english", t: "To find one fact, read every word from the start.", a: false,
    fix: "False. Think what the answer looks like, then hunt for it. A time has am or pm. A price has a &pound; sign.", link: ["spot-it", 5] },
  { s: "english", t: "A reason often comes just after the word because.", a: true,
    fix: "Yes. Wear good shoes, because the streets are bumpy. The reason is the bumpy streets.", link: ["spot-it", 6] },
  { s: "english", t: "The title is usually at the bottom of a poster.", a: false,
    fix: "False. The title is at the top, often big or bold. It tells you what the text is about.", link: ["spot-it", 7] },

  /* ---------- emails ---------- */
  { s: "english", t: "The Subject line says who wrote the email.", a: false,
    fix: "False. From says who wrote it. Subject says what it is about.", link: ["emails", 1] },
  { s: "english", t: "Thanks, Ray at the end of an email is the sign off.", a: true,
    fix: "Yes. The sign off says goodbye. The greeting says hello at the start, like Hi Mo.", link: ["emails", 1] },
  { s: "english", t: "The To line tells you who the email is for.", a: true,
    fix: "Yes. To says who will read it. From says who wrote it.", link: ["emails", 2] },
  { s: "english", t: "Please and can you show the writer is asking for something.", a: true,
    fix: "Yes. Find please or can you. The job they want doing comes straight after.", link: ["emails", 3] },
  { s: "english", t: "Meet me at the bus stop tells you where to meet.", a: true,
    fix: "Yes. At the bus stop is a place. A place tells you where.", link: ["emails", 4] },
  { s: "english", t: "Texts and notes always have a subject line.", a: false,
    fix: "False. Texts and notes often have no subject line. Look for a name at the top or bottom.", link: ["emails", 5] },
  { s: "english", t: "A reply to an email has to be very long.", a: false,
    fix: "False. A reply can be short. Say hello, answer the question, then sign off with your name.", link: ["emails", 6] },

  /* ---------- words ---------- */
  { s: "english", t: "Stuck on a word? The words around it can help.", a: true,
    fix: "Yes. Read the sentence before it and after it. They are clues.", link: ["words", 1] },
  { s: "english", t: "Big and large mean the opposite.", a: false,
    fix: "False. Big and large mean the same. Big and small are opposites.", link: ["words", 2] },
  { s: "english", t: "In <i>a bat flew past</i>, a bat is an animal.", a: true,
    fix: "Yes. A bat can also be a thing you hit a ball with. Flew past tells you which one.", link: ["words", 3] },
  { s: "english", t: "In a picture plan, you can do the steps in any order.", a: false,
    fix: "False. Numbers or arrows show the order. Follow one picture at a time and do not skip a step.", link: ["words", 4] },
  { s: "english", t: "Numbered steps show you what to do, in order.", a: true,
    fix: "Yes. You do step 1, then step 2, and so on. You cannot pour the jelly before you make it.", link: ["words", 5] },
  { s: "english", t: "A recipe is written to sell you something.", a: false,
    fix: "False. A recipe shows you how to do something. An advert is the text that sells.", link: ["words", 6] },

  /* ---------- sentences ---------- */
  { s: "english", t: "There are 24 letters in the alphabet.", a: false,
    fix: "False. There are 26 letters, from a to z.", link: ["sentences", 1] },
  { s: "english", t: "Bun comes before biscuit in alphabetical order.", a: false,
    fix: "False. Both start with b, so look at the second letter. i comes before u, so biscuit comes first.", link: ["sentences", 2] },
  { s: "english", t: "The word I on its own is always a capital.", a: true,
    fix: "Yes. I went home, not i went home. Every sentence starts with a capital too.", link: ["sentences", 3] },
  { s: "english", t: "Days of the week start with a capital letter.", a: true,
    fix: "Yes. Days are names, like Monday and Friday. Months need capitals too.", link: ["sentences", 4] },
  { s: "english", t: "<i>Who left the light on</i> needs a full stop at the end.", a: false,
    fix: "False. It asks something, so it needs a question mark: Who left the light on?", link: ["sentences", 5] },
  { s: "english", t: "<i>On the shelf.</i> is a full sentence.", a: false,
    fix: "False. It leaves you waiting. Who or what is on the shelf? The torch is on the shelf. That is a sentence.", link: ["sentences", 6] },
  { s: "english", t: "The word because joins two ideas and gives a reason.", a: true,
    fix: "Yes. I took a torch because it was dark. Because tells you why.", link: ["sentences", 7] },

  /* ---------- spelling ---------- */
  { s: "english", t: "February has a quiet r after the b.", a: true,
    fix: "Yes. Say it in chunks: Feb, ru, ary. Lots of people miss the first r.", link: ["spelling", 1] },
  { s: "english", t: "<b>becos</b> is the right way to spell because.", a: false,
    fix: "False. It is <b>because</b>. Big elephants can always understand small elephants.", link: ["spelling", 2] },
  { s: "english", t: "The word said has ai in the middle.", a: true,
    fix: "Yes. It sounds like sed, but it is spelt s, a, i, d.", link: ["spelling", 2] },
  { s: "english", t: "More than one torch is spelt torchs.", a: false,
    fix: "False. Words ending in ch add es: torches. Say it out loud and you hear the extra beat.", link: ["spelling", 3] },
  { s: "english", t: "Hospital has 3 beats: hos, pi, tal.", a: true,
    fix: "Yes. Clap each beat. Spell one chunk at a time, then put them together.", link: ["spelling", 4] },
  { s: "english", t: "<i>It is to dark in here</i> uses the right to.", a: false,
    fix: "False. It should be too. Too dark means more than you want. To is for going somewhere.", link: ["spelling", 5] },
  { s: "english", t: "Reading slowly helps you spot spelling mistakes.", a: true,
    fix: "Yes. Your brain reads what it expects to see. Look at one word at a time.", link: ["spelling", 6] },

  /* ---------- forms-notes ---------- */
  { s: "english", t: "On a form, surname means your first name.", a: false,
    fix: "False. Surname is your family name. First name is your own name.", link: ["forms-notes", 1] },
  { s: "english", t: "BLOCK CAPITALS means only the first letter is a capital.", a: false,
    fix: "False. Every letter is a capital, like ALEX MOON.", link: ["forms-notes", 2] },
  { s: "english", t: "To sign a form, you write your name in your own way.", a: true,
    fix: "Yes. Then write the date next to it. Check the form before you sign.", link: ["forms-notes", 3] },
  { s: "english", t: "A note should say who it is from.", a: true,
    fix: "Yes. Who it is to, what, when, where, and your name at the end.", link: ["forms-notes", 4] },
  { s: "english", t: "Each sentence in a note starts with a capital letter.", a: true,
    fix: "Yes. And it ends with a full stop or a question mark.", link: ["forms-notes", 5] },
  { s: "english", t: "A good note has to fill a whole page.", a: false,
    fix: "False. Short is fine. Two or three sentences make a good note.", link: ["forms-notes", 6] }
]);
