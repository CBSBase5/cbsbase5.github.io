/* ==========================================================
   Base 5 - the game vault
   Every game on the site, in one list. The game library page
   and the strip on the index both read this file.

   To add a game, copy one entry and change it:
     id      short name, no spaces
     title   what it is called
     href    where it lives on the site
     blurb   one or two sentences, what you do in it
     meta    small print: how long, how many, anything handy
     tags    any of: cc, learning, project, make, fun
     added   the date it went up (yyyy-mm-dd). Anything added in
             the last three weeks gets a NEW sticker.
     art     path to a box art image, if it has one
     fill    cover colour if there is no art:
             teal, bright, orange, yellow, plum, ink
     motif   cover picture if there is no art:
             portal, stars, wave, ball, chess, grid, blocks,
             bolt, house, heart, pitch, leaf, clock
     year    the year it "comes from" on its vault label.
             Decoration only.
     featured  true puts it in the big slot at the top

   Plain ASCII only. Use ' for apostrophes.
   ========================================================== */

window.B5GAMES = {

  tags: {
    cc:       "Cultural calendar",
    learning: "Learning",
    project:  "Project",
    make:     "Make your own",
    fun:      "Just for fun"
  },

  games: [
    {
      id:"its-time", title:"It's Time", href:"/projects/its-time.html",
      blurb:"Catapult yourself through nine eras of invention and smash every gate on the way. A warm up for this half term's question: if we could time travel, should we?",
      meta:"Nine eras &middot; play a round or play all afternoon",
      tags:["project","fun"], added:"2026-10-14", fill:"orange", motif:"portal", year:"Every year at once", featured:true
    },
    {
      id:"build-a-life", title:"Build a Life", href:"/practice/build-a-life.html",
      blurb:"Start at 5 and spin your way round a pixel town, earn qualifications, land a job and find a home, one year at a time. Aim for a life that feels good, not just a rich one.",
      meta:"Age 5 to 35 &middot; saves as you go &middot; nothing ends your game",
      tags:["learning","fun"], added:"2026-10-14", art:"/practice/build-a-life-art/box.webp", fill:"orange", motif:"house", year:"2031 to 2061"
    },
    {
      id:"hooked", title:"HOOKED! On a Dirt Bike", href:"/practice/hooked.html",
      blurb:"HK has a stick, a drawing of a worm and exactly &pound;0. Fish real British waters, sell photos to the angling club, and save up for the dirt bike in Dale's window.",
      meta:"22 fish and 8 legends &middot; 8 real waters &middot; saves on this computer",
      tags:["fun","learning"], added:"2026-10-12", art:"/practice/hooked-art/box.webp", fill:"teal", motif:"wave", year:"Any Saturday"
    },
    {
      id:"endorphin-house", title:"Endorphin House", href:"/practice/endorphin-house.html",
      blurb:"Do satisfying things round a house and collect endorphins to open up new rooms. A pocket pet, a garden that grows, and a cloud who talks too much.",
      meta:"For World Mental Health Day &middot; eleven rooms &middot; nothing is timed",
      tags:["cc","fun"], added:"2026-10-12", art:"/practice/endorphin-art/box.webp", fill:"plum", motif:"heart", year:"Tonight"
    },
    {
      id:"jump-lab", title:"Jump Lab", href:"/practice/jump-lab.html",
      blurb:"Make your own platform, maze, runner or space game. Build the rules from blocks, watch the real code light up underneath, and share your game with a code.",
      meta:"Four kinds of game &middot; guided jobs or free build",
      tags:["make","learning"], added:"2026-10-12", art:"/practice/jump-lab-art/box.webp", fill:"bright", motif:"blocks", year:"Whenever you make it"
    },
    {
      id:"sankofa", title:"Sankofa", href:"/practice/sankofa.html",
      blurb:"Fly the Sankofa bird back through Black British history to the Windrush in 1948. Find the lost eggs and read the true story inside each one.",
      meta:"For Black History Month &middot; 30 true stories &middot; five eras",
      tags:["cc","learning"], added:"2026-10-05", art:"/practice/sankofa-art/box.webp", fill:"plum", motif:"stars", year:"Today back to 1948"
    },
    {
      id:"last-stand", title:"Tiny Legends: Last Stand", href:"/practice/last-stand.html",
      blurb:"Hold the community hall on bingo night, or the old Chilton Bridge Manor in a storm, and keep the neighbours safe until morning. One player, or two on one keyboard.",
      meta:"For Elderly Appreciation Day &middot; four bosses",
      tags:["cc","fun"], added:"2026-09-28", fill:"ink", motif:"house", year:"1950s onwards"
    },
    {
      id:"tiny-legends", title:"Tiny Legends", href:"/practice/tiny-legends.html",
      blurb:"Pick an older legend and fight your way through five floors of the Memory House, stopping to hear the stories of the people you meet.",
      meta:"For Elderly Appreciation Day &middot; five floors",
      tags:["cc","fun"], added:"2026-09-28", fill:"plum", motif:"stars", year:"A long life ago"
    },
    {
      id:"jts-dugout", title:"JT's Dugout", href:"/jt/",
      blurb:"Pick your best side and run a club. Every training session you try earns a match, and the more you do, the luckier your team gets.",
      meta:"Football manager &middot; saves on this computer",
      tags:["fun"], added:"2026-10-14", fill:"teal", motif:"pitch", year:"This season"
    },
    {
      id:"cue-the-sequence", title:"Cue the Sequence", href:"/practice/cue-the-sequence.html",
      blurb:"A pool potting race against Chalky, with a quick sequences warm up before each of your turns. The levels never run out.",
      meta:"Sequences and the nth term &middot; endless levels",
      tags:["learning"], added:"2026-09-24", fill:"teal", motif:"ball", year:"Down the pub, 1987"
    },
    {
      id:"paragraph-dash", title:"Paragraph Dash", href:"/practice/paragraphs.html",
      blurb:"Jay's face, in a Geometry Dash style run, with paragraph structure to sort out on the way.",
      meta:"English paragraphs &middot; jump and sort",
      tags:["learning","fun"], added:"2026-09-24", fill:"yellow", motif:"bolt", year:"Somewhere in 2013"
    },
    {
      id:"chip-run", title:"Chip Run", href:"/practice/chip-run.html",
      blurb:"You are a chip on a pier and the seagulls want you. Run into the right answer before they catch you.",
      meta:"Times tables &middot; 20 levels",
      tags:["learning","fun"], added:"2026-09-21", fill:"orange", motif:"wave", year:"Seaside, 1962"
    },
    {
      id:"chess", title:"Chess, properly", href:"/practice/chess.html",
      blurb:"A real engine with four strengths, up to one that is not trying to be fair. Strategy notes turn up when the position calls for them.",
      meta:"Thinking and calculation &middot; four strengths",
      tags:["fun"], added:"2026-09-21", fill:"ink", motif:"chess", year:"About 600 AD"
    },
    {
      id:"pixel-moves", title:"Pixel Moves", href:"/practice/pixel-moves.html",
      blurb:"Move Bonnie and friends round a grid: slide them with vectors, flip them in mirror lines, turn them and grow them, then get Bonnie to bed.",
      meta:"Vectors and transformations &middot; 14 puzzles",
      tags:["learning"], added:"2026-09-28", fill:"plum", motif:"grid", year:"8 bit, 1985"
    },
    {
      id:"tiny-town", title:"Tiny Town", href:"/practice/tiny-town.html",
      blurb:"Build a model village: shrink things to scale, plan a bus route on a map, and run the cafe and toy shop with maths in your head.",
      meta:"Scale and mental maths &middot; 7 stages",
      tags:["learning"], added:"2026-10-12", fill:"yellow", motif:"house", year:"Model year 1:50"
    },
    {
      id:"number-allotment", title:"The Number Allotment", href:"/practice/number-allotment.html",
      blurb:"An empty allotment that fills up as you go: square patios, seedlings that grow in sequences, and beds split into fractions.",
      meta:"Squares, sequences and fractions &middot; 7 jobs",
      tags:["learning"], added:"2026-10-12", fill:"teal", motif:"leaf", year:"Next spring"
    },
    {
      id:"drone-dash", title:"Drone Dash", href:"/practice/drone-dash.html",
      blurb:"Run a drone delivery company: fly by column vectors round no fly zones, price the parcel shop sale, and tile the landing pads.",
      meta:"Vectors, discounts and transformations &middot; 7 stages",
      tags:["learning"], added:"2026-10-12", fill:"bright", motif:"bolt", year:"2040"
    },
    {
      id:"base-camp", title:"Base Camp", href:"/practice/expedition-maths.html",
      blurb:"Plan an expedition in seven stops: mental sums up a hill, a formula machine, a map with a ruler and a tent on a scale plan.",
      meta:"Mental maths, formulas and scale &middot; 7 stops",
      tags:["learning"], added:"2026-10-05", fill:"orange", motif:"stars", year:"1953"
    },
    {
      id:"pattern-factory", title:"The Pattern Factory", href:"/practice/pattern-factory.html",
      blurb:"Seven factory machines that press squares, squash fractions and grow tile patterns until you can dial in the nth term.",
      meta:"Squares, fractions and sequences &middot; 7 machines",
      tags:["learning"], added:"2026-10-05", fill:"plum", motif:"blocks", year:"1851"
    },
    {
      id:"tile-shop", title:"The Tile Shop", href:"/practice/tile-shop.html",
      blurb:"See which shapes tessellate, flip and turn tiles on a grid, drive a robot with vectors, then serve customers at a sale till.",
      meta:"Tessellation, transformations and discounts &middot; 7 stages",
      tags:["learning"], added:"2026-10-05", fill:"bright", motif:"grid", year:"Ancient Rome"
    },
    {
      id:"curveballs", title:"Control or Chaos", href:"/shuffle/phse-week-4.html",
      blurb:"Five group games from PHSE: a card sort, curveballs against the clock, a dice run, the slowest line wins, and the Curveball Awards.",
      meta:"Safety and predictability &middot; best with a few people",
      tags:["learning","fun"], added:"2026-09-21", fill:"yellow", motif:"heart", year:"Any old Tuesday"
    }
  ]
};

/* ----------------------------------------------------------
   Covers for games with no box art. Drawn here so the index
   and the vault look the same.
   ---------------------------------------------------------- */
(function(G){
  var M = {
    portal:'<circle cx="100" cy="92" r="66" fill="none" stroke="currentColor" stroke-width="7" stroke-dasharray="14 10"/><circle cx="100" cy="92" r="46" fill="none" stroke="currentColor" stroke-width="6" opacity=".7"/><circle cx="100" cy="92" r="26" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="6 6" opacity=".55"/><circle cx="100" cy="92" r="9" fill="currentColor"/>',
    stars:'<path d="M60 40l7 16 17 2-13 11 4 17-15-9-15 9 4-17-13-11 17-2z" fill="currentColor"/><path d="M138 70l5 11 12 2-9 8 3 12-11-6-11 6 3-12-9-8 12-2z" fill="currentColor" opacity=".8"/><circle cx="150" cy="34" r="5" fill="currentColor"/><circle cx="40" cy="120" r="4" fill="currentColor" opacity=".7"/><circle cx="104" cy="138" r="6" fill="currentColor" opacity=".6"/>',
    wave:'<path d="M0 110 Q25 88 50 110 T100 110 T150 110 T200 110" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/><path d="M0 138 Q25 116 50 138 T100 138 T150 138 T200 138" fill="none" stroke="currentColor" stroke-width="6" opacity=".55" stroke-linecap="round"/><path d="M120 46 q14 -12 28 0 M134 40 q12 -10 24 0" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
    ball:'<circle cx="92" cy="92" r="50" fill="currentColor"/><circle cx="92" cy="92" r="22" fill="none" stroke="#0a2f38" stroke-width="5" opacity=".5"/><circle cx="160" cy="58" r="15" fill="currentColor" opacity=".55"/><circle cx="34" cy="146" r="11" fill="currentColor" opacity=".4"/>',
    chess:'<path d="M78 150h44l-6-20h-32z M84 128h32l-4-44h-24z M86 80 q14 -34 28 0z M93 46h14v10h-14z" fill="currentColor"/><rect x="20" y="152" width="160" height="8" rx="3" fill="currentColor" opacity=".5"/>',
    grid:'<g fill="none" stroke="currentColor" stroke-width="3" opacity=".55"><path d="M30 30v120M60 30v120M90 30v120M120 30v120M150 30v120M30 30h120M30 60h120M30 90h120M30 120h120M30 150h120"/></g><rect x="60" y="60" width="30" height="30" fill="currentColor"/><rect x="120" y="90" width="30" height="30" fill="currentColor" opacity=".7"/><path d="M75 75 L135 105" stroke="currentColor" stroke-width="5" stroke-dasharray="7 6"/>',
    blocks:'<rect x="30" y="100" width="40" height="40" fill="currentColor"/><rect x="74" y="74" width="40" height="66" fill="currentColor" opacity=".8"/><rect x="118" y="44" width="40" height="96" fill="currentColor" opacity=".6"/>',
    bolt:'<path d="M112 22 L58 100 h36 L80 160 L144 74 h-38 z" fill="currentColor"/>',
    house:'<path d="M40 150 V86 L100 40 L160 86 V150 Z" fill="currentColor"/><rect x="88" y="108" width="24" height="42" fill="#0a2f38" opacity=".45"/><rect x="56" y="94" width="20" height="20" fill="#0a2f38" opacity=".35"/><rect x="124" y="94" width="20" height="20" fill="#0a2f38" opacity=".35"/>',
    heart:'<path d="M100 150 C40 112 30 76 54 58 C74 44 92 54 100 70 C108 54 126 44 146 58 C170 76 160 112 100 150Z" fill="currentColor"/>',
    pitch:'<rect x="24" y="36" width="152" height="112" rx="6" fill="none" stroke="currentColor" stroke-width="5"/><path d="M100 36v112" stroke="currentColor" stroke-width="4"/><circle cx="100" cy="92" r="20" fill="none" stroke="currentColor" stroke-width="4"/><rect x="24" y="70" width="24" height="44" fill="none" stroke="currentColor" stroke-width="4"/><rect x="152" y="70" width="24" height="44" fill="none" stroke="currentColor" stroke-width="4"/>',
    leaf:'<path d="M50 150 C50 80 100 40 160 36 C156 100 116 146 50 150Z" fill="currentColor"/><path d="M58 142 L140 56" stroke="#0a2f38" stroke-width="4" opacity=".4"/>',
    clock:'<circle cx="100" cy="92" r="60" fill="none" stroke="currentColor" stroke-width="7"/><path d="M100 92 V54 M100 92 L128 108" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><circle cx="100" cy="92" r="6" fill="currentColor"/>'
  };

  /* Returns the HTML for a cover */
  G.cover = function(g, big){
    if(g.art && !g.artFailed){
      var hi = g.art.replace(/\.webp$/, "@2x.webp");
      return '<img class="gcover-art" src="'+g.art+'" srcset="'+g.art+' 1x, '+hi+' 2x" width="640" height="822" alt="The '+g.title.replace(/"/g,"")+' game box" loading="lazy" onerror="B5GAMES.artFailed(this,\''+g.id+'\','+(big?1:0)+')">';
    }
    var fill = g.fill || "teal";
    var motif = M[g.motif] || M.portal;
    return '<div class="gcover gcover-'+fill+(big?' gcover-big':'')+'" aria-hidden="true">'+
      '<svg viewBox="0 0 200 180">'+motif+'</svg>'+
      '<span class="gcover-title">'+g.title+'</span>'+
    '</div>';
  };

  /* if a box art image will not load, draw a cover instead */
  G.artFailed = function(img, id, big){
    var g = G.games.filter(function(x){return x.id===id})[0];
    if(!g) return;
    g.artFailed = true;
    var box = document.createElement('div');
    box.innerHTML = G.cover(g, !!big);
    img.parentNode.replaceChild(box.firstChild, img);
  };

  G.isNew = function(g){
    if(!g.added) return false;
    var p = g.added.split("-");
    var then = new Date(+p[0], +p[1]-1, +p[2]);
    return (Date.now() - then.getTime()) < 21*24*60*60*1000;
  };

  /* Newest first */
  G.sorted = function(){
    return G.games.slice().sort(function(a,b){ return (b.added||"") < (a.added||"") ? -1 : (b.added||"") > (a.added||"") ? 1 : 0; });
  };
})(window.B5GAMES);
