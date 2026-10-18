/* ==========================================================
   Base 5 - a clock that explains itself
   The little clock on the home page shows the real time. Tap it
   and a big clock opens that shows, step by step, how you can
   tell what time it is: the short hand for the hour, the long
   hand counted in fives for the minutes, then the two together.

   Use:  <button data-clockhelp> containing an svg with
         .hand-h and .hand-m lines (centre 50,50, pointing up)
         <script src="/data/clockhelp.js?v=1"></script>
   If /data/term.js is on the page, it also says what is next on
   today's timetable and where the hands will be then.
   Saves nothing. ASCII only in this file.
   ========================================================== */
(function(){
"use strict";

var ONES = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
var TENS = ["","","twenty","thirty","forty","fifty"];
function word(n){ return n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : ""); }
function h12(h){ h = h % 12; return h === 0 ? 12 : h; }

/* how you would say it out loud */
function sayIt(h, m){
  var hr = h12(h), nx = h12(h + 1);
  if(m === 0) return word(hr) + " o'clock";
  if(m === 15) return "quarter past " + word(hr);
  if(m === 30) return "half past " + word(hr);
  if(m === 45) return "quarter to " + word(nx);
  if(m < 30) return word(m) + (m === 1 ? " minute" : " minutes") + " past " + word(hr);
  var to = 60 - m;
  return word(to) + (to === 1 ? " minute" : " minutes") + " to " + word(nx);
}

/* ---------- the small clock: real time ---------- */
function setHands(svg, h, m, s){
  var hh = svg.querySelector(".hand-h"), mm = svg.querySelector(".hand-m");
  if(hh) hh.style.transform = "rotate(" + ((h % 12) * 30 + m * .5) + "deg)";
  if(mm) mm.style.transform = "rotate(" + (m * 6 + s * .1) + "deg)";
}

/* ---------- styles for the explainer ---------- */
var css = document.createElement("style");
css.textContent =
  "[data-clockhelp]{background:none;border:0;padding:0;cursor:pointer;position:relative;border-radius:50%}" +
  "[data-clockhelp] .hand{animation:none !important;transform-origin:50px 50px;transition:transform .4s}" +
  "[data-clockhelp]:hover svg{transform:rotate(-6deg) scale(1.06)}" +
  "[data-clockhelp] svg{transition:transform .2s}" +
  "[data-clockhelp] .qtag{position:absolute;right:-6px;bottom:-4px;width:24px;height:24px;border-radius:50%;background:var(--orange,#ef7724);border:2px solid var(--ink,#0a2f38);color:var(--ink,#0a2f38);font:900 14px/20px Arial,sans-serif;text-align:center}" +
  ".ch-back{position:fixed;inset:0;z-index:2147482000;background:rgba(10,47,56,.55);display:flex;align-items:center;justify-content:center;padding:14px}" +
  ".ch{position:relative;width:min(960px,100%);max-height:100%;overflow:auto;background:var(--paper,#f7f2e9);color:var(--ink,#0a2f38);border:3px solid var(--ink,#0a2f38);border-radius:26px 20px 24px 18px;box-shadow:9px 11px 0 var(--ink,#0a2f38);padding:22px;display:grid;grid-template-columns:minmax(260px,380px) 1fr;gap:22px;align-items:start}" +
  ".ch-x{position:absolute;top:12px;right:12px;font:800 .82rem var(--display,Arial,sans-serif);letter-spacing:.08em;text-transform:uppercase;border:3px solid var(--ink,#0a2f38);background:var(--white,#fffdf8);border-radius:999px;padding:8px 14px;cursor:pointer;color:inherit}" +
  ".ch-big{width:100%;height:auto;display:block}" +
  ".ch-digital{font-family:var(--display,Arial,sans-serif);font-variation-settings:'wdth' 120,'wght' 900;font-size:clamp(2.6rem,7vw,4rem);line-height:1;margin:0}" +
  ".ch-say{font-size:1.15rem;margin:6px 0 16px;font-weight:700}" +
  ".ch-step{display:block;width:100%;text-align:left;font:inherit;color:inherit;cursor:pointer;border:3px solid var(--ink,#0a2f38);border-radius:18px;padding:12px 14px;margin:0 0 10px;background:var(--white,#fffdf8);box-shadow:3px 4px 0 rgba(10,47,56,.16)}" +
  ".ch-step[aria-pressed=true]{box-shadow:5px 6px 0 var(--ink,#0a2f38)}" +
  ".ch-step b{display:block;font-family:var(--display,Arial,sans-serif);font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;margin-bottom:4px}" +
  ".ch-step.s1{border-left:12px solid #007291}.ch-step.s2{border-left:12px solid #ef7724}.ch-step.s3{border-left:12px solid #7b4b8f}" +
  ".ch-fives{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}" +
  ".ch-fives span{min-width:34px;text-align:center;padding:3px 6px;border-radius:999px;border:2px solid #ef7724;font-weight:800;font-size:.9rem}" +
  ".ch-fives span.on{background:#ef7724;color:#0a2f38}" +
  ".ch-fives span.extra{border-style:dashed}" +
  ".ch-next{margin:6px 0 0;padding:12px 14px;border-radius:16px;border:3px dashed var(--teal,#007291);font-size:.95rem}" +
  ".ch-hint{font-size:.85rem;color:var(--body-tint,#3d5b64);margin:10px 0 0}" +
  "@media (max-width:720px){.ch{grid-template-columns:1fr;padding-top:64px}.ch-big{max-width:320px;margin:0 auto}}";
document.head.appendChild(css);

/* ---------- the big clock ---------- */
function bigClock(){
  var s = '<svg class="ch-big" viewBox="0 0 400 400" role="img" aria-label="A clock showing the time now">';
  s += '<circle cx="200" cy="200" r="190" fill="#fffdf8" stroke="#0a2f38" stroke-width="8"/>';
  /* where the hour hand lives: the gap between two hour numbers */
  s += '<path id="chHourWedge" fill="rgba(0,114,145,.18)"/>';
  /* how far the minute hand has come round from the top */
  s += '<path id="chMinArc" fill="rgba(239,119,36,.22)"/>';
  for(var i = 0; i < 60; i++){
    var a = i * 6 * Math.PI / 180, big = i % 5 === 0;
    var r1 = big ? 160 : 168, r2 = 178;
    s += '<line x1="' + (200 + Math.sin(a) * r1).toFixed(1) + '" y1="' + (200 - Math.cos(a) * r1).toFixed(1) + '" x2="' + (200 + Math.sin(a) * r2).toFixed(1) + '" y2="' + (200 - Math.cos(a) * r2).toFixed(1) + '" stroke="#0a2f38" stroke-width="' + (big ? 4 : 1.6) + '" class="tick" data-i="' + i + '"/>';
  }
  for(var n = 1; n <= 12; n++){
    var b = n * 30 * Math.PI / 180;
    s += '<text x="' + (200 + Math.sin(b) * 128).toFixed(1) + '" y="' + (200 - Math.cos(b) * 128 + 12).toFixed(1) + '" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="34" fill="#0a2f38" class="hnum" data-n="' + n + '">' + n + '</text>';
    /* the minutes each number stands for, small and orange, just inside the ticks */
    var mins = n === 12 ? "00" : String(n * 5);
    s += '<text x="' + (200 + Math.sin(b) * 148).toFixed(1) + '" y="' + (200 - Math.cos(b) * 148 + 5).toFixed(1) + '" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="13" fill="#d75f10" class="mnum">' + mins + '</text>';
  }
  s += '<line id="chH" x1="200" y1="200" x2="200" y2="105" stroke="#007291" stroke-width="14" stroke-linecap="round"/>';
  s += '<line id="chM" x1="200" y1="200" x2="200" y2="40" stroke="#ef7724" stroke-width="8" stroke-linecap="round"/>';
  s += '<circle cx="200" cy="200" r="11" fill="#0a2f38"/>';
  s += '</svg>';
  return s;
}
function wedge(fromDeg, toDeg, r){
  function pt(d){ var a = d * Math.PI / 180; return (200 + Math.sin(a) * r).toFixed(1) + " " + (200 - Math.cos(a) * r).toFixed(1); }
  var sweep = ((toDeg - fromDeg) % 360 + 360) % 360;
  if(sweep < .5) return "";
  return "M200 200 L" + pt(fromDeg) + " A" + r + " " + r + " 0 " + (sweep > 180 ? 1 : 0) + " 1 " + pt(toDeg) + " Z";
}

/* ---------- what is next on today's timetable ---------- */
function nextUp(now){
  var T = window.B5TERM;
  if(!T || !T.timetable) return null;
  var iso = T.iso(now);
  var key = ["sun","mon","tue","wed","thu","fri","sat"][now.getDay()];
  var wk = (T.weeks || []).filter(function(w){ return iso >= w.start && iso <= w.end; })[0];
  if(!wk || !T.timetable[key] || ((wk.days || {})[key] || {}).off) return null;
  var mins = now.getHours() * 60 + now.getMinutes();
  var slot = T.timetable[key].filter(function(s){ return T.mins(s[0]) > mins; })[0];
  if(!slot) return null;
  var ses = T.session ? T.session(slot[2], wk) : { title: slot[2] };
  var p = slot[0].split(":");
  var hh = +p[0], mm = +p[1];
  return { title: ses.title, time: slot[0], hh: hh, mm: mm };
}
function handsAt(hh, mm){
  var hr = h12(hh), nx = h12(hh + 1);
  var shortH = mm === 0 ? "on the " + hr : mm <= 20 ? "just past the " + hr : mm <= 40 ? "about halfway between the " + hr + " and the " + nx : "nearly at the " + nx;
  var longH = mm === 0 ? "on the 12" : mm % 5 === 0 ? "on the " + (mm / 5) : (mm % 5) + " little marks past the " + (Math.floor(mm / 5) || 12);
  return "the short hand " + shortH + " and the long hand " + longH;
}

/* ---------- the explainer ---------- */
var back = null, tick = null, focusBack = null, hl = "all";

function open(){
  focusBack = document.activeElement;
  back = document.createElement("div"); back.className = "ch-back";
  back.innerHTML =
    '<div class="ch" role="dialog" aria-modal="true" aria-label="How to read the clock">' +
      '<button class="ch-x" type="button">Close</button>' +
      '<div>' + bigClock() + '<p class="ch-hint">Tap a step to light up that part of the clock. Tap it again to see everything.</p></div>' +
      '<div>' +
        '<p class="ch-digital" id="chDig"></p>' +
        '<p class="ch-say" id="chSay"></p>' +
        '<button class="ch-step s1" type="button" data-hl="hour" aria-pressed="false"><b>1. The short, fat hand is the hour</b><span id="chS1"></span></button>' +
        '<button class="ch-step s2" type="button" data-hl="min" aria-pressed="false"><b>2. The long hand is the minutes</b><span id="chS2"></span><div class="ch-fives" id="chFives"></div></button>' +
        '<button class="ch-step s3" type="button" data-hl="all" aria-pressed="false"><b>3. Put them together</b><span id="chS3"></span></button>' +
        '<div class="ch-next" id="chNext" hidden></div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(back);
  back.addEventListener("click", function(e){ if(e.target === back) close(); });
  back.querySelector(".ch-x").addEventListener("click", close);
  back.addEventListener("keydown", function(e){ if(e.key === "Escape") close(); });
  back.querySelectorAll(".ch-step").forEach(function(b){
    b.addEventListener("click", function(){ hl = (hl === b.dataset.hl && hl !== "all") ? "all" : b.dataset.hl; paint(); });
  });
  hl = "all";
  paint();
  tick = setInterval(paint, 1000);
  back.querySelector(".ch-x").focus();
}
function close(){
  if(!back) return;
  clearInterval(tick); back.remove(); back = null;
  if(focusBack && focusBack.focus) focusBack.focus();
}

function paint(){
  if(!back) return;
  var now = new Date(), h = now.getHours(), m = now.getMinutes();
  var hr = h12(h), nx = h12(h + 1), fives = Math.floor(m / 5), extra = m % 5;
  var hDeg = (h % 12) * 30 + m * .5, mDeg = m * 6;
  var $ = function(id){ return back.querySelector("#" + id); };

  $("chH").setAttribute("transform", "rotate(" + hDeg + " 200 200)");
  $("chM").setAttribute("transform", "rotate(" + mDeg + " 200 200)");
  $("chHourWedge").setAttribute("d", m === 0 ? "" : wedge((hr % 12) * 30, (hr % 12) * 30 + 30, 190));
  $("chMinArc").setAttribute("d", wedge(0, mDeg, 176));

  /* light up just the part being talked about */
  var showH = hl === "all" || hl === "hour", showM = hl === "all" || hl === "min";
  $("chH").style.opacity = showH ? 1 : .15;
  $("chHourWedge").style.opacity = showH ? 1 : 0;
  $("chM").style.opacity = showM ? 1 : .15;
  $("chMinArc").style.opacity = showM ? 1 : 0;
  back.querySelectorAll(".mnum").forEach(function(t){ t.style.opacity = showM ? 1 : .15; });
  back.querySelectorAll(".hnum").forEach(function(t){
    var n = +t.getAttribute("data-n");
    t.setAttribute("fill", showH && (n === hr || (m > 0 && n === nx)) ? "#007291" : "#0a2f38");
    t.style.opacity = showH ? 1 : .3;
  });
  back.querySelectorAll(".ch-step").forEach(function(b){ b.setAttribute("aria-pressed", b.dataset.hl === hl ? "true" : "false"); });

  $("chDig").textContent = hr + ":" + ("0" + m).slice(-2);
  var plain = m === 0 ? word(hr) + " o'clock" : word(hr) + " " + (m < 10 ? "oh " + word(m) : word(m));
  var spoken = sayIt(h, m);
  $("chSay").textContent = "Say it: " + plain + (spoken !== plain ? ", or " + spoken : "") + ".";

  $("chS1").textContent = m === 0
    ? "It is pointing right at the " + hr + ", so the hour is " + hr + "."
    : "It is somewhere between the " + hr + " and the " + nx + ". It has gone past the " + hr + " but not reached the " + nx + " yet, so the hour is still " + hr + ".";

  var s2;
  if(m === 0) s2 = "It is pointing straight up at the 12. That means no minutes yet: exactly on the hour.";
  else if(fives === 0) s2 = "It has only just left the 12. Each little mark is one minute. Count the marks: " + m + ".";
  else s2 = "Each number on the clock is worth 5 minutes. Count in fives from the 12 to the long hand" +
    (extra ? ", then add on the little marks, one minute each." : ".") + " That makes " + m + ".";
  $("chS2").textContent = s2;
  var fv = "";
  for(var i = 1; i <= Math.max(fives, 0); i++) fv += '<span class="on">' + (i * 5) + "</span>";
  for(var j = 1; j <= extra; j++) fv += '<span class="on extra">' + (fives * 5 + j) + "</span>";
  $("chFives").innerHTML = fv;

  var s3 = "Hour " + hr + ", " + m + (m === 1 ? " minute" : " minutes") + ". Written down, that is " + hr + ":" + ("0" + m).slice(-2) + ".";
  if(m > 30) s3 += " After half past, people often count the minutes left until the next hour instead: " + (60 - m) + " to " + nx + ".";
  $("chS3").textContent = s3;

  var nu = nextUp(now), box = $("chNext");
  if(nu){
    box.hidden = false;
    box.textContent = "Next on today's timetable: " + nu.title + " at " + nu.time + ". That is when the clock has " + handsAt(nu.hh, nu.mm) + ".";
  } else box.hidden = true;
}

/* ---------- start ---------- */
function init(){
  document.querySelectorAll("[data-clockhelp]").forEach(function(btn){
    var svg = btn.querySelector("svg");
    if(!btn.querySelector(".qtag")){ var q = document.createElement("span"); q.className = "qtag"; q.setAttribute("aria-hidden", "true"); q.textContent = "?"; btn.appendChild(q); }
    function upd(){ var d = new Date(); setHands(svg, d.getHours(), d.getMinutes(), d.getSeconds()); btn.setAttribute("aria-label", "The time is " + sayIt(d.getHours(), d.getMinutes()) + ". Tap to see how to read the clock."); }
    upd(); setInterval(upd, 10000);
    btn.addEventListener("click", open);
  });
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();

window.ClockHelp = { open: open, sayIt: sayIt };
})();
