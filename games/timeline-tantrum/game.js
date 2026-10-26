/* Timeline Tantrum engine, Stage 1.
   Terrain is a per pixel collision mask (1 = solid) paired with an ImageData painting of it.
   That keeps craters, tunnels and collisions exact and cheap: an explosion clears a circle in
   both, so projectiles and Snags react to the new shape on the very next tick.
   Gameplay runs on a fixed 60 tick per second step, so physics behave the same on any screen. */
(function () {
  'use strict';

  var ER = window.B5ERAS, MAPS = window.B5MAPS, SP = window.B5SPRITES;
  var KEY = 'b5.tantrum.v1.';
  function store(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(KEY + k);
      if (v === null) localStorage.removeItem(KEY + k); else localStorage.setItem(KEY + k, v);
    } catch (e) { /* storage blocked: play on without saving */ }
    return null;
  }
  var Q = new URLSearchParams(location.search);
  var TEST = Q.get('test') || '';
  var FAST = Math.max(1, Math.min(8, parseInt(Q.get('fast') || '1', 10) || 1));

  var WW = 1100, WH = 460, WATER = 432, G = 0.16, STEP = 1000 / 60;
  var WEAP = {
    lob:   { kind: 'proj', wind: true,  impact: true,  R: 26, dmg: 46, vmax: 10 },
    bomb:  { kind: 'proj', wind: false, impact: false, R: 30, dmg: 50, vmax: 8.5, fuse: 180, bounce: 0.45 },
    shove: { kind: 'melee', dmg: 22 },
    dig:   { kind: 'dig', time: 110 },
    bark:  { kind: 'bark', R: 36, dmg: 48 },
    /* Stone Snags: knockback and close range, less precise */
    boulder: { kind: 'proj', wind: false, impact: false, hit: true, R: 24, dmg: 40, vmax: 7.5, fuse: 240, bounce: 0.62, knock: 1.5, ammo: 3 },
    gourd:   { kind: 'place', wind: false, impact: false, R: 40, dmg: 56, fuse: 300, bounce: 0.3, knock: 1.2, ammo: 2 },
    vine:    { kind: 'vine', range: 150, tool: true },
    wall:    { kind: 'wall', ammo: 2 },
    mega:    { kind: 'strike', style: 'boulder', R: 46, dmg: 58, ammo: 1, unlock: 10, knock: 1.3 },
    /* Neon Snags: precision and positioning, short on ammo */
    disc:    { kind: 'proj', wind: false, impact: false, hit: true, grav: 0, R: 16, dmg: 30, vmax: 7, bounce: 1, bounces: 4, life: 360, ammo: 3 },
    laser:   { kind: 'beam', dmg: 28, range: 420, ammo: 2 },
    jet:     { kind: 'jet', fuel: 150, tool: true },
    shield:  { kind: 'shield', ammo: 1 },
    orbital: { kind: 'strike', style: 'beam', R: 22, dmg: 55, ammo: 1, unlock: 10 },
    /* Sun Snags: calculated and sneaky. Direct hits, crawling beetles, sand tricks */
    spear:    { kind: 'proj', wind: true, impact: true, R: 9, dmg: 12, direct: 30, vmax: 11, grav: 0.55, ammo: 3 },
    scarab:   { kind: 'proj', wind: false, impact: false, hit: true, crawl: true, R: 24, dmg: 40, vmax: 8, fuse: 330, bounce: 0.3, ammo: 2 },
    sled:     { kind: 'sled', fuel: 300, tool: true },
    sandwall: { kind: 'dune', ammo: 2 },
    sun:      { kind: 'strike', style: 'sun', R: 32, dmg: 52, ammo: 1, unlock: 10, knock: 1.1 },
    /* Sudden Death */
    meteor:  { kind: 'proj', wind: false, impact: true, R: 18, dmg: 22 }
  };
  var SD_TURN = 24;
  var WORDER = ['lob', 'bomb', 'shove', 'dig'];
  var MAP = MAPS.jungle, LOOK = 'normal';
  var ARTS = window.B5ARTEFACTS, JAY = window.B5JAY, TL = window.B5TIMELINE, RIPPLE = window.B5RIPPLE;
  var MAP_IDS = ['jungle', 'desert', 'city'];
  var READY = TL.filter(function (e) { return e.ready && ER[e.id]; }).map(function (e) { return e.id; });
  function realOf(mid) { return ARTS[mid] || ARTS.jungle; }
  function glitchOf(mid) { return ARTS[mid === 'jungle' ? 'glitches' : mid + 'Glitches'] || ARTS.glitches; }
  function yearOf(era) { for (var i = 0; i < TL.length; i++) if (TL[i].id === era) return TL[i].year; return 0; }
  /* the squad you face when none is picked: the nearest other era in time */
  function defaultFoe(era, near) {
    var y = near === undefined ? yearOf(era) : near;
    return READY.filter(function (e) { return e !== era; }).sort(function (a, b) { return Math.abs(yearOf(a) - y) - Math.abs(yearOf(b) - y); })[0];
  }
  function foeOf(o) { return o.foe && o.foe !== o.era && READY.indexOf(o.foe) >= 0 ? o.foe : defaultFoe(o.era); }
  /* How each era's computer thinks. fw: how much it hates hurting its own side.
     kill and water: bonus for finishing a Snag off or knocking it towards the water. */
  var AIP = {
    pre:   { fw: 1.0, lob: 1,    bomb: 1.15, shove: 1.4, kill: 25, water: 6 },
    fut:   { fw: 2.0, lob: 1.1,  bomb: 1,    shove: 1,   kill: 25, water: 6 },
    egypt: { fw: 2.5, lob: 1.05, bomb: 1.05, shove: 1.1, kill: 40, water: 16, weak: 0.6 }
  };
  function allArts() { var a = []; MAP_IDS.forEach(function (m) { a = a.concat(realOf(m), glitchOf(m)); }); return a; }
  function setMap(id, look) { MAP = MAPS[id] || MAPS.jungle; LOOK = look || 'normal'; game.cars = []; buildSky(); buildCityBg(); }
  var BARK_NAME = "Bonnie's Bark", BARK_BLURB = 'Rare! Bonnie charges out of a time portal and barks so hard the ground shakes.';
  function artInfo(id) {
    var all = allArts();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }
  function kitFor(team) {
    if (!team) return WORDER;
    var k = WORDER.concat(ER[team.era].kit || []);
    return team.bark > 0 ? k.concat(['bark']) : k;
  }
  function kitHas(team, wid) { return kitFor(team).indexOf(wid) >= 0; }
  function weaponName(era, wid) { return wid === 'bark' ? BARK_NAME : ER[era].weapons[wid].name; }
  /* What a squad can use right now: ammo left, or how many turns until it unlocks */
  function avail(team, wid) {
    var w = WEAP[wid];
    if (!w || !team) return { ok: false };
    if (wid === 'bark') return { ok: team.bark > 0, left: team.bark || 0 };
    if (w.unlock && game.turnNo < w.unlock) return { ok: false, locked: w.unlock - game.turnNo };
    if (w.ammo) {
      var left = team.ammo && team.ammo[wid] !== undefined ? team.ammo[wid] : w.ammo;
      return { ok: left > 0, left: left };
    }
    return { ok: true };
  }
  function useAmmo(team, wid) {
    if (wid === 'bark') { team.bark = Math.max(0, (team.bark || 0) - 1); return; }
    if (!WEAP[wid].ammo) return;
    team.ammo = team.ammo || {};
    team.ammo[wid] = Math.max(0, avail(team, wid).left - 1);
  }
  var MOODS = { sleepy: 'Sleepy', grumpy: 'Grumpy', legendary: 'Legendary' };

  function $(id) { return document.getElementById(id); }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function randn() { return (Math.random() + Math.random() + Math.random() - 1.5) / 0.5; }
  function hash(x, y) { var s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return s - Math.floor(s); }
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var cv = $('game'), ctx = cv.getContext('2d');
  var VW = 480, VH = 270, SCALE = 2;
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------------- terrain ---------------- */
  var terr = document.createElement('canvas'); terr.width = WW; terr.height = WH;
  var tctx = terr.getContext('2d');
  var img = null, data = null;
  var mask = new Uint8Array(WW * WH), burnt = new Uint8Array(WW * WH);
  var miniDirty = true;

  function solid(x, y) {
    x = Math.floor(x); y = Math.floor(y);
    if (x < 0 || x >= WW || y < 0) return false;
    if (y >= WH) return true;
    return mask[y * WW + x] === 1;
  }

  function blob(cx, cy, rx, ry, v) {
    for (var y = Math.floor(cy - ry - 2); y <= cy + ry + 2; y++) {
      for (var x = Math.floor(cx - rx - 2); x <= cx + rx + 2; x++) {
        if (x < 0 || y < 0 || x >= WW || y >= WH) continue;
        var dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry;
        var wob = 1 + 0.12 * Math.sin(x * 0.31) + 0.08 * Math.cos(y * 0.53);
        if (dx * dx + dy * dy <= wob) mask[y * WW + x] = v;
      }
    }
  }

  /* ---------- Future City: towers, stepped blocks, floating platforms, rooms ---------- */
  var zone = new Uint8Array(WW * WH);
  function fillZone(x0, y0, w, h, z, v) {
    for (var y = Math.max(0, y0); y < Math.min(WH, y0 + h); y++)
      for (var x = Math.max(0, x0); x < Math.min(WW, x0 + w); x++) { var i = y * WW + x; mask[i] = v === undefined ? 1 : v; if (v === undefined || v) zone[i] = z; }
  }
  function genCity(seed) {
    var R = rng(seed), i, x0, w, h;
    mask.fill(0); burnt.fill(0); zone.fill(0);
    x0 = 66;
    while (x0 < WW - 66) {
      w = Math.min(WW - 66 - x0, 40 + Math.floor(R() * 70)); h = 300 + Math.floor(R() * 75);
      fillZone(x0, h, w, WH - h, 0);
      x0 += w;
    }
    var towers = [];
    for (i = 0; i < 5; i++) {
      var tw = 26 + Math.floor(R() * 34), tx = 100 + Math.floor(R() * (WW - 200 - tw)), clash = false;
      for (var j = 0; j < towers.length; j++) if (Math.abs(towers[j].x - tx) < 70) clash = true;
      if (clash) continue;
      var base = 4; while (base < WH && !mask[base * WW + tx + (tw >> 1)]) base++;
      var th = 60 + Math.floor(R() * 110);
      fillZone(tx, base - th, tw, th + 6, 1);
      towers.push({ x: tx, w: tw, top: base - th });
      if (R() < 0.75 && th > 50) fillZone(tx + 4, base - th + 14 + Math.floor(R() * (th - 40)), tw - 8, 14, 1, 0);
    }
    for (i = 0; i < 4; i++) {
      var pw = 40 + Math.floor(R() * 44), px2 = 120 + Math.floor(R() * (WW - 240 - pw)), py = 110 + Math.floor(R() * 110);
      fillZone(px2, py, pw, 7, 2);
    }
    towers.sort(function (a, b) { return a.x - b.x; });
    for (i = 0; i + 1 < towers.length; i++) {
      var A = towers[i], B = towers[i + 1];
      if (R() < 0.5 && B.x - (A.x + A.w) < 160) {
        var by = Math.max(A.top, B.top) + 10;
        fillZone(A.x + A.w, by, B.x - (A.x + A.w), 4, 2);
      }
    }
    paintCity();
  }
  /* ---------- Pyramid Desert: dunes, stepped pyramids with a hidden room, an obelisk, temple ruins ----------
     zones: 0 sand, 1 pyramid limestone, 2 sandstone ruins, 3 granite obelisk, 4 pyramid capstone,
     5 obelisk tip, 6 boulders, 7 mudbrick building ramp */
  function genDesert(seed) {
    var R = rng(seed), x, y, i, k, tries;
    mask.fill(0); burnt.fill(0); zone.fill(0);
    var p1 = R() * 6.283, p2 = R() * 6.283, p3 = R() * 6.283;
    var tops = new Float32Array(WW);
    for (x = 0; x < WW; x++) {
      var t = x / WW;
      var h = 300 - 20 * Math.sin(t * 6.283 * 1.4 + p1) - 10 * Math.sin(t * 6.283 * 3.3 + p2) - 3 * Math.sin(t * 6.283 * 8.1 + p3);
      var edge = Math.min(x, WW - 1 - x);
      if (edge < 150) h += (150 - edge) * (150 - edge) / 85;
      tops[x] = h;
    }
    for (x = 0; x < WW; x++) for (y = Math.max(0, Math.floor(tops[x])); y < WH; y++) mask[y * WW + x] = 1;
    function gAt(xx) { return Math.floor(tops[clamp(Math.round(xx), 0, WW - 1)]); }
    function put(xx, yy, z) { if (xx < 0 || xx >= WW || yy < 0 || yy >= WH) return; var ii = yy * WW + xx; mask[ii] = 1; zone[ii] = z; }
    var used = [];
    function free(a, b) { for (var q = 0; q < used.length; q++) if (a < used[q][1] && b > used[q][0]) return false; return true; }
    var rough = LOOK === 'rough';

    /* pyramids: stepped limestone, a room inside and a sloping passage out to one side */
    var nP = R() < 0.55 ? 2 : 1;
    for (i = 0; i < nP; i++) {
      for (tries = 0; tries < 40; tries++) {
        var bw = i === 0 ? 196 + Math.floor(R() * 44) : 118 + Math.floor(R() * 40);
        var pcx = Math.round(230 + R() * (WW - 460));
        if (!free(pcx - bw / 2 - 24, pcx + bw / 2 + 24)) continue;
        used.push([pcx - bw / 2, pcx + bw / 2]);
        var gy = Math.max(gAt(pcx - bw / 2), gAt(pcx), gAt(pcx + bw / 2)) + 3;
        var levels = Math.floor((bw - 14) / 14), keep = rough ? Math.floor(levels * 0.7) : levels, H = 0, w;
        for (k = 0; k < keep; k++) {
          w = bw - 2 * k * 7;
          var y0 = gy - (k + 1) * 8;
          for (y = y0; y < gy; y++) for (x = Math.round(pcx - w / 2); x < Math.round(pcx + w / 2); x++) if (x >= 0 && x < WW && y < tops[x]) put(x, y, 1);
          H = (k + 1) * 8;
        }
        if (!rough) {
          /* the capstone */
          for (k = 0; k < 6; k++) for (x = pcx - 6 + k; x <= pcx + 6 - k; x++) put(x, gy - H - 1 - k, 4);
        } else {
          /* unfinished: a mudbrick building ramp still leans on one side */
          var side = R() < 0.5 ? -1 : 1, topY = gy - H, edgeX = pcx + side * (bw / 2 - keep * 7);
          for (x = 0; x < 120; x++) {
            var rx = Math.round(edgeX + side * x), ry = topY + Math.round(x * 0.62);
            if (rx < 0 || rx >= WW) break;
            if (ry >= tops[rx]) break;
            for (y = ry; y < tops[rx] && y < gy + 2; y++) if (!mask[y * WW + rx]) put(rx, y, 7);
          }
        }
        /* the hidden room, big enough to hide a Snag, and the passage that leads to it */
        var cy = gy - Math.round(H * 0.38), dir = R() < 0.5 ? -1 : 1;
        for (y = cy - 22; y < cy; y++) for (x = pcx - 18; x <= pcx + 18; x++) { var ci = y * WW + x; if (zone[ci] === 1) mask[ci] = 0; }
        for (var d = 0; d < 160; d++) {
          var px2 = pcx + dir * (18 + d), fy = Math.round(cy + d * 0.4);
          if (px2 < 0 || px2 >= WW || fy >= tops[px2] - 1) break;
          var inside = zone[(fy - 10) * WW + px2] === 1 && mask[(fy - 10) * WW + px2];
          if (!inside && d > 6) break;
          for (y = fy - 21; y < fy; y++) { var pi = y * WW + px2; if (zone[pi] === 1) mask[pi] = 0; }
        }
        break;
      }
    }

    /* an obelisk of red granite with a gold tip */
    for (tries = 0; tries < 30; tries++) {
      var ox = Math.round(170 + R() * (WW - 340));
      if (!free(ox - 22, ox + 22)) continue;
      used.push([ox - 10, ox + 10]);
      var og = gAt(ox) + 3, oh = 70 + Math.floor(R() * 24);
      for (y = og - oh; y < og; y++) {
        var half = 5 - Math.round((og - y) / oh * 1.5);
        for (x = ox - half; x <= ox + half; x++) if (y < tops[clamp(x, 0, WW - 1)] + 2) put(x, y, 3);
      }
      for (k = 0; k < 4; k++) for (x = ox - 3 + k; x <= ox + 3 - k; x++) put(x, og - oh - 1 - k, 5);
      break;
    }

    /* temple ruins: columns holding up a stone beam, which makes a high ledge */
    var nT = 1 + (R() < 0.6 ? 1 : 0);
    for (i = 0; i < nT; i++) {
      for (tries = 0; tries < 30; tries++) {
        var nc = 2 + Math.floor(R() * 2), gap = 30 + Math.floor(R() * 10), tx0 = Math.round(170 + R() * (WW - 340 - nc * gap));
        if (!free(tx0 - 16, tx0 + (nc - 1) * gap + 16)) continue;
        used.push([tx0 - 12, tx0 + (nc - 1) * gap + 12]);
        var base = 0;
        for (k = 0; k < nc; k++) base = Math.max(base, gAt(tx0 + k * gap));
        var colH = 44 + Math.floor(R() * 10), lintel = base - colH, broken = R() < 0.5 ? nc - 1 : -1;
        for (k = 0; k < nc; k++) {
          var colX = tx0 + k * gap, ctop = k === broken ? lintel + 18 + Math.floor(R() * 10) : lintel;
          for (y = ctop; y < base + 2; y++) for (x = colX - 4; x <= colX + 4; x++) if (y < tops[clamp(x, 0, WW - 1)] + 1) put(x, y, 2);
          if (k !== broken) for (x = colX - 6; x <= colX + 6; x++) { put(x, ctop, 2); put(x, ctop + 1, 2); }
        }
        var lEnd = broken >= 0 ? tx0 + (nc - 2) * gap + 16 : tx0 + (nc - 1) * gap + 12;
        for (y = lintel - 7; y < lintel; y++) for (x = tx0 - 12; x <= lEnd; x++) put(x, y, 2);
        break;
      }
    }

    /* fallen blocks, half buried */
    for (i = 0; i < 4; i++) {
      var bx = Math.round(160 + R() * (WW - 320)), bwid = 12 + Math.floor(R() * 8), btop = gAt(bx) - 4 - Math.floor(R() * 4);
      if (!free(bx - 4, bx + bwid + 4)) continue;
      for (y = btop; y < btop + 9; y++) for (x = bx; x < bx + bwid; x++) put(x, y, 2);
    }

    /* Stone Age history: big boulders left lying about */
    if (rough) for (i = 0; i < 6; i++) {
      var bcx = 150 + R() * (WW - 300), br = 9 + R() * 6, bcy = gAt(bcx) - br * 0.55;
      for (y = Math.floor(bcy - br); y <= bcy + br; y++) for (x = Math.floor(bcx - br); x <= bcx + br; x++) {
        var ddx = x + 0.5 - bcx, ddy = y + 0.5 - bcy;
        if (ddx * ddx + ddy * ddy <= br * br && x >= 0 && x < WW && y >= 0 && (!mask[y * WW + x] || zone[y * WW + x] === 0) && y < tops[x] + 4) put(x, y, 6);
      }
    }

    /* buried tomb rooms under the sand */
    for (i = 0; i < 2; i++) {
      var tcx = 220 + R() * (WW - 440);
      blob(tcx, gAt(tcx) + 50 + R() * 26, 20 + R() * 12, 8 + R() * 4, 0);
    }
    paintDesert();
  }
  function paintDesert() {
    var P = MAP.pal, x, y, i, look = LOOK;
    img = tctx.createImageData(WW, WH); data = img.data;
    for (x = 0; x < WW; x++) {
      var d = 0, pz = -1;
      for (y = 0; y < WH; y++) {
        i = y * WW + x;
        if (!mask[i]) { d = 0; pz = -1; continue; }
        var z = zone[i], nz = hash(x, y), col;
        if (z === 0 && pz > 0) d = 6; /* sand under stone starts fresh, not as deep rock */
        pz = z;
        if (z === 1) {
          var row = y >> 3, bx = (x + (row % 2) * 6) % 12, by = y & 7;
          if (look === 'golden') { col = nz < 0.04 ? P.lime2 : P.lime1; if (d < 1) col = [252, 248, 236]; }
          else {
            col = (bx === 0 || by === 7) ? P.mortar : (hash(((x + (row % 2) * 6) / 12) | 0, row) < 0.22 ? P.limeD : (by === 0 ? P.lime1 : P.lime2));
            if (look === 'rough' && nz < 0.12) col = P.limeD;
            if (d < 1) col = look === 'neon' ? ((x >> 2) % 2 ? P.neon : P.neon2) : P.lime1;
          }
        } else if (z === 2) {
          col = d < 2 ? P.ston1 : P.ston2;
          if (x % 5 === 0 && d > 2) col = P.stonD;
          var gx = x >> 2, gy2 = (y / 5) | 0;
          if (d > 3 && hash(gx * 7, gy2 * 3) < 0.16 && (x & 3) !== 3 && (y % 5) !== 4 && hash(x, y) < 0.55) col = hash(gx, gy2) < 0.5 ? P.blue : P.red;
          if (nz < 0.04) col = P.stonD;
        } else if (z === 3) {
          col = nz < 0.3 ? P.gran2 : P.gran1;
          if (nz > 0.94) col = [214, 156, 146];
          if ((y % 7) < 4 && hash(x >> 1, y >> 1) < 0.08) col = P.gold2;
        } else if (z === 4) {
          col = look === 'golden' ? (d < 2 ? [255, 236, 150] : P.gold) : (look === 'neon' ? P.neon2 : P.lime1);
        } else if (z === 5) {
          col = d < 2 ? [255, 236, 150] : P.gold;
        } else if (z === 6) {
          col = d < 3 ? [176, 168, 154] : (nz < 0.4 ? [125, 116, 104] : [146, 138, 126]);
        } else if (z === 7) {
          col = ((y % 5) === 0 || ((x + ((y / 5) | 0) * 4) % 9) === 0) ? [118, 80, 48] : (nz < 0.5 ? [160, 112, 70] : [148, 102, 62]);
        } else {
          if (d < 2) col = P.sand1;
          else if (d < 6) col = ((x + y * 3) >> 2) % 5 === 0 ? P.sand1 : P.sand2;
          else {
            col = ((((y + (x >> 5) * 3) >> 2) % 6) === 0) ? P.sand3 : P.sand2;
            if (d > 62 + hash(y, x) * 12) col = P.deep;
            if (nz < 0.04) col = P.speck;
          }
        }
        setPx(i, col);
        d++;
      }
    }
    /* dry tufts on the sand: decoration only, never solid */
    for (x = 1; x < WW - 1; x++) {
      for (y = 3; y < WH; y++) {
        i = y * WW + x;
        if (mask[i] && !mask[i - WW] && zone[i] === 0) {
          var hv = hash(x * 3, y);
          if (hv < 0.06) { setPx(i - WW, P.tuft); if (hv < 0.02) setPx(i - 2 * WW, P.tuft); }
          else if (hv > 0.996) { setPx(i - WW, P.tuft); setPx(i - 2 * WW, P.flower); }
        }
      }
    }
    tctx.putImageData(img, 0, 0);
    miniDirty = true;
  }
  function blend(a, b, t) { return [a[0] + (b[0] - a[0]) * t | 0, a[1] + (b[1] - a[1]) * t | 0, a[2] + (b[2] - a[2]) * t | 0]; }
  function paintCity() {
    var P = MAP.pal, x, y, i, wild = LOOK === 'overgrown', bright = LOOK === 'gleaming', sandy = LOOK === 'sandy', k2;
    if (sandy && MAP.sandy) { P = {}; for (k2 in MAP.pal) P[k2] = MAP.pal[k2]; for (k2 in MAP.sandy) P[k2] = MAP.sandy[k2]; }
    img = tctx.createImageData(WW, WH); data = img.data;
    for (x = 0; x < WW; x++) {
      var d = 0;
      for (y = 0; y < WH; y++) {
        i = y * WW + x;
        if (!mask[i]) { d = 0; continue; }
        var z = zone[i], nz = hash(x, y), col;
        if (sandy && d >= 4 && z !== 1 && hash(x >> 2, ((y / 5) | 0) * 3) < 0.07 && (x & 3) !== 3 && (y % 5) !== 4 && nz < 0.6) { setPx(i, hash(x >> 2, y) < 0.5 ? [44, 92, 168] : [180, 64, 44]); d++; continue; }
        var blockPink = ((x >> 6) % 3) === 1;
        if (d < 2) col = wild ? (d === 0 ? P.moss : P.moss2) : (blockPink && z === 0 ? P.top2 : P.top);
        else if (d < 4) col = wild && nz < 0.6 ? P.moss2 : P.metal;
        else {
          col = z === 2 ? P.metal2 : P.metal;
          if (x % 16 === 0 || y % 12 === 0) col = P.seam;
          if (z === 1 && x % 6 >= 2 && x % 6 <= 3 && y % 8 >= 3 && y % 8 <= 5) {
            var lit = hash(x >> 1, y >> 3) < (bright ? 0.85 : (wild ? 0.15 : 0.55));
            col = lit ? (hash(x >> 2, y >> 3) < 0.5 ? P.win : P.win2) : P.deep;
          }
          if (d > 64 + hash(y, x) * 10) col = P.deep;
          if (nz < 0.02) col = P.seam;
        }
        if (z === 2 && (!mask[i + WW] || y === WH - 1)) col = bright ? P.top2 : (wild ? P.moss2 : P.top2);
        if (wild && d >= 2 && hash(x >> 3, y >> 3) < 0.3) col = blend(col, P.rust, 0.35);
        setPx(i, col);
        d++;
      }
    }
    /* decoration only: neon lamp posts, or moss and vines when history went wild */
    for (x = 2; x < WW - 2; x++) {
      for (y = 6; y < WH; y++) {
        i = y * WW + x;
        if (mask[i] && !mask[i - WW]) {
          var hv = hash(x * 3, y);
          if (wild) {
            if (hv < 0.4) { setPx(i - WW, P.tuft); if (hv < 0.15) setPx(i - 2 * WW, P.tuft); }
          } else if (x % 44 === 7 && zone[i] === 0) {
            for (var k = 1; k <= 5; k++) setPx(i - k * WW, [90, 100, 124]);
            setPx(i - 6 * WW, bright ? P.top2 : (sandy ? P.top : P.win2));
          }
        }
        if (wild && mask[i] && (!mask[i - 1] || !mask[i + 1]) && hash(x, y >> 2) < 0.3) setPx(i, P.moss2);
      }
    }
    tctx.putImageData(img, 0, 0);
    miniDirty = true;
  }

  function genTerrain(seed) {
    if (MAP.style === 'city') { genCity(seed); return; }
    if (MAP.style === 'desert') { genDesert(seed); return; }
    var R = rng(seed), x, y, i;
    var p1 = R() * 6.283, p2 = R() * 6.283, p3 = R() * 6.283;
    var a1 = 28 + R() * 22, a2 = 14 + R() * 12, a3 = 5 + R() * 5;
    var tops = new Float32Array(WW);
    for (x = 0; x < WW; x++) {
      var t = x / WW;
      var h = 262 - a1 * Math.sin(t * 6.283 * 1.2 + p1) - a2 * Math.sin(t * 6.283 * 3.1 + p2) - a3 * Math.sin(t * 6.283 * 7.3 + p3);
      var edge = Math.min(x, WW - 1 - x);
      if (edge < 150) h += (150 - edge) * (150 - edge) / 85;
      tops[x] = h;
    }
    mask.fill(0); burnt.fill(0);
    for (x = 0; x < WW; x++) for (y = Math.max(0, Math.floor(tops[x])); y < WH; y++) mask[y * WW + x] = 1;
    var n = 3 + Math.floor(R() * 2);
    for (i = 0; i < n; i++) {
      var cx = 220 + R() * (WW - 440);
      blob(cx, tops[Math.floor(cx)] - 55 - R() * 45, 26 + R() * 26, 7 + R() * 5, 1);
    }
    for (i = 0; i < 3; i++) {
      var cx2 = 200 + R() * (WW - 400);
      blob(cx2, tops[Math.floor(cx2)] + 48 + R() * 30, 22 + R() * 18, 9 + R() * 6, 0);
    }
    var rocks = [];
    for (i = 0; i < 30; i++) rocks.push([R() * WW, 260 + R() * 200, 4 + R() * 7]);
    paintTerrain(rocks);
  }

  function setPx(i, c) { var k = i * 4; data[k] = c[0]; data[k + 1] = c[1]; data[k + 2] = c[2]; data[k + 3] = 255; }

  function paintTerrain(rocks) {
    var P = MAP.pal, x, y, i, j;
    img = tctx.createImageData(WW, WH); data = img.data;
    for (x = 0; x < WW; x++) {
      var d = 0;
      for (y = 0; y < WH; y++) {
        i = y * WW + x;
        if (!mask[i]) { d = 0; continue; }
        var nz = hash(x, y), col;
        if (d < 2) col = P.grass1;
        else if (d < 5) col = P.grass2;
        else if (d < 7) col = nz < 0.5 ? P.grass2 : P.dirt1;
        else {
          col = ((((y + (x >> 4)) >> 3) % 4) === 0 && nz < 0.6) ? P.dirt2 : P.dirt1;
          if (d > 66 + hash(y, x) * 12) col = P.deep;
          if (nz < 0.05) col = P.speck;
          for (j = 0; j < rocks.length; j++) {
            var rk = rocks[j], dx = x - rk[0], dy = y - rk[1];
            if (dx * dx + dy * dy < rk[2] * rk[2]) { col = (dy < -rk[2] * 0.4) ? P.rockL : P.rock; break; }
          }
        }
        setPx(i, col);
        d++;
      }
    }
    /* grass tufts and flowers sit on top of the ground: decoration only, never solid */
    for (x = 1; x < WW - 1; x++) {
      for (y = 3; y < WH; y++) {
        i = y * WW + x;
        if (mask[i] && !mask[i - WW]) {
          var hv = hash(x * 3, y);
          if (hv < 0.35) { setPx(i - WW, P.tuft); if (hv < 0.12) setPx(i - 2 * WW, P.tuft); }
          else if (hv > 0.985) { setPx(i - WW, P.tuft); setPx(i - 2 * WW, hv > 0.993 ? P.flower2 : P.flower); }
        }
      }
    }
    tctx.putImageData(img, 0, 0);
    miniDirty = true;
  }

  /* Clear a slightly ragged circle from both the mask and the painting; darken the rim once. */
  function carve(cx, cy, r, scorch) {
    var x0 = Math.max(0, Math.floor(cx - r - 4)), x1 = Math.min(WW - 1, Math.ceil(cx + r + 4));
    var y0 = Math.max(0, Math.floor(cy - r - 4)), y1 = Math.min(WH - 1, Math.ceil(cy + r + 4));
    if (x0 > x1 || y0 > y1) return;
    var lvl = scorch ? 2 : 1, f = scorch ? 0.62 : 0.82;
    for (var y = y0; y <= y1; y++) {
      for (var x = x0; x <= x1; x++) {
        var dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = Math.sqrt(dx * dx + dy * dy);
        var edge = r + (hash(x, y) - 0.5) * 2.4;
        var i = y * WW + x, k = i * 4;
        if (d <= edge) { mask[i] = 0; data[k + 3] = 0; }
        else if (d <= edge + 2.5 && mask[i] && burnt[i] < lvl) {
          var ff = burnt[i] ? f / 0.82 : f;
          data[k] = data[k] * ff | 0; data[k + 1] = data[k + 1] * ff | 0; data[k + 2] = data[k + 2] * ff | 0;
          burnt[i] = lvl;
        }
      }
    }
    tctx.putImageData(img, 0, 0, x0, y0, x1 - x0 + 1, y1 - y0 + 1);
    miniDirty = true;
    exposeArts(cx, cy, r);
  }

  function normalAt(x, y) {
    var nx = 0, ny = 0;
    for (var dy = -3; dy <= 3; dy++) for (var dx = -3; dx <= 3; dx++) if (solid(x + dx, y + dy)) { nx -= dx; ny -= dy; }
    var l = Math.sqrt(nx * nx + ny * ny);
    if (l < 0.001) return { x: 0, y: -1 };
    return { x: nx / l, y: ny / l };
  }

  /* ---------------- game state ---------------- */
  var game = {
    state: 'demo', t: 0, seed: 1, teams: [], snags: [], projs: [], parts: [], portals: [],
    tIdx: 0, active: null, timer: 0, turnLen: 60, retreat: 0, wind: 0, weapon: 'lob',
    power: 0, charging: false, fired: false, settleT: 0, swingT: 0, digT: 0, portT: 0,
    ai: null, winner: null, overlay: 'menu', look: null, lookT: 0, shake: 0, turnNo: 0,
    bannerT: 0, lastPower: 0, stats: { best: 0, bestBy: '', shots: 0 }, opts: null,
    arts: [], crates: [], courier: null, barker: null, finds: [], birds: [],
    strikes: [], warn: [], fuel: 0, tx: null, sudden: false, cars: [], tour: null, barrels: [], later: []
  };
  window.B5GAME = game;
  var cam = { x: 0, y: 0 };

  /* ---------------- Snags ---------------- */
  function makeSnag(team, name, x, y) {
    return {
      team: team, name: name, x: x, y: y, vx: 0, vy: 0, hp: 100, face: x < WW / 2 ? 1 : -1, aim: 35,
      st: 'ground', alive: true, knock: false, flip: false, airT: 0, hurtT: 0, walking: 0, walkd: 0,
      landT: 0, cheerT: 0, blinkAt: Math.floor(Math.random() * 200), dealt: 0, best: 0, found: 0
    };
  }

  /* y is the ground row under the feet. The body is a 9 by 19 box above it. */
  function bodyClear(x, y) {
    for (var dy = 3; dy <= 17; dy += 3) {
      if (solid(x - 4, y - dy) || solid(x + 4, y - dy) || solid(x, y - dy)) return false;
    }
    return !solid(x, y - 19);
  }
  function onGround(x, y) { return solid(x, y) || solid(x - 3, y) || solid(x + 3, y); }

  function tryWalk(c, dir) {
    c.face = dir;
    var nx = c.x + dir * 0.55;
    for (var up = 0; up <= 5; up++) {
      var ny = c.y - up;
      if (bodyClear(nx, ny)) {
        c.x = nx; c.y = ny;
        var down = 0;
        while (!onGround(c.x, c.y) && down < 6 && bodyClear(c.x, c.y + 1)) { c.y++; down++; }
        if (!onGround(c.x, c.y)) { c.st = 'air'; c.vx = dir * 0.5; c.vy = 0; }
        c.walkd += 0.55;
        if (Math.floor(c.walkd / 6.6) !== Math.floor((c.walkd - 0.55) / 6.6)) { dust(c.x - dir * 3, c.y, 2, 1); if (game.state !== 'demo') sfx('step'); }
        return true;
      }
    }
    return false;
  }

  function jump(c, back) {
    if (c.st !== 'ground' || !bodyClear(c.x, c.y - 1)) return;
    c.y -= 1; c.st = 'air'; c.airT = 0; c.knock = false;
    dust(c.x, c.y, 3, 3);
    kick(c, 0.22);
    if (back) { c.vx = -c.face * 0.75; c.vy = -4.1; c.flip = true; }
    else { c.vx = c.face * 1.35; c.vy = -2.8; c.flip = false; }
    sfx('jump');
  }

  function humanDriving(c) { return c === game.active && !game.overlay && (game.state === 'play' || game.state === 'retreat') && (c.team.ctrl === 'human' || !!(game.ai && game.ai.inp)); }
  function keysFor(c) { return c.team.ctrl === 'ai' ? ((game.ai && game.ai.inp) || {}) : inp; }

  /* Vine Swing: the Snag hangs from an anchor point like a pendulum */
  function swingStep(c) {
    var I = keysFor(c);
    var s = c.swing;
    c.vy += G;
    if (humanDriving(c)) {
      if (I.left) c.vx -= 0.06;
      if (I.right) c.vx += 0.06;
      if (I.up) s.len = Math.max(18, s.len - 1);
      if (I.down) s.len = Math.min(170, s.len + 1);
    }
    var bx = c.x + c.vx, by = c.y - 10 + c.vy;
    var dx = bx - s.ax, dy = by - s.ay, d = Math.sqrt(dx * dx + dy * dy);
    if (d > s.len && d > 0.01) {
      var nx = dx / d, ny = dy / d;
      bx = s.ax + nx * s.len; by = s.ay + ny * s.len;
      var vr = c.vx * nx + c.vy * ny;
      if (vr > 0) { c.vx -= vr * nx; c.vy -= vr * ny; }
    }
    if (bodyClear(bx, by + 10)) { c.x = bx; c.y = by + 10; }
    else if (bodyClear(bx, c.y)) { c.x = bx; c.vy *= -0.3; }
    else if (bodyClear(c.x, by + 10)) { c.y = by + 10; c.vx *= -0.3; }
    else { c.vx *= -0.4; c.vy *= -0.4; }
    c.vx *= 0.996; c.vy *= 0.996;
    if (c.vx > 0.2) c.face = 1; else if (c.vx < -0.2) c.face = -1;
    if (c.y > WATER + 4) { c.swing = null; drown(c); }
  }

  /* Jetpack: thrust instead of gravity while fuel lasts */
  function jetStep(c) {
    var I = keysFor(c);
    var drive = humanDriving(c), thrust = drive && I.up && game.fuel > 0;
    c.vy += thrust ? -0.22 : G * 0.6;
    if (thrust) { game.fuel -= 1; if (game.t % 6 === 0) sfx('jet'); }
    if (drive && game.fuel > 0) {
      if (I.left) { c.vx -= 0.08; game.fuel -= 0.4; c.face = -1; }
      if (I.right) { c.vx += 0.08; game.fuel -= 0.4; c.face = 1; }
    }
    c.vx = clamp(c.vx * 0.99, -2.2, 2.2); c.vy = clamp(c.vy, -2.4, 4);
    airStep(c, true);
  }

  /* Sand Sled: slide along the ground, faster downhill, and fly off steep edges */
  function sledStep(c) {
    var I = keysFor(c);
    if (humanDriving(c)) {
      if (I.left) c.sv -= 0.05;
      if (I.right) c.sv += 0.05;
    }
    if (--game.sledFuel <= 0) { c.sled = false; c.sv = 0; return; }
    c.sv = clamp(c.sv * 0.993, -3.2, 3.2);
    if (Math.abs(c.sv) < 0.05) return;
    var dir = c.sv > 0 ? 1 : -1, n = Math.ceil(Math.abs(c.sv) / 0.5), dx = c.sv / n, sp = Math.abs(c.sv);
    var allow = sp < 1.3 ? 3 : (sp < 2.4 ? 2 : 1);
    c.face = dir;
    for (var k = 0; k < n; k++) {
      var nx = clamp(c.x + dx, 6, WW - 6), moved = false;
      for (var up = 0; up <= 4; up++) {
        if (bodyClear(nx, c.y - up)) { c.x = nx; c.y -= up; moved = true; if (up) c.sv -= dir * 0.035 * up; break; }
      }
      if (!moved) { c.sv = -c.sv * 0.25; sfx('bonk'); return; }
      var down = 0;
      while (!onGround(c.x, c.y) && down < allow && bodyClear(c.x, c.y + 1)) { c.y++; down++; }
      if (down) c.sv += dir * 0.03 * down;
      if (!onGround(c.x, c.y)) { c.st = 'air'; c.vx = c.sv; c.vy = -Math.min(1.6, sp * 0.35); c.airT = 0; return; }
    }
    if (game.t % 5 === 0) addPart({ k: 'deb', x: c.x - dir * 8, y: c.y - 1, vx: -dir * rand(0.3, 1), vy: rand(-1.4, -0.4), life: 24, col: 'rgb(236,204,136)' });
    if (game.t % 14 === 0) sfx('dig');
  }

  function airStep(c, noGrav) {
    if (!noGrav) c.vy = Math.min(9, c.vy + G);
    var n = Math.max(1, Math.ceil(Math.max(Math.abs(c.vx), Math.abs(c.vy))));
    for (var s = 0; s < n; s++) {
      if (Math.abs(c.vx) > 0.01) {
        var nx = c.x + c.vx / n;
        if (bodyClear(nx, c.y)) c.x = nx;
        else if (c.vy >= 0 && bodyClear(c.x, c.y) && bodyClear(nx, c.y - 2)) { c.x = nx; c.y -= 2; }
        else c.vx *= -0.3;
      }
      var ny = c.y + c.vy / n;
      if (c.vy > 0) {
        if (onGround(c.x, ny)) {
          c.y = Math.floor(ny);
          var y0 = c.y, k = 0;
          while (!bodyClear(c.x, c.y) && k < 8) { c.y--; k++; }
          if (!onGround(c.x, c.y)) c.y = y0; /* wedged in a tight gap: stay put rather than flicker */
          land(c);
          return;
        }
        c.y = ny;
      } else {
        if (bodyClear(c.x, ny)) c.y = ny; else c.vy = 0;
      }
    }
  }

  function land(c) {
    var v = c.vy;
    c.flip = false; c.airT = 0; c.jet = false; c.swing = null;
    if (c.knock && v > 2.2) {
      c.vy = -v * 0.3; c.vx *= 0.55;
      if (c.vy < -0.8 && bodyClear(c.x, c.y - 1)) { c.y -= 1; sfx('land', 0.5); return; }
    }
    c.st = 'ground'; c.vx = 0; c.vy = 0; c.knock = false;
    if (v > 4.6) hurt(c, Math.round((v - 4.6) * 10) + 3, null);
    if (v > 2) { sfx('land', 0.6); dust(c.x, c.y, Math.min(8, Math.round(v * 1.5)), 5); }
    c.landT = 6;
    kick(c, -Math.min(0.32, 0.08 + v * 0.05));
  }

  function updSnag(c) {
    if (c.hurtT > 0) c.hurtT--;
    if (c.ghostT > 0) c.ghostT--; else if (c.ghost > c.hp) c.ghost = Math.max(c.hp, c.ghost - 0.8);
    if (c.fireT > 0) c.fireT--;
    /* the squash and stretch spring, plus slow breathing when standing about */
    c.sqv = (c.sqv || 0) * 0.68 - (c.sq || 0) * 0.32; c.sq = (c.sq || 0) + c.sqv;
    if (c.alive && c.st === 'ground' && !c.walking && (game.t + c.blinkAt) % 96 === 0) kick(c, 0.035);
    /* tumbling: a smooth spin that follows the speed of the knock */
    if (c.knock && c.st === 'air') c.spin = (c.spin || 0) + (c.vx < 0 ? -1 : 1) * Math.min(0.32, (Math.abs(c.vx) + Math.abs(c.vy)) * 0.05);
    else c.spin = 0;
    /* knocked Snags leave a dust trail */
    if (c.alive && c.knock && c.st === 'air' && game.t % 3 === 0 && Math.abs(c.vx) + Math.abs(c.vy) > 2) addPart({ k: 'puff', x: c.x, y: c.y - 9, life: 20, max: 20, r: 2 });
    if (c.walking > 0) c.walking--;
    if (c.landT > 0) c.landT--;
    if (c.cheerT > 0) c.cheerT--;
    if (!c.alive || c.arrive) return;
    if (c.sled && c.knock) c.sled = false;
    if (c.st === 'ground' && !onGround(c.x, c.y)) { c.st = 'air'; c.vx = c.sled ? c.sv : 0; c.vy = 0; }
    if (c.swing) { c.st = 'air'; swingStep(c); c.airT++; }
    else if (c.st === 'air') { if (c.jet) jetStep(c); else airStep(c); c.airT++; }
    else if (c.sled) sledStep(c);
    if (c.alive && c.y > WATER + 4) drown(c);
  }

  function hurt(c, dm, src) {
    if (!c.alive || dm <= 0) return;
    if (c.shield) dm = Math.max(1, Math.round(dm / 2));
    var before = c.hp;
    c.hp = Math.max(0, c.hp - dm); c.hurtT = 45;
    c.ghost = Math.max(c.ghost || 0, before); c.ghostT = 40;
    kick(c, -Math.min(0.34, 0.1 + dm / 160));
    addPart({ k: 'txt', x: c.x, y: c.y - 46, vx: rand(-0.25, 0.25), vy: -0.45, life: 90, max: 90, s: '-' + dm, sc: dm >= 40 ? 3 : (dm >= 16 ? 2 : 1), col: dm >= 40 ? '#ff8a5c' : '#ffd27a' });
    sfx('hit', Math.min(1.4, dm / 35));
    if (before > 0 && c.hp <= 0 && game.state !== 'demo') koMoment(c);
    if (src && src.by && src.by.team !== c.team) {
      if (dm > game.stats.best) { game.stats.best = dm; game.stats.bestBy = src.by.name; }
      src.by.dealt = (src.by.dealt || 0) + dm; if (dm > (src.by.best || 0)) src.by.best = dm;
    }
    voice(c.team.era, 'hurt');
    if (c === game.active) {
      if (game.state === 'retreat') game.retreat = Math.min(game.retreat, 20);
      else if (game.state === 'play' && !game.fired) endTurn();
    }
  }

  /* the satisfying bit: a knock out slows time for a moment and gets its own word */
  function koMoment(c) {
    if (!reduceMotion) game.slow = 42;
    word(c.x, c.y - 70, 'K.O.!', '#ff8a5c', 3); game.koFlag = true;
    for (var i = 0; i < 12; i++) { var a = i / 12 * 6.283; addPart({ k: 'spark', x: c.x, y: c.y - 12, vx: Math.cos(a) * 1.8, vy: Math.sin(a) * 1.8 - 0.6, life: 34 }); }
    sfx('ko');
  }
  function word(x, y, s, col, sc) { addPart({ k: 'txt', x: x, y: y, vy: -0.25, life: 80, max: 80, s: s, sc: sc || 2, col: col || '#ffd27a', w: 1 }); }
  function drown(c) {
    var wasIn = c.hp > 0;
    c.alive = false; c.hp = 0;
    if (wasIn && game.state !== 'demo') { if (!reduceMotion) game.slow = 36; word(c.x, WATER - 30, 'SPLASH!', '#9fe3f5', 2); }
    for (var i = 0; i < 26; i++) addPart({ k: 'drop', x: c.x + rand(-4, 4), y: WATER, vx: rand(-1.2, 1.2), vy: rand(-3.2, -1.2), life: 50 });
    game.portals.push({ x: c.x, y: WATER - 12, t: 0, c: c });
    sfx('splash'); sfx('portal'); voice(c.team.era, 'panic');
    say('water');
    if (c === game.active && (game.state === 'play' || game.state === 'retreat')) endTurn();
  }

  function zapHome(c) {
    c.alive = false;
    game.portals.push({ x: c.x, y: c.y - 12, t: 0, c: c, ko: true });
    if (game.state !== 'demo') { game.look = { x: c.x, y: c.y - 20 }; game.lookT = Math.max(game.lookT, 70); }
    voice(c.team.era, 'hurt'); sfx('pop');
  }
  /* the moment a knocked out Snag vanishes: stars, a flying prop, and where in time it went */
  function koBurst(p) {
    var c = p.c, col = ER[c.team.era].tag;
    for (var i = 0; i < 16; i++) { var a = i / 16 * 6.283; addPart({ k: 'spark', x: p.x, y: p.y - 4, vx: Math.cos(a) * rand(1.4, 2.6), vy: Math.sin(a) * rand(1.4, 2.6) - 0.8, life: 40 }); }
    for (i = 0; i < 6; i++) addPart({ k: 'deb', x: p.x, y: p.y - 6, vx: rand(-2, 2), vy: rand(-3.4, -1.6), life: 70, col: col, big: 2 });
    for (i = 0; i < 5; i++) addPart({ k: 'puff', x: p.x + rand(-6, 6), y: p.y + rand(-6, 6), vx: rand(-0.4, 0.4), vy: rand(-0.4, 0.1), life: 26, max: 26, r: rand(2.5, 4) });
    if (game.state !== 'demo') word(p.x, p.y - 28, 'Back to ' + yearLabel(yearOf(c.team.era)) + '!', col, 2);
    sfx('portal'); sfx('zap2');
  }

  /* ---------------- projectiles and explosions ---------------- */
  /* One step function for real shots and for the computer's practice shots, so both obey the same physics. */
  function stepProj(p, sim) {
    var w = WEAP[p.type];
    p.age++;
    if (p.fuse !== undefined) { p.fuse--; if (p.fuse <= 0) return 'explode'; }
    if (p.rest) {
      if (solid(p.x, p.y + 2)) return null;
      p.rest = false;
    }
    p.vy += G * (w.grav === undefined ? 1 : w.grav);
    if (w.wind) p.vx += game.wind * 0.0016;
    var n = Math.max(1, Math.ceil(Math.max(Math.abs(p.vx), Math.abs(p.vy)) / 1.2));
    for (var s = 0; s < n; s++) {
      var nx = p.x + p.vx / n, ny = p.y + p.vy / n;
      if (nx < -60 || nx > WW + 60) return 'gone';
      if (ny > WATER + 2) { p.x = nx; p.y = ny; return 'water'; }
      if (solid(nx, ny)) {
        if (w.impact) { p.x = nx; p.y = ny; return 'explode'; }
        var nrm = normalAt(nx, ny), d = p.vx * nrm.x + p.vy * nrm.y;
        if (d < 0) {
          p.vx -= 2 * d * nrm.x; p.vy -= 2 * d * nrm.y;
          p.vx *= w.bounce; p.vy *= w.bounce;
          if (!sim && d < -1) sfx('bounce');
          if (w.bounces) { p.bn = (p.bn || 0) + 1; if (p.bn > w.bounces) return 'explode'; }
        }
        var k = 0;
        while (solid(p.x, p.y) && k < 5) { p.x += nrm.x; p.y += nrm.y; k++; }
        if (Math.abs(p.vx) + Math.abs(p.vy) < 0.4) { p.vx = 0; p.vy = 0; p.rest = true; }
        break;
      }
      p.x = nx; p.y = ny;
      if (w.impact || w.hit) {
        for (var i = 0; i < game.snags.length; i++) {
          var c = game.snags[i];
          if (!c.alive || (c === p.by && p.age < 14)) continue;
          if (Math.abs(nx - c.x) < 6 && ny > c.y - 19 && ny < c.y + 1) { p.hitSnag = c; return 'explode'; }
        }
        for (var bi = 0; bi < game.barrels.length; bi++) {
          var br = game.barrels[bi];
          if (Math.abs(nx - br.x) < 5 && ny > br.y - 11 && ny < br.y + 1) return 'explode';
        }
      }
    }
    if (p.age > (w.life || 1500)) return 'explode';
    return null;
  }

  function addPart(p) { if (game.parts.length < 700) game.parts.push(p); }

  function explode(x, y, R, dmg, src) {
    var deb = [], i;
    for (i = 0; i < 46; i++) {
      var a = Math.random() * 6.283, rr = Math.random() * R;
      var sx = Math.floor(x + Math.cos(a) * rr), sy = Math.floor(y + Math.sin(a) * rr);
      if (sx >= 0 && sx < WW && sy >= 0 && sy < WH && mask[sy * WW + sx]) {
        var k = (sy * WW + sx) * 4;
        deb.push(['rgb(' + data[k] + ',' + data[k + 1] + ',' + data[k + 2] + ')', sx, sy]);
      }
    }
    carve(x, y, R, true);
    deb.forEach(function (d) {
      var a2 = Math.atan2(d[2] - y, d[1] - x) + rand(-0.4, 0.4), sp = rand(1.5, 4.2);
      var rb = Math.random();
      addPart({ k: 'deb', x: d[1], y: d[2], vx: Math.cos(a2) * sp, vy: Math.sin(a2) * sp - 1.5, life: 90, col: d[0], big: rb < 0.12 ? 3 : (rb < 0.5 ? 2 : 1) });
    });
    /* a ring of dust rolls out along the ground */
    for (var gx = -R - 6; gx <= R + 6; gx += 3) {
      var gy = surfaceY(Math.round(x + gx));
      if (gy > 0 && Math.abs(gy - y) < R + 10) addPart({ k: 'dust', x: x + gx, y: gy - 1, vx: (gx < 0 ? -1 : 1) * rand(0.5, 1.4), vy: rand(-0.5, -0.1), life: 30 + Math.random() * 20, max: 50, r: rand(2, 3.6), delay: Math.round(Math.abs(gx) / 6) });
    }
    addPart({ k: 'flash', x: x, y: y, life: 4, max: 4, r: R * 1.15 });
    addPart({ k: 'fire', x: x, y: y, life: 18, max: 18, r: R });
    addPart({ k: 'ring', x: x, y: y, life: 14, max: 14, r: R });
    for (i = 0; i < 7; i++) { var sl = 60 + Math.random() * 40; addPart({ k: 'smoke', x: x + rand(-R / 2, R / 2), y: y + rand(-R / 2, R / 3), vx: rand(-0.25, 0.25), vy: rand(-0.7, -0.25), life: sl, max: sl, r: rand(3, 7), delay: 7 + i * 2 }); }
    for (i = 0; i < 10 + Math.round(R / 3); i++) { var ea = Math.random() * 6.283, es = rand(1, 3.4); addPart({ k: 'ember', x: x, y: y, vx: Math.cos(ea) * es, vy: Math.sin(ea) * es - 1.2, life: 26 + Math.random() * 24, max: 50 }); }
    var reach = R + 10, hits = 0, maxDm = 0;
    game.koFlag = false;
    game.snags.forEach(function (c) {
      if (!c.alive) return;
      var dx = c.x - x, dy = (c.y - 9) - y, d = Math.sqrt(dx * dx + dy * dy);
      if (d >= reach) return;
      var f = 1 - d / reach, dm = Math.round(dmg * f);
      if (dm > 0) { hurt(c, dm, src); if (!src || !src.by || src.by.team !== c.team) { hits++; maxDm = Math.max(maxDm, dm); } }
      /* a Sleepy computer pushes your Snags about more gently, so fewer go in the water early on */
      var soft = src && src.by && src.by.team && src.by.team.ctrl === 'ai' && src.by.team.mood === 'sleepy' && c.team.ctrl === 'human' ? 0.72 : 1;
      var pw = (dmg * 0.085 * f + 0.6) * ((src && src.kmul) || 1) * (c.shield ? 0.5 : 1) * soft, a3 = Math.atan2(dy, dx);
      c.swing = null; c.jet = false; c.sled = false;
      c.vx = Math.cos(a3) * pw; c.vy = Math.sin(a3) * pw - 1.4;
      c.st = 'air'; c.knock = true; c.flip = false;
      if (bodyClear(c.x, c.y - 1)) c.y -= 1;
    });
    game.projs.forEach(function (p) {
      var dx = p.x - x, dy = p.y - y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < reach && d > 0.1) { var f = (1 - d / reach) * 3.5; p.vx += dx / d * f; p.vy += dy / d * f - 0.5; p.rest = false; }
    });
    game.arts.forEach(function (a) {
      if (a.st !== 'loose') return;
      var dx = a.x - x, dy = (a.y - 5) - y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < reach && d > 0.1) { var f = (1 - d / reach) * 3; a.vx += dx / d * f * 0.5; a.vy += dy / d * f - 1; a.rest = false; }
    });
    for (i = game.crates.length - 1; i >= 0; i--) {
      var cr = game.crates[i], cd = Math.sqrt((cr.x - x) * (cr.x - x) + (cr.y - 5 - y) * (cr.y - 5 - y));
      if (cd < R + 4) {
        game.crates.splice(i, 1);
        for (var w = 0; w < 8; w++) addPart({ k: 'deb', x: cr.x, y: cr.y - 5, vx: rand(-2, 2), vy: rand(-3, -1), life: 50, col: cr.kind === 'bark' ? '#e0b040' : '#b07a46', big: true });
      }
    }
    game.barrels.forEach(function (bb) {
      var bd = Math.sqrt((bb.x - x) * (bb.x - x) + (bb.y - 5 - y) * (bb.y - 5 - y));
      if (bd < R + 6 && !bb.fuse) { bb.fuse = 8; bb.by = src && src.by ? src.by : null; }
    });
    game.shake = Math.max(game.shake, Math.min(8, dmg / 7 + hits));
    if (maxDm >= 10) game.hitstop = Math.min(9, 2 + Math.round(maxDm / 10));
    sfx('boom', dmg / 50);
    if (src && src.type) weaponSound(src.type, src.era, 'impact', dmg / 50);
    if (dmg >= 30) duck(0.35, 0.9);
    if (game.state !== 'demo') { game.look = { x: x, y: y - 6 }; game.lookT = Math.max(game.lookT, 26 + Math.min(20, Math.round(dmg / 3))); }
    if (game.koFlag) { /* the knock out gets the spotlight */ }
    else if (hits >= 2) word(x, y - 2, 'DOUBLE!', '#b39cff', 2);
    else if (maxDm >= 45) word(x, y - 2, 'KABOOM!', '#ffd27a', 2);
    else if (maxDm >= 30) word(x, y - 2, 'WHAM!', '#ffd27a', 2);
    if (hits >= 2) say('double');
    else if (maxDm >= 40) say('big');
  }

  /* little dust puffs, coloured like the ground they come off */
  function dust(x, y, n, spread) {
    var gx = clamp(Math.round(x), 0, WW - 1), gy = clamp(Math.round(y) + 1, 0, WH - 1), k = (gy * WW + gx) * 4, col = '#d8cfc0';
    if (data && mask[gy * WW + gx]) col = 'rgb(' + Math.min(255, data[k] + 40) + ',' + Math.min(255, data[k + 1] + 40) + ',' + Math.min(255, data[k + 2] + 40) + ')';
    for (var i = 0; i < n; i++) addPart({ k: 'dust', x: x + rand(-spread, spread), y: y - rand(0, 2), vx: rand(-0.5, 0.5), vy: rand(-0.45, -0.1), life: 22 + Math.random() * 14, max: 36, r: rand(1, 2.4), col: col });
  }
  function splash(x) {
    addPart({ k: 'ripple', x: x, y: WATER, life: 30, max: 30 });
    for (var i = 0; i < 10; i++) addPart({ k: 'drop', x: x + rand(-3, 3), y: WATER, vx: rand(-1, 1), vy: rand(-2.6, -1), life: 40 });
    sfx('splash');
  }

  /* ---------------- Time Museum ---------------- */
  var museum = { found: {}, labels: {} };
  try {
    var ms = JSON.parse(store('museum') || 'null');
    if (ms && ms.found) { museum.found = ms.found; museum.labels = ms.labels || {}; }
  } catch (e) { /* fresh museum */ }
  function saveMuseum() { store('museum', JSON.stringify(museum)); }
  function museumCount(list) { var n = 0; list.forEach(function (a) { if (museum.found[a.id]) n++; }); return n; }

  /* ---------------- buried artefacts ---------------- */
  function surfaceY(x) { for (var y = 4; y < WATER; y++) if (solid(x, y)) return y; return -1; }
  function groundY(x, from) { for (var y = Math.max(0, Math.floor(from)); y < WATER + 2; y++) if (solid(x, y)) return y; return -1; }
  function unfoundFirst(list) {
    return shuffle(list.slice()).sort(function (a, b) { return (museum.found[a.id] ? 1 : 0) - (museum.found[b.id] ? 1 : 0); });
  }
  function buryArts() {
    game.arts = [];
    var picks = unfoundFirst(realOf(MAP.id)).slice(0, 3);
    picks.push(unfoundFirst(glitchOf(MAP.id))[0]);
    picks.forEach(function (a) {
      for (var tries = 0; tries < 80; tries++) {
        var x = 120 + Math.random() * (WW - 240), top = surfaceY(x);
        if (top < 0) continue;
        var by = Math.floor(top + 16 + Math.random() * 38);
        if (by > WATER - 14 || !solid(x, by) || !solid(x, by - 10)) continue;
        var clash = false;
        for (var j = 0; j < game.arts.length; j++) if (Math.abs(game.arts[j].x - x) < 70) clash = true;
        if (clash) continue;
        game.arts.push({ id: a.id, glitch: !!a.glitch, x: x, y: by, st: 'buried', vx: 0, vy: 0, rest: false, glint: Math.floor(Math.random() * 240) });
        break;
      }
    });
  }
  function exposeArts(cx, cy, r) {
    for (var i = 0; i < game.arts.length; i++) {
      var a = game.arts[i];
      if (a.st !== 'buried') continue;
      var dx = a.x - cx, dy = a.y - 5 - cy;
      if (dx * dx + dy * dy > (r + 10) * (r + 10)) continue;
      var open = false;
      for (var oy = -10; oy <= 0 && !open; oy += 2) for (var ox = -5; ox <= 5; ox += 2) if (!solid(a.x + ox, a.y + oy)) { open = true; break; }
      if (!open) continue;
      a.st = 'loose'; a.vy = -1.6; a.vx = rand(-0.5, 0.5); a.rest = false;
      for (var k = 0; k < 10; k++) addPart({ k: 'spark', x: a.x, y: a.y - 6, vx: rand(-1.5, 1.5), vy: rand(-2, -0.4), life: 32 });
      sfx('twinkle');
    }
  }
  function settleThing(o) {
    /* shared falling for loose artefacts and crates: o.y is the row just above the ground */
    if (o.rest) { if (!solid(o.x, o.y + 1)) o.rest = false; else return; }
    o.vy = Math.min(6, o.vy + G);
    var nx = o.x + o.vx, ny = o.y + o.vy;
    if (solid(nx, ny)) {
      if (o.vy > 0 && solid(o.x, ny)) {
        o.y = Math.floor(ny);
        var k = 0;
        while (solid(o.x, o.y) && k < 8) { o.y--; k++; }
        o.vx = 0; o.vy = 0; o.rest = true;
      } else { o.vx = -o.vx * 0.3; o.vy = Math.max(o.vy, 0); }
    } else { o.x = clamp(nx, 4, WW - 4); o.y = ny; }
  }
  function updArts() {
    for (var i = 0; i < game.arts.length; i++) {
      var a = game.arts[i];
      if (a.st === 'buried') { a.glint++; continue; }
      if (a.st !== 'loose') continue;
      settleThing(a);
      if (a.y > WATER + 4) { a.st = 'lost'; splash(a.x); continue; }
      for (var j = 0; j < game.snags.length; j++) {
        var c = game.snags[j];
        if (!c.alive || c.team.ctrl !== 'human') continue;
        if (Math.abs(a.x - c.x) < 9 && a.y > c.y - 22 && a.y < c.y + 5) { collectArt(a, c); break; }
      }
    }
  }
  function collectArt(a, c) {
    a.st = 'got';
    var info = artInfo(a.id), isNew = !museum.found[a.id];
    if (isNew) museum.found[a.id] = { at: Date.now(), by: c.team.name };
    saveMuseum();
    if (game.finds.indexOf(a.id) < 0) game.finds.push(a.id);
    c.found = (c.found || 0) + 1;
    for (var k = 0; k < 14; k++) addPart({ k: 'spark', x: a.x, y: a.y - 6, vx: rand(-2, 2), vy: rand(-2.5, -0.5), life: 40 });
    sfx('find'); c.cheerT = 45;
    say(info.glitch ? 'glitch' : 'find', true);
    showFind(info, isNew);
  }

  /* ---------------- era barrels: tar pots, oil jars and fuel cells that set each other off ---------------- */
  var BARREL = { pre: 'tar', egypt: 'oil', fut: 'fuel' };
  function placeBarrels() {
    game.barrels = [];
    var n = 2 + Math.floor(Math.random() * 3), kind = BARREL[MAP.era] || 'tar';
    for (var tries = 0; tries < 120 && game.barrels.length < n; tries++) {
      var x = 100 + Math.random() * (WW - 200), y = surfaceY(x), ok = y > 40 && y < WATER - 30 && !solid(x, y - 12) && !solid(x - 4, y - 8) && !solid(x + 4, y - 8);
      for (var j = 0; ok && j < game.snags.length; j++) if (Math.abs(game.snags[j].x - x) < 40) ok = false;
      for (j = 0; ok && j < game.barrels.length; j++) if (Math.abs(game.barrels[j].x - x) < 60) ok = false;
      if (ok) game.barrels.push({ x: x, y: y - 1, vx: 0, vy: 0, rest: false, kind: kind, fuse: 0, by: null });
    }
  }
  function updBarrels() {
    for (var i = game.barrels.length - 1; i >= 0; i--) {
      var b = game.barrels[i];
      if (b.fuse > 0) { if (--b.fuse === 0) { game.barrels.splice(i, 1); explode(b.x, b.y - 5, 30, 36, { by: b.by, kmul: 1.1 }); say('big'); } continue; }
      settleThing(b);
      if (b.y > WATER + 4) { game.barrels.splice(i, 1); splash(b.x); }
    }
  }

  /* ---------------- Bonnie's crate deliveries ---------------- */
  function maybeDeliver(force) {
    if (game.courier) return;
    if (!force && (game.turnNo < 3 || game.crates.length >= 2 || Math.random() > 0.4)) return;
    for (var tries = 0; tries < 40; tries++) {
      var x = 100 + Math.random() * (WW - 200), y = surfaceY(x);
      if (y < 40 || y > WATER - 30) continue;
      var near = false;
      for (var i = 0; i < game.snags.length; i++) { var s = game.snags[i]; if (s.alive && Math.abs(s.x - x) < 30) near = true; }
      if (near) continue;
      var dir = Math.random() < 0.5 ? 1 : -1, sx = x - dir * 64, sy = surfaceY(sx);
      if (sy < 0 || sy > WATER - 20 || Math.abs(sy - y) > 30) continue;
      game.courier = { x: sx, y: sy, px: sx, py: sy - 12, dir: dir, dropX: x, t: 0, phase: 'out', carry: true, kind: (function (r) { return r < 0.14 ? 'bark' : (r < 0.3 ? 'skip' : (r < 0.5 ? 'fest' : 'snack')); })(Math.random()) };
      game.look = { x: x, y: y - 20 }; game.lookT = 110;
      sfx('portal');
      return;
    }
  }
  function walkDog(o, speed) {
    /* move a dog along the ground; returns false if a wall stops her */
    if (o.air) {
      o.vy = Math.min(6, o.vy + G); o.y += o.vy; o.x += o.dir * speed;
      if (solid(o.x, o.y)) { var k = 0; while (solid(o.x, o.y) && k < 10) { o.y--; k++; } o.air = false; o.vy = 0; }
      return true;
    }
    var nx = o.x + o.dir * speed;
    for (var up = 0; up <= 8; up++) {
      if (!solid(nx, o.y - 1 - up) && !solid(nx, o.y - 9 - up)) {
        o.x = nx; o.y -= up;
        if (!solid(o.x, o.y)) {
          var down = 0;
          while (!solid(o.x, o.y) && down < 4) { o.y++; down++; }
          if (!solid(o.x, o.y)) { o.air = true; o.vy = 0; }
        }
        return true;
      }
    }
    return false;
  }
  function updCourier() {
    var b = game.courier;
    if (!b) return;
    b.t++;
    if (b.phase === 'out') { if (b.t > 20) { b.phase = 'run'; b.t = 0; } return; }
    if (b.phase === 'run' || b.phase === 'back') {
      var ok = walkDog(b, 1.2);
      if (b.y > WATER || b.t > 300) { b.phase = 'in'; b.t = 0; b.px = b.x; b.py = Math.min(b.y, WATER) - 12; return; }
      if (b.phase === 'run' && (!ok || Math.abs(b.x - b.dropX) < 1.3)) {
        game.crates.push({ x: b.x + b.dir * 6, y: b.y - 2, vx: 0, vy: 0, rest: false, kind: b.kind });
        b.carry = false; b.phase = 'back'; b.dir = -b.dir; b.t = 0;
        sfx('bounce'); voice('dog', 'cheer'); say('crate', true);
      } else if (b.phase === 'back' && (!ok || Math.abs(b.x - b.px) < 1.3 || b.t > 120)) {
        b.phase = 'in'; b.t = 0; b.px = b.x; b.py = b.y - 12; sfx('portal');
      }
      return;
    }
    if (b.phase === 'in' && b.t > 22) game.courier = null;
  }
  function updCrates() {
    for (var i = game.crates.length - 1; i >= 0; i--) {
      var cr = game.crates[i];
      settleThing(cr);
      if (cr.y > WATER + 4) { game.crates.splice(i, 1); splash(cr.x); continue; }
      for (var j = 0; j < game.snags.length; j++) {
        var s = game.snags[j];
        if (!s.alive) continue;
        if (Math.abs(cr.x - s.x) < 10 && cr.y > s.y - 22 && cr.y < s.y + 5) { openCrate(cr, s); game.crates.splice(i, 1); break; }
      }
    }
  }
  function openCrate(cr, s) {
    for (var k = 0; k < 10; k++) addPart({ k: 'spark', x: cr.x, y: cr.y - 5, vx: rand(-1.6, 1.6), vy: rand(-2.2, -0.5), life: 30 });
    if (cr.kind === 'skip') {
      s.team.bonus = true;
      addPart({ k: 'txt', x: s.x, y: s.y - 44, vy: -0.35, life: 90, max: 90, s: 'BONUS GO!', col: '#b39cff', sc: 2 });
      banner('Bonus go!', null, '#7b5cff', 'hourglass'); sfx('portal');
    } else if (cr.kind === 'fest') {
      s.team.members.forEach(function (m) {
        if (!m.alive) return;
        var h = Math.min(15, 100 - m.hp); m.hp += h;
        if (h > 0) addPart({ k: 'txt', x: m.x, y: m.y - 44, vy: -0.35, life: 80, max: 80, s: '+' + h, col: '#9be36b', sc: 2 });
        for (var q = 0; q < 6; q++) addPart({ k: 'spark', x: m.x + rand(-6, 6), y: m.y - rand(4, 20), vx: rand(-0.4, 0.4), vy: rand(-1, -0.3), life: 30 });
      });
      banner('Snack fest!', null, '#7ec850', 'cup'); sfx('find');
    } else if (cr.kind === 'bark') {
      s.team.bark = (s.team.bark || 0) + 1;
      addPart({ k: 'txt', x: s.x, y: s.y - 44, vy: -0.35, life: 90, s: 'BARK!', col: '#ffd27a', sc: 2, max: 90 });
      banner("Bonnie's Bark!", null, '#e0b040', 'kit');
      sfx('find');
    } else {
      var heal = Math.min(25, 100 - s.hp);
      s.hp += heal;
      addPart({ k: 'txt', x: s.x, y: s.y - 44, vy: -0.35, life: 80, max: 80, s: '+' + heal, col: '#9be36b', sc: 2 });
      sfx('twinkle');
    }
    voice(s.team.era, 'cheer'); s.cheerT = 30;
  }

  /* ---------------- Bonnie's Bark, the rare superweapon ---------------- */
  function updBarker() {
    var b = game.barker;
    if (!b) return;
    b.t++;
    if (b.phase === 'out') { if (b.t > 20) { b.phase = 'run'; b.t = 0; } return; }
    if (b.phase === 'run') {
      for (var i = 0; i < game.snags.length; i++) {
        var s = game.snags[i];
        if (s.alive && s.team !== b.by.team && Math.abs(s.x - b.x) < 12 && Math.abs(s.y - b.y) < 20) { woof(b); return; }
      }
      if (b.t > 260 || b.x < 6 || b.x > WW - 6) { woof(b); return; }
      if (!walkDog(b, 1.8)) {
        /* a wall: hop it, then try the other way, and only bark if she is truly stuck */
        if (!b.hopped) { b.hopped = true; b.air = true; b.vy = -3.6; b.y -= 1; }
        else if (!b.turned) { b.turned = true; b.dir = -b.dir; b.hopped = false; }
        else { woof(b); }
        return;
      }
      if (!b.air && b.hopped && b.t % 30 === 0) b.hopped = false;
      if (b.y > WATER) { b.phase = 'swim'; b.t = 0; b.y = WATER; splash(b.x); say('water'); }
      return;
    }
    if (b.phase === 'woof' && b.t > 34) { b.phase = 'in'; b.t = 0; b.px = b.x; b.py = b.y - 12; sfx('portal'); return; }
    if (b.phase === 'swim' && b.t > 50) { b.phase = 'in'; b.t = 0; b.px = b.x; b.py = WATER - 12; sfx('portal'); return; }
    if (b.phase === 'in' && b.t > 22) game.barker = null;
  }
  function woof(b) {
    b.phase = 'woof'; b.t = 0;
    voice('dog', 'woof');
    addPart({ k: 'txt', x: b.x, y: b.y - 36, vy: -0.3, life: 70, s: 'WOOF!', col: '#ffffff' });
    explode(b.x + b.dir * 4, b.y - 6, WEAP.bark.R, WEAP.bark.dmg, { by: b.by });
  }

  /* ---------------- Jay on commentary ---------------- */
  var jayOn = store('jay') !== '0', jayLast = -9999, jayHide = 0, jayTalk = 0, jayMood = null;
  var jayCv = $('jayFace');
  function say(kind, force) {
    if (!jayOn || game.state === 'demo' || !JAY[kind]) return;
    if (game.t - jayLast < 90) return;
    if (!force && (game.t - jayLast < 480 || Math.random() > 0.6)) return;
    jayLast = game.t;
    var lines = JAY[kind];
    $('jayLine').textContent = lines[Math.floor(Math.random() * lines.length)];
    $('jay').hidden = false;
    jayHide = 260; jayTalk = 50;
    jayMood = { big: 'wow', double: 'wow', glitch: 'wow', strike: 'wow', sudden: 'wow', reactor: 'wow', sandstorm: 'wow', sun: 'wow', scarab: 'wow',
      birds: 'grin', find: 'grin', crate: 'grin', win: 'grin', swing: 'grin', jet: 'grin', sled: 'grin', spear: 'grin', dune: 'grin', bark: 'grin' }[kind] || null;
    voice('jay', 'turn');
  }
  function jayTick() {
    if (jayTalk > 0) { jayTalk--; if (jayTalk % 6 === 0) SP.jay(jayCv, jayTalk > 0 && (jayTalk / 6) % 2 === 1, jayMood === 'wow' && (jayTalk / 6) % 2 === 1 ? null : jayMood); }
    else if (jayHide > 0) {
      var bt = jayHide % 120;
      if (bt === 10) SP.jay(jayCv, false, 'blink'); else if (bt === 4) SP.jay(jayCv, false, jayMood === 'wow' ? null : jayMood);
    }
    if (jayHide > 0 && --jayHide === 0) $('jay').hidden = true;
  }

  /* ---------------- birds (Jay likes birds) ---------------- */
  function updBirds() {
    if (game.t % 1500 === 600) {
      var dir = Math.random() < 0.5 ? 1 : -1, n = 3 + Math.floor(Math.random() * 3), y = 18 + Math.random() * 40;
      for (var i = 0; i < n; i++) game.birds.push({ x: dir > 0 ? -20 - i * 9 : VW + 20 + i * 9, y: y + (i % 2) * 6 + i * 2, vx: dir * rand(0.45, 0.6), ph: Math.floor(Math.random() * 20) });
      say('birds');
    }
    if (MAP.style === 'city') {
      if (game.t % 150 === 30 && game.cars.length < 6) {
        var cd = Math.random() < 0.5 ? 1 : -1;
        game.cars.push({ x: cd > 0 ? -10 : VW + 10, y: 30 + Math.random() * VH * 0.4, vx: cd * rand(1.1, 2) });
      }
      for (var q = game.cars.length - 1; q >= 0; q--) { game.cars[q].x += game.cars[q].vx; if (game.cars[q].x < -30 || game.cars[q].x > VW + 30) game.cars.splice(q, 1); }
    }
    for (var j = game.birds.length - 1; j >= 0; j--) {
      var b = game.birds[j];
      b.x += b.vx; b.y += Math.sin((game.t + b.ph * 7) * 0.05) * 0.1;
      if (b.x < -60 || b.x > VW + 60) game.birds.splice(j, 1);
    }
  }

  /* ---------------- turns ---------------- */
  function rollWind() { return clamp(Math.round(randn() * 4), -10, 10); }
  function teamAlive(t) { for (var i = 0; i < t.members.length; i++) if (t.members[i].alive) return true; return false; }

  function startTurn() {
    var team = game.teams[game.tIdx], m = team.members, c = null, k;
    for (k = 1; k <= m.length; k++) {
      var j = ((team.idx + k) % m.length + m.length) % m.length;
      if (m[j].alive) { c = m[j]; team.idx = j; break; }
    }
    if (!c) { if (!checkOver()) nextTurn(); return; }
    game.active = c; game.turnNo++; freeCam = null;
    game.state = 'play'; game.fired = false; game.charging = false; game.power = 0;
    game.swingT = 0; game.digT = 0; game.timer = game.turnLen * 60; game.lookT = 0;
    game.weapon = team.lastWeapon || 'lob';
    if (!avail(team, game.weapon).ok && !WEAP[game.weapon].tool) game.weapon = 'lob';
    team.members.forEach(function (m) { m.shield = false; });
    game.fuel = WEAP.jet.fuel; game.sledFuel = WEAP.sled.fuel; game.tx = null;
    game.wind = rollWind();
    if (game.opts && game.opts.sd !== 'off' && !game.sudden && game.turnNo >= SD_TURN) {
      game.sudden = true;
      var sty = MAP.style;
      later(156, function () {
        if (sty === 'city') banner('Meltdown!', null, '#ef7724', 'meteor');
        else if (sty === 'desert') banner('Sandstorm!', null, '#ef7724', 'meteor');
        else banner('Sudden Death!', null, '#ef7724', 'meteor');
      });
      say(sty === 'city' ? 'reactor' : (sty === 'desert' ? 'sandstorm' : 'sudden'), true);
    }
    if (game.sudden && MAP.style === 'desert' && Math.abs(game.wind) < 5) game.wind = (game.wind < 0 ? -1 : 1) * (5 + Math.floor(Math.random() * 4));
    maybeDeliver();
    banner(c.name + "'s go", null, ER[team.era].tag, team.ctrl === 'ai' ? 'cpu' : null);
    sfx('turn', { pre: 1, egypt: 2, fut: 3 }[team.era] || 0);
    voice(team.era, 'turn');
    musicEra(team.era);
    game.ai = team.ctrl === 'ai' ? { phase: 'wait', t: 0, walked: false } : null;
    saveMatch();
    hudStatic();
  }

  function nextTurn() {
    var cur = game.teams[game.tIdx];
    if (cur && cur.bonus && teamAlive(cur)) { cur.bonus = false; startTurn(); return; }
    var n = game.teams.length;
    for (var k = 0; k < n; k++) {
      game.tIdx = (game.tIdx + 1) % n;
      if (teamAlive(game.teams[game.tIdx])) break;
    }
    startTurn();
  }

  function endTurn() {
    if (game.state !== 'play' && game.state !== 'retreat') return;
    game.state = 'settle'; game.settleT = 0; game.settleAll = 0; game.charging = false; game.ai = null;
    game.swingT = 0; game.digT = 0;
    game.snags.forEach(function (c) { c.swing = null; c.jet = false; c.sled = false; c.sv = 0; });
    if (game.sudden) {
      WATER = Math.max(300, WATER - 5); miniDirty = true;
      var n = 3 + Math.floor(Math.random() * 2);
      for (var i = 0; i < n; i++) game.warn.push({ x: 60 + Math.random() * (WW - 120), t: -i * 12 });
    }
  }

  function settle() {
    var busy = game.projs.length > 0 || !!game.barker || game.strikes.length > 0 || game.warn.length > 0 || game.barrels.some(function (b) { return b.fuse > 0; }), i;
    for (i = 0; i < game.snags.length && !busy; i++) { var c = game.snags[i]; if (c.alive && c.st === 'air') busy = true; }
    game.settleAll = (game.settleAll || 0) + 1;
    if (busy && game.settleAll < 900) { game.settleT = 0; return; }
    if (++game.settleT < 16) return;
    var dying = game.snags.filter(function (s) { return s.alive && s.hp <= 0; });
    if (dying.length) { dying.forEach(zapHome); game.state = 'portals'; game.portT = 80; return; }
    afterSettle();
  }

  function afterSettle() { if (checkOver()) return; nextTurn(); }

  function checkOver() {
    var left = game.teams.filter(teamAlive);
    if (left.length > 1) return false;
    game.winner = left[0] || null; game.state = 'over'; game.active = null;
    store('save', null);
    if (!TEST) {
      bumpStat('matches');
      var foeT = game.teams.filter(function (t) { return t !== game.winner; })[0];
      if (game.winner && game.winner.ctrl === 'human' && foeT && foeT.ctrl === 'ai') { bumpStat('wins'); if (foeT.mood === 'legendary') bumpStat('legend'); }
    }
    if (game.winner) voice(game.winner.era, 'cheer');
    say('win', true);
    later(108, showOver);
    return true;
  }

  function passTurn() {
    if (game.state !== 'play' || game.fired) return;
    banner('Breather', null, '#c3bce8', 'cup');
    say('breather', true);
    endTurn();
  }

  function fire() {
    if (game.state !== 'play') return;
    var c = game.active, wid = game.weapon, w = WEAP[wid];
    if (!c || !w) return;
    /* mobility tools never use up the go */
    if (w.kind === 'vine') { useVine(c); return; }
    if (w.kind === 'jet') { useJet(c); return; }
    if (w.kind === 'sled') { useSled(c); return; }
    if (game.fired) return;
    if (c.st !== 'ground') { game.charging = false; game.power = 0; return; }
    var av = avail(c.team, wid);
    if (!av.ok) {
      game.charging = false; game.power = 0;
      banner(av.locked ? String(av.locked) : 'x0', null, '#ffc24a', av.locked ? 'lock' : 'kit');
      return;
    }
    game.fired = true; game.charging = false; game.stats.shots++;
    if (c.team.ctrl === 'human') learnDone('fire');
    c.team.lastWeapon = wid;
    useAmmo(c.team, wid);
    var p;
    if (w.kind === 'proj') {
      var pw = Math.max(8, game.power), sp = w.vmax * pw / 100;
      var a = c.aim * Math.PI / 180, tip = SP.tip(c.x, c.y, c.face, c.aim, wid);
      p = { type: wid, era: c.team.era, x: tip.x, y: tip.y, vx: Math.cos(a) * c.face * sp, vy: -Math.sin(a) * sp, age: 0, by: c, trail: [], rest: false, kmul: w.knock || 1 };
      if (w.fuse) p.fuse = w.fuse;
      if (solid(tip.x, tip.y)) {
        if (w.impact || w.hit) explode(tip.x, tip.y, w.R, w.dmg, p);
        else { p.x = c.x; p.y = c.y - 10; p.vx *= 0.3; p.vy *= 0.3; game.projs.push(p); }
      } else game.projs.push(p);
      weaponSound(wid, c.team.era, 'launch', pw / 100);
      game.lastPower = Math.round(pw);
      /* recoil: a squash, a puff at the tip and a little kick */
      c.fireT = 10; kick(c, -0.24); game.shake = Math.max(game.shake, 0.6 + pw / 80);
      for (var mp = 0; mp < 5; mp++) addPart({ k: 'puff', x: tip.x, y: tip.y, vx: Math.cos(a) * c.face * rand(0.2, 0.9) + rand(-0.2, 0.2), vy: -Math.sin(a) * rand(0.2, 0.9) + rand(-0.2, 0.2), life: 18, max: 18, r: rand(1.5, 2.6) });
      for (mp = 0; mp < 4; mp++) addPart({ k: 'spark', x: tip.x, y: tip.y, vx: Math.cos(a) * c.face * rand(1, 2.2), vy: -Math.sin(a) * rand(1, 2.2) + rand(-0.5, 0.5), life: 12 });
    } else if (w.kind === 'place') {
      p = { type: wid, era: c.team.era, x: c.x + c.face * 7, y: c.y - 4, vx: c.face * 0.3, vy: -0.4, age: 0, by: c, trail: [], rest: false, fuse: w.fuse, kmul: w.knock || 1 };
      game.projs.push(p); weaponSound(wid, c.team.era, 'launch');
    } else if (w.kind === 'melee') { game.swingT = 24; sfx('whoosh'); }
    else if (w.kind === 'dig') { game.digT = w.time; }
    else if (w.kind === 'beam') fireLaser(c);
    else if (w.kind === 'wall') buildWall(c);
    else if (w.kind === 'dune') buildDune(c);
    else if (w.kind === 'shield') {
      c.shield = true; c.cheerT = 30; sfx('twinkle');
      for (var k = 0; k < 12; k++) addPart({ k: 'spark', x: c.x + rand(-8, 8), y: c.y - rand(2, 22), vx: rand(-0.4, 0.4), vy: rand(-0.8, -0.2), life: 30 });
    } else if (w.kind === 'strike') startStrike(c, game.tx === null ? c.x + c.face * 150 : game.tx, wid);
    else if (w.kind === 'bark') {
      var bx = c.x + c.face * 14, by = groundY(bx, c.y - 12);
      if (by < 0 || Math.abs(by - c.y) > 16) { bx = c.x; by = c.y; }
      game.barker = { x: bx, y: by, px: bx, py: by - 12, dir: c.face, t: 0, phase: 'out', by: c, air: false, vy: 0 };
      c.cheerT = 40; sfx('portal'); say('bark', true);
    }
    if (!avail(c.team, wid).ok) c.team.lastWeapon = 'lob';
    game.state = 'retreat'; game.retreat = c.team.ctrl === 'ai' ? 45 : 150; game.power = 0;
  }

  /* ---------- mobility tools ---------- */
  function vineTrace(c) {
    var a = c.aim * Math.PI / 180, dx = Math.cos(a) * c.face, dy = -Math.sin(a), x0 = c.x, y0 = c.y - 12;
    for (var d = 6; d <= WEAP.vine.range; d++) {
      var x = x0 + dx * d, y = y0 + dy * d;
      if (solid(x, y)) return { x: x - dx, y: y - dy };
    }
    return null;
  }
  function useVine(c) {
    if (c.swing) { c.swing = null; return; }
    var hit = vineTrace(c), a = c.aim * Math.PI / 180;
    if (!hit) {
      addPart({ k: 'vinemiss', x: c.x, y: c.y - 12, x2: c.x + Math.cos(a) * c.face * 50, y2: c.y - 12 - Math.sin(a) * 50, life: 16 });
      sfx('whoosh');
      return;
    }
    var dx = c.x - hit.x, dy = (c.y - 10) - hit.y;
    c.swing = { ax: hit.x, ay: hit.y, len: Math.max(18, Math.sqrt(dx * dx + dy * dy) - 8) };
    c.jet = false; c.knock = false; c.flip = false;
    if (c.st === 'ground' && bodyClear(c.x, c.y - 1)) c.y -= 1;
    c.st = 'air';
    sfx('whoosh'); say('swing');
  }
  function useJet(c) {
    if (c.jet) { c.jet = false; return; }
    if (game.fuel <= 0) { banner('0%', null, '#ffc24a', 'fuel'); return; }
    c.jet = true; c.swing = null; c.knock = false; c.flip = false;
    if (c.st === 'ground' && bodyClear(c.x, c.y - 2)) c.y -= 2;
    c.st = 'air'; c.vy = -1.2;
    sfx('jet'); say('jet');
  }

  function useSled(c) {
    if (c.sled) { c.sled = false; c.sv = 0; return; }
    if (game.sledFuel <= 0) { banner('0%', null, '#ffc24a', 'fuel'); return; }
    if (c.st !== 'ground') return;
    c.sled = true; c.sv = c.face * 1.1; c.swing = null; c.jet = false;
    sfx('whoosh'); say('sled');
  }

  /* ---------- Throwing Spear: a direct hit does the real damage ---------- */
  function spearHit(p) {
    var h = p.hitSnag, w = WEAP[p.type];
    if (!h || !h.alive || (p.by && h === p.by)) return;
    hurt(h, w.direct, p);
    var dir = p.vx >= 0 ? 1 : -1, k = h.shield ? 0.5 : 1;
    h.vx = dir * 2.4 * k; h.vy = -2.2 * k; h.st = 'air'; h.knock = true; h.swing = null; h.jet = false; h.sled = false;
    if (bodyClear(h.x, h.y - 1)) h.y -= 1;
    say('spear', true);
  }

  /* ---------- Scarab Beetle: once it lands it scuttles after the nearest enemy ---------- */
  function crawlScarab(p) {
    if (!p.rest) return;
    var tgt = null, bd = 200, i;
    for (i = 0; i < game.snags.length; i++) {
      var s2 = game.snags[i];
      if (!s2.alive || (p.by && s2.team === p.by.team)) continue;
      var ddx = Math.abs(s2.x - p.x);
      if (ddx < bd && Math.abs(s2.y - p.y) < 50) { bd = ddx; tgt = s2; }
    }
    if (!tgt) return;
    if (!p.crawling) { p.crawling = true; say('scarab'); }
    var dir = tgt.x > p.x ? 1 : -1;
    p.face = dir;
    if (Math.abs(tgt.x - p.x) < 5 && p.y > tgt.y - 22 && p.y < tgt.y + 5) { p.fuse = 1; return; }
    if (p.age % 2) return;
    var nx = p.x + dir;
    for (var up = 0; up <= 3; up++) {
      if (!solid(nx, p.y - up) && !solid(nx, p.y - up - 2)) {
        p.x = nx; p.y -= up;
        var k = 0;
        while (!solid(p.x, p.y + 2) && k < 4) { p.y++; k++; }
        if (!solid(p.x, p.y + 2)) p.rest = false;
        return;
      }
    }
  }

  /* ---------- Precision Laser ---------- */
  function laserTrace(c, face, aim) {
    var a = aim * Math.PI / 180, dx = Math.cos(a) * face, dy = -Math.sin(a), tip = SP.tip(c.x, c.y, face, aim, 'laser');
    for (var d = 0; d < WEAP.laser.range; d++) {
      var x = tip.x + dx * d, y = tip.y + dy * d;
      if (x < 0 || x >= WW || y < -200 || y > WATER) return { x: x, y: y, sx: tip.x, sy: tip.y, hit: null };
      for (var j = 0; j < game.snags.length; j++) {
        var s = game.snags[j];
        if (s.alive && s !== c && Math.abs(x - s.x) < 5 && y > s.y - 19 && y < s.y) return { x: x, y: y, sx: tip.x, sy: tip.y, hit: s };
      }
      for (var bj = 0; bj < game.barrels.length; bj++) {
        var bq = game.barrels[bj];
        if (Math.abs(x - bq.x) < 5 && y > bq.y - 11 && y < bq.y + 1) return { x: x, y: y, sx: tip.x, sy: tip.y, hit: null, barrel: bq };
      }
      if (solid(x, y)) return { x: x, y: y, sx: tip.x, sy: tip.y, hit: null, wall: true };
    }
    return { x: tip.x + dx * WEAP.laser.range, y: tip.y + dy * WEAP.laser.range, sx: tip.x, sy: tip.y, hit: null };
  }
  function fireLaser(c) {
    var r = laserTrace(c, c.face, c.aim);
    addPart({ k: 'beam', x: r.sx, y: r.sy, x2: r.x, y2: r.y, life: 18 });
    sfx('zap');
    if (r.hit) {
      var h = r.hit;
      hurt(h, WEAP.laser.dmg, { by: c });
      h.vx = c.face * 1.6 * (h.shield ? 0.5 : 1); h.vy = -1.8; h.st = 'air'; h.knock = true; h.swing = null; h.jet = false;
      if (bodyClear(h.x, h.y - 1)) h.y -= 1;
      say('zap');
    } else if (r.barrel) { if (!r.barrel.fuse) { r.barrel.fuse = 2; r.barrel.by = c; } }
    else if (r.wall) carve(r.x, r.y, 6, true);
  }

  /* ---------- Stone Barricade: builds new solid ground ---------- */
  function buildWall(c) {
    var cx = Math.round(c.x + c.face * 12), gy = groundY(cx, c.y - 24), P = MAP.pal;
    if (gy < 0 || gy > c.y + 30) gy = Math.round(c.y);
    var top = gy - 26, x, y;
    for (y = Math.max(0, top); y <= gy + 2 && y < WH; y++) {
      for (x = cx - 3; x <= cx + 3; x++) {
        if (x < 0 || x >= WW) continue;
        var blocked = false;
        for (var j = 0; j < game.snags.length; j++) {
          var s = game.snags[j];
          if (s.alive && Math.abs(x - s.x) <= 5 && y > s.y - 21 && y <= s.y) { blocked = true; break; }
        }
        if (blocked) continue;
        var i = y * WW + x, edge = x === cx - 3 || x === cx + 3 || y === top;
        mask[i] = 1; burnt[i] = 0;
        setPx(i, edge ? [74, 70, 64] : ((y - top) % 7 === 0 ? [104, 98, 90] : (hash(x, y) < 0.5 ? P.rock : P.rockL)));
      }
    }
    tctx.putImageData(img, 0, 0, cx - 3, Math.max(0, top), 7, gy - Math.max(0, top) + 3);
    miniDirty = true;
    sfx('bonk'); game.shake = Math.max(game.shake, 1.5);
    for (var k = 0; k < 10; k++) addPart({ k: 'deb', x: cx + rand(-4, 4), y: gy - 2, vx: rand(-1, 1), vy: rand(-1.8, -0.4), life: 30, col: 'rgb(160,152,140)' });
  }

  /* ---------- Sand Barrier: piles up a dune of new solid sand ---------- */
  function buildDune(c) {
    var cx = Math.round(c.x + c.face * 17), gy = groundY(cx, c.y - 24), rw = 15, rh = 17, x, y, x0 = WW, x1 = 0, y0 = WH;
    if (gy < 0 || gy > c.y + 30) gy = Math.round(c.y);
    for (x = cx - rw; x <= cx + rw; x++) {
      if (x < 0 || x >= WW) continue;
      var u = (x - cx) / rw, ytop = gy - Math.round(rh * Math.max(0, 1 - u * u) * (1 - 0.15 * Math.abs(u)));
      for (y = Math.max(0, ytop); y < Math.min(WH, ytop + 70); y++) {
        var i = y * WW + x;
        if (mask[i] && y > ytop) break;
        if (mask[i]) continue;
        var blocked = false;
        for (var j = 0; j < game.snags.length; j++) {
          var s2 = game.snags[j];
          if (s2.alive && Math.abs(x - s2.x) <= 5 && y > s2.y - 21 && y <= s2.y) { blocked = true; break; }
        }
        if (blocked) continue;
        mask[i] = 1; burnt[i] = 0;
        setPx(i, y - ytop < 2 ? [246, 216, 150] : (hash(x, y) < 0.5 ? [228, 192, 122] : [214, 174, 106]));
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y);
      }
    }
    if (x1 >= x0) tctx.putImageData(img, 0, 0, x0, y0, x1 - x0 + 1, Math.min(WH - y0, 90));
    miniDirty = true;
    sfx('dig'); sfx('whoosh');
    for (var k = 0; k < 16; k++) addPart({ k: 'deb', x: cx + rand(-12, 12), y: gy - rand(2, 14), vx: rand(-1, 1), vy: rand(-2, -0.4), life: 34, col: 'rgb(236,204,136)' });
    say('dune');
  }

  /* Sun Mirror: hot sand turns to glass around the blast */
  function glassify(cx, cy, r) {
    var x0 = Math.max(0, Math.floor(cx - r)), x1 = Math.min(WW - 1, Math.ceil(cx + r));
    var y0 = Math.max(0, Math.floor(cy - r)), y1 = Math.min(WH - 1, Math.ceil(cy + r));
    for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) {
      var dx = x - cx, dy = y - cy, i = y * WW + x;
      if (dx * dx + dy * dy > r * r || !mask[i]) continue;
      var k = i * 4, sh = hash(x, y) < 0.12;
      data[k] = sh ? 236 : (data[k] * 0.4 + 120 * 0.6) | 0;
      data[k + 1] = sh ? 255 : (data[k + 1] * 0.4 + 214 * 0.6) | 0;
      data[k + 2] = sh ? 250 : (data[k + 2] * 0.4 + 204 * 0.6) | 0;
    }
    tctx.putImageData(img, 0, 0, x0, y0, x1 - x0 + 1, y1 - y0 + 1);
  }

  /* ---------- superweapon strikes ---------- */
  function startStrike(c, tx, wid) {
    var w = WEAP[wid];
    game.strikes.push({ style: w.style, x: clamp(tx, 10, WW - 10), y: -60, vy: 1, t: 0, by: c, R: w.R, dmg: w.dmg, kmul: w.knock || 1 });
    sfx(w.style === 'beam' ? 'zap' : (w.style === 'sun' ? 'twinkle' : 'whoosh')); say(w.style === 'sun' ? 'sun' : 'strike', true);
  }
  function updStrikes() {
    for (var i = game.strikes.length - 1; i >= 0; i--) {
      var s = game.strikes[i], j, c;
      s.t++;
      if (s.style === 'boulder') {
        if (s.t < 30) continue;
        s.vy = Math.min(9, s.vy + 0.3); s.y += s.vy;
        var hit = s.y > WATER - 8 || solid(s.x, s.y + 11) || solid(s.x - 8, s.y + 7) || solid(s.x + 8, s.y + 7);
        for (j = 0; j < game.snags.length && !hit; j++) {
          c = game.snags[j];
          if (c.alive && Math.abs(s.x - c.x) < 14 && s.y + 11 > c.y - 20 && s.y < c.y) hit = true;
        }
        if (hit) {
          game.strikes.splice(i, 1);
          if (s.y > WATER - 8) { splash(s.x); splash(s.x + 6); splash(s.x - 6); }
          else explode(s.x, s.y + 4, s.R, s.dmg, { by: s.by, kmul: s.kmul });
        }
      } else if (s.style === 'sun') {
        if (s.t % 12 === 0 && s.t < 55) sfx('twinkle');
        if (s.t === 55) {
          var st2 = surfaceY(s.x);
          if (st2 < 0) st2 = WATER;
          explode(s.x, st2 - 2, s.R, s.dmg, { by: s.by, kmul: s.kmul });
          glassify(s.x, st2 - 2, s.R + 5);
          game.shake = Math.max(game.shake, 4);
        }
        if (s.t > 82) game.strikes.splice(i, 1);
      } else {
        if (s.t === 45) {
          var top = surfaceY(s.x);
          if (top < 0) top = WATER;
          for (var yy = top - 10; yy < top + 70; yy += 12) carve(s.x, yy, s.R * 0.8, true);
          for (j = 0; j < game.snags.length; j++) {
            c = game.snags[j];
            if (!c.alive) continue;
            var dx = Math.abs(c.x - s.x);
            if (dx < s.R + 6 && c.y > top - 40) {
              hurt(c, Math.round(s.dmg * (0.4 + 0.6 * (1 - dx / (s.R + 6)))), { by: s.by });
              c.vx = (c.x < s.x ? -1 : 1) * 2.2 * (c.shield ? 0.5 : 1); c.vy = -3.6; c.st = 'air'; c.knock = true; c.swing = null; c.jet = false;
              if (bodyClear(c.x, c.y - 1)) c.y -= 1;
            }
          }
          game.shake = Math.max(game.shake, 5); sfx('boom', 1.4);
        }
        if (s.t > 72) game.strikes.splice(i, 1);
      }
    }
  }

  /* ---------- Sudden Death: telegraphed meteors ---------- */
  function updWarn() {
    for (var i = game.warn.length - 1; i >= 0; i--) {
      var w = game.warn[i];
      if (++w.t >= 80) {
        game.projs.push({ type: 'meteor', era: MAP.era || 'pre', x: w.x + rand(-4, 4), y: -40, vx: rand(-0.5, 0.5), vy: 2.5, age: 0, by: null, trail: [], rest: false });
        game.warn.splice(i, 1);
      }
    }
  }

  function doShove(c) {
    var hit = false;
    game.snags.forEach(function (o) {
      if (!o.alive || o === c) return;
      var dx = (o.x - c.x) * c.face;
      if (dx > -2 && dx < 20 && Math.abs(o.y - c.y) < 16) {
        hurt(o, WEAP.shove.dmg, { by: c });
        o.vx = c.face * 3.4; o.vy = -2.6; o.st = 'air'; o.knock = true; o.flip = false;
        if (bodyClear(o.x, o.y - 1)) o.y -= 1;
        hit = true;
      }
    });
    game.projs.forEach(function (p) {
      if (Math.abs(p.x - (c.x + c.face * 10)) < 14 && Math.abs(p.y - (c.y - 8)) < 14) { p.vx = c.face * 4; p.vy = -2.5; p.rest = false; }
    });
    sfx(hit ? 'bonk' : 'whoosh');
    if (hit) { game.shake = Math.max(game.shake, 2); say('shove'); }
  }

  function doDig(c) {
    var a = Math.min(c.aim, 35) * Math.PI / 180;
    var dx = Math.cos(a) * c.face, dy = -Math.sin(a);
    if (game.digT % 3 === 0) {
      carve(c.x + dx * 7, c.y - 9 + dy * 7, 10, false);
      if (game.digT % 9 === 0) {
        sfx('dig');
        addPart({ k: 'deb', x: c.x + dx * 12, y: c.y - 8, vx: rand(-1, 1), vy: rand(-2, -0.5), life: 30, col: 'rgb(138,90,50)' });
      }
    }
    var nx = c.x + dx * 0.45, ny = c.y + dy * 0.45;
    if (bodyClear(nx, ny)) { c.x = nx; c.y = ny; }
  }

  /* ---------------- computer player ---------------- */
  function simShot(c, wid, face, aim, pw) {
    var w = WEAP[wid], tip = SP.tip(c.x, c.y, face, aim, wid);
    if (solid(tip.x, tip.y)) return { x: tip.x, y: tip.y };
    var a = aim * Math.PI / 180, sp = w.vmax * pw / 100;
    var p = { type: wid, x: tip.x, y: tip.y, vx: Math.cos(a) * face * sp, vy: -Math.sin(a) * sp, age: 0, by: c, rest: false };
    if (w.fuse) p.fuse = w.fuse;
    for (var i = 0; i < 700; i++) {
      var ev = stepProj(p, true);
      if (ev === 'explode') return { x: p.x, y: p.y, hit: p.hitSnag || null };
      if (ev) return { x: p.x, y: p.y, water: true };
    }
    return null;
  }

  function scoreAt(x, y, R, dmg, team, fw, me) {
    var s = 0, reach = R + 10, nearest = 1e9, A = AIP[team.era] || AIP.fut;
    game.snags.forEach(function (o) {
      if (!o.alive) return;
      var d = Math.sqrt((o.x - x) * (o.x - x) + ((o.y - 9) - y) * ((o.y - 9) - y));
      if (o.team !== team) nearest = Math.min(nearest, d);
      if (d < reach) {
        var dm = dmg * (1 - d / reach);
        if (o.team !== team) { s += dm; if (o.hp - dm <= 0) s += A.kill; if (o.y > WATER - 60) s += A.water; if (A.weak) s += dm * (1 - o.hp / 100) * A.weak; }
        else s -= dm * fw * (o === me ? 1.6 : 1);
      }
    });
    return s + Math.max(0, 12 - nearest / 12);
  }

  /* The computer's planning is split into small jobs and run a few at a time over several frames,
     so slower school computers do not stutter while it thinks. */
  function aiPlanner(c, noWalk) {
    var team = c.team, mood = team.mood || 'grumpy';
    var E = { sleepy: { a: 8, p: 10, r: 0.3 }, grumpy: { a: 4.5, p: 6, r: 0.1 }, legendary: { a: 1, p: 1.5, r: 0 } }[mood];
    var A = AIP[team.era] || AIP.fut, fw = A.fw;
    var cands = [], jobs = [];
    var enemies = game.snags.filter(function (o) { return o.alive && o.team !== team; });
    enemies.forEach(function (en) {
      var dx = en.x - c.x;
      if (Math.abs(dx) > 2 && Math.abs(dx) < 18 && Math.abs(en.y - c.y) < 14) {
        cands.push({ weapon: 'shove', face: dx > 0 ? 1 : -1, aim: c.aim, power: 0, score: 24 * A.shove + (en.hp <= 22 ? A.kill : 0) + (en.y > WATER - 60 ? A.water + 4 : 0) });
      }
    });
    function nearestFrom(x, y) {
      var best = null;
      enemies.forEach(function (en) { if (Math.abs(en.y - y) < 40 && Math.abs(en.x - x) < 160 && (!best || Math.abs(en.x - x) < Math.abs(best.x - x))) best = en; });
      return best;
    }
    /* one job = one angle of one weapon, swept across the powers */
    function sweep(wid, face, a0, a1, da, p0, p1, dp, mult, extra) {
      for (var a = a0; a <= a1; a += da) (function (a) {
        jobs.push(function () {
          for (var pw = p0; pw <= p1; pw += dp) {
            var res = simShot(c, wid, face, a, pw);
            if (!res) continue;
            if (extra === 'nowater' && res.water) continue;
            var sc = res.water ? -1 : scoreAt(res.x, res.y, WEAP[wid].R, WEAP[wid].dmg, team, fw, c);
            if (extra === 'spear' && res.hit && res.hit !== c) sc += res.hit.team !== team ? WEAP.spear.direct + (res.hit.hp <= WEAP.spear.direct + 8 ? A.kill : 0) + (res.hit.y > WATER - 60 ? A.water : 0) : -WEAP.spear.direct * fw;
            if (extra === 'nowater') { var tg = nearestFrom(res.x, res.y); if (tg && Math.abs(c.x - res.x) > 30) sc = Math.max(sc, scoreAt(tg.x, tg.y - 6, WEAP[wid].R, WEAP[wid].dmg, team, fw, c) * 0.75); }
            cands.push({ weapon: wid, face: face, aim: a, power: pw, score: sc * mult });
          }
        });
      })(a);
    }
    for (var face = -1; face <= 1; face += 2) {
      sweep('lob', face, -30, 85, 5, 20, 100, 5, A.lob);
      sweep('bomb', face, -10, 80, 10, 30, 100, 10, A.bomb);
      /* era kit: Stone Snags love the boulder, Neon Snags love precision, Sun Snags hunt for direct hits */
      if (kitHas(team, 'boulder') && avail(team, 'boulder').ok) sweep('boulder', face, -10, 70, 10, 30, 100, 10, 1.25);
      if (kitHas(team, 'disc') && avail(team, 'disc').ok) sweep('disc', face, -40, 60, 4, 80, 80, 10, 1.2);
      if (kitHas(team, 'spear') && avail(team, 'spear').ok) sweep('spear', face, -30, 60, 3, 50, 100, 10, 1.1, 'spear');
      if (kitHas(team, 'scarab') && avail(team, 'scarab').ok) sweep('scarab', face, -10, 70, 10, 30, 100, 10, 1.05, 'nowater');
      if (kitHas(team, 'laser') && avail(team, 'laser').ok) (function (face) {
        jobs.push(function () {
          for (var a = -40; a <= 60; a += 2) {
            var lt = laserTrace(c, face, a);
            if (lt.hit && lt.hit.team !== team) cands.push({ weapon: 'laser', face: face, aim: a, power: 0, score: (WEAP.laser.dmg + (lt.hit.hp <= WEAP.laser.dmg ? A.kill : 0)) * 1.15 });
          }
        });
      })(face);
    }
    var i = 0;
    return {
      step: function (ms) {
        var t0 = performance.now();
        while (i < jobs.length && performance.now() - t0 < ms) jobs[i++]();
        return i >= jobs.length;
      },
      finish: function () {
        while (i < jobs.length) jobs[i++]();
        var kit = ER[team.era].kit || [], sup = kit[4], defW = kit[3];
        if (sup && avail(team, sup).ok) {
          enemies.forEach(function (en) {
            cands.push({ weapon: sup, face: en.x > c.x ? 1 : -1, aim: Math.round(c.aim), power: 0, tx: en.x,
              score: scoreAt(en.x, en.y - 9, WEAP[sup].R, WEAP[sup].dmg, team, fw, c) * 0.95 });
          });
        }
        /* variety: a squad gets bored of firing the same thing every go */
        var bore = Math.pow(0.84, Math.min(4, team.aiStreak || 1));
        cands.forEach(function (q) { if (q.weapon === team.aiLast) q.score *= bore; });
        cands.sort(function (p, q) { return q.score - p.score; });
        var pick = cands[0];
        if ((!pick || pick.score < 6) && enemies.length) {
          if (defW && avail(team, defW).ok && Math.random() < 0.6) {
            var nd = enemies.reduce(function (b, o) { return Math.abs(o.x - c.x) < Math.abs(b.x - c.x) ? o : b; });
            return { type: 'fire', phase: 'aim', t: 0, weapon: defW, face: nd.x > c.x ? 1 : -1, aim: Math.round(c.aim), power: 0 };
          }
        }
        if (team.bark > 0 && enemies.length && (!pick || pick.score < 30) && Math.random() < 0.6) {
          var ne = enemies.reduce(function (b, o) { return Math.abs(o.x - c.x) < Math.abs(b.x - c.x) ? o : b; });
          return { type: 'fire', phase: 'aim', t: 0, weapon: 'bark', face: ne.x > c.x ? 1 : -1, aim: Math.round(c.aim), power: 0 };
        }
        /* no good shot from here: move somewhere better first, by jetpack, sled or on foot */
        if ((!pick || pick.score < 12) && !noWalk && enemies.length && (!pick || pick.score < 3 || Math.random() < 0.6)) {
          var near = enemies.reduce(function (b, o) { return Math.abs(o.x - c.x) < Math.abs(b.x - c.x) ? o : b; });
          var dir = near.x > c.x ? 1 : -1, land = surfaceY(clamp(c.x + dir * 70, 10, WW - 10));
          var landOk = land > 0 && land < WATER - 14;
          if (landOk && kitHas(team, 'jet') && game.fuel > 0 && Math.random() < 0.7) return { type: 'move', tool: 'jet', dir: dir, up: 26, dur: 50, t: 0 };
          if (landOk && kitHas(team, 'sled') && game.sledFuel > 0 && Math.random() < 0.6) return { type: 'move', tool: 'sled', dir: dir, dur: 70, t: 0 };
          return { type: 'walk', dir: dir, walkT: 110, t: 0 };
        }
        if (!pick || pick.score < 0.5) return { type: 'pass', t: 0 };
        if (E.r && Math.random() < E.r) pick = cands[Math.floor(Math.random() * Math.min(12, cands.length))];
        team.aiStreak = pick.weapon === team.aiLast ? (team.aiStreak || 1) + 1 : 1;
        team.aiLast = pick.weapon;
        var exact = pick.weapon === 'shove' || WEAP[pick.weapon].kind === 'strike';
        /* Legendary reads everything but the wind perfectly; a strong wind still catches it out a little */
        var pn = E.p + (mood === 'legendary' ? Math.abs(game.wind) * 0.45 : 0);
        return {
          type: 'fire', phase: 'aim', t: 0, weapon: pick.weapon, face: pick.face,
          tx: pick.tx === undefined ? undefined : clamp(pick.tx + randn() * E.a * 3, 10, WW - 10),
          aim: Math.round(clamp(pick.aim + (exact ? 0 : randn() * E.a), -80, 85)),
          power: clamp(pick.power + randn() * pn, 10, 100)
        };
      }
    };
  }
  function aiPlan(c, noWalk) { return aiPlanner(c, noWalk).finish(); }

  function safeAhead(c, dir) {
    var x = c.x + dir * 8;
    for (var y = c.y - 6; y < c.y + 40; y++) if (solid(x, y)) return y < WATER - 4;
    return false;
  }

  function aiTick(c) {
    var A = game.ai;
    if (!A || game.fired || game.state !== 'play') return;
    A.t++;
    if (A.phase === 'wait') {
      if (c.st !== 'ground') return;
      if (!A.plan && A.t > 4) A.plan = aiPlanner(c, A.walked);
      if (A.plan && A.plan.step(5) && A.t > 22) { var P = A.plan.finish(); P.walked = A.walked; game.ai = P; }
      return;
    }
    if (A.type === 'move') {
      /* the computer pilots its own jetpack or sled to a better spot, then thinks again */
      if (A.t === 1) { c.face = A.dir; game.weapon = A.tool; fire(); }
      A.inp = { left: A.dir < 0 && A.t < A.dur, right: A.dir > 0 && A.t < A.dur, up: A.tool === 'jet' && A.t < A.up, down: false };
      if (A.tool === 'sled' && A.t >= A.dur && c.sled) { c.sled = false; c.sv = 0; }
      if ((A.t > A.dur + 10 && c.st === 'ground' && !c.jet && !c.sled) || A.t > 400) { game.weapon = 'lob'; game.ai = { phase: 'wait', t: 10, walked: true }; }
      return;
    }
    if (A.type === 'pass') { if (A.t > 12) passTurn(); return; }
    if (A.type === 'walk') {
      if (c.st === 'ground') {
        if (!safeAhead(c, A.dir)) A.t = A.walkT + 1;
        else if (tryWalk(c, A.dir)) c.walking = 6;
        else if (A.t % 25 === 0) jump(c, false);
      }
      if (A.t > A.walkT && c.st === 'ground') game.ai = { phase: 'wait', t: 20, walked: true };
      return;
    }
    if (c.st !== 'ground') return;
    if (A.phase === 'aim') {
      c.face = A.face; game.weapon = A.weapon;
      if (A.tx !== undefined) game.tx = A.tx;
      var d = A.aim - c.aim;
      if (Math.abs(d) <= 3) { c.aim = A.aim; A.phase = 'charge'; A.t = 0; }
      else { c.aim += d > 0 ? 3 : -3; aimTick(c.aim - (d > 0 ? 3 : -3), c.aim); }
      return;
    }
    if (A.phase === 'charge') {
      if (WEAP[game.weapon].kind !== 'proj') { if (A.t > 6) fire(); return; }
      if (A.t < 6) return;
      game.charging = true;
      game.power = Math.min(100, game.power + 100 / 72);
      if (game.power >= A.power) { game.power = A.power; fire(); }
    }
  }

  /* ---------------- player input ---------------- */
  var inp = { left: false, right: false, up: false, down: false };
  /* a soft click every 5 degrees, so aiming feels like turning a dial */
  function aimTick(a0, a1) { if (Math.floor(a0 / 5) !== Math.floor(a1 / 5)) sfx('aim'); }
  function humanTurn() {
    return !!(game.active && game.active.alive && game.active.team.ctrl === 'human' &&
      (game.state === 'play' || game.state === 'retreat') && !game.overlay);
  }
  function canAct() { return humanTurn() && game.swingT <= 0 && game.digT <= 0; }
  function doJump(back) {
    var c = game.active;
    if (!humanTurn()) return;
    if (c.swing) { c.swing = null; c.vy -= 1.2; sfx('jump'); return; }
    if (c.jet) { c.jet = false; return; }
    if (c.sled) {
      c.sled = false;
      if (c.st === 'ground' && bodyClear(c.x, c.y - 1)) { c.y -= 1; c.st = 'air'; c.vx = c.sv; c.vy = -3; c.airT = 0; sfx('jump'); }
      c.sv = 0;
      return;
    }
    if (!canAct() || c.st !== 'ground' || game.charging) return;
    jump(c, back);
  }
  function firePress() {
    if (!humanTurn() || game.state !== 'play') return;
    var c = game.active, w = WEAP[game.weapon];
    if (c.swing) { c.swing = null; return; }
    if (c.sled) { c.sled = false; c.sv = 0; return; }
    if (w.tool) { fire(); return; }
    if (game.fired || c.st !== 'ground') return;
    if (w.kind === 'proj' && avail(c.team, game.weapon).ok) { game.charging = true; game.power = 0; }
    else fire();
  }
  function fireRelease() { if (game.charging && humanTurn()) fire(); }
  function pickWeapon(wid) {
    if (!wid || !humanTurn() || game.state !== 'play' || game.charging) return;
    var c = game.active, w = WEAP[wid];
    if (game.fired && !w.tool) return;
    if (!w.tool && !avail(c.team, wid).ok) {
      var av = avail(c.team, wid);
      banner(av.locked ? String(av.locked) : 'x0', null, '#ffc24a', av.locked ? 'lock' : 'kit');
      return;
    }
    game.weapon = wid; sfx('click');
    if (w.kind === 'strike' && game.tx === null) game.tx = clamp(c.x + c.face * 150, 10, WW - 10);
  }

  function control() {
    var c = game.active;
    if (!c || !c.alive) return;
    if (game.swingT > 0) { game.swingT--; if (game.swingT === 12) doShove(c); }
    if (game.digT > 0) { game.digT--; doDig(c); }
    if (c.team.ctrl === 'ai') { aiTick(c); return; }
    if (game.overlay) return;
    var busy = game.swingT > 0 || game.digT > 0, kind = WEAP[game.weapon].kind;
    if (kind === 'strike' && game.state === 'play' && !game.fired) {
      if (game.tx === null) game.tx = clamp(c.x + c.face * 150, 10, WW - 10);
      if (inp.left) game.tx = Math.max(10, game.tx - 3);
      if (inp.right) game.tx = Math.min(WW - 10, game.tx + 3);
      if (inp.left || inp.right) { game.look = { x: game.tx, y: c.y - 30 }; game.lookT = 40; }
    } else if (!busy && c.st === 'ground' && !game.charging && !c.sled) {
      if (inp.left && !inp.right) { if (tryWalk(c, -1)) { c.walking = 6; learnDone('walk'); } }
      else if (inp.right && !inp.left) { if (tryWalk(c, 1)) { c.walking = 6; learnDone('walk'); } }
    }
    if (game.state === 'play' && !busy && !c.jet && !c.swing && !c.sled) {
      var a0 = c.aim;
      if (inp.up) { c.aim = Math.min(85, c.aim + 1.2); learnDone('aim'); }
      if (inp.down) { c.aim = Math.max(-80, c.aim - 1.2); learnDone('aim'); }
      aimTick(a0, c.aim);
      if (game.charging) { game.power = Math.min(100, game.power + 100 / 72); if (game.power >= 100) fire(); }
    }
  }

  /* ---------------- sound: everything generated in code ---------------- */
  var AC = null, master = null, sfxG = null, musG = null, jayG = null, noiseB = null, lastVoice = 0, verb = null, crunch = null, leadBus = null;
  function vol(k, d) { var v = parseInt(store(k), 10); return isNaN(v) ? d : clamp(v, 0, 10); }
  var aud = { mv: vol('mv', store('music') === '0' ? 0 : 7), sv: vol('sv', store('sfx') === '0' ? 0 : 8), jv: vol('jv', 8) };
  var TITLE_MUSIC = { tempo: 112, root: 174.61, scale: [0, 2, 4, 7, 9], lead: 'square', drum: 'mix', seed: 21 };
  function audioInit() {
    if (AC) { if (AC.state === 'suspended') AC.resume(); return; }
    try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; return; }
    /* the mix: everything into a compressor so big moments hit hard without clipping, plus a little room reverb */
    var comp = AC.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.25;
    comp.connect(AC.destination);
    master = AC.createGain(); master.gain.value = 0.8; master.connect(comp);
    verb = AC.createConvolver(); verb.buffer = roomImpulse(1.6, 2.8);
    var verbG = AC.createGain(); verbG.gain.value = 0.2; verb.connect(verbG); verbG.connect(master);
    sfxG = AC.createGain(); sfxG.gain.value = aud.sv / 8; sfxG.connect(master); sfxG.connect(verb);
    musG = AC.createGain(); musG.gain.value = aud.mv * 0.045; musG.connect(master); musG.connect(verb);
    jayG = AC.createGain(); jayG.gain.value = aud.jv / 8; jayG.connect(master);
    crunch = AC.createWaveShaper(); crunch.curve = crunchCurve(18); crunch.connect(sfxG);
    /* the tune's lead runs through a soft echo */
    leadBus = AC.createGain(); leadBus.connect(musG);
    var dly = AC.createDelay(1), fb = AC.createGain(), wet = AC.createGain();
    dly.delayTime.value = 0.27; fb.gain.value = 0.3; wet.gain.value = 0.45;
    leadBus.connect(dly); dly.connect(fb); fb.connect(dly); dly.connect(wet); wet.connect(musG);
    noiseB = AC.createBuffer(1, AC.sampleRate, AC.sampleRate);
    var d = noiseB.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    musicEra(game.state === 'demo' ? 'title' : (game.active ? game.active.team.era : 'pre'));
  }
  function roomImpulse(sec, decay) {
    var n = Math.floor(AC.sampleRate * sec), b = AC.createBuffer(2, n, AC.sampleRate);
    for (var ch = 0; ch < 2; ch++) { var d = b.getChannelData(ch); for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay); }
    return b;
  }
  function crunchCurve(k) {
    var n = 1024, c = new Float32Array(n);
    for (var i = 0; i < n; i++) { var x = i * 2 / n - 1; c[i] = (1 + k) * x / (1 + k * Math.abs(x)); }
    return c;
  }
  /* a warm pad note: two detuned saws through a soft filter */
  function pad(f, t, dur, vol) {
    [-7, 7].forEach(function (dt) {
      var o = AC.createOscillator(), g = AC.createGain(), fl = AC.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = dt;
      fl.type = 'lowpass'; fl.frequency.value = 850; fl.Q.value = 0.5;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.35);
      g.gain.setValueAtTime(vol, t + dur - 0.35); g.gain.linearRampToValueAtTime(0.0001, t + dur);
      o.connect(fl); fl.connect(g); g.connect(musG); o.start(t); o.stop(t + dur + 0.05);
    });
  }
  function env(g, t0, a, peak, dur) {
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  }
  function tone(type, f0, f1, dur, vol, dest, when) {
    if (!AC) return;
    var t0 = when || AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t0);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    env(g, t0, 0.008, vol, dur);
    o.connect(g); g.connect(dest || sfxG); o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function noise(dur, vol, ftype, f0, f1, dest, when) {
    if (!AC) return;
    var t0 = when || AC.currentTime, s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
    s.buffer = noiseB; f.type = ftype; f.frequency.setValueAtTime(f0, t0);
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    env(g, t0, 0.005, vol, dur);
    s.connect(f); f.connect(g); g.connect(dest || sfxG); s.start(t0); s.stop(t0 + dur + 0.05);
  }
  function sfx(n, k) {
    if (!AC || !aud.sv) return;
    k = k || 1;
    switch (n) {
      case 'boom':
        /* four layers: a sub thump, a crunchy body, a sharp crack, and bits of debris pattering down */
        var t0 = AC.currentTime, kk = clamp(k, 0.4, 1.3), pv = 0.86 + Math.random() * 0.28;
        tone('sine', 95 * pv, 26, 0.55 + kk * 0.4, 0.75);
        tone('triangle', 60 * pv, 30, 0.4 + kk * 0.3, 0.35);
        noise(0.45 + kk * 0.45, 0.55, 'lowpass', 2600 * pv, 120, crunch);
        noise(0.07, 0.4, 'highpass', 2200 * pv, null);
        for (var r = 0; r < 3 + Math.round(kk * 3); r++) noise(0.025, 0.07, 'bandpass', 1500 + Math.random() * 2500, null, null, t0 + 0.18 + Math.random() * 0.55);
        break;
      case 'shoot': noise(0.2, 0.26, 'bandpass', 700, 2800); tone('square', 220, 520 + k * 300, 0.09, 0.06); tone('sine', 140, 60, 0.12, 0.25); break;
      case 'throw': noise(0.22, 0.24, 'bandpass', 500, 1700); tone('sine', 120, 70, 0.1, 0.18); break;
      case 'hit': tone('square', 240, 80, 0.14, 0.1 + 0.06 * k); noise(0.12, 0.3 + 0.2 * k, 'bandpass', 1300, 500, crunch); tone('sine', 110, 50, 0.16, 0.35); break;
      case 'ko':
        [12, 7, 4, 0, -5].forEach(function (st, i) { tone('triangle', 660 * Math.pow(2, st / 12), null, 0.16, 0.12, null, AC.currentTime + i * 0.07); });
        tone('sine', 1320, 1320, 0.9, 0.06, null, AC.currentTime + 0.4);
        break;
      case 'charge': tone('triangle', 170 + k * 560, null, 0.05, 0.035); break;
      case 'pop': tone('square', 520, 1040, 0.08, 0.08); noise(0.08, 0.2, 'bandpass', 2000, 800); break;
      case 'zap2': tone('sawtooth', 1600, 200, 0.4, 0.05); tone('sine', 400, 1600, 0.35, 0.06, null, AC.currentTime + 0.05); break;
      case 'count': tone('square', 1320, 1320, 0.05, 0.05); tone('sine', 660, 660, 0.08, 0.06); break;
      case 'win':
        [0, 4, 7, 12, 7, 12, 16].forEach(function (st, i) { tone('square', 392 * Math.pow(2, st / 12), null, i === 6 ? 0.5 : 0.13, 0.07, null, AC.currentTime + i * 0.11); });
        [0, 7].forEach(function (st) { tone('triangle', 196 * Math.pow(2, st / 12), null, 1.0, 0.1, null, AC.currentTime + 0.66); });
        break;
      case 'lose':
        [7, 4, 5, 0].forEach(function (st, i) { tone('triangle', 392 * Math.pow(2, st / 12), null, i === 3 ? 0.6 : 0.18, 0.08, null, AC.currentTime + i * 0.18); });
        break;
      case 'step': noise(0.035, 0.06, 'lowpass', 700, 300); break;
      case 'aim': tone('square', 1900, null, 0.012, 0.018); break;
      case 'turn':
        /* each squad has its own little sting: a drum and horn, a harp run, or a synth chirp */
        if (k === 1) { tone('sine', 110, 55, 0.25, 0.4); tone('sawtooth', 196, 220, 0.3, 0.05, null, AC.currentTime + 0.08); }
        else if (k === 2) { [0, 4, 7, 12].forEach(function (st, i) { tone('triangle', 523 * Math.pow(2, st / 12), null, 0.2, 0.06, null, AC.currentTime + i * 0.05); }); }
        else if (k === 3) { tone('square', 660, 1320, 0.1, 0.05); tone('square', 990, 1980, 0.1, 0.04, null, AC.currentTime + 0.1); }
        else { tone('sine', 392, 784, 0.18, 0.08); tone('triangle', 988, null, 0.22, 0.05, null, AC.currentTime + 0.12); }
        noise(0.25, 0.05, 'bandpass', 600, 3000);
        break;
      case 'bounce': tone('triangle', 420, 300, 0.06, 0.12); break;
      case 'jump': tone('square', 260, 520, 0.12, 0.05); break;
      case 'land': noise(0.08, 0.18 * k, 'lowpass', 500, 200); break;
      case 'bonk': tone('triangle', 200, 90, 0.15, 0.3); noise(0.06, 0.3, 'bandpass', 1500); break;
      case 'whoosh': noise(0.2, 0.14, 'bandpass', 400, 2000); break;
      case 'splash': noise(0.5, 0.3, 'bandpass', 1800, 500); break;
      case 'portal': tone('sine', 300, 1200, 0.6, 0.1); tone('triangle', 450, 1800, 0.6, 0.05); break;
      case 'dig': noise(0.06, 0.12, 'lowpass', 700); break;
      case 'click': tone('square', 600, 600, 0.03, 0.04); break;
      case 'jet': noise(0.1, 0.08, 'bandpass', 500, 300); break;
      case 'zap': tone('sawtooth', 1400, 300, 0.22, 0.08); tone('square', 2200, 900, 0.12, 0.04); break;
      case 'twinkle': tone('triangle', 1200, 1800, 0.12, 0.06); tone('triangle', 1600, 2400, 0.12, 0.05, null, AC.currentTime + 0.08); break;
      case 'blip': tone('square', 1046, 1046, 0.025, 0.025); break;
      case 'clunk': tone('triangle', 320, 170, 0.09, 0.14); noise(0.05, 0.08, 'lowpass', 900); break;
      case 'wipe': noise(0.4, 0.1, 'bandpass', 300, 2600); tone('sine', 220, 880, 0.4, 0.05); break;
      case 'lock': tone('square', 392, 392, 0.06, 0.06); tone('square', 784, 784, 0.1, 0.06, null, AC.currentTime + 0.07); noise(0.08, 0.1, 'lowpass', 1200, null, null, AC.currentTime + 0.07); break;
      case 'tick': tone('square', 1568, 1568, 0.015, 0.02); break;
      case 'find':
        [0, 4, 7, 12].forEach(function (s, i) { tone('triangle', 523 * Math.pow(2, s / 12), null, 0.14, 0.09, null, AC.currentTime + i * 0.09); });
        break;
    }
  }
  var XV = { dog: { base: 480, wave: 'square', wobble: 0 }, jay: { base: 150, wave: 'triangle', wobble: 0 } };
  /* Gibberish voices: lower and growly for Stone Snags, bright and buzzy for Neon Snags. */
  function voice(era, mood) {
    if (!AC || !(era === 'jay' ? aud.jv : aud.sv)) return;
    var now = AC.currentTime;
    if (now - lastVoice < 0.15) return;
    lastVoice = now;
    if (mood === 'woof') {
      for (var w = 0; w < 2; w++) {
        tone('sawtooth', 330, 150, 0.15, 0.22, null, now + w * 0.22);
        noise(0.12, 0.22, 'bandpass', 900, 350, null, now + w * 0.22);
      }
      return;
    }
    var V = XV[era] || ER[era].voice, n = 2 + Math.floor(Math.random() * 3);
    var base = V.base * (mood === 'hurt' ? 1.25 : mood === 'panic' ? 1.6 : mood === 'cheer' ? 1.15 : 1);
    var at = now;
    for (var i = 0; i < n; i++) {
      var f0 = base * rand(0.85, 1.3);
      var f1 = mood === 'hurt' ? f0 * 0.6 : mood === 'cheer' ? f0 * 1.4 : f0 * rand(0.8, 1.2);
      var d = mood === 'panic' ? 0.06 : rand(0.07, 0.12);
      var o = AC.createOscillator(), g = AC.createGain(), flt = AC.createBiquadFilter();
      o.type = V.wave; o.frequency.setValueAtTime(f0, at); o.frequency.exponentialRampToValueAtTime(f1, at + d);
      if (V.wobble) {
        var lfo = AC.createOscillator(), lg = AC.createGain();
        lfo.frequency.value = 30; lg.gain.value = V.wobble; lfo.connect(lg); lg.connect(o.frequency);
        lfo.start(at); lfo.stop(at + d + 0.05);
      }
      flt.type = 'bandpass'; flt.frequency.value = f0 * 3; flt.Q.value = 1.5;
      env(g, at, 0.01, 0.16, d);
      o.connect(flt); flt.connect(g); g.connect(era === 'jay' ? jayG : sfxG); o.start(at); o.stop(at + d + 0.05);
      at += d + 0.02;
    }
  }

  var mus = { era: '', step: 0, next: 0, timer: null, pat: null };
  /* Each tune has an A section and a B section built from short motifs, played A A B A,
     so it has a shape you can hum instead of an 8 second loop. */
  function makePattern(era) {
    var M = era === 'title' ? TITLE_MUSIC : ER[era].music, R = rng(M.seed || 3), i;
    function note(oct) { return M.scale[Math.floor(R() * M.scale.length)] + (R() < oct ? 12 : 0); }
    function motif(n, dens) { var m = []; for (var k = 0; k < n; k++) m.push(R() < dens ? note(0.25) : null); return m; }
    var m1 = motif(8, 0.6), m2 = motif(8, 0.55), m3 = motif(8, 0.65), m4 = motif(8, 0.5);
    m1[0] = M.scale[0]; m3[0] = M.scale[2 % M.scale.length] + 12;
    var cad = m2.slice(); cad[6] = M.scale[0]; cad[7] = null;
    var A = m1.concat(m2, m1, cad), B = m3.concat(m4, m3.map(function (n2) { return n2 === null ? null : n2 + (R() < 0.5 ? 0 : 2); }), cad);
    var lead = A.concat(A, B, A);
    function prog() { var p2 = [0]; for (var k = 1; k < 8; k++) p2.push(M.scale[Math.floor(R() * 3)]); return p2; }
    var bA = prog(), bB = prog(), bass = bA.concat(bA, bB, bA);
    return { lead: lead, bass: bass, M: M };
  }
  function musicEra(era) {
    if (!AC) return;
    if (mus.era !== era) { mus.era = era; mus.pat = makePattern(era); }
    if (!mus.timer) { mus.next = AC.currentTime + 0.1; mus.timer = setInterval(schedule, 40); }
  }
  function schedule() {
    if (!AC || !mus.pat) return;
    var M = mus.pat.M, spb = 60 / M.tempo / 2;
    if (mus.next < AC.currentTime) mus.next = AC.currentTime + 0.05;
    while (mus.next < AC.currentTime + 0.15) {
      var L = mus.pat.lead.length, st = mus.step % L, s = st % 32, t = mus.next, hot = game.sudden && game.state !== 'demo' && mus.era !== 'title';
      var bi = Math.floor(st / 4) % mus.pat.bass.length;
      if (aud.mv > 0) {
        var ln = mus.pat.lead[st];
        if (ln !== null) tone(M.lead, M.root * Math.pow(2, (ln + (hot ? 12 : 0)) / 12) * 2, null, spb * 0.9, hot ? 0.06 : 0.07, leadBus || musG, t);
        if (st % 16 === 0) { var pr = M.root * Math.pow(2, mus.pat.bass[bi] / 12); pad(pr, t, spb * 16, 0.028); pad(pr * 1.5, t, spb * 16, 0.02); }
        if (st % 4 === 0) tone('triangle', M.root * Math.pow(2, mus.pat.bass[bi] / 12) / 2, null, spb * 3, 0.16, musG, t);
        /* a drum fill to round off each section, and extra drive in sudden death */
        if (st % 32 >= 28) noise(0.05, 0.05 + (st % 32 - 28) * 0.015, 'bandpass', 2400 + (st % 4) * 400, null, musG, t);
        if (hot) { noise(0.02, 0.035, 'highpass', 7000, null, musG, t); if (s % 4 === 2) tone('sine', 110, 50, 0.14, 0.22, musG, t); }
        if (M.drum === 'tom') {
          if (s % 4 === 0 || s % 8 === 6) tone('sine', 120, 55, 0.18, 0.3, musG, t);
          if (s % 8 === 4) noise(0.06, 0.08, 'bandpass', 2500, null, musG, t);
        } else if (M.drum === 'mix') {
          if (s % 8 === 0) tone('sine', 120, 55, 0.18, 0.3, musG, t);
          if (s % 8 === 4) tone('sine', 150, 68, 0.16, 0.26, musG, t);
          if (s % 8 === 3 || s % 8 === 6) noise(0.04, 0.06, 'bandpass', 3200, null, musG, t);
          if (s % 2 === 1) noise(0.02, 0.03, 'highpass', 6000, null, musG, t);
        } else if (M.drum === 'doumbek') {
          var b8 = s % 8;
          if (b8 === 0 || b8 === 5) tone('sine', 150, 68, 0.2, 0.32, musG, t);
          if (b8 === 3 || b8 === 6 || b8 === 7) noise(0.04, b8 === 7 ? 0.04 : 0.07, 'bandpass', 3200, null, musG, t);
        } else {
          if (s % 4 === 0) tone('sine', 140, 45, 0.16, 0.35, musG, t);
          if (s % 2 === 1) noise(0.03, 0.05, 'highpass', 6000, null, musG, t);
        }
      }
      mus.next += spb; mus.step++;
    }
  }
  /* the music dips under big bangs, then swells back */
  function duck(depth, back) {
    if (!musG || !AC) return;
    var base = aud.mv * 0.045, now = AC.currentTime;
    musG.gain.cancelScheduledValues(now);
    musG.gain.setValueAtTime(base * depth, now);
    musG.gain.linearRampToValueAtTime(base, now + back);
  }
  /* every weapon sounds like itself as it leaves and as it lands */
  function weaponSound(wid, era, phase, k) {
    if (!AC || !aud.sv) return;
    k = k || 1;
    var now = AC.currentTime;
    if (phase === 'launch') {
      if (wid === 'lob') {
        if (era === 'fut') { tone('sawtooth', 900, 240, 0.16, 0.07); tone('square', 1800, 600, 0.08, 0.03); }
        else if (era === 'egypt') { noise(0.18, 0.2, 'bandpass', 500, 1400); tone('triangle', 330, 180, 0.12, 0.08); }
        else { noise(0.08, 0.18, 'bandpass', 1400, 400); noise(0.22, 0.2, 'bandpass', 600, 1800, null, now + 0.04); tone('sine', 140, 60, 0.12, 0.25); }
      } else if (wid === 'bomb') { noise(0.2, 0.2, 'bandpass', 500, 1500); tone('square', 520, 520, 0.03, 0.03, null, now + 0.05); tone('square', 520, 520, 0.03, 0.03, null, now + 0.15); }
      else if (wid === 'boulder') { tone('sine', 80, 50, 0.4, 0.4); noise(0.35, 0.22, 'lowpass', 400, 150, crunch); }
      else if (wid === 'gourd') { tone('triangle', 200, 140, 0.12, 0.12); noise(0.08, 0.1, 'lowpass', 800); }
      else if (wid === 'disc') { tone('sine', 1200, 2400, 0.18, 0.06); tone('triangle', 600, 1200, 0.18, 0.05); }
      else if (wid === 'spear') { noise(0.22, 0.28, 'bandpass', 2400, 700); tone('triangle', 900, 300, 0.2, 0.05); }
      else if (wid === 'scarab') { for (var i = 0; i < 4; i++) noise(0.02, 0.08, 'bandpass', 3000 + i * 300, null, null, now + i * 0.04); tone('sine', 300, 200, 0.12, 0.1); }
      else { noise(0.18, 0.22, 'bandpass', 700, 2600); tone('sine', 140, 60, 0.12, 0.25); }
    } else {
      if (wid === 'boulder') { tone('sine', 70, 30, 0.6, 0.6); noise(0.5, 0.3, 'lowpass', 600, 100, crunch); }
      else if (wid === 'spear') { tone('square', 160, 90, 0.1, 0.18); noise(0.06, 0.3, 'bandpass', 900, 300); }
      else if (wid === 'disc') { tone('sine', 2400, 1900, 0.35, 0.07); tone('triangle', 3600, null, 0.25, 0.03, null, now + 0.05); }
      else if (wid === 'scarab') { for (var j = 0; j < 6; j++) noise(0.02, 0.07, 'bandpass', 2500 + Math.random() * 2000, null, null, now + 0.05 + j * 0.035); }
      else if (wid === 'gourd' || wid === 'mega') { tone('sine', 60, 22, 1.0, 0.7); noise(0.9, 0.3, 'lowpass', 800, 80, crunch); }
      else if (wid === 'meteor') { tone('sawtooth', 300, 80, 0.3, 0.06); }
    }
  }
  function applyAudio() {
    store('mv', String(aud.mv)); store('sv', String(aud.sv)); store('jv', String(aud.jv));
    if (musG) musG.gain.value = aud.mv * 0.045;
    if (sfxG) sfxG.gain.value = aud.sv / 8;
    if (jayG) jayG.gain.value = aud.jv / 8;
  }

  /* ---------------- saving ---------------- */
  function rle() {
    var out = [], cur = 0, run = 0;
    for (var i = 0; i < mask.length; i++) {
      if (mask[i] === cur) run++;
      else { out.push(run); cur = mask[i]; run = 1; }
    }
    out.push(run);
    return out.join(',');
  }
  function unrle(s) {
    var parts = s.split(','), i = 0, cur = 0;
    for (var p = 0; p < parts.length; p++) {
      var n = +parts[p];
      for (var k = 0; k < n && i < mask.length; k++, i++) {
        if (!cur && mask[i]) { mask[i] = 0; data[i * 4 + 3] = 0; }
        else if (cur && !mask[i]) { mask[i] = 1; setPx(i, hash(i % WW, (i / WW) | 0) < 0.5 ? MAP.pal.rock : MAP.pal.rockL); }
      }
      cur = 1 - cur;
    }
    tctx.putImageData(img, 0, 0);
    miniDirty = true;
  }
  function saveMatch() {
    if (TEST) return;
    var s = {
      v: 1, seed: game.seed, opts: game.opts, tIdx: game.tIdx, turnNo: game.turnNo, stats: game.stats, mask: rle(),
      finds: game.finds, water: WATER, sudden: game.sudden,
      arts: game.arts.filter(function (a) { return a.st === 'buried' || a.st === 'loose'; }).map(function (a) { return { id: a.id, g: a.glitch, x: Math.round(a.x), y: Math.round(a.y), st: a.st }; }),
      crates: game.crates.map(function (c) { return { x: Math.round(c.x), y: Math.round(c.y), k: c.kind }; }),
      barrels: game.barrels.map(function (b) { return { x: Math.round(b.x), y: Math.round(b.y), k: b.kind }; }),
      teams: game.teams.map(function (t, ti) {
        return {
          era: t.era, name: t.name, ctrl: t.ctrl, mood: t.mood, label: t.label, lastWeapon: t.lastWeapon, bark: t.bark || 0, ammo: t.ammo || {}, bonus: !!t.bonus, skin: t.skin || null,
          idx: ti === game.tIdx ? t.idx - 1 : t.idx,
          members: t.members.map(function (c) { return { n: c.name, x: Math.round(c.x), y: Math.round(c.y), hp: c.hp, f: c.face, a: Math.round(c.aim), al: c.alive, sh: !!c.shield, d: c.dealt || 0, b: c.best || 0, fd: c.found || 0 }; })
        };
      })
    };
    try { s.img = terr.toDataURL('image/webp', 1); } catch (e) { s.img = ''; }
    try { localStorage.setItem(KEY + 'save', JSON.stringify(s)); }
    catch (e) { delete s.img; store('save', JSON.stringify(s)); }
  }
  function loadMatch() {
    var raw = store('save'), s;
    if (!raw) return false;
    try { s = JSON.parse(raw); } catch (e) { return false; }
    if (!s || s.v !== 1 || !s.teams) return false;
    resetWorld();
    game.opts = s.opts; game.seed = s.seed; game.turnLen = s.opts.turn;
    game.tour = s.opts.tour ? loadTourState() : null;
    setMap(s.opts.map || 'jungle', s.opts.look);
    genTerrain(s.seed); unrle(s.mask);
    if (s.img && s.img.indexOf('data:image') === 0) {
      var im = new Image();
      im.onload = function () { tctx.clearRect(0, 0, WW, WH); tctx.drawImage(im, 0, 0); img = tctx.getImageData(0, 0, WW, WH); data = img.data; miniDirty = true; };
      im.src = s.img;
    }
    s.teams.forEach(function (st) {
      var t = { era: st.era, name: st.name, ctrl: st.ctrl, mood: st.mood, label: st.label, lastWeapon: st.lastWeapon, idx: st.idx, bark: st.bark || 0, ammo: st.ammo || {}, bonus: !!st.bonus, skin: st.skin || null, members: [] };
      st.members.forEach(function (m) {
        var c = makeSnag(t, m.n, m.x, m.y);
        c.hp = m.hp; c.face = m.f; c.aim = m.a; c.alive = m.al; c.shield = !!m.sh; c.dealt = m.d || 0; c.best = m.b || 0; c.found = m.fd || 0;
        t.members.push(c); game.snags.push(c);
      });
      game.teams.push(t);
    });
    game.tIdx = s.tIdx; game.turnNo = s.turnNo - 1; game.stats = s.stats || game.stats;
    game.finds = s.finds || [];
    WATER = s.water || 432; game.sudden = !!s.sudden; miniDirty = true;
    game.arts = (s.arts || []).map(function (a) { return { id: a.id, glitch: !!a.g, x: a.x, y: a.y, st: a.st, vx: 0, vy: 0, rest: false, glint: Math.floor(Math.random() * 240) }; });
    game.crates = (s.crates || []).map(function (c) { return { x: c.x, y: c.y, vx: 0, vy: 0, rest: false, kind: c.k }; });
    game.barrels = (s.barrels || []).map(function (b) { return { x: b.x, y: b.y, vx: 0, vy: 0, rest: false, kind: b.k, fuse: 0, by: null }; });
    hideOv(); inMatch(true);
    startTurn();
    return true;
  }

  /* ---------------- matches ---------------- */
  function later(ticks, fn) { game.later.push({ t: game.t + ticks, fn: fn }); }
  function runLater() {
    for (var i = game.later.length - 1; i >= 0; i--) if (game.t >= game.later[i].t) { var f = game.later[i].fn; game.later.splice(i, 1); f(); }
  }
  function resetWorld() {
    game.later = [];
    game.projs = []; game.parts = []; game.portals = []; game.snags = []; game.teams = [];
    game.stats = { best: 0, bestBy: '', shots: 0 }; game.turnNo = 0; game.winner = null; game.active = null;
    game.ai = null; game.charging = false; game.power = 0; game.lastPower = 0;
    game.arts = []; game.crates = []; game.courier = null; game.barker = null; game.finds = [];
    game.strikes = []; game.warn = []; game.sudden = false; game.tx = null; game.hitstop = 0; game.barrels = []; WATER = 432;
  }

  function surfaceAt(x) {
    for (var y = 4; y < WATER - 20; y++) if (solid(x, y)) return bodyClear(x, y) ? y : -1;
    return -1;
  }

  function spawnAll(n) {
    var spots = [], x;
    for (x = 60; x < WW - 60; x += 6) { var y = surfaceAt(x); if (y > 30 && y < WATER - 30) spots.push([x, y]); }
    shuffle(spots);
    var picked = [], gap = 70;
    while (picked.length < n * 2 && gap > 5) {
      for (var i = 0; i < spots.length && picked.length < n * 2; i++) {
        var s = spots[i];
        if (picked.indexOf(s) >= 0) continue;
        var ok = true;
        for (var j = 0; j < picked.length; j++) if (Math.abs(picked[j][0] - s[0]) <= gap && Math.abs(picked[j][1] - s[1]) <= 40) { ok = false; break; }
        if (ok) picked.push(s);
      }
      gap -= 15;
    }
    shuffle(picked);
    var names = game.teams.map(function (t) {
      var pool = shuffle(ER[t.era].names.slice()), mine = [];
      var custom = t.ctrl === 'human' && game.opts && game.opts.names ? (game.opts.names[t.era] || []) : [];
      for (var k = 0; k < n; k++) {
        var nm = cleanName(custom[k] || '');
        if (!nm || mine.indexOf(nm) >= 0) { do { nm = pool.length ? pool.pop() : genName(t.era); } while (mine.indexOf(nm) >= 0); }
        mine.push(nm);
      }
      return mine;
    });
    picked.forEach(function (s, i) {
      var team = game.teams[i % game.teams.length];
      var c = makeSnag(team, names[i % game.teams.length][Math.floor(i / game.teams.length)], s[0], s[1]);
      team.members.push(c); game.snags.push(c);
    });
  }

  function newMatch(o) {
    resetWorld();
    game.opts = o; game.turnLen = o.turn;
    o.map = o.map || 'jungle';
    setMap(o.map, o.look);
    game.seed = Math.floor(Math.random() * 1e9);
    genTerrain(game.seed);
    var eras = [o.era, foeOf(o)];
    for (var i = 0; i < 2; i++) {
      var E = ER[eras[i]], ai = (o.mode === 'cpu' && i === 1) || TEST === 'aivai';
      game.teams.push({
        era: eras[i], name: E.team, ctrl: ai ? 'ai' : 'human', mood: o.mood, idx: -1, members: [], lastWeapon: 'lob', bark: 0, ammo: {}, skin: ai ? null : (i === 0 ? o.skinA : o.skinB) || null,
        label: o.mode === 'friend' ? 'Player ' + (i + 1) : (ai ? 'Computer' : 'You')
      });
    }
    spawnAll(o.size);
    placeBarrels();
    if (o.ammoMods) game.teams.forEach(function (t) {
      var mods = o.ammoMods[t.era] || {};
      for (var wid in mods) if (WEAP[wid] && WEAP[wid].ammo) t.ammo[wid] = Math.max(0, WEAP[wid].ammo + mods[wid]);
    });
    buryArts();
    game.tIdx = o.mode === 'friend' ? (Math.random() < 0.5 ? 0 : 1) : 0;
    hideOv(); inMatch(true);
    startTurn();
  }

  function startDemo(mapId) {
    resetWorld();
    game.state = 'demo';
    var mid = mapId || MAP_IDS[Math.floor(Math.random() * MAP_IDS.length)], home = MAPS[mid].era;
    setMap(mid);
    game.seed = Math.floor(Math.random() * 1e9);
    genTerrain(game.seed);
    var others = READY.filter(function (e) { return e !== home; });
    game.teams = [home, others[Math.floor(Math.random() * others.length)]].map(function (e) {
      return { era: e, name: ER[e].team, ctrl: 'none', idx: -1, members: [], label: '' };
    });
    spawnAll(3);
    placeBarrels();
    game.snags.forEach(function (c, i) { c.arrive = 50 + i * 38; });
  }

  function demoTick() {
    game.snags.forEach(function (c) {
      if (!c.arrive) return;
      c.arrive--;
      if (c.arrive === 24) { game.portals.push({ x: c.x, y: c.y - 26, t: 0, inn: true }); sfx('portal'); }
      if (c.arrive === 0) { c.y -= 14; c.st = 'air'; c.vy = 0.5; c.knock = false; }
    });
    /* now and then something that should not be here tumbles out of a portal */
    if (game.t % 700 === 350 && game.arts.length < 4) {
      var gx = 120 + Math.random() * (WW - 240), gy = surfaceY(gx);
      if (gy > 60) {
        var pool = glitchOf(MAP.id), gi = pool[Math.floor(Math.random() * pool.length)];
        game.portals.push({ x: gx, y: gy - 60, t: 0, inn: true });
        game.arts.push({ id: gi.id, glitch: true, x: gx, y: gy - 60, st: 'loose', vx: rand(-0.6, 0.6), vy: -1, rest: false, glint: 0 });
        game.look = { x: gx, y: gy - 40 }; game.lookT = 160;
      }
    }
    if (game.t % 1100 === 800) maybeDeliver(true);
    if (game.t % 150 !== 0 || !game.snags.length) return;
    var c = game.snags[Math.floor(Math.random() * game.snags.length)];
    if (!c.alive || c.arrive || c.st !== 'ground') return;
    var r = Math.random();
    if (r < 0.4) jump(c, Math.random() < 0.35);
    else if (r < 0.7) c.cheerT = 50;
    else c.face = -c.face;
  }

  /* ---------------- main update ---------------- */
  function update() {
    if (game.hitstop > 0) { game.hitstop--; return; }
    game.t++;
    if (game.slow > 0) game.slow--;
    if (game.later.length) runLater();
    if (game.charging && game.t % 4 === 0) sfx('charge', game.power / 100);
    var i;
    if (game.bannerT > 0 && --game.bannerT === 0) $('banner').classList.remove('show');
    if (passArmed > 0 && --passArmed === 0) setPassArm(false);
    for (i = 0; i < game.snags.length; i++) updSnag(game.snags[i]);
    if (game.state === 'play' || game.state === 'retreat') control();
    for (i = game.projs.length - 1; i >= 0; i--) {
      var p = game.projs[i];
      if (!p) continue;
      var ev = stepProj(p, false);
      if (!p.rest && p.age % 4 === 0 && (p.type === 'lob' || p.type === 'bomb' || p.type === 'boulder' || p.type === 'scarab')) addPart({ k: 'puff', x: p.x, y: p.y, life: 16, max: 16, r: 1.5 });
      if (p.trail && !p.rest) { p.trail.push([p.x, p.y]); if (p.trail.length > 10) p.trail.shift(); }
      if (ev) {
        game.projs.splice(i, 1);
        if (ev === 'explode') { explode(p.x, p.y, WEAP[p.type].R, WEAP[p.type].dmg, p); if (WEAP[p.type].direct && p.hitSnag) spearHit(p); }
        else if (ev === 'water') { splash(p.x); say('miss'); }
      } else if (WEAP[p.type].crawl) crawlScarab(p);
    }
    updArts(); updCrates(); updBarrels(); updCourier(); updBarker(); updBirds(); updStrikes(); updWarn(); jayTick();
    updParts();
    for (i = game.portals.length - 1; i >= 0; i--) {
      var pt = game.portals[i];
      if (++pt.t === 22 && pt.ko) koBurst(pt);
      if (pt.t > (pt.ko ? 84 : 70)) game.portals.splice(i, 1);
    }
    if (game.state === 'play') {
      if (game.turnLen > 0 && game.active && game.active.team.ctrl === 'human' && game.timer <= 300 && game.timer % 60 === 0 && game.timer > 0) sfx('count');
      if (game.turnLen > 0 && --game.timer <= 0) { banner("Time's up", null, '#ffc24a', 'hourglass'); endTurn(); }
    } else if (game.state === 'retreat') {
      if (game.swingT <= 0 && game.digT <= 0 && !game.barker && !game.strikes.length && --game.retreat <= 0) endTurn();
    } else if (game.state === 'settle') settle();
    else if (game.state === 'portals') { if (--game.portT <= 0) afterSettle(); }
    else if (game.state === 'demo') demoTick();
    if (game.shake > 0) game.shake *= 0.88;
    camUpdate();
  }

  function updParts() {
    for (var i = game.parts.length - 1; i >= 0; i--) {
      var p = game.parts[i];
      if (p.delay > 0) { p.delay--; continue; }
      p.life--;
      if (p.k === 'deb' || p.k === 'drop') {
        if (!p.stuck) {
          p.vy += G; p.x += p.vx; p.y += p.vy;
          if (p.k === 'deb' && solid(p.x, p.y)) {
            if (!p.b && p.vy > 1) { p.b = 1; p.y -= p.vy; p.vy *= -0.35; p.vx *= 0.5; }
            else { p.stuck = true; p.life = Math.min(p.life, 40); }
          }
          if (p.k === 'drop' && p.y > WATER + 2 && p.vy > 0) p.life = 0;
        }
      } else if (p.k === 'spark') { p.vy += 0.08; p.x += p.vx; p.y += p.vy; p.vx *= 0.97; }
      else if (p.k === 'ember') { p.vy += 0.1; p.x += p.vx; p.y += p.vy; p.vx *= 0.96; if (solid(p.x, p.y)) p.life = Math.min(p.life, 6); }
      else if (p.k === 'dust' || p.k === 'puff') { p.x += (p.vx || 0) + game.wind * 0.01; p.y += (p.vy || -0.15); p.r += 0.04; }
      else if (p.k === 'smoke') { p.x += p.vx + game.wind * 0.03; p.y += p.vy; p.vy *= 0.995; p.r += 0.06; }
      else if (p.k === 'txt') { p.y += p.vy; p.x += p.vx || 0; p.vy *= 0.97; }
      if (p.life <= 0) game.parts.splice(i, 1);
    }
  }

  function camUpdate() {
    var tx, ty, c = game.active, i;
    /* looking around with the mouse, until something happens */
    if (freeCam && (game.projs.length || game.barker || game.strikes.length || game.warn.length || game.state === 'over')) freeCam = null;
    if (freeCam) { clampFree(); tx = freeCam.x; ty = freeCam.y; }
    else if (game.lookT > 0 && game.look) { tx = game.look.x; ty = game.look.y; game.lookT--; }
    else if (game.projs.length) { var pj = game.projs[0]; tx = pj.x + clamp(pj.vx * 14, -90, 90); ty = pj.y + clamp(pj.vy * 8, -40, 50); }
    else if (game.barker) { tx = game.barker.x; ty = game.barker.y - 20; }
    else if (game.strikes.length) {
      var sk = game.strikes[0], sfy = surfaceY(sk.x);
      tx = sk.x; ty = (sfy < 0 ? WATER : sfy) - 50;
    }
    else if (game.warn.length) { tx = game.warn[0].x; ty = surfaceY(game.warn[0].x) - 40; }
    else {
      var mover = null;
      if (game.state === 'settle' || game.state === 'retreat') {
        for (i = 0; i < game.snags.length; i++) { var s = game.snags[i]; if (s.alive && s.st === 'air' && s.knock) { mover = s; break; } }
      }
      if (mover) { tx = mover.x; ty = mover.y - 10; }
      else if (game.portals.length) { tx = game.portals[0].x; ty = game.portals[0].y; }
      else if (c) { tx = c.x; ty = c.y - 14; }
      else if (game.state === 'over' && game.winner) {
        var w = game.winner.members.filter(function (m) { return m.alive; })[0];
        tx = w ? w.x : WW / 2; ty = w ? w.y - 20 : WH - 140;
      } else { tx = WW / 2 + Math.sin(game.t / 600) * 300; ty = 230; }
    }
    var gx = tx - VW / 2, gy = ty - VH / 2;
    gx = VW >= WW ? (WW - VW) / 2 : clamp(gx, 0, WW - VW);
    gy = VH >= WH ? WH - VH : clamp(gy, -140, WH - VH);
    var k = panning ? 1 : (freeCam ? 0.25 : (game.state === 'demo' ? 0.03 : 0.09));
    cam.x += (gx - cam.x) * k; cam.y += (gy - cam.y) * k;
  }

  /* ---------------- drawing ---------------- */
  var skyCv = document.createElement('canvas');
  function skyCols() {
    if (LOOK === 'overgrown' && MAP.skyGreen) return MAP.skyGreen;
    if (LOOK === 'sandy' && MAP.skySandy) return MAP.skySandy;
    if (LOOK === 'neon' && MAP.skyNeon) return MAP.skyNeon;
    return MAP.sky;
  }
  function buildSky() {
    skyCv.width = VW; skyCv.height = VH;
    var s = skyCv.getContext('2d'), cols = skyCols(), n = cols.length, i, x;
    for (i = 0; i < n; i++) { s.fillStyle = cols[i]; s.fillRect(0, Math.floor(i * VH / n), VW, Math.ceil(VH / n) + 1); }
    for (i = 1; i < n; i++) {
      var y = Math.floor(i * VH / n);
      s.fillStyle = cols[i];
      for (x = 0; x < VW; x += 2) s.fillRect(x + (i % 2), y - 1, 1, 1);
      s.fillStyle = cols[i - 1];
      for (x = 1; x < VW; x += 2) s.fillRect(x - (i % 2), y, 1, 1);
    }
  }

  function disc(cx, cy, r, col) {
    ctx.fillStyle = col;
    cx = Math.round(cx); cy = Math.round(cy); r = Math.max(0, Math.round(r));
    for (var dy = -r; dy <= r; dy++) { var w = Math.floor(Math.sqrt(r * r - dy * dy)); ctx.fillRect(cx - w, cy + dy, 2 * w + 1, 1); }
  }

  function farH(u) {
    var cell = 420, c = Math.floor(u / cell), lx = u - c * cell - cell / 2;
    var ph = 70 + hash(c, 7) * 40, cone = ph - Math.abs(lx) * 0.55 - (Math.abs(lx) < 7 ? 4 : 0);
    return Math.max(16 + 6 * Math.sin(u * 0.01), cone);
  }
  function midH(u) {
    var m = ((u % 26) + 26) % 26 - 13;
    return 44 + 10 * Math.sin(u * 0.012) + 9 * Math.sqrt(Math.max(0, 1 - m * m / 169));
  }

  /* Future City backdrop: three skyline layers drawn once, then slid for parallax */
  var cityBg = null;
  function makeLayer(f, k, col, kind) {
    var W = Math.ceil(VW + WW * f + 40), H = VH + 100, c = document.createElement('canvas');
    c.width = W; c.height = H;
    var g2 = c.getContext('2d'), base = Math.round(VH * k), wild = LOOK === 'overgrown', sandy = LOOK === 'sandy';
    var cell = kind === 1 ? 30 : (kind === 2 ? 46 : 70);
    for (var u = 0; u < W; u++) {
      var ci = Math.floor(u / cell), lx = u - ci * cell, bw = Math.floor(cell * (0.55 + hash(ci, kind) * 0.35));
      var bh = (kind === 1 ? 50 : (kind === 2 ? 70 : 34)) + Math.floor(hash(ci, kind + 9) * (kind === 3 ? 30 : 90));
      var top = lx < bw ? base - bh : base - 6 - Math.floor(hash(ci, 4) * 6);
      if (sandy && lx < bw && hash(ci, 31) < 0.6) top += Math.round(Math.max(0, Math.abs(lx - bw / 2) * 1.6 - 2));
      g2.fillStyle = col; g2.fillRect(u, top, 1, H - top);
      if (lx < bw && kind < 3) {
        for (var yy = top + 4; yy < base + 30; yy += 5) {
          if (lx % 4 === 1 && yy > top + 2 && hash(ci * 31 + lx, yy) < (wild ? 0.12 : 0.4)) { g2.fillStyle = sandy ? (hash(ci, yy) < 0.7 ? '#e0b060' : '#c9a24a') : (hash(ci, yy) < 0.7 ? (kind === 1 ? '#8a7a5e' : '#b89a5e') : (kind === 1 ? '#4f7f96' : '#5fa8c0')); g2.fillRect(u, yy, 1, 2); }
        }
        if (lx === Math.floor(bw / 2) && hash(ci, 77) < 0.5) { g2.fillStyle = col; g2.fillRect(u, top - 8, 1, 8); g2.fillStyle = '#ff6b9a'; g2.fillRect(u, top - 9, 1, 1); }
      }
      if (wild && lx < bw && hash(ci, lx) < 0.25) { g2.fillStyle = '#3f7a2e'; g2.fillRect(u, top, 1, 3 + Math.floor(hash(lx, ci) * 18)); }
    }
    return { c: c, f: f };
  }
  function buildCityBg() {
    bakedBg = null;
    if (MAP.style !== 'city') { cityBg = null; return; }
    var wild = LOOK === 'overgrown', sandy = LOOK === 'sandy';
    cityBg = [
      makeLayer(0.15, 0.62, wild ? '#2f4a44' : (sandy ? MAP.farSandy : MAP.far), 1),
      makeLayer(0.35, 0.76, wild ? '#25403a' : (sandy ? MAP.midSandy : MAP.mid), 2),
      makeLayer(0.6, 0.9, wild ? '#1c332e' : (sandy ? MAP.nearSandy : MAP.near), 3)
    ];
  }
  function drawCityBackdrop(cx, cy, t) {
    var rest = WH - VH, s;
    for (s = 0; s < 40; s++) {
      if ((s + (t >> 6)) % 9 === 0) continue;
      ctx.fillStyle = '#e9e4ff'; ctx.fillRect(Math.floor(hash(s, 3) * VW), Math.floor(hash(s, 5) * VH * 0.35), 1, 1);
    }
    var sunX = Math.round(VW * 0.7 - cx * 0.03), sunY = Math.round(VH * 0.5 - (cy - rest) * 0.05);
    disc(sunX, sunY, 18, MAP.sun);
    ctx.fillStyle = skyCols()[4];
    [5, 9, 12, 15].forEach(function (dy, k) { ctx.fillRect(sunX - 19, sunY + dy, 39, 1 + (k >> 1)); });
    if (cityBg) cityBg.forEach(function (L, li) {
      ctx.drawImage(L.c, -Math.round(cx * L.f), Math.round(-(cy - rest) * L.f));
      /* haze between layers pushes the skyline back so the battlefield stands out */
      ctx.fillStyle = LOOK === 'neon' || LOOK === 'normal' ? 'rgba(46,40,96,0.22)' : 'rgba(40,52,60,0.18)'; ctx.fillRect(0, 0, VW, VH);
    });
    game.cars.forEach(function (c) {
      var X = Math.round(c.x), Y = Math.round(c.y - (cy - rest) * 0.3);
      ctx.fillStyle = '#14162e'; ctx.fillRect(X - 2, Y, 5, 2);
      ctx.fillStyle = c.vx > 0 ? '#ffd27a' : '#ff6b9a'; ctx.fillRect(c.vx > 0 ? X + 3 : X - 3, Y, 1, 1);
    });
    game.birds.forEach(function (b) { SP.bird(ctx, b.x, b.y - (cy - rest) * 0.08, ((game.t + b.ph) >> 3) % 2); });
  }

  /* Pyramid Desert and Prehistoric Jungle backdrops: each parallax layer is painted once, then slid */
  var bakedBg = null;
  function bake(f, paint) {
    var W = Math.ceil(VW + WW * f + 40), c = document.createElement('canvas');
    c.width = W; c.height = VH;
    paint(c.getContext('2d'), W);
    return { c: c, f: f };
  }
  function buildBaked() {
    bakedBg = null;
    var neon = LOOK === 'neon';
    if (MAP.style === 'desert') {
      bakedBg = [
        bake(0.12, function (g2, W) {
          var base = VH * 0.64;
          for (var u = 0; u < W; u++) {
            var cell = Math.floor(u / 230), lx = u - cell * 230 - 115, size = 26 + hash(cell, 5) * 40, ground = base - 4 - 3 * Math.sin(u * 0.01);
            var peak = hash(cell, 9) < 0.8 ? size - Math.abs(lx) : -1, top = Math.round(peak > 0 ? Math.min(ground, base - peak) : ground);
            g2.fillStyle = neon ? '#3a3e6e' : MAP.far; g2.fillRect(u, top, 1, VH - top);
            if (peak > 0 && base - peak < ground) {
              if (lx > 0) { g2.fillStyle = neon ? '#2c2f57' : MAP.farShade; g2.fillRect(u, top, 1, Math.round(ground - top)); }
              if (neon) { g2.fillStyle = lx > 0 ? '#ff78be' : '#5fe0f0'; g2.fillRect(u, top, 1, 1); }
            }
          }
        }),
        bake(0.32, function (g2, W) {
          var base = VH * 0.76;
          for (var u = 0; u < W; u++) {
            var hh = 16 + 10 * Math.sin(u * 0.013) + 6 * Math.sin(u * 0.031 + 1.3), slope = Math.cos(u * 0.013) * 0.13 + Math.cos(u * 0.031 + 1.3) * 0.186, top = Math.round(base - hh);
            g2.fillStyle = neon ? '#2c2f57' : (slope < 0 ? MAP.midShade : MAP.mid); g2.fillRect(u, top, 1, VH - top);
            if (!neon) { g2.fillStyle = '#ecc98e'; g2.fillRect(u, top, 1, 1); }
          }
        }),
        bake(0.55, function (g2, W) {
          var base = VH * 0.92, u;
          g2.fillStyle = neon ? '#1f2142' : MAP.bank;
          for (u = 0; u < W; u++) { var top = Math.round(base - 9 - 2 * Math.sin(u * 0.05)); g2.fillRect(u, top, 1, VH - top); }
          for (var c = -1; c <= Math.ceil(W / 58) + 1; c++) {
            if (hash(c, 3) > 0.62) continue;
            var pu = c * 58 + 29 + Math.round((hash(c, 6) - 0.5) * 20), gr = Math.round(base - 9 - 2 * Math.sin(pu * 0.05)), ph = 28 + Math.round(hash(c, 4) * 16), lean = (hash(c, 8) - 0.5) * 0.5;
            g2.fillStyle = neon ? '#14162e' : MAP.nearTrunk;
            for (var k = 0; k < ph; k++) g2.fillRect(Math.round(pu + lean * k + Math.sin(k * 0.08) * 1.5), gr - k, 2, 1);
            var tx2 = Math.round(pu + lean * ph + Math.sin(ph * 0.08) * 1.5), ty2 = gr - ph;
            g2.fillStyle = neon ? '#14162e' : MAP.near;
            [-2.7, -2.2, -1.75, -1.3, -0.8, -0.35].forEach(function (an) {
              for (var j = 0; j < 13; j++) g2.fillRect(Math.round(tx2 + Math.cos(an) * j), Math.round(ty2 + Math.sin(an) * j * 0.7 + j * j * 0.045), 2, 1);
            });
            if (!neon) { g2.fillStyle = '#8a5a2a'; g2.fillRect(tx2 - 1, ty2 + 1, 2, 2); g2.fillRect(tx2 + 1, ty2 + 2, 1, 2); }
          }
        })
      ];
    } else if (MAP.style !== 'city') {
      bakedBg = [
        bake(0.15, function (g2, W) {
          var base = VH * 0.62; g2.fillStyle = MAP.far;
          for (var u = 0; u < W; u++) { var top = Math.round(base - farH(u)); g2.fillRect(u, top, 1, VH - top); }
        }),
        bake(0.35, function (g2, W) {
          var base = VH * 0.74; g2.fillStyle = MAP.mid;
          for (var u = 0; u < W; u++) { var top = Math.round(base - midH(u)); g2.fillRect(u, top, 1, VH - top); }
        }),
        bake(0.6, function (g2, W) {
          var base = VH * 0.9;
          for (var u = 0; u < W; u++) {
            var cell = Math.floor(u / 64), n2 = u - cell * 64 - 32, ground = Math.round(base - (16 + 6 * Math.sin(u * 0.02)));
            g2.fillStyle = MAP.near; g2.fillRect(u, ground, 1, VH - ground);
            var crownY = Math.round(base - 62 - hash(cell, 3) * 26);
            if (Math.abs(n2) < 20) { var half = Math.round(Math.sqrt(400 - n2 * n2) * 0.75); g2.fillRect(u, crownY - half, 1, half * 2); }
            if (Math.abs(n2) < 2) { g2.fillStyle = MAP.nearTrunk; g2.fillRect(u, crownY + 6, 1, ground - crownY - 6); }
          }
        })
      ];
    }
  }
  function blit(L, cx, cy) { var rest = WH - VH; ctx.drawImage(L.c, -Math.round(cx * L.f), -Math.round((cy - rest) * L.f)); }
  function drawDesertBackdrop(cx, cy, t) {
    var rest = WH - VH, i, neon = LOOK === 'neon';
    if (neon) for (i = 0; i < 40; i++) {
      if ((i + (t >> 6)) % 9 === 0) continue;
      ctx.fillStyle = '#e9e4ff'; ctx.fillRect(Math.floor(hash(i, 3) * VW), Math.floor(hash(i, 5) * VH * 0.35), 1, 1);
    }
    var sunX = Math.round(VW * 0.74 - cx * 0.03), sunY = Math.round(VH * (neon ? 0.45 : 0.15) - (cy - rest) * 0.05);
    disc(sunX, sunY, 19, neon ? '#ffd9a8' : '#fffbe6'); disc(sunX, sunY, 16, MAP.sun);
    if (!neon) for (i = 0; i < 3; i++) {
      var hx2 = (((i * 331 + t * 0.03 - cx * 0.05) % (VW + 200)) + VW + 200) % (VW + 200) - 100, hy2 = 26 + i * 16 - (cy - rest) * 0.08;
      ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(Math.round(hx2), Math.round(hy2), 40 + i * 8, 2); ctx.fillRect(Math.round(hx2) + 8, Math.round(hy2) - 2, 22, 2);
    }
    game.birds.forEach(function (b) { SP.bird(ctx, b.x, b.y - (cy - rest) * 0.08, ((game.t + b.ph) >> 3) % 2); });
    if (!bakedBg) buildBaked();
    if (bakedBg) bakedBg.forEach(function (L) { blit(L, cx, cy); });
  }

  function drawBackdrop(cx, cy, t) {
    if (MAP.style === 'city') { drawCityBackdrop(cx, cy, t); return; }
    if (MAP.style === 'desert') { drawDesertBackdrop(cx, cy, t); return; }
    var rest = WH - VH, i;
    var sunX = Math.round(VW * 0.78 - cx * 0.03), sunY = Math.round(VH * 0.18 - (cy - rest) * 0.05);
    disc(sunX, sunY, 15, '#fff9e6'); disc(sunX, sunY, 12, MAP.sun);
    for (i = 0; i < 5; i++) {
      var span = VW + 200;
      var wx = (((i * 263 + t * 0.06 - cx * 0.08) % span) + span) % span - 100;
      var wy = 18 + i * 14 - (cy - rest) * 0.08;
      disc(wx, wy, 7, '#f7fbfb'); disc(wx + 8, wy + 2, 6, '#f7fbfb'); disc(wx - 8, wy + 3, 5, '#eef5f6');
      ctx.fillStyle = '#eef5f6'; ctx.fillRect(Math.round(wx - 12), Math.round(wy + 5), 26, 3);
    }
    game.birds.forEach(function (b) { SP.bird(ctx, b.x, b.y - (cy - rest) * 0.08, ((game.t + b.ph) >> 3) % 2); });
    if (!bakedBg) buildBaked();
    if (!bakedBg) return;
    /* far volcanoes, with lava and lazy smoke drawn live on top of the painted layer */
    blit(bakedBg[0], cx, cy);
    var f = 0.15, off = (cy - rest) * f, base = VH * 0.62;
    var c0 = Math.floor((cx * f - 420) / 420);
    for (var c = c0; c <= c0 + Math.ceil(VW / 420) + 2; c++) {
      var px = c * 420 + 210 - cx * f, ph = 70 + hash(c, 7) * 40;
      if (px < -40 || px > VW + 40) continue;
      var py = Math.round(base - ph - off);
      ctx.fillStyle = MAP.farTop; ctx.fillRect(Math.round(px) - 10, py + 2, 20, 3);
      ctx.fillStyle = MAP.lava; ctx.fillRect(Math.round(px) - 4, py + 3, 8, 2);
      for (var k = 0; k < 4; k++) {
        var ph2 = ((t * 0.25 + k * 40 + c * 17) % 160) / 160;
        disc(px + Math.sin(ph2 * 6 + c) * 6 + ph2 * 20, py - 4 - ph2 * 50, 3 + ph2 * 6, ph2 < 0.5 ? MAP.smoke : '#d8dee2');
      }
    }
    blit(bakedBg[1], cx, cy);
    blit(bakedBg[2], cx, cy);
  }

  function drawWater(cx, t) {
    var x, wy, alt = game.sudden ? (MAP.goo ? [MAP.goo, MAP.gooTop] : (MAP.flood ? [MAP.flood, MAP.floodTop] : null)) : null;
    ctx.globalAlpha = 0.86; ctx.fillStyle = alt ? alt[0] : MAP.water;
    for (x = cx - 2; x < cx + VW + 2; x += 2) { wy = Math.round(WATER + Math.sin(x * 0.07 + t * 0.05) * 1.5); ctx.fillRect(x, wy, 2, WH + 300 - wy); }
    ctx.globalAlpha = 1; ctx.fillStyle = alt ? alt[1] : MAP.waterTop;
    for (x = cx - 2; x < cx + VW + 2; x += 2) { wy = Math.round(WATER + Math.sin(x * 0.07 + t * 0.05) * 1.5); ctx.fillRect(x, wy, 2, 1); }
  }

  /* Which frame a Snag shows. Returns [pose, frame, quarter turns, extras] */
  function poseOf(c, t) {
    var act = c === game.active, o = {};
    if (c.hurtT > 41 && !reduceMotion) o.flash = true;
    if ((game.state === 'over' && game.winner === c.team) || c.cheerT > 0) return ['cheer', (t >> 4) % 2, 0, o];
    if (c.sled) return [c.st === 'air' ? 'jump' : 'charge', 0, 0, o];
    if (act && game.swingT > 0) return ['swing', game.swingT > 12 ? 0 : 1, 0, o];
    if (act && game.digT > 0) return ['dig', (t >> 3) % 2, 0, o];
    if (c.swing) return ['jump', 0, 0, o];
    if (c.jet) return ['jump', (t >> 2) % 2, 0, o];
    if (c.st === 'air') {
      if (c.knock) return ['panic', (t >> 3) % 2, reduceMotion ? 0 : (c.spin || 0), o];
      if (c.flip) return ['jump', 0, -c.face * (Math.floor(c.airT / 5) % 4), o];
      if (c.vy < 0) { if (c.vy < -1.5) o.sq = 1; return ['jump', 0, 0, o]; }
      return ['fall', (t >> 3) % 2, 0, o];
    }
    if (c.landT > 3) o.sq = -1;
    if (c.hurtT > 25) return ['hurt', 0, 0, o];
    if (c.hurtT > 0) return ['panic', (t >> 3) % 2, 0, o];
    if (c.walking > 0) return ['walk', Math.floor(c.walkd / 3) % 4, 0, o];
    var k2 = WEAP[game.weapon].kind;
    if (act && game.state === 'play' && (k2 === 'proj' || k2 === 'beam' || k2 === 'vine')) {
      o.look = c.aim > 30 ? -1 : (c.aim < -20 ? 1 : 0);
      return [game.charging ? 'charge' : 'aim', 0, 0, o];
    }
    if (!act) { var ph = (t + c.blinkAt * 13) % 1500; if (ph < 80) return ['yawn', ph < 60 ? 0 : 1, 0, o]; }
    return ['idle', ((t + c.blinkAt) >> 5) % 4, 0, o];
  }

  function drawSnag(c, t) {
    var ps = poseOf(c, t), era = c.team.era;
    var bl = ps[0] !== 'cheer' && (t + c.blinkAt) % 200 < 7;
    ps[3].skin = c.team.skin;
    if (c.sled) { SP.draw(ctx, c.x, c.y - 2, c.face, era, ps[0], ps[1], bl, 0, 1, ps[3]); SP.sled(ctx, c.x, c.y, c.face); return; }
    var jx = ps[0] === 'charge' && game.power > 55 && !reduceMotion && (game.power > 85 || t % 4 < 2) ? ((t >> 1) % 2 ? 1 : -1) : 0;
    /* wind up: lean back as power builds; follow through: a kick back after the throw; a jolt when hit */
    if (ps[0] === 'charge') jx -= c.face * Math.round(game.power / 50);
    if (c.fireT > 0) jx -= c.face * (c.fireT > 6 ? 2 : 1);
    if (c.hurtT > 37 && !reduceMotion) jx += (t % 4 < 2 ? 1 : -1);
    var q = reduceMotion ? 0 : clamp(c.sq || 0, -0.35, 0.35), X = Math.round(c.x + jx), Y = Math.round(c.y);
    if (Math.abs(q) > 0.02) {
      ctx.save(); ctx.translate(X, Y); ctx.scale(1 - q * 0.6, 1 + q);
      SP.draw(ctx, 0, 0, c.face, era, ps[0], ps[1], bl, ps[2], 1, ps[3]);
      if (ps[0] === 'aim' || ps[0] === 'charge') SP.weapon(ctx, 0, 0, c.face, c.aim, game.weapon, era, t);
      ctx.restore();
      return;
    }
    SP.draw(ctx, X, Y, c.face, era, ps[0], ps[1], bl, ps[2], 1, ps[3]);
    if (ps[0] === 'aim' || ps[0] === 'charge') SP.weapon(ctx, X, Y, c.face, c.aim, game.weapon, era, t);
  }
  function kick(c, v) { c.sqv = (c.sqv || 0) + v; }

  function drawAim(t) {
    var c = game.active;
    if (!c || !c.alive || game.state !== 'play' || c.st !== 'ground') return;
    var kind = WEAP[game.weapon].kind;
    if (kind === 'strike' && game.tx !== null && !game.fired) {
      var X = Math.round(game.tx), sy = surfaceY(X), col0 = ER[c.team.era].tag;
      if (sy < 0) sy = WATER;
      for (var yy = Math.round(cam.y); yy < sy - 4; yy += 4) { ctx.fillStyle = col0; ctx.fillRect(X, yy, 1, 2); }
      ctx.fillStyle = '#1f2a30'; ctx.fillRect(X - 6, sy - 3, 13, 3); ctx.fillRect(X - 1, sy - 8, 3, 13);
      ctx.fillStyle = col0; ctx.fillRect(X - 5, sy - 2, 11, 1); ctx.fillRect(X, sy - 7, 1, 11);
      return;
    }
    if (kind !== 'proj' && kind !== 'dig' && kind !== 'beam' && kind !== 'vine') return;
    var aim = kind === 'dig' ? Math.min(c.aim, 35) : c.aim;
    var a = aim * Math.PI / 180, dx = Math.cos(a) * c.face, dy = -Math.sin(a);
    var tip = SP.tip(c.x, c.y, c.face, aim, game.weapon), i;
    var col = ER[c.team.era].tag;
    for (i = 1; i <= 4; i++) { ctx.fillStyle = '#fef8f4'; ctx.fillRect(Math.round(tip.x + dx * i * 6), Math.round(tip.y + dy * i * 6), 1, 1); }
    var hx = Math.round(tip.x + dx * 34), hy = Math.round(tip.y + dy * 34);
    ctx.fillStyle = '#1f2a30'; ctx.fillRect(hx - 3, hy - 1, 7, 3); ctx.fillRect(hx - 1, hy - 3, 3, 7);
    ctx.fillStyle = col; ctx.fillRect(hx - 2, hy, 5, 1); ctx.fillRect(hx, hy - 2, 1, 5);
    if (game.charging) {
      var n = Math.round(game.power / 100 * 14);
      for (i = 0; i < n; i++) {
        var sz = 2 + (i >> 2);
        ctx.fillStyle = i < 5 ? '#ffd27a' : (i < 10 ? '#f5a442' : '#ef7724');
        ctx.fillRect(Math.round(tip.x + dx * (4 + i * 2.4) - sz / 2), Math.round(tip.y + dy * (4 + i * 2.4) - sz / 2), sz, sz);
      }
    }
  }

  function drawArtsAndCrates(t) {
    game.arts.forEach(function (a) {
      if (a.st === 'buried') {
        var ph = a.glint % 240;
        if (ph < 26) {
          var sy = Math.floor(a.y - 12);
          while (sy > 0 && solid(a.x, sy)) sy--;
          var s = ph < 13 ? Math.floor(ph / 4) : Math.floor((26 - ph) / 4);
          var X = Math.round(a.x), Y = sy - 2;
          ctx.fillStyle = '#fff3c8';
          ctx.fillRect(X, Y - s, 1, 2 * s + 1); ctx.fillRect(X - s, Y, 2 * s + 1, 1);
        }
      } else if (a.st === 'loose') {
        SP.art(ctx, a.id, a.x, a.y + 1);
        if ((t >> 3) % 4 === 0) { ctx.fillStyle = '#fff3c8'; ctx.fillRect(Math.round(a.x) + 4, Math.round(a.y) - 12, 1, 1); }
      }
    });
    game.crates.forEach(function (cr) { SP.crate(ctx, cr.x, cr.y + 1, cr.kind, t); });
    game.barrels.forEach(function (b) { SP.barrel(ctx, b.x, b.y + 1, b.kind, t, b.fuse > 0); });
  }

  function pixLine(x0, y0, x1, y1, col, every) {
    var dx = x1 - x0, dy = y1 - y0, n = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy))));
    ctx.fillStyle = col;
    for (var i = 0; i <= n; i += (every || 1)) ctx.fillRect(Math.round(x0 + dx * i / n), Math.round(y0 + dy * i / n), 1, 1);
  }
  function drawVines() {
    game.snags.forEach(function (c) {
      if (!c.alive || !c.swing) return;
      var hx = c.x + c.face * 4, hy = c.y - 13;
      pixLine(hx, hy, c.swing.ax, c.swing.ay, '#3f7a2e');
      pixLine(hx + 1, hy, c.swing.ax + 1, c.swing.ay, '#5fa24a', 3);
      ctx.fillStyle = '#7ec850'; ctx.fillRect(Math.round(c.swing.ax) - 2, Math.round(c.swing.ay) - 1, 4, 2);
    });
  }
  function drawShields(t) {
    game.snags.forEach(function (c) {
      if (!c.alive || !c.shield) return;
      for (var k = 0; k < 28; k++) {
        if (k % 2) continue;
        var a = k / 28 * Math.PI * 2 + t * 0.015;
        ctx.fillStyle = k % 4 ? '#5fe0f0' : '#bff3fa';
        ctx.fillRect(Math.round(c.x + Math.cos(a) * 12), Math.round(c.y - 11 + Math.sin(a) * 15), 1, 1);
      }
    });
  }
  function drawStrikes(t) {
    game.warn.forEach(function (w) {
      if (w.t < 0) return;
      var X = Math.round(w.x), sy = surfaceY(X);
      if (sy < 0) sy = WATER;
      var bob = Math.round(Math.sin((w.t + X) * 0.15) * 2);
      ctx.fillStyle = '#1f2a30'; ctx.fillRect(X - 4, sy - 16 + bob, 9, 7); ctx.fillRect(X - 2, sy - 9 + bob, 5, 2);
      ctx.fillStyle = '#ef7724'; ctx.fillRect(X - 3, sy - 15 + bob, 7, 5); ctx.fillRect(X - 1, sy - 10 + bob, 3, 1);
      ctx.fillStyle = '#fff3c8'; ctx.fillRect(X, sy - 14 + bob, 1, 2);
      for (var yy = sy - 22; yy > sy - 70; yy -= 6) { ctx.fillStyle = '#ef7724'; ctx.fillRect(X, yy, 1, 2); }
    });
    game.strikes.forEach(function (s) {
      var X = Math.round(s.x), sy = surfaceY(X);
      if (sy < 0) sy = WATER;
      if (s.style === 'boulder') {
        if (s.t < 30) {
          ctx.fillStyle = 'rgba(31,42,48,0.35)'; ctx.fillRect(X - 10, sy - 2, 21, 2);
          return;
        }
        disc(s.x, s.y, 12, '#3d3832'); disc(s.x, s.y, 11, '#8c857b'); disc(s.x - 3, s.y - 3, 5, '#b5ada2');
        ctx.fillStyle = '#5f5a52'; ctx.fillRect(X + 2, Math.round(s.y), 5, 1); ctx.fillRect(X - 6, Math.round(s.y) + 4, 4, 1);
        for (var k = 1; k < 4; k++) disc(s.x + rand(-3, 3), s.y - 14 * k, 3 - k * 0.6, '#d8dee2');
      } else if (s.style === 'sun') {
        var gx0 = X + 190, gy0 = Math.round(cam.y) - 6, ty = sy - 2;
        if (s.t < 55) {
          var kk = s.t / 55;
          pixLine(gx0, gy0, X, ty, kk < 0.5 ? '#ffe066' : '#fff3c8', kk < 0.3 ? 4 : (kk < 0.7 ? 2 : 1));
          var rr2 = Math.round(20 - kk * 16);
          for (var q2 = 0; q2 < 18; q2++) { var a2 = q2 / 18 * Math.PI * 2 + s.t * 0.08; ctx.fillStyle = q2 % 2 ? '#ffd23f' : '#fff3c8'; ctx.fillRect(Math.round(X + Math.cos(a2) * rr2), Math.round(ty + Math.sin(a2) * rr2 * 0.5), 1, 1); }
          for (var m = 1; m < 4; m++) { var mx = Math.round(gx0 + (X - gx0) * m / 4), my = Math.round(gy0 + (ty - gy0) * m / 4); if ((s.t >> 2) % 3 === m - 1) { ctx.fillStyle = '#ffffff'; ctx.fillRect(mx - 1, my, 3, 1); ctx.fillRect(mx, my - 1, 1, 3); } }
        } else if (s.t < 70) {
          for (var w3 = -1; w3 <= 1; w3++) pixLine(gx0 + w3, gy0, X + w3, ty, w3 ? '#ffd23f' : '#ffffff');
        }
      } else {
        if (s.t < 45) {
          for (var y2 = Math.round(cam.y); y2 < sy; y2 += 3) { ctx.fillStyle = '#bff3fa'; ctx.fillRect(X, y2, 1, 2); }
          var rr = 4 + Math.round(s.t / 45 * 8);
          for (var q = 0; q < 16; q++) { var a = q / 16 * Math.PI * 2; ctx.fillStyle = '#37c8dc'; ctx.fillRect(Math.round(X + Math.cos(a) * rr), Math.round(sy - 2 + Math.sin(a) * rr * 0.4), 1, 1); }
        } else {
          var wv = Math.max(1, Math.round((72 - s.t) / 27 * s.R * 0.6));
          ctx.fillStyle = '#37c8dc'; ctx.fillRect(X - wv, Math.round(cam.y), wv * 2 + 1, sy + 60 - Math.round(cam.y));
          ctx.fillStyle = '#e9fdff'; ctx.fillRect(X - Math.max(0, wv - 3), Math.round(cam.y), Math.max(1, (wv - 3) * 2 + 1), sy + 60 - Math.round(cam.y));
        }
      }
    });
  }

  function drawDogs(t) {
    [game.courier, game.barker].forEach(function (b) {
      if (!b) return;
      if (b.phase === 'out') SP.portal(ctx, b.px, b.py, Math.min(0.5, b.t / 40), t);
      else if (b.phase === 'in') SP.portal(ctx, b.px, b.py, 0.5 + b.t / 44, t);
      else if (b.phase === 'swim') SP.bonnie(ctx, b.x, WATER + 4, b.dir, (t >> 4) % 2, false, false);
      else SP.bonnie(ctx, b.x, b.y, b.dir, b.phase === 'woof' ? 0 : (b.phase === 'run' || b.phase === 'back' ? (t >> 2) % 4 : 0), !!b.carry, b.phase === 'woof');
    });
  }

  function drawParts() {
    for (var i = 0; i < game.parts.length; i++) {
      var p = game.parts[i];
      if (p.delay > 0) continue;
      if (p.k === 'deb') { var s = p.big === 3 ? 3 : (p.big ? 2 : 1); if (s === 3) { ctx.fillStyle = '#1f2a30'; ctx.fillRect(Math.round(p.x), Math.round(p.y) + 1, 3, 3); } ctx.fillStyle = p.col; ctx.fillRect(Math.round(p.x), Math.round(p.y), s, s); }
      else if (p.k === 'drop') { ctx.fillStyle = '#cfeefa'; ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 2); }
      else if (p.k === 'spark') { ctx.fillStyle = (p.life >> 2) % 2 ? '#fff3c8' : '#ffd27a'; ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1); }
      else if (p.k === 'beam') { pixLine(p.x, p.y + 1, p.x2, p.y2 + 1, '#37c8dc'); if (p.life > 6) pixLine(p.x, p.y, p.x2, p.y2, '#e9fdff'); }
      else if (p.k === 'vinemiss') pixLine(p.x, p.y, p.x2, p.y2, '#3f7a2e', 2);
      else if (p.k === 'smoke') {
        ctx.globalAlpha = Math.min(1, p.life / ((p.max || 80) * 0.45));
        var young = p.life > (p.max || 80) * 0.6;
        disc(p.x, p.y, p.r, young ? '#5f5a58' : '#a7aeb3');
        disc(p.x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.6, young ? '#7c7672' : '#c9cfd3');
        ctx.globalAlpha = 1;
      }
      else if (p.k === 'dust' || p.k === 'puff') {
        ctx.globalAlpha = 0.75 * p.life / p.max;
        disc(p.x, p.y, p.r, p.col || '#e6e2da');
        ctx.globalAlpha = 1;
      }
      else if (p.k === 'ember') { var el = p.life / p.max; ctx.fillStyle = el > 0.6 ? '#fff3c8' : (el > 0.35 ? '#ffd27a' : (el > 0.18 ? '#ef7724' : '#c4572e')); ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1); }
      else if (p.k === 'flash') { ctx.globalAlpha = p.life / p.max; disc(p.x, p.y, p.r, '#ffffff'); ctx.globalAlpha = 1; }
      else if (p.k === 'ring') {
        var rk = 1 - p.life / p.max, rr = p.r * (0.5 + 1.3 * rk), nn = Math.max(16, Math.round(rr * 4));
        ctx.fillStyle = rk < 0.5 ? '#fff3c8' : '#ffd27a';
        for (var q = 0; q < nn; q++) { if (rk > 0.6 && q % 2) continue; var qa = q / nn * 6.283; ctx.fillRect(Math.round(p.x + Math.cos(qa) * rr), Math.round(p.y + Math.sin(qa) * rr * 0.8), 1, 1); }
      }
      else if (p.k === 'ripple') {
        var pk = 1 - p.life / p.max, pw = Math.round(3 + pk * 18);
        ctx.fillStyle = pk < 0.6 ? '#e9fbff' : '#a8dff0';
        ctx.fillRect(Math.round(p.x) - pw, Math.round(p.y) - 1, 3, 1); ctx.fillRect(Math.round(p.x) + pw - 2, Math.round(p.y) - 1, 3, 1);
        if (pk < 0.5) { ctx.fillRect(Math.round(p.x) - (pw >> 1), Math.round(p.y) - 2, 2, 1); ctx.fillRect(Math.round(p.x) + (pw >> 1) - 1, Math.round(p.y) - 2, 2, 1); }
      }
      else if (p.k === 'fire') {
        var k = 1 - p.life / p.max, R = p.r * (0.45 + 0.6 * k);
        disc(p.x, p.y, R, k < 0.45 ? '#ef7724' : (k < 0.8 ? '#c4572e' : '#6a3a2a'));
        if (k < 0.8) disc(p.x + 1, p.y + 1, R * 0.7, k < 0.5 ? '#ffd27a' : '#ef7724');
        if (k < 0.45) disc(p.x - 1, p.y - 1, R * 0.38, '#fff3c8');
        /* ragged flame licks round the edge */
        var nl = Math.round(R * 1.3);
        for (var fl = 0; fl < nl; fl++) {
          var fa = fl / nl * 6.283 + p.x, fr = R + 1 + hash(fl * 7 + Math.round(p.x), p.life >> 2) * 3;
          ctx.fillStyle = k < 0.5 ? '#ffd27a' : '#ef7724';
          if (hash(fl, p.life) < 0.55) ctx.fillRect(Math.round(p.x + Math.cos(fa) * fr), Math.round(p.y + Math.sin(fa) * fr), 2, 2);
        }
      }
    }
  }

  /* pixel text drawn at 2 or 3 times size, crisp */
  var btCache = {}, btN = 0;
  function bigText(str, x, y, col, k) {
    str = String(str).toUpperCase();
    var key = str + '|' + col, c2 = btCache[key];
    if (!c2) {
      if (++btN > 300) { btCache = {}; btN = 1; }
      c2 = btCache[key] = document.createElement('canvas');
      c2.width = SP.textWidth(str) + 4; c2.height = 9;
      SP.text(c2.getContext('2d'), str, 2, 2, col, '#1f2a30', false);
    }
    ctx.drawImage(c2, Math.round(x - c2.width * k / 2), Math.round(y - c2.height * k / 2), c2.width * k, c2.height * k);
  }
  function drawTags(t) {
    var hideTags = game.state === 'demo' || (scr && scr !== 'pause' && scr !== 'find');
    game.snags.forEach(function (c) {
      if (hideTags) return;
      if (!c.alive || c.arrive) return;
      var col = ER[c.team.era].tag, y = Math.round(c.y - 40);
      SP.text(ctx, c.name, c.x, y, col, '#1f2a30', true);
      if (game.state !== 'demo') {
        SP.text(ctx, String(c.hp), c.x, y + 7, '#ffffff', '#1f2a30', true);
        var bx = Math.round(c.x) - 9, by = y + 14, gw = Math.round(Math.min(100, c.ghost || 0) / 100 * 18), hw = Math.round(Math.min(100, c.hp) / 100 * 18);
        ctx.fillStyle = '#1f2a30'; ctx.fillRect(bx - 1, by - 1, 20, 4);
        if (gw > hw) { ctx.fillStyle = '#fef8f4'; ctx.fillRect(bx, by, gw, 2); }
        ctx.fillStyle = col; ctx.fillRect(bx, by, hw, 2);
      }
      if (c === game.active && game.state === 'play') {
        var ay = y - 9 + Math.round(Math.sin(t * 0.12) * 1.5), ax = Math.round(c.x);
        ctx.fillStyle = '#1f2a30'; ctx.fillRect(ax - 4, ay - 1, 9, 4); ctx.fillRect(ax - 2, ay + 3, 5, 2); ctx.fillRect(ax - 1, ay + 5, 3, 1);
        ctx.fillStyle = col; ctx.fillRect(ax - 3, ay, 7, 2); ctx.fillRect(ax - 1, ay + 2, 3, 2); ctx.fillRect(ax, ay + 4, 1, 1);
        /* the computer shows it is thinking */
        if (c.team.ctrl === 'ai' && game.ai && game.ai.phase === 'wait') {
          var bx2 = ax + 8, by2 = ay - 10;
          ctx.fillStyle = '#1f2a30'; ctx.fillRect(bx2 - 1, by2 - 1, 15, 7);
          ctx.fillStyle = '#fef8f4'; ctx.fillRect(bx2, by2, 13, 5); ctx.fillRect(bx2, by2 + 5, 2, 2);
          for (var dd = 0; dd < 3; dd++) { ctx.fillStyle = ((t >> 4) % 4) > dd ? '#1f2a30' : '#c3bce8'; ctx.fillRect(bx2 + 2 + dd * 4, by2 + 2, 2, 2); }
        }
      }
    });
    for (var i = 0; i < game.parts.length; i++) {
      var p = game.parts[i];
      if (p.k === 'txt') {
        var ag = (p.max || p.life + 1) - p.life, pop = ag < 8 ? Math.round(Math.sin(ag / 8 * Math.PI) * 3) : 0, sc = p.sc || 1;
        if (p.life < 18) ctx.globalAlpha = p.life / 18;
        if (sc > 1) bigText(p.s, p.x, p.y - pop, ag < 3 ? '#ffffff' : (p.col || '#ffd27a'), ag < 4 ? sc + 1 : sc);
        else SP.text(ctx, p.s, p.x, p.y - pop, ag < 3 ? '#ffffff' : (p.col || '#ffd27a'), '#1f2a30', true);
        ctx.globalAlpha = 1;
      }
    }
    game.projs.forEach(function (p) {
      if (p.fuse !== undefined) SP.text(ctx, String(Math.ceil(p.fuse / 60)), p.x, p.y - 12, '#ffffff', '#1f2a30', true);
    });
  }

  function render() {
    var t = game.t, sx = 0, sy = 0;
    if (game.shake > 0.3 && !reduceMotion && shakeOn) { sx = rand(-game.shake, game.shake); sy = rand(-game.shake, game.shake); }
    var cx = Math.round(cam.x + sx), cy = Math.round(cam.y + sy), i;
    ctx.drawImage(skyCv, 0, 0);
    drawBackdrop(cx, cy, t);
    ctx.save();
    ctx.translate(-cx, -cy);
    ctx.drawImage(terr, 0, 0);
    drawArtsAndCrates(t);
    drawVines();
    for (i = 0; i < game.snags.length; i++) if (game.snags[i].alive && !game.snags[i].arrive) drawSnag(game.snags[i], t);
    drawShields(t);
    drawDogs(t);
    drawStrikes(t);
    game.portals.forEach(function (p) {
      var k = p.t / 60;
      if (p.inn) { SP.portal(ctx, p.x, p.y, Math.min(1, k), t); return; }
      if (p.ko) {
        if (p.t < 22) {
          var hop = Math.sin(p.t / 22 * Math.PI) * 18;
          SP.draw(ctx, p.x, p.y + 12 - hop, p.c.face, p.c.team.era, 'panic', (t >> 2) % 2, false, reduceMotion ? 0 : p.t / 5 * p.c.face, 1, { skin: p.c.team.skin });
        } else {
          var kk = (p.t - 22) / 50;
          SP.portal(ctx, p.x, p.y, Math.min(1, kk * 1.6), t);
          if (kk < 0.5) SP.draw(ctx, p.x, p.y + 12, p.c.face, p.c.team.era, 'panic', (t >> 3) % 2, false, reduceMotion ? 0 : (p.t / 3) * p.c.face, 1 - kk * 2, { skin: p.c.team.skin });
        }
        return;
      }
      if (k < 1) SP.draw(ctx, p.x, p.y + 12, p.c.face, p.c.team.era, 'panic', (t >> 3) % 2, false, 0, 1 - k, { skin: p.c.team.skin });
      SP.portal(ctx, p.x, p.y, Math.min(1, k), t);
    });
    game.projs.forEach(function (p) {
      /* a soft halo and a fading streak so shots are easy to follow */
      if (!p.rest) {
        var tr = p.trail || [];
        for (var q = 0; q < tr.length; q++) { ctx.globalAlpha = 0.12 + 0.35 * q / tr.length; disc(tr[q][0], tr[q][1], 1 + q / tr.length * 1.5, '#fff6dc'); }
        ctx.globalAlpha = 0.3; disc(p.x, p.y, 5.5, '#fff6dc'); ctx.globalAlpha = 1;
      }
      SP.proj(ctx, p, p.era || 'pre', t);
    });
    drawAim(t);
    drawParts();
    drawWater(cx, t);
    drawTags(t);
    if (game.state !== 'demo') drawLearn(t);
    ctx.restore();
    if (game.sudden && MAP.style === 'desert') drawSandstorm(t);
    if (t % 3 === 0 && game.state !== 'demo') drawMini();
  }

  function drawSandstorm(t) {
    ctx.fillStyle = 'rgba(214,170,100,0.13)'; ctx.fillRect(0, 0, VW, VH);
    var dir = game.wind < 0 ? -1 : 1;
    for (var b = 0; b < 3; b++) {
      var by = ((b * 97 + t * 0.4) % (VH + 60)) - 30;
      ctx.fillStyle = 'rgba(226,186,118,0.18)'; ctx.fillRect(0, Math.round(by), VW, 14 + b * 6);
    }
    for (var k = 0; k < 110; k++) {
      var sp = 2 + hash(k, 2) * 4, len = 4 + Math.floor(hash(k, 4) * 10);
      var x = ((hash(k, 1) * (VW + 40) + dir * t * sp) % (VW + 40) + VW + 40) % (VW + 40) - 20, y = Math.floor(hash(k, 3) * VH + Math.sin(t * 0.03 + k) * 3);
      ctx.fillStyle = k % 3 ? 'rgba(236,204,140,0.55)' : 'rgba(255,240,200,0.6)';
      ctx.fillRect(Math.round(x), y, len, 1);
    }
  }

  /* ---------------- minimap ---------------- */
  var mini = $('mini'), mctx = mini.getContext('2d'), mcv = document.createElement('canvas');
  function drawMini() {
    var MW = mini.width, MH = mini.height, x, y;
    if (miniDirty) {
      miniDirty = false;
      mcv.width = MW; mcv.height = MH;
      var m = mcv.getContext('2d'), id = m.createImageData(MW, MH), dd = id.data, st = MAP.style;
      var MC = {
        solid: st === 'city' ? [96, 106, 134] : (st === 'desert' ? [214, 172, 104] : [112, 84, 52]),
        water: [63, 143, 181],
        sd: st === 'city' ? [95, 211, 95] : (st === 'desert' ? [154, 106, 58] : [63, 143, 181]),
        sky: st === 'city' || LOOK === 'neon' ? [58, 56, 104] : (st === 'desert' ? [238, 222, 188] : [191, 224, 230])
      };
      for (y = 0; y < MH; y++) for (x = 0; x < MW; x++) {
        var wx = Math.floor((x + 0.5) * WW / MW), wy = Math.floor((y + 0.5) * WH / MH), k = (y * MW + x) * 4;
        var col = mask[wy * WW + wx] ? MC.solid : (wy > WATER ? (game.sudden ? MC.sd : MC.water) : MC.sky);
        dd[k] = col[0]; dd[k + 1] = col[1]; dd[k + 2] = col[2];
        dd[k + 3] = 255;
      }
      m.putImageData(id, 0, 0);
    }
    mctx.drawImage(mcv, 0, 0);
    var sx = MW / WW, sy = MH / WH;
    game.snags.forEach(function (c) {
      if (!c.alive) return;
      var s = c === game.active ? 5 : 3;
      mctx.fillStyle = '#1f2a30'; mctx.fillRect(Math.round(c.x * sx) - (s >> 1) - 1, Math.round((c.y - 8) * sy) - (s >> 1) - 1, s + 2, s + 2);
      mctx.fillStyle = ER[c.team.era].tag; mctx.fillRect(Math.round(c.x * sx) - (s >> 1), Math.round((c.y - 8) * sy) - (s >> 1), s, s);
    });
    game.projs.forEach(function (p) { mctx.fillStyle = '#ffffff'; mctx.fillRect(Math.round(p.x * sx) - 1, Math.round(p.y * sy) - 1, 2, 2); });
    mctx.strokeStyle = '#fef8f4'; mctx.lineWidth = 1;
    mctx.strokeRect(Math.round(cam.x * sx) + 0.5, Math.round(cam.y * sy) + 0.5, Math.round(VW * sx), Math.round(VH * sy));
  }

  /* ---------------- HUD ---------------- */
  function banner(a, b, col, glyph) {
    var el = $('banner');
    el.innerHTML = (glyph ? '<canvas data-g="' + glyph + '" class="g big"></canvas> ' : '') + esc(a) + (b ? '<small>' + esc(b) + '</small>' : '');
    if (glyph) SP.paintGlyphs(el);
    el.style.setProperty('--c', col || '#7b5cff');
    el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
    game.bannerT = 150;
  }
  /* squad bars: a lamp, the squad name, one health bar per Snag, and the total */
  function hudStatic() {
    game.teams.forEach(function (tm, i) {
      var el = $('tc' + i);
      if (!el) return;
      el.style.setProperty('--c', ER[tm.era].tag);
      el.innerHTML = '<span class="lamp"></span><b class="tn">' + (tm.ctrl === 'ai' ? gl('cpu', 'sm') + ' ' : '') + esc(tm.name) + '</b>' +
        '<span class="pips">' + tm.members.map(function (m) { return '<i title="' + esc(m.name) + '"><s></s><u></u></i>'; }).join('') + '</span><span class="th"></span>';
      SP.paintGlyphs(el);
    });
    hudCache = {};
  }
  var hudCache = {}, iconKey = '';
  function setText(id, s) { if (hudCache[id] !== s) { hudCache[id] = s; $(id).textContent = s; } }
  function setHide(id, h) { var k = id + '#h'; if (hudCache[k] !== h) { hudCache[k] = h; $(id).hidden = h; } }
  function hudTick() {
    if (game.state === 'demo') return;
    game.teams.forEach(function (tm, i) {
      var el = $('tc' + i);
      if (!el) return;
      var tot = 0, pips = el.querySelectorAll('.pips i');
      tm.members.forEach(function (m, k) {
        if (m.alive) tot += m.hp;
        var pp = pips[k];
        if (!pp) return;
        var wd = (m.alive ? Math.min(100, m.hp) : 0) + '%', gd = (m.alive ? Math.min(100, Math.max(m.hp, m.ghost || 0)) : 0) + '%';
        if (pp.lastChild.style.width !== wd) pp.lastChild.style.width = wd;
        if (pp.firstChild.style.width !== gd) pp.firstChild.style.width = gd;
        pp.classList.toggle('dead', !m.alive);
        pp.classList.toggle('cur', m === game.active);
      });
      var th = el.querySelector('.th');
      if (th && th.textContent !== String(tot)) {
        if (+th.textContent > tot && !reduceMotion) { el.classList.remove('jolt'); void el.offsetWidth; el.classList.add('jolt'); }
        th.textContent = tot;
      }
      el.classList.toggle('now', !!(game.active && game.active.team === tm));
    });
    /* wind: chevrons for strength and direction, the number for the maths */
    var w = game.wind, lit = Math.ceil(Math.abs(w) / 2), ch = $('wchev').children;
    for (var k = 0; k < ch.length; k++) ch[k].classList.toggle('on', k < lit);
    $('wchev').classList.toggle('left', w < 0);
    setText('wtxt', String(Math.abs(w)));
    var c = game.active;
    if (!c) { setText('wname', ''); setText('wammo', ''); setHide('cAngle', true); setHide('cPower', true); setHide('cHint', true); }
    else {
      var wid = game.weapon, kind = WEAP[wid].kind, av = avail(c.team, wid), era = c.team.era;
      setText('wname', weaponName(era, wid));
      setText('wammo', game.fired ? '' : (av.locked ? String(av.locked) : ((WEAP[wid].ammo || wid === 'bark') ? 'x' + (av.left || 0) : '')));
      setHide('wlock', !av.locked); setHide('wfree', !WEAP[wid].tool);
      if (iconKey !== era + wid) { iconKey = era + wid; SP.icon($('wicon').getContext('2d'), wid, era); }
      var showAngle = !c.swing && !c.jet && !c.sled && (kind === 'proj' || kind === 'beam' || kind === 'vine' || kind === 'dig');
      setHide('cAngle', !showAngle);
      if (showAngle) setText('wangle', Math.round(kind === 'dig' ? Math.min(c.aim, 35) : c.aim) + '\u00b0');
      var showPow = showAngle && kind === 'proj';
      setHide('cPower', !showPow);
      if (showPow) {
        var pw = game.charging ? game.power : (game.lastPower || 0), segs = $('pseg').children, n = Math.round(pw / 10);
        for (k = 0; k < segs.length; k++) { segs[k].classList.toggle('on', k < n); segs[k].classList.toggle('hot', k >= 6); segs[k].classList.toggle('max', k >= 9); }
        $('pseg').classList.toggle('dim', !game.charging);
        setText('wpow', game.charging ? String(Math.round(pw)) : (game.lastPower ? String(game.lastPower) : '--'));
      }
      /* fuel gauge for the jetpack and sled, arrows for picking a strike spot */
      var hint = '', fuel = -1;
      if (c.jet || kind === 'jet') { hint = 'fuel'; fuel = game.fuel / WEAP.jet.fuel; }
      else if (c.sled || kind === 'sled') { hint = 'fuel'; fuel = game.sledFuel / WEAP.sled.fuel; }
      else if (kind === 'strike' && !av.locked) hint = 'arrows';
      setHide('cHint', !hint);
      if (hint) {
        if (hudCache.hintG !== hint) { hudCache.hintG = hint; $('hintG').setAttribute('data-g', hint); SP.paintGlyphs($('cHint')); }
        setHide('fseg', fuel < 0);
        if (fuel >= 0) { var fs = $('fseg').children, fn = Math.ceil(Math.max(0, fuel) * 10); for (k = 0; k < fs.length; k++) fs[k].classList.toggle('on', k < fn); }
        setText('hintT', '');
      }
    }
    var ring = $('tring');
    if (game.state === 'play' && game.turnLen === 0) { setText('ttxt', '\u221e'); ring.style.setProperty('--p', 100); ring.classList.remove('low'); }
    else if (game.state === 'play') {
      var secs = Math.ceil(game.timer / 60);
      setText('ttxt', String(secs));
      ring.style.setProperty('--p', Math.round(game.timer / (game.turnLen * 60) * 100));
      ring.classList.toggle('low', secs <= 10);
    } else { setText('ttxt', '--'); ring.style.setProperty('--p', 0); ring.classList.remove('low'); }
  }
  function gl(n, extra) { return '<canvas data-g="' + n + '" class="g' + (extra ? ' ' + extra : '') + '"></canvas>'; }

  /* ---------------- the stage: one fixed 1280 by 720 screen, scaled to fit the window ---------------- */
  var stage = $('stage'), SW = 1280, SH = 720, stageK = 1;
  /* three crisp zoom steps, each a whole number of screen pixels per game pixel */
  var VIEWS = [[320, 180, 4], [427, 240, 3], [640, 360, 2]], ZOOM_NAMES = ['Close', 'Normal', 'Far'];
  var zoom = parseInt(store('zoom'), 10);
  if (isNaN(zoom)) zoom = 1;
  var shakeOn = store('shake') !== '0';
  var touchOn = store('touch') !== null ? store('touch') === '1' : !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  var matchOn = false, freeCam = null, panning = null;
  function setZoom(z) {
    z = clamp(z, 0, VIEWS.length - 1);
    var ox = cam.x + VW / 2, oy = cam.y + VH / 2, v = VIEWS[z], changed = z !== zoom;
    zoom = z; VW = v[0]; VH = v[1]; SCALE = v[2];
    cv.width = VW; cv.height = VH;
    cv.style.width = VW * SCALE + 'px'; cv.style.height = VH * SCALE + 'px';
    ctx.imageSmoothingEnabled = false;
    buildSky(); buildCityBg();
    cam.x = ox - VW / 2; cam.y = oy - VH / 2;
    store('zoom', String(z));
    if (changed) sfx('tick');
  }
  function fitStage() {
    var de = document.documentElement, w = de.clientWidth || window.innerWidth, h = de.clientHeight || window.innerHeight;
    stageK = Math.min(w / SW, h / SH);
    var ox = Math.round((w - SW * stageK) / 2), oy = Math.round((h - SH * stageK) / 2);
    stage.style.transform = 'translate(' + ox + 'px,' + oy + 'px) scale(' + stageK + ')';
  }
  function stageXY(e) { var r = stage.getBoundingClientRect(); return { x: (e.clientX - r.left) / stageK, y: (e.clientY - r.top) / stageK }; }
  function toWorld(e) {
    var rc = cv.getBoundingClientRect();
    return { x: (e.clientX - rc.left) / rc.width * cv.width + Math.round(cam.x), y: (e.clientY - rc.top) / rc.height * cv.height + Math.round(cam.y) };
  }
  function clampFree() {
    if (!freeCam) return;
    freeCam.x = clamp(freeCam.x, VW / 2, WW - VW / 2);
    freeCam.y = clamp(freeCam.y, -140 + VH / 2, WH - VH / 2);
  }
  function lookFrom() { if (!freeCam) freeCam = { x: cam.x + VW / 2, y: cam.y + VH / 2 }; }

  /* pixel cursors: a pointer in menus, a crosshair in battle, a four way arrow when looking around */
  function makeCursors() {
    var D = '#0e0b22', L = '#fef8f4', C = '#5fe0f0';
    var ARROW = ['k...........', 'kk..........', 'kwk.........', 'kwwk........', 'kwwwk.......', 'kwwwwk......', 'kwwwwwk.....', 'kwwwwwwk....',
      'kwwwwwwwk...', 'kwwwwkkkkk..', 'kwwkwwk.....', 'kwk.kwwk....', 'kk...kwwk...', 'k....kwwk...', '......kwwk..', '.......kk...'];
    var a = document.createElement('canvas'); a.width = 24; a.height = 32;
    var ax = a.getContext('2d');
    ARROW.forEach(function (row, y) { for (var x = 0; x < row.length; x++) { var ch = row.charAt(x); if (ch !== '.') { ax.fillStyle = ch === 'k' ? D : L; ax.fillRect(x * 2, y * 2, 2, 2); } } });
    var c = document.createElement('canvas'); c.width = 30; c.height = 30;
    var cx = c.getContext('2d');
    cx.fillStyle = D; cx.fillRect(13, 0, 4, 11); cx.fillRect(13, 19, 4, 11); cx.fillRect(0, 13, 11, 4); cx.fillRect(19, 13, 11, 4); cx.fillRect(13, 13, 4, 4);
    cx.fillStyle = C; cx.fillRect(14, 1, 2, 9); cx.fillRect(14, 20, 2, 9); cx.fillRect(1, 14, 9, 2); cx.fillRect(20, 14, 9, 2);
    cx.fillStyle = L; cx.fillRect(14, 14, 2, 2);
    var g = document.createElement('canvas'); g.width = 30; g.height = 30;
    var gx = g.getContext('2d');
    gx.fillStyle = D; gx.fillRect(12, 2, 6, 26); gx.fillRect(2, 12, 26, 6);
    [[15, 0, 0, 1], [15, 30, 0, -1], [0, 15, 1, 0], [30, 15, -1, 0]].forEach(function (q) {
      for (var i = 0; i < 6; i++) {
        if (q[2] === 0) gx.fillRect(q[0] - i - 1, q[1] + q[3] * (i + 1) - (q[3] < 0 ? 1 : 0), 2 * i + 2, 1);
        else gx.fillRect(q[0] + q[2] * (i + 1) - (q[2] < 0 ? 1 : 0), q[1] - i - 1, 1, 2 * i + 2);
      }
    });
    gx.fillStyle = L; gx.fillRect(14, 5, 2, 20); gx.fillRect(5, 14, 20, 2);
    var R = document.documentElement.style;
    try {
      R.setProperty('--cur-arrow', 'url(' + a.toDataURL() + ') 0 0, default');
      R.setProperty('--cur-hand', 'url(' + a.toDataURL() + ') 0 0, pointer');
      R.setProperty('--cur-cross', 'url(' + c.toDataURL() + ') 15 15, crosshair');
      R.setProperty('--cur-grab', 'url(' + g.toDataURL() + ') 15 15, move');
    } catch (e) { /* plain cursors then */ }
  }

  /* ---------------- screens ---------------- */
  var SCREENS = ['title', 'main', 'squad', 'mapsel', 'ready', 'options', 'help', 'pause', 'victory', 'results', 'tour', 'museum', 'find', 'label', 'postcard'];
  var scr = null, CTL = {}, wiping = false, retOf = {};
  /* the time portal wipe: a portal swells to fill the screen, the screen swaps behind it, then it shrinks away */
  function wipe(fn) {
    if (reduceMotion || wiping) { fn(); return; }
    wiping = true; sfx('wipe');
    var w = $('wipe'); w.className = 'in';
    setTimeout(function () {
      try { fn(); } finally {
        w.className = 'out';
        setTimeout(function () { w.className = ''; wiping = false; }, 300);
      }
    }, 290);
  }
  function show(id, cut) {
    var go = function () {
      SCREENS.forEach(function (s) { $(s).classList.toggle('on', s === id); });
      closeKit();
      scr = id || null; game.overlay = scr;
      inp.left = inp.right = inp.up = inp.down = false;
      if (game.charging) { game.charging = false; game.power = 0; }
      panning = null; leftDown = false;
      $('hud').hidden = !matchOn || ['victory', 'results', 'tour', 'postcard', 'label'].indexOf(scr) >= 0;
      var c = scr && CTL[scr];
      if (c && c.enter) c.enter();
      if (c && c.items) setSel(c.sel || 0, true);
      prompts();
    };
    /* screens over a running battle cut straight in, menus travel through the portal */
    if (cut || (matchOn && game.state !== 'over')) go(); else wipe(go);
  }
  function hideOv() { show(null, true); }
  function paused() { return !!game.overlay && matchOn && game.state !== 'over'; }
  function vis(el) { return !!(el && !el.hidden && el.offsetParent !== null); }
  function itemsOf(c) { return c && c.items ? c.items().filter(vis) : []; }
  function setSel(i, quiet) {
    var c = CTL[scr], it = itemsOf(c);
    if (!it.length) return;
    i = c.wrap === false ? clamp(i, 0, it.length - 1) : ((i % it.length) + it.length) % it.length;
    var changed = c.sel !== i;
    c.sel = i;
    it.forEach(function (el, k) { el.classList.toggle('sel', k === i); });
    if (changed && !quiet) sfx('blip');
    if (c.onSel) c.onSel(it[i], i);
  }
  function selected() { var c = CTL[scr]; return c ? itemsOf(c)[c.sel] : null; }
  function navKey(e) {
    var c = CTL[scr];
    if (!c) return;
    if (c.key && c.key(e)) { if (e.preventDefault) e.preventDefault(); return; }
    var k = e.code, cols = c.cols || 1;
    if (k === 'ArrowUp' || k === 'KeyW') { e.preventDefault(); if (c.ud) c.ud(-1); else setSel(c.sel - cols); }
    else if (k === 'ArrowDown' || k === 'KeyS') { e.preventDefault(); if (c.ud) c.ud(1); else setSel(c.sel + cols); }
    else if (k === 'ArrowLeft' || k === 'KeyA') { e.preventDefault(); if (c.lr) c.lr(-1); else if (cols > 1) setSel(c.sel - 1); }
    else if (k === 'ArrowRight' || k === 'KeyD') { e.preventDefault(); if (c.lr) c.lr(1); else if (cols > 1) setSel(c.sel + 1); }
    else if (k === 'Enter' || k === 'NumpadEnter' || k === 'Space') {
      e.preventDefault();
      if (e.repeat) return;
      var it = selected();
      if (c.ok) { sfx('clunk'); c.ok(it); } else if (it) it.click();
    }
    else if (k === 'Escape' || k === 'Backspace') { e.preventDefault(); if (!e.repeat && c.back) { sfx('clunk'); c.back(); } }
  }
  function fakeKey(code) { return { code: code, repeat: false, preventDefault: function () {} }; }
  /* hovering anything you can pick selects it, exactly like the arrow keys */
  stage.addEventListener('pointerover', function (e) {
    var c = CTL[scr];
    if (!c || !c.items || e.pointerType === 'touch') return;
    var it = itemsOf(c);
    for (var k = 0; k < it.length; k++) if (it[k] === e.target || it[k].contains(e.target)) { if (k !== c.sel) setSel(k); return; }
  });
  stage.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.mi,.port,.mcard,.stop,.case,.arr,#prompts button,.nrow button,.tabs button')) { audioInit(); sfx('clunk'); }
  });
  stage.addEventListener('contextmenu', function (e) { var t = e.target.tagName; if (t !== 'INPUT' && t !== 'TEXTAREA') e.preventDefault(); });

  /* the key prompts along the bottom of every menu, each one clickable */
  var ARR_UD = '\u2191\u2193', ARR_LR = '\u2190\u2192', ARR_ALL = '\u2190\u2191\u2192\u2193';
  var PROMPTS = {
    main: [[ARR_UD, 'Move', 'ArrowDown'], ['Enter', 'Select', 'Enter'], ['Esc', 'Back', 'Escape']],
    squad: [[ARR_LR, 'Move', 'ArrowRight'], ['Enter', 'Lock in', 'Enter'], ['Esc', 'Back', 'Escape']],
    mapsel: [[ARR_LR, 'Move', 'ArrowRight'], ['Enter', 'Select', 'Enter'], ['Esc', 'Back', 'Escape']],
    ready: [[ARR_UD, 'Move', 'ArrowDown'], [ARR_LR, 'Change', 'ArrowRight'], ['Enter', 'Select', 'Enter'], ['Esc', 'Back', 'Escape']],
    options: [[ARR_UD, 'Move', 'ArrowDown'], [ARR_LR, 'Change', 'ArrowRight'], ['Esc', 'Back', 'Escape']],
    help: [['Esc', 'Back', 'Escape']],
    pause: [[ARR_UD, 'Move', 'ArrowDown'], ['Enter', 'Select', 'Enter'], ['Esc', 'Resume', 'Escape']],
    results: [[ARR_UD, 'Move', 'ArrowDown'], ['Enter', 'Select', 'Enter']],
    tour: function () { return [[ARR_LR, 'Look', 'ArrowRight'], ['Enter', tourNext() >= 0 ? 'Play' : 'Postcard', 'Enter'], ['N', newTourArm ? 'Sure? New tour' : 'New tour', 'KeyN'], ['Esc', 'Back', 'Escape']]; },
    museum: [[ARR_ALL, 'Move', 'ArrowRight'], ['Q E', 'Shelf', 'KeyE'], ['Enter', 'Label', 'Enter'], ['Esc', 'Back', 'Escape']],
    find: [['Enter', 'Back to battle', 'Enter']],
    label: [['Esc', 'Back', 'Escape']],
    postcard: [['Esc', 'Back', 'Escape']]
  };
  function prompts() {
    var p = scr && PROMPTS[scr], el = $('prompts');
    if (typeof p === 'function') p = p();
    el.hidden = !p;
    if (!p) { el.innerHTML = ''; return; }
    var coarse = touchOn || !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    el.innerHTML = p.filter(function (q) { return !coarse || q[2] === 'Escape' || q[2] === 'Enter' || q[2] === 'KeyN' || q[2] === 'KeyE'; }).map(function (q) {
      return '<button data-code="' + q[2] + '"' + (coarse ? ' class="tbtn"' : '') + '>' + (coarse ? '' : q[0].split(' ').map(function (k) { return '<kbd>' + esc(k) + '</kbd>'; }).join('')) + esc(q[1]) + '</button>';
    }).join('');
  }
  $('prompts').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (b) navKey(fakeKey(b.getAttribute('data-code')));
  });

  /* ---------- title ---------- */
  CTL.title = {
    enter: function () { if (!reduceMotion && !TEST) { var t = $('title'); t.classList.remove('intro'); void t.offsetWidth; t.classList.add('intro'); } },
    key: function (e) { if (/^(F\d+|Shift|Control|Alt|Meta|Tab)/.test(e.code)) return false; if (!e.repeat) goMain(); return true; }
  };
  $('title').addEventListener('click', function () { audioInit(); goMain(); });
  function goMain() { audioInit(); musicEra('title'); show('main'); }

  /* ---------- main menu ---------- */
  var opts = { mode: 'cpu', mood: 'sleepy', era: 'pre', foe: null, size: 3, turn: 60, sd: 'on', map: 'jungle', names: null, skinA: 'classic', skinB: 'classic' };
  try { var so = JSON.parse(store('opts') || 'null'); if (so) for (var ok in opts) if (so[ok] !== undefined) opts[ok] = so[ok]; } catch (e) { /* defaults */ }
  if (READY.indexOf(opts.era) < 0) opts.era = READY[0];
  if (opts.map !== 'random' && MAP_IDS.indexOf(opts.map) < 0) opts.map = 'jungle';
  if (opts.mode !== 'friend') opts.mode = 'cpu';
  function saveOpts() { store('opts', JSON.stringify(opts)); }
  CTL.main = {
    sel: 0, act: '', wrap: false,
    items: function () { return [].slice.call(document.querySelectorAll('#mList .mi')); },
    enter: function () {
      var T = loadTourState(), n = allArts().length;
      $('miContinue').hidden = !(store('save') || T);
      $('musN').textContent = museumCount(allArts()) + '/' + n;
      $('miTour').innerHTML = 'Time Tour' + (T ? '<b>' + Math.min(TOUR_STOPS.length, T.results.length) + '/' + TOUR_STOPS.length + '</b>' : '');
      /* keep the highlight on the same item, even when Continue appears or goes */
      var it = itemsOf(CTL.main), k = 0;
      it.forEach(function (el, i) { if (el.getAttribute('data-act') === CTL.main.act) k = i; });
      CTL.main.sel = k;
    },
    onSel: function (el) { CTL.main.act = el.getAttribute('data-act'); },
    back: function () { show('title'); }
  };
  $('mList').addEventListener('click', function (e) {
    var b = e.target.closest('.mi');
    if (!b) return;
    var a = b.getAttribute('data-act');
    audioInit();
    if (a === 'exit') {
      if (!exitArm) {
        e.preventDefault(); exitArm = true; b.textContent = 'Leave? Press again'; sfx('bonk');
        setTimeout(function () { exitArm = false; b.textContent = 'Exit to Base 5'; }, 2500);
      }
      return;
    }
    if (a === 'continue') doContinue();
    else if (a === 'quick') startSetup('cpu');
    else if (a === 'two') startSetup('friend');
    else if (a === 'tour') { if (loadTourState()) openTour(); else startSetup('tour'); }
    else if (a === 'museum') openMuseum('main');
    else if (a === 'help') openHelp('main');
    else if (a === 'options') openOptions('main');
  });
  var exitArm = false;
  function doContinue() {
    if (store('save')) wipe(function () { if (!loadMatch()) { store('save', null); show('main', true); } });
    else if (loadTourState()) openTour();
  }
  function startSetup(mode) { opts.mode = mode; pick.keep = 0; show('squad'); }
  function toMenu() {
    wipe(function () {
      inMatch(false); startDemo(); musicEra('title');
      CTL.main.act = '';
      show('main', true);
    });
  }

  /* ---------- squad select: a fighting game roster with two cursors ---------- */
  var ROSTER = READY.slice().sort(function (a, b) { return yearOf(a) - yearOf(b); });
  var pick = { st: 0, a: null, b: null, keep: 0, busy: null };
  function tlInfo(id) { for (var i = 0; i < TL.length; i++) if (TL[i].id === id) return TL[i]; return null; }
  function yearLabel(y) { var n = Math.abs(y), t = n >= 10000 ? n.toLocaleString('en-GB') : String(n); return y < 0 ? t + ' BC' : 'AD ' + t; }
  function yearsApart(a, b) { var n = Math.abs(a - b) - (a < 0 && b > 0 ? 1 : 0); return n >= 10000 ? Math.round(n / 1000) * 1000 : Math.round(n / 100) * 100; }
  function drawSnagCv(cv2, era, pose, f, face, bl, skin) {
    var x2 = cv2.getContext('2d');
    x2.clearRect(0, 0, cv2.width, cv2.height);
    SP.draw(x2, cv2.width >> 1, cv2.height - 1, face || 1, era, pose || 'idle', f || 0, !!bl, 0, 1, { skin: skin });
  }
  function skinOf(v) { return v && v !== 'classic' && unlocked().indexOf(v) >= 0 ? v : null; }
  var silCache = {};
  function silhouette(col) {
    if (silCache[col]) return silCache[col];
    var c = document.createElement('canvas'); c.width = 32; c.height = 30;
    var x2 = c.getContext('2d');
    SP.draw(x2, 16, 29, 1, 'pre', 'idle', 0, false, 0);
    x2.globalCompositeOperation = 'source-in'; x2.fillStyle = col; x2.fillRect(0, 0, 32, 30);
    silCache[col] = c;
    return c;
  }
  function buildRoster() {
    $('roster').innerHTML = ROSTER.map(function (e, i) {
      return '<button class="port" data-i="' + i + '" style="--c:' + ER[e].tag + '" aria-label="' + esc(ER[e].team) + '"><canvas width="36" height="32"></canvas><span class="nm">' + esc(ER[e].team) + '</span></button>';
    }).join('');
  }
  CTL.squad = {
    sel: 0, wrap: true,
    items: function () { return [].slice.call(document.querySelectorAll('#roster .port')); },
    enter: function () {
      if (!$('roster').children.length) buildRoster();
      if (pick.busy) { clearTimeout(pick.busy); pick.busy = null; }
      if (pick.keep && opts.mode !== 'tour') {
        pick.st = 1; pick.a = opts.era; pick.b = null;
        CTL.squad.sel = Math.max(0, ROSTER.indexOf(foeOf(opts)));
      } else {
        pick.st = 0; pick.a = null; pick.b = null;
        CTL.squad.sel = Math.max(0, ROSTER.indexOf(opts.era));
      }
      pick.keep = 0; sideKey = {};
      drawSquad();
    },
    onSel: function () { drawSquad(); },
    lr: function (d) {
      if (pick.st >= 2) return;
      var n = ROSTER.length, i = (CTL.squad.sel + d + n) % n;
      if (pick.st === 1 && ROSTER[i] === pick.a) i = (i + d + n) % n;
      setSel(i);
    },
    ok: function () { lockPick(); },
    back: function () {
      if (pick.busy) return;
      if (pick.st === 1) { pick.st = 0; pick.a = null; setSel(ROSTER.indexOf(opts.era), true); drawSquad(); }
      else show('main');
    }
  };
  $('roster').addEventListener('click', function (e) {
    var b = e.target.closest('.port');
    if (!b || pick.st >= 2) return;
    setSel(+b.getAttribute('data-i'), true);
    lockPick();
  });
  function lockPick() {
    if (pick.st >= 2 || pick.busy) return;
    var era = ROSTER[CTL.squad.sel];
    if (pick.st === 1 && era === pick.a) { sfx('bonk'); return; }
    sfx('lock');
    if (pick.st === 0) {
      pick.a = era; opts.era = era;
      if (opts.mode === 'tour') {
        pick.st = 2; drawSquad();
        pick.busy = setTimeout(function () { pick.busy = null; show('ready'); }, 520);
        return;
      }
      pick.st = 1;
      var f = opts.foe && opts.foe !== era && READY.indexOf(opts.foe) >= 0 ? opts.foe : defaultFoe(era);
      setSel(ROSTER.indexOf(f), true);
    } else {
      pick.b = era; opts.foe = era; pick.st = 2;
      pick.busy = setTimeout(function () { pick.busy = null; saveOpts(); show('mapsel'); }, 520);
    }
    drawSquad();
  }
  function whoA() { return opts.mode === 'friend' ? 'P1' : 'YOU'; }
  function whoB() { return opts.mode === 'friend' ? 'P2' : 'CPU'; }
  function eraA() { return pick.st === 0 ? ROSTER[CTL.squad.sel] : pick.a; }
  function eraB() { return opts.mode === 'tour' ? null : (pick.st === 1 ? ROSTER[CTL.squad.sel] : (pick.st === 2 ? pick.b : null)); }
  var sideKey = {};
  function statRow(label, n) {
    var s = '';
    for (var i = 0; i < 5; i++) s += '<i class="' + (i < n ? 'on' : '') + '"></i>';
    return '<div class="stat"><span>' + label + '</span><span>' + s + '</span></div>';
  }
  function sideHtml(el, era, who, locked) {
    var key = era + '|' + who + '|' + locked + '|' + opts.mode;
    if (sideKey[el.id] === key) return;
    sideKey[el.id] = key;
    if (opts.mode === 'tour' && el.id === 'sideB') {
      el.className = 'side b';
      el.style.setProperty('--c', '#ffc24a');
      el.innerHTML = '<span class="who">TOUR</span><canvas class="big" width="38" height="34"></canvas><h3>Time Tour</h3><div class="era">' +
        yearLabel(MAPS[TOUR_STOPS[0]].year) + ' \u2192 ' + yearLabel(MAPS[TOUR_STOPS[TOUR_STOPS.length - 1]].year) + '</div><div class="kitrow tourrow"></div>';
      var row = el.querySelector('.tourrow');
      TOUR_STOPS.forEach(function (m) { row.appendChild(thumb(m, 'normal', 'tthumb')); });
      var bx = el.querySelector('.big').getContext('2d');
      bx.imageSmoothingEnabled = false; bx.drawImage(SP.glyph('tour'), 7, 5, 24, 24);
      return;
    }
    el.className = 'side ' + (el.id === 'sideA' ? 'a' : 'b') + (era ? '' : ' empty');
    if (!era) {
      el.style.setProperty('--c', '#433a85');
      el.innerHTML = '<span class="who">' + who + '</span><canvas class="big" width="38" height="34"></canvas><h3>???</h3>';
      var sx = el.querySelector('.big').getContext('2d');
      sx.drawImage(silhouette('#3a3278'), 3, 4);
      return;
    }
    var E = ER[era], st = E.stats || {}, T = tlInfo(era);
    el.style.setProperty('--c', E.tag);
    el.innerHTML = '<span class="who">' + who + '</span><canvas class="big" width="38" height="34" data-era="' + era + '"></canvas>' +
      '<h3>' + esc(E.team) + '</h3><div class="era">' + esc(T ? T.name : '') + ' \u00b7 ' + yearLabel(yearOf(era)) + '</div>' +
      '<div class="kitrow">' + (E.kit || []).map(function (wid) { return '<canvas width="12" height="12" data-icon="' + wid + '" title="' + esc(E.weapons[wid].name) + '"></canvas>'; }).join('') + '</div>' +
      '<div>' + statRow('Power', st.power || 0) + statRow('Precision', st.precision || 0) + statRow('Tricks', st.tricks || 0) + '</div>' +
      (locked ? '<span class="stampx">Locked in</span>' : '');
    Array.prototype.forEach.call(el.querySelectorAll('canvas[data-icon]'), function (c2) { SP.icon(c2.getContext('2d'), c2.getAttribute('data-icon'), era); });
  }
  function drawSquad() {
    var tour = opts.mode === 'tour', friend = opts.mode === 'friend';
    if (pick.st < 2) $('sqTitle').textContent = pick.st === 0 ? (friend ? 'Player 1, choose' : 'Choose your squad') : (friend ? 'Player 2, choose' : 'Choose your rivals');
    var ports = CTL.squad.items(), ia = pick.st === 0 ? CTL.squad.sel : ROSTER.indexOf(pick.a), ib = tour ? -1 : (pick.st === 1 ? CTL.squad.sel : (pick.st === 2 ? ROSTER.indexOf(pick.b) : -1));
    ports.forEach(function (p, i) {
      p.classList.toggle('hov', i === CTL.squad.sel && pick.st < 2);
      p.classList.toggle('p1', pick.st >= 1 && ROSTER[i] === pick.a);
      p.classList.toggle('taken', pick.st === 1 && ROSTER[i] === pick.a);
      var old = p.querySelectorAll('.flag');
      for (var k = 0; k < old.length; k++) old[k].remove();
      if (i === ia) p.insertAdjacentHTML('beforeend', '<em class="flag f1">' + whoA() + '</em>');
      if (i === ib) p.insertAdjacentHTML('beforeend', '<em class="flag f2">' + whoB() + '</em>');
    });
    sideHtml($('sideA'), eraA(), whoA(), pick.st >= 1);
    sideHtml($('sideB'), eraB(), tour ? 'TOUR' : whoB(), pick.st === 2);
    animSquad();
    var a = eraA(), b = eraB();
    $('tlText').textContent = a ? ER[a].team + ', ' + yearLabel(yearOf(a)) + (b ? ' versus ' + ER[b].team + ', ' + yearLabel(yearOf(b)) + '. About ' + yearsApart(yearOf(a), yearOf(b)).toLocaleString('en-GB') + ' years apart.' : '.') : '';
  }
  var animF = 0;
  function animSquad() {
    animF++;
    ROSTER.forEach(function (e, i) {
      var p = CTL.squad.items()[i];
      if (!p) return;
      var hot = (i === CTL.squad.sel && pick.st < 2) || ROSTER[i] === pick.a || ROSTER[i] === pick.b;
      drawSnagCv(p.querySelector('canvas'), e, hot ? 'cheer' : 'idle', hot ? animF % 2 : 0, i < ROSTER.length / 2 ? 1 : -1, animF % 9 === 0);
    });
    [['sideA', eraA(), 1, pick.st >= 1], ['sideB', eraB(), -1, pick.st === 2]].forEach(function (q) {
      var c2 = $(q[0]).querySelector('canvas.big[data-era]');
      if (c2 && q[1]) drawSnagCv(c2, q[1], q[3] ? 'cheer' : 'idle', animF % 2, q[2], animF % 11 === 0);
    });
  }

  /* the timeline strip: every era drawn to scale, a line across the gap, and a counter rolling up the years */
  var tlCv = $('tl'), TL0 = -12000, TL1 = 3400, NOW_Y = 2026;
  var gapLab = document.createElement('div');
  gapLab.id = 'gapLab'; gapLab.setAttribute('aria-hidden', 'true');
  $('squad').appendChild(gapLab);
  var gap = { key: '', from: 0, to: 0, t0: 0, shown: -1, lastTick: 0 };
  function tlX(yr) { return Math.round(12 + (yr - TL0) / (TL1 - TL0) * (tlCv.width - 24)); }
  function drawTL() {
    var x2 = tlCv.getContext('2d'), W = tlCv.width, base = 34, now = Date.now();
    x2.clearRect(0, 0, W, tlCv.height);
    x2.fillStyle = '#433a85'; x2.fillRect(4, base, W - 8, 2);
    [[-10000, '10000 BC'], [-5000, '5000 BC'], [1, 'AD 1']].forEach(function (tk) {
      var x = tlX(tk[0]); x2.fillStyle = '#5a50a0'; x2.fillRect(x, base, 1, 5);
      SP.text(x2, tk[1], x, base + 8, '#8a80c8', null, true);
    });
    var nx = tlX(NOW_Y);
    x2.fillStyle = '#ef7724'; x2.fillRect(nx, base - 3, 1, 8);
    SP.text(x2, 'NOW', nx, base + 8, '#ef7724', null, true);
    /* eras still to come: dim silhouettes and a padlock */
    var locked = TL.filter(function (e) { return !e.ready || !ER[e.id]; }), lx = 0;
    x2.globalAlpha = 0.55;
    locked.forEach(function (e) { var x = tlX(e.year); x2.drawImage(silhouette('#2e2860'), x - 16, base - 29); lx += x; });
    x2.globalAlpha = 1;
    var a = eraA(), b = eraB();
    ROSTER.forEach(function (e) {
      var x = tlX(yearOf(e)), on = e === a || e === b, f = on ? (Math.floor(now / 260) % 2) : 0;
      SP.draw(x2, x, base, x < W / 2 ? 1 : -1, e, on ? 'cheer' : 'idle', f, false, 0, on ? 1 : 0.55);
      var tw = SP.textWidth(ER[e].team), tx = clamp(x, tw / 2 + 2, W - tw / 2 - 2);
      if (on) SP.text(x2, ER[e].team, tx, 0, e === a ? '#5fe0f0' : '#ef7724', '#0e0b22', true);
    });
    /* the gap: a marching line between the two picks, or between your pick and now */
    var ya = a ? yearOf(a) : null, yb = b ? yearOf(b) : (a ? NOW_Y : null);
    if (ya === null) { gapLab.hidden = true; return; }
    var xa = tlX(ya), xb = tlX(yb), lo = Math.min(xa, xb), hi = Math.max(xa, xb), y = base + 6, off = Math.floor(now / 70) % 4;
    x2.fillStyle = '#ffc24a';
    for (var x = lo + 2 + off; x < hi - 1; x += 4) x2.fillRect(x, y, 2, 1);
    x2.fillRect(lo, y - 2, 1, 5); x2.fillRect(hi, y - 2, 1, 5);
    var key = ya + '|' + yb, n = yearsApart(ya, yb);
    if (key !== gap.key) { gap.key = key; gap.from = gap.shown < 0 ? 0 : gap.shown; gap.to = n; gap.t0 = now; }
    var k = reduceMotion ? 1 : Math.min(1, (now - gap.t0) / 700), e2 = 1 - Math.pow(1 - k, 3);
    var val = Math.round((gap.from + (gap.to - gap.from) * e2) / 100) * 100;
    if (val !== gap.shown) {
      gap.shown = val;
      if (k < 1 && now - gap.lastTick > 45) { gap.lastTick = now; sfx('tick'); }
      gapLab.textContent = val.toLocaleString('en-GB') + ' years ' + (b ? 'apart' : (yb > ya ? 'ago' : 'ahead'));
    }
    gapLab.hidden = false;
    gapLab.style.left = (64 + (lo + hi) / 2 * (1152 / W)) + 'px';
  }
  tlCv.addEventListener('click', function (e) {
    if (pick.st >= 2) return;
    var rc = tlCv.getBoundingClientRect(), x = (e.clientX - rc.left) / rc.width * tlCv.width, best = -1, bd = 1e9;
    ROSTER.forEach(function (er, i) { var d = Math.abs(tlX(yearOf(er)) - x); if (d < bd) { bd = d; best = i; } });
    if (best >= 0 && bd < 30) setSel(best);
  });

  /* ---------- battlefield select: the live battlefield behind is the preview ---------- */
  var MAPLIST = MAP_IDS.slice().sort(function (a, b) { return MAPS[a].year - MAPS[b].year; }).concat(['random']);
  var prevT = null, prevMap = '';
  function buildMapCards() {
    $('mCards').innerHTML = MAPLIST.map(function (m, i) {
      return '<button class="mcard' + (m === 'random' ? ' rand' : '') + '" data-i="' + i + '"><canvas width="64" height="36"></canvas><span>' + (m === 'random' ? 'Random' : esc(MAPS[m].name)) + '</span></button>';
    }).join('');
    Array.prototype.forEach.call(document.querySelectorAll('#mCards .mcard'), function (b, i) {
      var c2 = b.querySelector('canvas'), m = MAPLIST[i];
      if (m === 'random') { var x2 = c2.getContext('2d'); x2.imageSmoothingEnabled = false; x2.drawImage(SP.glyph('dice'), 20, 6, 24, 24); }
      else SP.mapThumb(c2, MAPS[m], 'normal');
    });
  }
  function previewMap(id) {
    if (id === 'random') id = MAP_IDS[Math.floor(Math.random() * MAP_IDS.length)];
    if (prevMap === id) return;
    if (prevT) clearTimeout(prevT);
    prevT = setTimeout(function () { prevT = null; prevMap = id; startDemo(id); }, 140);
  }
  CTL.mapsel = {
    sel: 0,
    items: function () { return [].slice.call(document.querySelectorAll('#mCards .mcard')); },
    enter: function () {
      if (!$('mCards').children.length) buildMapCards();
      prevMap = MAP.id;
      CTL.mapsel.sel = Math.max(0, MAPLIST.indexOf(opts.map || 'jungle'));
    },
    lr: function (d) { setSel(CTL.mapsel.sel + d); },
    onSel: function (el, i) {
      opts.map = MAPLIST[i];
      $('mName').textContent = opts.map === 'random' ? 'Random' : MAPS[opts.map].name;
      previewMap(opts.map);
    },
    ok: function () { saveOpts(); show('ready'); },
    back: function () { pick.keep = 1; show('squad'); }
  };
  $('mCards').addEventListener('click', function (e) {
    var b = e.target.closest('.mcard');
    if (!b) return;
    setSel(+b.getAttribute('data-i'), true);
    saveOpts(); show('ready');
  });

  /* ---------- ready: the matchup, the rules and the names ---------- */
  var RULES = [
    { k: 'mood', label: 'Computer', vals: ['sleepy', 'grumpy', 'legendary'], wrap: true, show: function () { return opts.mode !== 'friend'; }, fmt: function (v) { return gl(v, 'sm') + ' ' + MOODS[v]; } },
    { k: 'size', label: 'Snags each', vals: [2, 3, 4, 5, 6, 7, 8], fmt: String },
    { k: 'turn', label: 'Turn timer', vals: [30, 45, 60, 90, 0], fmt: function (v) { return v ? v + 's' : 'No timer'; } },
    { k: 'sd', label: 'Sudden Death', vals: ['on', 'off'], wrap: true, fmt: function (v) { return v === 'on' ? 'On' : 'Off'; } },
    { k: 'skinA', label: 'Look', vals: lookVals, wrap: true, look: true, fmt: function (v) { var n = unlocked().length; return lookName(v) + (n < LOOKS.length ? ' <i class="more">' + (LOOKS.length - n) + gl('lock', 'sm') + '</i>' : ''); } },
    { k: 'skinB', label: 'P2 look', vals: lookVals, wrap: true, look: true, show: function () { return opts.mode === 'friend'; }, fmt: function (v) { return lookName(v); } }
  ];
  function ruleOf(k) { for (var i = 0; i < RULES.length; i++) if (RULES[i].k === k) return RULES[i]; return null; }
  function renderRules() {
    $('rules').innerHTML = RULES.filter(function (r) { return !r.show || r.show(); }).map(function (r) {
      return '<div class="rule mi" data-k="' + r.k + '"><span>' + r.label + '</span><span class="val"><button class="arr" data-d="-1" aria-label="Less">&lt;</button><b>' +
        r.fmt(opts[r.k]) + '</b><button class="arr" data-d="1" aria-label="More">&gt;</button></span></div>';
    }).join('');
    SP.paintGlyphs($('rules'));
  }
  function stepRule(k, d) {
    var r = ruleOf(k);
    if (!r) return;
    var V = typeof r.vals === 'function' ? r.vals() : r.vals;
    var i = V.indexOf(opts[k]);
    if (i < 0) i = 0;
    var j = r.wrap ? (i + d + V.length) % V.length : clamp(i + d, 0, V.length - 1);
    if (j === i) { sfx('bonk'); return; }
    opts[k] = V[j]; saveOpts(); sfx('blip');
    var el = document.querySelector('#rules .rule[data-k="' + k + '"] b');
    if (el) { el.innerHTML = r.fmt(opts[k]); SP.paintGlyphs(el); }
    if (k === 'size' || k === 'mood' || r.look) renderReadySides();
  }
  function namesFor(era) {
    opts.names = opts.names || {};
    var list = opts.names[era] = (opts.names[era] || []).slice(0, 8);
    while (list.length < opts.size) list.push(genName(era));
    return list;
  }
  function readySide(el, era, who, human, face, skin) {
    var E = ER[era], h = '<h3>' + esc(E.team) + '</h3><canvas class="big" width="36" height="32"></canvas><p class="rwho">' + who + '</p>';
    if (human) {
      var list = namesFor(era);
      for (var i = 0; i < opts.size; i++) {
        h += '<div class="nrow"><input data-era="' + era + '" data-i="' + i + '" maxlength="10" value="' + esc(list[i]) + '" aria-label="Snag ' + (i + 1) + ' name">' +
          '<button data-roll="' + era + '" data-i="' + i + '" aria-label="Roll a name" title="Roll a name">' + gl('dice') + '</button></div>';
      }
    } else h += '<div class="nrow"><span class="auto">' + gl(opts.mood, 'sm') + ' ' + MOODS[opts.mood] + ' \u00b7 ' + opts.size + ' ' + gl('snag', 'sm') + '</span></div>';
    el.style.setProperty('--c', E.tag);
    el.innerHTML = h;
    SP.paintGlyphs(el);
    drawSnagCv(el.querySelector('canvas.big'), era, 'cheer', 0, face, false, skin);
  }
  function renderReadySides() {
    var tour = opts.mode === 'tour';
    readySide($('rA'), opts.era, opts.mode === 'friend' ? 'Player 1' : 'You', true, 1, skinOf(opts.skinA));
    if (tour) {
      var rb = $('rB');
      rb.style.setProperty('--c', '#ffc24a');
      rb.innerHTML = '<h3>Time Tour</h3><div class="tourmini"></div>';
      TOUR_STOPS.forEach(function (m) { var c2 = thumb(m, 'normal', ''); c2.title = MAPS[m].name; rb.querySelector('.tourmini').appendChild(c2); });
    } else readySide($('rB'), foeOf(opts), opts.mode === 'friend' ? 'Player 2' : 'Computer', opts.mode === 'friend', -1, opts.mode === 'friend' ? skinOf(opts.skinB) : null);
  }
  CTL.ready = {
    sel: 99, wrap: false,
    items: function () { return [].slice.call(document.querySelectorAll('#rules .rule')).concat([$('bStart')]); },
    enter: function () {
      renderRules(); renderReadySides();
      var tour = opts.mode === 'tour', rm = $('rMap');
      document.querySelector('#ready .rmap').hidden = tour;
      if (!tour) {
        if (opts.map === 'random') { var x2 = rm.getContext('2d'); x2.fillStyle = '#24204a'; x2.fillRect(0, 0, 64, 36); x2.imageSmoothingEnabled = false; x2.drawImage(SP.glyph('dice'), 20, 6, 24, 24); }
        else SP.mapThumb(rm, MAPS[opts.map], 'normal');
        $('rMapName').textContent = opts.map === 'random' ? 'Random' : MAPS[opts.map].name;
      }
      $('bStart').textContent = tour ? 'Start Tour' : 'Start Battle';
      CTL.ready.sel = 99;
    },
    lr: function (d) { var el = selected(); if (el && el.classList.contains('rule')) stepRule(el.getAttribute('data-k'), d); },
    ok: function (el) { if (!el) return; if (el.id === 'bStart') startBattle(); else stepRule(el.getAttribute('data-k'), 1); },
    back: function () {
      if (opts.mode === 'tour') { pick.keep = 0; show('squad'); }
      else show('mapsel');
    }
  };
  $('rules').addEventListener('click', function (e) {
    var b = e.target.closest('.arr'), row = e.target.closest('.rule');
    if (!row) return;
    if (b) stepRule(row.getAttribute('data-k'), +b.getAttribute('data-d'));
  });
  $('bStart').addEventListener('click', startBattle);
  ['rA', 'rB'].forEach(function (id) {
    $(id).addEventListener('input', function (e) {
      var inp2 = e.target.closest('input');
      if (!inp2) return;
      var clean = cleanName(inp2.value);
      if (clean !== inp2.value.trim()) inp2.value = clean;
      namesFor(inp2.getAttribute('data-era'))[+inp2.getAttribute('data-i')] = clean;
      saveOpts();
    });
    $(id).addEventListener('click', function (e) {
      var b = e.target.closest('button[data-roll]');
      if (!b) return;
      var era = b.getAttribute('data-roll'), i = +b.getAttribute('data-i'), list = namesFor(era);
      list[i] = genName(era);
      var inp2 = $(id).querySelector('input[data-era="' + era + '"][data-i="' + i + '"]');
      if (inp2) inp2.value = list[i];
      sfx('twinkle'); saveOpts();
    });
  });
  function startBattle() {
    saveOpts(); store('save', null);
    if (opts.mode === 'tour') {
      game.tour = { era: opts.era, mood: opts.mood, size: opts.size, turn: opts.turn, sd: opts.sd, names: opts.names, skin: skinOf(opts.skinA), stop: 0, results: [] };
      saveTour();
      openTour();
      return;
    }
    var map = opts.map === 'random' || !MAPS[opts.map] ? MAP_IDS[Math.floor(Math.random() * MAP_IDS.length)] : opts.map;
    wipe(function () { newMatch({ mode: opts.mode, mood: opts.mood, era: opts.era, foe: opts.foe, size: opts.size, turn: opts.turn, sd: opts.sd, map: map, names: opts.names, skinA: skinOf(opts.skinA), skinB: skinOf(opts.skinB) }); });
  }

  /* ---------- options ---------- */
  var optTab = 'sound', TABS = ['sound', 'display', 'controls', 'game'];
  var OPTROWS = {
    sound: [{ k: 'mv', label: 'Music', type: 'vol' }, { k: 'sv', label: 'Effects', type: 'vol' }, { k: 'jv', label: "Jay's voice", type: 'vol' }],
    display: [{ k: 'fs', label: 'Fullscreen', type: 'tog' }, { k: 'shake', label: 'Screen shake', type: 'tog' }, { k: 'zoom', label: 'Zoom', type: 'pick' }],
    game: [{ k: 'jay', label: 'Jay on commentary', type: 'tog' }, { k: 'touch', label: 'On screen buttons', type: 'tog' }]
  };
  function isFull() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  function optVal(r) {
    if (r.type === 'vol') { var n = aud[r.k], s = ''; for (var i = 0; i < 10; i++) s += '<i class="' + (i < n ? 'on' : '') + '"></i>'; return '<span class="slider">' + s + '</span>'; }
    if (r.k === 'zoom') return ZOOM_NAMES[zoom];
    var on = r.k === 'fs' ? isFull() : r.k === 'shake' ? shakeOn : r.k === 'jay' ? jayOn : touchOn;
    return on ? 'On' : 'Off';
  }
  function renderOpts() {
    Array.prototype.forEach.call(document.querySelectorAll('#optTabs .mi'), function (b) { b.classList.toggle('on', b.getAttribute('data-tab') === optTab); });
    Array.prototype.forEach.call(document.querySelectorAll('#options .pane'), function (p) { p.classList.toggle('on', p.getAttribute('data-pane') === optTab); });
    ['sound', 'display', 'game'].forEach(function (t) {
      $('pane' + t.charAt(0).toUpperCase() + t.slice(1)).innerHTML = OPTROWS[t].map(function (r) {
        return '<div class="rule mi" data-k="' + r.k + '"><span>' + r.label + '</span><span class="val"><button class="arr" data-d="-1" aria-label="Less">&lt;</button><b>' + optVal(r) + '</b><button class="arr" data-d="1" aria-label="More">&gt;</button></span></div>';
      }).join('');
    });
  }
  function optRow(k) { for (var t in OPTROWS) for (var i = 0; i < OPTROWS[t].length; i++) if (OPTROWS[t][i].k === k) return OPTROWS[t][i]; return null; }
  function optStep(k, d) {
    var r = optRow(k);
    if (!r) return;
    audioInit();
    if (r.type === 'vol') {
      var v = clamp(aud[k] + d, 0, 10);
      if (v === aud[k]) { sfx('bonk'); return; }
      aud[k] = v; applyAudio();
      if (k === 'jv') voice('jay', 'turn'); else sfx('blip');
    } else if (k === 'zoom') setZoom(zoom + d);
    else {
      if (k === 'fs') {
        var el = document.documentElement;
        try {
          if (isFull()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
          else { var p = (el.requestFullscreen || el.webkitRequestFullscreen).call(el); if (p && p.catch) p.catch(function () { /* not allowed here */ }); }
        } catch (e) { /* not allowed here */ }
      } else if (k === 'shake') { shakeOn = !shakeOn; store('shake', shakeOn ? '1' : '0'); }
      else if (k === 'jay') { jayOn = !jayOn; store('jay', jayOn ? '1' : '0'); if (!jayOn) $('jay').hidden = true; }
      else if (k === 'touch') { touchOn = !touchOn; store('touch', touchOn ? '1' : '0'); inMatch(matchOn); }
      sfx('blip');
    }
    var b = document.querySelector('#options .rule[data-k="' + k + '"] b');
    if (b) b.innerHTML = optVal(r);
  }
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (ev) {
    document.addEventListener(ev, function () { var b = document.querySelector('#options .rule[data-k="fs"] b'); if (b) b.innerHTML = optVal(optRow('fs')); fitStage(); });
  });
  function switchTab(t) { optTab = t; renderOpts(); CTL.options.sel = 0; setSel(0, true); sfx('blip'); }
  CTL.options = {
    sel: 0, wrap: false,
    items: function () { return [document.querySelector('#optTabs [data-tab="' + optTab + '"]')].concat([].slice.call(document.querySelectorAll('#options .pane.on .rule'))); },
    enter: function () { renderOpts(); CTL.options.sel = 0; },
    lr: function (d) {
      if (CTL.options.sel === 0) switchTab(TABS[(TABS.indexOf(optTab) + d + TABS.length) % TABS.length]);
      else { var el = selected(); if (el) optStep(el.getAttribute('data-k'), d); }
    },
    ok: function (el) { if (el && el.classList.contains('rule')) optStep(el.getAttribute('data-k'), 1); },
    back: function () { show(retOf.options || 'main'); }
  };
  $('optTabs').addEventListener('click', function (e) { var b = e.target.closest('[data-tab]'); if (b) switchTab(b.getAttribute('data-tab')); });
  $('options').addEventListener('click', function (e) {
    var b = e.target.closest('.arr'), row = e.target.closest('.rule');
    if (row && b) optStep(row.getAttribute('data-k'), +b.getAttribute('data-d'));
  });
  function openOptions(from) { retOf.options = from; show('options'); }

  /* ---------- how to play: a wordless comic strip ---------- */
  CTL.help = {
    enter: function () { drawComic(); },
    ok: function () { CTL.help.back(); },
    back: function () { show(retOf.help || 'main'); }
  };
  function openHelp(from) { retOf.help = from; show('help'); }

  /* ---------- pause ---------- */
  CTL.pause = {
    sel: 0,
    items: function () { return [].slice.call(document.querySelectorAll('#pList .mi')); },
    back: function () { hideOv(); }
  };
  $('pList').addEventListener('click', function (e) {
    var b = e.target.closest('.mi');
    if (!b) return;
    var a = b.getAttribute('data-act');
    if (a === 'resume') hideOv();
    else if (a === 'options') openOptions('pause');
    else if (a === 'help') openHelp('pause');
    else if (a === 'museum') openMuseum('pause');
    else if (a === 'quit') { if (game.state === 'play') saveMatch(); toMenu(); }
  });
  function openPause() {
    if (!matchOn || game.state === 'demo' || game.state === 'over') return;
    CTL.pause.sel = 0;
    show('pause', true);
  }
  $('bPause').addEventListener('click', function () { audioInit(); openPause(); });

  /* ---------- the find card ---------- */
  function paintArt(cv2, id, dark) {
    var x2 = cv2.getContext('2d');
    cv2.width = 12; cv2.height = 12;
    x2.clearRect(0, 0, 12, 12);
    x2.drawImage(SP.artCanvas(id), 0, 0);
    if (dark) { x2.globalCompositeOperation = 'source-in'; x2.fillStyle = '#3d3577'; x2.fillRect(0, 0, 12, 12); x2.globalCompositeOperation = 'source-over'; }
  }
  function showFind(info, isNew) {
    if (game.state === 'demo' || !matchOn) return;
    paintArt($('findArt'), info.id, false);
    $('findKick').innerHTML = info.glitch ? gl('glitch', 'big') : gl('museum', 'big') + (isNew ? 'New!' : gl('check'));
    SP.paintGlyphs($('findKick'));
    $('findName').textContent = info.name;
    $('findMeta').textContent = info.glitch ? '?!' : info.when + ', ' + info.where;
    $('findFact').textContent = info.fact;
    $('findNow').innerHTML = info.now ? gl('pin') + '<span>' + esc(info.now) + '</span>' : '';
    if (info.now) SP.paintGlyphs($('findNow'));
    $('findNow').hidden = !info.now;
    $('findCard').classList.toggle('glitch', !!info.glitch);
    show('find', true);
  }
  CTL.find = { sel: 0, items: function () { return [$('bFindClose')]; }, ok: function () { hideOv(); }, back: function () { hideOv(); } };
  $('bFindClose').addEventListener('click', hideOv);

  /* ---------- the Time Museum: a collection grid with a detail card ---------- */
  var SHELVES = MAP_IDS.slice().sort(function (a, b) { return MAPS[a].year - MAPS[b].year; }), musTab = 0;
  function musList() { var m = SHELVES[musTab]; return realOf(m).concat(glitchOf(m)); }
  function renderMuseum() {
    var real = [], glx = [];
    MAP_IDS.forEach(function (m) { real = real.concat(realOf(m)); glx = glx.concat(glitchOf(m)); });
    $('musSub').innerHTML = '<span title="Real finds">' + gl('museum') + museumCount(real) + '/' + real.length + '</span><span title="Glitches in time">' + gl('glitch') + museumCount(glx) + '/' + glx.length + '</span>';
    $('musTabs').innerHTML = SHELVES.map(function (m, i) {
      var all = realOf(m).concat(glitchOf(m));
      return '<button class="mi' + (i === musTab ? ' on' : '') + '" data-shelf="' + i + '">' + esc(MAPS[m].name) + ' <b>' + museumCount(all) + '/' + all.length + '</b></button>';
    }).join('');
    $('musShelves').innerHTML = musList().map(function (a, i) {
      var got = !!museum.found[a.id];
      return '<button class="case' + (got ? ' got' : '') + (a.glitch ? ' gl' : '') + '" data-i="' + i + '" aria-label="' + esc(got ? a.name : 'Not found yet') + '"><canvas width="12" height="12"></canvas></button>';
    }).join('');
    Array.prototype.forEach.call(document.querySelectorAll('#musShelves .case'), function (b, i) { var a = musList()[i]; paintArt(b.querySelector('canvas'), a.id, !museum.found[a.id]); });
    SP.paintGlyphs($('museum'));
  }
  function musDetail(a) {
    var d = $('musDetail');
    if (!a) { d.innerHTML = ''; return; }
    var got = museum.found[a.id];
    if (!got) { d.innerHTML = '<div class="q">?</div>'; return; }
    var lab = museum.labels[a.id];
    d.innerHTML = '<canvas class="bigart" width="12" height="12"></canvas><h3>' + esc(a.name) + '</h3><p class="meta">' + esc(a.glitch ? '?!' : a.when + ', ' + a.where) + '</p>' +
      '<p>' + esc(a.fact) + '</p>' + (a.now ? '<p class="now">' + gl('pin') + '<span>' + esc(a.now) + '</span></p>' : '') +
      (lab ? '<p class="lab">' + gl('tag', 'sm') + ' ' + esc(lab) + '</p>' : '') +
      '<p class="meta">' + gl('snag', 'sm') + ' ' + esc(got.by || 'a Snag') + '</p>' +
      '<button class="btn" id="bMusLabel" data-id="' + a.id + '">' + gl('tag') + (lab ? 'Edit label' : 'Label') + '</button>';
    paintArt(d.querySelector('.bigart'), a.id, false);
    SP.paintGlyphs(d);
  }
  function musShelf(d) { musTab = (musTab + d + SHELVES.length) % SHELVES.length; CTL.museum.sel = 0; renderMuseum(); setSel(0, true); sfx('blip'); }
  CTL.museum = {
    sel: 0, cols: 6, wrap: false,
    items: function () { return [].slice.call(document.querySelectorAll('#musShelves .case')); },
    enter: function () { renderMuseum(); },
    onSel: function (el, i) { musDetail(musList()[i]); },
    key: function (e) {
      if (e.code === 'KeyQ' || e.code === 'PageUp') { musShelf(-1); return true; }
      if (e.code === 'KeyE' || e.code === 'PageDown') { musShelf(1); return true; }
      return false;
    },
    ok: function () { var a = musList()[CTL.museum.sel]; if (a && museum.found[a.id]) openLabel('museum', a.id); else sfx('bonk'); },
    back: function () { show(retOf.museum || 'main'); }
  };
  $('musTabs').addEventListener('click', function (e) { var b = e.target.closest('[data-shelf]'); if (b) { musTab = +b.getAttribute('data-shelf'); CTL.museum.sel = 0; renderMuseum(); setSel(0, true); } });
  $('musShelves').addEventListener('click', function (e) { var b = e.target.closest('.case'); if (b) setSel(+b.getAttribute('data-i'), true); });
  $('musDetail').addEventListener('click', function (e) { var b = e.target.closest('#bMusLabel'); if (b) openLabel('museum', b.getAttribute('data-id')); });
  function openMuseum(from) { retOf.museum = from; show('museum'); }

  /* ---------- make a museum label ---------- */
  var lblPick = null;
  var STARTERS = ['I think this was used for', 'If I took this back in time', 'The weirdest thing about it is', 'I would keep it because'];
  function foundList() { return allArts().filter(function (a) { return museum.found[a.id]; }); }
  function openLabel(from, id) {
    var list = foundList();
    if (!list.length) return;
    retOf.label = from;
    var fresh = list.filter(function (a) { return game.finds.indexOf(a.id) >= 0; });
    lblPick = id && museum.found[id] ? id : (fresh[0] || list[0]).id;
    $('lblText').value = museum.labels[lblPick] || '';
    renderLabel();
    mountSend();
    show('label');
  }
  CTL.label = { back: function () { show(retOf.label || 'main'); } };
  var sendMounted = false;
  function museumReport() {
    var info = artInfo(lblPick), txt = $('lblText').value.trim();
    var realAll = [], glAll = [];
    MAP_IDS.forEach(function (m) { realAll = realAll.concat(realOf(m)); glAll = glAll.concat(glitchOf(m)); });
    var real = realAll.filter(function (a) { return museum.found[a.id]; }).map(function (a) { return a.name; });
    var gls = glAll.filter(function (a) { return museum.found[a.id]; }).map(function (a) { return a.name; });
    return [
      'Museum label for: ' + info.name + (info.glitch ? ' (glitch in time)' : ' (' + info.when + ', ' + info.where + ')'),
      'My label: ' + (txt || '(left blank)'),
      '',
      'My Time Museum so far:',
      'Real finds (' + real.length + ' of ' + realAll.length + '): ' + (real.join(', ') || 'none yet'),
      'Glitches in time (' + gls.length + ' of ' + glAll.length + '): ' + (gls.join(', ') || 'none yet')
    ].join('\n');
  }
  function mountSend() {
    if (sendMounted) return;
    var B = window.Base5Send;
    if (!B || !B.mount) return;
    B.mount($('lblSend'), { tool: 'Timeline Tantrum museum label', getText: museumReport, filename: 'museum-label' });
    sendMounted = true;
  }
  function renderLabel() {
    $('lblFinds').innerHTML = foundList().map(function (a) {
      return '<button data-id="' + a.id + '" class="' + (a.id === lblPick ? 'on' : '') + '">' + esc(a.name) + '</button>';
    }).join('');
    $('lblStarters').innerHTML = STARTERS.map(function (s) { return '<button data-s="' + esc(s) + '">' + esc(s) + '...</button>'; }).join('');
    drawLabelCard();
  }
  function wrapText(x2, text, x, y, maxW, lh, maxLines) {
    var words = text.split(/\s+/), line = '', n = 0;
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + ' ' + words[i] : words[i];
      if (x2.measureText(test).width > maxW && line) {
        x2.fillText(line, x, y + n * lh); n++; line = words[i];
        if (n >= maxLines - 1) { line = words.slice(i).join(' '); break; }
      } else line = test;
    }
    if (line) { while (x2.measureText(line).width > maxW && line.length > 3) line = line.slice(0, -2); x2.fillText(line, x, y + n * lh); }
  }
  function drawLabelCard() {
    var cvL = $('lblCard'), x2 = cvL.getContext('2d'), info = artInfo(lblPick), txt = $('lblText').value.trim();
    var W = cvL.width, H = cvL.height;
    x2.fillStyle = '#fef8f4'; x2.fillRect(0, 0, W, H);
    x2.fillStyle = info.glitch ? '#e6f6f9' : '#f3e6d6'; x2.fillRect(16, 16, 150, 150);
    x2.strokeStyle = '#1f2a30'; x2.lineWidth = 4; x2.strokeRect(2, 2, W - 4, H - 4);
    x2.imageSmoothingEnabled = false;
    x2.drawImage(SP.artCanvas(lblPick), 31, 31, 120, 120);
    x2.fillStyle = '#ef7724'; x2.font = '700 13px "Atkinson Hyperlegible", sans-serif';
    x2.fillText(info.glitch ? 'GLITCH IN TIME' : 'TIME MUSEUM', 186, 34);
    x2.fillStyle = '#007291'; x2.font = '800 24px Archivo, sans-serif';
    wrapText(x2, info.name, 186, 62, W - 204, 26, 2);
    x2.fillStyle = '#4a5a62'; x2.font = '400 14px "Atkinson Hyperlegible", sans-serif';
    x2.fillText(info.glitch ? 'Out of time' : info.when, 186, 116);
    if (!info.glitch) x2.fillText(info.where, 186, 134);
    x2.fillStyle = '#1f2a30'; x2.font = '400 17px "Atkinson Hyperlegible", sans-serif';
    wrapText(x2, txt ? '"' + txt + '"' : 'Your words go here.', 16, 196, W - 32, 22, 3);
    x2.fillStyle = '#7a6a5c'; x2.font = '400 12px "Atkinson Hyperlegible", sans-serif';
    x2.fillText('Timeline Tantrum \u00b7 Base 5', 16, H - 12);
  }
  $('lblFinds').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    lblPick = b.getAttribute('data-id');
    $('lblText').value = museum.labels[lblPick] || '';
    renderLabel();
  });
  $('lblStarters').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var t2 = $('lblText');
    t2.value = (t2.value ? t2.value.replace(/\s*$/, ' ') : '') + b.getAttribute('data-s') + ' ';
    t2.focus(); drawLabelCard();
  });
  $('lblText').addEventListener('input', drawLabelCard);
  $('bLblSave').addEventListener('click', function () {
    var v = $('lblText').value.trim();
    if (v) museum.labels[lblPick] = v; else delete museum.labels[lblPick];
    saveMuseum();
    $('lblSaved').textContent = v ? 'Saved in the museum.' : 'Label cleared.';
    setTimeout(function () { $('lblSaved').textContent = ''; }, 2500);
  });
  function savePng(canvasId, name, msgId) {
    try {
      $(canvasId).toBlob(function (b) {
        if (!b) return;
        var a = document.createElement('a');
        a.href = URL.createObjectURL(b); a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
        $(msgId).textContent = 'Picture saved, if your device allows downloads.';
      });
    } catch (e) { $(msgId).textContent = 'This device would not save the picture.'; }
  }
  $('bLblPic').addEventListener('click', function () { savePng('lblCard', 'museum-label-' + lblPick + '.png', 'lblSaved'); });

  /* ---------- victory: the winners in a spotlight ---------- */
  var podiumT = null;
  function drawPodium() {
    var cv2 = $('overArt'), x2 = cv2.getContext('2d'), W = cv2.width, H = cv2.height, w = game.winner;
    x2.clearRect(0, 0, W, H);
    var squad = w ? w.members.slice(0, 8) : game.teams.map(function (t) { return t.members[0]; }).filter(Boolean);
    var n = squad.length, gap2 = Math.min(30, (W - 30) / Math.max(1, n)), f = (Date.now() / 260 | 0) % 2;
    squad.forEach(function (m, i) {
      var x = Math.round(W / 2 + (i - (n - 1) / 2) * gap2), era = m.team.era, h = w ? (m.alive ? 10 : 5) : 6;
      x2.fillStyle = '#0e0b22'; x2.fillRect(x - 11, H - h - 1, 23, h + 1);
      x2.fillStyle = ER[era].tag; x2.fillRect(x - 10, H - h, 21, h);
      x2.fillStyle = 'rgba(0,0,0,.25)'; x2.fillRect(x - 10, H - 2, 21, 2);
      SP.draw(x2, x, H - h, i < n / 2 ? 1 : -1, era, w ? (m.alive ? 'cheer' : 'idle') : 'yawn', (f + i) % 2, false, 0);
    });
    if (podiumT) clearTimeout(podiumT);
    podiumT = setTimeout(function () { podiumT = null; if (scr === 'victory' && !reduceMotion) drawPodium(); }, 260);
  }
  function showOver() {
    if (game.state !== 'over') return;
    var w = game.winner, o = game.opts || {}, title;
    if (!w) title = 'Draw!';
    else if (o.mode === 'cpu' && w.ctrl === 'ai' && TEST !== 'aivai') title = 'Computer wins';
    else if (o.mode === 'friend') title = w.label + ' wins!';
    else title = w.name + ' win!';
    $('overTitle').textContent = title;
    $('overTitle').style.setProperty('--c', w ? ER[w.era].tag : '#fef8f4');
    if (o.tour && game.tour) {
      var T = game.tour;
      var me = game.teams[0], alive = me.members.filter(function (m) { return m.alive; }).length, all = me.members.length;
      var medal = w === me ? (alive === all ? 'gold' : (alive * 2 >= all ? 'silver' : 'bronze')) : null;
      T.results[T.stop] = { map: TOUR_STOPS[T.stop], winner: w ? w.era : null, medal: medal };
      if (T.stop === TOUR_STOPS.length - 1 && T.results.every(function (r) { return r && r.winner === T.era; }) && !TEST) bumpStat('tourGold');
      saveTour();
      snapShot();
    }
    drawPodium();
    sfx(!w || (o.mode === 'cpu' && w.ctrl === 'ai' && TEST !== 'aivai') ? 'lose' : 'win'); duck(0.2, 2.5);
    show('victory', true);
  }
  CTL.victory = { key: function (e) { if (/^(F\d+|Shift|Control|Alt|Meta|Tab)/.test(e.code)) return false; if (!e.repeat) show('results'); return true; } };
  $('victory').addEventListener('click', function () { show('results'); });

  /* ---------- results: who did what ---------- */
  function renderResults() {
    var best = null;
    game.snags.forEach(function (m) { if ((m.dealt || 0) > 0 && (!best || m.dealt > best.dealt)) best = m; });
    var h = '<tr><th>Snag</th><th>Damage</th><th>Best hit</th><th>Finds</th><th>Health</th></tr>';
    game.teams.forEach(function (t) {
      var left = t.members.filter(function (m) { return m.alive; }).length;
      h += '<tr class="team" style="--c:' + ER[t.era].tag + '"><td colspan="4">' + esc(t.name) + (t.label ? ' \u00b7 ' + esc(t.label) : '') + '</td><td>' + left + '/' + t.members.length + '</td></tr>';
      t.members.forEach(function (m) {
        h += '<tr class="' + (m.alive ? '' : 'out') + '"><td class="n">' + esc(m.name) + (m === best ? ' ' + gl('trophy', 'sm') : '') + '</td><td>' + (m.dealt || 0) + '</td><td>' + (m.best || 0) + '</td><td>' + (m.found || 0) + '</td><td>' + (m.alive ? m.hp : '--') + '</td></tr>';
      });
    });
    $('rTable').innerHTML = h;
    $('rTable').classList.toggle('tight', game.snags.length > 10);
    SP.paintGlyphs($('rTable'));
    var fl = game.finds.map(artInfo).filter(Boolean);
    if (fl.length) {
      $('overFinds').innerHTML = '<div class="finds">' + fl.map(function (a) {
        return '<span class="fd"><canvas width="12" height="12" data-art="' + a.id + '"></canvas>' + esc(a.name) + '</span>';
      }).join('') + '</div>';
      Array.prototype.forEach.call(document.querySelectorAll('#overFinds canvas'), function (c2) { paintArt(c2, c2.getAttribute('data-art'), false); });
      var withNow = fl.filter(function (a) { return a.now; })[0];
      $('overReal').innerHTML = withNow ? gl('pin') + '<span>' + esc(withNow.now) + '</span>' : '';
      $('overReal').hidden = !withNow;
      SP.paintGlyphs($('overReal'));
    } else { $('overFinds').innerHTML = ''; $('overReal').hidden = true; }
    var fresh = TEST ? [] : checkUnlocks(), ul = $('overUnlock');
    if (ul) {
      ul.innerHTML = '';
      ul.hidden = !fresh.length;
      fresh.forEach(function (L) {
        var d = document.createElement('div'); d.className = 'unlock';
        d.appendChild(headCanvas(game.teams[0].era, 'cheer', L.id));
        var b = document.createElement('b'); b.textContent = 'New look: ' + L.name; d.appendChild(b);
        ul.appendChild(d);
      });
      if (fresh.length) sfx('find');
    }
    var tourOn = !!(game.opts && game.opts.tour && game.tour);
    $('bLabel').hidden = foundList().length === 0;
    $('bNext').hidden = !(tourOn && game.tour.stop + 1 < TOUR_STOPS.length);
    $('bPostcard').hidden = !(tourOn && game.tour.stop + 1 >= TOUR_STOPS.length);
    $('bRematch').hidden = tourOn; $('bChange').hidden = tourOn;
    CTL.results.sel = 0;
  }
  CTL.results = {
    sel: 0,
    items: function () { return [].slice.call(document.querySelectorAll('#results .rbox .btn')); },
    enter: renderResults
  };
  $('bNext').addEventListener('click', function () { if (game.tour) { store('save', null); openTour(); } });
  $('bPostcard').addEventListener('click', function () { openPostcard('results'); });
  $('bRematch').addEventListener('click', function () { var o = game.opts; wipe(function () { newMatch(o); }); });
  $('bChange').addEventListener('click', function () {
    var mode = game.opts && game.opts.mode === 'friend' ? 'friend' : 'cpu';
    wipe(function () { inMatch(false); startDemo(); musicEra('title'); opts.mode = mode; pick.keep = 0; show('squad', true); });
  });
  $('bLabel').addEventListener('click', function () { openLabel('results'); });
  $('bSettings').addEventListener('click', toMenu);

  /* ---------- Time Tour: a campaign map of history ---------- */
  var TOUR_STOPS = MAP_IDS.slice().sort(function (a, b) { return MAPS[a].year - MAPS[b].year; });
  function saveTour() { store('tour', game.tour ? JSON.stringify(game.tour) : null); }
  function loadTourState() { try { return JSON.parse(store('tour') || 'null'); } catch (e) { return null; } }
  function tourFoe(stop, me) {
    var m = MAPS[TOUR_STOPS[stop]], home = m.era;
    return home !== me && READY.indexOf(home) >= 0 ? home : defaultFoe(me, m.year);
  }
  function rippleFor(stop) {
    if (!game.tour || stop === 0) return null;
    var prev = game.tour.results[stop - 1], map = TOUR_STOPS[stop];
    var r = RIPPLE[map] && prev && prev.winner ? RIPPLE[map][prev.winner] : null;
    return r || { look: 'normal', title: 'Nobody won the last stop', text: 'So history carried on exactly as planned.', postcard: 'Nobody changed history at one stop.', short: 'one stop left just as it was', ammo: null };
  }
  function playStop() {
    var T = game.tour, rip = rippleFor(T.stop);
    newMatch({ mode: 'cpu', mood: T.mood, era: T.era, foe: tourFoe(T.stop, T.era), size: T.size, turn: T.turn, sd: T.sd, map: TOUR_STOPS[T.stop], names: T.names, skinA: T.skin || null,
      look: rip ? rip.look : 'normal', ammoMods: rip ? rip.ammo : null, tour: true });
    if (rip) later(160, function () { banner('History changed!', null, '#ffc24a', 'tour'); });
  }
  /* the next stop to play, or -1 when the whole tour is done */
  function tourNext() {
    var T = game.tour;
    if (!T) return -1;
    if (T.results[T.stop] && T.stop + 1 < TOUR_STOPS.length) { T.stop++; saveTour(); }
    return T.results[T.stop] ? -1 : T.stop;
  }
  var TRACK = TL.slice().sort(function (a, b) { return a.year - b.year; }).map(function (e) {
    var m = null;
    MAP_IDS.forEach(function (id) { if (MAPS[id].era === e.id) m = id; });
    return e.ready && ER[e.id] && m ? { kind: 'stop', i: TOUR_STOPS.indexOf(m), map: m, e: e } : { kind: 'lock', e: e };
  }).filter(function (q) { return q.kind === 'stop'; });
  var newTourArm = false, newTourT = null;
  function renderTour() {
    var T = game.tour, nx = tourNext(), n = TOUR_STOPS.length;
    $('tourSub').innerHTML = T.results.filter(Boolean).length + '/' + n + ' ' + T.results.filter(function (r) { return r && r.medal; }).map(function (r) { return '<i class="medal ' + r.medal + '"></i>'; }).join('');
    $('track').innerHTML = TRACK.map(function (s, k) {
      if (s.kind === 'lock') return '<button class="stop mini locked" data-k="' + k + '"><canvas class="t" width="32" height="30"></canvas><h4>' + esc(s.e.name) + '</h4><span class="yr">' + yearLabel(s.e.year) + '</span></button>';
      var r = T.results[s.i], cls = r ? ' done' : (s.i === nx ? ' next' : ' later');
      return '<button class="stop' + cls + '" data-k="' + k + '"><canvas class="t" width="64" height="36"></canvas><h4>' + esc(MAPS[s.map].name) + '</h4><span class="yr">' + yearLabel(MAPS[s.map].year) + '</span><div class="res"></div></button>';
    }).join('');
    Array.prototype.forEach.call(document.querySelectorAll('#track .stop'), function (b) {
      var s = TRACK[+b.getAttribute('data-k')], c2 = b.querySelector('canvas.t');
      if (s.kind === 'lock') { var x2 = c2.getContext('2d'); x2.drawImage(silhouette('#433a85'), 0, 0); x2.drawImage(SP.glyph('lock'), 20, 0); return; }
      var r = T.results[s.i], prevDone = s.i > 0 && T.results[s.i - 1], look = prevDone ? rippleFor(s.i).look : 'normal';
      SP.mapThumb(c2, MAPS[s.map], look);
      var res = b.querySelector('.res');
      if (r) {
        if (r.winner) { res.appendChild(headCanvas(r.winner, 'cheer')); res.appendChild(document.createTextNode('Won')); } else res.innerHTML = gl('off') + 'Draw';
        if (r.medal) { var md = document.createElement('i'); md.className = 'medal ' + r.medal; md.title = r.medal; res.appendChild(md); }
      }
      else if (s.i === nx) res.innerHTML = '<span class="nx">' + gl('play', 'sm') + 'Next</span>';
      SP.paintGlyphs(res);
    });
    $('tourGoLab').textContent = nx >= 0 ? 'Play' : 'Postcard';
  }
  function tourInfo(k) {
    var s = TRACK[k], el = $('tinfo'), T = game.tour, nx = tourNext();
    el.innerHTML = '';
    if (!s) return;
    var add = function (node) { el.appendChild(node); return node; }, h3 = function (t) { var h = document.createElement('h3'); h.textContent = t; return add(h); };
    if (s.kind === 'lock') {
      var c2 = document.createElement('canvas'); c2.width = 32; c2.height = 30; c2.className = 'head';
      c2.getContext('2d').drawImage(silhouette('#433a85'), 0, 0); add(c2);
      h3(s.e.name);
      var lk = document.createElement('canvas'); lk.setAttribute('data-g', 'lock'); lk.className = 'g big'; add(lk);
      SP.paintGlyphs(el);
      return;
    }
    var r = T.results[s.i];
    if (r) {
      if (r.winner) add(headCanvas(r.winner, 'cheer'));
      h3(r.winner ? ER[r.winner].team + ' won' : 'Draw');
      add(thumb(s.map, s.i > 0 && T.results[s.i - 1] ? rippleFor(s.i).look : 'normal', 'map'));
    } else if (s.i === nx) {
      var rip = rippleFor(s.i);
      if (rip) {
        var box = add(document.createElement('div')); box.className = 'ripple';
        ripplePicture(box, T, rip, MAPS[s.map]);
        h3(rip.title);
      } else { add(thumb(s.map, 'normal', 'map')); h3(MAPS[s.map].name); }
      var vs = add(document.createElement('div')); vs.className = 'tvs';
      vs.appendChild(headCanvas(T.era, 'cheer'));
      var v = document.createElement('b'); v.textContent = 'VS'; vs.appendChild(v);
      var fh = headCanvas(tourFoe(s.i, T.era), 'idle'); fh.className = 'head flipx'; vs.appendChild(fh);
    } else { add(thumb(s.map, 'normal', 'map')); h3('?'); }
    SP.paintGlyphs(el);
  }
  CTL.tour = {
    sel: 0, wrap: false,
    items: function () { return [].slice.call(document.querySelectorAll('#track .stop')); },
    enter: function () {
      if (!game.tour) game.tour = loadTourState();
      newTourArm = false;
      renderTour();
      var nx = tourNext(), k = 0;
      TRACK.forEach(function (s, i) { if (s.kind === 'stop' && s.i === (nx >= 0 ? nx : TOUR_STOPS.length - 1)) k = i; });
      CTL.tour.sel = k;
    },
    onSel: function (el) { tourInfo(+el.getAttribute('data-k')); },
    lr: function (d) { setSel(CTL.tour.sel + d); },
    ok: function () { tourGo(); },
    key: function (e) {
      if (e.code !== 'KeyN') return false;
      if (newTourArm) {
        clearTimeout(newTourT); newTourArm = false;
        game.tour = null; saveTour(); store('save', null);
        startSetup('tour');
      } else {
        newTourArm = true; prompts(); sfx('bonk');
        newTourT = setTimeout(function () { newTourArm = false; if (scr === 'tour') prompts(); }, 2500);
      }
      return true;
    },
    back: function () { if (matchOn) toMenu(); else show('main'); }
  };
  $('track').addEventListener('click', function (e) { var b = e.target.closest('.stop'); if (b) { var it = CTL.tour.items(); setSel(it.indexOf(b), true); } });
  $('bTourGo').addEventListener('click', tourGo);
  function tourGo() {
    if (!game.tour) return;
    if (tourNext() >= 0) wipe(playStop);
    else openPostcard('tour');
  }
  function openTour() {
    game.tour = game.tour || loadTourState();
    if (!game.tour) { show('main'); return; }
    if (matchOn) wipe(function () { inMatch(false); var nx = tourNext(); startDemo(TOUR_STOPS[nx >= 0 ? nx : TOUR_STOPS.length - 1]); musicEra('title'); show('tour', true); });
    else show('tour');
  }

  /* ---------- the history changed postcard ---------- */
  var pcShot = document.createElement('canvas'), hasShot = false, pcMounted = false;
  var PC_STARTERS = ['I think we should time travel, because', 'I think we should not, because', 'The best thing that changed was', 'If I went back again, I would'];
  function snapShot() { pcShot.width = cv.width; pcShot.height = cv.height; pcShot.getContext('2d').drawImage(cv, 0, 0); hasShot = true; }
  function tourSummary() {
    var T = game.tour || { results: [] };
    return TOUR_STOPS.map(function (m, i) {
      var r = T.results[i];
      return MAPS[m].name + ' (' + yearLabel(MAPS[m].year) + '): ' + (!r ? 'not played' : (r.winner ? ER[r.winner].team + ' won' : 'a draw'));
    });
  }
  function ripples() {
    var out = [], T = game.tour;
    for (var i = 1; i < TOUR_STOPS.length; i++) if (T && T.results[i - 1]) out.push(rippleFor(i));
    return out;
  }
  function changedLine() {
    var rs = ripples();
    return rs.length ? 'History changed: ' + rs.map(function (r) { return r.short || r.title; }).join(', then ') + '.' : 'History carried on as planned.';
  }
  function changedFull() { var rs = ripples(); return rs.length ? rs.map(function (r) { return r.postcard; }).join(' ') : 'History carried on as planned.'; }
  function postcardText() {
    return ['Time Tour postcard', ''].concat(tourSummary(), ['', 'What changed: ' + changedFull(), 'My message: ' + ($('pcText').value.trim() || '(left blank)')]).join('\n');
  }
  function drawPostcard() {
    var c2 = $('pcCard'), x2 = c2.getContext('2d'), W = c2.width, H = c2.height, T = game.tour || {};
    var last = MAPS[TOUR_STOPS[TOUR_STOPS.length - 1]];
    x2.fillStyle = '#fef8f4'; x2.fillRect(0, 0, W, H);
    x2.strokeStyle = '#1f2a30'; x2.lineWidth = 4; x2.strokeRect(2, 2, W - 4, H - 4);
    x2.imageSmoothingEnabled = false;
    var pw = 268, ph = 176;
    if (hasShot) {
      var sc = Math.max(pw / pcShot.width, ph / pcShot.height), sw = pw / sc, sh = ph / sc;
      x2.drawImage(pcShot, (pcShot.width - sw) / 2, (pcShot.height - sh) / 2, sw, sh, 16, 16, pw, ph);
    } else {
      var gr = x2.createLinearGradient(0, 16, 0, 192); gr.addColorStop(0, '#2b2c5e'); gr.addColorStop(1, '#e88a6a');
      x2.fillStyle = gr; x2.fillRect(16, 16, pw, ph);
    }
    x2.strokeStyle = '#1f2a30'; x2.lineWidth = 2; x2.strokeRect(16, 16, pw, ph);
    x2.fillStyle = '#ef7724'; x2.font = '800 22px Archivo, sans-serif';
    x2.fillText('Greetings from ' + yearLabel(last.year) + '!', 16, 222);
    x2.fillStyle = '#4a5a62'; x2.font = '400 13px "Atkinson Hyperlegible", sans-serif';
    var T2 = game.tour || { results: [] };
    TOUR_STOPS.forEach(function (m, i) {
      var r = T2.results[i];
      x2.fillText(MAPS[m].name + ': ' + (!r ? 'not played' : (r.winner ? ER[r.winner].team + ' won' : 'a draw')), 16, 244 + i * 17);
    });
    x2.fillStyle = '#cbbcae'; x2.fillRect(298, 20, 2, H - 40);
    x2.fillStyle = '#fff'; x2.fillRect(W - 82, 16, 66, 74);
    x2.strokeStyle = '#ef7724'; x2.lineWidth = 2; x2.setLineDash([4, 3]); x2.strokeRect(W - 82, 16, 66, 74); x2.setLineDash([]);
    var sp = document.createElement('canvas'); sp.width = 30; sp.height = 30;
    SP.draw(sp.getContext('2d'), 15, 28, 1, T.era || 'pre', 'cheer', 0, false, 0);
    x2.drawImage(sp, W - 79, 20, 60, 60);
    x2.fillStyle = '#0c4a5c'; x2.font = '700 13px "Atkinson Hyperlegible", sans-serif';
    wrapText(x2, changedLine(), 312, 108, W - 328, 16, 6);
    x2.fillStyle = '#1f2a30'; x2.font = '400 15px "Atkinson Hyperlegible", sans-serif';
    var msg = $('pcText').value.trim();
    wrapText(x2, msg ? '"' + msg + '"' : 'Your words go here.', 312, 206, W - 328, 19, 4);
    x2.fillStyle = '#7a6a5c'; x2.font = '400 11px "Atkinson Hyperlegible", sans-serif';
    x2.fillText('Timeline Tantrum \u00b7 Base 5', 312, H - 14);
  }
  function openPostcard(from) {
    retOf.postcard = from;
    $('pcStarters').innerHTML = PC_STARTERS.map(function (t2) { return '<button data-s="' + esc(t2) + '">' + esc(t2) + '...</button>'; }).join('');
    drawPostcard();
    if (!pcMounted && window.Base5Send && window.Base5Send.mount) {
      window.Base5Send.mount($('pcSend'), { tool: 'Timeline Tantrum postcard', getText: postcardText, filename: 'time-tour-postcard' });
      pcMounted = true;
    }
    show('postcard');
  }
  CTL.postcard = { back: function () { show(retOf.postcard || 'main'); } };
  $('pcStarters').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var t2 = $('pcText');
    t2.value = (t2.value ? t2.value.replace(/\s*$/, ' ') : '') + b.getAttribute('data-s') + ' ';
    t2.focus(); drawPostcard();
  });
  $('pcText').addEventListener('input', drawPostcard);
  $('bPcPic').addEventListener('click', function () { savePng('pcCard', 'time-tour-postcard.png', 'pcSaved'); });
  $('bPcDone').addEventListener('click', function () {
    try {
      var list = JSON.parse(store('postcards') || '[]');
      list.push({ at: Date.now(), text: $('pcText').value.trim(), changed: changedFull() });
      store('postcards', JSON.stringify(list.slice(-10)));
    } catch (e) { /* keep going */ }
    game.tour = null; saveTour(); store('save', null);
    bumpStat('tours');
    toMenu();
  });

  /* ---------- names ---------- */
  function cleanName(v) { return String(v || '').replace(/[^A-Za-z0-9 !'.-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 10); }
  function genName(era) {
    var E2 = ER[era], b = E2.bits, pk = function (a) { return a[Math.floor(Math.random() * a.length)]; };
    var nm = pk(E2.names);
    if (Math.random() < 0.35) { var tn = pk(E2.titles) + ' ' + nm; if (tn.length <= 10) return tn; }
    return nm;
  }

  /* ---------- pictures that replace sentences ---------- */
  function thumb(mapId, look, cls) {
    var c2 = document.createElement('canvas'); c2.width = 64; c2.height = 36; if (cls) c2.className = cls;
    SP.mapThumb(c2, MAPS[mapId], look || 'normal'); return c2;
  }
  function headCanvas(era, pose, skin) {
    var c2 = document.createElement('canvas'); c2.width = 30; c2.height = 26; c2.className = 'head';
    SP.draw(c2.getContext('2d'), 15, 27, 1, era, pose || 'cheer', 0, false, 0, 1, { skin: skin }); return c2;
  }
  /* looks you earn: each one is a new skin for any squad */
  var LOOKS = [
    { id: 'night', name: 'Night', test: function (st) { return (st.wins || 0) >= 3; } },
    { id: 'ghost', name: 'Ghost', test: function () { return museumCount(allArts()) >= 10; } },
    { id: 'ember', name: 'Ember', test: function (st) { return (st.legend || 0) >= 1; } },
    { id: 'gold', name: 'Gold', test: function (st) { return (st.tourGold || 0) >= 1; } }
  ];
  function unlocked() { try { return JSON.parse(store('skins') || '[]') || []; } catch (e) { return []; } }
  function checkUnlocks() {
    var st = {}, have = unlocked(), fresh = [];
    try { st = JSON.parse(store('stats') || '{}') || {}; } catch (e) { st = {}; }
    LOOKS.forEach(function (L) { if (have.indexOf(L.id) < 0 && L.test(st)) { have.push(L.id); fresh.push(L); } });
    if (fresh.length) store('skins', JSON.stringify(have));
    return fresh;
  }
  function lookVals() { return ['classic'].concat(LOOKS.map(function (L) { return L.id; }).filter(function (id) { return unlocked().indexOf(id) >= 0; })); }
  function lookName(v) { if (v === 'classic' || !v) return 'Classic'; for (var i = 0; i < LOOKS.length; i++) if (LOOKS[i].id === v) return LOOKS[i].name; return 'Classic'; }
  /* who won, an arrow, then the next stop as it looks now, plus what each squad gained or lost */
  function ripplePicture(el, T, rip, to) {
    el.innerHTML = '';
    var prev = T.results[T.stop - 1];
    if (prev && prev.winner) el.appendChild(headCanvas(prev.winner, 'cheer'));
    else { var off = document.createElement('canvas'); off.setAttribute('data-g', 'off'); off.className = 'g big'; el.appendChild(off); }
    var ar = document.createElement('canvas'); ar.setAttribute('data-g', 'next'); ar.className = 'g arrow'; el.appendChild(ar);
    var mt = thumb(TOUR_STOPS[T.stop], rip.look, 'map'); mt.title = to.name; el.appendChild(mt);
    var foe = tourFoe(T.stop, T.era), box = document.createElement('div'); box.className = 'ammo';
    if (rip.ammo) [T.era, foe].forEach(function (era) {
      var mods = rip.ammo[era] || {};
      for (var wid in mods) {
        var sp = document.createElement('span'); sp.className = mods[wid] > 0 ? 'up' : 'down';
        var ic = document.createElement('canvas'); ic.width = 12; ic.height = 12; SP.icon(ic.getContext('2d'), wid, era);
        sp.appendChild(ic); sp.appendChild(document.createTextNode((mods[wid] > 0 ? '+' : '') + mods[wid]));
        sp.title = weaponName(era, wid); box.appendChild(sp);
      }
    });
    if (box.children.length) el.appendChild(box);
    SP.paintGlyphs(el);
  }

  /* ---------- How to play as a wordless comic strip ---------- */
  function keycap(x2, x, y, w, label) {
    x2.fillStyle = '#0e0b22'; x2.fillRect(x, y + 1, w, 9);
    x2.fillStyle = '#3a3278'; x2.fillRect(x, y, w, 9);
    x2.fillStyle = '#4a4290'; x2.fillRect(x, y, w, 1);
    if (label === '<' || label === '>' || label === '^' || label === 'v') {
      x2.fillStyle = '#fef8f4'; var cx = x + (w >> 1), cy = y + 4;
      for (var i = 0; i < 3; i++) {
        if (label === '<') x2.fillRect(cx - 1 + i, cy - i, 1, 2 * i + 1);
        if (label === '>') x2.fillRect(cx + 1 - i, cy - i, 1, 2 * i + 1);
        if (label === '^') x2.fillRect(cx - i, cy - 1 + i, 2 * i + 1, 1);
        if (label === 'v') x2.fillRect(cx - i, cy + 1 - i, 2 * i + 1, 1);
      }
    } else SP.text(x2, label, x + (w >> 1), y + 2, '#fef8f4', null, true);
  }
  /* a tiny pixel mouse, with the button that matters lit up */
  function mouseIcon(x2, x, y, btn) {
    x2.fillStyle = '#0e0b22'; x2.fillRect(x, y, 9, 13);
    x2.fillStyle = '#fef8f4'; x2.fillRect(x + 1, y + 1, 7, 11);
    x2.fillStyle = '#0e0b22'; x2.fillRect(x + 4, y + 1, 1, 5); x2.fillRect(x + 1, y + 5, 7, 1);
    if (btn === 'l') { x2.fillStyle = '#ef7724'; x2.fillRect(x + 1, y + 1, 3, 4); }
    if (btn === 'r') { x2.fillStyle = '#5fe0f0'; x2.fillRect(x + 5, y + 1, 3, 4); }
  }
  function scene(x2, map) {
    var M = MAPS[map], W = 96, H = 60;
    for (var i = 0; i < M.sky.length; i++) { x2.fillStyle = M.sky[i]; x2.fillRect(0, Math.floor(i * H / M.sky.length), W, Math.ceil(H / M.sky.length) + 1); }
    x2.fillStyle = map === 'desert' ? 'rgb(240,206,136)' : '#7ec850'; x2.fillRect(0, 44, W, 2);
    x2.fillStyle = map === 'desert' ? 'rgb(224,186,114)' : 'rgb(138,90,50)'; x2.fillRect(0, 46, W, H - 46);
  }
  var COMIC = [
    ['Move', function (x2, t) { scene(x2, 'jungle'); var wx = 40 + ((t >> 2) % 16); SP.draw(x2, wx, 45, 1, 'pre', 'walk', (t >> 1) % 4, false, 0);
      if (touchOn) { keycap(x2, 26, 6, 13, '<'); keycap(x2, 57, 6, 13, '>'); } else { keycap(x2, 30, 6, 11, '<'); keycap(x2, 55, 6, 11, '>'); } }],
    ['Aim', function (x2, t) { scene(x2, 'jungle'); var aim = 10 + ((t % 8) < 4 ? (t % 4) * 12 : (4 - t % 4) * 12);
      SP.draw(x2, 30, 45, 1, 'pre', 'aim', 0, false, 0, 1, { look: aim > 30 ? -1 : 0 }); SP.weapon(x2, 30, 45, 1, aim, 'lob', 'pre', t);
      var a = aim * Math.PI / 180; x2.fillStyle = '#ffd27a'; for (var i = 1; i < 6; i++) x2.fillRect(Math.round(36 + Math.cos(a) * i * 6), Math.round(37 - Math.sin(a) * i * 6), 1, 1);
      if (touchOn) { x2.drawImage(SP.glyph('touch'), 70, 14 - (t % 4) * 2); } else { keycap(x2, 64, 6, 11, '^'); keycap(x2, 64, 18, 11, 'v'); mouseIcon(x2, 80, 10 - (t % 4), ''); } }],
    ['Hold, then let go', function (x2, t) { scene(x2, 'jungle'); SP.draw(x2, 24, 45, 1, 'pre', 'charge', 0, false, 0); SP.weapon(x2, 24, 45, 1, 40, 'lob', 'pre', t);
      var n = t % 6; for (var i = 0; i < 10; i++) { x2.fillStyle = i < n * 2 ? (i < 6 ? '#5fe0f0' : (i < 9 ? '#ffc24a' : '#ef7724')) : '#2a2452'; x2.fillRect(44 + i * 4, 30, 3, 8); }
      if (touchOn) { x2.fillStyle = '#ef7724'; x2.fillRect(56, 8, 30, 12); SP.text(x2, 'FIRE', 71, 12, '#ffffff', null, true); } else { keycap(x2, 40, 8, 34, 'SPACE'); mouseIcon(x2, 80, 6, 'l'); } }],
    ['Splash!', function (x2, t) { scene(x2, 'jungle'); x2.fillStyle = '#3f8fb5'; x2.fillRect(50, 46, 46, 14); x2.fillStyle = '#9fd8ef'; x2.fillRect(50, 46, 46, 1);
      var k = (t % 6) / 6; SP.draw(x2, 70, 30 + k * 18, -1, 'fut', 'panic', t % 2, false, 0, 1 - k * 0.6); SP.portal(x2, 70, 40, 0.5, t * 3);
      SP.draw(x2, 22, 45, 1, 'pre', 'cheer', t % 2, false, 0); }],
    ['Dig up history', function (x2, t) { scene(x2, 'desert');
      var ph = t % 6; if (ph < 3) { x2.fillStyle = '#fff3c8'; x2.fillRect(48, 47 - ph, 1, 2 * ph + 1); x2.fillRect(48 - ph, 47, 2 * ph + 1, 1); }
      else { x2.fillStyle = '#ef7724'; x2.beginPath(); x2.arc(48, 46, 10 - ph, 0, 7); x2.fill(); SP.art(x2, 'papyrus', 48, 42 - (ph - 3) * 4); }
      x2.drawImage(SP.glyph('museum'), 80, 6); SP.draw(x2, 20, 45, 1, 'egypt', 'idle', 0, false, 0); }],
    ['Kit', function (x2, t) { scene(x2, 'city'); var ids = ['lob', 'bomb', 'disc', 'laser', 'jet'], ic = document.createElement('canvas'); ic.width = 12; ic.height = 12;
      ids.forEach(function (w, i) { SP.icon(ic.getContext('2d'), w, 'fut'); x2.fillStyle = (t % 5) === i ? '#5fe0f0' : '#2e2860'; x2.fillRect(8 + i * 17, 10, 14, 14); x2.drawImage(ic, 9 + i * 17, 11); });
      if (touchOn) x2.drawImage(SP.glyph('kit'), 42, 30); else { keycap(x2, 28, 32, 22, 'TAB'); mouseIcon(x2, 58, 30, 'r'); } }],
    ['Look around', function (x2, t) { scene(x2, 'jungle'); var k = (t % 12) < 6 ? (t % 6) : 6 - (t % 6);
      x2.strokeStyle = '#fef8f4'; x2.lineWidth = 1; x2.strokeRect(14.5 + k * 5, 12.5, 36, 22);
      SP.draw(x2, 30, 45, 1, 'pre', 'idle', 0, false, 0); SP.draw(x2, 74, 45, -1, 'fut', 'idle', 0, false, 0);
      if (!touchOn) { keycap(x2, 4, 2, 9, '+'); keycap(x2, 15, 2, 9, '-'); } }],
    ['Breather', function (x2, t) { scene(x2, 'jungle'); SP.draw(x2, 40, 45, 1, 'pre', 'yawn', t % 2, false, 0); x2.drawImage(SP.glyph('cup'), 62, 22); }]
  ];
  var comicT = null, comicF = 0;
  function drawComic() {
    var box = $('comic');
    if (!box.children.length) COMIC.forEach(function (c) {
      var d = document.createElement('div'); d.className = 'panel';
      var cv2 = document.createElement('canvas'); cv2.width = 96; cv2.height = 60;
      var sp = document.createElement('span'); sp.textContent = c[0];
      d.appendChild(cv2); d.appendChild(sp); box.appendChild(d);
    });
    Array.prototype.forEach.call(box.querySelectorAll('canvas'), function (cv2, i) { var x2 = cv2.getContext('2d'); x2.clearRect(0, 0, 96, 60); COMIC[i][1](x2, comicF); });
    comicF++;
    if (comicT) clearTimeout(comicT);
    comicT = setTimeout(function () { comicT = null; if (scr === 'help' && !reduceMotion) drawComic(); }, 260);
  }

  /* ---------- teach by doing: show the next key or button beside your Snag until you have used it ---------- */
  var learn = {};
  try { learn = JSON.parse(store('learn') || '{}') || {}; } catch (e) { learn = {}; }
  function learnDone(k) { if (!learn[k] && game.active && game.active.team.ctrl === 'human') { learn[k] = 1; store('learn', JSON.stringify(learn)); } }
  function lesson() {
    var c = game.active;
    if (!c || !humanTurn() || game.state !== 'play' || game.overlay || c.st !== 'ground' || game.fired) return null;
    if (!learn.walk) return 'walk';
    if (!learn.aim) return 'aim';
    if (!learn.fire) return 'fire';
    if (!learn.kit && game.turnNo >= 3) return 'kit';
    return null;
  }
  var teachOn = '';
  function teachTouch(l) {
    var want = touchOn ? (l || '') : '';
    if (want === teachOn) return;
    teachOn = want;
    var map = { walk: ['left', 'right'], aim: ['up', 'down'], fire: ['fire'], kit: ['weapons'] };
    Array.prototype.forEach.call(document.querySelectorAll('#touch button'), function (b) { b.classList.toggle('teach', !!(map[want] && map[want].indexOf(b.getAttribute('data-k')) >= 0)); });
  }
  function drawLearn(t) {
    /* instant weapons wait for a second click */
    if (armClick && game.t - armClick < 150 && humanTurn() && game.state === 'play' && !game.fired) {
      var ac = game.active, ax = Math.round(ac.x), ay = Math.round(ac.y) - 64 + Math.round(Math.sin(t * 0.2) * 1.5);
      mouseIcon(ctx, ax - 14, ay - 2, 'l'); SP.text(ctx, 'AGAIN', ax + 6, ay + 2, '#ffd27a', '#1f2a30', true);
      return;
    }
    var l = lesson();
    teachTouch(l);
    if (!l || touchOn) return;
    var c = game.active, bob = Math.round(Math.sin(t * 0.08) * 1.5), x = Math.round(c.x), y = Math.round(c.y) - 62 + bob;
    if (l === 'walk') { keycap(ctx, x - 14, y, 11, '<'); keycap(ctx, x + 3, y, 11, '>'); }
    else if (l === 'aim') { var tip = SP.tip(c.x, c.y, c.face, c.aim, game.weapon), a = c.aim * Math.PI / 180; var hx = Math.round(tip.x + Math.cos(a) * c.face * 34) + c.face * 10, hy = Math.round(tip.y - Math.sin(a) * 34) - 10 + bob; keycap(ctx, hx - 5, hy, 11, '^'); keycap(ctx, hx - 5, hy + 12, 11, 'v'); }
    else if (l === 'fire') { keycap(ctx, x - 24, y, 34, 'SPACE'); mouseIcon(ctx, x + 13, y - 2, 'l'); }
    else if (l === 'kit') { keycap(ctx, x - 16, y, 22, 'TAB'); mouseIcon(ctx, x + 9, y - 2, 'r'); }
  }

  /* ---------------- the kit: an icon grid that slides out from the right ---------------- */
  var kitIds = [], kitSel = 0, kitTeam = null;
  function kitWhat(wid) {
    if (wid === 'pass') return 'Skip this go';
    var w = WEAP[wid], out = [];
    if (w.kind === 'proj') {
      if (w.crawl) out.push('Crawls to enemies');
      else if (w.direct) out.push('Direct hit bonus');
      else if (w.impact) out.push('Booms on landing');
      if (w.fuse && !w.crawl) out.push('Pops after ' + Math.round(w.fuse / 60) + 's');
      if (w.bounces) out.push('Bounces off walls');
      else if (w.bounce >= 0.5) out.push('Bouncy');
      out.push(w.wind ? 'Wind pushes it' : 'Wind cannot push it');
    } else out.push({ place: 'Drop it and run', melee: 'Up close', dig: 'Digs a tunnel', beam: 'Straight beam', wall: 'Builds cover', dune: 'Builds a dune', shield: 'Halves damage', strike: 'Pick any spot', bark: 'Rare surprise', vine: 'Swing about', jet: 'Fly about', sled: 'Ride the sand' }[w.kind] || '');
    if (w.tool) out.push('Free move');
    return out.filter(Boolean).join(' \u00b7 ');
  }
  function kitName(era, wid) { return wid === 'pass' ? 'Breather' : weaponName(era, wid); }
  function kitProps(team, wid) {
    if (wid === 'pass') return gl('cup') + gl('free');
    var W2 = WEAP[wid], av = avail(team, wid), props = '';
    if (W2.wind) props += gl('wind');
    if (W2.fuse) props += gl('fuse') + '<b>' + Math.round(W2.fuse / 60) + 's</b>';
    if (W2.bounces || (W2.bounce && W2.bounce >= 0.5)) props += gl('bounce');
    if (W2.direct || W2.kind === 'beam') props += gl('target');
    if (W2.tool) props += gl('free');
    if (av.locked) props += gl('lock') + '<b>' + av.locked + '</b>';
    else if (W2.ammo || wid === 'bark') { var max = wid === 'bark' ? (av.left || 0) : Math.max(W2.ammo, av.left || 0); for (var k = 0; k < max; k++) props += '<i class="pip' + (k < (av.left || 0) ? '' : ' off') + '"></i>'; }
    return props;
  }
  function openKit() {
    if (!humanTurn() || game.state !== 'play' || game.charging || game.fired) return;
    learnDone('kit');
    kitTeam = game.active.team;
    var era = kitTeam.era;
    kitIds = kitFor(kitTeam).concat(['pass']);
    $('kitPanel').style.setProperty('--c', ER[era].tag);
    $('kitTitle').textContent = ER[era].team;
    $('kitList').innerHTML = kitIds.map(function (wid, i) {
      var W2 = WEAP[wid], av = wid === 'pass' ? { ok: true } : avail(kitTeam, wid);
      var cls = 'kc' + (wid === game.weapon ? ' cur' : '') + (wid === 'bark' || (W2 && W2.kind === 'strike') ? ' gold' : '') + (W2 && !W2.tool && !av.ok ? ' off' : '');
      var cnt = av.locked ? av.locked : ((W2 && (W2.ammo || wid === 'bark')) ? 'x' + (av.left || 0) : '');
      return '<button class="' + cls + '" data-i="' + i + '" aria-label="' + esc(kitName(era, wid)) + '"><canvas width="12" height="12" data-icon="' + wid + '"></canvas>' +
        (i < 10 && wid !== 'pass' ? '<kbd>' + ((i + 1) % 10) + '</kbd>' : '') + (cnt !== '' ? '<b>' + (av.locked ? gl('lock') : '') + cnt + '</b>' : '') + '</button>';
    }).join('');
    Array.prototype.forEach.call(document.querySelectorAll('#kitList canvas[data-icon]'), function (c2) { SP.icon(c2.getContext('2d'), c2.getAttribute('data-icon'), era); });
    SP.paintGlyphs($('kitList'));
    kitSel = Math.max(0, kitIds.indexOf(game.weapon));
    kitShow();
    inp.left = inp.right = inp.up = inp.down = false;
    game.overlay = 'kit';
    $('kitPanel').classList.add('open');
    sfx('whoosh');
  }
  function kitShow() {
    var cells = $('kitList').children;
    for (var i = 0; i < cells.length; i++) cells[i].classList.toggle('sel', i === kitSel);
    var wid = kitIds[kitSel];
    if (!wid || !kitTeam) return;
    $('kitName').textContent = kitName(kitTeam.era, wid);
    $('kitProps').innerHTML = kitProps(kitTeam, wid);
    $('kitWhat').textContent = kitWhat(wid);
    SP.paintGlyphs($('kitProps'));
  }
  function closeKit() {
    $('kitPanel').classList.remove('open');
    if (game.overlay === 'kit') game.overlay = null;
  }
  function pickKit(i) {
    var wid = kitIds[i];
    closeKit();
    if (!wid) return;
    if (wid === 'pass') passTurn(); else pickWeapon(wid);
  }
  function kitKey(e) {
    var k = e.code, n = kitIds.length;
    e.preventDefault();
    if (k === 'Escape' || k === 'Tab' || k === 'Backspace') { closeKit(); sfx('click'); return; }
    if (k === 'ArrowLeft' || k === 'KeyA') kitSel = Math.max(0, kitSel - 1);
    else if (k === 'ArrowRight' || k === 'KeyD') kitSel = Math.min(n - 1, kitSel + 1);
    else if (k === 'ArrowUp' || k === 'KeyW') kitSel = Math.max(0, kitSel - 4);
    else if (k === 'ArrowDown' || k === 'KeyS') kitSel = Math.min(n - 1, kitSel + 4);
    else if (k === 'Enter' || k === 'NumpadEnter' || k === 'Space') { if (!e.repeat) pickKit(kitSel); return; }
    else if (/^Digit\d$/.test(k)) { var dn = parseInt(k.charAt(5), 10); pickKit(dn === 0 ? 9 : dn - 1); return; }
    else return;
    sfx('blip'); kitShow();
  }
  $('kitList').addEventListener('pointerover', function (e) {
    var b = e.target.closest('.kc');
    if (!b) return;
    var i = +b.getAttribute('data-i');
    if (i !== kitSel) { kitSel = i; sfx('blip'); kitShow(); }
  });
  $('kitList').addEventListener('click', function (e) { var b = e.target.closest('.kc'); if (b) pickKit(+b.getAttribute('data-i')); });
  $('kitPanel').addEventListener('contextmenu', function (e) { e.preventDefault(); closeKit(); });

  /* ---------------- battle controls: keyboard and mouse, both complete ---------------- */
  var KMAP = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', KeyA: 'left', KeyD: 'right', KeyW: 'up', KeyS: 'down' };
  function battleKey(e) {
    if (!matchOn || game.state === 'demo' || game.state === 'over') return;
    game.lookT = 0;
    if (KMAP[e.code]) { inp[KMAP[e.code]] = true; freeCam = null; e.preventDefault(); return; }
    switch (e.code) {
      case 'Space': e.preventDefault(); if (!e.repeat) { freeCam = null; firePress(); } break;
      case 'Enter': case 'NumpadEnter': e.preventDefault(); if (!e.repeat) doJump(e.shiftKey); break;
      case 'Backspace': e.preventDefault(); if (!e.repeat) doJump(true); break;
      case 'Tab': e.preventDefault(); if (!e.repeat) openKit(); break;
      case 'Equal': case 'NumpadAdd': e.preventDefault(); setZoom(zoom - 1); break;
      case 'Minus': case 'NumpadSubtract': e.preventDefault(); setZoom(zoom + 1); break;
      case 'Digit1': case 'Digit2': case 'Digit3': case 'Digit4': case 'Digit5':
      case 'Digit6': case 'Digit7': case 'Digit8': case 'Digit9': case 'Digit0':
        if (game.active) { var dn = parseInt(e.code.charAt(5), 10); pickWeapon(kitFor(game.active.team)[dn === 0 ? 9 : dn - 1]); }
        break;
      case 'Escape': case 'KeyP': e.preventDefault(); openPause(); break;
    }
  }
  document.addEventListener('keydown', function (e) {
    audioInit();
    if (wiping) return;
    var tg = e.target, tag = tg && tg.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      if (e.code === 'Escape' || (e.code === 'Enter' && tag === 'INPUT')) { tg.blur(); e.preventDefault(); }
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    /* a button clicked earlier keeps focus; drop it so Space and Enter only do what the game says */
    var c0 = scr && CTL[scr], ours = !scr || game.overlay === 'kit' || (c0 && (c0.items || c0.ok || c0.key));
    if (ours && (tag === 'BUTTON' || tag === 'A')) tg.blur();
    if (game.overlay === 'kit') { kitKey(e); return; }
    if (scr) { navKey(e); return; }
    battleKey(e);
  });
  document.addEventListener('keyup', function (e) {
    if (KMAP[e.code]) inp[KMAP[e.code]] = false;
    if (e.code === 'Space' && !scr) fireRelease();
  });
  window.addEventListener('blur', function () {
    inp.left = inp.right = inp.up = inp.down = false;
    leftDown = false; panning = null;
    if (game.charging) { game.charging = false; game.power = 0; }
  });

  var mouse = { inside: false, sx: 0, sy: 0 }, leftDown = false, touchAim = false, armClick = 0, focusAt = 0;
  window.addEventListener('focus', function () { focusAt = Date.now(); });
  function aimAt(e) {
    var c = game.active;
    if (!c) return;
    var w = toWorld(e);
    if (WEAP[game.weapon].kind === 'strike') { game.tx = clamp(w.x, 10, WW - 10); return; }
    var dx = w.x - c.x, dy = (c.y - 9) - w.y;
    if (Math.abs(dx) > 2) c.face = dx > 0 ? 1 : -1;
    var a0 = c.aim;
    c.aim = clamp(Math.round(Math.atan2(dy, Math.abs(dx)) * 180 / Math.PI), -80, 85);
    aimTick(a0, c.aim);
    learnDone('aim');
  }
  function canAim() { var c = game.active; return humanTurn() && game.state === 'play' && !game.charging && !c.swing && !c.jet && !c.sled; }
  cv.addEventListener('pointermove', function (e) {
    var p = stageXY(e);
    mouse.sx = p.x; mouse.sy = p.y; mouse.inside = true;
    if (panning) {
      var k = cv.width / cv.getBoundingClientRect().width;
      freeCam = { x: panning.cx - (e.clientX - panning.x) * k, y: panning.cy - (e.clientY - panning.y) * k };
      clampFree();
      return;
    }
    if (e.pointerType === 'mouse') { if (!game.overlay && canAim()) aimAt(e); }
    else if (touchAim && canAim()) aimAt(e);
  });
  cv.addEventListener('pointerleave', function () { mouse.inside = false; });
  cv.addEventListener('pointerdown', function (e) {
    audioInit();
    if (scr || !matchOn) return;
    if (game.overlay === 'kit') { closeKit(); return; }
    if (e.pointerType === 'mouse') {
      if (e.button === 1) {
        e.preventDefault(); lookFrom();
        panning = { x: e.clientX, y: e.clientY, cx: freeCam.x, cy: freeCam.y };
        try { cv.setPointerCapture(e.pointerId); } catch (err) { /* fine */ }
        return;
      }
      if (e.button === 2) { openKit(); return; }
      if (e.button === 0 && humanTurn() && game.state === 'play') {
        /* the click that brings the window into focus never spends a go */
        if (Date.now() - focusAt < 350) return;
        freeCam = null; game.lookT = 0;
        if (canAim()) aimAt(e);
        var w0 = WEAP[game.weapon];
        if (w0.tool) firePress();
        else if (w0.kind === 'proj') { leftDown = Date.now(); firePress(); }
        else if (armClick && game.t - armClick < 150) { armClick = 0; firePress(); }
        else { armClick = game.t; sfx('aim'); }
        try { cv.setPointerCapture(e.pointerId); } catch (err) { /* fine */ }
      }
      return;
    }
    /* touch: drag on the battlefield to aim */
    if (!humanTurn() || game.state !== 'play' || game.charging || game.active.st !== 'ground') return;
    touchAim = true; game.lookT = 0; freeCam = null; aimAt(e);
    try { cv.setPointerCapture(e.pointerId); } catch (err) { /* fine */ }
  });
  function pointerEnd(e) {
    if (panning) { panning = null; return; }
    if (leftDown && (e.type !== 'pointerup' || e.button === 0)) {
      /* a quick tap just aims; you have to hold to throw */
      var held = Date.now() - leftDown;
      leftDown = false;
      if (held < 120 && game.charging && humanTurn()) { game.charging = false; game.power = 0; }
      else fireRelease();
    }
    touchAim = false;
  }
  cv.addEventListener('pointerup', pointerEnd);
  cv.addEventListener('pointercancel', pointerEnd);
  var wheelT = 0;
  stage.addEventListener('wheel', function (e) {
    if (scr || !matchOn || game.overlay) return;
    e.preventDefault();
    var now = Date.now();
    if (now - wheelT < 140 || Math.abs(e.deltaY) < 1) return;
    wheelT = now;
    setZoom(zoom + (e.deltaY > 0 ? 1 : -1));
  }, { passive: false });
  mini.addEventListener('pointerdown', function (e) {
    var rc = mini.getBoundingClientRect();
    freeCam = { x: (e.clientX - rc.left) / rc.width * WW, y: (e.clientY - rc.top) / rc.height * WH };
    clampFree();
    e.stopPropagation();
  });

  /* touch buttons, outside the stage at real size */
  var passArmed = 0;
  function passPress() {
    if (!humanTurn() || game.state !== 'play' || game.fired) return;
    if (passArmed > 0) { passArmed = 0; setPassArm(false); passTurn(); return; }
    passArmed = 120; setPassArm(true);
  }
  /* tap Breather once to arm it (it shows a tick), tap again to pass */
  function setPassArm(on) {
    var b = document.querySelector('#touch [data-k="pass"]'), g2 = $('passG');
    if (!b || !g2) return;
    b.classList.toggle('arm', on); g2.setAttribute('data-g', on ? 'check' : 'cup'); SP.paintGlyphs(b);
  }
  function press(k) {
    game.lookT = 0; freeCam = null;
    if (game.overlay === 'kit' && k !== 'weapons') closeKit();
    if (k in inp) inp[k] = true;
    else if (k === 'jump') doJump(false);
    else if (k === 'flip') doJump(true);
    else if (k === 'fire') firePress();
    else if (k === 'weapons') { if (game.overlay === 'kit') closeKit(); else openKit(); }
    else if (k === 'pass') passPress();
  }
  function release(k) {
    if (k in inp) inp[k] = false;
    else if (k === 'fire') fireRelease();
  }
  Array.prototype.forEach.call(document.querySelectorAll('#touch button'), function (b) {
    var k = b.getAttribute('data-k'), held = false;
    b.addEventListener('pointerdown', function (e) {
      e.preventDefault(); audioInit(); held = true; b.classList.add('on'); press(k);
      try { b.setPointerCapture(e.pointerId); } catch (err) { /* fine */ }
    });
    function up() { if (!held) return; held = false; b.classList.remove('on'); release(k); }
    b.addEventListener('pointerup', up);
    b.addEventListener('pointercancel', up);
    b.addEventListener('lostpointercapture', up);
    b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  });

  function inMatch(on) {
    matchOn = on;
    $('hud').hidden = !on;
    $('touch').hidden = !(on && touchOn);
    stage.classList.toggle('touch', on && touchOn);
    if (!on) { freeCam = null; $('jay').hidden = true; $('banner').classList.remove('show'); closeKit(); }
  }

  /* every frame: edge scrolling, the right cursor, and the animated menus */
  var uiN = 0;
  function uiTick() {
    uiN++;
    var battle = matchOn && !scr && !game.overlay;
    if (battle && mouse.inside && !panning && !touchOn) {
      var m = 10, dx = mouse.sx < m ? -1 : (mouse.sx > SW - m ? 1 : 0), dy = mouse.sy < m ? -1 : (mouse.sy > SH - m ? 1 : 0);
      if (dx || dy) { lookFrom(); freeCam.x += dx * 6; freeCam.y += dy * 6; clampFree(); }
    }
    stage.classList.toggle('aim', battle && !panning && humanTurn() && game.state === 'play');
    stage.classList.toggle('grab', !!panning);
    if (scr === 'squad') {
      if (uiN % 2 === 0) drawTL();
      if (uiN % 14 === 0) animSquad();
    }
  }

  /* ---------------- the loop ---------------- */
  var acc = 0, last = 0, hudN = 0;
  function frame(ts) {
    if (!last) last = ts;
    var dt = Math.min(250, ts - last);
    last = ts;
    if (!paused()) {
      acc += dt * FAST * (game.slow > 0 ? 0.35 : 1);
      var guard = 0;
      while (acc >= STEP && guard < 40) { update(); acc -= STEP; guard++; }
      if (guard >= 40) acc = 0;
    }
    render();
    uiTick();
    if (++hudN % 4 === 0 && matchOn) hudTick();
    requestAnimationFrame(frame);
  }

  /* one plain sentence for BridgeLink Buddy, read from this device's saves */
  function bumpStat(k) {
    try { var st = JSON.parse(store('stats') || '{}'); st[k] = (st[k] || 0) + 1; store('stats', JSON.stringify(st)); } catch (e) { /* fine */ }
  }
  window.B5TantrumLine = function () {
    var st = {}, T = loadTourState();
    try { st = JSON.parse(store('stats') || '{}'); } catch (e) { st = {}; }
    var real = [], gls = [];
    MAP_IDS.forEach(function (m) { real = real.concat(realOf(m)); gls = gls.concat(glitchOf(m)); });
    return 'Time Museum: ' + museumCount(real) + ' of ' + real.length + ' real finds and ' + museumCount(gls) + ' of ' + gls.length + ' glitches. ' +
      'Matches finished: ' + (st.matches || 0) + '. ' +
      (T ? 'On the Time Tour, ' + T.results.length + ' of ' + TOUR_STOPS.length + ' stops played.' : 'Time Tours finished: ' + (st.tours || 0) + '.');
  };

  /* ---------------- start up ---------------- */
  if (TEST === 'museum') { ARTS.jungle.slice(0, 4).concat(ARTS.glitches.slice(0, 1), ARTS.desert.slice(0, 5), ARTS.desertGlitches.slice(0, 2), ARTS.city.slice(0, 3), ARTS.cityGlitches.slice(0, 1)).forEach(function (a) { museum.found[a.id] = { at: 1, by: 'Ug' }; }); }
  SP.paintGlyphs(document);
  SP.jay(jayCv, false);
  makeCursors();
  setZoom(zoom);
  fitStage();
  window.addEventListener('resize', fitStage);
  applyAudio();
  inMatch(false);
  startDemo();
  if (TEST === 'aivai') newMatch({ mode: 'cpu', mood: Q.get('mood') || 'grumpy', era: Q.get('era') || 'pre', foe: Q.get('foe') || null, sd: Q.get('sd') || 'on', size: parseInt(Q.get('size') || '3', 10), turn: 60, map: Q.get('map') || 'jungle', look: Q.get('look') || 'normal' });
  else show('title', true);
  requestAnimationFrame(frame);

  /* test hooks, used only by automated checks */
  window.B5TEST = { solid: solid, newMatch: newMatch, fire: fire, explode: explode, mask: mask, WEAP: WEAP, cam: cam, update: update, deliver: function () { maybeDeliver(true); },
    zone: zone, inp: inp, pickWeapon: pickWeapon, firePress: firePress, fireRelease: fireRelease, doJump: doJump, setWater: function (v) { WATER = v; },
    show: show, scr: function () { return scr; }, setZoom: setZoom, zoom: function () { return zoom; }, openKit: openKit, view: function () { return [VW, VH]; },
    freeCam: function () { return freeCam; }, opts: opts, tour: function () { return game.tour; } };
})();
