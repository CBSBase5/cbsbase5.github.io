/* ==========================================================
   Base 5 - pixel Jay (and Bonnie) for Today's two
   A small pixel Jay: messy brown hair, big eyebrows, school teal
   top. He looks pleased with himself while he says the day's
   mistake, then reacts once the slip is found. A different
   reaction most days; some days Bonnie (a brown toy poodle, no
   tail) gives him a look.

   B5JayPix.svg(name, label)  -> an inline SVG string
   B5JayPix.reactions         -> the names the day picks from
   B5JayPix.pick(n)           -> a reaction for day number n
   Drawn entirely in code. Original art. ASCII only.
   ========================================================== */
(function(){
"use strict";
if(window.B5JayPix) return;
var C = {
  H: "#6b4423", h: "#4e2f17", S: "#f3cfa8", s: "#dcae84", E: "#3b2414", W: "#ffffff", K: "#1d1f24",
  M: "#9c3b32", T: "#007291", t: "#005a73", L: "#ef7724", P: "#f29b8c", D: "#7cc8f0", Q: "#0a2f38",
  B: "#8a5a34", b: "#6b4423", n: "#a8744a"
};
function R(o, x, y, w, h, c){ o.push('<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + C[c] + '"/>'); }

/* the parts of Jay; f holds the expression */
function jay(o, f, dx){
  dx = dx || 0;
  function r(x, y, w, h, c){ R(o, x + dx, y, w, h, c); }
  /* body: teal top, white collar, orange lanyard */
  r(3, 16, 14, 4, "T"); r(2, 17, 16, 3, "T"); r(2, 19, 16, 1, "t");
  r(8, 15, 4, 1, "s"); r(8, 16, 1, 1, "W"); r(11, 16, 1, 1, "W"); r(9, 16, 2, 1, "s");
  r(7, 17, 1, 3, "L"); r(12, 17, 1, 3, "L"); r(9, 19, 2, 1, "W");
  /* head */
  r(4, 5, 12, 8, "S"); r(5, 13, 10, 1, "S"); r(6, 14, 8, 1, "s");
  r(3, 8, 1, 3, "S"); r(16, 8, 1, 3, "S"); r(3, 9, 1, 1, "s"); r(16, 9, 1, 1, "s");
  /* messy hair */
  r(4, 2, 12, 3, "H"); r(3, 3, 1, 4, "H"); r(16, 3, 1, 4, "H"); r(5, 1, 10, 1, "H");
  r(6, 0, 1, 1, "H"); r(9, 0, 2, 1, "H"); r(13, 0, 1, 1, "H"); r(15, 1, 1, 1, "H"); r(2, 3, 1, 1, "H"); r(17, 2, 1, 1, "H");
  r(5, 5, 2, 1, "H"); r(9, 5, 1, 1, "H"); r(12, 5, 2, 1, "H"); r(4, 4, 1, 2, "h"); r(15, 4, 1, 2, "h");
  r(7, 2, 1, 1, "h"); r(11, 1, 1, 2, "h"); r(14, 3, 1, 1, "h");
  /* nose */
  r(10, 10, 1, 2, "s"); r(9, 11, 1, 1, "s");
  /* big eyebrows */
  var by = f.brow === "up" ? 5 : 6;
  if(f.brow === "worry"){ r(5, 7, 2, 1, "E"); r(7, 6, 2, 1, "E"); r(11, 6, 2, 1, "E"); r(13, 7, 2, 1, "E"); }
  else if(f.brow === "one"){ r(5, 6, 4, 1, "E"); r(5, 7, 1, 1, "E"); r(11, 5, 4, 1, "E"); r(14, 6, 1, 1, "E"); }
  else { r(5, by, 4, 1, "E"); r(11, by, 4, 1, "E"); r(5, by + 1, 1, 1, "E"); r(14, by + 1, 1, 1, "E"); }
  /* eyes */
  if(f.eyes === "shut"){ r(6, 9, 2, 1, "K"); r(12, 9, 2, 1, "K"); }
  else if(f.eyes === "happy"){ r(6, 9, 1, 1, "K"); r(7, 8, 1, 1, "K"); r(8, 9, 1, 1, "K"); r(12, 9, 1, 1, "K"); r(13, 8, 1, 1, "K"); r(14, 9, 1, 1, "K"); }
  else if(f.eyes === "wide"){ r(6, 8, 2, 3, "W"); r(12, 8, 2, 3, "W"); r(7, 9, 1, 1, "K"); r(13, 9, 1, 1, "K"); }
  else if(f.eyes === "side"){ r(6, 8, 2, 2, "W"); r(12, 8, 2, 2, "W"); r(7, 8, 1, 2, "K"); r(13, 8, 1, 2, "K"); }
  else if(f.eyes === "shades"){ r(4, 8, 12, 1, "K"); r(5, 9, 4, 2, "K"); r(11, 9, 4, 2, "K"); r(6, 9, 1, 1, "W"); r(12, 9, 1, 1, "W"); }
  else if(f.eyes === "x"){ r(6, 8, 1, 1, "K"); r(8, 8, 1, 1, "K"); r(7, 9, 1, 1, "K"); r(6, 10, 1, 1, "K"); r(8, 10, 1, 1, "K");
    r(12, 8, 1, 1, "K"); r(14, 8, 1, 1, "K"); r(13, 9, 1, 1, "K"); r(12, 10, 1, 1, "K"); r(14, 10, 1, 1, "K"); }
  else if(f.eyes !== "none"){ r(6, 8, 2, 2, "W"); r(12, 8, 2, 2, "W"); r(7, 9, 1, 1, "K"); r(12, 9, 1, 1, "K"); }
  if(f.blush){ r(5, 11, 2, 1, "P"); r(13, 11, 2, 1, "P"); }
  /* mouth */
  if(f.mouth === "smile"){ r(7, 12, 1, 1, "M"); r(8, 13, 4, 1, "M"); r(12, 12, 1, 1, "M"); }
  else if(f.mouth === "smirk"){ r(8, 13, 3, 1, "M"); r(11, 12, 1, 1, "M"); }
  else if(f.mouth === "flat"){ r(8, 13, 4, 1, "M"); }
  else if(f.mouth === "o"){ r(9, 12, 2, 2, "M"); }
  else if(f.mouth === "wobble"){ r(7, 13, 1, 1, "M"); r(8, 12, 1, 1, "M"); r(9, 13, 1, 1, "M"); r(10, 12, 1, 1, "M"); r(11, 13, 1, 1, "M"); r(12, 12, 1, 1, "M"); }
  else if(f.mouth === "grin"){ r(7, 12, 6, 2, "M"); r(8, 12, 4, 1, "W"); }
}
var FACES = {
  smug:   { brow: "one", eyes: "open", mouth: "smirk" },
  facepalm: { brow: "one", eyes: "open", mouth: "flat" },
  shrug:  { brow: "up", eyes: "open", mouth: "wobble" },
  sweat:  { brow: "worry", eyes: "open", mouth: "grin" },
  oops:   { brow: "up", eyes: "wide", mouth: "none" },
  scratch: { brow: "worry", eyes: "open", mouth: "smirk" },
  blush:  { brow: "worry", eyes: "happy", mouth: "smile", blush: 1 },
  bonnie: { brow: "worry", eyes: "side", mouth: "grin", blush: 1 },
  cool:   { brow: "up", eyes: "shades", mouth: "smirk" },
  cry:    { brow: "worry", eyes: "shut", mouth: "wobble" },
  salute: { brow: "up", eyes: "open", mouth: "smile" },
  think:  { brow: "one", eyes: "side", mouth: "flat" },
  dizzy:  { brow: "up", eyes: "x", mouth: "o" },
  thumbs: { brow: "up", eyes: "happy", mouth: "grin" }
};
function extras(o, name){
  if(name === "facepalm"){
    /* a hand over his eyes, the arm up from the shoulder */
    R(o, 4, 14, 3, 3, "T"); R(o, 4, 12, 2, 2, "S");
    R(o, 4, 7, 7, 5, "s"); R(o, 4, 7, 7, 1, "S"); R(o, 5, 9, 5, 1, "S");
  } else if(name === "shrug"){
    R(o, 0, 14, 3, 3, "T"); R(o, 0, 12, 2, 2, "s"); R(o, 17, 14, 3, 3, "T"); R(o, 18, 12, 2, 2, "s");
    R(o, 0, 11, 1, 1, "s"); R(o, 19, 11, 1, 1, "s");
  } else if(name === "sweat"){
    R(o, 17, 4, 1, 1, "D"); R(o, 17, 5, 2, 2, "D"); R(o, 18, 5, 1, 1, "W");
  } else if(name === "oops"){
    R(o, 6, 11, 8, 3, "s"); R(o, 6, 11, 8, 1, "S"); R(o, 8, 12, 1, 2, "S"); R(o, 11, 12, 1, 2, "S"); R(o, 7, 14, 6, 2, "T");
  } else if(name === "scratch"){
    R(o, 16, 6, 2, 10, "T"); R(o, 14, 2, 3, 3, "s"); R(o, 14, 2, 3, 1, "S"); R(o, 16, 5, 1, 1, "s");
    /* a question mark */
    R(o, 17, 0, 3, 1, "Q"); R(o, 19, 1, 1, 2, "Q"); R(o, 18, 3, 1, 1, "Q"); R(o, 18, 5, 1, 1, "Q");
  } else if(name === "cool"){
    /* pretending he meant it */
    R(o, 17, 1, 1, 1, "L"); R(o, 18, 0, 1, 1, "L"); R(o, 19, 1, 1, 1, "L"); R(o, 18, 2, 1, 1, "L");
  } else if(name === "cry"){
    R(o, 6, 10, 1, 3, "D"); R(o, 13, 10, 1, 3, "D"); R(o, 5, 13, 1, 1, "D"); R(o, 14, 13, 1, 1, "D");
  } else if(name === "salute"){
    R(o, 16, 7, 2, 9, "T"); R(o, 12, 4, 5, 2, "s"); R(o, 12, 4, 5, 1, "S");
  } else if(name === "think"){
    R(o, 6, 15, 3, 2, "T"); R(o, 7, 12, 4, 3, "s"); R(o, 7, 12, 4, 1, "S");
    R(o, 17, 4, 1, 1, "Q"); R(o, 18, 2, 1, 1, "Q"); R(o, 18, 0, 2, 1, "Q");
  } else if(name === "dizzy"){
    R(o, 1, 2, 1, 1, "L"); R(o, 0, 3, 3, 1, "L"); R(o, 1, 4, 1, 1, "L");
    R(o, 18, 0, 1, 1, "D"); R(o, 17, 1, 3, 1, "D"); R(o, 18, 2, 1, 1, "D"); R(o, 2, 7, 1, 1, "D"); R(o, 18, 6, 1, 1, "L");
  } else if(name === "thumbs"){
    R(o, 16, 14, 3, 3, "T"); R(o, 16, 11, 3, 3, "s"); R(o, 16, 11, 3, 1, "S"); R(o, 17, 8, 1, 3, "s"); R(o, 17, 8, 1, 1, "S");
  } else if(name === "blush"){
    R(o, 1, 4, 1, 1, "L"); R(o, 0, 6, 1, 1, "L"); R(o, 18, 3, 1, 1, "L"); R(o, 19, 5, 1, 1, "L");
  }
}
/* Bonnie, sitting to Jay's right and looking at him sideways. No tail. */
var BONNIE = [
  "............", "............",
  "....nnnn....",
  "...nBnnBn...",
  "...BBBBBBb..",
  "..BBBBBBBbb.",
  "..BbbBBBbbbb",
  "nnBKWBBBbbbb",
  "KnnBBBBBbbbb",
  "..bBBBBBbbbb",
  "...BBBBB.bbb",
  "...nBBBB..bb",
  "..BBnBBBBB..",
  "..BnBBBBnBB.",
  "..BBBBnBBBB.",
  "..BBBBBBBBB.",
  "..BB.BB..BB.",
  "..BB.BB..BB.",
  ".nnn.nnn.nnn",
  "............"
];
function bonnie(o){
  for(var y = 0; y < BONNIE.length; y++) for(var x = 0; x < BONNIE[y].length; x++){
    var ch = BONNIE[y].charAt(x);
    if(ch !== ".") R(o, 20 + x, y, 1, 1, ch);
  }
}

window.B5JayPix = {
  reactions: ["facepalm", "cool", "shrug", "cry", "sweat", "salute", "oops", "think", "scratch", "dizzy", "blush", "thumbs", "bonnie"],
  pick: function(n){ var a = this.reactions; return a[((n % a.length) + a.length) % a.length]; },
  svg: function(name, label){
    var f = FACES[name] || FACES.smug, wide = name === "bonnie", o = [];
    jay(o, f, 0);
    extras(o, name);
    if(wide) bonnie(o);
    var w = wide ? 32 : 20;
    return '<svg class="jaypix-svg' + (wide ? " wide" : "") + '" viewBox="0 0 ' + w + ' 20" width="' + (w * 3) + '" height="60" shape-rendering="crispEdges" role="img" aria-label="' +
      (label || "Pixel Jay") + '">' + o.join("") + "</svg>";
  }
};
})();
