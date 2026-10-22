/* ==========================================================
   LP's GCSE HQ - Neon Stack
   A short break game for LP's HQ. A glowing block slides across
   the top of the tower. Tap to drop it. Whatever hangs over the
   edge gets sliced off, so the tower gets thinner unless you land
   them clean. Three clean drops in a row grows the block back a
   little; five in a row gives a few blocks of slow motion.

   The climb: every floor is 10 metres. Real landmarks are marked
   up the side and announced as you pass them, and the sky changes
   from a night city to clouds to space. A glowing flag marks your
   best height. Every ten floors a curveball changes the rules for
   the next ten (Speed up, Gusty, Gold rush, Zigzag). When the
   tower falls, the camera pulls back to show the whole thing.

   Earning goes, the break clock and the cooldown all live in
   /data/hqbreak.js (change the numbers there).
   Home page only:  <script src="/data/hqbreak.js?v=3"></script>
                    <script src="/lp/stack.js?v=2"></script>
   Saves in b5.lp.stack.v1. ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(!window.HQBreak) return;
var PREFIX = (window.HQ && window.HQ.prefix) || "";
if(PREFIX !== "b5.lp.") return;   /* LP's space only */

var NEON = ["#ff7a2f", "#ff4f8b", "#c6f03c", "#3ad0ff"];
var GOLD = "#ffd23f";
var M_PER_FLOOR = 10;
/* real heights, rounded to the nearest floor */
var MARKS = [
  { f:5,   n:"Nelson's Column", m:52 },
  { f:10,  n:"Big Ben's tower", m:96 },
  { f:14,  n:"the London Eye", m:135 },
  { f:16,  n:"Blackpool Tower", m:158 },
  { f:31,  n:"the Shard", m:310 },
  { f:33,  n:"the Eiffel Tower", m:330 },
  { f:44,  n:"the Empire State Building", m:443 },
  { f:83,  n:"the Burj Khalifa", m:828 },
  { f:109, n:"the top of Yr Wyddfa", m:1085 }
];
/* the sky, by floor */
var SKY = [
  { f:0,   top:"#0b2840", bot:"#123a5c" },
  { f:20,  top:"#2a1a5e", bot:"#b34d7a" },
  { f:40,  top:"#3d6fb3", bot:"#9fd0f0" },
  { f:65,  top:"#0d1640", bot:"#2b3f8a" },
  { f:90,  top:"#02030c", bot:"#0b0f2e" }
];
var CURVES = [
  { id:"speed", n:"Speed up", d:"Everything moves faster" },
  { id:"gust",  n:"Gusty",    d:"The wind speeds it up and slows it down" },
  { id:"gold",  n:"Gold rush", d:"Land a gold block clean to grow it back" },
  { id:"zig",   n:"Zigzag",   d:"It might change direction. Watch closely" }
];

var ICON = '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="0" y="0" width="40" height="40" rx="6" fill="#0b2840"/><rect x="8" y="27" width="24" height="6" rx="1" fill="#ff7a2f"/><rect x="10" y="20" width="20" height="6" rx="1" fill="#ff4f8b"/><rect x="11" y="13" width="17" height="6" rx="1" fill="#c6f03c"/><rect x="14" y="6" width="17" height="6" rx="1" fill="#3ad0ff"/></svg>';

window.HQBreak({
  id: "stack",
  title: "Neon Stack",
  prefix: PREFIX,
  icon: ICON,
  theme: { bg: "#0b2840", ink: "#f1f8ff", card: "#f1f8ff", cardInk: "#0b2840", accent: "#c6f03c", accent2: "#ff4f8b", font: 'var(--display,"Chakra Petch",Arial,sans-serif)' },
  words: {
    how: "Tap, click or press space to drop the block. Overhangs get sliced off. Three clean drops grows it back, five gives slow motion. Every floor is 10 metres: how many landmarks can you beat?",
    earn: "Anything counts, even Show me.",
    coolingTitle: "Recharging",
    cooling: "The neon needs a minute. Have a crack at something else in the meantime.",
    coolingShort: "Recharging.",
    done: "Lights off."
  },
  make: make
});

function mix(a, b, k){
  var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  var r = Math.round(((pa >> 16) & 255) * (1 - k) + ((pb >> 16) & 255) * k);
  var g = Math.round(((pa >> 8) & 255) * (1 - k) + ((pb >> 8) & 255) * k);
  var bl = Math.round((pa & 255) * (1 - k) + (pb & 255) * k);
  return "rgb(" + r + "," + g + "," + bl + ")";
}
function sky(f){
  for(var i = SKY.length - 1; i >= 0; i--) if(f >= SKY[i].f){
    var a = SKY[i], b = SKY[i + 1]; if(!b) return { top:a.top, bot:a.bot };
    var k = Math.min(1, (f - a.f) / (b.f - a.f)); k = k * k * (3 - 2 * k);
    return { top:mix(a.top, b.top, k), bot:mix(a.bot, b.bot, k) };
  }
  return SKY[0];
}

function make(stage, api){
  var cv = document.createElement("canvas");
  stage.insertBefore(cv, stage.firstChild);
  var cx = cv.getContext("2d");
  var W = 0, H = 0, DPR = 1, RM = !!api.reduced;
  function size(){
    var r = stage.getBoundingClientRect();
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = Math.max(280, r.width); H = Math.max(360, r.height);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if(!live && tower) draw();
  }

  var live = false, ending = false, raf = 0, last = 0, t = 0, endTimer = 0;
  var tower, mover, bits, sparks, rings, cam, camTo, zoom, zoomTo, clean, slow, shake, flash, BH, BASEW, dir, banner, bestAtStart, passedBest, curve, lastCurve, stars, city, clouds, toast;

  function setup(){
    BH = Math.max(22, Math.round(H / 17));
    BASEW = Math.round(Math.min(W * .56, 300));
    tower = [{ x:(W - BASEW) / 2, w:BASEW, c:0 }];
    bits = []; sparks = []; rings = []; cam = 0; camTo = 0; zoom = 1; zoomTo = 1; clean = 0; slow = 0; shake = 0; flash = 0; dir = 1;
    banner = null; toast = null; curve = null; ending = false; passedBest = false; bestAtStart = api.best();
    stars = []; for(var i = 0; i < 90; i++) stars.push({ x:Math.random(), y:Math.random(), r:Math.random() * 1.6 + .4, p:Math.random() * 6 });
    city = []; var x = -10; while(x < W + 10){ var w = 26 + Math.random() * 46; city.push({ x:x, w:w, h:40 + Math.random() * 110, lit:Math.random() }); x += w + 4; }
    clouds = []; for(var c = 0; c < 9; c++) clouds.push({ f:38 + c * 4 + Math.random() * 3, x:Math.random(), s:.6 + Math.random() * .8 });
    spawn();
  }
  function floors(){ return tower.length - 1; }
  function spawn(){
    var top = tower[tower.length - 1];
    dir = -dir;
    var f = tower.length;
    mover = { x:dir > 0 ? -top.w : W, w:top.w, c:f, gold:curve && curve.id === "gold" && f % 2 === 0, flip:0 };
  }
  function start(){
    clearTimeout(endTimer);
    setup(); live = true; last = 0;
    cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  }
  function say(big, small, col){ banner = { big:big, small:small || "", col:col || "#c6f03c", t:2.2 }; }
  function note(i){ var scale = [523, 587, 659, 784, 880, 1047, 1175, 1319]; return scale[Math.min(scale.length - 1, i)]; }
  function chord(fs, gap){ fs.forEach(function(f, i){ setTimeout(function(){ api.beep(f, .16, "triangle", .07); }, i * (gap || 90)); }); }

  function frame(ts){
    var dt = last ? Math.min(.05, (ts - last) / 1000) : 0; last = ts; t += dt;
    update(dt); draw();
    if(live || ending || bits.length || sparks.length) raf = requestAnimationFrame(frame);
  }

  function update(dt){
    flash = Math.max(0, flash - dt * 3); shake = Math.max(0, shake - dt * 30);
    if(banner){ banner.t -= dt; if(banner.t <= 0) banner = null; }
    if(toast){ toast.t -= dt; if(toast.t <= 0) toast = null; }
    cam += (camTo - cam) * Math.min(1, dt * (ending ? 2.4 : 6));
    zoom += (zoomTo - zoom) * Math.min(1, dt * 2.4);
    bits.forEach(function(p){ p.vy += 900 * dt; p.y += p.vy * dt; p.x += p.vx * dt; p.r += p.vr * dt; });
    bits = bits.filter(function(p){ return p.y < H * 3 + cam; });
    sparks.forEach(function(p){ p.vy += 600 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; });
    sparks = sparks.filter(function(p){ return p.life > 0; });
    rings.forEach(function(r){ r.k += dt * 2.2; });
    rings = rings.filter(function(r){ return r.k < 1; });
    if(!live || !mover) return;
    var sp = Math.max(150, W * .42) + tower.length * 6;
    if(curve && curve.id === "speed") sp *= 1.35;
    if(curve && curve.id === "gust") sp *= 1 + .5 * Math.sin(t * 3.1);
    if(slow > 0) sp *= .55;
    if(curve && curve.id === "zig"){ mover.flip -= dt; if(mover.flip <= 0){ mover.flip = .7 + Math.random() * 1.1; if(Math.random() < .45) dir = -dir; } }
    mover.x += dir * sp * dt;
    if(mover.x > W - mover.w * .2){ mover.x = W - mover.w * .2; dir = -1; }
    if(mover.x < -mover.w * .8){ mover.x = -mover.w * .8; dir = 1; }
  }

  function yOf(i){ return H - 40 - (i + 1) * BH + cam; }

  function burst(x, y, n, col, spread){
    if(RM) n = Math.ceil(n / 3);
    for(var i = 0; i < n; i++) sparks.push({ x:x, y:y, vx:(Math.random() - .5) * (spread || 320), vy:-Math.random() * 260 - 40, life:.5 + Math.random() * .5, c:col, s:2 + Math.random() * 3 });
  }

  function drop(){
    if(!live || !mover) return;
    var top = tower[tower.length - 1];
    var a = Math.max(mover.x, top.x), b = Math.min(mover.x + mover.w, top.x + top.w);
    var over = b - a, y = yOf(tower.length), col = mover.gold ? GOLD : NEON[mover.c % NEON.length];
    if(over <= 0){ fall(top, y); return; }
    var placed;
    if(Math.abs(mover.x - top.x) <= 5){
      clean++;
      var grow = mover.gold ? Math.min(BASEW - top.w, 26) : clean >= 3 ? Math.min(BASEW - top.w, 10) : 0;
      placed = { x:top.x - grow / 2, w:top.w + grow, c:mover.c, gold:mover.gold };
      flash = 1; rings.push({ x:placed.x, y:y, w:placed.w, k:0, c:col });
      burst(placed.x, y + BH / 2, 8, col, 200); burst(placed.x + placed.w, y + BH / 2, 8, col, 200);
      api.beep(note(clean - 1), .12, "square", .06);
      if(clean === 5){ slow = 4; toast = { text:"Slow motion", t:1.4 }; chord([660, 880, 1100]); }
      else if(mover.gold) toast = { text:"Gold! +grow", t:1.1 };
      else if(clean >= 3) toast = { text:"Clean x" + clean + (grow ? "  +grow" : ""), t:1.1 };
      else toast = { text:"Clean", t:.8 };
    } else {
      clean = 0;
      placed = { x:a, w:over, c:mover.c, gold:mover.gold };
      var left = mover.x < top.x, offX = left ? mover.x : b, offW = mover.w - over;
      bits.push({ x:offX, y:y, w:offW, c:mover.c, gold:mover.gold, vy:0, vx:(left ? -1 : 1) * 80, r:0, vr:(left ? -1 : 1) * 3 });
      burst(left ? a : b, y + BH / 2, 10, col, 260);
      if(!RM) shake = Math.min(8, 3 + offW / 25);
      api.beep(330, .08, "square", .05);
    }
    if(slow > 0) slow--;
    tower.push(placed);
    if(yOf(tower.length) < H * .4) camTo += BH;
    afterFloor();
    spawn();
  }

  function afterFloor(){
    var f = floors();
    /* landmarks */
    MARKS.forEach(function(m){ if(m.f === f){ say("Higher than " + m.n + "!", m.m + " m tall, and you are at " + f * M_PER_FLOOR + " m", "#ffd23f"); chord([523, 659, 784, 1047]); burst(W / 2, H * .3, 26, "#ffd23f", 520); } });
    /* best flag */
    if(!passedBest && bestAtStart > 0 && f > bestAtStart){ passedBest = true; toast = { text:"New best!", t:1.6 }; chord([784, 988, 1175], 70); burst(W / 2, yOf(f), 30, "#c6f03c", 600); }
    /* curveball every ten floors */
    if(f > 0 && f % 10 === 0){
      var pool = CURVES.filter(function(c){ return !lastCurve || c.id !== lastCurve.id; });
      curve = lastCurve = pool[Math.floor(Math.random() * pool.length)];
      setTimeout(function(){ if(live && curve === lastCurve){ if(!banner || banner.t < 1) say("Curveball: " + curve.n, curve.d, "#ff4f8b"); api.beep(220, .14, "sawtooth", .06); setTimeout(function(){ api.beep(330, .16, "sawtooth", .06); }, 140); } }, banner ? 1700 : 0);
    }
  }

  function fall(top, y){
    bits.push({ x:mover.x, y:y, w:mover.w, c:mover.c, gold:mover.gold, vy:0, vx:dir * 60, r:0, vr:dir * 2 });
    mover = null; live = false; ending = true; curve = null; slow = 0;
    api.beep(110, .4, "sawtooth", .08);
    if(!RM) shake = 10;
    var h = floors();
    /* pull back to show the whole tower */
    var towerPx = (h + 1) * BH + 60;
    zoomTo = Math.min(1, (H - 150) / towerPx);
    camTo = 0;
    if(RM){ zoom = zoomTo; cam = 0; }
    var passed = MARKS.filter(function(m){ return h >= m.f; }).pop();
    endTimer = setTimeout(function(){
      ending = false;
      api.roundOver(h, (h * M_PER_FLOOR) + " metres. " + (passed ? "Higher than " + passed.n + "." : h >= 3 ? "Not quite Nelson's Column. Again?" : "Shaky foundations. Again?"));
    }, RM ? 900 : 2400);
  }

  /* ---------- drawing ---------- */
  function draw(){
    var view = Math.max(0, cam / BH);
    var g = sky(view + 6);
    var grd = cx.createLinearGradient(0, 0, 0, H); grd.addColorStop(0, g.top); grd.addColorStop(1, g.bot);
    cx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx.fillStyle = grd; cx.fillRect(0, 0, W, H);
    /* stars fade in high up */
    var sa = Math.max(0, Math.min(1, (view - 55) / 25));
    if(sa > 0){ stars.forEach(function(s){ cx.globalAlpha = sa * (.5 + .5 * Math.sin(t * 2 + s.p)); cx.fillStyle = "#fff"; cx.fillRect(s.x * W, s.y * H, s.r, s.r); }); cx.globalAlpha = 1; }
    if(view > 85){ var pa = Math.min(1, (view - 85) / 15); cx.globalAlpha = pa; cx.fillStyle = "#ff8a5c"; cx.beginPath(); cx.arc(W * .82, H * .2, Math.min(W, H) * .09, 0, 7); cx.fill(); cx.fillStyle = "rgba(0,0,0,.18)"; cx.beginPath(); cx.arc(W * .84, H * .19, Math.min(W, H) * .07, 0, 7); cx.fill(); cx.globalAlpha = 1; }

    cx.save();
    var sx = shake ? (Math.random() - .5) * shake : 0, sy = shake ? (Math.random() - .5) * shake : 0;
    cx.translate(W / 2 + sx, H - 40 + sy); cx.scale(zoom, zoom); cx.translate(-W / 2, -(H - 40));

    /* blueprint grid near the ground, fading as you climb */
    var ga = Math.max(0, .1 - view / 300);
    if(ga > 0){ cx.strokeStyle = "rgba(58,208,255," + ga + ")"; cx.lineWidth = 1; var step = 28, off = (cam % step);
      for(var gx = 0; gx < W; gx += step){ cx.beginPath(); cx.moveTo(gx + .5, -H * 4); cx.lineTo(gx + .5, H); cx.stroke(); }
      for(var gy = off - step; gy < H; gy += step){ cx.beginPath(); cx.moveTo(0, gy + .5); cx.lineTo(W, gy + .5); cx.stroke(); } }
    /* clouds, by floor */
    clouds.forEach(function(c){
      var cy = yOf(Math.round(c.f)), x = ((c.x * (W + 200) + t * 12 * c.s) % (W + 200)) - 100;
      if(cy < -200 / zoom || cy > H + 100) return;
      cx.fillStyle = "rgba(255,255,255,.55)";
      [[0, 0, 34], [30, -10, 26], [-28, -6, 24], [56, 4, 20]].forEach(function(o){ cx.beginPath(); cx.arc(x + o[0] * c.s, cy + o[1] * c.s, o[2] * c.s, 0, 7); cx.fill(); });
    });
    /* the city */
    var ground = H - 40 + cam;
    city.forEach(function(b){
      cx.fillStyle = "#081c30"; cx.fillRect(b.x, ground - b.h, b.w, b.h);
      cx.fillStyle = "rgba(255,210,63,.55)";
      for(var wy = ground - b.h + 8; wy < ground - 8; wy += 14) for(var wx = b.x + 6; wx < b.x + b.w - 6; wx += 12){ if(((wx * 7 + wy * 13) % 10) / 10 < b.lit * .6) cx.fillRect(wx, wy, 5, 7); }
    });
    cx.fillStyle = "#103350"; cx.fillRect(-W, ground, W * 3, 40 + Math.max(0, -cam) + H * 4);

    /* landmark lines across the sky (labels go on top of the tower, below) */
    MARKS.forEach(function(m){
      var my = yOf(m.f); if(my < -60 / zoom || my > H + 20) return;
      cx.strokeStyle = floors() >= m.f ? "rgba(255,210,63,.7)" : "rgba(241,248,255,.3)"; cx.setLineDash([4, 5]); cx.lineWidth = 1.5;
      cx.beginPath(); cx.moveTo(W * .45, my); cx.lineTo(W - 6, my); cx.stroke(); cx.setLineDash([]);
    });
    /* the best flag */
    var best = bestAtStart;
    if(best > 0){
      var by = yOf(best);
      if(by > -60 / zoom && by < H + 20){
        cx.strokeStyle = passedBest ? "rgba(198,240,60,.35)" : "#c6f03c"; cx.lineWidth = 2; if(!RM && !passedBest){ cx.shadowColor = "#c6f03c"; cx.shadowBlur = 12; }
        cx.setLineDash([10, 6]); cx.beginPath(); cx.moveTo(6, by); cx.lineTo(W * .62, by); cx.stroke(); cx.setLineDash([]); cx.shadowBlur = 0;
        cx.fillStyle = passedBest ? "rgba(198,240,60,.5)" : "#c6f03c"; cx.beginPath(); cx.moveTo(8, by); cx.lineTo(8, by - 22); cx.lineTo(28, by - 16); cx.lineTo(8, by - 10); cx.fill();
        cx.textAlign = "left"; cx.font = "800 12px Arial,sans-serif"; cx.fillText("BEST " + best, 32, by - 8);
      }
    }

    tower.forEach(function(b, i){ block(b.x, yOf(i), b.w, b.c, i === tower.length - 1, b.gold); });
    if(mover) block(mover.x, yOf(tower.length), mover.w, mover.c, true, mover.gold);
    rings.forEach(function(r){ cx.strokeStyle = r.c; cx.globalAlpha = 1 - r.k; cx.lineWidth = 3; var e = r.k * 22; cx.strokeRect(r.x - e, r.y - e, r.w + e * 2, BH - 3 + e * 2); cx.globalAlpha = 1; });
    bits.forEach(function(p){ cx.save(); cx.translate(p.x + p.w / 2, p.y + BH / 2); cx.rotate(p.r); cx.globalAlpha = .8; block(-p.w / 2, -BH / 2, p.w, p.c, false, p.gold); cx.restore(); });
    cx.textAlign = "right"; cx.font = "700 11px Arial,sans-serif";
    MARKS.forEach(function(m){
      var my = yOf(m.f); if(my < -60 / zoom || my > H + 20) return;
      var got = floors() >= m.f, label = cap(m.n) + " " + m.m + " m", tw = cx.measureText(label).width + 12;
      cx.fillStyle = "rgba(4,12,24,.72)"; cx.fillRect(W - 6 - tw, my - 17, tw, 15);
      cx.fillStyle = got ? "#ffd23f" : "rgba(241,248,255,.85)"; cx.fillText(label, W - 12, my - 6);
    });
    sparks.forEach(function(p){ cx.globalAlpha = Math.max(0, Math.min(1, p.life * 2)); cx.fillStyle = p.c; cx.fillRect(p.x, p.y, p.s, p.s); }); cx.globalAlpha = 1;
    cx.restore();

    if(slow > 0){ cx.fillStyle = "rgba(58,208,255,.08)"; cx.fillRect(0, 0, W, H); }
    if(flash > 0){ cx.fillStyle = "rgba(198,240,60," + (flash * .1) + ")"; cx.fillRect(0, 0, W, H); }

    /* the numbers */
    var fl = tower ? floors() : 0;
    cx.textAlign = "left"; cx.fillStyle = "#f1f8ff"; cx.font = "800 34px Arial,sans-serif";
    cx.fillText(String(fl), 16, 44);
    cx.font = "700 13px Arial,sans-serif"; cx.fillStyle = "rgba(241,248,255,.8)";
    cx.fillText(fl * M_PER_FLOOR + " m  |  Best " + api.best(), 16, 64);
    var next = MARKS.filter(function(m){ return m.f > fl; })[0];
    if(next && live){ cx.fillStyle = "rgba(241,248,255,.6)"; cx.fillText("Next: " + next.n + " in " + (next.f - fl), 16, 82); }
    /* combo pips */
    if(live){
      cx.textAlign = "right"; cx.font = "800 11px Arial,sans-serif"; cx.fillStyle = "rgba(241,248,255,.75)"; cx.fillText(slow > 0 ? "SLOW MO " + slow : "COMBO", W - 16, 24);
      for(var i = 0; i < 5; i++){ cx.fillStyle = i < Math.min(5, clean) ? NEON[i % 4] : "rgba(241,248,255,.18)"; cx.fillRect(W - 16 - (5 - i) * 14, 32, 10, 10); }
      if(curve){ cx.fillStyle = "#ff4f8b"; cx.font = "800 12px Arial,sans-serif"; cx.fillText(curve.n.toUpperCase(), W - 16, 60); }
    }
    if(toast){ cx.globalAlpha = Math.min(1, toast.t * 3); cx.textAlign = "center"; cx.font = "800 22px Arial,sans-serif"; cx.fillStyle = "#c6f03c"; cx.fillText(toast.text, W / 2, banner ? 190 : 124); cx.globalAlpha = 1; }
    if(banner){
      var k = Math.min(1, banner.t * 2, (2.2 - banner.t) * 6);
      cx.globalAlpha = Math.max(0, k);
      cx.fillStyle = "rgba(4,12,24,.82)"; cx.fillRect(0, 92, W, 70);
      cx.textAlign = "center"; cx.fillStyle = banner.col; cx.font = "800 " + Math.min(24, W / 14) + "px Arial,sans-serif"; cx.fillText(banner.big, W / 2, 124, W - 16);
      cx.fillStyle = "rgba(241,248,255,.85)"; cx.font = "700 12px Arial,sans-serif"; cx.fillText(banner.small, W / 2, 148, W - 16);
      cx.globalAlpha = 1;
    }
    if(live && tower.length === 1){
      cx.textAlign = "center"; cx.font = "700 15px Arial,sans-serif"; cx.fillStyle = "rgba(241,248,255,.85)";
      cx.fillText("Tap to drop", W / 2, H - 14);
    }
  }
  function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

  function block(x, y, w, c, glow, gold){
    var col = gold ? GOLD : NEON[c % NEON.length];
    cx.save();
    if(glow && !RM){ cx.shadowColor = col; cx.shadowBlur = gold ? 26 : 18; }
    cx.fillStyle = col; cx.fillRect(x, y, w, BH - 3);
    cx.shadowBlur = 0;
    cx.fillStyle = "rgba(255,255,255,.28)"; cx.fillRect(x, y, w, 3);
    cx.fillStyle = "rgba(0,0,0,.18)"; cx.fillRect(x, y + BH - 7, w, 4);
    if(gold){ cx.fillStyle = "rgba(255,255,255,.55)"; var s = (t * 120) % (w + 40) - 20; cx.fillRect(x + Math.max(0, s), y + 3, Math.min(10, Math.max(0, w - s)), BH - 9); }
    cx.restore();
  }

  function down(e){ if(!live) return; if(e && e.cancelable) e.preventDefault(); drop(); }
  function key(e){ if(!live) return; if(e.code === "Space" || e.key === " " || e.key === "Enter"){ e.preventDefault(); if(!e.repeat) drop(); } }
  cv.addEventListener("pointerdown", down);
  window.addEventListener("keydown", key);
  window.addEventListener("resize", size);
  size(); setup(); mover = null; draw();
  /* for automated testing only (the page address has ?hqtest) */
  if(/hqtest/.test(location.search)) window.__neon = { peek:function(){ return tower && mover ? { mx:mover.x, mw:mover.w, tx:tower[tower.length - 1].x, tw:tower[tower.length - 1].w, f:floors(), live:live } : { live:live }; }, drop:drop };

  return {
    start: start,
    stop: function(){
      live = false; ending = false; clearTimeout(endTimer); cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("keydown", key);
    }
  };
}
})();
