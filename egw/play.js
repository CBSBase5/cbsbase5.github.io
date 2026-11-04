/* ==========================================================
   Base 5 - HQ play layer for the activity engine (4 Nov 2026)
   Students said the HQ activities felt boring. Jay picked these
   from the audit, and this file does them for every activity in
   every HQ, without touching a single activity:

     1  stage names in each HQ's own words (Drill 2 of 4, Op 2...)
     2  a themed burst in the scene on every right answer
     4  combo meter: three right first go in a row doubles the
        sparks for the next one (the engine adds the bonus)
     5  short answers laid out as big tiles (CSS here, the engine
        adds the class)
     6  Bonnie on the move: peeks in on new ideas, hops on a combo,
        trots across at the end of a chunk
     8  the question card sits inside the HQ's world: a floodlit
        pitch, a quiet lake, a night corridor, backstage, a
        blueprint, a night sky
     9  boss round: the last question of each chunk, with a stake
        drawn in the world and 5 bonus sparks
     11 animated intros: the reading card's picture builds in and
        one line shows, the rest is behind "Tell me more" (engine)
     16 the end of each chunk shows the next unlock in the HQ's
        own break game filling up, and an unlock arrives as a moment

   Loaded by /egw/engine.js before an activity starts. The engine
   calls:
     HQPlay.unit()                   "Drill" (the word for a chunk)
     HQPlay.step(card, info)         every step: {learn, boss}
     HQPlay.result(info)             after Check: {status, boss, combo}
     HQPlay.chunkEnd(card, info)     the chunk card: {k, n}
   Everything here is decoration: if this file fails to load, the
   engine works exactly as before. No flashing anywhere; reduced
   motion turns every animation off (egw.css already does).
   Testing: ?hqtest&gsparks=N pretends N game sparks (as hqgame.js).
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(window.HQPlay) return;

var HQ = window.HQ || { who: "EGW", prefix: "b5.egw.", base: "/egw/" };
var WHO = String(HQ.who || "EGW").toUpperCase();
var PREFIX = HQ.prefix || "b5.egw.";
var d = document;

/* ---------- each HQ's world ----------
   unit: what a chunk is called. game: the HQ's break game.
   unlocks: [sparks, name] from the game's own ladder (keep in step
   with egw/dunk.js, lp/stack.js, lw/monster.js, lc/corridor.js,
   hk/crossy.js, jt-hq/penalty.js if those lists change). */
var WORLDS = {
  JT: { id: "jt", unit: "Drill", game: "Penalty Shootout",
    unlocks: [[120, "Panenka chip"], [250, "The robot"], [400, "Hoops kit"], [550, "Wall of Gloves"], [700, "Comet boots"], [900, "Top bins"], [1150, "Park pitch"], [1400, "Beach ball"], [1700, "The worm"], [2000, "Rabona"], [2400, "Rooftop"], [2800, "The Bonnie"], [3300, "Gold kit"], [4000, "The Moon"]] },
  HK: { id: "hk", unit: "Op", game: "Lakeside Breach",
    unlocks: [[100, "Bucket hat"], [200, "Scout drone"], [300, "Spinner"], [400, "Camo jacket"], [500, "Smoke bomb"], [650, "Glowing rod"], [800, "Otter operator"], [950, "Dinghy"], [1100, "Night lake"], [1300, "Waders"], [1500, "Life ring"], [1800, "Woolly hat"], [2200, "Feather fly"], [2700, "Mountain tarn"], [3100, "Carbon rod"], [3500, "Golden rod"], [4000, "Ghillie suit"]] },
  LC: { id: "lc", unit: "Shift", game: "Night Corridor",
    unlocks: [[120, "The Stairwell"], [250, "Wide beam"], [400, "The Staff Room"], [550, "Glow badge"], [700, "Flickery torch"], [900, "The Library"], [1100, "UV torch"], [1350, "Lights out"], [1600, "The Boiler Room"], [1900, "Flask of tea"], [2300, "The Roof"], [2700, "Old lantern"], [3200, "Night radio"], [4000, "Gold badge"]] },
  LW: { id: "lw", unit: "Act", game: "Monster Movie",
    unlocks: [[120, "Seaside Pier"], [250, "Blobbo"], [400, "Top hat"], [550, "Slow motion"], [720, "Confetti cannon"], [900, "Big School"], [1100, "Unit 9"], [1350, "Musical number"], [1650, "Crown"], [2000, "Duster"], [2400, "Space Station 5"], [2850, "Black and white"], [3300, "Rubber chicken"], [3700, "Socko"], [4000, "Glitter suit"]] },
  LP: { id: "lp", unit: "Sheet", game: "Neon Stack",
    unlocks: [[120, "Jelly"], [250, "Seaside"], [400, "Magnet"], [550, "Ice"], [750, "Rubber"], [950, "Canyon"], [1200, "Glue"], [1450, "Glass"], [1750, "Snowy peaks"], [2100, "Pump"], [2500, "Gold"], [3000, "Moon base"], [3500, "Safety net"], [4000, "Cake"]] },
  EGW: { id: "egw", unit: "Round", game: "Dunk",
    unlocks: [[120, "Ginger nut"], [250, "Hot chocolate"], [400, "Jam ring"], [550, "Bunting"], [700, "Wafer"], [900, "Cup and saucer"], [1100, "Shortbread"], [1300, "Coffee"], [1500, "Rush hour"], [1750, "Chocolate cream"], [2000, "Fig roll"], [2300, "Piano corner"], [2600, "The Bucket"], [2900, "Posh tea"], [3200, "Stone Age rock"], [3500, "Iced star"], [3800, "Chandelier"], [4000, "Golden biscuit"]] }
};
var W = WORLDS[WHO] || WORLDS.EGW;

var F = 'font-family="Verdana,Arial,sans-serif"';
function rep(n, fn){ var s = ""; for(var i = 0; i < n; i++) s += fn(i); return s; }
function star(x, y, r, col){
  var p = [];
  for(var i = 0; i < 10; i++){ var a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * 0.45 : r; p.push((x + Math.cos(a) * rr).toFixed(1) + " " + (y + Math.sin(a) * rr).toFixed(1)); }
  return '<path d="M' + p.join("L") + 'Z" fill="' + col + '"/>';
}
/* a ring of stars for a win, each one a separate <g> so they fly out on their own */
function burst(cx, cy, cols){
  return '<g class="hp-w">' + rep(8, function(i){
    var a = Math.PI / 4 * i, dx = Math.round(Math.cos(a) * 46), dy = Math.round(Math.sin(a) * 30);
    return '<g class="hp-st" style="--dx:' + dx + 'px;--dy:' + dy + 'px">' + star(cx, cy, 7, cols[i % cols.length]) + '</g>';
  }) + '</g>';
}
/* Bonnie, a brown toy poodle with no tail, standing (same drawing as A2ART.bonnie) */
function bonnie(tf){
  return '<g class="hp-bon"><g transform="' + (tf || 'translate(572 84) scale(.42)') + '">' +
    '<rect x="-24" y="18" width="9" height="26" rx="4" fill="#8a5a36"/><rect x="-8" y="18" width="9" height="26" rx="4" fill="#8a5a36"/><rect x="10" y="18" width="9" height="26" rx="4" fill="#8a5a36"/><rect x="24" y="18" width="9" height="26" rx="4" fill="#8a5a36"/>' +
    '<circle cx="-19" cy="44" r="7" fill="#9c6b45"/><circle cx="-3" cy="44" r="7" fill="#9c6b45"/><circle cx="15" cy="44" r="7" fill="#9c6b45"/><circle cx="29" cy="44" r="7" fill="#9c6b45"/>' +
    '<ellipse cx="4" cy="10" rx="34" ry="20" fill="#9c6b45"/>' +
    '<circle cx="-22" cy="2" r="12" fill="#a87650"/><circle cx="-6" cy="-4" r="12" fill="#a87650"/><circle cx="12" cy="-3" r="12" fill="#a87650"/><circle cx="28" cy="3" r="11" fill="#a87650"/>' +
    '<g transform="translate(-34 -22)"><ellipse cx="-18" cy="6" rx="9" ry="16" fill="#7a4c2c"/><ellipse cx="18" cy="6" rx="9" ry="16" fill="#7a4c2c"/>' +
    '<circle cx="0" cy="0" r="17" fill="#a87650"/><circle cx="-8" cy="-14" r="8" fill="#b38058"/><circle cx="4" cy="-17" r="8" fill="#b38058"/><circle cx="12" cy="-10" r="7" fill="#b38058"/>' +
    '<ellipse cx="0" cy="9" rx="9" ry="7" fill="#c8956a"/><circle cx="-6" cy="-1" r="2.8" fill="#1b1b1b"/><circle cx="6" cy="-1" r="2.8" fill="#1b1b1b"/>' +
    '<ellipse cx="0" cy="6" rx="3.5" ry="2.6" fill="#1b1b1b"/><path d="M-4 11q4 4 8 0" fill="none" stroke="#5a341c" stroke-width="1.8" stroke-linecap="round"/></g></g></g>';
}
function bonnieCard(){
  return '<svg viewBox="-60 -50 110 100" width="74" height="68" aria-hidden="true">' + bonnie('translate(0 0) scale(1)') + '</svg>';
}

/* ---------- the scenes (viewBox 0 0 760 110, literal colours) ----------
   Every scene has the same parts, so the CSS can move them:
     .hp-a   the actor for a right answer
     .hp-b   the boss stake (only shown in a boss round)
     .hp-w   stars for a boss win
     .hp-bon Bonnie, out of sight until she is needed */
var SCENES = {};

SCENES.jt = function(){
  return '<defs><linearGradient id="hpJtS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05120b"/><stop offset="1" stop-color="#103322"/></linearGradient></defs>' +
    '<rect width="760" height="110" fill="url(#hpJtS)"/>' +
    '<path d="M80 18L0 110H260Z" fill="#fffbe0" opacity=".09"/><path d="M680 18L500 110H760Z" fill="#fffbe0" opacity=".09"/>' +
    '<rect x="77" y="14" width="6" height="60" fill="#2e4437"/><rect x="62" y="8" width="36" height="12" rx="3" fill="#f7f3c8"/>' +
    '<rect x="677" y="14" width="6" height="60" fill="#2e4437"/><rect x="662" y="8" width="36" height="12" rx="3" fill="#f7f3c8"/>' +
    '<rect y="52" width="760" height="16" fill="#0a1d13"/>' + rep(38, function(i){ return '<circle cx="' + (10 + i * 20) + '" cy="' + (58 + (i % 3) * 3) + '" r="3" fill="' + ["#ef7724", "#e8f5e9", "#20adca"][i % 3] + '" opacity=".45"/>'; }) +
    '<rect y="68" width="760" height="42" fill="#1c6b34"/>' + rep(10, function(i){ return '<rect x="' + i * 76 + '" y="68" width="38" height="42" fill="#207a3c"/>'; }) +
    '<path d="M0 76H760" stroke="#e8f5e9" stroke-opacity=".45" stroke-width="2"/>' +
    '<g class="hp-net">' + rep(10, function(i){ return '<path d="M' + (476 + i * 14) + ' 32V76" stroke="#fff" stroke-opacity=".3"/>'; }) + rep(4, function(i){ return '<path d="M470 ' + (40 + i * 10) + 'H610" stroke="#fff" stroke-opacity=".3"/>'; }) + '</g>' +
    '<path d="M470 77V30H610V77" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>' +
    '<g class="hp-b"><g class="hp-keep"><rect x="530" y="58" width="7" height="18" rx="3" fill="#1b1b1b"/><rect x="543" y="58" width="7" height="18" rx="3" fill="#1b1b1b"/>' +
      '<rect x="526" y="38" width="28" height="24" rx="7" fill="#ffd23f"/><circle cx="540" cy="31" r="8" fill="#c98b5e"/>' +
      '<circle cx="537" cy="30" r="1.6" fill="#1b1b1b"/><circle cx="543" cy="30" r="1.6" fill="#1b1b1b"/>' +
      '<rect x="512" y="38" width="16" height="6" rx="3" fill="#ffd23f"/><rect x="552" y="38" width="16" height="6" rx="3" fill="#ffd23f"/>' +
      '<circle cx="512" cy="41" r="5" fill="#20adca"/><circle cx="568" cy="41" r="5" fill="#20adca"/></g>' +
      '<ellipse cx="300" cy="99" rx="14" ry="3" fill="#e8f5e9" opacity=".5"/></g>' +
    '<g class="hp-a"><circle cx="300" cy="92" r="9" fill="#fff" stroke="#1b1b1b" stroke-width="1.5"/><path d="M300 87l4 3-1.5 4.5h-5L296 90z" fill="#1b1b1b"/></g>' +
    burst(540, 50, ["#ffd23f", "#ffffff", "#ef7724"]) + bonnie();
};

SCENES.hk = function(){
  return '<defs><linearGradient id="hpHkS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2c42"/><stop offset="1" stop-color="#4d6680"/></linearGradient></defs>' +
    '<rect width="760" height="110" fill="url(#hpHkS)"/>' +
    '<circle cx="610" cy="58" r="22" fill="#ffb35c" opacity=".75"/>' +
    '<path d="M0 64Q90 34 190 58T400 52T600 60T760 50V66H0Z" fill="#17262c"/>' +
    '<rect y="64" width="760" height="46" fill="#123c50"/>' +
    rep(7, function(i){ return '<path d="M' + (40 + i * 105) + ' ' + (76 + (i % 3) * 9) + 'h46" stroke="#cfe8ee" stroke-opacity=".22" stroke-width="2" stroke-linecap="round"/>'; }) +
    '<path d="M610 66h44" stroke="#ffb35c" stroke-opacity=".45" stroke-width="3" stroke-linecap="round"/>' +
    rep(9, function(i){ return '<path d="M' + (8 + i * 9) + ' 110Q' + (12 + i * 9) + ' ' + (70 - (i % 3) * 10) + ' ' + (20 + i * 9) + ' ' + (52 + (i % 4) * 6) + '" stroke="#2f4f2c" stroke-width="3" fill="none"/>'; }) +
    '<path d="M60 26Q220 18 360 64" stroke="#d9d2b0" stroke-opacity=".6" fill="none"/>' +
    '<g class="hp-float"><rect x="357" y="58" width="6" height="7" fill="#fff"/><circle cx="360" cy="66" r="5" fill="#e8443a"/></g>' +
    '<g class="hp-sonar">' + [10, 18, 26].map(function(r){ return '<circle cx="712" cy="30" r="' + r + '" fill="none" stroke="#5ff2b0" stroke-opacity=".45"/>'; }).join("") + '<path d="M712 30l18 -12" stroke="#5ff2b0" stroke-opacity=".7"/></g>' +
    '<g class="hp-b"><g class="hp-big"><path d="M430 92q30 -16 66 0q-36 16 -66 0z" fill="#2f6f62"/><path d="M496 92l14 -10v20z" fill="#2f6f62"/><circle cx="440" cy="90" r="2" fill="#0a1d1a"/></g></g>' +
    '<g class="hp-a"><path d="M400 96q14 -10 28 0q-14 10 -28 0z" fill="#9fd0c7"/><path d="M428 96l10 -7v14z" fill="#9fd0c7"/><circle cx="406" cy="95" r="1.6" fill="#0a1d1a"/></g>' +
    '<ellipse class="hp-splash" cx="392" cy="68" rx="16" ry="4" fill="none" stroke="#e8fbff" stroke-width="2"/>' +
    burst(460, 46, ["#ffd23f", "#5ff2b0", "#ffffff"]) + bonnie();
};

SCENES.lc = function(){
  return '<rect width="760" height="110" fill="#11140e"/>' +
    '<path d="M0 0H760L460 40H300Z" fill="#1a1d15"/>' +
    '<path d="M0 0L300 40V80L0 110Z" fill="#1f2319"/><path d="M760 0L460 40V80L760 110Z" fill="#1f2319"/>' +
    '<rect x="300" y="40" width="160" height="40" fill="#292e21"/><rect x="364" y="48" width="32" height="32" fill="#14170f"/>' +
    '<path d="M0 110L300 80H460L760 110Z" fill="#2a2d22"/>' +
    '<path d="M150 95L330 80M610 95L430 80" stroke="#3a3d2e" stroke-width="2"/>' +
    '<g class="hp-lights"><rect x="120" y="5" width="130" height="5" rx="2" fill="#fbf8e4"/><rect x="335" y="24" width="90" height="4" rx="2" fill="#fbf8e4"/><rect x="510" y="5" width="130" height="5" rx="2" fill="#fbf8e4"/>' +
      '<path d="M120 10L90 60H280L250 10Z" fill="#fbf8e4" opacity=".05"/><path d="M510 10L480 60H670L640 10Z" fill="#fbf8e4" opacity=".05"/></g>' +
    '<path d="M120 30L172 38V93L120 100Z" fill="#3a3225"/><circle cx="164" cy="66" r="2.5" fill="#d8c27a"/>' +
    '<path d="M640 30L590 38V93L640 100Z" fill="#3a3225"/><rect x="606" y="46" width="14" height="10" fill="#6a8c5a" opacity=".6"/>' +
    '<g class="hp-a"><g transform="translate(196 70)"><path d="M-14 20V-2a14 14 0 0 1 28 0V20l-5 -5 -5 5 -4 -5 -5 5 -4 -5z" fill="#f2f0e6"/>' +
      '<circle cx="-5" cy="-1" r="2.6" fill="#1b1b1b"/><circle cx="5" cy="-1" r="2.6" fill="#1b1b1b"/><path d="M-4 6q4 3 8 0" stroke="#1b1b1b" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<path class="hp-wave" d="M13 4q10 -6 12 -14" stroke="#f2f0e6" stroke-width="5" stroke-linecap="round" fill="none"/></g></g>' +
    '<rect class="hp-dim" width="760" height="110" fill="#000"/>' +
    '<g class="hp-b"><path class="hp-torch" d="M380 112L300 40H460Z" fill="#fff3b0" opacity=".2"/></g>' +
    burst(380, 52, ["#39d98a", "#fbf8e4", "#ffd23f"]) + bonnie();
};

SCENES.lw = function(){
  function curtain(x, dir){
    return '<path d="M' + x + ' 0H' + (x + dir * 150) + 'Q' + (x + dir * 110) + ' 60 ' + (x + dir * 130) + ' 110H' + x + 'Z" fill="#8e1b2e"/>' +
      rep(5, function(i){ return '<path d="M' + (x + dir * (20 + i * 24)) + ' 12Q' + (x + dir * (12 + i * 24)) + ' 60 ' + (x + dir * (18 + i * 22)) + ' 110" stroke="#6a1020" stroke-width="3" fill="none"/>'; });
  }
  return '<rect width="760" height="110" fill="#1b0f1e"/><rect x="0" y="10" width="760" height="70" fill="#24142a"/>' +
    '<rect y="80" width="760" height="30" fill="#6b4426"/>' + rep(8, function(i){ return '<path d="M' + (i * 100) + ' 80V110" stroke="#4e2f18"/>'; }) +
    '<rect y="80" width="760" height="3" fill="#3d2614"/>' +
    '<g class="hp-sl"><path d="M150 0L250 100H330Z" fill="#fff3c4" opacity=".16"/><circle cx="150" cy="4" r="9" fill="#d9d2b0"/></g>' +
    '<g class="hp-sr"><path d="M610 0L430 100H510Z" fill="#fff3c4" opacity=".16"/><circle cx="610" cy="4" r="9" fill="#d9d2b0"/></g>' +
    '<g class="hp-b"><path d="M380 46V96M368 96h24" stroke="#d9d2b0" stroke-width="4" stroke-linecap="round"/><rect x="372" y="34" width="16" height="16" rx="8" fill="#9aa0a6"/>' +
      '<ellipse cx="380" cy="98" rx="70" ry="9" fill="#fff3c4" opacity=".22"/></g>' +
    '<g class="hp-curt">' + curtain(0, 1) + curtain(760, -1) + '</g>' +
    '<rect width="760" height="12" fill="#7a1426"/>' + rep(19, function(i){ return '<path d="M' + (i * 40) + ' 12q20 14 40 0" fill="#7a1426"/>'; }) +
    '<g class="hp-a">' + [[300, 52, "#ffd23f"], [380, 40, "#20adca"], [460, 52, "#ef7724"]].map(function(p){ return star(p[0], p[1], 9, p[2]); }).join("") + '</g>' +
    burst(380, 50, ["#ffd23f", "#ffffff", "#20adca"]) + bonnie();
};

SCENES.lp = function(){
  return '<rect width="760" height="110" fill="#0f3d63"/>' +
    rep(39, function(i){ return '<path d="M' + i * 20 + ' 0V110" stroke="#fff" stroke-opacity="' + (i % 5 ? ".07" : ".16") + '"/>'; }) +
    rep(6, function(i){ return '<path d="M0 ' + i * 20 + 'H760" stroke="#fff" stroke-opacity="' + (i % 5 ? ".07" : ".16") + '"/>'; }) +
    '<g fill="none" stroke="#e8f4ff" stroke-width="2"><path d="M250 92V56L320 26L390 56V92Z"/><rect x="306" y="66" width="22" height="26"/><rect x="346" y="62" width="24" height="16"/>' +
      '<path d="M250 102H390M250 98v8M390 98v8" stroke-opacity=".6"/><path d="M110 92V46H200V92Z" stroke-dasharray="6 5" stroke-opacity=".6"/></g>' +
    '<path class="hp-a" d="M450 58l14 14l30 -34" fill="none" stroke="#ffd23f" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<g class="hp-b"><g class="hp-stamp"><rect x="540" y="30" width="150" height="44" rx="6" fill="none" stroke="#ef7724" stroke-width="4"/>' +
      '<text x="615" y="60" text-anchor="middle" ' + F + ' font-size="20" font-weight="700" fill="#ef7724">APPROVED</text></g></g>' +
    burst(615, 52, ["#ffd23f", "#ef7724", "#ffffff"]) + bonnie();
};

SCENES.egw = function(){
  var stars = [[40, 20], [96, 44], [150, 14], [210, 38], [270, 18], [330, 50], [400, 12], [452, 34], [520, 16], [580, 44], [640, 22], [730, 50], [700, 70], [60, 64], [480, 60]];
  return '<defs><linearGradient id="hpEgS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1024"/><stop offset="1" stop-color="#262f57"/></linearGradient></defs>' +
    '<rect width="760" height="110" fill="url(#hpEgS)"/>' +
    stars.map(function(p, i){ return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i % 3 ? 1.4 : 2.2) + '" fill="#eef0ff" opacity="' + (i % 2 ? ".55" : ".9") + '"/>'; }).join("") +
    '<circle cx="690" cy="26" r="14" fill="#eef0ff"/><circle cx="685" cy="22" r="3" fill="#c9cdf0"/><circle cx="694" cy="31" r="2" fill="#c9cdf0"/>' +
    '<rect y="88" width="760" height="22" fill="#0a0d1d"/><rect x="40" y="80" width="220" height="10" rx="3" fill="#161b38"/>' +
    '<path d="M90 80V52l26 -14" stroke="#3a4170" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M104 30l26 -6l4 18z" fill="#ff5d5d"/>' +
    '<path d="M118 42L90 80H170Z" fill="#ffd23f" opacity=".12"/><rect x="170" y="70" width="40" height="10" rx="2" fill="#3a5cff"/><rect x="176" y="62" width="34" height="8" rx="2" fill="#19c39a"/>' +
    '<g class="hp-a"><path d="M560 12L470 52" stroke="#eef0ff" stroke-width="3" stroke-linecap="round" opacity=".8"/>' + star(470, 52, 6, "#ffd23f") + '</g>' +
    '<g class="hp-b"><g class="hp-comet"><path d="M600 40Q540 30 470 44" stroke="#22b8e6" stroke-opacity=".5" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="600" cy="40" r="9" fill="#eef0ff"/></g></g>' +
    burst(540, 46, ["#ffd23f", "#22b8e6", "#ffffff"]) + bonnie();
};

var CSS = [
  /* the scene band across the top of the question card */
  ".hp-scene{position:relative;margin:-22px -22px 14px;height:104px;overflow:hidden;border-bottom:3px solid rgba(0,0,0,.2);background:#111}",
  ".hp-scene svg{display:block;width:100%;height:100%}",
  "@media (max-width:560px){.hp-scene{margin:-18px -16px 12px;height:86px}}",
  ".hp-scene .hp-b,.hp-scene .hp-w,.hp-scene .hp-bon,.hp-scene .hp-splash{opacity:0}",
  ".hp-scene .hp-b{transition:opacity .6s ease}.hp-scene.is-boss .hp-b{opacity:1}",
  ".hp-scene g,.hp-scene path,.hp-scene ellipse,.hp-scene rect{transform-box:fill-box;transform-origin:center}",
  ".hp-tag{position:absolute;top:8px;left:10px;font:700 .78rem/1 var(--display,Arial),sans-serif;letter-spacing:.08em;text-transform:uppercase;background:rgba(0,0,0,.55);color:#fff;border-radius:99px;padding:5px 10px;display:none}",
  ".hp-scene.is-boss .hp-tag{display:inline-flex;align-items:center;gap:6px}",
  ".hp-tag svg{width:14px;height:14px}",
  /* every right answer */
  ".hp-scene.do-react .hp-a{animation:var(--hp-react) 1s cubic-bezier(.3,.8,.4,1)}",
  /* a boss win: the stake plays out and the stars fly */
  ".hp-scene.do-win .hp-st{animation:hpStar 1.2s ease-out}",
  "@keyframes hpStar{0%{opacity:0;transform:translate(0,0) scale(.4)}25%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.1)}}",
  ".hp-scene.do-win .hp-w{opacity:1}",
  /* Bonnie */
  ".hp-scene.bon-peek .hp-bon{animation:hpPeek 2.6s ease-in-out}",
  "@keyframes hpPeek{0%{opacity:0;transform:translateY(40px)}18%,80%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(40px)}}",
  ".hp-scene.bon-hop .hp-bon{animation:hpHop 1.4s ease-in-out}",
  "@keyframes hpHop{0%{opacity:0;transform:translate(0,30px)}20%{opacity:1;transform:translate(0,0)}35%{transform:translate(-30px,-22px)}50%{transform:translate(-60px,0)}65%{transform:translate(-90px,-22px)}80%{opacity:1;transform:translate(-120px,0)}100%{opacity:0;transform:translate(-120px,30px)}}",

  /* JT: the ball goes in, the net ripples; boss: a penalty against the keeper */
  ".hp-jt{--hp-react:hpJtShot}",
  "@keyframes hpJtShot{0%{transform:translate(0,0)}55%{transform:translate(200px,-46px) rotate(300deg)}70%{transform:translate(236px,-34px) rotate(360deg);opacity:1}85%{opacity:0}86%{transform:translate(0,0);opacity:0}100%{opacity:1}}",
  ".hp-jt.do-react .hp-net{animation:hpNet 1s ease-out}",
  "@keyframes hpNet{0%,52%{transform:none}64%{transform:scale(1.07,1.04)}100%{transform:none}}",
  ".hp-jt.is-boss .hp-keep{animation:hpSway 2.4s ease-in-out infinite alternate}",
  "@keyframes hpSway{from{transform:translateX(-14px)}to{transform:translateX(14px)}}",
  ".hp-jt.do-win .hp-keep{animation:hpDive 1.1s ease-out}",
  "@keyframes hpDive{0%{transform:none}40%,80%{transform:translate(-30px,14px) rotate(-70deg)}100%{transform:none}}",
  ".hp-jt.do-win .hp-a{animation:hpJtTop 1.1s cubic-bezier(.3,.8,.4,1)}",
  "@keyframes hpJtTop{0%{transform:translate(0,0)}55%{transform:translate(270px,-56px) rotate(300deg);opacity:1}80%{opacity:0;transform:translate(282px,-50px)}81%{transform:translate(0,0);opacity:0}100%{opacity:1}}",
  ".hp-jt.do-miss .hp-a{animation:hpJtSave 1.2s ease-out}",
  "@keyframes hpJtSave{0%{transform:translate(0,0)}60%{transform:translate(236px,-46px);opacity:1}80%{opacity:0}81%{transform:translate(0,0);opacity:0}100%{opacity:1}}",

  /* HK: the float bobs, a fish leaps; boss: a big one under the water */
  ".hp-hk{--hp-react:hpHkLeap}",
  ".hp-hk .hp-float{animation:hpBob 2.6s ease-in-out infinite}",
  "@keyframes hpBob{0%,100%{transform:translateY(0)}50%{transform:translateY(2px)}}",
  ".hp-hk .hp-sonar{animation:hpPulse 3.2s ease-in-out infinite}",
  "@keyframes hpPulse{0%,100%{opacity:.6}50%{opacity:1}}",
  ".hp-hk .hp-a{opacity:0}",
  "@keyframes hpHkLeap{0%{opacity:0;transform:translate(0,0)}15%{opacity:1}50%{transform:translate(-28px,-60px) rotate(-35deg)}85%{opacity:1;transform:translate(-56px,-4px) rotate(30deg)}100%{opacity:0;transform:translate(-60px,4px)}}",
  ".hp-hk.do-react .hp-splash,.hp-hk.do-win .hp-splash{animation:hpSplash 1s ease-out}",
  "@keyframes hpSplash{0%,10%{opacity:.9;transform:scale(.4)}100%{opacity:0;transform:scale(2.2)}}",
  ".hp-hk.is-boss .hp-big{animation:hpDrift 3s ease-in-out infinite alternate}",
  "@keyframes hpDrift{from{transform:translateX(-10px)}to{transform:translateX(16px)}}",
  ".hp-hk.do-win .hp-big{animation:hpBigLeap 1.3s ease-out}",
  "@keyframes hpBigLeap{0%{transform:none}45%{transform:translate(-20px,-62px) rotate(-30deg)}75%{transform:translate(-40px,-50px) rotate(20deg)}100%{transform:none}}",
  ".hp-hk.do-miss .hp-big{animation:hpSwimOff 1.6s ease-in-out}",
  "@keyframes hpSwimOff{0%{transform:none;opacity:1}50%{transform:translateX(160px);opacity:0}51%{transform:translateX(-60px)}100%{transform:none;opacity:1}}",

  /* LC: a friendly ghost waves from the door; boss: the lights go down and the torch comes out */
  ".hp-lc{--hp-react:hpGhost}",
  ".hp-lc .hp-a{opacity:0}",
  "@keyframes hpGhost{0%{opacity:0;transform:translateX(-26px)}25%,75%{opacity:1;transform:translateX(0)}100%{opacity:0;transform:translateX(-26px)}}",
  ".hp-lc.do-react .hp-wave,.hp-lc.do-win .hp-wave{animation:hpWave .4s ease-in-out 3 alternate}",
  "@keyframes hpWave{from{transform:rotate(-20deg)}to{transform:rotate(25deg)}}",
  ".hp-lc .hp-dim{opacity:0;transition:opacity 1.4s ease}.hp-lc.is-boss .hp-dim{opacity:.5}",
  ".hp-lc.is-boss.do-win .hp-dim{opacity:0}",
  ".hp-lc.is-boss .hp-torch{animation:hpTorch 3.4s ease-in-out infinite alternate}",
  "@keyframes hpTorch{from{transform:rotate(-12deg)}to{transform:rotate(12deg)}}",
  ".hp-lc.do-win .hp-a{animation:hpGhost 1.6s ease-in-out}",

  /* LW: the spotlights swing in and stars pop; boss: the big finale at the mic */
  ".hp-lw{--hp-react:hpPop}",
  ".hp-lw .hp-a{opacity:0}",
  "@keyframes hpPop{0%{opacity:0;transform:translateY(16px) scale(.6)}35%{opacity:1;transform:translateY(-6px) scale(1.1)}75%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-10px)}}",
  ".hp-lw .hp-sl{transform-origin:150px 4px;transform-box:view-box}.hp-lw .hp-sr{transform-origin:610px 4px;transform-box:view-box}",
  ".hp-lw.do-react .hp-sl,.hp-lw.do-win .hp-sl{animation:hpSwingL 1s ease-in-out}",
  ".hp-lw.do-react .hp-sr,.hp-lw.do-win .hp-sr{animation:hpSwingR 1s ease-in-out}",
  "@keyframes hpSwingL{0%,100%{transform:none}50%{transform:rotate(-16deg)}}",
  "@keyframes hpSwingR{0%,100%{transform:none}50%{transform:rotate(16deg)}}",
  ".hp-lw.do-miss .hp-curt{animation:hpCurt 1.2s ease-in-out}",
  "@keyframes hpCurt{0%,100%{transform:none}30%{transform:scaleX(1.03)}60%{transform:scaleX(.98)}}",

  /* LP: a yellow tick draws itself; boss: the APPROVED stamp lands */
  ".hp-lp{--hp-react:hpTick}",
  ".hp-lp .hp-a{stroke-dasharray:80;stroke-dashoffset:80}",
  "@keyframes hpTick{0%{stroke-dashoffset:80;opacity:1}45%,80%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}",
  ".hp-lp.is-boss .hp-stamp{animation:hpHover 2.2s ease-in-out infinite alternate;opacity:.9}",
  "@keyframes hpHover{from{transform:translateY(-6px) rotate(-6deg)}to{transform:translateY(-12px) rotate(-6deg)}}",
  ".hp-lp.do-win .hp-stamp{animation:hpStamp 1.2s cubic-bezier(.3,1.4,.5,1);opacity:1}",
  "@keyframes hpStamp{0%{transform:scale(1.6) rotate(-6deg);opacity:.3}30%,85%{transform:scale(1) rotate(-6deg);opacity:1}100%{transform:scale(1) rotate(-6deg);opacity:.9}}",
  ".hp-lp.do-miss .hp-stamp{animation:hpLift 1.2s ease-in-out}",
  "@keyframes hpLift{0%,100%{transform:translateY(-6px) rotate(-6deg)}50%{transform:translateY(-40px) rotate(-6deg);opacity:.2}}",

  /* EGW: a shooting star; boss: a comet to catch */
  ".hp-egw{--hp-react:hpShoot}",
  ".hp-egw .hp-a{opacity:0}",
  "@keyframes hpShoot{0%{opacity:0;transform:translate(120px,-30px)}20%{opacity:1}100%{opacity:0;transform:translate(-160px,40px)}}",
  ".hp-egw.is-boss .hp-comet{animation:hpDrift 3s ease-in-out infinite alternate}",
  ".hp-egw.do-win .hp-comet{animation:hpCatch 1.2s ease-in}",
  "@keyframes hpCatch{0%{transform:none}60%{transform:translate(-60px,6px) scale(1.3)}100%{transform:none}}",
  ".hp-egw.do-miss .hp-comet{animation:hpSwimOff 1.6s ease-in-out}",

  /* boss round badge inside the question */
  ".hp-bossline{display:flex;align-items:center;gap:8px;margin:0 0 10px;font-family:var(--display,Arial),sans-serif;font-weight:700;font-size:.9rem}",
  ".hp-bossline b{background:var(--ink,#141a33);color:#fff;border-radius:99px;padding:4px 11px;letter-spacing:.06em;text-transform:uppercase;font-size:.78rem}",
  ".hp-bossline span{opacity:.75;font-weight:500}",

  /* combo meter (in the chips row) */
  ".hp-combo{display:inline-flex;align-items:center;gap:4px}",
  ".hp-combo i{width:11px;height:11px;border-radius:50%;border:2px solid currentColor;opacity:.45;display:inline-block;transition:background .2s,opacity .2s,transform .2s}",
  ".hp-combo i.on{background:#ffd23f;border-color:#b98a00;opacity:1;transform:scale(1.15)}",
  ".hp-combo b{margin-left:3px}",
  ".chipstat.hp-hot{background:#ffd23f;color:#141a33;animation:hpGlow 1.6s ease-in-out infinite alternate}",
  ".chipstat.hp-hot .hp-combo i.on{background:#141a33;border-color:#141a33}",
  "@keyframes hpGlow{from{box-shadow:0 0 0 0 rgba(255,210,63,.5)}to{box-shadow:0 0 0 6px rgba(255,210,63,0)}}",
  ".plus .hp-x2{margin-left:6px;background:#ffd23f;color:#141a33;border-radius:99px;padding:1px 7px;font-size:.8em}",

  /* big answer tiles for short answers */
  ".choices.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}",
  ".choices.tiles button{text-align:center;font-size:1.22rem;font-weight:700;min-height:74px;display:flex;align-items:center;justify-content:center;padding:14px 12px}",
  ".choices.tiles.n3 button:last-child{grid-column:1 / -1}",
  "@media (min-width:700px){.choices.tiles.n3{grid-template-columns:repeat(3,minmax(0,1fr))}.choices.tiles.n3 button:last-child{grid-column:auto}}",
  "@media (max-width:480px){.choices.tiles,.choices.tiles.n3{grid-template-columns:1fr}.choices.tiles button{min-height:58px}}",

  /* animated intros on reading cards */
  ".fig.hp-intro svg>*{animation:hpBuild .55s cubic-bezier(.2,1.3,.4,1) both}",
  rep(14, function(i){ return ".fig.hp-intro svg>*:nth-child(" + (i + 1) + "){animation-delay:" + (i * 0.09).toFixed(2) + "s}"; }),
  ".fig.hp-intro svg>*:nth-child(n+15){animation-delay:1.3s}",
  "@keyframes hpBuild{from{opacity:0;transform:translateY(10px) scale(.96)}to{opacity:1;transform:none}}",
  ".learnbody.hp-one>*:first-child{font-size:1.12rem;font-weight:700;animation:hpBuild .5s ease both;animation-delay:.5s}",
  ".hp-more{margin:6px 0 4px}",
  ".learnbody .hp-fresh{animation:hpBuild .4s ease both}",

  /* end of a chunk: Bonnie trots across, then the game unlock bar */
  ".hp-trot{position:relative;height:70px;margin:4px 0 6px;overflow:hidden;pointer-events:none}",
  ".hp-trot .hp-dog{position:absolute;left:0;bottom:0;animation:hpTrot 3.4s linear both}",
  ".hp-trot .hp-dog svg{transform:scaleX(-1);animation:hpTrotBob .28s ease-in-out infinite alternate}",
  "@keyframes hpTrot{0%{left:-90px}100%{left:calc(100% + 10px)}}",
  "@keyframes hpTrotBob{from{transform:scaleX(-1) translateY(0)}to{transform:scaleX(-1) translateY(-4px)}}",
  ".hp-unlock{margin:10px auto 4px;max-width:440px;border:2px dashed rgba(20,26,51,.25);border-radius:14px;padding:12px 14px;text-align:left}",
  ".hp-unlock .hp-ut{display:flex;justify-content:space-between;gap:10px;font-family:var(--display,Arial),sans-serif;font-weight:700;font-size:.95rem}",
  ".hp-unlock .hp-ut span{font-weight:500;opacity:.75;white-space:nowrap}",
  ".hp-bar{height:14px;border-radius:99px;background:rgba(20,26,51,.12);margin-top:8px;overflow:hidden}",
  ".hp-bar i{display:block;height:100%;width:0;border-radius:99px;background:linear-gradient(90deg,#ef7724,#ffd23f);transition:width 1.4s cubic-bezier(.3,.8,.3,1)}",
  ".hp-unlock.hp-new{border-style:solid;border-color:#ffd23f;background:rgba(255,210,63,.18);animation:hpBuild .6s cubic-bezier(.2,1.4,.4,1) both}",
  ".hp-unlock.hp-new .hp-ut{font-size:1.08rem}",
  ".hp-unlock a{font-weight:700}"
].join("\n");

function addCss(){
  if(d.getElementById("hpCss")) return;
  var st = d.createElement("style"); st.id = "hpCss"; st.textContent = CSS; d.head.appendChild(st);
}

var CROWN = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 15l1-9 4 4 3-6 3 6 4-4 1 9z" fill="#ffd23f"/></svg>';
var BOSS_LINE = { jt: "Penalty", hk: "Big one on the line", lc: "Lights out", lw: "The big finale", lp: "Final sign off", egw: "Catch the comet" };

var scene = null;
function ensureScene(card){
  if(!card) return null;
  if(scene && card.contains(scene)) return scene;
  scene = d.createElement("div");
  scene.className = "hp-scene hp-" + W.id;
  scene.setAttribute("aria-hidden", "true");
  scene.innerHTML = '<svg viewBox="0 0 760 110" preserveAspectRatio="xMidYMid slice">' + (SCENES[W.id] || SCENES.egw)() + '</svg>' +
    '<span class="hp-tag">' + CROWN + 'Boss round</span>';
  card.insertBefore(scene, card.firstChild);
  return scene;
}
/* restart a CSS animation class */
var timers = {};
function play(cls, ms){
  if(!scene) return;
  scene.classList.remove(cls);
  void scene.getBoundingClientRect();
  scene.classList.add(cls);
  clearTimeout(timers[cls]);
  timers[cls] = setTimeout(function(){ if(scene) scene.classList.remove(cls); }, ms || 1300);
}

var learnCount = 0;
function step(card, info){
  addCss();
  var sc = ensureScene(card);
  if(!sc) return;
  sc.classList.toggle("is-boss", !!(info && info.boss));
  ["do-react", "do-win", "do-miss"].forEach(function(c){ sc.classList.remove(c); });
  if(info && info.learn){
    /* Bonnie peeks in on every other new idea, so she stays a surprise */
    learnCount++;
    if(learnCount % 2 === 1) setTimeout(function(){ play("bon-peek", 2700); }, 900);
  }
  if(info && info.boss && info.body && !info.body.querySelector(".hp-bossline")){
    var b = d.createElement("div");
    b.className = "hp-bossline";
    b.innerHTML = "<b>Boss round</b><span>" + (BOSS_LINE[W.id] || "") + " &middot; +5 sparks</span>";
    info.body.insertBefore(b, info.body.firstChild);
  }
}

function result(info){
  if(!scene || !info) return;
  var st = info.status;
  if(st === "right1" || st === "right2"){
    if(info.boss) play("do-win", 1600); else play("do-react", 1200);
    if(info.combo) setTimeout(function(){ play("bon-hop", 1500); }, 300);
  }else if(st === "shown" && info.boss){
    play("do-miss", 1700);
  }
}

/* ---------- the HQ game link ---------- */
function loadScript(src, test){
  if(test()) return Promise.resolve();
  return new Promise(function(res){
    var s = d.createElement("script"); s.src = src;
    s.onload = s.onerror = function(){ res(); };
    d.head.appendChild(s);
  });
}
function readJ(k){ try{ return JSON.parse(localStorage.getItem(k) || "null"); }catch(e){ return null; } }
function writeJ(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
function gameSparks(){
  var G = window.HQGame;
  var t = /[?&]hqtest(=|&|$)/.test(location.search) && location.search.match(/[?&]gsparks=(\d+)/);
  if(t) return +t[1];
  if(G && G.sparks) try{ return G.sparks(PREFIX); }catch(e){}
  return null;
}
function ladder(n){
  var have = 0, next = null, prev = 0;
  W.unlocks.forEach(function(u){ if(n >= u[0]){ have++; prev = u[0]; } else if(!next) next = u; });
  return { have: have, next: next, prev: prev };
}
function unlockBox(host){
  if(!host || window.B5Site && window.B5Site.guest) return;
  loadScript("/data/hqgame.js?v=1", function(){ return !!window.HQGame; }).then(function(){
    var n = gameSparks();
    if(n == null) return;
    var L = ladder(n), seenK = PREFIX + "play.unlocks.v1", seen = readJ(seenK) || {};
    var lastHave = typeof seen.have === "number" ? seen.have : L.have;
    var box = d.createElement("div");
    box.className = "hp-unlock";
    if(L.have > lastHave){
      var got = W.unlocks[L.have - 1];
      box.classList.add("hp-new");
      box.innerHTML = '<div class="hp-ut">New in ' + W.game + ': ' + got[1] + '</div>' +
        '<p class="tiny" style="margin:6px 0 0">It is waiting in your HQ game.</p>';
    }else if(L.next){
      var from = L.prev, to = L.next[0], pct = Math.max(0, Math.min(100, Math.round((n - from) / (to - from) * 100)));
      var before = typeof seen.n === "number" && seen.n >= from && seen.n <= n ? Math.round((seen.n - from) / (to - from) * 100) : Math.max(0, pct - 10);
      box.innerHTML = '<div class="hp-ut">Next in ' + W.game + ': ' + L.next[1] + '<span>' + (to - n) + ' sparks to go</span></div>' +
        '<div class="hp-bar"><i style="width:' + before + '%"></i></div>';
      setTimeout(function(){ var i = box.querySelector(".hp-bar i"); if(i) i.style.width = pct + "%"; }, 450);
    }else{
      box.innerHTML = '<div class="hp-ut">Everything in ' + W.game + ' is unlocked.</div>';
    }
    host.appendChild(box);
    writeJ(seenK, { have: L.have, n: n, at: new Date().toISOString() });
  });
}

function chunkEnd(card, info){
  addCss();
  if(!card) return;
  [].forEach.call(card.querySelectorAll(".hp-trot,.hp-unlock,.hp-endhost"), function(el){ el.remove(); });
  var trot = d.createElement("div");
  trot.className = "hp-trot";
  trot.setAttribute("aria-hidden", "true");
  trot.innerHTML = '<div class="hp-dog">' + bonnieCard() + '</div>';
  var tally = card.querySelector("#chunkTally") || card.firstChild;
  tally.parentNode.insertBefore(trot, tally.nextSibling);
  var host = d.createElement("div");
  host.className = "hp-endhost";
  trot.parentNode.insertBefore(host, trot.nextSibling);
  unlockBox(host);
}

function unit(){ return W.unit; }

window.HQPlay = { unit: unit, step: step, result: result, chunkEnd: chunkEnd, world: W, worlds: WORLDS, v: 1 };
addCss();
})();
