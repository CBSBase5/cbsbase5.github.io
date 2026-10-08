/* Daily drop: quick Biology questions (AQA 8461, Foundation, content on both
   Combined Science and Separate Biology). Each one takes a minute or two.
   link: [activity id, chunk number] of the chunk that teaches it. */
window.EGWDAILY = (window.EGWDAILY || []).concat([

  /* ---------- Cells and transport ---------- */
  { s: "bio", type: "mc", q: "Where in a cell are proteins made?",
    options: ["Ribosomes", "Mitochondria", "The nucleus", "The cell membrane"], answer: 0,
    hint: "They are tiny, and found in animal, plant and bacterial cells.",
    why: "Proteins are made at the <b>ribosomes</b>. The nucleus holds the genetic material that carries the instructions, and mitochondria are where aerobic respiration happens.",
    link: ["biology-cells", 2] },

  { s: "bio", type: "mc", q: "A sperm cell is packed with mitochondria. Why is that useful?",
    options: ["They help it photosynthesise", "They release energy for swimming", "They store food for the embryo", "They carry the father's genes"], answer: 1,
    hint: "What happens in mitochondria, and what does a sperm cell spend its life doing?",
    why: "Mitochondria are where aerobic respiration happens, releasing energy. A sperm cell needs lots of energy to <b>swim</b> to the egg. The genes are in the head, in the nucleus.",
    link: ["biology-cells", 3] },

  { s: "bio", type: "num", q: "A cell is 0.03 mm wide. In a drawing, it is 15 mm wide. What is the magnification of the drawing?",
    boxes: [{ label: "Magnification", a: 500, tol: 0, post: "" }],
    hint: "Magnification = image size &divide; real size. Both are already in mm.",
    why: "15 &divide; 0.03 = <b>500</b>, so &times;500. Both sizes were in mm, so you could divide straight away. If one is in &micro;m, convert first (1 mm = 1000 &micro;m).",
    link: ["biology-cells", 4] },

  { s: "bio", type: "mc", q: "Root hair cells take in mineral ions from soil water, even though the concentration of ions in the soil is lower than inside the cell. Which process is this?",
    options: ["Osmosis", "Transpiration", "Active transport", "Diffusion"], answer: 2,
    hint: "Moving against the concentration gradient needs something extra.",
    why: "<b>Active transport</b> moves substances from a more dilute to a more concentrated solution, against the concentration gradient. It needs energy from respiration. Diffusion only goes from high to low concentration, and osmosis is about water.",
    link: ["biology-cells", 5] },

  { s: "bio", type: "num", q: "A potato cylinder had a mass of 5.0 g. After an hour in a dilute solution, its mass is 5.6 g. What is the percentage increase in mass?",
    boxes: [{ label: "Percentage increase", a: 12, tol: 0.05, post: "%" }],
    hint: "Change in mass &divide; starting mass &times; 100.",
    why: "Change = 5.6 &minus; 5.0 = 0.6 g. 0.6 &divide; 5.0 &times; 100 = <b>12%</b>. Always divide by the starting mass. Water moved into the potato cells by osmosis, because the solution was more dilute than the cells.",
    link: ["biology-cells", 5] },

  /* ---------- Organisation ---------- */
  { s: "bio", type: "mc", q: "What is the name of the part of an enzyme that the substrate fits into?",
    options: ["The receptor", "The nucleus", "The antigen", "The active site"], answer: 3,
    hint: "It is where the action happens.",
    why: "The substrate fits into the <b>active site</b>, which has a particular shape: the lock and key idea. If the shape changes (too hot, or the wrong pH), the enzyme is denatured.",
    link: ["biology-organisation", 2] },

  { s: "bio", type: "mc", q: "Which reagent tests for starch, and what colour shows starch is there?",
    options: ["Iodine solution: orange brown to blue black", "Benedict's solution: blue to brick red", "Biuret reagent: blue to purple", "Iodine solution: blue to brick red"], answer: 0,
    hint: "The starch test is the one with no heating and a very dark result.",
    why: "<b>Iodine</b> turns from orange brown to <b>blue black</b> with starch. Benedict's (heated) tests for sugars and Biuret tests for protein.",
    link: ["biology-organisation", 3] },

  { s: "bio", type: "num", q: "In the amylase practical, the starch is all broken down after 40 seconds. Work out the rate using rate = 1000 &divide; time.",
    boxes: [{ label: "Rate", a: 25, tol: 0, post: "" }],
    hint: "Put the time into the formula.",
    why: "1000 &divide; 40 = <b>25</b>. A shorter time means a faster reaction, which is why the formula divides by time: the bigger the rate, the faster the amylase worked.",
    link: ["biology-organisation", 4] },

  { s: "bio", type: "mc", q: "Which chamber of the heart pumps blood out to the rest of the body?",
    options: ["Right atrium", "Left ventricle", "Right ventricle", "Left atrium"], answer: 1,
    hint: "Ventricles pump blood out. Which side sends it to the body, not the lungs?",
    why: "The <b>left ventricle</b> pumps oxygenated blood to the body, so it has the thickest muscle wall. The right ventricle pumps blood to the lungs. Atria collect blood coming in.",
    link: ["biology-organisation", 5] },

  { s: "bio", type: "mc", q: "What does xylem carry in a plant?",
    options: ["Oxygen, from the leaves down to the roots", "Carbon dioxide, into the leaves", "Water and mineral ions, from the roots up to the leaves", "Dissolved sugars, around the whole plant"], answer: 2,
    hint: "Xylem is the plant's water pipe.",
    why: "<b>Xylem</b> carries water and mineral ions up from the roots. <b>Phloem</b> carries dissolved sugars around the plant (translocation). Gases get in and out of leaves by diffusion through the stomata.",
    link: ["biology-organisation", 8] },

  /* ---------- Infection and response ---------- */
  { s: "bio", type: "mc", q: "Which type of pathogen causes malaria?",
    options: ["A virus", "A bacterium", "A fungus", "A protist"], answer: 3,
    hint: "It surprises a lot of people. It is not a virus.",
    why: "Malaria is caused by a <b>protist</b>, carried by mosquitoes. Stopping mosquitoes breeding and using nets to avoid bites both reduce the spread.",
    link: ["biology-infection", 2] },

  { s: "bio", type: "mc", q: "Which of these describes phagocytosis?",
    options: ["A white blood cell surrounds a pathogen, takes it in and digests it", "A white blood cell makes antibodies that stick to a pathogen", "A white blood cell makes antitoxins against a poison", "The skin makes secretions that kill pathogens"], answer: 0,
    hint: "Phago means eating.",
    why: "<b>Phagocytosis</b> is a white blood cell engulfing and digesting a pathogen. Making antibodies and antitoxins are the other two ways white blood cells help. Skin secretions are a first defence, not done by white blood cells.",
    link: ["biology-infection", 4] },

  { s: "bio", type: "mc", q: "How does a vaccine protect you from a disease?",
    options: ["It stops the pathogen from ever entering your body", "Memory cells form, so if the real pathogen gets in, antibodies are made quickly", "It contains antibiotics that kill the pathogen", "It contains antibodies that stay in your blood for life"], answer: 1,
    hint: "Think about what your white blood cells remember.",
    why: "A vaccine contains a dead or inactive form of the pathogen. White blood cells make antibodies and <b>memory cells</b> stay behind. If the real pathogen gets in, the right antibodies are made fast, before you become ill.",
    link: ["biology-infection", 5] },

  { s: "bio", type: "mc", q: "Which of these diseases can be treated with antibiotics?",
    options: ["HIV", "A cold", "Gonorrhoea", "Measles"], answer: 2,
    hint: "Antibiotics only work on one type of pathogen. Which disease is caused by that type?",
    why: "Antibiotics kill <b>bacteria</b>. Gonorrhoea is caused by a bacterium, though some strains are now resistant. Measles, HIV and colds are caused by viruses, which antibiotics do not affect.",
    link: ["biology-infection", 6] },

  /* ---------- Photosynthesis and respiration ---------- */
  { s: "bio", type: "mc", q: "What are the products of photosynthesis?",
    options: ["Carbon dioxide and water", "Glucose and carbon dioxide", "Oxygen and water", "Glucose and oxygen"], answer: 3,
    hint: "Carbon dioxide and water go in. What comes out?",
    why: "carbon dioxide + water &rarr; <b>glucose + oxygen</b>, using light energy absorbed by chlorophyll. It is the reverse of aerobic respiration.",
    link: ["biology-bioenergetics", 1] },

  { s: "bio", type: "num", q: "In the pondweed practical, a student counts the bubbles given off in one minute, three times: 12, 15 and 12. What is the mean?",
    boxes: [{ label: "Mean", a: 13, tol: 0, post: "bubbles per minute" }],
    hint: "Add the three counts, then divide by 3.",
    why: "(12 + 15 + 12) &divide; 3 = 39 &divide; 3 = <b>13</b> bubbles per minute. Repeating and taking a mean makes the result more reliable.",
    link: ["biology-bioenergetics", 4] },

  { s: "bio", type: "mc", q: "Which word equation shows aerobic respiration?",
    options: ["glucose + oxygen &rarr; carbon dioxide + water", "glucose &rarr; lactic acid", "carbon dioxide + water &rarr; glucose + oxygen", "glucose &rarr; ethanol + carbon dioxide"], answer: 0,
    hint: "Aerobic means with oxygen.",
    why: "<b>Aerobic</b> respiration uses oxygen: glucose + oxygen &rarr; carbon dioxide + water. It happens mostly in the mitochondria. Glucose &rarr; lactic acid is anaerobic respiration in muscles, and the reverse equation is photosynthesis.",
    link: ["biology-bioenergetics", 5] },

  { s: "bio", type: "mc", q: "Why does your breathing rate go up when you exercise?",
    options: ["To take in more glucose", "To get more oxygen into the blood for faster respiration in the muscles", "To cool the body down", "To breathe out lactic acid"], answer: 1,
    hint: "Muscles need more energy. Which process releases it, and what does that process use?",
    why: "Working muscles respire faster, so they need more <b>oxygen</b> and make more carbon dioxide. Breathing rate and breath volume go up, and heart rate goes up too, to deliver oxygen and remove carbon dioxide faster.",
    link: ["biology-bioenergetics", 6] },

  /* ---------- Homeostasis and hormones ---------- */
  { s: "bio", type: "mc", q: "In a reflex arc, which neurone carries impulses from the receptor to the central nervous system?",
    options: ["Relay neurone", "Effector neurone", "Sensory neurone", "Motor neurone"], answer: 2,
    hint: "The receptor senses the stimulus. Which neurone is named after sensing?",
    why: "Receptor &rarr; <b>sensory neurone</b> &rarr; relay neurone (in the CNS) &rarr; motor neurone &rarr; effector. There is no such thing as an effector neurone: the effector is a muscle or gland.",
    link: ["biology-homeostasis", 2] },

  { s: "bio", type: "num", q: "In the ruler drop test, Leo catches the ruler at 14 cm, 18 cm and 10 cm. What is his mean catch distance?",
    boxes: [{ label: "Mean", a: 14, tol: 0, post: "cm" }],
    hint: "Total, then divide by how many tries.",
    why: "(14 + 18 + 10) &divide; 3 = 42 &divide; 3 = <b>14 cm</b>. A shorter catch distance means a faster reaction time.",
    link: ["biology-homeostasis", 3] },

  { s: "bio", type: "mc", q: "Compared with the nervous system, how do hormones act?",
    options: ["More quickly, and their effects last longer", "More quickly, but their effects are shorter", "More slowly, and their effects are shorter", "More slowly, but their effects last longer"], answer: 3,
    hint: "Hormones travel in the blood, not along neurones.",
    why: "Hormones are carried in the <b>blood</b> to a target organ, so they act <b>more slowly</b> than nerve impulses, but their effects <b>last longer</b>.",
    link: ["biology-homeostasis", 4] },

  { s: "bio", type: "mc", q: "Which hormone makes glucose move from the blood into cells?",
    options: ["Insulin", "Oestrogen", "Testosterone", "FSH"], answer: 0,
    hint: "It is made by the pancreas after a meal.",
    why: "When blood glucose rises, the pancreas releases <b>insulin</b>. Glucose moves into cells, and in liver and muscle cells extra glucose is stored as glycogen. In type 1 diabetes, the pancreas makes too little insulin.",
    link: ["biology-homeostasis", 5] },

  /* ---------- Inheritance and evolution ---------- */
  { s: "bio", type: "num", q: "A human body cell has 46 chromosomes. How many chromosomes are in a human egg cell?",
    boxes: [{ label: "Chromosomes", a: 23, tol: 0, post: "" }],
    hint: "Gametes are made by meiosis.",
    why: "Gametes have <b>half</b> the number of chromosomes: 46 &divide; 2 = <b>23</b>. At fertilisation, an egg and a sperm join and the full 46 is restored.",
    link: ["biology-inheritance", 1] },

  { s: "bio", type: "mc", q: "What is a gene?",
    options: ["A type of cell division", "A small section of DNA that codes for a particular protein", "A whole chromosome", "All of the genetic material of an organism"], answer: 1,
    hint: "Smaller than a chromosome.",
    why: "A <b>gene</b> is a small section of DNA on a chromosome, coding for a sequence of amino acids that makes a specific protein. All the genetic material is the genome.",
    link: ["biology-inheritance", 2] },

  { s: "bio", type: "num", q: "In mice, black fur (B) is dominant to white fur (b). A Bb mouse is crossed with a bb mouse. What percentage of the offspring would you expect to have white fur?",
    boxes: [{ label: "White fur", a: 50, tol: 0, post: "%" }],
    hint: "Draw the Punnett square. White fur needs bb.",
    why: "Gametes: B or b from one parent, b or b from the other. Boxes: Bb, Bb, bb, bb. Two out of four are bb, so <b>50%</b>, a 1 : 1 ratio.",
    link: ["biology-inheritance", 3] },

  { s: "bio", type: "mc", q: "Which sex chromosomes does a human female have?",
    options: ["YY", "Just one X", "XX", "XY"], answer: 2,
    hint: "Males have one Y.",
    why: "Females are <b>XX</b> and males are XY. Every egg carries an X, and half the sperm carry an X and half a Y, so the chance of a girl is 50%.",
    link: ["biology-inheritance", 4] },

  { s: "bio", type: "mc", q: "Which statement is the key idea of natural selection?",
    options: ["Organisms change during their lives to suit their environment, then pass the changes on", "Humans choose which animals and plants breed together", "All individuals in a species are identical", "Individuals best suited to their environment are more likely to survive, breed and pass on their alleles"], answer: 3,
    hint: "Variation already exists. What happens to the individuals who suit the conditions best?",
    why: "There is variation in a population. Those with characteristics <b>best suited</b> to the environment are more likely to survive and breed, so their alleles become more common. Changes during a lifetime are not inherited, and humans choosing is selective breeding.",
    link: ["biology-inheritance", 5] },

  /* ---------- Ecology ---------- */
  { s: "bio", type: "mc", q: "Which of these is an abiotic factor?",
    options: ["Light intensity", "The number of predators", "A new pathogen", "Competition from another species"], answer: 0,
    hint: "Abiotic means not living.",
    why: "<b>Light intensity</b> is abiotic (non living), like temperature, moisture and wind. Predators, pathogens and competitors are living, so they are biotic factors.",
    link: ["biology-ecology", 1] },

  { s: "bio", type: "mc", q: "A cactus has spines instead of leaves, which cuts down water loss. What kind of adaptation is this?",
    options: ["Structural", "Behavioural", "Functional"], answer: 0,
    hint: "Is it a body feature, an action, or a process inside?",
    why: "Spines are a feature of the body, so it is a <b>structural</b> adaptation. Behavioural is about actions (like migrating) and functional is about processes inside (like making very concentrated urine).",
    link: ["biology-ecology", 2] },

  { s: "bio", type: "mc", q: "In the food chain seaweed &rarr; limpet &rarr; crab &rarr; seagull, which is the secondary consumer?",
    options: ["Seagull", "Seaweed", "Crab", "Limpet"], answer: 2,
    hint: "Seaweed is the producer. Count along from there.",
    why: "Seaweed is the producer, the limpet is the primary consumer, the <b>crab</b> is the secondary consumer and the seagull is the tertiary consumer.",
    link: ["biology-ecology", 3] },

  { s: "bio", type: "num", q: "Sam places 8 quadrats, each 1 m&sup2;, at random in a field of 300 m&sup2;. She counts 24 buttercups in total.",
    boxes: [{ label: "Mean per quadrat", a: 3, tol: 0, post: "" }, { label: "Estimated buttercups in the field", a: 900, tol: 0, post: "" }],
    hint: "Mean = total &divide; number of quadrats. Then scale up to the whole field.",
    why: "Mean = 24 &divide; 8 = <b>3</b> per m&sup2;. Estimate = 3 &times; 300 = <b>900</b> buttercups. Random placing avoids bias, and more quadrats give a more reliable estimate.",
    link: ["biology-ecology", 4] },

  { s: "bio", type: "mc", q: "Which process takes carbon dioxide out of the air?",
    options: ["Respiration", "Combustion", "Decay by microorganisms", "Photosynthesis"], answer: 3,
    hint: "Plants use carbon dioxide to make glucose.",
    why: "<b>Photosynthesis</b> removes carbon dioxide from the air. Respiration (by animals, plants and decomposers) and combustion of fuels both put carbon dioxide back.",
    link: ["biology-ecology", 5] }

]);
