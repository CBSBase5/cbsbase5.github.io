/* LP's GCSE HQ - catalogue. BUILT by lp/_build/build_lp.py from
   /egw/catalogue.js (English and Maths only). Do not edit by hand. */
var EGWCAT = {};
EGWCAT.acts = [
 {
  "id": "english-language",
  "subject": "english",
  "title": "Language detective",
  "line": "Language and structure in a fiction extract, with your own paragraph at the end.",
  "mins": 45,
  "chunks": [
   "First read",
   "Spotting methods",
   "Zooming in",
   "Building a paragraph",
   "Structure",
   "Your paragraph"
  ]
 },
 {
  "id": "english-creative",
  "subject": "english",
  "title": "Create and evaluate",
  "line": "Evaluating a statement, then planning and writing a description or story.",
  "mins": 55,
  "chunks": [
   "Do you agree?",
   "Planning",
   "Openings",
   "Show, not tell",
   "Senses and imagery",
   "Sentences and paragraphs",
   "Endings and traps",
   "Your turn"
  ]
 },
 {
  "id": "english-nonfiction",
  "subject": "english",
  "title": "Two sources",
  "line": "Two non fiction sources 150 years apart: find, summarise, compare.",
  "mins": 55,
  "chunks": [
   "Older texts",
   "Finding the facts",
   "Reading between the lines",
   "Summing up both",
   "Language in older texts",
   "Comparing viewpoints",
   "Your comparison"
  ]
 },
 {
  "id": "english-viewpoint",
  "subject": "english",
  "title": "Make your case",
  "line": "Viewpoint writing, with a rebuttal rally game in the middle.",
  "mins": 50,
  "chunks": [
   "Know the task",
   "The persuasion toolkit",
   "The other side",
   "Openings and endings",
   "Sentences and punctuation",
   "Your turn"
  ]
 },
 {
  "id": "maths-number",
  "subject": "maths",
  "title": "Number skills",
  "line": "BIDMAS, rounding, factors, powers, standard form and fractions.",
  "mins": 55,
  "chunks": [
   "Ordering and BIDMAS",
   "Rounding",
   "Primes and factors",
   "HCF and LCM",
   "Powers and roots",
   "Standard form",
   "Fractions",
   "Converting"
  ]
 },
 {
  "id": "maths-money",
  "subject": "maths",
  "title": "Percentages and money",
  "line": "Percentages, multipliers, ratio and best buys, plus a multiplier machine.",
  "mins": 50,
  "chunks": [
   "No calculator",
   "Multipliers",
   "Percentage change",
   "Ratio",
   "Best buy",
   "Working backwards",
   "Exam style"
  ]
 },
 {
  "id": "maths-algebra",
  "subject": "maths",
  "title": "Equations and algebra",
  "line": "Expressions, equations and inequalities, with a balance scale.",
  "mins": 50,
  "chunks": [
   "The words",
   "Tidying up",
   "Solving",
   "Forming equations",
   "Inequalities",
   "Stretch: quadratics and more",
   "Exam style"
  ]
 },
 {
  "id": "maths-simultaneous",
  "subject": "maths",
  "title": "Simultaneous equations and more",
  "line": "Error intervals, counting, and simultaneous equations with a cafe price detective.",
  "mins": 55,
  "chunks": [
   "Error intervals",
   "Truncation",
   "Counting",
   "Simultaneous equations",
   "Multiply first",
   "Graphs",
   "Forming equations",
   "Exam style"
  ]
 },
 {
  "id": "maths-graphs",
  "subject": "maths",
  "title": "Sequences and graphs",
  "line": "Sequences, coordinates, straight lines and real life graphs.",
  "mins": 55,
  "chunks": [
   "Sequences",
   "Special sequences",
   "Coordinates",
   "Plotting lines",
   "y = mx + c",
   "Real life graphs",
   "Quadratic graphs",
   "Exam style"
  ]
 },
 {
  "id": "maths-angles",
  "subject": "maths",
  "title": "Angles and shapes",
  "line": "Angle facts, polygons, bearings and transformations, with an arcade game.",
  "mins": 55,
  "chunks": [
   "Angle facts",
   "Parallel lines",
   "Shapes and symmetry",
   "Polygons",
   "Bearings",
   "Transformations",
   "Enlargement",
   "Exam style"
  ]
 },
 {
  "id": "maths-construct",
  "subject": "maths",
  "title": "Congruence, scale and constructions",
  "line": "Congruence, similar shapes, map scales, constructions, loci, plans and vectors, with a treasure hunt.",
  "mins": 55,
  "chunks": [
   "Congruence",
   "Similar shapes",
   "Maps and scales",
   "Constructions",
   "Loci",
   "Plans and elevations",
   "Vectors",
   "Exam style"
  ]
 },
 {
  "id": "maths-measures",
  "subject": "maths",
  "title": "Area, volume and triangles",
  "line": "Area, circles, volume, rates, Pythagoras and trigonometry.",
  "mins": 55,
  "chunks": [
   "Area and perimeter",
   "Circles",
   "Volume",
   "Units and rates",
   "Pythagoras",
   "Trigonometry",
   "Exact trig values",
   "Exam style"
  ]
 },
 {
  "id": "maths-probability",
  "subject": "maths",
  "title": "Probability",
  "line": "From the probability scale to tree diagrams, with a dice lab.",
  "mins": 50,
  "chunks": [
   "The basics",
   "Adding to 1",
   "Sample spaces",
   "Relative frequency",
   "Venn diagrams",
   "Frequency trees",
   "Tree diagrams",
   "Exam style"
  ]
 }
];

EGWCAT.subjects = [
 {
  "key": "english",
  "name": "English Language",
  "short": "English",
  "acc": "acc-eng",
  "board": "AQA GCSE English Language (8700)",
  "boardNote": "Built for AQA. If LP's board turns out to be different, the skills still carry over; Jay can swap the paper details.",
  "overview": "Two papers, each 1 hour 45 minutes and 80 marks, each worth half the GCSE. Both papers have the same shape: reading questions on unseen texts first, then one big piece of writing worth 40 marks. Nothing to learn by heart; it is all skills.",
  "papers": [
   {
    "name": "Paper 1: Creative reading and writing",
    "time": "1 hour 45 minutes",
    "marks": 80,
    "calc": "",
    "what": "One fiction extract from the 20th or 21st century, then a piece of descriptive or story writing.",
    "qs": [
     [
      "Q1",
      4,
      "List four things from a short part of the extract",
      [
       [
        "english-nonfiction",
        2
       ],
       [
        "english-language",
        1
       ]
      ]
     ],
     [
      "Q2",
      8,
      "How does the writer use language here?",
      [
       [
        "english-language",
        2
       ],
       [
        "english-language",
        3
       ],
       [
        "english-language",
        4
       ]
      ]
     ],
     [
      "Q3",
      8,
      "How is the whole extract structured?",
      [
       [
        "english-language",
        5
       ]
      ]
     ],
     [
      "Q4",
      20,
      "A student says... to what extent do you agree?",
      [
       [
        "english-creative",
        1
       ]
      ]
     ],
     [
      "Q5",
      40,
      "Write a description or a story (24 for content, 16 for accuracy)",
      [
       [
        "english-creative",
        2
       ],
       [
        "english-creative",
        4
       ],
       [
        "english-creative",
        8
       ]
      ]
     ]
    ]
   },
   {
    "name": "Paper 2: Writers' viewpoints and perspectives",
    "time": "1 hour 45 minutes",
    "marks": 80,
    "calc": "",
    "what": "Two non fiction sources on the same topic, one from the 19th century and one modern, then a piece of viewpoint writing.",
    "qs": [
     [
      "Q1",
      4,
      "Choose four true statements from a list of eight",
      [
       [
        "english-nonfiction",
        2
       ]
      ]
     ],
     [
      "Q2",
      8,
      "Write a summary of the differences between the two sources",
      [
       [
        "english-nonfiction",
        3
       ],
       [
        "english-nonfiction",
        4
       ]
      ]
     ],
     [
      "Q3",
      12,
      "How does the writer use language in one source?",
      [
       [
        "english-nonfiction",
        5
       ],
       [
        "english-language",
        3
       ]
      ]
     ],
     [
      "Q4",
      16,
      "Compare how the two writers convey their views",
      [
       [
        "english-nonfiction",
        6
       ],
       [
        "english-nonfiction",
        7
       ]
      ]
     ],
     [
      "Q5",
      40,
      "Write to give your view: an article, letter, speech or essay (24 + 16)",
      [
       [
        "english-viewpoint",
        1
       ],
       [
        "english-viewpoint",
        3
       ],
       [
        "english-viewpoint",
        6
       ]
      ]
     ]
    ]
   }
  ],
  "topics": [
   {
    "group": "Reading",
    "name": "Finding information (retrieval)",
    "often": 1,
    "links": [
     [
      "english-nonfiction",
      2
     ],
     [
      "english-language",
      1
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Explicit and implicit meaning",
    "often": 1,
    "links": [
     [
      "english-nonfiction",
      3
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Language analysis",
    "often": 1,
    "links": [
     [
      "english-language",
      2
     ],
     [
      "english-language",
      3
     ],
     [
      "english-language",
      4
     ],
     [
      "english-nonfiction",
      5
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Structure",
    "often": 1,
    "links": [
     [
      "english-language",
      5
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Evaluating a statement",
    "often": 1,
    "links": [
     [
      "english-creative",
      1
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Summarising two sources",
    "often": 1,
    "links": [
     [
      "english-nonfiction",
      4
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Comparing writers' views",
    "often": 1,
    "links": [
     [
      "english-nonfiction",
      6
     ],
     [
      "english-nonfiction",
      7
     ]
    ]
   },
   {
    "group": "Reading",
    "name": "Reading 19th century texts",
    "often": 1,
    "links": [
     [
      "english-nonfiction",
      1
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Planning a description or story",
    "often": 1,
    "links": [
     [
      "english-creative",
      2
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Openings, imagery and endings",
    "often": 1,
    "links": [
     [
      "english-creative",
      3
     ],
     [
      "english-creative",
      5
     ],
     [
      "english-creative",
      7
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Show, not tell",
    "often": 0,
    "links": [
     [
      "english-creative",
      4
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Viewpoint writing: form, audience, purpose",
    "often": 1,
    "links": [
     [
      "english-viewpoint",
      1
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Persuasive methods, counter arguments, openings and endings",
    "often": 1,
    "links": [
     [
      "english-viewpoint",
      2
     ],
     [
      "english-viewpoint",
      3
     ],
     [
      "english-viewpoint",
      4
     ]
    ]
   },
   {
    "group": "Writing",
    "name": "Sentences and punctuation",
    "often": 1,
    "links": [
     [
      "english-viewpoint",
      5
     ],
     [
      "english-creative",
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
  "board": "Pearson Edexcel GCSE Maths (1MA1), Foundation",
  "boardNote": "Foundation tier is graded 1 to 5, so a grade 5 is the top grade available.",
  "overview": "Three papers, each 1 hour 30 minutes and 80 marks, each worth a third of the GCSE. Paper 1 has no calculator; Papers 2 and 3 do. Any topic can come up on any paper. Roughly: number a quarter of the marks, ratio and proportion a quarter, algebra a fifth, and geometry, and statistics with probability, about 15% each.",
  "papers": [
   {
    "name": "Paper 1",
    "time": "1 hour 30 minutes",
    "marks": 80,
    "calc": "No calculator",
    "what": "Any topic. Questions start short and get longer. Written methods for arithmetic and fractions matter most here.",
    "qs": []
   },
   {
    "name": "Paper 2",
    "time": "1 hour 30 minutes",
    "marks": 80,
    "calc": "Calculator",
    "what": "Any topic. More money, percentage, area and trigonometry style questions that need a calculator.",
    "qs": []
   },
   {
    "name": "Paper 3",
    "time": "1 hour 30 minutes",
    "marks": 80,
    "calc": "Calculator",
    "what": "Any topic, same style as Paper 2. Often ends with longer problem solving questions.",
    "qs": []
   }
  ],
  "topics": [
   {
    "group": "Number",
    "name": "Ordering, negatives and BIDMAS",
    "often": 1,
    "links": [
     [
      "maths-number",
      1
     ]
    ]
   },
   {
    "group": "Number",
    "name": "Rounding and estimating",
    "often": 1,
    "links": [
     [
      "maths-number",
      2
     ]
    ]
   },
   {
    "group": "Number",
    "name": "Primes, factors, HCF and LCM",
    "often": 1,
    "links": [
     [
      "maths-number",
      3
     ],
     [
      "maths-number",
      4
     ]
    ]
   },
   {
    "group": "Number",
    "name": "Powers, roots and standard form",
    "often": 1,
    "links": [
     [
      "maths-number",
      5
     ],
     [
      "maths-number",
      6
     ]
    ]
   },
   {
    "group": "Number",
    "name": "Fractions, decimals and percentages",
    "often": 1,
    "links": [
     [
      "maths-number",
      7
     ],
     [
      "maths-number",
      8
     ],
     [
      "maths-money",
      1
     ]
    ]
   },
   {
    "group": "Number",
    "name": "Error intervals, truncation and counting (product rule Higher only)",
    "often": 1,
    "links": [
     [
      "maths-simultaneous",
      1
     ],
     [
      "maths-simultaneous",
      2
     ],
     [
      "maths-simultaneous",
      3
     ]
    ]
   },
   {
    "group": "Algebra",
    "name": "Simplifying, expanding and factorising",
    "often": 1,
    "links": [
     [
      "maths-algebra",
      2
     ],
     [
      "maths-algebra",
      6
     ]
    ]
   },
   {
    "group": "Algebra",
    "name": "Solving equations",
    "often": 1,
    "links": [
     [
      "maths-algebra",
      3
     ],
     [
      "maths-algebra",
      4
     ]
    ]
   },
   {
    "group": "Algebra",
    "name": "Substitution and formulae",
    "often": 1,
    "links": [
     [
      "maths-algebra",
      4
     ],
     [
      "maths-algebra",
      6
     ]
    ]
   },
   {
    "group": "Algebra",
    "name": "Inequalities",
    "often": 1,
    "links": [
     [
      "maths-algebra",
      5
     ]
    ]
   },
   {
    "group": "Algebra",
    "name": "Sequences and the nth term",
    "often": 1,
    "links": [
     [
      "maths-graphs",
      1
     ],
     [
      "maths-graphs",
      2
     ]
    ]
   },
   {
    "group": "Algebra",
    "name": "Coordinates and straight line graphs",
    "often": 1,
    "links": [
     [
      "maths-graphs",
      3
     ],
     [
      "maths-graphs",
      4
     ],
     [
      "maths-graphs",
      5
     ]
    ]
   },
   {
    "group": "Algebra",
    "name": "Real life graphs",
    "often": 1,
    "links": [
     [
      "maths-graphs",
      6
     ]
    ]
   },
   {
    "group": "Algebra",
    "name": "Simultaneous equations",
    "often": 1,
    "links": [
     [
      "maths-simultaneous",
      4
     ],
     [
      "maths-simultaneous",
      5
     ],
     [
      "maths-simultaneous",
      6
     ],
     [
      "maths-simultaneous",
      7
     ]
    ]
   },
   {
    "group": "Algebra",
    "name": "Quadratics",
    "often": 1,
    "links": [
     [
      "maths-algebra",
      6
     ],
     [
      "maths-graphs",
      7
     ]
    ]
   },
   {
    "group": "Ratio and proportion",
    "name": "Percentages and multipliers",
    "often": 1,
    "links": [
     [
      "maths-money",
      1
     ],
     [
      "maths-money",
      2
     ],
     [
      "maths-money",
      3
     ]
    ]
   },
   {
    "group": "Ratio and proportion",
    "name": "Reverse percentages and interest",
    "often": 1,
    "links": [
     [
      "maths-money",
      6
     ]
    ]
   },
   {
    "group": "Ratio and proportion",
    "name": "Ratio and sharing",
    "often": 1,
    "links": [
     [
      "maths-money",
      4
     ]
    ]
   },
   {
    "group": "Ratio and proportion",
    "name": "Best buys and proportion",
    "often": 1,
    "links": [
     [
      "maths-money",
      5
     ]
    ]
   },
   {
    "group": "Ratio and proportion",
    "name": "Units, speed and density",
    "often": 1,
    "links": [
     [
      "maths-measures",
      4
     ]
    ]
   },
   {
    "group": "Ratio and proportion",
    "name": "Direct and inverse proportion, recipes and exchange rates",
    "often": 1,
    "links": [
     [
      "maths-money",
      5
     ]
    ]
   },
   {
    "group": "Geometry",
    "name": "Angle facts and parallel lines",
    "often": 1,
    "links": [
     [
      "maths-angles",
      1
     ],
     [
      "maths-angles",
      2
     ]
    ]
   },
   {
    "group": "Geometry",
    "name": "Shapes, symmetry and polygons",
    "often": 1,
    "links": [
     [
      "maths-angles",
      3
     ],
     [
      "maths-angles",
      4
     ]
    ]
   },
   {
    "group": "Geometry",
    "name": "Bearings",
    "often": 0,
    "links": [
     [
      "maths-angles",
      5
     ]
    ]
   },
   {
    "group": "Geometry",
    "name": "Transformations",
    "often": 1,
    "links": [
     [
      "maths-angles",
      6
     ],
     [
      "maths-angles",
      7
     ]
    ]
   },
   {
    "group": "Geometry",
    "name": "Area, perimeter and circles",
    "often": 1,
    "links": [
     [
      "maths-measures",
      1
     ],
     [
      "maths-measures",
      2
     ]
    ]
   },
   {
    "group": "Geometry",
    "name": "Volume and surface area",
    "often": 1,
    "links": [
     [
      "maths-measures",
      3
     ]
    ]
   },
   {
    "group": "Geometry",
    "name": "Pythagoras and trigonometry",
    "often": 1,
    "links": [
     [
      "maths-measures",
      5
     ],
     [
      "maths-measures",
      6
     ],
     [
      "maths-measures",
      7
     ]
    ]
   },
   {
    "group": "Geometry",
    "name": "Scale drawings, maps and similar shapes",
    "often": 1,
    "links": [
     [
      "maths-construct",
      2
     ],
     [
      "maths-construct",
      3
     ]
    ],
    "ext": [
     "/practice/scale.html",
     "More scale practice on the practice hub"
    ]
   },
   {
    "group": "Geometry",
    "name": "Constructions and loci",
    "often": 1,
    "links": [
     [
      "maths-construct",
      4
     ],
     [
      "maths-construct",
      5
     ]
    ]
   },
   {
    "group": "Geometry",
    "name": "Plans, elevations and vectors",
    "often": 1,
    "links": [
     [
      "maths-construct",
      6
     ],
     [
      "maths-construct",
      7
     ]
    ]
   },
   {
    "group": "Geometry",
    "name": "Congruence",
    "often": 0,
    "links": [
     [
      "maths-construct",
      1
     ]
    ]
   },
   {
    "group": "Probability and statistics",
    "name": "Probability, sample spaces and Venn diagrams",
    "often": 1,
    "links": [
     [
      "maths-probability",
      1
     ],
     [
      "maths-probability",
      2
     ],
     [
      "maths-probability",
      3
     ],
     [
      "maths-probability",
      5
     ]
    ]
   },
   {
    "group": "Probability and statistics",
    "name": "Relative frequency and tree diagrams",
    "often": 1,
    "links": [
     [
      "maths-probability",
      4
     ],
     [
      "maths-probability",
      6
     ],
     [
      "maths-probability",
      7
     ]
    ]
   },
   {
    "group": "Probability and statistics",
    "name": "Averages and charts",
    "often": 1,
    "links": [
     [
      "stats-averages",
      1
     ],
     [
      "stats-averages",
      3
     ],
     [
      "stats-charts",
      2
     ],
     [
      "stats-charts",
      3
     ]
    ]
   },
   {
    "group": "Probability and statistics",
    "name": "Scatter graphs",
    "often": 1,
    "links": [
     [
      "stats-correlation",
      1
     ],
     [
      "stats-correlation",
      4
     ]
    ]
   }
  ]
 }
];

EGWCAT.extras = [
 {
  "id": "escape-maths",
  "kind": "escape",
  "subject": "maths",
  "title": "Escape the museum",
  "line": "Locked in a museum after hours. Four rooms of mixed maths, one digit each.",
  "mins": 35,
  "chunks": [
   "Egyptian gallery",
   "Dinosaur hall",
   "Gift shop",
   "Observatory",
   "The final door"
  ]
 },
 {
  "id": "escape-english",
  "kind": "escape",
  "subject": "english",
  "title": "Escape the lighthouse",
  "line": "A stormy night in an old lighthouse. Read, notice and write your way out.",
  "mins": 35,
  "chunks": [
   "The boot room",
   "The spiral stair",
   "The watch room",
   "The lamp room",
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
