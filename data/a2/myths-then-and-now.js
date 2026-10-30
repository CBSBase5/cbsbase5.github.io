/* Base 5 Autumn 2 activity: Myths then and now.
   Human and Social. Old myths and legends next to the urban myths
   people pass on today: what they are, how they spread, what is the
   same and what is different. Ends with a myth hunt to try away from
   the screen. ASCII only. */
(function(){
var A = window.A2ART;

function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
/* rough Verdana width, so long typed text can be squeezed to fit */
function textW(t, sz, b){
  var w = 0;
  String(t).replace(/&[a-z#0-9]+;/g, "x").split("").forEach(function(c){
    w += /[WM]/.test(c) ? 1 : /[mw]/.test(c) ? 0.84 : /[A-Z]/.test(c) ? 0.72 : /[ijlI.,:;'!|]/.test(c) ? 0.3 : /[ frt]/.test(c) ? 0.4 : 0.62;
  });
  return w * sz * (b ? 1.08 : 1);
}
function T(x, y, t, sz, o){
  o = o || {};
  /* o.fit: squeeze the text to fit this width if it would run over */
  var fit = o.fit && textW(t, sz || 14, o.b) > o.fit ? ' textLength="' + o.fit + '" lengthAdjust="spacingAndGlyphs"' : "";
  return '<text x="' + x + '" y="' + y + '" font-family="Verdana,Arial,sans-serif" font-size="' + (sz || 14) + '"' +
    (o.b ? ' font-weight="700"' : "") + (o.a ? ' text-anchor="' + o.a + '"' : "") + fit + ' fill="' + (o.c || "#141a33") + '">' + t + '</text>';
}
/* wrap text into lines of about n characters, breaking very long words too */
function wrap(t, n, max){
  var w = [], out = [], cur = "";
  String(t || "").split(/\s+/).forEach(function(x){ while(x.length > n){ w.push(x.slice(0, n)); x = x.slice(n); } if(x) w.push(x); });
  w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; });
  if(cur.trim()) out.push(cur.trim());
  if(out.length > max){ out = out.slice(0, max); out[max - 1] = out[max - 1].replace(/.{0,3}$/, "..."); }
  return out;
}

/* three kinds of story: myth, legend, urban myth */
var THREE =
  '<svg viewBox="0 0 540 230" role="img" aria-label="Three kinds of story: a myth about thunder, a legend about an outlaw in a forest, and an urban myth on a phone">' +
  '<rect width="540" height="230" rx="16" fill="#f4f1ea"/>' +
  /* myth: storm cloud, lightning, hammer */
  '<rect x="12" y="12" width="164" height="206" rx="12" fill="#e9e4ff"/>' +
  '<g transform="translate(94 76)"><circle cx="-26" cy="0" r="22" fill="#8c8fa8"/><circle cx="4" cy="-12" r="28" fill="#9da0b8"/><circle cx="32" cy="2" r="20" fill="#8c8fa8"/><rect x="-44" y="0" width="94" height="22" rx="11" fill="#8c8fa8"/>' +
  '<path d="M-2 22l-14 28h14l-10 28 30 -38h-14l10 -18z" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>' +
  '<rect x="30" y="36" width="26" height="16" rx="3" fill="#5b6180"/><rect x="40" y="52" width="6" height="26" rx="2" fill="#7a5532"/></g>' +
  T(94, 178, "Myth", 17, { b: 1, a: "middle" }) + T(94, 200, "explains the world", 13, { a: "middle" }) +
  /* legend: tree with an arrow in it */
  '<rect x="188" y="12" width="164" height="206" rx="12" fill="#e2f6e9"/>' +
  '<g transform="translate(270 86)"><rect x="-10" y="10" width="20" height="56" rx="4" fill="#7a5532"/><circle cx="-22" cy="-6" r="28" fill="#2f9e5b"/><circle cx="20" cy="-10" r="30" fill="#36b067"/><circle cx="0" cy="-30" r="28" fill="#2f9e5b"/>' +
  '<path d="M-56 34h52" stroke="#141a33" stroke-width="3"/><path d="M-4 34l-10 -6v12z" fill="#141a33"/><path d="M-56 34l-8 -7M-56 34l-8 7M-50 34l-8 -7M-50 34l-8 7" stroke="#e04848" stroke-width="3"/></g>' +
  T(270, 178, "Legend", 17, { b: 1, a: "middle" }) + T(270, 200, "a hero, maybe real", 13, { a: "middle" }) +
  /* urban myth: phone with message */
  '<rect x="364" y="12" width="164" height="206" rx="12" fill="#e3f4fb"/>' +
  '<g transform="translate(446 84)"><rect x="-36" y="-58" width="72" height="124" rx="12" fill="#141a33"/><rect x="-30" y="-48" width="60" height="100" rx="5" fill="#ffffff"/>' +
  '<rect x="-26" y="-40" width="48" height="16" rx="8" fill="#22b8e6"/><rect x="-22" y="-18" width="48" height="16" rx="8" fill="#d9dce8"/><rect x="-26" y="4" width="40" height="16" rx="8" fill="#22b8e6"/>' +
  T(0, 40, "!!!", 13, { b: 1, a: "middle", c: "#e04848" }) + '</g>' +
  T(446, 178, "Urban myth", 17, { b: 1, a: "middle" }) + T(446, 200, "told today as true", 13, { a: "middle" }) +
  '</svg>';

/* stories passed down round the fire */
var FIRE =
  '<svg viewBox="0 0 540 220" role="img" aria-label="A grandparent, a parent and a child round a campfire, a story passing from one to the next">' +
  '<rect width="540" height="220" rx="16" fill="#1d2550"/>' +
  [[60, 30], [140, 54], [250, 22], [380, 40], [470, 26], [500, 70]].map(function(p){ return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.5" fill="#ffffff"/>'; }).join("") +
  '<circle cx="440" cy="60" r="20" fill="#fff6c8"/><circle cx="450" cy="54" r="18" fill="#1d2550"/>' +
  '<rect x="0" y="170" width="540" height="50" fill="#2b3a2a"/>' +
  /* fire */
  '<g transform="translate(270 168)"><path d="M-30 4h60M-24 -2l48 10M24 -2l-48 10" stroke="#7a5532" stroke-width="7" stroke-linecap="round"/>' +
  '<path d="M-22 0q-6 -30 14 -52q-2 22 10 26q4 -18 16 -26q8 26 4 52z" fill="#ff8a3d"/><path d="M-10 0q-2 -20 10 -32q2 14 8 16q4 -8 6 -12q4 16 0 28z" fill="#ffd23f"/></g>' +
  /* three people: old, grown up, child */
  [[110, 1, "#c9c3d6", "#8b7fa8", "Grandparent"], [180, 0.85, "#6b3f1f", "#2f6f8f", "Parent"], [380, 0.7, "#141a33", "#e04848", "Child"]].map(function(p){
    var x = p[0], s = p[1];
    return '<g transform="translate(' + x + ' 170) scale(' + s + ')"><path d="M-30 0q0 -46 30 -50q30 4 30 50z" fill="' + p[3] + '"/><circle cx="0" cy="-66" r="20" fill="#f6d1b0"/><path d="M-20 -72q4 -22 20 -20q18 -2 20 20q-10 -10 -20 -8q-10 -2 -20 8z" fill="' + p[2] + '"/></g>' +
      T(x, 206, p[4], 13, { a: "middle", c: "#ffffff" });
  }).join("") +
  '<path d="M126 82q30 -40 54 -10" fill="none" stroke="#ffd23f" stroke-width="3" stroke-dasharray="6 5"/><path d="M180 72l-2 -12 -8 8z" fill="#ffd23f"/>' +
  '<path d="M196 92q90 -70 178 -6" fill="none" stroke="#ffd23f" stroke-width="3" stroke-dasharray="6 5"/><path d="M374 86l-4 -12 -8 8z" fill="#ffd23f"/>' +
  T(286, 44, "passed down", 15, { b: 1, a: "middle", c: "#ffd23f" }) +
  A.egg(A.bird(500, 150, 0.6, "#8a5cf6"), "Even the birds stay up for a good story. Jay would stay up too.") +
  '</svg>';

/* the Lambton Worm in four pictures */
var STRIP =
  '<svg viewBox="0 0 540 210" role="img" aria-label="The Lambton Worm in four pictures: fishing, down the well, it grows round a hill, spiky armour">' +
  '<rect width="540" height="210" rx="16" fill="#f4f1ea"/>' +
  [0, 1, 2, 3].map(function(k){ return '<rect x="' + (10 + k * 132) + '" y="10" width="124" height="190" rx="10" fill="#ffffff" stroke="#141a33" stroke-opacity=".2" stroke-width="2"/>'; }).join("") +
  /* 1 fishing */
  '<rect x="10" y="120" width="124" height="40" fill="#9fd3ff"/>' +
  '<g transform="translate(46 100)"><circle cx="0" cy="-26" r="11" fill="#f6d1b0"/><path d="M-10 -14h20v30h-20z" fill="#2f9e5b"/><path d="M8 -6l60 -44" stroke="#7a5532" stroke-width="3"/><path d="M68 -50v66" stroke="#141a33" stroke-width="1.5"/>' +
  '<path d="M62 20q6 -6 12 0t12 0" fill="none" stroke="#c7a1d6" stroke-width="5" stroke-linecap="round"/></g>' +
  T(72, 186, "1 Fishing", 14, { b: 1, a: "middle" }) +
  /* 2 well */
  '<g transform="translate(204 104)"><ellipse cx="0" cy="-20" rx="38" ry="12" fill="#5b6180"/><rect x="-38" y="-20" width="76" height="50" fill="#a8a29a"/><path d="M-38 -4h76M-38 12h76M-14 -20v16M14 -4v16M-20 12v18M20 12v18" stroke="#7d776f" stroke-width="2"/>' +
  '<ellipse cx="0" cy="-20" rx="30" ry="8" fill="#141a33"/><path d="M0 -70v34" stroke="#e04848" stroke-width="4"/><path d="M0 -30l-8 -12h16z" fill="#e04848"/></g>' +
  T(204, 186, "2 Down a well", 14, { b: 1, a: "middle" }) +
  /* 3 it grows round a hill */
  '<g transform="translate(336 120)"><path d="M-56 30q56 -110 112 0z" fill="#7cc576"/>' +
  '<path d="M-44 20q20 -16 40 -4t44 -6M-34 -2q20 -16 34 -6t30 -4M-20 -24q14 -12 26 -4t20 -2" fill="none" stroke="#7a3fa0" stroke-width="10" stroke-linecap="round"/>' +
  '<circle cx="34" cy="-32" r="10" fill="#7a3fa0"/><circle cx="37" cy="-35" r="2.5" fill="#ffd23f"/>' +
  '<path d="M-48 30h8M-30 30h8" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/></g>' +
  A.egg(A.bird(372, 40, 0.5, "#ff5d5d"), "A bird watched all of this from a very safe distance. Sensible bird.") +
  T(336, 186, "3 It grows", 14, { b: 1, a: "middle" }) +
  /* 4 spiky armour */
  '<g transform="translate(468 100)"><circle cx="0" cy="-36" r="14" fill="#b8bcc8" stroke="#141a33" stroke-width="2"/><rect x="-8" y="-40" width="16" height="5" fill="#141a33"/>' +
  '<rect x="-20" y="-20" width="40" height="52" rx="6" fill="#b8bcc8" stroke="#141a33" stroke-width="2"/>' +
  '<path d="M-20 -14l-10 4 10 4M-20 2l-10 4 10 4M-20 18l-10 4 10 4M20 -14l10 4 -10 4M20 2l10 4 -10 4M20 18l10 4 -10 4" fill="#e9ebf2" stroke="#141a33" stroke-width="1.5"/>' +
  '<path d="M-12 32v20M12 32v20" stroke="#b8bcc8" stroke-width="8"/></g>' +
  T(468, 186, "4 Spiky armour", 14, { b: 1, a: "middle" }) +
  '</svg>';

/* a story passed along a chain of people, getting bigger */
var CHAIN =
  '<svg viewBox="0 0 540 200" role="img" aria-label="A story passed from person to person, getting bigger each time">' +
  '<rect width="540" height="200" rx="16" fill="#f4f1ea"/>' +
  [0, 1, 2, 3, 4].map(function(k){
    var x = 60 + k * 105, r = 12 + k * 7;
    return '<g transform="translate(' + x + ' 150)"><path d="M-22 30q0 -30 22 -32q22 2 22 32z" fill="' + ["#22b8e6", "#19c39a", "#ffd23f", "#ff8a3d", "#ff5d8f"][k] + '"/><circle cx="0" cy="-16" r="15" fill="#f6d1b0"/></g>' +
      '<circle cx="' + x + '" cy="' + (96 - r) + '" r="' + r + '" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>' +
      T(x, 101 - r, "?" + (k > 1 ? "!" : "") + (k > 3 ? "!" : ""), 13 + k * 3, { b: 1, a: "middle", c: "#e04848" }) +
      (k < 4 ? '<path d="M' + (x + 22) + ' 140h56" stroke="#141a33" stroke-width="2.5"/><path d="M' + (x + 80) + ' 140l-9 -5v10z" fill="#141a33"/>' : "");
  }).join("") +
  T(270, 26, "Each time it is passed on, it grows a bit", 15, { b: 1, a: "middle" }) +
  '</svg>';

/* a phone message: the urban myth arrives */
var PHONE =
  '<svg viewBox="0 0 540 190" role="img" aria-label="A phone message passing on a story about [[place]]">' +
  '<rect width="540" height="190" rx="16" fill="#e3f4fb"/>' +
  '<rect x="30" y="16" width="110" height="160" rx="16" fill="#141a33"/><rect x="38" y="30" width="94" height="128" rx="6" fill="#ffffff"/>' +
  '<rect x="44" y="40" width="70" height="18" rx="9" fill="#d9dce8"/><rect x="56" y="66" width="70" height="18" rx="9" fill="#22b8e6"/><rect x="44" y="92" width="60" height="18" rx="9" fill="#d9dce8"/>' +
  A.bubble(170, 30, 340, 96, "My cousin's mate knows someone at\n[[place]]. You will NOT believe\nwhat they saw. Pass it on!!", 200) +
  T(170, 168, "Who saw it? Nobody quite knows.", 15, { b: 1, c: "#1f6f9a" }) +
  '</svg>';

/* then and now: a Venn diagram */
var VENN =
  '<svg viewBox="0 0 540 250" role="img" aria-label="Two overlapping circles: old myths, urban myths, and what both share">' +
  '<rect width="540" height="250" rx="16" fill="#f4f1ea"/>' +
  '<circle cx="212" cy="130" r="114" fill="#ffd23f" fill-opacity=".55" stroke="#141a33" stroke-width="2.5"/>' +
  '<circle cx="328" cy="130" r="114" fill="#22b8e6" fill-opacity=".45" stroke="#141a33" stroke-width="2.5"/>' +
  T(100, 34, "Then", 17, { b: 1, a: "middle" }) + T(440, 34, "Now", 17, { b: 1, a: "middle" }) +
  T(140, 100, "gods and", 13, { a: "middle" }) + T(140, 118, "heroes", 13, { a: "middle" }) +
  T(140, 148, "told aloud", 13, { a: "middle" }) + T(140, 176, "explains", 13, { a: "middle" }) + T(140, 194, "nature", 13, { a: "middle" }) +
  T(270, 96, "Both", 15, { b: 1, a: "middle" }) +
  T(270, 124, "told as", 13, { a: "middle" }) + T(270, 142, "true", 13, { a: "middle" }) + T(270, 170, "change", 13, { a: "middle" }) + T(270, 188, "each telling", 13, { a: "middle" }) +
  T(400, 100, "a friend of", 13, { a: "middle" }) + T(400, 118, "a friend", 13, { a: "middle" }) +
  T(400, 148, "ordinary", 13, { a: "middle" }) + T(400, 166, "places", 13, { a: "middle" }) + T(396, 194, "online", 13, { a: "middle" }) +
  '</svg>';

/* what people feared, then and now */
var FEARS =
  '<svg viewBox="0 0 540 180" role="img" aria-label="Old fears: dark woods and the sea. New fears: phones and being watched">' +
  '<rect width="540" height="180" rx="16" fill="#f4f1ea"/>' +
  '<rect x="12" y="12" width="252" height="156" rx="12" fill="#e2f6e9"/><rect x="276" y="12" width="252" height="156" rx="12" fill="#e3f4fb"/>' +
  T(138, 38, "Then: what people feared", 14, { b: 1, a: "middle" }) + T(402, 38, "Now: what people fear", 14, { b: 1, a: "middle" }) +
  '<path d="M40 140l24 -60 24 60zM74 140l22 -50 22 50z" fill="#1f6b3a"/><circle cx="66" cy="120" r="3" fill="#ffd23f"/><circle cx="74" cy="120" r="3" fill="#ffd23f"/>' +
  '<path d="M150 130q15 -14 30 0t30 0t30 0" fill="none" stroke="#1f6f9a" stroke-width="5"/><path d="M150 146q15 -14 30 0t30 0t30 0" fill="none" stroke="#1f6f9a" stroke-width="5"/>' +
  T(80, 162, "dark woods", 13, { a: "middle" }) + T(196, 162, "deep sea", 13, { a: "middle" }) +
  '<rect x="314" y="62" width="50" height="86" rx="9" fill="#141a33"/><rect x="320" y="70" width="38" height="66" rx="4" fill="#9fd3ff"/>' +
  '<path d="M430 104q34 -30 68 0q-34 30 -68 0z" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/><circle cx="464" cy="104" r="10" fill="#141a33"/>' +
  T(340, 162, "phones", 13, { a: "middle" }) + T(464, 162, "being watched", 13, { a: "middle" }) +
  '</svg>';

/* ---------- widgets ---------- */

/* pass it on: the student chooses how each retelling changes the story */
var PASS = {
  src: ["My cousin's mate says", "My cousin's mate swears on everything", "Everyone at my cousin's school says"],
  who: ["that [[job]]", "that [[job]] and two others", "that loads of people"],
  when: ["one night", "every night", "every night at midnight, exactly"]
};
var PASS_BTNS = [["src", "Make it sound more true"], ["who", "Add more witnesses"], ["when", "Make it stranger"]];
function passWidget(el, api){
  var d = api.data || {};
  if(!d.lad) d.lad = { src: 0, who: 0, when: 0 };
  if(typeof d.n !== "number") d.n = 0;
  var tk = api.tok || function(x){ return x; };
  el.innerHTML = '<div class="xchain"></div>' +
    '<p class="a2task xstory" aria-live="polite" style="font-size:1.05rem"></p>' +
    '<p class="xwhat" style="font-weight:700;margin:6px 0"></p>' +
    '<div class="qnav xbtns" style="flex-wrap:wrap"></div>' +
    '<div class="qnav"><button type="button" class="btn btn-quiet xreset">Start the story again</button></div>';
  var chain = el.querySelector(".xchain"), story = el.querySelector(".xstory"), what = el.querySelector(".xwhat"), btns = el.querySelector(".xbtns");
  function draw(last){
    var n = Math.min(d.n, 6), s = "";
    for(var k = 0; k < 7; k++){
      var x = 40 + k * 76, on = k <= n;
      s += '<g transform="translate(' + x + ' 64)"><path d="M-20 26q0 -26 20 -28q20 2 20 28z" fill="' + (on ? ["#22b8e6", "#19c39a", "#ffd23f", "#ff8a3d", "#ff5d8f", "#8a5cf6", "#e04848"][k] : "#d9dce8") + '"/>' +
        '<circle cx="0" cy="-14" r="13" fill="' + (on ? "#f6d1b0" : "#e9ebf2") + '"/></g>' +
        (k < 6 ? '<path d="M' + (x + 24) + ' 74h28" stroke="' + (k < n ? "#141a33" : "#c3c7d4") + '" stroke-width="2.5"/>' : "");
    }
    chain.innerHTML = '<svg viewBox="0 0 540 100" role="img" aria-label="' + (n + 1) + ' people have heard the story">' +
      '<rect width="540" height="100" rx="14" fill="#f4f1ea"/>' + s +
      T(270, 20, "People who have heard it: " + (n + 1), 14, { b: 1, a: "middle" }) + '</svg>';
    story.innerHTML = tk(PASS.src[d.lad.src] + " " + PASS.who[d.lad.who] + " saw [[sight]] at [[place]] " + PASS.when[d.lad.when] + ".");
    what.textContent = last || (d.n ? "" : "Pick how the next person changes the story when they pass it on.");
    btns.innerHTML = "";
    PASS_BTNS.forEach(function(b){
      var bt = document.createElement("button");
      bt.type = "button"; bt.className = "btn"; bt.textContent = b[1];
      bt.disabled = d.lad[b[0]] >= 2;
      bt.onclick = function(){
        if(d.lad[b[0]] >= 2) return;
        d.lad[b[0]]++; d.n++;
        try{ api.save(); }catch(e){}
        var full = d.lad.src + d.lad.who + d.lad.when >= 6;
        draw(full ? "That story has grown as far as it can go. Jay's verdict: Outrageous. And notice: [[place]] and what was seen never changed." :
          "Passed on. The place and what was seen stayed the same; the bits that make it sound true grew.");
        if(d.n >= 2) api.done("done");
      };
      btns.appendChild(bt);
    });
    if(last) what.textContent = tk(last);
  }
  el.querySelector(".xreset").onclick = function(){ d.lad = { src: 0, who: 0, when: 0 }; d.n = 0; try{ api.save(); }catch(e){} draw(); };
  draw();
}

/* the myth hunt: a challenge for away from the screen */
var HUNT = [
  "Ask someone older what story they believed when they were young",
  "Ask who told it to them",
  "Decide: myth, legend or urban myth?",
  "Did it carry a warning or a lesson?",
  "Is it still told today, or has it changed?",
  "Share it with Jay, or bring it to the next session"
];
function huntWidget(el, api){
  var d = api.data || {};
  if(!Array.isArray(d.ticks)) d.ticks = [];
  el.innerHTML = '<div class="a2task"><h4>Myth hunt</h4><p>Away from the screen, whenever you fancy it. Tick things off as you go, if you like. Your ticks save here and can go to Jay with your results.</p><div class="xlist"></div></div>';
  var list = el.querySelector(".xlist");
  HUNT.forEach(function(t, k){
    var lab = document.createElement("label");
    lab.style.cssText = "display:flex;gap:10px;align-items:center;margin:8px 0;font-size:1rem;cursor:pointer";
    var cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = !!d.ticks[k];
    cb.style.cssText = "width:22px;height:22px;flex:none";
    cb.onchange = function(){ d.ticks[k] = cb.checked; try{ api.save(); }catch(e){} api.done("done"); };
    lab.appendChild(cb); lab.appendChild(document.createTextNode(t));
    list.appendChild(lab);
  });
}

var LAMBTON_MED = "<p class=\"a2task\"><b>The Lambton Worm</b>, a legend from the north east of England, in our own words.<br><br>" +
  "Long ago, a young man called John Lambton went fishing on a Sunday morning, when he was supposed to be at church. All he caught was a tiny, slimy worm. He did not like the look of it, so he threw it down a well and forgot all about it.<br><br>" +
  "Years went by, and John went away to fight in faraway wars. Down in the well, the worm grew, and grew, and grew. One day it climbed out, wrapped itself around a hill, and began eating the farmers' sheep.<br><br>" +
  "When John came home, he saw what his tiny worm had become. He had a suit of armour made, covered in sharp spikes, and he faced the worm in the river. Every time it squeezed him, the spikes stopped it, and in the end the worm was beaten.</p>";

(window.A2PACKS = window.A2PACKS || {})["myths-then-and-now"] = {
  a2: true,
  id: "a2-myths-then-and-now",
  title: "Myths then and now",
  subject: "Human and Social",
  bodyClass: "subj-home subj-pillar",
  mins: 25,
  line: "Old myths and legends, the urban myths people pass on today, and what they have in common.",
  blurb: "Myths and legends from long ago next to the urban myths that spread today. Four short chunks, a then and now card to make, and a myth hunt to try away from the screen if you fancy it.",
  note: "Old myths and legends next to today's urban myths, ready for our Human and Social session. Four five minute chunks, a card to make, and a myth hunt to try if you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Campfire", line: "Campfire: short stories, nothing too scary, one idea at a time." },
    { id: "medium", name: "Storyteller", line: "Storyteller: compare old and new stories and what they are for." },
    { id: "spicy", name: "Myth buster", line: "Myth buster: why stories spread, how they change, and what they say about the people who told them." }
  ],
  themes: {
    time: { name: "Time travel", w: { place: "the museum", job: "the cleaner", sight: "a knight in armour walking through a wall", rule: "goes near the armour room" } },
    football: { name: "Football", w: { place: "the old stadium", job: "the groundsman", sight: "a goalkeeper in an ancient kit saving shots in an empty goal", rule: "walks across the pitch" } },
    horror: { name: "Horror", w: { place: "the old hospital", job: "the night porter", sight: "the lift going up to floor 13 on its own", rule: "takes the lift" } },
    fishing: { name: "Fishing", w: { place: "the lake", job: "the bailiff", sight: "a pike as long as a rowing boat", rule: "fishes off the old jetty" } },
    music: { name: "Music", w: { place: "the theatre", job: "the stage manager", sight: "a figure in a cloak sitting in seat 13", rule: "sits in seat 13" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  ez: {
    realWorld: { title: "Story collectors", html: "<p>Some people collect old stories. Some bust new myths.</p><p>With time travel, we could find out if Robin Hood was real.</p>" },
    make: { intro: "One old story, one new one. What do they share?" }
  },
  startFig: THREE,
  steps: [

    /* ---------- chunk 1: three kinds of story ---------- */
    { type: "learn", topic: "Myths, legends and urban myths", title: "Three kinds of story",
      fig: THREE,
      html: "<p>People have always told stories that sound true. Here are three kinds.</p>" +
        "<p><b>Myth:</b> a very old story that explains how the world works. Long ago, Norse people told how thunder was the god Thor riding across the sky, swinging his hammer.</p>" +
        "<p><b>Legend:</b> a story about a hero or a place, which might have a little bit of truth in it. Robin Hood hid in Sherwood Forest. Nobody is sure if he was real.</p>" +
        "<p><b>Urban myth:</b> a story from today, passed on as if it is true. Usually it is not. \"If you swallow gum, it stays in your tummy for seven years.\" (It does not. It passes through in a few days.)</p>",
      ez: { html: "<p><b>Myth</b>: explains the world, like thunder.</p><p><b>Legend</b>: a hero, like Robin Hood. <b>Urban myth</b>: a story from today.</p>" },
      lv: { mild: { html: "<p>People have always told stories that sound true.</p>" +
          "<p>Long ago, people told <b>myths</b> and <b>legends</b>. A myth explains something, like thunder. A legend is about a hero, like Robin Hood.</p>" +
          "<p>Today, people still pass on stories that sound true but are not. These are <b>urban myths</b>. \"Gum stays in your tummy for seven years\" is one. (It does not.)</p>" },
        spicy: { html: "<p>Three kinds of story that people tell as if they were true:</p>" +
          "<p><b>Myth:</b> an ancient story, often with gods, that explains how the world works. Norse thunder came from Thor. Greek winter came from a goddess, Demeter, missing her daughter Persephone.</p>" +
          "<p><b>Legend:</b> a story about a hero, place or event that may grow from something real. King Arthur and Robin Hood may be based on real people, or on several people blended together.</p>" +
          "<p><b>Urban myth:</b> a modern story passed on as true, usually not, often \"from a friend of a friend\".</p>" +
          "<p>The lines blur. A myth buster asks: <b>where did this story come from, and why do people keep telling it?</b></p>" } } },

    { type: "mc", topic: "Myths, legends and urban myths",
      q: "Long ago, people said thunder was the god Thor riding across the sky. What kind of story is that?",
      options: ["A myth", "An urban myth", "A news report"],
      answer: 0,
      slips: { 1: "Urban myths are from today. This one is very old, and it explains the weather.", 2: "A news report tells you what happened, with facts you could check. This explains the weather with a god." },
      hint: "Is it old or new? Does it explain something about the world?",
      why: "It is very old and it explains thunder. That makes it a myth.",
      ez: { q: "People said Thor made thunder. What kind of story is that?",
        slips: { 1: "Urban myths are from today.", 2: "A news report has facts you can check." }, hint: "Old or new?", why: "A <b>myth</b>. It is old and explains thunder." },
      lv: { spicy: { q: "Which of these is a <b>myth</b>?",
        options: ["A story saying winter comes because a goddess is sad", "An account of a real battle, with dates and names", "A story that alligators live in city drains", "A story about an outlaw who hid in a forest"],
        slips: { 1: "Dates and names you can check make that history, not myth.", 2: "That one is a modern urban myth, not an ancient one.", 3: "An outlaw hero who might have been real makes that a legend." },
        hint: "A myth explains how the world works, often with gods.",
        why: "Winter coming because a goddess is sad is the Greek myth of Demeter and Persephone. It explains the seasons." } } },

    { type: "mc", topic: "Myths, legends and urban myths",
      q: "\"My cousin's friend says gum stays in your tummy for seven years.\" What kind of story is that?",
      options: ["An urban myth", "A myth from long ago", "A legend about a hero"],
      answer: 0,
      slips: { 1: "This one is from today, not long ago. Listen for \"my cousin's friend\".", 2: "There is no hero here, just a warning about gum." },
      hint: "Is it from long ago or from today?",
      why: "It is a story from today, passed on as true. Gum really passes through you in a few days. That makes it an urban myth.",
      ez: { slips: { 1: "This one is from today. Look for my cousin's friend.", 2: "There is no hero here." }, hint: "Long ago, or today?", why: "An <b>urban myth</b>. It is from today, and not true." },
      lv: { spicy: { q: "\"Gum stays in your stomach for seven years\" has been passed on for decades. Why might it have spread so far?",
        options: ["It is a short warning, easy to repeat, and hard to check for yourself", "Doctors teach it in medical school", "It first appeared in a science textbook", "It is about a famous hero"],
        slips: { 1: "Doctors say the opposite: gum passes through in a few days.", 2: "It did not come from a textbook. It spread by word of mouth.", 3: "There is no hero in it, just a warning." },
        hint: "Think about why some stories are easy to pass on.",
        why: "Short, a bit shocking, a useful warning for children, and almost nobody can check it themselves. That is the perfect recipe for an urban myth." } } },

    { type: "sort", topic: "Myths, legends and urban myths",
      q: "Sort the stories, if you like.",
      buckets: ["Myth", "Legend", "Urban myth"],
      cards: [["Thor makes the thunder.", 0], ["Robin Hood hides in Sherwood Forest.", 1], ["Gum stays in you for seven years.", 2], ["Winter comes when a goddess is sad.", 0], ["Young Arthur pulls a sword from a stone and becomes king.", 1], ["Alligators live in the city drains.", 2]],
      hint: "Myths explain the world. Legends have a hero. Urban myths are from today.",
      why: "Thunder and winter are explained by gods: myths. Robin Hood and Arthur are heroes: legends. Gum and alligators are stories from today: urban myths.",
      ez: { q: "Long ago, or today? Sort them.", why: "Thor and Robin Hood are old. Gum and alligators are today." },
      lv: { mild: { q: "Long ago, or today? Sort the stories, if you like.",
          buckets: ["Long ago", "Today"],
          cards: [["Thor makes the thunder.", 0], ["Robin Hood hides in the forest.", 0], ["Gum stays in you for seven years.", 1], ["Alligators live in the city drains.", 1]],
          hint: "Gods and heroes are from long ago. Gum and drains are today.",
          why: "Thor and Robin Hood are old stories. Gum and alligators are stories people tell today." },
        spicy: { cards: [["Thor makes the thunder.", 0], ["Robin Hood hides in Sherwood Forest.", 1], ["Gum stays in you for seven years.", 2], ["Winter comes when a goddess is sad.", 0], ["Young Arthur pulls a sword from a stone and becomes king.", 1], ["A hitchhiker vanishes from the back seat of a car.", 2], ["Goldfish only remember things for three seconds.", 2]],
          why: "Gods explaining nature: myths. Heroes who may have been real: legends. Modern stories passed on as true: urban myths. (Goldfish can remember things for months, by the way.)" } } },

    { type: "mc", topic: "Myths, legends and urban myths", explain: true,
      q: "Someone tells Jay that Bonnie can only see in black and white. Scientists have checked: dogs can see blues and yellows. So the black and white story is...",
      fig: '<svg viewBox="0 0 360 170" role="img" aria-label="Bonnie the poodle looking at a blue ball and a yellow ball">' +
        '<rect width="360" height="170" rx="14" fill="#f4f1ea"/>' + A.bonnie(110, 104, 1.25, "sit") +
        '<circle cx="230" cy="140" r="16" fill="#3a8fd6"/><circle cx="280" cy="140" r="16" fill="#ffd23f"/>' +
        A.bubble(200, 14, 140, 52, "Blue. Yellow.\nI see them.", 214) + '</svg>',
      options: ["A modern myth: passed on as true, but it is not", "A fact, because lots of people say it", "An old legend about a hero"],
      answer: 0,
      slips: { 1: "Lots of people saying something does not make it true. The scientists checked, and it is not.", 2: "There is no hero, and it is not very old. It is a story from today." },
      hint: "It was checked. What did the check show?",
      why: "Lots of people believe it, but checks show dogs see some colours. Passed on as true, but it is not: a modern myth. Bonnie is unbothered either way.",
      ez: { q: "Bonnie can see blue and yellow. So \"dogs only see black and white\" is...",
        slips: { 1: "Lots of people saying it does not make it true.", 2: "There is no hero. It is from today." }, hint: "What did the check show?", why: "A <b>modern myth</b>. People pass it on, but it is not true." } },

    /* ---------- chunk 2: myths from long ago ---------- */
    { type: "learn", topic: "Myths from long ago", title: "Old stories, told out loud",
      fig: FIRE,
      html: "<p>Before books and screens, stories were <b>told out loud</b> and <b>passed down</b>: grandparents to parents to children, for hundreds of years.</p>" +
        "<p>Old myths and legends often:</p><ul><li><b>explain</b> something in nature (Thor and thunder)</li><li>have a <b>hero</b> and a <b>monster</b></li><li>carry a <b>warning</b> or a lesson</li></ul>" +
        "<p>In a Greek myth, <b>Icarus</b> flew on wings made of feathers and wax. His father told him not to fly too high. He flew too close to the sun, the wax melted, and he fell into the sea. A warning: listen to good advice.</p>",
      ez: { html: "<p>Long ago, stories were <b>told out loud</b>.</p><p>Icarus flew too near the sun. The lesson: <b>listen to good advice</b>.</p>" },
      lv: { mild: { html: "<p>Long ago, there were no books or screens. People <b>told stories out loud</b>. Grandparents told parents, and parents told children.</p>" +
          "<p>Old stories often have a <b>hero</b>, a <b>monster</b>, and a <b>lesson</b>.</p>" +
          "<p><b>Icarus</b> had wings made of wax. His dad said: do not fly too high. He flew too near the sun, the wax melted, and he fell in the sea. The lesson: listen to good advice.</p>" },
        spicy: { html: "<p>Before writing was common, myths and legends were an <b>oral tradition</b>: told aloud and passed down for generations, changing a little with each teller.</p>" +
          "<p>They did several jobs at once:</p><ul><li><b>explain</b> the world (Thor and thunder, Persephone and winter)</li><li><b>warn</b> and teach (Icarus ignored his father's advice, flew too close to the sun on wings of wax, and fell)</li><li>give people a shared <b>identity</b>: our hero, our hill, our story</li></ul>" +
          "<p>So an old myth tells you two things: the story, and <b>what mattered to the people who told it</b>.</p>" } } },

    { type: "learn", topic: "Myths from long ago", title: "A legend: the Lambton Worm",
      routes: [
        { name: "Read it", html: LAMBTON_MED },
        { name: "See it", fig: STRIP, html: "<p>The same legend in four pictures. John goes fishing and catches a tiny worm. He throws it down a well. It grows huge and wraps around a hill. He comes back in spiky armour and beats it in the river.</p>" }
      ],
      ez: { routes: ["<p class=\"a2task\"><b>The Lambton Worm</b><br><br>John caught a tiny worm. He threw it down a well.<br><br>The worm grew huge. It ate the sheep.<br><br>John wore spiky armour. He beat the worm.</p>",
        "<p>Fishing. Down the well. It grows. Spiky armour.</p>"] },
      lv: { mild: { routes: [
          { name: "Read it", html: "<p class=\"a2task\"><b>The Lambton Worm</b><br><br>Long ago, John Lambton went fishing. He caught a tiny worm. He did not like it, so he threw it down a well and forgot about it.<br><br>The worm grew and grew. It climbed out, wrapped itself around a hill, and ate the farmers' sheep.<br><br>John came back wearing spiky armour, and he beat the worm in the river.</p>" },
          { name: "See it", fig: STRIP, html: "<p>The same legend in four pictures: fishing, down the well, it grows, spiky armour.</p>" }] },
        spicy: { routes: [
          { name: "Read it", html: LAMBTON_MED + "<p>People in the north east still tell this legend, and there is a hill near Washington, in Tyne and Wear, called Worm Hill. Nobody believes in giant worms now, but the story has been told for hundreds of years.</p>" },
          { name: "See it", fig: STRIP, html: "<p>The same legend in four pictures. Notice which details a storyteller would never leave out: the Sunday, the well, the hill, the spikes.</p>" }] } } },

    { type: "mc", topic: "Myths from long ago",
      q: "In the legend, what did John do with the tiny worm?",
      options: ["Threw it down a well", "Took it home as a pet", "Put it back in the river"],
      answer: 0,
      slips: { 1: "Have another look at the part just after he caught it.", 2: "Close: there is water in it, but it was a well, not the river." },
      hint: "Look at picture 2, or the sentence after he caught it.",
      why: "He threw it down a well and forgot about it. That is where it grew.",
      ez: { slips: { 1: "Look just after he caught it.", 2: "Close. It was a well, not the river." }, hint: "Look at picture 2.", why: "He threw it <b>down a well</b>. It grew there." },
      lv: { spicy: { q: "Why might the storyteller mention that John went fishing <b>on a Sunday, instead of going to church</b>?",
        options: ["It hints that the trouble came from breaking the rules of the time", "It tells you what time the shops shut", "It is a random detail with no purpose", "It proves the story really happened"],
        slips: { 1: "Nothing in the story is about shops. Think about what Sunday meant to people back then.", 2: "Old stories rarely waste a detail. This one was kept for hundreds of years.", 3: "A day of the week cannot prove a giant worm was real." },
        hint: "What were people supposed to be doing on a Sunday, back then?",
        why: "Missing church was breaking the rules. The worm turning up that day hints the trouble was a kind of punishment: a warning to listeners." } } },

    { type: "mc", topic: "Myths from long ago",
      q: "Old stories often carry a warning. What warning could the Lambton Worm carry?",
      options: ["A small problem can grow if you ignore it", "Never go fishing", "Worms make dangerous pets"],
      answer: 0,
      slips: { 1: "Fishing is not really the problem. What happened after he caught the worm?", 2: "John did not keep it as a pet. He got rid of it without dealing with it." },
      hint: "What did John do with the worm, and what happened because of it?",
      why: "John threw the worm away and forgot it, and it grew into a much bigger problem. Small problems can grow if you ignore them.",
      ez: { q: "What is the warning in the Lambton Worm?", slips: { 1: "Fishing is not the problem. What did the worm do?" }, hint: "What did the worm do next?", why: "Ignore a <b>small problem</b> and it can grow." },
      lv: { mild: { options: ["A small problem can grow if you ignore it", "Never go fishing"], slips: { 1: "Fishing is not really the problem. What happened after he threw the worm away?" } },
        spicy: { options: ["Problems you push out of sight do not go away; they can grow", "Spiky armour solves everything", "Fishing should be against the law", "Never trust a worm"],
          slips: { 1: "The armour was the fix, not the message. What caused the trouble in the first place?", 2: "The story is not really about fishing laws.", 3: "Funny, but the worm is a symbol. What does throwing it down a well stand for?" } } } },

    { type: "match", topic: "Myths from long ago",
      q: "Match each old story to what it explains or warns about.",
      pairs: [["Thor and his hammer", "Thunder and lightning"], ["Icarus and his wax wings", "Listen to good advice"], ["The Lambton Worm", "Small problems can grow"], ["Persephone and her mother", "Why winter comes"]],
      hint: "Two of these explain nature. Two carry a warning.",
      why: "Thor explains thunder, Persephone explains winter. Icarus and the Worm are warnings.",
      ez: { q: "Match each story to its job.", hint: "One explains nature. Two are lessons.", why: "Thor explains thunder. Icarus and the Worm are lessons." },
      lv: { mild: { pairs: [["Thor and his hammer", "Thunder"], ["Icarus and his wax wings", "Listen to good advice"], ["The Lambton Worm", "Small problems can grow"]],
          why: "Thor explains thunder. Icarus and the Worm both carry a lesson." },
        spicy: { pairs: [["Thor and his hammer", "Explains thunder and lightning"], ["Icarus and his wax wings", "Warns against ignoring advice"], ["The Lambton Worm", "Warns that ignored problems grow"], ["Persephone and her mother", "Explains the seasons"], ["Arthur and the sword in the stone", "Shows who is meant to rule"]],
          why: "Some old stories explain nature, some warn, and some, like Arthur, tell people who their rightful leader is." } } },

    /* ---------- chunk 3: urban myths today ---------- */
    { type: "learn", topic: "Urban myths today", title: "Myths did not stop",
      fig: PHONE,
      html: "<p>Today's myths are called <b>urban myths</b>. They spread by word of mouth, by message and online. Look out for these signs:</p>" +
        "<ul><li>It happened to <b>a friend of a friend</b>, never to the person telling you.</li><li>It is set somewhere <b>ordinary</b> and nearby.</li><li>It is told as <b>definitely true</b>, but nobody can check it.</li><li>It <b>changes</b> a little each time it is told.</li></ul>" +
        "<p class=\"a2task\">My cousin's mate knows someone who works at [[place]]. Late one night, [[job]] saw [[sight]]. When the lights came on, it was gone. That is why nobody [[rule]] after dark any more.</p>",
      ez: { html: "<p><b>Urban myths</b> happen to <b>a friend of a friend</b>. Nobody can check.</p>" +
        "<p class=\"a2task\">My cousin's mate says [[job]] at [[place]] saw [[sight]]. Then it was gone. Now nobody [[rule]] after dark.</p>" },
      lv: { mild: { html: "<p>Today, people still pass on stories that sound true. They are called <b>urban myths</b>.</p>" +
          "<ul><li>It happened to <b>a friend of a friend</b>.</li><li>It is told as <b>true</b>, but nobody can check.</li><li>It <b>changes</b> each time it is told.</li></ul>" +
          "<p class=\"a2task\">My cousin's mate says [[job]] at [[place]] saw [[sight]]. Then it was gone. Now nobody [[rule]] after dark.</p>" },
        spicy: { html: "<p>Modern myths are <b>urban myths</b> (or urban legends). Folklorists, people who study these stories, even have a name for the mystery source: <b>FOAF</b>, a friend of a friend.</p>" +
          "<ul><li>A <b>FOAF</b> source: close enough to sound true, far enough that nobody can check.</li><li>An <b>ordinary, local</b> setting, so it feels like it could happen to you.</li><li>A <b>warning</b> or a shock, so people feel they should pass it on.</li><li>It <b>mutates</b>: the same story turns up in many towns with only the place name changed.</li></ul>" +
          "<p class=\"a2task\">My cousin's mate knows someone who works at [[place]]. Late one night, [[job]] saw [[sight]]. When the lights came on, it was gone. That is why nobody [[rule]] after dark any more.</p>" } } },

    { type: "mc", topic: "Urban myths today",
      q: "In the story, who actually saw it happen?",
      options: ["We do not really know: someone a friend of a friend knows", "The person telling the story", "A reporter, who took a photo"],
      answer: 0,
      slips: { 1: "The teller did not see it. Look at the very first words: \"My cousin's mate...\"", 2: "There is no photo and no reporter. Nobody in the story can be checked." },
      hint: "Look at the very first words of the story.",
      why: "It was someone that the teller's cousin's mate knows. That far away, nobody can check. Classic urban myth.",
      ez: { slips: { 1: "Look at the first words: My cousin's mate." }, hint: "Look at the first words.", why: "<b>Nobody knows</b>. So nobody can check it." },
      lv: { mild: { options: ["Someone a friend of a friend knows", "The person telling the story"], fixed: true,
        slips: { 1: "The teller did not see it. Look at the first words: \"My cousin's mate...\"" } } } },

    { type: "widget", topic: "Urban myths today", unscored: true,
      title: "Pass it on",
      html: "<p>Here is how an urban myth grows. Every time the story is passed on, you choose how that person changes it. Have a go, and watch what happens.</p>",
      ez: { html: "<p>Pass the story on. Pick how it changes.</p>" },
      mount: passWidget,
      report: function(d){ return d && d.n ? "Pass it on: the story was passed on " + d.n + " times." : ""; } },

    { type: "multi", topic: "Urban myths today",
      q: "Pick the clues that a story might be an urban myth.",
      options: ["It happened to a friend of a friend", "It is set somewhere ordinary, near you", "It gives a name, date and place you can check", "Everyone tells it slightly differently", "It comes from a trusted news site that says where it got its facts"],
      answers: [0, 1, 3],
      hint: "Look for the signs from the learn card: who, where, and how it changes.",
      why: "Friend of a friend, an ordinary place, and a story that changes: all signs of an urban myth. Names, dates and sources you can check point the other way.",
      ez: { q: "Pick the clues it is an urban myth.", hint: "Two are signs. One you could check.", why: "A friend of a friend, and a story that changes." },
      lv: { mild: { q: "Pick the clues that a story might be an urban myth.",
          options: ["It happened to a friend of a friend", "It changes each time it is told", "It has a photo and a date you can check"],
          answers: [0, 1],
          hint: "Two of these are signs. One of them means you could check it.",
          why: "A friend of a friend, and a story that keeps changing: both signs of an urban myth." },
        spicy: { options: ["It happened to a friend of a friend", "The same story is told in lots of towns, with only the place name changed", "It gives names, dates and records you can check", "The teller swears it is definitely true", "Several reliable sources have checked it and agree"],
          why: "A FOAF source, the same story in many towns, and a teller swearing it is true are all urban myth signs. Checkable records and several reliable sources point towards a real event." } } },

    { type: "mc", topic: "Urban myths today", explain: true,
      q: "Why do urban myths say \"my cousin's mate\" and not a real name?",
      options: ["It makes the story sound true, but nobody can check it", "Because the cousin is famous", "Because names are not allowed in stories"],
      answer: 0,
      slips: { 1: "The cousin is not famous. Nobody even knows who they are.", 2: "Names are allowed. Leaving them out is a choice. What does it do?" },
      hint: "Could you ask the cousin's mate what really happened?",
      why: "Close enough to sound true, too far away to check. That is what keeps an urban myth alive.",
      ez: { q: "Could you ask \"my cousin's mate\" what happened?", slips: { 1: "Who is the cousin's mate? Nobody knows." }, hint: "Do you know their name?", why: "<b>Not really</b>. Nobody can check it." },
      lv: { mild: { q: "The story says \"my cousin's mate\". Could you ask that person what happened?",
          options: ["Not really: we do not know who they are", "Yes, easily"], fixed: true,
          slips: { 1: "Who is the cousin's mate? What is their name? Nobody knows, so you cannot ask them." },
          why: "We do not know who they are, so nobody can check. That is a big sign of an urban myth." },
        spicy: { q: "A message says: \"This happened to my neighbour's sister. Share before it gets deleted!\" Why does a message like this spread so fast?",
          options: ["It feels personal and urgent, so people share before they check", "It names clear sources, so people trust it", "It is boring, so people forget it", "It is very old, so people respect it"],
          slips: { 1: "\"My neighbour's sister\" is not a source anyone can check. It only feels like one.", 2: "Boring stories die out. This one is built to grab attention.", 3: "It is not old: \"before it gets deleted\" makes it feel brand new and urgent." },
          hint: "Look at the two tricks: who it happened to, and the rush.",
          why: "A FOAF source makes it feel personal; \"before it gets deleted\" makes it urgent. People share first and check later, if ever." } } },

    /* ---------- chunk 4: then and now ---------- */
    { type: "learn", topic: "Then and now", title: "What is the same, and what has changed",
      fig: VENN,
      html: "<p><b>Then:</b> old myths and legends have gods and heroes, explain nature, and were told aloud for hundreds of years.</p>" +
        "<p><b>Now:</b> urban myths happen to a friend of a friend, in ordinary places, and spread online in hours.</p>" +
        "<p><b>Both:</b> told as if they are true, change with each telling, and often carry a warning.</p>",
      ez: { title: "Then and now", html: "<p><b>Then:</b> gods and heroes, told out loud.</p><p><b>Now:</b> sent on phones. <b>Both:</b> told as true.</p>" },
      lv: { mild: { html: "<p><b>Then:</b> gods and heroes, told out loud.</p><p><b>Now:</b> a friend of a friend, sent on phones.</p><p><b>Both:</b> told as if they are true.</p>" },
        spicy: { fig: FEARS,
          html: "<p>Old myths and urban myths do the <b>same jobs</b>: they are told as true, they change with each telling, and they warn.</p>" +
            "<p>What changes is the <b>setting</b> and the <b>fear</b>. Old stories are full of dark woods, wolves and the deep sea: the dangers people faced then. Urban myths are full of phones, cameras, strangers online and new technology.</p>" +
            "<p>So a myth works like a time capsule: it shows <b>what people were worried about at the time</b>.</p>" +
            "<p>Then: told aloud over centuries. Now: shared in hours, and often checked (and busted) just as fast.</p>" } } },

    { type: "sort", topic: "Then and now",
      q: "Then, now, or both? Sort them, if you like.",
      buckets: ["Then (old myths)", "Both", "Now (urban myths)"],
      cards: [["Gods and heroes", 0], ["Told as if true", 1], ["Spread by phone and online", 2], ["Passed down for hundreds of years", 0], ["Changes when it is retold", 1], ["Happened to a friend of a friend", 2]],
      hint: "Use the Venn diagram: left is then, right is now, the middle is both.",
      why: "Gods and centuries: then. Phones and a friend of a friend: now. Told as true and changing with each telling: both.",
      ez: { q: "Then or now? Sort them.", why: "Gods and campfires: then. Phones: now." },
      lv: { mild: { q: "Then or now? Sort them, if you like.",
          buckets: ["Then", "Now"],
          cards: [["Gods and heroes", 0], ["Told round the fire", 0], ["Sent on phones", 1], ["A friend of a friend saw it", 1]],
          hint: "Long ago there were no phones.",
          why: "Gods and campfires: then. Phones and a friend of a friend: now." },
        spicy: { cards: [["Gods and heroes", 0], ["Told as if true", 1], ["Spread by phone and online", 2], ["Passed down for hundreds of years", 0], ["Changes when it is retold", 1], ["Happened to a friend of a friend", 2], ["Explains nature, like thunder or winter", 0], ["Shows what people were scared of at the time", 1]],
          why: "Explaining nature belongs to old myths. Showing the fears of the time is something both do: wolves then, phones now." } } },

    { type: "mc", topic: "Then and now",
      q: "Which one is true of <b>both</b> old myths and urban myths?",
      options: ["Both are told as if they are true", "Both are about gods", "Both are spread on phones"],
      answer: 0,
      slips: { 1: "Gods turn up in old myths, not in urban myths about gum and drains.", 2: "Old myths were around long before phones." },
      hint: "Look at the middle of the Venn diagram.",
      why: "Thor and the gum story were both told as if they were true. That is what they share.",
      ez: { q: "Which is true of <b>both</b> old and new myths?", slips: { 1: "Gods are in old myths only.", 2: "Old myths came long before phones." }, hint: "Look at the middle of the circles.", why: "<b>Both</b> are told as if they are true." },
      lv: { spicy: { q: "Old myths are full of dark woods, wolves and the deep sea. Urban myths are full of phones, cameras and strangers online. What does that suggest?",
        options: ["Stories show what people were worried about at the time", "People in the past had no imagination", "Phones are scarier than wolves", "Myths are always about animals"],
        slips: { 1: "They had plenty of imagination: a worm round a hill! The difference is what they were worried about.", 2: "Not scarier, just newer. Each age tells stories about its own dangers.", 3: "Urban myths are often about technology, not animals." },
        hint: "Wolves were a real danger then. What are people uneasy about now?",
        why: "Each age tells stories about its own dangers. Myths are a window into what people feared and cared about." } } },

    { type: "write", topic: "Then and now",
      q: "Pick one old myth or legend and one urban myth. What is the same about them, and what is different? Write as much or as little as you like. It only goes to Jay if you choose.",
      fig: VENN,
      starters: ["My old story is", "My urban myth is", "They are both", "They are different because"],
      checklist: ["I named an old story and a new one", "I said one thing that is the same", "I said one thing that is different"],
      minWords: 25,
      ez: { q: "Only if you like: compare an old story and a new one." },
      lv: { mild: { minWords: 8, starters: ["My old story is", "My new story is", "They are both"], checklist: ["I named two stories", "I said one thing that is the same"] },
        spicy: { minWords: 45, fig: FEARS, starters: ["Both stories", "The old story was told to", "The urban myth spreads because", "This shows that people were worried about"],
          checklist: ["I compared an old story with a modern one", "I said what job each story does", "I said what each one shows about the people who told it"] } } },

    { type: "widget", topic: "Then and now", unscored: true,
      title: "Myth hunt: try it for real",
      html: "<p>A challenge for away from the screen, whenever you fancy it. Every family and every place has its own stories. See what you can find.</p>",
      ez: { html: "<p>A challenge away from the screen. Only if you like.</p>" },
      mount: huntWidget,
      report: function(d){ var n = d && d.ticks ? d.ticks.filter(Boolean).length : 0; return n ? "Myth hunt: " + n + " of " + HUNT.length + " ticked." : ""; } }
  ],

  realWorld: {
    title: "Story collectors and myth busters",
    html: "<p>Folklorists travel around collecting the stories people tell, old and new. Fact checkers and science shows bust modern myths, like the one about gum.</p>" +
      "<p>For our big question: if we could time travel, we could sit by the fire the first time a legend was told and find out whether Robin Hood was real. Would knowing the truth spoil the story? Some stories might be better left as legends.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay next to a time portal, wondering if a legend was true">' + A.portal(80, 75, 56) + A.jay(240, 50, 0.85, "hmm") +
      A.bubble(290, 6, 124, 52, "Was Robin Hood\nreal, though?", 294) + '</svg>'
  },

  make: {
    title: "Make a then and now card",
    intro: "One old story, one new one, and what they share. Keep it, stick it on the wall, or send it to Jay.",
    fields: [
      { id: "old", label: "An old myth or legend", ph: "The Lambton Worm", max: 50 },
      { id: "now", label: "An urban myth from today", ph: "Gum stays in you for seven years", max: 60 },
      { id: "same", label: "What they share", ph: "Both are warnings told as if they are true", max: 80 },
      { id: "name", label: "Myth hunter", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      var o = wrap(v.old, 20, 3), n = wrap(v.now, 20, 3), s = wrap(v.same, 44, 2);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#2d2466"/>' +
        T(300, 46, "MYTHS THEN AND NOW", 24, { b: 1, a: "middle", c: "#ffd23f" }) +
        /* scroll */
        '<rect x="30" y="70" width="250" height="190" rx="10" fill="#f3e2b8"/><rect x="22" y="62" width="266" height="18" rx="9" fill="#c99a63"/><rect x="22" y="252" width="266" height="18" rx="9" fill="#c99a63"/>' +
        T(155, 108, "THEN", 18, { b: 1, a: "middle", c: "#7a5532" }) +
        o.map(function(l, k){ return T(155, 146 + k * 30, esc(l), 19, { b: 1, a: "middle", fit: 226 }); }).join("") +
        /* phone */
        '<rect x="330" y="62" width="240" height="208" rx="22" fill="#141a33"/><rect x="342" y="76" width="216" height="180" rx="10" fill="#e3f4fb"/>' +
        T(450, 108, "NOW", 18, { b: 1, a: "middle", c: "#1f6f9a" }) +
        n.map(function(l, k){ return T(450, 146 + k * 30, esc(l), 19, { b: 1, a: "middle", fit: 200 }); }).join("") +
        /* both */
        '<rect x="30" y="288" width="540" height="76" rx="14" fill="#ffffff"/>' +
        T(48, 312, "BOTH:", 15, { b: 1, c: "#8a5cf6" }) +
        s.map(function(l, k){ return T(110, 312 + k * 26, esc(l), 18, { fit: 448 }); }).join("") +
        T(570, 390, "Myth hunter: " + esc(v.name), 14, { a: "end", c: "#c9c3ff", fit: 400 }) +
        '</svg>';
    }
  }
};
})();
