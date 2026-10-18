/* ==========================================================
   EGW's GCSE HQ - Dunk
   A short break game for EGW's HQ. Hold to dunk a biscuit in a
   mug of tea, let go to lift it out. The longer it soaks the more
   it scores, but leave it too long and half of it ends up in the
   tea. Five biscuits a round.

   Earning goes, the break clock and the cooldown all live in
   /data/hqbreak.js (change the numbers there).
   Home page only:  <script src="/data/hqbreak.js?v=1"></script>
                    <script src="/egw/dunk.js?v=1"></script>
   Saves in b5.egw.dunk.v1. ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(!window.HQBreak) return;
var PREFIX = (window.HQ && window.HQ.prefix) || "b5.egw.";
if(PREFIX !== "b5.egw.") return;   /* EGW's space only */

var BISCUITS = [
  { name: "Digestive",            rate: .30, base: "#d9a35e", edge: "#b98443", dots: true },
  { name: "Rich Tea",             rate: .46, base: "#e8c48a", edge: "#c9a066", dots: true, thin: true },
  { name: "Hobnob",               rate: .21, base: "#c58a4a", edge: "#9c6a33", oats: true },
  { name: "Chocolate digestive",  rate: .26, base: "#d9a35e", edge: "#b98443", choc: true },
  { name: "Custard cream",        rate: .38, base: "#f0cf7a", edge: "#cfa94f", cream: true }
];
var PER_ROUND = 5;

var ICON = '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="9" y="17" width="18" height="17" rx="3" fill="#ff5d5d"/><path d="M27 21h3a4 4 0 0 1 0 8h-3" fill="none" stroke="#ff5d5d" stroke-width="3"/><rect x="10" y="18" width="16" height="4" fill="#9b5a2a"/><circle cx="19" cy="11" r="8" fill="#d9a35e" stroke="#b98443" stroke-width="2"/><circle cx="16" cy="9" r="1" fill="#9c6a33"/><circle cx="21" cy="12" r="1" fill="#9c6a33"/><circle cx="20" cy="7" r="1" fill="#9c6a33"/></svg>';

window.HQBreak({
  id: "dunk",
  title: "Dunk",
  prefix: PREFIX,
  icon: ICON,
  theme: { bg: "#11162b", ink: "#eef0ff", card: "#eef0ff", cardInk: "#141a33", accent: "#ffd23f", accent2: "#19c39a", font: 'var(--display,"Space Grotesk",Arial,sans-serif)' },
  words: {
    how: "Hold anywhere to dunk. Let go to lift it out. The soggier it gets the more it scores, but push it too far and it drops in. Five biscuits.",
    earn: "Anything counts, even Show me.",
    coolingTitle: "The kettle is reboiling",
    cooling: "Have a crack at something else in the meantime.",
    coolingShort: "Kettle reboiling.",
    done: "Mug rinsed."
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

  /* stars, fixed for the whole visit */
  var stars = [];
  for(var i = 0; i < 46; i++) stars.push({ x: Math.random(), y: Math.random() * .55, r: Math.random() * 1.6 + .4, p: Math.random() * 6 });

  var live = false, holding = false, raf = 0, last = 0, t = 0;
  var n, total, b, depth, soak, breakAt, phase, msg, msgT, crumbs, ripples, scored, perfectRun;

  function newBiscuit(){
    b = BISCUITS[Math.floor(Math.random() * BISCUITS.length)];
    depth = 0; soak = 0; breakAt = .86 + Math.random() * .14; phase = "in"; scored = false;
  }
  function start(){
    n = 1; total = 0; crumbs = []; ripples = []; msg = ""; msgT = 0; perfectRun = 0;
    newBiscuit(); phase = "in"; depth = -1;   /* slides in from above */
    live = true; holding = false; last = 0;
    cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  }

  function say(m){ msg = m; msgT = 1.8; }

  function frame(ts){
    var dt = last ? Math.min(.05, (ts - last) / 1000) : 0; last = ts; t += dt;
    update(dt); draw();
    if(live) raf = requestAnimationFrame(frame);
  }

  /* geometry, worked out from the canvas size every frame */
  function geo(){
    var mugW = Math.min(W * .58, 270), mugH = mugW * .78;
    var surf = H * .66;
    var R = mugW * .3;
    return { mugW: mugW, mugH: mugH, mx: W / 2, surf: surf, R: R, top: surf - R * 2.4, bottom: surf + R * .25 };
  }

  function update(dt){
    var g = geo();
    msgT = Math.max(0, msgT - dt);
    crumbs.forEach(function(c){ c.vy += 500 * dt; c.x += c.vx * dt; c.y += c.vy * dt; });
    crumbs = crumbs.filter(function(c){ return c.y < g.surf; });
    ripples.forEach(function(r){ r.a += dt; });
    ripples = ripples.filter(function(r){ return r.a < 1.2; });

    if(phase === "in"){
      depth += dt * 2.2;
      if(depth >= 0){ depth = 0; phase = "ready"; }
      return;
    }
    if(phase === "gone"){
      depth -= dt * 2.4;
      if(depth < -1.2) next();
      return;
    }
    if(phase === "ready" || phase === "dunking"){
      /* depth runs 0 (hovering) to 1 (as far down as it goes) */
      if(holding){ depth = Math.min(1, depth + dt * 1.8); phase = "dunking"; }
      else depth = Math.max(0, depth - dt * 2.6);
      var wet = depth > .42 ? (depth - .42) / .58 : 0;   /* how much of it is under */
      if(wet > 0){
        soak += b.rate * (.35 + wet) * dt;
        if(soak > .7 && Math.random() < dt * (soak * 10)) crumb(g);
      }
      if(soak >= breakAt){ snap(g); return; }
      if(phase === "dunking" && depth === 0 && !holding){
        score();
      }
    }
  }

  function crumb(g){
    var bx = g.mx + (Math.random() - .5) * g.R * 1.4;
    crumbs.push({ x: bx, y: biscuitY(g) + g.R * .9, vx: (Math.random() - .5) * 40, vy: 20, r: 1.5 + Math.random() * 2 });
  }
  function biscuitY(g){ return g.top + (g.bottom - g.top) * Math.max(0, depth); }

  function snap(g){
    phase = "gone"; perfectRun = 0;
    ripples.push({ x: g.mx, a: 0 });
    for(var k = 0; k < 14; k++) crumb(g);
    api.beep(140, .35, "sine", .18);
    say(b.name + " lost to the tea. 0");
  }

  function score(){
    if(soak < .05){ phase = "ready"; return; }   /* barely touched it, no harm done */
    var pts = Math.round(soak * 100), line = "";
    if(soak >= .72){ pts += 25; perfectRun++; line = "Perfect dunk"; api.beep(880, .12, "triangle"); setTimeout(function(){ api.beep(1320, .16, "triangle"); }, 90); }
    else if(soak >= .45){ line = "Nicely dunked"; api.beep(660, .12, "triangle"); perfectRun = 0; }
    else { line = "A bit timid"; api.beep(440, .1, "triangle"); perfectRun = 0; }
    total += pts;
    say(line + ". +" + pts);
    phase = "gone"; scored = true;
  }

  function next(){
    if(n >= PER_ROUND){
      live = false; draw();
      var line = total >= 450 ? "That is a proper dunker." : total >= 300 ? "Solid tea work." : "The tea won that one. Next time.";
      api.roundOver(total, line);
      return;
    }
    n++; newBiscuit(); phase = "in"; depth = -1;
  }

  /* ---------- drawing ---------- */
  function draw(){
    var g = geo();
    cx.clearRect(0, 0, W, H);
    var sky = cx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#141a46"); sky.addColorStop(.7, "#262f57"); sky.addColorStop(1, "#11162b");
    cx.fillStyle = sky; cx.fillRect(0, 0, W, H);
    stars.forEach(function(s){
      cx.globalAlpha = api.reduced ? .8 : .45 + .45 * Math.sin(t * 1.6 + s.p);
      cx.fillStyle = "#eef0ff"; cx.beginPath(); cx.arc(s.x * W, s.y * H, s.r, 0, 7); cx.fill();
    });
    cx.globalAlpha = 1;
    cx.fillStyle = "#fff6cf"; cx.beginPath(); cx.arc(W * .82, H * .12, 22, 0, 7); cx.fill();
    cx.fillStyle = "#262f57"; cx.beginPath(); cx.arc(W * .82 + 9, H * .12 - 5, 19, 0, 7); cx.fill();

    /* table */
    cx.fillStyle = "#3a2c4f"; cx.fillRect(0, g.surf + g.mugH * .78, W, H);

    /* mug back and tea */
    var mx = g.mx, mw = g.mugW, top = g.surf - 6, mh = g.mugH;
    cx.fillStyle = "#c94848"; roundRect(mx - mw / 2, top, mw, mh, 18); cx.fill();
    cx.strokeStyle = "#ff5d5d"; cx.lineWidth = 12; cx.beginPath();
    cx.arc(mx + mw / 2 + 4, top + mh * .45, mh * .24, -1.3, 1.3); cx.stroke();
    cx.fillStyle = "#8a4f22"; cx.beginPath(); cx.ellipse(mx, g.surf + 4, mw / 2 - 6, 16, 0, 0, 7); cx.fill();
    cx.fillStyle = "#a8642f"; cx.beginPath(); cx.ellipse(mx, g.surf + 2, mw / 2 - 16, 10, 0, 0, 7); cx.fill();
    ripples.forEach(function(r){
      cx.strokeStyle = "rgba(255,230,190," + (1 - r.a / 1.2) + ")"; cx.lineWidth = 2;
      cx.beginPath(); cx.ellipse(r.x, g.surf, 10 + r.a * 80, 3 + r.a * 7, 0, 0, 7); cx.stroke();
    });

    /* steam */
    if(!api.reduced){
      cx.strokeStyle = "rgba(238,240,255,.18)"; cx.lineWidth = 4; cx.lineCap = "round";
      for(var s = -1; s <= 1; s++){
        cx.beginPath();
        for(var yy = 0; yy < 70; yy += 6){
          var x = mx + s * 30 + Math.sin(t * 2 + yy * .08 + s) * 7;
          var y = g.surf - 20 - yy - ((t * 18) % 12);
          if(yy === 0) cx.moveTo(x, y); else cx.lineTo(x, y);
        }
        cx.stroke();
      }
    }

    /* biscuit, behind the front of the mug */
    if(depth > -1.15) drawBiscuit(g);

    /* mug front rim so the biscuit looks like it is in the tea */
    cx.save();
    cx.beginPath(); cx.rect(mx - mw / 2 - 2, g.surf + 9, mw + 4, mh); cx.clip();
    cx.fillStyle = "#e05252"; roundRect(mx - mw / 2, top, mw, mh, 18); cx.fill();
    cx.fillStyle = "rgba(255,255,255,.12)"; cx.fillRect(mx - mw / 2 + 14, g.surf + 10, 12, mh - 34);
    cx.restore();
    cx.fillStyle = "#eef0ff"; cx.font = "800 15px Arial,sans-serif"; cx.textAlign = "center";
    cx.fillText("EGW", mx, g.surf + mh * .5);

    crumbs.forEach(function(c){ cx.fillStyle = b.edge; cx.beginPath(); cx.arc(c.x, c.y, c.r, 0, 7); cx.fill(); });

    /* sog-o-meter */
    var mx2 = W - 34, my = H * .2, mhh = H * .42;
    cx.fillStyle = "rgba(255,255,255,.1)"; roundRect(mx2, my, 16, mhh, 8); cx.fill();
    cx.fillStyle = "rgba(25,195,154,.45)"; cx.fillRect(mx2, my + mhh * (1 - .86), 16, mhh * (.86 - .72));
    var lvl = Math.min(1, soak);
    cx.fillStyle = lvl > .86 ? "#ff5d5d" : lvl >= .72 ? "#19c39a" : "#ffd23f";
    roundRect(mx2, my + mhh * (1 - lvl), 16, mhh * lvl, 8); cx.fill();
    cx.save(); cx.translate(mx2 - 8, my + mhh / 2); cx.rotate(-Math.PI / 2);
    cx.fillStyle = "rgba(238,240,255,.7)"; cx.font = "700 11px Arial,sans-serif"; cx.textAlign = "center";
    cx.fillText("SOG-O-METER", 0, 0); cx.restore();

    /* words */
    cx.textAlign = "left"; cx.fillStyle = "#eef0ff";
    cx.font = "800 30px Arial,sans-serif"; cx.fillText(String(total || 0), 16, 40);
    cx.font = "700 13px Arial,sans-serif"; cx.fillStyle = "rgba(238,240,255,.75)";
    cx.fillText("Biscuit " + (n || 1) + " of " + PER_ROUND + (b ? "   |   " + b.name : ""), 16, 60);
    if(msgT > 0){
      cx.globalAlpha = Math.min(1, msgT * 2);
      cx.font = "800 20px Arial,sans-serif"; cx.textAlign = "center"; cx.fillStyle = "#ffd23f";
      cx.fillText(msg, W / 2, H * .2);
      cx.globalAlpha = 1;
    }
    if(live && phase === "ready" && n === 1 && soak === 0){
      cx.font = "700 15px Arial,sans-serif"; cx.textAlign = "center"; cx.fillStyle = "rgba(238,240,255,.85)";
      cx.fillText("Hold to dunk. Let go to lift.", W / 2, H - 22);
    }
  }

  function drawBiscuit(g){
    var R = g.R, x = g.mx, y = biscuitY(g);
    if(phase === "in" || phase === "gone") y = g.top + (g.bottom - g.top) * Math.max(-1.2, depth);
    var wob = (!api.reduced && soak > .78) ? Math.sin(t * 30) * (soak - .78) * 10 : 0;
    cx.save();
    cx.translate(x + wob, y);
    if(phase === "gone" && !scored){
      /* only the top half made it out */
      cx.beginPath(); cx.rect(-R - 4, -R - 4, 2 * R + 8, R + 2); cx.clip();
    }
    cx.fillStyle = b.edge; cx.beginPath(); cx.arc(0, 0, R, 0, 7); cx.fill();
    cx.fillStyle = b.base; cx.beginPath(); cx.arc(0, 0, R - (b.thin ? 3 : 5), 0, 7); cx.fill();
    if(b.choc){ cx.fillStyle = "#5a3418"; cx.beginPath(); cx.arc(0, 0, R - 8, Math.PI * 1.05, Math.PI * 1.95); cx.fill(); }
    if(b.cream){ cx.fillStyle = "#fff2c8"; cx.fillRect(-R + 4, -3, 2 * R - 8, 6); }
    if(b.dots || b.choc){
      cx.fillStyle = b.edge;
      [[-.4,-.3],[.3,-.35],[0,.05],[-.3,.35],[.35,.3],[.05,-.6]].forEach(function(d){ cx.beginPath(); cx.arc(d[0] * R, d[1] * R, 2.2, 0, 7); cx.fill(); });
    }
    if(b.oats){
      cx.strokeStyle = "#e6c18a"; cx.lineWidth = 2;
      for(var k = 0; k < 9; k++){ var a = k * 2.4, rr = R * .6 * ((k % 3) + 1) / 3; cx.beginPath(); cx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); cx.lineTo(Math.cos(a) * rr + 6, Math.sin(a) * rr + 2); cx.stroke(); }
    }
    /* the soaked part goes dark from the bottom up */
    if(soak > 0){
      var h = Math.min(1, soak) * R * 1.1;
      cx.save(); cx.beginPath(); cx.arc(0, 0, R, 0, 7); cx.clip();
      cx.fillStyle = "rgba(90,45,15,.55)"; cx.fillRect(-R, R - h, 2 * R, h);
      cx.restore();
    }
    if(soak > .62){
      cx.strokeStyle = "rgba(70,35,10,.8)"; cx.lineWidth = 2;
      cx.beginPath(); cx.moveTo(-R * .7, R * .1); cx.lineTo(-R * .2, R * .25); cx.lineTo(R * .1, R * .12); cx.lineTo(R * .6, R * .3); cx.stroke();
    }
    cx.restore();
  }

  function roundRect(x, y, w, h, r){
    cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r);
    cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath();
  }

  /* ---------- input: hold anywhere, or hold space ---------- */
  function down(e){ if(!live) return; holding = true; if(e && e.cancelable) e.preventDefault(); }
  function up(){ holding = false; }
  function key(e){ if(!live) return; if(e.code === "Space" || e.key === " "){ if(e.type === "keydown"){ if(!e.repeat) down(e); } else up(); e.preventDefault(); } }
  cv.addEventListener("pointerdown", down);
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);
  window.addEventListener("keydown", key);
  window.addEventListener("keyup", key);
  t = 0; soak = 0; b = BISCUITS[0]; n = 1; total = 0; depth = 0; phase = "ready"; crumbs = []; ripples = []; msgT = 0;
  draw();

  return {
    start: start,
    stop: function(){
      live = false; cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("keydown", key);
      window.removeEventListener("keyup", key);
    }
  };
}
})();
