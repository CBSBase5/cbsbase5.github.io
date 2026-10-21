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
html.classList.add("b5gate");
var css = d.createElement("style");
css.textContent =
  "html.b5gate body > *:not(#b5gate){display:none !important}" +
  "#b5gate{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px 16px;box-sizing:border-box;background:var(--paper,#f4f1ea);font-family:var(--font,Verdana,Arial,sans-serif);color:var(--ink,#141a33)}" +
  "#b5gate .card{max-width:460px;width:100%;background:#fffdf8;border:2px solid var(--ink,#141a33);border-radius:16px;padding:22px 22px 18px;box-shadow:0 6px 0 rgba(20,26,51,.12)}" +
  "#b5gate h1{font-size:1.35rem;margin:0 0 8px}#b5gate p{margin:0 0 10px;line-height:1.5}#b5gate .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}" +
  "#b5gate a,#b5gate button{font:inherit;font-weight:700;border:2px solid var(--ink,#141a33);border-radius:10px;padding:8px 14px;background:#fff;color:inherit;text-decoration:none;cursor:pointer}" +
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
function show(kind){
  var b = box();
  if(kind === "wait"){ b.innerHTML = '<div class="card" aria-live="polite"><h1><span class="dot"></span>Checking your school account</h1><p>Staff pages open for school accounts listed as Staff in the Base 5 sheet.</p></div>'; return; }
  var why = kind === "guest" ? "Guest mode is on in this tab, so staff pages stay closed." :
            kind === "down" ? "The Base 5 sheet could not be reached to check your account. Check you are signed in to your school Google account in this browser, then try again." :
            "This browser is not signed in to an approved staff account. Staff pages open for school accounts listed as Staff in the People tab of the Base 5 sheet.";
  b.innerHTML = '<div class="card" aria-live="polite"><h1>Staff only</h1><p>' + why + '</p>' +
    '<p>Signed in to the wrong account? Switch to your school account, then try again.</p>' +
    '<div class="row"><button type="button" class="go" id="b5gateTry">Try again</button>' +
    '<a href="https://accounts.google.com/AccountChooser?continue=' + encodeURIComponent(location.href) + '">Choose account</a>' +
    '<a href="/">Base 5 home</a></div></div>';
  var t = d.getElementById("b5gateTry"); if(t) t.onclick = function(){ location.reload(); };
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
  /* a direct whoami, so a sheet that cannot be reached reads as "could not check", not "not staff" */
  var timer = setTimeout(function(){ show("down"); }, 15000);
  S.call("whoami").then(function(o){
    clearTimeout(timer);
    if(o && o.ok && o.staff){ open(); return; }
    show(o && o.ok ? "no" : "down");
  }, function(){ clearTimeout(timer); show("down"); });
}
if(d.readyState === "loading") d.addEventListener("DOMContentLoaded", check); else check();
})();
