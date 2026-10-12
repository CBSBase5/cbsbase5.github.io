/* ==========================================================
   Base 5 - the dugout: match engine
   Pure functions, no page needed, so it can be tested in node.
   Everything here is fictional: made up teams, made up players.
   ========================================================== */
(function(root){
"use strict";

/* ---- seeded random numbers, so a match replays the same way ---- */
function rng(seed){
  var a = seed >>> 0;
  return function(){
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---- tuning knobs (see calibrate notes in the repo scratch) ---- */
var K = {
  chanceBase: 0.17, chanceExp: 2.2,
  goalBase: 0.165, goalExp: 1.6,
  possExp: 2.4,
  luckCancel: 0.18,   /* share of the other side's chances that go astray at full luck */
  luckRebound: 0.24   /* share of our misses that fall back to us at full luck */
};

/* ---- the league: fifteen made up clubs, strength out of about 80 ---- */
var DIV2 = [
  { name: "Hollowfield Rovers", base: 71, o: [2,-1,0,1] },
  { name: "Marsh End United", base: 67, o: [-2,2,1,-1] },
  { name: "Wickham Athletic", base: 65, o: [1,0,-2,2] },
  { name: "Brightwater Town", base: 69, o: [0,3,-1,-2] },
  { name: "Stonebridge", base: 62, o: [-1,-2,3,0] },
  { name: "Fernley City", base: 73, o: [3,1,-2,0] },
  { name: "Oakhurst Wanderers", base: 60, o: [0,-1,2,-2] },
  { name: "Riverside Albion", base: 66, o: [-2,0,0,3] },
  { name: "Copper Hill", base: 64, o: [2,-2,1,0] },
  { name: "Ashgrove", base: 68, o: [-1,1,2,-1] },
  { name: "Dunmore Rangers", base: 61, o: [1,2,-3,1] },
  { name: "Larkfield Town", base: 66, o: [0,-3,1,3] },
  { name: "Penhallow", base: 63, o: [-2,1,2,-1] },
  { name: "Saltmarsh United", base: 70, o: [1,-1,-1,2] },
  { name: "Greywell Park", base: 58, o: [2,-2,0,0] }
];
/* ---- divisions: four tiers of fifteen clubs each. 3 is the bottom, 0 is the top ---- */
var LEAGUES = [
  { name: "Chilton Premier League", mean: 75, clubs: ["Chilton Royals","Ironbridge Athletic","Castlemere City","Valeview United","Redwell Rovers","Goldcrest Town","Silverdale","Ashworth Wanderers","Blackmoor United","Crownhill","Dalecrest City","Eaglescliffe","Foxhollow Rangers","Grandmere","Heronsgate Albion"] },
  { name: "Chilton Division One", mean: 70, clubs: ["Chilton Albion","Ravenscar City","Kingsmere United","Eastbrook Rovers","Harrowgate Athletic","Linden Town","Northcote","Bellmoor Wanderers","Sandford Park","Thornbury City","Wexcombe","Aldermoor United","Fairhaven","Stourbridge Hill","Highcliffe Rangers"] },
  { name: "Chilton Division Two", mean: 66, clubs: null },
  { name: "Chilton Division Three", mean: 62, clubs: ["Chilton Colts","Netherby Town","Quarry Lane","Elmstead Athletic","Thistledown","Hobbs Green","Ploughley United","Marlpit Rovers","Westmere","Fallowfield Park","Cinder Row","Brambleton","Oldacre","Tansley Wanderers","Pennywell"] }
];
var TIER = 2;
var CLUBS = [];
var HEAT = 0;   /* rivals raise their game after you win things */
function setHeat(h){ HEAT = Math.max(0, Math.min(6, +h || 0)); setTier(TIER); }
function setTier(t){
  t = Math.max(0, Math.min(3, t | 0)); TIER = t; CLUBS.length = 0;
  var L = LEAGUES[t], i;
  for(i = 0; i < 15; i++){
    var d = DIV2[i];
    if(t === 2){ CLUBS.push({ name: d.name, base: d.base + (L.mean - 65) + HEAT, o: d.o.slice() }); }
    else { var o = d.o.map(function(x, k){ return DIV2[(i + t * 3 + k) % 15].o[(k + t) % 4] }); CLUBS.push({ name: L.clubs[i], base: L.mean + (d.base - 65) + HEAT, o: o }); }
  }
  return CLUBS;
}
function leagueName(t){ return LEAGUES[t == null ? TIER : t].name }
setTier(2);
var HOME_NAME = "Base 5 United";

var SURNAMES = ["Archer","Bellamy","Cresswell","Dacre","Everett","Fenwick","Garner","Harlow","Ingram","Jessop",
  "Kendrick","Lovell","Marlow","Nash","Orton","Pickering","Quayle","Rowntree","Sutton","Thorne",
  "Upton","Vickers","Wetherby","Yardley","Ashby","Bridger","Corbett","Delaney","Elliott","Faraday",
  "Gale","Haig","Iliffe","Jarrett","Kemp","Lockyer","Merrick","Norcott","Oakley","Prentice"];

/* team strength from the club's list: atk, mid, def, gk */
function clubTeam(i){
  var c = CLUBS[i];
  var players = [], j;
  var pos = ["GK","DEF","DEF","DEF","DEF","MID","MID","MID","FWD","FWD","FWD"];
  for(j = 0; j < 11; j++){
    players.push({ name: "No. " + (j + 1) + " " + SURNAMES[(i * 7 + j * 3) % SURNAMES.length], pos: pos[j] });
  }
  return {
    name: c.name, atk: c.base + c.o[0], mid: c.base + c.o[1],
    def: c.base + c.o[2], gk: c.base + c.o[3], luck: 0, players: players
  };
}

/* ---- the Champions Cup: made up clubs from far away. ids 100 and up ---- */
var FOREIGN = [
  { name: "Dinamo Karst", base: 79, o: [2, 0, 1, -1] },
  { name: "Sporting Lerma", base: 81, o: [0, 2, -1, 1] },
  { name: "Olympique Vaux", base: 82, o: [1, 1, 0, -2] },
  { name: "Nordhaven FC", base: 83, o: [-1, 2, 2, 0] },
  { name: "Union Brandt", base: 84, o: [2, -1, 1, 1] },
  { name: "Club Aurelia", base: 86, o: [1, 1, 1, 1] }
];
function foreignTeam(k){
  var c = FOREIGN[k % FOREIGN.length], players = [], j;
  var pos = ["GK","DEF","DEF","DEF","DEF","MID","MID","MID","FWD","FWD","FWD"];
  for(j = 0; j < 11; j++) players.push({ name: "No. " + (j + 1) + " " + SURNAMES[(k * 11 + 5 + j * 3) % SURNAMES.length], pos: pos[j] });
  return { name: c.name, atk: c.base + c.o[0], mid: c.base + c.o[1], def: c.base + c.o[2], gk: c.base + c.o[3], luck: 0, players: players };
}
/* champions cup draw: k is 0 to 3, harder each round. returns an id of 100 or more */
function foreignOpponent(seed, k){
  var rr = rng((seed * 13 + k * 977) >>> 0), pairs = [[0, 1], [1, 2], [2, 3], [4, 5]], pr = pairs[Math.min(k, 3)];
  return 100 + pr[rr() < 0.5 ? 0 : 1];
}
function oppName(id){ return id >= 100 ? FOREIGN[(id - 100) % FOREIGN.length].name : CLUBS[id - 1].name }
function oppTeam(id){ return id >= 100 ? foreignTeam(id - 100) : clubTeam(id - 1) }

/* ---- the squad: nineteen to start, four more to unlock ---- */
var PLAYERS = [
  { id: "gk1", name: "Archie Pell", pos: "GK", r: 64, note: "A safe pair of hands" },
  { id: "gk2", name: "Tomasz Weller", pos: "GK", r: 60, note: "Loud, brave, hard to beat" },
  { id: "d1", name: "Dan Okoro", pos: "DEF", r: 66, note: "Reads the game" },
  { id: "d2", name: "Ravi Shenoy", pos: "DEF", r: 64, note: "Tackles clean" },
  { id: "d3", name: "Sol Ridgeway", pos: "DEF", r: 63, note: "Calm on the ball" },
  { id: "d4", name: "Kofi Brennan", pos: "DEF", r: 62, note: "Quick across the turf" },
  { id: "d5", name: "Ollie Strand", pos: "DEF", r: 60, note: "Never gives up" },
  { id: "d6", name: "Jonah Pryce", pos: "DEF", r: 58, note: "Heads everything" },
  { id: "m1", name: "Mateo Hartley", pos: "MID", r: 66, note: "Spots the pass" },
  { id: "m2", name: "Idris Calder", pos: "MID", r: 65, note: "The engine room" },
  { id: "m3", name: "Finn Adeyemi", pos: "MID", r: 64, note: "Tricky feet" },
  { id: "m4", name: "Luca Marsh", pos: "MID", r: 62, note: "Shoots from anywhere" },
  { id: "m5", name: "Niko Fairweather", pos: "MID", r: 61, note: "Keeps the ball" },
  { id: "m6", name: "Remy Castellane", pos: "MID", r: 59, note: "Sets up chances" },
  { id: "f1", name: "Zane Holloway", pos: "FWD", r: 66, note: "Sharp in the box" },
  { id: "f2", name: "Theo Blackwood", pos: "FWD", r: 64, note: "Fast and fearless" },
  { id: "f3", name: "Jaden Moss", pos: "FWD", r: 62, note: "Holds the ball up" },
  { id: "f4", name: "Wren Alder", pos: "FWD", r: 60, note: "Late runner" },
  { id: "f5", name: "Sami Quill", pos: "FWD", r: 58, note: "Super sub" },
  { id: "u1", name: "Kit Calloway", pos: "FWD", r: 72, note: "Scores when it matters", fp: 8 },
  { id: "u2", name: "Orla Vance", pos: "MID", r: 72, note: "Sees the game a move ahead", fp: 20 },
  { id: "u3", name: "Bram Tolliver", pos: "DEF", r: 71, note: "A wall with a smile", fp: 34 },
  { id: "u4", name: "Pia Lindqvist", pos: "GK", r: 72, note: "Saves the unsavable", fp: 50 }
];

var FORMATIONS = {
  "4-3-3": { slots: ["GK","DEF","DEF","DEF","DEF","MID","MID","MID","FWD","FWD","FWD"], mod: { atk: 2, mid: 0, def: -1 },
    xy: [[50,92],[16,72],[39,74],[61,74],[84,72],[26,50],[50,54],[74,50],[22,22],[50,16],[78,22]],
    note: "Bold. Three forwards." },
  "4-4-2": { slots: ["GK","DEF","DEF","DEF","DEF","MID","MID","MID","MID","FWD","FWD"], mod: { atk: 0, mid: 0, def: 0 },
    xy: [[50,92],[16,72],[39,74],[61,74],[84,72],[14,48],[38,52],[62,52],[86,48],[36,20],[64,20]],
    note: "Balanced. Hard to read." },
  "3-5-2": { slots: ["GK","DEF","DEF","DEF","MID","MID","MID","MID","MID","FWD","FWD"], mod: { atk: 0, mid: 3, def: -2 },
    xy: [[50,92],[25,74],[50,76],[75,74],[10,50],[30,54],[50,48],[70,54],[90,50],[36,20],[64,20]],
    note: "Rule the middle." },
  "5-3-2": { slots: ["GK","DEF","DEF","DEF","DEF","DEF","MID","MID","MID","FWD","FWD"], mod: { atk: -3, mid: 0, def: 3 },
    xy: [[50,92],[10,68],[30,74],[50,76],[70,74],[90,68],[26,48],[50,52],[74,48],[36,20],[64,20]],
    note: "A fortress." }
};

function fit(playerPos, slotPos){
  if(playerPos === slotPos) return 1;
  if(slotPos === "GK") return 0.45;
  if(playerPos === "GK") return 0.55;
  if((playerPos === "DEF" && slotPos === "MID") || (playerPos === "MID" && slotPos === "DEF")) return 0.88;
  if((playerPos === "MID" && slotPos === "FWD") || (playerPos === "FWD" && slotPos === "MID")) return 0.88;
  return 0.72;
}
function playerById(id){
  for(var i = 0; i < PLAYERS.length; i++) if(PLAYERS[i].id === id) return PLAYERS[i];
  return null;
}
function avg(a){ if(!a.length) return 30; var s = 0; for(var i = 0; i < a.length; i++) s += a[i]; return s / a.length; }

/* xi: array of 11 player ids (or "" for an empty slot), in slot order.
   boost: { atk, mid, def, gk } training points. luck: 0 to 1 */
function buildTeam(formation, xi, boost, luck, dev){
  var F = FORMATIONS[formation] || FORMATIONS["4-4-2"];
  var by = { GK: [], DEF: [], MID: [], FWD: [] }, players = [], i;
  for(i = 0; i < 11; i++){
    var p = xi[i] ? playerById(xi[i]) : null;
    var eff = p ? (p.r + ((dev && dev[p.id]) || 0)) * fit(p.pos, F.slots[i]) : 30;
    by[F.slots[i]].push(eff);
    players.push({ name: p ? p.name : "A gap in the side", pos: F.slots[i], id: p ? p.id : "", r: Math.round(eff) });
  }
  boost = boost || {};
  var atk = (2 * avg(by.FWD) + avg(by.MID)) / 3 + F.mod.atk + (boost.atk || 0);
  var mid = (2 * avg(by.MID) + avg(by.FWD) + avg(by.DEF)) / 4 + F.mod.mid + (boost.mid || 0);
  var def = (2 * avg(by.DEF) + avg(by.MID)) / 3 + F.mod.def + (boost.def || 0);
  var gk = avg(by.GK) + (boost.gk || 0);
  return { name: HOME_NAME, atk: atk, mid: mid, def: def, gk: gk, luck: luck || 0, players: players };
}

function clamp(x, a, b){ return x < a ? a : (x > b ? b : x); }
function pick(r, arr){ return arr[Math.floor(r() * arr.length) % arr.length]; }

function scorer(r, team){
  var tot = 0, w = [], i, p;
  for(i = 0; i < team.players.length; i++){
    p = team.players[i];
    w.push(p.pos === "FWD" ? 6 : (p.pos === "MID" ? 2.5 : (p.pos === "DEF" ? 0.6 : 0.02)));
    tot += w[i];
  }
  var x = r() * tot;
  for(i = 0; i < w.length; i++){ x -= w[i]; if(x <= 0) return team.players[i]; }
  return team.players[team.players.length - 1];
}
function anyOf(r, team, poss){
  var c = [], i;
  for(i = 0; i < team.players.length; i++) if(poss.indexOf(team.players[i].pos) >= 0) c.push(team.players[i]);
  return c.length ? pick(r, c) : team.players[0];
}

var T_GOAL = ["{p} finishes it. {t} score!", "{p} sends it into the corner. Goal!", "A neat move and {p} slots it home.",
  "{p} buries it. The keeper had no chance.", "Beautiful team goal, {p} puts it away."];
var T_LUCKGOAL = ["It drops back to {p} and in it goes. Some days the ball just falls your way.",
  "A deflection, a bounce, and {p} is there to tap in. Lucky? The luck dial says so.",
  "The first shot is blocked, then it rolls straight back to {p}. Goal!"];
var T_SAVE = ["{p} shoots, and {k} gets down to save.", "A strong effort from {p}, {k} pushes it away.", "{p} lines it up and the keeper tips it over."];
var T_MISS = ["{p} fires just wide.", "{p} gets there a moment late and the chance is gone.", "Off the post! {p} cannot believe it."];
var T_LUCK = ["Lucky escape for {t}. A deflection takes it wide.", "The flag goes up. Offside, and {t} breathe again.",
  "It hits the post and bounces away from danger. The luck is with {t}.", "A slip at the last moment and the shot never comes."];
var T_MOVE = ["{t} knock it around nicely.", "A long spell of possession for {t}.", "{p} has a look at what is on."];

function fmt(s, o){
  return s.replace("{p}", o.p || "").replace("{t}", o.t || "").replace("{k}", o.k || "");
}

/* home and away are teams from clubTeam / buildTeam.
   Returns { hs, as, events:[{m,k,side,text,who}] } */
var T_FK_GOAL = ["{p} bends the free kick into the top corner!", "{p} steps up and curls it past the wall. Goal!"];
var T_FK_MISS = ["{p} sends it over the wall and just wide.", "{p} hits it well but {k} gets across to save.", "Straight into the wall. A good effort from {p}."];
var T_FK_LUCK = ["It hits the post, bounces off the keeper and goes in. The luck dial at work."];
var T_SHORT_GOAL = ["A short one, a quick one two, and {p} finishes it!", "Clever. A neat short pass and {p} hits it in."];
var T_SHORT_MISS = ["A short pass, but the move breaks down in the box.", "Nice idea, and the defence snuffs it out."];

var RT = {
  near: { n: "Near post flick", b: 0.0, pos: "FWD", g: ["{t} whips it to the near post and {p} flicks it in!", "Near post, {p} gets a touch and it loops in. Goal!"], m: ["{t} finds the near post but {p} cannot get a proper touch.", "A flick from {p} that goes just wide."] },
  far: { n: "Far post header", b: 0.008, pos: "DEF", g: ["{t} floats it to the far post and {p} heads it home!", "A towering header from {p} at the back post. Goal!"], m: ["{p} rises at the far post and the header is straight at {k}.", "The cross is cleared before {p} can attack it."] },
  short: { n: "Short corner", b: 0.004, pos: "MID", g: ["A short corner, a pass back, and {p} curls it in!", "Clever routine. {t} plays it short and {p} finishes the move."], m: ["The short corner is read and the move breaks down.", "{p} tries a shot from the short corner and {k} saves."] },
  edge: { n: "Edge of the box", b: 0.0, pos: "MID", g: ["{t} pulls it back and {p} strikes it first time. What a goal!", "Pulled back to the edge, {p} hits it on the volley. Goal!"], m: ["{p} volleys from the edge of the box and it flies over.", "{p} strikes it sweetly but {k} gets across."] }
};
var FKSTYLE = { curl: { n: "Curl it round the wall", b: 0.01 }, power: { n: "Hit it hard", b: 0.0 }, layoff: { n: "Lay it off for a shot", b: 0.005 } };

/* A match you can step through a minute at a time, so a person can make
   choices part way. opts: { our: "h"|"a", interactive: true, cup: true } */
function createMatch(home, away, seed, opts){
  opts = opts || {};
  var r = rng(seed);
  var M = { home: home, away: away, r: r, hs: 0, as: 0, events: [], m: 0, add: 91 + Math.floor(r() * 4),
    done: false, pause: null, our: opts.our || "", interactive: !!opts.interactive, cup: !!opts.cup, fk: opts.fk || "",
    halfDone: false, spDone: false, pens: null, winner: "",
    coach: opts.coach || 0, physio: opts.physio || 0, captain: opts.captain || "", corner: opts.corner || null, fkStyle: opts.fkStyle || "curl", mast: opts.mast || {},
    preDone: false, lateDone: false, cDone: false };
  M.spMin = M.our ? 12 + Math.floor(r() * 62) : 0;
  M.cMin = M.our ? 8 + Math.floor(r() * 70) : 0;
  if(M.our && Math.abs(M.cMin - M.spMin) < 6) M.cMin = M.spMin > 45 ? Math.max(5, M.spMin - 12) : Math.min(80, M.spMin + 12);
  M.events.push({ m: 0, k: "kick", side: "", text: "Kick off. " + home.name + " against " + away.name + "." });
  return M;
}
function ourTeamOf(M){ return M.our === "h" ? M.home : M.away; }
function theirTeamOf(M){ return M.our === "h" ? M.away : M.home; }

function step(M){
  if(M.done || M.pause) return M;
  var home = M.home, away = M.away, r = M.r, ev = M.events;
  if(M.m >= M.add){ finish(M); return M; }
  var m = M.m + 1;
  if(M.our && M.interactive && !M.preDone){
    M.preDone = true;
    var cm = 1 + 0.35 * M.coach;
    M.pause = { k: "talk", minute: 0, title: "Before kick off" + (M.captain ? ": " + M.captain + " speaks up" : ""), def: 2, options: [
      { label: "Play with joy", sub: "Enjoy it. A bit more luck", fx: { luck: 0.07 * cm } },
      { label: "Be brave", sub: "Go at them from the first whistle", fx: { atk: 2.5 * cm, def: -1.5 } },
      { label: "Stay tight", sub: "Hard to beat, patient", fx: { atk: -1.5, def: 2.5 * cm } }
    ] };
    return M;
  }
  if(m === 46 && !M.halfDone){
    M.halfDone = true;
    if(M.our && M.physio){
      var usP = ourTeamOf(M); usP.atk += 0.8 * M.physio; usP.def += 0.8 * M.physio;
      ev.push({ m: 45, k: "physio", side: M.our, text: "The physio's work shows. Our legs feel fresh for the second half." });
    }
    ev.push({ m: 45, k: "half", side: "", text: "Half time. " + home.name + " " + M.hs + ", " + away.name + " " + M.as + "." });
    if(M.our && M.interactive){
      var cm2 = 1 + 0.35 * M.coach;
      M.pause = { k: "talk", minute: 45, title: "Half time team talk", def: 2, options: [
        { label: "Go for it", sub: "More attack, a little less cover", fx: { atk: 3 * cm2, def: -2 } },
        { label: "Stay solid", sub: "More cover, a little less attack", fx: { atk: -2, def: 3 * cm2 } },
        { label: "Stay calm", sub: "Steady heads. A bit more luck", fx: { luck: 0.1 * cm2 } }
      ] };
      return M;
    }
  }
  if(M.our && M.interactive && !M.lateDone && m >= 76){
    M.lateDone = true;
    var ours = M.our === "h" ? M.hs : M.as, theirs = M.our === "h" ? M.as : M.hs, cm3 = 1 + 0.35 * M.coach, lo;
    if(ours < theirs) lo = [{ label: "Throw everyone forward", sub: "Big push, leaves gaps", fx: { atk: 4 * cm3, def: -4 } }, { label: "Keep pushing", sub: "A little more attack", fx: { atk: 1.8 * cm3, def: -1 } }, { label: "Take a breath", sub: "Steady, and a bit of luck", fx: { luck: 0.08 * cm3 } }];
    else if(ours === theirs) lo = [{ label: "Go for the win", sub: "More attack, a risk at the back", fx: { atk: 3 * cm3, def: -3 } }, { label: "Take the point", sub: "Keep it tight", fx: { atk: -1.5, def: 3 * cm3 } }, { label: "Stay calm", sub: "A bit of luck", fx: { luck: 0.08 * cm3 } }];
    else lo = [{ label: "Close it out", sub: "More cover, keep the ball", fx: { atk: -1, def: 3.5 * cm3 } }, { label: "Keep playing", sub: "A little of both", fx: { atk: 1, def: 1 } }, { label: "Stay calm", sub: "A bit of luck", fx: { luck: 0.08 * cm3 } }];
    M.pause = { k: "talk", minute: 75, title: "Late on: your call", def: 2, options: lo };
    return M;
  }
  if(M.our && M.interactive && !M.cDone && m >= M.cMin){
    M.cDone = true;
    var usC = ourTeamOf(M), ids = usC.players.filter(function(p){ return p.pos !== "GK"; }), d = M.corner || { routine: "near" };
    var byR = function(list){ return list.slice().sort(function(a, b){ return b.r - a.r; }); };
    var tk = byR(ids.filter(function(p){ return p.pos === "MID"; }))[0] || ids[0], tg = byR(ids.filter(function(p){ return p.pos === "DEF" || p.pos === "FWD"; }))[0] || ids[0];
    var okName = function(n){ return n && usC.players.some(function(p){ return p.name === n; }); };
    var r0 = RT[d.routine] ? d.routine : "near";
    var copts = [{ label: "Your routine: " + RT[r0].n, sub: (okName(d.taker) ? d.taker : tk.name) + " to " + (okName(d.target) ? d.target : tg.name), routine: r0, taker: okName(d.taker) ? d.taker : tk.name, target: okName(d.target) ? d.target : tg.name }];
    ["near", "far", "short", "edge"].forEach(function(k){ if(k !== r0) copts.push({ label: RT[k].n, sub: tk.name + " to " + tg.name, routine: k, taker: tk.name, target: tg.name }); });
    M.pause = { k: "corner", minute: m, title: "Corner kick", def: 0, options: copts };
    return M;
  }
  if(M.our && M.interactive && !M.spDone && m >= M.spMin){
    M.spDone = true;
    var us = ourTeamOf(M), takers = us.players.filter(function(p){ return p.pos === "MID" || p.pos === "FWD"; });
    takers.sort(function(a, b){ return (b.name === M.fk ? 1000 : b.r) - (a.name === M.fk ? 1000 : a.r); });
    var opts = takers.slice(0, 3).map(function(p){ return { label: p.name + " takes it", sub: "Rated " + p.r, taker: p.name, rate: p.r }; });
    opts.push({ label: "Play it short", sub: "Build a move instead", short: true });
    M.pause = { k: "setpiece", minute: m, title: "Free kick in a good spot", def: 0, options: opts };
    return M;
  }
  if(m === 91) ev.push({ m: 90, k: "added", side: "", text: "A few minutes added on." });
  var ph = Math.pow(home.mid, K.possExp) / (Math.pow(home.mid, K.possExp) + Math.pow(away.mid, K.possExp));
  var homeAtt = r() < ph;
  var X = homeAtt ? home : away, Y = homeAtt ? away : home, side = homeAtt ? "h" : "a";
  var cp = clamp(K.chanceBase * Math.pow(X.atk / Y.def, K.chanceExp), 0.03, 0.4);
  M.m = m;
  if(r() >= cp){
    if(r() < 0.012) ev.push({ m: m, k: "move", side: side, text: fmt(pick(r, T_MOVE), { t: X.name, p: anyOf(r, X, ["MID"]).name }) });
    return M;
  }
  if(r() < Y.luck * K.luckCancel){
    ev.push({ m: m, k: "luck", side: side === "h" ? "a" : "h", text: fmt(pick(r, T_LUCK), { t: Y.name }) });
    return M;
  }
  var gp = clamp(K.goalBase * Math.pow(X.atk / Y.gk, K.goalExp), 0.04, 0.5);
  var sc = scorer(r, X), keeper = Y.players[0].name, lucky = false, goal = r() < gp;
  if(!goal && X.luck > 0 && r() < X.luck * K.luckRebound){
    goal = r() < clamp(gp * 1.5, 0.1, 0.7); lucky = goal;
  }
  if(goal){
    if(homeAtt) M.hs++; else M.as++;
    ev.push({ m: m, k: "goal", side: side, lucky: lucky, who: sc.name,
      text: fmt(pick(r, lucky ? T_LUCKGOAL : T_GOAL), { p: sc.name, t: X.name }) + " " + M.hs + "-" + M.as });
  } else {
    var save = r() < 0.55;
    ev.push({ m: m, k: "chance", side: side, who: sc.name, text: fmt(pick(r, save ? T_SAVE : T_MISS), { p: sc.name, k: keeper }) });
  }
  return M;
}

/* apply a choice to a paused match */
function resolve(M, idx){
  var P = M.pause; if(!P) return M;
  var o = P.options[idx] || P.options[P.def || 0], us = ourTeamOf(M), them = theirTeamOf(M), r = M.r, ev = M.events;
  M.pause = null;
  if(P.k === "talk"){
    if(o.fx){
      if(o.fx.atk) us.atk += o.fx.atk;
      if(o.fx.def) us.def += o.fx.def;
      if(o.fx.luck) us.luck = Math.min(1, us.luck + o.fx.luck);
    }
    ev.push({ m: P.minute == null ? 45 : P.minute, k: "talk", side: M.our, text: "Team talk: " + o.label + ". " + o.sub + "." });
    return M;
  }
  if(P.k === "corner"){
    var rt = RT[o.routine] || RT.near, tkr = us.players.filter(function(p){ return p.name === o.taker; })[0], tgt = us.players.filter(function(p){ return p.name === o.target; })[0];
    var tR = tkr ? tkr.r : 60, gR = tgt ? tgt.r : 60, mast = Math.min(3, (M.mast && M.mast[o.routine]) || 0);
    var fitB = (tgt && tgt.pos === rt.pos) ? 0.015 : 0;
    var gpc = clamp(0.045 + (gR - 55) * 0.0065 + (tR - 55) * 0.0025 + rt.b + fitB + mast * 0.012, 0.03, 0.32);
    var goalC = r() < gpc, luckyC = false;
    if(!goalC && us.luck > 0 && r() < us.luck * K.luckRebound){ goalC = r() < 0.5; luckyC = goalC; }
    var tx = pick(r, goalC ? rt.g : rt.m);
    if(goalC){
      if(M.our === "h") M.hs++; else M.as++;
      ev.push({ m: P.minute, k: "goal", side: M.our, lucky: luckyC, who: o.target, setpiece: true, routine: o.routine, corner: true, text: fmt(tx.replace("{t}", o.taker).replace("{p}", o.target), { k: them.players[0].name }) + " " + M.hs + "-" + M.as });
    } else {
      ev.push({ m: P.minute, k: "chance", side: M.our, who: o.target, setpiece: true, routine: o.routine, corner: true, text: fmt(tx.replace("{t}", o.taker).replace("{p}", o.target), { k: them.players[0].name }) });
    }
    return M;
  }
  /* set piece */
  var m = P.minute, goal, lucky = false, who, texts;
  if(o.short){
    who = scorer(r, us).name;
    var gp0 = clamp(K.goalBase * 1.15 * Math.pow(us.atk / them.gk, K.goalExp), 0.05, 0.5);
    goal = r() < gp0; texts = goal ? T_SHORT_GOAL : T_SHORT_MISS;
  } else {
    who = o.taker;
    var sty = FKSTYLE[M.fkStyle] || FKSTYLE.curl, fmast = Math.min(3, (M.mast && M.mast["fk_" + M.fkStyle]) || 0);
    var gp = clamp(0.03 + (o.rate - 55) * 0.010 + sty.b + fmast * 0.012 + (M.fkStyle === "power" && them.gk < 68 ? 0.03 : 0), 0.04, 0.38);
    goal = r() < gp;
    if(!goal && us.luck > 0 && r() < us.luck * K.luckRebound){ goal = r() < 0.55; lucky = goal; }
    texts = goal ? (lucky ? T_FK_LUCK : T_FK_GOAL) : T_FK_MISS;
  }
  if(goal){
    if(M.our === "h") M.hs++; else M.as++;
    ev.push({ m: m, k: "goal", side: M.our, lucky: lucky, who: who, setpiece: true, routine: o.short ? "fk_short" : "fk_" + M.fkStyle,
      text: fmt(pick(r, texts), { p: who, k: them.players[0].name }) + " " + M.hs + "-" + M.as });
  } else {
    ev.push({ m: m, k: "chance", side: M.our, who: who, setpiece: true, routine: o.short ? "fk_short" : "fk_" + M.fkStyle, text: fmt(pick(r, texts), { p: who, k: them.players[0].name }) });
  }
  return M;
}
function autoResolve(M){ while(M.pause) resolve(M, M.pause.def || 0); return M; }

function finish(M){
  var home = M.home, away = M.away, ev = M.events;
  ev.push({ m: M.add, k: "full", side: "", text: "Full time. " + home.name + " " + M.hs + ", " + away.name + " " + M.as + "." });
  if(M.cup && M.hs === M.as) shootout(M);
  else M.winner = M.hs > M.as ? "h" : (M.as > M.hs ? "a" : "");
  M.done = true;
}
function shootout(M){
  var r = M.r, h = 0, a = 0, k, ev = M.events, home = M.home, away = M.away;
  var ph = clamp(0.74 + (home.atk - away.gk) * 0.004 + home.luck * 0.08, 0.55, 0.92);
  var pa = clamp(0.74 + (away.atk - home.gk) * 0.004 + away.luck * 0.08, 0.55, 0.92);
  function taker(t, i){ var f = t.players.filter(function(p){ return p.pos !== "GK"; }); return f[i % f.length].name; }
  ev.push({ m: M.add, k: "pens", side: "", text: "Level after ninety minutes. It goes to penalties." });
  for(k = 0; k < 5 || h === a; k++){
    var sh = r() < ph, sa = r() < pa;
    if(sh) h++; if(sa) a++;
    ev.push({ m: M.add, k: "pen", side: "h", text: taker(home, k) + (sh ? " scores." : " misses.") + " " + (sa ? taker(away, k) + " scores." : taker(away, k) + " misses.") + " Penalties " + h + "-" + a });
    if(k >= 4){ if(h !== a) break; }
    else {
      var left = 4 - k;
      if(h > a + left || a > h + left) break;
    }
    if(k > 14) break;
  }
  if(h === a){ h++; }
  M.pens = { h: h, a: a }; M.winner = h > a ? "h" : "a";
  ev.push({ m: M.add, k: "pens", side: "", text: (M.winner === "h" ? home.name : away.name) + " win " + h + "-" + a + " on penalties." });
}
function runAll(M){ while(!M.done){ if(M.pause) autoResolve(M); step(M); } return M; }

/* quiet whole match, used for the other clubs and for tests */
function simulate(home, away, seed, opts){
  var M = createMatch(home, away, seed, opts);
  runAll(M);
  return { hs: M.hs, as: M.as, events: M.events, pens: M.pens, winner: M.winner };
}

/* cup: four ties, the draws get harder. returns a 0 based index into CLUBS */
function cupOpponent(seed, k){
  var order = CLUBS.map(function(c, i){ return i; }).sort(function(a, b){ return CLUBS[a].base - CLUBS[b].base || a - b; });
  var tiers = [[0, 6], [6, 10], [10, 13], [13, 15]], t = tiers[k] || tiers[3];
  var rr = rng((seed * 7 + k * 131) >>> 0);
  return order[t[0] + Math.floor(rr() * (t[1] - t[0]))];
}

/* ---- match day variables: weather and the other side's form ---- */
var WEATHER = [
  { id: "clear", n: "Clear and mild", w: 34, sq: 1, note: "Nothing to worry about today." },
  { id: "wet", n: "Heavy rain", w: 18, sq: 0.72, note: "The ball skids about. Rain makes it a lottery and the favourites find it harder." },
  { id: "wind", n: "Gusty wind", w: 14, sq: 0.82, note: "Crosses drift and goal kicks go astray. It could be anyone's day." },
  { id: "hot", n: "Hot afternoon", w: 10, sq: 0.85, note: "Heavy legs late on. The gap between sides shrinks." },
  { id: "frost", n: "Frosty pitch", w: 10, sq: 0.8, note: "Hard ground and careful touches." },
  { id: "perfect", n: "Perfect pitch", w: 14, sq: 1.12, note: "A lovely surface. It rewards the side with the better passers." }
];
function conditions(seed, round){
  var r = rng((seed * 13 + round * 4999 + 17) >>> 0), x = r() * 100, i, tot = 0;
  for(i = 0; i < WEATHER.length; i++){ tot += WEATHER[i].w; if(x < tot) return WEATHER[i]; }
  return WEATHER[0];
}
/* the other side's form on the day: -3 to +3, mostly near zero */
function oppForm(seed, round, id){
  var r = rng((seed * 29 + round * 1117 + id * 313 + 5) >>> 0), a = r(), b = r();
  return Math.round((a + b - 1) * 3.6);
}
function formLabel(f){ return f >= 2 ? "in great form" : (f <= -2 ? "struggling for form" : (f >= 1 ? "playing well" : (f <= -1 ? "a little rusty" : "in their usual shape"))) }
/* pull both sides' numbers together (or apart) before kick off */
function squeeze(us, them, sq){
  if(sq === 1) return;
  ["atk", "mid", "def", "gk"].forEach(function(k){ var m = (us[k] + them[k]) / 2; us[k] = m + (us[k] - m) * sq; them[k] = m + (them[k] - m) * sq; });
}
function shift(t, d){ ["atk", "mid", "def", "gk"].forEach(function(k){ t[k] += d; }); }

/* ---- the training ground: fifteen activities, each trains one thing ---- */
var CAP = 4;            /* beats that count per activity */
var TUNE = { boost: 0.34 }; /* tuned by Monte Carlo */
var PER_LEVEL = { atk: 0.7, mid: 0.55, def: 0.7, gk: 0.75 };
var STATS = {
  atk: { label: "Finishing", short: "ATK" },
  mid: { label: "Vision and passing", short: "MID" },
  def: { label: "Shape and positioning", short: "DEF" },
  gk:  { label: "Nerve in goal", short: "GK" }
};
var ACTS = [
  { slug: "tiny-town", title: "Tiny Town", pillar: "Maths", stat: "mid", blurb: "Plan a tiny town with scale and ratio." },
  { slug: "number-allotment", title: "The Number Allotment", pillar: "Maths", stat: "mid", blurb: "Squares, fractions and sequences in the garden." },
  { slug: "drone-dash", title: "Drone Dash", pillar: "Maths", stat: "mid", blurb: "Fly a drone round a course with numbers." },
  { slug: "inside-the-machine", title: "Inside the Machine", pillar: "Digital media", stat: "mid", blurb: "Open up a machine and see how it thinks." },
  { slug: "party-budget", title: "The Party Budget", pillar: "Preparation for adulthood", stat: "mid", blurb: "Plan a party and keep the money sorted." },
  { slug: "objection", title: "Objection!", pillar: "English", stat: "atk", blurb: "Read for evidence and make your case." },
  { slug: "punctuation-escape", title: "The Punctuation Escape Room", pillar: "English", stat: "atk", blurb: "Fix the marks to unlock each door." },
  { slug: "break-it-up", title: "Break It Up", pillar: "English", stat: "atk", blurb: "Paragraphs that land." },
  { slug: "gallery-night", title: "Gallery Night", pillar: "Aesthetic and creative", stat: "atk", blurb: "Hang the show and look closely." },
  { slug: "warning-room", title: "The Warning Room", pillar: "Human and social", stat: "def", blurb: "Read the signs before things happen." },
  { slug: "rot-lab", title: "Rot Lab", pillar: "Science", stat: "def", blurb: "Microbes, plants and what breaks down." },
  { slug: "river-road", title: "River Road", pillar: "Physical world", stat: "def", blurb: "Follow the water and the road." },
  { slug: "training-camp", title: "Training Camp", pillar: "PE", stat: "def", blurb: "Build a training plan that fits you." },
  { slug: "the-brave-bit", title: "The Brave Bit", pillar: "Preparation for adulthood", stat: "gk", blurb: "Small brave steps, at your pace." },
  { slug: "late-night-radio", title: "Late Night Radio", pillar: "PHSE", stat: "gk", blurb: "Tune in, talk it through, take what helps." }
];
/* beats: { slug: { n } } straight from b5.engage.v1 */
function training(beats){
  beats = beats || {};
  var fp = 0, boost = { atk: 0, mid: 0, def: 0, gk: 0 }, levels = {}, engaged = 0;
  for(var i = 0; i < ACTS.length; i++){
    var a = ACTS[i], n = beats[a.slug] && beats[a.slug].n ? beats[a.slug].n : 0;
    var lv = Math.min(CAP, Math.max(0, Math.floor(n)));
    levels[a.slug] = lv; fp += lv; if(lv > 0) engaged++;
    boost[a.stat] += lv * PER_LEVEL[a.stat] * TUNE.boost;
  }
  return { fp: fp, luck: Math.min(1, fp / (CAP * ACTS.length)), boost: boost, levels: levels, engaged: engaged };
}

/* ---- the league: sixteen clubs (0 is us), fifteen rounds, circle method ---- */
function fixtures(){
  var n = 16, ring = [], rounds = [], r, i;
  for(i = 1; i < n; i++) ring.push(i);
  for(r = 0; r < n - 1; r++){
    var list = [[0, ring[0]]];
    for(i = 1; i < n / 2; i++) list.push([ring[i], ring[n - 1 - i]]);
    rounds.push(list);
    ring.unshift(ring.pop());
  }
  return rounds;  /* each pair is [a, b]; a is home */
}
/* round r (0 to 14): who do we play, and are we at home */
function ourFixture(r){
  var list = fixtures()[r], i;
  for(i = 0; i < list.length; i++){
    if(list[i][0] === 0) return { opp: list[i][1], home: (r % 2 === 0) };
    if(list[i][1] === 0) return { opp: list[i][0], home: (r % 2 === 0) };
  }
  return null;
}
/* results of everyone else in a round, quietly */
function otherResults(seed, r){
  var out = [], list = fixtures()[r], i;
  for(i = 0; i < list.length; i++){
    var a = list[i][0], b = list[i][1];
    if(a === 0 || b === 0) continue;
    var res = simulate(clubTeam(a - 1), clubTeam(b - 1), (seed * 31 + r * 977 + a * 53 + b * 7) >>> 0);
    out.push({ a: a, b: b, hs: res.hs, as: res.as });
  }
  return out;
}
/* table after our played matches: played = [{round, hs, as, home}] */
function table(seed, played){
  var rows = [], i;
  for(i = 0; i < 16; i++) rows.push({ id: i, name: i === 0 ? HOME_NAME : CLUBS[i - 1].name, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, form: [] });
  function put(a, b, ag, bg){
    var A = rows[a], B = rows[b];
    A.p++; B.p++; A.gf += ag; A.ga += bg; B.gf += bg; B.ga += ag;
    if(ag > bg){ A.w++; B.l++; A.pts += 3; A.form.push("W"); B.form.push("L"); } else if(ag < bg){ B.w++; A.l++; B.pts += 3; A.form.push("L"); B.form.push("W"); } else { A.d++; B.d++; A.pts++; B.pts++; A.form.push("D"); B.form.push("D"); }
  }
  for(i = 0; i < played.length; i++){
    var pl = played[i], fx = ourFixture(pl.round);
    if(pl.home) put(0, fx.opp, pl.hs, pl.as); else put(fx.opp, 0, pl.hs, pl.as);
    var oth = otherResults(seed, pl.round);
    for(var j = 0; j < oth.length; j++) put(oth[j].a, oth[j].b, oth[j].hs, oth[j].as);
  }
  rows.sort(function(x, y){
    return (y.pts - x.pts) || ((y.gf - y.ga) - (x.gf - x.ga)) || (y.gf - x.gf) || (x.id - y.id);
  });
  return rows;
}

function setHomeName(n){ HOME_NAME = n || "Base 5 United"; API.HOME_NAME = HOME_NAME }
var API = { setTier: setTier, leagueName: leagueName, LEAGUES: LEAGUES, setHomeName: setHomeName, rng: rng, K: K, CLUBS: CLUBS, HOME_NAME: HOME_NAME, PLAYERS: PLAYERS, FORMATIONS: FORMATIONS,
  clubTeam: clubTeam, oppName: oppName, oppTeam: oppTeam, foreignOpponent: foreignOpponent, FOREIGN: FOREIGN, RT: RT, FKSTYLE: FKSTYLE, buildTeam: buildTeam, simulate: simulate, createMatch: createMatch, step: step, resolve: resolve, autoResolve: autoResolve, runAll: runAll, cupOpponent: cupOpponent, fixtures: fixtures, ourFixture: ourFixture,
  otherResults: otherResults, conditions: conditions, oppForm: oppForm, formLabel: formLabel, squeeze: squeeze, shift: shift, WEATHER: WEATHER, TUNE: TUNE, setHeat: setHeat, ACTS: ACTS, STATS: STATS, CAP: CAP, training: training, table: table, playerById: playerById, fit: fit };
if(typeof module !== "undefined" && module.exports) module.exports = API;
root.B5Sim = API;
})(typeof window !== "undefined" ? window : this);
