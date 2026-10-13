/* ==========================================================
   LC's Night Shift HQ - catalogue
   Every activity, step and topic, so the HQ home, the skills map
   and Jay's view always agree. Chunk names come from the pages;
   if a page's chunks change, update the list here too.
   Written by hand, not built.
   ========================================================== */
var EGWCAT = {};
EGWCAT.acts = [
 {
  "id": "spot-it",
  "subject": "english",
  "title": "Spot it",
  "line": "Finding names, times, prices and reasons on signs, posters and menus.",
  "mins": 35,
  "chunks": [
   "Signs",
   "Posters",
   "Menus and prices",
   "Opening times",
   "Torch hunt",
   "Finding a reason",
   "Titles"
  ]
 },
 {
  "id": "emails",
  "subject": "english",
  "title": "Emails and messages",
  "line": "Who it is from, what it is about, and what they want you to do.",
  "mins": 30,
  "chunks": [
   "Parts of an email",
   "Who and what",
   "What they want",
   "Finding details",
   "Texts and notes",
   "Write a reply"
  ]
 },
 {
  "id": "words",
  "subject": "english",
  "title": "Words and meanings",
  "line": "Clue words, picture plans, how a text is set out, and what it is for.",
  "mins": 30,
  "chunks": [
   "Clue words",
   "Same meaning",
   "Two meanings",
   "Picture plans",
   "How it is set out",
   "What is it for?"
  ]
 },
 {
  "id": "sentences",
  "subject": "english",
  "title": "Capitals and full stops",
  "line": "The alphabet, capital letters, full stops and sentences that make sense.",
  "mins": 35,
  "chunks": [
   "The alphabet",
   "Alphabetical order",
   "Capital letters",
   "Names and days",
   "Full stops and questions",
   "Making sense",
   "Joining words"
  ]
 },
 {
  "id": "spelling",
  "subject": "english",
  "title": "Spelling",
  "line": "Days, months, tricky words, plurals and sound alikes.",
  "mins": 35,
  "chunks": [
   "Days and months",
   "Tricky words",
   "Adding s or es",
   "Sound it out",
   "Sound alikes",
   "Spot the mistake"
  ]
 },
 {
  "id": "forms-notes",
  "subject": "english",
  "title": "Forms and notes",
  "line": "Filling in a form and writing a short note.",
  "mins": 35,
  "chunks": [
   "Reading a form",
   "Dates and capitals",
   "Ticks and signing",
   "Writing a note",
   "Writing in sentences",
   "Your turn to write"
  ]
 },
 {
  "id": "place-value",
  "subject": "maths",
  "title": "Place value",
  "line": "Hundreds, tens and ones, thousands, comparing and rounding.",
  "mins": 35,
  "chunks": [
   "Hundreds, tens, ones",
   "Into the thousands",
   "Part whole models",
   "Making numbers",
   "Comparing numbers",
   "Number lines",
   "Rounding"
  ]
 },
 {
  "id": "add-subtract",
  "subject": "maths",
  "title": "Adding and taking away",
  "line": "Number bonds, in your head, and column methods.",
  "mins": 35,
  "chunks": [
   "Number bonds",
   "In your head",
   "Column adding",
   "Column taking away",
   "Missing numbers",
   "Checking",
   "Word problems"
  ]
 },
 {
  "id": "times-divide",
  "subject": "maths",
  "title": "Times and share",
  "line": "Groups, times tables, doubling, sharing and leftovers.",
  "mins": 35,
  "chunks": [
   "Groups and arrays",
   "2, 5 and 10 tables",
   "3 and 4 tables",
   "Doubling and halving",
   "Sharing and grouping",
   "Leftovers",
   "Word problems"
  ]
 },
 {
  "id": "measures",
  "subject": "maths",
  "title": "Measuring",
  "line": "Litres, grams and metres, and reading scales.",
  "mins": 35,
  "chunks": [
   "Millilitres and litres",
   "Reading scales",
   "Reading a jug",
   "Grams and kilograms",
   "Centimetres and metres",
   "Comparing amounts",
   "Pudding problems"
  ]
 },
 {
  "id": "money-time",
  "subject": "maths",
  "title": "Money and time",
  "line": "Coins, prices, change, clocks and calendars.",
  "mins": 40,
  "chunks": [
   "Coins and notes",
   "Adding up prices",
   "Change and best value",
   "Telling the time",
   "Digital clocks",
   "How long?",
   "Opening times and calendars"
  ]
 },
 {
  "id": "charts-shapes",
  "subject": "maths",
  "title": "Charts and shapes",
  "line": "Tallies, pictograms, bar charts, shapes and symmetry.",
  "mins": 40,
  "chunks": [
   "Tallies and tables",
   "Pictograms",
   "Bar charts",
   "2D shapes",
   "3D shapes",
   "Symmetry",
   "Right angles"
  ]
 }
];

EGWCAT.subjects = [
 {
  "key": "english",
  "name": "English",
  "short": "English",
  "acc": "acc-eng",
  "board": "No exam: building up from your baseline",
  "boardNote": "These steps come from Jay's baseline papers. Jay can change them as you move up.",
  "overview": "There is no exam here. Each skill builds on the last, starting from where your baseline put you. Pick any chunk, in any order.",
  "papers": [
   {
    "name": "Reading, Foundation 1",
    "time": "Where you are now",
    "marks": 0,
    "tag": "Now",
    "calc": "",
    "what": "Short everyday texts: signs, posters, menus, opening times, emails and notes. Find a name, a time, a detail or a reason.",
    "qs": []
   },
   {
    "name": "Writing, Foundation 1",
    "time": "Where you are now",
    "marks": 0,
    "tag": "Now",
    "calc": "",
    "what": "The alphabet, capital letters and full stops, spelling everyday words, filling in a form and writing a short note.",
    "qs": []
   },
   {
    "name": "Foundation 2",
    "time": "Next steps",
    "marks": 0,
    "tag": "Next",
    "calc": "",
    "what": "Working out what words mean, using picture plans, how a text is set out, and what a text is for.",
    "qs": []
   }
  ],
  "topics": [
   {
    "group": "Reading",
    "name": "Finding details on signs and posters",
    "often": 1,
    "links": [
     [
      "spot-it",
      1
     ],
     [
      "spot-it",
      2
     ],
     [
      "spot-it",
      5
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Menus, prices and opening times",
    "often": 1,
    "links": [
     [
      "spot-it",
      3
     ],
     [
      "spot-it",
      4
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Finding a reason",
    "often": 1,
    "links": [
     [
      "spot-it",
      6
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Titles and what a text is about",
    "often": 0,
    "links": [
     [
      "spot-it",
      7
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Parts of an email",
    "often": 1,
    "links": [
     [
      "emails",
      1
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Who, what and what they want",
    "often": 1,
    "links": [
     [
      "emails",
      2
     ],
     [
      "emails",
      3
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Details in emails, texts and notes",
    "often": 1,
    "links": [
     [
      "emails",
      4
     ],
     [
      "emails",
      5
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Working out what words mean",
    "often": 0,
    "links": [
     [
      "words",
      1
     ],
     [
      "words",
      2
     ],
     [
      "words",
      3
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Picture plans",
    "often": 0,
    "links": [
     [
      "words",
      4
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "How a text is set out",
    "often": 0,
    "links": [
     [
      "words",
      5
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "What a text is for",
    "often": 0,
    "links": [
     [
      "words",
      6
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "The alphabet and alphabetical order",
    "often": 1,
    "links": [
     [
      "sentences",
      1
     ],
     [
      "sentences",
      2
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Capital letters",
    "often": 1,
    "links": [
     [
      "sentences",
      3
     ],
     [
      "sentences",
      4
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Full stops and question marks",
    "often": 1,
    "links": [
     [
      "sentences",
      5
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Sentences that make sense",
    "often": 1,
    "links": [
     [
      "sentences",
      6
     ],
     [
      "sentences",
      7
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Days and months",
    "often": 1,
    "links": [
     [
      "spelling",
      1
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Tricky words",
    "often": 1,
    "links": [
     [
      "spelling",
      2
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Adding s or es",
    "often": 0,
    "links": [
     [
      "spelling",
      3
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Sounding out longer words",
    "often": 0,
    "links": [
     [
      "spelling",
      4
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Sound alikes",
    "often": 0,
    "links": [
     [
      "spelling",
      5
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Checking spelling",
    "often": 0,
    "links": [
     [
      "spelling",
      6
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Filling in a form",
    "often": 1,
    "links": [
     [
      "forms-notes",
      1
     ],
     [
      "forms-notes",
      2
     ],
     [
      "forms-notes",
      3
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Writing a note or a reply",
    "often": 1,
    "links": [
     [
      "forms-notes",
      4
     ],
     [
      "forms-notes",
      5
     ],
     [
      "forms-notes",
      6
     ],
     [
      "emails",
      6
     ]
    ]
   }
  ]
 },
 {
  "key": "maths",
  "name": "Maths",
  "short": "Maths",
  "acc": "acc-maths",
  "board": "No exam: building up from your baseline",
  "boardNote": "These steps come from Jay's baseline papers. Jay can change them as you move up.",
  "overview": "There is no exam here. Each skill builds on the last, starting from where your baseline put you. Pick any chunk, in any order.",
  "papers": [
   {
    "name": "Foundation 2",
    "time": "Where you are now",
    "marks": 0,
    "tag": "Now",
    "calc": "",
    "what": "Place value to 1000 and beyond, part whole models, adding and taking away in columns, times tables and multiples, capacity and reading scales.",
    "qs": []
   },
   {
    "name": "Foundation 3",
    "time": "Next steps",
    "marks": 0,
    "tag": "Next",
    "calc": "",
    "what": "Rounding, number lines, all four operations, money and time problems, charts, and types of angle.",
    "qs": []
   }
  ],
  "topics": [
   {
    "group": "Number",
    "name": "Hundreds, tens and ones",
    "often": 1,
    "links": [
     [
      "place-value",
      1
     ]
    ]
   },
   {
    "group": "Number",
    "name": "Into the thousands",
    "often": 1,
    "links": [
     [
      "place-value",
      2
     ]
    ]
   },
   {
    "group": "Number",
    "name": "Part whole models",
    "often": 1,
    "links": [
     [
      "place-value",
      3
     ],
     [
      "add-subtract",
      5
     ]
    ]
   },
   {
    "group": "Number",
    "name": "Making and comparing numbers",
    "often": 1,
    "links": [
     [
      "place-value",
      4
     ],
     [
      "place-value",
      5
     ]
    ]
   },
   {
    "group": "Number",
    "name": "Number lines",
    "often": 0,
    "links": [
     [
      "place-value",
      6
     ]
    ]
   },
   {
    "group": "Number",
    "name": "Rounding",
    "often": 0,
    "links": [
     [
      "place-value",
      7
     ]
    ]
   },
   {
    "group": "Adding and taking away",
    "name": "Number bonds and adding in your head",
    "often": 1,
    "links": [
     [
      "add-subtract",
      1
     ],
     [
      "add-subtract",
      2
     ]
    ]
   },
   {
    "group": "Adding and taking away",
    "name": "Column adding and taking away",
    "often": 1,
    "links": [
     [
      "add-subtract",
      3
     ],
     [
      "add-subtract",
      4
     ]
    ]
   },
   {
    "group": "Adding and taking away",
    "name": "Checking with the opposite",
    "often": 0,
    "links": [
     [
      "add-subtract",
      6
     ]
    ]
   },
   {
    "group": "Adding and taking away",
    "name": "Word problems",
    "often": 1,
    "links": [
     [
      "add-subtract",
      7
     ],
     [
      "times-divide",
      7
     ]
    ]
   },
   {
    "group": "Times and share",
    "name": "Groups and arrays",
    "often": 1,
    "links": [
     [
      "times-divide",
      1
     ]
    ]
   },
   {
    "group": "Times and share",
    "name": "Times tables and multiples",
    "often": 1,
    "links": [
     [
      "times-divide",
      2
     ],
     [
      "times-divide",
      3
     ]
    ]
   },
   {
    "group": "Times and share",
    "name": "Doubling and halving",
    "often": 0,
    "links": [
     [
      "times-divide",
      4
     ]
    ]
   },
   {
    "group": "Times and share",
    "name": "Sharing, grouping and leftovers",
    "often": 1,
    "links": [
     [
      "times-divide",
      5
     ],
     [
      "times-divide",
      6
     ]
    ]
   },
   {
    "group": "Measures",
    "name": "Millilitres and litres",
    "often": 1,
    "links": [
     [
      "measures",
      1
     ],
     [
      "measures",
      3
     ]
    ]
   },
   {
    "group": "Measures",
    "name": "Reading scales",
    "often": 1,
    "links": [
     [
      "measures",
      2
     ]
    ]
   },
   {
    "group": "Measures",
    "name": "Grams and kilograms",
    "often": 0,
    "links": [
     [
      "measures",
      4
     ]
    ]
   },
   {
    "group": "Measures",
    "name": "Centimetres and metres",
    "often": 0,
    "links": [
     [
      "measures",
      5
     ]
    ]
   },
   {
    "group": "Measures",
    "name": "Comparing amounts and problems",
    "often": 0,
    "links": [
     [
      "measures",
      6
     ],
     [
      "measures",
      7
     ]
    ]
   },
   {
    "group": "Money and time",
    "name": "Coins and notes",
    "often": 1,
    "links": [
     [
      "money-time",
      1
     ]
    ]
   },
   {
    "group": "Money and time",
    "name": "Adding prices and change",
    "often": 1,
    "links": [
     [
      "money-time",
      2
     ],
     [
      "money-time",
      3
     ]
    ]
   },
   {
    "group": "Money and time",
    "name": "Telling the time",
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
    "group": "Money and time",
    "name": "How long things take",
    "often": 0,
    "links": [
     [
      "money-time",
      6
     ]
    ]
   },
   {
    "group": "Money and time",
    "name": "Calendars and opening times",
    "often": 0,
    "links": [
     [
      "money-time",
      7
     ]
    ]
   },
   {
    "group": "Charts and shapes",
    "name": "Tallies, tables and pictograms",
    "often": 1,
    "links": [
     [
      "charts-shapes",
      1
     ],
     [
      "charts-shapes",
      2
     ]
    ]
   },
   {
    "group": "Charts and shapes",
    "name": "Bar charts",
    "often": 1,
    "links": [
     [
      "charts-shapes",
      3
     ]
    ]
   },
   {
    "group": "Charts and shapes",
    "name": "2D and 3D shapes",
    "often": 1,
    "links": [
     [
      "charts-shapes",
      4
     ],
     [
      "charts-shapes",
      5
     ]
    ]
   },
   {
    "group": "Charts and shapes",
    "name": "Symmetry and right angles",
    "often": 0,
    "links": [
     [
      "charts-shapes",
      6
     ],
     [
      "charts-shapes",
      7
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
  "title": "Escape the empty mall",
  "line": "Locked in after closing time. Four rooms, one digit each.",
  "mins": 25,
  "chunks": [
   "Food court",
   "Toy shop",
   "Security office",
   "Lift",
   "The final door"
  ]
 },
 {
  "id": "escape-maths",
  "kind": "escape",
  "subject": "maths",
  "title": "Escape the night bus",
  "line": "Woken up in the empty bus depot. Four rooms, one digit each.",
  "mins": 25,
  "chunks": [
   "The bus",
   "Ticket machine",
   "Lost property",
   "Garage",
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
