/* ==========================================================
   Base 5 - a student's own pages: their account, or their code
   Every page of a student's HQ and their project page loads this
   (from /data/b5site.js). The page stays hidden until it knows who
   is there:
   1. Signed in to that student's school account (People tab of the
      Base 5 sheet), or a staff account: it opens by itself.
   2. Otherwise the student's four numbers open it, and this device
      remembers that for 30 days.
   Once a tab is open it stays open, so moving between pages of the
   HQ does not ask again. Guest mode (the parents' look around) is
   left alone: it never touches a student's own saves.
   Uses /data/b5lock.js and /data/b5keys.js for the code, loaded
   only when needed. No code is ever written in a page. ASCII only.
   ========================================================== */
(function(){
"use strict";
if(window.B5Gate) return;
var S = window.B5Site, who = S && (S.hq || S.syncWho);
if(!who || S.guest || /^\/autumn-1\//.test(location.pathname) || /\/teacher\.html$/.test(location.pathname)){ window.B5Gate = { ready: Promise.resolve(true) }; return; }
S.bridgeWait = Math.max(+S.bridgeWait || 0, 20000);
var d = document, html = d.documentElement, OK = "b5.gate.ok." + who, MEM = "b5.gate.code." + who, DAYS = 30;
var BASES = { EGW: "/egw/", LP: "/lp/", LW: "/lw/", LC: "/lc/", HK: "/hk/", JT: "/jt-hq/" };
function sget(st, k){ try{ return st.getItem(k); }catch(e){ return null; } }
function sset(st, k, v){ try{ st.setItem(k, v); }catch(e){} }
var done, ready = new Promise(function(r){ done = r; });
window.B5Gate = { ready: ready };
var remembered = +(sget(localStorage, MEM) || 0);
if(sget(sessionStorage, OK) || (remembered && Date.now() - remembered < DAYS * 864e5)){ sset(sessionStorage, OK, "1"); done(true); return; }

html.classList.add("b5gate");
var css = d.createElement("style");
css.textContent =
  "html.b5gate body > *:not(#b5gate){display:none !important}" +
  "#b5gate{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px 16px;box-sizing:border-box;background:var(--paper,#f4f1ea);font-family:var(--font,Verdana,Arial,sans-serif);color:var(--ink,#141a33)}" +
  "#b5gate .card{max-width:460px;width:100%;background:#fffdf8;color:#141a33;border:2px solid #141a33;border-radius:16px;padding:22px 22px 18px;box-shadow:0 6px 0 rgba(20,26,51,.12)}" +
  "#b5gate h1{font-size:1.35rem;margin:0 0 8px}#b5gate p{margin:0 0 10px;line-height:1.5}#b5gate .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;align-items:center}" +
  "#b5gate a,#b5gate button{font:inherit;font-weight:700;border:2px solid #141a33;border-radius:10px;padding:8px 14px;background:#fff;color:#141a33;text-decoration:none;cursor:pointer}" +
  "#b5gate .go{background:#141a33;color:#fff}#b5gate input{font:inherit;font-size:1.4rem;letter-spacing:.4em;width:7.5em;padding:8px 10px;border:2px solid #141a33;border-radius:10px;text-align:center}" +
  "#b5gate .msg{min-height:1.4em;font-weight:700}#b5gate .dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:#ffd23f;margin-right:8px;animation:b5gp 1s ease-in-out infinite alternate}" +
  "@keyframes b5gp{from{opacity:.35}to{opacity:1}}@media (prefers-reduced-motion:reduce){#b5gate .dot{animation:none}}";
(d.head || html).appendChild(css);

function box(){
  var b = d.getElementById("b5gate");
  if(!b){ b = d.createElement("div"); b.id = "b5gate"; b.setAttribute("role", "main"); d.body.insertBefore(b, d.body.firstChild); }
  return b;
}
function open(){
  sset(sessionStorage, OK, "1");
  html.classList.remove("b5gate");
  var b = d.getElementById("b5gate"); if(b) b.parentNode.removeChild(b);
  done(true);
}
function script(src, test){
  if(test()) return Promise.resolve();
  return new Promise(function(r){ var s = d.createElement("script"); s.src = src; s.onload = s.onerror = function(){ r(); }; d.head.appendChild(s); });
}
function show(kind, other){
  var b = box();
  if(kind === "wait"){ b.innerHTML = '<div class="card" aria-live="polite"><h1><span class="dot"></span>Checking your school account</h1><p>' + who + '\'s pages open by themselves on ' + who + '\'s school account.</p></div>'; return; }
  var lead = other ? 'This is ' + who + '\'s space. It opens on ' + who + '\'s school account, and this browser is signed in as ' + other + '.' :
    kind === "down" ? 'The Base 5 sheet could not check your school account just now.' :
    'This is ' + who + '\'s space. It opens by itself on ' + who + '\'s school account.';
  b.innerHTML = '<div class="card" aria-live="polite"><h1>' + (other ? 'This is ' + who + '\'s space' : 'Just checking it is you') + '</h1><p>' + lead + '</p>' +
    '<p>If you are ' + who + ', your four numbers open it too. This device then remembers for a while.</p>' +
    '<div class="row"><input id="b5gateCode" inputmode="numeric" autocomplete="off" maxlength="4" aria-label="' + who + '\'s four numbers" placeholder="----">' +
    '<button type="button" class="go" id="b5gateGo">Open</button></div><p class="msg" id="b5gateMsg" aria-live="polite"></p>' +
    '<div class="row">' + (other && BASES[other] ? '<a href="' + BASES[other] + '">Go to ' + other + '\'s HQ</a>' : '<button type="button" id="b5gateTry">Check my account again</button>') +
    '<a href="/">Base 5 home</a></div></div>';
  var inp = d.getElementById("b5gateCode"), go = d.getElementById("b5gateGo"), msg = d.getElementById("b5gateMsg"), t = d.getElementById("b5gateTry");
  if(t) t.onclick = function(){ try{ sessionStorage.removeItem("b5.bridge.down"); }catch(e){} location.reload(); };
  function tryCode(){
    var c = String(inp.value || "").replace(/\D/g, "");
    if(c.length !== 4){ msg.textContent = "Four numbers go in the box."; return; }
    go.disabled = true; msg.textContent = "Checking...";
    script("/data/b5keys.js?v=1", function(){ return !!window.B5KEYS; })
      .then(function(){ return script("/data/b5lock.js?v=1", function(){ return !!window.B5Lock; }); })
      .then(function(){ return window.B5Lock ? B5Lock.checkCode(who, c) : false; })
      .then(function(ok){
        go.disabled = false;
        if(ok){ sset(localStorage, MEM, String(Date.now())); open(); }
        else { msg.textContent = "Those numbers did not open it. Have another go whenever, or ask Jay."; inp.value = ""; inp.focus(); }
      }, function(){ go.disabled = false; msg.textContent = "That did not work just now. Have another go in a moment."; });
  }
  go.onclick = tryCode;
  inp.addEventListener("keydown", function(e){ if(e.key === "Enter") tryCode(); });
  try{ inp.focus({ preventScroll: true }); }catch(e){}
}
function check(){
  if(!S.call || !S.syncUrl){ show("down"); return; }
  show("wait");
  /* wait a little longer than background features: the sheet can be slow to wake up */
  if(S.retryBridge) S.retryBridge();
  S.bridgeWait = 20000;
  var settled = false, timer = setTimeout(function(){ if(!settled){ settled = true; show("down"); } }, 22000);
  S.call("whoami").then(function(o){
    if(settled) return; settled = true; clearTimeout(timer);
    if(o && o.ok && (o.staff || String(o.who || "").toUpperCase() === who)){ open(); return; }
    show(o && o.ok ? "no" : "down", o && o.ok && o.who ? String(o.who).toUpperCase() : "");
  }, function(){ if(settled) return; settled = true; clearTimeout(timer); show("down"); });
}
if(d.readyState === "loading") d.addEventListener("DOMContentLoaded", check); else check();
})();
