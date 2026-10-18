/* ==========================================================
   HK's Tackle Ops HQ - Lakeside Breach is earned
   Puts Lakeside Breach behind the same earning, break and cooldown
   as the other HQ games (numbers in /data/hqbreak.js). While this
   is on the page, crossy.js skips its own runs and question gate.
   Home page only, after /hk/crossy.js and /data/hqbreak.js.
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(!window.HQBreak || !window.HKCrossy) return;
window.HKGate = window.HQBreak.wrap({
  prefix: "b5.hk.",
  title: "Lakeside Breach",
  icon: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M7 21c4-6 13-7 19-1l6-5v12l-6-5c-6 6-15 5-19-1z" fill="#58f2a5"/><circle cx="13" cy="20" r="1.8" fill="#0b1622"/><path d="M6 33c4-2 8-2 12 0s8 2 12 0" fill="none" stroke="#3fa7d6" stroke-width="2.5" stroke-linecap="round"/><path d="M28 6v6M25 9h6" stroke="#ff7a1a" stroke-width="2.5" stroke-linecap="round"/></svg>',
  theme: { card: "#fffaf0", cardInk: "#15281c", accent: "#ff7a1a", accent2: "#58f2a5", font: 'var(--display,"Black Ops One",Arial,sans-serif)' },
  words: {
    earn: "Anything counts, even Show me.",
    coolingTitle: "Reeling in",
    cooling: "The squad is restocking bait. Have a crack at something else in the meantime.",
    coolingShort: "Restocking.",
    done: "Rods down."
  },
  open: function(){ window.HKCrossy.open(); },
  close: function(){ window.HKCrossy.close(); },
  openSel: ".hkgame"
});
})();
