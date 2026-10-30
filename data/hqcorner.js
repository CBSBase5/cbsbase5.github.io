/* ==========================================================
   Base 5 - the HQ corner
   On every page of every student HQ (not Jay's view), loaded by
   /egw/skin.js. One small Menu button in the bottom right corner
   (30 Oct 2026; it used to be a row of buttons) holding Home, Text
   size, Read it to me (LC), and:
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

/* ---------- the dock: one Menu button (30 Oct 2026) ----------
   Home, text size, Park it, Done for now (and LC's Read it to me)
   used to be separate buttons along the bottom, and on a phone they
   sat on top of Start. Now they live behind one small Menu button. */
var MENU = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';
var HOUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v10h4.5v-6h3v6H18V10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></svg>';
var SPEAK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
var AAI = '<svg viewBox="0 0 24 24" aria-hidden="true"><text x="1" y="18" font-family="Arial" font-weight="700" font-size="11" fill="currentColor">A</text><text x="9" y="19" font-family="Arial" font-weight="700" font-size="16" fill="currentColor">A</text></svg>';
var menuBox = null, menuBtn = null;
var mcss = el("style");
mcss.textContent =
  "html body>.b5home{display:none !important}" +
  ".hqc-menu{position:relative}" +
  ".hqc-mbtn{gap:7px;padding:9px 14px 9px 11px}" +
  ".hqc-mbtn .rd{display:none;width:9px;height:9px;border-radius:50%;background:var(--sun,#ffd23f)}" +
  ".hqc-mbtn.reading .rd{display:inline-block}" +
  "@media (max-width:560px){.hqc-mbtn{padding:0;width:46px;height:46px;justify-content:center;font-size:0;gap:0}.hqc-mbtn svg{width:22px;height:22px}.hqc-mbtn .rd{position:absolute;top:4px;right:4px}}" +
  ".hqc-mbtn{position:relative}" +
  "html body>.hqc-mbox{position:fixed !important;z-index:2147482460 !important;right:12px;bottom:64px}" +
  ".hqc-mbox{width:min(270px,calc(100vw - 24px));padding:8px;border-radius:16px;background:#fffdf8;color:#141a33;border:3px solid #141a33;box-shadow:0 10px 30px rgba(0,0,0,.4);font-family:var(--body,'Atkinson Hyperlegible',Verdana,sans-serif)}" +
  ".hqc-mbox a,.hqc-mbox button{display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;padding:10px 10px;border:0;border-radius:10px;background:transparent;color:#141a33;font:inherit;font-weight:700;font-size:.98rem;text-decoration:none;text-align:left;cursor:pointer}" +
  ".hqc-mbox a:hover,.hqc-mbox button:hover,.hqc-mbox a:focus-visible,.hqc-mbox button:focus-visible{background:#f0ece0}" +
  ".hqc-mbox svg{width:20px;height:20px;flex:none}" +
  ".hqc-mbox small{margin-left:auto;font-weight:400;font-size:.82rem;color:#4b5275}" +
  ".hqc-mbox b{display:inline-block;min-width:18px;padding:0 5px;border-radius:99px;background:var(--sun,#ffd23f);color:#141a33;font-size:.75rem;text-align:center;margin-left:auto}";
document.head.appendChild(mcss);

var SIZES = ["Normal", "Bigger", "Biggest"];
function textSize(){ try{ return Math.max(0, Math.min(2, +localStorage.getItem("b5.hqtext.v1") || 0)); }catch(e){ return 0; } }
function homeLink(){
  var base = HQ.base || "/", p = location.pathname;
  var atHome = p === base || p === base + "index.html";
  return atHome ? { href: "/", label: "Base 5 home" } : { href: base, label: "Back to my HQ" };
}
function readBtn(){ return document.querySelector(".lcr-btn"); }
function syncReading(){
  var r = readBtn();
  if(r) r.style.setProperty("display", "none", "important");
  if(menuBtn) menuBtn.classList.toggle("reading", !!(r && r.getAttribute("aria-pressed") === "true"));
}
function closeMenu(){
  if(!menuBox) return;
  menuBox.remove(); menuBox = null;
  menuBtn.setAttribute("aria-expanded", "false");
  document.removeEventListener("click", outside, true);
}
function outside(e){ if(menuBox && !menuBox.contains(e.target) && !menuBtn.contains(e.target)) closeMenu(); }
function openMenu(){
  if(menuBox){ closeMenu(); return; }
  closePark();
  menuBox = el("div", "hqc-mbox"); menuBox.setAttribute("role", "menu"); menuBox.setAttribute("aria-label", "Menu");
  var h = homeLink(), n = load().notes.length, sz = textSize(), r = readBtn();
  var on = r && r.getAttribute("aria-pressed") === "true";
  menuBox.innerHTML =
    (r ? '<button type="button" role="menuitem" data-m="read">' + SPEAK + 'Read it to me<small>' + (on ? "On" : "Off") + '</small></button>' : '') +
    '<a role="menuitem" href="' + esc(h.href) + '">' + HOUSE + esc(h.label) + '</a>' +
    '<button type="button" role="menuitem" data-m="aa">' + AAI + 'Text size<small>' + SIZES[sz] + '</small></button>' +
    '<button type="button" role="menuitem" data-m="park">' + PIN + 'Park it' + (n ? '<b>' + n + '</b>' : '') + '</button>' +
    '<button type="button" role="menuitem" data-m="calm">' + MOON + 'Done for now</button>';
  document.body.appendChild(menuBox);
  menuBtn.setAttribute("aria-expanded", "true");
  [].forEach.call(menuBox.querySelectorAll("button"), function(b){
    b.onclick = function(){
      var m = b.getAttribute("data-m");
      if(m === "aa"){
        var s = (textSize() + 1) % 3;
        try{ localStorage.setItem("b5.hqtext.v1", String(s)); }catch(e){}
        if(s) document.documentElement.setAttribute("data-b5text", String(s)); else document.documentElement.removeAttribute("data-b5text");
        b.querySelector("small").textContent = SIZES[s];
        return;
      }
      if(m === "read"){
        var rb = readBtn(); if(rb) rb.click();
        b.querySelector("small").textContent = rb && rb.getAttribute("aria-pressed") === "true" ? "On" : "Off";
        syncReading();
        return;
      }
      closeMenu();
      if(m === "park") openPark();
      else if(m === "calm") openCalm();
    };
  });
  menuBox.addEventListener("keydown", function(e){ if(e.key === "Escape"){ closeMenu(); menuBtn.focus(); } });
  setTimeout(function(){ document.addEventListener("click", outside, true); }, 0);
  var f = menuBox.querySelector("a,button"); if(f) f.focus();
}
function mount(){
  if(document.querySelector(".hqc-dock")) return;
  dock = el("div", "hqc-dock");
  menuBtn = el("button", "hqc-btn hqc-mbtn", MENU + "Menu" + '<span class="rd" aria-hidden="true"></span>'); menuBtn.type = "button";
  menuBtn.setAttribute("aria-label", "Menu"); menuBtn.setAttribute("aria-haspopup", "menu"); menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.onclick = openMenu;
  parkBtn = menuBtn;   /* Park it hands focus back here when it closes */
  dock.appendChild(menuBtn);
  document.body.appendChild(dock);
  syncReading(); setTimeout(syncReading, 800); setTimeout(syncReading, 2500);
  if(window.MutationObserver) new MutationObserver(syncReading).observe(document.body, { childList: true, subtree: false, attributes: true, attributeFilter: ["class"] });
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
