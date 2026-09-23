/* ==========================================================
   Base 5 - Flappy Jay
   A small floating game that sits in the margin of a page,
   for tapping at while you think. It never interrupts, it
   never scores anything that counts, and it can be tucked
   away with one tap.

   Use, once per page:
     <script src="/data/flappyjay.js"></script>
     <script>FlappyJay.mount();</script>

   Options (all optional):
     FlappyJay.mount({ side:"right", start:"tucked", key:"base5.flappy.v1" })

   Nothing here touches the page it sits on. Keyboard flapping
   is ignored while the cursor is in a text box, so typing an
   answer never makes Jay jump.
   ========================================================== */

var FlappyJay = (function(){
"use strict";

var CSS = [
".fj-wrap{position:fixed;z-index:9998;font-family:'Atkinson Hyperlegible',system-ui,sans-serif;touch-action:none}",
".fj-wrap *{box-sizing:border-box}",
".fj-panel{background:#fffdf8;border:3px solid #0a2f38;border-radius:18px 14px 20px 12px;box-shadow:6px 7px 0 rgba(10,47,56,.22);overflow:hidden;width:216px}",
".fj-bar{display:flex;align-items:center;gap:6px;padding:7px 8px;background:#0a2f38;color:#fffdf8;cursor:grab}",
".fj-bar.drag{cursor:grabbing}",
".fj-title{font-family:Archivo,system-ui,sans-serif;font-weight:800;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;margin-right:auto;white-space:nowrap}",
".fj-btn{border:2px solid #fffdf8;background:transparent;color:#fffdf8;border-radius:999px;width:24px;height:24px;line-height:1;font-size:.8rem;font-weight:800;cursor:pointer;padding:0}",
".fj-btn:hover{background:#ef7724;border-color:#ef7724}",
".fj-btn:focus-visible,.fj-tuck:focus-visible,.fj-stage:focus-visible{outline:3px solid #ef7724;outline-offset:2px}",
".fj-stage{display:block;width:100%;height:auto;background:#bfe6f0;cursor:pointer;touch-action:none}",
".fj-foot{display:flex;align-items:center;gap:8px;padding:6px 9px;font-size:.74rem;color:#3d5b64;background:#fffdf8;border-top:2px dashed #cfdde1}",
".fj-foot b{font-family:Archivo,system-ui,sans-serif;font-size:.9rem;color:#0a2f38}",
".fj-foot span{margin-left:auto}",
".fj-tuck{position:fixed;z-index:9998;border:3px solid #0a2f38;background:#ffc247;color:#0a2f38;border-radius:999px;padding:9px 14px;cursor:pointer;",
"  font-family:Archivo,system-ui,sans-serif;font-weight:800;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;box-shadow:4px 5px 0 rgba(10,47,56,.22)}",
".fj-tuck:hover{transform:translateY(-2px)}",
".fj-tuck img{width:20px;height:20px;border-radius:50%;vertical-align:-5px;margin-right:7px}",
"@media (max-width:820px){.fj-panel{width:170px}}",
"@media (prefers-reduced-motion:reduce){.fj-tuck:hover{transform:none}}"
].join("\n");

var W = 216, H = 300;           /* game world, in its own units */
var GRAV = 1000, FLAP = -330, SPEED = 96, GAP = 140, PW = 38, EVERY = 1.9;
var R = 21;                      /* face radius */

function mount(opts){
  opts = opts || {};
  var KEY = opts.key || "base5.flappyjay.v1";
  var store = {best: 0, tucked: opts.start === "tucked", x: null, y: null};
  try{ var raw = localStorage.getItem(KEY); if(raw){ var o = JSON.parse(raw); for(var k in o) store[k] = o[k] } }catch(e){}
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(store)) }catch(e){} }

  var style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  /* ---------- the tucked away tab ---------- */
  var tuck = document.createElement("button");
  tuck.className = "fj-tuck";
  tuck.type = "button";
  tuck.innerHTML = '<img src="/data/jay.png" alt=""> Play';
  tuck.setAttribute("aria-label", "Open the game");
  tuck.style.right = "16px";
  tuck.style.bottom = "16px";
  document.body.appendChild(tuck);

  /* ---------- the panel ---------- */
  var wrap = document.createElement("div");
  wrap.className = "fj-wrap";
  wrap.innerHTML =
    '<div class="fj-panel">' +
      '<div class="fj-bar"><span class="fj-title">Flappy Jay</span>' +
        '<button class="fj-btn" type="button" data-a="tuck" aria-label="Tuck the game away" title="Tuck away">-</button>' +
      "</div>" +
      '<canvas class="fj-stage" width="' + W + '" height="' + H + '" tabindex="0" aria-label="Flappy Jay: tap or press space to flap"></canvas>' +
      '<div class="fj-foot">Score <b class="fj-score">0</b><span>Best <b class="fj-best">0</b></span></div>' +
    "</div>";
  document.body.appendChild(wrap);

  var panel = wrap.querySelector(".fj-panel");
  var bar = wrap.querySelector(".fj-bar");
  var cvs = wrap.querySelector(".fj-stage");
  var ctx = cvs.getContext("2d");
  var scoreEl = wrap.querySelector(".fj-score");
  var bestEl = wrap.querySelector(".fj-best");
  bestEl.textContent = store.best;

  function place(){
    var w = panel.offsetWidth || 216, h = panel.offsetHeight || 380;
    var x = store.x, y = store.y;
    if(x == null || y == null){
      x = Math.max(8, window.innerWidth - w - 16);
      y = Math.max(8, window.innerHeight - h - 16);
    }
    x = Math.min(Math.max(4, x), Math.max(4, window.innerWidth - w - 4));
    y = Math.min(Math.max(4, y), Math.max(4, window.innerHeight - h - 4));
    wrap.style.left = x + "px";
    wrap.style.top = y + "px";
  }

  function setTucked(v){
    store.tucked = v; save();
    wrap.style.display = v ? "none" : "block";
    tuck.style.display = v ? "block" : "none";
    if(!v){ place(); cvs.focus({preventScroll: true}) }
  }
  tuck.addEventListener("click", function(){ setTucked(false) });
  wrap.querySelector('[data-a="tuck"]').addEventListener("click", function(){ setTucked(true) });

  /* ---------- dragging by the title bar ---------- */
  var drag = null;
  bar.addEventListener("pointerdown", function(e){
    if(e.target.closest(".fj-btn")) return;
    drag = {dx: e.clientX - wrap.offsetLeft, dy: e.clientY - wrap.offsetTop};
    bar.classList.add("drag");
    try{ bar.setPointerCapture(e.pointerId) }catch(err){}
  });
  bar.addEventListener("pointermove", function(e){
    if(!drag) return;
    store.x = e.clientX - drag.dx; store.y = e.clientY - drag.dy;
    place();
  });
  function endDrag(){ if(drag){ drag = null; bar.classList.remove("drag"); save() } }
  bar.addEventListener("pointerup", endDrag);
  bar.addEventListener("pointercancel", endDrag);
  window.addEventListener("resize", place);

  /* ---------- the face ---------- */
  var face = new Image();
  var faceOk = false;
  face.onload = function(){ faceOk = true };
  face.src = "/data/jay.png";

  /* ---------- game state ---------- */
  var G = {state: "ready", y: H / 2, v: 0, pipes: [], t: 0, score: 0, flash: 0};

  function reset(){
    G.state = "ready"; G.y = H / 2; G.v = 0; G.pipes = []; G.t = 0; G.score = 0;
    scoreEl.textContent = "0";
  }

  function flap(){
    if(G.state === "ready"){ G.state = "play"; G.v = FLAP; return }
    if(G.state === "play"){ G.v = FLAP; return }
    if(G.state === "over" && G.flash <= 0) reset();
  }

  cvs.addEventListener("pointerdown", function(e){ e.preventDefault(); cvs.focus({preventScroll: true}); flap() });
  cvs.addEventListener("keydown", function(e){
    if(e.key === " " || e.key === "ArrowUp" || e.key === "Enter"){ e.preventDefault(); flap() }
  });
  /* space anywhere on the page, but never while writing an answer */
  document.addEventListener("keydown", function(e){
    if(store.tucked || e.key !== " ") return;
    var t = e.target;
    if(t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable || t.closest("button"))) return;
    e.preventDefault(); flap();
  });

  function addPipe(){
    var margin = 46;
    var top = margin + Math.random() * (H - GAP - margin * 2);
    G.pipes.push({x: W + 10, top: top, passed: false});
  }

  function step(dt){
    if(G.flash > 0) G.flash -= dt;
    if(G.state !== "play") return;
    G.v += GRAV * dt;
    G.y += G.v * dt;
    G.t += dt;
    if(G.t > EVERY){ G.t = 0; addPipe() }
    G.pipes.forEach(function(p){ p.x -= SPEED * dt });
    G.pipes = G.pipes.filter(function(p){ return p.x > -PW - 4 });

    var cx = W * 0.34;
    G.pipes.forEach(function(p){
      if(!p.passed && p.x + PW < cx - R){ p.passed = true; G.score++; scoreEl.textContent = G.score }
      var withinX = cx + R > p.x && cx - R < p.x + PW;
      if(withinX && (G.y - R < p.top || G.y + R > p.top + GAP)) die();
    });
    if(G.y + R > H - 10 || G.y - R < 0) die();
  }

  function die(){
    if(G.state !== "play") return;
    G.state = "over"; G.flash = 0.45;
    if(G.score > store.best){ store.best = G.score; bestEl.textContent = store.best; save() }
  }

  function roundRect(x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function draw(){
    /* sky */
    var sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#cdeef7"); sky.addColorStop(1, "#eaf7e9");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
    /* a couple of clouds, drifting with the pipes */
    ctx.fillStyle = "rgba(255,253,248,.85)";
    var cloudX = (W - (G.t * SPEED * 0.3) % (W + 80));
    [[cloudX, 46, 17], [cloudX + 90, 120, 13], [cloudX - 70, 210, 15]].forEach(function(c){
      ctx.beginPath(); ctx.arc(c[0], c[1], c[2], 0, Math.PI * 2);
      ctx.arc(c[0] + c[2], c[1] + 3, c[2] * 0.8, 0, Math.PI * 2); ctx.fill();
    });
    /* pipes */
    G.pipes.forEach(function(p){
      ctx.fillStyle = "#0a8a5f"; ctx.strokeStyle = "#0a2f38"; ctx.lineWidth = 3;
      roundRect(p.x, -20, PW, p.top + 20, 6); ctx.fill(); ctx.stroke();
      roundRect(p.x - 4, p.top - 16, PW + 8, 16, 5); ctx.fill(); ctx.stroke();
      roundRect(p.x, p.top + GAP, PW, H - p.top - GAP, 6); ctx.fill(); ctx.stroke();
      roundRect(p.x - 4, p.top + GAP, PW + 8, 16, 5); ctx.fill(); ctx.stroke();
    });
    /* ground */
    ctx.fillStyle = "#e0c68a"; ctx.fillRect(0, H - 10, W, 10);
    ctx.strokeStyle = "#0a2f38"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, H - 10); ctx.lineTo(W, H - 10); ctx.stroke();
    /* Jay */
    var cx = W * 0.34;
    var tilt = Math.max(-0.5, Math.min(0.9, G.v / 700));
    ctx.save();
    ctx.translate(cx, G.y);
    ctx.rotate(tilt);
    ctx.fillStyle = "rgba(10,47,56,.18)";
    ctx.beginPath(); ctx.ellipse(3, 5, R, R * 0.95, 0, 0, Math.PI * 2); ctx.fill();
    if(faceOk){
      var w = R * 2.25, h = w * (face.height / face.width);
      ctx.drawImage(face, -w / 2, -h / 2, w, h);
    } else {
      ctx.fillStyle = "#f2c49b"; ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    /* words */
    ctx.textAlign = "center";
    ctx.fillStyle = "#0a2f38";
    if(G.state === "ready"){
      ctx.font = "800 15px Archivo, system-ui, sans-serif";
      ctx.fillText("Tap to flap", W / 2, H * 0.34);
      ctx.font = "12px 'Atkinson Hyperlegible', system-ui, sans-serif";
      ctx.fillText("space works too", W / 2, H * 0.34 + 18);
    }
    if(G.state === "over"){
      ctx.fillStyle = "rgba(10,47,56,.72)"; ctx.fillRect(0, H * 0.3, W, 86);
      ctx.fillStyle = "#fffdf8";
      ctx.font = "800 17px Archivo, system-ui, sans-serif";
      ctx.fillText("Jay hit a pipe", W / 2, H * 0.3 + 30);
      ctx.font = "12px 'Atkinson Hyperlegible', system-ui, sans-serif";
      ctx.fillText("Score " + G.score + ", best " + store.best, W / 2, H * 0.3 + 50);
      ctx.fillText("Tap to go again", W / 2, H * 0.3 + 70);
    }
    if(G.flash > 0){
      ctx.fillStyle = "rgba(239,119,36," + (G.flash / 0.45 * 0.35).toFixed(3) + ")";
      ctx.fillRect(0, 0, W, H);
    }
  }

  var last = performance.now();
  function frame(now){
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    if(!store.tucked && !document.hidden){ step(dt); draw() }
    requestAnimationFrame(frame);
  }

  /* crisp on high density screens */
  var dpr = Math.min(2, window.devicePixelRatio || 1);
  cvs.width = W * dpr; cvs.height = H * dpr;
  cvs.style.width = "100%"; cvs.style.height = "auto";
  ctx.scale(dpr, dpr);

  setTucked(store.tucked);
  place();
  reset();
  requestAnimationFrame(frame);

  var api = {
    tuck: function(){ setTucked(true) },
    open: function(){ setTucked(false) },
    flap: flap,
    state: G          /* live state, handy for checking the game works */
  };
  FlappyJay.last = api;
  return api;
}

return {mount: mount};
})();
