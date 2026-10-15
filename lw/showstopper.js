/* ==========================================================
   LW's Skills HQ - Showstopper
   A pop up rhythm game set backstage. Four stage lights, and
   lights drop towards the glowing footlights: tap the lane as a
   light reaches the line. Every song was composed for this game
   in code, and the band is synthesised live (no sound files).

   No fail state: the band always plays to the end and missed
   notes simply float by. Instant restart, warm messages, sound
   can be turned off, and the timing can be nudged for slower
   screens and speakers.

   Home page:  <script src="/lw/showstopper.js?v=1" data-button="1"></script>
               (adds a Showstopper button and a one line note to .hero)
   Any page:   window.LWShowstopper.open() opens the game.
   Saves { best (per song), plays, sound, speed, nudge } in
   b5.lw.showstopper.v1 on this device.
   Everything is drawn in code. ASCII only in this file.
   ========================================================== */
(function () {
'use strict';
if (window.LWShowstopper) return;

var KEY = 'b5.lw.showstopper.v1';
var GAME = 'Showstopper';
var RED = '#ff5a4e', GOLD = '#ffc53d', TEAL = '#2ed3c6', LILAC = '#c99bff', INK = '#1a0d1c', PLUM = '#5a1650', CREAM = '#fff8ee';
var LANES = 4;
var LCOL = [RED, GOLD, TEAL, LILAC];
var LRGB = [[255, 90, 78], [255, 197, 61], [46, 211, 198], [201, 155, 255]];
var KEYS = ['D', 'F', 'J', 'K'];
var TAU = Math.PI * 2;
var DISP = '"Bebas Neue","Outfit","Arial Narrow",Arial,system-ui,sans-serif';
var BODY = 'var(--body,"Atkinson Hyperlegible",Verdana,system-ui,sans-serif)';
var me = document.currentScript;
var WITH_BUTTON = !!(me && me.getAttribute('data-button') && me.getAttribute('data-button') !== '0');
var TEST = /[?&]lwtest(=|&|$)/.test(location.search);

/* timing windows in seconds (Relaxed is a little kinder) */
var WIN_FULL = { perfect: 0.045, great: 0.09, good: 0.14 };
var WIN_RELAX = { perfect: 0.055, great: 0.105, good: 0.16 };
var VAL = { perfect: 100, great: 75, good: 50, missed: 0 };
var APPROACH = { relaxed: 1.8, full: 1.4 };   /* seconds a light takes to fall */

/* ---------- small helpers ---------- */
function rnd(a, b) { return a + Math.random() * (b - a); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function hasOwn(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
function pct(v) { v = Number(v); return isFinite(v) ? clamp(Math.round(v), 0, 100) : 0; }
var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
var FINE = !!(window.matchMedia && matchMedia('(pointer: fine)').matches);

/* test overrides (only used through the test hook) */
var T = { tempo: 1 };

/* ---------- storage ---------- */
var store = { best: {}, plays: 0, sound: true, speed: 'relaxed', nudge: 0 };
function loadStore() {
  try {
    var o = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (o && typeof o === 'object') {
      if (o.best && typeof o.best === 'object') {
        store.best = {};
        for (var k in o.best) if (hasOwn(o.best, k) && o.best[k] && typeof o.best[k] === 'object') {
          var b = o.best[k];
          store.best[k] = { relaxed: pct(b.relaxed), full: pct(b.full), combo: Math.max(0, Math.floor(Number(b.combo) || 0)) };
        }
      }
      if (isFinite(o.plays)) store.plays = Math.max(0, Math.floor(o.plays));
      if (typeof o.sound === 'boolean') store.sound = o.sound;
      if (o.speed === 'relaxed' || o.speed === 'full') store.speed = o.speed;
      if (isFinite(o.nudge)) store.nudge = clamp(Math.round(o.nudge / 5) * 5, -200, 200);
    }
  } catch (e) {}
}
function saveStore() {
  try { localStorage.setItem(KEY, JSON.stringify({ best: store.best, plays: store.plays, sound: store.sound, speed: store.speed, nudge: store.nudge })); } catch (e) {}
}
function bestOf(id, mode) { var b = store.best[id]; return b ? (b[mode] || 0) : 0; }
function topBest() {
  var m = 0;
  for (var k in store.best) if (hasOwn(store.best, k)) m = Math.max(m, store.best[k].relaxed || 0, store.best[k].full || 0);
  return m;
}
function rosesFor(acc) { return acc >= 90 ? 3 : acc >= 70 ? 2 : acc >= 40 ? 1 : 0; }
loadStore();

/* ==========================================================
   THE SHOW. Four original songs, written for this game.
   Melody tokens are scale degree:length in eighths, so "5:2" is
   the fifth of the key for a quarter note. ' is an octave up,
   , an octave down, r is a rest. Bars are split by |, and each
   bar has one chord (or two, split by a comma, a half bar each).
   ========================================================== */
function S(ch, mel, tr, end) { return { ch: ch, mel: mel || '', tr: tr || 0, end: !!end }; }

/* 1. Places, Please: the opener, bright and bouncy (C major) */
var P_INTRO = S('I V', "1:2 3:2 5:2 3:2|2:2 4:2 5:4");
var P_VERSE = S('I vi IV V I vi ii,V I',
  "1:2 3:2 5:2 3:2|6:2 5:2 3:4|4:2 6:2 1':2 6:2|5:6 r:2|1:2 3:2 5:2 1':2|2':2 1':2 6:4|4:2 6:2 7:2 2':2|1':6 r:2");
var P_CHORUS = S('IV I IV V IV I ii,V I',
  "6:3 5:1 4:2 6:2|5:4 3:2 1:2|6:3 5:1 4:2 1':2|2':4 7:2 5:2|6:3 5:1 4:2 6:2|5:2 3':2 2':2 1':2|2':2 1':2 7:2 2':2|1':4 r:4");
var P_TAG = S('IV,V I', "6:2 7:2 2':2 7:2|1':4 r:4", 0, true);

/* 2. Two Spotlights: the big ballad, slow with long notes (D major) */
var B_INTRO = S('I IV', "3:4 5:4|6:6 r:2");
var B_VERSE = S('I iii IV I vi IV ii V',
  "3:2 5:2 1':4|7:2 1':1 7:1 5:4|6:2 1':2 4':3 3':1|3':8|3':2 2':2 1':2 6:2|1':4 6:2 4:2|6:2 5:2 4:2 2:2|5:8");
var B_CHORUS = S('IV V iii,vi I IV V ii,V I',
  "1':2 6:2 1':2 4':2|2':6 1':2|7:2 1':2 3':4|3':6 r:2|4':2 3':2 2':2 1':2|2':4 5:4|6:2 1':2 7:2 2':2|1':8");
var B_CHORUS2 = S('IV V iii,vi I IV V ii,V I',
  "1':2 6:2 1':2 4':2|2':6 1':2|7:2 1':2 3':4|3':6 r:2|4':2 3':2 2':2 1':2|2':4 5:4|6:2 1':2 2':2 3':2|5':8");
var B_OUTRO = S('IV I', '', 0, true);

/* 3. The Big Rehearsal: a quick, chatty comedy number (G major) */
var R_INTRO = S('I V', '');
var R_A = S('I I V V I IV V I',
  "1:1 1:1 3:1 5:1 1':2 5:2|4:1 3:1 2:1 3:1 1:2 r:2|2:1 2:1 4:1 7:1 2':2 7:2|1':1 7:1 6:1 7:1 5:2 r:2|1:1 1:1 3:1 5:1 1':2 3':2|2':1 1':1 6:1 4:1 6:2 4:2|5:1 6:1 7:1 1':1 2':1 1':1 7:1 5:1|1':2 5:2 1:2 r:2");
var R_B = S('vi iii IV V vi iii IV V7',
  "6:1 6:1 6:1 7:1 1':2 6:2|5:1 5:1 5:1 6:1 7:2 5:2|4:1 4:1 4:1 5:1 6:2 4:2|5:2 r:2 5:2 r:2|6:1 7:1 1':1 2':1 3':2 1':2|7:1 1':1 2':1 3':1 5':2 3':2|4':1 3':1 2':1 1':1 6:2 4:2|5:2 5:2 5:2 r:2");
var R_END = S('IV,V I', "6:1 6:1 7:1 7:1 2':2 7:2|1':2 r:6", 0, true);

/* 4. Curtain Call: the grand finale, with a key change (B flat, then C) */
var C_INTRO = S('I V', "1:1 3:1 5:2 1':4|2':1 1':1 7:2 5:4");
var C_CHORUS_MEL = "1':2 2':2 3':4|2':2 1':2 2':4|3':2 4':2 5':3 3':1|1':6 r:2|1':2 2':2 3':2 5':2|5':3 4':1 2':4|6:2 1':2 4':2 3':1 2':1|1':8";
var C_CHORUS = S('I V vi IV I V IV,V I', C_CHORUS_MEL);
var C_VERSE = S('vi IV I V vi IV ii V',
  "3:1 3:1 r:1 3:1 4:2 3:2|1:1 1:1 r:1 1:1 2:2 3:2|3:1 3:1 r:1 5:1 6:2 5:2|5:4 r:2 2:1 3:1|3:1 3:1 r:1 3:1 6:2 5:2|4:1 4:1 r:1 4:1 6:2 1':2|2':2 1':2 6:2 4:2|5:6 r:2");
var C_UP = S('I V vi IV I V IV,V I', C_CHORUS_MEL, 2);
var C_TAG = S('I I', "1':2 3':2 5':4|1'':8", 2, true);

var SONGS = [
  { id: 'places', name: 'Places, Please', line: 'The opening number. Bright and bouncy.', level: 1, bpm: 112, slow: 0.88, root: 60,
    inst: 'piano', style: 'bounce', holds: false, sections: [P_INTRO, P_VERSE, P_CHORUS, P_VERSE, P_CHORUS, P_TAG] },
  { id: 'spotlights', name: 'Two Spotlights', line: 'The big ballad. Slow, with long notes to hold.', level: 2, bpm: 80, slow: 1, root: 62,
    inst: 'flute', style: 'ballad', holds: true, sections: [B_INTRO, B_VERSE, B_CHORUS, B_CHORUS2, B_OUTRO] },
  { id: 'rehearsal', name: 'The Big Rehearsal', line: 'A quick, chatty comedy number.', level: 3, bpm: 138, slow: 0.85, root: 55,
    inst: 'reed', style: 'oompah', holds: false, sections: [R_INTRO, R_A, R_A, R_B, R_A, R_END] },
  { id: 'curtain', name: 'Curtain Call', line: 'The grand finale, with a big key change.', level: 4, bpm: 120, slow: 0.88, root: 58,
    inst: 'brass', style: 'drive', holds: true, sections: [C_INTRO, C_CHORUS, C_VERSE, C_CHORUS, C_UP, C_TAG] }
];
var LEVELS = ['', 'Gentle', 'Steady', 'Lively', 'Big finish'];
function songById(id) { for (var i = 0; i < SONGS.length; i++) if (SONGS[i].id === id) return SONGS[i]; return null; }

var STYLE = {
  bounce: { kick: 'x.......x.......', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.', bass: 'bounce', comp: 'stab', crash: true },
  ballad: { kick: 'x.........x.....', snare: '', brush: '....x.......x...', hat: 'x...x...x...x...', bass: 'long', comp: 'pad', crash: false },
  oompah: { kick: 'x.......x.......', snare: '....x.......x...', hat: '..x...x...x...x.', bass: 'oompah', comp: 'stab', crash: true },
  drive: { kick: 'x...x...x...x...', snare: '....x.......x...', clap: '....x.......x...', hat: 'x.o.x.o.x.o.x.o.', bass: 'eighths', comp: 'brass', crash: true }
};

var DEG = [0, 2, 4, 5, 7, 9, 11];
function parseTok(tok) {
  var m = /^(?:(r)|([b#]?)([1-7])([',]*))(?::(\d+))?$/.exec(tok);
  if (!m) throw new Error('Showstopper: bad note ' + tok);
  var len = m[5] ? parseInt(m[5], 10) : 2;
  if (m[1]) return { rest: true, len: len };
  var s = DEG[+m[3] - 1] + (m[2] === 'b' ? -1 : m[2] === '#' ? 1 : 0);
  for (var i = 0; i < m[4].length; i++) s += m[4].charAt(i) === "'" ? 12 : -12;
  return { rest: false, semi: s, len: len };
}
var ROMAN = { I: 0, II: 2, III: 4, IV: 5, V: 7, VI: 9, VII: 11 };
function parseChord(tok) {
  var m = /^([ivIV]+)(7?)$/.exec(tok);
  if (!m) throw new Error('Showstopper: bad chord ' + tok);
  var up = m[1].toUpperCase(), minor = m[1] !== up;
  var tones = minor ? [0, 3, 7] : [0, 4, 7];
  if (m[2]) tones.push(10);
  return { root: ROMAN[up], tones: tones, key: tok };
}
function chordNotes(key, c) {
  return c.tones.map(function (tn) { var m = key + c.root + tn; while (m < 55) m += 12; while (m > 67) m -= 12; return m; });
}
function bassNote(key, c, fifth) {
  var r = key + c.root; while (r < 36) r += 12; while (r > 47) r -= 12;
  return r + (fifth ? 7 : 0);
}

/* turns a song into timed sound events and a chart of notes to tap */
function buildSong(song, mode) {
  var tempo = song.bpm * (mode === 'relaxed' ? song.slow : 1) * (T.tempo || 1);
  var spb = 60 / tempo, bar = spb * 4, e8 = spb / 2, s16 = spb / 4;
  var st = STYLE[song.style];
  var ev = [], mel = [], problems = [], b = 1, i;
  /* count in: four clicks of the sticks, "5, 6, 7, 8" */
  for (i = 0; i < 4; i++) ev.push({ t: i * spb, k: 'stick', a: i === 3 });
  song.sections.forEach(function (sec, si) {
    var chs = sec.ch.split(/\s+/), mbars = sec.mel ? sec.mel.split('|') : null;
    if (mbars && mbars.length !== chs.length) problems.push(song.id + ' section ' + si + ': ' + mbars.length + ' melody bars for ' + chs.length + ' chords');
    var key = song.root + sec.tr;
    chs.forEach(function (ct, j) {
      var t0 = b * bar, last = sec.end && j === chs.length - 1, s;
      var halves = ct.split(',').map(parseChord), c1 = halves[0], c2 = halves[1] || halves[0], two = halves.length > 1;
      if (last) {
        ev.push({ t: t0, k: 'bass', m: bassNote(key, c1, false), d: bar * 1.2 });
        ev.push({ t: t0, k: 'pad', ms: chordNotes(key, c1), d: bar * 1.4, w: st.comp === 'brass' ? 'brass' : 'warm' });
        ev.push({ t: t0, k: 'stab', ms: chordNotes(key, c1), d: spb * 2 });
        ev.push({ t: t0, k: 'kick' });
        ev.push({ t: t0, k: st.crash ? 'crash' : 'brush' });
      } else {
        /* bass */
        if (st.bass === 'bounce' || st.bass === 'oompah') {
          var bd = st.bass === 'oompah' ? spb * 0.45 : spb * 0.9;
          ev.push({ t: t0, k: 'bass', m: bassNote(key, c1, false), d: bd });
          ev.push({ t: t0 + 2 * spb, k: 'bass', m: two ? bassNote(key, c2, false) : bassNote(key, c1, true), d: bd });
          if (st.bass === 'bounce') ev.push({ t: t0 + 3.5 * spb, k: 'bass', m: bassNote(key, c2, false), d: e8 * 0.8 });
        } else if (st.bass === 'long') {
          ev.push({ t: t0, k: 'bass', m: bassNote(key, c1, false), d: spb * 1.9 });
          ev.push({ t: t0 + 2 * spb, k: 'bass', m: two ? bassNote(key, c2, false) : bassNote(key, c1, true), d: spb * 1.9 });
        } else {
          for (s = 0; s < 8; s++) ev.push({ t: t0 + s * e8, k: 'bass', m: bassNote(key, s < 4 ? c1 : c2, false) + (s % 2 ? 12 : 0), d: e8 * 0.8 });
        }
        /* chords */
        if (st.comp === 'stab') {
          ev.push({ t: t0 + spb, k: 'stab', ms: chordNotes(key, c1), d: spb * 0.4 });
          ev.push({ t: t0 + 3 * spb, k: 'stab', ms: chordNotes(key, c2), d: spb * 0.4 });
        } else {
          var w = st.comp === 'brass' ? 'brass' : 'warm';
          ev.push({ t: t0, k: 'pad', ms: chordNotes(key, c1), d: two ? spb * 2 : bar, w: w });
          if (two) ev.push({ t: t0 + 2 * spb, k: 'pad', ms: chordNotes(key, c2), d: spb * 2, w: w });
        }
        /* drums */
        for (s = 0; s < 16; s++) {
          var ts = t0 + s * s16;
          if (st.kick.charAt(s) === 'x') ev.push({ t: ts, k: 'kick' });
          if (st.snare && st.snare.charAt(s) === 'x') ev.push({ t: ts, k: 'snare' });
          if (st.clap && st.clap.charAt(s) === 'x') ev.push({ t: ts, k: 'clap' });
          if (st.brush && st.brush.charAt(s) === 'x') ev.push({ t: ts, k: 'brush' });
          var h = st.hat.charAt(s);
          if (h === 'x') ev.push({ t: ts, k: 'hat' }); else if (h === 'o') ev.push({ t: ts, k: 'ohat' });
        }
        if (j === 0 && si > 0 && st.crash) ev.push({ t: t0, k: 'crash' });
      }
      /* melody */
      if (mbars && mbars[j] != null) {
        var pos = 0;
        mbars[j].trim().split(/\s+/).forEach(function (tok) {
          var n = parseTok(tok);
          if (!n.rest) {
            var t = t0 + pos * e8, d = n.len * e8, m = key + n.semi;
            ev.push({ t: t, k: 'mel', m: m, d: d });
            mel.push({ t: t, d: d, m: m, beat: b * 4 + pos / 2, beats: n.len / 2 });
          }
          pos += n.len;
        });
        if (pos !== 8) problems.push(song.id + ' section ' + si + ' bar ' + (j + 1) + ' has ' + pos + ' eighths');
      }
      b++;
    });
  });
  ev.sort(function (a, c) { return a.t - c.t; });
  var notes = chartFrom(mel, song, mode, spb);
  var lastEnd = 0;
  notes.forEach(function (n) { lastEnd = Math.max(lastEnd, n.end); });
  var end = Math.max(lastEnd + 0.9, (b - 1) * bar + bar * 0.7);
  return { ev: ev, notes: notes, spb: spb, bar: bar, end: end, tempo: tempo, bars: b, problems: problems };
}

/* which melody notes become lights to tap, and in which lane */
function chartFrom(mel, song, mode, spb) {
  var out = [], lastBeat = -99, relaxed = mode === 'relaxed', i;
  mel.forEach(function (n) {
    if (relaxed) {
      /* on the beat only, and mostly the strong beats (1 and 3) or long notes */
      var gap = n.beat - lastBeat, inBar = Math.round(n.beat) % 4;
      if (Math.abs(n.beat - Math.round(n.beat)) > 0.01 || gap < 0.99) return;
      if (inBar % 2 && n.beats < 1.5 && gap < 1.99) return;
    } else if (n.beat - lastBeat < 0.49) return;
    lastBeat = n.beat;
    out.push({ t: n.t, m: n.m, beat: n.beat, beats: n.beats, len: 0 });
  });
  if (song.holds) {
    out.forEach(function (n, k) {
      if (n.beats < 2) return;
      var lenB = n.beats - 0.5, next = out[k + 1];
      if (next) lenB = Math.min(lenB, next.beat - n.beat - 0.5);
      if (lenB >= 1) n.len = lenB * spb;
    });
  }
  /* higher notes sit further right; repeated notes stay in their lane */
  var cnt = out.length;
  for (i = 0; i < cnt; i++) {
    var lo = Math.max(0, i - 6), hi = Math.min(cnt - 1, i + 6), below = 0, eq = 0;
    for (var j = lo; j <= hi; j++) { if (out[j].m < out[i].m) below++; else if (out[j].m === out[i].m) eq++; }
    out[i].lane = clamp(Math.floor((below + eq * 0.5) / (hi - lo + 1) * LANES), 0, LANES - 1);
    if (i > 0) {
      var p = out[i - 1];
      if (out[i].m === p.m) out[i].lane = p.lane;
      else if (out[i].m > p.m && out[i].lane <= p.lane) out[i].lane = Math.min(LANES - 1, p.lane + 1);
      else if (out[i].m < p.m && out[i].lane >= p.lane) out[i].lane = Math.max(0, p.lane - 1);
    }
  }
  /* the full show ends on a two light chord */
  if (!relaxed && cnt) {
    var f = out[cnt - 1];
    out.push({ t: f.t, m: f.m, beat: f.beat, beats: f.beats, len: f.len, lane: f.lane < 2 ? f.lane + 2 : f.lane - 2 });
  }
  out.forEach(function (n, k) { n.id = k; n.end = n.t + n.len; n.state = 0; n.grade = ''; n.base = 0; });
  out.sort(function (a, c) { return a.t - c.t || a.lane - c.lane; });
  return out;
}

/* ---------- styles ---------- */
var css = document.createElement('style');
css.textContent =
'html body>.lwss{position:fixed !important;z-index:2147483000 !important;inset:0 !important}' +
'.lwss{display:flex;flex-direction:column;margin:0;padding:0;overflow:hidden;color:#fff6fb;font-family:' + BODY + ';' +
'background:#12060f;overscroll-behavior:contain;-webkit-tap-highlight-color:transparent}' +
'.lwss *{box-sizing:border-box}' +
'.lwss button{font-family:inherit;cursor:pointer;-webkit-user-select:none;user-select:none}' +
'.lwss button:focus-visible,.lwss input:focus-visible{outline:3px solid ' + GOLD + ';outline-offset:3px}' +
'.ss-bar{flex:none;display:flex;align-items:center;gap:8px;padding:8px 12px;background:linear-gradient(#2c1031,#1a0a1c);border-bottom:2px solid rgba(255,197,61,.4)}' +
'.ss-title{flex:1;min-width:0;display:flex;align-items:center;gap:10px;font-family:' + DISP + ';font-weight:400;font-size:1.75rem;letter-spacing:.07em;line-height:1;white-space:nowrap;overflow:hidden;color:' + GOLD + '}' +
'.ss-title svg{width:34px;height:34px;flex:none}' +
'.ss-title span{overflow:hidden;text-overflow:ellipsis;padding-top:3px}' +
'.ss-tb{min-height:44px;padding:8px 13px;border-radius:12px;border:2px solid rgba(255,246,251,.32);background:rgba(255,255,255,.07);color:#fff6fb;font-weight:700;font-size:.95rem;line-height:1.1}' +
'.ss-tb:hover{background:rgba(255,255,255,.16)}' +
'.ss-tb[aria-pressed="false"]{opacity:.72}' +
'.ss-tb[hidden]{display:none}' +
'.ss-x{min-height:46px;padding:8px 16px;border-radius:12px;border:3px solid ' + INK + ';background:#fff6fb;color:' + INK + ';font-weight:700;font-size:1.02rem;box-shadow:0 4px 0 rgba(0,0,0,.45)}' +
'.ss-x:hover{background:' + GOLD + '}' +
'.ss-stage{position:relative;flex:1;min-height:0;overflow:hidden}' +
'.ss-stage canvas{position:absolute;left:0;top:0;display:block;touch-action:none;-webkit-user-select:none;user-select:none;outline:none}' +
'.ss-hud{position:absolute;left:0;right:0;z-index:2;display:flex;justify-content:space-between;align-items:flex-start;gap:10px;padding:0 14px;pointer-events:none;font-family:' + DISP + ';letter-spacing:.05em;text-shadow:0 2px 0 rgba(0,0,0,.7)}' +
'.ss-hud[hidden]{display:none}' +
'.ss-song{min-width:0;font-size:1.3rem;line-height:1.05}' +
'.ss-song span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
'.ss-song small,.ss-acc small{display:block;font-family:' + BODY + ';letter-spacing:.04em;font-size:.74rem;color:#e8d2e2;text-transform:uppercase}' +
'.ss-acc{text-align:right;font-size:2rem;line-height:1;color:' + GOLD + '}' +
'.ss-hint{position:absolute;left:50%;transform:translateX(-50%);z-index:2;width:max-content;max-width:min(92%,440px);padding:9px 15px;border-radius:12px;background:rgba(26,13,28,.88);border:1px solid rgba(255,197,61,.4);font-size:.98rem;line-height:1.35;text-align:center;pointer-events:none;transition:opacity .4s}' +
'.ss-hint.gone{opacity:0}' +
'.ss-toast{position:absolute;left:50%;z-index:3;transform:translateX(-50%);white-space:nowrap;padding:4px 14px 2px;border-radius:999px;background:rgba(255,197,61,.92);color:' + INK + ';font-family:' + DISP + ';font-size:1.15rem;letter-spacing:.06em;pointer-events:none;opacity:0;transition:opacity .35s;box-shadow:0 3px 0 rgba(0,0,0,.45)}' +
'.ss-toast.on{opacity:1}' +
'.ss-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
'.ss-card{position:absolute;left:50%;top:50%;z-index:4;transform:translate(-50%,-50%);width:min(calc(100% - 20px),560px);max-height:calc(100% - 20px);overflow:auto;overscroll-behavior:contain;' +
'padding:18px 18px 16px;border-radius:20px;background:' + CREAM + ';color:' + INK + ';border:4px solid ' + INK + ';box-shadow:0 0 0 3px ' + GOLD + ',0 10px 0 rgba(0,0,0,.35),0 24px 60px rgba(0,0,0,.55)}' +
'.ss-card[hidden]{display:none}' +
'.ss-card.small{width:min(calc(100% - 20px),410px);text-align:center}' +
'@media (min-width:760px){.ss-card.menu{width:min(calc(100% - 40px),780px)}.ss-card.menu .ss-songs{grid-template-columns:1fr 1fr}}' +
'.ss-kick{display:inline-block;padding:4px 12px 2px;border-radius:999px;background:' + RED + ';color:#fff;font-family:' + DISP + ';font-size:1.05rem;letter-spacing:.12em}' +
'.ss-card h2{margin:8px 0 0;font-family:' + DISP + ';font-weight:400;font-size:2.7rem;line-height:.95;letter-spacing:.04em;color:' + PLUM + '}' +
'.ss-card p{margin:6px 0 0;font-size:1rem;line-height:1.4}' +
'.ss-mode{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:14px 0 0}' +
'.ss-mode button{padding:9px 12px 8px;border-radius:14px;border:3px solid #d9c3d3;background:#fff;color:' + INK + ';text-align:left;font-family:' + DISP + ';font-size:1.45rem;letter-spacing:.05em;line-height:1}' +
'.ss-mode button small{display:block;margin-top:3px;font-family:' + BODY + ';font-size:.8rem;letter-spacing:0;color:#6a4a62;line-height:1.25}' +
'.ss-mode button[aria-pressed="true"]{border-color:' + INK + ';background:' + GOLD + ';box-shadow:0 4px 0 ' + INK + '}' +
'.ss-mode button[aria-pressed="true"] small{color:' + INK + '}' +
'.ss-songs{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:9px}' +
'.ss-songs button{width:100%;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;padding:9px 12px;border-radius:16px;border:3px solid ' + INK + ';background:#fff;color:' + INK + ';text-align:left;box-shadow:0 4px 0 ' + INK + ';transition:transform .1s,background .1s}' +
'.ss-songs button:hover{background:#fff1c9;transform:translateY(-1px)}' +
'.ss-songs button:active{transform:translateY(3px);box-shadow:0 1px 0 ' + INK + '}' +
'.ss-num{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:' + PLUM + ';color:' + GOLD + ';font-family:' + DISP + ';font-size:1.6rem;padding-top:3px;box-shadow:inset 0 0 0 3px rgba(255,197,61,.5)}' +
'.ss-sn{min-width:0}' +
'.ss-sn b{display:block;font-family:' + DISP + ';font-weight:400;font-size:1.65rem;letter-spacing:.04em;line-height:1}' +
'.ss-sn small{display:block;margin-top:3px;font-size:.84rem;color:#5d4157;line-height:1.3}' +
'.ss-lvl{display:inline-flex;align-items:center;gap:6px;margin-top:4px;font-size:.76rem;font-weight:700;color:#7a3a6e;text-transform:uppercase;letter-spacing:.06em}' +
'.ss-lvl i{display:inline-block;width:8px;height:8px;margin-right:2px;border-radius:50%;background:#e6d3df}' +
'.ss-lvl i.on{background:' + RED + '}' +
'.ss-sb{text-align:right;font-size:.78rem;color:#5d4157;white-space:nowrap;line-height:1.2}' +
'.ss-sb b{display:block;font-family:' + DISP + ';font-weight:400;font-size:1.35rem;letter-spacing:.04em;color:' + INK + '}' +
'.ss-sb svg{width:17px;height:17px;vertical-align:-3px}' +
'.ss-sb .off{opacity:.2;filter:grayscale(1)}' +
'.ss-nudge{margin:14px 0 0;padding:10px 12px;border-radius:14px;background:#f3e6ee;border:2px solid #e6d3df;text-align:left}' +
'.ss-nudge .ss-lab,.ss-nudge summary{display:block;font-weight:700;font-size:.95rem}' +
'.ss-nudge summary{cursor:pointer;list-style:none;padding:2px 0}' +
'.ss-nudge summary::-webkit-details-marker{display:none}' +
'.ss-nudge summary:before{content:"+";display:inline-block;width:1.2em;font-weight:700;color:#b0245a}' +
'.ss-nudge[open] summary:before{content:"-"}' +
'.ss-small{font-size:.8rem !important;color:#6a4a62;margin-top:4px !important}' +
'.ss-nudge input{width:100%;margin:8px 0 2px;accent-color:#b0245a}' +
'.ss-ends{display:flex;justify-content:space-between;gap:8px;font-size:.8rem;color:#5d4157}' +
'.ss-ends output{font-weight:700;color:' + INK + '}' +
'.ss-tip{font-size:.84rem !important;color:#6a4a62;margin-top:10px !important}' +
'.ss-roses{display:flex;justify-content:center;gap:8px;margin:10px 0 0}' +
'.ss-roses svg{width:50px;height:50px}' +
'.ss-roses .off{opacity:.2;filter:grayscale(1)}' +
'.ss-roses .on{animation:ssrose .55s cubic-bezier(.2,1.6,.4,1) both}' +
'.ss-roses .on:nth-child(2){animation-delay:.15s}.ss-roses .on:nth-child(3){animation-delay:.3s}' +
'@keyframes ssrose{0%{transform:scale(.2) rotate(-40deg);opacity:0}100%{transform:scale(1) rotate(0);opacity:1}}' +
'.ss-badge{display:inline-block;margin:0 0 4px;padding:5px 14px 3px;border-radius:999px;background:' + GOLD + ';border:2px solid ' + INK + ';font-family:' + DISP + ';font-size:1.2rem;letter-spacing:.06em}' +
'.ss-pop{animation:sspop .55s cubic-bezier(.2,1.6,.4,1) both}' +
'@keyframes sspop{0%{transform:scale(.4) rotate(-8deg)}100%{transform:scale(1) rotate(-2deg)}}' +
'.ss-sub{font-size:.9rem !important;color:#6a4a62}' +
'.ss-nums{display:flex;justify-content:center;gap:8px;margin:12px 0 0}' +
'.ss-nums div{flex:1;max-width:120px;padding:6px 6px;border-radius:14px;background:#f3e6ee;border:2px solid #e6d3df}' +
'.ss-nums span{display:block;font-size:.7rem;font-weight:700;color:#5d4157;text-transform:uppercase;letter-spacing:.07em}' +
'.ss-nums b{display:block;font-family:' + DISP + ';font-weight:400;font-size:2.1rem;line-height:1.05;letter-spacing:.03em}' +
'.ss-counts{font-size:.86rem !important;color:#5d4157}' +
'.ss-advice{margin:12px 0 0;padding:10px 12px;border-radius:14px;background:#e5f8f6;border:2px solid #b5e9e3;font-size:.92rem;line-height:1.35}' +
'.ss-advice button{margin-top:8px;min-height:40px;padding:6px 14px;border-radius:12px;border:2px solid ' + INK + ';background:' + TEAL + ';color:' + INK + ';font-weight:700;font-size:.95rem}' +
'.ss-go{display:block;width:100%;min-height:58px;margin-top:14px;border-radius:16px;border:3px solid ' + INK + ';background:' + RED + ';color:#fff;font-family:' + DISP + ';font-size:2rem;letter-spacing:.1em;padding-top:4px;box-shadow:0 5px 0 ' + INK + '}' +
'.ss-go:hover{background:#ff7166}.ss-go:active{transform:translateY(3px);box-shadow:0 2px 0 ' + INK + '}' +
'.ss-c2{display:block;width:100%;margin-top:10px;min-height:46px;border-radius:14px;border:2px solid #c9b0c1;background:transparent;color:' + INK + ';font-weight:700;font-size:1rem}' +
'.ss-c2:hover{background:#f3e6ee}' +
'@media (max-height:600px){.ss-bar{padding:5px 12px}.ss-tb,.ss-x{min-height:40px}.ss-card h2{font-size:2.2rem}}' +
'@media (max-width:480px){.ss-tb{padding:8px 10px;font-size:.88rem}.ss-title span{display:none}.ss-x{padding:8px 12px}' +
'.ss-card{padding:14px 12px 12px}.ss-card h2{font-size:2.2rem}.ss-card.menu p{font-size:.92rem}.ss-mode{margin-top:10px}.ss-mode button{font-size:1.3rem;padding:7px 10px 6px}' +
'.ss-songs{margin-top:10px;gap:8px}.ss-songs button{gap:9px;padding:7px 10px}.ss-num{width:36px;height:36px;font-size:1.35rem}.ss-sn b{font-size:1.4rem}.ss-sn small{font-size:.78rem}.ss-sb svg{width:14px;height:14px}.ss-sb b{font-size:1.15rem}.ss-nudge{margin-top:10px}}' +
'@media (prefers-reduced-motion:reduce){.ss-pop,.ss-roses .on{animation:none}.ss-pop{transform:rotate(-2deg)}.ss-hint,.ss-toast,.ss-songs button{transition:none}}' +
/* the launcher that sits in the hero */
'.lwss-launch{display:flex;flex-direction:column;align-items:flex-start;gap:8px;margin:18px 0 0}' +
'.lwss-open{display:inline-flex;align-items:center;gap:12px;cursor:pointer;font-family:' + DISP + ';font-weight:400;font-size:1.65rem;letter-spacing:.09em;line-height:1;' +
'padding:9px 22px 9px 10px;border-radius:14px;border:3px solid ' + GOLD + ';background:linear-gradient(#ff7064,#e5443b);color:#fff;' +
'box-shadow:0 5px 0 #6e1730,0 0 0 4px rgba(255,197,61,.16),0 0 26px rgba(255,197,61,.22);transition:transform .12s}' +
'.lwss-open:hover{transform:translateY(-2px)}.lwss-open:active{transform:translateY(3px);box-shadow:0 2px 0 #6e1730}' +
'.lwss-open:focus-visible{outline:3px solid #fff;outline-offset:3px}' +
'.lwss-open svg{width:36px;height:36px;flex:none}' +
'.lwss-open span{padding-top:3px}' +
'.lwss-note{margin:0;font-size:.95rem;color:var(--mist,#e8d2e2)}' +
'@media (prefers-reduced-motion:reduce){.lwss-open{transition:none}}';
(document.head || document.documentElement).appendChild(css);

var NOTE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11.5" fill="' + GOLD + '"/><circle cx="12" cy="12" r="9.6" fill="none" stroke="#2a1030" stroke-opacity=".25" stroke-width="1"/>' +
  '<g fill="#2a1030"><ellipse cx="8.5" cy="16.4" rx="2.5" ry="1.9" transform="rotate(-20 8.5 16.4)"/><ellipse cx="15.7" cy="14.4" rx="2.5" ry="1.9" transform="rotate(-20 15.7 14.4)"/>' +
  '<rect x="9.7" y="7.6" width="1.5" height="8.6"/><rect x="16.9" y="5.6" width="1.5" height="8.6"/><path d="M9.7 7.6 18.4 5.2v2.7L9.7 10.3z"/></g></svg>';
var ROSE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 13v9" stroke="#2f9e5a" stroke-width="2" stroke-linecap="round"/>' +
  '<path d="M12 18.5c-2.6-.1-4.2-1.5-4.8-3.7 2.5-.2 4.2.9 4.8 3.7z" fill="#2f9e5a"/><circle cx="12" cy="8" r="6.2" fill="' + RED + '"/>' +
  '<path d="M12 4.1c-2 .3-3.3 1.9-3.1 3.9 1-1 2-1.4 3.1-1.4s2.1.4 3.1 1.4c.2-2-1.1-3.6-3.1-3.9zM8.1 9.6c.8 1.9 2.3 2.9 3.9 2.9s3.1-1 3.9-2.9" fill="none" stroke="#a5202d" stroke-width="1.2" stroke-linecap="round"/></svg>';
function roseRow(n, cls) {
  var h = '';
  for (var i = 0; i < 3; i++) h += '<span class="' + (i < n ? 'on' : 'off') + '">' + ROSE_SVG + '</span>';
  return cls ? '<div class="' + cls + '" role="img" aria-label="' + n + ' roses out of 3">' + h + '</div>' : h;
}

/* ==========================================================
   THE BAND (WebAudio, only after a tap or key press)
   ========================================================== */
var AC = null, master = null, noiseBuf = null, fxBus = null, lastAc = 0;
function unlockAudio() {
  if (AC) {
    if (AC.state === 'suspended' && state !== 'paused' && state !== 'closed' && !document.hidden) { try { AC.resume(); } catch (e) {} }
    return;
  }
  var C = window.AudioContext || window.webkitAudioContext;
  if (!C) return;
  try {
    try { AC = new C({ latencyHint: 'interactive' }); } catch (e1) { AC = new C(); }
    var comp = AC.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.2;
    master = AC.createGain(); master.gain.value = store.sound ? 0.75 : 0;
    master.connect(comp); comp.connect(AC.destination);
    noiseBuf = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    if (AC.state === 'suspended') { try { AC.resume(); } catch (e2) {} }
  } catch (e) { AC = null; }
}
function syncSoundGain() {
  if (!AC || !master) return;
  try { master.gain.setTargetAtTime(store.sound ? 0.75 : 0, AC.currentTime, 0.03); } catch (e) {}
}
function newBus() {
  if (!AC) return null;
  try { var g = AC.createGain(); g.gain.value = 1; g.connect(master); return g; } catch (e) { return null; }
}
function killBus(b) {
  if (!b || !AC) return;
  try { b.gain.cancelScheduledValues(AC.currentTime); b.gain.setTargetAtTime(0, AC.currentTime, 0.015); } catch (e) {}
  setTimeout(function () { try { b.disconnect(); } catch (e) {} }, 120);
}
function fx() { if (!AC) return null; if (!fxBus) fxBus = newBus(); return fxBus; }
function outLat() {
  var l = (AC && (AC.outputLatency || AC.baseLatency)) || 0;
  return clamp(l, 0, 0.3);
}
/* the song position that is being heard right now, in context seconds */
function acNow() {
  var base = AC.currentTime - outLat();
  if (AC.state === 'running' && AC.getOutputTimestamp) {
    try {
      var ts = AC.getOutputTimestamp();
      if (ts && ts.contextTime > 0 && ts.performanceTime > 0) {
        var v = ts.contextTime + (performance.now() - ts.performanceTime) / 1000;
        if (Math.abs(v - base) < 0.2) base = v;
      }
    } catch (e) {}
  }
  if (base < lastAc) base = lastAc;
  lastAc = base;
  return base;
}

function osc(type, f, t) { var o = AC.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); return o; }
function gainNode(v) { var g = AC.createGain(); g.gain.value = v; return g; }
function filt(type, f, q) { var b = AC.createBiquadFilter(); b.type = type; b.frequency.value = f; if (q) b.Q.value = q; return b; }
/* attack to peak, ease to sustain, release at off; returns when to stop */
function shape(g, t, a, peak, sus, tau, off, rel) {
  var p = g.gain;
  p.setValueAtTime(0, t);
  p.linearRampToValueAtTime(peak, t + a);
  if (sus !== peak) p.setTargetAtTime(sus, t + a, tau);
  p.setTargetAtTime(0, Math.max(off, t + a + 0.005), rel / 3);
  return Math.max(off, t + a) + rel + 0.05;
}
function iPiano(t, m, d, v, dest) {
  var f = mtof(m), o1 = osc('triangle', f, t), o2 = osc('sine', f * 2, t), lp = filt('lowpass', Math.min(5200, f * 6)), g = gainNode(0), g2 = gainNode(0.3);
  o1.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(dest);
  var stop = shape(g, t, 0.005, v, 0, 0.5, t + Math.max(0.08, d * 0.95), 0.14);
  o1.start(t); o2.start(t); o1.stop(stop); o2.stop(stop);
}
function iFlute(t, m, d, v, dest) {
  var f = mtof(m), o = osc('sine', f, t), o2 = osc('triangle', f, t), g2 = gainNode(0.2), g = gainNode(0);
  var lfo = osc('sine', 5.2, t), lg = gainNode(0);
  lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(0, t + 0.22); lg.gain.linearRampToValueAtTime(f * 0.007, t + 0.6);
  lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency);
  o.connect(g); o2.connect(g2); g2.connect(g); g.connect(dest);
  var stop = shape(g, t, 0.06, v, v * 0.8, 0.25, t + d * 0.94, 0.28);
  o.start(t); o2.start(t); lfo.start(t); o.stop(stop); o2.stop(stop); lfo.stop(stop);
}
function iReed(t, m, d, v, dest) {
  var f = mtof(m), o = osc('square', f, t), o2 = osc('sine', f, t), lp = filt('lowpass', Math.min(3600, f * 3.2), 1.5), g = gainNode(0), g2 = gainNode(0.6);
  o.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(dest);
  var stop = shape(g, t, 0.012, v, v * 0.7, 0.08, t + d * 0.82, 0.07);
  o.start(t); o2.start(t); o.stop(stop); o2.stop(stop);
}
function iBrass(t, m, d, v, dest) {
  var f = mtof(m), o1 = osc('sawtooth', f, t), o2 = osc('sawtooth', f, t), lp = filt('lowpass', f * 1.2, 1.4), g = gainNode(0);
  o2.detune.setValueAtTime(9, t);
  lp.frequency.setValueAtTime(f * 1.2, t);
  lp.frequency.linearRampToValueAtTime(Math.min(6000, f * 6), t + 0.05);
  lp.frequency.setTargetAtTime(Math.min(3600, f * 3.5), t + 0.05, 0.15);
  o1.connect(lp); o2.connect(lp); lp.connect(g); g.connect(dest);
  var stop = shape(g, t, 0.03, v, v * 0.75, 0.12, t + d * 0.92, 0.12);
  o1.start(t); o2.start(t); o1.stop(stop); o2.stop(stop);
}
function iBass(t, m, d, v, dest) {
  var f = mtof(m), o = osc('triangle', f, t), o2 = osc('sine', f, t), lp = filt('lowpass', 900), g = gainNode(0);
  o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(dest);
  var stop = shape(g, t, 0.008, v, v * 0.55, 0.25, t + d, 0.06);
  o.start(t); o2.start(t); o.stop(stop); o2.stop(stop);
}
function iPad(t, ms, d, v, dest, kind) {
  var brass = kind === 'brass', lp = filt('lowpass', brass ? 1500 : 950), g = gainNode(0);
  lp.connect(g); g.connect(dest);
  var a = brass ? 0.07 : 0.35;
  var stop = shape(g, t, Math.min(a, d * 0.5), v, v * 0.85, 0.3, t + d, brass ? 0.2 : 0.45);
  ms.forEach(function (m) {
    [-7, 7].forEach(function (dt) {
      var o = osc(brass ? 'sawtooth' : 'triangle', mtof(m), t);
      o.detune.value = dt; o.connect(lp); o.start(t); o.stop(stop);
    });
  });
}
function nz(t, dur, type, f, q, v, dest, a) {
  var s = AC.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
  var b = filt(type, f, q), g = gainNode(0);
  s.connect(b); b.connect(g); g.connect(dest);
  a = a || 0.002;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + a); g.gain.setTargetAtTime(0, t + a, dur / 3);
  s.start(t, Math.random() * 1.5); s.stop(t + a + dur + 0.1);
}
function dKick(t, v, dest) {
  var o = osc('sine', 150, t), g = gainNode(0);
  o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
  o.connect(g); g.connect(dest);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.003); g.gain.setTargetAtTime(0, t + 0.003, 0.09);
  o.start(t); o.stop(t + 0.5);
}
function dSnare(t, v, dest) {
  nz(t, 0.16, 'bandpass', 1900, 0.7, v, dest);
  var o = osc('triangle', 196, t), g = gainNode(0);
  o.connect(g); g.connect(dest);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v * 0.6, t + 0.002); g.gain.setTargetAtTime(0, t + 0.002, 0.03);
  o.start(t); o.stop(t + 0.2);
}
function dClap(t, v, dest) { for (var i = 0; i < 3; i++) nz(t + i * 0.011, i === 2 ? 0.14 : 0.02, 'bandpass', 1400, 0.9, v, dest); }
function dStick(t, accent, dest) {
  var f = accent ? 1500 : 1150, o = osc('square', f, t), bp = filt('bandpass', f, 4), g = gainNode(0);
  o.connect(bp); bp.connect(g); g.connect(dest);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.3, t + 0.002); g.gain.setTargetAtTime(0, t + 0.002, 0.018);
  o.start(t); o.stop(t + 0.12);
  nz(t, 0.03, 'highpass', 3000, 0.5, 0.12, dest);
}
var MELV = { piano: 0.26, flute: 0.24, reed: 0.12, brass: 0.1 };
function fire(e, when, dest) {
  if (!dest) return;
  try {
    switch (e.k) {
      case 'mel':
        var inst = G.song.inst, v = MELV[inst];
        if (inst === 'piano') iPiano(when, e.m, e.d, v, dest);
        else if (inst === 'flute') iFlute(when, e.m, e.d, v, dest);
        else if (inst === 'reed') iReed(when, e.m, e.d, v, dest);
        else iBrass(when, e.m, e.d, v, dest);
        break;
      case 'bass': iBass(when, e.m, e.d, 0.32, dest); break;
      case 'pad': iPad(when, e.ms, e.d, e.w === 'brass' ? 0.022 : 0.045, dest, e.w); break;
      case 'stab': e.ms.forEach(function (m) { iPiano(when, m, e.d, 0.06, dest); }); break;
      case 'kick': dKick(when, 0.55, dest); break;
      case 'snare': dSnare(when, 0.2, dest); break;
      case 'clap': dClap(when, 0.11, dest); break;
      case 'hat': nz(when, 0.045, 'highpass', 7500, 0.5, 0.05, dest); break;
      case 'ohat': nz(when, 0.26, 'highpass', 7000, 0.5, 0.035, dest); break;
      case 'brush': nz(when, 0.2, 'bandpass', 3800, 0.6, 0.07, dest, 0.03); break;
      case 'crash': nz(when, 1.4, 'highpass', 4500, 0.3, 0.09, dest); break;
      case 'stick': dStick(when, e.a, dest); break;
    }
  } catch (err) {}
}
/* the audience */
function sApplause(dur, lvl) {
  var dest = fx();
  if (!dest || AC.state !== 'running') return;
  try {
    var t = AC.currentTime + 0.03, n = Math.floor(dur * 55 * lvl);
    nz(t, dur * 0.7, 'bandpass', 1100, 0.5, 0.06 * lvl, dest, 0.25);
    for (var i = 0; i < n; i++) {
      var k = Math.random(), tt = t + k * k * dur;
      nz(tt, 0.025, 'bandpass', rnd(900, 2800), 1.4, rnd(0.05, 0.13) * lvl * (1 - k * 0.6), dest, 0.001);
    }
  } catch (e) {}
}
function sCheer(lvl) {
  var dest = fx();
  if (!dest || AC.state !== 'running') return;
  try {
    var t = AC.currentTime + 0.02;
    nz(t, 1.1, 'bandpass', 1300, 0.8, 0.07 * lvl, dest, 0.2);
    for (var i = 0; i < 18 * lvl; i++) nz(t + Math.random() * 0.9, 0.025, 'bandpass', rnd(1000, 2600), 1.4, rnd(0.04, 0.09) * lvl, dest, 0.001);
  } catch (e) {}
}
function sTick() {
  var dest = fx();
  if (!dest || AC.state !== 'running') return;
  try { iPiano(AC.currentTime + 0.01, 84, 0.08, 0.06, dest); } catch (e) {}
}

/* ==========================================================
   GAME STATE
   ========================================================== */
var state = 'closed';              /* closed, menu, play, paused, over */
var G = null, ui = {}, ctx = null, raf = 0, lastTs = 0, overAt = 0, pumpT = 0;
var bgCv = null, fgCv = null, gels = [];
var prevOverflow = '', opener = null, ptr = {};
var L = null;
var SC = {                          /* the scene: lights, crowd and sparkle, kept between songs */
  t: 0, spots: [{ x: 0, tx: 0, f: 0, idle: 9 }, { x: 0, tx: 0, f: 0, idle: 9 }], flip: 0,
  press: [0, 0, 0, 0], glow: [0, 0, 0, 0], excite: 0.12, exciteT: 0.12, ovation: 0, ovationT: 0,
  fx: [], roses: [], conf: [], judge: null, beat: 0, cyc: [255, 197, 61], comboPop: 0
};

function songTime() {
  if (!G) return 0;
  if (G.paused) return G.frozenT;
  if (G.useAC) return acNow() - G.t0;
  return performance.now() / 1000 - G.t0;
}
function gameTime() { return songTime() - store.nudge / 1000; }

function startSong(id, mode) {
  var song = songById(id) || SONGS[0];
  mode = mode === 'full' ? 'full' : 'relaxed';
  unlockAudio();
  if (G && G.bus) killBus(G.bus);
  var data = buildSong(song, mode);
  G = {
    song: song, mode: mode, data: data, notes: data.notes, ni: 0, di: 0, evi: 0,
    useAC: !!AC, t0: 0, bus: newBus(), paused: false, frozenT: 0, acWait: 0,
    win: mode === 'full' ? WIN_FULL : WIN_RELAX,
    counts: { perfect: 0, great: 0, good: 0, missed: 0 }, score: 0, judged: 0, combo: 0, maxCombo: 0, errs: [],
    down: [{}, {}, {}, {}], downN: [0, 0, 0, 0], holding: [null, null, null, null], autoRel: [],
    auto: !!(TEST && hook.autoOn), lastBeat: -99, hits: 0, milestone: 0, finished: false, hintAt: 0
  };
  G.t0 = G.useAC ? AC.currentTime + 0.45 : performance.now() / 1000 + 0.45;
  SC.judge = null; SC.fx.length = 0; SC.roses.length = 0; SC.conf.length = 0; SC.ovationT = 0;
  SC.exciteT = 0.15;
  state = 'play';
  ui.card.hidden = true; ui.card.innerHTML = '';
  ui.hud.hidden = false; ui.pause.hidden = false;
  ui.songName.textContent = song.name;
  ui.songMode.textContent = mode === 'full' ? 'Full show' : 'Relaxed';
  ui.accTxt = ''; updateHud();
  clearTimeout(toastT); ui.toast.className = 'ss-toast';
  if (store.plays < 2) {
    ui.hint.innerHTML = FINE ? 'Tap a lane, or press D F J K (or the arrow keys),<br>as a light reaches the glowing line.' : 'Tap a lane as a light reaches the glowing line.';
    ui.hint.className = 'ss-hint';
    G.hintAt = 1;
  } else ui.hint.className = 'ss-hint gone';
  say(song.name + ', ' + (mode === 'full' ? 'full show' : 'relaxed') + '. Five, six, seven, eight.');
  focusStage();
  pump();
}

/* the band is scheduled a little ahead on the audio clock */
function pump() {
  if (!G || state !== 'play' || G.paused || !G.useAC || !AC || AC.state !== 'running' || !G.bus) return;
  var horizon = AC.currentTime + 0.3, ev = G.data.ev;
  while (G.evi < ev.length && G.t0 + ev[G.evi].t < horizon) {
    var e = ev[G.evi++], when = G.t0 + e.t;
    if (when < AC.currentTime - 0.04) continue;
    fire(e, Math.max(when, AC.currentTime), G.bus);
  }
}

/* ---------- input ---------- */
function press(lane, src, at) {
  if (!G || state !== 'play' || G.paused || lane < 0 || lane >= LANES) return;
  var set = G.down[lane];
  if (set[src]) return;
  set[src] = 1; G.downN[lane]++;
  SC.press[lane] = 1;
  var t = at != null ? at : gameTime(), notes = G.notes, w = G.win, hit = null;
  for (var i = G.ni; i < notes.length; i++) {
    var n = notes[i];
    if (n.t - t > w.good) break;
    if (n.lane !== lane || n.state !== 0) continue;
    if (Math.abs(t - n.t) <= w.good) { hit = n; break; }
  }
  if (!hit) { SC.glow[lane] = Math.max(SC.glow[lane], 0.35); return; }
  judge(hit, t - hit.t);
  if (hit.len > 0) { hit.state = 1; G.holding[lane] = hit; }
  else hit.state = 2;
}
function release(lane, src) {
  if (!G || lane < 0 || lane >= LANES) return;
  var set = G.down[lane];
  if (!set[src]) return;
  delete set[src]; G.downN[lane] = Math.max(0, G.downN[lane] - 1);
  if (G.downN[lane] > 0) return;
  SC.press[lane] = 0;
  var n = G.holding[lane];
  if (!n || state !== 'play') return;
  var t = gameTime();
  endHold(n, n.end - t < 0.15 ? 1 : clamp((t - n.t) / n.len, 0, 1));
}
function releaseAll() {
  if (!G) return;
  for (var l = 0; l < LANES; l++) {
    G.down[l] = {}; G.downN[l] = 0; SC.press[l] = 0;
    var n = G.holding[l];
    if (n) endHold(n, clamp((songTime() - store.nudge / 1000 - n.t) / n.len, 0, 1));
  }
  ptr = {};
}
function judge(n, err) {
  var a = Math.abs(err), w = G.win;
  var g = a <= w.perfect ? 'perfect' : a <= w.great ? 'great' : 'good';
  n.grade = g;
  G.counts[g]++; G.combo++; G.hits++;
  if (G.combo > G.maxCombo) G.maxCombo = G.combo;
  if (!G.auto) G.errs.push(err);
  if (n.len > 0) n.base = VAL[g];
  else { G.score += VAL[g]; G.judged++; }
  showJudge(g, err);
  hitFx(n.lane, g);
  SC.comboPop = 1;
  if (G.hintAt) { G.hintAt = 0; ui.hint.className = 'ss-hint gone'; }
  var ms = [10, 25, 50, 75, 100, 150, 200];
  for (var i = 0; i < ms.length; i++) if (G.combo === ms[i] && G.milestone < ms[i]) {
    G.milestone = ms[i];
    toast(ms[i] === 10 ? 'The crowd is with you' : ms[i] === 25 ? 'Listen to that applause' : ms[i] === 50 ? 'Showstopper!' : ms[i] + ' in a row. Legendary!');
    sCheer(ms[i] >= 50 ? 1 : 0.7);
  }
}
function endHold(n, frac) {
  if (n.state !== 1) return;
  n.state = 2; n.hold = frac;
  if (G.holding[n.lane] === n) G.holding[n.lane] = null;
  G.score += n.base * (0.7 + 0.3 * frac); G.judged++;
  if (frac >= 1) {
    var x = laneX(n.lane);
    SC.fx.push({ k: 'txt', x: x, y: L.hitY + L.nr * 0.1, text: 'HELD', col: LCOL[n.lane], life: 0.6, max: 0.6 });
    if (!RM) for (var i = 0; i < 6; i++) SC.fx.push({ k: 'spark', x: x, y: L.hitY, vx: rnd(-90, 90), vy: rnd(-220, -80), life: rnd(0.3, 0.5), max: 0.5, col: '#ffffff', s: rnd(1.5, 3) });
  }
}
function miss(n) {
  n.state = 3; n.grade = 'missed';
  G.counts.missed++; G.judged++;
  G.combo = 0;
  showJudge('missed', 0);
}

/* ---------- the song moving on ---------- */
function step(dt) {
  /* if the audio never wakes up, carry on silently on the page clock */
  if (G.useAC && AC && AC.state !== 'running') {
    G.acWait += dt;
    if (G.acWait > 1) {
      var st = songTime();
      G.useAC = false; G.t0 = performance.now() / 1000 - st;
      killBus(G.bus); G.bus = null;
    }
  } else G.acWait = 0;
  pump();
  var t = gameTime(), notes = G.notes, i, n, w = G.win;
  if (G.auto) {
    for (i = G.ni; i < notes.length; i++) {
      n = notes[i];
      if (n.t > t) break;
      if (n.state !== 0) continue;
      var src = 'auto' + n.id;
      press(n.lane, src, n.t);
      if (n.len > 0) G.autoRel.push({ lane: n.lane, src: src, at: n.end + 0.02 });
      else release(n.lane, src);
    }
    for (i = G.autoRel.length - 1; i >= 0; i--) if (t >= G.autoRel[i].at) { release(G.autoRel[i].lane, G.autoRel[i].src); G.autoRel.splice(i, 1); }
  }
  for (var l = 0; l < LANES; l++) { n = G.holding[l]; if (n && t >= n.end) endHold(n, 1); }
  for (i = G.ni; i < notes.length; i++) {
    n = notes[i];
    if (n.t > t - w.good) break;
    if (n.state === 0) miss(n);
  }
  while (G.ni < notes.length && notes[G.ni].state >= 2 && notes[G.ni].t < t - w.good) G.ni++;
  var bi = Math.floor(t / G.data.spb);
  if (bi !== G.lastBeat) { G.lastBeat = bi; if (bi >= 0) SC.beat = 1; }
  if (G.hintAt && t > 10) { G.hintAt = 0; ui.hint.className = 'ss-hint gone'; }
  SC.exciteT = 0.15 + Math.min(0.85, G.combo / 30);
  updateHud();
  if (t >= G.data.end) finish();
}

function finish() {
  if (!G || G.finished) return;
  G.finished = true;
  releaseAll();
  state = 'over';
  var total = G.notes.length;
  var acc = total ? Math.floor(G.score / total + 1e-9) : 0;
  var roses = rosesFor(acc);
  var id = G.song.id, mode = G.mode, prev = bestOf(id, mode);
  var b = store.best[id] || (store.best[id] = { relaxed: 0, full: 0, combo: 0 });
  var newBest = acc > prev;
  if (newBest) b[mode] = acc;
  if (G.maxCombo > b.combo) b.combo = G.maxCombo;
  store.plays++;
  saveStore();
  /* timing advice: only when there is a clear lean one way */
  var advice = 0;
  if (G.errs.length >= 12) {
    var e = G.errs.slice().sort(function (a, c) { return a - c; }), med = e[Math.floor(e.length / 2)];
    if (Math.abs(med) >= 0.03) advice = clamp(Math.round(med * 1000 / 5) * 5, -120, 120);
  }
  G.result = { acc: acc, roses: roses, newBest: newBest, prev: prev, advice: advice };
  ui.pause.hidden = true; ui.hud.hidden = true;
  ui.hint.className = 'ss-hint gone';
  showEnd();
  throwRoses(roses + (newBest ? 2 : 0));
  if (newBest) {
    SC.ovationT = 1;
    sApplause(4.2, 1.2);
    if (!RM) for (var i = 0; i < 110; i++) SC.conf.push({ x: rnd(0, L.W), y: rnd(-L.H * 0.3, -8), vx: rnd(-30, 30), vy: rnd(40, 120), rot: rnd(0, TAU), vr: rnd(-8, 8), w: rnd(5, 9), h: rnd(3, 5), c: pick([GOLD, RED, TEAL, '#ffffff', LILAC]), life: rnd(3, 4.5), ph: rnd(0, TAU) });
  } else sApplause(2.6, [0.45, 0.65, 0.85, 1][roses]);
  SC.exciteT = 0.2 + roses * 0.25;
  overAt = Date.now();
}

/* ---------- pause ---------- */
function doPause(away) {
  if (state !== 'play' || !G || G.paused) return;
  G.frozenT = songTime();
  G.paused = true;
  releaseAll();
  killBus(G.bus); G.bus = null;
  if (AC && AC.state === 'running') { try { AC.suspend(); } catch (e) {} }
  state = 'paused';
  ui.pause.hidden = true;
  ui.hint.className = 'ss-hint gone';
  ui.card.className = 'ss-card small';
  ui.card.innerHTML =
    '<span class="ss-kick">Intermission</span>' +
    '<h2>Paused</h2>' +
    '<p>' + (away ? 'You stepped away, so the band is waiting in the wings.' : 'The band is waiting in the wings.') + ' Carry on whenever you like.</p>' +
    '<button type="button" class="ss-go" data-act="resume">Resume</button>' +
    '<button type="button" class="ss-c2" data-act="encore">Start the song again</button>' +
    '<button type="button" class="ss-c2" data-act="pick">Pick another song</button>' +
    nudgeHTML();
  ui.card.hidden = false;
  bindNudge();
  say('Paused. The band is waiting.');
  focusIn(ui.card.querySelector('.ss-go'));
}
function resume() {
  if (state !== 'paused' || !G) return;
  state = 'play';
  ui.card.hidden = true; ui.card.innerHTML = '';
  ui.pause.hidden = false;
  if (G.useAC && AC) {
    try { AC.resume(); } catch (e) {}
    G.t0 = acNow() - G.frozenT;
    G.bus = newBus();
    var ev = G.data.ev, i = 0;
    while (i < ev.length && ev[i].t < G.frozenT - 0.01) i++;
    G.evi = i;
  } else G.t0 = performance.now() / 1000 - G.frozenT;
  G.paused = false;
  G.acWait = 0;
  focusStage();
  pump();
}

/* ==========================================================
   DRAWING
   ========================================================== */
function laneX(i) { return L.lx + (i + 0.5) * L.lw; }
function laneAtX(x) { return clamp(Math.floor((x - L.lx) / L.lw), 0, LANES - 1); }
function rr(c, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  c.beginPath();
  c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
  c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
  c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
}

function computeLayout(W, H) {
  var o = { W: W, H: H };
  o.u = clamp(Math.min(W / 420, H / 720), 0.75, 1.6);
  o.hs = Math.round(clamp(H * 0.024, 13, 19));
  o.top = Math.round(clamp(H * 0.1, 54, 86));
  o.laneTop = Math.round(o.hs + (o.top - o.hs) * 0.4);
  o.lanesW = Math.min(W - 20, 480);
  o.lw = o.lanesW / LANES;
  o.lx = Math.round((W - o.lanesW) / 2);
  o.hitY = Math.round(H - clamp(H * 0.2, 112, 170));
  o.lipY = Math.round(o.hitY + clamp(o.lw * 0.34, 26, 40));
  o.nr = Math.round(Math.min(o.lw * 0.34, 34));
  o.travel = o.hitY - o.laneTop;
  o.cw = Math.max(W * 0.13, 50);
  L = o;
  return o;
}

function mkCanvas(cv) {
  cv = cv || document.createElement('canvas');
  cv.width = Math.round(L.W * ui.dpr); cv.height = Math.round(L.H * ui.dpr);
  var c = cv.getContext('2d');
  c.setTransform(ui.dpr, 0, 0, ui.dpr, 0, 0);
  return [cv, c];
}

/* the back wall, the side curtains and the stage floor, drawn once per layout */
function buildBg() {
  var r = mkCanvas(bgCv), c = r[1], W = L.W, H = L.H, x, i, g;
  bgCv = r[0];
  g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#12060f'); g.addColorStop(0.5, '#241029'); g.addColorStop(1, '#14070f');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  /* soft drape on the back wall */
  for (x = 0; x < W; x += 28) {
    g = c.createLinearGradient(x, 0, x + 28, 0);
    g.addColorStop(0, 'rgba(0,0,0,.12)'); g.addColorStop(0.5, 'rgba(255,255,255,.03)'); g.addColorStop(1, 'rgba(0,0,0,.12)');
    c.fillStyle = g; c.fillRect(x, 0, 28, L.hitY);
  }
  /* stage floor */
  g = c.createLinearGradient(0, L.hitY, 0, L.lipY);
  g.addColorStop(0, '#2b1419'); g.addColorStop(1, '#4a2526');
  c.fillStyle = g; c.fillRect(0, L.hitY, W, L.lipY - L.hitY);
  c.strokeStyle = 'rgba(0,0,0,.28)'; c.lineWidth = 1;
  for (i = -14; i <= 14; i++) {
    c.beginPath(); c.moveTo(W / 2 + i * 34 * 0.75, L.hitY); c.lineTo(W / 2 + i * 34, L.lipY); c.stroke();
  }
  /* curtains */
  curtain(c, false); curtain(c, true);
}
function curtain(c, right) {
  var W = L.W, w = L.cw, bot = L.lipY, tieY = L.hitY * 0.6, i, n = 5;
  c.save();
  if (right) { c.translate(W, 0); c.scale(-1, 1); }
  c.beginPath();
  c.moveTo(0, 0); c.lineTo(w, 0);
  c.quadraticCurveTo(w * 0.66, tieY * 0.55, w * 0.42, tieY);
  c.quadraticCurveTo(w * 0.62, (tieY + bot) / 2, w * 0.92, bot);
  c.lineTo(0, bot); c.closePath();
  var g = c.createLinearGradient(0, 0, w, 0);
  for (i = 0; i < n; i++) {
    g.addColorStop(i / n, '#2a0a2f');
    g.addColorStop((i + 0.55) / n, '#7a2580');
  }
  g.addColorStop(1, '#2a0a2f');
  c.fillStyle = g; c.fill();
  c.save(); c.clip();
  g = c.createLinearGradient(0, 0, 0, bot);
  g.addColorStop(0, 'rgba(0,0,0,.45)'); g.addColorStop(0.4, 'rgba(0,0,0,.05)'); g.addColorStop(1, 'rgba(0,0,0,.5)');
  c.fillStyle = g; c.fillRect(0, 0, w, bot);
  c.restore();
  /* gold tie back */
  var tw = Math.max(3, w * 0.035);
  c.strokeStyle = '#a8761a'; c.lineWidth = tw + 2; c.lineCap = 'round';
  c.beginPath(); c.moveTo(0, tieY - w * 0.06); c.quadraticCurveTo(w * 0.24, tieY + w * 0.1, w * 0.44, tieY); c.stroke();
  c.strokeStyle = GOLD; c.lineWidth = tw;
  c.beginPath(); c.moveTo(0, tieY - w * 0.06); c.quadraticCurveTo(w * 0.24, tieY + w * 0.1, w * 0.44, tieY); c.stroke();
  var tl = Math.max(14, w * 0.2), tx = w * 0.44;
  c.fillStyle = GOLD;
  c.beginPath(); c.arc(tx, tieY + 2, tw * 1.1, 0, TAU); c.fill();
  c.beginPath(); c.moveTo(tx - tw * 0.6, tieY + tw); c.lineTo(tx + tw * 0.6, tieY + tw); c.lineTo(tx + tw * 1.5, tieY + tl); c.lineTo(tx - tw * 1.5, tieY + tl); c.closePath(); c.fill();
  c.strokeStyle = '#a8761a'; c.lineWidth = 1;
  for (var q = -1; q <= 1; q++) { c.beginPath(); c.moveTo(tx + q * tw * 0.4, tieY + tw * 2); c.lineTo(tx + q * tw * 1.0, tieY + tl); c.stroke(); }
  c.restore();
}
/* the valance, the bulb strip and the stage lip, drawn on top */
function buildFg() {
  var r = mkCanvas(fgCv), c = r[1], W = L.W, i, g;
  fgCv = r[0];
  c.clearRect(0, 0, W, L.H);
  /* swags */
  var n = Math.max(3, Math.round(W / 170)), sw = W / n, depth = L.top - L.hs;
  for (i = 0; i < n; i++) {
    var x0 = i * sw, x1 = x0 + sw, mid = x0 + sw / 2;
    c.beginPath();
    c.moveTo(x0, L.hs - 1); c.lineTo(x1, L.hs - 1); c.lineTo(x1, L.hs + depth * 0.3);
    c.quadraticCurveTo(mid, L.top + depth * 0.55, x0, L.hs + depth * 0.3);
    c.closePath();
    g = c.createLinearGradient(0, L.hs, 0, L.top);
    g.addColorStop(0, '#3e0f44'); g.addColorStop(0.6, '#7a2580'); g.addColorStop(1, '#4c1352');
    c.fillStyle = g; c.fill();
    c.save(); c.clip();
    c.strokeStyle = 'rgba(0,0,0,.22)'; c.lineWidth = Math.max(2, depth * 0.07);
    for (var k = 1; k <= 3; k++) {
      var yy = L.hs + depth * 0.3 * (1 - k / 4);
      c.beginPath(); c.moveTo(x0, yy); c.quadraticCurveTo(mid, yy + depth * 0.95 * (1 - k * 0.18), x1, yy); c.stroke();
    }
    c.restore();
    c.strokeStyle = GOLD; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(x1, L.hs + depth * 0.3); c.quadraticCurveTo(mid, L.top + depth * 0.55, x0, L.hs + depth * 0.3); c.stroke();
    /* a tassel where the swags meet */
    c.fillStyle = GOLD;
    rr(c, x1 - 3, L.hs + depth * 0.25, 6, depth * 0.45, 3); c.fill();
  }
  /* bulb strip */
  g = c.createLinearGradient(0, 0, 0, L.hs);
  g.addColorStop(0, '#3a1a12'); g.addColorStop(1, '#22100c');
  c.fillStyle = g; c.fillRect(0, 0, W, L.hs);
  c.fillStyle = 'rgba(255,197,61,.55)'; c.fillRect(0, L.hs - 2, W, 2);
  /* stage lip and footlight hoods */
  g = c.createLinearGradient(0, L.lipY, 0, L.lipY + 9);
  g.addColorStop(0, '#5a2d22'); g.addColorStop(1, '#1b0b10');
  c.fillStyle = g; c.fillRect(0, L.lipY, W, 9);
  c.fillStyle = 'rgba(255,197,61,.45)'; c.fillRect(0, L.lipY, W, 1.5);
  var fn = Math.max(5, Math.round(W / 70));
  for (i = 0; i < fn; i++) {
    var fx0 = (i + 0.5) * W / fn;
    g = c.createRadialGradient(fx0, L.lipY, 1, fx0, L.lipY, 46);
    g.addColorStop(0, 'rgba(255,214,120,.35)'); g.addColorStop(1, 'rgba(255,214,120,0)');
    c.fillStyle = g; c.fillRect(fx0 - 46, L.lipY - 46, 92, 46);
    c.fillStyle = '#140810';
    c.beginPath(); c.ellipse(fx0, L.lipY + 1, 13, 6, 0, Math.PI, TAU); c.fill();
    c.fillStyle = '#ffe3a1';
    c.fillRect(fx0 - 7, L.lipY - 1, 14, 2);
  }
}
/* the coloured lights that drop, one sprite per lane */
function buildGels() {
  gels = [];
  for (var lane = 0; lane < LANES; lane++) {
    var r = L.nr, pad = Math.ceil(r * 0.55), s = Math.ceil((r + pad) * 2), d = ui.dpr;
    var cv = document.createElement('canvas');
    cv.width = Math.ceil(s * d); cv.height = Math.ceil(s * d);
    var c = cv.getContext('2d'); c.scale(d, d);
    var cx = s / 2, cy = s / 2, col = LRGB[lane], dk = col.map(function (v) { return Math.round(v * 0.5); });
    var g = c.createRadialGradient(cx, cy, r * 0.6, cx, cy, r + pad);
    g.addColorStop(0, rgba(col, 0.5)); g.addColorStop(1, rgba(col, 0));
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.fillStyle = '#1a0d1c'; c.fill();
    c.lineWidth = Math.max(1.5, r * 0.09); c.strokeStyle = 'rgba(255,246,251,.9)'; c.stroke();
    g = c.createRadialGradient(cx - r * 0.25, cy - r * 0.3, r * 0.05, cx, cy, r * 0.8);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, LCOL[lane]); g.addColorStop(1, rgba(dk, 1));
    c.beginPath(); c.arc(cx, cy, r * 0.78, 0, TAU); c.fillStyle = g; c.fill();
    c.beginPath(); c.ellipse(cx - r * 0.28, cy - r * 0.34, r * 0.22, r * 0.12, -0.6, 0, TAU); c.fillStyle = 'rgba(255,255,255,.8)'; c.fill();
    gels.push({ cv: cv, s: s });
  }
}
function buildCrowd() {
  var heads = [], top = L.lipY + 8, H = L.H, rows = 3, cu = clamp(L.W / 420, 0.85, 1.35);
  for (var r = 0; r < rows; r++) {
    var s = (8 + r * 3) * cu, y = top + (r + 0.55) * (H - top) / (rows + 0.3), gap = s * 2.9;
    for (var x = -gap * 0.5 + (r % 2) * gap * 0.5 + rnd(0, gap * 0.3); x < L.W + gap; x += gap * rnd(0.85, 1.15)) {
      heads.push({ x: x, y: y + rnd(-2, 2), s: s * rnd(0.9, 1.1), r: r, ph: rnd(0, TAU), arm: Math.random(), sp: rnd(0.8, 1.2) });
    }
  }
  L.heads = heads;
}

function render() {
  if (!ctx || !L) return;
  var c = ctx, W = L.W, H = L.H;
  c.setTransform(ui.dpr, 0, 0, ui.dpr, 0, 0);
  c.drawImage(bgCv, 0, 0, W, H);
  var playing = G && (state === 'play' || state === 'paused');
  var gT = playing ? gameTime() : 0;
  drawCyc(c);
  drawLanes(c, playing ? gT : null);
  drawSpots(c);
  drawReceptors(c);
  if (playing) { drawCombo(c); drawNotes(c, gT); }
  drawFx(c);
  if (playing) { drawJudge(c); drawCount(c, gT); }
  drawRoses(c, false);
  c.drawImage(fgCv, 0, 0, W, H);
  drawBulbs(c, G ? clamp(gT / G.data.end, 0, 1) : 0);
  drawRoses(c, true);
  drawCrowd(c);
  drawConfetti(c);
}

function drawCyc(c) {
  var a = 0.1 + SC.beat * (RM ? 0.03 : 0.06) + SC.excite * 0.05;
  var g = c.createRadialGradient(L.W / 2, L.hitY * 0.55, 10, L.W / 2, L.hitY * 0.55, Math.max(L.W, L.H) * 0.6);
  g.addColorStop(0, rgba(SC.cyc.map(Math.round), a)); g.addColorStop(1, rgba(SC.cyc.map(Math.round), 0));
  c.save(); c.globalCompositeOperation = 'lighter';
  c.fillStyle = g; c.fillRect(0, 0, L.W, L.hitY);
  c.restore();
}
function drawLanes(c, gT) {
  var x0 = L.lx, w = L.lanesW, top = L.laneTop, i;
  var g = c.createLinearGradient(0, top, 0, L.lipY);
  g.addColorStop(0, 'rgba(14,5,16,0)'); g.addColorStop(0.12, 'rgba(14,5,16,.62)'); g.addColorStop(1, 'rgba(14,5,16,.7)');
  c.fillStyle = g; c.fillRect(x0, top, w, L.lipY - top);
  for (i = 0; i <= LANES; i++) {
    c.fillStyle = i === 0 || i === LANES ? 'rgba(255,197,61,.22)' : 'rgba(255,255,255,.07)';
    c.fillRect(Math.round(x0 + i * L.lw) - 1, top, 2, L.hitY - top);
  }
  /* a column of light when a lane is pressed */
  for (i = 0; i < LANES; i++) {
    var gl = Math.max(SC.press[i] ? 1 : 0, SC.glow[i]);
    if (gl <= 0.01) continue;
    g = c.createLinearGradient(0, L.hitY, 0, L.hitY - L.travel * 0.55);
    g.addColorStop(0, rgba(LRGB[i], 0.32 * gl)); g.addColorStop(1, rgba(LRGB[i], 0));
    c.fillStyle = g; c.fillRect(x0 + i * L.lw + 2, L.hitY - L.travel * 0.55, L.lw - 4, L.travel * 0.55);
  }
  /* beat lines moving with the music */
  if (gT != null && G) {
    var spb = G.data.spb, pxs = L.travel / APPROACH[G.mode];
    var k = Math.ceil(gT / spb);
    for (; ; k++) {
      var y = L.hitY - (k * spb - gT) * pxs;
      if (y < top) break;
      if (k < 0) continue;
      c.fillStyle = k % 4 === 0 ? 'rgba(255,197,61,.16)' : 'rgba(255,255,255,.055)';
      c.fillRect(x0, Math.round(y), w, k % 4 === 0 ? 2 : 1);
    }
  }
}
function drawSpots(c) {
  c.save(); c.globalCompositeOperation = 'lighter';
  for (var i = 0; i < 2; i++) {
    var sp = SC.spots[i], sx = i ? L.W * 0.94 : L.W * 0.06, sy = L.hs, ex = sp.x, ey = L.hitY, rw = L.lw * 0.72;
    var a = 0.055 + 0.09 * sp.f;
    var g = c.createLinearGradient(0, sy, 0, ey);
    g.addColorStop(0, 'rgba(255,236,190,' + (a * 1.7).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,236,190,' + a.toFixed(3) + ')');
    c.fillStyle = g;
    c.beginPath(); c.moveTo(sx - 6, sy); c.lineTo(sx + 6, sy); c.lineTo(ex + rw, ey); c.lineTo(ex - rw, ey); c.closePath(); c.fill();
    var pg = c.createRadialGradient(ex, ey, 0, ex, ey, rw * 1.4);
    pg.addColorStop(0, 'rgba(255,236,190,' + (0.16 + 0.24 * sp.f).toFixed(3) + ')'); pg.addColorStop(1, 'rgba(255,236,190,0)');
    c.fillStyle = pg;
    c.beginPath(); c.ellipse(ex, ey, rw * 1.4, rw * 0.5, 0, 0, TAU); c.fill();
  }
  c.restore();
}
function drawReceptors(c) {
  var y = L.hitY, r = L.nr * 1.04, i;
  /* the footlight line */
  c.save(); c.globalCompositeOperation = 'lighter';
  var g = c.createLinearGradient(0, y - 16, 0, y + 16);
  g.addColorStop(0, 'rgba(255,197,61,0)'); g.addColorStop(0.5, 'rgba(255,197,61,' + (0.28 + SC.beat * 0.12).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,197,61,0)');
  c.fillStyle = g; c.fillRect(L.lx - 10, y - 16, L.lanesW + 20, 32);
  c.restore();
  g = c.createLinearGradient(L.lx, 0, L.lx + L.lanesW, 0);
  g.addColorStop(0, 'rgba(255,197,61,.2)'); g.addColorStop(0.5, '#ffe7a6'); g.addColorStop(1, 'rgba(255,197,61,.2)');
  c.fillStyle = g; c.fillRect(L.lx, y - 2, L.lanesW, 4);
  for (i = 0; i < LANES; i++) {
    var x = laneX(i), on = Math.max(SC.press[i] ? 1 : 0, SC.glow[i]);
    c.beginPath(); c.arc(x, y, r, 0, TAU);
    c.fillStyle = on > 0.05 ? rgba(LRGB[i], 0.2 + 0.3 * on) : 'rgba(20,8,22,.8)';
    c.fill();
    c.lineWidth = Math.max(2.5, r * 0.11);
    c.strokeStyle = rgba(LRGB[i], Math.min(1, 0.55 + 0.45 * on + SC.beat * 0.12));
    c.stroke();
    c.beginPath(); c.arc(x, y, r * 0.62, 0, TAU);
    c.lineWidth = 1.5; c.strokeStyle = rgba(LRGB[i], 0.3); c.stroke();
    if (FINE) {
      c.fillStyle = rgba(LRGB[i], 0.85);
      c.font = Math.round(r * 0.72) + 'px ' + DISP;
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(KEYS[i], x, y + r * 0.05);
    }
  }
}
function drawCombo(c) {
  if (!G || G.combo < 4) return;
  var y = L.top + (L.hitY - L.top) * 0.44, sz = Math.round(clamp(L.lw * 0.9, 56, 100));
  var sc = RM ? 1 : 1 + 0.12 * SC.comboPop;
  c.save(); c.translate(L.W / 2, y); c.scale(sc, sc);
  c.textAlign = 'center'; c.textBaseline = 'alphabetic';
  c.font = sz + 'px ' + DISP;
  c.fillStyle = G.combo >= 25 ? 'rgba(255,197,61,.32)' : 'rgba(255,246,251,.2)';
  c.fillText(String(G.combo), 0, 0);
  c.font = Math.round(sz * 0.28) + 'px ' + DISP;
  c.fillStyle = 'rgba(255,246,251,.32)';
  c.fillText('COMBO', 0, sz * 0.32);
  c.restore();
}
function drawNotes(c, gT) {
  var notes = G.notes, pxs = L.travel / APPROACH[G.mode], r = L.nr, i;
  var ahead = (L.travel + r * 2) / pxs, behind = (L.lipY - L.hitY + r) / pxs;
  while (G.di < notes.length && notes[G.di].state >= 2 && notes[G.di].end < gT - behind - 0.3) G.di++;
  for (i = G.di; i < notes.length; i++) {
    var n = notes[i];
    if (n.t - gT > ahead) break;
    if (n.end < gT - behind - 0.5 && n.state !== 0) continue;
    if (n.state === 2) continue;
    var x = laneX(n.lane), y = L.hitY - (n.t - gT) * pxs, sp = gels[n.lane];
    var missed = n.state === 3;
    if (n.len > 0) {
      var yHead = n.state === 1 ? L.hitY : y, yTail = L.hitY - (n.end - gT) * pxs;
      yTail = Math.max(yTail, L.laneTop - r);
      if (yHead > yTail) {
        var bw = r * 0.62, holding = n.state === 1;
        c.globalAlpha = missed ? 0.25 : 1;
        rr(c, x - bw / 2, yTail, bw, yHead - yTail, bw / 2);
        c.fillStyle = rgba(LRGB[n.lane], holding ? 0.8 : 0.45); c.fill();
        rr(c, x - bw * 0.17, yTail + 3, bw * 0.34, Math.max(0, yHead - yTail - 6), bw * 0.17);
        c.fillStyle = holding ? 'rgba(255,255,255,.75)' : 'rgba(255,255,255,.28)'; c.fill();
        c.beginPath(); c.arc(x, yTail, r * 0.4, 0, TAU); c.fillStyle = LCOL[n.lane]; c.fill();
        c.globalAlpha = 1;
      }
      if (n.state === 1) {
        c.save(); c.globalCompositeOperation = 'lighter';
        c.globalAlpha = RM ? 0.7 : 0.55 + 0.25 * Math.sin(SC.t * 18);
        c.drawImage(sp.cv, x - sp.s / 2, L.hitY - sp.s / 2, sp.s, sp.s);
        c.restore();
        continue;
      }
    }
    if (y > L.lipY + r) continue;
    if (missed) {
      c.globalAlpha = clamp(0.32 - (y - L.hitY) / (L.lipY - L.hitY + r) * 0.3, 0, 0.32);
      c.drawImage(sp.cv, x - sp.s / 2, y - sp.s / 2, sp.s, sp.s);
      c.globalAlpha = 1;
    } else {
      c.drawImage(sp.cv, x - sp.s / 2, y - sp.s / 2, sp.s, sp.s);
    }
  }
}
function drawFx(c) {
  for (var i = 0; i < SC.fx.length; i++) {
    var p = SC.fx[i], k = p.life / p.max;
    if (p.k === 'ring') {
      var rad = p.r0 + (p.r1 - p.r0) * (1 - k);
      c.beginPath(); c.arc(p.x, p.y, rad, 0, TAU);
      c.lineWidth = Math.max(1, 5 * k); c.strokeStyle = rgba(p.rgb, k * 0.9); c.stroke();
    } else if (p.k === 'spark') {
      c.globalAlpha = k; c.fillStyle = p.col;
      c.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
      c.globalAlpha = 1;
    } else if (p.k === 'txt') {
      c.globalAlpha = Math.min(1, k * 2);
      c.font = Math.round(L.nr * 0.75) + 'px ' + DISP;
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.lineWidth = 4; c.strokeStyle = INK; c.strokeText(p.text, p.x, p.y - (1 - k) * 14);
      c.fillStyle = p.col; c.fillText(p.text, p.x, p.y - (1 - k) * 14);
      c.globalAlpha = 1;
    }
  }
}
var JTXT = { perfect: ['PERFECT!', GOLD], great: ['GREAT!', TEAL], good: ['GOOD', '#ffd6e8'], missed: ['MISSED', 'rgba(214,190,255,.8)'] };
function drawJudge(c) {
  var j = SC.judge;
  if (!j) return;
  var age = SC.t - j.t;
  if (age > 0.6) return;
  var a = age < 0.4 ? 1 : 1 - (age - 0.4) / 0.2;
  var miss = j.g === 'missed';
  var sc = RM ? 1 : 1 + 0.3 * Math.max(0, 1 - age / 0.12);
  var y = L.hitY - L.nr * 2.6, sz = Math.round(clamp(L.lw * 0.4, 28, 46) * (miss ? 0.75 : 1));
  c.save(); c.globalAlpha = a; c.translate(L.W / 2, y); c.scale(sc, sc);
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = sz + 'px ' + DISP;
  c.lineJoin = 'round'; c.lineWidth = Math.max(4, sz * 0.14); c.strokeStyle = 'rgba(26,13,28,.9)';
  var tx = JTXT[j.g];
  c.strokeText(tx[0], 0, 0);
  c.fillStyle = tx[1]; c.fillText(tx[0], 0, 0);
  if (j.sub) {
    c.font = '700 ' + Math.round(clamp(sz * 0.3, 12, 16)) + 'px ' + BODY.replace(/^var\(--body,|\)$/g, '');
    c.lineWidth = 4; c.strokeText(j.sub, 0, sz * 0.62);
    c.fillStyle = '#f3e3ee'; c.fillText(j.sub, 0, sz * 0.62);
  }
  c.restore();
}
function drawCount(c, gT) {
  var spb = G.data.spb;
  if (gT < 0 || gT >= 4 * spb) return;
  var k = Math.floor(gT / spb), age = gT - k * spb;
  var lab = ['5', '6', '7', '8!'][k];
  var sz = Math.round(clamp(L.lw * 1.3, 80, 150)), sc = RM ? 1 : 1 + 0.35 * Math.max(0, 1 - age / 0.12);
  c.save(); c.globalAlpha = clamp(1 - age / spb * 0.7, 0, 1);
  c.translate(L.W / 2, L.top + (L.hitY - L.top) * 0.42); c.scale(sc, sc);
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = sz + 'px ' + DISP;
  c.lineWidth = sz * 0.1; c.lineJoin = 'round'; c.strokeStyle = 'rgba(26,13,28,.9)'; c.strokeText(lab, 0, 0);
  c.fillStyle = GOLD; c.fillText(lab, 0, 0);
  c.restore();
}
function drawBulbs(c, prog) {
  var n = Math.max(12, Math.floor(L.W / 24)), y = L.hs / 2, br = Math.max(2.4, L.hs * 0.24), i;
  var showing = state === 'play' || state === 'paused';
  var head = Math.floor(prog * n);
  c.save();
  for (i = 0; i < n; i++) {
    var x = (i + 0.5) * L.W / n, lit;
    if (showing) lit = i < head || (i === head && (RM || SC.beat > 0.3));
    else lit = RM ? true : ((i + Math.floor(SC.t * 4)) % 3 !== 0);
    if (lit) {
      c.globalCompositeOperation = 'lighter';
      var g = c.createRadialGradient(x, y, 0, x, y, br * 3.2);
      g.addColorStop(0, 'rgba(255,214,120,.5)'); g.addColorStop(1, 'rgba(255,214,120,0)');
      c.fillStyle = g; c.fillRect(x - br * 3.2, y - br * 3.2, br * 6.4, br * 6.4);
      c.globalCompositeOperation = 'source-over';
      c.fillStyle = '#fff3c9';
    } else c.fillStyle = '#5b3b2a';
    c.beginPath(); c.arc(x, y, br, 0, TAU); c.fill();
  }
  c.restore();
}
function drawCrowd(c) {
  var heads = L.heads || [], cols = ['#2c1432', '#1e0b23', '#130615'], rims = [0.12, 0.2, 0.3];
  var amp = RM ? 0 : (1 + 6 * SC.excite) * clamp(L.W / 420, 0.85, 1.35);
  for (var i = 0; i < heads.length; i++) {
    var h = heads[i], s = h.s;
    var dy = -Math.abs(Math.sin(SC.t * 3.3 * h.sp + h.ph)) * amp - SC.ovation * s * 1.3;
    var x = h.x, y = h.y + dy;
    var up = SC.ovation > 0.3 || h.arm < (SC.excite - 0.35) * 1.3;
    c.fillStyle = cols[h.r];
    if (up) {
      var wave = RM ? 0 : Math.sin(SC.t * 6 * h.sp + h.ph) * s * 0.45;
      c.strokeStyle = cols[h.r]; c.lineWidth = s * 0.55; c.lineCap = 'round';
      c.beginPath(); c.moveTo(x - s * 1.1, y + s * 1.2); c.lineTo(x - s * 1.5 + wave, y - s * 1.7); c.stroke();
      c.beginPath(); c.moveTo(x + s * 1.1, y + s * 1.2); c.lineTo(x + s * 1.5 + wave, y - s * 1.7); c.stroke();
    }
    rr(c, x - s * 1.55, y + s * 0.85, s * 3.1, L.H - y + s, s * 1.1); c.fill();
    c.beginPath(); c.arc(x, y, s, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(255,197,61,' + rims[h.r] + ')'; c.lineWidth = 1.5;
    c.beginPath(); c.arc(x, y, s, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
  }
}
function drawRose(c, x, y, rot, sc) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc);
  c.strokeStyle = '#2f9e5a'; c.lineWidth = 2.2; c.lineCap = 'round';
  c.beginPath(); c.moveTo(0, 3); c.lineTo(0, 22); c.stroke();
  c.fillStyle = '#2f9e5a'; c.beginPath(); c.ellipse(4, 13, 4.5, 2, -0.5, 0, TAU); c.fill();
  c.fillStyle = RED; c.beginPath(); c.arc(0, 0, 6.5, 0, TAU); c.fill();
  c.strokeStyle = '#a5202d'; c.lineWidth = 1.3;
  c.beginPath(); c.arc(0, 0.5, 3.4, Math.PI * 0.9, Math.PI * 2.3); c.stroke();
  c.restore();
}
function drawRoses(c, flying) {
  for (var i = 0; i < SC.roses.length; i++) {
    var p = SC.roses[i];
    if (p.wait > 0 || (!!p.landed) === flying) continue;
    drawRose(c, p.x, p.y, p.rot, p.sc);
  }
}
function drawConfetti(c) {
  for (var i = 0; i < SC.conf.length; i++) {
    var p = SC.conf[i];
    c.save(); c.translate(p.x, p.y); c.rotate(p.rot);
    c.globalAlpha = Math.min(1, p.life);
    c.fillStyle = p.c; c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 1.3)) + 1);
    c.restore();
  }
}

/* ---------- effects ---------- */
function hitFx(lane, g) {
  var x = laneX(lane), y = L.hitY, col = LRGB[lane];
  SC.glow[lane] = 1;
  SC.fx.push({ k: 'ring', x: x, y: y, r0: L.nr, r1: L.nr * (g === 'perfect' ? 2.1 : 1.7), life: 0.32, max: 0.32, rgb: g === 'perfect' ? [255, 236, 170] : col });
  if (!RM) {
    var n = g === 'perfect' ? 12 : g === 'great' ? 8 : 4;
    for (var i = 0; i < n; i++) SC.fx.push({ k: 'spark', x: x + rnd(-6, 6), y: y, vx: rnd(-150, 150), vy: rnd(-320, -90), life: rnd(0.3, 0.55), max: 0.55, col: pick(['#ffffff', LCOL[lane], '#ffe7a6']), s: rnd(2, 4) });
  }
  if (SC.fx.length > 240) SC.fx.splice(0, SC.fx.length - 240);
  /* a spotlight swings across to the hit */
  SC.flip ^= 1;
  var sp = SC.spots[SC.flip];
  if (!RM) sp.tx = x;
  sp.f = 1; sp.idle = 0;
  SC.cyc = [SC.cyc[0] + (col[0] - SC.cyc[0]) * 0.5, SC.cyc[1] + (col[1] - SC.cyc[1]) * 0.5, SC.cyc[2] + (col[2] - SC.cyc[2]) * 0.5];
}
function showJudge(g, err) {
  SC.judge = { g: g, t: SC.t, sub: (g === 'great' || g === 'good') ? (err < 0 ? 'a touch early' : 'a touch late') : '' };
}
function throwRoses(n) {
  var count = n * 3;
  for (var i = 0; i < count; i++) {
    var tx = rnd(L.W * 0.12, L.W * 0.88), ty = rnd(L.hitY + 6, L.lipY - 6);
    var p = { x: tx, y: ty, rot: rnd(-1.6, -1.1) * (Math.random() < 0.5 ? 1 : -1), vr: 0, sc: clamp(L.lw / 90, 0.8, 1.3), landed: true, wait: 0 };
    if (!RM) {
      var x0 = tx + rnd(-80, 80), y0 = L.H + 20, T1 = rnd(0.8, 1.2), g = 900;
      p.x = x0; p.y = y0; p.vx = (tx - x0) / T1; p.vy = (ty - y0 - 0.5 * g * T1 * T1) / T1; p.g = g; p.ly = ty;
      p.rot = rnd(0, TAU); p.vr = rnd(-9, 9); p.landed = false; p.wait = rnd(0, 1.4);
    }
    SC.roses.push(p);
  }
}

/* the scene keeps breathing in every state */
function scene(dt) {
  var i, p;
  SC.beat = Math.max(0, SC.beat - dt * 4);
  SC.comboPop = Math.max(0, SC.comboPop - dt * 7);
  for (i = 0; i < LANES; i++) SC.glow[i] = Math.max(0, SC.glow[i] - dt * 3.5);
  if (state === 'menu') SC.exciteT = 0.12;
  SC.excite += (SC.exciteT - SC.excite) * Math.min(1, dt * 1.6);
  SC.ovation += (SC.ovationT - SC.ovation) * Math.min(1, dt * (RM ? 20 : 2.5));
  if (L) {
    var def = [laneX(0.7), laneX(2.3)];
    for (i = 0; i < 2; i++) {
      var sp = SC.spots[i];
      sp.idle += dt; sp.f = Math.max(0, sp.f - dt * 2.2);
      if (RM) sp.tx = def[i];
      else if (sp.idle > 1.4) sp.tx = def[i] + Math.sin(SC.t * 0.6 + i * 2) * L.lw * 0.9;
      if (!sp.x) sp.x = def[i];
      sp.x += (sp.tx - sp.x) * (RM ? 1 : Math.min(1, dt * 9));
    }
  }
  for (i = SC.fx.length - 1; i >= 0; i--) {
    p = SC.fx[i]; p.life -= dt;
    if (p.life <= 0) { SC.fx.splice(i, 1); continue; }
    if (p.k === 'spark') { p.vy += 700 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
  }
  for (i = 0; i < SC.roses.length; i++) {
    p = SC.roses[i];
    if (p.landed) continue;
    if (p.wait > 0) { p.wait -= dt; continue; }
    p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    if (p.vy > 0 && p.y >= p.ly) { p.y = p.ly; p.landed = true; p.rot = (Math.random() < 0.5 ? 1 : -1) * rnd(1.1, 1.6); }
  }
  for (i = SC.conf.length - 1; i >= 0; i--) {
    p = SC.conf[i]; p.life -= dt;
    if (p.life <= 0 || p.y > L.H + 20) { SC.conf.splice(i, 1); continue; }
    p.vy = Math.min(p.vy + 120 * dt, 140); p.vx *= (1 - dt);
    p.x += (p.vx + Math.sin(SC.t * 3 + p.ph) * 26) * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
  }
}

/* ==========================================================
   OVERLAY AND CARDS
   ========================================================== */
function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function mmss(s) { s = Math.round(s); return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60); }

function build() {
  var o = el('div', 'lwss');
  o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', GAME + ', a rhythm game');
  var bar = el('div', 'ss-bar');
  var title = el('div', 'ss-title', NOTE_SVG + '<span>' + GAME + '</span>');
  var pz = el('button', 'ss-tb', 'Pause'); pz.type = 'button'; pz.hidden = true;
  var snd = el('button', 'ss-tb'); snd.type = 'button';
  var x = el('button', 'ss-x', 'Close &#10005;'); x.type = 'button'; x.setAttribute('aria-label', 'Close the game');
  bar.appendChild(title); bar.appendChild(pz); bar.appendChild(snd); bar.appendChild(x);
  var stage = el('div', 'ss-stage');
  var cv = document.createElement('canvas');
  cv.setAttribute('role', 'img');
  cv.setAttribute('aria-label', 'The stage. Coloured lights drop down four lanes towards the glowing footlights. Tap a lane, or press D, F, J or K (or the arrow keys), as a light reaches the line.');
  var hud = el('div', 'ss-hud', '<div class="ss-song"><span></span><small></small></div><div class="ss-acc"><span>--</span><small>Accuracy</small></div>');
  hud.hidden = true;
  var hint = el('div', 'ss-hint gone');
  var tst = el('div', 'ss-toast');
  var card = el('div', 'ss-card'); card.hidden = true;
  var live = el('div', 'ss-sr'); live.setAttribute('aria-live', 'polite');
  stage.appendChild(cv); stage.appendChild(hud); stage.appendChild(hint); stage.appendChild(tst); stage.appendChild(card); stage.appendChild(live);
  o.appendChild(bar); o.appendChild(stage);
  ui = { o: o, bar: bar, pause: pz, snd: snd, x: x, stage: stage, canvas: cv, hud: hud, hint: hint, toast: tst, card: card, live: live,
    songName: hud.querySelector('.ss-song span'), songMode: hud.querySelector('.ss-song small'), acc: hud.querySelector('.ss-acc span'), accTxt: '', dpr: 1 };
  ctx = cv.getContext('2d');

  x.addEventListener('click', close);
  pz.addEventListener('click', function () { doPause(false); });
  snd.addEventListener('click', function () { unlockAudio(); toggleSound(); });
  card.addEventListener('click', onCardClick);
  bindPointer(cv);
  o.addEventListener('pointerdown', unlockAudio);
  return o;
}
function toggleSound() {
  store.sound = !store.sound; saveStore(); syncButtons(); syncSoundGain();
  if (store.sound && state !== 'play') sTick();
}
function syncButtons() {
  if (!ui.snd) return;
  ui.snd.textContent = store.sound ? 'Sound on' : 'Sound off';
  ui.snd.setAttribute('aria-pressed', store.sound ? 'true' : 'false');
}
function onCardClick(e) {
  var b = e.target.closest ? e.target.closest('button') : null;
  if (!b || !ui.card.contains(b)) return;
  var act = b.getAttribute('data-act'), song = b.getAttribute('data-song'), mode = b.getAttribute('data-mode');
  if (song) { startSong(song, store.speed); return; }
  if (mode) {
    if (store.speed !== mode) { store.speed = mode; saveStore(); sTick(); }
    showMenu(mode);
    return;
  }
  if (act === 'resume') resume();
  else if (act === 'encore') encore();
  else if (act === 'pick') pickAnother();
  else if (act === 'close') close();
  else if (act === 'advice' && G && G.result) {
    store.nudge = clamp(store.nudge + G.result.advice, -200, 200); saveStore();
    var box = b.parentNode;
    box.innerHTML = 'Timing nudged to ' + nudgeWords(store.nudge) + '. It is saved for next time, and you can change it on the song list.';
    var go = ui.card.querySelector('.ss-go'); if (go) focusIn(go);
  }
}
function encore() { if (G) startSong(G.song.id, G.mode); }
function pickAnother() {
  if (G && G.bus) { killBus(G.bus); G.bus = null; }
  var last = G ? G.song.id : null;
  G = null;
  showMenu(null, last);
}

function nudgeWords(v) {
  if (!v) return 'spot on';
  return Math.abs(v) + ' ms for ' + (v > 0 ? 'late' : 'early') + ' taps';
}
function nudgeHTML(fold) {
  var inner = '<input id="ssNudge" type="range" min="-150" max="150" step="5" value="' + store.nudge + '" aria-labelledby="ssNudgeLab" aria-describedby="ssNudgeOut">' +
    '<div class="ss-ends"><span>I tap early</span><output id="ssNudgeOut">' + cap(nudgeWords(store.nudge)) + '</output><span>I tap late</span></div>' +
    '<p class="ss-small">If the lights and the music feel out of step, slide this until taps feel right.</p>';
  if (fold) return '<details class="ss-nudge"' + (store.nudge ? ' open' : '') + '><summary id="ssNudgeLab">Tap feels early or late?</summary>' + inner + '</details>';
  return '<div class="ss-nudge"><div class="ss-lab" id="ssNudgeLab">Tap feels early or late?</div>' + inner + '</div>';
}
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function bindNudge() {
  var inp = ui.card.querySelector('#ssNudge'), out = ui.card.querySelector('#ssNudgeOut');
  if (!inp) return;
  inp.addEventListener('input', function () {
    store.nudge = clamp(Math.round(Number(inp.value) / 5) * 5, -200, 200);
    out.textContent = cap(nudgeWords(store.nudge));
    saveStore();
  });
}

function showMenu(focusMode, focusSong) {
  state = 'menu';
  ui.hud.hidden = true; ui.pause.hidden = true;
  ui.hint.className = 'ss-hint gone';
  SC.ovationT = 0; SC.judge = null;
  var mode = store.speed, rows = '';
  SONGS.forEach(function (s, i) {
    var d = buildSong(s, mode), best = bestOf(s.id, mode), dots = '';
    for (var k = 1; k <= 4; k++) dots += '<i class="' + (k <= s.level ? 'on' : '') + '"></i>';
    rows += '<li><button type="button" data-song="' + s.id + '" aria-label="' + esc(s.name + '. ' + s.line + ' ' + LEVELS[s.level] + '. ' + (best ? 'Best ' + best + ' percent.' : 'Not played yet.')) + '">' +
      '<span class="ss-num" aria-hidden="true">' + (i + 1) + '</span>' +
      '<span class="ss-sn"><b>' + esc(s.name) + '</b><small>' + esc(s.line) + '</small><span class="ss-lvl">' + dots + LEVELS[s.level] + ' &middot; ' + mmss(d.end) + '</span></span>' +
      '<span class="ss-sb">' + roseRow(rosesFor(best)) + (best ? '<b>Best ' + best + '%</b>' : '<b>New</b>') + '</span>' +
      '</button></li>';
  });
  ui.card.className = 'ss-card menu';
  ui.card.innerHTML =
    '<span class="ss-kick">Tonight\'s programme</span>' +
    '<h2>Pick a song</h2>' +
    '<p>Tap along to the band. Every note is optional, and the show always goes on.</p>' +
    '<div class="ss-mode" role="group" aria-label="How many notes">' +
      '<button type="button" data-mode="relaxed" aria-pressed="' + (mode === 'relaxed') + '">Relaxed<small>Fewer notes, a gentler tempo</small></button>' +
      '<button type="button" data-mode="full" aria-pressed="' + (mode === 'full') + '">Full show<small>Every note of the tune</small></button>' +
    '</div>' +
    '<ol class="ss-songs">' + rows + '</ol>' +
    nudgeHTML(true) +
    (FINE ? '<p class="ss-tip">Keys: D F J K or the arrow keys. P pauses, M turns the sound on or off.</p>' : '');
  ui.card.hidden = false;
  bindNudge();
  var f = focusMode ? ui.card.querySelector('[data-mode="' + focusMode + '"]') : ui.card.querySelector('[data-song="' + (focusSong || SONGS[0].id) + '"]');
  focusIn(f);
}

function showEnd() {
  var r = G.result, s = G.song, c = G.counts;
  var head, line;
  if (r.roses === 3) { head = 'Showstopper!'; line = pick(['They are on their feet for that one.', 'An absolute showstopper. The crowd adored it.']); }
  else if (r.roses === 2) { head = 'Bravo!'; line = pick(['The crowd loved that one.', 'Lovely timing. Listen to that applause.']); }
  else if (r.roses === 1) { head = 'Lovely show'; line = pick(['A round of applause from the crowd. Nicely done.', 'The band enjoyed having you on stage.']); }
  else if (G.hits === 0) { head = 'The band played on'; line = 'Thanks for listening to the whole number. Tap along next time if you fancy it.'; }
  else { head = 'Lovely to have you on stage'; line = 'Every show is a rehearsal for the next one.'; }
  var bestNow = bestOf(s.id, G.mode);
  var advice = '';
  if (r.advice) {
    advice = '<div class="ss-advice">Your taps landed ' + (r.advice > 0 ? 'a little late' : 'a little early') + ' on average. That can just be the screen or speakers. Nudge the timing by ' + Math.abs(r.advice) + ' ms to match?' +
      '<br><button type="button" data-act="advice">Nudge the timing</button></div>';
  }
  ui.card.className = 'ss-card small';
  ui.card.innerHTML =
    (r.newBest ? '<div class="ss-badge ss-pop">New best! Standing ovation</div>' : '<span class="ss-kick">Curtain down</span>') +
    '<h2>' + head + '</h2>' +
    '<p class="ss-sub">' + esc(s.name) + ' &middot; ' + (G.mode === 'full' ? 'Full show' : 'Relaxed') + '</p>' +
    roseRow(r.roses, 'ss-roses') +
    '<p>' + line + '</p>' +
    '<div class="ss-nums"><div><span>Accuracy</span><b>' + r.acc + '%</b></div><div><span>Best combo</span><b>' + G.maxCombo + '</b></div><div><span>Your best</span><b>' + bestNow + '%</b></div></div>' +
    '<p class="ss-counts">Perfect ' + c.perfect + ' &middot; Great ' + c.great + ' &middot; Good ' + c.good + ' &middot; Missed ' + c.missed + '</p>' +
    advice +
    '<button type="button" class="ss-go" data-act="encore">Encore</button>' +
    '<button type="button" class="ss-c2" data-act="pick">Pick another song</button>' +
    '<button type="button" class="ss-c2" data-act="close">Close</button>';
  ui.card.hidden = false;
  say(head + ' ' + r.acc + ' percent accuracy. ' + r.roses + ' roses out of 3.' + (r.newBest ? ' New best.' : ''));
  focusIn(ui.card.querySelector('.ss-go'));
}

function updateHud() {
  if (!ui.acc || !G) return;
  var a = G.judged ? Math.floor(G.score / G.judged + 1e-9) + '%' : '--';
  if (a !== ui.accTxt) { ui.accTxt = a; ui.acc.textContent = a; }
}
var toastT = 0;
function toast(t) {
  if (!ui.toast) return;
  ui.toast.textContent = t;
  ui.toast.className = 'ss-toast on';
  clearTimeout(toastT); toastT = setTimeout(function () { if (ui.toast) ui.toast.className = 'ss-toast'; }, 1500);
}
function say(t) { if (ui.live) ui.live.textContent = t; }
function focusIn(b) { if (!b) return; try { b.focus({ preventScroll: true }); } catch (e) { b.focus(); } }
function focusStage() { try { ui.canvas.setAttribute('tabindex', '-1'); ui.canvas.focus({ preventScroll: true }); } catch (e) {} }

function layout() {
  if (!ui.o) return;
  var r = ui.stage.getBoundingClientRect();
  var W = Math.max(280, Math.floor(r.width)), H = Math.max(320, Math.floor(r.height));
  ui.dpr = Math.min(window.devicePixelRatio || 1, 2);
  ui.canvas.width = Math.round(W * ui.dpr); ui.canvas.height = Math.round(H * ui.dpr);
  ui.canvas.style.width = W + 'px'; ui.canvas.style.height = H + 'px';
  computeLayout(W, H);
  buildBg(); buildFg(); buildGels(); buildCrowd();
  SC.spots[0].x = SC.spots[0].tx = laneX(0.7);
  SC.spots[1].x = SC.spots[1].tx = laneX(2.3);
  ui.hud.style.top = (L.top + 4) + 'px';
  ui.toast.style.top = (L.top + 50) + 'px';
  ui.hint.style.top = Math.round(L.hitY - L.travel * 0.5) + 'px';
  render();
}

/* ---------- pointer: tap anywhere in a lane ---------- */
function bindPointer(cv) {
  cv.addEventListener('pointerdown', function (e) {
    if (state !== 'play' || !L) return;
    e.preventDefault();
    var r = cv.getBoundingClientRect();
    var lane = laneAtX(e.clientX - r.left);
    try { cv.setPointerCapture(e.pointerId); } catch (err) {}
    ptr[e.pointerId] = lane;
    press(lane, 'p' + e.pointerId);
  });
  function up(e) {
    if (!hasOwn(ptr, e.pointerId)) return;
    var lane = ptr[e.pointerId];
    delete ptr[e.pointerId];
    release(lane, 'p' + e.pointerId);
  }
  cv.addEventListener('pointerup', up);
  cv.addEventListener('pointercancel', up);
  cv.addEventListener('lostpointercapture', up);
  cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });
}

/* ---------- keys ---------- */
function laneForKey(e) {
  var k = e.key, c = e.code;
  if (c === 'KeyD' || k === 'd' || k === 'D' || k === 'ArrowLeft') return 0;
  if (c === 'KeyF' || k === 'f' || k === 'F' || k === 'ArrowDown') return 1;
  if (c === 'KeyJ' || k === 'j' || k === 'J' || k === 'ArrowUp') return 2;
  if (c === 'KeyK' || k === 'k' || k === 'K' || k === 'ArrowRight') return 3;
  return -1;
}
function keySrc(e) { return 'k' + (e.code || e.key); }
function onKey(e) {
  if (state === 'closed') return;
  var k = e.key, tgt = e.target, onBtn = tgt && tgt.tagName === 'BUTTON', onInput = tgt && tgt.tagName === 'INPUT';
  if (k === 'Escape' || k === 'Esc') { e.preventDefault(); close(); return; }
  if (k === 'Tab') { trapTab(e); return; }
  unlockAudio();
  if (state === 'play') {
    var lane = laneForKey(e);
    if (lane >= 0) { e.preventDefault(); if (!e.repeat) press(lane, keySrc(e)); return; }
    if (k === 'p' || k === 'P') { e.preventDefault(); doPause(false); return; }
    if (k === 'm' || k === 'M') { toggleSound(); return; }
    if (k === ' ' || k === 'Spacebar') e.preventDefault();
    return;
  }
  if (state === 'paused') {
    if (k === 'p' || k === 'P' || ((k === ' ' || k === 'Enter') && !onBtn && !onInput)) { e.preventDefault(); resume(); }
    return;
  }
  if (onInput) return;
  if (k === 'm' || k === 'M') { toggleSound(); return; }
  if (state === 'menu') {
    if (/^[1-4]$/.test(k)) { e.preventDefault(); startSong(SONGS[+k - 1].id, store.speed); }
    return;
  }
  if (state === 'over') {
    if ((k === ' ' || k === 'Enter') && !onBtn) { e.preventDefault(); if (Date.now() - overAt > 400) encore(); }
  }
}
function onKeyUp(e) {
  if (state === 'closed' || !G) return;
  var lane = laneForKey(e);
  if (lane >= 0) release(lane, keySrc(e));
}
function trapTab(e) {
  var list = Array.prototype.filter.call(ui.o.querySelectorAll('button,input'), function (b) { return !b.disabled && b.offsetParent !== null; });
  if (!list.length) return;
  var i = list.indexOf(document.activeElement);
  e.preventDefault();
  var n = e.shiftKey ? (i <= 0 ? list.length - 1 : i - 1) : (i < 0 || i >= list.length - 1 ? 0 : i + 1);
  list[n].focus();
}
function onVis() {
  if (document.hidden) {
    if (state === 'play') doPause(true);
    else if (AC && AC.state === 'running') { try { AC.suspend(); } catch (e) {} }
  } else if (state === 'menu' || state === 'over') {
    if (AC && AC.state === 'suspended') { try { AC.resume(); } catch (e) {} }
  }
  lastTs = 0;
}
function onBlur() { if (state === 'play') releaseAll(); }
function onResize() { layout(); }

function frame(ts) {
  raf = requestAnimationFrame(frame);
  var dt = lastTs ? (ts - lastTs) / 1000 : 0;
  lastTs = ts;
  if (dt > 0.05) dt = 0.05;
  SC.t += dt;
  if (state === 'play' && G && !G.paused) step(dt);
  scene(dt);
  render();
}

function open() {
  if (state !== 'closed') return;
  opener = document.activeElement;
  loadStore();
  unlockAudio();
  RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  FINE = !!(window.matchMedia && matchMedia('(pointer: fine)').matches);
  var o = build();
  document.body.appendChild(o);
  prevOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  syncButtons(); syncSoundGain();
  state = 'menu';
  layout();
  showMenu();
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('keyup', onKeyUp, true);
  window.addEventListener('resize', onResize);
  window.addEventListener('blur', onBlur);
  document.addEventListener('visibilitychange', onVis);
  pumpT = setInterval(pump, 30);
  lastTs = 0;
  raf = requestAnimationFrame(frame);
}
function close() {
  if (state === 'closed') return;
  state = 'closed';
  cancelAnimationFrame(raf); raf = 0;
  clearInterval(pumpT); pumpT = 0;
  clearTimeout(toastT);
  window.removeEventListener('keydown', onKey, true);
  window.removeEventListener('keyup', onKeyUp, true);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('blur', onBlur);
  document.removeEventListener('visibilitychange', onVis);
  if (G && G.bus) killBus(G.bus);
  if (fxBus) { killBus(fxBus); fxBus = null; }
  if (ui.o && ui.o.parentNode) ui.o.parentNode.removeChild(ui.o);
  ui = {}; ctx = null; G = null; bgCv = null; fgCv = null; gels = []; L = null; ptr = {};
  SC.fx.length = 0; SC.roses.length = 0; SC.conf.length = 0; SC.ovation = SC.ovationT = 0; SC.judge = null;
  document.documentElement.style.overflow = prevOverflow;
  if (AC && AC.state === 'running') { try { AC.suspend(); } catch (e) {} }
  updateNote();
  if (opener && opener.focus) { try { opener.focus({ preventScroll: true }); } catch (e) {} }
}

/* ---------- the button in the hero ---------- */
var note = null;
function updateNote() {
  loadStore();
  var b = topBest();
  if (note) note.textContent = b > 0 ? 'Tap along to the band. Best: ' + b + '%' : 'Take a bow whenever you fancy it.';
}
function addButton() {
  var hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('.lwss-launch')) return;
  var box = el('div', 'lwss-launch');
  var btn = el('button', 'lwss-open', NOTE_SVG + '<span>' + GAME + '</span>'); btn.type = 'button';
  btn.setAttribute('aria-label', GAME + ', a rhythm game. Opens full screen.');
  btn.addEventListener('click', open);
  note = el('p', 'lwss-note');
  box.appendChild(btn); box.appendChild(note);
  hero.appendChild(box);
  updateNote();
}
if (WITH_BUTTON) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addButton);
  else addButton();
}

window.LWShowstopper = { open: open, close: close };

/* ---------- test hook (only with ?lwtest in the address) ---------- */
var hook = { autoOn: false };
if (TEST) {
  window.__lwShow = {
    info: function () {
      var o = { state: state, plays: store.plays, best: JSON.parse(JSON.stringify(store.best)), sound: store.sound, speed: store.speed, nudge: store.nudge, RM: RM,
        ac: AC ? AC.state : 'none' };
      if (!G) return o;
      o.song = G.song.id; o.mode = G.mode; o.paused = G.paused; o.useAC = G.useAC; o.gT = gameTime(); o.end = G.data.end;
      o.total = G.notes.length; o.judged = G.judged; o.counts = JSON.parse(JSON.stringify(G.counts)); o.combo = G.combo; o.maxCombo = G.maxCombo;
      o.acc = G.judged ? G.score / G.judged : null; o.result = G.result || null; o.auto = G.auto; o.evi = G.evi; o.events = G.data.ev.length;
      return o;
    },
    auto: function (on) { hook.autoOn = !!on; if (G) G.auto = !!on; return hook.autoOn; },
    set: function (o) { for (var k in o) if (hasOwn(T, k)) T[k] = o[k]; return T; },
    start: function (id, mode) { if (state === 'closed') open(); startSong(id, mode || store.speed); return true; },
    pause: function () { doPause(false); }, resume: function () { resume(); },
    press: function (lane) { press(lane, 'hook'); }, release: function (lane) { release(lane, 'hook'); },
    nextNote: function () {
      if (!G) return null;
      var t = gameTime();
      for (var i = G.ni; i < G.notes.length; i++) { var n = G.notes[i]; if (n.state === 0 && n.t > t + 0.02) return { lane: n.lane, t: n.t, inMs: (n.t - t) * 1000, len: n.len, id: n.id }; }
      return null;
    },
    laneClient: function (lane) { var r = ui.canvas.getBoundingClientRect(); return { x: r.left + laneX(lane), y: r.top + L.hitY }; },
    layout: function () { return L ? { W: L.W, H: L.H, top: L.top, hitY: L.hitY, lipY: L.lipY, lx: L.lx, lw: L.lw, nr: L.nr } : null; },
    songs: function () {
      var out = {};
      SONGS.forEach(function (s) {
        ['relaxed', 'full'].forEach(function (m) {
          var d = buildSong(s, m), holds = 0, lanes = [0, 0, 0, 0];
          d.notes.forEach(function (n) { if (n.len) holds++; lanes[n.lane]++; });
          out[s.id + ':' + m] = { notes: d.notes.length, holds: holds, lanes: lanes, dur: d.end, bars: d.bars, events: d.ev.length, problems: d.problems };
        });
      });
      return out;
    },
    level: function (ms) {
      /* listens to the mix for a moment: { rms, peak } */
      if (!AC || !master) return Promise.resolve(null);
      var an = AC.createAnalyser(); an.fftSize = 2048; master.connect(an);
      var buf = new Float32Array(an.fftSize), sum = 0, n = 0, peak = 0;
      return new Promise(function (res) {
        var iv = setInterval(function () {
          an.getFloatTimeDomainData(buf);
          for (var i = 0; i < buf.length; i++) { sum += buf[i] * buf[i]; n++; peak = Math.max(peak, Math.abs(buf[i])); }
        }, 40);
        setTimeout(function () { clearInterval(iv); try { master.disconnect(an); } catch (e) {} res({ rms: Math.sqrt(sum / Math.max(1, n)), peak: peak }); }, ms || 1500);
      });
    },
    reducedMotion: function () { return RM; }
  };
}
})();
