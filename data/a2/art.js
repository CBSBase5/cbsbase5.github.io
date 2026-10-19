/* ==========================================================
   Base 5 - Autumn 2 activities: shared little drawings
   Cameos for activity pictures, so Jay and Bonnie look the same
   everywhere. Each returns an SVG <g> string to drop inside an
   activity's own <svg>. Literal colours only (no CSS variables),
   so they also work inside "make something" pictures.

     A2ART.jay(x, y, s, mood)     Jay's head and shoulders. Messy
                                  brown hair, big eyebrows. mood:
                                  "smile" | "wow" | "hmm" | "wink"
     A2ART.bonnie(x, y, s, pose)  Bonnie, a brown toy poodle with
                                  no tail. pose: "sit" | "stand"
     A2ART.bubble(x, y, w, h, text, tailX)  a speech bubble
     A2ART.bird(x, y, s, col)     a small bird (Jay likes birds)
     A2ART.portal(x, y, r)        the Autumn 2 time portal
     A2ART.egg(inner, msg)        wraps a drawing as a hidden surprise
   ASCII only.
   ========================================================== */
(function(){
"use strict";
function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function g(x, y, s, body){ return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' + body + '</g>'; }

var A2ART = {};

A2ART.jay = function(x, y, s, mood){
  mood = mood || "smile";
  var mouth = {
    smile: '<path d="M-11 18q11 10 22 0" fill="none" stroke="#3b2414" stroke-width="3" stroke-linecap="round"/>',
    wow:   '<ellipse cx="0" cy="19" rx="6" ry="7" fill="#3b2414"/>',
    hmm:   '<path d="M-9 20h18" stroke="#3b2414" stroke-width="3" stroke-linecap="round"/>',
    wink:  '<path d="M-11 17q11 10 22 0" fill="none" stroke="#3b2414" stroke-width="3" stroke-linecap="round"/>'
  }[mood] || "";
  var brows = mood === "hmm" ?
    '<path d="M-22 -14q9 -7 18 -2" stroke="#4a2b14" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M4 -10q9 -2 18 2" stroke="#4a2b14" stroke-width="6" stroke-linecap="round" fill="none"/>' :
    mood === "wow" ?
    '<path d="M-22 -18q9 -8 18 -3" stroke="#4a2b14" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M4 -21q9 -5 18 3" stroke="#4a2b14" stroke-width="6" stroke-linecap="round" fill="none"/>' :
    '<path d="M-22 -12q9 -8 18 -3" stroke="#4a2b14" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M4 -15q9 -5 18 3" stroke="#4a2b14" stroke-width="6" stroke-linecap="round" fill="none"/>';
  var eyes = mood === "wink" ?
    '<circle cx="-12" cy="0" r="3.6" fill="#1b1b1b"/><path d="M8 1q5 -4 10 0" stroke="#1b1b1b" stroke-width="3" fill="none" stroke-linecap="round"/>' :
    '<circle cx="-12" cy="0" r="3.6" fill="#1b1b1b"/><circle cx="12" cy="0" r="3.6" fill="#1b1b1b"/>';
  return g(x, y, s,
    '<path d="M-44 92q0 -40 44 -42q44 2 44 42z" fill="#2f6f8f"/>' +
    '<path d="M-10 52l10 14 10 -14z" fill="#fff"/>' +
    '<rect x="-9" y="34" width="18" height="18" fill="#f0c4a0"/>' +
    '<ellipse cx="0" cy="6" rx="31" ry="36" fill="#f6d1b0"/>' +
    '<ellipse cx="-31" cy="8" rx="5" ry="8" fill="#f0c4a0"/><ellipse cx="31" cy="8" rx="5" ry="8" fill="#f0c4a0"/>' +
    '<path d="M-34 -6q-8 -30 12 -40q4 -12 20 -8q10 -10 22 0q18 0 16 18q10 10 0 30q-4 -16 -12 -18q-6 8 -16 2q-8 10 -20 2q-6 10 -16 2q-4 6 -6 12z" fill="#6b3f1f"/>' +
    '<path d="M-20 -36l-6 -10M2 -42l2 -12M20 -36l8 -9" stroke="#6b3f1f" stroke-width="5" stroke-linecap="round"/>' +
    brows + eyes +
    '<path d="M0 2q-4 10 2 12" fill="none" stroke="#d9a07c" stroke-width="2.5" stroke-linecap="round"/>' + mouth);
};

A2ART.bonnie = function(x, y, s, pose){
  var legs = pose === "stand" ?
    '<rect x="-24" y="18" width="9" height="26" rx="4" fill="#8a5a36"/><rect x="-8" y="18" width="9" height="26" rx="4" fill="#8a5a36"/><rect x="10" y="18" width="9" height="26" rx="4" fill="#8a5a36"/><rect x="24" y="18" width="9" height="26" rx="4" fill="#8a5a36"/>' +
    '<circle cx="-19" cy="44" r="7" fill="#9c6b45"/><circle cx="-3" cy="44" r="7" fill="#9c6b45"/><circle cx="15" cy="44" r="7" fill="#9c6b45"/><circle cx="29" cy="44" r="7" fill="#9c6b45"/>' :
    '<rect x="-14" y="22" width="9" height="22" rx="4" fill="#8a5a36"/><rect x="6" y="22" width="9" height="22" rx="4" fill="#8a5a36"/>' +
    '<circle cx="-9" cy="44" r="7" fill="#9c6b45"/><circle cx="11" cy="44" r="7" fill="#9c6b45"/>';
  var body = pose === "stand" ?
    '<ellipse cx="4" cy="10" rx="34" ry="20" fill="#9c6b45"/>' +
    '<circle cx="-22" cy="2" r="12" fill="#a87650"/><circle cx="-6" cy="-4" r="12" fill="#a87650"/><circle cx="12" cy="-3" r="12" fill="#a87650"/><circle cx="28" cy="3" r="11" fill="#a87650"/>' :
    '<ellipse cx="2" cy="16" rx="24" ry="26" fill="#9c6b45"/>' +
    '<circle cx="-12" cy="6" r="12" fill="#a87650"/><circle cx="12" cy="6" r="12" fill="#a87650"/><circle cx="0" cy="24" r="13" fill="#a87650"/>';
  var hx = pose === "stand" ? -34 : 0, hy = pose === "stand" ? -22 : -26;
  var head = '<g transform="translate(' + hx + ' ' + hy + ')">' +
    '<ellipse cx="-18" cy="6" rx="9" ry="16" fill="#7a4c2c"/><ellipse cx="18" cy="6" rx="9" ry="16" fill="#7a4c2c"/>' +
    '<circle cx="0" cy="0" r="17" fill="#a87650"/>' +
    '<circle cx="-8" cy="-14" r="8" fill="#b38058"/><circle cx="4" cy="-17" r="8" fill="#b38058"/><circle cx="12" cy="-10" r="7" fill="#b38058"/>' +
    '<ellipse cx="0" cy="9" rx="9" ry="7" fill="#c8956a"/>' +
    '<circle cx="-6" cy="-1" r="2.8" fill="#1b1b1b"/><circle cx="6" cy="-1" r="2.8" fill="#1b1b1b"/>' +
    '<ellipse cx="0" cy="6" rx="3.5" ry="2.6" fill="#1b1b1b"/>' +
    '<path d="M-4 11q4 4 8 0" fill="none" stroke="#5a341c" stroke-width="1.8" stroke-linecap="round"/></g>';
  return g(x, y, s, legs + body + head);
};

A2ART.bubble = function(x, y, w, h, text, tailX){
  var tx = tailX == null ? x + 24 : tailX;
  var lines = String(text).split("\n");
  var t = lines.map(function(l, i){ return '<text x="' + (x + 12) + '" y="' + (y + 22 + i * 18) + '" font-family="Verdana,Arial,sans-serif" font-size="14" fill="#141a33">' + esc(l) + '</text>'; }).join("");
  return '<g><path d="M' + (x + 12) + ' ' + y + 'h' + (w - 24) + 'q12 0 12 12v' + (h - 24) + 'q0 12 -12 12H' + (tx + 14) + 'l-12 14 -2 -14H' + (x + 12) + 'q-12 0 -12 -12V' + (y + 12) + 'q0 -12 12 -12z" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' + t + '</g>';
};

A2ART.bird = function(x, y, s, col){
  col = col || "#3a8fd6";
  return g(x, y, s,
    '<ellipse cx="0" cy="0" rx="16" ry="12" fill="' + col + '"/>' +
    '<circle cx="12" cy="-8" r="9" fill="' + col + '"/>' +
    '<path d="M20 -9l9 3 -9 3z" fill="#f2a516"/>' +
    '<circle cx="14" cy="-10" r="2" fill="#1b1b1b"/>' +
    '<path d="M-6 -2q-6 -12 8 -8" fill="none" stroke="#141a33" stroke-opacity=".35" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path d="M-14 2l-12 -4 4 8z" fill="' + col + '"/>' +
    '<path d="M-2 11v7M4 11v7" stroke="#f2a516" stroke-width="2.5" stroke-linecap="round"/>');
};

A2ART.portal = function(x, y, r){
  r = r || 40;
  return '<g transform="translate(' + x + ' ' + y + ')">' +
    '<circle r="' + r + '" fill="#2d2466"/>' +
    '<circle r="' + (r * 0.78) + '" fill="none" stroke="#8a5cf6" stroke-width="' + (r * 0.12) + '" stroke-dasharray="' + (r * 0.5) + ' ' + (r * 0.22) + '"/>' +
    '<circle r="' + (r * 0.52) + '" fill="none" stroke="#22b8e6" stroke-width="' + (r * 0.1) + '" stroke-dasharray="' + (r * 0.3) + ' ' + (r * 0.18) + '"/>' +
    '<circle r="' + (r * 0.24) + '" fill="#ffd23f"/></g>';
};

A2ART.egg = function(inner, msg){
  return '<g class="egg" tabindex="0" role="button" aria-label="Something hidden" data-egg="' + esc(msg) + '">' + inner + '</g>';
};

window.A2ART = A2ART;
})();
