/* Snag sprites: all character art for the game lives here, drawn in code.
   Swap or redraw anything in this file to raise the art quality later;
   the engine only calls B5SPRITES.draw / weapon / tip / proj / portal / text. */
(function () {
  'use strict';
  var S = {};
  var g = null, OX = 0, OY = 0;

  var D = '#2e3a17', K = '#8aa64a', BL = '#b5c96f', M = '#3a1414', W = '#ffffff',
      P = '#1d1d24', PL = '#f2d1a8', Y = '#f5e04a', WD = '#9b6a3a', WK = '#6e4622',
      BN = '#f3ecd8', MT = '#59606a', CY = '#37c8dc', CYL = '#bff3fa', OR = '#ef7724',
      FU = '#8b5a2b', FD = '#5e3a17', PT = '#6b7480', GL = '#2b3038',
      LB = '#2c5ca8', AU = '#f0c446', AD = '#b8861e', LN = '#f4efe4', LN2 = '#d8cfbd', CU = '#c8874a', BZ = '#d9a441', TQ = '#3fb8a8';

  function r(a, b, w, h, c) { g.fillStyle = c; g.fillRect(OX + a, OY + b, w, h); }
  function e(cx, cy, rx, ry, c) {
    g.fillStyle = c;
    for (var y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      var x0 = null, x1 = null;
      for (var x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        var dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry;
        if (dx * dx + dy * dy <= 1) { if (x0 === null) x0 = x; x1 = x; }
      }
      if (x0 !== null) g.fillRect(OX + x0, OY + y, x1 - x0 + 1, 1);
    }
  }

  /* Local sprite space: 24 wide, feet on row 24, body centre line at x = 12, facing right.
     Light comes from the top left, so shadows sit low and to the right. */
  var KS = '#668236', KL = '#a9c45e', SP2 = '#6f8a3a', EI = '#d98a80', TG = '#e0707a', FT = '#334818';

  /* filled triangle, pixel centres inside the three edges */
  function tri(ax, ay, bx, by, cx, cy, c) {
    var x0 = Math.floor(Math.min(ax, bx, cx)), x1 = Math.ceil(Math.max(ax, bx, cx));
    var y0 = Math.floor(Math.min(ay, by, cy)), y1 = Math.ceil(Math.max(ay, by, cy));
    var area = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    if (!area) return;
    g.fillStyle = c;
    for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) {
      var px0 = x + 0.5, py0 = y + 0.5;
      var w0 = ((bx - px0) * (cy - py0) - (by - py0) * (cx - px0)) / area;
      var w1 = ((cx - px0) * (ay - py0) - (cy - py0) * (ax - px0)) / area;
      var w2 = 1 - w0 - w1;
      if (w0 >= -0.02 && w1 >= -0.02 && w2 >= -0.02) g.fillRect(OX + x, OY + y, 1, 1);
    }
  }
  function shrink(p, k) {
    var cx = (p[0] + p[2] + p[4]) / 3, cy = (p[1] + p[3] + p[5]) / 3;
    return [cx + (p[0] - cx) * k, cy + (p[1] - cy) * k, cx + (p[2] - cx) * k, cy + (p[3] - cy) * k, cx + (p[4] - cx) * k, cy + (p[5] - cy) * k];
  }
  /* a pointy gremlin ear: side -1 is the left ear, 1 the right. lift: 'up', 'mid', 'down' or 'back' */
  function ear(side, lift, hy) {
    var tip = { up: [0.5, 2.5], mid: [-0.5, 7.5], down: [0.5, 14.5], back: [1.5, 5.5] }[lift] || [-0.5, 7.5];
    var bx = 7, p = [bx, 8 + hy, bx, 13 + hy, tip[0], tip[1] + hy];
    if (side > 0) p = [24 - p[0], p[1], 24 - p[2], p[3], 24 - p[4], p[5]];
    tri(p[0], p[1], p[2], p[3], p[4], p[5], D);
    var q = shrink(p, 0.62); tri(q[0], q[1], q[2], q[3], q[4], q[5], K);
    var s = shrink(p, 0.32); tri(s[0], s[1], s[2], s[3], s[4], s[5], EI);
  }
  function hand(x, y) { r(x, y, 2, 2, D); r(x, y, 1, 1, K); }

  function body(pose, f, bl, era, look, sq) {
    var air = pose === 'jump';
    var wild = pose === 'panic' || pose === 'fall' || pose === 'drown';
    var tense = pose === 'charge' || pose === 'swing' || pose === 'dig';
    var walk = pose === 'walk', idle = pose === 'idle';
    look = look || 0; sq = sq || 0;

    /* whole body bob, head offset (squash and stretch, breathing) */
    var bob = 0, hy = 0;
    if (walk && f % 2 === 1) bob = -1;
    if (pose === 'cheer' && f % 2) bob = -1;
    if (idle && (f === 1 || f === 2)) hy = -1;
    if (sq < 0) hy += 1;
    if (sq > 0) hy -= 1;
    OY += bob;

    /* ears: they say a lot about how a Snag feels */
    var earL = 'mid', earR = 'mid';
    if (pose === 'cheer' || air || pose === 'aim') { earL = 'up'; earR = 'up'; }
    else if (wild || pose === 'hurt') { earL = 'down'; earR = 'down'; }
    else if (tense) { earL = 'back'; earR = 'back'; }
    else if (pose === 'yawn') { earL = 'down'; earR = 'down'; }
    else if (idle && f === 3) earR = 'up';
    else if (walk) { earL = f % 2 ? 'back' : 'mid'; earR = f % 2 ? 'back' : 'mid'; }

    if (era === 'fut') {
      var flame = air || pose === 'cheer';
      r(2, 16, 3, 6, MT); r(2, 16, 1, 6, '#7d8592');
      r(2, 22, 3, 1, flame && f % 2 ? '#ffd27a' : OR);
      if (flame) r(3, 23, 1, 1 + (f % 2), '#ffd27a');
    }

    ear(-1, earL, hy); ear(1, earR, hy);

    /* body: outline, shadow, base, belly */
    var brx = sq < 0 ? 6.4 : (sq > 0 ? 5.4 : 5.9), bry = sq < 0 ? 4.5 : (sq > 0 ? 5.3 : 4.9);
    e(12, 20, brx, bry, D); e(12, 20, brx - 1, bry - 1, KS); e(11.4, 19.4, brx - 1.6, bry - 1.6, K);
    e(12, 21.2, 2.8, 2.1, BL);

    /* head: outline, shadow, base, highlight, a few spots */
    e(12, 11.5 + hy, 7.7, 6.3, D); e(12, 11.5 + hy, 6.7, 5.3, KS); e(11.2, 10.8 + hy, 6.1, 4.7, K);
    e(8.6, 7.9 + hy, 2.4, 1.1, KL); r(7, 9 + hy, 1, 1, KL);
    r(15, 6 + hy, 1, 1, SP2); r(17, 8 + hy, 1, 1, SP2); r(16, 7 + hy, 1, 1, SP2); r(18, 12 + hy, 1, 1, SP2);
    /* a little nose */
    r(11, 13 + hy, 1, 1, SP2); r(13, 13 + hy, 1, 1, SP2);

    if (era === 'pre') {
      e(12, 21, 4.8, 3.6, FU); e(11, 20.4, 3.6, 2.4, '#9c6a38');
      r(10, 20, 1, 1, FD); r(14, 22, 1, 1, FD); r(12, 19, 1, 1, FD); r(9, 23, 1, 1, FD); r(15, 20, 1, 1, FD);
    }
    if (era === 'fut') { e(12, 21, 4, 3.2, PT); r(10, 19, 3, 1, '#8a94a0'); r(9, 21, 7, 1, CY); r(12, 19, 1, 1, OR); }
    if (era === 'egypt') {
      e(12, 22.4, 4.7, 2.3, LN); r(12, 22, 1, 3, LN2); r(14, 23, 2, 1, LN2); r(8, 21, 9, 1, AU);
      r(8, 17, 9, 1, AU); r(7, 18, 11, 1, LB); r(8, 19, 9, 1, AU); r(9, 18, 1, 1, TQ); r(12, 18, 1, 1, TQ); r(15, 18, 1, 1, TQ);
    }

    /* brows */
    var by0 = hy;
    if (wild) { r(7, 6 + by0, 3, 1, D); r(14, 6 + by0, 3, 1, D); }
    else if (tense) { r(7, 7 + by0, 2, 1, D); r(9, 8 + by0, 1, 1, D); r(15, 7 + by0, 2, 1, D); r(14, 8 + by0, 1, 1, D); }
    else if (pose === 'hurt' || pose === 'yawn') { r(8, 7 + by0, 2, 1, D); r(7, 8 + by0, 1, 1, D); r(14, 7 + by0, 2, 1, D); r(16, 8 + by0, 1, 1, D); }
    else if (pose === 'aim') { r(7, 8 + by0, 3, 1, D); r(14, 7 + by0, 3, 1, D); }
    else { r(7, 7 + by0, 3, 1, D); r(14, 8 + by0, 3, 1, D); }

    /* eyes: pupils sit forward and follow the aim up or down */
    var py = 10 + hy + (look < 0 ? -1 : (look > 0 ? 1 : 0));
    if (pose === 'cheer') {
      r(7, 11 + hy, 1, 1, D); r(8, 10 + hy, 1, 1, D); r(9, 11 + hy, 1, 1, D);
      r(14, 11 + hy, 1, 1, D); r(15, 10 + hy, 1, 1, D); r(16, 11 + hy, 1, 1, D);
    } else if (pose === 'hurt') {
      r(7, 9 + hy, 1, 1, D); r(8, 10 + hy, 2, 1, D); r(7, 11 + hy, 1, 1, D); r(7, 10 + hy, 1, 1, KS);
      r(16, 9 + hy, 1, 1, D); r(14, 10 + hy, 2, 1, D); r(16, 11 + hy, 1, 1, D); r(16, 10 + hy, 1, 1, KS);
      r(19, 6 + hy, 1, 2, '#7fd0f0'); r(4, 15 + hy, 1, 1, '#fff3c8'); r(3, 14 + hy, 1, 1, '#fff3c8');
    } else if (wild) {
      r(7, 8 + hy, 3, 5, Y); r(8, 10 + hy, 1, 1, P); r(14, 8 + hy, 3, 5, Y); r(15, 10 + hy, 1, 1, P);
      r(7, 13 + hy, 3, 1, KS); r(14, 13 + hy, 3, 1, KS);
      r(19, 5 + hy, 1, 2, '#7fd0f0'); r(19, 7 + hy, 1, 1, '#bfe9f8');
    } else if (bl || pose === 'yawn') {
      r(7, 11 + hy, 3, 1, D); r(14, 11 + hy, 3, 1, D);
    } else {
      r(7, 9 + hy, 3, 4, Y); r(14, 9 + hy, 3, 4, Y);
      r(7, 13 + hy, 3, 1, KS); r(14, 13 + hy, 3, 1, KS);
      r(8, py, 2, 2, P); r(15, py, 2, 2, P);
      r(8, py, 1, 1, W); r(15, py, 1, 1, W);
      if (era === 'egypt') { r(7, 9 + hy, 3, 1, P); r(14, 9 + hy, 3, 1, P); r(6, 10 + hy, 1, 1, P); r(17, 10 + hy, 1, 1, P); }
    }

    /* mouth: a cheeky grin with one fang */
    var my = hy;
    if (wild) { r(10, 14 + my, 3, 3, M); r(11, 15 + my, 1, 2, TG); r(10, 14 + my, 1, 1, W); }
    else if (pose === 'cheer') { r(8, 14 + my, 8, 2, M); r(9, 16 + my, 6, 1, M); r(10, 16 + my, 4, 1, TG); r(9, 14 + my, 1, 1, W); r(14, 14 + my, 1, 1, W); }
    else if (tense) { r(9, 14 + my, 6, 3, M); r(9, 15 + my, 6, 1, W); r(11, 15 + my, 1, 1, '#d9d2c2'); }
    else if (pose === 'hurt') { r(9, 15 + my, 1, 1, M); r(10, 14 + my, 1, 1, M); r(11, 15 + my, 1, 1, M); r(12, 14 + my, 1, 1, M); r(13, 15 + my, 1, 1, M); r(14, 14 + my, 1, 1, M); }
    else if (pose === 'yawn') { r(9, 13 + my, 5, 4, M); r(10, 15 + my, 3, 2, TG); }
    else if (air) { r(11, 14 + my, 2, 3, M); r(11, 16 + my, 2, 1, TG); }
    else if (pose === 'aim') { r(10, 15 + my, 3, 1, M); r(13, 15 + my, 1, 2, TG); }
    else { r(9, 15 + my, 6, 1, M); r(15, 14 + my, 1, 1, M); r(8, 14 + my, 1, 1, M); r(10, 16 + my, 1, 1, W); }

    /* head gear */
    if (era === 'fut') { r(6, 6 + hy, 12, 1, GL); r(8, 5 + hy, 3, 2, CY); r(13, 5 + hy, 3, 2, CY); r(8, 5 + hy, 1, 1, CYL); r(13, 5 + hy, 1, 1, CYL); }
    else if (era === 'pre') { r(13, 7 + hy, 3, 1, PL); r(14, 6 + hy, 1, 3, PL); }
    if (era === 'pre') { r(9, 4 + hy, 6, 1, BN); r(8, 3 + hy, 1, 1, BN); r(8, 5 + hy, 1, 1, BN); r(15, 3 + hy, 1, 1, BN); r(15, 5 + hy, 1, 1, BN); r(10, 4 + hy, 4, 1, '#d8ceb4'); }
    if (era === 'egypt') {
      r(8, 3 + hy, 9, 1, LB); r(7, 4 + hy, 11, 2, LB);
      r(8, 3 + hy, 1, 3, AU); r(11, 3 + hy, 1, 3, AU); r(14, 3 + hy, 1, 3, AU); r(17, 4 + hy, 1, 2, AU);
      r(6, 6 + hy, 13, 1, AU); r(12, 5 + hy, 1, 1, '#d84a3a');
      r(5, 7 + hy, 1, 8, LB); r(5, 9 + hy, 1, 1, AU); r(5, 12 + hy, 1, 1, AU);
      r(19, 7 + hy, 1, 8, LB); r(19, 9 + hy, 1, 1, AU); r(19, 12 + hy, 1, 1, AU);
    }

    /* feet */
    if (air || pose === 'jump') { r(9, 23, 3, 1, D); r(13, 23, 3, 1, D); r(10, 22, 1, 1, FT); }
    else if (walk) {
      var fp = [[[6, 24], [14, 24]], [[9, 24], [12, 23]], [[7, 24], [13, 24]], [[9, 23], [12, 24]]][f % 4];
      r(fp[0][0], fp[0][1], 4, 1, FT); r(fp[0][0], fp[0][1] - 1, 3, 1, D);
      r(fp[1][0], fp[1][1], 4, 1, D); r(fp[1][0], fp[1][1] - 1, 3, 1, D); r(fp[1][0] + 1, fp[1][1] - 1, 1, 1, KS);
    } else if (pose === 'cheer') { r(7, 23, 4, 2, D); r(13, 23, 4, 2, D); r(8, 23, 1, 1, KS); r(14, 23, 1, 1, KS); }
    else { r(8, 23, 4, 2, D); r(13, 23, 4, 2, D); r(9, 23, 1, 1, KS); r(14, 23, 1, 1, KS); }

    /* arms and held kit */
    if (pose === 'cheer') {
      var u = f % 2;
      r(4, 13 - u, 2, 5, D); hand(3, 11 - u); r(18, 13 + u, 2, 5, D); hand(19, 11 + u);
      if (era === 'pre') { r(19, 7 + u, 1, 5, WD); r(18, 4 + u, 3, 3, WK); r(18, 4 + u, 1, 1, '#8c6034'); }
      if (era === 'fut') { r(18, 9 + u, 4, 2, MT); r(22, 9 + u, 1, 2, CY); }
      if (era === 'egypt') { r(19, 6 + u, 1, 7, AU); r(17, 7 + u, 5, 1, AU); r(18, 2 + u, 1, 4, AU); r(20, 2 + u, 1, 4, AU); r(19, 1 + u, 1, 1, AU); r(19, 5 + u, 1, 1, AD); }
    } else if (pose === 'yawn') {
      var v = f % 2;
      r(4, 12 + v, 2, 6, D); hand(3, 10 + v); r(18, 12 + v, 2, 6, D); hand(19, 10 + v);
    } else if (pose === 'hurt') {
      r(6, 18, 2, 3, D); hand(6, 20); r(16, 18, 2, 3, D); hand(16, 20);
    } else if (wild) {
      if (f % 2) { r(4, 14, 2, 4, D); hand(3, 12); r(18, 19, 2, 3, D); hand(19, 21); }
      else { r(4, 19, 2, 3, D); hand(3, 21); r(18, 14, 2, 4, D); hand(19, 12); }
    } else if (air) {
      r(3, 15, 2, 3, D); hand(2, 14); r(19, 15, 2, 3, D); hand(20, 14);
    } else if (pose === 'aim' || pose === 'charge') {
      r(5, 19, 2, 3, D); hand(5, 21); r(17, 17, 4, 2, D); r(20, 16, 1, 1, K);
    } else if (pose === 'swing') {
      r(5, 19, 2, 3, D); hand(5, 21);
      if (f === 0) {
        r(17, 13, 2, 6, D);
        if (era === 'pre') { r(17, 5, 2, 8, WD); r(16, 2, 4, 4, WK); r(16, 2, 1, 1, '#8c6034'); }
        else if (era === 'egypt') { r(17, 10, 2, 3, WK); r(18, 4, 2, 6, BZ); r(19, 2, 2, 3, BZ); r(21, 1, 2, 2, BZ); r(17, 5, 1, 4, AD); }
        else { r(16, 10, 4, 4, CY); r(17, 11, 2, 2, CYL); }
      } else {
        r(17, 18, 5, 2, D);
        if (era === 'pre') { r(21, 17, 7, 2, WD); r(27, 15, 3, 5, WK); }
        else if (era === 'egypt') { r(21, 18, 2, 2, WK); r(23, 17, 5, 2, BZ); r(27, 15, 2, 3, BZ); r(28, 13, 2, 2, BZ); r(24, 19, 3, 1, AD); }
        else { r(22, 16, 4, 4, CY); r(23, 17, 2, 2, CYL); r(26, 17, 2, 1, CYL); r(26, 19, 2, 1, CYL); }
        r(24, 13, 1, 1, '#ffffff'); r(26, 12, 1, 1, '#ffffff');
      }
    } else if (pose === 'dig') {
      var dd = f % 2;
      r(5, 19, 2, 3, D); hand(5, 21); r(17, 20 + dd, 4, 2, D);
      if (era === 'pre') { r(21, 21 + dd, 4, 1, BN); r(24, 19 + dd, 2, 4, BN); }
      else if (era === 'egypt') { r(21, 21 + dd, 5, 1, CU); r(26, 21 + dd, 1, 1, '#f0b07a'); r(18, 16 - dd, 3, 3, WD); }
      else { r(21, 20 + dd, 4, 2, MT); r(25, 20 + dd, 2, 2, CY); r(27, 20 + dd * 2, 1, 1, CYL); }
    } else {
      var sw = walk ? (f % 4 === 0 ? 1 : (f % 4 === 2 ? -1 : 0)) : 0;
      r(5, 18, 2, 3, D); hand(5 - sw, 20); r(17, 18, 2, 3, D); hand(17 + sw, 20);
      if (era === 'pre') { r(18 + sw, 14, 1, 6, WD); r(17 + sw, 11, 3, 3, WK); r(17 + sw, 11, 1, 1, '#8c6034'); }
      if (era === 'egypt') { r(18 + sw, 9, 1, 12, WD); r(18 + sw, 6, 1, 3, CU); r(17 + sw, 8, 3, 1, CU); r(18 + sw, 6, 1, 1, '#f0b07a'); }
    }
    OY -= bob;
  }

  var cache = {};
  function flashOf(c) {
    var w = document.createElement('canvas'); w.width = c.width; w.height = c.height;
    var x2 = w.getContext('2d'); x2.drawImage(c, 0, 0);
    x2.globalCompositeOperation = 'source-in'; x2.fillStyle = '#ffffff'; x2.fillRect(0, 0, w.width, w.height);
    return w;
  }
  S.get = function (era, pose, f, bl, face, look, sq, flash) {
    var k = era + '|' + pose + '|' + f + '|' + (bl ? 1 : 0) + '|' + face + '|' + (look || 0) + '|' + (sq || 0) + (flash ? '|F' : '');
    var c = cache[k];
    if (c) return c;
    if (flash) { c = flashOf(S.get(era, pose, f, bl, face, look, sq, false)); cache[k] = c; return c; }
    c = document.createElement('canvas');
    c.width = 36; c.height = 32;
    g = c.getContext('2d');
    if (face < 0) { g.translate(36, 0); g.scale(-1, 1); }
    OX = 6; OY = 4;
    body(pose, f, bl, era, look, sq);
    cache[k] = c;
    return c;
  };

  /* x, y = feet contact point in world pixels. rot = quarter turns (backflip).
     o (optional): { look: -1 up / 1 down, sq: -1 squash / 1 stretch, flash: true for a white hit flash } */
  S.draw = function (ctx, x, y, face, era, pose, f, bl, rot, alpha, o) {
    o = o || {};
    var c = S.get(era, pose, f, bl, face, o.look, o.sq, o.flash);
    var X = Math.round(x), Y = Math.round(y);
    if (alpha !== undefined && alpha < 1) ctx.globalAlpha = Math.max(0, alpha);
    if (rot) {
      ctx.save();
      ctx.translate(X, Y - 12);
      ctx.rotate(rot * Math.PI / 2);
      ctx.drawImage(c, -18, -17);
      ctx.restore();
    } else {
      ctx.drawImage(c, X - 18, Y - 29);
    }
    ctx.globalAlpha = 1;
  };

  function px(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }

  /* Where a shot leaves the weapon, so projectiles start at the business end. */
  S.tip = function (x, y, face, deg, wid) {
    var a = deg * Math.PI / 180;
    var L = wid === 'bomb' || wid === 'scarab' ? 6 : (wid === 'spear' ? 15 : 11);
    return { x: x + face * 6 + Math.cos(a) * face * L, y: y - 8 - Math.sin(a) * L };
  };

  /* Held weapon, drawn along the real aim direction in world space. */
  S.weapon = function (ctx, x, y, face, deg, wid, era, t) {
    var a = deg * Math.PI / 180, dx = Math.cos(a) * face, dy = -Math.sin(a);
    var hx = x + face * 6, hy = y - 8, i;
    if (wid === 'spear') {
      for (i = -3; i < 13; i++) px(ctx, hx + dx * i, hy + dy * i, 1, 1, i < 0 ? '#e0d6c0' : WD);
      px(ctx, hx + dx * 13, hy + dy * 13, 2, 2, CU); px(ctx, hx + dx * 15, hy + dy * 15, 1, 1, '#f0b07a');
      return;
    }
    if (wid === 'scarab') {
      var sx2 = hx + dx * 4, sy2 = hy + dy * 4;
      px(ctx, sx2 - 2, sy2 - 2, 5, 4, '#1f4f6a'); px(ctx, sx2 - 1, sy2 - 2, 3, 3, '#2f8fae'); px(ctx, sx2, sy2 - 2, 1, 3, AU);
      return;
    }
    if (era === 'egypt' && (wid === 'lob' || wid === 'bomb')) {
      var ex = hx + dx * 4, ey = hy + dy * 4;
      if (wid === 'lob') {
        px(ctx, ex - 2, ey - 1, 5, 4, '#9a4a26'); px(ctx, ex - 1, ey - 1, 3, 1, '#c8703a');
        px(ctx, ex - 1, ey - 3, 2, 2, ((t >> 3) % 2) ? OR : '#ffd27a'); px(ctx, ex, ey - 4, 1, 1, '#ffd27a');
      } else {
        px(ctx, ex - 2, ey - 2, 4, 5, '#e8e2d2'); px(ctx, ex - 2, ey, 4, 1, LB); px(ctx, ex - 1, ey - 3, 2, 1, '#9b8c7e');
        if ((t >> 3) % 3 === 0) px(ctx, ex + 1, ey - 5, 1, 1, '#ffffff');
      }
      return;
    }
    if (wid === 'lob') {
      if (era === 'pre') {
        for (i = 0; i < 7; i++) px(ctx, hx + dx * i, hy + dy * i, 2, 2, WD);
        px(ctx, hx + dx * 7 - dy * 2, hy + dy * 7 + dx * 2, 1, 2, WK);
        px(ctx, hx + dx * 7 + dy * 2, hy + dy * 7 - dx * 2, 1, 2, WK);
        px(ctx, hx + dx * 9, hy + dy * 9, 2, 2, '#8c8c8c');
      } else {
        for (i = 0; i < 10; i++) px(ctx, hx + dx * i, hy + dy * i, 2, 2, i < 3 ? GL : MT);
        px(ctx, hx + dx * 10, hy + dy * 10, 2, 2, CY);
      }
    } else if (wid === 'laser') {
      for (i = 0; i < 12; i++) px(ctx, hx + dx * i, hy + dy * i, 2, 2, i < 3 ? GL : (i > 9 ? '#9aa3ad' : MT));
      px(ctx, hx + dx * 12, hy + dy * 12, 1, 1, '#ff8fb0');
    } else if (wid === 'boulder') {
      var rx = hx + dx * 4, ry = hy + dy * 4 - 2;
      px(ctx, rx - 3, ry - 2, 7, 5, '#3d3832'); px(ctx, rx - 2, ry - 1, 5, 3, '#8c857b'); px(ctx, rx - 2, ry - 1, 2, 1, '#b5ada2');
    } else if (wid === 'disc') {
      var qx = hx + dx * 5, qy = hy + dy * 5;
      px(ctx, qx - 3, qy - 1, 7, 3, CY); px(ctx, qx - 1, qy, 3, 1, '#e9fdff');
    } else if (wid === 'vine') {
      for (i = 0; i < 5; i++) px(ctx, hx + dx * i, hy + dy * i + (i % 2), 1, 1, '#3f7a2e');
      px(ctx, hx + dx * 5, hy + dy * 5, 2, 2, '#7ec850');
    } else if (wid === 'bomb') {
      var bx = hx + dx * 4, by = hy + dy * 4;
      if (era === 'pre') {
        px(ctx, bx - 2, by - 2, 4, 4, '#b5653a'); px(ctx, bx - 2, by - 2, 4, 1, '#7a3f22');
        px(ctx, bx, by - 4, 1, 2, '#3a2a1a'); px(ctx, bx, by - 5, 1, 1, ((t >> 4) % 2) ? OR : '#ffd27a');
      } else {
        px(ctx, bx - 2, by - 2, 4, 4, MT); px(ctx, bx - 2, by - 1, 4, 1, CY); px(ctx, bx - 1, by - 3, 2, 1, GL);
      }
    }
  };

  S.proj = function (ctx, p, era, t) {
    var X = Math.round(p.x), Y = Math.round(p.y), i;
    if (p.type === 'boulder') {
      ctx.fillStyle = '#3d3832'; ctx.fillRect(X - 3, Y - 2, 7, 5); ctx.fillRect(X - 2, Y - 3, 5, 7);
      ctx.fillStyle = '#8c857b'; ctx.fillRect(X - 2, Y - 2, 5, 5);
      ctx.fillStyle = '#b5ada2'; ctx.fillRect(X - 2 + ((t >> 3) % 2) * 2, Y - 2, 2, 2);
      return;
    }
    if (p.type === 'gourd') {
      ctx.fillStyle = '#3a4a1c'; ctx.fillRect(X - 3, Y - 3, 7, 6); ctx.fillRect(X - 1, Y - 6, 3, 3);
      ctx.fillStyle = '#8fa63a'; ctx.fillRect(X - 2, Y - 2, 5, 4); ctx.fillRect(X, Y - 5, 1, 3);
      ctx.fillStyle = '#c9d77a'; ctx.fillRect(X - 2, Y - 2, 1, 2);
      ctx.fillStyle = ((t >> 4) % 2) ? OR : '#ffd27a'; ctx.fillRect(X, Y - 7, 1, 1);
      return;
    }
    if (p.type === 'disc') {
      for (i = 0; i < p.trail.length; i += 2) { ctx.fillStyle = '#1f7f8f'; ctx.fillRect(Math.round(p.trail[i][0]), Math.round(p.trail[i][1]), 1, 1); }
      ctx.fillStyle = CY;
      if ((t >> 2) % 2) { ctx.fillRect(X - 3, Y - 1, 7, 3); ctx.fillStyle = '#e9fdff'; ctx.fillRect(X - 1, Y, 3, 1); }
      else { ctx.fillRect(X - 1, Y - 3, 3, 7); ctx.fillStyle = '#e9fdff'; ctx.fillRect(X, Y - 1, 1, 3); }
      return;
    }
    if (p.type === 'spear') {
      var sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1, ux = p.vx / sp, uy = p.vy / sp;
      for (i = -8; i < 0; i++) { ctx.fillStyle = i < -6 ? '#e0d6c0' : WD; ctx.fillRect(Math.round(p.x + ux * i), Math.round(p.y + uy * i), 1, 1); }
      ctx.fillStyle = CU; ctx.fillRect(X - 1, Y - 1, 2, 2);
      ctx.fillStyle = '#f0b07a'; ctx.fillRect(Math.round(p.x + ux * 2), Math.round(p.y + uy * 2), 1, 1);
      return;
    }
    if (p.type === 'scarab') {
      var fc = p.face || (p.vx < 0 ? -1 : 1), leg = p.rest ? ((t >> 2) % 2) : 0;
      ctx.fillStyle = '#123044'; ctx.fillRect(X - 3, Y - 3, 7, 5); ctx.fillRect(X + fc * 3, Y - 2, 2, 3);
      ctx.fillStyle = '#2f8fae'; ctx.fillRect(X - 2, Y - 3, 5, 3);
      ctx.fillStyle = '#7fe0f0'; ctx.fillRect(X - 1 - fc, Y - 3, 2, 1);
      ctx.fillStyle = AU; ctx.fillRect(X, Y - 3, 1, 3); ctx.fillRect(X + fc * 4, Y - 2, 1, 1);
      ctx.fillStyle = '#123044';
      ctx.fillRect(X - 3 + leg, Y + 2, 1, 1); ctx.fillRect(X + 3 - leg, Y + 2, 1, 1); ctx.fillRect(X + leg, Y + 2, 1, 1);
      return;
    }
    if (p.type === 'meteor' && p.era === 'egypt') {
      for (i = 0; i < p.trail.length; i++) { ctx.fillStyle = i < p.trail.length / 2 ? '#c99d62' : '#f0d49a'; ctx.fillRect(Math.round(p.trail[i][0]) + (i % 2), Math.round(p.trail[i][1]), 2, 1); }
      ctx.fillStyle = '#7a5434'; ctx.fillRect(X - 3, Y - 3, 7, 6);
      ctx.fillStyle = '#d0a064'; ctx.fillRect(X - 2, Y - 2, 5, 4);
      ctx.fillStyle = '#f0d49a'; ctx.fillRect(X - 2, Y - 2, 2, 1);
      return;
    }
    if (p.type === 'meteor' && p.era === 'fut') {
      for (i = 0; i < p.trail.length; i++) { ctx.fillStyle = i < p.trail.length / 2 ? '#2f8a3a' : '#9be36b'; ctx.fillRect(Math.round(p.trail[i][0]), Math.round(p.trail[i][1]), 2, 2); }
      ctx.fillStyle = '#1f5a2a'; ctx.fillRect(X - 3, Y - 3, 7, 7);
      ctx.fillStyle = '#5fd35f'; ctx.fillRect(X - 2, Y - 2, 5, 5);
      ctx.fillStyle = '#e8ffd0'; ctx.fillRect(X - 1, Y - 1, 2, 2);
      return;
    }
    if (p.type === 'meteor') {
      for (i = 0; i < p.trail.length; i++) { ctx.fillStyle = i < p.trail.length / 2 ? '#c4572e' : '#ffd27a'; ctx.fillRect(Math.round(p.trail[i][0]), Math.round(p.trail[i][1]), 2, 2); }
      ctx.fillStyle = '#3d2a20'; ctx.fillRect(X - 3, Y - 3, 7, 7);
      ctx.fillStyle = '#7a4a30'; ctx.fillRect(X - 2, Y - 2, 5, 5);
      ctx.fillStyle = OR; ctx.fillRect(X - 2, Y + 1, 5, 1); ctx.fillRect(X + 1, Y - 2, 1, 2);
      return;
    }
    if (era === 'egypt' && (p.type === 'lob' || p.type === 'bomb')) {
      if (p.type === 'lob') {
        for (i = 0; i < p.trail.length; i += 2) { ctx.fillStyle = i < p.trail.length / 2 ? '#c4572e' : '#ffd27a'; ctx.fillRect(Math.round(p.trail[i][0]), Math.round(p.trail[i][1]), 1, 1); }
        ctx.fillStyle = '#6a3018'; ctx.fillRect(X - 2, Y - 2, 5, 5);
        ctx.fillStyle = '#b5653a'; ctx.fillRect(X - 1, Y - 1, 3, 3);
        ctx.fillStyle = ((t >> 2) % 2) ? OR : '#ffd27a'; ctx.fillRect(X - 1, Y - 3, 2, 1);
      } else {
        ctx.fillStyle = '#7a6a5c'; ctx.fillRect(X - 2, Y - 3, 5, 6);
        ctx.fillStyle = '#efe9da'; ctx.fillRect(X - 1, Y - 2, 3, 4);
        ctx.fillStyle = LB; ctx.fillRect(X - 1, Y, 3, 1);
        if ((t >> 3) % 2) { ctx.fillStyle = '#ffffff'; ctx.fillRect(X + ((t >> 4) % 3) - 1, Y - 5, 1, 1); }
      }
      return;
    }
    if (p.type === 'lob') {
      if (era === 'pre') {
        ctx.fillStyle = '#5f5a55'; ctx.fillRect(X - 2, Y - 1, 4, 3); ctx.fillRect(X - 1, Y - 2, 2, 5);
        ctx.fillStyle = '#9a948c'; ctx.fillRect(X - 1, Y - 1, 2, 1);
      } else {
        for (i = 0; i < p.trail.length; i++) {
          ctx.fillStyle = i < p.trail.length / 2 ? '#1f7f8f' : CY;
          ctx.fillRect(Math.round(p.trail[i][0]), Math.round(p.trail[i][1]), 1, 1);
        }
        ctx.fillStyle = CY; ctx.fillRect(X - 2, Y - 1, 4, 3); ctx.fillRect(X - 1, Y - 2, 2, 5);
        ctx.fillStyle = '#e9fdff'; ctx.fillRect(X - 1, Y - 1, 2, 2);
      }
    } else {
      if (era === 'pre') {
        ctx.fillStyle = '#b5653a'; ctx.fillRect(X - 2, Y - 2, 5, 5);
        ctx.fillStyle = '#7a3f22'; ctx.fillRect(X - 2, Y - 2, 5, 1);
        ctx.fillStyle = '#3a2a1a'; ctx.fillRect(X, Y - 4, 1, 2);
        ctx.fillStyle = ((t >> 4) % 2) ? OR : '#ffd27a'; ctx.fillRect(X, Y - 5, 1, 1);
      } else {
        ctx.fillStyle = MT; ctx.fillRect(X - 2, Y - 2, 5, 5);
        ctx.fillStyle = ((t >> 5) % 2) ? CY : '#1f7f8f'; ctx.fillRect(X - 2, Y, 5, 1);
        ctx.fillStyle = GL; ctx.fillRect(X - 1, Y - 3, 3, 1);
      }
    }
  };

  /* Sand Sled: a wooden board with a curled front, under the Snag's feet */
  S.sled = function (ctx, x, y, face) {
    var X = Math.round(x), Y = Math.round(y);
    px(ctx, X - 8, Y - 1, 16, 2, '#6e4622'); px(ctx, X - 7, Y - 1, 14, 1, '#b07a46');
    px(ctx, X + face * 8, Y - 3, 1, 2, '#6e4622'); px(ctx, X + face * 9, Y - 4, 1, 1, '#6e4622');
    px(ctx, X - 5, Y + 1, 2, 1, '#3b2616'); px(ctx, X + 3, Y + 1, 2, 1, '#3b2616');
  };

  /* ---------- UI glyphs: one small pixel icon set for menus, HUD and buttons ---------- */
  var GPAL = { k: '#151230', w: '#fef8f4', m: '#c3bce8', c: '#5fe0f0', C: '#1f7f8f', o: '#ef7724', y: '#ffc24a', v: '#7b5cff',
    g: '#7ec850', G: '#3f7a2e', b: '#9a6442', d: '#3e2416', r: '#ff8fb0', s: '#9aa3ad', S: '#59606a' };
  var GLYPH = {
    wind: ['', ' s', ' swwwccwwcc', ' s wwccwwcc c', ' s wwccwwcc', ' swwwccwwcc', ' s', ' s', ' s', ' s', ' s', 'sss'],
    angle: ['           c', '          c', '         c', '  www   c', ' w     c', 'w     c', 'w    c', 'w   c  y', 'w  c    y', 'w c      y', 'wc       y', 'wwwwwwwwwwww'],
    power: ['', '          oo', '          oo', '       yy oo', '       yy oo', '    cc yy oo', '    cc yy oo', ' cc cc yy oo', ' cc cc yy oo', ' cc cc yy oo'],
    music: ['', '    wwwwwww', '    wwwwwww', '    w     w', '    w     w', '    w     w', '    w     w', '  www   www', ' wwww  wwww', ' wwww  wwww', '  ww    ww'],
    sound: ['', '     w   c', '    ww    c', '   www  c  c', 'wwwwww   c c', 'wwwwww c c c', 'wwwwww c c c', 'wwwwww   c c', '   www  c  c', '    ww    c', '     w   c'],
    touch: ['   ww', '  wmmw', '  wmmw', '  wmmwww', '  wmmwmmwww', ' wwmmwmmwmmw', 'wmwmmmmmmmmw', 'wmmmmmmmmmmw', ' wmmmmmmmmmw', '  wmmmmmmmw', '   wmmmmmw', '   wwwwwww'],
    museum: ['     yy', '   yyyyyy', ' yyyyyyyyyy', 'yyyyyyyyyyyy', ' w  w  w  w', ' w  w  w  w', ' w  w  w  w', ' w  w  w  w', ' w  w  w  w', 'wwwwwwwwwwww', 'wwwwwwwwwwww'],
    help: ['   wwwwww', '  ww    ww', '  ww    ww', '        ww', '      www', '     ww', '     ww', '', '     ww', '     ww'],
    vault: [' vvvvvvvvvv', ' vwwwwwwwwv', ' vwccccccwv', ' vwccccccwv', ' vwccccccwv', ' vwwwwwwwwv', ' vvvvvvvvvv', ' vv oo  vvv', ' vvoooo vvv', ' vv oo  vvv', ' vvvvvvvvvv'],
    home: ['     oo', '    oooo', '   oooooo', '  oooooooo', ' oooooooooo', 'oooooooooooo', ' wwwwwwwwww', ' ww  wwccww', ' ww  wwccww', ' ww  wwwwww', ' ww  wwwwww', ' wwwwwwwwww'],
    again: ['   wwwww', '  ww   ww w', ' ww     www', ' w     wwww', ' w', ' w         w', '           w', 'wwww     w', 'www     ww', 'w ww   ww', '   wwwww'],
    gear: ['    w  w', ' w wwwwww w', '  wwwwwwww', ' www    www', 'www      www', ' ww      ww', ' ww      ww', 'www      www', ' www    www', '  wwwwwwww', ' w wwwwww w', '    w  w'],
    pencil: ['         rr', '        rrrr', '       yyrr', '      yyy', '     yyy', '    yyy', '   yyy', '  www', ' wwm', ' mm'],
    hourglass: [' wwwwwwwwww', '  wyyyyyyw', '   wyyyyw', '    wyyw', '     ww', '     ww', '    w  w', '   w yy w', '  w yyyy w', ' wwwwwwwwww'],
    meteor: ['', '  o', '   o   y', '    o y', '     yoo', '     oooo', '    oowwoo', '    oowwoo', '     oooo', '      oo'],
    off: ['    mmmm', '  mm    mm', ' m     mm m', ' m    mm  m', 'm    mm    m', 'm   mm     m', 'm  mm      m', ' mmm      m', ' m       m', '  mm    mm', '    mmmm'],
    sleepy: ['        www', '          w', ' cccccc  w', 'cccccccc www', 'cccccccc', 'ckkcckkc', 'cccccccc', 'cccccccc', 'cc kkkcc', 'cccccccc', ' cccccc'],
    grumpy: ['', ' yyyyyyyy', 'yyyyyyyyyy', 'ykkyyyykky', 'yykyyyykyy', 'yykkyykkyy', 'yyyyyyyyyy', 'yyyyyyyyyy', 'yyykkkkyyy', 'yykyyyykyy', ' yyyyyyyy'],
    legendary: [' o  o  o', ' oo oo oo', 'oyyoyyoyyo', 'oyyyyyyyyo', 'yyyyyyyyyy', 'ywwyyyywwy', 'ywkyyyywky', 'yyyyyyyyyy', 'yykyyyykyy', 'yyykkkkyyy', ' yyyyyyyy'],
    cpu: ['cccccccccccc', 'ckkkkkkkkkkc', 'ckkwkkkkwkkc', 'ckkwkkkkwkkc', 'ckkkkkkkkkkc', 'ckkkwwwwkkkc', 'ckkkkkkkkkkc', 'cccccccccccc', '     cc', '   cccccc'],
    friend: ['  ww    cc', ' wwww  cccc', ' wwww  cccc', '  ww    cc', '', ' wwww  cccc', 'wwwwwwcccccc', 'wwwwwwcccccc', 'wwwwwwcccccc'],
    tour: ['', ' g   y   c', 'ggg yyy ccc', ' g   y   c', '', '         w', 'wwwwwwwwwww', 'wwwwwwwwwwww', 'wwwwwwwwwww', '         w'],
    lock: ['   wwwwww', '  ww    ww', '  w      w', '  w      w', ' yyyyyyyyyy', ' yyyyyyyyyy', ' yyyykkyyyy', ' yyyykkyyyy', ' yyyyykyyyy', ' yyyyyyyyyy', ' yyyyyyyyyy'],
    bounce: ['', '       c c', '     c     c', '    c       c', '   c', '  c', ' c', ' ww', 'wwww', 'wwww', ' ww', 'mmmmmmmmmmmm'],
    fuse: ['        y', '       yoy', '      d y', '     d', '   wwww', '  wmmmmw', ' wmmmmmmw', ' wmmmmmmw', ' wmmmmmmw', ' wmmmmmmw', '  wmmmmw', '   wwww'],
    target: ['    oooo', '  oo    oo', ' o  wwww  o', ' o w    w o', 'o  w oo w  o', 'o  w oo w  o', ' o w    w o', ' o  wwww  o', '  oo    oo', '    oooo'],
    free: ['', '  gg', ' gggg', ' gggg', '  gg     gg', '        gggg', '  g     gggg', '         gg', '', '         g'],
    play: [' ww', ' wwww', ' wwwwww', ' wwwwwwww', ' wwwwwwwwww', ' wwwwwwwwww', ' wwwwwwww', ' wwwwww', ' wwww', ' ww'],
    leave: [' wwwwwww', ' wvvvvvw', ' wvvvvvw  w', ' wvvvvvw ww', ' wvvvyvwwwww', ' wvvvvvw ww', ' wvvvvvw  w', ' wvvvvvw', ' wvvvvvw', ' wwwwwww'],
    phone: ['  wwwwww', '  wkkkkw', '  wkkkkw', '  wkkkkw', '  wkkkkw', '  wkkkkw', '  wkkkkw', '  wwwwww', '  wwyyww', '  wwwwww'],
    camera: ['', '   www', ' wwwwwwwwww', ' wwwmmmmwww', ' wwmkkkkmww', ' wwmkcckmww', ' wwmkcckmww', ' wwmkkkkmww', ' wwwmmmmwww', ' wwwwwwwwww'],
    check: ['', '          g', '         gg', '        gg', '       gg', ' g    gg', ' gg  gg', '  gggg', '   gg'],
    dice: [' wwwwwwwwww', ' wkkwwwwkkw', ' wkkwwwwkkw', ' wwwwwwwwww', ' wwwwkkwwww', ' wwwwkkwwww', ' wwwwwwwwww', ' wkkwwwwkkw', ' wkkwwwwkkw', ' wwwwwwwwww'],
    postcard: ['', 'wwwwwwwwwwww', 'wwmwwwwwwmww', 'wwwmwwwwmwww', 'wwwwmwwmwwww', 'wwwwwmmwwwww', 'wwwwwwwwwwww', 'wwwwwwwwwwww', 'wwwwwwwwwwww', 'wwwwwwwwwwww'],
    next: ['      w', '      ww', '      www', 'wwwwwwwwww', 'wwwwwwwwwww', 'wwwwwwwwww', '      www', '      ww', '      w'],
    trophy: [' yyyyyyyyyy', 'yy yyyyyy yy', 'y  yyyyyy  y', 'yy yyyyyy yy', ' yyyyyyyyyy', '   yyyyyy', '    yyyy', '     yy', '     yy', '   yyyyyy', '   yyyyyy'],
    fuel: ['     o', '    ooo', '   ooooo', '  ooyoooo', '  oyooooo', '  ooooooo', '   ooooo', '    ooo'],
    arrows: ['', '  w      w', ' ww      ww', 'wwwwwwwwwwww', ' ww      ww', '  w      w'],
    glitch: [' vvvv  c', 'vv  vv c', '    vv c', '   vv  c', '  vv   c', '  vv', '', '  vv   c'],
    pin: ['   oooo', '  oooooo', ' ooowwooo', ' ooowwooo', '  oooooo', '   oooo', '    oo', '    oo'],
    cup: ['    m  m', '   m  m', '    m  m', '', ' wwwwwwww', ' wbbbbbbwww', ' wwwwwwww w', ' wwwwwwww w', ' wwwwwwwwww', '  wwwwww'],
    jump: ['     w', '    www', '   wwwww', '  ww w ww', '     w', '     w', '     w', '', ' mmmmmmmmm'],
    kit: ['    wwww', '   w    w', ' oooooooooo', ' oooooooooo', ' oowwwwwwoo', ' oowoooowoo', ' oowwwwwwoo', ' oooooooooo', ' oooooooooo', ' oooooooooo'],
    tag: ['', '   yyyyyyy', '  yyyyyyyyy', ' yyyyyyyyyy', 'yykyyyyyyyy', ' yyyyyyyyyy', '  yyyyyyyyy', '   yyyyyyy'],
    plus: ['', '', '     ww', '     ww', '     ww', '  wwwwwwww', '  wwwwwwww', '     ww', '     ww', '     ww'],
    minus: ['', '', '', '', '', '  wwwwwwww', '  wwwwwwww'],
    snag: ['  g      g', '  gg    gg', '   gggggg', '  gggggggg', '  gyykyykg', '  gggggggg', '  ggkkkkgg', '   gggggg', '    gggg', '   gg  gg']
  };
  var glyphCache = {};
  S.glyph = function (name) {
    if (glyphCache[name]) return glyphCache[name];
    var rows = GLYPH[name] || GLYPH.help, c = document.createElement('canvas');
    c.width = 12; c.height = 12;
    var x2 = c.getContext('2d'), top = Math.floor((12 - rows.length) / 2);
    for (var y = 0; y < rows.length; y++) for (var x = 0; x < 12; x++) {
      var col = GPAL[rows[y].charAt(x)];
      if (col) { x2.fillStyle = col; x2.fillRect(x, y + top, 1, 1); }
    }
    glyphCache[name] = c;
    return c;
  };
  /* fill every <canvas data-g="name"> under root with its glyph */
  S.paintGlyphs = function (root) {
    Array.prototype.forEach.call((root || document).querySelectorAll('canvas[data-g]'), function (cv) {
      cv.width = 12; cv.height = 12;
      var x2 = cv.getContext('2d'); x2.clearRect(0, 0, 12, 12); x2.drawImage(S.glyph(cv.getAttribute('data-g')), 0, 0);
    });
  };

  /* ---------- a tiny painted picture of a battlefield, for menus and time jumps ---------- */
  S.mapThumb = function (cv, map, look) {
    var W = cv.width, H = cv.height, x2 = cv.getContext('2d'), i, x;
    var sky = (look === 'overgrown' && map.skyGreen) || (look === 'sandy' && map.skySandy) || (look === 'neon' && map.skyNeon) || map.sky;
    for (i = 0; i < sky.length; i++) { x2.fillStyle = sky[i]; x2.fillRect(0, Math.floor(i * H / sky.length), W, Math.ceil(H / sky.length) + 1); }
    var night = map.style === 'city' || look === 'neon';
    x2.fillStyle = map.sun || '#fff3c8';
    x2.beginPath(); x2.arc(W * 0.78, H * (look === 'neon' ? 0.42 : 0.24), H * 0.11, 0, 7); x2.fill();
    if (night) for (i = 0; i < 14; i++) { x2.fillStyle = '#e9e4ff'; x2.fillRect(Math.floor((i * 37) % W), Math.floor((i * 17) % (H * 0.4)), 1, 1); }
    var gy = Math.round(H * 0.72);
    if (map.style === 'hills') {
      x2.fillStyle = map.far; x2.beginPath(); x2.moveTo(W * 0.1, gy); x2.lineTo(W * 0.42, H * 0.22); x2.lineTo(W * 0.74, gy); x2.fill();
      x2.fillStyle = map.lava; x2.fillRect(Math.round(W * 0.4), Math.round(H * 0.22), 3, 2);
      x2.fillStyle = '#7ec850'; x2.fillRect(0, gy, W, 2);
      x2.fillStyle = 'rgb(138,90,50)'; x2.fillRect(0, gy + 2, W, H - gy);
      x2.fillStyle = '#7ec850'; x2.fillRect(Math.round(W * 0.55), Math.round(H * 0.42), Math.round(W * 0.22), 2);
      x2.fillStyle = 'rgb(120,76,42)'; x2.fillRect(Math.round(W * 0.57), Math.round(H * 0.42) + 2, Math.round(W * 0.18), 3);
    } else if (map.style === 'desert') {
      var pc = look === 'golden' ? '#f2eadb' : (look === 'neon' ? '#3a3e6e' : '#d6c69e');
      x2.fillStyle = pc; x2.beginPath(); x2.moveTo(W * 0.2, gy); x2.lineTo(W * 0.45, H * 0.2); x2.lineTo(W * 0.7, gy); x2.fill();
      x2.fillStyle = look === 'golden' ? '#f0c446' : (look === 'neon' ? '#ff78be' : pc);
      x2.fillRect(Math.round(W * 0.45) - 2, Math.round(H * 0.2), 4, 3);
      if (look === 'neon') { x2.strokeStyle = '#5fe0f0'; x2.lineWidth = 1; x2.beginPath(); x2.moveTo(W * 0.2, gy); x2.lineTo(W * 0.45, H * 0.2); x2.lineTo(W * 0.7, gy); x2.stroke(); }
      if (look === 'rough') { x2.fillStyle = '#8c857b'; x2.beginPath(); x2.arc(W * 0.82, gy - 2, 3, 0, 7); x2.fill(); x2.beginPath(); x2.arc(W * 0.12, gy - 1, 2.5, 0, 7); x2.fill(); }
      x2.fillStyle = '#aa5848'; x2.fillRect(Math.round(W * 0.82), Math.round(H * 0.3), 2, gy - Math.round(H * 0.3));
      x2.fillStyle = 'rgb(240,206,136)'; x2.fillRect(0, gy, W, H - gy);
      x2.fillStyle = 'rgb(224,186,114)'; x2.fillRect(0, gy + 3, W, H - gy);
    } else {
      var sandy = look === 'sandy', wild = look === 'overgrown';
      var tw = [[0.06, 0.4], [0.2, 0.25], [0.36, 0.48], [0.52, 0.18], [0.7, 0.36], [0.86, 0.3]];
      tw.forEach(function (t, k) {
        var bx = Math.round(W * t[0]), top = Math.round(H * t[1]), bw = Math.round(W * 0.12);
        x2.fillStyle = sandy ? '#8a5a62' : (wild ? '#2f4a44' : '#3a3e6e'); x2.fillRect(bx, top, bw, gy - top);
        if (sandy) { x2.beginPath(); x2.moveTo(bx, top); x2.lineTo(bx + bw / 2, top - 4); x2.lineTo(bx + bw, top); x2.fill(); }
        x2.fillStyle = sandy ? '#e0b060' : (wild ? '#7ec850' : (look === 'gleaming' ? '#fff3c8' : '#ffd27a'));
        for (var yy = top + 2; yy < gy - 1; yy += 3) for (var xx = bx + 1; xx < bx + bw - 1; xx += 2) if (((xx * 7 + yy * 3 + k) % 5) < (look === 'gleaming' ? 4 : 2)) x2.fillRect(xx, yy, 1, 1);
      });
      x2.fillStyle = sandy ? '#d4a668' : (wild ? '#4e6a3a' : '#4e5870'); x2.fillRect(0, gy, W, H - gy);
      x2.fillStyle = sandy ? '#f0c446' : (wild ? '#7ec850' : '#5fe0f0'); x2.fillRect(0, gy, W, 1);
    }
    x2.fillStyle = map.water || '#3f8fb5'; x2.fillRect(0, H - 3, W, 3);
  };

  /* ---------- kit icons: 12 by 12, drawn for the console and the kit ---------- */
  S.icon = function (ctx, wid, era) {
    ctx.clearRect(0, 0, 12, 12);
    function P(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
    function dot(cx, cy, rad, c) { for (var y = 0; y < 12; y++) for (var x = 0; x < 12; x++) { var dx = x + 0.5 - cx, dy = y + 0.5 - cy; if (dx * dx + dy * dy <= rad * rad) P(x, y, 1, 1, c); } }
    var i;
    if ({ lob: 1, bomb: 1, boulder: 1, gourd: 1, disc: 1, scarab: 1 }[wid]) {
      S.proj(ctx, { type: wid, x: 6, y: 7, vx: 1, vy: 0, trail: [], rest: false, era: era, face: 1 }, era, 8);
      return;
    }
    switch (wid) {
      case 'spear': S.proj(ctx, { type: 'spear', x: 9, y: 3, vx: 1, vy: -1, trail: [] }, era, 0); break;
      case 'shove':
        if (era === 'pre') { P(7, 1, 4, 4, WK); P(7, 1, 1, 1, '#8c6034'); P(6, 5, 2, 2, WD); P(4, 7, 2, 2, WD); P(2, 9, 2, 2, WD); }
        else if (era === 'egypt') { P(2, 9, 2, 2, WK); P(4, 7, 2, 2, BZ); P(5, 5, 2, 2, BZ); P(6, 3, 2, 2, BZ); P(8, 2, 2, 2, BZ); P(10, 3, 1, 2, BZ); P(5, 8, 2, 1, AD); }
        else { P(3, 3, 6, 6, CY); P(3, 3, 6, 1, CYL); P(9, 4, 2, 4, '#1f7f8f'); P(4, 6, 4, 1, '#1f7f8f'); P(0, 4, 2, 1, '#ffffff'); P(0, 7, 2, 1, '#ffffff'); }
        break;
      case 'dig':
        if (era === 'pre') { P(6, 0, 1, 6, BN); P(4, 6, 5, 4, BN); P(5, 7, 3, 2, '#d8ceb4'); P(5, 10, 3, 1, BN); }
        else if (era === 'egypt') { P(1, 8, 6, 2, WD); P(7, 8, 3, 2, CU); P(10, 8, 1, 2, '#f0b07a'); P(2, 2, 4, 3, WK); P(3, 5, 1, 3, WD); }
        else { P(1, 4, 6, 5, MT); P(1, 4, 6, 1, '#9aa3ad'); P(7, 5, 2, 3, '#9aa3ad'); P(9, 6, 2, 1, CY); P(11, 6, 1, 1, CYL); }
        break;
      case 'vine':
        P(1, 1, 3, 1, '#7ec850'); for (i = 0; i < 9; i++) P(2 + i, 2 + i, 1, 1, '#3f7a2e');
        P(4, 5, 2, 1, '#7ec850'); P(7, 7, 1, 2, '#7ec850'); P(9, 10, 2, 1, '#5fa24a'); break;
      case 'jet':
        P(3, 1, 6, 7, MT); P(3, 1, 6, 1, '#9aa3ad'); P(5, 3, 2, 2, CY); P(4, 8, 1, 2, OR); P(7, 8, 1, 2, OR); P(4, 10, 1, 1, '#ffd27a'); P(7, 10, 1, 2, '#ffd27a'); break;
      case 'wall':
        P(1, 2, 10, 9, '#4a4640'); P(2, 3, 4, 2, '#a8a197'); P(7, 3, 3, 2, '#8c857b'); P(2, 6, 2, 2, '#8c857b'); P(5, 6, 5, 2, '#a8a197'); P(2, 9, 5, 1, '#a8a197'); P(8, 9, 2, 1, '#8c857b'); break;
      case 'shield':
        for (i = 0; i < 28; i++) { var a = i / 28 * Math.PI * 2; P(Math.round(5.5 + Math.cos(a) * 4.6), Math.round(5.5 + Math.sin(a) * 4.6), 1, 1, i % 3 ? CY : CYL); }
        P(5, 5, 2, 2, CYL); break;
      case 'mega':
        dot(6, 6.5, 4.5, '#3d3832'); dot(6, 6.5, 3.6, '#8c857b'); P(4, 4, 2, 2, '#b5ada2'); P(1, 0, 1, 2, '#ffffff'); P(10, 0, 1, 2, '#ffffff'); break;
      case 'orbital':
        P(4, 0, 4, 9, '#37c8dc'); P(5, 0, 2, 9, '#e9fdff'); P(1, 9, 10, 2, '#37c8dc'); P(0, 11, 12, 1, '#1f7f8f'); break;
      case 'laser':
        P(1, 5, 7, 3, MT); P(1, 5, 2, 4, GL); P(2, 8, 2, 2, GL); P(8, 6, 4, 1, '#ff8fb0'); P(8, 5, 1, 1, '#ffffff'); break;
      case 'sled':
        P(0, 11, 12, 1, '#e8c27a'); P(1, 8, 9, 2, '#b07a46'); P(1, 8, 9, 1, '#d9a46a'); P(10, 6, 1, 3, '#6e4622'); P(9, 5, 2, 1, '#6e4622'); P(3, 10, 1, 1, '#3b2616'); P(7, 10, 1, 1, '#3b2616'); break;
      case 'sandwall':
        for (i = 0; i < 12; i++) { var u = (i + 0.5 - 6) / 6, h = Math.round(6 * Math.sqrt(Math.max(0, 1 - u * u))); P(i, 11 - h, 1, h + 1, '#e0b46a'); P(i, 11 - h, 1, 1, '#f6d896'); }
        break;
      case 'sun':
        P(6, 0, 1, 2, '#f0c446'); P(6, 10, 1, 2, '#f0c446'); P(0, 6, 2, 1, '#f0c446'); P(10, 6, 2, 1, '#f0c446');
        P(2, 2, 1, 1, '#f0c446'); P(9, 2, 1, 1, '#f0c446'); P(2, 9, 1, 1, '#f0c446'); P(9, 9, 1, 1, '#f0c446');
        dot(6.5, 6.5, 3.3, '#ffd23f'); dot(6, 6, 1.6, '#fff3c8'); break;
      case 'bark':
        dot(6, 6.5, 4.6, '#3e2416'); dot(6, 6.5, 3.7, '#9a6442'); P(2, 4, 2, 5, '#74472c'); P(9, 6, 2, 2, '#c08a5c'); P(10, 6, 1, 1, '#1d1d24'); P(7, 4, 1, 1, '#1d1d24'); P(5, 1, 3, 2, '#9a6442'); break;
      case 'pass':
        P(3, 5, 6, 6, '#e8e2d2'); P(9, 6, 2, 3, '#e8e2d2'); P(10, 7, 1, 1, '#2e2860'); P(4, 5, 4, 1, '#8a5a32'); P(3, 10, 6, 1, '#c3bcae');
        P(5, 1, 1, 3, '#c3bce8'); P(7, 2, 1, 2, '#c3bce8'); break;
      default: P(4, 4, 4, 4, '#c3bce8');
    }
  };

  /* Time portal: ring of light that zaps a Snag home. k goes 0 to 1. */
  S.portal = function (ctx, x, y, k, t) {
    var open = Math.sin(Math.min(1, k * 1.4) * Math.PI), rad = 5 + open * 10, i, a;
    /* a soft purple glow inside */
    if (open > 0.15) {
      ctx.globalAlpha = 0.35 * open; ctx.fillStyle = '#7b5cff';
      for (var yy = -Math.round(rad * 1.2); yy <= Math.round(rad * 1.2); yy++) {
        var hw = Math.round(Math.sqrt(Math.max(0, 1 - (yy * yy) / (rad * rad * 1.44))) * rad * 0.8);
        ctx.fillRect(Math.round(x) - hw, Math.round(y) + yy, hw * 2 + 1, 1);
      }
      ctx.globalAlpha = 1;
    }
    /* two rings spinning opposite ways */
    for (i = 0; i < 18; i++) {
      a = i / 18 * Math.PI * 2 + t * 0.12;
      ctx.fillStyle = i % 3 === 0 ? '#ffffff' : (i % 2 ? '#7b5cff' : CY);
      ctx.fillRect(Math.round(x + Math.cos(a) * rad), Math.round(y + Math.sin(a) * rad * 1.3), 2, 2);
    }
    for (i = 0; i < 12; i++) {
      a = i / 12 * Math.PI * 2 - t * 0.18;
      ctx.fillStyle = i % 2 ? '#d9cfff' : '#b39cff';
      ctx.fillRect(Math.round(x + Math.cos(a) * rad * 0.6), Math.round(y + Math.sin(a) * rad * 0.78), 1, 1);
    }
    /* sparkles flying off */
    for (i = 0; i < 5; i++) {
      var ph = ((t * 2 + i * 37) % 40) / 40, sa = i * 1.26 + t * 0.02;
      if (open < 0.3) break;
      ctx.fillStyle = ph < 0.5 ? '#ffffff' : '#bff3fa';
      ctx.fillRect(Math.round(x + Math.cos(sa) * (rad + ph * 10)), Math.round(y + Math.sin(sa) * (rad + ph * 10) * 1.2), 1, 1);
    }
    if (k > 0.2 && k < 0.85) { ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2); }
  };

  /* Tiny 3x5 pixel font so name tags stay crisp at any zoom. */
  var GLY = {
    A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110',
    E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101',
    I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111',
    M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100',
    Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
    U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
    Y: '101101010010010', Z: '111001010100111',
    '0': '111101101101111', '1': '010110010010111', '2': '110001010100111', '3': '110001010001110',
    '4': '101101111001001', '5': '111100110001110', '6': '011100111101111', '7': '111001010010010',
    '8': '111101111101111', '9': '111101111001110',
    '-': '000000111000000', '+': '000010111010000', '!': '010010010000010', '.': '000000000000010',
    "'": '010010000000000', ' ': '000000000000000', '?': '110001010000010'
  };
  function glyph(ctx, ch, x, y, c) {
    var gl = GLY[ch] || GLY['?'];
    ctx.fillStyle = c;
    for (var i = 0; i < 15; i++) if (gl.charAt(i) === '1') ctx.fillRect(x + (i % 3), y + Math.floor(i / 3), 1, 1);
  }
  S.textWidth = function (s) { return s.length * 4 - 1; };
  S.text = function (ctx, s, x, y, col, out, center) {
    s = String(s).toUpperCase();
    var X = Math.round(center ? x - S.textWidth(s) / 2 : x), Y = Math.round(y), i;
    if (out) {
      var o = [[-1, 0], [1, 0], [0, -1], [0, 1], [1, 1]];
      for (var j = 0; j < o.length; j++) for (i = 0; i < s.length; i++) glyph(ctx, s.charAt(i), X + i * 4 + o[j][0], Y + o[j][1], out);
    }
    for (i = 0; i < s.length; i++) glyph(ctx, s.charAt(i), X + i * 4, Y, col);
  };

  /* ---------- artefact icons: 12 by 12 pixel art from string maps ---------- */
  function fromMap(rows, pal, size) {
    var c = document.createElement('canvas');
    c.width = size; c.height = size;
    var x2 = c.getContext('2d');
    for (var y = 0; y < rows.length; y++) {
      var row = rows[y];
      for (var x = 0; x < row.length; x++) {
        var col = pal[row.charAt(x)];
        if (col) { x2.fillStyle = col; x2.fillRect(x, y, 1, 1); }
      }
    }
    return c;
  }
  var ART = {
    handaxe: { pal: { o: '#3d3128', L: '#cdb89c', m: '#9c8770', d: '#6f5d49' }, rows: [
      '            ', '     oo     ', '    oLLo    ', '   oLLmmo   ', '   oLmmmo   ', '  oLmmmmdo  ',
      '  oLmmdmdo  ', '  omLmmmdo  ', '  ommmmddo  ', '   ommddo   ', '    oddo    ', '     oo     '] },
    needle: { pal: { o: '#5a4a38', B: '#f1e6cc', t: '#c99a5a', '.': null }, rows: [
      '        oo  ', '       oBBo ', '       oB.ot', '      oBBo t', '     oBBo  t', '    oBBo  t ',
      '   oBBo  t  ', '  oBBo  t   ', ' oBBo  t    ', ' oBo        ', ' oo         ', '            '] },
    caveart: { pal: { g: '#6f6a63', G: '#a39e95', r: '#9a3f22' }, rows: [
      '            ', ' gggggggggg ', 'ggGGGGGGGGgg', 'gGGGrGGGrGGg', 'gGGGGrGrGGGg', 'gGGrrrrrGGGg',
      'gGrrrrrrrrGg', 'gGGrGGGGrGGg', 'gGGrGGGGrGGg', 'ggGGGGGGGGgg', ' gggggggggg ', '            '] },
    mammoth: { pal: { o: '#3b2b1d', C: '#efe1c0', c: '#9c7a52', d: '#6e5236' }, rows: [
      '            ', '  oooooooo  ', ' oCcCcCcCco ', ' oCcCcCcCco ', ' oCcCcCcCco ', ' oCcCcCcCco ',
      ' oCcCcCcCco ', ' oddddddddo ', '  odo  odo  ', '  odo  odo  ', '  oo    oo  ', '            '] },
    headdress: { pal: { a: '#8a5a32', W: '#efe4cb', o: '#6d6252', k: '#2a2420' }, rows: [
      'a  a    a  a', ' a a    a a ', '  aa    aa  ', '   a    a   ', '   aWWWWa   ', '  oWWWWWWo  ',
      '  oWkWWkWo  ', '  oWWWWWWo  ', '   oWWWWo   ', '    oWWo    ', '    oooo    ', '            '] },
    arrowhead: { pal: { o: '#3d3128', L: '#d2c2aa', m: '#9c8770', d: '#6f5d49', s: '#c99a5a', w: '#7a5434' }, rows: [
      '     oo     ', '    oLmo    ', '    oLmo    ', '   oLmmdo   ', '   oLmmdo   ', '    oLdo    ',
      '     ss     ', '     ww     ', '     ww     ', '     ww     ', '     ww     ', '     ww     '] },
    beaker: { pal: { o: '#4a2a18', P: '#cf7d45', b: '#8e4a24' }, rows: [
      '            ', '  oooooooo  ', '  oPPPPPPo  ', '  obbbbbbo  ', '   oPPPPo   ', '   obbbbo   ',
      '  oPPPPPPo  ', ' oPbPbPbPPo ', ' oPPPPPPPPo ', '  obbbbbbo  ', '   oPPPPo   ', '    oooo    '] },
    bluestone: { pal: { o: '#2f3a46', B: '#8fa6bd', b: '#62788f', g: '#4f8a3a', G: '#7ec850' }, rows: [
      '    oooo    ', '   oBBbbo   ', '   oBBbbo   ', '   oBbbbo   ', '   oBBbbo   ', '   oBbbbo   ',
      '   oBBbbo   ', '   oBbbbo   ', '   oBBbbo   ', '  ggggggggg ', ' gGGGGGGGGGg', '            '] },
    dresser: { pal: { o: '#4a4640', S: '#a8a197', P: '#cf7d45' }, rows: [
      '            ', ' oooooooooo ', ' oSSSSSSSSo ', ' oo  P   oo ', ' oS  P   So ', ' oSSSSSSSSo ',
      ' oo      oo ', ' oS      So ', ' oSSSSSSSSo ', ' oS      So ', ' oS      So ', ' oo      oo '] },
    phone: { pal: { o: '#111418', K: '#2b3038', S: '#5fe0f0', s: '#e9fdff' }, rows: [
      '   oooooo   ', '   oKKKKo   ', '   oSSSSo   ', '   oSsSSo   ', '   oSSSSo   ', '   oSSsSo   ',
      '   oSSSSo   ', '   oSSSSo   ', '   oKKKKo   ', '   oKooKo   ', '   oooooo   ', '            '] },
    duck: { pal: { Y: '#f5d23a', y: '#d9a91f', k: '#1d1d24', O: '#ef7724' }, rows: [
      '            ', '     YYY    ', '    YYYYY   ', '    YkYYYOO ', '    YYYYYO  ', ' Y   YYYY   ',
      ' YYYYYYYYY  ', ' YYYYYYYYYY ', ' YYYYYYYYYY ', '  YYYYYYYY  ', '   yyyyyy   ', '            '] },
    cone: { pal: { o: '#5a2a10', O: '#ef7724', W: '#ffffff', K: '#2b3038' }, rows: [
      '     oo     ', '    oOOo    ', '    oWWo    ', '   oOOOOo   ', '   oOOOOo   ', '   oWWWWo   ',
      '  oOOOOOOo  ', '  oOOOOOOo  ', ' oooooooooo ', 'oKKKKKKKKKKo', 'oooooooooooo', '            '] },
    stamp: { pal: { w: '#f4efe4', K: '#1d1d24', G: '#8a8a8a' }, rows: [
      ' w w w w w  ', 'wKKKKKKKKKw ', ' KKKKKKKKK  ', 'wKKKGGGKKKw ', ' KKGGGGGKK  ', 'wKKKGGGGKKw ',
      ' KKKGGGKKK  ', 'wKKKGGKKKKw ', ' KKGGGGKKK  ', 'wKKKKKKKKKw ', ' w w w w w  ', '            '] },
    ticket: { pal: { o: '#6e5236', C: '#f1e2bf', t: '#7a6a5c', r: '#c4572e' }, rows: [
      '            ', '            ', ' oooooooooo ', ' oCCCCCCCCo ', ' oCtttCrrCo ', ' oCCCCCCCCo ',
      ' oCttttttCo ', ' oCCCCCCCCo ', ' oCttCCttCo ', ' oooooooooo ', '            ', '            '] },
    bulb: { pal: { o: '#7a6a2a', Y: '#fff1a0', y: '#f5d23a', f: '#c4572e', g: '#9aa3ad', d: '#59606a' }, rows: [
      '    oooo    ', '   oYYYYo   ', '  oYYyyYYo  ', '  oYyffyYo  ', '  oYYffYYo  ', '   oYffYo   ',
      '    oYYo    ', '    gggg    ', '    dddd    ', '    gggg    ', '     dd     ', '            '] },
    floppy: { pal: { o: '#111418', B: '#2f4f8a', s: '#c7ccd3', L: '#f4efe4', d: '#1d2a44' }, rows: [
      '            ', ' oooooooooo ', ' oBBssssBBo ', ' oBBsdssBBo ', ' oBBssssBBo ', ' oBBBBBBBBo ',
      ' oBLLLLLLBo ', ' oBLLLLLLBo ', ' oBLLLLLLBo ', ' oBLLLLLLBo ', ' oooooooooo ', '            '] },
    cassette: { pal: { o: '#111418', G: '#5a6068', w: '#e9e4d8', r: '#2b3038', L: '#ef7724' }, rows: [
      '            ', '            ', 'oooooooooooo', 'oGGGGGGGGGGo', 'oGLLLLLLLLGo', 'oGwrwGGwrwGo',
      'oGrwrGGrwrGo', 'oGwrwGGwrwGo', 'oGGGGGGGGGGo', 'oGGoooooGGGo', 'oooooooooooo', '            '] },
    cube: { pal: { o: '#111418', R: '#d84a3a', Y: '#f5d23a', B: '#2f6fd8', G: '#3aa84f', W: '#f4efe4', O: '#ef7724' }, rows: [
      '            ', ' oooooooooo ', ' oRRoYYoBBo ', ' oRRoYYoBBo ', ' oooooooooo ', ' oGGoWWoOOo ',
      ' oGGoWWoOOo ', ' oooooooooo ', ' oYYoBBoRRo ', ' oYYoBBoRRo ', ' oooooooooo ', '            '] },
    brickphone: { pal: { o: '#111418', K: '#3b4048', S: '#9be36b', b: '#9aa3ad', a: '#2b3038' }, rows: [
      '      a     ', '      a     ', '   ooooooo  ', '   oKKKKKo  ', '   oSSSSSo  ', '   oSSSSSo  ',
      '   oKKKKKo  ', '   obKbKbo  ', '   obKbKbo  ', '   obKbKbo  ', '   oKKKKKo  ', '   ooooooo  '] },
    toybrick: { pal: { o: '#6e1a12', R: '#d84a3a', r: '#a8352a', h: '#f08a7a' }, rows: [
      '            ', '            ', '            ', '  oo oo oo  ', '  oh oh oh  ', 'oooooooooooo',
      'oRhRRRRRRRRo', 'oRRRRRRRRRRo', 'oRRRRRRRRRRo', 'orrrrrrrrrro', 'oooooooooooo', '            '] },
    dinoegg: { pal: { o: '#5a4a38', E: '#efe4c0', s: '#9a8a5a', h: '#fff9e6' }, rows: [
      '    oooo    ', '   oEEEEo   ', '  oEhEEsEo  ', '  oEhEEEEo  ', ' oEEEsEEEEo ', ' oEEEEEEsEo ',
      ' oEsEEEEEEo ', ' oEEEEsEEEo ', '  oEEEEEEo  ', '  oEEsEEEo  ', '   oooooo   ', '            '] },
    helmet: { pal: { o: '#5a3a10', Y: '#e0b040', y: '#b8861e', R: '#d84a3a', r: '#a8352a' }, rows: [
      '  RRRRRRR   ', ' RrRrRrRrR  ', '    ooo     ', '  ooYYYoo   ', ' oYYYYYyYo  ', ' oYYyYYYyo  ',
      ' oYYYYYYYo  ', ' oyoooooyo  ', ' oyo   oyo  ', ' oyo   oyo  ', '  o     o   ', '            '] },
    fluff: { pal: { d: '#4e3020', B: '#7a4f2e', L: '#a8754f' }, rows: [
      '            ', '    d  d    ', '   dBd dB   ', '  dBLBdBBd  ', ' dBBLBBLBd  ', ' dBLBBBBLBd ',
      'dBBBLBBBBBd ', 'dBLBBBLBBLd ', ' dBBBBBBBd  ', '  dBBLBBd   ', '   dd dd    ', '            '] },
    quill: { pal: { W: '#f4efe4', w: '#c9c3b5', K: '#1d1d24', b: '#2f4f8a' }, rows: [
      '         WW ', '        WWw ', '       WWw  ', '      WWw   ', '     WWw    ', '    WWw     ',
      '   WWw      ', '  Ww        ', '  K         ', ' K          ', ' b          ', 'bb          '] },
    papyrus: { pal: { o: '#7a5a2a', P: '#efd9a0', p: '#d9bd7a', k: '#3a2a1a', r: '#b04030' }, rows: [
      '            ', ' oo      oo ', 'oppooooooppo', 'opPPPPPPPPpo', 'opPkkPkPrPpo', 'opPPPPPPPPpo',
      'opPkPkkPkPpo', 'opPPPPPPPPpo', 'opPkkPrkPPpo', 'oppooooooppo', ' oo      oo ', '            '] },
    breadmould: { pal: { o: '#4a2a18', C: '#c87a4a', c: '#9a5430', B: '#e8c070' }, rows: [
      '            ', '   BBBBBB   ', '  oBBBBBBo  ', '  oCCCCCCo  ', '  oCcCCCCo  ', '   oCCCCo   ',
      '   oCcCCo   ', '    oCCo    ', '    oCco    ', '    oCCo    ', '     oo     ', '            '] },
    canopic: { pal: { o: '#4a3a28', A: '#e6d6b0', a: '#c4b088', K: '#2b2620', G: '#f0c446', k: '#3a2a1a' }, rows: [
      '   o    o   ', '   oKooKo   ', '   oKKKKo   ', '   oKGKKo   ', '    oKKo    ', '  oooooooo  ',
      '  oAAAAAAo  ', '  oAaAAAAo  ', '  oAkkkkAo  ', '  oAAAAAAo  ', '   oAAAAo   ', '    oooo    '] },
    scarabcharm: { pal: { o: '#1f3a3a', T: '#3fb8a8', t: '#2a8478', G: '#f0c446' }, rows: [
      '            ', '     oo     ', '    oTTo    ', '  oooooooo  ', ' oTTTGGTTTo ', ' oTtTGGTtTo ',
      ' oTTTGGTTTo ', ' oTtTGGTtTo ', '  oTTGGTTo  ', '   oTGGTo   ', '    oooo    ', '            '] },
    shabti: { pal: { o: '#1f3a3a', F: '#5fc8c0', f: '#3a9a90', k: '#1d2a2a' }, rows: [
      '    oooo    ', '   okkkko   ', '  okFFFFko  ', '  okkFFkko  ', '   oFFFFo   ', '   ofkkfo   ',
      '   oFFFFo   ', '   oFkFko   ', '   oFFFFo   ', '   oFkkFo   ', '   oFFFFo   ', '    oooo    '] },
    kohl: { pal: { o: '#2a2a2a', S: '#d8d0c0', s: '#b0a690', k: '#1d1d24', W: '#8a6a3a' }, rows: [
      '        WW  ', '       WW   ', '    ooWWo   ', '    okWko   ', '   oSSSSSo  ', '  oSSsSSSSo ',
      '  oSsSSSSSo ', '  oSSSSSSSo ', '  osSSSSSso ', '   oSSSSSo  ', '    ooooo   ', '            '] },
    senet: { pal: { o: '#3b2616', B: '#c8964a', b: '#e8c37a', P: '#2b2620', W: '#f4efe4' }, rows: [
      '            ', '            ', 'oooooooooooo', 'obBbBbBbBbBo', 'oBPBbBbWbBbo', 'obBbBbPbBWBo',
      'oBbBbBbBbBbo', 'oooooooooooo', 'oBBBBBBBBBBo', 'oBBBBooBBBBo', 'oooooooooooo', '            '] },
    rosetta: { pal: { o: '#1d1d24', G: '#4a4e56', L: '#9aa3ad' }, rows: [
      '   oooo     ', '  oGGGGoo   ', ' oGLLGLGGo  ', ' oGGGGGGGGo ', ' oGLGLLGLGo ', ' oGGGGGGGGo ',
      ' oGLLGLLGGo ', ' oGGGGGGGGo ', ' oGLGLGLLGo ', ' oGGGGGGGGo ', ' oGLLGLGLGo ', ' oooooooooo '] },
    shades: { pal: { k: '#1d1d24', L: '#2f4f8a', l: '#7fb0e0' }, rows: [
      '            ', '            ', '            ', 'kkkkkkkkkkkk', 'kLlLLkkLlLLk', 'kLLlLkkLLlLk',
      ' kLLk  kLLk ', '  kk    kk  ', '            ', '            ', '            ', '            '] },
    lolly: { pal: { o: '#6e1a32', R: '#ff6b9a', r: '#d84a7a', Y: '#ffd27a', W: '#c9a26a' }, rows: [
      '   oooooo   ', '  oRRRRRRo  ', '  oRrRRRRo  ', '  oYYYYYYo  ', '  oYYYYYYo  ', '  oRRRRrRo  ',
      '  oRRRRRRo  ', '  oRRRRRRo  ', '   oooooo   ', '     WW     ', '     WW     ', '     WW     '] },
    trainer: { pal: { o: '#1d1d24', W: '#f4efe4', B: '#2f6fd8', L: '#ff6b9a', w: '#c9c3b5' }, rows: [
      '            ', '            ', '            ', '   ooo      ', '  oWWWo     ', '  oWBWWoo   ',
      '  oWWBWWWoo ', ' oWWWWBWWWWo', ' oWWWWWWWWWo', ' oLwwwwwwwwo', '  oooooooooo', '            '] },
    selfie: { pal: { k: '#1d1d24', M: '#9aa3ad', S: '#5fe0f0' }, rows: [
      ' kkkk       ', ' kSSk       ', ' kSSk       ', ' kkkk       ', '    M       ', '     M      ',
      '      M     ', '       M    ', '        M   ', '         kk ', '         kk ', '            '] },
    pad: { pal: { o: '#2b3038', G: '#a7adb5', d: '#3b4048', c: '#37c8dc', r: '#ef7724' }, rows: [
      '            ', '            ', '  oooooooo  ', ' oGGGGGGGGo ', 'oGGdGGGGcGGo', 'oGdddGGcGrGo',
      'oGGdGGGGcGGo', 'oGGGGooGGGGo', 'oGGGo  oGGGo', ' ooo    ooo ', '            ', '            '] }
  };
  var artCache = {};
  S.artCanvas = function (id) {
    if (!artCache[id]) { var a = ART[id] || ART.handaxe; artCache[id] = fromMap(a.rows, a.pal, 12); }
    return artCache[id];
  };
  S.art = function (ctx, id, x, y) { ctx.drawImage(S.artCanvas(id), Math.round(x) - 6, Math.round(y) - 11); };

  /* ---------- crates ---------- */
  S.crate = function (ctx, x, y, kind, t) {
    var X = Math.round(x) - 5, Y = Math.round(y) - 9;
    var gold = kind === 'bark';
    ctx.fillStyle = '#3b2616'; ctx.fillRect(X, Y, 11, 9);
    ctx.fillStyle = gold ? '#e0b040' : '#b07a46'; ctx.fillRect(X + 1, Y + 1, 9, 7);
    ctx.fillStyle = gold ? '#b8861e' : '#8a5a32'; ctx.fillRect(X + 1, Y + 4, 9, 1);
    ctx.fillStyle = gold ? '#5c3a10' : '#ffffff';
    ctx.fillRect(X + 4, Y + 2, 3, 2); ctx.fillRect(X + 3, Y + 1, 1, 1); ctx.fillRect(X + 7, Y + 1, 1, 1); ctx.fillRect(X + 5, Y + 1, 1, 1);
    ctx.fillRect(X + 4, Y + 5, 3, 2);
    if (gold && (t >> 4) % 2) { ctx.fillStyle = '#fff3c8'; ctx.fillRect(X - 1, Y - 2, 1, 1); ctx.fillRect(X + 11, Y + 1, 1, 1); }
  };

  /* ---------- Bonnie: a brown toy poodle with no tail ---------- */
  function curls(cx, cy, rx, ry, seed, fill) {
    /* a soft lumpy outline of little curls, then the fluffy fill */
    var i, a;
    for (i = 0; i < 10; i++) { a = i / 10 * Math.PI * 2 + seed; e(cx + Math.cos(a) * rx * 0.82, cy + Math.sin(a) * ry * 0.82, 1.9, 1.7, '#3e2416'); }
    e(cx, cy, rx, ry, '#3e2416');
    for (i = 0; i < 10; i++) { a = i / 10 * Math.PI * 2 + seed; e(cx + Math.cos(a) * rx * 0.82, cy + Math.sin(a) * ry * 0.82, 1.15, 0.95, fill); }
    e(cx, cy, rx - 0.9, ry - 0.9, fill);
  }
  function curlDots(x0, y0, w, h, seed) {
    for (var y = 0; y < h; y += 2) for (var x = (y >> 1) % 2; x < w; x += 3) if (((x * 7 + y * 13 + seed) % 5) < 2) r(x0 + x, y0 + y, 1, 1, '#c99566');
  }
  function bonnieBody(f, carry, woof) {
    var d = '#3e2416', B = '#9a6442', L = '#c99566', S2 = '#74472c', SN = '#c08a5c';
    var bob = f % 2 ? -1 : 0, earY = f % 2 ? 1 : 0, k;
    OY += bob;
    /* legs: a diagonal trot, slim legs with fluffy cuffs; the far legs are darker */
    var legs = [[[3, 0], [7, 1], [12, 1], [16, 0]], [[4, 1], [6, 0], [13, 0], [15, 1]], [[5, 0], [5, 1], [14, 1], [14, 0]], [[4, 1], [6, 0], [13, 0], [15, 1]]][f % 4];
    if (woof) legs = [[2, 0], [6, 0], [13, 0], [16, 0]];
    for (k = 0; k < 4; k++) {
      var lx = legs[k][0], up = legs[k][1], far = k === 1 || k === 2;
      r(lx, 10, 2, 3 - up, d); r(lx, 10, 1, 2 - up, far ? S2 : B);
      r(lx - 1, 12 - up, 4, 2, d); r(lx, 12 - up, 2, 1, far ? S2 : L);
    }
    /* body: a fluffy cloud, round at the back where there is no tail */
    curls(8.5, 7.3, 6.2, 3.4, 0.3, B);
    curlDots(4, 5, 10, 4, 1);
    /* collar */
    r(13, 6, 1, 3, '#007291'); r(13, 9, 1, 1, '#f0c446');
    /* head: big and round with a topknot */
    curls(16.5, 3.4, 3.6, 3.4, 1.1, B);
    e(16.2, -0.8, 2.6, 1.8, d); e(16.2, -0.7, 1.8, 1.1, B); r(15, -1, 1, 1, L); r(17, -1, 1, 1, L);
    r(15, 1, 1, 1, L); r(17, 2, 1, 1, L);
    /* short pale snout and a shiny black nose */
    e(20.4, 4.6, 2, 1.6, d); e(20.4, 4.4, 1.4, 0.9, SN); r(22, 3, 1, 2, '#1d1d24'); r(22, 3, 1, 1, '#5a5a62');
    /* eye with a glint */
    r(18, 2, 2, 2, '#1d1d24'); r(18, 2, 1, 1, '#ffffff');
    /* long floppy ear */
    if (woof) { e(14.3, 0.5, 1.7, 2.6, d); e(14.3, 0.5, 1.0, 1.9, S2); }
    else { e(14.4, 5.4 + earY, 1.9, 3.4, d); e(14.4, 5.4 + earY, 1.1, 2.6, S2); r(14, 4 + earY, 1, 1, B); r(15, 6 + earY, 1, 1, B); }
    /* mouth */
    if (woof) { r(19, 6, 4, 2, '#3a1414'); r(20, 7, 2, 1, '#e88f8f'); r(21, 6, 1, 1, '#ffffff'); }
    else if (f % 4 === 1) r(20, 6, 1, 2, '#e88f8f');
    if (carry) { r(19, 6, 7, 6, '#3b2616'); r(20, 7, 5, 4, '#b07a46'); r(20, 9, 5, 1, '#8a5a32'); r(22, 7, 1, 2, '#ffffff'); }
    OY -= bob;
  }
  var bonCache = {};
  S.bonnie = function (ctx, x, y, face, f, carry, woof) {
    var k = face + '|' + (f % 4) + '|' + (carry ? 1 : 0) + '|' + (woof ? 1 : 0);
    var c = bonCache[k];
    if (!c) {
      c = document.createElement('canvas'); c.width = 34; c.height = 24;
      g = c.getContext('2d');
      if (face < 0) { g.translate(34, 0); g.scale(-1, 1); }
      OX = 5; OY = 6;
      bonnieBody(f % 4, carry, woof);
      bonCache[k] = c;
    }
    ctx.drawImage(c, Math.round(x) - 17, Math.round(y) - 20);
  };

  /* ---------- Jay, for the commentary box: messy brown hair, big eyebrows ----------
     mood: null, 'wow' (eyebrows up), 'grin' or 'blink' */
  S.jay = function (canvas, talk, mood) {
    canvas.width = 20; canvas.height = 20;
    g = canvas.getContext('2d'); OX = 0; OY = 0;
    g.clearRect(0, 0, 20, 20);
    var hair = '#5a3a22', hairL = '#7d5434', skin = '#f1c9a5', sk2 = '#dba582', out = '#7a4f36', brow = '#3a2414';
    /* shirt and neck */
    r(2, 16, 16, 4, '#007291'); r(2, 17, 2, 3, '#005a73'); r(16, 17, 2, 3, '#005a73');
    r(8, 14, 4, 3, sk2); r(7, 16, 2, 1, '#fef8f4'); r(11, 16, 2, 1, '#fef8f4'); r(9, 17, 2, 1, '#fef8f4');
    /* ears */
    r(3, 9, 2, 3, out); r(4, 10, 1, 1, skin); r(15, 9, 2, 3, out); r(15, 10, 1, 1, skin);
    /* face with a soft shadow on the right */
    e(10, 10.5, 5.6, 6.2, out); e(10, 10.5, 4.8, 5.4, skin);
    r(14, 9, 1, 5, sk2); r(13, 14, 1, 1, sk2);
    /* messy hair */
    e(10, 5, 6, 3.2, hair);
    r(4, 3, 2, 3, hair); r(6, 1, 2, 3, hair); r(9, 0, 2, 3, hair); r(12, 1, 2, 3, hair); r(14, 2, 2, 3, hair); r(16, 4, 1, 3, hair);
    r(3, 5, 1, 2, hair); r(11, 0, 1, 1, hair); r(7, 0, 1, 1, hair);
    r(5, 6, 10, 1, hair); r(4, 7, 2, 2, hair); r(13, 7, 2, 1, hair); r(9, 7, 1, 1, hair);
    r(7, 2, 1, 2, hairL); r(10, 1, 1, 2, hairL); r(13, 3, 1, 2, hairL); r(6, 5, 2, 1, hairL); r(11, 4, 2, 1, hairL);
    /* big eyebrows */
    if (mood === 'wow') { r(6, 7, 3, 1, brow); r(5, 8, 1, 1, brow); r(11, 7, 3, 1, brow); r(14, 8, 1, 1, brow); }
    else if (mood === 'grin') { r(6, 8, 3, 2, brow); r(11, 7, 3, 1, brow); r(11, 8, 3, 1, brow); }
    else { r(6, 8, 3, 2, brow); r(11, 8, 3, 2, brow); }
    /* eyes */
    if (mood === 'blink') { r(7, 11, 2, 1, out); r(11, 11, 2, 1, out); }
    else if (mood === 'wow') { r(7, 10, 2, 2, '#ffffff'); r(8, 10, 1, 2, '#1d1d24'); r(11, 10, 2, 2, '#ffffff'); r(12, 10, 1, 2, '#1d1d24'); }
    else { r(7, 10, 2, 1, '#1d1d24'); r(11, 10, 2, 1, '#1d1d24'); r(7, 11, 2, 1, sk2); r(11, 11, 2, 1, sk2); }
    /* nose */
    r(10, 11, 1, 2, sk2); r(9, 13, 1, 1, sk2);
    /* mouth */
    if (mood === 'wow') { r(9, 13, 2, 3, '#5a1f14'); r(9, 15, 2, 1, '#c45a50'); }
    else if (talk) { r(8, 13, 4, 2, '#5a1f14'); r(9, 13, 2, 1, '#ffffff'); r(9, 14, 2, 1, '#c45a50'); }
    else if (mood === 'grin') { r(7, 13, 6, 2, '#5a1f14'); r(8, 13, 4, 1, '#ffffff'); }
    else { r(8, 14, 4, 1, '#8a3b2b'); r(7, 13, 1, 1, '#8a3b2b'); r(12, 13, 1, 1, '#8a3b2b'); }
  };

  /* ---------- birds for the sky ---------- */
  S.bird = function (ctx, x, y, f) {
    var X = Math.round(x), Y = Math.round(y);
    ctx.fillStyle = '#3a4a55';
    if (f % 2) { ctx.fillRect(X - 3, Y - 1, 2, 1); ctx.fillRect(X - 1, Y, 3, 1); ctx.fillRect(X + 2, Y - 1, 2, 1); }
    else { ctx.fillRect(X - 3, Y + 1, 2, 1); ctx.fillRect(X - 1, Y, 3, 1); ctx.fillRect(X + 2, Y + 1, 2, 1); }
  };

  window.B5SPRITES = S;
})();
