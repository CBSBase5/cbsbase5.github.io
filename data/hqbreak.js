/* ==========================================================
   Base 5 - HQ break games
   The shared part of the small games that live in a student's
   HQ (Dunk in EGW's, Neon Stack in LP's). This file does the
   earning, the break clock and the cooldown. The game file does
   the game.

   How a go works (Jay asked for this):
     1. Goes are earned with sparks. Every SPARKS_PER_GO sparks
        from activities and the daily drop banks one go. Anything
        that earns sparks counts, Show me included.
     2. A go is a break of BREAK_SECONDS. Play as many rounds as
        fit; the round you are in always gets to finish.
     3. After a break there is a cooldown of COOLDOWN_MINUTES
        before the next one can start, even with goes banked.
   Change the three numbers here.

   Testing: add ?hqtest to the page address and every go is
   free, with no cooldown.

   A game file calls:
     HQBreak({
       id: "dunk", title: "Dunk", prefix: "b5.egw.",
       icon: "<svg>...</svg>",
       theme: { bg, ink, card, accent, accent2, font },
       words: { cooling: "...", earn: "..." },
       make: function(stage, api){ return { start: fn, stop: fn } }
     });
   api.roundOver(score, line)  ends a round and shows the card
   api.sound()                 true if sound is on
   api.best()                  the best score so far
   Saves { credited, goes, breakEnd, best, rounds, sound } in
   <prefix><id>.v1 on this device. ASCII only in this file.
   ========================================================== */
(function(){
"use strict";

var SPARKS_PER_GO = 30;
var BREAK_SECONDS = 180;
var COOLDOWN_MINUTES = 15;

var SKIP = /^(hq|review|daily|swipe|bonnie|sent|skin|biscuits|look|mood|checkin|dunk|stack)\b/;
var TEST = /[?&]hqtest(=|&|$)/.test(location.search);
var RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

function el(tag, cls, text){ var e = document.createElement(tag); if(cls) e.className = cls; if(text != null) e.textContent = text; return e; }
function mmss(s){ s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
function words(n){ return n === 1 ? "1 go" : n + " goes"; }

/* every spark this student has earned on this device */
function sparksTotal(prefix){
  var n = 0, i, k, o;
  try{
    for(i = 0; i < localStorage.length; i++){
      k = localStorage.key(i);
      if(!k || k.indexOf(prefix) !== 0) continue;
      var rest = k.slice(prefix.length);
      if(SKIP.test(rest)) continue;
      try{ o = JSON.parse(localStorage.getItem(k)); }catch(e){ continue; }
      if(o && o.summary && isFinite(o.summary.sparks)) n += Math.max(0, o.summary.sparks);
    }
    o = JSON.parse(localStorage.getItem(prefix + "daily.v1") || "null");
    if(o && o.days) for(k in o.days){
      var r = o.days[k] && o.days[k].r;
      n += r === "right1" ? 10 : r === "right2" ? 6 : r ? 3 : 0;
    }
  }catch(e){}
  return n;
}

window.HQBreak = function(cfg){
  var KEY = cfg.prefix + cfg.id + ".v1";
  var T = cfg.theme;
  var store = { credited: 0, goes: 0, breakEnd: 0, best: 0, rounds: 0, sound: true };

  function load(){
    try{
      var o = JSON.parse(localStorage.getItem(KEY) || "null");
      if(o && typeof o === "object") for(var k in store) if(o[k] !== undefined) store[k] = o[k];
    }catch(e){}
  }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(store)); }catch(e){} }
  load();
  /* first time on this device: count what is already done, so the
     history already on here does not arrive as a pile of free goes */
  if(!localStorage.getItem(KEY)){ store.credited = Math.floor(sparksTotal(cfg.prefix) / SPARKS_PER_GO) * SPARKS_PER_GO; store.goes = 0; save(); }

  function sync(){
    load();
    var total = sparksTotal(cfg.prefix);
    if(total < store.credited) store.credited = total;
    var earn = Math.floor((total - store.credited) / SPARKS_PER_GO);
    if(earn > 0){ store.goes += earn; store.credited += earn * SPARKS_PER_GO; }
    save();
    return total;
  }
  function state(){
    var total = sync(), now = Date.now();
    var onBreak = now < store.breakEnd;
    var cool = onBreak ? 0 : Math.max(0, store.breakEnd + COOLDOWN_MINUTES * 60000 - now) / 1000;
    return {
      onBreak: onBreak || TEST,
      breakLeft: TEST ? 999 : Math.max(0, store.breakEnd - now) / 1000,
      cool: TEST ? 0 : cool,
      goes: TEST ? 9 : store.goes,
      toNext: SPARKS_PER_GO - (total - store.credited)
    };
  }

  /* ---------- styles ---------- */
  var p = "hqb-" + cfg.id;
  var css = el("style");
  css.textContent =
    "html body>." + p + "{position:fixed !important;inset:0 !important;z-index:2147483000 !important}" +
    "." + p + "{display:flex;flex-direction:column;align-items:center;background:" + T.bg + ";color:" + T.ink + ";font-family:var(--body,'Atkinson Hyperlegible',Verdana,sans-serif);overscroll-behavior:contain;-webkit-tap-highlight-color:transparent}" +
    "." + p + " *{box-sizing:border-box}" +
    "." + p + " button{font-family:" + T.font + ";cursor:pointer;-webkit-user-select:none;user-select:none}" +
    "." + p + " button:focus-visible{outline:3px solid " + T.accent + ";outline-offset:3px}" +
    ".hqb-bar{width:100%;display:flex;align-items:center;gap:10px;padding:10px 12px}" +
    ".hqb-title{flex:1;min-width:0;font-family:" + T.font + ";font-weight:800;font-size:1.2rem;display:flex;align-items:center;gap:10px;white-space:nowrap;overflow:hidden}" +
    ".hqb-title svg{width:30px;height:30px;flex:none}" +
    ".hqb-clock{font-family:" + T.font + ";font-weight:800;font-size:1rem;padding:7px 12px;border-radius:999px;background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.25);white-space:nowrap}" +
    ".hqb-clock.low{background:" + T.accent + ";color:" + T.card + ";border-color:" + T.accent + "}" +
    ".hqb-tb{min-height:44px;padding:8px 13px;border-radius:12px;border:2px solid rgba(255,255,255,.28);background:rgba(255,255,255,.08);color:inherit;font-weight:700;font-size:.9rem}" +
    ".hqb-tb[aria-pressed=false]{opacity:.65}" +
    ".hqb-x{min-height:46px;padding:8px 16px;border-radius:14px;border:3px solid " + T.cardInk + ";background:" + T.card + ";color:" + T.cardInk + ";font-weight:800;font-size:1rem}" +
    ".hqb-stage{position:relative;flex:1;width:100%;max-width:560px;margin:0 auto 12px;border-radius:18px;overflow:hidden;box-shadow:0 0 0 3px rgba(255,255,255,.14),0 14px 40px rgba(0,0,0,.4)}" +
    ".hqb-stage canvas{display:block;width:100%;height:100%;touch-action:none;cursor:pointer}" +
    ".hqb-card{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(88%,340px);padding:20px 18px 16px;border-radius:22px;background:" + T.card + ";color:" + T.cardInk + ";text-align:center;border:4px solid " + T.cardInk + ";box-shadow:0 8px 0 rgba(0,0,0,.35);z-index:5}" +
    ".hqb-card[hidden]{display:none}" +
    ".hqb-card h2{margin:0 0 6px;font-family:" + T.font + ";font-weight:900;font-size:1.8rem;line-height:1.05}" +
    ".hqb-card p{margin:6px 0 0;font-size:1rem;line-height:1.4}" +
    ".hqb-nums{display:flex;justify-content:center;gap:10px;margin:12px 0 4px}" +
    ".hqb-nums div{min-width:88px;padding:6px 8px;border-radius:14px;background:rgba(0,0,0,.06)}" +
    ".hqb-nums span{display:block;font-size:.78rem;font-weight:700;opacity:.75}" +
    ".hqb-nums b{display:block;font-family:" + T.font + ";font-size:1.6rem;line-height:1.1}" +
    ".hqb-go{display:block;width:100%;margin-top:14px;min-height:54px;border-radius:16px;border:3px solid " + T.cardInk + ";background:" + T.accent + ";color:" + T.cardInk + ";font-weight:900;font-size:1.3rem;box-shadow:0 5px 0 " + T.cardInk + "}" +
    ".hqb-go:active{transform:translateY(3px);box-shadow:0 2px 0 " + T.cardInk + "}" +
    ".hqb-c2{display:block;width:100%;margin-top:10px;min-height:42px;border-radius:14px;border:2px solid rgba(0,0,0,.25);background:transparent;color:inherit;font-weight:800;font-size:.98rem}" +
    ".hqb-ring{width:110px;height:110px;margin:4px auto 8px;display:block}" +
    /* the launcher in the hero */
    ".hqb-launch{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:16px 0 0}" +
    ".hqb-open{display:inline-flex;align-items:center;gap:11px;padding:9px 18px 9px 10px;border-radius:16px;border:3px solid " + T.cardInk + ";background:" + T.accent + ";color:" + T.cardInk + ";font-family:" + T.font + ";font-weight:800;font-size:1.05rem;cursor:pointer;box-shadow:0 5px 0 " + T.cardInk + ";transition:transform .12s}" +
    ".hqb-open:hover{transform:translateY(-2px)}" +
    ".hqb-open.wait{background:rgba(255,255,255,.12);color:inherit;border-color:rgba(255,255,255,.35);box-shadow:none}" +
    ".hqb-open svg{width:34px;height:34px;flex:none;border-radius:9px;background:" + T.card + ";padding:3px}" +
    ".hqb-note{margin:0;font-size:.94rem;opacity:.88}" +
    "@media (prefers-reduced-motion:reduce){.hqb-open{transition:none}}";
  document.head.appendChild(css);

  /* ---------- sound: tiny blips, only after a tap ---------- */
  var AC = null;
  function beep(f, d, type, vol){
    if(!store.sound) return;
    try{
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      var o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime;
      o.type = type || "sine"; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(vol || .12, t); g.gain.exponentialRampToValueAtTime(.0001, t + (d || .15));
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + (d || .15) + .02);
    }catch(e){}
  }

  /* ---------- the overlay ---------- */
  var root = null, stage, card, clock, game = null, tick = null, roundLive = false, timeUpShown = false, lastFocus = null;

  function ring(frac, label){
    var r = 46, c = 2 * Math.PI * r;
    return '<svg class="hqb-ring" viewBox="0 0 110 110" aria-hidden="true">' +
      '<circle cx="55" cy="55" r="' + r + '" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="10"/>' +
      '<circle cx="55" cy="55" r="' + r + '" fill="none" stroke="' + T.accent2 + '" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + (c * (1 - frac)) + '" transform="rotate(-90 55 55)"/>' +
      '<text x="55" y="61" text-anchor="middle" font-size="19" font-weight="800" fill="' + T.cardInk + '" font-family="Arial,sans-serif">' + label + '</text></svg>';
  }

  function showCard(html, buttons){
    card.innerHTML = html;
    (buttons || []).forEach(function(b){
      var x = el("button", b.main ? "hqb-go" : "hqb-c2", b.text);
      x.type = "button"; x.addEventListener("click", b.fn); card.appendChild(x);
    });
    card.hidden = false;
    var f = card.querySelector("button"); if(f) f.focus();
  }
  function hideCard(){ card.hidden = true; }

  function lockedCard(s){
    if(s.goes < 1){
      var got = SPARKS_PER_GO - s.toNext;
      showCard(
        ring(got / SPARKS_PER_GO, got + "/" + SPARKS_PER_GO) +
        "<h2>" + cfg.title + " is earned</h2>" +
        "<p>Every " + SPARKS_PER_GO + " sparks earns a " + Math.round(BREAK_SECONDS / 60) + " minute go. You are " + s.toNext + " sparks away. " + cfg.words.earn + "</p>",
        [{ text: "OK", main: true, fn: close }]);
    } else {
      var full = COOLDOWN_MINUTES * 60;
      showCard(
        ring(1 - s.cool / full, mmss(s.cool)) +
        "<h2>" + cfg.words.coolingTitle + "</h2>" +
        "<p>" + cfg.words.cooling + " Your next go is ready in " + mmss(s.cool) + ". You have " + words(s.goes) + " saved up.</p>",
        [{ text: "OK", main: true, fn: close }]);
    }
  }

  function startCard(s){
    showCard(
      "<h2>" + cfg.title + "</h2><p>" + cfg.words.how + "</p>" +
      '<div class="hqb-nums"><div><span>Break</span><b>' + mmss(s.breakLeft) + "</b></div><div><span>Best</span><b>" + store.best + "</b></div></div>",
      [{ text: "Go", main: true, fn: function(){ hideCard(); roundLive = true; game.start(); } }]);
  }

  function updateClock(){
    var s = state();
    if(!clock) return;
    if(TEST){ clock.textContent = "Test mode"; return; }
    clock.textContent = s.onBreak ? "Break " + mmss(s.breakLeft) : "Break over";
    clock.classList.toggle("low", s.onBreak && s.breakLeft <= 30);
    if(!s.onBreak && !roundLive && !timeUpShown && root){ timeUpShown = true; breakOverCard(); }
  }

  function breakOverCard(score){
    var s = state();
    showCard(
      (score != null ? '<div class="hqb-nums"><div><span>That round</span><b>' + score + "</b></div><div><span>Best</span><b>" + store.best + "</b></div></div>" : "") +
      "<h2>That is the break</h2>" +
      "<p>" + cfg.words.done + " Next go in " + mmss(COOLDOWN_MINUTES * 60) + (s.goes ? ", and you have " + words(s.goes) + " saved up." : ". Sparks earn more goes.") + "</p>",
      [{ text: "Back to my HQ", main: true, fn: close }]);
  }

  var api = {
    sound: function(){ return store.sound; },
    beep: beep,
    best: function(){ return store.best; },
    reduced: RM,
    roundOver: function(score, line){
      roundLive = false;
      load(); store.rounds++;
      var isBest = score > store.best;
      if(isBest) store.best = score;
      save();
      var s = state();
      if(!s.onBreak){ timeUpShown = true; breakOverCard(score); return; }
      showCard(
        (isBest && score > 0 ? '<p style="margin:0 0 6px;font-weight:800">New best</p>' : "") +
        "<h2>" + score + "</h2><p>" + (line || "") + "</p>" +
        '<div class="hqb-nums"><div><span>Best</span><b>' + store.best + "</b></div><div><span>Break left</span><b>" + mmss(s.breakLeft) + "</b></div></div>",
        [{ text: "Again", main: true, fn: function(){ hideCard(); roundLive = true; game.start(); } },
         { text: "Back to my HQ", fn: close }]);
    }
  };

  function open(){
    var s = state();
    lastFocus = document.activeElement;
    root = el("div", p); root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", cfg.title);
    var bar = el("div", "hqb-bar");
    var title = el("div", "hqb-title"); title.innerHTML = cfg.icon + "<span>" + cfg.title + "</span>";
    clock = el("span", "hqb-clock");
    var snd = el("button", "hqb-tb", "Sound"); snd.type = "button"; snd.setAttribute("aria-pressed", store.sound ? "true" : "false");
    snd.addEventListener("click", function(){ load(); store.sound = !store.sound; save(); snd.setAttribute("aria-pressed", store.sound ? "true" : "false"); });
    var x = el("button", "hqb-x", "Close"); x.type = "button"; x.addEventListener("click", close);
    bar.appendChild(title); bar.appendChild(clock); bar.appendChild(snd); bar.appendChild(x);
    stage = el("div", "hqb-stage");
    card = el("div", "hqb-card"); card.hidden = true;
    root.appendChild(bar); root.appendChild(stage); stage.appendChild(card);
    document.body.appendChild(root);
    document.documentElement.style.overflow = "hidden";
    root.addEventListener("keydown", function(e){ if(e.key === "Escape") close(); });

    game = cfg.make(stage, api);
    timeUpShown = false; roundLive = false;

    if(!s.onBreak){
      if(s.goes < 1 || s.cool > 0){ clock.textContent = ""; lockedCard(s); return; }
      /* spend a go and start the break clock */
      load(); store.goes--; store.breakEnd = Date.now() + BREAK_SECONDS * 1000; save();
      s = state();
    }
    updateClock();
    tick = setInterval(updateClock, 500);
    startCard(s);
  }

  function close(){
    if(!root) return;
    clearInterval(tick); tick = null;
    if(game && game.stop) game.stop();
    game = null; roundLive = false;
    root.remove(); root = null; clock = null;
    document.documentElement.style.overflow = "";
    refreshLauncher();
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------- the launcher in the hero ---------- */
  var openBtn = null, note = null;
  function refreshLauncher(){
    if(!openBtn) return;
    var s = state(), ready = s.onBreak || (s.goes > 0 && s.cool <= 0);
    openBtn.classList.toggle("wait", !ready);
    openBtn.querySelector("span").textContent = s.onBreak ? "Back to " + cfg.title : ready ? "Play " + cfg.title : cfg.title;
    if(TEST) note.textContent = "Test mode: every go is free.";
    else if(s.onBreak) note.textContent = "Break on: " + mmss(s.breakLeft) + " left.";
    else if(s.goes > 0 && s.cool > 0) note.textContent = cfg.words.coolingShort + " Ready in " + mmss(s.cool) + ".";
    else if(s.goes > 0) note.textContent = words(s.goes) + " ready. Each one is a " + Math.round(BREAK_SECONDS / 60) + " minute break.";
    else note.textContent = s.toNext + " more sparks for your next go.";
  }
  function addLauncher(){
    var hero = document.querySelector(".hero");
    if(!hero || hero.querySelector(".hqb-launch")) return;
    var box = el("div", "hqb-launch");
    openBtn = el("button", "hqb-open"); openBtn.type = "button";
    openBtn.innerHTML = cfg.icon + "<span></span>";
    openBtn.addEventListener("click", open);
    note = el("p", "hqb-note");
    box.appendChild(openBtn); box.appendChild(note);
    hero.appendChild(box);
    refreshLauncher();
    setInterval(function(){ if(!root) refreshLauncher(); }, 1000);
    window.addEventListener("storage", function(){ if(!root) refreshLauncher(); });
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", addLauncher);
  else addLauncher();

  return { open: open };
};
})();
