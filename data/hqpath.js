/* ==========================================================
   Base 5 - My path (the Start button)
   One button on the HQ home that takes a student through all of
   their learning activities in a sensible order, one chunk at a
   time, so there is never a menu to choose from. Jay asked for
   this because too many options at once was making it hard to
   get going.

   The order:
     1. The Autumn 2 activities that have landed in their folder
        (their targets this term), oldest first.
     2. Then their HQ's own activities, taking turns between
        subjects (English, then Maths, then the next English...)
        in the order the HQ lists them, which builds skill by skill.
   Anything finished is skipped. Anything started comes back first,
   at the chunk they stopped on.

   HQ home:      HQPath.button(el)    draws the Start button
   Any page:     HQPath.list()        promise of the whole path
                 HQPath.next(skipId)  promise of the next step
   Activity pages opened from the path carry ?path=1; the engine
   then skips the menu and, at the end, offers the next step.
   Progress comes from the activities' own saves, so it follows the
   student between devices with everything else. ASCII only.
   ========================================================== */
(function(){
"use strict";
if(window.HQPath) return;
var HQ = window.HQ || { who: "EGW", prefix: "b5.egw.", base: "/egw/" };

function today(){ var d = new Date(), m = d.getMonth() + 1, dd = d.getDate(); return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (dd < 10 ? "0" : "") + dd; }
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function script(src, test){
  if(test()) return Promise.resolve();
  return new Promise(function(res){ var s = document.createElement("script"); s.src = src; s.onload = s.onerror = function(){ res(); }; document.head.appendChild(s); });
}
function summary(id){
  try{ var d = JSON.parse(localStorage.getItem(HQ.prefix + id + ".v1") || "null"); return d && d.summary ? d.summary : (d && d.answers ? { started: true } : null); }catch(e){ return null; }
}
function withParam(href, k, v){
  var hash = "", i = href.indexOf("#");
  if(i >= 0){ hash = href.slice(i); href = href.slice(0, i); }
  return href + (href.indexOf("?") < 0 ? "?" : "&") + k + "=" + v + hash;
}

function list(){
  return Promise.all([
    script(HQ.base + "catalogue.js?v=path", function(){ return !!window.EGWCAT; }),
    script("/data/a2/drops.js?t=" + today(), function(){ return !!window.B5DROPS; })
  ]).then(function(){
    var out = [], t = today();
    var D = window.B5DROPS;
    if(D && D.items) D.items.filter(function(it){ return String(it.who).toUpperCase() === String(HQ.who).toUpperCase() && it.date <= t && it.ready !== false; })
      .sort(function(a, b){ return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; })
      .forEach(function(it){ out.push({ id: "a2-" + it.slug, title: it.title, subject: it.subject, href: it.href, chunks: 0, kind: "a2" }); });
    var C = window.EGWCAT;
    if(C && C.acts){
      var by = {}, order = [];
      C.acts.forEach(function(a){ if(a.kind) return; if(!by[a.subject]){ by[a.subject] = []; order.push(a.subject); } by[a.subject].push(a); });
      var more = true, k = 0;
      while(more){
        more = false;
        order.forEach(function(s){ var a = by[s][k]; if(a){ more = true; out.push({ id: a.id, title: a.title, subject: s, href: (C.href ? C.href(a.id) : HQ.base + a.id + ".html"), chunks: (a.chunks || []).length, kind: "hq" }); } });
        k++;
      }
    }
    out.forEach(function(x){
      var s = summary(x.id);
      x.finished = !!(s && s.finished);
      x.chunks = (s && s.chunks) || x.chunks || 0;
      x.done = (s && s.chunksDone) || 0;
      x.started = !!s && !x.finished;
      var at = 1;
      if(s && s.chunkStates){ for(var i = 0; i < s.chunkStates.length; i++){ if(s.chunkStates[i] !== "done"){ at = i + 1; break; } at = i + 2; } }
      x.at = Math.min(at, Math.max(x.chunks, 1));
      x.go = withParam(x.href, "path", "1") + (x.started || x.done ? "#chunk-" + x.at : "");
    });
    return out;
  });
}
/* started ones first (in path order), then the first not yet finished */
function next(skip){
  return list().then(function(all){
    var left = all.filter(function(x){ return !x.finished && x.id !== skip; });
    var started = left.filter(function(x){ return x.started; });
    return { item: started[0] || left[0] || null, all: all, done: all.filter(function(x){ return x.finished; }).length };
  });
}

/* ---------- the Start button on the HQ home ---------- */
var css = document.createElement("style");
css.textContent =
  ".hp-wrap{margin:18px 0 6px;display:flex;flex-direction:column;gap:8px;max-width:620px}" +
  ".hp-go{display:flex;align-items:center;gap:16px;width:100%;text-align:left;cursor:pointer;text-decoration:none;" +
    "padding:16px 20px;border-radius:var(--r,18px);border:3px solid var(--moon,#fff);background:var(--sun,#ffd23f);color:#141a33;" +
    "box-shadow:0 7px 0 rgba(0,0,0,.45);font-family:var(--display,Arial,sans-serif);transition:transform .12s}" +
  ".hp-go:hover{transform:translateY(-2px)}" +
  ".hp-go:active{transform:translateY(3px);box-shadow:0 3px 0 rgba(0,0,0,.45)}" +
  ".hp-go .hp-play{flex:none;width:58px;height:58px;border-radius:50%;background:#141a33;display:flex;align-items:center;justify-content:center}" +
  ".hp-go .hp-play svg{width:26px;height:26px;margin-left:4px}" +
  ".hp-go b{display:block;font-size:1.9rem;line-height:1;font-weight:800}" +
  ".hp-go small{display:block;font-family:var(--body,Verdana,sans-serif);font-size:1rem;margin-top:5px;font-weight:400;opacity:.9}" +
  ".hp-meta{display:flex;align-items:center;gap:10px;color:var(--mist,#ccc);font-size:.9rem}" +
  ".hp-bar{flex:1;height:8px;border-radius:99px;background:rgba(255,255,255,.14);overflow:hidden;max-width:240px}" +
  ".hp-bar span{display:block;height:100%;background:var(--sun,#ffd23f);border-radius:99px}" +
  ".hp-meta button{font:inherit;background:none;border:0;color:var(--moon,#fff);text-decoration:underline;cursor:pointer;padding:2px}" +
  ".hp-list{margin:4px 0 0;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:var(--moon,#fff)}" +
  ".hp-list ol{margin:0;padding-left:22px;font-size:.92rem;line-height:1.7}" +
  ".hp-list li.fin{opacity:.55;text-decoration:line-through}" +
  ".hp-list li.now{font-weight:700;color:var(--sun,#ffd23f)}" +
  "@media (prefers-reduced-motion:reduce){.hp-go{transition:none}}";
document.head.appendChild(css);

var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3l16 9-16 9z" fill="#ffd23f"/></svg>';
function button(host){
  if(!host) return;
  var wrap = document.createElement("div"); wrap.className = "hp-wrap";
  wrap.innerHTML = '<a class="hp-go" href="#" aria-live="polite"><span class="hp-play">' + PLAY + '</span><span><b>Start</b><small>Finding your next step...</small></span></a>' +
    '<div class="hp-meta"></div>';
  host.appendChild(wrap);
  var go = wrap.querySelector(".hp-go"), meta = wrap.querySelector(".hp-meta");
  var guest = window.B5Site && window.B5Site.guest;
  next().then(function(r){
    var it = r.item, n = r.all.length;
    if(!n){ wrap.remove(); return; }
    if(!it){
      go.href = HQ.base;
      go.querySelector("b").textContent = "All done";
      go.querySelector("small").textContent = "Every step on your path is finished. Anything below is still there to enjoy.";
    } else {
      go.href = it.go;
      var mood = null; try{ var h = JSON.parse(localStorage.getItem(HQ.prefix + "hq.v1") || "null"); if(h && h.mood && h.mood.d === today()) mood = h.mood.w; }catch(e){}
      var small = (mood === "storm" || mood === "grey") ? " Just one chunk today is plenty." : "";
      go.querySelector("b").textContent = it.started ? "Carry on" : (r.done ? "Next step" : "Start");
      var line = it.title + (it.chunks ? ", chunk " + it.at + " of " + it.chunks : "");
      go.querySelector("small").textContent = line + (/[.?!]$/.test(line) ? "" : ".") + small;
    }
    var pct = n ? Math.round(r.done / n * 100) : 0;
    meta.innerHTML = '<span>Step ' + Math.min(r.done + 1, n) + ' of ' + n + '</span><span class="hp-bar"><span style="width:' + pct + '%"></span></span><button type="button">See the whole path</button>';
    meta.querySelector("button").onclick = function(){
      var l = wrap.querySelector(".hp-list");
      if(l){ l.remove(); this.textContent = "See the whole path"; return; }
      l = document.createElement("div"); l.className = "hp-list";
      l.innerHTML = '<ol>' + r.all.map(function(x){ return '<li class="' + (x.finished ? "fin" : (it && x.id === it.id ? "now" : "")) + '">' + esc(x.title) + '</li>'; }).join("") + '</ol>';
      wrap.appendChild(l); this.textContent = "Hide the path";
    };
    if(guest) go.querySelector("small").textContent = "In guest mode this shows the student's next step.";
  });
}

window.HQPath = { list: list, next: next, button: button };
})();
