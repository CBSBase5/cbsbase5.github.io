/* ==========================================================
   Base 5 - Relational (PSHE & RSE) targets for BridgeLink Buddy
   From the trust's "26/27 SB Relational Pillar" plan. Autumn 2 is
   "Building Connections": three targets at each tier, choose one,
   each with its milestones. The staff Targets page sends these to
   the Bank tab of BridgeLink Buddy, where "Plan a term" picks them
   up for each student's Wider tier.

   Only Autumn 2 is here on purpose: Buddy copies a term's school
   targets into its Bank tab only when that term is not there yet,
   so adding a later term early would stop that term's school
   targets arriving.

   Target wording is BridgeLink's own (kept as it is, so it matches
   in BridgeLink); milestone wording is the trust's, with only the
   doubled "and and" tidied. flag: marked ** in the trust's plan.

   B5BLNAMES: BridgeLink's name (the bold line above each target) for
   the PSHE Tier 1 list, read from BridgeLink's Relational page, for
   the BridgeLink copy list. Curriculum wording only; nothing about
   any student. ASCII only.
   ========================================================== */
window.B5RELATIONAL = {
  term: "Autumn 2",
  pillar: "Relational (PSHE & RSE)",
  subject: "Building connections",
  source: "26/27 SB Relational Pillar",
  targets: [
    { tier: "Tier 1", title: "Assertiveness in relationships",
      goal: "I can explore assertiveness in relationships",
      steps: ["I can understand what it feels like in my body when I don't want to do something",
              "I can understand how to say 'no' when I don't want to do something",
              "I can really listen when someone else says 'no'"] },
    { tier: "Tier 1", title: "Positive qualities of healthy relationships",
      goal: "I can explore positive qualities of healthy relationships",
      steps: ["I understand that relationships can cause strong feelings and emotions",
              "I understand the features of positive and stable relationships",
              "I understand that all relationships have positive and less positive aspects"] },
    { tier: "Tier 1", title: "Staying safe in different settings",
      goal: "I can identify basic safety rules and strategies for personal safety in different settings (home, school, community, online)",
      steps: ["I can identify basic safety rules in familiar settings",
              "I can recognise potential risks in different environments",
              "I can choose a safe action in a given situation"] },
    { tier: "Tier 2", title: "Power in relationships",
      goal: "I can explore power in relationships",
      steps: ["I can identify characteristics and benefits of positive, strong, supportive relationships",
              "I understand what expectations might be of having a romantic relationship including the age of consent",
              "I understand what is meant by consent in all personal relationships including sexual ones and understand capacity and withdrawing consent"] },
    { tier: "Tier 2", title: "Being in control of myself in relationships",
      goal: "I can explore being in control of myself and still have successful and healthy relationships",
      steps: ["I can identify types of long-term relationships, including their legal status",
              "I can outline the differences between lust, attraction and attachment in relationships",
              "I can differentiate the elements present in different types of long-term relationship"] },
    { tier: "Tier 2", title: "Consent and respecting boundaries", flag: true,
      goal: "I can understand the concept of consent (in peer and intimate relationships) and the importance of respecting others' boundaries",
      steps: ["I can explain what consent means",
              "I can recognise situations where boundaries may be crossed",
              "I can demonstrate appropriate behaviour when consent is refused or withdrawn"] },
    { tier: "Tier 3", title: "Managing control and coercion in relationships",
      goal: "I can explore managing Control and Coercion in Relationships",
      steps: ["I understand what is meant by control, power balance and coercion in a relationship",
              "I understand that sex is a positive part of adult relationships and the reasons people choose to have and not have sex",
              "I understand what sexual harassment and violence looks like and is"] },
    { tier: "Tier 3", title: "Healthy and unhealthy long-term relationships",
      goal: "I can explore healthy, long-term relationships and understand what unhealthy relationships look like.",
      steps: ["I can identify types of long-term relationships, including their legal status",
              "I can outline the differences between lust, attraction and attachment in relationships",
              "I understand the benefits of healthier relationships and connection",
              "I can understand what sexual violence is and understand the legality including strangulation and rape",
              "I know the support available when relationships are unsafe and recognise the indicators of Domestic Abuse",
              "I know what Female Genital Mutilation (FGM) and breast ironing/flattening are and why they are illegal"] },
    { tier: "Tier 3", title: "LGBTQ+ and relationships",
      goal: "I can respectfully explore LBGTQ+ and relationships",
      steps: ["I can identify different sexual orientations and relationship types, using appropriate and respectful language.",
              "I can explain that people may experience relationships, attraction and identity differently, and recognise the importance of respect and acceptance.",
              "I can explore LGBTQ+ relationships and identities respectfully, challenging stereotypes and recognising that healthy relationships share the same qualities, including trust, consent, respect and appropriate boundaries."] }
  ]
};

/* the rows Buddy's Bank tab takes: pillar, subject, topic, scheme, tier, kind, text */
window.B5RELATIONAL.rows = function(){
  var R = window.B5RELATIONAL, out = [];
  R.targets.forEach(function(t){
    out.push({ pillar: R.pillar, subject: R.subject, topic: t.title, scheme: "wider", tier: t.tier, kind: "goal", text: t.goal });
    t.steps.forEach(function(s){ out.push({ pillar: R.pillar, subject: R.subject, topic: t.title, scheme: "wider", tier: t.tier, kind: "step", text: s }); });
  });
  return out;
};

window.B5BLNAMES = [
  ["Who am I, who are we", "I can identify and describe different emotions and their causes"],
  ["Who am I, who are we", "I can begin to develop basic communication skills to express thoughts, feelings, and needs effectively"],
  ["Who am I, who are we", "I can recognise and respect similarities and differences between themselves and others"],
  ["Embracing change", "I can begin to recognize and express emotions in myself and others"],
  ["Embracing change", "I can outline that physical changes that occur during puberty"],
  ["Embracing change", "I can begin to explore achievable short-term goals"],
  ["Diversity and inclusion", "I can begin to treat others with kindness and fairness, regardless of differences"],
  ["Diversity and inclusion", "I can demonstrate a positive attitude towards diversity in the classroom and community"],
  ["Diversity and inclusion", "I can recognise and respect similarities and differences in others, such as abilities, interests, and backgrounds"],
  ["Building connections", "I can explore assertiveness in relationships"],
  ["Building connections", "I can explore positive qualities of healthy relationships"],
  ["Building connections", "I can identify basic safety rules and strategies for personal safety in different settings (home, school, community, online)"],
  ["Building connections", "Is able explore being in control of social media and how it portrays relationships"],
  ["Building connections", "I can explore being in control of personal space"],
  ["Wellbeing", "I can understand the importance of personal hygiene and grooming and lifestyle choices on physical and emotional health."],
  ["Wellbeing", "I can understand the importance of a balanced diet, regular exercise, and sufficient sleep for physical and mental well-being"],
  ["Wellbeing", "I can develop a positive mindset toward physical activity and self-care routines, understanding their impact on long-term health"],
  ["Wellbeing", "I can identify healthy and unhealthy habits (e.g., sugary snacks vs. fruit) and make informed choices about nutrition and hydration"],
  ["Wellbeing", "I can begin to explore strategies for managing stress and anxiety."],
  ["Dreams and Goals: Ambitions and aspirations", "I can consider coping strategies when things don't go to plan"],
  ["Dreams and Goals: Ambitions and aspirations", "I can explore the impact of money and earnings"],
  ["Dreams and Goals: Ambitions and aspirations", "I can look at other people and their goals"],
  ["Dreams and Goals: Ambitions and aspirations", "I can think about my dreams and goals"],
  ["Dreams and Goals: Ambitions and aspirations", "I can explore my personal strengths"]
];
