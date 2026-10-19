/* ==========================================================
   Base 5 - a question from someone in Base 5
   On each HQ's daily drop page. Students can make a question
   on any activity's finish screen; once Jay approves it in the
   live view, it turns up here for everyone else (never for the
   person who made it, and never with a name). One a day, with
   "Another one" for more. Nothing is saved or scored.
   Needs /data/b5site.js. ASCII only.
   ========================================================== */
(function(){
"use strict";
var S = window.B5Site;
if(!S || !S.call || !S.syncUrl || S.guest || !S.hq) return;
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function start(){
  if(S.bridgeDown()) return;
  var anchor = document.getElementById("dropCard");
  if(!anchor) return;
  S.call("questions", { who: S.hq }).then(function(o){
    if(!o || !o.ok || !o.items || !o.items.length) return;
    var items = o.items, d = new Date(), n = d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate();
    var at = n % items.length;
    var board = document.createElement("div"); board.className = "board";
    var card = document.createElement("div"); card.className = "card w12"; card.id = "baseQ";
    board.appendChild(card);
    anchor.parentNode.insertAdjacentElement("afterend", board);
    function draw(){
      var q = items[at];
      card.innerHTML = '<span class="kicker">A question from someone in Base 5' + (q.subject ? ' &middot; ' + esc(q.subject) : '') + '</span>' +
        '<div class="prompt" style="margin-top:10px">' + esc(q.q) + '</div>' +
        '<p class="tiny" id="baseQa" hidden>' + (q.a ? '<b>Their answer:</b> ' + esc(q.a) : 'No answer with this one, so it is one to think about.') + '</p>' +
        '<div class="qnav"><button class="btn btn-quiet" type="button" id="baseQshow">Show their answer</button>' +
        (items.length > 1 ? '<button class="btn btn-quiet" type="button" id="baseQnext">Another one</button>' : '') + '</div>' +
        '<p class="tiny">Just for fun. It does not count for anything.</p>';
      document.getElementById("baseQshow").onclick = function(){ document.getElementById("baseQa").hidden = false; this.remove(); };
      var nx = document.getElementById("baseQnext");
      if(nx) nx.onclick = function(){ at = (at + 1) % items.length; draw(); };
    }
    draw();
  }).catch(function(){});
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
