/* ==========================================================
   Base 5 - My path (the Start button)
   One button on the HQ home that takes a student through all of
   their learning activities in a sensible order, one chunk at a
   time, so there is never a menu to choose from. Jay asked for
   this because too many options at once was making it hard to
   get going.

   The order:
     1. Their core target activities (/data/a2/core.js: the targets
        that need the most focus, always open), taking turns with the
        Autumn 2 activities that have landed in their folder (their
        targets this term), oldest first.
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
    script("/data/a2/drops.js?t=" + today(), function(){ return !!window.B5DROPS; }),
    script("/data/a2/core.js?t=" + today(), function(){ return !!window.B5CORE; })
  ]).then(function(){
    var out = [], t = today(), drops = [], core = coreItems();
    var D = window.B5DROPS;
    if(D && D.items) D.items.filter(function(it){ return String(it.who).toUpperCase() === String(HQ.who).toUpperCase() && it.date <= t && it.ready !== false; })
      .sort(function(a, b){ return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; })
      .forEach(function(it){ drops.push({ id: "a2-" + it.slug, title: it.title, subject: it.subject, href: it.href, chunks: 0, kind: "a2" }); });
    /* core first, taking turns with this term's activities, so the focus stays on core without holding the rest back */
    while(core.length || drops.length){ if(core.length) out.push(core.shift()); if(drops.length) out.push(drops.shift()); }
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
/* this HQ's core target activities, always open */
function coreItems(){
  var C = window.B5CORE, w = String(HQ.who || "").toUpperCase();
  return C && C.items ? C.items.filter(function(it){ return it.ready !== false && (it.who || []).indexOf(w) >= 0; })
    .map(function(it){ return { id: "a2-" + it.slug, title: it.title, subject: it.subject, group: it.group, href: (it.href || {})[w] || HQ.base + "a2-" + it.slug + ".html", chunks: it.chunks || 0, kind: "core" }; }) : [];
}
/* ---------- what is on right now (15 Nov 2026) ----------
   The Start button follows the timetable in /data/term.js, with this
   student's alongside sessions (Horizon) dropped in:
     maths / Maths and English    their next maths (or english) step
     a pillar session              their next drop for that pillar
     Project / GCSE                their project book
     Brain games, CC               the game vault, the CC page
     Breathe in, Breathe out,      something calm (the fidget shelf),
     lunch                         with their next step still a tap away
   Anything else (trips, Forest School, out of hours, weekends) keeps
   the plain path. Test with ?hqtest&pday=mon&ptime=10:50 */
var SESSION_SUBJ = { maths: ["maths"], core: ["maths", "english"], aesthetic: ["aesthetic and creative"],
  physical: ["physical world", "human and social"], pfa: ["preparation for adulthood"], phse: ["relational"], digital: ["digital media"] };
var CALM = { breathein: 1, breatheout: 1, lunch: 1 };
function termReady(){ return script("/data/term.js?v=11", function(){ return !!window.B5TERM; }); }
function testNow(){
  var q = location.search;
  if(!/[?&]hqtest(=|&|$)/.test(q)) return null;
  var t = q.match(/[?&]ptime=(\d{1,2}):?(\d{2})/), dd = (q.match(/[?&]pday=(mon|tue|wed|thu|fri)/) || [])[1];
  if(!t && !dd) return null;
  var hh = t ? +t[1] : 0; if(t && hh < 8) hh += 12;
  return { mins: t ? hh * 60 + +t[2] : null, day: dd || null };
}
function now(){
  var T = window.B5TERM;
  if(!T || !T.slotsFor || !T.weeks) return null;
  var d = new Date(), key = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][d.getDay()], m = d.getHours() * 60 + d.getMinutes();
  var tn = testNow(), wk;
  if(tn){ if(tn.day) key = tn.day; if(tn.mins != null) m = tn.mins; wk = T.currentWeek(); }
  else { var iso = T.iso(d); wk = T.weeks.filter(function(w){ return iso >= w.start && iso <= w.end; })[0]; }
  if(!wk || T.dayKeys.indexOf(key) < 0 || ((wk.days || {})[key] || {}).off) return null;
  var slots = T.slotsFor(key, String(HQ.who || "").toUpperCase(), wk) || [];
  for(var i = 0; i < slots.length; i++){
    var s = slots[i];
    if(m >= T.mins(s[0]) && m < T.mins(s[1])){
      var ses = T.session(s[2], wk, key) || {};
      return { key: s[2], start: s[0], end: s[1], title: ses.title || s[2] };
    }
  }
  return null;
}
/* started ones first (in path order), then the first not yet finished;
   in a session with a subject, the first of that subject if there is one */
function next(skip){
  return Promise.all([list(), termReady()]).then(function(r){
    var all = r[0];
    var left = all.filter(function(x){ return !x.finished && x.id !== skip; });
    var started = left.filter(function(x){ return x.started; });
    var n = null; try{ n = now(); }catch(e){}
    var want = n && SESSION_SUBJ[n.key], item = null;
    if(want){
      var fits = function(x){ return want.indexOf(String(x.subject || "").toLowerCase()) >= 0; };
      item = started.filter(fits)[0] || left.filter(fits)[0] || null;
    }
    var plain = started[0] || left[0] || null;
    return { item: item || plain, plain: plain, matched: !!item, now: n, all: all, done: all.filter(function(x){ return x.finished; }).length };
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
  ".hp-core{margin:18px 0 0;max-width:620px;padding:14px 16px 12px;border-radius:var(--r,18px);background:rgba(255,210,63,.12);border:2px solid var(--sun,#ffd23f);color:var(--moon,#fff)}" +
  ".hp-core h2{margin:0 0 2px;font-family:var(--display,Arial,sans-serif);font-size:1.25rem;display:flex;align-items:center;gap:8px}" +
  ".hp-core h2 svg{width:20px;height:20px;flex:none}" +
  ".hp-core p{margin:0 0 10px;font-size:.92rem;opacity:.9}" +
  ".hp-core .hc-list{display:flex;flex-wrap:wrap;gap:8px}" +
  ".hp-core a{display:flex;flex-direction:column;gap:2px;min-width:150px;flex:1 1 150px;padding:9px 12px;border-radius:12px;background:rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.18);color:inherit;text-decoration:none}" +
  ".hp-core a:hover{border-color:var(--sun,#ffd23f)}" +
  ".hp-core a b{font-size:1rem}" +
  ".hp-core a small{font-size:.8rem;opacity:.85}" +
  "@media (prefers-reduced-motion:reduce){.hp-go{transition:none}}";
document.head.appendChild(css);

var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3l16 9-16 9z" fill="#ffd23f"/></svg>';
var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill="#ffd23f" stroke="#141a33" stroke-width="1.2"/></svg>';
function coreCard(host){
  list().then(function(all){
    var mine = all.filter(function(x){ return x.kind === "core"; });
    if(!mine.length) return;
    var box = document.createElement("div"); box.className = "hp-core";
    box.innerHTML = '<h2>' + STAR + 'Core practice</h2><p>The things that matter most for you right now. Open any of them, any time, as often as you like: each go has new questions.</p>' +
      '<div class="hc-list">' + mine.map(function(x){
        var st = x.finished ? "Done. Fancy another go?" : x.done ? x.done + " of " + x.chunks + " chunks" : x.started ? "Started" : (x.group || x.subject);
        return '<a href="' + esc(x.href) + '"><b>' + esc(x.title) + '</b><small>' + esc(st) + '</small></a>';
      }).join("") + '</div>';
    host.parentNode.insertBefore(box, host);
  });
}
function button(host){
  if(!host) return;
  coreCard(host);
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
    if(!guest) session(r, go, wrap);
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

/* the button follows what is on right now (see now() above) */
function session(r, go, wrap){
  var n = r.now, it = r.item;
  if(!n) return;
  var b = go.querySelector("b"), sm = go.querySelector("small");
  var alt = null;   /* the plain next step, one quiet tap away, so it is always their choice */
  var also = function(x){
    x = x || it;
    if(!x) return;
    alt = document.createElement("a");
    alt.className = "hp-alt"; alt.href = x.go;
    alt.textContent = (x.started ? "Or carry on with " : "Or go on to ") + x.title;
    wrap.insertBefore(alt, wrap.querySelector(".hp-meta"));
  };
  if(CALM[n.key]){
    b.textContent = n.key === "lunch" ? "Lunch" : n.title;
    sm.textContent = n.key === "lunch" ? "Go and eat. Nothing here needs you yet." : "Nothing needed right now. Tap for something calm.";
    go.href = "#";
    go.onclick = function(e){
      e.preventDefault();
      if(window.HQFidget) window.HQFidget.open(); else if(window.HQCorner) window.HQCorner.calm();
    };
    also();
  }else if(n.key === "project"){
    b.textContent = "Project time";
    sm.textContent = "Open your project book. It keeps your place.";
    go.href = HQ.base + "project-book.html";
    also();
  }else if(n.key === "brain"){
    b.textContent = "Brain games";
    sm.textContent = "A quick puzzle to wake up. Pick one from the vault.";
    go.href = "/games/";
    also();
  }else if(n.key === "cc"){
    b.textContent = "Cultural calendar";
    sm.textContent = "What the calendar is marking this week.";
    go.href = "/cc/";
    also();
  }else if(r.matched && it){
    b.textContent = n.title.replace(/\s+with\s+\w+$/, "") + " now";
    var line = it.title + (it.chunks ? ", chunk " + it.at + " of " + it.chunks : "");
    sm.textContent = line + (/[.?!]$/.test(line) ? "" : ".");
    if(r.plain && r.plain.id !== it.id) also(r.plain);
  }
}
var css2 = document.createElement("style");
css2.textContent = ".hp-alt{align-self:flex-start;color:var(--moon,#fff);font-size:.95rem;text-decoration:underline;padding:2px 4px;opacity:.9}";
document.head.appendChild(css2);

window.HQPath = { list: list, next: next, button: button, now: now };
})();
