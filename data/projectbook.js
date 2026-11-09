/* ==========================================================
   Base 5 - the project book (ELP workbook, Nov 2026)
   The trust's Enterprise Learning Project workbook (Explore ELP
   Workbook Pages, Autumn 2025 v3) as an interactive book that lives
   in every student's HQ, alongside their project page.

   Same 21 steps, same six stages and same order as the paper book,
   so it lines up with the trust's ELP. Each step is one page (a step
   can have more pages: a second draft, another experiment). Students
   see one small card at a time; staff see the whole page.

   Two ways in:
     /<hq>/project-book.html          the student's book (student mode)
     /teacher/project-books.html      Jay writes in any book (staff mode,
                                      window.PROJECTBOOK = { mode: "staff" })

   Who wrote what. Students and Jay never overwrite each other: each
   has their own copy of a page and the book shows whichever is newer,
   field by field (list items one by one). Anything Jay wrote shows in
   Jay's pen colour with a small Jay tag until the student changes it.

   Saved under the HQ's own prefix (so the shared memory carries it
   between devices, see /data/b5site.js), book id BOOK below:
     <P>pb.<BOOK>.s.<step>.<page>    the student's writing on a page
     <P>pb.<BOOK>.j.<step>.<page>    Jay's writing, stamps, pillars and sticky note
     <P>pb.<BOOK>.ds.<step>.<page>.<field>   a student's drawing
     <P>pb.<BOOK>.dj.<step>.<page>.<field>   Jay's drawing
     <P>pb.<BOOK>.jm                 Jay's settings for the book (driving question)
     <P>pb.now                       next stop and stamp count, for the HQ front door
     <P>pb.seen                      which of Jay's notes the student has seen
   Engagement and support notes are staff only: they are saved as
   pbsup.<WHO>.<BOOK>.<step>.<page>, outside the student's prefix, so
   the student's pages never keep or show them.

   Under every card, "Not sure? Help me think" (HELP below): a smaller
   question, an example from Bonnie's book, their own earlier answers,
   where to find out, and a one tap "a hand please" to Jay. Writing boxes
   have voice typing (Say it); photo cards take photos with the camera.
   Stamping a page sends it to BridgeLink Buddy as a Learning note.
   /data/bookplan.js suggests steps for each week (shown on the map and
   on day pages). "Make my booklet" prints the finished book as A5.

   A new project next half term: change BOOK (and TERM). The old book
   stays saved and opens with ?book=<old id>.
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(window.ProjectBook) return;

var BOOK_DEFAULT = "a2-2026";
var TERM = "Autumn 2, 2026";
var BOOK = BOOK_DEFAULT;
try{ var bq = (location.search.match(/[?&]book=([a-z0-9\-]{3,20})/) || [])[1]; if(bq) BOOK = bq; }catch(e){}
var DQ_DEFAULT = (window.B5TERM && window.B5TERM.question) || "If we could time travel, should we?";

var S = window.B5Site || {};
var CFG = window.PROJECTBOOK || {};
var STAFF = CFG.mode === "staff";
var WHOS = ["EGW", "LP", "LW", "LC", "HK", "JT"];
var PREFIX = { EGW: "b5.egw.", LP: "b5.lp.", LW: "b5.lw.", LC: "b5.lc.", HK: "b5.hk.", JT: "b5.jthq." };
var BASES = { EGW: "/egw/", LP: "/lp/", LW: "/lw/", LC: "/lc/", HK: "/hk/", JT: "/jt-hq/" };
var WHO = STAFF ? null : (S.hq || null);
var P = WHO ? (S.prefix || PREFIX[WHO]) : null;
var REDUCED = false;
try{ REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){}

/* ---------- the stages and steps (the trust's wording) ---------- */
var STAGES = [
  { n: "Context and Research",           half: "Creating the Project",   c: "#007291" },
  { n: "Developing Ideas",               half: "Creating the Project",   c: "#00a6c9" },
  { n: "Realising Ideas",                half: "Creating the Project",   c: "#7b4b8f" },
  { n: "Realising the Beautiful Work",   half: "Completing the Project", c: "#ef7724" },
  { n: "Confirming the Beautiful Work",  half: "Completing the Project", c: "#e0950b" },
  { n: "Answering the Driving Question", half: "Completing the Project", c: "#0a2f38" }
];

var PILLARS = [
  ["en", "English", "#ef2c3b"], ["ma", "Mathematics", "#060504"], ["se", "Scientific and Environmental", "#4cbf60"],
  ["hs", "Human and Social", "#3454a7"], ["dm", "Digital Media", "#e05d24"], ["pw", "Physical World and Exploration", "#6958b1"],
  ["ac", "Aesthetic and Creative", "#f8df47"], ["eh", "EHCP", "#ede7df"], ["rel", "Relational (PSHE/RSE)", "#e45ab5"], ["pfa", "PfA", "#21627a"]
];

var I = {
  cover: "M5 3h10a4 4 0 0 1 4 4v14H8a3 3 0 0 1-3-3z M5 18a3 3 0 0 1 3-3h11 M9 7h6",
  intro: "M3 10v4h3l7 4V6L6 10H3z M16.5 9a4 4 0 0 1 0 6 M19 6.5a7.5 7.5 0 0 1 0 11",
  brain: "M9 18h6 M10 21h4 M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",
  research: "M10.5 4a6.5 6.5 0 1 0 0 13a6.5 6.5 0 1 0 0-13z M15.5 15.5L21 21",
  criteria: "M10 6h10 M10 12h10 M10 18h10 M3.5 6l1.5 1.5L7.5 5 M3.5 12l1.5 1.5L7.5 11 M3.5 18l1.5 1.5L7.5 17",
  expert: "M9 11a3.5 3.5 0 1 0 0-7a3.5 3.5 0 1 0 0 7z M2.5 20c.5-4 3.2-6 6.5-6s6 2 6.5 6 M18 3.5l1 2.2 2.4.3-1.8 1.6.5 2.4-2.1-1.2-2.1 1.2.5-2.4-1.8-1.6 2.4-.3z",
  explore: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M15.5 8.5l-2 5-5 2 2-5z",
  document: "M4 8h3l2-3h6l2 3h3v11H4z M12 10.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z",
  skill: "M6.5 6.5v11 M17.5 6.5v11 M3.5 9v6 M20.5 9v6 M6.5 12h11",
  drafts: "M4 20l1-4L16 5l3 3L8 19z M14 7l3 3",
  experiment: "M9 3h6 M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3 M7.5 15h9",
  midway: "M5 21V4 M5 4h12l-2.5 4 2.5 4H5",
  reflect: "M7 15a4 4 0 0 1-.6-8 5 5 0 0 1 9.6-1 4 4 0 0 1 1.5 7.8V15z M8.5 18.5h.1 M5.5 21h.1",
  safety: "M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z M9 12l2 2 4-4",
  make: "M14 3.5l6.5 6.5-2.5 2.5L11.5 6z M13 8L4 17a1.4 1.4 0 0 0 0 2l1 1a1.4 1.4 0 0 0 2 0l9-9",
  extend: "M4 9V4h5 M20 9V4h-5 M4 15v5h5 M20 15v5h-5 M4 4l5 5 M20 4l-5 5 M4 20l5-5 M20 20l-5-5",
  review: "M12 3l2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.8z",
  celebrate: "M3 21l5-14 9 9z M8.5 8.5l7 7 M14 3c0 2 1 3 3 3 M18 9.5c1-1 2-1 3 0 M15.5 5.5l1-1 M20.5 3.5l.5-.5",
  prespractice: "M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z M6 11a6 6 0 0 0 12 0 M12 17v4 M9 21h6",
  present: "M3 4h18v11H3z M12 15v3 M8 21l4-3 4 3 M7 11l3-3 2 2 4-4",
  finalref: "M4 5h16v11H9l-5 4z M8 9h8 M8 12h5",
  answer: "M8 15.5a4 4 0 1 1 0-8a4 4 0 0 1 0 8z M11.5 11.5H21 M18 11.5v3 M15 11.5v2"
};

var FACES = ["Terrible", "Bad", "Good", "Great", "Awesome"];

/* Each card: id, t (type), label (the paper book's wording, used for staff
   and print), q (what the student sees), hint, st (starters to tap). */
var STEPS = [
  { id: "cover", n: "My cover", stage: -1, cards: [
    { id: "title", t: "text", label: "Project title", q: "Give your project a name", hint: "A working title is fine. It can change any time.", st: ["Time Trouble", "Should We?", "Back and Forth", "The Time Question"] },
    { id: "look", t: "cover", label: "Cover", q: "Pick a colour and up to three stickers" }
  ]},

  /* ---- Creating the Project: Context and Research ---- */
  { id: "intro", n: "Introduce the Project", stage: 0, blurb: "What is the question, and what might you make?", cards: [
    { id: "dq", t: "dq", label: "Driving Question", q: "In your own words, what is it asking?", st: ["It is asking whether...", "Basically...", "I think it means..."] },
    { id: "work", t: "long", label: "Beautiful Work", q: "What might you make?", hint: "Anything you can make counts. Not sure yet is fine.", st: ["A film", "A song", "A game", "A model", "A comic", "A podcast", "Not sure yet, maybe..."] },
    { id: "consider", t: "list", label: "Things to Consider", q: "Anything that might matter?", hint: "Tap one or add your own.", st: ["How long I have", "What I need to get", "Who could help", "What could go wrong", "Where I can work on it"] },
    { id: "important", t: "long", label: "Important Information", q: "Anything important to remember?", hint: "Dates, kit, anything Jay mentioned.", st: ["Remember to...", "It needs to be ready by...", "Jay said..."] },
    { id: "other", t: "long", label: "Any other information", q: "Anything else?", hint: "Totally optional.", st: [] }
  ]},
  { id: "brain", n: "Brainstorming", stage: 0, blurb: "Get every idea out. No bad ones.", cards: [
    { id: "web", t: "web", label: "Brainstorm", q: "Throw every idea at the light bulb", hint: "Type one and pop it on. Drag them about. Silly ones welcome.", st: ["What if...", "Go back to...", "Change one thing", "Never change...", "Bring something back"] },
    { id: "sketch", t: "sketch", label: "Brainstorm drawing", q: "Or draw it out", hint: "Arrows, doodles, anything.", grid: true }
  ]},
  { id: "research", n: "Research, Read, Ask", stage: 0, blurb: "Find things out: look it up, read it, ask someone.", cards: [
    { id: "intent", t: "text", label: "Intent", q: "What are you trying to find out?", st: ["I want to find out...", "How did...", "Why do people...", "What would happen if..."] },
    { id: "days", t: "days", label: "Mon Tue Wed Thu Fri", q: "Which days did you work on this?" },
    { id: "source", t: "list", label: "Source", q: "Where did you look?", hint: "Tap one or add your own.", st: ["A website", "A video", "A book", "Asked Jay", "Asked Holly", "Asked someone at home"] },
    { id: "info", t: "long", label: "Information", q: "What did you find out?", st: ["I found out that...", "The surprising bit was...", "It turns out..."] },
    { id: "facts", t: "list", label: "Key Facts", q: "The best facts, one at a time", hint: "Short and punchy." },
    { id: "consider", t: "list", label: "Things to Consider", q: "Anything to think about?", st: ["Is this source true?", "Is it up to date?", "Who made it?"] }
  ]},
  { id: "criteria", n: "Criteria Creation", stage: 0, blurb: "Decide what would make your project good.", cards: [
    { id: "sources", t: "list", label: "Sources", q: "What have other people made like this?", hint: "Films, songs, games, models: anything a bit like yours.", st: ["A film I like", "A song", "A game", "Something online"] },
    { id: "compare", t: "web", label: "Comparisons and Ideas", q: "What would you borrow? What would you do differently?", st: ["Borrow:", "Do differently:", "Better if..."] },
    { id: "rubric", t: "rubric", label: "Suggested Project Rubric", q: "Your own checklist for a good one", hint: "What matters, and what good looks like.", st: ["It answers the question", "It looks finished", "People understand it", "It is my own idea", "It makes people think"] },
    { id: "consider", t: "list", label: "Things to Consider", q: "Anything else to think about?" }
  ]},

  /* ---- Developing Ideas ---- */
  { id: "expert", n: "Consult the Expert", stage: 1, blurb: "Find someone who knows, and ask them.", cards: [
    { id: "name", t: "text", label: "Name", q: "Who is your expert?", hint: "Anyone who knows about this: someone at school, at home, or online.", st: ["Jay", "Holly", "Someone at home", "Someone online"] },
    { id: "about", t: "long", label: "About the Expert", q: "What do they know about?", st: ["They know about...", "They have done...", "I picked them because..."] },
    { id: "photo", t: "sketch", label: "Photo", q: "Draw them, or add a photo link", hint: "Stick people absolutely count.", link: true },
    { id: "questions", t: "qa", label: "Questions to answer", q: "What will you ask them?", st: ["What is the hardest part of...", "How did you learn...", "What would you do if...", "Should we...?"] }
  ]},
  { id: "explore", n: "Explore and Fieldwork", stage: 1, blurb: "Go and see something real.", cards: [
    { id: "where", t: "text", label: "Visit", q: "Where are you going?", st: ["A museum", "The library", "Outside", "A trip"] },
    { id: "date", t: "date", label: "Date", q: "When?" },
    { id: "reason", t: "long", label: "Reason for Visit", q: "Why go there?", st: ["To find out...", "To see...", "Because..."] },
    { id: "questions", t: "qa", label: "Questions to answer", q: "What do you want to find out?" },
    { id: "record", t: "long", label: "Record of the trip", q: "What happened?", st: ["First we...", "I saw...", "The best bit was...", "I did not expect..."] },
    { id: "pics", t: "links", label: "Photos and videos", q: "Any photos or videos?", hint: "Put them in your school Drive and paste the link here." },
    { id: "outcome", t: "long", label: "Outcome of Visit", q: "What did you get out of it?", st: ["It helped me...", "Now I know...", "It changed my mind about..."] }
  ]},
  { id: "document", n: "Document and Record", stage: 1, blurb: "A quick note of where you are up to.", cards: [
    { id: "log", t: "log", label: "Week and date, Intent focus, Steps completed", q: "Add a quick log entry", hint: "What you are focusing on. The book adds the date and your stamps for you.", st: ["Finishing my...", "Starting my...", "Trying out...", "Fixing..."] }
  ]},
  { id: "skill", n: "Skill Up", stage: 1, blurb: "Practise a skill your project needs.", cards: [
    { id: "skill", t: "text", label: "Skill", q: "What skill are you levelling up?", st: ["Drawing", "Measuring", "Filming", "Editing", "Writing lyrics", "Using a tool", "Typing"] },
    { id: "sketch", t: "sketch", label: "Practice space", q: "Practise here", hint: "Grid on or off. Mess is how practice looks.", grid: true },
    { id: "learned", t: "long", label: "What I learned", q: "What can you do now?", st: ["Now I can...", "I got better at...", "Still tricky:"] }
  ]},

  /* ---- Realising Ideas ---- */
  { id: "drafts", n: "Making Drafts", stage: 2, blurb: "A first go. Then a better go.", cards: [
    { id: "draft", t: "sketch", label: "Draft", q: "Your draft", hint: "Draw it here, or add a link to a photo, video or file.", link: true, grid: true },
    { id: "works", t: "long", label: "What works", q: "What works?", st: ["I like...", "This bit is good because...", "People liked..."] },
    { id: "change", t: "long", label: "What needs to change", q: "What would you change?", st: ["Next time...", "I would fix...", "It needs..."] }
  ]},
  { id: "experiment", n: "Experiment", stage: 2, blurb: "Test something out and see what happens.", cards: [
    { id: "name", t: "text", label: "Experiment", q: "What are you testing?", st: ["Will it...", "Which is better...", "What happens if..."] },
    { id: "date", t: "date", label: "Date", q: "When?" },
    { id: "reason", t: "long", label: "Reason for Experiment", q: "Why test it?", st: ["I want to know...", "Because..."] },
    { id: "kit", t: "list", label: "Equipment needed", q: "What do you need?" },
    { id: "questions", t: "qa", label: "Questions to answer", q: "What questions should it answer?" },
    { id: "happened", t: "long", label: "What happened", q: "What happened?", st: ["It worked because...", "It did not work because...", "Surprisingly..."] },
    { id: "next", t: "long", label: "Next steps", q: "What next?", st: ["Next I will...", "Try it again with...", "Keep it as it is"] }
  ]},
  { id: "midway", n: "Midway Checkpoint", stage: 2, blurb: "Halfway. How is it going?", cards: [
    { id: "feel", t: "faces", label: "How are you feeling about the project?", q: "How are you feeling about the project?" },
    { id: "good", t: "long", label: "What has been successful or enjoyable so far?", q: "What has been good so far?", st: ["I enjoyed...", "I am pleased with...", "It went well when..."] },
    { id: "support", t: "long", label: "What do you need more support with?", q: "What would help?", st: ["It would help if...", "I am stuck on...", "Nothing right now"] },
    { id: "next", t: "long", label: "Next steps?", q: "What next?", st: ["Next I will...", "I want to try..."] }
  ]},

  /* ---- Completing the Project: Realising the Beautiful Work ---- */
  { id: "reflect", n: "Reflect and Feedback", stage: 3, blurb: "Look back, and hear what others think.", cards: [
    { id: "reflect", t: "long", label: "Reflection", q: "What is going on in your head about it?", st: ["I noticed...", "I am proud of...", "I found it hard when...", "I changed my mind about..."] },
    { id: "feedback", t: "list", label: "Feedback", q: "What did other people say?", st: ["Jay said...", "Holly said...", "Someone at home said...", "A friend said..."] },
    { id: "next", t: "long", label: "Next steps", q: "What will you do with it?", st: ["I am going to...", "I will keep...", "I will change..."] }
  ]},

  /* ---- Confirming the Beautiful Work ---- */
  { id: "safety", n: "Safety Session", stage: 4, optional: true, blurb: "Only if your project uses tools or kit.", cards: [
    { id: "use", t: "list", label: "What do we need to use?", q: "What will you use?", st: ["Scissors", "Glue gun", "Saw", "Laptop", "Camera", "Paint"] },
    { id: "howsafe", t: "long", label: "How to use safely", q: "How do you use it safely?", st: ["Always...", "Never...", "Keep it..."] },
    { id: "me", t: "long", label: "How I can look after myself", q: "How can you look after yourself?", st: ["Take a break when...", "Ask for help if...", "Wear..."] },
    { id: "remember", t: "list", label: "Things to remember", q: "Three things to remember", max: 3 },
    { id: "important", t: "long", label: "Important information", q: "Anything else important?" }
  ]},
  { id: "make", n: "Make it! Build it!", stage: 4, blurb: "The main event: making the real thing.", cards: [
    { id: "goal", t: "long", label: "Main Goal", q: "What is the main goal?", st: ["Today I want to...", "By the end I will have...", "The finished thing will..."] },
    { id: "done", t: "list", label: "What got done", q: "What got done?", hint: "One line each time you work on it.", st: ["Finished the...", "Started the...", "Fixed the..."] },
    { id: "evidence", t: "links", label: "Evidence", q: "Photos, videos or files of it", hint: "Put them in your school Drive and paste the link here." },
    { id: "steps", t: "stamps", label: "Steps completed", q: "Steps you have stamped so far" }
  ]},
  { id: "extend", n: "Extend and Expand", stage: 4, blurb: "How could it go further?", cards: [
    { id: "idea", t: "long", label: "Extend and Expand", q: "How could it go further?", st: ["I could add...", "A bigger version would...", "What if...", "Part two could..."] },
    { id: "sketch", t: "sketch", label: "Extend and Expand drawing", q: "Draw the bigger version", grid: true }
  ]},

  /* ---- Answering the Driving Question ---- */
  { id: "review", n: "Final Review", stage: 5, blurb: "Rate it, and say why.", cards: [
    { id: "rating", t: "faces", label: "Project rating", q: "How would you rate your project?" },
    { id: "reason", t: "long", label: "The main reason for my project rating", q: "Why that one?", st: ["Because...", "Mostly because..."] },
    { id: "proud", t: "long", label: "Thing to be most proud of", q: "What are you most proud of?", st: ["I am proud of...", "The bit where..."] },
    { id: "best", t: "long", label: "What was the most successful part of the project", q: "What worked best?", st: ["The best part was...", "It really worked when..."] },
    { id: "work", t: "long", label: "Something to work on in the next project", q: "One thing for next time", st: ["Next time I will...", "I want to get better at..."] },
    { id: "skill", t: "text", label: "A skill gained in this project", q: "A skill you gained", st: ["Planning", "Drawing", "Filming", "Asking questions", "Not giving up"] }
  ]},
  { id: "celebrate", n: "Celebration: Exhibit and Admire", stage: 5, blurb: "Show it off. You made a thing.", cards: [
    { id: "wall", t: "links", label: "Exhibit", q: "Your gallery", hint: "Add a photo or video link with a caption. Each one becomes a polaroid.", polaroid: true },
    { id: "said", t: "list", label: "What people said", q: "What did people say about it?", st: ["Someone said...", "Jay said...", "My favourite comment was..."] }
  ]},
  { id: "prespractice", n: "Presentation Practice", stage: 5, optional: true, blurb: "A run through, and any help you need.", cards: [
    { id: "where", t: "pick", label: "Where?", q: "Where will it happen?", opts: ["Just with Jay", "With the Base", "A small group", "Recorded, no live audience", "Not sure yet"], note: "Anything else about where?" },
    { id: "what", t: "long", label: "What?", q: "What do you need to do for it?", st: ["Show my...", "Talk about...", "Play my..."] },
    { id: "how", t: "long", label: "How?", q: "Any extra support you would like?", st: ["It would help if...", "Can someone...", "No thanks, I am OK"] }
  ]},
  { id: "present", n: "Presentation", stage: 5, blurb: "Your cue cards, and how it went.", cards: [
    { id: "cues", t: "cues", label: "Presentation", q: "Make your cue cards", hint: "One short line per card. Then have a practice run.", st: ["Hello, my project is...", "The question was...", "I made...", "My answer is...", "Any questions?"] },
    { id: "how", t: "faces", label: "How did it go?", q: "How did it go?" },
    { id: "note", t: "long", label: "Notes", q: "Anything to remember for next time?" }
  ]},
  { id: "finalref", n: "Final Reflections", stage: 5, blurb: "Looking back on the whole thing.", cards: [
    { id: "complete", t: "pick", label: "Did you complete the Beautiful Work?", q: "Did you finish it?", opts: ["No, didn't finish", "No, ran out of time", "It's finished, but rushed", "Yes (with extra time or support)", "Yes"] },
    { id: "feel", t: "faces", label: "How do you feel about the Beautiful Work?", q: "How do you feel about it?" },
    { id: "answered", t: "pick", label: "Did the Beautiful Work answer the Driving Question?", q: "Did it answer the question?", opts: ["No", "A little", "Somewhat", "Yes, with changes", "Yes"] },
    { id: "changes", t: "pick", label: "Would you make any changes to the Beautiful Work?", q: "Would you change anything?", opts: ["Yes, it didn't work", "Yes, most of it", "Some small design changes", "Minor tweaks", "No, it's perfect"] },
    { id: "problems", t: "long", label: "What problems did you face? What worked well for you?", q: "What was tricky? What worked well for you?", st: ["It was tricky when...", "It helped when...", "Working with... was..."] },
    { id: "suggest", t: "long", label: "Suggestions that could help improve the Beautiful Work", q: "Any ideas to make it even better?", st: ["It could have...", "Next time add..."] },
    { id: "skills", t: "list", label: "What skills did you learn in completing your project?", q: "Skills you learned", hint: "Each one starts with I can.", st: ["I can plan a project", "I can ask good questions", "I can make a draft better", "I can present my work"] }
  ]},
  { id: "answer", n: "The Answer and the Outcomes", stage: 5, blurb: "Your answer to the big question.", cards: [
    { id: "answer", t: "pick", label: "The Answer", q: "So: should we?", opts: ["Yes", "No", "It depends", "Still not sure"], note: "Because..." },
    { id: "how", t: "long", label: "How the Beautiful Work answers the Driving Question", q: "How does what you made answer it?", st: ["My project shows...", "It answers it by...", "When people see it they..."] },
    { id: "outcomes", t: "list", label: "Beautiful Work Outcomes", q: "What came out of it?", st: ["I made...", "People learned...", "I found out...", "I changed my mind about..."] }
  ]}
];
var BY = {}; STEPS.forEach(function(s){ BY[s.id] = s; });

/* ==========================================================
   Help me think: support for every card when a student does not
   know the answer yet. Each card can have:
     ask    a smaller, easier question; tapping an answer drops a
            sentence into their box (they can change it)
     eg     an example, from Bonnie's own project book (her project:
            a podcast called Paws Through Time)
     look   their own earlier answers in the book ("step.card")
     where  where they could find out, with an optional link
   Every card also offers "Ask Jay or Holly": one tap sends Jay a
   message, and the staff page shows that they asked.
   ========================================================== */
var A = function(q, o){ return { q: q, o: o }; };
var HELP = {
  "cover.title": { ask: A("What is your project mostly about?", [["A place", "The Trip to "], ["A person", "Meet "], ["A big what if", "What If "], ["A warning", "Do Not Touch the Past"], ["Something funny", "Oops, Wrong Century"]]),
    eg: "Bonnie called hers: Paws Through Time.", look: ["intro.work", "brain.web"] },
  "cover.look": { eg: "Bonnie picked orange, a paw and a clock. Obviously." },

  "intro.dq": { ask: A("Which bit of the question jumps out at you?", [["Could we?", "It is asking whether time travel could even happen, and what it would be like."], ["Should we?", "It is asking whether time travel would be a good idea or a bad idea."], ["Who decides?", "It is asking who should get to decide if people time travel."], ["What could go wrong?", "It is asking what could go wrong if people could change the past."]]),
    eg: "Bonnie wrote: It is asking if going back in time is a good idea, or if it just causes chaos (and missed walks).",
    where: "Say it out loud to Jay or Holly first, then pop it in. Talking it through counts." },
  "intro.work": { ask: A("What do you like making most?", [["Something to watch", "I might make a short film or an animation."], ["Something to listen to", "I might make a song or a podcast."], ["Something to play", "I might make a game or a quiz."], ["Something to hold", "I might make a model or a sculpture."], ["Something to read", "I might make a comic or a story."]]),
    eg: "Bonnie: I might make a podcast where I interview dogs from different centuries.", look: ["brain.web", "cover.title"],
    where: "The Idea Lab prints ideas when you pull the lever.", link: ["Open the Idea Lab", "/projects/ideas.html"] },
  "intro.consider": { ask: A("Which of these could trip you up?", [["Time", "Having enough time to finish"], ["Kit", "Getting the right kit"], ["Help", "Knowing who to ask for help"], ["Space", "Somewhere quiet to work"], ["Skills", "Learning a skill I do not have yet"]]),
    eg: "Bonnie listed: Do I have a microphone? Will the cat agree to be interviewed?" },
  "intro.important": { ask: A("Anything about when or where?", [["A date", "It needs to be ready by "], ["A place", "I will work on it in "], ["A rule", "Jay said we need to "]]),
    eg: "Bonnie: The exhibition is in the last week of term. No barking during recording.", where: "Jay knows the dates. Ask him, then pop them in." },
  "intro.other": { eg: "Bonnie: I would like to record outside if it is not raining." },

  "brain.web": { ask: A("Try one of these sparks", [["A year", "Go back to the year "], ["A person", "Meet "], ["A place", "Visit "], ["A change", "Change one thing: "], ["A never", "Never change "], ["The future", "Jump forward to "]]),
    eg: "Bonnie's ideas: Meet the first dog ever. Stop baths being invented. Watch a 1966 football match.", look: ["intro.dq", "intro.work"],
    where: "The Question Wall and the Idea Lab are full of sparks.", link: ["Open the Idea Lab", "/projects/ideas.html"] },
  "brain.sketch": { eg: "Bonnie drew a big clock in the middle, with arrows to everywhere she would visit.", look: ["brain.web"] },

  "research.intent": { ask: A("Which of these do you most want to know?", [["How", "How would a time machine work?"], ["What happened", "What happened in the year I want to visit?"], ["What if", "What would happen if someone changed the past?"], ["Who", "Who has thought about time travel before?"]]),
    eg: "Bonnie: I want to find out what dogs did in Victorian times.", look: ["brain.web", "intro.work"] },
  "research.days": { eg: "Just tap the days you worked on it. That is all this one needs." },
  "research.source": { ask: A("Where could you look?", [["A search", "A search on the school laptop"], ["A video", "A video"], ["A book", "A library book"], ["A person", "Asking someone who knows"], ["A trip", "Something I saw on a trip"]]),
    eg: "Bonnie used a dog history video, and Jay (he knows a lot about biscuits).", where: "Not sure a website is any good? Ask Jay to look with you." },
  "research.info": { ask: A("Start small. Which fits?", [["A surprise", "The most surprising thing I found was "], ["A number", "A number I found was "], ["Then and now", "Back then it was different because "], ["Someone said", "Someone said "]]),
    eg: "Bonnie found out Victorian dogs had jobs, like turning the meat on a spit. She is outraged.", look: ["research.intent", "research.source"] },
  "research.facts": { ask: A("Turn one thing you found into a short fact", [["Who", "The person who did it was "], ["When", "It happened in "], ["Where", "It happened in "], ["How many", "There were "]]),
    eg: "Bonnie: The first dog show was in 1859. Poodles were water dogs.", look: ["research.info"] },
  "research.consider": { ask: A("Check your sources", [["Is it true?", "Is this source true?"], ["Is it old?", "Is it up to date?"], ["Who made it?", "Who made it, and why?"]]),
    eg: "Bonnie: The website was made by a dog food company. Hmm." },

  "criteria.sources": { ask: A("Think of something you love that is a bit like your project", [["A film", "A film I like: "], ["A song", "A song I like: "], ["A game", "A game I like: "], ["A video maker", "A video maker I like: "]]),
    eg: "Bonnie: Doctor Who, and a podcast her owner listens to on walks.", look: ["intro.work"] },
  "criteria.compare": { ask: A("Finish one of these", [["Borrow", "I would borrow the way it "], ["Change", "I would do differently: "], ["Better", "It would be better if "]]),
    eg: "Bonnie would borrow the music at the start, but make it shorter so people do not wander off.", look: ["criteria.sources"] },
  "criteria.rubric": { ask: A("What would make you proud of it?", [["Finished", "It is finished"], ["Clear", "People understand it"], ["Mine", "It is my own idea"], ["Answers it", "It answers the big question"], ["Effort", "I tried my hardest on it"], ["Looks good", "It looks or sounds good"]]),
    eg: "Bonnie: It answers the question. Good looks like: someone could tell you my answer after listening.", look: ["intro.work", "criteria.sources"] },
  "criteria.consider": { eg: "Bonnie: Keep it under five minutes. Dogs get bored." },

  "expert.name": { ask: A("Who knows about your topic?", [["Jay", "Jay"], ["Holly", "Holly"], ["Someone at home", "Someone at home"], ["Another teacher", "Another teacher at school"], ["Someone online", "Someone online (found with Jay)"]]),
    eg: "Bonnie picked the vet, because the vet knows everything about dogs.", where: "Not sure who? Jay can help you find someone." },
  "expert.about": { ask: A("What makes them an expert?", [["Their job", "Their job is "], ["Years", "They have done it for "], ["Things made", "They have made "], ["What they know", "They know a lot about "]]),
    eg: "Bonnie: The vet has looked after dogs for 20 years.", look: ["expert.name"] },
  "expert.photo": { eg: "A stick person with glasses absolutely counts.", where: "Ask your expert if you can take a photo. If not, draw them." },
  "expert.questions": { ask: A("Start with one of these", [["Hardest part", "What is the hardest part of your job?"], ["Getting started", "How did you get started?"], ["Should we?", "Do you think we should time travel?"], ["Advice", "What advice would you give me?"]]),
    eg: "Bonnie asked: Were dogs happier 100 years ago?", look: ["research.intent"] },

  "explore.where": { ask: A("Which trip is it?", [["Museum", "The museum"], ["Outside", "Outside in the local area"], ["Library", "The library"], ["Online", "A virtual tour online"]]),
    eg: "Bonnie: The park, to compare it with old photos.", where: "Jay knows this half term's trips." },
  "explore.date": { eg: "Tap Today if it is today." },
  "explore.reason": { ask: A("Why go?", [["See", "To see real things from the past"], ["Ask", "To ask people questions"], ["Compare", "To compare then and now"], ["Ideas", "To get ideas for my project"]]),
    eg: "Bonnie: To see if the park was more fun in 1950." },
  "explore.questions": { ask: A("Start with one of these", [["What", "What is the oldest thing here?"], ["Why", "Why is this here?"], ["Then and now", "What has changed since then?"], ["Should we?", "Would going back here be a good idea?"]]),
    look: ["research.intent"] },
  "explore.record": { ask: A("Start with one", [["First", "First we "], ["Saw", "I saw "], ["Best bit", "The best bit was "], ["Weirdest", "The weirdest thing was "]]),
    eg: "Bonnie: First we walked to the park. I saw a bench from 1950. The best bit was a squirrel." },
  "explore.pics": { eg: "Bonnie took one photo of the old bench and one of a very rude squirrel.", where: "Tap Take a photo while you are there, or add them when you are back." },
  "explore.outcome": { ask: A("What did the visit change?", [["I know", "Now I know "], ["An idea", "It gave me an idea: "], ["My mind", "It changed my mind about "], ["Sure", "It made me sure that "]]),
    look: ["explore.reason", "explore.record"] },

  "document.log": { ask: A("What are you doing today?", [["Starting", "Starting my "], ["Finishing", "Finishing my "], ["Fixing", "Fixing my "], ["Trying", "Trying out "], ["Thinking", "Thinking about "]]),
    eg: "Bonnie, Tue 10 Nov: Recording the intro. The book adds her stamps for her." },

  "skill.skill": { ask: A("What does your project need you to be good at?", [["Drawing", "Drawing"], ["Filming", "Filming"], ["Editing", "Editing"], ["Building", "Building"], ["Writing", "Writing"], ["Speaking", "Speaking to people"]]),
    eg: "Bonnie: Speaking clearly into a microphone (without licking it).", look: ["intro.work"] },
  "skill.sketch": { eg: "Bonnie drew the same clock five times. The fifth was the best. That is practice." },
  "skill.learned": { ask: A("Compare before and now", [["Now I can", "Now I can "], ["Better at", "I got better at "], ["Still tricky", "It is still tricky to "], ["A trick", "A trick that helped: "]]),
    look: ["skill.skill"] },

  "drafts.draft": { eg: "Bonnie's first draft was a messy plan on the back of a biscuit box.", where: "A draft can be a photo of something on paper. Tap Take a photo." },
  "drafts.works": { ask: A("What do you like about it?", [["The look", "I like how it looks"], ["The idea", "The idea is good"], ["One part", "My favourite part is "], ["People", "People liked "]]),
    eg: "Bonnie: The jingle at the start is catchy." },
  "drafts.change": { ask: A("If you had one more go, what would you change?", [["Longer", "Make it longer"], ["Shorter", "Make it shorter"], ["Clearer", "Make it clearer"], ["Neater", "Make it neater"], ["Add", "Add "]]),
    eg: "Bonnie: Less barking in the middle bit.", look: ["criteria.rubric"] },

  "experiment.name": { ask: A("Test something small", [["Which is better", "Which is better: "], ["Will it work", "Will it work if "], ["How long", "How long does it take to "], ["What people like", "Do people prefer "]]),
    eg: "Bonnie tested: which microphone sounds better, the laptop or the headset?" },
  "experiment.date": { eg: "Tap Today if it is today." },
  "experiment.reason": { ask: A("Why test it?", [["To choose", "So I know which one to use"], ["To check", "To check it works before the real thing"], ["Curious", "Because I was curious"]]),
    look: ["experiment.name"] },
  "experiment.kit": { ask: A("What do you need?", [["Laptop", "Laptop"], ["Paper", "Paper and pens"], ["Camera", "Camera"], ["Timer", "A timer"], ["Materials", "Materials to build with"]]),
    eg: "Bonnie: Laptop, headset, one very patient cat." },
  "experiment.questions": { ask: A("Start with one of these", [["Which", "Which one is better?"], ["Why", "Why did it happen?"], ["Again", "Would it happen again?"]]) },
  "experiment.happened": { ask: A("How did it go?", [["It worked", "It worked because "], ["It did not", "It did not work because "], ["A surprise", "The surprise was "], ["One was better", "One worked better: "]]),
    eg: "Bonnie: The headset was clearer. The laptop picked up the cat." },
  "experiment.next": { ask: A("So what next?", [["Use it", "I will use "], ["Again", "I will test it again with "], ["Change", "I will change "]]),
    look: ["experiment.happened"] },

  "midway.feel": { eg: "There is no wrong answer here. Bonnie picked Good, because recording is hard but fun." },
  "midway.good": { ask: A("Think of one moment", [["Enjoyed", "I enjoyed "], ["Pleased", "I am pleased with "], ["Easy", "It was easy to "], ["Made", "I made "]]),
    look: ["document.log", "drafts.works"] },
  "midway.support": { ask: A("Which would help most?", [["Time", "More time on it"], ["Showing", "Someone showing me how"], ["Quiet", "A quieter place to work"], ["Kit", "Different kit"], ["Talking", "Talking it through with Jay or Holly"], ["Fine", "Nothing right now, I am fine"]]),
    eg: "Bonnie: Someone to hold the microphone. Paws are not great at it." },
  "midway.next": { ask: A("What is next?", [["Finish", "Finish "], ["Start", "Start "], ["Try", "Try "]]),
    look: ["intro.work", "drafts.change"] },

  "reflect.reflect": { ask: A("Pick a feeling to start from", [["Proud", "I am proud of "], ["Hard", "It was hard when "], ["Changed", "I changed my mind about "], ["Surprised", "I was surprised that "]]),
    eg: "Bonnie: I was surprised that I liked editing more than recording.", look: ["midway.good", "midway.support"] },
  "reflect.feedback": { ask: A("Who did you show it to?", [["Jay", "Jay said "], ["Holly", "Holly said "], ["Home", "Someone at home said "], ["A friend", "A friend said "]]),
    eg: "Bonnie: Jay said the jingle is stuck in his head. Sorry, Jay.", where: "Show someone, then ask them: what is one thing you like, and one thing to change?" },
  "reflect.next": { ask: A("What will you do with it?", [["Keep", "I will keep "], ["Change", "I will change "], ["Add", "I will add "]]),
    look: ["reflect.feedback"] },

  "safety.use": { ask: A("Will you use any of these?", [["Sharp things", "Scissors or a craft knife"], ["Hot things", "A glue gun"], ["Power tools", "Power tools"], ["Screens", "A laptop or camera"], ["Paint", "Paint or glue"]]) },
  "safety.howsafe": { ask: A("Pick the ones that fit", [["Away from me", "Cut away from my body"], ["Back on the stand", "Put it back on its stand"], ["With an adult", "Use it with an adult nearby"], ["Tidy cables", "Keep cables tidy"]]),
    look: ["safety.use"], where: "Jay or Holly will show you how to use anything new before you start." },
  "safety.me": { ask: A("Pick the ones that fit", [["Breaks", "Take a break when I need one"], ["Ask", "Ask for help if I am not sure"], ["Gloves", "Wear gloves or goggles"], ["Stop", "Stop if something feels wrong"]]) },
  "safety.remember": { ask: A("Three to remember", [["Ask first", "Ask before using new kit"], ["Tidy", "Tidy up as I go"], ["Wash", "Wash my hands after"]]) },
  "safety.important": { where: "Jay will go through anything important with you before you start." },

  "make.goal": { ask: A("By the end of today...", [["I will have", "By the end I will have "], ["Finish", "I will finish "], ["Start", "I will start "]]),
    eg: "Bonnie: By the end I will have recorded episode one.", look: ["intro.work", "drafts.change"] },
  "make.done": { ask: A("What got done today?", [["Finished", "Finished the "], ["Started", "Started the "], ["Fixed", "Fixed the "], ["Tried", "Tried "]]),
    look: ["make.goal"] },
  "make.evidence": { eg: "Bonnie took a photo of her set up every day, even the messy days.", where: "Tap Take a photo as you go. Messy photos are still evidence." },

  "extend.idea": { ask: A("How could it grow?", [["Bigger", "Make a bigger version"], ["Part two", "Make a part two"], ["Share it", "Share it with more people"], ["Add", "Add "], ["Something new", "Turn it into a "]]),
    eg: "Bonnie: Season two, where she interviews cats. Controversial.", look: ["brain.web"] },
  "extend.sketch": { eg: "Bonnie drew a poster for season two.", look: ["extend.idea"] },

  "review.rating": { eg: "There is no wrong answer. Pick the one that feels true today.", look: ["midway.feel"] },
  "review.reason": { ask: A("Start with one", [["Because", "Because "], ["It worked", "Mostly because it "], ["It did not", "Because it did not "]]),
    look: ["review.rating", "midway.feel"] },
  "review.proud": { ask: A("Think of one moment", [["One bit", "The bit where "], ["Finishing", "That I finished it"], ["Keeping going", "That I kept going when "], ["My idea", "My idea of "]]),
    look: ["midway.good", "reflect.reflect"] },
  "review.best": { ask: A("Start with one", [["The best part", "The best part was "], ["It worked", "It really worked when "]]),
    look: ["drafts.works", "reflect.feedback"] },
  "review.work": { ask: A("Start with one", [["Next time", "Next time I will "], ["Better at", "I want to get better at "], ["Plan", "I will plan "]]),
    look: ["midway.support", "drafts.change"] },
  "review.skill": { ask: A("Tap one", [["Planning", "Planning"], ["Making", "Making"], ["Asking", "Asking questions"], ["Keeping going", "Not giving up"], ["Presenting", "Presenting"]]),
    look: ["skill.skill", "skill.learned"] },

  "celebrate.wall": { eg: "Bonnie's gallery: her microphone set up, the edit on screen, and her face when it was finished.", where: "Tap Take a photo, or pick ones you took before." },
  "celebrate.said": { ask: A("Start with one", [["Liked", "Someone liked "], ["Asked", "Someone asked "], ["Laughed", "Someone laughed at "]]),
    eg: "Bonnie: Someone said they would listen to season two. Even the cat." },

  "prespractice.where": { where: "Ask Jay what the options are. Recording it instead of doing it live is fine." },
  "prespractice.what": { ask: A("Pick what you will do", [["Show it", "Show my project"], ["How I made it", "Talk about how I made it"], ["My answer", "Say my answer to the big question"], ["Questions", "Answer a question or two"]]) },
  "prespractice.how": { ask: A("Which would help?", [["Cue cards", "Have my cue cards"], ["Someone next to me", "Have someone next to me"], ["Small group", "Present to a small group"], ["Record it", "Record it first"], ["I am OK", "I am OK, thanks"]]) },

  "present.cues": { ask: A("Every presentation needs a few of these. Tap one to start a card.", [["Hello", "Hello, my project is called "], ["The question", "The question was: should we time travel?"], ["What I made", "I made a "], ["How", "To make it I "], ["My answer", "My answer is "], ["Thanks", "Thanks for watching. Any questions?"]]),
    eg: "Bonnie's cards: Hello, I am Bonnie. My podcast is Paws Through Time. My answer is: it depends.", look: ["cover.title", "intro.work", "answer.answer"] },
  "present.how": { eg: "Pick the one that feels true. Getting through it at all is a win." },
  "present.note": { ask: A("Start with one", [["Next time", "Next time I will "], ["Liked", "I liked "], ["Nerves", "It helped my nerves when "]]) },

  "finalref.complete": { eg: "Be honest: nobody is marking this. Bonnie picked: It's finished, but rushed." },
  "finalref.feel": { look: ["review.rating"] },
  "finalref.answered": { look: ["answer.answer", "intro.dq"] },
  "finalref.changes": { look: ["drafts.change", "review.work"] },
  "finalref.problems": { ask: A("Start with one", [["Tricky", "It was tricky when "], ["Helped", "It helped when "], ["On my own", "Working on my own was "], ["With someone", "Working with someone was "]]),
    look: ["midway.support", "reflect.reflect"] },
  "finalref.suggest": { ask: A("Start with one", [["Could have", "It could have "], ["Add", "Next time add "], ["Less", "Less "]]),
    look: ["drafts.change", "review.work"] },
  "finalref.skills": { ask: A("Tap any that are true", [["Plan", "I can plan a project"], ["Find out", "I can find things out"], ["Ask", "I can ask an expert questions"], ["Draft", "I can make a draft better"], ["Make", "I can make "], ["Present", "I can present my work"]]),
    look: ["skill.skill", "review.skill"] },

  "answer.answer": { eg: "Bonnie: It depends. Going back just to watch is fine. Changing things is a disaster.", look: ["intro.dq", "brain.web", "research.info"] },
  "answer.how": { ask: A("Start with one", [["It shows", "My project shows "], ["When people see it", "When people see it they "], ["The ending", "The ending shows "]]),
    look: ["answer.answer", "intro.work"] },
  "answer.outcomes": { ask: A("Start with one", [["Made", "I made "], ["Learned", "I learned "], ["People found out", "People found out "], ["Changed my mind", "I changed my mind about "]]),
    look: ["finalref.skills", "review.proud"] }
};
var ROUTE = STEPS.filter(function(s){ return s.stage >= 0; });

var STAMPS = ["Stamped!", "Sorted", "In the book", "Nice one", "Done for now", "Bonnie approves", "Smashed it", "Ta-da"];
var COVERS = ["#007291", "#ef7724", "#7b4b8f", "#0a2f38", "#1e9e5a", "#00a6c9", "#f0a80f", "#4f57ad"];
var STICKERS = ["star", "bolt", "clock", "rocket", "paw", "heart", "planet", "skull"];
var INKS = ["#0a2f38", "#007291", "#ef7724", "#7b4b8f", "#1e9e5a", "#e0950b"];
var WIDTHS = [3, 7, 16];
var DRAW_W = 1000, DRAW_H = 625, DRAW_MAX = 40000;

/* ---------- small helpers ---------- */
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
function el(tag, cls, html){ var e = document.createElement(tag); if(cls) e.className = cls; if(html != null) e.innerHTML = html; return e; }
function $(id){ return document.getElementById(id); }
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function now(){ return Date.now(); }
function icon(id, cls){ return '<svg class="' + (cls || "pb-ic") + '" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (I[id] || I.cover) + '"/></svg>'; }
var DAYN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function niceDate(v){
  var d = typeof v === "number" ? new Date(v) : new Date(String(v || "") + (/^\d{4}-\d\d-\d\d$/.test(String(v || "")) ? "T12:00:00" : ""));
  return isNaN(d) ? "" : DAYN[d.getDay()] + " " + d.getDate() + " " + MON[d.getMonth()];
}
function isoDay(d){ d = d || new Date(); return d.getFullYear() + "-" + (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate() < 10 ? "0" : "") + d.getDate(); }
function safeHref(u){ u = String(u || "").trim(); return /^https?:\/\/\S+$/i.test(u) ? u : ""; }
function hasVal(v){
  if(v == null) return false;
  if(Array.isArray(v)) return v.length > 0;
  if(typeof v === "object"){ for(var k in v) if(hasVal(v[k])) return true; return false; }
  return String(v).trim() !== "";
}
function debounce(fn, ms){ var t; return function(){ var a = arguments, me = this; clearTimeout(t); t = setTimeout(function(){ fn.apply(me, a); }, ms); }; }

/* ==========================================================
   Storage: the student's device, or (staff) a copy loaded from
   the sheet that writes straight back to it
   ========================================================== */
var MEM = {};          /* staff: key -> string, for the student being looked at */
var PENDING = {};      /* staff: who -> { key: { v, t } } waiting to go to the sheet */
var QKEY = "b5.pbstaff.q";
function sget(k){
  if(STAFF) return Object.prototype.hasOwnProperty.call(MEM, k) ? MEM[k] : null;
  try{ return localStorage.getItem(k); }catch(e){ return null; }
}
function sset(k, v){
  if(STAFF){ MEM[k] = v; queue(WHO, k, v); return; }
  try{ localStorage.setItem(k, v); }catch(e){}
}
function skeys(pre){
  var out = [];
  if(STAFF){ for(var k in MEM) if(k.indexOf(pre) === 0) out.push(k); return out; }
  try{ for(var i = 0; i < localStorage.length; i++){ var kk = localStorage.key(i); if(kk && kk.indexOf(pre) === 0) out.push(kk); } }catch(e){}
  return out;
}
function sdel(k){
  if(STAFF){ MEM[k] = ""; queue(WHO, k, ""); return; }
  try{ localStorage.removeItem(k); }catch(e){}
}
function rj(k){ try{ var v = JSON.parse(sget(k) || "null"); return v && typeof v === "object" ? v : null; }catch(e){ return null; } }
function wj(k, v){ sset(k, JSON.stringify(v)); }

function kPage(o, step, pg){ return P + "pb." + BOOK + "." + o + "." + step + "." + pg; }
function kDraw(o, step, pg, fid){ return P + "pb." + BOOK + ".d" + o + "." + step + "." + pg + "." + fid; }
function kMeta(){ return P + "pb." + BOOK + ".jm"; }
function kPhoto(o, id){ return P + "pb." + BOOK + ".ph" + o + "." + id; }
function photoSrc(v){ if(!v || !v.ph) return ""; var x = rj(kPhoto(v.o || "s", v.ph)); return x && /^data:image\/jpeg;base64,/.test(String(x.v || "")) ? String(x.v) : ""; }
function photoCount(){ return skeys(P + "pb." + BOOK + ".ph").length; }
function kSup(step, pg){ return "pbsup." + WHO + "." + BOOK + "." + step + "." + pg; }

/* the pen: the student writes as "s"; Jay (staff page, or Jay's pen on a student's device) as "j" */
var PEN = STAFF ? "j" : "s";
try{ if(!STAFF && sessionStorage.getItem("b5.pb.pen") === "j") PEN = "j"; }catch(e){}

function page(o, step, pg){
  var p = rj(kPage(o, step, pg)) || {};
  if(!p.f || typeof p.f !== "object") p.f = {};
  if(!p.c || typeof p.c !== "object") p.c = {};
  if(!p.jay || typeof p.jay !== "object") p.jay = {};
  return p;
}
function newer(a, b){ if(!a) return b ? "b" : null; if(!b) return "a"; return (+b.t || 0) > (+a.t || 0) ? "b" : "a"; }

function getF(step, pg, fid){
  var a = page("s", step, pg).f[fid], b = page("j", step, pg).f[fid], w = newer(a, b);
  if(!w) return { v: null, by: null };
  return w === "a" ? { v: a.v, by: "s" } : { v: b.v, by: "j" };
}
function setF(step, pg, fid, v){
  var k = kPage(PEN, step, pg), p = page(PEN, step, pg), t = now();
  p.f[fid] = { v: v, t: t }; p.t = t; p.tw = t;
  wj(k, p); touched(step);
}
function getC(step, pg, fid){
  var a = page("s", step, pg).c[fid] || {}, b = page("j", step, pg).c[fid] || {}, ids = {}, out = [];
  Object.keys(a).concat(Object.keys(b)).forEach(function(id){ ids[id] = 1; });
  Object.keys(ids).sort().forEach(function(id){
    var w = newer(a[id], b[id]), it = w === "a" ? a[id] : b[id];
    if(!it || it.del) return;
    out.push({ id: id, v: it.v, by: w === "a" ? "s" : "j" });
  });
  return out;
}
function putC(step, pg, fid, id, v, del){
  var k = kPage(PEN, step, pg), p = page(PEN, step, pg), t = now();
  if(!p.c[fid]) p.c[fid] = {};
  p.c[fid][id] = del ? { del: 1, t: t } : { v: v, t: t };
  p.t = t; p.tw = t;
  wj(k, p); touched(step);
}
function getDraw(step, pg, fid){
  var a = rj(kDraw("s", step, pg, fid)), b = rj(kDraw("j", step, pg, fid)), w = newer(a, b);
  if(!w) return { v: "", by: null };
  return w === "a" ? { v: String(a.v || ""), by: "s" } : { v: String(b.v || ""), by: "j" };
}
function setDraw(step, pg, fid, v){
  var t = now();
  wj(kDraw(PEN, step, pg, fid), { v: v, t: t });
  var p = page(PEN, step, pg); p.t = t; p.tw = t; wj(kPage(PEN, step, pg), p);
  touched(step);
}
function getDone(step, pg){
  var a = page("s", step, pg).done, b = page("j", step, pg).done, w = newer(a, b);
  if(!w) return null;
  var d = w === "a" ? a : b;
  return d && d.v ? { t: d.t, by: w === "a" ? "s" : "j", w: d.w || "" } : null;
}
function setDone(step, pg, on, word){
  var k = kPage(PEN, step, pg), p = page(PEN, step, pg), t = now();
  p.done = { v: !!on, t: t, w: word || "" }; p.t = t;
  wj(k, p);
}
function jayBits(step, pg){ return page("j", step, pg).jay; }
function setJay(step, pg, name, v){
  var k = kPage("j", step, pg), p = page("j", step, pg), t = now();
  p.jay[name] = { v: v, t: t }; p.t = t;
  if(name === "sticky") p.tw = t;
  wj(k, p);
}
function meta(){ return rj(kMeta()) || {}; }
function dq(){ var m = meta(); return (m.dq && m.dq.v) || DQ_DEFAULT; }

/* how many pages a step has: the highest page saved by either pen */
function pagesOf(step){
  var n = 1, re = new RegExp("^" + (P + "pb." + BOOK + ".").replace(/[.]/g, "\\.") + "(?:s|j|ds|dj)\\." + step + "\\.(\\d+)");
  skeys(P + "pb." + BOOK + ".").forEach(function(k){ var m = k.match(re); if(m && +m[1] > n) n = +m[1]; });
  return Math.min(n, 9);
}
function pageHasWork(step, pg){
  var st = BY[step];
  return st.cards.some(function(c){
    if(c.t === "sketch") return !!getDraw(step, pg, c.id).v || hasVal(getF(step, pg, c.id + "_link").v) || !!photoSrc(getF(step, pg, c.id + "_ph").v);
    if(c.t === "dq") return hasVal(getF(step, pg, c.id).v);
    if(["list", "qa", "rubric", "links", "log", "cues", "web"].indexOf(c.t) >= 0) return getC(step, pg, c.id).length > 0;
    if(c.t === "stamps") return false;
    return hasVal(getF(step, pg, c.id).v) || (c.note && hasVal(getF(step, pg, c.id + "_n").v));
  });
}
function stepState(step){
  var n = pagesOf(step), stamped = 0, started = false;
  for(var i = 1; i <= n; i++){ if(getDone(step, i)) stamped++; if(pageHasWork(step, i)) started = true; }
  return { pages: n, stamped: stamped, started: started || stamped > 0, done: stamped > 0 };
}
function stampedList(){ return ROUTE.filter(function(s){ return stepState(s.id).done; }).map(function(s){ return s.id; }); }
function nextStep(){
  for(var i = 0; i < ROUTE.length; i++){
    var s = ROUTE[i], st = stepState(s.id);
    if(st.done) continue;
    if(s.optional && !st.started) continue;
    return s;
  }
  return null;
}

/* Jay's notes the student has not opened yet */
function seenMap(){ return rj(P + "pb.seen") || {}; }
function jayNew(step){
  if(STAFF) return false;
  var seen = seenMap(), n = pagesOf(step);
  for(var i = 1; i <= n; i++){
    var tw = +page("j", step, i).tw || 0;
    if(tw && tw > (+seen[BOOK + "." + step + "." + i] || 0)) return true;
  }
  return false;
}
function markSeen(step){
  if(STAFF || PEN === "j") return;
  var seen = seenMap(), n = pagesOf(step), ch = false;
  for(var i = 1; i <= n; i++){
    var tw = +page("j", step, i).tw || 0, key = BOOK + "." + step + "." + i;
    if(tw && tw > (+seen[key] || 0)){ seen[key] = tw; ch = true; }
  }
  if(ch) wj(P + "pb.seen", seen);
}

/* the front door line in the HQ reads this (only rewritten when it changes) */
function writeSummary(){
  if(STAFF) return;
  var nx = nextStep(), list = stampedList();
  var sum = { book: BOOK, next: nx ? nx.n : "", nextId: nx ? nx.id : "", stamped: list.length, of: ROUTE.length };
  var s = JSON.stringify(sum);
  if(sget(P + "pb.now") !== s) sset(P + "pb.now", s);
}
var sessionSteps = {};
function touched(step){
  sessionSteps[step] = 1; flashSaved();
  if(!STAFF && view.at === "step" && !view.all){
    var sk = $("pbSkip"); if(sk) sk.remove();
    var dot = document.querySelector('.pb-dots button[data-go="' + view.idx + '"]'); if(dot) dot.classList.add("has");
  }
}

/* ---------- staff: send what Jay writes to the sheet ---------- */
function loadQ(){ try{ var q = JSON.parse(localStorage.getItem(QKEY) || "null"); return q && typeof q === "object" ? q : {}; }catch(e){ return {}; } }
function saveQ(){ try{ localStorage.setItem(QKEY, JSON.stringify(PENDING)); }catch(e){} }
if(STAFF) PENDING = loadQ();
function queue(who, k, v){
  if(!who) return;
  if(!PENDING[who]) PENDING[who] = {};
  PENDING[who][k] = { v: v, t: now() };
  saveQ(); pushSoon();
}
var pushT = null, pushing = false;
function pushSoon(){ clearTimeout(pushT); pushT = setTimeout(push, 1200); staffStatus("Saving..."); }
function push(){
  if(pushing){ pushSoon(); return; }
  var whos = Object.keys(PENDING).filter(function(w){ return Object.keys(PENDING[w] || {}).length; });
  if(!whos.length){ staffStatus("Saved to " + (WHO || "the") + "'s book"); return; }
  if(!S.call){ staffStatus("Kept on this laptop: the shared memory is not switched on here.", true); return; }
  pushing = true;
  var who = whos[0], items = PENDING[who], sent = {};
  Object.keys(items).forEach(function(k){ sent[k] = items[k].t; });
  S.call("save", { who: who, items: items }).then(function(o){
    pushing = false;
    if(!o || !o.ok) throw new Error((o && o.error) || "not saved");
    Object.keys(sent).forEach(function(k){ if(PENDING[who][k] && PENDING[who][k].t === sent[k]) delete PENDING[who][k]; });
    saveQ();
    if(Object.keys(PENDING).some(function(w){ return Object.keys(PENDING[w] || {}).length; })) push();
    else staffStatus("Saved. " + who + " sees it next time their book opens.");
  }).catch(function(){
    pushing = false;
    staffStatus("Kept on this laptop for now. It goes to the sheet as soon as it can be reached.", true);
    clearTimeout(pushT); pushT = setTimeout(push, 30000);
  });
}
var statusEl = null;
function staffStatus(t, warn){ if(statusEl){ statusEl.textContent = t; statusEl.classList.toggle("warn", !!warn); } }

/* ==========================================================
   Styles
   ========================================================== */
var CSS =
":root{--pbink:#0a2f38;--pbpaper:#fffdf8;--pbteal:#007291;--pborange:#ef7724;--pbjay:#00708f}" +
".pb{max-width:1180px;margin:0 auto;padding:18px 16px 110px;color:var(--pbink);font-family:'Atkinson Hyperlegible',Verdana,sans-serif;position:relative;z-index:1}" +
".pb button{font:inherit;color:inherit;cursor:pointer}" +
".pb h1,.pb h2,.pb h3{font-family:Archivo,'Arial Black',sans-serif;margin:0;line-height:1.08}" +
".pb-btn{display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:14px 12px 15px 11px;border:3px solid var(--pbink);background:var(--pbpaper);font-weight:700;box-shadow:3px 4px 0 var(--pbink);transition:transform .12s,box-shadow .12s;text-decoration:none;color:var(--pbink)}" +
".pb-btn:hover{transform:translate(-1px,-2px);box-shadow:4px 6px 0 var(--pbink)}" +
".pb-btn:active{transform:translate(2px,3px);box-shadow:1px 1px 0 var(--pbink)}" +
".pb-btn.main{background:var(--pborange);color:#fff;font-family:Archivo,sans-serif;font-size:1.15rem;padding:14px 22px}" +
".pb-btn.teal{background:var(--pbteal);color:#fff}" +
".pb-btn.quiet{border-width:2px;box-shadow:none;background:transparent}" +
".pb-btn.small{padding:7px 12px;font-size:.92rem;border-width:2px;box-shadow:2px 3px 0 var(--pbink)}" +
".pb-btn svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}" +
".pb-ic{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:2.1;stroke-linecap:round;stroke-linejoin:round}" +
/* ---- the map view ---- */
".pb-top{display:grid;grid-template-columns:auto 1fr;gap:26px;align-items:center;margin:4px 0 8px}" +
"@media (max-width:640px){.pb-top{grid-template-columns:1fr;gap:14px}.pb-top .pb-cover{width:130px}}" +
".pb-kick{display:inline-block;font-family:Archivo,sans-serif;font-weight:800;font-size:.74rem;letter-spacing:.16em;text-transform:uppercase;background:var(--pbink);color:#fff;border-radius:999px;padding:5px 12px;margin-bottom:10px}" +
".pb-top h1{font-size:clamp(2rem,5.4vw,3.4rem)}" +
".pb-dq{display:inline-block;margin:12px 0 6px;font-family:Archivo,sans-serif;font-weight:700;font-size:clamp(1.05rem,2.4vw,1.35rem);background:#fff;border:3px solid var(--pbink);border-radius:18px 18px 18px 4px;padding:10px 16px;box-shadow:3px 4px 0 rgba(10,47,56,.2);position:relative}" +
".pb-count{display:flex;align-items:center;gap:12px;margin:12px 0 16px;font-weight:700}" +
".pb-bar{flex:1;max-width:320px;height:14px;border-radius:99px;background:#eadfcd;border:2px solid var(--pbink);overflow:hidden}" +
".pb-bar i{display:block;height:100%;background:repeating-linear-gradient(45deg,var(--pborange) 0 10px,#f59a52 10px 20px);border-radius:99px;transition:width .9s cubic-bezier(.2,.9,.3,1.2)}" +
".pb-small{font-size:.95rem;opacity:.75;margin:10px 0 0}" +
/* the cover */
".pb-cover{width:190px;aspect-ratio:3/4;border:0;padding:0;background:none;perspective:700px;display:block}" +
".pb-cover .bk{position:relative;width:100%;height:100%;border-radius:6px 16px 16px 6px;background:var(--cv,#007291);box-shadow:inset 10px 0 0 rgba(0,0,0,.18),6px 8px 0 var(--pbink);border:3px solid var(--pbink);transform:rotateY(-14deg) rotate(-3deg);transition:transform .35s;overflow:hidden;color:#fff;text-align:left;display:flex;flex-direction:column;padding:16px 14px 14px 22px;box-sizing:border-box}" +
".pb-cover:hover .bk{transform:rotateY(-4deg) rotate(-1deg) translateY(-4px)}" +
".pb-cover .bk b{font-family:Archivo,sans-serif;font-size:1.25rem;line-height:1.05;word-break:break-word}" +
".pb-cover .bk small{display:block;font-size:.72rem;opacity:.85;margin-top:6px;letter-spacing:.06em;text-transform:uppercase;font-weight:700}" +
".pb-cover .bk .ini{margin-top:auto;font-family:Archivo,sans-serif;font-size:2.2rem;font-weight:900;opacity:.9}" +
".pb-cover .bk .stk{position:absolute;width:46px;height:46px}" +
".pb-cover .bk .tape{position:absolute;right:-8px;top:18px;width:58px;height:18px;background:rgba(255,255,255,.55);transform:rotate(28deg)}" +
".pb-cover .edit{display:block;text-align:center;font-size:.85rem;font-weight:700;margin-top:12px;opacity:.75}" +
/* news */
".pb-news{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:14px 0 4px;padding:12px 16px;border-radius:16px;border:3px dashed var(--pbjay);background:#e6f4f7}" +
".pb-news b{font-family:Archivo,sans-serif}" +
".pb-news .pb-btn{padding:6px 12px;font-size:.9rem}" +
/* the map */
".pb-map{position:relative;margin:10px 0 0;border-radius:26px 20px 24px 18px;background:#fbf5ea;border:3px solid var(--pbink);box-shadow:5px 6px 0 rgba(10,47,56,.16);overflow:hidden}" +
".pb-map svg{display:block;width:100%;height:auto}" +
".pb-map .stop{cursor:pointer;outline:none}" +
".pb-map .stop .face{transition:transform .2s}" +
".pb-map .stop:hover .face,.pb-map .stop:focus-visible .face{transform:scale(1.12)}" +
".pb-map .stop:focus-visible .ring{stroke:var(--pborange);stroke-width:5}" +
".pb-map .lbl{font:700 13px 'Atkinson Hyperlegible',sans-serif;fill:#0a2f38}" +
".pb-map .sign{font:800 11px Archivo,sans-serif;letter-spacing:.08em;text-transform:uppercase;fill:#fff}" +
".pb-map .opt{font:700 10px 'Atkinson Hyperlegible',sans-serif;fill:#0a2f38;opacity:.6}" +
".pb-map .road{fill:none;stroke:#eadfcd;stroke-width:24;stroke-linecap:round;stroke-linejoin:round}" +
".pb-map .dash{fill:none;stroke:#fffdf8;stroke-width:3;stroke-dasharray:2 14;stroke-linecap:round}" +
".pb-map .trail{fill:none;stroke-width:10;stroke-linecap:round}" +
".pb-map .pulse{fill:none;stroke:var(--pborange);stroke-width:4;transform-box:fill-box;transform-origin:center}" +
".pb-map .pod{transition:transform 1.1s cubic-bezier(.5,-.3,.3,1.3)}" +
".pb-map .pod .bob{animation:pbbob 2.4s ease-in-out infinite}" +
".pb-map .draw{stroke-dasharray:var(--len);stroke-dashoffset:var(--len);animation:pbdraw 1.6s ease-out forwards}" +
".pb-map .pop{transform-box:fill-box;transform-origin:center;animation:pbpop .5s cubic-bezier(.3,1.6,.5,1) both}" +
"@keyframes pbbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}" +
"@keyframes pbdraw{to{stroke-dashoffset:0}}" +
"@keyframes pbpop{from{transform:scale(0)}to{transform:scale(1)}}" +
"@keyframes pbpulse{0%{transform:scale(.9);opacity:.9}100%{transform:scale(1.5);opacity:0}}" +
".pb-map .pulse{animation:pbpulse 1.8s ease-out infinite}" +
".pb-foot{display:flex;flex-wrap:wrap;gap:12px;margin:18px 0 0;align-items:flex-start}" +
".pb-foot .sendbox{flex:1;min-width:260px}" +
/* ---- a step ---- */
".pb-step{--sc:#007291}" +
".pb-head{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:0 0 14px}" +
".pb-head .pb-sticon{width:62px;height:62px;border-radius:20px 16px 22px 14px;background:var(--sc);color:#fff;display:flex;align-items:center;justify-content:center;border:3px solid var(--pbink);box-shadow:3px 4px 0 var(--pbink);transform:rotate(-4deg);flex:none}" +
".pb-head .pb-sticon .pb-ic{width:36px;height:36px}" +
".pb-head .tt{flex:1;min-width:200px}" +
".pb-head .tt span{display:block;font-family:Archivo,sans-serif;font-weight:800;font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;color:var(--sc);margin-bottom:4px}" +
".pb-head h1{font-size:clamp(1.6rem,4.4vw,2.6rem)}" +
".pb-saved{font-weight:700;font-size:.9rem;color:#1e7a4a;opacity:0;transition:opacity .3s}" +
".pb-saved.on{opacity:1}" +
".pb-pages{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:-4px 0 12px}" +
".pb-pages button{border:2px solid var(--pbink);background:#fff;border-radius:10px;padding:5px 11px;font-weight:700}" +
".pb-pages button[aria-pressed=true]{background:var(--sc);color:#fff}" +
".pb-sticky{position:relative;max-width:520px;margin:4px 0 16px;padding:14px 16px 14px 18px;background:#fff1a8;border:2px solid #d8c25a;box-shadow:3px 5px 0 rgba(10,47,56,.18);transform:rotate(-1.2deg);font-size:1.05rem;line-height:1.45;font-family:'Comic Sans MS','Chalkboard SE','Atkinson Hyperlegible',sans-serif}" +
".pb-sticky b{display:block;font-family:Archivo,sans-serif;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;margin-bottom:4px;color:var(--pbjay)}" +
".pb-sticky::before{content:'';position:absolute;top:-10px;left:40%;width:70px;height:20px;background:rgba(255,255,255,.6);transform:rotate(-4deg)}" +
"@media (prefers-reduced-motion:no-preference){.pb-sticky.new{animation:pbwig 1s ease-in-out 2}}" +
"@keyframes pbwig{0%,100%{transform:rotate(-1.2deg)}25%{transform:rotate(1.5deg)}75%{transform:rotate(-3deg)}}" +
".pb-deck{position:relative;min-height:330px}" +
".pb-card{position:relative;background:#fff;border:3px solid var(--pbink);border-radius:26px 20px 24px 18px;box-shadow:6px 7px 0 var(--sc);padding:22px 22px 20px;overflow:visible}" +
".pb-card.in-r{animation:pbinr .38s cubic-bezier(.2,.9,.3,1.1) both}.pb-card.in-l{animation:pbinl .38s cubic-bezier(.2,.9,.3,1.1) both}" +
"@keyframes pbinr{from{opacity:0;transform:translateX(60px) rotate(2deg)}}@keyframes pbinl{from{opacity:0;transform:translateX(-60px) rotate(-2deg)}}" +
".pb-card .cq{display:flex;gap:10px;align-items:flex-start}" +
".pb-card h2{font-size:clamp(1.35rem,3.4vw,1.9rem);flex:1}" +
".pb-card .hint{margin:6px 0 0;opacity:.75;font-size:1rem}" +
".pb-card .lab{display:inline-block;font-size:.72rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;font-family:Archivo,sans-serif;opacity:.55;margin-bottom:6px}" +
".pb-card .body{margin-top:16px}" +
".pb-say{flex:none;width:44px;height:44px;border-radius:50%;border:2px solid var(--pbink);background:#ffe9a8;display:flex;align-items:center;justify-content:center}" +
".pb-say svg{width:22px;height:22px;fill:none;stroke:var(--pbink);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}" +
".pb-in,.pb-ta{width:100%;box-sizing:border-box;font:inherit;font-size:1.15rem;padding:13px 15px;border:3px solid var(--pbink);border-radius:14px;background:#fffdf8;color:var(--pbink)}" +
".pb-ta{min-height:120px;resize:vertical;line-height:1.5}" +
".pb-in:focus,.pb-ta:focus{outline:none;border-color:var(--pborange);box-shadow:0 0 0 4px rgba(239,119,36,.25)}" +
".pb-in.jay,.pb-ta.jay{color:var(--pbjay);border-style:dashed;font-family:'Comic Sans MS','Chalkboard SE','Atkinson Hyperlegible',sans-serif}" +
".pb-jaytag{display:inline-flex;align-items:center;gap:4px;font-size:.78rem;font-weight:800;color:#fff;background:var(--pbjay);border-radius:99px;padding:2px 8px;margin-left:6px;vertical-align:middle;font-family:Archivo,sans-serif;letter-spacing:.04em}" +
".pb-chips{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 0}" +
".pb-chips button{border:2px solid var(--pbink);background:#fff;border-radius:999px;padding:8px 14px;font-weight:700;transition:transform .15s,background .15s}" +
".pb-chips button:hover{transform:translateY(-2px) rotate(-1deg);background:#fff3e2}" +
".pb-chips .lbl{align-self:center;font-size:.85rem;font-weight:700;opacity:.6;margin-right:2px}" +
".pb-nav{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:18px 0 0}" +
".pb-dots{display:flex;gap:7px;margin-right:auto;flex-wrap:wrap}" +
".pb-dots button{width:16px;height:16px;border-radius:50%;border:2px solid var(--pbink);background:#fff;padding:0}" +
".pb-dots button.on{background:var(--sc);transform:scale(1.25)}" +
".pb-dots button.has{background:#cfe9ef}" +
".pb-keys{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:20px 0 0;font-size:.85rem}" +
".pb-keys i{width:14px;height:14px;border-radius:50%;border:1.5px solid var(--pbink);display:inline-block;opacity:.18}" +
".pb-keys i.on{opacity:1}" +
".pb-keys span{margin-left:6px;opacity:.75}" +
/* list items */
".pb-items{list-style:none;margin:0 0 12px;padding:0;display:flex;flex-direction:column;gap:8px}" +
".pb-items li{display:flex;gap:8px;align-items:center;background:#f4efe6;border-radius:14px;padding:8px 8px 8px 14px;animation:pbpop .35s cubic-bezier(.3,1.6,.5,1) both;transform-origin:left center}" +
".pb-items li.jay{background:#e3f1f4;color:var(--pbjay)}" +
".pb-items li .tx{flex:1;font-size:1.05rem}" +
".pb-items li input,.pb-items li textarea{flex:1;font:inherit;border:2px solid transparent;background:transparent;border-radius:10px;padding:6px 8px;color:inherit;min-width:0}" +
".pb-items li input:focus,.pb-items li textarea:focus{border-color:var(--pborange);background:#fff;outline:none}" +
".pb-x{flex:none;width:34px;height:34px;border-radius:50%;border:2px solid rgba(10,47,56,.35);background:#fff;font-weight:900;line-height:1}" +
".pb-add{display:flex;gap:8px}" +
".pb-add .pb-in{flex:1}" +
".pb-qa{display:grid;grid-template-columns:1fr;gap:6px;width:100%}" +
".pb-qa input{font-weight:700}" +
".pb-rub{display:grid;grid-template-columns:1fr 1.4fr;gap:6px;width:100%}" +
"@media (max-width:560px){.pb-rub{grid-template-columns:1fr}}" +
/* faces, picks, days */
".pb-faces{display:flex;gap:10px;flex-wrap:wrap;justify-content:space-between;max-width:620px}" +
".pb-faces button{flex:1;min-width:84px;border:3px solid transparent;background:none;border-radius:18px;padding:8px 4px;display:flex;flex-direction:column;align-items:center;gap:6px;font-weight:700;transition:transform .2s}" +
".pb-faces button:hover{transform:translateY(-4px) rotate(-3deg)}" +
".pb-faces svg{width:66px;height:66px}" +
".pb-faces button[aria-pressed=true]{border-color:var(--pbink);background:#fff6e8;transform:scale(1.08)}" +
".pb-faces button[aria-pressed=true] svg{animation:pbjump .5s cubic-bezier(.3,1.6,.5,1)}" +
"@keyframes pbjump{0%{transform:translateY(0)}40%{transform:translateY(-14px) scale(1.1)}100%{transform:translateY(0)}}" +
".pb-picks{display:flex;flex-direction:column;gap:8px;max-width:560px}" +
".pb-picks button{text-align:left;border:3px solid var(--pbink);background:#fff;border-radius:16px;padding:12px 16px;font-weight:700;font-size:1.08rem;transition:transform .15s}" +
".pb-picks button:hover{transform:translateX(4px)}" +
".pb-picks button[aria-pressed=true]{background:var(--sc);color:#fff;box-shadow:3px 4px 0 var(--pbink)}" +
".pb-days{display:flex;gap:10px;flex-wrap:wrap}" +
".pb-days button{width:72px;height:72px;border-radius:50%;border:3px solid var(--pbink);background:#fff;font-family:Archivo,sans-serif;font-weight:800;font-size:1.05rem;transition:transform .2s}" +
".pb-days button[aria-pressed=true]{background:var(--pborange);color:#fff;transform:rotate(-8deg) scale(1.06)}" +
".pb-mini{margin-top:12px}" +
".pb-mini label{display:block;font-weight:700;font-size:.95rem;margin-bottom:6px;opacity:.8}" +
/* brainstorm web */
".pb-web{position:relative;height:clamp(320px,52vw,440px);border:3px dashed rgba(10,47,56,.3);border-radius:20px;background:radial-gradient(circle at 50% 50%,#fff6dd 0,#fffdf8 60%);overflow:hidden;touch-action:none}" +
".pb-web svg.lines{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}" +
".pb-web .bulb{position:absolute;left:50%;top:50%;width:84px;height:84px;margin:-42px 0 0 -42px;border-radius:50%;border:3px solid var(--pbink);background:#ffd23f;display:flex;align-items:center;justify-content:center;box-shadow:0 0 calc(var(--glow,0) * 1px) calc(var(--glow,0) * .5px) rgba(255,194,71,.9);transition:box-shadow .5s;z-index:2;padding:0}" +
".pb-web .bulb svg{width:46px;height:46px;fill:none;stroke:var(--pbink);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}" +
".pb-web .bub{position:absolute;transform:translate(-50%,-50%);max-width:170px;padding:9px 13px;border-radius:18px 16px 20px 14px;border:2.5px solid var(--pbink);background:var(--bc,#fff);font-weight:700;font-size:.98rem;line-height:1.25;cursor:grab;user-select:none;touch-action:none;z-index:3;box-shadow:2px 3px 0 rgba(10,47,56,.25);text-align:center}" +
".pb-web .bub.jay{border-style:dashed;color:var(--pbjay)}" +
".pb-web .bub.new{animation:pbbub .55s cubic-bezier(.3,1.6,.5,1) both}" +
"@keyframes pbbub{from{transform:translate(-50%,-50%) scale(0)}to{transform:translate(-50%,-50%) scale(1)}}" +
"@media (prefers-reduced-motion:no-preference){.pb-web .bub .in{display:block;animation:pbfloat 4s ease-in-out infinite;animation-delay:var(--d,0s)}}" +
"@keyframes pbfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}" +
".pb-web .bub .x{position:absolute;top:-12px;right:-12px;width:26px;height:26px;border-radius:50%;border:2px solid var(--pbink);background:#fff;font-weight:900;font-size:.8rem;display:none;padding:0}" +
".pb-web .bub.sel .x{display:block}" +
".pb-web .bub.drag{cursor:grabbing;z-index:5;transform:translate(-50%,-50%) scale(1.08) rotate(-2deg)}" +
/* sketch */
".pb-sk{position:relative}" +
".pb-sk canvas{display:block;width:100%;border:3px solid var(--pbink);border-radius:16px;background-color:#fffdf8;touch-action:none;cursor:crosshair}" +
".pb-sk canvas.grid{background-image:linear-gradient(rgba(0,114,145,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(0,114,145,.16) 1px,transparent 1px);background-size:20px 20px}" +
".pb-tools{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 10px}" +
".pb-tools .ink{width:34px;height:34px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px var(--pbink);padding:0}" +
".pb-tools .ink[aria-pressed=true]{transform:scale(1.18);box-shadow:0 0 0 3px var(--pborange)}" +
".pb-tools .tb{border:2px solid var(--pbink);background:#fff;border-radius:10px;padding:6px 11px;font-weight:700;font-size:.9rem}" +
".pb-tools .tb[aria-pressed=true]{background:var(--pbink);color:#fff}" +
".pb-tools .sep{width:1px;height:28px;background:rgba(10,47,56,.2)}" +
/* links, polaroids, log, cues */
".pb-links{display:flex;flex-direction:column;gap:6px;margin:0 0 12px}" +
".pb-links a{font-weight:700;color:var(--pbteal)}" +
".pb-pols{display:flex;flex-wrap:wrap;gap:18px;margin:6px 0 16px}" +
".pb-pol{position:relative;width:170px;background:#fff;padding:10px 10px 12px;border:1px solid #d6c9b6;box-shadow:3px 5px 10px rgba(10,47,56,.2);transform:rotate(var(--r,-3deg));transition:transform .25s;animation:pbpop .45s cubic-bezier(.3,1.6,.5,1) both}" +
".pb-pol:hover{transform:rotate(0) scale(1.05);z-index:2}" +
".pb-pol .ph{height:118px;border-radius:2px;background:linear-gradient(135deg,var(--pc,#cfe9ef),#fff6dd);display:flex;align-items:center;justify-content:center}" +
".pb-pol .ph svg{width:46px;height:46px;fill:none;stroke:var(--pbink);stroke-width:2;opacity:.6}" +
".pb-pol .cap{display:block;margin-top:8px;font-family:'Comic Sans MS','Chalkboard SE',sans-serif;font-size:.95rem;text-align:center}" +
".pb-pol .pb-x{position:absolute;top:-12px;right:-12px}" +
".pb-linkadd{display:grid;grid-template-columns:1fr 1.3fr auto;gap:8px}" +
"@media (max-width:640px){.pb-linkadd{grid-template-columns:1fr}}" +
".pb-log{list-style:none;padding:0;margin:0 0 14px;border-left:4px solid var(--sc);margin-left:8px}" +
".pb-log li{position:relative;padding:4px 0 14px 20px}" +
".pb-log li::before{content:'';position:absolute;left:-11px;top:8px;width:14px;height:14px;border-radius:50%;background:#fff;border:3px solid var(--sc)}" +
".pb-log li b{font-family:Archivo,sans-serif}" +
".pb-log li .st{display:block;font-size:.88rem;opacity:.7;margin-top:2px}" +
".pb-log li.jay{color:var(--pbjay)}" +
".pb-stamps{display:flex;flex-wrap:wrap;gap:8px}" +
".pb-stamps span{display:inline-flex;align-items:center;gap:6px;border:2px solid var(--pbink);border-radius:999px;padding:5px 12px;background:#fff;font-weight:700;font-size:.92rem}" +
".pb-stamps span i{width:12px;height:12px;border-radius:50%;background:var(--c)}" +
".pb-cuer{position:fixed;inset:0;z-index:2147483000;background:#0a2f38;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center}" +
".pb-cuer .cc{max-width:820px;font-family:Archivo,sans-serif;font-size:clamp(2rem,6vw,4.2rem);line-height:1.1;background:#fffdf8;color:#0a2f38;border-radius:28px 22px 26px 20px;padding:40px 34px;border:4px solid #ef7724;box-shadow:10px 12px 0 #ef7724}" +
".pb-cuer .cc.in{animation:pbinr .35s both}" +
".pb-cuer .row{display:flex;gap:12px;margin-top:28px;flex-wrap:wrap;justify-content:center}" +
".pb-cuer .row .pb-btn{font-size:1.1rem}" +
".pb-cuer .clock{font-family:Archivo,sans-serif;font-size:1.3rem;margin-bottom:18px;opacity:.85}" +
/* the cover editor */
".pb-covered{display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:start}" +
"@media (max-width:640px){.pb-covered{grid-template-columns:1fr}}" +
".pb-swatch{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 16px}" +
".pb-swatch button{width:44px;height:44px;border-radius:12px;border:3px solid var(--pbink)}" +
".pb-swatch button[aria-pressed=true]{transform:scale(1.15) rotate(-6deg);box-shadow:0 0 0 3px var(--pborange)}" +
".pb-stkset{display:flex;flex-wrap:wrap;gap:10px}" +
".pb-stkset button{width:62px;height:62px;border-radius:16px;border:2px solid var(--pbink);background:#fff;padding:6px}" +
".pb-stkset button[aria-pressed=true]{background:#fff1c4;transform:scale(1.08) rotate(4deg);box-shadow:0 0 0 3px var(--pborange)}" +
".pb-stkset svg{width:100%;height:100%}" +
/* stamp moment */
".pb-stampfx{position:fixed;inset:0;z-index:2147482900;pointer-events:none;display:flex;align-items:center;justify-content:center}" +
".pb-stampfx .st{font-family:Archivo,sans-serif;font-weight:900;font-size:clamp(2.4rem,9vw,5.4rem);color:var(--sc,#ef7724);border:8px solid var(--sc,#ef7724);border-radius:18px;padding:8px 26px;text-transform:uppercase;background:rgba(255,253,248,.92);transform:rotate(-12deg);animation:pbstamp .55s cubic-bezier(.2,1.5,.4,1) both;mix-blend-mode:multiply}" +
"@keyframes pbstamp{0%{transform:rotate(-12deg) scale(3);opacity:0}60%{transform:rotate(-12deg) scale(.92);opacity:1}100%{transform:rotate(-12deg) scale(1)}}" +
".pb-stampfx .bit{position:absolute;top:-20px;width:12px;height:18px;border-radius:3px;animation:pbfall 1.6s ease-in forwards}" +
"@keyframes pbfall{to{transform:translateY(110vh) rotate(720deg)}}" +
".pb-shake{animation:pbshake .35s}" +
"@keyframes pbshake{20%{transform:translate(-4px,2px)}40%{transform:translate(4px,-2px)}60%{transform:translate(-2px,1px)}80%{transform:translate(2px,0)}}" +
".pb-stampcard{text-align:center;padding:30px 20px}" +
".pb-stampcard .big{width:150px;height:150px;margin:0 auto 14px;border-radius:50%;border:6px dashed var(--sc);display:flex;align-items:center;justify-content:center;color:var(--sc);transform:rotate(-10deg)}" +
".pb-stampcard .big .pb-ic{width:70px;height:70px}" +
".pb-stampcard .row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:18px}" +
".pb-stamped{display:inline-block;margin-top:8px;font-family:Archivo,sans-serif;font-weight:900;color:var(--sc);border:4px solid var(--sc);border-radius:10px;padding:4px 14px;transform:rotate(-6deg);text-transform:uppercase}" +
/* Jay's pen */
".pb-pen{position:fixed;right:14px;bottom:14px;z-index:2147482400;display:flex;align-items:center;gap:8px;border:2px solid rgba(10,47,56,.4);border-radius:999px;background:#fffdf8;padding:9px;font-weight:700;font-size:.88rem;opacity:.5}" +
".pb-pen:hover{opacity:1}.pb-pen.on{padding:8px 14px 8px 10px;border-color:var(--pbink)}" +
".pb-pen.on{background:var(--pbjay);color:#fff;opacity:1}" +
".pb-pen svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}" +
".pb-penbox{position:fixed;right:14px;bottom:66px;z-index:2147482400;background:#fff;border:3px solid var(--pbink);border-radius:16px;padding:14px;max-width:300px;box-shadow:4px 5px 0 rgba(10,47,56,.25)}" +
".pb-penbox p{margin:0 0 8px;font-size:.95rem}" +
".pb-penbox input{width:100%;box-sizing:border-box;font:inherit;padding:8px 10px;border:2px solid var(--pbink);border-radius:10px;margin-bottom:8px}" +
".pb-penline{position:sticky;top:0;z-index:20;background:var(--pbjay);color:#fff;text-align:center;font-weight:700;padding:6px 10px;border-radius:0 0 12px 12px;margin:-18px 0 12px}" +
/* the whole page (staff, and See it all) */
".pb-all .pb-card{margin:0 0 16px;box-shadow:4px 5px 0 var(--sc)}" +
".pb-all .pb-card h2{font-size:1.2rem}" +
".pb-all .pb-card .lab{opacity:.7}" +
/* Bonnie */
".pb-bonnie{position:fixed;bottom:18px;left:-120px;z-index:2147482500;width:110px;pointer-events:none;animation:pbtrot 5s linear forwards}" +
"@keyframes pbtrot{to{left:110vw}}" +
".pb-bonnie svg{width:110px;height:auto;animation:pbbob .35s ease-in-out infinite}" +
"@media (prefers-reduced-motion:reduce){.pb *,.pb-stampfx *,.pb-bonnie,.pb-bonnie svg{animation:none !important;transition:none !important}.pb-map .draw{stroke-dashoffset:0}}" +
/* help me think */
".pb-helpwrap{margin:16px 0 0}" +
".pb-helpbtn{display:inline-flex;align-items:center;gap:8px;border:2px dashed var(--pbjay);background:#eef8fa;color:var(--pbjay);border-radius:999px;padding:8px 16px 8px 10px;font-weight:700;transition:transform .15s}" +
".pb-helpbtn:hover{transform:translateY(-2px)}" +
".pb-helpbtn svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}" +
".pb-help{margin-top:12px;padding:14px;border-radius:20px 16px 22px 14px;background:#eef8fa;border:2px solid var(--pbjay);animation:pbinr .3s both}" +
".pb-help .tiles{display:flex;flex-wrap:wrap;gap:10px}" +
".pb-help .tiles button{display:flex;flex-direction:column;align-items:center;gap:6px;width:118px;padding:12px 8px;border-radius:16px;border:2px solid var(--pbink);background:#fff;font-weight:700;font-size:.9rem;line-height:1.2;text-align:center;transition:transform .15s}" +
".pb-help .tiles button:hover{transform:translateY(-3px) rotate(-1deg)}" +
".pb-help .tiles button[aria-pressed=true]{background:var(--pbink);color:#fff}" +
".pb-help .tiles svg{width:34px;height:34px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}" +
".pb-help .hc{margin-top:12px}" +
".pb-help .hc:empty{display:none}" +
".pb-help .hq{font-family:Archivo,sans-serif;font-weight:700;font-size:1.15rem;margin:0 0 4px}" +
".pb-help .ok{font-weight:700;color:#1e7a4a;margin:10px 0 0}" +
".pb-eg{display:flex;gap:12px;align-items:flex-start;background:#fff8e6;border:2px solid #e3c98a;border-radius:16px;padding:12px 14px;transform:rotate(-.6deg)}" +
".pb-eg svg{width:56px;height:auto;flex:none}" +
".pb-eg b{display:block;font-family:Archivo,sans-serif;font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:#a0673f;margin-bottom:4px}" +
".pb-eg p{margin:0;font-family:'Comic Sans MS','Chalkboard SE','Atkinson Hyperlegible',sans-serif;font-size:1.05rem}" +
".pb-look{background:#fff;border:2px solid rgba(10,47,56,.25);border-radius:14px;padding:10px 12px;margin:0 0 8px}" +
".pb-look b{display:block;font-size:.85rem;color:var(--pbjay)}" +
".pb-look p{margin:4px 0 6px;white-space:pre-wrap}" +
".pb-helpflag{display:inline-block;margin:8px 0 0;background:#fff1a8;border:2px solid #d8c25a;border-radius:999px;padding:3px 12px;font-weight:700;font-size:.88rem}" +
/* voice typing and photos */
".pb-mic{display:inline-flex;align-items:center;gap:6px;border:2px solid var(--pbink);background:#fff;border-radius:999px;padding:7px 14px 7px 10px;font-weight:700}" +
".pb-mic svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}" +
".pb-mic.on{background:var(--pborange);color:#fff;border-color:var(--pborange)}" +
"@media (prefers-reduced-motion:no-preference){.pb-mic.on{animation:pbmic 1s ease-in-out infinite}}" +
"@keyframes pbmic{50%{box-shadow:0 0 0 8px rgba(239,119,36,.25)}}" +
".pb-micline{font-size:.92rem;opacity:.8;margin:6px 0 0;min-height:1.2em}" +
".pb-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:10px 0 0}" +
".pb-cam{display:inline-flex;align-items:center;gap:8px}" +
".pb-thumb{width:64px;height:48px;object-fit:cover;border-radius:8px;border:2px solid var(--pbink);flex:none}" +
".pb-pol .ph img{width:100%;height:100%;object-fit:cover;border-radius:2px}" +
".pb-photo{display:block;max-width:100%;max-height:300px;border-radius:12px;border:3px solid var(--pbink);margin:8px 0}" +
".pb-week{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:12px 0 0;font-size:.95rem}" +
".pb-week b{font-family:Archivo,sans-serif}" +
".pb-week span{border:2px dashed var(--pborange);border-radius:999px;padding:3px 10px;font-weight:700;background:#fff}" +
".pb-week span.done{border-style:solid;background:#fff3e2}" +
".pb-map .wk{fill:none;stroke:var(--pborange);stroke-width:3;stroke-dasharray:4 6}" +
/* print */
"#pbPrint{display:none}" +
"@media print{" +
  "html body.pb-printing > *:not(#pbPrint){display:none !important}" +
  "body.pb-printing{background:#fff !important}" +
  "body.pb-printing #pbPrint{display:block}" +
"}" +
"#pbPrint{color:#0a2f38;font-family:'Atkinson Hyperlegible',Verdana,sans-serif}" +
"#pbPrint .pp{page-break-after:always;break-after:page;border:3px solid #0a2f38;border-radius:14px;padding:12px 14px 10px;min-height:178mm;box-sizing:border-box;display:flex;flex-direction:column;-webkit-print-color-adjust:exact;print-color-adjust:exact}" +
"#pbPrint .pp:last-child{page-break-after:auto;break-after:auto}" +
"#pbPrint .ph{display:flex;align-items:center;gap:12px;background:var(--sc);color:#fff;margin:-12px -14px 10px;padding:8px 14px;border-radius:11px 11px 0 0}" +
"#pbPrint .ph h2{font-family:Archivo,sans-serif;font-size:20pt;margin:0;flex:1}" +
"#pbPrint .ph small{font-weight:700;font-size:9pt;letter-spacing:.1em;text-transform:uppercase}" +
"#pbPrint .ph .pb-ic{width:30px;height:30px;stroke:#fff}" +
"#pbPrint .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;flex:1;align-content:start}" +
"#pbPrint .bx{border:2px solid #b9c9cc;border-radius:10px;padding:6px 9px;min-height:26mm;break-inside:avoid;font-size:10.5pt;line-height:1.35}" +
"#pbPrint .bx.wide{grid-column:span 2}#pbPrint .bx.full{grid-column:1/-1}" +
"#pbPrint .bx h4{margin:0 0 4px;font-family:Archivo,sans-serif;font-size:8.5pt;letter-spacing:.08em;text-transform:uppercase;color:#007291}" +
"#pbPrint .bx p{margin:0 0 3px;white-space:pre-wrap}" +
"#pbPrint .bx ul{margin:0;padding-left:16px}" +
"#pbPrint .bx .j{color:#00708f;font-style:italic}" +
"#pbPrint .bx svg.sk{display:block;width:auto;max-width:100%;height:auto;max-height:62mm;border:1px solid #e3e3e3;border-radius:6px}" +
"#pbPrint .lines{height:20mm;background:repeating-linear-gradient(transparent 0 6.5mm,#c8d6d9 6.5mm 6.8mm)}" +
"#pbPrint .pf{display:flex;align-items:center;gap:10px;margin-top:8px;font-size:9pt}" +
"#pbPrint .pf i{display:inline-block;width:11px;height:11px;border-radius:50%;border:1px solid #0a2f38;opacity:.2}" +
"#pbPrint .pf i.on{opacity:1}" +
"#pbPrint .pf .sup{margin-left:auto;flex:0 1 46%;background:#ede7df;border-radius:10px;padding:5px 9px;min-height:12mm}" +
"#pbPrint .pf .sup b{display:block;font-size:7.5pt;text-transform:uppercase;letter-spacing:.08em}" +
"#pbPrint .stampmark{font-family:Archivo,sans-serif;font-weight:900;color:#fff;border:3px solid #fff;border-radius:8px;padding:1px 9px;transform:rotate(-6deg);font-size:10pt}" +
"#pbPrint .facesp{display:flex;gap:6px}#pbPrint .facesp span{border:1.5px solid #b9c9cc;border-radius:99px;padding:1px 7px;font-size:8.5pt}#pbPrint .facesp span.on{background:#0a2f38;color:#fff;border-color:#0a2f38}" +
"#pbPrint .coverp{align-items:center;justify-content:center;text-align:center;background:var(--sc);color:#fff}" +
"#pbPrint .coverp h1{font-family:Archivo,sans-serif;font-size:34pt;margin:0 0 10px}" +
"#pbPrint .coverp p{font-size:14pt;margin:4px 0}" +
"#pbPrint .bx img{max-width:100%;max-height:48mm;border-radius:6px;margin:2px 4px 2px 0}" +
/* the booklet (A5) */
"#pbPrint.bk .bp{page-break-after:always;break-after:page;box-sizing:border-box;padding:2mm 1mm;-webkit-print-color-adjust:exact;print-color-adjust:exact}" +
"#pbPrint.bk .bp:last-child{page-break-after:auto;break-after:auto}" +
"#pbPrint.bk .bcov{position:relative;background:var(--cv);color:#fff;border-radius:6mm;padding:18mm 12mm;display:flex;flex-direction:column;justify-content:center;text-align:center;height:178mm;box-sizing:border-box;overflow:hidden}" +
"#pbPrint.bk .bcov h1{font-family:Archivo,sans-serif;font-size:30pt;line-height:1.05;margin:0 0 8mm}" +
"#pbPrint.bk .bcov p{font-size:13pt;margin:2mm 0}" +
"#pbPrint.bk .bcov .stk{position:absolute;width:30mm;height:30mm}" +
"#pbPrint.bk .bcov .by{font-family:Archivo,sans-serif;font-size:22pt;margin-top:10mm}" +
"#pbPrint.bk .band{display:flex;align-items:center;gap:3mm;border-bottom:1.2mm solid var(--sc);padding-bottom:2mm;margin-bottom:4mm}" +
"#pbPrint.bk .band .pb-ic{width:10mm;height:10mm;stroke:var(--sc)}" +
"#pbPrint.bk .band h2{font-family:Archivo,sans-serif;font-size:17pt;margin:0;flex:1}" +
"#pbPrint.bk .band small{font-size:8pt;text-transform:uppercase;letter-spacing:.1em;color:var(--sc);font-weight:700}" +
"#pbPrint.bk .it{margin:0 0 4mm;break-inside:avoid}" +
"#pbPrint.bk .it h4{margin:0 0 1mm;font-family:Archivo,sans-serif;font-size:8.5pt;letter-spacing:.08em;text-transform:uppercase;color:#007291}" +
"#pbPrint.bk .it p{margin:0 0 1mm;font-size:11pt;line-height:1.4;white-space:pre-wrap}" +
"#pbPrint.bk .it ul{margin:0;padding-left:5mm;font-size:11pt}" +
"#pbPrint.bk .it .j{font-style:italic}" +
"#pbPrint.bk .it img{max-width:100%;max-height:70mm;border-radius:3mm;margin:1mm 2mm 1mm 0}" +
"#pbPrint.bk .it svg.sk{width:100%;height:auto;max-height:70mm;border-radius:3mm;border:1px solid #ddd}" +
"#pbPrint.bk .quote{font-family:Archivo,sans-serif;font-size:24pt;line-height:1.15;margin:10mm 0 6mm;color:#0a2f38}" +
"#pbPrint.bk .stampsgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm;margin-top:6mm}" +
"#pbPrint.bk .stampsgrid div{text-align:center;font-size:7.5pt;font-weight:700;line-height:1.2}" +
"#pbPrint.bk .stampsgrid i{display:flex;align-items:center;justify-content:center;width:14mm;height:14mm;margin:0 auto 1mm;border-radius:50%;border:.8mm solid var(--c)}" +
"#pbPrint.bk .stampsgrid i.on{background:var(--c)}" +
"#pbPrint.bk .stampsgrid i .pb-ic{width:7mm;height:7mm;stroke:var(--c)}#pbPrint.bk .stampsgrid i.on .pb-ic{stroke:#fff}";

/* ==========================================================
   Pictures drawn in code
   ========================================================== */
function faceSvg(i){
  var fills = ["#4a3b38", "#d9eef2", "#eceae6", "#1f6f87", "#ef7724"], fill = fills[i], ink = i === 0 || i === 3 ? "#fffdf8" : "#0a2f38";
  var mouths = ["M22 46q10-10 20 0", "M23 44q9-5 18 0", "M23 42h18", "M22 39q10 9 20 0", "M20 37q12 16 24 0z"];
  return '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="' + fill + '" stroke="#0a2f38" stroke-width="3"/>' +
    '<circle cx="24" cy="27" r="3.4" fill="' + ink + '"/><circle cx="40" cy="27" r="3.4" fill="' + ink + '"/>' +
    (i === 0 ? '<path d="M18 20l9 3M46 20l-9 3" stroke="' + ink + '" stroke-width="2.6" stroke-linecap="round"/>' : '') +
    '<path d="' + mouths[i] + '" fill="' + (i === 4 ? "#fffdf8" : "none") + '" stroke="' + ink + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
function stickerSvg(n){
  var K = "#0a2f38";
  var a = {
    star: '<path d="M32 6l7.6 15.6 17.2 2.5-12.4 12.1 2.9 17.1L32 45.2l-15.3 8.1 2.9-17.1L7.2 24.1l17.2-2.5z" fill="#ffc247" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/>',
    bolt: '<path d="M36 4L12 36h16l-4 24 26-34H34z" fill="#ffd23f" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/>',
    clock: '<circle cx="32" cy="32" r="25" fill="#fffdf8" stroke="' + K + '" stroke-width="3.5"/><path d="M32 16v16l11 7" fill="none" stroke="#ef7724" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
    rocket: '<path d="M32 4c10 8 14 20 12 34H20C18 24 22 12 32 4z" fill="#fffdf8" stroke="' + K + '" stroke-width="3"/><circle cx="32" cy="24" r="6" fill="#00a6c9" stroke="' + K + '" stroke-width="2.5"/><path d="M20 38l-8 10 10-2M44 38l8 10-10-2M26 46c2 8 10 8 12 0" fill="#ef7724" stroke="' + K + '" stroke-width="2.5" stroke-linejoin="round"/>',
    paw: '<ellipse cx="32" cy="42" rx="13" ry="11" fill="#a0673f" stroke="' + K + '" stroke-width="3"/><circle cx="16" cy="28" r="6" fill="#a0673f" stroke="' + K + '" stroke-width="2.5"/><circle cx="26" cy="18" r="6" fill="#a0673f" stroke="' + K + '" stroke-width="2.5"/><circle cx="38" cy="18" r="6" fill="#a0673f" stroke="' + K + '" stroke-width="2.5"/><circle cx="48" cy="28" r="6" fill="#a0673f" stroke="' + K + '" stroke-width="2.5"/>',
    heart: '<path d="M32 54S8 40 8 23a12 12 0 0 1 24-4 12 12 0 0 1 24 4c0 17-24 31-24 31z" fill="#ef7724" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/>',
    planet: '<circle cx="32" cy="32" r="16" fill="#7b4b8f" stroke="' + K + '" stroke-width="3"/><ellipse cx="32" cy="34" rx="28" ry="8" fill="none" stroke="#ffc247" stroke-width="4" transform="rotate(-18 32 34)"/>',
    skull: '<path d="M32 6c-13 0-22 9-22 21 0 7 3 12 8 15v8h28v-8c5-3 8-8 8-15 0-12-9-21-22-21z" fill="#fffdf8" stroke="' + K + '" stroke-width="3"/><circle cx="23" cy="29" r="5" fill="' + K + '"/><circle cx="41" cy="29" r="5" fill="' + K + '"/><path d="M28 50v-5M36 50v-5" stroke="' + K + '" stroke-width="3"/>'
  };
  return '<svg viewBox="0 0 64 64" aria-hidden="true">' + (a[n] || a.star) + '</svg>';
}
var POD = '<g class="bob"><path d="M-17 14h34" stroke="#0a2f38" stroke-width="3" stroke-linecap="round"/>' +
  '<rect x="-15" y="-8" width="30" height="22" rx="11" fill="#ffc247" stroke="#0a2f38" stroke-width="3"/>' +
  '<circle cx="0" cy="3" r="5.5" fill="#fffdf8" stroke="#0a2f38" stroke-width="2.5"/><path d="M0 0v3l2 1.5" stroke="#ef7724" stroke-width="2" stroke-linecap="round" fill="none"/>' +
  '<path d="M-20 20l3-4M20 20l-3-4" stroke="#ef7724" stroke-width="2.5" stroke-linecap="round"/></g>';
var BONNIE = '<svg viewBox="0 0 120 90" aria-hidden="true"><g fill="#a0673f" stroke="#0a2f38" stroke-width="3">' +
  '<circle cx="40" cy="52" r="16"/><circle cx="58" cy="50" r="17"/><circle cx="76" cy="52" r="15"/>' +
  '<path d="M44 64v18M54 66v16M70 64v18M80 62v18" stroke-linecap="round" fill="none" stroke-width="6"/>' +
  '<circle cx="94" cy="36" r="15"/><circle cx="102" cy="22" r="7"/><circle cx="88" cy="22" r="7"/><circle cx="24" cy="44" r="7"/></g>' +
  '<circle cx="99" cy="35" r="2.6" fill="#0a2f38"/><circle cx="91" cy="35" r="2.6" fill="#0a2f38"/><ellipse cx="106" cy="41" rx="4" ry="3" fill="#0a2f38"/></svg>';
var SAY = '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
var PEN_SVG = '<svg viewBox="0 0 24 24"><path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/></svg>';
var BACK = '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>';
var NEXT = '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>';
var BULB = '<svg viewBox="0 0 24 24"><path d="' + I.brain + '"/></svg>';
var MIC = '<svg viewBox="0 0 24 24"><path d="M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4"/></svg>';
var CAM = '<svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
var HICON = {
  ask: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/></svg>',
  eg: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="15" rx="5" ry="4"/><circle cx="6" cy="9.5" r="2"/><circle cx="10" cy="6" r="2"/><circle cx="14" cy="6" r="2"/><circle cx="18" cy="9.5" r="2"/></svg>',
  look: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>',
  where: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
  jay: '<svg viewBox="0 0 24 24"><path d="M7 11V6a1.5 1.5 0 0 1 3 0v4M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V11M16 11V8a1.5 1.5 0 0 1 3 0v6a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-2.7L3.5 14a1.6 1.6 0 0 1 2.6-1.8L7 13.5"/></svg>'
};
var BFACE = '<svg viewBox="0 0 64 60" aria-hidden="true"><g fill="#a0673f" stroke="#0a2f38" stroke-width="2.5"><circle cx="14" cy="16" r="9"/><circle cx="50" cy="16" r="9"/><circle cx="32" cy="32" r="20"/><circle cx="32" cy="12" r="9"/></g><circle cx="25" cy="31" r="2.6" fill="#0a2f38"/><circle cx="39" cy="31" r="2.6" fill="#0a2f38"/><ellipse cx="32" cy="40" rx="4.5" ry="3.2" fill="#0a2f38"/></svg>';
var PIC = '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/></svg>';

/* ==========================================================
   The cards (shared by the student, See it all, staff and print)
   ctx: { step, pg }
   ========================================================== */
var savedT = null;
function flashSaved(){
  var s = document.querySelector(".pb-saved"); if(!s) return;
  s.textContent = PEN === "j" ? "Saved in Jay's pen" : "Saved";
  s.classList.add("on"); clearTimeout(savedT); savedT = setTimeout(function(){ s.classList.remove("on"); }, 1400);
}
function jayTag(by){ return by === "j" ? '<span class="pb-jaytag">' + PEN_SVG.replace("<svg", '<svg width="11" height="11" style="fill:none;stroke:#fff;stroke-width:2.6"') + 'Jay</span>' : ""; }

function starters(card, onPick){
  if(!card.st || !card.st.length) return null;
  var w = el("div", "pb-chips");
  w.innerHTML = '<span class="lbl">Tap to use:</span>' + card.st.map(function(s, i){ return '<button type="button" data-i="' + i + '">' + esc(s) + '</button>'; }).join("");
  w.addEventListener("click", function(e){ var b = e.target.closest("button[data-i]"); if(b) onPick(card.st[+b.dataset.i], b); });
  return w;
}
function growTA(ta){ ta.style.height = "auto"; ta.style.height = Math.max(120, ta.scrollHeight + 6) + "px"; }

function fText(card, ctx, long){
  var box = el("div");
  var g = getF(ctx.step, ctx.pg, card.id);
  var inp = long ? el("textarea", "pb-ta") : el("input", "pb-in");
  if(!long){ inp.type = "text"; inp.maxLength = 200; }
  inp.value = g.v || "";
  inp.setAttribute("aria-label", card.label);
  if(g.by === "j") inp.classList.add("jay");
  var save = debounce(function(){ setF(ctx.step, ctx.pg, card.id, inp.value); inp.classList.toggle("jay", PEN === "j"); }, 450);
  inp.addEventListener("input", function(){ save(); if(long) growTA(inp); });
  box.appendChild(inp);
  if(long) setTimeout(function(){ growTA(inp); }, 0);
  function ins(s){
    var cur = inp.value;
    inp.value = long ? cur + (cur && !/\s$/.test(cur) ? (/[.!?]$/.test(cur.trim()) ? " " : "\n") : "") + s + (/\.\.\.$/.test(s) ? " " : "") : (/\s$/.test(s) || !cur ? s : s);
    setF(ctx.step, ctx.pg, card.id, inp.value); inp.classList.toggle("jay", PEN === "j");
    if(long) growTA(inp);
    try{ inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }catch(e){}
  }
  box._insert = ins;
  var mic = micFor(function(t){
    var cur = inp.value;
    inp.value = cur + (cur && !/\s$/.test(cur) ? " " : "") + t;
    setF(ctx.step, ctx.pg, card.id, inp.value); if(long) growTA(inp);
  });
  if(mic) box.appendChild(mic);
  var ch = starters(card, ins);
  if(ch) box.appendChild(ch);
  return box;
}
function fDate(card, ctx){
  var g = getF(ctx.step, ctx.pg, card.id), inp = el("input", "pb-in");
  inp.type = "date"; inp.value = g.v || ""; inp.style.maxWidth = "260px";
  if(g.by === "j") inp.classList.add("jay");
  inp.addEventListener("change", function(){ setF(ctx.step, ctx.pg, card.id, inp.value); });
  var box = el("div"); box.appendChild(inp);
  var t = el("div", "pb-chips", '<button type="button">Today</button>');
  t.querySelector("button").onclick = function(){ inp.value = isoDay(); setF(ctx.step, ctx.pg, card.id, inp.value); };
  box.appendChild(t);
  return box;
}
function noteField(card, ctx){
  if(!card.note) return null;
  var w = el("div", "pb-mini"), id = card.id + "_n", g = getF(ctx.step, ctx.pg, id);
  w.innerHTML = '<label>' + esc(card.note) + ' <small style="opacity:.7">(optional)</small></label>';
  var ta = el("textarea", "pb-ta" + (g.by === "j" ? " jay" : "")); ta.style.minHeight = "80px"; ta.value = g.v || "";
  ta.setAttribute("aria-label", card.note);
  ta.addEventListener("input", debounce(function(){ setF(ctx.step, ctx.pg, id, ta.value); }, 450));
  w.appendChild(ta);
  return w;
}
function fFaces(card, ctx){
  var box = el("div"), g = getF(ctx.step, ctx.pg, card.id);
  var row = el("div", "pb-faces");
  row.innerHTML = FACES.map(function(n, i){ return '<button type="button" data-i="' + i + '" aria-pressed="' + (g.v === i) + '">' + faceSvg(i) + '<span>' + n + '</span></button>'; }).join("");
  row.addEventListener("click", function(e){
    var b = e.target.closest("button[data-i]"); if(!b) return;
    setF(ctx.step, ctx.pg, card.id, +b.dataset.i);
    [].forEach.call(row.children, function(x){ x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
  });
  box.appendChild(row);
  if(g.by === "j" && g.v != null) box.appendChild(el("p", "hint", "Picked with Jay " + jayTag("j")));
  var n = noteField(card, ctx); if(n) box.appendChild(n);
  return box;
}
function fPick(card, ctx){
  var box = el("div"), g = getF(ctx.step, ctx.pg, card.id);
  var row = el("div", "pb-picks");
  row.innerHTML = card.opts.map(function(n, i){ return '<button type="button" data-i="' + i + '" aria-pressed="' + (g.v === n) + '">' + esc(n) + '</button>'; }).join("");
  row.addEventListener("click", function(e){
    var b = e.target.closest("button[data-i]"); if(!b) return;
    setF(ctx.step, ctx.pg, card.id, card.opts[+b.dataset.i]);
    [].forEach.call(row.children, function(x){ x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
  });
  box.appendChild(row);
  var n = noteField(card, ctx); if(n) box.appendChild(n);
  return box;
}
function fDays(card, ctx){
  var g = getF(ctx.step, ctx.pg, card.id), on = Array.isArray(g.v) ? g.v.slice() : [];
  var row = el("div", "pb-days");
  row.innerHTML = ["Mon", "Tue", "Wed", "Thu", "Fri"].map(function(d, i){ return '<button type="button" data-i="' + i + '" aria-pressed="' + (on.indexOf(i) >= 0) + '">' + d + '</button>'; }).join("");
  row.addEventListener("click", function(e){
    var b = e.target.closest("button[data-i]"); if(!b) return;
    var i = +b.dataset.i, at = on.indexOf(i);
    if(at >= 0) on.splice(at, 1); else on.push(i);
    on.sort(); setF(ctx.step, ctx.pg, card.id, on.slice());
    b.setAttribute("aria-pressed", at < 0 ? "true" : "false");
  });
  return row;
}

/* lists of things: plain lines, question and answer, rubric rows, cue cards */
function fList(card, ctx, kind){
  var box = el("div"), ul = el("ul", "pb-items");
  box.appendChild(ul);
  function draw(){
    var items = getC(ctx.step, ctx.pg, card.id);
    ul.innerHTML = "";
    items.forEach(function(it){
      var li = el("li", it.by === "j" ? "jay" : "");
      var v = it.v || {};
      if(kind === "qa"){
        var w = el("div", "pb-qa");
        var q = el("input"); q.value = v.q || ""; q.setAttribute("aria-label", "Question");
        var a = el("textarea"); a.rows = 2; a.value = v.a || ""; a.placeholder = "Answer, when you have it"; a.setAttribute("aria-label", "Answer");
        var sv = debounce(function(){ putC(ctx.step, ctx.pg, card.id, it.id, { q: q.value, a: a.value }); }, 450);
        q.oninput = sv; a.oninput = sv;
        w.appendChild(q); w.appendChild(a); li.appendChild(w);
      } else if(kind === "rubric"){
        var w2 = el("div", "pb-rub");
        var c = el("input"); c.value = v.c || ""; c.setAttribute("aria-label", "Criteria"); c.placeholder = "Criteria";
        var d = el("input"); d.value = v.d || ""; d.setAttribute("aria-label", "What good looks like"); d.placeholder = "What good looks like";
        var sv2 = debounce(function(){ putC(ctx.step, ctx.pg, card.id, it.id, { c: c.value, d: d.value }); }, 450);
        c.oninput = sv2; d.oninput = sv2;
        w2.appendChild(c); w2.appendChild(d); li.appendChild(w2);
      } else {
        var t = el("input"); t.value = typeof v === "string" ? v : (v.x || ""); t.setAttribute("aria-label", card.label);
        t.oninput = debounce(function(){ putC(ctx.step, ctx.pg, card.id, it.id, t.value); }, 450);
        li.appendChild(t);
      }
      if(it.by === "j") li.insertAdjacentHTML("beforeend", jayTag("j"));
      var x = el("button", "pb-x", "&times;"); x.type = "button"; x.setAttribute("aria-label", "Take this one out");
      x.onclick = function(){ putC(ctx.step, ctx.pg, card.id, it.id, null, true); draw(); };
      li.appendChild(x);
      ul.appendChild(li);
    });
    full();
  }
  var add = el("div", "pb-add");
  var inp = el("input", "pb-in"); inp.type = "text"; inp.maxLength = 300;
  inp.placeholder = kind === "qa" ? "Type a question" : kind === "rubric" ? "Something that matters" : kind === "cues" ? "One short line for a card" : "Type one here";
  inp.setAttribute("aria-label", card.label);
  var go = el("button", "pb-btn small teal", "Add"); go.type = "button";
  add.appendChild(inp); add.appendChild(go);
  function addOne(text){
    text = String(text || "").trim(); if(!text) return;
    if(card.max && getC(ctx.step, ctx.pg, card.id).length >= card.max) return;
    var v = kind === "qa" ? { q: text, a: "" } : kind === "rubric" ? { c: text, d: "" } : text;
    putC(ctx.step, ctx.pg, card.id, uid(), v); draw();
  }
  go.onclick = function(){ addOne(inp.value); inp.value = ""; inp.focus(); };
  inp.addEventListener("keydown", function(e){ if(e.key === "Enter"){ e.preventDefault(); go.click(); } });
  box.appendChild(add);
  box._insert = function(t){ if(/\s$/.test(t)){ inp.value = t; try{ inp.focus(); }catch(e){} } else addOne(t); };
  var micL = micFor(function(t){ inp.value = (inp.value ? inp.value + " " : "") + t; try{ inp.focus(); }catch(e){} });
  if(micL) box.appendChild(micL);
  var ch = starters(card, function(s, b){ addOne(s); if(b){ b.style.opacity = ".45"; } });
  if(ch) box.appendChild(ch);
  function full(){ var f = card.max && getC(ctx.step, ctx.pg, card.id).length >= card.max; add.style.display = f ? "none" : ""; if(ch) ch.style.display = f ? "none" : ""; }
  if(kind === "cues"){
    var pr = el("div", "pb-chips"); var pbx = el("button", "pb-btn", "Practise it"); pbx.type = "button";
    pbx.onclick = function(){ cueRunner(getC(ctx.step, ctx.pg, card.id).map(function(i){ return typeof i.v === "string" ? i.v : ""; }).filter(Boolean)); };
    pr.appendChild(pbx); box.appendChild(pr);
  }
  draw();
  return box;
}
function cueRunner(cards){
  if(!cards.length) return;
  var i = 0, t0 = Date.now(), ov = el("div", "pb-cuer");
  ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Practise your presentation");
  ov.innerHTML = '<div class="clock">0:00</div><div class="cc"></div><div class="row"><button type="button" class="pb-btn" data-a="b">Back</button><button type="button" class="pb-btn main" data-a="n">Next card</button><button type="button" class="pb-btn quiet" data-a="x" style="color:#fff;border-color:#fff">Done</button></div>';
  document.body.appendChild(ov);
  var cc = ov.querySelector(".cc"), clk = ov.querySelector(".clock");
  function show(){ cc.classList.remove("in"); void cc.offsetWidth; cc.classList.add("in"); cc.textContent = cards[i]; ov.querySelector('[data-a=n]').textContent = i === cards.length - 1 ? "That's the lot!" : "Next card (" + (i + 2) + " of " + cards.length + ")"; }
  var tick = setInterval(function(){ var s = Math.floor((Date.now() - t0) / 1000); clk.textContent = Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60); }, 500);
  function close(){ clearInterval(tick); ov.remove(); document.removeEventListener("keydown", key); }
  function key(e){ if(e.key === "ArrowRight" || e.key === " ") nav("n"); else if(e.key === "ArrowLeft") nav("b"); else if(e.key === "Escape") close(); }
  function nav(a){ if(a === "x") return close(); if(a === "n"){ if(i >= cards.length - 1){ close(); burst(); return; } i++; } else if(i > 0) i--; show(); }
  ov.addEventListener("click", function(e){ var b = e.target.closest("button[data-a]"); if(b) nav(b.dataset.a); });
  document.addEventListener("keydown", key);
  show();
}
function fLinks(card, ctx){
  var box = el("div"), list = el("div", card.polaroid ? "pb-pols" : "pb-links");
  box.appendChild(list);
  function draw(){
    var items = getC(ctx.step, ctx.pg, card.id);
    list.innerHTML = "";
    items.forEach(function(it, n){
      var v = it.v || {}, u = safeHref(v.url);
      if(card.polaroid){
        var pol = el("div", "pb-pol");
        pol.style.setProperty("--r", ((n % 2 ? 1 : -1) * (2 + (n * 7) % 4)) + "deg");
        pol.style.setProperty("--pc", ["#cfe9ef", "#ffe1c7", "#e6d9ef", "#d8f0df"][n % 4]);
        var src = photoSrc(v);
        pol.innerHTML = '<div class="ph">' + (src ? '<img alt="" src="' + src + '">' : PIC) + '</div><span class="cap">' + esc(v.title || (src ? "" : "Untitled")) + jayTag(it.by) + '</span>' +
          (u ? '<a class="pb-btn small" style="margin-top:8px" href="' + esc(u) + '" target="_blank" rel="noopener">Open</a>' : '');
        var x = el("button", "pb-x", "&times;"); x.type = "button"; x.setAttribute("aria-label", "Take this one out");
        x.onclick = function(){ if(v.ph) sdel(kPhoto(v.o || "s", v.ph)); putC(ctx.step, ctx.pg, card.id, it.id, null, true); draw(); };
        pol.appendChild(x); list.appendChild(pol);
      } else {
        var row = el("div", "pb-items"); row.style.margin = "0";
        var li = el("li", it.by === "j" ? "jay" : "");
        var src2 = photoSrc(v);
        li.innerHTML = (src2 ? '<img class="pb-thumb" alt="" src="' + src2 + '">' : '') + '<span class="tx">' + (u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(v.title || "A link") + '</a>' : esc(v.title || (src2 ? "A photo" : ""))) + jayTag(it.by) + '</span>';
        var x2 = el("button", "pb-x", "&times;"); x2.type = "button"; x2.setAttribute("aria-label", "Take this one out");
        x2.onclick = function(){ if(v.ph) sdel(kPhoto(v.o || "s", v.ph)); putC(ctx.step, ctx.pg, card.id, it.id, null, true); draw(); };
        li.appendChild(x2); row.appendChild(li); list.appendChild(row);
      }
    });
  }
  var add = el("div", "pb-linkadd");
  add.innerHTML = '<input class="pb-in" type="text" maxlength="120" placeholder="' + (card.polaroid ? "Caption" : "What it is") + '" aria-label="What it is">' +
    '<input class="pb-in" type="url" maxlength="600" placeholder="https://drive.google.com/..." aria-label="Link">' +
    '<button type="button" class="pb-btn small teal">Add</button>';
  var ins = add.querySelectorAll("input"), msg = el("p", "hint");
  add.querySelector("button").onclick = function(){
    var t = ins[0].value.trim(), u = safeHref(ins[1].value);
    if(!u && !(card.polaroid && t)){ msg.textContent = "Links start with https://"; ins[1].focus(); return; }
    putC(ctx.step, ctx.pg, card.id, uid(), { title: t || (card.polaroid ? "" : "A link"), url: u });
    ins[0].value = ""; ins[1].value = ""; msg.textContent = ""; draw();
  };
  box.appendChild(add); box.appendChild(msg);
  var cam = photoButton(function(id){
    putC(ctx.step, ctx.pg, card.id, uid(), { title: ins[0].value.trim(), url: "", ph: id, o: PEN });
    ins[0].value = ""; draw();
  }, msg);
  if(cam) box.appendChild(cam);
  draw();
  return box;
}
function fLog(card, ctx){
  var box = el("div"), ul = el("ul", "pb-log");
  function draw(){
    var items = getC(ctx.step, ctx.pg, card.id).slice().reverse();
    ul.innerHTML = items.length ? "" : '<li style="opacity:.6">Nothing logged yet. One line is plenty.</li>';
    items.forEach(function(it){
      var v = it.v || {}, li = el("li", it.by === "j" ? "jay" : "");
      li.innerHTML = '<b>' + esc(niceDate(v.d)) + '</b> ' + esc(v.f || "") + jayTag(it.by) +
        '<span class="st">' + (v.s && v.s.length ? v.s.length + " step" + (v.s.length === 1 ? "" : "s") + " stamped by then: " + esc(v.s.map(function(id){ return BY[id] ? BY[id].n : id; }).join(", ")) : "No stamps yet at this point") + '</span>';
      ul.appendChild(li);
    });
  }
  box.appendChild(ul);
  var add = el("div", "pb-add");
  add.innerHTML = '<input class="pb-in" type="text" maxlength="240" placeholder="What are you focusing on?" aria-label="Intent focus"><button type="button" class="pb-btn small teal">Log it</button>';
  var inp = add.querySelector("input");
  function addOne(t){ t = String(t || "").trim(); if(!t) return; putC(ctx.step, ctx.pg, card.id, uid(), { d: isoDay(), f: t, s: stampedList() }); draw(); }
  add.querySelector("button").onclick = function(){ addOne(inp.value); inp.value = ""; };
  inp.addEventListener("keydown", function(e){ if(e.key === "Enter"){ e.preventDefault(); addOne(inp.value); inp.value = ""; } });
  box.appendChild(add);
  box._insert = function(t){ inp.value = t; try{ inp.focus(); }catch(e){} };
  var micG = micFor(function(t){ inp.value = (inp.value ? inp.value + " " : "") + t; });
  if(micG) box.appendChild(micG);
  var ch = starters(card, function(s){ inp.value = s + " "; inp.focus(); }); if(ch) box.appendChild(ch);
  draw();
  return box;
}
function fStamps(){
  var list = stampedList(), box = el("div", "pb-stamps");
  box.innerHTML = list.length ? list.map(function(id){ var s = BY[id]; return '<span style="--c:' + STAGES[s.stage].c + '"><i></i>' + esc(s.n) + '</span>'; }).join("") : '<p class="hint">No stamps yet. They show up here as you go.</p>';
  return box;
}
function fDq(card, ctx){
  var box = el("div");
  box.appendChild(el("p", "pb-dq", esc(dq())));
  var t = fText(card, ctx, true);
  box.appendChild(t); box._insert = t._insert;
  return box;
}

/* the brainstorm web: ideas float round a light bulb */
var BUBC = ["#ffe1c7", "#cfe9ef", "#e6d9ef", "#d8f0df", "#fff1a8", "#ffd6e3"];
function fWeb(card, ctx){
  var box = el("div");
  var web = el("div", "pb-web");
  web.innerHTML = '<svg class="lines" aria-hidden="true"></svg><button type="button" class="bulb" aria-label="Add an idea">' + '<svg viewBox="0 0 24 24"><path d="' + I.brain + '"/></svg></button>';
  var lines = web.querySelector("svg.lines"), bulb = web.querySelector(".bulb"), sel = null, bulbTaps = 0;
  box.appendChild(web);
  function items(){ return getC(ctx.step, ctx.pg, card.id); }
  function draw(fresh){
    [].forEach.call(web.querySelectorAll(".bub"), function(b){ b.remove(); });
    var its = items(), W = web.clientWidth || 600, H = web.clientHeight || 360, L = "";
    its.forEach(function(it, n){
      var v = it.v || {}, x = +v.x, y = +v.y;
      if(!(x >= 0 && x <= 1)) x = .5 + .36 * Math.cos(n * 2.4); if(!(y >= 0 && y <= 1)) y = .5 + .36 * Math.sin(n * 2.4);
      var b = el("div", "bub" + (it.by === "j" ? " jay" : "") + (fresh === it.id ? " new" : "") + (sel === it.id ? " sel" : ""));
      b.style.left = (x * 100) + "%"; b.style.top = (y * 100) + "%"; b.style.setProperty("--bc", BUBC[(v.c || n) % BUBC.length]);
      b.style.setProperty("--d", (n % 5) * .6 + "s");
      b.innerHTML = '<span class="in">' + esc(v.text || "") + '</span><button type="button" class="x" aria-label="Take this idea out">&times;</button>';
      b.dataset.id = it.id; b.tabIndex = 0;
      web.appendChild(b);
      L += '<path d="M' + (W / 2) + ' ' + (H / 2) + ' Q' + ((W / 2 + x * W) / 2 + 20) + ' ' + ((H / 2 + y * H) / 2 - 20) + ' ' + (x * W) + ' ' + (y * H) + '" fill="none" stroke="#0a2f38" stroke-opacity=".35" stroke-width="2.5" stroke-dasharray="6 6"/>';
    });
    lines.setAttribute("viewBox", "0 0 " + W + " " + H);
    lines.innerHTML = L;
    web.style.setProperty("--glow", Math.min(60, its.length * 6));
  }
  /* dragging */
  var drag = null;
  web.addEventListener("pointerdown", function(e){
    var x = e.target.closest(".x");
    if(x){ var bb = x.closest(".bub"); putC(ctx.step, ctx.pg, card.id, bb.dataset.id, null, true); sel = null; draw(); return; }
    var b = e.target.closest(".bub"); if(!b) { sel = null; [].forEach.call(web.querySelectorAll(".bub.sel"), function(z){ z.classList.remove("sel"); }); return; }
    var r = web.getBoundingClientRect();
    drag = { b: b, id: b.dataset.id, r: r, moved: false, sx: e.clientX, sy: e.clientY };
    try{ b.setPointerCapture(e.pointerId); }catch(er){}
    b.classList.add("drag");
  });
  web.addEventListener("pointermove", function(e){
    if(!drag) return;
    if(Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) > 5) drag.moved = true;
    if(!drag.moved) return;
    var x = Math.max(.08, Math.min(.92, (e.clientX - drag.r.left) / drag.r.width)), y = Math.max(.08, Math.min(.92, (e.clientY - drag.r.top) / drag.r.height));
    drag.b.style.left = (x * 100) + "%"; drag.b.style.top = (y * 100) + "%"; drag.x = x; drag.y = y;
  });
  function end(){
    if(!drag) return;
    var d = drag; drag = null; d.b.classList.remove("drag");
    if(d.moved && d.x != null){
      var it = items().filter(function(i){ return i.id === d.id; })[0];
      if(it){ var v = {}; for(var k in (it.v || {})) v[k] = it.v[k]; v.x = d.x; v.y = d.y; putC(ctx.step, ctx.pg, card.id, d.id, v); }
      draw();
    } else { sel = sel === d.id ? null : d.id; draw(); }
  }
  web.addEventListener("pointerup", end); web.addEventListener("pointercancel", end);
  var add = el("div", "pb-add"); add.style.marginTop = "12px";
  add.innerHTML = '<input class="pb-in" type="text" maxlength="80" placeholder="Type an idea" aria-label="An idea"><button type="button" class="pb-btn small teal">Pop it on</button>';
  var inp = add.querySelector("input");
  function addOne(t){
    t = String(t || "").trim(); if(!t) return;
    var n = items().length, a = n * 2.39996 + .6, rr = .3 + (n % 3) * .06;
    var id = uid();
    putC(ctx.step, ctx.pg, card.id, id, { text: t, x: Math.max(.1, Math.min(.9, .5 + rr * Math.cos(a))), y: Math.max(.1, Math.min(.9, .5 + rr * 1.1 * Math.sin(a))), c: n % BUBC.length });
    draw(id);
    if(items().length === 10) bonnie();
  }
  add.querySelector("button").onclick = function(){ addOne(inp.value); inp.value = ""; inp.focus(); };
  inp.addEventListener("keydown", function(e){ if(e.key === "Enter"){ e.preventDefault(); addOne(inp.value); inp.value = ""; } });
  bulb.onclick = function(){ inp.focus(); bulbTaps++; if(bulbTaps === 7){ bulbTaps = 0; burst(); } };
  box.appendChild(add);
  box._insert = function(t){ if(/\s$/.test(t)){ inp.value = t; try{ inp.focus(); }catch(e){} } else addOne(t); };
  var micW = micFor(function(t){ inp.value = (inp.value ? inp.value + " " : "") + t; });
  if(micW) box.appendChild(micW);
  var ch = starters(card, function(s){ inp.value = s + " "; inp.focus(); }); if(ch) box.appendChild(ch);
  setTimeout(function(){ draw(); }, 0);
  var rs = debounce(function(){ if(web.isConnected) draw(); }, 200);
  window.addEventListener("resize", rs);
  return box;
}

/* drawing: strokes saved as numbers, so a page stays small */
function encodeSk(strokes){ return strokes.map(function(s){ return s.c + "" + s.w + ":" + s.p.join(","); }).join(";"); }
function decodeSk(str){
  if(!str) return [];
  return String(str).split(";").map(function(part){
    var m = part.match(/^(\d)(\d):(.*)$/); if(!m) return null;
    return { c: +m[1], w: +m[2], p: m[3] ? m[3].split(",").map(Number) : [] };
  }).filter(Boolean);
}
function inkOf(s){ return s.c === 9 ? "#fffdf8" : (INKS[s.c] || INKS[0]); }
function widthOf(s){ return s.c === 9 ? 26 : (WIDTHS[s.w] || 4); }
function skSvg(str, cls){
  var st = decodeSk(str);
  return '<svg class="' + (cls || "sk") + '" viewBox="0 0 ' + DRAW_W + ' ' + DRAW_H + '" aria-hidden="true"><rect width="' + DRAW_W + '" height="' + DRAW_H + '" fill="#fffdf8"/>' +
    st.map(function(s){
      var p = s.p, d = "";
      for(var i = 0; i + 1 < p.length; i += 2) d += (i ? "L" : "M") + p[i] + " " + p[i + 1];
      if(p.length === 2) d += "l0.1 0";
      return '<path d="' + d + '" fill="none" stroke="' + inkOf(s) + '" stroke-width="' + widthOf(s) + '" stroke-linecap="round" stroke-linejoin="round"/>';
    }).join("") + '</svg>';
}
function fSketch(card, ctx){
  var box = el("div", "pb-sk");
  var g = getDraw(ctx.step, ctx.pg, card.id), strokes = decodeSk(g.v), ink = 0, w = 1, rubber = false, gridKey = card.id + "_grid";
  var gridOn = card.grid ? getF(ctx.step, ctx.pg, gridKey).v !== false : false;
  var tools = el("div", "pb-tools");
  tools.innerHTML = INKS.map(function(c, i){ return '<button type="button" class="ink" data-ink="' + i + '" style="background:' + c + '" aria-label="Colour ' + (i + 1) + '" aria-pressed="' + (i === 0) + '"></button>'; }).join("") +
    '<span class="sep"></span>' + ["Thin", "Medium", "Thick"].map(function(n, i){ return '<button type="button" class="tb" data-w="' + i + '" aria-pressed="' + (i === 1) + '">' + n + '</button>'; }).join("") +
    '<button type="button" class="tb" data-a="rub" aria-pressed="false">Rubber</button><span class="sep"></span>' +
    '<button type="button" class="tb" data-a="undo">Undo</button><button type="button" class="tb" data-a="clear">Clear</button>' +
    (card.grid ? '<button type="button" class="tb" data-a="grid" aria-pressed="' + gridOn + '">Grid</button>' : '');
  var cv = el("canvas"); cv.setAttribute("aria-label", "Drawing space");
  if(gridOn) cv.classList.add("grid");
  var full = el("p", "hint");
  box.appendChild(tools); box.appendChild(cv); box.appendChild(full);
  if(g.by === "j" && strokes.length) full.innerHTML = "Drawn with Jay " + jayTag("j");
  var ctx2 = cv.getContext("2d"), scale = 1, dpr = window.devicePixelRatio || 1;
  function size(){
    cv.style.width = "";
    var W = Math.min(cv.clientWidth || 700, Math.round(Math.max(320, (window.innerHeight || 800) * .58) * DRAW_W / DRAW_H)), H = Math.round(W * DRAW_H / DRAW_W);
    cv.style.width = W + "px"; cv.style.height = H + "px"; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    scale = W / DRAW_W; paint();
  }
  function paint(){
    ctx2.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    ctx2.clearRect(0, 0, DRAW_W, DRAW_H);
    strokes.forEach(function(s){
      ctx2.strokeStyle = inkOf(s); ctx2.lineWidth = widthOf(s); ctx2.lineCap = "round"; ctx2.lineJoin = "round";
      ctx2.globalCompositeOperation = s.c === 9 ? "destination-out" : "source-over";
      ctx2.beginPath();
      for(var i = 0; i + 1 < s.p.length; i += 2){ if(i) ctx2.lineTo(s.p[i], s.p[i + 1]); else ctx2.moveTo(s.p[i], s.p[i + 1]); }
      if(s.p.length === 2) ctx2.lineTo(s.p[0] + .1, s.p[1]);
      ctx2.stroke();
    });
    ctx2.globalCompositeOperation = "source-over";
  }
  function save(){
    var enc = encodeSk(strokes);
    if(enc.length > DRAW_MAX){ strokes.pop(); full.textContent = "This page is full of drawing. Start another page whenever you like."; paint(); return; }
    setDraw(ctx.step, ctx.pg, card.id, enc); full.textContent = "";
  }
  var cur = null;
  function pt(e){ var r = cv.getBoundingClientRect(); return [Math.round((e.clientX - r.left) / r.width * DRAW_W), Math.round((e.clientY - r.top) / r.height * DRAW_H)]; }
  cv.addEventListener("pointerdown", function(e){
    e.preventDefault(); try{ cv.setPointerCapture(e.pointerId); }catch(er){}
    cur = { c: rubber ? 9 : ink, w: w, p: pt(e) }; strokes.push(cur); paint();
  });
  cv.addEventListener("pointermove", function(e){
    if(!cur) return;
    var p = pt(e), L = cur.p.length;
    if(Math.abs(p[0] - cur.p[L - 2]) + Math.abs(p[1] - cur.p[L - 1]) < 4) return;
    cur.p.push(p[0], p[1]); paint();
  });
  function up(){ if(cur){ cur = null; save(); } }
  cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up); cv.addEventListener("pointerleave", up);
  tools.addEventListener("click", function(e){
    var b = e.target.closest("button"); if(!b) return;
    if(b.dataset.ink != null){ ink = +b.dataset.ink; rubber = false; [].forEach.call(tools.querySelectorAll(".ink"), function(x){ x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); tools.querySelector('[data-a=rub]').setAttribute("aria-pressed", "false"); }
    else if(b.dataset.w != null){ w = +b.dataset.w; [].forEach.call(tools.querySelectorAll("[data-w]"), function(x){ x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); }
    else if(b.dataset.a === "rub"){ rubber = !rubber; b.setAttribute("aria-pressed", rubber ? "true" : "false"); }
    else if(b.dataset.a === "undo"){ strokes.pop(); paint(); setDraw(ctx.step, ctx.pg, card.id, encodeSk(strokes)); }
    else if(b.dataset.a === "clear"){
      if(b.dataset.sure){ strokes = []; paint(); setDraw(ctx.step, ctx.pg, card.id, ""); b.textContent = "Clear"; delete b.dataset.sure; }
      else { b.dataset.sure = "1"; b.textContent = "Sure? Tap again"; setTimeout(function(){ if(b.dataset.sure){ delete b.dataset.sure; b.textContent = "Clear"; } }, 2500); }
    }
    else if(b.dataset.a === "grid"){ gridOn = !gridOn; cv.classList.toggle("grid", gridOn); b.setAttribute("aria-pressed", gridOn ? "true" : "false"); setF(ctx.step, ctx.pg, gridKey, gridOn); }
  });
  setTimeout(size, 0);
  var rs = debounce(function(){ if(cv.isConnected) size(); }, 200);
  window.addEventListener("resize", rs);
  if(card.link){
    var phId = card.id + "_ph", phBox = el("div", "pb-mini");
    var drawPh = function(){
      var g2 = getF(ctx.step, ctx.pg, phId), src = photoSrc(g2.v);
      phBox.innerHTML = src ? '<img class="pb-photo" alt="Your photo" src="' + src + '">' : '';
      if(src){ var rm = el("button", "pb-btn small quiet", "Take the photo out"); rm.type = "button"; rm.onclick = function(){ sdel(kPhoto(g2.v.o || "s", g2.v.ph)); setF(ctx.step, ctx.pg, phId, null); drawPh(); }; phBox.appendChild(rm); }
      var cb = photoButton(function(id){ if(src) sdel(kPhoto(g2.v.o || "s", g2.v.ph)); setF(ctx.step, ctx.pg, phId, { ph: id, o: PEN }); drawPh(); }, null, src ? "Take a different photo" : "Or take a photo instead");
      if(cb) phBox.appendChild(cb);
    };
    drawPh(); box.appendChild(phBox);
    var lk = el("div", "pb-mini"), lid = card.id + "_link", lg = getF(ctx.step, ctx.pg, lid);
    lk.innerHTML = '<label>Or a link to a photo, video or file <small style="opacity:.7">(optional)</small></label>';
    var li = el("input", "pb-in" + (lg.by === "j" ? " jay" : "")); li.type = "url"; li.placeholder = "https://drive.google.com/..."; li.value = lg.v || ""; li.setAttribute("aria-label", "Link");
    var open = el("p", "hint");
    function showOpen(){ var u = safeHref(li.value); open.innerHTML = u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener">Open the link</a>' : ""; }
    li.addEventListener("input", debounce(function(){ setF(ctx.step, ctx.pg, lid, li.value.trim()); showOpen(); }, 500));
    lk.appendChild(li); lk.appendChild(open); box.appendChild(lk); showOpen();
  }
  return box;
}

/* the cover */
function coverHtml(look, title){
  look = look || {};
  var c = COVERS[look.c] || COVERS[0], st = Array.isArray(look.s) ? look.s.slice(0, 3) : [];
  var spots = [["auto", "10px", "62px", "auto", "-8deg"], ["44%", "-4px", "auto", "auto", "14deg"], ["auto", "auto", "60px", "68px", "8deg"]];
  return '<div class="bk" style="--cv:' + c + '"><span class="tape"></span><b>' + esc(title || "My project") + '</b><small>Enterprise Learning Project</small>' +
    st.map(function(n, i){ var s = spots[i]; return '<span class="stk" style="top:' + s[0] + ';right:' + s[1] + ';bottom:' + s[2] + ';left:' + s[3] + ';transform:rotate(' + s[4] + ')">' + stickerSvg(n) + '</span>'; }).join("") +
    '<span class="ini">' + esc(WHO || "") + '</span></div>';
}
function fCover(card, ctx){
  var g = getF(ctx.step, ctx.pg, card.id), look = g.v && typeof g.v === "object" ? { c: g.v.c, s: (g.v.s || []).slice() } : { c: 0, s: [] };
  var wrap = el("div", "pb-covered");
  var prev = el("div", "pb-cover"); prev.style.width = "200px";
  var right = el("div");
  right.innerHTML = '<p class="lab">Colour</p><div class="pb-swatch">' + COVERS.map(function(c, i){ return '<button type="button" data-c="' + i + '" style="background:' + c + '" aria-label="Colour ' + (i + 1) + '" aria-pressed="' + (look.c === i) + '"></button>'; }).join("") + '</div>' +
    '<p class="lab">Stickers (up to three)</p><div class="pb-stkset">' + STICKERS.map(function(n){ return '<button type="button" data-s="' + n + '" aria-label="' + n + ' sticker" aria-pressed="' + (look.s.indexOf(n) >= 0) + '">' + stickerSvg(n) + '</button>'; }).join("") + '</div>';
  function show(){ prev.innerHTML = coverHtml(look, getF("cover", 1, "title").v); }
  right.addEventListener("click", function(e){
    var b = e.target.closest("button"); if(!b) return;
    if(b.dataset.c != null){ look.c = +b.dataset.c; [].forEach.call(right.querySelectorAll("[data-c]"), function(x){ x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); }
    if(b.dataset.s){
      var at = look.s.indexOf(b.dataset.s);
      if(at >= 0) look.s.splice(at, 1); else { if(look.s.length >= 3) look.s.shift(); look.s.push(b.dataset.s); }
      [].forEach.call(right.querySelectorAll("[data-s]"), function(x){ x.setAttribute("aria-pressed", look.s.indexOf(x.dataset.s) >= 0 ? "true" : "false"); });
    }
    setF(ctx.step, ctx.pg, card.id, { c: look.c, s: look.s.slice() }); show();
  });
  wrap.appendChild(prev); wrap.appendChild(right); show();
  return wrap;
}

/* voice typing: Chrome's own speech to text. On some school networks it
   cannot connect; then it says so, and points at the Chromebook's own
   dictation (Search + D, once switched on in Accessibility settings). */
var SRC = window.SpeechRecognition || window.webkitSpeechRecognition;
function micFor(onText){
  if(!SRC || STAFF) return null;
  var w = el("div"), b = el("button", "pb-mic", MIC + "<span>Say it</span>"), line = el("p", "pb-micline");
  b.type = "button"; b.setAttribute("aria-label", "Say it instead of typing");
  var row = el("div", "pb-row"); row.appendChild(b); w.appendChild(row); w.appendChild(line);
  var rec = null;
  b.onclick = function(){
    if(rec){ try{ rec.stop(); }catch(e){} return; }
    try{ rec = new SRC(); }catch(e){ line.textContent = "Voice typing is not available on this laptop."; return; }
    rec.lang = "en-GB"; rec.interimResults = true; rec.continuous = false;
    var got = "";
    rec.onstart = function(){ b.classList.add("on"); b.querySelector("span").textContent = "Listening... tap to stop"; line.textContent = "Say it whenever you are ready."; };
    rec.onresult = function(e){
      var interim = "";
      for(var i = e.resultIndex; i < e.results.length; i++){
        if(e.results[i].isFinal) got += e.results[i][0].transcript; else interim += e.results[i][0].transcript;
      }
      line.textContent = interim ? "Hearing: " + interim : "";
    };
    rec.onerror = function(e){
      var c = e && e.error;
      line.textContent = c === "no-speech" ? "Did not catch anything. Have another go whenever." :
        c === "not-allowed" ? "The microphone is switched off for this page. Jay can help switch it on." :
        c === "aborted" ? "" : "Voice typing could not connect on this laptop. On a Chromebook, Search + D starts its own dictation (if it is switched on).";
    };
    rec.onend = function(){
      b.classList.remove("on"); b.querySelector("span").textContent = "Say it"; rec = null;
      got = got.trim();
      if(got){ onText(got.charAt(0).toUpperCase() + got.slice(1)); line.textContent = "Popped it in. Change it however you like."; }
    };
    try{ rec.start(); }catch(e){ rec = null; line.textContent = "Voice typing did not start. Have another go in a moment."; }
  };
  return w;
}

/* photos: taken with the laptop camera (or picked from the laptop), made
   small, and saved in the book like everything else */
function shrinkPhoto(file){
  return new Promise(function(res){
    var r = new FileReader();
    r.onerror = function(){ res(null); };
    r.onload = function(){
      var im = new Image();
      im.onerror = function(){ res(null); };
      im.onload = function(){
        var sizes = [720, 600, 500, 420, 340, 280], qs = [.62, .5, .4];
        for(var i = 0; i < sizes.length; i++){
          var k = Math.min(1, sizes[i] / Math.max(im.width, im.height)), cv = document.createElement("canvas");
          cv.width = Math.max(1, Math.round(im.width * k)); cv.height = Math.max(1, Math.round(im.height * k));
          var c2 = cv.getContext("2d"); c2.fillStyle = "#fff"; c2.fillRect(0, 0, cv.width, cv.height); c2.drawImage(im, 0, 0, cv.width, cv.height);
          for(var j = 0; j < qs.length; j++){ var d = cv.toDataURL("image/jpeg", qs[j]); if(d.length <= 38000) return res(d); }
        }
        res(null);
      };
      im.src = r.result;
    };
    r.readAsDataURL(file);
  });
}
function photoButton(onSaved, msgEl, label){
  if(S.guest && !STAFF) return null;
  var w = el("div", "pb-row"), b = el("button", "pb-btn small pb-cam", CAM + (label || "Take a photo")), say = msgEl || el("p", "hint");
  b.type = "button"; w.appendChild(b); if(!msgEl) w.appendChild(say);
  var inp = el("input"); inp.type = "file"; inp.accept = "image/*"; inp.setAttribute("capture", "environment"); inp.hidden = true; w.appendChild(inp);
  b.onclick = function(){
    if(photoCount() >= 40){ say.textContent = "The book has 40 photos already. Take one out to add another, or use a Drive link."; return; }
    inp.value = ""; inp.click();
  };
  inp.onchange = function(){
    var f = inp.files && inp.files[0]; if(!f) return;
    say.textContent = "Making it fit the book...";
    shrinkPhoto(f).then(function(d){
      if(!d){ say.textContent = "That photo would not fit. Try another, or put it in your Drive and paste the link."; return; }
      var id = uid(); wj(kPhoto(PEN, id), { v: d, t: now() });
      say.textContent = "Photo in."; onSaved(id);
    });
  };
  return w;
}

/* "Not sure? Help me think" under each card */
function helpEl(card, ctx, body){
  if(card.t === "stamps") return null;
  var H = HELP[ctx.step + "." + card.id] || {};
  if(STAFF){
    var fl = getF(ctx.step, ctx.pg, "_help_" + card.id).v;
    return fl ? el("p", "pb-helpflag", "Asked for a hand with this, " + esc(niceDate(+fl))) : null;
  }
  var looks = (H.look || []).map(function(r){
    var p = r.split("."), st = BY[p[0]]; if(!st) return null;
    var c = st.cards.filter(function(x){ return x.id === p[1]; })[0]; if(!c) return null;
    var n = p[0] === "cover" ? 1 : pagesOf(p[0]), parts = [];
    for(var i = 1; i <= n; i++){ var t = cardText(c, { step: p[0], pg: i }); if(t) parts.push(t.replace(/ \[Jay\]/g, "")); }
    return parts.length ? { s: st, c: c, t: parts.join("\n") } : null;
  }).filter(Boolean);
  var tiles = [];
  if(H.ask && body._insert) tiles.push(["ask", "A smaller question"]);
  if(H.eg) tiles.push(["eg", "See an example"]);
  if(looks.length) tiles.push(["look", "Look back at my book"]);
  if(H.where) tiles.push(["where", "Where could I find out?"]);
  if(!S.guest) tiles.push(["jay", "Ask Jay or Holly"]);
  if(!tiles.length) return null;
  var wrap = el("div", "pb-helpwrap");
  var btn = el("button", "pb-helpbtn", BULB + "<span>Not sure? Help me think</span>"); btn.type = "button"; btn.setAttribute("aria-expanded", "false");
  var box = el("div", "pb-help"); box.hidden = true;
  box.innerHTML = '<div class="tiles" role="group" aria-label="Ways to help">' + tiles.map(function(t){ return '<button type="button" data-h="' + t[0] + '" aria-pressed="false">' + HICON[t[0]] + '<span>' + t[1] + '</span></button>'; }).join("") + '</div><div class="hc" aria-live="polite"></div>';
  wrap.appendChild(btn); wrap.appendChild(box);
  var hc = box.querySelector(".hc");
  function say(t){ if(WHO === "LC" && window.B5Speak && t) B5Speak.say(t); }
  btn.onclick = function(){
    box.hidden = !box.hidden; btn.setAttribute("aria-expanded", box.hidden ? "false" : "true");
    if(!box.hidden && tiles.length === 1) show(tiles[0][0]);
  };
  function show(kind){
    [].forEach.call(box.querySelectorAll("[data-h]"), function(x){ x.setAttribute("aria-pressed", x.dataset.h === kind ? "true" : "false"); });
    if(kind === "ask"){
      hc.innerHTML = '<p class="hq">' + esc(H.ask.q) + '</p><div class="pb-chips">' + H.ask.o.map(function(o, i){ return '<button type="button" data-o="' + i + '">' + esc(o[0]) + '</button>'; }).join("") + '</div><p class="ok" hidden></p>';
      hc.querySelector(".pb-chips").onclick = function(e){
        var b = e.target.closest("[data-o]"); if(!b) return;
        var o = H.ask.o[+b.dataset.o]; body._insert(o[1]);
        var ok = hc.querySelector(".ok"); ok.hidden = false;
        ok.textContent = /\s$/.test(o[1]) ? "Started it for you. Finish it however you like." : "Popped it in. Change it however you like.";
      };
      say(H.ask.q);
    } else if(kind === "eg"){
      hc.innerHTML = '<div class="pb-eg">' + BFACE + '<div><b>From Bonnie\'s project book</b><p>' + esc(H.eg) + '</p></div></div>';
      say(H.eg);
    } else if(kind === "look"){
      hc.innerHTML = '<p class="hq">You have already written some of this</p>' + looks.map(function(L){
        return '<div class="pb-look"><b>' + esc(L.s.n) + ': ' + esc(L.c.label) + '</b><p>' + esc(L.t) + '</p>' + (L.s.id !== ctx.step ? '<button type="button" class="pb-btn small quiet" data-go="' + L.s.id + '">Open that page</button>' : '') + '</div>';
      }).join("");
      hc.onclick = function(e){ var b = e.target.closest("[data-go]"); if(b) openStep(b.dataset.go); };
    } else if(kind === "where"){
      hc.innerHTML = '<p>' + esc(H.where) + '</p>' + (H.link ? '<a class="pb-btn small" href="' + esc(H.link[1]) + '">' + esc(H.link[0]) + '</a>' : '');
      say(H.where);
    } else if(kind === "jay"){
      hc.innerHTML = '<p>Send Jay a message saying you would like a hand with this one? Jay or Holly will come over when they can.</p>' +
        '<div class="pb-row"><button type="button" class="pb-btn small teal" data-a="yes">Yes please</button><button type="button" class="pb-btn small quiet" data-a="no">Not now</button></div><p class="ok" hidden></p>';
      hc.onclick = function(e){
        var b = e.target.closest("[data-a]"); if(!b) return;
        if(b.dataset.a === "no"){ hc.innerHTML = ""; [].forEach.call(box.querySelectorAll("[data-h]"), function(x){ x.setAttribute("aria-pressed", "false"); }); return; }
        var ok = hc.querySelector(".ok"); ok.hidden = false; ok.textContent = "Sending...";
        b.disabled = true;
        var pp = page(PEN, ctx.step, ctx.pg), t = now(); pp.f["_help_" + card.id] = { v: t, t: t }; pp.t = t; wj(kPage(PEN, ctx.step, ctx.pg), pp);
        var text = WHO + " would like a hand with their project book. " + BY[ctx.step].n + ": " + card.q;
        (S.call ? S.call("send", { who: WHO, tool: "Project book: a hand please", page: location.pathname + "#" + ctx.step, text: text }) : Promise.reject())
          .then(function(o){ if(!o || !o.ok) throw 0; ok.textContent = "Sent. Jay or Holly will come over. Carry on with something else, or have a break."; })
          .catch(function(){ ok.textContent = "That did not send just now. Give Jay or Holly a wave instead."; });
      };
    }
  }
  box.querySelector(".tiles").onclick = function(e){ var b = e.target.closest("[data-h]"); if(b) show(b.dataset.h); };
  return wrap;
}

function renderBody(card, ctx){
  switch(card.t){
    case "text": return fText(card, ctx, false);
    case "long": return fText(card, ctx, true);
    case "date": return fDate(card, ctx);
    case "faces": return fFaces(card, ctx);
    case "pick": return fPick(card, ctx);
    case "days": return fDays(card, ctx);
    case "list": return fList(card, ctx, "list");
    case "qa": return fList(card, ctx, "qa");
    case "rubric": return fList(card, ctx, "rubric");
    case "cues": return fList(card, ctx, "cues");
    case "links": return fLinks(card, ctx);
    case "log": return fLog(card, ctx);
    case "web": return fWeb(card, ctx);
    case "sketch": return fSketch(card, ctx);
    case "stamps": return fStamps();
    case "dq": return fDq(card, ctx);
    case "cover": return fCover(card, ctx);
  }
  return el("div");
}
function cardHasWork(card, ctx){
  var s = ctx.step, p = ctx.pg;
  if(card.t === "sketch") return !!getDraw(s, p, card.id).v || hasVal(getF(s, p, card.id + "_link").v) || !!photoSrc(getF(s, p, card.id + "_ph").v);
  if(["list", "qa", "rubric", "links", "log", "cues", "web"].indexOf(card.t) >= 0) return getC(s, p, card.id).length > 0;
  if(card.t === "stamps") return true;
  return hasVal(getF(s, p, card.id).v);
}
function speakBtn(card){
  if(!(WHO === "LC" && !STAFF)) return "";
  return '<button type="button" class="pb-say" aria-label="Read it to me">' + SAY + '</button>';
}
function cardEl(card, ctx, all){
  var c = el("div", "pb-card");
  c.innerHTML = (card.label !== card.q || (all && STAFF) ? '<span class="lab">' + esc(card.label) + '</span>' : '') + '<div class="cq"><h2>' + esc(all && STAFF ? card.label : card.q) + '</h2>' + speakBtn(card) + '</div>' +
    (card.hint && !(all && STAFF) ? '<p class="hint">' + esc(card.hint) + '</p>' : (all && STAFF && card.q !== card.label ? '<p class="hint">Student sees: ' + esc(card.q) + '</p>' : ""));
  var say = c.querySelector(".pb-say");
  if(say) say.onclick = function(){ if(window.B5Speak) B5Speak.say(card.q + ". " + (card.hint || "")); };
  var b = el("div", "body"), inner = renderBody(card, ctx); b.appendChild(inner); c.appendChild(b);
  var hp = helpEl(card, ctx, inner); if(hp) c.appendChild(hp);
  return c;
}

/* ==========================================================
   Fun bits
   ========================================================== */
function burst(colour){
  if(REDUCED) return;
  var fx = el("div", "pb-stampfx"), cols = ["#ef7724", "#007291", "#ffc247", "#7b4b8f", "#1e9e5a", "#00a6c9"];
  for(var i = 0; i < 46; i++){
    var b = el("i", "bit");
    b.style.left = Math.random() * 100 + "vw"; b.style.background = colour && i % 3 === 0 ? colour : cols[i % cols.length];
    b.style.animationDelay = (Math.random() * .5) + "s"; b.style.animationDuration = (1.2 + Math.random()) + "s";
    fx.appendChild(b);
  }
  document.body.appendChild(fx);
  setTimeout(function(){ fx.remove(); }, 2600);
}
function stampFx(word, colour){
  var fx = el("div", "pb-stampfx");
  fx.style.setProperty("--sc", colour);
  fx.innerHTML = '<div class="st">' + esc(word) + '</div>';
  document.body.appendChild(fx);
  var root = $("pb"); if(root && !REDUCED){ root.classList.remove("pb-shake"); void root.offsetWidth; root.classList.add("pb-shake"); }
  setTimeout(function(){ burst(colour); }, 250);
  setTimeout(function(){ fx.remove(); }, 1500);
}
function bonnie(){
  if(REDUCED || document.querySelector(".pb-bonnie")) return;
  var b = el("div", "pb-bonnie", BONNIE); document.body.appendChild(b);
  setTimeout(function(){ b.remove(); }, 5200);
}

/* ==========================================================
   Student: the map
   ========================================================== */
var root = null, view = { at: "map" };
function mount(){
  root = $("pb");
  if(!root){ root = el("div"); root.id = "pb"; document.body.appendChild(root); }
  root.className = "pb";
}
function stageOf(s){ return STAGES[s.stage] || { n: "", half: "", c: "#007291" }; }

function drawMap(){
  view = { at: "map" };
  writeSummary();
  var nx = nextStep(), list = stampedList(), m = meta();
  var look = getF("cover", 1, "look").v, title = getF("cover", 1, "title").v;
  var h = '<div class="pb-top"><div><button type="button" class="pb-cover" id="pbCover" aria-label="Change your cover">' + coverHtml(look, title) + '</button><span class="edit" aria-hidden="true">Tap to change your cover</span></div>' +
    '<div><span class="pb-kick">Enterprise Learning Project</span><h1>' + esc(WHO) + "'s project book</h1>" +
    '<p class="pb-dq">' + esc(dq()) + '</p>' +
    '<div class="pb-count"><span>' + list.length + ' of ' + ROUTE.length + ' stamped</span><span class="pb-bar"><i id="pbBar" style="width:0"></i></span></div>' +
    (nx ? '<button type="button" class="pb-btn main" id="pbGo">' + (list.length || stepState(nx.id).started ? "Carry on: " : "Start here: ") + esc(nx.n) + NEXT + '</button>'
        : '<button type="button" class="pb-btn main" id="pbAll">Your book is complete! Have a look back' + NEXT + '</button>') +
    weekLine() +
    '<p class="pb-small">Or tap any stop on the map. Any order is fine, and you can come back to any page.</p></div></div>';
  var news = ROUTE.filter(function(s){ return jayNew(s.id); });
  if(news.length) h += '<div class="pb-news" role="status"><b>Jay wrote in your book</b><span>on ' + news.map(function(s){ return esc(s.n); }).join(", ") + '.</span>' +
    news.slice(0, 3).map(function(s){ return '<button type="button" class="pb-btn small" data-open="' + s.id + '">Open ' + esc(s.n) + '</button>'; }).join("") + '</div>';
  h += '<div class="pb-map" id="pbMap"></div>';
  h += '<div class="pb-foot"><button type="button" class="pb-btn" id="pbPrintBtn">Print my book</button><button type="button" class="pb-btn" id="pbBookletBtn">Make my booklet</button>' + (S.guest ? '' : '<button type="button" class="pb-btn" id="pbSendBtn">Send Jay a look</button>') + '<div class="sendbox" id="pbSend" hidden></div></div>';
  root.innerHTML = h;
  setTimeout(function(){ var b = $("pbBar"); if(b) b.style.width = Math.round(list.length / ROUTE.length * 100) + "%"; }, 60);
  $("pbCover").onclick = function(){ openStep("cover", 1, 0); };
  if($("pbGo")) $("pbGo").onclick = function(){ openStep(nx.id); };
  if($("pbAll")) $("pbAll").onclick = function(){ printBook({ blank: false }); };
  [].forEach.call(root.querySelectorAll("[data-open]"), function(b){ b.onclick = function(){ openStep(b.dataset.open); }; });
  $("pbPrintBtn").onclick = function(){ printBook({ blank: false }); };
  $("pbBookletBtn").onclick = printBooklet;
  if($("pbSendBtn")) $("pbSendBtn").onclick = function(){
    var box = $("pbSend"); box.hidden = !box.hidden;
    if(!box.hidden && !box.firstChild && window.Base5Send) Base5Send.mount(box, { tool: WHO + "'s project book", filename: (WHO || "my").toLowerCase() + "-project-book", getText: bookText });
    if(!box.hidden) box.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "nearest" });
  };
  drawRoute(nx);
  window.scrollTo(0, 0);
}

function thisWeek(){
  var B = window.B5BOOKPLAN; if(!B || B.book !== BOOK) return null;
  return B.weekOf(B.today());
}
function weekLine(){
  var w = thisWeek(); if(!w) return "";
  return '<div class="pb-week"><b>This week:</b>' + w.steps.map(function(id){ var st = stepState(id); return '<span class="' + (st.done ? "done" : "") + '">' + (st.done ? "&#10003; " : "") + esc(BY[id].n) + '</span>'; }).join("") + '</div>';
}
var mapAnimated = false, podTaps = 0, lastPod = null;
function drawRoute(nx){
  var box = $("pbMap"); if(!box) return;
  var W = Math.max(320, box.clientWidth || 900);
  var cols = W >= 980 ? 7 : W >= 760 ? 6 : W >= 520 ? 4 : 3;
  var padX = W < 520 ? 50 : 76, rowH = W < 520 ? 150 : 170, top = 100;
  var rows = Math.ceil(ROUTE.length / cols), H = top + (rows - 1) * rowH + 96;
  var pts = ROUTE.map(function(s, i){
    var r = Math.floor(i / cols), c = i % cols; if(r % 2) c = cols - 1 - c;
    var x = cols === 1 ? W / 2 : padX + c * (W - 2 * padX) / (cols - 1);
    return { x: x, y: top + r * rowH, r: r, s: s };
  });
  var bulge = Math.min(padX - 8, 64);
  function seg(a, b){
    if(a.r === b.r) return "M" + a.x + " " + a.y + "L" + b.x + " " + b.y;
    var dir = a.r % 2 ? -1 : 1;
    return "M" + a.x + " " + a.y + "C" + (a.x + dir * bulge * 1.4) + " " + a.y + " " + (b.x + dir * bulge * 1.4) + " " + b.y + " " + b.x + " " + b.y;
  }
  var full = pts.map(function(p, i){ return i ? seg(pts[i - 1], p).replace(/^M[^LC]+/, "") : "M" + p.x + " " + p.y; }).join("");
  var states = ROUTE.map(function(s){ return stepState(s.id); });
  var tw = thisWeek(), wk = tw ? tw.steps : [];
  var anim = !mapAnimated && !REDUCED; mapAnimated = true;
  var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="group" aria-label="The map of your project book">';
  svg += '<path class="road" d="' + full + '"/><path class="dash' + (anim ? ' draw' : '') + '" style="--len:4000" d="' + full + '"/>';
  /* the trail: coloured where both ends are stamped */
  pts.forEach(function(p, i){
    if(!i) return;
    if(states[i].done && states[i - 1].done) svg += '<path class="trail" stroke="' + stageOf(p.s).c + '" d="' + seg(pts[i - 1], p) + '"/>';
  });
  /* stage signs */
  var seen = {}, placed = [];
  pts.forEach(function(p){
    if(seen[p.s.stage]) return; seen[p.s.stage] = 1;
    var st = stageOf(p.s), txt = (p.s.stage + 1) + " " + st.n, tw = Math.min(W - 20, txt.length * 7.3 + 22);
    var x = Math.max(10 + tw / 2, Math.min(W - 10 - tw / 2, p.x)), y = p.y - 64;
    placed.forEach(function(q){ if(q.r === p.r && q.y === y && Math.abs(q.x - x) < (q.w + tw) / 2 + 6) y -= 26; });
    placed.push({ r: p.r, x: x, y: y, w: tw });
    svg += '<g class="' + (anim ? 'pop' : '') + '" style="animation-delay:' + (p.s.stage * .12) + 's"><rect x="' + (x - tw / 2) + '" y="' + y + '" width="' + tw + '" height="22" rx="11" fill="' + st.c + '"/>' +
      '<text class="sign" x="' + x + '" y="' + (y + 15) + '" text-anchor="middle">' + esc(txt) + '</text></g>';
  });
  /* stops */
  pts.forEach(function(p, i){
    var s = p.s, st = states[i], c = stageOf(s).c, cur = nx && nx.id === s.id;
    var words = s.n.replace("Celebration: ", "").split(" "), l1 = "", l2 = "";
    words.forEach(function(w){ if((l1 + " " + w).trim().length <= 14 && !l2) l1 = (l1 + " " + w).trim(); else l2 = (l2 + " " + w).trim(); });
    if(l2.length > 16) l2 = l2.slice(0, 15) + ".";
    svg += '<g class="stop" tabindex="0" role="button" data-id="' + s.id + '" aria-label="' + esc(s.n) + (st.done ? ", stamped" : st.started ? ", started" : "") + '" transform="translate(' + p.x + ' ' + p.y + ')">' +
      '<g class="face' + (anim ? ' pop' : '') + '" style="animation-delay:' + (.3 + i * .05) + 's">' +
      (cur ? '<circle class="pulse" r="30"/>' : '') +
      (wk.indexOf(s.id) >= 0 && !st.done ? '<circle class="wk" r="36"/>' : '') +
      '<circle class="ring" r="28" fill="' + (st.done ? c : "#fffdf8") + '" stroke="' + (st.done ? "#0a2f38" : c) + '" stroke-width="' + (st.done ? 3 : 5) + '"' + (s.optional && !st.done ? ' stroke-dasharray="6 5"' : '') + '/>' +
      (st.started && !st.done ? '<path d="M0 -28A28 28 0 0 1 28 0" fill="none" stroke="' + c + '" stroke-width="9"/>' : '') +
      '<g transform="translate(-13 -13) scale(1.08)" fill="none" stroke="' + (st.done ? "#fff" : "#0a2f38") + '" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="' + I[s.id] + '"/></g>' +
      (st.done ? '<g transform="translate(20 -20) rotate(-12)"><circle r="12" fill="#fffdf8" stroke="#0a2f38" stroke-width="2.5"/><path d="M-5 0l3.5 3.5L5.5-4" fill="none" stroke="' + c + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>' : '') +
      (jayNew(s.id) ? '<g transform="translate(-22 -20)"><circle r="11" fill="#00708f" stroke="#0a2f38" stroke-width="2"/><path d="M-5 5l1-3 6-6 2 2-6 6z" fill="#fff"/></g>' : '') +
      (st.pages > 1 ? '<g transform="translate(22 20)"><circle r="10" fill="#0a2f38"/><text x="0" y="4" text-anchor="middle" style="font:800 11px Archivo,sans-serif;fill:#fff">' + st.pages + '</text></g>' : '') +
      '</g>' +
      '<text class="lbl" y="46" text-anchor="middle">' + esc(l1) + '</text>' + (l2 ? '<text class="lbl" y="61" text-anchor="middle">' + esc(l2) + '</text>' : '') +
      (s.optional ? '<text class="opt" y="' + (l2 ? 75 : 60) + '" text-anchor="middle">optional</text>' : '') +
      '</g>';
  });
  /* the time pod sits by the next stop (or the last one) */
  var at = nx ? pts.filter(function(p){ return p.s.id === nx.id; })[0] : pts[pts.length - 1];
  var from = lastPod || at;
  svg += '<g class="pod" id="pbPod" style="cursor:pointer" transform="translate(' + (from.x + 34) + ' ' + (from.y - 34) + ')">' + POD + '</g>';
  svg += '</svg>';
  box.innerHTML = svg;
  if(from !== at) setTimeout(function(){ var pod = $("pbPod"); if(pod) pod.setAttribute("transform", "translate(" + (at.x + 34) + " " + (at.y - 34) + ")"); }, 650);
  lastPod = at;
  box.onclick = function(e){
    if(e.target.closest("#pbPod")){
      podTaps++;
      if(podTaps % 5 === 0) bonnie();
      return;
    }
    var g = e.target.closest(".stop"); if(g) openStep(g.dataset.id);
  };
  box.onkeydown = function(e){ var g = e.target.closest(".stop"); if(g && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); openStep(g.dataset.id); } };
}
var reMap = debounce(function(){ if(view.at === "map" && $("pbMap")) drawRoute(nextStep()); }, 200);
window.addEventListener("resize", reMap);

/* ==========================================================
   Student: one step, one card at a time
   ========================================================== */
function openStep(id, pg, idx){
  var s = BY[id]; if(!s) return;
  var pages = id === "cover" ? 1 : pagesOf(id);
  if(!pg){
    /* open the first page not stamped yet, else the last one */
    pg = pages;
    for(var i = 1; i <= pages; i++){ if(!getDone(id, i)){ pg = i; break; } }
  }
  if(idx == null){
    /* start at the first card with nothing on it */
    idx = 0;
    var ctx0 = { step: id, pg: pg };
    for(var j = 0; j < s.cards.length; j++){ if(!cardHasWork(s.cards[j], ctx0)){ idx = j; break; } if(j === s.cards.length - 1) idx = s.cards.length; }
    if(getDone(id, pg) || jayNew(id)) idx = 0;
  }
  view = { at: "step", id: id, pg: pg, idx: idx, all: false };
  if(!STAFF) markSeen(id);
  drawStep("r");
}
function drawStep(dir){
  var s = BY[view.id], st = stageOf(s), pages = s.id === "cover" ? 1 : pagesOf(s.id), ctx = { step: s.id, pg: view.pg };
  var jb = s.id === "cover" ? {} : jayBits(s.id, view.pg), done = s.id === "cover" ? null : getDone(s.id, view.pg);
  var h = (PEN === "j" && !STAFF ? '<div class="pb-penline">Jay\'s pen is on: anything written now shows as Jay\'s</div>' : '') +
    '<div class="pb-step" style="--sc:' + st.c + '">' +
    '<div class="pb-head"><button type="button" class="pb-btn small" id="pbBack">' + BACK + 'Map</button>' +
    '<span class="pb-sticon">' + icon(s.id) + '</span><div class="tt"><span>' + (s.stage >= 0 ? esc(st.half) + " &middot; " + esc(st.n) : "Your book") + (s.optional ? " &middot; optional" : "") + '</span><h1>' + esc(s.n) + '</h1></div>' +
    '<span class="pb-saved" aria-live="polite"></span></div>';
  if(pages > 1) h += '<div class="pb-pages" role="group" aria-label="Pages">' + Array.apply(null, Array(pages)).map(function(_, i){ return '<button type="button" data-pg="' + (i + 1) + '" aria-pressed="' + (view.pg === i + 1) + '">Page ' + (i + 1) + (getDone(s.id, i + 1) ? " &#10003;" : "") + '</button>'; }).join("") + '</div>';
  if(jb.sticky && jb.sticky.v) h += '<div class="pb-sticky' + (jayNew(s.id) ? " new" : "") + '"><b>A note from Jay</b>' + esc(jb.sticky.v) + '</div>';
  h += '<div class="pb-deck" id="pbDeck"></div>';
  h += '<div class="pb-nav" id="pbNav"></div>';
  if(s.id !== "cover" && jb.pillars && jb.pillars.v && jb.pillars.v.length){
    var pil = (jb.pillars && jb.pillars.v) || [];
    h += '<div class="pb-keys" aria-label="What this page counts towards">' + PILLARS.map(function(p){ return '<i title="' + esc(p[1]) + '" class="' + (pil.indexOf(p[0]) >= 0 ? "on" : "") + '" style="background:' + p[2] + '"></i>'; }).join("") +
      (pil.length ? '<span>Counts towards: ' + esc(PILLARS.filter(function(p){ return pil.indexOf(p[0]) >= 0; }).map(function(p){ return p[1]; }).join(", ")) + '</span>' : '') + '</div>';
  }
  h += '</div>';
  root.innerHTML = h;
  $("pbBack").onclick = function(){ drawMap(); };
  [].forEach.call(root.querySelectorAll("[data-pg]"), function(b){ b.onclick = function(){ openStep(s.id, +b.dataset.pg); }; });
  var deck = $("pbDeck"), nav = $("pbNav");
  if(view.all){
    deck.className = "pb-deck pb-all";
    s.cards.forEach(function(c){ deck.appendChild(cardEl(c, ctx, true)); });
    nav.innerHTML = '<span class="pb-dots"></span><button type="button" class="pb-btn quiet" id="pbOne">One at a time</button>' + (s.id === "cover" ? '<button type="button" class="pb-btn main" id="pbDone">Done' + NEXT + '</button>' : '<button type="button" class="pb-btn main" id="pbToStamp">Stamp it' + NEXT + '</button>');
    $("pbOne").onclick = function(){ view.all = false; view.idx = 0; drawStep("r"); };
    if($("pbDone")) $("pbDone").onclick = function(){ drawMap(); };
    if($("pbToStamp")) $("pbToStamp").onclick = function(){ view.all = false; view.idx = s.cards.length; drawStep("r"); };
    window.scrollTo(0, 0);
    return;
  }
  var n = s.cards.length, idx = Math.max(0, Math.min(view.idx, s.id === "cover" ? n - 1 : n));
  view.idx = idx;
  if(idx < n){
    var c = cardEl(s.cards[idx], ctx, false);
    c.classList.add(dir === "l" ? "in-l" : "in-r");
    deck.appendChild(c);
  } else {
    deck.appendChild(stampCard(s, done));
  }
  var dots = '<span class="pb-dots">' + s.cards.map(function(cd, i){ return '<button type="button" data-go="' + i + '" class="' + (i === idx ? "on" : "") + (cardHasWork(cd, ctx) ? " has" : "") + '" aria-label="Card ' + (i + 1) + ': ' + esc(cd.label) + '"></button>'; }).join("") + '</span>';
  var last = s.id === "cover" ? idx === n - 1 : idx === n;
  nav.innerHTML = dots +
    (idx > 0 ? '<button type="button" class="pb-btn quiet" id="pbPrev">' + BACK + 'Back</button>' : '') +
    (n > 1 ? '<button type="button" class="pb-btn quiet" id="pbAllBtn">See it all</button>' : '') +
    (!last ? (idx < n && !cardHasWork(s.cards[idx], ctx) ? '<button type="button" class="pb-btn quiet" id="pbSkip">Skip this one</button>' : '') + '<button type="button" class="pb-btn main" id="pbNext">' + (idx === n - 1 ? "Nearly there" : "Next") + NEXT + '</button>'
           : (s.id === "cover" ? '<button type="button" class="pb-btn main" id="pbDone">Looks good' + NEXT + '</button>' : ''));
  [].forEach.call(nav.querySelectorAll("[data-go]"), function(b){ b.onclick = function(){ var to = +b.dataset.go; var d = to < view.idx ? "l" : "r"; view.idx = to; drawStep(d); }; });
  if($("pbPrev")) $("pbPrev").onclick = function(){ view.idx--; drawStep("l"); };
  if($("pbNext")) $("pbNext").onclick = function(){ view.idx++; drawStep("r"); };
  if($("pbSkip")) $("pbSkip").onclick = function(){ view.idx++; drawStep("r"); };
  if($("pbAllBtn")) $("pbAllBtn").onclick = function(){ view.all = true; drawStep("r"); };
  if($("pbDone")) $("pbDone").onclick = function(){ drawMap(); };
  var first = deck.querySelector("input.pb-in, textarea.pb-ta");
  if(first && !("ontouchstart" in window)){ try{ first.focus({ preventScroll: true }); }catch(e){} }
}
function stampCard(s, done){
  var c = el("div", "pb-card pb-stampcard"), any = pageHasWork(s.id, view.pg);
  if(done){
    c.innerHTML = '<div class="big">' + icon(s.id) + '</div><h2>This page is stamped</h2><span class="pb-stamped">' + esc(done.w || "Stamped") + '</span>' +
      '<p class="hint">' + (done.by === "j" ? "Jay stamped it on " : "Stamped on ") + esc(niceDate(done.t)) + '. You can still change anything on it.</p>' +
      '<div class="row"><button type="button" class="pb-btn main" id="pbMapBtn">Back to the map' + NEXT + '</button>' +
      '<button type="button" class="pb-btn" id="pbMore">Start another page</button>' +
      '<button type="button" class="pb-btn quiet" id="pbUnstamp">Take the stamp off</button></div>';
  } else {
    c.innerHTML = '<div class="big">' + icon(s.id) + '</div><h2>' + (any ? "That's this page." : "Nothing on this page yet, and that's fine.") + '</h2>' +
      '<p class="hint">' + (any ? "Stamp it whenever it feels done enough. You can still change it after." : "Come back to it any time, or stamp it if you did it another way (on paper, out loud, with Jay).") + '</p>' +
      '<div class="row"><button type="button" class="pb-btn main" id="pbStamp">Stamp it!</button><button type="button" class="pb-btn quiet" id="pbLater">Not yet, back to the map</button></div>';
  }
  setTimeout(function(){
    if($("pbStamp")) $("pbStamp").onclick = function(){
      var word = STAMPS[Math.floor(Math.random() * STAMPS.length)];
      if(stampedList().length === ROUTE.length - 1 && !getDone(s.id, view.pg)) word = "Book complete!";
      setDone(s.id, view.pg, true, word);
      stampFx(word, stageOf(s).c);
      stampNote(s, view.pg);
      if(word === "Book complete!") setTimeout(bonnie, 700);
      setTimeout(function(){ drawMap(); }, 1300);
    };
    if($("pbLater")) $("pbLater").onclick = function(){ drawMap(); };
    if($("pbMapBtn")) $("pbMapBtn").onclick = function(){ drawMap(); };
    if($("pbUnstamp")) $("pbUnstamp").onclick = function(){ setDone(s.id, view.pg, false); drawStep("r"); };
    if($("pbMore")) $("pbMore").onclick = function(){
      var np = pagesOf(s.id) + 1;
      /* a page only counts once something is on it, so write a small marker */
      var p = page(PEN, s.id, np); p.t = now(); p.made = p.t; wj(kPage(PEN, s.id, np), p);
      openStep(s.id, np, 0);
    };
  }, 0);
  return c;
}

/* a stamp goes to BridgeLink Buddy as a Learning note, through the Base 5
   sheet (its "activity" action: one Evidence row per step per day, and a
   note in Buddy when "Evidence to Buddy" is on). Only the student's own
   school sign in counts, so staff and guests are skipped by the sheet. */
function stampNote(s, pg){
  if(STAFF || S.guest || PEN === "j" || !S.call) return;
  var bits = [];
  s.cards.forEach(function(c){ var t = cardText(c, { step: s.id, pg: pg }); if(t) bits.push(c.label + ": " + t.replace(/^- /gm, "").replace(/\n/g, "; ")); });
  var line = (bits.join(". ") || "Stamped without writing (done another way).").slice(0, 290);
  S.call("activity", { slug: "game-pb-" + s.id, title: "Project book: " + s.n, subject: "Project", secs: 60, line: line, made: "Stamped " + s.n + " in the project book" }).catch(function(){});
}

/* the whole book as plain text, for Send to Jay */
function itemText(card, it){
  var v = it.v;
  if(card.t === "qa") return (v.q || "") + (v.a ? " - " + v.a : "");
  if(card.t === "rubric") return (v.c || "") + (v.d ? ": " + v.d : "");
  if(card.t === "links") return (v.title || (v.ph ? "A photo" : "Link")) + (v.url ? " (" + v.url + ")" : "") + (v.ph && v.title ? " (photo)" : "");
  if(card.t === "log") return niceDate(v.d) + ": " + (v.f || "");
  if(card.t === "web") return v.text || "";
  return typeof v === "string" ? v : "";
}
function cardText(card, ctx){
  var s = ctx.step, p = ctx.pg;
  if(card.t === "sketch"){ var d = getDraw(s, p, card.id).v, l = getF(s, p, card.id + "_link").v, ph = photoSrc(getF(s, p, card.id + "_ph").v); return [d ? "(a drawing)" : "", ph ? "(a photo)" : "", l || ""].filter(Boolean).join(" "); }
  if(["list", "qa", "rubric", "links", "log", "cues", "web"].indexOf(card.t) >= 0) return getC(s, p, card.id).map(function(it){ return "- " + itemText(card, it) + (it.by === "j" ? " [Jay]" : ""); }).join("\n");
  if(card.t === "stamps") return "";
  var g = getF(s, p, card.id), v = g.v;
  if(card.t === "faces") v = v == null ? "" : FACES[v];
  if(card.t === "days") v = Array.isArray(v) ? v.map(function(i){ return ["Mon", "Tue", "Wed", "Thu", "Fri"][i]; }).join(", ") : "";
  if(card.t === "cover") return "";
  var n = card.note ? getF(s, p, card.id + "_n").v : "";
  return (v == null ? "" : String(v)) + (g.by === "j" && hasVal(v) ? " [Jay]" : "") + (n ? " (" + n + ")" : "");
}
function bookText(){
  var L = [WHO + "'s project book - " + TERM, "Driving question: " + dq(), "Title: " + (getF("cover", 1, "title").v || "(none yet)"), ""];
  ROUTE.forEach(function(s){
    var n = pagesOf(s.id);
    for(var p = 1; p <= n; p++){
      if(!pageHasWork(s.id, p) && !getDone(s.id, p)) continue;
      L.push("== " + s.n + (n > 1 ? " (page " + p + ")" : "") + (getDone(s.id, p) ? " [stamped]" : "") + " ==");
      s.cards.forEach(function(c){ var t = cardText(c, { step: s.id, pg: p }); if(t) L.push(c.label + ": " + t); });
      L.push("");
    }
  });
  return L.join("\n");
}

/* ==========================================================
   Print: the book laid out like the paper one, filled in or blank
   ========================================================== */
function printBox(card, ctx, blank){
  var s = ctx.step, p = ctx.pg, wide = ["web", "sketch", "log", "rubric", "links", "cues", "qa"].indexOf(card.t) >= 0, inner = "";
  if(blank){
    inner = card.t === "faces" ? '<div class="facesp">' + FACES.map(function(f){ return '<span>' + f + '</span>'; }).join("") + '</div>' :
      card.t === "pick" ? '<div class="facesp" style="flex-wrap:wrap">' + card.opts.map(function(f){ return '<span>' + esc(f) + '</span>'; }).join("") + '</div>' :
      card.t === "days" ? '<div class="facesp">' + ["Mon", "Tue", "Wed", "Thu", "Fri"].map(function(f){ return '<span>' + f + '</span>'; }).join("") + '</div>' :
      card.t === "dq" ? '<p><b>' + esc(dq()) + '</b></p><div class="lines"></div>' :
      '<div class="lines"' + (wide ? ' style="height:46mm"' : '') + '></div>';
  } else if(card.t === "sketch"){
    var d = getDraw(s, p, card.id), lk = getF(s, p, card.id + "_link").v, phs = photoSrc(getF(s, p, card.id + "_ph").v);
    inner = (phs ? '<img alt="" src="' + phs + '">' : "") + (d.v ? skSvg(d.v) : "") + (lk ? '<p>' + esc(lk) + '</p>' : "");
    if(!inner) inner = '<div class="lines" style="height:46mm"></div>';
  } else if(card.t === "web"){
    var its = getC(s, p, card.id);
    inner = !its.length ? '<div class="lines" style="height:46mm"></div>' : '<svg class="sk" viewBox="0 0 600 300"><circle cx="300" cy="150" r="22" fill="#ffd23f" stroke="#0a2f38" stroke-width="2"/>' + its.map(function(it){
      var v = it.v || {}, x = (+v.x || .5) * 600, y = (+v.y || .5) * 300;
      return '<line x1="300" y1="150" x2="' + x + '" y2="' + y + '" stroke="#0a2f38" stroke-opacity=".3" stroke-dasharray="4 4"/>' +
        '<text x="' + x + '" y="' + y + '" text-anchor="middle" style="font:700 13px Atkinson Hyperlegible,sans-serif;fill:' + (it.by === "j" ? "#00708f" : "#0a2f38") + '">' + esc(String(v.text || "").slice(0, 34)) + '</text>';
    }).join("") + '</svg>';
  } else if(card.t === "faces"){
    var fv = getF(s, p, card.id).v;
    inner = '<div class="facesp">' + FACES.map(function(f, i){ return '<span class="' + (fv === i ? "on" : "") + '">' + f + '</span>'; }).join("") + '</div>';
    var fn = card.note ? getF(s, p, card.id + "_n").v : ""; if(fn) inner += '<p>' + esc(fn) + '</p>';
  } else if(card.t === "pick"){
    var pv = getF(s, p, card.id);
    inner = '<div class="facesp" style="flex-wrap:wrap">' + card.opts.map(function(f){ return '<span class="' + (pv.v === f ? "on" : "") + '">' + esc(f) + '</span>'; }).join("") + '</div>';
    var pn = card.note ? getF(s, p, card.id + "_n") : null; if(pn && pn.v) inner += '<p class="' + (pn.by === "j" ? "j" : "") + '">' + esc(pn.v) + '</p>';
  } else if(card.t === "stamps"){
    inner = '<p>' + esc(stampedList().map(function(id){ return BY[id].n; }).join(", ") || "None yet") + '</p>';
  } else if(card.t === "dq"){
    var dg = getF(s, p, card.id);
    inner = '<p><b>' + esc(dq()) + '</b></p>' + (dg.v ? '<p class="' + (dg.by === "j" ? "j" : "") + '">' + esc(dg.v) + '</p>' : "");
  } else if(card.t === "links"){
    var lks = getC(s, p, card.id);
    inner = lks.map(function(it){ var src = photoSrc(it.v); return src ? '<img alt="" src="' + src + '">' : ""; }).join("") +
      (lks.length ? '<ul>' + lks.map(function(it){ return '<li class="' + (it.by === "j" ? "j" : "") + '">' + esc(itemText(card, it)) + '</li>'; }).join("") + '</ul>' : "");
  } else if(["list", "qa", "rubric", "log", "cues"].indexOf(card.t) >= 0){
    var li = getC(s, p, card.id);
    inner = li.length ? '<ul>' + li.map(function(it){ return '<li class="' + (it.by === "j" ? "j" : "") + '">' + esc(itemText(card, it)) + '</li>'; }).join("") + '</ul>' : "";
  } else if(card.t === "days"){
    var dv = getF(s, p, card.id).v || [];
    inner = '<div class="facesp">' + ["Mon", "Tue", "Wed", "Thu", "Fri"].map(function(f, i){ return '<span class="' + (dv.indexOf(i) >= 0 ? "on" : "") + '">' + f + '</span>'; }).join("") + '</div>';
  } else {
    var g = getF(s, p, card.id);
    inner = g.v != null && g.v !== "" ? '<p class="' + (g.by === "j" ? "j" : "") + '">' + esc(card.t === "date" ? niceDate(g.v) : g.v) + '</p>' : "";
  }
  return '<div class="bx' + (wide ? " wide" : "") + '"><h4>' + esc(card.label) + '</h4>' + inner + '</div>';
}
function printBook(opt){
  opt = opt || {};
  var out = $("pbPrint"); if(!out){ out = el("div"); out.id = "pbPrint"; document.body.appendChild(out); }
  var look = getF("cover", 1, "look").v || {}, h = "";
  h += '<section class="pp coverp" style="--sc:' + (COVERS[look.c] || COVERS[0]) + '"><h1>' + esc(opt.blank ? "Enterprise Learning Project" : (getF("cover", 1, "title").v || "Enterprise Learning Project")) + '</h1>' +
    '<p>Name: ' + esc(WHO) + '</p><p>Term: ' + esc(TERM) + '</p><p>Driving Question: ' + esc(dq()) + '</p></section>';
  ROUTE.forEach(function(s){
    var n = opt.blank ? 1 : pagesOf(s.id), st = stageOf(s);
    for(var p = 1; p <= n; p++){
      if(!opt.blank && opt.onlyWork && !pageHasWork(s.id, p) && !getDone(s.id, p)) continue;
      var ctx = { step: s.id, pg: p }, done = opt.blank ? null : getDone(s.id, p), jb = jayBits(s.id, p), pil = (!opt.blank && jb.pillars && jb.pillars.v) || [];
      h += '<section class="pp" style="--sc:' + st.c + '"><div class="ph">' + icon(s.id) + '<h2>' + esc(s.n) + (n > 1 ? ' <small>page ' + p + '</small>' : '') + '</h2><small>' + esc(st.n) + '</small>' + (done ? '<span class="stampmark">' + esc(done.w || "Stamped") + '</span>' : '') + '</div>' +
        '<div class="grid">' + s.cards.map(function(c){ return printBox(c, ctx, opt.blank); }).join("") + '</div>' +
        '<div class="pf">' + PILLARS.map(function(pp){ return '<i class="' + (pil.indexOf(pp[0]) >= 0 ? "on" : "") + '" style="background:' + pp[2] + '" title="' + esc(pp[1]) + '"></i>'; }).join("") +
        (opt.staff ? '<div class="sup"><b>Engagement and support</b>' + esc(opt.blank ? "" : supportText(s.id, p)) + '</div>' : '') + '</div></section>';
    }
  });
  out.className = "";
  out.innerHTML = h;
  pageSize("A4 landscape", "9mm");
  document.body.classList.add("pb-printing");
  var done = function(){ document.body.classList.remove("pb-printing"); window.removeEventListener("afterprint", done); };
  window.addEventListener("afterprint", done);
  setTimeout(function(){ window.print(); setTimeout(done, 1500); }, 120);
}
function pageSize(size, margin){
  var st = $("pbPageSize"); if(!st){ st = el("style"); st.id = "pbPageSize"; document.head.appendChild(st); }
  st.textContent = "@media print{@page{size:" + size + ";margin:" + margin + "}}";
}
/* the finished book as an A5 booklet: their cover, their answer, every
   page with something on it, and the stamp collection at the back */
function printBooklet(){
  var out = $("pbPrint"); if(!out){ out = el("div"); out.id = "pbPrint"; document.body.appendChild(out); }
  var look = getF("cover", 1, "look").v || {}, title = getF("cover", 1, "title").v || "My project", cv = COVERS[look.c] || COVERS[0];
  var st = Array.isArray(look.s) ? look.s.slice(0, 3) : [], spots = [["10mm", "10mm", "auto", "auto", "-10deg"], ["auto", "auto", "14mm", "10mm", "12deg"], ["auto", "12mm", "40mm", "auto", "-6deg"]];
  var h = '<section class="bp"><div class="bcov" style="--cv:' + cv + '">' + st.map(function(n, i){ var s = spots[i]; return '<span class="stk" style="top:' + s[0] + ';right:' + s[1] + ';bottom:' + s[2] + ';left:' + s[3] + ';transform:rotate(' + s[4] + ')">' + stickerSvg(n) + '</span>'; }).join("") +
    '<h1>' + esc(title) + '</h1><p>' + esc(dq()) + '</p><p>Enterprise Learning Project &middot; ' + esc(TERM) + '</p><p class="by">by ' + esc(WHO) + '</p></div></section>';
  var ans = getF("answer", 1, "answer"), because = getF("answer", 1, "answer_n").v;
  if(hasVal(ans.v)) h += '<section class="bp"><div class="band" style="--sc:#0a2f38">' + icon("answer") + '<h2>My answer</h2></div><p class="it" style="font-size:12pt">' + esc(dq()) + '</p><p class="quote">' + esc(ans.v) + (because ? '. ' + esc(String(because).charAt(0).toUpperCase() + String(because).slice(1)) : '') + '</p></section>';
  ROUTE.forEach(function(s){
    var n = pagesOf(s.id), sc = stageOf(s).c;
    for(var p = 1; p <= n; p++){
      if(!pageHasWork(s.id, p)) continue;
      var ctx = { step: s.id, pg: p }, items = "";
      s.cards.forEach(function(c){
        if(c.t === "stamps") return;
        var inner = "";
        if(c.t === "sketch"){ var d = getDraw(s.id, p, c.id).v, ph = photoSrc(getF(s.id, p, c.id + "_ph").v); inner = (ph ? '<img alt="" src="' + ph + '">' : "") + (d ? skSvg(d) : ""); }
        else if(c.t === "web" || c.t === "faces" || c.t === "pick" || c.t === "days" || c.t === "dq"){ var bx = printBox(c, ctx, false); inner = bx.replace(/^<div class="bx[^"]*"><h4>[\s\S]*?<\/h4>/, "").replace(/<\/div>$/, ""); if(c.t !== "dq" && !cardHasWork(c, ctx)) inner = ""; if(c.t === "dq" && !hasVal(getF(s.id, p, c.id).v)) inner = ""; }
        else if(c.t === "links"){ var L = getC(s.id, p, c.id); inner = L.map(function(it){ var src = photoSrc(it.v); return src ? '<img alt="" src="' + src + '">' : ""; }).join("") + L.filter(function(it){ return (it.v || {}).title || (it.v || {}).url; }).map(function(it){ return '<p>' + esc(itemText(c, it)) + '</p>'; }).join(""); }
        else if(["list", "qa", "rubric", "log", "cues"].indexOf(c.t) >= 0){ var L2 = getC(s.id, p, c.id); inner = L2.length ? '<ul>' + L2.map(function(it){ return '<li class="' + (it.by === "j" ? "j" : "") + '">' + esc(itemText(c, it)) + '</li>'; }).join("") + '</ul>' : ""; }
        else if(c.t !== "cover"){ var g = getF(s.id, p, c.id); inner = hasVal(g.v) ? '<p class="' + (g.by === "j" ? "j" : "") + '">' + esc(c.t === "date" ? niceDate(g.v) : g.v) + '</p>' : ""; }
        if(inner) items += '<div class="it"><h4>' + esc(c.label) + '</h4>' + inner + '</div>';
      });
      if(!items) continue;
      h += '<section class="bp" style="--sc:' + sc + '"><div class="band">' + icon(s.id) + '<h2>' + esc(s.n) + '</h2><small>' + esc(stageOf(s).n) + '</small></div>' + items + '</section>';
    }
  });
  var list = stampedList();
  h += '<section class="bp"><div class="band" style="--sc:#ef7724">' + icon("review") + '<h2>My stamp collection</h2></div><p class="it" style="font-size:12pt">' + list.length + ' of ' + ROUTE.length + ' steps stamped.</p><div class="stampsgrid">' +
    ROUTE.map(function(s){ var on = list.indexOf(s.id) >= 0; return '<div style="--c:' + stageOf(s).c + '"><i class="' + (on ? "on" : "") + '">' + icon(s.id) + '</i>' + esc(s.n) + '</div>'; }).join("") + '</div></section>';
  out.className = "bk";
  out.innerHTML = h;
  pageSize("A5 portrait", "10mm");
  document.body.classList.add("pb-printing");
  var done = function(){ document.body.classList.remove("pb-printing"); window.removeEventListener("afterprint", done); };
  window.addEventListener("afterprint", done);
  setTimeout(function(){ window.print(); setTimeout(done, 1500); }, 150);
}
function supportText(step, pg){
  var v = rj(kSup(step, pg)); if(!v) return "";
  return [(v.chips || []).join(", "), v.text || ""].filter(Boolean).join(". ");
}

/* ==========================================================
   Jay's pen on a student's device
   ========================================================== */
function penButton(){
  if(STAFF || S.guest) return;
  var b = el("button", "pb-pen" + (PEN === "j" ? " on" : ""), PEN_SVG + (PEN === "j" ? '<span>Jay\'s pen on</span>' : ''));
  b.title = PEN === "j" ? "Turn Jay's pen off" : "Jay's pen";
  b.type = "button"; b.setAttribute("aria-label", PEN === "j" ? "Turn Jay's pen off" : "Jay's pen: for Jay to write in this book");
  document.body.appendChild(b);
  b.onclick = function(){
    if(PEN === "j"){ setPen("s"); return; }
    var box = document.querySelector(".pb-penbox");
    if(box){ box.remove(); return; }
    box = el("div", "pb-penbox", '<p><b>Jay\'s pen</b> is for Jay writing in this book, so it shows as Jay\'s writing.</p><p id="pbPenMsg">Checking...</p>');
    document.body.appendChild(box);
    var msg = box.querySelector("#pbPenMsg");
    function askPass(){
      msg.innerHTML = 'Staff passphrase:';
      var inp = el("input"); inp.type = "password"; inp.autocomplete = "off"; inp.setAttribute("aria-label", "Staff passphrase");
      var go = el("button", "pb-btn small", "Pen on"); go.type = "button";
      var no = el("button", "pb-btn small quiet", "Cancel"); no.type = "button"; no.style.marginLeft = "6px";
      box.appendChild(inp); box.appendChild(go); box.appendChild(no);
      no.onclick = function(){ box.remove(); };
      function check(){
        msg.textContent = "Checking...";
        loadScript("/data/b5keys.js?v=1", function(){ return !!window.B5KEYS; })
          .then(function(){ return loadScript("/data/b5lock.js?v=1", function(){ return !!window.B5Lock; }); })
          .then(function(){ return window.B5Lock && B5Lock.checkStaff ? B5Lock.checkStaff(inp.value) : false; })
          .then(function(ok){ if(ok){ box.remove(); setPen("j"); } else { msg.textContent = "That did not match."; inp.value = ""; inp.focus(); } });
      }
      go.onclick = check;
      inp.addEventListener("keydown", function(e){ if(e.key === "Enter") check(); });
      inp.focus();
    }
    if(S.call) S.call("whoami").then(function(o){ if(o && o.staff){ box.remove(); setPen("j"); } else askPass(); }, askPass);
    else askPass();
  };
}
function setPen(p){
  PEN = p;
  try{ if(p === "j") sessionStorage.setItem("b5.pb.pen", "j"); else sessionStorage.removeItem("b5.pb.pen"); }catch(e){}
  var b = document.querySelector(".pb-pen"); if(b) b.remove();
  penButton();
  if(view.at === "step") drawStep("r"); else drawMap();
}
function loadScript(src, test){
  if(test()) return Promise.resolve();
  return new Promise(function(r){ var s = document.createElement("script"); s.src = src; s.onload = s.onerror = function(){ r(); }; document.head.appendChild(s); });
}

/* ==========================================================
   Staff: every book, and writing in any of them
   ========================================================== */
var ALL = {};   /* who -> { key: string } loaded from the sheet */
var staffSel = { step: "intro", pg: 1 };
function staffMount(){
  mount();
  root.innerHTML =
    '<div class="pb-top" style="grid-template-columns:1fr"><div><span class="pb-kick">Staff</span><h1>Project books</h1>' +
    '<p class="pb-small" style="max-width:760px">Every student\'s ELP workbook. Write on any page and it lands in their book, in your pen colour with a Jay tag. Tag the pillars, keep an engagement and support note (only staff ever see those), leave a sticky note, or stamp a page for them.</p>' +
    '<p class="pb-small" id="pbStatus" style="font-weight:700;opacity:1">Opening the books...</p></div></div>' +
    '<div id="pbCohort"></div><div id="pbStaff"></div>';
  statusEl = $("pbStatus");
  var pend = Object.keys(PENDING).filter(function(w){ return Object.keys(PENDING[w] || {}).length; });
  if(pend.length) push();
  loadAll();
}
function loadOne(who){
  if(!S.call) return Promise.reject(new Error("off"));
  return S.call("load", { who: who, since: 0 }).then(function(o){
    if(!o || !o.ok) throw new Error((o && o.error) || "no answer");
    var m = {}, pre = PREFIX[who] + "pb.", sup = "pbsup." + who + ".";
    Object.keys(o.items || {}).forEach(function(k){ if(k.indexOf(pre) === 0 || k.indexOf(sup) === 0) m[k] = o.items[k].v; });
    /* anything still waiting to go up from this laptop wins */
    var q = PENDING[who] || {}; Object.keys(q).forEach(function(k){ m[k] = q[k].v; });
    ALL[who] = m;
  });
}
function loadAll(){
  staffStatus("Opening the books...");
  var i = 0, fails = 0, keep = WHO;
  (function next(){
    if(i >= WHOS.length){
      staffStatus(fails ? "Some books could not be opened just now. Try Refresh in a moment." : "All six books are open. Pick a student.", !!fails);
      drawCohort(); pickStudent(keep || WHOS[0]);
      return;
    }
    var w = WHOS[i++];
    loadOne(w).catch(function(){ fails++; if(!ALL[w]) ALL[w] = {}; }).then(next);
  })();
}
function useStudent(w){ WHO = w; P = PREFIX[w]; MEM = ALL[w] || (ALL[w] = {}); }
function drawCohort(){
  var keep = WHO, h = '<div class="pb-card" style="--sc:#007291;padding:16px 18px;margin:6px 0 18px"><span class="lab">Where everyone is</span><div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:.9rem;min-width:760px">' +
    '<tr><th></th>' + ROUTE.map(function(s){ return '<th title="' + esc(s.n) + '" style="padding:2px 3px"><span style="display:inline-flex;width:26px;height:26px;border-radius:8px;background:' + stageOf(s).c + ';color:#fff;align-items:center;justify-content:center">' + icon(s.id).replace('class="pb-ic"', 'class="pb-ic" style="width:16px;height:16px"') + '</span></th>'; }).join("") + '<th style="text-align:left;padding-left:8px">Stamped</th></tr>';
  WHOS.forEach(function(w){
    useStudent(w);
    var n = 0;
    h += '<tr><th style="text-align:left;padding:4px 10px 4px 0"><button type="button" class="pb-btn small" data-who="' + w + '">' + w + '</button></th>' + ROUTE.map(function(s){
      var st = stepState(s.id); if(st.done) n++;
      return '<td style="text-align:center;padding:2px"><button type="button" data-who="' + w + '" data-step="' + s.id + '" title="' + esc(w + ": " + s.n) + '" aria-label="' + esc(w + ", " + s.n + (st.done ? ", stamped" : st.started ? ", started" : "")) + '" style="width:22px;height:22px;border-radius:50%;padding:0;border:2px solid ' + stageOf(s).c + ';background:' + (st.done ? stageOf(s).c : st.started ? "linear-gradient(90deg," + stageOf(s).c + " 50%,#fff 50%)" : "#fff") + '"></button></td>';
    }).join("") + '<td style="padding-left:8px;font-weight:700">' + n + ' of ' + ROUTE.length + '</td></tr>';
  });
  h += '</table></div></div>';
  $("pbCohort").innerHTML = h;
  if(keep) useStudent(keep);
  $("pbCohort").onclick = function(e){
    var b = e.target.closest("[data-who]"); if(!b) return;
    if(b.dataset.step){ staffSel = { step: b.dataset.step, pg: 1 }; }
    pickStudent(b.dataset.who);
    var t = $("pbStaff"); if(t) t.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
  };
}
function pickStudent(w){ useStudent(w); drawStaff(); }
function drawStaff(){
  var s = BY[staffSel.step] || ROUTE[0], st = stageOf(s), pages = s.id === "cover" ? 1 : pagesOf(s.id);
  if(staffSel.pg > pages) staffSel.pg = pages;
  var ctx = { step: s.id, pg: staffSel.pg };
  var h = '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 14px">' + WHOS.map(function(w){ return '<button type="button" class="pb-btn small' + (w === WHO ? " teal" : "") + '" data-pick="' + w + '" aria-pressed="' + (w === WHO) + '">' + w + '</button>'; }).join("") +
    '<span style="flex:1"></span><button type="button" class="pb-btn small quiet" id="pbRefresh">Refresh</button>' +
    '<button type="button" class="pb-btn small" id="pbPrintF">Print ' + WHO + '\'s book</button><button type="button" class="pb-btn small" id="pbPrintK">' + WHO + '\'s booklet</button><button type="button" class="pb-btn small quiet" id="pbPrintB">Print a blank book</button>' +
    '<button type="button" class="pb-btn small quiet" id="pbDqBtn">Driving question</button></div>';
  h += '<div style="display:grid;grid-template-columns:minmax(220px,280px) 1fr;gap:18px;align-items:start" class="pb-staffgrid">';
  /* the step list */
  h += '<nav aria-label="Steps" style="display:flex;flex-direction:column;gap:4px;position:sticky;top:10px;max-height:92vh;overflow:auto">' +
    [BY.cover].concat(ROUTE).map(function(x, i){
      var ss = x.id === "cover" ? { done: false, started: hasVal(getF("cover", 1, "title").v) } : stepState(x.id), c = x.stage >= 0 ? stageOf(x).c : "#0a2f38";
      var stageHead = x.stage >= 0 && (i === 1 || ROUTE[i - 2].stage !== x.stage) ? '<div style="font:800 .68rem Archivo,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:' + c + ';margin:10px 0 2px">' + esc(stageOf(x).n) + '</div>' : '';
      var jp = 0, hand = false; for(var q = 1; q <= (x.id === "cover" ? 1 : ss.pages); q++){ if(rj(kSup(x.id, q))) jp++; x.cards.forEach(function(cd){ if(getF(x.id, q, "_help_" + cd.id).v) hand = true; }); }
      return stageHead + '<button type="button" data-step="' + x.id + '" style="display:flex;align-items:center;gap:8px;text-align:left;padding:7px 10px;border-radius:12px;border:2px solid ' + (x.id === s.id ? "#0a2f38" : "transparent") + ';background:' + (x.id === s.id ? "#fff" : "transparent") + '">' +
        '<span style="width:14px;height:14px;border-radius:50%;flex:none;border:2px solid ' + c + ';background:' + (ss.done ? c : ss.started ? "linear-gradient(90deg," + c + " 50%,#fff 50%)" : "#fff") + '"></span>' +
        '<span style="flex:1;font-weight:700;font-size:.92rem">' + esc(x.n) + '</span>' + (ss.pages > 1 ? '<small>' + ss.pages + 'pp</small>' : '') + (hand ? '<small title="Asked for a hand on this page" style="background:#fff1a8;border-radius:99px;padding:0 6px">hand</small>' : '') + (jp ? '<small title="Has an engagement and support note">&#9998;</small>' : '') + '</button>';
    }).join("") + '</nav>';
  /* the page */
  h += '<div class="pb-step" style="--sc:' + (s.stage >= 0 ? st.c : "#0a2f38") + '"><div class="pb-head"><span class="pb-sticon">' + icon(s.id) + '</span><div class="tt"><span>' + esc(WHO) + "'s book" + (s.stage >= 0 ? " &middot; " + esc(st.n) : "") + '</span><h1>' + esc(s.n) + '</h1></div>' +
    '<span class="pb-saved" aria-live="polite"></span></div>';
  if(s.id !== "cover") h += '<div class="pb-pages" role="group" aria-label="Pages">' + Array.apply(null, Array(pages)).map(function(_, i){ return '<button type="button" data-pg="' + (i + 1) + '" aria-pressed="' + (staffSel.pg === i + 1) + '">Page ' + (i + 1) + (getDone(s.id, i + 1) ? " &#10003;" : "") + '</button>'; }).join("") + '<button type="button" data-newpg="1">+ Another page</button></div>';
  h += '<div id="pbJay"></div><div class="pb-deck pb-all" id="pbDeck"></div></div></div>';
  $("pbStaff").innerHTML = h;
  var deck = $("pbDeck");
  s.cards.forEach(function(c){ deck.appendChild(cardEl(c, ctx, true)); });
  if(s.id !== "cover") jayPanel(s, ctx);
  var me = $("pbStaff");
  me.onclick = function(e){
    var b = e.target.closest("button"); if(!b) return;
    if(b.dataset.pick){ pickStudent(b.dataset.pick); return; }
    if(b.dataset.step && b.closest("nav")){ staffSel = { step: b.dataset.step, pg: 1 }; drawStaff(); return; }
    if(b.dataset.pg){ staffSel.pg = +b.dataset.pg; drawStaff(); return; }
    if(b.dataset.newpg){ var np = pagesOf(s.id) + 1, pp = page("j", s.id, np); pp.t = now(); pp.made = pp.t; wj(kPage("j", s.id, np), pp); staffSel.pg = np; drawStaff(); return; }
  };
  $("pbRefresh").onclick = function(){ staffStatus("Refreshing " + WHO + "'s book..."); var w = WHO; loadOne(w).then(function(){ useStudent(w); drawCohort(); drawStaff(); staffStatus("Up to date."); }, function(){ staffStatus("Could not reach the sheet just now.", true); }); };
  $("pbPrintF").onclick = function(){ printBook({ staff: true, blank: false, onlyWork: false }); };
  $("pbPrintB").onclick = function(){ printBook({ staff: true, blank: true }); };
  $("pbPrintK").onclick = printBooklet;
  $("pbDqBtn").onclick = dqEditor;
}
var SUPPORT = ["Independently", "With a little prompting", "With adult support", "Adult scribed", "Talked it through first", "Used the starters", "Worked with Holly", "Needed a break, came back", "Chose to stop for today"];
function jayPanel(s, ctx){
  var jb = jayBits(s.id, ctx.pg), pil = (jb.pillars && jb.pillars.v) || [], sup = rj(kSup(s.id, ctx.pg)) || { chips: [], text: "" };
  var done = getDone(s.id, ctx.pg);
  var box = el("div", "pb-card");
  box.style.cssText = "margin:0 0 18px;background:#f2f8f9;box-shadow:4px 5px 0 #00708f";
  box.innerHTML = '<span class="lab">Just for you</span>' +
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px">' +
    '<div><h3 style="font-size:1rem;margin-bottom:8px">Assessment keys (pillars)</h3><div class="pb-chips" id="pbPil" style="margin:0">' + PILLARS.map(function(p){
      return '<button type="button" data-p="' + p[0] + '" aria-pressed="' + (pil.indexOf(p[0]) >= 0) + '" style="' + (pil.indexOf(p[0]) >= 0 ? "background:#0a2f38;color:#fff" : "") + '"><i style="display:inline-block;width:11px;height:11px;border-radius:50%;background:' + p[2] + ';border:1px solid #0a2f38;margin-right:6px"></i>' + esc(p[1]) + '</button>';
    }).join("") + '</div></div>' +
    '<div><h3 style="font-size:1rem;margin-bottom:8px">Engagement and support <small style="font-weight:400;opacity:.7">(staff only)</small></h3><div class="pb-chips" id="pbSupC" style="margin:0 0 8px">' + SUPPORT.map(function(c){
      return '<button type="button" data-c="' + esc(c) + '" aria-pressed="' + ((sup.chips || []).indexOf(c) >= 0) + '" style="' + ((sup.chips || []).indexOf(c) >= 0 ? "background:#0a2f38;color:#fff" : "") + '">' + esc(c) + '</button>';
    }).join("") + '</div><textarea class="pb-ta" id="pbSupT" style="min-height:70px" aria-label="Engagement and support note">' + esc(sup.text || "") + '</textarea></div>' +
    '<div><h3 style="font-size:1rem;margin-bottom:8px">A sticky note for ' + esc(WHO) + '</h3><textarea class="pb-ta" id="pbSticky" style="min-height:70px;background:#fff8c9" aria-label="Sticky note">' + esc((jb.sticky && jb.sticky.v) || "") + '</textarea>' +
    '<p class="hint" style="font-size:.88rem">Shows on this page in their book, and the map shows a pen badge until they open it.</p>' +
    '<div style="margin-top:10px">' + (done ? '<span class="pb-stamped" style="--sc:' + stageOf(s).c + '">' + esc(done.w || "Stamped") + '</span> <button type="button" class="pb-btn small quiet" id="pbUn">Take the stamp off</button>' : '<button type="button" class="pb-btn small" id="pbSt">Stamp this page for ' + esc(WHO) + '</button>') + '</div></div>' +
    '</div>';
  $("pbJay").appendChild(box);
  $("pbPil").onclick = function(e){
    var b = e.target.closest("[data-p]"); if(!b) return;
    var at = pil.indexOf(b.dataset.p); if(at >= 0) pil.splice(at, 1); else pil.push(b.dataset.p);
    setJay(s.id, ctx.pg, "pillars", pil.slice());
    b.setAttribute("aria-pressed", at < 0 ? "true" : "false"); b.style.background = at < 0 ? "#0a2f38" : ""; b.style.color = at < 0 ? "#fff" : "";
  };
  function saveSup(){ sup.t = now(); wj(kSup(s.id, ctx.pg), sup); }
  $("pbSupC").onclick = function(e){
    var b = e.target.closest("[data-c]"); if(!b) return;
    sup.chips = sup.chips || []; var at = sup.chips.indexOf(b.dataset.c); if(at >= 0) sup.chips.splice(at, 1); else sup.chips.push(b.dataset.c);
    saveSup(); b.setAttribute("aria-pressed", at < 0 ? "true" : "false"); b.style.background = at < 0 ? "#0a2f38" : ""; b.style.color = at < 0 ? "#fff" : "";
  };
  var supT = $("pbSupT"), stk = $("pbSticky");
  /* save on every keystroke's pause, and straight away when leaving the box, so switching page never loses a note */
  var saveT = function(){ if(sup.text !== supT.value){ sup.text = supT.value; saveSup(); } };
  var saveK = function(){ var v = stk.value.trim(), o = (jayBits(s.id, ctx.pg).sticky || {}).v || ""; if(v !== o) setJay(s.id, ctx.pg, "sticky", v); };
  supT.oninput = debounce(saveT, 600); supT.onblur = saveT;
  stk.oninput = debounce(saveK, 600); stk.onblur = saveK;
  if($("pbSt")) $("pbSt").onclick = function(){ setDone(s.id, ctx.pg, true, "Stamped with Jay"); drawStaff(); drawCohort(); };
  if($("pbUn")) $("pbUn").onclick = function(){ setDone(s.id, ctx.pg, false); drawStaff(); drawCohort(); };
}
function dqEditor(){
  var cur = dq(), v = window.prompt("The driving question at the front of " + WHO + "'s book. To set it for everyone, start with a * (it will be left out).", cur);
  if(v == null) return;
  v = v.trim(); var all = v.charAt(0) === "*"; if(all) v = v.slice(1).trim();
  if(!v) return;
  var keep = WHO;
  (all ? WHOS : [WHO]).forEach(function(w){ useStudent(w); var m = meta(); m.dq = { v: v, t: now() }; wj(kMeta(), m); });
  useStudent(keep); drawStaff();
}

/* ==========================================================
   Start
   ========================================================== */
var st = el("style"); st.textContent = CSS; document.head.appendChild(st);

function startStudent(){
  mount();
  if(!WHO || !P){
    root.innerHTML = '<div class="pb-card" style="max-width:560px;margin:40px auto"><h2>This book lives in a student HQ</h2><p class="hint">Open it from your HQ, or staff can use the project books page in the staff room.</p><p><a class="pb-btn" href="/">Base 5 home</a></p></div>';
    return;
  }
  if(WHO === "LC") loadScript("/data/b5speak.js?v=1", function(){ return !!window.B5Speak; });
  var hash = (location.hash || "").replace("#", "");
  if(BY[hash]) openStep(hash); else drawMap();
  window.addEventListener("hashchange", function(){ var h = (location.hash || "").replace("#", ""); if(BY[h]) openStep(h); });
  penButton();
  /* evidence for BridgeLink Buddy: time on task, counted by the sheet */
  if(window.B5Evidence && !S.guest) B5Evidence.start({ slug: "game-project-book", title: "Project book (ELP workbook)", subject: "Project", line: function(){
    var on = Object.keys(sessionSteps).filter(function(k){ return BY[k] && k !== "cover"; }).map(function(k){ return BY[k].n; });
    return (on.length ? "Worked on " + on.join(", ") + ". " : "") + stampedList().length + " of " + ROUTE.length + " steps stamped in the project book.";
  } });
  /* Jay may have written from the staff room: check again when the book comes back into view */
  document.addEventListener("visibilitychange", function(){
    if(document.visibilityState === "visible" && window.B5Sync && B5Sync.pull) B5Sync.pull().then(function(){ if(view.at === "map") drawMap(); });
  });
}

function go(){
  if(STAFF){ (window.B5Staff ? B5Staff.ready : Promise.resolve()).then(staffMount); return; }
  (window.B5Gate ? B5Gate.ready : Promise.resolve()).then(startStudent);
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();

window.ProjectBook = { steps: STEPS, stages: STAGES, book: BOOK, text: function(){ return bookText(); }, print: printBook };
})();
