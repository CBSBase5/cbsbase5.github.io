/* Box cover config for the eight vault games that had no box art. */
function ext(col, n, dark){
  var s=[]; for(var i=1;i<=n;i++) s.push(i+'px '+i+'px 0 '+col);
  s.push((n+3)+'px '+(n+3)+'px 0 '+(dark||'rgba(0,0,0,.45)'));
  return 'text-shadow:'+s.join(',')+';';
}
function T(txt, style){ return '<span style="display:inline-block;'+style+'">'+txt+'</span>'; }

var COVERS = {
  "its-time": {
    vars:{base:"#1d1a4a",base2:"#120f33",accent:"#ff9a3c",sub:"#ffd27a",ribbon:"#ff9a3c",ribbonInk:"#1a1238",s1:"#ff9a3c",s2:"#ffd27a",s3:"#7fd6ff"},
    chip:"ARCADE", shot:"its-time-alt-gatesmash", shotStyle:"object-position:12% 50%",
    title:T("It's Time","font:900 italic 132px/1 Archivo;color:#ffb347;-webkit-text-stroke:5px #1a1238;paint-order:stroke fill;"+ext("#c2410c",9,"#000")),
    sub:"A TIME TRAVEL LAUNCHER",
    ribbon:"LAUNCH &middot; SMASH &middot; REPEAT",
    burst:["9","ERAS!"],
    tag:"EVERY YEAR AT ONCE",
    small:"Six time travellers. 27 lost inventions.",
    players:"1<br>PLAYER",
    spine:T("It's Time","font:900 italic 54px/1 Archivo;color:#ffb347;"+ext("#c2410c",4,"#000"))
  },
  "tiny-legends": {
    vars:{base:"#2a1d3a",base2:"#1a1126",accent:"#f6c945",sub:"#f3d9a4",ribbon:"#e98a3a",ribbonInk:"#1a1126",s1:"#e98a3a",s2:"#f6c945",s3:"#b48ad8"},
    chip:"PIXEL",
    title:T("TINY LEGENDS","font:700 98px/1 Silk;color:#f6c945;"+ext("#c2551f",8,"#000")),
    sub:"THE MEMORY HOUSE",
    ribbon:"FIGHT &middot; LISTEN &middot; REMEMBER",
    burst:["8","LEGENDS!"],
    tag:"AN ELDERLY APPRECIATION DAY GAME",
    small:"Five floors, 29 weapons and one locked door.",
    players:"1<br>PLAYER",
    spine:T("TINY LEGENDS","font:700 46px/1 Silk;color:#f6c945;"+ext("#c2551f",4,"#000"))
  },
  "last-stand": {
    vars:{base:"#13233a",base2:"#0b1526",accent:"#7fc8ff",sub:"#bfe3ff",ribbon:"#f6c945",ribbonInk:"#0b1526",s1:"#7fc8ff",s2:"#f6c945",s3:"#e05a4a"},
    chip:"PIXEL",
    title:'<span style="display:inline-flex;flex-direction:column;align-items:center;gap:6px">'+
      T("TINY LEGENDS","font:400 30px/1 Silk;letter-spacing:.3em;color:#f6c945")+
      T("LAST STAND","font:700 104px/1 Silk;color:#eaf4ff;"+ext("#3b6fb3",8,"#000"))+'</span>',
    sub:"HOLD ON TILL MORNING",
    ribbon:"BINGO NIGHT &middot; STORM NIGHT",
    burst:["4","BOSSES!"],
    tag:"AN ELDERLY APPRECIATION DAY GAME",
    small:"Rescue 13 neighbours and keep the hall standing.",
    players:"1 OR 2<br>PLAYERS",
    spine:T("LAST STAND","font:700 46px/1 Silk;color:#eaf4ff;"+ext("#3b6fb3",4,"#000"))
  },
  "jts-dugout": {
    vars:{base:"#0f2a1d",base2:"#081a11",accent:"#7ee08a",sub:"#c9f2c6",ribbon:"#f6c945",ribbonInk:"#081a11",s1:"#7ee08a",s2:"#f2f2ee",s3:"#f6c945"},
    chip:"MANAGER",
    title:T("JT's Dugout","font:400 116px/1 Slab;color:#f2f2ee;"+ext("#2f8a46",8,"#000")),
    sub:"RUN YOUR OWN CLUB",
    ribbon:"TRAIN &middot; PICK &middot; PLAY",
    burst:["3","CUPS!"],
    tag:"4 DIVISIONS &middot; 4 FORMATIONS",
    small:"The more you train, the luckier your team gets.",
    players:"1<br>MANAGER",
    spine:T("JT's Dugout","font:400 50px/1 Slab;color:#f2f2ee;"+ext("#2f8a46",4,"#000"))
  },
  "cue-the-sequence": {
    vars:{base:"#3a1f47",base2:"#22112b",accent:"#ffc247",sub:"#e9cdf2",ribbon:"#0a8fae",ribbonInk:"#fff",s1:"#ffc247",s2:"#0a8fae",s3:"#ef7724"},
    chip:"PHYSICS",
    title:'<span style="display:inline-flex;flex-direction:column;align-items:center;line-height:.85">'+
      T("CUE THE","font:900 italic 34px/1 Archivo;letter-spacing:.12em;color:#e9cdf2")+
      T("SEQUENCE","font:900 italic 92px/1 Archivo;color:#f6c945;-webkit-text-stroke:4px #071a1b;paint-order:stroke fill;"+ext("#ef7724",8,"#000"))+'</span>',
    sub:"POOL AGAINST CHALKY",
    ribbon:"SPOT THE RULE &middot; POT THE BALL",
    burst:["&#8734;","LEVELS!"],
    tag:"SEQUENCES AND THE NTH TERM",
    small:"Chalky aims better every level. Do you?",
    players:"1<br>PLAYER",
    spine:T("CUE THE SEQUENCE","font:900 italic 44px/1 Archivo;color:#f6c945;"+ext("#ef7724",4,"#000"))
  },
  "paragraph-dash": {
    vars:{base:"#2a2108",base2:"#1a1404",accent:"#f6c945",sub:"#ffe79a",ribbon:"#ff6fa8",ribbonInk:"#1a1404",s1:"#f6c945",s2:"#ff6fa8",s3:"#5fd8de"},
    chip:"RUNNER", shotStyle:"height:118%;margin-top:-82px",
    title:'<span style="display:inline-flex;flex-direction:column;align-items:center;line-height:.88">'+
      T("PARAGRAPH","font:900 italic 78px/1 Archivo;color:#f6c945;-webkit-text-stroke:4px #1a1404;paint-order:stroke fill;"+ext("#b0661a",7,"#000"))+
      T("DASH","font:900 italic 50px/1 Archivo;letter-spacing:.2em;color:#ff6fa8;-webkit-text-stroke:4px #1a1404;paint-order:stroke fill;"+ext("#8a1f4f",5,"#000"))+'</span>',
    sub:"STARRING JAY'S FACE",
    ribbon:"JUMP &middot; SORT &middot; DASH",
    burst:["5","WORLDS!"],
    tag:"ENGLISH PARAGRAPHS",
    small:"Every portal starts a new paragraph.",
    players:"1<br>PLAYER",
    spine:T("PARAGRAPH DASH","font:900 italic 44px/1 Archivo;color:#f6c945;"+ext("#b0661a",4,"#000"))
  },
  "chip-run": {
    vars:{base:"#0a3f50",base2:"#06232d",accent:"#ffd84a",sub:"#bfe6ff",ribbon:"#ffd84a",ribbonInk:"#071a2c",s1:"#ffd84a",s2:"#ff6b4a",s3:"#bfe6ff"},
    chip:"ARCADE",
    title:T("CHIP RUN","font:900 italic 136px/1 Archivo;color:#ffd84a;-webkit-text-stroke:5px #071a2c;paint-order:stroke fill;"+ext("#d2452c",9,"#000")),
    sub:"THE SEAGULLS WANT YOU",
    ribbon:"RUN &middot; GRAB &middot; ESCAPE",
    burst:["20","LEVELS!"],
    tag:"TIMES TABLES AT SPEED",
    small:"Four seagulls. One chip. Grab the vinegar.",
    players:"1<br>CHIP",
    spine:T("CHIP RUN","font:900 italic 56px/1 Archivo;color:#ffd84a;"+ext("#d2452c",4,"#000"))
  },
  "chess": {
    vars:{base:"#1b1b1f",base2:"#0f0f12",accent:"#e9c46a",sub:"#e8dcc0",ribbon:"#e9c46a",ribbonInk:"#0f0f12",s1:"#e9c46a",s2:"#f2f2ee",s3:"#8a5a2b"},
    chip:"STRATEGY", shotStyle:"object-position:50% 45%",
    title:'<span style="display:inline-flex;align-items:baseline;gap:14px">'+
      T("CHESS,","font:900 128px/1 Archivo;color:#f2efe6;"+ext("#8a5a2b",8,"#000"))+
      T("properly","font:700 italic 56px/1 Atk;color:#e9c46a;"+ext("#5a3a18",3,"#000"))+'</span>',
    sub:"NOT TRYING TO BE FAIR",
    ribbon:"THINK &middot; PLAN &middot; CHECKMATE",
    burst:["4","STRENGTHS"],
    tag:"A REAL CHESS ENGINE",
    small:"Strategy notes turn up when the game calls for them.",
    players:"1<br>PLAYER",
    spine:T("CHESS, properly","font:900 50px/1 Archivo;color:#f2efe6;"+ext("#8a5a2b",4,"#000"))
  },
  "timeline-tantrum": {
    vars:{base:"#24204a",base2:"#151230",accent:"#ef7724",sub:"#7fe8ff",ribbon:"#ef7724",ribbonInk:"#151230",s1:"#7ec850",s2:"#ef7724",s3:"#5fe0f0"},
    chip:"ARTILLERY",
    title:'<span style="display:inline-flex;align-items:baseline;gap:22px">'+
      T("TIMELINE","font:900 italic 112px/1 Archivo;color:#7ec850;-webkit-text-stroke:4px #151230;paint-order:stroke fill;"+ext("#2f6a24",8,"#000"))+
      T("TANTRUM","font:900 italic 112px/1 Archivo;color:#5fe0f0;-webkit-text-stroke:4px #151230;paint-order:stroke fill;"+ext("#ef7724",8,"#000"))+'</span>',
    sub:"STONE AGE VS FAR FUTURE",
    ribbon:"AIM &middot; BOOM &middot; DIG UP HISTORY",
    burst:["17","REAL FINDS!"],
    tag:"10,000 BC TO AD 3000",
    small:"Two squads, two eras and one very bad day for history.",
    players:"1 OR 2<br>PLAYERS",
    spine:T("TIMELINE TANTRUM","font:900 italic 50px/1 Archivo;color:#5fe0f0;"+ext("#ef7724",4,"#000"))
  }
};
