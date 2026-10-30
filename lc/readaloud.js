/* ==========================================================
   LC's Night Shift HQ - read it to me
   A speaker button in the corner of every LC page. Turn it on and
   tapping any bit of text (a question, a paragraph, a label) reads
   it out loud in the device's own voice. Tap again to stop.
   Tapping a question reads it with its choices; tapping a choice or
   any other button reads its words and still does its job. Links
   and typing boxes are left alone. If nothing has started speaking
   after a few seconds, a small tip says what to check.
   Loaded by /lc/jumpscare.js, so it is on LC's pages only.
   Saves { on } in b5.lc.read.v1 on this device. The speaking is
   done by /data/b5speak.js. ASCII only.
   ========================================================== */
(function(){
"use strict";
if(window.LCRead) return;
var synth = window.speechSynthesis;
if(!synth || !window.SpeechSynthesisUtterance) return;
/* the speaking itself is done by /data/b5speak.js (sturdier on school Chromebooks) */
if(!window.B5Speak && !document.querySelector('script[src^="/data/b5speak.js"]')){
  var sp = document.createElement("script"); sp.src = "/data/b5speak.js?v=2"; (document.head || document.documentElement).appendChild(sp);
}
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
  "body.lcr-on .prompt,body.lcr-on .kicker,body.lcr-on small,body.lcr-on summary,body.lcr-on span{cursor:pointer}" +
  ".lcr-tip{max-width:260px;padding:10px 12px;border-radius:12px;background:#0e1a1c;color:#c9f7d8;border:2px solid #c9f7d8;font-size:.9rem;line-height:1.35}";
document.head.appendChild(css);

var SPEAK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
var btn, tip, current = null, waitTimer = null;

function stop(){
  if(waitTimer){ clearTimeout(waitTimer); waitTimer = null; }
  if(window.B5Speak) window.B5Speak.stop(); else try{ synth.cancel(); }catch(e){}
  if(current){ current.classList.remove("lcr-speaking"); current = null; }
}
function say(text, elm){
  stop();
  text = String(text || "").replace(/\s+/g, " ").trim();
  if(!text) return;
  if(elm){ current = elm; elm.classList.add("lcr-speaking"); }
  var started = false;
  var done = function(){ if(waitTimer){ clearTimeout(waitTimer); waitTimer = null; } if(elm && current === elm){ elm.classList.remove("lcr-speaking"); current = null; } };
  /* nothing heard after a few seconds: say what to check, once */
  waitTimer = setTimeout(function(){ waitTimer = null; if(!started) showTip("No sound? Check the volume is turned up. If it still says nothing, tell Jay: this device might be blocking the voice.", 7000); }, 3500);
  if(window.B5Speak){ window.B5Speak.say(text, { onstart: function(){ started = true; }, onend: done }); return; }
  /* b5speak.js not loaded yet: plain speech */
  var u = new SpeechSynthesisUtterance(text.slice(0, 1200));
  u.lang = "en-GB"; u.rate = .95; u.onstart = function(){ started = true; }; u.onend = u.onerror = done;
  say.last = u; synth.speak(u);
}

var TEXTY = "p,h1,h2,h3,h4,h5,li,label,td,th,dt,dd,blockquote,figcaption,legend,summary,caption,.prompt,.lcr-text";
var LEAVE = "a,input,textarea,select,option,[contenteditable],.lcr-btn,.lcr-tip";
function words(el){
  var c = el.cloneNode(true);
  [].forEach.call(c.querySelectorAll("svg,script,style,.readme,.lcr-btn,[aria-hidden=true]"), function(x){ x.remove(); });
  /* a gap between blocks, so the sentence after a question is not run into it */
  [].forEach.call(c.querySelectorAll("div,p,li,br,h1,h2,h3,h4,blockquote,figcaption,td,th,dd,dt"), function(x){ x.insertBefore(document.createTextNode(" "), x.firstChild); x.appendChild(document.createTextNode(" ")); });
  return (c.innerText || c.textContent || "").replace(/\s+/g, " ").trim();
}
/* the nearest thing with words of its own: a block of text, or a short span */
function boxFor(t){
  /* anywhere in a question that has choices: the whole question */
  var pr = t.closest(".prompt");
  if(pr && pr.parentElement && pr.parentElement.querySelector(".choices")) return pr;
  var box = t.closest(TEXTY);
  if(box) return box;
  for(var el = t, i = 0; el && el !== document.body && i < 4; el = el.parentElement, i++){
    var own = [].some.call(el.childNodes, function(n){ return n.nodeType === 3 && n.nodeValue.trim().length > 1; });
    if(own && words(el).length < 600) return el;
  }
  return null;
}
/* a question's choices, so they are read after it */
function choicesAfter(box){
  if(!box.classList.contains("prompt")) return "";
  var host = box.parentElement, list = host && host.querySelector(".choices");
  if(!list) return "";
  var labels = [].map.call(list.querySelectorAll("button,label"), words).filter(Boolean);
  return labels.length ? " Your choices. " + labels.join(". ") + "." : "";
}
function onTap(e){
  if(!on) return;
  var t = e.target;
  if(!t || !t.closest || t.closest(LEAVE)) return;
  /* a button: read its words, and let it do its job as normal */
  var b = t.closest("button,[role=button]");
  if(b){ var bw = words(b); if(bw && bw.length < 300 && !b.classList.contains("readme")) say(bw, b); return; }
  var box = boxFor(t);
  if(!box) return;
  if(current === box){ stop(); return; }
  say(words(box) + choicesAfter(box), box);
}

function showTip(text, ms){
  if(tip){ tip.remove(); tip = null; }
  tip = document.createElement("div"); tip.className = "lcr-tip"; tip.setAttribute("role", "status");
  tip.textContent = text;
  document.body.appendChild(tip);
  var mine = tip;
  setTimeout(function(){ if(tip === mine){ tip.remove(); tip = null; } }, ms || 4500);
}

function setOn(v){
  on = v; save();
  document.body.classList.toggle("lcr-on", on);
  btn.setAttribute("aria-pressed", on ? "true" : "false");
  btn.querySelector("span").textContent = on ? "Reading on" : "Read it to me";
  if(!on) stop();
  if(tip){ tip.remove(); tip = null; }
  if(on) showTip("Tap any words on the page and they get read out, questions with their choices. Tap them again to stop.", 4500);
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
  setOn(on);
  if(tip){ tip.remove(); tip = null; }
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
window.LCRead = { say: say, stop: stop };
})();
