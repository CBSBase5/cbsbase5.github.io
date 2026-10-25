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
    boulder: { kind: 'proj', wind: false, impact: false, hit: true, R: 24, dmg: 40, vmax: 7.5, fuse: 240, bounce: 0.62, knock: 1.5, ammo: 2 },
    gourd:   { kind: 'place', wind: false, impact: false, R: 40, dmg: 56, fuse: 300, bounce: 0.3, knock: 1.2, ammo: 1 },
    vine:    { kind: 'vine', range: 150, tool: true },
    wall:    { kind: 'wall', ammo: 2 },
    mega:    { kind: 'strike', style: 'boulder', R: 46, dmg: 58, ammo: 1, unlock: 10, knock: 1.3 },
    /* Neon Snags: precision and positioning, short on ammo */
    disc:    { kind: 'proj', wind: false, impact: false, hit: true, grav: 0, R: 16, dmg: 30, vmax: 7, bounce: 1, bounces: 4, life: 360, ammo: 3 },
    laser:   { kind: 'beam', dmg: 32, range: 420, ammo: 2 },
    jet:     { kind: 'jet', fuel: 150, tool: true },
    shield:  { kind: 'shield', ammo: 2 },
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
    strikes: [], warn: [], fuel: 0, tx: null, sudden: false, cars: [], tour: null
  };
  window.B5GAME = game;
  var cam = { x: 0, y: 0 };

  /* ---------------- Snags ---------------- */
  function makeSnag(team, name, x, y) {
    return {
      team: team, name: name, x: x, y: y, vx: 0, vy: 0, hp: 100, face: x < WW / 2 ? 1 : -1, aim: 35,
      st: 'ground', alive: true, knock: false, flip: false, airT: 0, hurtT: 0, walking: 0, walkd: 0,
      landT: 0, cheerT: 0, blinkAt: Math.floor(Math.random() * 200)
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
        return true;
      }
    }
    return false;
  }

  function jump(c, back) {
    if (c.st !== 'ground' || !bodyClear(c.x, c.y - 1)) return;
    c.y -= 1; c.st = 'air'; c.airT = 0; c.knock = false;
    if (back) { c.vx = -c.face * 0.75; c.vy = -4.1; c.flip = true; }
    else { c.vx = c.face * 1.35; c.vy = -2.8; c.flip = false; }
    sfx('jump');
  }

  function humanDriving(c) { return c === game.active && c.team.ctrl === 'human' && !game.overlay && (game.state === 'play' || game.state === 'retreat'); }

  /* Vine Swing: the Snag hangs from an anchor point like a pendulum */
  function swingStep(c) {
    var s = c.swing;
    c.vy += G;
    if (humanDriving(c)) {
      if (inp.left) c.vx -= 0.06;
      if (inp.right) c.vx += 0.06;
      if (inp.up) s.len = Math.max(18, s.len - 1);
      if (inp.down) s.len = Math.min(170, s.len + 1);
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
    var drive = humanDriving(c), thrust = drive && inp.up && game.fuel > 0;
    c.vy += thrust ? -0.22 : G * 0.6;
    if (thrust) { game.fuel -= 1; if (game.t % 6 === 0) sfx('jet'); }
    if (drive && game.fuel > 0) {
      if (inp.left) { c.vx -= 0.08; game.fuel -= 0.4; c.face = -1; }
      if (inp.right) { c.vx += 0.08; game.fuel -= 0.4; c.face = 1; }
    }
    c.vx = clamp(c.vx * 0.99, -2.2, 2.2); c.vy = clamp(c.vy, -2.4, 4);
    airStep(c, true);
  }

  /* Sand Sled: slide along the ground, faster downhill, and fly off steep edges */
  function sledStep(c) {
    if (humanDriving(c)) {
      if (inp.left) c.sv -= 0.05;
      if (inp.right) c.sv += 0.05;
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
    if (v > 2) sfx('land', 0.6);
    c.landT = 6;
  }

  function updSnag(c) {
    if (c.hurtT > 0) c.hurtT--;
    if (c.walking > 0) c.walking--;
    if (c.landT > 0) c.landT--;
    if (c.cheerT > 0) c.cheerT--;
    if (!c.alive) return;
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
    c.hp = Math.max(0, c.hp - dm); c.hurtT = 45;
    addPart({ k: 'txt', x: c.x, y: c.y - 44, vy: -0.35, life: 80, s: '-' + dm });
    if (src && src.by && src.by.team !== c.team && dm > game.stats.best) { game.stats.best = dm; game.stats.bestBy = src.by.name; }
    voice(c.team.era, 'hurt');
    if (c === game.active) {
      if (game.state === 'retreat') game.retreat = Math.min(game.retreat, 20);
      else if (game.state === 'play' && !game.fired) endTurn();
    }
  }

  function drown(c) {
    c.alive = false; c.hp = 0;
    for (var i = 0; i < 14; i++) addPart({ k: 'drop', x: c.x + rand(-4, 4), y: WATER, vx: rand(-1.2, 1.2), vy: rand(-3.2, -1.2), life: 50 });
    game.portals.push({ x: c.x, y: WATER - 12, t: 0, c: c });
    sfx('splash'); sfx('portal'); voice(c.team.era, 'panic');
    say('water');
    if (c === game.active && (game.state === 'play' || game.state === 'retreat')) endTurn();
  }

  function zapHome(c) {
    c.alive = false;
    game.portals.push({ x: c.x, y: c.y - 12, t: 0, c: c });
    sfx('portal'); voice(c.team.era, 'hurt');
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
      }
    }
    if (p.age > (w.life || 1500)) return 'explode';
    return null;
  }

  function addPart(p) { if (game.parts.length < 600) game.parts.push(p); }

  function explode(x, y, R, dmg, src) {
    var deb = [], i;
    for (i = 0; i < 28; i++) {
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
      addPart({ k: 'deb', x: d[1], y: d[2], vx: Math.cos(a2) * sp, vy: Math.sin(a2) * sp - 1.5, life: 70, col: d[0], big: Math.random() < 0.3 });
    });
    addPart({ k: 'fire', x: x, y: y, life: 16, max: 16, r: R });
    for (i = 0; i < 6; i++) addPart({ k: 'smoke', x: x + rand(-R / 2, R / 2), y: y + rand(-R / 2, R / 3), vx: rand(-0.2, 0.2), vy: rand(-0.6, -0.2), life: 60 + Math.random() * 30, r: rand(3, 7) });
    var reach = R + 10, hits = 0, maxDm = 0;
    game.snags.forEach(function (c) {
      if (!c.alive) return;
      var dx = c.x - x, dy = (c.y - 9) - y, d = Math.sqrt(dx * dx + dy * dy);
      if (d >= reach) return;
      var f = 1 - d / reach, dm = Math.round(dmg * f);
      if (dm > 0) { hurt(c, dm, src); if (!src || !src.by || src.by.team !== c.team) { hits++; maxDm = Math.max(maxDm, dm); } }
      var pw = (dmg * 0.085 * f + 0.6) * ((src && src.kmul) || 1) * (c.shield ? 0.5 : 1), a3 = Math.atan2(dy, dx);
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
    game.shake = Math.max(game.shake, Math.min(6, dmg / 9));
    sfx('boom', dmg / 50);
    if (hits >= 2) say('double');
    else if (maxDm >= 40) say('big');
  }

  function splash(x) {
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
    if (isNew) museum.found[a.id] = { at: Date.now(), by: c.name };
    saveMuseum();
    if (game.finds.indexOf(a.id) < 0) game.finds.push(a.id);
    for (var k = 0; k < 14; k++) addPart({ k: 'spark', x: a.x, y: a.y - 6, vx: rand(-2, 2), vy: rand(-2.5, -0.5), life: 40 });
    sfx('find'); c.cheerT = 45;
    say(info.glitch ? 'glitch' : 'find', true);
    showFind(info, isNew);
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
      game.courier = { x: sx, y: sy, px: sx, py: sy - 12, dir: dir, dropX: x, t: 0, phase: 'out', carry: true, kind: Math.random() < 0.2 ? 'bark' : 'snack' };
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
    if (cr.kind === 'bark') {
      s.team.bark = (s.team.bark || 0) + 1;
      addPart({ k: 'txt', x: s.x, y: s.y - 44, vy: -0.35, life: 90, s: 'BARK!', col: '#ffd27a' });
      banner(s.team.name + " found Bonnie's Bark!", s.team.ctrl === 'human' ? 'A rare surprise. It is in your kit now.' : 'A rare surprise...');
      sfx('find');
    } else {
      var heal = Math.min(25, 100 - s.hp);
      s.hp += heal;
      addPart({ k: 'txt', x: s.x, y: s.y - 44, vy: -0.35, life: 80, s: '+' + heal, col: '#9be36b' });
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
  var jayOn = store('jay') !== '0', jayLast = -9999, jayHide = 0, jayTalk = 0;
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
    voice('jay', 'turn');
  }
  function jayTick() {
    if (jayTalk > 0) { jayTalk--; if (jayTalk % 6 === 0) SP.jay(jayCv, jayTalk > 0 && (jayTalk / 6) % 2 === 1); }
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
    game.active = c; game.turnNo++;
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
      setTimeout(function () {
        if (sty === 'city') banner('Reactor meltdown!', 'Energy blasts fall and the goo rises after every go. Hang in there.');
        else if (sty === 'desert') banner('Sandstorm!', 'Rocks fly in the wind and the Nile floods after every go. Hang in there.');
        else banner('Sudden Death!', 'Meteors fall and the water rises after every go. Hang in there.');
      }, 2600);
      say(sty === 'city' ? 'reactor' : (sty === 'desert' ? 'sandstorm' : 'sudden'), true);
    }
    if (game.sudden && MAP.style === 'desert' && Math.abs(game.wind) < 5) game.wind = (game.wind < 0 ? -1 : 1) * (5 + Math.floor(Math.random() * 4));
    maybeDeliver();
    banner(c.name + "'s go", team.name + (team.ctrl === 'ai' ? ' (computer)' : (game.opts && game.opts.mode === 'friend' ? ' (' + team.label + ')' : '')));
    voice(team.era, 'turn');
    musicEra(team.era);
    game.ai = team.ctrl === 'ai' ? { phase: 'wait', t: 0, walked: false } : null;
    saveMatch();
    hudStatic();
  }

  function nextTurn() {
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
    var busy = game.projs.length > 0 || !!game.barker || game.strikes.length > 0 || game.warn.length > 0, i;
    for (i = 0; i < game.snags.length && !busy; i++) { var c = game.snags[i]; if (c.alive && c.st === 'air') busy = true; }
    game.settleAll = (game.settleAll || 0) + 1;
    if (busy && game.settleAll < 900) { game.settleT = 0; return; }
    if (++game.settleT < 30) return;
    var dying = game.snags.filter(function (s) { return s.alive && s.hp <= 0; });
    if (dying.length) { dying.forEach(zapHome); game.state = 'portals'; game.portT = 75; return; }
    afterSettle();
  }

  function afterSettle() { if (checkOver()) return; nextTurn(); }

  function checkOver() {
    var left = game.teams.filter(teamAlive);
    if (left.length > 1) return false;
    game.winner = left[0] || null; game.state = 'over'; game.active = null;
    store('save', null);
    if (!TEST) bumpStat('matches');
    if (game.winner) voice(game.winner.era, 'cheer');
    say('win', true);
    setTimeout(showOver, 1800);
    return true;
  }

  function passTurn() {
    if (game.state !== 'play' || game.fired) return;
    banner(game.active.name + ' has a breather', 'No worries, on to the next squad');
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
      banner(av.locked ? weaponName(c.team.era, wid) + ' unlocks in ' + av.locked + (av.locked === 1 ? ' turn' : ' turns') : 'None of those left', 'Pick something else from the kit');
      return;
    }
    game.fired = true; game.charging = false; game.stats.shots++;
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
      sfx(wid === 'lob' || wid === 'disc' ? 'shoot' : 'throw');
      game.lastPower = Math.round(pw);
    } else if (w.kind === 'place') {
      p = { type: wid, era: c.team.era, x: c.x + c.face * 7, y: c.y - 4, vx: c.face * 0.3, vy: -0.4, age: 0, by: c, trail: [], rest: false, fuse: w.fuse, kmul: w.knock || 1 };
      game.projs.push(p); sfx('throw');
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
    game.state = 'retreat'; game.retreat = 180; game.power = 0;
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
    if (game.fuel <= 0) { banner('Out of fuel', 'It fills up again on your next go'); return; }
    c.jet = true; c.swing = null; c.knock = false; c.flip = false;
    if (c.st === 'ground' && bodyClear(c.x, c.y - 2)) c.y -= 2;
    c.st = 'air'; c.vy = -1.2;
    sfx('jet'); say('jet');
  }

  function useSled(c) {
    if (c.sled) { c.sled = false; c.sv = 0; return; }
    if (game.sledFuel <= 0) { banner('The sled needs a rest', 'It is ready again on your next go'); return; }
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
    } else if (r.wall) carve(r.x, r.y, 6, true);
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

  function aiPlan(c, noWalk) {
    var team = c.team, mood = team.mood || 'grumpy';
    var E = { sleepy: { a: 8, p: 10, r: 0.3 }, grumpy: { a: 4.5, p: 6, r: 0.1 }, legendary: { a: 1, p: 1.5, r: 0 } }[mood];
    var A = AIP[team.era] || AIP.fut, fw = A.fw;
    var cands = [], face, a, pw, res, s;
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
    for (face = -1; face <= 1; face += 2) {
      for (a = -30; a <= 85; a += 5) for (pw = 20; pw <= 100; pw += 5) {
        res = simShot(c, 'lob', face, a, pw);
        if (!res) continue;
        s = res.water ? -1 : scoreAt(res.x, res.y, WEAP.lob.R, WEAP.lob.dmg, team, fw, c);
        cands.push({ weapon: 'lob', face: face, aim: a, power: pw, score: s * A.lob });
      }
      for (a = -10; a <= 80; a += 10) for (pw = 30; pw <= 100; pw += 10) {
        res = simShot(c, 'bomb', face, a, pw);
        if (!res) continue;
        s = res.water ? -1 : scoreAt(res.x, res.y, WEAP.bomb.R, WEAP.bomb.dmg, team, fw, c);
        cands.push({ weapon: 'bomb', face: face, aim: a, power: pw, score: s * A.bomb });
      }
      /* era kit: Stone Snags love the boulder, Neon Snags love precision, Sun Snags hunt for direct hits */
      if (kitHas(team, 'boulder') && avail(team, 'boulder').ok) {
        for (a = -10; a <= 70; a += 10) for (pw = 30; pw <= 100; pw += 10) {
          res = simShot(c, 'boulder', face, a, pw);
          if (!res) continue;
          s = res.water ? -1 : scoreAt(res.x, res.y, WEAP.boulder.R, WEAP.boulder.dmg, team, fw, c);
          cands.push({ weapon: 'boulder', face: face, aim: a, power: pw, score: s * 1.2 });
        }
      }
      if (kitHas(team, 'disc') && avail(team, 'disc').ok) {
        for (a = -40; a <= 60; a += 4) {
          res = simShot(c, 'disc', face, a, 80);
          if (!res) continue;
          s = res.water ? -1 : scoreAt(res.x, res.y, WEAP.disc.R, WEAP.disc.dmg, team, fw, c);
          cands.push({ weapon: 'disc', face: face, aim: a, power: 80, score: s * 1.15 });
        }
      }
      if (kitHas(team, 'laser') && avail(team, 'laser').ok) {
        for (a = -40; a <= 60; a += 2) {
          var lt = laserTrace(c, face, a);
          if (lt.hit && lt.hit.team !== team) cands.push({ weapon: 'laser', face: face, aim: a, power: 0, score: (32 + (lt.hit.hp <= 32 ? 25 : 0)) * 1.1 });
        }
      }
      if (kitHas(team, 'spear') && avail(team, 'spear').ok) {
        for (a = -30; a <= 60; a += 3) for (pw = 50; pw <= 100; pw += 10) {
          res = simShot(c, 'spear', face, a, pw);
          if (!res) continue;
          s = res.water ? -1 : scoreAt(res.x, res.y, WEAP.spear.R, WEAP.spear.dmg, team, fw, c);
          if (res.hit && res.hit !== c) s += res.hit.team !== team ? WEAP.spear.direct + (res.hit.hp <= WEAP.spear.direct + 8 ? A.kill : 0) + (res.hit.y > WATER - 60 ? A.water : 0) : -WEAP.spear.direct * fw;
          cands.push({ weapon: 'spear', face: face, aim: a, power: pw, score: s * 1.15 });
        }
      }
      if (kitHas(team, 'scarab') && avail(team, 'scarab').ok) {
        for (a = -10; a <= 70; a += 10) for (pw = 30; pw <= 100; pw += 10) {
          res = simShot(c, 'scarab', face, a, pw);
          if (!res || res.water) continue;
          s = scoreAt(res.x, res.y, WEAP.scarab.R, WEAP.scarab.dmg, team, fw, c);
          var tg = nearestFrom(res.x, res.y);
          if (tg && Math.abs(c.x - res.x) > 30) s = Math.max(s, scoreAt(tg.x, tg.y - 6, WEAP.scarab.R, WEAP.scarab.dmg, team, fw, c) * 0.75);
          cands.push({ weapon: 'scarab', face: face, aim: a, power: pw, score: s * 1.1 });
        }
      }
    }
    var kit = ER[team.era].kit || [], sup = kit[4], defW = kit[3];
    if (sup && avail(team, sup).ok) {
      enemies.forEach(function (en) {
        cands.push({ weapon: sup, face: en.x > c.x ? 1 : -1, aim: Math.round(c.aim), power: 0, tx: en.x,
          score: scoreAt(en.x, en.y - 9, WEAP[sup].R, WEAP[sup].dmg, team, fw, c) * 0.95 });
      });
    }
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
    if (!pick || pick.score < 3) {
      if (!noWalk && enemies.length) {
        var near = enemies.reduce(function (b, o) { return Math.abs(o.x - c.x) < Math.abs(b.x - c.x) ? o : b; });
        return { type: 'walk', dir: near.x > c.x ? 1 : -1, walkT: 110, t: 0 };
      }
      return { type: 'pass', t: 0 };
    }
    if (E.r && Math.random() < E.r) pick = cands[Math.floor(Math.random() * Math.min(12, cands.length))];
    var exact = pick.weapon === 'shove' || WEAP[pick.weapon].kind === 'strike';
    return {
      type: 'fire', phase: 'aim', t: 0, weapon: pick.weapon, face: pick.face,
      tx: pick.tx === undefined ? undefined : clamp(pick.tx + randn() * E.a * 3, 10, WW - 10),
      aim: Math.round(clamp(pick.aim + (exact ? 0 : randn() * E.a), -80, 85)),
      power: clamp(pick.power + randn() * E.p, 10, 100)
    };
  }

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
      if (A.t > 40 && c.st === 'ground') { var P = aiPlan(c, A.walked); P.walked = A.walked; game.ai = P; }
      return;
    }
    if (A.type === 'pass') { if (A.t > 20) passTurn(); return; }
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
      if (Math.abs(d) <= 1.5) { c.aim = A.aim; A.phase = 'charge'; A.t = 0; }
      else c.aim += d > 0 ? 1.5 : -1.5;
      return;
    }
    if (A.phase === 'charge') {
      if (WEAP[game.weapon].kind !== 'proj') { if (A.t > 10) fire(); return; }
      if (A.t < 12) return;
      game.charging = true;
      game.power = Math.min(100, game.power + 100 / 72);
      if (game.power >= A.power) { game.power = A.power; fire(); }
    }
  }

  /* ---------------- player input ---------------- */
  var inp = { left: false, right: false, up: false, down: false };
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
      banner(av.locked ? weaponName(c.team.era, wid) + ' unlocks in ' + av.locked + (av.locked === 1 ? ' turn' : ' turns') : 'None of those left', 'Pick something else from the kit');
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
      if (inp.left && !inp.right) { if (tryWalk(c, -1)) c.walking = 6; }
      else if (inp.right && !inp.left) { if (tryWalk(c, 1)) c.walking = 6; }
    }
    if (game.state === 'play' && !busy && !c.jet && !c.swing && !c.sled) {
      if (inp.up) c.aim = Math.min(85, c.aim + 1.2);
      if (inp.down) c.aim = Math.max(-80, c.aim - 1.2);
      if (game.charging) { game.power = Math.min(100, game.power + 100 / 72); if (game.power >= 100) fire(); }
    }
  }

  var KMAP = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', KeyA: 'left', KeyD: 'right', KeyW: 'up', KeyS: 'down' };
  document.addEventListener('keydown', function (e) {
    if (game.overlay) {
      if (e.code === 'Escape') {
        if (game.overlay === 'kit' || game.overlay === 'pause' || game.overlay === 'find') { hideOv(); e.preventDefault(); }
        else if (game.overlay === 'help') { closeHelp(); e.preventDefault(); }
        else if (game.overlay === 'museum') { $('bMusClose').click(); e.preventDefault(); }
        else if (game.overlay === 'label') { $('bLblBack').click(); e.preventDefault(); }
      }
      return;
    }
    if (game.state === 'demo' || game.state === 'over') return;
    audioInit();
    game.lookT = 0;
    if (KMAP[e.code]) { inp[KMAP[e.code]] = true; e.preventDefault(); return; }
    switch (e.code) {
      case 'Space': e.preventDefault(); if (!e.repeat) firePress(); break;
      case 'Enter': case 'NumpadEnter': e.preventDefault(); if (!e.repeat) doJump(e.shiftKey); break;
      case 'Backspace': e.preventDefault(); if (!e.repeat) doJump(true); break;
      case 'Tab': e.preventDefault(); openKit(); break;
      case 'Digit1': case 'Digit2': case 'Digit3': case 'Digit4': case 'Digit5':
      case 'Digit6': case 'Digit7': case 'Digit8': case 'Digit9': case 'Digit0':
        if (game.active) { var dn = parseInt(e.code.charAt(5), 10); pickWeapon(kitFor(game.active.team)[dn === 0 ? 9 : dn - 1]); }
        break;
      case 'Escape': case 'KeyP': e.preventDefault(); openPause(); break;
    }
  });
  document.addEventListener('keyup', function (e) {
    if (KMAP[e.code]) inp[KMAP[e.code]] = false;
    if (e.code === 'Space') fireRelease();
  });
  window.addEventListener('blur', function () {
    inp.left = inp.right = inp.up = inp.down = false;
    if (game.charging) { game.charging = false; game.power = 0; }
  });

  /* Drag on the battlefield to aim. */
  var aiming = false;
  function aimAt(e) {
    var c = game.active;
    if (!c) return;
    var rc = cv.getBoundingClientRect();
    var wx = (e.clientX - rc.left) / SCALE + Math.round(cam.x), wy = (e.clientY - rc.top) / SCALE + Math.round(cam.y);
    if (WEAP[game.weapon].kind === 'strike') { game.tx = clamp(wx, 10, WW - 10); return; }
    var dx = wx - c.x, dy = (c.y - 9) - wy;
    if (Math.abs(dx) > 2) c.face = dx > 0 ? 1 : -1;
    c.aim = clamp(Math.round(Math.atan2(dy, Math.abs(dx)) * 180 / Math.PI), -80, 85);
  }
  cv.addEventListener('pointerdown', function (e) {
    audioInit();
    if (!humanTurn() || game.state !== 'play' || game.charging || game.active.st !== 'ground') return;
    aiming = true; game.lookT = 0; aimAt(e);
    try { cv.setPointerCapture(e.pointerId); } catch (err) { /* fine */ }
  });
  cv.addEventListener('pointermove', function (e) { if (aiming && humanTurn() && game.state === 'play' && !game.charging && !game.active.swing && !game.active.jet) aimAt(e); });
  cv.addEventListener('pointerup', function () { aiming = false; });
  cv.addEventListener('pointercancel', function () { aiming = false; });

  /* On screen buttons. */
  var passArmed = 0;
  function passPress() {
    if (!humanTurn() || game.state !== 'play' || game.fired) return;
    var b = document.querySelector('#touch [data-k="pass"]');
    if (passArmed > 0) { passArmed = 0; b.textContent = 'Breather'; passTurn(); return; }
    passArmed = 120; b.textContent = 'Sure?';
  }
  function press(k) {
    game.lookT = 0;
    if (k in inp) inp[k] = true;
    else if (k === 'jump') doJump(false);
    else if (k === 'flip') doJump(true);
    else if (k === 'fire') firePress();
    else if (k === 'weapons') openKit();
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

  /* ---------------- sound: everything generated in code ---------------- */
  var AC = null, master = null, sfxG = null, musG = null, noiseB = null, lastVoice = 0;
  var aud = { music: store('music') !== '0', sfx: store('sfx') !== '0' };
  function audioInit() {
    if (AC) { if (AC.state === 'suspended') AC.resume(); return; }
    try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; return; }
    master = AC.createGain(); master.gain.value = 0.6; master.connect(AC.destination);
    sfxG = AC.createGain(); sfxG.gain.value = aud.sfx ? 1 : 0; sfxG.connect(master);
    musG = AC.createGain(); musG.gain.value = aud.music ? 0.3 : 0; musG.connect(master);
    noiseB = AC.createBuffer(1, AC.sampleRate, AC.sampleRate);
    var d = noiseB.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    if (game.state !== 'demo') musicEra(game.active ? game.active.team.era : 'pre');
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
    if (!AC || !aud.sfx) return;
    k = k || 1;
    switch (n) {
      case 'boom': noise(0.5 * k + 0.25, 0.5, 'lowpass', 1400, 120); tone('sine', 110, 40, 0.5, 0.4); break;
      case 'shoot': noise(0.18, 0.22, 'bandpass', 900, 2600); tone('square', 300, 520, 0.08, 0.05); break;
      case 'throw': noise(0.15, 0.2, 'bandpass', 600, 1500); break;
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
      case 'find':
        [0, 4, 7, 12].forEach(function (s, i) { tone('triangle', 523 * Math.pow(2, s / 12), null, 0.14, 0.09, null, AC.currentTime + i * 0.09); });
        break;
    }
  }
  var XV = { dog: { base: 480, wave: 'square', wobble: 0 }, jay: { base: 150, wave: 'triangle', wobble: 0 } };
  /* Gibberish voices: lower and growly for Stone Snags, bright and buzzy for Neon Snags. */
  function voice(era, mood) {
    if (!AC || !aud.sfx) return;
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
      o.connect(flt); flt.connect(g); g.connect(sfxG); o.start(at); o.stop(at + d + 0.05);
      at += d + 0.02;
    }
  }

  var mus = { era: '', step: 0, next: 0, timer: null, pat: null };
  function makePattern(era) {
    var M = ER[era].music, R = rng(M.seed || 3), lead = [], bass = [], i;
    for (i = 0; i < 32; i++) lead.push(R() < 0.45 ? M.scale[Math.floor(R() * M.scale.length)] + (R() < 0.3 ? 12 : 0) : null);
    for (i = 0; i < 8; i++) bass.push(M.scale[Math.floor(R() * 3)]);
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
      var s = mus.step % 32, t = mus.next;
      if (aud.music && game.state !== 'demo') {
        var ln = mus.pat.lead[s];
        if (ln !== null) tone(M.lead, M.root * Math.pow(2, ln / 12) * 2, null, spb * 0.9, 0.08, musG, t);
        if (s % 4 === 0) tone('triangle', M.root * Math.pow(2, mus.pat.bass[(s / 4) % 8] / 12) / 2, null, spb * 3, 0.16, musG, t);
        if (M.drum === 'tom') {
          if (s % 4 === 0 || s % 8 === 6) tone('sine', 120, 55, 0.18, 0.3, musG, t);
          if (s % 8 === 4) noise(0.06, 0.08, 'bandpass', 2500, null, musG, t);
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
  function applyAudio() {
    store('music', aud.music ? '1' : '0'); store('sfx', aud.sfx ? '1' : '0');
    if (musG) musG.gain.value = aud.music ? 0.3 : 0;
    if (sfxG) sfxG.gain.value = aud.sfx ? 1 : 0;
    $('tMusic').textContent = aud.music ? 'On' : 'Off'; $('tMusic').classList.toggle('on', aud.music);
    $('tSfx').textContent = aud.sfx ? 'On' : 'Off'; $('tSfx').classList.toggle('on', aud.sfx);
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
      teams: game.teams.map(function (t, ti) {
        return {
          era: t.era, name: t.name, ctrl: t.ctrl, mood: t.mood, label: t.label, lastWeapon: t.lastWeapon, bark: t.bark || 0, ammo: t.ammo || {},
          idx: ti === game.tIdx ? t.idx - 1 : t.idx,
          members: t.members.map(function (c) { return { n: c.name, x: Math.round(c.x), y: Math.round(c.y), hp: c.hp, f: c.face, a: Math.round(c.aim), al: c.alive, sh: !!c.shield }; })
        };
      })
    };
    store('save', JSON.stringify(s));
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
    s.teams.forEach(function (st) {
      var t = { era: st.era, name: st.name, ctrl: st.ctrl, mood: st.mood, label: st.label, lastWeapon: st.lastWeapon, idx: st.idx, bark: st.bark || 0, ammo: st.ammo || {}, members: [] };
      st.members.forEach(function (m) {
        var c = makeSnag(t, m.n, m.x, m.y);
        c.hp = m.hp; c.face = m.f; c.aim = m.a; c.alive = m.al; c.shield = !!m.sh;
        t.members.push(c); game.snags.push(c);
      });
      game.teams.push(t);
    });
    game.tIdx = s.tIdx; game.turnNo = s.turnNo - 1; game.stats = s.stats || game.stats;
    game.finds = s.finds || [];
    WATER = s.water || 432; game.sudden = !!s.sudden; miniDirty = true;
    game.arts = (s.arts || []).map(function (a) { return { id: a.id, glitch: !!a.g, x: a.x, y: a.y, st: a.st, vx: 0, vy: 0, rest: false, glint: Math.floor(Math.random() * 240) }; });
    game.crates = (s.crates || []).map(function (c) { return { x: c.x, y: c.y, vx: 0, vy: 0, rest: false, kind: c.k }; });
    hideOv(); inMatch(true);
    startTurn();
    return true;
  }

  /* ---------------- matches ---------------- */
  function resetWorld() {
    game.projs = []; game.parts = []; game.portals = []; game.snags = []; game.teams = [];
    game.stats = { best: 0, bestBy: '', shots: 0 }; game.turnNo = 0; game.winner = null; game.active = null;
    game.ai = null; game.charging = false; game.power = 0; game.lastPower = 0;
    game.arts = []; game.crates = []; game.courier = null; game.barker = null; game.finds = [];
    game.strikes = []; game.warn = []; game.sudden = false; game.tx = null; WATER = 432;
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
        era: eras[i], name: E.team, ctrl: ai ? 'ai' : 'human', mood: o.mood, idx: -1, members: [], lastWeapon: 'lob', bark: 0, ammo: {},
        label: o.mode === 'friend' ? 'Player ' + (i + 1) : (ai ? 'Computer' : 'You')
      });
    }
    spawnAll(o.size);
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
  }

  function demoTick() {
    if (game.t % 150 !== 0 || !game.snags.length) return;
    var c = game.snags[Math.floor(Math.random() * game.snags.length)];
    if (!c.alive || c.st !== 'ground') return;
    var r = Math.random();
    if (r < 0.4) jump(c, Math.random() < 0.35);
    else if (r < 0.7) c.cheerT = 50;
    else c.face = -c.face;
  }

  /* ---------------- main update ---------------- */
  function update() {
    game.t++;
    var i;
    if (game.bannerT > 0 && --game.bannerT === 0) $('banner').classList.remove('show');
    if (passArmed > 0 && --passArmed === 0) { var pb = document.querySelector('#touch [data-k="pass"]'); if (pb) pb.textContent = 'Breather'; }
    for (i = 0; i < game.snags.length; i++) updSnag(game.snags[i]);
    if (game.state === 'play' || game.state === 'retreat') control();
    for (i = game.projs.length - 1; i >= 0; i--) {
      var p = game.projs[i];
      if (!p) continue;
      var ev = stepProj(p, false);
      if (p.trail && (p.type === 'lob' || p.type === 'meteor' || p.type === 'disc' || p.type === 'spear')) { p.trail.push([p.x, p.y]); if (p.trail.length > 10) p.trail.shift(); }
      if (ev) {
        game.projs.splice(i, 1);
        if (ev === 'explode') { explode(p.x, p.y, WEAP[p.type].R, WEAP[p.type].dmg, p); if (WEAP[p.type].direct && p.hitSnag) spearHit(p); }
        else if (ev === 'water') { splash(p.x); say('miss'); }
      } else if (WEAP[p.type].crawl) crawlScarab(p);
    }
    updArts(); updCrates(); updCourier(); updBarker(); updBirds(); updStrikes(); updWarn(); jayTick();
    updParts();
    for (i = game.portals.length - 1; i >= 0; i--) if (++game.portals[i].t > 70) game.portals.splice(i, 1);
    if (game.state === 'play') {
      if (--game.timer <= 0) { banner("Time's up, no worries", 'On to the next squad'); endTurn(); }
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
      p.life--;
      if (p.k === 'deb' || p.k === 'drop') {
        if (!p.stuck) {
          p.vy += G; p.x += p.vx; p.y += p.vy;
          if (p.k === 'deb' && solid(p.x, p.y)) { p.stuck = true; p.life = Math.min(p.life, 25); }
          if (p.k === 'drop' && p.y > WATER + 2 && p.vy > 0) p.life = 0;
        }
      } else if (p.k === 'spark') { p.vy += 0.08; p.x += p.vx; p.y += p.vy; p.vx *= 0.97; }
      else if (p.k === 'smoke') { p.x += p.vx + game.wind * 0.03; p.y += p.vy; p.r += 0.05; }
      else if (p.k === 'txt') { p.y += p.vy; }
      if (p.life <= 0) game.parts.splice(i, 1);
    }
  }

  function camUpdate() {
    var tx, ty, c = game.active, i;
    if (game.lookT > 0 && game.look) { tx = game.look.x; ty = game.look.y; game.lookT--; }
    else if (game.projs.length) { tx = game.projs[0].x; ty = game.projs[0].y; }
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
      else if (c) { tx = c.x; ty = c.y - 20; }
      else if (game.state === 'over' && game.winner) {
        var w = game.winner.members.filter(function (m) { return m.alive; })[0];
        tx = w ? w.x : WW / 2; ty = w ? w.y - 20 : WH - 140;
      } else { tx = WW / 2 + Math.sin(game.t / 600) * 300; ty = 230; }
    }
    var gx = tx - VW / 2, gy = ty - VH / 2;
    gx = VW >= WW ? (WW - VW) / 2 : clamp(gx, 0, WW - VW);
    gy = VH >= WH ? WH - VH : clamp(gy, -140, WH - VH);
    var k = game.state === 'demo' ? 0.03 : 0.09;
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
    if (cityBg) cityBg.forEach(function (L) { ctx.drawImage(L.c, -Math.round(cx * L.f), Math.round(-(cy - rest) * L.f)); });
    game.cars.forEach(function (c) {
      var X = Math.round(c.x), Y = Math.round(c.y - (cy - rest) * 0.3);
      ctx.fillStyle = '#14162e'; ctx.fillRect(X - 2, Y, 5, 2);
      ctx.fillStyle = c.vx > 0 ? '#ffd27a' : '#ff6b9a'; ctx.fillRect(c.vx > 0 ? X + 3 : X - 3, Y, 1, 1);
    });
    game.birds.forEach(function (b) { SP.bird(ctx, b.x, b.y - (cy - rest) * 0.08, ((game.t + b.ph) >> 3) % 2); });
  }

  /* Pyramid Desert backdrop: far pyramids, rolling dunes, then palms on the green bank of the Nile */
  function drawDesertBackdrop(cx, cy, t) {
    var rest = WH - VH, x, u, top, i, neon = LOOK === 'neon', f, off, base;
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
    /* far: a flat horizon with pyramids standing on it */
    f = 0.12; off = (cy - rest) * f; base = VH * 0.64;
    for (x = 0; x < VW; x++) {
      u = x + cx * f;
      var cell = Math.floor(u / 230), lx = u - cell * 230 - 115, size = 26 + hash(cell, 5) * 40, ground = base - 4 - 3 * Math.sin(u * 0.01) - off;
      var peak = hash(cell, 9) < 0.8 ? size - Math.abs(lx) : -1;
      top = Math.round(peak > 0 ? Math.min(ground, base - off - peak) : ground);
      ctx.fillStyle = neon ? '#3a3e6e' : MAP.far; ctx.fillRect(x, top, 1, VH - top);
      if (peak > 0 && base - off - peak < ground) {
        if (lx > 0) { ctx.fillStyle = neon ? '#2c2f57' : MAP.farShade; ctx.fillRect(x, top, 1, Math.round(ground - top)); }
        if (neon) { ctx.fillStyle = lx > 0 ? '#ff78be' : '#5fe0f0'; ctx.fillRect(x, top, 1, 1); }
      }
    }
    /* mid: dunes */
    f = 0.32; off = (cy - rest) * f; base = VH * 0.76;
    for (x = 0; x < VW; x++) {
      u = x + cx * f;
      var hh = 16 + 10 * Math.sin(u * 0.013) + 6 * Math.sin(u * 0.031 + 1.3), slope = Math.cos(u * 0.013) * 0.13 + Math.cos(u * 0.031 + 1.3) * 0.186;
      top = Math.round(base - hh - off);
      ctx.fillStyle = neon ? '#2c2f57' : (slope < 0 ? MAP.midShade : MAP.mid); ctx.fillRect(x, top, 1, VH - top);
      if (!neon) { ctx.fillStyle = '#ecc98e'; ctx.fillRect(x, top, 1, 1); }
    }
    /* near: the green bank of the Nile, with date palms */
    f = 0.55; off = (cy - rest) * f; base = VH * 0.92;
    var bankCol = neon ? '#1f2142' : MAP.bank;
    for (x = 0; x < VW; x++) {
      u = x + cx * f;
      top = Math.round(base - 9 - 2 * Math.sin(u * 0.05) - off);
      ctx.fillStyle = bankCol; ctx.fillRect(x, top, 1, VH - top);
    }
    var c0 = Math.floor((cx * f - 60) / 58);
    for (var c = c0; c <= c0 + Math.ceil(VW / 58) + 2; c++) {
      if (hash(c, 3) > 0.62) continue;
      var pu = c * 58 + 29 + Math.round((hash(c, 6) - 0.5) * 20), pxs = pu - cx * f;
      if (pxs < -40 || pxs > VW + 40) continue;
      var gr = Math.round(base - 9 - 2 * Math.sin(pu * 0.05) - off), ph = 28 + Math.round(hash(c, 4) * 16), lean = (hash(c, 8) - 0.5) * 0.5;
      ctx.fillStyle = neon ? '#14162e' : MAP.nearTrunk;
      for (var k = 0; k < ph; k++) ctx.fillRect(Math.round(pxs + lean * k + Math.sin(k * 0.08) * 1.5), gr - k, 2, 1);
      var tx2 = Math.round(pxs + lean * ph + Math.sin(ph * 0.08) * 1.5), ty2 = gr - ph;
      ctx.fillStyle = neon ? '#14162e' : MAP.near;
      [-2.7, -2.2, -1.75, -1.3, -0.8, -0.35].forEach(function (an) {
        for (var j = 0; j < 13; j++) ctx.fillRect(Math.round(tx2 + Math.cos(an) * j), Math.round(ty2 + Math.sin(an) * j * 0.7 + j * j * 0.045), 2, 1);
      });
      if (!neon) { ctx.fillStyle = '#8a5a2a'; ctx.fillRect(tx2 - 1, ty2 + 1, 2, 2); ctx.fillRect(tx2 + 1, ty2 + 2, 1, 2); }
    }
  }

  function drawBackdrop(cx, cy, t) {
    if (MAP.style === 'city') { drawCityBackdrop(cx, cy, t); return; }
    if (MAP.style === 'desert') { drawDesertBackdrop(cx, cy, t); return; }
    var rest = WH - VH, x, u, top, i;
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
    /* far volcanoes, with lava and lazy smoke */
    var f = 0.15, off = (cy - rest) * f, base = VH * 0.62;
    ctx.fillStyle = MAP.far;
    for (x = 0; x < VW; x++) { u = x + cx * f; top = Math.round(base - farH(u) - off); ctx.fillRect(x, top, 1, VH - top); }
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
    /* mid jungle */
    f = 0.35; off = (cy - rest) * f; base = VH * 0.74;
    ctx.fillStyle = MAP.mid;
    for (x = 0; x < VW; x++) { u = x + cx * f; top = Math.round(base - midH(u) - off); ctx.fillRect(x, top, 1, VH - top); }
    /* near giant trees */
    f = 0.6; off = (cy - rest) * f; base = VH * 0.9;
    for (x = 0; x < VW; x++) {
      u = x + cx * f;
      var cell = Math.floor(u / 64), n2 = u - cell * 64 - 32;
      var ground = Math.round(base - (16 + 6 * Math.sin(u * 0.02)) - off);
      ctx.fillStyle = MAP.near; ctx.fillRect(x, ground, 1, VH - ground);
      var crownY = Math.round(base - 62 - hash(cell, 3) * 26 - off);
      if (Math.abs(n2) < 20) {
        var half = Math.round(Math.sqrt(400 - n2 * n2) * 0.75);
        ctx.fillRect(x, crownY - half, 1, half * 2);
      }
      if (Math.abs(n2) < 2) { ctx.fillStyle = MAP.nearTrunk; ctx.fillRect(x, crownY + 6, 1, ground - crownY - 6); }
    }
  }

  function drawWater(cx, t) {
    var x, wy, alt = game.sudden ? (MAP.goo ? [MAP.goo, MAP.gooTop] : (MAP.flood ? [MAP.flood, MAP.floodTop] : null)) : null;
    ctx.globalAlpha = 0.86; ctx.fillStyle = alt ? alt[0] : MAP.water;
    for (x = cx - 2; x < cx + VW + 2; x += 2) { wy = Math.round(WATER + Math.sin(x * 0.07 + t * 0.05) * 1.5); ctx.fillRect(x, wy, 2, WH + 300 - wy); }
    ctx.globalAlpha = 1; ctx.fillStyle = alt ? alt[1] : MAP.waterTop;
    for (x = cx - 2; x < cx + VW + 2; x += 2) { wy = Math.round(WATER + Math.sin(x * 0.07 + t * 0.05) * 1.5); ctx.fillRect(x, wy, 2, 1); }
  }

  function poseOf(c, t) {
    var act = c === game.active;
    if ((game.state === 'over' && game.winner === c.team) || c.cheerT > 0) return ['cheer', (t >> 4) % 2, 0];
    if (c.sled) return [c.st === 'air' ? 'jump' : 'charge', 0, 0];
    if (act && game.swingT > 0) return ['swing', game.swingT > 12 ? 0 : 1, 0];
    if (act && game.digT > 0) return ['dig', (t >> 3) % 2, 0];
    if (c.swing) return ['jump', 0, 0];
    if (c.jet) return ['jump', (t >> 2) % 2, 0];
    if (c.st === 'air') {
      if (c.knock) return ['panic', (t >> 3) % 2, 0];
      if (c.flip) return ['jump', 0, -c.face * (Math.floor(c.airT / 5) % 4)];
      if (c.vy < 0) return ['jump', 0, 0];
      return ['fall', (t >> 3) % 2, 0];
    }
    if (c.hurtT > 0) return ['panic', (t >> 3) % 2, 0];
    if (c.walking > 0) return ['walk', Math.floor(c.walkd / 4) % 2, 0];
    var k2 = WEAP[game.weapon].kind;
    if (act && game.state === 'play' && (k2 === 'proj' || k2 === 'beam' || k2 === 'vine')) return [game.charging ? 'charge' : 'aim', 0, 0];
    return ['idle', 0, 0];
  }

  function drawSnag(c, t) {
    var ps = poseOf(c, t), era = c.team.era;
    var bl = ps[0] !== 'cheer' && (t + c.blinkAt) % 200 < 7;
    if (c.sled) { SP.draw(ctx, c.x, c.y - 2, c.face, era, ps[0], ps[1], bl, 0); SP.sled(ctx, c.x, c.y, c.face); return; }
    SP.draw(ctx, c.x, c.y + (c.landT > 3 ? 1 : 0), c.face, era, ps[0], ps[1], bl, ps[2]);
    if (ps[0] === 'aim' || ps[0] === 'charge') SP.weapon(ctx, c.x, c.y, c.face, c.aim, game.weapon, era, t);
  }

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
      else SP.bonnie(ctx, b.x, b.y, b.dir, b.phase === 'woof' ? 0 : (t >> 3) % 2, !!b.carry, b.phase === 'woof');
    });
  }

  function drawParts() {
    for (var i = 0; i < game.parts.length; i++) {
      var p = game.parts[i];
      if (p.k === 'deb') { ctx.fillStyle = p.col; var s = p.big ? 2 : 1; ctx.fillRect(Math.round(p.x), Math.round(p.y), s, s); }
      else if (p.k === 'drop') { ctx.fillStyle = '#cfeefa'; ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 2); }
      else if (p.k === 'spark') { ctx.fillStyle = (p.life >> 2) % 2 ? '#fff3c8' : '#ffd27a'; ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1); }
      else if (p.k === 'beam') { pixLine(p.x, p.y + 1, p.x2, p.y2 + 1, '#37c8dc'); if (p.life > 6) pixLine(p.x, p.y, p.x2, p.y2, '#e9fdff'); }
      else if (p.k === 'vinemiss') pixLine(p.x, p.y, p.x2, p.y2, '#3f7a2e', 2);
      else if (p.k === 'smoke') disc(p.x, p.y, p.r, p.life > 45 ? '#cfd4d7' : '#b9c0c4');
      else if (p.k === 'fire') {
        var k = 1 - p.life / p.max, R = p.r * (0.45 + 0.6 * k);
        disc(p.x, p.y, R, k < 0.5 ? '#ef7724' : '#c4572e');
        if (k < 0.75) disc(p.x, p.y, R * 0.65, '#ffd27a');
        if (k < 0.35) disc(p.x, p.y, R * 0.3, '#fff3c8');
      }
    }
  }

  function drawTags(t) {
    game.snags.forEach(function (c) {
      if (!c.alive) return;
      var col = ER[c.team.era].tag, y = Math.round(c.y - 40);
      SP.text(ctx, c.name, c.x, y, col, '#1f2a30', true);
      if (game.state !== 'demo') SP.text(ctx, String(c.hp), c.x, y + 7, '#ffffff', '#1f2a30', true);
      if (c === game.active && game.state === 'play') {
        var ay = y - 9 + Math.round(Math.sin(t * 0.12) * 1.5), ax = Math.round(c.x);
        ctx.fillStyle = '#1f2a30'; ctx.fillRect(ax - 4, ay - 1, 9, 4); ctx.fillRect(ax - 2, ay + 3, 5, 2); ctx.fillRect(ax - 1, ay + 5, 3, 1);
        ctx.fillStyle = col; ctx.fillRect(ax - 3, ay, 7, 2); ctx.fillRect(ax - 1, ay + 2, 3, 2); ctx.fillRect(ax, ay + 4, 1, 1);
      }
    });
    for (var i = 0; i < game.parts.length; i++) {
      var p = game.parts[i];
      if (p.k === 'txt') SP.text(ctx, p.s, p.x, p.y, p.col || '#ffd27a', '#1f2a30', true);
    }
    game.projs.forEach(function (p) {
      if (p.fuse !== undefined) SP.text(ctx, String(Math.ceil(p.fuse / 60)), p.x, p.y - 12, '#ffffff', '#1f2a30', true);
    });
  }

  function render() {
    var t = game.t, sx = 0, sy = 0;
    if (game.shake > 0.3 && !reduceMotion) { sx = rand(-game.shake, game.shake); sy = rand(-game.shake, game.shake); }
    var cx = Math.round(cam.x + sx), cy = Math.round(cam.y + sy), i;
    ctx.drawImage(skyCv, 0, 0);
    drawBackdrop(cx, cy, t);
    ctx.save();
    ctx.translate(-cx, -cy);
    ctx.drawImage(terr, 0, 0);
    drawArtsAndCrates(t);
    drawVines();
    for (i = 0; i < game.snags.length; i++) if (game.snags[i].alive) drawSnag(game.snags[i], t);
    drawShields(t);
    drawDogs(t);
    drawStrikes(t);
    game.portals.forEach(function (p) {
      var k = p.t / 60;
      if (k < 1) SP.draw(ctx, p.x, p.y + 12, p.c.face, p.c.team.era, 'panic', (t >> 3) % 2, false, 0, 1 - k);
      SP.portal(ctx, p.x, p.y, Math.min(1, k), t);
    });
    game.projs.forEach(function (p) { SP.proj(ctx, p, p.era || 'pre', t); });
    drawAim(t);
    drawParts();
    drawWater(cx, t);
    drawTags(t);
    ctx.restore();
    if (game.sudden && MAP.style === 'desert') drawSandstorm(t);
    if (t % 3 === 0 && game.state !== 'demo') drawMini();
  }

  function drawSandstorm(t) {
    ctx.fillStyle = 'rgba(214,170,100,0.14)'; ctx.fillRect(0, 0, VW, VH);
    var dir = game.wind < 0 ? -1 : 1;
    for (var k = 0; k < 70; k++) {
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
  mini.addEventListener('pointerdown', function (e) {
    var rc = mini.getBoundingClientRect();
    game.look = { x: (e.clientX - rc.left) / rc.width * WW, y: (e.clientY - rc.top) / rc.height * WH };
    game.lookT = 240;
    e.stopPropagation();
  });

  /* ---------------- HUD ---------------- */
  function banner(a, b) {
    var el = $('banner');
    el.innerHTML = esc(a) + (b ? '<small>' + esc(b) + '</small>' : '');
    el.classList.add('show');
    game.bannerT = 150;
  }
  function hudStatic() {
    game.teams.forEach(function (tm, i) {
      var el = $('tc' + i);
      if (!el) return;
      el.style.setProperty('--c', ER[tm.era].ui);
      el.querySelector('.tn').textContent = tm.name + (tm.label ? ' (' + tm.label + ')' : '');
    });
  }
  var hudCache = {};
  function setText(id, s) { if (hudCache[id] !== s) { hudCache[id] = s; $(id).textContent = s; } }
  function hudTick() {
    if (game.state === 'demo') return;
    game.teams.forEach(function (tm, i) {
      var el = $('tc' + i);
      if (!el) return;
      var tot = 0;
      tm.members.forEach(function (m) { if (m.alive) tot += m.hp; });
      el.querySelector('.th').textContent = tot;
      el.querySelector('.tb i').style.width = Math.round(tot / Math.max(1, tm.members.length * 100) * 100) + '%';
      el.classList.toggle('now', !!(game.active && game.active.team === tm));
    });
    var w = game.wind, bar = document.querySelector('.wbar i');
    var pct = Math.abs(w) / 10 * 50;
    bar.style.width = pct + '%';
    bar.style.left = w < 0 ? (50 - pct) + '%' : '50%';
    setText('wtxt', w === 0 ? 'calm' : Math.abs(w) + (w > 0 ? ' right' : ' left'));
    var c = game.active, wtxt = '';
    if (c) {
      var name = weaponName(c.team.era, game.weapon), kind = WEAP[game.weapon].kind, av = avail(c.team, game.weapon);
      if (WEAP[game.weapon].ammo || game.weapon === 'bark') name += av.locked ? ' (locked)' : ' (x' + (av.left || 0) + ')';
      if (c.swing) wtxt = 'Swinging \u00b7 fire or jump to let go';
      else if (c.jet) wtxt = 'Jetpack \u00b7 Fuel ' + Math.max(0, Math.round(game.fuel / WEAP.jet.fuel * 100)) + '%';
      else if (kind === 'proj') wtxt = name + ' \u00b7 Angle ' + Math.round(c.aim) + '\u00b0 \u00b7 Power ' + (game.charging ? Math.round(game.power) : (game.lastPower || '--'));
      else if (kind === 'dig') wtxt = name + ' \u00b7 Angle ' + Math.round(Math.min(c.aim, 35)) + '\u00b0';
      else if (kind === 'beam' || kind === 'vine') wtxt = name + ' \u00b7 Angle ' + Math.round(c.aim) + '\u00b0';
      else if (kind === 'strike') wtxt = name + ' \u00b7 drag or use arrows to pick the spot';
      else if (kind === 'sled') wtxt = name + ' \u00b7 ' + (c.sled ? 'Riding! ' : 'Fire to ride \u00b7 ') + 'Fuel ' + Math.max(0, Math.round(game.sledFuel / WEAP.sled.fuel * 100)) + '%';
      else if (kind === 'jet') wtxt = name + ' \u00b7 Fuel ' + Math.max(0, Math.round(game.fuel / WEAP.jet.fuel * 100)) + '%';
      else wtxt = name;
    }
    setText('wpn', wtxt);
    var tb = document.querySelector('.tbar i');
    if (game.state === 'play') {
      var secs = Math.ceil(game.timer / 60);
      setText('ttxt', secs + 's');
      tb.style.width = Math.round(game.timer / (game.turnLen * 60) * 100) + '%';
      tb.classList.toggle('low', secs <= 10);
    } else { setText('ttxt', '--'); tb.style.width = '0%'; }
  }

  /* ---------------- overlays and menus ---------------- */
  var OVS = ['menu', 'kit', 'pause', 'help', 'over', 'find', 'museum', 'label', 'jump', 'postcard', 'names'], helpReturn = null, ovBack = null;
  function showOv(id) {
    OVS.forEach(function (o) { $(o).hidden = o !== id; });
    game.overlay = id;
    inp.left = inp.right = inp.up = inp.down = false;
    if (game.charging) { game.charging = false; game.power = 0; }
  }
  function hideOv() { OVS.forEach(function (o) { $(o).hidden = true; }); game.overlay = null; }
  function paused() {
    var o = game.overlay;
    if (o === 'kit' || o === 'pause' || o === 'find') return true;
    if (o === 'help' && helpReturn === 'pause') return true;
    if ((o === 'museum' || o === 'label') && ovBack === 'pause') return true;
    return false;
  }

  /* ---------- the find card ---------- */
  function paintArt(cv2, id, dark) {
    var x2 = cv2.getContext('2d');
    cv2.width = 12; cv2.height = 12;
    x2.clearRect(0, 0, 12, 12);
    x2.drawImage(SP.artCanvas(id), 0, 0);
    if (dark) { x2.globalCompositeOperation = 'source-in'; x2.fillStyle = '#b9a999'; x2.fillRect(0, 0, 12, 12); x2.globalCompositeOperation = 'source-over'; }
  }
  function showFind(info, isNew) {
    paintArt($('findArt'), info.id, false);
    $('findKick').textContent = info.glitch ? 'A glitch in time!' : (isNew ? 'New for the Time Museum' : 'Already in your museum');
    $('findName').textContent = info.name;
    $('findMeta').textContent = info.glitch ? 'This should not exist yet' : info.when + ' \u00b7 ' + info.where;
    $('findFact').textContent = info.fact;
    $('findNow').textContent = info.now || '';
    $('findNow').hidden = !info.now;
    $('find').classList.toggle('glitch', !!info.glitch);
    showOv('find');
  }
  $('bFindClose').addEventListener('click', hideOv);

  /* ---------- the Time Museum ---------- */
  var musPick = null;
  function caseHtml(a) {
    var got = !!museum.found[a.id];
    return '<button class="case' + (got ? ' got' : '') + (musPick === a.id ? ' on' : '') + '" data-id="' + a.id + '" aria-label="' + esc(got ? a.name : 'Not found yet') + '">' +
      '<canvas width="12" height="12" data-art="' + a.id + '" data-dark="' + (got ? 0 : 1) + '"></canvas><span>' + esc(got ? a.name : '???') + '</span></button>';
  }
  function renderMuseum() {
    var real = [], gl = [];
    MAP_IDS.forEach(function (m) { real = real.concat(realOf(m)); gl = gl.concat(glitchOf(m)); });
    $('musSub').textContent = 'Real finds: ' + museumCount(real) + ' of ' + real.length + ' \u00b7 Glitches: ' + museumCount(gl) + ' of ' + gl.length +
      (museumCount(real) + museumCount(gl) === 0 ? '. Blast the ground near a glint to dig something up.' : '');
    $('musShelves').innerHTML = MAP_IDS.slice().sort(function (a, b) { return MAPS[a].year - MAPS[b].year; }).map(function (m) {
      return '<h3 class="shelf">' + esc(MAPS[m].name) + ' <span class="shelfn">' + museumCount(realOf(m)) + ' of ' + realOf(m).length + '</span></h3>' +
        '<div class="cases">' + realOf(m).map(caseHtml).join('') + '</div>' +
        '<p class="glitchlab">Glitches in time</p><div class="cases">' + glitchOf(m).map(caseHtml).join('') + '</div>';
    }).join('');
    Array.prototype.forEach.call(document.querySelectorAll('#museum canvas[data-art]'), function (c2) { paintArt(c2, c2.getAttribute('data-art'), c2.getAttribute('data-dark') === '1'); });
    var d = $('musDetail');
    if (musPick) {
      var info = artInfo(musPick), got = museum.found[musPick];
      if (got) {
        var lab = museum.labels[musPick];
        d.innerHTML = '<b>' + esc(info.name) + '</b><span class="meta">' + esc(info.glitch ? 'Out of time' : info.when + ' \u00b7 ' + info.where) + '</span>' +
          '<p>' + esc(info.fact) + '</p>' + (info.now ? '<p class="now">' + esc(info.now) + '</p>' : '') +
          (lab ? '<p class="mylabel">Your label: ' + esc(lab) + '</p>' : '') +
          '<p class="meta">Found by ' + esc(got.by || 'a Snag') + '</p>';
      } else {
        d.innerHTML = '<b>Still buried somewhere</b><p>' + (info.glitch ? 'Something strange is hidden somewhere in history. Keep an eye out for glints.' : 'Keep blasting near the glints in the ground. It will turn up.') + '</p>';
      }
      d.hidden = false;
    } else d.hidden = true;
  }
  function openMuseum(from) { ovBack = from; musPick = null; renderMuseum(); showOv('museum'); }
  $('museum').addEventListener('click', function (e) {
    var b = e.target.closest('.case');
    if (!b) return;
    musPick = b.getAttribute('data-id');
    renderMuseum();
    try { $('musDetail').scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' }); } catch (err) { /* older browsers */ }
  });
  $('bMusClose').addEventListener('click', function () { if (ovBack) showOv(ovBack); else hideOv(); if (ovBack === 'menu') refreshMenu(); });

  /* ---------- make a museum label ---------- */
  var lblPick = null, lblFont = false;
  var STARTERS = ['I think this was used for', 'If I took this back in time', 'The weirdest thing about it is', 'I would keep it because'];
  function foundList() { return allArts().filter(function (a) { return museum.found[a.id]; }); }
  function openLabel(from) {
    var list = foundList();
    if (!list.length) return;
    ovBack = from;
    var fresh = list.filter(function (a) { return game.finds.indexOf(a.id) >= 0; });
    lblPick = (fresh[0] || list[0]).id;
    $('lblText').value = museum.labels[lblPick] || '';
    renderLabel();
    mountSend();
    showOv('label');
  }
  /* Send to Jay, using the site's shared send component when it is there */
  var sendMounted = false;
  function museumReport() {
    var info = artInfo(lblPick), txt = $('lblText').value.trim();
    var realAll = [], glAll = [];
    MAP_IDS.forEach(function (m) { realAll = realAll.concat(realOf(m)); glAll = glAll.concat(glitchOf(m)); });
    var real = realAll.filter(function (a) { return museum.found[a.id]; }).map(function (a) { return a.name; });
    var gl = glAll.filter(function (a) { return museum.found[a.id]; }).map(function (a) { return a.name; });
    return [
      'Museum label for: ' + info.name + (info.glitch ? ' (glitch in time)' : ' (' + info.when + ', ' + info.where + ')'),
      'My label: ' + (txt || '(left blank)'),
      '',
      'My Time Museum so far:',
      'Real finds (' + real.length + ' of ' + realAll.length + '): ' + (real.join(', ') || 'none yet'),
      'Glitches in time (' + gl.length + ' of ' + glAll.length + '): ' + (gl.join(', ') || 'none yet')
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
  $('bLblPic').addEventListener('click', function () {
    try {
      $('lblCard').toBlob(function (b) {
        if (!b) return;
        var a = document.createElement('a');
        a.href = URL.createObjectURL(b); a.download = 'museum-label-' + lblPick + '.png';
        document.body.appendChild(a); a.click(); a.remove();
        $('lblSaved').textContent = 'Picture saved, if your device allows downloads.';
      });
    } catch (e) { $('lblSaved').textContent = 'This device would not save the picture.'; }
  });
  $('bLblBack').addEventListener('click', function () { if (ovBack) showOv(ovBack); else hideOv(); });

  /* ---------- the squad picker: a to scale timeline ---------- */
  var tlCv = $('tl'), TL0 = -12000, TL1 = 3400;
  function tlX(yr) { return Math.round(8 + (yr - TL0) / (TL1 - TL0) * (tlCv.width - 16)); }
  function yearsApart(a, b) { var n = Math.abs(a - b) - (a < 0 && b > 0 ? 1 : 0); return n >= 10000 ? Math.round(n / 1000) * 1000 : Math.round(n / 100) * 100; }
  function drawTimeline() {
    var x2 = tlCv.getContext('2d'), W = tlCv.width, base = 46, i;
    x2.clearRect(0, 0, W, tlCv.height);
    x2.fillStyle = '#1f2a30'; x2.fillRect(6, base, W - 12, 2);
    [[-10000, '10000 BC'], [-5000, '5000 BC'], [1, 'AD 1']].forEach(function (tk) {
      var x = tlX(tk[0]); x2.fillStyle = '#1f2a30'; x2.fillRect(x, base - 2, 1, 6);
      SP.text(x2, tk[1], x, base + 7, '#5a4a3c', null, true);
    });
    var nx = tlX(2026);
    x2.fillStyle = '#ef7724'; x2.fillRect(nx, base - 4, 1, 8);
    SP.text(x2, 'NOW', nx - 9, base + 7, '#ef7724', null, true);
    TL.forEach(function (e2) {
      if (e2.ready) return;
      x2.fillStyle = '#b9a999'; x2.fillRect(tlX(e2.year) - 1, base - 1, 3, 4);
    });
    var sel = opts.era, foe = foeOf(opts), tour = opts.mode === 'tour';
    TL.forEach(function (e2) {
      if (!e2.ready || !ER[e2.id]) return;
      var x = tlX(e2.year), on = e2.id === sel, vs = !tour && e2.id === foe;
      SP.draw(x2, x, base, x < W / 2 ? 1 : -1, e2.id, on ? 'cheer' : 'idle', on ? (Math.floor(Date.now() / 300) % 2) : 0, false, 0);
      var tw = SP.textWidth(ER[e2.id].team), tx = clamp(x, tw / 2 + 2, W - tw / 2 - 2);
      SP.text(x2, ER[e2.id].team, tx, 2, on || vs ? ER[e2.id].tag : '#9a8a7c', on || vs ? '#1f2a30' : null, true);
      if (on) { x2.fillStyle = '#1f2a30'; x2.fillRect(x - 4, base + 14, 9, 1); }
      if (vs) { x2.fillStyle = '#1f2a30'; for (var d = -4; d <= 4; d += 2) x2.fillRect(x + d, base + 14, 1, 1); }
    });
    var me = sel, a = TL.filter(function (e2) { return e2.id === me; })[0], b = TL.filter(function (e2) { return e2.id === foe; })[0];
    var later = TL.filter(function (e2) { return !e2.ready; }).map(function (e2) { return e2.name; });
    var you = (opts.mode === 'friend' ? 'Player 1: ' : 'You: ') + ER[me].team + ', ' + a.label + '. ';
    if (tour) $('tlText').textContent = you + 'On the tour you face whichever squad lives at each stop. Still to come: ' + later.join(', ') + '.';
    else $('tlText').textContent = you + (opts.mode === 'friend' ? 'Player 2: ' : 'Them: ') + ER[foe].team + ', ' + b.label + '. That is about ' +
      yearsApart(a.year, b.year).toLocaleString('en-GB') + ' years apart. Still to come: ' + later.join(', ') + '.';
  }
  tlCv.addEventListener('click', function (e) {
    var rc = tlCv.getBoundingClientRect(), x = (e.clientX - rc.left) / rc.width * tlCv.width, best = null, bd = 1e9;
    TL.forEach(function (e2) { if (!e2.ready) return; var d = Math.abs(tlX(e2.year) - x); if (d < bd) { bd = d; best = e2; } });
    if (best) { if (best.id === opts.foe) opts.foe = opts.era; opts.era = best.id; audioInit(); sfx('click'); refreshMenu(); }
  });
  setInterval(function () { if (game.overlay === 'menu') drawTimeline(); }, 300);

  var touchOn = store('touch') !== null ? store('touch') === '1' : !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  var matchOn = false;
  function inMatch(on) {
    matchOn = on;
    $('hud').hidden = !on; $('info').hidden = !on;
    $('touch').hidden = !(on && touchOn);
    document.body.classList.toggle('touch', on && touchOn);
  }
  function applyTouch() {
    store('touch', touchOn ? '1' : '0');
    $('tTouch').textContent = touchOn ? 'On' : 'Off'; $('tTouch').classList.toggle('on', touchOn);
    inMatch(matchOn);
  }

  function openKit() {
    if (!humanTurn() || game.state !== 'play' || game.charging || game.fired) return;
    var team = game.active.team, era = ER[team.era], html = '';
    kitFor(team).forEach(function (wid, i) {
      var w = wid === 'bark' ? { name: BARK_NAME, blurb: BARK_BLURB } : era.weapons[wid];
      var av = avail(team, wid), W2 = WEAP[wid], note;
      if (W2.tool) note = 'Free move: does not use up your go';
      else if (av.locked) note = 'Unlocks in ' + av.locked + (av.locked === 1 ? ' turn' : ' turns');
      else if (av.left !== undefined) note = av.left + ' left';
      else note = 'As many as you like';
      var cls = (wid === game.weapon ? 'on' : '') + (wid === 'bark' || W2.kind === 'strike' ? ' gold' : '') + (!W2.tool && !av.ok ? ' off' : '');
      html += '<button data-w="' + wid + '" class="' + cls + '"><b>' + esc(w.name) + '</b><span>' + esc(w.blurb) + '</span><br><em>' + (touchOn ? '' : 'Key ' + ((i + 1) % 10) + ' \u00b7 ') + esc(note) + '</em></button>';
    });
    html += '<button data-w="pass"><b>Have a breather</b><span>Pass this turn. No penalty at all.</span></button>';
    $('kitList').innerHTML = html;
    showOv('kit');
  }
  $('kitList').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var wid = b.getAttribute('data-w');
    hideOv();
    if (wid === 'pass') passTurn(); else pickWeapon(wid);
  });
  $('bKitClose').addEventListener('click', hideOv);

  function openPause() { if (game.state === 'demo' || game.state === 'over') return; showOv('pause'); }
  $('bPause').addEventListener('click', function () { audioInit(); openPause(); });
  $('bUnpause').addEventListener('click', hideOv);
  $('bLeave').addEventListener('click', function () {
    if (game.state === 'play') saveMatch();
    inMatch(false); startDemo(); refreshMenu(); showOv('menu');
  });
  $('tMusic').addEventListener('click', function () { audioInit(); aud.music = !aud.music; applyAudio(); });
  $('tSfx').addEventListener('click', function () { audioInit(); aud.sfx = !aud.sfx; applyAudio(); });
  $('tTouch').addEventListener('click', function () { touchOn = !touchOn; applyTouch(); });

  function openHelp(from) { helpReturn = from; showOv('help'); }
  function closeHelp() { if (helpReturn) showOv(helpReturn); else hideOv(); }
  $('bHelp').addEventListener('click', function () { openHelp('menu'); });
  $('bHelp2').addEventListener('click', function () { openHelp('pause'); });
  $('bHelpClose').addEventListener('click', closeHelp);

  function showOver() {
    if (game.state !== 'over') return;
    var w = game.winner, o = game.opts || {}, title, text;
    if (!w) { title = "It's a draw!"; text = 'Everyone got zapped home at once. Fancy another go?'; }
    else if (o.mode === 'cpu' && w.ctrl === 'ai' && TEST !== 'aivai') {
      title = 'The ' + MOODS[w.mood] + ' computer took this one';
      text = 'Close one. Fancy a rematch, or a different mood?';
    } else {
      title = 'The ' + w.name + ' win!';
      text = (o.mode === 'friend' ? w.label + ' takes it. ' : 'Nice work. ') + 'Fancy another?';
    }
    $('overTitle').textContent = title;
    $('overText').textContent = text;
    var st = [];
    if (game.stats.best > 0) st.push('Biggest hit: ' + game.stats.best + ' by ' + game.stats.bestBy);
    st.push('Turns played: ' + game.turnNo);
    st.push('Shots fired: ' + game.stats.shots);
    $('overStats').innerHTML = st.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
    var fl = game.finds.map(artInfo).filter(Boolean);
    if (fl.length) {
      $('overFinds').innerHTML = '<b>Dug up this match</b><div class="finds">' + fl.map(function (a) {
        return '<span class="fd"><canvas width="12" height="12" data-art="' + a.id + '"></canvas>' + esc(a.name) + '</span>';
      }).join('') + '</div>';
      Array.prototype.forEach.call(document.querySelectorAll('#overFinds canvas'), function (c2) { paintArt(c2, c2.getAttribute('data-art'), false); });
      var withNow = fl.filter(function (a) { return a.now; })[0];
      $('overReal').textContent = withNow ? withNow.now : (fl.some(function (a) { return !a.glitch; }) ?
        ({ city: 'Museums collect everyday things like these right now, so people in the future can see how we lived.',
           desert: 'Archaeologists are still making new finds in Egypt today. The oldest papyrus ever found only turned up in 2013.' }[MAP.id] || 'Archaeologists still dig up Stone Age finds like these in Britain today.') :
        'Something from the future turned up in the past. If time travellers leave a mess like that, should we time travel at all?');
    } else {
      $('overFinds').innerHTML = '';
      $('overReal').textContent = 'No finds this time. Big booms uncover buried treasure, and a glint on the ground is the clue.';
    }
    $('bLabel').hidden = foundList().length === 0;
    var tourOn = !!(game.opts && game.opts.tour && game.tour);
    $('overTour').hidden = !tourOn;
    $('bNext').hidden = true; $('bPostcard').hidden = true;
    $('bRematch').hidden = tourOn;
    $('bSettings').textContent = tourOn ? 'Have a break' : 'Change settings';
    if (tourOn) {
      var T = game.tour;
      T.results[T.stop] = { map: TOUR_STOPS[T.stop], winner: game.winner ? game.winner.era : null };
      saveTour();
      snapShot();
      if (T.stop + 1 < TOUR_STOPS.length) {
        var nm = MAPS[TOUR_STOPS[T.stop + 1]];
        $('overTour').textContent = 'Time Tour stop ' + (T.stop + 1) + ' of ' + TOUR_STOPS.length + ' done. Whoever won here changes the ' + nm.name + '. Next stop: ' + yearLabel(nm.year) + '.';
        $('bNext').hidden = false;
      } else {
        $('overTour').textContent = 'That was the last stop. Time to send a postcard home about what changed.';
        $('bPostcard').hidden = false;
      }
    }
    showOv('over');
  }
  $('bLabel').addEventListener('click', function () { openLabel('over'); });
  $('bMuseum').addEventListener('click', function () { openMuseum('menu'); });
  $('bMuseum2').addEventListener('click', function () { openMuseum('pause'); });
  $('tJay').addEventListener('click', function () {
    jayOn = !jayOn; store('jay', jayOn ? '1' : '0');
    if (!jayOn) $('jay').hidden = true;
    $('tJay').textContent = jayOn ? 'On' : 'Off'; $('tJay').classList.toggle('on', jayOn);
  });
  $('tJay').textContent = jayOn ? 'On' : 'Off'; $('tJay').classList.toggle('on', jayOn);
  SP.jay(jayCv, false);
  $('bRematch').addEventListener('click', function () { audioInit(); newMatch(game.opts); });
  $('bSettings').addEventListener('click', function () { inMatch(false); startDemo(); refreshMenu(); showOv('menu'); });

  /* ---------- Time Tour: the campaign where winners change history ---------- */
  var TOUR_STOPS = MAP_IDS.slice().sort(function (a, b) { return MAPS[a].year - MAPS[b].year; });
  function saveTour() { store('tour', game.tour ? JSON.stringify(game.tour) : null); }
  function loadTourState() { try { return JSON.parse(store('tour') || 'null'); } catch (e) { return null; } }
  function yearLabel(y) { var n = Math.abs(y), t = n >= 10000 ? n.toLocaleString('en-GB') : String(n); return y < 0 ? t + ' BC' : 'AD ' + t; }
  function startTour(o) {
    game.tour = { era: o.era, mood: o.mood, size: o.size, turn: o.turn, sd: o.sd, names: o.names, stop: 0, results: [] };
    saveTour();
    playStop();
  }
  /* at each stop you face the squad who lives there, or the nearest one in time if that is you */
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
    newMatch({ mode: 'cpu', mood: T.mood, era: T.era, foe: tourFoe(T.stop, T.era), size: T.size, turn: T.turn, sd: T.sd, map: TOUR_STOPS[T.stop], names: T.names,
      look: rip ? rip.look : 'normal', ammoMods: rip ? rip.ammo : null, tour: true });
    if (rip) setTimeout(function () { banner('History changed!', rip.title); }, 2700);
  }
  function drawJump() {
    var c2 = $('jumpTl'), x2 = c2.getContext('2d'), W = c2.width, T = game.tour;
    var from = MAPS[TOUR_STOPS[T.stop - 1]].year, to = MAPS[TOUR_STOPS[T.stop]].year;
    var X = function (y) { return Math.round(8 + (y - TL0) / (TL1 - TL0) * (W - 16)); };
    x2.clearRect(0, 0, W, c2.height);
    x2.fillStyle = '#1f2a30'; x2.fillRect(6, 24, W - 12, 2);
    var a = X(from), b = X(to);
    for (var x = a; x < b; x += 3) { x2.fillStyle = '#ef7724'; x2.fillRect(x, 20, 2, 1); }
    x2.fillStyle = '#ef7724'; x2.fillRect(b - 3, 18, 1, 5); x2.fillRect(b - 2, 19, 1, 3); x2.fillRect(b - 1, 20, 1, 1);
    SP.text(x2, yearLabel(from).replace(',', ''), a, 30, '#5a4a3c', null, true);
    SP.text(x2, yearLabel(to), Math.min(b, W - 22), 30, '#5a4a3c', null, true);
    SP.draw(x2, a, 23, 1, T.era, 'idle', 0, false, 0);
  }
  function showJump() {
    var T = game.tour, from = MAPS[TOUR_STOPS[T.stop - 1]], to = MAPS[TOUR_STOPS[T.stop]], rip = rippleFor(T.stop);
    $('jumpTitle').textContent = 'Next stop: ' + to.name;
    $('jumpYears').textContent = 'You are jumping about ' + yearsApart(from.year, to.year).toLocaleString('en-GB') + ' years forward, from ' + yearLabel(from.year) + ' to ' + yearLabel(to.year) + '. Waiting for you: the ' + ER[tourFoe(T.stop, T.era)].team + '.';
    $('jumpRipTitle').textContent = 'History changed: ' + rip.title;
    $('jumpRipText').textContent = rip.text;
    drawJump();
    showOv('jump');
    say('tour', true);
  }
  $('bNext').addEventListener('click', function () {
    var T = game.tour;
    if (!T) return;
    T.stop++; saveTour(); store('save', null);
    showJump();
  });
  $('bJumpGo').addEventListener('click', function () { audioInit(); playStop(); });

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
  function openPostcard() {
    $('pcStarters').innerHTML = PC_STARTERS.map(function (t2) { return '<button data-s="' + esc(t2) + '">' + esc(t2) + '...</button>'; }).join('');
    drawPostcard();
    if (!pcMounted && window.Base5Send && window.Base5Send.mount) {
      window.Base5Send.mount($('pcSend'), { tool: 'Timeline Tantrum postcard', getText: postcardText, filename: 'time-tour-postcard' });
      pcMounted = true;
    }
    showOv('postcard');
  }
  $('pcStarters').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var t2 = $('pcText');
    t2.value = (t2.value ? t2.value.replace(/\s*$/, ' ') : '') + b.getAttribute('data-s') + ' ';
    t2.focus(); drawPostcard();
  });
  $('pcText').addEventListener('input', drawPostcard);
  $('bPostcard').addEventListener('click', openPostcard);
  $('bPcPic').addEventListener('click', function () {
    try {
      $('pcCard').toBlob(function (b) {
        if (!b) return;
        var a = document.createElement('a');
        a.href = URL.createObjectURL(b); a.download = 'time-tour-postcard.png';
        document.body.appendChild(a); a.click(); a.remove();
        $('pcSaved').textContent = 'Picture saved, if your device allows downloads.';
      });
    } catch (e) { $('pcSaved').textContent = 'This device would not save the picture.'; }
  });
  $('bPcDone').addEventListener('click', function () {
    try {
      var list = JSON.parse(store('postcards') || '[]');
      list.push({ at: Date.now(), text: $('pcText').value.trim(), changed: changedFull() });
      store('postcards', JSON.stringify(list.slice(-10)));
    } catch (e) { /* keep going */ }
    game.tour = null; saveTour(); store('save', null);
    bumpStat('tours');
    inMatch(false); startDemo(); refreshMenu(); showOv('menu');
  });

  /* ---------- naming the squad ---------- */
  function cleanName(v) { return String(v || '').replace(/[^A-Za-z0-9 !'.-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 10); }
  function genName(era) {
    var E2 = ER[era], b = E2.bits, pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
    var r = Math.random();
    if (r < 0.35) return pick(E2.names);
    var core = pick(b[0]) + pick(b[1]);
    if (r < 0.6 && core.length <= 5) return (pick(E2.titles) + ' ' + core).slice(0, 10);
    return core;
  }
  function namedEras() { return opts.mode === 'friend' ? [opts.era, foeOf(opts)] : [opts.era]; }
  function renderNames() {
    opts.names = opts.names || {};
    $('nameCols').innerHTML = namedEras().map(function (era) {
      var list = opts.names[era] = (opts.names[era] || []).slice(0, 8);
      while (list.length < opts.size) list.push(genName(era));
      var rows = '';
      for (var i = 0; i < opts.size; i++) {
        rows += '<div class="nrow"><input id="nm-' + era + '-' + i + '" data-era="' + era + '" data-i="' + i + '" maxlength="10" value="' + esc(list[i]) + '" aria-label="Snag ' + (i + 1) + ' name">' +
          '<button data-roll="' + era + '" data-i="' + i + '">Roll</button></div>';
      }
      return '<div><h3>' + esc(ER[era].team) + '</h3>' + rows + '</div>';
    }).join('');
  }
  function saveNames() { store('opts', JSON.stringify(opts)); }
  $('bNames').addEventListener('click', function () { renderNames(); showOv('names'); });
  $('nameCols').addEventListener('input', function (e) {
    var inp2 = e.target.closest('input');
    if (!inp2) return;
    var clean = cleanName(inp2.value);
    if (clean !== inp2.value.trim()) inp2.value = clean;
    opts.names[inp2.getAttribute('data-era')][+inp2.getAttribute('data-i')] = clean;
    saveNames();
  });
  $('nameCols').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-roll]');
    if (!b) return;
    var era = b.getAttribute('data-roll'), i = +b.getAttribute('data-i');
    opts.names[era][i] = genName(era);
    $('nm-' + era + '-' + i).value = opts.names[era][i];
    audioInit(); sfx('click'); saveNames();
  });
  $('bRollAll').addEventListener('click', function () {
    namedEras().forEach(function (era) { for (var i = 0; i < opts.size; i++) opts.names[era][i] = genName(era); });
    renderNames(); audioInit(); sfx('twinkle'); saveNames();
  });
  $('bNamesDone').addEventListener('click', function () { saveNames(); showOv('menu'); refreshMenu(); });

  /* menu options */
  var opts = { mode: 'cpu', mood: 'sleepy', era: 'pre', foe: null, size: 3, turn: 60, sd: 'on', map: 'jungle', names: null };
  try { var so = JSON.parse(store('opts') || 'null'); if (so) for (var k in opts) if (so[k] !== undefined) opts[k] = so[k]; } catch (e) { /* defaults */ }
  function refreshMenu() {
    if (READY.indexOf(opts.era) < 0) opts.era = READY[0];
    if (MAP_IDS.indexOf(opts.map) < 0) opts.map = 'jungle';
    opts.foe = foeOf(opts);
    $('foeChips').innerHTML = READY.filter(function (e) { return e !== opts.era; }).map(function (e) {
      return '<button data-v="' + e + '">' + esc(ER[e].team) + '</button>';
    }).join('');
    $('foeLab').textContent = opts.mode === 'friend' ? "Player 2's squad" : 'Up against';
    $('oFoe').hidden = opts.mode === 'tour';
    Array.prototype.forEach.call(document.querySelectorAll('#menu .chips'), function (ch) {
      var o = ch.getAttribute('data-o');
      Array.prototype.forEach.call(ch.querySelectorAll('button'), function (b) { b.classList.toggle('on', b.getAttribute('data-v') === String(opts[o])); });
    });
    $('sVal').textContent = opts.size;
    $('oMood').hidden = opts.mode === 'friend';
    $('oMap').hidden = opts.mode === 'tour';
    $('tourNote').hidden = opts.mode !== 'tour';
    var T0 = loadTourState();
    $('bResumeTour').hidden = !(T0 && !store('save'));
    if (T0) $('bResumeTour').textContent = 'Carry on your Time Tour (stop ' + Math.min(TOUR_STOPS.length, T0.stop + 1) + ' of ' + TOUR_STOPS.length + ')';
    $('bResume').hidden = !store('save');
    var nf = museumCount(allArts());
    $('bMuseum').textContent = 'Time Museum (' + nf + ' found)';
    drawTimeline();
    $('turnhint').hidden = !(window.innerHeight > window.innerWidth && window.innerWidth < 700);
  }
  Array.prototype.forEach.call(document.querySelectorAll('#menu .chips'), function (ch) {
    ch.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var o = ch.getAttribute('data-o'), v = b.getAttribute('data-v');
      opts[o] = o === 'turn' ? parseInt(v, 10) : v;
      refreshMenu();
    });
  });
  $('sMinus').addEventListener('click', function () { opts.size = Math.max(2, opts.size - 1); refreshMenu(); });
  $('sPlus').addEventListener('click', function () { opts.size = Math.min(8, opts.size + 1); refreshMenu(); });
  $('bStart').addEventListener('click', function () {
    audioInit();
    store('opts', JSON.stringify(opts));
    store('save', null);
    if (opts.mode === 'tour') { startTour(opts); return; }
    newMatch({ mode: opts.mode, mood: opts.mood, era: opts.era, foe: opts.foe, size: opts.size, turn: opts.turn, sd: opts.sd, map: opts.map, names: opts.names });
  });
  $('bResumeTour').addEventListener('click', function () {
    audioInit();
    var T = loadTourState();
    if (!T) { refreshMenu(); return; }
    game.tour = T;
    if (T.results.length > T.stop) {
      if (T.stop + 1 < TOUR_STOPS.length) { T.stop++; saveTour(); showJump(); }
      else openPostcard();
    } else playStop();
  });
  if (TEST === 'museum') { ARTS.jungle.slice(0, 4).concat(ARTS.glitches.slice(0, 1), ARTS.desert.slice(0, 5), ARTS.desertGlitches.slice(0, 2), ARTS.city.slice(0, 3), ARTS.cityGlitches.slice(0, 1)).forEach(function (a) { museum.found[a.id] = { at: 1, by: 'Ug' }; }); }
  $('bResume').addEventListener('click', function () { audioInit(); if (!loadMatch()) { store('save', null); refreshMenu(); } });

  /* ---------------- sizing and loop ---------------- */
  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    SCALE = Math.max(1, Math.floor(Math.min(w / 420, h / 195)));
    VW = Math.ceil(w / SCALE); VH = Math.ceil(h / SCALE);
    cv.width = VW; cv.height = VH;
    cv.style.width = VW * SCALE + 'px'; cv.style.height = VH * SCALE + 'px';
    ctx.imageSmoothingEnabled = false;
    buildSky(); buildCityBg();
    if (!game.overlay || game.overlay === 'menu') refreshMenu();
  }
  window.addEventListener('resize', resize);

  var acc = 0, last = 0, hudN = 0;
  function frame(ts) {
    if (!last) last = ts;
    var dt = Math.min(250, ts - last);
    last = ts;
    if (!paused()) {
      acc += dt * FAST;
      var guard = 0;
      while (acc >= STEP && guard < 40) { update(); acc -= STEP; guard++; }
      if (guard >= 40) acc = 0;
    }
    render();
    if (++hudN % 4 === 0) hudTick();
    requestAnimationFrame(frame);
  }

  resize();
  applyAudio();
  applyTouch();
  startDemo();
  refreshMenu();
  showOv('menu');
  if (TEST === 'aivai') newMatch({ mode: 'cpu', mood: Q.get('mood') || 'grumpy', era: Q.get('era') || 'pre', foe: Q.get('foe') || null, sd: Q.get('sd') || 'on', size: parseInt(Q.get('size') || '3', 10), turn: 60, map: Q.get('map') || 'jungle', look: Q.get('look') || 'normal' });
  requestAnimationFrame(frame);

  /* one plain sentence for BridgeLink Buddy, read from this device's saves */
  function bumpStat(k) {
    try { var st = JSON.parse(store('stats') || '{}'); st[k] = (st[k] || 0) + 1; store('stats', JSON.stringify(st)); } catch (e) { /* fine */ }
  }
  window.B5TantrumLine = function () {
    var st = {}, T = loadTourState();
    try { st = JSON.parse(store('stats') || '{}'); } catch (e) { st = {}; }
    var real = [], gl = [];
    MAP_IDS.forEach(function (m) { real = real.concat(realOf(m)); gl = gl.concat(glitchOf(m)); });
    return 'Time Museum: ' + museumCount(real) + ' of ' + real.length + ' real finds and ' + museumCount(gl) + ' of ' + gl.length + ' glitches. ' +
      'Matches finished: ' + (st.matches || 0) + '. ' +
      (T ? 'On the Time Tour, stop ' + Math.min(TOUR_STOPS.length, T.stop + 1) + ' of ' + TOUR_STOPS.length + '.' : 'Time Tours finished: ' + (st.tours || 0) + '.');
  };

  /* test hooks, used only by automated checks */
  window.B5TEST = { solid: solid, newMatch: newMatch, fire: fire, explode: explode, mask: mask, WEAP: WEAP, cam: cam, update: update, deliver: function () { maybeDeliver(true); },
    zone: zone, inp: inp, pickWeapon: pickWeapon, firePress: firePress, fireRelease: fireRelease, doJump: doJump, setWater: function (v) { WATER = v; } };
})();
