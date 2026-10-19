/* ==========================================================
   Base 5 - bests that travel, and the hall of fame
   On a few vault games. Reads the game's own best from this
   device, sends it to Jay's sheet under this device's HQ (the
   HQ last opened here, b5.myhq.v1), and shows a small "Bests"
   button: your best on any device, plus the top three of
   everyone who chose to be in the hall of fame. Being in it is
   off until the student turns it on. Nothing here changes the
   game itself. Needs /data/b5site.js. ASCII only.
   ========================================================== */
(function(){
"use strict";
var GAMES = {
  "/projects/its-time.html": { id: "its-time", key: "b5.projects.itstime.v1", get: function(o){ return o.stats && o.stats.best; }, unit: function(n){ return n + " m"; } },
  "/practice/cue-the-sequence.html": { id: "cue-the-sequence", key: "base5.maths.cuesequence.v1", get: function(o){ return o.best; }, unit: function(n){ return "Level " + n; } },
  "/practice/chip-run.html": { id: "chip-run", key: "base5.maths.chiprun.v1", get: function(o){ return o.best; }, unit: function(n){ return n + " points"; } }
};
var G = GAMES[location.pathname], S = window.B5Site;
if(!G || !S || !S.call || !S.syncUrl || S.guest) return;
var who = null;
try{ who = localStorage.getItem("b5.myhq.v1"); }catch(e){}

function local(){ try{ var o = JSON.parse(localStorage.getItem(G.key) || "null"); var b = o ? +G.get(o) || 0 : 0; return Math.round(b); }catch(e){ return 0; } }
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

var sent = 0, info = null, panel = null, btn = null;
function push(){
  if(!who) return;
  var b = local();
  if(b > sent && (!info || b > (info.mine[G.id] || 0))){
    sent = b;
    S.call("score", { who: who, game: G.id, best: b }).then(function(r){ if(r && r.ok && info){ info.mine[G.id] = r.best; draw(); } }).catch(function(){ sent = 0; });
  }
}
function fetchFame(){
  return S.call("fame", { who: who || "" }).then(function(o){ if(o && o.ok){ info = o; draw(); } }).catch(function(){});
}
function draw(){
  if(!panel || panel.hidden) return;
  var mine = info ? Math.max(info.mine[G.id] || 0, local()) : local(), top = info && info.games[G.id] || [];
  var h = '<b class="b5b-h">Bests</b>';
  if(who) h += '<p>Your best on any device: <strong>' + (mine ? esc(G.unit(mine)) : "nothing yet") + '</strong></p>';
  else h += '<p>Open your own HQ once on this device and your bests travel with you.</p>';
  h += '<p class="b5b-k">Hall of fame</p>';
  h += top.length ? '<ol>' + top.map(function(x){ return '<li><span>' + esc(x.who) + '</span><em>' + esc(G.unit(x.best)) + '</em></li>'; }).join("") + '</ol>' : '<p class="b5b-q">Empty so far. Only people who turn it on are in it.</p>';
  if(who) h += '<label class="b5b-on"><input type="checkbox"' + (info && info.on ? " checked" : "") + '> Put my bests in the hall of fame</label>';
  h += '<button type="button" class="b5b-x">Close</button>';
  panel.innerHTML = h;
  panel.querySelector(".b5b-x").onclick = function(){ panel.hidden = true; btn.setAttribute("aria-expanded", "false"); btn.focus(); };
  var cb = panel.querySelector(".b5b-on input");
  if(cb) cb.onchange = function(){
    cb.disabled = true;
    S.call("optin", { who: who, on: cb.checked }).then(function(){ push(); return fetchFame(); }).catch(function(){ cb.disabled = false; });
  };
}
function mount(){
  var st = document.createElement("style");
  st.textContent = "html body>.b5b-btn{position:fixed !important;z-index:2147482400 !important;right:14px;bottom:14px}" +
    ".b5b-btn{font:700 .86rem/1 Arial,sans-serif;padding:9px 14px;border-radius:999px;border:2px solid #0a2f38;background:#fffdf8;color:#0a2f38;cursor:pointer;box-shadow:0 3px 0 rgba(0,0,0,.25);opacity:.88}" +
    ".b5b-btn:hover,.b5b-btn:focus-visible{opacity:1}" +
    "html body>.b5b-panel{position:fixed !important;z-index:2147482450 !important;right:14px;bottom:60px}" +
    ".b5b-panel{width:min(290px,calc(100vw - 28px));box-sizing:border-box;padding:14px 16px;border-radius:16px;border:2px solid #0a2f38;background:#fffdf8;color:#0a2f38;font:.92rem/1.4 Arial,sans-serif;box-shadow:0 6px 0 rgba(0,0,0,.25)}" +
    ".b5b-panel p{margin:4px 0 8px}.b5b-h{font-size:1.05rem}.b5b-k{font-weight:700;margin:10px 0 4px !important}.b5b-q{opacity:.75}" +
    ".b5b-panel ol{margin:0 0 8px;padding-left:20px}.b5b-panel li{display:flex;justify-content:space-between;gap:10px}.b5b-panel li em{font-style:normal;opacity:.8}" +
    ".b5b-on{display:flex;gap:8px;align-items:flex-start;margin:8px 0}.b5b-x{font:inherit;padding:5px 12px;border-radius:10px;border:2px solid #0a2f38;background:#fff;color:#0a2f38;cursor:pointer}";
  document.head.appendChild(st);
  btn = document.createElement("button"); btn.type = "button"; btn.className = "b5b-btn"; btn.textContent = "Bests";
  btn.setAttribute("aria-expanded", "false");
  panel = document.createElement("div"); panel.className = "b5b-panel"; panel.hidden = true;
  btn.onclick = function(){
    panel.hidden = !panel.hidden; btn.setAttribute("aria-expanded", panel.hidden ? "false" : "true");
    if(!panel.hidden){ draw(); fetchFame(); }
  };
  document.body.appendChild(panel); document.body.appendChild(btn);
  fetchFame().then(push);
  setInterval(push, 5000);
  window.addEventListener("pagehide", push);
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
