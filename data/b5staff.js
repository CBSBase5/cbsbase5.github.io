/* ==========================================================
   Base 5 - staff pages: approved accounts only
   Every staff page (the staff room, the live view, Targets, the
   BridgeLink copy list, folders, the Autumn 2 drops, Milestones,
   Codes and targets, and each HQ's "Jay's view") loads this in
   its head. The page stays hidden until the Base 5 sheet says this
   browser is signed in to a school account listed as Staff in the
   People tab. Anyone else, guest mode, or a browser the sheet
   cannot check, gets a "staff only" card instead.

   The page code itself is public (it is on GitHub), but nothing
   private is in it: names, notes, progress and targets only ever
   come from the sheet, and the sheet only answers approved staff
   accounts (see staff_ in teacher/sync/base5-sheet.gs.txt).

   B5Staff.ready  -> Promise that resolves once the page is open.
   Needs /data/b5site.js, loaded before it.
   ASCII only.
   ========================================================== */
(function(){
"use strict";
if(window.B5Staff) return;
var d = document, html = d.documentElement;
/* set before anything on the page opens the bridge */
if(window.B5Site){ window.B5Site.bridgeWait = 30000; if(window.B5Site.retryBridge) window.B5Site.retryBridge(); }
html.classList.add("b5gate");
var css = d.createElement("style");
css.textContent =
  "html.b5gate body > *:not(#b5gate){display:none !important}" +
  "#b5gate{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px 16px;box-sizing:border-box;background:var(--paper,#f4f1ea);font-family:var(--font,Verdana,Arial,sans-serif);color:var(--ink,#141a33)}" +
  "#b5gate .card{max-width:460px;width:100%;background:#fffdf8;border:2px solid var(--ink,#141a33);border-radius:16px;padding:22px 22px 18px;box-shadow:0 6px 0 rgba(20,26,51,.12)}" +
  "#b5gate h1{font-size:1.35rem;margin:0 0 8px}#b5gate p{margin:0 0 10px;line-height:1.5}#b5gate .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}" +
  "#b5gate a,#b5gate button{font:inherit;font-weight:700;border:2px solid var(--ink,#141a33);border-radius:10px;padding:8px 14px;background:#fff;color:inherit;text-decoration:none;cursor:pointer}" +
  "#b5gate .tips{margin:0 0 10px;padding-left:1.2em;line-height:1.45;font-size:.95rem}#b5gate .tips li{margin:4px 0}#b5gate .tips a{border:0;padding:0;font-weight:700;text-decoration:underline;background:none}" +
  "#b5gate .go{background:var(--ink,#141a33);color:#fff}#b5gate .dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:#ffd23f;margin-right:8px;animation:b5gp 1s ease-in-out infinite alternate}" +
  "@keyframes b5gp{from{opacity:.35}to{opacity:1}}@media (prefers-reduced-motion:reduce){#b5gate .dot{animation:none}}";
(d.head || html).appendChild(css);

var done, ready = new Promise(function(res){ done = res; });
window.B5Staff = { ready: ready };

function box(){
  var b = d.getElementById("b5gate");
  if(!b){ b = d.createElement("div"); b.id = "b5gate"; b.setAttribute("role", "main"); d.body.insertBefore(b, d.body.firstChild); }
  return b;
}
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function show(kind, said){
  var b = box(), S = window.B5Site || {};
  if(kind === "wait" || kind === "slow"){
    b.innerHTML = '<div class="card" aria-live="polite"><h1><span class="dot"></span>Checking your school account</h1><p>Staff pages open for school accounts listed as Staff in the Base 5 sheet.</p>' +
      (kind === "slow" ? '<p>Still checking. The sheet can take a few seconds to wake up, especially first thing.</p>' : '') + '</div>';
    return;
  }
  var why = kind === "guest" ? "Guest mode is on in this tab, so staff pages stay closed." :
            kind === "down" ? "The Base 5 sheet did not answer, so your account could not be checked." :
            kind === "said" ? "The Base 5 sheet answered with a problem: " + esc(said) + "." :
            "This browser is not signed in to an approved staff account. Staff pages open for school accounts listed as Staff in the People tab of the Base 5 sheet.";
  var tips = kind === "down" || kind === "said" ?
    '<ul class="tips"><li><b>Try again</b> first: the sheet is sometimes slow to wake up.</li>' +
    '<li>Signed in to more than one Google account? The school one needs to be the first you signed in to in this browser. A private window with only your school account is a quick way round it.</li>' +
    (S.syncUrl ? '<li><a href="' + esc(S.syncUrl) + '?action=ping" target="_blank" rel="noopener">Test the connection</a>: it opens a tab that says {"ok":true} when everything is working, or Google\'s own message saying what is wrong.</li>' : '') +
    '</ul>' : '<p>Signed in to the wrong account? Switch to your school account, then try again.</p>';
  b.innerHTML = '<div class="card" aria-live="polite"><h1>Staff only</h1><p>' + why + '</p>' + tips +
    '<div class="row"><button type="button" class="go" id="b5gateTry">Try again</button>' +
    '<a href="https://accounts.google.com/AccountChooser?continue=' + encodeURIComponent(location.href) + '">Choose account</a>' +
    '<a href="/">Base 5 home</a></div></div>';
  var t = d.getElementById("b5gateTry"); if(t) t.onclick = function(){ check(); };
}
function open(){
  html.classList.remove("b5gate");
  var b = d.getElementById("b5gate"); if(b) b.parentNode.removeChild(b);
  done(true);
}
function check(){
  var S = window.B5Site;
  if(S && S.guest){ show("guest"); return; }
  if(!S || !S.call || !S.syncUrl){ show("down"); return; }
  show("wait");
  /* staff pages need the sheet, so never give up early because a background feature
     found it slow: forget any earlier "down", and wait up to half a minute */
  if(S.retryBridge) S.retryBridge();
  S.bridgeWait = 30000;
  var settled = false, slow = setTimeout(function(){ if(!settled) show("slow"); }, 6000);
  var timer = setTimeout(function(){ if(!settled){ settled = true; show("down"); } }, 36000);
  /* a direct whoami, so a sheet that cannot be reached reads as "could not check", not "not staff" */
  S.call("whoami").then(function(o){
    if(settled) return; settled = true; clearTimeout(timer); clearTimeout(slow);
    if(o && o.ok && o.staff){ open(); return; }
    if(o && o.ok) show("no"); else show(o && o.error ? "said" : "down", o && o.error);
  }, function(){ if(settled) return; settled = true; clearTimeout(timer); clearTimeout(slow); show("down"); });
}
if(d.readyState === "loading") d.addEventListener("DOMContentLoaded", check); else check();
})();
