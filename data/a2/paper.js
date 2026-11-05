/* ==========================================================
   Base 5 - Autumn 2 activities on paper
   Turns any Autumn 2 pack (/data/a2/<slug>.js) into A4 sheets
   for students who would rather work on paper (LP first).

   Not a print of the screen: every question type has its own
   pen and paper form.
     mc      letter bubbles to circle (big tiles when short)
     multi   boxes to tick
     num     answer boxes, plus a working out grid in maths
     text    ruled lines
     sort    lettered bins; write the bin letter by each card
     order   a box by each item to number them
     match   two columns of dots to join with a line
     write   starters, a ticklist and ruled lines
     learn   a "Look first" panel
     widget  needs a paper version on the step (see below)

   One chunk = one sheet (about five minutes), each starting on
   a new page and ending at a natural stop. Hints are printed
   upside down under the question, so looking is a choice.
   Answers go on a "Check it" page (at the back of the activity,
   at the end of a pack, or left out). The activity ends with the
   real world moment, a card to make and cut out, a "how was
   that?" line, and a small corner for Jay.

   Paper versions of steps. Any step can carry
     paper: false              leave it off paper
     paper: { ...fields }      merged over the step on paper
     paper: function(api){ return {...} or "html" }
   where api = { level, theme, tok }. A widget's paper version
   is usually { type: "task", ... } or any normal step type
   (mc, sort, match...) so it uses the same layouts. "task":
     { title, html, fig, ticks:[...], lines:n, grid:{cols, rows},
       boxes:[[label, hint]], table:{head:[...], rows:[[...]]},
       chips:[...], answer:"for the Check it page" }
   A pack can also carry paperMake: { ... } over make, and
   paperRealWorld over realWorld.

   A2PAPER.activity(pack, opts) -> HTML
   A2PAPER.pack(items, opts)     -> HTML (cover + activities)
   opts: { level, theme, who, hq, look:"blueprint"|"base5",
           answers:"back"|"end"|"none", sure:true, easy:false,
           packTitle, packLine }
   Needs /data/a2/art.js. ASCII only.
   ========================================================== */
(function(){
"use strict";

var A = window.A2ART || {};

/* ---------------------------------------------------------- helpers */
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function strip(h){ return String(h == null ? "" : h).replace(/<svg[\s\S]*?<\/svg>/g, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, "x").replace(/\s+/g, " ").trim(); }
function isPlain(v){ return v && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype; }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
var LET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/* a small seeded shuffle so the sheet and its answers always agree */
function seedOf(s){ var h = 2166136261; s = String(s); for(var i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h || 1; }
function rng(seed){ var x = seedOf(seed); return function(){ x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
function shuffled(n, seed, avoidSame){
  var r = rng(seed), idx = [], i, tries = 0;
  for(i = 0; i < n; i++) idx.push(i);
  do{
    for(i = n - 1; i > 0; i--){ var j = Math.floor(r() * (i + 1)), t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
    tries++;
  } while(avoidSame && n > 1 && tries < 8 && idx.every(function(v, k){ return v === k; }));
  return idx;
}

/* words that only make sense on a screen */
function paperWords(s){
  if(typeof s !== "string" || !s) return s;
  return s
    .replace(/\bTap (the |any |a |an |one |each |it|them|on )/g, "Circle $1")
    .replace(/\btap (the |any |a |an |one |each |it|them|on )/g, "circle $1")
    .replace(/\bType (it|the|how|your|a|an|one|in)\b/g, "Write $1")
    .replace(/\btype (it|the|how|your|a|an|one|in)\b/g, "write $1")
    .replace(/\bNext, you get a highlighter\./g, "Next, grab a highlighter or a pencil.")
    .replace(/\bfor away from the screen\b/g, "for real life")
    .replace(/\baway from the screen\b/g, "in real life")
    .replace(/\bon the screen\b/g, "on the page");
}

/* ---------------------------------------------------------- resolving a step (as the engine does) */
function makeTok(pack, theme){
  var th = pack.themes && theme && pack.themes[theme];
  function tok(v){
    if(typeof v === "string"){
      return v.indexOf("[[") < 0 ? v : v.replace(/\[\[([a-zA-Z0-9_]+)\]\]/g, function(m, k){
        if(th && th.w && th.w[k] != null) return th.w[k];
        var lo = k.charAt(0).toLowerCase() + k.slice(1);
        if(th && th.w && th.w[lo] != null){ var t = String(th.w[lo]); return t.charAt(0).toUpperCase() + t.slice(1); }
        return k;
      });
    }
    if(Array.isArray(v)) return v.map(tok);
    if(isPlain(v)){ var o = {}; Object.keys(v).forEach(function(k){ o[k] = tok(v[k]); }); return o; }
    return v;
  }
  return tok;
}
function mergeEz(a, b){
  if(b === undefined || b === null) return a;
  if(Array.isArray(a) && Array.isArray(b)) return a.map(function(x, i){ return i < b.length ? mergeEz(x, b[i]) : x; });
  if(isPlain(a) && typeof b === "string" && "html" in a){ var r = {}; Object.keys(a).forEach(function(k){ r[k] = a[k]; }); r.html = b; return r; }
  if(isPlain(a) && isPlain(b)){ var o = {}; Object.keys(a).forEach(function(k){ o[k] = a[k]; }); Object.keys(b).forEach(function(k){ o[k] = mergeEz(a[k], b[k]); }); return o; }
  return b;
}
function resolve(s, ctx){
  var o = {}, lv = ctx.level;
  Object.keys(s).forEach(function(k){ if(k !== "lv" && k !== "vary") o[k] = s[k]; });
  if(s.lv && s.lv[lv]) Object.keys(s.lv[lv]).forEach(function(k){ if(k !== "topic") o[k] = s.lv[lv][k]; });
  var ez = null;
  if(ctx.easy){ ez = (s.lv && s.lv[lv] && s.lv[lv].ez) || (lv === ctx.firstLevel ? s.ez : null) || null; }
  delete o.ez;
  var out = {};
  Object.keys(o).forEach(function(k){ out[k] = typeof o[k] === "function" ? o[k] : ctx.tok(o[k]); });
  if(ez) out = mergeEz(out, ctx.tok(ez));
  /* the paper version, if the step has one */
  if(Object.prototype.hasOwnProperty.call(s, "paper")){
    var p = s.paper;
    if(p === false) return null;
    if(typeof p === "function") p = p({ level: lv, theme: ctx.theme, tok: ctx.tok });
    if(typeof p === "string") p = { html: p };
    if(isPlain(p)){
      var lp = p.lv && p.lv[lv];
      Object.keys(p).forEach(function(k){ if(k !== "lv") out[k] = typeof p[k] === "function" ? p[k] : ctx.tok(p[k]); });
      if(lp) Object.keys(lp).forEach(function(k){ out[k] = ctx.tok(lp[k]); });
      out.fromPaper = true;
    }
  }
  delete out.paper;
  return out;
}

/* ---------------------------------------------------------- little drawings (literal colours, print safe) */
var INK = "#0b2840";
function svgWrap(w, h, inner, label){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" role="img" aria-label="' + esc(label || "") + '">' + inner + '</svg>'; }
var ICON = {
  circle: svgWrap(28, 28, '<ellipse cx="14" cy="14" rx="11" ry="9" fill="none" stroke="' + INK + '" stroke-width="2.4"/><text x="14" y="18.5" font-family="Arial" font-size="11" font-weight="700" text-anchor="middle" fill="' + INK + '">A</text>', "circle"),
  tick: svgWrap(28, 28, '<rect x="4" y="4" width="20" height="20" rx="3" fill="none" stroke="' + INK + '" stroke-width="2.4"/><path d="M8 14l4 4 8 -9" fill="none" stroke="#ff4f8b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>', "tick"),
  write: svgWrap(28, 28, '<path d="M6 22l2 -7 11 -11 5 5 -11 11z" fill="#ffd23f" stroke="' + INK + '" stroke-width="2"/><path d="M8 15l5 5" stroke="' + INK + '" stroke-width="2"/><path d="M4 26h20" stroke="' + INK + '" stroke-width="2"/>', "write"),
  join: svgWrap(28, 28, '<circle cx="6" cy="8" r="3.5" fill="' + INK + '"/><circle cx="22" cy="20" r="3.5" fill="' + INK + '"/><path d="M8 9.5Q16 9 20 18.5" fill="none" stroke="#ff7a2f" stroke-width="2.6" stroke-linecap="round"/>', "join"),
  number: svgWrap(28, 28, '<rect x="4" y="4" width="20" height="20" rx="3" fill="none" stroke="' + INK + '" stroke-width="2.4"/><text x="14" y="19.5" font-family="Arial" font-size="13" font-weight="700" text-anchor="middle" fill="#ff7a2f">1</text>', "number"),
  sort: svgWrap(28, 28, '<rect x="3" y="12" width="10" height="13" rx="2" fill="#c6f03c" stroke="' + INK + '" stroke-width="2"/><rect x="15" y="12" width="10" height="13" rx="2" fill="#3ad0ff" stroke="' + INK + '" stroke-width="2"/><text x="8" y="22" font-family="Arial" font-size="8" font-weight="700" text-anchor="middle" fill="' + INK + '">A</text><text x="20" y="22" font-family="Arial" font-size="8" font-weight="700" text-anchor="middle" fill="' + INK + '">B</text><path d="M14 3v6M11 6l3 3 3 -3" stroke="' + INK + '" stroke-width="2" fill="none"/>', "sort"),
  look: svgWrap(28, 28, '<circle cx="12" cy="12" r="7" fill="#fff" stroke="' + INK + '" stroke-width="2.4"/><path d="M17 17l7 7" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>', "look"),
  scissors: svgWrap(24, 16, '<circle cx="5" cy="4" r="3" fill="none" stroke="' + INK + '" stroke-width="1.6"/><circle cx="5" cy="12" r="3" fill="none" stroke="' + INK + '" stroke-width="1.6"/><path d="M7.5 5.5L22 12M7.5 10.5L22 4" stroke="' + INK + '" stroke-width="1.6"/>', "cut here")
};
function bonnie(scale, pose){
  if(!A.bonnie) return "";
  var w = Math.round(120 * scale), h = Math.round(90 * scale);
  return '<svg viewBox="0 0 120 90" width="' + w + '" height="' + h + '" role="img" aria-label="Bonnie">' + A.bonnie(60, 52, 0.62, pose || "sit") + '</svg>';
}
function jay(scale, mood){
  if(!A.jay) return "";
  var w = Math.round(110 * scale), h = Math.round(110 * scale);
  return '<svg viewBox="0 0 110 110" width="' + w + '" height="' + h + '" role="img" aria-label="Jay">' + A.jay(55, 52, 0.62, mood || "smile") + '</svg>';
}
function fig(svg, cls){ return svg ? '<div class="pf ' + (cls || "") + '">' + svg + '</div>' : ""; }
/* a picture sits beside the answers rather than above them, to save paper */
function side(svg, inner){ return svg ? '<div class="pside"><div class="pf pfside">' + svg + '</div><div class="pqa">' + inner + '</div></div>' : inner; }

/* ---------------------------------------------------------- bits every question can carry */
function sureStrip(){
  return '<div class="psure" aria-label="How sure are you?"><span>How sure?</span>' +
    ['guess', 'think so', 'sure'].map(function(t){ return '<i></i><em>' + t + '</em>'; }).join("") + '</div>';
}
function hintFlip(h){
  if(!h) return "";
  return '<div class="phint"><span class="phl">Stuck? Turn the page round:</span><span class="phu">' + paperWords(h) + '</span></div>';
}
function explainBox(){ return '<div class="pexplain"><b>How did you get that?</b> <span>(only if you fancy it)</span><div class="plines l2"></div></div>'; }
function lines(n, cls){ return '<div class="plines l' + clamp(n, 1, 14) + (cls ? " " + cls : "") + '"></div>'; }
function how(icon, words){ return '<span class="phow">' + ICON[icon] + '<span>' + words + '</span></span>'; }

/* ---------------------------------------------------------- one question */
function qHead(n, s, icon, words){
  return '<div class="pqh">' + (n ? '<span class="pqn">' + n + '</span>' : '') +
    '<div class="pqt">' + (s.stretch ? '<span class="pbonus">Bonus</span> ' : '') + paperWords(s.q || s.title || "") + '</div>' +
    (icon ? how(icon, words) : '') + '</div>';
}
function renderStep(s, n, ctx, key){
  var t = s.type, h = "", ans = null, seed = ctx.slug + "|" + key + "|" + ctx.level;
  var maths = /math/i.test(ctx.pack.subject || "");
  if(t === "learn"){
    var body = s.html, f = s.fig, title = s.title;
    if(s.routes && s.routes.length){
      var r = s.routes.filter(function(x){ return x.fig; })[0] || s.routes[0];
      body = r.html; f = r.fig || f;
    }
    h = '<div class="plearn">' + '<div class="plh">' + ICON.look + '<span>Look first</span>' + (title ? '<b>' + paperWords(title) + '</b>' : '') + '</div>' +
      side(f, '<div class="plb">' + paperWords(body || "") + '</div>') + '</div>';
    return { html: h };
  }
  if(t === "mc"){
    var order = s.fixed ? s.options.map(function(x, i){ return i; }) : shuffled(s.options.length, seed);
    var short = s.options.every(function(o){ return strip(o).length <= 22; }) && s.options.length <= 4;
    h = qHead(n, s, "circle", "Circle one") + side(s.fig,
      '<div class="popts ' + (short && !s.fig ? "tiles" : "rows") + '">' +
      order.map(function(oi, k){ return '<div class="popt"><span class="pbub">' + LET[k] + '</span><span class="pot">' + paperWords(s.options[oi]) + '</span></div>'; }).join("") + '</div>');
    var ak = order.indexOf(s.answer);
    ans = LET[ak] + ": " + strip(s.options[s.answer]);
  } else if(t === "multi"){
    var om = s.fixed ? s.options.map(function(x, i){ return i; }) : shuffled(s.options.length, seed);
    var need = (s.answers || []).length;
    h = qHead(n, s, "tick", need ? "Tick " + need : "Tick all that fit") + side(s.fig,
      '<div class="popts rows">' + om.map(function(oi, k){ return '<div class="popt"><span class="pbox"></span><span class="pot">' + paperWords(s.options[oi]) + '</span></div>'; }).join("") + '</div>');
    ans = (s.answers || []).map(function(a){ return strip(s.options[a]); }).join(" + ");
  } else if(t === "num"){
    h = qHead(n, s, "write", "Write it in") + side(s.fig, '<div class="pnums">' +
      (s.boxes || []).map(function(b){
        return '<div class="pnum">' + (b.label ? '<span class="pnl">' + paperWords(b.label) + '</span>' : '') +
          (b.pre ? '<span class="pnp">' + b.pre + '</span>' : '') + '<span class="pnb"></span>' + (b.post ? '<span class="pnp">' + b.post + '</span>' : '') + '</div>';
      }).join("") + '</div>' + (maths ? '<div class="pwork"><span>Working out, if it helps</span></div>' : ''));
    ans = (s.boxes || []).map(function(b){ return (b.label ? strip(b.label) + " " : "") + strip(b.pre || "") + b.a + strip(b.post || ""); }).join(", ");
  } else if(t === "text"){
    var ml = strip(s.model || "").length;
    h = qHead(n, s, "write", "Write it") + side(s.fig, lines(clamp(Math.ceil(ml / (s.fig ? 30 : 55)) + 1, 2, 5)));
    ans = s.model ? "For example: " + strip(s.model) : "Any answer that makes sense.";
  } else if(t === "sort"){
    var cards = s.cards || [], co = shuffled(cards.length, seed, true), bk = s.buckets || [];
    /* a mixed order: not all the A cards first */
    for(var tr = 1; tr < 8 && co.every(function(ci, k){ return k === 0 || cards[co[k - 1]][1] <= cards[ci][1]; }); tr++) co = shuffled(cards.length, seed + tr, true);
    h = qHead(n, s, "sort", "Write A" + (bk.length > 1 ? " or " + LET[1] : "") + (bk.length > 2 ? " or " + LET[2] : "")) + fig(s.fig) +
      '<div class="pbins">' + bk.map(function(b, k){ return '<div class="pbin b' + k + '"><span class="pbl">' + LET[k] + '</span><span>' + paperWords(b) + '</span></div>'; }).join("") + '</div>' +
      '<div class="pcards">' + co.map(function(ci, k){ return '<div class="pcard"><span class="pbox let"></span><span class="pot">' + paperWords(cards[ci][0]) + '</span></div>'; }).join("") + '</div>';
    ans = co.map(function(ci, k){ return (k + 1) + " " + LET[cards[ci][1]]; }).join(", ").replace(/^/, "Top to bottom: ");
  } else if(t === "order"){
    var it = s.items || [], oo = shuffled(it.length, seed, true);
    h = qHead(n, s, "number", "Number them 1 to " + it.length) + side(s.fig,
      '<div class="pcards">' + oo.map(function(ii){ return '<div class="pcard"><span class="pbox num"></span><span class="pot">' + paperWords(it[ii]) + '</span></div>'; }).join("") + '</div>');
    ans = "Top to bottom: " + oo.map(function(ii){ return ii + 1; }).join(", ");
  } else if(t === "match"){
    var pr = s.pairs || [], ro = shuffled(pr.length, seed, true);
    h = qHead(n, s, "join", "Join each pair") + fig(s.fig) +
      '<div class="pmatch">' + pr.map(function(p, k){
        var rr = pr[ro[k]];
        return '<div class="pml"><span class="pmn">' + (k + 1) + '</span><span class="pot">' + paperWords(p[0]) + '</span><i></i></div>' +
          '<div class="pmgap"></div>' +
          '<div class="pmr"><i></i><span class="pmn">' + LET[k] + '</span><span class="pot">' + paperWords(rr[1]) + '</span></div>';
      }).join("") + '</div>';
    ans = pr.map(function(p, k){ return (k + 1) + "-" + LET[ro.indexOf(k)]; }).join(", ");
  } else if(t === "write"){
    var mw = s.minWords || 30;
    h = qHead(0, s, "write", "Write it") + fig(s.fig) +
      ((s.starters && s.starters.length) ? '<div class="pstart"><b>Stuck? You could start with:</b> ' + s.starters.map(function(x){ return '<span>' + paperWords(x) + '</span>'; }).join("") + '</div>' : '') +
      lines(clamp(Math.round(mw / 6), 4, 11), "wide") +
      ((s.checklist && s.checklist.length) ? '<div class="pcheck"><b>Check it, if you like:</b> ' + s.checklist.map(function(x){ return '<span><i class="pbox sm"></i>' + paperWords(x) + '</span>'; }).join("") + '</div>' : '');
    return { html: '<div class="pq pwrite">' + h + '</div>' };
  } else if(t === "task" || t === "widget"){
    if(t === "widget" && !s.fromPaper){
      h = '<div class="ptask"><div class="pth">' + ICON.look + '<b>' + esc(strip(s.title || "On screen")) + '</b></div>' +
        '<p>This bit is a screen toy. Skip it, or ask Jay to show you if you are curious.</p></div>';
      return { html: h };
    }
    h = '<div class="ptask"><div class="pth">' + ICON[s.icon || "write"] + '<b>' + paperWords(s.title || "Have a go") + '</b>' + (s.how ? '<span class="phow2">' + s.how + '</span>' : '') + '</div>' +
      (s.html ? '<div class="ptb">' + paperWords(s.html) + '</div>' : '') + fig(s.fig) +
      (s.chips ? '<div class="pchips">' + s.chips.map(function(x){ return '<span>' + paperWords(x) + '</span>'; }).join("") + '</div>' : '') +
      (s.ticks ? '<div class="pticks' + (s.ticks.length > 6 ? " two" : "") + '">' + s.ticks.map(function(x){ return '<div><i class="pbox"></i><span>' + paperWords(x) + '</span></div>'; }).join("") + '</div>' : '') +
      (s.table ? table(s.table) : '') +
      (s.boxes ? '<div class="ptboxes">' + s.boxes.map(function(b){ return '<div class="ptbox"><b>' + paperWords(b[0]) + '</b>' + (b[1] ? '<span>' + paperWords(b[1]) + '</span>' : '') + lines(b[2] || 2) + '</div>'; }).join("") + '</div>' : '') +
      (s.grid ? gridPaper(s.grid) : '') +
      (s.lines ? lines(s.lines, "wide") : '') +
      (s.after ? '<div class="ptb after">' + paperWords(s.after) + '</div>' : '') + '</div>';
    return { html: h, ans: s.answer ? { n: n || "", a: strip(s.answer) } : null, numbered: !!s.answer };
  } else {
    h = qHead(n, s) + fig(s.fig) + lines(3);
  }
  h = '<div class="pq">' + h + (s.explain ? explainBox() : '') +
    '<div class="pqf">' + hintFlip(s.hint) + (ctx.sure && ctx.pack.sure !== false ? sureStrip() : '') + '</div></div>';
  return { html: h, ans: ans ? { n: n, a: ans } : null, numbered: true };
}
function table(tb){
  return '<table class="ptable"><thead><tr>' + tb.head.map(function(x){ return '<th>' + paperWords(x) + '</th>'; }).join("") + '</tr></thead><tbody>' +
    tb.rows.map(function(r){ return '<tr>' + r.map(function(c){ return '<td>' + (c == null ? "" : paperWords(String(c))) + '</td>'; }).join("") + '</tr>'; }).join("") + '</tbody></table>';
}
function gridPaper(g){
  var cols = g.cols || 16, rows = g.rows || 10, c = 26, w = cols * c + 2, hh = rows * c + 2, s = "";
  for(var i = 0; i <= cols; i++) s += '<path d="M' + (1 + i * c) + ' 1V' + (hh - 1) + '" stroke="#9cc0dc" stroke-width="' + (i % 5 === 0 ? 1.4 : 0.7) + '"/>';
  for(var j = 0; j <= rows; j++) s += '<path d="M1 ' + (1 + j * c) + 'H' + (w - 1) + '" stroke="#9cc0dc" stroke-width="' + (j % 5 === 0 ? 1.4 : 0.7) + '"/>';
  if(g.dots) g.dots.forEach(function(d){ s += '<circle cx="' + (1 + d[0] * c) + '" cy="' + (1 + d[1] * c) + '" r="4" fill="#ff7a2f"/>' + (d[2] ? '<text x="' + (1 + d[0] * c + 6) + '" y="' + (1 + d[1] * c - 6) + '" font-family="Arial" font-size="12" font-weight="700" fill="' + INK + '">' + d[2] + '</text>' : ''); });
  if(g.extra) s += g.extra;
  return '<div class="pgrid">' + (g.label ? '<span>' + g.label + '</span>' : '') + '<svg viewBox="0 0 ' + w + ' ' + hh + '" role="img" aria-label="Squared paper">' + s + '</svg></div>';
}

/* ---------------------------------------------------------- an activity */
function chunks(steps){
  var out = [], cur = null;
  steps.forEach(function(s, i){
    if(!s) return;
    if(!cur || cur.topic !== s.topic){ cur = { topic: s.topic, steps: [] }; out.push(cur); }
    cur.steps.push({ s: s, i: i });
  });
  return out;
}
function eggsIn(html){
  var m, out = [], re = /data-egg="([^"]+)"/g;
  while((m = re.exec(html))) out.push(m[1]);
  return out;
}
function mirror(t){ return '<span class="pmirror">' + t + '</span>'; }

function activity(pack, opts){
  opts = opts || {};
  var ids = (pack.levels || []).map(function(l){ return l.id; });
  var level = ids.indexOf(opts.level) >= 0 ? opts.level : (ids[1] || ids[0] || "medium");
  var tids = pack.themes ? Object.keys(pack.themes) : [];
  var theme = [opts.theme, (pack.themeFor || {})[opts.who], tids[0]].filter(function(x){ return x && tids.indexOf(x) >= 0; })[0] || null;
  var ctx = { pack: pack, slug: (pack.id || "").replace(/^a2-/, ""), level: level, theme: theme, tok: makeTok(pack, theme),
    easy: !!opts.easy, firstLevel: ids[0], sure: opts.sure !== false };
  var lvObj = (pack.levels || []).filter(function(l){ return l.id === level; })[0] || { name: level };
  var steps = pack.steps.map(function(s){ return resolve(s, ctx); });
  var ch = chunks(steps), n = 0, answers = [], allHtml = "";
  var hide = Math.floor(rng(ctx.slug + "bonnie")() * Math.max(1, ch.length));

  var sheets = ch.map(function(c, k){
    var body = "", ansHere = [];
    c.steps.forEach(function(x){
      var marked = ["mc", "multi", "num", "text", "sort", "order", "match"].indexOf(x.s.type) >= 0 || (x.s.type === "task" && x.s.answer);
      var r = renderStep(x.s, marked ? ++n : 0, ctx, x.i);
      body += r.html;
      if(r.ans) ansHere.push(r.ans);
    });
    allHtml += body;
    answers.push({ sheet: k + 1, topic: c.topic, list: ansHere });
    var last = k === ch.length - 1;
    return '<section class="psheet' + (k === 0 ? " first" : "") + '">' +
      '<header class="pshh"><span class="pshn">Sheet ' + (k + 1) + '<small> of ' + ch.length + '</small></span><span class="psht">' + paperWords(c.topic) + '</span>' +
      '<span class="pshm">about 5 min</span></header>' +
      body +
      '<div class="pstop">' + (last ? '<b>That is the last sheet.</b> The card to make is on the next page, if you fancy it.' :
        '<b>Good place to stop.</b> Sheet ' + (k + 2) + ' whenever you are ready.') +
      (k === hide ? '<span class="phide">' + bonnie(0.3, "stand") + '</span>' : '') + '</div></section>';
  }).join("");

  /* the top band on sheet one */
  var rw = pack.paperRealWorld ? ctx.tok(pack.paperRealWorld) : ctx.tok(pack.realWorld || null);
  var mk = pack.make ? ctx.tok(pack.make) : null;
  if(mk && pack.paperMake){ var pm = ctx.tok(pack.paperMake); Object.keys(pm).forEach(function(k){ mk[k] = pm[k]; }); }
  var lvRow = (pack.levels || []).map(function(l){ return '<span class="plv' + (l.id === level ? " on" : "") + '">' + esc(l.name) + '</span>'; }).join("");
  var band = '<div class="pband">' +
    '<div class="pbandt"><div class="psub">' + esc(pack.subject || "") + '</div><h1>' + esc(ctx.tok(pack.title)) + '</h1>' +
    '<p>' + paperWords(ctx.tok(pack.line || "")) + '</p>' +
    '<div class="plvs"><span class="plvl">Level</span>' + lvRow + '<span class="plvn">This is ' + esc(lvObj.name) + '. Fancy a swap? Just say.</span></div>' +
    '<div class="proute">' + ch.map(function(c, k){ return '<span><i>' + (k + 1) + '</i>' + paperWords(c.topic) + '</span>'; }).join("") +
      (mk ? '<span class="mk"><i>&#9733;</i>' + esc(strip(mk.title || "Make it")) + '</span>' : '') + '</div>' +
    '<p class="pseek">' + bonnie(0.28, "sit") + '<span>Bonnie is hiding on one of these sheets.</span></p></div>' +
    (pack.startFig ? '<div class="pbandf">' + ctx.tok(pack.startFig) + '</div>' : '') +
    '<div class="ptblock"><div><span>Drawn by</span><i></i></div><div><span>Date</span><i></i></div></div></div>';
  sheets = sheets.replace('<section class="psheet first">', '<section class="psheet first">' + band);

  /* the last page: real world, the card, how was that */
  var eggs = eggsIn(allHtml + (pack.startFig || "") + (rw && rw.fig || "")).filter(function(e, i, a){ return a.indexOf(e) === i; }).slice(0, 2);
  var end = '<section class="psheet pend">';
  if(rw){
    end += '<div class="prw"><div class="plh">' + ICON.look + '<span>Where you would use this</span>' + (rw.title ? '<b>' + paperWords(rw.title) + '</b>' : '') + '</div>' +
      (rw.fig ? fig(rw.fig, "pfs") : '') + '<div class="plb">' + paperWords(rw.html || "") + '</div></div>';
  }
  if(mk){
    end += '<div class="pmake"><div class="pcut">' + ICON.scissors + '<span>cut it out, if you like</span></div>' +
      '<div class="pcardout"><div class="pmkh"><b>' + paperWords(mk.title || "Make it") + '</b>' + jay(0.42, "smile") + '</div>' +
      (mk.intro ? '<p class="pmki">' + paperWords(mk.intro) + '</p>' : '') +
      (mk.fields || []).map(function(f){
        var big = (f.max || 60) > 90;
        return '<div class="pmkf"><b>' + paperWords(f.label || "") + '</b>' + (f.ph ? '<span class="pph">' + esc(strip(f.ph)) + '</span>' : '') + lines(big ? 3 : 1) + '</div>';
      }).join("") +
      '<div class="pdoodle"><span>Doodle space</span></div></div>' +
      '<p class="pmkn">Stick it on the wall, keep it, or hand it to Jay. Your call.</p></div>';
  }
  end += '<div class="pdone"><div class="pfeel"><b>How was that?</b>' +
    ['too easy', 'about right', 'too tricky'].map(function(x){ return '<span><i class="pbox sm"></i>' + x + '</span>'; }).join("") + '</div>' +
    '<div class="pfeel"><b>Did you find Bonnie?</b><span><i class="pbox sm"></i>yes</span><span><i class="pbox sm"></i>not yet</span></div>' +
    '<div class="pteach"><b>Teach it back, if you like:</b> write your own question for someone else to try.' + lines(2) + '</div>' +
    (eggs.length ? '<div class="pegg"><b>Something hidden in a picture?</b> Its secret is below, backwards. Hold it up to a mirror. ' + eggs.map(function(e){ return mirror(e); }).join(" ") + '</div>' : '') +
    '<div class="pjay"><b>For Jay</b><span>Sheets done: ' + ch.map(function(c, k){ return '<i class="pbox sm"></i>' + (k + 1); }).join(" ") + '</span><span>Note:</span><i class="pjl"></i></div></div></section>';

  /* answers */
  var check = '<section class="psheet pans' + (opts.answers === "back" ? "" : " loose") + '"><header class="pshh"><span class="pshn">Check it</span><span class="psht">' + esc(ctx.tok(pack.title)) + ' (' + esc(lvObj.name) + ')</span></header>' +
    '<p class="pansn">Answers for checking your own, or for Jay. No crosses needed: a dot by anything to come back to is plenty.</p>' +
    answers.filter(function(a){ return a.list.length; }).map(function(a){
      return '<div class="pansg"><b>Sheet ' + a.sheet + ': ' + paperWords(a.topic) + '</b><ol>' + a.list.map(function(x){ return '<li value="' + x.n + '">' + esc(x.a) + '</li>'; }).join("") + '</ol></div>';
    }).join("") + '</section>';

  var html = '<article class="pact ' + esc(pack.bodyClass || "") + '" data-slug="' + esc(ctx.slug) + '" data-level="' + esc(level) + '">' + sheets + end +
    (opts.answers === "back" ? check : '') + '</article>';
  return { html: html, answers: check, level: level, theme: theme, levelName: lvObj.name, sheets: ch.length, title: ctx.tok(pack.title), questions: n };
}

/* ---------------------------------------------------------- a pack: cover plus activities */
function cover(list, opts){
  return '<section class="psheet pcover">' +
    '<div class="pcv"><div class="psub">' + esc(opts.hq || "Base 5") + '</div><h1>' + esc(opts.packTitle || "Paper pack") + '</h1>' +
    (opts.packLine ? '<p>' + esc(opts.packLine) + '</p>' : '') + '</div>' +
    '<div class="pcvbody"><div class="pcvlist"><h2>In this pack</h2>' +
      list.map(function(r, k){ return '<div class="pcvi"><i class="pbox"></i><span><b>' + esc(r.title) + '</b><small>' + esc(r.subject || "") + ' &middot; ' + r.sheets + ' sheets &middot; ' + esc(r.levelName) + '</small></span></div>'; }).join("") +
      '<p class="pcvn">Any order. One sheet is about five minutes, and every sheet ends at a good place to stop.</p></div>' +
      '<div class="pcvkey"><h2>Pen moves</h2>' +
        '<div>' + ICON.circle + '<span>circle one</span></div><div>' + ICON.tick + '<span>tick</span></div>' +
        '<div>' + ICON.write + '<span>write</span></div><div>' + ICON.sort + '<span>sort with letters</span></div>' +
        '<div>' + ICON.number + '<span>number them</span></div><div>' + ICON.join + '<span>join with a line</span></div>' +
        '<div class="pcvb">' + bonnie(0.5, "sit") + '<span>Hints are upside down, for whenever you want one.</span></div></div></div></section>';
}
function pack(items, opts){
  opts = opts || {};
  var acts = items.map(function(it){
    var o = {}; Object.keys(opts).forEach(function(k){ o[k] = opts[k]; });
    o.level = it.level || opts.level; o.theme = it.theme || opts.theme;
    if(opts.answers === "end") o.answers = "none";
    var r = activity(it.pack, o); r.subject = it.pack.subject; return r;
  });
  var html = (items.length > 1 || opts.packTitle ? cover(acts, opts) : '') + acts.map(function(a){ return a.html; }).join("");
  if(opts.answers === "end") html += acts.map(function(a){ return a.answers; }).join("");
  return { html: html, acts: acts };
}

window.A2PAPER = { activity: activity, pack: pack, paperWords: paperWords, gridPaper: gridPaper, table: table, v: 1 };
})();
