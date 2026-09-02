/* ==========================================================
   Base 5 - Autumn 1 targets
   Shared by the student page (/my-targets.html) and the
   teacher page (/teacher/milestones.html), so the wording
   only ever has to be edited once, here.
   ========================================================== */

var BASE5_STUDENTS = ["JT","LW","EGW","LP","LC","HK"];
var BASE5_KEY = "base5.targets.autumn1.v1";

var BASE5_PILLARS = [
{
  name:"Aesthetic and Creative",
  targets:[{
    id:"ac1",
    title:"Sculpture and ceramics",
    statement:"I can create a small-scale sculpture through experimentation, evaluation, and review.",
    ms:{
      LC:"I can explore different sculpture materials and tools.",
      LP:"I can develop an idea for a small-scale sculpture through sketches or models.",
      LW:"I can create a small-scale sculpture using techniques I have practised.",
      EGW:"I can experiment with different ways to shape, join and build materials.",
      HK:"I can evaluate my sculpture and identify what works well and what could be improved.",
      JT:"I can make changes based on my evaluation and explain how my sculpture developed."
    }
  }]
},
{
  name:"Human and Social",
  targets:[{
    id:"hs1",
    title:"Weather and natural hazards",
    statement:"I can discuss the causes of weather hazards, for example tropical storm, hurricane, deep depression (UK).",
    ms:{
      LC:"I can name different types of weather hazards, such as hurricanes, tropical storms and deep depressions.",
      LP:"I can discuss in detail why weather hazards develop, using geographical vocabulary and explaining how factors such as air pressure, ocean temperature, moisture and global atmospheric circulation interact.",
      LW:"I can explain how different conditions work together to create weather hazards, including tropical storms and UK depressions.",
      EGW:"I can compare the causes of tropical weather hazards with weather hazards that affect the UK.",
      HK:"I can describe what happens during a weather hazard, including strong winds, heavy rain and flooding.",
      JT:"I can identify some of the conditions that cause severe weather hazards, such as warm oceans, low air pressure and strong winds."
    }
  }]
},
{
  name:"Relational (PSHE and RSE)",
  targets:[{
    id:"rel1",
    title:"Empathy and active listening",
    statement:"I can begin to demonstrate empathy and understanding towards people from different backgrounds and cultures. I can begin to practise active listening and empathy towards peers.",
    ms:{
      LC:"I can show that I am listening when someone else is speaking.",
      LP:"I can recognise how another person might be feeling and respond appropriately.",
      LW:"I can repeat or summarise what someone has said to show I have understood.",
      EGW:"I can adapt how I listen and respond depending on another person's feelings, needs and point of view.",
      HK:"I can use active listening skills and empathy to support positive conversations with peers.",
      JT:"I can take turns in a conversation and avoid interrupting."
    }
  }]
},
{
  name:"Preparation for Adulthood",
  targets:[
  {
    id:"pfa1",
    title:"Confidence in personal abilities and decisions",
    statement:"I can explore ways of building confidence in personal abilities and decisions at home and at school or work. I can recognise how confidence can influence actions, both good and bad.",
    ms:{
      LC:"I can recognise something I am good at or feel confident doing.",
      LP:"I can make informed decisions independently, evaluate the outcome, and adapt my approach when needed.",
      LW:"I can explain why I have made a particular decision and reflect on how it went.",
      EGW:"I can use my strengths and previous experiences to approach new challenges with greater confidence.",
      HK:"I can identify strategies that help me feel more confident when making decisions.",
      JT:"I can make a simple choice for myself at home, school or work."
    }
  },
  {
    id:"pfa2",
    title:"Shopping list to a budget",
    statement:"I can create a shopping list for a specific purpose that follows a provided budget. I can identify essential food items needed for a basic weekly meal plan within a given budget.",
    ms:{
      LC:"I can identify some items needed for a specific shopping task.",
      LP:"I can compare prices and make sensible choices to get everything needed within budget.",
      LW:"I can create a shopping list that stays within a provided budget.",
      EGW:"I can create and justify a cost-effective shopping list, adjusting quantities or choices to meet the purpose while staying within budget.",
      HK:"I can choose appropriate items for a shopping list from a selection.",
      JT:"I can create a simple shopping list and check the prices of the items."
    }
  }]
},
{
  name:"Physical World and Exploration",
  targets:[
  {
    id:"pwe1",
    title:"How humans have shaped the local environment",
    statement:"I can explore the local environment and identify how humans have physically shaped the environment.",
    ms:{
      LC:"I can notice and name features in the local environment that have been made or changed by people.",
      LP:"I can evaluate how human activity has shaped the local environment over time, using evidence from observations, maps or other sources.",
      LW:"I can explain why people have changed parts of the local environment and what those changes are used for.",
      EGW:"I can compare different examples of human changes in the local area and explain their positive and negative effects.",
      HK:"I can identify examples of how humans have physically changed the local area, such as roads, buildings, paths and parks.",
      JT:"I can describe how a local place has been changed by human activity."
    }
  },
  {
    id:"pwe2",
    title:"Training goals for a sport",
    statement:"I can set training goals for a particular sport.",
    ms:{
      LC:"I can identify a sport I want to improve in and name one skill involved.",
      LP:"I can create a short training plan with specific goals, practice activities and ways to review improvement.",
      LW:"I can choose a simple training goal linked to a particular sport.",
      EGW:"I can set challenging but achievable training goals, justify my choices and adapt my plan based on performance and progress.",
      HK:"I can set a clear training goal and describe what I need to practise to achieve it.",
      JT:"I can set a realistic training goal and explain how I will measure my progress."
    }
  }]
},
{
  name:"Scientific and Environmental",
  targets:[{
    id:"sci1",
    title:"Microorganisms and plant life",
    statement:"I can define microorganisms, name microorganisms, and describe their characteristics and roles in daily life, including food production, medicine, the environment, health and hygiene. I can understand terms related to plant life: flower, root, stem, trunk, branch, seed.",
    ms:{
      LC:"I can describe where each part is found and what it looks like.",
      LP:"I can describe some characteristics of microorganisms, including where they are found and how they can spread or reproduce.",
      LW:"I can use scientific vocabulary to explain how plant structures work together to support growth, reproduction and survival.",
      EGW:"I can name different types of microorganisms, such as bacteria, fungi and viruses.",
      HK:"I can compare the parts of different plants and trees and explain how their structures are similar or different.",
      JT:"I can explain the basic function of different plant parts, such as roots taking in water and stems supporting the plant."
    }
  }]
},
{
  name:"Digital Media",
  targets:[{
    id:"dig1",
    title:"Parts of a computer",
    statement:"I can understand that a computer is made up of different parts and each has a special job.",
    ms:{
      LC:"I can recognise and name some basic parts of a computer, such as the screen, keyboard and mouse.",
      LP:"I can explain how a range of computer components work together as a system and choose appropriate parts for different tasks.",
      LW:"I can explain how different computer parts work together to help me complete a task.",
      EGW:"I can identify input, output and storage devices and explain their different purposes.",
      HK:"I can match different computer parts to their names.",
      JT:"I can describe the job of common computer parts, such as the keyboard, mouse, monitor and speakers."
    }
  }]
},
{
  name:"English",
  targets:[
  {
    id:"eng1",
    title:"Retrieving textual evidence",
    statement:"I can identify and retrieve relevant textual evidence from texts to support ideas.",
    ms:{
      LC:"I can find evidence about a person, place or event.",
      LP:"I can find evidence linked to a given idea or theme.",
      LW:"I can find evidence about a person, place or event.",
      EGW:"I can locate evidence that answers a question.",
      HK:"I can find evidence about a person, place or event.",
      JT:"I can find evidence about a person, place or event."
    }
  },
  {
    id:"eng2",
    title:"The purpose of punctuation",
    statement:"I can identify the purpose of punctuation in a sentence, for example why brackets are used, and explain the impact.",
    ms:{
      LC:"I can identify how punctuation helps me understand whether a sentence is a statement, question or command.",
      LP:"I can identify more complex punctuation such as brackets and apostrophes.",
      LW:"I can use and explain punctuation accurately to communicate meaning, purpose and tone in my own writing and in texts I read.",
      EGW:"I can identify the purpose of punctuation in a sentence.",
      HK:"I can explain how changing punctuation can alter the meaning or tone of a sentence.",
      JT:"I can choose appropriate punctuation for different sentence types, including statements, questions and commands."
    }
  },
  {
    id:"eng3",
    title:"Paragraphs",
    statement:"I can use paragraphs as a way to group related material.",
    ms:{
      LC:"I can use paragraphs as a way to group related material.",
      LP:"I can organise my writing into clear paragraphs.",
      LW:"I can use paragraphs as a way to group related material.",
      EGW:"I can organise my ideas into clear paragraphs.",
      HK:"I can use paragraphs as a way to group related material.",
      JT:"I can use paragraphs as a way to group related material."
    }
  }]
},
{
  name:"Maths",
  targets:[
  {
    id:"mat1",
    title:"Scale, mental methods and formulas",
    statement:"I can use scale factors, scale diagrams and maps. I can work out mentally the sum and difference of two 2-digit numbers, the complement of a number to 100, and the sum and difference of multiples of 10, 100 and 1,000. I can use simple formulas expressed in words.",
    ms:{
      LC:"I can multiply whole numbers mentally by 10, 100 and 1,000 and choose efficient mental strategies for addition and subtraction.",
      LP:"I can use simple formulas expressed in words for one or two-step operations.",
      LW:"I can find the complement of a number to 100 and mentally add or subtract two 2-digit numbers with support.",
      EGW:"I can use scale factors, scale diagrams and maps.",
      HK:"I can recall number bonds to 10 and use them to solve simple mental calculations.",
      JT:"I can find the complement of a number to 100 and mentally add or subtract two 2-digit numbers with support."
    }
  },
  {
    id:"mat2",
    title:"Sequences, squares and fractions",
    statement:"I can generate terms and the nth term of linear sequences. I can calculate the square of one-digit and two-digit numbers. I can find, recognise and simplify equivalent fractions, working confidently with mixed numbers.",
    ms:{
      LC:"I can recognise, convert and work with improper fractions and mixed numbers.",
      LP:"I can calculate the square of one-digit and two-digit numbers.",
      LW:"I can generate equivalent fractions by multiplying or dividing the numerator and denominator by the same number.",
      EGW:"I can generate terms and the nth term of linear sequences.",
      HK:"I can simplify fractions to their simplest form and explain how I know they are equivalent.",
      JT:"I can confidently simplify, compare and manipulate equivalent fractions, including converting between improper fractions and mixed numbers and explaining the methods I use."
    }
  },
  {
    id:"mat3",
    title:"Vectors, discounts and transformations",
    statement:"I can use and read vector notation. I can calculate discounts in multiples of 5% on amounts of money. I can explore transformations such as rotations, reflections and tessellations.",
    ms:{
      LC:"I can recognise and create simple tessellating patterns using repeating shapes.",
      LP:"I can calculate discounts in multiples of 5% on amounts of money.",
      LW:"I can describe how rotations, reflections and translations have been used to create a repeating pattern.",
      EGW:"I can use and read vector notation.",
      HK:"I can rotate and reflect shapes accurately using a grid or practical resources.",
      JT:"I can create and analyse complex repeating patterns, combining transformations and explaining why particular shapes tessellate successfully."
    }
  }]
}
];
