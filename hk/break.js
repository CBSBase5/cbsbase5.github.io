/* ==========================================================
   HK's Overgrown HQ - Overgrown Hop is earned
   Puts Overgrown Hop behind the same earning, break and cooldown
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
  title: "Overgrown Hop",
  icon: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 30c0-9 6-15 14-15 5 0 9 3 10 7l-4 1c-1-2-3-4-6-4-6 0-10 5-10 11z" fill="#5ccf52"/><circle cx="27" cy="13" r="6" fill="#5ccf52"/><circle cx="29" cy="12" r="1.6" fill="#15281c"/><path d="M12 30v5M20 30v5" stroke="#2c8f43" stroke-width="3"/></svg>',
  theme: { card: "#fffaf0", cardInk: "#15281c", accent: "#5ccf52", accent2: "#ff8a3a", font: 'var(--display,"Bungee",Arial,sans-serif)' },
  words: {
    earn: "Anything counts, even Show me.",
    coolingTitle: "The dino is napping",
    cooling: "Have a crack at something else in the meantime.",
    coolingShort: "Dino napping.",
    done: "The dino needs a nap."
  },
  open: function(){ window.HKCrossy.open(); },
  close: function(){ window.HKCrossy.close(); },
  openSel: ".hkgame"
});
})();
