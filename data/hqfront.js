/* ==========================================================
   Base 5 - the HQ front door (30 Oct 2026)
   Jay found the HQ home too much on first open. Now it opens on a
   front door: the greeting, Start, their game, a line for anything
   new, and one button to everything else. Everything else is the
   same page as before (nothing was taken away), shown as a second
   view at <HQ>/#rooms, with rooms opening through the term
   (/data/hqrooms.js). The phone's back button goes back to the
   front door.

   News on the front door only shows when there is news:
     a room that has just opened     "New in your HQ: Swipe deck"
     new things in their folder      "2 new things from Jay"
     Fridays                         "Your Friday postcard is ready"

   HQ home pages only, loaded in the head straight after
   /data/b5site.js and /data/hqrooms.js, so nothing flashes up first.
   Saves which new rooms have been seen in <prefix>rooms.seen.v1
   (it follows the student between devices).
   Testing: ?hqtest&rdate=2026-11-13 pretends it is that day.
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(window.HQFront || !window.HQRooms) return;
var R = window.HQRooms, d = document, html = d.documentElement;
var S = window.B5Site || {};
var HQ = window.HQ || {};
var WHO = HQ.who || S.hq || "EGW";
var P = HQ.prefix || S.prefix || R.prefix[WHO] || "b5.egw.";
var BASE = HQ.base || "/" + (WHO === "JT" ? "jt-hq" : WHO.toLowerCase()) + "/";
var TODAY = R.today();
var OVER = R.override(P);
var ROOMS = R.list(WHO).map(function(r){ r.state = R.state(WHO, r.id, OVER, TODAY); return r; });
var SEEN_KEY = P + "rooms.seen.v1";

function readJ(k, f){ try{ var v = JSON.parse(localStorage.getItem(k) || "null"); return v == null ? f : v; }catch(e){ return f; } }
function writeJ(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function el(tag, cls, h){ var e = d.createElement(tag); if(cls) e.className = cls; if(h != null) e.innerHTML = h; return e; }

/* rooms that have opened since the student last looked (never the ones open from day one) */
function fresh(){
  var seen = readJ(SEEN_KEY, {});
  return ROOMS.filter(function(r){ return r.state === "open" && r.from && !seen[r.id]; });
}
function markSeen(){
  var seen = readJ(SEEN_KEY, {}), now = new Date().toISOString(), ch = false;
  ROOMS.forEach(function(r){ if(r.state === "open" && !seen[r.id]){ seen[r.id] = now; ch = true; } });
  if(ch) writeJ(SEEN_KEY, seen);
}
function nextOpen(){
  var up = ROOMS.filter(function(r){ return r.state === "soon"; }).sort(function(a, b){ return a.from < b.from ? -1 : 1; })[0];
  if(!up) return "";
  var p = up.from.split("-"), when = new Date(+p[0], +p[1] - 1, +p[2]), t = TODAY.split("-"), now = new Date(+t[0], +t[1] - 1, +t[2]);
  var days = Math.round((when - now) / 864e5);
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var w = days <= 1 ? "tomorrow" : days < 7 ? "on " + DAYS[when.getDay()] : "on " + DAYS[when.getDay()] + " " + when.getDate() + " " + MON[when.getMonth()];
  return "Something new opens " + w + ".";
}

/* ---------- styles, in the head so nothing flashes ---------- */
var hidden = [];
ROOMS.forEach(function(r){ if(r.state !== "open") hidden = hidden.concat(r.sel); });
var css = el("style");
css.textContent =
  (hidden.length ? hidden.map(function(s){ return "html.fd-on " + s; }).join(",") + "{display:none !important}" : "") +
  "html.fd-front .hero>p:not(.lcn-line),html.fd-front #progress,html.fd-front .hp-core,html.fd-front #fdCore,html.fd-front .hqx," +
  "html.fd-front #checkin,html.fd-front #moodCard,html.fd-front #secTop,html.fd-front #secDice,html.fd-front #secSubjects,html.fd-front #secMore,html.fd-front #fdTop{display:none !important}" +
  "html.fd-rest .hero,html.fd-rest #fdFront{display:none !important}" +
  "html:not(.fd-on) #fdFront,html:not(.fd-on) #fdTop{display:none}" +
  "#fdFront{display:flex;flex-direction:column;gap:10px;max-width:640px;margin:6px 0 34px}" +
  ".fd-news{display:flex;align-items:center;gap:12px;width:100%;box-sizing:border-box;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.07);border:2px solid var(--sun,#ffd23f);color:var(--moon,#eef0ff);text-decoration:none;font:inherit;text-align:left;cursor:pointer}" +
  ".fd-news:hover{background:rgba(255,255,255,.12)}" +
  ".fd-news .ic{width:30px;height:30px;flex:none;display:flex;align-items:center;justify-content:center;border-radius:9px;background:var(--sun,#ffd23f);color:var(--night,#141a33)}" +
  ".fd-news .ic svg{width:20px;height:20px}" +
  ".fd-news b{display:block;font-family:var(--display,Arial,sans-serif);font-size:1.02rem;line-height:1.2}" +
  ".fd-news small{display:block;font-size:.86rem;opacity:.8;margin-top:2px}" +
  ".fd-news .chev,.fd-more .chev{margin-left:auto;font-size:1.4rem;opacity:.7}" +
  ".fd-more{display:flex;align-items:center;gap:12px;width:100%;box-sizing:border-box;padding:14px 16px;border-radius:16px;background:transparent;border:2px solid rgba(201,205,240,.4);color:var(--moon,#eef0ff);font:inherit;text-align:left;cursor:pointer}" +
  ".fd-more:hover{border-color:var(--moon,#eef0ff);background:rgba(255,255,255,.05)}" +
  ".fd-more .ic{width:30px;height:30px;flex:none;opacity:.85}" +
  ".fd-more b{font-family:var(--display,Arial,sans-serif);font-size:1.05rem}" +
  ".fd-more .tag,.fd-tag{display:inline-block;margin-left:8px;padding:1px 8px;border-radius:99px;background:var(--sun,#ffd23f);color:var(--night,#141a33);font-family:var(--display,Arial,sans-serif);font-size:.74rem;font-weight:700;vertical-align:middle;letter-spacing:.02em}" +
  "#fdTop{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:22px 0 18px}" +
  "#fdTop button{display:inline-flex;align-items:center;gap:6px;font-family:var(--display,Arial,sans-serif);font-weight:700;font-size:.95rem;padding:8px 14px 8px 10px;border-radius:999px;border:2px solid rgba(201,205,240,.5);background:transparent;color:var(--moon,#eef0ff);cursor:pointer}" +
  "#fdTop button:hover{border-color:var(--moon,#eef0ff)}" +
  "#fdTop h2{margin:0;font-family:var(--display,Arial,sans-serif);font-size:clamp(1.5rem,4vw,2.1rem);color:var(--moon,#eef0ff)}" +
  "#fdTop p{margin:0;flex-basis:100%;color:var(--mist,#c9cdf0);font-size:.95rem}" +
  ".fd-glow{outline:3px solid var(--sun,#ffd23f) !important;outline-offset:4px;border-radius:14px}" +
  "body{padding-bottom:84px}";
d.head.appendChild(css);

/* ---------- the two views ---------- */
var REST_IDS = /^#(rooms|map|plan|logFold|exams|deviceFold|sendFold|subjects|subjTabs|secSubjects|secDice|secMore|checkin|leadMore|leadDice)$/;
var pushed = false;
function wantRest(){ return REST_IDS.test(location.hash || ""); }
html.classList.add("fd-on", wantRest() ? "fd-rest" : "fd-front");

function setView(rest, focusId){
  html.classList.toggle("fd-rest", rest);
  html.classList.toggle("fd-front", !rest);
  if(rest){ tagNew(); markSeen(); drawFront(); }
  var t = focusId && d.getElementById(focusId);
  if(t && t.scrollIntoView){ try{ t.scrollIntoView({ block: "center" }); }catch(e){ t.scrollIntoView(); } }
  else window.scrollTo(0, 0);
}
function openRest(focusId){
  if(location.hash !== "#rooms"){ pushed = true; location.hash = "rooms"; }
  setView(true, focusId);
}
function backToFront(){
  if(pushed){ pushed = false; history.back(); return; }
  try{ history.replaceState(null, "", location.pathname + location.search); }catch(e){}
  setView(false);
}
window.addEventListener("hashchange", function(){
  var rest = wantRest();
  if(!rest) pushed = false;
  setView(rest, rest && location.hash !== "#rooms" ? location.hash.slice(1) : null);
});

/* new rooms get a small New tag and a glow, for this visit */
var tagged = false;
function tagNew(){
  if(tagged) return; tagged = true;
  fresh().forEach(function(r){
    r.sel.forEach(function(s){
      [].forEach.call(d.querySelectorAll(s), function(e){
        if(e.closest(".hqnav")) return;
        e.classList.add("fd-glow");
        var h = e.querySelector(".lead2, .hqx-k, summary b, b");
        if(h && !h.querySelector(".fd-tag")) h.appendChild(el("span", "fd-tag", "New"));
      });
    });
  });
}

/* ---------- the front door ---------- */
var ICON = {
  door: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 21V4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M3 21h18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="14.5" cy="12.5" r="1.3" fill="currentColor"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" fill="currentColor"/></svg>',
  folder: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H9l2 2h8.5A1.5 1.5 0 0 1 21 9.5v8A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" fill="currentColor"/></svg>',
  card: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor"/><path d="M6 9h6M6 12h4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><rect x="15" y="8" width="4" height="4" rx=".8" fill="#fff"/></svg>',
  rooms: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  back: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
var front, top, core, folderNew = 0;
function news(icon, title, sub, onClick, href){
  var b = el(href ? "a" : "button", "fd-news", '<span class="ic">' + ICON[icon] + '</span><span><b>' + title + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</span><span class="chev" aria-hidden="true">&rsaquo;</span>');
  if(href) b.href = href; else { b.type = "button"; b.onclick = onClick; }
  return b;
}
function drawFront(){
  if(!front) return;
  front.innerHTML = "";
  var nr = fresh(), guest = S.guest;
  if(nr.length){
    var first = nr[0];
    front.appendChild(news("star", nr.length === 1 ? "New in your HQ: " + esc(first.name) : nr.length + " new things in your HQ",
      nr.length === 1 ? "Have a look whenever you like." : nr.map(function(r){ return esc(r.name); }).join(", "),
      function(){ var t = d.querySelector(first.sel[0]); openRest(t && t.id ? t.id : null); if(t && !t.id) setTimeout(function(){ try{ t.scrollIntoView({ block: "center" }); }catch(e){} }, 30); }));
  }
  if(folderNew && !guest) front.appendChild(news("folder", folderNew + " new thing" + (folderNew === 1 ? "" : "s") + " from Jay", "In your folder, just for you.", null, BASE + "folder.html"));
  if(new Date().getDay() === 5 && window.HQExtras && window.HQExtras.postcard)
    front.appendChild(news("card", "Your Friday postcard is ready", "Your week, drawn as a card. Nothing on it is marked.", function(){ window.HQExtras.postcard(); }));
  var open = ROOMS.filter(function(r){ return r.state === "open"; }).length;
  var more = el("button", "fd-more", '<span class="ic">' + ICON.rooms + '</span><span><b>Everything else in my HQ</b>' +
    (nr.length ? '<span class="tag">' + nr.length + ' new</span>' : '') + '</span><span class="chev" aria-hidden="true">&rsaquo;</span>');
  more.type = "button";
  more.setAttribute("aria-label", "Everything else in my HQ" + (nr.length ? ", " + nr.length + " new" : ""));
  more.onclick = function(){ openRest(); };
  front.appendChild(more);
}
function drawTop(){
  var line = nextOpen();
  top.innerHTML = '<button type="button">' + ICON.back + 'Back</button><h2>Everything in your HQ</h2>' + (line ? '<p>' + esc(line) + '</p>' : '');
  top.querySelector("button").onclick = backToFront;
}

/* keep things in order: hero, front door, top bar, core practice, then the rest */
function arrange(){
  var hero = d.querySelector(".hero");
  if(!hero || !hero.parentNode) return;
  if(!front){
    front = el("div"); front.id = "fdFront";
    top = el("div"); top.id = "fdTop";
    core = el("div"); core.id = "fdCore";
    drawFront(); drawTop();
  }
  var after = hero;
  [front, top, core].forEach(function(n){ if(after.nextSibling !== n) after.parentNode.insertBefore(n, after.nextSibling); after = n; });
  var hc = hero.querySelector(".hp-core"); if(hc) core.appendChild(hc);
}
function boot(){
  arrange();
  setTimeout(arrange, 0); setTimeout(arrange, 400); setTimeout(arrange, 1500);
  var hero = d.querySelector(".hero");
  if(hero && window.MutationObserver) new MutationObserver(function(){ if(hero.querySelector(".hp-core")) arrange(); }).observe(hero, { childList: true });
  if(window.B5Folder && window.B5Folder.count && !S.guest) window.B5Folder.count().then(function(n){ folderNew = n || 0; drawFront(); }).catch(function(){});
  setTimeout(drawFront, 300);   /* once the postcard is ready */
  if(wantRest()) setView(true, location.hash !== "#rooms" ? location.hash.slice(1) : null);
}
if(d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot); else boot();

window.HQFront = { rest: openRest, front: backToFront, rooms: ROOMS };
})();
