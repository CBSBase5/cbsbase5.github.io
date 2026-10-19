/* ==========================================================
   Base 5 - My folder
   Every student HQ has a folder of things Jay has put in it just
   for that student: messages, things to try, and files (links to
   Google Drive and the like, so the files themselves stay behind
   the school's own sharing).

   Each folder is one file, /data/folders/<who>.js, setting
     window.B5FOLDER = { who, updated, data: {...} }
   It opens straight away: no code. Jay writes these files with
   /teacher/folders.html (or asks for things to be added).

   Contents:
     { v: 2,
       messages:   [ { id, date: "YYYY-MM-DD", text } ],
       activities: [ { id, title, href, note } ],
       files:      [ { id, title, href, note } ] }

   On this device, <prefix>folder.v1 keeps
     { seen: {id: ISO time first seen}, tried: {id: ISO time},
       look: ISO time of the last look } (older saves used 1)

   Used by:
     <HQ>/folder.html   B5Folder.page(element)
     /data/hqextras.js  B5Folder.card() on the HQ home
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(window.B5Folder) return;

var HQ = window.HQ || { who: "EGW", prefix: "b5.egw.", base: "/egw/" };
var KEY = HQ.prefix + "folder.v1";
var WHO = String(HQ.who || "EGW");

/* ---------- small helpers ---------- */
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function el(tag, cls, html){ var e = document.createElement(tag); if(cls) e.className = cls; if(html != null) e.innerHTML = html; return e; }
function load(){ try{ var d = JSON.parse(localStorage.getItem(KEY) || "null"); if(d && typeof d === "object") return fill(d); }catch(e){} return fill({}); }
function fill(d){ delete d.code; d.seen = d.seen || {}; d.tried = d.tried || {}; return d; }
function save(d){ try{ localStorage.setItem(KEY, JSON.stringify(d)); }catch(e){} }
function safeHref(h){
  h = String(h || "").trim();
  if(/^https?:\/\//i.test(h) || /^\/(?!\/)/.test(h)) return h;
  return "";
}
function isOut(h){ return /^https?:\/\//i.test(h) && h.indexOf(location.origin) !== 0; }
function nice(dateStr){
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr || "");
  if(!m) return "";
  var d = new Date(+m[1], +m[2] - 1, +m[3]), today = new Date(); today.setHours(0, 0, 0, 0);
  var days = Math.round((today - d) / 86400000);
  if(days === 0) return "Today";
  if(days === 1) return "Yesterday";
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}
/* message text: escaped, blank lines make paragraphs, web links become links */
function words(t){
  return esc(t).split(/\n\s*\n/).map(function(p){
    p = p.replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    return "<p>" + p.replace(/\n/g, "<br>") + "</p>";
  }).join("");
}

/* ---------- Autumn 2 activities: progress reads itself ---------- */
function slugOf(href){ var m = /\/a2-([a-z0-9-]+)\.html/.exec(String(href || "")); return m ? m[1] : ""; }
function progressOf(slug){
  try{
    var o = JSON.parse(localStorage.getItem(HQ.prefix + "a2-" + slug + ".v1") || "null");
    if(!o) return null;
    var s = o.summary || {}, made = "";
    if(o.make) Object.keys(o.make).some(function(k){ var v = String(o.make[k] || "").trim(); if(v){ made = v.slice(0, 70); return true; } return false; });
    if(s.finished) return { done: true, t: "Done", made: made };
    if(s.chunksDone) return { t: s.chunksDone + " of " + s.chunks + " chunks", made: made };
    if(o.answers && Object.keys(o.answers).length) return { t: "Started" };
  }catch(e){}
  return null;
}
function shelfOf(a){
  var slug = slugOf(a.href), lib = window.B5LIB;
  if(slug && lib && lib.items) for(var i = 0; i < lib.items.length; i++) if(lib.items[i].slug === slug) return lib.items[i].shelf;
  return slug ? "about" : "other";
}
function mondayStr(){
  var d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  var m = d.getMonth() + 1, dd = d.getDate();
  return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (dd < 10 ? "0" : "") + dd;
}

/* ---------- what is in the folder ---------- */
function contents(blob){
  var o = blob.data || {};
  o.messages = o.messages || []; o.activities = o.activities || []; o.files = o.files || [];
  return o;
}

/* fetch this student's folder file, fresh each time so new things show up */
var got = null;
function fetchFolder(){
  if(got) return got;
  var url = window.B5Site && window.B5Site.syncUrl;
  got = (url ? fromSheet(url) : Promise.resolve(null)).then(function(b){ return b || fromFile(); }).then(withDrops);
  return got;
}
/* ---------- Autumn 2: activities that arrive on their own day ----------
   /data/a2/drops.js lists each student's activities with the day each one
   lands. Once Jay has added them to the Folders tab, the sheet holds them
   (and only shows each from its date); until then they come from the
   file. Either way nothing shows before its day. */
function todayStr(){
  var d = new Date(), m = d.getMonth() + 1, dd = d.getDate();
  return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (dd < 10 ? "0" : "") + dd;
}
function loadDrops(){
  if(window.B5DROPS) return Promise.resolve(window.B5DROPS);
  return new Promise(function(res){
    var s = document.createElement("script");
    s.src = "/data/a2/drops.js?t=" + todayStr();
    s.onload = function(){ res(window.B5DROPS || null); };
    s.onerror = function(){ res(null); };
    document.head.appendChild(s);
  });
}
function loadLib(){
  if(window.B5LIB) return Promise.resolve(window.B5LIB);
  return new Promise(function(res){
    var s = document.createElement("script");
    s.src = "/data/a2/library.js?t=" + todayStr();
    s.onload = function(){ res(window.B5LIB || null); };
    s.onerror = function(){ res(null); };
    document.head.appendChild(s);
  });
}
function withDrops(blob){
  return loadLib().then(function(){ return withDrops2(blob); });
}
function withDrops2(blob){
  var o = blob ? contents(blob) : { messages: [], activities: [], files: [] };
  var today = todayStr();
  o.activities = o.activities.filter(function(a){ return !a.date || a.date <= today; });
  var inSheet = o.a2 === true || o.activities.some(function(a){ return /\/a2-[a-z0-9-]+\.html/.test(String(a.href || "")); });
  if(inSheet) return Promise.resolve(blob || { who: WHO, updated: "", data: o });
  return loadDrops().then(function(d){
    if(d && d.items) d.items.forEach(function(it){
      if(String(it.who).toUpperCase() !== WHO.toUpperCase() || it.date > today || it.ready === false) return;
      o.activities.push({ id: "a2:" + it.slug, title: it.title, href: it.href, note: it.note, date: it.date });
    });
    return { who: WHO, updated: blob ? blob.updated : "", data: o };
  });
}
/* with the shared memory on, the folder comes from the Folders tab of Jay's sheet */
function fromSheet(url){
  return new Promise(function(res){
    var done = false, t = setTimeout(function(){ if(!done){ done = true; res(null); } }, 12000);
    window.B5Site.call("folder", { who: WHO })
      .then(function(o){ if(!done){ done = true; clearTimeout(t); res(o && o.ok && o.data ? { who: WHO, updated: "", data: o.data } : null); } })
      .catch(function(){ if(!done){ done = true; clearTimeout(t); res(null); } });
  });
}
/* otherwise (or if the sheet cannot be reached) from /data/folders/<who>.js */
function fromFile(){
  return new Promise(function(res){
    var s = document.createElement("script");
    s.src = "/data/folders/" + WHO.toLowerCase() + ".js?t=" + Date.now();
    s.onload = function(){ var b = window.B5FOLDER; res(b && b.data && String(b.who).toUpperCase() === WHO.toUpperCase() ? b : null); };
    s.onerror = function(){ res(null); };
    document.head.appendChild(s);
  });
}

/* ---------- looks: the HQ's own colours via its CSS variables ---------- */
var css = el("style");
css.textContent =
  ".fo-wrap{max-width:860px;margin:0 auto}" +
  ".fo-hero{padding:20px 0 4px;display:flex;gap:18px;align-items:center;flex-wrap:wrap}" +
  ".fo-hero svg{width:84px;height:68px;flex:none}" +
  ".fo-hero h1{font-size:clamp(2.2rem,8vw,3.4rem);color:var(--moon);line-height:1;margin:0}" +
  ".fo-hero p{color:var(--mist);margin:8px 0 0;max-width:56ch}" +
  ".fo-bar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:16px 0 4px;color:var(--mist);font-size:.9rem}" +
  ".fo-bar button{font:inherit;color:var(--mist);background:none;border:0;text-decoration:underline;cursor:pointer;padding:6px 2px}" +
  ".fo-sec{margin:26px 0 0}" +
  ".fo-tab{display:inline-flex;align-items:center;gap:10px;padding:9px 18px 9px 14px;border-radius:14px 22px 0 0;background:var(--sun,#ffd23f);color:#141a33;font-family:var(--display,Arial,sans-serif);font-weight:700;font-size:1.05rem}" +
  ".fo-tab svg{width:22px;height:22px}" +
  ".fo-tab .fo-n{font-size:.78rem;padding:2px 8px;border-radius:99px;background:#141a33;color:#fff}" +
  ".fo-body{border:3px solid var(--sun,#ffd23f);border-radius:0 18px 18px 18px;padding:14px;background:rgba(255,255,255,.05);display:flex;flex-direction:column;gap:12px}" +
  ".fo-empty{margin:4px 2px;color:var(--mist)}" +
  ".fo-item{position:relative;background:#fffdf8;color:#141a33;border-radius:14px;padding:14px 16px;border:2px solid rgba(0,0,0,.12)}" +
  ".fo-item h3{margin:0 0 4px;font-size:1.15rem;color:#141a33}" +
  ".fo-item p{margin:0 0 8px;line-height:1.5}" +
  ".fo-item p:last-child{margin-bottom:0}" +
  ".fo-item a{color:#0d5f86}" +
  ".fo-when{display:block;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:#5b6180;margin:0 0 6px}" +
  ".fo-new{display:inline-block;margin-left:8px;padding:2px 9px;border-radius:99px;background:#ff5d8f;color:#fff;font-size:.72rem;letter-spacing:.06em;vertical-align:middle}" +
  ".fo-sign{font-family:'Comic Sans MS','Chalkboard SE',var(--body,Verdana),sans-serif;color:#5b6180;margin:6px 0 0 !important}" +
  ".fo-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:6px}" +
  ".fo-go{display:inline-block;font-family:var(--display,Arial,sans-serif);font-weight:700;font-size:.95rem;padding:9px 15px;border-radius:12px;border:2px solid #141a33;background:var(--sun,#ffd23f);color:#141a33 !important;text-decoration:none;cursor:pointer}" +
  ".fo-tick{font-family:var(--display,Arial,sans-serif);font-weight:700;font-size:.9rem;padding:8px 13px;border-radius:12px;border:2px dashed #8a8fa8;background:#fff;color:#3d4363;cursor:pointer}" +
  ".fo-tick[aria-pressed=true]{border-style:solid;border-color:#1f9d62;background:#e3f7ec;color:#11603a}" +
  ".fo-item.tried{opacity:.86}" +
  ".fo-lab{margin:6px 2px 0;font-family:var(--display,Arial,sans-serif);font-weight:700;font-size:.82rem;letter-spacing:.08em;text-transform:uppercase;color:var(--mist)}" +
  ".fo-today{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}" +
  ".fo-item.fo-big{border:3px solid var(--sun,#ffd23f);box-shadow:0 6px 0 rgba(0,0,0,.18)}" +
  ".fo-item.fo-big h3{font-size:1.35rem}" +
  ".fo-pr{display:inline-block;margin-left:8px;padding:2px 9px;border-radius:99px;border:2px solid #8a8fa8;color:#3d4363;font-size:.72rem;vertical-align:middle;font-weight:700}" +
  ".fo-pr.done{border-color:#1f9d62;background:#e3f7ec;color:#11603a}" +
  ".fo-made{font-size:.9rem;color:#3d4363;font-style:italic}" +
  ".fo-older summary{cursor:pointer;color:var(--moon);font-family:var(--display,Arial,sans-serif);font-weight:700;padding:6px 2px}" +
  ".fo-olderlist{display:flex;flex-direction:column;gap:12px;margin-top:10px}" +
  ".fo-file{display:flex;gap:14px;align-items:center}" +
  ".fo-file svg{width:42px;height:48px;flex:none}" +
  ".fo-file .fo-kind{font-size:.8rem;color:#5b6180;margin:0 0 2px;text-transform:uppercase;letter-spacing:.08em;font-weight:700}" +
  ".fo-reply{margin-top:2px}" +
  ".fo-reply summary{cursor:pointer;color:var(--moon);font-family:var(--display,Arial,sans-serif);font-weight:700;padding:6px 0}" +
  ".fo-reply textarea{width:100%;min-height:110px;margin:8px 0 0;padding:12px;border-radius:12px;border:2px solid #141a33;font:inherit;font-size:1rem;background:#fffdf8;color:#141a33}" +
  ".fo-reply .sendbox{margin-top:12px}" +
  /* home card */
  ".hqx-card.fo-card{border-color:var(--sun,#ffd23f)}" +
  ".fo-card .fo-dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:#ff5d8f;margin-left:8px;vertical-align:middle;box-shadow:0 0 0 3px rgba(255,93,143,.3)}" +
  "@media (prefers-reduced-motion:no-preference){.fo-card .fo-dot{animation:fodot 1.6s ease-in-out infinite alternate}}" +
  "@keyframes fodot{from{box-shadow:0 0 0 2px rgba(255,93,143,.35)}to{box-shadow:0 0 0 7px rgba(255,93,143,0)}}";
document.head.appendChild(css);

/* ---------- pictures ---------- */
var FOLDER_ART = '<svg viewBox="0 0 84 68" aria-hidden="true"><path d="M4 14q0-6 6-6h20l7 7h37q6 0 6 6v39q0 6-6 6H10q-6 0-6-6z" fill="var(--sun,#ffd23f)"/><rect x="14" y="3" width="44" height="34" rx="3" fill="#fffdf8" transform="rotate(-6 36 20)"/><path d="M19 13h30M19 19h24M19 25h28" stroke="#9aa0bb" stroke-width="2.5" stroke-linecap="round" transform="rotate(-6 36 20)"/><path d="M4 26q0-5 5-5h66q5 0 5 5v32q0 6-6 6H10q-6 0-6-6z" fill="var(--sun,#ffd23f)" stroke="#141a33" stroke-opacity=".25" stroke-width="2"/><circle cx="62" cy="44" r="7" fill="#141a33" fill-opacity=".18"/></svg>';
var ICON = {
  msg:  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6q0-2 2-2h14q2 0 2 2v9q0 2-2 2H10l-5 4v-4q-2 0-2-2z" fill="#141a33"/></svg>',
  act:  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.7 6.2 6.8.6-5.2 4.5 1.6 6.6L12 16.4 6.1 19.9l1.6-6.6L2.5 8.8l6.8-.6z" fill="#141a33"/></svg>',
  file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h8l5 5v13q0 2-2 2H6q-2 0-2-2V4q0-2 2-2z" fill="#141a33"/><path d="M14 2v5h5" fill="#fffdf8" fill-opacity=".5"/></svg>'
};
function kindOf(h){
  h = String(h || "").toLowerCase();
  if(/docs\.google\.com\/document/.test(h)) return { n: "Google Doc", c: "#4285f4" };
  if(/docs\.google\.com\/spreadsheets/.test(h)) return { n: "Google Sheet", c: "#0f9d58" };
  if(/docs\.google\.com\/presentation/.test(h)) return { n: "Google Slides", c: "#f4b400" };
  if(/docs\.google\.com\/forms/.test(h)) return { n: "Google Form", c: "#7248b9" };
  if(/\.pdf(\?|#|$)/.test(h)) return { n: "PDF", c: "#e2541f" };
  if(/\.(png|jpe?g|gif|webp|svg)(\?|#|$)/.test(h)) return { n: "Picture", c: "#22b8ab" };
  if(/youtube\.com|youtu\.be|vimeo\.com|\.(mp4|webm)(\?|#|$)/.test(h)) return { n: "Video", c: "#ff3b2f" };
  if(/\.(mp3|m4a|wav|ogg)(\?|#|$)/.test(h)) return { n: "Sound", c: "#8a5bd0" };
  if(/drive\.google\.com|onedrive|sharepoint/.test(h)) return { n: "File", c: "#5867d6" };
  if(/^\//.test(h)) return { n: "Base 5 page", c: "#007291" };
  return { n: "Link", c: "#5b6180" };
}
function fileArt(k){
  return '<svg viewBox="0 0 42 48" aria-hidden="true"><path d="M4 4q0-3 3-3h20l11 11v32q0 3-3 3H7q-3 0-3-3z" fill="' + k.c + '"/><path d="M27 1v11h11" fill="#fff" fill-opacity=".45"/><path d="M11 26h20M11 32h20M11 38h13" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-opacity=".85"/></svg>';
}

/* ---------- the folder page ---------- */
function page(host){
  var st = load();
  host.innerHTML =
    '<div class="fo-wrap">' +
      '<section class="fo-hero">' + FOLDER_ART + '<div><h1>Your folder</h1>' +
      '<p>Things Jay has put in here just for you: messages, things to try and files. Have a look whenever you like. Nothing in here is marked.</p></div></section>' +
      '<div class="fo-main" aria-live="polite"></div>' +
    '</div>';
  var main = host.querySelector(".fo-main");
  if(window.B5Site && window.B5Site.guest){
    main.innerHTML = '<div class="fo-sec"><div class="fo-body"><p class="fo-empty" style="color:var(--moon)">Each student\'s folder holds messages, things to try and files that Jay has put there just for them, so it stays closed in guest mode. Students see their own folder here.</p></div></div>';
    return;
  }
  main.innerHTML = '<p class="fo-empty">Opening your folder...</p>';

  fetchFolder().then(function(blob){
    if(!blob){
      main.innerHTML = '<div class="fo-sec"><div class="fo-body"><p class="fo-empty">Your folder is still being set up. Nothing in here yet, so nothing to miss.</p></div></div>';
      return;
    }
    show(contents(blob));
  });

  function show(o){
    var msgs = o.messages.map(function(x, i){ return { x: x, i: i }; }).sort(function(a, b){ return a.x.date < b.x.date ? 1 : a.x.date > b.x.date ? -1 : b.i - a.i; }).map(function(m){ return m.x; });
    var fresh = msgs.filter(function(m){ return !st.seen[m.id]; }).length +
                o.activities.filter(function(a){ return !st.seen[a.id]; }).length +
                o.files.filter(function(f){ return !st.seen[f.id]; }).length;
    function isNew(id){ return !st.seen[id] ? '<span class="fo-new">New</span>' : ""; }
    function actHtml(a, big){
      var href = safeHref(a.href), slug = slugOf(href), pr = slug ? progressOf(slug) : null, tried = !!st.tried[a.id];
      var done = pr && pr.done;
      return '<article class="fo-item' + (big ? " fo-big" : "") + (done || tried ? " tried" : "") + '">' +
        (a.date && !big ? '<span class="fo-when">Arrived ' + esc(nice(a.date)) + '</span>' : "") +
        '<h3>' + esc(a.title) + isNew(a.id) + (pr ? ' <span class="fo-pr' + (done ? " done" : "") + '">' + esc(pr.t) + '</span>' : "") + '</h3>' +
        (a.note && (big || !pr) ? words(a.note) : "") +
        (pr && pr.made ? '<p class="fo-made">You made: ' + esc(pr.made) + '</p>' : "") +
        '<div class="fo-row">' +
          (href ? '<a class="fo-go" href="' + esc(href) + '"' + (isOut(href) ? ' target="_blank" rel="noopener"' : "") + '>' + (done ? "Have another look" : pr ? "Carry on" : "Have a look") + '</a>' : "") +
          (slug ? "" : '<button type="button" class="fo-tick" data-id="' + esc(a.id) + '" aria-pressed="' + tried + '">' + (tried ? "Had a go" : "Mark as had a go") + '</button>') +
        '</div></article>';
    }
    function tab(icon, name, n){ return '<div class="fo-tab">' + ICON[icon] + name + (n ? ' <span class="fo-n">' + n + '</span>' : "") + '</div>'; }

    var h = '<div class="fo-bar"><span>' + (fresh ? fresh + " new since you last looked." : "All caught up. Everything is still here to look back on.") + '</span>' +
      '</div>';

    /* messages */
    h += '<section class="fo-sec" aria-label="Messages from Jay">' + tab("msg", "From Jay", msgs.length) + '<div class="fo-body">';
    if(!msgs.length) h += '<p class="fo-empty">No messages yet.</p>';
    msgs.forEach(function(m){
      h += '<article class="fo-item"><span class="fo-when">' + esc(nice(m.date)) + isNew(m.id) + '</span>' + words(m.text) + '<p class="fo-sign">Jay</p></article>';
    });
    h += '<details class="fo-reply"><summary>Write back to Jay (only if you want to)</summary>' +
         '<textarea id="foReply" placeholder="Anything you like. A reply, a question, or just hello."></textarea><div id="foSend"></div></details>';
    h += '</div></section>';

    /* things to try: today first, then this week, then anything from Jay;
       older drops wait in a closed drawer, by shelf, so it never reads as a pile */
    h += '<section class="fo-sec" aria-label="Things to try">' + tab("act", "Things to try", 0) + '<div class="fo-body">';
    if(!o.activities.length) h += '<p class="fo-empty">Nothing here yet.</p>';
    var today = todayStr(), mon = mondayStr();
    var acts = o.activities.map(function(x, i){ return { x: x, i: i }; }).sort(function(a, b){
      var da = a.x.date || "", db = b.x.date || "";
      return da === db ? a.i - b.i : da < db ? 1 : -1;
    }).map(function(m){ return m.x; });
    var tod = acts.filter(function(a){ return a.date === today; });
    var week = acts.filter(function(a){ return a.date && a.date < today && a.date >= mon; });
    var jay = acts.filter(function(a){ return !a.date; });
    var older = acts.filter(function(a){ return a.date && a.date < mon; });
    if(tod.length){ h += '<p class="fo-lab">New today, if you fancy it</p><div class="fo-today">' + tod.map(function(a){ return actHtml(a, true); }).join("") + '</div>'; }
    else if(acts.length) h += '<p class="fo-empty">Nothing new today. Everything else is still here, whenever you like.</p>';
    if(week.length) h += '<p class="fo-lab">Earlier this week</p>' + week.map(function(a){ return actHtml(a); }).join("");
    if(jay.length) h += '<p class="fo-lab">Also from Jay</p>' + jay.map(function(a){ return actHtml(a); }).join("");
    if(older.length){
      var by = {}, names = { english: "English", maths: "Maths", about: "Out and about", other: "Other things" };
      older.forEach(function(a){ var sh = shelfOf(a); (by[sh] = by[sh] || []).push(a); });
      h += '<details class="fo-older"><summary>Earlier things to try</summary><div class="fo-olderlist">' +
        ["english", "maths", "about", "other"].filter(function(k){ return by[k]; }).map(function(k){
          return '<p class="fo-lab">' + names[k] + '</p>' + by[k].map(function(a){ return actHtml(a); }).join("");
        }).join("") + '</div></details>';
    }
    h += '</div></section>';

    /* files */
    h += '<section class="fo-sec" aria-label="Files">' + tab("file", "Files", o.files.length) + '<div class="fo-body">';
    if(!o.files.length) h += '<p class="fo-empty">No files yet.</p>';
    o.files.forEach(function(f){
      var href = safeHref(f.href), k = kindOf(href);
      h += '<article class="fo-item fo-file">' + fileArt(k) + '<div style="flex:1;min-width:0"><p class="fo-kind">' + k.n + '</p><h3>' + esc(f.title) + isNew(f.id) + '</h3>' +
        (f.note ? words(f.note) : "") +
        (href ? '<div class="fo-row"><a class="fo-go" href="' + esc(href) + '" target="_blank" rel="noopener">Open it</a></div>' : "") +
        '</div></article>';
    });
    h += '</div></section>';
    main.innerHTML = h;

    [].forEach.call(main.querySelectorAll(".fo-tick"), function(b){
      b.addEventListener("click", function(){
        var id = b.dataset.id, on = !st.tried[id];
        if(on) st.tried[id] = new Date().toISOString(); else delete st.tried[id];
        save(st);
        b.setAttribute("aria-pressed", on ? "true" : "false");
        b.textContent = on ? "Had a go" : "Mark as had a go";
        b.closest(".fo-item").classList.toggle("tried", on);
      });
    });
    if(window.Base5Send){
      var reply = main.querySelector("#foReply");
      window.Base5Send.mount(main.querySelector("#foSend"), {
        tool: "Folder reply",
        filename: "reply",
        getText: function(){ return reply.value.trim() || "(nothing written)"; }
      });
    }

    /* everything on show now counts as seen, ready for next time */
    var nowIso = new Date().toISOString();
    msgs.concat(o.activities, o.files).forEach(function(x){ if(!st.seen[x.id]) st.seen[x.id] = nowIso; });
    st.look = nowIso;
    save(st);
  }
}

/* ---------- the card on the HQ home ---------- */
function card(){
  var st = load();
  var c = el("a", "hqx-card fo-card");
  c.href = HQ.base + "folder.html";
  c.innerHTML =
    '<span class="hqx-k">Your folder</span>' +
    '<span class="hqx-t">Things Jay has put in here for you</span>' +
    '<p class="hqx-s">Messages, things to try and files. Just for you.</p>' +
    '<span class="hqx-go">Open my folder</span>';
  var t = c.querySelector(".hqx-t"), s = c.querySelector(".hqx-s");
  if(window.B5Site && window.B5Site.guest){ s.textContent = "Private to each student, so it stays closed in guest mode."; return c; }
  fetchFolder().then(function(blob){
    if(!blob) return;
    var o = contents(blob);
    var n = o.messages.concat(o.activities, o.files).filter(function(x){ return !st.seen[x.id]; }).length;
    if(n){ t.innerHTML = n + " new thing" + (n === 1 ? "" : "s") + ' in here<span class="fo-dot" aria-hidden="true"></span>'; s.textContent = "From Jay, just for you. Have a look when you are ready."; }
  });
  return c;
}

window.B5Folder = { page: page, card: card };
})();
