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

  /* Local sprite space: 24 wide, feet on row 24, body centre line at x = 12, facing right. */
  function body(pose, f, bl, era) {
    var air = pose === 'jump';
    var wild = pose === 'panic' || pose === 'fall' || pose === 'drown';
    var tense = pose === 'charge' || pose === 'swing' || pose === 'dig';

    if (era === 'fut') {
      var flame = air || pose === 'cheer';
      r(2, 16, 3, 6, MT);
      r(2, 22, 3, 1, flame && f % 2 ? '#ffd27a' : OR);
      if (flame) r(3, 23, 1, 1 + (f % 2), '#ffd27a');
    }

    e(4, 11, 3.5, 1.6, D); e(4, 11, 2.5, 0.8, K);
    e(20, 11, 2.8, 1.6, D); e(20, 11, 1.8, 0.8, K);
    e(12, 20, 5.8, 5, D); e(12, 12, 6.8, 5.8, D);
    e(12, 12, 5.8, 4.8, K); e(12, 20, 4.8, 4, K); e(12, 21, 3, 2.5, BL);

    if (era === 'pre') {
      e(12, 21, 4.8, 3.6, FU);
      r(10, 20, 1, 1, FD); r(14, 22, 1, 1, FD); r(12, 19, 1, 1, FD); r(9, 23, 1, 1, FD); r(15, 20, 1, 1, FD);
    }
    if (era === 'fut') { e(12, 21, 4, 3.2, PT); r(9, 21, 7, 1, CY); r(12, 19, 1, 1, OR); }
    if (era === 'egypt') {
      /* linen kilt with a gold belt, and a broad collar of gold and lapis */
      e(12, 22.4, 4.7, 2.3, LN); r(12, 22, 1, 3, LN2); r(8, 21, 9, 1, AU);
      r(8, 17, 9, 1, AU); r(7, 18, 11, 1, LB); r(8, 19, 9, 1, AU); r(9, 18, 1, 1, TQ); r(15, 18, 1, 1, TQ);
    }

    /* brows */
    if (wild) { r(7, 8, 3, 1, D); r(14, 8, 3, 1, D); }
    else if (tense) { r(7, 8, 2, 1, D); r(9, 9, 1, 1, D); r(15, 8, 2, 1, D); r(14, 9, 1, 1, D); }
    else { r(7, 8, 3, 1, D); r(14, 9, 3, 1, D); }

    /* eyes */
    if (pose === 'cheer') {
      r(7, 11, 1, 1, D); r(8, 10, 1, 1, D); r(9, 11, 1, 1, D);
      r(14, 11, 1, 1, D); r(15, 10, 1, 1, D); r(16, 11, 1, 1, D);
    } else if (wild) {
      r(7, 9, 3, 4, Y); r(8, 10, 1, 1, P); r(14, 9, 3, 4, Y); r(15, 10, 1, 1, P);
      r(18, 6, 1, 2, '#7fd0f0');
    } else if (bl) {
      r(7, 11, 3, 1, D); r(14, 11, 3, 1, D);
    } else {
      r(7, 10, 3, 3, Y); r(8, 11, 2, 2, P); r(8, 11, 1, 1, W);
      r(14, 10, 3, 3, Y); r(15, 11, 2, 2, P); r(15, 11, 1, 1, W);
    }

    if (era === 'egypt' && !wild && !bl && pose !== 'cheer') { r(7, 9, 3, 1, P); r(6, 9, 1, 1, P); r(14, 9, 3, 1, P); r(17, 9, 1, 1, P); }

    /* mouth */
    if (wild) { r(10, 15, 3, 2, M); r(10, 15, 1, 1, W); }
    else if (pose === 'cheer') { r(8, 14, 8, 2, M); r(8, 14, 8, 1, W); r(10, 14, 1, 1, M); r(13, 14, 1, 1, M); }
    else if (tense) { r(9, 14, 6, 3, M); r(9, 15, 6, 1, W); }
    else if (air) { r(11, 15, 2, 2, M); }
    else { r(9, 15, 5, 1, M); r(14, 14, 1, 1, M); r(10, 16, 1, 1, W); }

    /* head gear */
    if (era === 'fut') { r(6, 6, 12, 1, GL); r(8, 5, 3, 2, CY); r(13, 5, 3, 2, CY); r(8, 5, 1, 1, CYL); }
    else if (era === 'pre') { r(13, 7, 3, 1, PL); r(14, 6, 1, 3, PL); }
    if (era === 'pre') { r(9, 5, 6, 1, BN); r(8, 4, 1, 1, BN); r(8, 6, 1, 1, BN); r(15, 4, 1, 1, BN); r(15, 6, 1, 1, BN); }
    if (era === 'egypt') {
      /* striped headcloth with a gold band and side flaps */
      r(8, 4, 9, 1, LB); r(7, 5, 11, 2, LB);
      r(8, 4, 1, 3, AU); r(11, 4, 1, 3, AU); r(14, 4, 1, 3, AU); r(17, 5, 1, 2, AU);
      r(6, 7, 13, 1, AU); r(12, 6, 1, 1, '#d84a3a');
      r(5, 8, 1, 7, LB); r(5, 10, 1, 1, AU); r(5, 13, 1, 1, AU);
      r(19, 8, 1, 7, LB); r(19, 10, 1, 1, AU); r(19, 13, 1, 1, AU);
    }

    /* feet */
    if (air) { r(9, 23, 3, 1, D); r(12, 23, 3, 1, D); }
    else if (pose === 'walk' && f % 2) { r(9, 24, 3, 1, D); r(12, 23, 3, 1, D); }
    else { r(8, 24, 3, 1, D); r(13, 24, 3, 1, D); }

    /* arms and held kit */
    if (pose === 'cheer') {
      var u = f % 2;
      r(4, 14 - u, 2, 5, D); r(18, 14 - u, 2, 5, D);
      if (era === 'pre') { r(18, 9 - u, 1, 5, WD); r(17, 6 - u, 3, 3, WK); }
      if (era === 'fut') { r(17, 11 - u, 4, 2, MT); r(21, 11 - u, 1, 2, CY); }
      if (era === 'egypt') { r(18, 8 - u, 1, 7, AU); r(16, 9 - u, 5, 1, AU); r(17, 4 - u, 1, 4, AU); r(19, 4 - u, 1, 4, AU); r(18, 3 - u, 1, 1, AU); r(18, 7 - u, 1, 1, AD); }
    } else if (wild) {
      if (f % 2) { r(4, 14, 2, 4, D); r(18, 19, 2, 3, D); }
      else { r(4, 19, 2, 3, D); r(18, 14, 2, 4, D); }
    } else if (air) {
      r(3, 16, 2, 3, D); r(19, 16, 2, 3, D);
    } else if (pose === 'aim' || pose === 'charge') {
      r(5, 19, 2, 3, D); r(17, 18, 4, 2, D);
    } else if (pose === 'swing') {
      r(5, 19, 2, 3, D);
      if (f === 0) {
        r(17, 13, 2, 6, D);
        if (era === 'pre') { r(17, 5, 2, 8, WD); r(16, 2, 4, 4, WK); }
        else if (era === 'egypt') { r(17, 10, 2, 3, WK); r(18, 4, 2, 6, BZ); r(19, 2, 2, 3, BZ); r(21, 1, 2, 2, BZ); r(17, 5, 1, 4, AD); }
        else { r(16, 10, 4, 4, CY); r(17, 11, 2, 2, CYL); }
      } else {
        r(17, 18, 5, 2, D);
        if (era === 'pre') { r(21, 17, 7, 2, WD); r(27, 15, 3, 5, WK); }
        else if (era === 'egypt') { r(21, 18, 2, 2, WK); r(23, 17, 5, 2, BZ); r(27, 15, 2, 3, BZ); r(28, 13, 2, 2, BZ); r(24, 19, 3, 1, AD); }
        else { r(22, 16, 4, 4, CY); r(23, 17, 2, 2, CYL); r(26, 17, 2, 1, CYL); r(26, 19, 2, 1, CYL); }
      }
    } else if (pose === 'dig') {
      var dd = f % 2;
      r(5, 19, 2, 3, D); r(17, 20 + dd, 4, 2, D);
      if (era === 'pre') { r(21, 21 + dd, 4, 1, BN); r(24, 19 + dd, 2, 4, BN); }
      else if (era === 'egypt') { r(21, 21 + dd, 5, 1, CU); r(26, 21 + dd, 1, 1, '#f0b07a'); r(18, 16 - dd, 3, 3, WD); }
      else { r(21, 20 + dd, 4, 2, MT); r(25, 20 + dd, 2, 2, CY); r(27, 20 + dd * 2, 1, 1, CYL); }
    } else {
      r(5, 19, 2, 3, D); r(17, 19, 2, 3, D);
      if (era === 'pre') { r(18, 14, 1, 6, WD); r(17, 11, 3, 3, WK); }
      if (era === 'egypt') { r(18, 9, 1, 12, WD); r(18, 6, 1, 3, CU); r(17, 8, 3, 1, CU); }
    }
  }

  var cache = {};
  S.get = function (era, pose, f, bl, face) {
    var k = era + '|' + pose + '|' + f + '|' + (bl ? 1 : 0) + '|' + face;
    var c = cache[k];
    if (c) return c;
    c = document.createElement('canvas');
    c.width = 36; c.height = 32;
    g = c.getContext('2d');
    if (face < 0) { g.translate(36, 0); g.scale(-1, 1); }
    OX = 6; OY = 4;
    body(pose, f, bl, era);
    cache[k] = c;
    return c;
  };

  /* x, y = feet contact point in world pixels. rot = quarter turns (backflip). */
  S.draw = function (ctx, x, y, face, era, pose, f, bl, rot, alpha) {
    var c = S.get(era, pose, f, bl, face);
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

  /* Time portal: ring of light that zaps a Snag home. k goes 0 to 1. */
  S.portal = function (ctx, x, y, k, t) {
    var rad = 6 + Math.sin(Math.min(1, k * 1.4) * Math.PI) * 9;
    for (var i = 0; i < 14; i++) {
      var a = i / 14 * Math.PI * 2 + t * 0.12;
      ctx.fillStyle = i % 2 ? '#7b5cff' : CY;
      ctx.fillRect(Math.round(x + Math.cos(a) * rad), Math.round(y + Math.sin(a) * rad * 1.3), 2, 2);
    }
    if (k > 0.2 && k < 0.85) {
      ctx.fillStyle = '#d9cfff';
      ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
    }
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
  function bonnieBody(f, carry, woof) {
    var d = '#4e3020', B = '#8a5a3c', L = '#b07a52';
    e(8, 8, 6.6, 3.8, d); e(13, 7, 3.4, 3.8, d); e(15, 4, 3.9, 3.6, d); e(15, 1.5, 2.6, 1.8, d);
    e(8, 8, 5.6, 2.9, B); e(13, 7, 2.6, 3, B); e(15, 4, 3, 2.8, B); e(15, 1.5, 1.8, 1.1, B);
    e(13, 6, 1.4, 2.6, d);
    for (var i = 0; i < 9; i++) { var hx = 3 + ((i * 7) % 11), hy = 6 + ((i * 3) % 4); r(hx, hy, 1, 1, L); }
    r(15, 1, 1, 1, L); r(16, 3, 1, 1, L);
    r(18, 4, 2, 2, B); r(19, 4, 1, 1, '#1d1d24');
    r(16, 3, 1, 1, '#1d1d24');
    r(12, 8, 2, 1, '#007291');
    if (woof) { r(17, 6, 3, 1, '#3a1414'); r(18, 7, 1, 1, '#e88f8f'); }
    else if (f % 2) r(18, 6, 1, 1, '#e88f8f');
    var a = f % 2 ? [[3, 3], [6, 2], [11, 2], [14, 3]] : [[3, 2], [6, 3], [11, 3], [14, 2]];
    for (var k = 0; k < 4; k++) {
      r(a[k][0], 10, 2, a[k][1], d);
      r(a[k][0] - 1 + (k % 2), 10 + a[k][1], 3, 1, B);
    }
    if (carry) {
      r(15, 7, 7, 6, '#3b2616'); r(16, 8, 5, 4, '#b07a46'); r(18, 9, 1, 2, '#ffffff');
    }
  }
  var bonCache = {};
  S.bonnie = function (ctx, x, y, face, f, carry, woof) {
    var k = face + '|' + (f % 2) + '|' + (carry ? 1 : 0) + '|' + (woof ? 1 : 0);
    var c = bonCache[k];
    if (!c) {
      c = document.createElement('canvas'); c.width = 28; c.height = 20;
      g = c.getContext('2d');
      if (face < 0) { g.translate(28, 0); g.scale(-1, 1); }
      OX = 4; OY = 4;
      bonnieBody(f, carry, woof);
      bonCache[k] = c;
    }
    ctx.drawImage(c, Math.round(x) - 15, Math.round(y) - 18);
  };

  /* ---------- Jay, for the commentary box: messy brown hair, big eyebrows ---------- */
  S.jay = function (canvas, talk) {
    canvas.width = 20; canvas.height = 20;
    g = canvas.getContext('2d'); OX = 0; OY = 0;
    g.clearRect(0, 0, 20, 20);
    var hair = '#5a3a22', skin = '#f1c9a5', sk2 = '#d9a37f', out = '#7a4f36';
    r(3, 16, 14, 4, '#007291'); r(8, 16, 4, 2, '#fef8f4'); r(9, 18, 2, 2, '#007291');
    r(4, 10, 1, 3, skin); r(15, 10, 1, 3, skin);
    e(10, 10.5, 5.6, 6.2, out); e(10, 10.5, 4.8, 5.4, skin);
    e(10, 5, 6, 3.2, hair);
    r(4, 3, 2, 3, hair); r(6, 1, 2, 3, hair); r(9, 0, 2, 3, hair); r(12, 1, 2, 3, hair); r(14, 2, 2, 3, hair); r(16, 4, 1, 3, hair);
    r(5, 6, 10, 1, hair); r(4, 7, 2, 2, hair);
    r(6, 8, 3, 2, '#3a2414'); r(11, 8, 3, 2, '#3a2414');
    r(7, 10, 2, 1, '#1d1d24'); r(11, 10, 2, 1, '#1d1d24');
    r(10, 11, 1, 2, sk2);
    if (talk) { r(8, 13, 4, 2, '#5a1f14'); r(9, 13, 2, 1, '#ffffff'); }
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
