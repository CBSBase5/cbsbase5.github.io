/* Swipe deck: quick true or false Biology cards (AQA 8461, Foundation, content on both
   Combined Science and Separate Biology). Flick right for true, left for false.
   link: [activity id, chunk number] of the chunk that teaches it. */
window.EGWSWIPE = (window.EGWSWIPE || []).concat([

  /* ---------- Cells and transport ---------- */
  { s: "bio", t: "Bacterial cells keep their DNA inside a nucleus.", a: false,
    fix: "False. Bacteria are prokaryotic: no nucleus. Their DNA is a single loop in the cytoplasm, often with extra small rings called plasmids.", link: ["biology-cells", 1] },
  { s: "bio", t: "Plant cells have a cell wall made of cellulose, which strengthens the cell.", a: true,
    fix: "Yes. Animal cells do not have one. Do not mix it up with the cell membrane, which controls what goes in and out.", link: ["biology-cells", 2] },
  { s: "bio", t: "A root hair cell has a large surface area for absorbing water and mineral ions.", a: true,
    fix: "Yes. The long hair sticks out into the soil, giving a big surface for water to move in by osmosis and ions by active transport.", link: ["biology-cells", 3] },
  { s: "bio", t: "Magnification = real size &divide; image size.", a: false,
    fix: "False. Magnification = image size &divide; real size. The image is the bigger one, so the answer should come out bigger than 1.", link: ["biology-cells", 4] },
  { s: "bio", t: "Osmosis is the movement of any particle from a high to a low concentration.", a: false,
    fix: "False. That describes diffusion. Osmosis is only water, moving across a partially permeable membrane from a dilute solution to a more concentrated one.", link: ["biology-cells", 5] },
  { s: "bio", t: "As an organism gets bigger, its surface area to volume ratio gets smaller.", a: true,
    fix: "Yes. Volume grows faster than surface area. That is why large organisms need exchange surfaces, like lungs, and transport systems, like blood.", link: ["biology-cells", 6] },

  /* ---------- Organisation ---------- */
  { s: "bio", t: "Enzymes are killed when they get too hot.", a: false,
    fix: "False. Enzymes are proteins, not living things, so they cannot be killed. Too much heat changes the shape of the active site: the enzyme is denatured.", link: ["biology-organisation", 2] },
  { s: "bio", t: "Iodine solution turns blue black when starch is present.", a: true,
    fix: "Yes. Without starch it stays orange brown. Benedict's (heated) tests for sugar, and biuret turns purple with protein.", link: ["biology-organisation", 3] },
  { s: "bio", t: "The left ventricle has a thicker muscle wall than the right ventricle.", a: true,
    fix: "Yes. The left ventricle pumps blood all round the body. The right one only pumps to the lungs, close by, so it needs less force.", link: ["biology-organisation", 5] },
  { s: "bio", t: "Arteries carry blood towards the heart.", a: false,
    fix: "False. Arteries carry blood away from the heart, at high pressure. Veins bring it back and have valves. Memory hook: Arteries go Away.", link: ["biology-organisation", 6] },
  { s: "bio", t: "Malignant tumours are cancers that can spread to other parts of the body in the blood.", a: true,
    fix: "Yes. They can form secondary tumours elsewhere. Benign tumours stay in one place, usually inside a membrane, and are not cancer.", link: ["biology-organisation", 7] },
  { s: "bio", t: "Phloem carries water up from the roots to the leaves.", a: false,
    fix: "False. That is xylem. Phloem carries dissolved sugars up or down the plant, which is called translocation.", link: ["biology-organisation", 8] },

  /* ---------- Infection and response ---------- */
  { s: "bio", t: "Viruses reproduce inside living cells, which damages the cells.", a: true,
    fix: "Yes. That is why viruses are hard to treat: they hide inside your own cells. Bacteria, by contrast, can release toxins.", link: ["biology-infection", 1] },
  { s: "bio", t: "Salmonella food poisoning is caused by a virus.", a: false,
    fix: "False. Salmonella is a bacterium, spread in undercooked or unhygienically prepared food. Toxins it releases cause the symptoms. UK poultry are vaccinated against it.", link: ["biology-infection", 2] },
  { s: "bio", t: "Some white blood cells engulf and digest pathogens. This is called phagocytosis.", a: true,
    fix: "Yes. Other white blood cells make antibodies, which target a particular pathogen, and antitoxins, which counteract toxins.", link: ["biology-infection", 4] },
  { s: "bio", t: "A vaccine contains antibodies that fight the disease.", a: false,
    fix: "False. A vaccine contains dead or inactive pathogens. Your white blood cells respond by making antibodies, and memory cells mean a faster response next time.", link: ["biology-infection", 5] },
  { s: "bio", t: "Antibiotics kill viruses as well as bacteria.", a: false,
    fix: "False. Antibiotics kill bacteria only; they do not work on viruses. Painkillers can ease symptoms, but they do not kill any pathogens.", link: ["biology-infection", 6] },
  { s: "bio", t: "In a double blind trial, neither the patients nor the doctors know who gets the placebo.", a: true,
    fix: "Yes. It stops anyone's expectations affecting the results. A placebo looks like the drug but has no active ingredient.", link: ["biology-infection", 7] },

  /* ---------- Photosynthesis and respiration ---------- */
  { s: "bio", t: "Photosynthesis is endothermic: energy is transferred from the environment by light.", a: true,
    fix: "Yes. Chlorophyll in chloroplasts absorbs light. That energy turns carbon dioxide and water into glucose and oxygen.", link: ["biology-bioenergetics", 1] },
  { s: "bio", t: "Giving a plant more light always makes it photosynthesise faster.", a: false,
    fix: "False. The word always is the trap. Once carbon dioxide or temperature is the limiting factor, more light makes no difference: the graph goes flat.", link: ["biology-bioenergetics", 2] },
  { s: "bio", t: "Plants photosynthesise instead of respiring, so they do not respire.", a: false,
    fix: "False. Plants respire all the time, day and night, in their mitochondria. In bright light, photosynthesis is simply faster than respiration.", link: ["biology-bioenergetics", 5] },
  { s: "bio", t: "Respiration is just another word for breathing.", a: false,
    fix: "False. Respiration is a reaction in every living cell that transfers energy from glucose. Breathing just moves air in and out of the lungs.", link: ["biology-bioenergetics", 5] },
  { s: "bio", t: "Plants use some of their glucose to make cellulose for strong cell walls.", a: true,
    fix: "Yes. Glucose is also stored as starch, used in respiration, made into fats and oils, and combined with nitrate ions to make amino acids.", link: ["biology-bioenergetics", 7] },

  /* ---------- Homeostasis and hormones ---------- */
  { s: "bio", t: "Homeostasis keeps internal conditions, like body temperature and blood glucose, at optimum levels.", a: true,
    fix: "Yes. It keeps conditions right for enzymes and cells, even when things change inside or outside the body.", link: ["biology-homeostasis", 1] },
  { s: "bio", t: "Nerve impulses cross a synapse as electrical signals.", a: false,
    fix: "False. At a synapse, a chemical diffuses across the gap and starts a new electrical impulse in the next neurone.", link: ["biology-homeostasis", 2] },
  { s: "bio", t: "In the ruler drop test, a shorter catch distance means a faster reaction time.", a: true,
    fix: "Yes. The ruler had less time to fall before you caught it. Take a mean of several drops to make it more reliable.", link: ["biology-homeostasis", 3] },
  { s: "bio", t: "Hormones are carried around the body by nerves.", a: false,
    fix: "False. Glands release hormones into the bloodstream, which carries them to a target organ. Their effects are slower than nerves but last longer.", link: ["biology-homeostasis", 4] },
  { s: "bio", t: "Insulin is made by the liver.", a: false,
    fix: "False. Insulin is made by the pancreas. It makes glucose move from the blood into cells. Liver and muscle cells store extra glucose as glycogen.", link: ["biology-homeostasis", 5] },
  { s: "bio", t: "FSH, from the pituitary gland, causes an egg to mature in the ovary.", a: true,
    fix: "Yes. Then LH triggers ovulation, the release of the egg. Oestrogen and progesterone build up and maintain the lining of the uterus.", link: ["biology-homeostasis", 6] },

  /* ---------- Inheritance and evolution ---------- */
  { s: "bio", t: "Mitosis makes four cells that are all genetically different.", a: false,
    fix: "False. That is meiosis, which makes four different gametes. Mitosis makes two genetically identical cells, for growth and repair.", link: ["biology-inheritance", 1] },
  { s: "bio", t: "A dominant allele is always the most common allele in a population.", a: false,
    fix: "False. Dominant only means it shows in the phenotype when just one copy is present. Polydactyly is caused by a dominant allele, yet it is rare.", link: ["biology-inheritance", 2] },
  { s: "bio", t: "Two cystic fibrosis carriers have a 25% chance of each child having the disorder.", a: true,
    fix: "Yes. Ff &times; Ff gives FF, Ff, Ff, ff. Only ff has cystic fibrosis: 1 in 4. The chance is the same for every child.", link: ["biology-inheritance", 4] },
  { s: "bio", t: "Giraffes got long necks by stretching to reach leaves, then passing the stretch on.", a: false,
    fix: "False. Variation came first. Giraffes that happened to have longer necks survived and bred more, passing on their alleles. That is natural selection.", link: ["biology-inheritance", 5] },
  { s: "bio", t: "Poodles like Bonnie exist because people chose which dogs to breed over many generations.", a: true,
    fix: "Yes. That is selective breeding: pick parents with the features you want, breed them, repeat. Too much inbreeding can cause health problems.", link: ["biology-inheritance", 6] },
  { s: "bio", t: "In the binomial name Homo sapiens, Homo is the genus and sapiens is the species.", a: true,
    fix: "Yes. Linnaeus's system gives every species a two part name: genus first (capital letter), then species.", link: ["biology-inheritance", 7] },

  /* ---------- Ecology ---------- */
  { s: "bio", t: "Abiotic factors are the non living parts of an environment, such as light and temperature.", a: true,
    fix: "Yes. The a at the start means not. Biotic factors are living ones, such as predators, disease or competition.", link: ["biology-ecology", 1] },
  { s: "bio", t: "In a food chain, the arrows point from the animal to the food it eats.", a: false,
    fix: "False. Arrows show where the energy goes, so they point from the food to the feeder: grass &rarr; rabbit &rarr; fox.", link: ["biology-ecology", 3] },
  { s: "bio", t: "When comparing two areas, quadrats are placed at random to avoid bias.", a: true,
    fix: "Yes. If you chose where they went, you might pick the interesting spots. Random coordinates keep the sample fair.", link: ["biology-ecology", 4] },
  { s: "bio", t: "Decomposers return carbon dioxide to the air and mineral ions to the soil.", a: true,
    fix: "Yes. They break down dead material and waste, and respire as they do it. They work fastest when warm, moist and with oxygen.", link: ["biology-ecology", 5] },
  { s: "bio", t: "Biodiversity means the total number of organisms living in an area.", a: false,
    fix: "False. Biodiversity is the variety of different species in an ecosystem. High biodiversity makes an ecosystem more stable.", link: ["biology-ecology", 6] }
]);
