/* ==========================================================
   JT's Training Ground - Penalty Shootout (v2, Autumn 2 2026)
   A pop up penalty game. JT's XI (red and white) step up to
   the spot under the floodlights.

   Modes
     Quick shootout  keep scoring to build a streak; every fifth
                     kick JT can go in goal instead (the old game).
     Cup run         five rounds against rival keepers with their
                     own personalities and tells, ending in a
                     final, a trophy lift and fireworks. Losing a
                     tie never ends the run: replays are allowed.
     Wall of Gloves  (unlocks) JT in goal for ten kicks.
   Shooting: flick up from the ball, or tap the goal then tap
   again on the power bar (green is the sweet spot). Trick shots
   unlock with their own controls (Panenka, Top bins, Rabona,
   Stutter step). In goal: tap to start the run up, then tap
   where the ball is going; it all goes slow mo once it is hit.

   Unlocks over the term (HQGame.ladder), a weekly era world
   (HQGame.era) with its own silly rule, and a few Jay and Bonnie
   secrets that are never required and never scored.

   Home page:  <script src="/jt-hq/penalty.js?v=2" data-button="1"></script>
               (adds a "Take a penalty" button and a one line note to .hero)
   Any page:   window.JTPenalty.open() opens the game.
   Saves in b5.jthq.penalty.v1 on this device ({ best, games, sound }
   from v1 are kept; the rest is added alongside).
   Everything is drawn in code. ASCII only in this file.
   ========================================================== */
(function () {
'use strict';
if (window.JTPenalty) return;

var KEY = 'b5.jthq.penalty.v1';
var PREFIX = 'b5.jthq.';
var GAME = 'Penalty Shootout';
var RED = '#e4002b', GREEN = '#2fbf71', GOLD = '#ffc72c', INK = '#10231a', AMBER = '#ffad3b';
var HW = 3.66, GHM = 2.44, BALL = 0.11;   /* half goal width, goal height, ball radius (metres) */
var SPOT = 11;                            /* metres from the goal line */
var SB = 2.2, KP = SB - 1;                /* the ball looks 2.2 times bigger on the spot than on the line */
var TAU = Math.PI * 2;
var DISP = 'Oswald,"Arial Narrow",Arial,system-ui,sans-serif';
var me = document.currentScript;
var WITH_BUTTON = !!(me && me.getAttribute('data-button') && me.getAttribute('data-button') !== '0');
var TEST = /[?&](jttest|hqtest)(=|&|$)/.test(location.search);

/* ---------- storage (same key as v1; old fields kept) ---------- */
var store = {
  v: 2, best: 0, games: 0, sound: true,
  cups: 0, cupRound: 0, ties: 0, gloves: 0, goals: 0, tricks: 0, scarabs: 0, saves: 0,
  eq: { kit: 'home', ball: 'classic', boots: 'classic', celeb: 'knee', stad: 'era' },
  seen: [], secrets: {}, eras: [], lastEra: ''
};
function isStr(s) { return typeof s === 'string' && s.length < 40; }
function loadStore() {
  try {
    var o = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!o || typeof o !== 'object') return;
    ['best', 'games', 'cups', 'cupRound', 'ties', 'gloves', 'goals', 'tricks', 'scarabs', 'saves'].forEach(function (k) {
      if (isFinite(o[k])) store[k] = Math.max(0, Math.floor(o[k]));
    });
    store.cupRound = Math.min(4, store.cupRound);
    if (typeof o.sound === 'boolean') store.sound = o.sound;
    if (o.eq && typeof o.eq === 'object') for (var k in store.eq) if (isStr(o.eq[k])) store.eq[k] = o.eq[k];
    if (Array.isArray(o.seen)) store.seen = o.seen.filter(isStr).slice(0, 80);
    if (o.secrets && typeof o.secrets === 'object') for (var s in o.secrets) if (o.secrets[s] && isStr(s)) store.secrets[s] = 1;
    if (Array.isArray(o.eras)) store.eras = o.eras.filter(isStr).slice(0, 12);
    if (isStr(o.lastEra)) store.lastEra = o.lastEra;
    if (Array.isArray(o.cupDraw) && o.cupDraw.length === 5) store.cupDraw = o.cupDraw.filter(isStr);
  } catch (e) {}
}
function saveStore() {
  try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
}
loadStore();

/* ---------- small helpers ---------- */
function rnd(a, b) { return a + Math.random() * (b - a); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function lerp(a, b, t) { return a + (b - a) * t; }
function gauss() { return (Math.random() + Math.random() + Math.random() - 1.5) * 2; }
function sgn(v) { return v < 0 ? -1 : 1; }
function ease(p) { return 1 - (1 - p) * (1 - p); }
var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
var FINE = !!(window.matchMedia && matchMedia('(pointer: fine)').matches);

/* test overrides (only used through the test hook) */
var T = { keeper: null, striker: null, strikerMiss: null, meter: null, spread: true, speed: 1, power: null, dog: null };

/* ---------- styles ---------- */
var css = document.createElement('style');
css.textContent =
'html body>.jtpen{position:fixed !important;z-index:2147483000 !important;inset:0 !important}' +
'.jtpen{display:flex;flex-direction:column;align-items:center;margin:0;padding:0 0 8px;overflow:hidden;' +
'color:#f6fbf7;font-family:var(--body,"Atkinson Hyperlegible",Verdana,system-ui,sans-serif);' +
'background:radial-gradient(60% 50% at 0% 0%,rgba(255,255,230,.16),transparent 70%),radial-gradient(60% 50% at 100% 0%,rgba(255,255,230,.16),transparent 70%),radial-gradient(90% 60% at 50% 110%,rgba(47,191,113,.22),transparent 60%),#0a1f13;' +
'background-color:#0a1f13;overscroll-behavior:contain;-webkit-tap-highlight-color:transparent}' +
'.jtpen *{box-sizing:border-box}' +
'.jtpen button{font-family:' + DISP + ';cursor:pointer;-webkit-user-select:none;user-select:none}' +
'.jtpen button:focus-visible{outline:3px solid ' + GOLD + ';outline-offset:3px}' +
'.jtp-bar{width:100%;max-width:900px;display:flex;align-items:center;gap:8px;padding:10px 12px}' +
/* room for the break clock pill that /data/hqbreak.js pins at the top */
'body:has(.hqw-pill:not([hidden])) .jtp-bar{padding-top:50px}' +
'.jtp-title{flex:1;min-width:0;display:flex;align-items:center;gap:10px;font-family:' + DISP + ';font-weight:700;font-size:1.25rem;letter-spacing:.03em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
'.jtp-title canvas{width:30px;height:30px;flex:none}' +
'.jtp-title span{overflow:hidden;text-overflow:ellipsis}' +
'.jtp-tb{min-height:46px;padding:8px 13px;border-radius:12px;border:2px solid rgba(255,255,255,.28);background:rgba(255,255,255,.08);color:inherit;font-weight:600;font-size:.98rem;line-height:1.1;letter-spacing:.02em}' +
'.jtp-tb:hover{background:rgba(255,255,255,.16)}' +
'.jtp-tb[aria-pressed="false"]{opacity:.7}' +
'.jtp-tb[hidden]{display:none}' +
'.jtp-x{min-height:50px;padding:8px 18px;border-radius:14px;border:3px solid ' + INK + ';background:#fff;color:' + INK + ';font-weight:700;font-size:1.08rem;box-shadow:0 4px 0 rgba(0,0,0,.4)}' +
'.jtp-x:hover{background:' + GOLD + '}' +
'.jtp-stage{position:relative;flex:none;border-radius:16px;overflow:hidden;box-shadow:0 0 0 3px rgba(255,255,255,.14),0 14px 40px rgba(0,0,0,.5);background:#123a22}' +
'.jtp-stage canvas.jtp-cv{display:block;touch-action:none;-webkit-user-select:none;user-select:none;cursor:crosshair}' +
'.jtp-stage:after{content:"";position:absolute;left:0;right:0;top:0;height:80px;pointer-events:none;background:linear-gradient(rgba(4,14,8,.5),transparent)}' +
'.jtp-hud{position:absolute;left:0;right:0;top:0;z-index:2;display:flex;justify-content:space-between;align-items:flex-start;gap:8px;padding:8px 12px;pointer-events:none;font-family:' + DISP + ';color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.5)}' +
'.jtp-hud[hidden]{display:none}' +
'.jtp-score b{display:block;font-size:2.6rem;line-height:1;font-weight:700}' +
'.jtp-score span{display:block;font-size:.8rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#ffe9a8}' +
'.jtp-best{margin-top:4px;padding:5px 12px;border-radius:999px;background:rgba(0,0,0,.42);font-size:.95rem;font-weight:600;letter-spacing:.04em;white-space:nowrap}' +
'.jtp-best b{color:' + GOLD + ';font-size:1.1rem}' +
'.jtp-best.hot{background:' + GOLD + ';color:' + INK + ';text-shadow:none}.jtp-best.hot b{color:' + INK + '}' +
'.jtp-sb{display:flex;align-items:center;gap:8px;padding:5px 10px;border-radius:12px;background:rgba(0,0,0,.45);font-size:1.05rem;font-weight:700;letter-spacing:.04em;white-space:nowrap}' +
'.jtp-sb b{font-size:1.6rem;line-height:1;min-width:.7em;text-align:center}' +
'.jtp-sb i{font-style:normal;opacity:.7}' +
'.jtp-sw{display:inline-block;width:12px;height:12px;border-radius:3px;border:2px solid rgba(255,255,255,.8);vertical-align:middle}' +
'.jtp-pips{display:grid;grid-template-columns:auto auto;gap:3px 6px;margin-top:5px;align-items:center;font-size:.72rem;letter-spacing:.06em}' +
'.jtp-pips span{display:flex;gap:4px}' +
'.jtp-pip{width:12px;height:12px;border-radius:50%;border:2px solid rgba(255,255,255,.35);background:transparent;display:inline-block}' +
'.jtp-pip.g{background:' + GREEN + ';border-color:#c9f2d4}' +
'.jtp-pip.m{border-color:' + AMBER + ';background:rgba(255,173,59,.18)}' +
'.jtp-rnd{text-align:right}' +
'.jtp-rnd small{display:block;margin-top:4px;font-size:.82rem;font-weight:600;letter-spacing:.06em;color:#ffe9a8}' +
'.jtp-hint{position:absolute;left:50%;top:50%;z-index:2;transform:translateX(-50%);width:max-content;max-width:min(92%,460px);padding:8px 14px;border-radius:12px;background:rgba(6,20,12,.84);border:1px solid rgba(255,255,255,.16);color:#fff;font-size:.95rem;line-height:1.35;text-align:center;pointer-events:none;transition:opacity .4s}' +
'.jtp-hint.gone{opacity:0}' +
'.jtp-toast{position:absolute;left:50%;top:12px;z-index:3;transform:translateX(-50%);display:flex;align-items:center;gap:6px;white-space:nowrap;padding:6px 14px;border-radius:999px;background:' + GOLD + ';color:' + INK + ';font-family:' + DISP + ';font-weight:700;font-size:1.05rem;letter-spacing:.03em;pointer-events:none;opacity:0;transition:opacity .35s;box-shadow:0 3px 0 rgba(0,0,0,.35)}' +
'.jtp-toast svg{width:20px;height:20px;flex:none}' +
'.jtp-toast.on{opacity:1}' +
'.jtp-banner{position:absolute;left:0;right:0;top:30%;z-index:3;text-align:center;pointer-events:none;font-family:' + DISP + ';font-weight:700;font-size:clamp(3rem,14vw,5.4rem);line-height:1;letter-spacing:.04em;color:#fff;opacity:0;' +
'text-shadow:0 0 0 #000,4px 4px 0 ' + RED + ',-2px -2px 0 ' + RED + ',2px -2px 0 ' + RED + ',-2px 2px 0 ' + RED + ',0 10px 30px rgba(0,0,0,.45)}' +
'.jtp-banner.k-save{color:' + GOLD + ';text-shadow:4px 4px 0 ' + INK + ',-2px -2px 0 ' + INK + ',2px -2px 0 ' + INK + ',-2px 2px 0 ' + INK + ',0 10px 30px rgba(0,0,0,.45)}' +
'.jtp-banner.on{opacity:1;animation:jtpban .6s cubic-bezier(.2,1.6,.4,1) both}' +
'.jtp-banner small{display:table;margin:10px auto 0;padding:4px 14px;border-radius:999px;background:rgba(6,20,12,.78);font-size:clamp(1rem,4.4vw,1.35rem);letter-spacing:.05em;text-shadow:none;color:#fff}' +
'@keyframes jtpban{0%{transform:scale(.3) rotate(-6deg);opacity:0}60%{opacity:1}100%{transform:scale(1) rotate(-2deg);opacity:1}}' +
'.jtp-ribbon{position:absolute;left:50%;top:56px;z-index:3;transform:translateX(-50%);width:max-content;max-width:calc(100% - 24px);padding:8px 16px 9px;border-radius:14px;background:rgba(6,20,12,.88);border:2px solid ' + GOLD + ';text-align:center;pointer-events:none;opacity:0;transition:opacity .5s}' +
'.jtp-ribbon.on{opacity:1}' +
'.jtp-ribbon b{display:block;font-family:' + DISP + ';font-size:1.25rem;letter-spacing:.06em;text-transform:uppercase;color:' + GOLD + '}' +
'.jtp-ribbon span{display:block;font-size:.95rem;line-height:1.3}' +
'.jtp-card{position:absolute;left:50%;top:50%;z-index:4;transform:translate(-50%,-50%);width:min(90%,350px);max-height:calc(100% - 20px);overflow:auto;padding:18px 18px 14px;border-radius:22px;background:#fff;color:' + INK + ';text-align:center;border:4px solid ' + INK + ';box-shadow:0 8px 0 rgba(0,0,0,.35),0 20px 50px rgba(0,0,0,.4)}' +
'.jtp-card[hidden]{display:none}' +
'.jtp-card.wide{width:min(94%,430px)}' +
'.jtp-card canvas{display:block;margin:0 auto 4px}' +
'.jtp-card h2{margin:0;font-family:' + DISP + ';font-weight:700;font-size:2.1rem;line-height:1.05;letter-spacing:.02em;text-transform:uppercase}' +
'.jtp-card h3{margin:2px 0 0;font-family:' + DISP + ';font-weight:600;font-size:1.05rem;letter-spacing:.08em;text-transform:uppercase;color:#3d5b47}' +
'.jtp-card p{margin:6px 0 0;font-size:1rem;line-height:1.4}' +
'.jtp-badge{display:inline-flex;align-items:center;gap:6px;margin:0 0 8px;padding:4px 12px;border-radius:999px;background:' + GOLD + ';border:2px solid ' + INK + ';font-family:' + DISP + ';font-weight:700;font-size:1rem;letter-spacing:.03em}' +
'.jtp-badge svg{width:20px;height:20px}' +
'.jtp-pop{animation:jtppop .55s cubic-bezier(.2,1.6,.4,1) both}' +
'@keyframes jtppop{0%{transform:scale(.4) rotate(-8deg)}100%{transform:scale(1) rotate(-3deg)}}' +
'.jtp-nums{display:flex;justify-content:center;gap:12px;margin:12px 0 14px}' +
'.jtp-nums div{min-width:96px;padding:6px 10px;border-radius:14px;background:#f1f7f3;border:2px solid #cfe5d7}' +
'.jtp-nums span{display:block;font-size:.8rem;font-weight:700;color:#3d5b47;text-transform:uppercase;letter-spacing:.08em}' +
'.jtp-nums b{display:block;font-family:' + DISP + ';font-size:1.9rem;line-height:1.1}' +
'.jtp-go{display:block;width:100%;min-height:58px;border-radius:16px;border:3px solid ' + INK + ';background:' + RED + ';color:#fff;font-weight:700;font-size:1.5rem;letter-spacing:.06em;text-transform:uppercase;box-shadow:0 5px 0 ' + INK + '}' +
'.jtp-go:hover{background:#ff1a45}.jtp-go:active{transform:translateY(3px);box-shadow:0 2px 0 ' + INK + '}' +
'.jtp-c2{display:block;width:100%;margin-top:10px;min-height:46px;border-radius:14px;border:2px solid #b7c9bd;background:transparent;color:' + INK + ';font-weight:600;font-size:1.05rem;letter-spacing:.03em}' +
'.jtp-c2:hover{background:#f1f7f3}' +
'.jtp-tip{font-size:.85rem !important;color:#4d6456;margin-top:8px !important}' +
/* the hub */
'.jtp-era{display:inline-block;margin:0 0 6px;padding:3px 12px;border-radius:999px;background:' + INK + ';color:' + GOLD + ';font-family:' + DISP + ';font-weight:600;font-size:.9rem;letter-spacing:.08em;text-transform:uppercase}' +
'.jtp-rule{font-size:.92rem !important;color:#3d5b47;margin:2px 0 10px !important}' +
'.jtp-mode{display:flex;align-items:center;gap:12px;width:100%;margin-top:9px;min-height:62px;padding:8px 14px 8px 10px;border-radius:16px;border:3px solid ' + INK + ';background:#fff;color:' + INK + ';text-align:left;box-shadow:0 4px 0 ' + INK + '}' +
'.jtp-mode:hover{background:#fff7dc}.jtp-mode:active{transform:translateY(3px);box-shadow:0 1px 0 ' + INK + '}' +
'.jtp-mode.main{background:' + RED + ';color:#fff}.jtp-mode.main:hover{background:#ff1a45}' +
'.jtp-mode canvas{width:44px;height:44px;flex:none;margin:0}' +
'.jtp-mode b{display:block;font-size:1.3rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;line-height:1.1}' +
'.jtp-mode small{display:block;font-family:var(--body,"Atkinson Hyperlegible",Verdana,sans-serif);font-size:.86rem;font-weight:400;opacity:.9;line-height:1.25}' +
'.jtp-row{display:flex;gap:9px;margin-top:10px}' +
'.jtp-row button{flex:1;min-height:50px;border-radius:14px;border:2px solid ' + INK + ';background:#f1f7f3;color:' + INK + ';font-weight:700;font-size:1.08rem;letter-spacing:.04em;text-transform:uppercase}' +
'.jtp-row button:hover{background:#fff7dc}' +
'.jtp-next{font-size:.86rem !important;color:#4d6456;margin-top:10px !important}' +
'.jtp-dot{display:inline-block;width:9px;height:9px;margin-left:6px;border-radius:50%;background:' + GOLD + ';border:1px solid ' + INK + ';vertical-align:middle}' +
/* locker and secrets panels */
'.jtp-panel{position:absolute;inset:0;z-index:5;overflow:auto;padding:14px 14px 20px;background:rgba(5,16,10,.95);-webkit-overflow-scrolling:touch}' +
'.jtp-panel[hidden]{display:none}' +
'.jtp-ph{display:flex;align-items:center;gap:10px;margin:0 0 6px}' +
'.jtp-ph h2{flex:1;margin:0;font-family:' + DISP + ';font-size:1.7rem;letter-spacing:.04em;text-transform:uppercase}' +
'.jtp-ph button{min-height:46px;padding:8px 18px;border-radius:14px;border:3px solid ' + INK + ';background:' + GOLD + ';color:' + INK + ';font-weight:700;font-size:1.05rem}' +
'.jtp-sec{margin:14px 0 6px;font-family:' + DISP + ';font-size:1.05rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#ffe9a8}' +
'.jtp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:9px}' +
'.jtp-tile{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;min-height:118px;padding:8px 6px;border-radius:14px;border:2px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#fff;font-family:var(--body,"Atkinson Hyperlegible",Verdana,sans-serif) !important;font-size:.84rem;line-height:1.2;text-align:center}' +
'.jtp-tile canvas{width:64px;height:64px}' +
'.jtp-tile.on{border-color:' + GOLD + ';background:rgba(255,199,44,.16)}' +
'.jtp-tile.on:after{content:"On";position:absolute;top:5px;right:6px;padding:1px 7px;border-radius:999px;background:' + GOLD + ';color:' + INK + ';font-family:' + DISP + ';font-size:.75rem;font-weight:700}' +
'.jtp-tile.lock{opacity:.75;cursor:default}' +
'.jtp-tile.nx{border-style:dashed;border-color:rgba(255,199,44,.7);opacity:1}' +
'.jtp-tile em{font-style:normal;color:#ffe9a8;font-weight:700}' +
'.jtp-how{margin:12px 0 0;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.08);font-size:.95rem;line-height:1.4;min-height:1.4em}' +
'.jtp-srow{display:flex;align-items:center;gap:12px;margin-top:9px;padding:8px 12px;border-radius:14px;background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.14)}' +
'.jtp-srow canvas{width:56px;height:56px;flex:none}' +
'.jtp-srow b{display:block;font-family:' + DISP + ';font-size:1.15rem;letter-spacing:.04em}' +
'.jtp-srow span{display:block;font-size:.9rem;opacity:.85;line-height:1.3}' +
'.jtp-srow.found{border-color:rgba(255,199,44,.6)}' +
/* trick buttons */
'.jtp-tricks{position:absolute;left:8px;bottom:8px;z-index:2;display:flex;flex-direction:column;gap:6px}' +
'.jtp-tricks[hidden]{display:none}' +
'.jtp-trk{display:flex;flex-direction:column;align-items:center;justify-content:center;width:62px;min-height:54px;padding:3px 2px;border-radius:12px;border:2px solid rgba(255,255,255,.3);background:rgba(6,20,12,.72);color:#fff;font-size:.72rem;font-weight:600;letter-spacing:.03em;line-height:1.05}' +
'.jtp-trk canvas{width:28px;height:28px}' +
'.jtp-trk.on{border-color:' + GOLD + ';background:rgba(255,199,44,.3)}' +
'@media (max-height:560px){.jtp-bar{padding:6px 12px}.jtp-tb,.jtp-x{min-height:40px}.jtp-trk{min-height:46px}.jtp-trk canvas{width:22px;height:22px}}' +
'@media (max-width:460px){.jtp-tb{padding:8px 9px;font-size:.88rem}.jtp-title span{display:none}.jtp-x{padding:8px 12px}.jtp-score b{font-size:2.2rem}.jtp-sb{font-size:.92rem;gap:5px}.jtp-sb b{font-size:1.35rem}}' +
'@media (prefers-reduced-motion:reduce){.jtp-pop,.jtp-banner.on{animation:none}.jtp-pop{transform:rotate(-3deg)}.jtp-hint,.jtp-toast,.jtp-ribbon{transition:none}}' +
/* the launcher that sits in the hero */
'.jtpen-launch{display:flex;flex-direction:column;align-items:flex-start;gap:8px;margin:18px 0 0}' +
'.jtpen-open{display:inline-flex;align-items:center;gap:12px;cursor:pointer;font-family:' + DISP + ';font-weight:700;font-size:1.15rem;letter-spacing:.04em;text-transform:uppercase;' +
'padding:10px 20px 10px 12px;border-radius:14px;border:3px solid ' + INK + ';background:linear-gradient(#ff2a52,' + RED + ');color:#fff;box-shadow:0 5px 0 ' + INK + ';transition:transform .12s}' +
'.jtpen-open:hover{transform:translateY(-2px)}.jtpen-open:active{transform:translateY(3px);box-shadow:0 2px 0 ' + INK + '}' +
'.jtpen-open:focus-visible{outline:3px solid ' + GOLD + ';outline-offset:3px}' +
'.jtpen-open canvas{width:32px;height:32px;flex:none}' +
'.jtpen-note{margin:0;font-size:.95rem;opacity:.9}' +
'@media (prefers-reduced-motion:reduce){.jtpen-open{transition:none}}';
(document.head || document.documentElement).appendChild(css);

var TROPHY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v3h3v2a5 5 0 0 1-4.2 4.9A5 5 0 0 1 13 15.8V18h3v3H8v-3h3v-2.2A5 5 0 0 1 8.2 12.9 5 5 0 0 1 4 8V6h3zM4 6v2a3 3 0 0 0 3 3V6zm13 0v5a3 3 0 0 0 3-3V6z" fill="currentColor"/></svg>';

/* ---------- audio (only after a tap or key press; quiet and never sudden) ---------- */
var AC = null, master = null, noiseBuf = null;
function unlockAudio() {
  if (AC) { if (AC.state === 'suspended') { try { AC.resume(); } catch (e) {} } return; }
  var C = window.AudioContext || window.webkitAudioContext;
  if (!C) return;
  try {
    AC = new C();
    master = AC.createGain(); master.gain.value = 0.2; master.connect(AC.destination);
    noiseBuf = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  } catch (e) { AC = null; }
}
function canPlay() { return AC && store.sound && AC.state === 'running'; }
function tone(f0, f1, dur, type, vol, delay) {
  if (!canPlay()) return;
  try {
    var t = AC.currentTime + (delay || 0);
    var o = AC.createOscillator(), g = AC.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f0, t);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.03);
  } catch (e) {}
}
function hiss(dur, f0, f1, vol, attack, delay, kind, q) {
  if (!canPlay() || !noiseBuf) return;
  try {
    var t = AC.currentTime + (delay || 0);
    var s = AC.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    var f = AC.createBiquadFilter(); f.type = kind || 'lowpass';
    if (q) f.Q.value = q;
    f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    var g = AC.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + (attack || 0.01));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t, Math.random()); s.stop(t + dur + 0.05);
  } catch (e) {}
}
function whistle(delay) {
  if (!canPlay()) return;
  try {
    var t = AC.currentTime + (delay || 0), dur = 0.34;
    var o = AC.createOscillator(), l = AC.createOscillator(), lg = AC.createGain(), g = AC.createGain();
    o.type = 'sine'; o.frequency.value = 2250;
    l.type = 'sine'; l.frequency.value = 34; lg.gain.value = 110;
    l.connect(lg); lg.connect(o.frequency);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.04, t + 0.02);
    g.gain.setValueAtTime(0.04, t + dur - 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); l.start(t); o.stop(t + dur + 0.03); l.stop(t + dur + 0.03);
  } catch (e) {}
}
function sfx(n) {
  var eid = curEra().id, alt = !!(G && G.altStad);
  if (n === 'kick') { if (eid === 'stone' && !alt) { tone(90, 40, 0.3, 'sine', 0.4); hiss(0.12, 900, 200, 0.16); } else { tone(150, 46, 0.22, 'sine', 0.42); hiss(0.05, 3200, 700, 0.13); } }
  else if (n === 'swish') { hiss(0.55, 7000, 1400, 0.15, 0.03, 0, 'highpass'); hiss(0.4, 1800, 500, 0.07, 0.02); }
  else if (n === 'cheer') {
    if (eid === 'eighties' && !alt) { [392, 523, 659, 784, 659, 523].forEach(function (f, i) { tone(f, 0, 0.16, 'square', 0.025, i * 0.09); }); hiss(1.6, 1500, 800, 0.1, 0.3, 0.05, 'bandpass', 0.7); }
    else if (eid === 'victorian' && !alt) { for (var i = 0; i < 9; i++) hiss(0.05, 2400, 1800, 0.08, 0.005, i * 0.13 + rnd(0, 0.04), 'bandpass', 1.5); }
    else { hiss(2.2, 1500, 800, 0.22, 0.35, 0.05, 'bandpass', 0.7); hiss(1.9, 3200, 1600, 0.06, 0.3, 0.08, 'bandpass', 0.9); }
  }
  else if (n === 'groan') { hiss(1.0, 650, 260, 0.14, 0.18, 0.05, 'bandpass', 1.2); tone(240, 160, 0.9, 'sawtooth', 0.012, 0.05); }
  else if (n === 'glove') { tone(230, 90, 0.13, 'sine', 0.3); hiss(0.08, 1600, 300, 0.16); }
  else if (n === 'clang') { tone(1180, 1150, 0.6, 'sine', 0.06); tone(1770, 1720, 0.45, 'sine', 0.04); tone(620, 600, 0.3, 'triangle', 0.05); }
  else if (n === 'zap') { tone(1400, 300, 0.25, 'sawtooth', 0.03); tone(700, 1400, 0.2, 'square', 0.02, 0.05); }
  else if (n === 'aim') tone(520, 0, 0.06, 'triangle', 0.05);
  else if (n === 'tick') tone(880, 0, 0.04, 'triangle', 0.035);
  else if (n === 'whistle') whistle();
  else if (n === 'best') { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0, 0.18, 'square', 0.03, i * 0.09); }); }
  else if (n === 'fanfare') { [523, 523, 659, 784, 659, 784, 1047].forEach(function (f, i) { tone(f, 0, i === 6 ? 0.5 : 0.16, 'square', 0.03, i * 0.13); }); }
  else if (n === 'pop') { tone(rnd(300, 500), 90, 0.25, 'sine', 0.08); hiss(0.5, 3000, 600, 0.05, 0.01, 0.05); }
  else if (n === 'yip') { tone(900, 1300, 0.08, 'triangle', 0.05); tone(950, 1400, 0.08, 'triangle', 0.05, 0.14); }
  else if (n === 'meow') { tone(600, 900, 0.18, 'triangle', 0.035); tone(900, 500, 0.25, 'triangle', 0.03, 0.17); }
  else if (n === 'chirp') { tone(2400, 3200, 0.06, 'sine', 0.03); tone(2600, 3400, 0.06, 'sine', 0.03, 0.09); }
  else if (n === 'beep') { tone(660, 0, 0.07, 'square', 0.02); tone(990, 0, 0.07, 'square', 0.02, 0.09); }
  else if (n === 'unlock') { [659, 784, 988, 1319].forEach(function (f, i) { tone(f, 0, 0.2, 'triangle', 0.05, i * 0.08); }); }
}

/* ---------- the week's era (from /data/hqgame.js) ---------- */
var ERA1 = { n: 1, id: 'stone', name: 'Stone Age', when: 'about 10,000 years ago', line: 'Everything is made of rock. Even the bad ideas.',
  pal: { sky: '#f2a65a', sky2: '#ffd9a0', ground: '#8a6a48', ink: '#2b1d12', accent: '#e05a2b' } };
function curEra() {
  var H = window.HQGame;
  try { if (H && H.era) { var e = H.era(); if (e && e.id) return e; } } catch (e2) {}
  return ERA1;
}

/* each era: the look, its own keeper, and one silly rule */
var ERA_X = {
  stone: { rule: 'The ball is a rock. Sometimes it bowls the keeper straight into the net.',
    crowd: ['UG! UG!', 'ROCK ON!', 'Ooga!', 'Mammoth says hi!'], keeper: 'ug' },
  egypt: { rule: 'Golden scarabs hide on the goal. Score near one to grab it.',
    crowd: ['Pharaoh-mazing!', 'Sand in my sandwich!', 'Walk like a goal!'], keeper: 'mummy' },
  rome: { rule: 'Miss once and the Emperor gives a thumbs up: have it again.',
    crowd: ['Thumbs up!', 'It is raining. Again.', 'Veni vidi goali!'], keeper: 'maximus' },
  viking: { rule: 'The goal is a longship. It bobs about. The keeper is seasick.',
    crowd: ['OOH! AAH!', 'LOUDER!', 'SING!', 'ROW ROW ROW!'], keeper: 'olaf' },
  victorian: { rule: 'The keeper is terribly polite. He waits a moment before diving.',
    crowd: ['Jolly good!', 'I say!', 'Splendid!', 'Pip pip!'], keeper: 'reggie' },
  eighties: { rule: 'The posts are lasers. Hit the woodwork and it zaps in.',
    crowd: ['Totally rad!', 'Radical!', 'Mega!', 'Wicked!'], keeper: 'mike' },
  future: { rule: 'The robot keeper shows its plan. It only fibs sometimes.',
    crowd: ['BEEP! GOAL!', 'Merry Christmas!', 'Tinsel!', 'HOVER HOVER!'], keeper: 'keepr' }
};

/* ---------- keepers ----------
   sc: size; slow: dive time multiplier; tell: shown before a cup tie */
var GK_JT = { shirt: GOLD, shirt2: '#e0a800', trim: INK, shorts: INK, sock: GOLD, glove: GREEN, num: INK };
var KEEPERS = {
  /* the weekly era keepers (quick shootout) */
  ug:      { name: 'Ug', team: 'Rockchester', style: 'caveman', skin: '#c98d62', hair: '#3a2414',
             gk: { shirt: '#d8923c', shirt2: '#9a5a20', trim: '#5a3412', shorts: '#7a4a22', sock: '#c98d62', glove: '#b9875a', num: '#5a3412' },
             taunts: ['UG.', 'Ug ug.', 'Me catch rock.'] },
  mummy:   { name: 'The Mummy', team: 'Nile Rovers', style: 'mummy', slow: 1.3, skin: '#efe6cf', hair: '#efe6cf',
             gk: { shirt: '#efe6cf', shirt2: '#d6c9a6', trim: '#c2b28a', shorts: '#efe6cf', sock: '#efe6cf', glove: '#efe6cf', num: '#9c8a60' },
             taunts: ['Mmmmf.', 'Mmf mmf!', '(unravels slightly)'] },
  maximus: { name: 'Maximus Glovus', team: 'Londinium', style: 'gladiator', skin: '#d9a07a', hair: '#2d2019',
             gk: { shirt: '#b3263a', shirt2: '#7d1626', trim: '#e8c35a', shorts: '#e8c35a', sock: '#8a5a2a', glove: '#e8c35a', num: '#e8c35a' },
             taunts: ['Ave! Shoot then.', 'Gladiator ready.', 'Wet sandals.'] },
  olaf:    { name: 'Olaf the Loud', team: 'Longship Rovers', style: 'viking', skin: '#f1c7a5', hair: '#d9a441',
             gk: { shirt: '#3f5a46', shirt2: '#2a3e30', trim: '#d9a441', shorts: '#5d4a32', sock: '#5d4a32', glove: '#8a6a48', num: '#d9a441' },
             taunts: ['OLAF!', 'I feel sick.', 'SING IT!'] },
  reggie:  { name: 'Sir Reginald', team: 'Steamington', style: 'victorian', polite: 0.2, skin: '#f1c7a5', hair: '#4a3020',
             gk: { shirt: '#2a2a2e', shirt2: '#151518', trim: '#d8d0c0', shorts: '#4a4038', sock: '#2a2a2e', glove: '#e8e0d0', num: '#d8d0c0' },
             taunts: ['After you.', 'Do carry on.', 'Rather!'] },
  mike:    { name: 'Mullet Mike', team: 'Neon Nights', style: 'eighties', skin: '#e2ad86', hair: '#7a4a22',
             gk: { shirt: '#2de2e6', shirt2: '#14a9ad', trim: '#ff4fa3', shorts: '#ff4fa3', sock: '#2de2e6', glove: '#ffe14d', num: '#2b0b4a' },
             taunts: ['Totally tubular.', 'Nice hair. Mine.', 'Rad.'] },
  keepr:   { name: 'KEEP-R 3000', team: 'Hover United', style: 'robot', skin: '#b8c6d6', hair: '#b8c6d6', holo: true,
             gk: { shirt: '#d5e2ee', shirt2: '#9fb2c6', trim: '#7cf5c9', shorts: '#4d5d70', sock: '#9fb2c6', glove: '#7cf5c9', num: '#16243d' },
             taunts: ['CALCULATING.', 'BEEP.', 'FESTIVE MODE ON.'] },
  /* the cup rivals */
  dez:     { name: 'Dancing Dez', team: 'Dynamo Disco', short: 'DIS', style: 'dancer', skin: '#8a5a3c', hair: '#1a1410',
             gk: { shirt: '#ffe14d', shirt2: '#e0b800', trim: '#ff4fa3', shorts: '#2b0b4a', sock: '#ffe14d', glove: '#ff4fa3', num: '#2b0b4a' },
             kit: { shirt: '#ff4fa3', shirt2: '#c42a7a', sleeve: '#ffe14d', shorts: '#2b0b4a', shorts2: '#1a0630', sock: '#ff4fa3', sock2: '#ffe14d', print: '#ffe14d', boot: '#16181d' },
             tell: 'Dances on the line. Shoot where he is not.', taunts: ['Watch the moves!', 'Disco time!', 'Boogie!'] },
  tim:     { name: 'Tiny Tim', team: 'Tiny Toes Athletic', short: 'TTA', style: 'tiny', sc: 0.8, skin: '#f1c7a5', hair: '#c46a2a',
             gk: { shirt: '#4fc3f7', shirt2: '#2f97c7', trim: '#ffffff', shorts: '#1d3557', sock: '#4fc3f7', glove: '#ff9f1c', num: '#1d3557' },
             kit: { shirt: '#1d3557', shirt2: '#14253e', sleeve: '#4fc3f7', shorts: '#ffffff', shorts2: '#dfe5ea', sock: '#1d3557', sock2: '#4fc3f7', print: '#4fc3f7', boot: '#16181d' },
             tell: 'Small but very springy. Keep it low and wide.', taunts: ['Small but bouncy!', 'Boing!', 'Try me!'] },
  barry:   { name: 'Big Barry', team: 'Big Lads United', short: 'BLU', style: 'giant', sc: 1.3, skin: '#e2ad86', hair: '#5a3a22',
             gk: { shirt: '#8bc34a', shirt2: '#5f8f2a', trim: '#1b3d0f', shorts: '#1b3d0f', sock: '#8bc34a', glove: '#ffffff', num: '#1b3d0f' },
             kit: { shirt: '#1b3d0f', shirt2: '#0f2608', sleeve: '#8bc34a', shorts: '#1b3d0f', shorts2: '#0f2608', sock: '#8bc34a', sock2: '#1b3d0f', print: '#8bc34a', boot: '#16181d' },
             tell: 'Enormous, but slow to get down. Go low.', taunts: ['I am very tall.', 'Hello down there.', 'Big gloves.'] },
  sid:     { name: 'Shady Sid', team: 'Shady Town', short: 'SHT', style: 'shades', skin: '#c98d62', hair: '#1a1410',
             gk: { shirt: '#ff9f1c', shirt2: '#d67d00', trim: '#16181d', shorts: '#16181d', sock: '#ff9f1c', glove: '#16181d', num: '#16181d' },
             kit: { shirt: '#16181d', shirt2: '#0a0b0e', sleeve: '#ff9f1c', shorts: '#16181d', shorts2: '#0a0b0e', sock: '#ff9f1c', sock2: '#16181d', print: '#ff9f1c', boot: '#ff9f1c' },
             tell: 'Remembers your last kick. Mix it up.', taunts: ['I remember everything.', 'Same again?', 'Cool.'] },
  eddie:   { name: 'Early Eddie', team: 'Early Doors FC', short: 'EDF', style: 'early', skin: '#f1c7a5', hair: '#8a5a2a',
             gk: { shirt: '#9b5de5', shirt2: '#7438c2', trim: '#f15bb5', shorts: '#2a1f4d', sock: '#9b5de5', glove: '#c8ff4d', num: '#ffffff' },
             kit: { shirt: '#f15bb5', shirt2: '#c23a8c', sleeve: '#9b5de5', shorts: '#2a1f4d', shorts2: '#1b1433', sock: '#f15bb5', sock2: '#ffffff', print: '#ffffff', boot: '#16181d' },
             tell: 'Leans, then dives early. Go the other way. Or chip it.', taunts: ["I'm going early!", 'Already gone!', 'Wait for me!'] },
  whiskers:{ name: 'Whiskers', team: 'Inter Mittens', short: 'INM', style: 'cat', skin: '#f2a65a', hair: '#f2a65a',
             gk: { shirt: '#3a86ff', shirt2: '#2462c4', trim: '#ffffff', shorts: '#1b2a4a', sock: '#3a86ff', glove: '#ffffff', num: '#ffffff' },
             kit: { shirt: '#1b2a4a', shirt2: '#101a30', sleeve: '#3a86ff', shorts: '#1b2a4a', shorts2: '#101a30', sock: '#3a86ff', sock2: '#ffffff', print: '#ffffff', boot: '#16181d' },
             tell: 'Totally a person. Quick hands. Wait for the butterfly.', taunts: ['Meow. I mean, hello.', 'Is that a butterfly?', 'Purr.'] },
  gus:     { name: 'Golden Gus', team: 'Galaxy Gold', short: 'GAL', style: 'gus', skin: '#a86f4c', hair: '#1a1410',
             gk: { shirt: '#16181d', shirt2: '#0a0b0e', trim: GOLD, shorts: '#16181d', sock: '#16181d', glove: GOLD, num: GOLD },
             kit: { shirt: '#ffffff', shirt2: '#e6e6e6', sleeve: GOLD, shorts: '#ffffff', shorts2: '#e6e6e6', sock: '#ffffff', sock2: GOLD, print: '#c49a00', boot: GOLD },
             tell: 'Points one way, dives the other. Usually.', taunts: ['That way?', 'Or that way?', 'Golden gloves!'] }
};
var DRAWPOOL = [['dez', 'tim'], ['barry', 'sid'], ['eddie'], ['whiskers'], ['gus']];
var ROUNDS = ['Round one', 'Round two', 'Quarter final', 'Semi final', 'The final'];
function cupDraw() {
  var d = store.cupDraw;
  if (!Array.isArray(d) || d.length !== 5 || d.some(function (k) { return !KEEPERS[k]; })) {
    d = DRAWPOOL.map(function (p) { return pick(p); });
    store.cupDraw = d; saveStore();
  }
  return d;
}

/* ---------- JT's kits, balls, boots, celebrations, stadiums, tricks ---------- */
var KITS = {
  home: { name: 'Home kit', shirt: RED, shirt2: '#b8001f', sleeve: '#ffffff', shorts: '#ffffff', shorts2: '#dfe5ea', sock: RED, sock2: '#ffffff', print: '#ffffff', boot: '#16181d', pat: 'plain' },
  hoops: { name: 'Hoops kit', shirt: '#ffffff', shirt2: RED, sleeve: RED, shorts: INK, shorts2: '#0a160f', sock: '#ffffff', sock2: RED, print: INK, boot: '#16181d', pat: 'hoops' },
  gold: { name: 'Gold kit', shirt: '#ffd24a', shirt2: '#e0a800', sleeve: '#fff3c4', shorts: '#fff3c4', shorts2: '#f0dc96', sock: '#ffd24a', sock2: '#ffffff', print: INK, boot: '#ffd24a', pat: 'shine' }
};
var KIT_AWAY = { shirt: '#20306e', shirt2: '#152150', sleeve: '#8fd3ff', shorts: '#20306e', shorts2: '#152150', sock: '#8fd3ff', sock2: '#20306e', print: '#8fd3ff', boot: '#f1f1f1' };
var BALLS = { classic: 'Classic ball', beach: 'Beach ball' };
var BOOTS = { classic: 'Classic boots', comet: 'Comet boots' };
var CELEBS = { knee: 'Knee slide', robot: 'The robot', worm: 'The worm', bonnie: 'The Bonnie' };
var STADS = { era: 'This week', lights: 'Floodlights', park: 'Park pitch', roof: 'Rooftop', moon: 'The Moon' };
var TRICKS = {
  panenka: { name: 'Panenka chip', how: 'Tap when the keeper leans. He dives, you dink it down the middle.' },
  topbins: { name: 'Top bins', how: 'Tap a side, then stop the fast bar in the gold. Unstoppable.' },
  rabona: { name: 'Rabona', how: 'Swipe across the ball, left or right. It bends into that side.' }
};

/* the unlock ladder (sparks since the upgrade, via HQGame.ladder) */
var UNLOCKS = [
  { at: 0,    id: 'kit_home',      cat: 'kit',   key: 'home',    name: 'Home kit' },
  { at: 0,    id: 'ball_classic',  cat: 'ball',  key: 'classic', name: 'Classic ball' },
  { at: 0,    id: 'celeb_knee',    cat: 'celeb', key: 'knee',    name: 'Knee slide' },
  { at: 0,    id: 'stad_lights',   cat: 'stad',  key: 'lights',  name: 'Floodlights' },
  { at: 120,  id: 'trick_panenka', cat: 'trick', key: 'panenka', name: 'Panenka chip' },
  { at: 250,  id: 'celeb_robot',   cat: 'celeb', key: 'robot',   name: 'The robot' },
  { at: 400,  id: 'kit_hoops',     cat: 'kit',   key: 'hoops',   name: 'Hoops kit' },
  { at: 550,  id: 'mode_wall',     cat: 'mode',  key: 'wall',    name: 'Wall of Gloves' },
  { at: 700,  id: 'boots_comet',   cat: 'boots', key: 'comet',   name: 'Comet boots' },
  { at: 900,  id: 'trick_topbins', cat: 'trick', key: 'topbins', name: 'Top bins' },
  { at: 1150, id: 'stad_park',     cat: 'stad',  key: 'park',    name: 'Park pitch' },
  { at: 1400, id: 'ball_beach',    cat: 'ball',  key: 'beach',   name: 'Beach ball' },
  { at: 1700, id: 'celeb_worm',    cat: 'celeb', key: 'worm',    name: 'The worm' },
  { at: 2000, id: 'trick_rabona',  cat: 'trick', key: 'rabona',  name: 'Rabona' },
  { at: 2400, id: 'stad_roof',     cat: 'stad',  key: 'roof',    name: 'Rooftop' },
  { at: 2800, id: 'celeb_bonnie',  cat: 'celeb', key: 'bonnie',  name: 'The Bonnie' },
  { at: 3300, id: 'kit_gold',      cat: 'kit',   key: 'gold',    name: 'Gold kit' },
  { at: 4000, id: 'stad_moon',     cat: 'stad',  key: 'moon',    name: 'The Moon' }
];
var UL = null, HAVE = {};
function refreshUnlocks() {
  var H = window.HQGame, r = null;
  try { if (H && H.ladder) r = H.ladder(PREFIX, UNLOCKS); } catch (e) { r = null; }
  if (!r) {
    var have = UNLOCKS.filter(function (u) { return !u.at; });
    r = { have: have, next: null, need: 0, sparks: 0 };
  }
  UL = r; HAVE = {};
  r.have.forEach(function (u) { HAVE[u.id] = 1; });
  HAVE.stad_era = 1; HAVE.boots_classic = 1;
  /* never wear something that is not unlocked */
  if (!HAVE['kit_' + store.eq.kit]) store.eq.kit = 'home';
  if (!HAVE['ball_' + store.eq.ball]) store.eq.ball = 'classic';
  if (!HAVE['boots_' + store.eq.boots]) store.eq.boots = 'classic';
  if (!HAVE['celeb_' + store.eq.celeb]) store.eq.celeb = 'knee';
  if (!HAVE['stad_' + store.eq.stad]) store.eq.stad = 'era';
  return r;
}
function has(id) { return !!HAVE[id]; }

/* the secrets: never required, never scored */
var SECRETS = [
  { id: 'dog',    name: 'Pitch invader',      how: 'Bonnie ran on and you gave her a wave.',          hint: 'Sometimes someone small runs on. Say hello.' },
  { id: 'crowd',  name: 'Jay in the crowd',    how: 'You spotted Jay holding up his JT sign.',          hint: 'Somebody in the stand is holding a sign.' },
  { id: 'bird',   name: 'Bird on the bar',     how: 'A bird landed on the crossbar and you said hi.',   hint: 'Keep an eye on the crossbar.' },
  { id: 'sub',    name: 'Jay comes on',        how: 'Eight in a row in a quick shootout. Jay warmed up.', hint: 'Go on a really long run of goals.' },
  { id: 'cupdog', name: 'Bonnie in the cup',   how: 'Three taps on the trophy and out she popped.',     hint: 'The trophy is roomier than it looks.' }
];
var JAY_SAYS = ['Outrageous!', 'Unhand me, goblin!', 'My ears are not a toilet!', 'When I was in China....', 'In the wise words of my late, great grandfather, stop.'];

/* short lines for the bubbles */
var LINES = {
  goal: ['GET IN!', 'Top bins!', 'Back of the net!', 'Lovely!', 'WHAT A HIT!', 'Again! Again!', 'Ice cold!'],
  miss: ['Ooooh!', 'So close!', 'Next one!', 'Unlucky!', 'Still love you!'],
  save: ['WHAT A SAVE!', 'Safe hands!', 'Brick wall!', 'Get in, keeper!'],
  commGoal: ['Cool as a fridge.', 'Sent the keeper to the shops.', 'The net is still wobbling.', 'Just passed the keeper. Waved, too.', 'Calm. Very calm.'],
  commMiss: ['That ball has left the county.', 'The post is fine, thanks for asking.', 'So, so nearly.', 'Brave. Wrong, but brave.'],
  commSave: ['Keeper says no.', 'A save and a half.', 'Big hands. Big moment.', 'Gloves of glue.'],
  commLet: ['They scored. Shake it off.', 'Right way, just out of reach.', 'No harm done.'],
  panenka: ['Cheeky! Absolutely cheeky.', 'A little dink. Outrageous.', 'Chipped it like a biscuit.'],
  rabona: ['Round his own leg!', 'Did he just do that?', 'Fancy feet.'],
  topbins: ['Where the spiders live!', 'Postage stamp!', 'Top corner. Top lad.']
};

/* ---------- layout and perspective ----------
   t is depth along the kick: 0 on the penalty spot, 1 on the goal line.
   Things look SB times bigger on the spot than on the line. */
var L = null;
function persp(t) { return SB / (1 + KP * t); }
function groundY(t) { return L.hY + (L.by - L.hY) * persp(t) / SB; }
function tOfZ(z) { return 1 - z / SPOT; }
function wX(x, t) { return L.cx + x * L.ppm * persp(t); }
function wY(h, t) { return groundY(t) - h * L.ppm * persp(t); }
function gX(x) { return L.cx + x * L.ppm; }
function gY(h) { return L.gB - h * L.ppm; }
function toGoal(px, py) { return { x: (px - L.cx) / L.ppm, y: (L.gB - py) / L.ppm }; }

/* ---------- game state ---------- */
var state = 'closed';            /* closed, hub, play, over, panel */
var G = null, ui = {}, ctx = null, raf = 0, lastTs = 0, overAt = 0, hiddenPause = false;
var bgCv = null, crowdCv = null, bgKey = '';
var keeperOn = true;
var prevOverflow = '', opener = null;
var roundLive = false, heldModal = null;
var ERA = ERA1, EX = ERA_X.stone;

function look() {           /* which world to draw: the week's era, or a chosen stadium */
  var s = store.eq.stad;
  return (s && s !== 'era' && has('stad_' + s)) ? s : ERA.id;
}
function newState(mode) {
  ERA = curEra(); EX = ERA_X[ERA.id] || ERA_X.stone;
  var g = {
    mode: mode, kind: 'shoot', streak: 0, turn: 0, startBest: store.best, toastDone: store.best === 0, newBest: false,
    t: 0, phase: 'aim', pt: 0, slow: 1,
    aim: null, meter: { on: false, v: 0, d: 1, fast: false }, drag: null, ring: 0,
    shot: null, bp: null, layer: 'front', fade: 1, spin: 0, trail: [],
    kp: null, keeper: null, st: { kick: 0, run: 1, phase: 0, x: 0, y: 0 }, choice: null, ready: false,
    conf: [], parts: [], shake: 0, cheer: 0, bulge: null, outcome: null, shots: 0, msg: '',
    trick: null, trk: null, celeb: null, emperor: 0, retakeUsed: false, scarab: null, lastSide: null, plan: null,
    bubbles: [], fx: { dog: null, bird: null, jay: null, sub: null, fly: null, rock: 0, zap: 0, emperor: 0 },
    cup: null, wall: null, trophy: null, fw: [], altStad: look() !== ERA.id, gloves: 0
  };
  return g;
}
function setKeeper(id) {
  G.keeperId = id;
  G.keeper = KEEPERS[id] || KEEPERS.ug;
  G.kp = keeperRest();
}
function newGame(mode) {
  G = newState(mode || 'quick');
  if (G.mode === 'cup') {
    var draw = cupDraw(), r = Math.min(4, store.cupRound);
    G.cup = { round: r, rival: draw[r], us: [], them: [], k: 0, sd: false, done: false };
    setKeeper(draw[r]);
  } else if (G.mode === 'wall') {
    G.wall = { n: 0, saves: 0, of: 10, list: [] };
    setKeeper(EX.keeper);
  } else setKeeper(EX.keeper);
  roundLive = true;
  startTurn();
}

function keeperRest() {
  var sc = (G && G.kind !== 'save' && G.keeper && G.keeper.sc) || 1;
  return { hx: 0, hy: 0.95 * sc, sc: sc, ang: 0, arms: 0, jx: 0, from: null, to: null, t: 0, delay: 0, dur: 0.5, holding: false, sick: false, knocked: 0, look: 0 };
}

function startTurn() {
  G.turn++;
  var kind = 'shoot';
  if (G.mode === 'quick') kind = (keeperOn && G.turn % 5 === 0) ? 'save' : 'shoot';
  else if (G.mode === 'wall') kind = 'save';
  else if (G.mode === 'cup') kind = (G.cup.k % 2 === 0) ? 'shoot' : 'save';
  G.kind = kind;
  G.phase = kind === 'shoot' ? 'aim' : 'runup';
  G.pt = 0; G.aim = null; G.meter.on = false; G.meter.v = 0; G.meter.d = 1; G.meter.fast = false; G.drag = null; G.ring = 0;
  G.shot = null; G.bp = null; G.layer = 'front'; G.fade = 1; G.outcome = null; G.bulge = null; G.choice = null; G.ready = false;
  G.trick = null; G.trk = null; G.celeb = null; G.trail.length = 0; G.slow = 1; G.scarab = null; G.plan = null;
  G.kp = keeperRest();
  G.st = { kick: 0, run: kind === 'save' ? 0 : 1, phase: 0 };
  G.cpu = null;
  if (kind === 'save') {
    G.cpu = cpuStriker();
    G.cpu.shot = cpuShot();
    var sd = sideOf(G.cpu.shot.tx);
    G.cpu.look = sd === 'left' ? -1 : sd === 'right' ? 1 : 0;
    if (Math.random() < 0.3) G.cpu.look = pick([-1, 0, 1]);     /* strikers fib sometimes */
  }
  if (ui.banner) ui.banner.className = 'jtp-banner';
  /* keeper quirks set up before the kick */
  var k = G.keeper, kp = G.kp;
  if (kind === 'shoot') {
    if (k.style === 'early') kp.lean = Math.random() < 0.5 ? -1 : 1;
    if (k.style === 'gus') kp.point = Math.random() < 0.5 ? -1 : 1;
    if (k.holo) { var r = Math.random(); G.plan = r < 0.4 ? -1 : r < 0.8 ? 1 : 0; }
    if (ERA.id === 'egypt' && Math.random() < 0.45) G.scarab = { x: rnd(-2.8, 2.8), y: rnd(0.4, 2.0), got: false };
    if (k.style === 'cat') G.fx.fly = { t: -rnd(1.5, 4), x: 0, y: 0 };
  }
  rollCameos();
  if (kind === 'save') { toast(G.mode === 'wall' ? 'Kick ' + (G.wall.n + 1) + ' of ' + G.wall.of : 'Your turn in goal'); sfx('whistle'); }
  else if (G.turn === 1) sfx('whistle');
  if (G.turn === 1 || Math.random() < 0.35) bubbleFrom('keeper', pick(k.taunts));
  updateHud(); syncHint(); syncTricks();
}

/* the cameos: never needed, never scored */
function rollCameos() {
  var fx = G.fx;
  if (!fx.bird && Math.random() < 0.16) fx.bird = { x: rnd(-2.6, 2.6), t: 0, st: 'in', tapped: false, side: Math.random() < 0.5 ? -1 : 1 };
  if (!fx.jay && G.turn > 1 && Math.random() < 0.14) fx.jay = { t: 0, x: rnd(0.12, 0.88), said: 0 };
  if (!fx.dog && G.turn > 2 && (T.dog || Math.random() < 0.08)) fx.dog = { t: 0, dir: Math.random() < 0.5 ? 1 : -1, tapped: 0, spin: 0 };
  if (T.dog) T.dog = null;
}

/* ---------- shooting ---------- */
function makeShot(tx, ty, power, who) {
  var p = power, sx = 0, sy = 0, lift = 0;
  if (who === 'jt' && T.spread) {
    sx = 0.2 + 0.5 * Math.max(0, p - 0.8);
    sy = 0.13 + 0.35 * Math.max(0, p - 0.8);
  }
  if (who === 'jt') lift = Math.max(0, p - 0.92) * 3.0;
  var x = tx + gauss() * sx, y = Math.max(BALL, ty + gauss() * sy + lift);
  var ft = p >= 1 ? 0.42 : lerp(1.0, 0.45, clamp(p, 0, 1));
  if (look() === 'moon') ft *= 1.2;
  return {
    tx: x, ty: y, power: p, ft: ft / (T.speed || 1), t: 0, who: who,
    lift: (0.12 + (1 - clamp(p, 0, 1)) * 0.8) * (look() === 'moon' ? 2 : 1),
    curve: Math.abs(x) > 0.8 ? -sgn(x) * rnd(0.15, 0.4) : rnd(-0.15, 0.15),
    spin: (Math.abs(x) > 0.3 ? sgn(x) : 1) * (9 + 12 * clamp(p, 0, 1.2))
  };
}
function shotPos(s, t) {
  var wx = s.tx * t + s.curve * Math.sin(Math.PI * clamp(t, 0, 1));
  var h = BALL + (s.ty - BALL) * t + s.lift * 4 * t * (1 - t);
  if (h < BALL) h = BALL;
  var p = persp(t);
  return { x: L.cx + wx * L.ppm * p, y: groundY(t) - h * L.ppm * p, r: BALL * L.ppm * p, gy: groundY(t), h: h, p: p };
}

function strike(tx, ty, power, trick) {
  if (!G || state !== 'play' || G.kind !== 'shoot' || G.phase !== 'aim') return false;
  if (T.power != null && !trick) power = T.power;
  var s;
  if (trick === 'panenka') {
    s = makeShot(rnd(-0.2, 0.2), rnd(1.1, 1.5), 0.42, 'cpu');
    s.lift = 1.3; s.curve = 0; s.spin = 6; s.ft = 0.95 / (T.speed || 1); s.who = 'jt';
  } else if (trick === 'topbins') {
    s = makeShot(tx, ty, 1.0, 'cpu'); s.who = 'jt'; s.ft = 0.46 / (T.speed || 1); s.lift = 0.15;
  } else if (trick === 'rabona') {
    s = makeShot(tx, ty, 0.85, 'cpu'); s.who = 'jt'; s.curve = -sgn(tx) * 1.3; s.lift = 0.35;
  } else s = makeShot(tx, ty, power, 'jt');
  s.trick = trick || null;
  G.shot = s;
  G.aim = { x: tx, y: ty };
  G.meter.on = false; G.drag = null; G.ring = 0;
  G.phase = 'windup'; G.pt = 0;
  G.shots++;
  syncHint(); syncTricks();
  return true;
}

/* ---------- the keeper decides where to go when the ball is struck ---------- */
function eraDiff() {
  if (G.mode === 'cup') return 0.3 + 0.1 * G.cup.round;
  return clamp(G.streak / 14, 0, 1);
}
function keeperThink(s) {
  var kp = G.kp, k = G.keeper, st = k.style;
  if (T.keeper === 'still') return;
  var d = eraDiff();
  var readP = 0.16 + 0.34 * d + clamp((s.ft * (T.speed || 1) - 0.62) * 1.6, 0, 0.6);
  var delay = lerp(0.15, 0.08, d), dur = 0.6 * (k.slow || 1);
  if (st === 'barry' || st === 'giant') { delay += 0.14; dur *= 1.45; if (s.ty < 0.7) readP *= 0.45; }
  if (st === 'tiny') { dur *= 0.8; readP += 0.12; }
  if (st === 'cat') readP += 0.15;
  if (k.polite) delay += 0.2;
  if (T.keeper === 'read') readP = 1;
  var tx, ty, read = Math.random() < readP;
  function guess() {
    var r = Math.random();
    if (r < 0.2) { tx = rnd(-0.5, 0.5); ty = rnd(0.4, 1.6); }
    else { tx = (r < 0.6 ? -1 : 1) * rnd(1.4, 3.0); ty = rnd(0.2, 1.9); }
  }
  if (read) {
    var n = T.keeper === 'read' ? 0 : 1;
    tx = s.tx + gauss() * (0.45 - 0.2 * d) * n;
    ty = s.ty + gauss() * 0.3 * n;
  } else guess();
  /* the personalities */
  if (st === 'dancer') {
    var at = kp.jx;
    tx = clamp(read ? tx : at + rnd(-1.4, 1.4), at - 1.7, at + 1.7);
  } else if (st === 'shades' && G.lastSide != null && Math.random() < 0.7) {
    tx = G.lastSide * rnd(1.6, 3.0); ty = rnd(0.3, 1.8);
  } else if (st === 'early') {
    var side = kp.lean || 1;
    if (Math.random() < 0.18) side = -side;
    tx = side * rnd(1.7, 3.0); ty = rnd(0.3, 1.7); delay = 0;
  } else if (st === 'gus' && Math.random() < 0.72) {
    tx = -(kp.point || 1) * rnd(1.6, 3.0); ty = rnd(0.3, 1.8);
  } else if (st === 'cat' && G.fx.fly && G.fx.fly.near) {
    delay += 0.35; tx = rnd(-0.5, 0.5); ty = 1;
  }
  if (G.plan != null && Math.random() < 0.75) {       /* the far future: the holo plan */
    tx = G.plan === 0 ? rnd(-0.4, 0.4) : G.plan * rnd(1.8, 3.0); ty = rnd(0.4, 1.8);
  }
  /* trick shots */
  if (s.trick === 'panenka') {
    if (G.trk && G.trk.sold) { tx = (Math.random() < 0.5 ? -1 : 1) * rnd(2, 3); ty = rnd(0.4, 1.5); delay = 0.02; }
    else if (st === 'early' || st === 'gus') { tx = (kp.lean || -(kp.point || 1)) * rnd(2, 3); ty = 1; }
    else if (Math.random() < 0.5) { tx = s.tx * 0.5; ty = s.ty; delay = 0.3; }
  }
  if (s.trick === 'topbins' && G.trk && G.trk.gold) delay += 0.25;
  if (s.trick === 'rabona') { delay += 0.12; if (read && Math.random() < 0.5) tx = -tx; }
  if (G.keeperId === 'olaf' && Math.random() < 0.3) { kp.sick = true; tx = kp.jx; ty = 0.9; dur *= 2.5; }
  planDive(kp, tx, ty, delay, dur);
}
function diveFor(tx, ty, sc) {
  sc = sc || 1;
  if (Math.abs(tx) < 0.9 * sc) {
    var hy = ty > 1.7 * sc ? clamp(0.95 * sc + (ty - 1.7 * sc) * 0.8, 0.95 * sc, 1.35 * sc + (sc < 1 ? 0.45 : 0)) : ty < 0.5 ? 0.82 * sc : 0.95 * sc;
    var hx = tx * 0.55;
    return { hx: hx, hy: hy, ang: clamp((tx - hx) * 0.7, -0.5, 0.5) };
  }
  var hx2 = clamp(tx * 0.62, -2.05, 2.05);
  var hy2 = clamp(0.35 + ty * 0.35, 0.45 * sc, 1.25 * sc + (sc < 1 ? 0.35 : 0));
  return { hx: hx2, hy: hy2, ang: Math.atan2(tx - hx2, Math.max(ty - hy2, -0.25)) };
}
function planDive(kp, tx, ty, delay, dur) {
  kp.from = { hx: kp.hx + kp.jx, hy: kp.hy, ang: kp.ang };
  kp.jx = 0;
  kp.to = diveFor(tx, ty, kp.sc); kp.t = 0; kp.delay = delay; kp.dur = dur / (T.speed || 1);
}
function updateKeeper(kp, dt) {
  var k = G.keeper, st = G.kind === 'save' ? '' : k.style;
  if (!kp.to) {
    var waiting = G.phase === 'aim' || G.phase === 'runup' || G.phase === 'windup' || G.phase === 'idle';
    var want = 0;
    if (waiting && !RM) {
      if (st === 'dancer') want = Math.sin(G.t * 1.7) * 1.45;
      else if (G.trick === 'panenka' && G.kind === 'shoot') want = Math.sin(G.t * 2.4) * 0.55;
      else want = Math.sin(G.t * 2.3) * 0.16;
    } else if (waiting && st === 'dancer') want = 1.1;
    kp.jx = (!waiting) ? kp.jx * 0.9 : want;
    var lean = 0;
    if (waiting && st === 'early' && kp.lean) lean = kp.lean * (0.22 + (RM ? 0 : 0.08 * Math.sin(G.t * 5)));
    if (waiting && st === 'dancer' && !RM) lean = Math.sin(G.t * 3.4) * 0.15;
    kp.ang = lerp(kp.ang, lean, 0.2);
    if (waiting && st === 'tiny' && !RM) kp.hy = 0.95 * kp.sc + Math.abs(Math.sin(G.t * 4)) * 0.18;
    return;
  }
  kp.t += dt;
  var p = clamp((kp.t - kp.delay) / kp.dur, 0, 1);
  var e = ease(p);
  var f = kp.from, o = kp.to;
  kp.hx = lerp(f.hx, o.hx, e);
  kp.hy = lerp(f.hy, o.hy, e) + (Math.abs(o.ang) > 0.8 ? Math.sin(Math.PI * e) * 0.22 : 0);
  kp.ang = lerp(f.ang, o.ang, e);
  kp.arms = e;
}
function keeperAxis(kp) { return { x: Math.sin(kp.ang), y: Math.cos(kp.ang) }; }
function handsAt(kp) {
  var a = keeperAxis(kp), r = (0.6 + 0.75 * kp.arms) * kp.sc;
  return { x: kp.hx + kp.jx + a.x * r, y: kp.hy + a.y * r };
}
function segDist(px, py, ax, ay, bx, by) {
  var vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy;
  var k = l2 ? clamp(((px - ax) * vx + (py - ay) * vy) / l2, 0, 1) : 0;
  var dx = px - (ax + vx * k), dy = py - (ay + vy * k);
  return Math.sqrt(dx * dx + dy * dy);
}
function keeperHits(kp, x, y) {
  var a = keeperAxis(kp), hx = kp.hx + kp.jx, hy = kp.hy, sc = kp.sc;
  var h = handsAt(kp);
  if (segDist(x, y, hx - a.x * 0.95 * sc, hy - a.y * 0.95 * sc, h.x, h.y) < 0.3 * Math.max(1, sc)) return true;
  if (kp.arms < 0.5) {
    var sx = hx + a.x * 0.45 * sc, sy = hy + a.y * 0.45 * sc;
    if (segDist(x, y, sx - a.y * 0.55 * sc, sy + a.x * 0.55 * sc, sx + a.y * 0.55 * sc, sy - a.x * 0.55 * sc) < 0.2) return true;
  }
  return false;
}

/* ---------- the other side shoots (JT in goal) ---------- */
var STRIKER_KITS = ['dez', 'tim', 'barry', 'sid', 'eddie', 'whiskers', 'gus'];
function cpuStriker() {
  var who = G.mode === 'cup' ? G.cup.rival : pick(STRIKER_KITS);
  var r = Math.random(), type = r < 0.12 ? 'chip' : r < 0.45 ? 'power' : 'place';
  if (G.mode === 'quick' && G.turn < 6) type = 'place';
  return { kit: KEEPERS[who].kit || KIT_AWAY, type: type, num: String(pick([9, 10, 11, 8, 14, 23])) };
}
function sideOf(x) { return x < -0.9 ? 'left' : x > 0.9 ? 'right' : 'middle'; }
function cpuShot() {
  var c = G.cpu || { type: 'place' }, s;
  if (c.type === 'chip') {
    s = makeShot(rnd(-0.3, 0.3), rnd(1.0, 1.5), 0.42, 'cpu'); s.lift = 1.2; s.curve = 0; s.ft = 0.95;
    return s;
  }
  var r = Math.random();
  var side = T.striker || (r < 0.42 ? 'left' : r < 0.58 ? 'middle' : 'right');
  var miss = T.strikerMiss != null ? T.strikerMiss : Math.random() < (G.mode === 'cup' ? 0.1 : 0.08);
  var tx = side === 'left' ? -rnd(1.5, 3.1) : side === 'right' ? rnd(1.5, 3.1) : rnd(-0.6, 0.6);
  var ty = rnd(0.25, 1.9);
  if (miss) {
    if (side !== 'middle' && Math.random() < 0.6) tx = sgn(tx) * rnd(3.95, 4.6);
    else ty = rnd(2.75, 3.2);
  }
  s = makeShot(tx, ty, c.type === 'power' ? rnd(0.85, 0.95) : rnd(0.68, 0.82), 'cpu');
  return s;
}
/* JT picks where to dive: a point in the goal (metres) */
function diveTo(x, y) {
  if (!G || state !== 'play' || G.kind !== 'save' || G.choice) return;
  if (G.phase === 'runup' && !G.ready) { G.ready = true; syncHint(); return; }
  if (G.phase !== 'runup' && G.phase !== 'windup' && G.phase !== 'flight') return;
  G.choice = { x: clamp(x, -HW - 0.3, HW + 0.3), y: clamp(y, 0.1, GHM + 0.2) };
  sfx('aim');
  var reach = Math.hypot(G.choice.x, G.choice.y - 0.9);
  planDive(G.kp, G.choice.x, G.choice.y, G.phase === 'flight' ? 0 : 0.05, G.phase === 'flight' ? 0.26 : 0.34);
  G.kp.hold = G.phase !== 'flight';     /* guessed early: wait for the kick before going */
  syncHint();
  return reach;
}
function choose(side) {
  diveTo(side === 'left' ? -2.5 : side === 'right' ? 2.5 : 0, side === 'middle' ? 1.2 : 0.9);
}
function cpuLaunch() {
  var s = (G.cpu && G.cpu.shot) || cpuShot();
  G.shot = s;
  if (G.kp.to) { G.kp.t = 0; G.kp.hold = false; }
}

/* ---------- trick shot controls ---------- */
function setTrick(id) {
  if (!G || state !== 'play' || G.kind !== 'shoot' || G.phase !== 'aim') return;
  if (id && !has('trick_' + id)) return;
  G.trick = G.trick === id ? null : id;
  G.aim = null; G.meter.on = false; G.drag = null; G.trk = null;
  if (G.trick === 'panenka') G.trk = { lean: 0 };
  if (G.trick === 'topbins') G.trk = { side: 0 };
  if (G.trick === 'rabona') G.trk = {};
  sfx('tick');
  syncHint(); syncTricks();
}
function trickTap(px, py) {
  var tr = G.trick, k = G.trk;
  if (tr === 'panenka') {
    k.sold = Math.abs(Math.sin(G.t * 2.4)) > 0.8;
    strike(0, 1.3, 0.42, 'panenka');
    return true;
  }
  if (tr === 'topbins') {
    if (!k.side) {
      k.side = px < L.cx ? -1 : 1;
      G.aim = { x: k.side * 3.3, y: 2.2 };
      G.meter.on = true; G.meter.v = 0; G.meter.d = 1; G.meter.fast = true;
      sfx('aim'); syncHint();
      return true;
    }
    var v = G.meter.v;
    k.gold = v >= 0.9 && v <= 1.04;
    if (k.gold) strike(k.side * rnd(3.25, 3.4), rnd(2.12, 2.24), 1, 'topbins');
    else if (v < 0.9) strike(k.side * rnd(2.6, 3.0), rnd(1.3, 1.8), 0.85, 'topbins');
    else strike(k.side * rnd(3.5, 3.62), rnd(2.3, 2.5), 1, 'topbins');
    return true;
  }
  if (tr === 'rabona') {
    var side = px < L.cx ? -1 : 1;
    strike(side * rnd(2.5, 3.1), rnd(0.4, 1.4), 0.85, 'rabona');
    return true;
  }
  return false;
}

/* ---------- update ---------- */
function update(dt) {
  G.t += dt;
  var i, p, s = G.shot;
  /* slow motion while JT watches a kick come at them */
  var tgt = (G.kind === 'save' && (G.phase === 'flight' || (G.phase === 'windup' && G.st.kick > 0.6))) ? 0.34 : 1;
  G.slow = lerp(G.slow, tgt, Math.min(1, dt * 12));
  var gdt = dt * G.slow;
  G.pt += gdt;
  /* power meter: a gentle ping pong, it waits as long as JT likes */
  if (G.meter.on) {
    if (T.meter != null) G.meter.v = T.meter;
    else {
      G.meter.v += G.meter.d * dt * (G.meter.fast ? 1.9 : 0.85);
      if (G.meter.v > 1.2) { G.meter.v = 1.2; G.meter.d = -1; }
      if (G.meter.v < 0) { G.meter.v = 0; G.meter.d = 1; }
    }
  }
  /* striker */
  if (G.phase === 'runup') {
    if (G.ready || G.choice) {
      G.st.run = Math.min(1, G.st.run + gdt / 1.3 * (T.speed || 1));
      G.st.phase += gdt * 11;
      if (G.st.run >= 1) { G.phase = 'windup'; G.pt = 0; }
    }
  }
  if (G.phase === 'windup') {
    G.st.kick = Math.min(1, G.pt / 0.18 * (T.speed || 1));
    if (G.st.kick >= 1) {
      if (G.kind === 'save') cpuLaunch();
      else keeperThink(G.shot);
      G.phase = 'flight'; G.pt = 0;
      sfx('kick');
      s = G.shot;
      if (!RM) for (i = 0; i < 6; i++) addPart(L.cx + rnd(-6, 6) * L.u, L.by + rnd(-2, 2) * L.u, rnd(-60, 60) * L.u, rnd(-90, -30) * L.u, 300 * L.u, rnd(0.3, 0.5), pick(['#8fe0a8', '#5cc884', '#c9f2d4']), rnd(1.5, 3) * L.u);
    }
  } else if (G.st.kick > 0 && G.phase !== 'flight' && !G.celeb) {
    G.st.kick = Math.max(0, G.st.kick - dt * 2);
  }
  if (!(G.kp.hold && G.phase !== 'flight')) updateKeeper(G.kp, gdt);
  if (G.phase === 'flight' && s) {
    s.t = Math.min(1, s.t + gdt / s.ft);
    G.spin += s.spin * gdt;
    if ((store.eq.boots === 'comet' && s.who === 'jt') || s.trick) {
      var q = shotPos(s, s.t);
      G.trail.push(q.x, q.y, q.r);
      if (G.trail.length > 42) G.trail.splice(0, 3);
    }
    if (s.t >= 1) resolve();
  } else if (G.phase === 'result') {
    updateResult(dt);
  }
  if (G.trail.length && G.phase !== 'flight') G.trail.splice(0, 3);
  /* bulge, crowd, effects */
  if (G.bulge) { G.bulge.t += dt; if (G.bulge.t > 1.6) G.bulge = null; }
  if (G.cheer > 0) {
    G.cheer = Math.max(0, G.cheer - dt);
    if (!RM && Math.random() < dt * 18) addPart(rnd(0, L.W), rnd(L.yR + 6 * L.u, L.boardsTop - 4 * L.u), 0, 0, 0, 0.09, '#ffffff', rnd(1.5, 2.6) * L.u, 'flash');
  }
  if (G.shake > 0) G.shake = Math.max(0, G.shake - dt * 18);
  for (i = G.parts.length - 1; i >= 0; i--) {
    p = G.parts[i]; p.life -= dt;
    if (p.life <= 0) { G.parts.splice(i, 1); continue; }
    p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
  }
  for (i = G.conf.length - 1; i >= 0; i--) {
    p = G.conf[i]; p.life -= dt;
    if (p.life <= 0 || p.y > L.H + 20) { G.conf.splice(i, 1); continue; }
    p.vy = Math.min(p.vy + 140 * L.u * dt, 120 * L.u);
    p.vx *= (1 - dt * 1.2);
    p.x += (p.vx + Math.sin(G.t * 3 + p.ph) * 26 * L.u) * dt; p.y += p.vy * dt;
    p.rot += p.vr * dt;
  }
  for (i = G.bubbles.length - 1; i >= 0; i--) { G.bubbles[i].life -= dt; if (G.bubbles[i].life <= 0) G.bubbles.splice(i, 1); }
  updateCameos(dt);
  updateFireworks(dt);
  if (G.celeb) G.celeb.t += dt;
  if (G.fx.zap > 0) G.fx.zap = Math.max(0, G.fx.zap - dt);
  if (G.fx.emperor > 0) G.fx.emperor = Math.max(0, G.fx.emperor - dt);
  if (G.kp.knocked > 0) G.kp.knocked = Math.min(1, G.kp.knocked + dt * 2);
}

function resolve() {
  var s = G.shot, kp = G.kp, x = s.tx, y = s.ty, ax = Math.abs(x), out;
  var hit = keeperHits(kp, x, y);
  var postHit = ax >= HW - BALL && ax <= HW + 0.12 + BALL && y < GHM + 0.12;
  var barHit = !postHit && ax < HW + 0.12 && y >= GHM - BALL && y <= GHM + 0.12 + BALL;
  if (hit && ax < HW + 0.4 && y < GHM + 0.4) out = 'save';
  else if (ax < HW - BALL && y < GHM - BALL) out = 'goal';
  else if (postHit) out = 'post';
  else if (barHit) out = 'bar';
  else out = (ax - HW > y - GHM) ? 'wide' : 'over';
  var jt = G.kind === 'shoot', special = '';
  /* the era rules that help JT out */
  if (jt && out === 'save' && ERA.id === 'stone' && (T.rock || Math.random() < 0.3)) { out = 'goal'; special = 'rock'; kp.knocked = 0.01; }
  if (jt && (out === 'post' || out === 'bar') && ERA.id === 'eighties') { out = 'goal'; special = 'zap'; G.fx.zap = 0.9; sfx('zap'); }
  G.outcome = out; G.phase = 'result'; G.pt = 0; G.special = special;
  var bp = shotPos(s, 1), u = L.u;
  G.bp = { x: bp.x, y: bp.y, r: bp.r, vx: 0, vy: 0, floor: 0, mode: 'fly', t: 1 };
  if (out === 'goal') {
    G.layer = 'back';
    G.bp.mode = 'net';
    G.bulge = { x: clamp(x, -HW + 0.3, HW - 0.3), h: clamp(y, 0.2, GHM - 0.2), t: 0 };
    if (special === 'zap') { s.tx = clamp(x, -HW + 0.4, HW - 0.4); s.ty = clamp(y, 0.3, GHM - 0.3); }
    sfx('swish');
  } else if (out === 'save') {
    var h = handsAt(kp), close = Math.hypot(h.x - x, h.y - y) < 0.45;
    sfx('glove');
    if (close && (s.power < 0.8 || Math.random() < 0.4)) { G.bp.mode = 'held'; kp.holding = true; }
    else {
      G.bp.mode = 'phys';
      G.bp.vx = sgn(x || rnd(-1, 1)) * rnd(110, 200) * u; G.bp.vy = -rnd(150, 260) * u;
      G.bp.floor = L.gB + 46 * u;
    }
  } else if (out === 'post' || out === 'bar') {
    sfx('clang');
    G.shake = RM ? 0 : 5;
    G.bp.mode = 'phys';
    if (out === 'post') { G.bp.vx = sgn(x) * rnd(70, 150) * u; G.bp.vy = -rnd(60, 160) * u; }
    else { G.bp.vx = rnd(-60, 60) * u; G.bp.vy = -rnd(220, 300) * u; }
    G.bp.floor = L.gB + 36 * u;
  } else {
    G.bp.mode = 'away'; G.layer = 'back';
  }
  /* what it means */
  if (jt) {
    G.lastSide = Math.abs(x) < 0.9 ? 0 : sgn(x);
    if (out === 'goal') {
      store.goals++;
      if (s.trick) store.tricks++;
      if (G.mode === 'quick') G.streak++;
      var sub = special === 'rock' ? 'The rock bowled him over!' : special === 'zap' ? 'Laser post! Zapped in!' :
        s.trick ? pick(LINES[s.trick]) : pick(['Top bins!', 'Back of the net!', 'Get in!', 'Lovely finish!', 'Cool as you like.']);
      celebrate('GOAL!', 'goal', sub);
      G.celeb = { kind: store.eq.celeb, t: 0 };
      if (G.scarab && Math.hypot(G.scarab.x - x, G.scarab.y - y) < 0.85) {
        G.scarab.got = true; store.scarabs++;
        setTimeout(function () { toast('Golden scarab! ' + store.scarabs + ' found'); sfx('unlock'); }, 700);
      }
      commentary(pick(LINES.commGoal));
      if (G.mode === 'quick') bumpBest();
    } else {
      sfx('groan');
      crowdSay(pick(LINES.miss));
      commentary(out === 'save' ? pick(LINES.commSave) : pick(LINES.commMiss));
      if (ERA.id === 'rome' && !G.retakeUsed && G.mode !== 'wall') {
        G.retakeUsed = true; G.retake = true; G.fx.emperor = 2.6;
        setTimeout(function () { toast('Thumbs up! Have it again.'); }, 500);
      }
    }
    if (G.mode === 'cup' && !G.retake) G.cup.us.push(out === 'goal' ? 'g' : 'm');
  } else {
    var saved = out !== 'goal';
    if (G.mode === 'quick' && saved) G.streak++;
    if (saved) {
      store.saves++;
      if (out === 'save') { celebrate('SAVED!', 'save', G.mode === 'quick' ? '+1 for the save' : pick(['Safe hands!', 'Brick wall!', 'Big gloves!'])); commentary(pick(LINES.commSave)); }
      else { celebrate('MISSED!', 'save', G.mode === 'quick' ? 'They missed. +1 for you' : 'They missed it!'); commentary(pick(LINES.commMiss)); }
      crowdSay(pick(LINES.save));
      if (G.mode === 'quick') bumpBest();
      if (G.mode === 'wall') G.wall.saves++;
    } else {
      var right = G.choice && sideOf(G.choice.x) === sideOf(x);
      G.msg = right ? 'Right way, just out of reach.' : 'They scored. No harm done.';
      toast(right ? 'So close!' : (G.mode === 'quick' ? 'Your streak is safe' : 'Shake it off'));
      commentary(pick(LINES.commLet));
    }
    if (G.mode === 'wall') { G.wall.n++; G.wall.list.push(saved ? 'g' : 'm'); }
    if (G.mode === 'cup') G.cup.them.push(saved ? 'm' : 'g');
  }
  saveStore();
  updateHud();
}

function celebrate(text, kind, sub) {
  G.cheer = 2.2;
  sfx('cheer');
  G.shake = RM ? 0 : (kind === 'goal' ? 4 : 2);
  showBanner(text, kind, sub);
  var n = RM ? 18 : 110, i, u = L.u;
  var cols = kind === 'goal' ? [RED, '#ffffff', RED, '#ffffff', GOLD] : [GOLD, '#ffffff', RED, '#ffffff'];
  if (look() === 'eighties') cols = ['#ff4fa3', '#2de2e6', '#ffe14d', '#ffffff'];
  if (look() === 'future') cols = ['#7cf5c9', '#ffffff', '#ff5a6e', GOLD];
  for (i = 0; i < n; i++) {
    G.conf.push({ x: rnd(0, L.W), y: rnd(-L.H * 0.25, -6), vx: rnd(-30, 30) * u, vy: rnd(30, 110) * u,
      rot: rnd(0, TAU), vr: rnd(-8, 8), w: rnd(5, 8) * u, h: rnd(3, 4.5) * u, c: pick(cols), life: rnd(2.4, 3.6), ph: rnd(0, TAU) });
  }
  if (!RM) for (i = 0; i < 40; i++) {
    var gx = G.bp ? G.bp.x : L.cx, gy = G.bp ? G.bp.y : L.gB;
    G.conf.push({ x: gx + rnd(-20, 20) * u, y: gy, vx: rnd(-260, 260) * u, vy: rnd(-320, -120) * u,
      rot: rnd(0, TAU), vr: rnd(-10, 10), w: rnd(5, 8) * u, h: rnd(3, 4.5) * u, c: pick(cols), life: rnd(1.8, 2.8), ph: rnd(0, TAU) });
  }
}
function bumpBest() {
  if (G.streak > store.best) {
    store.best = G.streak; G.newBest = true; saveStore();
    if (!G.toastDone) { G.toastDone = true; toast('New best!', true); sfx('best'); }
  }
  if (G.mode === 'quick' && G.streak === 8 && !G.fx.sub) G.fx.sub = { t: 0 };
}

function updateResult(dt) {
  var b = G.bp, u = L.u, s = G.shot, out = G.outcome;
  if (b) {
    if (b.mode === 'net') {
      b.t = Math.min(1.12, b.t + dt / s.ft * 0.6);
      var q = shotPos(s, b.t); b.x = q.x; b.y = q.y; b.r = q.r;
      if (b.t >= 1.12) { b.mode = 'phys'; b.vx = 0; b.vy = 0; b.floor = groundY(1.13) - b.r; b.inNet = true; }
      G.spin += s.spin * dt * 0.5;
    } else if (b.mode === 'phys') {
      b.vy += 900 * u * dt; b.x += b.vx * dt; b.y += b.vy * dt;
      var fl = b.inNet ? b.floor : b.floor - b.r;
      if (b.y > fl) { b.y = fl; b.vy = -b.vy * 0.42; b.vx *= 0.8; if (Math.abs(b.vy) < 40 * u) b.vy = 0; }
      G.spin += b.vx * dt * 0.05;
    } else if (b.mode === 'held') {
      var h = handsAt(G.kp); b.x = gX(h.x); b.y = gY(h.y); b.r = BALL * L.ppm;
    } else if (b.mode === 'away') {
      b.t += dt / s.ft;
      var w = shotPos(s, b.t); b.x = w.x; b.y = w.y; b.r = w.r;
      G.fade = clamp(1 - (b.t - 1) / 0.45, 0, 1);
      G.spin += s.spin * dt;
    }
  }
  var wait = G.kind === 'save' ? 1.9 : out === 'goal' ? 2.1 : G.retake ? 2.4 : 1.4;
  if (G.mode === 'cup' && G.kind === 'shoot' && out !== 'goal') wait = G.retake ? 2.4 : 1.6;
  if (G.pt >= wait / (T.speed || 1)) afterResult();
}
function afterResult() {
  if (G.phase !== 'result') return;
  if (G.retake) { G.retake = false; G.turn--; startTurn(); return; }
  if (G.mode === 'quick') {
    if (G.kind === 'shoot' && G.outcome !== 'goal') { showOver(); return; }
    startTurn(); return;
  }
  if (G.mode === 'wall') {
    if (G.wall.n >= G.wall.of) { showWallOver(); return; }
    startTurn(); return;
  }
  /* cup: who has won? */
  var c = G.cup;
  c.k++;
  var res = tieState();
  if (res) { endTie(res); return; }
  startTurn();
}
function count(a) { var n = 0; for (var i = 0; i < a.length; i++) if (a[i] === 'g') n++; return n; }
function tieState() {
  var c = G.cup, us = count(c.us), th = count(c.them), nu = c.us.length, nt = c.them.length;
  if (nu <= 5 && nt <= 5) {
    var leftU = 5 - nu, leftT = 5 - nt;
    if (us > th + leftT) return 'win';
    if (th > us + leftU) return 'lose';
    if (nu === 5 && nt === 5) { if (us > th) return 'win'; if (th > us) return 'lose'; c.sd = true; }
    return null;
  }
  c.sd = true;
  if (nu === nt) { if (us > th) return 'win'; if (th > us) return 'lose'; }
  return null;
}
function skipAhead() {
  if (G && G.phase === 'result' && G.pt > 0.45 && (G.kind === 'save' || G.outcome === 'goal' || G.mode !== 'quick')) afterResult();
}

/* ---------- particles ---------- */
function addPart(x, y, vx, vy, g, life, c, s, kind) {
  if (G.parts.length > 300) return;
  G.parts.push({ x: x, y: y, vx: vx, vy: vy, g: g, life: life, max: life, c: c, s: s || 2, k: kind || '' });
}

/* ---------- bubbles: crowd, keeper, commentary ---------- */
function bubbleFrom(who, text) {
  if (!L || !G) return;
  if (G.bubbles.length > 3) G.bubbles.shift();
  G.bubbles.push({ who: who, text: text, life: 2.2, x: rnd(0.15, 0.85) });
}
function crowdSay(text) { bubbleFrom('crowd', text); if (Math.random() < 0.5) bubbleFrom('crowd', pick(EX.crowd)); }
var commT = 0;
function commentary(text) {
  if (!ui.ribbon) return;
  ui.ribbon.innerHTML = '<span>' + text + '</span>';
  ui.ribbon.className = 'jtp-ribbon on';
  clearTimeout(commT); commT = setTimeout(function () { if (ui.ribbon) ui.ribbon.className = 'jtp-ribbon'; }, 2100);
}

/* ---------- cameos and fireworks ---------- */
function findSecret(id) {
  if (store.secrets[id]) return false;
  store.secrets[id] = 1; saveStore();
  setTimeout(function () { toast('Secret found!', true); sfx('unlock'); }, 300);
  return true;
}
function dogPos(d) {
  var p = clamp(d.t / 5.5, 0, 1), x;
  if (d.dir > 0) x = lerp(-L.W * 0.08, L.W * 1.08, p); else x = lerp(L.W * 1.08, -L.W * 0.08, p);
  var y = lerp(L.gB, L.by, 0.3) + Math.sin(d.t * 3) * 6 * L.u;
  return { x: x, y: y, s: 0.9 * L.u };
}
function birdPos(b) {
  var tx = gX(b.x), ty = gY(GHM + 0.12) - 1 * L.u, x = tx, y = ty;
  if (b.st === 'in') { var p = ease(clamp(b.t / 1.2, 0, 1)); x = lerp(tx + b.side * L.W * 0.6, tx, p); y = lerp(ty - 140 * L.u, ty, p); }
  else if (b.st === 'out') { x = tx - b.side * b.t * 260 * L.u; y = ty - b.t * 200 * L.u; }
  return { x: x, y: y };
}
function jayPos(j) { return { x: j.x * L.W, y: lerp(L.yR, L.boardsTop, 0.55) }; }
function updateCameos(dt) {
  var fx = G.fx, b = fx.bird, d = fx.dog, j = fx.jay;
  if (b) {
    b.t += dt;
    if (b.st === 'in' && b.t > 1.2) { b.st = 'sit'; b.t = 0; sfx('chirp'); }
    else if (b.st === 'sit' && (b.t > 9 || (G.outcome === 'bar' && G.phase === 'result'))) { b.st = 'out'; b.t = 0; }
    else if (b.st === 'out' && b.t > 1.6) fx.bird = null;
  }
  if (d) {
    if (!d.tapped || d.spin <= 0) d.t += dt;
    if (d.spin > 0) d.spin = Math.max(0, d.spin - dt);
    if (d.t > 5.5) fx.dog = null;
  }
  if (j) { j.t += dt; if (j.t > 7) fx.jay = null; }
  if (fx.sub) {
    fx.sub.t += dt;
    if (fx.sub.t > 0.6 && !fx.sub.said) { fx.sub.said = 1; findSecret('sub'); bubbleFrom('jay', pick(JAY_SAYS)); }
    if (fx.sub.t > 6) fx.sub = null;
  }
  if (fx.fly) {
    fx.fly.t += dt;
    var f = fx.fly;
    if (f.t > 0) {
      var kx = G.kp.hx + G.kp.jx, ky = G.kp.hy + 0.9;
      var ang = f.t * 2.2;
      f.x = kx + Math.cos(ang) * 0.5 + (f.t > 3.5 ? (f.t - 3.5) * 3 : 0);
      f.y = ky + Math.sin(ang * 1.7) * 0.25 + (f.t > 3.5 ? (f.t - 3.5) * 1.5 : 0);
      f.near = f.t < 3.5;
      if (f.t > 6) { f.t = -rnd(2, 5); f.near = false; }
    } else f.near = false;
  }
}
/* taps on the hidden things come first; true means the tap was used */
function tapCameo(px, py) {
  var fx = G.fx, r = Math.max(26, 24 * L.u), p;
  if (fx.dog) {
    p = dogPos(fx.dog);
    if (Math.hypot(px - p.x, py - p.y) < r * 1.2 && !fx.dog.tapped) {
      fx.dog.tapped = 1; fx.dog.spin = 1.2; sfx('yip'); bubbleFrom('dog', 'Woof!'); findSecret('dog'); return true;
    }
  }
  if (fx.bird && fx.bird.st === 'sit') {
    p = birdPos(fx.bird);
    if (Math.hypot(px - p.x, py - p.y) < r) { fx.bird.st = 'out'; fx.bird.t = 0; sfx('chirp'); bubbleFrom('bird', 'Tweet!'); findSecret('bird'); return true; }
  }
  if (fx.jay && fx.jay.t > 0.6 && fx.jay.t < 6.5) {
    p = jayPos(fx.jay);
    if (Math.hypot(px - p.x, py - p.y) < r * 1.2 && !fx.jay.said) { fx.jay.said = 1; bubbleFrom('jayc', pick(JAY_SAYS)); findSecret('crowd'); sfx('tick'); return true; }
  }
  return false;
}
function updateFireworks(dt) {
  var i, f, u = L.u;
  if (G.phase === 'trophy' && !RM && Math.random() < dt * 1.6 && G.fw.length < 120) {
    var x = rnd(0.12, 0.88) * L.W, y = rnd(0.08, 0.3) * L.H, col = pick([GOLD, '#ffffff', RED, '#7cf5c9', '#ff9fd0']);
    for (i = 0; i < 26; i++) { var a = i / 26 * TAU; G.fw.push({ x: x, y: y, vx: Math.cos(a) * rnd(60, 110) * u, vy: Math.sin(a) * rnd(60, 110) * u, life: rnd(1, 1.6), max: 1.6, c: col }); }
    sfx('pop');
  }
  for (i = G.fw.length - 1; i >= 0; i--) {
    f = G.fw[i]; f.life -= dt;
    if (f.life <= 0) { G.fw.splice(i, 1); continue; }
    f.vy += 40 * u * dt; f.vx *= 0.985; f.x += f.vx * dt; f.y += f.vy * dt;
  }
}

/* ---------- drawing helpers ---------- */
function rr(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
  c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
  c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
}
function ellipse(c, x, y, rx, ry) { c.beginPath(); c.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, TAU); }
function circ(c, x, y, r) { c.beginPath(); c.arc(x, y, Math.max(0.1, r), 0, TAU); }
function pent(c, x, y, r, rot) {
  c.beginPath();
  for (var i = 0; i < 5; i++) { var a = rot + i * TAU / 5 - Math.PI / 2; c[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r); }
  c.closePath(); c.fill();
}
function ballKind() {
  var lk = look();
  if (lk === ERA.id && store.eq.stad === 'era') {
    if (lk === 'stone') return 'rock';
    if (lk === 'victorian') return 'leather';
    if (lk === 'future') return 'holo';
  }
  return store.eq.ball === 'beach' ? 'beach' : 'classic';
}
function drawBall(c, x, y, r, a, kind) {
  kind = kind || 'classic';
  c.save(); c.translate(x, y);
  var g;
  if (kind === 'rock') {
    c.rotate(a * 0.3);
    c.beginPath();
    for (var k = 0; k < 9; k++) { var aa = k / 9 * TAU, rr2 = r * (0.86 + 0.14 * Math.sin(k * 2.7)); c[k ? 'lineTo' : 'moveTo'](Math.cos(aa) * rr2, Math.sin(aa) * rr2); }
    c.closePath();
    g = c.createRadialGradient(-r * 0.3, -r * 0.4, r * 0.1, 0, 0, r);
    g.addColorStop(0, '#b9b2a6'); g.addColorStop(1, '#6d665c');
    c.fillStyle = g; c.fill();
    c.fillStyle = 'rgba(40,30,20,.35)'; circ(c, r * 0.25, r * 0.1, r * 0.18); c.fill(); circ(c, -r * 0.3, r * 0.35, r * 0.12); c.fill();
    c.restore(); return;
  }
  c.beginPath(); c.arc(0, 0, r, 0, TAU);
  if (kind === 'leather') {
    g = c.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
    g.addColorStop(0, '#d39a5c'); g.addColorStop(1, '#7a4a22'); c.fillStyle = g; c.fill();
    if (r > 2.5) {
      c.save(); c.clip(); c.rotate(a * 0.5);
      c.strokeStyle = 'rgba(60,30,10,.6)'; c.lineWidth = Math.max(1, r * 0.08);
      c.beginPath(); c.moveTo(-r, -r * 0.3); c.quadraticCurveTo(0, 0, r, -r * 0.3); c.moveTo(-r, r * 0.35); c.quadraticCurveTo(0, 0.1 * r, r, r * 0.35); c.stroke();
      c.strokeStyle = '#f2e2c4'; c.lineWidth = Math.max(0.8, r * 0.07);
      for (var l = -2; l <= 2; l++) { c.beginPath(); c.moveTo(l * r * 0.13 - r * 0.06, -r * 0.12); c.lineTo(l * r * 0.13 + r * 0.06, r * 0.08); c.stroke(); }
      c.restore();
    }
  } else if (kind === 'beach') {
    c.fillStyle = '#ffffff'; c.fill();
    if (r > 2) {
      c.save(); c.clip(); c.rotate(a * 0.4);
      var cols = [RED, GOLD, '#3a86ff', GREEN, '#ff9f1c', '#9b5de5'];
      for (var i = 0; i < 6; i++) {
        c.fillStyle = cols[i];
        c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r, i * TAU / 6, i * TAU / 6 + TAU / 12); c.closePath(); c.fill();
      }
      c.fillStyle = '#ffffff'; circ(c, 0, 0, r * 0.2); c.fill();
      c.restore();
    }
  } else {
    g = c.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.7, '#eef2f5'); g.addColorStop(1, '#aab6c0');
    c.fillStyle = g; c.fill();
    if (r > 2.5) {
      c.save(); c.clip();
      c.fillStyle = kind === 'holo' ? '#1a6a8f' : '#1f2a36';
      pent(c, Math.cos(a * 0.6) * r * 0.16, Math.sin(a * 0.6) * r * 0.12, r * 0.3, a);
      for (var j = 0; j < 5; j++) { var a2 = a + j * TAU / 5; pent(c, Math.cos(a2) * r * 0.86, Math.sin(a2) * r * 0.86, r * 0.27, a2 + 0.6); }
      c.restore();
    }
    if (kind === 'holo') { c.strokeStyle = 'rgba(124,245,201,.8)'; c.lineWidth = Math.max(1, r * 0.15); circ(c, 0, 0, r * 1.25); c.stroke(); }
  }
  c.beginPath(); c.arc(0, 0, r, 0, TAU);
  c.lineWidth = Math.max(1, r * 0.08); c.strokeStyle = 'rgba(10,20,30,.35)'; c.stroke();
  c.restore();
}

function computeLayout(W, H) {
  var u = Math.min(W / 380, H / 500);
  var by = Math.round(H - 70 * u);
  var D = clamp(H - 70 * u - 260 * u, 230 * u, 300 * u);
  var o = { W: W, H: H, u: u, cx: W / 2, gB: Math.round(by - D), by: by, ppm: 41 * u };
  o.hY = (SB * o.gB - o.by) / (SB - 1);
  L = o;
  var tb = tOfZ(-3);
  o.boardsBot = groundY(tb);
  o.boardsTop = o.boardsBot - 0.9 * o.ppm * persp(tb);
  o.yR = Math.min(o.boardsTop - 30 * u, Math.max(80 + 30 * u, o.boardsTop - 300 * u));
  return o;
}

/* each world's paint */
var LOOKS = {
  lights:    { sky: ['#06140d', '#0f2a1c'], st: ['#16261f', '#22372c'], roof: '#2b3b33', pitch: ['#2aa95c', '#34b868'], line: 'rgba(255,255,255,.92)',
               boards: [["JT'S XI", RED, '#ffffff'], ['BASE 5', '#ffffff', RED], ['TRAINING GROUND', GREEN, '#ffffff'], ['SHOOTOUT', GOLD, INK]],
               crowd: [RED, RED, RED, '#ffffff', '#ffffff', '#ffffff', '#b8001f', '#1d2a33', GOLD, '#d4dde4'], net: 'rgba(255,255,255,.5)', frame: '#ffffff' },
  stone:     { sky: ['#f2a65a', '#ffd9a0'], st: ['#8a6a48', '#6e5236'], roof: '#5e4630', pitch: ['#9db24a', '#aabf56'], line: 'rgba(255,248,230,.85)',
               boards: [['UG FC', '#a89a88', '#2b1d12'], ['FIRE: NEW!', '#e05a2b', '#fff3d6'], ['ROCKS 4 SALE', '#a89a88', '#2b1d12'], ['MAMMOTH MILK', '#d9c7a8', '#2b1d12']],
               crowd: ['#a8743e', '#8a5a2a', '#c98d62', '#7a4a22', '#d8923c'], hat: 'cave', net: 'rgba(90,120,50,.75)', frame: '#8a5a2a' },
  egypt:     { sky: ['#3a7bd5', '#ffd27a'], st: ['#d9b46a', '#c49a50'], roof: '#b88a3a', pitch: ['#7fb24a', '#8cbf55'], line: 'rgba(255,255,255,.9)',
               boards: [['NILE FM', '#1fb5a8', '#fff3d6'], ['CAMEL TAXI', '#e2b65e', '#3b2508'], ['MUMMY WRAPS', '#fff3d6', '#3b2508'], ['SAND CO', '#1fb5a8', '#fff3d6']],
               crowd: ['#ffffff', '#f4ead2', '#1fb5a8', '#e2b65e', '#ffffff'], hat: 'nemes', net: 'rgba(255,250,235,.55)', frame: '#f2c84b' },
  rome:      { sky: ['#8fa6b8', '#d8dfe4'], st: ['#c9b79a', '#b09c7e'], roof: '#9c8a6e', pitch: ['#4f9a4a', '#5aa654'], line: 'rgba(255,255,255,.9)',
               boards: [['VENI VIDI GOALI', '#b3263a', '#f4e2a8'], ['TOGA HIRE', '#f4efe6', '#2a1c22'], ['CHARIOT WASH', '#b3263a', '#f4e2a8'], ['STRAIGHT ROADS', '#f4efe6', '#2a1c22']],
               crowd: ['#ffffff', '#f4efe6', '#b3263a', '#e8c35a', '#ffffff', '#d8dfe4'], hat: 'laurel', rain: true, net: 'rgba(255,255,255,.5)', frame: '#f4efe6' },
  viking:    { sky: ['#24364f', '#5d7a99'], st: ['#5d4a32', '#3e3122'], roof: '#2e2418', pitch: ['#3f7a4a', '#4a8656'], line: 'rgba(240,240,230,.85)',
               boards: [['OLAF FC', '#d9a441', '#0f1820'], ['MEAD', '#7a2a1a', '#f4e2a8'], ['ROW ROW ROW', '#3f5a46', '#f4e2a8'], ['LOUD SINGING', '#d9a441', '#0f1820']],
               crowd: ['#7a2a1a', '#3f5a46', '#5d4a32', '#8a8a8a', '#d9a441'], hat: 'horns', net: 'rgba(230,220,190,.55)', frame: '#6b4a2a' },
  victorian: { sky: ['#6b6259', '#b7a993'], st: ['#6a3f2e', '#553225'], roof: '#3a2a22', pitch: ['#5f8a4a', '#6a9655'], line: 'rgba(250,245,230,.85)',
               boards: [['STEAM TEA', '#a8323e', '#f4ead2'], ['TOP HATS', '#1d1712', '#f4ead2'], ['GASLIGHT', '#4a3f36', '#f4ead2'], ['SOOT AND CO', '#a8323e', '#f4ead2']],
               crowd: ['#1d1712', '#2a2a2e', '#4a3f36', '#6b6259', '#a8323e'], hat: 'tophat', sepia: true, net: 'rgba(255,250,235,.5)', frame: '#f4ead2' },
  eighties:  { sky: ['#2b0b4a', '#ff4fa3'], st: ['#1d0b38', '#2b0b4a'], roof: '#14072a', pitch: ['#151030', '#1c1540'], line: '#2de2e6',
               boards: [['RAD', '#ff4fa3', '#14072a'], ['ARCADE', '#2de2e6', '#14072a'], ['CASSETTE', '#ffe14d', '#14072a'], ['BIG HAIR', '#ff4fa3', '#14072a']],
               crowd: ['#ff4fa3', '#2de2e6', '#ffe14d', '#9b5de5', '#ffffff'], hat: 'hair', net: 'rgba(45,226,230,.55)', frame: '#2de2e6' },
  future:    { sky: ['#06142b', '#2a4f8f'], st: ['#16243d', '#1e3354'], roof: '#0d1a2e', pitch: ['#1f6a5a', '#24786a'], line: 'rgba(124,245,201,.85)',
               boards: [['YEAR 3026', '#7cf5c9', '#06142b'], ['HOVER', '#16243d', '#7cf5c9'], ['TINSEL', '#ff5a6e', '#ffffff'], ['BEEP BOOP', '#7cf5c9', '#06142b']],
               crowd: ['#d5e2ee', '#7cf5c9', '#9fb2c6', '#ff5a6e', '#ffffff'], hat: 'dome', net: 'rgba(124,245,201,.5)', frame: '#d5e2ee' },
  park:      { sky: ['#7cc4ff', '#cfeaff'], st: null, pitch: ['#5cbf5a', '#68cc64'], line: 'rgba(255,255,255,.85)',
               boards: null, crowd: [RED, '#ffffff', '#3a86ff', GOLD, '#2b6e9e'], sparse: 0.75, net: 'rgba(255,255,255,.55)', frame: '#ffffff' },
  roof:      { sky: ['#0b1030', '#2a2a5a'], st: null, pitch: ['#2f8f6a', '#38a077'], line: 'rgba(255,255,255,.85)',
               boards: [['ROOFTOP', '#2a2a5a', '#ffc72c'], ['MIND THE EDGE', GOLD, INK], ['JT', RED, '#ffffff'], ['PIGEONS WELCOME', '#ffffff', INK]],
               crowd: [RED, '#ffffff', GOLD, '#9b5de5'], sparse: 0.85, net: 'rgba(255,255,255,.55)', frame: '#ffffff' },
  moon:      { sky: ['#000000', '#0b0b1a'], st: null, pitch: ['#8d8f96', '#9a9ca3'], line: 'rgba(255,255,255,.7)',
               boards: [['MOON FC', '#2a2a3a', '#ffffff'], ['LOW GRAVITY', GOLD, INK], ['NO AIR', '#ffffff', INK], ['ALIENS WELCOME', '#7cf5c9', INK]],
               crowd: ['#7cf5c9', '#9be36b', '#b9f27c'], hat: 'alien', sparse: 0.6, net: 'rgba(255,255,255,.55)', frame: '#e8e8f0' }
};

/* the still parts of the scene are drawn once per layout */
function buildBackground() {
  var d = ui.dpr, W = L.W, H = L.H, u = L.u, lk = look(), P = LOOKS[lk] || LOOKS.lights;
  bgKey = lk;
  bgCv = bgCv || document.createElement('canvas');
  bgCv.width = Math.round(W * d); bgCv.height = Math.round(H * d);
  var c = bgCv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  var i, x, y, g;
  /* sky */
  g = c.createLinearGradient(0, 0, 0, L.boardsTop);
  g.addColorStop(0, P.sky[0]); g.addColorStop(1, P.sky[1]);
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  var top = L.yR, bot = L.boardsTop;
  skyDeco(c, lk, top, bot);
  /* stand */
  if (P.st) {
    g = c.createLinearGradient(0, top, 0, bot);
    g.addColorStop(0, P.st[0]); g.addColorStop(1, P.st[1]);
    c.fillStyle = g; c.fillRect(0, top, W, bot - top);
    for (i = 1; i < 9; i++) { y = lerp(top, bot, i / 9); c.fillStyle = 'rgba(255,255,255,.035)'; c.fillRect(0, y, W, Math.max(1, u)); }
    standDeco(c, lk, top, bot);
  }
  /* boards */
  var bt = L.boardsTop, bb = L.boardsBot, bh = bb - bt, pw = Math.max(90 * u, bh * 4.6);
  if (P.boards) {
    var x0 = L.cx - pw * 2.5;
    while (x0 > 0) x0 -= pw;
    for (x = x0, i = 0; x < W; x += pw, i++) {
      var lb = P.boards[((i % 4) + 4) % 4];
      c.fillStyle = lb[1]; c.fillRect(x + 1, bt, pw - 2, bh);
      if (lk === 'stone') { c.fillStyle = 'rgba(0,0,0,.12)'; circ(c, x + pw * 0.2, bt + bh * 0.3, bh * 0.12); c.fill(); }
      c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(x + 1, bb - bh * 0.18, pw - 2, bh * 0.18);
      c.fillStyle = lb[2];
      var fs = Math.round(bh * 0.62);
      c.font = '700 ' + fs + 'px ' + DISP;
      c.textAlign = 'center'; c.textBaseline = 'middle';
      var tw = c.measureText(lb[0]).width;
      if (tw > pw * 0.86) { fs = Math.floor(fs * pw * 0.86 / tw); c.font = '700 ' + fs + 'px ' + DISP; }
      if (lk === 'eighties') { c.shadowColor = lb[1]; c.shadowBlur = 8 * u; }
      c.fillText(lb[0], x + pw / 2, bt + bh * 0.52);
      c.shadowBlur = 0;
    }
  } else if (lk === 'park') {
    c.fillStyle = '#8a6a48';
    for (x = 0; x < W; x += 16 * u) c.fillRect(x, bt + bh * 0.1, 4 * u, bh * 0.9);
    c.fillRect(0, bt + bh * 0.25, W, 3 * u); c.fillRect(0, bt + bh * 0.65, W, 3 * u);
  }
  c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, bb, W, Math.max(1, 1.5 * u));
  /* pitch, mown stripes in depth */
  c.fillStyle = P.pitch[0]; c.fillRect(0, bb, W, H - bb);
  var zs = [-3, -1.5, 0, 2.75, 5.5, 8.25, 11, 13.75, 16.5, 19.25];
  for (i = 0; i < zs.length - 1; i++) {
    var ya = groundY(tOfZ(zs[i])), yb = groundY(tOfZ(zs[i + 1]));
    if (ya > H) break;
    c.fillStyle = i % 2 ? P.pitch[1] : P.pitch[0];
    c.fillRect(0, ya, W, Math.min(H, yb) - ya);
  }
  pitchDeco(c, lk, bb);
  /* soft light */
  g = c.createRadialGradient(L.cx, L.gB, 10 * u, L.cx, L.gB, Math.max(W, H) * 0.7);
  g.addColorStop(0, 'rgba(255,255,230,.10)'); g.addColorStop(1, 'rgba(0,0,0,.18)');
  c.fillStyle = g; c.fillRect(0, bb, W, H - bb);
  /* lines */
  c.strokeStyle = P.line; c.lineCap = 'round'; c.lineJoin = 'round';
  if (lk === 'eighties') { c.shadowColor = '#2de2e6'; c.shadowBlur = 6 * u; }
  function line(pts) {
    c.beginPath();
    pts.forEach(function (p, j) { var px = wX(p[0], tOfZ(p[1])), py = groundY(tOfZ(p[1])); c[j ? 'lineTo' : 'moveTo'](px, py); });
    c.stroke();
  }
  c.lineWidth = Math.max(1.5, 0.12 * L.ppm);
  line([[-40, 0], [40, 0]]);
  c.lineWidth = Math.max(1.5, 0.12 * L.ppm * persp(0.75));
  line([[-9.16, 0], [-9.16, 5.5], [9.16, 5.5], [9.16, 0]]);
  c.lineWidth = Math.max(2, 0.12 * L.ppm * persp(0.2));
  if (lk === 'eighties') c.strokeStyle = '#ff4fa3';
  line([[-20.16, 0], [-20.16, 16.5]]); line([[20.16, 0], [20.16, 16.5]]);
  c.shadowBlur = 0;
  c.fillStyle = 'rgba(255,255,255,.95)';
  ellipse(c, L.cx, L.by - 1 * u, 0.12 * L.ppm * SB, 0.045 * L.ppm * SB); c.fill();
  c.fillStyle = 'rgba(210,190,120,.10)';
  ellipse(c, L.cx, groundY(tOfZ(0.8)), 1.8 * L.ppm, 0.4 * L.ppm); c.fill();
  buildCrowd(P);
}

function skyDeco(c, lk, top, bot) {
  var W = L.W, u = L.u, i, x, y;
  if (lk === 'stone') {
    c.fillStyle = 'rgba(255,240,200,.75)'; circ(c, W * 0.8, top * 0.45, 26 * u); c.fill();
    c.fillStyle = '#b07a4a';
    c.beginPath(); c.moveTo(0, top + 4 * u);
    for (x = 0; x <= W; x += 30 * u) c.lineTo(x, top - (10 + 18 * Math.abs(Math.sin(x * 0.013))) * u);
    c.lineTo(W, top + 4 * u); c.closePath(); c.fill();
    /* a mammoth on the ridge */
    var mx = W * 0.22, my = top - 14 * u;
    c.fillStyle = '#6e4a2a'; ellipse(c, mx, my, 22 * u, 13 * u); c.fill(); circ(c, mx + 20 * u, my - 4 * u, 9 * u); c.fill();
    c.fillRect(mx - 16 * u, my + 6 * u, 6 * u, 12 * u); c.fillRect(mx + 8 * u, my + 6 * u, 6 * u, 12 * u);
    c.strokeStyle = '#f4ead2'; c.lineWidth = 2.5 * u; c.beginPath(); c.arc(mx + 30 * u, my + 2 * u, 7 * u, -0.5, 2); c.stroke();
  } else if (lk === 'egypt') {
    c.fillStyle = 'rgba(255,240,180,.85)'; circ(c, W * 0.15, top * 0.4, 22 * u); c.fill();
    [[0.62, 70], [0.8, 46], [0.45, 38]].forEach(function (p) {
      var px = W * p[0], h = p[1] * u;
      c.fillStyle = '#e8c070'; c.beginPath(); c.moveTo(px - h, top); c.lineTo(px, top - h); c.lineTo(px + h, top); c.closePath(); c.fill();
      c.fillStyle = '#c99a4a'; c.beginPath(); c.moveTo(px, top - h); c.lineTo(px + h, top); c.lineTo(px + h * 0.25, top); c.closePath(); c.fill();
    });
  } else if (lk === 'rome') {
    c.fillStyle = 'rgba(120,135,150,.6)';
    for (i = 0; i < 5; i++) { ellipse(c, W * (0.1 + i * 0.22), top * 0.35 + (i % 2) * 10 * u, 50 * u, 16 * u); c.fill(); }
  } else if (lk === 'viking') {
    c.fillStyle = '#f4f0dc'; circ(c, W * 0.82, top * 0.4, 16 * u); c.fill();
    c.fillStyle = '#1b2a40'; c.fillRect(0, top - 18 * u, W, 18 * u);
    c.strokeStyle = 'rgba(255,255,255,.25)'; c.lineWidth = 1.2 * u;
    for (x = 0; x < W; x += 22 * u) { c.beginPath(); c.arc(x, top - 10 * u, 6 * u, Math.PI, TAU); c.stroke(); }
    /* a longship on the horizon */
    var sx = W * 0.25, sy = top - 18 * u;
    c.fillStyle = '#5d3a1a'; c.beginPath(); c.moveTo(sx - 30 * u, sy); c.quadraticCurveTo(sx, sy + 10 * u, sx + 30 * u, sy); c.lineTo(sx + 34 * u, sy - 10 * u); c.lineTo(sx + 26 * u, sy - 2 * u); c.lineTo(sx - 26 * u, sy - 2 * u); c.lineTo(sx - 34 * u, sy - 10 * u); c.closePath(); c.fill();
    c.fillStyle = '#f4ead2'; c.fillRect(sx - 1 * u, sy - 32 * u, 2 * u, 30 * u);
    c.fillStyle = '#a8323e'; c.fillRect(sx - 14 * u, sy - 30 * u, 28 * u, 20 * u);
    c.fillStyle = '#f4ead2'; c.fillRect(sx - 14 * u, sy - 22 * u, 28 * u, 4 * u);
  } else if (lk === 'victorian') {
    for (i = 0; i < 4; i++) {
      x = W * (0.1 + i * 0.27);
      c.fillStyle = '#3a2a22'; c.fillRect(x, top - 50 * u, 10 * u, 50 * u);
      c.fillStyle = 'rgba(200,190,175,.4)';
      for (var k = 0; k < 4; k++) { circ(c, x + 5 * u + k * 9 * u, top - 58 * u - k * 12 * u, (8 + k * 3) * u); c.fill(); }
    }
  } else if (lk === 'eighties') {
    var sy2 = top - 4 * u, sr = 48 * u;
    var g = c.createLinearGradient(0, sy2 - sr, 0, sy2);
    g.addColorStop(0, '#ffe14d'); g.addColorStop(1, '#ff4fa3');
    c.fillStyle = g; c.beginPath(); c.arc(W / 2, sy2, sr, Math.PI, TAU); c.fill();
    c.fillStyle = P_SKY_FILL(lk);
    for (i = 0; i < 5; i++) c.fillRect(W / 2 - sr, sy2 - (6 + i * 9) * u, sr * 2, (1.5 + i * 0.6) * u);
    c.fillStyle = '#ffffff';
    for (i = 0; i < 30; i++) circ(c, (i * 97 % 100) / 100 * W, ((i * 37) % 100) / 100 * top * 0.7, 0.9 * u), c.fill();
  } else if (lk === 'future' || lk === 'moon') {
    c.fillStyle = '#ffffff';
    for (i = 0; i < 60; i++) { circ(c, (i * 97 % 100) / 100 * W + (i % 3) * 3, ((i * 37) % 100) / 100 * top * 0.95, (0.6 + (i % 3) * 0.4) * u); c.fill(); }
    if (lk === 'moon') {
      x = W * 0.78; y = top * 0.38;
      c.fillStyle = '#2b6ad8'; circ(c, x, y, 26 * u); c.fill();
      c.fillStyle = '#3fbf6a'; ellipse(c, x - 8 * u, y - 6 * u, 10 * u, 7 * u); c.fill(); ellipse(c, x + 10 * u, y + 8 * u, 8 * u, 6 * u); c.fill();
      c.fillStyle = 'rgba(255,255,255,.7)'; ellipse(c, x, y - 20 * u, 14 * u, 3 * u); c.fill();
    } else {
      /* a hover car and a ringed planet */
      c.fillStyle = '#c4a0ff'; circ(c, W * 0.14, top * 0.4, 14 * u); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = 2 * u; ellipse(c, W * 0.14, top * 0.4, 24 * u, 5 * u); c.stroke();
    }
  } else if (lk === 'park') {
    c.fillStyle = '#fff6c4'; circ(c, W * 0.85, top * 0.35, 20 * u); c.fill();
    c.fillStyle = 'rgba(255,255,255,.9)';
    [[0.2, 0.3], [0.55, 0.18]].forEach(function (p) { ellipse(c, W * p[0], top * p[1] + 20 * u, 30 * u, 10 * u); c.fill(); ellipse(c, W * p[0] + 16 * u, top * p[1] + 14 * u, 18 * u, 10 * u); c.fill(); });
    /* houses and trees on the far side */
    for (x = -10 * u, i = 0; x < W; x += 54 * u, i++) {
      var hh = (34 + (i % 3) * 8) * u;
      c.fillStyle = ['#c46a4a', '#e2b65e', '#9fb2c6'][i % 3]; c.fillRect(x, bot - hh, 44 * u, hh);
      c.fillStyle = '#6b3a2a'; c.beginPath(); c.moveTo(x - 4 * u, bot - hh); c.lineTo(x + 22 * u, bot - hh - 18 * u); c.lineTo(x + 48 * u, bot - hh); c.closePath(); c.fill();
      c.fillStyle = '#fff3c4'; c.fillRect(x + 8 * u, bot - hh + 8 * u, 9 * u, 9 * u); c.fillRect(x + 27 * u, bot - hh + 8 * u, 9 * u, 9 * u);
    }
    for (x = 20 * u, i = 0; x < W; x += 70 * u, i++) {
      c.fillStyle = '#5a3a22'; c.fillRect(x - 3 * u, bot - 34 * u, 6 * u, 34 * u);
      c.fillStyle = i % 2 ? '#3f8f3a' : '#4fa04a'; circ(c, x, bot - 42 * u, 20 * u); c.fill();
    }
  } else if (lk === 'roof') {
    for (x = 0, i = 0; x < W; x += 34 * u, i++) {
      var bh2 = (60 + ((i * 53) % 90)) * u;
      c.fillStyle = i % 2 ? '#141a3a' : '#1b2148'; c.fillRect(x, bot - bh2, 30 * u, bh2);
      c.fillStyle = 'rgba(255,220,120,.7)';
      for (var wy = bot - bh2 + 8 * u; wy < bot - 10 * u; wy += 12 * u) for (var wx = 5 * u; wx < 26 * u; wx += 9 * u) if (((wx + wy + i) | 0) % 3) c.fillRect(x + wx, wy, 4 * u, 5 * u);
    }
  }
}
function P_SKY_FILL() { return '#2b0b4a'; }
function standDeco(c, lk, top, bot) {
  var W = L.W, u = L.u, i, x;
  if (lk === 'rome') {
    c.fillStyle = 'rgba(80,60,40,.45)';
    var aw = 30 * u;
    for (x = 4 * u; x < W; x += aw) {
      c.beginPath(); c.moveTo(x, bot); c.lineTo(x, top + 18 * u); c.arc(x + aw * 0.4, top + 18 * u, aw * 0.4, Math.PI, TAU); c.lineTo(x + aw * 0.8, bot); c.closePath(); c.fill();
    }
    c.fillStyle = '#9c8a6e'; c.fillRect(0, top - 9 * u, W, 9 * u);
    /* the Emperor's box */
    var ex = W * 0.5, ey = top + 2 * u;
    c.fillStyle = '#7d1626'; c.fillRect(ex - 34 * u, ey, 68 * u, 14 * u);
    c.fillStyle = '#e8c35a'; c.fillRect(ex - 34 * u, ey, 68 * u, 2.5 * u);
  } else if (lk === 'lights' || lk === 'eighties' || lk === 'future' || lk === 'victorian' || lk === 'egypt') {
    c.fillStyle = LOOKS[lk].roof; c.fillRect(0, top - 7 * u, W, 7 * u);
    c.fillStyle = lk === 'eighties' ? '#ff4fa3' : lk === 'future' ? '#7cf5c9' : 'rgba(255,255,255,.18)';
    c.fillRect(0, top - 1.5 * u, W, 1.5 * u);
    if (lk !== 'egypt') for (i = 0; i < 7; i++) { c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(W * (i + 0.5) / 7 - 2 * u, top, 4 * u, bot - top); }
  } else if (lk === 'viking') {
    c.fillStyle = '#2e2418'; c.fillRect(0, top - 6 * u, W, 6 * u);
    for (x = 6 * u, i = 0; x < W; x += 26 * u, i++) {
      c.fillStyle = ['#a8323e', '#d9a441', '#3f5a46', '#2a4a7a'][i % 4]; circ(c, x, top - 2 * u, 8 * u); c.fill();
      c.fillStyle = '#c0c0c0'; circ(c, x, top - 2 * u, 2.5 * u); c.fill();
    }
  } else if (lk === 'stone') {
    c.fillStyle = 'rgba(0,0,0,.18)';
    for (i = 0; i < 6; i++) { ellipse(c, W * (0.1 + i * 0.17), lerp(top, bot, 0.5), 20 * u, 8 * u); c.fill(); }
  }
}
function pitchDeco(c, lk, bb) {
  var W = L.W, H = L.H, u = L.u, i;
  if (lk === 'eighties') {
    c.strokeStyle = 'rgba(255,79,163,.35)'; c.lineWidth = 1 * u;
    for (i = -10; i <= 10; i++) { c.beginPath(); c.moveTo(wX(i * 3, tOfZ(-3)), groundY(tOfZ(-3))); c.lineTo(wX(i * 3, tOfZ(20)), groundY(tOfZ(20))); c.stroke(); }
  } else if (lk === 'moon') {
    c.fillStyle = 'rgba(60,60,70,.35)';
    [[0.15, 0.3, 30], [0.8, 0.5, 40], [0.3, 0.8, 50], [0.9, 0.85, 34], [0.55, 0.15, 18]].forEach(function (p) { ellipse(c, W * p[0], bb + (H - bb) * p[1], p[2] * u, p[2] * 0.3 * u); c.fill(); });
  } else if (lk === 'egypt') {
    c.fillStyle = 'rgba(226,182,94,.35)';
    for (i = 0; i < 6; i++) { ellipse(c, W * ((i * 37 % 100) / 100), bb + (H - bb) * ((i * 53 % 100) / 100), 40 * u, 8 * u); c.fill(); }
  } else if (lk === 'future') {
    c.strokeStyle = 'rgba(124,245,201,.12)'; c.lineWidth = 1 * u;
    for (i = 0; i < 9; i++) { var y = groundY(tOfZ(-3 + i * 2.6)); c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  } else if (lk === 'stone') {
    c.fillStyle = 'rgba(120,90,60,.35)';
    for (i = 0; i < 8; i++) { ellipse(c, W * ((i * 41 % 100) / 100), bb + (H - bb) * ((i * 67 % 100) / 100), 12 * u, 5 * u); c.fill(); }
  }
}

function buildCrowd(P) {
  var d = ui.dpr, W = L.W, u = L.u, lk = look();
  crowdCv = crowdCv || document.createElement('canvas');
  var top = L.yR + 4 * u, bot = L.boardsTop - 2 * u;
  if (!P.st) top = bot - 34 * u;
  crowdCv.width = Math.round(W * d); crowdCv.height = Math.round((bot + 6 * u) * d);
  var c = crowdCv.getContext('2d');
  c.setTransform(d, 0, 0, d, 0, 0);
  c.clearRect(0, 0, W, bot + 6 * u);
  var away = ['#20306e', '#8fd3ff', '#20306e', '#8fd3ff', '#ffffff', '#1d2a33'];
  var y = top, row = 0, skin = ['#f1c7a5', '#d9a07a', '#a86f4c', '#6e4630', '#f6d6bd'];
  var hat = P.hat, sparse = P.sparse || 0.06;
  while (y < bot) {
    var f = (y - top) / Math.max(1, bot - top);
    var r = (1.7 + 1.6 * f) * u, sp = r * 2.7;
    if (!P.st) { r = 4 * u; sp = r * 3.2; }
    var off = (row % 2) * sp / 2;
    for (var x = -sp + off; x < W + sp; x += sp) {
      if (Math.random() < sparse) continue;
      var col = (lk === 'lights' && x > W * 0.8) ? pick(away) : pick(P.crowd);
      var jx = rnd(-0.4, 0.4) * r, jy = rnd(-0.5, 0.5) * r, hx = x + jx, hy = y + jy - r * 0.45;
      c.fillStyle = col;
      ellipse(c, hx, y + jy + r * 0.5, r * 1.05, r * 0.8); c.fill();
      c.fillStyle = hat === 'alien' ? pick(P.crowd) : hat === 'dome' ? '#b8c6d6' : pick(skin);
      circ(c, hx, hy, r * 0.55); c.fill();
      if (hat === 'tophat') { c.fillStyle = '#1d1712'; c.fillRect(hx - r * 0.45, hy - r * 1.35, r * 0.9, r * 0.9); c.fillRect(hx - r * 0.7, hy - r * 0.5, r * 1.4, r * 0.18); }
      else if (hat === 'horns') { c.fillStyle = '#9aa0a6'; ellipse(c, hx, hy - r * 0.25, r * 0.6, r * 0.35); c.fill(); c.fillStyle = '#f4ead2'; c.beginPath(); c.moveTo(hx - r * 0.5, hy - r * 0.3); c.lineTo(hx - r * 0.95, hy - r * 1.1); c.lineTo(hx - r * 0.3, hy - r * 0.5); c.moveTo(hx + r * 0.5, hy - r * 0.3); c.lineTo(hx + r * 0.95, hy - r * 1.1); c.lineTo(hx + r * 0.3, hy - r * 0.5); c.fill(); }
      else if (hat === 'nemes') { c.fillStyle = Math.random() < 0.5 ? '#1fb5a8' : '#e2b65e'; c.fillRect(hx - r * 0.65, hy - r * 0.6, r * 1.3, r * 0.45); c.fillRect(hx - r * 0.7, hy - r * 0.3, r * 0.3, r * 0.9); c.fillRect(hx + r * 0.4, hy - r * 0.3, r * 0.3, r * 0.9); }
      else if (hat === 'laurel') { c.strokeStyle = '#5a8a3a'; c.lineWidth = r * 0.25; c.beginPath(); c.arc(hx, hy, r * 0.55, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
      else if (hat === 'cave') { c.fillStyle = '#3a2414'; circ(c, hx, hy - r * 0.35, r * 0.6); c.fill(); }
      else if (hat === 'hair') { c.fillStyle = pick(['#ffe14d', '#7a4a22', '#1a1410', '#ff9fd0']); circ(c, hx, hy - r * 0.3, r * 0.85); c.fill(); }
      else if (hat === 'dome') { c.strokeStyle = 'rgba(200,240,255,.8)'; c.lineWidth = r * 0.15; circ(c, hx, hy, r * 0.8); c.stroke(); }
      else if (hat === 'alien') { c.strokeStyle = c.fillStyle; c.lineWidth = r * 0.15; c.beginPath(); c.moveTo(hx - r * 0.3, hy - r * 0.4); c.lineTo(hx - r * 0.5, hy - r * 1.1); c.moveTo(hx + r * 0.3, hy - r * 0.4); c.lineTo(hx + r * 0.5, hy - r * 1.1); c.stroke(); c.fillStyle = '#16181d'; circ(c, hx - r * 0.2, hy, r * 0.12); c.fill(); circ(c, hx + r * 0.2, hy, r * 0.12); c.fill(); }
      if (lk === 'future' && Math.random() < 0.08) { c.fillStyle = Math.random() < 0.5 ? '#ff5a6e' : '#ffffff'; c.beginPath(); c.moveTo(hx, hy - r * 1.6); c.lineTo(hx - r * 0.5, hy - r * 0.5); c.lineTo(hx + r * 0.5, hy - r * 0.5); c.closePath(); c.fill(); }
    }
    y += sp * 0.78; row++;
  }
  if (P.st) { c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(0, bot - 1 * u, W, Math.max(1, u)); }
}

function drawCrowd(c) {
  if (!crowdCv) return;
  var d = ui.dpr, w = crowdCv.width, h = crowdCv.height;
  if (G.cheer <= 0 || RM) { c.drawImage(crowdCv, 0, 0, w, h, 0, 0, w / d, h / d); return; }
  var strips = 16, sw = w / strips, amp = 4 * L.u * Math.min(1, G.cheer);
  for (var i = 0; i < strips; i++) {
    var off = -Math.abs(Math.sin(G.t * 11 + i * 1.3)) * amp;
    c.drawImage(crowdCv, i * sw, 0, sw + 1, h, i * sw / d, off, (sw + 1) / d, h / d);
  }
}

function drawLights(c) {
  var W = L.W, u = L.u, lk = look(), ly = Math.max(14 * u, L.yR - 22 * u);
  if (lk === 'lights' || lk === 'roof') {
    [W * 0.07, W * 0.93].forEach(function (lx) {
      c.fillStyle = '#33433b';
      c.fillRect(lx - 2.5 * u, ly, 5 * u, L.boardsTop - ly);
      var g = c.createRadialGradient(lx, ly, 2 * u, lx, ly, 170 * u);
      g.addColorStop(0, 'rgba(255,255,235,.5)'); g.addColorStop(0.25, 'rgba(255,255,220,.16)'); g.addColorStop(1, 'rgba(255,255,220,0)');
      c.fillStyle = g; c.fillRect(lx - 170 * u, ly - 170 * u, 340 * u, 340 * u);
      c.fillStyle = '#3c4d44'; rr(c, lx - 17 * u, ly - 10 * u, 34 * u, 20 * u, 3 * u); c.fill();
      c.fillStyle = '#fffbe0';
      for (var j = 0; j < 2; j++) for (var i = 0; i < 4; i++) { circ(c, lx - 11.5 * u + i * 7.7 * u, ly - 4.5 * u + j * 9 * u, 2.9 * u); c.fill(); }
    });
  } else if (lk === 'stone' || lk === 'viking') {
    [W * 0.05, W * 0.95].forEach(function (lx, k) {
      var by = L.boardsTop, fl = RM ? 0 : Math.sin(G.t * 13 + k * 2) * 2 * u;
      c.fillStyle = '#5a3a22'; c.fillRect(lx - 3 * u, by - 46 * u, 6 * u, 46 * u);
      var g = c.createRadialGradient(lx, by - 52 * u, 2 * u, lx, by - 52 * u, 60 * u);
      g.addColorStop(0, 'rgba(255,200,90,.45)'); g.addColorStop(1, 'rgba(255,160,60,0)');
      c.fillStyle = g; c.fillRect(lx - 60 * u, by - 112 * u, 120 * u, 120 * u);
      c.fillStyle = '#ff9f1c'; ellipse(c, lx, by - 54 * u - fl, 6 * u, 11 * u + fl); c.fill();
      c.fillStyle = '#ffe14d'; ellipse(c, lx, by - 51 * u, 3 * u, 6 * u); c.fill();
    });
  } else if (lk === 'victorian') {
    [W * 0.06, W * 0.94].forEach(function (lx) {
      var by = L.boardsTop;
      c.fillStyle = '#1d1712'; c.fillRect(lx - 2 * u, by - 70 * u, 4 * u, 70 * u);
      c.fillStyle = 'rgba(255,230,160,.9)'; rr(c, lx - 6 * u, by - 84 * u, 12 * u, 14 * u, 2 * u); c.fill();
      c.strokeStyle = '#1d1712'; c.lineWidth = 1.5 * u; c.stroke();
    });
  }
}

function drawRain(c) {
  if (RM) return;
  var u = L.u, W = L.W, H = L.H;
  c.strokeStyle = 'rgba(220,230,240,.35)'; c.lineWidth = 1 * u;
  c.beginPath();
  for (var i = 0; i < 46; i++) {
    var x = ((i * 97.3 + G.t * 40 * u) % W), y = ((i * 53.7 + G.t * 520 * u) % H);
    c.moveTo(x, y); c.lineTo(x - 3 * u, y + 12 * u);
  }
  c.stroke();
}

/* ---------- the goal ---------- */
function netProfile(s) {
  if (s < 0.3) { var k = s / 0.3; return { z: lerp(0, -1.0, k), h: lerp(GHM, 2.25, k) }; }
  var k2 = (s - 0.3) / 0.7; return { z: lerp(-1.0, -1.9, k2), h: lerp(2.25, 0, k2) };
}
function netPt(x, z, h) {
  var b = G.bulge;
  if (b) {
    var amp = RM ? Math.exp(-b.t * 3) : Math.exp(-b.t * 2.6) * (0.75 + 0.25 * Math.cos(b.t * 16));
    var dx = x - b.x, dh = h - b.h, w = Math.exp(-(dx * dx + dh * dh) / 0.9) * amp;
    z -= w * 1.7; x += dx * w * 0.3; h += dh * w * 0.3;
  }
  var t = tOfZ(z);
  return [wX(x, t), wY(h, t)];
}
function drawNet(c) {
  var i, j, p, n, s, x, P = LOOKS[look()] || LOOKS.lights;
  c.lineWidth = Math.max(0.7, 0.9 * L.u);
  c.fillStyle = 'rgba(8,28,16,.28)';
  c.beginPath();
  p = netPt(-HW, 0, 0); c.moveTo(p[0], p[1]);
  p = netPt(-HW, 0, GHM); c.lineTo(p[0], p[1]);
  p = netPt(HW, 0, GHM); c.lineTo(p[0], p[1]);
  p = netPt(HW, 0, 0); c.lineTo(p[0], p[1]);
  c.closePath(); c.fill();
  if (G.bulge) {
    var b = G.bulge, amp = Math.exp(-b.t * 2.2), bp = netPt(b.x, -0.6, b.h);
    var gr = c.createRadialGradient(bp[0], bp[1], 0, bp[0], bp[1], 1.1 * L.ppm);
    gr.addColorStop(0, 'rgba(0,10,4,' + (0.45 * amp).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(0,10,4,0)');
    c.fillStyle = gr; c.fillRect(bp[0] - 1.2 * L.ppm, bp[1] - 1.2 * L.ppm, 2.4 * L.ppm, 2.4 * L.ppm);
  }
  c.strokeStyle = P.net;
  for (j = 0; j <= 14; j++) {
    s = j / 14; n = netProfile(s);
    c.beginPath();
    for (i = 0; i <= 20; i++) { x = -HW + 2 * HW * i / 20; p = netPt(x, n.z, n.h); c[i ? 'lineTo' : 'moveTo'](p[0], p[1]); }
    c.stroke();
  }
  for (i = 0; i <= 18; i++) {
    x = -HW + 2 * HW * i / 18;
    c.beginPath();
    for (j = 0; j <= 20; j++) { n = netProfile(j / 20); p = netPt(x, n.z, n.h); c[j ? 'lineTo' : 'moveTo'](p[0], p[1]); }
    c.stroke();
  }
  c.globalAlpha = 0.75;
  [-HW, HW].forEach(function (sx) {
    var k, m;
    for (k = 0; k <= 8; k++) {
      n = netProfile(k / 8);
      c.beginPath(); p = netPt(sx, 0, n.h); c.moveTo(p[0], p[1]); p = netPt(sx, n.z, n.h); c.lineTo(p[0], p[1]); c.stroke();
    }
    for (m = 1; m <= 5; m++) {
      var zz = -1.9 * m / 6;
      c.beginPath();
      for (k = 0; k <= 10; k++) {
        var hh = GHM * k / 10, top = netProfile(1 - hh / 2.25 * 0.7), zc = Math.max(zz, top.z);
        p = netPt(sx, zc, hh); c[k ? 'lineTo' : 'moveTo'](p[0], p[1]);
      }
      c.stroke();
    }
  });
  c.globalAlpha = 1;
}
function drawFrame(c) {
  var pw = 0.12 * L.ppm, u = L.u, lk = look(), P = LOOKS[lk] || LOOKS.lights, col = P.frame;
  var x1 = gX(-HW - 0.12), x2 = gX(HW), yt = gY(GHM + 0.12), hgt = GHM * L.ppm + 0.12 * L.ppm, wid = (2 * HW + 0.24) * L.ppm;
  c.fillStyle = 'rgba(0,0,0,.25)';
  ellipse(c, gX(-HW - 0.06), L.gB + 1.5 * u, pw * 1.4, pw * 0.4); c.fill();
  ellipse(c, gX(HW + 0.06), L.gB + 1.5 * u, pw * 1.4, pw * 0.4); c.fill();
  if (lk === 'eighties') { c.shadowColor = G.fx.zap > 0 ? '#ffffff' : '#2de2e6'; c.shadowBlur = (G.fx.zap > 0 ? 22 : 10) * u; }
  if (lk === 'future') { c.shadowColor = '#7cf5c9'; c.shadowBlur = 8 * u; }
  c.fillStyle = col;
  c.fillRect(x1, yt, pw, hgt); c.fillRect(x2, yt, pw, hgt); c.fillRect(x1, yt, wid, pw);
  c.shadowBlur = 0;
  if (lk === 'stone' || lk === 'viking') {
    /* wooden: knots and lashings */
    c.fillStyle = 'rgba(40,20,5,.35)';
    for (var i = 0; i < 6; i++) { c.fillRect(x1, yt + hgt * (i + 0.5) / 6, pw, 1.5 * u); c.fillRect(x2, yt + hgt * (i + 0.5) / 6, pw, 1.5 * u); }
    c.fillStyle = '#d9c7a8'; c.fillRect(x1 - 1 * u, yt - 1 * u, pw + 2 * u, pw + 2 * u); c.fillRect(x2 - 1 * u, yt - 1 * u, pw + 2 * u, pw + 2 * u);
  } else if (lk === 'egypt') {
    c.fillStyle = '#1fb5a8';
    for (var k = 0; k < 8; k++) { c.fillRect(x1, yt + hgt * k / 8, pw, hgt / 16); c.fillRect(x2, yt + hgt * k / 8, pw, hgt / 16); }
  } else if (lk === 'rome') {
    c.fillStyle = 'rgba(120,110,95,.5)';
    c.fillRect(x1 + pw * 0.35, yt + pw, pw * 0.15, hgt - pw); c.fillRect(x2 + pw * 0.35, yt + pw, pw * 0.15, hgt - pw);
    c.fillStyle = '#e8c35a'; c.fillRect(x1 - 2 * u, yt - 2 * u, pw + 4 * u, 4 * u); c.fillRect(x2 - 2 * u, yt - 2 * u, pw + 4 * u, 4 * u);
  } else {
    c.fillStyle = 'rgba(120,140,150,.45)';
    c.fillRect(x1 + pw * 0.62, gY(GHM), pw * 0.38, GHM * L.ppm);
    c.fillRect(x2 + pw * 0.62, gY(GHM), pw * 0.38, GHM * L.ppm);
    c.fillRect(gX(-HW), gY(GHM) - pw * 0.34, 2 * HW * L.ppm, pw * 0.34);
  }
  if (lk === 'future' || ERA.n === 7) drawTinsel(c, x1, yt, wid, hgt, pw);
}
function drawTinsel(c, x1, yt, wid, hgt, pw) {
  var u = L.u, cols = ['#ff5a6e', GOLD, '#7cf5c9', '#ffffff'];
  c.lineWidth = 2.2 * u;
  for (var k = 0; k < 2; k++) {
    c.strokeStyle = cols[k];
    c.beginPath();
    for (var i = 0; i <= 24; i++) {
      var x = x1 + wid * i / 24, y = yt + pw * 0.5 + Math.sin(i * 1.3 + k * 2) * 3 * u + (k ? 3 * u : 0);
      c[i ? 'lineTo' : 'moveTo'](x, y);
    }
    c.stroke();
  }
  for (var j = 0; j < 7; j++) { c.fillStyle = cols[j % 4]; circ(c, x1 + wid * (j + 0.5) / 7, yt + pw + 5 * u, 2.6 * u); c.fill(); }
}
/* things under the goal: the longship, hover pads */
function drawGoalBase(c) {
  var lk = look(), u = L.u;
  if (lk === 'viking') {
    var x1 = gX(-HW - 0.9), x2 = gX(HW + 0.9), y = L.gB + 2 * u, h = 16 * u;
    c.fillStyle = '#5d3a1a';
    c.beginPath(); c.moveTo(x1 - 10 * u, y - 26 * u); c.lineTo(x1, y); c.lineTo(x2, y); c.lineTo(x2 + 10 * u, y - 26 * u); c.lineTo(x2 - 6 * u, y - 6 * u); c.lineTo(x1 + 6 * u, y - 6 * u); c.closePath(); c.fill();
    c.fillStyle = '#7a4a22'; c.fillRect(x1, y - 6 * u, x2 - x1, h * 0.5);
    c.fillStyle = '#d9a441';
    for (var x = x1 + 8 * u, i = 0; x < x2 - 6 * u; x += 16 * u, i++) { c.fillStyle = ['#a8323e', '#d9a441', '#2a4a7a'][i % 3]; circ(c, x, y - 2 * u, 5 * u); c.fill(); }
    /* dragon head */
    c.fillStyle = '#5d3a1a'; c.beginPath(); c.moveTo(x1 - 10 * u, y - 26 * u); c.lineTo(x1 - 20 * u, y - 36 * u); c.lineTo(x1 - 6 * u, y - 34 * u); c.closePath(); c.fill();
    c.fillStyle = '#ffe14d'; circ(c, x1 - 13 * u, y - 33 * u, 1.5 * u); c.fill();
    c.strokeStyle = 'rgba(160,200,230,.6)'; c.lineWidth = 2 * u;
    c.beginPath(); for (var k = 0; k <= 30; k++) { var wx = lerp(x1 - 30 * u, x2 + 30 * u, k / 30); c[k ? 'lineTo' : 'moveTo'](wx, y + 7 * u + Math.sin(k * 0.9 + G.t * 3) * 2 * u); } c.stroke();
  } else if (lk === 'future') {
    [-HW - 0.06, HW + 0.06].forEach(function (sx) {
      var px = gX(sx), py = L.gB + 2 * u;
      c.fillStyle = '#4d5d70'; ellipse(c, px, py, 14 * u, 4 * u); c.fill();
      var g = c.createRadialGradient(px, py + 4 * u, 0, px, py + 4 * u, 18 * u);
      g.addColorStop(0, 'rgba(124,245,201,.7)'); g.addColorStop(1, 'rgba(124,245,201,0)');
      c.fillStyle = g; c.fillRect(px - 18 * u, py - 14 * u, 36 * u, 36 * u);
    });
  }
}
function goalBob() { return look() === 'viking' && !RM ? Math.sin(G.t * 1.6) * 4 * L.u : look() === 'future' && !RM ? Math.sin(G.t * 2.1) * 2 * L.u - 3 * L.u : 0; }

/* ---------- people ---------- */
var JAY_HAIR = '#6b4423';
function drawHead(c, k, kp, isJT) {
  var st = isJT ? 'jt' : k.style, skin = isJT ? '#e2ad86' : (k.skin || '#e2ad86'), hair = isJT ? '#4a3020' : (k.hair || '#2d2019');
  var sick = kp.sick && G.phase !== 'aim';
  if (st === 'robot') {
    c.fillStyle = '#b8c6d6'; rr(c, -0.15, -0.95, 0.3, 0.26, 0.05); c.fill();
    c.fillStyle = '#16243d'; rr(c, -0.12, -0.88, 0.24, 0.09, 0.03); c.fill();
    c.fillStyle = '#7cf5c9'; c.fillRect(-0.1 + 0.12 * (0.5 + 0.5 * Math.sin(G.t * 3)), -0.86, 0.06, 0.05);
    c.strokeStyle = '#9fb2c6'; c.lineWidth = 0.025; c.beginPath(); c.moveTo(0, -0.95); c.lineTo(0, -1.06); c.stroke();
    c.fillStyle = '#ff5a6e'; circ(c, 0, -1.07, 0.03); c.fill();
    if (ERA.n === 7) { c.fillStyle = RED; c.beginPath(); c.moveTo(-0.14, -0.95); c.lineTo(0.06, -1.15); c.lineTo(0.14, -0.95); c.closePath(); c.fill(); c.fillStyle = '#fff'; c.fillRect(-0.15, -0.97, 0.3, 0.04); circ(c, 0.06, -1.15, 0.035); c.fill(); }
    return;
  }
  c.fillStyle = skin; c.fillRect(-0.05, -0.72, 0.1, 0.1);
  circ(c, 0, -0.8, 0.125); c.fill();
  if (st === 'cat') {
    c.beginPath(); c.moveTo(-0.12, -0.86); c.lineTo(-0.1, -1.0); c.lineTo(-0.02, -0.92); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(0.12, -0.86); c.lineTo(0.1, -1.0); c.lineTo(0.02, -0.92); c.closePath(); c.fill();
    c.fillStyle = '#ffb3c1'; c.beginPath(); c.moveTo(-0.015, -0.78); c.lineTo(0.015, -0.78); c.lineTo(0, -0.76); c.closePath(); c.fill();
    c.strokeStyle = '#ffffff'; c.lineWidth = 0.01;
    c.beginPath(); c.moveTo(-0.04, -0.77); c.lineTo(-0.16, -0.79); c.moveTo(-0.04, -0.76); c.lineTo(-0.16, -0.74); c.moveTo(0.04, -0.77); c.lineTo(0.16, -0.79); c.moveTo(0.04, -0.76); c.lineTo(0.16, -0.74); c.stroke();
    c.fillStyle = '#c46a2a'; c.fillRect(-0.05, -0.92, 0.02, 0.05); c.fillRect(0.0, -0.93, 0.02, 0.05); c.fillRect(0.04, -0.92, 0.02, 0.05);
    var f = G.fx.fly, lx = f && f.near ? clamp((f.x - kp.hx - kp.jx) * 0.04, -0.02, 0.02) : 0;
    c.fillStyle = '#9be36b'; ellipse(c, -0.045 + lx, -0.81, 0.025, 0.02); c.fill(); ellipse(c, 0.045 + lx, -0.81, 0.025, 0.02); c.fill();
    c.fillStyle = '#1b1b1b'; c.fillRect(-0.05 + lx, -0.83, 0.01, 0.04); c.fillRect(0.04 + lx, -0.83, 0.01, 0.04);
    return;
  }
  if (st === 'mummy') {
    c.strokeStyle = '#c2b28a'; c.lineWidth = 0.012;
    for (var i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-0.12, -0.9 + i * 0.045); c.lineTo(0.12, -0.88 + i * 0.045); c.stroke(); }
    c.fillStyle = '#ffe14d'; circ(c, -0.045, -0.8, 0.018); c.fill(); circ(c, 0.045, -0.8, 0.018); c.fill();
    return;
  }
  /* hair and hats */
  c.fillStyle = hair;
  if (st === 'dancer') { circ(c, 0, -0.88, 0.17); c.fill(); }
  else if (st === 'caveman') { circ(c, 0, -0.86, 0.15); c.fill(); c.beginPath(); c.moveTo(-0.11, -0.78); c.quadraticCurveTo(0, -0.55, 0.11, -0.78); c.fill(); }
  else if (st === 'eighties') { c.beginPath(); c.arc(0, -0.83, 0.13, Math.PI * 1.02, Math.PI * 1.98); c.fill(); c.fillRect(-0.13, -0.83, 0.26, 0.2); c.fillStyle = '#ff4fa3'; c.fillRect(-0.13, -0.88, 0.26, 0.035); }
  else if (st === 'viking') { c.fillRect(-0.14, -0.82, 0.05, 0.22); c.fillRect(0.09, -0.82, 0.05, 0.22); c.beginPath(); c.moveTo(-0.09, -0.75); c.quadraticCurveTo(0, -0.58, 0.09, -0.75); c.fill(); c.fillStyle = '#9aa0a6'; c.beginPath(); c.arc(0, -0.84, 0.135, Math.PI, TAU); c.fill(); c.fillStyle = '#f4ead2'; c.beginPath(); c.moveTo(-0.12, -0.88); c.quadraticCurveTo(-0.24, -0.95, -0.22, -1.08); c.lineTo(-0.1, -0.93); c.fill(); c.beginPath(); c.moveTo(0.12, -0.88); c.quadraticCurveTo(0.24, -0.95, 0.22, -1.08); c.lineTo(0.1, -0.93); c.fill(); }
  else if (st === 'gladiator') { c.fillStyle = '#c9a43a'; c.beginPath(); c.arc(0, -0.83, 0.14, Math.PI, TAU); c.fill(); c.fillRect(-0.14, -0.84, 0.05, 0.12); c.fillRect(0.09, -0.84, 0.05, 0.12); c.fillStyle = '#b3263a'; c.beginPath(); c.ellipse(0, -0.98, 0.04, 0.09, 0, 0, TAU); c.fill(); }
  else if (st === 'victorian') { c.beginPath(); c.arc(0, -0.83, 0.13, Math.PI * 1.02, Math.PI * 1.98); c.fill(); c.fillStyle = '#16181d'; c.fillRect(-0.1, -1.12, 0.2, 0.24); c.fillRect(-0.16, -0.9, 0.32, 0.03); c.fillStyle = '#a8323e'; c.fillRect(-0.1, -0.93, 0.2, 0.03); }
  else if (st === 'giant') { c.beginPath(); c.arc(0, -0.83, 0.13, Math.PI * 1.02, Math.PI * 1.98); c.fill(); c.fillRect(-0.08, -0.84, 0.16, 0.02); }
  else if (st === 'jay') { c.beginPath(); c.arc(0, -0.84, 0.14, Math.PI * 0.95, Math.PI * 2.05); c.fill(); for (var h = -2; h <= 2; h++) { c.beginPath(); c.moveTo(h * 0.05, -0.92); c.lineTo(h * 0.06 + 0.03, -1.0 - (h % 2 ? 0.02 : 0)); c.lineTo(h * 0.05 + 0.04, -0.93); c.fill(); } }
  else { c.beginPath(); c.arc(0, -0.83, 0.13, Math.PI * 1.02, Math.PI * 1.98); c.fill(); }
  /* faces */
  c.fillStyle = '#1b1b1b';
  if (st === 'shades' || st === 'dancer') { c.fillStyle = st === 'dancer' ? '#ff4fa3' : '#111'; rr(c, -0.1, -0.83, 0.09, 0.05, 0.02); c.fill(); rr(c, 0.01, -0.83, 0.09, 0.05, 0.02); c.fill(); c.fillRect(-0.02, -0.82, 0.04, 0.01); }
  else {
    var ex = st === 'early' && kp.lean && G.phase === 'aim' ? kp.lean * 0.02 : 0;
    circ(c, -0.045 + ex, -0.8, 0.017); c.fill(); circ(c, 0.045 + ex, -0.8, 0.017); c.fill();
  }
  if (st === 'jay') { c.fillStyle = JAY_HAIR; c.fillRect(-0.085, -0.86, 0.07, 0.022); c.fillRect(0.015, -0.86, 0.07, 0.022); }
  if (st === 'victorian') { c.fillStyle = '#4a3020'; c.beginPath(); c.moveTo(0, -0.75); c.quadraticCurveTo(-0.08, -0.77, -0.13, -0.72); c.quadraticCurveTo(-0.06, -0.73, 0, -0.73); c.quadraticCurveTo(0.06, -0.73, 0.13, -0.72); c.quadraticCurveTo(0.08, -0.77, 0, -0.75); c.fill(); }
  if (st === 'gus') { c.fillStyle = GOLD; circ(c, -0.125, -0.78, 0.015); c.fill(); }
  if (sick) { c.fillStyle = 'rgba(120,200,90,.55)'; circ(c, 0, -0.78, 0.1); c.fill(); }
}
/* the keeper, seen from the front, in metres around the hip */
function drawKeeper(c, kp, k, isJT) {
  var m = L.ppm, a = kp.arms, sc = kp.sc, kit = isJT ? GK_JT : k.gk, st = isJT ? 'jt' : k.style;
  c.save();
  c.fillStyle = 'rgba(0,0,0,.22)';
  ellipse(c, gX(kp.hx + kp.jx), L.gB + 0.5 * L.u, 0.55 * m * sc * (1 - 0.4 * Math.min(1, Math.abs(kp.ang))), 0.09 * m); c.fill();
  var knock = kp.knocked || 0;
  c.translate(gX(kp.hx + kp.jx), gY(kp.hy) - knock * 0 ); c.rotate(kp.ang + knock * 1.4 * sgn(kp.ang || 1)); c.scale(m * sc, m * sc);
  c.lineCap = 'round'; c.lineJoin = 'round';
  var spread = 0.18 * (1 - a) + 0.04, bend = Math.sin(G.t * 4.6) * (RM || kp.to ? 0 : 0.02);
  if (st === 'dancer' && !kp.to && !RM) bend = Math.sin(G.t * 6.8) * 0.06;
  /* tail first, so it sits behind */
  if (st === 'cat') { c.strokeStyle = k.skin; c.lineWidth = 0.06; c.beginPath(); c.moveTo(0.15, 0.05); c.quadraticCurveTo(0.45, -0.05 + Math.sin(G.t * 3) * 0.1, 0.42, -0.35 + Math.sin(G.t * 2.4) * 0.08); c.stroke(); }
  if (st === 'robot') {
    var gr = c.createLinearGradient(0, 0.1, 0, 0.8);
    gr.addColorStop(0, 'rgba(124,245,201,.8)'); gr.addColorStop(1, 'rgba(124,245,201,0)');
    c.fillStyle = gr; c.beginPath(); c.moveTo(-0.14, 0.15); c.lineTo(0.14, 0.15); c.lineTo(0.05, 0.75 + (RM ? 0 : Math.sin(G.t * 20) * 0.05)); c.lineTo(-0.05, 0.75); c.closePath(); c.fill();
    c.fillStyle = '#4d5d70'; rr(c, -0.18, 0.05, 0.36, 0.14, 0.05); c.fill();
  } else {
    c.strokeStyle = kit.sock; c.lineWidth = 0.15;
    c.beginPath(); c.moveTo(-0.1, 0.1); c.lineTo(-0.1 - spread, 0.86 + bend); c.stroke();
    c.beginPath(); c.moveTo(0.1, 0.1); c.lineTo(0.1 + spread * (1 + a * 0.6), 0.86 - bend); c.stroke();
    if (st === 'mummy') { c.strokeStyle = '#c2b28a'; c.lineWidth = 0.01; for (var q = 0; q < 4; q++) { c.beginPath(); c.moveTo(-0.17 - spread * 0.4, 0.25 + q * 0.15); c.lineTo(-0.03, 0.27 + q * 0.15); c.stroke(); } }
    c.fillStyle = st === 'caveman' || st === 'gladiator' ? '#8a5a2a' : '#16181d';
    ellipse(c, -0.1 - spread, 0.9 + bend, 0.1, 0.06); c.fill();
    ellipse(c, 0.1 + spread * (1 + a * 0.6), 0.9 - bend, 0.1, 0.06); c.fill();
    c.fillStyle = kit.shorts; rr(c, -0.22, -0.06, 0.44, 0.28, 0.06); c.fill();
  }
  /* arms */
  var hx = lerp(0.52, 0.12, a), hy = lerp(-0.22, -1.22, a), ex = lerp(0.45, 0.17, a), ey = lerp(-0.5, -0.88, a);
  var lhx = -hx, lhy = hy, lex = -ex, ley = ey;
  if (st === 'gus' && kp.point && !kp.to && G.kind === 'shoot') { lhx = kp.point * 0.75; lhy = -0.75; lex = kp.point * 0.4; ley = -0.6; if (kp.point > 0) { var tx = lhx; lhx = -hx; hx = tx; hy = -0.75; ex = 0.4; ey = -0.6; lhy = -0.22; lex = -0.45; ley = -0.5; } }
  if (st === 'dancer' && !kp.to && !RM) { var dd = Math.sin(G.t * 6.8); hy = -0.6 - 0.5 * Math.max(0, dd); lhy = -0.6 - 0.5 * Math.max(0, -dd); }
  if (kp.sick && !kp.to) { hy = -0.4; lhy = -0.4; }
  c.strokeStyle = kit.shirt2; c.lineWidth = 0.12;
  c.beginPath(); c.moveTo(-0.18, -0.54); c.lineTo(lex, ley); c.lineTo(lhx, lhy); c.stroke();
  c.beginPath(); c.moveTo(0.18, -0.54); c.lineTo(ex, ey); c.lineTo(hx, hy); c.stroke();
  /* body */
  c.fillStyle = kit.shirt; rr(c, -0.23, -0.64, 0.46, 0.64, 0.1); c.fill();
  c.fillStyle = kit.shirt2; c.fillRect(-0.23, -0.12, 0.46, 0.08);
  c.fillStyle = kit.trim; c.fillRect(-0.07, -0.64, 0.14, 0.04);
  if (st === 'caveman') { c.fillStyle = '#5a3412'; [[-0.1, -0.5], [0.08, -0.4], [-0.05, -0.25], [0.12, -0.2], [0, -0.55]].forEach(function (p) { circ(c, p[0], p[1], 0.035); c.fill(); }); }
  else if (st === 'mummy') { c.strokeStyle = '#c2b28a'; c.lineWidth = 0.012; for (var b2 = 0; b2 < 8; b2++) { c.beginPath(); c.moveTo(-0.23, -0.6 + b2 * 0.075); c.lineTo(0.23, -0.56 + b2 * 0.075); c.stroke(); } }
  else if (st === 'robot') { c.fillStyle = '#7cf5c9'; circ(c, 0, -0.42, 0.06); c.fill(); c.fillStyle = '#16243d'; c.fillRect(-0.15, -0.25, 0.3, 0.04); }
  else if (st === 'victorian') { c.fillStyle = '#d8d0c0'; c.fillRect(-0.04, -0.64, 0.08, 0.3); c.fillStyle = '#a8323e'; c.beginPath(); c.moveTo(-0.06, -0.62); c.lineTo(0.06, -0.62); c.lineTo(0, -0.55); c.closePath(); c.fill(); }
  else {
    c.fillStyle = kit.num; c.font = '700 0.24px ' + DISP; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(st === 'cat' ? '9' : '1', 0, -0.36);
  }
  c.fillStyle = kit.glove;
  circ(c, lhx, lhy, 0.09); c.fill();
  circ(c, hx, hy, 0.09); c.fill();
  drawHead(c, k, kp, isJT);
  c.restore();
}

/* a striker seen from behind; s = px per unit, figure about 180 units tall */
function drawStriker(c, x, y, s, kit, o) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.lineCap = 'round'; c.lineJoin = 'round';
  c.fillStyle = 'rgba(0,0,0,.26)'; ellipse(c, 0, 2, 36, 8); c.fill();
  var pose = o.pose || '', pt = o.pt || 0;
  if (pose === 'worm') { c.translate(0, -20); c.rotate(-Math.PI / 2); c.translate(90, Math.sin(pt * 9) * (RM ? 0 : 6)); }
  var run = o.run || 0, k = o.kick || 0;
  var la = run ? Math.sin(run) * 9 : 0;
  var boot = o.boot || kit.boot;
  function leg(lx, lift, swing, kneel) {
    c.save(); c.translate(lx, -80); c.rotate(swing);
    var len = kneel ? 0.45 : 1;
    c.strokeStyle = '#e2ad86'; c.lineWidth = 14;
    c.beginPath(); c.moveTo(0, 0); c.lineTo(0, (34 - lift) * len); c.stroke();
    c.strokeStyle = kit.sock; c.lineWidth = 15;
    c.beginPath(); c.moveTo(0, (36 - lift) * len); c.lineTo(0, (70 - lift) * len); c.stroke();
    c.fillStyle = kit.sock2; c.fillRect(-7.5, (38 - lift) * len, 15, 4);
    c.fillStyle = boot; rr(c, -9, (68 - lift) * len, 18, 12, 5); c.fill();
    if (o.comet) { c.fillStyle = 'rgba(255,170,60,.85)'; c.beginPath(); c.moveTo(-9, (74 - lift) * len); c.lineTo(-22, (78 - lift) * len); c.lineTo(-9, (80 - lift) * len); c.closePath(); c.fill(); }
    c.restore();
  }
  var kneel = pose === 'knee';
  if (kneel) c.translate(0, 34);
  leg(-11, Math.max(0, la), 0.03, kneel);
  leg(11, Math.max(0, -la) + k * 22, -k * 0.35 - 0.03, kneel);
  c.fillStyle = kit.shorts; rr(c, -26, -104, 52, 38, 9); c.fill();
  c.fillStyle = kit.shorts2; c.fillRect(-1, -100, 2, 30);
  /* arms */
  var sw = run ? Math.sin(run) * 0.35 : 0;
  [-1, 1].forEach(function (sd) {
    var rot = sd * (0.18 + k * 0.5) + sd * sw;
    if (pose === 'knee' || pose === 'bonnie') rot = sd * (2.6 + (RM ? 0 : Math.sin(pt * 8) * 0.15));
    else if (pose === 'robot') rot = sd * (RM ? 1.4 : (Math.floor(pt * 4 + (sd > 0 ? 0 : 2)) % 2 ? 1.57 : 0.6));
    else if (pose === 'worm') rot = sd * 2.9;
    c.save(); c.translate(sd * 27, -146); c.rotate(rot);
    c.strokeStyle = '#e2ad86'; c.lineWidth = 11;
    c.beginPath(); c.moveTo(0, 8); c.lineTo(0, 46);
    if (pose === 'robot') c.lineTo(sd * -16, 46);
    c.stroke();
    c.strokeStyle = kit.sleeve; c.lineWidth = 15;
    c.beginPath(); c.moveTo(0, 2); c.lineTo(0, 18); c.stroke();
    c.restore();
  });
  /* shirt */
  c.fillStyle = kit.shirt;
  c.beginPath(); c.moveTo(-30, -150); c.quadraticCurveTo(0, -158, 30, -150); c.lineTo(25, -98); c.lineTo(-25, -98); c.closePath(); c.fill();
  if (kit.pat === 'hoops') {
    c.save(); c.clip();
    c.fillStyle = kit.shirt2; for (var hy = -150; hy < -98; hy += 16) c.fillRect(-32, hy + 6, 64, 8);
    c.restore();
  } else if (kit.pat === 'shine') {
    c.save(); c.clip();
    c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.moveTo(-30, -150); c.lineTo(-10, -150); c.lineTo(-30, -110); c.closePath(); c.fill();
    c.restore();
  }
  c.fillStyle = kit.shirt2; c.fillRect(-25, -104, 50, 6);
  c.fillStyle = kit.sleeve; c.fillRect(-30, -150, 6, 44); c.fillRect(24, -150, 6, 44);
  c.fillStyle = kit.print; c.textAlign = 'center'; c.textBaseline = 'middle';
  if (o.name) { c.font = '700 13px ' + DISP; c.fillText(o.name, 0, -138); }
  c.font = '700 32px ' + DISP; c.fillText(o.num, 0, -115);
  /* head, from behind (a peek of the face shows where they are looking) */
  c.fillStyle = '#e2ad86'; c.fillRect(-7, -164, 14, 12);
  ellipse(c, -16, -176, 3.5, 5.5); c.fill(); ellipse(c, 16, -176, 3.5, 5.5); c.fill();
  if (o.look) { c.fillStyle = '#e2ad86'; ellipse(c, o.look * 12, -174, 8, 9); c.fill(); }
  c.fillStyle = o.hair || '#2d2019';
  c.beginPath(); c.arc(o.look ? -o.look * 2 : 0, -178, 16.5, 0, TAU); c.fill();
  c.restore();
}

/* Bonnie: a small brown toy poodle, all curls, no tail */
function drawBonnie(c, x, y, s, face, t, jump) {
  c.save(); c.translate(x, y - (jump || 0)); c.scale(s * face, s);
  var bob = RM ? 0 : Math.sin(t * 18) * 1.2, col = '#8a5a34', dk = '#6e4426';
  c.fillStyle = 'rgba(0,0,0,.2)'; ellipse(c, 0, 14 + (jump || 0) / s, 16, 3.5); c.fill();
  c.fillStyle = dk;
  var legs = [-9, -4, 5, 10];
  for (var i = 0; i < 4; i++) { var sw2 = RM ? 0 : Math.sin(t * 18 + i * 1.6) * 3; c.fillRect(legs[i] + sw2 * 0.3, 2, 3.2, 11); circ(c, legs[i] + 1.6 + sw2 * 0.3, 13, 2.6); c.fill(); }
  c.fillStyle = col;
  [[-8, -1], [-3, -3], [3, -3], [8, -1], [-5, 3], [1, 2], [6, 3]].forEach(function (p) { circ(c, p[0], p[1] + bob, 5.2); c.fill(); });
  /* head */
  circ(c, 13, -9 + bob, 6.5); c.fill();
  circ(c, 12, -15 + bob, 4.5); c.fill();
  c.fillStyle = dk; ellipse(c, 9, -7 + bob, 3, 6.5); c.fill();
  c.fillStyle = col; ellipse(c, 18.5, -7.5 + bob, 4, 3); c.fill();
  c.fillStyle = '#1b1b1b'; circ(c, 22, -8 + bob, 1.4); c.fill(); circ(c, 15, -10.5 + bob, 1.1); c.fill();
  c.restore();
}
/* Jay: messy brown hair, big eyebrows, a tracksuit */
function drawJay(c, x, y, s, t, armUp) {
  c.save(); c.translate(x, y); c.scale(s, s);
  var b = RM ? 0 : Math.abs(Math.sin(t * 8)) * 3;
  c.translate(0, -b);
  c.lineCap = 'round';
  c.strokeStyle = '#2a3a6a'; c.lineWidth = 7;
  c.beginPath(); c.moveTo(-5, -30); c.lineTo(-6, 0); c.moveTo(5, -30); c.lineTo(6, 0); c.stroke();
  c.fillStyle = '#16181d'; ellipse(c, -6, 1, 5, 2.5); c.fill(); ellipse(c, 6, 1, 5, 2.5); c.fill();
  c.fillStyle = '#2f4a8a'; rr(c, -11, -62, 22, 34, 6); c.fill();
  c.fillStyle = '#ffffff'; c.fillRect(-11, -62, 3, 34); c.fillRect(8, -62, 3, 34);
  c.strokeStyle = '#2f4a8a'; c.lineWidth = 6;
  c.beginPath(); c.moveTo(-10, -58); c.lineTo(-17, armUp ? -80 : -36); c.moveTo(10, -58); c.lineTo(17, armUp ? -80 : -36); c.stroke();
  c.fillStyle = '#e2ad86'; circ(c, -17, armUp ? -82 : -34, 3); c.fill(); circ(c, 17, armUp ? -82 : -34, 3); c.fill();
  drawJayFace(c, 0, -72, 1);
  c.restore();
}
function drawJayFace(c, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = '#e2ad86'; circ(c, 0, 0, 10); c.fill();
  c.fillStyle = JAY_HAIR;
  c.beginPath(); c.arc(0, -3, 10.5, Math.PI * 0.95, Math.PI * 2.05); c.fill();
  for (var h = -3; h <= 3; h++) { c.beginPath(); c.moveTo(h * 3 - 2, -10); c.lineTo(h * 3.4 + 1, -16 - (h % 2 ? 2 : 0)); c.lineTo(h * 3 + 2.5, -10); c.fill(); }
  c.fillRect(-7, -4, 5.5, 2.2); c.fillRect(1.5, -4, 5.5, 2.2);
  c.fillStyle = '#1b1b1b'; circ(c, -4, 0, 1.2); c.fill(); circ(c, 4, 0, 1.2); c.fill();
  c.strokeStyle = '#7a3a2a'; c.lineWidth = 1.2; c.beginPath(); c.arc(0, 3.5, 3, 0.2, Math.PI - 0.2); c.stroke();
  c.restore();
}
function drawBird(c, x, y, s, flap) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = '#6b4a2a'; ellipse(c, 0, -5, 6, 5); c.fill();
  c.fillStyle = '#e8743a'; ellipse(c, 2, -4, 3.5, 3.5); c.fill();
  c.fillStyle = '#6b4a2a'; circ(c, 4, -10, 3.6); c.fill();
  c.fillStyle = '#1b1b1b'; circ(c, 5.2, -10.5, 0.8); c.fill();
  c.fillStyle = '#e0a800'; c.beginPath(); c.moveTo(7.2, -10); c.lineTo(9.6, -9.4); c.lineTo(7.2, -8.6); c.closePath(); c.fill();
  c.fillStyle = '#4a3020'; c.beginPath(); c.moveTo(-5, -6); c.lineTo(-10, -2); c.lineTo(-5, -3); c.closePath(); c.fill();
  if (flap != null) { c.fillStyle = '#5a3a1a'; c.beginPath(); c.moveTo(-1, -7); c.lineTo(-6, -7 - 7 * flap); c.lineTo(3, -7); c.closePath(); c.fill(); }
  c.strokeStyle = '#4a3020'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(-1, 0); c.lineTo(-1, 1.5); c.moveTo(2, 0); c.lineTo(2, 1.5); c.stroke();
  c.restore();
}
function drawTrophy(c, x, y, s, shine) {
  c.save(); c.translate(x, y); c.scale(s, s);
  var g = c.createLinearGradient(-30, 0, 30, 0);
  g.addColorStop(0, '#c48a00'); g.addColorStop(0.45, '#ffe680'); g.addColorStop(1, '#c48a00');
  c.fillStyle = '#5a3a1a'; rr(c, -24, 30, 48, 16, 3); c.fill();
  c.fillStyle = g;
  c.fillRect(-6, 10, 12, 22); rr(c, -16, 26, 32, 8, 2); c.fill();
  c.beginPath(); c.moveTo(-26, -40); c.lineTo(26, -40); c.quadraticCurveTo(24, 6, 0, 12); c.quadraticCurveTo(-24, 6, -26, -40); c.closePath(); c.fill();
  c.strokeStyle = g; c.lineWidth = 5;
  c.beginPath(); c.arc(-28, -22, 11, Math.PI * 0.5, Math.PI * 1.5); c.stroke();
  c.beginPath(); c.arc(28, -22, 11, -Math.PI * 0.5, Math.PI * 0.5); c.stroke();
  c.fillStyle = RED; c.fillRect(-26, -34, 52, 6);
  c.fillStyle = '#ffffff'; c.fillRect(-26, -28, 52, 3);
  if (shine) { c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.moveTo(-18, -36); c.lineTo(-12, -36); c.lineTo(-16, -8); c.closePath(); c.fill(); }
  c.restore();
}
function drawButterfly(c, x, y, s, t) {
  var f = RM ? 0.6 : Math.abs(Math.sin(t * 14));
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = '#ff9fd0'; ellipse(c, -4 * f, -2, 4 * f + 0.5, 5); c.fill(); ellipse(c, 4 * f, -2, 4 * f + 0.5, 5); c.fill();
  c.fillStyle = '#9b5de5'; ellipse(c, -3 * f, 3, 3 * f + 0.4, 3); c.fill(); ellipse(c, 3 * f, 3, 3 * f + 0.4, 3); c.fill();
  c.fillStyle = '#16181d'; c.fillRect(-0.6, -5, 1.2, 10);
  c.restore();
}

/* speech bubbles */
function bubble(c, x, y, text, tail, big) {
  var u = L.u, fs = Math.round((big ? 14 : 12.5) * u);
  c.font = '700 ' + Math.max(11, fs) + 'px ' + DISP;
  var w = c.measureText(text).width + 16 * u, h = Math.max(20, 22 * u);
  var bx = clamp(x - w / 2, 4, L.W - w - 4), by = y - h;
  c.fillStyle = '#ffffff'; c.strokeStyle = INK; c.lineWidth = 1.6 * u;
  rr(c, bx, by, w, h, 9 * u); c.fill(); c.stroke();
  if (tail) {
    var tx = clamp(x, bx + 10 * u, bx + w - 10 * u);
    c.beginPath(); c.moveTo(tx - 5 * u, by + h - 1); c.lineTo(tx, by + h + 7 * u); c.lineTo(tx + 5 * u, by + h - 1); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(tx - 5 * u, by + h); c.lineTo(tx, by + h + 7 * u); c.lineTo(tx + 5 * u, by + h); c.stroke();
  }
  c.fillStyle = INK; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(text, bx + w / 2, by + h / 2 + 1);
}
function drawBubbles(c) {
  var u = L.u, i, b, x, y;
  for (i = 0; i < G.bubbles.length; i++) {
    b = G.bubbles[i];
    c.globalAlpha = clamp(b.life * 3, 0, 1);
    if (b.who === 'crowd') { x = b.x * L.W; y = lerp(L.yR, L.boardsTop, 0.4) + (i % 2) * 14 * u; }
    else if (b.who === 'keeper') { x = gX(G.kp.hx + G.kp.jx); y = gY(G.kp.hy + 1.15 * G.kp.sc) - 4 * u; }
    else if (b.who === 'dog' && G.fx.dog) { var p = dogPos(G.fx.dog); x = p.x; y = p.y - 26 * u; }
    else if (b.who === 'bird' && G.fx.bird) { var q = birdPos(G.fx.bird); x = q.x; y = q.y - 16 * u; }
    else if (b.who === 'jayc' && G.fx.jay) { var j = jayPos(G.fx.jay); x = j.x; y = j.y - 30 * u; }
    else if (b.who === 'jay') { x = 70 * u; y = L.by - 120 * u; }
    else { c.globalAlpha = 1; continue; }
    bubble(c, x, y, b.text, true, b.who === 'jay' || b.who === 'jayc');
  }
  c.globalAlpha = 1;
}

/* ---------- the frame ---------- */
function render() {
  if (!ctx || !G || !L) return;
  var c = ctx, d = ui.dpr, u = L.u, s = G.shot, lk = look(), i, p;
  c.setTransform(d, 0, 0, d, 0, 0);
  var sx = 0, sy = 0;
  if (G.shake > 0 && !RM) { sx = rnd(-1, 1) * G.shake; sy = rnd(-1, 1) * G.shake; }
  c.fillStyle = '#123a22'; c.fillRect(0, 0, L.W, L.H);
  c.translate(sx, sy);
  if (bgKey !== lk) buildBackground();
  if (bgCv) c.drawImage(bgCv, 0, 0, bgCv.width, bgCv.height, 0, 0, L.W, L.H);
  drawCrowd(c);
  if (G.fx.jay) { var jp = jayPos(G.fx.jay), jt = G.fx.jay.t, rise = clamp(jt / 0.5, 0, 1) * clamp((7 - jt) / 0.5, 0, 1);
    c.save(); c.beginPath(); c.rect(0, L.yR, L.W, L.boardsTop - L.yR); c.clip();
    drawJay(c, jp.x, jp.y + (1 - rise) * 40 * u + 24 * u, 0.42 * u, jt, true);
    c.fillStyle = '#ffffff'; c.strokeStyle = INK; c.lineWidth = 1.2 * u;
    rr(c, jp.x - 15 * u, jp.y - 4 * u + (1 - rise) * 40 * u - 30 * u, 30 * u, 13 * u, 2 * u); c.fill(); c.stroke();
    c.fillStyle = RED; c.font = '700 ' + Math.round(9 * u) + 'px ' + DISP; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('GO JT!', jp.x, jp.y + 2.5 * u + (1 - rise) * 40 * u - 30 * u);
    c.restore();
  }
  drawLights(c);
  if (lk === 'rome') drawEmperor(c);
  for (i = 0; i < G.parts.length; i++) {
    p = G.parts[i];
    if (p.k !== 'flash') continue;
    c.fillStyle = 'rgba(255,255,255,' + (p.life / p.max).toFixed(2) + ')';
    circ(c, p.x, p.y, p.s); c.fill();
  }
  /* the goal, which may bob about */
  var bob = goalBob();
  c.save(); c.translate(0, bob);
  drawGoalBase(c);
  drawNet(c);
  c.restore();
  var bpos = null;
  if (s && (G.phase === 'flight' || G.phase === 'windup')) bpos = shotPos(s, s.t);
  else if (G.bp) bpos = G.bp;
  else bpos = { x: L.cx, y: L.by - BALL * L.ppm * SB, r: BALL * L.ppm * SB, gy: L.by };
  if (G.layer === 'back' && bpos) drawBallFull(c, bpos, true);
  c.save(); c.translate(0, bob);
  if (G.scarab && !G.scarab.got) drawScarab(c, gX(G.scarab.x), gY(G.scarab.y), 9 * u);
  if (G.phase !== 'trophy') drawKeeper(c, G.kp, G.keeper, G.kind === 'save');
  if (G.fx.fly && G.fx.fly.t > 0 && G.kind === 'shoot') drawButterfly(c, gX(G.fx.fly.x), gY(G.fx.fly.y), 1.4 * u, G.t);
  drawFrame(c);
  if (G.fx.bird) { var bp = birdPos(G.fx.bird); drawBird(c, bp.x, bp.y, 1.25 * u, G.fx.bird.st === 'sit' ? null : Math.abs(Math.sin(G.t * 20))); }
  if (G.plan != null && G.kind === 'shoot' && G.phase === 'aim') drawPlan(c);
  if (G.keeper.style === 'early' && G.kind === 'shoot' && G.phase === 'aim' && G.kp.lean) drawLeanTell(c);
  c.restore();
  if (G.trail.length) drawTrail(c);
  if (G.layer === 'front' && bpos && G.phase !== 'trophy') drawBallFull(c, bpos, false);
  /* the pitch invader */
  if (G.fx.dog) { var dp = dogPos(G.fx.dog), sp = G.fx.dog.spin; drawBonnie(c, dp.x, dp.y, dp.s * 1.4, sp > 0 ? (Math.floor(sp * 8) % 2 ? 1 : -1) : G.fx.dog.dir, G.t, sp > 0 ? Math.abs(Math.sin(sp * 6)) * 10 * u : 0); }
  if (G.fx.sub) drawSub(c);
  if (G.phase !== 'trophy') drawPlayer(c);
  if (G.kind === 'shoot' && G.phase === 'aim') drawAim(c);
  if (G.kind === 'save' && G.phase !== 'result') drawSaveHelp(c);
  for (i = 0; i < G.parts.length; i++) {
    p = G.parts[i];
    if (p.k === 'flash') continue;
    c.globalAlpha = clamp(p.life / p.max * 1.5, 0, 1);
    c.fillStyle = p.c; circ(c, p.x, p.y, p.s); c.fill();
  }
  c.globalAlpha = 1;
  if (lk === 'rome') drawRain(c);
  if (lk === 'victorian') { c.globalCompositeOperation = 'multiply'; c.fillStyle = '#e0cba4'; c.fillRect(-10, -10, L.W + 20, L.H + 20); c.globalCompositeOperation = 'source-over'; }
  if (G.phase === 'trophy') drawTrophyScene(c);
  for (i = 0; i < G.conf.length; i++) {
    p = G.conf[i];
    c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.scale(1, Math.cos(p.rot * 1.7 + p.ph));
    c.globalAlpha = clamp(p.life * 1.5, 0, 1);
    c.fillStyle = p.c; c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    c.restore();
  }
  c.globalAlpha = 1;
  for (i = 0; i < G.fw.length; i++) { p = G.fw[i]; c.globalAlpha = clamp(p.life / p.max * 1.4, 0, 1); c.fillStyle = p.c; circ(c, p.x, p.y, 2.2 * u); c.fill(); }
  c.globalAlpha = 1;
  drawBubbles(c);
}

function drawPlayer(c) {
  var u = L.u, save = G.kind === 'save';
  var kit = save ? (G.cpu ? G.cpu.kit : KIT_AWAY) : KITS[store.eq.kit] || KITS.home;
  var r0 = G.st.run, ex = 1 - (1 - r0) * (1 - r0);
  var fx = lerp(L.cx - 150 * u, L.cx - 48 * u, ex) + G.st.kick * 26 * u;
  var fy = lerp(L.by + 70 * u, L.by + 16 * u, ex) - G.st.kick * 6 * u;
  var o = { run: r0 < 1 && !RM ? G.st.phase : 0, kick: G.st.kick, name: save ? '' : 'JT', num: save ? (G.cpu ? G.cpu.num : '9') : '7', hair: save ? '#1a1410' : '#4a3020' };
  if (!save && store.eq.boots === 'comet') { o.boot = '#ff7a1a'; o.comet = true; }
  if (save && G.cpu && G.phase === 'runup' && r0 > 0.55) o.look = G.cpu.look;
  if (G.trick === 'rabona' && G.phase !== 'aim' && !G.celeb) o.kick = G.st.kick * 0.6;
  var cel = G.celeb;
  if (cel && !save) {
    var t = cel.t, k = cel.kind;
    o.kick = 0; o.pt = t; o.run = 0;
    if (k === 'knee') { var sl = ease(clamp(t / 0.7, 0, 1)); fy -= sl * 60 * u; fx += sl * 30 * u; o.pose = 'knee'; }
    else if (k === 'robot') { o.pose = 'robot'; fx += RM ? 0 : (Math.floor(t * 4) % 2 ? 4 : -4) * u; }
    else if (k === 'worm') { o.pose = 'worm'; fx += Math.min(t, 1.4) * 30 * u; }
    else if (k === 'bonnie') { o.pose = 'bonnie'; }
    drawStriker(c, fx, fy, 0.72 * u, kit, o);
    if (k === 'bonnie') {
      var a = t * 4, br = 46 * u;
      drawBonnie(c, fx + Math.cos(a) * br, fy + Math.sin(a) * 14 * u - 4 * u, 0.9 * u, -Math.sin(a) >= 0 ? 1 : -1, G.t, 0);
      if (t > 0.3 && t < 0.4 && !cel.yip) { cel.yip = 1; sfx('yip'); }
    }
    return;
  }
  drawStriker(c, fx, fy, 0.72 * u, kit, o);
}

function drawBallFull(c, b, behind) {
  var u = L.u, gy = b.gy, s = G.shot;
  if (gy == null) {
    if (G.bp && G.bp.mode === 'phys') gy = G.bp.floor + (G.bp.inNet ? b.r : 0);
    else if (s && G.bp && (G.bp.mode === 'net' || G.bp.mode === 'away')) gy = shotPos(s, G.bp.t).gy;
  }
  c.save();
  c.globalAlpha = behind ? G.fade : 1;
  if (gy != null && !(G.bp && G.bp.mode === 'held')) {
    var hgt = Math.max(0, gy - (b.y + b.r));
    var sa = clamp(0.35 - hgt / (220 * u), 0.06, 0.35);
    c.fillStyle = 'rgba(0,0,0,' + sa.toFixed(3) + ')';
    ellipse(c, b.x, gy - b.r * 0.1, b.r * 1.1, b.r * 0.32); c.fill();
  }
  drawBall(c, b.x, b.y, b.r, G.spin, ballKind());
  c.restore();
}
function drawTrail(c) {
  var t = G.trail, n = t.length / 3, comet = store.eq.boots === 'comet';
  for (var i = 0; i < n; i++) {
    var a = (i + 1) / n;
    c.fillStyle = comet ? 'rgba(255,' + Math.round(120 + 100 * a) + ',40,' + (0.45 * a).toFixed(2) + ')' : 'rgba(255,255,255,' + (0.3 * a).toFixed(2) + ')';
    circ(c, t[i * 3], t[i * 3 + 1], t[i * 3 + 2] * (0.5 + 0.5 * a)); c.fill();
  }
}
function drawScarab(c, x, y, r) {
  var g = RM ? 0.5 : 0.5 + 0.5 * Math.sin(G.t * 4);
  c.fillStyle = 'rgba(255,215,90,' + (0.25 + 0.25 * g).toFixed(2) + ')'; circ(c, x, y, r * 1.7); c.fill();
  c.fillStyle = '#e8b830'; ellipse(c, x, y + r * 0.1, r * 0.7, r * 0.9); c.fill();
  c.fillStyle = '#1fb5a8'; circ(c, x, y - r * 0.8, r * 0.4); c.fill();
  c.strokeStyle = '#7a5a10'; c.lineWidth = Math.max(1, r * 0.12); c.beginPath(); c.moveTo(x, y - r * 0.7); c.lineTo(x, y + r); c.stroke();
}
function drawPlan(c) {
  var u = L.u, x = gX(G.kp.hx), y = gY(GHM + 0.75), d = G.plan;
  c.fillStyle = 'rgba(6,20,40,.8)'; c.strokeStyle = '#7cf5c9'; c.lineWidth = 1.5 * u;
  rr(c, x - 30 * u, y - 12 * u, 60 * u, 24 * u, 6 * u); c.fill(); c.stroke();
  c.fillStyle = '#7cf5c9'; c.beginPath();
  if (d === 0) { c.moveTo(x - 6 * u, y + 7 * u); c.lineTo(x + 6 * u, y + 7 * u); c.lineTo(x, y - 7 * u); }
  else { c.moveTo(x - 12 * d * u, y); c.lineTo(x + 4 * d * u, y - 8 * u); c.lineTo(x + 4 * d * u, y + 8 * u); }
  c.closePath(); c.fill();
  c.font = '700 ' + Math.round(8 * u) + 'px ' + DISP; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('PLAN', x + (d === 0 ? 16 : -14 * d) * u, y);
}
function drawLeanTell(c) {
  var u = L.u, x = gX(G.kp.hx + G.kp.jx + G.kp.lean * 0.9), y = gY(1.2);
  c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 2 * u;
  for (var i = 0; i < 3; i++) { var o = (RM ? 0 : (G.t * 20) % 6) + i * 6; c.beginPath(); c.moveTo(x + G.kp.lean * o * u, y - 6 * u); c.lineTo(x + G.kp.lean * (o + 4) * u, y); c.lineTo(x + G.kp.lean * o * u, y + 6 * u); c.stroke(); }
}
function drawEmperor(c) {
  var u = L.u, x = L.W * 0.5, y = L.yR + 2 * u, on = G.fx.emperor > 0;
  c.fillStyle = '#e2ad86'; circ(c, x, y - 4 * u, 5 * u); c.fill();
  c.fillStyle = '#ffffff'; c.fillRect(x - 6 * u, y, 12 * u, 6 * u);
  c.strokeStyle = '#5a8a3a'; c.lineWidth = 1.6 * u; c.beginPath(); c.arc(x, y - 4 * u, 5.5 * u, Math.PI * 1.05, Math.PI * 1.95); c.stroke();
  if (on) {
    var lift = ease(clamp((2.6 - G.fx.emperor) / 0.4, 0, 1));
    c.fillStyle = '#e2ad86'; rr(c, x + 7 * u, y - 4 * u - lift * 10 * u, 6 * u, 7 * u, 2 * u); c.fill();
    c.fillRect(x + 9 * u, y - 10 * u - lift * 10 * u, 2.5 * u, 7 * u);
    bubble(c, x, y - 18 * u, 'Have it again!', true, true);
  }
}
function drawSub(c) {
  var u = L.u, t = G.fx.sub.t, x = lerp(-30 * u, 60 * u, ease(clamp(t / 1.2, 0, 1))), y = L.by - 40 * u;
  if (t > 5) x = lerp(60 * u, -40 * u, (t - 5));
  drawJay(c, x, y, 0.85 * u, t, Math.floor(t * 2) % 2 === 0);
  c.fillStyle = '#16181d'; rr(c, x + 14 * u, y - 70 * u, 22 * u, 16 * u, 2 * u); c.fill();
  c.fillStyle = '#7cf5c9'; c.font = '700 ' + Math.round(10 * u) + 'px ' + DISP; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('SUB', x + 25 * u, y - 62 * u);
}

function drawAim(c) {
  var u = L.u, bx = L.cx, by = L.by - BALL * L.ppm * SB, t, a = null, tr = G.trick;
  if (tr === 'panenka') {
    var lean = Math.abs(Math.sin(G.t * 2.4)) > 0.8;
    var kx = gX(G.kp.hx + G.kp.jx), ky = gY(G.kp.hy);
    c.strokeStyle = lean ? GOLD : 'rgba(255,255,255,.5)'; c.lineWidth = (lean ? 4 : 2) * u;
    ellipse(c, kx, ky - 10 * u, 34 * u, 52 * u); c.stroke();
    return;
  }
  if (tr === 'rabona') {
    c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = 3 * u; c.setLineDash([4 * u, 6 * u]);
    c.beginPath(); c.moveTo(bx - 70 * u, by - 10 * u); c.lineTo(bx + 70 * u, by - 10 * u); c.stroke(); c.setLineDash([]);
    c.fillStyle = 'rgba(255,255,255,.85)';
    [-1, 1].forEach(function (sd) { c.beginPath(); c.moveTo(bx + sd * 82 * u, by - 10 * u); c.lineTo(bx + sd * 70 * u, by - 18 * u); c.lineTo(bx + sd * 70 * u, by - 2 * u); c.closePath(); c.fill(); });
    return;
  }
  if (tr === 'topbins' && G.trk && !G.trk.side) {
    [-1, 1].forEach(function (sd) {
      var x = gX(sd * 3.25), y = gY(2.15), r = (14 + (RM ? 0 : Math.sin(G.t * 5) * 2)) * u;
      c.strokeStyle = GOLD; c.lineWidth = 3 * u; circ(c, x, y, r); c.stroke();
      c.fillStyle = 'rgba(255,199,44,.25)'; c.fill();
    });
  }
  if (G.drag && G.drag.live) a = G.drag.aim;
  else if (G.aim) a = G.aim;
  if (a) {
    var ax = gX(clamp(a.x, -7, 7)), ay = gY(clamp(a.y, -0.6, 5));
    c.save();
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 2 * u; c.setLineDash([3 * u, 7 * u]);
    c.beginPath(); c.moveTo(bx, by);
    c.quadraticCurveTo(lerp(bx, ax, 0.5), Math.min(by, ay) - 30 * u, ax, ay); c.stroke();
    c.restore();
    var pulse = RM ? 0 : Math.sin(G.t * 6) * 1.5 * u, R = 13 * u + pulse;
    var over = a.y > GHM || Math.abs(a.x) > HW;
    c.strokeStyle = over ? AMBER : GOLD; c.lineWidth = 3 * u;
    circ(c, ax, ay, R); c.stroke();
    c.beginPath();
    c.moveTo(ax - R - 5 * u, ay); c.lineTo(ax - R + 5 * u, ay); c.moveTo(ax + R - 5 * u, ay); c.lineTo(ax + R + 5 * u, ay);
    c.moveTo(ax, ay - R - 5 * u); c.lineTo(ax, ay - R + 5 * u); c.moveTo(ax, ay + R - 5 * u); c.lineTo(ax, ay + R + 5 * u);
    c.stroke();
    c.fillStyle = over ? AMBER : GOLD; circ(c, ax, ay, 3 * u); c.fill();
  }
  if (G.drag && G.drag.live) {
    var pw = clamp(G.ring / 1.2, 0, 1), rb = BALL * L.ppm * SB + 7 * u;
    c.lineWidth = 5 * u; c.strokeStyle = 'rgba(0,0,0,.35)';
    circ(c, bx, by, rb); c.stroke();
    c.strokeStyle = G.ring > 0.95 ? AMBER : G.ring > 0.55 ? GREEN : '#c9f2d4';
    c.beginPath(); c.arc(bx, by, rb, -Math.PI / 2, -Math.PI / 2 + TAU * pw); c.stroke();
  }
  if (G.meter.on) {
    var mh = 128 * u, mw = 18 * u, mx = Math.min(L.W - mw - 14 * u, bx + 64 * u), my = L.by - mh + 6 * u;
    c.fillStyle = 'rgba(6,20,12,.75)'; rr(c, mx - 6 * u, my - 26 * u, mw + 12 * u, mh + 34 * u, 10 * u); c.fill();
    var band = function (v0, v1, col) { var y0 = my + mh - v1 / 1.2 * mh, y1 = my + mh - v0 / 1.2 * mh; c.fillStyle = col; c.fillRect(mx, y0, mw, y1 - y0); };
    if (G.meter.fast) { band(0, 0.9, '#bfe8cd'); band(0.9, 1.04, GOLD); band(1.04, 1.2, AMBER); }
    else { band(0, 0.55, '#bfe8cd'); band(0.55, 0.95, GREEN); band(0.95, 1.2, AMBER); }
    c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 1.5 * u; c.strokeRect(mx, my, mw, mh);
    t = my + mh - G.meter.v / 1.2 * mh;
    c.fillStyle = '#ffffff';
    c.beginPath(); c.moveTo(mx - 7 * u, t - 6 * u); c.lineTo(mx + 1 * u, t); c.lineTo(mx - 7 * u, t + 6 * u); c.closePath(); c.fill();
    c.fillRect(mx - 2 * u, t - 1.5 * u, mw + 4 * u, 3 * u);
    c.fillStyle = '#ffffff'; c.font = '700 ' + Math.round(11 * u) + 'px ' + DISP; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(G.meter.fast ? 'TOP BINS' : 'POWER', mx + mw / 2, my - 13 * u);
  }
}
function drawSaveHelp(c) {
  var u = L.u;
  if (G.phase === 'runup' && !G.ready && !G.choice) {
    var x0 = gX(-HW), w = 2 * HW * L.ppm, y0 = gY(GHM), h = GHM * L.ppm;
    c.save(); c.setLineDash([6 * u, 5 * u]); c.lineWidth = 2 * u; c.strokeStyle = 'rgba(255,255,255,.6)';
    rr(c, x0 + 4 * u, y0 + 4 * u, w - 8 * u, h - 8 * u, 10 * u); c.stroke(); c.restore();
  }
  if (G.choice) {
    var x = gX(G.choice.x), y = gY(G.choice.y);
    c.strokeStyle = GOLD; c.lineWidth = 3 * u; circ(c, x, y, 12 * u); c.stroke();
    c.fillStyle = 'rgba(255,199,44,.3)'; c.fill();
  }
}
function drawTrophyScene(c) {
  var u = L.u, t = G.trophy.t, W = L.W, H = L.H;
  var g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, 'rgba(4,10,20,.55)'); g.addColorStop(1, 'rgba(4,10,20,.2)');
  c.fillStyle = g; c.fillRect(-10, -10, W + 20, H + 20);
  var lift = ease(clamp(t / 1.2, 0, 1)), cx = W / 2, by = H * 0.86, s = 1.15 * u;
  var g2 = c.createRadialGradient(cx, by - 150 * u, 10 * u, cx, by - 150 * u, 200 * u);
  g2.addColorStop(0, 'rgba(255,230,140,.35)'); g2.addColorStop(1, 'rgba(255,230,140,0)');
  c.fillStyle = g2; c.fillRect(cx - 200 * u, by - 350 * u, 400 * u, 400 * u);
  drawStriker(c, cx, by, s, KITS[store.eq.kit] || KITS.home, { name: 'JT', num: '7', pose: 'bonnie', pt: RM ? 0 : t * 0.3 });
  var ty = by - 215 * s - lift * 30 * u;
  G.trophy.x = cx; G.trophy.y = ty;
  drawTrophy(c, cx, ty, 1.1 * u, true);
  if (G.trophy.dog) {
    var dt = G.trophy.dog;
    drawBonnie(c, cx - 6 * u, ty - 44 * u - Math.abs(Math.sin(dt * 5)) * (RM ? 0 : 10) * u, 1.1 * u, 1, G.t, 0);
  }
  c.fillStyle = '#ffffff'; c.font = '700 ' + Math.round(30 * u) + 'px ' + DISP; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.strokeStyle = RED; c.lineWidth = 6 * u; c.lineJoin = 'round';
  c.strokeText('CHAMPIONS!', cx, 64 * u); c.fillText('CHAMPIONS!', cx, 64 * u);
  G.trophy.t += 0;   /* time moves in update */
}

/* ---------- small pictures for buttons and the locker ---------- */
function mini(px, fn) {
  var d = Math.min(window.devicePixelRatio || 1, 2), cv = document.createElement('canvas');
  cv.width = Math.round(px * d); cv.height = Math.round(px * d);
  cv.style.width = px + 'px'; cv.style.height = px + 'px';
  var x = cv.getContext('2d'); x.scale(d, d);
  try { fn(x, px); } catch (e) {}
  return cv;
}
function silhouette(cv) {
  var x = cv.getContext('2d');
  x.setTransform(1, 0, 0, 1, 0, 0);
  x.globalCompositeOperation = 'source-atop'; x.fillStyle = '#2c4236'; x.fillRect(0, 0, cv.width, cv.height);
  x.globalCompositeOperation = 'source-over';
  return cv;
}
function ballCanvas(px) { return mini(px, function (c, p) { drawBall(c, p / 2, p / 2, p / 2 - 1.5, 0.3); }); }
function keeperFace(c, p, id) {
  var k = KEEPERS[id]; if (!k) return;
  c.translate(p / 2, p * 0.98); c.scale(p * 0.95, p * 0.95);
  c.fillStyle = k.gk.shirt; rr(c, -0.34, -0.3, 0.68, 0.4, 0.12); c.fill();
  c.fillStyle = k.gk.trim; c.fillRect(-0.08, -0.3, 0.16, 0.04);
  c.translate(0, 0.25);
  drawHead(c, k, { sick: false, lean: 0 }, false);
}
function preview(u, c, p) {
  var k = u.key;
  if (u.cat === 'kit') { drawStriker(c, p / 2, p * 0.98, p / 200, KITS[k], { name: 'JT', num: '7' }); }
  else if (u.cat === 'ball') { drawBall(c, p / 2, p / 2, p * 0.38, 0.5, k); }
  else if (u.cat === 'boots') {
    c.translate(p / 2, p / 2); c.rotate(-0.2);
    c.fillStyle = k === 'comet' ? '#ff7a1a' : '#16181d'; rr(c, -p * 0.3, -p * 0.08, p * 0.55, p * 0.2, p * 0.08); c.fill();
    c.fillRect(-p * 0.3, -p * 0.22, p * 0.2, p * 0.2);
    c.fillStyle = '#ffffff'; for (var i = 0; i < 4; i++) c.fillRect(-p * 0.22 + i * p * 0.1, p * 0.12, p * 0.04, p * 0.05);
    if (k === 'comet') { c.fillStyle = 'rgba(255,200,60,.9)'; c.beginPath(); c.moveTo(-p * 0.3, 0); c.lineTo(-p * 0.48, -p * 0.06); c.lineTo(-p * 0.42, p * 0.04); c.lineTo(-p * 0.5, p * 0.1); c.lineTo(-p * 0.3, p * 0.1); c.closePath(); c.fill(); }
  }
  else if (u.cat === 'celeb') {
    var pose = k === 'knee' ? 'knee' : k;
    if (k === 'worm') { drawStriker(c, p * 0.22, p * 0.62, p / 230, KITS.home, { name: '', num: '7', pose: 'worm', pt: 0.3 }); }
    else drawStriker(c, p / 2, p * 0.98, p / 210, KITS.home, { name: '', num: '7', pose: pose, pt: 0.1 });
    if (k === 'bonnie') drawBonnie(c, p * 0.8, p * 0.85, p / 60, -1, 0, 0);
  }
  else if (u.cat === 'stad') {
    var P = LOOKS[k] || LOOKS.lights;
    var g = c.createLinearGradient(0, 0, 0, p * 0.6); g.addColorStop(0, P.sky[0]); g.addColorStop(1, P.sky[1]);
    c.fillStyle = g; rr(c, 0, 0, p, p, p * 0.14); c.fill();
    c.save(); rr(c, 0, 0, p, p, p * 0.14); c.clip();
    c.fillStyle = P.pitch[1]; c.fillRect(0, p * 0.62, p, p * 0.38);
    c.fillStyle = P.pitch[0]; c.fillRect(0, p * 0.76, p, p * 0.1);
    if (k === 'moon') { c.fillStyle = '#2b6ad8'; circ(c, p * 0.75, p * 0.25, p * 0.12); c.fill(); }
    if (k === 'lights') { c.fillStyle = '#fffbe0'; circ(c, p * 0.15, p * 0.18, p * 0.06); c.fill(); circ(c, p * 0.85, p * 0.18, p * 0.06); c.fill(); }
    if (k === 'park') { c.fillStyle = '#4fa04a'; circ(c, p * 0.2, p * 0.5, p * 0.12); c.fill(); c.fillStyle = '#fff6c4'; circ(c, p * 0.8, p * 0.2, p * 0.08); c.fill(); }
    if (k === 'roof') { c.fillStyle = '#1b2148'; c.fillRect(p * 0.05, p * 0.3, p * 0.15, p * 0.32); c.fillRect(p * 0.7, p * 0.2, p * 0.2, p * 0.42); c.fillStyle = 'rgba(255,220,120,.8)'; c.fillRect(p * 0.75, p * 0.3, p * 0.04, p * 0.04); }
    if (k === 'era') { c.fillStyle = '#ffffff'; c.font = '700 ' + Math.round(p * 0.28) + 'px ' + DISP; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(ERA.n), p / 2, p * 0.35); }
    c.strokeStyle = '#ffffff'; c.lineWidth = Math.max(1, p * 0.03); c.strokeRect(p * 0.3, p * 0.42, p * 0.4, p * 0.2);
    c.restore();
  }
  else if (u.cat === 'trick') { trickIcon(c, p, k); }
  else if (u.cat === 'mode') { gloveIcon(c, p); }
}
function trickIcon(c, p, k) {
  c.lineCap = 'round'; c.lineJoin = 'round';
  c.strokeStyle = '#ffffff'; c.lineWidth = Math.max(1.5, p * 0.06);
  c.strokeRect(p * 0.12, p * 0.18, p * 0.76, p * 0.44);
  c.strokeStyle = GOLD; c.setLineDash([p * 0.05, p * 0.06]);
  c.beginPath();
  if (k === 'panenka') { c.moveTo(p * 0.5, p * 0.9); c.quadraticCurveTo(p * 0.5, p * 0.0, p * 0.5, p * 0.45); }
  else if (k === 'topbins') { c.moveTo(p * 0.5, p * 0.9); c.lineTo(p * 0.8, p * 0.26); }
  else { c.moveTo(p * 0.5, p * 0.9); c.quadraticCurveTo(p * 0.05, p * 0.5, p * 0.78, p * 0.4); }
  c.stroke(); c.setLineDash([]);
  drawBall(c, p * 0.5, p * 0.86, p * 0.1, 0.2);
  if (k === 'topbins') { c.fillStyle = GOLD; circ(c, p * 0.8, p * 0.26, p * 0.06); c.fill(); }
}
function gloveIcon(c, p) {
  c.fillStyle = GREEN; c.strokeStyle = INK; c.lineWidth = Math.max(1, p * 0.04);
  rr(c, p * 0.28, p * 0.35, p * 0.44, p * 0.45, p * 0.12); c.fill(); c.stroke();
  for (var i = 0; i < 4; i++) { rr(c, p * (0.29 + i * 0.105), p * 0.12, p * 0.095, p * 0.32, p * 0.05); c.fill(); c.stroke(); }
  rr(c, p * 0.12, p * 0.4, p * 0.2, p * 0.12, p * 0.05); c.fill(); c.stroke();
  c.fillStyle = '#ffffff'; c.fillRect(p * 0.28, p * 0.68, p * 0.44, p * 0.06);
}
function secretPic(id, c, p) {
  if (id === 'dog' || id === 'cupdog') { if (id === 'cupdog') drawTrophy(c, p * 0.5, p * 0.62, p / 130, false); drawBonnie(c, p * 0.5, id === 'cupdog' ? p * 0.35 : p * 0.6, p / 48, 1, 0, 0); }
  else if (id === 'crowd') { drawJayFace(c, p / 2, p * 0.55, p / 34); }
  else if (id === 'bird') { c.fillStyle = '#ffffff'; c.fillRect(p * 0.05, p * 0.62, p * 0.9, p * 0.08); drawBird(c, p * 0.5, p * 0.62, p / 22, null); }
  else if (id === 'sub') { drawJay(c, p * 0.5, p * 0.95, p / 100, 0, true); }
}

/* ---------- input ---------- */
function flickPower(v) { return 0.3 + 0.9 * (1 - Math.exp(-v / 2.2)); }
function dragAim(dx, dy) { var k = 2.2; return toGoal(L.cx + dx * k, (L.by - BALL * L.ppm * SB) + dy * k); }
function tapAt(px, py) {
  if (G && G.phase === 'trophy') { tapTrophy(px, py); return; }
  if (!G || state !== 'play') return;
  if (tapCameo(px, py)) return;
  if (G.phase === 'result') { skipAhead(); return; }
  if (G.kind === 'save') {
    if (G.phase === 'runup' && !G.ready && !G.choice) { G.ready = true; sfx('tick'); syncHint(); return; }
    var g = toGoal(px, py - goalBob());
    diveTo(g.x, g.y);
    return;
  }
  if (G.phase !== 'aim') return;
  if (G.trick && trickTap(px, py)) return;
  if (G.meter.on) { strike(G.aim.x, G.aim.y, G.meter.v); return; }
  var g2 = toGoal(px, py);
  G.aim = { x: clamp(g2.x, -7, 7), y: clamp(g2.y, BALL, 5) };
  G.meter.on = true; G.meter.v = 0; G.meter.d = 1;
  sfx('aim');
  syncHint();
}
function tapTrophy(px, py) {
  var tr = G.trophy;
  if (!tr || tr.t < 1) return;
  if (Math.hypot(px - tr.x, py - tr.y) < 60 * L.u) {
    tr.taps = (tr.taps || 0) + 1;
    sfx('clang');
    if (tr.taps >= 3 && !tr.dog) { tr.dog = 0.01; sfx('yip'); bubbleFrom('jay', 'Woof!'); findSecret('cupdog'); }
  }
}
function keyAim(dx, dy) {
  if (!G || G.kind !== 'shoot' || G.phase !== 'aim' || G.trick) return;
  if (!G.aim) G.aim = { x: 0, y: 1.1 };
  G.aim.x = clamp(G.aim.x + dx * 0.4, -5.5, 5.5);
  G.aim.y = clamp(G.aim.y + dy * 0.3, BALL, 3.6);
  syncHint();
}
function keyGo() {
  if (!G || G.kind !== 'shoot' || G.phase !== 'aim') return;
  if (G.trick === 'panenka') { trickTap(L.cx, L.gB); return; }
  if (G.trick === 'topbins') { trickTap(G.trk.side ? 0 : (G.aim && G.aim.x < 0 ? 0 : L.W), 0); return; }
  if (G.trick === 'rabona') { trickTap(L.W, 0); return; }
  if (!G.aim) G.aim = { x: 0, y: 1.1 };
  if (!G.meter.on) { G.meter.on = true; G.meter.v = 0; G.meter.d = 1; sfx('aim'); syncHint(); return; }
  strike(G.aim.x, G.aim.y, G.meter.v);
}

function pointerXY(e) { var r = ui.canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
function bindPointer(cv) {
  var down = null;
  cv.addEventListener('pointerdown', function (e) {
    e.preventDefault(); unlockAudio();
    if (state !== 'play' && !(G && G.phase === 'trophy')) return;
    var p = pointerXY(e);
    down = { x: p.x, y: p.y, samples: [[p.x, p.y, e.timeStamp || performance.now()]], moved: 0 };
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
  });
  cv.addEventListener('pointermove', function (e) {
    if (!down || !G) return;
    var p = pointerXY(e), now = e.timeStamp || performance.now();
    down.samples.push([p.x, p.y, now]);
    if (down.samples.length > 40) down.samples.shift();
    var dx = p.x - down.x, dy = p.y - down.y;
    down.moved = Math.max(down.moved, Math.hypot(dx, dy));
    if (G.kind === 'shoot' && G.phase === 'aim' && !G.trick && down.moved > 12 && dy < -8) {
      if (!G.drag) { G.drag = { live: true }; syncHint(); }
      G.drag.aim = dragAim(dx, dy);
      G.ring = lerp(G.ring, flickPower(speedOf(down.samples, now)), 0.35);
    }
  });
  function end(e, cancel) {
    if (!down) return;
    var d = down; down = null;
    if (!G || (state !== 'play' && G.phase !== 'trophy')) return;
    var p = pointerXY(e), now = e.timeStamp || performance.now();
    d.samples.push([p.x, p.y, now]);
    var dx = p.x - d.x, dy = p.y - d.y;
    var wasDrag = G.drag && G.drag.live;
    G.drag = null;
    if (cancel) { G.ring = 0; syncHint(); return; }
    if (G.trick === 'rabona' && G.kind === 'shoot' && G.phase === 'aim' && Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
      strike(sgn(dx) * rnd(2.5, 3.1), rnd(0.4, 1.4), 0.85, 'rabona'); return;
    }
    if (wasDrag && dy < -24) {
      var aim = dragAim(dx, dy), v = speedOf(d.samples, now);
      G.ring = 0;
      if (v >= 0.4) { strike(aim.x, aim.y, flickPower(v)); return; }
      G.aim = { x: clamp(aim.x, -7, 7), y: clamp(aim.y, BALL, 5) };
      G.meter.on = true; G.meter.v = 0; G.meter.d = 1;
      sfx('aim'); syncHint();
      return;
    }
    G.ring = 0;
    if (Math.hypot(dx, dy) < 16) tapAt(p.x, p.y);
    else syncHint();
  }
  cv.addEventListener('pointerup', function (e) { end(e, false); });
  cv.addEventListener('pointercancel', function (e) { end(e, true); });
  cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });
}
function speedOf(samples, now) {
  var last = samples[samples.length - 1], first = last;
  for (var i = samples.length - 1; i >= 0; i--) { first = samples[i]; if (now - samples[i][2] > 100) break; }
  var dt = Math.max(16, last[2] - first[2]);
  return Math.hypot(last[0] - first[0], last[1] - first[1]) / dt / L.u;
}

/* ---------- overlay and UI ---------- */
function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

function build() {
  var o = el('div', 'jtpen');
  o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', GAME + ', a football game');
  var bar = el('div', 'jtp-bar');
  var title = el('div', 'jtp-title'); title.appendChild(ballCanvas(30)); title.appendChild(el('span', '', GAME));
  var hub = el('button', 'jtp-tb jtp-hubb', 'Menu'); hub.type = 'button';
  var kb = el('button', 'jtp-tb jtp-keep'); kb.type = 'button'; kb.title = 'Every fifth kick you go in goal';
  var snd = el('button', 'jtp-tb jtp-snd'); snd.type = 'button';
  var x = el('button', 'jtp-x', 'Close &#10005;'); x.type = 'button'; x.setAttribute('aria-label', 'Close the game');
  bar.appendChild(title); bar.appendChild(hub); bar.appendChild(kb); bar.appendChild(snd); bar.appendChild(x);
  var stage = el('div', 'jtp-stage');
  var cv = document.createElement('canvas'); cv.className = 'jtp-cv';
  cv.setAttribute('role', 'img');
  cv.setAttribute('aria-label', 'Penalty game. Flick up from the ball to shoot, or tap a spot in the goal and tap again for power. Arrow keys and Space work too.');
  var hud = el('div', 'jtp-hud');
  var hint = el('div', 'jtp-hint gone');
  var tst = el('div', 'jtp-toast'); tst.setAttribute('aria-live', 'polite');
  var ban = el('div', 'jtp-banner'); ban.setAttribute('aria-live', 'polite');
  var rib = el('div', 'jtp-ribbon'); rib.setAttribute('aria-live', 'polite');
  var trk = el('div', 'jtp-tricks'); trk.hidden = true;
  var card = el('div', 'jtp-card'); card.hidden = true;
  var panel = el('div', 'jtp-panel'); panel.hidden = true;
  [cv, hud, hint, tst, rib, ban, trk, card, panel].forEach(function (n) { stage.appendChild(n); });
  o.appendChild(bar); o.appendChild(stage);

  ui = { o: o, bar: bar, hubb: hub, keep: kb, snd: snd, x: x, stage: stage, canvas: cv, hud: hud, hint: hint, toast: tst, banner: ban, ribbon: rib, tricks: trk, card: card, panel: panel, dpr: 1 };
  ctx = cv.getContext('2d');

  x.addEventListener('click', close);
  hub.addEventListener('click', function () { if (state === 'play' && G && G.phase !== 'result' && G.phase !== 'flight') toHub(); else if (state !== 'play') toHub(); });
  snd.addEventListener('click', function () { unlockAudio(); store.sound = !store.sound; saveStore(); syncButtons(); if (store.sound) sfx('aim'); });
  kb.addEventListener('click', function () { keeperOn = !keeperOn; syncButtons(); });
  card.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('button') : null;
    if (!b) return;
    unlockAudio();
    act(b.getAttribute('data-act'));
  });
  panel.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('button') : null;
    if (!b) return;
    var a = b.getAttribute('data-act');
    if (a === 'back') { hidePanel(); return; }
    var eq = b.getAttribute('data-eq'), info = b.getAttribute('data-info');
    if (eq) {
      var bits = eq.split(':');
      if (has(bits[0] + '_' + bits[1]) || (bits[0] === 'stad' && bits[1] === 'era')) {
        store.eq[bits[0]] = bits[1]; saveStore(); sfx('tick');
        if (bits[0] === 'stad') { bgKey = ''; G.altStad = look() !== ERA.id; }
        showLocker(b.getAttribute('data-id'));
      } else showHow(b.getAttribute('data-how'));
    } else if (info) showHow(info);
  });
  trk.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('button') : null;
    if (b) { unlockAudio(); setTrick(b.getAttribute('data-trick')); focusStage(); }
  });
  bindPointer(cv);
  o.addEventListener('pointerdown', unlockAudio);
  o.addEventListener('touchmove', function (e) { if (!(e.target.closest && e.target.closest('.jtp-panel,.jtp-card'))) e.preventDefault(); }, { passive: false });
  return o;
}
function showHow(t) { var h = ui.panel.querySelector('.jtp-how'); if (h) h.textContent = t || ''; }

function act(a) {
  if (a === 'quick') startMode('quick');
  else if (a === 'cup') showTieIntro();
  else if (a === 'kickoff') startMode('cup');
  else if (a === 'wall') { if (has('mode_wall')) startMode('wall'); }
  else if (a === 'again') startMode(G ? G.mode : 'quick');
  else if (a === 'hub') toHub();
  else if (a === 'locker') showLocker();
  else if (a === 'secrets') showSecrets();
  else if (a === 'close') close();
  else if (a === 'seen') toHub();
}

function syncButtons() {
  if (!ui.snd) return;
  ui.snd.textContent = store.sound ? 'Sound on' : 'Sound off';
  ui.snd.setAttribute('aria-pressed', store.sound ? 'true' : 'false');
  ui.keep.textContent = keeperOn ? 'Keeper on' : 'Keeper off';
  ui.keep.setAttribute('aria-pressed', keeperOn ? 'true' : 'false');
  ui.keep.setAttribute('aria-label', 'Keeper turns ' + (keeperOn ? 'on' : 'off') + '. Every fifth kick you go in goal.');
  ui.keep.hidden = !(state === 'play' && G && G.mode === 'quick');
  ui.hubb.hidden = state === 'hub';
}
function syncTricks() {
  if (!ui.tricks) return;
  var show = state === 'play' && G && G.kind === 'shoot' && G.phase === 'aim' && !G.meter.on;
  var list = ['panenka', 'topbins', 'rabona'].filter(function (k) { return has('trick_' + k); });
  if (G && G.trick === 'topbins' && G.trk && G.trk.side) show = false;
  if (!show || !list.length) { ui.tricks.hidden = true; return; }
  if (ui.tricks.getAttribute('data-n') !== list.join(',')) {
    ui.tricks.innerHTML = '';
    list.forEach(function (k) {
      var b = el('button', 'jtp-trk'); b.type = 'button'; b.setAttribute('data-trick', k);
      b.setAttribute('aria-label', TRICKS[k].name + ' trick shot');
      b.appendChild(mini(28, function (c, p) { trickIcon(c, p, k); }));
      b.appendChild(el('span', '', TRICKS[k].name.split(' ')[0]));
      ui.tricks.appendChild(b);
    });
    ui.tricks.setAttribute('data-n', list.join(','));
  }
  Array.prototype.forEach.call(ui.tricks.children, function (b) {
    var on = G.trick === b.getAttribute('data-trick');
    b.className = 'jtp-trk' + (on ? ' on' : ''); b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  ui.tricks.hidden = false;
}

function syncHint() {
  if (!ui.hint || !G) return;
  var h = '', fresh = store.games < 3;
  if (state === 'play') {
    if (G.kind === 'save') {
      if (G.phase === 'runup' && !G.ready && !G.choice) h = (G.mode === 'wall' ? 'Wall of Gloves. ' : '') + 'Tap when you are ready.' + (fresh || G.mode === 'wall' ? '<br>Watch the striker, then tap where the ball is going.' : '');
      else if ((G.phase === 'runup' || G.phase === 'windup') && !G.choice && fresh) h = 'Tap where the ball is going. It goes slow mo.';
    } else if (G.phase === 'aim') {
      if (G.trick) h = TRICKS[G.trick].how;
      else if (G.drag && G.drag.live) h = (G.shots < 2 && fresh) ? 'Let go to shoot. A quicker flick hits harder.' : '';
      else if (G.meter.on) h = 'Tap again' + (FINE ? ' (or Space)' : '') + ' to strike. Green is the sweet spot.';
      else if (G.aim) h = FINE ? 'Space to set the power.' : '';
      else if (G.shots < 2 && fresh) h = 'Flick up from the ball to shoot.<br>Or tap the goal, then tap again for power.' + (FINE ? '<br>Keys: arrows to aim, then Space.' : '');
      else if (G.mode === 'cup' && G.shots === 0) h = G.keeper.tell;
    }
  }
  if (h) { ui.hint.innerHTML = h; ui.hint.className = 'jtp-hint'; }
  else ui.hint.className = 'jtp-hint gone';
  syncTricks();
}

function layout() {
  if (!ui.o) return;
  var vw = window.innerWidth, vh = window.innerHeight;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var barH = Math.round(ui.bar.getBoundingClientRect().bottom) || 66;
  ui.barB = barH;
  var H = Math.floor(Math.max(260, vh - barH - 10));
  var W = Math.floor(Math.min(vw - 16, 880, H * 1.45));
  ui.dpr = dpr;
  ui.canvas.width = Math.round(W * dpr); ui.canvas.height = Math.round(H * dpr);
  ui.canvas.style.width = W + 'px'; ui.canvas.style.height = H + 'px';
  computeLayout(W, H);
  var keep = ui.banner.innerHTML;
  ui.banner.innerHTML = 'GOAL!<small>Get in!</small>';
  var bh = ui.banner.offsetHeight || 140;
  ui.banner.innerHTML = keep;
  var room = gY(GHM) - 64;
  ui.banner.style.top = Math.round(room >= bh + 8 ? gY(GHM) - bh - 8 : L.gB + 14 * L.u) + 'px';
  ui.hint.style.top = Math.round(L.gB + (L.by - L.gB) * 0.2) + 'px';
  bgKey = '';
  if (G) { buildBackground(); render(); }
}

function pips(list, n) {
  var h = '';
  for (var i = 0; i < Math.max(n, list.length); i++) h += '<i class="jtp-pip' + (list[i] === 'g' ? ' g' : list[i] === 'm' ? ' m' : '') + '"></i>';
  return h;
}
function updateHud() {
  if (!ui.hud) return;
  if (!G || state !== 'play' || G.phase === 'trophy') { ui.hud.hidden = true; return; }
  ui.hud.hidden = false;
  var h = '';
  if (G.mode === 'cup') {
    var c = G.cup, k = KEEPERS[c.rival], n = c.sd ? Math.max(c.us.length, c.them.length) : 5;
    var kit = KITS[store.eq.kit] || KITS.home;
    h = '<div><div class="jtp-sb"><span class="jtp-sw" style="background:' + kit.shirt + '"></span>JT <b>' + count(c.us) + '</b><i>-</i><b>' + count(c.them) + '</b> ' + k.short +
      ' <span class="jtp-sw" style="background:' + k.kit.shirt + '"></span></div>' +
      '<div class="jtp-pips"><span>' + pips(c.us, n) + '</span><span></span><span>' + pips(c.them, n) + '</span></div></div>' +
      '<div class="jtp-rnd jtp-best">' + (c.sd ? 'Sudden death' : ROUNDS[c.round]) + '<small>vs ' + k.name + '</small></div>';
  } else if (G.mode === 'wall') {
    h = '<div class="jtp-score"><b>' + G.wall.saves + '</b><span>Saves</span></div>' +
      '<div class="jtp-best">Kick <b>' + Math.min(G.wall.of, G.wall.n + 1) + '</b> of ' + G.wall.of + '</div>';
  } else {
    var hot = G.streak > G.startBest && G.startBest > 0;
    h = '<div class="jtp-score"><b>' + G.streak + '</b><span>Streak</span></div>' +
      '<div class="jtp-best' + (hot ? ' hot' : '') + '">Best <b>' + Math.max(store.best, G.streak) + '</b></div>';
  }
  ui.hud.innerHTML = h;
}
var toastT = 0, banT = 0;
function toast(t, trophy) {
  if (!ui.toast) return;
  ui.toast.innerHTML = (trophy ? TROPHY : '') + '<span>' + t + '</span>';
  ui.toast.className = 'jtp-toast on';
  clearTimeout(toastT); toastT = setTimeout(function () { if (ui.toast) ui.toast.className = 'jtp-toast'; }, 1800);
}
function showBanner(text, kind, sub) {
  if (!ui.banner) return;
  ui.banner.innerHTML = text + (sub ? '<small>' + sub + '</small>' : '');
  ui.banner.className = 'jtp-banner';
  void ui.banner.offsetWidth;
  ui.banner.className = 'jtp-banner on' + (kind === 'save' ? ' k-save' : '');
  clearTimeout(banT); banT = setTimeout(function () { if (ui.banner) ui.banner.className = 'jtp-banner'; }, 1700);
}

/* ---------- cards ---------- */
function showCard(html, cls, pic) {
  ui.card.style.cssText = '';
  ui.card.className = 'jtp-card' + (cls ? ' ' + cls : '');
  ui.card.innerHTML = html;
  if (pic) ui.card.insertBefore(pic, ui.card.firstChild);
  ui.card.hidden = false;
  ui.hint.className = 'jtp-hint gone';
  ui.tricks.hidden = true;
  var f = ui.card.querySelector('button');
  if (f) { try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }
  overAt = Date.now();
}
function hideCard() { ui.card.hidden = true; ui.card.innerHTML = ''; ui.card.className = 'jtp-card'; }

function hubScene() {
  G = newState('quick');
  setKeeper(EX.keeper);
  G.phase = 'idle';
}
function toHub() {
  if (!ui.o) return;
  if (roundLive) endRound();
  state = 'hub';
  hidePanel(true);
  hubScene();
  bgKey = '';
  syncButtons(); updateHud();
  ui.hint.className = 'jtp-hint gone';
  showHub();
}
function modeBtn(actId, cls, pic, title, sub) {
  return '<button type="button" class="jtp-mode' + (cls ? ' ' + cls : '') + '" data-act="' + actId + '" data-pic="' + pic + '"><span><b>' + title + '</b><small>' + sub + '</small></span></button>';
}
function showHub() {
  refreshUnlocks();
  var draw = cupDraw(), r = Math.min(4, store.cupRound), rival = KEEPERS[draw[r]];
  var nf = 0; for (var s in store.secrets) if (store.secrets[s]) nf++;
  var nx = UL.next;
  var html = '<div class="jtp-era">Week ' + ERA.n + ': ' + ERA.name + '</div>' +
    '<p style="margin:0;font-weight:700">' + ERA.line + '</p>' +
    '<p class="jtp-rule">' + EX.rule + '</p>' +
    modeBtn('quick', 'main', 'ball', 'Quick shootout', store.best ? 'Best streak: ' + store.best : 'Score, score, score.') +
    modeBtn('cup', '', 'cup', 'Cup run', ROUNDS[r] + ' vs ' + rival.name + (store.cups ? '. Cups: ' + store.cups : '')) +
    (has('mode_wall') ? modeBtn('wall', '', 'glove', 'Wall of Gloves', store.gloves ? 'You in goal. Best: ' + store.gloves + ' saves' : 'You in goal for ten kicks.') : '') +
    '<div class="jtp-row"><button type="button" data-act="locker">Locker' + (newCount() ? '<span class="jtp-dot"></span>' : '') + '</button>' +
    '<button type="button" data-act="secrets">Secrets ' + nf + '/' + SECRETS.length + '</button></div>' +
    (nx ? '<p class="jtp-next">Next unlock: ' + nx.name + ', ' + UL.need + ' more sparks.</p>' : '<p class="jtp-next">Everything is unlocked. Legend.</p>');
  showCard(html, 'wide');
  Array.prototype.forEach.call(ui.card.querySelectorAll('.jtp-mode'), function (b) {
    var pic = b.getAttribute('data-pic');
    b.insertBefore(mini(44, function (c, p) {
      if (pic === 'ball') drawBall(c, p / 2, p / 2, p * 0.42, 0.4, ballKind());
      else if (pic === 'cup') drawTrophy(c, p / 2, p * 0.58, p / 110, true);
      else gloveIcon(c, p);
    }), b.firstChild);
  });
  syncButtons();
}
function newCount() { var n = 0; UL.have.forEach(function (u) { if (u.at && store.seen.indexOf(u.id) < 0) n++; }); return n; }

/* new unlocks: celebrated once, the next time the game opens */
function unlockCard() {
  refreshUnlocks();
  var fresh = UL.have.filter(function (u) { return u.at && store.seen.indexOf(u.id) < 0; });
  if (!fresh.length) return false;
  UL.have.forEach(function (u) { if (store.seen.indexOf(u.id) < 0) store.seen.push(u.id); });
  saveStore();
  var show = fresh.slice(-4);
  var html = '<div class="jtp-badge jtp-pop">' + TROPHY + 'New in your locker</div>' +
    '<div class="jtp-grid" style="margin:8px 0 12px;grid-template-columns:repeat(' + Math.min(show.length, 2) + ',1fr)"></div>' +
    (fresh.length > show.length ? '<p>And ' + (fresh.length - show.length) + ' more in the locker.</p>' : '') +
    '<button type="button" class="jtp-go" data-act="seen">Nice one</button>';
  showCard(html, 'wide');
  var grid = ui.card.querySelector('.jtp-grid');
  show.forEach(function (u) {
    var t = el('div', 'jtp-tile on');
    t.style.color = INK; t.style.background = '#f1f7f3'; t.style.borderColor = '#cfe5d7';
    t.appendChild(mini(64, function (c, p) { preview(u, c, p); }));
    t.appendChild(el('span', '', '<b>' + u.name + '</b>'));
    grid.appendChild(t);
  });
  sfx('unlock');
  if (!RM) for (var i = 0; i < 60; i++) G.conf.push({ x: rnd(0, L.W), y: rnd(-L.H * 0.2, -6), vx: rnd(-30, 30) * L.u, vy: rnd(30, 110) * L.u,
    rot: rnd(0, TAU), vr: rnd(-8, 8), w: rnd(5, 8) * L.u, h: rnd(3, 4.5) * L.u, c: pick([GOLD, '#ffffff', RED]), life: rnd(2.4, 3.6), ph: rnd(0, TAU) });
  return true;
}

function showTieIntro() {
  var draw = cupDraw(), r = Math.min(4, store.cupRound), id = draw[r], k = KEEPERS[id];
  state = 'hub';
  G = newState('cup'); setKeeper(id); G.phase = 'idle';
  bgKey = '';
  var html = '<h3>' + ROUNDS[r] + '</h3>' +
    '<h2>' + k.team + '</h2>' +
    '<p style="font-weight:700;margin-top:2px">In goal: ' + k.name + '</p>' +
    '<p>' + k.tell + '</p>' +
    '<p class="jtp-tip">Five kicks each, then sudden death. You take one, then you go in goal.</p>' +
    '<div class="jtp-row" style="margin-top:12px"><button type="button" data-act="hub">Back</button>' +
    '<button type="button" class="jtp-go" style="flex:2;min-height:50px;font-size:1.25rem" data-act="kickoff">Kick off</button></div>';
  showCard(html, '', mini(84, function (c, p) { keeperFace(c, p, id); }));
  bubbleFrom('keeper', pick(k.taunts));
}

function startMode(mode) {
  if (!ui.o) return;
  hidePanel(true);
  hideCard();
  state = 'play';
  bgKey = '';
  newGame(mode);
  syncButtons();
  updateHud();
  focusStage();
}
function endRound() {
  roundLive = false;
  releaseModal();
}

var OVER = {
  save: { t: 'Saved!', col: '#5b3aae', m: ['Unlucky. Their keeper guessed right this time.', 'Good strike, better save.', 'The keeper is having a big day.'] },
  wide: { t: 'Just wide', col: '#2b6e9e', m: ['Only a little bit off. So close.', 'Whistled past the post. Next one goes in.', 'The side netting... from the outside.'] },
  over: { t: 'Over the bar', col: '#2b6e9e', m: ['Bit too much on that one. Happens to the best.', 'That one is heading for the car park.', 'Lots of power. Maybe a touch less next time.'] },
  post: { t: 'Off the post!', col: '#9a6b00', m: ['So close. You could hear the clang from the stand.', 'Inches away. Unlucky.'] },
  bar: { t: 'Off the bar!', col: '#9a6b00', m: ['Rattled the crossbar. So close.', 'The bar is still shaking. Unlucky.'] }
};
function nums(a, b) { return '<div class="jtp-nums"><div><span>' + a[0] + '</span><b>' + a[1] + '</b></div><div><span>' + b[0] + '</span><b>' + b[1] + '</b></div></div>'; }
function showOver() {
  state = 'over'; G.phase = 'over';
  store.games++; saveStore();
  var m = OVER[G.outcome] || OVER.save, s = G.streak, nb = G.newBest && s > 0;
  showCard((nb ? '<div class="jtp-badge jtp-pop">' + TROPHY + 'New best!</div>' : '') +
    '<h2 style="color:' + m.col + '">' + m.t + '</h2><p>' + pick(m.m) + '</p>' +
    nums(['Streak', s], ['Best', store.best]) +
    '<button type="button" class="jtp-go" data-act="again">Again</button>' +
    '<button type="button" class="jtp-c2" data-act="hub">Menu</button>' +
    '<p class="jtp-tip">Enter or Space also starts again.</p>', '', ballCanvas(52));
  if (nb) { sfx('best'); confetti(70); }
  endRound();
  updateHud(); syncButtons();
}
function showWallOver() {
  state = 'over'; G.phase = 'over';
  store.games++;
  var s = G.wall.saves, nb = s > store.gloves;
  if (nb) store.gloves = s;
  saveStore();
  var line = s >= 8 ? 'An actual wall. Strikers are scared of you.' : s >= 5 ? 'Big gloves, big saves.' : s >= 2 ? 'Some lovely stops in there.' : 'Strikers had a good day. Fancy another go?';
  showCard((nb && s > 0 ? '<div class="jtp-badge jtp-pop">' + TROPHY + 'New best!</div>' : '') +
    '<h2>Wall of Gloves</h2><p>' + line + '</p>' +
    nums(['Saves', s + ' / ' + G.wall.of], ['Best', store.gloves]) +
    '<button type="button" class="jtp-go" data-act="again">Again</button>' +
    '<button type="button" class="jtp-c2" data-act="hub">Menu</button>', '', mini(52, gloveIcon));
  if (nb) { sfx('best'); confetti(60); }
  endRound();
  updateHud(); syncButtons();
}
function endTie(res) {
  var c = G.cup, k = KEEPERS[c.rival], us = count(c.us), th = count(c.them);
  state = 'over'; G.phase = 'over';
  store.games++;
  var score = us + ' - ' + th;
  if (res === 'win') {
    store.ties++;
    if (c.round >= 4) { saveStore(); trophyTime(score); return; }
    store.cupRound = c.round + 1; saveStore();
    var nk = KEEPERS[cupDraw()[store.cupRound]];
    showCard('<div class="jtp-badge jtp-pop">' + TROPHY + 'Through!</div>' +
      '<h2>' + score + '</h2><p>JT\'s XI knock out ' + k.team + '.</p>' +
      '<p style="font-weight:700">Next: ' + ROUNDS[store.cupRound] + ' vs ' + nk.team + '</p>' +
      '<button type="button" class="jtp-go" data-act="cup" style="margin-top:12px">Next round</button>' +
      '<button type="button" class="jtp-c2" data-act="hub">Menu</button>');
    sfx('best'); confetti(80);
  } else {
    saveStore();
    showCard('<h2 style="color:#9a6b00">' + score + '</h2>' +
      '<p>' + k.team + ' edged it this time. The cup run carries on, though: fancy a replay?</p>' +
      '<p class="jtp-tip">' + k.tell + '</p>' +
      '<button type="button" class="jtp-go" data-act="cup" style="margin-top:12px">Replay</button>' +
      '<button type="button" class="jtp-c2" data-act="hub">Menu</button>', '', mini(64, function (cc, p) { keeperFace(cc, p, c.rival); }));
  }
  endRound();
  updateHud(); syncButtons();
}
function trophyTime(score) {
  state = 'play';
  store.cups++; store.cupRound = 0; delete store.cupDraw; saveStore();
  G.phase = 'trophy'; G.trophy = { t: 0, taps: 0, score: score };
  G.bubbles.length = 0;
  sfx('fanfare'); confetti(140);
  updateHud(); syncButtons();
  ui.hint.className = 'jtp-hint gone'; ui.tricks.hidden = true;
  setTimeout(function () {
    if (!G || G.phase !== 'trophy') return;
    state = 'over';
    showCard('<h2>' + score + '</h2><p>JT\'s XI win the cup! Cups won: ' + store.cups + '.</p>' +
      '<p class="jtp-tip">Have a good look at that trophy.</p>' +
      '<div class="jtp-row"><button type="button" data-act="hub">Menu</button><button type="button" data-act="cup">New cup run</button></div>', 'low');
    ui.card.style.top = 'auto'; ui.card.style.bottom = '10px'; ui.card.style.transform = 'translateX(-50%)';
    endRound();
  }, RM ? 1500 : 3200);
}
function confetti(n) {
  if (!G || !L) return;
  n = RM ? Math.min(14, n) : n;
  for (var i = 0; i < n; i++) G.conf.push({ x: rnd(0, L.W), y: rnd(-L.H * 0.2, -6), vx: rnd(-30, 30) * L.u, vy: rnd(30, 110) * L.u,
    rot: rnd(0, TAU), vr: rnd(-8, 8), w: rnd(5, 8) * L.u, h: rnd(3, 4.5) * L.u, c: pick([GOLD, '#ffffff', RED]), life: rnd(2.4, 3.6), ph: rnd(0, TAU) });
}

/* ---------- locker and secrets ---------- */
var CATS = [['kit', 'Kits'], ['ball', 'Balls'], ['boots', 'Boots'], ['celeb', 'Celebrations'], ['stad', 'Stadiums'], ['trick', 'Trick shots'], ['mode', 'Modes']];
function lockerItems(cat) {
  var list = UNLOCKS.filter(function (u) { return u.cat === cat; });
  if (cat === 'boots') list.unshift({ at: 0, id: 'boots_classic', cat: 'boots', key: 'classic', name: 'Classic boots' });
  if (cat === 'stad') list.unshift({ at: 0, id: 'stad_era', cat: 'stad', key: 'era', name: 'This week: ' + ERA.name });
  return list;
}
function itemHow(u) {
  if (u.cat === 'trick') return TRICKS[u.key].name + ': ' + TRICKS[u.key].how + ' Find it next to the ball.';
  if (u.cat === 'mode') return 'Wall of Gloves: you in goal for ten kicks. It is on the menu.';
  if (u.cat === 'celeb') return u.name + ': plays after every goal.';
  return u.name;
}
function showPanel(html) {
  state = state === 'play' ? 'play' : state;
  ui.panel.innerHTML = html;
  ui.panel.hidden = false;
  ui.card.hidden = true;
  ui.panel.scrollTop = 0;
  var b = ui.panel.querySelector('button'); if (b) { try { b.focus({ preventScroll: true }); } catch (e) { b.focus(); } }
}
function hidePanel(silent) {
  if (!ui.panel || ui.panel.hidden) return;
  ui.panel.hidden = true; ui.panel.innerHTML = '';
  if (!silent) showHub();
}
function showLocker(focusId) {
  refreshUnlocks();
  var nx = UL.next;
  var html = '<div class="jtp-ph"><h2>Locker</h2><button type="button" data-act="back">Done</button></div>' +
    '<div class="jtp-how">' + (nx ? 'Tap something to wear it. Next unlock: ' + nx.name + ', ' + UL.need + ' more sparks.' : 'Tap something to wear it.') + '</div>' +
    '<div class="jtp-sec">Trophy cabinet</div><div class="jtp-grid jtp-cab"></div>';
  CATS.forEach(function (ct) { html += '<div class="jtp-sec">' + ct[1] + '</div><div class="jtp-grid" data-cat="' + ct[0] + '"></div>'; });
  showPanel(html);
  var cab = ui.panel.querySelector('.jtp-cab');
  [['Cups won', store.cups, 'cup'], ['Best streak', store.best, 'ball'], ['Wall best', store.gloves, 'glove'], ['Goals', store.goals, 'net']].concat(
    store.scarabs || ERA.id === 'egypt' ? [['Golden scarabs', store.scarabs, 'scarab']] : []).forEach(function (s) {
    var t = el('div', 'jtp-tile');
    t.appendChild(mini(48, function (c, p) {
      if (s[2] === 'cup') drawTrophy(c, p / 2, p * 0.58, p / 110, true);
      else if (s[2] === 'ball') drawBall(c, p / 2, p / 2, p * 0.4, 0.3);
      else if (s[2] === 'glove') gloveIcon(c, p);
      else if (s[2] === 'scarab') { G.t = G.t || 0; drawScarab(c, p / 2, p / 2, p * 0.22); }
      else { c.strokeStyle = '#ffffff'; c.lineWidth = 2; c.strokeRect(p * 0.1, p * 0.2, p * 0.8, p * 0.5); c.strokeStyle = 'rgba(255,255,255,.4)'; for (var i = 1; i < 6; i++) { c.beginPath(); c.moveTo(p * (0.1 + i * 0.13), p * 0.2); c.lineTo(p * (0.1 + i * 0.13), p * 0.7); c.stroke(); } drawBall(c, p * 0.6, p * 0.5, p * 0.1, 0); }
    }));
    t.appendChild(el('span', '', s[0] + '<br><em style="font-size:1.2rem">' + s[1] + '</em>'));
    cab.appendChild(t);
  });
  CATS.forEach(function (ct) {
    var grid = ui.panel.querySelector('[data-cat="' + ct[0] + '"]');
    lockerItems(ct[0]).forEach(function (u) {
      var got = has(u.id), isNext = nx && nx.id === u.id;
      var on = got && store.eq[u.cat] === u.key;
      var b = el('button', 'jtp-tile' + (on ? ' on' : '') + (got ? '' : ' lock') + (isNext ? ' nx' : ''));
      b.type = 'button'; b.setAttribute('data-id', u.id);
      var cv = mini(64, function (c, p) { preview(u, c, p); });
      if (!got) silhouette(cv);
      b.appendChild(cv);
      var label = got ? u.name : isNext ? '???<br><em>' + UL.need + ' more sparks</em>' : '???';
      b.appendChild(el('span', '', label));
      if (u.cat === 'trick' || u.cat === 'mode') b.setAttribute('data-info', got ? itemHow(u) : isNext ? UL.need + ' more sparks to unlock this one.' : 'Still locked. Sparks open it up.');
      else { b.setAttribute('data-eq', u.cat + ':' + u.key); b.setAttribute('data-how', got ? itemHow(u) : isNext ? UL.need + ' more sparks to unlock this one.' : 'Still locked. Sparks open it up.'); }
      b.setAttribute('aria-label', got ? u.name + (on ? ', wearing it' : '') : 'Locked');
      grid.appendChild(b);
    });
  });
  if (focusId) { var f = ui.panel.querySelector('[data-id="' + focusId + '"]'); if (f) { try { f.focus({ preventScroll: true }); } catch (e) {} } }
  UL.have.forEach(function (u) { if (store.seen.indexOf(u.id) < 0) store.seen.push(u.id); });
  saveStore();
}
function showSecrets() {
  var nf = 0; SECRETS.forEach(function (s) { if (store.secrets[s.id]) nf++; });
  var html = '<div class="jtp-ph"><h2>Secrets</h2><button type="button" data-act="back">Done</button></div>' +
    '<div class="jtp-how">Secrets found: ' + nf + ' of ' + SECRETS.length + '. Never needed. Just for fun.</div>';
  showPanel(html);
  SECRETS.forEach(function (s) {
    var got = !!store.secrets[s.id];
    var row = el('div', 'jtp-srow' + (got ? ' found' : ''));
    var cv = mini(56, function (c, p) { secretPic(s.id, c, p); });
    if (!got) silhouette(cv);
    row.appendChild(cv);
    row.appendChild(el('div', '', '<b>' + (got ? s.name : '???') + '</b><span>' + (got ? s.how : s.hint) + '</span>'));
    ui.panel.appendChild(row);
  });
}

/* ---------- the break: let the round finish first ----------
   /data/hqbreak.js shows its "That is the break" card the moment the
   clock runs out. While a round is live it waits behind the game,
   and comes back the moment the round ends. */
var mo = null;
function watchModal() {
  if (mo || !window.MutationObserver) return;
  mo = new MutationObserver(function (list) {
    for (var i = 0; i < list.length; i++) for (var j = 0; j < list[i].addedNodes.length; j++) {
      var n = list[i].addedNodes[j];
      if (n.nodeType === 1 && n.classList && n.classList.contains('hqw-back') && roundLive && state !== 'closed') {
        heldModal = n; n.style.display = 'none';
      }
    }
  });
  mo.observe(document.body, { childList: true });
}
function releaseModal() {
  if (heldModal) {
    var n = heldModal; heldModal = null;
    if (n.parentNode) { n.style.display = ''; var b = n.querySelector('button'); if (b) try { b.focus(); } catch (e) {} }
  }
}
function modalUp() { var m = document.querySelector('.hqw-back'); return !!(m && m.style.display !== 'none'); }

function focusStage() { try { ui.canvas.setAttribute('tabindex', '-1'); ui.canvas.focus({ preventScroll: true }); } catch (e) {} }

function onKey(e) {
  if (state === 'closed') return;
  if (modalUp()) return;
  var k = e.key, tgt = e.target, onBtn = tgt && tgt.tagName === 'BUTTON';
  if (k === 'Escape' || k === 'Esc') { e.preventDefault(); if (!ui.panel.hidden) hidePanel(); else close(); return; }
  if (k === 'Tab') { trapTab(e); return; }
  unlockAudio();
  var go = (k === ' ' || k === 'Spacebar' || k === 'Enter');
  if (state === 'hub' || !ui.panel.hidden) return;
  if (state === 'over') {
    if (go && !onBtn) { e.preventDefault(); if (Date.now() - overAt > 350) { var b = ui.card.querySelector('.jtp-go'); if (b) act(b.getAttribute('data-act')); } }
    else if (k.indexOf('Arrow') === 0) e.preventDefault();
    return;
  }
  if (k === 'm' || k === 'M') { store.sound = !store.sound; saveStore(); syncButtons(); return; }
  if (go && onBtn) return;
  var left = k === 'ArrowLeft' || k === 'a' || k === 'A', right = k === 'ArrowRight' || k === 'd' || k === 'D';
  var up = k === 'ArrowUp' || k === 'w' || k === 'W', down = k === 'ArrowDown' || k === 's' || k === 'S';
  if (!G) return;
  if (G.phase === 'result') { if (go) { e.preventDefault(); skipAhead(); } return; }
  if (G.kind === 'save') {
    if (go && G.phase === 'runup' && !G.ready) { e.preventDefault(); G.ready = true; syncHint(); return; }
    if (left) { e.preventDefault(); choose('left'); }
    else if (right) { e.preventDefault(); choose('right'); }
    else if (up || down || go) { e.preventDefault(); choose('middle'); }
    else if (k === '1') choose('left'); else if (k === '2') choose('middle'); else if (k === '3') choose('right');
    return;
  }
  if (k === 't' || k === 'T') { var tl = ['panenka', 'topbins', 'rabona'].filter(function (x) { return has('trick_' + x); }); if (tl.length) { var ix = tl.indexOf(G.trick); setTrick(ix + 1 < tl.length ? tl[ix + 1] : (G.trick ? G.trick : tl[0])); } return; }
  if (G.trick === 'topbins' && G.trk && !G.trk.side && (left || right)) { e.preventDefault(); trickTap(left ? 0 : L.W, 0); return; }
  if (G.trick === 'rabona' && (left || right)) { e.preventDefault(); trickTap(left ? 0 : L.W, 0); return; }
  if (left || right || up || down) { e.preventDefault(); keyAim(left ? -1 : right ? 1 : 0, up ? 1 : down ? -1 : 0); return; }
  if (go) { e.preventDefault(); if (!e.repeat) keyGo(); }
}
function trapTab(e) {
  var list = Array.prototype.filter.call(ui.o.querySelectorAll('button'), function (b) { return !b.disabled && b.offsetParent !== null; });
  if (!list.length) return;
  var i = list.indexOf(document.activeElement);
  e.preventDefault();
  var n = e.shiftKey ? (i <= 0 ? list.length - 1 : i - 1) : (i < 0 || i >= list.length - 1 ? 0 : i + 1);
  list[n].focus();
}
function onVis() { hiddenPause = !!document.hidden; lastTs = 0; }
function onResize() { layout(); }

function frame(ts) {
  raf = requestAnimationFrame(frame);
  if (hiddenPause) { lastTs = 0; return; }
  var dt = lastTs ? (ts - lastTs) / 1000 : 0;
  lastTs = ts;
  if (dt > 0.05) dt = 0.05;
  if (ui.bar && ((ts | 0) % 500) < 20 && Math.round(ui.bar.getBoundingClientRect().bottom) !== ui.barB) layout();
  if (state !== 'closed' && G) {
    if (G.phase === 'idle') { G.t += dt; updateKeeper(G.kp, dt); updateConfOnly(dt); }
    else if (G.phase === 'trophy') { G.t += dt; G.trophy.t += dt; if (G.trophy.dog) G.trophy.dog += dt; updateFireworks(dt); updateConfOnly(dt); }
    else update(dt);
  }
  render();
}
function updateConfOnly(dt) {
  for (var i = G.conf.length - 1; i >= 0; i--) {
    var p = G.conf[i]; p.life -= dt;
    if (p.life <= 0 || p.y > L.H + 20) { G.conf.splice(i, 1); continue; }
    p.vy = Math.min(p.vy + 140 * L.u * dt, 120 * L.u); p.vx *= (1 - dt * 1.2);
    p.x += (p.vx + Math.sin(G.t * 3 + p.ph) * 26 * L.u) * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
  }
  for (i = G.bubbles.length - 1; i >= 0; i--) { G.bubbles[i].life -= dt; if (G.bubbles[i].life <= 0) G.bubbles.splice(i, 1); }
}

function open() {
  if (state !== 'closed') return;
  opener = document.activeElement;
  unlockAudio();
  RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  loadStore();
  ERA = curEra(); EX = ERA_X[ERA.id] || ERA_X.stone;
  if (store.eras.indexOf(ERA.id) < 0) { store.eras.push(ERA.id); }
  store.lastEra = ERA.id; saveStore();
  refreshUnlocks();
  var o = build();
  document.body.appendChild(o);
  prevOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  state = 'hub';
  hubScene();
  layout();
  syncButtons();
  updateHud();
  if (!unlockCard()) showHub();
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVis);
  watchModal();
  hiddenPause = !!document.hidden;
  lastTs = 0;
  raf = requestAnimationFrame(frame);
}
function close() {
  if (state === 'closed') return;
  state = 'closed';
  roundLive = false;
  cancelAnimationFrame(raf); raf = 0;
  clearTimeout(toastT); clearTimeout(banT); clearTimeout(commT);
  window.removeEventListener('keydown', onKey, true);
  window.removeEventListener('resize', onResize);
  document.removeEventListener('visibilitychange', onVis);
  if (mo) { mo.disconnect(); mo = null; }
  if (ui.o && ui.o.parentNode) ui.o.parentNode.removeChild(ui.o);
  ui = {}; ctx = null; G = null; bgCv = null; crowdCv = null; bgKey = '';
  document.documentElement.style.overflow = prevOverflow;
  releaseModal();
  if (AC && AC.state === 'running') { try { AC.suspend(); } catch (e) {} }
  updateNote();
  if (opener && opener.focus && !modalUp()) { try { opener.focus({ preventScroll: true }); } catch (e) {} }
}

/* ---------- the button in the hero ---------- */
var note = null;
function updateNote() {
  loadStore();
  if (note) note.textContent = store.best > 0 ? 'Best streak: ' + store.best + '. Step up whenever you fancy it.' : 'Step up whenever you fancy it.';
}
function addButton() {
  var hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('.jtpen-launch')) return;
  var box = el('div', 'jtpen-launch');
  var btn = el('button', 'jtpen-open'); btn.type = 'button';
  btn.appendChild(ballCanvas(32));
  btn.appendChild(el('span', '', 'Take a penalty'));
  btn.addEventListener('click', open);
  note = el('p', 'jtpen-note');
  box.appendChild(btn); box.appendChild(note);
  hero.appendChild(box);
  updateNote();
}
if (WITH_BUTTON) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addButton);
  else addButton();
}

window.JTPenalty = { open: open, close: close };

/* ---------- test hook (only with ?jttest or ?hqtest in the address) ---------- */
if (TEST) {
  window.__jtPenalty = {
    info: function () {
      var o = { state: state, best: store.best, games: store.games, keeperOn: keeperOn, RM: RM, cups: store.cups, cupRound: store.cupRound, gloves: store.gloves, secrets: store.secrets, era: ERA.id, look: look() };
      if (!G) return o;
      o.phase = G.phase; o.mode = G.mode; o.kind = G.kind; o.streak = G.streak; o.turn = G.turn; o.outcome = G.outcome;
      o.meterOn = G.meter.on; o.meter = G.meter.v; o.aim = G.aim; o.choice = G.choice; o.shots = G.shots; o.keeper = G.keeperId; o.trick = G.trick;
      o.cup = G.cup ? { us: G.cup.us.join(''), them: G.cup.them.join(''), round: G.cup.round, sd: G.cup.sd } : null;
      o.wall = G.wall ? { n: G.wall.n, saves: G.wall.saves } : null;
      o.shot = G.shot ? { tx: G.shot.tx, ty: G.shot.ty, power: G.shot.power } : null;
      o.hint = ui.hint && ui.hint.className.indexOf('gone') < 0 ? ui.hint.textContent : '';
      return o;
    },
    toClient: function (x, h) { var r = ui.canvas.getBoundingClientRect(); return { x: r.left + gX(x), y: r.top + gY(h) + goalBob() }; },
    ballClient: function () { var r = ui.canvas.getBoundingClientRect(); return { x: r.left + L.cx, y: r.top + L.by - BALL * L.ppm * SB, u: L.u }; },
    set: function (o) { for (var k in o) if (Object.prototype.hasOwnProperty.call(T, k) || k === 'rock') T[k] = o[k]; return T; },
    shoot: function (x, y, p) { return strike(x, y, p); },
    trick: function (id) { setTrick(id); return G && G.trick; },
    mode: function (m) { if (m === 'cup') { showTieIntro(); act('kickoff'); } else startMode(m); return state; },
    hub: function () { toHub(); return state; },
    act: function (a) { act(a); return state; },
    locker: function () { showLocker(); }, secrets: function () { showSecrets(); },
    dog: function () { if (G) { G.fx.dog = { t: 1.5, dir: 1, tapped: 0, spin: 0 }; } },
    bird: function () { if (G) G.fx.bird = { x: 1.2, t: 0, st: 'sit', tapped: false, side: 1 }; },
    jay: function () { if (G) G.fx.jay = { t: 1, x: 0.3, said: 0 }; },
    sub: function () { if (G) G.fx.sub = { t: 0 }; },
    celeb: function (k) { if (G) G.celeb = { kind: k, t: 0.5 }; },
    trophy: function () { if (G && G.mode === 'cup') { G.cup.round = 4; trophyTime('5 - 3'); } },
    endTie: function (r) { if (G && G.cup) { G.cup.us = ['g', 'g', 'g', 'g', 'g']; G.cup.them = ['g', 'm', 'g', 'm', 'm']; if (r === 'lose') { G.cup.us = ['m', 'm', 'g', 'm', 'm']; } endTie(r); } },
    nextKeeperTurn: function () { if (G) G.turn = Math.floor(G.turn / 5) * 5 + 4; return G && G.turn; },
    saveRate: function (x, y, p, streak, n) {
      var keep = G, hits = 0;
      n = n || 400;
      for (var i = 0; i < n; i++) {
        G = newState('quick'); G.streak = streak || 0; setKeeper(keep ? keep.keeperId : 'ug'); G.phase = 'flight';
        var s = makeShot(x, y, p, 'jt');
        keeperThink(s);
        var tt = 0; while (tt < s.ft) { updateKeeper(G.kp, 1 / 60); tt += 1 / 60; }
        if (keeperHits(G.kp, s.tx, s.ty) && Math.abs(s.tx) < HW + 0.4 && s.ty < GHM + 0.4) hits++;
      }
      G = keep;
      return hits / n;
    },
    reducedMotion: function () { return RM; }
  };
}
})();
