/* ==========================================================
   Chilton Bridge School - Cultural Calendar: profile pictures
   A cartoon picture for the passport, built from parts. Drawn,
   never a photo, and kept on this device only.
     B5Face.svg(face, opts)    the picture (opts.cls, opts.still)
     B5Face.random()           a surprise face
     B5Face.maker(box, face, done(face|null))
                               builds the maker inside box
     B5Face.load() / save(f)   this device's picture
   Plain ASCII only.
   ========================================================== */
(function(){
"use strict";

var KEY = "b5.cc.face.v1";
var SKIN = ["#ffdbc2", "#f6c99b", "#e8b07c", "#c68642", "#a0662f", "#8d5524", "#5c3a1e", "#3b2414", "#b8e986", "#c3b1e1"];
var HAIRC = ["#1b1b1b", "#3b2314", "#6b4226", "#8d3b1f", "#d2691e", "#e8c26a", "#b8b8b8", "#3a86ff", "#ff5fa2", "#2ec4b6", "#8338ec"];
var BG = ["#007291", "#ef7724", "#ffc247", "#7b4b8f", "#06d6a0", "#4cc9f0", "#ff7aa2", "#13294b"];
var TOP = ["#007291", "#ef7724", "#0a2f38", "#e63946", "#2ec4b6", "#ffd166", "#8338ec", "#fffdf8"];

var PARTS = [
  { key: "shape", name: "Face", type: "style", opts: ["round", "oval", "square", "heart"] },
  { key: "skin", name: "Skin", type: "colour", opts: SKIN },
  { key: "hair", name: "Hair", type: "style", opts: ["short", "spiky", "curly", "afro", "long", "bun", "side", "braids", "buzz", "scarf", "none"] },
  { key: "hairc", name: "Hair colour", type: "colour", opts: HAIRC },
  { key: "eyes", name: "Eyes", type: "style", opts: ["dots", "happy", "wink", "big", "sleepy", "stars"] },
  { key: "mouth", name: "Mouth", type: "style", opts: ["smile", "grin", "open", "tongue", "flat", "smirk"] },
  { key: "extra", name: "Extras", type: "style", opts: ["none", "round", "square", "shades", "headphones", "cap", "beanie", "freckles", "earrings"] },
  { key: "top", name: "Top", type: "colour", opts: TOP },
  { key: "bg", name: "Background", type: "colour", opts: BG }
];
var DEFAULT = { shape: "round", skin: SKIN[2], hair: "short", hairc: HAIRC[1], eyes: "dots", mouth: "smile", extra: "none", top: TOP[0], bg: BG[0] };

function shade(hex, k){
  var h = hex.replace("#", ""), c = [0, 2, 4].map(function(i){ return parseInt(h.substr(i, 2), 16); });
  return "#" + c.map(function(v){ v = Math.max(0, Math.min(255, Math.round(v * k))); return (v < 16 ? "0" : "") + v.toString(16); }).join("");
}
function pick(a){ return a[(Math.random() * a.length) | 0]; }
function clean(f){
  var o = {}, k;
  for(k in DEFAULT) o[k] = DEFAULT[k];
  if(f) PARTS.forEach(function(p){ if(p.opts.indexOf(f[p.key]) > -1) o[p.key] = f[p.key]; });
  return o;
}

/* ---------- drawing ---------- */
var INK = "#2b1d14";
function head(f){
  var s = f.skin, o = 'fill="' + s + '" stroke="' + INK + '" stroke-width="1.6"';
  if(f.shape === "oval") return '<ellipse cx="50" cy="55" rx="21.5" ry="27" ' + o + '/>';
  if(f.shape === "square") return '<rect x="27" y="30" width="46" height="50" rx="15" ' + o + '/>';
  if(f.shape === "heart") return '<path d="M26 48q0-20 24-20t24 20q0 16-10 24t-14 10q-4-2-14-10t-10-24z" ' + o + '/>';
  return '<ellipse cx="50" cy="55" rx="24" ry="26" ' + o + '/>';
}
function hairBack(f){
  var c = f.hairc, d = shade(c, .8);
  switch(f.hair){
    case "long": return '<path d="M24 50q-2-26 26-26t26 26v40q-6 6-12 0V58H36v32q-6 6-12 0z" fill="' + d + '"/>';
    case "braids": return '<g fill="' + d + '" stroke="' + INK + '" stroke-width="1.2">' +
      [0, 1, 2, 3].map(function(i){ return '<ellipse cx="23" cy="' + (62 + i * 9) + '" rx="5" ry="5.5"/><ellipse cx="77" cy="' + (62 + i * 9) + '" rx="5" ry="5.5"/>'; }).join("") + '</g>';
    case "afro": return '<g fill="' + c + '">' + [[50, 32, 26], [28, 44, 15], [72, 44, 15], [24, 60, 11], [76, 60, 11], [36, 26, 14], [64, 26, 14]].map(function(p){ return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + p[2] + '"/>'; }).join("") + '</g>';
    case "bun": return '<circle cx="50" cy="22" r="10" fill="' + c + '" stroke="' + INK + '" stroke-width="1.4"/>';
    case "scarf": return '<path d="M20 58q-2-38 30-38t30 38q0 24-8 34H28q-8-10-8-34z" fill="' + c + '" stroke="' + INK + '" stroke-width="1.6"/>';
  }
  return "";
}
function hairFront(f){
  var c = f.hairc, st = 'fill="' + c + '" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round"';
  switch(f.hair){
    case "short": return '<path d="M26 50q0-24 24-24t24 24q-6-10-18-12q-2 6-10 6q4-4 2-8q-14 2-22 14z" ' + st + '/>';
    case "spiky": return '<path d="M26 50l-2-14 8 4-2-12 9 6 2-12 8 9 6-10 3 11 9-5-1 11 8-2-4 12q-6-9-22-10q-16 1-24 12z" ' + st + '/>';
    case "curly": return '<g ' + st + '>' + [[30, 40], [38, 32], [47, 29], [56, 30], [64, 33], [70, 41], [26, 49], [74, 49]].map(function(p){ return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7"/>'; }).join("") + '</g>';
    case "afro": return '<path d="M28 44q22-14 44 0q-4-8-22-10q-18 2-22 10z" fill="' + shade(c, .85) + '"/>';
    case "long": return '<path d="M26 52q0-26 24-26t24 26q-10-14-24-14q-10 6-16 2q-4 6-8 12z" ' + st + '/>';
    case "bun": return '<path d="M26 50q0-22 24-22t24 22q-8-12-24-12t-24 12z" ' + st + '/>';
    case "side": return '<path d="M25 52q-2-26 25-26t25 24q-14-2-24-14q-2 8-14 10q-6 2-12 6z" ' + st + '/>';
    case "braids": return '<path d="M26 50q0-22 24-22t24 22q-12-6-24-14q-12 8-24 14z" ' + st + '/><path d="M50 28v10" stroke="' + INK + '" stroke-width="1.2"/>';
    case "buzz": return '<path d="M27 46q2-20 23-20t23 20q-10-8-23-8t-23 8z" fill="' + c + '" opacity=".75"/>';
    case "scarf": return '<path d="M27 50q0-22 23-22t23 22q-8-9-23-9t-23 9z" fill="' + shade(c, .88) + '"/>';
  }
  return "";
}
function eyes(f){
  var e = f.eyes, L = 41, R = 59, y = 56, out = "";
  var brow = '<path d="M36 47q5-3 10 0M54 47q5-3 10 0" fill="none" stroke="' + (f.hair === "none" || f.hair === "scarf" ? INK : f.hairc) + '" stroke-width="2" stroke-linecap="round"/>';
  if(e === "happy") out = '<path d="M37 57q4-5 8 0M55 57q4-5 8 0" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>';
  else if(e === "wink") out = '<g class="fc-eyes"><circle cx="' + L + '" cy="' + y + '" r="3.2" fill="' + INK + '"/></g><path d="M55 57q4-4 8 0" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>';
  else if(e === "big") out = '<g class="fc-eyes"><circle cx="' + L + '" cy="' + y + '" r="6" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/><circle cx="' + R + '" cy="' + y + '" r="6" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/><circle cx="' + (L + 1) + '" cy="' + (y + 1) + '" r="3" fill="' + INK + '"/><circle cx="' + (R + 1) + '" cy="' + (y + 1) + '" r="3" fill="' + INK + '"/><circle cx="' + (L + 2) + '" cy="' + (y - 1) + '" r="1" fill="#fff"/><circle cx="' + (R + 2) + '" cy="' + (y - 1) + '" r="1" fill="#fff"/></g>';
  else if(e === "sleepy") out = '<path d="M37 56h8M55 56h8" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/><path d="M37 56q4 4 8 0M55 56q4 4 8 0" fill="' + INK + '"/>';
  else if(e === "stars") out = '<g class="fc-eyes" fill="#ffd166" stroke="' + INK + '" stroke-width="1">' + [L, R].map(function(x){ return '<path d="M' + x + ' ' + (y - 5) + 'l1.6 3.4 3.6.4-2.7 2.4.8 3.6-3.3-1.9-3.3 1.9.8-3.6-2.7-2.4 3.6-.4z"/>'; }).join("") + '</g>';
  else out = '<g class="fc-eyes"><circle cx="' + L + '" cy="' + y + '" r="3.2" fill="' + INK + '"/><circle cx="' + R + '" cy="' + y + '" r="3.2" fill="' + INK + '"/><circle cx="' + (L + 1) + '" cy="' + (y - 1) + '" r="1" fill="#fff"/><circle cx="' + (R + 1) + '" cy="' + (y - 1) + '" r="1" fill="#fff"/></g>';
  return brow + out;
}
function mouth(f){
  var m = f.mouth, st = 'fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"';
  if(m === "grin") return '<path d="M41 67q9 10 18 0z" fill="#fff" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/><path d="M42 67h16" stroke="' + INK + '" stroke-width="1"/>';
  if(m === "open") return '<ellipse cx="50" cy="70" rx="5" ry="6" fill="#7a1f2b" stroke="' + INK + '" stroke-width="1.6"/>';
  if(m === "tongue") return '<path d="M42 67q8 7 16 0" ' + st + '/><path d="M47 70q3 7 6 0z" fill="#ff7aa2" stroke="' + INK + '" stroke-width="1.2"/>';
  if(m === "flat") return '<path d="M44 69h12" ' + st + '/>';
  if(m === "smirk") return '<path d="M43 69q8 2 14-4" ' + st + '/>';
  return '<path d="M42 67q8 8 16 0" ' + st + '/>';
}
function extra(f){
  var x = f.extra, gl = 'fill="none" stroke="' + INK + '" stroke-width="2"';
  if(x === "round") return '<circle cx="41" cy="56" r="7" ' + gl + '/><circle cx="59" cy="56" r="7" ' + gl + '/><path d="M48 56h4M34 55l-6-2M66 55l6-2" ' + gl + '/>';
  if(x === "square") return '<rect x="33" y="50" width="15" height="12" rx="3" ' + gl + '/><rect x="52" y="50" width="15" height="12" rx="3" ' + gl + '/><path d="M48 55h4M33 54l-5-2M67 54l5-2" ' + gl + '/>';
  if(x === "shades") return '<path d="M32 51h16v6q0 6-8 6t-8-6zM52 51h16v6q0 6-8 6t-8-6z" fill="' + INK + '"/><path d="M48 53h4M32 52l-5-2M68 52l5-2" ' + gl + '/><path d="M36 54l4-2M56 54l4-2" stroke="#fff" stroke-width="1.4" opacity=".6"/>';
  if(x === "headphones") return '<path d="M24 56q0-34 26-34t26 34" fill="none" stroke="' + INK + '" stroke-width="4"/><rect x="18" y="50" width="10" height="16" rx="4" fill="#e63946" stroke="' + INK + '" stroke-width="1.6"/><rect x="72" y="50" width="10" height="16" rx="4" fill="#e63946" stroke="' + INK + '" stroke-width="1.6"/>';
  if(x === "cap") return '<path d="M26 44q0-20 24-20t24 20z" fill="#e63946" stroke="' + INK + '" stroke-width="1.6"/><path d="M50 44h32q2 4-4 6H50z" fill="#c1121f" stroke="' + INK + '" stroke-width="1.6"/><circle cx="50" cy="24" r="2.4" fill="#c1121f"/>';
  if(x === "beanie") return '<path d="M25 46q0-24 25-24t25 24z" fill="#7b4b8f" stroke="' + INK + '" stroke-width="1.6"/><rect x="24" y="42" width="52" height="9" rx="4" fill="#9a6ab0" stroke="' + INK + '" stroke-width="1.6"/><circle cx="50" cy="20" r="5" fill="#ffd166" stroke="' + INK + '" stroke-width="1.4"/>';
  if(x === "freckles") return '<g fill="' + shade(f.skin, .7) + '"><circle cx="36" cy="63" r="1.1"/><circle cx="39" cy="65" r="1.1"/><circle cx="34" cy="66" r="1.1"/><circle cx="64" cy="63" r="1.1"/><circle cx="61" cy="65" r="1.1"/><circle cx="66" cy="66" r="1.1"/></g>';
  if(x === "earrings") return '<circle cx="26" cy="66" r="2.6" fill="#ffd166" stroke="' + INK + '" stroke-width="1"/><circle cx="74" cy="66" r="2.6" fill="#ffd166" stroke="' + INK + '" stroke-width="1"/>';
  return "";
}
var N = 0;
function svg(face, o){
  var f = clean(face); o = o || {};
  var id = "fcbg" + (++N), s = '<svg class="' + (o.cls || "face") + (o.still ? "" : " fc-live") + '" viewBox="0 0 100 125" role="img" aria-label="Profile picture" focusable="false">';
  s += '<defs><clipPath id="' + id + '"><rect width="100" height="125" rx="' + (o.round ? 50 : 8) + '"/></clipPath></defs><g clip-path="url(#' + id + ')">';
  s += '<rect width="100" height="125" fill="' + f.bg + '"/><g fill="#fff" opacity=".14"><circle cx="16" cy="18" r="10"/><circle cx="88" cy="30" r="14"/><circle cx="80" cy="104" r="9"/></g>';
  s += '<g class="fc-body">';
  s += '<path d="M10 128q2-34 40-36q38 2 40 36z" fill="' + f.top + '" stroke="' + INK + '" stroke-width="1.6"/>';
  s += '<path d="M42 92q8 7 16 0" fill="none" stroke="' + INK + '" stroke-width="1.4" opacity=".5"/>';
  s += '<rect x="43" y="76" width="14" height="17" rx="5" fill="' + shade(f.skin, .9) + '" stroke="' + INK + '" stroke-width="1.4"/>';
  s += hairBack(f);
  s += '<circle cx="26" cy="58" r="5" fill="' + f.skin + '" stroke="' + INK + '" stroke-width="1.4"/><circle cx="74" cy="58" r="5" fill="' + f.skin + '" stroke="' + INK + '" stroke-width="1.4"/>';
  s += head(f);
  s += '<g opacity=".35" fill="#ff7aa2"><ellipse cx="35" cy="66" rx="4" ry="2.4"/><ellipse cx="65" cy="66" rx="4" ry="2.4"/></g>';
  s += eyes(f) + '<path d="M49 59q-3 6 2 6" fill="none" stroke="' + shade(f.skin, .6) + '" stroke-width="1.6" stroke-linecap="round"/>' + mouth(f);
  s += hairFront(f) + extra(f);
  s += '</g></g></svg>';
  return s;
}
function random(){
  var f = {};
  PARTS.forEach(function(p){ f[p.key] = pick(p.opts); });
  if(Math.random() < .6) f.extra = "none";
  return f;
}
function load(){ try{ var f = JSON.parse(localStorage.getItem(KEY) || "null"); return f ? clean(f) : null; }catch(e){ return null; } }
function save(f){ try{ if(f) localStorage.setItem(KEY, JSON.stringify(clean(f))); else localStorage.removeItem(KEY); }catch(e){} }

/* ---------- the maker ----------
   One part at a time: big picture on one side, the choices as
   pictures on the other. Colours are swatches; styles show the
   picture with that style already on. */
var CSS = ''
  + '.fm{display:grid;grid-template-columns:190px minmax(0,1fr);gap:18px;align-items:start}'
  + '.fm-prev{position:sticky;top:0;display:flex;flex-direction:column;gap:10px;align-items:center}'
  + '.fm-prev .face{width:170px;height:auto;border-radius:14px;border:4px solid #13294b;box-shadow:6px 7px 0 rgba(19,41,75,.25);background:#fff}'
  + '.fm-prev .face.pop{animation:fmpop .45s cubic-bezier(.2,1.6,.4,1)}'
  + '@keyframes fmpop{30%{transform:scale(1.06) rotate(-3deg)}}'
  + '.fm-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}'
  + '.fm-tabs button{font:inherit;font-weight:700;font-size:.82rem;border:2px solid #13294b;border-radius:999px;padding:5px 11px;background:#fff;color:#13294b;cursor:pointer}'
  + '.fm-tabs button[aria-pressed="true"]{background:#13294b;color:#f3d27a}'
  + '.fm-opts{display:grid;grid-template-columns:repeat(auto-fill,minmax(64px,1fr));gap:8px}'
  + '.fm-opts button{font:inherit;padding:0;border:3px solid #13294b;border-radius:12px;background:#fff;cursor:pointer;overflow:hidden;line-height:0;transition:transform .12s ease}'
  + '.fm-opts button:hover{transform:translateY(-2px) rotate(-2deg)}'
  + '.fm-opts button[aria-pressed="true"]{box-shadow:0 0 0 4px #ef7724;transform:scale(1.04)}'
  + '.fm-opts button .face{width:100%;height:auto}'
  + '.fm-opts .sw{display:block;aspect-ratio:1;border-radius:9px}'
  + '.fm-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}'
  + '.fm-acts button{font:inherit;font-weight:700;border:3px solid #13294b;border-radius:12px;padding:8px 14px;cursor:pointer;background:#fff;color:#13294b}'
  + '.fm-acts .go{background:#f3d27a;box-shadow:4px 5px 0 #13294b}'
  + '.fm-acts .dice svg{width:20px;height:20px;vertical-align:-4px;margin-right:6px}'
  + '.fm-acts .dice.roll svg{animation:fmroll .5s ease}'
  + '@keyframes fmroll{to{transform:rotate(360deg)}}'
  + '.face.fc-live .fc-eyes{transform-box:fill-box;transform-origin:50% 50%;animation:fcblink 5s infinite}'
  + '.face.fc-live .fc-body{animation:fcbob 3.2s ease-in-out infinite alternate}'
  + '@keyframes fcblink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}'
  + '@keyframes fcbob{from{transform:translateY(0)}to{transform:translateY(-1.5px)}}'
  + '@media (max-width:560px){.fm{grid-template-columns:1fr}.fm-prev{position:static}.fm-prev .face{width:130px}}'
  + '@media (prefers-reduced-motion:reduce){.face *,.fm *{animation:none !important}}';
function addCss(){
  if(document.getElementById("fmCss")) return;
  var st = document.createElement("style"); st.id = "fmCss"; st.textContent = CSS; document.head.appendChild(st);
}
addCss();

function maker(box, start, done, sfx){
  var f = clean(start || DEFAULT), tab = 0;
  sfx = sfx || function(){};
  function opts(){
    var p = PARTS[tab];
    return p.opts.map(function(v){
      var on = f[p.key] === v, inner;
      if(p.type === "colour") inner = '<span class="sw" style="background:' + v + '"></span>';
      else { var g = clean(f); g[p.key] = v; inner = svg(g, { still: true, cls: "face" }); }
      return '<button type="button" data-v="' + v + '" aria-pressed="' + on + '" aria-label="' + p.name + ' ' + v + '">' + inner + '</button>';
    }).join("");
  }
  function draw(pop){
    box.innerHTML = '<div class="fm"><div class="fm-prev">' + svg(f, { cls: "face" + (pop ? " pop" : "") }) + '</div><div>' +
      '<div class="fm-tabs" role="group" aria-label="Which part">' + PARTS.map(function(p, i){ return '<button type="button" data-t="' + i + '" aria-pressed="' + (i === tab) + '">' + p.name + '</button>'; }).join("") + '</div>' +
      '<div class="fm-opts" role="group" aria-label="' + PARTS[tab].name + '">' + opts() + '</div>' +
      '<div class="fm-acts"><button type="button" class="dice" data-a="dice"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="8" cy="8" r="1.6" fill="currentColor"/><circle cx="16" cy="16" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>Surprise me</button>' +
      '<button type="button" class="go" data-a="done">Use this picture</button><button type="button" data-a="cancel">Not now</button></div></div></div>';
    [].forEach.call(box.querySelectorAll(".fm-tabs button"), function(b){ b.addEventListener("click", function(){ tab = +b.getAttribute("data-t"); sfx("pop"); draw(false); }); });
    [].forEach.call(box.querySelectorAll(".fm-opts button"), function(b){ b.addEventListener("click", function(){ f[PARTS[tab].key] = b.getAttribute("data-v"); sfx("pop"); draw(true); }); });
    box.querySelector('[data-a="dice"]').addEventListener("click", function(){ f = clean(random()); sfx("dice"); draw(true); var d = box.querySelector(".dice"); if(d){ d.classList.add("roll"); } });
    box.querySelector('[data-a="done"]').addEventListener("click", function(){ save(f); sfx("tick"); done(f); });
    box.querySelector('[data-a="cancel"]').addEventListener("click", function(){ done(null); });
  }
  draw(false);
}

window.B5Face = { svg: svg, random: random, maker: maker, load: load, save: save, parts: PARTS };
})();
