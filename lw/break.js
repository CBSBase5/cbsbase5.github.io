/* ==========================================================
   LW's Skills HQ - Showstopper is earned
   Puts Showstopper behind the same earning, break and cooldown
   as the other HQ games (numbers in /data/hqbreak.js).
   Home page only, after /lw/showstopper.js and /data/hqbreak.js.
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(!window.HQBreak || !window.LWShowstopper) return;
window.LWGate = window.HQBreak.wrap({
  prefix: "b5.lw.",
  title: "Showstopper",
  icon: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 5l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill="#ffc247" stroke="#2a0f14" stroke-width="1.5"/></svg>',
  theme: { card: "#fff8ec", cardInk: "#2a0f14", accent: "#ffc247", accent2: "#e0475b", font: 'var(--display,Arial,sans-serif)' },
  words: {
    earn: "Anything counts, even Show me.",
    coolingTitle: "Interval",
    cooling: "The band is taking five. Have a crack at something else in the meantime.",
    coolingShort: "Interval.",
    done: "Curtain down."
  },
  open: function(){ window.LWShowstopper.open(); },
  close: function(){ window.LWShowstopper.close(); },
  openSel: ".lwss"
});
})();
