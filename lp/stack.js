/* ==========================================================
   LP's GCSE HQ - Neon Stack
   A short break game for LP's HQ. A glowing block slides across
   the top of the tower. Tap to drop it. Whatever hangs over the
   edge gets sliced off, so the tower gets thinner unless you land
   them clean. Three clean drops in a row grows the block back a
   little. How high can it go?

   Earning goes, the break clock and the cooldown all live in
   /data/hqbreak.js (change the numbers there).
   Home page only:  <script src="/data/hqbreak.js?v=1"></script>
                    <script src="/lp/stack.js?v=1"></script>
   Saves in b5.lp.stack.v1. ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(!window.HQBreak) return;
var PREFIX = (window.HQ && window.HQ.prefix) || "";
if(PREFIX !== "b5.lp.") return;   /* LP's space only */

var NEON = ["#ff7a2f", "#ff4f8b", "#c6f03c", "#3ad0ff"];

var ICON = '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="0" y="0" width="40" height="40" rx="6" fill="#0b2840"/><rect x="8" y="27" width="24" height="6" rx="1" fill="#ff7a2f"/><rect x="10" y="20" width="20" height="6" rx="1" fill="#ff4f8b"/><rect x="11" y="13" width="17" height="6" rx="1" fill="#c6f03c"/><rect x="14" y="6" width="17" height="6" rx="1" fill="#3ad0ff"/></svg>';

window.HQBreak({
  id: "stack",
  title: "Neon Stack",
  prefix: PREFIX,
  icon: ICON,
  theme: { bg: "#0b2840", ink: "#f1f8ff", card: "#f1f8ff", cardInk: "#0b2840", accent: "#c6f03c", accent2: "#ff4f8b", font: 'var(--display,"Chakra Petch",Arial,sans-serif)' },
  words: {
    how: "A block slides across the top. Tap, click or press space to drop it. Anything hanging over the edge gets sliced off. Land three clean in a row and it grows back a bit.",
    earn: "Anything counts, even Show me.",
    coolingTitle: "Recharging",
    cooling: "The neon needs a minute. Have a crack at something else in the meantime.",
    coolingShort: "Recharging.",
    done: "Lights off."
  },
  make: make
});

function make(stage, api){
  var cv = document.createElement("canvas");
  stage.insertBefore(cv, stage.firstChild);
  var cx = cv.getContext("2d");
  var W = 0, H = 0, DPR = 1;
  function size(){
    var r = stage.getBoundingClientRect();
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = Math.max(280, r.width); H = Math.max(360, r.height);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  size();
  window.addEventListener("resize", size);

  var live = false, raf = 0, last = 0, t = 0;
  var tower, mover, bits, cam, camTo, clean, msg, msgT, flash, BH, BASEW, dir, speed;

  function setup(){
    BH = Math.max(22, Math.round(H / 16));
    BASEW = Math.round(Math.min(W * .56, 300));
    tower = [{ x: (W - BASEW) / 2, w: BASEW, c: 0 }];
    bits = []; cam = 0; camTo = 0; clean = 0; msg = ""; msgT = 0; flash = 0; dir = 1;
    speed = Math.max(150, W * .42);
    spawn();
  }
  function spawn(){
    var top = tower[tower.length - 1];
    dir = -dir;
    mover = { x: dir > 0 ? -top.w : W, w: top.w, c: tower.length };
  }
  function start(){
    setup(); live = true; last = 0;
    cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  }
  function say(m){ msg = m; msgT = 1.2; }

  function frame(ts){
    var dt = last ? Math.min(.05, (ts - last) / 1000) : 0; last = ts; t += dt;
    update(dt); draw();
    if(live || bits.length) raf = requestAnimationFrame(frame);
  }

  function update(dt){
    msgT = Math.max(0, msgT - dt); flash = Math.max(0, flash - dt * 3);
    cam += (camTo - cam) * Math.min(1, dt * 6);
    bits.forEach(function(p){ p.vy += 900 * dt; p.y += p.vy * dt; p.x += p.vx * dt; p.r += p.vr * dt; });
    bits = bits.filter(function(p){ return p.y < H + 200 + cam; });
    if(!live || !mover) return;
    var sp = speed + tower.length * 6;
    mover.x += dir * sp * dt;
    /* bounce at the edges so it never wanders off for good */
    if(mover.x > W - mover.w * .2){ mover.x = W - mover.w * .2; dir = -1; }
    if(mover.x < -mover.w * .8){ mover.x = -mover.w * .8; dir = 1; }
  }

  function yOf(i){ return H - 40 - (i + 1) * BH + cam; }

  function drop(){
    if(!live || !mover) return;
    var top = tower[tower.length - 1];
    var a = Math.max(mover.x, top.x), b = Math.min(mover.x + mover.w, top.x + top.w);
    var over = b - a;
    var y = yOf(tower.length);
    if(over <= 0){
      bits.push({ x: mover.x, y: y, w: mover.w, c: mover.c, vy: 0, vx: dir * 60, r: 0, vr: dir * 2 });
      mover = null; live = false;
      api.beep(110, .4, "sawtooth", .08);
      var h = tower.length - 1;
      setTimeout(function(){ api.roundOver(h, h >= 25 ? "That is a skyline." : h >= 12 ? "Solid tower." : "Shaky foundations. Again?"); }, 700);
      return;
    }
    var placed;
    if(Math.abs(mover.x - top.x) <= 5){
      clean++;
      var grow = clean >= 3 ? Math.min(BASEW - top.w, 10) : 0;
      placed = { x: top.x - grow / 2, w: top.w + grow, c: mover.c };
      flash = 1;
      say(clean >= 3 ? "Clean x" + clean + (grow ? "  +grow" : "") : "Clean");
      api.beep(520 + Math.min(clean, 8) * 70, .12, "square", .06);
    } else {
      clean = 0;
      placed = { x: a, w: over, c: mover.c };
      /* the bit that hangs off falls away */
      var offX = mover.x < top.x ? mover.x : b, offW = mover.w - over;
      bits.push({ x: offX, y: y, w: offW, c: mover.c, vy: 0, vx: (mover.x < top.x ? -1 : 1) * 80, r: 0, vr: (mover.x < top.x ? -1 : 1) * 3 });
      api.beep(330, .08, "square", .05);
    }
    tower.push(placed);
    if(yOf(tower.length) < H * .4) camTo += BH;
    spawn();
  }

  function draw(){
    cx.clearRect(0, 0, W, H);
    cx.fillStyle = "#0b2840"; cx.fillRect(0, 0, W, H);
    /* blueprint grid, drifting with the camera */
    cx.strokeStyle = "rgba(58,208,255,.10)"; cx.lineWidth = 1;
    var step = 28, off = (cam % step);
    for(var gx = 0; gx < W; gx += step){ cx.beginPath(); cx.moveTo(gx + .5, 0); cx.lineTo(gx + .5, H); cx.stroke(); }
    for(var gy = off - step; gy < H; gy += step){ cx.beginPath(); cx.moveTo(0, gy + .5); cx.lineTo(W, gy + .5); cx.stroke(); }
    if(flash > 0){ cx.fillStyle = "rgba(198,240,60," + (flash * .12) + ")"; cx.fillRect(0, 0, W, H); }

    /* ground */
    cx.fillStyle = "#103350"; cx.fillRect(0, H - 40 + cam, W, 40 + Math.max(0, -cam));

    tower.forEach(function(b, i){ block(b.x, yOf(i), b.w, b.c, i === tower.length - 1); });
    if(mover) block(mover.x, yOf(tower.length), mover.w, mover.c, true);
    bits.forEach(function(p){
      cx.save(); cx.translate(p.x + p.w / 2, p.y + BH / 2); cx.rotate(p.r);
      cx.globalAlpha = .8; block(-p.w / 2, -BH / 2, p.w, p.c, false); cx.restore();
    });

    cx.textAlign = "left"; cx.fillStyle = "#f1f8ff"; cx.font = "800 34px Arial,sans-serif";
    cx.fillText(String(tower ? tower.length - 1 : 0), 16, 44);
    cx.font = "700 13px Arial,sans-serif"; cx.fillStyle = "rgba(241,248,255,.7)";
    cx.fillText("Best " + api.best(), 16, 64);
    if(msgT > 0){
      cx.globalAlpha = Math.min(1, msgT * 2.5); cx.textAlign = "center";
      cx.font = "800 22px Arial,sans-serif"; cx.fillStyle = "#c6f03c";
      cx.fillText(msg, W / 2, H * .22); cx.globalAlpha = 1;
    }
    if(live && tower.length === 1){
      cx.textAlign = "center"; cx.font = "700 15px Arial,sans-serif"; cx.fillStyle = "rgba(241,248,255,.85)";
      cx.fillText("Tap to drop", W / 2, H - 14 + cam);
    }
  }

  function block(x, y, w, c, glow){
    var col = NEON[c % NEON.length];
    cx.save();
    if(glow && !api.reduced){ cx.shadowColor = col; cx.shadowBlur = 18; }
    cx.fillStyle = col; cx.fillRect(x, y, w, BH - 3);
    cx.shadowBlur = 0;
    cx.fillStyle = "rgba(255,255,255,.28)"; cx.fillRect(x, y, w, 3);
    cx.fillStyle = "rgba(0,0,0,.18)"; cx.fillRect(x, y + BH - 7, w, 4);
    cx.restore();
  }

  function down(e){ if(!live) return; if(e && e.cancelable) e.preventDefault(); drop(); }
  function key(e){ if(!live) return; if(e.code === "Space" || e.key === " " || e.key === "Enter"){ e.preventDefault(); if(!e.repeat) drop(); } }
  cv.addEventListener("pointerdown", down);
  window.addEventListener("keydown", key);
  setup(); mover = null; draw();

  return {
    start: start,
    stop: function(){
      live = false; cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("keydown", key);
    }
  };
}
})();
