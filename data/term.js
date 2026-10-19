/* ==========================================================
   Base 5 - this term
   Autumn 2, 2026: "If we could time travel, should we?"

   The index and the day page both read this file. To set up a
   new week you only edit the weeks list at the bottom. The
   timetable and the session text sit above it and do not
   change week to week.

   Plain ASCII only. Use ' for apostrophes.
   ========================================================== */

window.B5TERM = {

  name: "Autumn 2",
  question: "If we could time travel, should we?",
  firstDay: "2026-11-03",
  lastDay: "2026-12-18",

  /* --------------------------------------------------------
     THE TIMETABLE. The same every week.
     Each slot: start, end, and the session key it uses.
     -------------------------------------------------------- */
  timetable: {
    mon: [
      ["9:30","9:45","breathein"], ["9:45","10:00","brain"], ["10:00","10:30","cc"],
      ["10:30","10:45","phse"], ["10:45","11:15","maths"], ["11:15","12:00","forest"],
      ["12:00","12:30","lunch"], ["12:30","1:15","project"], ["1:15","2:00","aesthetic"],
      ["2:00","2:30","breatheout"]
    ],
    tue: [
      ["9:30","9:45","breathein"], ["9:45","10:00","brain"], ["10:00","10:30","cc"],
      ["10:30","2:00","trip"],
      ["2:00","2:30","breatheout"]
    ],
    wed: [
      ["9:30","9:45","breathein"], ["9:45","10:00","brain"], ["10:00","10:30","cc"],
      ["10:30","11:15","digital"], ["11:15","11:45","core"],
      ["11:45","12:30","lunch"], ["12:30","1:15","project"], ["1:15","2:00","physical"],
      ["2:00","2:30","breatheout"]
    ],
    thu: [
      ["9:30","9:45","breathein"], ["9:45","10:00","brain"], ["10:00","10:30","cc"],
      ["10:30","10:45","phse"], ["10:45","11:15","maths"], ["11:15","12:00","hort"],
      ["12:00","12:30","lunch"], ["12:30","2:00","project"],
      ["2:00","2:30","breatheout"]
    ],
    fri: [
      ["9:30","9:45","breathein"], ["9:45","10:00","brain"], ["10:00","10:30","cc"],
      ["10:30","10:45","phse"], ["10:45","11:45","core"],
      ["11:45","12:45","lunch"], ["12:45","1:30","pe"], ["1:30","2:00","pfa"],
      ["2:00","2:30","breatheout"]
    ]
  },

  /* What each day is like, in a line. Used on the index cards
     and at the top of each day page. A week can override it. */
  dayLines: {
    mon: "Forest school with Vernon before lunch, then your project and something creative to finish.",
    tue: "Brain games and CC first, then out on the trip from half ten.",
    wed: "Digital media with Andy, then your project and the physical world after lunch.",
    thu: "Horticulture with Kara in the morning, then an hour and a half on your project or GCSE.",
    fri: "The longest maths and english slot of the week, then PE and PFA."
  },

  /* --------------------------------------------------------
     SESSIONS. The words for each block.
     type sets the colour: breathe, break, key, work, make, plain
     options: [label, text]   links: [text, href]
     ways: the "other ways to do it" chips
     A week can add to any of these (see weeks below).
     -------------------------------------------------------- */
  sessions: {

    breathein: { title:"Breathe in", line:"Arrivals. Coming in and settling. Nobody will ask you anything yet.", type:"breathe", plain:true },
    breatheout:{ title:"Breathe out", line:"Back to the present. Say what was alright about today, or say nothing.", type:"breathe", plain:true },
    lunch:     { title:"Lunch", line:"", type:"break", plain:true },

    brain: {
      title:"Brain games", line:"A quick puzzle to wake up.", type:"make",
      sub:"A quarter of an hour to start the day.",
      body:"Fifteen minutes of puzzles, quick games and whatever is on the board. Nothing in it gets marked and nothing gets written up.",
      options:[["Play","Take one on, on your own or with someone."],["Watch","Sit near it and see how other people are doing it."],["Swap","Drop one that is annoying you and pick another."]],
      links:[["The game vault","/games/"],["Tools","/tools/"]],
      ways:["Do the same one every day","Work with Jay or HB","Bring one in of your own","Sit this one out"]
    },

    cc: {
      title:"CC", line:"Cultural calendar.", type:"key",
      heading:"Cultural calendar",
      sub:"Half an hour on a day worth marking.",
      body:"Half an hour each morning on whatever the calendar is marking this week, and why people bother to mark it at all.",
      options:[["Find","One thing about it you did not know yesterday."],["Talk","Tell someone else the bit that stuck."],["Then","What would someone a hundred years ago have made of it?"]],
      links:[["Cultural calendar shelf","/practice/shelves.html#cc"]],
      ways:["Listen and say nothing","Draw it instead","Work with Jay or HB","Sit this one out"]
    },

    phse: {
      title:"PHSE", line:"A quarter of an hour with Willow.", type:"plain",
      sub:"A quarter of an hour, after CC.",
      body:"Talking rather than writing, and there is nothing to hand in at the end of it. Willow leads it.",
      options:[["Join in","Say what you think when you have something to say."],["Listen","Take it in and say nothing. That still counts."],["Step out","Leave the room and come back when you want to."]],
      links:[["PHSE shelf","/practice/shelves.html#phse"]],
      ways:["Write it down instead of saying it","Answer only the bits you want to","Sit at the edge of the room","Skip it"]
    },

    maths: {
      title:"Maths", line:"Half an hour of maths.", type:"work",
      sub:"Half an hour, before going outside.",
      body:"Half an hour of maths. Your HQ folder has the newest activity for you, or pick anything from the library. Exam papers are still on the shelves.",
      hq:true,
      links:[["Maths in the library","/practice/#maths"],["Exam papers and older maths","/practice/shelves.html#maths"]]
    },

    core: {
      title:"Maths / English", line:"Whichever one you are set.", type:"work",
      heading:"Maths or English",
      sub:"One slot covering both subjects.",
      body:"Maths or English, whichever you fancy or Jay suggests. Your HQ folder has the newest activity for you, or pick anything from the library.",
      hq:true,
      links:[["English in the library","/practice/#english"],["Maths in the library","/practice/#maths"],["Exam papers and older work","/practice/shelves.html"]]
    },

    forest: {
      title:"Forest School with Vernon", line:"Outside, whatever the weather is doing.", type:"key",
      heading:"Forest School with Vernon",
      sub:"Outside for three quarters of an hour.",
      body:"Vernon runs this one. Outside whatever the weather is doing, so coats on if it is that sort of morning. People have been doing most of what happens out there for thousands of years.",
      links:[["Physical world shelf","/practice/shelves.html#pw"]],
      ways:["Just be outside","Work alongside Vernon","Take photos instead of notes","Stay near the fire"]
    },

    hort: {
      title:"Horticulture with Kara", line:"Outside, in the beds.", type:"key",
      heading:"Horticulture with Kara",
      sub:"Outside, in the beds.",
      body:"Kara runs this one. Outside for three quarters of an hour, gloves on if you want them. Whatever goes in the ground now is a message to the you of next spring.",
      links:[["Out and about in the library","/practice/#about"],["Science shelf","/practice/shelves.html#science"]],
      ways:["Stay outside the whole time","Work alongside Kara","Just dig","Watch for a bit first"]
    },

    digital: {
      title:"Digital Media with Andy", line:"Screens, kit and how it works.", type:"make",
      heading:"Digital media with Andy",
      sub:"Three quarters of an hour with Andy.",
      body:"Andy runs this one. Hands on with the kit rather than reading about it.",
      links:[["Digital media shelf","/practice/shelves.html#dm"]],
      ways:["Watch first, try after","Work with a partner","Take something apart","Sit this one out"]
    },

    project: {
      title:"Project / GCSE", line:"Whichever one you are on.", type:"work",
      heading:"Project or GCSE",
      sub:"Whichever one you are on.",
      body:"Two different things sharing a slot. This half term the project question is: if we could time travel, should we? Your answer can be anything you can make. If you are on GCSE work, your own HQ is the place to go.",
      hq:true,
      links:[["Idea Lab","/projects/ideas.html"],["My project","/projects/"],["Play It's Time","/projects/its-time.html"],["Exam papers","/practice/shelves.html#maths-gcse"]],
      ways:["Think it through out loud with Jay","Look at someone else's for a bit","Make a mess and tidy it later","Start again"]
    },

    aesthetic: {
      title:"Aesthetic and Creative", line:"Making something, at the end of the day.", type:"make",
      heading:"Aesthetic and creative",
      sub:"The last proper slot of the day.",
      body:"A making slot rather than a writing one. Jay will have the materials out.",
      links:[["Out and about in the library","/practice/#about"],["Aesthetic and creative shelf","/practice/shelves.html#ac"]],
      ways:["Make it and skip the screen","Help someone else with theirs","Make something tiny","Just watch"]
    },

    physical: {
      title:"Physical World and Exploration", line:"The world, and how it got this way.", type:"key",
      heading:"Physical world and exploration",
      sub:"The last slot of the day.",
      body:"Out and about, or looking at how places change over time.",
      links:[["Out and about in the library","/practice/#about"],["Physical world shelf","/practice/shelves.html#pw"]],
      ways:["Do it from a window","Work with Jay or HB","Go for a walk and talk about it","Sit this one out"]
    },

    pe: {
      title:"PE", line:"Three quarters of an hour off the chairs.", type:"key",
      sub:"Three quarters of an hour off the chairs.",
      body:"Moving about for three quarters of an hour. Taking part at whatever level suits you today counts as taking part.",
      links:[["Build your own training plan","/practice/training-plan.html"],["PE shelf","/practice/shelves.html#pe"]],
      ways:["Do your own thing","Work it out with Jay or HB","Keep score instead","Just move"]
    },

    pfa: {
      title:"PFA", line:"Preparation for adulthood, last thing.", type:"plain",
      sub:"The practical side of being an adult.",
      body:"Half an hour on the practical side of being an adult: the future you, sorted out a bit early. It closes the week, so if there is something you want covering, saying so is how it gets in.",
      links:[["Out and about in the library","/practice/#about"],["Life skills","/practice/life-skills.html"],["PFA shelf","/practice/shelves.html#pfa"]],
      ways:["Do it with Jay or HB","Watch someone else first","Pick one from another day","Not today"]
    },

    trip: {
      title:"Trip", line:"Out from half ten until two.", type:"key",
      sub:"Out from half ten until two.",
      body:"A long one, so lunch happens while you are out rather than back here. Jay will say where you are going and what the plan is before you leave.",
      options:[["Take","Ear defenders, a hood, something in your pocket to hold."],["Out","You can step away from whatever is happening at any point."],["Near","Jay and the staff are with you the whole time."]],
      wayslabel:"If it gets much",
      ways:["Say so to any adult","Go somewhere quieter with someone","Wait in the minibus","Ask to head back early"]
    }
  },

  /* --------------------------------------------------------
     THE WEEKS
     era:     the year this week "jumps" to. Decoration only.
     theme:   heading on the index. Leave "" for a plain one.
     sub:     the line under it. Leave "" and it writes one.
     days:    anything special about a day:
                off:true  no school that day
                title / line   replace the card title and line
                trip:     { where, body, prompts:[[label,text]] }
     sessions: add to a session for the whole week, e.g.
                cc: { line:"Remembrance.", body:"...", links:[["text","/href"]] }
              body replaces the default; links are added first.
     cc:      this week's cultural calendar focus, one line, e.g.
              "Remembrance". Shows on the index and on every CC block.
     feature: extra cards on the index for that week:
                { kicker, title, text, href, fill, w, sticker }
     -------------------------------------------------------- */
  weeks: [
    {
      n:1, start:"2026-11-03", end:"2026-11-06",
      cc:"",
      era:{ year:"2026", label:"Now" },
      theme:"Through the door",
      sub:"Four days. The first one starts at a museum.",
      days:{
        mon:{ off:true, line:"INSET day. No school, see you Tuesday." },
        tue:{
          title:"First day back",
          line:"Straight out to a local museum. The first trip back in time.",
          trip:{
            where:"A local museum",
            body:"First day back, and the whole of it is a trip back in time. A museum is a building full of things that survived. Nobody needs to write anything down, and nothing gets handed in.",
            prompts:[
              ["Pick one","If you could travel back to see one thing in there happen, which would it be?"],
              ["Oldest","Find the oldest thing in the building. Take a photo if you are allowed."],
              ["Should we?","Is there anything in there you would not want to go back and see?"]
            ]
          }
        }
      },
      feature:[]
    },
    {
      n:2, start:"2026-11-09", end:"2026-11-13",
      cc:"",
      era:{ year:"1999", label:"Dial up and floppy disks" },
      theme:"", sub:"", days:{}, sessions:{}, feature:[]
    },
    {
      n:3, start:"2026-11-16", end:"2026-11-20",
      cc:"",
      era:{ year:"1969", label:"One small step" },
      theme:"", sub:"", days:{}, sessions:{}, feature:[]
    },
    {
      n:4, start:"2026-11-23", end:"2026-11-27",
      cc:"",
      era:{ year:"1851", label:"Steam and soot" },
      theme:"", sub:"", days:{}, sessions:{}, feature:[]
    },
    {
      n:5, start:"2026-11-30", end:"2026-12-04",
      cc:"",
      era:{ year:"1066", label:"Arrows and castles" },
      theme:"", sub:"", days:{}, sessions:{}, feature:[]
    },
    {
      n:6, start:"2026-12-07", end:"2026-12-11",
      cc:"",
      era:{ year:"65,000,000 BC", label:"The dinosaurs again" },
      theme:"", sub:"", days:{}, sessions:{}, feature:[]
    },
    {
      n:7, start:"2026-12-14", end:"2026-12-18",
      cc:"",
      era:{ year:"3026", label:"A thousand years from now" },
      theme:"The last jump before Christmas",
      sub:"Five days, a trip on Tuesday, and home for Christmas on Friday.",
      days:{
        fri:{ title:"Last day of term", line:"The longest maths and english slot of the week, PE and PFA, then home for Christmas at half two." }
      },
      sessions:{}, feature:[]
    }
  ]
};

/* ----------------------------------------------------------
   Helpers shared by the index and the day page.
   ---------------------------------------------------------- */
(function(T){
  T.dayKeys = ["mon","tue","wed","thu","fri"];
  T.dayNames = { mon:"Monday", tue:"Tuesday", wed:"Wednesday", thu:"Thursday", fri:"Friday" };
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var MON3 = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function parse(iso){ var p=iso.split("-"); return new Date(+p[0], +p[1]-1, +p[2]); }
  function iso(d){ return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2); }
  T.iso = iso;
  T.todayIso = function(){ return iso(new Date()); };

  /* The date of a given day in a given week (weeks start on a Monday) */
  T.dateOf = function(week, key){
    var s = parse(week.start);
    var monday = new Date(s.getFullYear(), s.getMonth(), s.getDate() - ((s.getDay()+6)%7));
    var d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + T.dayKeys.indexOf(key));
    return d;
  };
  T.niceDate = function(d){ return T.dayNames[T.dayKeys[(d.getDay()+6)%7]]+" "+d.getDate()+" "+MONTHS[d.getMonth()]; };
  T.shortRange = function(w){
    var a=parse(w.start), b=parse(w.end);
    if(a.getMonth()===b.getMonth()) return a.getDate()+" - "+b.getDate()+" "+MON3[a.getMonth()];
    return a.getDate()+" "+MON3[a.getMonth()]+" - "+b.getDate()+" "+MON3[b.getMonth()];
  };

  /* Days of a week that actually have school */
  T.schoolDays = function(w){
    return T.dayKeys.filter(function(k){
      var dd = (w.days && w.days[k]) || {};
      if(dd.off) return false;
      var date = iso(T.dateOf(w,k));
      return date >= w.start && date <= w.end;
    });
  };

  /* The week we are in, or the next one up, or the last one */
  T.currentWeek = function(){
    var t = T.todayIso();
    for(var i=0;i<T.weeks.length;i++){ if(t <= T.weeks[i].end) return T.weeks[i]; }
    return T.weeks[T.weeks.length-1];
  };

  /* A session with any week additions folded in */
  T.session = function(key, week){
    var base = T.sessions[key] || { title:key, line:"", type:"plain" };
    var add = (week && week.sessions && week.sessions[key]) || null;
    var s = {}, k;
    for(k in base) s[k] = base[k];
    if(add){
      if(add.line) s.line = add.line;
      if(add.sub) s.sub = add.sub;
      if(add.body) s.body = add.body;
      if(add.options) s.options = add.options;
      if(add.links) s.links = add.links.concat(base.links || []);
    }
    if(key === "cc" && week && week.cc){
      s.line = "Cultural calendar: " + week.cc + ".";
      s.sub = "This week: " + week.cc + ".";
    }
    return s;
  };

  /* The subject a session belongs to, for its colour (s-<subject> in style.css) */
  var SUBJ = { maths:"maths", english:"english", core:"core", forest:"science", hort:"science", digital:"dm",
    project:"project", aesthetic:"ac", physical:"pw", pe:"pe", pfa:"pfa", phse:"phse", cc:"cc", brain:"brain", trip:"trip" };
  T.subjectOf = function(key){ return SUBJ[key] || ""; };

  /* Turns "1:15" into minutes past midnight, school day style */
  T.mins = function(t){
    var p=t.split(":"), h=+p[0], m=+p[1];
    if(h<8) h+=12;
    return h*60+m;
  };
  T.length = function(a,b){
    var m = T.mins(b)-T.mins(a);
    if(m===15) return "15 minutes";
    if(m===30) return "half an hour";
    if(m===45) return "45 minutes";
    if(m===60) return "an hour";
    if(m===90) return "an hour and a half";
    if(m===210) return "3 and a half hours";
    if(m>60) return Math.floor(m/60)+" hr "+(m%60)+" min";
    return m+" minutes";
  };
})(window.B5TERM);
