/* ==========================================================
   Chilton Bridge School - Cultural Calendar: this week's card
   A small themed card for this week, for pages outside /cc/.
     B5CCCard.week(iso)          this week, or the next one in a
                                 holiday (null after the year ends)
     B5CCCard.html(w, opts)      the card's markup:
        opts.kicker   small line at the top
        opts.go       words on the button
        opts.home     true adds the week's try at home idea
        opts.cls      extra classes for the outside
     B5CCCard.load(cb)           loads the data and art it needs,
                                 then calls cb (for lazy pages)
   Needs /data/cc.js, /cc/cc-art.js and /cc/cc-scenes.js; load()
   fetches them. Plain ASCII only.
   ========================================================== */
(function(){
"use strict";
if(window.B5CCCard) return;

var CSS = ''
  + '.ccx{position:relative;display:block;overflow:hidden;isolation:isolate;min-height:250px;text-decoration:none;color:var(--ccx-ink);'
  + 'background:linear-gradient(160deg,var(--ccx-bg),var(--ccx-bg2));border:3px solid #0a2f38;border-radius:26px 20px 24px 18px;box-shadow:6px 8px 0 var(--ccx-pop2);padding:0 !important}'
  + '.ccx-art{position:absolute;inset:0;z-index:-2}.ccx-art .scene{position:absolute;inset:0;width:100%;height:100%}'
  + '.ccx-art .ccx-motif{position:absolute;right:4%;top:50%;width:min(36%,220px);transform:translateY(-50%) rotate(-7deg)}'
  + '.ccx-scrim{position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,var(--ccx-bg) 0%,var(--ccx-bg) 34%,transparent 74%)}'
  + '.ccx-words{position:relative;padding:20px 22px 22px;max-width:60%;display:flex;flex-direction:column;align-items:flex-start;gap:6px}'
  + '.ccx-k{font-family:Archivo,Arial Black,sans-serif;font-variation-settings:"wdth" 108,"wght" 850;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;'
  + 'background:var(--ccx-pop);color:var(--ccx-popink);border:2px solid #0a2f38;border-radius:999px;padding:4px 10px}'
  + '.ccx-t{font-family:Archivo,Arial Black,sans-serif;font-variation-settings:"wdth" 125,"wght" 900;text-transform:uppercase;font-size:clamp(1.7rem,4vw,2.6rem);line-height:.95;text-shadow:3px 4px 0 var(--ccx-pop2);margin:4px 0 2px}'
  + '.ccx-q{font-weight:700;font-size:1.08rem;line-height:1.25;max-width:30ch}'
  + '.ccx-home{display:flex;align-items:center;gap:10px;margin-top:6px;background:#fffdf8;color:#0a2f38;border:2px solid #0a2f38;border-radius:14px;padding:6px 12px 6px 6px;font-weight:700;font-size:.92rem;line-height:1.2}'
  + '.ccx-home i{flex:none;width:38px;height:38px;border-radius:50%;background:var(--ccx-bg);display:grid;place-items:center}.ccx-home i svg{width:26px;height:26px}'
  + '.ccx-home small{display:block;font-weight:400;font-size:.78rem;color:#3d5b64}'
  + '.ccx-go{display:inline-flex;align-items:center;gap:8px;margin-top:8px;font-family:Archivo,Arial Black,sans-serif;font-variation-settings:"wdth" 112,"wght" 900;text-transform:uppercase;letter-spacing:.06em;'
  + 'background:var(--ccx-pop);color:var(--ccx-popink);border:3px solid #0a2f38;border-radius:14px;padding:8px 18px;box-shadow:4px 5px 0 #0a2f38}'
  + '.ccx-go svg{width:18px;height:18px}'
  + '.ccx:hover .ccx-go{transform:translate(-2px,-2px);box-shadow:6px 7px 0 #0a2f38}'
  + '.ccx,.board .ccx{opacity:1}.ccx.live{animation:ccxglow 2.4s ease-in-out infinite}'
  + '@keyframes ccxglow{50%{box-shadow:6px 8px 0 var(--ccx-pop2),0 0 0 8px rgba(239,119,36,.35)}}'
  + '@media (max-width:640px){.ccx{min-height:0}.ccx-art{bottom:auto;height:170px}.ccx-scrim{background:linear-gradient(180deg,transparent 0,transparent 110px,var(--ccx-bg) 170px)}'
  + '.ccx-words{max-width:none;padding-top:150px}}'
  + '@media (prefers-reduced-motion:reduce){.ccx.live{animation:none}}';

function addCss(){
  if(document.getElementById("ccxCss")) return;
  var st = document.createElement("style"); st.id = "ccxCss"; st.textContent = CSS; document.head.appendChild(st);
  if(!document.querySelector('link[href^="/cc/cc-motion.css"]')){
    var l = document.createElement("link"); l.rel = "stylesheet"; l.href = "/cc/cc-motion.css?v=2"; document.head.appendChild(l);
  }
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function lum(hex){
  var h = String(hex).replace("#", ""); if(h.length !== 6) return 1;
  var c = [0, 2, 4].map(function(i){ var v = parseInt(h.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function pad(n){ return (n < 10 ? "0" : "") + n; }
function todayIso(){ var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }

/* The same rule as /cc/: the week we are in; in a listed holiday (or
   before the first week) the next one; otherwise the most recent.
   w.ccMode says which: "now", "next" or "last". */
function week(iso){
  var C = window.B5CC; if(!C) return null;
  iso = iso || todayIso();
  var W = C.weeks, i, prev = null;
  var now = W.filter(function(w){ return w.start <= iso && iso <= w.end; })[0];
  if(now) return tag(now, "now");
  var hol = (C.holidays || []).filter(function(h){ return h.from <= iso && iso <= h.to; })[0];
  var next = W.filter(function(w){ return w.start > iso; })[0];
  for(i = 0; i < W.length; i++) if(W[i].end < iso) prev = W[i];
  if(next && (hol || !prev)) return tag(next, "next");
  return prev ? tag(prev, "last") : null;
}
function tag(w, mode){ var o = {}, k; for(k in w) o[k] = w[k]; o.ccMode = mode; return o; }

function html(w, o){
  o = o || {};
  var L = w.look, A = window.B5CCArt, SC = window.B5CCScenes;
  var art = SC && L.scene && SC.has(L.scene) ? SC.draw(L.scene, L) : (A ? '<span class="ccx-motif">' + A.icon(L.motif, L.pop, L.bg2) + '</span>' : "");
  var SF = A && A.safe ? A.safe(L) : { bg: L.bg, bg2: L.bg2, popink: lum(L.pop) < 0.36 ? "#ffffff" : "#0a2f38", popbg: L.pop };
  var popink = SF.popink;
  var t = o.home && w.try ? w.try[w.home || 0] : null;
  if(t && Array.isArray(t)) t = { i: t[0], t: t[1] };
  addCss();
  return '<a class="ccx ' + (o.cls || "") + '" href="/cc/#' + esc(w.id) + '" style="--ccx-bg:' + SF.bg + ';--ccx-bg2:' + SF.bg2 + ';--ccx-ink:' + L.ink + ';--ccx-pop:' + SF.popbg + ';--ccx-pop2:' + L.pop2 + ';--ccx-popink:' + popink + '">' +
    '<span class="ccx-art" aria-hidden="true">' + art + '</span><span class="ccx-scrim" aria-hidden="true"></span>' +
    '<span class="ccx-words">' +
      (o.kicker ? '<span class="ccx-k">' + esc(o.kicker) + '</span>' : '') +
      '<span class="ccx-t">' + esc(w.title) + '</span><span class="ccx-q">' + esc(w.q) + '</span>' +
      (t ? '<span class="ccx-home"><i>' + (A ? A.icon(t.i, L.pop, L.bg) : "") + '</i><span><small>Try it at home</small>' + esc(t.t) + '</span></span>' : '') +
      '<span class="ccx-go"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="currentColor"/></svg>' + esc(o.go || "Go") + '</span>' +
    '</span></a>';
}

var loading = null;
function load(cb){
  if(window.B5CC && window.B5CCArt && window.B5CCScenes){ cb(); return; }
  if(!loading){
    loading = [];
    var files = ["/data/cc.js?v=6", "/cc/cc-art.js?v=8", "/cc/cc-scenes.js?v=8"], i = 0;
    (function next(){
      if(i >= files.length){ var q = loading; loading = null; q.forEach(function(f){ f(); }); return; }
      var s = document.createElement("script"); s.src = files[i++]; s.onload = next;
      s.onerror = function(){ loading = null; };
      document.head.appendChild(s);
    })();
  }
  loading.push(cb);
}

window.B5CCCard = { week: week, html: html, load: load };
})();
