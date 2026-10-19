/* ==========================================================
   Base 5 - the HQ corner
   On every page of every student HQ (not Jay's view), loaded by
   /egw/skin.js. Two small buttons in the bottom right corner:
     Park it        a notepad for the thought that will not go
                    away. Notes stay on this device until ticked
                    off, and can be sent to Jay if the student likes.
     Done for now   saves nothing new (everything already saves as
                    it goes) and shows a calm screen with nothing to
                    do and no questions, until they tap Back.
   Also the fidget shelf: window.HQFidget.open() shows bubble wrap,
   a spinner and a squishy blob. The home page offers it on Stormy
   days. Nothing here is earned, timed or counted.
   Saves { notes: [{ t, at }] } in <prefix>park.v1. ASCII only.
   ========================================================== */
(function(){
"use strict";
if(window.HQCorner) return;
var HQ = window.HQ || { prefix: "b5.egw.", who: "EGW" };
var KEY = HQ.prefix + "park.v1";
var RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

function el(tag, cls, html){ var e = document.createElement(tag); if(cls) e.className = cls; if(html != null) e.innerHTML = html; return e; }
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function load(){ try{ var d = JSON.parse(localStorage.getItem(KEY) || "null"); if(d && d.notes) return d; }catch(e){} return { notes: [] }; }
function save(d){ try{ localStorage.setItem(KEY, JSON.stringify(d)); }catch(e){} }

var css = el("style");
css.textContent =
  "html body>.hqc-dock{position:fixed !important;z-index:2147482400 !important;right:12px;bottom:12px}" +
  ".hqc-dock{display:flex;gap:8px}" +
  ".hqc-btn{display:inline-flex;align-items:center;gap:6px;font-family:var(--display,Arial,sans-serif);font-weight:700;font-size:.86rem;padding:8px 12px;border-radius:999px;border:2px solid rgba(201,205,240,.45);background:var(--night-2,#1b2240);color:var(--moon,#eef0ff);cursor:pointer;box-shadow:0 4px 0 rgba(0,0,0,.35)}" +
  ".hqc-btn:hover{filter:brightness(1.15)}" +
  ".hqc-aa{gap:1px;padding:8px 11px}" +
  ".hqc-aa i{display:inline-flex;flex-direction:column-reverse;gap:2px;margin-left:5px}" +
  ".hqc-aa u{display:block;width:4px;height:4px;border-radius:1px;background:currentColor;opacity:.3;text-decoration:none}" +
  ".hqc-aa u.on{opacity:1}" +
  ".hqc-btn svg{width:18px;height:18px}" +
  ".hqc-btn b{display:inline-block;min-width:18px;padding:0 5px;border-radius:99px;background:var(--sun,#ffd23f);color:var(--ink,#141a33);font-size:.75rem;text-align:center}" +
  "html body>.hqc-park{position:fixed !important;z-index:2147482450 !important;right:12px;bottom:62px}" +
  ".hqc-park{width:min(340px,calc(100vw - 24px));max-height:70vh;overflow:auto;padding:14px;border-radius:16px;background:#fffdf8;color:#141a33;border:3px solid #141a33;box-shadow:0 10px 30px rgba(0,0,0,.4);font-family:var(--body,'Atkinson Hyperlegible',Verdana,sans-serif)}" +
  ".hqc-park h3{margin:0 0 4px;font-family:var(--display,Arial,sans-serif);font-size:1.15rem}" +
  ".hqc-park p{margin:0 0 10px;font-size:.88rem;color:#4b5275}" +
  ".hqc-park textarea{width:100%;font:inherit;border:2px solid #141a33;border-radius:10px;padding:8px 10px;resize:vertical;min-height:60px}" +
  ".hqc-row{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 0}" +
  ".hqc-row button{font-family:var(--display,Arial,sans-serif);font-weight:700;font-size:.88rem;padding:7px 12px;border-radius:10px;border:2px solid #141a33;background:#fff;color:#141a33;cursor:pointer}" +
  ".hqc-row button.main{background:var(--sun,#ffd23f)}" +
  ".hqc-notes{list-style:none;margin:10px 0 0;padding:0}" +
  ".hqc-notes li{display:flex;gap:8px;align-items:flex-start;padding:7px 0;border-top:1px dashed #c9cdf0;font-size:.95rem}" +
  ".hqc-notes li span{flex:1;white-space:pre-wrap}" +
  ".hqc-notes li button{font:inherit;font-size:.78rem;border:2px solid #141a33;border-radius:8px;background:#fff;cursor:pointer;padding:2px 8px}" +
  ".hqc-park .sendbox{margin:12px 0 0;max-width:none;box-shadow:none;padding:12px}" +
  "html body>.hqc-calm{position:fixed !important;z-index:2147483640 !important;inset:0}" +
  ".hqc-calm{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center;padding:24px;color:#eef0ff;background:linear-gradient(160deg,#141a46,#262f57,#1d4150);background-size:300% 300%;font-family:var(--body,'Atkinson Hyperlegible',Verdana,sans-serif)}" +
  ".hqc-calm h2{font-family:var(--display,Arial,sans-serif);font-size:clamp(1.8rem,5vw,2.6rem);margin:0}" +
  ".hqc-calm p{margin:0;font-size:1.1rem;opacity:.85;max-width:34ch}" +
  ".hqc-calm .orb{width:120px;height:120px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff6cf,#ffd23f 45%,rgba(255,210,63,.1) 70%)}" +
  ".hqc-calm button{margin-top:18px;font-family:var(--display,Arial,sans-serif);font-weight:700;font-size:.95rem;padding:9px 18px;border-radius:999px;border:2px solid rgba(238,240,255,.5);background:transparent;color:#eef0ff;cursor:pointer}" +
  "@media (prefers-reduced-motion:no-preference){.hqc-calm{animation:hqcdrift 24s ease-in-out infinite alternate}.hqc-calm .orb{animation:hqcbreathe 8s ease-in-out infinite}}" +
  "@keyframes hqcdrift{from{background-position:0% 50%}to{background-position:100% 50%}}" +
  "@keyframes hqcbreathe{0%,100%{transform:scale(.8);opacity:.7}50%{transform:scale(1.1);opacity:1}}" +
  /* fidget shelf */
  "html body>.hqc-fid{position:fixed !important;z-index:2147483600 !important;inset:0}" +
  ".hqc-fid{display:flex;align-items:center;justify-content:center;padding:14px;background:rgba(0,0,0,.6)}" +
  ".hqc-fbox{width:min(560px,100%);max-height:100%;overflow:auto;background:#fffdf8;color:#141a33;border-radius:20px;border:3px solid #141a33;padding:16px;font-family:var(--body,'Atkinson Hyperlegible',Verdana,sans-serif)}" +
  ".hqc-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 12px}" +
  ".hqc-tabs button{font-family:var(--display,Arial,sans-serif);font-weight:700;padding:8px 14px;border-radius:999px;border:2px solid #141a33;background:#fff;color:#141a33;cursor:pointer}" +
  ".hqc-tabs button[aria-selected=true]{background:var(--sun,#ffd23f)}" +
  ".hqc-tabs .x{margin-left:auto}" +
  ".hqc-wrap{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;touch-action:manipulation}" +
  ".hqc-bub{aspect-ratio:1;border-radius:50%;border:0;cursor:pointer;background:radial-gradient(circle at 35% 30%,#ffffff,#cfe8ff 45%,#9cc7ef);box-shadow:inset -3px -4px 6px rgba(0,0,0,.12)}" +
  ".hqc-bub.p{background:#e3edf7;box-shadow:inset 2px 3px 5px rgba(0,0,0,.18);transform:scale(.9)}" +
  ".hqc-fbox canvas{display:block;width:100%;max-width:360px;height:auto;margin:0 auto;touch-action:none;cursor:grab}";
document.head.appendChild(css);

/* ---------- little sounds, only after a tap ---------- */
var AC = null;
function pop(f){
  try{
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    var o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime;
    o.type = "triangle"; o.frequency.setValueAtTime(f || 520, t); o.frequency.exponentialRampToValueAtTime(90, t + .08);
    g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.0001, t + .1);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + .12);
  }catch(e){}
}

var PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14v18l-7-4-7 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
var MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" fill="currentColor"/></svg>';

var dock, parkBtn, park = null;

/* ---------- park it ---------- */
function count(){ var b = parkBtn && parkBtn.querySelector("b"); var n = load().notes.length; if(b){ b.textContent = n; b.style.display = n ? "" : "none"; } }
function drawPark(){
  var d = load();
  park.innerHTML =
    '<h3>Park it</h3><p>Something in your head that is not this? Park it here and come back to it later.</p>' +
    '<textarea id="hqcNew" placeholder="Ask about the trip, song idea, anything"></textarea>' +
    '<div class="hqc-row"><button class="main" type="button" id="hqcAdd">Park it</button><button type="button" id="hqcClose">Close</button></div>' +
    (d.notes.length ? '<ul class="hqc-notes">' + d.notes.map(function(n, i){ return '<li><span>' + esc(n.t) + '</span><button type="button" data-i="' + i + '">Done</button></li>'; }).join("") + '</ul>' : "") +
    '<div id="hqcSend"></div>';
  var box = park.querySelector("#hqcNew");
  park.querySelector("#hqcAdd").onclick = function(){
    var v = box.value.trim(); if(!v) { box.focus(); return; }
    var dd = load(); dd.notes.unshift({ t: v.slice(0, 500), at: new Date().toISOString() }); save(dd); count(); drawPark();
    park.querySelector("#hqcNew").focus();
  };
  park.querySelector("#hqcClose").onclick = closePark;
  [].forEach.call(park.querySelectorAll(".hqc-notes button"), function(b){
    b.onclick = function(){ var dd = load(); dd.notes.splice(+b.dataset.i, 1); save(dd); count(); drawPark(); };
  });
  if(d.notes.length) withSend(function(){
    window.Base5Send.mount(park.querySelector("#hqcSend"), { tool: "Parked notes", filename: "parked", getText: function(){
      return "Things I parked:\n\n" + load().notes.map(function(n){ return "- " + n.t; }).join("\n");
    }});
  });
  box.focus();
}
function withSend(fn){
  if(window.Base5Send) return fn();
  var s = document.createElement("script"); s.src = "/data/send.js?v=1"; s.onload = fn; document.head.appendChild(s);
}
function openPark(){
  if(park){ closePark(); return; }
  park = el("div", "hqc-park"); park.setAttribute("role", "dialog"); park.setAttribute("aria-label", "Park it");
  document.body.appendChild(park);
  park.addEventListener("keydown", function(e){ if(e.key === "Escape") closePark(); });
  drawPark();
}
function closePark(){ if(park){ park.remove(); park = null; if(parkBtn) parkBtn.focus(); } }

/* ---------- done for now ---------- */
function openCalm(){
  closePark();
  var c = el("div", "hqc-calm");
  c.setAttribute("role", "dialog"); c.setAttribute("aria-modal", "true"); c.setAttribute("aria-label", "Done for now");
  c.innerHTML = '<div class="orb" aria-hidden="true"></div><h2>Done for now.</h2><p>Everything is saved. There is nothing to do here, and nobody will ask you anything.</p><button type="button">Back</button>';
  var prev = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";
  document.body.appendChild(c);
  function onKey(e){ if(e.key === "Escape") close(); }
  function close(){ document.removeEventListener("keydown", onKey); c.remove(); document.documentElement.style.overflow = prev; }
  c.querySelector("button").onclick = close;
  document.addEventListener("keydown", onKey);
  c.querySelector("button").focus();
}

/* ---------- the fidget shelf ---------- */
function openFidget(){
  var back = el("div", "hqc-fid"), box = el("div", "hqc-fbox");
  box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Fidget shelf");
  var tabs = el("div", "hqc-tabs"), area = el("div");
  [["wrap", "Bubble wrap"], ["spin", "Spinner"], ["blob", "Squish"]].forEach(function(t, i){
    var b = el("button", "", t[1]); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", i ? "false" : "true");
    b.onclick = function(){ [].forEach.call(tabs.querySelectorAll("[role=tab]"), function(x){ x.setAttribute("aria-selected", x === b ? "true" : "false"); }); show(t[0]); };
    tabs.appendChild(b);
  });
  var x = el("button", "x", "Close"); x.type = "button"; tabs.appendChild(x);
  box.appendChild(tabs); box.appendChild(area); back.appendChild(box); document.body.appendChild(back);
  var stopAnim = null;
  function onKey(e){ if(e.key === "Escape") close(); }
  function close(){ if(stopAnim) stopAnim(); document.removeEventListener("keydown", onKey); back.remove(); }
  x.onclick = close;
  back.addEventListener("click", function(e){ if(e.target === back) close(); });
  document.addEventListener("keydown", onKey);

  function show(kind){
    if(stopAnim){ stopAnim(); stopAnim = null; }
    area.innerHTML = "";
    if(kind === "wrap"){
      var g = el("div", "hqc-wrap");
      for(var i = 0; i < 48; i++){
        var b = el("button", "hqc-bub"); b.type = "button"; b.setAttribute("aria-label", "Bubble");
        b.onclick = function(){ if(this.classList.contains("p")) return; this.classList.add("p"); pop(380 + Math.random() * 300); if(!g.querySelector(".hqc-bub:not(.p)")) setTimeout(function(){ [].forEach.call(g.children, function(k){ k.classList.remove("p"); }); }, 600); };
        g.appendChild(b);
      }
      area.appendChild(g);
      area.appendChild(el("p", "", "<small>Pop them all and a fresh sheet appears.</small>"));
    }
    if(kind === "spin" || kind === "blob"){
      var cv = el("canvas"); cv.width = 360; cv.height = 360; area.appendChild(cv);
      area.appendChild(el("p", "", kind === "spin" ? "<small>Drag round to spin it. Let go and it keeps going.</small>" : "<small>Press and hold, or drag it about.</small>"));
      var cx = cv.getContext("2d"), raf = 0, ang = 0, vel = RM ? 0 : .02, down = false, lastA = 0, px = 180, py = 180, squish = 0;
      function pos(e){ var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * 360 / r.width, (e.clientY - r.top) * 360 / r.height]; }
      cv.addEventListener("pointerdown", function(e){ down = true; cv.setPointerCapture(e.pointerId); var p = pos(e); lastA = Math.atan2(p[1] - 180, p[0] - 180); px = p[0]; py = p[1]; });
      cv.addEventListener("pointermove", function(e){
        if(!down) return; var p = pos(e);
        if(kind === "spin"){ var a = Math.atan2(p[1] - 180, p[0] - 180), d = a - lastA; if(d > Math.PI) d -= 2 * Math.PI; if(d < -Math.PI) d += 2 * Math.PI; ang += d; vel = d; lastA = a; }
        else { px = p[0]; py = p[1]; }
      });
      cv.addEventListener("pointerup", function(){ down = false; });
      cv.addEventListener("pointercancel", function(){ down = false; });
      function frame(){
        cx.clearRect(0, 0, 360, 360);
        if(kind === "spin"){
          if(!down){ ang += vel; vel *= .985; }
          cx.save(); cx.translate(180, 180); cx.rotate(ang);
          var cols = ["#ff5d5d", "#ffd23f", "#19c39a"];
          for(var k = 0; k < 3; k++){
            cx.rotate(Math.PI * 2 / 3);
            cx.fillStyle = cols[k]; cx.beginPath(); cx.arc(0, -95, 52, 0, 7); cx.fill();
            cx.fillStyle = "#141a33"; cx.beginPath(); cx.arc(0, -95, 20, 0, 7); cx.fill();
            cx.fillStyle = "#3a5cff"; cx.fillRect(-18, -95, 36, 95);
          }
          cx.fillStyle = "#141a33"; cx.beginPath(); cx.arc(0, 0, 34, 0, 7); cx.fill();
          cx.fillStyle = "#eef0ff"; cx.beginPath(); cx.arc(0, 0, 14, 0, 7); cx.fill();
          cx.restore();
        } else {
          squish += ((down ? 1 : 0) - squish) * .15;
          var t = Date.now() / 600, cxp = down ? px : 180 + (px - 180) * .9, cyp = down ? py : 180 + (py - 180) * .9;
          if(!down){ px = cxp; py = cyp; }
          cx.save(); cx.translate(180, 200);
          var sx = 1 + squish * .35 + (RM ? 0 : Math.sin(t) * .02), sy = 1 - squish * .3 + (RM ? 0 : Math.cos(t) * .02);
          cx.scale(sx, sy);
          var gr = cx.createRadialGradient(-30, -40, 10, 0, 0, 120); gr.addColorStop(0, "#ffd9e6"); gr.addColorStop(1, "#ff7aa8");
          cx.fillStyle = gr; cx.beginPath();
          for(var j = 0; j <= 32; j++){
            var a2 = j / 32 * Math.PI * 2, dx = Math.cos(a2), dy = Math.sin(a2);
            var pull = down ? Math.max(0, (dx * (px - 180) + dy * (py - 200)) / 120) * 22 : 0;
            var r = 110 + pull + (RM ? 0 : Math.sin(a2 * 3 + t) * 3);
            if(j === 0) cx.moveTo(dx * r, dy * r); else cx.lineTo(dx * r, dy * r);
          }
          cx.closePath(); cx.fill();
          cx.fillStyle = "#141a33"; cx.beginPath(); cx.arc(-32, -18, 8, 0, 7); cx.arc(32, -18, 8, 0, 7); cx.fill();
          cx.strokeStyle = "#141a33"; cx.lineWidth = 4; cx.beginPath(); cx.arc(0, 8, 18, .2, Math.PI - .2); cx.stroke();
          cx.restore();
        }
        raf = requestAnimationFrame(frame);
      }
      frame();
      stopAnim = function(){ cancelAnimationFrame(raf); };
    }
  }
  show("wrap");
  tabs.querySelector("button").focus();
}

/* ---------- the dock ---------- */
function mount(){
  if(document.querySelector(".hqc-dock")) return;
  dock = el("div", "hqc-dock");
  parkBtn = el("button", "hqc-btn", PIN + "Park it <b></b>"); parkBtn.type = "button";
  parkBtn.setAttribute("aria-label", "Park a thought for later");
  parkBtn.onclick = openPark;
  var done = el("button", "hqc-btn", MOON + "Done for now"); done.type = "button";
  done.onclick = openCalm;
  /* text size: normal, bigger, biggest, for every HQ on this device (applied early by /egw/skin.js) */
  var SIZES = ["Normal text", "Bigger text", "Biggest text"];
  var size = 0;
  try{ size = Math.max(0, Math.min(2, +localStorage.getItem("b5.hqtext.v1") || 0)); }catch(e){}
  var aa = el("button", "hqc-btn hqc-aa", ""); aa.type = "button";
  function drawAa(){
    aa.innerHTML = '<span aria-hidden="true" style="font-size:.8em">A</span><span aria-hidden="true" style="font-size:1.15em;margin-left:-2px">A</span>' +
      '<i aria-hidden="true">' + [0, 1, 2].map(function(i){ return '<u class="' + (i <= size ? "on" : "") + '"></u>'; }).join("") + '</i>';
    aa.setAttribute("aria-label", SIZES[size] + ". Tap to change the text size.");
    aa.title = SIZES[size];
  }
  aa.onclick = function(){
    size = (size + 1) % 3;
    try{ localStorage.setItem("b5.hqtext.v1", String(size)); }catch(e){}
    if(size) document.documentElement.setAttribute("data-b5text", String(size)); else document.documentElement.removeAttribute("data-b5text");
    drawAa();
  };
  drawAa();
  dock.appendChild(aa);
  dock.appendChild(parkBtn); dock.appendChild(done);
  document.body.appendChild(dock);
  count();
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();

/* Shout-outs from Jay (sent from the live view). Private: they show
   only on this student's own HQ, once, until "Thanks" is tapped. */
var STICK = { star: "\u2B50", rocket: "\uD83D\uDE80", fire: "\uD83D\uDD25", trophy: "\uD83C\uDFC6", heart: "\uD83D\uDC9A", fish: "\uD83C\uDFA3", ball: "\u26BD", music: "\uD83C\uDFB5" };
function shoutouts(){
  var S = window.B5Site;
  if(!S || !S.call || S.guest || !S.syncUrl || !S.hq || S.bridgeDown()) return;
  try{ if(sessionStorage.getItem("b5.shout.asked")) return; sessionStorage.setItem("b5.shout.asked", "1"); }catch(e){}
  S.call("shoutouts", { who: S.hq }).then(function(o){
    if(!o || !o.ok || !o.items || !o.items.length) return;
    var items = o.items.slice(), st = el("style");
    st.textContent = "html body>.hqc-shout{position:fixed !important;z-index:2147482500 !important;left:50%;top:18px;transform:translateX(-50%)}" +
      ".hqc-shout{width:min(420px,calc(100vw - 32px));box-sizing:border-box;padding:18px 20px;border-radius:20px;background:var(--night-2,#1b2240);color:var(--moon,#eef0ff);border:2px solid rgba(201,205,240,.45);box-shadow:0 10px 0 rgba(0,0,0,.3);font-family:var(--body,Arial,sans-serif);text-align:center}" +
      ".hqc-shout .st{font-size:2.6rem;line-height:1;display:block;margin:0 0 6px}" +
      ".hqc-shout small{display:block;opacity:.8;font-size:.82rem;margin:0 0 6px}" +
      ".hqc-shout p{margin:0 0 14px;font-size:1.08rem;line-height:1.4}" +
      ".hqc-shout button{font:inherit;font-weight:700;padding:8px 20px;border-radius:999px;border:2px solid currentColor;background:transparent;color:inherit;cursor:pointer}" +
      "@media (prefers-reduced-motion:no-preference){.hqc-shout{animation:hqcShout .35s ease-out}@keyframes hqcShout{from{opacity:0;transform:translate(-50%,-14px)}}}";
    document.head.appendChild(st);
    function next(){
      var x = items.shift(); if(!x) return;
      var card = el("div", "hqc-shout");
      card.setAttribute("role", "status");
      card.innerHTML = '<span class="st" aria-hidden="true">' + (STICK[x.sticker] || STICK.star) + '</span><small>A shout-out from Jay</small><p>' + esc(x.text) + '</p><button type="button">Thanks</button>';
      card.querySelector("button").onclick = function(){
        card.remove();
        S.call("shoutseen", { who: S.hq, row: x.row }).catch(function(){});
        setTimeout(next, 300);
      };
      document.body.appendChild(card);
    }
    next();
  }).catch(function(){});
}
setTimeout(shoutouts, 1800);
window.HQCorner = { park: openPark, calm: openCalm };
window.HQFidget = { open: openFidget };
})();
