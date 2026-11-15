/* ==========================================================
   Base 5 - HQ fun layer for the activity engine (15 Nov 2026)
   More game, less quiz. Jay picked these for the learning chunks:

     31 Arcade mode: the answer tiles fall from the sky, tap the
        right one as it drops
     32 Fling it: drag, flick or slingshot an answer into the goal
        (and sort cards into their boxes)
     35 Funny fails: a slip makes the scene go comically wrong
        before the nudge (never about the student)
     39 A trail, not dots: each chunk is a little path with a token
        that moves along it, and a flag for the boss round
     41 A silly answer in every multiple choice question, absurd
        teen humour. Tapping it costs nothing: no try is used, it
        gets vetoed and a gag plays
     45 Draw it: a pen on every picture in a question (working out,
        circling, unmarked), plus a "draw" step type that is marked
     46 Find it: an optional real world find at the end of a chunk
        (snap a photo or just say you found one), plus a "find"
        step type

   How a student plays a question (tap, fling or arcade) is their
   choice, switchable on any question, kept in <prefix>fun.mode.v1.
   Loaded by /egw/engine.js with /egw/play.js. The engine calls:
     HQFun.step(info)       every step: {s, i, k, from, to, steps,
                            body, card, resolved, boss, api}
     HQFun.miss(info)       a first slip (the nudge)
     HQFun.result(info)     an answer settled: {status}
     HQFun.chunkEnd(card, info)   {k, n, subject, id, topic}
     HQFun.types.draw / .find      renderers, return the engine's cur
   New step types for activity authors:
     draw {q, fig:"<svg viewBox=...>", zones:[{x,y,w,h,ok:true}],
           need: how many ok zones to ring (default all), tip, hint, why}
           Ring, tick or tap the right parts of the picture. Zones
           are in the picture's own viewBox units.
     find {q, hint, why}   find something real; a photo is optional
           and never leaves the device
   Everything here is decoration except those two step types. No
   flashing. Reduced motion: no falling, no flying, gags hold still.
   Photos are never saved or sent: they show on the card and are
   gone when the page closes. ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(window.HQFun) return;

var HQ = window.HQ || { who: "EGW", prefix: "b5.egw.", base: "/egw/" };
var WHO = String(HQ.who || "EGW").toUpperCase();
var PREFIX = HQ.prefix || "b5.egw.";
var EASY = !!HQ.easyRead;
var WID = { JT: "jt", HK: "hk", LC: "lc", LW: "lw", LP: "lp", EGW: "egw" }[WHO] || "egw";
var d = document, NS = "http://www.w3.org/2000/svg";
var MODE_KEY = PREFIX + "fun.mode.v1", FOUND_KEY = PREFIX + "fun.found.v1";
function still(){ try{ return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } }
function el(tag, cls, html){ var e = d.createElement(tag); if(cls) e.className = cls; if(html != null) e.innerHTML = html; return e; }
function readJ(k, dflt){ try{ var v = JSON.parse(localStorage.getItem(k) || "null"); return v == null ? dflt : v; }catch(e){ return dflt; } }
function writeJ(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
function pick(a){ return a[Math.floor(Math.random() * a.length)]; }
function seeded(str){ var h = 2166136261; for(var i = 0; i < str.length; i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mode(){ var m = readJ(MODE_KEY, null); return m && /^(tap|fling|arcade)$/.test(m.m) ? m.m : "tap"; }
function setMode(m){ writeJ(MODE_KEY, { m: m, at: new Date().toISOString() }); }

/* ==========================================================
   CSS
   ========================================================== */
var CSS = [
  /* the mode switch */
  ".fx-modes{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:4px 0 10px}",
  ".fx-modes .fx-ml{font-size:.82rem;font-weight:700;opacity:.7;margin-right:2px}",
  ".fx-modes button{display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:.88rem;font-weight:700;padding:5px 12px 5px 8px;border-radius:999px;border:2px solid var(--line,#d8dbe8);background:#fff;color:var(--ink,#141a33);cursor:pointer}",
  ".fx-modes button svg{width:20px;height:20px;flex:none}",
  ".fx-modes button[aria-pressed=true]{border-color:var(--ink,#141a33);background:var(--accent-soft,#e8edff);box-shadow:0 2px 0 var(--ink,#141a33)}",

  /* 31 arcade */
  ".choices.fx-arc{position:relative;display:block;height:300px;overflow:hidden;border-radius:16px;border:2px dashed var(--line,#d8dbe8);background:linear-gradient(180deg,rgba(58,92,255,.06),rgba(255,210,63,.10))}",
  ".choices.fx-arc button{position:absolute;top:0;left:var(--x);width:var(--w);min-height:58px;margin:0;text-align:center;font-weight:700;animation:fxFall var(--t) linear var(--d) infinite;z-index:1}",
  ".choices.fx-arc button.no,.choices.fx-arc button.fx-gone{opacity:.25;pointer-events:none}",
  ".choices.fx-arc:hover button{animation-play-state:running}",
  "@keyframes fxFall{from{transform:translateY(-90px)}to{transform:translateY(310px)}}",
  ".fx-arcline{position:absolute;left:0;right:0;bottom:0;height:34px;background:repeating-linear-gradient(90deg,rgba(20,26,51,.10) 0 18px,transparent 18px 36px);pointer-events:none}",

  /* 32 fling */
  ".fx-goal{position:relative;display:flex;align-items:center;justify-content:center;gap:10px;min-height:84px;margin:0 0 12px;border:3px dashed var(--ink,#141a33);border-radius:18px;background:rgba(255,210,63,.16);font-weight:800;font-size:1.05rem;color:var(--ink,#141a33);transition:transform .15s,background .15s}",
  ".fx-goal svg{width:58px;height:58px;flex:none}",
  ".fx-goal.fx-hot{background:rgba(25,195,154,.22);transform:scale(1.03)}",
  ".fx-goal.fx-gulp{animation:fxGulp .5s ease}",
  "@keyframes fxGulp{40%{transform:scale(1.1)}100%{transform:scale(1)}}",
  ".fx-flingable{touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none}",
  ".fx-dragging{z-index:50;position:relative;cursor:grabbing;box-shadow:0 14px 26px rgba(0,0,0,.25) !important;transition:none !important}",
  ".fx-back{transition:transform .28s cubic-bezier(.3,1.5,.5,1) !important}",
  ".fx-fly{transition:transform .26s cubic-bezier(.5,0,.8,.6),opacity .26s !important;opacity:.2}",
  ".bin.fx-hot{outline:3px dashed var(--ink,#141a33);outline-offset:2px}",

  /* 35 funny fails */
  ".fx-gag{position:absolute;inset:0;pointer-events:none;z-index:5;overflow:hidden}",
  ".fx-gag svg{position:absolute;inset:0;width:100%;height:100%}",
  ".fx-cap{position:absolute;left:10px;bottom:8px;max-width:78%;background:#fffdf8;color:#141a33;border:2px solid #141a33;border-radius:14px 14px 14px 4px;padding:5px 11px;font:700 .86rem/1.25 var(--display,Arial),sans-serif;box-shadow:0 3px 0 rgba(0,0,0,.35);animation:fxCap 2.6s ease both}",
  "@keyframes fxCap{0%{opacity:0;transform:translateY(10px)}12%{opacity:1;transform:none}82%{opacity:1}100%{opacity:0}}",
  ".fx-gagband{position:relative;height:96px;margin:-6px 0 10px;border-radius:14px;overflow:hidden;background:rgba(20,26,51,.06)}",
  ".fx-wob{animation:fxWob .9s ease}",
  "@keyframes fxWob{20%{transform:skewX(4deg) scaleY(.96)}40%{transform:skewX(-4deg) scaleY(1.03)}60%{transform:skewX(2deg)}80%{transform:skewX(-1deg)}100%{transform:none}}",
  ".fx-shake{animation:fxShake .5s ease .35s}",
  "@keyframes fxShake{20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(3px)}100%{transform:none}}",
  ".fx-gag g{transform-box:fill-box;transform-origin:center}",
  ".fx-walk{animation:fxWalk 2.6s linear both}",
  "@keyframes fxWalk{0%{transform:translateX(-120px)}45%{transform:translateX(330px)}60%{transform:translateX(330px)}100%{transform:translateX(900px)}}",
  ".fx-stride{animation:fxStride 2.6s linear both}",
  "@keyframes fxStride{0%{transform:translateX(-160px)}100%{transform:translateX(940px)}}",
  ".fx-bob{animation:fxBob .32s ease-in-out infinite alternate}",
  "@keyframes fxBob{to{transform:translateY(-4px)}}",
  ".fx-drop{animation:fxDrop 1.6s cubic-bezier(.3,.6,.4,1) both}",
  "@keyframes fxDrop{0%{transform:translateY(-140px) rotate(-30deg)}40%{transform:translateY(0) rotate(10deg)}55%{transform:translateY(-34px) rotate(-8deg)}70%{transform:translateY(0) rotate(4deg)}85%{transform:translateY(-8px)}100%{transform:translateY(0)}}",
  ".fx-drift{animation:fxDrift 2.6s ease-in-out both}",
  "@keyframes fxDrift{0%{transform:translateX(-200px)}40%{transform:translateX(0)}70%{transform:translateX(0)}100%{transform:translateX(980px)}}",
  ".fx-pop{animation:fxPop 2.4s ease both}",
  "@keyframes fxPop{0%{transform:translateY(120px)}20%{transform:translateY(0)}35%{transform:translateY(0) scale(1.15,.85)}45%{transform:translateY(0)}80%{transform:translateY(0)}100%{transform:translateY(130px)}}",
  ".fx-arc1{animation:fxArc1 1.3s cubic-bezier(.3,.7,.6,1) both}",
  "@keyframes fxArc1{0%{transform:translate(-260px,60px)}55%{transform:translate(0,0)}70%{transform:translate(-30px,-18px)}100%{transform:translate(-150px,90px)}}",
  ".fx-leap{animation:fxLeap 1.6s ease-in-out both}",
  "@keyframes fxLeap{0%{transform:translate(-60px,70px) rotate(-40deg)}50%{transform:translate(40px,-6px) rotate(10deg)}100%{transform:translate(150px,80px) rotate(60deg)}}",
  ".fx-peek{animation:fxPeek 2.5s ease both}",
  "@keyframes fxPeek{0%{transform:translateX(120px)}25%{transform:translateX(0)}35%{transform:translateX(0) rotate(-8deg)}45%{transform:translateX(0) rotate(8deg)}75%{transform:translateX(0)}100%{transform:translateX(120px)}}",
  ".fx-dangle{animation:fxDangle 2.4s ease both}",
  "@keyframes fxDangle{0%{transform:translateY(-120px)}25%{transform:translateY(0) rotate(6deg)}40%{transform:rotate(-6deg)}55%{transform:rotate(3deg)}80%{transform:translateY(0)}100%{transform:translateY(-130px)}}",
  ".fx-snap{animation:fxSnap 1.8s ease both}",
  "@keyframes fxSnap{0%{transform:translateY(-50px)}30%{transform:translateY(0)}55%{transform:translateY(0)}100%{transform:translateY(60px) rotate(40deg);opacity:0}}",
  ".fx-dip{animation:fxDip 1.8s ease both}",
  "@keyframes fxDip{0%{transform:translateY(-50px)}30%{transform:translateY(0)}60%{transform:translateY(0)}100%{transform:translateY(-60px)}}",

  /* 41 the silly answer */
  ".choices button.fx-silly{font-style:italic}",
  ".choices button.fx-veto{animation:fxVeto 1s ease forwards;pointer-events:none}",
  ".choices.fx-arc button.fx-veto{animation:fxFall var(--t) linear var(--d) infinite;opacity:.15;transition:opacity .5s}",
  "@keyframes fxVeto{0%{transform:none}30%{transform:rotate(-6deg) scale(1.05)}100%{transform:rotate(14deg) scale(.4);opacity:0}}",
  ".fx-stamp{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-10deg);border:3px solid #ef7724;color:#ef7724;background:#fffdf8;border-radius:8px;padding:2px 8px;font:900 .8rem/1 var(--display,Arial),sans-serif;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}",
  ".choices button{position:relative}",

  /* 39 the trail */
  ".fx-hasmap .dots{display:none}",
  ".fx-trail{margin:2px 0 8px}",
  ".fx-trail svg{display:block;width:100%;height:46px;overflow:visible}",
  ".fx-tok{transition:transform .7s cubic-bezier(.3,1.3,.5,1)}",
  "@media (prefers-reduced-motion:reduce){.fx-tok{transition:none}}",

  /* 45 draw it */
  ".fig.fx-penfig{position:relative}",
  ".fx-pen{position:absolute;top:6px;right:6px;z-index:3;display:inline-flex;align-items:center;gap:5px;font:inherit;font-size:.82rem;font-weight:800;padding:5px 10px;border-radius:999px;border:2px solid var(--ink,#141a33);background:#fffdf8;color:var(--ink,#141a33);cursor:pointer;box-shadow:0 2px 0 var(--ink,#141a33)}",
  ".fx-pen svg{width:16px;height:16px}",
  ".fx-pen[aria-pressed=true]{background:#ffd23f}",
  ".fx-penclr{right:auto;left:6px}",
  ".fx-inkon svg{touch-action:none;cursor:crosshair}",
  ".fx-ink polyline{fill:none;stroke:#ef7724;stroke-linecap:round;stroke-linejoin:round;opacity:.9}",
  ".fx-ink circle{fill:#ef7724;opacity:.9}",
  ".fx-drawfig{position:relative;border:2px dashed var(--line,#d8dbe8);border-radius:14px;padding:6px;background:#fff}",
  ".fx-drawfig svg{display:block;width:100%;height:auto;touch-action:none;cursor:crosshair}",
  ".fx-drawbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin:8px 0 4px}",
  ".fx-zone{fill:none;stroke-width:3;stroke-dasharray:8 6;rx:6}",
  ".fx-zone.ok{stroke:#1f9d63}",
  ".fx-zone.no{stroke:#ef7724}",

  /* 46 find it */
  ".fx-find{position:relative;max-width:460px;margin:14px auto 6px;padding:14px 16px;border-radius:16px;border:2px solid var(--ink,#141a33);background:linear-gradient(135deg,rgba(255,210,63,.22),rgba(34,184,230,.14));text-align:left}",
  ".fx-find h4{margin:0 0 4px;display:flex;align-items:center;gap:8px;font-family:var(--display,Arial),sans-serif;font-size:1.08rem}",
  ".fx-find h4 svg{width:26px;height:26px;flex:none}",
  ".fx-find .fx-what{font-size:1.1rem;font-weight:700;margin:2px 0 10px}",
  ".fx-find .fx-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}",
  ".fx-find .tiny{opacity:.8;margin:8px 0 0}",
  ".fx-found{display:flex;align-items:center;gap:12px;margin-top:10px}",
  ".fx-found img{width:120px;height:90px;object-fit:cover;border-radius:10px;border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.25);transform:rotate(-3deg)}",
  ".fx-foundstamp{display:inline-block;border:3px solid #1f9d63;color:#1f9d63;border-radius:8px;padding:3px 10px;font:900 1rem/1 var(--display,Arial),sans-serif;letter-spacing:.1em;transform:rotate(-8deg);background:#fffdf8;animation:fxStampIn .5s cubic-bezier(.2,1.6,.4,1) both}",
  "@keyframes fxStampIn{0%{transform:scale(2.2) rotate(-8deg);opacity:0}100%{transform:scale(1) rotate(-8deg);opacity:1}}",
  ".fx-shuffle{font:inherit;background:none;border:0;text-decoration:underline;cursor:pointer;color:inherit;padding:2px;font-size:.9rem}",

  "@media (prefers-reduced-motion:reduce){.choices.fx-arc button{animation:none}.fx-gag *{animation:none !important}.fx-cap{animation:none}.fx-veto{animation:none;opacity:0}}"
].join("\n");
function addCss(){ if(d.getElementById("fxCss")) return; var st = el("style"); st.id = "fxCss"; st.textContent = CSS; d.head.appendChild(st); }

/* ==========================================================
   Icons
   ========================================================== */
var IC = {
  tap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11V5a2 2 0 0 1 4 0v5l4.5 1.2a2 2 0 0 1 1.4 2.3L18 19a3 3 0 0 1-3 2.4h-3.6a3 3 0 0 1-2.4-1.2L5.6 16a1.6 1.6 0 0 1 2.4-2.1L9 15z" fill="#ffd23f" stroke="#141a33" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  fling: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19C6 9 12 5 19 5" fill="none" stroke="#141a33" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="3 3"/><path d="M15 2.5l5 2.6-3.2 4.4" fill="none" stroke="#141a33" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="5" cy="18" r="3.2" fill="#ef7724" stroke="#141a33" stroke-width="1.4"/></svg>',
  arcade: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="13" width="18" height="8" rx="3" fill="#3a5cff" stroke="#141a33" stroke-width="1.5"/><path d="M12 13V7" stroke="#141a33" stroke-width="2.2"/><circle cx="12" cy="6" r="3.4" fill="#ff5d5d" stroke="#141a33" stroke-width="1.5"/><circle cx="17" cy="17" r="1.6" fill="#ffd23f"/></svg>',
  pen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4.6L16 4.6a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z" fill="#ef7724" stroke="#141a33" stroke-width="1.5" stroke-linejoin="round"/><path d="M4 20l4.6-1.2" stroke="#141a33" stroke-width="1.5"/></svg>',
  find: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5" fill="#fffdf8" stroke="#141a33" stroke-width="2.2"/><path d="M15 15l5.5 5.5" stroke="#141a33" stroke-width="3" stroke-linecap="round"/><path d="M7.5 9a3 3 0 0 1 3-2.5" fill="none" stroke="#22b8e6" stroke-width="1.8" stroke-linecap="round"/></svg>',
  cam: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 8h3l2-2.5h6L17 8h3v11H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.4" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
};
/* the goal for Fling it, in each HQ's own world */
var GOALS = {
  jt: { t: "Fling it in the net", svg: '<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M6 52V12h48v40" fill="none" stroke="#141a33" stroke-width="4"/><path d="M6 12l10 10h28l10-10M16 22v30M44 22v30M16 32h28M16 42h28M26 22v30M34 22v30" stroke="#141a33" stroke-width="1.4" opacity=".5"/></svg>' },
  hk: { t: "Cast it in the lake", svg: '<svg viewBox="0 0 60 60" aria-hidden="true"><ellipse cx="30" cy="40" rx="26" ry="12" fill="#22b8e6" stroke="#141a33" stroke-width="2.5"/><path d="M14 40q8 -5 16 0t16 0" fill="none" stroke="#fff" stroke-width="2"/><circle cx="30" cy="22" r="5" fill="#ff5d5d" stroke="#141a33" stroke-width="2"/><path d="M30 27v8" stroke="#141a33" stroke-width="2"/></svg>' },
  lc: { t: "Into the torch beam", svg: '<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M8 30l18-8v16z" fill="#3a4170" stroke="#141a33" stroke-width="2.5"/><path d="M26 22L56 8v44L26 38z" fill="#ffd23f" opacity=".55"/><rect x="2" y="26" width="8" height="8" rx="2" fill="#141a33"/></svg>' },
  lw: { t: "Into the spotlight", svg: '<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M30 4L10 52h40z" fill="#ffd23f" opacity=".5"/><ellipse cx="30" cy="52" rx="22" ry="6" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/><rect x="24" y="2" width="12" height="8" rx="2" fill="#141a33"/></svg>' },
  lp: { t: "Into the in tray", svg: '<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M6 34h14l4 8h12l4-8h14v18H6z" fill="#19c39a" stroke="#141a33" stroke-width="2.5" stroke-linejoin="round"/><rect x="16" y="12" width="28" height="22" fill="#fffdf8" stroke="#141a33" stroke-width="2" transform="rotate(-6 30 23)"/></svg>' },
  egw: { t: "Dunk it in the tea", svg: '<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M10 22h34v18a12 12 0 0 1-12 12h-10a12 12 0 0 1-12-12z" fill="#fffdf8" stroke="#141a33" stroke-width="2.5"/><path d="M44 27h4a6 6 0 0 1 0 12h-4" fill="none" stroke="#141a33" stroke-width="2.5"/><path d="M13 26h28" stroke="#b5743c" stroke-width="5"/><path d="M20 16q3-5 0-9M30 16q3-5 0-9" fill="none" stroke="#141a33" stroke-width="1.6" opacity=".5"/></svg>' }
};
/* the token that walks the trail */
var TOKENS = {
  jt: '<circle r="10" fill="#fff" stroke="#141a33" stroke-width="2"/><path d="M0 -4l4 3-1.6 4.6h-4.8L-4 -1z" fill="#141a33"/>',
  hk: '<path d="M0 -12v6" stroke="#141a33" stroke-width="2"/><ellipse cy="2" rx="7" ry="9" fill="#ff5d5d" stroke="#141a33" stroke-width="2"/><path d="M-7 2h14" stroke="#fff" stroke-width="3"/>',
  lc: '<rect x="-10" y="-5" width="12" height="10" rx="2" fill="#3a4170" stroke="#141a33" stroke-width="2"/><path d="M2 -6l9 -4v20l-9 -4z" fill="#ffd23f" stroke="#141a33" stroke-width="1.5"/>',
  lw: '<rect x="-11" y="-4" width="22" height="14" rx="2" fill="#141a33"/><path d="M-11 -4l22 -6v-2l-22 6z" fill="#fff" stroke="#141a33" stroke-width="1.5"/><path d="M-6 -6l3 -1M1 -8l3 -1" stroke="#141a33" stroke-width="2"/>',
  lp: '<path d="M-12 4L12 -8L2 10l-3-6z" fill="#fffdf8" stroke="#141a33" stroke-width="2" stroke-linejoin="round"/>',
  egw: '<circle r="10" fill="#d9a066" stroke="#141a33" stroke-width="2"/><circle cx="-4" cy="-3" r="1.4" fill="#7a4c2c"/><circle cx="3" cy="-4" r="1.4" fill="#7a4c2c"/><circle cx="1" cy="3" r="1.4" fill="#7a4c2c"/><circle cx="5" cy="2" r="1.4" fill="#7a4c2c"/>'
};

/* ==========================================================
   41 The silly answer. Absurd, never mean, never about anyone.
   ========================================================== */
var SILLY = [
  "Bonnie ate it", "Vibes", "Skill issue", "It's giving... 7?", "Ask a pigeon", "Jay's left sock",
  "Three geese in a trench coat", "The answer is in the walls", "Lowkey all of them", "Whatever the microwave says",
  "Banned in 1987", "Gary", "A suspiciously large potato", "Delete the internet", "Press F", "The Wi-Fi password",
  "Bambi knows. Bambi won't say.", "Respectfully, no", "My nan's bingo numbers", "Sus", "Touch grass", "Error 404",
  "Ask Year 7", "NPC answer", "An egg. Just an egg.", "It depends on the moon", "Main character energy",
  "The sandwich from Tuesday", "Yeet it", "Ohio", "Mid", "Literally a bin", "Big if true", "Chat, is this real?",
  "Jay's crocs", "A frog in a hat", "None. Nap instead.", "No thoughts, head empty", "The dog did it",
  "A raccoon in a lanyard", "Whatever a seagull would do", "Rizz", "Ratio", "Something something dinosaurs",
  "Time travel and hope", "My cousin says 12", "The vending machine", "Spicy air", "Crab", "Wait, what was the question?",
  "Bonnie's tax return", "Seven bees", "Just shout it", "Buffering...", "Ask your nan's cat", "Built different",
  "It's on the tip of my elbow", "A lamp", "Ctrl Z", "Two pigeons, one opinion"
];
var VETO = ["Vetoed by Bonnie", "Nope", "Bonnie says no", "Not today", "Rejected", "Absolutely not"];
var SILLY_CAPS = ["Bold. Wrong, but bold.", "Respect for trying it though.", "Jay is writing that down for later.",
  "Banned in three countries.", "That one did not even use a try.", "Bonnie has filed a complaint.", "The answer has left the building."];

/* ==========================================================
   35 Funny fails. Each gag: draw() returns svg inside a 760x110
   scene, cap is a list of captions. Never about the student.
   ========================================================== */
function pigeon(){
  return '<g class="fx-walk"><g transform="translate(0 70)"><g class="fx-bob">' +
    '<ellipse cx="0" cy="0" rx="22" ry="14" fill="#9aa3b5" stroke="#141a33" stroke-width="2"/><path d="M-20 -2l-14 -6 4 10z" fill="#7d8699" stroke="#141a33" stroke-width="2"/>' +
    '<circle cx="18" cy="-14" r="9" fill="#9aa3b5" stroke="#141a33" stroke-width="2"/><circle cx="21" cy="-16" r="2" fill="#141a33"/><path d="M26 -14l7 2-7 2z" fill="#ef7724"/>' +
    '<path d="M10 -6q6 4 0 8" fill="none" stroke="#19c39a" stroke-width="3"/><path d="M-4 13v12M6 13v12" stroke="#ef7724" stroke-width="3"/></g></g></g>';
}
function chicken(){
  return '<g transform="translate(380 66)"><g class="fx-drop">' +
    '<ellipse cx="0" cy="8" rx="26" ry="16" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/><path d="M18 -2q10 -26 -4 -32q-12 2 -8 26" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/>' +
    '<path d="M4 -32q2 -8 6 -4q2 -6 6 0" fill="#ff5d5d" stroke="#141a33" stroke-width="1.8"/><circle cx="12" cy="-22" r="2.2" fill="#141a33"/><path d="M20 -20l10 3-9 4z" fill="#ef7724" stroke="#141a33" stroke-width="1.5"/>' +
    '<path d="M-26 6l-10 -8" stroke="#141a33" stroke-width="2"/></g></g>';
}
function cloud(){
  return '<g transform="translate(380 30)"><g class="fx-drift">' +
    '<path d="M-40 10a16 16 0 0 1 8-28a22 22 0 0 1 40-4a16 16 0 0 1 26 18a12 12 0 0 1-4 14z" fill="#c9cfdc" stroke="#141a33" stroke-width="2.5"/>' +
    '<path d="M-24 18l-4 12M-8 20l-4 12M8 20l-4 12M24 18l-4 12" stroke="#22b8e6" stroke-width="3" stroke-linecap="round"/>' +
    '<circle cx="-6" cy="-2" r="2.2" fill="#141a33"/><circle cx="8" cy="-2" r="2.2" fill="#141a33"/><path d="M-4 7q5 -4 10 0" fill="none" stroke="#141a33" stroke-width="2"/></g></g>';
}
function poodle(){
  return '<g transform="translate(640 74)"><g class="fx-pop">' +
    '<ellipse cx="-22" cy="-2" rx="10" ry="17" fill="#7a4c2c"/><ellipse cx="22" cy="-2" rx="10" ry="17" fill="#7a4c2c"/>' +
    '<circle r="20" fill="#a87650"/><circle cx="-9" cy="-17" r="9" fill="#b38058"/><circle cx="5" cy="-20" r="9" fill="#b38058"/><circle cx="14" cy="-12" r="8" fill="#b38058"/>' +
    '<ellipse cy="10" rx="10" ry="8" fill="#c8956a"/><path d="M-10 -2l5 2M10 -2l-5 2" stroke="#1b1b1b" stroke-width="2.6" stroke-linecap="round"/><ellipse cy="7" rx="4" ry="3" fill="#1b1b1b"/>' +
    '<text x="-70" y="-28" font-family="Verdana,Arial,sans-serif" font-size="20" font-weight="900" fill="#fffdf8" stroke="#141a33" stroke-width="1">ACHOO</text></g></g>';
}
function bambi(){
  return '<g class="fx-stride"><g transform="translate(0 6)">' +
    '<path d="M-20 60l-6 44M-8 60l-2 44M18 60l4 44M30 58l8 44" stroke="#c9a37a" stroke-width="5" stroke-linecap="round"/>' +
    '<ellipse cx="6" cy="52" rx="34" ry="14" fill="#e8d3b5" stroke="#141a33" stroke-width="2"/>' +
    '<path d="M34 46l14 -30" stroke="#e8d3b5" stroke-width="10" stroke-linecap="round"/><ellipse cx="54" cy="12" rx="12" ry="8" fill="#e8d3b5" stroke="#141a33" stroke-width="2"/>' +
    '<circle cx="56" cy="10" r="1.8" fill="#141a33"/><path d="M46 6q-2 -8 4 -10" fill="none" stroke="#c9a37a" stroke-width="4"/>' +
    '<path d="M50 2l6 -10 4 8" fill="#ffd23f" stroke="#141a33" stroke-width="1.5"/></g></g>';
}
function crossbar(){
  return '<path d="M560 104V34h170v70" fill="none" stroke="#fff" stroke-width="5"/>' +
    '<g transform="translate(600 34)"><g class="fx-arc1"><circle r="10" fill="#fff" stroke="#141a33" stroke-width="2"/><path d="M0 -4l4 3-1.6 4.6h-4.8L-4 -1z" fill="#141a33"/></g></g>' +
    '<text x="612" y="24" font-family="Verdana,Arial,sans-serif" font-size="18" font-weight="900" fill="#ffd23f" stroke="#141a33" stroke-width="1">DONK</text>';
}
function fish(){
  return '<path d="M360 100q60 -8 120 0" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>' +
    '<g transform="translate(420 70)"><g class="fx-leap"><ellipse rx="22" ry="10" fill="#19c39a" stroke="#141a33" stroke-width="2"/><path d="M-22 0l-12 -10v20z" fill="#19c39a" stroke="#141a33" stroke-width="2"/>' +
    '<circle cx="12" cy="-3" r="2.2" fill="#141a33"/><path d="M14 4q4 2 6 -1" fill="none" stroke="#141a33" stroke-width="1.6"/></g></g>';
}
function ghost(){
  return '<g transform="translate(690 60)"><g class="fx-peek"><path d="M-22 40v-40a22 22 0 0 1 44 0v40l-8 -7-7 7-7 -7-7 7-7 -7z" fill="#fffdf8" stroke="#141a33" stroke-width="2"/>' +
    '<circle cx="-7" cy="-2" r="3" fill="#141a33"/><circle cx="7" cy="-2" r="3" fill="#141a33"/><ellipse cy="9" rx="4" ry="3" fill="#141a33"/>' +
    '<path d="M-22 14l-14 -10" stroke="#141a33" stroke-width="2.5" stroke-linecap="round"/></g></g>';
}
function boom(){
  return '<g transform="translate(400 18)"><g class="fx-dangle"><path d="M0 -60V8" stroke="#141a33" stroke-width="4"/>' +
    '<rect x="-16" y="8" width="32" height="40" rx="14" fill="#5a6480" stroke="#141a33" stroke-width="2.5"/><path d="M-12 18h24M-12 26h24M-12 34h24" stroke="#141a33" stroke-width="1.5" opacity=".6"/></g></g>';
}
function paperball(){
  return '<path d="M640 104l8 -40h44l8 40z" fill="#3a4170" stroke="#141a33" stroke-width="2.5"/>' +
    '<g transform="translate(700 50)"><g class="fx-arc1"><circle r="11" fill="#fffdf8" stroke="#141a33" stroke-width="2"/><path d="M-6 -4l5 3 4 -5M-5 5l6 -2" stroke="#141a33" stroke-width="1.4" fill="none"/></g></g>';
}
function biscuit(){
  return '<path d="M330 66h80v26a16 16 0 0 1-16 16h-48a16 16 0 0 1-16 -16z" fill="#fffdf8" stroke="#141a33" stroke-width="2.5"/><path d="M334 72h72" stroke="#b5743c" stroke-width="6"/>' +
    '<g transform="translate(370 46)"><g class="fx-dip"><rect x="-10" y="-30" width="20" height="40" rx="4" fill="#d9a066" stroke="#141a33" stroke-width="2"/></g></g>' +
    '<g transform="translate(370 70)"><g class="fx-snap"><rect x="-10" y="-4" width="20" height="16" rx="4" fill="#c58a52" stroke="#141a33" stroke-width="2"/></g></g>';
}
var GAGS = {
  pigeon: { draw: pigeon, cap: ["The pigeon has notes.", "Even the pigeon is confused.", "Pigeon says: bold choice."] },
  chicken: { draw: chicken, cap: ["Squeak.", "The rubber chicken has spoken.", "Emotional support chicken deployed."] },
  cloud: { draw: cloud, cap: ["A tiny cloud. Character building.", "Light drizzle of nearly."] },
  sneeze: { draw: poodle, shake: true, cap: ["ACHOO. Bonnie blames the dust.", "Bonnie sneezed and the answer fell off."] },
  wobble: { draw: function(){ return ""; }, wob: true, cap: ["Reality wobbled. Not your fault.", "The universe glitched. Again."] },
  bambi: { draw: bambi, cap: ["Bambi saw nothing. Bambi is too regal.", "Bambi walked past. No comment."] },
  jt: { draw: crossbar, cap: ["Off the bar. The ref is looking into it.", "DONK. Crossbar challenge failed."] },
  hk: { draw: fish, cap: ["A fish laughed. Rude.", "Splash. The lake felt that one."] },
  lc: { draw: ghost, cap: ["Just the caretaker's ghost. He says hi.", "Ghost Gary waves. Go again."] },
  lw: { draw: boom, cap: ["CUT. Take two.", "The boom mic fell in. Classic."] },
  lp: { draw: paperball, cap: ["Missed the bin as well.", "Paper ball 0, bin 1."] },
  egw: { draw: biscuit, cap: ["Biscuit down. We go again.", "Dunked too long. Happens."] }
};
var lastGag = "";
function gag(card, caps){
  if(!card) return;
  addCss();
  var host = card.querySelector(".hp-scene"), band = null;
  if(!host){
    var body = card.querySelector("#qBody") || card;
    band = el("div", "fx-gagband"); body.parentNode.insertBefore(band, body); host = band;
  }
  [].forEach.call(host.querySelectorAll(".fx-gag"), function(g){ g.remove(); });
  var pool = ["pigeon", "chicken", "cloud", "sneeze", "wobble", "bambi", WID, WID];
  var id; do { id = pick(pool); } while(id === lastGag && pool.length > 1);
  lastGag = id;
  var G = GAGS[id];
  var o = el("div", "fx-gag");
  o.setAttribute("aria-hidden", "true");
  o.innerHTML = '<svg viewBox="0 0 760 110" preserveAspectRatio="xMidYMid slice">' + G.draw() + '</svg>' +
    '<div class="fx-cap">' + pick(caps || G.cap) + '</div>';
  host.appendChild(o);
  if(!still()){
    if(G.wob){ host.classList.remove("fx-wob"); void host.offsetWidth; host.classList.add("fx-wob"); }
    if(G.shake){ host.classList.remove("fx-shake"); void host.offsetWidth; host.classList.add("fx-shake"); }
  }
  setTimeout(function(){ o.remove(); host.classList.remove("fx-wob", "fx-shake"); if(band) band.remove(); }, 2700);
}

/* ==========================================================
   Dragging, for Fling it (tiles and sort cards)
   onDrop(x, y, vx, vy, elx) returns a target element, or null to
   spring back. onHover(x, y) to light up targets.
   ========================================================== */
function dragify(node, o){
  node.classList.add("fx-flingable");
  var sx = 0, sy = 0, dx = 0, dy = 0, on = false, moved = false, hist = [], pid = null, suppress = false;
  function down(e){
    if(e.button > 0 || o.off && o.off()) return;
    pid = e.pointerId; on = true; moved = false; sx = e.clientX; sy = e.clientY; dx = dy = 0; hist = [[e.clientX, e.clientY, Date.now()]];
    node.classList.remove("fx-back");
  }
  function move(e){
    if(!on || e.pointerId !== pid) return;
    dx = e.clientX - sx; dy = e.clientY - sy;
    if(!moved && Math.abs(dx) + Math.abs(dy) > 8){
      moved = true; node.classList.add("fx-dragging");
      try{ node.setPointerCapture(pid); }catch(er){}
    }
    if(!moved) return;
    e.preventDefault();
    node.style.transform = "translate(" + dx + "px," + dy + "px) rotate(" + Math.max(-8, Math.min(8, dx / 20)) + "deg)";
    hist.push([e.clientX, e.clientY, Date.now()]); if(hist.length > 6) hist.shift();
    if(o.onHover) o.onHover(e.clientX, e.clientY);
  }
  function up(e){
    if(!on || e.pointerId !== pid) return;
    on = false;
    if(!moved) return;
    suppress = true; setTimeout(function(){ suppress = false; }, 60);
    node.classList.remove("fx-dragging");
    var a = hist[0], b = hist[hist.length - 1], dt = Math.max(1, b[2] - a[2]);
    var vx = (b[0] - a[0]) / dt, vy = (b[1] - a[1]) / dt;
    if(o.onHover) o.onHover(-1, -1);
    node.style.visibility = "hidden";
    var target = o.onDrop(e.clientX, e.clientY, vx, vy);
    node.style.visibility = "";
    if(target){
      var r = target.getBoundingClientRect(), me = node.getBoundingClientRect();
      var tx = dx + (r.left + r.width / 2) - (me.left + me.width / 2), ty = dy + (r.top + r.height / 2) - (me.top + me.height / 2);
      if(still()){ node.style.transform = ""; setTimeout(function(){ o.land(target); }, 80); return; }
      node.classList.add("fx-fly");
      node.style.transform = "translate(" + tx + "px," + ty + "px) scale(.5)";
      setTimeout(function(){ node.classList.remove("fx-fly"); node.style.transform = ""; o.land(target); }, 270);
    }else{
      node.classList.add("fx-back"); node.style.transform = "";
      setTimeout(function(){ node.classList.remove("fx-back"); }, 320);
    }
  }
  node.addEventListener("pointerdown", down);
  node.addEventListener("pointermove", move);
  node.addEventListener("pointerup", up);
  node.addEventListener("pointercancel", function(e){ if(e.pointerId === pid){ on = false; node.classList.remove("fx-dragging"); node.style.transform = ""; } });
  node.addEventListener("click", function(e){ if(suppress){ suppress = false; e.stopImmediatePropagation(); e.preventDefault(); } }, true);
}
/* is the point, or where the throw is heading, inside this element? */
function aimed(target, x, y, vx, vy){
  var r = target.getBoundingClientRect(), pad = 16;
  if(x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad) return true;
  /* a flick: follow the throw for a short way */
  var sp = Math.sqrt(vx * vx + vy * vy);
  if(sp < 0.6) return false;
  for(var t = 40; t <= 420; t += 40){
    var px = x + vx * t, py = y + vy * t;
    if(px >= r.left - pad && px <= r.right + pad && py >= r.top - pad && py <= r.bottom + pad) return true;
  }
  return false;
}

/* ==========================================================
   The step
   ========================================================== */
var curInfo = null, arcBox = null;
function stopArcade(){
  if(!arcBox) return;
  arcBox.classList.remove("fx-arc");
  [].forEach.call(arcBox.querySelectorAll("button"), function(b){ b.style.removeProperty("--x"); b.style.removeProperty("--w"); b.style.removeProperty("--d"); b.style.removeProperty("--t"); b.classList.remove("fx-gone"); });
  var ln = arcBox.querySelector(".fx-arcline"); if(ln) ln.remove();
  arcBox = null;
}
function step(info){
  addCss();
  stopArcade();
  curInfo = info;
  if(!info || !info.s || !info.card) return;
  try{ trail(info); }catch(e){}
  var s = info.s, body = info.body;
  if(s.type === "mc"){
    var box = body.querySelector(".choices");
    if(!box) return;
    if(!info.resolved && !info.api.escape) silly(info, box);
    if(!info.resolved && box.classList.contains("tiles")) modes(info, box, ["tap", "fling", "arcade"]);
  }else if(s.type === "sort" && !info.resolved){
    var pool = body.querySelector(".pool");
    if(pool) modes(info, pool, ["tap", "fling"]);
  }
  if(s.type !== "learn" && s.type !== "draw") pens(body);
}

/* the "Play it" switch: tap, fling or arcade */
function modes(info, box, list){
  var m = mode();
  if(list.indexOf(m) < 0) m = "tap";
  if(still() && m === "arcade") m = "tap";
  var bar = el("div", "fx-modes");
  bar.setAttribute("role", "group"); bar.setAttribute("aria-label", "How to play this one");
  var names = { tap: "Tap", fling: "Fling", arcade: "Arcade" };
  bar.innerHTML = '<span class="fx-ml">' + (EASY ? "Play" : "Play it") + '</span>' + list.filter(function(k){ return !(k === "arcade" && still()); }).map(function(k){
    return '<button type="button" data-m="' + k + '" aria-pressed="' + (k === m) + '">' + IC[k] + names[k] + '</button>';
  }).join("");
  box.parentNode.insertBefore(bar, box);
  bar.onclick = function(e){
    var b = e.target.closest("[data-m]"); if(!b || info.api.resolved()) return;
    setMode(b.dataset.m);
    [].forEach.call(bar.querySelectorAll("button"), function(x){ x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    apply(b.dataset.m);
  };
  var goal = null, wired = false;
  function apply(mm){
    stopArcade();
    box.classList.remove("fx-flingon");
    [].forEach.call(box.querySelectorAll(".fx-flingable"), function(x){ x.classList.remove("fx-flingable"); });
    if(goal){ goal.remove(); goal = null; }
    if(info.s.type === "sort"){
      if(mm === "fling") sortFling(info, box);
      else [].forEach.call(info.body.querySelectorAll(".scard"), function(c){ c.classList.remove("fx-flingable"); });
      return;
    }
    if(mm === "arcade") arcade(info, box);
    if(mm === "fling"){ goal = flingGoal(info, box); }
    if(!wired){
      wired = true;
      /* arcade: a tap on a falling answer is the answer */
      box.addEventListener("click", function(e){
        var b = e.target.closest("button[data-k]");
        if(!b || !box.classList.contains("fx-arc") || info.api.resolved()) return;
        setTimeout(function(){ info.api.check(); if(!info.api.resolved() && b.classList.contains("no")) b.classList.add("fx-gone"); }, 30);
      });
    }
  }
  apply(m);
}
function arcade(info, box){
  var btns = [].slice.call(box.querySelectorAll("button"));
  var n = btns.length; if(!n) return;
  arcBox = box;
  box.classList.add("fx-arc");
  var lanes = n <= 4 ? 2 : 3, w = lanes === 2 ? 46 : 31, dur = (EASY ? 9 : 6.5) + (n > 4 ? 1 : 0);
  var order = btns.map(function(b, k){ return k; }).sort(function(){ return Math.random() - 0.5; });
  order.forEach(function(k, pos){
    var b = btns[k], lane = pos % lanes;
    b.style.setProperty("--x", (lane * (100 / lanes) + (100 / lanes - w) / 2).toFixed(1) + "%");
    b.style.setProperty("--w", w + "%");
    b.style.setProperty("--t", dur + "s");
    b.style.setProperty("--d", (-(pos / n) * dur).toFixed(2) + "s");
  });
  box.appendChild(el("div", "fx-arcline"));
}
function flingGoal(info, box){
  var G = GOALS[WID] || GOALS.egw;
  var goal = el("div", "fx-goal", G.svg + '<span>' + (EASY ? "Fling it here" : G.t) + '</span>');
  goal.setAttribute("aria-hidden", "true");
  box.parentNode.insertBefore(goal, box);
  box.classList.add("fx-flingon");
  [].forEach.call(box.querySelectorAll("button[data-k],button.fx-silly"), function(b){
    if(b.dataset.fx){ b.classList.add("fx-flingable"); return; }
    b.dataset.fx = "1";
    dragify(b, {
      off: function(){ return !box.classList.contains("fx-flingon") || info.api.resolved(); },
      onHover: function(x, y){ goal.classList.toggle("fx-hot", x >= 0 && aimed(goal, x, y, 0, 0)); },
      onDrop: function(x, y, vx, vy){ return aimed(goal, x, y, vx, vy) ? goal : null; },
      land: function(){
        goal.classList.remove("fx-gulp"); void goal.offsetWidth; goal.classList.add("fx-gulp");
        b.click();
        if(b.dataset.k != null) setTimeout(function(){ info.api.check(); }, 40);
      }
    });
  });
  return goal;
}
function sortFling(info, pool){
  var body = info.body;
  var bins = [].slice.call(body.querySelectorAll(".bin"));
  [].forEach.call(body.querySelectorAll(".scard"), function(c){
    if(c.dataset.fx){ c.classList.add("fx-flingable"); return; }
    c.dataset.fx = "1";
    dragify(c, {
      off: function(){ return mode() !== "fling" || info.api.resolved(); },
      onHover: function(x, y){ bins.forEach(function(b){ b.classList.toggle("fx-hot", x >= 0 && aimed(b, x, y, 0, 0)); }); },
      onDrop: function(x, y, vx, vy){
        var hit = null;
        bins.forEach(function(b){ if(!hit && aimed(b, x, y, 0, 0)) hit = b; });
        if(!hit) bins.forEach(function(b){ if(!hit && aimed(b, x, y, vx, vy)) hit = b; });
        if(!hit && aimed(pool, x, y, 0, 0) && c.parentNode !== pool) hit = pool;
        return hit;
      },
      land: function(t){
        if(t === pool){ c.click(); return; }
        if(c.parentNode !== pool) c.click();   /* take it out of the box it was in */
        c.click();                              /* pick it up */
        t.click();                              /* and drop it in */
      }
    });
  });
}

/* 41: one silly tile in the answers, seeded so it stays put */
function silly(info, box){
  var s = info.s;
  if(!s.options || s.options.length > 5 || box.querySelector(".fx-silly")) return;
  var seed = seeded(location.pathname + "|" + info.i + "|" + stripText(s.q || ""));
  var txt = SILLY[seed % SILLY.length];
  if(s.options.some(function(o){ return stripText(o).toLowerCase() === txt.toLowerCase(); })) return;
  var b = el("button", "fx-silly", txt.replace(/&/g, "&amp;").replace(/</g, "&lt;"));
  b.type = "button";
  var kids = box.querySelectorAll("button");
  var at = (seed >>> 8) % (kids.length + 1);
  if(at >= kids.length) box.appendChild(b); else box.insertBefore(b, kids[at]);
  var nOld = s.options.length;
  if(box.classList.contains("tiles")){ box.classList.remove("n" + nOld); box.classList.add("n" + (nOld + 1)); }
  b.addEventListener("click", function(e){
    e.stopPropagation();
    if(b.classList.contains("fx-veto")) return;
    b.appendChild(el("span", "fx-stamp", pick(VETO)));
    b.classList.add("fx-veto");
    gag(info.card, SILLY_CAPS);
    setTimeout(function(){ b.remove(); }, still() ? 600 : 1050);
  });
}
function stripText(h){ var t = d.createElement("div"); t.innerHTML = String(h); return (t.textContent || "").trim(); }

/* 39: the chunk as a little trail */
var lastTok = {};
function trail(info){
  var card = info.card, dots = card.querySelector("#dots");
  if(!dots) return;
  var host = card.querySelector(".fx-trail");
  if(!host){ host = el("div", "fx-trail"); host.setAttribute("aria-hidden", "true"); dots.parentNode.insertBefore(host, dots.nextSibling); }
  card.classList.add("fx-hasmap");
  var list = info.steps || [], n = list.length, at = info.i - info.from;
  var W = (card.clientWidth || 600) < 560 ? 400 : 600, pts = [];
  for(var k = 0; k < n; k++){
    var x = n === 1 ? W / 2 : 18 + k * (W - 36) / (n - 1);
    pts.push([x, 26 + Math.sin(k * 1.3 + 0.6) * 9]);
  }
  var path = "";
  pts.forEach(function(p, k){
    if(!k){ path += "M" + p[0].toFixed(1) + " " + p[1].toFixed(1); return; }
    var q = pts[k - 1], mx = (q[0] + p[0]) / 2;
    path += "C" + mx.toFixed(1) + " " + q[1].toFixed(1) + " " + mx.toFixed(1) + " " + p[1].toFixed(1) + " " + p[0].toFixed(1) + " " + p[1].toFixed(1);
  });
  var stops = pts.map(function(p, k){
    var st = list[k] || {}, past = k < at, now = k === at;
    var good = st.status === "right1" || st.status === "right2" || st.status === "done";
    if(st.boss) return '<g transform="translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')"><path d="M-2 10V-16" stroke="#141a33" stroke-width="2.5"/><path d="M-1 -16h16l-5 6 5 6h-16z" fill="' + (good ? "#1f9d63" : "#ef7724") + '" stroke="#141a33" stroke-width="1.5"/></g>';
    var r = st.learn ? 4 : 7;
    var fill = past || (now && good) ? (good ? "#ffd23f" : "#c9cfdc") : "#fffdf8";
    return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + r + '" fill="' + fill + '" stroke="#141a33" stroke-width="' + (st.learn ? 1.5 : 2) + '"/>';
  }).join("");
  var key = info.k, from = lastTok[key] != null ? lastTok[key] : Math.max(0, at - 1);
  var pA = pts[Math.max(0, Math.min(n - 1, from))] || [0, 0], pB = pts[Math.max(0, Math.min(n - 1, at))] || [0, 0];
  host.innerHTML = '<svg viewBox="0 0 ' + W + ' 50" preserveAspectRatio="xMidYMid meet">' +
    '<path d="' + path + '" fill="none" stroke="rgba(20,26,51,.28)" stroke-width="4" stroke-dasharray="2 9" stroke-linecap="round" vector-effect="non-scaling-stroke"/>' +
    stops + '<g class="fx-tok" style="transform:translate(' + pA[0].toFixed(1) + 'px,' + (pA[1] - 4).toFixed(1) + 'px)"><g>' + (TOKENS[WID] || TOKENS.egw) + '</g></g></svg>';
  lastTok[key] = at;
  var tok = host.querySelector(".fx-tok");
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ tok.style.transform = "translate(" + pB[0].toFixed(1) + "px," + (pB[1] - 4).toFixed(1) + "px)"; }); });
}

/* ==========================================================
   45 Draw it: ink straight onto a picture's own svg
   ========================================================== */
function svgPt(svg, e){
  var m = svg.getScreenCTM(); if(!m) return null;
  var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
  var p = pt.matrixTransform(m.inverse());
  return [Math.round(p.x * 10) / 10, Math.round(p.y * 10) / 10];
}
function ink(svg, o){
  o = o || {};
  var g = d.createElementNS(NS, "g"); g.setAttribute("class", "fx-ink"); svg.appendChild(g);
  var vb = svg.viewBox && svg.viewBox.baseVal, unit = vb && vb.width ? vb.width / 110 : 3;
  var strokes = [], pts = null, line = null, on = o.on !== false, pid = null;
  function drawOne(st){
    if(st.length === 1){
      var c = d.createElementNS(NS, "circle"); c.setAttribute("cx", st[0][0]); c.setAttribute("cy", st[0][1]); c.setAttribute("r", unit * 1.6); g.appendChild(c); return c;
    }
    var l = d.createElementNS(NS, "polyline"); l.setAttribute("points", st.map(function(p){ return p.join(","); }).join(" ")); l.setAttribute("stroke-width", unit * 1.3); g.appendChild(l); return l;
  }
  svg.addEventListener("pointerdown", function(e){
    if(!on || e.button > 0) return;
    var p = svgPt(svg, e); if(!p) return;
    e.preventDefault(); pid = e.pointerId;
    try{ svg.setPointerCapture(pid); }catch(er){}
    pts = [p]; line = null;
  });
  svg.addEventListener("pointermove", function(e){
    if(!pts || e.pointerId !== pid) return;
    var p = svgPt(svg, e); if(!p) return;
    var q = pts[pts.length - 1];
    if(Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) < unit * 0.6) return;
    pts.push(p);
    if(line) line.remove();
    line = drawOne(pts);
  });
  function end(e){
    if(!pts || e.pointerId !== pid) return;
    if(line) line.remove();
    drawOne(pts); strokes.push(pts); pts = null; line = null;
    if(o.change) o.change(strokes);
  }
  svg.addEventListener("pointerup", end);
  svg.addEventListener("pointercancel", end);
  return {
    strokes: function(){ return strokes; },
    clear: function(){ strokes = []; g.innerHTML = ""; if(o.change) o.change(strokes); },
    set: function(list){ strokes = []; g.innerHTML = ""; (list || []).forEach(function(st){ if(st && st.length){ strokes.push(st); drawOne(st); } }); },
    enable: function(b){ on = !!b; }
  };
}
/* a pen on every picture in a question: for working out and circling, never marked */
function pens(body){
  [].forEach.call(body.querySelectorAll(".fig"), function(f){
    var svg = f.querySelector("svg");
    if(!svg || f.dataset.fxpen || !svg.getScreenCTM) return;
    f.dataset.fxpen = "1";
    f.classList.add("fx-penfig");
    var L = null;
    var b = el("button", "fx-pen", IC.pen + (EASY ? "Draw" : "Draw on it")); b.type = "button"; b.setAttribute("aria-pressed", "false");
    var c = el("button", "fx-pen fx-penclr hidden", "Clear"); c.type = "button";
    b.onclick = function(){
      var now = b.getAttribute("aria-pressed") !== "true";
      if(!L) L = ink(svg, { on: now, change: function(st){ c.classList.toggle("hidden", !st.length); } });
      L.enable(now);
      b.setAttribute("aria-pressed", now ? "true" : "false");
      f.classList.toggle("fx-inkon", now);
    };
    c.onclick = function(){ if(L) L.clear(); };
    f.appendChild(b); f.appendChild(c);
  });
}

/* the "draw" step type: ring, tick or tap the right parts of a picture */
function centreOf(st){
  var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  st.forEach(function(p){ x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
  return [(x0 + x1) / 2, (y0 + y1) / 2];
}
function drawType(s, body, i, api){
  body.innerHTML = '<div class="prompt">' + s.q + '</div>' +
    '<div class="fig fx-drawfig">' + (s.fig || "") + '</div>' +
    '<div class="fx-drawbar"><button type="button" class="btn btn-quiet fx-clr">Clear</button><span class="tiny">' +
    (s.tip || (EASY ? "Ring it with your finger." : "Draw a ring round it with your finger, or tap it.")) + '</span></div>';
  addCss();
  var svg = body.querySelector(".fx-drawfig svg");
  if(!svg) return null;
  var marks = d.createElementNS(NS, "g"); svg.appendChild(marks);
  var L = ink(svg, { change: function(){ marks.innerHTML = ""; } });
  body.querySelector(".fx-clr").onclick = function(){ if(!api.resolved()) L.clear(); };
  var zones = s.zones || [];
  function hits(){
    var h = {};
    L.strokes().forEach(function(st){
      var c = centreOf(st);
      zones.forEach(function(z, zi){ if(c[0] >= z.x && c[0] <= z.x + z.w && c[1] >= z.y && c[1] <= z.y + z.h) h[zi] = 1; });
    });
    return h;
  }
  function rect(z, cls){
    var r = d.createElementNS(NS, "rect");
    r.setAttribute("x", z.x - 3); r.setAttribute("y", z.y - 3); r.setAttribute("width", z.w + 6); r.setAttribute("height", z.h + 6);
    r.setAttribute("rx", 8); r.setAttribute("class", "fx-zone " + cls); marks.appendChild(r);
  }
  return {
    get: function(){ return L.strokes(); },
    empty: function(){ return !L.strokes().length; },
    emptyMsg: EASY ? "Draw on the picture first, or tap Skip." : "Draw on the picture first, or tap Skip for now.",
    right: function(){
      var h = hits(), okz = [], bad = false;
      zones.forEach(function(z, zi){ if(z.ok) okz.push(zi); else if(h[zi]) bad = true; });
      var got = okz.filter(function(zi){ return h[zi]; }).length;
      return !bad && got >= (s.need || okz.length);
    },
    mark: function(final){
      marks.innerHTML = "";
      var h = hits();
      zones.forEach(function(z, zi){
        if(h[zi] && !z.ok) rect(z, "no");
        else if(h[zi] && z.ok) rect(z, "ok");
        else if(final && z.ok) rect(z, "ok");
      });
    },
    restore: function(v, fin){ L.set(v || []); if(fin) this.mark(true); }
  };
}

/* ==========================================================
   46 Find it
   ========================================================== */
var FINDS = {
  maths: ["a right angle", "something shaped like a cylinder", "a number bigger than 100", "something about 30 cm long", "a pattern that repeats",
    "a price ending in 99p", "something with exactly one line of symmetry", "two lines that are parallel", "something split into equal parts",
    "a clock, and the time on it", "a shape with six sides", "something that weighs about a kilogram", "a scale on something (a ruler, a jug, a dial)"],
  english: ["a question mark out in the wild", "an apostrophe on a sign or a box", "a word with ten letters or more", "an instruction on a label",
    "a capital letter that is not at the start of a sentence", "a brand name that is a made up word", "a word that rhymes with Jay",
    "a sentence trying to sell you something", "an exclamation mark that did not need to be there", "a word you could swap for a better one"],
  science: ["something living that is not a person", "something that was alive once", "a material you can see through", "something that uses electricity",
    "something that is changing temperature", "something a magnet would stick to", "a plant, and which way it is leaning"],
  other: ["something older than you", "something that would not have existed in 1851", "something made in another country",
    "something that will still be around in a hundred years", "the oldest looking thing in the room", "something a time traveller from 1066 would be baffled by",
    "something that used to be done by hand", "something that has been fixed or mended"]
};
function bankFor(subject){
  var s = String(subject || "").toLowerCase();
  if(/math|stat/.test(s)) return FINDS.maths;
  if(/eng/.test(s)) return FINDS.english;
  if(/sci|bio|plant/.test(s)) return FINDS.science;
  return FINDS.other;
}
function foundCount(){ var f = readJ(FOUND_KEY, null); return f && f.n ? f.n : 0; }
function noteFound(what, photo){
  var f = readJ(FOUND_KEY, null) || { n: 0, last: [] };
  f.n = (f.n || 0) + 1;
  f.last = [{ what: what, photo: !!photo, at: new Date().toISOString() }].concat(f.last || []).slice(0, 12);
  writeJ(FOUND_KEY, f);
}
/* a photo shown on the card only: never saved, never sent */
function photoInput(onPic){
  var inp = el("input"); inp.type = "file"; inp.accept = "image/*"; inp.setAttribute("capture", "environment"); inp.style.display = "none";
  inp.onchange = function(){
    var f = inp.files && inp.files[0]; if(!f) return;
    var url = URL.createObjectURL(f);
    onPic(url);
  };
  return inp;
}
function findBox(subject, seedStr, done){
  var bank = bankFor(subject), k = seeded(seedStr) % bank.length;
  var box = el("div", "fx-find");
  function draw(){
    var what = bank[k];
    box.innerHTML = '<h4>' + IC.find + 'Find it <span class="tiny" style="font-weight:500;margin:0">(only if you fancy it)</span></h4>' +
      '<div class="fx-what">' + (EASY ? "" : "Can you find ") + what + (EASY ? "" : " in the room?") + '</div>' +
      '<div class="fx-row"><button type="button" class="btn btn-orange" data-f="snap">' + IC.cam + ' Snap it</button>' +
      '<button type="button" class="btn btn-quiet" data-f="yes">Found one</button>' +
      '<button type="button" class="fx-shuffle" data-f="swap">Give me a different one</button></div>' +
      '<p class="tiny">' + (EASY ? "Just the thing. No people." : "Just the thing, no people in it. The photo stays on this screen and is gone when you close the page.") + '</p>';
    var inp = photoInput(function(url){ win(what, url); });
    box.appendChild(inp);
    box.onclick = function(e){
      var b = e.target.closest("[data-f]"); if(!b) return;
      if(b.dataset.f === "swap"){ k = (k + 1 + Math.floor(Math.random() * (bank.length - 1))) % bank.length; draw(); }
      else if(b.dataset.f === "snap") inp.click();
      else win(what, null);
    };
  }
  function win(what, url){
    noteFound(what, !!url);
    box.onclick = null;
    var n = foundCount();
    box.innerHTML = '<h4>' + IC.find + 'Found it</h4><div class="fx-found">' + (url ? '<img alt="Your photo of ' + what + '" src="' + url + '">' : '') +
      '<div><span class="fx-foundstamp">FOUND</span><p style="margin:8px 0 0">' + what.charAt(0).toUpperCase() + what.slice(1) + '.</p>' +
      '<p class="tiny" style="margin:4px 0 0">' + (n > 1 ? n + " real world finds so far." : "Your first real world find.") + '</p></div></div>';
    if(done) done(what, url);
  }
  draw();
  return box;
}
/* at the end of a chunk: the Find it card, now and then */
function chunkEnd(card, info){
  addCss();
  if(!card) return;
  [].forEach.call(card.querySelectorAll(".fx-find"), function(x){ x.remove(); });
  if(window.B5Site && window.B5Site.guest) return;
  /* every other chunk, so it stays a surprise */
  var seed = seeded((info.id || location.pathname) + "|" + info.k + "|" + new Date().toDateString());
  if(seed % 2) return;
  var box = findBox(info.subject, (info.id || "") + "|" + info.k + "|" + info.topic, null);
  var host = card.querySelector(".hp-endhost") || card.querySelector("#chunkTally");
  if(host && host.parentNode) host.parentNode.insertBefore(box, host.nextSibling); else card.appendChild(box);
}
/* the "find" step type */
function findType(s, body, i, api){
  body.innerHTML = '<div class="prompt">' + s.q + '</div>';
  addCss();
  var got = false;
  var box = el("div", "fx-find");
  box.style.margin = "8px 0";
  box.innerHTML = '<div class="fx-row"><button type="button" class="btn btn-orange" data-f="snap">' + IC.cam + ' Snap it</button>' +
    '<button type="button" class="btn btn-quiet" data-f="yes">Found one</button></div>' +
    '<p class="tiny">' + (EASY ? "Just the thing. No people." : "Just the thing, no people in it. The photo stays on this screen only.") + '</p>';
  var inp = photoInput(function(url){ win(url); });
  box.appendChild(inp);
  function win(url){
    got = true;
    noteFound(stripText(s.q), !!url);
    var row = box.querySelector(".fx-row");
    if(row) row.outerHTML = '<div class="fx-found">' + (url ? '<img alt="Your photo" src="' + url + '">' : '') + '<span class="fx-foundstamp">FOUND</span></div>';
    setTimeout(function(){ api.check(); }, 350);
  }
  box.onclick = function(e){
    var b = e.target.closest("[data-f]"); if(!b || api.resolved()) return;
    if(b.dataset.f === "snap") inp.click(); else win(null);
  };
  body.appendChild(box);
  return {
    get: function(){ return got ? 1 : 0; },
    empty: function(){ return !got; },
    emptyMsg: "Snap it or tap Found one, or Skip for now.",
    right: function(){ return got; },
    mark: function(){},
    restore: function(v, fin){ if(v || fin){ got = true; var row = box.querySelector(".fx-row"); if(row) row.outerHTML = '<div class="fx-found"><span class="fx-foundstamp">FOUND</span></div>'; } }
  };
}

/* ==========================================================
   Hooks from the engine
   ========================================================== */
function miss(info){
  if(!info) return;
  gag(info.card);
}
function result(info){
  if(!info) return;
  stopArcade();
  var c = info.card && info.card.querySelector(".fx-goal");
  if(c) c.remove();
  if(info.card) [].forEach.call(info.card.querySelectorAll(".fx-modes,.fx-silly"), function(m){ m.remove(); });
  if(curInfo && info.card){
    /* the trail token's stop lights up */
    try{
      var st = curInfo.steps[curInfo.i - curInfo.from]; if(st) st.status = info.status;
      trail(curInfo);
    }catch(e){}
  }
}

window.HQFun = { step: step, miss: miss, result: result, chunkEnd: chunkEnd, gag: gag,
  types: { draw: drawType, find: findType }, v: 1 };
})();
