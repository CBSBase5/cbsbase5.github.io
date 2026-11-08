/* ==========================================================
   Base 5 Lessons - the tie on an HQ activity page
   An Autumn 2 activity page loads /lessons/plan.js and this file.
   If a whole group lesson leads into this activity, a small card
   under the title says so, with a link to look back at the slides
   (present.html?look=1: nothing counts or gets sent).
   The pack's slug comes from window.A2PACKS. ASCII only.
   ========================================================== */
(function(){
"use strict";
var L = window.B5LESSONS, P = window.A2PACKS;
if(!L || !L.forActivity || !P) return;
var slug = Object.keys(P)[0];
var list = slug ? L.forActivity(slug).filter(function(l){ return l.ready; }) : [];
if(!list.length) return;
var pc = (L.pillars[list[0].pillar] || {}).colour || "#007291";

function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function names(){
  var t = list.map(function(l){ return "<b>" + esc(l.title) + "</b>"; });
  return t.length > 1 ? t.slice(0, -1).join(", ") + " and " + t[t.length - 1] : t[0];
}

var css = ".lessontie{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin:-8px 0 18px;padding:10px 14px;border:2px solid currentColor;border-left:10px solid " + pc + ";border-radius:14px 10px 15px 9px;font-size:.95rem;line-height:1.35}" +
  ".lessontie svg{flex:none;width:46px;height:34px}" +
  ".lessontie p{margin:0;flex:1 1 220px}" +
  ".lessontie .lt-links{display:flex;gap:8px;flex-wrap:wrap}" +
  ".lessontie a{display:inline-block;padding:5px 12px;border:2px solid currentColor;border-radius:999px;color:inherit;text-decoration:none;font-weight:700;white-space:nowrap}" +
  ".lessontie a:hover,.lessontie a:focus-visible{background:" + pc + ";color:#fff;border-color:" + pc + "}" +
  "@media print{.lessontie{display:none}}";

/* a little board with a slide on it */
var icon = '<svg viewBox="0 0 46 34" aria-hidden="true"><rect x="2" y="2" width="42" height="26" rx="5" fill="#fffdf8" stroke="#0a2f38" stroke-width="2.5"/>' +
  '<rect x="8" y="8" width="16" height="4" rx="2" fill="' + pc + '"/><rect x="8" y="16" width="24" height="3" rx="1.5" fill="#0a2f38" opacity=".35"/>' +
  '<path d="M17 28l-4 5M29 28l4 5" stroke="#0a2f38" stroke-width="2.5" stroke-linecap="round"/><circle cx="37" cy="10" r="3" fill="#ef7724"/></svg>';

function href(l){ return "/lessons/present.html?l=" + l.id + (l.split ? "&p=1" : "") + "&look=1"; }

function put(){
  var anchor = document.querySelector(".qwrap .weektheme") || document.querySelector(".weektheme");
  if(!anchor || document.querySelector(".lessontie")) return;
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  var box = document.createElement("div");
  box.className = "lessontie";
  box.innerHTML = icon + '<p>Goes with ' + names() + ', the whole group ' + (list.length > 1 ? "lessons" : "lesson") + ' with Jay.</p>' +
    '<span class="lt-links">' + list.map(function(l){
      return '<a href="' + href(l) + '" title="Nothing counts, it is just a look">' + (list.length > 1 ? "Look back: " + esc(l.title) : "Look back at the slides") + '</a>';
    }).join("") + '</span>';
  anchor.parentNode.insertBefore(box, anchor.nextSibling);
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", put); else put();
})();
