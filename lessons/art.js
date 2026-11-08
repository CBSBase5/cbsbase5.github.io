/* ==========================================================
   Base 5 - Lessons: shared drawings, all in code
   LART.svg(viewBox, inner)          a whole <svg>
   LART.bonnie(x, y, s, mood)        Bonnie as a <g> (mood: "", "sleep", "happy")
   LART.bambi(x, y, s)               Bambi as a <g>
   LART.jay(x, y, s, mood)           Jay's head as a <g>
   LART.bird(x, y, s, col)           a small round bird as a <g>
   LART.hand(n)                      a hand holding up n fingers (0 is a fist), whole <svg>
   LART.bubble(x, y, w, h, text, size)  a speech bubble as a <g>
   LART.T(x, y, text, size, opts)    text (opts: b bold, a anchor, c colour, f display font)
   ASCII only.
   ========================================================== */
(function(){
"use strict";
var INK = "#0a2f38", BROWN = "#8b5a3c", BROWN_D = "#6a3f26", BROWN_L = "#b07a52";
var FONT = 'font-family="Atkinson Hyperlegible,Verdana,Arial,sans-serif"';
var DFONT = 'font-family="Archivo,Arial Black,Arial,sans-serif"';

function svg(vb, inner, extra){ return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '"' + (extra ? " " + extra : "") + '>' + inner + '</svg>'; }
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + (o.f ? DFONT : FONT) + ' font-size="' + (size || 28) + '"' + (o.b || o.f ? ' font-weight="' + (o.f ? 900 : 700) + '"' : "") +
    (o.a ? ' text-anchor="' + o.a + '"' : "") + ' fill="' + (o.c || INK) + '"' + (o.x || "") + '>' + s + '</text>';
}

/* Bonnie: brown toy poodle, no tail, curly top, dot eyes */
function bonnie(x, y, s, mood){
  s = s || 1;
  var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">';
  if(mood === "sleep"){
    g += '<ellipse cx="0" cy="44" rx="70" ry="10" fill="' + INK + '" opacity=".12"/>' +
      '<ellipse cx="6" cy="22" rx="56" ry="24" fill="' + BROWN + '"/>' +
      '<circle cx="-14" cy="6" r="12" fill="' + BROWN_L + '" opacity=".6"/><circle cx="10" cy="2" r="13" fill="' + BROWN_L + '" opacity=".5"/><circle cx="30" cy="8" r="12" fill="' + BROWN_L + '" opacity=".5"/>' +
      '<circle cx="-48" cy="20" r="23" fill="' + BROWN + '"/>' +
      '<circle cx="-58" cy="0" r="9" fill="' + BROWN_L + '"/><circle cx="-46" cy="-4" r="10" fill="' + BROWN_L + '"/><circle cx="-34" cy="1" r="9" fill="' + BROWN_L + '"/>' +
      '<ellipse cx="-30" cy="26" rx="8" ry="15" fill="' + BROWN_D + '" transform="rotate(-20 -30 26)"/>' +
      '<ellipse cx="-62" cy="30" rx="12" ry="8" fill="' + BROWN_L + '"/><circle cx="-71" cy="28" r="4" fill="' + INK + '"/>' +
      '<path d="M-56 18q4 3 8 0M-44 18q4 3 8 0" stroke="' + INK + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="-56" cy="42" rx="12" ry="6" fill="' + BROWN_D + '"/><ellipse cx="-34" cy="44" rx="12" ry="6" fill="' + BROWN_D + '"/>';
    return g + '</g>';
  }
  g += '<ellipse cx="0" cy="66" rx="52" ry="8" fill="' + INK + '" opacity=".12"/>' +
    '<rect x="-30" y="34" width="12" height="32" rx="6" fill="' + BROWN_D + '"/><rect x="18" y="34" width="12" height="32" rx="6" fill="' + BROWN_D + '"/>' +
    '<rect x="-16" y="36" width="12" height="30" rx="6" fill="' + BROWN + '"/><rect x="30" y="36" width="12" height="30" rx="6" fill="' + BROWN + '"/>' +
    '<ellipse cx="6" cy="30" rx="44" ry="24" fill="' + BROWN + '"/>' +
    '<circle cx="-16" cy="16" r="11" fill="' + BROWN_L + '" opacity=".55"/><circle cx="8" cy="12" r="12" fill="' + BROWN_L + '" opacity=".5"/><circle cx="30" cy="18" r="11" fill="' + BROWN_L + '" opacity=".5"/>' +
    '<circle cx="-34" cy="0" r="26" fill="' + BROWN + '"/>' +
    '<circle cx="-48" cy="-22" r="10" fill="' + BROWN_L + '"/><circle cx="-34" cy="-28" r="11" fill="' + BROWN_L + '"/><circle cx="-20" cy="-22" r="10" fill="' + BROWN_L + '"/>' +
    '<ellipse cx="-58" cy="8" rx="9" ry="18" fill="' + BROWN_D + '"/><ellipse cx="-10" cy="8" rx="9" ry="18" fill="' + BROWN_D + '"/>' +
    '<ellipse cx="-36" cy="12" rx="13" ry="10" fill="' + BROWN_L + '"/><circle cx="-36" cy="6" r="4.5" fill="' + INK + '"/>' +
    '<circle cx="-43" cy="-5" r="3.4" fill="' + INK + '"/><circle cx="-28" cy="-5" r="3.4" fill="' + INK + '"/>';
  if(mood === "happy") g += '<path d="M-42 16q6 7 12 0" stroke="' + INK + '" stroke-width="2.6" fill="#e2557a" stroke-linecap="round"/>';
  return g + '</g>';
}

/* Bambi: same brown, longer legs, a little taller and more regal */
function bambi(x, y, s){
  s = s || 1;
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<ellipse cx="0" cy="86" rx="56" ry="8" fill="' + INK + '" opacity=".12"/>' +
    '<rect x="-30" y="34" width="11" height="52" rx="5" fill="' + BROWN_D + '"/><rect x="22" y="34" width="11" height="52" rx="5" fill="' + BROWN_D + '"/>' +
    '<rect x="-16" y="36" width="11" height="50" rx="5" fill="' + BROWN + '"/><rect x="34" y="36" width="11" height="50" rx="5" fill="' + BROWN + '"/>' +
    '<ellipse cx="8" cy="30" rx="46" ry="22" fill="' + BROWN + '"/>' +
    '<path d="M-26 22L-40 -14" stroke="' + BROWN + '" stroke-width="22" stroke-linecap="round"/>' +
    '<circle cx="-44" cy="-22" r="22" fill="' + BROWN + '"/>' +
    '<circle cx="-56" cy="-40" r="9" fill="' + BROWN_L + '"/><circle cx="-44" cy="-46" r="10" fill="' + BROWN_L + '"/><circle cx="-31" cy="-40" r="9" fill="' + BROWN_L + '"/>' +
    '<ellipse cx="-64" cy="-14" rx="8" ry="16" fill="' + BROWN_D + '"/><ellipse cx="-24" cy="-14" rx="8" ry="16" fill="' + BROWN_D + '"/>' +
    '<ellipse cx="-48" cy="-10" rx="12" ry="8" fill="' + BROWN_L + '"/><circle cx="-50" cy="-14" r="4" fill="' + INK + '"/>' +
    '<circle cx="-52" cy="-26" r="3.2" fill="' + INK + '"/><circle cx="-38" cy="-26" r="3.2" fill="' + INK + '"/>' +
    '</g>';
}

/* Jay: messy brown hair, big eyebrows, dot eyes */
function jay(x, y, s, mood){
  s = s || 1;
  var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<path d="M-22 26q0 30 22 30t22-30" fill="#3f6f8f"/>' +
    '<circle cx="0" cy="0" r="30" fill="#f1c7a1"/>' +
    '<circle cx="-30" cy="4" r="6" fill="#e8b48c"/><circle cx="30" cy="4" r="6" fill="#e8b48c"/>' +
    '<path d="M-31 -6q-4 -26 16 -32q6 -10 20 -4q14 -6 22 8q10 6 4 26q-6 -14 -14 -16q-6 6 -16 2q-8 6 -18 0q-8 4 -14 16z" fill="#6b4423"/>' +
    '<path d="M-20 -26l-6 -10M-4 -32l2 -10M12 -30l8 -9" stroke="#6b4423" stroke-width="5" stroke-linecap="round"/>' +
    '<rect x="-20" y="-11" width="15" height="5.5" rx="2.5" fill="#3b2412" transform="rotate(' + (mood === "surprised" ? -14 : -6) + ' -12 -8)"/>' +
    '<rect x="5" y="-11" width="15" height="5.5" rx="2.5" fill="#3b2412" transform="rotate(' + (mood === "surprised" ? 14 : 6) + ' 12 -8)"/>' +
    '<circle cx="-11" cy="2" r="3.4" fill="' + INK + '"/><circle cx="11" cy="2" r="3.4" fill="' + INK + '"/>';
  g += mood === "surprised" ? '<ellipse cx="0" cy="17" rx="5" ry="7" fill="' + INK + '"/>' : '<path d="M-9 14q9 9 18 0" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
  return g + '</g>';
}

function bird(x, y, s, col){
  s = s || 1; col = col || "#20adca";
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<path d="M-6 16l-6 12M4 16l2 12" stroke="#ef7724" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M18 4l18 -6l-6 14z" fill="' + col + '" opacity=".8"/>' +
    '<circle cx="0" cy="0" r="20" fill="' + col + '"/>' +
    '<path d="M-4 2q10 -4 16 6q-10 6 -16 -6z" fill="#007291"/>' +
    '<path d="M-20 -4l-12 4l12 4z" fill="#ef7724"/>' +
    '<circle cx="-9" cy="-6" r="3" fill="' + INK + '"/>' +
    '</g>';
}

/* fist to five */
function hand(n){
  var g = '<rect x="22" y="58" width="56" height="52" rx="16" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3"/>';
  var fx = [27, 40, 53, 66];
  if(n === 0){
    g += '<rect x="20" y="42" width="60" height="30" rx="13" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M35 44v26M50 44v26M65 44v26" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<path d="M18 66q-4 16 14 18" stroke="' + INK + '" stroke-width="3" fill="#f1c7a1"/>';
  } else {
    for(var i = 0; i < 4; i++){
      var up = i < Math.min(n, 4);
      g += up ? '<rect x="' + fx[i] + '" y="' + (12 + (i === 0 || i === 3 ? 8 : 0)) + '" width="12" height="' + (56 - (i === 0 || i === 3 ? 8 : 0)) + '" rx="6" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3"/>'
        : '<rect x="' + fx[i] + '" y="50" width="12" height="18" rx="6" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3"/>';
    }
    g += n === 5 ? '<rect x="4" y="54" width="12" height="38" rx="6" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3" transform="rotate(-35 10 74)"/>'
      : '<rect x="14" y="66" width="12" height="24" rx="6" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3" transform="rotate(-60 20 78)"/>';
    g += '<rect x="22" y="58" width="56" height="52" rx="16" fill="#f1c7a1"/>' +
      '<path d="M22 70v26q0 14 16 14h24q16 0 16 -14v-26" stroke="' + INK + '" stroke-width="3" fill="none"/>';
  }
  return svg("0 0 100 120", g);
}

function bubble(x, y, w, h, text, size, tail){
  return '<g transform="translate(' + x + ' ' + y + ')">' +
    '<path d="M' + (tail === "right" ? w - 40 : 30) + ' ' + h + 'l' + (tail === "right" ? 18 : -12) + ' 26l' + (tail === "right" ? 6 : 24) + ' -26z" fill="#fffdf8" stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round"/>' +
    '<rect width="' + w + '" height="' + h + '" rx="18" fill="#fffdf8" stroke="' + INK + '" stroke-width="3.5"/>' +
    '<rect x="' + (tail === "right" ? w - 44 : 26) + '" y="' + (h - 4) + '" width="30" height="8" fill="#fffdf8"/>' +
    T(w / 2, h / 2 + (size || 24) * 0.36, text, size || 24, { a: "middle", b: 1 }) + '</g>';
}

/* small things, each drawn about 100 wide, centred on x, sitting on y */
var TEAL = "#007291", ORANGE = "#ef7724", YELLOW = "#ffc247", PINK = "#e2557a", GREEN = "#3f9a5a", STEEL = "#6c7a80", WOOD = "#b5793f";
function wheel(x, y, r){ return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + INK + '"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.4) + '" fill="#c9ccd0"/>'; }
var ICONS = {
  bus: function(){ return '<rect x="-50" y="-62" width="100" height="54" rx="10" fill="' + PINK + '" stroke="' + INK + '" stroke-width="3"/><rect x="-42" y="-54" width="22" height="18" rx="3" fill="#e8f7ff"/><rect x="-14" y="-54" width="22" height="18" rx="3" fill="#e8f7ff"/><rect x="14" y="-54" width="28" height="34" rx="3" fill="#e8f7ff"/>' + wheel(-28, -6, 9) + wheel(28, -6, 9); },
  train: function(){ return '<path d="M-54 -10v-40q0 -14 14 -14h60q34 0 34 30v24z" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="3"/><rect x="-44" y="-52" width="16" height="16" rx="2" fill="#e8f7ff"/><rect x="-22" y="-52" width="16" height="16" rx="2" fill="#e8f7ff"/><rect x="0" y="-52" width="16" height="16" rx="2" fill="#e8f7ff"/><path d="M-54 -26h108" stroke="' + YELLOW + '" stroke-width="4"/>' + wheel(-36, -6, 7) + wheel(-16, -6, 7) + wheel(18, -6, 7) + wheel(38, -6, 7) + '<path d="M-60 2h120" stroke="' + WOOD + '" stroke-width="4"/>'; },
  bike: function(){ return '<circle cx="-30" cy="-22" r="20" fill="none" stroke="' + INK + '" stroke-width="5"/><circle cx="30" cy="-22" r="20" fill="none" stroke="' + INK + '" stroke-width="5"/><path d="M-30 -22l18 -30h30l12 30M-12 -52l12 30h-30M18 -52l-6 -10h-10" stroke="' + ORANGE + '" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>'; },
  walk: function(){ return '<circle cx="0" cy="-74" r="11" fill="#f1c7a1" stroke="' + INK + '" stroke-width="3"/><path d="M0 -62v30M0 -32l-14 30M0 -32l16 28M0 -54l-16 16M0 -54l18 12" stroke="' + INK + '" stroke-width="7" stroke-linecap="round" fill="none"/>'; },
  taxi: function(){ return '<path d="M-52 -12v-18q0 -10 10 -12l12 -18h56l14 18q12 2 12 12v18z" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><rect x="-26" y="-56" width="22" height="14" rx="2" fill="#e8f7ff"/><rect x="2" y="-56" width="22" height="14" rx="2" fill="#e8f7ff"/><rect x="-12" y="-72" width="24" height="10" rx="2" fill="' + INK + '"/>' + wheel(-30, -10, 9) + wheel(30, -10, 9); },
  boat: function(){ return '<path d="M-56 -24h112l-18 24h-76z" fill="' + PINK + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><rect x="-30" y="-50" width="50" height="26" fill="#fffdf8" stroke="' + INK + '" stroke-width="3"/><rect x="-6" y="-70" width="14" height="22" fill="' + INK + '"/><path d="M-66 4q10 -6 22 0t22 0t22 0t22 0t22 0t22 0" stroke="#7fbfd0" stroke-width="4" fill="none"/>'; },
  mountain: function(){ return '<path d="M-64 0L-14 -86L14 -46L28 -64L64 0Z" fill="' + STEEL + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><path d="M-30 -58L-14 -86L2 -60L-8 -64L-18 -56Z" fill="#fff"/>'; },
  tree: function(){ return '<rect x="-6" y="-30" width="12" height="30" fill="' + WOOD + '"/><circle cx="0" cy="-52" r="28" fill="' + GREEN + '" stroke="' + INK + '" stroke-width="3"/>'; },
  fire: function(){ return '<path d="M-36 0l72 -14M-36 -14l72 14" stroke="' + WOOD + '" stroke-width="9" stroke-linecap="round"/><path d="M0 -12q-26 -10 -14 -40q4 14 12 14q-6 -24 10 -40q0 26 14 34q8 -10 6 -22q16 22 0 50q-12 8 -28 4z" fill="' + ORANGE + '"/><path d="M2 -14q-12 -6 -6 -22q6 8 10 4q2 10 6 8q2 8 -10 10z" fill="' + YELLOW + '"/>'; },
  book: function(){ return '<path d="M-50 -10v-56q24 -8 50 4q26 -12 50 -4v56q-24 -8 -50 4q-26 -12 -50 -4z" fill="#fffdf8" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><path d="M0 -62v56M-40 -50q16 -4 30 2M-40 -38q16 -4 30 2M10 -48q16 -6 30 -2M10 -36q16 -6 30 -2" stroke="' + INK + '" stroke-width="2.4" fill="none"/>'; },
  bolt: function(){ return '<path d="M6 -92L-26 -38h22L-14 0L30 -56H6L18 -92Z" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>'; },
  sword: function(){ return '<path d="M-44 0q-6 -26 16 -30h56q22 4 16 30z" fill="' + STEEL + '" stroke="' + INK + '" stroke-width="3"/><path d="M0 -30V-96" stroke="#d9dde0" stroke-width="10" stroke-linecap="round"/><path d="M-16 -82h32" stroke="' + YELLOW + '" stroke-width="7" stroke-linecap="round"/><path d="M0 -84v-12" stroke="' + WOOD + '" stroke-width="7" stroke-linecap="round"/>'; },
  beanstalk: function(){ return '<path d="M0 0q-20 -24 0 -48t0 -50" stroke="' + GREEN + '" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-2 -20q-22 -2 -26 -16q16 0 26 16M2 -54q22 -2 26 -16q-16 0 -26 16M-2 -80q-18 0 -22 -12q14 0 22 12" fill="' + GREEN + '"/><ellipse cx="0" cy="-104" rx="22" ry="8" fill="#fffdf8" stroke="' + INK + '" stroke-width="2"/>'; },
  helmet: function(){ return '<path d="M-44 -10q0 -50 44 -50t44 50z" fill="' + ORANGE + '" stroke="' + INK + '" stroke-width="3"/><path d="M-50 -10h100" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/><path d="M-20 -54q-6 18 -4 40M16 -56q6 18 4 42" stroke="' + INK + '" stroke-width="2.4" fill="none" opacity=".5"/>'; },
  rope: function(){ return '<path d="M-30 -20q-24 -30 0 -50t30 20t-24 40t30 6" stroke="' + WOOD + '" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="18" y="-16" width="20" height="12" rx="5" fill="' + STEEL + '" stroke="' + INK + '" stroke-width="2"/>'; },
  map: function(){ return '<path d="M-50 -76l32 8l36 -8l32 8v66l-32 -8l-36 8l-32 -8z" fill="#f3e7c9" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><path d="M-18 -68v66M18 -76v66" stroke="' + INK + '" stroke-width="2" opacity=".4"/><path d="M-38 -30q20 -30 40 -10t30 -20" stroke="' + PINK + '" stroke-width="4" stroke-dasharray="7 6" fill="none"/><path d="M28 -56l8 8M36 -56l-8 8" stroke="' + INK + '" stroke-width="3"/>'; },
  phone: function(){ return '<rect x="-24" y="-90" width="48" height="88" rx="9" fill="' + INK + '"/><rect x="-18" y="-80" width="36" height="64" rx="3" fill="#bfe6ef"/><circle cx="0" cy="-9" r="3.5" fill="#fffdf8"/>'; },
  ticket: function(){ return '<path d="M-54 -70h108v18a10 10 0 0 0 0 20v18h-108v-18a10 10 0 0 0 0 -20z" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="3"/><path d="M-30 -56v40" stroke="' + INK + '" stroke-width="2.4" stroke-dasharray="5 4"/><path d="M-16 -50h50M-16 -38h36M-16 -26h44" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>'; },
  coin: function(){ return '<circle cx="0" cy="-36" r="32" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="3"/><circle cx="0" cy="-36" r="24" fill="none" stroke="' + INK + '" stroke-width="2" opacity=".4"/><text x="0" y="-24" text-anchor="middle" font-family="Archivo,Arial Black,Arial" font-weight="900" font-size="32" fill="' + INK + '">&#163;</text>'; },
  globe: function(){ return '<circle cx="0" cy="-44" r="40" fill="#7fc8e0" stroke="' + INK + '" stroke-width="3"/><path d="M-26 -66q14 6 10 20t14 10q-2 18 10 22M10 -82q-6 14 12 14q10 0 14 14" stroke="' + GREEN + '" stroke-width="10" fill="none" stroke-linecap="round"/>'; },
  briefcase: function(){ return '<rect x="-50" y="-66" width="100" height="62" rx="9" fill="' + WOOD + '" stroke="' + INK + '" stroke-width="3"/><path d="M-16 -66v-12h32v12M-50 -40h100" stroke="' + INK + '" stroke-width="3" fill="none"/><rect x="-8" y="-46" width="16" height="12" rx="2" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="2"/>'; },
  star: function(){ return '<path d="M0 -84l11 24l26 3l-19 18l5 26l-23 -13l-23 13l5 -26l-19 -18l26 -3z" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>'; },
  cloud: function(){ return '<path d="M-44 -20q-20 0 -18 -18q2 -16 20 -14q4 -24 30 -22q20 2 24 20q22 -6 28 12q4 20 -18 22z" fill="#fffdf8" stroke="' + INK + '" stroke-width="3"/>'; }
};
function icon(name, x, y, s){
  var f = ICONS[name];
  return f ? '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' + f() + '</g>' : "";
}
/* a row of labelled icons, for an art box: items [[icon, label], ...] */
function iconRow(items, opts){
  opts = opts || {};
  var w = opts.w || 1000, gap = w / items.length, s = opts.s || 1, g = "";
  items.forEach(function(it, i){
    var cx = gap * i + gap / 2;
    g += '<g' + (opts.build ? ' data-s="' + (i + 1) + '"' : "") + '>' + icon(it[0], cx, 150, s) + T(cx, 196, it[1], opts.size || 26, { a: "middle", f: 1 }) + (it[2] ? T(cx, 228, it[2], 20, { a: "middle" }) : "") + '</g>';
  });
  return svg("0 0 " + w + " " + (opts.h || 240), g);
}

/* an outdoor backdrop for a drawing: sky, sun, clouds, hills and ground.
   scene(w, h, {ground: y, sun: [x, y], time: "day"|"dusk"|"night", hills: true}) */
var SCN = 0;
function scene(w, h, o){
  o = o || {}; SCN++;
  var gy = o.ground || h - 40, id = "sky" + SCN, t = o.time || "day";
  var top = { day: "#8fd3ec", dusk: "#f7a072", night: "#1d3d47" }[t], bot = { day: "#e6f6fb", dusk: "#ffe1b8", night: "#3b5f6b" }[t];
  var g = '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + top + '"/><stop offset="1" stop-color="' + bot + '"/></linearGradient></defs>' +
    '<rect x="-20" y="-20" width="' + (w + 40) + '" height="' + (gy + 20) + '" fill="url(#' + id + ')"/>';
  if(o.sun !== false){ var sx = (o.sun || [w * 0.82, h * 0.18])[0], sy = (o.sun || [w * 0.82, h * 0.18])[1];
    g += t === "night" ? '<circle cx="' + sx + '" cy="' + sy + '" r="34" fill="#fff6d6"/>' : '<circle cx="' + sx + '" cy="' + sy + '" r="58" fill="#fff3b0" opacity=".55"/><circle cx="' + sx + '" cy="' + sy + '" r="38" fill="' + YELLOW + '"/>'; }
  if(t === "night"){ for(var i = 0; i < 14; i++) g += '<circle cx="' + ((i * 137) % w) + '" cy="' + (20 + (i * 53) % (gy * 0.6)) + '" r="2.5" fill="#fff6d6" opacity=".8"/>'; }
  else if(o.clouds !== false){ g += '<g class="drift" opacity=".95">' + icon("cloud", w * 0.22, h * 0.24, 1.1) + icon("cloud", w * 0.55, h * 0.14, 0.8) + '</g>'; }
  if(o.hills !== false) g += '<path d="M-20 ' + (gy - 10) + 'Q' + (w * 0.2) + ' ' + (gy - 90) + ' ' + (w * 0.45) + ' ' + (gy - 30) + 'T' + (w + 20) + ' ' + (gy - 50) + 'V' + (gy + 5) + 'H-20Z" fill="' + (t === "night" ? "#2d4a2f" : "#a9cf8a") + '"/>';
  g += '<rect x="-20" y="' + gy + '" width="' + (w + 40) + '" height="' + (h - gy + 20) + '" fill="' + (t === "night" ? "#24402a" : "#7fb069") + '"/>' +
    '<path d="M-20 ' + gy + 'H' + (w + 20) + '" stroke="' + INK + '" stroke-width="4"/>';
  return g;
}

/* ---------- Cultural Calendar art (/cc/cc-art.js and /cc/cc-scenes.js) ----------
   cci: one of the Cultural Calendar's icons, size px wide, centred on x, y.
   ccScene: a week's hand drawn scene, on its own background, for an art box.
   ccWeek: that week's entry in /data/cc.js. */
function ccWeek(id){ var C = window.B5CC; return C && C.weeks ? C.weeks.filter(function(w){ return w.id === id; })[0] || null : null; }
function cci(name, x, y, size, f, d){
  var C = window.B5CCArt; if(!C) return "";
  var k = (size || 48) / 48;
  return '<g transform="translate(' + (x - 24 * k).toFixed(1) + ' ' + (y - 24 * k).toFixed(1) + ') scale(' + k.toFixed(3) + ')">' + C.inner(name, f || INK, d || "#ffffff") + '</g>';
}
/* an icon on a round tile with a shadow, so a row of icons looks designed, not dropped in */
function ccTile(name, x, y, size, f, d){
  var r = (size || 48) * 0.62, dl = ((x * 7 + y) % 9) * 0.35;
  return '<g class="float" style="animation-delay:-' + dl.toFixed(2) + 's">' +
    '<circle cx="' + x + '" cy="' + (y + 7) + '" r="' + r.toFixed(1) + '" fill="' + INK + '"/>' +
    '<circle cx="' + x + '" cy="' + y + '" r="' + r.toFixed(1) + '" fill="#fffdf8" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.84).toFixed(1) + '" fill="' + (f || INK) + '" opacity=".14"/>' +
    cci(name, x, y, (size || 48) * 0.74, f, d) + '</g>';
}
function ccScene(id){
  var w = ccWeek(id), SC = window.B5CCScenes;
  if(!w || !SC || !w.look || !SC.has(w.look.scene)) return "";
  var L = w.look;
  return '<div class="ccscene" style="background:linear-gradient(170deg,' + L.bg + ',' + L.bg2 + ')">' + SC.draw(L.scene, L) + '</div>';
}

window.LART = { svg: svg, T: T, bonnie: bonnie, bambi: bambi, jay: jay, bird: bird, hand: hand, bubble: bubble, icon: icon, iconRow: iconRow, scene: scene, INK: INK,
  cci: cci, ccTile: ccTile, ccScene: ccScene, ccWeek: ccWeek };
})();
