/* ==========================================================
   Base 5 - one sturdy "read it to me" speaker (29 Oct 2026)
   Used by LC's corner button (/lc/readaloud.js) and the Read it
   to me buttons inside HQ activities (/egw/engine.js).

   Why it exists: on school Chromebooks speech often stayed silent.
   - Chrome's first choice for "en-GB" is Google's online voice,
     which a school network can block, so nothing came out. This
     prefers a voice that lives on the device, and if an online
     voice fails it tries again once with a device voice.
   - Voices load a moment after the page does; speaking before they
     arrive also landed on the online voice. This waits for them
     (up to a second).
   - Chrome can drop speech started straight after cancel(). This
     only cancels when something is playing, and leaves a short gap.
   - Long text can cut out after about 15 seconds. This speaks it a
     sentence or two at a time, and nudges Chrome if it stalls.

     B5Speak.say(text, { onstart, onend })   onend fires once, always
     B5Speak.stop()
     B5Speak.busy()                          true while reading
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(window.B5Speak) return;
var synth = window.speechSynthesis;
var OK = !!(synth && window.SpeechSynthesisUtterance);

var voices = [], ready = false, waiters = [];
function load(){
  try{ voices = synth.getVoices() || []; }catch(e){ voices = []; }
  if(voices.length && !ready){ ready = true; var w = waiters; waiters = []; w.forEach(function(f){ f(); }); }
}
if(OK){
  load();
  try{ synth.addEventListener("voiceschanged", load); }catch(e){ try{ synth.onvoiceschanged = load; }catch(e2){} }
}
function whenVoices(fn){
  if(ready) return fn();
  var fired = false;
  function go(){ if(fired) return; fired = true; fn(); }
  waiters.push(go);
  setTimeout(function(){ load(); go(); }, 1000);
}

/* the best voice: on the device first, British first */
function pick(localOnly){
  var en = voices.filter(function(v){ return /^en/i.test(v.lang); });
  var tests = [
    function(v){ return v.localService && /en[-_]GB/i.test(v.lang); },
    function(v){ return v.localService; }
  ];
  if(!localOnly) tests.push(function(v){ return /en[-_]GB/i.test(v.lang); }, function(){ return true; });
  for(var i = 0; i < tests.length; i++){ var f = en.filter(tests[i])[0]; if(f) return f; }
  return null;
}

/* sentences, joined up to about 180 characters a piece */
function chunks(text){
  var parts = String(text).match(/[^.!?;:]+[.!?;:]*\s*/g) || [String(text)], out = [], cur = "";
  parts.forEach(function(p){
    if((cur + p).length > 180 && cur){ out.push(cur.trim()); cur = ""; }
    while(p.length > 180){ var cut = p.lastIndexOf(" ", 180); if(cut < 60) cut = 180; out.push(p.slice(0, cut).trim()); p = p.slice(cut); }
    cur += p;
  });
  if(cur.trim()) out.push(cur.trim());
  return out.filter(Boolean);
}

var job = 0, live = [], nudge = null, current = null;
function clearNudge(){ if(nudge){ clearInterval(nudge); nudge = null; } }
function finish(j){
  if(!current || current.id !== j) return;
  var cb = current.onend; current = null; live = []; clearNudge();
  if(cb) try{ cb(); }catch(e){}
}

function stop(){
  job++;
  var was = current; current = null; live = []; clearNudge();
  if(OK && (synth.speaking || synth.pending)) try{ synth.cancel(); }catch(e){}
  if(was && was.onend) try{ was.onend(); }catch(e){}
}

function run(j, list, voice, triedLocal){
  if(!current || current.id !== j) return;
  var started = false, i = 0;
  function next(){
    if(!current || current.id !== j) return;
    if(i >= list.length) return finish(j);
    var u = new SpeechSynthesisUtterance(list[i++]);
    live.push(u);   /* keep a hold of it, or Chrome can lose the events */
    if(voice){ u.voice = voice; u.lang = voice.lang; } else u.lang = "en-GB";
    u.rate = 0.95;
    u.onstart = function(){ if(!started){ started = true; if(current && current.onstart) try{ current.onstart(); }catch(e){} } };
    u.onend = next;
    u.onerror = function(e){
      var why = e && e.error;
      if(why === "interrupted" || why === "canceled") return;
      /* an online voice that could not be reached: try once on the device */
      if(!started && !triedLocal){
        var local = pick(true);
        if(local && local !== voice){ try{ synth.cancel(); }catch(x){} live = []; return setTimeout(function(){ run(j, list, local, true); }, 80); }
        if(voice){ try{ synth.cancel(); }catch(x){} live = []; return setTimeout(function(){ run(j, list, null, true); }, 80); }
      }
      next();
    };
    try{ if(synth.paused) synth.resume(); synth.speak(u); }catch(e){ finish(j); }
  }
  next();
  /* Chrome sometimes stalls on long speech; a pause and resume wakes it */
  clearNudge();
  nudge = setInterval(function(){
    if(!current || current.id !== j) return clearNudge();
    if(synth.speaking && !synth.paused){ try{ synth.pause(); synth.resume(); }catch(e){} }
  }, 9000);
}

function say(text, opts){
  opts = opts || {};
  /* symbols a voice would read out oddly */
  text = String(text || "").replace(/\u2192|->/g, ", becomes, ").replace(/\s*\u00b7\s*/g, ", ").replace(/\s&\s/g, " and ")
    .replace(/\s+/g, " ").trim();
  if(!OK || !text){ if(opts.onend) opts.onend(); return false; }
  var busyBefore = synth.speaking || synth.pending;
  stop();
  var j = ++job;
  current = { id: j, onstart: opts.onstart, onend: opts.onend };
  var list = chunks(text.slice(0, 4000));
  whenVoices(function(){
    if(!current || current.id !== j) return;
    var start = function(){ run(j, list, pick(false), false); };
    if(busyBefore) setTimeout(start, 120); else start();
  });
  return true;
}

window.B5Speak = {
  ok: OK,
  say: say,
  stop: stop,
  busy: function(){ return !!current; }
};
})();
