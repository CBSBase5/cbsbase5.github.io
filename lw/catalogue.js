/* ==========================================================
   LW's Skills HQ - catalogue
   Every activity, paper and topic for Functional Skills Level 1,
   so the HQ home, the papers page and Jay's view always agree.
   Chunk names come from the pages; if a page's chunks change,
   update the list here too. Written by hand, not built.
   ========================================================== */
var EGWCAT = {};
EGWCAT.acts = [
 {
  "id": "reading-find",
  "subject": "english",
  "title": "Find it fast",
  "line": "Skimming, scanning, headings, details, main points, instructions and tables.",
  "mins": 45,
  "chunks": [
   "Skim and scan",
   "Headings and layout",
   "Finding details",
   "Scan race",
   "Main points",
   "Following instructions",
   "Reference skills",
   "Tables and timetables"
  ]
 },
 {
  "id": "reading-purpose",
  "subject": "english",
  "title": "Why was it written?",
  "line": "Purpose, audience, persuasive language, fact or opinion, and comparing two texts.",
  "mins": 45,
  "chunks": [
   "Purpose",
   "Audience",
   "Persuasive language",
   "Layout features",
   "Fact or opinion",
   "Word meanings",
   "Reading between the lines",
   "Comparing texts"
  ]
 },
 {
  "id": "writing-format",
  "subject": "english",
  "title": "Get the format right",
  "line": "Letters, emails, reports, articles and notices, with a full task at the end.",
  "mins": 50,
  "chunks": [
   "The writing paper",
   "Reading the task",
   "Formal or informal",
   "Letters and emails",
   "Reports and articles",
   "Reviews, leaflets, notices",
   "Paragraphs and links",
   "Your turn to write"
  ]
 },
 {
  "id": "spag",
  "subject": "english",
  "title": "Spelling, punctuation and grammar",
  "line": "The slips that cost the most marks, with a red pen game at the end.",
  "mins": 50,
  "chunks": [
   "Capitals and stops",
   "Commas and run ons",
   "Apostrophes",
   "Sound alikes",
   "More sound alikes",
   "Spelling patterns",
   "Verbs that agree",
   "Proofread it"
  ]
 },
 {
  "id": "speaking",
  "subject": "english",
  "title": "Talk it through",
  "line": "Listening, asking, joining in, and planning a short talk. No pressure.",
  "mins": 25,
  "chunks": [
   "Listening for the point",
   "Asking questions",
   "In a discussion",
   "Planning a talk",
   "Your talk"
  ]
 },
 {
  "id": "number",
  "subject": "maths",
  "title": "Number confidence",
  "line": "Big numbers, below zero, written methods, formulae in words, rounding.",
  "mins": 50,
  "chunks": [
   "Place value",
   "Negative numbers",
   "10, 100 and 1000",
   "Add and subtract",
   "Multiply and divide",
   "Squares and order",
   "Formulae in words",
   "Round and estimate"
  ]
 },
 {
  "id": "fdp",
  "subject": "maths",
  "title": "Fractions, decimals and percentages",
  "line": "Parts of amounts, money off, pay rises, interest, recipes and best buys.",
  "mins": 50,
  "chunks": [
   "Fractions",
   "Fraction of an amount",
   "Decimals",
   "Percentages",
   "Increase and decrease",
   "Converting",
   "Ratio",
   "Best buy"
  ]
 },
 {
  "id": "money-time",
  "subject": "maths",
  "title": "Money, time and units",
  "line": "Bills, budgets, best buys, the 24 hour clock, timetables, pay and units.",
  "mins": 50,
  "chunks": [
   "Adding up money",
   "Budgets and bills",
   "Best buys",
   "Clock and calendar",
   "How long?",
   "Timetables",
   "Rotas and pay",
   "Units and scales"
  ]
 },
 {
  "id": "shape",
  "subject": "maths",
  "title": "Shape and space",
  "line": "Rooms, gardens, boxes and maps: area, volume, nets, scales, angles.",
  "mins": 50,
  "chunks": [
   "Perimeter",
   "Area",
   "Volume",
   "Plans and nets",
   "Scale drawings",
   "Angles and symmetry",
   "Compass and turns",
   "Tiles and paint"
  ]
 },
 {
  "id": "data",
  "subject": "maths",
  "title": "Data and chance",
  "line": "Tables, charts, line graphs, mean and range, and probability.",
  "mins": 50,
  "chunks": [
   "Tables and tallies",
   "Pictograms",
   "Bar charts",
   "Line graphs",
   "Grouping data",
   "Mean and range",
   "Comparing data",
   "Probability"
  ]
 },
 {
  "id": "problems",
  "subject": "maths",
  "title": "Show your working",
  "line": "Turning wordy problems into marks, with some of Jay's working to mark.",
  "mins": 45,
  "chunks": [
   "Read the problem",
   "Choose the operation",
   "Lay it out",
   "Make the decision",
   "Check your answer",
   "Calculator skills",
   "Exam practice"
  ]
 }
];

EGWCAT.subjects = [
 {
  "key": "english",
  "name": "Functional Skills English",
  "short": "English",
  "acc": "acc-eng",
  "board": "City & Guilds Functional Skills English, Level 1 (4748)",
  "boardNote": "Built for City & Guilds Level 1. If anything about LW's papers turns out to be different, the skills still carry over; Jay can swap the paper details.",
  "overview": "Three parts. Reading and Writing are papers. Speaking, Listening and Communicating happens in person with your centre. You need to pass all three for the qualification. Everything is about real life: adverts, notices, emails, letters and web pages.",
  "papers": [
   {
    "name": "Reading",
    "time": "About 1 hour",
    "marks": 30,
    "calc": "",
    "what": "Two or three everyday texts, such as an advert, an article or a web page, then 20 questions. Find information, say what a text is for and who it is for, spot features, tell fact from opinion, and compare texts. The pass mark is usually around 20.",
    "qs": []
   },
   {
    "name": "Writing",
    "time": "1 hour 20 minutes",
    "marks": 54,
    "calc": "",
    "what": "Two tasks, 27 marks each: about 15 for what you say, the right format, audience and paragraphs, and about 12 for spelling, punctuation and grammar. Often a formal letter or email plus a report, article, review or notice. No dictionary or spell checker.",
    "qs": []
   },
   {
    "name": "Speaking, Listening and Communicating",
    "time": "Discussion and short talk",
    "marks": 0,
    "tag": "In person",
    "calc": "",
    "what": "Not a written paper. Your centre runs it with you: you take part in a discussion and give a short talk.",
    "qs": []
   }
  ],
  "topics": [
   {
    "group": "Reading",
    "name": "Finding information and details",
    "often": 1,
    "links": [
     [
      "reading-find",
      3
     ],
     [
      "reading-find",
      1
     ],
     [
      "reading-find",
      4
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Main points and ideas",
    "often": 1,
    "links": [
     [
      "reading-find",
      5
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Headings, layout and features",
    "often": 1,
    "links": [
     [
      "reading-find",
      2
     ],
     [
      "reading-purpose",
      4
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Following instructions",
    "often": 0,
    "links": [
     [
      "reading-find",
      6
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Tables, timetables and reference skills",
    "often": 0,
    "links": [
     [
      "reading-find",
      8
     ],
     [
      "reading-find",
      7
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Purpose and audience",
    "often": 1,
    "links": [
     [
      "reading-purpose",
      1
     ],
     [
      "reading-purpose",
      2
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Persuasive language",
    "often": 1,
    "links": [
     [
      "reading-purpose",
      3
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Fact and opinion",
    "often": 1,
    "links": [
     [
      "reading-purpose",
      5
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Word meanings from context",
    "often": 1,
    "links": [
     [
      "reading-purpose",
      6
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Reading between the lines",
    "often": 0,
    "links": [
     [
      "reading-purpose",
      7
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Comparing two texts",
    "often": 1,
    "links": [
     [
      "reading-purpose",
      8
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Reading the task and covering every bullet",
    "often": 1,
    "links": [
     [
      "writing-format",
      1
     ],
     [
      "writing-format",
      2
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Formal and informal",
    "often": 1,
    "links": [
     [
      "writing-format",
      3
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Letters and emails",
    "often": 1,
    "links": [
     [
      "writing-format",
      4
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Reports, articles, reviews and notices",
    "often": 1,
    "links": [
     [
      "writing-format",
      5
     ],
     [
      "writing-format",
      6
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Paragraphs and linking words",
    "often": 1,
    "links": [
     [
      "writing-format",
      7
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "A full Level 1 task",
    "often": 0,
    "links": [
     [
      "writing-format",
      8
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Capitals, full stops and question marks",
    "often": 1,
    "links": [
     [
      "spag",
      1
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Commas, run ons and fragments",
    "often": 1,
    "links": [
     [
      "spag",
      2
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Apostrophes",
    "often": 1,
    "links": [
     [
      "spag",
      3
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Homophones (their, there, they're and friends)",
    "often": 1,
    "links": [
     [
      "spag",
      4
     ],
     [
      "spag",
      5
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Spelling patterns and plurals",
    "often": 1,
    "links": [
     [
      "spag",
      6
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Grammar: agreement and tense",
    "often": 1,
    "links": [
     [
      "spag",
      7
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Proofreading",
    "often": 1,
    "links": [
     [
      "spag",
      8
     ]
    ]
   },
   {
    "group": "Speaking and listening",
    "name": "Listening for the main points",
    "often": 0,
    "links": [
     [
      "speaking",
      1
     ]
    ]
   },
   {
    "group": "Speaking and listening",
    "name": "Asking and answering questions",
    "often": 0,
    "links": [
     [
      "speaking",
      2
     ]
    ]
   },
   {
    "group": "Speaking and listening",
    "name": "Joining a discussion",
    "often": 0,
    "links": [
     [
      "speaking",
      3
     ]
    ]
   },
   {
    "group": "Speaking and listening",
    "name": "Planning and giving a short talk",
    "often": 0,
    "links": [
     [
      "speaking",
      4
     ],
     [
      "speaking",
      5
     ]
    ]
   }
  ]
 },
 {
  "key": "maths",
  "name": "Functional Skills Maths",
  "short": "Maths",
  "acc": "acc-maths",
  "board": "Pearson Edexcel Functional Skills Mathematics, Level 1",
  "boardNote": "Built for Pearson Edexcel Level 1. If anything about LW's paper turns out to be different, the skills still carry over; Jay can swap the paper details.",
  "overview": "One paper in two sections, 56 marks in all. Questions are everyday problems, often with several steps, and many end with a decision such as \"Does he have enough money?\". Marks go to your working as well as your answers, so show it every time.",
  "papers": [
   {
    "name": "Section A",
    "time": "25 minutes",
    "marks": 14,
    "calc": "No calculator",
    "what": "A few shorter questions done by hand: number, money, simple fractions and percentages, and estimating.",
    "qs": []
   },
   {
    "name": "Section B",
    "time": "1 hour 30 minutes",
    "marks": 42,
    "calc": "Calculator",
    "what": "Longer everyday problems: money and percentages, time and timetables, area, volume and scale, tables and charts, mean and range, and probability. Decision questions need a decision and the figures that back it.",
    "qs": []
   }
  ],
  "topics": [
   {
    "group": "Number",
    "name": "Place value up to a million",
    "often": 1,
    "links": [
     [
      "number",
      1
     ]
    ]
   },
   {
    "group": "Number",
    "name": "Negative numbers in real life",
    "often": 1,
    "links": [
     [
      "number",
      2
     ]
    ]
   },
   {
    "group": "Number",
    "name": "Multiplying and dividing by 10, 100 and 1000",
    "often": 1,
    "links": [
     [
      "number",
      3
     ]
    ]
   },
   {
    "group": "Number",
    "name": "Written methods without a calculator",
    "often": 1,
    "links": [
     [
      "number",
      4
     ],
     [
      "number",
      5
     ]
    ]
   },
   {
    "group": "Number",
    "name": "Squares and order of operations",
    "often": 0,
    "links": [
     [
      "number",
      6
     ]
    ]
   },
   {
    "group": "Number",
    "name": "Formulae in words",
    "often": 1,
    "links": [
     [
      "number",
      7
     ]
    ]
   },
   {
    "group": "Number",
    "name": "Rounding and estimating",
    "often": 1,
    "links": [
     [
      "number",
      8
     ]
    ]
   },
   {
    "group": "Fractions, decimals and percentages",
    "name": "Fractions and a fraction of an amount",
    "often": 1,
    "links": [
     [
      "fdp",
      1
     ],
     [
      "fdp",
      2
     ]
    ]
   },
   {
    "group": "Fractions, decimals and percentages",
    "name": "Decimals",
    "often": 1,
    "links": [
     [
      "fdp",
      3
     ]
    ]
   },
   {
    "group": "Fractions, decimals and percentages",
    "name": "Percentages, discounts and simple interest",
    "often": 1,
    "links": [
     [
      "fdp",
      4
     ],
     [
      "fdp",
      5
     ]
    ]
   },
   {
    "group": "Fractions, decimals and percentages",
    "name": "Converting fractions, decimals and percentages",
    "often": 1,
    "links": [
     [
      "fdp",
      6
     ]
    ]
   },
   {
    "group": "Fractions, decimals and percentages",
    "name": "Ratio and direct proportion",
    "often": 1,
    "links": [
     [
      "fdp",
      7
     ],
     [
      "fdp",
      8
     ]
    ]
   },
   {
    "group": "Money, time and units",
    "name": "Money, bills and budgets",
    "often": 1,
    "links": [
     [
      "money-time",
      1
     ],
     [
      "money-time",
      2
     ]
    ]
   },
   {
    "group": "Money, time and units",
    "name": "Best buys and value for money",
    "often": 1,
    "links": [
     [
      "money-time",
      3
     ],
     [
      "fdp",
      8
     ]
    ]
   },
   {
    "group": "Money, time and units",
    "name": "Time, the 24 hour clock and how long",
    "often": 1,
    "links": [
     [
      "money-time",
      4
     ],
     [
      "money-time",
      5
     ]
    ]
   },
   {
    "group": "Money, time and units",
    "name": "Timetables",
    "often": 1,
    "links": [
     [
      "money-time",
      6
     ]
    ]
   },
   {
    "group": "Money, time and units",
    "name": "Rotas and pay",
    "often": 0,
    "links": [
     [
      "money-time",
      7
     ]
    ]
   },
   {
    "group": "Money, time and units",
    "name": "Converting units and reading scales",
    "often": 1,
    "links": [
     [
      "money-time",
      8
     ]
    ]
   },
   {
    "group": "Shape and space",
    "name": "Perimeter and area",
    "often": 1,
    "links": [
     [
      "shape",
      1
     ],
     [
      "shape",
      2
     ]
    ]
   },
   {
    "group": "Shape and space",
    "name": "Volume of cubes and cuboids",
    "often": 1,
    "links": [
     [
      "shape",
      3
     ]
    ]
   },
   {
    "group": "Shape and space",
    "name": "Plans, elevations and nets",
    "often": 0,
    "links": [
     [
      "shape",
      4
     ]
    ]
   },
   {
    "group": "Shape and space",
    "name": "Scale drawings and maps",
    "often": 1,
    "links": [
     [
      "shape",
      5
     ]
    ]
   },
   {
    "group": "Shape and space",
    "name": "Angles and symmetry",
    "often": 0,
    "links": [
     [
      "shape",
      6
     ]
    ]
   },
   {
    "group": "Shape and space",
    "name": "Compass directions",
    "often": 0,
    "links": [
     [
      "shape",
      7
     ]
    ]
   },
   {
    "group": "Shape and space",
    "name": "How many tins, tiles or packs",
    "often": 1,
    "links": [
     [
      "shape",
      8
     ]
    ]
   },
   {
    "group": "Data and chance",
    "name": "Tables, tally charts and pictograms",
    "often": 1,
    "links": [
     [
      "data",
      1
     ],
     [
      "data",
      2
     ]
    ]
   },
   {
    "group": "Data and chance",
    "name": "Bar charts and line graphs",
    "often": 1,
    "links": [
     [
      "data",
      3
     ],
     [
      "data",
      4
     ]
    ]
   },
   {
    "group": "Data and chance",
    "name": "Grouping data",
    "often": 0,
    "links": [
     [
      "data",
      5
     ]
    ]
   },
   {
    "group": "Data and chance",
    "name": "Mean and range",
    "often": 1,
    "links": [
     [
      "data",
      6
     ],
     [
      "data",
      7
     ]
    ]
   },
   {
    "group": "Data and chance",
    "name": "Probability",
    "often": 1,
    "links": [
     [
      "data",
      8
     ]
    ]
   },
   {
    "group": "Problem solving",
    "name": "Multi step and decision questions",
    "often": 1,
    "links": [
     [
      "problems",
      1
     ],
     [
      "problems",
      2
     ],
     [
      "problems",
      4
     ],
     [
      "problems",
      7
     ]
    ]
   },
   {
    "group": "Problem solving",
    "name": "Showing your working",
    "often": 1,
    "links": [
     [
      "problems",
      3
     ]
    ]
   },
   {
    "group": "Problem solving",
    "name": "Checking answers",
    "often": 1,
    "links": [
     [
      "problems",
      5
     ]
    ]
   },
   {
    "group": "Problem solving",
    "name": "Using a calculator well",
    "often": 1,
    "links": [
     [
      "problems",
      6
     ]
    ]
   }
  ]
 }
];

EGWCAT.extras = [
 {
  "id": "escape-english",
  "kind": "escape",
  "subject": "english",
  "title": "Escape the theatre",
  "line": "Locked in after the last rehearsal. Four rooms of reading and writing, one digit each.",
  "mins": 35,
  "chunks": [
   "Box office",
   "Dressing room",
   "Costume store",
   "Lighting box",
   "The final door"
  ]
 },
 {
  "id": "escape-maths",
  "kind": "escape",
  "subject": "maths",
  "title": "Escape the theme park",
  "line": "Locked in after closing. Four rooms of Level 1 maths, one digit each.",
  "mins": 40,
  "chunks": [
   "Ticket office",
   "Food court",
   "Ride queue",
   "Gift shop",
   "The final door"
  ]
 }
];

/* Small helpers both pages use */
EGWCAT.act = function(id){ var all = EGWCAT.acts.concat(EGWCAT.extras || []); for(var i = 0; i < all.length; i++) if(all[i].id === id) return all[i]; return null; };
EGWCAT.href = function(id, chunk){ return ((window.HQ && HQ.base) || "/egw/") + id + ".html" + (chunk ? "#chunk-" + chunk : ""); };
EGWCAT.state = function(id){
  try{
    var r = localStorage.getItem(((window.HQ && HQ.prefix) || "b5.egw.") + id + ".v1");
    var d = r ? JSON.parse(r) : null;
    return d && d.summary ? d.summary : null;
  }catch(e){ return null; }
};
EGWCAT.chunkDone = function(id, chunk){
  var s = EGWCAT.state(id);
  return !!(s && s.chunkStates && s.chunkStates[chunk - 1] === "done");
};
