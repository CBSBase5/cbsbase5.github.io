/* ==========================================================
   Base 5 - HQ home page extras
   Two cards that sit under the hello on every student HQ home:
     1. Pick up where you left off: the last activity touched
        that is not finished, with one tap back into the right
        chunk.
     2. Your week: what got tried this week, ready on Fridays as
        a postcard to save as a picture or send to Jay. Nothing
        on it is marked or compared with anyone.
   Reads window.HQ (prefix, base, who) and EGWCAT from the HQ's
   catalogue. Saves a weekly starting point in <prefix>postcard.v1
   so the week's numbers can be worked out.
   Load on the HQ home page after the catalogue:
     <script src="/data/hqextras.js?v=1"></script>
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
var HQ = window.HQ || { who: "EGW", prefix: "b5.egw.", base: "/egw/" };
var CAT = window.EGWCAT;
if(!CAT || !CAT.acts) return;
var P = HQ.prefix;
var SKIP = /^(hq|review|daily|swipe|bonnie|sent|skin|biscuits|look|mood|checkin|dunk|stack|break|crossy|penalty|showstopper|scare|postcard|read)\b/;

function read(k){ try{ return JSON.parse(localStorage.getItem(k) || "null"); }catch(e){ return null; } }
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function el(tag, cls, html){ var e = document.createElement(tag); if(cls) e.className = cls; if(html != null) e.innerHTML = html; return e; }

var ACTS = CAT.acts.concat(CAT.extras || []);

/* ---------- styles: the HQ's own colours via its CSS variables ---------- */
var css = el("style");
css.textContent =
  ".hqx{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin:18px 0 6px}" +
  ".hqx-card{display:flex;flex-direction:column;gap:6px;padding:16px 18px;border-radius:16px;border:2px solid rgba(201,205,240,.3);background:rgba(255,255,255,.06);color:var(--moon,#eef0ff);text-decoration:none}" +
  "a.hqx-card:hover,.hqx-card button:hover{filter:brightness(1.08)}" +
  ".hqx-k{font-family:var(--display,Arial,sans-serif);font-weight:700;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;opacity:.75}" +
  ".hqx-t{font-family:var(--display,Arial,sans-serif);font-weight:700;font-size:1.2rem;line-height:1.15}" +
  ".hqx-s{font-size:.92rem;opacity:.85;margin:0}" +
  ".hqx-bar{height:8px;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden;margin-top:4px}" +
  ".hqx-bar i{display:block;height:100%;background:var(--sun,#ffd23f);border-radius:99px}" +
  ".hqx-go{align-self:flex-start;margin-top:6px;font-family:var(--display,Arial,sans-serif);font-weight:700;font-size:.95rem;padding:8px 14px;border-radius:12px;border:2px solid var(--ink,#141a33);background:var(--sun,#ffd23f);color:var(--ink,#141a33);cursor:pointer;text-decoration:none}" +
  ".hqx-card.fri{border-color:var(--sun,#ffd23f);box-shadow:0 0 0 2px var(--sun,#ffd23f) inset}" +
  ".hqx-nums{display:flex;gap:16px;flex-wrap:wrap;margin:2px 0 0}" +
  ".hqx-nums b{display:block;font-family:var(--display,Arial,sans-serif);font-size:1.5rem;line-height:1}" +
  ".hqx-nums span{font-size:.78rem;opacity:.75}" +
  "html body>.hqx-back{position:fixed !important;z-index:2147483600 !important;inset:0}" +
  ".hqx-back{display:flex;align-items:center;justify-content:center;padding:14px;background:rgba(0,0,0,.6)}" +
  ".hqx-modal{width:min(560px,100%);max-height:100%;overflow:auto;background:#fffdf8;color:#141a33;border-radius:20px;border:3px solid #141a33;padding:16px}" +
  ".hqx-modal canvas{display:block;width:100%;height:auto;border-radius:12px}" +
  ".hqx-row{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 0}" +
  ".hqx-row button{font-family:var(--display,Arial,sans-serif);font-weight:700;font-size:.95rem;padding:9px 14px;border-radius:12px;border:2px solid #141a33;background:#fff;color:#141a33;cursor:pointer}" +
  ".hqx-row button.main{background:var(--sun,#ffd23f)}" +
  ".hqx-modal .sendbox{margin:14px 0 0;max-width:none}";
document.head.appendChild(css);

/* ---------- 1. pick up where you left off ---------- */
function resumeCard(){
  var best = null;
  ACTS.forEach(function(a){
    var st = read(P + a.id + ".v1");
    if(!st || !st.summary || !st.updated) return;
    var s = st.summary;
    if(s.finished || !s.chunks || s.chunksDone >= s.chunks) return;
    if(!best || st.updated > best.st.updated) best = { a: a, st: st };
  });
  if(!best) return null;
  var s = best.st.summary, states = s.chunkStates || [];
  var n = 1;
  for(var i = 0; i < states.length; i++){ if(states[i] !== "done"){ n = i + 1; break; } }
  var name = (s.chunkNames || [])[n - 1] || (best.a.chunks || [])[n - 1] || "";
  var pct = Math.round(100 * (s.chunksDone || 0) / s.chunks);
  var href = CAT.href ? CAT.href(best.a.id, n) : HQ.base + best.a.id + ".html";
  var c = el("a", "hqx-card");
  c.href = href;
  c.innerHTML =
    '<span class="hqx-k">Pick up where you left off</span>' +
    '<span class="hqx-t">' + esc(best.a.title) + '</span>' +
    '<p class="hqx-s">Chunk ' + n + ' of ' + s.chunks + (name ? ': ' + esc(name) : '') + '</p>' +
    '<div class="hqx-bar" aria-hidden="true"><i style="width:' + pct + '%"></i></div>' +
    '<span class="hqx-go">Carry on</span>';
  return c;
}

/* ---------- 2. your week ---------- */
function monday(d){ var m = new Date(d); m.setHours(0, 0, 0, 0); m.setDate(m.getDate() - ((m.getDay() + 6) % 7)); return m; }
function iso(d){ return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }

function sparksNow(){
  var n = 0;
  try{
    for(var i = 0; i < localStorage.length; i++){
      var k = localStorage.key(i);
      if(!k || k.indexOf(P) !== 0 || SKIP.test(k.slice(P.length))) continue;
      var o = read(k);
      if(o && o.summary && isFinite(o.summary.sparks)) n += Math.max(0, o.summary.sparks);
    }
    var dd = read(P + "daily.v1");
    if(dd && dd.days) for(var d in dd.days){ var r = dd.days[d] && dd.days[d].r; n += r === "right1" ? 10 : r === "right2" ? 6 : r ? 3 : 0; }
  }catch(e){}
  return n;
}
function chunksNow(){
  var m = {};
  ACTS.forEach(function(a){ var st = read(P + a.id + ".v1"); if(st && st.summary) m[a.id] = st.summary.chunksDone || 0; });
  return m;
}

/* the start of the week is noted the first time the HQ is opened that week */
function weekBase(){
  var wk = iso(monday(new Date()));
  var b = read(P + "postcard.v1");
  if(!b || b.week !== wk){
    b = { week: wk, sparks: sparksNow(), chunks: chunksNow() };
    try{ localStorage.setItem(P + "postcard.v1", JSON.stringify(b)); }catch(e){}
  }
  return b;
}

function weekStats(){
  var b = weekBase(), start = b.week, now = chunksNow();
  var chunks = 0, touched = [];
  ACTS.forEach(function(a){
    var st = read(P + a.id + ".v1");
    if(st && st.updated && st.updated.slice(0, 10) >= start) touched.push(a.title);
    chunks += Math.max(0, (now[a.id] || 0) - ((b.chunks || {})[a.id] || 0));
  });
  var dd = read(P + "daily.v1") || { days: {} }, daily = 0;
  for(var d in (dd.days || {})) if(d >= start) daily++;
  var sent = read(P + "sent.v1") || {}, sends = 0;
  (sent.log || []).forEach(function(x){ if(x.t && x.t.slice(0, 10) >= start) sends++; });
  return { sparks: Math.max(0, sparksNow() - (b.sparks || 0)), chunks: chunks, touched: touched, daily: daily, sends: sends, start: start };
}

function weekCard(){
  var w = weekStats(), fri = new Date().getDay() === 5;
  var c = el("div", "hqx-card" + (fri ? " fri" : ""));
  c.innerHTML =
    '<span class="hqx-k">' + (fri ? 'Your Friday postcard is ready' : 'Your week so far') + '</span>' +
    '<div class="hqx-nums">' +
      '<div><b>' + w.sparks + '</b><span>sparks</span></div>' +
      '<div><b>' + w.chunks + '</b><span>chunks finished</span></div>' +
      '<div><b>' + w.touched.length + '</b><span>activities tried</span></div>' +
    '</div>' +
    '<p class="hqx-s">' + (w.sparks || w.touched.length ? 'Nothing on here is marked.' : 'A fresh week. Anything you try shows up here.') + '</p>';
  var b = el("button", "hqx-go", fri ? "Open my postcard" : "Make my postcard");
  b.type = "button";
  b.addEventListener("click", function(){ openPostcard(weekStats()); });
  c.appendChild(b);
  return c;
}

/* ---------- the postcard itself, drawn so it can be saved ---------- */
function cssVar(n, f){ var v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || f; }

function drawPostcard(cv, w){
  var W = 1000, H = 640, x = cv.getContext("2d");
  cv.width = W; cv.height = H;
  var night = cssVar("--night", "#11162b"), sun = cssVar("--sun", "#ffd23f"), moon = cssVar("--moon", "#eef0ff"), coral = cssVar("--coral", "#ff5d5d");
  x.fillStyle = night; x.fillRect(0, 0, W, H);
  for(var i = 0; i < 70; i++){ x.globalAlpha = .2 + Math.random() * .6; x.fillStyle = moon; x.beginPath(); x.arc(Math.random() * W, Math.random() * H * .5, Math.random() * 2 + .5, 0, 7); x.fill(); }
  x.globalAlpha = 1;
  /* stamp */
  x.strokeStyle = sun; x.lineWidth = 4; x.setLineDash([8, 6]); x.strokeRect(W - 190, 36, 150, 120); x.setLineDash([]);
  x.fillStyle = sun; x.font = "800 30px Arial,sans-serif"; x.textAlign = "center"; x.fillText(HQ.who || "", W - 115, 96);
  x.font = "700 14px Arial,sans-serif"; x.fillText("BASE 5", W - 115, 122);
  /* heading */
  x.textAlign = "left"; x.fillStyle = moon;
  x.font = "800 22px Arial,sans-serif"; x.fillText("A POSTCARD FROM THE WEEK OF " + w.start.split("-").reverse().join("/"), 50, 70);
  x.font = "900 56px Arial,sans-serif"; x.fillStyle = sun; x.fillText("My week", 50, 135);
  /* numbers */
  var nums = [[w.sparks, "sparks"], [w.chunks, "chunks finished"], [w.daily, "daily drops"], [w.sends, "sent to Jay"]];
  nums.forEach(function(n, i){
    var bx = 50 + i * 230;
    x.fillStyle = "rgba(255,255,255,.08)"; roundRect(x, bx, 190, 200, 120, 18); x.fill();
    x.fillStyle = i % 2 ? coral : sun; x.font = "900 54px Arial,sans-serif"; x.fillText(String(n[0]), bx + 20, 262);
    x.fillStyle = moon; x.font = "700 18px Arial,sans-serif"; x.fillText(n[1], bx + 20, 292);
  });
  /* what was tried */
  x.fillStyle = moon; x.font = "800 20px Arial,sans-serif"; x.fillText("WHAT I HAD A GO AT", 50, 370);
  x.font = "600 22px Arial,sans-serif";
  var list = w.touched.length ? w.touched.slice(0, 8) : ["A quiet week. That is allowed."];
  list.forEach(function(t, i){ var col = i < 4 ? 0 : 1; x.fillText("- " + t, 50 + col * 470, 410 + (i % 4) * 36); });
  x.fillStyle = "rgba(238,240,255,.6)"; x.font = "600 16px Arial,sans-serif";
  x.fillText("Nothing on this card is marked.", 50, H - 30);
}
function roundRect(x, a, b, w, h, r){ x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }

function openPostcard(w){
  var back = el("div", "hqx-back"), m = el("div", "hqx-modal");
  m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); m.setAttribute("aria-label", "My week postcard");
  var cv = el("canvas"); cv.setAttribute("role", "img"); cv.setAttribute("aria-label", "Postcard: " + w.sparks + " sparks, " + w.chunks + " chunks finished this week");
  m.appendChild(cv); drawPostcard(cv, w);
  var row = el("div", "hqx-row");
  var save = el("button", "main", "Save as a picture"); save.type = "button";
  save.addEventListener("click", function(){ var a = document.createElement("a"); a.download = (HQ.who || "my").toLowerCase() + "-week-" + w.start + ".png"; a.href = cv.toDataURL("image/png"); document.body.appendChild(a); a.click(); a.remove(); });
  var close = el("button", "", "Close"); close.type = "button";
  close.addEventListener("click", function(){ back.remove(); });
  row.appendChild(save); row.appendChild(close); m.appendChild(row);
  var sendHost = el("div"); m.appendChild(sendHost);
  if(window.Base5Send) window.Base5Send.mount(sendHost, { tool: "My week postcard", filename: "postcard", getText: function(){
    return ["My week, starting " + w.start, "", "Sparks: " + w.sparks, "Chunks finished: " + w.chunks, "Daily drops: " + w.daily, "Sent to Jay: " + w.sends, "", "What I had a go at:"].concat(w.touched.length ? w.touched.map(function(t){ return "- " + t; }) : ["- a quiet week"]).join("\n");
  }});
  back.appendChild(m); document.body.appendChild(back);
  back.addEventListener("click", function(e){ if(e.target === back) back.remove(); });
  back.addEventListener("keydown", function(e){ if(e.key === "Escape") back.remove(); });
  save.focus();
}

/* ---------- put them on the page ---------- */
function mount(){
  var hero = document.querySelector(".hero");
  if(!hero || document.querySelector(".hqx")) return;
  var box = el("div", "hqx");
  var r = resumeCard(); if(r) box.appendChild(r);
  box.appendChild(weekCard());
  hero.parentNode.insertBefore(box, hero.nextSibling);
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
