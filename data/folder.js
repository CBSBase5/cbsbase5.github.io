/* ==========================================================
   Base 5 - My folder
   Every student HQ has a folder of things Jay has put in it just
   for that student: messages, things to try, and files (links to
   Google Drive and the like, so the files themselves stay behind
   the school's own sharing).

   Each folder is one file, /data/folders/<who>.js, setting
     window.B5FOLDER = { who, iter, updated, salt, iv, ct }
   The contents are locked (AES-GCM, key from PBKDF2) with the
   student's four digit code, the same one as their project page.
   Only "updated" is readable without the code. Jay writes these
   files with /teacher/folders.html.

   Unlocked contents:
     { v: 1,
       messages:   [ { id, date: "YYYY-MM-DD", text } ],
       activities: [ { id, title, href, note } ],
       files:      [ { id, title, href, note } ] }

   On this device, <prefix>folder.v1 keeps
     { code (only if "keep it open" is ticked), seen: {id: 1},
       tried: {id: 1}, look: ISO time of the last look }

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
function fill(d){ d.seen = d.seen || {}; d.tried = d.tried || {}; return d; }
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

/* ---------- the lock ---------- */
function b64(s){ var raw = atob(s), a = new Uint8Array(raw.length); for(var i = 0; i < raw.length; i++) a[i] = raw.charCodeAt(i); return a; }
function unlock(blob, code){
  if(!window.crypto || !crypto.subtle) return Promise.reject(new Error("no crypto"));
  return crypto.subtle.importKey("raw", new TextEncoder().encode(code), "PBKDF2", false, ["deriveKey"]).then(function(base){
    return crypto.subtle.deriveKey({ name: "PBKDF2", salt: b64(blob.salt), iterations: blob.iter || 250000, hash: "SHA-256" },
      base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  }).then(function(key){
    return crypto.subtle.decrypt({ name: "AES-GCM", iv: b64(blob.iv) }, key, b64(blob.ct));
  }).then(function(buf){
    var o = JSON.parse(new TextDecoder().decode(buf));
    o.messages = o.messages || []; o.activities = o.activities || []; o.files = o.files || [];
    return o;
  });
}

/* fetch this student's folder file, fresh each time so new things show up */
var got = null;
function fetchFolder(){
  if(got) return got;
  got = new Promise(function(res){
    var s = document.createElement("script");
    s.src = "/data/folders/" + WHO.toLowerCase() + ".js?t=" + Math.floor(Date.now() / 60000);
    s.onload = function(){ var b = window.B5FOLDER; res(b && b.ct && String(b.who).toUpperCase() === WHO.toUpperCase() ? b : null); };
    s.onerror = function(){ res(null); };
    document.head.appendChild(s);
  });
  return got;
}

/* ---------- looks: the HQ's own colours via its CSS variables ---------- */
var css = el("style");
css.textContent =
  ".fo-wrap{max-width:860px;margin:0 auto}" +
  ".fo-hero{padding:20px 0 4px;display:flex;gap:18px;align-items:center;flex-wrap:wrap}" +
  ".fo-hero svg{width:84px;height:68px;flex:none}" +
  ".fo-hero h1{font-size:clamp(2.2rem,8vw,3.4rem);color:var(--moon);line-height:1;margin:0}" +
  ".fo-hero p{color:var(--mist);margin:8px 0 0;max-width:56ch}" +
  ".fo-lock{max-width:440px;margin:22px 0;padding:22px;border-radius:18px;background:#fffdf8;color:#141a33;border:3px solid #141a33;box-shadow:0 8px 0 rgba(0,0,0,.25)}" +
  ".fo-lock h2{font-size:1.35rem;margin:0 0 6px;color:#141a33}" +
  ".fo-lock p{margin:0 0 12px;color:#3d4363}" +
  ".fo-pin{font-family:var(--display,Arial,sans-serif);font-size:2rem;letter-spacing:.5em;text-align:center;width:9.5ch;padding:10px 0 10px .5em;border:3px solid #141a33;border-radius:14px;background:#fff;color:#141a33}" +
  ".fo-pin:focus{outline:3px solid var(--sun,#ffd23f);outline-offset:3px}" +
  ".fo-keep{display:flex;gap:8px;align-items:center;margin:12px 0;font-size:.95rem}" +
  ".fo-keep input{width:20px;height:20px}" +
  ".fo-msg{min-height:1.4em;margin:10px 0 0;font-size:.95rem}" +
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
  main.innerHTML = '<p class="fo-empty">Opening your folder...</p>';

  fetchFolder().then(function(blob){
    if(!blob){
      main.innerHTML = '<div class="fo-sec"><div class="fo-body"><p class="fo-empty">Your folder is still being set up. Nothing in here yet, so nothing to miss.</p></div></div>';
      return;
    }
    if(st.code){
      unlock(blob, st.code).then(function(o){ show(o, blob); }, function(){ delete st.code; save(st); lockScreen(blob); });
    } else lockScreen(blob);
  });

  function lockScreen(blob){
    main.innerHTML =
      '<div class="fo-lock">' +
        '<h2>It is locked with your code</h2>' +
        '<p>Your four numbers, the same ones that open your project page. If they have gone out of your head, Jay can tell you.</p>' +
        '<label for="foPin" class="fo-kind" style="display:block;margin:0 0 6px;font-weight:700">Your code</label>' +
        '<input id="foPin" class="fo-pin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off">' +
        '<label class="fo-keep"><input type="checkbox" id="foKeep" checked> Keep it open on this device</label>' +
        '<button type="button" class="fo-go" id="foOpen">Open my folder</button>' +
        '<p class="fo-msg" id="foMsg"></p>' +
      '</div>';
    var pin = main.querySelector("#foPin"), msg = main.querySelector("#foMsg"), busy = false;
    function go(){
      var code = pin.value.replace(/\D/g, "");
      if(code.length !== 4 || busy){ if(code.length !== 4) msg.textContent = "It is four numbers."; return; }
      busy = true; msg.textContent = "Opening...";
      unlock(blob, code).then(function(o){
        if(main.querySelector("#foKeep").checked){ st.code = code; save(st); }
        show(o, blob);
      }, function(){
        busy = false; pin.value = ""; pin.focus();
        msg.textContent = "Not that one. Have another go whenever you like.";
      });
    }
    pin.addEventListener("input", function(){ pin.value = pin.value.replace(/\D/g, "").slice(0, 4); if(pin.value.length === 4) go(); });
    pin.addEventListener("keydown", function(e){ if(e.key === "Enter") go(); });
    main.querySelector("#foOpen").addEventListener("click", go);
    pin.focus();
  }

  function show(o, blob){
    var msgs = o.messages.map(function(x, i){ return { x: x, i: i }; }).sort(function(a, b){ return a.x.date < b.x.date ? 1 : a.x.date > b.x.date ? -1 : b.i - a.i; }).map(function(m){ return m.x; });
    var fresh = msgs.filter(function(m){ return !st.seen[m.id]; }).length +
                o.activities.filter(function(a){ return !st.seen[a.id]; }).length +
                o.files.filter(function(f){ return !st.seen[f.id]; }).length;
    function isNew(id){ return !st.seen[id] ? '<span class="fo-new">New</span>' : ""; }
    function tab(icon, name, n){ return '<div class="fo-tab">' + ICON[icon] + name + (n ? ' <span class="fo-n">' + n + '</span>' : "") + '</div>'; }

    var h = '<div class="fo-bar"><span>' + (fresh ? fresh + " new since you last looked." : "All caught up. Everything is still here to look back on.") + '</span>' +
      (st.code ? '<button type="button" id="foLock">Lock it again on this device</button>' : "") + '</div>';

    /* messages */
    h += '<section class="fo-sec" aria-label="Messages from Jay">' + tab("msg", "From Jay", msgs.length) + '<div class="fo-body">';
    if(!msgs.length) h += '<p class="fo-empty">No messages yet.</p>';
    msgs.forEach(function(m){
      h += '<article class="fo-item"><span class="fo-when">' + esc(nice(m.date)) + isNew(m.id) + '</span>' + words(m.text) + '<p class="fo-sign">Jay</p></article>';
    });
    h += '<details class="fo-reply"><summary>Write back to Jay (only if you want to)</summary>' +
         '<textarea id="foReply" placeholder="Anything you like. A reply, a question, or just hello."></textarea><div id="foSend"></div></details>';
    h += '</div></section>';

    /* things to try */
    h += '<section class="fo-sec" aria-label="Things to try">' + tab("act", "Things to try", o.activities.length) + '<div class="fo-body">';
    if(!o.activities.length) h += '<p class="fo-empty">Nothing here yet.</p>';
    o.activities.forEach(function(a){
      var href = safeHref(a.href), tried = !!st.tried[a.id];
      h += '<article class="fo-item' + (tried ? " tried" : "") + '"><h3>' + esc(a.title) + isNew(a.id) + '</h3>' +
        (a.note ? words(a.note) : "") +
        '<div class="fo-row">' +
          (href ? '<a class="fo-go" href="' + esc(href) + '"' + (isOut(href) ? ' target="_blank" rel="noopener"' : "") + '>Have a look</a>' : "") +
          '<button type="button" class="fo-tick" data-id="' + esc(a.id) + '" aria-pressed="' + tried + '">' + (tried ? "Had a go" : "Mark as had a go") + '</button>' +
        '</div></article>';
    });
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
        if(on) st.tried[id] = 1; else delete st.tried[id];
        save(st);
        b.setAttribute("aria-pressed", on ? "true" : "false");
        b.textContent = on ? "Had a go" : "Mark as had a go";
        b.closest(".fo-item").classList.toggle("tried", on);
      });
    });
    var lk = main.querySelector("#foLock");
    if(lk) lk.addEventListener("click", function(){ delete st.code; save(st); lockScreen(blob); });
    if(window.Base5Send){
      var reply = main.querySelector("#foReply");
      window.Base5Send.mount(main.querySelector("#foSend"), {
        tool: "Folder reply",
        filename: "reply",
        getText: function(){ return reply.value.trim() || "(nothing written)"; }
      });
    }

    /* everything on show now counts as seen, ready for next time */
    msgs.concat(o.activities, o.files).forEach(function(x){ st.seen[x.id] = 1; });
    st.look = new Date().toISOString();
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
  fetchFolder().then(function(blob){
    if(!blob) return;
    var newer = !st.look || (blob.updated && blob.updated > st.look);
    if(st.code){
      unlock(blob, st.code).then(function(o){
        var n = o.messages.concat(o.activities, o.files).filter(function(x){ return !st.seen[x.id]; }).length;
        if(n){ t.innerHTML = n + " new thing" + (n === 1 ? "" : "s") + ' in here<span class="fo-dot" aria-hidden="true"></span>'; s.textContent = "From Jay, just for you. Have a look when you are ready."; }
      }, function(){});
    } else if(newer){
      t.innerHTML = 'Something new is in here<span class="fo-dot" aria-hidden="true"></span>';
      s.textContent = "From Jay, just for you. Your code opens it.";
    }
  });
  return c;
}

window.B5Folder = { page: page, card: card, unlock: unlock };
})();
