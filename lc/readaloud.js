/* ==========================================================
   LC's Night Shift HQ - read it to me
   A speaker button in the corner of every LC page. Turn it on and
   tapping any bit of text (a question, a paragraph, a label) reads
   it out loud in the device's own voice. Tap again to stop. It
   never gets in the way of buttons, links or typing boxes.
   Loaded by /lc/jumpscare.js, so it is on LC's pages only.
   Saves { on } in b5.lc.read.v1 on this device. ASCII only.
   ========================================================== */
(function(){
"use strict";
if(window.LCRead) return;
var synth = window.speechSynthesis;
if(!synth || !window.SpeechSynthesisUtterance) return;
var KEY = "b5.lc.read.v1";
var on = false;
try{ on = !!(JSON.parse(localStorage.getItem(KEY) || "{}").on); }catch(e){}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify({ on: on })); }catch(e){} }

var css = document.createElement("style");
css.textContent =
  "html body>.lcr-btn{position:fixed !important;z-index:2147482500 !important;left:14px;bottom:14px}" +
  ".lcr-btn{display:flex;align-items:center;gap:8px;padding:10px 14px 10px 10px;border-radius:999px;border:2px solid #c9f7d8;background:#0e1a1c;color:#c9f7d8;font:700 .95rem/1 var(--display,'Space Mono',monospace);cursor:pointer;box-shadow:0 4px 0 rgba(0,0,0,.4)}" +
  ".lcr-btn[aria-pressed=true]{background:#c9f7d8;color:#0e0f0b}" +
  ".lcr-btn svg{width:22px;height:22px}" +
  "body.lcr-on p,body.lcr-on h1,body.lcr-on h2,body.lcr-on h3,body.lcr-on li,body.lcr-on label,body.lcr-on td,body.lcr-on th,body.lcr-on blockquote,body.lcr-on figcaption,body.lcr-on legend,body.lcr-on .lcr-text{cursor:pointer}" +
  ".lcr-speaking{outline:3px dashed #c9f7d8 !important;outline-offset:4px;border-radius:6px}" +
  "html body>.lcr-tip{position:fixed !important;z-index:2147482500 !important;left:14px;bottom:70px}" +
  ".lcr-tip{max-width:260px;padding:10px 12px;border-radius:12px;background:#0e1a1c;color:#c9f7d8;border:2px solid #c9f7d8;font-size:.9rem;line-height:1.35}";
document.head.appendChild(css);

var SPEAK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
var btn, tip, current = null;

function voice(){
  var vs = synth.getVoices() || [];
  return vs.filter(function(v){ return /en-GB/i.test(v.lang); })[0] || vs.filter(function(v){ return /^en/i.test(v.lang); })[0] || null;
}
function stop(){
  synth.cancel();
  if(current){ current.classList.remove("lcr-speaking"); current = null; }
}
function say(text, elm){
  stop();
  text = String(text || "").replace(/\s+/g, " ").trim();
  if(!text) return;
  var u = new SpeechSynthesisUtterance(text.slice(0, 1200));
  var v = voice(); if(v) u.voice = v;
  u.lang = "en-GB"; u.rate = .95;
  if(elm){ current = elm; elm.classList.add("lcr-speaking"); }
  u.onend = u.onerror = function(){ if(current === elm && elm){ elm.classList.remove("lcr-speaking"); current = null; } };
  synth.speak(u);
}

var TEXTY = "p,h1,h2,h3,h4,li,label,td,th,blockquote,figcaption,legend,.lcr-text";
var SKIP = "button,a,input,textarea,select,[contenteditable],.lcr-btn,.lcr-tip,[role=button]";
function onTap(e){
  if(!on) return;
  var t = e.target;
  if(!t || !t.closest) return;
  if(t.closest(SKIP) && !t.closest("label")) return;
  var box = t.closest(TEXTY);
  if(!box) return;
  if(current === box){ stop(); return; }
  /* a label wrapping a radio or checkbox: read its words only */
  say(box.innerText || box.textContent, box);
}

function setOn(v){
  on = v; save();
  document.body.classList.toggle("lcr-on", on);
  btn.setAttribute("aria-pressed", on ? "true" : "false");
  btn.querySelector("span").textContent = on ? "Reading on" : "Read it to me";
  if(!on) stop();
  if(tip){ tip.remove(); tip = null; }
  if(on){
    tip = document.createElement("div"); tip.className = "lcr-tip";
    tip.textContent = "Tap any words on the page and they get read out. Tap them again to stop.";
    document.body.appendChild(tip);
    setTimeout(function(){ if(tip){ tip.remove(); tip = null; } }, 4500);
  }
}

function mount(){
  if(document.querySelector(".lcr-btn")) return;
  btn = document.createElement("button");
  btn.type = "button"; btn.className = "lcr-btn";
  btn.innerHTML = SPEAK + "<span></span>";
  btn.setAttribute("aria-label", "Read it to me: tap any text to hear it");
  btn.addEventListener("click", function(){ setOn(!on); });
  document.body.appendChild(btn);
  document.addEventListener("click", onTap, true);
  document.addEventListener("keydown", function(e){ if(e.key === "Escape") stop(); });
  if(synth.onvoiceschanged !== undefined) synth.onvoiceschanged = function(){};
  setOn(on);
  if(tip){ tip.remove(); tip = null; }
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
window.LCRead = { say: say, stop: stop };
})();
